/**
 * The BTL Controller Object is a javascript object that handles all BTL-related
 * data and manages its associated events.  This includes indexing all products
 * and categories on a BTL page, making appropriate AJAX calls, and quickly sorting
 * through the data to return pages of products as requested.
 *
 * BtlController uses mixed terminology to bridge the gap between backend and frontend.
 * In the backend, a "Product" is an article that contains a "slice" for each color,
 * and each slice contains an SKU for every size in which it's available.  But on the
 * front end, the BTL feature treats each slice as a separate and individual product.
 *
 * So, to avoid confusion, all private variables and methods in this object are named
 * with backend terminology; products that contain slices that contain SKUs.  However,
 * the public methods ("selectProd", "addProductSelectListener", etc) use the word
 * "product" to refer to a slice, as the frontend would use it.  Thus, the 
 * BtlController bridges the terminology between the back and front end as well as 
 * the data.
 *
 * Because BTL refers to individual slices as products, the BtlController must assign
 * a unique identifier to each.  Therefore, individual slices can be referenced with
 * "PID:CID", where PID is the Product ID and CID is the Color ID (or slice ID).  This
 * is referred to as the "Full ID" (fullId) in this documentation.
 *
 * To use BtlController properly, instantiate the object and attach all necessary event
 * listeners using the add__________Listener functions BEFORE calling init() with the
 * initial page data.  The init() function will trigger a range of events, from setting
 * up the categories to autoselecting default items for the model.
 *
 * @param pageSize The number of products that the BTL page is able to list at one time.
 * @requires Either jQuery OR Prototype with the "peac.proto.ajax.extension.js" file
 * 		loaded for AJAX calls.
 */
var BtlController = function(pageSize) {

	// CONFIG: Change this to the URL to which AJAX request should be sent
	/* const */ var AJAX_SUBCAT_URL = "/buildthelook/js/subcategoryData.jsp";
	/* const */ var AJAX_SUBMIT_URL = "/cart/addCartItems";

	// Ajax properties
	/* const */ var AJAX_UNSENT = 0;

	// Workaround for bad scope handling
	/* const */ var _this = this;

	// The model type to display.  Either MALE, FEMALE, or UNKNOWN.
	var modelType = "UNKNOWN";

	// The category ID to be selected on initialization. Set by ingestCats().
	var defaultCatId = false;

	// An associative array of full id -> Slice object
	var sliceIndex = new Object();

	// An associative array of cat id -> Category object
	var catIndex = new Object();

	// An associative array of cat id -> Array of slices
	var catSlices = new Object();
	
	// An associative array of cat id -> true/false if first product should be on model
	var catProdOnModel = new Object();

	// An associative array of sku id -> Slice object
	var skuSlice = new Object();
	
	// An associative array of z-index -> selected slices
	var zidSelectedSlices = new Object();

	// Product arrays
	var allSlices = new Array();
	var selectedSlices = new Array();

	// The last calculated total price of all selected products.
	var curPrice = 0;

	// The last calculated total price of all selected SKUs.
	var curCheckoutPrice = 0;

	// The currently executing XmlHTTPRequest.
	var curAjax = { readyState: AJAX_UNSENT };

	// The latest timer to trigger the AJAX Timeout event
	var subcatTimer = 0;
	var submitTimer = 0;

	// The last AJAX request ID
	var curReqId = 0;

	// Event listeners
	var eventListeners = new Object();

	/**
	 * PUBLIC:
	 * Formats any string or float into a currency string.
	 *
	 * @param price The value to be formatted as currency.
	 * @return The price-formatted string
	 */
	this.formatPrice = function(price) {
		// Format the price
		var fPrice = parseFloat(price).toString();
		if (fPrice.indexOf('.') === -1)
			fPrice += ".00";
		else if (fPrice.indexOf('.') === fPrice.length - 2)
			fPrice += "0";
		return fPrice;
	}

	/**
	 * PRIVATE:
	 * Ingests a properly formatted listing of products. The backend
	 * returns products as large objects containing slices, so this method
	 * inverts the connection, turning the backend's products into an
	 * array of slices, each with a link to their common product data. This
	 * common information is stored in the prodInfo attribute.
	 *
	 * @param pData A JSON listing of products and their attributes.
	 * @param selectDefaults OPTIONAL: true to auto-select the first
	 * 		product to be added in each category; false otherwise.
	 * 		Default: false.
	 */	
	function ingestProds(pData, selectDefaults) {
		// Loop through the products
		for (var i = 0; i < pData.length; i++) {
		    
		    if (typeof(pData[i]) === 'undefined')
		        continue;
		    
		    // Increment this category's numProds if it's new
			try {
                if (catIndex[pData[i].catid] && 
                        !catIndex[pData[i].catid].prodAssoc[pData[i].id]) {
                    catIndex[pData[i].catid].prodAssoc[pData[i].id] = true;
                    catIndex[pData[i].catid].numProds++;
                }
            } catch(err) {}
			
			// Remove category tab if no product slices
			/*if (pData[i].slices.length == 0) {
			    $(pData[i].catid.toString()).remove();
			}*/

			// Loop through the slices
			for (var q = 0; q < pData[i].slices.length; q++) {
				var curSlice = pData[i].slices[q];

				// Attach the slice's fullId
				curSlice.fullId = pData[i].id + ":" + curSlice.cid;

				// Only continue if this slice is new
				if (!sliceIndex[curSlice.fullId]) {

					// This product has no SKU selected and has not been added to
					// the cart.
					curSlice.selectedSkuId = false;
					curSlice.carted = false;

					// Find the price ranges and make sure the prices are floats.
					var curMax = -1;
					var curMin = -1;
					var wasMax = -1;
					var wasMin = -1;
					for (var r = 0; r < curSlice.skus.length; r++) {
						curSlice.skus[r].curPrice = parseFloat(curSlice.skus[r].curPrice);
						if (curSlice.skus[r].curPrice > curMax)
							curMax = curSlice.skus[r].curPrice;
						if (curSlice.skus[r].curPrice < curMin || curMin == -1)
							curMin = curSlice.skus[r].curPrice;
						if (curSlice.skus[r].wasPrice) {
							curSlice.skus[r].wasPrice = 
								parseFloat(curSlice.skus[r].wasPrice);
							if (curSlice.skus[r].wasPrice > wasMax)
								wasMax = curSlice.skus[r].wasPrice;
							if (curSlice.skus[r].wasPrice < wasMin || wasMin == -1)
								wasMin = curSlice.skus[r].wasPrice;
						}
					}

					// Collect price data
					var sale = false;
					if (wasMax != -1 && wasMin != -1 && 
							(curMax != wasMax || curMin != wasMin))
						sale = true;
					var wasRanged = wasMax != wasMin;
					var curRanged = curMax != curMin;

					// Attach price data to the slice
					curSlice.curPriceMax = _this.formatPrice(curMax);
					curSlice.curPriceMin = _this.formatPrice(curMin);
					curSlice.wasPriceMax = (wasMax === -1 ? false : 
						_this.formatPrice(wasMax));
					curSlice.wasPriceMin = (wasMin === -1 ? false : 
						_this.formatPrice(wasMin));
					curSlice.curPriceRanged = curRanged;
					curSlice.wasPriceRanged = wasRanged;
					curSlice.onSale = sale;

					// Attach the slice to the slice index and prod array
					sliceIndex[curSlice.fullId] = curSlice;
					allSlices.push(curSlice);

					// Reverse the PID --> Slice assocation by deleting the slice
					// from the product and adding the product to the slice.
					delete pData[i].slices[q];
					curSlice.prodInfo = pData[i];

					// Link the SKU and PID
					for (var r = 0; r < curSlice.skus.length; r++)
						skuSlice[curSlice.skus[r].sku] = curSlice;

					// Populate category slice tree
					var firstInCat = false;
					if (!catSlices[pData[i].catid]) {
						catSlices[pData[i].catid] = new Array();
						firstInCat = true;
					}
					catSlices[pData[i].catid].push(curSlice);

					// Select it if we should and if no product with same index is selected yet
					if (selectDefaults 
					        && firstInCat 
					        && !zidSelectedSlices[sliceIndex[curSlice.fullId].prodInfo.zid] 
					        && catProdOnModel[pData[i].catid])
						_this.selectProd(curSlice.fullId);
				}
			}

			// Delete the pid-level slice reference
			delete pData[i].slices;
		}
	}

	/**
	 * PRIVATE:
	 * Ingests a properly formatted block of categories and their
	 * associated parameters. Adds a set of properties to each, aiding
	 * in tracking the product stats.
	 *
	 * @param cData A JSON listing of categories and their attributes.
	 * @param assumeFirstFull If true, the method will assume that the
	 * 		first category supplied in cData is already full (meaning,
	 * 		the products for it will not need to be retrieved via AJAX).
	 * 		this saves one AJAX call.  When in doubt, set to false.
	 */
	function ingestCats(cData, assumeFirstFull) {
		// Loop through the categories
		for (var i = 0; i < cData.length; i++) {
			// Only process this category if it's new
			if (!catIndex[cData[i].id]) {
				// Unless we're assuming this category's products are already
				// loaded, we need to do an AJAX call for them later.
				if (i === 0 && assumeFirstFull)
					cData[i].didAjax = true;
				else
					cData[i].didAjax = false;

				// Categories are empty when first added
				cData[i].numProds = 0;

				// A simple associative array of PID -> boolean for quick
				// checking to see if the PID already exists in this category.
				// Aids in keeping an accurate value for numProds.
				cData[i].prodAssoc = new Object();

				// Populate arrays
				catIndex[cData[i].id] = cData[i];
				catProdOnModel[cData[i].id] = cData[i].defaultProductOnModel;

				// Shout it from the hilltops
				_this.notifyListeners('categoryAdd', cData[i].id, cData[i].name);

				// If we don't have a default yet, set it
				if (!defaultCatId)
					defaultCatId = cData[i].id;
			}
		}
	}

	/**
	 * PRIVATE:
	 * Calculates the current outfit's total price by looping through the
	 * selected products.  If the price has changed since the last calculation,
	 * the priceChangeListeners are notified.
	 *
	 * Note that the price is calculated based on the minimum current price out
	 * of all an individual product's SKUs.  The price may vary if different sizes
	 * with separate prices are chosen.
	 *
	 * @return true if the price has changed; false otherwise.
	 */
	function updatePrice() {
		var price = 0;
		for (zid in zidSelectedSlices) {
			if (zidSelectedSlices.hasOwnProperty(zid))
				price += parseFloat(zidSelectedSlices[zid].curPriceMin);
		}
		
		if (price != curPrice) {
			curPrice = price;
			_this.notifyListeners('priceChange', _this.formatPrice(price));
			return true;
		}
		return false;
	}

	/**
	 * PRIVATE:
	 * Calculates the total price of all selected SKUs for the currently
	 * selected products, and fires the event to checkoutPriceChangeListeners
	 * if it's changed from the last calculation.
	 *
	 * @return true if the price has changed; false otherwise.
	 */
	function updateCheckoutPrice() {
		var price = 0;
		for (var i = 0; i < selectedSlices.length; i++) {
			if (selectedSlices[i].selectedSkuId !== false) {
				// It has a selected SKU.  Find that sku.
				for (var q = 0; q < selectedSlices[i].skus.length; q++) {
					if (selectedSlices[i].skus[q].sku ==
							selectedSlices[i].selectedSkuId) {
						price += parseFloat(selectedSlices[i].skus[q].curPrice);
						break;
					}
				}
			}
		}
		
		if (price != curCheckoutPrice) {
			curCheckoutPrice = price;
			_this.notifyListeners('checkoutPriceChange', _this.formatPrice(price));
			return true;
		}
		return false;
	}

	/**
	 * PRIVATE:
	 * Sends the specified page of products to the pageChangeListeners.
	 * Note that this method does little error-checking and should never be
	 * called directly.  Instead, use the changePage() method.
	 *
	 * @param catId The category ID for which the page should be retrieved.
	 * @param pageNum The page number for which the product listing should be retrieved.
	 * @return true if products were found at the specified category and page; 
	 * 		false otherwise.
	 */
	function sendPage(catId, pageNum) {
		// Create the product array to be sent
		var pageData = new Array();
		var startNum = (pageNum - 1) * pageSize;
		for (var i = 0; i < pageSize; i++) {
            try {
                if (startNum + i < catSlices[catId].length && catSlices[catId][startNum + i])
                    pageData.push(catSlices[catId][startNum + i]);
            } catch(err) {/*no value in catSlices[]*/}
		}

		// Only process further if we have results
		if (!pageData.length > 0) {
		    alert("No products currently available for this category. Additional products coming soon!");
		    return false;
		}
		
        // Calculate how many pages are in this category
        var numPages = parseInt(catSlices[catId].length / pageSize);
        numPages += catSlices[catId].length % pageSize == 0 ? 0 : 1;

        // Notify the listeners
        _this.notifyListeners('pageChange', catId, numPages, pageNum, pageData);
        return true;
		
	}

	/**
	 * PRIVATE:
	 * Retrieves the specified category's products via an AJAX call, firing
	 * appropriate AJAX events.  Upon a successful product ingestion, the
	 * requested page of products from the category is sent to the page change
	 * listeners.
	 *
	 * @requires Either jQuery or the peac.proto-ajax-extension.js Prototype
	 * 		extension to emulate jQuery-style AJAX calls.
	 * @param catId The category for which to retreive the products
	 * @param pageNum The number of the page of products to send to the
	 * 		listeners after the category's data has been retrieved.
	 */
	function ajaxSendPage(catId, pageNum) {
		// If there's a currently executing Ajax request, cancel it.
		// This call should also kill any currently running timer.
		if (curAjax.readyState != AJAX_UNSENT) {
			curAjax.aborting = true;
			curAjax.abort();
		}

		// Notify the listeners
		_this.notifyListeners('categoryAjaxStart', catId);

		// Start the timer
		subcatTimer = setTimeout("_this.notifyListeners('categoryAjaxTimeout', " +
			catId + ")", 30000);

		// Make the call
		curAjax = $.ajax({
			cache: true,
			data: {
				reqId: curReqId,
				categoryId: catId
			},
			dataType: "json",
			error: function (XMLHttpRequest, textStatus, errorThrown) {
				if (!this.aborting)
					_this.notifyListeners('categoryAjaxError', textStatus);
			},
			success: function (data, textStatus) {
				ingestProds(data.prods, false);
				catIndex[catId].didAjax = true;
				if (data.reqId == curReqId)
					sendPage(catId, pageNum);
			},
			complete: function (XMLHttpRequest, textStatus) {
				clearTimeout(subcatTimer);
			},
			type: "GET",
			url: AJAX_SUBCAT_URL
		});
	}

	/**
	 * PUBLIC:
	 * Selects a registered product by PID:CID and triggers approprate event calls.
	 *
	 * @param fullId The full ID of the selected product, in the format "PID:CID".
	 * @return true if the specified product exists and can be selected; false if
	 * 		it does not exist or is already selected.
	 */
	this.selectProd = function(fullId) {
		// Does this product/slice exist?
		if (!sliceIndex[fullId])
			return false;

		// Is it already selected?
		if (zidSelectedSlices[sliceIndex[fullId].prodInfo.zid] &&
				zidSelectedSlices[sliceIndex[fullId].prodInfo.zid].fullId == fullId)
			return false;

		// Auto-deselect any prod with a conflicting z-index
		if (zidSelectedSlices[sliceIndex[fullId].prodInfo.zid])
			this.deselectProd(zidSelectedSlices[sliceIndex[fullId].prodInfo.zid].fullId);
		
		// Add this product to the zid->slice associative array and
		// to the selected products array
		zidSelectedSlices[sliceIndex[fullId].prodInfo.zid] = sliceIndex[fullId];
		selectedSlices.push(sliceIndex[fullId]);

		// Calculate the new price
		updatePrice();
		updateCheckoutPrice();

		// Shout it from the hilltops
		_this.notifyListeners('productSelect', sliceIndex[fullId]);
		return true;
	}

	/**
	 * PUBLIC:
	 * Deselects a registered product by PID/CID and triggers approprate event calls.
	 *
	 * Note that this function does NOT clear the selected sku, if there is one.
	 * For no SKU to be selected if the product is selected again, it must be
	 * cleared with the clearSelectedSku(fullId) method manually.
	 *
	 * @param fullId The full ID of the deselected product, in the format "PID:CID".
	 * @return true if the specified product exists and can be deselected; false if
	 * 		it does not exist or isn't selected.
	 */
	this.deselectProd = function(fullId) {
		// Does this product exist?
		if (!sliceIndex[fullId])
			return false;

		// Is it selected?
		if (zidSelectedSlices[sliceIndex[fullId].prodInfo.zid] &&
				zidSelectedSlices[sliceIndex[fullId].prodInfo.zid].fullId == fullId) {
			// Delete it from the zid->slice associative array and
			// the selected products array
			delete zidSelectedSlices[sliceIndex[fullId].prodInfo.zid];
			for (var i = 0; i < selectedSlices.length; i++) {
				if (selectedSlices[i].fullId == fullId) {
					selectedSlices[i].carted = false;
					selectedSlices.splice(i, 1);
					break;
				}
			}

			// Update the price
			updatePrice();
			updateCheckoutPrice();

			// Shout it from the hilltops
			_this.notifyListeners('productDeselect', sliceIndex[fullId]);
			return true;
		}
		return false;
	}

	/**
	 * PUBLIC:
	 * Retrieves the prod with the specified full ID.
	 *
	 * @param fullId The Full ID of the requested prod
	 * @return The requested prod, or false if no prod with the
	 * 		supplied fullId was found.
	 */
	this.getProd = function(fullId) {
		if (sliceIndex[fullId])
			return sliceIndex[fullId];
		return false;
	}

	/**
	 * PUBLIC:
	 * Gets an array of all selected products with selected SKUs.
	 * The array returned is created at the time of the method call and will
	 * not automatically be updated when products or skus are selected or
	 * deselected.
	 *
	 * @return An array of selected products with selected SKUs.
	 */
	this.getCartableProds = function() {
		var cartable = new Array();
		for (var i = 0; i < selectedSlices.length; i++) {
			if (selectedSlices[i].selectedSkuId !== false &&
					selectedSlices[i].carted === false)
				cartable.push(selectedSlices[i]);
		}
		return cartable;
	}

	/**
	 * PUBLIC:
	 * Selects a specific SKU for a product.  Normally, this product will
	 * be currently selected, but this method may be called for any
	 * product's SKU at any time.
	 *
	 * @param skuId The SKU number to select.  This function will automatically
	 * 		determine to which product the SKU belongs.
	 * @return true if the SKU was found and successfully selected; false
	 * 		otherwise.
	 */
	this.selectSku = function(skuId) {
		// Do we know of this SKU?
		if (skuSlice[skuId]) {
			// Select it
			skuSlice[skuId].selectedSkuId = skuId;
			skuSlice[skuId].carted = false;
			_this.notifyListeners('skuSelect', skuSlice[skuId].fullId, skuId);
			updateCheckoutPrice();
			return true;
		}
		return false;
	}

	/**
	 * PUBLIC:
	 * Deselects any selected SKU for the given product.  Normally, this product
	 * will be currently selected, but this method may be called for any
	 * product at any time.
	 *
	 * @param fullId The full ID of the product for which to clear the SKU
	 * 		selection.
	 * @return true if a product exists with the given fullId and any selected
	 *  	SKU has been cleared; false otherwise.
	 */
	this.clearSelectedSku = function(fullId) {
		// Does this product exist?
		if (sliceIndex[fullId]) {
			sliceIndex[fullId].selectedSkuId = false;
			sliceIndex[fullId].carted = false;
			_this.notifyListeners('skuDeselect', fullId);
			updateCheckoutPrice();
			return true;
		}
		return false;
	}

	/**
	 * PUBLIC:
	 * Checks to see whether a certain product is selected or not.
	 *
	 * @param fullId The full ID representing the product to check for.
	 */
	this.isSelected = function(fullId) {
	 	if (zidSelectedSlices[sliceIndex[fullId].prodInfo.zid] &&
				zidSelectedSlices[sliceIndex[fullId].prodInfo.zid].fullId == fullId)
			return true;
		return false;
	}

	/**
	 * PUBLIC:
	 * Notifies the BtlController that the user has changed to a different
	 * page of products.  Generates all necessary events for the event listeners,
	 * as well as an AJAX call if the BtlController doesn't have the data
	 * necessary to fill the request.  If an AJAX call must be made, the page
	 * will be sent to the listeners upon successful completion.  Otherwise,
	 * the error listeners will be notified.
	 *
	 * @param catId The ID of the category for which to retrieve get the page.
	 * @param pageNum The requested page number.
	 * @return true if the BtlController has the page data and sends it without
	 * 		issuing an AJAX request; false if an AJAX request had to be issued;
	 * 		undefined if the specified category does not exist, or if the requested
	 *		page does not exist for that category.
	 */
	this.changePage = function(catId, pageNum) {
		// Assert that the category exists
		if (!catIndex[catId])
			return undefined;
			
		// Advance request id
		curReqId++;

		// Determine if we have the products for the requested category.
		// Currently, we retrieve an entire category's products at once,
		// So we should only trigger an AJAX call if one has not already
		// been completed, and if it has one or fewer products.
		if (!catIndex[catId].didAjax && catIndex[catId].numProds <= 1) {
			ajaxSendPage(catId, pageNum);
			return false;
		}

		// We have the page, so send and return true if it's in range,
		// undefined if it's out of range.
		return (sendPage(catId, pageNum) ? true : undefined);
	}

	/**
	 * PUBLIC:
	 * This function completes the following tasks, in order:
	 * 1. Deselects every selected SKU for every product
	 * 2. Deselects every selected product
	 * 3. Notifies lookResetListeners of the event
	 *
	 * Note that steps one and two are completed by using the clearSelectedSku()
	 * and deselectProd() methods, respectively.  Therefore, all appropriate calls
	 * to the listeners of those events will be made.
	 */
	this.resetLook = function() {
		// Loop through all products and clear all of their selected SKUS
		for (var i = 0; i < allSlices.length; i++)
			_this.clearSelectedSku(allSlices[i].fullId);

		// Get an array of selected fullIds, and deselect each
		var selIds = new Array();
		for (var i = 0; i < selectedSlices.length; i++)
			selIds.push(selectedSlices[i].fullId);
		for (var i = 0; i < selIds.length; i++)
			_this.deselectProd(selIds[i]);

		// Shout it from the hilltops
		_this.notifyListeners('lookReset');
	}

	/**
	 * PUBLIC:
	 * Sends an AJAX request to add selected SKUs to the cart.
	 *
	 * This method will loop through all currently selected products
	 * to find SKUs that were selected with the addSkus() method. These
	 * are the SKUs that will be added.  The only way to prevent a product
	 * from being added to the cart is by clearing its selected SKU with
	 * the clearSelectedSku(fullId) method.  The only exception is that a
	 * product will not be added to the cart if no SKU select/deselect has
	 * happened since the last time it was attempted to be added to the cart.
	 */
	this.addSkusToCart = function() {
		// Build the query string and set the carted flag
		var itemIndex = 0;
		var query = "";
		for (var i = 0; i < selectedSlices.length; i++) {
			if (selectedSlices[i].selectedSkuId !== false &&
					selectedSlices[i].carted === false) {
				query += "cartItemMap['ci" + itemIndex + "'].productId=";
				query += selectedSlices[i].prodInfo.id + "&";
				query += "cartItemMap['ci" + itemIndex + "'].skuId=";
				query += selectedSlices[i].selectedSkuId + "&";
				query += "cartItemMap['ci" + itemIndex + "'].quantity=1&";
				query += "cartItemMap['ci" + itemIndex + "'].include=true&";
				selectedSlices[i].carted = true;
				itemIndex++;
			}
		}
		if (query !== "")
			query = query.substr(0, query.length - 1);

		// Notify the listeners
		_this.notifyListeners('submitAjaxStart');

		// Start the timer
		submitTimer = setTimeout("_this.notifyListeners('submitAjaxTimeout')", 30000);

		// Send the AJAX call
		$.ajax({
			cache: true,
			data: query,
			dataType: "json",
			error: function (XMLHttpRequest, textStatus, errorThrown) {
				// Clear the carted flags
				for (var i = 0; i < selectedSlices.length; i++)
					selectedSlices[i].carted = false;

				// Notify if it wasn't on purpose
				if (!this.aborting)
					_this.notifyListeners('submitAjaxError', textStatus);
			},
			success: function (data, textStatus) {
				// Assure that data is an array
				if (!(data instanceof Array))
					data = new Array();

				// Attach the fullId to each error
				for (var i = 0; i < data.length; i++)
					data[i].fullId = skuSlice[data[i].skuId].fullId;
				_this.notifyListeners('submitResult', data);
			},
			complete: function (XMLHttpRequest, textStatus) {
				clearTimeout(submitTimer);
			},
			type: "GET",
			url: AJAX_SUBMIT_URL
		});
	}

	/**
	 * PUBLIC:
	 * Initializes the BtlController with the JSON block included in
	 * The initial page load.  The supplied block should contain both
	 * a "cats" array and a "prods" array.
	 *
	 * This method should be called AFTER the event listeners are attached.
	 * Otherwise, they will not be notified of the default products, categories,
	 * or other page-initializing data.
	 *
	 * @param initData The JSON block supplied in the initial pageload.
	 */
	this.init = function(initData) {
		// Glean the model type
		if (initData.modelType &&
				(initData.modelType === "FEMALE" || initData.modelType === "MALE" || 
			      initData.modelType === "GIRL" ||
				  initData.modelType === "BOY" ||
				  initData.modelType === "BABY" ))
				 
			modelType = initData.modelType;

		// Push the model to the listeners
		_this.notifyListeners('modelTypeChange', modelType);

		// Ingest the data
		ingestCats(initData.cats, true);
		ingestProds(initData.prods, true);

		// Select the default category and load the first page
		if (defaultCatId)
			this.changePage(defaultCatId, 1);
	}

	/**
	 * PUBLIC:
	 * Adds a listener for the specified event.  The callback function will be
	 * executed whenever the event is fired, within the context specified.  For
	 * example, if a certain div is specified for the context, that div will be
	 * set to the 'this' keyword within the callback function.
	 *
	 * The callback function will be called with a set of parameters specific to the
	 * event being observed.  See the documentation of all th event types below to
	 * find the arguments for each callback function.
	 *
	 * The following events are implemented in BtlController:
	 *
	 * ------------------------------------------------------------------------
	 *
	 * EVENT NAME: productSelect
	 * FIRES WHEN: A product is selected.
	 * CALLBACK ARGUMENTS:
	 * 	prod: The slice object that's been selected
	 *
	 * ------------------------------------------------------------------------
	 *
	 * EVENT NAME: productDeselect
	 * FIRES WHEN: A product is deselected.
	 * CALLBACK ARGUMENTS:
	 * 	prod: The slice object that's been deselected
	 *
	 * ------------------------------------------------------------------------
	 *
	 * EVENT NAME: categoryAdd
	 * FIRES WHEN: A category is added to this look.  Always fired before any
	 * 		products are added to this category.
	 * CALLBACK ARGUMENTS:
	 * 	catId: The unique ID of the category being added
	 * 	catName: The name of the category being added
	 *
	 * ------------------------------------------------------------------------
	 *
	 * EVENT NAME: pageChange
	 * FIRES WHEN: A page change has been triggered.
	 * CALLBACK ARGUMENTS:
	 * 	catId: The ID of the category for the page being changed to
	 * 	numPages: The number of pages in this category
	 * 	pageNum: The page number being changed to
	 * 	pageData: The product listing for the new page
	 *
	 * ------------------------------------------------------------------------
	 *
	 * EVENT NAME: priceChange
	 * FIRES WHEN: The total price for all selected products has changed
	 * CALLBACK ARGUMENTS:
	 * 	price: The updated selected product total price
	 *
	 * ------------------------------------------------------------------------
	 *
	 * EVENT NAME: checkoutPriceChange
	 * FIRES WHEN: The total price for all selected SKUs has changed
	 * CALLBACK ARGUMENTS:
	 * 	price: The updated SKU total price
	 *
	 * ------------------------------------------------------------------------
	 *
	 * EVENT NAME: categoryAjaxError
	 * FIRES WHEN: A category AJAX call does not complete successfully
	 * CALLBACK ARGUMENTS:
	 * 	errorMsg: A message describing the error encountered
	 *
	 * ------------------------------------------------------------------------
	 *
	 * EVENT NAME: categoryAjaxTimeout
	 * FIRES WHEN: A category AJAX call reaches 30 seconds without returning
	 * 		successfully.  Note that this does not indicate that the AJAX call was
	 * 		canceled.  If it happens to succeed in the future, the data is ingested
	 * 		and used -- but no events will be fired if a different category AJAX call
	 * 		is started.
	 * CALLBACK ARGUMENTS:
	 * 	catId: The ID of the category whose AJAX call timed out.
	 *
	 * ------------------------------------------------------------------------
	 *
	 * EVENT NAME: categoryAjaxStart
	 * FIRES WHEN: A category AJAX call has begun
	 * CALLBACK ARGUMENTS:
	 * 	catId: The ID of the category whose AJAX call has started.
	 *
	 * ------------------------------------------------------------------------
	 *
	 * EVENT NAME: submitAjaxError
	 * FIRES WHEN: The cart submission AJAX call does not complete successfully
	 * CALLBACK ARGUMENTS:
	 * 	errorMsg: A message describing the error encountered
	 *
	 * ------------------------------------------------------------------------
	 *
	 * EVENT NAME: submitAjaxTimeout
	 * FIRES WHEN: The cart submission AJAX call reaches 30 seconds without
	 * 		completing.  Note that this event does not indicate that the call has been
	 * 		canceled.  The AJAX call will stay active, trying for either a success or
	 * 		error.
	 * CALLBACK ARGUMENTS:
	 * 	none
	 *
	 * ------------------------------------------------------------------------
	 *
	 * EVENT NAME: submitAjaxStart
	 * FIRES WHEN: The cart submission AJAX call has started.
	 * CALLBACK ARGUMENTS:
	 * 	none
	 *
	 * ------------------------------------------------------------------------
	 *
	 * EVENT NAME: submitResult
	 * FIRES WHEN: The cart submission AJAX call has completed successfully on a
	 * 		technical level.  If there were any errors in adding the SKUs to the cart,
	 * 		those errors will be provided to the listeners of this event.
	 * CALLBACK ARGUMENTS:
	 * 	errors: An array of error objects, or an empty array if there were no errors.
	 * 		Each error object consists of the following four fields:
	 * 		fullId: The fullId of the product that failed to add
	 * 		skuId: The SKU number that failed to add
	 * 		code: The error code returned
	 * 		message: The human-readable error message for this SKU
	 *
	 * ------------------------------------------------------------------------
	 *
	 * EVENT NAME: skuSelect
	 * FIRES WHEN: An SKU is selected for a certain product.  The product itself may
	 * 		not be selected when this happens.
	 * CALLBACK ARGUMENTS:
	 * 	fullId: The full ID of the product whose SKU has been selected
	 * 	skuId: The ID of the SKU that was selected for the specified product
	 *
	 * ------------------------------------------------------------------------
	 *
	 * EVENT NAME: skuDeselect
	 * FIRES WHEN: A product's SKU selection is cleared.
	 * CALLBACK ARGUMENTS:
	 * 	fullId: The full ID of the product whose SKU selection has been cleared.
	 *
	 * ------------------------------------------------------------------------
	 *
	 * EVENT NAME: lookReset
	 * FIRES WHEN: A complete reset has been triggered.  This event fires AFTER all
	 * 		currently selected products and SKUs have been deselected and their events
	 * 		have been fired.
	 * CALLBACK ARGUMENTS:
	 * 	none
	 *
	 * ------------------------------------------------------------------------
	 *
	 * EVENT NAME: modelTypeChange
	 * FIRES WHEN: The type of model for this look has been set.  The three model
	 * 		types are "MALE", "FEMALE", and "UNKNOWN".
	 * CALLBACK ARGUMENTS:
	 * 	modelType: One of the above three strings describing the type of model this look
	 * 		is meant to be displayed on.
	 *
	 * ------------------------------------------------------------------------
	 *
	 * @param eventName The name of the event to be observed
	 * @param context An object to bind to the 'this' keyword for the duration of the
	 * 		callback function's execution.
	 * @param callback A function to execute whenever the specified event is fired.
	 */
	this.addListener = function(eventName, context, callback) {
		if (!eventListeners[eventName])
			eventListeners[eventName] = new Array();
		eventListeners[eventName].push({
			obj: context,
			func: callback
		});
	}

	/**
	 * PUBLIC:
	 * Notifies a set of listeners of an event, passing along any necessary data in
	 * additional arguments. This method is public solely so that timers are capable
	 * of calling it; in practice, it should never be called outside of this class.
	 *
	 * @param eventName The name of the event being fired
	 * @param ... additional parameters will be passed along, in order, as arguments
	 * 		to each listener's callback function
	 */
	this.notifyListeners = function(eventName) {
		if (eventListeners[eventName]) {
			for (var i = 0; i < eventListeners[eventName].length; i++) {
				eventListeners[eventName][i].func.apply(
					eventListeners[eventName][i].obj,
					Array.prototype.slice.call(arguments, 1)
				);
			}
		}
	}
}

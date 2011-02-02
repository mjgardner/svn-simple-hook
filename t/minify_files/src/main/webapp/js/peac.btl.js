/**
 * Btl links the frontend to the BtlController data handler, and
 * controls all frontend components.  It can be instantiated at any
 * time, but should not be initialized (by calling the init method)
 * until DOM ready.
 *
 * @requires Prototype
 * @requires BtlController
 * @requires Df.DynamicSlider, a custom Df module to handle an element slider
 * 		with changing or nonexistent contents.
 */
var Btl = function() {
	// Cart URL
	/* const */ var CART_URL = "/cart/shoppingcart.jsp";

	// The number of products on one page
	/* const */ var PRODS_PER_PAGE = 6;

	// The number of products to go on a single row in the product grid
	/* const */ var PRODS_PER_ROW = 3;

	// The maximum number of items to keep in history
	/* const */ var MAX_HISTORY_PRODS = 16;

	// The symbol for currency
	/* const */ var CURRENCY_SYMBOL = "&pound;";

	// The string to be inserted between ranged prices
	/* const */ var RANGE_SYMBOL = " - ";

	// Element templates
	var catTemplate = "";
	var prodTemplate = "";
	var selectedProdTemplate = "";
	var pastProdTemplate = "";
	var prodDetailTemplate = "";
	var buyLookTemplate = "";
	var placeholderTemplate = "";

	// Link to the data manager
	var controller = new BtlController(PRODS_PER_PAGE);

	// Internal counters
	var numCats = 0;

	// Associative array of fullId -> DIV layer on the model image
	var modelElements = new Object();

	// Tracker for the currently showing product info box
	var curInfoBox = false;
	
	// Internal counter for tabsets
	var tabsetCount = 1;
	
	// Currently selected tabset
	var curTabset = 1;

	/**
	 * PUBLIC:
	 * Initializes the BTL application and sets up the bindings. This method
	 * must be called AFTER the DOM ready event.
	 *
	 * @param initData The initial data set with which to instantiate the
	 * 		BtlController.
	 */
	this.init = function(initData) {
		acquireTemplates();
		createInterface();
		bindInterface();
		initController(initData);
	}

	/**
	 * PRIVATE:
	 * Acquires all templates stored on the page and removes them from
	 * the DOM.
	 */
	function acquireTemplates() {
		acquireTemplate('catTemplate', $('cat-template'));
		acquireTemplate('pagePreviousTemplate', $('page-previous-template'));
		acquireTemplate('pageNextTemplate', $('page-next-template'));
		acquireTemplate('prodTemplate', $('prod-template'));
		acquireTemplate('selectedProdTemplate', $('selected-prod-template'));
		acquireTemplate('pastProdTemplate', $('past-prod-template'));
		acquireTemplate('prodDetailTemplate', $('prod-detail-template'));
		acquireTemplate('buyProdTemplate', $('checkout-prod-template'));
		acquireTemplate('buyLookTemplate', $('buy-look-template'));
		acquireTemplate('placeholderTemplate', $('placeholder-template'));
	}

	/**
	 * PRIVATE:
	 * Acquires the contents of the given element and stores them in the
	 * specified private variable.  The element is then removed from the DOM.
	 *
	 * @param variable A string representing the variable name in which the
	 * 		element's contents should be stored.  The variable is put in the
	 * 		default private scope, so it must first be defined outside of this
	 * 		function in order to be accessed later.
	 * @param element The element to read into the variable and then remove from
	 * 		the DOM.  This should be a prototype-extended element.
	 * @return true if the template was successfully read and removed; false if
	 * 		the element is not a valid DOM element.
	 */
	function acquireTemplate(variable, element) {
		if (element) {
			eval(variable + " = element.innerHTML");
			element.remove();
			return true;
		}
		return false;
	}

	/**
	 * PRIVATE:
	 * Attaches elements to the DOM that must be placed by javascript.
	 */
	function createInterface() {
		// Get the body
		var body = document.getElementsByTagName('body')[0];

		// Internet Explorer sucks.
		/*if (Prototype.Browser.IE) {
			body.style.height = '100%';
			body.style.overflow = 'hidden';
			var html = document.getElementsByTagName('html')[0];
			html.style.height = '100%';
			html.style.overflow = 'hidden';
		} */

		// Attach the modal window overlay and the template to the body
		var overlay = new Element('div');
		overlay.addClassName('modal-dimmer');
		body.appendChild(overlay);
		var buyLook = new Element('div').update(buyLookTemplate);
		buyLook.addClassName('buy-look');
		body.appendChild(buyLook);

		// Activate the close and cancel buttons, as well
		// as clicking the dimmer.
		[
			buyLook.down('#checkout-cancel'),
			buyLook.down('#checkout-close'),
			overlay
		].each(function(elem) {
			elem.observe("click", function(event) {
				[overlay, buyLook].each(function(hideElem) {
					hideElem.setStyle({ display: "none" });
				});
				Event.stop(event);
			});
		});
	}

	/**
	 * PRIVATE:
	 * Binds all UI elements in the BTL app to their javascript triggers.
	 * Should not be called until after the product template has been
	 * acquired.
	 */
	function bindInterface() {
		bindCategoryTabs($('catnav'));
		bindProdPagination($('pagination-top'));
		bindProdPagination($('pagination-bottom'));
		bindSelectedProdList($('selected-prods'));
		bindProdHistory($('past-prods'));
		bindModel($('model'));
		bindPriceTotal($('total-val'));
		bindBuyOutfitButton($('buy-button'));
		bindProdList($('prod-list'));
		bindCheckoutList($('checkout-prod-list'));
		bindCheckoutPriceTotal($('checkout-total-val'));
		bindAddToCartButton($('checkout-add-to-cart'));
		bindReset($('start-over'));
	}

	/**
	 * PRIVATE:
	 * Initializes the controller, which effectively "starts" the BTL
	 * application and fires all the events to populate and select
	 * the product and category data.
	 *
	 * @param initData The initial data set with which to instantiate the
	 * 		BtlController.
	 */
	function initController(initData){
		controller.init(initData);
	}
	

	/**
	 * PRIVATE:
	 * Binds the category tabs to the BtlController and defines their
	 * functionality.
	 *
	 * @param tabList The Prototype UL element to contain the tabs.
	 */
	function bindCategoryTabs(tabList) {
	    var totalWidth = 0;
	    var prevTab;
		
	    controller.addListener('categoryAdd', tabList, function(catId, catName) {
			var newTab = new Element("li").update(catTemplate);
			var tabLink = newTab.down('.catname').update(catName);
			if (numCats == 0)
				newTab.addClassName('first');
			else {
				var curLast = tabList.down('.last');
				if (curLast)
					curLast.removeClassName('last');
				newTab.addClassName('last');
			}
			tabLink.observe("click", function(event) {
				controller.changePage(catId, 1);
				Event.stop(event);
			});
			newTab.writeAttribute("rel", catId);
			newTab.writeAttribute("id", catId);
			this.appendChild(newTab);
			numCats++;
			
			// calculate combined tab width and create additional tabsets if necessary to avoid 
			// space issues. Supports up to 3 tabsets.
            var maxTabsetWidth = 615;
			totalWidth += newTab.getWidth();
			
			if (totalWidth <= maxTabsetWidth) {
			    newTab.addClassName('tabset'+tabsetCount);
			} else {
                var count = parseInt(totalWidth/maxTabsetWidth)+1;
                if (count > tabsetCount)
                    startTabset(newTab, prevTab, count);
			} 
			
			newTab.addClassName('tabset'+tabsetCount);
			prevTab = newTab;
			
		});

		controller.addListener('pageChange', tabList,
			function(catId, numPages, pageNum, pageData) {
				var selAfter = false;
				var lastId = false;
				this.childElements().each(function(tab) {
					if (tab.hasClassName("selbefore"))
						tab.removeClassName("selbefore");
					if (selAfter) {
						if (!tab.hasClassName("selafter"))
							tab.addClassName("selafter");
						selAfter = false;
					}
					else if (!selAfter && tab.hasClassName("selafter"))
						tab.removeClassName("selafter");
					if (tab.readAttribute("rel") != catId && tab.hasClassName("selected")) {
						tab.removeClassName("selected");
						if (tab.hasClassName("selfirst"))
							tab.removeClassName("selfirst");
						if (tab.hasClassName("sellast"))
							tab.removeClassName("sellast");
					}
					else if (tab.readAttribute("rel") == catId) {
						selAfter = true;
						if (!tab.hasClassName("selected"))
							tab.addClassName("selected");
						if (tab.hasClassName("first"))
							tab.addClassName("selfirst");
						if (tab.hasClassName("last"))
							tab.addClassName("sellast");
						if (lastId !== false)
							tabList.down('li[rel="' + lastId + '"]').addClassName("selbefore");
					}
					lastId = tab.readAttribute("rel");
				});
			}
		);
	}
	
	/**
	 * Helper method to start a new tabset if there are too many to fit all in the first tabset
	 *
	 * @param newTab The new tab being created
	 * @param prevTab The previously created tab
	 * @param count Count of tabset to be created
	 */
	function startTabset(newTab, prevTab, count) {
        newTab.addClassName('first');
        prevTab.setStyle({marginRight: '45px'});
        tabsetCount++;
        
        // Set next/previous links once when second tabset is created
        if (count == 2) {
            setNextTabsetLink();
            setPrevTabsetLink();
        }
	}
	
	/**
	 * Helper method to set link to display next tabset
	 */
	function setNextTabsetLink() {
	    var nextTabsetLink = $('next-tabset');
        nextTabsetLink.setStyle({display: 'block'});
        nextTabsetLink.observe('click', function(e){
            $('catnav').className = 'show-tabset'+(++curTabset);
            
            /* Note: The following lines can be used to place the previous-tabset link relative to the first tab*/
            //var offset = $$('#catnav .first.tabset'+curTabset)[0].cumulativeOffset();
            //$('prev-tabset').setStyle({display: 'block', left: (offset.left-206)+'px'}); // config: adjust offset value
            $('prev-tabset').setStyle({display: 'block'}); 
            
            // Hide next link on last tabset
            if (curTabset == tabsetCount)
                nextTabsetLink.setStyle({display: 'none'});
            
            /* Note: The PEAC BTL design restricts the number of possible tabsets to 2, so we hide the next link on click. 
               Remove following line if your design allows for more than two tabsets and if both next and previous 
               link can be displayed at the same time. */
            nextTabsetLink.setStyle({display: 'none'});
        });
	}
	
	/**
	 * Helper method to set link to display previous tabset
	 */
	function setPrevTabsetLink() {
	    var prevTabsetLink = $('prev-tabset');
	    
	    prevTabsetLink.observe('click', function(e){
            $('catnav').className = 'show-tabset'+(--curTabset);
            $('next-tabset').setStyle({display: 'block'});
            
            if (curTabset == 1)
                prevTabsetLink.setStyle({display: 'none'});
        });
	}

	/**
	 * PRIVATE:
	 * Binds a product listing pagination UL to the BtlController's
	 * page change event, attaching the functionality for each link.
	 *
	 * Pagination will be displayed in groups of five, as demonstrated
	 * in the following examples:
	 * 1-5, 6, 7, 8, 9, 10, 11-15, 16-20
	 * 1, 2, 3, 4, 5, 6-10, 11-15, 16-20
	 * 1-5, 6-10, 11-15, 16, 17, 18, 19, 20
	 * 1, 2, 3, 4
	 * 1-5, 6, 7
	 * 1, 2, 3, 4, 5, 6-7
	 *
	 * Each comma-separated element in these examples will be an LI with
	 * an attached click event.
	 *
	 * @param pageList A prototype-extended UL element in which to place
	 * 		the pagination links.
	 */
	function bindProdPagination(pageList) {
		controller.addListener('pageChange', pageList,
			function(catId, numPages, pageNum, pageData) {
				// Configuration
				/* const */ var PAGES_PER_GROUP = 5;

				// Find the point at which we begin listing pages individually
				var indStart = parseInt((pageNum - 1) / PAGES_PER_GROUP) * PAGES_PER_GROUP + 1;

				// Loop through the pages, creating an array of groups
				var groups = new Array();
				for (var i = 1; i <= numPages; i += PAGES_PER_GROUP) {
					if (i == indStart) {
						for (var q = i;
								q <= Math.min(numPages, (i + PAGES_PER_GROUP - 1)); q++) {
							groups.push({
								text: q,
								load: q,
								selected: q == pageNum
							});
						}
					}
					else {
						groups.push({
							text: i + "-" + Math.min(numPages, i + PAGES_PER_GROUP),
							load: i,
							selected: false
						});
					}
				}
				
				// Clear the current pagination
				pageList.update('');

				// Only add pagination if there's more than one page
				if (groups.length > 1) {
					// Create the "Previous" item
					var prevLink = new Element("li").update(pagePreviousTemplate);
					prevLink.addClassName("prev-page");
					if (pageNum > 1) {
						prevLink.observe("click", function(event) {
							controller.changePage(catId, pageNum - 1);
						});
					}
					else
						prevLink.addClassName("prev-page-disabled");
					pageList.appendChild(prevLink);

					// Create and add the new LI elements
					for (var i = 0; i < groups.length; i++) {
						var curGroup = new Element("li").update(groups[i].text);
						if (groups[i].selected)
							curGroup.addClassName("selected");
						else {
							curGroup.toLoad = groups[i].load;
							curGroup.observe("click", function(event) {
								controller.changePage(catId, this.toLoad);
							});
						}
						pageList.appendChild(curGroup);
					}

					// Create the "Next" item
					var nextLink = new Element("li").update(pageNextTemplate);
					nextLink.addClassName("next-page");
					if (pageNum !== numPages) {
						nextLink.observe("click", function(event) {
							controller.changePage(catId, pageNum + 1);
						});
					}
					else
						nextLink.addClassName("next-page-disabled");
					pageList.appendChild(nextLink);
				}
			}
		);
	}
	
	/**
	 * PRIVATE:
	 * Binds a UL to contain the selected products to the BtlController,
	 * and attaches its functionality.
	 *
	 * @param selList The UL to hold the selected product thumbnails
	 */
	function bindSelectedProdList(selList) {
		// The number of spots to make placeholders for
		/* const */ var SELECTED_PLACEHOLDERS = 5;

		// Create the slots
		for (var i = 0; i < SELECTED_PLACEHOLDERS; i++) {
			var pSlot = new Element('li').update(placeholderTemplate);
			pSlot.addClassName('placeholder');
			selList.appendChild(pSlot);
		}

		// React when a new item is added
		controller.addListener('productSelect', selList, function(prod) {
			// Create the new element
			var prodBlock = new Element("li").update(selectedProdTemplate);
			var prodImg = prodBlock.down('.selected-prod-img');
			var prodLink = prodBlock.down('.selected-prod-link');

			// Customize
			prodBlock.writeAttribute("rel", prod.fullId);
			prodImg.setStyle({backgroundImage: 'url(' + prod.smthumb + ')'});
			prodLink.writeAttribute("rel", prod.fullId);

			// Attach functionality
			prodLink.observe("click", function(event) {
				controller.deselectProd(this.readAttribute("rel"));
				Event.stop(event);
			});

			// Remove the placeholders and find out how many there are
			var items = this.childElements();
			var numPl = 0;
			if (items.length <= SELECTED_PLACEHOLDERS) {
				for (var i = 0; i < items.length; i++) {
					if (items[i].hasClassName('placeholder')) {
						items[i].remove();
						numPl++;
					}
				}
			}

			// Add the new selection
			this.appendChild(prodBlock);

			// Add back one less placeholder than we had before
			for (var i = 0; i < numPl - 1; i++) {
				var pSlot = new Element('li').update(placeholderTemplate);
				pSlot.addClassName('placeholder');
				this.appendChild(pSlot);
			}
		});

		// React when an item is removed
		controller.addListener('productDeselect', selList, function(prod) {
			// If we have it, remove it
			var elem = this.down('li[rel=' + prod.fullId + ']');
			if (elem) {
				elem.remove();
				
				// If that leaves us with less items than placeholders,
				// add a placeholder.
				if (this.childElements().length < SELECTED_PLACEHOLDERS) {
					var pSlot = new Element('li').update(placeholderTemplate);
					pSlot.addClassName('placeholder');
					this.appendChild(pSlot);
				}
			}
		});
	}
	
	/**
	 * PRIVATE:
	 * Binds a UL to contain a scrolling history list, as well as the up
	 * and down arrow buttons to control the scroller.
	 *
	 * @param histList The UL element to hold the history items.
	 * @requires Df.DynamicSlider, a custom Df module to handle an element slider
	 * 		with changing or nonexistent contents.
	 */
	function bindProdHistory(histList) {
		// Define the slots
		/* const */ var HISTORY_PLACEHOLDERS = 4;

		// Create the slots
		for (var i = 0; i < HISTORY_PLACEHOLDERS; i++) {
			var pSlot = new Element('li').update(placeholderTemplate);
			pSlot.addClassName('placeholder');
			histList.appendChild(pSlot);
		}

		// Attach Df.DynamicSlider
		var histSlider = new Df.DynamicSlider('history');
		histSlider.set({
			direction: 'vert',
			iterateBy: 'li',
			animate: {
				time: 300,
				pause: 30,
				ease: Df.Transitions["expoInOut"]
			}
		});

		// React when a product is deselected
		controller.addListener('productDeselect', histList, function(prod) {
			// Create the new element
			var prodBlock = new Element("li").update(pastProdTemplate);
			var prodImg = prodBlock.down('.past-prod-img');
			var prodLink = prodBlock.down('.past-prod-link');
			
			// Customize
			prodBlock.writeAttribute("rel", prod.fullId);
			prodImg.setStyle({backgroundImage: 'url(' + prod.smthumb + ')'});
			prodLink.writeAttribute("rel", prod.fullId);

			// Attach functionality
			prodLink.observe("click", function(event) {
				controller.selectProd(this.readAttribute("rel"));
				Event.stop(event);
			});
			
			// Remove the placeholders and find out how many there are
			var items = this.childElements();
			var numPl = 0;
			if (items.length <= HISTORY_PLACEHOLDERS) {
				for (var i = 0; i < items.length; i++) {
					if (items[i].hasClassName('placeholder')) {
						items[i].remove();
						numPl++;
					}
				}
			}

			// Add it
			this.appendChild(prodBlock);

			// If we're over the limit, remove the topmost product
			var pastProds = this.childElements();
			if (pastProds.length > MAX_HISTORY_PRODS)
				pastProds[0].remove();
			
			// Add back one less placeholder than we had before
			for (var i = 0; i < numPl - 1; i++) {
				var pSlot = new Element('li').update(placeholderTemplate);
				pSlot.addClassName('placeholder');
				this.appendChild(pSlot);
			}

			// Reset the slider
			histSlider.set();
		});

		// React when a product is selected
		controller.addListener('productSelect', histList, function(prod) {
			// If we have it, remove it
			var elem = this.down('li[rel=' + prod.fullId + ']');
			if (elem)
				elem.remove();
			
			// If that leaves us with less items than placeholders,
			// add a placeholder.
			if (this.childElements().length < HISTORY_PLACEHOLDERS) {
				var pSlot = new Element('li').update(placeholderTemplate);
				pSlot.addClassName('placeholder');
				this.appendChild(pSlot);
			}

			// Reset the slider
			histSlider.set();
		});

		// Clear the history when there's a reset
		controller.addListener('lookReset', histList, function() {
			// Remove all the list items
			var items = this.childElements();
			for (var i = 0; i < items.length; i++)
				items[i].remove();

			// Create the placeholders
			for (var i = 0; i < HISTORY_PLACEHOLDERS; i++) {
				var pSlot = new Element('li').update(placeholderTemplate);
				pSlot.addClassName('placeholder');
				this.appendChild(pSlot);
			}

			// Seal the deal
			histSlider.set();
		});
	}
	
	/**
	 * PRIVATE:
	 * Binds an element with the functionality to reset the entire BTL page
	 * to its initial load state.
	 *
	 * @param restartBtn The prototype-extended 'A' element to which the reset
	 * 		functionality should be bound.
	 */
	function bindReset(resetBtn) {
		resetBtn.observe('click', function(event) {
			controller.resetLook();
			// This is a hack to fix the "start again" button. The DF slider wasn't properly resetting. 
			if($('history').down('.nextOn')){
				$('history').down('.nextOn').addClassName('nextOff');
				$('history').down('.nextOn').removeClassName('nextOn');
			}
			if($('history').down('.prevOn')){
				$('history').down('.prevOn').addClassName('prevOff');
				$('history').down('.prevOn').removeClassName('prevOn');
			}
			$('history').down('.slider').setStyle({
			  top: '0px'
			});
			// end hack
			Event.stop(event);
		});
	}
	
	/**
	 * PRIVATE:
	 * Binds the empty model element to the product select/deselect events,
	 * allowing it to show the currently selecting articles of clothing.
	 *
	 * @param model A prototype-extended DIV element with the empty model
	 * 		background image.
	 */
	function bindModel(model) {
		// Set the model to the right gender
		controller.addListener('modelTypeChange', model, function(modelType) {
			if (this.hasClassName('female-model'))
				this.removeClassName('female-model');
			if (this.hasClassName('male-model'))
				this.removeClassName('male-model');
			if (this.hasClassName('girl-model'))
				this.removeClassName('girl-model');
			if (this.hasClassName('boy-model'))
				this.removeClassName('boy-model');
			if (this.hasClassName('baby-model'))
				this.removeClassName('baby-model');
			if (this.hasClassName('unknown-model'))
				this.removeClassName('unknown-model');
			
			switch(modelType) {
				
				case "MALE":
					this.addClassName('male-model');
					break;
				case "FEMALE":
					this.addClassName('female-model');
					break;
				case "GIRL":
					this.addClassName('girl-model');
					break;
				case "BOY":
					this.addClassName('boy-model');
					break;
				case "BABY":
					this.addClassName('baby-model');
					break;
				default:
					this.addClassName('unknown-model');
			}
		});

		// React when a product is selected
		controller.addListener('productSelect', model, function(prod) {
			// Only do it if the image exists
			if (prod.img) {
				// Create the new layer
				var divLayer = new Element('div');
				divLayer.setStyle({ 
				    backgroundImage: 'url(' + prod.img + ')',
				    zIndex: prod.prodInfo.zid
				});
				
				// If IE6, apply PNG fix for selected product image
                if (document.body.filters) {
                    var ieVersion = parseFloat(navigator.appVersion.split('MSIE')[1]);
                    if (ieVersion >= 5.5 && ieVersion < 7) {
                        divLayer.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='"+prod.img+"', sizingMethod='scale')";
                        divLayer.style.backgroundImage = "none";

                    }
                }

				// Add it
				this.appendChild(divLayer);

				// Remember it for later removal
				modelElements[prod.fullId] = divLayer;
			}
		});

		// React when a product is removed
		controller.addListener('productDeselect', model, function(prod) {
			// If we have it, remove it
			if (modelElements[prod.fullId]) {
				modelElements[prod.fullId].remove();
				delete modelElements[prod.fullId];
			}
		});
	}
	
	/**
	 * PRIVATE:
	 * Binds an inline text element to the controller, allowing it to be
	 * updated automatically every time the current total price changes.
	 *
	 * @param total The inline text element (such as a span) that should
	 * 		be updated with the latest total price.
	 */
	function bindPriceTotal(total) {
		controller.addListener('priceChange', total, function(price) {
			this.update(CURRENCY_SYMBOL + price);
		});
	}
	
	/**
	 * PRIVATE:
	 * Adds functionality to the Buy Outfit button, as well as
	 * enabling it/disabling it according to the controller's select
	 * and deselect events.
	 *
	 * @param buyBtn The Prototype-extended element to trigger the
	 * 		Buy Outfit window when clicked.
	 */
	function bindBuyOutfitButton(buyBtn) {
		// Find the modal window components
		var body = Element.extend(document.getElementsByTagName('body')[0]);
		var overlay = body.down('.modal-dimmer');
		var buyLook = body.down('.buy-look');

		// React to the trigger
		buyBtn.observe("click", function(event) {
			if (!this.hasClassName('buybtn-disabled')) {
				[overlay, buyLook].each(function(showElem) {
					showElem.setStyle({ display: "block" });
				});
			}
			Event.stop(event);
		});

		// Disable the trigger when there are no selections
		var numSelections = 0;
		controller.addListener('productDeselect', buyBtn, function(prod) {
			numSelections--;
			if (numSelections === 0)
				this.addClassName('buybtn-disabled');
		});

		// Enable it again when there are
		controller.addListener('productSelect', buyBtn, function(prod) {
			numSelections++;
			if (numSelections === 1)
				this.removeClassName('buybtn-disabled');
		});

		// There are no selections right now, so it's disabled.
		buyBtn.addClassName('buybtn-disabled');
	}

	/**
	 * PRIVATE:
	 * Binds the list of selected items for checkout to the controller
	 * events and attaches all necessary functionality.
	 *
	 * @param prodList The UL of the checkout list.
	 */
	function bindCheckoutList(prodList) {
		// Bind the product list to the controller's select event
		controller.addListener('productSelect', prodList, function(prod) {
			// Create the list element
			var prodItem = new Element('li').update(buyProdTemplate);
			prodItem.addClassName('checkout-prod');
			prodItem.writeAttribute("rel", prod.fullId);

			// Populate the fields
			prodItem.down('.prod-img').setStyle({
				backgroundImage: "url(" + prod.smthumb + ")"
			});
			prodItem.down('.prod-name').update(prod.prodInfo.name);
			prodItem.down('.color-val').update(prod.color);
			var prodPrice = prodItem.down('.price-val');
			var checkbox = prodItem.down('.include-checkbox');

			// Loop through the skus and add options to the select box
			var sizeSel = prodItem.down('.size-select');
			for (var i = 0; i < prod.skus.length; i++) {
				var opt = new Element('option').update(prod.skus[i].size);
				opt.writeAttribute("value", prod.skus[i].sku);
				sizeSel.appendChild(opt);
			}

			// Only attach the size-based stuff if there's more
			// than one SKU.  This also determines whether the
			// product is selected by default.
			if (prod.skus.length > 1) {
				// When the select box changes, so should the price
				sizeSel.observe("change", function(event) {
					var li = this.up('.checkout-prod');
					var cbox = li.down('.include-checkbox');

					// Change this list item's price
					if (this.value === "none") {
						// No size selected; price is zero, checkbox disabled
						li.down('.price-val').update(CURRENCY_SYMBOL +
							controller.formatPrice(0));
						cbox.checked = false;
						cbox.disable();
						controller.clearSelectedSku(li.readAttribute("rel"));
						if (!li.hasClassName('excluded'))
							li.addClassName('excluded');
					}
					else {
					    // An actual size was selected.  Drop in the price.
						var fullId = li.readAttribute("rel");
						var selProd = controller.getProd(fullId);
						for (var i = 0; i < selProd.skus.length; i++) {
							if (selProd.skus[i].sku == this.value) {
								var priceStr = CURRENCY_SYMBOL +
									controller.formatPrice(selProd.skus[i].curPrice);
								li.down('.price-val').update(priceStr);
								break;
							}
						}
						
						// If this product was previously excluded, include it
						if (!cbox.checked) {
							//cbox.checked = true; // Commented out for PEAC
							cbox.enable();
							//li.removeClassName('excluded'); // Commented out for PEAC
						}

						// Tell the controller we've selected the SKU
						//controller.selectSku(this.value); // Commented out for PEAC
					}
				});

				// This item should be deselected by default
				checkbox.checked = false;
				checkbox.disable();
				prodItem.addClassName('excluded');

				// The item's price should be zero until a SKU is selected
				prodPrice.update(CURRENCY_SYMBOL + controller.formatPrice(0));
			}
			else {
				// Hide the size box
				prodItem.down('.size-box').setStyle({
					visibility: "hidden"
				});

				// There's only one SKU; select it
				var opts = prodItem.down('.size-select').childElements();
				opts[opts.length - 1].selected = true;
				//controller.selectSku(opts[opts.length - 1].value); // Commented out for PEAC

				// The price is the first SKU
				prodPrice.update(CURRENCY_SYMBOL +
					controller.formatPrice(prod.skus[0].curPrice));

				// This item should be included by default
				checkbox.checked = false; // Changed from true to false for PEAC
				checkbox.enable();
				prodItem.addClassName('excluded'); // Line added for PEAC
			}

			// When the checkbox gets deselected, the item is excluded. Also,
			// the opposite.
			prodItem.down('.include-checkbox').observe('click', function(event) {
				var li = this.up('li');
				if (this.checked && li.hasClassName('excluded')) {
					li.removeClassName('excluded');
					if (this.value !== "none")
						controller.selectSku(li.down('.size-select').value);
				}
				else if (!this.checked && !li.hasClassName('excluded')) {
					var fullId = li.readAttribute("rel");
					li.addClassName('excluded');
					controller.clearSelectedSku(fullId);
				}	
			});

			// Attach the new item
			this.appendChild(prodItem);
		});
		
		// Disable button - added for PEAC
		$('checkout-add-to-cart').addClassName('disabled');

		// Remove items from the list when they're deselected
		controller.addListener('productDeselect', prodList, function(prod) {
			this.down('li[rel=' + prod.fullId + ']').remove();
			
			// Deselect any SKU that may be selected for this product
			controller.clearSelectedSku(prod.fullId);
		});

		// Report errors if Add to Cart doesn't go so well
		controller.addListener('submitResult', prodList, function(errors) {
			// Only do this if there are actually errors
			if (errors.length > 0) {
				// Array->Hashmap
				var errorHash = new Object();
				for (var i = 0; i < errors.length; i++)
					errorHash[errors[i].fullId] = errors[i];

				// Loop through the list and change each li according to the errors
				var lis = this.childElements();
				for (var i = 0; i < lis.length; i++) {
					var error = errorHash[lis[i].readAttribute("rel")];
					if (error) {
						if (lis[i].hasClassName('added'))
							lis[i].removeClassName('added');
						lis[i].addClassName('error');
						lis[i].down('.prod-error-msg').update(error.message);
					}
					else {
						if (lis[i].hasClassName('error'))
							lis[i].removeClassName('error');
						lis[i].addClassName('added');
						lis[i].down('.prod-error-msg').update("");
					}
				}
			}
		});
	}

	/**
	 * PRIVATE:
	 * Attaches functionality to an element that triggers the
	 * adding of all selected products in the checkout list
	 * to the cart.
	 *
	 * @param addBtn The element acting as the Add to Cart button.
	 */
	function bindAddToCartButton(addBtn) {
		// Add functionality to the Add to Basket button
		addBtn.observe('click', function(event) {
			// Do it, if it's enabled
			if (!this.hasClassName('disabled')) {
				if (this.hasClassName('to-cart'))
					window.location = CART_URL;
				else
					controller.addSkusToCart();
			}
			Event.stop(event);
		});

		// Enable it when there are cartable items
		controller.addListener('skuSelect', addBtn, function(fullId, skuId) {
			if (this.hasClassName('disabled'))
				this.removeClassName('disabled');
		});

		// Disable it when there are no selected SKUs
		controller.addListener('skuDeselect', addBtn, function(fullId) {
			var skuProds = controller.getCartableProds();
			if (!this.hasClassName('disabled') && skuProds.length === 0)
				this.addClassName('disabled');
		});

		// Disable it during an active AJAX call
		controller.addListener('submitAjaxStart', addBtn, function() {
			if (!this.hasClassName('disabled'))
				this.addClassName('disabled');
		});

		// Re-enable it if there's an error so the user can try again
		controller.addListener('submitAjaxError', addBtn, function(errorMsg) {
			if (this.hasClassName('disabled'))
				this.addClassName('disabled');
		});

		// Turn the button into a cart link once it's been submitted
		controller.addListener('submitResult', addBtn, function(errors) {
			if (this.hasClassName('disabled'))
				this.removeClassName('disabled');
			this.addClassName('to-cart');
		});

		// If it comes back with no errors, redirect to the cart
		controller.addListener('submitResult', addBtn, function(errors) {
			if (errors.length === 0)
				window.location = CART_URL;
		});
	}

	/**
	 * PRIVATE:
	 * Attaches the controller's checkoutPriceChange event to the checkout
	 * total element.
	 *
	 * @param totalElem The text element in which to insert the latest
	 * 		checkout total.
	 */
	function bindCheckoutPriceTotal(totalElem) {
		controller.addListener('checkoutPriceChange', totalElem, function(price) {
			this.update(CURRENCY_SYMBOL + price);
		});
	}
	
	/**
	 * PRIVATE:
	 * Binds a UL element to the BtlController's page change event,
	 * allowing it to show the current page of products for the selected
	 * category.
	 *
	 * @param A Prototype-extended UL element to update with every page
	 * 		change.
	 */
	function bindProdList(prodList) {
		controller.addListener('pageChange', prodList, function(catId, numPages,
				pageNum, pageData) {
			// Remove any existing info box
			clearInfoBox();

			// Clear the existing product list
			this.update('');

			// Loop through each product. Make an li for each.
			for (var i = 0; i < pageData.length; i++) {
				// Create the element
				var newProd = new Element("li").update(prodTemplate);
				newProd.writeAttribute("rel", pageData[i].fullId);
				var img = typeof(pageData[i].lgthumb) != "undefined" ?
						pageData[i].lgthumb : pageData[i].smthumb;
				newProd.down('.prod-img').setStyle({
					backgroundImage: "url(" + img + ")"
				});
				newProd.down('.prod-title').update(pageData[i].prodInfo.name);
				if (pageData[i].prodInfo.promo)
					newProd.down('.promo').update(pageData[i].prodInfo.promo);
				else
					newProd.down('.promo').remove();
				if (pageData[i].onSale)
					newProd.down('.price').addClassName('sale');
				if (pageData[i].curPriceRanged)
					newProd.down('.price').update(CURRENCY_SYMBOL + pageData[i].curPriceMin + 
						RANGE_SYMBOL + CURRENCY_SYMBOL + pageData[i].curPriceMax);
				else
					newProd.down('.price').update(CURRENCY_SYMBOL + pageData[i].curPriceMin);

				// Populate the "was" price with the prefix in the template
				var wasPrefix = newProd.down('.was-price').innerHTML;
				if (pageData[i].wasPriceMin !== false && pageData[i].wasPriceRanged)
					newProd.down('.was-price').update(wasPrefix + CURRENCY_SYMBOL + pageData[i].wasPriceMin +
						RANGE_SYMBOL + CURRENCY_SYMBOL + pageData[i].wasPriceMax);
				else if (pageData[i].wasPriceMin !== false)
					newProd.down('.was-price').update(wasPrefix + CURRENCY_SYMBOL + pageData[i].wasPriceMin);
				else
					newProd.down('.was-price').remove();

				// Determine the product's position in the grid and attach classes
				if (parseInt(i / PRODS_PER_ROW) === 
						parseInt((pageData.length - 1) / PRODS_PER_ROW))
					newProd.addClassName("row-last");
				if (i % PRODS_PER_ROW === PRODS_PER_ROW - 1 || i === pageData.length - 1)
					newProd.addClassName("col-last");

				// Determine whether it's selected and add the class
				if (controller.isSelected(pageData[i].fullId))
					newProd.addClassName("selected");

				// Attach functionality
				var imgLink = newProd.down('.prod-img').down('.prod-img-link');
				var prodTitle = newProd.down('.prod-title');
				[imgLink, prodTitle].each(function(elem) {
					elem.writeAttribute("rel", pageData[i].fullId);
					elem.observe("click", function(event) {
						if (controller.isSelected(this.readAttribute("rel")))
							controller.deselectProd(this.readAttribute("rel"))
						else
							controller.selectProd(this.readAttribute("rel"));
						Event.stop(event);
					});
				});

				// Attach the info box
				/* const */ var INFO_WIDTH = 212;
				/* const */ var ARROW_HEIGHT = 27;
				/* const */ var ARROW_POINT_HEIGHT = parseInt(ARROW_HEIGHT / 2);
				var infoLink = newProd.down('.prod-details');
				infoLink.prodTitle = pageData[i].prodInfo.name;
				infoLink.prodDesc = pageData[i].prodInfo.desc;
				infoLink.prodId = pageData[i].prodInfo.id;
				infoLink.observe("click", function(event) {
					// Create the element
					var infoBox = new Element('div').update(prodDetailTemplate);
					infoBox.addClassName('ptooltip');

					// Attach the close button
					infoBox.down('.detail-close').observe("click", function(event) {
						clearInfoBox();
						Event.stop(event);
					});

					// Insert the title, description, and prod link
					infoBox.down('.detail-title').update(this.prodTitle);
					infoBox.down('.detail-desc').update(this.prodDesc);
					infoBox.down('.detail-prod-link').writeAttribute("href",
					"/product/index.jsp?productId=" + this.prodId);

					// Remove the last info box, if there is one
					clearInfoBox();
					
					// Attach the box to the closest positioned parent
					var container = document.getElementsByTagName('body')[0];
					container.insertBefore(infoBox, container.firstChild);

					// Remember it so we can close it later
					curInfoBox = infoBox;

					// Get dimensions and positions for the box and arrow
					var linkCoords = this.cumulativeOffset();
					var linkMid = parseInt(this.getHeight() / 2) + linkCoords.top;
					var infoWidth = infoBox.getWidth();
					var infoHeight = infoBox.getHeight();
					var infoLeft = linkCoords.left - infoWidth;
					var infoTop = linkCoords.top - parseInt(infoHeight * .75);
					if (infoTop < 0)
						infoTop = 0;
					var arrowPoint = linkMid - infoTop;
					var arrowBlockHeight = arrowPoint + ARROW_POINT_HEIGHT -
					infoBox.down('.topcap').getHeight();

					// For exceptionally short descriptions, the arrow box
					// may be taller than the content box.  Fix that.
					/*if (arrowBlockHeight > infoBox.down('.detail-inner').getHeight()) {
						infoBox.down('.detail-inner').setStyle({
							height: arrowBlockHeight + "px"
						});
					}*/

					// Apply our new dimensions and positions
					infoBox.setStyle({
						top: infoTop + "px",
						left: infoLeft + "px"
					});
					infoBox.down('.detail-arrow').setStyle({
						height: arrowBlockHeight + "px"
					});

					Event.stop(event);
				});

				// Add the element
				this.appendChild(newProd);
			}

			// Perform height-matching on each of the li elements per row.
			// Take the greatest li height in a row, and apply that height
			// to the other li elements in that row.
			var elems = this.childElements();
			// Loop through the rows
			for (var i = 0; i < elems.length; i += PRODS_PER_ROW) {
				var maxHeight = 0;
				// Loop through the elements in the row once to get the max height
				for (var q = 0; q < PRODS_PER_ROW; q++) {
					var idx = i * PRODS_PER_ROW + q;
					if (elems[idx] && elems[idx].getHeight() > maxHeight)
						maxHeight = elems[idx].getHeight();
				}
				// Loop through again to set the elements to that height
				for (var q = 0; q < PRODS_PER_ROW; q++) {
					var idx = i * PRODS_PER_ROW + q;
					if (elems[idx])
						elems[idx].setStyle({ height: maxHeight + 'px' });
				}
			}
		});

		// Attach a select listener to label products when they're selected
		controller.addListener('productSelect', prodList, function(prod) {
			var li = this.down('li[rel=' + prod.fullId + ']');
			if (li && !li.hasClassName("selected"))
				li.addClassName("selected");
		});

		// Attach a deselect listener for the opposite reason
		controller.addListener('productDeselect', prodList, function(prod) {
			var li = this.down('li[rel=' + prod.fullId + ']');
			if (li && li.hasClassName("selected"))
				li.removeClassName("selected");
		});
	}

	/**
	 * PRIVATE:
	 * Removes the product detail box from the interface, if one exists.
	 *
	 * @return true if a box existed and was removed; false otherwise.
	 */
	function clearInfoBox() {
		if (curInfoBox) {
			curInfoBox.remove();
			curInfoBox = false;
			return true;
		}
		return false;
	}
}

// Do it when the DOM's in!
document.observe("dom:loaded", function() {
	var btl = new Btl();
	btl.init(btlData);
});

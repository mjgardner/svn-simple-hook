if (Object.isUndefined(ess.cart))
	ess.cart = {};

ess.cart.confirmNotUpdate = function(){
	if(!es)
		return true
	else if(es.getNotUpdated()){
		if(!confirm(ess.messages.confirmNotUpdate)){
			return false
		}else{
			es.setNotUpdated();
			return true;
		}
	}
	else{
		return true
	}
}

ess.cart.editItemClick = function(uniqueid, productid, skuid, qty, warrantyid, e){
	if(ess.cart.confirmNotUpdate()){
		var el = e;
		//You need to create an new element in each row to hold the inline edit stuff
		el.up('.editItemWrapper').insert($('editItemTarget'));
		$(document.body).fire(':loadProduct', {uniqueId:uniqueid, productId:productid, sku:skuid , quantity:qty, warrantyId:warrantyid, state: 'edit'})
	}
}

ess.cart.continueShopping = function(url){
	if(ess.cart.confirmNotUpdate()){
		Event.stopObserving(window, 'beforeunload', function(e){
			if(!ess.cart.confirmNotUpdate()){
				e.stop();
			}
		});
		window.location=url;
	}
}

ess.cart.continueCheckout = function(){
	if(ess.cart.confirmNotUpdate()){
		Event.stopObserving(window, 'beforeunload', function(e){
			if(!ess.cart.confirmNotUpdate()){
				e.stop();
			}
		});
		$('cartCommand').action='proceedtocheckout.jsp'
		$('cartCommand').submit()
	}
}

ess.cart.displayItemEditCartErrors = function(errorCode, skuObject, productTitle){
	var errorMsg = "";
	var parser = new ZParse(Implementation);
	switch(errorCode){
		case "QUANTITY_NOT_AVAILABLE":		parser.parse(ess.messages.QUANTITY_NOT_AVAILABLE);
											errorMsg = parser.process({productTitle: productTitle});
											break;

		case "QUANTITY_OVER_LIMIT":			parser.parse(ess.messages.QUANTITY_OVER_LIMIT);
											errorMsg = parser.process({productTitle: productTitle});
											break;

		case "DOLLAR_AMOUNT_OVER_LIMIT":	parser.parse(ess.messages.DOLLAR_AMOUNT_OVER_LIMIT);
											errorMsg = parser.process({productTitle: productTitle});
											break;

		case "ITEM_NOT_AVAILABLE":			parser.parse(ess.messages.ITEM_NOT_AVAILABLE);
											errorMsg = parser.process({productTitle: productTitle, skuColor: skuObject.colorLabel, skuSize: skuObject.sizeLabel});
											break;

		case "ILLEGAL_ARGUMENT":
		default:							errorMsg = ess.messages.ILLEGAL_ARGUMENT;
											break;
	}
	var newElement = new Element('div', {'class': 'error'}).update(errorMsg);
	$('itemEditCartErrors').update(newElement);
	// close the ItemEditCart div
	es.notUpdated = false
	es.selectedSku = this.skuInCart
	es.close()
}

document.observe("dom:loaded", function(e) {
	var orderItemServices = $A($$('select.order-item-services'));
	if(orderItemServices.length > 0){
		orderItemServices.each(function(v){
			v.observe('change', function(node){
				$('cartCommand').submit();
			});
		});
	}

  if($('zipShip')) {
        $('zipShip').observe("keyup",function(){
             if ($('zipShip').value == "") {
                 $('taxShippingCalculateBtn').disabled = true
             } else {$('taxShippingCalculateBtn').disabled = false}
         });
  }


	Store.itemEditCart = Class.create(Store.ES, {
		_setup: function($super){
			$super()
			this.element.observe('click', function(e){
				var elExtend = new Df.Element(e.target, {});
				if(elExtend.element.hasClassName('es-close-button')){
					this.notUpdated = false
					this.productState.setQuantity(this.oldQuantity)
					this.selectedSku = this.skuInCart
					this.close()
				}
			}.bind(this))
			this.oldUniqueId = false
			this.oldQuantity = false
			this.oldWarrantyId = false
			this.skuInCart = false
			this.selectedSku = false
			this.notUpdated = false
		},

		_initPars: function($super, pars){
		   $super();

		   this.setPars({
				useForEdits: true,
				promoEngine: false,
				crossSells: false,
				productService:{
					ajaxRequestOptions: {
						method: 'get',
						parameters: {
							format:'json',
							appId:Store.vars.appId,
							catId:'3036542',
							stoken:Store.vars.stoken,
							locale:Store.vars.locale,
							storeCode:Store.vars.storeCode,
							locale:Store.vars.locale
						}
					},
					serviceBaseUrl: ess.messages.servicebaseurl,
					cacheInstance: $H(),
					uri: 'productId'
				}
		   });
		   this.setPars(pars);
		},

		//BEGIN Command Methods
		_setSelectedSku: function(e){
			this.productState.getProductSpecification().getFilteredSkus().each(function(v){
				if(v.sid == e.memo.sku){
				this.selectedSku = v
				return
				}
			}.bind(this))
			this.selectedSku.cartId = e.memo.uniqueId
			this.selectedSku.quantity = e.memo.quantity

			es.productState.getProductSpecification().fire(':attributeUpdate', {attribute:'size', currentValue:this.selectedSku.size})
			es.productState.getProductSpecification().fire(':attributeUpdate', {attribute:'colorLabel', currentValue:this.selectedSku.colorLabel})
			this.buildQuantitybox(e)
			this.skuInCart = this.selectedSku
			this.stopObserving(':productLoaded', this.__setSelectedSku)
		},

		loadProduct: function(e){
			this.element.show()
			this.state = 'new'
			this.oldUniqueId = false
			this.oldQuantity = false
			this.oldWarrantyId = false
			this.skuInCart = false
			this.selectedSku = false
			this.notUpdated = false
			if(e.memo.state && e.memo.state == 'edit'){
				this.oldQuantity = e.memo.quantity
				this.oldWarrantyId = e.memo.warrantyId
				this.state = e.memo.state
				this.__setSelectedSku = this._setSelectedSku.bind(this, e)
				this.observe(':productLoaded', this.__setSelectedSku)
			}

			this.element.update()
			this.element.addClassName('expressShopLoader')
			this.productCacheManager.get(e.memo.productId)

			if(e.memo.carouselProdIds){
				this.carouselProdIds = e.memo.carouselProdIds
			}

			if(e.memo.initializer){
					this.initializer = e.memo.initializer
			}
			this.oldUniqueId = e.memo.uniqueId;
		},

		editCartItem: function(e){
		   // edit is really a delete of one item by uniqueCartItemId, and the adding of another sku
			es.disabled = true;
			var el = e.target.up().up().up();
			var skuInCartId = false;
			var selectedSkuId = false;
			if(Object.isUndefined(es.skuInCart[0])){
				skuInCartId = es.skuInCart.sid;
			}else{
				skuInCartId = es.skuInCart[0].sid;
			}
			if(Object.isUndefined(es.selectedSku[0])){
				selectedSkuId = es.selectedSku.sid;
				var selectedSku = es.selectedSku;
			}else{
				selectedSkuId = es.selectedSku[0].sid;
				var selectedSku = es.selectedSku[0];
			}
			if(skuInCartId!=selectedSkuId){
				var ajaxRequest = {productId:es.productState.getProduct().getProductId(), skuId:selectedSkuId, quantity:es.productState.getQuantity(), uniqueCartItemId:es.oldUniqueId};
				if(es.oldWarrantyId!='')
					ajaxRequest.warrantyId = es.oldWarrantyId;
				es.notUpdated = false
				es.productState.setQuantity(es.oldQuantity)
				es.selectedSku = es.skuInCart
				el.update(ess.messages.saveInProgress);
				el.addClassName('expressShopLoader');
				ShoppingCartServiceWrapper.edit("EditStandardItem", ajaxRequest, function(response) {
					if(response[0].toString().toUpperCase() == "OK"){
						$(document).fire("es:product-edit-in-cart", {
							uniqueLineId: es.oldUniqueId,
							skuId: selectedSkuId,
							quantity: es.productState.getQuantity(),
							id: es.productState.getProduct().getProductId(),
							longTitle: es.productState.getProduct().getLongTitle(),
							shortTitle: es.productState.getProduct().getTitle(),
							mfgStyleCode: "",
							type: "STANDARD",
							available: true
						});
						setTimeout("location.reload(true)", 1000);
					}else{
						ess.cart.displayItemEditCartErrors(response[0].toString(), selectedSku, es.productState.pars.product.getLongTitle());
					}
				});
			}else{
				var ajaxRequest = {uniqueCartItemId:es.oldUniqueId, quantity:es.productState.getQuantity()};
				if(es.oldWarrantyId!='')
					ajaxRequest.warrantyId = es.oldWarrantyId;
				es.notUpdated = false
				es.productState.setQuantity(es.oldQuantity)
				el.update(ess.messages.saveInProgress);
				el.addClassName('expressShopLoader');
				ShoppingCartServiceWrapper.update(ajaxRequest, function(response) {
					if(response[0].toString().toUpperCase() == "OK"){
						$(document).fire("es:product-edit-in-cart", {
							uniqueLineId: es.oldUniqueId,
							skuId: selectedSkuId,
							quantity: es.productState.getQuantity(),
							id: es.productState.getProduct().getProductId(),
							longTitle: es.productState.getProduct().getLongTitle(),
							shortTitle: es.productState.getProduct().getTitle(),
							mfgStyleCode: "",
							type: "STANDARD",
							available: true
						});
						setTimeout("location.reload(true)", 1000);
					}else{
						ess.cart.displayItemEditCartErrors(response[0].toString(), selectedSku, es.productState.pars.product.getLongTitle());
					}
				});
			}
		},

		fireAnalytics: function(){

			var memo = {
					id: this.mainProduct.getProductId(),
					longTitle: this.mainProduct.getLongTitle(),
					shortTitle: this.mainProduct.getTitle(),
					mfgStyleCode: 'pvcs-msc',
					type: 'STANDARD',
					available: true
			}

			switch(this.initializer){
				case 'crossSellClick':
					$(document).fire("es:product-view-cross-sell", memo)
					break;
				case 'carouselClick':
					$(document).fire("es:product-view-next", memo)
					break;
				default:
					$(document).fire("es:product-view-initial", memo)
					break;
			}

			this.initializer = ''
		},

		buildProductImage: function(){
			return;
		},

		process: function(){
		try{
			this.parser.parse($('item-edit-cart-template').innerHTML);
			this.element.update(this.parser.process({
				es:this,
				product: this.mainProduct,
				productPrice: this.mainProduct.getPrice().getHTML()
			}));

			this.parser.parse($('item-edit-cart-sku-template').innerHTML);
			this.element.select('.slices')[0].update(this.parser.process({}));
			this.renderAdditionalData();
		}catch(e){console.log(e);}
		},

		renderMainProduct: function($super, e){
			this.element.removeClassName('expressShopLoader')
			this.mainProduct = e.memo.data

			if(this.carouselProdIds){
				this.processCarouselItems()
			}

			this.fireAnalytics()

			this.process()

			this.element.removeClassName('expressShopLoader')

			this.productSpec = new Store.ProductSpecification()

			this.productState = new Store.ProductState({
				product: this.mainProduct,
				productSpecification: this.productSpec
			})

			this.productSpecifications.push(new Store.ProductSpecification())
				this.productStates.push(this.productState)

			//size selector
			this.buildSizeSelector()

			//color swatches
			this.buildColorSelector()

			this.productState.observe(':stateUpdate', function(e){
				var c = this.element.select('button.editItemCart')[0]
				if(e.memo.cartable){
					this.selectedSku = e.memo.selectedSkus
				}
				if(this.getNotUpdated()){
					c.disabled = false
					// editCartItem
					c.observe('click', this.editCartItem)
				} else {
					c.disabled = true
					c.stopObserving('click', this.editCartItem)
				}
			}.bind(this))

			var n = this.element.select('div.esNextPreviousHolder')[0]
			if(n){
				n.observe('click', this._handleCarouselClick.bindAsEventListener(this))
			}

			this.productSpec.fire(':buildSpecification', {
				product: this.mainProduct
			})

			this.buildQuantitybox(e)
			this.fire(':productLoaded')
		},

		getNotUpdated: function(){
			if((this.productState && (this.productState.getQuantity() && this.productState.getQuantity()!='undefined' && this.productState.getQuantity()!=this.oldQuantity) || (!Object.isUndefined(this.selectedSku) && this.selectedSku[0] && this.skuInCart[0] && this.selectedSku[0].sid!=this.skuInCart[0].sid)))
			{
				this.notUpdated = true;
			}else{
				this.notUpdated = false
			}
			return this.notUpdated;
		},

		setNotUpdated: function(){
			this.notUpdated = false
			this.productState.setQuantity(this.oldQuantity)
			this.selectedSku = this.skuInCart
			this.close()
		},


		buildQuantitybox: function(e){
			var elems = this.element.select('input.qty')
			var elem = elems[elems.length -1]

			if(this.state == 'edit'){
				elem.value = this.selectedSku.quantity
			}

			this.productState.setQuantity(elem.value)

			elem.observe('keyup', function(e){
				this.productState.setQuantity(e.target.value)
				this.productState.fire('stateUpdate');
				// set notUpdated flag - pass e.target.value
			}.bind(this))
		},

		buildSizeSelector: function(){
			var elems = this.element.select('div.sizeCombo')
			var elem = elems[elems.length-1]

			new Store.DhtmlComboAttribute(
				elem, {
				attribute: 'size',
				productSpecification: this.productSpec,
				selectText: 'Choose a size',
				labelAttribute: 'sizeLabel'
				}
			)
		},

		buildColorSelector: function(el){
			var elems = this.element.select('div.colorCombo')
			var elem = elems[elems.length-1]

			new Store.DhtmlComboAttribute(
				elem, {
				attribute: 'colorLabel',
				productSpecification: this.productSpec,
				selectText: 'Choose a color',
				labelAttribute: 'colorLabel'
				}
			)
		}
	});

	//Instantiate express shop. Create an element on the page with a unique id. You will move this element based on which items you are editting
	window.es = new Store.itemEditCart($(document.body).e('div', 'bottom', {id:'editItemTarget'}).addClassName('express-shop').hide());
	if($('cart') && $$('.editLink').length > 0){
		$$('form').each(function(n){
			n.observe("submit", function(e){
				if(!ess.cart.confirmNotUpdate()){
					e.stop();
				}
			});
		});
		$('cart').observe('click', function(e){
			if(e.target.tagName.toLowerCase() == "a" && !e.target.hasClassName('tooltip') && !e.target.hasClassName('close') && !e.target.hasClassName('editLink')){
				if(!ess.cart.confirmNotUpdate()){
					e.stop();
				}
			}else if(e.target.tagName.toLowerCase() == "button"){
				var elButton = new Df.Element(e.target, {});
				if(!elButton.element.hasClassName('es-close-button') && !elButton.element.hasClassName('checkout') && !elButton.element.hasClassName('editItemCart')){
					if(!ess.cart.confirmNotUpdate()){
						e.stop();
					}
				}
			}
		});
		Event.observe(window, 'beforeunload', function(e){
			if(!ess.cart.confirmNotUpdate()){
				e.stop();
			}
		});
	}

	/*
	 * Quantity validation
	 */
    ess.validateQuantityOnKeyUp(".qty", 999);
});

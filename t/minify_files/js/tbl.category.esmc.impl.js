/**
 * Peacocks specific Express Shop and Mini Cart implementation 
 * for category, family, search pages. Used to override default 
 * SRM implementation.
 */

$(document).observe('dom:loaded', function(e){
        
    /**
     * TBL Express Shop implementation
     *
     * @requires Store.js
     * @requires Express Shop includes
     * @requires Express Shop templates
     */
    Store.expressShop = Class.create(Store.ES, {
               
        /*
         * Initial setup operations
         *
         * @param $super Reference to inherited method
         */
        _setup: function($super){
           $super();
        },
        
        /*
        * Initialize parameters
        *
        * @param $super Reference to inherited method
        * @param parse Parameters in JSON format
        */
        _initPars: function($super, pars){
           $super();
        
           this.setPars({
               useForEdits: true,
               promoEngine:false,
               crossSells:false,
                productService:{
                        ajaxRequestOptions: {
                            method: 'get',
                            parameters: {
                                format:'json',
                                appId:Store.vars.appId,
                                catId:'3036542',
                                stoken:Store.vars.stoken,
                                locale:Store.vars.locale,
                                storeCode:Store.vars.storeCode
                            }
                        },
                        serviceBaseUrl: Store.vars.productDataUrl,
                        cacheInstance: $H(),
                        uri: 'productId'
                },
                tip:false
           });
           this.setPars(pars);
        },
        
        /*
        * Click observer for delegated click events
        *
        * @param $super Reference to inherited method
        * @param e Event object
        */
        _esClickObserver: function($super, e){
            $super(e);
        
            var ele = $(e.target);
        
            if(ele.hasClassName('prodLink') || ele.up('.prodLink')){
                 window.location = ess.productCollection[this.mainProduct.pars.productId].url;
            }else if(ele.hasClassName('conf-close-button')){
                 this.closeConfirmation();
            }else if(ele.hasClassName('esmc-close-button')){
                this.productSates = [];
                $(document.body).fire(':closeEsMc');
            }else if(ele.hasClassName('mcContinueShopping')){
                this.closeConfirmation();
            }else if(ele.hasClassName('mcViewMiniCart')){
                e.stop();
                this.closeConfirmation();
                $(document.body).fire(':viewCart');
            }
        },
        
        /* 
        * Render the main product view
        *
        * @param $super Reference to inherited method
        * @param e Event object
        */
        renderMainProduct: function($super, e){
           this.open(e);
           $super(e);
           //this.getElement().e('div', 'top').addClassName('es-close-button').update('X');
        },
        
        /* 
        * Build the product imagery depending on selected color. Also apply zooom 
        * functionality.
        */
        buildProductImage: function(){
           return false;
        },
        
        /* 
        * Additional functionality that is executed after initialization.
        */
        addAdditionalFunctions:function(){
           /* Setup multi skus 
            if(this.state != 'edit'){
                this.element.select('.addMultiSku')[0].observe('click', function(e){
        
                    this.parser.parse($('express-shop-sku-template').innerHTML);
                    this.element.select('.slices')[0].insert(this.parser.process({}));
        
                    this.productSpec = new Store.ProductSpecification();
        
                    this.productState = new Store.ProductState({
                        product: this.mainProduct,
                        productSpecification: this.productSpec
                    });
        
                    this.productSpecifications.push(new Store.ProductSpecification());
                    this.productStates.push(this.productState);
        
                    this.buildSizeSelector();
                    this.buildColorSelector();
                    this.buildQuantitybox();
        
                    this.productSpec.fire(':buildSpecification', {
                        product: this.mainProduct
                    });
                }.bind(this));
            }
            */
        },
        
        /*
         * Build the size selector element
         */
        buildSizeSelector: function(){
            var elems = this.element.select('div.combo');
            var elem = elems[elems.length-1];
    
            new Store.DhtmlComboAttribute(
                elem, {
                    attribute: 'size',
                    productSpecification: this.productSpec,
                    selectText: 'Select a size',
                    labelAttribute: 'sizeLabel',
                    appendto:this.element.select('.slices')[0],
                    offSetType:"positionedOffset"
                }
            );
        },
        
        /*
         * Build the color selector element
         */
        buildColorSelector: function(){
	   		var elems = this.element.select('div.combo');
			var elem = elems[elems.length-2];

			new Store.DhtmlComboAttribute(
				elem, {
					attribute: 'color',
					productSpecification: this.productSpec,
					selectText: 'Select a colour',
					labelAttribute: 'colorLabel',
					appendto: this.element.select('.slices')[0],
					offSetType: "positionedOffset"
				}	
			);
	   },
	   
	   /*
        * Build the quantity box
        *
        * @param e Event object
        */
	   buildQuantitybox: function(e){
           var elems = this.element.select('input.qty')
           var elem = elems[elems.length -1];
            
           if(this.state == 'edit'){
               elem.value = this.selectedSku.quantity;
           }
            
           this.productState.setQuantity(elem.value);

           elem.observe('keyup', function(e){
               var qty = $("esmc-qty");
               var num = qty.getValue();
               var isNumber = /^-?\d+$/.test(num);
                
               try {
                   if (!isNumber || parseInt(qty.getValue()) > 99) {
                       qty.setValue(num.slice(0, num.length-1));
                   }
               } catch(err) {}
                    
               this.productState.setQuantity(qty.getValue());
           }.bind(this))
       },
        
        /*
        * Close express shop view
        * 
        * @param $super Reference to inherited method
        */
        close: function($super){
            try {
                $('ins1').down('.tt-inner').update('<div class="df_loading" style="width:43px; height:11px;"></div>');
            } catch(e) {
                /* swallow error */
            }
        },
        
        /* 
        * Close express shop confirmation view
        */
        closeConfirmation: function(){
           $(document.body).fire(':closeEsMc');
        },
        
        /*
        * Open express shop view
        *
        * @param $super Reference to inherited method
        * @param e Event object
        */
        open: function($super, e){
           $super(e);
           $(document.body).fire(':openEsMc');
        }
    });
    
    // Initialize express shop if enabled
    if (ess.configuration && ess.configuration.expressShopEnabled) {
        window.es = new Store.expressShop($(document.body).e('div', 'bottom', {id:'ins1'}).addClassName('express-shop').hide())
    }
    
    Store.loadExpressShop = function(el){
        $(document.body).fire(':loadProduct', {productId:el.id.split('_')[1], carouselProdIds:carouselProdIds})
    }
    
    // Check whether mini cart is enabled before adding implementation
    if (ess.configuration && ess.configuration.miniCartEnabled) {
        
        /**
         * TBL Mini Cart implementation
         *
         * @requires Store.js
         * @requires Mini Cart includes
         * @requires Mini Cart templates
         */
        Store.miniCart = Class.create(Store.MC, {
            
            /*
             * Initial setup operations
             *
             * @param $super Reference to inherited method
             */
            _setup:function($super){
                $super();
            },
            
            /*
            * Initialize parameters
            *
            * @param $super Reference to inherited method
            * @param parse Parameters in JSON format
            */
            _initPars: function($super, pars){
                $super();

                this.setPars({
                    templates:{
                        cartProduct: $('minicart-products-template').innerHTML,
                        cartSummary: $('minicart-summary-template').innerHTML,
                        confirmationView: $('minicart-confirmview-template').innerHTML,
                        confirmationSummary: $('minicart-summary-template').innerHTML,
                        microView: $('minicart-microview-template').innerHTML,
                        emptyCart: $('minicart-empty-template').innerHTML
                    },
                    elements:{
                        miniCart: '.mini-cart',
                        confirmationHolder: '.express-shop',
                        confirmationSummary:'.conf-summary',
                        cartSummary:'.express-shop',
                        products:'.express-shop',
                        emptyCart: '.cart-micro',
                        micro:'.cart-micro',
                        buttons:{
                            editProduct:'.mcEdit',
                            deleteProduct:'.mcDelete',
                            checkout:'.mcCheckout',
                            viewMainCart: '.mcViewCart',
                            close:'.mcClose',
                            continueShopping:'.mcContinueShopping'
                        }
                    },
                    crossSells:false,
                    confirmationCrossSells:false,
                    productService:{
                        ajaxRequestOptions: {
                            method: 'get',
                            parameters: {
                                format:'json',
                                appId:Store.vars.appId,
                                catId:'3036542',
                                stoken:Store.vars.stoken,
                                locale:Store.vars.locale,
                                storeCode:Store.vars.storeCode
                            }
                        },
                        serviceBaseUrl: Store.vars.productDataUrl,
                        cacheInstance: $H(),
                        uri: 'productId'
                    },
                    productLimit: false,
                    displayTimeOut: 30000,
                    displayOnAddToBag: true,
                    drag: false,
                    maxPromos: false
                });

                this.setPars(pars);
            },
            
            /*
             * Additional tasks when showing confirmation
             *
             * @param $super Reference to inherited method
             * @param e Event object
             */
            _additionalConfirmationTasks: function($super, e){
                return false;
           },
           
           /*
            * Click observer for delegated click events
            *
            * @param $super Reference to inherited method
            * @param e Event object
            */
           _mcClickObserver: function($super, e){
                $super(e);
                
                var elem = $(e.target);
                
                if(elem.up('.cart-micro')){
                    if(this.element.getHeight() > 17){
                        $(document.body).fire(':hideCart', {holder:this.element});
                    }else{
                        e.stop();
                        $(document.body).fire(':viewCart');
                    }
                } else if (elem.up(".pageLink")) {
                    window.location = elem.href;
                }else if (elem.hasClassName('esmc-close-button')){
                    this.close();
                    $(document.body).fire(':closeEsMc');
                }else {
                    e.stop();
                }
            },
            
            /*
            * Close mini cart view
            * 
            * @param e Event object
            */
            close: function(e){
                if(e) e.stop();
                
                $(document.body).stopObserving('click', this._close);
                $(document.body).fire(':closeEsMc');
            },
            
            /*
            * Open mini cart view
            * 
            * @param e Event object
            */
            open: function(e){
                if(e) e.stop();
                
                //$(document.body).observe('click', this._close);
            },
            
            /*
            * Show mini cart confirmation view
            * 
            * @param $super Reference to inherited method
            * @param e Event object
            */
            showConfirmation: function($super, e){
                $super(e);
                es.open();
            },
            
            /*
            * Close mini cart confirmation view
            * 
            * @param $super Reference to inherited method
            */
            closeConfirmation: function($super){
                $(document.body).fire(':closeEsMc');
            }
        });
        
        // Initialize mini cart
        window.mc = new Store.miniCart();
        
        // Apply add-to-cart event listener
        if($('add-to-cart')){
            $('add-to-cart').observe('click', function(e){
                e.stop();
                
                if($('giftCertPage')){
                    if(verifyFields()){
                        $("orderForm").submit();
                    }
                } else if ($('gCardOrderForm')){
                    if(verifyFields()){
                        $("gCardOrderForm").submit();
                    }
                } else {
                    if (ess.validateProduct()){
                        if (ess.configuration
                           && (!ess.configuration.miniCartEnabled
                           || !ess.configuration.expressShopEnabled
                           )) {
                            $("addToCartForm").submit();
                        } else {
                            $(document.body).fire(':addItemToCart', {cartAddSrc: "PD",
                                products: [{
                                    productId: $F('productId'),
                                    skuId: $F('skuId'),
                                    quantity: $F('quantity')
                                }]
                            });
                        }
                    }
                }
            });
        }
    }
});

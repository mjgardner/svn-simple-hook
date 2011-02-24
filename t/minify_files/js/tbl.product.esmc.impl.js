/**
 * Timberland specific Express Shop and Mini Cart implementation 
 * for product page. Used to override default SRM implementation.
 */
function refrCufon(){
    if(Cufon){
    Cufon.refresh();
    }
};

// addCommas and priceCommas sort the minicart prices and add commas to the prices over a thousand (ie, $12432.49 to $12,432.49)
function addCommas(nStr){
		nStr += '';
		var x = nStr.split('.');
		var x1 = x[0];
		var x2 = x.length > 1 ? '.' + x[1] : '';
		var rgx = /(\d+)(\d{3})/;
		while (rgx.test(x1)) {
			x1 = x1.replace(rgx, '$1' + ',' + '$2');
		}
		return x1 + x2;
}

function priceCommas(){
    if($('minicart-container')){
	var miniPrices = $$('.breakdown-price');
	miniPrices.each(function(num){
	    var getNum = num.innerHTML.toString();
	    var parsedNum = addCommas(getNum);
	    if(num.getAttribute('id') == 'minicart-price'){
		num.replace('<'+'div class="breakdown-price" id="minicart-price"'+'>'+parsedNum+'<'+'/div>');
	    }else{
		num.replace('<'+'div class="breakdown-price"'+'>'+parsedNum+'<'+'/div>');
	    }
	});
	
    }
}

$(document).observe('dom:loaded', function(e){
        
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
                        confirmationHolder: '.minicart',
                        confirmationSummary:'.conf-summary',
                        cartSummary:'.minicart',
                        products:'.minicart',
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
		refrCufon.delay(0.1);
		priceCommas.delay(0.1);
                return false;
           },
            
            /*
            * Show mini cart confirmation view
            * 
            * @param $super Reference to inherited method
            * @param e Event object
            */
            showConfirmation: function($super, e){
                $super(e);
                try { $('minicart').show(); } catch(e) { /* swallow */ }
                try { $('your-basket').addClassName('active'); } catch(e) { /* swallow */ }
                try { $('minicart-close').addClassName('active'); } catch(e) { /* swallow */ }
                 if(Prototype.Browser.ie6)$$('select').each(function(sel){sel.hide()});
            },
            
            /*
            * Close mini cart confirmation view
            * 
            * @param $super Reference to inherited method
            */
            closeConfirmation: function($super){
                try { $('minicart').hide(); } catch(e) { /* swallow */ }
				try { $('minicart').update(''); } catch(e) { /* swallow? */ }
                try { $('your-basket').removeClassName('active'); } catch(e) { /* swallow */ }
                try { $('minicart-close').removeClassName('active'); } catch(e) { /* swallow */ }
				document.stopObserving( 'click' );
				 if(Prototype.Browser.ie6)$$('select').each(function(sel){sel.show()});
            }
        });

        /* 
         * Initialize mini cart
         */
        ess.initMinicart = function() {
            // Add required elements
            window.mc = new Store.miniCart($('minicart-container').e('div', 'bottom', {id:'minicart'}).addClassName('minicart').hide());
            
            // Set event listener to trigger mini cart
            if($('add-to-cart')){
                $('add-to-cart').observe('click', function(e){
					e.stop();
                    Store.productsAdded=$F('quantity');
                    if(ess.validateProduct()){
                        $(document.body).fire(':addItemToCart', {cartAddSrc: "PD",
                            products: [{
                                productId: $F('productId'),
                                skuId: $F('skuId'),
                                quantity: Store.productsAdded
                            }],
							onOpen:function(args){
								
							}
                        });
                    }
                })
            }
        }
        // Trigger Mini Cart initialization
        ess.initMinicart();
    }
});
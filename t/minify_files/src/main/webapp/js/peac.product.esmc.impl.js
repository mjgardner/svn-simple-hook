/**
 * Peacocks specific Express Shop and Mini Cart implementation
 * for product page. Used to override default SRM implementation.
 */

Event.observe(window, 'load', function(e){
    if ($(document.body).id === 'product') {
            
        // Check whether mini cart is enabled before adding implementation
        if (ess.configuration && ess.configuration.miniCartEnabled) {

            /**
             * PEAC Mini Cart implementation
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
                            confirmationHolder: '.mini-cart-holder',
                            confirmationSummary:'.conf-summary',
                            cartSummary:'.mini-cart-holder',
                            products:'.mini-cart-holder',
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
                * Show mini cart confirmation view
                *
                * @param $super Reference to inherited method
                * @param e Event object
                */
                showConfirmation: function($super, e){
                    $super(e);
                    try { $('ins1').show(); } catch(e) { /* swallow */ }
                    try { $('your-basket').addClassName('active'); } catch(e) { /* swallow */ }
                    try { $('minicart-close').addClassName('active'); } catch(e) { /* swallow */ }
                },

                /*
                * Close mini cart confirmation view
                *
                * @param $super Reference to inherited method
                */
                closeConfirmation: function($super){
                    try { $('ins1').hide(); } catch(e) { /* swallow */ }
                    try { $('your-basket').removeClassName('active'); } catch(e) { /* swallow */ }
                    try { $('minicart-close').removeClassName('active'); } catch(e) { /* swallow */ }
                }
            });

            /*
             * Initialize mini cart
             */
            ess.initMinicart = function() {
                // Add required elements
                window.mc = new Store.miniCart($('main-container').e('div', 'bottom', {id:'ins1'}).addClassName('mini-cart-holder').hide());
                var mcClose = $("main-container").e('div', 'bottom', {id:'minicart-close'});

                // Set event listener to close mini cart
                if (mcClose) {
                    mcClose.observe('click', function() {
                        mc.closeConfirmation();
                    });
                }

                // Set event listener to trigger mini cart
                if($('add-to-cart')){
                    $('add-to-cart').observe('click', function(e){
                        e.stop();
                        if(ess.validateProduct()){
                            $(document.body).fire(':addItemToCart', {cartAddSrc: "PD",
                                products: [{
                                    productId: $F('productId'),
                                    skuId: $F('skuId'),
                                    quantity: $F('quantity')
                                }]
                            });
                        }
                    });
                }
            }

            // Trigger Mini Cart initialization
            ess.initMinicart();
        }
    }
});
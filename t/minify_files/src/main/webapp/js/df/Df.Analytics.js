Object.extend(String.prototype, {
    toClassName: function(){
	return this.replace(/[\s]+/g, '-').capFirstChar().camelize()
    },

    toConstantName: function(){
	return this.replace(/([a-z])([A-Z])/g, "$1  $2").replace(/-/g, ' ').replace(/[\s]+/g, '_').toUpperCase()
    }
})

Df.Analytics = function(){
    return {
	_base: 'com.gsicommerce.analytics.platform.model.webstore.',
	modelClass: 'com.gsicommerce.analytics.platform.model.webstore.AnalyticsModel',
	defaultEventType: 'com.gsicommerce.analytics.platform.model.webstore.AnalyticsDefaultEventType',
	analyticsResponseClass: "com.gsicommerce.analytics.platform.model.response.AnalyticsResponse"
    }
}()

//name storeCode currentLocale countryCode currencyCode
Df.AnalyticsContext = {
    _context: null,
    parse: function(data){
		if (data && data[Df.Analytics.modelClass]) {
			Df.AnalyticsContext._context = data[Df.Analytics.modelClass]['context'];
		}
    }
}

Df.AnalyticsProcessor = Class.create({

    initialize: function(data){
        this._eventArray = [];
        this._productArray = [];
        this._linkTrackVars = [];
        this._linkTrackEvents = [];
        this.data = data;
        this.pageView = false;
	    if (data) {
	    	this._handleOmnitureResponse();
	    } else {
            $(document).fire('pv:undefined-page-view');
	    }

        return this
    },

    toJSON: function(){
        return this.data;
    },

    _parse: function(){
        this._parseReports();
        this._parseProducts();
    },

    _call: function(){
        if(this.pageView){
	    s.t();
	} else {
	    s.linkTrackEvents = this._linkTrackEvents.join(',');
	    if (s.linkTrackEvents) {
		this._linkTrackVars.push('events');
	    }
	    s.linkTrackVars = this._linkTrackVars.join(',');
	    s.tl(true,'o','Custom Link')
	}
	this._reset()
    },

    _reset: function(){
	this.pageView = false;
        this._eventArray = [];
        this._productArray = [];
        this._linkTrackVars = [];
        this._linkTrackEvents = [];
    },

    _handleOmnitureResponse: function(){
        this._allResponses = this.data[Df.Analytics.analyticsResponseClass].responses;
        if (this._allResponses) {
            $A(this._allResponses).each(function(response) {
                this._currentResponseEntry = response;
                if (this._currentResponseEntry[0] =='OMNITURE') {
                    this._omnitureResponse = this._currentResponseEntry[1];
                    this._parseReports();
                    this._parseProducts();
                    this._parseProperties();
                    this._call();
                }
            }.bind(this));
        }
    },

    _parseProperties: function(){
	if(this._omnitureResponse && this._omnitureResponse.properties){
	    s.un = this._getProperty('account')
	    s.charSet = this._getProperty('encoding')
	    s.currencyCode = this._getProperty('currencyCode')
	    var _l = this._getProperty('internalDomains')
	    if(_l){
		_l.push(',javascript:')
		s.linkInternalFilters = _l.join(',');
	    }
	}
    },

    _getProperty: function(p){
	var m = this._omnitureResponse.properties.find(function(v){
	    return v[0] == p
	})
	if(m){
	    return m[1]
	}
    },

    _parseReports: function(){
        if(this._omnitureResponse.reportItems){
            $A(this._omnitureResponse.reportItems).each(function(item){
                if(item['var'] == 'pageName'){
		   this.pageView = true;
		}
		if(item.type && (item.type == 'TRAFFIC' || item.type == 'CONVERSION')){
                    s[item['var']] = item['value'];
		    this._linkTrackVars.push(item['var']);
                }
                else if (item.type && item.type == 'METRIC'){
		    if (item['value']){
			this._eventArray.push(item['var']+'='+item['value'])
		    } else {
                        this._eventArray.push(item['var']);
		    }
		    this._linkTrackEvents.push(item['var']);
                }
            }.bind(this));

            if(this._eventArray.length > 0){
                s.events = this._eventArray.join(',');
	    }
        }
    },

    _parseProducts: function(){
        if(this._omnitureResponse.products){
            $A(this._omnitureResponse.products).each(function(v){
                var product = {}
                product._merchArray = []
                product._incrementorArray = []
                if(v.attribute){
                    product.attribute = v.attribute
                    if(v.reports) {
                        $A(v.reports).each(function(product, item){

                            if(item.type && item.type == 'PRODUCT_CONVERSION' ){
                                product._merchArray.push(item['var']+'='+item['value'])
                            }
                            else if (item.type && item.type == 'PRODUCT_METRIC') {
                                product._incrementorArray.push(item['var']+'='+item['value'])
                            }
                        }.bind(this, product))
                    }
		    var prodStr = ';' + product.attribute + ';';
		    if (v.quantity) {
		    	prodStr += v.quantity;
		    }
		    prodStr += ';';
		    if (v.price) {
			prodStr += v.price;
		    }
		    prodStr += ';';
		    prodStr += product._incrementorArray.join('|') + ';';
		    prodStr += product._merchArray.join('|');
                    this._productArray.push(prodStr )
                }
            }.bind(this));

            if(this._productArray.length > 0){
                s.products = this._productArray.join(',')
            } else {
		s.products = ';'
	    }
        }
    }
})

Df.AnalyticsRequest = Class.create({

    initialize: function(serviceUrl){
        this.url = serviceUrl;

        this._ro = {}
	this._ro[Df.Analytics.modelClass] = {}
	this._ro[Df.Analytics.modelClass]['eventMap'] = {}
	this._ro[Df.Analytics.modelClass]['name'] = 'analyticsModel';

        return this
    },

    addEvent: function(enumType, type, obj){
	var enumClass = Df.Analytics.defaultEventType;
	if (enumType) {
	    enumClass = Df.Analytics._base + type.toClassName();
	}
	if(obj){
	    obj['class'] = enumClass;
	}else{
	    obj = {}
	    obj['class'] = enumClass;
	}
	this._ro[Df.Analytics.modelClass]['eventMap'][type.toConstantName()] = obj;
        return this
    },

    clearEvents: function(){
        this._ro[Df.Analytics.modelClass]['eventMap'] = {};
        return this
    },

    _setContext: function(){
        this._ro[Df.Analytics.modelClass]['context'] = Df.AnalyticsContext._context;
    },

    getRequestObject: function(){
        return this._ro
    },

    send: function(){
	this._setContext();
        var a = new Ajax.Request(this.url, {
            method: 'post',
            parameters: {
                analyticsModel: Object.toJSON(this.getRequestObject())
            },
            onSuccess: function(x){
                Df.console.log(x.responseText)
                new Df.AnalyticsProcessor(x.responseText.evalJSON())
            },
            onFailure: function(x, e){
                Df.console.log(x)
                Df.console.error(e)
            },
            onException: function(x, e){
                Df.console.log(x)
                Df.console.warn(e)
            }
        })
	this.clearEvents()
    }
});

Df.AnalyticsLibrary = function(){
    var _r = null
    return {
	setRequest: function(r){
	    _r = r
	},

	// Page View
	PageView: function(e){
	    _r.addEvent('AnalyticsDefaultEventType', 'PageViewEvent', e.memo)
	    _r.send()
	},

    // undefined page view - should only happen in cases where the page does not have analytics data
    UndefinedPageView: function(e){
        var url = document.location.href;
	    _r.addEvent('AnalyticsDefaultEventType', 'PageViewEvent', {
                pageType: 'Undefined Page',
                pageTitle: url,
                localizedPageType: 'Undefined Page',
                localizedPageTitle: url
	    })
	    _r.send()
    },

	//Email Signup
	EmailSignup: function(e){
	    _r.addEvent('AnalyticsDefaultEventType', 'PageViewEvent', {
                pageType: 'Email Signup',
                pageTitle: '',
                localizedPageType: 'Email Signup',
                localizedPageTitle: ''
	    })
	    _r.addEvent('AnalyticsDefaultEventType', 'EmailSignupEvent')
	    _r.send()
	},

	ProductViewLargeImage: function(e) {
	    _r.addEvent('AnalyticsDefaultEventType', 'EnlargeImageClickEvent', {product: e.memo})
	    _r.send()
	},

	//Express Shop Product View Initial
	ExpressShopProductViewInitial: function(e){
	    Df.AnalyticsLibrary._expressShopPageView(e)
	    _r.addEvent('AnalyticsDefaultEventType', 'ExpressShopInitiatedEvent')
	    _r.addEvent('AnalyticsDefaultEventType', 'ExpressShopClickThruEvent')
	    _r.send()
	},

	//Express Shop Product View next
	ExpressShopProductViewNext: function(e){
	    Df.AnalyticsLibrary._expressShopPageView(e)
	    _r.addEvent('AnalyticsDefaultEventType', 'ExpressShopShuffleClickThruEvent')
	    _r.send()
	},

	//Express Shop Product View cross sell
	ExpressShopProductViewCrossSell: function(e){
	    Df.AnalyticsLibrary._expressShopPageView(e)
	    // TODO: does this event need the product?
	    _r.addEvent('AnalyticsDefaultEventType', 'ExpressShopCrossSellClickThruEvent')
	    _r.send()
	},

	ExpressShopAddToCart: function(e) {
	    Df.AnalyticsLibrary._miniCartPageView(e);
	    var o = Df.AnalyticsLibrary._getProductItems(e);
	    if (e.memo.cartAddSrc == "PD") {
	        o.cartAdditionSource = "Product Detail Page";
	    } else if (e.memo.cartAddSrc == "ES") {
		// NOTE: keeping ES as documentation that the source exists
	    	o.cartAdditionSource = 'Express Shop';
	    } else {
	    	o.cartAdditionSource = 'Express Shop';
	    }
            if(e.memo.analyticsEmptyCart) {
                _r.addEvent('AnalyticsDefaultEventType', 'CartOpenEvent');
            }
	    _r.addEvent('AnalyticsDefaultEventType', 'CartAddEvent', o);
	    _r.send()
	},

	ExpressShopEditInCart: function(e) {
	    Df.AnalyticsLibrary._expressShopPageView(e);
	    var o = Df.AnalyticsLibrary._getProductItems(e);
	    _r.addEvent('AnalyticsDefaultEventType', 'CartUpdateEvent', o);
	    _r.send()
	},

	_expressShopPageView: function(e) {
	    _r.addEvent('AnalyticsDefaultEventType', 'PageViewEvent', {
                pageType: 'Express Shop',
                pageTitle: '',
                localizedPageType: 'Express Shop',
                localizedPageTitle: ''
	    })
	},

	StoreLocatorSearch: function(e) {
	    Df.AnalyticsLibrary._storeLocatorPageView('Results');
	    _r.addEvent('AnalyticsDefaultEventType', 'StoreLocatorSearchEvent');
	    _r.send();
	},

	StoreLocatorStoreSelect: function(e) {
	    Df.AnalyticsLibrary._storeLocatorPageView('Store Detail Page');
	    _r.addEvent('AnalyticsDefaultEventType', 'StoreLocatorStoreSelectEvent', {
	        storeSelected: e.memo.locationCode
	    });
	    _r.send();
	},

	_storeLocatorPageView: function(title){
	    _r.addEvent('AnalyticsDefaultEventType', 'PageViewEvent', {
                pageType: 'Store Locator',
                pageTitle: title,
                localizedPageType: 'Store Locator',
                localizedPageTitle: title
	    })
	},

        MiniCartViewCart: function(e) {
	    Df.AnalyticsLibrary._miniCartPageView(e);
	    _r.addEvent('AnalyticsDefaultEventType', 'CartViewEvent', Df.AnalyticsLibrary._getCartItems(e));
	    _r.send();
	},

        MiniCartProductView: function(e) {
	    Df.AnalyticsLibrary._miniCartPageView(e);
	    _r.addEvent('AnalyticsDefaultEventType', 'MinicartItemClickThruEvent');
	    _r.send();
	},

        MiniCartProductRemove: function(e) {
	    Df.AnalyticsLibrary._miniCartPageView(e);
	    _r.addEvent('AnalyticsDefaultEventType', 'CartRemoveEvent', Df.AnalyticsLibrary._getProductItems(e));
	    _r.send();
	},

        MiniCartViewCrossSell: function(e) {
	    Df.AnalyticsLibrary._miniCartPageView(e);
	    _r.addEvent('AnalyticsDefaultEventType', 'MinicartCrossSellClickThruEvent');
	    _r.send();
	},

        MiniCartAddCrossSell: function(e) {
	    Df.AnalyticsLibrary._miniCartPageView(e);
	    var o = Df.AnalyticsLibrary._getProductItems(e);
	    o.cartAdditionSource = 'Mini Cart Cross Sells';
	    _r.addEvent('AnalyticsDefaultEventType', 'CartAddEvent', o);
	    _r.send();
	},

	_miniCartPageView: function(e) {
	    _r.addEvent('AnalyticsDefaultEventType', 'PageViewEvent', {
                pageType: 'Mini Cart',
                pageTitle: '',
                localizedPageType: 'Mini Cart',
                localizedPageTitle: ''
	    })
	},

	//Account Creation Complete after Checkout
	AccountCreationComplete: function(e){
	    _r.addEvent('AnalyticsDefaultEventType', 'AccountCreationCompleteEvent')
	    _r.send()
	},

	_getProductItems: function(e) {
	    var o = {};
	    o.items = [];
	    var p = Df.AnalyticsLibrary._getAnalyticsOrderItem(e.memo);
	    o.items.push(p);
	    return o;
	},

	_getAnalyticsOrderItem: function(data) {
		return {
			uniqueLineId: data.uniqueLineId,
			skuId: data.skuId,
			quantity: data.quantity,
			product: Df.AnalyticsLibrary._getAnalyticsProduct(data)
		}
	},

	_getAnalyticsProduct: function(data) {
	    var id = (data.productId) ? data.productId : data.id;
	    var longTitle = (data.displayTitle) ? data.displayTitle : data.longTitle;
	    var shortTitle = (data.displayTitle) ? data.displayTitle : data.shortTitle;
	    var mfgStyleCode = (data.mfgStyleCode) ? data.mfgStyleCode : "";
	    var prodType = (data.type) ? data.type : "STANDARD";
	    var available = (data.available) ? data.available : true;

	    return {
		    id: id,
		    longTitle: longTitle,
		    shortTitle: shortTitle,
		    mfgStyleCode: mfgStyleCode,
		    type: prodType,
		    available: available
	    }
	},

	_getCartItems: function(e) {
	    var o = {};
	    o.items = [];
            if (e.memo.products) {
                $A(e.memo.products).each(function(prod) {
	            var p = Df.AnalyticsLibrary._getAnalyticsOrderItem(prod);
	            o.items.push(p);
		});
	    }
	    return o;
	}
    }
}();

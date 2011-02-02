/*
 *
 *	Never copy this file from a store ALWAYS use a fresh copy from the repository!!!!!
 *
 *
*/
// =================================== Store ========================================
Df.Namespace.create('Store')

Object.extend(Store, {
    version: '0.0.0'
})

// The unique id of the cart line of the last product id that was edited. I
// don't like doing this but I figured it was better than trying to pass
// through a variable as it goes through 6 events being fired and 3 other
// methods. Besides, this class may be rewritten sooner rather than later.
// Set in: Store.ES._updateCartItem
// Used and reset in: Store.MC._renderConfirmationView
Store.ESMCLastEditedProductID = 0;

// ========================== Store.ProductCacheManager ==============================
Store.ProductCacheManager = Class.create(Df.AjaxCacheManager, {
    loadSuccessObserver: function(e){
        if(e.memo.transport.responseText.evalJSON().products.length > 1){
            var prods = []
            e.memo.transport.responseText.evalJSON().products.each(function(v){
            var json = v
            this.getCacheInstance().set( v.productId, new Store.Product(json) )
            prods.push(v.productId)
            }.bind(this))
            this.fireSelectionEvent(prods)
        }else{
            var json = e.memo.transport.responseText.evalJSON().products[0]
            this.getCacheInstance().set( json.productId, new Store.Product(json) )
            this.fireSelectionEvent(json.productId)
        }
    },

    fireSelectionEvent: function(uri){
        if(uri.constructor == Array){
            var objs = []
            uri.each(function(v){
            objs.push(this.getCacheInstance().get(v))
            }.bind(this))
            this.fire(':ItemSelection', {object: objs})
        }else{
            this.fire(':ItemSelection', {object: this.getCacheInstance().get(uri)})
        }
    },

    'get': function(uri){
        if(uri.constructor == Array){
            var getUris = []
            var haveUris = []
            uri.each(function(v){
            if(this.getCacheInstance().get(v)){
                haveUris.push(v)
            } else {
                getUris.push(v)
            }
            }.bind(this))

            if(getUris.length > 0)
            this.callService(getUris)

            if(haveUris.length > 0 && getUris.length == 0)
            this.fireSelectionEvent(haveUris)

        }else{
            if(this.getCacheInstance().get(uri)){
            this.fireSelectionEvent(uri)
            } else {
            this.callService(uri)
            }
        }
        return this
    }
})

// =============================== Store.Product =====================================
Store.Product = Class.create(Df.Base, {
    initialize: function($super, pars){
        $super(pars)
        this._price
        this._images
        this._skus
        this._createGetters()

        return this
    },

    getPrice: function(){
        if(Object.isUndefined(this._price)){
            this._price = new Store.ProductPrice({product:this})
        }
        return this._price
    },

    getImages: function(){
        if(Object.isUndefined(this._images)){
            this._images = new Store.ProductImageGroup(this.pars.images)
        }

        return this._images
    },

    getSkus: function(){
        if(Object.isUndefined(this._skus)){
            this._skus = new Store.ProductSkuGroup(this.pars.skus)
        }
        return this._skus
    },

    getImagesBy: function(slice, value){
        if(this.pars.slices){
                var s = this.pars.slices.find(function(v){
                    return v.sliceAttribute == slice
                })
                if(s && s.sliceValues){
                    var i = s.sliceValues.find(function(v){
                        return v.sliceValueAttributeValue == value
                    })
                    if(i && i.images){
                        return new Store.ProductImageGroup(i.images)
                    } else {
                        return undefined
                    }
                }else{
                    return undefined
                }
        }
    }
})

// =============================== Store.Rating ============================
Store.Rating = Class.create(Df.Element, {
    initialize: function($super, element, pars){
        $super(element, pars)

        if(parseFloat(this.element.innerHTML))
            this.pars.rating = parseFloat(this.element.innerHTML)

        this.emptyElement = Df.e('div', {className:this.pars.emptyClassName})
        this.fullElement = Df.e('div',{className:this.pars.fullClassName})

        this.element.appendChild(this.emptyElement)
        this.element.appendChild(this.fullElement)

        if(this.pars.interactive){
            this.__rateItObserver = this._rateItObserver.bind(this)
            this.element.observe('mousemove', this.__rateItObserver)

            this.__recordItObserver = this._recordItObserver.bind(this)
            this.element.observe('click', this.__recordItObserver)

            this.__resetItObserver = this._resetItObserver.bind(this)
            this.element.observe('mouseout', this.__resetItObserver)

            this.__fullOverObserver = this._fullOverObserver.bind(this)
            this.fullElement.observe('mouseover', this.__fullOverObserver)
            this.emptyElement.observe('mouseover', this.__fullOverObserver)
        }

        return this
    },

    _initPars: function($super, pars){
        $super()
        this.setPars({
            emptyClassName: 'empty',
            fullClassName: 'full',
            total: 4,
            rating: 1,
            interactive: true,
            step: false,
            resetDelay: 500
        })
        this.setPars(pars)
    },

    setRating: function(rating){
        this.pars.rating = rating
        return this
    },

    render: function(rating){
        if(rating)
            this.setRating(rating)

        this.fullElement.animate({
            width: this.pars.rating / this.pars.total * this.element.getWidth() + 'px'
        })

        return this
    },

    _rateItObserver: function(e){
        e.stop()
        var l = this.element.getPointerX(e)

        if(this.pars.step){
            var s = this.element.getWidth() / this.pars.total * this.pars.step
            l = Math.ceil(l/s)*s
        }

        /* alert('--- Store.js ---\n--- _rateItObserver : this.fullElement.setStyle ---' + '\nthis.fullElement = ' + this.fullElement); */
        this.fullElement.setStyle({
            width: l + 'px'
        })

    },

    _recordItObserver: function(e){
        e.stop()
        /* alert('--- Store.js ---\n--- _recordItObserver ---' + '\nthis.fullElement = ' + this.fullElement); */
        return this.render(parseInt(this.fullElement.getStyle('width')) / this.element.getWidth() * this.pars.total)
    },

    _resetItObserver: function(e){
        this._out = true
        setTimeout(this._reset.bind(this, e), this.pars.resetDelay)
    },

    _fullOverObserver: function(e){
        this._out = false
    },

    _reset: function(e){
        if(this._out){
            this.render()
        }
    }
})

// =============================== Store.ProductImageGroup ============================
Store.ProductImageGroup = Class.create(Df.DictionaryCollection, {
})

// =============================== Store.ProductSkuGroup ============================
Store.ProductSkuGroup = Class.create(Df.DictionaryCollection, {
})


// =============================== Store.ProductPrice =================================
Store.ProductPrice = Class.create(Df.Base, {

    initialize: function($super, pars){
        $super(pars)
        this._hash = $H()
        this._skuPrices = []
        this._html = ''

        this._createGetters()
        this.parser = new ZParse(Implementation);

        this._buildHash()
        return this
    },

    _initPars: function($super, pars){
        $super()
        this.setPars({
            priceTemplate: $('express-shop-price-template').innerHTML
        })
        this.setPars(pars)
    },

    setPriceTemplate: function(str){
        this.pars.priceTemplate = str
        return this
    },

    getHash: function(){
        return this._hash
    },

    getHTML: function(){
        if(this._html == ''){
            this.parser.parse(this.getPriceTemplate())
            this._html =  this.parser.process(this._hash._object)
        }
        return this._html
    },

    getSkuPrices: function(){
        return this._skuPrices
    },

    _buildHash: function(){
        if (this.getProduct().getPriceType() == 'S') {
                this._hash.set('price', parseFloat(this.getProduct().pars.price))
        } else if (this.getProduct().getPriceType() == 'VP') {
            this._hash.set('base', parseFloat(this.getProduct().getBasePrice()))
            this._hash.set('price', parseFloat(this.getProduct().pars.price))
        } else {
            this._skuPrices = this.getProduct().getSkus().get().collect(function(v){
                return v.price
            }).uniq()

            if (this.getProduct().getPriceType() == 'SKU' || this.getProduct().getPriceType() == 'SKU+VP') {
                    this._hash.set('price', [ this._skuPrices.min(), this._skuPrices.max() ])
            } else {
                this._hash.set('base', parseFloat(this.getProduct().getBasePrice()))
                this._hash.set('price', [ this._skuPrices.min(), this._skuPrices.max() ])
            }
        }
    }
})

Store.ProductState = Class.create(Df.Base, {
    initialize: function($super, pars){
        $super(pars)

        this._qty
        this._createGetters()
        this.controllers()
        this.mappers()

        return this
    },

    controllers: function(){
        this.observeBefore(':stateUpdate', this.stateUpdateCommand.bind(this))
    },

    getQuantity: function(){
        return this._qty
    },

    setQuantity: function(qty){
        this._qty = qty
        this._fireStateUpdate()
    },

    _fireStateUpdate: function(){
        this.fire(':stateUpdate', {
            cartable: this.isCartable(),
            qty : this._qty,
            selectedSkus : this.getProductSpecification().getFilteredSkus(),
            selectedAttributes: this.getProductSpecification().getAttributes()
        })
    },

    isCartable: function(){
        if(this._qty > 0 && this.getProductSpecification().getFilteredSkus().length == 1){
            return true
        } else {
            return false
        }
    },

    mappers: function(){
        this.getProductSpecification().observe(':attributeUpdate', function(e){
            this._fireStateUpdate()
        }.bind(this))
    },

    stateUpdateCommand: function(e){
        /*	Df.console.log(
                '-------------------- state update ------------------',
                e.memo,
                '----------------------- end ------------------------'
            )
        */
    }
})

// =========================== Store.ProductSpecification ==============================
Store.ProductSpecification = Class.create(Df.DictionaryCollection, {
    initialize: function($super, data){
	$super(data)

        this._attributeSelections = {}
        this._attributeSelectionsShadow = {}
        this._availableAttributeValues = {}
        this._cascade = []
        this._attributeSelectors = {}
        this._product
        this.controllers()

        return this
    },

    controllers: function(){
        this.observe(':attributeUpdate', this.attributeUpdateCommand.bind(this))
        this.observe(':buildSelectors', this.buildSelectorsCommand.bind(this))
        this.observe(':buildSpecification', this.buildSpecificationCommand.bind(this))
    },

    getProduct: function(){
        return this._product
    },

    setProduct: function(product){
        this._product = product
        return this
    },

    attributeUpdateCommand: function(e){

        if(!this._cascade.include(e.memo.attribute)){
            this._cascade.push(e.memo.attribute)
            this.setAvailableAttributeValues(e.memo.attribute)
        }

        this.setAttribute(e.memo.attribute, e.memo.currentValue)
        this.setAttributeShadow(e.memo.attribute)

        var l
        var f = []
        for(var i=this._cascade.indexOf(e.memo.attribute)+1; i<this.getCascade().length; i++){
            this.deleteAttribute(this._cascade[i])
            this.setAvailableAttributeValues(this._cascade[i])

            if(this.isSelectedValueAvailable(this._cascade[i])){
                if(Object.isUndefined(l)){
                    this.setAttribute(this._cascade[i], this.getAttributeShadow(this._cascade[i]))
                }
            }else{
                this.deleteAttributeShadow(this._cascade[i])
                f.push(this._cascade[i])
                l = i
            }
        }
        if(l){
            this._cascade.length = l
        }

        for(a in this._attributeSelectors){
            if(!this._cascade.include(a)){
            this.setAvailableAttributeValues(a)
            }
        }


        this.fire(':'+ e.memo.attribute +'Update', {
            currentValue: e.memo.currentValue,
            currentLabel: e.memo.currentLabel
        })


/*	Df.console.log(
	    '-------- attributeUpdate ---------',
	    this._cascade,
	    this.getFilteredSkus(),
	    '------------- end ----------------',
	    '------ ' + e.memo.attribute + 'Update ------',
	    {
		currentValue: e.memo.currentValue,
		currentLabel: e.memo.currentLabel
	    },
	    '------------- end ----------------'
	)
*/
        f.each(function(v){
            this.fire(':'+ v +'Update', {
                currentValue: undefined,
                currentLabel: undefined
            })

/*	    Df.console.log(
		'------ ' + v + 'Update ------',
		{
		    currentValue: undefined,
		    currentLabel: undefined
		},
		'------------- end ----------------'
	    )
*/
        }.bind(this))
    },

    buildSelectorsCommand: function(e){
        for(var ss in this._attributeSelectors){
            this._attributeSelectors[ss].each(function(v){
                v.fire(':build')
            }.bind(this))
        }
    },

    buildSpecificationCommand: function(e){

        this._attributeSelections = {}
        this._attributeSelectionsShadow = {}
        this._availableAttributeValues = {}
        this._cascade = []

        if(e.memo.product){
            this.set(e.memo.product.getSkus().get())
            this.setProduct(e.memo.product)
        }
        if(e.memo.data){
            this.set(e.memo.data)
        }
        this.fire(':buildSelectors')
    },

    getFilteredSkus: function(){
        return this.getBy(this.getAttributes())
    },

    getFilteredByGroups: function(att){
        if(!att){
            att = this.keys()
        }
        return Df.DictionaryCollection.getAttributeValues(this.getFilteredSkus(), att)
    },

    isSelectedValueAvailable: function(att){
        return this.getAvailableAttributeValues(att).include(this.getAttributeShadow(att))
    },

    getAvailableAttributeValues: function(att){
        if(this._availableAttributeValues[att]){
            return this._availableAttributeValues[att]
        } else {
            return this.getFilteredByGroups(att)
        }
    },

    setAvailableAttributeValues: function(att){
        this._availableAttributeValues[att] = this.getFilteredByGroups(att)
        return this
    },

    setAttribute: function(att, value){
        this._attributeSelections[att] = value
        return this
    },

    getAttribute: function(att){
       return this._attributeSelections[att]
    },

    getAttributes: function(){
       return this._attributeSelections
    },

    deleteAttribute: function(att){
        delete this._attributeSelections[att]
        return this
    },

    setAttributeShadow: function(att){
        this._attributeSelectionsShadow[att] = this.getAttribute(att)
        return this
    },

    getAttributeShadow: function(att){
       return this._attributeSelectionsShadow[att]
    },

    deleteAttributeShadow: function(att){
        delete this._attributeSelectionsShadow[att]
        return this
    },

    registerSelector: function(selector){
        if(!this._attributeSelectors[selector.pars.attribute]){
            this._attributeSelectors[selector.pars.attribute] = []
        }
        this._attributeSelectors[selector.pars.attribute].push(selector)
        return this
    },

    getSelectors: function(){
        return this._attributeSelectors
    },

    getCascade: function(att){
        return this._cascade
    }
})

// ====================== Store.ProductSpecificationAttribute =========================
Store.ProductSpecificationAttribute = {
    registerEvents: function(){
        if(this.pars.fire){
            this.__updateObserver = this._updateObserver.bind(this)
            this.updateEvent()
        }

        if(this.pars.observe){
            this.__attributeUpdateObserver = this._attributeUpdateObserver.bind(this)
            this.observeEvent()
        }

        this.__buildObserver = this._buildObserver.bind(this)
        this.observe(':build', this.__buildObserver )
    },

    observeEvent: function(){
        this.pars.productSpecification.observe(':attributeUpdate', this.__attributeUpdateObserver)
        return this
    },

    updateEvent: function(){
        this.element.observe(':update', this.__updateObserver)
        return this
    },

    getProduct: function(){
	return this.pars.productSpecification.getProduct()
    },

    getListItemLabel: function(rec){
        var r
            if(this.pars.labelAttribute){
            var l = this.pars.productSpecification.get()
            loopie:
                for(var i=0; i < l.length; i++){
            if(l[i][this.pars.attribute] == rec){
                r = l[i][this.pars.labelAttribute]
                break loopie
            }
            }
            }
        return r
    },
    
    /* Return sku data based on given attribute (color or size) */
    getCommonSkuDataByAttribute: function(rec){
        var r = {};
        if(this.pars.labelAttribute){
            var l = this.pars.productSpecification.get();
            loopie:
                for(var i=0; i < l.length; i++){
                    if(l[i][this.pars.attribute] == rec){
                        r.label = l[i][this.pars.labelAttribute];   // Sku label
                        r.value = rec;                              // Sku value
                        r.sid = l[i].sid;                           // Sku ID
                        r.size = l[i].size;                         // Sku size
                        break loopie;
                    }
                }
        }
        return r;
    },
    
    /* Validate valid skus of a slice against a given attribute and check if skus have multiple prices */
    validateSkusAndGetPriceRangeByAttribute: function(rec) {
        var r = {};
        r.minPrice = 0;
        r.maxPrice = 0;

        if(this.pars.labelAttribute){
            var prodSpec = this.pars.productSpecification.get();
            for(var i=0; i < prodSpec.length; i++){
                if(prodSpec[i][this.pars.attribute] == rec){
                    // Store valid sizes in array so that we can validate against them later
                    var sizeString = (prodSpec[i].size).toString();
                    Store.validSize[sizeString] = true;

                    if (typeof(prodSpec[i].price) !== "undefined" && prodSpec[i].price != null) {
                        var skuPrice = prodSpec[i].price;

                        // Store price of color-size combination for easy access when updating dropdown upon selection
                        if (!Store.colorSizePrice[rec]) {
                            Store.colorSizePrice[rec] = [];
                        }
                        Store.colorSizePrice[rec][sizeString] = skuPrice;

                        // Update price range
                        if (r.minPrice == 0 || skuPrice < r.minPrice) {
                            r.minPrice = skuPrice;
                        }
                        if (skuPrice > r.maxPrice) {
                            r.maxPrice = skuPrice;
                        }
                    }
                }
            }
        }
        return r;
    },

    getListItemValue: function(rec){
        return rec
    },

    subscribeToSpecification: function(){
        this.pars.productSpecification.registerSelector(this)
    },

    getSpecificationValue: function(){
	return this.pars.productSpecification.getAttribute(this.pars.attribute)
    },

    getAvailableAttributeValues: function(){
        return this.pars.productSpecification.getAvailableAttributeValues(this.pars.attribute)
    }
}

// ============================= Store.DhtmlComboAttribute ===============================
Store.DhtmlComboAttribute = Class.create(Df.Combo)
Store.DhtmlComboAttribute.addMethods(Store.ProductSpecificationAttribute)
Store.DhtmlComboAttribute.addMethods({
    initialize: function($super, element, pars){
	$super(element, pars)
        this.subscribeToSpecification()
        this.registerEvents()
        return this
    },

    _initPars: function($super, pars){
        $super()
        this.setPars({
            attribute: false,
            productSpecification: false,
            data: [],
            selectText: 'Choose',
            observe: true,
            fire: true,
            labelAttribute: false,
            imageAttributes: {slice: 'color_code', type:'S20', view:'pattern'}
        })
        this.setPars(pars)
    },
    
    getListItemImage: function(rec){
        var r
        if(this.pars.imageAttributes){
            var ig = this.getProduct().getImagesBy(this.pars.imageAttributes.slice, this.getListItemValue(rec))
            if(ig){
                var i = ig.getBy({view:this.pars.imageAttributes.view, type:this.pars.imageAttributes.type})
                if(i && i[0]){
                   r = i[0]
                }
            }
        }
        return r
    },

    _updateObserver: function(e){
	if(this.getCurrentValue() !== this.getSpecificationValue()){
	    this.pars.productSpecification.fire(
		':attributeUpdate',
		Object.extend(e.memo, {attribute: this.pars.attribute}
	    ))
	}
    },

    _attributeUpdateObserver: function(e){
	this.fire(':build')
        if(this.getSpecificationValue()){
            this.setCurrentValue(this.getSpecificationValue())
            this.highlightSelection()
        } else {
            this.clearSelected()
            this.element.update(this.pars.selectText)
        }

        // Store currently selected color
        if (this.pars.attribute == 'color') {
            Store.selectedColor = this.currentValue;
        }
    },

    _buildObserver: function(e){
        this.element.update(this.pars.selectText);
        if (!Store.colorSizePrice)
            Store.colorSizePrice = {};
        if (!Store.validSize)
            Store.validSize = [];

        var productId = this.pars.productSpecification.getProduct().getProductId();

        var attributeData = this.getAvailableAttributeValues().collect(function(rec){

            // Get sku and attribute data based on attribute value (rec)
            var skuData = this.getCommonSkuDataByAttribute(rec);
                
            // For colors check if image type is available (image type is set in pars)
            var skuDataDescription;
            if (this.pars.attribute == "color") {
                var i = this.getListItemImage(rec);
                
                // Return null if sku does not have color swatch image
                if (!i && ess.esmc.productAvailableColorIds[productId.toString()].indexOf(rec) == -1)
                    return null;
                
                var skuPriceRange = this.validateSkusAndGetPriceRangeByAttribute(rec);
                var hasPriceRange = (skuPriceRange.minPrice != skuPriceRange.maxPrice && skuPriceRange.minPrice != 0);
                skuDataDescription = ess.titleCase(skuData.label);

                // Add price to color label if product has SKU level pricing and skus determined as valid have multiple prices
                if (this.getProduct().getPriceType() == 'SKU' && hasPriceRange) {
                    skuDataDescription += " - &pound;" + skuPriceRange.minPrice + " - &pound;" + skuPriceRange.maxPrice;
                } else if (this.getProduct().getPriceType() == 'SKU' && !hasPriceRange) {
                    skuDataDescription += " - &pound;"+skuPriceRange.minPrice;
                }
            } else if (this.pars.attribute == "size") {

                // Return null if not valid size (sku has no color swatch)
                if (!Store.validSize[skuData.size]) {
                    return null;
                }

                // Add price to size label
                skuDataDescription = skuData.label;
                if (this.getProduct().getPriceType() == 'SKU') {
                    if (typeof(Store.selectedColor) !== "undefined"
                        && Store.selectedColor != null
                        && Store.colorSizePrice[Store.selectedColor][skuData.size]) {
                        try {
                            skuDataDescription += " - &pound;"+Store.colorSizePrice[Store.selectedColor][skuData.size];
                        } catch(err) {/*no color size combination*/}
                    }
                }
            }
               
            return {
                'label': (skuDataDescription || rec),
                'value': skuData.value
            }
        }.bind(this))
        
        // Remove null values
        attributeData = attributeData.reject(function(item) {
            return item == null;
        });
        
        // Populate dropdown
        this.repopulateData(attributeData);

        if(this.getAvailableAttributeValues().length == 1 || attributeData.length == 1){
            this.setCurrentValue(attributeData[0].value);
            this.element.update(attributeData[0].label || attributeData[0].value);
            this.highlightSelection();
            this.element.removeClassName('combo');
            this.element.addClassName('comboSingleSelection');
            Event.stopObserving(this.element, 'click', this._down);
        }else{
            this.element.removeClassName('comboSingleSelection');
            this.element.addClassName('combo');
        }
        
        return this
    }
})

// ============================= Store.SwatchAttribute ===============================
Store.SwatchAttribute = Class.create(Df.Element)
Store.SwatchAttribute.addMethods(Store.ProductSpecificationAttribute)
Store.SwatchAttribute.addMethods({
    initialize: function($super, element, pars){
        $super(element, pars)

        this.subscribeToSpecification()
        this.registerEvents()

        return this
    },

    _initPars: function($super, pars){
        $super()
        this.setPars({
            attribute: false,
            productSpecification: false,
            swatchClassName : "swatch",
            selectedSwatchClassName : "selected",
            observe: true,
            fire: true,
            labelAttribute: false,
            imageAttributes: false
        })
        this.setPars(pars)
    },

    updateEvent: function(){
        this.element.observe('click', this.__updateObserver)
        return this
    },

    getListItemImage: function(rec){
	var r
	if(this.pars.imageAttributes){
	    var ig = this.getProduct().getImagesBy(this.pars.imageAttributes.slice, this.getListItemValue(rec))
	    if(ig){
		var i = ig.getBy({view:this.pars.imageAttributes.view, type:this.pars.imageAttributes.type})
		if(i && i[0]){
		   r = i[0]
		}
	    }
	}
	return r
    },

    selectChildByValue: function(val){
	this.element.select('div.' + this.pars.swatchClassName).each(function(v){
            if(val == this.getListItemValue(v.attributeValue)){
                v.addClassName(this.pars.selectedSwatchClassName)
            } else {
                v.removeClassName(this.pars.selectedSwatchClassName)
            }
        }.bind(this))
    },

    _updateObserver: function(e){
        if(e.target.hasClassName(this.pars.swatchClassName) && !e.target.hasClassName(this.pars.selectedSwatchClassName)){
            e.stop()

            this.element.selectedValue = this.getListItemValue(e.target.attributeValue)
	    this.selectChildByValue(this.element.selectedValue)

            this.pars.productSpecification.fire(':attributeUpdate', {
                currentValue: this.getListItemValue(e.target.attributeValue),
                currentLabel: this.getListItemLabel(e.target.attributeValue),
                attribute: this.pars.attribute
            })
        }
    },

    _attributeUpdateObserver: function(e){
	this.fire(':build')
	if(this.getSpecificationValue())
	    this.selectChildByValue(this.getSpecificationValue())
    },

    _buildObserver: function(e){
	this.element.update('')
        this.getAvailableAttributeValues().each(function(rec){
	    var el = this.element.e('div').addClassName(this.pars.swatchClassName)
            el.attributeValue = rec
	    var i = this.getListItemImage(rec)
	    if(i){
            /* alert('--- Store.js ---\n--- (1) _buildObserver ---' + '\nel = ' + el); */
            el.setStyle({backgroundImage:'url("' + i.src + '")'})
            el.title = this.getListItemLabel(rec) || this.getListItemValue(rec)
	    } else {
		    el.update(this.getListItemLabel(rec) || this.getListItemValue(rec))
	    }
	}.bind(this))
        this.element.insert('<div class="break">&nbsp;</div>')
	return this
    }
})

// ============================= Store.AltImagesAttribute ===============================
Store.AltImagesAttribute = Class.create(Store.SwatchAttribute, {

    observeEvent: function(){
        this.pars.productSpecification.observe(':' + this.pars.attribute + 'Update', this.__attributeUpdateObserver)
        return this
    },

    updateEvent: function(){
        this.element.observe('click', this.__updateObserver)
        return this
    },

    selectChildByValue: function(val){
        this.element.select('div.' + this.pars.swatchClassName).each(function(v){
            if(val == v.attributeValue.view){
                v.addClassName(this.pars.selectedSwatchClassName)
            } else {
                v.removeClassName(this.pars.selectedSwatchClassName)
            }
        }.bind(this))
    },

    _updateObserver: function(e){
        if(e.target.hasClassName(this.pars.swatchClassName) && !e.target.hasClassName(this.pars.selectedSwatchClassName)){
            e.stop()
            this.selectChildByValue(e.target.attributeValue.view)
            this.pars.productSpecification.fire(':viewUpdate', {
                view: e.target.attributeValue.view,
                currentValue: this.getSpecificationValue(),
                slice: this.pars.imageAttributes.slice
            })
        }
    },

    _attributeUpdateObserver: function(e){
        this.fire(':build')
    },

    getAvailableImages: function(){
        var r
        if(this.getSpecificationValue()){
            var ig = this.getProduct().getImagesBy(this.pars.imageAttributes.slice, this.getSpecificationValue())
            if(ig){
                var i = ig.getBy({type: this.pars.imageAttributes.type})
                if(i && i[0]){
                   r = i
                }
            }
        }
        if(r){
            return r
        } else {
            return this.getProduct().getImages().getBy({type: this.pars.imageAttributes.type})
        }
    },

    _buildObserver: function(e){
        this.element.update('')
        this.getAvailableImages().each(function(rec){
	    /*
            var el = this.element.e('li').e('img')
	    el.src = rec.src
            */
	    var el = this.element.e('div').addClassName(this.pars.swatchClassName)
        el.attributeValue = rec
        /* alert('--- Store.js ---\n--- (2) _buildObserver ---' + '\nel = ' + el); */
	    el.setStyle({backgroundImage:'url("' + rec.src + '")'})
	    el.title = rec.view
	}.bind(this))
        this.element.insert('<div class="break">&nbsp;</div>')
	return this
    }
})


Store.FormComboAttribute = Class.create(Df.Element, {
    initialize: function($super, element, pars){
        $super(element, pars)

        this.pars.productSpecification.registerSelector(this)

        if(this.pars.fire){
            this.__updateObserver = this._updateObserver.bind(this)
            this.element.observe('change', this.__updateObserver)
        }

        if(this.pars.observe){
            this.__attributeUpdateObserver = this._attributeUpdateObserver.bind(this)
            this.pars.productSpecification.observe(':attributeUpdate', this.__attributeUpdateObserver)
        }

        this.__buildObserver = this._buildObserver.bind(this)
        this.observe(':build', this.__buildObserver )

        return this
    },

    _initPars: function($super, pars){
        $super()
        this.setPars({
            attribute: false,
            productSpecification: false,
            data: [],
            observe: true,
            fire: true,
            labelAttribute: false
        })
        this.setPars(pars)
    },

    _updateObserver: function(e){
        this.pars.productSpecification.updateCascade(this.pars.attribute)

        //half way working
        //if(this.pars.productSpecification.getAttribute(this.pars.attribute) != e.target.value){
            this.pars.productSpecification.fire(
                ':attributeUpdate',
                Object.extend({currentIndex: e.target.selectedIndex, currentValue: e.target.value, currentLabel: e.target.value}, {attribute: this.pars.attribute})
            )
        //}
    },

    _attributeUpdateObserver: function(e){
        var memVal = this.pars.productSpecification.getAttribute(this.pars.attribute) || this.element.value

        if(!this.pars.productSpecification._cascade.include(this.pars.attribute)){
            this.fire(':build')
        }

        this.element.value(memVal)
    },

    _buildObserver: function(e){
        this.element.update(
            this._formatList(
                this.pars.productSpecification.getFilteredByGroups(this.pars.attribute)[this.pars.attribute],
                {'value': '', 'label': 'Choose :' + this.pars.attribute}
            )
        )
        return this
    },

    _formatList: function(list, empty){
        str = '<option value="'+ empty['value'] +'">'+ empty['label'] +'</option>'
        str += $A(list).collect(function(rec){
            var label = rec[0]
            if(this.pars.labelAttribute){
                label = rec[1][0][this.pars.labelAttribute]
            }
            return '<option value="'+rec[0]+'">'+label+'</option>'
        }.bind(this)).join('')

        return str
    }
});



Store.ES = Class.create(Df.Element, {

    _setup: function($super){
        $super()

        this.initializer = 'main'
        this.selectedSku = false
        this.__setSelectedSku = false
        this.state = 'new'
        this.carouselProdIds = false
        this.xsell = {fire:function(e){}}

        this.productSpecifications = []
        this.productStates = []

        this.parser = new ZParse(Implementation);
        this.productCacheManager = this.createProductCacheManager()

        this._close = this.close.bindAsEventListener(this)
        this.__addToCart = this._addToCart.bind(this)
        this.__updateCartItem = this._updateCartItem.bind(this)
        this.__addToWishlist = this._addToWishlist.bindAsEventListener(this)
        this.__esClickObserver = this._esClickObserver.bindAsEventListener(this)

        this.controllers()
        this.eventMaps()


        this.carouselItems = {
            next: false,
            previous: false
        }

        if(this.pars.crossSells){
            this.xsell = new Store.CrossSells(this.pars.crossSells)
                this.xsell.observe(this.pars.crossSells.crossSellClickEvent, function(e){
                    this.productStates = []
                    this.initializer = 'crossSellClick'
                    this.fire(':loadProduct', {productId:e.memo.pid, carouselProdIds: e.memo.xsells})
                }.bind(this))
        }

        if(this.pars.promoEngine){
            this.promoEngine = new Store.PromoEngine(this.pars.promoEngine)
        }

    },

    _initPars: function($super, pars){
        $super()
        this.setPars({
            crossSells: false,
            promoEngine: false,
            serviceURL: false,
	    tip: false
        })
        this.setPars(pars)
    },

    controllers: function(){
        this.observe(':loadProduct', this.loadProduct.bind(this))

        if(this.pars.useForEdits){
            $(document.body).observe(':loadProduct', this.loadProduct.bind(this))
        }

        this.observe(':renderMainProduct', this.renderMainProduct.bind(this))
    },

    eventMaps: function(){
        this.productCacheManager.observe(':ItemSelection', function(e){
            this.fire(':renderMainProduct', {data: e.memo.object})
        }.bind(this))

        this.element.observe('click', this.__esClickObserver)

    },

    _esClickObserver: function(e){
        var elem = $(e.target)

        if(elem.hasClassName('zoomIn')){
            e.stop()
            this.element.select('div.productImage')[0].fire(':zoomIn', {event:e})
        }
        if(elem.hasClassName('zoomOut')){
            e.stop()
            this.element.select('div.productImage')[0].fire(':zoomOut', {event:e})
        }
    },

    process: function(){
        this.parser.parse($('express-shop-template').innerHTML)
        this.element.update(this.parser.process({
            es:this,
            product: this.mainProduct,
            productPrice: this.mainProduct.getPrice().getHTML()
        }))

        this.parser.parse($('express-shop-sku-template').innerHTML)
    	this.element.select('.slices')[0].update(this.parser.process({}))

        this.renderAdditionalData()

    },

    renderAdditionalData: function(){
        if(this.promoEngine){
            this.promoEngine.getPromosByProducts(this.mainProduct.pars.productId)
        }
        if(this.pars.crossSells){
            this.xsell.fire(':getCrossSells',{pids:this.mainProduct.pars.productId})
        }
    },

    //BEGIN Command Methods
    _setSelectedSku: function(e){
        this.productState.getProductSpecification().getFilteredSkus().each(function(v){
            if(v.sid == e.memo.sku){
                this.selectedSku = v
                return
            }
        }.bind(this))
        this.selectedSku.cartId = e.memo.uniqueLineId
        this.selectedSku.quantity = e.memo.quantity

        es.productState.getProductSpecification().fire(':attributeUpdate', {attribute:'size', currentValue:this.selectedSku.size})
        es.productState.getProductSpecification().fire(':attributeUpdate', {attribute:'colorLabel', currentValue:this.selectedSku.colorLabel})
        this.buildQuantitybox(e)

        this.stopObserving(':productLoaded', this.__setSelectedSku)
    },

    fireAnalytics: function(){

        var memo = {
                id: this.mainProduct.getProductId(),
                longTitle: this.mainProduct.getLongTitle(),
                shortTitle: this.mainProduct.getTitle(),
                mfgStyleCode: '',
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
            case 'mcCrossSellClick':
                this.initializer = 'mcCrossSell'
                break;
            case 'mcCrossSell':
                $(document).fire("mc:product-add-cross-sell", memo)
                break;
            default:
                $(document).fire("es:product-view-initial", memo)
                break;
        }
    },

    renderMainProduct: function(e){
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

        Store.validSize = [];
        Store.selectedColor = null;
        
        //color swatches
        this.buildColorSelector()
        
        //size selector
        this.buildSizeSelector()

        //alt images
        this.buildAltImageSelector()

        //productImage
        this.buildProductImage()

        //productPrice
        this.buildPrice()

        //product rating
        this.buildRating()

        //cart button
        try{
    	    this._cartTip = this.element.select(this.pars.tip.element)[0].tip(this.pars.tip.pars)
        }catch(e){
            this._cartTip = false
        }

        this.productState.observe(':stateUpdate', function(e){
            var c = this.element.select('div.addToCart')[0]
            var w = this.element.select('div.addToWishlist')
            if(w.length > 0){
                w = this.element.select('div.addToWishlist')[0]
            }else{
                w = false
            }
            if(e.memo.cartable){
                c.removeClassName('addToCartDisabled')
                if(w){
                    w.removeClassName('addToCartDisabled')
                    w.observe('click', this.__addToWishlist)
                }
                this._setCarTip('', false)

                if(this.state == 'edit'){
                    c.observe('click', this.__updateCartItem)
                }else{
                    c.observe('click', this.__addToCart)
                }
            } else {
                c.addClassName('addToCartDisabled')
                this._setCarTip(this.cartTipContent(), 'hover')

                c.stopObserving('click', this.__addToCart)
                c.stopObserving('click', this.__updateCartItem)

                if(w){
                    w.addClassName('addToCartDisabled')
                    w.stopObserving('click', this.__addToWishlist)
                }
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

    _setCarTip: function(c, e){
        if(this._cartTip){
            this._cartTip.setContent(c)
            this._cartTip.togglePane.eventType(e)
        }
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
        }.bind(this))
    },

    buildSizeSelector: function(){
        var elems = this.element.select('div.combo')
        var elem = elems[elems.length-1]

        new Store.DhtmlComboAttribute(
            elem, {
                attribute: 'size',
                productSpecification: this.productSpec,
                selectText: 'Choose a size',
                labelAttribute: 'sizeLabel',
                appendto:this.element.select('.slices')[0],
                offSetType:"positionedOffset"
            }
        )
    },

    buildColorSelector: function(el){
        var elems = this.element.select('div.swatchContainer')
        var elem = elems[elems.length-1]

        new Store.SwatchAttribute(
            elem, {
            attribute: 'colorLabel',
            productSpecification: this.productSpec,
            imageAttributes: {slice: 'ColorName', type:'S22x20', view:'pattern'}
            }
        )
    },

    buildAltImageSelector: function(){
        new Store.AltImagesAttribute(
            this.element.select('div.altContainer')[0], {
            attribute: 'colorLabel',
            productSpecification: this.productSpec,
            imageAttributes: {slice: 'ColorName', type:'THN'}
            }
        )
    },

    buildPrice: function(){
        this.productSpec.observe(':attributeUpdate', function(e){
            var p = this.productSpec.getAvailableAttributeValues('price')
            var price = {}
            if(this.mainProduct.getPriceType() !== 'SKU'){
            price.base = parseFloat(this.mainProduct.getBasePrice())
            }
            if(p.length > 1){
            price.price = [p.min(), p.max()]
            }else{
            price.price = p[0]
            }
            this.setPrice(this.mainProduct.getPrice().parser.process(price))
        }.bind(this))
    },

    buildProductImage: function(){
        this.productSpec.observe(':colorLabelUpdate', function(e){
            this._productImage.load({
            base: this.getMainProductImageForSlice('ColorName', e.memo.currentValue, null, null).src,
            zoom: this.getMainProductImageForSlice('ColorName', e.memo.currentValue, null, '500x607').src
            })
        }.bind(this)).observe(':viewUpdate', function(e){
            this._productImage.load({
            base: this.getMainProductImageForSlice(e.memo.slice, e.memo.currentValue, e.memo.view, null).src,
            zoom: this.getMainProductImageForSlice(e.memo.slice, e.memo.currentValue, e.memo.view, '500x607').src
            })
        }.bind(this))

        this._productImage = new Df.EmbeddedZoom(this.element.select('div.productImage')[0], {
            loader: Df.e('div', {className:'loader'})
        }).load({
            base: this.getMainProductImageForSlice(null, null, null, null).src,
            zoom: this.getMainProductImageForSlice(null, null, null, '500x607').src
        })
    },

    buildRating: function(){
        new Store.Rating(this.element.select('a.rating')[0], {
            total: 5,
            interactive: false,
            rating: this.mainProduct.getAverageReviewRating()
        })
    },

    _handleCarouselClick: function(e){
        target = $(e.target)
        if (target.hasClassName('carouselEnabled')){
            if (target.hasClassName('carouselNext') ){
                this.goToCarouselItem(1)
            }else if(target.hasClassName('carouselPrevious') ){
                this.goToCarouselItem(-1)
            }
        }
    },

    _addToCart:function(e){
        var prods = []
        var prodId = this.mainProduct.getProductId()

        this.productStates.each(function(v){
            prods.push({
                productId: prodId,
                skuId: v.getProductSpecification().getFilteredSkus()[0].sid,
                quantity: v.getQuantity()
            })
        })

        $(document.body).fire(':addItemToCart', {products: prods})

        if(this.initializer == 'mcCrossSell'){
            this.fireAnalytics()
        }

        this.close()

    },

    _updateCartItem:function(e){
        Store.ESMCLastEditedProductID = this.selectedSku.cartId;
        if(this.productState.getProductSpecification().getFilteredSkus()[0].sid == this.selectedSku.sid){
            $(document.body).fire(':updateCartItem', {uniqueLineId:this.selectedSku.cartId, quantity: this.productState.getQuantity()})
        }else{
            $(document.body).fire(':replaceCartItem',{
                    uniqueLineId:this.selectedSku.cartId,
                    productId: this.mainProduct.getProductId(),
                    skuId: this.productState.getProductSpecification().getFilteredSkus()[0].sid,
                    quantity: this.productStates[0].getQuantity()
                })
        }
            this.close()
    },

    _addToWishlist:function(e){
        this.parser.parse($('wishlist-form-template').innerHTML)
        $$('.addToWishlist')[0].insert(this.parser.process({
            pid:this.mainProduct.getProductId(),
                color:this.productState.getProductSpecification().getFilteredSkus()[0].color,
            sid: this.productState.getProductSpecification().getFilteredSkus()[0].sid,
            qty: this.productState.getQuantity()
        }))
        $('esAddToWishlistForm').submit()
    },

    _updateWishlistItem:function(e){
        Df.console.log('<<<<<<<<<<<<<<<<<<<<<<<<',
            'updateWishlistItem < We may not need this function',
            '>>>>>>>>>>>>>>>>>>>>>>>>')
    },

    cartTipContent: function(){
        var selectors = this.productSpec.getSelectors()
        var selections = this.productSpec.getAttributes()
        var string = ''
        for (var p in selectors) {
            if(Object.isUndefined(selections[p])){
            string += '<div>Please select a ' + p + '<\/div>'
            }
        }
        if(!this.productState.getQuantity() > 0){
            string += '<div>Please select a quantity<\/div>'
        }
        return string
    },

    setPrice: function(price){
        try {
            if(price){
                this.element.select('.productPrice')[0].update(price)
            } else {
                this.element.select('.productPrice')[0].update(this.mainProduct.getPrice().getHTML())
            }
        } catch(err){}
    },

    getMainProductImageForSlice: function(slice, value, view, type){
        if(!view){
            view = 'main'
        }
        if(!type){
            type = 'REG'
        }
        var i
        if(slice && value){
            var ig = this.mainProduct.getImagesBy(slice, value)
            if(ig){
            igg = ig.getBy({view:view, type:type})
            if(igg){
                i = igg[0]
            }
            }
        }
        if(!i){
            i = this.mainProduct.getImages().getBy({view:view, type:type})[0]
        }
        return i
    },

    loadProduct: function(e){
        this.open()
        this.state = 'new'
        this.selectedSku = false
        if(e.memo.state && e.memo.state == 'edit'){
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

        this.initializer = ''
        if(e.memo.initializer){
                this.initializer = e.memo.initializer
        }
    },
    //END Command Methods

    processCarouselItems: function(){
        if(this.carouselProdIds.indexOf(this.mainProduct.pars.productId) > 0){
            this.carouselItems.previous = true
        }else{
            this.carouselItems.previous = false
        }

        if(this.carouselProdIds.indexOf(this.mainProduct.pars.productId) < this.carouselProdIds.length-1){
            this.carouselItems.next = true
        }else{
            this.carouselItems.next = false
        }
    },

    // next/previous
    goToCarouselItem: function(num){
        this.clearEventListeners()
        var pos = this.carouselProdIds[this.carouselProdIds.indexOf(this.mainProduct.pars.productId) + num]
        this.initializer = 'carouselClick'
        this.fire(':loadProduct', {productId: pos, carouselProdIds: this.carouselProdIds})
    },

    close: function(){
        this.productStates = []
        this.element.update('')
        this.element.hide()
    },

    open: function(){
        this.element.show()
    },

    clearEventListeners: function(){
        //deregister EventListeners
        var n = this.element.select('div.esNextPreviousHolder')[0]
        n.stopObserving('click', this._handleCarouselClick.bindAsEventListener(this))
    },

    createProductCacheManager: function(){
        return new Store.ProductCacheManager(this.pars.productService)
    }
})

Store.MC = Class.create(Df.Ui, {
    _setup: function($super){
        $super()

        this.cart = new Store.Cart(Object.extend({miniCart:this},this.pars));
        this.parser = new ZParse(Implementation);
        this.displayed = false
        this.state = 'mcView'
        this.miniCartHolder = $$(this.pars.elements.miniCart)
        this.confirmationHolder = false
        this._timeout

        this.__updateProductView = this._updateProductView.bindAsEventListener(this)
        this.__updateSummaryView = this._updateSummaryView.bindAsEventListener(this)
        this.__updateMicroView = this._updateMicroView.bindAsEventListener(this)
        this.__renderEmptyCart = this._renderEmptyCart.bindAsEventListener(this)
        this.__stopTimer = this._stopTimer.bindAsEventListener(this)
        this.__stopConfirmationTimer = this._stopConfirmationTimer.bindAsEventListener(this)
        this.__fireAnalytics = this._fireAnalytics.bindAsEventListener(this)
        this.__failureHandler = this._failureHandler.bindAsEventListener(this)
        this.__mcClickObserver = this._mcClickObserver.bindAsEventListener(this)
        this._showConfirmation = this.showConfirmation.bindAsEventListener(this)
        this.__renderConfirmationSummaryView = this._renderConfirmationSummaryView.bindAsEventListener(this)
        this._close = this.close.bindAsEventListener(this)
        this._resizeMiniCart = this.resizeMiniCart.bind(this)

        this.cart.observe(':cartProductsUpdated', this.__updateProductView)
        this.cart.observe(':summaryUpdated', this.__updateSummaryView)
        this.cart.observe(':summaryUpdated', this.__updateMicroView)
        this.cart.observe(':cartActionFailed', this.__failureHandler)

        this.element.observe('click', this.__mcClickObserver)

        $(document.body).observe(':viewCart', function(e){
            this.open(e)
        }.bind(this))

        this.observe(':viewConfirmation', this._showConfirmation)

        $(document.body).observe(':hideCart', function(e){
            this.displayed = false
            $$(this.pars.elements.miniCart)[0].stopObserving('mouseover', this.__stopTimer)
            this.close()
        }.bind(this))

        $(document.body).observe(':cartEmpty', function(e){
            this.__renderEmptyCart(e)
        }.bind(this))

        this.cart.observe(':addToBagViewEvent', function(e){

            if(this.pars.templates.confirmationView){
		this.confirmationHolder = $$(this.pars.elements.confirmationHolder)
                this.fire(':viewConfirmation')
                this.state = 'mcConfirmation'
            }else{
                this.cart.fire(':viewCart')
                this.state = 'mcAutoView'
            }

        }.bind(this))

        this.observe('mc:fireAnalytics', this.__fireAnalytics)

        if(this.pars.templates.confirmationSummary){
            this.cart.observe(':summaryUpdated', this.__renderConfirmationSummaryView)
        }
    },

    _mcClickObserver: function(e){
        var elem = $(e.target)
        if(elem.hasClassName('remove')){
            e.stop()
            $(document.body).fire(':removeCartItem', {uniqueLineId:elem.up().id})
            this._resizeMiniCart()
        }else if(elem.hasClassName('mcEdit')){
            e.stop()
            $(document.body).fire(':editCartItem', {uniqueLineId:elem.up().id})
            this.close()
        }else if(elem.hasClassName('mcContinueShopping')){
            this.close()
        }else if(elem.hasClassName('mcProdTitleLink') || elem.up('.mcProdTitleLink')){
            window.location = ess.productCollection[elem.down('.mcActionButtons').id].url
        }
    },

    resizeMiniCart: function(){
	return false;
    },

    _failureHandler: function(e){
        window.location.href = Store.vars.cartUrl;
    },

    _fireAnalytics: function(e){

        var memo = {
            mfgStyleCode: 'pvcs-msc',
            type: 'STANDARD',
            available: true,
            analyticsEmptyCart: e.memo.analyticsEmptyCart
        }

        if(e.memo.prod){
            Object.extend(memo, {id:e.memo.prod.productId, longTitle: e.memo.prod.longTitle, shortTitle: e.memo.prod.shortTitle})
        }

        switch(e.memo.event){
            case 'crossSellClick':
                $(document).fire("mc:product-view-cross-sell", memo)
                break;
            case 'removeItem':
                $(document).fire("mc:product-remove", memo)
                break;
            case 'viewMinicart':
                Object.extend(memo, {products:this.cart._cartItems})
                $(document).fire("mc:cart-view", memo)
                break;
            case 'editItem':
                $(document).fire("mc:product-view", memo)
                break;
            case 'addItem':
                var cartAddSrc = "ES";
                if (e.memo.cartAddSrc) {
                    cartAddSrc = e.memo.cartAddSrc;
                }
                Object.extend(memo, {cartAddSrc: cartAddSrc, skuId: e.memo.prod.skuId, quantity: e.memo.prod.quantity})
                $(document).fire("es:product-add-to-cart", memo)
                break;
            default:
                break;
        }
    },

    _stopTimer: function(e){
        clearTimeout(this._timer)
        $$(this.pars.elements.miniCart)[0].stopObserving('mouseover', this.__stopTimer)
    },

    _stopConfirmationTimer: function(e){
        clearTimeout(this._timer)
        $$(this.pars.elements.confirmationHolder)[0].stopObserving('mouseover', this.__stopConfirmationTimer)
    },

    fireClose: function(e){
        $(document.body).fire(':hideCart')
    },

    _initPars: function($super, pars){
        $super()
        this.setPars({
            templates:{
                cartProduct: $('minicart-products-template').innerHTML,
                cartSummary: $('minicart-summary-template').innerHTML,
                confirmationView: $('minicart-confirmview-template').innerHTML,
                microView: $('minicart-microview-template').innerHTML,
		        emptyCart: $('minicart-empty-template').innerHTML
            },
            elements:{
                miniCart: '.miniCart',
                confirmationHolder: '.mcConfirm',
                cartSummary:'.cartDetails',
                products:'.cartProducts',
		        emptyCart: '.cartProducts',
                micro:'.cartMicro',
                buttons:{
                    editProduct:'.mcEdit',
                    deleteProduct:'.mcDelete',
                    checkout:'.mcCheckout',
                    viewMainCart: '.mcViewCart',
                    close:'.mcClose',
                    continueShopping:'.mcContinueShopping'
                }
            },
            displayTimeOut: 4000,
            displayOnAddToBag: true,
            container: 'miniCart',
            crossSells: false,
            drag: false,
            hideOnEmpty: true,
            maxPromos: false
        })
        this.setPars(pars)
    },

    _renderEmptyCart: function(e){
        this._processTemplate(this.miniCartHolder, this.pars.templates.emptyCart, {}, this.pars.elements.emptyCart)
        this.resizeMiniCart(true)
    },

    _additionalConfirmationTasks: function(){

    },

    _renderConfirmationView: function(){
        var items = this.cart._orderItemsByDate();

        // moves the updated item to the front of the array
        items = this._shiftUpdatedItemFirst(items);

	    /* alert(items.length); */
        this._processTemplate(this.confirmationHolder, this.pars.templates.confirmationView, {pidData:this.cart._cartProds, cartProducts:items}, false, this._additionalConfirmationTasks)
        this.cart.confxsell.fire(':getCrossSells',{pids:[items[0].productId]})
    },

    _shiftUpdatedItemFirst: function(items) {
      // moves the updated item to the front of the array

      if (isNaN(Store.ESMCLastEditedProductID) || items.length < 2) {
        return items;
      }

      var updatedId = parseInt(Store.ESMCLastEditedProductID);
      var newItems = [];
      var updatedItem = [];
      for (var i = 0; i < items.length; i++) {
        if (updatedId == parseInt(items[i].uniqueLineId)) {
          updatedItem.push(items[i]);
        } else {
          newItems.push(items[i]);
        }
      }
      // reset the value
      Store.ESMCLastEditedProductID = 0;

      return updatedItem.concat(newItems);
    },

    _renderConfirmationSummaryView: function(e){
        if(this.state == 'mcConfirmation'){
            this._processTemplate(this.confirmationHolder, this.pars.templates.confirmationSummary, e.memo, this.pars.elements.confirmationSummary)
        }
    },

    _updateProductView: function(e){
        this._processTemplate(this.miniCartHolder, this.pars.templates.cartProduct, e.memo, this.pars.elements.products)
        this.fire(':productViewUpdated')
        this.resizeMiniCart()
    },

    _updateSummaryView: function(e){
        this._processTemplate(this.miniCartHolder, this.pars.templates.cartSummary, e.memo, this.pars.elements.cartSummary)
        this.resizeMiniCart()
    },

    _updateMicroView: function(e){
        this._processTemplate(this.miniCartHolder ,this.pars.templates.microView, e.memo, this.pars.elements.micro)
        this.resizeMiniCart()
    },

    _processTemplate: function(holder, template, data, el, callback){
        var succ = this.parser.parse(template);
        if(succ){
            holder.each(function(v){
                if(el){
                    v.select(el).each(function(vv){
                        vv.innerHTML = this.parser.process(data)
                    }.bind(this))
                }else{
                    v.innerHTML = this.parser.process(data)
                }
            }.bind(this))

            if(callback){
                callback.defer()
            }
        }

    },

    close: function(e){
        if(e){
            e.stop()
        }
        this.element.hide()
        $(document.body).stopObserving('click', this._close)
    },

    open: function(e){
        if(e){
            e.stop()
        }
        this.displayed = true
        this.element.show()
        $(document.body).observe('click', this._close)

        if(this.pars.displayTimeOut && this.state == 'mcAutoView'){
            this.state = 'mcView'
            this._timer = setTimeout( this.fireClose.bind(this), this.pars.displayTimeOut);
            $$(this.pars.elements.miniCart)[0].observe('mouseover', this.__stopTimer)
        }
    },

    showConfirmation: function(e){
		this._renderConfirmationView()
        if(this.pars.displayTimeOut){
            this._timer = setTimeout( this.closeConfirmation.bind(this), this.pars.displayTimeOut);
            $$(this.pars.elements.confirmationHolder)[0].observe('mouseover', this.__stopConfirmationTimer)
        }
    },

    closeConfirmation: function(){

    }
})
/*
 *	Cart Controller Class
 *		Events:
 *			Fired on
 *				document.body:
 *					':loadProduct'
 *						memo: {uniqueLineId:prod.uniqueLineId, productId:prod.productId, sku:sid, quantity:prod.quantity, state: 'edit'}
 *					':cartResponse'
 *						memo: {response:response.responseText}
 *					':cartRequestComplete'
 *						memo: {response: response} or {response:response, event:eventName}
 *
 *
 *
*/
Store.Cart = Class.create(Df.Base, {

    _setup: function($super){
	$super()

        this._cartData
        this.totalItemsInCart = 0
        this._cartProds = {}
        this._pidData = {}
        this._cartItems = []
        this._productCacheManager = this.createProductCacheManager()
        this.xsell = {fire:function(e){}}
        this.confxsell = {fire:function(e){}}

        if(this.pars.crossSells){
            this.xsell = new Store.CrossSells(this.pars.crossSells)
                this.xsell.observe(this.pars.crossSells.crossSellClickEvent, function(e){
                    $(document.body).fire(':loadProduct', {productId:e.memo.pid, carouselProdIds: e.memo.xsells, initializer:'mcCrossSell'})
                    $(document.body).fire(':hideCart')
                    this.pars.miniCart.fire('mc:fireAnalytics', {event:'crossSellClick', prod:{productId: e.memo.pid, longTitle: e.memo.prod.getLongTitle(), shortTitle: e.memo.prod.getTitle()} })
                }.bind(this))
        }

        if(this.pars.confirmationCrossSells){
            this.confxsell = new Store.CrossSells(this.pars.confirmationCrossSells)
                this.confxsell.observe(this.pars.confirmationCrossSells.crossSellClickEvent, function(e){
                    this.initializer = 'crossSellClick'
                    $(document.body).fire(':loadProduct', {productId:e.memo.pid, carouselProdIds: e.memo.xsells})
                }.bind(this))
        }

        //Event Listener Bindings
        this.__addToCart = this._addToCart.bindAsEventListener(this)
        this.__removeItem = this._removeItem.bindAsEventListener(this)
        this.__replaceCartItem = this._replaceCartItem.bindAsEventListener(this)
        this.__updateCartItem = this._updateCartItem.bindAsEventListener(this)
        this.__processCartResponse = this._processCartResponse.bindAsEventListener(this)
        this.__cartSuccessActions = this._cartSuccessActions.bindAsEventListener(this)
        this.__refreshCart = this._refreshCart.bindAsEventListener(this)
        this.__fireLoadItem = this._fireLoadItem.bindAsEventListener(this)
        this.__showCart = this._showCart.bindAsEventListener(this)
        this.__processViewCartRequest = this._processViewCartRequest.bindAsEventListener(this)

        //Observers for cart actions
        $(document.body).observe(':addItemToCart', this.__addToCart)
        $(document.body).observe(':viewCart', this.__processViewCartRequest)
        this.observe(':viewCart', this.__refreshCart())
        $(document.body).observe(':updateCartItem', this.__updateCartItem)
        $(document.body).observe(':removeCartItem', this.__removeItem)
        $(document.body).observe(':replaceCartItem', this.__replaceCartItem)
        $(document.body).observe(':editCartItem', this.__fireLoadItem)
        this.observe(':cartRequestComplete', this.__processCartResponse)
        this.observe(":cartActionSuccess", this.__cartSuccessActions)
        this.observe(':cartItemRemoved', this.__refreshCart)
        this.observe(':cartItemsUpdated', this.__refreshCart)


        this.observe(':cartResponse', function(e){
            this._getOrderSummary.bind(this)()
            if(this._cartItems.length != 0){
                this._getCartProducts.bind(this)()

                if(this.pars.crossSells){
                    var pids = []
                    this._cartItems.each(function(v){
                        pids.push(v.productId)
                    })

                    this.xsell.fire(':getCrossSells',{pids:pids})
                }
            }
        }.bind(this))

        this._productCacheManager.observe(':ItemSelection', function(e){
            this._pidData = e.memo.object
            this._compileProductData()
        }.bind(this))
    },

    _initPars: function($super, pars){
	    $super()
	    this.setPars({
            productLimit: false
        })
	    this.setPars(pars)
    },

    _showCart: function(e){
        if(this.pars.displayOnAddToBag){
            this.fire(':addToBagViewEvent')
        }
        this.stopObserving(':cartResponse', this.__showCart)
    },

    _setupCartActionObservers: function(e){
        this.observe(':cartResponse', this.__showCart)
    },

    _fireLoadItem:function(e){
        var uniqueLineId = e.memo.uniqueLineId
        var prod = this._cartProds[uniqueLineId]
        $(document.body).fire(':loadProduct', {uniqueLineId:prod.uniqueLineId, productId:prod.productId, sku:prod.skuId, quantity:prod.quantity, state: 'edit'})
        this.pars.miniCart.fire('mc:fireAnalytics', {event:'editItem', prod:prod})
        this.pars.miniCart.state = 'edit'
    },

    // Cart Methods
    _processCartResponse: function(e){
        if(e.memo.response[0].toString() != "OK"){
            this.fire(':cartActionFailed', {response:e.memo.response})
        }else if(e.memo.event){
            this.fire(e.memo.event, {response:e.memo.response})
        }else{
            this.fire(':cartActionSuccess', {response:e.memo.response})
        }
    },

    _refreshCart: function(e){
        this.getCart()
        this.pars.miniCart.state = 'mcView'
    },

    _processViewCartRequest: function(e){
        this._refreshCart(e)
        this.pars.miniCart.fire('mc:fireAnalytics', {event:'viewMinicart'})
    },

    _cartSuccessActions: function(e){
        this._refreshCart(e)
    },

    _getCartProducts: function(){
    	var pids = []
        this._cartItems.each(function(v){
            pids.push(v.productId)
        })

    	this._productCacheManager.get(pids)
    },

    _getItemSubtotal: function(prod){
        if(prod.pricing.itemLevelDiscountedPrice){
            return prod.pricing.itemLevelDiscountedPrice.amount
        }

        return prod.pricing.unitPrice.amount
    },

    _compileProductData: function(){
        var prods = []
        this._cartProds = {}
        var items = this._cartItems

        if(this.pars.productLimit && items.length > this.pars.productLimit){
            items.length = this.pars.productLimit
        }

        for (var i = 0; i<items.length;i++){

            var v = items[i]
            var prodInfo = {}

            if(this.pars.maxPromos && v.appliedPromos.length > this.pars.maxPromos){
                v.appliedPromos.length = this.pars.maxPromos
            }

            if(this._pidData.length){
                this._pidData.each(function(vv, ii){
                    if(v.productId == vv.pars.productId){
                        prodInfo = vv
                        return;
                    }
                }.bind(this));
            }else{
                prodInfo = this._pidData
            }

            var prod = v
            prod.subTotal = this._getItemSubtotal(v)
            this._cartProds[v.uniqueLineId] = prod

            prods.push(prod)
        }
        this.fire(':cartProductsUpdated', {cartProducts:prods})
    },

    _orderItemsByDate: function(){
        var r = this._cartItems
        r.sort(this._sortByDate)
	//r.sort(this._sortAutoPid)
        return r
    },

    _sortByDate: function(aa,bb) {
            if ( parseInt(aa.addedDate.getTime() /1000) == parseInt(bb.addedDate.getTime() /1000) && aa.autoPid && !bb.autoPid)
                return 1;
            if ( parseInt(aa.addedDate.getTime() /1000) == parseInt(bb.addedDate.getTime() /1000) && !aa.autoPid && bb.autoPid)
                return -1;
            if (aa.addedDate < bb.addedDate)
                return 1;
            if (aa.addedDate > bb.addedDate)
                return -1;
            return 0;
    },

    _sortAutoPid: function(aa,bb) {
            if (aa.autoPid &&  !bb.autoPid)
                return 1;
            return 0;
    },

    _sortByDisplayIndex: function(aa,bb) {
            if (aa.displayIndex > bb.displayIndex)
                return 1;
            if (aa.displayIndex < bb.displayIndex)
                return -1;
            return 0;
    },

    _getOrderSummary: function() {
        ShoppingCartServiceWrapper.getCostSummary(function(response) {
            var orderSummary = {
                totalItems: this.totalItemsInCart,
                itemSubTotal: response.subtotal.amount,
                tax: this._getCartTax(response.taxes),
                shippingTotal: response.shippingTotal.amount,
                orderSpecialHandlingAmount: response.specialHandlingAmount.amount,
                giftWrapTotal: response.giftWrapCharges.total.amount,
                discountTotal: response.discountTotal.amount,
                total: response.total.amount,
                cartPromos: this._getCartPromos(response)
            }
            this.fire(':summaryUpdated', {response:response, orderSummary:orderSummary})
        }.bind(this))

    },

    _getCartTax: function(data){
        return {salesTax:data.salesTax.amount, shippingTax: data.shippingTax.amount, totalTax: data.total.amount};
    },

    _getCartPromos: function(data){
        return {giftWrap:data.giftWrapPromotionSummary, service:data.servicePromotionSummary, shippingPromo:data.shippingPromotionSummary, valuePromo: data.valuePromotionSummary};
    },

    // Cart Calls
    getCart: function(action){
        ShoppingCartServiceWrapper.getDWRCartSummary(function(response) {

            this.totalItemsInCart = response.numberOfItems;
            this._cartTotal = response.total;
            this._cartItems = Object.toArray(response.cartItems);
            this.fire(':cartResponse', {response:response.cartItems})

            if(this.totalItemsInCart == 0) {
                $(document.body).fire(':cartEmpty');
            }
	}.bind(this));

        return this;
    },

    _getCartItems: function(numItems){
        ShoppingCartServiceWrapper.getDisplayableItems(function(response) {
            Df.console.log(response)
            this._cartItems = Object.toArray(response)
            this.fire(':cartResponse', {response:response})
        }.bind(this))

        return this
    },

    _removeItem: function(e){
        var prod = this._cartProds[e.memo.uniqueLineId]
        ShoppingCartServiceWrapper.remove(prod.uniqueLineId, function(response){
            this.fire(':cartRequestComplete', {response: response})
        }.bind(this));
        this.pars.miniCart.fire('mc:fireAnalytics', {event:'removeItem', prod:prod})
    },

    _updateCartItem: function(e){
        this._setupCartActionObservers()
        var updateRequest = {uniqueCartItemId:e.memo.uniqueLineId, quantity:e.memo.quantity};
        ShoppingCartServiceWrapper.update(updateRequest, function(response) {
            this.fire(':cartRequestComplete', {response:response})
        }.bind(this))
    },

    _replaceCartItem: function(e){
       this._setupCartActionObservers()
       var editRequest = {productId:e.memo.productId, skuId:e.memo.skuId, quantity:e.memo.quantity, uniqueCartItemId:e.memo.uniqueLineId}; // bs - blackshirt
        ShoppingCartServiceWrapper.edit("EditStandardItem", editRequest, function(response) {
            this.fire(':cartRequestComplete', {response: response})
        }.bind(this))
    },

    _addToCart: function(e){
        this._setupCartActionObservers()
        var addRequest
        var requestType = "AddStandardItem"
        /*
         *	Valid Request Types:
         *	AddStandardItem
         *       AddGiftCertificate
         *       AddGiftCard
         */
        if(e.memo.requestType){
            requestType = e.memo.requestType
        }
        
        var cartAddSrc = "ES";
        if (e.memo.cartAddSrc) {
            cartAddSrc = e.memo.cartAddSrc;
        }

        e.memo.products.each(function(v){
            addRequest = {}
            for (i in v){
                addRequest[i] = v[i]
            }

            var tempCart = this.getCart();
            var analyticsEmptyCart = false;
            if(tempCart.totalItemsInCart == 0) {
            	analyticsEmptyCart = true;
            }
            ShoppingCartServiceWrapper.add(requestType, addRequest, function(response) {
              this.fire(':cartRequestComplete', {response: response})

              if(response[0].toString() == "OK"){
                  this.pars.miniCart.fire('mc:fireAnalytics', {event:'addItem', cartAddSrc: cartAddSrc, prod:v, analyticsEmptyCart:analyticsEmptyCart})
                  $(document.body).fire(':addToCartSuccess', {response:e.memo.response})
              }
            }.bind(this))
        }.bind(this))
    },

    createProductCacheManager: function(){
        return new Store.ProductCacheManager(this.pars.productService)
    }
})

Store.CrossSells = Class.create(Df.Base, {

    _setup:function($super){
        $super()

        this._crossSellData
        this.productCacheManager = this.createProductCacheManager()
        this.parser = new ZParse(Implementation);

        this.__processCrossSellResponse = this._processCrossSellResponse.bindAsEventListener(this)
        this.__renderXsell = this._renderXsell.bindAsEventListener(this)

        if(this.pars.type == 'categoryData'){
            this.__getCrossSells = this._getCategoryInfo.bindAsEventListener(this)
        }else{
            this.__getCrossSells = this._getCrossSells.bindAsEventListener(this)
        }

        this._listeners();
    },

    _initPars: function($super, pars){
        $super()
        this.setPars({
            type:'cart',  // cart, expressShop, parametric
                errorEvent: ':esCrossSellsError',
            completeEvent:':cartCrossSellsComplete',
            responseEvent:':cartCrossSellResponse',
            url:'/proxy/bbw/xsell/cart/product/',
            productDataUrl:'/proxy/bbw/catalog/',
            format:'xml',
            appId:Store.vars.appId,
            catId:'3361802',
            stoken:Store.vars.stoken,
            locale:Store.vars.locale,
            storeCode:Store.vars.storeCode,
            xsltUri:'xsl/allurent/crosssell.xsl',
            template:false,
                parentNode: $(document.body),
                renderToElement: false,
            crossSellClickEvent:':cartCrossSellClick'
        })
        this.setPars(pars)
    },

    _listeners: function(){
        this.observe(this.pars.responseEvent, this.__processCrossSellResponse)
        this.observe(':getCrossSells', this.__getCrossSells)

        this.productCacheManager.observe(':ItemSelection', function(e){
            if(this.pars.renderToElement){
                this.fire(':renderXsell', {data: e.memo.object})
            }else{
                $(document.body).fire(this.pars.completeEvent, {data: e.memo.object})
            }
        }.bind(this))

        if(this.pars.renderToElement)
            this.observe(':renderXsell', this.__renderXsell)

    },

    _getCrossSells: function(e){
        new Ajax.Request(this.pars.url, {
            method:'get',
            parameters: {
            format:this.pars.format,
            appId:this.pars.appId,
            catId:this.pars.catId,
            stoken:this.pars.stoken,
            locale:this.pars.locale,
            storeCode:this.pars.storeCode,
            xsltUri:this.pars.xsltUri,
            productId:e.memo.pids
            },
            onSuccess: function(response){
            this.fire(this.pars.responseEvent, {response:response.responseText})
            }.bind(this)
        })

    },

    _getCategoryInfo: function(e){
        new Ajax.Request(this.pars.url, {
            method:'get',
            parameters: {
            format:this.pars.format,
            appId:this.pars.appId,
            catId:this.pars.catId,
            stoken:this.pars.stoken,
            locale:this.pars.locale,
            storeCode:this.pars.storeCode,
            xsltUri:this.pars.xsltUri
            },
            onSuccess: function(response){
            this.fire(this.pars.responseEvent, {response:response.responseText})
            }.bind(this)
        })
    },

    _processCrossSellResponse: function(e){
        this._crossSellData = new Df.XMLDocument(e.memo.response)
        var xsellHash = []
        nodes = this._crossSellData.xpath('//ProductRoot')

        for (var i=0;i<nodes.length;){
            i++
            xsellHash.push(this._crossSellData.getNodeValue('//ProductRoot['+i+']/productId'))
        }

        if(this.pars.renderToElement){
            this.pars.parentNode.select(this.pars.renderToElement).each(function(v){
                    v.innerHTML = ''
            })
        }

        this.productCacheManager.get(xsellHash)
    },

    createProductCacheManager: function(){
        return new Store.ProductCacheManager({
            ajaxRequestOptions: {
            method: 'get',
            parameters: {
                format:'json',
                appId:this.pars.appId,
                catId:this.pars.catId,
                stoken:this.pars.stoken,
                locale:this.pars.locale,
                storeCode:this.pars.storeCode
            }
            },
            serviceBaseUrl: this.pars.productDataUrl,
            cacheInstance: $H(),
            uri: 'productId'
        })
    },

    _renderXsell: function(e){
        try{
            this.xsells = Object.toArray(e.memo.data)
            this.xsellsIds = []

            var basicData = []

            this.xsells.each(function(v){
                basicData.push({
                    imageSrc:v.getImages().getBy({view:'main', type:'T50'})[0].src,
                    title:v.pars.longTitle
                })

                this.xsellsIds.push(v.pars.productId)
            }.bind(this))

            this.pars.parentNode.select(this.pars.renderToElement).each(function(v){
                v.update(Store.TemplateProcessor.processTemplate(this.pars.template, {data:this.xsells, basicData:basicData}))

                v.childElements().each(function(vv, i){
                    vv.observe('click', function(e){
                            this.fire(this.pars.crossSellClickEvent, {pid:this.xsells[i].pars.productId, prod:this.xsells[i], xsells:this.xsellsIds})//xsells:this.xsellsIds.without(this.xsells[i].pars.productId)})
                    }.bind(this))
                }.bind(this))
            }.bind(this))

            this._fireCompleteEvent.defer(this.pars.completeEvent, e.memo.object)
        }catch(e){
                Df.console.log('error',e)
                $(document.body).fire(this.pars.errorEvent, {error: e})
        }
    },

    _fireCompleteEvent: function(e, o){
        $(document.body).fire(e, {data: o})
    }

})

Store.PromoEngine = Class.create(Df.Base, {
     _setup:function($super){
    $super()

    this.__handlePromoResponse = this._handlePromoResponse.bindAsEventListener(this)
    this.observe(this.pars.responseEvent, this.__handlePromoResponse)
        this.promos = []

    },

    _initPars: function($super, pars){
        $super()
        this.setPars({
            completevent:':cartPromoComplete',
            responseEvent:':cartPromoResponse',
            errorEvent: ':cartPromoError',
            basePromoUrl:'/promo/promotioninquiryservices/svc/promotionservices/1.0/promotions/for/products/',
            extendedPromoUrl:'/for/store/TSA?format=json', //to be overwritten
            productDataUrl:'/bbw/catalog/',
            xsltUri:'xsl/allurent/crosssell.xsl',
            responseHandler: this._handlePromoResponse,
            parentNode: $(document.body),
            renderToElement: false,
	    maxPromos: false
        })
        this.setPars(pars)
    },

    getPromosByProducts: function(pids){
        new Ajax.Request(this.pars.basePromoUrl+pids+this.pars.extendedPromoUrl, {
            method: 'get',
            onSuccess:function(response){
                this.fire(this.pars.responseEvent, {response:response})
            }.bind(this)
        });
    },

    _handlePromoResponse: function(e){
        //override this function if you want to use xml
        if(e.memo.response.responseJSON.PromotionServiceErrorResponse){
            this.fire(this.pars.errorEvent, {response:e.memo.response.responseJSON})
        }else{
            this.promos = e.memo.response.responseJSON.PromotionInquiryResponse.ItemPromotions.Promotions.Promotion

            if(this.pars.maxPromos && this.promos.length > this.pars.maxPromos){
                var p = []

                for(var i=0;i<this.pars.maxPromos;i++){
                    p.push(this.promos[i])
                }
                e.memo.response.responseJSON.PromotionInquiryResponse.ItemPromotions.Promotions.Promotion = p
                this.promos = p
            }

            if(this.pars.renderToElement){
                this._renderPromos.bind(this).defer()
            }else{
                this.fire(this.pars.completeEvent, {promos:e.memo.response.responseJSON})
            }
        }
    },

    _renderPromos: function(){
        this.pars.parentNode.select(this.pars.renderToElement).each(function(v){
            v.insert(Store.TemplateProcessor.processTemplate(this.pars.promoTemplate, {promos:this.promos}))
        }.bind(this))
    }
})

Store.TemplateProcessor = {

    parser: new ZParse(Implementation),

    processTemplate: function(template, data){
	var succ = Store.TemplateProcessor.parser.parse(template);
	if(succ){
	    return Store.TemplateProcessor.parser.process(data)
	}
	return false
    }
}

Store.bookmarkThis = function(title, url){
    if (window.sidebar) { // Mozilla Firefox Bookmark
        window.sidebar.addPanel(title, url,"");
    } else if( window.external ) { // IE Favorite
        window.external.AddFavorite( url, title);
    } else if(window.opera && window.print) { // Opera Hotlist
        return true;
    } else if (Prototype.Browser.WebKit) {
        alert("You need to press Command/Cmd + D to bookmark our site.");
    } else {
        alert("In order to bookmark this site you need to do so manually through your browser.");
    }
}

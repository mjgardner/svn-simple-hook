/** 
 * Provides Peacocks-specific product hover functionality for visual effects.
 *
 * @param options Options to initialize the object. If no 
 *                options are provided the default settings are used. See
 *                available options in the settings object below.
 */
var ProductHover = function(options) {
    
    // Default settings -- will be overriden by options if provided
    var settings = Object.extend({
        
        // Buy It Now class
        buyItNowClass: 'buy-it-now', 
        
        // Product container ID
        productContainerId: 'products', 
        
        // Product item class
        productItemClass: 'hproduct', 
        
        // Class name that gets applied to show the product highlight background
        showClass: 'show',
		
		// Class names that identify product item position in row
		positionClass: {
		    left: 'p-left',
		    center: 'p-center',
		    right: 'p-right',
		    last: 'p-last'
		},
		
		// Number of products displayed per row
		productsPerRow: 4,
		
		// Additional offsets for background image. Left offsets can vary 
		// depending on position of product element.
		offset: {
		    top: 344,
		    left: -3,
		    center: -63,
		    right: -66,
		    last: -66
		}
    }, options);
    
    // Indicator if hover state is currently set
    var isHoverState = false;
    
    // Selector for Buy It Now element
    var buyItNowSelector = "." + settings.buyItNowClass;
    
    // Product container element
    var productContainer = $(settings.productContainerId);
    
    // Selector for product item
    var productItemSelector = "." + settings.productItemClass;
    
    // Current highlighted product element
    var currentProductElement = null;
    
    // Current visible Buy It Now element
    var currentBuyItNowElement = null;
    
    /**
     * Initialize event observer and define appropriate actions
     */
    this.init = function() {
        var products = $('products');
        
        if (products) {
            // Products mouseover / mouseout observer
            products.observe('mouseover', setHoverState.bindAsEventListener(this));
            products.observe('mouseout', removeHoverState.bindAsEventListener(this));
            
            // Products click observer
            products.observe('click', clickHandler.bindAsEventListener(this));
    
            // Event observer to open express shop / mini cart
            $(document.body).observe(':openEsMc', openEsMc.bindAsEventListener(this));
            
            // Event observer to close express shop / mini cart
            $(document.body).observe(':closeEsMc', closeEsMc.bindAsEventListener(this));
        }
    }
    
    /** 
     * Click event handler
     *
     * @param e Event object
     */
    function clickHandler(e) {
        var target = Event.element(e);
            
        // If buy it now was clicked
        if (target.hasClassName(settings.buyItNowClass)) {
            buyItNow(e);
        }
    }
    
    /** 
     * Start buy it now express shop process
     *
     * @param e Event object
     */
    function buyItNow(e) {
        if (isHoverState) return false;
     
        isHoverState = true;
        currentBuyItNowElement.addClassName('show-hover');
        var prd = getParentElement(e, productItemSelector);
        
        // Position express shop popup
        if (prd.hasClassName(settings.positionClass.right)) {
            // to the left of buy it now button
            positionElement(prd, $('ins1'), -181, 147);
        } else {
            // to the right of buy it now button
            positionElement(prd, $('ins1'), 125, 147);
        }
        
        // Fire loadProduct event to trigger express shop popup
        $(document.body).fire(':loadProduct', {
            productId: prd.id.split('-')[1]
        });
    }
    
    /** 
     * Open Express Shop / Mini Cart window
     */
    function openEsMc() {
        isHoverState = true;
        $('ins1').show();
    }
    
    /** 
     * Close Express Shop / Mini Cart window
     */
    function closeEsMc() {
        isHoverState = false;
        currentProductElement.removeClassName('bb-white');
        currentBuyItNowElement.removeClassName('show-hover');
        $('ins1').hide();
    }
    
    /** 
     * Set hover state for product item
     *
     * @param e Event object
     */
    function setHoverState(e) {
        if (isHoverState) return false;
        
        // Get product item element that was hovered over
        var target = Event.element(e);
        if (target == null || typeof(target) == 'undefined' || target.id == settings.productContainerId) {
            return false;
        } else if (!target.hasClassName("hproduct")) {
            target = target.up(productItemSelector);
        }
        
        // Store target element in class variable for later use
        currentProductElement = target;
        
        // Get and set positioned offset of product item
        // Note: positionedOffset requires product container to be positioned relative
        var offset = target.positionedOffset(); 
        offset.top = offset.top + settings.offset.top;
        
        // Set product container class name based on class name of hovered item
        if (target.hasClassName(settings.positionClass.left)) {
            productContainer.className = settings.positionClass.left;
            offset.left = offset.left + settings.offset.left;
        }
        else if (target.hasClassName(settings.positionClass.center)) {
            productContainer.className = settings.positionClass.center;
            offset.left = offset.left + settings.offset.center;
        }
        else if (target.hasClassName(settings.positionClass.right)) {
            productContainer.className = settings.positionClass.right;
            offset.left = offset.left + settings.offset.right;
        }
        else if (target.hasClassName(settings.positionClass.last)) {
            productContainer.className = settings.positionClass.last;
            offset.left = offset.left + settings.offset.last;
        }
        
        // Hide bottom border of hovered item
        target.addClassName('bb-white');
        
        // Set background position based on offset
        productContainer.setStyle({
                backgroundPosition: offset.left+'px '+offset.top+'px'
        });
        
        // Set buy it now button for this product item
        setBuyItNowButton(target);
    }
    
    /** 
     * Remove hover state for product item
     *
     * @param e The event triggered
     */
    function removeHoverState(e) {
        if (isHoverState) return false;
        
        try {
            productContainer.className = "";
            currentProductElement.removeClassName('bb-white');
            currentBuyItNowElement.removeClassName(settings.showClass);
        } catch(err) {}
    }
    
    /**
     * Set Buy It Now button
     *
     * @param productItem Product item that contains buy it now button
     */
    function setBuyItNowButton(productItem) {
        try {
            currentBuyItNowElement = productItem.down(buyItNowSelector);
            currentBuyItNowElement.addClassName(settings.showClass);
        } catch(err) {}
    }
    
    /** 
     * Position a target element relative to a source element
     *
     * @param srcElement Source element which position is cloned
     * @param targetElement Target element to be positioned relative to the source element 
     * @param offsetTop The target element's top offset relative to the source element
     * @param offsetLeft The target element's left offset relative to the source element
     */
    function positionElement(srcElement, targetElement, offsetLeft, offsetTop) {
        var offset = srcElement.positionedOffset(); 
        targetElement.setStyle({top: (offset.top+offsetTop)+'px', left: (offset.left+offsetLeft)+'px'});
    }
    
    /**
     * Return first parent element of the element which fired the event that matches selector
     *
     * @param e Event object
     * @param selector CSS selector to match the parent element
     */
    function getParentElement(e, selector) {
        return Event.findElement(e, selector);
    }
}

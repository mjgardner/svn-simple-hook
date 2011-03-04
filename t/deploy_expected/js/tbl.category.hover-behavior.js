/** 
 * The custom Peacocks hover behavior class provides functionality for visual 
 * effects, such as hover states, and supports the display of the core express
 * shop implementation.
 *
 * @param options Options to initialize the custom hover behavior class. If no 
 *                options are provided the default options are used. See
 *                available options in the settings object below.
 */
var HoverBehavior = function(options) {
    
    // Global indicator if express shop or mini cart is currently being displayed
    var esmcIsExpanded = false;
    
    // Default settings -- will be overriden by options (if provided)
    var settings = Object.extend({
        
        // Bottom extend element ID
        bottomExtendId: 'prd-bottom-extend', 
        
        // Buy It Now class
        buyItNowClass: 'buy-it-now', 
        
        // Product item class
        productClass: 'hproduct', 
        
        // Class name that gets applied to show/hide the extend element
        showExtensionClass: 'show', 
        hideExtensionClass: 'hidden',
		
		// Class names that gets applied to extend element when hovering over 
		// left/center/right/last product item
		extendClass: {
		    left: 'left',
		    center: 'center',
		    right: 'right',
		    last: 'last'
		},
		
		// Number of products displayed per row
		productsPerRow: 4,
		
		// Offsets for bottom extend element relative to product element. Left offsets can vary 
		// depending on position of product element. NOTE: Only use offset values if it is not 
		// possible to adjust the position via CSS (positive and negative margins should do).
		offset: {
		    top: 0,
		    leftLeft: 0,
		    leftCenter: 0,
		    leftRight: 0,
		    leftLast: 0
		}
    }, options);
    
    // Element used to visually extend product item
    var bottomExtend = null;
    
    // Selector for Buy It Now element
    var buyItNowSelector = "." + settings.buyItNowClass;
    
    // Selector for product item
    var productSelector = "." + settings.productClass;
    
    // Current highlighted product element
    var currentProductElement = null;
    
    // Current applied extension class (left,center,right,last)
    var currentBottomExtendClass = "";
    
    // Current visible Buy It Now element
    var currentBuyItNowElement = null;
    
    /**
     * Initialize event listeners and define appropriate actions
     */
    this.init = function() {
        var i = 0;
        
        // Add bottom extend element
        $(document.body).e('div', 'bottom', {id:settings.bottomExtendId});
        bottomExtend = $(settings.bottomExtendId);
        
        // Mouseover / Mouseout events for product elements
        $$(productSelector).each(function(product) {
            i++;
            
            // Bind different event listener depending on product's position in row
            if (((i-1) % settings.productsPerRow) === 0) { // left
                product.observe('mouseover', setMouseOverState.bindAsEventListener(this, settings.extendClass.left));
            } else if ((i % settings.productsPerRow) === 0) { // right
                product.observe('mouseover', setMouseOverState.bindAsEventListener(this, settings.extendClass.right));
            } else { // center
                product.observe('mouseover', setMouseOverState.bindAsEventListener(this, settings.extendClass.center));
            }
            
            // Hide on mouseout
            product.observe('mouseout', removeMouseOverState.bindAsEventListener(this));
        }.bind(this));
        
        // If last product element is not last in row, set different event (for styling)
        if ((i % settings.productsPerRow) !== 0) {
            var lastPrd = $$('#products li' + productSelector + ':last-child')[0];
			var lastItemClass = settings.extendClass.last;
            
			// If last product element is not at first position in row, apply right extend class
            if (((i-1) % settings.productsPerRow) !== 0)
                lastItemClass = settings.extendClass.right;
            
			// Remove existing event listeners and set new one for last product item
            lastPrd.stopObserving('mouseover');
            lastPrd.observe('mouseover', setMouseOverState.bindAsEventListener(this, lastItemClass));
        }
        
        // Mouseover event for bottom extend
        bottomExtend.observe('mouseover', function(event) {
            bottomExtend.className = currentBottomExtendClass;
            currentBuyItNowElement.addClassName(settings.showExtensionClass);
            currentProductElement.addClassName('bb-white');
        }.bind(this));
        
        // Mouseout event for bottom extend
        bottomExtend.observe('mouseout', removeMouseOverState.bindAsEventListener(this));
        
        // Click event for buy it now button
        $$(buyItNowSelector).each(function(el) {
            el.observe('click', function(event) {
                esmcIsExpanded = true;
                currentBuyItNowElement.addClassName('show-hover');
                var prd = getParentElement(event, productSelector);
                
                // Position express shop popup
                positionElement(currentBuyItNowElement, $('ins1'), -114, 125);
                
                // Fire loadProduct event to trigger express shop popup
                $(document.body).fire(':loadProduct', {
                    productId: prd.id.split('-')[1]
                });
            }.bind(this));
        }.bind(this));
        
        // Event handler to close express shop / mini cart
        $(document.body).observe(':closeEsMc', function(e) {
            esmcIsExpanded = false;
            currentProductElement.removeClassName('bb-white');
            currentBuyItNowElement.removeClassName('show-hover');
            $('ins1').hide();
        }.bind(this));
        
        // Event handler to open express shop / mini cart
        $(document.body).observe(':openEsMc', function(e) {
            esmcIsExpanded = true;
            $('ins1').show();
        }.bind(this));
    }
    
    /** 
     * Set express shop specific mouse over state (show bottom extend element + Buy It Now button)
     *
     * @param event The event triggered
     * @param className The class name to be applied to the extend element
     * @param offsetTop The top offset relative to the current product element
     * @param offsetLeft The left offset relative to the current product element
     */
    function setMouseOverState(event, className) {
        if (esmcIsExpanded) return false;
        
        var offsetLeft = settings.offset.leftCenter; // Default to center left offset
        
        // Find left offset (top offset is the same for all)
        switch(className) {
            case settings.extendClass.left: 
                offsetLeft = settings.offset.leftLeft;
                break;
            case settings.extendClass.right: 
                offsetLeft = settings.offset.leftRight;
                break;
            case settings.extendClass.last: 
                offsetLeft = settings.offset.leftLast;
                break;
        }
        
        // Get current product element and position bottom extend element relative to it
        currentProductElement = getParentElement(event, productSelector);
        positionElement(currentProductElement, bottomExtend, settings.offset.top, offsetLeft);
        
        // Set class names
        currentBottomExtendClass = className;
        bottomExtend.removeClassName(settings.hideExtensionClass);
        bottomExtend.addClassName(className);
        currentProductElement.addClassName('bb-white');
        
        // Show Buy It Now button for current product element
        currentBuyItNowElement = currentProductElement.down(buyItNowSelector);
        currentBuyItNowElement.addClassName(settings.showExtensionClass);
    }
	
	/*
	 * Remove express shop specific mouse over state (hide bottom extend element + Buy It Now button)
	 */
	function removeMouseOverState() {
		if (esmcIsExpanded) return false;
		
		try {
            removeClassNames(bottomExtend);
            bottomExtend.addClassName(settings.hideExtensionClass);
            currentBuyItNowElement.removeClassName(settings.showExtensionClass);
            currentProductElement.removeClassName('bb-white');
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
    function positionElement(srcElement, targetElement, offsetTop, offsetLeft) {
        try {
            targetElement.clonePosition(srcElement, {
                setWidth: false, 
                setHeight: false, 
                offsetTop: offsetTop, 
                offsetLeft: offsetLeft
            });
        } catch(err) {}
    }
    
    /**
     * Return first parent element of the element which fired the event that matches selector
     *
     * @param event The event triggered
     * @param selector CSS selector to match the parent element
     */
    function getParentElement(event, selector) {
        return Event.findElement(event, selector);
    }
    
    /** 
     * Remove all class names of the given element 
     *
     * @param element Element of which all classes are being removed
     */
    function removeClassNames(element) {
        var classes = element.classNames();
        classes.each(function(className) {
            element.removeClassName(className);
        });
    }
};
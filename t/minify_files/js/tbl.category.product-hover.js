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
		productsPerRow: 3,
		
		// Additional offsets for background image. Left offsets can vary 
		// depending on position of product element.
		offset: {
		    top: 354,
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
     * Initialize event listeners and define appropriate actions
     */
    this.init = function() {
        
        // Mouseover / Mouseout observer
		if ( $('products' ) ) {
			$('products').observe('mouseover', setHoverState.bindAsEventListener(this));
			$('products').observe('mouseout', removeHoverState.bindAsEventListener(this));
		}
        
        // Click event for buy it now button
        $$(buyItNowSelector).each(function(el) {
            el.observe('click', function(event) {
                isHoverState = true;
                currentBuyItNowElement.addClassName('show-hover');
                var prd = getParentElement(event, productItemSelector);
                
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
            isHoverState = false;
            currentProductElement.removeClassName('bb-white');
            currentBuyItNowElement.removeClassName('show-hover');
            $('ins1').hide();
        }.bind(this));
        
        // Event handler to open express shop / mini cart
        $(document.body).observe(':openEsMc', function(e) {
            isHoverState = true;
            $('ins1').show();
        }.bind(this));
    }
    
    /** 
     * Set hover state for product item
     *
     * @param event The event triggered
     */
    function setHoverState(e) {
        if (isHoverState) return false;
        
        // Get product item element that was hovered over
        var target = Event.element(e);
        if (target.id == settings.productContainerId) {
            target = target.down(productItemSelector);
        } else if (!target.hasClassName("hproduct")) {
            target = target.up(productItemSelector);
        }
        
        // Store target element in class variable for later use
        currentProductElement = target;
        
        // Get offset of product item
        //var offset = target.cumulativeOffset();
        var offset = target.positionedOffset();
        offset.top = offset.top + settings.offset.top;
        
        // Set class names
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
     * @param event The event triggered
     */
    function removeHoverState(e) {
        if (isHoverState) return false;
        
        productContainer.className = "";
        currentProductElement.removeClassName('bb-white');
        currentBuyItNowElement.removeClassName(settings.showClass);
    }
    
    /**
     * Set Buy It Now button
     *
     * @param productItem Product item that contains buy it now button
     */
    function setBuyItNowButton(productItem) {
        currentBuyItNowElement = productItem.down(buyItNowSelector);
        currentBuyItNowElement.addClassName(settings.showClass);
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
}

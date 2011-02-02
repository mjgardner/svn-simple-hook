/** 
 * Color drawer functionality for Peacocks 
 */
var ColorDrawer = Class.create({
    initialize: function() {
        this.moreColorsClass = "more-colors";
        this.closeColorsClass = "close-colors";
        this.productSelector = '.hproduct';
        this.colorsContainerSelector = '.colors';
    },
    
    /* Set event listeners */
    setEvents: function() {
        var products = $('products');

        if (products) {
            products.observe('click', function(event) {
                var target = Event.element(event);

                if (target.hasClassName(this.moreColorsClass)) {
                    this.showDrawer(event);
                } else if (target.hasClassName(this.closeColorsClass)) {
                    this.hideDrawer(event);
                }
            }.bind(this));
        }
    },
    
    /* Show color drawer */
    showDrawer: function(event) {
        var showBtn = Event.element(event);
        var closeBtn = this.getCloseBtn(event);
        var drawer = this.getDrawer(event);

        if (!drawer) 
            return false;
        
        // If already open, close it
        if (drawer.hasClassName('show-block')) {
            this.hideDrawer(event);
            return false;
        }
        
        drawer.clonePosition(showBtn, {
            setWidth: false, 
            setHeight: false, 
            offsetTop: -drawer.getHeight(), 
            offsetLeft: -15
        });
        
        drawer.addClassName('show-block');
        closeBtn.addClassName('show-inline-block');
        
        this.isOpen = true;
    },
    
    /* Hide color drawer */
    hideDrawer: function(event) {
        var closeBtn = this.getCloseBtn(event);
        var drawer = this.getDrawer(event);
        
        drawer.removeClassName('show-block');
        closeBtn.removeClassName('show-inline-block');
    },
    
    /* Get color drawer of product element within which the event was fired */
    getDrawer: function(event) {
        var prd = Event.findElement(event, this.productSelector);
        return prd.down(this.colorsContainerSelector);
    },
    
    /* Get close color button of product element within which the event was fired */
    getCloseBtn: function(event) {
        var prd = Event.findElement(event, this.productSelector);
        return prd.down("."+this.closeColorsClass);
    }
});

/** Color drawer functionality for Timberland */
var ColorDrawer = Class.create({
    initialize: function() {
        this.moreColorsClass = ".more-colors";
        this.closeColorsClass = ".close-colors";
		this.closeColorsLiClass = ".close-colors-li";
        this.productSelector = '.hproduct';
        this.colorsContainerSelector = '.colors';
		this.moreColorsSwatchClass = '.more-colors-swatch';
		this.isDrawerOpening = false;
		
    },
    
    /* Set event listeners */
    setEvents: function() {
    	
        $$(this.moreColorsClass).each(function(el) {
            el.observe('click', this.showDrawer.bind(this)).writeAttribute('href', 'javascript:void(0);');
        }.bind(this));
        
        /*$$(this.closeColorsClass + ', ' + this.closeColorsLiClass).each(function(el) {
            el.observe('click', this.hideDrawer.bind(this));
        }.bind(this));
		
		$$(this.closeColorsLiClass).each(function(el) {
            el.observe('click', this.hideDrawer.bind(this));
        }.bind(this));
		*/
		$$('.close-colors-li a').each(function(el){
			var href = el.readAttribute('href');
			if (href!='javascript:void(0);') el.writeAttribute('rel', href).writeAttribute('href', 'javascript:void(0);');
		});
		
		////sort and filter additions - hide if only 1 color.
		var allColorDrawers = $$(".colors")
		var len = allColorDrawers.length;
		for(var i=0; i<len; i++) {
			var childrn = allColorDrawers[i].select('li.close-colors-li');
			if(childrn.length <= 1){
					allColorDrawers[i].setStyle({'display': 'none'});
			}
		
		}; 
    }//, hiding comma from IE6 & 7, if you use any of the functions below be sure to add it back in.
    
    /* Show color drawer 
    showDrawer: function(event) {
        var showBtn = Event.element(event);
        //var closeBtn = this.getCloseBtn(event);
        var drawer = this.getDrawer(event);
		this.isDrawerOpening = true;

        if (!drawer)
            return false;
        
        // If already open, close it
        if (drawer.hasClassName('show-block') && !this.isDrawerOpening) {
            this.hideDrawer(event);
            return false;
        }
        
        drawer.clonePosition(showBtn, {
            setWidth: false,
            setHeight: false,
            offsetTop: -23,
            offsetLeft: -3
        });
        
        drawer.addClassName('show-block');
        //closeBtn.addClassName('show-inline-block').setStyle({ display: 'inline-block' });
		
        this.isOpen = true;
		setTimeout(function(){ this.isDrawerOpening = false; }, 500);
    },
    
    /* Hide color drawer 
    hideDrawer: function(event) {
        //var closeBtn = this.getCloseBtn(event);
        var drawer = this.getDrawer(event);
        
        drawer.removeClassName('show-block');
        //closeBtn.removeClassName('show-inline-block').setStyle({ display: 'none' });
    },
    
    /* Get color drawer of product element within which the event was fired 
    getDrawer: function(event) {
        var prd = Event.findElement(event, this.productSelector);
        return prd.down(this.colorsContainerSelector);
    },
    
    /* Get close color button of product element within which the event was fired 
    getCloseBtn: function(event) {
        var prd = Event.findElement(event, this.productSelector);
        return prd.down(this.closeColorsClass);
    }*/
});

$(document).observe('dom:loaded', function(e){
var tempp = new ColorDrawer();
tempp.setEvents();
});
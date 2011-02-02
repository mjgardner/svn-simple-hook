/*
 event:		:loaded
 event:		:loading
 event:		:zoomIn
 event:		:zoomOut
 event:		:zoomTo
 event:		:zoomInc
 event:		:zoomDec
*/
Df.EmbeddedZoom = Class.create(Df.Ui, {
	initialize: function($super, element, pars){
		$super(element, pars)
		
		/** @private */
		this.loader;
		
		/** @private */
		this.image
		
		/** @private */
		this.base = $(new Image());
		
		/** @private */
		this.baseAnimation;
		this._baseAnimationCompleteEvent = this.baseAnimationCompleteEvent.bindAsEventListener(this)
		
		/** @private */
		this.loaderAnimation;
		this._loaderAnimationCompleteEvent = this.loaderAnimationCompleteEvent.bindAsEventListener(this)
		
		/** @private */
		this.zoomAnimation;
		this._zoomAnimationCompleteEvent = this.zoomAnimationCompleteEvent.bindAsEventListener(this)
		
		/** @private */
		this.index;
		
		/** @private */
		this.maxHeight;
		
		/** @private */
		this.maxWidth;
		
		/** @private */
		this.baseHeight;
		
		/** @private */
		this.baseWidth;
		
		/** @private */
		this.out = false;
		
		/** @private */
		this.moveable = false;
		
		/** @private */
		this.startPointerX;
		/** @private */
		this.startPointerY;
		/** @private */
		this.startImageTop;
		/** @private */
		this.startImageLeft;
		
		this._zoomIn = this.zoomIn.bindAsEventListener(this)
		this._zoomOut = this.zoomOut.bindAsEventListener(this)
		this._zoomTo = this.zoomTo.bindAsEventListener(this)
		
		this.holderDims()
		
		//build elements
		this.buildBaseImage()
		this.buildLoader()
		
		//event handlers
		if(this.pars.zoomEvent == 'hover'){
			this.holderHoverEvent()
		}else if(this.pars.zoomEvent == 'click'){
			this.holderClickEvent()
		}
		
		if (this.pars.moveEvent === 'drag') {
			this.documentMouseUpEvent()
		}
		
		return this
	},
	
	_initPars: function($super, pars){
		$super()
		this.setPars({
			pauseToClose: 1000, //int|false
			pauseToOpen: 500, //int|false
			moveEvent: 'hover', //hover|drag
			zoomEvent: 'click', //click|hover
			loader: false,
			images: {},
			classNames: {
				base: 'base',
				zoom: 'zoom'
			}
		});
		this.setPars(pars)
	},
	
	zoomTo: function(e){
		e.memo.decimal = e.memo.decimal.toRange(0,1)
		if(e.memo.decimal != this.decimal){
			
			this.decimal = e.memo.decimal
			
			if(this.decimal == 0){
				this.moveable = false
				this.element.style.cursor = 'pointer';
			}
			
			var height = ((this.maxHeight - this.baseHeight) * this.decimal) + this.baseHeight
			var width = ((this.maxWidth - this.baseWidth) * this.decimal) + this.baseWidth
			
			if(e.memo.event){
				var top = - parseInt((this.element.getPointerY(e.memo.event) / this.baseHeight) * (height - this.baseHeight))
				var left = - parseInt((this.element.getPointerX(e.memo.event) / this.baseWidth) * (width - this.baseWidth))
			} else {
				var top = (parseInt(this.image.style.top) - ((height - parseInt(this.image.style.height)) / 2)).toRange(-height + this.baseHeight, 0)
				var left =  (parseInt(this.image.style.left) - ((width - parseInt(this.image.style.width)) / 2)).toRange(-width + this.baseWidth, 0)
			}
			
			this.image.style.visibility = "visible";
			
			this.zoomAnimation.run({
				top: top,
				left: left,
				height: height,
				width: width
			});
		}
	},
	
	zoomAnimationCompleteEvent: function(e){
		if(this.decimal == 0){
			this.image.style.visibility = "hidden";
		} else {
			if (this.pars.moveEvent === 'hover') {
				this.moveable = true;
			} else if (this.pars.moveEvent === 'drag') {
				this.element.style.cursor = 'auto';
			}
		}
	},
	
	zoomIn: function(e){
		e.memo.decimal = 1
		this.zoomTo(e)
		return this
	},
	
	zoomOut: function(e){
		e.memo.decimal = 0
		this.zoomTo(e)
		return this
	},
	
	loadIndex: function(index) {
		this.index = index;
		this.load(this.pars.images[this.index])
		
		return this
	},
	
	load: function(imageGroup){
		if(imageGroup && imageGroup != this.currentImageGroup){
			
			this.decimal = 0
			
			this.element.stopObserving(':zoomIn', this._zoomIn);
			this.element.stopObserving(':zoomTo', this._zoomTo);
			this.element.stopObserving(':zoomInc', this._zoomInc);
			this.element.stopObserving(':zoomDec', this._zoomDec);
			this.element.stopObserving(':zoomOut', this._zoomOut);
			
			this.currentImageGroup = imageGroup
			
			if(this.image){
				this.image.remove()
				delete(this.image)
			}
			
			this.base.src = this.currentImageGroup.base;
			this.base.style.display = 'block';
			
			this.element.style.cursor = 'auto';
			
			this.baseAnimation.run({opacity:1});
			
			if(imageGroup && imageGroup.zoom && imageGroup.zoom.strip() != ''){
				this.showLoader()
				this.buildZoomImage()
			}
		}
		return this
	},
	
	holderDims: function(){
		this.baseHeight = parseInt(this.element.getStyle('height'));
		this.baseWidth = parseInt(this.element.getStyle('width'));
	},
	
	baseAnimationCompleteEvent: function(e){
		this.element.style.backgroundImage = "url('" + this.currentImageGroup.base + "')";
		this.base.setStyle({opacity:0});
		this.base.style.display = 'none';
	},
	
	buildBaseImage: function(){
		this.base.addClassName(this.pars.classNames.base);
		this.base.setStyle({opacity:0});
		this.element.insert(this.base);
		this.baseAnimation = new Df.Animate(this.base);
		this.baseAnimation.setPars({time:500})
		this.baseAnimation.getElement().observe(':complete', this._baseAnimationCompleteEvent)
	},
	
	buildZoomImage: function(){
		this.image = $(new Image());
		this.image.addClassName(this.pars.classNames.zoom);
		this.image.style.visibility = "hidden";
		
		
		if (this.pars.moveEvent === 'drag') {
			this.image.style.cursor = "move";
			this.zoomMousedownEvent()
			this.zoomDragClickEvent()
		}
		else if(this.pars.moveEvent === 'hover' && this.pars.zoomEvent === 'click'){
			this.zoomClickEvent()
		}
		
		this.zoomMouseMoveEvent()
		this.zoomMouseOutEvent()
		this.zoomMouseOverEvent()
		this.zoomLoadEvent()
		
		this.element.insert(this.image);
		this.zoomAnimation = new Df.Animate(this.image);
		this.zoomAnimation.getElement().observe(':complete', this._zoomAnimationCompleteEvent)
		
		this.image.src = this.currentImageGroup.zoom;
	},
	
	//START event handlers
	holderHoverEvent: function(){
		this.element.observe('mouseover', function(e){
			Event.stop(e);
			if(this.decimal == 0)
				this.over = true;
				if(this.pars.pauseToOpen !== false){
					setTimeout(function(e){
						if(this.over == true)
							this.element.fire(':zoomIn', {event:e})
					}.bind(this, e), this.pars.pauseToOpen);
				}
		}.bind(this));
		
		this.element.observe('mouseout', function(e){
			Event.stop(e);
			if(this.decimal == 0){
				this.over = false;
			}
		}.bind(this));
	},
	
	holderClickEvent: function(){
		this.element.observe('click', function(e){
			Event.stop(e);
			this.element.fire(':zoomIn', {event:e})
		}.bind(this));	
	},
	
	zoomDragClickEvent: function(){
		this.image.observe('click', function(e){
			Event.stop(e);
		}.bind(this));
	},
	
	zoomClickEvent: function(){
		this.image.observe('click', function(e){
			Event.stop(e);
			this.element.fire(':zoomOut', {event:e})
		}.bind(this));
	},
	
	zoomMousedownEvent: function(){
		Event.observe(this.image, 'mousedown', function(e){
			Event.stop(e);
			this.moveable = true;
			this.startPointerX = this.element.getPointerX(e);
			this.startPointerY = this.element.getPointerY(e);
			this.startImageTop = parseInt(this.image.style.top);
			this.startImageLeft = parseInt(this.image.style.left);
		}.bind(this));
	},
	
	documentMouseUpEvent: function(){
		Event.observe(document.body, 'mouseup', function(e){
			this.moveable = false;
		}.bind(this));
	},
	
	zoomMouseMoveEvent: function(){
		//move zoom image inside holder
		this.image.observe('mousemove', function(e){
			Event.stop(e);
			if(this.moveable){
				if(this.pars.moveEvent === 'hover'){
					this.image.style.top = this.zoomTopPosition(e) + 'px';
					this.image.style.left = this.zoomLeftPosition(e) + 'px';
				}
				else if (this.pars.moveEvent === 'drag'){
					this.image.style.top = this.zoomTopPositionDrag(e) + 'px';
					this.image.style.left = this.zoomLeftPositionDrag(e) + 'px';
				}
			}
		}.bind(this));
	},
	
	zoomMouseOutEvent: function(){
		//zoom image mouseout event
		this.image.observe('mouseout', function(e){
			Event.stop(e);
			if(this.decimal != false){
				this.out = true;
				if(this.pars.pauseToClose !== false){
					setTimeout(this.handleMouseOver.bind(this), this.pars.pauseToClose);
				}
			}
		}.bind(this));
	},
	
	zoomMouseOverEvent: function(){
		//zoom image mousein event
		this.image.observe('mouseover', function(e){
			Event.stop(e);
			this.out = false;
		}.bind(this));
	},
	
	zoomLoadEvent: function(){
		//zoom image load event
		this.image.observe('load', function(e){
			Event.stop(e);
			
			this.element.style.cursor = 'pointer';
			
			this.maxHeight = parseInt(this.image.offsetHeight);
			this.maxWidth = parseInt(this.image.offsetWidth);
			
			this.image.style.height = this.baseHeight + 'px';
			this.image.style.width = this.baseWidth + 'px';
			
			this.image.style.top = '0px';
			this.image.style.left = '0px';
			
			this.element.observe(':zoomIn', this._zoomIn);
			this.element.observe(':zoomTo', this._zoomTo);
			this.element.observe(':zoomOut', this._zoomOut);
			
			this.hideLoader()
		
		}.bind(this));
	},
		
	//END event handlers
	
	//START loader methods
	loaderAnimationCompleteEvent: function(e){
		if(e.memo.pointer == 0){
			this.pars.loader.style.display = 'none';
		}
	},
	
	buildLoader: function(){
		this.pars.loader.setStyle({opacity:0})
		this.element.insert(this.pars.loader);
		this.loaderAnimation = new Df.Animate(this.pars.loader);
		this.loaderAnimation.setPars({time:1000, opacity:.50})
		this.loaderAnimation.getElement().observe(':complete', this._loaderAnimationCompleteEvent)
	},
	
	showLoader: function(){
		this.element.fire(':loading')
		
		this.element.style.cursor = 'auto';
			
		this.pars.loader.style.display = 'block';
		this.loaderAnimation.toggle();
		
		return this
	},
	
	hideLoader: function(){
		this.element.fire(':loaded')
		this.loaderAnimation.toggle();	
	},
	
	//END loader methods
	
	handleMouseOver: function(e){
		if(this.out){
			this.element.fire(':zoomOut')
		}
	},
	
	zoomLeftPosition: function(e){
		return - parseInt((this.element.getPointerX(e) / this.baseWidth) * (this.image.getWidth() - this.baseWidth));
	},
	
	zoomTopPosition: function(e){
		return - parseInt((this.element.getPointerY(e) / this.baseHeight) * (this.image.getHeight() - this.baseHeight));
	},
	
	zoomLeftPositionDrag: function(e){
		var left = this.startImageLeft - (this.startPointerX - this.element.getPointerX(e));
		if (left > 0) {
			left = 0;
		} else if (left < -this.image.getWidth() + this.baseWidth) {
			left = -this.image.getWidth() + this.baseWidth;
		}
		return left;
	},
	
	zoomTopPositionDrag: function(e){
		var top = this.startImageTop - (this.startPointerY - this.element.getPointerY(e));
		if (top > 0) {
			top = 0;
		} else if (top < -this.image.getHeight() + this.baseHeight) {
			top = -this.image.getHeight() + this.baseHeight;
		}
		return top;
	}
		
});
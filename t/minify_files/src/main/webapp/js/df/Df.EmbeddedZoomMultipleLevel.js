/*
 event:		:zoomIn
 event:		:zoomOut
 event:		:zoomTo
 event:		:zoomInc
 event:		:zoomDec
 event:		:zoomChange
*/
Df.EmbeddedZoomMultipleLevel = Class.create(Df.Ui, {
	initialize: function($super, element, pars){
		$super(element, pars)
		
		this.imageCache = $H({})
		
		this.loader;
		
		this.changeZoom = false
		
		this.image
		this.preImage
		
		this.maxHeight;
		this.maxWidth;
		this.baseHeight;
		this.baseWidth;
		
		this.moveable = false;
		
		this.startPointerX;
		this.startPointerY;
		this.startImageTop;
		this.startImageLeft;
		
		this.index;
		this.currentImageGroup = {}
		
		this._zoomIn = this.zoomIn.bindAsEventListener(this)
		this._zoomOut = this.zoomOut.bindAsEventListener(this)
		this._zoomInc = this.zoomInc.bindAsEventListener(this)
		this._zoomDec = this.zoomDec.bindAsEventListener(this)
		this._zoomTo = this.zoomTo.bindAsEventListener(this)
		
		this._zoomMousedownEvent = this.zoomMousedownEvent.bindAsEventListener(this)
		this._zoomMouseUpEvent = this.zoomMouseUpEvent.bindAsEventListener(this)
		this._zoomMouseMoveEvent = this.zoomMouseMoveEvent.bindAsEventListener(this)
		
		this.baseHeight = parseInt(this.element.getStyle('height'));
		this.baseWidth = parseInt(this.element.getStyle('width'));
		
		this.loader = this.pars.loader
		
		Event.observe(document.body, 'mouseup', function(e){
			this.moveable = false;
		}.bind(this));
		
		return this
	},
	
	_initPars: function($super, pars){
		$super()
		this.setPars({
			loader: false,
			images: {},
			zoomSteps: 4,
			zoomClickType: 'center', //center|drill
			classNames: {
				zoom: 'zoom'
			}
		});
		this.setPars(pars)
	},
	
	zoomTo: function(e){
		e.memo.step = e.memo.step.toRange(0, this.pars.zoomSteps)
		if(e.memo.step != this.step){
			
			this.element.fire(':zoomChange', {step: e.memo.step, totalSteps: this.pars.zoomSteps})
			
			var curH = parseInt(this.image.style.height)
			var curW = parseInt(this.image.style.width)
			
			var height = parseInt(this.baseHeight * Math.pow((Math.pow((this.maxHeight / this.baseHeight), (1 / (this.pars.zoomSteps)))), e.memo.step))
			var width = parseInt(this.baseWidth * Math.pow((Math.pow((this.maxWidth / this.baseWidth), (1 / (this.pars.zoomSteps)))), e.memo.step))
			
			var curL = parseInt(this.image.style.left)
			var curT = parseInt(this.image.style.top)
			var xCoord = .5
			var yCoord = .5
			
			this.step = e.memo.step
			
			if(e.memo.event){
				if(this.pars.zoomClickType == 'center'){
					curT += (this.baseHeight * yCoord) - this.element.getPointerY(e.memo.event)
					curL += (this.baseWidth * xCoord) - this.element.getPointerX(e.memo.event)
				}
				else if (this.pars.zoomClickType == 'drill') {
					yCoord = this.element.getPointerY(e.memo.event) / this.baseHeight
					xCoord = this.element.getPointerX(e.memo.event) / this.baseWidth
				}
			}
			
			var ypercent = (-curT + (this.baseHeight * yCoord) ) / curH
			var xpercent = (-curL + (this.baseWidth * xCoord) ) / curW
			var top = (-((height - curH) * ypercent) + curT).toRange(-height + this.baseHeight, 0)
			var left = (-((width - curW) * xpercent) + curL).toRange(-width + this.baseHeight, 0)
			var animate = {
				top: top,
				left: left,
				height: height,
				width: width
			}
			
			if(this.image && this.image.style.visibility == 'visible'){
				this.removePreZoomImage()
			
				this.preImage = this.imageCache[escape(this.image.src)]
				
				this.removeZoomImage()
			
				this.element.insert(this.preImage)
				this.preImage.setStyle({opacity: 1, visibility: 'visible'})
			}else{
				this.removeZoomImage()	
			}
			
			this.pullZoomImage(height, width)
			
			this.setImageAttsToPreImage()
			
			this.stopObservingZoomEvents()
			
			this.preImage.zoomAnimation.toggle(animate);
			this.image.zoomAnimation.toggle(animate);
		}
	},
	
	setImageAttsToPreImage: function(){
		if(this.image && this.preImage){
			this.image.setStyle({
				height: this.preImage.style.height,
				width: this.preImage.style.width,
				top: this.preImage.style.top,
				left: this.preImage.style.left
			})
		}
	},
	
	zoomDec: function(e){
		e.memo.step = this.step - 1
		this.zoomTo(e)
		return this
	},
	
	zoomInc: function(e){
		e.memo.step = this.step + 1
		this.zoomTo(e)
		return this
	},
	
	zoomIn: function(e){
		e.memo.step = this.pars.zoomSteps
		this.zoomTo(e)
		return this
	},
	
	zoomOut: function(e){
		e.memo.step = 0
		this.zoomTo(e)
		return this
	},
	
	loadIndex: function(index) {
		this.index = index;
		this.load(this.pars.images[this.index])
		
		return this
	},
	
	load: function(imageGroup){
		if(imageGroup && Object.toJSON(this.currentImageGroup) != Object.toJSON(imageGroup)){
			
			this.step = 0
			
			this.element.fire(':zoomChange', {step: this.step, totalSteps: this.pars.zoomSteps})
			
			this.removePreZoomImage()
			if(this.image && this.image.style.visibility == 'visible'){
				this.preImage = this.imageCache[escape(this.image.src)]
				this.removeZoomImage()
				this.element.insert(this.preImage)
				this.preImage.setStyle({opacity: 1, visibility: 'visible'})
			}else{
				this.removeZoomImage()
			}
			
			this.stopObservingZoomEvents()
			
			this.currentImageGroup = imageGroup
			
			if(imageGroup.zoom && imageGroup.zoom.height && imageGroup.zoom.width){
				
				this.maxHeight = imageGroup.zoom.height
				this.maxWidth = imageGroup.zoom.width
				
				this.pullZoomImageByType('base')
				
				this.setImageToBase()
				
				this.observeZoomEvents()
			}
		}
		return this
	},
	
	setImageToBase: function(){
		if(this.image){
			this.image.setStyle({
				left:'0px',
				top:'0px',
				height: this.baseHeight + 'px',
				width: this.baseWidth + 'px'
			})
		}
	},
	
	removeZoomImage: function(){
		if(this.image){
			this.image.setStyle({opacity: 0, visibility: 'hidden'})
			this.image.remove()
			delete(this.image)
		}
	},
	
	removePreZoomImage: function(){
		if(this.preImage){
			this.preImage.setStyle({opacity: 0, visibility: 'hidden'})
			this.preImage.remove()
			delete(this.preImage)
		}
	},
	
	pullZoomImageByType: function(type){
		this.pullZoomImage(this.currentImageGroup[type].height, this.currentImageGroup[type].width)
	},
	
	pullZoomImage: function(height, width){
		this.removeZoomImage()
		var src = this.buildImageSrc(height, width)
		if(this.imageCache[escape(src)]){
			this.image = this.imageCache[escape(src)]
			this.element.insert(this.image);
			if(this.image.style.visibility == 'hidden'){
				this.image.fadeAnimation.run({opacity: 1})
				this.image.style.visibility = 'visible'
			}
		} else {
			this.buildZoomImage()
			this.image.src = this.buildImageSrc(height, width)
		}
	},
	
	buildImageSrcByType: function(type){
		return this.buildImageSrc(this.currentImageGroup[type].height, this.currentImageGroup[type].width)
	},
	
	buildImageSrc: function(height, width){
		return this.currentImageGroup.src + '&set=wide[' + width + '],high[' + height + '],&load=url[file:Jonathan_Chains/HURLEY.chain]'
	},
	
	buildZoomImage: function(){
		this.image = $(new Image());
		this.loader.show()
		this.image.addClassName(this.pars.classNames.zoom);
		this.image.zoomAnimation = new Df.Animate(this.image).setPars({time:150});
		
		this.image.observe(':complete', function(e){
			this.observeZoomEvents()
		}.bind(this))
		
		this.image.fadeAnimation = new Df.Animate(this.image).setPars({time:150});
		
		this.image.observe('load', function(e){
			Event.stop(e);
			
			this.loader.hide()
			this.image.setStyle({opacity:0, visibility: 'visible'})
			this.image.fadeAnimation.run({opacity: 1})
			
			this.imageCache[escape(this.image.src)] = this.image
		}.bind(this));
		
		this.element.insert(this.image);
	},
	
	stopObservingZoomEvents: function(){
		this.element.style.cursor = 'auto';
		this.element.stopObserving(':zoomIn', this._zoomIn);
		this.element.stopObserving(':zoomTo', this._zoomTo);
		this.element.stopObserving(':zoomInc', this._zoomInc);
		this.element.stopObserving(':zoomDec', this._zoomDec);
		this.element.stopObserving(':zoomOut', this._zoomOut);
		this.element.stopObserving('mousedown', this._zoomMousedownEvent)
		this.element.stopObserving('mouseup', this._zoomMouseUpEvent)
		this.element.stopObserving('mousemove', this._zoomMouseMoveEvent)
	},
	
	observeZoomEvents: function(){
		this.element.style.cursor = 'pointer';
		this.element.observe(':zoomIn', this._zoomIn);
		this.element.observe(':zoomTo', this._zoomTo);
		this.element.observe(':zoomInc', this._zoomInc);
		this.element.observe(':zoomDec', this._zoomDec);
		this.element.observe(':zoomOut', this._zoomOut);
		this.element.observe('mousedown', this._zoomMousedownEvent)
		this.element.observe('mouseup', this._zoomMouseUpEvent)
		this.element.observe('mousemove', this._zoomMouseMoveEvent)
	},
	
	zoomMousedownEvent: function(e){
		e.stop()
		this.moveable = true;
		this.changeZoom = true;
		this.startPointerX = this.element.getPointerX(e);
		this.startPointerY = this.element.getPointerY(e);
		this.startImageTop = parseInt(this.image.style.top);
		this.startImageLeft = parseInt(this.image.style.left);
	},
	
	zoomMouseUpEvent: function(e){
		e.stop()
		this.element.style.cursor = 'pointer';
		this.moveable = false;
		if(this.changeZoom){
			this.element.fire(':zoomInc', {event:e})
		}
	},
	
	zoomMouseMoveEvent: function(e){
		e.stop()
		if(this.moveable && this.step){
			this.element.style.cursor = 'move';
			this.changeZoom = false
			this.image.style.top = this.zoomTopPositionDrag(e) + 'px';
			this.image.style.left = this.zoomLeftPositionDrag(e) + 'px';
			if(this.preImage){
				this.preImage.style.top = this.zoomTopPositionDrag(e) + 'px';
				this.preImage.style.left = this.zoomLeftPositionDrag(e) + 'px';
			}
		}
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
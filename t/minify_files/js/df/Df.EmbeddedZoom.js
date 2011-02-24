if("undefined"==typeof(Prototype)){throw "Df.EmbeddedZoom requires prototype1-6.js to be loaded.";}
if("undefined"==typeof(Df)){throw "Df.EmbeddedZoom requires Df.js to be loaded.";}

Df.EmbeddedZoom = Class.create(Df.Ui, {
	initialize: function($super, imgElement, pars){
		if(Object.isElement($(imgElement))) {
  			this.IE6 = Prototype.Browser.IE && parseInt(navigator.userAgent.substring(navigator.userAgent.indexOf("MSIE")+5)) == 6;
    		this.opened=false;
    		this.imgElement = $(imgElement);
    		this.imgElement.setStyle({cursor:'pointer'});
    		this.element = this.mkel();
    		this.imgElement.observe('click', this.mouseClickEvent.bindAsEventListener(this));
    		document.observe('keyup', this.ducumentKeyUpEvent.bindAsEventListener(this));
  		}
  		$super(this.element, pars);
	
		this.imageCache = $H({});
		
		this.loader;
		this.zoomedElement;
		
		this.clicked = 0;
		
		this.changeZoom = false;
		
		this.image;
		this.imageDimensions = {};
		this.preImage;
		
		this.maxHeight;
		this.maxWidth;
		this.baseHeight;
		this.baseWidth;
		this.setHeight;
		this.setWidth;
		
		this.moveable = false;
		
		this.startPointerX;
		this.startPointerY;
		this.startImageTop;
		this.startImageLeft;
		
		this.index;
		this.currentImageGroup = {};
		
		this._zoomIn = this.zoomIn.bindAsEventListener(this);
		this._zoomOut = this.zoomOut.bindAsEventListener(this);
		this._zoomInc = this.zoomInc.bindAsEventListener(this);
		this._zoomDec = this.zoomDec.bindAsEventListener(this);
		this._zoomTo = this.zoomTo.bindAsEventListener(this);
		
		this._zoomMousedownEvent = this.zoomMousedownEvent.bindAsEventListener(this);
		this._zoomMouseUpEvent = this.zoomMouseUpEvent.bindAsEventListener(this);
		this._zoomMouseMoveEvent = this.zoomMouseMoveEvent.bindAsEventListener(this);
		
		if(this.pars.overlayId && $(this.pars.overlayId)) {
			this.element.setStyle({
				width:($(this.pars.overlayId).getWidth()-2)+'px',
				height:($(this.pars.overlayId).getHeight()-2)+'px'
			});
		}else{
			this.element.setStyle({
				width:this.pars.dimensions.width+'px',
				height:this.pars.dimensions.height+'px'
			});
		}
		
		this.baseHeight = parseInt(this.element.style.height);
		this.baseWidth = parseInt(this.element.style.width);
		
		this.loader = this.pars.loader;
		if(Object.isElement(this.loader)){
			this.element.insert(this.loader);
			this.loader.hide();
		}
		this.zoomedElement = this.pars.zoomedElement;
		this.closeElement = this.pars.closeElement;
		
		Event.observe(document.body, 'mouseup', function(e){
			this.moveable = false;
		}.bind(this));
		
		return this;
	},
	
	_initPars: function($super, pars){
		this.setPars({
			images: {},
			zoomSteps: 3,
			zoomStartStep: 1,
			overlayId: '',
			respectBorders: true,
			dimensions:{width:250,height:250},
			zoomClickType: 'drill', //drill|center
			dblclickZoomOut: true,
			className: 'zoom',
			closeElement: new Element('a', {href:'javascript:void(0);',id:this.element.id+'-close',className:'close'}).update('Close Window').observe('click',function(){return this.close();}.bind(this)),
			zoomedElement: new Element('div', {id:this.element.id+'-dblclick'}).update('Double click to reset image'),
			loader: new Element('div', {id:this.element.id+'-loader'}).setStyle({opacity:.5})
		});
		this.setPars(pars);
	},
	
	mkel: function(){
  		$(this.imgElement).insert({before: new Element('div', {id: this.imgElement.id+'-zoom'}).hide()});
    	$(this.imgElement.id+'-zoom').setStyle({overflow:'hidden',position:'absolute'});
    	return $(this.imgElement.id+'-zoom');
    },
    
    open: function(){
  	if(this.opened){return false;}
  	if(Object.isElement($(this.pars.overlayId))){if(this.IE6){$$('#'+this.pars.overlayId+' select').each(function(el){el.hide();});}} /* IE6 fix */
	this.load();
	this.element.show();
	document.observe('click', this.documentMouseClickEvent.bindAsEventListener(this));
	this.opened=true;
  },
  
  close: function(){
  	if(!this.opened){return false;}
  	this.element.hide();
  	if(Object.isElement($(this.pars.overlayId))){if(this.IE6){$$('#'+this.pars.overlayId+' select').each(function(el){el.show();});}} /* IE6 fix */
  	document.stopObserving('click');
  	this.opened=false;
  	return false;
  },
	
	zoomTo: function(e){
		var curStep = ('number' == typeof e ? e.toRange(0, this.pars.zoomSteps) : e.memo.step.toRange(0, this.pars.zoomSteps));
		if(curStep != this.step){
			this.element.fire(':zoomChange',{step:curStep,totalSteps:this.pars.zoomSteps});
			
			var curH = parseInt(this.image.style.height);
			var curW = parseInt(this.image.style.width);
			
			var height = parseInt(this.baseHeight * Math.pow((Math.pow((this.maxHeight / this.baseHeight), (1 / (this.pars.zoomSteps)))), curStep))
			var width = parseInt(this.baseWidth * Math.pow((Math.pow((this.maxWidth / this.baseWidth), (1 / (this.pars.zoomSteps)))), curStep))
			this.setImageProportions(width, height);
			
			var curL = parseInt(this.image.style.left);
			var curT = parseInt(this.image.style.top);
			
			var xCoord = .5;
			var yCoord = .5;
			
			this.step = curStep;
			if(this.pars.zoomClickType == 'center' || 'number' == typeof e){
				xCoord = curW/2;
				yCoord = curH/2;
			}else if (this.pars.zoomClickType == 'drill'){
				xCoord = this.image.getPointerX(e.memo.event);
				yCoord = this.image.getPointerY(e.memo.event);
			}
				
			
			var xPercent = (((xCoord-16)*100)/curW);
			var yPercent = (((yCoord-16)*100)/curH);
			var left = -(this.setWidth-((this.baseWidth/2)+(this.setWidth-((this.setWidth*xPercent)/100))));
			var top = -(this.setHeight-((this.baseHeight/2)+(this.setHeight-((this.setHeight*yPercent)/100))));
			
			if(this.pars.respectBorders){
				if(0<this.step){
					left = (this.baseWidth>=this.setWidth ? left.toRange(-this.setWidth,(this.baseWidth-this.setWidth)) : left.toRange(-this.setWidth, 0));
					top = (this.baseHeight>=this.setHeight ? top.toRange(-this.setHeight,(this.baseHeight-this.setHeight)) : top.toRange(-this.setHeight, 0));
				}
				
				if(0<this.baseHeight-(this.setHeight-(-top))){
					top = (this.baseHeight>this.setHeight ? 0 : (this.baseHeight-this.setHeight));
				}
				
				if(0<this.baseWidth-(this.setWidth-(-left))){
					left = (this.baseWidth>this.setWidth ? 0 : (this.baseWidth-this.setWidth));
				}
			}
			if(0==this.step){
				left = parseInt((this.baseWidth/2)-(this.setWidth/2));
				top = parseInt((this.baseHeight/2)-(this.setHeight/2));
			}
			
			var animate = {
				top: top+'px',
				left: left+'px',
				height: this.setHeight,
				width: this.setWidth
			};
			
			if(this.image && this.image.style.visibility == 'visible'){
				this.removePreZoomImage();
				this.preImage = this.imageCache[escape(this.image.src)];
				this.removeZoomImage();
				this.element.insert(this.preImage);
				this.preImage.setStyle({opacity: 1, visibility: 'visible'});
			}else{
				this.removeZoomImage();
			}
			
			this.stopObservingZoomEvents();
			
			this.pullZoomImage(this.setWidth, this.setHeight);
			this.setImageAttsToPreImage();
			this.preImage.zoomAnimation.toggle(animate);
			this.image.zoomAnimation.toggle(animate);
			
			if (Object.isElement(this.zoomedElement)){
				if(this.step>0){
					if(!$(this.zoomedElement.id)){
						this.element.insert(this.zoomedElement);
					}
				}else{
					this.zoomedElement.remove();
				}
			}
			
		}
		
		
	},
	
	setImageAttsToPreImage: function(){
		if(this.image && this.preImage){
			this.image.setStyle({
				height: this.preImage.style.height,
				width: this.preImage.style.width,
				top: this.preImage.style.top,
				left: this.preImage.style.left,
				position:'absolute',
				visibility:'hidden'
			});
		}
	},
	
	zoomDec: function(e){
		e.memo.step = this.step - 1;
		this.zoomTo(e);
		return this;
	},
	
	zoomInc: function(e){
		e.memo.step = this.step + 1;
		this.zoomTo(e);
		return this;
	},
	
	zoomIn: function(e){
		e.memo.step = this.pars.zoomSteps;
		this.zoomTo(e);
		return this;
	},
	
	zoomOut: function(e){
		e.memo.step = 0;
		this.zoomTo(e);
		return this;
	},
	
	loadIndex: function(index) {
		this.index = index;
		this.load(this.pars.images[this.index]);
		return this;
	},
	
	load: function(){
		if(this.pars.imageGroup && Object.toJSON(this.currentImageGroup) != Object.toJSON(this.pars.imageGroup)){
			if(Object.isElement(this.closeElement)){
				this.element.insert(this.closeElement);
			}
			
			this.step = 0;
			this.element.fire(':zoomChange', {step: this.step, totalSteps: this.pars.zoomSteps});
			this.removePreZoomImage()
			if(this.image && this.image.style.visibility == 'visible'){
				this.preImage = this.imageCache[escape(this.image.src)];
				this.removeZoomImage();
				this.element.insert(this.preImage);
				this.preImage.setStyle({opacity: 1, visibility: 'visible'});
			}else{
				this.removeZoomImage();
			}
			
			this.currentImageGroup = this.pars.imageGroup;
			var timg = new Element('img');
			timg.observe('load', function(e){
				this.imageDimensions = {width:timg.width,height:timg.height};
				this.maxWidth = this.imageDimensions.width;
				this.maxHeight = this.imageDimensions.height;
				this.pullZoomImage(this.imageDimensions.width, this.imageDimensions.height);
				this.setImageToBase();
			}.bind(this)).writeAttribute('src',this.currentImageGroup.src);/* IE6 Fix */	
		}
		return this;
	},
	
	setImageProportions: function(width, height) {
		this.setWidth = (width>height ? Math.round(this.imageDimensions.width*(height/this.imageDimensions.height)) : width);
		this.setHeight = (height>width ? Math.round(this.imageDimensions.height*(width/this.imageDimensions.width)) : height);
	},
	
	setImageToBase: function(){
		if(this.image){
			this.setImageProportions(this.baseWidth, this.baseHeight);			
			this.image.setStyle({
				left: parseInt((this.baseWidth/2)-(this.setWidth/2))+'px',
				top: parseInt((this.baseHeight/2)-(this.setHeight/2))+'px',
				height: this.setHeight + 'px',
				width: this.setWidth + 'px'
			});
		}
	},
	
	removeZoomImage: function(){
		if(this.image){
			this.image.setStyle({opacity: 0, visibility: 'hidden'});
			delete(this.image);
		}
	},
	
	removePreZoomImage: function(){
		if(this.preImage){
			this.preImage.setStyle({opacity: 0, visibility: 'hidden'});
			delete(this.preImage);
		}
	},
		
	pullZoomImage: function(width, height){
		this.removeZoomImage();
		var src = this.buildImageSrc(height, width);
		if(this.imageCache[escape(src)]){
			this.image = this.imageCache[escape(src)]
			this.element.insert(this.image);
			if(this.image.style.visibility == 'hidden'){
				this.image.fadeAnimation.run({opacity: 1})
				this.image.style.visibility = 'visible';
			}
		}else{
			this.buildZoomImage();
			this.image.src = this.buildImageSrc(height, width);
		}
		
	},
	
	buildImageSrcByType: function(type){
		return this.buildImageSrc(this.currentImageGroup[type].height, this.currentImageGroup[type].width)
	},
	
	buildImageSrc: function(height, width){
		return this.currentImageGroup.src;
	},
	
	
	
	buildZoomImage: function(){
		this.image = $(new Image());
		if(Object.isElement(this.loader)){this.loader.show();}
		this.image.addClassName(this.pars.className);
		this.image.zoomAnimation = new Df.Animate(this.image).setPars({time:150});
		this.image.fadeAnimation = new Df.Animate(this.image).setPars({time:150});
		this.image.observe('load', function(e){
			Event.stop(e);
			if(Object.isElement(this.loader)){this.loader.hide();}
			this.image.setStyle({opacity:0, visibility: 'visible',position:'absolute'});
			this.image.fadeAnimation.run({opacity: 1});
			this.imageCache[escape(this.image.src)] = this.image;
			this.element.insert(this.image);
			this.observeZoomEvents();

			if(this.pars.zoomStartStep) {
				var step = this.pars.zoomStartStep;
				this.pars.zoomStartStep=false;
				this.zoomTo(step);
			}
			
		}.bind(this));		
	},
	
	stopObservingZoomEvents: function(){
		this.element.style.cursor = 'auto';
		this.element.stopObserving(':zoomIn');
		this.element.stopObserving(':zoomTo');
		this.element.stopObserving(':zoomInc');
		this.element.stopObserving(':zoomDec');
		this.element.stopObserving(':zoomOut');
		this.element.stopObserving('mousedown');
		this.element.stopObserving('mouseup');
		this.element.stopObserving('mousemove');
	},
	
	observeZoomEvents: function(){
		this.element.style.cursor = 'pointer';		
		this.element.observe(':zoomIn', this._zoomIn);
		this.element.observe(':zoomTo', this._zoomTo);
		this.element.observe(':zoomInc', this._zoomInc);
		this.element.observe(':zoomDec', this._zoomDec);
		this.element.observe(':zoomOut', this._zoomOut);
		this.element.observe('mousedown', this._zoomMousedownEvent);
		this.element.observe('mouseup', this._zoomMouseUpEvent);
		this.element.observe('mousemove', this._zoomMouseMoveEvent);
	},
	
	zoomMousedownEvent: function(e){
		e.stop();
		this.moveable = true;
		this.changeZoom = true;
		this.startPointerX = this.element.getPointerX(e);
		this.startPointerY = this.element.getPointerY(e);
		this.startImageTop = parseInt(this.image.style.top);
		this.startImageLeft = parseInt(this.image.style.left);
	},
	
	zoomMouseUpEvent: function(e){
		this.clicked++;		
		setTimeout(function(){this.clicked=0;}.bind(this),300); 
		if(this.clicked>=2 && this.step>1 && this.pars.dblclickZoomOut){
			this.element.fire(':zoomOut', {event:e});
		}else{
			e.stop();
			this.element.style.cursor = 'pointer';
			this.moveable = false;
			if(this.changeZoom){
				this.element.fire(':zoomInc', {event:e});
			}
		}
	},
	
	zoomMouseMoveEvent: function(e){
		e.stop();
		if(this.moveable && this.step){
			this.element.style.cursor = 'move';
			this.changeZoom = false;
			this.image.style.top = this.zoomTopPositionDrag(e) + 'px';
			this.image.style.left = this.zoomLeftPositionDrag(e) + 'px';
			if(this.preImage){
				this.preImage.style.top = this.zoomTopPositionDrag(e) + 'px';
				this.preImage.style.left = this.zoomLeftPositionDrag(e) + 'px';
			}
		}
	},
	
	ducumentKeyUpEvent: function(e){
		if(e.keyCode==Event.KEY_ESC){this.close();}
		if(e.keyCode==Event.KEY_RETURN){this.zoomTo(0);}
		if(e.keyCode==61){this.zoomTo(this.step+1);}
		if(e.keyCode==109){this.zoomTo(this.step-1);}
	},
	
  documentMouseClickEvent: function(e){
  	var pointer = {x:e.pointerX(),y:e.pointerY()};
  	var offset = {x:this.element.cumulativeOffset()[0], y:this.element.cumulativeOffset()[1]};
  	var dimensions = this.element.getDimensions();
  	if ( (pointer.x<offset.x || pointer.y<offset.y) || (pointer.x>(offset.x+dimensions.width) || pointer.y>(offset.y+dimensions.height)) ) {
  		this.close();
  	}
  },
  
  mouseClickEvent: function(e){
  	this.open();
  },
	
	zoomLeftPositionDrag: function(e){
		var left = this.startImageLeft - (this.startPointerX - this.element.getPointerX(e));
		if(!this.pars.respectBorders){return left;}
		if (left > 0) {
			if(this.image.width>this.baseWidth){
				left = 0;
			} else if ((left+this.image.width)>this.baseWidth){
				left = ((this.baseWidth-this.image.width));
			}
		} else {
			if(this.image.width<this.baseWidth) {
				left = 0;
			}else if ( this.baseWidth-(this.image.width-(-left)) > 0) {
				left = ((this.baseWidth-this.image.width));
			}
		}
		return left;
	},
	
	zoomTopPositionDrag: function(e){
		var top = this.startImageTop - (this.startPointerY - this.element.getPointerY(e));
		if(!this.pars.respectBorders){return top;}
		if (top > 0) {
			if(this.image.height>this.baseHeight){
				top = 0;
			} else if ((top+this.image.height)>this.baseHeight){
				top = ((this.baseHeight-this.image.height));
			}
		} else {
			if(this.image.height<this.baseHeight) {
				top = 0;
			}else if ( this.baseHeight-(this.image.height-(-top)) > 0) {
				top = ((this.baseHeight-this.image.height));
			}
		}
		return top;
	}
});
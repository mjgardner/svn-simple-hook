if('object'==typeof(Prototype)&&'object'==typeof(Df)){
Df.Zoom=Class.create({
	initialize:function(imgElement,p){
		if(Object.isElement($(imgElement))){
  			this.opened=false;
    		this.imgEl=$(imgElement);
    		this.element=this.mkel();
  		}
  		this.p={
			steps:3,/* Zoom Steps:Int */
			stepStart:1,/* Zoom Start Step:Int */
			oid:'',/* Overlay ID:String */
			rbrd:true, /* Respect Borders:bool */
			animate:{type:'kickass',timeSlow:600,timeFast:150},/* Animate:Object{type:String[light|kickass] or bool:false,timeSlow:Int,timeFast:Int} */
			zoomSpeed:{zoomIn:300,zoomOut:200},
			dims:{width:450,height:450},/* Window Dimensions:Object{width:Int,height:Int} */
			type:'drill',/* Zoom Click Type:String[drill][center] */
			dblclick:true,/* Double Click to Zoom out:bool */
			className:'zoom',/* Class Name:String */
			closeEl:new Element('a',{href:'javascript:void(0);',id:this.element.id+'-close',className:'close'}).update('<span class="hide">Close Window</span>').observe('click',function(){return this.close();}.bind(this)), /* Close Element:Object[Element] */
			zoomedEl:new Element('div',{id:this.element.id+'-dblclick'}).update('Double click to reset image'), /* Zoomed Element:Object[Element] */
			loader:{element:new Element('div',{id:this.element.id+'-loader'}).setStyle({opacity:.5}).addClassName('loader'),location:'center'}, /* Loader:Object{Element,location:String[top-left,top-center,top-right,bottom-right,bottom-center,bottom-left,center-left,center] Or {top:String,left:String}}*/
			handler:false,/* Open Zoom handler:Object[Element] */
			handlers:new Array(),/* Additional Open Zoom handlers:Array[Object:String ID,...] */
			controls:false,/* Zoom controls:Object{zoomIn:'id',zoomOut:'id',zoomReset:'id'}*/
			deadZone:false,/* The area of the element where the click-to-zoom feature will be ignored:String[elementId]*/
			onOpen:false,/* onOpen function(){} */
			onClose:false/* onClose function(){} */
		};
  		if(p)Object.extend(this.p,p);
  		if(Object.isElement(this.imgEl)){
  			var obj=$(this.p.handler);
	  		if('object'==typeof(obj)){
	  			obj.setStyle({cursor:'pointer'});
	  			obj.observe('click',this.mouseclick.bindAsEventListener(this));
	  		}else{
	  			this.imgEl.setStyle({cursor:'pointer'});
	  			this.imgEl.observe('click',this.mouseclick.bindAsEventListener(this));
	  		}
  		}
  		if(this.p.handlers.length>0)this.p.handlers.each(function(h){var obj=$(h);if('object'==typeof(obj)){obj.setStyle({cursor:'pointer'});obj.observe('click',this.mouseclick.bindAsEventListener(this));}}.bind(this));
  		this.p.loader=(Object.isElement(this.p.loader)?{element:this.p.loader}:this.p.loader);
		this.clicked=0;
		this.origPointer=false;
		this.changeZoom=false;
		this.image;
		this.imgDims={};
		this.maxHeight;
		this.maxWidth;
		this.baseHeight;
		this.baseWidth;
		this.setHeight;
		this.setWidth;
		this.moveable=false;
		this.pointerX;
		this.pointerY;
		this.imgTop;
		this.imgLeft;
		this.shift=false;
		if(Object.isElement(this.p.loader.element)){
			this.element.insert({after:this.p.loader.element});
			this.p.loader.element.hide();
		}
		Event.observe(document.body,'mouseup',function(e){this.moveable=false;}.bind(this));
		return this;
	},
	
	/* Load image */
	load:function(){
		if((!Object.isElement(this.image)&&this.p.image)){
			this.step=0;
			if(Object.isElement(this.p.loader.element)){
				this.p.loader.element.show();
				this.element.setStyle({cursor:'progress'});
				if('object'==typeof(this.p.loader.location)&&this.p.loader.location.top&&this.p.loader.location.left){
					this.p.loader.element.setStyle({top:this.p.loader.location.top,left:this.p.loader.location.left});
				}else{
				switch(this.p.loader.location){
					case 'top-left':
					this.p.loader.element.setStyle({top:'5px',left:'5px'});
					case 'top-center':
					this.p.loader.element.setStyle({top:'5px',left:Math.round((this.baseWidth/2)-(parseInt(this.p.loader.element.getStyle('width'))/2))+'px'});
					case 'top-right':
					this.p.loader.element.setStyle({top:'5px',left:((this.baseWidth-parseInt(this.p.loader.element.getStyle('width')))-5)+'px'});
					case 'center-right':
					this.p.loader.element.setStyle({top:Math.round((this.baseHeight/2)-(parseInt(this.p.loader.element.getStyle('height'))/2))+'px',left:((this.baseWidth-parseInt(this.p.loader.element.getStyle('width')))-5)+'px'});
					case 'bottom-right':
					this.p.loader.element.setStyle({top:((this.baseHeight-parseInt(this.p.loader.element.getStyle('height')))-5)+'px',left:((this.baseWidth-parseInt(this.p.loader.element.getStyle('width')))-5)+'px'});
					case 'bottom-center':
					this.p.loader.element.setStyle({top:((this.baseHeight-parseInt(this.p.loader.element.getStyle('height')))-5)+'px',left:Math.round((this.baseWidth/2)-(parseInt(this.p.loader.element.getStyle('width'))/2))+'px'});
					case 'bottom-left':
					this.p.loader.element.setStyle({top:((this.baseHeight-parseInt(this.p.loader.element.getStyle('height')))-5)+'px',left:'5px'});
					case 'center-left':
					this.p.loader.element.setStyle({top:Math.round((this.baseHeight/2)-(parseInt(this.p.loader.element.getStyle('height'))/2))+'px',left:'5px'});
					case 'center':
					default:
					this.p.loader.element.setStyle({top:Math.round((this.baseHeight/2)-(parseInt(this.p.loader.element.getStyle('height'))/2))+'px',left:Math.round((this.baseWidth/2)-(parseInt(this.p.loader.element.getStyle('width'))/2))+'px'});
					break;
				}}
			}
			var ex=$(this.element.id).select('.'+this.p.className)[0];
			if('object'==typeof(ex))ex.remove();
			this.image=new Element('img');
			this.image.observe('load',function(e){
				this.imgDims={width:this.image.width,height:this.image.height};
				this.maxWidth=this.imgDims.width;
				this.maxHeight=this.imgDims.height;
				this.image.addClassName(this.p.className);
				this.iprops(this.baseWidth,this.baseHeight);
				var left=(this.baseWidth>this.setWidth?parseInt((this.baseWidth/2)-(this.setWidth/2))+'px':'0px');
				var top=(this.baseHeight>this.setHeight?parseInt((this.baseHeight/2)-(this.setHeight/2))+'px':'0px');
				this.image.setStyle({
								top:top,
								left:left,
								width:this.setWidth+'px',
								height:this.setHeight+'px',
								visibility:'visible',
								position:'absolute'
								});
				if('kickass'==this.p.animate.type){
					this.image.setStyle({opacity:0});
					new Df.Animate(this.image).setPars({time:this.p.animate.timeFast}).run({opacity:1});
				}
				this.element.insert(this.image);
				this.zestart();
				if(this.p.stepStart)this.zoomTo(this.p.stepStart);
				if(Object.isElement(this.p.loader.element)){
					this.p.loader.element.hide();
					this.element.setStyle({cursor:'pointer'});
				}
			}.bind(this)).writeAttribute('src',this.p.image);/* IE6 Fix */
		}else{
			var scale=this.image.width/this.imgEl.width;
			var xCoord=(this.origPointer.x*scale);
			var yCoord=(this.origPointer.y*scale);
			var xPercent=(((xCoord-16)*100)/this.image.width);
			var yPercent=(((yCoord-16)*100)/this.image.height);
			var left=-(this.setWidth-((this.baseWidth/2)+(this.setWidth-((this.setWidth*xPercent)/100))));
			var top=-(this.setHeight-((this.baseHeight/2)+(this.setHeight-((this.setHeight*yPercent)/100))));
			var adj=this.rbrd(left,top);
			new Df.Animate(this.image).setPars({time:this.p.animate.timeFast}).run({top:adj.top+'px',left:adj.left+'px',position:'absolute'});
		}
		return this;
	},
	
	zoomTo:function(e){
	var curStep=('number'==typeof(e)?e.toRange(0,this.p.steps):e.memo.step.toRange(0,this.p.steps));
	var curH=parseInt(this.image.style.height);
	var curW=parseInt(this.image.style.width);
	if(this.p.deadZone){
		var deadZone=$(this.p.deadZone);
		if(deadZone&&'number'!=typeof(e)){
			var dzDims=deadZone.getDimensions();
			var dzPos=deadZone.positionedOffset();
			if((this.pointerY>=dzPos.top&&this.pointerY<(dzPos.top+dzDims.height))&&(this.pointerX>=dzPos.left&&this.pointerX<(dzPos.left+dzDims.width)))return false;
		}
	}
	if(curStep != this.step){
		var height=parseInt(this.baseHeight*Math.pow((Math.pow((this.maxHeight/this.baseHeight),(1/(this.p.steps)))),curStep));
		var width=parseInt(this.baseWidth*Math.pow((Math.pow((this.maxWidth/this.baseWidth),(1/(this.p.steps)))),curStep));
		this.iprops(width,height);
		var curL=parseInt(this.image.style.left);
		var curT=parseInt(this.image.style.top);
		var zoomSpeed=(curStep<this.step?this.p.zoomSpeed.zoomIn:this.p.zoomSpeed.zoomOut);
		this.step=curStep;
		if('center'==this.p.type||'number'==typeof(e)){
				if(this.origPointer&&'center'!=this.p.type){
					yCoord=(((this.origPointer.y*100)/curH)*this.baseHeight)/100;
					xCoord=(((this.origPointer.x*100)/curW)*this.baseWidth)/100;
					this.origPointer=false;
				}else{
					xCoord=curW/2;
					yCoord=curH/2;
				}
			}else if(this.p.type=='drill'){
				xCoord=this.image.getPointerX(e.memo.event);
				yCoord=this.image.getPointerY(e.memo.event);
			}
		var xPercent=(((xCoord-16)*100)/curW);
		var yPercent=(((yCoord-16)*100)/curH);
		var left=-(this.setWidth-((this.baseWidth/2)+(this.setWidth-((this.setWidth*xPercent)/100))));
		var top=-(this.setHeight-((this.baseHeight/2)+(this.setHeight-((this.setHeight*yPercent)/100))));
		var adj=this.rbrd(left,top);
			if(0==this.step){
				adj.left=parseInt((this.baseWidth/2)-(this.setWidth/2));
				adj.top=parseInt((this.baseHeight/2)-(this.setHeight/2));
			}
		new Df.Animate(this.image).setPars({time:zoomSpeed}).run({top:adj.top+'px',left:adj.left+'px',height:this.setHeight,width:this.setWidth,position:'absolute'});
	}else{
		if('number'!=typeof(e)&&'drill'==this.p.type&&e.memo.event){
			xCoord=this.image.getPointerX(e.memo.event);
			yCoord=this.image.getPointerY(e.memo.event);
			var xPercent=(((xCoord-16)*100)/curW);
			var yPercent=(((yCoord-16)*100)/curH);
			var left=-(curW-((this.baseWidth/2)+(curW-((curW*xPercent)/100))));
			var top=-(curH-((this.baseHeight/2)+(curH-((curH*yPercent)/100))));
			var adj=this.rbrd(left,top);			
			new Df.Animate(this.image).setPars({time:this.p.animate.timeFast}).run({top:adj.top+'px',left:adj.left+'px',position:'absolute'});
		}
	}
	if(Object.isElement(this.p.zoomedEl)){
		if(this.step>0){
			if(!$(this.p.zoomedEl.id)){
				if('kickass'==this.p.animate.type)this.p.zoomedEl.setStyle({opacity:0});
				this.element.insert(this.p.zoomedEl);
				if('kickass'==this.p.animate.type)new Df.Animate(this.p.zoomedEl).setPars({time:this.p.animate.timeSlow}).run({opacity:1});
			}
		}else{
			if('kickass'==this.p.animate.type)
				new Df.Animate(this.p.zoomedEl).setPars({time:this.p.animate.timeSlow,onComplete:function(){this.p.zoomedEl.remove();}.bind(this)}).run({opacity:0});
			else
				this.p.zoomedEl.remove();
		}
	}
	},
	
	/* Make Element */
	mkel:function(){
  		$(this.imgEl).insert({before:new Element('div',{id:this.imgEl.id+'-zoom'}).hide()});
    	$(this.imgEl.id+'-zoom').setStyle({overflow:'hidden',position:'absolute',zIndex:2});
    	return $(this.imgEl.id+'-zoom');
    },
    
    /* Open Zoom Window */
    open:function(e){
  	if(this.opened)return false;
  	if(Object.isElement($(this.p.oid))&&Prototype.Browser.ie6)$$('#'+this.p.oid+' select').each(function(el){el.hide();});/* IE6 fix */
	this.elDims=(this.p.oid&&$(this.p.oid)?
							{width:($(this.p.oid).getWidth()-2),height:($(this.p.oid).getHeight()-2)}:
							{width:this.p.dims.width,height:this.p.dims.height});
	this.baseWidth=parseInt(this.elDims.width);
	this.baseHeight=parseInt(this.elDims.height);
	if(this.p.animate.type){
		this.element.setStyle({width:'1px',height:this.imgEl.height+'px'});
		this.element.show();
		new Df.Animate(this.element).setPars({time:this.p.animate.timeFast,onComplete:function(){
			this.opened=true;
			if(Object.isElement(this.p.closeEl)){
				if('kickass'==this.p.animate.type){
					this.element.insert(this.p.closeEl);
					var t=this.p.closeEl.getStyle('top');
					this.p.closeEl.setStyle({opacity:.5,top:'-'+this.p.closeEl.getStyle('height')});
					new Df.Animate(this.p.closeEl).setPars({time:this.p.animate.timeSlow,ease:Df.Transitions["bounceOut"]}).run({opacity:1,top:t});
				}else this.element.insert(this.p.closeEl);
			}
		}.bind(this)}).run({width:this.elDims.width+'px',height:this.elDims.height+'px',opacity:1,visibility:'visible'});
	}else{
		if(Object.isElement(this.p.closeEl))this.element.insert(this.p.closeEl);
		this.element.setStyle({width:this.elDims.width+'px',height:this.elDims.height+'px'});
		this.element.show();
		this.opened=true;
	}
	var targ='';
	if (e.target)targ=e.target;
	else if(e.srcElement)targ=e.srcElement;
	if (targ.nodeType==3)targ=targ.parentNode;/* Safari bug */
	if('string'==typeof(targ.src))this.origPointer={x:this.imgEl.getPointerX(e),y:this.imgEl.getPointerY(e)};
	this.load();
	document.observe('click',this.docmouseclick.bindAsEventListener(this));
	if('function'==typeof(this.p.onOpen))this.p.onOpen(this);
	if('object'==typeof(this.p.controls)){
		$(this.p.controls.reset).observe('click',function(e){e.stop();this.zout();}.bind(this));
		$(this.p.controls.zoomIn).observe('click',function(e){this.zinc();e.stop();}.bind(this));
		$(this.p.controls.zoomOut).observe('click',function(e){e.stop();this.zdesc();}.bind(this));
	}
  },
  
  /* Close Zoom Window */
  close:function(){
  	if(!this.opened){return false;}
  	if(Object.isElement(this.p.loader.element))this.p.loader.element.hide();
  	if('kickass'==this.p.animate.type)
		new Df.Animate(this.element).setPars({time:this.p.animate.timeFast,onComplete:function(){this.element.hide();}.bind(this)}).run({width:'1px'});
	else
		this.element.hide();
  	if(Object.isElement($(this.p.oid))&&Prototype.Browser.ie6)$$('#'+this.p.oid+' select').each(function(el){el.show();});/* IE6 fix */
  	document.stopObserving('click');
  	this.opened=false;
  	if('object'==typeof(this.p.controls)){
		$(this.p.controls.reset).stopObserving('click');
		$(this.p.controls.zoomIn).stopObserving('click');
		$(this.p.controls.zoomOut).stopObserving('click');
	}
  	if('function'==typeof(this.p.onClose))this.p.onClose(this);
  	return false;
  },
  
	/* Respect Window Borders */
	rbrd:function(left,top){
		var adj={left:left,top:top};
		if(this.p.rbrd){
			if((this.setHeight>this.baseHeight)){
				if(0<adj.top)
					adj.top=0;
				else if(0<this.baseHeight-(this.setHeight-(-adj.top)))
					adj.top=(this.baseHeight>this.setHeight?0:(this.baseHeight-this.setHeight));
			}else{
				if(((-adj.top)+this.setHeight)>this.baseHeight)
					adj.top=this.baseHeight-this.setHeight;
				else if((adj.top+this.setHeight)>this.baseHeight)
					adj.top=0;
			}
			if((this.setWidth>this.baseWidth)){
				if(0<adj.left)
					adj.left=0;
				else if(0<this.baseWidth-(this.setWidth-(-adj.left)))
					adj.left=(this.baseWidth>this.setWidth?0:(this.baseWidth-this.setWidth));
			}else{
				if(((-adj.left)+this.setWidth)>this.baseWidth)
					adj.left=this.baseWidth-this.setWidth;
				else if((adj.left+this.setWidth)>this.baseWidth)
					adj.left=0;
			}
		}
		return adj;
	},
	
	/* Zoom Descend */
	zdesc:function(e){
		if('object'!=typeof(e))e=(this.step-1);else e.memo.step=this.step-1;
		this.zoomTo(e);
		return this;
	},
	
	/* Zoom Increment */
	zinc:function(e){
		if(this.shift){this.zdesc(e);return false;}
		if('object'!=typeof(e))e=(this.step+1);else e.memo.step=this.step+1;
		this.zoomTo(e);
		return this;
	},
	
	/* Zoom In */
	zin:function(e){
		if('object'!=typeof(e))e=(this.steps);else e.memo.step=this.p.steps;
		this.zoomTo(e);
		return this;
	},
	
	/* Zoom Out */
	zout:function(e){
		if('object'!=typeof(e))e=0;else e.memo.step=0;
		this.zoomTo(e);
		return this;
	},
	
	/* Flip Image */
	flip:function(imgs){
		if(imgs.main&&Object.isElement(this.imgEl)){
			if(this.imgEl.src!=imgs.main){
			new Df.Animate(this.imgEl).setPars({time:this.p.animate.timeFast}).run({opacity:.5});
			this.zestop();
			this.imgElFlip=new Element('img');
			this.imgElFlip.observe('load',function(e){
				this.imgElFlip.setStyle({opacity:0,cursor:'pointer'});
				this.imgEl.insert({after:this.imgElFlip});
				this.imgEl.remove();
				this.imgEl=this.imgElFlip;
				new Df.Animate(this.imgEl).setPars({time:this.p.animate.timeFast}).run({opacity:1});
				this.imgEl.observe('click',this.mouseclick.bindAsEventListener(this));
			}.bind(this)).writeAttribute('src',imgs.main);/* IE6 Fix */	
		}
		}
		if(imgs.zoom&&Object.isElement(this.imgEl)){
			this.zestop();
			this.element.update();
			if(Object.isElement(this.image))this.image=false;
			this.p.image=imgs.zoom;
			if(this.opened)this.load();
		}
	},
	
	/* Set Image Proportions */
	iprops:function(width,height){
		this.setWidth=Math.round(width);
		this.setHeight=Math.round(height);
		if(width>height){
			var r=(this.imgDims.height<this.imgDims.width?(this.imgDims.width/this.imgDims.height):(this.imgDims.height/this.imgDims.width));
			this.setWidth=this.setWidth=Math.round(height*r);
		}else{
			var r=(this.imgDims.height>this.imgDims.width?(this.imgDims.width/this.imgDims.height):(this.imgDims.height/this.imgDims.width));
			this.setHeight=this.setHeight=Math.round(width*r);
		}
	},
	
	/* Stop Observing Zoom Events */
	zestop:function(){
		this.element.style.cursor='auto';
		this.element.stopObserving(':zin');
		this.element.stopObserving(':zoomTo');
		this.element.stopObserving(':zinc');
		this.element.stopObserving(':zdesc');
		this.element.stopObserving(':zout');
		this.element.stopObserving('mousedown');
		this.element.stopObserving('mouseup');
		this.element.stopObserving('mousemove');
		document.stopObserving('keyup',this.dockeyup.bindAsEventListener(this));
    	document.stopObserving('keydown',this.dockeydown.bindAsEventListener(this));
	},
	
	/* Start Observing Zoom Events */
	zestart:function(){
		this.element.style.cursor='pointer';		
		this.element.observe(':zin',this.zin.bindAsEventListener(this));
		this.element.observe(':zoomTo',this.zoomTo.bindAsEventListener(this));
		this.element.observe(':zinc',this.zinc.bindAsEventListener(this));
		this.element.observe(':zdesc',this.zdesc.bindAsEventListener(this));
		this.element.observe(':zout',this.zout.bindAsEventListener(this));
		this.element.observe('mousedown',this.mouse.bindAsEventListener(this));
		this.element.observe('mouseup',this.mouseup.bindAsEventListener(this));
		this.element.observe('mousemove',this.mousemv.bindAsEventListener(this));
		document.observe('keyup',this.dockeyup.bindAsEventListener(this));
    	document.observe('keydown',this.dockeydown.bindAsEventListener(this));
	},
	
	/* Zoom Mouse Event */
	mouse:function(e){
		e.stop();
		this.moveable=true;
		this.changeZoom=true;
		this.pointerX=this.element.getPointerX(e);
		this.pointerY=this.element.getPointerY(e);
		this.imgTop=parseInt(this.image.style.top);
		this.imgLeft=parseInt(this.image.style.left);
	},
	
	/* Zoom Mouse Up Event */
	mouseup:function(e){
		this.clicked++;
		this.element.style.cursor='pointer';
		if(!this.changeZoom){this.clicked=0;return false;}
		setTimeout(function(){this.changeZoom=true;}.bind(this),240);
		setTimeout(function(){this.clicked=0;}.bind(this),350);
		if(this.clicked>=2&&this.step>=1&&this.p.dblclick){
			this.element.fire(':zout',{event:e});
		}else{
			e.stop();
			setTimeout(function(){
				this.moveable=false;
				if(this.changeZoom&&this.clicked<=1)this.element.fire(':zinc',{event:e});
			}.bind(this),240);
		}
	},
	
	/* Zoom Mouse Move Event */
	mousemv:function(e){
		e.stop();
		if(this.moveable&&this.step){
			this.element.style.cursor='move';
			this.changeZoom=false;
			this.image.style.top=this.topdrag(e)+'px';
			this.image.style.left=this.leftdrag(e)+'px';
			if(this.preImage){
				this.preImage.style.top=this.topdrag(e)+'px';
				this.preImage.style.left=this.leftdrag(e)+'px';
			}
		}
	},
	
	/* Document Key Up Event */
	dockeyup:function(e){
		var k={i:61,o:109};
		if(Prototype.Browser.IE||Prototype.Browser.WebKit)k={i:187,o:189};
		if(e.keyCode==Event.KEY_ESC)this.close();
		if(e.keyCode==Event.KEY_RETURN)this.zoomTo(0);
		if(e.keyCode==k.i)this.zoomTo(this.step+1);
		if(e.keyCode==k.o)this.zoomTo(this.step-1);
		if(e.keyCode==16)this.shift=false;
	},
	
	/* Document Key Down Event */
	dockeydown:function(e){
		this.shift=e.keyCode==16?true:false;
	},
	
	/* Document Mouse Click Event */
	docmouseclick:function(e){
		var pointer={x:e.pointerX(),y:e.pointerY()};
		var offset={x:this.element.cumulativeOffset()[0],y:this.element.cumulativeOffset()[1]};
		var dims=this.element.getDimensions();
		if((pointer.x<offset.x||pointer.y<offset.y)||(pointer.x>(offset.x+dims.width)||pointer.y>(offset.y+dims.height)))this.close();
	},
  
	/* Mouse Click Event */
	mouseclick:function(e){
		e.stop();
		this.open(e);
	},
	
	/* Zoom Left Position Drag */
	leftdrag:function(e){
		var left=this.imgLeft-(this.pointerX-this.element.getPointerX(e));
		if(!this.p.rbrd)return left;
		if(left>0){
			if(this.image.width>this.baseWidth)
				left=0;
			else if((left+this.image.width)>this.baseWidth)
				left=((this.baseWidth-this.image.width));
		}else{
			if(this.image.width<this.baseWidth)
				left=0;
			else if( this.baseWidth-(this.image.width-(-left))>0)
				left=((this.baseWidth-this.image.width));
		}
		return left;
	},
	
	/* Zoom Top Position Drag */
	topdrag:function(e){
		var top=this.imgTop-(this.pointerY-this.element.getPointerY(e));
		if(!this.p.rbrd)return top;
		if(top>0){
			if(this.image.height>this.baseHeight)
				top=0;
			else if((top+this.image.height)>this.baseHeight)
				top=((this.baseHeight-this.image.height));
		}else{
			if(this.image.height<this.baseHeight)
				top=0;
			else if( this.baseHeight-(this.image.height-(-top))>0)
				top=((this.baseHeight-this.image.height));
		}
		return top;
	}
});
}

else{throw "Df.Zoom.js requires prototype.js and Df.js to be loaded.";}
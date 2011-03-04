/* --- Df.Modal - Example of usage:
- For best results, attach to href. Example: <a href="Javascript:modal.open({});>
- Options for scrolling on iFrame: scrolling: 'true'
- Options for close Button: closeButton: 'yes' OR closeButton: 'withScroll' (to be used with scrollbars for different styling). 
*/
if('object'==typeof(Prototype)&&'object'==typeof(Df)){
Df.Modal=Class.create({
	initialize:function(p){
  		this.p={
			dialog:{
				className:'modal-dialog',
		    	animate:{speed:300},/* false or {speed:300}*/
		    	width:'550px', /* false or '550px' */
		    	height:'400px' /* false or '400px' */
			},
			modal:{
				className:'modal-bg',
			    clickToClose:true,
			    animate:{speed:300},/* false or {speed:300}*/
			    styles:{
					backgroundColor:'#000000',
					opacity:.5
				},
				closeElement:false,
				loader:new Element('div').setStyle({opacity:.7}).addClassName('loader')
			}
		};
		this.wdim=document.viewport.getDimensions();
		this._modal=false;
  		if('object'==typeof(p)){
  			if(p.dialog)Object.extend(this.p.dialog,p.dialog);
  			if(p.modal)Object.extend(this.p.modal,p.modal);
  		}
  	},
  	
  	/* Set parameter */
  	params:function(p){
  		if(p)Object.extend(this.p,p);
  		return this;
  	},
  	
  	/* Set dialog data */
  	setData:function(d){
  		this._opened.update(d);
  	},
  	
  	/* Alias of setData */
  	setContent:function(d){
  		this.setData(d);
  	},
  	
  	/* Set timeout to close the dialog */
  	timeout:function(tm){
  		setTimeout(function(e){this.close();}.bind(this),tm);
  	},
  	
  	/* Sensitive: if set to true will close modal when scrolling */
  	sensitive:function(flag){
  		if(true==flag){
  			Event.stopObserving(window,'scroll');
  			Event.observe(window,'scroll',function(){
	    		this.close();
	    	}.bind(this));
  		}else{
  			Event.stopObserving(window,'scroll');
  			Event.observe(window,'scroll',function(){
	    		this._posm();
	    		this._repos();
	    	}.bind(this));
  		}
  	},
  	
  	/* Force: Disallows user to close modal by clicking outside the box */
  	force:function(flag){
  		if(false==flag){
  			this.forceMode=false;
  			this._modal.stopObserving('click');
  			this._modal.observe('click', function(e){this.close();}.bind(this));
  		} else {
  			this.forceMode=true;
  			this._modal.stopObserving('click');
  		}
  	},

    /* Resize modal window */
    resize:function(dims){
    	if('object'==typeof(dims)){
	    	this.wdim=document.viewport.getDimensions();
	    	var borderw=parseInt(this._opened.getStyle('border-width'))*2;
	    	var pos={left:Math.round((this.wdim.width/2)-(parseInt(dims.width)/2)),top:Math.round((this.wdim.height/2)-(parseInt(dims.height)/2))};
	    	if(this.wdim.width<=(dims.width+borderw))pos.left=0;
	    	if(this.wdim.height<=(dims.height+borderw))pos.top=0;
			if('function'==typeof(Df.Animate)&&false!=this.p.dialog.animate){
	    	new Df.Animate(this._opened).setPars({time:this.p.dialog.animate.speed,onComplete:function(){if('function'==typeof(dims.onComplete))dims.onComplete();}}).run({left:pos.left,top:pos.top,width:dims.width,height:dims.height});
	    	if(false!=this.p.dialog.url)new Df.Animate($('externaliframe')).setPars({time:this.p.dialog.animate.speed}).run({width:dims.width,height:dims.height});
	    	}else{
	    		this._opened.setStyle({left:pos.left,top:pos.top,width:dims.width,height:dims.height});if('function'==typeof(dims.onComplete))dims.onComplete();
	    		if(false!=this.p.dialog.url)$('externaliframe').setStyle({width:dims.width,height:dims.height});
	    	}
	    	return this;
    	}else if('fullscreen'==dims){
    		this.fullScreen(true);
    	}else if('normalscreen'==dims){
    		this.fullScreen(false);
    	}
    },
    
    /* Full Screen */
    fullScreen:function(flag){
    	if(!this._opened)return false;
    	var borderw=parseInt(this._opened.getStyle('border-width'))*2;
    	if(false==flag){
    		if(!this.fscreen)return false;
    		this.fscreen=false;
    		ddim=this.prevdims;
    		ddim.width=(ddim.width+borderw);
    		ddim.height=(ddim.height+borderw);
    		this.resize(ddim);
    		this.prevdims=false;
    	}else{
    		if(true==this.fscreen)return false;
    		this.fscreen=true;
    		this.prevdims=this._opened.getDimensions();
    		ddim=document.viewport.getDimensions();
    		ddim.width=(ddim.width-borderw);
    		ddim.height=(ddim.height-borderw);
    		this.resize(ddim);
    	}
    },
    
    /* Toggles fullscreen on or off*/
    fullScreenOnOff:function(){
    	if(this.fscreen)this.fullScreen(false); else this.fullScreen(true);
    },

	/* Hide modal window */
    close:function(){
    	if(!this._opened)return false;
    	if('function'==typeof(Df.Animate)&&false!=this.p.modal.animate)
    	new Df.Animate(this._modal).setPars({time:this.p.modal.animate.speed,onComplete:function(){this._modal.hide();}.bind(this)}).run({opacity:0});
   		else this._modal.hide();
   		if(!this._opened.id)this._opened.remove();else this._opened.hide();
   		this._opened=false;
   		if(Prototype.Browser.ie6||Prototype.Browser.ie7)this._ieFix(false);
   		Event.stopObserving(window,'scroll');
    	Event.stopObserving(window,'resize');
    	
    	if(this.frame)Event.stopObserving(this.frame,'keyup',this._keyup);    	
    	Event.stopObserving(document,'keyup',this._keyup);
    },
    
    /* Loading */
    loading:function(el){
    	var cover=new Element('div',{id:'modal-loader-cover'}).setStyle({position:'absolute',top:'0px',left:'0px',backgroundColor:'#000000',width:this._opened.getStyle('width'),height:this._opened.getStyle('height'),opacity:.3});
    	this._opened.insert({bottom:cover});
    	if(Object.isElement(el)){
    		cover.insert({bottom:el});
    		el.setStyle({top:Math.round((parseInt(this._opened.getStyle('height'))/2)-(parseInt(el.getStyle('height'))/2))+'px',left:Math.round((parseInt(this._opened.getStyle('width'))/2)-(parseInt(el.getStyle('width'))/2))+'px'});
    	}else if(Object.isElement(this.p.modal.loader)){
    		cover.insert({bottom:this.p.modal.loader});
    		this.p.modal.loader.setStyle({top:Math.round((parseInt(this._opened.getStyle('height'))/2)-(parseInt(this.p.modal.loader.getStyle('height'))/2))+'px',left:Math.round((parseInt(this._opened.getStyle('width'))/2)-(parseInt(this.p.modal.loader.getStyle('width'))/2))+'px'});
    	}
    },
    
    /* Loaded */
    loaded:function(){
    	if($('modal-loader-cover'))$('modal-loader-cover').remove();
    },
    
	/* Make dialog box */
   	open:function(opt){
   		if('object'!=typeof(opt))return false;
   		this._bg();
   		this._opened=false;
   		if(!opt.id){
   			if(!this._opened)this._opened=this._mknbox();
   		}else{
   			this._opened=$(opt.id);
   		}
   		this._opened.setStyle({display:'block',position:'fixed',zIndex:9999,top:'0px',left:'0px',opacity:0});
   		if(opt.title)this._opened.update(new Element('h1').update(opt.title));
    	if(opt.content)this._opened.insert({bottom:new Element('p').update(opt.content)});
   		if(opt.className)this._opened.addClassName(opt.className);
   		opt.scrolling=(opt.scrolling?'yes':'no');
		var scrollbarset = opt.scrolling;
		if(scrollbarset == 'yes' && /Firefox[\/\s](\d+\.\d+)/.test(navigator.userAgent)){scrollbarset = 'auto';};
		if(scrollbarset == 'yes' && /MSIE (\d+\.\d+);/.test(navigator.userAgent)){
			var ieHeight = opt.height.toString();
			var ieWidth = opt.width.toString();
			if(opt.width)this._opened.setStyle({width:(parseInt(ieWidth.substring(0, (ieWidth.length -2)))+4)+'px'});
			if(opt.height)this._opened.setStyle({height:(parseInt(ieHeight.substring(0, (ieHeight.length -2)))+2)+'px'});
		}else{
			if(opt.width)this._opened.setStyle({width:opt.width});
			if(opt.height)this._opened.setStyle({height:opt.height});
   		}
		this._pos();
   		if('function'==typeof(Df.Animate)&&false!=this.p.dialog.animate){
        	if(false!=this.p.modal.animate)
        	setTimeout(function(){new Df.Animate(this._opened).setPars({time:this.p.dialog.animate.speed}).run({opacity:1});}.bind(this), this.p.modal.animate.speed);
    		else new Df.Animate(this._opened).setPars({time:this.p.dialog.animate.speed}).run({opacity:1});
   		}else{
    		this._opened.setStyle({opacity:1,display:'block'});
    	}
   		if(false!=opt.url){
    		this._opened.innerHTML='';
    		this.iframe=new Element('iframe',{
									className:'externaliframe',
									id:'externaliframe',
									scrolling:scrollbarset,
									src:opt.url,
									frameborder:0,
									height:this._opened.getStyle('height'),
									width:this._opened.getStyle('width')
									}).setStyle({display:'block',top:'0px',left:'0px',position:'absolute'});
    		this._opened.update(this.iframe);
			this.loading(false);
			this.iframe.observe('load',function(e){this.loaded();}.bind(this));
    	}
		if(opt.closeButton == 'withScroll')this._opened.insert('<a href="Javascript:parent.modal.close();" class="close" id="modal-close-withscroll"><span class="hide">close</span></a>');
		if(opt.closeButton == 'yes')this._opened.insert('<a href="Javascript:parent.modal.close();" class="close" id="modal-close-noscroll"><span class="hide">close</span></a>'); 		
    	/*if(this.iframe){ commenting this out as this is setting a default for ie7 there by causing access denied error for iframe
    		this.frame=(Prototype.Browser.IE?this.iframe.contentWindow.document:this.iframe.contentDocument.defaultView);
    		Event.observe(this.frame,'keyup',this._keyup.bindAsEventListener(this));
    	}*/
    	Event.observe(document,'keyup',this._keyup.bindAsEventListener(this));
    	if(Prototype.Browser.ie6||Prototype.Browser.ie7)this._ieFix(true);
    },
    
    /* Keypress listener: close or resize on escape */
    _keyup:function(e){
    	if(this.fscreen&&Event.KEY_ESC==e.keyCode)this.fullScreen(false);
    	else if(Event.KEY_ESC==e.keyCode&&!this.forceMode)this.close();
    },
    
	/* Make background */
	_bg:function(){
		this._modal=$('id-modal-bg');
		var wdim=document.viewport.getDimensions();
		var o=(Prototype.Browser.ie6?document.viewport.getScrollOffsets():{left:0,top:0});
	    if(!this._modal){
		    this._modal=new Element('div',{id:'id-modal-bg'}).setStyle({position:'fixed',zIndex:9000,top:o.top+'px',left:o.left+'px',width:wdim.width+'px',height:wdim.height+'px',display:'block',opacity:0});
		    if('object'==typeof(this.p.modal.styles))this._modal.setStyle(this.p.modal.styles);
			$(document.body).insert({top:this._modal});
			if(this.p.modal.clickToClose)this._modal.observe('click', function(e){this.close();}.bind(this));
			if(this.p.modal.className)this._modal.addClassName(this.p.modal.className);
		}else{
			this._modal.setStyle({width:wdim.width+'px',height:wdim.height+'px'});
		}
		
		if('function'==typeof(Df.Animate)&&false!=this.p.modal.animate){
    		if(!this.p.modal.styles.opacity)this.p.modal.styles.opacity=.5;
    		this._modal.setStyle({display:'block',opacity:0});
    		new Df.Animate(this._modal).setPars({time:this.p.modal.animate.speed}).run({opacity:this.p.modal.styles.opacity});
   		}else{
    		this._modal.open();
    	}
    	//Event.observe(window,'resize',function(){this._resize();}.bind(this));this was causing js error in all the light boxes in ie
    },
    
    /* Make new dialog box */
    _mknbox:function(){
    	var dialog=new Element('div');
    	dialog.setStyle({backgroundColor:'#FFFFFF',width:this.p.dialog.width,height:this.p.dialog.height});
    	$(document.body).insert({top:dialog});
    	return dialog;
    },

	/* Position dialog */
    _pos:function(){
		var ddim=this._opened.getDimensions();
		var wdim=document.viewport.getDimensions();
		var pos={left:Math.round((wdim.width/2)-(ddim.width/2)),top:Math.round((wdim.height/2)-(ddim.height/2))};
		pos.left=(ddim.width>wdim.width?0:pos.left);
		pos.top=(ddim.height>wdim.height?0:pos.top);
		if(Prototype.Browser.ie6&&(pos.top==0||pos.left==0))pos=document.viewport.getScrollOffsets();
		this._opened.setStyle({left:pos.left+'px',top:pos.top+'px'});
    },
    
    /* Reposition dialog */
    _repos:function(){
    	var ddim=this._opened.getDimensions();
    	var wdim=document.viewport.getDimensions();
    	var o=(Prototype.Browser.ie6?document.viewport.getScrollOffsets():{left:0,top:0});
		var pos={left:Math.round(o.left+((wdim.width/2)-(ddim.width/2))),top:Math.round(o.top+((wdim.height/2)-(ddim.height/2)))};
		pos.left=(ddim.width>wdim.width?0:pos.left);
		pos.top=(ddim.height>wdim.height?0:pos.top);
		this._opened.setStyle({left:pos.left+'px',top:pos.top+'px'});
    },
    
    /* Resize dialog */
    _resize:function(){
    	var ddim=this._opened.getDimensions();
    	var wdim=document.viewport.getDimensions();
    	this._modal.setStyle({width:wdim.width+'px',height:wdim.height+'px'});
    	var borderw=parseInt(this._opened.getStyle('border-width'))*2;
    	if(this.fscreen){
    		ddim=wdim;	
    		ddim.width=(ddim.width-borderw);
    		ddim.height=(ddim.height-borderw);
    		this._opened.setStyle({width:ddim.width+'px',height:ddim.height+'px'});
    	}else if(this.prevdims){
    		ddim=this.prevdims;
    		ddim.width=(ddim.width+borderw);
    		ddim.height=(ddim.height+borderw);
    		this._opened.setStyle({width:ddim.width+'px',height:ddim.height+'px'});
    	}
    	if(this.iframe){
    		if(!this.fscreen&&!this.prevdims){
	    		ddim.width=(ddim.width-borderw);
	    		ddim.height=(ddim.height-borderw);
	    	}
    		this.iframe.setStyle({width:ddim.width+'px',height:ddim.height+'px'});
    	}
    	this._repos();
    },
    
    /* Position modal background */
    _posm:function(){
		var o=(Prototype.Browser.ie6?document.viewport.getScrollOffsets():{left:0,top:0});
		this._modal.setStyle({left:o.left+'px',top:o.top+'px'});
		if(Prototype.Browser.ie6)$('boycott-ie6-already').setStyle({left:o.left+'px',top:o.top+'px'});
    },
    
    /* It's about time to... */
    _ieFix:function(t){
    	if(true==t){
    		if(Prototype.Browser.ie6){
	    		this._opened.setStyle({position:'absolute'});
	    		this._modal.setStyle({position:'absolute'});
	    		$(document.body).insert({bottom:new Element('iframe',{
										className:'ie6again',
										id:'boycott-ie6-already',
										scrolling:'no',
										src:'javascript:false;',
										frameborder:0,
										height:this.wdim.height+'px',
										width:this.wdim.width+'px'
										}).setStyle({display:'block',top:'0px',left:'0px',position:'absolute',filter:'progid:DXImageTransform.Microsoft.Alpha(style=0,opacity=0)'})
				});
		    	Event.observe(window,'scroll',function(){
		    		this._posm();
		    		this._repos();
		    	}.bind(this));
	    	}
	    	if((Prototype.Browser.ie6||Prototype.Browser.ie7)&&!Df.Modal._ie6dialogcopy){
	    		var copy=Element.clone(this._opened,true);
	        	this._opened.remove();
	        	$(document.body).insert({top:copy});
	        	this._opened=copy;
	        	Df.Modal._ie6dialogcopy=true;
	    	}
    	}else{
    		if(Prototype.Browser.ie6){
    			$('boycott-ie6-already').remove();
    			Event.stopObserving(window,'scroll');
    		}
    	}
    }
});
}

else{throw "Df.Modal.js requires prototype.js and Df.js to be loaded.";}
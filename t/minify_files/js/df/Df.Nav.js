/* nav v2.0 */
if("object"==typeof(Prototype)){
Df.nav=Class.create({
	initialize:function(el,p){
		this.el=!Object.isElement(el)?$(el):el;
		this.stat=false;
		this.p={
			animate:{effect:'fade',duration:300},/* {effect:fade,duraton:300}|false */
			pause:{close:100,open:200},
			aClass:'active',/* Active Class Name */
			eventType:'hover',/* hover|click */
			onShow:false,
			onHide:false,
			child: 'UL' /* Child CSS */
		};
		if(Prototype.Browser.ie6)this.p.pause.open=(this.p.pause.open-50);
		if('object'==typeof(p))Object.extend(this.p,p);
		if(Object.isElement(this.el)){
			var s=1;
			this.el.childElements().each(function(l){
				var sub=l.select(this.p.child);
				if(0<sub.length){
				sub.each(function(c){if(!c.id)c.writeAttribute('id',this.el.id+'_child'+s);c.hide();s++;}.bind(this));//generate id's
				switch(this.p.eventType){
					case 'click':
						l.observe('click',function(e){this.on(e,l,false);}.bind(this));
					break;
					case 'hover':
					default:
						var lk=l.select('a')[0];
						if('#'==lk.getAttribute('href'))lk.observe('click',function(e){e.stop();if(this.stat)this.off(e,l,true);else this.on(e,l,true);}.bind(this));
						l.observe('mouseover',function(e){this.on(e,l,false);}.bind(this));
						l.observe('mouseout',function(e){this.off(e,l,false);}.bind(this));
					break;
				}
				}else{
					l.observe('mouseover',function(e){l.addClassName(this.p.aClass);}.bind(this));
					l.observe('mouseout',function(e){l.removeClassName(this.p.aClass);}.bind(this));
				}
			}.bind(this));
		}
	},
	
	/* show */
	on:function(e,l,now){
		e.stop();
		this.stat=true;
		if(this.p.aClass)l.addClassName(this.p.aClass);
		if('click'==this.p.eventType||now)this.wOn(e,l);else setTimeout(function(e){this.wOn(e,l)}.bind(this),this.p.pause.open);
	},
	
	/* hide */
	off:function(e,l,now){
		e.stop();
		this.stat=false;
		if(this.p.aClass)l.removeClassName(this.p.aClass);
		if('click'==this.p.eventType||now){this.wOff(e,l);}else{this.hold=true;setTimeout(function(e){this.wOff(e,l);this.hold=false;}.bind(this),this.p.pause.close);}
	},
	
	/* x clear */
	xcl:function(e,l){
		var el=l.select(this.p.child)[0];
		this.el.childElements().each(function(l){l.select(this.p.child).each(function(rm){if(el.id!=rm.id)this.fOff(e,l);}.bind(this));}.bind(this));
	},
	
	/* wait to show */
	wOn:function(e,l){
		if(true==this.hold)return false;
		var el=l.select(this.p.child)[0];
		var animate=(this.p.animate?new Df.Animate(el).setPars({time:this.p.animate.duration}):false)
		if(Object.isElement(el)&&(this.stat&&'none'==el.getStyle('display'))){
			if('click'==this.p.eventType){
				el.stopObserving('click');
				Event.observe(document,'click',function(e){this.wOff(e,l)}.bind(this));
			}
			if(animate){
				switch(this.p.animate.effect){
					case 'fade':
						el.setStyle({opacity:0,display:'block'});
						animate.run({opacity:1,onComplete:function(){if('function'==typeof(this.p.onShow))this.p.onShow();}.bind(this)});
					break;				
				}
			}else{
				el.setStyle({display:'block'});
				if('function'==typeof(this.p.onShow))this.p.onShow();
			}
			this.xcl(e,l);
			if(Prototype.Browser.ie6)this.ie6up(el);
		}
	},
	
	/* wait to hide */
	wOff:function(e,l){
		var el=l.select(this.p.child)[0];
		var animate=(this.p.animate?new Df.Animate(el).setPars({time:this.p.animate.duration}):false)
		if('click'==this.p.eventType)this.stat=false;
		if(Object.isElement(el)&&!this.stat){
			if('click'==this.p.eventType)Event.stopObserving(document,'click');
			if(Prototype.Browser.ie6)this.ie6down(el);
			if(animate){
				switch(this.p.animate.effect){
					case 'fade':
						animate.run({opacity:.3,onComplete:function(){this.fOff(e,l);if('function'==typeof(this.p.onHide))this.p.onHide();}.bind(this)});
					break;					
				}
			}else{this.fOff(e,l);if('function'==typeof(this.p.onHide))this.p.onHide();}
		}		
	},
	
	/* final hide */
	fOff:function(e,l){
		var el=l.select(this.p.child)[0];
		if(this.p.aClass)l.removeClassName(this.p.aClass);
		el.hide();
	},
	
	/* generate the iFrame for IE6 */
	ie6up:function(el){
		var selects=$$('select');
		if(selects)selects.each(function(sel){sel.hide();});
	},
	
	/* remove the iFrame for IE6 */
	ie6down:function(el){
		var selects=$$('select');
		if(selects)selects.each(function(sel){sel.show();});
	}
});
/* auto init start // $$('.DfNavigation').each(function(n){new Df.nav(n);}); // auto init end */
}

/* -- */
else{throw "Df.nav.js requires Prototype 1.6.1 or higher";}
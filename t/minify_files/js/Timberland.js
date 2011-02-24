if("object"==typeof(Prototype)){

// added string trimming support to native js
String.prototype.trim = function() {
	return this.replace(/^\s+|\s+$/g,'');
}
String.prototype.ltrim = function() {
	return this.replace(/^\s+/,'');
}
String.prototype.rtrim = function() {
	return this.replace(/\s+$/,'');
}

var Timberland=Class.create({
	initialize:function(p){
		/* init parameters */
		this.p={
			sbt:'Search',/* Search Box Text */
			sbterr:'Keyword please...?',
			srcherr:0,
			sb:'id-header-search',/* Search Box */
			frm:'header-search',
			nav:false,/* Dropdown navigation */
			tabs:{id:'',sel:0},
			eventType:'hover',
			preload:false
		};
  		if(p)Object.extend(this.p,p);
  		this.srchfocused=false;
  		/* init Events */
  		if('object'==typeof(this.p.preload))this.prld(this.p.preload);
  		Event.observe(window,'load',function(e){
	  		if(Object.isElement($(this.p.sb))){
	  			$(this.p.sb).observe('focus',this.sbf.bindAsEventListener(this));
	  			$(this.p.sb).observe('blur',function(e){this.srchfocused=false;}.bind(this));
	  			if(this.p.sbt)$(this.p.sb).value=($(this.p.sb).value!=this.p.sbt?this.p.sbt:$(this.p.sb).value);
	  		}
	  		this.p.nav.each(function(n){this.nav(n.id,n.pars);}.bind(this));
	  		this.tabs();
	  		var link=$('read-reviews-link');
	  		if(link)link.observe('click',this.readReviews.bindAsEventListener(this));
	  		if(Object.isElement($(this.p.frm)))$(this.p.frm).observe('submit',this.sfc.bindAsEventListener(this));
  		}.bind(this));
  		
  		return this;	
	},
	
	/* Search From Check */
	sfc:function(e){
		e.stop();
		var sb=$(this.p.sb);
		if(!Object.isElement(sb))return false;
		
		if(this.p.sbt){
			if(sb.value.trim().toLowerCase()==this.p.sbt.toLowerCase()||sb.value.trim()==''||sb.value.trim().toLowerCase()==this.p.sbterr.toLowerCase()){
				if(sb.value==this.p.sbterr){
					sb.value='';
					this.p.srcherr=false;
					sb.focus();
				}else{
					if(false!==this.p.srcherr)this.p.srcherr++;
					if(this.p.srcherr>=3){
						var wasval=sb.value;
						sb.value=this.p.sbterr;
						setTimeout(function(){if(false==this.srchfocused)sb.value=wasval;}.bind(this),2000); 
						this.p.srcherr=false;
					}
				}
				return false;
			}else{$(this.p.frm).submit();}
		}else{
			if(sb.value==''){
				sb.focus();
			}else{
				$(this.p.frm).submit();
			}
		}
		
	},
	
	/* Clear Search Box */
	csb:function(e){
		if(Object.isElement($(this.p.sb))&&($(this.p.sb).value==this.p.sbt||$(this.p.sb).value==this.p.sbterr))
			$(this.p.sb).value='';
	},
	
	/* Search Box Focus */
	sbf:function(e){
		this.srchfocused=true;
		this.csb(e);
	},
	
	/* Dropdown Navigation */
	nav:function(id,p){
		if(Object.isElement($(id))&&'function'==typeof(Df.nav))
			new Df.nav(id,p);
	},
	
	/* Initialize Tabs */
	tabs:function(){
		if(Object.isElement($(this.p.tabs.id))&&'function'==typeof(Df.Tabset)){
			this.tabset=new Df.Tabset($(this.p.tabs.id),{animate:{time:200,opacity:1}});
			this.tabset.showItem(this.p.tabs.sel);
		}
	},
	
	/* Preload images */
	prld:function(imgs){
		imgs.each(function(i){var img=new Image();img.src=i;});
	},
	
	readReviews:function(e){
		e.stop();
		$$('#info-nav dt').each(function(tb,c){
			if('customer-reviews-tab'==tb.id){
				this.tabset.showItem(c);
				this.tabset.updateTabsetHeight(tb);
				throw $break;
			}
		}.bind(this));
		$('customer-reviews-tab').scrollTo('read-reviews-link');
	}
});
}
/* -- */
else{throw "Timberland.js requires Prototype 1.6.1 or higher";}

Df.TabsetItem = Class.create(Df.TogglePane,{
	initialize:function($super,element,pars){
		$super(element,pars);
		this.iframe=false;
		return this;
	},

	showClickObserver:function(){
		if(this.pars.forceClose)this.pars.collection.showOnlyItem(this);else this.show();
	},
	controllerHoverOutObserver:function(e){
		Event.stop(e);
		this.status=false;
		return this;
	},

	showByStatus:function(){
		if(this.status&&!this.displayStatus){
			this.pars.collection.hideItems();
			this.showActions();
		}
		return this;
	},

	hideClickObserver:function(e){
		return;
	}
});

Df.Tabset = Class.create(Df.UiCollection,{
	_initPars:function($super,pars){
		$super()
		this.setPars({
			eventType:'click',
			forceClose:true,
			treatAsMenu:false,
			hideClassName:'df_element_hidden',
			showClassName:'df_element_visible',
			onShow:false,
			onHide:false,
			scrollbars:false,
			forceClose:true,
			minHeight:100,
			tabHeight:30,
			contentElement:'dd',
			tabElement:'dt'
		});
		this.setPars(pars)
		$$('#'+this.element.id+' '+this.pars.contentElement).each(function(el){el.setStyle({opacity:0});})
	},
	
	updateTabsetHeight:function(elem){
			var content=elem.next(this.pars.contentElement);
			if(content.getHeight()<this.pars.minHeight)content.style.height=parseInt(this.pars.minHeight-this.pars.tabHeight)+'px';
			var newHeight=parseInt(content.getHeight()+this.pars.tabHeight);
			this.element.style.height=newHeight+'px';		
	},
	
	attachTabsetHeightEvents:function(){
			obj=this;
			obj.element.select(this.pars.tabElement).each(function(elem){
				elem.observe('click',function(){obj.updateTabsetHeight(elem);});
			});
	},
	
	buildItems:function(){
		var el=this.element.immediateDescendants();
		el.each(function(e){
			if('DT'==e.tagName&&e.next('dd')){
				if(this.pars.displayStateId)this.pars.displayStateId+='_'+i;
				Object.extend(this.pars,{controller:new Df.Ui(e)});
				this.items.push(new Df.TabsetItem($(e).next('dd'),this.pars));
			}
		}.bind(this));
		this.attachTabsetHeightEvents();
		this.updateTabsetHeight(this.element.select(this.pars.tabElement)[0]);
	}
});
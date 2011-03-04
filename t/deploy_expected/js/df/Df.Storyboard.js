Df.ControlButton = Class.create(Df.Ui,{
	initialize: function($super, element, panel){
		$super();
		this.top = 0;
		this.left = 0;
		this.width = 0;
		this.height = 0;
		this.element = element;
		this.panel = panel;
		this.panelAnimate = new Df.Animate(this.panel);
	}
});

Df.Storyboard = Class.create({
	initialize: function(pars){
		this.pars = {
			controlPanel : $('controlPanel'),
			viewport : $('viewport'),
			container : $('container'),
			
			panelSelector: 'div.child',
			draggable: true,
			checkBoundaries: false,
			
			controlPanelButtonIdBaseName: 'child',
			controlPanelButtonClassName: 'controlButton',
			controlPanelButtonContent: 'autonumber',
			controlPanelButtonChildSelector: '',
			controlPanelButtonCustomText: [],
			controlPanelButtonAnimPars: {},
			
			animateTime: 800,
			ease: Df.Transitions["expoInOut"],
			
			storyboard : new Df.Animate($('container')),
			viewportAnim : new Df.Animate($('viewport')),
			
			buttons : [],
			panels: [],
			panelURLs: {},
			useCaching: true,
			panelAnims: [],
			panelAnimsPars: {},
			initialDisplayPanel: 0,
			
			viewportXoffset: 0,
			viewportYoffset: 0
		}
		
		if(pars){
			this.setPars(pars);
		}

		if(this.pars.draggable){
			new Df.Drag(this.pars.container).enable();
		}

		this.buildPanels();
		this.buildControlPanel();
		this.reposition(this.pars.initialDisplayPanel);
	},
	
	setPars: function(pars){
		Object.extend(this.pars, pars);
	},
	
	buildControlPanel: function(){
		var obj = this;
		
		this.pars.container.select(this.pars.panelSelector).each(function(elem, index){
			var buttonText = false;
			var controlPanelButton;
			var buttonObj;			

			if($(obj.pars.controlPanelButtonContent)){
				buttonObj = $(obj.pars.controlPanelButtonContent.select(obj.pars.controlPanelButtonChildSelector)[index]);
			} else if(obj.pars.controlPanelButtonContent == 'autonumber'){
				buttonText = index + 1;
			} else if(obj.pars.controlPanelButtonContent == 'customText'){
				buttonText = obj.pars.controlPanelButtonCustomText[index];
			} else {
				buttonText = elem.innerHTML;
			}

			if(buttonText){
				obj.pars.controlPanel.insert('<div id="' + obj.pars.controlPanelButtonIdBaseName + index + '" class="' + obj.pars.controlPanelButtonClassName + '">' + buttonText + '</div>');
				buttonObj = $(obj.pars.controlPanelButtonIdBaseName + index);
			}
			
			controlPanelButton = new Df.ControlButton(buttonObj, elem);
			
			controlPanelButton.left = elem.positionedOffset()[0];
			controlPanelButton.top = elem.positionedOffset()[1];
			controlPanelButton.width = elem.getWidth();
			controlPanelButton.height = elem.getHeight();
			
			obj.pars.buttons.push(controlPanelButton);	

			if($(buttonObj)){
				buttonObj.observe('click', function(){
					obj.reposition(index);
				});
			}
		});
		
		if(this.pars.controlPanel){
			this.pars.controlPanel.insert('<div style="clear:both;"></div>');
		}
	},
	
	buildPanels: function(){
		var obj = this;
		this.pars.container.select(this.pars.panelSelector).each(function(elem, index){
			obj.pars.panels[index] = {};

			if(obj.pars.panelURLs[index]){
				obj.pars.panels[index].contentLoaded = false;
			} else {
				obj.pars.panels[index].contentLoaded = true;
			}
			
			obj.pars.panelAnims[index] = {};
			obj.pars.panelAnims[index].panelAnim = new Df.Animate(elem).setPars(obj.pars.panelAnimsPars);
		});
	},
	
	loadPanelContent: function(panelIndex){
		var obj = this;
		var content = '';
		new Ajax.Request(this.pars.panelURLs[panelIndex], {
			onSuccess: function(transport){
				obj.pars.buttons[panelIndex].panel.update(transport.responseText);
				if(obj.pars.useCaching){
					obj.pars.panels[panelIndex].contentLoaded = true;
				}
				obj.reposition.bind(obj).defer(panelIndex);
			}
		});
	},
	
	updatePanelSize: function(panelIndex){
		this.pars.buttons[panelIndex].height = this.pars.buttons[panelIndex].panel.getHeight();
		this.pars.buttons[panelIndex].width = this.pars.buttons[panelIndex].panel.getWidth();
		this.pars.buttons[panelIndex].left = this.pars.buttons[panelIndex].panel.positionedOffset()[0];
		this.pars.buttons[panelIndex].top = this.pars.buttons[panelIndex].panel.positionedOffset()[1];
	},
	
	reposition: function(panelIndex){
		if(!this.pars.panels[panelIndex].contentLoaded){
			this.loadPanelContent(panelIndex);
		} else {
			if(this.currentPanel > -1){
				this.pars.panelAnims[this.currentPanel].panelAnim.toggle();
			}
	
			this.currentPanel = panelIndex;	
			this.updatePanelSize(this.currentPanel);
			
			var pos = this.pars.buttons[parseInt(panelIndex)];
			
			if(this.pars.checkBoundaries){
				var xPos = -(-pos.left + this.pars.viewportXoffset);
				var xMax = this.pars.container.getWidth() - this.pars.viewport.getWidth();
	
				if(xPos > xMax){
					pos.left = this.pars.container.getWidth() - this.pars.viewport.getWidth();
				}
				
				var yPos = -(-pos.top + this.pars.viewportYoffset);
				var yMax = this.pars.container.getHeight() - this.pars.viewport.getHeight();
	
				if(yPos > yMax){
					pos.top = this.pars.container.getHeight() - this.pars.viewport.getHeight();
				}			
			}
	
			this.pars.storyboard.run({
				time: this.pars.animateTime,
				top: -pos.top + this.pars.viewportYoffset,
				left: -pos.left + this.pars.viewportXoffset,
				ease: this.pars.ease
			});	
	
			if(this.pars.viewportAnim){
				pos.height = this.pars.buttons[panelIndex].height;
				this.pars.viewportAnim.run({
					time: this.pars.animateTime,
					width: pos.width,
					height: pos.height,
					ease: this.pars.ease
				});	
			}
	
			this.pars.panelAnims[this.currentPanel].panelAnim.toggle();
		}
	},
	
	showAll: function(){
		this.pars.storyboard.run({
			time: this.pars.animateTime,
			top: 0,
			left: 0,
			ease: this.pars.ease
		});	
		
		if(this.pars.viewportAnim){
			this.pars.viewportAnim.run({
				time: this.pars.animateTime,
				height: this.pars.container.getHeight(),
				width: this.pars.container.getWidth()
			});
		}
	},
	
	showNextPanel: function(){
		if(this.currentPanel < this.pars.panels.length - 1){
			this.reposition(this.currentPanel + 1);
		}
	},
	
	showPreviousPanel: function(){
		if(this.currentPanel > 0){
			this.reposition(this.currentPanel - 1);
		}
	}	
});
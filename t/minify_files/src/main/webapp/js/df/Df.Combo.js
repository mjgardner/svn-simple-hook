/*
 ref:		Df.Combo
 extends:	Df.Ui
 type:		Class
 returns:	Df.Combo
 event:		this.element :update
*/
Df.Combo = Class.create(Df.Ui, {
	initialize: function($super, element, pars){
		$super(element, pars)
		
		this.width
		this.height
		this.pos
		this.left
		this.top
		this.listHolder
		this.list
		this.listH
		this.sizeY
		this.currentValue
		this.currentLabel
		this.currentIndex
		this.isOpen = false;
		
		this._up = this.up.bindAsEventListener(this)
		this._down = this.down.bindAsEventListener(this)
		this._setPosition = this.setPosition.bindAsEventListener(this)
		
		this.width = parseInt(this.element.offsetWidth)
		this.height = parseInt(this.element.offsetHeight)
		
		this.listHolder = $(this.pars.appendto).e('div', 'bottom', {className: this.pars.listClassName})
		if(this.pars.variableWidth){
			var e = document.body.e('div', 'bottom', {className: this.pars.leftEdgeClassName});

			var pos = Position.cumulativeOffset(this.getElement())
			var left = pos[0]
			var top = pos[1]

			e.setStyle({position:'absolute', left: left + 'px', top: top + 'px', zIndex: '1'});
		}
		
		this.setPosition()
		
		if(this.pars.listWidth){
			this.listHolder.style.width = this.pars.listWidth + 'px'
		}else{
			this.listHolder.style.width = this.width + 'px'
		}
		
		this.list = this.listHolder.e('div', 'bottom')
		
		if(this.pars.maxHeight){
			
			Object.extend(this.pars.scrollbar,{
				holder: this.listHolder,
				positionY:false,
				positionX:false
			});
			this.scrollbar = new Df.Scrollbar(this.list, this.pars.scrollbar)
		}
		
		this.repopulateData()
		
		this.listHolder.style.visibility = "hidden"
		
		this.sizeY = new Df.Animate(this.listHolder, this.pars.animate);
		
		return this
	},
	
	_initPars: function($super, pars){
		$super()
		this.setPars({
			initialValue: false,
			initialLabel: false,
			initialIndex: false,
			appendto: document.body,
            offSetType: "cumulativeOffset",
			listWidth: false,
			listClassName: 'list',
			hoverClassName: 'itemHover',
			selectedClassName: 'selected',
			animate: false,
			onUpdate:false,
			data: [
				{label:'test1',value:1},
				{label:'test2',value:2},
				{label:'test3',value:3}
			],
			maxHeight: false,
			scrollbar: {},
			variableWidth: true,
			leftEdgeClassName: ''
		})
		this.setPars(pars)
	},
	
	/*
	 ref:		Df.Combo.appendToData
	 type:		Method
	 returns:	Df.Combo
	*/
	appendToData: function(data){
		this.pars.data = this.pars.data.concat(data)
		this.repopulateData()
		
		return this
	},
	
	/*
	 ref:		Df.Combo.repopulateData
	 type:		Method
	 returns:	Df.Combo
	*/
	repopulateData: function(data){
		Event.stopObserving(this.element, 'click', this._down)
		Event.stopObserving(window, 'resize', this._setPosition)
		
		this.element.style.cursor = 'auto'
		if(data){
			this.pars.data = data
		}
		
		this.list.innerHTML = ''
		
		if(this.pars.data && this.pars.data.constructor == Array && this.pars.data.length > 0){
			
			for(var i=0; i<this.pars.data.length; i++){
				this.buildList(i)
			}
			
			if(this.pars.maxHeight){
				
				if(parseInt(this.list.getHeight()) > this.pars.maxHeight){
					this.list.setStyle({height:this.pars.maxHeight + 'px'})
				}
				
				this.list.fire(':resize')
			}
			
			if(this.pars.initialIndex || this.pars.initialIndex==0 || this.pars.initialValue || this.pars.initialValue==0 || this.pars.initialLabel || this.pars.initialLabel == 0){
				
				if(this.pars.initialValue || this.pars.initialValue==0){
					var index = this.findIndexByValue(this.pars.initialValue)
					if(index || index === 0){
						this.changeSelected(index)
					}
				}else if(this.pars.initialLabel || this.pars.initialLabel == 0){
					var index = this.findIndexByLabel(this.pars.initialLabel)
					if(index || index === 0){
						this.changeSelected(index)
					}
				}else if(this.pars.initialIndex || this.pars.initialIndex==0){
					this.changeSelected(index)
				}
			} else {
				this.highlightSelection()
			}
			Event.observe(this.element, 'click', this._down)
			Event.observe(window, 'resize', this._setPosition)
			this.element.style.cursor = 'pointer'
		}
		this.listH = parseInt(this.list.offsetHeight)
		
		return this
	},
	
	/*
	 ref:		Df.Combo.setCurrentValue
	 type:		Method
	 returns:	Df.Combo
	*/
	setCurrentValue: function(cv){
		var index = this.findIndexByValue(cv)
		if(index || index===0){
			this.changeSelected(index)
		}
		
		return this
	},
	
	/*
	 ref:		Df.Combo.getCurrentValue
	 type:		Method
	 returns:	String|Number
	*/
	getCurrentValue: function(){
		return this.currentValue;
	},
	
	/*
	 ref:		Df.Combo.getListItemNodeByIndex
	 type:		Method
	 returns:	Element
	*/
	getListItemNodeByIndex: function(index){
		var ary = this.list.getElementsByTagName('div')
		return $(ary[index])
	},
	
	/*
	 ref:		Df.Combo.getListItemNodeByLabel
	 type:		Method
	 returns:	Element
	*/
	getListItemNodeByLabel: function(l){
		var index = this.findIndexByLabel(l)
		var ary = this.list.getElementsByTagName('div')
		return $(ary[index])
	},
	
	/*
	 ref:		Df.Combo.getListItemNodeByValue
	 type:		Method
	 returns:	Element
	*/
	getListItemNodeByValue: function(v){
		var index = this.findIndexByValue(v)
		var ary = this.list.getElementsByTagName('div')
		return $(ary[index])
	},
	
	/*
	 ref:		Df.Combo.getListItemNodes
	 type:		Method
	 returns:	Array
	*/
	getListItemNodes: function(){
		return $A(this.list.getElementsByTagName('div'))
	},
	
	/*
	 ref:		Df.Combo.setCurrentLabel
	 type:		Method
	 returns:	Df.Combo
	*/
	setCurrentLabel: function(cl){
		var index = this.findIndexByLabel(cl)
		if(index || index===0){
			this.changeSelected(index)
		}
		return this
	},
	
	/*
	 ref:		Df.Combo.getCurrentLabel
	 type:		Method
	 returns:	String|Number
	*/
	getCurrentLabel: function(){
		return this.currentLabel;
	},
	
	/*
	 ref:		Df.Combo.setCurrentIndex
	 type:		Method
	 returns:	Df.Combo
	*/
	setCurrentIndex: function(ci){
		this.changeSelected(ci)
		
		return this
	},
	
	/*
	 ref:		Df.Combo.getCurrentIndex
	 type:		Method
	 returns:	Number
	*/
	getCurrentIndex: function(){
		return this.currentIndex;
	},
	
	setPosition: function (){
        try{
            this.pos = Position[this.pars.offSetType](this.getElement())
            this.left = this.pos[0]
            this.top = this.pos[1]
            this.listHolder.style.left = this.left + 'px'
            this.listHolder.style.top = this.top + this.height +'px'
        }catch(e){}
	},
	
	clearSelected: function(){
		this.currentIndex = false
		this.currentLabel = false
		this.currentValue = false
		this.element.innerHTML = ''
		return this
	},
	
	changeSelected: function(index){
	
		if(this.currentIndex !== index){
		
			if(this.pars.data.length > index){
				this.currentIndex = index
				this.currentLabel = this.pars.data[this.currentIndex].label
				this.currentValue = this.pars.data[this.currentIndex]['value']
			}
			
			this.element.fire(':update', {currentIndex: this.currentIndex, currentLabel: this.currentLabel, currentValue: this.currentValue})
			
			if(this.pars.onUpdate){
				this.pars.onUpdate(this);
			}
			
			this.highlightSelection()
		}
		
		return this
	},
	
	highlightSelection: function(){
		var index = this.findIndexByValue(this.getCurrentValue())
		this.currentIndex = index
		this.currentLabel = this.pars.data[this.currentIndex].label
		this.currentValue = this.pars.data[this.currentIndex]['value']
		
		//set presentation
		if(this.pars.data[this.currentIndex]){
			this.element.innerHTML = this.pars.data[this.currentIndex].label
		}
		
		//set list class
		var ary = this.list.getElementsByTagName('div')
		for(var i=0; i<ary.length; i++){
			var node = $(ary[i])
			if(node.index == this.currentIndex){
				node.addClassName(this.pars.selectedClassName)
			}else{
				node.removeClassName(this.pars.selectedClassName)
			}
		}
	},
	
	findIndexByValue: function(v){
		var ret = false;
		for(var i=0; i < this.pars.data.length; i++){
			if(this.pars.data[i]['value'] == v){
				ret = i;
				break;
			}
		}
		return ret;
	},
	
	findIndexByLabel: function(v){
		var ret = false;
		for(var i=0; i < this.pars.data.length; i++){
			if(this.pars.data[i].label == v){
				ret = i;
				break;
			}
		}
		return ret;
	},
	
	buildList: function(ii){
		var node = $(this.list).e('div', 'bottom',{
			innerHTML: this.pars.data[ii].label
		})
		node.index = ii
		node.observe('click', function(index){
			this.changeSelected(index)
			this.up()
		}.bind(this, ii))
		
		node.observe('mouseover', function(e){
			e.target.addClassName(this.pars.hoverClassName)
		}.bind(this))
		
		node.observe('mouseout', function(e){
			e.target.removeClassName(this.pars.hoverClassName)
		}.bind(this))
	},
	
	down: function(e){
		Event.stop(e)
		
		this.constructor.getInstances().each(function(v){
			if(v !== this){
				v.up()
			}
		}.bind(this))
		
		if(!this.isOpen){
			this.isOpen = true
			this.setPosition()
			
			this.listHolder.style.visibility = "visible"
			
			this.sizeY.pars.height = this.listH;
			this.sizeY.run();
			
			Event.stopObserving(this.element ,'click', this._down)
			Event.observe(this.element, 'click', this._up)
			Event.observe(document.body, 'click', this._up)
		}
	},
	
	up: function(e){
		if(e){
			Event.stop(e)
		}
		if(this.isOpen){
			this.isOpen = false
			this.sizeY.pars.onComplete = function(ins){
				ins.pars.onComplete = false
				this.listHolder.style.visibility = "hidden"
				Event.stopObserving(this.element,'click', this._up)
				Event.stopObserving(document.body,'click', this._up)
				Event.observe(this.element, 'click',this._down)
			}.bind(this)
			
			this.sizeY.pars.height = 0;
			this.sizeY.run();	
		}
		
	}
});
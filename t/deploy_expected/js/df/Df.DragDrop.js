Df.DragDrop = Class.create(Df.Drag, {
        initialize: function($super, element, pars) {
                $super(element, pars);

                this._overIt
                this._curRight
                this._curBottom
                this._parent
                this._startParent
                this._origPos
                this._loadLeft
                this._loadTop

                this._parent = this.element.up();
                this._loadLeft = this.element.getStyle('left');
                this._loadTop = this.element.getStyle('top');

                this.observe(':stop', function(s){
			this._curBottom = this._curY + this.element.getHeight();
                        this._curRight = this._curX + this.element.getWidth();
                        if (this.pars.allowTargets != false) {
                                this.checkAllowedTargets();
                        }

                        if (this.pars.denyTargets != false) {
                                this.checkDeniedTargets();
                        }

                }.bind(this));

                return this;
        },

	_initPars: function($super, pars){
		$super()

		this.setPars({
                        appendToBody: true,
                        allowTargets: false,
                        denyTargets: false,
			dragClass: 'df_element_dragging',
			dropClass: 'df_element_dragDropped',
                        afterDropClick: false
                });

		this.setPars(pars)
	},

        startIt: function($super, e){
                this._startParent = this.element.up();
                if(this.pars.appendToBody){
                        this._origPos = Element.cumulativeOffset(this.getElement());
                        this.element.style.left = this._origPos[0]+"px";
                        this.element.style.top = this._origPos[1]+"px";
                        document.body.appendChild(this.getElement())
                }

		this.getElement().removeClassName(this.pars.dropClass)
		this.getElement().addClassName(this.pars.dragClass)

		this._curX = this._origPos[0]
		this._curY = this._origPos[1]
                this._curBottom = this._curY + this.getElement().getHeight();
                this._curRight = this._curX + this.getElement().getWidth();
                $super(e)

                return this;
        },

        offsetX: function ($super, e) {
                if(this.pars.appendToBody){
                        var result = Event.pointerX(e) - this.getElement().cumulativeOffset().left
                }else{
                        var result = $super(e)
                }

                return result
        },

        offsetY: function ($super, e) {
                if(this.pars.appendToBody) {
                        var result = Event.pointerY(e) - this.getElement().cumulativeOffset().top
                }else{
                        var result = $super(e)
                }

                return result;
        },

	checkAllowedTargets: function() {
		if(this.pars.allowTargets.constructor != Array) {
                        this.pars.allowTargets = [this.pars.allowTargets]
                }

                var drop = false;
                loopie:
                for (i=0; i<this.pars.allowTargets.length; i++) {
                        if(this.isOverTarget($(this.pars.allowTargets[i]))) {
                                drop = true
                                this.dropItem($(this.pars.allowTargets[i]));
                                break loopie;
                        }
                }
                if (!drop){
                        this.returnItem()
                }

                return this;
	},

	checkDeniedTargets: function() {
		if(this.pars.denyTargets.constructor == Array) {
			for (i=0; i<this.pars.denyTargets.length; i++) {

				if (this.isOverTarget($(this.pars.denyTargets[i]))) {
					this.returnItem($(this.pars.denyTargets[i]));
					break;
				}
			}

		}else if (this.pars.denyTargets.constructor == String){

			if (this.isOverTarget($(this.pars.denyTargets[i]))) {
				this.returnItem();
			}
		}

                return this;
	},

	dropItem: function(s) {
                s.appendChild(this.getElement())
		this.getElement().style.left = "0px";
		this.getElement().style.top = "0px";
		this.getElement().removeClassName(this.pars.dragClass)
		this.getElement().addClassName(this.pars.dropClass)
	},

        isOverTarget: function(target) {
		var targetTop = Element.cumulativeOffset(target)[1];
		var targetLeft = Element.cumulativeOffset(target)[0];
		var targetBottom = targetTop + target.offsetHeight;
		var targetRight = targetLeft + target.offsetWidth;
		return this._curY < targetBottom && this._curBottom > targetTop && this._curRight > targetLeft && this._curX < targetRight;
	},

	returnItem: function(){
		this.element.setStyle({
                        left:this._loadLeft,
                        top:this._loadTop
                })

		$(this._parent).appendChild(this.getElement());
	},

	handleClick: function(e) {

		if(this.pars.onClick) {
                        if(typeof this.pars.onClick == "string" || typeof this.pars.onClick == 'function'){
                                this.pars.onClick(e)
                        }else if(!this.pars.onClick[this._startParent.id]){
                                this.pars.onClick.defaultClick(e)
                        }else if(this.pars.onClick[this._startParent.id] != 'none') {
                                this.pars.onClick[this._startParent.id](e)
                        }
		}

		Event.stopObserving(this.element, 'click', this._onClick)

		return this
	}
})

Df.DragCollection = Class.create(Df.Ui, {
	_setup: function($super){
		$super()

                this._dragDropItems = [];

                return this;
        },

	_initPars: function($super, pars){
		$super()
                this.setPars({
                        collectionInstance: this,
                        type: "list" //Accepts list or float
                })
		this.setPars(pars)

	},

	_initElement: function(){
		this.element.childElements().each(function(v){
			var type = Df.DragDropList
			if (this.pars.type == 'float') {
				type = Df.DragDropFloat
			}
			z = new type(v.identify(), this.pars)
			this._dragDropItems.push(z)
		}.bind(this));

		return this;

	},

	enable: function() {

		this._initElement()

                this._dragDropItems.each(function(v) {
                        v.enable()
                })

		return this;
        }
})

Df.DragDropFloat = Class.create(Df.DragDrop, {
	_setup: function($super){

		$super()

                this._mockElement
                this._nextSiblings
                this._previousSiblings
                this._curNextSibling
                this._curPreviousSibling
                this._loadNextSibling
                this._startNextSibling
                this._curHover
                this._moveDirection
                this._loadParent
                this._startParent

                this.setSiblings(this.getElement(), 'load')
                this._loadParent = $(this.getElement().up())

                return this;
        },

	_initPars: function($super, pars){
		$super()
                this.setPars({
                        handleDropOut: 'returnToStart' //valid arguments 'remove' : deletes Item   'returnToLoad': returns to original position  'returnToStart': returns to last position
                })
		this.setPars(pars)
	},


        startIt: function($super, e) {
                this._startParent = $(this.getElement().up())
                this.setSiblings(this.getElement(), 'start')
                this._mockElement = document.createElement(this.getElement().tagName);
                this._mockElement.setAttribute('id', 'mockElement');
                this._mockElement.setAttribute('class',$w(this.getElement().className)[0])
                this.setMockElement(this.getElement());
                if($('mockElement')) {
                        $('mockElement').setStyle({
                                height: this.element.getStyle('height'),
                                width: this.element.getStyle('width')
                        })
                      //  $('mockElement').clonePosition(this.getElement(),['setWidth','setHeight'])
                }
                $super(e)
                return this;
        },

        setSiblings: function(ele, action) {
                this._previousSiblings = ele.previousSiblings();
                this._nextSiblings = ele.nextSiblings();

                this._curNextSibling = $(ele.next(0)) || null;
                this._curPreviousSibling = ele.previous(0) || null;

                if(action == 'load') {
                        this._loadNextSibling = this._curNextSibling
                }else if(action == 'start') {
                        this._startNextSibling = this._curNextSibling
                }

                return this;
        },

        setMockElement: function(ele, stop) {
                if($('mockElement')) {
                        $('mockElement').remove()
                }
                if(!stop) {
                        if(this._moveDirection == "previous"){
                                $(this._parent).insertBefore(this._mockElement, ele)
                        }else if(this._moveDirection == "next" && ele.next(0)){
                                $(this._parent).insertBefore(this._mockElement, ele.next(0))
                        }else if(this._moveDirection == "next"){
                                $(this._parent).appendChild(this._mockElement)
                        }else if (this._curNextSibling) {
                                $(this._parent).insertBefore(this._mockElement, this._curNextSibling)
                        }
                }
                if($('mockElement')) {
                        $('mockElement').addClassName($w(this.getElement().className)[0] );
                }
        },

        followIt: function($super, e) {
		$super(e)

		if(this._previousSiblings) {

			this._previousSiblings.each(function(v){
				var nn = v
				this._moveDirection = "previous"
				if(this.isMouseOverIt(v, e)){
					this.setMockElement(v);
					this._curHover = v.identify()
                                        this.setSiblings($('mockElement'))
				}
			}.bind(this))

		}

		if(this._nextSiblings) {

			this._nextSiblings.each(function(vv){
				var nn = vv
				this._moveDirection = "next"
				if(this.isMouseOverIt(vv, e)){
					this.setMockElement(vv);
					this._curHover = vv.identify()
                                        this.setSiblings($('mockElement'))
				}
			}.bind(this))

		}

                return this;
        },

        isMouseOverIt: function (ele, e){
		var elePos = Position.cumulativeOffset(ele);
		var eleDim = Element.getDimensions(ele);

		var cursorX = Event.pointerX(e);
		var cursorY = Event.pointerY(e);

		var eleCont = { top:elePos.top, right:elePos.left + eleDim.width, bottom:elePos.top + eleDim.height, left:elePos.left }
                var overIt = cursorY < eleCont.bottom && cursorY > eleCont.top && cursorX > eleCont.left && cursorX < eleCont.right

                return overIt;
	},

        dropItem: function($super,s) {
		var pos = $('mockElement').cumulativeOffset()
		console.log(pos.toSource())
		if(parseInt(this.element.getStyle('left')) !== pos[0] || parseInt(this.element.getStyle('top')) !== pos[1]){
			this.getElement().animate({
				left:pos[0],
				top:pos[1],
				onComplete:function(e){
					s.insertBefore(this.getElement(), $('mockElement'))
					this.setMockElement('',true);
					this.clearDragPars()
					this.getElement().removeClassName(this.pars.dragClass)
					this.getElement().addClassName(this.pars.dropClass)
				}.bind(this)
			})
		} else {
			s.insertBefore(this.getElement(), $('mockElement'))
			this.setMockElement('',true);
			this.clearDragPars()
			this.getElement().removeClassName(this.pars.dragClass)
			this.getElement().addClassName(this.pars.dropClass)
		}
		return this;
        },
		
        clearDragPars: function() {
		this.getElement().style.left = "0px";
		this.getElement().style.top = "0px";
                this._moveDirection = "";
                return this;
        },

        returnItem: function($super) {
                $super()
                this.setMockElement('',true);
        }
})

Df.DragDropList = Class.create(Df.DragDropFloat, {
        initialize: function($super, element, pars) {
                $super(element, pars);

                return this;
        },

	_initPars: function($super, pars){
		$super()
                this.setPars({
                })
		this.setPars(pars)
	},
/*
        set: function($super, pars) {
                $super(pars);

                return this;
        },
*/
        startIt: function($super, e) {
                $super(e)
                this._mockElement.setAttribute('class','')
        },

        setMockElement: function($super, ele, stop) {
                $super(ele, stop)
                if($('mockElement')) {
                        $('mockElement').setAttribute('class','')
                }
        }
})
/*
 ref:		Element.tooltip
 returns:	Df.Tip
 delegate:	Df.Tip
 type:		Method
 arg:		Object pars
 example:	<script type="text/javascript">
			$('xxx').tooltip();
		</script>
*/
Element.addMethods({
	tip: function(element, pars){
		return new Df.Tip($(element), pars);
	}
});


Df._TipMixin = {

/*	This is not needed - it's creating extra TIP Holder
	initialize: function($super, element, pars){
		$super(element, pars)
		this._setup()
		return this
	},*/

	_initPars: function($super, pars){
		$super()
		this.setPars({
			data:'some sample text for the tool tip',
			className:'holder',
			parent: document.body,
			xOffset: 0,
			yOffset: 0,
			xOffsetPointer: 0,
			yOffsetPointer: 0,
			treatAsMenu: true,
			sensitive:true,
			controller: this,
			eventType: 'hover', //hover|click
			toggleShowDelay: 250,
			toggleHideDelay: 250,
			fitInPage: true,
			animate: false,
			xOrientation: 'left', //left|right|center
			yOrientation: 'top', //top|bottom|center
			pointerOrientation: 'left',//left|right|top|bottom
			iframe:true
		});
		this.setPars(pars)
	},

	_setup: function($super){

		this.pointer
		this.tip
		this.holder
		this.togglePane
		this.tipHeight
		this.tipWidth
		this.eleHeight
		this.eleWidth
		this.holderHeight
		this.holderWidth
		this.pointerHeight
		this.pointerWidth
		this.elePosTop
		this.elePosLeft
		this.maxHeight
		this.maxWidth
		this.offSetTop
		this.offsetLeft


		this.holder = $(this.pars.parent).e('div', 'bottom', {className:this.pars.className});
		this.tip = this.holder.e('div', 'bottom', {className:'tip'});
		if (this.pars.pointerOrientation)
			this.pointer = this.holder.e('div', 'bottom', {className: this.pointerClassName() });

		this.togglePane = new Df.TogglePane(this.holder, {
			controller: this.pars.controller,
			iframe:this.pars.iframe,
			animate: this.pars.animate,
			treatAsMenu: this.pars.treatAsMenu,
			eventType: this.pars.eventType,
			toggleShowDelay: this.pars.toggleShowDelay,
			toggleHideDelay: this.pars.toggleHideDelay
		});

		if(!Object.isUndefined(this.element))
			this.setContent(this.pars.data)

		this._showObserver()
		this._positionObserver()
        },

	_showObserver: function(){
		this.holder.observe(':show', function(e){
			this._show(e)
			this.holder.style.height = this.tipHeight + 'px';
			this.holder.style.width = this.tipWidth + 'px';
			this.getElement().fire(':position')
		}.bind(this));
	},

	_show: function(e){
		this.holder.style.display = 'block';
		this.setElementDems();
		try{
			this.holder.style.height = this.tipHeight + 'px';
		} catch(e){
		}
		try{
			this.holder.style.width = this.tipWidth + 'px';
		} catch(e){
		}
	},

	_positionObserver: function(){
		this.element.observe(':position', function(e){
			this._position(e)
		}.bind(this))
	},

	_position: function(e){
		e.stop()
		
		try{
			if(this.holder.style.display == 'block'){
				this.setPos();
				this.positionTip();
				//position for pointer
				if(this.pars.pointerOrientation){
					this.positionPointer();
				}
	
				//readjust to fit inside window
				if(this.pars.fitInPage){
					this.adjustToPage();
				}
			}
		} catch(e){
		}
	},

	setContent: function(content){
		this.holder.style.display = 'block';
		this.holder.style.visibility = 'hidden';

		this.tip.update(content)

		this.setDems();
		this.setPos();

		this.holder.style.display = 'none';
		this.holder.style.visibility = 'visible';

		return this
	},

	setElementDems: function(){
		this.eleHeight = parseInt(this.element.getDimensions().height)
		this.eleWidth = parseInt(this.element.getDimensions().width)
	},

	setDems: function(){
		this.tipHeight = parseInt(this.tip.getDimensions().height)
		this.tipWidth = parseInt(this.tip.getDimensions().width)

		this.setElementDems()

		this.holderHeight = parseInt(this.holder.getDimensions().height)
		this.holderWidth = parseInt(this.holder.getDimensions().width)

		if(this.pars.pointerOrientation){
			this.pointerHeight = parseInt(this.pointer.getDimensions().height)
			this.pointerWidth = parseInt(this.pointer.getDimensions().width)
		}

	},

	setPos: function(){

		this.elePosLeft = this.element.cumulativeOffset().left
		this.elePosTop = this.element.cumulativeOffset().top

		if(this.pars.parent != document.body){
			this.elePosLeft -= this.pars.parent.cumulativeOffset().left
			this.elePosTop -= this.pars.parent.cumulativeOffset().top
		}

		this.maxHeight = parseInt(Element.getDimensions(document.body).height)
		this.maxWidth = parseInt(Element.getDimensions(document.body).width)
		this.offSetTop = parseInt(Position.realOffset(this.holder)[1])
		this.offsetLeft = parseInt(Position.realOffset(this.holder)[0])
	},

	pointerClassName: function(){
		var cln = 'pointer';
		if( this.pars.yOrientation == 'top' && this.pars.pointerOrientation == 'top') {
			cln += 'T';
		}else if( this.pars.xOrientation == 'left' && this.pars.pointerOrientation !== 'bottom') {
			cln += 'L';
		}
		else if(this.pars.xOrientation == 'right' && this.pars.pointerOrientation !== 'bottom'){
			cln += 'R';
		}
		else {
			cln += 'B';
		}
		return cln
	},

	positionTip: function(){
		
		//align to the right
		if(this.pars.xOrientation == "right"){
			this.holder.style.left = this.elePosLeft + this.eleWidth + this.pars.xOffset + 'px';
		}
		//align to the left
		else if(this.pars.xOrientation == "left"){
			this.holder.style.left = this.elePosLeft - this.holderWidth - this.pars.xOffset + 'px';
		}
		//align centered on x axis
		else if(this.pars.xOrientation == "center"){
			this.holder.style.left = this.elePosLeft - (this.holderWidth/2) + ((this.eleWidth)/2) + this.pars.xOffset + 'px';
		}

		//align on top
		if(this.pars.yOrientation == "top"){
			this.holder.style.top = this.elePosTop - this.tipHeight - this.pars.yOffset + 'px';
		}
		//align to the bottom
		else if(this.pars.yOrientation == "bottom"){
			this.holder.style.top = this.elePosTop + this.eleHeight + this.pars.yOffset + 'px';
		}
		//align middle on y axis
		else if(this.pars.yOrientation == "center"){
			this.holder.style.top = this.elePosTop + ((this.eleHeight/2)-(this.tipHeight/2)) + this.pars.yOffset + 'px';
		}
	},

	positionPointer: function(){
		this.pointer.style.display = 'block';
		this.pointer.style.top = '0px';
		this.pointer.style.left = '0px';

		if(this.pars.xOrientation == "left" && this.pars.yOrientation == "top"){
			if(this.pars.pointerOrientation == "left"){
				this.pointerLeft()
				this.pointerSunkenTop()
			}
			else if(this.pars.pointerOrientation == "top"){
				this.pointerTop()
				this.pointerSunkenLeft()
			}
		}
		else if(this.pars.xOrientation == "center" && this.pars.yOrientation == "top"){
			this.pointerTop()
			this.pointerCenterX()
		}
		else if(this.pars.xOrientation == "right" && this.pars.yOrientation == "top"){
			if(this.pars.pointerOrientation == "right"){
				this.pointerRight()
				this.pointerSunkenTop()
			}
			else if(this.pars.pointerOrientation == "top"){
				this.pointerTop()
				this.pointerSunkenRight()
			}
		}
		else if(this.pars.xOrientation == "left" && this.pars.yOrientation == "center"){
			this.pointerLeft()
			this.pointerCenterY()
		}
		else if(this.pars.xOrientation == "right" && this.pars.yOrientation == "center"){
			this.pointerRight()
			this.pointerCenterY()
		}
		else if(this.pars.xOrientation == "right" && this.pars.yOrientation == "bottom"){
			if(this.pars.pointerOrientation == "right"){
				this.pointerRight()
				this.pointerSunkenBottom()
			}
			else if(this.pars.pointerOrientation == "bottom"){
				this.pointerBottom()
				this.pointerSunkenRight()
			}
		}
		else if(this.pars.xOrientation == "center" && this.pars.yOrientation == "bottom"){
			this.pointerBottom()
			this.pointerCenterX()
		}
		else if(this.pars.xOrientation == "left" && this.pars.yOrientation == "bottom"){
			if(this.pars.pointerOrientation == "left"){
				this.pointerLeft()
				this.pointerSunkenBottom()
			}
			else if(this.pars.pointerOrientation == "bottom"){
				this.pointerBottom()
				this.pointerSunkenLeft()
			}
		}
	},

	pointerTop: function(){
		try{
			this.holder.style.height = this.tipHeight + this.pointerHeight + this.pars.yOffsetPointer + 'px';
		}catch(e){}
		this.holder.style.top = parseInt(this.holder.style.top) - this.pointerHeight + -this.pars.yOffsetPointer + 'px';
		this.pointer.style.top = this.tipHeight + this.pars.yOffsetPointer + 'px';
	},

	pointerBottom: function(){
		this.holder.style.height = this.tipHeight + this.pointerHeight + this.pars.yOffsetPointer + 'px';
		this.tip.style.top = this.pointerHeight + this.pars.yOffsetPointer + 'px';
	},

	pointerSunkenTop: function(){
		this.holder.style.top = parseInt(this.holder.style.top) + this.pointerHeight - this.pars.yOffsetPointer + 'px';
		this.pointer.style.top = this.tipHeight - this.pointerHeight + this.pars.yOffsetPointer + 'px';
	},

	pointerSunkenBottom: function(){
		this.holder.style.top = parseInt(this.holder.style.top) - this.pointerHeight + this.pars.yOffsetPointer + 'px';
		this.pointer.style.top = -this.pars.yOffsetPointer + 'px';
	},

	pointerSunkenLeft: function(){
		this.holder.style.left = parseInt(this.holder.style.left) + this.pointerWidth - this.pars.xOffsetPointer + 'px'
		this.pointer.style.left = this.holderWidth - this.pointerWidth + this.pars.xOffsetPointer + 'px';
	},

	pointerSunkenRight: function(){
		this.holder.style.left = parseInt(this.holder.style.left) - this.pointerWidth + this.pars.xOffsetPointer + 'px';
		this.pointer.style.left = -this.pars.xOffsetPointer + 'px';
	},

	pointerHolderWidth: function(){
		this.holder.style.width = this.holderWidth + this.pointerWidth + this.pars.xOffsetPointer + 'px';
	},

	pointerLeft: function(){
		this.pointerHolderWidth()
		this.holder.style.left = parseInt(this.holder.style.left) - this.pointerWidth - this.pars.xOffsetPointer + 'px';
		this.pointer.style.left = this.tipWidth + this.pars.xOffsetPointer + 'px';
	},

	pointerRight: function(){
		this.pointerHolderWidth()
		this.tip.style.left = this.pointerWidth + this.pars.xOffsetPointer + "px";
	},

	pointerCenterX: function(){
		this.pointer.style.left = (parseInt(this.holder.style.width)/2) - (this.pointerWidth/2) + 'px';
	},

	pointerCenterY: function(){
		this.pointer.style.top = (this.tipHeight/2)-(this.pointerHeight/2) + 'px';
	},

	resizeHolderWithoutPointer: function(){
		this.holder.style.height = this.tipHeight + 'px';
		this.holder.style.width = this.tipWidth + 'px';
		this.tip.style.top = '0px';
		this.tip.style.left = '0px';
		this.pointer.style.display = 'none';
	},

	adjustToPage: function(){
		var deltaT = -1*(parseInt(this.holder.style.top) - this.offSetTop);
		var deltaB = (parseInt(this.holder.style.height) + parseInt(this.holder.style.top) - this.offSetTop) - this.maxHeight;
		var deltaL = -1*(parseInt(this.holder.style.left) - this.offsetLeft);
		var deltaR = (parseInt(this.holder.style.width) + parseInt(this.holder.style.left) - this.offsetLeft) - this.maxWidth;

		if(this.pars.pointerOrientation){
			if(((deltaT>0 | deltaB>0) && (deltaL>0 | deltaR>0)) |
			   (deltaT>0 && (this.pars.xOrientation == "center" | this.pars.pointerOrientation == "top")) |
			   (deltaB>0 && (this.pars.xOrientation == "center" | this.pars.pointerOrientation == "bottom")) |
			   (deltaL>0 && (this.pars.yOrientation == "center" | this.pars.pointerOrientation == "left")) |
			   (deltaR>0 && (this.pars.yOrientation == "center" | this.pars.pointerOrientation == "right"))
			   ){
				this.resizeHolderWithoutPointer();
			}

		}

		if(deltaT>0){
			this.holder.style.top = parseInt(this.holder.style.top) + deltaT + 'px'
			if(this.pars.pointerOrientation){
				this.pointer.style.top = parseInt(this.pointer.getStyle('top')) - deltaT  + 'px'
			}
		}
		else if(deltaB>0){
			this.holder.style.top = parseInt(this.holder.style.top) - deltaB + 'px'
			if(this.pars.pointerOrientation){
				this.pointer.style.top = parseInt(this.pointer.getStyle('top')) + deltaB  + 'px'
			}
		}

		if(deltaL>0){
			this.holder.style.left = parseInt(this.holder.style.left) + deltaL + 'px'
			if(this.pars.pointerOrientation){
				this.pointer.style.left = parseInt(this.pointer.getStyle('left')) - deltaL  + 'px'
			}
		}
		else if(deltaR>0){
			this.holder.style.left = parseInt(this.holder.style.left) - deltaR + 'px'
			if(this.pars.pointerOrientation){
				this.pointer.style.left = parseInt(this.pointer.getStyle('left')) + deltaR  + 'px'
			}
		}
	},

	addController: function(node){
		this.togglePane.addController(node)
		return this
	},

	removeController: function(node){
		this.togglePane.removeController(node)
		return this
	}
}

/*
 ref:		Df.Tip
 extends:	Df.Element
 returns:	Df.Tip
 type:		Class
 event: 	this.element :position
*/
Df.Tip = Class.create(Df.Element)
Df.Tip.addMethods(Df._TipMixin)

/*
 ref:		Df.NewTip
 extends:	Df.Base
 returns:	Df.NewTip
 type:		Class
 event: 	this.holder :position
*/
Df.NewTip = Class.create(Df.Base)
Df.NewTip.addMethods(Df._TipMixin)
Df.NewTip.addMethods({

	initialize: function($super, pars){
		$super(pars)
		this._setup()
		return this
	},

	_showObserver: function(){
		this.holder.observe(':show', function(e){
			//this.element = e.memo.event.target
			this.setContent()
			this._show(e)
			this.holder.fire(':position')
		}.bind(this));

		
		this.holder.observe(':controllerChange', function(e){
			//if(this.element != e.memo.event.target){
				//this.element = e.memo.event.target
				this.setContent.bind(this).defer()
				//this._show(e)
				//this.holder.fire(':position')
			//}
		}.bind(this))

	},

	setContent: function(){
		this.holder.style.display = 'block';
		this.holder.style.visibility = 'hidden';

		this.tip.update(this.pars.data)

		this.setDems();
		this.setPos();

		this.holder.style.display = 'none';
		this.holder.style.visibility = 'visible';

		return this
	},
	
	_positionObserver: function(){
		this.holder.observe(':position', function(e){
			this._position(e)
		}.bind(this))
	}
});
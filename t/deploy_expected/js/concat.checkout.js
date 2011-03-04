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
ess.checkout = ess.checkout || {};

document.observe("dom:loaded", function(e)
{
// Addressform - statefield select/textfield code starts here
ess.checkout.updateState = function(countryCode,countryfieldname, addressbookState){
	var stateFieldstr = countryfieldname.replace(".country",".state");
	if (ess.countries[countryCode]) {
		var statefield = ess.countries[countryCode].state.fieldtype;
		if (statefield == "selectoption") {
			ess.checkout.makeselectfield(countryCode, stateFieldstr, addressbookState);
		}
		else {
			ess.checkout.maketextfield(countryCode, stateFieldstr, addressbookState);
		}
	} else {
		ess.checkout.maketextfield(countryCode, stateFieldstr, addressbookState);
	}

};

ess.checkout.makeselectfield = function(countryCode, fieldnamestr, addressbookState){
	StoreCountryService.getStates(countryCode, function(response) {
		var stateField = $(fieldnamestr);
		var statePosX = stateField.positionedOffset()[0];
		var statePosY = stateField.positionedOffset()[1];
		var stateWidth = stateField.getDimensions()['width'];
		var stateHeight = stateField.getDimensions()['height'];
		var styleString = "left:" + statePosX + "px;top:" + statePosY + "px;width:" + stateWidth + "px;height:" + stateHeight + "px;";
		var loader = new Element('span', {
			'class': 'loader',
			'style': styleString
		});
		var stateResults = null;
		stateField.up().insert(loader);
		stateResults = response;
		var length = response.length;
		var newStateField = null;
		newStateField = new Element('select', { 'name':fieldnamestr, 'id':fieldnamestr, 'tabindex': '1' });
		newStateField.insert('<option value=""></option>');

		for(var j = 0; j < response.length; j++) {
			var optionLabel = response[j].code;
			newStateField.insert('<option value="'+response[j].code+'">'+optionLabel+'</option>');
		}
		stateField.replace(newStateField);

		if($(fieldnamestr+'AlternateText')) {
			$(fieldnamestr+'AlternateText').remove();
		}
		if(addressbookState)
			ess.checkout.updateStateSelectValue(addressbookState, fieldnamestr);
		else
			$(fieldnamestr).selectedIndex = 0;
		loader.remove();
	});
};

ess.checkout.maketextfield = function(countryCode, fieldnamestr, addressbookState){
	newStateField = new Element('input', { 'type': 'hidden', 'name':fieldnamestr, 'id':fieldnamestr, 'tabindex': '1', value: 'Other'});
	if(addressbookState){
		billingAddressStateAlternateText = addressbookState;
	}else if(ess.addressBook.billingAddressId!='0' && ess.addressBook.billingAddressId!=''&& ess.addressBook.getAddress(ess.addressBook.billingAddressId)) {
		billingAddressStateAlternateText = ess.addressBook.getAddress(ess.addressBook.billingAddressId).stateAlternateText;
	}else {
			billingAddressStateAlternateText = '';
	}

	newStateAlternateTextField = new Element('input', { 'type': 'text', 'class':'text','name':fieldnamestr+'AlternateText', 'id':fieldnamestr+'AlternateText', 'tabindex': '1', 'value':billingAddressStateAlternateText, 'maxlength':'20'});
	var oldStateField = $(fieldnamestr);
	oldStateField.replace(newStateField);
	if($(fieldnamestr+'AlternateText')) {
		$(fieldnamestr+'AlternateText').remove();
	}
	newStateField.insert({after:newStateAlternateTextField});
};

ess.checkout.updateStateSelectValue = function(addressbookState, stateField) {
	stateFieldObj = $(stateField);
	stateFieldObj.select('option').each(function(v) {
		if(v.value == addressbookState) {
			v.selected = true;
		}
	});

};

ess.checkout.updateAddressFields = function(billingOrshipping){
	selectstr = billingOrshipping + ".address.country";
	var selectedcountry = $(selectstr).value;
	var countryJSON = false;
	if (!Object.isUndefined(ess.countries[selectedcountry])) {
		//use selectedcountry
		countryJSON = ess.countries[selectedcountry];
	} else {
		countryJSON = ess.countries["International"];
	}
	for (var formfields in countryJSON) {
		var idstring= billingOrshipping+ "-" + formfields;
		idstring=idstring.toString();
		var newlabel = countryJSON[formfields].label;
		var newvisibility = countryJSON[formfields].visibility;
		if (newvisibility == "hidden") {
			newdisplay= "none";
		}else{
			newdisplay="block";
		}
		if ($(idstring)) {  //the email field does not exist in shippingAddress
			$(idstring).setStyle({
				'visibility': newvisibility,
				'display': newdisplay
			});
			
			// Peacocks uses * _fieldName_ to illustrate required 
			if(countryJSON[formfields].required){
				var reqdElement = new Element('span', {'class':'required'});
				reqdElement.update('*');
				$(idstring).firstDescendant().update(reqdElement);
				$(idstring).firstDescendant().insert(' ' + newlabel);
			}else{
				$(idstring).firstDescendant().update(newlabel);  //label is always first element after p. This removes the class="required" from all fields
			}
		}

	}
    /* the following code prevents users from selecting the Use Billing Address as Shipping Address option when selected billing country is not a shippable country */
    if (ess.availableShippingCountries)
    {
        /* we have specific country values where shipping to is permitted */
        if (billingOrshipping=='billingAddress' && $('shipOption1') && $('shipOption2'))
        {
            /* alert('----- ess.checkout.updateAddressFields -----' + '\nselectedcountry = ' + selectedcountry + '\ness.availableShippingCountries = ' + ess.availableShippingCountries + '\n$(\'shipOption1\') = ' + $('shipOption1') + '\n$(\'shipOption2\') = ' + $('shipOption2') + '\ncountryJSON = ' + countryJSON ); */
            if ($('shipOption3') && $('shipOption3').checked)
            {
                /* do nothing */
            }
            else
            {
                /* is our selected country in the list of availableShippingCountries */
                var canShipToSelectedCountry = false;
                var shippingCountries = ess.availableShippingCountries.split(',');
                for (var i = 0; i < shippingCountries.length; i++) {
                    if (shippingCountries[i] == selectedcountry) {
                        canShipToSelectedCountry = true;
                        break;
                    }
                }
                /* alert('canShipToSelectedCountry = ' + canShipToSelectedCountry); */
                if (!canShipToSelectedCountry) {
                    $('shipOption1').disabled = true;
                    if ($('shipOption1').checked) {
                        ess.addressBook.setMultiShipTo(false);
                        ess.addressBook.setShippingAddressId('');
                        //$('shipOption1').checked = false;
                        //$('shipOption2').checked = true;
                    }
                } else {
                    $('shipOption1').disabled = false;
					//$('shipOption1').checked = true;
                }
            }
        }
    }
};

ess.checkout.doLink = function(eventId) {
	$('linkForm_eventId').value = eventId;
	$('linkForm').submit();
}

ess.checkout.toggleButton = function(buttonId) {
	$(buttonId).toggle();
}

ess.checkout.editShippingAddress = function(addressId) {
	$('linkForm').insert(new Element('input', {type:'hidden',name:'edit',value:addressId}));
	ess.checkout.doLink("editShippingAddress");
}

// Addressform - statefield select/textfield code - ends here

// BEGIN ADDRESS SHOW/HIDE /// Works in FF/Chrome.
 
// this nonsense below is for IE. - IE DOES NOT SUPPORT hasAttribute or setAttribute, and prototype "fix" doesnt fix.
// Df.Animate is also not supported by IE. We have to do a browser check and swap out with a style apply.
	
	var isIE = /MSIE (\d+\.\d+);/.test(navigator.userAgent); //tests if browser is IE
	
	if (isIE == false){
		var elHeight = $('addresses').getHeight();
	};
	
	if($$(".toggle-link")[0]) {
		$$(".toggle-link")[0].observe("click",function(){			
			if (isIE){
				 	$('addresses').style.cssText = "display: none; margin-bottom: 5px;";
			} else {
					new Df.Animate( $('addresses') ).run({height:"5px",ease:Df.Transitions['linear']});
			};
			this.addClassName("hide");
			$$(".toggle-link")[1].removeClassName("hide");
		});
	}; 
	if ($$(".toggle-link")[1]) {
		$$(".toggle-link")[1].observe("click",function(){
			if (isIE){
				$('addresses').style.cssText = "display: block; margin-bottom: 0;";
			} else {
				new Df.Animate( $('addresses') ).run({height:elHeight+"px",ease:Df.Transitions['linear']});
			};
			this.addClassName("hide");
			 $$(".toggle-link")[0].removeClassName("hide");
			});
	};
	
	if ( ( $$("body#address-book").length > 0 ) && ( $('addresses') ) ) {
		if ( isIE ) {
			$('addresses').style.cssText = "display: none;";
		}
		else {
			$('addresses').style.cssText = "height: 0px;";
		}
	}
		

// If Node Exists
	
/*
	//for select dropdown - add span wrapper
	if ($$('select.fieldError')){
		$A($$("select.fieldError")).each(function(v) {
			v.wrap(new Element('span', {className:'fieldError'}));
		});
	}
	
	// Address formating
	if($$('.address-summary').length > 0) {
		ess.billShipAddress = new Address(ess.summaryJSON);
		$$(".address-summary").each(function(v){
			var addressId = v.id.split("-")[1];
			var address = ess.billShipAddress.getAddress(addressId);
			if(!Object.isUndefined(ess.countries[address.country])){
				var template = $(ess.countries[address.country].template);
			}
			else{
				var template = $(ess.countries["International"].template);
			}
			ess.address.formatAddress(address, template, v);
		});
	}
});
ess.checkout.formatAddressSuggestion = function(addSuggJSON, suggTarget) {
			if(!Object.isUndefined(ess.countries[addSuggJSON.countryCode])){
				var template = $(ess.countries[addSuggJSON.countryCode].addressSuggestionTemplate);
			}
			else{
				var template = $(ess.countries["International"].addressSuggestionTemplate);
			}
			ess.address.formatAddressSuggestion(addSuggJSON, template, suggTarget);
};
*/
});

// Default animation for shipToIns
defaultAnimation = function(domElement) {
	this.domElement = $(domElement);
	this.ins = new Df.Animate(this.domElement);
	this.hide = function() {
		if(!this.domElement.hasClassName('collapsed')) {
			this.domElement.style.height=this.domElement.scrollHeight;
			if(this.domElement.hasClassName('expanded')) {
				this.domElement.removeClassName('expanded');
			}
			this.ins.pars.time = 100;
			this.ins.pars.height = 1;
			this.ins.pars.domElement = this.domElement;
			this.ins.pars.onComplete = function(){
				this.onComplete = false;
				this.height = 1;
				this.opacity = 0;
				this.domElement.addClassName('collapsed');
			}
			this.ins.run();
		}

	}

	this.show = function() {
		if(this.domElement.hasClassName('collapsed')) {

			this.domElement.style.height="1px";
			this.domElement.style.overflow="hidden";
			this.domElement.removeClassName('collapsed');
			this.ins.pars.time = 100;
			this.ins.pars.height = this.domElement.scrollHeight;
			this.ins.pars.domElement = this.domElement;
			this.ins.pars.onComplete = function(){
				this.onComplete = false;
				this.opacity = .99;
				if(!this.domElement.hasClassName('expanded')) {
					this.domElement.addClassName('expanded');
					this.domElement.style.overflow="visible";
				}
			}
			this.ins.run();
		}
	}
};

function checkRequired(requiredFields) {
	if("object"!=typeof(requiredFields))return false;
	var validated=true;
	var focused=false;
	var blankMessage='Please enter values for all required fields.';
	var invalidCharactersMessage='Invalid Characters: *';
	var invalidZipcodeMessage='Please enter a postal code with either 5 numbers or 9 numbers separated by a dash. Example: 12345 or 12345-1234.';
	var invalidAscii=["96","127",{range:"1-31,166-255"}];
	requiredFields.each(function(el,i){
		var value=el.getValue();
		var valid=true;
		if(true==value.blank()&&!el.readAttribute('id').match(/address2/)){
			valid=false;
		}else{
			var matches=value.matchAscii(invalidAscii);
			var errId=el.readAttribute('id')+'_error';
			var err=$(errId);
			if(matches){
				if(!err)el.insert({after:new Element('p',{className:'fieldErrorMessages',id:errId}).update(invalidCharactersMessage.replace('*',matches))});
				else err.update(invalidCharactersMessage.replace('*',matches));
				valid=false;
			}else{
				if('shippingAddress.address.postalCode'==el.readAttribute('id')){
					if(!value.match(/^\d{5}-\d{4}$/)&&!value.match(/^\d{5}$/)){
						valid=false;
						if(!err)el.insert({after:new Element('p',{className:'fieldErrorMessages',id:errId}).update(invalidZipcodeMessage)});
						else err.update(invalidZipcodeMessage);
					}else{
						if(err)err.remove();
					}
				}else{
					if(err)err.remove();
				}
			}
		}
		if(!focused&&!valid){el.focus();focused=true;}
		if($('addressBookForm')){
			fieldParent=$('shippingAddress')||$('shipOpt');
		}else{
			if(el.descendantOf('billingAddress'))
				fieldParent=$$('#billingAddress .section')[0];
			else if(el.descendantOf('shipping-address'))
				fieldParent=$('shipping-address-content');
		}
		if(!valid){
			el.addClassName('fieldError');
			validated=false;
		}else{
			el.removeClassName('fieldError');
		}
		if(!validated){
			if(!fieldParent.select('.insertedError')[0])fieldParent.insert({'top':new Element('p',{className:'fieldErrorMessages insertedError'}).update(blankMessage)});
		}else{
			var error=fieldParent.select('.insertedError')[0];
			if(error)error.remove();
		}
	});
	return validated;
}
document.observe('dom:loaded',function(e){

	$A($$('span.tooltip')).each(function(f){
		f.removeClassName("hide");
	}); 

	$A($$('a.close-tip')).each(function(f){
			f.writeAttribute("onclick", "return false");
	}); 
	
	$A($$('a.tooltip')).each(function(v){
		v.writeAttribute("href", "Javascript:void(0);");
		v.writeAttribute("onclick", "return false");
		var info=null;
		if($(v).up().next()&&$(v).up().next().className=='tooltip')info=$(v).up().next();
		else if($(v).next()&&$(v).next().className=='tooltip')info=$(v).next();
		var tipPars={
			data:info,
			eventType:'click',
			treatAsMenu:false,
			sensitive:true,
			xOffset:5,
			yOffset:-3,
			yOffsetPointer:-1,
			xOffsetPointer:-32,
			pointerOrientation:'top',
			xOrientation:'right',
			yOrientation:'top',
			toggleShowDelay:0,
			toggleHideDelay:0,
			animate:{
					opacity:.9,
					time:500,
					pause:20
			}
		};
		if(info!=null){
			var ins=new Df.Tip(v,tipPars);
			info.select('a.close-tip').each(function(n){
				n.observe('click',function(e){
					this.up(2).hide();
					ins.togglePane.hide();
				});
			});
		}
	});


});


ess.address = {};

/*
 * Input: JSON data object and a zparse template
 * Replaces target HTML with the markup output of zparse engine
 */
ess.address.formatAddress = function(JSONObj, zParseTemplate, target){
	var parser = new ZParse(Implementation);
	parser.parse(zParseTemplate.innerHTML);
	var outputHTML = parser.process({
		firstName: JSONObj.firstName,
		lastName: JSONObj.lastName,
		address1: JSONObj.address1,
		address2: JSONObj.address2,
		address3: JSONObj.address3,
		city: JSONObj.city,
		state: JSONObj.state,
		stateAlternateText: JSONObj.stateAlternateText,
		postalCode: JSONObj.postalCode,
		country: JSONObj.fullCountryName
	});
	target.update(outputHTML);
};
ess.address.formatAddressSuggestion = function(JSONObj, zParseTemplate, target){
	var parser = new ZParse(Implementation);
	parser.parse(zParseTemplate.innerHTML);
	try {
	var outputHTML = parser.process({
		address1: JSONObj.address1,
		address1Error:JSONObj.address1Error,
		address2: JSONObj.address2,
		address2Error:JSONObj.address2Error,
		address3: JSONObj.address3,
		address3Error:JSONObj.address3Error,
		city: JSONObj.city,
		cityError:JSONObj.cityError,
		state: JSONObj.state,
		stateError:JSONObj.stateError,
		stateAlternateText: JSONObj.stateAlternateText,
		stateAlternateTextError: JSONObj.stateAlternateTextError,
		postalCode: JSONObj.postalCode,
		postalCodeError: JSONObj.postalCodeError,
		country: JSONObj.fullCountryName,
		countryError: JSONObj.fullCountryNameError
	});} catch(e){
  }
	target.update(outputHTML);
};
// JavaScript Document
AddressBook = function(abJSONObject) {
  this.billingAddressId = abJSONObject.billingAddressId;
  this.shippingAddressId = abJSONObject.shippingAddressId;
  this.addresses = 	abJSONObject.addresses;
  this.billingAddressUpdateListeners = [];
  this.shippingAddressUpdateListeners = [];
  this.updateListeners = [];
  this.multiShipTo = abJSONObject.multiShipTo;
  if(abJSONObject.preferredBillingAddressId)
	  this.preferredBillingAddressId = abJSONObject.preferredBillingAddressId;
  if(abJSONObject.preferredShippingAddressId)
	  this.preferredShippingAddressId = abJSONObject.preferredShippingAddressId;

  this.addBillingAddressUpdateListener = function(listener) {
    this.billingAddressUpdateListeners.push(listener);
  }
  this.addShippingAddressUpdateListener = function(listener) {
    this.shippingAddressUpdateListeners.push(listener);
  }

  this.addUpdateListener = function(listener) {
    this.updateListeners.push(listener);
  }

  this.setMultiShipTo = function(multiShipTo) {
    this.multiShipTo = multiShipTo;
  }
  this.setBillingAddressId = function(addressId) {
    this.billingAddressId = addressId;
    for(var i=0;i<this.billingAddressUpdateListeners.length;i++) {
      this.billingAddressUpdateListeners[i].observeBillingAddressUpdate(this);
    }
    this.updated();
  }
  this.setShippingAddressId = function(addressId) {
    this.shippingAddressId = addressId;
    for(var i=0;i<this.shippingAddressUpdateListeners.length;i++) {
      this.shippingAddressUpdateListeners[i].observeShippingAddressUpdate(this);
    }
    this.updated();
  }
  this.updated = function() {
    for(var i=0;i<this.updateListeners.length;i++) {
      this.updateListeners[i].observeAddressBookUpdate(this);
    }
  }

  this.getAddress = function(addressId) {
    for(var i=0;i<this.addresses.length;i++) {
      if(this.addresses[i].id==addressId) {
        return this.addresses[i];
      }
    }
    return null;
  }

}

Address = function(aJSONObject) {
  this.addresses = 	aJSONObject.addresses;
  this.getAddress = function(addressId) {
    for(var i=0;i<this.addresses.length;i++) {
      if(this.addresses[i].id==addressId) {
        return this.addresses[i];
      }
    }
    return null;
  }

}

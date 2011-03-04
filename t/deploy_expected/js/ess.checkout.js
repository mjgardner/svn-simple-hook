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
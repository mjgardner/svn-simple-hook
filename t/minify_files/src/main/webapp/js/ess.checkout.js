// JavaScript Document
ess.checkout = {};
ess.checkout.toggleButton = function(buttonId) {
	$(buttonId).toggle();
};
ess.checkout.doLink = function(eventId) {
	$('linkForm_eventId').value = eventId;
	$('linkForm').submit();
};
ess.checkout.editShippingAddress = function(addressId) {
	$('linkForm').insert(new Element('input', {type:'hidden',name:'edit',value:addressId}));
	ess.checkout.doLink("editShippingAddress");
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
			/* Peacocks uses * _fieldName_ to illustrate required */
			if(countryJSON[formfields].required){
				var reqdElement = new Element('span', {'class':'required'});
				reqdElement.update('*');
				$(idstring).firstDescendant().update(reqdElement);
				$(idstring).firstDescendant().insert(' ' + newlabel);
			}else{
				$(idstring).firstDescendant().update(newlabel);  //label is always first element after p. This removes the class="required" from all fields
			}

			if(Object.isUndefined(countryJSON[formfields].toolTip)){}
			else{
				var toolTip = ($(idstring).select('[class="tooltip"]'))[0];
				if(countryJSON[formfields].toolTip){
					toolTip.setStyle({
						'visibility': 'visible',
						'display': 'block'
					});
				}
				else{
					toolTip.setStyle({
						'visibility': 'hidden',
						'display': 'none'
					});
				}
			}
		}

	}
};

/* Addressform - statefield select/textfield code starts here */
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

	StoreCountryService.getStates(countryCode, function(response) {
		stateResults = response;
		var length = response.length;
		var newStateField = null;
		newStateField = new Element('select', { 'name':fieldnamestr, 'id':fieldnamestr, 'tabindex': '1' });
		newStateField.insert('<option value="">Please Select</option>');

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
	});
	loader.remove();
};

ess.checkout.maketextfield = function(countryCode, fieldnamestr, addressbookState){
	newStateField = new Element('input', { 'type': 'hidden', 'class': 'hidden', 'name':fieldnamestr, 'id':fieldnamestr, 'tabindex': '1', value: 'Other'});
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

	// PEAC specific styling
	$$('#billingAddress-state label')[0].addClassName('county-default-label');
	$$('#shippingAddress-state label')[0].addClassName('county-default-label');
};

ess.checkout.updateStateSelectValue = function(addressbookState, stateField) {
	stateFieldObj = $(stateField);
	stateFieldObj.select('option').each(function(v) {
		if(v.value == addressbookState) {
			v.selected = true;
		}
	});

};

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
			this.ins.pars.time = 300;
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

	};

	this.show = function() {
		if(this.domElement.hasClassName('collapsed')) {

			this.domElement.style.height="1px";
			this.domElement.style.overflow="hidden";
			this.domElement.removeClassName('collapsed');
			this.ins.pars.time = 300;
			this.ins.pars.height = this.domElement.scrollHeight;
			this.ins.pars.domElement = this.domElement;
			this.ins.pars.onComplete = function(){
				this.onComplete = false;
				this.opacity = .99;
				if(!this.domElement.hasClassName('expanded')) {
					this.domElement.addClassName('expanded');
				}
			};
			this.ins.run();
		}
	}

	this.hide = function() {
		if(!this.domElement.hasClassName('collapsed')) {
			this.domElement.style.height=this.domElement.scrollHeight;
			if(this.domElement.hasClassName('expanded')) {
				this.domElement.removeClassName('expanded');
			}
			this.ins.pars.time = 300;
			this.ins.pars.height = 1;
			this.ins.pars.domElement = this.domElement;
			this.ins.pars.onComplete = function(){
				this.onComplete = false;
				this.height = 1;
				this.opacity = 0;
				this.domElement.addClassName('collapsed');
			};
			this.ins.run();
		}

	};
};
/* Addressform - statefield select/textfield code - ends here */

document.observe("dom:loaded", function(e) {

	var toggleLink = { height : '125px' };
	if($$(".toggle-link")[0]) {
		$$(".toggle-link")[0].observe("click",function(){

			var operativeNode = this.next().next();
			toggleLink.height = operativeNode.offsetHeight;

			if(this.hasClassName('collapse')==true) {

				new Df.Animate(operativeNode).run({height:"0px",ease:Df.Transitions['linear']});
				this.addClassName('hide');
				$$(".toggle-link")[1].removeClassName('hide');

			}

		});
		$$(".toggle-link")[1].observe("click",function(){

			var operativeNode = this.next();
			if(this.hasClassName('expand')==true) {

				new Df.Animate(operativeNode).run({height:toggleLink.height,ease:Df.Transitions['linear']});

				this.addClassName('hide');
				$$(".toggle-link")[0].removeClassName('hide');
			}

		});
	} // If Node Exists

	// for select dropdown - add span wrapper
	$$("select.fieldError").each(function(v) {
		v.wrap(new Element('span', {className:'fieldError'}));
	});

	/* Address formating */
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
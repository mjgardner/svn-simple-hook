if(!ess.addresssuggestions) {
ess.addresssuggestions = {};
}
ess.addresssuggestions.updateSelectElement = function(ele, selectedValue){
	var selectElement = $(ele);
	var updated = false
	selectElement.select('option').each(function(v) {
		if(v.value == selectedValue) {
			v.selected = true;
			updated = true;
		}
	});
	return updated;
}

ess.addresssuggestions.onAddressChange = function(e, addressType, addressTypePrefix){
	//  parse out address prefix, grab integer that corresponds to JSON object
	//  example: billingSuggOption0 >>> billingAddress.address.honorific >>> suggestions.billingAddress[0].honorific
	var x = e.target.id.split(addressTypePrefix);
	var addType = addressType.split("Address")[0];
	var selectedJSONObject= x[1];
	var addressSuggestionIgnored = true;
	var suggestions = ess.addresssuggestions.suggestions;
	//fill out form with json data
	$(addressType + '.address.honorific').value = suggestions[addressType][selectedJSONObject].honorific;
	$(addressType + '.address.firstName').value = suggestions[addressType][selectedJSONObject].firstName;
	$(addressType + '.address.lastName').value = suggestions[addressType][selectedJSONObject].lastName;
	$(addressType + '.address.businessName').value = suggestions[addressType][selectedJSONObject].businessName;
	$(addressType + '.address.address1').value = suggestions[addressType][selectedJSONObject].address1;
	$(addressType + '.address.address2').value = suggestions[addressType][selectedJSONObject].address2;
	$(addressType + '.address.address3').value = suggestions[addressType][selectedJSONObject].address3;
	if ($(addType+'CityName')) {
		if(!ess.addresssuggestions.updateSelectElement(addType+'CityName', suggestions[addressType][selectedJSONObject].city)){
			var newCityField = new Element('input', { 'type': 'text', 'class':'text','name':''+addressType + '.address.city', 'id':''+addressType + '.address.city', 'tabindex': '1', 'value':suggestions[addressType][selectedJSONObject].city});
			$(addType+'CityName').replace(newCityField);
		}
		//$(addressType + '.address.city').value = suggestions[addressType][selectedJSONObject].city;
	} else {
		$(addressType + '.address.city').value = suggestions[addressType][selectedJSONObject].city;
	}
	if ($(addressType + '.address.state').tagName.toLowerCase() == "select") {
		ess.addresssuggestions.updateSelectElement(addressType + '.address.state', suggestions[addressType][selectedJSONObject].state);
	}
	else {
		$(addressType + '.address.state').value = "Other";
		$(addressType + '.address.stateAlternateText').value = suggestions[addressType][selectedJSONObject].stateAlternateText;
	}
	$(addressType + '.address.postalCode').value = suggestions[addressType][selectedJSONObject].postalCode;
	$(addressType + '.address.country').value = suggestions[addressType][selectedJSONObject].country;
	$(addressType + '.phone').value = suggestions[addressType][selectedJSONObject].phone;
	if(addressType=="billingAddress" && $(addressType + '.emailAddress')) $(addressType + '.emailAddress').value = suggestions[addressType][selectedJSONObject].emailAddress;
}

ess.addresssuggestions.addressSuggestionBindListeners = function(){
	if($('billingSuggOption0')){
		$$("input[name=billingSuggOption]").each(function(v){
			v.observe('click', ess.addresssuggestions.onAddressChange.bindAsEventListener(v, "billingAddress", "billingSuggOption"));
		});
	}
	if($('shippingSuggOption0')){
		$$("input[name=shippingSuggOption]").each(function(v){
			v.observe('click', ess.addresssuggestions.onAddressChange.bindAsEventListener(v, "shippingAddress", "shippingSuggOption"));
		});
	}
}

ess.addresssuggestions.onEnterDifferentAddress = function(){
	/* alert('-- ess.addresssuggestions.onEnterDifferentAddress --'); */
    if ($('address-main').getStyle('display') == 'none') {
		ess.addresssuggestions.differentAddressToggleForms();
		ess.addresssuggestions.differentAddressClearErrors();
		ess.addresssuggestions.differentAddressResetIgnoreFlag();
		ess.addresssuggestions.differentAddressDisableButtons();
	}
}

ess.addresssuggestions.differentAddressDisableButtons = function(){
    if ($('address-sugg-enter-diff-top')) {
        $('address-sugg-enter-diff-top').hide();
    }
    if ($('address-sugg-enter-diff-bott')) {
        $('address-sugg-enter-diff-bott').hide();
    }
}

ess.addresssuggestions.differentAddressResetIgnoreFlag = function(){
	if($('ignoreBillingAddressSuggestions')){
		$('ignoreBillingAddressSuggestions').value = false; //we now want to validate the form
	}
	if($('ignoreShippingAddressSuggestions')){
		$('ignoreShippingAddressSuggestions').value = false; //we now want to validate the form
	}

}

ess.addresssuggestions.differentAddressToggleForms = function(){
	$('address-main').show();
	$('address-suggestion-results').hide();
}

ess.addresssuggestions.differentAddressClearErrors = function(){
	$$('.error').each(function(v){
		v.remove();
	});
	$$('.fieldErrorMessages').each(function(v){
		v.remove();
	});
	$$('.fieldError').each(function(v){
		v.removeClassName('fieldError');
	});
	var billAddressFlag = false;
	var billAddressId = '0';
	var shipAddressFlag = false;
	var billAsShip = false;
	if (!Object.isUndefined(ess.addresssuggestions.suggestions["billingAddress"])) {
		//		ess.addressBook.setBillingAddressId('0');
		ess.addresssuggestions.differentAddressClearFields("billingAddress");
		ess.addressBook.billingAddressId = '0';
		if ($('addresses')) {
			var checkboxes = $('addresses').select('[type="checkbox"]');
			checkboxes.each(function(v, index){
				if (v.checked == true && v.name == "useAsBillingAddress") {
					v.checked = false;
					billAddressId = v.value;
				}
			});
		}
		billAddressFlag = true;
	}
	if (!Object.isUndefined(ess.addresssuggestions.suggestions["shippingAddress"])) {
		//		ess.addressBook.setShippingAddressId('0');
		ess.addresssuggestions.differentAddressClearFields("shippingAddress");
		if ($('addresses')) {
			var checkboxes = $('addresses').select('[type="checkbox"]');
			checkboxes.each(function(v, index){
				if (v.checked == true && v.name == "useAsShippingAddress") {
					v.checked = false;
				}
			});
		}
		shipAddressFlag = true;
	}
	else if (billAddressFlag) {
		if ($('addresses')) {
			var checkboxes = $('addresses').select('[type="checkbox"]');
			checkboxes.each(function(v, index){
				if (v.checked == true && v.name == "useAsShippingAddress" && v.value == billAddressId) {
					v.checked = false;
					billAsShip = true;
				}
				else
					if (v.checked == true && v.name == "useAsShippingAddress") {
						shipAddressFlag = true;
					}
			});
		}else if(!ess.addressBook.multiShipTo && $('shipOption1').checked){
			billAsShip = true;
		}else{
			shipAddressFlag = true;
		}
	}
	/* alert("billAddressFlag:"+billAddressFlag+"\nbillAsShip:"+billAsShip+"\nshipAddressFlag:"+shipAddressFlag+"\nshipOption2:"+shipOption2); */
	if(!billAsShip && (billAddressFlag && shipAddressFlag)){
		$('shipOption2').checked = true;
		ess.addressBook.setMultiShipTo(false);
	}else if((billAddressFlag && billAsShip) || (billAddressFlag && shipAddressFlag)){
		$('shipOption1').checked = true;
		ess.addressBook.setMultiShipTo(false);
		ess.addressBook.setShippingAddressId(ess.addressBook.billingAddressId);
	}else{
		$('shipOption3').checked = true;
		ess.addressBook.setMultiShipTo(true);
	}
}

ess.addresssuggestions.differentAddressClearFields = function(addressType){
	ess.addresssuggestions.updateSelectElement(addressType + '.address.honorific', "");
	$(addressType + '.address.id').setValue('0');
	$(addressType + '.address.firstName').clear();
	$(addressType + '.address.lastName').clear();
	$(addressType + '.address.businessName').clear();
	$(addressType + '.address.address1').clear();
	$(addressType + '.address.address2').clear();
	$(addressType + '.address.address3').clear();
	if (addressType == "billingAddress" && $('billingCityName')) {
		$('billingCityName').replace(new Element('input', {
			'type': 'text',
			'name': 'billingAddress.address.city',
			'id': 'billingAddress.address.city',
			'value': '',
			'class': 'text',
			'tabindex': '1'
		}));
	}
	else if (addressType == "shippingAddress" && $('shippingCityName')) {
		$('shippingCityName').replace(new Element('input', {
			'type': 'text',
			'name': 'shippingAddress.address.city',
			'id': 'shippingAddress.address.city',
			'value': '',
			'class': 'text',
			'tabindex': '1'
		}));
	}
	else {
		$(addressType + '.address.city').clear();
	}
	if(addressType == 'billingAddress')
		$(addressType + '.address.country').value = ess.defaultBillingCountryCode;
	else
		$(addressType + '.address.country').value = ess.defaultShippingCountryCode;
	ess.checkout.updateState($(addressType + '.address.country').value, addressType + '.address.country');
	ess.checkout.updateAddressFields(addressType);
	$(addressType + '.address.postalCode').clear();
	$(addressType + '.phone').clear();
	if($(addressType + '.emailAddress')){
		$(addressType + '.emailAddress').clear();
	}
}

ess.addresssuggestions.differentAddressBindListeners = function(){
    /* alert('$(\'address-sugg-enter-diff-top\') = ' + $('address-sugg-enter-diff-top') + '\n' + '$(\'address-sugg-enter-diff-bott\') = ' + $('address-sugg-enter-diff-bott')); */
    if($('address-sugg-enter-diff-top')){
        $('address-sugg-enter-diff-top').observe('click', ess.addresssuggestions.onEnterDifferentAddress.bindAsEventListener(this));
    }
	if($('address-sugg-enter-diff-bott')){
		$('address-sugg-enter-diff-bott').observe('click', ess.addresssuggestions.onEnterDifferentAddress.bindAsEventListener(this));
	}
}

document.observe("dom:loaded", function(e){
	if(ess.addresssuggestions.suggestions){
		ess.addresssuggestions.addressSuggestionBindListeners();
	}
	ess.addresssuggestions.differentAddressBindListeners();
});
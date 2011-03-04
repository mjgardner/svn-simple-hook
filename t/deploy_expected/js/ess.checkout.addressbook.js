var skip = false;
ess.checkout = ess.checkout || {};
ess.checkout.addressbook = ess.checkout.addressbook || {};
ess.checkout.addressbook.resetShippingAddress = function(){
    /*	Keep the id same to replace the selected address */
	$('shippingAddress.address.id').value = '0';
	$('shippingAddress.address.honorific').value = '';
	$('shippingAddress.address.firstName').value = '';
	$('shippingAddress.address.lastName').value = '';
	$('shippingAddress.address.address1').value = '';
	$('shippingAddress.address.address2').value = '';
	$('shippingAddress.address.address3').value = '';
	if($('shippingCityName')){
		$('shippingCityName').insert({before:new Element('input', { 'type': 'text', 'name': 'shippingAddress.address.city', 'id': 'shippingAddress.address.city', 'value': '', 'class': 'text'})});
		$('shippingCityName').name = 'shippingCityName1';
		$('shippingCityName').setStyle({display: 'none'});
		$('shippingCityName').id	= 'shippingCityName1';
	}
	if($('shippingAddress.address.city')){
		$('shippingAddress.address.city').value = '';
	}
	$('shippingAddress.address.postalCode').value = '';
	$('shippingAddress.address.country').value = ess.defaultShippingCountryCode;
	$('shippingAddress.phone').value = '';
	ess.checkout.updateState($('shippingAddress.address.country').value, "shippingAddress.address.country");
	//$('stateCode').selectedIndex = 0;
	var mainSelector = false;
	if($('shipOpt')){
		mainSelector = $('shipOpt');
	}else if($('multiShip')){
		mainSelector = $('multiShip');
	}
	mainSelector.select('.error').each(function(v){
		if(v.tagName == 'SPAN' || v.tagName == 'P'){
			v.remove();
		}else{
			v.removeClassName('error');
		}
	});
	mainSelector.select('.fieldError').each(function(v){
		if(v.tagName == 'SPAN'){
			v.removeClassName('fieldError');
		}
	});
	if($('preferredBilling1'))
		$('preferredBilling1').checked = false;
	if($('preferredShipping1'))
		$('preferredShipping1').checked = false;
	ess.checkout.addressbook.insertMode();
}
ess.checkout.addressbook.editMode = function(){
	$$('.editMode').each(function(node){
		node.show();
	});
	/* $$('.insertMode').each(function(node){
		node.hide();
	}); */
}
ess.checkout.addressbook.insertMode = function(){
	$$('.insertMode').each(function(node){
		node.show();
	});
	$$('.editMode').each(function(node){
		node.hide();
	});
}
Event.observe(window,'load',function(e) {
    /* alert('-----[ BEGIN - ess.checkout.addressbook.js - dom:loaded ]-----'); */
	ess.addressBook = new AddressBook(ess.abJSON);
	ess.checkout.addressbook.insertMode();

	$$(".editAddress").each(function(v) {
		v.addressId = v.id.substring(7);  //7 is the length of 'address'
		v.href = "javascript:void(0)";
		v.observe("click", function(e) {
			ess.addressBook.setShippingAddressId(this.addressId);
			ess.checkout.updateAddressFields("shippingAddress");
			ess.checkout.addressbook.editMode();
		});
	});

	// Update shipping state dropdown when the country changes
	$('shippingAddress.address.country').observe('change', function(e) {
		ess.checkout.updateState(this.value, this.name);
	});


	$('addressBookForm').observeShippingAddressUpdate = function(addressBook){
		if($('shippingCityName')) {
			Element.replace($('shippingCityName'),new Element('input', {type:'text',name:'shippingAddress.address.city',value:'',id:'shippingAddress.address.city',className:'text'}));
		}
		var currentAddress = addressBook.getAddress(addressBook.shippingAddressId);
		if(currentAddress!=null) {
			$('shippingAddress.address.id').value = currentAddress.id;
			$('shippingAddress.address.honorific').value = currentAddress.honorific;
			$('shippingAddress.address.firstName').value = currentAddress.firstName;
			$('shippingAddress.address.lastName').value = currentAddress.lastName;
			$('shippingAddress.address.address1').value = currentAddress.address1;
			$('shippingAddress.address.address2').value = currentAddress.address2;
			$('shippingAddress.address.address3').value = currentAddress.address3;
			$('shippingAddress.address.city').value = currentAddress.city;
			$('shippingAddress.address.country').value = currentAddress.country;
			if(currentAddress.state != "Other")
				ess.checkout.updateState(currentAddress.country, "shippingAddress.address.country", currentAddress.state);
			else
				ess.checkout.updateState(currentAddress.country, "shippingAddress.address.country", currentAddress.stateAlternateText);
			$('shippingAddress.address.postalCode').value = currentAddress.postalCode;
			$('shippingAddress.phone').value = currentAddress.phone;
			
			if(addressBook.preferredBillingAddressId)
				if ($('preferredBilling1')){$('preferredBilling1').checked = addressBook.preferredBillingAddressId == currentAddress.id;}
			if(addressBook.preferredShippingAddressId)
				if ($('preferredShipping1')){$('preferredShipping1').checked = addressBook.preferredShippingAddressId == currentAddress.id;}
		}
	}
	ess.addressBook.addShippingAddressUpdateListener($('addressBookForm'));

	$$('#addressBookForm .error, #addressBookForm .fieldErrorMessages').each(function(v) {
		v.observeShippingAddressUpdate = function(addressBook) {
		  if(!this.hasClassName("hide")) {
			this.addClassName("hide");
		  }
		}
		ess.addressBook.addShippingAddressUpdateListener(v);
	});

	$$('#addressBookForm .fieldError').each(function(v) {
		v.observeShippingAddressUpdate = function(addressBook) {
		  if(this.hasClassName("fieldError")) {
			this.removeClassName("fieldError");
		  }
		}
		ess.addressBook.addShippingAddressUpdateListener(v);
	});


	$$('button').each(function(v) {
		if(v.id!='cancel' && v.id!='address-sugg-enter-diff-top' && v.id!='btn-svcont' && v.id!='btn-svadd' && v.id!='btn-skip' && v.id!='btn-skip-upper'){
			v.observe('click', function(e) {
			  $$('button').each(function(vv) {
				if(vv!=v) {
				  vv.disabled = true;
				}
			  });
			});
		}
	});

	$$('.cancel').each(function(node){
		node.observe('click', function(){
			ess.addressBook.setShippingAddressId(0);
			ess.checkout.addressbook.resetShippingAddress();
			ess.checkout.updateAddressFields("shippingAddress");
		});
	});

	$$('.cancelSuggestions').each(function(node){
		node.observe('click', function(){
			ess.addressBook.setShippingAddressId(0);
			ess.checkout.addressbook.resetShippingAddress();
			ess.checkout.updateAddressFields("shippingAddress");
			$('addressBook').show();
			$('address-main').show();
			$('prefBill').show();
			$('prefShip').show();
			$('address-suggestion-results').hide();
		});
	});

	if($('address-sugg-enter-diff-top')){
		$('address-sugg-enter-diff-top').observe('click', function(e){
			ess.addressBook.setShippingAddressId(0);
			ess.checkout.addressbook.resetShippingAddress();
			ess.checkout.updateAddressFields("shippingAddress");
			$('addressBook').show();
			$('address-main').show();
			$('address-suggestion-results').hide();
			$('address-sugg-enter-diff-top').hide();
		});
	}

	if(ess.selectedShippingCountry == '') {
		$('shippingAddress.address.country').setValue(ess.defaultShippingCountryCode);
//		var c = $('shippingAddress.address.country');
//		for ( var i = 0; i < c.length; i++ ) {
//			if ( c.options[i].value == ess.defaultShippingCountryCode ) {
//				c.options[i].selected = true;
//				return;
//			}
//		}
		ess.checkout.updateState($('shippingAddress.address.country').value, "shippingAddress.address.country");
	}

	/* *** Read JSON on addressContent.jsp to adjust labels for different countries ***** */
	$('shippingAddress.address.country').observe('change', function(){
		ess.checkout.updateAddressFields("shippingAddress");
	});

	/* *** Read JSON on pageload   ****************************************************** */
	ess.checkout.updateAddressFields("shippingAddress");

	if(ess.abJSON.selectedAddressId!='' && ess.abJSON.selectedAddressId!='0'){
	  ess.checkout.addressbook.editMode();
	}

	// addresses saved in address book(session)
	/* TODO : removed because of constraints on how address is displayed
	if($$('.address-book').length > 0) {
		ess.addresses = new AddressBook(ess.abJSON);
		$$(".address-book").each(function(v){
			var addressId = v.id.split("-")[1];
			var address = ess.addresses.getAddress(addressId);
			if(!Object.isUndefined(ess.countries[address.country])){
				var template = $(ess.countries[address.country].template);
			}
			else{
				var template = $(ess.countries["International"].template);
			}
			ess.address.formatAddress(address, template, v);
		});
	}
	*/

	$('btn-skip').observe('click', function(e){
		skip = true;
	});

	$('btn-skip-upper').observe('click', function(e){
		skip = true;
	});

    var addressForm=$('addressBookForm');
    if(addressForm){
    	   addressForm.observe( 'submit', function(e) {
			var requiredShipping = new Array(
				$('shippingAddress.address.firstName'),
				$('shippingAddress.address.lastName'),
				$('shippingAddress.address.address1'),
				$('shippingAddress.address.address2'),//exception
				$('shippingAddress.address.city'),
				$('shippingAddress.address.state'),
				$('shippingAddress.address.postalCode'),
				$('shippingAddress.phone')
				);
			if (!skip){
				if(!checkRequired(requiredShipping))e.stop();
			}
			skip = false;
		});
    }
});
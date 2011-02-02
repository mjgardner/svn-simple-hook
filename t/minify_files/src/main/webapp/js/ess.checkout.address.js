// JavaScript Document
ess.checkout.address={};

document.observe("dom:loaded", function(e){

	$('billingAddress.address.country').observe('change', function(e) {
		ess.checkout.updateState(this.value,this.name);
		ess.checkout.updateAddressFields("billingAddress");
	});

	$('shippingAddress.address.country').observe('change', function(e) {
		ess.checkout.updateState(this.value,this.name);
		ess.checkout.updateAddressFields("shippingAddress");
	});

	ess.addressBook = new AddressBook(ess.abJSON);

	$('addressForm').observeAddressBookUpdate =  function(addressBook){
		  if($('shippingCityName')) {
				Element.replace($('shippingCityName'),new Element('input', {type:'text',name:'shippingAddress.address.city',value:'',id:'shippingAddress.address.city',className:'text'}));
		  }
		  if(ess.addressBook.shippingAddressId!='0' && ess.addressBook.shippingAddressId!='' && !ess.addressBook.multiShipTo && !(ess.addressBook.shippingAddressId==ess.addressBook.billingAddressId)) {
				var shippingAddress = ess.addressBook.getAddress(ess.addressBook.shippingAddressId);
				var billingAddress = ess.addressBook.getAddress(ess.addressBook.billingAddressId);
				$('shippingAddress.address.honorific').value=shippingAddress.honorific;
				$('shippingAddress.address.firstName').value=shippingAddress.firstName;
				$('shippingAddress.address.lastName').value=shippingAddress.lastName;
				$('shippingAddress.address.address1').value=shippingAddress.address1;
				$('shippingAddress.address.address2').value=shippingAddress.address2;
				$('shippingAddress.address.address3').value=shippingAddress.address3;
				$('shippingAddress.address.country').value=shippingAddress.country;
				if(shippingAddress.state != "Other")
					ess.checkout.updateState(shippingAddress.country,'shippingAddress.address.country', shippingAddress.state);
				else
					ess.checkout.updateState(shippingAddress.country,'shippingAddress.address.country', shippingAddress.stateAlternateText);
				$('shippingAddress.address.city').value=shippingAddress.city;
				$('shippingAddress.address.postalCode').value=shippingAddress.postalCode;
				$('shippingAddress.phone').value=shippingAddress.phone;
		  }else {
				$('shippingAddress.address.honorific').value='';
				$('shippingAddress.address.firstName').value='';
				$('shippingAddress.address.lastName').value='';
				$('shippingAddress.address.address1').value='';
				$('shippingAddress.address.address2').value='';
				$('shippingAddress.address.address3').value='';
				$('shippingAddress.address.country').value = ess.defaultShippingCountryCode;
				ess.checkout.updateState($('shippingAddress.address.country').value,'shippingAddress.address.country');
				$('shippingAddress.address.city').value='';
//				$('shippingAddress.address.state').value='';
				$('shippingAddress.address.postalCode').value='';
				$('shippingAddress.phone').value='';
		   }
			ess.checkout.updateAddressFields("shippingAddress");
	}
	ess.addressBook.addUpdateListener($('addressForm'));
	$('addressForm').observeBillingAddressUpdate =  function(addressBook){
		  if($('billingCityName')) {
				Element.replace($('billingCityName'),new Element('input', {type:'text',name:'billingAddress.address.city',value:'',id:'billingAddress.address.city',className:'text'}));
			}
			if(ess.addressBook.billingAddressId!='0') {
				var billingAddress = ess.addressBook.getAddress(ess.addressBook.billingAddressId);
				$('billingAddress.address.honorific').value = billingAddress.honorific;
				$('billingAddress.address.firstName').value = billingAddress.firstName;
				$('billingAddress.address.lastName').value=billingAddress.lastName;
				$('billingAddress.address.address1').value=billingAddress.address1;
				$('billingAddress.address.address2').value=billingAddress.address2;
				$('billingAddress.address.address3').value=billingAddress.address3;
				$('billingAddress.address.country').value=billingAddress.country;
				if(billingAddress.state != "Other")
					ess.checkout.updateState(billingAddress.country,'billingAddress.address.country', billingAddress.state);
				else
					ess.checkout.updateState(billingAddress.country,'billingAddress.address.country', billingAddress.stateAlternateText);
				$('billingAddress.address.city').value=billingAddress.city;
				$('billingAddress.address.postalCode').value=billingAddress.postalCode;
				$('billingAddress.phone').value=billingAddress.phone;
				if($('billingAddress.emailAddress')) {
					$('billingAddress.emailAddress').value=ess.abJSON.emailAddress;
				}
			} else {
				$('billingAddress.address.honorific').value = '';
				$('billingAddress.address.firstName').value = '';
				$('billingAddress.address.lastName').value='';
				$('billingAddress.address.address1').value='';
				$('billingAddress.address.address2').value='';
				$('billingAddress.address.address3').value='';
				$('billingAddress.address.country').value=ess.defaultBillingCountryCode;
				ess.checkout.updateState($('billingAddress.address.country').value ,'billingAddress.address.country');
				$('billingAddress.address.city').value='';
//				$('billingAddress.address.state').value='';
				$('billingAddress.address.postalCode').value='';
				$('billingAddress.phone').value='';
				if($('billingAddress.emailAddress')) {
					$('billingAddress.emailAddress').value='';
				}
			}
			ess.checkout.updateAddressFields("billingAddress");
	}

	ess.addressBook.addBillingAddressUpdateListener($('addressForm'));

	ess.checkout.address.shipToIns = new defaultAnimation($('shipTo'));
	ess.checkout.address.shipToIns.observeAddressBookUpdate = function(addressBook) {
		if(ess.addressBook.shippingAddressId != ess.addressBook.billingAddressId && !ess.addressBook.multiShipTo) {
			// ess.checkout.address.shipToIns.animate(pars);
			// ess.checkout.address.shipToIns.toggle();
			// ess.checkout.address.shipToIns.run({time:250, display:'block'});
			this.show();
		} else {
			// ess.checkout.address.shipToIns.animate(initPars);
			// ess.checkout.address.shipToIns.toggle();
			// ess.checkout.address.shipToIns.run({time:250, display:'none'});
			this.hide();
		}
	}
	ess.addressBook.addUpdateListener(ess.checkout.address.shipToIns);


	ess.checkout.address.bindClose = function(){
		$('close-checkgiftcbalance').observe('click', function(){
			Df.Lightbox.hide();
		});

		$('emailAddress').observe('keypress', function(event){
			 if (event.keyCode == Event.KEY_RETURN){
			 	event.stop();
             	ess.checkout.address.checkPassword();
             }
		});
	}

	ess.checkout.address.clearBillingForm = function(){
		$('billingAddress.address.country').value = ess.defaultBillingCountryCode;
		ess.checkout.updateState($('billingAddress.address.country').value , 'billingAddress.address.country');
		$('billingAddress.address.honorific').value = '';
		$('billingAddress.address.firstName').value = '';
		$('billingAddress.address.lastName').value='';
		$('billingAddress.address.address1').value='';
		$('billingAddress.address.address2').value='';
		$('billingAddress.address.address3').value='';
		$('billingAddress.address.city').value='';
		$('billingAddress.address.postalCode').value='';
		$('billingAddress.phone').value='';
		if($('billingAddress.emailAddress')) {
			$('billingAddress.emailAddress').value='';
		}
		ess.checkout.updateAddressFields("billingAddress");
	}

	ess.checkout.address.checkPassword = function() {
		$('forgotPasswordCommand').request({
			onSuccess: function(transport){
				Df.Lightbox.getDialogContent().update(transport.responseText);
				ess.checkout.address.bindClose();
			},
			onFailure: function(transport,e) {
				Df.Lightbox.getDialogContent().update('<a id="close-checkgiftcbalance" href="javascript:void(0);">x</a><p class="error">Problem communicating with the server.</p>');
				ess.checkout.address.bindClose();
			}
		});
	}


	if($('shipOption1')) {
		$('shipOption1').observe('click',function(e) {
			ess.addressBook.setMultiShipTo(false);
			ess.addressBook.setShippingAddressId(ess.addressBook.billingAddressId);
		});

		$('shipOption1').observeAddressBookUpdate = function(addressBook) {
			if(!addressBook.multiShipTo && addressBook.shippingAddressId == addressBook.billingAddressId && addressBook.addresses.length>0) {
				this.checked = true;
			}
		}
		ess.addressBook.addUpdateListener($('shipOption1'));
	}
	if($('shipOption2')) {
		$('shipOption2').observeAddressBookUpdate = function(addressBook) {
			if(!addressBook.multiShipTo && addressBook.shippingAddressId!=addressBook.billingAddressId) {
				this.checked = true;
			}
		}
		ess.addressBook.addUpdateListener($('shipOption2'));

		$('shipOption2').observe('click',function(e) {
			ess.addressBook.setMultiShipTo(false);
			ess.addressBook.setShippingAddressId('');
			//set it to empty to distinguish between this and the two addresses being the same the
			//first time the user visits, when they are both 0.
		});
	}
	if($('shipOption3')) {
		$('shipOption3').observe('click',function(e) {
			ess.addressBook.setMultiShipTo (true);
			ess.addressBook.setShippingAddressId('');
		});
	}


	$$("input[name=useAsBillingAddress]").each(function(v){
		v.observeAddressBookUpdate = function (addressBook) {
			if(this.value!=addressBook.billingAddressId) {
				this.checked = false;
			}
		}
		ess.addressBook.addUpdateListener(v);
		v.observe("click",function(e) {
			if(this.checked) {
				ess.addressBook.setBillingAddressId(this.value);
			} else {
				ess.addressBook.setBillingAddressId('0');
			}
		});
	});
	$$("input[name=useAsShippingAddress]").each(function(v){
		v.observeAddressBookUpdate = function(addressBook) {
			if(this.value!=addressBook.shippingAddressId) {
				this.checked = false;
			} else {
				this.checked = true;
			}
		}
		ess.addressBook.addUpdateListener(v);
		v.observe("click",function(e) {
			if(this.checked) {
				ess.addressBook.setMultiShipTo(false);
				ess.addressBook.setShippingAddressId(this.value);
			} else {
				ess.addressBook.setShippingAddressId('');
			}

		});
	});

	if($("billingAddress.address.id")) {
		$("billingAddress.address.id").observeAddressBookUpdate = function(addressBook) {
			this.value = addressBook.billingAddressId;
		}
		ess.addressBook.addUpdateListener($("billingAddress.address.id"));
	}
	if($("shippingAddress.address.id")) {
		$("shippingAddress.address.id").observeAddressBookUpdate = function(addressBook) {
			if(ess.addressBook.shippingAddressId=='') {
				this.value = '0';
			} else {
				this.value = addressBook.shippingAddressId;
			}
		}
		ess.addressBook.addUpdateListener($("shippingAddress.address.id"));
	}



	$$('#billTo .error, #billTo .fieldErrorMessages').each(function(v) {
		v.observeBillingAddressUpdate = function(addressBook) {
			if(!this.hasClassName("hide")) {
				this.addClassName("hide");
			}
		}
		ess.addressBook.addBillingAddressUpdateListener(v);
	});

	$$('#billTo .fieldError').each(function(v) {
		v.observeBillingAddressUpdate = function(addressBook) {
			if(this.hasClassName("fieldError")) {
				this.removeClassName("fieldError");
			}
		}
		ess.addressBook.addBillingAddressUpdateListener(v);
	});

	$$('#shipTo .error, #shipTo .fieldErrorMessages').each(function(v) {
		v.observeShippingAddressUpdate = function(addressBook) {
			if(!this.hasClassName("hide")) {
				this.addClassName("hide");
			}
		}
		ess.addressBook.addShippingAddressUpdateListener(v);
	});

	$$('#shipTo .fieldError').each(function(v) {
		v.observeShippingAddressUpdate = function(addressBook) {
			if(this.hasClassName("fieldError")) {
				this.removeClassName("fieldError");
			}
		}
		ess.addressBook.addShippingAddressUpdateListener(v);
	});


	if(ess.selectedBillingCountry == '') {
		$('billingAddress.address.country').setValue(ess.defaultBillingCountryCode);
		 ess.checkout.updateState($('billingAddress.address.country').value, 'billingAddress.address.country');
	}
	if(ess.selectedShippingCountry == '') {
		$('shippingAddress.address.country').setValue(ess.defaultShippingCountryCode);
		ess.checkout.updateState($('shippingAddress.address.country').value, 'shippingAddress.address.country');
	}

	if($('newAddressTop')) {
		$('newAddressTop').observe('click',function(e) {
		    ess.addressBook.setMultiShipTo(false);
		    ess.addressBook.setMultiShipTo(false);
		    ess.addressBook.setShippingAddressId(ess.addressBook.billingAddressId);
		    $('shipOption1').checked = true;

		    var checkboxes = $('addresses').select('[type="checkbox"]');
		        checkboxes.each(function(v, index){
			v.checked = false;
		    });
		    ess.checkout.address.clearBillingForm();
		});
	}

	if($('newAddressBtm')) {
		$('newAddressBtm').observe('click',function(e) {
		    ess.addressBook.setMultiShipTo(false);
		    ess.addressBook.setMultiShipTo(false);
		    ess.addressBook.setShippingAddressId(ess.addressBook.billingAddressId);
		    $('shipOption1').checked = true;

		    var checkboxes = $('addresses').select('[type="checkbox"]');
		    checkboxes.each(function(v){
			v.checked = false;
		    });
		    ess.checkout.address.clearBillingForm();
		});
	}

	// Read JSON on pageload
	ess.checkout.updateAddressFields("billingAddress");
	ess.checkout.updateAddressFields("shippingAddress");
	/* *** Read JSON on addressContent.jsp to adjust labels for different countries ***** */


	/** No need for any of this anymore
	//reset the height when validation occurs
	if($$('#shipTo .fieldErrorMessages')[0]){
		var countFieldError = 0;
		var getHeightFieldError = 0;
		$$('#shipTo .fieldErrorMessages').each(function(v,index) {
			if(countFieldError == 0){
				getHeightFieldError = v.offsetHeight;
			}
			countFieldError++;
		});
		var totalFieldError = getHeightFieldError * countFieldError;
		var totalFormHeight = ess.addressBook.resetFromHeight(1);
		var total = totalFieldError + totalFormHeight;
		$('shipTo').setStyle({height: total+'px'});
		initPars = {height:total+'px', time:250};
	}

	*/

	removeDialogs = function(){
		$$('div.'+Df.Lightbox.pars.dialog.className).each(function(ele){
			ele.remove();
		});

		$$('div.'+Df.Lightbox.pars.modal.className).each(function(ele){
			ele.remove();
		});

		Df.Lightbox._modal = false;
		Df.Lightbox._dialog = false;

		return true;
	}

	if($('forgot-password')) {
		var customContent = $('forgot-password').innerHTML;
		var customTitle = $('forgotPasswordCommand').down(1).innerHTML
		$('forget-password-link').observe('click',function(e) {
			if (Df.Lightbox._modal){
				removeDialogs();
			}
			Df.Lightbox.pars.dialog.className = 'df_modal_dialog';
			Df.Lightbox.pars.dialog.animate = {opacity:1};
			Df.Lightbox.pars.dialog.title = customTitle;
			Df.Lightbox.getModal().element.setStyle({backgroundColor: '#374114'});
			Df.Lightbox.getDialog().element.setStyle({opacity:0});
			Df.Lightbox.getDialogContent().update(customContent);
			Df.Lightbox.show();
			ess.checkout.address.bindClose();
		});
	}

	// addresses saved in address book(session)
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

});//dom loaded
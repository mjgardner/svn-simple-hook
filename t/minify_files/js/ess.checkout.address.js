//JavaScript Document
ess.checkout = ess.checkout || {};
ess.checkout.address = ess.checkout.address || {};

Event.observe(window,'load',function(e) {
	var billingAddressCountry = $('billingAddress.address.country');
	var shippingAddressCountry = $('shippingAddress.address.country');

	if ( billingAddressCountry ) {
		billingAddressCountry.observe('keyup', function(e) {
			ess.checkout.updateState(this.getValue(),this.name, false);
			ess.checkout.updateAddressFields("billingAddress");
		} );
		billingAddressCountry.observe('change',function(e){
			ess.checkout.updateState(this.getValue(),this.name, false);
			ess.checkout.updateAddressFields("billingAddress");
		});
	}
	
	if ( shippingAddressCountry ) {
		shippingAddressCountry.observe('keyup',function(e){
			ess.checkout.updateState(this.getValue(),this.name);
			ess.checkout.updateAddressFields("shippingAddress");
		});
		shippingAddressCountry.observe('change',function(e){
			ess.checkout.updateState(this.getValue(),this.name);
			ess.checkout.updateAddressFields("shippingAddress");
		});
	}

	ess.addressBook=new AddressBook(ess.abJSON);
	
	$('addressForm').observeAddressBookUpdate = function( addressBook ) {
		if ( $('shippingCityName') ) {
			Element.replace( $('shippingCityName'), new Element ( 'input', { type:'text', name:'shippingAddress.address.city', value:'', id:'shippingAddress.address.city', className:'text' } ) );
		}
		if ( ess.addressBook.shippingAddressId != '0' && ess.addressBook.shippingAddressId != '' && !ess.addressBook.multiShipTo && !( ess.addressBook.shippingAddressId == ess.addressBook.billingAddressId ) ) {
			var shippingAddress=ess.addressBook.getAddress(ess.addressBook.shippingAddressId);
			var billingAddress=ess.addressBook.getAddress(ess.addressBook.billingAddressId);
			if ( $('shippingAddress.address.honorific') ) { $('shippingAddress.address.honorific').value = shippingAddress.honorific; }
			$('shippingAddress.address.firstName').value = shippingAddress.firstName;
			$('shippingAddress.address.lastName').value = shippingAddress.lastName;
			$('shippingAddress.address.address1').value = shippingAddress.address1;
			$('shippingAddress.address.address2').value = shippingAddress.address2;
			if ( $('shippingAddress.address.address3') ) { $('shippingAddress.address.address3').value = shippingAddress.address3; }
			$('shippingAddress.address.country').value = shippingAddress.country;
			if ( shippingAddress.state != "Other" )
				ess.checkout.updateState( shippingAddress.country, 'shippingAddress.address.country', shippingAddress.state );
			else
				ess.checkout.updateState( shippingAddress.country, 'shippingAddress.address.country', shippingAddress.stateAlternateText );
			$('shippingAddress.address.city').value = shippingAddress.city;
			$('shippingAddress.address.postalCode').value = shippingAddress.postalCode;
			$('shippingAddress.phone').value = shippingAddress.phone;
		}
		else{
			if ( $('shippingAddress.address.honorific') ) { $('shippingAddress.address.honorific').value = ''; }
			$('shippingAddress.address.firstName').value = '';
			$('shippingAddress.address.lastName').value = '';
			$('shippingAddress.address.address1').value = '';
			$('shippingAddress.address.address2').value = '';
			if ( $('shippingAddress.address.address3') ) { $('shippingAddress.address.address3').value = ''; }
			$('shippingAddress.address.country').value = ess.defaultShippingCountryCode;
			ess.checkout.updateState( $('shippingAddress.address.country').value, 'shippingAddress.address.country' );
			$('shippingAddress.address.city').value = '';
			$('shippingAddress.address.state').value = '';
			$('shippingAddress.address.postalCode').value = '';
			$('shippingAddress.phone').value = '';
		}
		ess.checkout.updateAddressFields("shippingAddress");
	}
	
	ess.addressBook.addUpdateListener($('addressForm'));
	$('addressForm').observeBillingAddressUpdate= function(addressBook){
		  if($('billingCityName')){
				Element.replace($('billingCityName'),new Element('input',{type:'text',name:'billingAddress.address.city',value:'',id:'billingAddress.address.city',className:'text'}));
			}
			if(ess.addressBook.billingAddressId!='0'){
				var billingAddress=ess.addressBook.getAddress(ess.addressBook.billingAddressId);
				if ( $('billingAddress.address.honorific') ) { $('billingAddress.address.honorific').value=billingAddress.honorific; }
				$('billingAddress.address.firstName').value=billingAddress.firstName;
				$('billingAddress.address.lastName').value=billingAddress.lastName;
				$('billingAddress.address.address1').value=billingAddress.address1;
				$('billingAddress.address.address2').value=billingAddress.address2;
				if ( $('billingAddress.address.address3') ) { $('billingAddress.address.address3').value=billingAddress.address3; }
				$('billingAddress.address.country').value=billingAddress.country;
				if(billingAddress.state != "Other")
					ess.checkout.updateState(billingAddress.country,'billingAddress.address.country',billingAddress.state);
				else
					ess.checkout.updateState(billingAddress.country,'billingAddress.address.country',billingAddress.stateAlternateText);
				$('billingAddress.address.city').value=billingAddress.city;
				$('billingAddress.address.postalCode').value=billingAddress.postalCode;
				$('billingAddress.phone').value=billingAddress.phone;
				if($('billingAddress.emailAddress')){
					$('billingAddress.emailAddress').value=ess.abJSON.emailAddress;
				}
			} else{
				if ( $('billingAddress.address.honorific') ) { $('billingAddress.address.honorific').value=''; }
				$('billingAddress.address.firstName').value='';
				$('billingAddress.address.lastName').value='';
				$('billingAddress.address.address1').value='';
				$('billingAddress.address.address2').value='';
				if ( $('billingAddress.address.address3') ) { $('billingAddress.address.address3').value=''; }
				$('billingAddress.address.country').value=ess.defaultBillingCountryCode;
				ess.checkout.updateState($('billingAddress.address.country').value ,'billingAddress.address.country');
				$('billingAddress.address.city').value='';
				$('billingAddress.address.state').value='';
				$('billingAddress.address.postalCode').value='';
				$('billingAddress.phone').value='';
				if($('billingAddress.emailAddress')){
					$('billingAddress.emailAddress').value='';
				}
			}
			ess.checkout.updateAddressFields("billingAddress");
	}

	ess.addressBook.addBillingAddressUpdateListener($('addressForm'));

	ess.checkout.address.shipToIns=new defaultAnimation($('shipping-address-content'));
	ess.checkout.address.shipToIns.observeAddressBookUpdate=function(addressBook){
		if(ess.addressBook.shippingAddressId != ess.addressBook.billingAddressId && !ess.addressBook.multiShipTo)
			this.show();
		else
			this.hide();
	}
	ess.addressBook.addUpdateListener(ess.checkout.address.shipToIns);

	ess.checkout.address.clearBillingForm=function(){
		$('billingAddress.address.country').value=ess.defaultBillingCountryCode;
		ess.checkout.updateState($('billingAddress.address.country').value ,'billingAddress.address.country');
		if( $('billingAddress.address.honorific') ) { $('billingAddress.address.honorific').value=''; }
		$('billingAddress.address.firstName').value='';
		$('billingAddress.address.lastName').value='';
		$('billingAddress.address.address1').value='';
		$('billingAddress.address.address2').value='';
		if( $('billingAddress.address.address3') ) { $('billingAddress.address.address3').value=''; }
		$('billingAddress.address.city').value='';
		$('billingAddress.address.postalCode').value='';
		$('billingAddress.phone').value='';
		if($('billingAddress.emailAddress')){
			$('billingAddress.emailAddress').value='';
		}
		ess.checkout.updateAddressFields("billingAddress");
	}

	ess.checkout.address.checkPassword=function(){
		$('forgotPasswordCommand').request({
			onSuccess: function(transport){
				Df.Lightbox.getDialogContent().update(transport.responseText);
				ess.checkout.address.bindClose();
			},
			onFailure: function(transport,e){
				Df.Lightbox.getDialogContent().update('<a id="close-checkgiftcbalance" class="close" href="javascript:void(0);"><fmt:message key="label.shopMsgs.closeWindow" /></a><p class="error">Problem communicating with the server.</p>');
				ess.checkout.address.bindClose();
			}
		});
	}

	if($('shipOption1')){
		$('shipOption1').observe('click',function(e){
			ess.addressBook.setMultiShipTo(false);
			ess.addressBook.setShippingAddressId(ess.addressBook.billingAddressId);
		});

		$('shipOption1').observeAddressBookUpdate=function(addressBook){
			if(!addressBook.multiShipTo && addressBook.shippingAddressId == addressBook.billingAddressId && addressBook.addresses.length>0){
				this.checked=true;
			}
		}
		if (ess.selectedBillingCountry == '' && ess.selectedShippingCountry == '') {
			$('shipOption1').checked = true;
			ess.addressBook.setMultiShipTo(false);
			ess.addressBook.setShippingAddressId(ess.addressBook.billingAddressId);
		}
		ess.addressBook.addUpdateListener($('shipOption1'));
	}
	if($('shipOption2')){
		$('shipOption2').observeAddressBookUpdate=function(addressBook){
			if(!addressBook.multiShipTo && addressBook.shippingAddressId!=addressBook.billingAddressId){
				this.checked=true;
			}
		}
		ess.addressBook.addUpdateListener($('shipOption2'));

		$('shipOption2').observe('click',function(e){
			ess.addressBook.setMultiShipTo(false);
			ess.addressBook.setShippingAddressId('');
			//set it to empty to distinguish between this and the two addresses being the same the
			//first time the user visits,when they are both 0.
		});
	}
	if($('shipOption3')){
		$('shipOption3').observe('click',function(e){
			ess.addressBook.setMultiShipTo (true);
			ess.addressBook.setShippingAddressId('');
		});
	}

	$$("input[name=useAsBillingAddress]").each(function(v){
		v.observeAddressBookUpdate=function (addressBook){
			if(this.value!=addressBook.billingAddressId){
				this.checked=false;
			}
		}
		ess.addressBook.addUpdateListener(v);
		v.observe("click",function(e){
			if(this.checked){
				ess.addressBook.setBillingAddressId(this.value);
			} else{
				ess.addressBook.setBillingAddressId('0');
			}
		});
	});
	$$("input[name=useAsShippingAddress]").each(function(v){
		v.observeAddressBookUpdate=function(addressBook){
			if(this.value!=addressBook.shippingAddressId){
				this.checked=false;
			} else{
				this.checked=true;
			}
		}
		ess.addressBook.addUpdateListener(v);
		v.observe("click",function(e){
			if(this.checked){
				ess.addressBook.setMultiShipTo(false);
				ess.addressBook.setShippingAddressId(this.value);
			} else{
				ess.addressBook.setShippingAddressId('');
			}

		});
	});

	if($("billingAddress.address.id")){
		$("billingAddress.address.id").observeAddressBookUpdate=function(addressBook){
			this.value=addressBook.billingAddressId;
		}
		ess.addressBook.addUpdateListener($("billingAddress.address.id"));
	}
	if($("shippingAddress.address.id")){
		$("shippingAddress.address.id").observeAddressBookUpdate=function(addressBook){
			if(ess.addressBook.shippingAddressId==''){
				this.value='0';
			} else{
				this.value=addressBook.shippingAddressId;
			}
		}
		ess.addressBook.addUpdateListener($("shippingAddress.address.id"));
	}



	$$('#billTo .error,#billTo .fieldErrorMessages').each(function(v){
		v.observeBillingAddressUpdate=function(addressBook){
			if(!this.hasClassName("hide")){
				this.addClassName("hide");
			}
		}
		ess.addressBook.addBillingAddressUpdateListener(v);
	});

	$$('#billTo .fieldError').each(function(v){
		v.observeBillingAddressUpdate=function(addressBook){
			if(this.hasClassName("fieldError")){
				this.removeClassName("fieldError");
			}
		}
		ess.addressBook.addBillingAddressUpdateListener(v);
	});

	$$('#shipTo .error,#shipTo .fieldErrorMessages').each(function(v){
		v.observeShippingAddressUpdate=function(addressBook){
			if(!this.hasClassName("hide")){
				this.addClassName("hide");
			}
		}
		ess.addressBook.addShippingAddressUpdateListener(v);
	});

	$$('#shipTo .fieldError').each(function(v){
		v.observeShippingAddressUpdate=function(addressBook){
			if(this.hasClassName("fieldError")){
				this.removeClassName("fieldError");
			}
		}
		ess.addressBook.addShippingAddressUpdateListener(v);
	});


	if(ess.selectedBillingCountry == ''){
		$('billingAddress.address.country').setValue(ess.defaultBillingCountryCode);
		var country=$('billingAddress.address.country').getValue();
		ess.checkout.updateState(country,'billingAddress.address.country');
	}
	if(ess.selectedShippingCountry == ''){
		$('shippingAddress.address.country').setValue(ess.defaultShippingCountryCode);
		var country=$('shippingAddress.address.country').getValue();
		ess.checkout.updateState(country,'shippingAddress.address.country');
	}
	if($('newAddressTop')){
		$('newAddressTop').observe('click',function(e){
		    ess.addressBook.setMultiShipTo(false);
		    ess.addressBook.setShippingAddressId(ess.addressBook.billingAddressId);
		    $('shipOption1').checked=true;

		    var checkboxes=$('addresses').select('[type="checkbox"]');
		        checkboxes.each(function(v,index){
			v.checked=false;
		    });
		    ess.checkout.address.clearBillingForm();
		});
	}

	if($('newAddressBtm')){
		$('newAddressBtm').observe('click',function(e){
		    ess.addressBook.setMultiShipTo(false);
		    //ess.addressBook.setShippingAddressId(ess.addressBook.billingAddressId);
		    $('shipOption2').checked=true;
			ess.addressBook.setShippingAddressId('');

		    var checkboxes=$('addresses').select('[type="checkbox"]');
		    checkboxes.each(function(v){
				v.checked=false;
		    });
		    //ess.checkout.address.clearBillingForm();
		});
	}
	
	//Read JSON on pageload
	ess.checkout.updateAddressFields("billingAddress");
	ess.checkout.updateAddressFields("shippingAddress");
	
	var forgotPassword=$('forgot-password');
	if(forgotPassword){
		Event.observe(forgotPassword, 'click', function(e){
			modal.open({url:'/forgotpassword.jsp',width:'348px', height:'219px', closeButton: 'yes'});
		});
	}

	// addresses saved in address book(session)
	if($$('.address-book').length > 0){
		ess.addresses=new AddressBook(ess.abJSON);
		$$(".address-book").each(function(v){
			var addressId=v.id.split("-")[1];
			var address=ess.addresses.getAddress(addressId);
			if(!Object.isUndefined(ess.countries[address.country])){
				var template=$(ess.countries[address.country].template);
			}
			else{
				var template=$(ess.countries["International"].template);
			}
			ess.address.formatAddress(address,template,v);
		});
	}
	// Send Me Email Updates for unlogged users automatically checked:
	//if($('sendEmailUpdates1')){$('sendEmailUpdates1').checked=true;}
});//window loaded

document.observe('dom:loaded', function(e){
	//Validate Required Fields with Special Attention to Zip Code Field for both Shipping and Billing fieldsets
	//Make sure this is the Addresses page of Checkout
	if ( $('addressForm') ) {
		$('addressForm').observe( 'submit', function(e) {
			var requiredBilling = new Array(
				$('billingAddress.address.country'),
				$('billingAddress.address.firstName'),
				$('billingAddress.address.lastName'),
				$('billingAddress.address.address1'),
				$('billingAddress.address.address2'),//exception
				$('billingAddress.address.city'),
				$('billingAddress.address.state'),
				$('billingAddress.address.postalCode'),
				$('billingAddress.phone')
				);
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
			if ( $('billingAddress.emailAddress') ) requiredBilling.push( $('billingAddress.emailAddress') );
			//Make sure the Billing Address form is present
			if ( ( $('shipOption2').checked == true ) && checkRequired( requiredBilling ) && checkRequired( requiredShipping ) ) {
			}
			else if ( ( $('shipOption2').checked != true ) && checkRequired( requiredBilling ) ) {
			}
			else {
				e.stop();
			}
		});
	};
});
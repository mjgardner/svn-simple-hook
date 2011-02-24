// JavaScript Document
ess.checkout.receipt = {}
ess.checkout.receipt.registerUser = function() {
	var email = $('accountEmail').innerHTML;
	if($$('#registerUserInner .error').length>0) {
		$$('#registerUserInner .error')[0].hide();
	}
	$('registerUser').request({
 		onSuccess: function(transport){
			$('registerUser').replace(transport.responseText);
			$('accountEmail').update(email);
			if ($$('#registerUserInner .error').length==0) {
				$(document).fire("am:account-creation-complete");
			}
		},
		onFailure: function(transport,e) {
			if($$('#registerUserInner .error').length==0) {
				$('registerUserInner').insert({'top':'<div class="error"><ul><li>Problem communicating with the server.</li></ul></div>'});
			} else {
				$$('#registerUserInner .error')[0].update('<ul><li>Problem communicating with the server.</li></ul>');
			}
			if($$('#registerUserInner .error').length>0) {
				$$('#registerUserInner .error')[0].show();
			}

		}
	});
}
document.observe("dom:loaded", function(e){
	// addresses saved in address book(session)
	if($$('.address-book').length > 0) {
		ess.addressBook = new Address(ess.abJSON);
		$$(".address-book").each(function(v){
			var addressId = v.id.split("-")[1];
			var address = ess.addressBook.getAddress(addressId);
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

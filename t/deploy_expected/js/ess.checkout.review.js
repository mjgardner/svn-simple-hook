// JavaScript Document
document.observe("dom:loaded", function(e){
	Element.observe($('reviewForm'),"submit",function(){fortyone.collect('userPrefs');return true;});
	$$('.shipOpt').each(function(v){
		v.observe('change', function(e) {
			$('reviewForm').insert(new Element('input', {type:'hidden',name:'_eventId_shippingOptionSelected',value:'1'}));

		//disable buttons so IE6 doesn't submit them
			$$('button').each(function(v) {
					v.disabled = true;
			});
			$('reviewForm').submit();
		});
 	});

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

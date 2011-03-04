// JavaScript Document
ess.checkout.shipping={};
document.observe("dom:loaded", function(e){
	$$('.shipOpt').each(function(v){
		v.observe('click', function(e) {
			$('shippingForm').insert(new Element('input', {type:'hidden',name:'_eventId_shippingOptionSelected',value:'1'}));
			//disable buttons so IE6 doesn't submit them
			$$('button').each(function(v) {
				v.disabled = true;
			});
			$('shippingForm').submit();
		});
 	});

 	if($$('.shipInstruction')){
 		$$('.shipInstruction').each(function(v){
 			v.observe('keypress', function(e) {
 				ess.checkout.shipping.instructionLimit(e, 59);
 			});
 		});
 	}

 	ess.checkout.shipping.instructionLimit = function(field, maxlimit){
		if ( field.target.value.length > maxlimit ){
		    if(field.keyCode == 37 || field.keyCode == 38 || field.keyCode == 39 || field.keyCode == 40 || field.keyCode == 13){
		    	return false;
		    }
		    field.target.value = (field.target.value).substring(0, maxlimit);
		    return false;
		}
	}
});
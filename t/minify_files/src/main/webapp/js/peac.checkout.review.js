// JavaScript Document
document.observe("dom:loaded", function(e){
	Element.observe($('reviewForm'),"submit",function(){fortyone.collect('userPrefs');
return true;});
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
});




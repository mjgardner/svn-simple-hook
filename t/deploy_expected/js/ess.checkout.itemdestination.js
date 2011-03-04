// JavaScript Document

document.observe("dom:loaded", function(e) {
    $$('add').observe("click", function(e) {
		ess.checkout.doLink('addNewAddress');
	});
});

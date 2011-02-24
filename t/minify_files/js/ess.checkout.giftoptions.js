// JavaScript Document
document.observe("dom:loaded", function(e){
	$$("input[name=selectGift],#packSlipMessages input[type=checkbox]").each(function(v) {
		v.animateObj = new defaultAnimation(v.up().next());
		if(v.checked) {
			v.animateObj.show();
		} else {
			v.animateObj.hide();
		}
		v.observe('click', function(e) {
			if(this.checked) {
				this.animateObj.show();
			} else {
				this.animateObj.hide();
			}
		}.bind(v));
	});
});


document.observe("dom:loaded",function(e){

	$$("button[name=_eventId_continue]")[0].observe("click",function(){

		/* Default or Multiple */
		if($$('.giftMessaging .giftwrap-select select', '.giftMessaging .giftwrap-select input')) {
			$$('.giftMessaging .giftwrap-select select', '.giftMessaging .giftwrap-select input').each(function(node){
				var addrId = node.id.split("-")[1];
				var itemId = node.id.split("-")[2];
				if($("selectGift-"+addrId+"-"+itemId).checked == false){
					var newGiftOptions = new Element('input', {'type':'hidden', id:node.id, name:node.name, value: '0'});
					node.replace(newGiftOptions);
				}
			});
		}

		$$('.giftMessaging .giftwrap-to input').each(function(node){
			var addrId = node.id.split("-")[1];
			var itemId = node.id.split("-")[2];
			if($("selectGift-"+addrId+"-"+itemId).checked == false)
				node.value = '';
		});
		$$('.giftMessaging .giftwrap-from input').each(function(node){
			var addrId = node.id.split("-")[1];
			var itemId = node.id.split("-")[2];
			if($("selectGift-"+addrId+"-"+itemId).checked == false)
				node.value = '';
		});
		$$('.giftMessaging .giftwrap-msgarea textarea').each(function(node){
			var addrId = node.id.split("-")[1];
			var itemId = node.id.split("-")[2];
			if($("selectGift-"+addrId+"-"+itemId).checked == false)
				node.value = '';
		});

		if($$('.packslip-option')){
			$$('.packslip-option').each(function(node){
				var checkboxId = node.id.split("-")[1];
				if(node.checked == false){
					$("packSlipMessages"+checkboxId+".giftMessage.to").value = '';
					$("packSlipMessages"+checkboxId+".giftMessage.from").value = '';
					$("packSlipMessages"+checkboxId+".giftMessage.text").value = '';
				}
			});
		}

	});

});
// JavaScript Document
/* Please Comment extensively - Comments are automatically stripped out by the ant-min-cat implementation */
ess.checkout = ess.checkout || {};
ess.checkout.payment = ess.checkout.payment || {};
ess.checkout.payment.deleteCard = function(cardId) {
	$('linkForm').insert(new Element('input', {type:'hidden',name:'deleteCreditCardId',value:cardId}));
	ess.checkout.doLink("removecard");
}
ess.checkout.doLink = function(eventId) {
	$('linkForm_eventId').value = eventId;
	$('linkForm').submit();
}
ess.checkout.payment.showCreditCard = function() {
    /* alert('----- ess.checkout.payment.showCreditCard -----' + '\n' + '$(\'bill-me-later-plans\') = ' + $('bill-me-later-plans') + '\n' + '$(\'cc-form\') = ' + $('cc-form')); */
    if ($('bill-me-later-plans')) $('bill-me-later-plans').hide();
    if ($('cc-form')) $('cc-form').show();
}
ess.checkout.payment.showBillMeLater = function() {
    /* alert('----- ess.checkout.payment.showHideBillMeLater -----' + '\n' + '$(\'cc-form\') = ' + $('cc-form') + '\n' + '$(\'bill-me-later-plans\') = ' + $('bill-me-later-plans')); */
    if ($('cc-form')) $('cc-form').hide();
    if ($('bill-me-later-plans')) $('bill-me-later-plans').show();
}
ess.checkout.payment.showPayPal = function() {
    /* alert('----- ess.checkout.payment.showPayPal -----' + '\n' + '$(\'bill-me-later-plans\') = ' + $('bill-me-later-plans') + '\n' + '$(\'cc-form\') = ' + $('cc-form')); */
    if ($('bill-me-later-plans')) $('bill-me-later-plans').hide();
    if ($('cc-form')) $('cc-form').hide();
}
ess.checkout.payment.BoxCollection = function (element) {
    this.element = $(element);
    this.boxs = [];
    $A(this.element.childElements()).each(function(v,i){
        this.boxs.push(new ess.checkout.payment.Box(v));
        v.down('input').observe('click', this.open.bind(this,i));
    }.bind(this));
    return this;
}
ess.checkout.payment.BoxCollection.prototype.open = function (index) {
    for (var i=0; i < this.boxs.length; i++) {
        if (i == index ) {
            this.boxs[i].open();
        } else {
            this.boxs[i].close();
        }
    }
    return this;
}
ess.checkout.payment.Box = function (element, collection) {
    this.element = $(element);
    this.desc = this.element.down('dd');
    this.body = this.desc.next();
    this.maxHeight = parseInt(this.element.down('dl').offsetHeight);
    return this;
}
ess.checkout.payment.Box.prototype.open = function () {
    this.desc.style.display = 'none';
    this.element.animate({height: this.maxHeight});
		var opacityTarget = .99;
		if(ess.checkout.isIE) {
			opacityTarget = 1;
		}
		if(!ess.checkout.isIE) {
			this.body.animate({opacity: opacityTarget});
		} else {
			this.body.style.opacity=1;
		}
    return this;
}
ess.checkout.payment.Box.prototype.close = function () {
    this.desc.style.display = 'block';
    this.element.animate({height: 40});
		if(!ess.checkout.isIE) {
	    this.body.animate({opacity: 1});
		}
    return this;
}
//this is really a global Df.lightbox function
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

//Selects and highlights the Credit Card Icons and the Dropdowns when either is changed
ess.checkout.payment.doubleCCselect = function(theSelected) {
	var theDropDown = $('creditCardPaymentMethod.cardType').getValue();
	$$('.cc-icon').each(function(ele){ele.removeClassName('cc-icon-highlight');ele.addClassName('cc-icon-dim');});
	$(theSelected).removeClassName('cc-icon-dim').addClassName('cc-icon-highlight');
	$('selected-cccode-transfer').getValue(theSelected);
//	$('creditCardPaymentMethod.cardType').hide();
	$('creditCardPaymentMethod.cardType').setValue(theSelected);
}//end MultiSelect

document.observe("dom:loaded", function(e){
	if($('promoCode')) {
		$('promoCode').button = $('promoApply');
		$('promoApply').field = $('promoCode');
		$('promoApply').toggle = function(){
			if(this.field.value.length>0) {
				if(this.hasClassName('inactive')) {
					this.removeClassName('inactive');
				}
				if(!this.hasClassName('active')) {
					this.addClassName('active');
				}
			}else {
				if(this.hasClassName('active')) {
					this.removeClassName('active');
				}
				if(!this.hasClassName('inactive')) {
					this.addClassName('inactive');
				}
			}
		}
		$('promoApply').toggle();
		$('promoCode').observe('keyup',function(e) {
				this.button.toggle();
		});
		$('promoCode').observe('paste',function(e) {
			setTimeout("ess.checkout.toggleButton('promoApply')",50);
		});

	}

	if($('redeemableCardPaymentForm.cardNumber')) {
		$('redeemableCardPaymentForm.cardNumber').button = $('giftCardApply');
		$('giftCardApply').field = $('redeemableCardPaymentForm.cardNumber');
		$('giftCardApply').toggle = function(){
			if(this.field.value.length>0) {
				if(this.hasClassName('inactive')) {
					this.removeClassName('inactive');
				}
				if(!this.hasClassName('active')) {
					this.addClassName('active');
				}
			}else {
				if(this.hasClassName('active')) {
					this.removeClassName('active');
				}
				if(!this.hasClassName('inactive')) {
					this.addClassName('inactive');
				}
			}
		}
		$('giftCardApply').toggle();
		$('redeemableCardPaymentForm.cardNumber').observe('keyup',function(e) {
			this.button.toggle();
		});
		$('redeemableCardPaymentForm.cardNumber').observe('input',function(e) {
			this.button.toggle();
		});
		$('redeemableCardPaymentForm.cardNumber').observe('blur',function(e) {
			this.button.toggle();
		});
		
		//$('redeemableCardPaymentForm.cardNumber').observe('keyup', this.button.toggle);
		//$('redeemableCardPaymentForm.cardNumber').observe('input', this.button.toggle);
		//$('redeemableCardPaymentForm.cardNumber').observe('blur', this.button.toggle);
	}

/* wallet ***************************************************** */

	if(!Object.isUndefined(ess.walletJSON)){

		ess.wallet = new Wallet(ess.walletJSON);

		$$("input[name=useCard]").each(function(v){
				v.observeWalletUpdate = function (wallet) {
					if(this.value!=wallet.selectedCardId) {
						this.checked = false;
					}
				}
				ess.wallet.addUpdateListener(v);
				v.observe("click",function(e) {
					if(this.checked) {
						ess.wallet.setSelectedCardId(this.value);
					} else {
						ess.wallet.setSelectedCardId('');
					}

				});
			});

		$('creditCardPaymentMethod.cardType').observeWalletUpdate = function(wallet) {
				if(wallet.selectedCardId=='') {
					//this.value = 'VC';
					if(this.hasClassName('hide')) {
					  this.removeClassName('hide');
				  }
				}else{
					if(!this.hasClassName('hide')) {
					  this.addClassName('hide');
				  }
				}
		}
		ess.wallet.addUpdateListener($('creditCardPaymentMethod.cardType'));


		$('ccEntry').observeWalletUpdate = function(wallet) {
				if(wallet.selectedCardId=='') {
					if(this.hasClassName('hide')) {
					  this.removeClassName('hide');
				  }
				}else{
					if(!this.hasClassName('hide')) {
					  this.addClassName('hide');
				  }
				}
		}
		ess.wallet.addUpdateListener($('ccEntry'));

		if($('cardTypeUndeditable')) {
			$('cardTypeUndeditable').observeWalletUpdate = function(wallet) {
					if(wallet.selectedCardId=='') {
						if(!this.hasClassName('hide')) {
						  this.addClassName('hide');
					  }
					}else{
						this.update(wallet.getSelectedCard().cardType);
						if(this.hasClassName('hide')) {
						  this.removeClassName('hide');
					  }
					}
			}
			ess.wallet.addUpdateListener($('cardTypeUndeditable'));
		}

		$('maskedCard').observeWalletUpdate = function(wallet) {
				if(wallet.selectedCardId=='') {
					if(!this.hasClassName('hide')) {
					  this.addClassName('hide');
				  }
				}else{
					this.update("************"+wallet.getSelectedCard().lastFourDigits);
					if(this.hasClassName('hide')) {
					  this.removeClassName('hide');
				  }
				}
		}
		ess.wallet.addUpdateListener($('maskedCard'));

		$('selectedCardId').observeWalletUpdate = function(wallet) {
			this.value = wallet.selectedCardId;
		}
		ess.wallet.addUpdateListener($('selectedCardId'));

		ess.wallet.addUpdateListener($('maskedCard'));

		$('expDate').observeWalletUpdate = function(wallet) {
			if(wallet.getSelectedCard()!=null && !wallet.getSelectedCard().expired) {
				if(!this.hasClassName('hide')) {
					  this.addClassName('hide');
				}
			}else{
				if(this.hasClassName('hide')) {
				  this.removeClassName('hide');
			  }
			}
		}
		ess.wallet.addUpdateListener($('expDate'));
	}

	// Bill Me Later Checkbox Rules

	var bmlE = $('bmlAgreeToETerms');
	var bmlP = $('bmlAgreeToPlanTerms');
	if(bmlE&&bmlP) {
		if(!bmlE.checked) {
			bmlP.disabled=true;
		}
		bmlE.observe("click", function(e) {
			this.linkedField = bmlP;
			if(this.checked) {
				this.linkedField.disabled=false;
			} else {
				this.linkedField.checked=false;
				this.linkedField.disabled=true;
			}
		});
	}

});


/*************** Credit Card Enhancement Code **************/

var CCStates = Class.create({

	initialize : function() {

	}, // Constructor

	ccVal : null,

	ccData : {

		ccCat : {

			VC : false,
			MC : false,
			AM : false,
			DC : false,
			SM : false,
			//MSC : false,
			//SC : false,
			SO : false, // SC
			//JCB : false
			JC : false

		},
		reset : function() {

			ess_cc.ccData.ccCat.AM = false;
			ess_cc.ccData.ccCat.VC = false;
			ess_cc.ccData.ccCat.MC = false;
			ess_cc.ccData.ccCat.DC = false;
			ess_cc.ccData.ccCat.JC = false;
			//ess_cc.ccData.ccCat.JCB = false;
			ess_cc.ccData.ccCat.SM = false;
			//ess_cc.ccData.ccCat.MSC = false;
			ess_cc.ccData.ccCat.SO = false;
			//ess_cc.ccData.ccCat.SC = false;

		},
		message : function() {

			//var tKey = (ess_cc.ccData.ccCat.AM==true)?'AM':((ess_cc.ccData.ccCat.VC==true)?'VC':((ess_cc.ccData.ccCat.MC==true)?'MC':((ess_cc.ccData.ccCat.DC==true)?'DC':(ess_cc.ccData.ccCat.JC==true)?'JC':((ess_cc.ccData.ccCat.SM==true)?'SM':((ess_cc.ccData.ccCat.SO==true)?'SO':false)))));
			var tKey = (ess_cc.ccData.ccCat.AM==true)?'AM':((ess_cc.ccData.ccCat.VC==true)?'VC':((ess_cc.ccData.ccCat.MC==true)?'MC':((ess_cc.ccData.ccCat.DC==true)?'DC':(ess_cc.ccData.ccCat.JC==true)?'JC':((ess_cc.ccData.ccCat.SM==true)?'SM':((ess_cc.ccData.ccCat.SO==true)?'SO':false)))));

			return tKey;

		}

	},
	format : {

		/* Amex Type */
		threePartField : function () {

			var ccNum = $('ccEntry').getValue();
			var re = /\-/ig;
			strippedNum = ccNum.replace(re,'');

			var newNum = [];

			for(i = 0 ; i < (15) ; i++ ) {

				var number = ((strippedNum.charAt(i).length>0)?strippedNum.charAt(i):'');
				if(number.length>0) { } else { break; }

					if((i==4)||(i==10)) {

						(strippedNum.charAt(i)=='-')?'':newNum.push('-');

					}

			/* Must be Number */
			if( isNaN( strippedNum.charAt(i) ) == false ) newNum.push(strippedNum.charAt(i));
			}

			var commaRe = /\,/ig;
			var newSeq = newNum.toString().replace(commaRe,'');
			$('ccEntry').setValue(newSeq);

		},

		/* All Others Types */
		fourPartField : function () {

			var ccNum = $('ccEntry').getValue();
			var re = /\-/ig;
			strippedNum = ccNum.replace(re,'');

			var newNum = [];

			for(i = 0 ; i < (16) ; i++ ) {

				var number = ((strippedNum.charAt(i).length>0)?strippedNum.charAt(i):'');
				if(number.length>0) { } else { break; }

					if((i==4)||(i==8)||(i==12)) {

						(strippedNum.charAt(i)=='-')?'':newNum.push('-');

					}

			/* Must be Number */
			if( isNaN( strippedNum.charAt(i) ) == false ) newNum.push(strippedNum.charAt(i));
			}

			var commaRe = /\,/ig;
			var newSeq = newNum.toString().replace(commaRe,'');
			$('ccEntry').setValue(newSeq);

		},

		/* All Others Types */
		fourPartFieldWithExtraThreeDigits : function () {

			var ccNum = $('ccEntry').getValue();
			var re = /\-/ig;
			strippedNum = ccNum.replace(re,'');

			var newNum = [];

			for(i = 0 ; i < (19) ; i++ ) {

				var number = ((strippedNum.charAt(i).length>0)?strippedNum.charAt(i):'');
				if(number.length>0) { } else { break; }

					if((i==4)||(i==8)||(i==12)||(i==16)) {

						(strippedNum.charAt(i)=='-')?'':newNum.push('-');

					}

			/* Must be Number */
			if( isNaN( strippedNum.charAt(i) ) == false ) newNum.push(strippedNum.charAt(i));
			}

			var commaRe = /\,/ig;
			var newSeq = newNum.toString().replace(commaRe,'');
			$('ccEntry').setValue(newSeq);

		}


	},
	iconList : {

		dimCCIcon : function() {

			$$('.credit-card-list li').each(function(li){ li.addClassName('cc-icon-dim'); });
			
		},

		undimCCIcon : function () {

			$('cc-icon-list').setStyle({ "display":"block" }); 
/*			$$('.credit-card-list li').each(function(li){

				li.removeClassName('cc-icon-dim');
				li.addClassName('cc-icon-normal');

			});
*/
		},

		cleanslate : function () {

			$$('.credit-card-list li').each(function(li){

				li.removeClassName('cc-icon-normal');

			});

		},

		highlightCC : function(ccType) {

			switch(ccType) {

				case 'AM' : case 'AE' :
				if($('cc-am-icon')) { ess_cc.iconList.dimCCIcon(); $('cc-am-icon').removeClassName('cc-icon-dim'); } break;
				case 'DC' : if($('cc-dc-icon')) { ess_cc.iconList.dimCCIcon(); $('cc-dc-icon').removeClassName('cc-icon-dim'); } break;
				case 'DV' : case 'EV' : case 'VE' : case 'VC' :
				if($('cc-vc-icon')) { ess_cc.iconList.dimCCIcon(); $('cc-vc-icon').removeClassName('cc-icon-dim'); } break;
				case 'JC' : case 'JCB': if($('cc-jcb-icon')) { ess_cc.iconList.dimCCIcon(); $('cc-jcb-icon').removeClassName('cc-icon-dim'); } break;
				case 'ME' : case 'MC' :
				if($('cc-mc-icon')) { ess_cc.iconList.dimCCIcon(); $('cc-mc-icon').removeClassName('cc-icon-dim'); } break;
				case 'SO' : case 'SC' : if($('cc-so-icon')) { ess_cc.iconList.dimCCIcon(); $('cc-so-icon').removeClassName('cc-icon-dim'); } break;
				case 'SM' : case 'MSC' : if($('cc-sm-icon')) { ess_cc.iconList.dimCCIcon(); $('cc-sm-icon').removeClassName('cc-icon-dim'); } break;
				default:
					$('cc-icon-list').setStyle({ "display":"block" });
				$$('.credit-card-list li').each(function(li){ li.removeClassName('cc-icon-dim'); });
				break;

			}

		},
		ccInputField : function () {
			if($('creditCardPaymentMethod.cardType').getValue()!=false) {
				$('ccEntry').addClassName('cc-field-focus');
			}
		}
	},
	ccCodeSelection : {
		dynabuild : function (cc_type) {
			/* Simplified Default */
			$('default-option-set').setStyle({display:"block"}).addClassName('active-cc-type');
			$("default-selected-card").setStyle({display:"none"});
			$('cc-selection').setStyle({display:"block"});
            $('expDate').setStyle({display:"block"});
		}
	},
	compute : {

		singlefield : function () {

			ess_cc.ccData.reset();
			ess_cc.ccVal = $F('ccEntry');

			switch(ess_cc.ccVal.charAt(0)) {

				case '1' : ess_cc.ccData.ccCat.JC = true; break;

				case '3' :

					if(ess_cc.ccVal.charAt(1).length>0) {
						switch(ess_cc.ccVal.charAt(1)) {
							case '0': case '6': case '8': ess_cc.ccData.ccCat.MC = true; break;
							case '4': case '7': ess_cc.ccData.ccCat.AM = true; break;
							case '5': ess_cc.ccData.ccCat.JC = true; break;
						}
					}

				break;

				/* Visa */
				case '4' : ess_cc.ccData.ccCat.VC = true;
				break;

				/* Mastercard */
				case '5' :
					if(ess_cc.ccVal.charAt(1).length>0) {
						switch(ess_cc.ccVal.charAt(1)) {
							case '6': ess_cc.ccData.ccCat.SM = true; break;
							default : ess_cc.ccData.ccCat.MC = true; break;
						}
					}
				break;

				/* SM, SC, DC */
				case '6' :

					if(ess_cc.ccVal.charAt(1).length>0) {
						switch(ess_cc.ccVal.charAt(1)) {
							case '0': ess_cc.ccData.ccCat.DC = true; break;
							case '3':

								if(ess_cc.ccVal.charAt(2).length>0) {
									switch(ess_cc.ccVal.charAt(2)) {
										case '3':

										if(ess_cc.ccVal.charAt(3).length>0) {
											switch(ess_cc.ccVal.charAt(3)) {
												case '1':
												case '3':
												ess_cc.ccData.ccCat.SM = true;
												break;
												case '4':
												ess_cc.ccData.ccCat.SO = true;
												break;
											}
										}

										break;
									}
								}

							break;
							case '7':

								if(ess_cc.ccVal.charAt(2).length>0) {
									switch(ess_cc.ccVal.charAt(2)) {
										case '5': ess_cc.ccData.ccCat.SM = true; break;
										case '6': ess_cc.ccData.ccCat.SO = true; break;
									}
								}

							break;

						}
					}

				break;

			} // Switch

		},

		emptyfield : function () {

			var length = $('ccEntry').getValue().length;

			if(length>0) return false; else return true;

		}

	},
	eventHandlers : {

		/* Primary Action Sequence */
		single : function () {

			ess_cc.compute.singlefield();
			var cctype = ess_cc.ccData.message();

			ess_cc.iconList.highlightCC(cctype);
			ess_cc.ccCodeSelection.dynabuild(cctype);

		},
		enterkey : function () {

			ess_cc.compute.singlefield();
			(ess_cc.ccData.message()=='AM')?ess_cc.format.threePartField():((ess_cc.ccData.message()=='SO'||ess_cc.ccData.message()=='SM')?ess_cc.format.fourPartFieldWithExtraThreeDigits():ess_cc.format.fourPartField());

		},
		emptycheck : function () {

			var emptiness = ess_cc.compute.emptyfield();
			if(emptiness==true) {

				ess_cc.iconList.undimCCIcon();

			} else {

				ess_cc.iconList.cleanslate();

			}

		},

		expiryMonthYearFields : function () {

			/* Append 0# */
			var paymentForm = ($('paymentForm')) ? $('paymentForm') : $('creditCardWalletForm');
			var monthNode = $('creditCardPaymentMethod.expirationMonth');
			var expMonth = monthNode.getValue();

			if(expMonth.length==1){
				expMonth = "0" + expMonth;
				// changed the form element name and created new hidden element to pass new expirationMonth to hide change from UI
				$('creditCardPaymentMethod.expirationMonth').name = 'inputMonth';
				paymentForm.insert(new Element('input', {type:'hidden',name:'creditCardPaymentMethod.expirationMonth',value:expMonth}));
			}

			var yearNode = $('creditCardPaymentMethod.expirationYear');
			var expYear = yearNode.getValue();

			/* Append 20## if year is 2 digit*/
			if(expYear.length==2){
				expYear = "20" + expYear;
				// changed the form element name and created new hidden element to pass new expirationYear to hide change from UI
				$('creditCardPaymentMethod.expirationYear').name = 'inputYear';
				paymentForm.insert(new Element('input', {type:'hidden',name:'creditCardPaymentMethod.expirationYear',value:expYear}));
			}

		},
		postPurge : function () {

			/* Post Purge */
			var attr = $('ccEntry').readAttribute('name');
			$('ccEntry').writeAttribute('name','null');

			var ccNum = $('ccEntry').getValue();
			var re = /\-/ig;
			var numbers = ccNum.replace(re,'');

			var ccPurged = new Element('input',{'id':'ccEntered','name':attr,'type':'hidden','value':numbers});

			$('ccNumParent').appendChild(ccPurged);

		},
		postCCType : function () {

			var cc_code = new String();

			/* Alter Original Dom */

			var val = $('creditCardPaymentMethod.cardType').getValue();
			var name = $('creditCardPaymentMethod.cardType').readAttribute('name');
			$('creditCardPaymentMethod.cardType').writeAttribute('name','null');

			$('selected-cccode-transfer').setValue(val);
			$('selected-cccode-transfer').writeAttribute('name',name);

		}

	},

	/* Event Listening Starting Points */
	observers : {

		setupfield : function () {

			$('ccEntry').observe("keyup",ess_cc.eventHandlers.single);

			/* Determine Four/Three Part */
			$('ccEntry').observe("keydown",ess_cc.eventHandlers.enterkey);
			$('ccEntry').observe("keyup",ess_cc.eventHandlers.enterkey);

			$('ccEntry').observe("blur",ess_cc.eventHandlers.single);
			$('ccEntry').observe("keyup",ess_cc.eventHandlers.emptycheck);

			$('ccEntry').observe("input",ess_cc.eventHandlers.single);
			$('ccEntry').observe("input",ess_cc.eventHandlers.emptycheck);
			$('ccEntry').observe("input",ess_cc.eventHandlers.enterkey);
		},
		finalsubmit : function() {

			if($('paymentForm')) {

				$('paymentForm').observe('submit',ess_cc.eventHandlers.expiryMonthYearFields);
				$('paymentForm').observe('submit',ess_cc.eventHandlers.postPurge);
				$('paymentForm').observe('submit',ess_cc.eventHandlers.postCCType);

			} else if($('creditCardWalletForm')) {

				$('creditCardWalletForm').observe('submit',ess_cc.eventHandlers.expiryMonthYearFields);
				$('creditCardWalletForm').observe('submit',ess_cc.eventHandlers.postPurge);
				$('creditCardWalletForm').observe('submit',ess_cc.eventHandlers.postCCType);

			}

		}

	} // End Method

});


/* Establish Global Utility Variable as Plugin Control (Necessary for CCStates Class)*/
ess_cc = new Object();

document.observe("dom:loaded",function(){

	if ( $('giftCardBalanceLink') ) {
		$('giftCardBalanceLink').observe( 'click' ,function(e) {
			e.preventDefault();
			modal.open( {
				url: '/checkout/checkGCBalance.jsp',
				closeButton: 'withScroll',
				width: '570px',
				height: '465px',
				scrolling: 'yes'
			} );return false;
		});
		$('giftCardBalanceLink').href = "javascript:void(0);";
	}

	if($('ccEntry')) {

		/* Append Plugin to Global Namespace */
		ess_cc = new CCStates();

		ess_cc.observers.setupfield();

		ess_cc.observers.finalsubmit();

	} // CC Enhancement Only


	/*** Wallet Feature and CC Type Toggle ***/
	var imageDir = $('cc-image-dirloc').value + 'images/';
	var cardCount = 0;

	if($$('.use-card'))
    {
		$$('.use-card').each(function(checknode)
        {
			/* alert('----- $$(\'.use-card\').each -----' + '\n' + 'checknode.id = ' + checknode.id + '\n' + 'checknode.checked = ' + checknode.checked); */
            var test = checknode.checked;
			if(test==true)
            {
/*                $$('.cc-icon').each(function(creditCardImg) {
                    creditCardImg.setStyle({ "display":"none" });
                });
*/				$('cc-icon-list').setStyle({ "display":"none" });
				var shortDesc = $$('.cc-desc')[cardCount].value.toLowerCase();
                var reMC = /master/i;
                var reVC = /visa/i;
                var reDC = /discover/i;
                var reAM = /american/i;
                var reSC = /solo/i;
                var reSM = /maestro/i;
                var reJC = /jcb/i;
                if(shortDesc.match(reMC)) { var imageName = 'cc_mastercard.gif'; }
                else if(shortDesc.match(reVC)) { var imageName = 'cc_visa.gif'; }
                else if(shortDesc.match(reDC)) { var imageName = 'cc_discover.gif'; }
                else if(shortDesc.match(reAM)) { var imageName = 'cc_amex.gif'; }
                else if(shortDesc.match(reSC)) { var imageName = 'solo_card_sm.gif'; }
                else if(shortDesc.match(reSM)) { var imageName = 'maestro_card_sm.gif'; }
                else if(shortDesc.match(reJC)) { var imageName = 'jcb_card_sm.gif'; }
                /* alert('----- $$(\'.use-card\').each -----' + '\n' + 'shortDesc = ' + shortDesc + '\n' + 'imageName = ' + imageName); */

                var selectedCC = new Element('img',{src:imageDir+imageName});
				if ($('wallet-selection')) {
                    $('wallet-selection').setStyle({ "display":"block" }).insert( selectedCC );
				}
				$('cc-selection').setStyle({display:"none"});
                $('expDate').setStyle({display:"none"});
            }
		    cardCount++;
		});

		$$('.use-card').each(function(checknode)
        {
			checknode.observe('click',function(node)
            {
				if(node.target.checked == true)
                {
					var shortDesc = $(node.target).previous().value.toLowerCase();

					var reMC = /master/i;
					var reVC = /visa/i;
					var reDC = /discover/i;
					var reAM = /american/i;
					var reSC = /solo/i;
					var reSM = /maestro/i;
					var reJC = /jcb/i;

					if(shortDesc.match(reMC)) { var imageName = 'cc_mastercard.gif'; }
					else if(shortDesc.match(reVC)) { var imageName = 'cc_visa.gif'; }
					else if(shortDesc.match(reDC)) { var imageName = 'cc_discover.gif'; }
					else if(shortDesc.match(reAM)) { var imageName = 'cc_amex.gif'; }
					else if(shortDesc.match(reSC)) { var imageName = 'solo_card_sm.gif'; }
					else if(shortDesc.match(reSM)) { var imageName = 'maestro_card_sm.gif'; }
					else if(shortDesc.match(reJC)) { var imageName = 'jcb_card_sm.gif'; }

                    if ($('wallet-selection')) {
					    $('wallet-selection').update("");
                    }
					var selectedCC = new Element('img',{src:imageDir+imageName});
                    if ($('wallet-selection')) {
					    $('wallet-selection').setStyle({ "display":"block" }).insert( selectedCC )
                    }
					$('cc-selection').setStyle({display:"none"});
                    $('expDate').setStyle({display:"none"});
/*                    $$('.cc-icon').each(function(creditCardImg) {
                        creditCardImg.setStyle({ "display":"none" });
                    });
*/					$('cc-icon-list').setStyle({ "display":"none" });}
                else
                {
/*                    $$('.cc-icon').each(function(creditCardImg) {
                        creditCardImg.setStyle({ "display":"block" });
                    });
*/					$('cc-icon-list').setStyle({ "display":"block" }); 
					if ($('wallet-selection')) {
					    $('wallet-selection').setStyle({ "display":"none" }); //.insert( selectedCC );
                    }
					$('cc-selection').setStyle({display:"block"});
                    $('expDate').setStyle({display:"block"});
				}
			});
		});

	}

	/* Uncheck Through Button */
	if($('add-new-card')) {
		$('add-new-card').observe("click",function(){

			/* Clear Wallet ID */
			$('selectedCardId').setValue('');
/*             $$('.cc-icon').each(function(creditCardImg) {
                   creditCardImg.setStyle({ "display":"block" });
                });
*/			$('cc-icon-list').setStyle({ "display":"block" }); 

            if ($('wallet-selection')) {
			    $('wallet-selection').setStyle({ "display":"none" });
            }
            $('creditCardPaymentMethod.cardType').removeClassName('hide');
            /* $('creditCardPaymentMethod.cardType').setStyle({ "display":"block" }).removeClassName('hide'); */

			$('cc-selection').setStyle({display:"block"});
            $('expDate').setStyle({display:"block"});

			/* Clear Checkboxes */
			$$('.use-card').each(function(checknode){

				if(checknode.checked==true) {

					checknode.checked = false;

				}

			});


			/* Toggle */

			if( $('ccEntry').hasClassName('hide') ) $('ccEntry').removeClassName('hide');
			if( $('expDate').hasClassName('hide') ) $('expDate').removeClassName('hide');

			$('maskedCard').addClassName('hide');

		});
	}


	/* Wallet Entry Reset Button */
	if($('cancel')) {

		$('cancel').observe("click",function(){

			$('creditCardWalletForm').reset();

			$$('.credit-card-list li').each(function(node){

				node.className = '';

			});

			$('add-a-card').select('.error').each(function(v){
				if(v.tagName == 'SPAN' || v.tagName == 'P'){
					v.remove();
				}else{
					v.removeClassName('error');
				}

			});

			$('add-a-card').select('.fieldError').each(function(v){
				if(v.tagName == 'SPAN'){
					v.removeClassName('fieldError');
				}else{
					v.removeClassName('fieldError');
				}
			});
			$('preferredCard1').checked = false;
			$('creditCardPaymentMethod.cardType').value = '';

		});

	}

});

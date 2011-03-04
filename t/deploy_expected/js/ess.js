// JavaScript Document
if (Object.isUndefined(ess))
    var ess = {};

ess.LTrim = function(value) {
    var re = /^\s*/;
    return value.replace(re, '');
}
ess.RTrim = function(value) {
    var re = /\s*$/;
    return value.replace(re, '');
}
ess.trim = function(value) {
    return ess.LTrim(ess.RTrim(value));
}

ess.showCustomPopUp = function(thisUrl,thisName,theseParams){
    remote = open(thisUrl, thisName, theseParams);
};

ess.emailSignup = function(form) {
    if (!ess.isEmpty(form) && !ess.isEmpty(form.action) && !ess.isEmpty(form.emailAddress) && !ess.isEmpty(form.emailAddress.value)) {
        /* alert('===== ess.emailSignup =====' + '\nform.action = ' + form.action + '\nform.emailAddress.value = ' + form.emailAddress.value + '\n\nForm.serialize(form) = ' + Form.serialize(form)); */
        new Ajax.Request(form.action, {
            method: 'post',
            postBody: Form.serialize(form) + '&ajax=true',
            // parameters: 'emailAddress='+form.emailAddress.value,
            onLoading: function(e) {
                $('sign-up').addClassName('hidden');
                $('sign-up-loader').removeClassName('hidden');
            },
            onComplete: function(e) {
                if (e.status == 200)
                {
                    //console.log(e.responseText);
                    if (null != e.responseText.match(/<!-- success -->/i)) {
                        $('sign-up-loader').addClassName('hidden');
                        $('sign-up-success').removeClassName('hidden');
                        /* alert('*** about to fire em:signup ***'); */
                        $(document).fire("em:signup");
                        /* alert('*** after firing em:signup ***'); */
                    } else {
                        $('sign-up-loader').addClassName('hidden');
                        $('sign-up').removeClassName('hidden');
                        alert(ess.trim(e.responseText));
                    }
                }
                else
                {
                    $('sign-up-loader').addClassName('hidden');
                    $('sign-up').removeClassName('hidden');
                    alert('We are sorry, an error occurred while processing your request.');
                }
            },
            on403: function(e, m) {
                /* TODO: if exception occurs we need to perform redirect to login page! */
                /* debugging: */ console.log('::::: request to :::::\n' + form.action + '\n::::: caught in on403 :::::' + '\n\ne = ' + e + '\n\nm = ' + m);
            },
            onException: function(e, m) {
                /* if exception occurs just swallow it */
                /* debugging: */ console.log('::::: request to :::::\n' + form.action + '\n::::: caught in onException :::::' + '\n\ne = ' + e + '\n\nm = ' + m);
            },
            onError: function(e, m) {
                /* if error occurs just swallow it */
                /* debugging: */ console.log('::::: request to :::::\n' + form.action + '\n::::: caught in onError :::::' + '\n\ne = ' + e + '\n\nm = ' + m);
            },
            onFailure: function (e, m) {
                /* debugging: */ console.log('::::: request to :::::\n' + form.action + '\n::::: caught in onFailure :::::' + '\n\ne = ' + e + '\n\nm = ' + m);
            }
        });
        return false;
    }
};

/* 
 * Global navigation sub-category columns height fix 
 * 
 * @param holderClassName Class name of the element which height is being referenced
 * @param columnClassName Class name of columns which height is being adjusted
 * @param offset Offset value to increase/decrease the column height relative to the holder height
 */
function setColumnHeight(holderClassName, columnClassName, offset) {
    $$('.'+holderClassName).each(function(holder) {
         
        // Get computed height of sub-category holder
        var holderHeight = holder.getHeight();
        
        // Apply height to columns within holder
        holder.select('.'+columnClassName).each(function(column) {
            column.setStyle({
                height: (holderHeight+offset) + 'px'
            });
        });
    });
}

/*
 * Dom:loaded Events
 */
$(document).observe('dom:loaded', function(e){
    /* Init dropnav */
    $$('.df-dropnav').each(function(v){
        v.dropnav();
    });
    
    /* Global navigation sub-category columns height fix */
    setColumnHeight('subcat-holder', 'col', -50);

	 /* Email Sign-up */
     var addEmailAddress = $('add-email-address');
     if (addEmailAddress) {
         $(addEmailAddress).observe('click', function(event) {
             $('sign-up-success').addClassName('hidden');
             $('sign-up').removeClassName('hidden');
         });
     }							
});

ess.createTabs = function(tabId) {
    if (!$(tabId)) {
        return;
    }

    var pars = {
        hideClassName: "inactive",
        showClassName: "active"
    };

    try {
        var tabs = new Df.Tabset(tabId, pars);
        var items = tabs.getItems();
        for (var i = 0; i < items.length; i++) {
            items[i].getElement().addClassName(pars.hideClassName);
        }
        tabs.showItem(0);
    } catch(err) {}
};
ess.isEmpty = function(val) {
    if (typeof val == "undefined") {
        return true;
    }
    if (val == undefined || val == null) {
        return true;
    }
    if (typeof val == "string") {
        return val.length == 0 || val == "null" || val == "undefined" || val == "false";
    }
    return false;
};
ess.validateEmail = function(name) {
    var regEx = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    var elemenet = $(name);
    return elemenet && !ess.isEmpty(elemenet.getValue()) && elemenet.getValue().match(regEx);
};

ess.previewEmailWishlist = function(url){
    var customerEmailAddress = $('customerEmailAddress').value;
    var recipientEmailAddress = $('recipientEmailAddress').value;
    var customerName = $('customerName').value;
    var message = $('message').value;
    $H({customerEmailAddress: customerEmailAddress, recipientEmailAddress: recipientEmailAddress, customerName: customerName, message: message}).toQueryString()
    // var previewUrl = url + '&customerEmailAddress=' + customerEmailAddress + '&recipientEmailAddress=' + recipientEmailAddress + '&customerName=' + customerName + '&message=' + message;
    var previewUrl = url + '?' + $H({customerEmailAddress: customerEmailAddress, recipientEmailAddress: recipientEmailAddress, customerName: customerName, message: message}).toQueryString();
    ess.showCustomPopUp(previewUrl, 'previewemailwishlist','width=580,height=550,toolbar=no,status=no,menubar=no,scrollbars=yes,resizable=no');
};

String.prototype.decimalAsciiToRegEx=function(chars){
	var decimalToOctal=function(num){
		num=parseInt(num);
		var str=new String();str=num;
		return str.toString(8);
	}
	if("object"!=typeof(this))return false;
	var regex='';
	if("object"==typeof(chars)&&"string"==typeof(chars.range)){
		chars.range.split(',').each(function(r){
			r=r.split('-');
			for(i=r[0];i<=r[1];i++){
				regex+="\\"+decimalToOctal(i)+'|';
			}
		});
	}else{
		if("string"==typeof(chars))chars=chars.split(",");
		chars.each(function(ch){
			if("string"==typeof(ch)||"number"==typeof(ch)){
				regex+="\\"+decimalToOctal(ch)+'|';
			}else if("object"==typeof(ch)){
				if("string"==typeof(ch.range)){
					ch.range.split(',').each(function(r){
						r=r.split('-');
						if(r[0]&&r[1]){
							for(i=r[0];i<=r[1];i++){regex+="\\"+decimalToOctal(i)+'|';}
						}
					});
				}
			}
		});
	}
	regex=regex.slice(0,-1);
	return (regex?new RegExp(regex,"g"):false);
}
String.prototype.removeAscii=function(chars){
	var regex=this.decimalAsciiToRegEx(chars);
	return (regex?new String(this.replace(regex,'')):this);
};
String.prototype.matchAscii=function(chars){
	var regex=this.decimalAsciiToRegEx(chars);
	var matches=(regex?this.match(regex):false);
	return (matches?matches.uniq():false);
};
// JavaScript Document
if (Object.isUndefined(ess))
    ess = {};

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

ess.titleCase = function(value)
{
    /* alert('--- titleCase ---' + '\nvalue = ' + value); */
    if (value != null)
    {
        var varTitleCaseOutput = '';
        var varTitleCaseInput = value.replace('  ',' ');
        var words = varTitleCaseInput.split(' ');
        if (words.length == 0)
        {
            varTitleCaseOutput = '';
        }
        else
        {
            var word;
            for (var i=0; i < words.length; i++)
            {
                word = words[i];
                /* alert('words['+i+'] = ' + word); */
                if (word.length > 0)
                {
                    word = word.substr(0,1).toUpperCase() + word.substr(1,word.length).toLowerCase();
                    if (varTitleCaseOutput.length != 0) varTitleCaseOutput += ' ';
                    varTitleCaseOutput += word;
                }
            }
            /* alert('varTitleCaseOutput = ' + varTitleCaseOutput); */
            value = varTitleCaseOutput;
        }
    }
    return value;
};

ess.confirmAction = function(url, message, formOrMethod, id) {
  if(confirm(message)){
    if (formOrMethod && formOrMethod.action) {
      formOrMethod.action = url;
	  formOrMethod.getInputs("submit")[0].click();
	  return true;
	}else if(formOrMethod && formOrMethod.toUpperCase() == 'POST'){
		$(document.body).insert(new Element('form', {name:'deleteForm', id: 'deleteForm', method: 'post', action: url}));
		if(id && id!=''){
			$('deleteForm').insert(new Element('input', {type:'hidden', name:'delete', value:id}));
		}
		$('deleteForm').submit();
	  	return true;
    }else{
      location.href = url;
	  return true;
    }
  } else {
    return false;
  }
};

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

/*
 * Validate quantity of an input field on key up.
 *
 * @param selector Required: Selector for quantity input fields (e.g. #qty or .qty)
 * @param maxValue Optional: Maximum value allowed for input field (e.g. 99). Default: 999
 * @param callback Optional: Callback function to be executed after successful validation. Provides field value as parameter.
 */
ess.validateQuantityOnKeyUp = function(selector, maxValue, callback) {
    var el = $$(selector);

    if (typeof maxValue == 'undefined' || maxValue == null)
        maxValue = 999;

    if (el) {
        el.each(function(node) {
            node.observe('keyup', function(e){
                var field = Event.element(e);
                var num = field.getValue();
                var isNumber = /^-?\d+$/.test(num);

                try {
                    if (!isNumber || parseInt(field.getValue()) > maxValue) {
                        field.setValue(num.slice(0, num.length-1));
                        return false
                    }
                } catch(err) {
                    return false
                }

                if (typeof callback == 'function')
                    callback(num);

                return true;
            });
        });
    }
}
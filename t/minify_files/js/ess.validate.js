document.observe("dom:loaded", function(e) {
  var sendForm = $("esuForm");
  if (sendForm) {
    sendForm.onsubmit = function() {
      return verifyFields();
    };
  }
});

function verifyFields() {
  var emailReg = "^[\\w-_\.]*[\\w-_\.]\@[\\w]\.+[\\w]+[\\w]$";
 var ele = $("fname");
  if (ele && !ele.present()) {
    alert("Please Enter Name");
    ele.focus();
    return false;
  }
 ele = $("email");
  if (!ess.validateEmail(ele.identify())) {
    alert(ess.messages.validateEmailAddress);
    $("recipientEmail").focus();
    return false;
  }

  ele = $("name");
  if (ele && !ele.present()) {
    alert(ess.messages.validateRequiredFields);
    ele.focus();
    return false;
  }
   return true;
}

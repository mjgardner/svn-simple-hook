document.observe("dom:loaded", function(e) {
  var orderForm = $("orderForm");
  if (orderForm) {
    orderForm.onsubmit = function() {
      return verifyFields();
    };
  }
});

function verifyFields() {
  var emailReg = "^[\\w-_\.]*[\\w-_\.]\@[\\w]\.+[\\w]+[\\w]$";

  var ele = $("recipientName");
  if (ele && !ele.present()) {
    alert(ess.messages.validateRequiredFields);
    ele.focus();
    return false;
  }

  ele = $("recipientEmail");
  if (!ess.validateEmail(ele.identify())) {
    alert(ess.messages.validateEmailAddress);
    $("recipientEmail").focus();
    return false;
  }

  ele = $("senderName");
  if (ele && !ele.present()) {
    alert(ess.messages.validateRequiredFields);
    ele.focus();
    return false;
  }

  ele = $("message");
  if (ele && ele.present() && ele.getValue().length > 120) {
    alert(ess.messages.validateGiftCertificateMessageLength);
    ele.focus();
    return false;
  }

  ele = $("certificateAmount");
  if (ele) {
      if (ele.present()) {
        var val = $F(ele.identify());
        if (isNaN(val)) {
          alert(ess.messages.validateGiftCertificateValue3);
          ele.focus();
          return false;
        }

        var numberRegEx = /^\d+$/;

        if (!numberRegEx.test(val)) {
          alert(ess.messages.validateGiftCertificateValue2);
          ele.focus();
          return false;
        }

        if (parseInt(val) < 5) {
          alert(ess.messages.validateGiftCertificateValue1);
          ele.focus();
          return false;
        }
      } else {
        alert(ess.messages.validateRequiredFields);
        ele.focus();
        return false;
      }
  }
  return true;
}

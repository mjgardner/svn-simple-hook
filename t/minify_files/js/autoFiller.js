/* This script and many more are available free online at
The JavaScript Source!! http://javascript.internet.com
Created by: assbach | http://www.ipernity.com/home/assbach */

function autofill() {
  var currentDate = new Date()
  var month = currentDate.getMonth() +1
  var day = currentDate.getDate()
  var year = currentDate.getFullYear()
  var formDate = month + "-" + day + "-" + year

  if(document.getElementById("addressForm")) {
	document.getElementById("billingAddress.address.firstName").value = "Master";
 	document.getElementById("billingAddress.address.lastName").value = "Coder";
 	document.getElementById("billingAddress.address.address1").value = "123 First Street";
 	document.getElementById("billingAddress.address.city").value = "King of Prussia";
 	document.getElementById("billingAddress.address.state").selectedIndex = 47; // dropdown
 	document.getElementById("billingAddress.address.postalCode").value = "19406";
 	document.getElementById("billingAddress.phone").value = "610-555-1212";
 	//document.getElementById("email").value = "mc@somewhere.com";
 	//document.getElementById("datebox").value = formDate;
 	//document.getElementById("checkbox").checked = true; // checkbox
 	//document.getElementById("radiobutton").checked = true; // radiobutton
  }

  if(document.getElementById("paymentForm")) {
 	document.getElementById("creditCardPaymentMethod.cardType").selectedIndex = 3; // dropdown
 	document.getElementById("ccEntry").value = "4111111111111111";
 	document.getElementById("creditCardPaymentMethod.expirationMonth").selectedIndex = 3; // dropdown
 	document.getElementById("creditCardPaymentMethod.expirationYear").selectedIndex = 3; // dropdown
 	document.getElementById("creditCardPaymentMethod.ccvNumber").value = "123";
  }
}

// Multiple onload function created by: Simon Willison
// http://simonwillison.net/2004/May/26/addLoadEvent/
function addLoadEvent(func) {
  var oldonload = window.onload;
  if (typeof window.onload != 'function') {
    window.onload = func;
  } else {
    window.onload = function() {
      if (oldonload) {
        oldonload();
      }
      func();
    }
  }
}

addLoadEvent(function() {
autofill();
});
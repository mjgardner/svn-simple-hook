document.observe("dom:loaded", function(e) {
  var emailsignup = $("orderDetailCommand");
  if (emailsignup) {
    emailsignup.onsubmit = function() {
      return validateorder();
    };
  }
});

function validateorder() {
 var ele = $("orderId");
  ele = $("orderId");
  if (ele && !ele.present()){
   alert("Please Enter Order Valid Number");
   return false;
   }


  ele = $("zipCode");
  if (ele && !ele.present()){
   alert("Please Enter Zip Code");
   return false;
   }

   return true;
}

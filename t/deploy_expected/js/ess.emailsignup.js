document.observe("dom:loaded", function(e) {
  var emailsignup = $("sign-up");
   if (emailsignup) {
    emailsignup.onsubmit = function() {
      return verifyFields();
    };
  }
});

function ValidateEmail(field, alerttxt) {
	with (field) {
	apos=value.indexOf("@");
	dotpos=value.lastIndexOf(".");
	if (apos < 1 || dotpos-apos < 2)
	{
	alert(alerttxt);return false;}
	else {return true;}
	}
	}

function validateFirstName(){

}

function ValidateEmail(field, alerttxt) {
	with (field) {
	apos=value.indexOf("@");
	dotpos=value.lastIndexOf(".");
	if (apos < 1 || dotpos-apos < 2)
	{
	alert(alerttxt);return false;}
	else {return true;}
	}
	}


function verifyFields() {
 var alertText="";
 var emailReg = "^[\\w-_\.]*[\\w-_\.]\@[\\w]\.+[\\w]+[\\w]$";
 var ele = $("emailAddress");
  if (!ess.validateEmail(ele.identify())) {

  alertText += "Please Enter Correct Email Address \r\n";
    //alert("Please Enter Correct Email Address");
    //ele.focus();
	ele.value="";
	//return false;
  }
     ele = $("gender1","gender2");
	if (!ele[0].checked && !ele[1].checked){
	   //alert("Please Select Gender");
	   alertText += "Please Select Gender \r\n";
	   //return false;
   }


  var fnameReg = /^[a-zA-Z ]+$/;
  var ele = $("firstName");
  if (ele && !ele.present()) {
    //alert("Please Enter Your First Name");
    //ele.focus();
	//return false;
	alertText += "Please Enter Your First Name \r\n";
	} else
  if (!fnameReg.test(ele.value) ) {
	//alert("Please Enter Valid First Name");
	//ele.focus();
	ele.value="";
	alertText += "Please Enter Valid First Name \r\n";
	//return false;
	}

  var lnameReg = /^[a-zA-Z ]+$/;
  var ele = $("lastName");
  if (ele && !ele.present()) {
    //alert("Please Enter Your Last Name");
    //ele.focus();
    alertText += "Please Enter Your Last Name \r\n";
	//return false;
  } else
  if (!lnameReg.test(ele.value) ) {
	//alert("Please Enter Your Last Name");
	//ele.focus();
	ele.value="";
	alertText += "Please Enter Valid Last Name \r\n";
	//return false;
	}

   ele = $("country");
  if (ele.value=="-1"){
   //alert("Please Select Country");
   alertText += "Please Select Country \r\n";
   //return false;
   }

  var zipReg = /^[0-9a-zA-Z\-\. ]+$/;
  var ele = $("zipCode");
  if (ele && !ele.present()){
   //alert("Please Enter Zip Code");
   alertText += "Please Enter Zip Code \r\n";
   //return false;
   } else
     if (!zipReg.test(ele.value) ) {
	//alert("Please Enter Zip Code");
	//ele.focus();
	ele.value="";
	alertText += "Please Enter Valid Zip Code \r\n";
	//return false;
	}
  var add1Reg = /^[0-9a-zA-Z\-\#\,\. ]+$/;
  var ele = $("address1");

    if (ele.value!="" && !add1Reg.test(ele.value) ) {
	//alert("Please enter Your Address1");
	//ele.focus();
	ele.value="";
	alertText += "Please Enter Valid Address 1 \r\n";
	//return false;
	}
	var add2Reg = /^[0-9a-zA-Z\-\#\,\. ]+$/;
  var ele = $("address2");

    if (ele.value!="" && !add2Reg.test(ele.value) ) {
	//alert("Please enter Your Address2");
	//ele.focus();
	ele.value="";
	alertText += "Please Enter Valid Address 2 \r\n";
	//return false;
	}

  var cityReg = /^[a-zA-Z ]+$/;
  var ele = $("city");

    if (ele.value!="" && !cityReg.test(ele.value) ) {
	//alert("Please enter Your City");
	//ele.focus();
	ele.value="";
	alertText += "Please Enter Valid City \r\n";
	//return false;
	}
  var stateReg = /^[a-zA-Z ]+$/;
  var ele = $("state");

    if (ele.value!="" && !stateReg.test(ele.value) ) {
	//alert("Please enter Your State");
	//ele.focus();
	ele.value="";
	alertText += "Please Enter Valid State \r\n";
	//return false;
	}

   //var eleCountry = $("country");
   var elePromo = $("sendEmailUpdates");
   
   if(elePromo){
	   if(elePromo.checked == false){
	   	alertText +="Marketing policy checkbox must be accepted in order to sign up for emails";
	   }
   }
   
    if(alertText !=""){
		alert(alertText);
		return false;
	}  
  
  return true; 

   }
    
 function change(){
var a = document.getElementById('country');
var b=document.getElementById('sendEmailUpdates');
if(a.value=='US'||a.value=="UK"){
b.checked=true;
}
else
b.checked=false;
}
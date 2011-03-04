function checklength(val)
{
	if(val.length == 0) return false;
	for(var j=val.length;j > 0;j--)
	{
		if(val.charAt(j-1) != ' ')
		{
			return true;
		}
	}
	return false;
}

function emailCheck(val)
{
var EmailOk  = true
var Temp     = val;
var AtSym    = Temp.indexOf('@')
var Period   = Temp.lastIndexOf('.')
var Space    = Temp.indexOf(' ')
var Length   = Temp.length - 1   // Array is from 0 to length-1

	if ((AtSym < 1) ||                 // '@' cannot be in first position
    (Period <= AtSym+1) ||             // Must be atleast one valid char btwn '@' and '.'
    (Period == Length ) ||             // Must be atleast one valid char after '.'
    (Space  != -1))                    // No empty spaces permitted
 	{
    	  return false;
 	}
   	return true;
}					

function valForm(frm)
{
	if(!emailCheck(frm.emailAddress.value))
	{
		alert("Please enter a valid email address.");
		if(!document.layers) frm.emailAddress.style.backgroundColor='yellow';
		frm.emailAddress.focus();
		return false;
	}
	return true;
}

function verifyEmailSearchFields()
{
    var formObject = document.customerSearchForm;
    var Temp     = formObject.customerEmail.value;
    var AtSym    = Temp.indexOf('@')
    var Period   = Temp.lastIndexOf('.')
    var Space    = Temp.indexOf(' ')
    var Length   = Temp.length - 1   // Array is from 0 to length-1

    if ((AtSym < 1) ||                 // '@' cannot be in first position
    (Period <= AtSym+1) ||             // Must be atleast one valid char btwn '@' and '.'
    (Period == Length ) ||             // Must be atleast one valid char after '.'
    (Space  != -1))                    // No empty spaces permitted
     {
         alert("Please enter a valid email address.");
         return false;
     }
       return true;
}

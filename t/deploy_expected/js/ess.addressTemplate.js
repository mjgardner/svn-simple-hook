ess.address = {};

/*
 * Input: JSON data object and a zparse template
 * Replaces target HTML with the markup output of zparse engine
 */
ess.address.formatAddress = function(JSONObj, zParseTemplate, target){
	var parser = new ZParse(Implementation);
	parser.parse(zParseTemplate.innerHTML);
	var outputHTML = parser.process({
		firstName: JSONObj.firstName,
		lastName: JSONObj.lastName,
		address1: JSONObj.address1,
		address2: JSONObj.address2,
		address3: JSONObj.address3,
		city: JSONObj.city,
		state: JSONObj.state,
		stateAlternateText: JSONObj.stateAlternateText,
		postalCode: JSONObj.postalCode,
		country: JSONObj.fullCountryName
	});
	target.update(outputHTML);
};
ess.address.formatAddressSuggestion = function(JSONObj, zParseTemplate, target){
	var parser = new ZParse(Implementation);
	parser.parse(zParseTemplate.innerHTML);
	try {
	var outputHTML = parser.process({
		address1: JSONObj.address1,
		address1Error:JSONObj.address1Error,
		address2: JSONObj.address2,
		address2Error:JSONObj.address2Error,
		address3: JSONObj.address3,
		address3Error:JSONObj.address3Error,
		city: JSONObj.city,
		cityError:JSONObj.cityError,
		state: JSONObj.state,
		stateError:JSONObj.stateError,
		stateAlternateText: JSONObj.stateAlternateText,
		stateAlternateTextError: JSONObj.stateAlternateTextError,
		postalCode: JSONObj.postalCode,
		postalCodeError: JSONObj.postalCodeError,
		country: JSONObj.fullCountryName,
		countryError: JSONObj.fullCountryNameError
	});} catch(e){
  }
	target.update(outputHTML);
};
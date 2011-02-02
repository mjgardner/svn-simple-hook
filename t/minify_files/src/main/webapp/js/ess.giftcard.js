function verifyFields() {
	canSubmit = true;
	formObject = document.orderForm;

	if (canSubmit && formObject.to && formObject.to.value == "") {
		canSubmit = false;
		alert(ess.messages.validateRequiredFields);
		formObject.to.focus();
	}

	if (canSubmit && formObject.amount && formObject.amount.value == "") {
		canSubmit = false;
		alert(ess.messages.giftCardAmountBelowMinimum);
		formObject.amount.focus();
	} else if (canSubmit && formObject.amount) {
		var currencyCheck = /^\s*(?:[$]\s*)?0*(\d+)(?:[.]0*)?\s*$/;
		if (currencyCheck.test (formObject.amount.value)) {
			formObject.amount.value =
			formObject.amount.value.replace (currencyCheck, "$1");
		} else {
			canSubmit = false;
			currencyCheck = /^\s*(?:[$]\s*)?0*(\d+)[.]\d+\s*$/;
			if (currencyCheck.test (formObject.amount.value)) {
				alert(ess.messages.giftCardAmountNotAWholeNumber);
			} else {
				alert(ess.messages.invalidGiftCardAmount);
			}
			formObject.amount.focus();
		}

		if (canSubmit && formObject.amount.value < 5) {
			canSubmit = false;
			alert(ess.messages.giftCardAmountBelowMinimum);
		}

		if (canSubmit && formObject.amount.value > 10000) {
			canSubmit = false;
			alert(ess.messages.giftCardAmountAboveMaximum);
		}
	}

	if (canSubmit && formObject.from && formObject.from.value == "") {
		canSubmit = false;
		alert(ess.messages.validateName);
		formObject.from.focus();
	}

        return canSubmit;
}

/*
 * This plugin provides an Ajax.Request.abort() function to
 * kill a currently executing AJAX call.  It also implements
 * jQuery's $.ajax() function at a VERY MINIMUM level, allowing
 * Prototype and jQuery to be used interchangably in
 * tbl.btlcontroller.js.
 */

/**
 * PUBLIC:
 * Aborts a currently executing AJAX call.  Fires no events.
 */
Ajax.Request.prototype.abort = function() {
	// Block event listener calls
	this.transport.onreadystatechange = Prototype.emptyFunction;

	// Snoop the state and decrement the call counter if active
	if (this.transport.readyState && this.transport.readyState != 4)
		Ajax.activeRequestCount--;

	// Abort
	this.transport.abort();

	// Fire the onComplete event
	if (this.options.onComplete)
		this.options.onComplete(this.transport, this.transport.responseText);
}

/**
 * PUBLIC:
 * Executes an AJAX call using jQuery syntax.  Note that this is
 * not a full implementation of the syntax, and only contains the
 * options required by tbl.btlcontroller.js.
 *
 * @see http://docs.jquery.com/Ajax/jQuery.ajax
 * @param options A javascript object containing the settings for
 * 		this call.
 * @return a Prototype Ajax.Request object.
 */
$.ajax = function(options) {
	return new Ajax.Request(options.url, {
		method: (options.type ? options.type : 'get'),
		parameters: (options.data ? options.data : { }),
		evalJSON: (options.dataType ? options.dataType == 'json' : false),
		onFailure: (options.error ? function(transport) {
			options.error(transport, transport.statusText, transport.status);
		} : undefined),
		onSuccess: (options.success ? function(transport, data) {
			var json = false;
			if (!data && options.dataType == 'json' && transport.responseText) {
				try {
					eval('json = ' + transport.responseText);
				}
				catch (e) {
					json = false;
				}
			}
			options.success((data ? data : (json ? json : transport.responseText)), transport.statusText);
		} : undefined),
		onComplete: (options.complete ? function(transport, data) {
			options.complete(transport, data);
		} : undefined)
	});
}

// JavaScript Document
if (Object.isUndefined(store))
	var store = {};
	
// This is to ensure that helpdesk links open in a new window on each click regardless of if the user doesn't close the first window
var helpdeskCount = 0;

store.popup = {};

store.popup.height = 630;
store.popup.width = 530;

store.popup.standard = "width=" + store.popup.width + ",height=" + store.popup.height
	+ ",toolbar=no,status=no,menubar=no";
store.popup.helpDesk = function(url) {
	helpdeskCount += 1;
	var helpdeskName = "helpdesk" + helpdeskCount;
	window.open(url, helpdeskName, store.popup.standard + ",scrollbars=yes,resizable=yes");
};
store.popup.promo = function(url) {
	window.open(url, "promo", "width=480,height=350,left=380,top=160,toolbar=no,status=no,menubar=no,resizable=no,scrollbars=yes");
};
store.popup.emailFriend = function(productId) {		//Gets productID from HTML button's name attribute.
	window.open("/emailAProduct/index.jsp?id="+productId, "emailFriend", store.popup.standard + ",scrollbars=no,resizable=yes");
};
store.popup.customemailFriend = function (productId, recipe) {
            window.open("/emailAProduct/index.jsp?id="+productId+"&recipe="+recipe+"", "emailFriend", store.popup.standard + ",scrollbars=no,resizable=yes");
};
store.popup.emailSignup = function(url) {
	window.open(url, "emailFriend", store.popup.standard + ",scrollbars=no,resizable=yes");
};
store.popup.sizeChart = function(url) {
	window.open(url, "sizeChart", "width=640,height=555,left=380,top=160,toolbar=no,status=no,menubar=no,scrollbars=no,resizable=no");
};
store.popup.giftCert = function(url) {
	window.open(url, "giftCert", store.popup.standard + ",directories=no,location=no,resizable=no,scrollbars=yes,left=((screen.width- 500)/2),top=((screen.height - 500)/2)");
};
store.popup.largeImage = function(url) {
	window.open(url, "largeImage", "width=630,height=750,scrollbars=yes,left=((screen.width- 500)/2),top=((screen.height - 500)/2)");
};
store.popup.webCollage = function(url) {
	window.open(url, "webCollage", "width=630,height=545,scrollbars=yes");
};

store.popup.chkBalance = function(url) {
    //window.open( url, "giftCard-lightbox", store.popup.standard + ",scrollbars=no,resizable=yes, width=550,height=auto" );
};
store.popup.resize = function() {
	// default values are for firefox
	var width = store.popup.width;
	var height = store.popup.height;
	if (Prototype.Browser.IE) {
		width += 21;
	}
	if (Prototype.Browser.WebKit) {
		width -= 8;
	}
	window.resizeTo(width, height);
};

/**
 * Transforms links that have a rel attribute to JavaScript links. This is done
 * so that people with JavaScript off will still be able to use links.
 */
store.popup.transform = function() {
	// select all links whose rel attribute contains "popup"
	var links = $$("a[href*=popup]");
	for (var i = 0; i < links.length; i++) {
		var link = links[i];
		link.oldHref = link.href;
		if (link.href.indexOf("helpdesk") >= 0) {
			link.observe("click", function(e) {
				e.preventDefault();
				store.popup.helpDesk(this.oldHref);
			});
			link.href = "javascript:void(0);";
		}
		if (link.href.indexOf("promo") >= 0) {
			link.observe("click", function(e) {
				e.preventDefault();
				store.popup.promo(this.oldHref);
			});
			link.href = "javascript:void(0);";
		}
		if (link.href.indexOf("email") >= 0) {
			link.observe("click", function(e) {
				e.preventDefault();
				store.popup.emailFriend(this.oldHref);
			});
			link.href = "javascript:void(0);";
		}
		if (link.href.indexOf("sizechart") >= 0) {
			link.observe("click", function(e) {
				e.preventDefault();
				store.popup.sizeChart(this.oldHref);
			});
			link.href = "javascript:void(0);";
		}
		if (link.href.indexOf("signup") >= 0) {
			link.observe("click", function(e) {
				e.preventDefault();
				store.popup.emailSignup(this.oldHref);
			});
			link.href = "javascript:void(0);";
		}
		if (link.href.indexOf("web-collage") >= 0) {
			link.observe("click", function(e) {
				e.preventDefault();
				store.popup.webCollage(this.oldHref);
			});
			link.href = "javascript:void(0);";
		}
	}
	
	links = $$("#shopFooter3 li:nth-child(3) a");	//Target third footer nav link "Check You Balance"
	//TODO: Better solution to work for instead of using for loop for gettin only one element.
	
	for (var i = 0; i < links.length; i++){
		var link = links[i];
		link.oldHref = link.href;
		if (link.href.indexOf("checkGCBalance") >= 0) {
			link.observe("click", function(e){
				e.preventDefault();
				//store.popup.chkBalance(this.oldHref);
				modal.open( {
					url: '/checkout/checkGCBalance.jsp',
					closeButton: 'withScroll',
					width: '570px',
					height: '465px',
					scrolling: 'yes'
				} );return false;
			});
		}
		link.href = "javascript:void(0);";			
	}
};

$(document).observe("dom:loaded", function(e) {
	store.popup.transform();
	if($("email-a-friend")){ //always always always! wrap listeners in an if statement.
		$("email-a-friend").observe("click", function(){store.popup.emailFriend($("email-a-friend").name)
			Df.AnalyticsLibrary.EmailAProduct();
		});
	}
});

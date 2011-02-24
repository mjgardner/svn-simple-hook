$(document).observe('dom:loaded', function(e){

    /*
	 * Hover behavior initialization.
	 * @requires tbl.category.hover-behavior.js
	 */
    new ProductHover().init();
	
	/* 
	 * Express shop and mini cart initialization
	 * @requires esmc.includes.templates.jspf
	 */
	//window.mc = new Store.miniCart();
	//window.es = new Store.expressShop($(document.body).e('div', 'bottom', {id:'ins1'}).addClassName('express-shop').hide());
     
	/*
	 * More colors drawer
	 * @requires tbl.colordrawer.js
	 */
	var colorDrawer = new ColorDrawer();
	colorDrawer.setEvents();
	
	/*
	 * Sort by
	 */
	$$("#sort select").each(function(v){
		v.observe('change', function(e) {
			// get the current URL
			if (this.value == "") {
			    return;
			}
			var sParam = this.value;
			var url = window.location.toString(); //get the parameters
			url.match(/\?(.+)$/);
			var base = url.substring(0,url.indexOf("?")+1);
			var params = RegExp.$1;
			// split up the query string and store in an
			// associative array
			var params = params.split("&");
			var queryStringList = {};
			var first = true;
			for(var i=0;i<params.length;i++) {
				var tmp = params[i].split("=");
				if(tmp[0]!="sort" && tmp[0]!="page") {
					if(!first) {
						base = base + "&";
					}
					base = base + params[i];
					first=false;
				}
			}

			base = base + "&sort=" + sParam;
			window.location.href = base;
		});
	});
});

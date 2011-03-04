$(document).observe('dom:loaded', function(e) {
    $$(".product-search select").each(function(v) {
        v.observe('change', function(e) {
            // get the current URL
            if (this.value == "") {
                return;
            }
            var sParam = this.value;
            var url = window.location.toString(); //get the parameters
            url.match(/\?(.+)$/);
            var base = url.substring(0, url.indexOf("?") + 1);
            var params = RegExp.$1;
            // split up the query string and store in an
            // associative array
            var params = params.split("&");
            var queryStringList = {};
            var first = true;
            for (var i = 0; i < params.length; i++) {
                var tmp = params[i].split("=");
                if (tmp[0] != "sort" && tmp[0] != "page") {
                    if (!first) {
                        base = base + "&";
                    }
                    base = base + params[i];
                    first = false;
                }
            }

            base = base + "&sort=" + sParam;
            window.location.href = base;
        });
    });
	
});

function getObjectsByName(tag, name) {
    var tags = document.getElementsByTagName(tag);
    var obj = new Array();
    if (tags != null) {
        for (var i = 0, n = tags.length; i < n; i++) {
            if (tags[i].getAttribute("id") == name) {
                obj.push(tags[i]);
            }
        }
    }
    return obj;
}

function getObjectsByClass(tag, name) {
    var tags = document.getElementsByTagName(tag);
    var obj = new Array();
    if (tags != null) {
        for (var i = 0, n = tags.length; i < n; i++) {
            if (tags[i].getAttribute("class") == name) {
                obj.push(tags[i]);
            }
        }
    }
    return obj;
}

function showFlyout(target){
	var targetDiv = getObjectsByName("div", 'more_'+target);
	var clickedTag = getObjectsByName("a", 'more_'+target);
	var hideTag = getObjectsByName('a', 'less_'+target);

	var hideAll = getObjectsByClass('div', 'flyout-wrap');
	var toggleLess = getObjectsByClass('a', 'lessSearch');
	var toggleMore = getObjectsByClass('a', 'moreSearch');

/*	for (var i = 0, nn = hideAll.length; i < nn; i++) {
		hideAll[i].style.display = 'none';
	}
	for (var a = 0, bb = toggleLess.length; a < bb; a++) {
		toggleLess[a].style.display = 'none';
	}
	for (var c = 0, dd = toggleMore.length; c < dd; c++) {
		toggleMore[c].style.display = 'block';
	} */

	
	if (targetDiv != null){
	var offsetHeight = clickedTag[0].parentNode.parentNode.offsetTop;
		targetDiv[0].style.display = 'block';
		targetDiv[0].style.top = offsetHeight+'px';

		clickedTag[0].style.display = 'none';
		hideTag[0].style.display = 'block';
	}

}

function hideFlyout(target){
	var targetDiv = getObjectsByName("div", 'more_'+target);
	var clickedTag = getObjectsByName("a", 'more_'+target);
	var hideTag = getObjectsByName('a', 'less_'+target);
	if (targetDiv != null){
	var offsetHeight = clickedTag[0].parentNode.parentNode.offsetTop;
		targetDiv[0].style.display = 'none';
		clickedTag[0].style.display = 'block';
		hideTag[0].style.display = 'none';
	}

}

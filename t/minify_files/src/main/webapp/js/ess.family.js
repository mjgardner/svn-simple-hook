$(document).observe('dom:loaded', function(e){

    if ($(document.body).hasClassName('family-category')) {
        /*
         * Hover behavior initialization.
         * @requires peac.category.hover-behavior.js
         */
        new ProductHover().init();

        /*
         * More colors drawer
         * @requires peac.colordrawer.js
         */
        var colorDrawer = new ColorDrawer();
        colorDrawer.setEvents();

        /*
         * Sort by
         */
        if ($('sort')) {
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
        }
    }
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

function showMoreParametricValues(attrib) {
    document.getElementById("more_" + attrib).style.display = "none";
    var moreContent = $$('.moreContent_' + attrib);
    if (moreContent != null) {
        for (var i = 0; i < moreContent.length; i++) {
            moreContent[i].style.display = "block";
        }
    }
}

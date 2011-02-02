//Must figure some way to do this right on Safari 3...
document.supportsFont = function(fontName) {
	if (fontName == 'Times New Roman') return true;
	var 
		chars=[
			'abcdefghijklmnopqrstuvwxyz',
			'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
			'0123456789',
			'<>?:"{}|~!@#$%^&*()_+,./;\'[]\\'
		],
		css = {
			visibility: 'visible',
			position: 'absolute',
			top: '0',
			left: '0',
			fontSize: '72px',
			whiteSpace: 'nowrap'
		},
		element = document.createElement('div'),
		i, width, height, prop, same=true;
	for (prop in css) element.style[prop]=css[prop];
	document.body.appendChild(element);
	
	for (i=0; i<chars.length; i++) {
		element.innerHTML = chars[i];
		element.style.fontFamily='__FAKEFONT__';
		width = element.offsetWidth;
		height = element.offsetHeight;
		element.style.fontFamily=fontName;
		same = same &&
			(width == element.offsetWidth) &&
			(height == element.offsetHeight);
	}
	document.body.removeChild(element);
	return !same;
}
document.applyFont = function (tagName, face) {
    //Firefox 3.0 doesn't support Cufon text color change after page load.
    //Therefore, for Firefox < 3.5 set category titles to special class in order to assign special default color
    //This way the category titles show against both black masthead and white dropdown
    if (/Firefox[\/\s](\d+\.\d+)/.test(navigator.userAgent)) {
         var ffversion=new Number(RegExp.$1)
         if (ffversion<3.5) {
            var aCatalogTitles = $$('li.main-nav > a');
            for (var i = 0; i < aCatalogTitles.length; i++) {
                aCatalogTitles[i].addClassName('ff3-cufon-color')
            }
        }
    }
    document.registerCufonFonts();
    Cufon.replace(tagName, { fontFamily: face });
}

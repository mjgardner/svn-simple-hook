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
	if (!document.supportsFont(face))
		Cufon.replace(tagName, { fontFamily: face });	
}

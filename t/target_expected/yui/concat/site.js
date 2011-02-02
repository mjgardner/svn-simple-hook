/*
 -ref		Prototype
 -type		Static Class
 -note		Prototype Namespace
 -returns	Object
*/
/*
 -ref		Prototype.Browser
 -extends	Prototype
 -type		Static Class
 -note		Browser Detection
 -returns	Object
*/
/*
 -ref		Prototype.Browser.ie6
 -type		Static Parameter
 -returns	Boolean
 -example	<script type="text/javascript">
			if(Prototype.Browser.ie6 ){
				alert('hack away');
			}
		</script>
*/
/*
 -ref		Prototype.Browser.ie7
 -type		Static Parameter
 -returns	Boolean
 -example	<script type="text/javascript">
			if(Prototype.Browser.ie7 ){
				alert('hack away');
			}
		</script>
*/
Object.extend(Prototype.Browser, {
	ie6: navigator.userAgent.toLowerCase().indexOf("msie 6") > -1,
	ie7: navigator.userAgent.toLowerCase().indexOf("msie 7") > -1
});

/*
 -ref		Df
 -note		Base Static Class or Namespace for the API
 -returns	Object
 -type		Static Class
*/
var Df = {}

/*
 -ref		Df.version
 -note		version of the API
 -type		Static Parameter
 -returns	String
 -example	<script type="text/javascript">
			alert(Df.VERSION)
		</script>
*/
Df.version = "1.4.0";

/*
 -ref		Df.classPath
 -returns	String
 -note		location where importModule looks for files
 -type		Static Parameter
 -example	<script type="text/javascript">
			Df.classPath = '/js/df/';
		</script>
*/
Df.classPath = '../js/df/';

Df.debug = {
	clock: function(){},
	log: function(){}
}

/*
 -ref           Object
 -type          Class
 -returns       Object
 -note          Javascript native object
*/
/*
 -ref		Object.toArray
 -type		Static Method
 -returns	Array
 -note		returns an array of anything sent to it
 -example	<script type="text/javascript">
			Object.toArray(1, 2, 3)
			//[1,2,3]

			Object.toArray()
			//[]

			Object.toArray([1,2,3])
			//[1,2,3]
		</script>
*/
Object.toArray = function() {
    if($A(arguments).length == 0){
	return []
    } else if($A(arguments).length == 1 && Object.isArray($A(arguments)[0])) {
        return $(arguments)[0]
    } else if ($A(arguments).length == 1) {
	return [$(arguments)[0]]
    } else {
	return $A(arguments)
    }
}

/*
 -ref		Element
 -note		a prototype extended element.
 -note		Use $('xxx') syntax instead of new Element('xxx')
 -returns	Element
 -type		Class
 -arg		String|Object element
 -example	<script type="text/javascript">
			var y = $('xxx')
		</script>
*/
Element.addMethods({

	/*
	 -ref		Element.getPointerX
	 -type		Method
	 -note		gets the mouse X position relative to the element
	 -returns	Number
	 -example	<script type="text/javascript">
				$('element').getPointerX())
			</script>
	*/
	getPointerX: function(element, e) {
		var f = false;
		function isFixed(n){
		    if($(n).getStyle('position') == 'fixed'){
			f = true
		    }
		    if(!f && $(n).up() && $(n).up().tagName.toLowerCase() != 'body'){
			isFixed($(n).up())
		    }
		}
		isFixed(element)
		var o = 0
		if(f){
		    o = document.viewport.getScrollOffsets().left
		}
		return Event.pointerX(e) - o - $(element).cumulativeOffset().left
	},

	/*
	 -ref		Element.getPointerY
	 -type		Method
	 -note		gets the mouse Y position relative to the element
	 -returns	Number
	 -example	<script type="text/javascript">
				$('element').getPointerY())
			</script>
	*/
	getPointerY: function(element, e) {
		var f = false;
		function isFixed(n){
		    if($(n).getStyle('position') == 'fixed'){
			f = true
		    }
		    if(!f && $(n).up() && $(n).up().tagName.toLowerCase() != 'body'){
			isFixed($(n).up())
		    }
		}
		isFixed(element)
		var o = 0
		if(f){
		    o = document.viewport.getScrollOffsets().top
		}
		return Event.pointerY(e) - o - $(element).cumulativeOffset().top
	},

	/*
	 -ref		Element.e
	 -note		creates a new element and inserts it relative to the Element instance
	 -note		returns the newly created element
	 -returns	Element
	 -type		Method
	 -arg		tag String
	 -arg		position String options are before, after, top, bottom
	 -arg		pars Object element attributes to add to element
	 -example	<script type="text/javascript">
				$('xxx').e('div', 'bottom')
			</script>
	*/
	e: function (element, tag, position, pars) {
	    //position : before, after, top, bottom
	    element = $(element)
	    var obj = $(document.createElement(tag))
	    if (pars) Object.extend(obj, pars)

	    if (Object.isUndefined(position)) {
		element.insert(obj);
	    }
	    else {
		var pos = {}
		pos[position] = obj
		element.insert(pos)
	    }
	    return obj;
	},

	/*
	 -ref		Element.setAttributes
	 -note		adds attributes to an element
	 -returns	Element
	 -type		Method
	 -arg		pars Object element attributes to add to element
	 -example	<script type="text/javascript">
				$('xxx').setAttributes({id:'test', className:'testClass'})
			</script>
	*/
	setAttributes: function(element, pars){
	    element = $(element)
	    Object.extend(element, pars)
	    return element
	},

	/*
	 -ref		Element.animate
	 -note		Shortcut for creating and running an animation object on an extended element
	 -returns	Df.Animate
	 -delegate	Df.Animate
	 -type		Method
	 -arg		Object pars
	 -example	<script type="text/javascript">
				$('xxx').animate({
					opacity: 0.5,
					height: 50
				});
			</script>
	*/
	animate: function(element,pars){
		return new Df.Animate($(element)).run(pars);
	},

	/*
	 -ref		Element.toggleAnimation
	 -note		Shortcut for creating and setting an animation object with toggle event listeners on an extended element
	 -returns	Df.Animate
	 -delegate	Df.Animate.toggleBy
	 -type		Method
	 -arg		String action choices are click and hover
	 -arg		Object pars
	 -example	<script type="text/javascript">
				$('xxx').toggleAnimation('click', {
					opacity: 0.5,
					height: 50
				});
			</script>
	*/
	toggleAnimation: function(element, action, pars){
		return Df.Animate.toggleBy( $(element) , action , pars )
	},

	/*
	 -ref		Element.dragable
	 -note		Shortcut for creating and setting a drag object on an extended element
	 -returns	Df.Drag
	 -delegate	Df.Drag
	 -type		Method
	 -arg		Object pars
	 -example	<script type="text/javascript">
				$('xxx').drag();
			</script>
	*/
	dragable: function(element,pars){
		return new Df.Drag($(element), pars).enable();
	},

	/*
	 -ref		Element.resizable
	 -note		Shortcut for creating and setting a resize object on an extended element
	 -returns	Df.Resize
	 -delegate	Df.Resize
	 -type		Method
	 -arg		Object pars
	 -example	<script type="text/javascript">
				$('xxx').resize();
			</script>
	*/
	resizable: function(element,pars){
		return new Df.Resize($(element), pars).enable();
	},

	/*
	 -ref		Element.ui
	 -note		Shortcut for creating and setting a Df.Ui object on an extended element
	 -returns	Df.Ui
	 -delegate	Df.Ui
	 -type		Method
	 -arg		Object pars
	 -example	<script type="text/javascript">
				$('xxx').ui({
					animate: {
						width: 600
					},
					drag: {}
				});
			</script>
	*/
	ui: function(element,pars){
		new Df.Ui($(element), pars);
	},

	/*
	 -ref		Element.createNS
	 -note		Shortcut for creating a namespace object
	 -returns	Object
	 -delegate	Df.Namespace.create
	 -type		Method
	 -arg		String namespace
	 -example	<script type="text/javascript">
				$('xxx').createNS('xxx.yyy.zzz')
			</script>
	*/
	createNS: function(element,namespace){
		return Df.Namespace.create(namespace,$(element));
	},

	/*
	 -ref		Element.center
	 -note		Centers the element relative to its parent.
	 -returns	Element
	 -type		Method
	 -hint		Element must be positioned Absolute
	 -hint		Parent must be positioned Absolute or Relative
	 -example	<script type="text/javascript">
				$('xxx').center()
			</script>
	*/
	center: function(element){
	    element = $(element)
	    var holder = element.up()
	    var hHeight
	    var hWidth
	    if (holder == document.body) {
		hHeight = document.viewport.getHeight()
		hWidth = document.viewport.getWidth()
	    } else {
		hHeight = holder.getHeight()
		hWidth = holder.getWidth()
	    }
	    var top = (hHeight - element.getHeight()) / 2
	    var left = (hWidth - element.getWidth()) / 2

	    if(element.getStyle('position') != 'fixed' && holder == document.body){
		var offsets = document.viewport.getScrollOffsets()
		top += offsets.top
		left += offsets.left
	    }
	    return element.setStyle({
		left : parseInt(left) + 'px',
		top : parseInt(top) + 'px'
	    })
	},
	
	toViewPort: function(element){
		element = $(element)
		
		var d = document.viewport.getDimensions()
		var o = document.viewport.getScrollOffsets()
		
		var h = element.getHeight()
		var w = element.getWidth()
		
		var t = parseInt(element.getStyle("top"))
		var l = parseInt(element.getStyle("left"))
		
		var maxT = o.top + d.height - h
		var maxL = o.left + d.width - w
		
		if(l > maxL || l < minL){
			element.setStyle({left:+ l.toRange(minL, maxL) +'px'})
		}
		
		if(t > maxT || t < minT){
			element.setStyle({top:+ t.toRange(minT, maxT) +'px'})
		}
		
		return element
	},

	/*
	 -ref		Element.distributeChildElements
	 -returns	Element
	 -type		Method
	 -example	<script type="text/javascript">
				$('xxx').distributeChildElements(3, {minimumChildren: 20})
			</script>
	*/
	distributeChildElements: function(element, groups, options){
		var tag = element.down().tagName
		var nodes = element.down().childElements()
		if(options && options.minimumChildren && nodes.length < options.minimumChildren){
		} else {
			nodes = $A(nodes).distributeEvenly(groups)
			nodes.each(function(v){
				var node = Df.e(tag)
				v.each(function(vv){
					node.insert(vv)
				})
				element.insert(node)
			})
			element.down().remove()
		}

		return element
	},

	/*
	 -ref		Element.chunkChildElements
	 -returns	Element
	 -type		Method
	 -example	<script type="text/javascript">
				$('xxx').chunkChildElements(3, {minimumChildren: 20})
			</script>
	*/
	chunkChildElements: function(element, size, options){
		var tag = element.down().tagName
		var nodes = element.down().childElements()
		if(options && options.minimumChildren && nodes.length < options.minimumChildren){
		} else {
			nodes = $A(nodes).eachSlice(size)
			nodes.each(function(v){
				var node = Df.e(tag)
				v.each(function(vv){
					node.insert(vv)
				})
				element.insert(node)
			})
			element.down().remove()
		}

		return element
	}
});

/*
 -ref		String
 -returns	String
 -type		Class
 -arg		String string
*/
Object.extend(String.prototype,{

	/*
	 -ref		String.uId
	 -note		Created a Unique string based on a timestamp and random number
	 -returns	String
	 -type		Method
	 -example	<script type="text/javascript">
				var xxx = ''.uId()
			</script>
	*/
	uId: function(){
		return this + "u" + new Date().getTime() + parseInt(10000*Math.random());
	},

	/*
	 -ref		String.exe
	 -note		Evaluates a String using eval
	 -note		Wraps the string in an array and returns the zero index
	 -returns	Object
	 -type		Method
	 -example	<script type="text/javascript">
				var xxx = '{"a":"b"}'.exe()
			</script>
	*/
	exe: function(){
		return(eval('[' + this + ']')[0]);
	},

	/*
	 -ref		String.capFirstChar
	 -note		Capitalizes the first character of a string
	 -returns	String
	 -type		Method
	 -example	<script type="text/javascript">
				var xxx = 'test'.capFirstChar()
				//Test
			</script>
	*/
	capFirstChar: function(){
	    return this.charAt(0).toUpperCase() + this.substring(1, this.length)
	},

	/*
	 -ref		String.hexToRGB
	 -note		parses a hex string into an rgb array
	 -returns	Array
	 -type		Method
	 -example	<script type="text/javascript">
				var xxx = "#FFFF00".hexToRGB()
				//[256, 256, 0]
			</script>
	*/
	hexToRGB: function() {
	    var hexColor, red, green, blue;
	    hexColor = this.cssToHex()
	    if (hexColor) {
		red = parseInt(hexColor.slice(1, 3), 16);
		green = parseInt(hexColor.slice(3, 5), 16);
		blue = parseInt(hexColor.slice(5, 7), 16);
		return [red,green,blue]
	    }
	    return undefined
	},

	/*
	 -ref		String.cssToHex
	 -note		parses a properly formatted 6-digit hex color spec from hex or rgb string
	 -returns	String
	 -type		Method
	 -example	<script type="text/javascript">
				var xxx = "rgb(256,256,0)".cssToHex()
				//#FFFF00
			</script>
	*/
	cssToHex: function() {
	    var color = '#'
	    var rgbRe = /^rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i.exec(this)
	    var hexRe = /^\#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.exec(this)

	    if(rgbRe) {
		var part;
		for (var i=1; i<=3; i++) {
		    part = Math.max(0, Math.min(255, parseInt(rgbRe[i])));
		    color += (part.toColorPart());
		}
		return color;
	    }
	    else if (hexRe) {
		if(hexRe[1].length == 3) {
		    for (var i=0; i<3; i++) {
			color += hexRe[1].charAt(i) + hexRe[1].charAt(i);
		    }
		    return color;
		}
		return color += hexRe[1];
	    }
	    return false;
	}

});

/*
 -ref		Array
 -returns	Array
 -type		Class
*/
Object.extend(Array.prototype,{
	
	
	_each: function(iterator){
	    var n = this.length;
	    var l = n
	    while (l--) {
		iterator(this[n - l - 1])
	    }
	},
        

	/*
	 -ref		Array.distributeEvenly
	 -note		distributes elements of an array into a multi-dimetional array as evenly as posible based on a set amount of groups
	 -returns	Array
	 -type		Method
	 -example	<script type="text/javascript">
				var nodes = nodes.distributeEvenly(4)
			</script>
	*/
	distributeEvenly: function(groups){
		var a = []
		var s = Math.floor(this.length / groups)
		new Number(groups).times(function(n){
			a.push(s)
		})
		var r = this.length % groups
		while (r) {
			a[r-1]++
			r--
		}
		for(var i=0; i<a.length; i++){
			a[i] = this.splice(0, a[i])
		}

		return a
	},

	/*
	 -ref		Array.sum
	 -note		sums elements in an array
	 -returns	Number
	 -type		Method
	 -example	<script type="text/javascript">
				var xxx = [2,4,5].sum()
			</script>
	*/
	sum:function(){
		var s = 0;
		for(var i=0; i<this.length; i++){
			s += this[i];
		}
		return s;
	},

	/*
	 -ref		Array.descend
	 -note		sorts elements in an array in desending order
	 -returns	Array
	 -type		Method
	*/
	descend: function(p){
		this.sort(function(a,b){
			if(p){
				a = a[p]
				b = b[p]
			}
			if(!parseInt(a)){
				a = String(a).toUpperCase()
			}
			if(!parseInt(b)){
				b = String(b).toUpperCase()
			}
			if (a > b) return -1;
			if (b > a) return 1;
			return 0;
		});
	},

	/*
	 -ref		Array.ascend
	 -note		sorts elements in an array in ascending order
	 -returns	Array
	 -type		Method
	*/
	ascend: function(p){
		this.sort(function(a,b){
			if(p){
				a = a[p]
				b = b[p]
			}
			if(!parseInt(a)){
				a = String(a).toUpperCase()
			}
			if(!parseInt(b)){
				b = String(b).toUpperCase()
			}

			if (a > b)return 1;
			if (b > a)return -1;
			return 0;
		});
	}
});

/*
 -ref		Number
 -returns	Number
 -type		Class
*/
Object.extend(Number.prototype, {

	/*
	 -ref		Number.suff
	 -note		returns the number given plus the suffix from that number as a string
	 -returns	String
	 -type		Method
	 -example	<script type="text/javascript">
				var xxx = 6.suff()
			</script>
	*/
	suff: function(){
		var str = this.toString()
		var count = parseInt(str.length -1)
		if(this == 0)return this
		if((str[count]>3 && str[count]<10) || str[count-1]==1 && count != 0 )return this + "th"
		if(str[count] == 1)return this + "st"
		if(str[count] == 2)return this + "nd"
		if(str[count] == 3)return this + "rd"
			return this + "th"
	},

	/*
	 -ref		Number.roundTo
	 -note		returns the number given plus the suffix from that number as a string
	 -note		provides a decimal places argument to prototypes round method
	 -override
	 -returns	String
	 -arg		Number places optional argument for the decimal places to round the number to
	 -type		Method
	 -example	<script type="text/javascript">
				var xxx = (6.4567).roundTo(2)
			</script>
	*/
	roundTo: function(places){
		if(places){
			return Math.round((this+1-1)*(Math.pow(10,places)))/Math.pow(10,places);
		} else {
			return Math.round()
		}
	},

	/*
	 -ref		Number.dollars
	 -note		returns the number given as an American Currency String
	 -returns	String
	 -type		Method
	 -example	<script type="text/javascript">
				var xxx = (6.4567).dollars()
			</script>
	*/
	dollars: function(){
		var num = this.roundTo(2)
		num = num.toString()
		var dec = num.indexOf(new String('.'))
		if(dec == -1){
			num = num.concat(new String('.00'))
		}else if(((num.length-1) - dec) == 1){
			num = num.concat(new String('0'))
		}
		return '$'+num
	},

	/*
	 -ref		Number.toRange
	 -note		returns the number if in the range given else return the min or max of the range
			depending on if the number is less then or greater then min and max of the range
	 -returns	Number
	 -type		Method
	 -arg		Number min the minimum number in the range
	 -arg		Number max the maximum number in the range
	 -example	<script type="text/javascript">
				var xxx = (6.4567).toRange(0,5)
				//returns xxx = 5
			</script>
	*/
	toRange: function(min, max){
		return new Number(this).toMin(min).toMax(max)
	},

	/*
	 -ref		Number.toMin
	 -note		returns the number if greater then min else return min
	 -returns	Number
	 -type		Method
	 -arg		Number min the minimum number
	 -example	<script type="text/javascript">
				var xxx = (6.4567).toMin(7)
				//returns xxx = 7
			</script>
	*/
	toMin: function(min){
		if(this >= min){
			return this
		} else {
			return min
		}
	},

	/*
	 -ref		Number.toMax
	 -note		returns the number if less then max else return min
	 -returns	Number
	 -type		Method
	 -arg		Number max the maximum number
	 -example	<script type="text/javascript">
				var xxx = (6.4567).toMax(5)
				//returns xxx = 5
			</script>
	*/
	toMax: function(max){
		if(this <= max){
			return this
		} else {
			return max
		}
	}
});

/*
 -ref		Df.importModule
 -note		load javascript files through inline as the page loads, n waits for n-1 to load
 -type		Static Method
 -arg		*String arguments the filename of the javascript file without the extention or path.
		Uses Df.ClassPath for the path. Multiple arguments allowed
 -example	<script type="text/javascript">
			Df.importModule("Df.Navigation", "Df.Tip" )
		</script>
*/
Df.importModule = function () {
	for (var i = 0; i < arguments.length; i++) {
		if(Df.Namespace.exists(arguments[i])){
		}else{
			document.write('<script type="text/javascript" src="' + Df.classPath + arguments[i] + '.js"></script>');
		}
	}
};

/*
 -ref		Df.loadJS
 -type		Static Method
 -arg		*String arguments the filename of the javascript file with the extention and path.
		Multiple arguments allowed
 -note		load javascript files through inline as the page loads, n waits for n-1 to load
 -example	<script type="text/javascript">
			Df.loadJS('/js/df/Df.Tip.js', '/js/df/Df.Navigation.js')
		</script>
*/
Df.loadJS = function () {
	for (var i = 0; i < arguments.length; i++) {
		document.write('<script type="text/javascript" src="'+ arguments[i] +'"></script>');
	}
};


/*
 -ref		Df.ImageCache
 -type		Class
 -returns	Df.ImageCache
 -note		Base class for preloading images and storing as a Hash
 -example	<script type="text/javascript">
			var ImageCache = new Df.ImageCache(
				"xxx","xxx","xxx"
			)
		</script>
 -example	<script type="text/javascript">
			var ImageCache = new Df.ImageCache().load(
				"xxx","xxx","xxx"

			)

			ImageCache.imageHash[escape('xxx')]
		</script>
*/
Df.ImageCache = Class.create({

	initialize: function(){

		/*
		 -ref		Df.ImageCache.imageHash
		 -type		Parameter
		 -arg		*String Images
		 -returns	Hash {escapedUrl: 'ImageObject'}
		 -note		Method for loading an array of images into the DOM
		 -example	<script type="text/javascript">
					var images = new Df.ImageCache(
						"xxx","yyy","zzz"
					)

					images.imageHash.get(escape('xxx'))
				</script>
		*/
		this.imageHash = $H();

		if(arguments && arguments.length > 0){
			this.load($A(arguments))
		}

		return this
	 },

	/*
	 -ref		Df.ImageCache.load
	 -type		Method
	 -arg		*String Images or Array
	 -returns	Df.ImageCache
	 -note		Method for loading images into the dom
	 -example	<script type="text/javascript">
				var ImageCache = new Df.ImageCache().load(
					"xxx","yyy","zzz"

				)
			</script>
	*/
	load: function(){
		var  ary = arguments[0]
		if(arguments.length > 1 || arguments[0].constructor == String){
			ary = $A(arguments)
		}

		for(var i=0; i < ary.length ; i++){
			var image = new Image()
			image.src = ary[i]
			this.imageHash.set([escape(ary[i])], image)
		}
		return this
	},

	/*
	 -ref		Df.ImageCache.get
	 -type		Method
	 -arg		*String Images
	 -returns	ImageObject
	 -note		Method for loading images into the dom
	 -example	<script type="text/javascript">
				var ImageCache = new Df.ImageCache().load(
					"xxx","yyy","zzz"

				)

				ImageCache.get('yyy')
			</script>
	*/
	get: function(url){
		return this.imageHash.get(escape(url))
	}
});

/*
 -ref		Df.e
 -note		creates an element
 -returns	Element
 -type		Method
 -arg		tag String the element to be created
 -arg		pars Object attributes to be applied
 -example	<script type="text/javascript">
			var xxx = Df.e('div',{className: 'testClass'})
		</script>
*/
Df.e = function (tag, pars) {
    var obj = $(document.createElement(tag))
    if (pars) Object.extend(obj, pars)
    return obj
}

/*
 -ref		Df.Namespace
 -returns	Object
 -note		This is the class to use to create or determine if a namespace exists
 -type		Static Class
*/
Df.Namespace = {
	_ary: null,
	_obj: null,
	_exists: false,

	/*
	 -ref		Df.Namespace.create
	 -note		create or retrieve a namespace
	 -note		returns last Object in the namespace string
	 -note		namespaces are created from blank objects if they don't already exist
	 -type		Static Method
	 -arg		String str the complete namespace as a string
	 -arg		Object scope the object to append the namespace objects to. This argument is
			optional. It defaults to window
	 -returns	Object
	 -example	<script type="text/javascript">
				var ns = Df.Namespace.create('Df.xxx.yyy.zzz', window)
			</script>
	 -example	<script type="text/javascript">
				var ns = Df.Namespace.create('Df.xxx.yyy.zzz', $('xxx'))
			</script>
	*/
	create: function (str, scope) {
		Df.Namespace._ary = str.split('.');

		if (!scope) {
		    scope = window;
		}

		if (!scope[Df.Namespace._ary[0]]) {
		    scope[Df.Namespace._ary[0]] = {};
		}

		Df.Namespace._obj = scope[Df.Namespace._ary[0]];

		if (Df.Namespace._ary[1]) {
		    Df.Namespace._next(1);
		}

		return Df.Namespace._obj;
	},

	/*
	 -ref		Df.Namespace.exists
	 -note		checks for the existance of a namespace
	 -type		Static Method
	 -returns	Boolean
	 -arg		String str the complete namespace as a string
	 -arg		Object scope of the namespace object. This argument is
			optional. It defaults to window
	 -example	<script type="text/javascript">
				if(Df.Namespace.exists('Df.xxx.yyy.zzz')
			</script>
	*/
	exists: function (str, scope) {
		Df.Namespace._ary = str.split('.');
		Df.Namespace._exists = false;

		if (!scope) {
		    scope = window;
		}

		if (!scope[Df.Namespace._ary[0]]) {
		    scope[Df.Namespace._ary[0]] = {};
		}

		Df.Namespace._obj = scope[Df.Namespace._ary[0]];

		if (Df.Namespace._ary[1]) {
		    Df.Namespace._exists = true;
		    Df.Namespace._checkNext(1);
		} else {
		    Df.Namespace._exists = false;
		}

		return Df.Namespace._exists;
	},

	_next: function (i) {
		if (!Df.Namespace._obj[Df.Namespace._ary[i]]) {
		    Df.Namespace._obj[Df.Namespace._ary[i]] = {};
		}

		Df.Namespace._obj = Df.Namespace._obj[Df.Namespace._ary[i]];

		if (Df.Namespace._ary[i + 1]) {
		    Df.Namespace._next(i + 1);
		}
	},

	_checkNext: function (i) {
		if (Df.Namespace._obj[Df.Namespace._ary[i]]) {
			Df.Namespace._obj = Df.Namespace._obj[Df.Namespace._ary[i]];
			if (Df.Namespace._ary[i + 1]) {
				Df.Namespace._checkNext(i + 1);
			} else {
				Df.Namespace._exists = true;
			}
		} else {
			Df.Namespace._exists = false;
		}
	}
}
/*
 -ref		Df.Event
 -note		this is a mixin for enableing custom events to objects
 -returns	Object
 -type		Static Class
*/
Df.Event = {
	/*
	 -ref		Df.Event.registerEvent
	 -note		registers a new event type.
	 -returns	Df.Event
	 -type		Method
	 -arg		*String name the name of the custom event
	 -example	<script type="text/javascript">
				var e = new Df.Base().registerEvent(':set', ':get', ':delete')
			</script>
	*/
	registerEvent: function () {
		Df.Namespace.create('events', this)

		for (var i = 0; i < arguments.length; i++ ) {
			this.events[arguments[i]] = [];
			this.events[arguments[i]].before = [];
			this.events[arguments[i]].after = [];
		}
		return this;
	},

	/*
	 -ref		Df.Event.unregisterEvent
	 -note		unregisters a new event type.
	 -note		this will also remove all observers
	 -returns	Df.Event
	 -type		Method
	 -arg		*String name the name of the custom event
	 -example	<script type="text/javascript">
				var e = new Df.Base().unregisterEvent(':set', ':get', ':delete')
			</script>
	*/
	unregisterEvent: function () {
		Df.Namespace.create('events', this)

		for (var i = 0; i < arguments.length; i++ ) {
			if (this.events[arguments[i]]) {
				delete this.events[arguments[i]];
			}
		}
		return this;
	},

	/*
	 -ref		Df.Event.observe
	 -note		registers observer functions on an event type.
	 -note		the event types are scoped to the object that initialized the event object
	 -returns	Df.Event
	 -type		Method
	 -arg		String onx the name of the custom event to listen for
	 -arg		Function fn the function that runs on dispatch of the event
	 -example	<script type="text/javascript">
				var e = new Df.Base().register(':set', ':get', ':delete')

				e.observe(':set', function(e){
					alert(e.memo)
				})
			</script>
	 -example	<script type="text/javascript">
				var event = new Df.Base().register(':set', ':get', ':delete')

				var Df.Test = class.Create({
					initialize: function(){
						event.observe(':set', this.meth1.bind(this))
					},

					meth1: function(e){
						alert(e.memo)
						alert(this)
					}
				});

			</script>
	*/
	observe: function (onx, fn) {
		Df.Namespace.create('events', this)
		if (Object.isUndefined(this.events[onx]))
			this.registerEvent(onx);
		this.events[onx].push(fn);
		return this;
	},

	observeBefore: function (onx, fn) {
		Df.Namespace.create('events', this)
		if (Object.isUndefined(this.events[onx]))
			this.registerEvent(onx);
		this.events[onx].before.push(fn);
		return this;
	},

	observeAfter: function (onx, fn) {
		Df.Namespace.create('events', this)
		if (Object.isUndefined(this.events[onx]))
			this.registerEvent(onx);
		this.events[onx].after.push(fn);
		return this;
	},

	/*
	 -ref		Df.Event.stopObserving
	 -note		unregisters observer functions on an event type.
	 -note		the event types are scoped to the object that initialized the event object
	 -note		parameter references to binded functions make unobserving posiable
	 -returns	Df.Event
	 -type		Method
	 -arg		String onx the name of the custom event
	 -arg		Function fn the function that is to be removed
	 -example	<script type="text/javascript">
				var event = new Df.Base().register(':set', ':get', ':delete')

				var Df.Test = class.Create({
					initialize: function(){
						this._meth1 = this.meth1.bind(this)

						event.observe(':set', this._meth1)

						event.stopObserving(':set', this._meth1)
					},

					meth1: function(e){
						alert(e.memo)
						alert(this)
					}
				});

			</script>
	*/
	stopObserving: function (onx ,fn) {
		Df.Namespace.create('events', this)
		for (var i = 0; i < this.events[onx].length; i += 1) {
			if (this.events[onx][i] === fn) {
				this.events[onx].splice(i, 1);
			}
		}
		return this;
	},

	stopObservingBefore: function (onx ,fn) {
		Df.Namespace.create('events', this)
		for (var i = 0; i < this.events[onx].before.length; i += 1) {
			if (this.events[onx].before[i] === fn) {
				this.events[onx].before.splice(i, 1);
			}
		}
		return this;
	},

	stopObservingAfter: function (onx ,fn) {
		Df.Namespace.create('events', this)
		for (var i = 0; i < this.events[onx].after.length; i += 1) {
			if (this.events[onx].after[i] === fn) {
				this.events[onx].after.splice(i, 1);
			}
		}
		return this;
	},

	/*
	 -ref		Df.Event.fire
	 -note		fires custom events.
	 -returns	Df.Event
	 -type		Method
	 -arg		String onx the name of the custom event
	 -arg		Object memo object to send to the listener functions
	 -example	<script type="text/javascript">
				var event = new Df.Base().register(':set', ':get', ':delete')

				var Df.Test = class.Create({
					initialize: function(){
						this._meth1 = this.meth1.bind(this)
						event.observe(':set', this._meth1)
					},

					meth1: function(e){
						alert(e.memo)
						alert(this)
					}
				});

				var test = new Df.Test()

				event.fire(':set')

			</script>
	*/
	fire: function (onx, memo) {
		Df.Namespace.create('events', this)

		if(this.events[onx]){
			var r

			for (var i = 0; i < this.events[onx].before.length; i++) {
				r = this.events[onx].before[i]({target: this, memo: memo});
				if (r && r.memo)
					memo = r.memo
				else if (r === false){
					return this
				}
			}

			for (var i = 0; i < this.events[onx].length; i++) {
				r = this.events[onx][i]({target: this, memo: memo});
				if (r && r.memo)
					memo = r.memo
				else if (r === false){
					return this
				}
			}


			for (var i = 0; i < this.events[onx].after.length; i++) {
				r = this.events[onx].after[i]({target: this, memo: memo});
				if (r && r.memo)
					memo = r.memo
				else if (r === false){
					return this
				}
			}
		}
		return this;
	}

}

/*
 -ref		Df.Base
 -note		Creates a custom event Object and parameters
 -note		Intended to by used on non dom based objects
 -returns	Df.Base
 -extends	Df.Event
 -type		Class
 -example	<script type="text/javascript">
			var e = new Df.Base()
		</script>
*/
Df.Base = Class.create(Df.Event, {
	initialize: function(pars) {

		/*
		 -ref		Df.Base.instances
		 -type		Static Method
		 -returns	Array
		 -note		returns an array of all class instances of Class Type
		 -example	<script type="text/javascript">
					if(Df.Base.instances){
						Df.Base.instances.each(function(v){
							alert(v.constructor)
						})
					}
				</script>
		*/
		this._addThisInstance()
		this._initPars(pars)
		this._setup()

		return this;
	},

	_setup: function(){

	},

	/*
	 -ref		Df.Base.setPars
	 -note		Overrides and or adds parameters to the parameters object
	 -type		Method
	 -returns	Df.Base
	 -arg		Object pars the parameters object
	 -example	<script type="text/javascript">
				var base = new Df.Base().setPars({xxx:"yyy"})
			</script>
	*/
	setPars: function(pars){
		Df.Namespace.create('pars', this)
		if(pars){
			Object.extend( this.pars, pars);
		}
		return this;
	},

	/*
	 -ref		Df.Base.getInstances
	 -type		Static Method
	 -returns	Array
	 -note		returns an array of all class instances of Class Type
	 -example	<script type="text/javascript">
			    if(Df.Base.getInstances()){
				    Df.Base.getInstances().each(function(v){
					    alert(v.constructor)
				    })
			    }
			</script>
	*/
	_addThisInstance: function(){
	    if(Object.isUndefined(this.constructor._instances)){
		this.constructor._instances = []
		this.constructor.getInstances = function(){
		    return this.constructor._instances
		}.bind(this)
	    }
	    this.constructor._instances.push(this)
	},

	_createGettersAndSetters: function(){
	    this._createSetters()
	    this._createGetters()
	    return this
	},

	_createSetters: function(){
		for(p in this.pars){
		    var pl = p.capFirstChar()

		    if (!this['set' + pl]) {
			this['set' + pl] = function (p, obj) {
			    this.pars[p] = obj
			    return this
			}.bind(this, p)
		    }
		}
		return this
	},

	_createGetters: function(){
		for(p in this.pars){
		    var pl = p.capFirstChar()

		    if (!this['get' + pl]) {
			this['get' + pl] = function (p) {
			    return this.pars[p]
			}.bind(this, p)
		    }
		}
		return this
	},

	_initPars: function(pars) {
		this.setPars(pars)
	}
});

/*
 -ref		Df.Element
 -note		creates an Element object
 -returns	Df.Element
 -type		Class
 -extends	Df.Base
 -example	<script type="text/javascript">
			var e = new Df.Element('xxx')
		</script>
*/
Df.Element = Class.create(Df.Base, {

	initialize: function($super, element, pars){
		this.element = this.createOrGetElementReference(element);
		$super(pars)
		return this
	},

	_setup: function($super){
		this._stopBubble()
		$super()
	},

	/*
	 -ref		Df.Element.createOrGetElementReference
	 -type		Method
	 -arg		element String|Node optional
	 -returns	Node
	*/
	createOrGetElementReference: function(element){
		if(element){
			try{
				return $(element)
			} catch (e) {
				var el = document.createElement('div')
				el.id = element
				return $(el)
			}
		} else {
			return $(document.createElement('div'))
		}
	},

	/*
	 -ref		Df.Ui.getElement
	 -type		Method
	 -note		gets the native element that was used to create the instance of Df.Ui
	 -returns	Element
	 -example	<script type="text/javascript">
				var element = new Df.Ui('xxx').set()
				var nativeNode = element.getElement()
			</script>
	*/
	getElement: function() {
		return this.element;
	},

	_stopBubble: function() {
		if(this.pars.stopBubble && this.pars.stopBubble.length > 0){
			this.pars.stopBubble.each(function(v){
				this.element.observe(v, function(e){
					e.stop()
				})
			}.bind(this))
		}
	}

})

/*
 -ref		Df.Ui
 -type		Class
 -returns       Df.Ui
 -note		Base class for instance based classes that are build on a ui object
 -event		this.element :set fires when the set method is complete
 -event		this.element :show fires when the elements is told to show itself
 -event		this.element :shown fires when the element is finished its show process
 -event		this.element :hide fires when the elements is told to hide itself
 -event		this.element :hidden fires when the element is finished its hide process
 -arg		String|Element element an extended dom node or dom node id string
 -extends	Df.Element
 -example	<script type="text/javascript">
			var element = new Df.Ui('xxx')
		</script>
*/
Df.Ui = Class.create(Df.Element, {

	_setup: function($super){

		this.togglePanes = []
		this.status = false
		this.displayStatus = false

		$super()

		this._animationCompleteEvent = this.animationCompleteEvent.bindAsEventListener(this)

		if(this.pars.animate){
			this.animate = new Df.Animate(this.getElement(), this.pars.animate);
			this.animate.getElement().observe(':complete', this._animationCompleteEvent);

		} else {
			this.animate = false
		}

		if(this.pars.drag){
			this.drag = new Df.Drag(this.getElement(), this.pars.drag);
			this.drag.enable()
		}else {
			this.drag = false
		}

		if(this.pars.resize){
			this.resize = new Df.Resize(this.getElement(), this.pars.resize);
			this.resize.enable()
		}else {
			this.resize = false
		}

		if(this.pars.scroll){
			this.scroll = new Df.Scroll(this.getElement(), this.pars.scroll);
		}else {
			this.scroll = false
		}

		try{
			this.getElement().fire(':set')
		} catch (e){

		}
		if(this.pars.onSet){
			this.pars.onSet(this)
		}

		if(this.pars.displayStateId){
			this._displayStateCookie = new Df.Cookie({
				name: 'df_ui_display_state',
				path: '/'
			})

			var o = this._displayStateCookie.getCookie()

			if(o && o[this.pars.displayStateId] == 1){
				this._displayStateFirstRunFlag = true
				this.show()
			}
		}

		return this;
	},

	_initPars: function($super, pars){
		$super()
		this.setPars({

			/*
			 -ref		Df.Ui.pars.displayStateId
			 -type		Parameter
			 -returns	String
			 -default	false
			 -note		unique at for storing the display state of the ui instance
			*/
			displayStateId: false,

			/*
			 -ref		Df.Ui.pars.showClassName
			 -type		Parameter
			 -returns	String
			 -default	df_element_show
			 -note		classname to assign during the show process of the element
			*/
			showClassName: 'df_element_show',

			/*
			 -ref		Df.Ui.pars.hideClassName
			 -type		Parameter
			 -returns	String
			 -default	df_element_hide
			 -note		classname to assign during the hide process of the element
			*/
			hideClassName: 'df_element_hide',

			/*
			 -ref		Df.Ui.pars.animate
			 -type		Parameter
			 -returns	Boolean|Df.Animate.pars
			 -default	false
			 -note		pars object you want to initialize Df.Animate with
			 -example	<script type="text/javascript">
						var el = new Df.Ui($('el')).set({
							animate: {
								opacity:0.35,
								time: 250
							}
						});
					</script>
			*/
			animate: false,

			/*
			 -ref		Df.Ui.pars.drag
			 -type		Parameter
			 -returns	Boolean|Df.Drag.pars
			 -default	false
			 -note		pars object you want to initialize Df.Drag with
			 -example	<script type="text/javascript">
						var el = new Df.Ui($('el')).set({
							animate: {
								opacity:0.35,
								time: 250
							},
							drag: {}
						});
					</script>
			*/
			drag: false,

			/*
			 -ref		Df.Ui.pars.resize
			 -type		Parameter
			 -returns	Boolean|Df.Resize.pars
			 -default	false
			 -note		pars object you want to initialize Df.Drag with
			 -example	<script type="text/javascript">
						var el = new Df.Ui($('el')).set({
							animate: {
								opacity:0.35,
								time: 250
							},
							resize:{}
						});
					</script>
			*/
			resize: false,

			/*
			 -ref		Df.Ui.pars.scroll
			 -type		Parameter
			 -returns	Boolean|Df.Scroll.pars
			 -default	false
			 -note		pars object you want to initialize Df.Scroll with
			 -example	<script type="text/javascript">
						var el = new Df.Ui($('el')).set({
							animate: {
								opacity:0.35,
								time: 250
							},
							scroll:{}
						});
					</script>
			*/
			scroll: false,

			/*
			 -ref		Df.Ui.pars.iframe
			 -type		Parameter
			 -returns	Boolean
			 -default	false
			 -note		if set to true an iframe will be prepended to the element on show
					of the element.
			 -note		It will be hiddden on hide of the element
			*/
			iframe: false,

			/*
			 -ref		Df.Ui.pars.onSet
			 -type		Parameter
			 -returns	Function
			 -default	false
			 -note		anonymous function
			 -note		sends class instance as the only argument
			*/
			onSet: false,

			/*
			 -ref		Df.Ui.pars.onHide
			 -type		Parameter
			 -returns	Function
			 -default	false
			 -note		anonymous function
			 -note		sends class instance as the only argument
			*/
			onHide: false,

			/*
			 -ref		Df.Ui.pars.onShow
			 -type		Parameter
			 -returns	Function
			 -default	false
			 -note		anonymous function
			 -note		sends class instance as the only argument
			*/
			onShow: false,

			/*
			 -ref		Df.Ui.pars.onHidden
			 -type		Parameter
			 -returns	Function
			 -default	false
			 -note		anonymous function
			 -note		sends class instance as the only argument
			*/
			onHidden: false,

			/*
			 -ref		Df.Ui.pars.onShown
			 -type		Parameter
			 -returns	Function
			 -default	false
			 -note		anonymous function
			 -note		sends class instance as the only argument
			*/
			onShown: false
		});
		this.setPars(pars)
	},

	/*
	 -ref		Df.Ui.togglePane
	 -type		Method
	 -delegate	Df.TogglePane
	 -arg		Element|String element
	 -arg		Df.TogglePane.pars pars appends this as the controller par
	 -note		Creates an instance of Df.TogglePane with this as the controller
	 -returns	Df.TogglePane
	 -example	<script type="text/javascript">
				var element = new Df.Ui('xxx').set()

				var tp = element.togglePane($('yyy'), {
					animate: {
						height: 40,
						width:40
					},
					toggleShowDelay: 100
				});
			</script>
	*/
	togglePane: function(element, pars){
		Object.extend(pars, {controller: this})
		var togglePane = new Df.TogglePane(element, pars)
		this.togglePanes.push(togglePane)
		return togglePane;
	},

	animationCompleteEvent: function(e){
		e.stop()
		if(e.memo.pointer == 0){
			this._finishHide(e)
		}
		else if(e.memo.pointer == 1) {
			this._finishShow(e)
		}
	},

	/*
	 -ref		Df.Ui.show
	 -type		Method
	 -note		Shows the element by running its animation and assigning showClassName parameter
	 -note		show sets this.status = true and then calls this.showByStatus
	 -returns	Df.Ui
	 -example	<script type="text/javascript">
				var element = new Df.Ui('xxx').set(
					animate: {
						opacity: .75
					}
				).show()
			</script>
	 -example	<script type="text/javascript">
				var element = new Df.Ui('xxx').set(
					showClassName: 'displayNow'
				).show()
			</script>
	*/
	show: function(e){
		this.status = true
		this.showByStatus(e)
		return this
	},

	/*
	 -ref		Df.Ui.showByStatus
	 -type		Method
	 -note		Shows the element by running its animation and assigning showClassName parameter
	 -note		showByStatus checks to make sure that this.status is true and
			this.displayStatus is false and then calls this.showActions
	 -returns	Df.Ui
	*/
	showByStatus: function(e){
		if( this.status && !this.displayStatus ){
			this.showActions(e)
		}
		return this;
	},

	/*
	 -ref		Df.Ui.showActions
	 -type		Method
	 -note		Shows the element by running its animation and assigning showClassName parameter
	 -note		Shows the element only if it is not already being shown
	 -fire		this.element :show
	 -fire		this.element :shown
	 -returns	Df.Ui
	 -example	<script type="text/javascript">
				var element = new Df.Ui('xxx').set(
					animate: {
						opacity: .75
					}
				).showActions()
			</script>
	 -example	<script type="text/javascript">
				var element = new Df.Ui('xxx').set(
					showClassName: 'displayNow'
				).showActions()
			</script>
	*/
	showActions: function(e){
		this.status = true

		if(!this.displayStatus ){

			this.displayStatus = true

			if(this.pars.showClassName) {
				this.getElement().addClassName(this.pars.showClassName)
			}

			if(this.pars.hideClassName){
				this.getElement().removeClassName(this.pars.hideClassName)
			}

                        this.element.fire(':show', {event: e});

			if(this.pars.onShow){
				this.pars.onShow(this)
			}

			if (this.animate) {
				if (this.animate.getHistoryCount() == 0) {
					var f = null
					if(this._displayStateFirstRunFlag){
						var f = true
					}
					this.animate.run(false, false, f);
					this._displayStateFirstRunFlag = null

				} else {
					this.animate.last();
				}
			} else {
				this._finishShow(e)
			}
		}
		return this
	},

	_finishShow: function(e){

		if(Prototype.Browser.ie6 && this.pars.iframe){
			this.showIframe();
		}

		this.element.fire(':shown', {event: e});

		if(this.pars.onShown){
			this.pars.onShown(this)
		}

		if(this.pars.displayStateId){
			var o = this._displayStateCookie.getCookie()
			if(!o){
				var o = {}
			}
			o[this.pars.displayStateId] = 1
			this._displayStateCookie.setData(o)
		}
	},

	/*
	 -ref		Df.Ui.hide
	 -type		Method
	 -note		Hides the element by reverting its animation and assigning hideClassName parameter
	 -note		hide sets this.status = false and then calls this.hideByStatus
	 -returns	Df.Ui
	 -example	<script type="text/javascript">
				var element = new Df.Ui('xxx').set(
					animate: {
						opacity: .75
					}
				).show()

				element.getElement().observe('click', element.hide)
			</script>
	 -example	<script type="text/javascript">
				var element = new Df.Ui('xxx').set(
					showClassName: 'displayNow'
				).show()

				element.getElement().observe('click', element.hide)
			</script>
	*/
	hide: function(e){
		this.status = false
		this.hideByStatus(e)
	},

	/*
	 -ref		Df.Ui.hideByStatus
	 -type		Method
	 -note		Hides the element by reverting its animation and assigning hideClassName parameter
	 -note		checks to make sure that this.status is false and
			this.displayStatus is true and then calls this.hideActions
	 -returns	Df.Ui
	*/
	hideByStatus: function(e){
		if(!this.status && this.displayStatus){
			this.hideActions(e)
		}
		return this
	},

	/*
	 -ref		Df.Ui.hideActions
	 -type		Method
	 -note		Hides the element by reverting its animation and assigning hideClassName parameter
	 -note		hideActions only runs if this.displayStatus is true
	 -fire		this.element :hide
	 -fire		this.element :hidden
	 -returns	Df.Ui
	 -example	<script type="text/javascript">
				var element = new Df.Ui('xxx').set(
					animate: {
						opacity: .75
					}
				).show()

				element.getElement().observe('click', element.hideActions)
			</script>
	 -example	<script type="text/javascript">
				var element = new Df.Ui('xxx').set(
					showClassName: 'displayNow'
				).show()

				element.getElement().observe('click', element.hideActions)
			</script>
	*/
	hideActions: function(e){
		this.status = false

		if(this.displayStatus ){

			this.displayStatus = false

                        this.element.fire(':hide', {event: e});

			if(this.pars.onHide){
				this.pars.onHide(this)
			}

			if( this.animate && this.animate.getHistoryCount() > 0){
				this.animate.first();
			}else{
				this._finishHide(e)
			}
		}
		return this
	},

	_finishHide: function(e){

                if(this.pars.hideClassName) {
                        this.getElement().addClassName(this.pars.hideClassName)
                }
                if(this.pars.showClassName){
                        this.getElement().removeClassName(this.pars.showClassName)
                }

                if(Prototype.Browser.ie6 && this.pars.iframe){
			this.hideIframe();
		}

		this.element.fire(':hidden', {event: e});

		if(this.pars.onHidden){
			this.pars.onHidden(this)
		}

		if(this.pars.displayStateId){
			var o = this._displayStateCookie.getCookie()
			if(!o){
				var o = {}
			}
			o[this.pars.displayStateId] = 0
			this._displayStateCookie.setData(o)
		}
	},

	/*
	 -ref		Df.Ui.showIframe
	 -type		Method
	 -note		creates or displays blocking iframe for ie6
	 -note		attempts to size and position the frame to the element
	 -note		prepends the iframe to the element
	 -note		called by this.showActions
	 -returns	Df.Ui
	*/
	showIframe: function(){
		if(this.iframe){
			this.iframe.style.display = "block";
		}else{
			var html = '<iframe class="ie6BlockerFrame" style="display:block; left:'+ this.element.getStyle('left') +'; position:absolute; top:'+ this.element.getStyle('top') +'; filter:progid:DXImageTransform.Microsoft.Alpha(style=0,opacity=0);" scrolling="no" src="javascript:void(0);" frameborder="0" height="'+ parseInt( this.element.offsetHeight) +'px" width="'+ parseInt( this.element.offsetWidth) +'px"></iframe>'
			this.element.insert({before: html});
			this.iframe = this.element.previous('iframe')
		}
		return this
	},

	/*
	 -ref		Df.Ui.hideIframe
	 -type		Method
	 -note		hides the iframe
	 -note		called by this.hideActions
	 -returns	Df.Ui
	*/
	hideIframe: function(){
		if(this.iframe){
			this.iframe.style.display = "none";
		}
		return this
	}
});

/*
 -ref		Df.UiCollection
 -type		Class
 -returns	Df.UiCollection
 -extends	Df.Ui
 -arg		String|Element element an extended dom node or dom node id string
 -note		Base class for instance based classes that are collections of ui objects
*/
Df.UiCollection = Class.create(Df.Ui, {

	_setup: function($super){
		this.items = [];
		this.buildItems();
		$super()
	},

	_initPars: function($super, pars){
		$super()
		this.setPars({
			/*
			 -ref		Df.UiCollection.pars.collection
			 -type		Parameter
			 -returns	Df.UiCollection
			 -note		passed to collection items as a reference back to the collection
			*/
			collection: this
		});
		this.setPars(pars)
	},

	/*
	 -ref		Df.UiCollection.getItems
	 -type		Method
	 -returns	Array
	 -note		gets all the items of the collection
	*/
	getItems: function () {
		return this.items;
	},

	/*
	 -ref		Df.UiCollection.getItem
	 -type		Method
	 -returns	Df.Ui
	 -arg		Number i index of the items array to return
	 -note		gets an item of the collection
	*/
	getItem: function (i) {
		return this.items[i];
	},

	/*
	 -ref		Df.UiCollection.showOnlyItem
	 -type		Method
	 -returns	Df.Ui
	 -arg		Number|Df.Ui type index of the items array or ui instance to display
	 -note		shows an ui instance of the collection
	 -note		all other ui instances with be hidden
	*/
	showOnlyItem: function (type) { //index or instance
		var openItems = this.getShownItems()
		for(var i=0; i < openItems.length; i++){
			openItems[i].hide();
		}
		return this.showItem(type)
	},

	/*
	 -ref		Df.UiCollection.getShownItems
	 -type		Method
	 -returns	Array
	 -note		gets an array of all items in the collection that have this.displayStatus set to true
	*/
	getShownItems: function () {
		var items = []
		for(var i=0; i<this.items.length; i++){
			if(this.items[i].displayStatus){
				items.push(this.items[i]);
			}
		}
		return items
	},

	/*
	 -ref		Df.UiCollection.getHiddenItems
	 -type		Method
	 -returns	Array
	 -note		gets an array of all items in the collection that have this.displayStatus set to false
	*/
	getHiddenItems: function () {
		var items = []
		for(var i=0; i<this.items.length; i++){
			if(!this.items[i].displayStatus){
				items.push(this.items[i]);
			}
		}
		return items
	},

	/*
	 -ref		Df.UiCollection.getInstanceItemIndex
	 -type		Method
	 -returns	Number
	 -arg		Df.Ui
	 -note		gets the index in the collection for an item instance
	*/
	getInstanceItemIndex: function(ins){
		var index = false
		loopy:
		for(var i=0; i<this.items.length; i++){
			if( this.items[i] === ins){
				index = i
				break loopy
			}
		}
		return index
	},

	/*
	 -ref		Df.UiCollection.showItem
	 -type		Method
	 -returns	Df.Ui
	 -arg		Df.Ui|Number type index of the items array or ui instance to display
	 -note		shows an item in the collection
	*/
	showItem: function (type) { //index or instance
		if(type.constructor == Number){
			return this.items[type].show();
		}else{
			return type.show();
		}
	},

	/*
	 -ref		Df.UiCollection.showItems
	 -type		Method
	 -returns	Df.UiCollection
	 -note		shows all the items of the collection
	*/
	showItems: function () {
		for(var i=0; i<this.items.length; i++){
			if( !this.items[i].displayStatus){
				this.items[i].show();
			}
		}
		return this
	},

	/*
	 -ref		Df.UiCollection.hideItem
	 -type		Method
	 -returns	Df.Ui
	 -arg		Number index index of the items array to hide
	 -note		hides an item of the collection
	*/
	hideItem: function (index) {
		return this.items[index].hide();
	},

	/*
	 -ref		Df.UiCollection.hideItems
	 -type		Method
	 -returns	Df.UiCollection
	 -note		hides all the items of the collection
	*/
	hideItems: function(){
		for(var i=0; i<this.items.length; i++){
			if( this.items[i].displayStatus){
				this.items[i].hide();
			}
		}
		return this;
	},

	/*
	 -ref		Df.UiCollection.toggleItem
	 -type		Method
	 -returns	Df.UiCollection
	 -arg		Number index index of the items array to toggle
	 -note		toggles show or hide of an item of the collection
	*/
	toggleItem: function (index) {

		if(this.getItem(index).displayStatus){
			this.hideItem(index)
		}else{
			this.showItem(index)
		}
		return this
	},

	/*
	 -ref		Df.UiCollection.toggleItems
	 -type		Method
	 -returns	Df.UiCollection
	 -note		toggles the display of all items in the collection
	*/
	toggleItems: function () {
		for(var i=0; i<this.items.length; i++){
			if(this.items[i].displayStatus){
				this.items[i].hide()
			}else{
				this.items[i].show()
			}
		}
		return this
	},

	/*
	 -ref		Df.UiCollection.buildItems
	 -type		Method
	 -returns	Df.UiCollection
	 -note		method used to build the items of the collection
	 -note		intended to be overridden
	 -example	<script type="text/javascript">
				var myCollection = Class.create(Df.UiCollection, {
					buildItems: function(){
						var elem = this.element.select('div.includeMe');

						for(var i=0; i<elem.length; i++){
							this.items.push( new Df.Ui( $(elem[i]) ).set(this.pars) );
						}
					}
				});

				var myIns = new myCollection($('xxx')).set({
					animate: {
						height: 200
					}
				});
			</script>
	*/
	buildItems: function(){

		var elem = this.element.immediateDescendants();

		for(var i=0; i<elem.length; i++){
			if(this.pars.displayStateId){
				this.pars.displayStateId += '_' + i
			}
			this.items.push( new Df.Ui( $(elem[i]) ).set(this.pars) );
		}
	}
});

/*
 -ref		Df.TogglePane
 -extends	Df.Ui
 -returns	Df.TogglePane
 -demo		../demos/toggleElements.html simple example showing how easy it is to control elements
		through events and animation
 -type		Class
 -arg		string|Element element an extended dom node or dom node id string
 -note		Base class for instance based classes that panes contolled visually by another ui object
 -example	<script type="text/javascript">
			var xxx = new Df.TogglePane('yyy').set({
				controller: new Df.Ui('zzz').set(),
				animate: {
					width: 500,
					time: 1500
				}
			});
		</script>
*/
Df.TogglePane = Class.create(Df.Ui, {

	_setup: function($super){
		
		this._controllerClickObserver = this.controllerClickObserver.bindAsEventListener(this)
		this._controllerHoverOverObserver = this.controllerHoverOverObserver.bindAsEventListener(this)
		this._controllerHoverOutObserver = this.controllerHoverOutObserver.bindAsEventListener(this)
		
		this._paneHoverOverObserver = this.paneHoverOverObserver.bindAsEventListener(this)
		this._paneHoverOutObserver = this.paneHoverOutObserver.bindAsEventListener(this)
		this.element.observe(':show', this.addActiveTitleState.bind(this));
		this.element.observe(':hidden', this.removeActiveTitleState.bind(this));
		this.currentController = false

		$super()

		this.eventType()
	},

	_initPars: function($super, pars){
		$super()
		this.setPars({
			/*
			 -ref		Df.TogglePane.pars.toggleShowDelay
			 -type		Parameter
			 -returns	Number
			 -default	250
			 -note		milliseconds to pause before showing element
			 -hint		Only available for hover event type
			 -example	<script type="text/javascript">
						var xxx = new Df.TogglePane('yyy').set({
							controller: new Df.Ui('zzz').set(),
							animate: {
								width: 500,
								time: 1500
							},
							toggleShowDelay: 1500
						});
					</script>
			*/
			toggleShowDelay: 250,

			/*
			 -ref		Df.TogglePane.pars.toggleHideDelay
			 -type		Parameter
			 -default	250
			 -returns	Number
			 -note		milliseconds to pause before hiding element
			 -hint		Only available for hover event type
			 -example	<script type="text/javascript">
						var xxx = new Df.TogglePane('yyy').set({
							controller: new Df.Ui('zzz').set(),
							animate: {
								width: 500,
								time: 1500
							},
							toggleHideDelay: 1500
						});
					</script>
			*/
			toggleHideDelay: 250,

			/*
			 -ref		Df.TogglePane.pars.activeControllerClassName
			 -type		Parameter
			 -returns	String
			 -default	activeController
			 -note		class assigned to the controller element on show of the toggle element
			*/
			activeControllerClassName: 'activeController',

			/*
			 -ref		Df.TogglePane.pars.treatAsMenu
			 -type		Parameter
			 -default	true
			 -returns	Boolean
			 -hint		only available for hover event type
			 -note		allows you to move your mouse onto the toggle element and keep it displayed
			 -note		used for ui types like tips and dropnavs
			*/
			treatAsMenu: true,

			/*
			 -ref		Df.TogglePane.pars.controller
			 -type		Parameter
			 -default	false
			 -returns	Df.Ui
			 -hint		this parameter must be set
			 -note		the controlling ui element for the showing and hiding of the
					toggle element
			*/
			controller: false,

			/*
			 -ref		Df.TogglePane.pars.eventType
			 -type		Parameter
			 -default	hover
			 -choice	hover
			 -choice	click
			 -returns	String
			 -hint		this parameter must be set
			 -note		the event type that triggers showing and hiding the toggle element
			*/
			eventType: 'hover' //hover|click
		});
		this.setPars(pars)
	},
	
	addController: function(node){
		this.pars.controller.push(node)
		var eventType = this.pars.eventType
		this.eventType(false)
		this.eventType(eventType)
	},
	
	removeController: function(node){
		this.pars.controller = $A(this.pars.controller).without(node)
		var eventType = this.pars.eventType
		this.eventType(false)
		this.eventType(eventType)
	},

	/*
	 -ref		Df.TogglePane.eventType
	 -type		Method
	 -returns	Df.TogglePane
	 -arg		Df.TogglePane.pars.eventType type can be click, hover, false
	 -note		sets or changes the event type handlers
	*/
	eventType: function(type) {
		if(type === this.pars.eventType){
			return this
		} else {
			if(type === false){
				this.pars.eventType = false
			} else if( type ) {
				this.pars.eventType = type
			}

			if (this.pars.eventType == 'hover') {
				this.removeClickEvent()
				this.addHoverEvent()
			}
			else if (this.pars.eventType == 'click') {
				this.removeHoverEvent()
				this.addClickEvent()
			}
			else if (this.pars.eventType === false) {
				this.removeHoverEvent()
				this.removeClickEvent()
			}
			return this
		}
	},

	/*
	 -ref		Df.TogglePane.addHoverEvent
	 -type		Method
	 -note		sets up the event handlers for hover
	 -note		not intended to use used directly
	 -note		intended to be overriden
	*/
	addHoverEvent: function(){
		
		Object.toArray(this.pars.controller).each(function(v){
			
			v.getElement().observe(
				'mouseover',
				this._controllerHoverOverObserver
			);

			v.getElement().observe(
				'mouseout',
				this._controllerHoverOutObserver
			);
		}.bind(this))

		if (this.pars.treatAsMenu) {
			this.getElement().observe(
				'mouseover',
				this._paneHoverOverObserver
			);

			this.getElement().observe(
				'mouseout',
				this._paneHoverOutObserver
			);
		}
	},

	/*
	 -ref		Df.TogglePane.removeHoverEvent
	 -type		Method
	 -note		removes the event handlers for hover
	 -note		not intended to use used directly
	 -note		intended to be overriden
	*/
	removeHoverEvent: function(){
		Object.toArray(this.pars.controller).each(function(v){
			v.getElement().stopObserving(
				'mouseover',
				this._controllerHoverOverObserver
			);
	
			v.getElement().stopObserving(
				'mouseout',
				this._controllerHoverOutObserver
			);
		}.bind(this))

		if (this.pars.treatAsMenu) {
			this.getElement().stopObserving(
				'mouseover',
				this._paneHoverOverObserver
			);

			this.getElement().stopObserving(
				'mouseout',
				this._paneHoverOutObserver
			);
		}
	},

	/*
	 -ref		Df.TogglePane.addClickEvent
	 -type		Method
	 -note		sets up the event handlers for click
	 -note		not intended to use used directly
	 -note		intended to be overriden
	*/
	addClickEvent: function(){
		Object.toArray(this.pars.controller).each(function(v){
			v.getElement().observe(
				'click',
				this._controllerClickObserver
			);
		}.bind(this));
	},

	/*
	 -ref		Df.TogglePane.removeClickEvent
	 -type		Method
	 -note		removes the event handlers for click
	 -note		not intended to use used directly
	 -note		intended to be overriden
	*/
	removeClickEvent: function(){
		Object.toArray(this.pars.controller).each(function(v){
			v.getElement().stopObserving(
				'click',
				this._controllerClickObserver
			);
		}.bind(this))
	},

	/*
	 -ref		Df.TogglePane.controllerClickObserver
	 -type		Method
	 -note		adds the event handlers for click on the controller element
	 -note		called as part of addClickEvent
	 -note		not intended to use used directly
	 -note		intended to be overriden
	*/
	controllerClickObserver: function(e){
		if(this.status && this.displayStatus){
			this.hideClickObserver(e)
		}
		else if (!this.status && !this.displayStatus) {
			this.showClickObserver(e)
		}
	},

	/*
	 -ref		Df.TogglePane.hideClickObserver
	 -type		Method
	 -note		adds the event handlers for click on the element
	 -note		called as part of controllerClickObserver
	 -note		not intended to use used directly
	 -note		intended to be overriden
	*/
	hideClickObserver: function(e){
		this.hide(e)
	},

	/*
	 -ref		Df.TogglePane.showClickObserver
	 -type		Method
	 -note		adds the event handlers for click on the element
	 -note		called as part of controllerClickObserver
	 -note		not intended to use used directly
	 -note		intended to be overriden
	*/
	showClickObserver: function(e){
		this.show(e)
	},

	/*
	 -ref		Df.TogglePane.controllerHoverOverObserver
	 -type		Method
	 -note		adds the event handlers for hover on the controller element
	 -note		called as part of addHoverEvent
	 -note		not intended to use used directly
	 -note		intended to be overriden
	*/
	controllerHoverOverObserver: function(e){
		
		if(this.currentController != e.currentTarget){
			this.currentController = e.currentTarget
			this.element.fire(':controllerChange', {event:e})
		}
		
		Event.stop(e);
		this.status = true
		setTimeout( this.showByStatus.bind(this, e), this.pars.toggleShowDelay)
	},

	/*
	 -ref		Df.TogglePane.controllerHoverOutObserver
	 -type		Method
	 -note		adds the event handlers for hover on the controller element
	 -note		called as part of addHoverEvent
	 -note		not intended to use used directly
	 -note		intended to be overriden
	*/
	controllerHoverOutObserver: function(e){
		Event.stop(e);
		this.status = false
		setTimeout( this.hideByStatus.bind(this), this.pars.toggleHideDelay)
	},

	/*
	 -ref		Df.TogglePane.paneHoverOverObserver
	 -type		Method
	 -note		adds the event handlers for hover on the toggle element
	 -note		called as part of addHoverEvent
	 -note		not intended to use used directly
	 -note		intended to be overriden
	*/
	paneHoverOverObserver: function(e){
		Event.stop(e);
		this.status = true
	},

	/*
	 -ref		Df.TogglePane.paneHoverOutObserver
	 -type		Method
	 -note		adds the event handlers for hover on the toggle element
	 -note		called as part of addHoverEvent
	 -note		not intended to use used directly
	 -note		intended to be overriden
	*/
	paneHoverOutObserver: function(e){
		Event.stop(e);
		this.status = false
		setTimeout( this.hideByStatus.bind(this), this.pars.toggleHideDelay)
	},

	/*
	 -ref		Df.TogglePane.removeActiveTitleState
	 -type		Method
	 -returns	Df.TogglePane
	 -note		removes the activeControllerClassName parameter to the controller element on hide
	*/
	removeActiveTitleState: function(e){
		Event.stop(e)
		if( this.pars.activeControllerClassName){
			Object.toArray(this.pars.controller).each(function(v){
				v.element.removeClassName( this.pars.activeControllerClassName );
			}.bind(this));
		}
		return this
	},

	/*
	 -ref		Df.TogglePane.addActiveTitleState
	 -type		Method
	 -returns	Df.TogglePane
	 -note		adds the activeControllerClassName parameter to the controller element on show
	*/
	addActiveTitleState: function(e){
		Event.stop(e)
		if( this.pars.activeControllerClassName){
			Object.toArray(this.pars.controller).each(function(v){
				v.element.addClassName( this.pars.activeControllerClassName );
			}.bind(this));
		}
		return this
	}
});

/*
 -ref		Df.Cookie
 -extends	Df.Base
 -returns	Df.Cookie
 -demo		../demos/cookie.html create, show, modify, delete cookies
 -note		Makes document.cookie object easy to work with
 -type		Class
 -event		this :get
 -event		this :set
 -event		this :delete
*/
Df.Cookie = Class.create(Df.Base, {
	_setup: function($super) {
		$super()
		this._createGetters()
	},

	_initPars: function($super, pars){
		$super()
		this.setPars({

			/*
			 -ref		Df.Cookie.pars.name
			 -type		Parameter
			 -returns	String
			 -default	df
			 -note		the name of the cookie
			*/
			name: 'df',

			/*
			 -ref		Df.Cookie.pars.path
			 -type		Parameter
			 -returns	Boolean|String
			 -default	false
			 -note		the path of the cookie
			*/
			path: false,

			/*
			 -ref		Df.Cookie.pars.domain
			 -type		Parameter
			 -returns	Boolean|String
			 -default	false
			 -note		the domain of the cookie
			*/
			domain:false,

			/*
			 -ref		Df.Cookie.pars.expires
			 -type		Parameter
			 -returns	Boolean|String
			 -default	false
			 -note		the expiration date of the cookie
			*/
			expires:false,

			/*
			 -ref		Df.Cookie.pars.data
			 -type		Parameter
			 -returns	Boolean|String|Object|Array|Number
			 -default	false
			 -note		the date of the cookie
			*/
			data: false,

			/*
			 -ref		Df.Cookie.pars.onSet
			 -type		Parameter
			 -returns	Function
			 -default	false
			 -note		anonymous function
			 -note		sends class instance as the only argument
			*/
			onSet: false,

			/*
			 -ref		Df.Cookie.pars.onGet
			 -type		Parameter
			 -returns	Function
			 -default	false
			 -note		anonymous function
			 -note		sends class instance as the only argument
			*/
			onGet: false,

			/*
			 -ref		Df.Cookie.pars.onDelete
			 -type		Parameter
			 -returns	Function
			 -default	false
			 -note		anonymous function
			 -note		sends class instance as the only argument
			*/
			onDelete: false
		});
		this.setPars(pars)
	},

	/*
	 -ref		Df.Cookie.setName
	 -fire		this :set
	 -arg		name String
	 -type		method
	 -returns	Df.Cookie
	*/
	/*
	 -ref       	Df.Cookie.getName
	 -type      	method
	 -returns   	String
	*/
	setName: function (name) {
		this.pars.name = name
		this.setCookie()
		return this
	},

	/*
	 -ref		Df.Cookie.setData
	 -fire		this :set
	 -arg		data Object
	 -type		method
	 -returns	Df.Cookie
	*/
	/*
	 -ref       	Df.Cookie.getData
	 -type      	method
	 -returns   	String
	*/
	setData: function (data) {
		this.pars.data = data
		this.setCookie()
		return this
	},

	/*
	 -ref		Df.Cookie.setPath
	 -fire		this :set
	 -arg		path String
	 -type		method
	 -returns	Df.Cookie
	*/
	/*
	 -ref       	Df.Cookie.getPath
	 -type      	method
	 -returns   	String
	*/
	setPath: function (path) {
		this.pars.path = path
		this.setCookie()
		return this
	},

	/*
	 -ref		Df.Cookie.setDomain
	 -fire		this :set
	 -arg		domain String
	 -type		method
	 -returns	Df.Cookie
	*/
	/*
	 -ref       	Df.Cookie.getDomain
	 -type      	method
	 -returns   	String
	*/
	setDomain: function (domain) {
		this.pars.domain = domain
		this.setCookie()
		return this
	},

	/*
	 -ref		Df.Cookie.setExpires
	 -fire		this :set
	 -arg		expires Date
	 -type		method
	 -returns	Df.Cookie
	*/
	/*
	 -ref       	Df.Cookie.getExpires
	 -type      	method
	 -returns   	String
	*/
	setExpires: function (expires) {
		this.pars.expires = expires
		this.setCookie()
		return this
	},

	/*
	 -ref		Df.Cookie.setCookie
	 -type		Method
	 -returns	Df.Cookie
	 -arg		Df.Cookie.pars pars
	 -fire		this :set sends cookie as a memo
	 -note		writes the cookie
	*/
	setCookie: function(pars) {

		this.setPars(pars);

		var serial = false;

		if (this.pars.data.constructor == Array || this.pars.data.constructor == Object) {
			serial = escape(Object.toJSON(this.pars.data));
		} else {
			serial = escape(this.pars.data);
		}

		var value = this.pars.name + '=' + serial + ';'
		if (this.pars.expires) {
			value += ' expires=' + this.pars.expires + ';'
		}
		if (this.pars.path) {
			value += ' path=' + this.pars.path + ';'
		}
		if (this.pars.domain) {
			value += ' domain=' + this.pars.domain + ';'
		}
		document.cookie = value;

		this.fire(':set', {cookie: this} );

		if(this.pars.onSet){
			this.pars.onSet(this)
		}

		return this;
	},

	/*
	 -ref		Df.Cookie.deleteCookie
	 -type		Method
	 -returns	Df.Cookie
	 -fire		this :delete sends cookie as a memo
	 -note		deletes the cookie
	*/
	deleteCookie: function(){
		var cookie_date = new Date ( );
		cookie_date.setTime( cookie_date.getTime() - 1 );
		document.cookie = this.pars.name + "=; expires=" + cookie_date.toGMTString();

		this.fire(':delete', {cookie: this} );

		if(this.pars.onDelete){
			this.pars.onDelete(this)
		}

		return this;
	},

	/*
	 -ref		Df.Cookie.getCookie
	 -type		Method
	 -returns	Df.Cookie
	 -fire		this :get sends cookie as a memo
	 -note		returns the cookie data
	*/
	getCookie: function(){
		var result = document.cookie.match ( this.pars.name + '=(.*?)(;|$)' );

		if( result ){

			this.fire(':get', {cookie: this} );

			if(this.pars.onGet){
				this.pars.onGet(this)
			}

			try{
				return unescape(result[1]).evalJSON()
			}catch(e){
				return unescape(result[1]);
			}
		}else{
			return undefined;
		}
	}
});


/*
 -ref		Df.Scroll
 -extends	Df.Element
 -type		Class
 -returns	Df.Scroll
 -arg		String|Element element an extended dom node or dom node id string
 -event		this.element :mousewheel
*/
Df.Scroll = Class.create(Df.Element, {

	_setup: function($super){

		this.startPointerX
		this.startPointerY
		this.startScrollTop
		this.startScrollLeft

		this.__mouseWheelObserver = this._mouseWheelObserver.bind(this)
		this.__scrollContentObserver = this._scrollContentObserver.bind(this)
		this.__mouseMoveObserver = this._mouseMoveObserver.bind(this)
		this.__mouseDownDragObserver = this._mouseDownDragObserver.bind(this)

		$super()

                this.element.observe("mousewheel", this.__mouseWheelObserver);
		this.element.observe("DOMMouseScroll", this.__mouseWheelObserver);
		this.element.observe(':resize', this.adjustToContent.bind(this))

		if(this.pars.moveEvent == 'drag'){
			Event.observe(document, 'mouseup', function(e){
				this.element.stopObserving('mousemove', this.__mouseMoveObserver)
			}.bind(this))
			this.element.observe('click', function(e){
				e.stop()
			}.bind(this))
		}

                this.adjustToContent()
        },

	_initPars: function($super, pars){
		$super()
		this.setPars({
			onMousewheel: false,
			moveEvent: false, //hover|drag|false
			incrementPercent: .02,
			incrementPixel: false
		})
		this.setPars(pars)
	},

	adjustToContent: function(e){
                this.element.stopObserving(':mousewheel', this.__scrollContentObserver)
		this.element.stopObserving('mousedown', this.__mouseDownDragObserver)
		this.element.stopObserving('mousemove', this.__mouseMoveObserver)

		if(this.element.getHeight() < this.element.scrollHeight || this.element.getWidth() < this.element.scrollWidth){

			if(this.pars.moveEvent == 'drag'){
				this.element.observe('mousedown', this.__mouseDownDragObserver)
			}

			if(this.pars.moveEvent == 'hover'){
				this.element.observe('mousemove', this.__mouseMoveObserver)
			}

			if (this.element.getHeight() < this.element.scrollHeight) {
				this.element.observe(':mousewheel', this.__scrollContentObserver);
			}
		}
	},

	_getIncrementY: function(){
		if(this.pars.incrementPixel){
			return this.pars.incrementPixel
		}else{
			return parseInt(this.pars.incrementPercent * this.element.scrollHeight)
		}
	},

	_getIncrementX: function(){
		if(this.pars.incrementPixel){
			return this.pars.incrementPixel
		}else{
			return parseInt(this.pars.incrementPercent * this.element.scrollWidth)
		}
	},

	incrementUp: function(){
		return this.moveY(this.element.scrollTop - this._getIncrementY())
	},

	incrementDown: function(){
		return this.moveY(this.element.scrollTop + this._getIncrementY())
	},

	incrementLeft: function(){
		return this.moveX(this.element.scrollLeft + this._getIncrementX())
	},

	incrementRight: function(){
		return this.moveX(this.element.scrollLeft - this._getIncrementX())
	},

	moveY: function(y){
		y = y.toRange(0, this.element.scrollHeight)
		if(y != this.element.scrollTop){
			this.element.scrollTop = y
			this.element.fire(':scrollY', {y: y, instance: this})
		}
		return this;
	},

	moveX: function(x){
		x = x.toRange(0, this.element.scrollWidth)
		if(x != this.element.scrollLeft){
			this.element.scrollLeft = x
			this.element.fire(':scrollX', {x: x, instance: this})
		}
		return this
	},

	zoomLeftPosition: function(e){
		return  parseInt((this.element.getPointerX(e) / this.element.getWidth()) * (this.element.scrollWidth - this.element.getWidth()));
	},

	zoomTopPosition: function(e){
		return  parseInt((this.element.getPointerY(e) / this.element.getHeight()) * (this.element.scrollHeight - this.element.getHeight()));
	},

	zoomLeftPositionDrag: function(e){
		return this.startScrollLeft + (this.startPointerX - this.element.getPointerX(e))
	},

	zoomTopPositionDrag: function(e){
		return this.startScrollTop + (this.startPointerY - this.element.getPointerY(e))
	},

	mouseWheelDelta: function(e){
		var delta = 0;
		if (e.wheelDelta){
			delta = e.wheelDelta/120;
			if (window.opera)
				delta = -delta;
		}
		else if(e.detail){
			delta = -e.detail/3;
		}
		return delta;
	},

	_mouseMoveObserver: function(e){
		e.stop()
		if(this.pars.moveEvent === 'hover'){
			this.moveY(this.zoomTopPosition(e))
			this.moveX(this.zoomLeftPosition(e))
		}
		else if (this.pars.moveEvent === 'drag'){
			this.moveY(this.zoomTopPositionDrag(e))
			this.moveX(this.zoomLeftPositionDrag(e))
		}
	},

	_mouseDownDragObserver: function(e){
		e.stop()
		this.startPointerX = this.element.getPointerX(e)
		this.startPointerY = this.element.getPointerY(e)
		this.startScrollTop = this.element.scrollTop
		this.startScrollLeft = this.element.scrollLeft
		this.element.observe('mousemove', this.__mouseMoveObserver)
	},

        _mouseWheelObserver: function(e){
                e.stop()
                this.element.fire(':mousewheel',{delta:this.mouseWheelDelta(e)});

                if(this.pars.onMousewheel)
                        this.pars.onMousewheel(this, e)
	},

	_scrollContentObserver: function(e){
		if(e.memo.delta > 0){
			this.incrementUp()
		}
		else if(e.memo.delta < 0){
			this.incrementDown()
		}
		return this
	}

});

/*
 -ref		Df.Transitions
 -type		Static Class
 -returns	Object
 -note		adds a ton of Robert Penner's Easings equations
 -author	Robert Penner, <http://www.robertpenner.com/easing/>
 -license	Easing Equations v1.5, (c) 2003 Robert Penner, all rights reserved. Open Source BSD License.
 -example	<script type="text/javascript">
			$('xxx').animate({
				padding: 600,
				ease: Df.Transitions.cubicOut
			})
		</script>
*/
Df.Transitions = {

	/*
	 -ref		Df.Transitions.linear
	 -type		Static Method
	 -returns	Number
	 -arg		Number t current iteration
	 -arg		Number b current value
	 -arg		Number c total value delta
	 -arg		Number d total iterations
	 -note		the default easing for Df.Animate
	*/
	linear: function(t, b, c, d){
		return c*t/d + b;
	},

	/*
	 -ref		Df.Transitions.quadIn
	 -type		Static Method
	 -arg		Number t current iteration
	 -arg		Number b current value
	 -arg		Number c total value delta
	 -arg		Number d total iterations
	 -returns	Number
	*/
	quadIn: function(t, b, c, d){
		return c*(t/=d)*t + b;
	},

	/*
	 -ref		Df.Transitions.quadOut
	 -type		Static Method
	 -arg		Number t current iteration
	 -arg		Number b current value
	 -arg		Number c total value delta
	 -arg		Number d total iterations
	 -returns	Number
	*/
	quadOut: function(t, b, c, d){
		return -c *(t/=d)*(t-2) + b;
	},

	/*
	 -ref		Df.Transitions.quadInOut
	 -type		Static Method
	 -arg		Number t current iteration
	 -arg		Number b current value
	 -arg		Number c total value delta
	 -arg		Number d total iterations
	 -returns	Number
	*/
	quadInOut: function(t, b, c, d){
		if ((t/=d/2) < 1) return c/2*t*t + b;
		return -c/2 * ((--t)*(t-2) - 1) + b;
	},

	/*
	 -ref		Df.Transitions.cubicIn
	 -type		Static Method
	 -arg		Number t current iteration
	 -arg		Number b current value
	 -arg		Number c total value delta
	 -arg		Number d total iterations
	 -returns	Number
	*/
	cubicIn: function(t, b, c, d){
		return c*(t/=d)*t*t + b;
	},

	/*
	 -ref		Df.Transitions.cubicOut
	 -type		Static Method
	 -arg		Number t current iteration
	 -arg		Number b current value
	 -arg		Number c total value delta
	 -arg		Number d total iterations
	 -returns	Number
	*/
	cubicOut: function(t, b, c, d){
		return c*((t=t/d-1)*t*t + 1) + b;
	},

	/*
	 -ref		Df.Transitions.cubicInOut
	 -type		Static Method
	 -arg		Number t current iteration
	 -arg		Number b current value
	 -arg		Number c total value delta
	 -arg		Number d total iterations
	 -returns	Number
	*/
	cubicInOut: function(t, b, c, d){
		if ((t/=d/2) < 1) return c/2*t*t*t + b;
		return c/2*((t-=2)*t*t + 2) + b;
	},

	/*
	 -ref		Df.Transitions.quartIn
	 -type		Static Method
	 -arg		Number t current iteration
	 -arg		Number b current value
	 -arg		Number c total value delta
	 -arg		Number d total iterations
	 -returns	Number
	*/
	quartIn: function(t, b, c, d){
		return c*(t/=d)*t*t*t + b;
	},

	/*
	 -ref		Df.Transitions.quartOut
	 -type		Static Method
	 -arg		Number t current iteration
	 -arg		Number b current value
	 -arg		Number c total value delta
	 -arg		Number d total iterations
	 -returns	Number
	*/
	quartOut: function(t, b, c, d){
		return -c * ((t=t/d-1)*t*t*t - 1) + b;
	},

	/*
	 -ref		Df.Transitions.quartInOut
	 -type		Static Method
	 -arg		Number t current iteration
	 -arg		Number b current value
	 -arg		Number c total value delta
	 -arg		Number d total iterations
	 -returns	Number
	*/
	quartInOut: function(t, b, c, d){
		if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
		return -c/2 * ((t-=2)*t*t*t - 2) + b;
	},

	/*
	 -ref		Df.Transitions.quintIn
	 -type		Static Method
	 -arg		Number t current iteration
	 -arg		Number b current value
	 -arg		Number c total value delta
	 -arg		Number d total iterations
	 -returns	Number
	*/
	quintIn: function(t, b, c, d){
		return c*(t/=d)*t*t*t*t + b;
	},

	/*
	 -ref		Df.Transitions.quintOut
	 -type		Static Method
	 -arg		Number t current iteration
	 -arg		Number b current value
	 -arg		Number c total value delta
	 -arg		Number d total iterations
	 -returns	Number
	*/
	quintOut: function(t, b, c, d){
		return c*((t=t/d-1)*t*t*t*t + 1) + b;
	},

	/*
	 -ref		Df.Transitions.quintInOut
	 -type		Static Method
	 -arg		Number t current iteration
	 -arg		Number b current value
	 -arg		Number c total value delta
	 -arg		Number d total iterations
	 -returns	Number
	*/
	quintInOut: function(t, b, c, d){
		if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
		return c/2*((t-=2)*t*t*t*t + 2) + b;
	},

	/*
	 -ref		Df.Transitions.sineIn
	 -type		Static Method
	 -arg		Number t current iteration
	 -arg		Number b current value
	 -arg		Number c total value delta
	 -arg		Number d total iterations
	 -returns	Number
	*/
	sineIn: function(t, b, c, d){
		return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
	},

	/*
	 -ref		Df.Transitions.sineOut
	 -type		Static Method
	 -arg		Number t current iteration
	 -arg		Number b current value
	 -arg		Number c total value delta
	 -arg		Number d total iterations
	 -returns	Number
	*/
	sineOut: function(t, b, c, d){
		return c * Math.sin(t/d * (Math.PI/2)) + b;
	},

	/*
	 -ref		Df.Transitions.sineInOut
	 -type		Static Method
	 -arg		Number t current iteration
	 -arg		Number b current value
	 -arg		Number c total value delta
	 -arg		Number d total iterations
	 -returns	Number
	*/
	sineInOut: function(t, b, c, d){
		return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
	},

	/*
	 -ref		Df.Transitions.expoIn
	 -type		Static Method
	 -arg		Number t current iteration
	 -arg		Number b current value
	 -arg		Number c total value delta
	 -arg		Number d total iterations
	 -returns	Number
	*/
	expoIn: function(t, b, c, d){
		return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
	},

	/*
	 -ref		Df.Transitions.expoOut
	 -type		Static Method
	 -arg		Number t current iteration
	 -arg		Number b current value
	 -arg		Number c total value delta
	 -arg		Number d total iterations
	 -returns	Number
	*/
	expoOut: function(t, b, c, d){
		return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
	},

	/*
	 -ref		Df.Transitions.expoInOut
	 -type		Static Method
	 -arg		Number t current iteration
	 -arg		Number b current value
	 -arg		Number c total value delta
	 -arg		Number d total iterations
	 -returns	Number
	*/
	expoInOut: function(t, b, c, d){
		if (t==0) return b;
		if (t==d) return b+c;
		if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
		return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
	},

	/*
	 -ref		Df.Transitions.circIn
	 -type		Static Method
	 -arg		Number t current iteration
	 -arg		Number b current value
	 -arg		Number c total value delta
	 -arg		Number d total iterations
	 -returns	Number
	*/
	circIn: function(t, b, c, d){
		return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
	},

	/*
	 -ref		Df.Transitions.circOut
	 -type		Static Method
	 -arg		Number t current iteration
	 -arg		Number b current value
	 -arg		Number c total value delta
	 -arg		Number d total iterations
	 -returns	Number
	*/
	circOut: function(t, b, c, d){
		return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
	},

	/*
	 -ref		Df.Transitions.circInOut
	 -type		Static Method
	 -arg		Number t current iteration
	 -arg		Number b current value
	 -arg		Number c total value delta
	 -arg		Number d total iterations
	 -returns	Number
	*/
	circInOut: function(t, b, c, d){
		if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
		return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
	},

	/*
	 -ref		Df.Transitions.elasticIn
	 -type		Static Method
	 -arg		Number t current iteration
	 -arg		Number b current value
	 -arg		Number c total value delta
	 -arg		Number d total iterations
	 -arg		Number a factor optional
	 -arg		Number p factor optional
	 -returns	Number
	*/
	elasticIn: function(t, b, c, d, a, p){
		if (t==0) return b; if ((t/=d)==1) return b+c; if (!p) p=d*.3; if (!a) a = 1;
		if (a < Math.abs(c)){ a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin(c/a);
		return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
	},

	/*
	 -ref		Df.Transitions.elasticOut
	 -type		Static Method
	 -arg		Number t current iteration
	 -arg		Number b current value
	 -arg		Number c total value delta
	 -arg		Number d total iterations
	 -arg		Number a factor optional
	 -arg		Number p factor optional
	 -arg		Number a factor optional
	 -arg		Number p factor optional
	 -returns	Number
	*/
	elasticOut: function(t, b, c, d, a, p){
		if (t==0) return b; if ((t/=d)==1) return b+c; if (!p) p=d*.3; if (!a) a = 1;
		if (a < Math.abs(c)){ a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin(c/a);
		return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
	},

	/*
	 -ref		Df.Transitions.elasticInOut
	 -type		Static Method
	 -arg		Number t current iteration
	 -arg		Number b current value
	 -arg		Number c total value delta
	 -arg		Number d total iterations
	 -arg		Number a factor optional
	 -arg		Number p factor optional
	 -returns	Number
	*/
	elasticInOut: function(t, b, c, d, a, p){
		if (t==0) return b; if ((t/=d/2)==2) return b+c; if (!p) p=d*(.3*1.5); if (!a) a = 1;
		if (a < Math.abs(c)){ a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin(c/a);
		if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
		return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
	},

	/*
	 -ref		Df.Transitions.backIn
	 -type		Static Method
	 -arg		Number t current iteration
	 -arg		Number b current value
	 -arg		Number c total value delta
	 -arg		Number d total iterations
	 -arg		Number s factor optional
	 -returns	Number
	*/
	backIn: function(t, b, c, d, s){
		if (!s) s = 1.70158;
		return c*(t/=d)*t*((s+1)*t - s) + b;
	},

	/*
	 -ref		Df.Transitions.backOut
	 -type		Static Method
	 -arg		Number t current iteration
	 -arg		Number b current value
	 -arg		Number c total value delta
	 -arg		Number d total iterations
	 -arg		Number s factor optional
	 -returns	Number
	*/
	backOut: function(t, b, c, d, s){
		if (!s) s = 1.70158;
		return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
	},

	/*
	 -ref		Df.Transitions.backInOut
	 -type		Static Method
	 -arg		Number t current iteration
	 -arg		Number b current value
	 -arg		Number c total value delta
	 -arg		Number d total iterations
	 -arg		Number s factor optional
	 -returns	Number
	*/
	backInOut: function(t, b, c, d, s){
		if (!s) s = 1.70158;
		if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
		return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
	},

	/*
	 -ref		Df.Transitions.bounceIn
	 -type		Static Method
	 -arg		Number t current iteration
	 -arg		Number b current value
	 -arg		Number c total value delta
	 -arg		Number d total iterations
	 -returns	Number
	*/
	bounceIn: function(t, b, c, d){
		return c - Df.Transitions.bounceOut (d-t, 0, c, d) + b;
	},

	/*
	 -ref		Df.Transitions.bounceOut
	 -type		Static Method
	 -arg		Number t current iteration
	 -arg		Number b current value
	 -arg		Number c total value delta
	 -arg		Number d total iterations
	 -returns	Number
	*/
	bounceOut: function(t, b, c, d){
		if ((t/=d) < (1/2.75)){
			return c*(7.5625*t*t) + b;
		} else if (t < (2/2.75)){
			return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
		} else if (t < (2.5/2.75)){
			return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
		} else {
			return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
		}
	},

	/*
	 -ref		Df.Transitions.bounceInOut
	 -type		Static Method
	 -arg		Number t current iteration
	 -arg		Number b current value
	 -arg		Number c total value delta
	 -arg		Number d total iterations
	 -returns	Number
	*/
	bounceInOut: function(t, b, c, d){
		if (t < d/2) return Df.Transitions.bounceIn(t*2, 0, c, d) * .5 + b;
		return Df.Transitions.bounceOut(t*2-d, 0, c, d) * .5 + c*.5 + b;
	},

	/*
	 -ref		Df.Transitions.highlight
	 -type		Static Method
	 -returns	Number
	 -arg		t Number current iteration
	 -arg		b Number current value
	 -arg		c Number total value delta
	 -arg		d Number total iterations
	 -note		the rails like notices
	 -example	<script type="text/javascript">
			    $('xxx').setStyle({opacity:0})
				    .animationOptions({transition: Df.Transitions.highlight})
				    .animate({opacity:1})
			</script>
	*/
	highlight: function(t, b, c, d){
	    if(t/d < .2){
		return c*t/d/.2 + b
	    } else if(t/d > .6){
		return c*(1-t/d)/.4 + b
	    } else {
		return b + c
	    }
	}

};

/*
 -ref		Df.Animate
 -extends	Df.Element
 -note		give an element a convenient way to change its visual properties in a stepping way
 -type		Class
 -arg		String|Element element an extended dom node or dom node id string
 -hint		Element must be positioned Absolute or relative if animating top or left
 -hint		Animation parameters map to and change css styles
 -hint		no color keywords allowed
 -demo		../demos/animate_easing.html interactive demo allows you to choose easing, duration, and pause between each iteration. Also
		tracks the animation history and allows you to revert to previous animation steps.
 -demo		../demos/animate_selectors.html interactive demo allows you to choose any selectors and values
		to animate
 -event		this.element :complete
 -event		this.element :iteration
 -event		this :complete
 -event		this :iteration
*/
Df.Animate = Class.create(Df.Element, {

	_setup: function($super){

		this.possibleSelectors = [
			'width','height','color','left','top','fontSize', 'lineHeight', 'letterSpacing',
			'paddingLeft','paddingRight','paddingTop','paddingBottom',
			'marginLeft','marginRight','marginTop','marginBottom',
			'opacity','backgroundColor', 'backgroundPosition',
			'borderColor','borderWidth'
		];

		this.running = false;
		this.iterations = false;
		this.currentIteration = false;
		this.animators = [];
		this.coords = [];
		this.history = [];
		this.hpointer = 0;
		this._timeout

		$super()
	},

	_initPars: function($super, pars){
		$super()
		this.setPars({

			stopBubble: [':complete', ':iteration'],

			/*
			 -ref		Df.Animate.pars.time
			 -type		Parameter
			 -returns	Number|Boolean
			 -choice	false
			 -choice	Number
			 -default	250
			 -note		time in milliseconds to run the complete animation
			 -hint		use time and pase together or pause and skip
			 -hint		easing is only available when using time and pause
			*/
			time: 250,

			/*
			 -ref		Df.Animate.pars.pause
			 -type		Parameter
			 -returns	Number
			 -default	40
			 -note		time in milliseconds wait between each iteration
			 -hint		use time and pase together or pause and skip
			 -hint		easing is only available when using time and pause
			*/
			pause: 40,

			/*
			 -ref		Df.Animate.pars.skip
			 -type		Parameter
			 -returns	Number|Boolean
			 -choice	false
			 -choice	Number
			 -default	false
			 -note		pixels to skip between each iteration
			 -hint		use time and pase together or pause and skip
			 -hint		easing is only available when using time and pause
			*/
			skip:false,

			/*
			 -ref		Df.Animate.pars.ease
			 -type		Parameter
			 -returns	Function
			 -default	Df.Transitions.linear
			*/
			ease: Df.Transitions.linear,

			/*
			 -ref		Df.Animate.pars.width
			 -type		Parameter
			 -returns	Number|Boolean
			 -default	false
			 -note		animates the css property of width
			*/
			width: false,

			/*
			 -ref		Df.Animate.pars.height
			 -type		Parameter
			 -returns	Number|Boolean
			 -default	false
			 -note		animates the css property of height
			*/
			height: false,

			/*
			 -ref		Df.Animate.pars.color
			 -type		Parameter
			 -returns	Boolean|String
			 -choice	false
			 -choice	hex as a string like '#ffffff'
			 -choice	rgb as a string like 'rgb(255,255,255)'
			 -default	false
			 -note		animates the css property of color
			*/
			color: false,

			/*
			 -ref		Df.Animate.pars.backgroundColor
			 -type		Parameter
			 -returns	Boolean|String
			 -choice	false
			 -choice	hex as a string like '#ffffff'
			 -choice	rgb as a string like 'rgb(255,255,255)'
			 -default	false
			 -note		animates the css property of background-color
			*/
			backgroundColor: false,

			/*
			 -ref		Df.Animate.pars.borderColor
			 -type		Parameter
			 -returns	Boolean|String
			 -choice	false
			 -choice	hex as a string like '#ffffff'
			 -choice	rgb as a string like 'rgb(255,255,255)'
			 -default	false
			 -note		animates the css property of border-color
			*/
			borderColor: false,

			/*
			 -ref		Df.Animate.pars.backgroundPosition
			 -type		Parameter
			 -returns	Boolean|String
			 -choice	false
			 -choice	String like '1px 4px'
			 -default	false
			 -note		animates the css property of background-position
			*/
			backgroundPosition: false,

			/*
			 -ref		Df.Animate.pars.borderWidth
			 -type		Parameter
			 -returns	Boolean|Number
			 -default	false
			 -note		animates the css property of border-width
			*/
			borderWidth: false,

			/*
			 -ref		Df.Animate.pars.left
			 -type		Parameter
			 -returns	Boolean|Number
			 -default	false
			 -note		animates the css property of left
			*/
			left: false,

			/*
			 -ref		Df.Animate.pars.top
			 -type		Parameter
			 -returns	Boolean|Number
			 -default	false
			 -note		animates the css property of top
			*/
			top: false,

			/*
			 -ref		Df.Animate.pars.opacity
			 -type		Parameter
			 -returns	Boolean|Number
			 -choice	false
			 -choice	decimal 0.0001 - 0.9999
			 -hint		use values between 0.0001 - 0.9999
			 -hint		prototype does not like cap case. in css use filter:alpha(opacity=50)
			 -default	false
			 -note		animates the css property of opacity
			*/
			opacity: false,

			/*
			 -ref		Df.Animate.pars.fontSize
			 -type		Parameter
			 -returns	Boolean|Number
			 -default	false
			 -note		animates the css property of font-size
			*/
			fontSize: false,

			/*
			 -ref		Df.Animate.pars.lineHeight
			 -type		Parameter
			 -returns	Boolean|Number
			 -default	false
			 -note		animates the css property of line-height
			*/
			lineHeight: false,

			/*
			 -ref		Df.Animate.pars.letterSpacing
			 -type		Parameter
			 -returns	Boolean|Number
			 -default	false
			 -note		animates the css property of letter-spacing
			*/
			letterSpacing: false,

			/*
			 -ref		Df.Animate.pars.paddingLeft
			 -type		Parameter
			 -returns	Boolean|Number
			 -default	false
			 -note		animates the css property of padding-left
			*/
			paddingLeft: false,

			/*
			 -ref		Df.Animate.pars.paddingRight
			 -type		Parameter
			 -returns	Boolean|Number
			 -default	false
			 -note		animates the css property of padding-right
			*/
			paddingRight: false,

			/*
			 -ref		Df.Animate.pars.paddingTop
			 -type		Parameter
			 -returns	Boolean|Number
			 -default	false
			 -note		animates the css property of padding-top
			*/
			paddingTop: false,

			/*
			 -ref		Df.Animate.pars.paddingBottom
			 -type		Parameter
			 -returns	Boolean|Number
			 -default	false
			 -note		animates the css property of padding-bottom
			*/
			paddingBottom: false,

			/*
			 -ref		Df.Animate.pars.marginLeft
			 -type		Parameter
			 -returns	Boolean|Number
			 -default	false
			 -note		animates the css property of margin-left
			*/
			marginLeft: false,

			/*
			 -ref		Df.Animate.pars.marginRight
			 -type		Parameter
			 -returns	Boolean|Number
			 -default	false
			 -note		animates the css property of margin-right
			*/
			marginRight: false,

			/*
			 -ref		Df.Animate.pars.marginTop
			 -type		Parameter
			 -returns	Boolean|Number
			 -default	false
			 -note		animates the css property of margin-top
			*/
			marginTop: false,

			/*
			 -ref		Df.Animate.pars.marginBottom
			 -type		Parameter
			 -returns	Boolean|Number
			 -default	false
			 -note		animates the css property of margin-bottom
			*/
			marginBottom: false,

			/*
			 -ref		Df.Animate.pars.onComplete
			 -type		Parameter
			 -returns	Function
			 -default	false
			 -note		anonymous function
			 -note		sends class instance as the only argument
			*/
			onComplete: false,

			/*
			 -ref		Df.Animate.pars.onIteration
			 -type		Parameter
			 -returns	Function
			 -default	false
			 -note		anonymous function
			 -note		sends class instance as the only argument
			*/
			onIteration: false,

			selectors: []
		});
		this.setPars(pars)
	},

	/*
	 -ref		Df.Animate.run
	 -type		Method
	 -returns	Df.Animate
	 -arg		Df.Animate.pars pars
	 -arg		Boolean fromHistory run the animation at the current pointer
	 -note		runs the animation based on the pars sent in or a step from the history
	*/
	run: function(pars, fromHistory, skip){
		clearTimeout(this._timeout)

		this.setPars(pars);

		//load with initial state of element
		if( this.history.length == 0 ){
			this.loadInitialState();
			this.hpointer = 0;
		}

		//load record in history array
		if( !fromHistory ){
			this.loadState();
			this.hpointer = this.history.length -1
		}

		//create an array of selector to animate
		this.createAnimators();


		if( this.animators.length == 0 && !fromHistory ){
			this.history.pop()
			this.hpointer--
		}

		//determine the iterations the animation will take
		this.setIterations();

		//create an array of interation steps, how the selectors are set for each iteration
		this.createCoordHash();

		//run though the coords array with the set pause value
		if( this.coords.length > 0 ){
			this.running = true;
			if(skip){
				this.skipToEnd.bind(this).defer()
			}else{
				this.stepThroughAnimation.bind(this).defer()
			}
		}
		return this;
	},

	/*
	 -ref		Df.Animate.getPossibleSelectors
	 -type		Method
	 -returns	Array
	 -note		gets all the available css selectors that can be animated
	*/
	getPossibleSelectors: function(){
		return this.possibleSelectors
	},

	/*
	 -ref		Df.Animate.getHistoryCount
	 -type		Method
	 -returns	Number
	 -note		gets the total number of animation steps ran on this instance
	*/
	getHistoryCount: function(){
		return this.history.length;
	},

	/*
	 -ref		Df.Animate.clear
	 -type		Method
	 -returns	Df.Animate
	 -note		stops the animation
	 -note		clears all memory of the instance
	*/
	clear: function(){
		this.running = false;
		this.animators = [];
		this.history = [];
		this.hpointer = 0;
		this.iterations = false;
		this.currentIteration = false;
		this.coords = [];
		return this;
	},

	/*
	 -ref		Df.Animate.terminate
	 -type		Method
	 -returns	Df.Animate
	 -note		stops the animation
	 -note		clears all memory of the current animation that is running
	*/
	terminate: function(){
		running = false;
		coords = [];
		iterations = false;
		currentIteration = false;
		animators = [];
		return this;
	},

	/*
	 -ref		Df.Animate.pause
	 -type		Method
	 -returns	Df.Animate
	 -note		pauses the animation
	*/
	pause: function(ms){
		this.running = false;

		if (ms) {
			setTimeout(this.resume.bind(this), ms);
		}

		return this;
	},

	/*
	 -ref		Df.Animate.resume
	 -type		Method
	 -returns	Df.Animate
	 -note		resumes the animation
	*/
	resume: function(){
		this.running = true;
		this.stepThroughAnimation()
		return this
	},

	/*
	 -ref		Df.Animate.back
	 -type		Method
	 -returns	Df.Animate
	 -arg		Df.Animate.pars you can override or add any pars to the history before the
			animation is carried out
	 -note		runs the previous animation in the history
	*/
	back: function(pars, skip){
		if(this.hpointer > 0){
			this.hpointer--;
			if(pars){
				Object.extend( this.history[ this.hpointer ], pars );
			}
			this.run(false, true, skip);
		}
	},

	/*
	 -ref		Df.Animate.next
	 -type		Method
	 -returns	Df.Animate
	 -arg		Df.Animate.pars you can override or add any pars to the history before the
			animation is carried out
	 -note		runs the next animation in the history
	*/
	next: function(pars, skip){
		if( (this.hpointer + 1) < this.history.length ){
			this.hpointer++;
			if(pars){
				Object.extend( this.history[ this.hpointer ], pars );
			}
			this.run(false, true, skip);
		}
	},

	/*
	 -ref		Df.Animate.first
	 -type		Method
	 -returns	Df.Animate
	 -arg		Df.Animate.pars you can override or add any pars to the history before the
			animation is carried out
	 -note		animates back to its original css properties
	*/
	first: function(pars, skip){
		this.hpointer = 0;
		if(pars){
			Object.extend( this.history[ this.hpointer ], pars );
		}
		this.run(false, true, skip);
	},

	/*
	 -ref		Df.Animate.last
	 -type		Method
	 -returns	Df.Animate
	 -arg		Df.Animate.pars you can override or add any pars to the history before the
			animation is carried out
	 -note		animates to the last index in the history
	*/
	last: function(pars, skip){
		this.hpointer = this.history.length-1;
		if(pars){
			Object.extend( this.history[ this.hpointer ], pars );
		}
		this.run(false, true, skip);
	},

	/*
	 -ref		Df.Animate.index
	 -type		Method
	 -returns	Df.Animate
	 -arg		Number index a specific index in the history to animate to
	 -arg		Df.Animate.pars you can override or add any pars to the history before the
			animation is carried out
	 -note		animates to a specific index in the history
	*/
	index: function(index, pars, skip){
		this.hpointer = index-1;
		if(pars){
			Object.extend( this.history[ this.hpointer ], pars );
		}
		this.run(false, true, skip);
	},

	/*
	 -ref		Df.Animate.toggle
	 -type		Method
	 -returns	Df.Animate
	 -arg		Number index a specific index in the history to animate to
	 -arg		Df.Animate.pars you can override or add any pars to the history before the
			animation is carried out
	 -note		toggles the history between 1 and 0
	 -note		runs the animation for the first time if not run yet
	 -hint		the static method of Df.Animate.toggleBy works well for common observers
			like click or hover
	 -example	<script type="text/javascript">
				var el = new Df.Animate($('xxx')).setPars({
					opacity: .5
				})

				el.getElement().observe('click', function(e){
					this.toggle()
				}.bind(el))
			</script>
	*/
	toggle: function(pars, skip){
		if( this.history.length == 0 ){
			this.run(pars, false, skip);
		}
		else if( this.hpointer == 1 ){
			this.first(pars, skip);
		}
		else if( this.hpointer == 0 ){
			this.last(pars, skip);
		}
	},

	loadInitialState: function(){

		this.createSelectors();

		var copy = Object.clone( this.pars );

		var obj = {}
		for( var i=0; i<copy.selectors.length; i++ ){

			var val = this.element.getStyle(copy.selectors[i]);

			if(val != undefined){
				obj[copy.selectors[i]] = val ;
			}else{
				obj[copy.selectors[i]] = false;
			}
		}

		this.history.push( Object.extend(copy,obj) );
	},

	loadState: function(){
		this.createSelectors();
		this.history.push( Object.extend( {}, this.pars ) );
	},

	createSelectors: function(){
		this.pars.selectors.length == 0
		this.possibleSelectors.each(function(v){
			if( this.pars[v] !== false ){
				this.pars.selectors.push(v)
			}
		}.bind(this));
	},

	createAnimators: function(){
		this.animators = [];

		for(var i=0; i<this.history[this.hpointer].selectors.length; i++){
			var elem = this.history[this.hpointer].selectors[i];

			if(this.history[this.hpointer][elem] !== false){

				var rawTargetValue = this.history[this.hpointer][elem]

				//execute value function
				if(rawTargetValue.constructor == Function){
					rawTargetValue = rawTargetValue(this);
				}

				if (elem == 'borderWidth'){
					if (this.element.style.borderWidth == ''){
						this.element.style.borderWidth = '0px';
					}
				}

				if (elem == 'borderColor'){
					if (this.element.getStyle('borderTopColor') != '' || this.element.getStyle('borderRightColor') != '' || this.element.getStyle('borderBottomColor') != '' || this.element.getStyle('borderLeftColor') != ''){
						this.element.style.borderColor = this.element.getStyle('borderTopColor');
					}
				}

				var val = this.element.getStyle(elem);

				var currentValue = this.getCurrentValue(elem,val);

				var targetValue = this.getCurrentValue(elem,rawTargetValue);

				var units = this.getUnits(rawTargetValue);
				if(!units){
					units = this.getUnits(val);
				}

				if(isNaN(currentValue)){
					if(elem == 'top' || elem == 'left'){
						currentValue = 0;
					}
				}
				
				var delta = this.getDelta(targetValue,currentValue);

				if(delta){
					this.animators.push({selector:elem,delta:delta,current:currentValue,units:units});
				}
			}
		}
	},

	setIterations: function(){
		var p = this.history[this.hpointer];
		if(p.pause && p.time){
			this.iterations = Math.ceil(p.time/p.pause);
		}
		else if(p.skip && p.pause){
			this.iterations = Math.ceil( this.getMaxAbsVal() / p.skip);
		}
		this.currentIteration = 0;
	},

	createCoordHash: function(){
		this.coords = [];
		if( this.animators.length > 0 ){
			for(var i=0; i<this.iterations; i++){
				this.coords.push( this.buildAnimateStep(i) );
			}
		}
	},

	//recursive function that steps through the coords array based on pause value
	stepThroughAnimation: function(){
		clearTimeout(this._timeout)
		if( this.running ){
			try{
				if( this.iterations > this.currentIteration){
					
					this.element.setStyle( this.coords[this.currentIteration] );
					this.currentIteration++;
	
					this.fire(':iteration', { iteration: this.currentIteration, iterations: this.iterations } );
	
					this.element.fire(':iteration', { iteration: this.currentIteration, iterations: this.iterations } );
	
					if( this.history[this.hpointer].onIteration){
						this.history[this.hpointer].onIteration(this);
					}
					
	
					this._timeout = setTimeout( this.stepThroughAnimation.bind(this), this.history[this.hpointer].pause);
				}else{
					this.running = false;
	
					this.fire(':complete', {pointer: this.hpointer});
	
					this.element.fire(':complete', {pointer: this.hpointer});
	
					if( this.history[this.hpointer].onComplete){
						this.history[this.hpointer].onComplete(this);
					}
				}
			} catch (e){
			}
		}
	},

	skipToEnd: function(){
		clearTimeout(this._timeout)
		if( this.running ){
			this.currentIteration = this.iterations - 1
			this.element.setStyle( this.coords[this.currentIteration] );
			this.running = false;
			this.fire(':complete', {pointer: this.hpointer});
			this.element.fire(':complete', {pointer: this.hpointer});
			if( this.history[this.hpointer].onComplete){
				this.history[this.hpointer].onComplete(this);
			}
		}
	},

	getMaxAbsVal: function(){
		var ary = [];
		for(var i=0; i<this.animators.length; i++){
			var val = this.animators[i].delta;
			if(val.constructor == Array){
				for(var j=0; j<val.length; j++){
					ary.push( Math.abs(val[j]) );
				}
			}else{
				ary.push( Math.abs(val) );
			}
		}
		return ary.max();
	},

	buildAnimateStep: function(rec){
		var obj = {}

		for(var i=0; i<this.animators.length; i++){
			var elem = this.animators[i];

			var val = this.getInteratedValue(elem,rec);

			if(rec == (this.iterations-1)){

				var rawTargetValue = this.history[this.hpointer][elem.selector]
				//execute value function
				if(rawTargetValue.constructor == Function){
				     rawTargetValue = rawTargetValue(this);
				}

				val = this.getCurrentValue( elem.selector, rawTargetValue );
			}
			obj[elem.selector] = this.setDisplayValue( elem.selector, val, elem.units );
		}
		return obj;
	},

	getInteratedValue: function(elem,rec){

		var ease = false;
		if( this.history[this.hpointer].ease.constructor == Function){
			ease = this.history[this.hpointer].ease
		}else{
			ease = this.history[this.hpointer].ease[elem.selector]
		}

		var val = false;
		if(elem.delta.constructor == Array){
			val = [];

			for(var i=0; i<elem.delta.length; i++){
				if( this.history[this.hpointer].pause && this.history[this.hpointer].time){
					val.push( this.getEasedValueForTime(elem.current[i], rec+1, elem.delta[i], ease ) );
				}
				else if( this.history[this.hpointer].pause && this.history[this.hpointer].skip){

					val.push( this.plotSkipValue( elem.current[i], elem.delta[i], rec ));
				}
			}
		}else{
			if( this.history[this.hpointer].pause && this.history[this.hpointer].time){
				val = this.getEasedValueForTime( elem.current, rec+1, elem.delta, ease )
			}
			else if(this.history[this.hpointer].pause && this.history[this.hpointer].skip){
				val = this.plotSkipValue(elem.current,elem.delta,rec);
			}

		}
		return val;
	},

	getEasedValueForTime: function(currentValue, interationStep, delta, ease ){
		return ease(interationStep, currentValue, delta, this.iterations )
	},

	plotSkipValue: function(current,delta,rec){
		if(delta > 0){
			var plot = current + ((rec+1) * ( this.history[this.hpointer].skip));

			if(plot <= current + delta){
				plot = plot;
			}else{
				plot = current + delta;
			}
		}else if(delta < 0){
			var plot = current - ((rec+1) * ( this.history[this.hpointer].skip));

			if(plot >= current + delta){
				plot = plot;
			}else{
				plot = current + delta;
			}
		}else{
			var plot = 0;
		}
		return plot;
	},

	//takes two numeric values or two numeric arrays and returns the difference of the numbers or an array of the differences of each number in the array
	getDelta: function(targetValue,currentValue){
		var res = false;
		var keepIt = false;
		if(targetValue.constructor == Array | currentValue.constructor == Array){
			res = [];
			for(var i=0; i<targetValue.length; i++){
				var delta = targetValue[i] - currentValue[i]
				if(delta){
					keepIt = true;
				}
				res.push(delta);
			}
			if(!keepIt){
				res = false;
			}
		}else{
			res = targetValue - currentValue;
		}
		return res;
	},

	//takes a raw value and returns the unit measurement of that value
	getUnits: function(val){
		var str = false;
		if(/px$/.test(val)){
			str = 'px';
		}else if(/%$/.test(val)){
			str = '%';
		}else if(/em$/.test(val)){
			str = 'em';
		}
		return str;
	},

	//(NEEDS SOME WORK on UNITS) takes a selector, a number or an array of numbers, and a unit and returns the presentation ready value of the number(s)
	setDisplayValue: function(elem,val,units){
		if(
			elem == 'width' | elem == 'height' | elem == 'top' | elem == 'left' | elem == 'fontSize'| elem == 'lineHeight'| elem == 'letterSpacing'
			| elem == 'paddingLeft' | elem == 'paddingRight' | elem == 'paddingTop' | elem == 'paddingBottom'
			| elem == 'marginLeft' | elem == 'marginRight' | elem == 'margingTop' | elem == 'marginBottom'
			| elem == 'borderWidth'
		   ){
			val = parseInt(val);
		}else if(elem == 'opacity'){
			val = val/100;
		}
		else if(elem == 'color' | elem == 'backgroundColor' | elem == 'borderColor'){
			val = this.hexFromArray(val);
		}
		else if(elem == 'backgroundPosition'){
			val = this.toBackgroundPositionString(val);
		}

		if(units && elem != 'backgroundPosition'){
			val += units;
		}

		return val;
	},

	//(NEEDS SOME WORK on UNITS) takes a numbers array [1,1] and returns the presentation value 1px 1px
	toBackgroundPositionString: function(val){
		str = '';
		for(var i=0; i<val.length; i++){
			str += Math.round(val[i]) + 'px ';
		}
		return str;
	},

	//takes a numbers array [255,255,255] and returns the presentation value #ffffff
	hexFromArray: function(val){
		var str = '#';
		for(var i=0; i<val.length; i++){
			str += parseInt(val[i]).toColorPart();
		}
		return str;
	},

	// takes a selector and a mixed raw value and returns the value(s) as a number or an array of numbers
	getCurrentValue: function(elem,val){
		if(
			elem == 'width' | elem == 'height' | elem == 'top' | elem == 'left' | elem == 'fontSize' | elem == 'lineHeight'| elem == 'letterSpacing'
			| elem == 'paddingLeft' | elem == 'paddingRight' | elem == 'paddingTop' | elem == 'paddingBottom'
			| elem == 'marginLeft' | elem == 'marginRight' | elem == 'marginTop' | elem == 'marginBottom'
			| elem == 'borderWidth'
		   ){
			val = parseInt(val);
		}
		else if(elem == 'opacity'){
			val = parseInt(val * 100);
		}
		else if(elem == 'color' | elem == 'backgroundColor' | elem == 'borderColor'){
			val = this.toColorArray(val);
		}
		else if(elem == 'backgroundPosition'){
			val = this.toBackgroundPositionArray(val);
		}

		return val;
	},

	//(NEEDS SOME WORK) takes background position info in the form of 1px 1px and converts it to [1,1]
	toBackgroundPositionArray: function(val){
		val = val.split(' ');
		for(var i=0; i<val.length; i++){
			val[i] = parseInt(val[i])
		}
		return val
	},

	//(NEEDS SOME WORK) takes color info in the form of #ffffff or rgb(255,255,255) and converts it to [255,255,255]
	toColorArray: function(val){
		if(/^#/.test(val)){
			val = val.replace(/^#/g,'').replace(/(..)/g,"$1,").replace(/,$/g,'').split(',');
			for(var i=0; i<val.length; i++){
				if(val[i].constructor == String){
					val[i] = parseInt(val[i],16);
				}
				val[i] = Number(val[i])
			}

		}else if(/^rgb/.test(val)){
			val = val.replace(/^rgb\(|\)$/g,'').split(',');
			for(var i=0; i<val.length; i++){
				if (val[i].indexOf(')') > -1){
					val[i] = Number(val[i].substr(0,val[i].indexOf(')')));
				} else {
					val[i] = Number(val[i]);
				}
			}
		}
		return val
	}
});

/*
 -ref		Df.Animate.toggleBy
 -note		This is a factory method for creating an instance of Df.Animate complete with listeners for
		toggling an animation object.
 -type		Static Method
 -returns	Df.Animate
 -arg		String|Element element
 -arg		String action choose between click and hover
 -arg		Df.Animate.pars pars
 -example	<script type="text/javascript">
			var animate = Df.Animate.toggleBy($('xxx'), 'click', {
				opacity: .65
			})
		</script>
*/
Df.Animate.toggleBy = function(element, action, pars){
	var animate = new Df.Animate(element, pars);
	if(action == 'click'){
		element.observe('click', function(e){
			animate.toggle()
		}.bind(animate));

	}else if(action == 'hover'){
		element.observe('mouseover', function(e){
			animate.toggle()
		}.bind(animate));

		element.observe('mouseout', function(e){
			animate.toggle()
		}.bind(animate));
	}
	return animate;
}

/*
 -ref		Df.Drag
 -extends	Df.Element
 -returns	Df.Drag
 -note		Makes an element dragable
 -hint		Element must be positioned Absolute,
 -type		Class
 -arg		String|Element element an extended dom node or dom node id string
 -event		this.element :start
 -event		this.element :stop
 -event		this.element :drag
 -event		this.element :dragX
 -event		this.element :dragY
 -event		this.element :enable
 -event		this.element :disable
 -event		this :stop
 -event		this :drag
 -event		this :dragX
 -event		this :dragY
 -event		this :enable
 -event		this :disable
*/
Df.Drag = Class.create(Df.Element, {

	_setup: function($super){

		this._offsetX
		this._offsetY
		this._curX
		this._curY

		this._followIt = this.followIt.bindAsEventListener(this)
		this._startIt = this.startIt.bindAsEventListener(this)
		this._stopIt = this.stopIt.bindAsEventListener(this)

		$super()
	},

	_initPars: function($super, pars){
		$super()
		this.setPars({
			/*
			 -ref		Df.Drag.pars.dirX
			 -type		Parameter
			 -returns	object|Boolean
			 -choice	true
			 -choice	false
			 -choice	hash with values for min and or max {min:,max:}
			 -default	false
			 -note		rules for draging left and right
			*/
			dirX: true,

			/*
			 -ref		Df.Drag.pars.dirY
			 -type		Parameter
			 -returns	object|Boolean
			 -choice	true
			 -choice	false
			 -choice	hash with values for min and or max {min:,max:}
			 -default	false
			 -note		rules for draging up and down
			*/
			dirY: true,

			/*
			 -ref		Df.Drag.pars.onStart
			 -type		Parameter
			 -returns	Function
			 -default	false
			 -note		anonymous function
			 -note		sends class instance as the only argument
			*/
			onStart: false,

			/*
			 -ref		Df.Drag.pars.onDrag
			 -type		Parameter
			 -returns	Function
			 -default	false
			 -note		anonymous function
			 -note		sends class instance as the only argument
			*/
			onDrag: false,

			/*
			 -ref		Df.Drag.pars.onDragX
			 -type		Parameter
			 -returns	Function
			 -default	false
			 -note		anonymous function
			 -note		sends class instance as the only argument
			*/
			onDragX: false,

			/*
			 -ref		Df.Drag.pars.onDragY
			 -type		Parameter
			 -returns	Function
			 -default	false
			 -note		anonymous function
			 -note		sends class instance as the only argument
			*/
			onDragY: false,

			/*
			 -ref		Df.Drag.pars.onStop
			 -type		Parameter
			 -returns	Function
			 -default	false
			 -note		anonymous function
			 -note		sends class instance as the only argument
			*/
			onStop: false,

			/*
			 -ref		Df.Drag.pars.onEnable
			 -type		Parameter
			 -returns	Function
			 -default	false
			 -note		anonymous function
			 -note		sends class instance as the only argument
			*/
			onEnable: false,

			/*
			 -ref		Df.Drag.pars.onDisable
			 -type		Parameter
			 -returns	Function
			 -default	false
			 -note		anonymous function
			 -note		sends class instance as the only argument
			*/
			onDisable: false,

			/*
			 -ref		Df.Drag.pars.dragElement
			 -type		Parameter
			 -returns	Array
			 -default	false
			 -note		accepts string CSS selector like 'div.dragable'
			*/
			dragElement: false
		});
		this.setPars(pars)
	},

	/*
	 -ref		Df.Drag.enable
	 -type		Method
	 -returns	Df.Drag
	 -arg		Df.Drag.pars pars
	 -fire		this.element :enable
	 -fire		this :enable
	 -note		enables the element to be dragable
	*/
	enable: function(pars){
		this.setPars(pars)

		this.element.fire(':enable');
		this.fire(':enable');

		if(this.pars.onEnable){
			this.pars.onEnable(this)
		}

		if(this.pars.dragElement){
			this.element.select(this.pars.dragElement).each(function(v){
				Event.observe(v,'mousedown', this._startIt);
			}.bind(this));
		}else{
			Event.observe(this.element,'mousedown', this._startIt);
		}

		return this
	},

	/*
	 -ref		Df.Drag.disable
	 -type		Method
	 -returns	Df.Drag
	 -arg		Df.Drag.pars pars
	 -fire		this.element :disable
	 -fire		this :disable
	 -note		disable the element from being dragged
	*/
	disable: function(pars){
		this.setPars(pars)

		this.element.fire(':disable');
		this.fire(':disable');

		if(this.pars.onDisable){
			this.pars.onDisable(this)
		}

		if(this.pars.dragElement){
			this.element.select(this.pars.dragElement).each(function(v){
				Event.stopObserving(v,'mousedown', this._startIt);
			}.bind(this));
		}else{
			Event.stopObserving(this.element,'mousedown', this._startIt);
		}

		return this
	},

	/*
	 -ref		Df.Drag.startIt
	 -type		Method
	 -returns	Df.Drag
	 -arg		Df.Drag.pars pars
	 -fire		this.element :start
	 -fire		this :start
	 -note		not intended to be called directly
	*/
	startIt: function(e){

		Event.stop(e);

		Event.observe(document.body,'mousemove', this._followIt);
		Event.observe(document.body,'mouseup', this._stopIt);

		this._offsetX = this.offsetX(e);
		this._offsetY = this.offsetY(e);

		this.element.fire(':start', {e: e})
		this.fire(':start', {e: e})

		if(this.pars.onStart){
			this.pars.onStart(this, e)
		}

		return this
	},

	offsetX: function(e){
		return Event.pointerX(e) - this.getElement().positionedOffset().left
	},

	offsetY: function(e){
		return Event.pointerY(e) - this.getElement().positionedOffset().top
	},

	/*
	 -ref		Df.Drag.stopIt
	 -type		Method
	 -returns	Df.Drag
	 -fire		this.element :stop
	 -fire		this :stop
	 -note		not intended to be called directly
	*/
	stopIt: function(e){
		Event.stop(e);
		Event.stopObserving(document.body,'mousemove', this._followIt)
		Event.stopObserving(document.body,'mouseup',this._stopIt)

		if(this.pars.onStop){
			this.pars.onStop(this, e)
		}
		this.element.fire(':stop', {e: e})
		this.fire(':stop', {e: e})

		return this
	},

	/*
	 -ref		Df.Drag.followIt
	 -type		Method
	 -returns	Df.Drag
	 -fire		this.element :drag
	 -fire		this :drag
	 -note		not intended to be called directly
	*/
	followIt: function(e) {
		Event.stop(e);

		if(this.pars.dirX){
			this.dirX(e)
		}

		if(this.pars.dirY){
			this.dirY(e)
		}

		if(this.pars.onDrag) {
			this.pars.onDrag(this, e)
		}
		this.element.fire(':drag', {e: e})
		this.fire(':drag', {e: e})

		return this
	},

	/*
	 -ref		Df.Drag.dirX
	 -type		Method
	 -returns	Df.Drag
	 -fire		this.element :dragX
	 -fire		this :dragX
	 -note		not intended to be called directly
	*/
	dirX: function(e){

		this._curX = Event.pointerX(e) - this._offsetX;

		if(this.pars.dirX.min || this.pars.dirX.min == 0){
			this.minDirX(e)
		}

		if(this.pars.dirX.max || this.pars.dirX.max == 0){
			this.maxDirX(e)
		}

		this.element.style.left = this._curX + 'px'

		if(this.pars.onDragX){
			this.pars.onDragX(this, e)
		}
		this.element.fire(':dragX', {e: e})
		this.fire(':dragX', {e: e})
	},

	minDirX: function(e){
		if(this._curX < this.pars.dirX.min){
			this._curX = this.pars.dirX.min
		}
	},

	maxDirX: function(e){
		if(this._curX > this.pars.dirX.max){
			this._curX = this.pars.dirX.max
		}
	},

	/*
	 -ref		Df.Drag.dirY
	 -type		Method
	 -returns	Df.Drag
	 -fire		this.element :dragY
	 -fire		this :dragY
	 -note		not intended to be called directly
	*/
	dirY: function(e){
		this._curY = Event.pointerY(e) - this._offsetY

		if(this.pars.dirY.min || this.pars.dirY.min == 0){
			this.minDirY(e)
		}

		if(this.pars.dirY.max || this.pars.dirY.max == 0){
			this.maxDirY(e)
		}

		this.element.style.top = this._curY + 'px'

		if(this.pars.onDragY){
			this.pars.onDragY(this, e)
		}
		this.element.fire(':dragY', {e: e})
		this.fire(':dragY', {e: e})
	},

	minDirY: function(e){
		if(this._curY < this.pars.dirY.min){
			this._curY = this.pars.dirY.min
		}
	},

	maxDirY: function(e){
		if(this._curY > this.pars.dirY.max){
			this._curY = this.pars.dirY.max
		}
	}
});

/*
 -ref		Df.Resize
 -type		Class
 -extends	Df.Drag
 -returns	Df.Resize
 -event		this.element :size
 -event		this.element :sizeHeight
 -event		this.element :sizeWidth
 -event		this :size
 -event		this :sizeHeight
 -event		this :sizeWidth
 -arg		string|Element element an extended dom node or dom node id string
*/
Df.Resize = Class.create(Df.Drag, {

	_setup: function($super){

		delete this.pars.dragElement

		this._curH
		this._curW
		this._pointerX
		this._pointerY
		this._sizeHeight = false
		this._sizeWidth = false
		this._startH
		this._startW
		this._startL
		this._startT
		this._followCursor = this.followCursor.bindAsEventListener(this)

		$super()
	},

	_initPars: function($super, pars){
		$super()
		this.setPars({

			/*
			 -ref		Df.Resize.pars.hitDepth
			 -type		Parameter
			 -returns	Number
			 -default	20
			 -note		padding inside the element that triggers resizing
			*/
			hitDepth: 20,

			/*
			 -ref		Df.Resize.pars.dirH
			 -type		Parameter
			 -returns	Boolean
			 -default	true
			 -note		can resize height
			*/
			dirH: true,

			/*
			 -ref		Df.Resize.pars.dirT
			 -type		Parameter
			 -returns	Boolean
			 -default	true
			 -note		can resize top
			*/
			dirT: true,

			/*
			 -ref		Df.Resize.pars.dirB
			 -type		Parameter
			 -returns	Boolean
			 -default	true
			 -note		can resize bottom
			*/
			dirB: true,

			/*
			 -ref		Df.Resize.pars.dirW
			 -type		Parameter
			 -returns	Boolean
			 -default	true
			 -note		can resize width
			*/
			dirW: true,

			/*
			 -ref		Df.Resize.pars.dirL
			 -type		Parameter
			 -returns	Boolean
			 -default	true
			 -note		can resize left side
			*/
			dirL: true,

			/*
			 -ref		Df.Resize.pars.dirR
			 -type		Parameter
			 -returns	Boolean
			 -default	true
			 -note		can resize right side
			*/
			dirR: true,

			/*
			 -ref		Df.Resize.pars.onSizeHeight
			 -type		Parameter
			 -returns	Function
			 -default	false
			 -note		anonymous function
			 -note		sends class instance as the only argument
			*/
			onSizeHeight: false,

			/*
			 -ref		Df.Resize.pars.onSizeWidth
			 -type		Parameter
			 -returns	Function
			 -default	false
			 -note		anonymous function
			 -note		sends class instance as the only argument
			*/
			onSizeWidth: false,

			/*
			 -ref		Df.Resize.pars.onSize
			 -type		Parameter
			 -returns	Function
			 -default	false
			 -note		anonymous function
			 -note		sends class instance as the only argument
			*/
			onSize: false
		});
		this.setPars(pars)
	},

	/*
	 -ref		Df.Resize.enable
	 -override
	 -type		Method
	 -returns	Df.Resize
	 -fire		this.element :enable
	 -fire		this :enable
	*/
	enable: function(pars){
		this.setPars(pars)

		this.element.fire(':enable');
		this.fire(':enable');

		if(this.pars.onEnable){
			this.pars.onEnable(this)
		}

		Event.observe(this.element,'mousemove', this._followCursor);

		Event.observe(this.element,'mousedown', this._startIt);

		return this
	},

	/*
	 -ref		Df.Resize.disable
	 -override
	 -returns	Df.Resize
	 -type		Method
	 -fire		this.element :disable
	 -fire		this :disable
	*/
	disable: function(pars){
		this.setPars(pars)

		this.element.style.cursor = 'auto'

		this.element.fire(':disable');
		this.fire(':disable');

		if(this.pars.onDisable){
			this.pars.onDisable(this)
		}

		Event.stopObserving(this.element,'mousemove', this._followCursor);

		Event.stopObserving(this.element,'mousedown', this._startIt);

		return this
	},

	followCursor: function(e){
		this._pointerX = this.element.getPointerX(e)
		this._pointerY = this.element.getPointerY(e)

		if(this._pointerY <= this.pars.hitDepth){
			this._sizeHeight = 'top'
		}else if (this._pointerY >= this.element.getHeight() - this.pars.hitDepth) {
			this._sizeHeight = 'bottom'
		} else {
			this._sizeHeight = false
		}

		if(this.element.getWidth() <= this.pars.hitDepth){
			if(this.pars.dirR){
				this._sizeWidth = 'right'
			}
		}
		else if(this._pointerX <= this.pars.hitDepth){
			this._sizeWidth = 'left'
		} else if (this._pointerX >= this.element.getWidth() - this.pars.hitDepth){
			this._sizeWidth = 'right'
		} else {
			this._sizeWidth = false
		}

		if(this._sizeWidth !== false && this._sizeHeight !== false){
			if(this._sizeWidth == 'left' && this._sizeHeight == 'top'){
				if(this.pars.dirW && this.pars.dirL && this.pars.dirH && this.pars.dirT){
					this.element.style.cursor = 'nw-resize'
				}
				else if (this.pars.dirW && this.pars.dirL) {
					this.element.style.cursor = 'w-resize'
				}
				else if (this.pars.dirH && this.pars.dirT) {
					this.element.style.cursor = 'n-resize'
				}
				else {
					this.element.style.cursor = 'auto'
				}
			}
			else if(this._sizeWidth == 'left' && this._sizeHeight == 'bottom'){
				if(this.pars.dirW && this.pars.dirL && this.pars.dirH && this.pars.dirB){
					this.element.style.cursor = 'sw-resize'
				}
				else if (this.pars.dirW && this.pars.dirL) {
					this.element.style.cursor = 'w-resize'
				}
				else if (this.pars.dirH && this.pars.dirB) {
					this.element.style.cursor = 's-resize'
				}
				else {
					this.element.style.cursor = 'auto'
				}
				
			}
			if(this._sizeWidth == 'right' && this._sizeHeight == 'top'){
				if(this.pars.dirW && this.pars.dirR && this.pars.dirH && this.pars.dirT){
					this.element.style.cursor = 'ne-resize'
				}
				else if (this.pars.dirW && this.pars.dirR) {
					this.element.style.cursor = 'e-resize'
				}
				else if (this.pars.dirH && this.pars.dirT) {
					this.element.style.cursor = 'n-resize'
				}
				else {
					this.element.style.cursor = 'auto'
				}
			}
			else if(this._sizeWidth == 'right' && this._sizeHeight == 'bottom'){
				if(this.pars.dirW && this.pars.dirR && this.pars.dirH && this.pars.dirB){
					this.element.style.cursor = 'se-resize'
				}
				else if (this.pars.dirW && this.pars.dirR) {
					this.element.style.cursor = 'e-resize'
				}
				else if (this.pars.dirH && this.pars.dirB) {
					this.element.style.cursor = 's-resize'
				}
				else {
					this.element.style.cursor = 'auto'
				}
			}
			else {
				this.element.style.cursor = 'auto'
			}
		}
		else if(this._sizeWidth == false && this._sizeHeight !== false ){
			if(this._sizeHeight == 'top' && this.pars.dirH && this.pars.dirT){
				this.element.style.cursor = 'n-resize'
			}
			else if(this._sizeHeight == 'bottom' && this.pars.dirH && this.pars.dirB){
				this.element.style.cursor = 's-resize'
			}
			else {
				this.element.style.cursor = 'auto'
			}
		}
		else if(this._sizeWidth !== false && this._sizeHeight == false){
			if (this._sizeWidth == 'left' && this.pars.dirW && this.pars.dirL){
				this.element.style.cursor = 'w-resize'	
			}
			else if (this._sizeWidth == 'right' && this.pars.dirW && this.pars.dirR) {
				this.element.style.cursor = 'e-resize'	
			}
			else {
				this.element.style.cursor = 'auto'
			}
		}
		else {
			this.element.style.cursor = 'auto'
		}
	},

	/*
	 -ref		Df.Resize.followIt
	 -override
	 -returns	Df.Resize
	 -fire		this.element :start
	 -fire		this :start
	 -type		Method
	 -note		not intended to be called directly
	*/
	startIt: function(e){
		if(this.element.style.cursor == 'auto')
		{

			return;
		}
		Event.stop(e);
		Event.stopObserving(this.element,'mousemove', this._followCursor);

		this._offsetX = this.offsetX(e)
		this._offsetY = this.offsetY(e)

		this._startH = this.element.getHeight()
		this._startW = this.element.getWidth()

		this._startL = parseInt(this.element.getStyle('left'))
		this._startT = parseInt(this.element.getStyle('top'))

		this._curX = Event.pointerX(e) - this._offsetX
		this._curY = Event.pointerY(e) - this._offsetY

		if(this._sizeHeight || this._sizeWidth){
			Event.observe(document.body,'mousemove', this._followIt);
			Event.observe(document.body,'mouseup', this._stopIt);
		}

		if(this.pars.onStart){
			this.pars.onStart(this, e)
		}

		this.element.fire(':start', {e: e})
		this.fire(':start', {e: e})

		return this
	},

	stopIt: function($super, e){
		$super(e)
		Event.observe(this.element,'mousemove', this._followCursor);
		return this
	},

	/*
	 -ref		Df.Resize.followIt
	 -override
	 -returns	Df.Resize
	 -type		Method
	 -fire		this.element :size
	 -fire		this :size
	 -note		not intended to be called directly
	*/
	followIt: function($super, e) {
		Event.stop(e);

		if(this.pars.dirH && this._sizeHeight ){
			if(this._sizeHeight == 'top' && this.pars.dirT){
				this.dirY(e)
			}
			this.dirH(e)
		}

		if(this.pars.dirW && this._sizeWidth){
			if(this._sizeWidth == 'left' && this.pars.dirL){
				this.dirX(e)
			}
			this.dirW(e)
		}

		if(this.pars.onSize){
			this.pars.onSize(this, e)
		}
		this.element.fire(':size', {e: e})
		this.fire(':size', {e: e})

		return this
	},

	/*
	 -ref		Df.Resize.dirH
	 -type		Method
	 -fire		this.element :sizeHeight
	 -fire		this :sizeHeight
	 -note		not intended to be called directly
	*/
	dirH: function(e){
		if(this._sizeHeight == 'top' && this.pars.dirT){
			this._curH = this._startH + (this._startT - this._curY)
		} else if (this._sizeHeight == 'bottom' && this.pars.dirB){
			this._curH = this.element.getPointerY(e) + (this._startH - this._pointerY)
		}

		if(this._curH < 0){
			this._curH = 0;
		}

		this.element.style.height = this._curH + 'px'

		if(this.pars.onSizeHeight){
			this.pars.onSizeHeight(this, e)
		}
		this.element.fire(':sizeHeight', {e: e})
		this.fire(':sizeHeight', {e: e})
	},

	/*
	 -ref		Df.Resize.dirW
	 -type		Method
	 -fire		this.element :sizeHeight
	 -fire		this :sizeHeight
	 -note		not intended to be called directly
	*/
	dirW: function(e){
		if(this._sizeWidth == 'left' && this.pars.dirL){
			this._curW = this._startW + (this._startL - this._curX)
		} else if (this._sizeWidth == 'right' && this.pars.dirR){
			this._curW = this.element.getPointerX(e) + (this._startW - this._pointerX)
		}

		if(this._curW < 0){
			this._curW = 0;
		}

		this.element.style.width = this._curW + 'px'

		if(this.pars.onSizeWidth){
			this.pars.onSizeWidth(this, e)
		}
		this.element.fire(':sizeWidth', {e: e})
		this.fire(':sizeWidth', {e: e})
	}
});

/*
 -ref           Df.DictionaryCollection
 -extends       Df.Event
 -type          Class
 -arg           pars Array array of objects
 -returns       Df.DictionaryCollection
*/
Df.DictionaryCollection = Class.create(Df.Event, {
	initialize: function(ary){
	    this.ary = ary || []
	},

	'get': function(){
	    return this.ary
	},

	'set': function(ary){
	    this.ary = ary
	    return this
	},

	'push': function(hash){
	    this.ary.push(hash)
	    return this
	},

	'splice': function(index, howmany){
	    this.ary.splice(index, howmany)
	    return this
	},

	keys: function(){
	    return $H(this.ary[0]).keys()
	},

	extend: function(ary){
	    this.ary = this.ary.concat(ary)
	    return this
	},

	getBy: function(filters){
	    return Df.DictionaryCollection.getRecordsByAttributes(this.ary, filters)
	},

	getByGroups: function(attributes){
	    if(Object.isUndefined(attributes)){
		attributes = this.keys()
	    }
	    return Df.DictionaryCollection.groupRecordsByAttributes(this.ary, attributes)
	},

	getAttributeValues: function(attribute){
	    return Df.DictionaryCollection.getAttributeValues(this.ary, attribute)
	}
})

Df.DictionaryCollection.getAttributeValues = function(records, attribute){
	var h = []
	var l = records.length
	for(var i=0; i<l; i++){
		if(!h.include(records[i][attribute])){
		    h.push(records[i][attribute])
		}
	}
	return h
}

Df.DictionaryCollection.groupRecordsByAttributes = function(records, attributes){
	var h = {}
	var l = records.length
	for(var i=0; i<l; i++){
		for(p in records[i]){
			if(Object.toArray(attributes).include(p)){
			    if(Object.isUndefined(h[p])){
				h[p] = []
			    }
			    if(h[p].find(function(v){
				    if(this.par == v[0]){
					v[1].push(this.rec)
					return true
				    }else{
					return false
				    }
				}.bind({par:records[i][p], rec:records[i]}))){
			    }else{
				h[p].push([records[i][p], [records[i]]])
			    }
			}
		}
	}
	return h
}

Df.DictionaryCollection.getRecordsByAttributes = function(records, filters){
	return records.findAll(function(v){
	    var test = true
	    for (var p in filters) {
		if(!Object.toArray(filters[p]).include(v[p])){
		    test = false
		}
	    }
	    return test
	})
}


Df.XMLDocument = Class.create({
        initialize: function(string){

            this.document

            if(string){
                this.load(string)
            }
            return this
        },

        load: function(string){
                try{
			this.document = new DOMParser().parseFromString(string,"text/xml")
			return this
                } catch(e){
                    try{
			this.document = new ActiveXObject("Microsoft.XMLDOM")
			this.document.async="false"
			this.document.loadXML(string)
			return this
                    } catch(e) {
                        return false
                    }

                }
        },

        getRoot: function(){
            return $XML(this.document.firstChild)
        },

        xpath: function(exp){
                try{
                        var nodes = this.document.evaluate(exp, this.document, null, XPathResult.ANY_TYPE, null)
                        var a = []
                        var r = nodes.iterateNext()
                        while (r) {
                                a.push(r)
                                r = nodes.iterateNext()
                        }
                        return a
                } catch (e) {
                        try {
                                this.document.setProperty("SelectionLanguage","XPath")
                                return this.document.selectNodes(exp)
                        } catch (e) {
                                return false
                        }
                }
        }
})

Df.XMLNode = {
    _df_extended: true,

    remove: function(){
        this.parentNode.removeChild(this)
        return this
    },

    childElements: function(){
        var a = []
        for(var i=0; i<this.childNodes.length; i++){
            if(this.childNodes[i].nodeType == 1)
                a.push($XML(this.childNodes[i]))
        }
        return $A(a)
    },

    previousSiblings: function(){
        function previous(node){
            if(node.nodeType == 1){
                a.push(node)
            }
            if(node.previousSibling){
                next(node.previousSibling)
            }
        }

        var a = []

        if(this.previousSibling)
            previous(this.previousSibling)

        return $A(a)
    },

    previous: function(){
        s = this.previousSiblings()
        if(s.length > 0)
            return s[0]
        else
            return null
    },

    nextSiblings: function(){
        function next(node){
            if(node.nodeType == 1){
                a.push(node)
            }
            if(node.nextSibling){
                next(node.nextSibling)
            }
        }

        var a = []

        if(this.nextSibling)
            next(this.nextSibling)

        return $A(a)
    },

    next: function(){
        s = this.nextSiblings()
        if(s.length > 0)
            return s[0]
        else
            return null
    },

    down: function(){
        if(this.childElements().length > 0)
            return this.childElements()[0]
        else
            return null
    },

    up: function(){
        return $XML(this.parentNode)
    }
}

var $XML = function(node){
    if(Object.isUndefined(node._df_extended)){
        Object.extend(node, Df.XMLNode)
    }
    return node
}


/*
 -ref           Df.AjaxCacheManager
 -extends       Df.Base
 -type          Class
 -arg           pars Object Class Options Object
 -note          caches ajax calls based on a url
 -returns       Df.AjaxCacheManager
 -event         this :LoadSuccess
 -event         this :ItemSelection
 -event         this :LoadFailure
 -event         this :LoadException
*/
Df.AjaxCacheManager = Class.create(Df.Base, {

    _setup: function($super){

	this._loadSuccessObserver = this.loadSuccessObserver.bind(this)
	this.observe(':LoadSuccess', this._loadSuccessObserver)

	$super()

	this._createGetters()
	this._createSetters()
    },

    _initPars: function($super, pars){
	$super()
	this.setPars({
		ajaxRequestOptions: {},
		serviceBaseUrl: '',
		cacheInstance: $H(),
		uri: 'uri'
        })
	this.setPars(pars)
    },

    /*
     -ref               Df.AjaxCacheManager.get
     -type              method
     -returns           Df.AjaxCacheManager
     -arg               uri String
    */
    'get': function(uri){
	if(this.getCacheInstance().get(uri)){
	    this.fireSelectionEvent(uri)
	} else {
	    this.callService(uri)
	}
	return this
    },

    fireSelectionEvent: function(uri){
	this.fire(':ItemSelection', {object: this.getCacheInstance().get(uri)})
    },

    loadSuccessObserver: function(e){
	var json = e.memo.transport.responseText.evalJSON()
	this.getCacheInstance().set( json.uri, json )
	this.fireSelectionEvent(json.uri)
    },

    uriFormatter: function(uri){
	var u = {}
	u[this.getUri()] = uri
	return u
    },

    callService: function(uri){
	var opts = {
	    onSuccess: function(transport) {
		this.fire(':LoadSuccess', {transport: transport})
	    }.bind(this),

	    onFailure: function(transport, e) {
		this.fire(':LoadFailure', {transport: transport, error: e})
	    }.bind(this),

	    onException: function(transport, e) {
		this.fire(':LoadException', {transport: transport, exception: e})
	    }.bind(this)
	}

	Object.extend(opts, this.getAjaxRequestOptions())
	if(opts.parameters && this.getUri()){
		Object.extend(opts.parameters, this.uriFormatter(uri))
	}
	new Ajax.Request(this.getServiceBaseUrl(), opts);
    }
})

/*
 -ref		Df.Anchor
 -type		Static Class
 -returns	Df.Scripts
 -note		Class for managing achchor tags
 -example	<script type="text/javascript">
			$(document).observe('dom:loaded', function(e){
				$(document.body).observe('click', function(ee){
					Df.Anchor.rewriteHandler(ee)
				})
			})
		</script>
*/
Df.Anchor = {
	/*
	 -ref		Df.Anchor.addClickHandlers
	 -type		Static Method
	 -extends	Df.Base
	 -returns	Df.Scripts
	 -note		Rewrite all anchor tags with rel tags set as indicated below
	 -note		syntax
	 -note		rel="redir:p+n=v|p-n=v|h+v|h-
	 -note		p+ adds a name value pair
	 -note		p- removes a name value pair
	 -note		h+ changes the hash
	 -note		h- removes the hash
	 -hint		don't attach to individual a tags. this is meant to bubble.
	 -example	<script type="text/javascript">
				$(document).observe('dom:loaded', function(e){
					$(document.body).observe('click', function(ee){
						Df.Anchor.rewriteHandler(ee)
					})
				})
			</script>
	*/
	rewriteHandler: function(e) {
		// Rewrite all anchor tags with rel tags set as indicated below
		//syntax
		//rel="redir:p+n=v|p-n=v|h+v|h-
		//p+ adds a name value pair
		//p- removes a name value pair
		//h+ changes the hash
		//h- removes the hash

		//disect current href
		if(e.target.tagName.toLowerCase() == "a"){
			if(e.target.rel.match(/^redir:/)){
				e.stop();
				var url = {q:[]}
				var parts = e.target.href.split(/\?|\#/)
				url.d = parts.shift()
				while(parts.length > 0){
					var p = parts.shift()
					if (p.indexOf('=') > -1)
						url.q = p.split('&')
					else
						url.h = p
				}
				//append redir
				parts = e.target.rel.replace('redir:','').split('|')
				while(parts.length > 0){
					var p = parts.shift()
					if (p.indexOf('p+') > -1)
						url.q.push(p.replace('p+',''))
					else if (p.indexOf('p-') > -1)
						url.q = $A(url.q).without(p.replace('p-',''))
					else if (p.indexOf('h+') > -1)
						url.h = p.replace('h+','')
					else if (p.indexOf('h-') > -1)
						url.h = false
				}
				//change href
				var newLocation = url.d
				if(url.q.length > 0) newLocation += '?' + url.q.join('&')
				if(url.h) newLocation += '#' + url.h
				window.location = newLocation
			}
		}
	}
}

//Dummy Class For Debugging in Console
Df.console = {
	log: function(){
		return;
	},

	debug: function(){
		return;
	},

	info: function(){
		return;
	},

	warn: function(){
	       return;
	},

	error: function(){
		return;
	},

	dir: function(){
		return;
	}
}
//add element methods
Element.addMethods({

	dropnav: function(element, pars){
		return new Df.Dropnav( $(element), pars )
	},

	tabset: function(element, pars){
		return new Df.Tabset( $(element), pars )
	},

	accordion: function(element, pars){
		return new Df.Accordion( $(element), pars )
	},

	cardset: function(element, pars){
		return new Df.Cardset( $(element), pars )
	}
});

/*
 ref:		Df.NavCollection
 extends:	Df.UiCollection
 returns:	Df.NavCollection
 type:		Class
*/
Df.NavCollection = Class.create(Df.UiCollection, {

	_initPars: function($super, pars){
		$super()
		this.setPars({
			eventType: 'hover',
			onShow: false,
			onHide: false,
			scrollbars: false,
			forceClose: true
		});
		this.setPars(pars)
	},

	/** @private */
	buildItems: function(){
		var elem = this.element.immediateDescendants();

		for(var i=0; i<elem.length; i++){
			if(this.pars.displayStateId){
				this.pars.displayStateId += '_' + i
			}
			this.items.push( new Df.NavItem( $(elem[i]), this.pars ));
		}

	}
});

/*
 ref:		Df.NavItem
 extends:	Df.TogglePane
 returns:	Df.NavItem
 type:		Class
*/
Df.NavItem = Class.create(Df.TogglePane, {
	initialize: function($super, element, pars){
		$super(element, pars)

		this.iframe = false

		return this;
	},

	showClickObserver: function(){
		if(this.pars.forceClose){
			this.pars.collection.showOnlyItem(this)
		}else{
			this.show()
		}
	}
});

/*
 ref:		Df.Accordion
 extends:	Df.NavCollection
 returns:	Df.Accordion
 type:		Class
*/
Df.Accordion = Class.create(Df.NavCollection, {

	_initPars: function($super, pars){
		$super()
		this.setPars({
			eventType: 'click',
			forceClose: false
		});
		this.setPars(pars)
	},

	buildItems: function(){
		var elem = this.element.immediateDescendants();

		for(var i=0; i<elem.length; i++){

			if(elem[i].tagName == "DT" && elem[i].next('dd')){
				if(this.pars.displayStateId){
					this.pars.displayStateId += '_' + i
				}
				Object.extend(this.pars, {
					controller: new Df.Ui(elem[i])
				});
				this.items.push( new Df.NavItem( $(elem[i]).next('dd'), this.pars ));
			}

		}
	}
});

/*
 ref:		Df.Dropnav
 extends:	Df.NavCollection
 returns:	Df.Dropnav
 type:		Class
*/
Df.Dropnav = Class.create(Df.NavCollection, {
	
	_initPars: function($super, pars){
		$super()
		this.setPars({
			iframe: true,
			forceClose: true
		});
		this.setPars(pars)
	},

	/*_setup: function($super){
		if(this.pars.eventType === 'click' ){
			Event.observe(document.body,'click', function(e){
				this.bodyClickEvent(e);
			}.bind(this) );
		}
		$super()
	},*/

	bodyClickEvent: function(e){
		this.hideItems();
	},

	buildItems: function(){

		var elem = this.element.immediateDescendants();

		for(var i=0; i<elem.length; i++){
			if($(elem[i]).down('ul')){
				if(this.pars.displayStateId){
					this.pars.displayStateId += '_' + i
				}
				Object.extend(this.pars, {
					controller: new Df.Ui(elem[i])
				});

				this.items.push( new Df.NavItem( $(elem[i]).down('ul'), this.pars ));
			}
		}

	}
});

/*
 ref:		Df.Cardset
 extends:	Df.NavCollection
 returns:	Df.Cardset
 type:		Class
*/
Df.Cardset = Class.create(Df.NavCollection, {
	_initPars: function($super, pars){
		$super()
		this.setPars({
			treatAsMenu: false,
			showClassName: 'active',
			hideClassName: false,
			activeControllerClassName: false
		});
		this.setPars(pars)
	},

	animationCompleteEvent: function(e){
		return
	},

	buildItems: function(){

		var elem = this.element.immediateDescendants();

		for(var i=0; i<elem.length; i++){
			if(this.pars.displayStateId){
				this.pars.displayStateId += '_' + i
			}
			Object.extend(this.pars, {
				controller: new Df.Ui(elem[i])
			});
			
			this.items.push( new Df.CardsetItem( $(elem[i]), this.pars ));
		}
	}
});

/*
 ref:		Df.CardsetItem
 extends:	Df.NavItem
 returns:	Df.CardsetItem
 type:		Class
*/
Df.CardsetItem = Class.create(Df.NavItem, {

	animationCompleteEvent: function(e){
		return
	},

	controllerClickObserver: function(e){
		Event.stop(e);
		this.show()
		return this
	},

	controllerHoverOutObserver: function(e){
		Event.stop(e);
		this.status = false
		return this
	},

	_show: function(){
		this.status = true
		this._showByStatus()
	},

	_showByStatus: Df.Ui.prototype.showByStatus,

	showByStatus: function(){
		if( this.status){
			var index = this.pars.collection.getInstanceItemIndex(this)

			for (var i=0; i<index; i++) {
				this.pars.collection.items[i].hide()

				if(this.pars.collection.pars.hideClassName){
					this.pars.collection.items[i].getElement().addClassName(this.pars.collection.pars.hideClassName)
				}

				if(this.pars.collection.pars.showClassName){
					this.pars.collection.items[i].getElement().removeClassName(this.pars.collection.pars.showClassName)
				}
			}

			for (var i=index; i<this.pars.collection.items.length; i++) {
				this.pars.collection.items[i]._show()

				if(this.pars.collection.pars.hideClassName){
					this.pars.collection.items[i].getElement().addClassName(this.pars.collection.pars.hideClassName)
				}

				if(this.pars.collection.pars.showClassName){
					this.pars.collection.items[i].getElement().removeClassName(this.pars.collection.pars.showClassName)
				}

			}

			if(this.pars.collection.pars.showClassName){
				this.getElement().addClassName(this.pars.collection.pars.showClassName)
			}

			if(this.pars.collection.pars.hideClassName){
				this.getElement().removeClassName(this.pars.collection.pars.hideClassName)
			}
		}

		return this
	}
});

/*
 ref:		Df.Tabset
 extends:	Df.NavCollection
 returns:	Df.Tabset
 type:		Class
*/
Df.Tabset = Class.create(Df.NavCollection, {
	_initPars: function($super, pars){
		$super()
		this.setPars({
			eventType: 'click',
			forceClose: true,
			treatAsMenu: false,
			hideClassName: 'df_element_hidden',
			showClassName: 'df_element_visible'
		});
		this.setPars(pars)
	},

	buildItems: function(){
		var elem = this.element.immediateDescendants();

		for(var i=0; i<elem.length; i++){

			if(elem[i].tagName == "DT" && elem[i].next('dd')){
				if(this.pars.displayStateId){
					this.pars.displayStateId += '_' + i
				}
				Object.extend(this.pars, {
					controller: new Df.Ui(elem[i])
				});
				this.items.push( new Df.TabsetItem( $(elem[i]).next('dd'), this.pars ));
			}

		}
	}
});

/*
 ref:		Df.TabsetItem
 extends:	Df.NavItem
 returns:	Df.TabsetItem
 type:		Class
*/
Df.TabsetItem = Class.create(Df.NavItem, {
	controllerHoverOutObserver: function(e){
		Event.stop(e);
		this.status = false
		return this
	},

	showByStatus: function(){

		if( this.status && !this.displayStatus ){

			this.pars.collection.hideItems()

			this.showActions()
		}

		return this;
	},

	hideClickObserver: function(e){
		return
	}

});
/*
 ref:		Element.tooltip
 returns:	Df.Tip
 delegate:	Df.Tip
 type:		Method
 arg:		Object pars
 example:	<script type="text/javascript">
			$('xxx').tooltip();
		</script>
*/
Element.addMethods({
	tip: function(element, pars){
		return new Df.Tip($(element), pars);
	}
});


Df._TipMixin = {

/*	This is not needed - it's creating extra TIP Holder
	initialize: function($super, element, pars){
		$super(element, pars)
		this._setup()
		return this
	},*/

	_initPars: function($super, pars){
		$super()
		this.setPars({
			data:'some sample text for the tool tip',
			className:'holder',
			parent: document.body,
			xOffset: 0,
			yOffset: 0,
			xOffsetPointer: 0,
			yOffsetPointer: 0,
			treatAsMenu: true,
			controller: this,
			eventType: 'hover', //hover|click
			toggleShowDelay: 250,
			toggleHideDelay: 250,
			fitInPage: true,
			animate: false,
			xOrientation: 'left', //left|right|center
			yOrientation: 'top', //top|bottom|center
			pointerOrientation: 'left',//left|right|top|bottom
			iframe:true
		});
		this.setPars(pars)
	},

	_setup: function($super){

		this.pointer
		this.tip
		this.holder
		this.togglePane
		this.tipHeight
		this.tipWidth
		this.eleHeight
		this.eleWidth
		this.holderHeight
		this.holderWidth
		this.pointerHeight
		this.pointerWidth
		this.elePosTop
		this.elePosLeft
		this.maxHeight
		this.maxWidth
		this.offSetTop
		this.offsetLeft


		this.holder = $(this.pars.parent).e('div', 'bottom', {className:this.pars.className});
		this.tip = this.holder.e('div', 'bottom', {className:'tip'});
		if (this.pars.pointerOrientation)
			this.pointer = this.holder.e('div', 'bottom', {className: this.pointerClassName() });

		this.togglePane = new Df.TogglePane(this.holder, {
			controller: this.pars.controller,
			iframe:this.pars.iframe,
			animate: this.pars.animate,
			treatAsMenu: this.pars.treatAsMenu,
			eventType: this.pars.eventType,
			toggleShowDelay: this.pars.toggleShowDelay,
			toggleHideDelay: this.pars.toggleHideDelay
		});

		if(!Object.isUndefined(this.element))
			this.setContent(this.pars.data)

		this._showObserver()
		this._positionObserver()
        },

	_showObserver: function(){
		this.holder.observe(':show', function(e){
			this._show(e)
			this.holder.style.height = this.tipHeight + 'px';
			this.holder.style.width = this.tipWidth + 'px';
			this.getElement().fire(':position')
		}.bind(this));
	},

	_show: function(e){
		this.holder.style.display = 'block';
		this.setElementDems();
		try{
			this.holder.style.height = this.tipHeight + 'px';
		} catch(e){
		}
		try{
			this.holder.style.width = this.tipWidth + 'px';
		} catch(e){
		}
	},

	_positionObserver: function(){
		this.element.observe(':position', function(e){
			this._position(e)
		}.bind(this))
	},

	_position: function(e){
		e.stop()
		
		try{
			if(this.holder.style.display == 'block'){
				this.setPos();
				this.positionTip();
				//position for pointer
				if(this.pars.pointerOrientation){
					this.positionPointer();
				}
	
				//readjust to fit inside window
				if(this.pars.fitInPage){
					this.adjustToPage();
				}
			}
		} catch(e){
		}
	},

	setContent: function(content){
		this.holder.style.display = 'block';
		this.holder.style.visibility = 'hidden';

		this.tip.update(content)

		this.setDems();
		this.setPos();

		this.holder.style.display = 'none';
		this.holder.style.visibility = 'visible';

		return this
	},

	setElementDems: function(){
		this.eleHeight = parseInt(this.element.getDimensions().height)
		this.eleWidth = parseInt(this.element.getDimensions().width)
	},

	setDems: function(){
		this.tipHeight = parseInt(this.tip.getDimensions().height)
		this.tipWidth = parseInt(this.tip.getDimensions().width)

		this.setElementDems()

		this.holderHeight = parseInt(this.holder.getDimensions().height)
		this.holderWidth = parseInt(this.holder.getDimensions().width)

		if(this.pars.pointerOrientation){
			this.pointerHeight = parseInt(this.pointer.getDimensions().height)
			this.pointerWidth = parseInt(this.pointer.getDimensions().width)
		}

	},

	setPos: function(){

		this.elePosLeft = this.element.cumulativeOffset().left
		this.elePosTop = this.element.cumulativeOffset().top

		if(this.pars.parent != document.body){
			this.elePosLeft -= this.pars.parent.cumulativeOffset().left
			this.elePosTop -= this.pars.parent.cumulativeOffset().top
		}

		this.maxHeight = parseInt(Element.getDimensions(document.body).height)
		this.maxWidth = parseInt(Element.getDimensions(document.body).width)
		this.offSetTop = parseInt(Position.realOffset(this.holder)[1])
		this.offsetLeft = parseInt(Position.realOffset(this.holder)[0])
	},

	pointerClassName: function(){
		var cln = 'pointer';
		if( this.pars.yOrientation == 'top' && this.pars.pointerOrientation == 'top') {
			cln += 'T';
		}else if( this.pars.xOrientation == 'left' && this.pars.pointerOrientation !== 'bottom') {
			cln += 'L';
		}
		else if(this.pars.xOrientation == 'right' && this.pars.pointerOrientation !== 'bottom'){
			cln += 'R';
		}
		else {
			cln += 'B';
		}
		return cln
	},

	positionTip: function(){
		
		//align to the right
		if(this.pars.xOrientation == "right"){
			this.holder.style.left = this.elePosLeft + this.eleWidth + this.pars.xOffset + 'px';
		}
		//align to the left
		else if(this.pars.xOrientation == "left"){
			this.holder.style.left = this.elePosLeft - this.holderWidth - this.pars.xOffset + 'px';
		}
		//align centered on x axis
		else if(this.pars.xOrientation == "center"){
			this.holder.style.left = this.elePosLeft - (this.holderWidth/2) + ((this.eleWidth)/2) + this.pars.xOffset + 'px';
		}

		//align on top
		if(this.pars.yOrientation == "top"){
			this.holder.style.top = this.elePosTop - this.tipHeight - this.pars.yOffset + 'px';
		}
		//align to the bottom
		else if(this.pars.yOrientation == "bottom"){
			this.holder.style.top = this.elePosTop + this.eleHeight + this.pars.yOffset + 'px';
		}
		//align middle on y axis
		else if(this.pars.yOrientation == "center"){
			this.holder.style.top = this.elePosTop + ((this.eleHeight/2)-(this.tipHeight/2)) + this.pars.yOffset + 'px';
		}
	},

	positionPointer: function(){
		this.pointer.style.display = 'block';
		this.pointer.style.top = '0px';
		this.pointer.style.left = '0px';

		if(this.pars.xOrientation == "left" && this.pars.yOrientation == "top"){
			if(this.pars.pointerOrientation == "left"){
				this.pointerLeft()
				this.pointerSunkenTop()
			}
			else if(this.pars.pointerOrientation == "top"){
				this.pointerTop()
				this.pointerSunkenLeft()
			}
		}
		else if(this.pars.xOrientation == "center" && this.pars.yOrientation == "top"){
			this.pointerTop()
			this.pointerCenterX()
		}
		else if(this.pars.xOrientation == "right" && this.pars.yOrientation == "top"){
			if(this.pars.pointerOrientation == "right"){
				this.pointerRight()
				this.pointerSunkenTop()
			}
			else if(this.pars.pointerOrientation == "top"){
				this.pointerTop()
				this.pointerSunkenRight()
			}
		}
		else if(this.pars.xOrientation == "left" && this.pars.yOrientation == "center"){
			this.pointerLeft()
			this.pointerCenterY()
		}
		else if(this.pars.xOrientation == "right" && this.pars.yOrientation == "center"){
			this.pointerRight()
			this.pointerCenterY()
		}
		else if(this.pars.xOrientation == "right" && this.pars.yOrientation == "bottom"){
			if(this.pars.pointerOrientation == "right"){
				this.pointerRight()
				this.pointerSunkenBottom()
			}
			else if(this.pars.pointerOrientation == "bottom"){
				this.pointerBottom()
				this.pointerSunkenRight()
			}
		}
		else if(this.pars.xOrientation == "center" && this.pars.yOrientation == "bottom"){
			this.pointerBottom()
			this.pointerCenterX()
		}
		else if(this.pars.xOrientation == "left" && this.pars.yOrientation == "bottom"){
			if(this.pars.pointerOrientation == "left"){
				this.pointerLeft()
				this.pointerSunkenBottom()
			}
			else if(this.pars.pointerOrientation == "bottom"){
				this.pointerBottom()
				this.pointerSunkenLeft()
			}
		}
	},

	pointerTop: function(){
		try{
			this.holder.style.height = this.tipHeight + this.pointerHeight + this.pars.yOffsetPointer + 'px';
		}catch(e){}
		this.holder.style.top = parseInt(this.holder.style.top) - this.pointerHeight + -this.pars.yOffsetPointer + 'px';
		this.pointer.style.top = this.tipHeight + this.pars.yOffsetPointer + 'px';
	},

	pointerBottom: function(){
		this.holder.style.height = this.tipHeight + this.pointerHeight + this.pars.yOffsetPointer + 'px';
		this.tip.style.top = this.pointerHeight + this.pars.yOffsetPointer + 'px';
	},

	pointerSunkenTop: function(){
		this.holder.style.top = parseInt(this.holder.style.top) + this.pointerHeight - this.pars.yOffsetPointer + 'px';
		this.pointer.style.top = this.tipHeight - this.pointerHeight + this.pars.yOffsetPointer + 'px';
	},

	pointerSunkenBottom: function(){
		this.holder.style.top = parseInt(this.holder.style.top) - this.pointerHeight + this.pars.yOffsetPointer + 'px';
		this.pointer.style.top = -this.pars.yOffsetPointer + 'px';
	},

	pointerSunkenLeft: function(){
		this.holder.style.left = parseInt(this.holder.style.left) + this.pointerWidth - this.pars.xOffsetPointer + 'px'
		this.pointer.style.left = this.holderWidth - this.pointerWidth + this.pars.xOffsetPointer + 'px';
	},

	pointerSunkenRight: function(){
		this.holder.style.left = parseInt(this.holder.style.left) - this.pointerWidth + this.pars.xOffsetPointer + 'px';
		this.pointer.style.left = -this.pars.xOffsetPointer + 'px';
	},

	pointerHolderWidth: function(){
		this.holder.style.width = this.holderWidth + this.pointerWidth + this.pars.xOffsetPointer + 'px';
	},

	pointerLeft: function(){
		this.pointerHolderWidth()
		this.holder.style.left = parseInt(this.holder.style.left) - this.pointerWidth - this.pars.xOffsetPointer + 'px';
		this.pointer.style.left = this.tipWidth + this.pars.xOffsetPointer + 'px';
	},

	pointerRight: function(){
		this.pointerHolderWidth()
		this.tip.style.left = this.pointerWidth + this.pars.xOffsetPointer + "px";
	},

	pointerCenterX: function(){
		this.pointer.style.left = (parseInt(this.holder.style.width)/2) - (this.pointerWidth/2) + 'px';
	},

	pointerCenterY: function(){
		this.pointer.style.top = (this.tipHeight/2)-(this.pointerHeight/2) + 'px';
	},

	resizeHolderWithoutPointer: function(){
		this.holder.style.height = this.tipHeight + 'px';
		this.holder.style.width = this.tipWidth + 'px';
		this.tip.style.top = '0px';
		this.tip.style.left = '0px';
		this.pointer.style.display = 'none';
	},

	adjustToPage: function(){
		var deltaT = -1*(parseInt(this.holder.style.top) - this.offSetTop);
		var deltaB = (parseInt(this.holder.style.height) + parseInt(this.holder.style.top) - this.offSetTop) - this.maxHeight;
		var deltaL = -1*(parseInt(this.holder.style.left) - this.offsetLeft);
		var deltaR = (parseInt(this.holder.style.width) + parseInt(this.holder.style.left) - this.offsetLeft) - this.maxWidth;

		if(this.pars.pointerOrientation){
			if(((deltaT>0 | deltaB>0) && (deltaL>0 | deltaR>0)) |
			   (deltaT>0 && (this.pars.xOrientation == "center" | this.pars.pointerOrientation == "top")) |
			   (deltaB>0 && (this.pars.xOrientation == "center" | this.pars.pointerOrientation == "bottom")) |
			   (deltaL>0 && (this.pars.yOrientation == "center" | this.pars.pointerOrientation == "left")) |
			   (deltaR>0 && (this.pars.yOrientation == "center" | this.pars.pointerOrientation == "right"))
			   ){
				this.resizeHolderWithoutPointer();
			}

		}

		if(deltaT>0){
			this.holder.style.top = parseInt(this.holder.style.top) + deltaT + 'px'
			if(this.pars.pointerOrientation){
				this.pointer.style.top = parseInt(this.pointer.getStyle('top')) - deltaT  + 'px'
			}
		}
		else if(deltaB>0){
			this.holder.style.top = parseInt(this.holder.style.top) - deltaB + 'px'
			if(this.pars.pointerOrientation){
				this.pointer.style.top = parseInt(this.pointer.getStyle('top')) + deltaB  + 'px'
			}
		}

		if(deltaL>0){
			this.holder.style.left = parseInt(this.holder.style.left) + deltaL + 'px'
			if(this.pars.pointerOrientation){
				this.pointer.style.left = parseInt(this.pointer.getStyle('left')) - deltaL  + 'px'
			}
		}
		else if(deltaR>0){
			this.holder.style.left = parseInt(this.holder.style.left) - deltaR + 'px'
			if(this.pars.pointerOrientation){
				this.pointer.style.left = parseInt(this.pointer.getStyle('left')) + deltaR  + 'px'
			}
		}
	},

	addController: function(node){
		this.togglePane.addController(node)
		return this
	},

	removeController: function(node){
		this.togglePane.removeController(node)
		return this
	}
}

/*
 ref:		Df.Tip
 extends:	Df.Element
 returns:	Df.Tip
 type:		Class
 event: 	this.element :position
*/
Df.Tip = Class.create(Df.Element)
Df.Tip.addMethods(Df._TipMixin)

/*
 ref:		Df.NewTip
 extends:	Df.Base
 returns:	Df.NewTip
 type:		Class
 event: 	this.holder :position
*/
Df.NewTip = Class.create(Df.Base)
Df.NewTip.addMethods(Df._TipMixin)
Df.NewTip.addMethods({

	initialize: function($super, pars){
		$super(pars)
		this._setup()
		return this
	},

	_showObserver: function(){
		this.holder.observe(':show', function(e){
			//this.element = e.memo.event.target
			this.setContent()
			this._show(e)
			this.holder.fire(':position')
		}.bind(this));

		
		this.holder.observe(':controllerChange', function(e){
			//if(this.element != e.memo.event.target){
				//this.element = e.memo.event.target
				this.setContent.bind(this).defer()
				//this._show(e)
				//this.holder.fire(':position')
			//}
		}.bind(this))

	},

	setContent: function(){
		this.holder.style.display = 'block';
		this.holder.style.visibility = 'hidden';

		this.tip.update(this.pars.data)

		this.setDems();
		this.setPos();

		this.holder.style.display = 'none';
		this.holder.style.visibility = 'visible';

		return this
	},
	
	_positionObserver: function(){
		this.holder.observe(':position', function(e){
			this._position(e)
		}.bind(this))
	}
});
/*
 ref:		Df.Combo
 extends:	Df.Ui
 type:		Class
 returns:	Df.Combo
 event:		this.element :update
*/
Df.Combo = Class.create(Df.Ui, {
	initialize: function($super, element, pars){
		$super(element, pars)
		
		this.width
		this.height
		this.pos
		this.left
		this.top
		this.listHolder
		this.list
		this.listH
		this.sizeY
		this.currentValue
		this.currentLabel
		this.currentIndex
		this.isOpen = false;
		
		this._up = this.up.bindAsEventListener(this)
		this._down = this.down.bindAsEventListener(this)
		this._setPosition = this.setPosition.bindAsEventListener(this)
		
		this.width = parseInt(this.element.offsetWidth)
		this.height = parseInt(this.element.offsetHeight)
		
		this.listHolder = $(this.pars.appendto).e('div', 'bottom', {className: this.pars.listClassName})
		if(this.pars.variableWidth){
			var e = document.body.e('div', 'bottom', {className: this.pars.leftEdgeClassName});

			var pos = Position.cumulativeOffset(this.getElement())
			var left = pos[0]
			var top = pos[1]

			e.setStyle({position:'absolute', left: left + 'px', top: top + 'px', zIndex: '1'});
		}
		
		this.setPosition()
		
		if(this.pars.listWidth){
			this.listHolder.style.width = this.pars.listWidth + 'px'
		}else{
			this.listHolder.style.width = this.width + 'px'
		}
		
		this.list = this.listHolder.e('div', 'bottom')
		
		if(this.pars.maxHeight){
			
			Object.extend(this.pars.scrollbar,{
				holder: this.listHolder,
				positionY:false,
				positionX:false
			});
			this.scrollbar = new Df.Scrollbar(this.list, this.pars.scrollbar)
		}
		
		this.repopulateData()
		
		this.listHolder.style.visibility = "hidden"
		
		this.sizeY = new Df.Animate(this.listHolder, this.pars.animate);
		
		return this
	},
	
	_initPars: function($super, pars){
		$super()
		this.setPars({
			initialValue: false,
			initialLabel: false,
			initialIndex: false,
			appendto: document.body,
            offSetType: "cumulativeOffset",
			listWidth: false,
			listClassName: 'list',
			hoverClassName: 'itemHover',
			selectedClassName: 'selected',
			animate: false,
			onUpdate:false,
			data: [
				{label:'test1',value:1},
				{label:'test2',value:2},
				{label:'test3',value:3}
			],
			maxHeight: false,
			scrollbar: {},
			variableWidth: true,
			leftEdgeClassName: ''
		})
		this.setPars(pars)
	},
	
	/*
	 ref:		Df.Combo.appendToData
	 type:		Method
	 returns:	Df.Combo
	*/
	appendToData: function(data){
		this.pars.data = this.pars.data.concat(data)
		this.repopulateData()
		
		return this
	},
	
	/*
	 ref:		Df.Combo.repopulateData
	 type:		Method
	 returns:	Df.Combo
	*/
	repopulateData: function(data){
		Event.stopObserving(this.element, 'click', this._down)
		Event.stopObserving(window, 'resize', this._setPosition)
		
		this.element.style.cursor = 'auto'
		if(data){
			this.pars.data = data
		}
		
		this.list.innerHTML = ''
		
		if(this.pars.data && this.pars.data.constructor == Array && this.pars.data.length > 0){
			
			for(var i=0; i<this.pars.data.length; i++){
				this.buildList(i)
			}
			
			if(this.pars.maxHeight){
				
				if(parseInt(this.list.getHeight()) > this.pars.maxHeight){
					this.list.setStyle({height:this.pars.maxHeight + 'px'})
				}
				
				this.list.fire(':resize')
			}
			
			if(this.pars.initialIndex || this.pars.initialIndex==0 || this.pars.initialValue || this.pars.initialValue==0 || this.pars.initialLabel || this.pars.initialLabel == 0){
				
				if(this.pars.initialValue || this.pars.initialValue==0){
					var index = this.findIndexByValue(this.pars.initialValue)
					if(index || index === 0){
						this.changeSelected(index)
					}
				}else if(this.pars.initialLabel || this.pars.initialLabel == 0){
					var index = this.findIndexByLabel(this.pars.initialLabel)
					if(index || index === 0){
						this.changeSelected(index)
					}
				}else if(this.pars.initialIndex || this.pars.initialIndex==0){
					this.changeSelected(index)
				}
			} else {
				this.highlightSelection()
			}
			Event.observe(this.element, 'click', this._down)
			Event.observe(window, 'resize', this._setPosition)
			this.element.style.cursor = 'pointer'
		}
		this.listH = parseInt(this.list.offsetHeight)
		
		return this
	},
	
	/*
	 ref:		Df.Combo.setCurrentValue
	 type:		Method
	 returns:	Df.Combo
	*/
	setCurrentValue: function(cv){
		var index = this.findIndexByValue(cv)
		if(index || index===0){
			this.changeSelected(index)
		}
		
		return this
	},
	
	/*
	 ref:		Df.Combo.getCurrentValue
	 type:		Method
	 returns:	String|Number
	*/
	getCurrentValue: function(){
		return this.currentValue;
	},
	
	/*
	 ref:		Df.Combo.getListItemNodeByIndex
	 type:		Method
	 returns:	Element
	*/
	getListItemNodeByIndex: function(index){
		var ary = this.list.getElementsByTagName('div')
		return $(ary[index])
	},
	
	/*
	 ref:		Df.Combo.getListItemNodeByLabel
	 type:		Method
	 returns:	Element
	*/
	getListItemNodeByLabel: function(l){
		var index = this.findIndexByLabel(l)
		var ary = this.list.getElementsByTagName('div')
		return $(ary[index])
	},
	
	/*
	 ref:		Df.Combo.getListItemNodeByValue
	 type:		Method
	 returns:	Element
	*/
	getListItemNodeByValue: function(v){
		var index = this.findIndexByValue(v)
		var ary = this.list.getElementsByTagName('div')
		return $(ary[index])
	},
	
	/*
	 ref:		Df.Combo.getListItemNodes
	 type:		Method
	 returns:	Array
	*/
	getListItemNodes: function(){
		return $A(this.list.getElementsByTagName('div'))
	},
	
	/*
	 ref:		Df.Combo.setCurrentLabel
	 type:		Method
	 returns:	Df.Combo
	*/
	setCurrentLabel: function(cl){
		var index = this.findIndexByLabel(cl)
		if(index || index===0){
			this.changeSelected(index)
		}
		return this
	},
	
	/*
	 ref:		Df.Combo.getCurrentLabel
	 type:		Method
	 returns:	String|Number
	*/
	getCurrentLabel: function(){
		return this.currentLabel;
	},
	
	/*
	 ref:		Df.Combo.setCurrentIndex
	 type:		Method
	 returns:	Df.Combo
	*/
	setCurrentIndex: function(ci){
		this.changeSelected(ci)
		
		return this
	},
	
	/*
	 ref:		Df.Combo.getCurrentIndex
	 type:		Method
	 returns:	Number
	*/
	getCurrentIndex: function(){
		return this.currentIndex;
	},
	
	setPosition: function (){
        try{
            this.pos = Position[this.pars.offSetType](this.getElement())
            this.left = this.pos[0]
            this.top = this.pos[1]
            this.listHolder.style.left = this.left + 'px'
            this.listHolder.style.top = this.top + this.height +'px'
        }catch(e){}
	},
	
	clearSelected: function(){
		this.currentIndex = false
		this.currentLabel = false
		this.currentValue = false
		this.element.innerHTML = ''
		return this
	},
	
	changeSelected: function(index){
	
		if(this.currentIndex !== index){
		
			if(this.pars.data.length > index){
				this.currentIndex = index
				this.currentLabel = this.pars.data[this.currentIndex].label
				this.currentValue = this.pars.data[this.currentIndex]['value']
			}
			
			this.element.fire(':update', {currentIndex: this.currentIndex, currentLabel: this.currentLabel, currentValue: this.currentValue})
			
			if(this.pars.onUpdate){
				this.pars.onUpdate(this);
			}
			
			this.highlightSelection()
		}
		
		return this
	},
	
	highlightSelection: function(){
		var index = this.findIndexByValue(this.getCurrentValue())
		this.currentIndex = index
		this.currentLabel = this.pars.data[this.currentIndex].label
		this.currentValue = this.pars.data[this.currentIndex]['value']
		
		//set presentation
		if(this.pars.data[this.currentIndex]){
			this.element.innerHTML = this.pars.data[this.currentIndex].label
		}
		
		//set list class
		var ary = this.list.getElementsByTagName('div')
		for(var i=0; i<ary.length; i++){
			var node = $(ary[i])
			if(node.index == this.currentIndex){
				node.addClassName(this.pars.selectedClassName)
			}else{
				node.removeClassName(this.pars.selectedClassName)
			}
		}
	},
	
	findIndexByValue: function(v){
		var ret = false;
		for(var i=0; i < this.pars.data.length; i++){
			if(this.pars.data[i]['value'] == v){
				ret = i;
				break;
			}
		}
		return ret;
	},
	
	findIndexByLabel: function(v){
		var ret = false;
		for(var i=0; i < this.pars.data.length; i++){
			if(this.pars.data[i].label == v){
				ret = i;
				break;
			}
		}
		return ret;
	},
	
	buildList: function(ii){
		var node = $(this.list).e('div', 'bottom',{
			innerHTML: this.pars.data[ii].label
		})
		node.index = ii
		node.observe('click', function(index){
			this.changeSelected(index)
			this.up()
		}.bind(this, ii))
		
		node.observe('mouseover', function(e){
			e.target.addClassName(this.pars.hoverClassName)
		}.bind(this))
		
		node.observe('mouseout', function(e){
			e.target.removeClassName(this.pars.hoverClassName)
		}.bind(this))
	},
	
	down: function(e){
		Event.stop(e)
		
		this.constructor.getInstances().each(function(v){
			if(v !== this){
				v.up()
			}
		}.bind(this))
		
		if(!this.isOpen){
			this.isOpen = true
			this.setPosition()
			
			this.listHolder.style.visibility = "visible"
			
			this.sizeY.pars.height = this.listH;
			this.sizeY.run();
			
			Event.stopObserving(this.element ,'click', this._down)
			Event.observe(this.element, 'click', this._up)
			Event.observe(document.body, 'click', this._up)
		}
	},
	
	up: function(e){
		if(e){
			Event.stop(e)
		}
		if(this.isOpen){
			this.isOpen = false
			this.sizeY.pars.onComplete = function(ins){
				ins.pars.onComplete = false
				this.listHolder.style.visibility = "hidden"
				Event.stopObserving(this.element,'click', this._up)
				Event.stopObserving(document.body,'click', this._up)
				Event.observe(this.element, 'click',this._down)
			}.bind(this)
			
			this.sizeY.pars.height = 0;
			this.sizeY.run();	
		}
		
	}
});
/*
 ref:		Df.ClassAnimator
 extends:	none
 type:		Class
 returns:	Df.ClassAnimator
*/

Df.ClassAnimator = Class.create({
	initialize: function(element, selector, pars){
		this.selector = selector;
		
		this.CSSClassNameConversionTable = {
			width: 'width',
			height: 'height',
			color: 'color',
			left: 'left',
			top: 'top',
			fontsize: 'fontSize', 
			lineheight: 'lineHeight', 
			letterspacing: 'letterSpacing',
			paddingleft: 'paddingLeft',
			paddingright: 'paddingRight',
			paddingtop: 'paddingTop',
			paddingbottom: 'paddingBottom',
			marginleft: 'marginLeft',
			marginright: 'marginRight',
			margintop: 'marginTop',
			marginbottom: 'marginBottom',
			opacity: 'opacity',
			backgroundcolor: 'backgroundColor', 
			backgroundposition: 'backgroundPosition'
		}
		
		this.pars = this._getCSSPars(this.selector);
		
		if(pars){
			this.setPars(pars);
		}
		
		this.animate = new Df.Animate(element, this.pars);
	},
	
	/*
	 ref:		Df.ClassAnimator.appendToData
	 type:		Method
	 returns:	Df.ClassAnimator.pars
	*/
	
	_getCSSPars: function(){
		var pars = {};
		var obj = this;
		var sheets = document.styleSheets;
		
		$A(sheets).each(function(sheet, index){
			var rules = sheet.rules? sheet.rules: sheet.cssRules;
			$A(rules).each(function(rule, index){
				if(rule.selectorText == obj.selector){
					for(property in obj.CSSClassNameConversionTable){
						var val = rule.style[obj.CSSClassNameConversionTable[property]];
						if(val){
							pars[obj.CSSClassNameConversionTable[property]] = val;
						}
					}
				}
			});
		});

		return pars;
	},
	
	/*
	 ref:		Df.ClassAnimator.setPars
	 type:		Method
	*/	
	setPars: function(pars){
		Object.extend(this.pars, pars);
	},
	
	/*
	 ref:		Df.ClassAnimator.run
	 type:		Method
	*/	
	run: function(){
		this.animate.run();
	},
	
	/*
	 ref:		Df.ClassAnimator.toggle
	 type:		Method
	*/	
	toggle: function(){
		this.animate.toggle();
	}
});
if (ess) {
} else {
	var ess = {};
}
ess.Product = function(productJSONObject) {
	this.p = productJSONObject;

	this.colorId = "";
	this.skuId = "";
	this.quantity = 0;
	this.colorChangeListeners = new Array();
	this.viewChangeListeners = new Array();
	this.qtyChangeListeners = new Array();
	this.skuChangeListeners = new Array();
	this.viewIndex = 0;
	this.currentView = this;
	this.currentColorSlice = null;
    this.hasPriceRange = productJSONObject.hasPriceRange;

    this.addColorChangeListener = function(listener) {
		this.colorChangeListeners[this.colorChangeListeners.length] = listener;
	};
	this.addQtyChangeListener = function(listener) {
		this.qtyChangeListeners[this.qtyChangeListeners.length] = listener;
	};
	this.addSkuChangeListener = function(listener) {
		this.skuChangeListeners[this.skuChangeListeners.length] = listener;
	};
	this.addViewChangeListener = function(listener) {
		this.viewChangeListeners[this.viewChangeListeners.length] = listener;
	};
	this.changeColor = function(colorId) {

		this.colorId = colorId;
		//this should be updated to select the correct sku id
		this.currentColorSliceValue = null;
		for (var i = 0; i < this.p.colorSliceValues.length; i++) {
			if (this.p.colorSliceValues[i].colorId == this.colorId) {
				this.currentColorSliceValue = this.p.colorSliceValues[i];
				break;
			}
		}
		this.changeSku(this.getCurrentColorSliceValue().availableSkuIds[0]);

		this.changeView(0);
		for (var i = 0; i < this.colorChangeListeners.length; i++) {
			this.colorChangeListeners[i].observeProductColorChange(this);
		}
	};
	this.changeSku = function(skuId) {
		this.skuId = skuId;
		for (var i = 0; i < this.skuChangeListeners.length; i++) {
			this.skuChangeListeners[i].observeProductSkuChange(this);
		}
	};
	this.changeView = function(viewIndex) {
		this.viewIndex = viewIndex;
		if (viewIndex == 0 && this.getCurrentColorSliceValue() == null) {
			this.currentView = this;
		} else {
			this.currentView = null;
			if (this.getCurrentColorSliceValue() != null) {
				if (viewIndex == 0) {
					this.currentView = this.getCurrentColorSliceValue();
				} else {
					if (this.getCurrentColorSliceValue().alternateViews.length>viewIndex - 1) {
						this.currentView =  this.getCurrentColorSliceValue().alternateViews[viewIndex - 1];
					} else if (this.getCurrentColorSliceValue().alternateViews.length > 0) {
						this.currentView = this.getCurrentColorSliceValue().alternateViews[0];
					}
				}
			}

			if (this.currentView == null) {
				if (this.p.alternateViews.length>viewIndex-1) {
					this.currentView = this.p.alternateViews[viewIndex-1];
				} else if (this.p.alternateViews.length>0) {
					this.currentView = this.p.alternateViews[0];
				} else {
					this.currentView = this;
				}
			}
		}
		for (var i = 0; i < this.viewChangeListeners.length; i++) {
			this.viewChangeListeners[i].observeProductViewChange(this);
		}
	};
	this.getAvailableSizes = function() {
		var sizes = new Array();
		if (this.colorId != "") {
			var skus = this.getCurrentColorSliceValue().availableSkuIds;
			for (var i = 0; i < skus.length; i++) {
				sizes[i] = this.getSkuById(skus[i]).size;
			}
		}
		return sizes;
	};
	this.getCurrentColorSliceValue = function() {
		return this.currentColorSliceValue;
	};
	this.getCurrentView = function() {
		return this.currentView;	
	};
	this.getSkuById = function(id) {
		for (var i = 0; i < this.p.skus.length; i++) {
			if (this.p.skus[i].sku_id == id) {
				return this.p.skus[i];
			}
		}
		return null;
	};
	this.setQuantity = function(qty) {
		this.quantity = qty;
		for (var i=0; i < this.qtyChangeListeners.length; i++) {
			this.qtyChangeListeners[i].observeProductQtyChange(this);
		}
	};
};
Df.Slider = function(el){
	
	var ele = this.ele = $(el);
	
	var pars = this.pars = {
		classNames: {
			mask: 'mask',
			slider: 'slider',
			prev: {
				base: 'prevBase',
				on :'prevOn',
				off : 'prevOff',
				disable: 'prevDisable'
			},
			next: {
				base: 'nextBase',
				on :'nextOn',
				off : 'nextOff',
				disable: 'nextDisable'
			}
		}
	}
	Object.extend(pars,{
		mask: ele.select('.'+pars.classNames.mask)[0],
		maskHeight: false,
		maskWidth: false,
		slider: ele.select('.'+pars.classNames.slider)[0],
		sliderHeight: false,
		sliderWidth: false,
		arrowM: ele.select('.'+pars.classNames.prev.base)[0],
		arrowP: ele.select('.'+pars.classNames.next.base)[0],
		event: 'click',
		stopEvent: false,
		iterateBy: false,
		animate: false,
		onComplete: false,
		direction: 'hor' //('hor'|'vert')
	});
	
	var move = null;
	
	var dir = false;
	
	var left = {
		attribute: 'left',
		offset: 'offsetWidth',
		maskDem: 'maskWidth',
		sliderDem: 'sliderWidth'
	}
	
	var top = {
		attribute: 'top',
		offset: 'offsetHeight',
		maskDem: 'maskHeight',
		sliderDem: 'sliderHeight'
	}
	
	this.set = function(para){
		
		if(para){
			pars = Object.extend(pars,para)
		}
		
		move = new Df.Animate(pars.slider)
		
		if(pars.direction == 'hor'){
			dir = left
		}else if(pars.direction == 'vert'){
			dir = top
		}
		
		move.pars.onComplete = enableLogic
		
		if(pars.animate){
			move.pars = Object.extend(move.pars,pars.animate)
		}
		
		if(!pars.maskWidth && pars.mask){
			pars.maskWidth = parseInt(pars.mask.offsetWidth);
		}
		if(!pars.maskHeight && pars.mask){
			pars.maskHeight = parseInt(pars.mask.offsetHeight);
		}
		
		if(!pars.sliderWidth && pars.slider){
			pars.sliderWidth = parseInt(pars.slider.offsetWidth);
		}
		if(!pars.sliderHeight && pars.slider){
			pars.sliderHeight = parseInt(pars.slider.offsetHeight);
		}
		
		if(pars.iterateBy){
			if(pars.iterateBy.constructor == String){
				pars.iterateBy = parseInt(pars.slider.getElementsByTagName(pars.iterateBy)[0][dir.offset])
			}
		}
		
		if(pars.slider && pars.mask && pars[dir.sliderDem] > pars[dir.maskDem]){
			enableMinus()
			enablePlus()
			disableActions()
			enableLogic()
			
			if(pars.stopEvent){
				pars.arrowM['on'+pars.stopEvent] =  function(){
					enableLogic()
					move.clear()
				}
				pars.arrowP['on'+pars.stopEvent] =  function(){
					enableLogic()
					move.clear()
				}
			}
		}
	}
	
	function plus(){
		var px = 0;
		if(pars.iterateBy){
			px = -1*(parseInt(pars.slider.getStyle(dir.attribute))) + pars.iterateBy
			if(px > pars[dir.sliderDem] - pars[dir.maskDem]){
				px = pars[dir.sliderDem] - pars[dir.maskDem]
			}
		}else{
			px = pars[dir.sliderDem] - pars[dir.maskDem]
		}
		
		if(px || px == 0){
			if(!pars.stopEvent){
				disableActions()
			}
			move.pars[dir.attribute] = -1*(px)
			move.run()
		}
	}
	
	function minus(){
		var px = 0;
		if(pars.iterateBy){
			px = parseInt(pars.slider.getStyle(dir.attribute)) + pars.iterateBy
			if(px > 0){
				px = 0
			}
		}
		
		if(px || px == 0){
			if(!pars.stopEvent){
				disableActions()
			}
			move.pars[dir.attribute] = px
			move.run()
		}
	}
	
	function enableLogic(){
		if(pars.onComplete){
			pars.onComplete()
		}
		if(pars.stopEvent){
			disableActions()
		}
		var pos = parseInt(pars.slider.getStyle(dir.attribute))
		if(pos < 0){
			enableMinus()
		}
		if(pos > -1*(pars[dir.sliderDem]-pars[dir.maskDem])){
			enablePlus()
		}
	}
	
	function stopMinusMove(){
		pars.arrowM['on'+pars.event] = null
	}
	
	function stopPlusMove(){
		pars.arrowP['on'+pars.event] = null
	}
	
	function startMinusMove(){
		pars.arrowM['on'+pars.event] = minus
	}
	
	function startPlusMove(){
		pars.arrowP['on'+pars.event] = plus
	}
	
	function turnOffMinusArrow(){
		pars.arrowM.addClassName(pars.classNames.prev.off)
		pars.arrowM.removeClassName(pars.classNames.prev.on)
	}
	
	function turnOffPlusArrow(){
		pars.arrowP.addClassName(pars.classNames.next.off)
		pars.arrowP.removeClassName(pars.classNames.next.on)
	}
	
	function turnOnMinusArrow(){
		pars.arrowM.addClassName(pars.classNames.prev.on)
		pars.arrowM.removeClassName(pars.classNames.prev.off)
		pars.arrowM.removeClassName(pars.classNames.prev.disable)
	}
	
	function turnOnPlusArrow(){
		pars.arrowP.addClassName(pars.classNames.next.on)
		pars.arrowP.removeClassName(pars.classNames.next.off)
		pars.arrowP.removeClassName(pars.classNames.next.disable)
	}
	
	function enableMinus(){
		turnOnMinusArrow()
		startMinusMove()
	}
	
	function disableMinus(){
		turnOffMinusArrow()
		stopMinusMove()
	}
	
	function enablePlus(){
		turnOnPlusArrow()
		startPlusMove()
	}
	
	function disablePlus(){
		turnOffPlusArrow()
		stopPlusMove()
	}
	
	function disableActions(){
		disableMinus()
		disablePlus()
	}
}
/*
 event:		:loaded
 event:		:loading
 event:		:zoomIn
 event:		:zoomOut
 event:		:zoomTo
 event:		:zoomInc
 event:		:zoomDec
*/
Df.EmbeddedZoom = Class.create(Df.Ui, {
	initialize: function($super, element, pars){
		$super(element, pars)
		
		/** @private */
		this.loader;
		
		/** @private */
		this.image
		
		/** @private */
		this.base = $(new Image());
		
		/** @private */
		this.baseAnimation;
		this._baseAnimationCompleteEvent = this.baseAnimationCompleteEvent.bindAsEventListener(this)
		
		/** @private */
		this.loaderAnimation;
		this._loaderAnimationCompleteEvent = this.loaderAnimationCompleteEvent.bindAsEventListener(this)
		
		/** @private */
		this.zoomAnimation;
		this._zoomAnimationCompleteEvent = this.zoomAnimationCompleteEvent.bindAsEventListener(this)
		
		/** @private */
		this.index;
		
		/** @private */
		this.maxHeight;
		
		/** @private */
		this.maxWidth;
		
		/** @private */
		this.baseHeight;
		
		/** @private */
		this.baseWidth;
		
		/** @private */
		this.out = false;
		
		/** @private */
		this.moveable = false;
		
		/** @private */
		this.startPointerX;
		/** @private */
		this.startPointerY;
		/** @private */
		this.startImageTop;
		/** @private */
		this.startImageLeft;
		
		this._zoomIn = this.zoomIn.bindAsEventListener(this)
		this._zoomOut = this.zoomOut.bindAsEventListener(this)
		this._zoomTo = this.zoomTo.bindAsEventListener(this)
		
		this.holderDims()
		
		//build elements
		this.buildBaseImage()
		this.buildLoader()
		
		//event handlers
		if(this.pars.zoomEvent == 'hover'){
			this.holderHoverEvent()
		}else if(this.pars.zoomEvent == 'click'){
			this.holderClickEvent()
		}
		
		if (this.pars.moveEvent === 'drag') {
			this.documentMouseUpEvent()
		}
		
		return this
	},
	
	_initPars: function($super, pars){
		$super()
		this.setPars({
			pauseToClose: 1000, //int|false
			pauseToOpen: 500, //int|false
			moveEvent: 'hover', //hover|drag
			zoomEvent: 'click', //click|hover
			loader: false,
			images: {},
			classNames: {
				base: 'base',
				zoom: 'zoom'
			}
		});
		this.setPars(pars)
	},
	
	zoomTo: function(e){
		e.memo.decimal = e.memo.decimal.toRange(0,1)
		if(e.memo.decimal != this.decimal){
			
			this.decimal = e.memo.decimal
			
			if(this.decimal == 0){
				this.moveable = false
				this.element.style.cursor = 'pointer';
			}
			
			var height = ((this.maxHeight - this.baseHeight) * this.decimal) + this.baseHeight
			var width = ((this.maxWidth - this.baseWidth) * this.decimal) + this.baseWidth
			
			if(e.memo.event){
				var top = - parseInt((this.element.getPointerY(e.memo.event) / this.baseHeight) * (height - this.baseHeight))
				var left = - parseInt((this.element.getPointerX(e.memo.event) / this.baseWidth) * (width - this.baseWidth))
			} else {
				var top = (parseInt(this.image.style.top) - ((height - parseInt(this.image.style.height)) / 2)).toRange(-height + this.baseHeight, 0)
				var left =  (parseInt(this.image.style.left) - ((width - parseInt(this.image.style.width)) / 2)).toRange(-width + this.baseWidth, 0)
			}
			
			this.image.style.visibility = "visible";
			
			this.zoomAnimation.run({
				top: top,
				left: left,
				height: height,
				width: width
			});
		}
	},
	
	zoomAnimationCompleteEvent: function(e){
		if(this.decimal == 0){
			this.image.style.visibility = "hidden";
		} else {
			if (this.pars.moveEvent === 'hover') {
				this.moveable = true;
			} else if (this.pars.moveEvent === 'drag') {
				this.element.style.cursor = 'auto';
			}
		}
	},
	
	zoomIn: function(e){
		e.memo.decimal = 1
		this.zoomTo(e)
		return this
	},
	
	zoomOut: function(e){
		e.memo.decimal = 0
		this.zoomTo(e)
		return this
	},
	
	loadIndex: function(index) {
		this.index = index;
		this.load(this.pars.images[this.index])
		
		return this
	},
	
	load: function(imageGroup){
		if(imageGroup && imageGroup != this.currentImageGroup){
			
			this.decimal = 0
			
			this.element.stopObserving(':zoomIn', this._zoomIn);
			this.element.stopObserving(':zoomTo', this._zoomTo);
			this.element.stopObserving(':zoomInc', this._zoomInc);
			this.element.stopObserving(':zoomDec', this._zoomDec);
			this.element.stopObserving(':zoomOut', this._zoomOut);
			
			this.currentImageGroup = imageGroup
			
			if(this.image){
				this.image.remove()
				delete(this.image)
			}
			
			this.base.src = this.currentImageGroup.base;
			this.base.style.display = 'block';
			
			this.element.style.cursor = 'auto';
			
			this.baseAnimation.run({opacity:1});
			
			if(imageGroup && imageGroup.zoom && imageGroup.zoom.strip() != ''){
				this.showLoader()
				this.buildZoomImage()
			}
		}
		return this
	},
	
	holderDims: function(){
		this.baseHeight = parseInt(this.element.getStyle('height'));
		this.baseWidth = parseInt(this.element.getStyle('width'));
	},
	
	baseAnimationCompleteEvent: function(e){
		this.element.style.backgroundImage = "url('" + this.currentImageGroup.base + "')";
		this.base.setStyle({opacity:0});
		this.base.style.display = 'none';
	},
	
	buildBaseImage: function(){
		this.base.addClassName(this.pars.classNames.base);
		this.base.setStyle({opacity:0});
		this.element.insert(this.base);
		this.baseAnimation = new Df.Animate(this.base);
		this.baseAnimation.setPars({time:500})
		this.baseAnimation.getElement().observe(':complete', this._baseAnimationCompleteEvent)
	},
	
	buildZoomImage: function(){
		this.image = $(new Image());
		this.image.addClassName(this.pars.classNames.zoom);
		this.image.style.visibility = "hidden";
		
		
		if (this.pars.moveEvent === 'drag') {
			this.image.style.cursor = "move";
			this.zoomMousedownEvent()
			this.zoomDragClickEvent()
		}
		else if(this.pars.moveEvent === 'hover' && this.pars.zoomEvent === 'click'){
			this.zoomClickEvent()
		}
		
		this.zoomMouseMoveEvent()
		this.zoomMouseOutEvent()
		this.zoomMouseOverEvent()
		this.zoomLoadEvent()
		
		this.element.insert(this.image);
		this.zoomAnimation = new Df.Animate(this.image);
		this.zoomAnimation.getElement().observe(':complete', this._zoomAnimationCompleteEvent)
		
		this.image.src = this.currentImageGroup.zoom;
	},
	
	//START event handlers
	holderHoverEvent: function(){
		this.element.observe('mouseover', function(e){
			Event.stop(e);
			if(this.decimal == 0)
				this.over = true;
				if(this.pars.pauseToOpen !== false){
					setTimeout(function(e){
						if(this.over == true)
							this.element.fire(':zoomIn', {event:e})
					}.bind(this, e), this.pars.pauseToOpen);
				}
		}.bind(this));
		
		this.element.observe('mouseout', function(e){
			Event.stop(e);
			if(this.decimal == 0){
				this.over = false;
			}
		}.bind(this));
	},
	
	holderClickEvent: function(){
		this.element.observe('click', function(e){
			Event.stop(e);
			this.element.fire(':zoomIn', {event:e})
		}.bind(this));	
	},
	
	zoomDragClickEvent: function(){
		this.image.observe('click', function(e){
			Event.stop(e);
		}.bind(this));
	},
	
	zoomClickEvent: function(){
		this.image.observe('click', function(e){
			Event.stop(e);
			this.element.fire(':zoomOut', {event:e})
		}.bind(this));
	},
	
	zoomMousedownEvent: function(){
		Event.observe(this.image, 'mousedown', function(e){
			Event.stop(e);
			this.moveable = true;
			this.startPointerX = this.element.getPointerX(e);
			this.startPointerY = this.element.getPointerY(e);
			this.startImageTop = parseInt(this.image.style.top);
			this.startImageLeft = parseInt(this.image.style.left);
		}.bind(this));
	},
	
	documentMouseUpEvent: function(){
		Event.observe(document.body, 'mouseup', function(e){
			this.moveable = false;
		}.bind(this));
	},
	
	zoomMouseMoveEvent: function(){
		//move zoom image inside holder
		this.image.observe('mousemove', function(e){
			Event.stop(e);
			if(this.moveable){
				if(this.pars.moveEvent === 'hover'){
					this.image.style.top = this.zoomTopPosition(e) + 'px';
					this.image.style.left = this.zoomLeftPosition(e) + 'px';
				}
				else if (this.pars.moveEvent === 'drag'){
					this.image.style.top = this.zoomTopPositionDrag(e) + 'px';
					this.image.style.left = this.zoomLeftPositionDrag(e) + 'px';
				}
			}
		}.bind(this));
	},
	
	zoomMouseOutEvent: function(){
		//zoom image mouseout event
		this.image.observe('mouseout', function(e){
			Event.stop(e);
			if(this.decimal != false){
				this.out = true;
				if(this.pars.pauseToClose !== false){
					setTimeout(this.handleMouseOver.bind(this), this.pars.pauseToClose);
				}
			}
		}.bind(this));
	},
	
	zoomMouseOverEvent: function(){
		//zoom image mousein event
		this.image.observe('mouseover', function(e){
			Event.stop(e);
			this.out = false;
		}.bind(this));
	},
	
	zoomLoadEvent: function(){
		//zoom image load event
		this.image.observe('load', function(e){
			Event.stop(e);
			
			this.element.style.cursor = 'pointer';
			
			this.maxHeight = parseInt(this.image.offsetHeight);
			this.maxWidth = parseInt(this.image.offsetWidth);
			
			this.image.style.height = this.baseHeight + 'px';
			this.image.style.width = this.baseWidth + 'px';
			
			this.image.style.top = '0px';
			this.image.style.left = '0px';
			
			this.element.observe(':zoomIn', this._zoomIn);
			this.element.observe(':zoomTo', this._zoomTo);
			this.element.observe(':zoomOut', this._zoomOut);
			
			this.hideLoader()
		
		}.bind(this));
	},
		
	//END event handlers
	
	//START loader methods
	loaderAnimationCompleteEvent: function(e){
		if(e.memo.pointer == 0){
			this.pars.loader.style.display = 'none';
		}
	},
	
	buildLoader: function(){
		this.pars.loader.setStyle({opacity:0})
		this.element.insert(this.pars.loader);
		this.loaderAnimation = new Df.Animate(this.pars.loader);
		this.loaderAnimation.setPars({time:1000, opacity:.50})
		this.loaderAnimation.getElement().observe(':complete', this._loaderAnimationCompleteEvent)
	},
	
	showLoader: function(){
		this.element.fire(':loading')
		
		this.element.style.cursor = 'auto';
			
		this.pars.loader.style.display = 'block';
		this.loaderAnimation.toggle();
		
		return this
	},
	
	hideLoader: function(){
		this.element.fire(':loaded')
		this.loaderAnimation.toggle();	
	},
	
	//END loader methods
	
	handleMouseOver: function(e){
		if(this.out){
			this.element.fire(':zoomOut')
		}
	},
	
	zoomLeftPosition: function(e){
		return - parseInt((this.element.getPointerX(e) / this.baseWidth) * (this.image.getWidth() - this.baseWidth));
	},
	
	zoomTopPosition: function(e){
		return - parseInt((this.element.getPointerY(e) / this.baseHeight) * (this.image.getHeight() - this.baseHeight));
	},
	
	zoomLeftPositionDrag: function(e){
		var left = this.startImageLeft - (this.startPointerX - this.element.getPointerX(e));
		if (left > 0) {
			left = 0;
		} else if (left < -this.image.getWidth() + this.baseWidth) {
			left = -this.image.getWidth() + this.baseWidth;
		}
		return left;
	},
	
	zoomTopPositionDrag: function(e){
		var top = this.startImageTop - (this.startPointerY - this.element.getPointerY(e));
		if (top > 0) {
			top = 0;
		} else if (top < -this.image.getHeight() + this.baseHeight) {
			top = -this.image.getHeight() + this.baseHeight;
		}
		return top;
	}
		
});
document.observe("dom:loaded", function(e) {

    if ($(document.body).id === 'product') {
        ess = ess || {};

        ess.displayPrice = function(obj, context) {
            obj.up().style.display = 'none';
            obj.up().next().style.display = 'block';
        };

        ess.printThisPageText = "Print This Page";
        ess.createPrint = function() {
            var utils = $("prodTools");
            if (!utils) {
                return;
            }

            var dd = $(document.createElement("dd"));
            dd.update(ess.printThisPageText);
            dd.addClassName("print");
            dd.observe("click", function() {
                print();
            });
            utils.appendChild(dd);
        };

        /*
         * Get page title
         */
        ess.getPageTitle = function() {
            var pageTitle;
            $$('title').each(function(node){
                pageTitle = node.innerHTML;
            });
            return pageTitle;
        };

        /*
         * Add to Facebook
         */
        ess.addToFacebook = function() {
            var pageUrl = encodeURIComponent(window.location.href);
            var pageTitle = escape(ess.getPageTitle());
            var facebookUrl = "http://www.facebook.com/sharer.php?u=" + pageUrl + "&t=" + pageTitle;
            window.open(facebookUrl);
        };

        ess.addToCartBtnId = "add-to-cart";

        ess.validateProduct = function(cartAction) {
            var isCartable = true;

            var colorContainer = $("colorContainer");
            var quantityContainer = $("quantityContainer");
            var sizeContainer = $("sizeContainer");

            var cErrors = colorContainer.select(".error");
            var qErrors = quantityContainer.select(".error");
            var sErrors = sizeContainer.select(".error");

            var errorArray = [cErrors, sErrors, qErrors];

            // clear errors
            for (var i = 0; i < errorArray.length; i++) {
                var errors = errorArray[i];
                for (var j = 0; j < errors.length; j++) {
                    errors[j].remove();
                }
            }

            // check color
            if (ess.product.currentView.colorId == "" && ess.product.colorSliceValues.length != 0) {
                var error = $(document.createElement("div"));
                error.update(ess.messages.validateColor);
                error.addClassName("error");

                colorContainer.insert(error, {position: "top"});

                isCartable = false;
            }

            // check size
            if (ess.product.skuId == "") {
                var error = $(document.createElement("div"));
                error.update(ess.messages.validateSize);
                error.addClassName("error");

                sizeContainer.insert(error, {position: "top"});

                isCartable = false;
            } else {
                var skuId = $("skuId");
                if (!skuId) {
                    skuId = $(document.createElement("input"));
                    skuId.id = "skuId";
                    skuId.name = "skuId";
                    skuId.type = "hidden";
                    $("addToCartForm").appendChild(skuId);
                }
                skuId.value = ess.product.skuId;
            }

            // check quantity
            var qty = $("quantity");
            if (qty) {
                if (qty.present()) {
                    var qVal = qty.getValue();
                    if (isNaN(qVal) || parseInt(qVal) < 1) {
                        var error = $(document.createElement("div"));
                        error.update(ess.messages.validateQuantity);
                        error.addClassName("error");

                        quantityContainer.insert(error, {position: "top"});

                        isCartable = false;
                    }
                } else {
                    var error = $(document.createElement("div"));
                    error.update(ess.messages.validateQuantity);
                    error.addClassName("error");

                    quantityContainer.insert(error, {position: "top"});

                    isCartable = false;
                }
            }

            return isCartable;
        }
        
        // Create instance of Product
        if (ess.productJSON) {
            ess.product = new ess.Product(ess.productJSON);
        }

        var i;

        /*
         * Color Swatches
         */
        if ($("mainProductSwatches") && ess.product)
        {
            var colorSwatches = $("mainProductSwatches").select("li");

            for (i = 0; i < colorSwatches.length; i++) {
                var swatch = colorSwatches[i];
                swatch.colorId = (swatch.id).substring((swatch.id).lastIndexOf("_") + 1);

                swatch.observe("click", function() {
                    ess.product.changeColor(this.colorId);
                });

                swatch.observeProductColorChange = function(product) {
                    if (this.colorId == product.colorId) {
                        this.className = "selected";
                    } else {
                        this.className = "";
                    }
                };
                ess.product.addColorChangeListener(swatch);
            }
        }

        /*
         * Larger image popup
         */
        var largeImage = $("large-image");
        if (largeImage && ess.product)
        {
            largeImage.href = "javascript:void(0);";
            largeImage.observe("click", function() {
                if (largeImage.hasClassName("inactive")) {
                    return false;
                }

                var viewId = 'main';
                if (ess.product.getCurrentView().viewId != undefined && ess.product.getCurrentView().viewId != null) {
                    viewId = ess.product.getCurrentView().viewId;
                }
                /* alert('ess.product.getCurrentView().colorId = ' + ess.product.getCurrentView().colorId + '\ness.product.getCurrentView().viewId = ' + ess.product.getCurrentView().viewId); */

                var colorCode = ess.product.getCurrentView().colorId;
                var type = "V400";
                var prodId = window.ess.productJSON.productId;
                var url = ess.largeImageUriPrefix + "productId=" + prodId + "&type=" + type + "&colorCode=" + colorCode + '&viewId=' + viewId;

                var popupHeight = 760;
                var popupWidth = 500;
                if (screen.height < 800) {
                    popupHeight = 650;
                    popupWidth = 525;
                }

                window.open(url, "largeImage", "width="+popupWidth+",height="+popupHeight+",scrollbars=yes,resizable=yes");
                var longTitle = window.ess.productJSON.longTitle;
                var shortTitle = window.ess.productJSON.title;
                $(document).fire("pr:view-large-image", {
                    id: prodId,
                    longTitle: longTitle,
                    shortTitle: shortTitle,
                    mfgStyleCode: '',
                    type: 'STANDARD',
                    available: true
                });
            });

            largeImage.observeProductColorChange = function(product) {
                if (product.currentView.enhancedImageURL != "") {
                    this.className = "active";
                } else {
                    this.className = "inactive";
                }
            };
            ess.product.addColorChangeListener(largeImage);
        }

        /*
         * Alternate Views
         */
        if ($("alternate-images") && ess.product)
        {
            var altViewContainer = $("alternate-images");
            var altViews = altViewContainer.select("li");
            for (i = 0; i < altViews.length; i++) {
                var view = altViews[i];
                view.getElementsByTagName("a")[0].href="javascript:ess.product.changeView(" + i + ");";
            }
            altViewContainer.observeProductColorChange = function(product)
            {
                var innerHTML = "";
                var lastClass = "";

                var altsWithThumbnails = 0;
                if (product.getCurrentColorSliceValue().thumbnailImageURL !== ""
                        && product.getCurrentColorSliceValue().alternateViews != null)
                {
                    /* DEFENSIVE CODING: determine how many alternate view images WITH thumbnails are available */
                    for (i = 0; i < product.getCurrentColorSliceValue().alternateViews.length; i++)
                    {
                        if (product.getCurrentColorSliceValue().alternateViews[i].thumbnailImageURL !== "") {
                            altsWithThumbnails =+ 1;
                        }
                    }
                }
                /* alert('altsWithThumbnails = ' + altsWithThumbnails); */

                /* only show alternate images if there is at least one besides the initial image */
                if (product.getCurrentColorSliceValue().thumbnailImageURL !== "" && altsWithThumbnails > 0)
                {
                    /* current image thumbnail */
                    if (product.getCurrentColorSliceValue().thumbnailImageURL !== "") {
                        innerHTML = '<li id="more0"><a href="javascript:ess.product.changeView(0);">'
                            + '<img src="' + product.getCurrentColorSliceValue().thumbnailImageURL + '" alt="alternate product view"/></a></li>';
                    }

                    /* alternate views thumbnails */
                    for (i = 0; i < product.getCurrentColorSliceValue().alternateViews.length; i++)
                    {
                        if (product.getCurrentColorSliceValue().alternateViews[i].thumbnailImageURL !== "") {
                            if (i+1 == product.getCurrentColorSliceValue().alternateViews.length) {
                                lastClass = ' class="last"';
                            }
                            innerHTML += '<li id="more' + (i + 1) + '"' + lastClass + '>'
                                + '<a href="javascript:ess.product.changeView(' + (i + 1) + ');">'
                                + '<img src="' + product.getCurrentColorSliceValue().alternateViews[i].thumbnailImageURL + '"'
                                + 'alt="alternate product view"/></a></li>';
                        }
                    }
                }
                altViewContainer.update(innerHTML);
            };
            ess.product.addColorChangeListener(altViewContainer);
        }

        /*
         * Embedded Zoom
         */
        if ($("zoom") && ess.product)
        {
            var z = $("zoom");

            z.observeProductColorChange = z.observeProductViewChange = function(product) {
                var currentView = product.getCurrentView();
                var o = {
                    base: product.p.mainImageURL,
                    zoom: product.p.zoomImageURL
                };

                if (currentView != null && currentView.mainImageURL != ""
                        && currentView.zoomImageURL != "") {
                    o.base = currentView.mainImageURL;
                    o.zoom = currentView.zoomImageURL;
                }

                var loader2 = $(document.body).e("div", "bottom", {className: "loader"});
                var img2 = new Df.EmbeddedZoom("zoom", {
                    loader: loader2,
                    moveEvent: 'drag'
                }).load(o);

                var zoomIn = $("zoom-in");
                var zoomOut = $("zoom-out");

                if (zoomIn && zoomOut) {
                    // Remove any existing custom zoom events
                    zoomIn.stopObserving('click');
                    zoomOut.stopObserving('click');

                    // Set custom zoom events
                    zoomIn.observe('click', function(event) {
                        img2.element.fire(':zoomIn');
                    });
                    zoomOut.observe('click', function(event) {
                        img2.element.fire(':zoomOut');
                    });
                    img2.element.observe(':zoomIn', function(event) {
                        $('zoom-in').className = 'inactive';
                        $('zoom-out').className ='active';
                    });
                    img2.element.observe(':zoomOut', function(event) {
                        $('zoom-in').className = 'active';
                        $('zoom-out').className = 'inactive';
                    });
                }
            };
            ess.product.addViewChangeListener(z);
            ess.product.addColorChangeListener(z);
        }

        /*
         * Main Product Image
         */
        var mainProductImage = $("mainProductImage");
        if (mainProductImage && ess.product)
        {
            mainProductImage.observeProductViewChange = function(product) {
                var currentView = product.getCurrentView();
                if (currentView != null && currentView.mainImageURL != "") {
                    this.src = currentView.mainImageURL;
                } else {
                    this.src = product.p.mainImageURL;
                }
            };
            ess.product.addViewChangeListener(mainProductImage);
        }

        /*
         * HTML Color Select
         */
        var color = $("color");
        if (color && ess.product)
        {
            color.observe("change", function(e){
                ess.product.changeColor(this.value);
            });
            color.observeProductColorChange = function(product) {
                color.value = product.colorId;
            };
            ess.product.addColorChangeListener(color);
        }

        var availMsg = $("availability-msg");
        if (availMsg && ess.product)
        {
            availMsg.observeProductSkuChange = function(product) {
                if (product.skuId != null && product.skuId != "") {
                    var msg = product.getSkuById(product.skuId).availShipEstMessage;
                    this.innerHTML = msg;
                }
                var disableAddToCartBtn = product.getSkuById(product.skuId).avail == "NOT_AVAILABLE";
                if ($(ess.addToCartBtnId)) {
                    toggleBtn($(ess.addToCartBtnId), disableAddToCartBtn);
                }
            };
            ess.product.addSkuChangeListener(availMsg);
        }

        /*
         * HTML size drop down
         */
        if ($("size") && ess.product)
        {
            var s = $("size");
            s.observe('change', function(e){
                var arr = this.value.split("|");
                var skuId = arr[1];
                ess.product.changeSku(skuId);
            })

            s.observeProductColorChange = function(product) {
                var currentColorSlice = product.getCurrentColorSliceValue();
                var hasPriceRange = product.hasPriceRange;
                /* alert('hasPriceRange = ' + hasPriceRange); */
                var str = "";
                for (i = 0; i < currentColorSlice.availableSkuIds.length; i++)
                {
                    var sku = product.getSkuById(currentColorSlice.availableSkuIds[i]);
                    var skuSizeDisplay = sku.size;
                    if (hasPriceRange) {
                        /* alert('sku.price.current = ' + sku.price.current); */
                        skuSizeDisplay = sku.size + ' - ' + sku.price.current;
                    }
                    str += "<option value=\"" + product.p.productId + "|" + sku.sku_id + "\">" + skuSizeDisplay + "</option>";
                }
                s.update(str);
            };
            ess.product.addColorChangeListener(s);

            s.observeProductSkuChange = function(product) {
                this.value = product.p.productId + "|" + product.skuId;
            }
            ess.product.addSkuChangeListener(s);
        }

        if ($("prod_0") && ess.product)
        {
            $("prod_0").observeProductSkuChange = function(product) {
                this.value = product.p.productId + '|' + product.skuId;
            };
            ess.product.addSkuChangeListener($("prod_0"));
            if ($("prod_0").tagName.toLowerCase() == "input") {
              $("prod_0").value = ess.product.p.productId + '|' + ess.product.skuId;
            }
        }

        /*
         * Good Until Pricing
         */
        try
        {
            var expires = $("gup");
            if (expires && ess.product)
            {
              expires.observeProductSkuChange = function(product) {
                var skus = ess.productJSON.skus;
                for (i=0; i < skus.length; i++) {
                  var sku = skus[i];
                  if (product.skuId !== sku.sku_id) {
                    continue;
                  }
                  var price = sku.price;
                  if (price.goodUntilDate.length > 0) {
                    $("gup").update(price.current + " "
                      + ess.productJSON.goodUntilLabel + " " + price.goodUntilDate);
                  } else {
                    $("gup").update("");
                  }
                }
              };
              ess.product.addSkuChangeListener(expires);
            }
        } catch(err) { /* swallow */ }

        /*
         * Wishlist
         */
        var wishlist = $("wishlistButton");
        var cartForm = $("addToCartForm");
        if (wishlist && cartForm && ess.product)
        {
            wishlist.observe("click", function() {
                this.cartForm.action = this.href;
                if(ess.validateProduct())
                    this.cartForm.submit();
            }.bind({href: wishlist.href, cartForm: cartForm}));
            wishlist.href = "#addToWishlist";
        }

        /*
         * Qty html select
         */
        var qty = $("quantity");
        if (qty && ess.product)
        {
            qty.observe("change", function(e){
                ess.product.setQuantity(this.value);
            })
            qty.observeProductQtyChange = function(product) {
                this.value = product.quantity;
            }
            ess.product.addQtyChangeListener(qty);
        }

        /*
         * get c from the url and put it in colorId
         */
        var colorId = window.location.search.toQueryParams().c;
        if (ess.product)
        {
            if (colorId && colorId.length > 0)
            {
                var setColor = false;
                for (i=0; i < ess.product.p.colorSliceValues.length; i++) {
                    if (ess.product.p.colorSliceValues[i].colorId == colorId) {
                        //we have a match
                        setColor = true;
                        ess.product.changeColor(colorId);
                        break;
                    }
                }
                if (!setColor) {
                    if (ess.product.p.colorSliceValues.length > 0) {
                        ess.product.changeColor(ess.product.p.colorSliceValues[0].colorId);
                    }
                }
            } else if (ess.product.p.colorSliceValues.length > 0) {
                ess.product.changeColor(ess.product.p.colorSliceValues[0].colorId);
            }
        }

        /*
         * Tabset and print
         */
        ess.createTabs("tabset");
        ess.createPrint();

        /*
         * Add to Cart Form
         */
        if ($("addToCartForm") && ess.product)
        {
            $("addToCartForm").onsubmit = function(e) {
                return ess.validateProduct();
            };
        }

        /*
         * Add to facebook
         */
        if ($("add-facebook"))
        {
            $("add-facebook").observe('click', function(e) {
                ess.addToFacebook();
            });
        }

        /*
         * Print page
         */
        if ($("print-page"))
        {
            $("print-page").observe('click', function(e) {
                window.print();
            });
        }

        /*
         * Recently viewed slider
         */
        if ($("history-slider"))
        {
            var rvProds = $("history-slider");
            var rvProdListItems = rvProds.getElementsByTagName("li");
            var width = 0;

            // Fix the width of the slider element
            for (i = 0; i < rvProdListItems.length; i++) {
                width = width + rvProdListItems[i].offsetWidth;
            }
            var productSlider = $("rv-products");
            productSlider.style.width = width + "px";

            // Create slider instance
            var ins3 = new Df.Slider("history-slider");

            ins3.pars.animate = {
                time: 200,
                pause: 20
            };

            ins3.pars.iterateBy = 360;
            ins3.set();
        }

        /*
         * Recent history product tip
         */
        if ($('recent-history') && $('product-tip'))
        {
            var tip = $('product-tip');

            $$('ul#rv-products .hproduct').each(function(el) {
                el.observe('mouseover', function(event) {
                    var prd = Event.findElement(event, '.hproduct');

                    tip.clonePosition(prd, {
                        setWidth: false,
                        setHeight: false,
                        offsetTop: -80,
                        offsetLeft: 60
                    });

                    // Get details of product
                    var prdContent = prd.down('.product-tip-content').innerHTML;
                    tip.down('.tt-inner').innerHTML = prdContent;

                    tip.addClassName('show');
                });

                el.observe('mouseout', function(event) {
                    tip.removeClassName('show');
                });
            });

            tip.observe('mouseover', function(event) {
                tip.addClassName('show');
            });
            tip.observe('mouseout', function(event) {
                tip.removeClassName('show');
            });
        }

        if ($('add-to-cart') && ess.product)
        {
            $('add-to-cart').removeClassName('hide');
        }

        /*
         * Quantity validation
         */
        if (ess.product) {
            ess.validateQuantityOnKeyUp("#quantity", 999);
        }

        /* Quantity selection on click */
        /*$('quantity').observe('click', function(e){
            this.focus();
            this.select();
        });*/
    }
});
// JavaScript Document
if (Object.isUndefined(ess))
    ess = {};

ess.LTrim = function(value) {
    var re = /^\s*/;
    return value.replace(re, '');
}
ess.RTrim = function(value) {
    var re = /\s*$/;
    return value.replace(re, '');
}
ess.trim = function(value) {
    return ess.LTrim(ess.RTrim(value));
}

ess.titleCase = function(value)
{
    /* alert('--- titleCase ---' + '\nvalue = ' + value); */
    if (value != null)
    {
        var varTitleCaseOutput = '';
        var varTitleCaseInput = value.replace('  ',' ');
        var words = varTitleCaseInput.split(' ');
        if (words.length == 0)
        {
            varTitleCaseOutput = '';
        }
        else
        {
            var word;
            for (var i=0; i < words.length; i++)
            {
                word = words[i];
                /* alert('words['+i+'] = ' + word); */
                if (word.length > 0)
                {
                    word = word.substr(0,1).toUpperCase() + word.substr(1,word.length).toLowerCase();
                    if (varTitleCaseOutput.length != 0) varTitleCaseOutput += ' ';
                    varTitleCaseOutput += word;
                }
            }
            /* alert('varTitleCaseOutput = ' + varTitleCaseOutput); */
            value = varTitleCaseOutput;
        }
    }
    return value;
};

ess.confirmAction = function(url, message, formOrMethod, id) {
  if(confirm(message)){
    if (formOrMethod && formOrMethod.action) {
      formOrMethod.action = url;
	  formOrMethod.getInputs("submit")[0].click();
	  return true;
	}else if(formOrMethod && formOrMethod.toUpperCase() == 'POST'){
		$(document.body).insert(new Element('form', {name:'deleteForm', id: 'deleteForm', method: 'post', action: url}));
		if(id && id!=''){
			$('deleteForm').insert(new Element('input', {type:'hidden', name:'delete', value:id}));
		}
		$('deleteForm').submit();
	  	return true;
    }else{
      location.href = url;
	  return true;
    }
  } else {
    return false;
  }
};

ess.showCustomPopUp = function(thisUrl,thisName,theseParams){
    remote = open(thisUrl, thisName, theseParams);
};

ess.emailSignup = function(form) {
    if (!ess.isEmpty(form) && !ess.isEmpty(form.action) && !ess.isEmpty(form.emailAddress) && !ess.isEmpty(form.emailAddress.value)) {
        /* alert('===== ess.emailSignup =====' + '\nform.action = ' + form.action + '\nform.emailAddress.value = ' + form.emailAddress.value + '\n\nForm.serialize(form) = ' + Form.serialize(form)); */
        new Ajax.Request(form.action, {
            method: 'post',
            postBody: Form.serialize(form) + '&ajax=true',
            // parameters: 'emailAddress='+form.emailAddress.value,
            onLoading: function(e) {
                $('sign-up').addClassName('hidden');
                $('sign-up-loader').removeClassName('hidden');
            },
            onComplete: function(e) {
                if (e.status == 200)
                {
                    //console.log(e.responseText);
                    if (null != e.responseText.match(/<!-- success -->/i)) {
                        $('sign-up-loader').addClassName('hidden');
                        $('sign-up-success').removeClassName('hidden');
                        /* alert('*** about to fire em:signup ***'); */
                        $(document).fire("em:signup");
                        /* alert('*** after firing em:signup ***'); */
                    } else {
                        $('sign-up-loader').addClassName('hidden');
                        $('sign-up').removeClassName('hidden');
                        alert(ess.trim(e.responseText));
                    }
                }
                else
                {
                    $('sign-up-loader').addClassName('hidden');
                    $('sign-up').removeClassName('hidden');
                    alert('We are sorry, an error occurred while processing your request.');
                }
            },
            on403: function(e, m) {
                /* TODO: if exception occurs we need to perform redirect to login page! */
                /* debugging: */ console.log('::::: request to :::::\n' + form.action + '\n::::: caught in on403 :::::' + '\n\ne = ' + e + '\n\nm = ' + m);
            },
            onException: function(e, m) {
                /* if exception occurs just swallow it */
                /* debugging: */ console.log('::::: request to :::::\n' + form.action + '\n::::: caught in onException :::::' + '\n\ne = ' + e + '\n\nm = ' + m);
            },
            onError: function(e, m) {
                /* if error occurs just swallow it */
                /* debugging: */ console.log('::::: request to :::::\n' + form.action + '\n::::: caught in onError :::::' + '\n\ne = ' + e + '\n\nm = ' + m);
            },
            onFailure: function (e, m) {
                /* debugging: */ console.log('::::: request to :::::\n' + form.action + '\n::::: caught in onFailure :::::' + '\n\ne = ' + e + '\n\nm = ' + m);
            }
        });
        return false;
    }
};

/* 
 * Global navigation sub-category columns height fix 
 * 
 * @param holderClassName Class name of the element which height is being referenced
 * @param columnClassName Class name of columns which height is being adjusted
 * @param offset Offset value to increase/decrease the column height relative to the holder height
 */
function setColumnHeight(holderClassName, columnClassName, offset) {
    $$('.'+holderClassName).each(function(holder) {
         
        // Get computed height of sub-category holder
        var holderHeight = holder.getHeight();
        
        // Apply height to columns within holder
        holder.select('.'+columnClassName).each(function(column) {
            column.setStyle({
                height: (holderHeight+offset) + 'px'
            });
        });
    });
}

/*
 * Dom:loaded Events
 */
$(document).observe('dom:loaded', function(e){
    /* Init dropnav */
    $$('.df-dropnav').each(function(v){
        v.dropnav();
    });
    
    /* Global navigation sub-category columns height fix */
    setColumnHeight('subcat-holder', 'col', -50);

	 /* Email Sign-up */
     var addEmailAddress = $('add-email-address');
     if (addEmailAddress) {
         $(addEmailAddress).observe('click', function(event) {
             $('sign-up-success').addClassName('hidden');
             $('sign-up').removeClassName('hidden');
         });
     }
});

ess.createTabs = function(tabId) {
    if (!$(tabId)) {
        return;
    }

    var pars = {
        hideClassName: "inactive",
        showClassName: "active"
    };

    try {
        var tabs = new Df.Tabset(tabId, pars);
        var items = tabs.getItems();
        for (var i = 0; i < items.length; i++) {
            items[i].getElement().addClassName(pars.hideClassName);
        }
        tabs.showItem(0);
    } catch(err) {}
};
ess.isEmpty = function(val) {
    if (typeof val == "undefined") {
        return true;
    }
    if (val == undefined || val == null) {
        return true;
    }
    if (typeof val == "string") {
        return val.length == 0 || val == "null" || val == "undefined" || val == "false";
    }
    return false;
};
ess.validateEmail = function(name) {
    var regEx = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    var elemenet = $(name);
    return elemenet && !ess.isEmpty(elemenet.getValue()) && elemenet.getValue().match(regEx);
};

ess.previewEmailWishlist = function(url){
    var customerEmailAddress = $('customerEmailAddress').value;
    var recipientEmailAddress = $('recipientEmailAddress').value;
    var customerName = $('customerName').value;
    var message = $('message').value;
    $H({customerEmailAddress: customerEmailAddress, recipientEmailAddress: recipientEmailAddress, customerName: customerName, message: message}).toQueryString()
    // var previewUrl = url + '&customerEmailAddress=' + customerEmailAddress + '&recipientEmailAddress=' + recipientEmailAddress + '&customerName=' + customerName + '&message=' + message;
    var previewUrl = url + '?' + $H({customerEmailAddress: customerEmailAddress, recipientEmailAddress: recipientEmailAddress, customerName: customerName, message: message}).toQueryString();
    ess.showCustomPopUp(previewUrl, 'previewemailwishlist','width=580,height=550,toolbar=no,status=no,menubar=no,scrollbars=yes,resizable=no');
};

/*
 * Validate quantity of an input field on key up.
 *
 * @param selector Required: Selector for quantity input fields (e.g. #qty or .qty)
 * @param maxValue Optional: Maximum value allowed for input field (e.g. 99). Default: 999
 * @param callback Optional: Callback function to be executed after successful validation. Provides field value as parameter.
 */
ess.validateQuantityOnKeyUp = function(selector, maxValue, callback) {
    var el = $$(selector);

    if (typeof maxValue == 'undefined' || maxValue == null)
        maxValue = 999;

    if (el) {
        el.each(function(node) {
            node.observe('keyup', function(e){
                var field = Event.element(e);
                var num = field.getValue();
                var isNumber = /^-?\d+$/.test(num);

                try {
                    if (!isNumber || parseInt(field.getValue()) > maxValue) {
                        field.setValue(num.slice(0, num.length-1));
                        return false
                    }
                } catch(err) {
                    return false
                }

                if (typeof callback == 'function')
                    callback(num);

                return true;
            });
        });
    }
}
// JavaScript Document
if (Object.isUndefined(store))
	var store = {};

store.popup = {};

store.popup.height = 630;
store.popup.width = 530;

store.popup.standard = "width=" + store.popup.width + ",height=" + store.popup.height
	+ ",toolbar=no,status=no,menubar=no";
store.popup.helpDesk = function(url) {
	window.open(url, "helpdesk", store.popup.standard + ",scrollbars=yes,resizable=yes");
};
store.popup.promo = function(url) {
	window.open(url, "promo", "width=480,height=350,left=380,top=160,toolbar=no,status=no,menubar=no,resizable=no,scrollbars=yes");
};
store.popup.emailFriend = function(url) {
	window.open(url, "emailFriend", store.popup.standard + ",scrollbars=no,resizable=yes");
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
	var links = $$("a[rel~=popup]");
	for (var i = 0; i < links.length; i++) {
		var link = links[i];
		link.oldHref = link.href;
		if (link.rel.indexOf("helpdesk") >= 0) {
			link.observe("click", function() {
				store.popup.helpDesk(this.oldHref);
			});
			link.href = "javascript:void(0);";
		}
		if (link.rel.indexOf("promo") >= 0) {
			link.observe("click", function() {
				store.popup.promo(this.oldHref);
			});
			link.href = "javascript:void(0);";
		}
		if (link.rel.indexOf("email") >= 0) {
			link.observe("click", function() {
				store.popup.emailFriend(this.oldHref);
			});
			link.href = "javascript:void(0);";
		}
		if (link.rel.indexOf("sizechart") >= 0) {
			link.observe("click", function() {
				store.popup.sizeChart(this.oldHref);
			});
			link.href = "javascript:void(0);";
		}
		if (link.rel.indexOf("signup") >= 0) {
			link.observe("click", function() {
				store.popup.emailSignup(this.oldHref);
			});
			link.href = "javascript:void(0);";
		}
		if (link.rel.indexOf("web-collage") >= 0) {
			link.observe("click", function() {
				store.popup.webCollage(this.oldHref);
			});
			link.href = "javascript:void(0);";
		}
	}
};

$(document).observe("dom:loaded", function(e) {
	store.popup.transform();
});
function checklength(val)
{
	if(val.length == 0) return false;
	for(var j=val.length;j > 0;j--)
	{
		if(val.charAt(j-1) != ' ')
		{
			return true;
		}
	}
	return false;
}

function emailCheck(val)
{
var EmailOk  = true
var Temp     = val;
var AtSym    = Temp.indexOf('@')
var Period   = Temp.lastIndexOf('.')
var Space    = Temp.indexOf(' ')
var Length   = Temp.length - 1   // Array is from 0 to length-1

	if ((AtSym < 1) ||                 // '@' cannot be in first position
    (Period <= AtSym+1) ||             // Must be atleast one valid char btwn '@' and '.'
    (Period == Length ) ||             // Must be atleast one valid char after '.'
    (Space  != -1))                    // No empty spaces permitted
 	{
    	  return false;
 	}
   	return true;
}					

function valForm(frm)
{
	if(!emailCheck(frm.emailAddress.value))
	{
		alert("Please enter a valid email address.");
		if(!document.layers) frm.emailAddress.style.backgroundColor='yellow';
		frm.emailAddress.focus();
		return false;
	}
	return true;
}
/*
 * Copyright (c) 2009 Simo Kinnunen.
 * Licensed under the MIT license.
 *
 * @version 1.09
 */
var Cufon=(function(){var m=function(){return m.replace.apply(null,arguments)};var x=m.DOM={ready:(function(){var C=false,E={loaded:1,complete:1};var B=[],D=function(){if(C){return}C=true;for(var F;F=B.shift();F()){}};if(document.addEventListener){document.addEventListener("DOMContentLoaded",D,false);window.addEventListener("pageshow",D,false)}if(!window.opera&&document.readyState){(function(){E[document.readyState]?D():setTimeout(arguments.callee,10)})()}if(document.readyState&&document.createStyleSheet){(function(){try{document.body.doScroll("left");D()}catch(F){setTimeout(arguments.callee,1)}})()}q(window,"load",D);return function(F){if(!arguments.length){D()}else{C?F():B.push(F)}}})(),root:function(){return document.documentElement||document.body}};var n=m.CSS={Size:function(C,B){this.value=parseFloat(C);this.unit=String(C).match(/[a-z%]*$/)[0]||"px";this.convert=function(D){return D/B*this.value};this.convertFrom=function(D){return D/this.value*B};this.toString=function(){return this.value+this.unit}},addClass:function(C,B){var D=C.className;C.className=D+(D&&" ")+B;return C},color:j(function(C){var B={};B.color=C.replace(/^rgba\((.*?),\s*([\d.]+)\)/,function(E,D,F){B.opacity=parseFloat(F);return"rgb("+D+")"});return B}),fontStretch:j(function(B){if(typeof B=="number"){return B}if(/%$/.test(B)){return parseFloat(B)/100}return{"ultra-condensed":0.5,"extra-condensed":0.625,condensed:0.75,"semi-condensed":0.875,"semi-expanded":1.125,expanded:1.25,"extra-expanded":1.5,"ultra-expanded":2}[B]||1}),getStyle:function(C){var B=document.defaultView;if(B&&B.getComputedStyle){return new a(B.getComputedStyle(C,null))}if(C.currentStyle){return new a(C.currentStyle)}return new a(C.style)},gradient:j(function(F){var G={id:F,type:F.match(/^-([a-z]+)-gradient\(/)[1],stops:[]},C=F.substr(F.indexOf("(")).match(/([\d.]+=)?(#[a-f0-9]+|[a-z]+\(.*?\)|[a-z]+)/ig);for(var E=0,B=C.length,D;E<B;++E){D=C[E].split("=",2).reverse();G.stops.push([D[1]||E/(B-1),D[0]])}return G}),quotedList:j(function(E){var D=[],C=/\s*((["'])([\s\S]*?[^\\])\2|[^,]+)\s*/g,B;while(B=C.exec(E)){D.push(B[3]||B[1])}return D}),recognizesMedia:j(function(G){var E=document.createElement("style"),D,C,B;E.type="text/css";E.media=G;try{E.appendChild(document.createTextNode("/**/"))}catch(F){}C=g("head")[0];C.insertBefore(E,C.firstChild);D=(E.sheet||E.styleSheet);B=D&&!D.disabled;C.removeChild(E);return B}),removeClass:function(D,C){var B=RegExp("(?:^|\\s+)"+C+"(?=\\s|$)","g");D.className=D.className.replace(B,"");return D},supports:function(D,C){var B=document.createElement("span").style;if(B[D]===undefined){return false}B[D]=C;return B[D]===C},textAlign:function(E,D,B,C){if(D.get("textAlign")=="right"){if(B>0){E=" "+E}}else{if(B<C-1){E+=" "}}return E},textShadow:j(function(F){if(F=="none"){return null}var E=[],G={},B,C=0;var D=/(#[a-f0-9]+|[a-z]+\(.*?\)|[a-z]+)|(-?[\d.]+[a-z%]*)|,/ig;while(B=D.exec(F)){if(B[0]==","){E.push(G);G={};C=0}else{if(B[1]){G.color=B[1]}else{G[["offX","offY","blur"][C++]]=B[2]}}}E.push(G);return E}),textTransform:(function(){var B={uppercase:function(C){return C.toUpperCase()},lowercase:function(C){return C.toLowerCase()},capitalize:function(C){return C.replace(/\b./g,function(D){return D.toUpperCase()})}};return function(E,D){var C=B[D.get("textTransform")];return C?C(E):E}})(),whiteSpace:(function(){var D={inline:1,"inline-block":1,"run-in":1};var C=/^\s+/,B=/\s+$/;return function(H,F,G,E){if(E){if(E.nodeName.toLowerCase()=="br"){H=H.replace(C,"")}}if(D[F.get("display")]){return H}if(!G.previousSibling){H=H.replace(C,"")}if(!G.nextSibling){H=H.replace(B,"")}return H}})()};n.ready=(function(){var B=!n.recognizesMedia("all"),E=false;var D=[],H=function(){B=true;for(var K;K=D.shift();K()){}};var I=g("link"),J=g("style");function C(K){return K.disabled||G(K.sheet,K.media||"screen")}function G(M,P){if(!n.recognizesMedia(P||"all")){return true}if(!M||M.disabled){return false}try{var Q=M.cssRules,O;if(Q){search:for(var L=0,K=Q.length;O=Q[L],L<K;++L){switch(O.type){case 2:break;case 3:if(!G(O.styleSheet,O.media.mediaText)){return false}break;default:break search}}}}catch(N){}return true}function F(){if(document.createStyleSheet){return true}var L,K;for(K=0;L=I[K];++K){if(L.rel.toLowerCase()=="stylesheet"&&!C(L)){return false}}for(K=0;L=J[K];++K){if(!C(L)){return false}}return true}x.ready(function(){if(!E){E=n.getStyle(document.body).isUsable()}if(B||(E&&F())){H()}else{setTimeout(arguments.callee,10)}});return function(K){if(B){K()}else{D.push(K)}}})();function s(D){var C=this.face=D.face,B={"\u0020":1,"\u00a0":1,"\u3000":1};this.glyphs=D.glyphs;this.w=D.w;this.baseSize=parseInt(C["units-per-em"],10);this.family=C["font-family"].toLowerCase();this.weight=C["font-weight"];this.style=C["font-style"]||"normal";this.viewBox=(function(){var F=C.bbox.split(/\s+/);var E={minX:parseInt(F[0],10),minY:parseInt(F[1],10),maxX:parseInt(F[2],10),maxY:parseInt(F[3],10)};E.width=E.maxX-E.minX;E.height=E.maxY-E.minY;E.toString=function(){return[this.minX,this.minY,this.width,this.height].join(" ")};return E})();this.ascent=-parseInt(C.ascent,10);this.descent=-parseInt(C.descent,10);this.height=-this.ascent+this.descent;this.spacing=function(L,N,E){var O=this.glyphs,M,K,G,P=[],F=0,J=-1,I=-1,H;while(H=L[++J]){M=O[H]||this.missingGlyph;if(!M){continue}if(K){F-=G=K[H]||0;P[I]-=G}F+=P[++I]=~~(M.w||this.w)+N+(B[H]?E:0);K=M.k}P.total=F;return P}}function f(){var C={},B={oblique:"italic",italic:"oblique"};this.add=function(D){(C[D.style]||(C[D.style]={}))[D.weight]=D};this.get=function(H,I){var G=C[H]||C[B[H]]||C.normal||C.italic||C.oblique;if(!G){return null}I={normal:400,bold:700}[I]||parseInt(I,10);if(G[I]){return G[I]}var E={1:1,99:0}[I%100],K=[],F,D;if(E===undefined){E=I>400}if(I==500){I=400}for(var J in G){if(!k(G,J)){continue}J=parseInt(J,10);if(!F||J<F){F=J}if(!D||J>D){D=J}K.push(J)}if(I<F){I=F}if(I>D){I=D}K.sort(function(M,L){return(E?(M>=I&&L>=I)?M<L:M>L:(M<=I&&L<=I)?M>L:M<L)?-1:1});return G[K[0]]}}function r(){function D(F,G){if(F.contains){return F.contains(G)}return F.compareDocumentPosition(G)&16}function B(G){var F=G.relatedTarget;if(!F||D(this,F)){return}C(this,G.type=="mouseover")}function E(F){C(this,F.type=="mouseenter")}function C(F,G){setTimeout(function(){var H=d.get(F).options;m.replace(F,G?h(H,H.hover):H,true)},10)}this.attach=function(F){if(F.onmouseenter===undefined){q(F,"mouseover",B);q(F,"mouseout",B)}else{q(F,"mouseenter",E);q(F,"mouseleave",E)}}}function u(){var C=[],D={};function B(H){var E=[],G;for(var F=0;G=H[F];++F){E[F]=C[D[G]]}return E}this.add=function(F,E){D[F]=C.push(E)-1};this.repeat=function(){var E=arguments.length?B(arguments):C,F;for(var G=0;F=E[G++];){m.replace(F[0],F[1],true)}}}function A(){var D={},B=0;function C(E){return E.cufid||(E.cufid=++B)}this.get=function(E){var F=C(E);return D[F]||(D[F]={})}}function a(B){var D={},C={};this.extend=function(E){for(var F in E){if(k(E,F)){D[F]=E[F]}}return this};this.get=function(E){return D[E]!=undefined?D[E]:B[E]};this.getSize=function(F,E){return C[F]||(C[F]=new n.Size(this.get(F),E))};this.isUsable=function(){return !!B}}function q(C,B,D){if(C.addEventListener){C.addEventListener(B,D,false)}else{if(C.attachEvent){C.attachEvent("on"+B,function(){return D.call(C,window.event)})}}}function v(C,B){var D=d.get(C);if(D.options){return C}if(B.hover&&B.hoverables[C.nodeName.toLowerCase()]){b.attach(C)}D.options=B;return C}function j(B){var C={};return function(D){if(!k(C,D)){C[D]=B.apply(null,arguments)}return C[D]}}function c(F,E){var B=n.quotedList(E.get("fontFamily").toLowerCase()),D;for(var C=0;D=B[C];++C){if(i[D]){return i[D].get(E.get("fontStyle"),E.get("fontWeight"))}}return null}function g(B){return document.getElementsByTagName(B)}function k(C,B){return C.hasOwnProperty(B)}function h(){var C={},B,F;for(var E=0,D=arguments.length;B=arguments[E],E<D;++E){for(F in B){if(k(B,F)){C[F]=B[F]}}}return C}function o(E,M,C,N,F,D){var K=document.createDocumentFragment(),H;if(M===""){return K}var L=N.separate;var I=M.split(p[L]),B=(L=="words");if(B&&t){if(/^\s/.test(M)){I.unshift("")}if(/\s$/.test(M)){I.push("")}}for(var J=0,G=I.length;J<G;++J){H=z[N.engine](E,B?n.textAlign(I[J],C,J,G):I[J],C,N,F,D,J<G-1);if(H){K.appendChild(H)}}return K}function l(D,M){var C=D.nodeName.toLowerCase();if(M.ignore[C]){return}var E=!M.textless[C];var B=n.getStyle(v(D,M)).extend(M);var F=c(D,B),G,K,I,H,L,J;if(!F){return}for(G=D.firstChild;G;G=I){K=G.nodeType;I=G.nextSibling;if(E&&K==3){if(H){H.appendData(G.data);D.removeChild(G)}else{H=G}if(I){continue}}if(H){D.replaceChild(o(F,n.whiteSpace(H.data,B,H,J),B,M,G,D),H);H=null}if(K==1){if(G.firstChild){if(G.nodeName.toLowerCase()=="cufon"){z[M.engine](F,null,B,M,G,D)}else{arguments.callee(G,M)}}J=G}}}var t=" ".split(/\s+/).length==0;var d=new A();var b=new r();var y=new u();var e=false;var z={},i={},w={autoDetect:false,engine:null,forceHitArea:false,hover:false,hoverables:{a:true},ignore:{applet:1,canvas:1,col:1,colgroup:1,head:1,iframe:1,map:1,optgroup:1,option:1,script:1,select:1,style:1,textarea:1,title:1,pre:1},printable:true,selector:(window.Sizzle||(window.jQuery&&function(B){return jQuery(B)})||(window.dojo&&dojo.query)||(window.Ext&&Ext.query)||(window.YAHOO&&YAHOO.util&&YAHOO.util.Selector&&YAHOO.util.Selector.query)||(window.$$&&function(B){return $$(B)})||(window.$&&function(B){return $(B)})||(document.querySelectorAll&&function(B){return document.querySelectorAll(B)})||g),separate:"words",textless:{dl:1,html:1,ol:1,table:1,tbody:1,thead:1,tfoot:1,tr:1,ul:1},textShadow:"none"};var p={words:/\s/.test("\u00a0")?/[^\S\u00a0]+/:/\s+/,characters:"",none:/^/};m.now=function(){x.ready();return m};m.refresh=function(){y.repeat.apply(y,arguments);return m};m.registerEngine=function(C,B){if(!B){return m}z[C]=B;return m.set("engine",C)};m.registerFont=function(D){if(!D){return m}var B=new s(D),C=B.family;if(!i[C]){i[C]=new f()}i[C].add(B);return m.set("fontFamily",'"'+C+'"')};m.replace=function(D,C,B){C=h(w,C);if(!C.engine){return m}if(!e){n.addClass(x.root(),"cufon-active cufon-loading");n.ready(function(){n.addClass(n.removeClass(x.root(),"cufon-loading"),"cufon-ready")});e=true}if(C.hover){C.forceHitArea=true}if(C.autoDetect){delete C.fontFamily}if(typeof C.textShadow=="string"){C.textShadow=n.textShadow(C.textShadow)}if(typeof C.color=="string"&&/^-/.test(C.color)){C.textGradient=n.gradient(C.color)}else{delete C.textGradient}if(!B){y.add(D,arguments)}if(D.nodeType||typeof D=="string"){D=[D]}n.ready(function(){for(var F=0,E=D.length;F<E;++F){var G=D[F];if(typeof G=="string"){m.replace(C.selector(G),C,true)}else{l(G,C)}}});return m};m.set=function(B,C){w[B]=C;return m};return m})();Cufon.registerEngine("canvas",(function(){var b=document.createElement("canvas");if(!b||!b.getContext||!b.getContext.apply){return}b=null;var a=Cufon.CSS.supports("display","inline-block");var e=!a&&(document.compatMode=="BackCompat"||/frameset|transitional/i.test(document.doctype.publicId));var f=document.createElement("style");f.type="text/css";f.appendChild(document.createTextNode(("cufon{text-indent:0;}@media screen,projection{cufon{display:inline;display:inline-block;position:relative;vertical-align:middle;"+(e?"":"font-size:1px;line-height:1px;")+"}cufon cufontext{display:-moz-inline-box;display:inline-block;width:0;height:0;overflow:hidden;text-indent:-10000in;}"+(a?"cufon canvas{position:relative;}":"cufon canvas{position:absolute;}")+"}@media print{cufon{padding:0;}cufon canvas{display:none;}}").replace(/;/g,"!important;")));document.getElementsByTagName("head")[0].appendChild(f);function d(p,h){var n=0,m=0;var g=[],o=/([mrvxe])([^a-z]*)/g,k;generate:for(var j=0;k=o.exec(p);++j){var l=k[2].split(",");switch(k[1]){case"v":g[j]={m:"bezierCurveTo",a:[n+~~l[0],m+~~l[1],n+~~l[2],m+~~l[3],n+=~~l[4],m+=~~l[5]]};break;case"r":g[j]={m:"lineTo",a:[n+=~~l[0],m+=~~l[1]]};break;case"m":g[j]={m:"moveTo",a:[n=~~l[0],m=~~l[1]]};break;case"x":g[j]={m:"closePath"};break;case"e":break generate}h[g[j].m].apply(h,g[j].a)}return g}function c(m,k){for(var j=0,h=m.length;j<h;++j){var g=m[j];k[g.m].apply(k,g.a)}}return function(V,w,P,t,C,W){var k=(w===null);if(k){w=C.getAttribute("alt")}var A=V.viewBox;var m=P.getSize("fontSize",V.baseSize);var B=0,O=0,N=0,u=0;var z=t.textShadow,L=[];if(z){for(var U=z.length;U--;){var F=z[U];var K=m.convertFrom(parseFloat(F.offX));var I=m.convertFrom(parseFloat(F.offY));L[U]=[K,I];if(I<B){B=I}if(K>O){O=K}if(I>N){N=I}if(K<u){u=K}}}var Z=Cufon.CSS.textTransform(w,P).split("");var E=V.spacing(Z,~~m.convertFrom(parseFloat(P.get("letterSpacing"))||0),~~m.convertFrom(parseFloat(P.get("wordSpacing"))||0));if(!E.length){return null}var h=E.total;O+=A.width-E[E.length-1];u+=A.minX;var s,n;if(k){s=C;n=C.firstChild}else{s=document.createElement("cufon");s.className="cufon cufon-canvas";s.setAttribute("alt",w);n=document.createElement("canvas");s.appendChild(n);if(t.printable){var S=document.createElement("cufontext");S.appendChild(document.createTextNode(w));s.appendChild(S)}}var aa=s.style;var H=n.style;var j=m.convert(A.height);var Y=Math.ceil(j);var M=Y/j;var G=M*Cufon.CSS.fontStretch(P.get("fontStretch"));var J=h*G;var Q=Math.ceil(m.convert(J+O-u));var o=Math.ceil(m.convert(A.height-B+N));n.width=Q;n.height=o;H.width=Q+"px";H.height=o+"px";B+=A.minY;H.top=Math.round(m.convert(B-V.ascent))+"px";H.left=Math.round(m.convert(u))+"px";var r=Math.max(Math.ceil(m.convert(J)),0)+"px";if(a){aa.width=r;aa.height=m.convert(V.height)+"px"}else{aa.paddingLeft=r;aa.paddingBottom=(m.convert(V.height)-1)+"px"}var X=n.getContext("2d"),D=j/A.height;X.scale(D,D*M);X.translate(-u,-B);X.save();function T(){var x=V.glyphs,ab,l=-1,g=-1,y;X.scale(G,1);while(y=Z[++l]){var ab=x[Z[l]]||V.missingGlyph;if(!ab){continue}if(ab.d){X.beginPath();if(ab.code){c(ab.code,X)}else{ab.code=d("m"+ab.d,X)}X.fill()}X.translate(E[++g],0)}X.restore()}if(z){for(var U=z.length;U--;){var F=z[U];X.save();X.fillStyle=F.color;X.translate.apply(X,L[U]);T()}}var q=t.textGradient;if(q){var v=q.stops,p=X.createLinearGradient(0,A.minY,0,A.maxY);for(var U=0,R=v.length;U<R;++U){p.addColorStop.apply(p,v[U])}X.fillStyle=p}else{X.fillStyle=P.get("color")}T();return s}})());Cufon.registerEngine("vml",(function(){var e=document.namespaces;if(!e){return}e.add("cvml","urn:schemas-microsoft-com:vml");e=null;var b=document.createElement("cvml:shape");b.style.behavior="url(#default#VML)";if(!b.coordsize){return}b=null;var h=(document.documentMode||0)<8;document.write(('<style type="text/css">cufoncanvas{text-indent:0;}@media screen{cvml\\:shape,cvml\\:rect,cvml\\:fill,cvml\\:shadow{behavior:url(#default#VML);display:block;antialias:true;position:absolute;}cufoncanvas{position:absolute;text-align:left;}cufon{display:inline-block;position:relative;vertical-align:'+(h?"middle":"text-bottom")+";}cufon cufontext{position:absolute;left:-10000in;font-size:1px;}a cufon{cursor:pointer}}@media print{cufon cufoncanvas{display:none;}}</style>").replace(/;/g,"!important;"));function c(i,j){return a(i,/(?:em|ex|%)$|^[a-z-]+$/i.test(j)?"1em":j)}function a(l,m){if(m==="0"){return 0}if(/px$/i.test(m)){return parseFloat(m)}var k=l.style.left,j=l.runtimeStyle.left;l.runtimeStyle.left=l.currentStyle.left;l.style.left=m.replace("%","em");var i=l.style.pixelLeft;l.style.left=k;l.runtimeStyle.left=j;return i}function f(l,k,j,n){var i="computed"+n,m=k[i];if(isNaN(m)){m=k.get(n);k[i]=m=(m=="normal")?0:~~j.convertFrom(a(l,m))}return m}var g={};function d(p){var q=p.id;if(!g[q]){var n=p.stops,o=document.createElement("cvml:fill"),i=[];o.type="gradient";o.angle=180;o.focus="0";o.method="sigma";o.color=n[0][1];for(var m=1,l=n.length-1;m<l;++m){i.push(n[m][0]*100+"% "+n[m][1])}o.colors=i.join(",");o.color2=n[l][1];g[q]=o}return g[q]}return function(ac,G,Y,C,K,ad,W){var n=(G===null);if(n){G=K.alt}var I=ac.viewBox;var p=Y.computedFontSize||(Y.computedFontSize=new Cufon.CSS.Size(c(ad,Y.get("fontSize"))+"px",ac.baseSize));var y,q;if(n){y=K;q=K.firstChild}else{y=document.createElement("cufon");y.className="cufon cufon-vml";y.alt=G;q=document.createElement("cufoncanvas");y.appendChild(q);if(C.printable){var Z=document.createElement("cufontext");Z.appendChild(document.createTextNode(G));y.appendChild(Z)}if(!W){y.appendChild(document.createElement("cvml:shape"))}}var ai=y.style;var R=q.style;var l=p.convert(I.height),af=Math.ceil(l);var V=af/l;var P=V*Cufon.CSS.fontStretch(Y.get("fontStretch"));var U=I.minX,T=I.minY;R.height=af;R.top=Math.round(p.convert(T-ac.ascent));R.left=Math.round(p.convert(U));ai.height=p.convert(ac.height)+"px";var F=Y.get("color");var ag=Cufon.CSS.textTransform(G,Y).split("");var L=ac.spacing(ag,f(ad,Y,p,"letterSpacing"),f(ad,Y,p,"wordSpacing"));if(!L.length){return null}var k=L.total;var x=-U+k+(I.width-L[L.length-1]);var ah=p.convert(x*P),X=Math.round(ah);var O=x+","+I.height,m;var J="r"+O+"ns";var u=C.textGradient&&d(C.textGradient);var o=ac.glyphs,S=0;var H=C.textShadow;var ab=-1,aa=0,w;while(w=ag[++ab]){var D=o[ag[ab]]||ac.missingGlyph,v;if(!D){continue}if(n){v=q.childNodes[aa];while(v.firstChild){v.removeChild(v.firstChild)}}else{v=document.createElement("cvml:shape");q.appendChild(v)}v.stroked="f";v.coordsize=O;v.coordorigin=m=(U-S)+","+T;v.path=(D.d?"m"+D.d+"xe":"")+"m"+m+J;v.fillcolor=F;if(u){v.appendChild(u.cloneNode(false))}var ae=v.style;ae.width=X;ae.height=af;if(H){var s=H[0],r=H[1];var B=Cufon.CSS.color(s.color),z;var N=document.createElement("cvml:shadow");N.on="t";N.color=B.color;N.offset=s.offX+","+s.offY;if(r){z=Cufon.CSS.color(r.color);N.type="double";N.color2=z.color;N.offset2=r.offX+","+r.offY}N.opacity=B.opacity||(z&&z.opacity)||1;v.appendChild(N)}S+=L[aa++]}var M=v.nextSibling,t,A;if(C.forceHitArea){if(!M){M=document.createElement("cvml:rect");M.stroked="f";M.className="cufon-vml-cover";t=document.createElement("cvml:fill");t.opacity=0;M.appendChild(t);q.appendChild(M)}A=M.style;A.width=X;A.height=af}else{if(M){q.removeChild(M)}}ai.width=Math.max(Math.ceil(p.convert(k*P)),0);if(h){var Q=Y.computedYAdjust;if(Q===undefined){var E=Y.get("lineHeight");if(E=="normal"){E="1em"}else{if(!isNaN(E)){E+="em"}}Y.computedYAdjust=Q=0.5*(a(ad,E)-parseFloat(ai.height))}if(Q){ai.marginTop=Math.ceil(Q)+"px";ai.marginBottom=Q+"px"}}return y}})());
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
document.registerCufonFonts = function() {
    /*!
     * The following copyright notice may not be removed under any circumstances.
     *
     * Copyright:
     * Copyright (c) 1990 Adobe Systems Incorporated.  All Rights Reserved.Helvetica
     * is a trademark of Linotype AG and/or its subsidiaries.
     *
     * Trademark:
     * Please refer to the Copyright section for the font trademark attribution
     * notices.
     *
     * Full name:
     * HelveticaNeue-LightCond
     */
    Cufon.registerFont({"w":66,"face":{"font-family":"HelveticaNeue Condensed","font-weight":300,"font-stretch":"condensed","units-per-em":"360","panose-1":"2 11 4 6 0 0 0 0 0 0","ascent":"287","descent":"-73","x-height":"4","bbox":"-60 -334 360 72.9331","underline-thickness":"18","underline-position":"-18","stemh":"18","stemv":"22","unicode-range":"U+0020-U+FB02"},"glyphs":{" ":{"w":86,"k":{"\u201c":13,"\u2018":13,"Y":13,"W":13,"V":13,"T":13,"A":13}},"\u00a0":{"w":86},"!":{"d":"35,-67r-4,-190r24,0r-4,190r-16,0xm31,0r0,-37r24,0r0,37r-24,0","w":86},"\"":{"d":"26,-171r0,-86r21,0r0,86r-21,0xm80,-171r0,-86r21,0r0,86r-21,0","w":126},"#":{"d":"68,-153r-7,56r44,0r7,-56r-44,0xm1,-81r0,-16r42,0r7,-56r-40,0r0,-16r42,0r11,-82r18,0r-11,82r44,0r11,-82r18,0r-11,82r40,0r0,16r-42,0r-7,56r39,0r0,16r-41,0r-11,81r-18,0r11,-81r-44,0r-11,81r-18,0r11,-81r-40,0","w":172},"$":{"d":"79,-143r0,-92v-27,3,-41,21,-41,44v0,28,18,40,41,48xm95,-116r0,101v26,-3,44,-20,44,-51v0,-30,-20,-41,-44,-50xm79,4v-46,-3,-71,-30,-69,-81r23,0v-2,36,13,59,46,62r0,-106v-32,-9,-64,-22,-64,-68v0,-37,23,-63,64,-66r0,-25r16,0r0,25v42,3,61,27,61,69r-24,0v0,-28,-11,-46,-37,-49r0,98v33,11,67,21,67,68v0,45,-26,69,-67,73r0,30r-16,0r0,-30","w":172},"%":{"d":"39,-189v0,39,10,51,25,51v15,0,26,-12,26,-51v0,-38,-11,-50,-26,-50v-15,0,-25,12,-25,50xm66,4r110,-259r18,0r-110,259r-18,0xm170,-62v0,39,10,50,25,50v15,0,26,-11,26,-50v0,-38,-11,-50,-26,-50v-15,0,-25,12,-25,50xm19,-189v0,-52,16,-66,45,-66v29,0,46,14,46,66v0,52,-17,67,-46,67v-29,0,-45,-15,-45,-67xm150,-62v0,-52,16,-66,45,-66v29,0,46,14,46,66v0,52,-17,66,-46,66v-29,0,-45,-14,-45,-66","w":259},"&":{"d":"171,0r-23,-31v-28,57,-140,40,-140,-33v0,-36,32,-64,58,-82v-40,-40,-41,-109,23,-111v30,0,50,19,50,47v0,21,-9,41,-46,67r56,77v6,-16,9,-32,9,-48r22,0v0,22,-6,45,-18,66r33,48r-24,0xm88,-239v-45,0,-31,52,-6,81v28,-22,35,-38,35,-52v0,-17,-12,-29,-29,-29xm137,-48r-60,-84v-36,25,-46,46,-46,66v0,61,85,66,106,18","w":193},"\u2019":{"d":"32,-220r0,-37r25,0v-1,39,6,73,-27,86v-2,-23,15,-21,12,-49r-10,0","w":86,"k":{"s":20,"\u2019":39}},"(":{"d":"67,-257r16,0v-56,97,-56,226,0,323r-16,0v-66,-118,-65,-205,0,-323","w":79},")":{"d":"13,66r-16,0v56,-97,56,-226,0,-323r16,0v65,118,64,205,0,323","w":79},"*":{"d":"52,-257r16,0r0,40r38,-12r5,15r-38,12r23,32r-12,10r-24,-33r-23,33r-13,-10r23,-32r-38,-12r5,-15r38,12r0,-40","w":120},"+":{"d":"99,0r0,-82r-82,0r0,-18r82,0r0,-82r18,0r0,82r82,0r0,18r-82,0r0,82r-18,0","w":216},",":{"d":"31,0r0,-37r24,0v-1,39,7,74,-26,87v-2,-24,15,-22,12,-50r-10,0","w":86,"k":{"\u201d":13,"\u2019":13," ":13}},"-":{"d":"21,-112r78,0r0,19r-78,0r0,-19","w":119},"\u00ad":{"d":"21,-112r78,0r0,19r-78,0r0,-19","w":119},".":{"d":"31,0r0,-37r24,0r0,37r-24,0","w":86,"k":{" ":13}},"\/":{"d":"84,-261r20,0r-88,265r-20,0","w":100},"0":{"d":"38,-125v0,82,13,111,48,111v35,0,49,-29,49,-111v0,-82,-14,-112,-49,-112v-35,0,-48,30,-48,112xm15,-125v0,-75,13,-130,71,-130v58,0,72,55,72,130v0,75,-14,129,-72,129v-58,0,-71,-54,-71,-129","w":172},"1":{"d":"83,0r0,-195r-59,0r0,-16v43,0,63,-17,64,-44r16,0r0,255r-21,0","w":172},"2":{"d":"40,-175r-23,0v1,-49,24,-80,72,-80v35,0,66,20,66,69v0,73,-109,100,-115,167r117,0r0,19r-141,0v-4,-54,44,-91,80,-121v26,-22,36,-40,36,-64v0,-34,-19,-52,-45,-52v-29,0,-46,20,-47,62","w":172},"3":{"d":"67,-123r0,-18v38,3,60,-14,60,-48v0,-30,-14,-48,-42,-48v-26,0,-45,17,-45,53r-23,0v0,-42,23,-71,68,-71v72,0,90,106,24,121v30,4,49,30,49,61v0,46,-25,77,-73,77v-44,0,-69,-24,-71,-72r23,0v0,30,15,54,48,54v26,0,50,-15,50,-58v0,-39,-27,-55,-68,-51","w":172},"4":{"d":"110,0r0,-66r-98,0r0,-21r98,-168r21,0r0,170r30,0r0,19r-30,0r0,66r-21,0xm31,-85r79,0r-1,-133","w":172},"5":{"d":"35,-251r111,0r0,20r-94,0r-11,90v39,-52,117,-25,117,58v0,51,-26,87,-76,87v-40,0,-67,-24,-67,-69r23,0v0,29,16,51,47,51v31,0,50,-25,50,-73v0,-61,-73,-86,-94,-33r-21,0","w":172},"6":{"d":"154,-195r-23,0v-1,-25,-16,-42,-41,-42v-35,-1,-52,33,-53,117v23,-73,122,-44,122,37v0,48,-22,87,-71,87v-58,0,-74,-42,-74,-122v0,-84,16,-137,77,-137v40,0,62,25,63,60xm41,-79v0,33,13,65,48,65v35,0,47,-32,47,-65v0,-33,-12,-65,-47,-65v-35,0,-48,32,-48,65","w":172},"7":{"d":"15,-231r0,-20r143,0r0,20v-55,67,-86,162,-91,231r-25,0v4,-70,44,-170,94,-231r-121,0","w":172},"8":{"d":"38,-70v0,31,16,56,48,56v32,0,49,-25,49,-56v0,-31,-17,-57,-49,-57v-32,0,-48,26,-48,57xm86,4v-76,0,-100,-127,-25,-139v-23,-8,-39,-32,-39,-57v0,-42,27,-63,64,-63v68,0,89,102,26,119v29,6,46,32,46,64v0,48,-29,76,-72,76xm45,-191v0,27,14,46,41,46v28,0,41,-19,41,-46v0,-27,-13,-46,-41,-46v-27,0,-41,19,-41,46","w":172},"9":{"d":"19,-55r23,0v1,25,15,41,40,41v34,0,55,-36,53,-116v-23,72,-121,42,-121,-38v0,-48,22,-87,71,-87v58,0,74,43,74,123v0,84,-17,136,-78,136v-40,0,-61,-24,-62,-59xm37,-172v0,33,12,65,47,65v35,0,48,-32,48,-65v0,-33,-13,-65,-48,-65v-35,0,-47,32,-47,65","w":172},":":{"d":"31,-144r0,-36r24,0r0,36r-24,0xm31,0r0,-37r24,0r0,37r-24,0","w":86,"k":{" ":13}},";":{"d":"31,0r0,-37r24,0v-1,39,7,74,-26,87v-2,-24,15,-22,12,-50r-10,0xm31,-144r0,-36r24,0r0,36r-24,0","w":86},"<":{"d":"17,-81r0,-20r182,-84r0,19r-160,75r160,74r0,20","w":216},"=":{"d":"17,-117r0,-18r182,0r0,18r-182,0xm17,-47r0,-18r182,0r0,18r-182,0","w":216},">":{"d":"17,3r0,-20r160,-74r-160,-75r0,-19r182,84r0,20","w":216},"?":{"d":"82,-67r-22,0v-12,-63,57,-79,58,-132v0,-26,-16,-44,-40,-44v-31,0,-46,21,-46,60r-23,0v0,-45,21,-78,67,-78v65,-1,86,75,42,119v-19,19,-41,37,-36,75xm59,0r0,-37r25,0r0,37r-25,0","w":153},"@":{"d":"87,-104v0,22,9,37,31,37v39,0,67,-54,67,-87v0,-23,-9,-35,-31,-35v-39,0,-67,51,-67,85xm196,-177v5,-6,6,-17,10,-24r20,0r-41,127v0,5,4,9,10,9v32,0,64,-50,64,-87v0,-57,-52,-94,-108,-94v-71,0,-122,55,-122,117v0,65,54,117,122,117v39,0,80,-18,99,-49r22,0v-24,40,-72,65,-121,65v-80,0,-140,-60,-140,-133v0,-74,63,-132,140,-132v70,0,126,46,126,110v0,55,-46,102,-85,102v-15,0,-23,-9,-26,-24v-31,39,-99,31,-98,-29v0,-50,37,-105,88,-105v17,0,32,8,40,30","w":288},"A":{"d":"50,-94r80,0r-40,-145xm0,0r76,-257r28,0r76,257r-24,0r-21,-75r-90,0r-21,75r-24,0","w":180,"k":{"\u201d":20,"y":6,"w":6,"v":6,"Y":20,"W":10,"V":10,"U":-2,"T":20,"Q":-2,"\u2019":20}},"B":{"d":"43,-238r0,94v49,3,94,-3,94,-47v0,-50,-45,-48,-94,-47xm43,-125r0,106v54,3,102,-1,102,-53v0,-52,-48,-56,-102,-53xm20,0r0,-257r71,0v83,-7,90,101,30,120v30,9,47,30,47,65v0,45,-28,72,-77,72r-71,0","w":180},"C":{"d":"153,-87r23,0v-3,59,-30,91,-76,91v-53,0,-82,-41,-82,-133v0,-92,29,-132,82,-132v52,0,74,37,74,79r-23,0v0,-35,-18,-60,-51,-60v-37,0,-59,30,-59,113v0,83,22,114,59,114v32,0,50,-28,53,-72","w":186},"D":{"d":"20,0r0,-257r62,0v75,0,93,44,93,128v0,84,-18,129,-93,129r-62,0xm43,-238r0,219v80,4,109,-6,109,-109v0,-103,-28,-115,-109,-110","w":193},"E":{"d":"20,0r0,-257r128,0r0,19r-105,0r0,94r98,0r0,19r-98,0r0,106r108,0r0,19r-131,0","w":159},"F":{"d":"20,0r0,-257r128,0r0,19r-105,0r0,94r98,0r0,19r-98,0r0,125r-23,0","w":153,"k":{"A":13,".":40,",":40}},"G":{"d":"154,-112r-61,0r0,-19r82,0r0,131r-18,0r0,-42v-8,28,-31,46,-57,46v-53,0,-82,-41,-82,-133v0,-92,29,-132,82,-132v49,0,71,32,74,76r-23,0v0,-31,-17,-57,-51,-57v-37,0,-59,30,-59,113v0,83,22,114,59,114v37,0,55,-37,54,-97","w":193},"H":{"d":"144,0r0,-128r-101,0r0,128r-23,0r0,-257r23,0r0,109r101,0r0,-109r23,0r0,257r-23,0","w":186},"I":{"d":"22,0r0,-257r23,0r0,257r-23,0"},"J":{"d":"65,4v-40,0,-61,-26,-58,-79r23,0v-1,36,7,60,34,60v25,0,39,-11,39,-52r0,-190r23,0r0,193v0,44,-20,68,-61,68","w":146},"K":{"d":"20,0r0,-257r23,0r1,135r98,-135r25,0r-79,107r87,150r-24,0r-77,-130r-31,40r0,90r-23,0","w":172},"L":{"d":"20,0r0,-257r23,0r0,238r107,0r0,19r-130,0","w":153,"k":{"\u201d":33,"y":13,"Y":33,"W":27,"V":27,"T":27,"\u2019":33}},"M":{"d":"22,0r0,-257r40,0r63,228r62,-228r38,0r0,257r-23,0r-1,-235r-67,235r-21,0r-68,-235r0,235r-23,0","w":246},"N":{"d":"20,0r0,-257r31,0r99,224r0,-224r23,0r0,257r-31,0r-99,-224r0,224r-23,0","w":193},"O":{"d":"18,-129v0,-92,29,-132,82,-132v53,0,82,40,82,132v0,92,-29,133,-82,133v-53,0,-82,-41,-82,-133xm41,-129v0,83,22,114,59,114v37,0,59,-31,59,-114v0,-83,-22,-113,-59,-113v-37,0,-59,30,-59,113","w":200},"P":{"d":"43,-238r0,107v51,1,93,3,94,-53v1,-55,-41,-56,-94,-54xm20,0r0,-257r70,0v50,0,70,29,70,73v0,40,-19,72,-78,72r-39,0r0,112r-23,0","w":172,"k":{"A":13,".":46,",":46}},"Q":{"d":"172,14r-25,-26v-70,43,-129,-1,-129,-117v0,-92,29,-132,82,-132v53,0,82,40,82,132v0,48,-8,83,-23,104r26,25xm132,-27r-29,-28r13,-13r28,27v10,-18,15,-48,15,-88v0,-83,-22,-113,-59,-113v-37,0,-59,30,-59,113v-1,101,36,134,91,102","w":200},"R":{"d":"20,0r0,-257r77,0v80,-8,89,117,20,130v61,-3,32,88,55,127r-27,0v-8,-14,-7,-38,-7,-58v0,-65,-38,-60,-95,-59r0,117r-23,0xm43,-238r0,101v51,3,97,-1,97,-50v0,-48,-45,-55,-97,-51","w":180,"k":{"Y":6,"U":-2,"T":6}},"S":{"d":"156,-191r-23,0v0,-32,-15,-51,-46,-51v-31,0,-49,20,-49,46v0,77,125,35,125,125v0,50,-31,75,-78,75v-51,0,-77,-29,-75,-84r23,0v-2,39,13,65,51,65v32,0,56,-16,56,-52v0,-76,-125,-33,-125,-126v0,-40,26,-68,71,-68v48,0,70,24,70,70","w":172},"T":{"d":"68,0r0,-238r-66,0r0,-19r156,0r0,19r-67,0r0,238r-23,0","w":159,"k":{"y":20,"w":27,"u":27,"r":27,"o":27,"i":6,"e":27,"a":27,"A":20,";":27,":":27,".":33,"-":20,",":33}},"U":{"d":"17,-72r0,-185r23,0r0,185v0,39,16,57,50,57v34,0,50,-18,50,-57r0,-185r23,0r0,185v0,54,-26,76,-73,76v-47,0,-73,-22,-73,-76","w":180},"V":{"d":"69,0r-68,-257r25,0r58,233r57,-233r24,0r-67,257r-29,0","w":166,"k":{"u":6,"o":6,"e":6,"a":6,"A":13,";":6,":":6,".":33,"-":6,",":33}},"W":{"d":"58,0r-54,-257r23,0r46,226r44,-226r26,0r45,226r45,-226r23,0r-54,257r-29,0r-43,-226r-43,226r-29,0","w":259,"k":{"o":6,"e":6,"a":6,"A":6,".":27,"-":6,",":27}},"X":{"d":"142,0r-60,-111r-59,111r-23,0r70,-131r-66,-126r25,0r55,104r55,-104r23,0r-66,126r71,131r-25,0","w":166},"Y":{"d":"68,0r0,-103r-69,-154r24,0r57,128r56,-128r25,0r-70,154r0,103r-23,0","w":159,"k":{"u":13,"o":20,"i":6,"e":20,"a":20,"A":20,";":13,":":13,".":40,"-":27,",":40}},"Z":{"d":"8,0r0,-22r125,-216r-118,0r0,-19r142,0r0,22r-124,216r125,0r0,19r-150,0","w":166},"[":{"d":"30,66r0,-323r57,0r0,18r-36,0r0,287r36,0r0,18r-57,0","w":86},"\\":{"d":"-4,-261r20,0r88,265r-20,0","w":100},"]":{"d":"0,66r0,-18r35,0r0,-287r-35,0r0,-18r57,0r0,323r-57,0","w":86},"^":{"d":"181,-87r-73,-142r-73,142r-19,0r83,-164r18,0r83,164r-19,0","w":216},"_":{"d":"0,45r0,-18r180,0r0,18r-180,0","w":180},"\u2018":{"d":"30,-171v1,-39,-6,-73,27,-86v2,23,-16,22,-13,50r10,0r0,36r-24,0","w":86,"k":{"\u2018":39}},"a":{"d":"39,-134r-22,0v0,-39,19,-61,59,-61v84,0,54,94,54,163v0,14,5,17,17,16r0,16v-21,6,-41,0,-38,-28v-9,25,-29,32,-50,32v-61,0,-65,-96,-10,-107v24,-12,59,0,59,-41v0,-24,-14,-33,-33,-33v-26,0,-36,15,-36,43xm64,-14v40,0,48,-47,44,-94v-18,22,-74,12,-74,57v0,22,11,37,30,37","w":153,"k":{"y":-1,"w":-1,"v":-1,"t":-1,"p":-1,"g":-1,"b":-1}},"b":{"d":"19,0r0,-257r21,0r1,95v5,-20,21,-33,45,-33v42,0,61,33,61,99v0,66,-19,100,-61,100v-24,1,-40,-16,-48,-36r0,32r-19,0xm40,-96v0,71,20,82,42,82v22,0,42,-11,42,-82v0,-71,-20,-81,-42,-81v-22,0,-42,10,-42,81","w":159,"k":{"y":-1,"v":-1,"b":-1}},"c":{"d":"114,-63r22,0v-3,41,-26,67,-61,67v-40,0,-64,-28,-64,-100v0,-66,24,-99,66,-99v36,0,57,22,59,61r-22,0v-3,-30,-14,-43,-37,-43v-23,0,-43,14,-43,82v0,72,21,81,41,81v22,0,35,-16,39,-49","w":146},"d":{"d":"122,0v-1,-10,2,-24,-1,-32v-6,22,-24,36,-47,36v-42,0,-61,-34,-61,-100v0,-66,19,-99,61,-99v25,-1,39,15,46,33r0,-95r21,0r0,257r-19,0xm36,-96v0,71,20,82,42,82v22,0,42,-11,42,-82v0,-71,-20,-81,-42,-81v-22,0,-42,10,-42,81","w":159},"e":{"d":"117,-63r22,0v-3,41,-26,67,-62,67v-40,0,-64,-28,-64,-100v0,-66,24,-99,66,-99v44,0,63,35,61,100r-104,0v-2,53,18,81,41,81v23,0,36,-16,40,-49xm36,-113r81,0v-1,-48,-13,-64,-40,-64v-27,0,-40,16,-41,64","w":153,"k":{"y":-1}},"f":{"d":"29,0r0,-173r-26,0r0,-18r26,0v-4,-43,3,-76,55,-68r0,18v-30,-9,-37,17,-34,50r34,0r0,18r-34,0r0,173r-21,0","w":86,"k":{"\u201d":-6,"o":-1,"l":-1,"f":-1,"\u2019":-6}},"g":{"d":"119,-162v3,-7,0,-20,1,-29r19,0r0,177v0,53,-20,80,-63,80v-37,0,-57,-20,-57,-47r22,0v0,18,17,29,36,29v37,0,43,-40,40,-82v-7,23,-25,34,-45,34v-30,0,-59,-20,-59,-96v0,-66,19,-99,61,-99v21,0,38,11,45,33xm36,-98v0,61,15,80,41,80v26,0,40,-19,40,-80v0,-61,-14,-79,-40,-79v-26,0,-41,18,-41,79","w":159,"k":{"y":-1,"r":-1,"i":-1,"g":-1}},"h":{"d":"21,0r0,-257r21,0r1,92v5,-19,24,-30,47,-30v29,0,49,15,49,51r0,144r-22,0r0,-138v0,-26,-10,-39,-32,-39v-67,2,-36,113,-43,177r-21,0","w":159},"i":{"d":"22,0r0,-191r22,0r0,191r-22,0xm22,-220r0,-37r22,0r0,37r-22,0"},"j":{"d":"22,15r0,-206r22,0r0,213v-1,38,-23,47,-53,43r0,-18v20,3,31,-1,31,-32xm22,-220r0,-37r22,0r0,37r-22,0"},"k":{"d":"19,0r0,-257r21,0r1,161r74,-95r27,0r-58,71r68,120r-26,0r-57,-101r-29,34r0,67r-21,0","w":146},"l":{"d":"22,0r0,-257r22,0r0,257r-22,0","k":{"y":-1,"w":-1}},"m":{"d":"22,0r0,-191r20,0r0,26v16,-42,83,-38,90,3v9,-21,24,-33,48,-33v27,0,45,15,45,49r0,146r-22,0r0,-143v0,-23,-11,-34,-30,-34v-62,0,-33,115,-39,177r-21,0r0,-143v0,-23,-11,-34,-30,-34v-62,0,-33,115,-39,177r-22,0","w":246,"k":{"y":-1}},"n":{"d":"21,0r0,-191r19,0v1,8,-2,20,1,26v22,-45,98,-42,98,21r0,144r-22,0r0,-138v0,-26,-10,-39,-32,-39v-67,2,-36,113,-43,177r-21,0","w":159,"k":{"y":-1}},"o":{"d":"11,-96v0,-66,24,-99,66,-99v42,0,66,33,66,99v0,67,-24,100,-66,100v-42,0,-66,-33,-66,-100xm34,-96v0,61,19,82,43,82v24,0,43,-21,43,-82v0,-61,-19,-81,-43,-81v-24,0,-43,20,-43,81","w":153},"p":{"d":"19,63r0,-254r19,0v1,8,-2,21,1,27v7,-18,23,-31,47,-31v42,0,61,34,61,100v0,66,-19,99,-61,99v-25,1,-39,-15,-46,-33r0,92r-21,0xm83,-177v-37,0,-43,33,-43,82v0,71,20,81,42,81v22,0,42,-10,42,-81v0,-69,-20,-82,-41,-82","w":159,"k":{"y":-1}},"q":{"d":"120,63r-1,-92v-5,20,-21,33,-45,33v-42,0,-61,-33,-61,-99v0,-66,19,-100,61,-100v25,-1,39,15,48,31r0,-27r19,0r0,254r-21,0xm120,-95v-1,-50,-6,-82,-43,-82v-21,0,-41,13,-41,82v0,71,20,81,42,81v22,0,42,-10,42,-81","w":159},"r":{"d":"21,0r0,-191r21,0v1,9,-2,23,1,30v9,-23,29,-37,56,-33r0,21v-32,-5,-57,12,-57,53r0,120r-21,0","w":100,"k":{"y":-6,"v":-6,".":27,"-":13,",":27}},"s":{"d":"107,-48v0,-49,-93,-39,-93,-92v0,-39,25,-55,57,-55v38,0,54,20,53,58r-22,0v1,-27,-9,-41,-31,-40v-43,0,-49,52,-9,64v29,10,67,26,67,60v0,33,-19,57,-59,57v-41,1,-61,-19,-59,-65r22,0v-1,30,10,48,36,47v23,0,38,-13,38,-34","w":140},"t":{"d":"29,-31r0,-142r-26,0r0,-18r26,0r0,-53r21,0r0,53r34,0r0,18r-34,0r0,137v-1,20,17,22,34,18r0,18v-27,5,-55,1,-55,-31","w":86},"u":{"d":"21,-47r0,-144r21,0r0,134v0,31,11,43,34,43v64,0,35,-114,41,-177r22,0r0,191r-19,0v-1,-8,2,-21,-1,-27v-22,46,-98,43,-98,-20","w":159},"v":{"d":"56,0r-53,-191r23,0r43,167r39,-167r23,0r-51,191r-24,0","w":133,"k":{".":20,",":20}},"w":{"d":"46,0r-42,-191r23,0r33,169r34,-169r27,0r33,169r32,-169r24,0r-43,191r-26,0r-35,-170r-34,170r-26,0","w":213,"k":{".":13,",":13}},"x":{"d":"107,0r-40,-82r-40,82r-25,0r52,-99r-50,-92r25,0r38,75r37,-75r25,0r-49,92r51,99r-24,0","w":133},"y":{"d":"58,2r-55,-193r23,0r43,165r39,-165r23,0r-56,206v-12,43,-25,50,-65,48r0,-18v32,7,41,-17,48,-43","w":133,"k":{".":20,",":20}},"z":{"d":"6,0r0,-18r91,-155r-86,0r0,-18r109,0r0,18r-90,155r90,0r0,18r-114,0","w":126},"{":{"d":"12,-104v56,-5,-30,-173,78,-153r0,18v-22,0,-36,-4,-36,24v-1,43,7,116,-24,120v32,2,24,78,24,119v0,28,14,24,36,24r0,18v-37,4,-57,-9,-57,-43v0,-34,10,-114,-21,-109r0,-18","w":86},"|":{"d":"31,4r0,-265r18,0r0,265r-18,0","w":79},"}":{"d":"75,-86v-56,5,29,172,-78,152r0,-18v22,0,36,4,35,-24v0,-43,-7,-116,25,-120v-33,-2,-25,-78,-25,-119v0,-28,-13,-24,-35,-24r0,-18v36,-3,57,10,57,43v0,35,-10,114,21,110r0,18","w":86},"~":{"d":"70,-112v14,-4,70,26,77,24v12,0,20,-8,31,-26r13,13v-15,21,-26,31,-45,31v-16,4,-61,-30,-78,-24v-16,0,-24,13,-30,26r-13,-13v8,-15,21,-31,45,-31","w":216},"\u00a1":{"d":"31,62r4,-190r16,0r4,190r-24,0xm31,-158r0,-37r24,0r0,37r-24,0","w":86},"\u00a2":{"d":"84,-14r0,-163v-21,3,-37,20,-37,82v0,67,18,80,37,81xm84,34r0,-30v-38,-2,-60,-31,-60,-100v0,-63,22,-96,60,-99r0,-30r10,0r0,30v34,2,53,24,55,61r-22,0v-2,-27,-12,-41,-33,-43r0,163v18,-4,30,-19,33,-49r22,0v-3,38,-23,63,-55,67r0,30r-10,0","w":172},"\u00a3":{"d":"33,-19v25,-17,54,4,80,4v15,0,28,-8,43,-18r10,16v-26,30,-76,18,-113,8v-15,0,-29,8,-35,11r-11,-17v35,-26,57,-59,38,-102r-36,0r0,-16r30,0v-8,-16,-23,-36,-22,-58v0,-41,34,-64,73,-64v44,0,70,30,70,74r-22,0v7,-69,-97,-74,-98,-12v0,18,14,45,23,60r54,0r0,16r-48,0v17,41,-3,69,-36,98","w":172},"\u2044":{"d":"-60,11r162,-272r18,0r-162,272r-18,0","w":60},"\u2215":{"d":"-60,11r162,-272r18,0r-162,272r-18,0","w":60},"\u00a5":{"d":"75,0r0,-63r-51,0r0,-15r51,0v0,-12,1,-25,-4,-32r-47,0r0,-16r40,0r-59,-125r25,0r56,124r57,-124r24,0r-58,125r39,0r0,16r-46,0v-5,7,-4,20,-4,32r50,0r0,15r-50,0r0,63r-23,0","w":172},"\u0192":{"d":"40,-143r3,-16r38,0r9,-47v14,-52,38,-53,75,-50r-4,18v-32,-3,-41,-2,-53,52r-5,27r40,0r-3,16r-40,0r-27,138v-11,59,-29,74,-78,66r4,-18v34,5,42,2,54,-56r25,-130r-38,0","w":172},"\u00a7":{"d":"146,-208r-22,0v0,-22,-15,-35,-37,-35v-44,0,-51,48,-9,66v28,21,83,43,83,84v0,22,-15,41,-34,50v38,30,22,100,-38,97v-40,-2,-65,-25,-63,-62r22,0v0,26,12,44,40,44v47,0,49,-56,7,-74v-28,-21,-82,-43,-82,-83v0,-21,18,-42,37,-50v-44,-27,-18,-90,38,-90v37,0,58,22,58,53xm139,-94v0,-34,-53,-48,-76,-67v-41,24,-37,53,1,77r48,31v18,-9,27,-22,27,-41","w":173},"\u00a4":{"d":"21,-46r-13,-13r17,-17v-24,-28,-23,-71,0,-99r-17,-17r13,-12r16,16v26,-21,73,-21,99,1r17,-17r12,12r-17,17v23,25,23,74,1,99r16,17r-12,13r-17,-18v-27,23,-73,23,-99,1xm27,-125v0,35,28,61,59,61v31,0,60,-26,60,-61v0,-35,-29,-61,-60,-61v-31,0,-59,26,-59,61","w":172},"'":{"d":"32,-171r0,-86r22,0r0,86r-22,0","w":86},"\u201c":{"d":"74,-171v1,-38,-7,-73,26,-86v2,23,-15,22,-12,50r10,0r0,36r-24,0xm26,-171v1,-39,-6,-73,27,-86v2,23,-16,22,-13,50r11,0r0,36r-25,0","w":126},"\u00ab":{"d":"68,-91r0,-22r45,-50r0,24r-32,37r32,36r0,25xm21,-91r0,-22r45,-50r0,24r-33,37r33,36r0,25","w":133},"\u2039":{"d":"21,-91r0,-22r45,-50r0,24r-32,37r32,36r0,25","w":86},"\u203a":{"d":"21,-41r0,-25r32,-36r-32,-37r0,-24r45,50r0,22","w":86},"\ufb01":{"d":"109,0r0,-191r22,0r0,191r-22,0xm109,-220r0,-37r22,0r0,37r-22,0xm29,0r0,-173r-26,0r0,-18r26,0v-4,-43,3,-76,55,-68r0,18v-30,-9,-37,17,-34,50r34,0r0,18r-34,0r0,173r-21,0","w":153},"\ufb02":{"d":"109,0r0,-257r22,0r0,257r-22,0xm29,0r0,-173r-26,0r0,-18r26,0v-4,-43,3,-76,55,-68r0,18v-30,-9,-37,17,-34,50r34,0r0,18r-34,0r0,173r-21,0","w":153},"\u2013":{"d":"0,-112r180,0r0,19r-180,0r0,-19","w":180},"\u2020":{"d":"76,-176r0,-81r21,0r0,81r64,0r0,18r-64,0r0,210r-21,0r0,-210r-64,0r0,-18r64,0","w":172},"\u2021":{"d":"76,-257r21,0r0,74r64,0r0,18r-64,0r0,125r64,0r0,18r-64,0r0,74r-21,0r0,-74r-64,0r0,-18r64,0r0,-125r-64,0r0,-18r64,0r0,-74","w":172},"\u00b7":{"d":"23,-118v0,-11,9,-20,20,-20v11,0,20,9,20,20v0,11,-9,20,-20,20v-11,0,-20,-9,-20,-20","w":86},"\u2219":{"d":"23,-118v0,-11,9,-20,20,-20v11,0,20,9,20,20v0,11,-9,20,-20,20v-11,0,-20,-9,-20,-20","w":86},"\u00b6":{"d":"70,50r0,-170v-32,0,-59,-30,-59,-66v-1,-73,61,-75,133,-71r0,307r-18,0r0,-291r-38,0r0,291r-18,0","w":173},"\u2022":{"d":"26,-129v0,-35,29,-64,64,-64v35,0,64,29,64,64v0,35,-29,65,-64,65v-35,0,-64,-30,-64,-65","w":180},"\u201a":{"d":"32,0r0,-37r25,0v-1,39,6,74,-27,87v-2,-24,15,-22,12,-50r-10,0","w":86},"\u201e":{"d":"28,0r0,-37r25,0v-1,39,6,74,-27,87v-2,-24,16,-22,13,-50r-11,0xm76,0r0,-37r24,0v-1,39,7,74,-26,87v-2,-24,15,-22,12,-50r-10,0","w":126},"\u201d":{"d":"28,-220r0,-37r25,0v-1,39,6,73,-27,86v-2,-23,16,-21,13,-49r-11,0xm76,-220r0,-37r24,0v-1,38,7,73,-26,86v-2,-23,15,-21,12,-49r-10,0","w":126,"k":{" ":13}},"\u00bb":{"d":"21,-41r0,-25r32,-36r-32,-37r0,-24r45,50r0,22xm68,-41r0,-25r32,-36r-32,-37r0,-24r45,50r0,22","w":133},"\u2026":{"d":"48,0r0,-37r24,0r0,37r-24,0xm168,0r0,-37r24,0r0,37r-24,0xm288,0r0,-37r24,0r0,37r-24,0","w":360},"\u2030":{"d":"39,-189v0,39,10,51,25,51v15,0,26,-12,26,-51v0,-38,-11,-50,-26,-50v-15,0,-25,12,-25,50xm62,4r111,-259r18,0r-111,259r-18,0xm161,-62v0,39,11,50,26,50v15,0,26,-11,26,-50v0,-38,-11,-50,-26,-50v-15,0,-26,12,-26,50xm19,-189v0,-52,16,-66,45,-66v29,0,46,14,46,66v0,52,-17,67,-46,67v-29,0,-45,-15,-45,-67xm142,-62v0,-52,16,-66,45,-66v29,0,46,14,46,66v0,52,-17,66,-46,66v-29,0,-45,-14,-45,-66xm270,-62v0,39,11,50,26,50v15,0,25,-11,25,-50v0,-38,-10,-50,-25,-50v-15,0,-26,12,-26,50xm250,-62v0,-52,17,-66,46,-66v29,0,45,14,45,66v0,52,-16,66,-45,66v-29,0,-46,-14,-46,-66","w":360},"\u00bf":{"d":"71,-129r22,0v12,64,-57,79,-58,133v0,26,17,44,41,44v31,0,46,-21,46,-60r23,0v0,45,-22,78,-68,78v-66,1,-85,-75,-41,-119v19,-19,40,-38,35,-76xm70,-158r0,-37r24,0r0,37r-24,0","w":153},"`":{"d":"-4,-266r26,0r27,51r-17,0"},"\u00b4":{"d":"45,-266r26,0r-36,51r-17,0"},"\u02c6":{"d":"10,-215r-22,0r35,-51r21,0r35,51r-22,0r-24,-36"},"\u02dc":{"d":"66,-258r16,0v1,32,-35,43,-59,22v-11,-10,-20,2,-22,14r-16,0v1,-30,34,-46,57,-23v11,11,24,-1,24,-13"},"\u00af":{"d":"-9,-233r0,-15r85,0r0,15r-85,0"},"\u02c9":{"d":"-9,-233r0,-15r85,0r0,15r-85,0"},"\u02d8":{"d":"6,-261v0,35,53,38,55,0r16,0v-2,27,-20,44,-44,44v-24,0,-41,-17,-43,-44r16,0"},"\u02d9":{"d":"23,-222r0,-37r21,0r0,37r-21,0"},"\u00a8":{"d":"-4,-222r0,-37r21,0r0,37r-21,0xm50,-222r0,-37r21,0r0,37r-21,0"},"\u02da":{"d":"-1,-245v0,-19,15,-34,34,-34v19,0,35,15,35,34v0,19,-16,34,-35,34v-19,0,-34,-15,-34,-34xm12,-245v0,12,9,21,21,21v12,0,22,-9,22,-21v0,-12,-10,-21,-22,-21v-12,0,-21,9,-21,21"},"\u00b8":{"d":"12,29v11,-10,10,-32,34,-29v-4,7,-14,14,-15,21v18,-7,41,5,40,22v-1,32,-46,36,-70,23r4,-11v13,8,49,6,46,-10v1,-14,-24,-16,-34,-10"},"\u02dd":{"d":"18,-266r25,0r-35,51r-17,0xm72,-266r26,0r-36,51r-17,0"},"\u02db":{"d":"5,48v2,-19,16,-52,54,-50v-26,18,-35,32,-35,46v-1,20,28,19,41,10r5,10v-17,15,-68,11,-65,-16"},"\u02c7":{"d":"-12,-266r21,0r24,37r25,-37r21,0r-35,51r-22,0"},"\u2014":{"d":"0,-112r360,0r0,19r-360,0r0,-19","w":360},"\u00c6":{"d":"120,0r0,-75r-69,0r-29,75r-25,0r105,-257r142,0r0,19r-101,0r0,94r94,0r0,19r-94,0r0,106r104,0r0,19r-127,0xm58,-94r62,0r0,-144r-4,0","w":253},"\u00aa":{"d":"23,-217r-18,0v0,-25,13,-38,43,-38v58,-2,34,52,39,97v0,8,3,11,11,10r0,14v-13,5,-32,3,-29,-18v-11,34,-73,21,-67,-14v-3,-29,30,-35,55,-41v10,-3,12,-5,12,-16v0,-11,-9,-16,-22,-16v-17,0,-24,9,-24,22xm40,-148v23,2,34,-25,28,-50v-11,12,-47,7,-47,30v0,11,8,20,19,20","w":99},"\u0141":{"d":"20,0r0,-103r-25,17r0,-21r25,-18r0,-132r23,0r0,117r67,-46r0,21r-67,46r0,100r107,0r0,19r-130,0","w":153},"\u00d8":{"d":"56,-43r79,-185v-54,-35,-96,-4,-94,99v0,39,5,68,15,86xm144,-214r-78,185v9,10,20,14,34,14v37,0,59,-31,59,-114v0,-40,-6,-67,-15,-85xm48,15r-13,-6r11,-28v-19,-21,-28,-57,-28,-110v0,-114,51,-154,125,-120r9,-23r14,5r-12,28v19,21,28,57,28,110v0,113,-50,156,-124,121","w":200},"\u0152":{"d":"97,-15v66,0,51,-98,51,-162v0,-50,-16,-65,-51,-65v-37,0,-59,30,-59,113v0,83,22,114,59,114xm147,-236v3,-4,0,-15,1,-21r122,0r0,19r-99,0r0,94r92,0r0,19r-92,0r0,106r102,0r0,19r-125,0v-1,-7,2,-18,-1,-23v-8,18,-27,27,-50,27v-53,0,-82,-41,-82,-133v0,-92,29,-132,82,-132v27,0,41,9,50,25","w":280},"\u00ba":{"d":"3,-194v0,-41,16,-61,47,-61v32,0,46,20,46,61v0,41,-14,62,-46,62v-31,0,-47,-21,-47,-62xm23,-194v0,33,12,46,27,46v15,0,27,-13,27,-46v0,-33,-12,-45,-27,-45v-15,0,-27,12,-27,45","w":99},"\u00e6":{"d":"39,-134r-22,0v-11,-64,85,-84,102,-31v8,-19,25,-30,45,-30v43,0,58,32,58,100r-98,0v-2,48,13,81,37,81v21,0,38,-20,38,-49r22,0v2,74,-90,91,-108,28v-10,25,-27,39,-54,39v-33,0,-48,-21,-48,-54v0,-43,36,-53,73,-61v29,-6,23,-74,-11,-66v-23,0,-34,15,-34,43xm102,-103v-21,15,-68,12,-68,52v0,22,11,37,30,37v17,0,38,-13,38,-49r0,-40xm124,-113r75,0v0,-48,-15,-64,-37,-64v-22,0,-37,16,-38,64","w":233},"\u0131":{"d":"22,0r0,-191r22,0r0,191r-22,0"},"\u0142":{"d":"22,0r0,-114r-22,24r0,-22r22,-23r0,-122r22,0r0,99r22,-24v4,26,-12,33,-22,45r0,137r-22,0"},"\u00f8":{"d":"44,-36r55,-133v-38,-22,-64,0,-65,73v0,27,4,47,10,60xm109,-155r-55,132v38,24,65,1,66,-73v0,-27,-5,-46,-11,-59xm36,20r-13,-6r11,-27v-15,-16,-23,-44,-23,-83v-1,-80,39,-115,96,-92r10,-23r14,6r-12,27v15,16,24,43,24,82v2,81,-40,117,-97,92","w":153},"\u0153":{"d":"216,-63r22,0v0,71,-84,96,-108,28v-9,23,-25,39,-50,39v-42,0,-66,-33,-66,-100v0,-66,24,-99,66,-99v26,0,43,14,52,39v6,-25,23,-39,49,-39v43,0,59,32,59,100r-99,0v-3,48,14,81,38,81v21,0,37,-20,37,-49xm37,-96v0,61,18,82,41,82v23,0,42,-21,42,-82v0,-61,-19,-81,-42,-81v-23,0,-41,20,-41,81xm141,-113r76,0v0,-48,-16,-64,-38,-64v-22,0,-37,16,-38,64","w":253},"\u00df":{"d":"19,0r0,-194v0,-44,23,-66,60,-66v65,0,82,96,20,112v41,5,50,43,50,70v0,55,-33,88,-84,78r0,-18v35,8,60,-12,61,-61v0,-41,-19,-60,-59,-58r0,-18v30,1,47,-12,47,-44v0,-24,-12,-43,-36,-43v-22,0,-38,13,-38,50r0,192r-21,0","w":159},"\u00b9":{"d":"52,-101r0,-115r-39,0r0,-13v29,0,41,-11,42,-26r16,0r0,154r-19,0","w":112},"\u00ac":{"d":"181,-39r0,-78r-164,0r0,-18r182,0r0,96r-18,0","w":216},"\u00b5":{"d":"21,63r0,-254r21,0r0,134v0,31,11,43,34,43v64,0,35,-114,41,-177r22,0r0,191r-19,0v-1,-8,2,-21,-1,-27v-14,30,-51,39,-77,23r0,67r-21,0","w":159},"\u03bc":{"d":"21,63r0,-254r21,0r0,134v0,31,11,43,34,43v64,0,35,-114,41,-177r22,0r0,191r-19,0v-1,-8,2,-21,-1,-27v-14,30,-51,39,-77,23r0,67r-21,0","w":159},"\u2122":{"d":"64,-109r0,-132r-49,0r0,-16r115,0r0,16r-48,0r0,132r-18,0xm235,-137r47,-120r30,0r0,148r-18,0r0,-132r-54,132r-11,0r-54,-132r0,132r-18,0r0,-148r31,0","w":356},"\u00d0":{"d":"20,0r0,-125r-20,0r0,-19r20,0r0,-113r62,0v75,0,93,44,93,128v0,84,-18,129,-93,129r-62,0xm43,-144r58,0r0,19r-58,0r0,106v80,4,109,-6,109,-109v0,-103,-28,-115,-109,-110r0,94","w":193},"\u00bd":{"d":"22,11r162,-272r18,0r-162,272r-18,0xm52,-101r0,-115r-39,0r0,-13v29,0,41,-11,42,-26r16,0r0,154r-19,0xm161,-105r-20,0v0,-30,16,-49,50,-49v48,0,62,61,19,88v-18,11,-46,32,-48,50r75,0r0,16r-94,0v-7,-52,71,-65,73,-112v0,-18,-12,-26,-27,-26v-17,0,-27,12,-28,33","w":259},"\u00b1":{"d":"99,-120r0,-62r18,0r0,62r82,0r0,18r-82,0r0,62r-18,0r0,-62r-82,0r0,-18r82,0xm17,0r0,-18r182,0r0,18r-182,0","w":216},"\u00de":{"d":"43,-187r0,106v51,1,94,3,94,-53v0,-56,-43,-55,-94,-53xm20,0r0,-257r23,0r0,50r48,0v48,0,69,30,69,73v0,40,-19,73,-78,73r-39,0r0,61r-23,0","w":172},"\u00bc":{"d":"204,0r0,-40r-67,0r0,-13r64,-101r21,0r0,101r20,0r0,13r-20,0r0,40r-18,0xm153,-53r51,0v-1,-25,2,-54,-1,-77xm32,11r163,-272r18,0r-163,272r-18,0xm52,-101r0,-115r-39,0r0,-13v29,0,41,-11,42,-26r16,0r0,154r-19,0","w":259},"\u00f7":{"d":"17,-82r0,-18r182,0r0,18r-182,0xm88,-165v0,-11,9,-20,20,-20v11,0,20,9,20,20v0,11,-9,20,-20,20v-11,0,-20,-9,-20,-20xm88,-17v0,-11,9,-20,20,-20v11,0,20,9,20,20v0,11,-9,20,-20,20v-11,0,-20,-9,-20,-20","w":216},"\u00a6":{"d":"31,4r0,-97r18,0r0,97r-18,0xm31,-164r0,-97r18,0r0,97r-18,0","w":79},"\u00b0":{"d":"36,-203v0,20,16,35,36,35v20,0,36,-15,36,-35v0,-20,-16,-36,-36,-36v-20,0,-36,16,-36,36xm21,-203v0,-28,23,-52,51,-52v28,0,51,24,51,52v0,28,-23,51,-51,51v-28,0,-51,-23,-51,-51","w":144},"\u00fe":{"d":"19,63r0,-320r21,0r1,98v6,-22,24,-36,45,-36v42,0,61,34,61,100v0,66,-19,99,-61,99v-25,1,-39,-15,-46,-33r0,92r-21,0xm40,-95v0,71,20,81,42,81v22,0,42,-10,42,-81v0,-71,-20,-82,-42,-82v-22,0,-42,11,-42,82","w":159},"\u00be":{"d":"204,0r0,-40r-67,0r0,-13r64,-101r21,0r0,101r20,0r0,13r-20,0r0,40r-18,0xm153,-53r51,0v-1,-25,2,-54,-1,-77xm43,11r163,-272r18,0r-163,272r-18,0xm43,-173v1,-6,-4,-17,6,-16v39,4,42,-49,6,-50v-14,0,-27,10,-27,27r-19,0v0,-26,14,-43,46,-43v50,0,61,63,18,73v50,11,39,84,-18,84v-30,0,-47,-15,-48,-44r20,0v0,13,10,28,28,28v14,0,31,-10,31,-31v0,-21,-18,-30,-43,-28","w":259},"\u00b2":{"d":"28,-206r-19,0v0,-30,15,-49,49,-49v48,0,63,63,19,89v-18,11,-46,31,-48,49r75,0r0,16r-94,0v-7,-52,71,-66,74,-112v0,-18,-12,-26,-27,-26v-17,0,-28,12,-29,33","w":112},"\u00ae":{"d":"192,-50r-47,-70r-33,0r0,70r-18,0r0,-158v50,-1,112,-7,112,44v0,28,-18,40,-39,44r46,70r-21,0xm112,-192r0,56v34,-1,76,8,76,-28v-1,-36,-42,-27,-76,-28xm11,-129v0,-73,60,-132,133,-132v73,0,133,59,133,132v0,73,-60,133,-133,133v-73,0,-133,-60,-133,-133xm29,-129v0,63,52,115,115,115v63,0,115,-52,115,-115v0,-63,-52,-114,-115,-114v-63,0,-115,51,-115,114","w":288},"\u2212":{"d":"17,-82r0,-18r182,0r0,18r-182,0","w":216},"\u00f0":{"d":"34,-94v0,59,19,80,43,80v24,0,43,-21,43,-80v0,-59,-19,-79,-43,-79v-24,0,-43,20,-43,79xm42,-215r-13,-12r26,-16v-8,-9,-17,-16,-26,-24r17,-12v10,8,18,17,27,26r26,-15r13,11r-27,16v33,36,58,80,58,145v0,67,-24,100,-66,100v-42,0,-66,-34,-66,-98v0,-64,26,-97,62,-97v14,0,26,9,36,18v-12,-21,-27,-40,-42,-57","w":153},"\u00d7":{"d":"176,-10r-68,-68r-68,68r-13,-13r68,-68r-68,-69r13,-12r68,68r68,-68r13,12r-68,69r68,68","w":216},"\u00b3":{"d":"43,-173v1,-6,-4,-17,6,-16v39,4,42,-49,6,-50v-14,0,-27,10,-27,27r-19,0v0,-26,14,-43,46,-43v50,0,61,63,18,73v50,11,39,84,-18,84v-30,0,-47,-15,-48,-44r20,0v0,13,10,28,28,28v14,0,31,-10,31,-31v0,-21,-18,-30,-43,-28","w":112},"\u00a9":{"d":"196,-101r20,0v-8,33,-34,57,-68,57v-49,0,-80,-37,-80,-85v0,-49,29,-83,79,-83v35,0,64,20,69,55r-20,0v-19,-65,-109,-37,-109,28v0,34,22,67,61,67v26,0,44,-17,48,-39xm11,-129v0,-73,60,-132,133,-132v73,0,133,59,133,132v0,73,-60,133,-133,133v-73,0,-133,-60,-133,-133xm29,-129v0,63,52,115,115,115v63,0,115,-52,115,-115v0,-63,-52,-114,-115,-114v-63,0,-115,51,-115,114","w":288},"\u00c1":{"d":"50,-94r80,0r-40,-145xm0,0r76,-257r28,0r76,257r-24,0r-21,-75r-90,0r-21,75r-24,0xm102,-320r25,0r-35,51r-17,0","w":180},"\u00c2":{"d":"50,-94r80,0r-40,-145xm0,0r76,-257r28,0r76,257r-24,0r-21,-75r-90,0r-21,75r-24,0xm66,-269r-21,0r34,-51r22,0r34,51r-21,0r-24,-36","w":180},"\u00c4":{"d":"50,-94r80,0r-40,-145xm0,0r76,-257r28,0r76,257r-24,0r-21,-75r-90,0r-21,75r-24,0xm52,-277r0,-37r22,0r0,37r-22,0xm106,-277r0,-37r22,0r0,37r-22,0","w":180},"\u00c0":{"d":"50,-94r80,0r-40,-145xm0,0r76,-257r28,0r76,257r-24,0r-21,-75r-90,0r-21,75r-24,0xm53,-320r25,0r27,51r-17,0","w":180},"\u00c5":{"d":"50,-94r80,0r-40,-145xm0,0r76,-257r28,0r76,257r-24,0r-21,-75r-90,0r-21,75r-24,0xm56,-300v0,-19,15,-34,34,-34v19,0,34,15,34,34v0,19,-15,35,-34,35v-19,0,-34,-16,-34,-35xm69,-300v0,12,9,22,21,22v12,0,21,-10,21,-22v0,-12,-9,-21,-21,-21v-12,0,-21,9,-21,21","w":180},"\u00c3":{"d":"50,-94r80,0r-40,-145xm0,0r76,-257r28,0r76,257r-24,0r-21,-75r-90,0r-21,75r-24,0xm122,-313r16,0v2,33,-36,45,-59,22v-13,-7,-19,4,-21,15r-16,0v0,-31,34,-46,57,-24v11,10,24,-1,23,-13","w":180},"\u00c7":{"d":"83,35v-11,-10,9,-21,13,-31v-50,-3,-78,-43,-78,-133v0,-92,29,-132,82,-132v52,0,74,37,74,79r-23,0v0,-35,-18,-60,-51,-60v-37,0,-59,30,-59,113v0,83,22,114,59,114v32,0,50,-28,53,-72r23,0v-3,54,-27,87,-67,91v-3,6,-12,12,-11,17v18,-7,41,5,40,22v-2,32,-47,36,-71,23r5,-11v13,9,49,6,46,-10v1,-14,-25,-16,-35,-10","w":186},"\u00c9":{"d":"20,0r0,-257r128,0r0,19r-105,0r0,94r98,0r0,19r-98,0r0,106r108,0r0,19r-131,0xm98,-320r25,0r-35,51r-17,0","w":159},"\u00ca":{"d":"20,0r0,-257r128,0r0,19r-105,0r0,94r98,0r0,19r-98,0r0,106r108,0r0,19r-131,0xm63,-269r-22,0r35,-51r21,0r35,51r-22,0r-24,-36","w":159},"\u00cb":{"d":"20,0r0,-257r128,0r0,19r-105,0r0,94r98,0r0,19r-98,0r0,106r108,0r0,19r-131,0xm49,-277r0,-37r21,0r0,37r-21,0xm103,-277r0,-37r21,0r0,37r-21,0","w":159},"\u00c8":{"d":"20,0r0,-257r128,0r0,19r-105,0r0,94r98,0r0,19r-98,0r0,106r108,0r0,19r-131,0xm49,-320r26,0r27,51r-17,0","w":159},"\u00cd":{"d":"22,0r0,-257r23,0r0,257r-23,0xm45,-320r25,0r-35,51r-17,0"},"\u00ce":{"d":"22,0r0,-257r23,0r0,257r-23,0xm9,-269r-21,0r34,-51r22,0r34,51r-21,0r-24,-36"},"\u00cf":{"d":"22,0r0,-257r23,0r0,257r-23,0xm-5,-277r0,-37r22,0r0,37r-22,0xm49,-277r0,-37r22,0r0,37r-22,0"},"\u00cc":{"d":"22,0r0,-257r23,0r0,257r-23,0xm-4,-320r26,0r27,51r-18,0"},"\u00d1":{"d":"20,0r0,-257r31,0r99,224r0,-224r23,0r0,257r-31,0r-99,-224r0,224r-23,0xm129,-313r16,0v2,32,-37,45,-59,22v-13,-7,-20,3,-22,15r-15,0v1,-31,33,-45,57,-24v11,10,24,-1,23,-13","w":193},"\u00d3":{"d":"18,-129v0,-92,29,-132,82,-132v53,0,82,40,82,132v0,92,-29,133,-82,133v-53,0,-82,-41,-82,-133xm41,-129v0,83,22,114,59,114v37,0,59,-31,59,-114v0,-83,-22,-113,-59,-113v-37,0,-59,30,-59,113xm112,-320r25,0r-35,51r-17,0","w":200},"\u00d4":{"d":"18,-129v0,-92,29,-132,82,-132v53,0,82,40,82,132v0,92,-29,133,-82,133v-53,0,-82,-41,-82,-133xm41,-129v0,83,22,114,59,114v37,0,59,-31,59,-114v0,-83,-22,-113,-59,-113v-37,0,-59,30,-59,113xm76,-269r-21,0r34,-51r22,0r34,51r-21,0r-24,-36","w":200},"\u00d6":{"d":"18,-129v0,-92,29,-132,82,-132v53,0,82,40,82,132v0,92,-29,133,-82,133v-53,0,-82,-41,-82,-133xm41,-129v0,83,22,114,59,114v37,0,59,-31,59,-114v0,-83,-22,-113,-59,-113v-37,0,-59,30,-59,113xm62,-277r0,-37r22,0r0,37r-22,0xm116,-277r0,-37r22,0r0,37r-22,0","w":200},"\u00d2":{"d":"18,-129v0,-92,29,-132,82,-132v53,0,82,40,82,132v0,92,-29,133,-82,133v-53,0,-82,-41,-82,-133xm41,-129v0,83,22,114,59,114v37,0,59,-31,59,-114v0,-83,-22,-113,-59,-113v-37,0,-59,30,-59,113xm63,-320r26,0r27,51r-18,0","w":200},"\u00d5":{"d":"18,-129v0,-92,29,-132,82,-132v53,0,82,40,82,132v0,92,-29,133,-82,133v-53,0,-82,-41,-82,-133xm41,-129v0,83,22,114,59,114v37,0,59,-31,59,-114v0,-83,-22,-113,-59,-113v-37,0,-59,30,-59,113xm132,-313r16,0v2,33,-36,45,-59,22v-13,-7,-19,4,-21,15r-16,0v0,-31,34,-46,57,-24v11,10,24,-1,23,-13","w":200},"\u0160":{"d":"156,-191r-23,0v0,-32,-15,-51,-46,-51v-31,0,-49,20,-49,46v0,77,125,35,125,125v0,50,-31,75,-78,75v-51,0,-77,-29,-75,-84r23,0v-2,39,13,65,51,65v32,0,56,-16,56,-52v0,-76,-125,-33,-125,-126v0,-40,26,-68,71,-68v48,0,70,24,70,70xm41,-320r21,0r24,36r25,-36r21,0r-35,51r-22,0","w":172},"\u00da":{"d":"17,-72r0,-185r23,0r0,185v0,39,16,57,50,57v34,0,50,-18,50,-57r0,-185r23,0r0,185v0,54,-26,76,-73,76v-47,0,-73,-22,-73,-76xm102,-320r25,0r-35,51r-17,0","w":180},"\u00db":{"d":"17,-72r0,-185r23,0r0,185v0,39,16,57,50,57v34,0,50,-18,50,-57r0,-185r23,0r0,185v0,54,-26,76,-73,76v-47,0,-73,-22,-73,-76xm66,-269r-21,0r34,-51r22,0r34,51r-21,0r-24,-36","w":180},"\u00dc":{"d":"17,-72r0,-185r23,0r0,185v0,39,16,57,50,57v34,0,50,-18,50,-57r0,-185r23,0r0,185v0,54,-26,76,-73,76v-47,0,-73,-22,-73,-76xm52,-277r0,-37r22,0r0,37r-22,0xm106,-277r0,-37r22,0r0,37r-22,0","w":180},"\u00d9":{"d":"17,-72r0,-185r23,0r0,185v0,39,16,57,50,57v34,0,50,-18,50,-57r0,-185r23,0r0,185v0,54,-26,76,-73,76v-47,0,-73,-22,-73,-76xm53,-320r25,0r27,51r-17,0","w":180},"\u00dd":{"d":"68,0r0,-103r-69,-154r24,0r57,128r56,-128r25,0r-70,154r0,103r-23,0xm91,-320r26,0r-35,51r-18,0","w":159},"\u0178":{"d":"68,0r0,-103r-69,-154r24,0r57,128r56,-128r25,0r-70,154r0,103r-23,0xm42,-277r0,-37r22,0r0,37r-22,0xm96,-277r0,-37r22,0r0,37r-22,0","w":159},"\u017d":{"d":"8,0r0,-22r125,-216r-118,0r0,-19r142,0r0,22r-124,216r125,0r0,19r-150,0xm37,-320r22,0r24,36r24,-36r22,0r-35,51r-22,0","w":166},"\u00e1":{"d":"39,-134r-22,0v0,-39,19,-61,59,-61v84,0,54,94,54,163v0,14,5,17,17,16r0,16v-21,6,-41,0,-38,-28v-9,25,-29,32,-50,32v-61,0,-65,-96,-10,-107v24,-12,59,0,59,-41v0,-24,-14,-33,-33,-33v-26,0,-36,15,-36,43xm64,-14v40,0,48,-47,44,-94v-18,22,-74,12,-74,57v0,22,11,37,30,37xm88,-266r26,0r-36,51r-17,0","w":153},"\u00e2":{"d":"39,-134r-22,0v0,-39,19,-61,59,-61v84,0,54,94,54,163v0,14,5,17,17,16r0,16v-21,6,-41,0,-38,-28v-9,25,-29,32,-50,32v-61,0,-65,-96,-10,-107v24,-12,59,0,59,-41v0,-24,-14,-33,-33,-33v-26,0,-36,15,-36,43xm64,-14v40,0,48,-47,44,-94v-18,22,-74,12,-74,57v0,22,11,37,30,37xm53,-215r-22,0r35,-51r21,0r35,51r-22,0r-23,-36","w":153},"\u00e4":{"d":"39,-134r-22,0v0,-39,19,-61,59,-61v84,0,54,94,54,163v0,14,5,17,17,16r0,16v-21,6,-41,0,-38,-28v-9,25,-29,32,-50,32v-61,0,-65,-96,-10,-107v24,-12,59,0,59,-41v0,-24,-14,-33,-33,-33v-26,0,-36,15,-36,43xm64,-14v40,0,48,-47,44,-94v-18,22,-74,12,-74,57v0,22,11,37,30,37xm39,-222r0,-37r21,0r0,37r-21,0xm93,-222r0,-37r21,0r0,37r-21,0","w":153},"\u00e0":{"d":"39,-134r-22,0v0,-39,19,-61,59,-61v84,0,54,94,54,163v0,14,5,17,17,16r0,16v-21,6,-41,0,-38,-28v-9,25,-29,32,-50,32v-61,0,-65,-96,-10,-107v24,-12,59,0,59,-41v0,-24,-14,-33,-33,-33v-26,0,-36,15,-36,43xm64,-14v40,0,48,-47,44,-94v-18,22,-74,12,-74,57v0,22,11,37,30,37xm40,-266r25,0r27,51r-17,0","w":153},"\u00e5":{"d":"39,-134r-22,0v0,-39,19,-61,59,-61v84,0,54,94,54,163v0,14,5,17,17,16r0,16v-21,6,-41,0,-38,-28v-9,25,-29,32,-50,32v-61,0,-65,-96,-10,-107v24,-12,59,0,59,-41v0,-24,-14,-33,-33,-33v-26,0,-36,15,-36,43xm64,-14v40,0,48,-47,44,-94v-18,22,-74,12,-74,57v0,22,11,37,30,37xm42,-245v0,-19,16,-34,35,-34v19,0,34,15,34,34v0,19,-15,34,-34,34v-19,0,-35,-15,-35,-34xm55,-245v0,12,10,21,22,21v12,0,21,-9,21,-21v0,-12,-9,-21,-21,-21v-12,0,-22,9,-22,21","w":153},"\u00e3":{"d":"39,-134r-22,0v0,-39,19,-61,59,-61v84,0,54,94,54,163v0,14,5,17,17,16r0,16v-21,6,-41,0,-38,-28v-9,25,-29,32,-50,32v-61,0,-65,-96,-10,-107v24,-12,59,0,59,-41v0,-24,-14,-33,-33,-33v-26,0,-36,15,-36,43xm64,-14v40,0,48,-47,44,-94v-18,22,-74,12,-74,57v0,22,11,37,30,37xm109,-258r16,0v1,22,-23,46,-45,29v-12,-9,-34,-17,-36,7r-16,0v1,-31,35,-46,58,-23v11,10,23,-2,23,-13","w":153},"\u00e7":{"d":"60,35v-11,-10,9,-21,13,-31v-39,-1,-62,-29,-62,-100v0,-66,24,-99,66,-99v36,0,57,22,59,61r-22,0v-3,-30,-14,-43,-37,-43v-23,0,-43,14,-43,82v0,72,21,81,41,81v22,0,35,-16,39,-49r22,0v-3,36,-22,62,-50,67v-3,6,-12,12,-12,17v18,-7,41,5,40,22v-1,32,-46,36,-70,23r4,-11v13,8,50,6,47,-10v1,-14,-25,-16,-35,-10","w":146},"\u00e9":{"d":"117,-63r22,0v-3,41,-26,67,-62,67v-40,0,-64,-28,-64,-100v0,-66,24,-99,66,-99v44,0,63,35,61,100r-104,0v-2,53,18,81,41,81v23,0,36,-16,40,-49xm36,-113r81,0v-1,-48,-13,-64,-40,-64v-27,0,-40,16,-41,64xm90,-266r26,0r-36,51r-17,0","w":153},"\u00ea":{"d":"117,-63r22,0v-3,41,-26,67,-62,67v-40,0,-64,-28,-64,-100v0,-66,24,-99,66,-99v44,0,63,35,61,100r-104,0v-2,53,18,81,41,81v23,0,36,-16,40,-49xm36,-113r81,0v-1,-48,-13,-64,-40,-64v-27,0,-40,16,-41,64xm55,-215r-22,0r35,-51r21,0r35,51r-22,0r-24,-36","w":153},"\u00eb":{"d":"117,-63r22,0v-3,41,-26,67,-62,67v-40,0,-64,-28,-64,-100v0,-66,24,-99,66,-99v44,0,63,35,61,100r-104,0v-2,53,18,81,41,81v23,0,36,-16,40,-49xm36,-113r81,0v-1,-48,-13,-64,-40,-64v-27,0,-40,16,-41,64xm41,-222r0,-37r21,0r0,37r-21,0xm95,-222r0,-37r21,0r0,37r-21,0","w":153},"\u00e8":{"d":"117,-63r22,0v-3,41,-26,67,-62,67v-40,0,-64,-28,-64,-100v0,-66,24,-99,66,-99v44,0,63,35,61,100r-104,0v-2,53,18,81,41,81v23,0,36,-16,40,-49xm36,-113r81,0v-1,-48,-13,-64,-40,-64v-27,0,-40,16,-41,64xm41,-266r26,0r27,51r-17,0","w":153},"\u00ed":{"d":"22,0r0,-191r22,0r0,191r-22,0xm45,-266r25,0r-35,51r-17,0"},"\u00ee":{"d":"22,0r0,-191r22,0r0,191r-22,0xm9,-215r-21,0r34,-51r22,0r34,51r-21,0r-24,-36"},"\u00ef":{"d":"22,0r0,-191r22,0r0,191r-22,0xm-5,-222r0,-37r22,0r0,37r-22,0xm49,-222r0,-37r22,0r0,37r-22,0"},"\u00ec":{"d":"22,0r0,-191r22,0r0,191r-22,0xm-4,-266r26,0r27,51r-18,0"},"\u00f1":{"d":"21,0r0,-191r19,0v1,8,-2,20,1,26v22,-45,98,-42,98,21r0,144r-22,0r0,-138v0,-26,-10,-39,-32,-39v-67,2,-36,113,-43,177r-21,0xm112,-258r16,0v1,22,-23,46,-45,29v-12,-9,-34,-17,-35,7r-16,0v0,-31,34,-46,57,-23v11,10,24,-1,23,-13","w":159},"\u00f3":{"d":"11,-96v0,-66,24,-99,66,-99v42,0,66,33,66,99v0,67,-24,100,-66,100v-42,0,-66,-33,-66,-100xm34,-96v0,61,19,82,43,82v24,0,43,-21,43,-82v0,-61,-19,-81,-43,-81v-24,0,-43,20,-43,81xm88,-266r26,0r-36,51r-17,0","w":153},"\u00f4":{"d":"11,-96v0,-66,24,-99,66,-99v42,0,66,33,66,99v0,67,-24,100,-66,100v-42,0,-66,-33,-66,-100xm34,-96v0,61,19,82,43,82v24,0,43,-21,43,-82v0,-61,-19,-81,-43,-81v-24,0,-43,20,-43,81xm53,-215r-22,0r35,-51r21,0r35,51r-22,0r-23,-36","w":153},"\u00f6":{"d":"11,-96v0,-66,24,-99,66,-99v42,0,66,33,66,99v0,67,-24,100,-66,100v-42,0,-66,-33,-66,-100xm34,-96v0,61,19,82,43,82v24,0,43,-21,43,-82v0,-61,-19,-81,-43,-81v-24,0,-43,20,-43,81xm39,-222r0,-37r21,0r0,37r-21,0xm93,-222r0,-37r21,0r0,37r-21,0","w":153},"\u00f2":{"d":"11,-96v0,-66,24,-99,66,-99v42,0,66,33,66,99v0,67,-24,100,-66,100v-42,0,-66,-33,-66,-100xm34,-96v0,61,19,82,43,82v24,0,43,-21,43,-82v0,-61,-19,-81,-43,-81v-24,0,-43,20,-43,81xm40,-266r25,0r27,51r-17,0","w":153},"\u00f5":{"d":"11,-96v0,-66,24,-99,66,-99v42,0,66,33,66,99v0,67,-24,100,-66,100v-42,0,-66,-33,-66,-100xm34,-96v0,61,19,82,43,82v24,0,43,-21,43,-82v0,-61,-19,-81,-43,-81v-24,0,-43,20,-43,81xm109,-258r16,0v1,22,-23,46,-45,29v-12,-9,-34,-17,-36,7r-16,0v1,-31,35,-46,58,-23v11,10,23,-2,23,-13","w":153},"\u0161":{"d":"107,-48v0,-49,-93,-39,-93,-92v0,-39,25,-55,57,-55v38,0,54,20,53,58r-22,0v1,-27,-9,-41,-31,-40v-43,0,-49,52,-9,64v29,10,67,26,67,60v0,33,-19,57,-59,57v-41,1,-61,-19,-59,-65r22,0v-1,30,10,48,36,47v23,0,38,-13,38,-34xm24,-266r22,0r24,37r24,-37r22,0r-35,51r-22,0","w":140},"\u00fa":{"d":"21,-47r0,-144r21,0r0,134v0,31,11,43,34,43v64,0,35,-114,41,-177r22,0r0,191r-19,0v-1,-8,2,-21,-1,-27v-22,46,-98,43,-98,-20xm91,-266r26,0r-35,51r-18,0","w":159},"\u00fb":{"d":"21,-47r0,-144r21,0r0,134v0,31,11,43,34,43v64,0,35,-114,41,-177r22,0r0,191r-19,0v-1,-8,2,-21,-1,-27v-22,46,-98,43,-98,-20xm56,-215r-21,0r34,-51r22,0r34,51r-21,0r-24,-36","w":159},"\u00fc":{"d":"21,-47r0,-144r21,0r0,134v0,31,11,43,34,43v64,0,35,-114,41,-177r22,0r0,191r-19,0v-1,-8,2,-21,-1,-27v-22,46,-98,43,-98,-20xm42,-222r0,-37r22,0r0,37r-22,0xm96,-222r0,-37r22,0r0,37r-22,0","w":159},"\u00f9":{"d":"21,-47r0,-144r21,0r0,134v0,31,11,43,34,43v64,0,35,-114,41,-177r22,0r0,191r-19,0v-1,-8,2,-21,-1,-27v-22,46,-98,43,-98,-20xm43,-266r25,0r27,51r-17,0","w":159},"\u00fd":{"d":"58,2r-55,-193r23,0r43,165r39,-165r23,0r-56,206v-12,43,-25,50,-65,48r0,-18v32,7,41,-17,48,-43xm78,-266r26,0r-36,51r-17,0","w":133},"\u00ff":{"d":"58,2r-55,-193r23,0r43,165r39,-165r23,0r-56,206v-12,43,-25,50,-65,48r0,-18v32,7,41,-17,48,-43xm29,-222r0,-37r21,0r0,37r-21,0xm83,-222r0,-37r21,0r0,37r-21,0","w":133},"\u017e":{"d":"6,0r0,-18r91,-155r-86,0r0,-18r109,0r0,18r-90,155r90,0r0,18r-114,0xm18,-266r21,0r24,37r24,-37r22,0r-35,51r-22,0","w":126},"\u20ac":{"d":"109,-255v32,0,56,3,50,37v-9,-9,-25,-17,-47,-17v-38,0,-55,33,-59,77r91,0r-5,18r-88,0v-1,9,-1,20,0,29r79,0r-6,17r-71,0v1,76,62,96,106,61r0,23v-56,32,-127,9,-127,-84r-23,0r5,-17r16,0r0,-29r-21,0r5,-18r17,0v6,-57,28,-97,78,-97","w":172}}});
    /*!
     * The following copyright notice may not be removed under any circumstances.
     *
     * Copyright:
     * Copyright (c) 1990 Adobe Systems Incorporated.  All Rights Reserved.Helvetica
     * is a trademark of Linotype AG and/or its subsidiaries.
     *
     * Trademark:
     * Please refer to the Copyright section for the font trademark attribution
     * notices.
     *
     * Full name:
     * HelveticaNeue-MediumCond
     */
    Cufon.registerFont({"w":79,"face":{"font-family":"HelveticaNeue Condensed","font-weight":500,"font-stretch":"condensed","units-per-em":"360","panose-1":"2 11 6 6 0 0 0 0 0 0","ascent":"282","descent":"-78","x-height":"5","bbox":"-59 -342 371 78.0903","underline-thickness":"18","underline-position":"-18","stemh":"31","stemv":"39","unicode-range":"U+0020-U+FB02"},"glyphs":{" ":{"w":86,"k":{"\u201c":13,"\u2018":13,"Y":13,"W":13,"V":13,"T":13,"A":13}},"\u00a0":{"w":86},"!":{"d":"36,-69r-6,-107r0,-81r41,0v1,66,-3,127,-7,188r-28,0xm30,0r0,-41r41,0r0,41r-41,0","w":100},"\"":{"d":"95,-154r0,-103r31,0r0,103r-31,0xm27,-154r0,-103r31,0r0,103r-31,0","w":153},"#":{"d":"64,-99r38,0r7,-52r-38,0xm-1,-72r0,-27r35,0r7,-52r-32,0r0,-27r36,0r10,-72r30,0r-10,72r38,0r10,-72r30,0r-10,72r31,0r0,27r-35,0r-7,52r31,0r0,27r-35,0r-10,72r-30,0r10,-72r-38,0r-10,72r-30,0r10,-72r-31,0","w":172},"$":{"d":"94,-103r0,77v45,-6,41,-72,0,-77xm78,-150r0,-74v-15,1,-28,13,-28,36v0,17,9,29,28,38xm78,36r0,-31v-64,-5,-73,-42,-72,-82r41,0v-1,30,6,47,31,51r0,-83v-39,-13,-69,-33,-69,-75v0,-41,30,-71,69,-71r0,-25r16,0r0,25v57,2,69,39,68,71r-41,0v1,-22,-4,-38,-27,-40r0,80v38,12,73,31,73,74v0,50,-28,72,-73,75r0,31r-16,0","w":172},"%":{"d":"62,-233v-15,0,-18,14,-18,47v0,33,3,47,18,47v15,0,19,-14,19,-47v0,-33,-4,-47,-19,-47xm179,-255r28,0r-115,260r-27,0xm211,-111v-15,0,-18,14,-18,47v0,33,3,47,18,47v15,0,18,-14,18,-47v0,-33,-3,-47,-18,-47xm62,-255v28,0,50,15,50,69v0,54,-22,69,-50,69v-28,0,-49,-15,-49,-69v0,-54,21,-69,49,-69xm211,-133v28,0,49,15,49,69v0,54,-21,69,-49,69v-28,0,-49,-15,-49,-69v0,-54,21,-69,49,-69","w":273},"&":{"d":"107,-141r45,63v7,-11,11,-27,10,-44r32,0v0,19,-3,45,-22,73r35,49r-44,0r-15,-22v-17,15,-36,27,-65,27v-96,0,-91,-100,-39,-138r16,-12v-10,-16,-27,-37,-27,-57v0,-37,28,-55,62,-55v19,0,56,9,56,52v1,30,-23,49,-44,64xm68,-208v0,14,13,53,30,35v21,-12,29,-57,-6,-57v-10,0,-24,5,-24,22xm78,-121v-16,13,-32,29,-32,52v0,43,64,53,84,21","w":206},"\u2019":{"d":"23,-210r0,-47r41,0v-1,50,8,95,-41,103r0,-21v13,-3,19,-16,18,-35r-18,0","w":86,"k":{"s":13,"r":6,"d":13,"\u2019":22}},"(":{"d":"66,-257r27,0v-55,92,-55,229,0,323r-27,0v-28,-37,-53,-95,-53,-161v0,-66,25,-125,53,-162","w":93},")":{"d":"27,66r-27,0v56,-92,55,-229,0,-323r28,0v28,37,52,96,52,162v0,66,-25,124,-53,161","w":93},"*":{"d":"55,-257r24,0r0,45r40,-16r8,24r-41,12r28,37r-20,15r-27,-37r-27,37r-20,-15r28,-37r-42,-12r8,-24r41,16r0,-45","w":133},"+":{"d":"93,-107r0,-75r30,0r0,75r76,0r0,31r-76,0r0,76r-30,0r0,-76r-76,0r0,-31r76,0","w":216},",":{"d":"23,0r0,-48r41,0v-1,50,8,95,-41,103r0,-20v12,-3,19,-17,18,-35r-18,0","w":86,"k":{"\u201d":27,"\u2019":27," ":13}},"-":{"d":"16,-86r0,-36r95,0r0,36r-95,0","w":126},"\u00ad":{"d":"16,-86r0,-36r95,0r0,36r-95,0","w":126},".":{"d":"23,0r0,-48r41,0r0,48r-41,0","w":86,"k":{"\u201d":27,"\u2019":27}},"\/":{"d":"-4,5r82,-267r32,0r-82,267r-32,0","w":106},"0":{"d":"51,-125v0,74,7,101,35,101v28,0,36,-27,36,-101v0,-74,-8,-101,-36,-101v-28,0,-35,27,-35,101xm10,-125v0,-99,27,-130,76,-130v49,0,77,31,77,130v0,99,-28,130,-77,130v-49,0,-76,-31,-76,-130","w":172},"1":{"d":"116,0r-41,0r0,-185r-53,0r0,-27v28,0,60,-5,64,-43r30,0r0,255","w":172},"2":{"d":"161,-35r0,35r-149,0v0,-111,107,-109,107,-188v0,-21,-9,-38,-32,-38v-31,0,-36,27,-36,53r-38,0v0,-51,21,-82,75,-82v52,0,72,31,72,68v0,85,-83,90,-102,152r103,0","w":172},"3":{"d":"11,-71r39,0v0,22,7,47,35,47v26,0,36,-20,36,-45v1,-37,-18,-52,-58,-48r0,-29v35,4,53,-12,52,-43v0,-18,-9,-37,-30,-37v-25,0,-32,22,-32,45r-39,0v0,-48,24,-74,73,-74v31,0,69,14,69,65v1,27,-18,51,-41,57v26,2,47,23,47,59v0,50,-25,79,-78,79v-46,0,-73,-23,-73,-76","w":172},"4":{"d":"8,-57r0,-36r88,-162r42,0r0,165r27,0r0,33r-27,0r0,57r-39,0r0,-57r-91,0xm99,-90r-1,-105r-57,105r58,0","w":172},"5":{"d":"83,5v-47,0,-73,-25,-71,-74r38,0v-2,24,8,42,34,43v28,0,36,-28,36,-58v0,-30,-8,-54,-34,-54v-17,0,-29,9,-33,23r-37,-1r13,-134r123,0r0,33r-93,0v-2,22,-8,47,-7,68v11,-12,26,-20,43,-20v53,0,66,45,66,84v0,51,-23,90,-78,90","w":172},"6":{"d":"159,-193r-41,0v0,-15,-6,-33,-27,-33v-38,-1,-43,54,-40,88v33,-50,113,-29,113,49v0,59,-24,94,-78,94v-64,0,-77,-49,-77,-122v0,-76,14,-138,81,-138v45,0,69,20,69,62xm54,-77v0,30,11,53,35,53v25,0,34,-24,34,-54v0,-35,-11,-56,-34,-56v-30,0,-35,26,-35,57","w":172},"7":{"d":"11,-213r0,-37r151,0r0,33v-40,52,-74,140,-80,217r-43,0v6,-76,42,-161,83,-213r-111,0","w":172},"8":{"d":"54,-188v0,21,6,39,32,39v26,0,32,-18,32,-39v0,-20,-6,-38,-32,-38v-26,0,-32,18,-32,38xm50,-72v0,27,7,48,36,48v29,0,36,-21,36,-48v0,-27,-7,-48,-36,-48v-29,0,-36,21,-36,48xm86,5v-52,0,-77,-26,-77,-76v-1,-39,21,-57,44,-65v-22,-8,-35,-24,-35,-55v0,-40,26,-64,68,-64v73,0,93,101,34,119v66,18,56,141,-34,141","w":172},"9":{"d":"14,-57r41,0v0,15,6,33,27,33v38,1,43,-54,40,-88v-33,50,-113,29,-113,-49v0,-59,24,-94,78,-94v64,0,77,49,77,122v0,76,-15,138,-82,138v-45,0,-68,-20,-68,-62xm119,-173v0,-30,-11,-53,-35,-53v-25,0,-34,25,-34,55v0,35,11,55,34,55v30,0,35,-26,35,-57","w":172},":":{"d":"23,-137r0,-47r41,0r0,47r-41,0xm23,0r0,-48r41,0r0,48r-41,0","w":86,"k":{" ":13}},";":{"d":"23,0r0,-48r41,0v-1,50,8,95,-41,103r0,-20v12,-3,19,-17,18,-35r-18,0xm23,-137r0,-47r41,0r0,47r-41,0","w":86},"<":{"d":"17,-78r0,-26r182,-82r0,31r-145,64r145,64r0,31","w":216},"=":{"d":"17,-113r0,-31r182,0r0,31r-182,0xm17,-38r0,-31r182,0r0,31r-182,0","w":216},">":{"d":"199,-104r0,26r-182,82r0,-31r145,-64r-145,-64r0,-31","w":216},"?":{"d":"61,-69v-11,-70,50,-67,52,-124v0,-20,-7,-38,-29,-38v-24,0,-33,21,-33,51r-38,0v0,-45,19,-82,71,-82v45,0,70,25,70,69v-1,69,-64,67,-56,124r-37,0xm58,0r0,-41r41,0r0,41r-41,0","w":166},"@":{"d":"130,-76v38,2,72,-101,17,-101v-30,0,-51,36,-51,65v0,22,11,36,34,36xm194,-198r26,0r-31,115v0,5,3,8,12,8v20,0,44,-33,44,-73v0,-51,-45,-85,-95,-85v-63,0,-107,50,-107,106v0,104,133,130,193,72r30,0v-19,35,-60,60,-119,60v-76,0,-137,-50,-137,-134v0,-75,56,-133,140,-133v73,0,128,45,128,110v0,72,-57,103,-92,103v-19,1,-23,-12,-26,-22v-27,37,-94,25,-94,-37v0,-69,83,-135,121,-68","w":288},"A":{"d":"64,-96r61,0r-31,-126xm-3,0r73,-257r52,0r68,257r-43,0r-16,-63r-75,0r-16,63r-43,0","w":186,"k":{"\u201d":20,"y":6,"w":6,"v":6,"Y":20,"W":11,"V":11,"T":20,"\u2019":20}},"B":{"d":"62,-149v39,3,71,-2,70,-40v-1,-43,-33,-37,-70,-37r0,77xm62,-31v44,1,79,3,79,-45v0,-44,-35,-47,-79,-44r0,89xm21,0r0,-257v72,1,153,-15,153,62v0,31,-12,51,-38,59v28,5,46,22,46,66v0,43,-31,70,-79,70r-82,0","w":193,"k":{".":11,",":11}},"C":{"d":"138,-92r41,0v1,50,-17,97,-79,97v-65,0,-85,-42,-85,-134v0,-92,20,-133,85,-133v75,0,78,53,78,85r-41,0v0,-27,-6,-54,-37,-54v-30,0,-44,18,-44,101v0,83,14,104,44,104v35,-1,38,-39,38,-66","w":186,"k":{".":6,",":6}},"D":{"d":"62,-226r0,195v67,3,82,-3,82,-98v0,-91,-15,-101,-82,-97xm21,0r0,-257r73,0v81,0,91,52,91,128v0,76,-10,129,-91,129r-73,0","w":200,"k":{"Y":6,".":14,",":14}},"E":{"d":"21,0r0,-257r139,0r0,35r-98,0r0,71r92,0r0,34r-92,0r0,82r101,0r0,35r-142,0","w":173},"F":{"d":"21,0r0,-257r137,0r0,35r-96,0r0,71r91,0r0,34r-91,0r0,117r-41,0","w":166,"k":{"A":13,".":46,",":46}},"G":{"d":"148,0r0,-30v-11,24,-27,35,-57,35v-56,0,-76,-42,-76,-134v0,-92,26,-133,85,-133v66,0,77,49,76,79r-39,0v1,-24,-6,-48,-36,-48v-29,0,-45,19,-45,101v0,83,14,104,42,104v31,0,42,-22,42,-78r-43,0r0,-31r82,0r0,135r-31,0","w":193,"k":{".":6,",":6}},"H":{"d":"21,0r0,-257r41,0r0,103r76,0r0,-103r41,0r0,257r-41,0r0,-120r-76,0r0,120r-41,0","w":200},"I":{"d":"19,0r0,-257r41,0r0,257r-41,0"},"J":{"d":"6,-77r39,0v0,26,0,51,27,51v27,0,27,-25,27,-51r0,-180r41,0r0,186v0,57,-28,76,-69,76v-60,0,-66,-36,-65,-82","w":159,"k":{".":14,",":14}},"K":{"d":"21,0r0,-257r41,0r1,112r78,-112r45,0r-74,108r82,149r-47,0r-62,-116r-23,33r0,83r-41,0","w":186},"L":{"d":"17,0r0,-257r41,0r0,222r99,0r0,35r-140,0","w":159,"k":{"\u201d":40,"y":13,"Y":33,"W":27,"V":27,"T":33,"\u2019":40}},"M":{"d":"21,0r0,-257r64,0r46,190r45,-190r63,0r0,257r-39,0r-1,-214r-52,214r-34,0r-53,-214r0,214r-39,0","w":259},"N":{"d":"21,0r0,-257r50,0r76,191r0,-191r38,0r0,257r-50,0r-75,-197r0,197r-39,0","w":206,"k":{".":6,",":6}},"O":{"d":"100,5v-59,0,-85,-42,-85,-134v0,-92,26,-133,85,-133v59,0,85,41,85,133v0,92,-26,134,-85,134xm100,-26v24,0,44,-15,44,-104v0,-86,-20,-101,-44,-101v-24,0,-44,15,-44,101v0,89,20,104,44,104","w":200,"k":{"Y":14,"X":6,"V":6,"T":11,"A":6,".":14,",":14}},"P":{"d":"62,-226r0,89v40,2,67,1,70,-44v2,-39,-28,-49,-70,-45xm21,0r0,-257r82,0v49,0,71,31,71,75v1,60,-45,83,-112,76r0,106r-41,0","w":180,"k":{"A":13,".":54,",":54}},"Q":{"d":"167,23r-27,-27v-77,29,-125,-14,-125,-125v0,-92,26,-133,85,-133v59,0,85,41,85,133v0,48,-8,83,-20,102r26,28xm95,-48r24,-23r17,17v6,-15,8,-40,8,-76v0,-86,-20,-101,-44,-101v-24,0,-44,15,-44,101v0,98,16,108,59,102","w":200,"k":{".":6,",":6}},"R":{"d":"142,0v-20,-30,12,-119,-46,-112r-34,0r0,112r-41,0r0,-257v75,3,156,-19,156,66v0,34,-17,58,-43,64v26,3,40,16,41,52v1,27,-4,67,13,75r-46,0xm62,-143v40,3,74,-1,74,-41v0,-42,-33,-45,-74,-42r0,83","w":193,"k":{"Y":6,"T":6}},"S":{"d":"12,-80r41,0v-2,34,12,55,42,54v26,0,39,-18,39,-37v2,-40,-36,-45,-65,-56v-37,-14,-54,-33,-54,-70v0,-47,32,-73,80,-73v68,0,73,40,73,73r-41,0v1,-26,-8,-42,-36,-42v-18,0,-34,10,-34,37v0,32,38,45,66,54v36,13,52,33,52,68v0,55,-33,77,-85,77v-67,0,-79,-42,-78,-85","w":186,"k":{".":11,",":11}},"T":{"d":"63,0r0,-222r-61,0r0,-35r163,0r0,35r-61,0r0,222r-41,0","w":166,"k":{"y":27,"w":27,"u":27,"r":27,"o":27,"i":6,"e":27,"a":27,"O":11,"A":20,";":27,":":27,".":33,"-":27,",":33}},"U":{"d":"18,-257r41,0r0,184v0,32,13,47,38,47v24,0,37,-15,37,-47r0,-184r41,0r0,181v0,59,-29,81,-78,81v-49,0,-79,-22,-79,-81r0,-181","w":193,"k":{".":11,",":11}},"V":{"d":"58,0r-60,-257r43,0r45,205r46,-205r43,0r-64,257r-53,0","w":173,"k":{"u":6,"o":6,"e":6,"a":6,"A":13,";":6,":":6,".":33,"-":6,",":33}},"W":{"d":"52,0r-50,-257r42,0r34,200r34,-200r43,0r35,201r34,-201r41,0r-52,257r-47,0r-34,-194r-33,194r-47,0","w":266,"k":{"y":6,"o":6,"e":6,"a":6,"A":11,".":27,"-":6,",":27}},"X":{"d":"0,0r68,-131r-62,-126r45,0r41,85r40,-85r45,0r-63,126r66,131r-45,0r-45,-93r-46,93r-44,0","w":180},"Y":{"d":"65,0r0,-100r-66,-157r45,0r43,111r45,-111r43,0r-69,157r0,100r-41,0","w":173,"k":{"u":18,"o":20,"i":6,"e":20,"a":20,"S":6,"O":14,"A":20,";":13,":":13,".":40,"-":27,",":40}},"Z":{"d":"6,0r0,-32r108,-190r-101,0r0,-35r146,0r0,35r-108,187r109,0r0,35r-154,0","w":166},"[":{"d":"28,66r0,-323r73,0r0,29r-37,0r0,265r37,0r0,29r-73,0","w":100},"\\":{"d":"78,5r-82,-267r32,0r82,267r-32,0","w":106},"]":{"d":"-1,66r0,-29r37,0r0,-265r-37,0r0,-29r73,0r0,323r-73,0","w":100},"^":{"d":"165,-101r-57,-118r-57,118r-30,0r73,-149r27,0r74,149r-30,0","w":216},"_":{"d":"0,45r0,-18r180,0r0,18r-180,0","w":180},"\u2018":{"d":"23,-154v1,-50,-8,-95,41,-103r0,21v-12,3,-19,16,-18,34r18,0r0,48r-41,0","w":86,"k":{"\u2018":22,"A":20}},"a":{"d":"146,-151r0,111v-1,9,8,16,16,12r0,25v-19,10,-50,4,-52,-20v-20,44,-99,37,-99,-26v0,-57,36,-57,75,-69v14,-4,23,-8,23,-25v0,-18,-6,-29,-27,-29v-26,0,-29,18,-29,37r-37,0v0,-41,17,-64,68,-64v34,0,62,14,62,48xm109,-102v-20,15,-59,12,-59,49v0,16,8,29,24,29v34,2,37,-40,35,-78","w":166,"k":{"v":2}},"b":{"d":"19,0r0,-257r39,0r0,86v7,-17,23,-28,44,-28v30,0,60,14,60,100v0,67,-18,104,-63,104v-29,1,-37,-18,-44,-29r0,24r-36,0xm55,-95v0,41,6,69,33,69v27,0,33,-28,33,-72v0,-52,-8,-70,-30,-70v-30,0,-36,27,-36,73","w":173,"k":{"y":4,".":13,",":13}},"c":{"d":"113,-71r36,0v-3,46,-18,76,-66,76v-56,0,-72,-42,-72,-102v0,-60,16,-102,72,-102v58,0,67,46,67,70r-39,0v0,-18,-5,-41,-28,-41v-28,0,-33,30,-33,73v0,43,5,73,33,73v22,0,30,-18,30,-47","w":159,"k":{"y":6,"k":2,"h":2,".":13,",":13}},"d":{"d":"118,0v-1,-7,2,-18,-1,-24v-5,13,-14,29,-42,29v-45,0,-64,-37,-64,-104v0,-86,30,-100,60,-100v22,-1,36,13,45,28r0,-86r38,0r0,257r-36,0xm118,-95v0,-46,-6,-73,-36,-73v-22,0,-30,18,-30,70v0,44,6,72,33,72v27,0,33,-28,33,-69","w":173,"k":{"y":2}},"e":{"d":"153,-92r-101,0v0,32,0,70,33,70v28,0,31,-31,31,-43r36,0v0,43,-26,70,-68,70v-32,0,-71,-9,-71,-99v0,-51,11,-105,72,-105v61,0,70,45,68,107xm52,-118r62,0v1,-28,-3,-54,-29,-54v-26,0,-34,27,-33,54","w":166,"k":{"x":2,".":13,",":13}},"f":{"d":"31,0r0,-165r-27,0r0,-29r27,0v-6,-53,19,-73,70,-65r0,30v-26,-3,-36,8,-32,35r32,0r0,29r-32,0r0,165r-38,0","w":100,"k":{"\u201d":-6,".":13,",":13,"\u2019":-6}},"g":{"d":"21,17r37,0v0,12,11,23,28,23v31,1,34,-34,32,-68v-7,17,-25,27,-44,27v-45,0,-58,-45,-58,-98v0,-42,6,-100,61,-100v24,-1,38,17,44,29r0,-24r36,0r0,185v0,47,-20,75,-72,75v-58,0,-64,-33,-64,-49xm55,-103v0,33,1,71,30,71v30,0,33,-38,33,-69v0,-32,-4,-67,-31,-67v-28,0,-32,29,-32,65","w":173,"k":{"r":-2,".":6,",":6}},"h":{"d":"19,0r0,-257r39,0r1,85v23,-40,95,-40,95,26r0,146r-38,0r0,-133v0,-25,-8,-35,-27,-35v-16,0,-31,13,-31,38r0,130r-39,0","w":173,"k":{"y":2}},"i":{"d":"21,0r0,-194r38,0r0,194r-38,0xm21,-221r0,-39r38,0r0,39r-38,0"},"j":{"d":"21,-194r38,0r0,207v1,47,-26,57,-68,52r0,-30v21,1,30,-1,30,-26r0,-203xm21,-260r38,0r0,39r-38,0r0,-39"},"k":{"d":"19,0r0,-257r39,0r0,144r59,-81r45,0r-58,75r66,119r-43,0r-47,-88r-22,26r0,62r-39,0","w":166,"k":{"y":2,"o":2,"e":2}},"l":{"d":"21,0r0,-257r38,0r0,257r-38,0"},"m":{"d":"21,0r0,-194r36,0v1,7,-2,18,1,23v16,-37,85,-35,92,2v20,-43,96,-44,96,22r0,147r-39,0r0,-133v0,-25,-7,-35,-23,-35v-16,0,-31,13,-31,38r0,130r-39,0r0,-133v0,-25,-8,-35,-24,-35v-15,0,-31,13,-31,38r0,130r-38,0","w":266},"n":{"d":"19,0r0,-194r36,0v1,7,-3,20,2,23v20,-40,97,-43,97,25r0,146r-38,0r0,-133v0,-25,-8,-35,-27,-35v-16,0,-31,13,-31,38r0,130r-39,0","w":173},"o":{"d":"11,-97v0,-60,16,-102,72,-102v57,0,73,42,73,102v0,60,-19,102,-73,102v-54,0,-72,-42,-72,-102xm50,-97v0,49,5,73,33,73v28,0,34,-24,34,-73v0,-43,-6,-73,-34,-73v-28,0,-33,30,-33,73","w":166,"k":{"y":2,"w":2,"v":2,".":6,",":6}},"p":{"d":"19,63r0,-257r36,0v1,7,-2,18,1,24v8,-17,23,-29,44,-29v44,0,62,38,62,105v0,81,-33,99,-60,99v-21,0,-37,-11,-44,-28r0,86r-39,0xm55,-99v0,46,7,73,34,73v22,0,32,-16,32,-70v0,-44,-6,-72,-33,-72v-27,0,-33,28,-33,69","w":173,"k":{"y":2,".":6,",":6}},"q":{"d":"116,63r-1,-86v-7,17,-23,28,-44,28v-30,0,-60,-21,-60,-99v0,-67,19,-105,64,-105v29,-1,36,18,43,29r0,-24r36,0r0,257r-38,0xm118,-99v0,-41,-6,-69,-33,-69v-27,0,-33,28,-33,72v0,52,10,70,30,70v30,0,36,-27,36,-73","w":173},"r":{"d":"19,0r0,-194r39,0r0,31v10,-25,28,-41,55,-34r0,39v-29,-5,-55,-2,-55,42r0,116r-39,0","w":113,"k":{"y":-6,"v":-6,"q":4,"n":-4,"m":-4,"g":2,"e":2,"d":2,"c":2,"a":2,".":33,"-":20,",":33,"\u2019":-4}},"s":{"d":"139,-137r-37,0v1,-19,-3,-34,-25,-35v-15,0,-28,7,-28,25v0,24,32,30,52,37v29,10,42,25,42,56v0,41,-30,59,-69,59v-52,0,-65,-25,-64,-67r35,0v-1,25,6,40,30,40v39,0,41,-46,10,-56v-34,-11,-73,-22,-73,-67v0,-36,26,-54,66,-54v53,0,62,29,61,62","w":153},"t":{"d":"1,-165r0,-29r27,0r0,-55r39,0r0,55r32,0r0,29r-32,0r0,116v-2,21,16,22,32,19r0,29v-36,5,-71,12,-71,-44r0,-120r-27,0","w":100},"u":{"d":"118,0v-1,-7,2,-18,-1,-23v-25,40,-98,46,-98,-35r0,-136r39,0r0,139v0,22,9,29,26,29v17,0,32,-10,32,-32r0,-136r38,0r0,194r-36,0","w":173},"v":{"d":"54,0r-51,-194r41,0r35,153r30,-153r42,0r-51,194r-46,0","w":153,"k":{"a":4,".":27,",":27}},"w":{"d":"49,0r-44,-194r41,0r27,153r29,-153r44,0r30,153r26,-153r39,0r-44,194r-44,0r-31,-150r-27,150r-46,0","w":246,"k":{"o":2,"a":4,".":20,",":20}},"x":{"d":"1,0r53,-100r-50,-94r42,0r31,64r31,-64r42,0r-50,94r52,100r-42,0r-34,-72r-34,72r-41,0","w":153},"y":{"d":"3,-194r42,0r34,146r31,-146r40,0r-53,201v-16,60,-32,61,-83,58r0,-31v26,6,41,-7,44,-30","w":153,"k":{"e":2,".":27,",":27}},"z":{"d":"9,0r0,-30r85,-131r-80,0r0,-33r124,0r0,32r-82,129r82,0r0,33r-129,0","w":146},"{":{"d":"3,-84r0,-23v37,-3,28,-62,29,-103v1,-42,26,-50,66,-47r0,22v-46,-9,-30,53,-30,91v0,35,-25,44,-33,49v9,2,33,14,33,48v0,35,-20,97,30,91r0,22v-40,3,-65,-4,-66,-47v-1,-42,8,-99,-29,-103","w":100},"|":{"d":"24,5r0,-267r31,0r0,267r-31,0"},"}":{"d":"98,-107r0,23v-37,3,-30,61,-30,103v0,42,-26,51,-65,47r0,-22v45,8,29,-54,29,-91v0,-35,25,-44,33,-49v-9,-2,-33,-14,-33,-48v0,-35,20,-97,-29,-91r0,-22v39,-3,64,5,65,47v1,42,-8,100,30,103","w":100},"~":{"d":"146,-63v-25,0,-56,-24,-77,-26v-11,0,-21,9,-31,28r-13,-27v10,-21,28,-32,45,-32v41,2,85,57,108,-1r13,27v-11,19,-28,31,-45,31","w":216},"\u00a1":{"d":"64,-125r7,107r0,81r-41,0v-1,-66,2,-127,6,-188r28,0xm71,-194r0,41r-41,0r0,-41r41,0","w":100},"\u00a2":{"d":"81,-24r0,-146v-36,8,-35,138,0,146xm81,37r0,-32v-49,-4,-64,-45,-64,-102v0,-57,15,-98,64,-102r0,-27r15,0r0,27v51,3,60,47,60,70r-39,0v0,-16,-4,-37,-21,-41r0,146v17,-5,23,-22,23,-47r37,0v-3,44,-18,73,-60,76r0,32r-15,0","w":172},"\u00a3":{"d":"6,-113r0,-25r25,0v-33,-48,-21,-117,57,-117v59,0,77,34,76,74r-39,0v0,-20,-3,-45,-35,-45v-54,0,-34,62,-16,88r60,0r0,25r-50,0v12,38,-12,65,-39,83v6,3,18,-10,27,-7v29,8,61,17,83,-4v3,11,20,27,6,33v-43,36,-101,-21,-142,10r-15,-28v25,-12,57,-50,38,-87r-36,0","w":172},"\u2044":{"d":"-59,11r152,-272r26,0r-151,272r-27,0","w":60},"\u2215":{"d":"-59,11r152,-272r26,0r-151,272r-27,0","w":60},"\u00a5":{"d":"66,0r0,-58r-51,0r0,-25r51,0v0,-10,0,-20,-4,-25r-47,0r0,-24r36,0r-50,-118r44,0r41,102r43,-102r43,0r-53,118r36,0r0,24r-47,0v-4,5,-4,15,-4,25r51,0r0,25r-51,0r0,58r-38,0","w":172},"\u0192":{"d":"34,-156r38,0v11,-46,10,-103,69,-101v10,0,19,1,27,3r-5,27v-43,-14,-46,38,-54,71r40,0r-4,24r-41,0r-27,134v-7,48,-36,68,-86,59r6,-28v24,6,37,-1,43,-28r28,-137r-38,0","w":172},"\u00a7":{"d":"130,-94v-4,-35,-41,-38,-64,-55v-10,7,-24,16,-23,31v2,25,50,38,69,54v8,-8,20,-16,18,-30xm153,-206r-39,0v0,-18,-10,-27,-28,-27v-37,0,-35,38,-1,54v32,15,80,35,80,80v0,21,-12,39,-29,50v43,36,11,105,-48,105v-48,0,-70,-28,-70,-66r39,0v0,20,9,35,31,35v15,0,27,-10,27,-27v0,-57,-108,-45,-106,-111v0,-24,15,-42,33,-52v-47,-28,-15,-97,45,-97v53,0,66,32,66,56","w":173},"\u00a4":{"d":"2,-57r19,-18v-22,-26,-22,-74,0,-100r-19,-18r16,-17r19,19v27,-22,72,-22,99,0r18,-19r17,17r-19,18v22,27,22,73,0,100r19,18r-17,17r-18,-19v-27,23,-72,22,-99,0r-19,19xm86,-69v30,0,54,-24,54,-56v0,-32,-24,-56,-54,-56v-30,0,-54,24,-54,56v0,32,24,56,54,56","w":172},"'":{"d":"28,-154r0,-103r31,0r0,103r-31,0","w":86},"\u201c":{"d":"24,-154v1,-50,-8,-95,41,-103r0,21v-12,3,-19,16,-18,34r18,0r0,48r-41,0xm88,-154v1,-50,-8,-95,41,-103r0,21v-12,3,-19,16,-18,34r18,0r0,48r-41,0","w":153,"k":{"A":20}},"\u00ab":{"d":"77,-84r0,-41r52,-48r0,39r-32,30r32,29r0,40xm18,-84r0,-41r52,-48r0,39r-32,30r32,29r0,40","w":146},"\u2039":{"d":"17,-84r0,-41r52,-48r0,39r-32,30r32,29r0,40","w":86},"\u203a":{"d":"69,-125r0,41r-52,49r0,-40r32,-29r-32,-30r0,-39","w":86},"\ufb01":{"d":"121,0r0,-194r38,0r0,194r-38,0xm121,-221r0,-39r38,0r0,39r-38,0xm31,0r0,-165r-27,0r0,-29r27,0v-6,-53,19,-73,70,-65r0,30v-26,-3,-36,8,-32,35r32,0r0,29r-32,0r0,165r-38,0","w":180},"\ufb02":{"d":"121,0r0,-257r38,0r0,257r-38,0xm31,0r0,-165r-27,0r0,-29r27,0v-6,-53,19,-73,70,-65r0,30v-26,-3,-36,8,-32,35r32,0r0,29r-32,0r0,165r-38,0","w":180},"\u2013":{"d":"0,-87r0,-34r180,0r0,34r-180,0","w":180},"\u2020":{"d":"67,-184r0,-73r39,0r0,73r62,0r0,32r-62,0r0,203r-39,0r0,-203r-61,0r0,-32r61,0","w":173},"\u2021":{"d":"67,-187r0,-70r39,0r0,70r62,0r0,31r-62,0r0,105r62,0r0,30r-62,0r0,72r-39,0r0,-72r-62,0r0,-30r62,0r0,-105r-62,0r0,-31r62,0","w":173},"\u00b7":{"d":"17,-111v0,-14,12,-26,26,-26v14,0,26,12,26,26v0,14,-12,26,-26,26v-14,0,-26,-12,-26,-26","w":86},"\u2219":{"d":"17,-111v0,-14,12,-26,26,-26v14,0,26,12,26,26v0,14,-12,26,-26,26v-14,0,-26,-12,-26,-26","w":86},"\u00b6":{"d":"159,51r0,-284r-39,0r0,284r-33,0r0,-175v-37,0,-68,-27,-68,-65v0,-80,94,-68,173,-68r0,308r-33,0","w":216},"\u2022":{"d":"26,-129v0,-35,29,-64,64,-64v35,0,64,29,64,64v0,35,-29,65,-64,65v-35,0,-64,-30,-64,-65","w":180},"\u201a":{"d":"23,0r0,-48r41,0v-1,50,8,95,-41,103r0,-20v12,-3,19,-17,18,-35r-18,0","w":86},"\u201e":{"d":"88,0r0,-48r41,0v-1,50,8,95,-41,103r0,-20v12,-3,19,-17,18,-35r-18,0xm24,0r0,-48r41,0v-1,50,8,95,-41,103r0,-20v12,-3,19,-17,18,-35r-18,0","w":153},"\u201d":{"d":"88,-210r0,-47r41,0v-1,50,8,95,-41,103r0,-21v13,-3,19,-16,18,-35r-18,0xm24,-210r0,-47r41,0v-1,50,8,95,-41,103r0,-21v13,-3,19,-16,18,-35r-18,0","w":153,"k":{" ":13}},"\u00bb":{"d":"70,-125r0,41r-52,49r0,-40r32,-29r-32,-30r0,-39xm129,-125r0,41r-52,49r0,-40r31,-29r-31,-30r0,-39","w":146},"\u2026":{"d":"40,0r0,-48r41,0r0,48r-41,0xm159,0r0,-48r42,0r0,48r-42,0xm279,0r0,-48r41,0r0,48r-41,0","w":360},"\u2030":{"d":"322,-111v-15,0,-19,14,-19,47v0,33,4,47,19,47v15,0,18,-14,18,-47v0,-33,-3,-47,-18,-47xm175,-255r28,0r-115,260r-27,0xm58,-233v-15,0,-18,14,-18,47v0,33,3,47,18,47v15,0,19,-14,19,-47v0,-33,-4,-47,-19,-47xm322,-133v28,0,49,15,49,69v0,54,-21,69,-49,69v-28,0,-49,-15,-49,-69v0,-54,21,-69,49,-69xm58,-255v28,0,50,15,50,69v0,54,-22,69,-50,69v-28,0,-49,-15,-49,-69v0,-54,21,-69,49,-69xm207,-111v-15,0,-18,14,-18,47v0,33,3,47,18,47v15,0,18,-14,18,-47v0,-33,-3,-47,-18,-47xm207,-133v28,0,49,15,49,69v0,54,-21,69,-49,69v-28,0,-49,-15,-49,-69v0,-54,21,-69,49,-69","w":380},"\u00bf":{"d":"106,-125v11,70,-50,67,-52,124v0,20,7,38,29,38v24,0,32,-20,32,-50r39,0v0,45,-19,81,-71,81v-45,0,-70,-25,-70,-69v1,-70,65,-66,56,-124r37,0xm108,-194r0,41r-41,0r0,-41r41,0","w":166},"`":{"d":"33,-219r-38,-52r43,0r22,52r-27,0"},"\u00b4":{"d":"20,-219r22,-52r43,0r-38,52r-27,0"},"\u02c6":{"d":"-12,-219r33,-52r39,0r32,52r-33,0r-19,-32r-21,32r-31,0"},"\u02dc":{"d":"22,-265v15,0,48,28,50,-1r22,0v0,16,-10,43,-31,43v-22,-1,-51,-29,-55,2r-22,0v0,-15,9,-44,36,-44"},"\u00af":{"d":"-11,-257r102,0r0,22r-102,0r0,-22"},"\u02c9":{"d":"-11,-257r102,0r0,22r-102,0r0,-22"},"\u02d8":{"d":"-8,-267r22,0v0,9,9,24,26,24v17,0,26,-15,26,-24r22,0v0,27,-17,48,-48,48v-31,0,-48,-21,-48,-48"},"\u02d9":{"d":"23,-226r0,-39r34,0r0,39r-34,0"},"\u00a8":{"d":"53,-226r0,-39r34,0r0,39r-34,0xm-7,-226r0,-39r34,0r0,39r-34,0"},"\u02da":{"d":"20,-252v0,11,9,21,20,21v11,0,20,-10,20,-21v0,-11,-9,-20,-20,-20v-11,0,-20,9,-20,20xm2,-252v0,-21,17,-38,38,-38v21,0,38,17,38,38v0,21,-17,39,-38,39v-21,0,-38,-18,-38,-39"},"\u00b8":{"d":"35,0r18,0r-15,21v20,-7,42,5,42,24v0,33,-51,39,-78,27r6,-15v13,5,42,11,43,-9v1,-20,-30,-5,-36,-17"},"\u02dd":{"d":"-23,-219r22,-52r43,0r-38,52r-27,0xm49,-219r22,-52r43,0r-38,52r-27,0"},"\u02db":{"d":"9,46v2,-20,18,-49,53,-46v-19,17,-25,31,-25,41v-1,20,19,25,37,18r2,16v-29,7,-68,4,-67,-29"},"\u02c7":{"d":"20,-219r-32,-52r33,0r19,32r21,-32r31,0r-33,52r-39,0"},"\u2014":{"d":"0,-87r0,-34r360,0r0,34r-360,0","w":360},"\u00c6":{"d":"72,-96r49,0r0,-128r-3,0xm-4,0r98,-257r157,0r0,35r-91,0r0,71r86,0r0,34r-86,0r0,82r95,0r0,35r-134,0r0,-63r-60,0r-22,63r-43,0","w":266},"\u00aa":{"d":"3,-165v0,-36,27,-34,52,-42v19,-1,24,-28,-1,-28v-17,0,-19,10,-19,18r-26,0v0,-24,11,-38,49,-38v24,0,42,8,42,29r0,63v-1,7,5,11,11,8r0,20v-14,7,-36,2,-38,-14v-14,27,-70,22,-70,-16xm71,-197v-13,8,-41,8,-37,30v0,6,5,13,15,13v21,0,24,-20,22,-43","w":113},"\u0141":{"d":"17,0r0,-94r-21,14r0,-35r21,-14r0,-128r41,0r0,100r52,-37r0,36r-52,36r0,87r99,0r0,35r-140,0","w":159},"\u00d8":{"d":"139,-193v-24,49,-43,103,-66,154v7,10,17,13,27,13v24,0,44,-15,44,-104v0,-28,-2,-49,-5,-63xm62,-64v24,-49,43,-104,65,-155v-8,-10,-17,-12,-27,-12v-24,0,-44,15,-44,101v0,29,2,51,6,66xm49,19r-18,-9r11,-28v-19,-21,-27,-58,-27,-111v0,-112,48,-154,126,-123r10,-23r19,8r-12,28v19,21,27,57,27,110v0,112,-48,155,-126,124","w":200},"\u0152":{"d":"144,0v-1,-6,2,-14,-1,-18v-10,16,-29,23,-49,23v-53,0,-79,-41,-79,-134v0,-92,26,-133,80,-133v23,-1,38,9,49,21r0,-16r127,0r0,35r-91,0r0,71r86,0r0,34r-86,0r0,82r94,0r0,35r-130,0xm141,-85v0,-51,9,-157,-38,-146v-27,0,-47,15,-47,101v0,89,20,104,44,104v24,0,41,-10,41,-59","w":286},"\u00ba":{"d":"57,-132v-40,0,-52,-25,-52,-61v0,-37,12,-62,52,-62v40,0,52,25,52,62v0,36,-12,61,-52,61xm57,-154v18,0,21,-18,21,-39v0,-22,-3,-40,-21,-40v-18,0,-21,18,-21,40v0,21,3,39,21,39","w":113},"\u00e6":{"d":"144,-118r57,0v1,-28,-3,-55,-28,-54v-26,1,-30,32,-29,54xm240,-92r-97,0v-1,33,2,70,29,70v28,0,31,-31,31,-43r36,0v0,43,-26,70,-68,70v-38,0,-48,-23,-53,-35v-19,51,-107,48,-107,-19v0,-56,39,-57,79,-68v13,-3,16,-7,16,-26v0,-18,-6,-29,-24,-29v-26,0,-29,18,-29,37r-37,0v0,-41,17,-64,68,-64v32,0,43,18,46,25v9,-16,26,-25,47,-25v56,-1,65,46,63,107xm73,-24v34,0,36,-38,34,-75v-4,5,-19,8,-29,11v-26,7,-28,20,-28,37v0,14,9,27,23,27","w":253},"\u0131":{"d":"21,0r0,-194r38,0r0,194r-38,0"},"\u0142":{"d":"21,0r0,-103r-21,14r0,-34r21,-15r0,-119r38,0r0,93r21,-15r0,35r-21,14r0,130r-38,0"},"\u00f8":{"d":"103,-162v-35,-24,-53,11,-53,65v0,16,1,30,3,42xm114,-139v-19,33,-33,72,-50,107v34,25,53,-12,53,-65v0,-16,-1,-30,-3,-42xm21,13r13,-27v-39,-46,-37,-185,49,-185v13,0,25,2,34,7r10,-23r18,9r-12,26v39,46,38,185,-50,185v-13,0,-24,-2,-33,-7r-11,24","w":166},"\u0153":{"d":"152,-118r58,0v1,-28,-3,-55,-28,-54v-26,1,-31,31,-30,54xm211,-65r37,0v0,43,-26,70,-68,70v-36,0,-46,-25,-48,-31v-11,22,-29,31,-53,31v-52,0,-68,-42,-68,-102v0,-60,16,-102,71,-102v36,0,46,18,53,30v12,-20,27,-30,51,-30v56,-1,65,46,63,107r-97,0v-1,32,1,70,28,70v28,0,31,-31,31,-43xm50,-97v0,43,5,73,32,73v28,0,33,-30,33,-73v0,-43,-5,-73,-33,-73v-27,0,-32,30,-32,73","w":259},"\u00df":{"d":"75,2r0,-31v33,3,46,-14,46,-50v0,-39,-14,-55,-45,-52r0,-28v18,1,36,-5,36,-36v0,-21,-7,-36,-29,-36v-21,0,-28,13,-28,36r0,195r-39,0r0,-192v0,-45,23,-68,68,-68v33,0,67,13,67,59v1,29,-12,46,-36,54v37,4,47,36,47,67v0,55,-26,88,-87,82","w":173},"\u00b9":{"d":"47,-101r0,-110r-33,0r0,-20v19,0,39,-2,42,-24r22,0r0,154r-31,0","w":112},"\u00ac":{"d":"168,-38r0,-75r-151,0r0,-31r182,0r0,106r-31,0","w":216},"\u00b5":{"d":"19,63r0,-257r39,0r0,133v0,25,8,35,27,35v16,0,31,-13,31,-38r0,-130r38,0r0,194r-36,0v-1,-7,2,-18,-1,-23v-13,22,-38,36,-59,22r0,64r-39,0","w":173},"\u03bc":{"d":"19,63r0,-257r39,0r0,133v0,25,8,35,27,35v16,0,31,-13,31,-38r0,-130r38,0r0,194r-36,0v-1,-7,2,-18,-1,-23v-13,22,-38,36,-59,22r0,64r-39,0","w":173},"\u2122":{"d":"56,-109r0,-124r-44,0r0,-24r119,0r0,24r-44,0r0,124r-31,0xm298,-109r-1,-117r-43,117r-20,0r-45,-117r0,117r-28,0r0,-148r42,0r41,105r40,-105r43,0r0,148r-29,0","w":360},"\u00d0":{"d":"21,0r0,-120r-21,0r0,-29r21,0r0,-108r73,0v81,0,91,52,91,128v0,76,-10,129,-91,129r-73,0xm62,-31v67,3,82,-3,82,-98v0,-91,-15,-101,-82,-97r0,77r43,0r0,29r-43,0r0,89","w":200},"\u00bd":{"d":"27,11r151,-272r27,0r-152,272r-26,0xm36,-101r0,-110r-32,0v1,-6,-3,-17,2,-20v16,0,37,-3,39,-24r22,0r0,154r-31,0xm247,0r-99,0v0,-72,70,-68,70,-111v0,-13,-7,-21,-19,-21v-17,0,-20,17,-20,28r-31,0v0,-30,14,-50,52,-50v36,0,49,17,49,41v0,49,-54,53,-68,89r66,0r0,24","w":259},"\u00b1":{"d":"93,-128r0,-54r30,0r0,54r76,0r0,31r-76,0r0,55r-30,0r0,-55r-76,0r0,-31r76,0xm17,0r0,-31r182,0r0,31r-182,0","w":216},"\u00de":{"d":"62,-177r0,89v40,2,67,1,70,-44v2,-39,-28,-49,-70,-45xm21,0r0,-257r41,0r0,49v68,-7,112,15,112,75v0,60,-45,83,-112,76r0,57r-41,0","w":180},"\u00bc":{"d":"196,0r0,-34r-59,0r0,-22r57,-98r31,0r0,100r18,0r0,20r-18,0r0,34r-29,0xm196,-54v-1,-21,2,-47,-1,-66r-37,66r38,0xm27,11r151,-272r27,0r-152,272r-26,0xm36,-101r0,-110r-32,0v1,-6,-3,-17,2,-20v16,0,37,-3,39,-24r22,0r0,154r-31,0","w":259},"\u00f7":{"d":"82,-17v0,-14,12,-26,26,-26v14,0,26,12,26,26v0,14,-12,26,-26,26v-14,0,-26,-12,-26,-26xm17,-76r0,-31r182,0r0,31r-182,0xm82,-165v0,-14,12,-26,26,-26v14,0,26,12,26,26v0,14,-12,26,-26,26v-14,0,-26,-12,-26,-26","w":216},"\u00a6":{"d":"24,5r0,-100r31,0r0,100r-31,0xm24,-162r0,-100r31,0r0,100r-31,0"},"\u00b0":{"d":"18,-201v0,-30,24,-54,54,-54v30,0,54,24,54,54v0,30,-24,53,-54,53v-30,0,-54,-23,-54,-53xm43,-201v0,16,13,29,29,29v16,0,29,-13,29,-29v0,-16,-13,-29,-29,-29v-16,0,-29,13,-29,29","w":144},"\u00fe":{"d":"19,63r0,-320r39,0r0,86v7,-17,23,-28,44,-28v42,0,60,38,60,105v0,81,-33,99,-60,99v-21,0,-37,-11,-44,-28r0,86r-39,0xm55,-99v0,46,7,73,34,73v22,0,32,-16,32,-70v0,-44,-6,-72,-33,-72v-27,0,-33,28,-33,69","w":173},"\u00be":{"d":"196,0r0,-34r-59,0r0,-22r57,-98r31,0r0,100r18,0r0,20r-18,0r0,34r-29,0xm196,-54v-1,-21,2,-47,-1,-66r-37,66r38,0xm39,11r151,-272r27,0r-151,272r-27,0xm32,-170r0,-22v20,3,33,-7,33,-21v0,-9,-5,-20,-18,-20v-14,0,-19,13,-19,22r-31,0v0,-29,20,-44,52,-44v22,0,47,12,47,39v1,17,-15,30,-29,35v18,1,33,13,33,35v0,30,-23,48,-54,48v-35,0,-52,-14,-52,-46r31,0v0,9,4,23,21,23v16,0,23,-12,23,-25v0,-18,-14,-26,-37,-24","w":259},"\u00b2":{"d":"105,-125r0,24r-99,0v0,-72,70,-68,70,-111v0,-13,-7,-21,-19,-21v-17,0,-20,17,-20,28r-31,0v0,-30,14,-50,52,-50v36,0,49,17,49,41v0,49,-54,53,-68,89r66,0","w":112},"\u00ae":{"d":"175,-52r-39,-65r-23,0r0,65r-27,0r0,-153v52,0,117,-9,117,44v0,28,-17,39,-39,43r42,66r-31,0xm113,-139v28,-1,63,7,63,-23v0,-28,-36,-20,-63,-21r0,44xm144,-24v56,0,101,-47,101,-105v0,-58,-45,-104,-101,-104v-56,0,-101,46,-101,104v0,58,45,105,101,105xm10,-129v0,-74,60,-133,134,-133v74,0,134,59,134,133v0,74,-60,134,-134,134v-74,0,-134,-60,-134,-134","w":288},"\u2212":{"d":"17,-76r0,-31r182,0r0,31r-182,0","w":216},"\u00f0":{"d":"50,-97v0,49,5,73,33,73v28,0,34,-24,34,-73v0,-38,-6,-68,-34,-68v-28,0,-33,30,-33,68xm34,-215r-13,-13r31,-17v-8,-8,-16,-14,-23,-19r28,-15v8,5,16,11,24,18r33,-18r11,13r-31,17v48,45,62,83,62,152v0,60,-19,102,-73,102v-54,0,-72,-42,-72,-102v0,-74,46,-117,97,-86v-9,-14,-26,-33,-43,-50","w":166},"\u00d7":{"d":"88,-91r-63,-63r20,-20r63,63r63,-63r20,20r-63,63r63,63r-20,20r-63,-63r-63,63r-20,-20","w":216},"\u00b3":{"d":"42,-170r0,-22v20,3,32,-8,32,-21v0,-9,-5,-20,-18,-20v-14,0,-19,13,-19,22r-31,0v0,-29,20,-44,52,-44v22,0,47,12,47,39v1,17,-15,30,-29,35v18,1,33,13,33,35v0,30,-22,48,-53,48v-35,0,-52,-14,-52,-46r31,0v0,9,4,23,21,23v16,0,22,-12,22,-25v0,-18,-13,-26,-36,-24","w":112},"\u00a9":{"d":"184,-105r29,0v-6,36,-33,57,-68,57v-44,0,-72,-32,-72,-81v0,-89,128,-111,139,-25r-28,0v-4,-17,-17,-29,-37,-29v-28,0,-43,24,-43,54v0,54,70,76,80,24xm144,-24v56,0,101,-47,101,-105v0,-58,-45,-104,-101,-104v-56,0,-101,46,-101,104v0,58,45,105,101,105xm10,-129v0,-74,60,-133,134,-133v74,0,134,59,134,133v0,74,-60,134,-134,134v-74,0,-134,-60,-134,-134","w":288},"\u00c1":{"d":"64,-96r61,0r-31,-126xm-3,0r73,-257r52,0r68,257r-43,0r-16,-63r-75,0r-16,63r-43,0xm76,-271r22,-52r43,0r-38,52r-27,0","w":186},"\u00c2":{"d":"64,-96r61,0r-31,-126xm-3,0r73,-257r52,0r68,257r-43,0r-16,-63r-75,0r-16,63r-43,0xm44,-271r33,-52r39,0r32,52r-33,0r-19,-32r-21,32r-31,0","w":186},"\u00c4":{"d":"64,-96r61,0r-31,-126xm-3,0r73,-257r52,0r68,257r-43,0r-16,-63r-75,0r-16,63r-43,0xm109,-279r0,-39r34,0r0,39r-34,0xm49,-279r0,-39r35,0r0,39r-35,0","w":186},"\u00c0":{"d":"64,-96r61,0r-31,-126xm-3,0r73,-257r52,0r68,257r-43,0r-16,-63r-75,0r-16,63r-43,0xm89,-271r-38,-52r43,0r22,52r-27,0","w":186},"\u00c5":{"d":"64,-96r61,0r-31,-126xm-3,0r73,-257r52,0r68,257r-43,0r-16,-63r-75,0r-16,63r-43,0xm76,-304v0,11,9,20,20,20v11,0,20,-9,20,-20v0,-11,-9,-20,-20,-20v-11,0,-20,9,-20,20xm58,-304v0,-21,17,-38,38,-38v21,0,38,17,38,38v0,21,-17,38,-38,38v-21,0,-38,-17,-38,-38","w":186},"\u00c3":{"d":"64,-96r61,0r-31,-126xm-3,0r73,-257r52,0r68,257r-43,0r-16,-63r-75,0r-16,63r-43,0xm78,-317v15,1,47,26,50,-1r22,0v0,16,-9,42,-30,42v0,0,-51,-28,-56,2r-22,0v0,-15,9,-43,36,-43","w":186},"\u00c7":{"d":"79,37v-13,-9,7,-21,11,-32v-57,-5,-75,-48,-75,-134v0,-92,20,-133,85,-133v75,0,78,53,78,85r-41,0v0,-27,-6,-54,-37,-54v-30,0,-44,18,-44,101v0,83,14,104,44,104v35,-1,38,-39,38,-66r41,0v1,49,-15,93,-72,97r-11,16v20,-7,42,5,42,24v0,33,-51,39,-78,27r6,-15v13,5,41,11,43,-9v1,-13,-18,-15,-30,-11","w":186},"\u00c9":{"d":"21,0r0,-257r139,0r0,35r-98,0r0,71r92,0r0,34r-92,0r0,82r101,0r0,35r-142,0xm71,-271r22,-52r43,0r-38,52r-27,0","w":173},"\u00ca":{"d":"21,0r0,-257r139,0r0,35r-98,0r0,71r92,0r0,34r-92,0r0,82r101,0r0,35r-142,0xm39,-271r33,-52r39,0r32,52r-33,0r-19,-32r-21,32r-31,0","w":173},"\u00cb":{"d":"21,0r0,-257r139,0r0,35r-98,0r0,71r92,0r0,34r-92,0r0,82r101,0r0,35r-142,0xm104,-279r0,-39r34,0r0,39r-34,0xm44,-279r0,-39r34,0r0,39r-34,0","w":173},"\u00c8":{"d":"21,0r0,-257r139,0r0,35r-98,0r0,71r92,0r0,34r-92,0r0,82r101,0r0,35r-142,0xm84,-271r-38,-52r43,0r22,52r-27,0","w":173},"\u00cd":{"d":"19,0r0,-257r41,0r0,257r-41,0xm20,-271r22,-52r43,0r-38,52r-27,0"},"\u00ce":{"d":"19,0r0,-257r41,0r0,257r-41,0xm-12,-271r33,-52r39,0r32,52r-33,0r-19,-32r-21,32r-31,0"},"\u00cf":{"d":"19,0r0,-257r41,0r0,257r-41,0xm53,-279r0,-39r34,0r0,39r-34,0xm-7,-279r0,-39r34,0r0,39r-34,0"},"\u00cc":{"d":"19,0r0,-257r41,0r0,257r-41,0xm33,-271r-38,-52r43,0r22,52r-27,0"},"\u00d1":{"d":"21,0r0,-257r50,0r76,191r0,-191r38,0r0,257r-50,0r-75,-197r0,197r-39,0xm85,-317v15,0,48,27,50,-1r23,0v0,16,-10,42,-31,42v-22,0,-51,-27,-56,2r-22,0v0,-15,9,-43,36,-43","w":206},"\u00d3":{"d":"100,5v-59,0,-85,-42,-85,-134v0,-92,26,-133,85,-133v59,0,85,41,85,133v0,92,-26,134,-85,134xm100,-26v24,0,44,-15,44,-104v0,-86,-20,-101,-44,-101v-24,0,-44,15,-44,101v0,89,20,104,44,104xm80,-271r22,-52r43,0r-38,52r-27,0","w":200},"\u00d4":{"d":"100,5v-59,0,-85,-42,-85,-134v0,-92,26,-133,85,-133v59,0,85,41,85,133v0,92,-26,134,-85,134xm100,-26v24,0,44,-15,44,-104v0,-86,-20,-101,-44,-101v-24,0,-44,15,-44,101v0,89,20,104,44,104xm48,-271r33,-52r39,0r32,52r-33,0r-19,-32r-21,32r-31,0","w":200},"\u00d6":{"d":"100,5v-59,0,-85,-42,-85,-134v0,-92,26,-133,85,-133v59,0,85,41,85,133v0,92,-26,134,-85,134xm100,-26v24,0,44,-15,44,-104v0,-86,-20,-101,-44,-101v-24,0,-44,15,-44,101v0,89,20,104,44,104xm113,-279r0,-39r34,0r0,39r-34,0xm53,-279r0,-39r34,0r0,39r-34,0","w":200},"\u00d2":{"d":"100,5v-59,0,-85,-42,-85,-134v0,-92,26,-133,85,-133v59,0,85,41,85,133v0,92,-26,134,-85,134xm100,-26v24,0,44,-15,44,-104v0,-86,-20,-101,-44,-101v-24,0,-44,15,-44,101v0,89,20,104,44,104xm93,-271r-38,-52r43,0r22,52r-27,0","w":200},"\u00d5":{"d":"100,5v-59,0,-85,-42,-85,-134v0,-92,26,-133,85,-133v59,0,85,41,85,133v0,92,-26,134,-85,134xm100,-26v24,0,44,-15,44,-104v0,-86,-20,-101,-44,-101v-24,0,-44,15,-44,101v0,89,20,104,44,104xm82,-317v15,1,47,26,50,-1r22,0v0,16,-10,42,-31,42v0,0,-50,-27,-55,2r-22,0v0,-15,9,-43,36,-43","w":200},"\u0160":{"d":"12,-80r41,0v-2,34,12,55,42,54v26,0,39,-18,39,-37v2,-40,-36,-45,-65,-56v-37,-14,-54,-33,-54,-70v0,-47,32,-73,80,-73v68,0,73,40,73,73r-41,0v1,-26,-8,-42,-36,-42v-18,0,-34,10,-34,37v0,32,38,45,66,54v36,13,52,33,52,68v0,55,-33,77,-85,77v-67,0,-79,-42,-78,-85xm74,-271r-32,-52r33,0r19,31r20,-31r31,0r-32,52r-39,0","w":186},"\u00da":{"d":"18,-257r41,0r0,184v0,32,13,47,38,47v24,0,37,-15,37,-47r0,-184r41,0r0,181v0,59,-29,81,-78,81v-49,0,-79,-22,-79,-81r0,-181xm77,-271r22,-52r43,0r-38,52r-27,0","w":193},"\u00db":{"d":"18,-257r41,0r0,184v0,32,13,47,38,47v24,0,37,-15,37,-47r0,-184r41,0r0,181v0,59,-29,81,-78,81v-49,0,-79,-22,-79,-81r0,-181xm45,-271r33,-52r39,0r32,52r-33,0r-20,-32r-20,32r-31,0","w":193},"\u00dc":{"d":"18,-257r41,0r0,184v0,32,13,47,38,47v24,0,37,-15,37,-47r0,-184r41,0r0,181v0,59,-29,81,-78,81v-49,0,-79,-22,-79,-81r0,-181xm109,-279r0,-39r35,0r0,39r-35,0xm50,-279r0,-39r34,0r0,39r-34,0","w":193},"\u00d9":{"d":"18,-257r41,0r0,184v0,32,13,47,38,47v24,0,37,-15,37,-47r0,-184r41,0r0,181v0,59,-29,81,-78,81v-49,0,-79,-22,-79,-81r0,-181xm90,-271r-38,-52r43,0r22,52r-27,0","w":193},"\u00dd":{"d":"65,0r0,-100r-66,-157r45,0r43,111r45,-111r43,0r-69,157r0,100r-41,0xm67,-271r22,-52r43,0r-38,52r-27,0","w":173},"\u0178":{"d":"65,0r0,-100r-66,-157r45,0r43,111r45,-111r43,0r-69,157r0,100r-41,0xm99,-279r0,-39r35,0r0,39r-35,0xm40,-279r0,-39r34,0r0,39r-34,0","w":173},"\u017d":{"d":"6,0r0,-32r108,-190r-101,0r0,-35r146,0r0,35r-108,187r109,0r0,35r-154,0xm64,-271r-32,-52r32,0r20,31r20,-31r31,0r-32,52r-39,0","w":166},"\u00e1":{"d":"146,-151r0,111v-1,9,8,16,16,12r0,25v-19,10,-50,4,-52,-20v-20,44,-99,37,-99,-26v0,-57,36,-57,75,-69v14,-4,23,-8,23,-25v0,-18,-6,-29,-27,-29v-26,0,-29,18,-29,37r-37,0v0,-41,17,-64,68,-64v34,0,62,14,62,48xm109,-102v-20,15,-59,12,-59,49v0,16,8,29,24,29v34,2,37,-40,35,-78xm64,-219r21,-52r44,0r-39,52r-26,0","w":166},"\u00e2":{"d":"146,-151r0,111v-1,9,8,16,16,12r0,25v-19,10,-50,4,-52,-20v-20,44,-99,37,-99,-26v0,-57,36,-57,75,-69v14,-4,23,-8,23,-25v0,-18,-6,-29,-27,-29v-26,0,-29,18,-29,37r-37,0v0,-41,17,-64,68,-64v34,0,62,14,62,48xm109,-102v-20,15,-59,12,-59,49v0,16,8,29,24,29v34,2,37,-40,35,-78xm32,-219r32,-52r39,0r32,52r-32,0r-20,-32r-20,32r-31,0","w":166},"\u00e4":{"d":"146,-151r0,111v-1,9,8,16,16,12r0,25v-19,10,-50,4,-52,-20v-20,44,-99,37,-99,-26v0,-57,36,-57,75,-69v14,-4,23,-8,23,-25v0,-18,-6,-29,-27,-29v-26,0,-29,18,-29,37r-37,0v0,-41,17,-64,68,-64v34,0,62,14,62,48xm109,-102v-20,15,-59,12,-59,49v0,16,8,29,24,29v34,2,37,-40,35,-78xm96,-226r0,-39r35,0r0,39r-35,0xm36,-226r0,-39r35,0r0,39r-35,0","w":166},"\u00e0":{"d":"146,-151r0,111v-1,9,8,16,16,12r0,25v-19,10,-50,4,-52,-20v-20,44,-99,37,-99,-26v0,-57,36,-57,75,-69v14,-4,23,-8,23,-25v0,-18,-6,-29,-27,-29v-26,0,-29,18,-29,37r-37,0v0,-41,17,-64,68,-64v34,0,62,14,62,48xm109,-102v-20,15,-59,12,-59,49v0,16,8,29,24,29v34,2,37,-40,35,-78xm77,-219r-38,-52r43,0r21,52r-26,0","w":166},"\u00e5":{"d":"146,-151r0,111v-1,9,8,16,16,12r0,25v-19,10,-50,4,-52,-20v-20,44,-99,37,-99,-26v0,-57,36,-57,75,-69v14,-4,23,-8,23,-25v0,-18,-6,-29,-27,-29v-26,0,-29,18,-29,37r-37,0v0,-41,17,-64,68,-64v34,0,62,14,62,48xm109,-102v-20,15,-59,12,-59,49v0,16,8,29,24,29v34,2,37,-40,35,-78xm63,-252v0,11,10,21,21,21v11,0,20,-10,20,-21v0,-11,-9,-20,-20,-20v-11,0,-21,9,-21,20xm45,-252v0,-21,18,-38,39,-38v21,0,38,17,38,38v0,21,-17,39,-38,39v-21,0,-39,-18,-39,-39","w":166},"\u00e3":{"d":"146,-151r0,111v-1,9,8,16,16,12r0,25v-19,10,-50,4,-52,-20v-20,44,-99,37,-99,-26v0,-57,36,-57,75,-69v14,-4,23,-8,23,-25v0,-18,-6,-29,-27,-29v-26,0,-29,18,-29,37r-37,0v0,-41,17,-64,68,-64v34,0,62,14,62,48xm109,-102v-20,15,-59,12,-59,49v0,16,8,29,24,29v34,2,37,-40,35,-78xm66,-265v15,0,48,28,50,-1r22,0v0,16,-10,43,-31,43v-22,-1,-51,-28,-56,2r-22,0v0,-15,10,-44,37,-44","w":166},"\u00e7":{"d":"66,37v-15,-8,6,-22,10,-33v-50,-3,-65,-44,-65,-101v0,-60,16,-102,72,-102v58,0,67,46,67,70r-39,0v0,-18,-5,-41,-28,-41v-28,0,-33,30,-33,73v0,43,5,73,33,73v22,0,30,-18,30,-47r36,0v-2,42,-15,71,-55,75r-12,17v20,-7,43,5,43,24v0,32,-52,39,-79,27r6,-15v13,5,42,11,44,-9v0,-13,-19,-15,-30,-11","w":159},"\u00e9":{"d":"153,-92r-101,0v0,32,0,70,33,70v28,0,31,-31,31,-43r36,0v0,43,-26,70,-68,70v-32,0,-71,-9,-71,-99v0,-51,11,-105,72,-105v61,0,70,45,68,107xm52,-118r62,0v1,-28,-3,-54,-29,-54v-26,0,-34,27,-33,54xm68,-219r22,-52r43,0r-38,52r-27,0","w":166},"\u00ea":{"d":"153,-92r-101,0v0,32,0,70,33,70v28,0,31,-31,31,-43r36,0v0,43,-26,70,-68,70v-32,0,-71,-9,-71,-99v0,-51,11,-105,72,-105v61,0,70,45,68,107xm52,-118r62,0v1,-28,-3,-54,-29,-54v-26,0,-34,27,-33,54xm36,-219r33,-52r39,0r32,52r-33,0r-20,-32r-20,32r-31,0","w":166},"\u00eb":{"d":"153,-92r-101,0v0,32,0,70,33,70v28,0,31,-31,31,-43r36,0v0,43,-26,70,-68,70v-32,0,-71,-9,-71,-99v0,-51,11,-105,72,-105v61,0,70,45,68,107xm52,-118r62,0v1,-28,-3,-54,-29,-54v-26,0,-34,27,-33,54xm100,-226r0,-39r35,0r0,39r-35,0xm41,-226r0,-39r34,0r0,39r-34,0","w":166},"\u00e8":{"d":"153,-92r-101,0v0,32,0,70,33,70v28,0,31,-31,31,-43r36,0v0,43,-26,70,-68,70v-32,0,-71,-9,-71,-99v0,-51,11,-105,72,-105v61,0,70,45,68,107xm52,-118r62,0v1,-28,-3,-54,-29,-54v-26,0,-34,27,-33,54xm81,-219r-38,-52r43,0r22,52r-27,0","w":166},"\u00ed":{"d":"21,0r0,-194r38,0r0,194r-38,0xm20,-219r22,-52r43,0r-38,52r-27,0"},"\u00ee":{"d":"21,0r0,-194r38,0r0,194r-38,0xm-12,-219r33,-52r39,0r32,52r-33,0r-19,-32r-21,32r-31,0"},"\u00ef":{"d":"21,0r0,-194r38,0r0,194r-38,0xm53,-226r0,-39r34,0r0,39r-34,0xm-7,-226r0,-39r34,0r0,39r-34,0"},"\u00ec":{"d":"21,0r0,-194r38,0r0,194r-38,0xm33,-219r-38,-52r43,0r22,52r-27,0"},"\u00f1":{"d":"19,0r0,-194r36,0v1,7,-3,20,2,23v20,-40,97,-43,97,25r0,146r-38,0r0,-133v0,-25,-8,-35,-27,-35v-16,0,-31,13,-31,38r0,130r-39,0xm69,-265v15,0,48,28,50,-1r22,0v0,16,-10,43,-31,43v-22,-1,-51,-29,-55,2r-23,0v0,-15,10,-44,37,-44","w":173},"\u00f3":{"d":"11,-97v0,-60,16,-102,72,-102v57,0,73,42,73,102v0,60,-19,102,-73,102v-54,0,-72,-42,-72,-102xm50,-97v0,49,5,73,33,73v28,0,34,-24,34,-73v0,-43,-6,-73,-34,-73v-28,0,-33,30,-33,73xm64,-219r21,-52r44,0r-39,52r-26,0","w":166},"\u00f4":{"d":"11,-97v0,-60,16,-102,72,-102v57,0,73,42,73,102v0,60,-19,102,-73,102v-54,0,-72,-42,-72,-102xm50,-97v0,49,5,73,33,73v28,0,34,-24,34,-73v0,-43,-6,-73,-34,-73v-28,0,-33,30,-33,73xm32,-219r32,-52r39,0r32,52r-32,0r-20,-32r-20,32r-31,0","w":166},"\u00f6":{"d":"11,-97v0,-60,16,-102,72,-102v57,0,73,42,73,102v0,60,-19,102,-73,102v-54,0,-72,-42,-72,-102xm50,-97v0,49,5,73,33,73v28,0,34,-24,34,-73v0,-43,-6,-73,-34,-73v-28,0,-33,30,-33,73xm96,-226r0,-39r35,0r0,39r-35,0xm36,-226r0,-39r35,0r0,39r-35,0","w":166},"\u00f2":{"d":"11,-97v0,-60,16,-102,72,-102v57,0,73,42,73,102v0,60,-19,102,-73,102v-54,0,-72,-42,-72,-102xm50,-97v0,49,5,73,33,73v28,0,34,-24,34,-73v0,-43,-6,-73,-34,-73v-28,0,-33,30,-33,73xm77,-219r-38,-52r43,0r21,52r-26,0","w":166},"\u00f5":{"d":"11,-97v0,-60,16,-102,72,-102v57,0,73,42,73,102v0,60,-19,102,-73,102v-54,0,-72,-42,-72,-102xm50,-97v0,49,5,73,33,73v28,0,34,-24,34,-73v0,-43,-6,-73,-34,-73v-28,0,-33,30,-33,73xm66,-265v15,0,48,28,50,-1r22,0v0,16,-10,43,-31,43v-22,-1,-51,-28,-56,2r-22,0v0,-15,10,-44,37,-44","w":166},"\u0161":{"d":"139,-137r-37,0v1,-19,-3,-34,-25,-35v-15,0,-28,7,-28,25v0,24,32,30,52,37v29,10,42,25,42,56v0,41,-30,59,-69,59v-52,0,-65,-25,-64,-67r35,0v-1,25,6,40,30,40v39,0,41,-46,10,-56v-34,-11,-73,-22,-73,-67v0,-36,26,-54,66,-54v53,0,62,29,61,62xm57,-219r-32,-52r33,0r19,32r21,-32r31,0r-33,52r-39,0","w":153},"\u00fa":{"d":"118,0v-1,-7,2,-18,-1,-23v-25,40,-98,46,-98,-35r0,-136r39,0r0,139v0,22,9,29,26,29v17,0,32,-10,32,-32r0,-136r38,0r0,194r-36,0xm67,-219r22,-52r43,0r-38,52r-27,0","w":173},"\u00fb":{"d":"118,0v-1,-7,2,-18,-1,-23v-25,40,-98,46,-98,-35r0,-136r39,0r0,139v0,22,9,29,26,29v17,0,32,-10,32,-32r0,-136r38,0r0,194r-36,0xm35,-219r33,-52r39,0r32,52r-33,0r-20,-32r-20,32r-31,0","w":173},"\u00fc":{"d":"118,0v-1,-7,2,-18,-1,-23v-25,40,-98,46,-98,-35r0,-136r39,0r0,139v0,22,9,29,26,29v17,0,32,-10,32,-32r0,-136r38,0r0,194r-36,0xm99,-226r0,-39r35,0r0,39r-35,0xm40,-226r0,-39r34,0r0,39r-34,0","w":173},"\u00f9":{"d":"118,0v-1,-7,2,-18,-1,-23v-25,40,-98,46,-98,-35r0,-136r39,0r0,139v0,22,9,29,26,29v17,0,32,-10,32,-32r0,-136r38,0r0,194r-36,0xm80,-219r-38,-52r43,0r22,52r-27,0","w":173},"\u00fd":{"d":"3,-194r42,0r34,146r31,-146r40,0r-53,201v-16,60,-32,61,-83,58r0,-31v26,6,41,-7,44,-30xm57,-219r21,-52r44,0r-38,52r-27,0","w":153},"\u00ff":{"d":"3,-194r42,0r34,146r31,-146r40,0r-53,201v-16,60,-32,61,-83,58r0,-31v26,6,41,-7,44,-30xm89,-226r0,-39r35,0r0,39r-35,0xm30,-226r0,-39r34,0r0,39r-34,0","w":153},"\u017e":{"d":"9,0r0,-30r85,-131r-80,0r0,-33r124,0r0,32r-82,129r82,0r0,33r-129,0xm54,-219r-32,-52r32,0r20,32r20,-32r31,0r-32,52r-39,0","w":146},"\u20ac":{"d":"159,-243r0,36v-30,-26,-94,-15,-91,41r80,0r-9,28r-74,0r0,24r67,0r-9,29r-55,0v-1,58,60,68,91,42r0,37v-54,26,-125,5,-127,-79r-25,0r9,-29r13,0r0,-24r-22,0r9,-28r16,0v1,-75,70,-108,127,-77","w":172}}});
    /*!
     * The following copyright notice may not be removed under any circumstances.
     *
     * Copyright:
     * Copyright (c) 1990 Adobe Systems Incorporated.  All Rights Reserved.Helvetica
     * is a trademark of Linotype AG and/or its subsidiaries.
     *
     * Trademark:
     * Please refer to the Copyright section for the font trademark attribution
     * notices.
     *
     * Full name:
     * HelveticaNeue-LightCondObl
     */
    Cufon.registerFont({"w":66,"face":{"font-family":"HelveticaNeue Condensed","font-weight":300,"font-style":"italic","font-stretch":"condensed","units-per-em":"360","panose-1":"2 11 4 6 0 0 0 0 0 0","ascent":"287","descent":"-73","x-height":"4","bbox":"-60 -334 360 72.9331","underline-thickness":"18","underline-position":"-18","slope":"-12","stemh":"18","stemv":"22","unicode-range":"U+0020-U+FB02"},"glyphs":{" ":{"w":86,"k":{"\u201c":13,"\u2018":13,"Y":13,"W":13,"V":13,"T":13,"A":13}},"\u00a0":{"w":86},"!":{"d":"35,-67r-4,-190r24,0r-4,190r-16,0xm31,0r0,-37r24,0r0,37r-24,0","w":86},"\"":{"d":"26,-171r0,-86r21,0r0,86r-21,0xm80,-171r0,-86r21,0r0,86r-21,0","w":126},"#":{"d":"68,-153r-7,56r44,0r7,-56r-44,0xm1,-81r0,-16r42,0r7,-56r-40,0r0,-16r42,0r11,-82r18,0r-11,82r44,0r11,-82r18,0r-11,82r40,0r0,16r-42,0r-7,56r39,0r0,16r-41,0r-11,81r-18,0r11,-81r-44,0r-11,81r-18,0r11,-81r-40,0","w":172},"$":{"d":"79,-143r0,-92v-27,3,-41,21,-41,44v0,28,18,40,41,48xm95,-116r0,101v26,-3,44,-20,44,-51v0,-30,-20,-41,-44,-50xm79,4v-46,-3,-71,-30,-69,-81r23,0v-2,36,13,59,46,62r0,-106v-32,-9,-64,-22,-64,-68v0,-37,23,-63,64,-66r0,-25r16,0r0,25v42,3,61,27,61,69r-24,0v0,-28,-11,-46,-37,-49r0,98v33,11,67,21,67,68v0,45,-26,69,-67,73r0,30r-16,0r0,-30","w":172},"%":{"d":"39,-189v0,39,10,51,25,51v15,0,26,-12,26,-51v0,-38,-11,-50,-26,-50v-15,0,-25,12,-25,50xm66,4r110,-259r18,0r-110,259r-18,0xm170,-62v0,39,10,50,25,50v15,0,26,-11,26,-50v0,-38,-11,-50,-26,-50v-15,0,-25,12,-25,50xm19,-189v0,-52,16,-66,45,-66v29,0,46,14,46,66v0,52,-17,67,-46,67v-29,0,-45,-15,-45,-67xm150,-62v0,-52,16,-66,45,-66v29,0,46,14,46,66v0,52,-17,66,-46,66v-29,0,-45,-14,-45,-66","w":259},"&":{"d":"171,0r-23,-31v-28,57,-140,40,-140,-33v0,-36,32,-64,58,-82v-40,-40,-41,-109,23,-111v30,0,50,19,50,47v0,21,-9,41,-46,67r56,77v6,-16,9,-32,9,-48r22,0v0,22,-6,45,-18,66r33,48r-24,0xm88,-239v-45,0,-31,52,-6,81v28,-22,35,-38,35,-52v0,-17,-12,-29,-29,-29xm137,-48r-60,-84v-36,25,-46,46,-46,66v0,61,85,66,106,18","w":193},"\u2019":{"d":"32,-220r0,-37r25,0v-1,39,6,73,-27,86v-2,-23,15,-21,12,-49r-10,0","w":86,"k":{"s":20,"\u2019":39}},"(":{"d":"67,-257r16,0v-56,97,-56,226,0,323r-16,0v-66,-118,-65,-205,0,-323","w":79},")":{"d":"13,66r-16,0v56,-97,56,-226,0,-323r16,0v65,118,64,205,0,323","w":79},"*":{"d":"52,-257r16,0r0,40r38,-12r5,15r-38,12r23,32r-12,10r-24,-33r-23,33r-13,-10r23,-32r-38,-12r5,-15r38,12r0,-40","w":120},"+":{"d":"99,0r0,-82r-82,0r0,-18r82,0r0,-82r18,0r0,82r82,0r0,18r-82,0r0,82r-18,0","w":216},",":{"d":"31,0r0,-37r24,0v-1,39,7,74,-26,87v-2,-24,15,-22,12,-50r-10,0","w":86,"k":{"\u201d":13,"\u2019":13," ":13}},"-":{"d":"21,-112r78,0r0,19r-78,0r0,-19","w":119},"\u00ad":{"d":"21,-112r78,0r0,19r-78,0r0,-19","w":119},".":{"d":"31,0r0,-37r24,0r0,37r-24,0","w":86,"k":{" ":13}},"\/":{"d":"84,-261r20,0r-88,265r-20,0","w":100},"0":{"d":"38,-125v0,82,13,111,48,111v35,0,49,-29,49,-111v0,-82,-14,-112,-49,-112v-35,0,-48,30,-48,112xm15,-125v0,-75,13,-130,71,-130v58,0,72,55,72,130v0,75,-14,129,-72,129v-58,0,-71,-54,-71,-129","w":172},"1":{"d":"83,0r0,-195r-59,0r0,-16v43,0,63,-17,64,-44r16,0r0,255r-21,0","w":172},"2":{"d":"40,-175r-23,0v1,-49,24,-80,72,-80v35,0,66,20,66,69v0,73,-109,100,-115,167r117,0r0,19r-141,0v-4,-54,44,-91,80,-121v26,-22,36,-40,36,-64v0,-34,-19,-52,-45,-52v-29,0,-46,20,-47,62","w":172},"3":{"d":"67,-123r0,-18v38,3,60,-14,60,-48v0,-30,-14,-48,-42,-48v-26,0,-45,17,-45,53r-23,0v0,-42,23,-71,68,-71v72,0,90,106,24,121v30,4,49,30,49,61v0,46,-25,77,-73,77v-44,0,-69,-24,-71,-72r23,0v0,30,15,54,48,54v26,0,50,-15,50,-58v0,-39,-27,-55,-68,-51","w":172},"4":{"d":"110,0r0,-66r-98,0r0,-21r98,-168r21,0r0,170r30,0r0,19r-30,0r0,66r-21,0xm31,-85r79,0r-1,-133","w":172},"5":{"d":"35,-251r111,0r0,20r-94,0r-11,90v39,-52,117,-25,117,58v0,51,-26,87,-76,87v-40,0,-67,-24,-67,-69r23,0v0,29,16,51,47,51v31,0,50,-25,50,-73v0,-61,-73,-86,-94,-33r-21,0","w":172},"6":{"d":"154,-195r-23,0v-1,-25,-16,-42,-41,-42v-35,-1,-52,33,-53,117v23,-73,122,-44,122,37v0,48,-22,87,-71,87v-58,0,-74,-42,-74,-122v0,-84,16,-137,77,-137v40,0,62,25,63,60xm41,-79v0,33,13,65,48,65v35,0,47,-32,47,-65v0,-33,-12,-65,-47,-65v-35,0,-48,32,-48,65","w":172},"7":{"d":"15,-231r0,-20r143,0r0,20v-55,67,-86,162,-91,231r-25,0v4,-70,44,-170,94,-231r-121,0","w":172},"8":{"d":"38,-70v0,31,16,56,48,56v32,0,49,-25,49,-56v0,-31,-17,-57,-49,-57v-32,0,-48,26,-48,57xm86,4v-76,0,-100,-127,-25,-139v-23,-8,-39,-32,-39,-57v0,-42,27,-63,64,-63v68,0,89,102,26,119v29,6,46,32,46,64v0,48,-29,76,-72,76xm45,-191v0,27,14,46,41,46v28,0,41,-19,41,-46v0,-27,-13,-46,-41,-46v-27,0,-41,19,-41,46","w":172},"9":{"d":"19,-55r23,0v1,25,15,41,40,41v34,0,55,-36,53,-116v-23,72,-121,42,-121,-38v0,-48,22,-87,71,-87v58,0,74,43,74,123v0,84,-17,136,-78,136v-40,0,-61,-24,-62,-59xm37,-172v0,33,12,65,47,65v35,0,48,-32,48,-65v0,-33,-13,-65,-48,-65v-35,0,-47,32,-47,65","w":172},":":{"d":"31,-144r0,-36r24,0r0,36r-24,0xm31,0r0,-37r24,0r0,37r-24,0","w":86,"k":{" ":13}},";":{"d":"31,0r0,-37r24,0v-1,39,7,74,-26,87v-2,-24,15,-22,12,-50r-10,0xm31,-144r0,-36r24,0r0,36r-24,0","w":86},"<":{"d":"17,-81r0,-20r182,-84r0,19r-160,75r160,74r0,20","w":216},"=":{"d":"17,-117r0,-18r182,0r0,18r-182,0xm17,-47r0,-18r182,0r0,18r-182,0","w":216},">":{"d":"17,3r0,-20r160,-74r-160,-75r0,-19r182,84r0,20","w":216},"?":{"d":"82,-67r-22,0v-12,-63,57,-79,58,-132v0,-26,-16,-44,-40,-44v-31,0,-46,21,-46,60r-23,0v0,-45,21,-78,67,-78v65,-1,86,75,42,119v-19,19,-41,37,-36,75xm59,0r0,-37r25,0r0,37r-25,0","w":153},"@":{"d":"87,-104v0,22,9,37,31,37v39,0,67,-54,67,-87v0,-23,-9,-35,-31,-35v-39,0,-67,51,-67,85xm196,-177v5,-6,6,-17,10,-24r20,0r-41,127v0,5,4,9,10,9v32,0,64,-50,64,-87v0,-57,-52,-94,-108,-94v-71,0,-122,55,-122,117v0,65,54,117,122,117v39,0,80,-18,99,-49r22,0v-24,40,-72,65,-121,65v-80,0,-140,-60,-140,-133v0,-74,63,-132,140,-132v70,0,126,46,126,110v0,55,-46,102,-85,102v-15,0,-23,-9,-26,-24v-31,39,-99,31,-98,-29v0,-50,37,-105,88,-105v17,0,32,8,40,30","w":288},"A":{"d":"50,-94r80,0r-40,-145xm0,0r76,-257r28,0r76,257r-24,0r-21,-75r-90,0r-21,75r-24,0","w":180,"k":{"\u201d":20,"y":6,"w":6,"v":6,"Y":20,"W":10,"V":10,"U":-2,"T":20,"Q":-2,"\u2019":20}},"B":{"d":"43,-238r0,94v49,3,94,-3,94,-47v0,-50,-45,-48,-94,-47xm43,-125r0,106v54,3,102,-1,102,-53v0,-52,-48,-56,-102,-53xm20,0r0,-257r71,0v83,-7,90,101,30,120v30,9,47,30,47,65v0,45,-28,72,-77,72r-71,0","w":180},"C":{"d":"153,-87r23,0v-3,59,-30,91,-76,91v-53,0,-82,-41,-82,-133v0,-92,29,-132,82,-132v52,0,74,37,74,79r-23,0v0,-35,-18,-60,-51,-60v-37,0,-59,30,-59,113v0,83,22,114,59,114v32,0,50,-28,53,-72","w":186},"D":{"d":"20,0r0,-257r62,0v75,0,93,44,93,128v0,84,-18,129,-93,129r-62,0xm43,-238r0,219v80,4,109,-6,109,-109v0,-103,-28,-115,-109,-110","w":193},"E":{"d":"20,0r0,-257r128,0r0,19r-105,0r0,94r98,0r0,19r-98,0r0,106r108,0r0,19r-131,0","w":159},"F":{"d":"20,0r0,-257r128,0r0,19r-105,0r0,94r98,0r0,19r-98,0r0,125r-23,0","w":153,"k":{"A":13,".":40,",":40}},"G":{"d":"154,-112r-61,0r0,-19r82,0r0,131r-18,0r0,-42v-8,28,-31,46,-57,46v-53,0,-82,-41,-82,-133v0,-92,29,-132,82,-132v49,0,71,32,74,76r-23,0v0,-31,-17,-57,-51,-57v-37,0,-59,30,-59,113v0,83,22,114,59,114v37,0,55,-37,54,-97","w":193},"H":{"d":"144,0r0,-128r-101,0r0,128r-23,0r0,-257r23,0r0,109r101,0r0,-109r23,0r0,257r-23,0","w":186},"I":{"d":"22,0r0,-257r23,0r0,257r-23,0"},"J":{"d":"65,4v-40,0,-61,-26,-58,-79r23,0v-1,36,7,60,34,60v25,0,39,-11,39,-52r0,-190r23,0r0,193v0,44,-20,68,-61,68","w":146},"K":{"d":"20,0r0,-257r23,0r1,135r98,-135r25,0r-79,107r87,150r-24,0r-77,-130r-31,40r0,90r-23,0","w":172},"L":{"d":"20,0r0,-257r23,0r0,238r107,0r0,19r-130,0","w":153,"k":{"\u201d":33,"y":13,"Y":33,"W":27,"V":27,"T":27,"\u2019":33}},"M":{"d":"22,0r0,-257r40,0r63,228r62,-228r38,0r0,257r-23,0r-1,-235r-67,235r-21,0r-68,-235r0,235r-23,0","w":246},"N":{"d":"20,0r0,-257r31,0r99,224r0,-224r23,0r0,257r-31,0r-99,-224r0,224r-23,0","w":193},"O":{"d":"18,-129v0,-92,29,-132,82,-132v53,0,82,40,82,132v0,92,-29,133,-82,133v-53,0,-82,-41,-82,-133xm41,-129v0,83,22,114,59,114v37,0,59,-31,59,-114v0,-83,-22,-113,-59,-113v-37,0,-59,30,-59,113","w":200},"P":{"d":"43,-238r0,107v51,1,93,3,94,-53v1,-55,-41,-56,-94,-54xm20,0r0,-257r70,0v50,0,70,29,70,73v0,40,-19,72,-78,72r-39,0r0,112r-23,0","w":172,"k":{"A":13,".":46,",":46}},"Q":{"d":"172,14r-25,-26v-70,43,-129,-1,-129,-117v0,-92,29,-132,82,-132v53,0,82,40,82,132v0,48,-8,83,-23,104r26,25xm132,-27r-29,-28r13,-13r28,27v10,-18,15,-48,15,-88v0,-83,-22,-113,-59,-113v-37,0,-59,30,-59,113v-1,101,36,134,91,102","w":200},"R":{"d":"20,0r0,-257r77,0v80,-8,89,117,20,130v61,-3,32,88,55,127r-27,0v-8,-14,-7,-38,-7,-58v0,-65,-38,-60,-95,-59r0,117r-23,0xm43,-238r0,101v51,3,97,-1,97,-50v0,-48,-45,-55,-97,-51","w":180,"k":{"Y":6,"U":-2,"T":6}},"S":{"d":"156,-191r-23,0v0,-32,-15,-51,-46,-51v-31,0,-49,20,-49,46v0,77,125,35,125,125v0,50,-31,75,-78,75v-51,0,-77,-29,-75,-84r23,0v-2,39,13,65,51,65v32,0,56,-16,56,-52v0,-76,-125,-33,-125,-126v0,-40,26,-68,71,-68v48,0,70,24,70,70","w":172},"T":{"d":"68,0r0,-238r-66,0r0,-19r156,0r0,19r-67,0r0,238r-23,0","w":159,"k":{"y":20,"w":27,"u":27,"r":27,"o":27,"i":6,"e":27,"a":27,"A":20,";":27,":":27,".":33,"-":20,",":33}},"U":{"d":"17,-72r0,-185r23,0r0,185v0,39,16,57,50,57v34,0,50,-18,50,-57r0,-185r23,0r0,185v0,54,-26,76,-73,76v-47,0,-73,-22,-73,-76","w":180},"V":{"d":"69,0r-68,-257r25,0r58,233r57,-233r24,0r-67,257r-29,0","w":166,"k":{"u":6,"o":6,"e":6,"a":6,"A":13,";":6,":":6,".":33,"-":6,",":33}},"W":{"d":"58,0r-54,-257r23,0r46,226r44,-226r26,0r45,226r45,-226r23,0r-54,257r-29,0r-43,-226r-43,226r-29,0","w":259,"k":{"o":6,"e":6,"a":6,"A":6,".":27,"-":6,",":27}},"X":{"d":"142,0r-60,-111r-59,111r-23,0r70,-131r-66,-126r25,0r55,104r55,-104r23,0r-66,126r71,131r-25,0","w":166},"Y":{"d":"68,0r0,-103r-69,-154r24,0r57,128r56,-128r25,0r-70,154r0,103r-23,0","w":159,"k":{"u":13,"o":20,"i":6,"e":20,"a":20,"A":20,";":13,":":13,".":40,"-":27,",":40}},"Z":{"d":"8,0r0,-22r125,-216r-118,0r0,-19r142,0r0,22r-124,216r125,0r0,19r-150,0","w":166},"[":{"d":"30,66r0,-323r57,0r0,18r-36,0r0,287r36,0r0,18r-57,0","w":86},"\\":{"d":"-4,-261r20,0r88,265r-20,0","w":100},"]":{"d":"0,66r0,-18r35,0r0,-287r-35,0r0,-18r57,0r0,323r-57,0","w":86},"^":{"d":"181,-87r-73,-142r-73,142r-19,0r83,-164r18,0r83,164r-19,0","w":216},"_":{"d":"0,45r0,-18r180,0r0,18r-180,0","w":180},"\u2018":{"d":"30,-171v1,-39,-6,-73,27,-86v2,23,-16,22,-13,50r10,0r0,36r-24,0","w":86,"k":{"\u2018":39}},"a":{"d":"39,-134r-22,0v0,-39,19,-61,59,-61v84,0,54,94,54,163v0,14,5,17,17,16r0,16v-21,6,-41,0,-38,-28v-9,25,-29,32,-50,32v-61,0,-65,-96,-10,-107v24,-12,59,0,59,-41v0,-24,-14,-33,-33,-33v-26,0,-36,15,-36,43xm64,-14v40,0,48,-47,44,-94v-18,22,-74,12,-74,57v0,22,11,37,30,37","w":153,"k":{"y":-1,"w":-1,"v":-1,"t":-1,"p":-1,"g":-1,"b":-1}},"b":{"d":"19,0r0,-257r21,0r1,95v5,-20,21,-33,45,-33v42,0,61,33,61,99v0,66,-19,100,-61,100v-24,1,-40,-16,-48,-36r0,32r-19,0xm40,-96v0,71,20,82,42,82v22,0,42,-11,42,-82v0,-71,-20,-81,-42,-81v-22,0,-42,10,-42,81","w":159,"k":{"y":-1,"v":-1,"b":-1}},"c":{"d":"114,-63r22,0v-3,41,-26,67,-61,67v-40,0,-64,-28,-64,-100v0,-66,24,-99,66,-99v36,0,57,22,59,61r-22,0v-3,-30,-14,-43,-37,-43v-23,0,-43,14,-43,82v0,72,21,81,41,81v22,0,35,-16,39,-49","w":146},"d":{"d":"122,0v-1,-10,2,-24,-1,-32v-6,22,-24,36,-47,36v-42,0,-61,-34,-61,-100v0,-66,19,-99,61,-99v25,-1,39,15,46,33r0,-95r21,0r0,257r-19,0xm36,-96v0,71,20,82,42,82v22,0,42,-11,42,-82v0,-71,-20,-81,-42,-81v-22,0,-42,10,-42,81","w":159},"e":{"d":"117,-63r22,0v-3,41,-26,67,-62,67v-40,0,-64,-28,-64,-100v0,-66,24,-99,66,-99v44,0,63,35,61,100r-104,0v-2,53,18,81,41,81v23,0,36,-16,40,-49xm36,-113r81,0v-1,-48,-13,-64,-40,-64v-27,0,-40,16,-41,64","w":153,"k":{"y":-1}},"f":{"d":"29,0r0,-173r-26,0r0,-18r26,0v-4,-43,3,-76,55,-68r0,18v-30,-9,-37,17,-34,50r34,0r0,18r-34,0r0,173r-21,0","w":86,"k":{"\u201d":-6,"o":-1,"l":-1,"f":-1,"\u2019":-6}},"g":{"d":"119,-162v3,-7,0,-20,1,-29r19,0r0,177v0,53,-20,80,-63,80v-37,0,-57,-20,-57,-47r22,0v0,18,17,29,36,29v37,0,43,-40,40,-82v-7,23,-25,34,-45,34v-30,0,-59,-20,-59,-96v0,-66,19,-99,61,-99v21,0,38,11,45,33xm36,-98v0,61,15,80,41,80v26,0,40,-19,40,-80v0,-61,-14,-79,-40,-79v-26,0,-41,18,-41,79","w":159,"k":{"y":-1,"r":-1,"i":-1,"g":-1}},"h":{"d":"21,0r0,-257r21,0r1,92v5,-19,24,-30,47,-30v29,0,49,15,49,51r0,144r-22,0r0,-138v0,-26,-10,-39,-32,-39v-67,2,-36,113,-43,177r-21,0","w":159},"i":{"d":"22,0r0,-191r22,0r0,191r-22,0xm22,-220r0,-37r22,0r0,37r-22,0"},"j":{"d":"22,15r0,-206r22,0r0,213v-1,38,-23,47,-53,43r0,-18v20,3,31,-1,31,-32xm22,-220r0,-37r22,0r0,37r-22,0"},"k":{"d":"19,0r0,-257r21,0r1,161r74,-95r27,0r-58,71r68,120r-26,0r-57,-101r-29,34r0,67r-21,0","w":146},"l":{"d":"22,0r0,-257r22,0r0,257r-22,0","k":{"y":-1,"w":-1}},"m":{"d":"22,0r0,-191r20,0r0,26v16,-42,83,-38,90,3v9,-21,24,-33,48,-33v27,0,45,15,45,49r0,146r-22,0r0,-143v0,-23,-11,-34,-30,-34v-62,0,-33,115,-39,177r-21,0r0,-143v0,-23,-11,-34,-30,-34v-62,0,-33,115,-39,177r-22,0","w":246,"k":{"y":-1}},"n":{"d":"21,0r0,-191r19,0v1,8,-2,20,1,26v22,-45,98,-42,98,21r0,144r-22,0r0,-138v0,-26,-10,-39,-32,-39v-67,2,-36,113,-43,177r-21,0","w":159,"k":{"y":-1}},"o":{"d":"11,-96v0,-66,24,-99,66,-99v42,0,66,33,66,99v0,67,-24,100,-66,100v-42,0,-66,-33,-66,-100xm34,-96v0,61,19,82,43,82v24,0,43,-21,43,-82v0,-61,-19,-81,-43,-81v-24,0,-43,20,-43,81","w":153},"p":{"d":"19,63r0,-254r19,0v1,8,-2,21,1,27v7,-18,23,-31,47,-31v42,0,61,34,61,100v0,66,-19,99,-61,99v-25,1,-39,-15,-46,-33r0,92r-21,0xm83,-177v-37,0,-43,33,-43,82v0,71,20,81,42,81v22,0,42,-10,42,-81v0,-69,-20,-82,-41,-82","w":159,"k":{"y":-1}},"q":{"d":"120,63r-1,-92v-5,20,-21,33,-45,33v-42,0,-61,-33,-61,-99v0,-66,19,-100,61,-100v25,-1,39,15,48,31r0,-27r19,0r0,254r-21,0xm120,-95v-1,-50,-6,-82,-43,-82v-21,0,-41,13,-41,82v0,71,20,81,42,81v22,0,42,-10,42,-81","w":159},"r":{"d":"21,0r0,-191r21,0v1,9,-2,23,1,30v9,-23,29,-37,56,-33r0,21v-32,-5,-57,12,-57,53r0,120r-21,0","w":100,"k":{"y":-6,"v":-6,".":27,"-":13,",":27}},"s":{"d":"107,-48v0,-49,-93,-39,-93,-92v0,-39,25,-55,57,-55v38,0,54,20,53,58r-22,0v1,-27,-9,-41,-31,-40v-43,0,-49,52,-9,64v29,10,67,26,67,60v0,33,-19,57,-59,57v-41,1,-61,-19,-59,-65r22,0v-1,30,10,48,36,47v23,0,38,-13,38,-34","w":140},"t":{"d":"29,-31r0,-142r-26,0r0,-18r26,0r0,-53r21,0r0,53r34,0r0,18r-34,0r0,137v-1,20,17,22,34,18r0,18v-27,5,-55,1,-55,-31","w":86},"u":{"d":"21,-47r0,-144r21,0r0,134v0,31,11,43,34,43v64,0,35,-114,41,-177r22,0r0,191r-19,0v-1,-8,2,-21,-1,-27v-22,46,-98,43,-98,-20","w":159},"v":{"d":"56,0r-53,-191r23,0r43,167r39,-167r23,0r-51,191r-24,0","w":133,"k":{".":20,",":20}},"w":{"d":"46,0r-42,-191r23,0r33,169r34,-169r27,0r33,169r32,-169r24,0r-43,191r-26,0r-35,-170r-34,170r-26,0","w":213,"k":{".":13,",":13}},"x":{"d":"107,0r-40,-82r-40,82r-25,0r52,-99r-50,-92r25,0r38,75r37,-75r25,0r-49,92r51,99r-24,0","w":133},"y":{"d":"58,2r-55,-193r23,0r43,165r39,-165r23,0r-56,206v-12,43,-25,50,-65,48r0,-18v32,7,41,-17,48,-43","w":133,"k":{".":20,",":20}},"z":{"d":"6,0r0,-18r91,-155r-86,0r0,-18r109,0r0,18r-90,155r90,0r0,18r-114,0","w":126},"{":{"d":"12,-104v56,-5,-30,-173,78,-153r0,18v-22,0,-36,-4,-36,24v-1,43,7,116,-24,120v32,2,24,78,24,119v0,28,14,24,36,24r0,18v-37,4,-57,-9,-57,-43v0,-34,10,-114,-21,-109r0,-18","w":86},"|":{"d":"31,4r0,-265r18,0r0,265r-18,0","w":79},"}":{"d":"75,-86v-56,5,29,172,-78,152r0,-18v22,0,36,4,35,-24v0,-43,-7,-116,25,-120v-33,-2,-25,-78,-25,-119v0,-28,-13,-24,-35,-24r0,-18v36,-3,57,10,57,43v0,35,-10,114,21,110r0,18","w":86},"~":{"d":"70,-112v14,-4,70,26,77,24v12,0,20,-8,31,-26r13,13v-15,21,-26,31,-45,31v-16,4,-61,-30,-78,-24v-16,0,-24,13,-30,26r-13,-13v8,-15,21,-31,45,-31","w":216},"\u00a1":{"d":"31,62r4,-190r16,0r4,190r-24,0xm31,-158r0,-37r24,0r0,37r-24,0","w":86},"\u00a2":{"d":"84,-14r0,-163v-21,3,-37,20,-37,82v0,67,18,80,37,81xm84,34r0,-30v-38,-2,-60,-31,-60,-100v0,-63,22,-96,60,-99r0,-30r10,0r0,30v34,2,53,24,55,61r-22,0v-2,-27,-12,-41,-33,-43r0,163v18,-4,30,-19,33,-49r22,0v-3,38,-23,63,-55,67r0,30r-10,0","w":172},"\u00a3":{"d":"33,-19v25,-17,54,4,80,4v15,0,28,-8,43,-18r10,16v-26,30,-76,18,-113,8v-15,0,-29,8,-35,11r-11,-17v35,-26,57,-59,38,-102r-36,0r0,-16r30,0v-8,-16,-23,-36,-22,-58v0,-41,34,-64,73,-64v44,0,70,30,70,74r-22,0v7,-69,-97,-74,-98,-12v0,18,14,45,23,60r54,0r0,16r-48,0v17,41,-3,69,-36,98","w":172},"\u2044":{"d":"-60,11r162,-272r18,0r-162,272r-18,0","w":60},"\u2215":{"d":"-60,11r162,-272r18,0r-162,272r-18,0","w":60},"\u00a5":{"d":"75,0r0,-63r-51,0r0,-15r51,0v0,-12,1,-25,-4,-32r-47,0r0,-16r40,0r-59,-125r25,0r56,124r57,-124r24,0r-58,125r39,0r0,16r-46,0v-5,7,-4,20,-4,32r50,0r0,15r-50,0r0,63r-23,0","w":172},"\u0192":{"d":"40,-143r3,-16r38,0r9,-47v14,-52,38,-53,75,-50r-4,18v-32,-3,-41,-2,-53,52r-5,27r40,0r-3,16r-40,0r-27,138v-11,59,-29,74,-78,66r4,-18v34,5,42,2,54,-56r25,-130r-38,0","w":172},"\u00a7":{"d":"146,-208r-22,0v0,-22,-15,-35,-37,-35v-44,0,-51,48,-9,66v28,21,83,43,83,84v0,22,-15,41,-34,50v38,30,22,100,-38,97v-40,-2,-65,-25,-63,-62r22,0v0,26,12,44,40,44v47,0,49,-56,7,-74v-28,-21,-82,-43,-82,-83v0,-21,18,-42,37,-50v-44,-27,-18,-90,38,-90v37,0,58,22,58,53xm139,-94v0,-34,-53,-48,-76,-67v-41,24,-37,53,1,77r48,31v18,-9,27,-22,27,-41","w":173},"\u00a4":{"d":"21,-46r-13,-13r17,-17v-24,-28,-23,-71,0,-99r-17,-17r13,-12r16,16v26,-21,73,-21,99,1r17,-17r12,12r-17,17v23,25,23,74,1,99r16,17r-12,13r-17,-18v-27,23,-73,23,-99,1xm27,-125v0,35,28,61,59,61v31,0,60,-26,60,-61v0,-35,-29,-61,-60,-61v-31,0,-59,26,-59,61","w":172},"'":{"d":"32,-171r0,-86r22,0r0,86r-22,0","w":86},"\u201c":{"d":"74,-171v1,-38,-7,-73,26,-86v2,23,-15,22,-12,50r10,0r0,36r-24,0xm26,-171v1,-39,-6,-73,27,-86v2,23,-16,22,-13,50r11,0r0,36r-25,0","w":126},"\u00ab":{"d":"68,-91r0,-22r45,-50r0,24r-32,37r32,36r0,25xm21,-91r0,-22r45,-50r0,24r-33,37r33,36r0,25","w":133},"\u2039":{"d":"21,-91r0,-22r45,-50r0,24r-32,37r32,36r0,25","w":86},"\u203a":{"d":"21,-41r0,-25r32,-36r-32,-37r0,-24r45,50r0,22","w":86},"\ufb01":{"d":"109,0r0,-191r22,0r0,191r-22,0xm109,-220r0,-37r22,0r0,37r-22,0xm29,0r0,-173r-26,0r0,-18r26,0v-4,-43,3,-76,55,-68r0,18v-30,-9,-37,17,-34,50r34,0r0,18r-34,0r0,173r-21,0","w":153},"\ufb02":{"d":"109,0r0,-257r22,0r0,257r-22,0xm29,0r0,-173r-26,0r0,-18r26,0v-4,-43,3,-76,55,-68r0,18v-30,-9,-37,17,-34,50r34,0r0,18r-34,0r0,173r-21,0","w":153},"\u2013":{"d":"0,-112r180,0r0,19r-180,0r0,-19","w":180},"\u2020":{"d":"76,-176r0,-81r21,0r0,81r64,0r0,18r-64,0r0,210r-21,0r0,-210r-64,0r0,-18r64,0","w":172},"\u2021":{"d":"76,-257r21,0r0,74r64,0r0,18r-64,0r0,125r64,0r0,18r-64,0r0,74r-21,0r0,-74r-64,0r0,-18r64,0r0,-125r-64,0r0,-18r64,0r0,-74","w":172},"\u00b7":{"d":"23,-118v0,-11,9,-20,20,-20v11,0,20,9,20,20v0,11,-9,20,-20,20v-11,0,-20,-9,-20,-20","w":86},"\u2219":{"d":"23,-118v0,-11,9,-20,20,-20v11,0,20,9,20,20v0,11,-9,20,-20,20v-11,0,-20,-9,-20,-20","w":86},"\u00b6":{"d":"70,50r0,-170v-32,0,-59,-30,-59,-66v-1,-73,61,-75,133,-71r0,307r-18,0r0,-291r-38,0r0,291r-18,0","w":173},"\u2022":{"d":"26,-129v0,-35,29,-64,64,-64v35,0,64,29,64,64v0,35,-29,65,-64,65v-35,0,-64,-30,-64,-65","w":180},"\u201a":{"d":"32,0r0,-37r25,0v-1,39,6,74,-27,87v-2,-24,15,-22,12,-50r-10,0","w":86},"\u201e":{"d":"28,0r0,-37r25,0v-1,39,6,74,-27,87v-2,-24,16,-22,13,-50r-11,0xm76,0r0,-37r24,0v-1,39,7,74,-26,87v-2,-24,15,-22,12,-50r-10,0","w":126},"\u201d":{"d":"28,-220r0,-37r25,0v-1,39,6,73,-27,86v-2,-23,16,-21,13,-49r-11,0xm76,-220r0,-37r24,0v-1,38,7,73,-26,86v-2,-23,15,-21,12,-49r-10,0","w":126,"k":{" ":13}},"\u00bb":{"d":"21,-41r0,-25r32,-36r-32,-37r0,-24r45,50r0,22xm68,-41r0,-25r32,-36r-32,-37r0,-24r45,50r0,22","w":133},"\u2026":{"d":"48,0r0,-37r24,0r0,37r-24,0xm168,0r0,-37r24,0r0,37r-24,0xm288,0r0,-37r24,0r0,37r-24,0","w":360},"\u2030":{"d":"39,-189v0,39,10,51,25,51v15,0,26,-12,26,-51v0,-38,-11,-50,-26,-50v-15,0,-25,12,-25,50xm62,4r111,-259r18,0r-111,259r-18,0xm161,-62v0,39,11,50,26,50v15,0,26,-11,26,-50v0,-38,-11,-50,-26,-50v-15,0,-26,12,-26,50xm19,-189v0,-52,16,-66,45,-66v29,0,46,14,46,66v0,52,-17,67,-46,67v-29,0,-45,-15,-45,-67xm142,-62v0,-52,16,-66,45,-66v29,0,46,14,46,66v0,52,-17,66,-46,66v-29,0,-45,-14,-45,-66xm270,-62v0,39,11,50,26,50v15,0,25,-11,25,-50v0,-38,-10,-50,-25,-50v-15,0,-26,12,-26,50xm250,-62v0,-52,17,-66,46,-66v29,0,45,14,45,66v0,52,-16,66,-45,66v-29,0,-46,-14,-46,-66","w":360},"\u00bf":{"d":"71,-129r22,0v12,64,-57,79,-58,133v0,26,17,44,41,44v31,0,46,-21,46,-60r23,0v0,45,-22,78,-68,78v-66,1,-85,-75,-41,-119v19,-19,40,-38,35,-76xm70,-158r0,-37r24,0r0,37r-24,0","w":153},"`":{"d":"-4,-266r26,0r27,51r-17,0"},"\u00b4":{"d":"45,-266r26,0r-36,51r-17,0"},"\u02c6":{"d":"10,-215r-22,0r35,-51r21,0r35,51r-22,0r-24,-36"},"\u02dc":{"d":"66,-258r16,0v1,32,-35,43,-59,22v-11,-10,-20,2,-22,14r-16,0v1,-30,34,-46,57,-23v11,11,24,-1,24,-13"},"\u00af":{"d":"-9,-233r0,-15r85,0r0,15r-85,0"},"\u02c9":{"d":"-9,-233r0,-15r85,0r0,15r-85,0"},"\u02d8":{"d":"6,-261v0,35,53,38,55,0r16,0v-2,27,-20,44,-44,44v-24,0,-41,-17,-43,-44r16,0"},"\u02d9":{"d":"23,-222r0,-37r21,0r0,37r-21,0"},"\u00a8":{"d":"-4,-222r0,-37r21,0r0,37r-21,0xm50,-222r0,-37r21,0r0,37r-21,0"},"\u02da":{"d":"-1,-245v0,-19,15,-34,34,-34v19,0,35,15,35,34v0,19,-16,34,-35,34v-19,0,-34,-15,-34,-34xm12,-245v0,12,9,21,21,21v12,0,22,-9,22,-21v0,-12,-10,-21,-22,-21v-12,0,-21,9,-21,21"},"\u00b8":{"d":"12,29v11,-10,10,-32,34,-29v-4,7,-14,14,-15,21v18,-7,41,5,40,22v-1,32,-46,36,-70,23r4,-11v13,8,49,6,46,-10v1,-14,-24,-16,-34,-10"},"\u02dd":{"d":"18,-266r25,0r-35,51r-17,0xm72,-266r26,0r-36,51r-17,0"},"\u02db":{"d":"5,48v2,-19,16,-52,54,-50v-26,18,-35,32,-35,46v-1,20,28,19,41,10r5,10v-17,15,-68,11,-65,-16"},"\u02c7":{"d":"-12,-266r21,0r24,37r25,-37r21,0r-35,51r-22,0"},"\u2014":{"d":"0,-112r360,0r0,19r-360,0r0,-19","w":360},"\u00c6":{"d":"120,0r0,-75r-69,0r-29,75r-25,0r105,-257r142,0r0,19r-101,0r0,94r94,0r0,19r-94,0r0,106r104,0r0,19r-127,0xm58,-94r62,0r0,-144r-4,0","w":253},"\u00aa":{"d":"23,-217r-18,0v0,-25,13,-38,43,-38v58,-2,34,52,39,97v0,8,3,11,11,10r0,14v-13,5,-32,3,-29,-18v-11,34,-73,21,-67,-14v-3,-29,30,-35,55,-41v10,-3,12,-5,12,-16v0,-11,-9,-16,-22,-16v-17,0,-24,9,-24,22xm40,-148v23,2,34,-25,28,-50v-11,12,-47,7,-47,30v0,11,8,20,19,20","w":99},"\u0141":{"d":"20,0r0,-103r-25,17r0,-21r25,-18r0,-132r23,0r0,117r67,-46r0,21r-67,46r0,100r107,0r0,19r-130,0","w":153},"\u00d8":{"d":"56,-43r79,-185v-54,-35,-96,-4,-94,99v0,39,5,68,15,86xm144,-214r-78,185v9,10,20,14,34,14v37,0,59,-31,59,-114v0,-40,-6,-67,-15,-85xm48,15r-13,-6r11,-28v-19,-21,-28,-57,-28,-110v0,-114,51,-154,125,-120r9,-23r14,5r-12,28v19,21,28,57,28,110v0,113,-50,156,-124,121","w":200},"\u0152":{"d":"97,-15v66,0,51,-98,51,-162v0,-50,-16,-65,-51,-65v-37,0,-59,30,-59,113v0,83,22,114,59,114xm147,-236v3,-4,0,-15,1,-21r122,0r0,19r-99,0r0,94r92,0r0,19r-92,0r0,106r102,0r0,19r-125,0v-1,-7,2,-18,-1,-23v-8,18,-27,27,-50,27v-53,0,-82,-41,-82,-133v0,-92,29,-132,82,-132v27,0,41,9,50,25","w":280},"\u00ba":{"d":"3,-194v0,-41,16,-61,47,-61v32,0,46,20,46,61v0,41,-14,62,-46,62v-31,0,-47,-21,-47,-62xm23,-194v0,33,12,46,27,46v15,0,27,-13,27,-46v0,-33,-12,-45,-27,-45v-15,0,-27,12,-27,45","w":99},"\u00e6":{"d":"39,-134r-22,0v-11,-64,85,-84,102,-31v8,-19,25,-30,45,-30v43,0,58,32,58,100r-98,0v-2,48,13,81,37,81v21,0,38,-20,38,-49r22,0v2,74,-90,91,-108,28v-10,25,-27,39,-54,39v-33,0,-48,-21,-48,-54v0,-43,36,-53,73,-61v29,-6,23,-74,-11,-66v-23,0,-34,15,-34,43xm102,-103v-21,15,-68,12,-68,52v0,22,11,37,30,37v17,0,38,-13,38,-49r0,-40xm124,-113r75,0v0,-48,-15,-64,-37,-64v-22,0,-37,16,-38,64","w":233},"\u0131":{"d":"22,0r0,-191r22,0r0,191r-22,0"},"\u0142":{"d":"22,0r0,-114r-22,24r0,-22r22,-23r0,-122r22,0r0,99r22,-24v4,26,-12,33,-22,45r0,137r-22,0"},"\u00f8":{"d":"44,-36r55,-133v-38,-22,-64,0,-65,73v0,27,4,47,10,60xm109,-155r-55,132v38,24,65,1,66,-73v0,-27,-5,-46,-11,-59xm36,20r-13,-6r11,-27v-15,-16,-23,-44,-23,-83v-1,-80,39,-115,96,-92r10,-23r14,6r-12,27v15,16,24,43,24,82v2,81,-40,117,-97,92","w":153},"\u0153":{"d":"216,-63r22,0v0,71,-84,96,-108,28v-9,23,-25,39,-50,39v-42,0,-66,-33,-66,-100v0,-66,24,-99,66,-99v26,0,43,14,52,39v6,-25,23,-39,49,-39v43,0,59,32,59,100r-99,0v-3,48,14,81,38,81v21,0,37,-20,37,-49xm37,-96v0,61,18,82,41,82v23,0,42,-21,42,-82v0,-61,-19,-81,-42,-81v-23,0,-41,20,-41,81xm141,-113r76,0v0,-48,-16,-64,-38,-64v-22,0,-37,16,-38,64","w":253},"\u00df":{"d":"19,0r0,-194v0,-44,23,-66,60,-66v65,0,82,96,20,112v41,5,50,43,50,70v0,55,-33,88,-84,78r0,-18v35,8,60,-12,61,-61v0,-41,-19,-60,-59,-58r0,-18v30,1,47,-12,47,-44v0,-24,-12,-43,-36,-43v-22,0,-38,13,-38,50r0,192r-21,0","w":159},"\u00b9":{"d":"52,-101r0,-115r-39,0r0,-13v29,0,41,-11,42,-26r16,0r0,154r-19,0","w":112},"\u00ac":{"d":"181,-39r0,-78r-164,0r0,-18r182,0r0,96r-18,0","w":216},"\u00b5":{"d":"21,63r0,-254r21,0r0,134v0,31,11,43,34,43v64,0,35,-114,41,-177r22,0r0,191r-19,0v-1,-8,2,-21,-1,-27v-14,30,-51,39,-77,23r0,67r-21,0","w":159},"\u03bc":{"d":"21,63r0,-254r21,0r0,134v0,31,11,43,34,43v64,0,35,-114,41,-177r22,0r0,191r-19,0v-1,-8,2,-21,-1,-27v-14,30,-51,39,-77,23r0,67r-21,0","w":159},"\u2122":{"d":"64,-109r0,-132r-49,0r0,-16r115,0r0,16r-48,0r0,132r-18,0xm235,-137r47,-120r30,0r0,148r-18,0r0,-132r-54,132r-11,0r-54,-132r0,132r-18,0r0,-148r31,0","w":356},"\u00d0":{"d":"20,0r0,-125r-20,0r0,-19r20,0r0,-113r62,0v75,0,93,44,93,128v0,84,-18,129,-93,129r-62,0xm43,-144r58,0r0,19r-58,0r0,106v80,4,109,-6,109,-109v0,-103,-28,-115,-109,-110r0,94","w":193},"\u00bd":{"d":"22,11r162,-272r18,0r-162,272r-18,0xm52,-101r0,-115r-39,0r0,-13v29,0,41,-11,42,-26r16,0r0,154r-19,0xm161,-105r-20,0v0,-30,16,-49,50,-49v48,0,62,61,19,88v-18,11,-46,32,-48,50r75,0r0,16r-94,0v-7,-52,71,-65,73,-112v0,-18,-12,-26,-27,-26v-17,0,-27,12,-28,33","w":259},"\u00b1":{"d":"99,-120r0,-62r18,0r0,62r82,0r0,18r-82,0r0,62r-18,0r0,-62r-82,0r0,-18r82,0xm17,0r0,-18r182,0r0,18r-182,0","w":216},"\u00de":{"d":"43,-187r0,106v51,1,94,3,94,-53v0,-56,-43,-55,-94,-53xm20,0r0,-257r23,0r0,50r48,0v48,0,69,30,69,73v0,40,-19,73,-78,73r-39,0r0,61r-23,0","w":172},"\u00bc":{"d":"204,0r0,-40r-67,0r0,-13r64,-101r21,0r0,101r20,0r0,13r-20,0r0,40r-18,0xm153,-53r51,0v-1,-25,2,-54,-1,-77xm32,11r163,-272r18,0r-163,272r-18,0xm52,-101r0,-115r-39,0r0,-13v29,0,41,-11,42,-26r16,0r0,154r-19,0","w":259},"\u00f7":{"d":"17,-82r0,-18r182,0r0,18r-182,0xm88,-165v0,-11,9,-20,20,-20v11,0,20,9,20,20v0,11,-9,20,-20,20v-11,0,-20,-9,-20,-20xm88,-17v0,-11,9,-20,20,-20v11,0,20,9,20,20v0,11,-9,20,-20,20v-11,0,-20,-9,-20,-20","w":216},"\u00a6":{"d":"31,4r0,-97r18,0r0,97r-18,0xm31,-164r0,-97r18,0r0,97r-18,0","w":79},"\u00b0":{"d":"36,-203v0,20,16,35,36,35v20,0,36,-15,36,-35v0,-20,-16,-36,-36,-36v-20,0,-36,16,-36,36xm21,-203v0,-28,23,-52,51,-52v28,0,51,24,51,52v0,28,-23,51,-51,51v-28,0,-51,-23,-51,-51","w":144},"\u00fe":{"d":"19,63r0,-320r21,0r1,98v6,-22,24,-36,45,-36v42,0,61,34,61,100v0,66,-19,99,-61,99v-25,1,-39,-15,-46,-33r0,92r-21,0xm40,-95v0,71,20,81,42,81v22,0,42,-10,42,-81v0,-71,-20,-82,-42,-82v-22,0,-42,11,-42,82","w":159},"\u00be":{"d":"204,0r0,-40r-67,0r0,-13r64,-101r21,0r0,101r20,0r0,13r-20,0r0,40r-18,0xm153,-53r51,0v-1,-25,2,-54,-1,-77xm43,11r163,-272r18,0r-163,272r-18,0xm43,-173v1,-6,-4,-17,6,-16v39,4,42,-49,6,-50v-14,0,-27,10,-27,27r-19,0v0,-26,14,-43,46,-43v50,0,61,63,18,73v50,11,39,84,-18,84v-30,0,-47,-15,-48,-44r20,0v0,13,10,28,28,28v14,0,31,-10,31,-31v0,-21,-18,-30,-43,-28","w":259},"\u00b2":{"d":"28,-206r-19,0v0,-30,15,-49,49,-49v48,0,63,63,19,89v-18,11,-46,31,-48,49r75,0r0,16r-94,0v-7,-52,71,-66,74,-112v0,-18,-12,-26,-27,-26v-17,0,-28,12,-29,33","w":112},"\u00ae":{"d":"192,-50r-47,-70r-33,0r0,70r-18,0r0,-158v50,-1,112,-7,112,44v0,28,-18,40,-39,44r46,70r-21,0xm112,-192r0,56v34,-1,76,8,76,-28v-1,-36,-42,-27,-76,-28xm11,-129v0,-73,60,-132,133,-132v73,0,133,59,133,132v0,73,-60,133,-133,133v-73,0,-133,-60,-133,-133xm29,-129v0,63,52,115,115,115v63,0,115,-52,115,-115v0,-63,-52,-114,-115,-114v-63,0,-115,51,-115,114","w":288},"\u2212":{"d":"17,-82r0,-18r182,0r0,18r-182,0","w":216},"\u00f0":{"d":"34,-94v0,59,19,80,43,80v24,0,43,-21,43,-80v0,-59,-19,-79,-43,-79v-24,0,-43,20,-43,79xm42,-215r-13,-12r26,-16v-8,-9,-17,-16,-26,-24r17,-12v10,8,18,17,27,26r26,-15r13,11r-27,16v33,36,58,80,58,145v0,67,-24,100,-66,100v-42,0,-66,-34,-66,-98v0,-64,26,-97,62,-97v14,0,26,9,36,18v-12,-21,-27,-40,-42,-57","w":153},"\u00d7":{"d":"176,-10r-68,-68r-68,68r-13,-13r68,-68r-68,-69r13,-12r68,68r68,-68r13,12r-68,69r68,68","w":216},"\u00b3":{"d":"43,-173v1,-6,-4,-17,6,-16v39,4,42,-49,6,-50v-14,0,-27,10,-27,27r-19,0v0,-26,14,-43,46,-43v50,0,61,63,18,73v50,11,39,84,-18,84v-30,0,-47,-15,-48,-44r20,0v0,13,10,28,28,28v14,0,31,-10,31,-31v0,-21,-18,-30,-43,-28","w":112},"\u00a9":{"d":"196,-101r20,0v-8,33,-34,57,-68,57v-49,0,-80,-37,-80,-85v0,-49,29,-83,79,-83v35,0,64,20,69,55r-20,0v-19,-65,-109,-37,-109,28v0,34,22,67,61,67v26,0,44,-17,48,-39xm11,-129v0,-73,60,-132,133,-132v73,0,133,59,133,132v0,73,-60,133,-133,133v-73,0,-133,-60,-133,-133xm29,-129v0,63,52,115,115,115v63,0,115,-52,115,-115v0,-63,-52,-114,-115,-114v-63,0,-115,51,-115,114","w":288},"\u00c1":{"d":"50,-94r80,0r-40,-145xm0,0r76,-257r28,0r76,257r-24,0r-21,-75r-90,0r-21,75r-24,0xm102,-320r25,0r-35,51r-17,0","w":180},"\u00c2":{"d":"50,-94r80,0r-40,-145xm0,0r76,-257r28,0r76,257r-24,0r-21,-75r-90,0r-21,75r-24,0xm66,-269r-21,0r34,-51r22,0r34,51r-21,0r-24,-36","w":180},"\u00c4":{"d":"50,-94r80,0r-40,-145xm0,0r76,-257r28,0r76,257r-24,0r-21,-75r-90,0r-21,75r-24,0xm52,-277r0,-37r22,0r0,37r-22,0xm106,-277r0,-37r22,0r0,37r-22,0","w":180},"\u00c0":{"d":"50,-94r80,0r-40,-145xm0,0r76,-257r28,0r76,257r-24,0r-21,-75r-90,0r-21,75r-24,0xm53,-320r25,0r27,51r-17,0","w":180},"\u00c5":{"d":"50,-94r80,0r-40,-145xm0,0r76,-257r28,0r76,257r-24,0r-21,-75r-90,0r-21,75r-24,0xm56,-300v0,-19,15,-34,34,-34v19,0,34,15,34,34v0,19,-15,35,-34,35v-19,0,-34,-16,-34,-35xm69,-300v0,12,9,22,21,22v12,0,21,-10,21,-22v0,-12,-9,-21,-21,-21v-12,0,-21,9,-21,21","w":180},"\u00c3":{"d":"50,-94r80,0r-40,-145xm0,0r76,-257r28,0r76,257r-24,0r-21,-75r-90,0r-21,75r-24,0xm122,-313r16,0v2,33,-36,45,-59,22v-13,-7,-19,4,-21,15r-16,0v0,-31,34,-46,57,-24v11,10,24,-1,23,-13","w":180},"\u00c7":{"d":"83,35v-11,-10,9,-21,13,-31v-50,-3,-78,-43,-78,-133v0,-92,29,-132,82,-132v52,0,74,37,74,79r-23,0v0,-35,-18,-60,-51,-60v-37,0,-59,30,-59,113v0,83,22,114,59,114v32,0,50,-28,53,-72r23,0v-3,54,-27,87,-67,91v-3,6,-12,12,-11,17v18,-7,41,5,40,22v-2,32,-47,36,-71,23r5,-11v13,9,49,6,46,-10v1,-14,-25,-16,-35,-10","w":186},"\u00c9":{"d":"20,0r0,-257r128,0r0,19r-105,0r0,94r98,0r0,19r-98,0r0,106r108,0r0,19r-131,0xm98,-320r25,0r-35,51r-17,0","w":159},"\u00ca":{"d":"20,0r0,-257r128,0r0,19r-105,0r0,94r98,0r0,19r-98,0r0,106r108,0r0,19r-131,0xm63,-269r-22,0r35,-51r21,0r35,51r-22,0r-24,-36","w":159},"\u00cb":{"d":"20,0r0,-257r128,0r0,19r-105,0r0,94r98,0r0,19r-98,0r0,106r108,0r0,19r-131,0xm49,-277r0,-37r21,0r0,37r-21,0xm103,-277r0,-37r21,0r0,37r-21,0","w":159},"\u00c8":{"d":"20,0r0,-257r128,0r0,19r-105,0r0,94r98,0r0,19r-98,0r0,106r108,0r0,19r-131,0xm49,-320r26,0r27,51r-17,0","w":159},"\u00cd":{"d":"22,0r0,-257r23,0r0,257r-23,0xm45,-320r25,0r-35,51r-17,0"},"\u00ce":{"d":"22,0r0,-257r23,0r0,257r-23,0xm9,-269r-21,0r34,-51r22,0r34,51r-21,0r-24,-36"},"\u00cf":{"d":"22,0r0,-257r23,0r0,257r-23,0xm-5,-277r0,-37r22,0r0,37r-22,0xm49,-277r0,-37r22,0r0,37r-22,0"},"\u00cc":{"d":"22,0r0,-257r23,0r0,257r-23,0xm-4,-320r26,0r27,51r-18,0"},"\u00d1":{"d":"20,0r0,-257r31,0r99,224r0,-224r23,0r0,257r-31,0r-99,-224r0,224r-23,0xm129,-313r16,0v2,32,-37,45,-59,22v-13,-7,-20,3,-22,15r-15,0v1,-31,33,-45,57,-24v11,10,24,-1,23,-13","w":193},"\u00d3":{"d":"18,-129v0,-92,29,-132,82,-132v53,0,82,40,82,132v0,92,-29,133,-82,133v-53,0,-82,-41,-82,-133xm41,-129v0,83,22,114,59,114v37,0,59,-31,59,-114v0,-83,-22,-113,-59,-113v-37,0,-59,30,-59,113xm112,-320r25,0r-35,51r-17,0","w":200},"\u00d4":{"d":"18,-129v0,-92,29,-132,82,-132v53,0,82,40,82,132v0,92,-29,133,-82,133v-53,0,-82,-41,-82,-133xm41,-129v0,83,22,114,59,114v37,0,59,-31,59,-114v0,-83,-22,-113,-59,-113v-37,0,-59,30,-59,113xm76,-269r-21,0r34,-51r22,0r34,51r-21,0r-24,-36","w":200},"\u00d6":{"d":"18,-129v0,-92,29,-132,82,-132v53,0,82,40,82,132v0,92,-29,133,-82,133v-53,0,-82,-41,-82,-133xm41,-129v0,83,22,114,59,114v37,0,59,-31,59,-114v0,-83,-22,-113,-59,-113v-37,0,-59,30,-59,113xm62,-277r0,-37r22,0r0,37r-22,0xm116,-277r0,-37r22,0r0,37r-22,0","w":200},"\u00d2":{"d":"18,-129v0,-92,29,-132,82,-132v53,0,82,40,82,132v0,92,-29,133,-82,133v-53,0,-82,-41,-82,-133xm41,-129v0,83,22,114,59,114v37,0,59,-31,59,-114v0,-83,-22,-113,-59,-113v-37,0,-59,30,-59,113xm63,-320r26,0r27,51r-18,0","w":200},"\u00d5":{"d":"18,-129v0,-92,29,-132,82,-132v53,0,82,40,82,132v0,92,-29,133,-82,133v-53,0,-82,-41,-82,-133xm41,-129v0,83,22,114,59,114v37,0,59,-31,59,-114v0,-83,-22,-113,-59,-113v-37,0,-59,30,-59,113xm132,-313r16,0v2,33,-36,45,-59,22v-13,-7,-19,4,-21,15r-16,0v0,-31,34,-46,57,-24v11,10,24,-1,23,-13","w":200},"\u0160":{"d":"156,-191r-23,0v0,-32,-15,-51,-46,-51v-31,0,-49,20,-49,46v0,77,125,35,125,125v0,50,-31,75,-78,75v-51,0,-77,-29,-75,-84r23,0v-2,39,13,65,51,65v32,0,56,-16,56,-52v0,-76,-125,-33,-125,-126v0,-40,26,-68,71,-68v48,0,70,24,70,70xm41,-320r21,0r24,36r25,-36r21,0r-35,51r-22,0","w":172},"\u00da":{"d":"17,-72r0,-185r23,0r0,185v0,39,16,57,50,57v34,0,50,-18,50,-57r0,-185r23,0r0,185v0,54,-26,76,-73,76v-47,0,-73,-22,-73,-76xm102,-320r25,0r-35,51r-17,0","w":180},"\u00db":{"d":"17,-72r0,-185r23,0r0,185v0,39,16,57,50,57v34,0,50,-18,50,-57r0,-185r23,0r0,185v0,54,-26,76,-73,76v-47,0,-73,-22,-73,-76xm66,-269r-21,0r34,-51r22,0r34,51r-21,0r-24,-36","w":180},"\u00dc":{"d":"17,-72r0,-185r23,0r0,185v0,39,16,57,50,57v34,0,50,-18,50,-57r0,-185r23,0r0,185v0,54,-26,76,-73,76v-47,0,-73,-22,-73,-76xm52,-277r0,-37r22,0r0,37r-22,0xm106,-277r0,-37r22,0r0,37r-22,0","w":180},"\u00d9":{"d":"17,-72r0,-185r23,0r0,185v0,39,16,57,50,57v34,0,50,-18,50,-57r0,-185r23,0r0,185v0,54,-26,76,-73,76v-47,0,-73,-22,-73,-76xm53,-320r25,0r27,51r-17,0","w":180},"\u00dd":{"d":"68,0r0,-103r-69,-154r24,0r57,128r56,-128r25,0r-70,154r0,103r-23,0xm91,-320r26,0r-35,51r-18,0","w":159},"\u0178":{"d":"68,0r0,-103r-69,-154r24,0r57,128r56,-128r25,0r-70,154r0,103r-23,0xm42,-277r0,-37r22,0r0,37r-22,0xm96,-277r0,-37r22,0r0,37r-22,0","w":159},"\u017d":{"d":"8,0r0,-22r125,-216r-118,0r0,-19r142,0r0,22r-124,216r125,0r0,19r-150,0xm37,-320r22,0r24,36r24,-36r22,0r-35,51r-22,0","w":166},"\u00e1":{"d":"39,-134r-22,0v0,-39,19,-61,59,-61v84,0,54,94,54,163v0,14,5,17,17,16r0,16v-21,6,-41,0,-38,-28v-9,25,-29,32,-50,32v-61,0,-65,-96,-10,-107v24,-12,59,0,59,-41v0,-24,-14,-33,-33,-33v-26,0,-36,15,-36,43xm64,-14v40,0,48,-47,44,-94v-18,22,-74,12,-74,57v0,22,11,37,30,37xm88,-266r26,0r-36,51r-17,0","w":153},"\u00e2":{"d":"39,-134r-22,0v0,-39,19,-61,59,-61v84,0,54,94,54,163v0,14,5,17,17,16r0,16v-21,6,-41,0,-38,-28v-9,25,-29,32,-50,32v-61,0,-65,-96,-10,-107v24,-12,59,0,59,-41v0,-24,-14,-33,-33,-33v-26,0,-36,15,-36,43xm64,-14v40,0,48,-47,44,-94v-18,22,-74,12,-74,57v0,22,11,37,30,37xm53,-215r-22,0r35,-51r21,0r35,51r-22,0r-23,-36","w":153},"\u00e4":{"d":"39,-134r-22,0v0,-39,19,-61,59,-61v84,0,54,94,54,163v0,14,5,17,17,16r0,16v-21,6,-41,0,-38,-28v-9,25,-29,32,-50,32v-61,0,-65,-96,-10,-107v24,-12,59,0,59,-41v0,-24,-14,-33,-33,-33v-26,0,-36,15,-36,43xm64,-14v40,0,48,-47,44,-94v-18,22,-74,12,-74,57v0,22,11,37,30,37xm39,-222r0,-37r21,0r0,37r-21,0xm93,-222r0,-37r21,0r0,37r-21,0","w":153},"\u00e0":{"d":"39,-134r-22,0v0,-39,19,-61,59,-61v84,0,54,94,54,163v0,14,5,17,17,16r0,16v-21,6,-41,0,-38,-28v-9,25,-29,32,-50,32v-61,0,-65,-96,-10,-107v24,-12,59,0,59,-41v0,-24,-14,-33,-33,-33v-26,0,-36,15,-36,43xm64,-14v40,0,48,-47,44,-94v-18,22,-74,12,-74,57v0,22,11,37,30,37xm40,-266r25,0r27,51r-17,0","w":153},"\u00e5":{"d":"39,-134r-22,0v0,-39,19,-61,59,-61v84,0,54,94,54,163v0,14,5,17,17,16r0,16v-21,6,-41,0,-38,-28v-9,25,-29,32,-50,32v-61,0,-65,-96,-10,-107v24,-12,59,0,59,-41v0,-24,-14,-33,-33,-33v-26,0,-36,15,-36,43xm64,-14v40,0,48,-47,44,-94v-18,22,-74,12,-74,57v0,22,11,37,30,37xm42,-245v0,-19,16,-34,35,-34v19,0,34,15,34,34v0,19,-15,34,-34,34v-19,0,-35,-15,-35,-34xm55,-245v0,12,10,21,22,21v12,0,21,-9,21,-21v0,-12,-9,-21,-21,-21v-12,0,-22,9,-22,21","w":153},"\u00e3":{"d":"39,-134r-22,0v0,-39,19,-61,59,-61v84,0,54,94,54,163v0,14,5,17,17,16r0,16v-21,6,-41,0,-38,-28v-9,25,-29,32,-50,32v-61,0,-65,-96,-10,-107v24,-12,59,0,59,-41v0,-24,-14,-33,-33,-33v-26,0,-36,15,-36,43xm64,-14v40,0,48,-47,44,-94v-18,22,-74,12,-74,57v0,22,11,37,30,37xm109,-258r16,0v1,22,-23,46,-45,29v-12,-9,-34,-17,-36,7r-16,0v1,-31,35,-46,58,-23v11,10,23,-2,23,-13","w":153},"\u00e7":{"d":"60,35v-11,-10,9,-21,13,-31v-39,-1,-62,-29,-62,-100v0,-66,24,-99,66,-99v36,0,57,22,59,61r-22,0v-3,-30,-14,-43,-37,-43v-23,0,-43,14,-43,82v0,72,21,81,41,81v22,0,35,-16,39,-49r22,0v-3,36,-22,62,-50,67v-3,6,-12,12,-12,17v18,-7,41,5,40,22v-1,32,-46,36,-70,23r4,-11v13,8,50,6,47,-10v1,-14,-25,-16,-35,-10","w":146},"\u00e9":{"d":"117,-63r22,0v-3,41,-26,67,-62,67v-40,0,-64,-28,-64,-100v0,-66,24,-99,66,-99v44,0,63,35,61,100r-104,0v-2,53,18,81,41,81v23,0,36,-16,40,-49xm36,-113r81,0v-1,-48,-13,-64,-40,-64v-27,0,-40,16,-41,64xm90,-266r26,0r-36,51r-17,0","w":153},"\u00ea":{"d":"117,-63r22,0v-3,41,-26,67,-62,67v-40,0,-64,-28,-64,-100v0,-66,24,-99,66,-99v44,0,63,35,61,100r-104,0v-2,53,18,81,41,81v23,0,36,-16,40,-49xm36,-113r81,0v-1,-48,-13,-64,-40,-64v-27,0,-40,16,-41,64xm55,-215r-22,0r35,-51r21,0r35,51r-22,0r-24,-36","w":153},"\u00eb":{"d":"117,-63r22,0v-3,41,-26,67,-62,67v-40,0,-64,-28,-64,-100v0,-66,24,-99,66,-99v44,0,63,35,61,100r-104,0v-2,53,18,81,41,81v23,0,36,-16,40,-49xm36,-113r81,0v-1,-48,-13,-64,-40,-64v-27,0,-40,16,-41,64xm41,-222r0,-37r21,0r0,37r-21,0xm95,-222r0,-37r21,0r0,37r-21,0","w":153},"\u00e8":{"d":"117,-63r22,0v-3,41,-26,67,-62,67v-40,0,-64,-28,-64,-100v0,-66,24,-99,66,-99v44,0,63,35,61,100r-104,0v-2,53,18,81,41,81v23,0,36,-16,40,-49xm36,-113r81,0v-1,-48,-13,-64,-40,-64v-27,0,-40,16,-41,64xm41,-266r26,0r27,51r-17,0","w":153},"\u00ed":{"d":"22,0r0,-191r22,0r0,191r-22,0xm45,-266r25,0r-35,51r-17,0"},"\u00ee":{"d":"22,0r0,-191r22,0r0,191r-22,0xm9,-215r-21,0r34,-51r22,0r34,51r-21,0r-24,-36"},"\u00ef":{"d":"22,0r0,-191r22,0r0,191r-22,0xm-5,-222r0,-37r22,0r0,37r-22,0xm49,-222r0,-37r22,0r0,37r-22,0"},"\u00ec":{"d":"22,0r0,-191r22,0r0,191r-22,0xm-4,-266r26,0r27,51r-18,0"},"\u00f1":{"d":"21,0r0,-191r19,0v1,8,-2,20,1,26v22,-45,98,-42,98,21r0,144r-22,0r0,-138v0,-26,-10,-39,-32,-39v-67,2,-36,113,-43,177r-21,0xm112,-258r16,0v1,22,-23,46,-45,29v-12,-9,-34,-17,-35,7r-16,0v0,-31,34,-46,57,-23v11,10,24,-1,23,-13","w":159},"\u00f3":{"d":"11,-96v0,-66,24,-99,66,-99v42,0,66,33,66,99v0,67,-24,100,-66,100v-42,0,-66,-33,-66,-100xm34,-96v0,61,19,82,43,82v24,0,43,-21,43,-82v0,-61,-19,-81,-43,-81v-24,0,-43,20,-43,81xm88,-266r26,0r-36,51r-17,0","w":153},"\u00f4":{"d":"11,-96v0,-66,24,-99,66,-99v42,0,66,33,66,99v0,67,-24,100,-66,100v-42,0,-66,-33,-66,-100xm34,-96v0,61,19,82,43,82v24,0,43,-21,43,-82v0,-61,-19,-81,-43,-81v-24,0,-43,20,-43,81xm53,-215r-22,0r35,-51r21,0r35,51r-22,0r-23,-36","w":153},"\u00f6":{"d":"11,-96v0,-66,24,-99,66,-99v42,0,66,33,66,99v0,67,-24,100,-66,100v-42,0,-66,-33,-66,-100xm34,-96v0,61,19,82,43,82v24,0,43,-21,43,-82v0,-61,-19,-81,-43,-81v-24,0,-43,20,-43,81xm39,-222r0,-37r21,0r0,37r-21,0xm93,-222r0,-37r21,0r0,37r-21,0","w":153},"\u00f2":{"d":"11,-96v0,-66,24,-99,66,-99v42,0,66,33,66,99v0,67,-24,100,-66,100v-42,0,-66,-33,-66,-100xm34,-96v0,61,19,82,43,82v24,0,43,-21,43,-82v0,-61,-19,-81,-43,-81v-24,0,-43,20,-43,81xm40,-266r25,0r27,51r-17,0","w":153},"\u00f5":{"d":"11,-96v0,-66,24,-99,66,-99v42,0,66,33,66,99v0,67,-24,100,-66,100v-42,0,-66,-33,-66,-100xm34,-96v0,61,19,82,43,82v24,0,43,-21,43,-82v0,-61,-19,-81,-43,-81v-24,0,-43,20,-43,81xm109,-258r16,0v1,22,-23,46,-45,29v-12,-9,-34,-17,-36,7r-16,0v1,-31,35,-46,58,-23v11,10,23,-2,23,-13","w":153},"\u0161":{"d":"107,-48v0,-49,-93,-39,-93,-92v0,-39,25,-55,57,-55v38,0,54,20,53,58r-22,0v1,-27,-9,-41,-31,-40v-43,0,-49,52,-9,64v29,10,67,26,67,60v0,33,-19,57,-59,57v-41,1,-61,-19,-59,-65r22,0v-1,30,10,48,36,47v23,0,38,-13,38,-34xm24,-266r22,0r24,37r24,-37r22,0r-35,51r-22,0","w":140},"\u00fa":{"d":"21,-47r0,-144r21,0r0,134v0,31,11,43,34,43v64,0,35,-114,41,-177r22,0r0,191r-19,0v-1,-8,2,-21,-1,-27v-22,46,-98,43,-98,-20xm91,-266r26,0r-35,51r-18,0","w":159},"\u00fb":{"d":"21,-47r0,-144r21,0r0,134v0,31,11,43,34,43v64,0,35,-114,41,-177r22,0r0,191r-19,0v-1,-8,2,-21,-1,-27v-22,46,-98,43,-98,-20xm56,-215r-21,0r34,-51r22,0r34,51r-21,0r-24,-36","w":159},"\u00fc":{"d":"21,-47r0,-144r21,0r0,134v0,31,11,43,34,43v64,0,35,-114,41,-177r22,0r0,191r-19,0v-1,-8,2,-21,-1,-27v-22,46,-98,43,-98,-20xm42,-222r0,-37r22,0r0,37r-22,0xm96,-222r0,-37r22,0r0,37r-22,0","w":159},"\u00f9":{"d":"21,-47r0,-144r21,0r0,134v0,31,11,43,34,43v64,0,35,-114,41,-177r22,0r0,191r-19,0v-1,-8,2,-21,-1,-27v-22,46,-98,43,-98,-20xm43,-266r25,0r27,51r-17,0","w":159},"\u00fd":{"d":"58,2r-55,-193r23,0r43,165r39,-165r23,0r-56,206v-12,43,-25,50,-65,48r0,-18v32,7,41,-17,48,-43xm78,-266r26,0r-36,51r-17,0","w":133},"\u00ff":{"d":"58,2r-55,-193r23,0r43,165r39,-165r23,0r-56,206v-12,43,-25,50,-65,48r0,-18v32,7,41,-17,48,-43xm29,-222r0,-37r21,0r0,37r-21,0xm83,-222r0,-37r21,0r0,37r-21,0","w":133},"\u017e":{"d":"6,0r0,-18r91,-155r-86,0r0,-18r109,0r0,18r-90,155r90,0r0,18r-114,0xm18,-266r21,0r24,37r24,-37r22,0r-35,51r-22,0","w":126},"\u20ac":{"d":"159,-240r0,23v-9,-10,-25,-18,-47,-18v-38,0,-56,33,-59,77r91,0r-5,18r-88,0r0,29r79,0r-6,17r-71,0v0,76,63,96,106,61r0,23v-56,32,-127,9,-127,-84r-23,0r5,-17r16,0r0,-29r-21,0r5,-18r17,0v6,-57,28,-97,78,-97v24,0,42,7,50,15","w":172}}});
    /*!
     * The following copyright notice may not be removed under any circumstances.
     *
     * Copyright:
     * Copyright (c) 1990 Adobe Systems Incorporated.  All Rights Reserved.Helvetica
     * is a trademark of Linotype AG and/or its subsidiaries.
     *
     * Trademark:
     * Please refer to the Copyright section for the font trademark attribution
     * notices.
     *
     * Full name:
     * HelveticaNeue-MediumCondObl
     */
    Cufon.registerFont({"w":79,"face":{"font-family":"HelveticaNeue Condensed","font-weight":500,"font-style":"italic","font-stretch":"condensed","units-per-em":"360","panose-1":"2 11 6 6 0 0 0 0 0 0","ascent":"282","descent":"-78","x-height":"5","bbox":"-59 -342 371 78.0903","underline-thickness":"18","underline-position":"-18","slope":"-12","stemh":"31","stemv":"39","unicode-range":"U+0020-U+FB02"},"glyphs":{" ":{"w":86,"k":{"\u201c":13,"\u2018":13,"Y":13,"W":13,"V":13,"T":13,"A":13}},"\u00a0":{"w":86},"!":{"d":"36,-69r-6,-107r0,-81r41,0v1,66,-3,127,-7,188r-28,0xm30,0r0,-41r41,0r0,41r-41,0","w":100},"\"":{"d":"95,-154r0,-103r31,0r0,103r-31,0xm27,-154r0,-103r31,0r0,103r-31,0","w":153},"#":{"d":"64,-99r38,0r7,-52r-38,0xm-1,-72r0,-27r35,0r7,-52r-32,0r0,-27r36,0r10,-72r30,0r-10,72r38,0r10,-72r30,0r-10,72r31,0r0,27r-35,0r-7,52r31,0r0,27r-35,0r-10,72r-30,0r10,-72r-38,0r-10,72r-30,0r10,-72r-31,0","w":172},"$":{"d":"94,-103r0,77v45,-6,41,-72,0,-77xm78,-150r0,-74v-15,1,-28,13,-28,36v0,17,9,29,28,38xm78,36r0,-31v-64,-5,-73,-42,-72,-82r41,0v-1,30,6,47,31,51r0,-83v-39,-13,-69,-33,-69,-75v0,-41,30,-71,69,-71r0,-25r16,0r0,25v57,2,69,39,68,71r-41,0v1,-22,-4,-38,-27,-40r0,80v38,12,73,31,73,74v0,50,-28,72,-73,75r0,31r-16,0","w":172},"%":{"d":"62,-233v-15,0,-18,14,-18,47v0,33,3,47,18,47v15,0,19,-14,19,-47v0,-33,-4,-47,-19,-47xm179,-255r28,0r-115,260r-27,0xm211,-111v-15,0,-18,14,-18,47v0,33,3,47,18,47v15,0,18,-14,18,-47v0,-33,-3,-47,-18,-47xm62,-255v28,0,50,15,50,69v0,54,-22,69,-50,69v-28,0,-49,-15,-49,-69v0,-54,21,-69,49,-69xm211,-133v28,0,49,15,49,69v0,54,-21,69,-49,69v-28,0,-49,-15,-49,-69v0,-54,21,-69,49,-69","w":273},"&":{"d":"107,-141r45,63v7,-11,11,-27,10,-44r32,0v0,19,-3,45,-22,73r35,49r-44,0r-15,-22v-17,15,-36,27,-65,27v-96,0,-91,-100,-39,-138r16,-12v-10,-16,-27,-37,-27,-57v0,-37,28,-55,62,-55v19,0,56,9,56,52v1,30,-23,49,-44,64xm68,-208v0,14,13,53,30,35v21,-12,29,-57,-6,-57v-10,0,-24,5,-24,22xm78,-121v-16,13,-32,29,-32,52v0,43,64,53,84,21","w":206},"\u2019":{"d":"23,-210r0,-47r41,0v-1,50,8,95,-41,103r0,-21v13,-3,19,-16,18,-35r-18,0","w":86,"k":{"s":13,"r":6,"d":13,"\u2019":22}},"(":{"d":"66,-257r27,0v-55,92,-55,229,0,323r-27,0v-28,-37,-53,-95,-53,-161v0,-66,25,-125,53,-162","w":93},")":{"d":"27,66r-27,0v56,-92,55,-229,0,-323r28,0v28,37,52,96,52,162v0,66,-25,124,-53,161","w":93},"*":{"d":"55,-257r24,0r0,45r40,-16r8,24r-41,12r28,37r-20,15r-27,-37r-27,37r-20,-15r28,-37r-42,-12r8,-24r41,16r0,-45","w":133},"+":{"d":"93,-107r0,-75r30,0r0,75r76,0r0,31r-76,0r0,76r-30,0r0,-76r-76,0r0,-31r76,0","w":216},",":{"d":"23,0r0,-48r41,0v-1,50,8,95,-41,103r0,-20v12,-3,19,-17,18,-35r-18,0","w":86,"k":{"\u201d":27,"\u2019":27," ":13}},"-":{"d":"16,-86r0,-36r95,0r0,36r-95,0","w":126},"\u00ad":{"d":"16,-86r0,-36r95,0r0,36r-95,0","w":126},".":{"d":"23,0r0,-48r41,0r0,48r-41,0","w":86,"k":{"\u201d":27,"\u2019":27}},"\/":{"d":"-4,5r82,-267r32,0r-82,267r-32,0","w":106},"0":{"d":"51,-125v0,74,7,101,35,101v28,0,36,-27,36,-101v0,-74,-8,-101,-36,-101v-28,0,-35,27,-35,101xm10,-125v0,-99,27,-130,76,-130v49,0,77,31,77,130v0,99,-28,130,-77,130v-49,0,-76,-31,-76,-130","w":172},"1":{"d":"116,0r-41,0r0,-185r-53,0r0,-27v28,0,60,-5,64,-43r30,0r0,255","w":172},"2":{"d":"161,-35r0,35r-149,0v0,-111,107,-109,107,-188v0,-21,-9,-38,-32,-38v-31,0,-36,27,-36,53r-38,0v0,-51,21,-82,75,-82v52,0,72,31,72,68v0,85,-83,90,-102,152r103,0","w":172},"3":{"d":"11,-71r39,0v0,22,7,47,35,47v26,0,36,-20,36,-45v1,-37,-18,-52,-58,-48r0,-29v35,4,53,-12,52,-43v0,-18,-9,-37,-30,-37v-25,0,-32,22,-32,45r-39,0v0,-48,24,-74,73,-74v31,0,69,14,69,65v1,27,-18,51,-41,57v26,2,47,23,47,59v0,50,-25,79,-78,79v-46,0,-73,-23,-73,-76","w":172},"4":{"d":"8,-57r0,-36r88,-162r42,0r0,165r27,0r0,33r-27,0r0,57r-39,0r0,-57r-91,0xm99,-90r-1,-105r-57,105r58,0","w":172},"5":{"d":"83,5v-47,0,-73,-25,-71,-74r38,0v-2,24,8,42,34,43v28,0,36,-28,36,-58v0,-30,-8,-54,-34,-54v-17,0,-29,9,-33,23r-37,-1r13,-134r123,0r0,33r-93,0v-2,22,-8,47,-7,68v11,-12,26,-20,43,-20v53,0,66,45,66,84v0,51,-23,90,-78,90","w":172},"6":{"d":"159,-193r-41,0v0,-15,-6,-33,-27,-33v-38,-1,-43,54,-40,88v33,-50,113,-29,113,49v0,59,-24,94,-78,94v-64,0,-77,-49,-77,-122v0,-76,14,-138,81,-138v45,0,69,20,69,62xm54,-77v0,30,11,53,35,53v25,0,34,-24,34,-54v0,-35,-11,-56,-34,-56v-30,0,-35,26,-35,57","w":172},"7":{"d":"11,-213r0,-37r151,0r0,33v-40,52,-74,140,-80,217r-43,0v6,-76,42,-161,83,-213r-111,0","w":172},"8":{"d":"54,-188v0,21,6,39,32,39v26,0,32,-18,32,-39v0,-20,-6,-38,-32,-38v-26,0,-32,18,-32,38xm50,-72v0,27,7,48,36,48v29,0,36,-21,36,-48v0,-27,-7,-48,-36,-48v-29,0,-36,21,-36,48xm86,5v-52,0,-77,-26,-77,-76v-1,-39,21,-57,44,-65v-22,-8,-35,-24,-35,-55v0,-40,26,-64,68,-64v73,0,93,101,34,119v66,18,56,141,-34,141","w":172},"9":{"d":"14,-57r41,0v0,15,6,33,27,33v38,1,43,-54,40,-88v-33,50,-113,29,-113,-49v0,-59,24,-94,78,-94v64,0,77,49,77,122v0,76,-15,138,-82,138v-45,0,-68,-20,-68,-62xm119,-173v0,-30,-11,-53,-35,-53v-25,0,-34,25,-34,55v0,35,11,55,34,55v30,0,35,-26,35,-57","w":172},":":{"d":"23,-137r0,-47r41,0r0,47r-41,0xm23,0r0,-48r41,0r0,48r-41,0","w":86,"k":{" ":13}},";":{"d":"23,0r0,-48r41,0v-1,50,8,95,-41,103r0,-20v12,-3,19,-17,18,-35r-18,0xm23,-137r0,-47r41,0r0,47r-41,0","w":86},"<":{"d":"17,-78r0,-26r182,-82r0,31r-145,64r145,64r0,31","w":216},"=":{"d":"17,-113r0,-31r182,0r0,31r-182,0xm17,-38r0,-31r182,0r0,31r-182,0","w":216},">":{"d":"199,-104r0,26r-182,82r0,-31r145,-64r-145,-64r0,-31","w":216},"?":{"d":"61,-69v-11,-70,50,-67,52,-124v0,-20,-7,-38,-29,-38v-24,0,-33,21,-33,51r-38,0v0,-45,19,-82,71,-82v45,0,70,25,70,69v-1,69,-64,67,-56,124r-37,0xm58,0r0,-41r41,0r0,41r-41,0","w":166},"@":{"d":"130,-76v38,2,72,-101,17,-101v-30,0,-51,36,-51,65v0,22,11,36,34,36xm194,-198r26,0r-31,115v0,5,3,8,12,8v20,0,44,-33,44,-73v0,-51,-45,-85,-95,-85v-63,0,-107,50,-107,106v0,104,133,130,193,72r30,0v-19,35,-60,60,-119,60v-76,0,-137,-50,-137,-134v0,-75,56,-133,140,-133v73,0,128,45,128,110v0,72,-57,103,-92,103v-19,1,-23,-12,-26,-22v-27,37,-94,25,-94,-37v0,-69,83,-135,121,-68","w":288},"A":{"d":"64,-96r61,0r-31,-126xm-3,0r73,-257r52,0r68,257r-43,0r-16,-63r-75,0r-16,63r-43,0","w":186,"k":{"\u201d":20,"y":6,"w":6,"v":6,"Y":20,"W":11,"V":11,"T":20,"\u2019":20}},"B":{"d":"62,-149v39,3,71,-2,70,-40v-1,-43,-33,-37,-70,-37r0,77xm62,-31v44,1,79,3,79,-45v0,-44,-35,-47,-79,-44r0,89xm21,0r0,-257v72,1,153,-15,153,62v0,31,-12,51,-38,59v28,5,46,22,46,66v0,43,-31,70,-79,70r-82,0","w":193,"k":{".":11,",":11}},"C":{"d":"138,-92r41,0v1,50,-17,97,-79,97v-65,0,-85,-42,-85,-134v0,-92,20,-133,85,-133v75,0,78,53,78,85r-41,0v0,-27,-6,-54,-37,-54v-30,0,-44,18,-44,101v0,83,14,104,44,104v35,-1,38,-39,38,-66","w":186,"k":{".":6,",":6}},"D":{"d":"62,-226r0,195v67,3,82,-3,82,-98v0,-91,-15,-101,-82,-97xm21,0r0,-257r73,0v81,0,91,52,91,128v0,76,-10,129,-91,129r-73,0","w":200,"k":{"Y":6,".":14,",":14}},"E":{"d":"21,0r0,-257r139,0r0,35r-98,0r0,71r92,0r0,34r-92,0r0,82r101,0r0,35r-142,0","w":173},"F":{"d":"21,0r0,-257r137,0r0,35r-96,0r0,71r91,0r0,34r-91,0r0,117r-41,0","w":166,"k":{"A":13,".":46,",":46}},"G":{"d":"148,0r0,-30v-11,24,-27,35,-57,35v-56,0,-76,-42,-76,-134v0,-92,26,-133,85,-133v66,0,77,49,76,79r-39,0v1,-24,-6,-48,-36,-48v-29,0,-45,19,-45,101v0,83,14,104,42,104v31,0,42,-22,42,-78r-43,0r0,-31r82,0r0,135r-31,0","w":193,"k":{".":6,",":6}},"H":{"d":"21,0r0,-257r41,0r0,103r76,0r0,-103r41,0r0,257r-41,0r0,-120r-76,0r0,120r-41,0","w":200},"I":{"d":"19,0r0,-257r41,0r0,257r-41,0"},"J":{"d":"6,-77r39,0v0,26,0,51,27,51v27,0,27,-25,27,-51r0,-180r41,0r0,186v0,57,-28,76,-69,76v-60,0,-66,-36,-65,-82","w":159,"k":{".":14,",":14}},"K":{"d":"21,0r0,-257r41,0r1,112r78,-112r45,0r-74,108r82,149r-47,0r-62,-116r-23,33r0,83r-41,0","w":186},"L":{"d":"17,0r0,-257r41,0r0,222r99,0r0,35r-140,0","w":159,"k":{"\u201d":40,"y":13,"Y":33,"W":27,"V":27,"T":33,"\u2019":40}},"M":{"d":"21,0r0,-257r64,0r46,190r45,-190r63,0r0,257r-39,0r-1,-214r-52,214r-34,0r-53,-214r0,214r-39,0","w":259},"N":{"d":"21,0r0,-257r50,0r76,191r0,-191r38,0r0,257r-50,0r-75,-197r0,197r-39,0","w":206,"k":{".":6,",":6}},"O":{"d":"100,5v-59,0,-85,-42,-85,-134v0,-92,26,-133,85,-133v59,0,85,41,85,133v0,92,-26,134,-85,134xm100,-26v24,0,44,-15,44,-104v0,-86,-20,-101,-44,-101v-24,0,-44,15,-44,101v0,89,20,104,44,104","w":200,"k":{"Y":14,"X":6,"V":6,"T":11,"A":6,".":14,",":14}},"P":{"d":"62,-226r0,89v40,2,67,1,70,-44v2,-39,-28,-49,-70,-45xm21,0r0,-257r82,0v49,0,71,31,71,75v1,60,-45,83,-112,76r0,106r-41,0","w":180,"k":{"A":13,".":54,",":54}},"Q":{"d":"167,23r-27,-27v-77,29,-125,-14,-125,-125v0,-92,26,-133,85,-133v59,0,85,41,85,133v0,48,-8,83,-20,102r26,28xm95,-48r24,-23r17,17v6,-15,8,-40,8,-76v0,-86,-20,-101,-44,-101v-24,0,-44,15,-44,101v0,98,16,108,59,102","w":200,"k":{".":6,",":6}},"R":{"d":"142,0v-20,-30,12,-119,-46,-112r-34,0r0,112r-41,0r0,-257v75,3,156,-19,156,66v0,34,-17,58,-43,64v26,3,40,16,41,52v1,27,-4,67,13,75r-46,0xm62,-143v40,3,74,-1,74,-41v0,-42,-33,-45,-74,-42r0,83","w":193,"k":{"Y":6,"T":6}},"S":{"d":"12,-80r41,0v-2,34,12,55,42,54v26,0,39,-18,39,-37v2,-40,-36,-45,-65,-56v-37,-14,-54,-33,-54,-70v0,-47,32,-73,80,-73v68,0,73,40,73,73r-41,0v1,-26,-8,-42,-36,-42v-18,0,-34,10,-34,37v0,32,38,45,66,54v36,13,52,33,52,68v0,55,-33,77,-85,77v-67,0,-79,-42,-78,-85","w":186,"k":{".":11,",":11}},"T":{"d":"63,0r0,-222r-61,0r0,-35r163,0r0,35r-61,0r0,222r-41,0","w":166,"k":{"y":27,"w":27,"u":27,"r":27,"o":27,"i":6,"e":27,"a":27,"O":11,"A":20,";":27,":":27,".":33,"-":27,",":33}},"U":{"d":"18,-257r41,0r0,184v0,32,13,47,38,47v24,0,37,-15,37,-47r0,-184r41,0r0,181v0,59,-29,81,-78,81v-49,0,-79,-22,-79,-81r0,-181","w":193,"k":{".":11,",":11}},"V":{"d":"58,0r-60,-257r43,0r45,205r46,-205r43,0r-64,257r-53,0","w":173,"k":{"u":6,"o":6,"e":6,"a":6,"A":13,";":6,":":6,".":33,"-":6,",":33}},"W":{"d":"52,0r-50,-257r42,0r34,200r34,-200r43,0r35,201r34,-201r41,0r-52,257r-47,0r-34,-194r-33,194r-47,0","w":266,"k":{"y":6,"o":6,"e":6,"a":6,"A":11,".":27,"-":6,",":27}},"X":{"d":"0,0r68,-131r-62,-126r45,0r41,85r40,-85r45,0r-63,126r66,131r-45,0r-45,-93r-46,93r-44,0","w":180},"Y":{"d":"65,0r0,-100r-66,-157r45,0r43,111r45,-111r43,0r-69,157r0,100r-41,0","w":173,"k":{"u":18,"o":20,"i":6,"e":20,"a":20,"S":6,"O":14,"A":20,";":13,":":13,".":40,"-":27,",":40}},"Z":{"d":"6,0r0,-32r108,-190r-101,0r0,-35r146,0r0,35r-108,187r109,0r0,35r-154,0","w":166},"[":{"d":"28,66r0,-323r73,0r0,29r-37,0r0,265r37,0r0,29r-73,0","w":100},"\\":{"d":"78,5r-82,-267r32,0r82,267r-32,0","w":106},"]":{"d":"-1,66r0,-29r37,0r0,-265r-37,0r0,-29r73,0r0,323r-73,0","w":100},"^":{"d":"165,-101r-57,-118r-57,118r-30,0r73,-149r27,0r74,149r-30,0","w":216},"_":{"d":"0,45r0,-18r180,0r0,18r-180,0","w":180},"\u2018":{"d":"23,-154v1,-50,-8,-95,41,-103r0,21v-12,3,-19,16,-18,34r18,0r0,48r-41,0","w":86,"k":{"\u2018":22,"A":20}},"a":{"d":"146,-151r0,111v-1,9,8,16,16,12r0,25v-19,10,-50,4,-52,-20v-20,44,-99,37,-99,-26v0,-57,36,-57,75,-69v14,-4,23,-8,23,-25v0,-18,-6,-29,-27,-29v-26,0,-29,18,-29,37r-37,0v0,-41,17,-64,68,-64v34,0,62,14,62,48xm109,-102v-20,15,-59,12,-59,49v0,16,8,29,24,29v34,2,37,-40,35,-78","w":166,"k":{"v":2}},"b":{"d":"19,0r0,-257r39,0r0,86v7,-17,23,-28,44,-28v30,0,60,14,60,100v0,67,-18,104,-63,104v-29,1,-37,-18,-44,-29r0,24r-36,0xm55,-95v0,41,6,69,33,69v27,0,33,-28,33,-72v0,-52,-8,-70,-30,-70v-30,0,-36,27,-36,73","w":173,"k":{"y":4,".":13,",":13}},"c":{"d":"113,-71r36,0v-3,46,-18,76,-66,76v-56,0,-72,-42,-72,-102v0,-60,16,-102,72,-102v58,0,67,46,67,70r-39,0v0,-18,-5,-41,-28,-41v-28,0,-33,30,-33,73v0,43,5,73,33,73v22,0,30,-18,30,-47","w":159,"k":{"y":6,"k":2,"h":2,".":13,",":13}},"d":{"d":"118,0v-1,-7,2,-18,-1,-24v-5,13,-14,29,-42,29v-45,0,-64,-37,-64,-104v0,-86,30,-100,60,-100v22,-1,36,13,45,28r0,-86r38,0r0,257r-36,0xm118,-95v0,-46,-6,-73,-36,-73v-22,0,-30,18,-30,70v0,44,6,72,33,72v27,0,33,-28,33,-69","w":173,"k":{"y":2}},"e":{"d":"153,-92r-101,0v0,32,0,70,33,70v28,0,31,-31,31,-43r36,0v0,43,-26,70,-68,70v-32,0,-71,-9,-71,-99v0,-51,11,-105,72,-105v61,0,70,45,68,107xm52,-118r62,0v1,-28,-3,-54,-29,-54v-26,0,-34,27,-33,54","w":166,"k":{"x":2,".":13,",":13}},"f":{"d":"31,0r0,-165r-27,0r0,-29r27,0v-6,-53,19,-73,70,-65r0,30v-26,-3,-36,8,-32,35r32,0r0,29r-32,0r0,165r-38,0","w":100,"k":{"\u201d":-6,".":13,",":13,"\u2019":-6}},"g":{"d":"21,17r37,0v0,12,11,23,28,23v31,1,34,-34,32,-68v-7,17,-25,27,-44,27v-45,0,-58,-45,-58,-98v0,-42,6,-100,61,-100v24,-1,38,17,44,29r0,-24r36,0r0,185v0,47,-20,75,-72,75v-58,0,-64,-33,-64,-49xm55,-103v0,33,1,71,30,71v30,0,33,-38,33,-69v0,-32,-4,-67,-31,-67v-28,0,-32,29,-32,65","w":173,"k":{"r":-2,".":6,",":6}},"h":{"d":"19,0r0,-257r39,0r1,85v23,-40,95,-40,95,26r0,146r-38,0r0,-133v0,-25,-8,-35,-27,-35v-16,0,-31,13,-31,38r0,130r-39,0","w":173,"k":{"y":2}},"i":{"d":"21,0r0,-194r38,0r0,194r-38,0xm21,-221r0,-39r38,0r0,39r-38,0"},"j":{"d":"21,-194r38,0r0,207v1,47,-26,57,-68,52r0,-30v21,1,30,-1,30,-26r0,-203xm21,-260r38,0r0,39r-38,0r0,-39"},"k":{"d":"19,0r0,-257r39,0r0,144r59,-81r45,0r-58,75r66,119r-43,0r-47,-88r-22,26r0,62r-39,0","w":166,"k":{"y":2,"o":2,"e":2}},"l":{"d":"21,0r0,-257r38,0r0,257r-38,0"},"m":{"d":"21,0r0,-194r36,0v1,7,-2,18,1,23v16,-37,85,-35,92,2v20,-43,96,-44,96,22r0,147r-39,0r0,-133v0,-25,-7,-35,-23,-35v-16,0,-31,13,-31,38r0,130r-39,0r0,-133v0,-25,-8,-35,-24,-35v-15,0,-31,13,-31,38r0,130r-38,0","w":266},"n":{"d":"19,0r0,-194r36,0v1,7,-3,20,2,23v20,-40,97,-43,97,25r0,146r-38,0r0,-133v0,-25,-8,-35,-27,-35v-16,0,-31,13,-31,38r0,130r-39,0","w":173},"o":{"d":"11,-97v0,-60,16,-102,72,-102v57,0,73,42,73,102v0,60,-19,102,-73,102v-54,0,-72,-42,-72,-102xm50,-97v0,49,5,73,33,73v28,0,34,-24,34,-73v0,-43,-6,-73,-34,-73v-28,0,-33,30,-33,73","w":166,"k":{"y":2,"w":2,"v":2,".":6,",":6}},"p":{"d":"19,63r0,-257r36,0v1,7,-2,18,1,24v8,-17,23,-29,44,-29v44,0,62,38,62,105v0,81,-33,99,-60,99v-21,0,-37,-11,-44,-28r0,86r-39,0xm55,-99v0,46,7,73,34,73v22,0,32,-16,32,-70v0,-44,-6,-72,-33,-72v-27,0,-33,28,-33,69","w":173,"k":{"y":2,".":6,",":6}},"q":{"d":"116,63r-1,-86v-7,17,-23,28,-44,28v-30,0,-60,-21,-60,-99v0,-67,19,-105,64,-105v29,-1,36,18,43,29r0,-24r36,0r0,257r-38,0xm118,-99v0,-41,-6,-69,-33,-69v-27,0,-33,28,-33,72v0,52,10,70,30,70v30,0,36,-27,36,-73","w":173},"r":{"d":"19,0r0,-194r39,0r0,31v10,-25,28,-41,55,-34r0,39v-29,-5,-55,-2,-55,42r0,116r-39,0","w":113,"k":{"y":-6,"v":-6,"q":4,"n":-4,"m":-4,"g":2,"e":2,"d":2,"c":2,"a":2,".":33,"-":20,",":33,"\u2019":-4}},"s":{"d":"139,-137r-37,0v1,-19,-3,-34,-25,-35v-15,0,-28,7,-28,25v0,24,32,30,52,37v29,10,42,25,42,56v0,41,-30,59,-69,59v-52,0,-65,-25,-64,-67r35,0v-1,25,6,40,30,40v39,0,41,-46,10,-56v-34,-11,-73,-22,-73,-67v0,-36,26,-54,66,-54v53,0,62,29,61,62","w":153},"t":{"d":"1,-165r0,-29r27,0r0,-55r39,0r0,55r32,0r0,29r-32,0r0,116v-2,21,16,22,32,19r0,29v-36,5,-71,12,-71,-44r0,-120r-27,0","w":100},"u":{"d":"118,0v-1,-7,2,-18,-1,-23v-25,40,-98,46,-98,-35r0,-136r39,0r0,139v0,22,9,29,26,29v17,0,32,-10,32,-32r0,-136r38,0r0,194r-36,0","w":173},"v":{"d":"54,0r-51,-194r41,0r35,153r30,-153r42,0r-51,194r-46,0","w":153,"k":{"a":4,".":27,",":27}},"w":{"d":"49,0r-44,-194r41,0r27,153r29,-153r44,0r30,153r26,-153r39,0r-44,194r-44,0r-31,-150r-27,150r-46,0","w":246,"k":{"o":2,"a":4,".":20,",":20}},"x":{"d":"1,0r53,-100r-50,-94r42,0r31,64r31,-64r42,0r-50,94r52,100r-42,0r-34,-72r-34,72r-41,0","w":153},"y":{"d":"3,-194r42,0r34,146r31,-146r40,0r-53,201v-16,60,-32,61,-83,58r0,-31v26,6,41,-7,44,-30","w":153,"k":{"e":2,".":27,",":27}},"z":{"d":"9,0r0,-30r85,-131r-80,0r0,-33r124,0r0,32r-82,129r82,0r0,33r-129,0","w":146},"{":{"d":"3,-84r0,-23v37,-3,28,-62,29,-103v1,-42,26,-50,66,-47r0,22v-46,-9,-30,53,-30,91v0,35,-25,44,-33,49v9,2,33,14,33,48v0,35,-20,97,30,91r0,22v-40,3,-65,-4,-66,-47v-1,-42,8,-99,-29,-103","w":100},"|":{"d":"24,5r0,-267r31,0r0,267r-31,0"},"}":{"d":"98,-107r0,23v-37,3,-30,61,-30,103v0,42,-26,51,-65,47r0,-22v45,8,29,-54,29,-91v0,-35,25,-44,33,-49v-9,-2,-33,-14,-33,-48v0,-35,20,-97,-29,-91r0,-22v39,-3,64,5,65,47v1,42,-8,100,30,103","w":100},"~":{"d":"146,-63v-25,0,-56,-24,-77,-26v-11,0,-21,9,-31,28r-13,-27v10,-21,28,-32,45,-32v41,2,85,57,108,-1r13,27v-11,19,-28,31,-45,31","w":216},"\u00a1":{"d":"64,-125r7,107r0,81r-41,0v-1,-66,2,-127,6,-188r28,0xm71,-194r0,41r-41,0r0,-41r41,0","w":100},"\u00a2":{"d":"81,-24r0,-146v-36,8,-35,138,0,146xm81,37r0,-32v-49,-4,-64,-45,-64,-102v0,-57,15,-98,64,-102r0,-27r15,0r0,27v51,3,60,47,60,70r-39,0v0,-16,-4,-37,-21,-41r0,146v17,-5,23,-22,23,-47r37,0v-3,44,-18,73,-60,76r0,32r-15,0","w":172},"\u00a3":{"d":"6,-113r0,-25r25,0v-33,-48,-21,-117,57,-117v59,0,77,34,76,74r-39,0v0,-20,-3,-45,-35,-45v-54,0,-34,62,-16,88r60,0r0,25r-50,0v12,38,-12,65,-39,83v6,3,18,-10,27,-7v29,8,61,17,83,-4v3,11,20,27,6,33v-43,36,-101,-21,-142,10r-15,-28v25,-12,57,-50,38,-87r-36,0","w":172},"\u2044":{"d":"-59,11r152,-272r26,0r-151,272r-27,0","w":60},"\u2215":{"d":"-59,11r152,-272r26,0r-151,272r-27,0","w":60},"\u00a5":{"d":"66,0r0,-58r-51,0r0,-25r51,0v0,-10,0,-20,-4,-25r-47,0r0,-24r36,0r-50,-118r44,0r41,102r43,-102r43,0r-53,118r36,0r0,24r-47,0v-4,5,-4,15,-4,25r51,0r0,25r-51,0r0,58r-38,0","w":172},"\u0192":{"d":"34,-156r38,0v11,-46,10,-103,69,-101v10,0,19,1,27,3r-5,27v-43,-14,-46,38,-54,71r40,0r-4,24r-41,0r-27,134v-7,48,-36,68,-86,59r6,-28v24,6,37,-1,43,-28r28,-137r-38,0","w":172},"\u00a7":{"d":"130,-94v-4,-35,-41,-38,-64,-55v-10,7,-24,16,-23,31v2,25,50,38,69,54v8,-8,20,-16,18,-30xm153,-206r-39,0v0,-18,-10,-27,-28,-27v-37,0,-35,38,-1,54v32,15,80,35,80,80v0,21,-12,39,-29,50v43,36,11,105,-48,105v-48,0,-70,-28,-70,-66r39,0v0,20,9,35,31,35v15,0,27,-10,27,-27v0,-57,-108,-45,-106,-111v0,-24,15,-42,33,-52v-47,-28,-15,-97,45,-97v53,0,66,32,66,56","w":173},"\u00a4":{"d":"2,-57r19,-18v-22,-26,-22,-74,0,-100r-19,-18r16,-17r19,19v27,-22,72,-22,99,0r18,-19r17,17r-19,18v22,27,22,73,0,100r19,18r-17,17r-18,-19v-27,23,-72,22,-99,0r-19,19xm86,-69v30,0,54,-24,54,-56v0,-32,-24,-56,-54,-56v-30,0,-54,24,-54,56v0,32,24,56,54,56","w":172},"'":{"d":"28,-154r0,-103r31,0r0,103r-31,0","w":86},"\u201c":{"d":"24,-154v1,-50,-8,-95,41,-103r0,21v-12,3,-19,16,-18,34r18,0r0,48r-41,0xm88,-154v1,-50,-8,-95,41,-103r0,21v-12,3,-19,16,-18,34r18,0r0,48r-41,0","w":153,"k":{"A":20}},"\u00ab":{"d":"77,-84r0,-41r52,-48r0,39r-32,30r32,29r0,40xm18,-84r0,-41r52,-48r0,39r-32,30r32,29r0,40","w":146},"\u2039":{"d":"17,-84r0,-41r52,-48r0,39r-32,30r32,29r0,40","w":86},"\u203a":{"d":"69,-125r0,41r-52,49r0,-40r32,-29r-32,-30r0,-39","w":86},"\ufb01":{"d":"121,0r0,-194r38,0r0,194r-38,0xm121,-221r0,-39r38,0r0,39r-38,0xm31,0r0,-165r-27,0r0,-29r27,0v-6,-53,19,-73,70,-65r0,30v-26,-3,-36,8,-32,35r32,0r0,29r-32,0r0,165r-38,0","w":180},"\ufb02":{"d":"121,0r0,-257r38,0r0,257r-38,0xm31,0r0,-165r-27,0r0,-29r27,0v-6,-53,19,-73,70,-65r0,30v-26,-3,-36,8,-32,35r32,0r0,29r-32,0r0,165r-38,0","w":180},"\u2013":{"d":"0,-87r0,-34r180,0r0,34r-180,0","w":180},"\u2020":{"d":"67,-184r0,-73r39,0r0,73r62,0r0,32r-62,0r0,203r-39,0r0,-203r-61,0r0,-32r61,0","w":173},"\u2021":{"d":"67,-187r0,-70r39,0r0,70r62,0r0,31r-62,0r0,105r62,0r0,30r-62,0r0,72r-39,0r0,-72r-62,0r0,-30r62,0r0,-105r-62,0r0,-31r62,0","w":173},"\u00b7":{"d":"17,-111v0,-14,12,-26,26,-26v14,0,26,12,26,26v0,14,-12,26,-26,26v-14,0,-26,-12,-26,-26","w":86},"\u2219":{"d":"17,-111v0,-14,12,-26,26,-26v14,0,26,12,26,26v0,14,-12,26,-26,26v-14,0,-26,-12,-26,-26","w":86},"\u00b6":{"d":"159,51r0,-284r-39,0r0,284r-33,0r0,-175v-37,0,-68,-27,-68,-65v0,-80,94,-68,173,-68r0,308r-33,0","w":216},"\u2022":{"d":"26,-129v0,-35,29,-64,64,-64v35,0,64,29,64,64v0,35,-29,65,-64,65v-35,0,-64,-30,-64,-65","w":180},"\u201a":{"d":"23,0r0,-48r41,0v-1,50,8,95,-41,103r0,-20v12,-3,19,-17,18,-35r-18,0","w":86},"\u201e":{"d":"88,0r0,-48r41,0v-1,50,8,95,-41,103r0,-20v12,-3,19,-17,18,-35r-18,0xm24,0r0,-48r41,0v-1,50,8,95,-41,103r0,-20v12,-3,19,-17,18,-35r-18,0","w":153},"\u201d":{"d":"88,-210r0,-47r41,0v-1,50,8,95,-41,103r0,-21v13,-3,19,-16,18,-35r-18,0xm24,-210r0,-47r41,0v-1,50,8,95,-41,103r0,-21v13,-3,19,-16,18,-35r-18,0","w":153,"k":{" ":13}},"\u00bb":{"d":"70,-125r0,41r-52,49r0,-40r32,-29r-32,-30r0,-39xm129,-125r0,41r-52,49r0,-40r31,-29r-31,-30r0,-39","w":146},"\u2026":{"d":"40,0r0,-48r41,0r0,48r-41,0xm159,0r0,-48r42,0r0,48r-42,0xm279,0r0,-48r41,0r0,48r-41,0","w":360},"\u2030":{"d":"322,-111v-15,0,-19,14,-19,47v0,33,4,47,19,47v15,0,18,-14,18,-47v0,-33,-3,-47,-18,-47xm175,-255r28,0r-115,260r-27,0xm58,-233v-15,0,-18,14,-18,47v0,33,3,47,18,47v15,0,19,-14,19,-47v0,-33,-4,-47,-19,-47xm322,-133v28,0,49,15,49,69v0,54,-21,69,-49,69v-28,0,-49,-15,-49,-69v0,-54,21,-69,49,-69xm58,-255v28,0,50,15,50,69v0,54,-22,69,-50,69v-28,0,-49,-15,-49,-69v0,-54,21,-69,49,-69xm207,-111v-15,0,-18,14,-18,47v0,33,3,47,18,47v15,0,18,-14,18,-47v0,-33,-3,-47,-18,-47xm207,-133v28,0,49,15,49,69v0,54,-21,69,-49,69v-28,0,-49,-15,-49,-69v0,-54,21,-69,49,-69","w":380},"\u00bf":{"d":"106,-125v11,70,-50,67,-52,124v0,20,7,38,29,38v24,0,32,-20,32,-50r39,0v0,45,-19,81,-71,81v-45,0,-70,-25,-70,-69v1,-70,65,-66,56,-124r37,0xm108,-194r0,41r-41,0r0,-41r41,0","w":166},"`":{"d":"33,-219r-38,-52r43,0r22,52r-27,0"},"\u00b4":{"d":"20,-219r22,-52r43,0r-38,52r-27,0"},"\u02c6":{"d":"-12,-219r33,-52r39,0r32,52r-33,0r-19,-32r-21,32r-31,0"},"\u02dc":{"d":"22,-265v15,0,48,28,50,-1r22,0v0,16,-10,43,-31,43v-22,-1,-51,-29,-55,2r-22,0v0,-15,9,-44,36,-44"},"\u00af":{"d":"-11,-257r102,0r0,22r-102,0r0,-22"},"\u02c9":{"d":"-11,-257r102,0r0,22r-102,0r0,-22"},"\u02d8":{"d":"-8,-267r22,0v0,9,9,24,26,24v17,0,26,-15,26,-24r22,0v0,27,-17,48,-48,48v-31,0,-48,-21,-48,-48"},"\u02d9":{"d":"23,-226r0,-39r34,0r0,39r-34,0"},"\u00a8":{"d":"53,-226r0,-39r34,0r0,39r-34,0xm-7,-226r0,-39r34,0r0,39r-34,0"},"\u02da":{"d":"20,-252v0,11,9,21,20,21v11,0,20,-10,20,-21v0,-11,-9,-20,-20,-20v-11,0,-20,9,-20,20xm2,-252v0,-21,17,-38,38,-38v21,0,38,17,38,38v0,21,-17,39,-38,39v-21,0,-38,-18,-38,-39"},"\u00b8":{"d":"35,0r18,0r-15,21v20,-7,42,5,42,24v0,33,-51,39,-78,27r6,-15v13,5,42,11,43,-9v1,-20,-30,-5,-36,-17"},"\u02dd":{"d":"-23,-219r22,-52r43,0r-38,52r-27,0xm49,-219r22,-52r43,0r-38,52r-27,0"},"\u02db":{"d":"9,46v2,-20,18,-49,53,-46v-19,17,-25,31,-25,41v-1,20,19,25,37,18r2,16v-29,7,-68,4,-67,-29"},"\u02c7":{"d":"20,-219r-32,-52r33,0r19,32r21,-32r31,0r-33,52r-39,0"},"\u2014":{"d":"0,-87r0,-34r360,0r0,34r-360,0","w":360},"\u00c6":{"d":"72,-96r49,0r0,-128r-3,0xm-4,0r98,-257r157,0r0,35r-91,0r0,71r86,0r0,34r-86,0r0,82r95,0r0,35r-134,0r0,-63r-60,0r-22,63r-43,0","w":266},"\u00aa":{"d":"3,-165v0,-36,27,-34,52,-42v19,-1,24,-28,-1,-28v-17,0,-19,10,-19,18r-26,0v0,-24,11,-38,49,-38v24,0,42,8,42,29r0,63v-1,7,5,11,11,8r0,20v-14,7,-36,2,-38,-14v-14,27,-70,22,-70,-16xm71,-197v-13,8,-41,8,-37,30v0,6,5,13,15,13v21,0,24,-20,22,-43","w":113},"\u0141":{"d":"17,0r0,-94r-21,14r0,-35r21,-14r0,-128r41,0r0,100r52,-37r0,36r-52,36r0,87r99,0r0,35r-140,0","w":159},"\u00d8":{"d":"139,-193v-24,49,-43,103,-66,154v7,10,17,13,27,13v24,0,44,-15,44,-104v0,-28,-2,-49,-5,-63xm62,-64v24,-49,43,-104,65,-155v-8,-10,-17,-12,-27,-12v-24,0,-44,15,-44,101v0,29,2,51,6,66xm49,19r-18,-9r11,-28v-19,-21,-27,-58,-27,-111v0,-112,48,-154,126,-123r10,-23r19,8r-12,28v19,21,27,57,27,110v0,112,-48,155,-126,124","w":200},"\u0152":{"d":"144,0v-1,-6,2,-14,-1,-18v-10,16,-29,23,-49,23v-53,0,-79,-41,-79,-134v0,-92,26,-133,80,-133v23,-1,38,9,49,21r0,-16r127,0r0,35r-91,0r0,71r86,0r0,34r-86,0r0,82r94,0r0,35r-130,0xm141,-85v0,-51,9,-157,-38,-146v-27,0,-47,15,-47,101v0,89,20,104,44,104v24,0,41,-10,41,-59","w":286},"\u00ba":{"d":"57,-132v-40,0,-52,-25,-52,-61v0,-37,12,-62,52,-62v40,0,52,25,52,62v0,36,-12,61,-52,61xm57,-154v18,0,21,-18,21,-39v0,-22,-3,-40,-21,-40v-18,0,-21,18,-21,40v0,21,3,39,21,39","w":113},"\u00e6":{"d":"144,-118r57,0v1,-28,-3,-55,-28,-54v-26,1,-30,32,-29,54xm240,-92r-97,0v-1,33,2,70,29,70v28,0,31,-31,31,-43r36,0v0,43,-26,70,-68,70v-38,0,-48,-23,-53,-35v-19,51,-107,48,-107,-19v0,-56,39,-57,79,-68v13,-3,16,-7,16,-26v0,-18,-6,-29,-24,-29v-26,0,-29,18,-29,37r-37,0v0,-41,17,-64,68,-64v32,0,43,18,46,25v9,-16,26,-25,47,-25v56,-1,65,46,63,107xm73,-24v34,0,36,-38,34,-75v-4,5,-19,8,-29,11v-26,7,-28,20,-28,37v0,14,9,27,23,27","w":253},"\u0131":{"d":"21,0r0,-194r38,0r0,194r-38,0"},"\u0142":{"d":"21,0r0,-103r-21,14r0,-34r21,-15r0,-119r38,0r0,93r21,-15r0,35r-21,14r0,130r-38,0"},"\u00f8":{"d":"103,-162v-35,-24,-53,11,-53,65v0,16,1,30,3,42xm114,-139v-19,33,-33,72,-50,107v34,25,53,-12,53,-65v0,-16,-1,-30,-3,-42xm21,13r13,-27v-39,-46,-37,-185,49,-185v13,0,25,2,34,7r10,-23r18,9r-12,26v39,46,38,185,-50,185v-13,0,-24,-2,-33,-7r-11,24","w":166},"\u0153":{"d":"152,-118r58,0v1,-28,-3,-55,-28,-54v-26,1,-31,31,-30,54xm211,-65r37,0v0,43,-26,70,-68,70v-36,0,-46,-25,-48,-31v-11,22,-29,31,-53,31v-52,0,-68,-42,-68,-102v0,-60,16,-102,71,-102v36,0,46,18,53,30v12,-20,27,-30,51,-30v56,-1,65,46,63,107r-97,0v-1,32,1,70,28,70v28,0,31,-31,31,-43xm50,-97v0,43,5,73,32,73v28,0,33,-30,33,-73v0,-43,-5,-73,-33,-73v-27,0,-32,30,-32,73","w":259},"\u00df":{"d":"75,2r0,-31v33,3,46,-14,46,-50v0,-39,-14,-55,-45,-52r0,-28v18,1,36,-5,36,-36v0,-21,-7,-36,-29,-36v-21,0,-28,13,-28,36r0,195r-39,0r0,-192v0,-45,23,-68,68,-68v33,0,67,13,67,59v1,29,-12,46,-36,54v37,4,47,36,47,67v0,55,-26,88,-87,82","w":173},"\u00b9":{"d":"47,-101r0,-110r-33,0r0,-20v19,0,39,-2,42,-24r22,0r0,154r-31,0","w":112},"\u00ac":{"d":"168,-38r0,-75r-151,0r0,-31r182,0r0,106r-31,0","w":216},"\u00b5":{"d":"19,63r0,-257r39,0r0,133v0,25,8,35,27,35v16,0,31,-13,31,-38r0,-130r38,0r0,194r-36,0v-1,-7,2,-18,-1,-23v-13,22,-38,36,-59,22r0,64r-39,0","w":173},"\u03bc":{"d":"19,63r0,-257r39,0r0,133v0,25,8,35,27,35v16,0,31,-13,31,-38r0,-130r38,0r0,194r-36,0v-1,-7,2,-18,-1,-23v-13,22,-38,36,-59,22r0,64r-39,0","w":173},"\u2122":{"d":"56,-109r0,-124r-44,0r0,-24r119,0r0,24r-44,0r0,124r-31,0xm298,-109r-1,-117r-43,117r-20,0r-45,-117r0,117r-28,0r0,-148r42,0r41,105r40,-105r43,0r0,148r-29,0","w":360},"\u00d0":{"d":"21,0r0,-120r-21,0r0,-29r21,0r0,-108r73,0v81,0,91,52,91,128v0,76,-10,129,-91,129r-73,0xm62,-31v67,3,82,-3,82,-98v0,-91,-15,-101,-82,-97r0,77r43,0r0,29r-43,0r0,89","w":200},"\u00bd":{"d":"27,11r151,-272r27,0r-152,272r-26,0xm36,-101r0,-110r-32,0v1,-6,-3,-17,2,-20v16,0,37,-3,39,-24r22,0r0,154r-31,0xm247,0r-99,0v0,-72,70,-68,70,-111v0,-13,-7,-21,-19,-21v-17,0,-20,17,-20,28r-31,0v0,-30,14,-50,52,-50v36,0,49,17,49,41v0,49,-54,53,-68,89r66,0r0,24","w":259},"\u00b1":{"d":"93,-128r0,-54r30,0r0,54r76,0r0,31r-76,0r0,55r-30,0r0,-55r-76,0r0,-31r76,0xm17,0r0,-31r182,0r0,31r-182,0","w":216},"\u00de":{"d":"62,-177r0,89v40,2,67,1,70,-44v2,-39,-28,-49,-70,-45xm21,0r0,-257r41,0r0,49v68,-7,112,15,112,75v0,60,-45,83,-112,76r0,57r-41,0","w":180},"\u00bc":{"d":"196,0r0,-34r-59,0r0,-22r57,-98r31,0r0,100r18,0r0,20r-18,0r0,34r-29,0xm196,-54v-1,-21,2,-47,-1,-66r-37,66r38,0xm27,11r151,-272r27,0r-152,272r-26,0xm36,-101r0,-110r-32,0v1,-6,-3,-17,2,-20v16,0,37,-3,39,-24r22,0r0,154r-31,0","w":259},"\u00f7":{"d":"82,-17v0,-14,12,-26,26,-26v14,0,26,12,26,26v0,14,-12,26,-26,26v-14,0,-26,-12,-26,-26xm17,-76r0,-31r182,0r0,31r-182,0xm82,-165v0,-14,12,-26,26,-26v14,0,26,12,26,26v0,14,-12,26,-26,26v-14,0,-26,-12,-26,-26","w":216},"\u00a6":{"d":"24,5r0,-100r31,0r0,100r-31,0xm24,-162r0,-100r31,0r0,100r-31,0"},"\u00b0":{"d":"18,-201v0,-30,24,-54,54,-54v30,0,54,24,54,54v0,30,-24,53,-54,53v-30,0,-54,-23,-54,-53xm43,-201v0,16,13,29,29,29v16,0,29,-13,29,-29v0,-16,-13,-29,-29,-29v-16,0,-29,13,-29,29","w":144},"\u00fe":{"d":"19,63r0,-320r39,0r0,86v7,-17,23,-28,44,-28v42,0,60,38,60,105v0,81,-33,99,-60,99v-21,0,-37,-11,-44,-28r0,86r-39,0xm55,-99v0,46,7,73,34,73v22,0,32,-16,32,-70v0,-44,-6,-72,-33,-72v-27,0,-33,28,-33,69","w":173},"\u00be":{"d":"196,0r0,-34r-59,0r0,-22r57,-98r31,0r0,100r18,0r0,20r-18,0r0,34r-29,0xm196,-54v-1,-21,2,-47,-1,-66r-37,66r38,0xm39,11r151,-272r27,0r-151,272r-27,0xm32,-170r0,-22v20,3,33,-7,33,-21v0,-9,-5,-20,-18,-20v-14,0,-19,13,-19,22r-31,0v0,-29,20,-44,52,-44v22,0,47,12,47,39v1,17,-15,30,-29,35v18,1,33,13,33,35v0,30,-23,48,-54,48v-35,0,-52,-14,-52,-46r31,0v0,9,4,23,21,23v16,0,23,-12,23,-25v0,-18,-14,-26,-37,-24","w":259},"\u00b2":{"d":"105,-125r0,24r-99,0v0,-72,70,-68,70,-111v0,-13,-7,-21,-19,-21v-17,0,-20,17,-20,28r-31,0v0,-30,14,-50,52,-50v36,0,49,17,49,41v0,49,-54,53,-68,89r66,0","w":112},"\u00ae":{"d":"175,-52r-39,-65r-23,0r0,65r-27,0r0,-153v52,0,117,-9,117,44v0,28,-17,39,-39,43r42,66r-31,0xm113,-139v28,-1,63,7,63,-23v0,-28,-36,-20,-63,-21r0,44xm144,-24v56,0,101,-47,101,-105v0,-58,-45,-104,-101,-104v-56,0,-101,46,-101,104v0,58,45,105,101,105xm10,-129v0,-74,60,-133,134,-133v74,0,134,59,134,133v0,74,-60,134,-134,134v-74,0,-134,-60,-134,-134","w":288},"\u2212":{"d":"17,-76r0,-31r182,0r0,31r-182,0","w":216},"\u00f0":{"d":"50,-97v0,49,5,73,33,73v28,0,34,-24,34,-73v0,-38,-6,-68,-34,-68v-28,0,-33,30,-33,68xm34,-215r-13,-13r31,-17v-8,-8,-16,-14,-23,-19r28,-15v8,5,16,11,24,18r33,-18r11,13r-31,17v48,45,62,83,62,152v0,60,-19,102,-73,102v-54,0,-72,-42,-72,-102v0,-74,46,-117,97,-86v-9,-14,-26,-33,-43,-50","w":166},"\u00d7":{"d":"88,-91r-63,-63r20,-20r63,63r63,-63r20,20r-63,63r63,63r-20,20r-63,-63r-63,63r-20,-20","w":216},"\u00b3":{"d":"42,-170r0,-22v20,3,32,-8,32,-21v0,-9,-5,-20,-18,-20v-14,0,-19,13,-19,22r-31,0v0,-29,20,-44,52,-44v22,0,47,12,47,39v1,17,-15,30,-29,35v18,1,33,13,33,35v0,30,-22,48,-53,48v-35,0,-52,-14,-52,-46r31,0v0,9,4,23,21,23v16,0,22,-12,22,-25v0,-18,-13,-26,-36,-24","w":112},"\u00a9":{"d":"184,-105r29,0v-6,36,-33,57,-68,57v-44,0,-72,-32,-72,-81v0,-89,128,-111,139,-25r-28,0v-4,-17,-17,-29,-37,-29v-28,0,-43,24,-43,54v0,54,70,76,80,24xm144,-24v56,0,101,-47,101,-105v0,-58,-45,-104,-101,-104v-56,0,-101,46,-101,104v0,58,45,105,101,105xm10,-129v0,-74,60,-133,134,-133v74,0,134,59,134,133v0,74,-60,134,-134,134v-74,0,-134,-60,-134,-134","w":288},"\u00c1":{"d":"64,-96r61,0r-31,-126xm-3,0r73,-257r52,0r68,257r-43,0r-16,-63r-75,0r-16,63r-43,0xm76,-271r22,-52r43,0r-38,52r-27,0","w":186},"\u00c2":{"d":"64,-96r61,0r-31,-126xm-3,0r73,-257r52,0r68,257r-43,0r-16,-63r-75,0r-16,63r-43,0xm44,-271r33,-52r39,0r32,52r-33,0r-19,-32r-21,32r-31,0","w":186},"\u00c4":{"d":"64,-96r61,0r-31,-126xm-3,0r73,-257r52,0r68,257r-43,0r-16,-63r-75,0r-16,63r-43,0xm109,-279r0,-39r34,0r0,39r-34,0xm49,-279r0,-39r35,0r0,39r-35,0","w":186},"\u00c0":{"d":"64,-96r61,0r-31,-126xm-3,0r73,-257r52,0r68,257r-43,0r-16,-63r-75,0r-16,63r-43,0xm89,-271r-38,-52r43,0r22,52r-27,0","w":186},"\u00c5":{"d":"64,-96r61,0r-31,-126xm-3,0r73,-257r52,0r68,257r-43,0r-16,-63r-75,0r-16,63r-43,0xm76,-304v0,11,9,20,20,20v11,0,20,-9,20,-20v0,-11,-9,-20,-20,-20v-11,0,-20,9,-20,20xm58,-304v0,-21,17,-38,38,-38v21,0,38,17,38,38v0,21,-17,38,-38,38v-21,0,-38,-17,-38,-38","w":186},"\u00c3":{"d":"64,-96r61,0r-31,-126xm-3,0r73,-257r52,0r68,257r-43,0r-16,-63r-75,0r-16,63r-43,0xm78,-317v15,1,47,26,50,-1r22,0v0,16,-9,42,-30,42v0,0,-51,-28,-56,2r-22,0v0,-15,9,-43,36,-43","w":186},"\u00c7":{"d":"79,37v-13,-9,7,-21,11,-32v-57,-5,-75,-48,-75,-134v0,-92,20,-133,85,-133v75,0,78,53,78,85r-41,0v0,-27,-6,-54,-37,-54v-30,0,-44,18,-44,101v0,83,14,104,44,104v35,-1,38,-39,38,-66r41,0v1,49,-15,93,-72,97r-11,16v20,-7,42,5,42,24v0,33,-51,39,-78,27r6,-15v13,5,41,11,43,-9v1,-13,-18,-15,-30,-11","w":186},"\u00c9":{"d":"21,0r0,-257r139,0r0,35r-98,0r0,71r92,0r0,34r-92,0r0,82r101,0r0,35r-142,0xm71,-271r22,-52r43,0r-38,52r-27,0","w":173},"\u00ca":{"d":"21,0r0,-257r139,0r0,35r-98,0r0,71r92,0r0,34r-92,0r0,82r101,0r0,35r-142,0xm39,-271r33,-52r39,0r32,52r-33,0r-19,-32r-21,32r-31,0","w":173},"\u00cb":{"d":"21,0r0,-257r139,0r0,35r-98,0r0,71r92,0r0,34r-92,0r0,82r101,0r0,35r-142,0xm104,-279r0,-39r34,0r0,39r-34,0xm44,-279r0,-39r34,0r0,39r-34,0","w":173},"\u00c8":{"d":"21,0r0,-257r139,0r0,35r-98,0r0,71r92,0r0,34r-92,0r0,82r101,0r0,35r-142,0xm84,-271r-38,-52r43,0r22,52r-27,0","w":173},"\u00cd":{"d":"19,0r0,-257r41,0r0,257r-41,0xm20,-271r22,-52r43,0r-38,52r-27,0"},"\u00ce":{"d":"19,0r0,-257r41,0r0,257r-41,0xm-12,-271r33,-52r39,0r32,52r-33,0r-19,-32r-21,32r-31,0"},"\u00cf":{"d":"19,0r0,-257r41,0r0,257r-41,0xm53,-279r0,-39r34,0r0,39r-34,0xm-7,-279r0,-39r34,0r0,39r-34,0"},"\u00cc":{"d":"19,0r0,-257r41,0r0,257r-41,0xm33,-271r-38,-52r43,0r22,52r-27,0"},"\u00d1":{"d":"21,0r0,-257r50,0r76,191r0,-191r38,0r0,257r-50,0r-75,-197r0,197r-39,0xm85,-317v15,0,48,27,50,-1r23,0v0,16,-10,42,-31,42v-22,0,-51,-27,-56,2r-22,0v0,-15,9,-43,36,-43","w":206},"\u00d3":{"d":"100,5v-59,0,-85,-42,-85,-134v0,-92,26,-133,85,-133v59,0,85,41,85,133v0,92,-26,134,-85,134xm100,-26v24,0,44,-15,44,-104v0,-86,-20,-101,-44,-101v-24,0,-44,15,-44,101v0,89,20,104,44,104xm80,-271r22,-52r43,0r-38,52r-27,0","w":200},"\u00d4":{"d":"100,5v-59,0,-85,-42,-85,-134v0,-92,26,-133,85,-133v59,0,85,41,85,133v0,92,-26,134,-85,134xm100,-26v24,0,44,-15,44,-104v0,-86,-20,-101,-44,-101v-24,0,-44,15,-44,101v0,89,20,104,44,104xm48,-271r33,-52r39,0r32,52r-33,0r-19,-32r-21,32r-31,0","w":200},"\u00d6":{"d":"100,5v-59,0,-85,-42,-85,-134v0,-92,26,-133,85,-133v59,0,85,41,85,133v0,92,-26,134,-85,134xm100,-26v24,0,44,-15,44,-104v0,-86,-20,-101,-44,-101v-24,0,-44,15,-44,101v0,89,20,104,44,104xm113,-279r0,-39r34,0r0,39r-34,0xm53,-279r0,-39r34,0r0,39r-34,0","w":200},"\u00d2":{"d":"100,5v-59,0,-85,-42,-85,-134v0,-92,26,-133,85,-133v59,0,85,41,85,133v0,92,-26,134,-85,134xm100,-26v24,0,44,-15,44,-104v0,-86,-20,-101,-44,-101v-24,0,-44,15,-44,101v0,89,20,104,44,104xm93,-271r-38,-52r43,0r22,52r-27,0","w":200},"\u00d5":{"d":"100,5v-59,0,-85,-42,-85,-134v0,-92,26,-133,85,-133v59,0,85,41,85,133v0,92,-26,134,-85,134xm100,-26v24,0,44,-15,44,-104v0,-86,-20,-101,-44,-101v-24,0,-44,15,-44,101v0,89,20,104,44,104xm82,-317v15,1,47,26,50,-1r22,0v0,16,-10,42,-31,42v0,0,-50,-27,-55,2r-22,0v0,-15,9,-43,36,-43","w":200},"\u0160":{"d":"12,-80r41,0v-2,34,12,55,42,54v26,0,39,-18,39,-37v2,-40,-36,-45,-65,-56v-37,-14,-54,-33,-54,-70v0,-47,32,-73,80,-73v68,0,73,40,73,73r-41,0v1,-26,-8,-42,-36,-42v-18,0,-34,10,-34,37v0,32,38,45,66,54v36,13,52,33,52,68v0,55,-33,77,-85,77v-67,0,-79,-42,-78,-85xm74,-271r-32,-52r33,0r19,31r20,-31r31,0r-32,52r-39,0","w":186},"\u00da":{"d":"18,-257r41,0r0,184v0,32,13,47,38,47v24,0,37,-15,37,-47r0,-184r41,0r0,181v0,59,-29,81,-78,81v-49,0,-79,-22,-79,-81r0,-181xm77,-271r22,-52r43,0r-38,52r-27,0","w":193},"\u00db":{"d":"18,-257r41,0r0,184v0,32,13,47,38,47v24,0,37,-15,37,-47r0,-184r41,0r0,181v0,59,-29,81,-78,81v-49,0,-79,-22,-79,-81r0,-181xm45,-271r33,-52r39,0r32,52r-33,0r-20,-32r-20,32r-31,0","w":193},"\u00dc":{"d":"18,-257r41,0r0,184v0,32,13,47,38,47v24,0,37,-15,37,-47r0,-184r41,0r0,181v0,59,-29,81,-78,81v-49,0,-79,-22,-79,-81r0,-181xm109,-279r0,-39r35,0r0,39r-35,0xm50,-279r0,-39r34,0r0,39r-34,0","w":193},"\u00d9":{"d":"18,-257r41,0r0,184v0,32,13,47,38,47v24,0,37,-15,37,-47r0,-184r41,0r0,181v0,59,-29,81,-78,81v-49,0,-79,-22,-79,-81r0,-181xm90,-271r-38,-52r43,0r22,52r-27,0","w":193},"\u00dd":{"d":"65,0r0,-100r-66,-157r45,0r43,111r45,-111r43,0r-69,157r0,100r-41,0xm67,-271r22,-52r43,0r-38,52r-27,0","w":173},"\u0178":{"d":"65,0r0,-100r-66,-157r45,0r43,111r45,-111r43,0r-69,157r0,100r-41,0xm99,-279r0,-39r35,0r0,39r-35,0xm40,-279r0,-39r34,0r0,39r-34,0","w":173},"\u017d":{"d":"6,0r0,-32r108,-190r-101,0r0,-35r146,0r0,35r-108,187r109,0r0,35r-154,0xm64,-271r-32,-52r32,0r20,31r20,-31r31,0r-32,52r-39,0","w":166},"\u00e1":{"d":"146,-151r0,111v-1,9,8,16,16,12r0,25v-19,10,-50,4,-52,-20v-20,44,-99,37,-99,-26v0,-57,36,-57,75,-69v14,-4,23,-8,23,-25v0,-18,-6,-29,-27,-29v-26,0,-29,18,-29,37r-37,0v0,-41,17,-64,68,-64v34,0,62,14,62,48xm109,-102v-20,15,-59,12,-59,49v0,16,8,29,24,29v34,2,37,-40,35,-78xm64,-219r21,-52r44,0r-39,52r-26,0","w":166},"\u00e2":{"d":"146,-151r0,111v-1,9,8,16,16,12r0,25v-19,10,-50,4,-52,-20v-20,44,-99,37,-99,-26v0,-57,36,-57,75,-69v14,-4,23,-8,23,-25v0,-18,-6,-29,-27,-29v-26,0,-29,18,-29,37r-37,0v0,-41,17,-64,68,-64v34,0,62,14,62,48xm109,-102v-20,15,-59,12,-59,49v0,16,8,29,24,29v34,2,37,-40,35,-78xm32,-219r32,-52r39,0r32,52r-32,0r-20,-32r-20,32r-31,0","w":166},"\u00e4":{"d":"146,-151r0,111v-1,9,8,16,16,12r0,25v-19,10,-50,4,-52,-20v-20,44,-99,37,-99,-26v0,-57,36,-57,75,-69v14,-4,23,-8,23,-25v0,-18,-6,-29,-27,-29v-26,0,-29,18,-29,37r-37,0v0,-41,17,-64,68,-64v34,0,62,14,62,48xm109,-102v-20,15,-59,12,-59,49v0,16,8,29,24,29v34,2,37,-40,35,-78xm96,-226r0,-39r35,0r0,39r-35,0xm36,-226r0,-39r35,0r0,39r-35,0","w":166},"\u00e0":{"d":"146,-151r0,111v-1,9,8,16,16,12r0,25v-19,10,-50,4,-52,-20v-20,44,-99,37,-99,-26v0,-57,36,-57,75,-69v14,-4,23,-8,23,-25v0,-18,-6,-29,-27,-29v-26,0,-29,18,-29,37r-37,0v0,-41,17,-64,68,-64v34,0,62,14,62,48xm109,-102v-20,15,-59,12,-59,49v0,16,8,29,24,29v34,2,37,-40,35,-78xm77,-219r-38,-52r43,0r21,52r-26,0","w":166},"\u00e5":{"d":"146,-151r0,111v-1,9,8,16,16,12r0,25v-19,10,-50,4,-52,-20v-20,44,-99,37,-99,-26v0,-57,36,-57,75,-69v14,-4,23,-8,23,-25v0,-18,-6,-29,-27,-29v-26,0,-29,18,-29,37r-37,0v0,-41,17,-64,68,-64v34,0,62,14,62,48xm109,-102v-20,15,-59,12,-59,49v0,16,8,29,24,29v34,2,37,-40,35,-78xm63,-252v0,11,10,21,21,21v11,0,20,-10,20,-21v0,-11,-9,-20,-20,-20v-11,0,-21,9,-21,20xm45,-252v0,-21,18,-38,39,-38v21,0,38,17,38,38v0,21,-17,39,-38,39v-21,0,-39,-18,-39,-39","w":166},"\u00e3":{"d":"146,-151r0,111v-1,9,8,16,16,12r0,25v-19,10,-50,4,-52,-20v-20,44,-99,37,-99,-26v0,-57,36,-57,75,-69v14,-4,23,-8,23,-25v0,-18,-6,-29,-27,-29v-26,0,-29,18,-29,37r-37,0v0,-41,17,-64,68,-64v34,0,62,14,62,48xm109,-102v-20,15,-59,12,-59,49v0,16,8,29,24,29v34,2,37,-40,35,-78xm66,-265v15,0,48,28,50,-1r22,0v0,16,-10,43,-31,43v-22,-1,-51,-28,-56,2r-22,0v0,-15,10,-44,37,-44","w":166},"\u00e7":{"d":"66,37v-15,-8,6,-22,10,-33v-50,-3,-65,-44,-65,-101v0,-60,16,-102,72,-102v58,0,67,46,67,70r-39,0v0,-18,-5,-41,-28,-41v-28,0,-33,30,-33,73v0,43,5,73,33,73v22,0,30,-18,30,-47r36,0v-2,42,-15,71,-55,75r-12,17v20,-7,43,5,43,24v0,32,-52,39,-79,27r6,-15v13,5,42,11,44,-9v0,-13,-19,-15,-30,-11","w":159},"\u00e9":{"d":"153,-92r-101,0v0,32,0,70,33,70v28,0,31,-31,31,-43r36,0v0,43,-26,70,-68,70v-32,0,-71,-9,-71,-99v0,-51,11,-105,72,-105v61,0,70,45,68,107xm52,-118r62,0v1,-28,-3,-54,-29,-54v-26,0,-34,27,-33,54xm68,-219r22,-52r43,0r-38,52r-27,0","w":166},"\u00ea":{"d":"153,-92r-101,0v0,32,0,70,33,70v28,0,31,-31,31,-43r36,0v0,43,-26,70,-68,70v-32,0,-71,-9,-71,-99v0,-51,11,-105,72,-105v61,0,70,45,68,107xm52,-118r62,0v1,-28,-3,-54,-29,-54v-26,0,-34,27,-33,54xm36,-219r33,-52r39,0r32,52r-33,0r-20,-32r-20,32r-31,0","w":166},"\u00eb":{"d":"153,-92r-101,0v0,32,0,70,33,70v28,0,31,-31,31,-43r36,0v0,43,-26,70,-68,70v-32,0,-71,-9,-71,-99v0,-51,11,-105,72,-105v61,0,70,45,68,107xm52,-118r62,0v1,-28,-3,-54,-29,-54v-26,0,-34,27,-33,54xm100,-226r0,-39r35,0r0,39r-35,0xm41,-226r0,-39r34,0r0,39r-34,0","w":166},"\u00e8":{"d":"153,-92r-101,0v0,32,0,70,33,70v28,0,31,-31,31,-43r36,0v0,43,-26,70,-68,70v-32,0,-71,-9,-71,-99v0,-51,11,-105,72,-105v61,0,70,45,68,107xm52,-118r62,0v1,-28,-3,-54,-29,-54v-26,0,-34,27,-33,54xm81,-219r-38,-52r43,0r22,52r-27,0","w":166},"\u00ed":{"d":"21,0r0,-194r38,0r0,194r-38,0xm20,-219r22,-52r43,0r-38,52r-27,0"},"\u00ee":{"d":"21,0r0,-194r38,0r0,194r-38,0xm-12,-219r33,-52r39,0r32,52r-33,0r-19,-32r-21,32r-31,0"},"\u00ef":{"d":"21,0r0,-194r38,0r0,194r-38,0xm53,-226r0,-39r34,0r0,39r-34,0xm-7,-226r0,-39r34,0r0,39r-34,0"},"\u00ec":{"d":"21,0r0,-194r38,0r0,194r-38,0xm33,-219r-38,-52r43,0r22,52r-27,0"},"\u00f1":{"d":"19,0r0,-194r36,0v1,7,-3,20,2,23v20,-40,97,-43,97,25r0,146r-38,0r0,-133v0,-25,-8,-35,-27,-35v-16,0,-31,13,-31,38r0,130r-39,0xm69,-265v15,0,48,28,50,-1r22,0v0,16,-10,43,-31,43v-22,-1,-51,-29,-55,2r-23,0v0,-15,10,-44,37,-44","w":173},"\u00f3":{"d":"11,-97v0,-60,16,-102,72,-102v57,0,73,42,73,102v0,60,-19,102,-73,102v-54,0,-72,-42,-72,-102xm50,-97v0,49,5,73,33,73v28,0,34,-24,34,-73v0,-43,-6,-73,-34,-73v-28,0,-33,30,-33,73xm64,-219r21,-52r44,0r-39,52r-26,0","w":166},"\u00f4":{"d":"11,-97v0,-60,16,-102,72,-102v57,0,73,42,73,102v0,60,-19,102,-73,102v-54,0,-72,-42,-72,-102xm50,-97v0,49,5,73,33,73v28,0,34,-24,34,-73v0,-43,-6,-73,-34,-73v-28,0,-33,30,-33,73xm32,-219r32,-52r39,0r32,52r-32,0r-20,-32r-20,32r-31,0","w":166},"\u00f6":{"d":"11,-97v0,-60,16,-102,72,-102v57,0,73,42,73,102v0,60,-19,102,-73,102v-54,0,-72,-42,-72,-102xm50,-97v0,49,5,73,33,73v28,0,34,-24,34,-73v0,-43,-6,-73,-34,-73v-28,0,-33,30,-33,73xm96,-226r0,-39r35,0r0,39r-35,0xm36,-226r0,-39r35,0r0,39r-35,0","w":166},"\u00f2":{"d":"11,-97v0,-60,16,-102,72,-102v57,0,73,42,73,102v0,60,-19,102,-73,102v-54,0,-72,-42,-72,-102xm50,-97v0,49,5,73,33,73v28,0,34,-24,34,-73v0,-43,-6,-73,-34,-73v-28,0,-33,30,-33,73xm77,-219r-38,-52r43,0r21,52r-26,0","w":166},"\u00f5":{"d":"11,-97v0,-60,16,-102,72,-102v57,0,73,42,73,102v0,60,-19,102,-73,102v-54,0,-72,-42,-72,-102xm50,-97v0,49,5,73,33,73v28,0,34,-24,34,-73v0,-43,-6,-73,-34,-73v-28,0,-33,30,-33,73xm66,-265v15,0,48,28,50,-1r22,0v0,16,-10,43,-31,43v-22,-1,-51,-28,-56,2r-22,0v0,-15,10,-44,37,-44","w":166},"\u0161":{"d":"139,-137r-37,0v1,-19,-3,-34,-25,-35v-15,0,-28,7,-28,25v0,24,32,30,52,37v29,10,42,25,42,56v0,41,-30,59,-69,59v-52,0,-65,-25,-64,-67r35,0v-1,25,6,40,30,40v39,0,41,-46,10,-56v-34,-11,-73,-22,-73,-67v0,-36,26,-54,66,-54v53,0,62,29,61,62xm57,-219r-32,-52r33,0r19,32r21,-32r31,0r-33,52r-39,0","w":153},"\u00fa":{"d":"118,0v-1,-7,2,-18,-1,-23v-25,40,-98,46,-98,-35r0,-136r39,0r0,139v0,22,9,29,26,29v17,0,32,-10,32,-32r0,-136r38,0r0,194r-36,0xm67,-219r22,-52r43,0r-38,52r-27,0","w":173},"\u00fb":{"d":"118,0v-1,-7,2,-18,-1,-23v-25,40,-98,46,-98,-35r0,-136r39,0r0,139v0,22,9,29,26,29v17,0,32,-10,32,-32r0,-136r38,0r0,194r-36,0xm35,-219r33,-52r39,0r32,52r-33,0r-20,-32r-20,32r-31,0","w":173},"\u00fc":{"d":"118,0v-1,-7,2,-18,-1,-23v-25,40,-98,46,-98,-35r0,-136r39,0r0,139v0,22,9,29,26,29v17,0,32,-10,32,-32r0,-136r38,0r0,194r-36,0xm99,-226r0,-39r35,0r0,39r-35,0xm40,-226r0,-39r34,0r0,39r-34,0","w":173},"\u00f9":{"d":"118,0v-1,-7,2,-18,-1,-23v-25,40,-98,46,-98,-35r0,-136r39,0r0,139v0,22,9,29,26,29v17,0,32,-10,32,-32r0,-136r38,0r0,194r-36,0xm80,-219r-38,-52r43,0r22,52r-27,0","w":173},"\u00fd":{"d":"3,-194r42,0r34,146r31,-146r40,0r-53,201v-16,60,-32,61,-83,58r0,-31v26,6,41,-7,44,-30xm57,-219r21,-52r44,0r-38,52r-27,0","w":153},"\u00ff":{"d":"3,-194r42,0r34,146r31,-146r40,0r-53,201v-16,60,-32,61,-83,58r0,-31v26,6,41,-7,44,-30xm89,-226r0,-39r35,0r0,39r-35,0xm30,-226r0,-39r34,0r0,39r-34,0","w":153},"\u017e":{"d":"9,0r0,-30r85,-131r-80,0r0,-33r124,0r0,32r-82,129r82,0r0,33r-129,0xm54,-219r-32,-52r32,0r20,32r20,-32r31,0r-32,52r-39,0","w":146},"\u20ac":{"d":"159,-243r0,37v-29,-25,-93,-16,-90,39r79,0r-9,29r-73,0r0,24r66,0r-9,29r-54,0v-1,58,59,67,90,41r0,38v-54,26,-125,4,-127,-79r-25,0r9,-29r13,0r0,-24r-22,0r9,-29r16,0v1,-75,71,-106,127,-76","w":172}}});
}
/* 
 * IMPORTANT:
 * Keep CSS styles below synced with styles in helvetia-neue-condensed.css 
 */
if (window.addEventListener) {
    window.addEventListener('load',function(){
        var tagname = '#sign-up p, #sign-up-success span, #sign-up-success a,h1, .aside h2, .aside h3, #featured h3, #header-search label,#nav-category li a, #nav-category a.sale, #top-category #sidebar .side-nav a.sale, .size-guide p.h1, .account h2, .account h3, .cart h2, #nav-checkout li, #forgot-password legend, .checkout h2, .checkout h3, #account-login h2, #receipt #sidebar h3, h4.shipBucket span.shippingTo, #account-main h2, #ins1 h3, .total-items, h2.subtitle, #wishlist #no-items-in-wishlist';
        var face = 'HelveticaNeue Condensed';
        if (!document.supportsFont(face)) {
            document.applyFont(tagname, face);
        }
    },false);
}

/** 
 * Provides Peacocks-specific product hover functionality for visual effects.
 *
 * @param options Options to initialize the object. If no 
 *                options are provided the default settings are used. See
 *                available options in the settings object below.
 */
var ProductHover = function(options) {
    
    // Default settings -- will be overriden by options if provided
    var settings = Object.extend({
        
        // Buy It Now class
        buyItNowClass: 'buy-it-now', 
        
        // Product container ID
        productContainerId: 'products', 
        
        // Product item class
        productItemClass: 'hproduct', 
        
        // Class name that gets applied to show the product highlight background
        showClass: 'show',
		
		// Class names that identify product item position in row
		positionClass: {
		    left: 'p-left',
		    center: 'p-center',
		    right: 'p-right',
		    last: 'p-last'
		},
		
		// Number of products displayed per row
		productsPerRow: 4,
		
		// Additional offsets for background image. Left offsets can vary 
		// depending on position of product element.
		offset: {
		    top: 344,
		    left: -3,
		    center: -63,
		    right: -66,
		    last: -66
		}
    }, options);
    
    // Indicator if hover state is currently set
    var isHoverState = false;
    
    // Selector for Buy It Now element
    var buyItNowSelector = "." + settings.buyItNowClass;
    
    // Product container element
    var productContainer = $(settings.productContainerId);
    
    // Selector for product item
    var productItemSelector = "." + settings.productItemClass;
    
    // Current highlighted product element
    var currentProductElement = null;
    
    // Current visible Buy It Now element
    var currentBuyItNowElement = null;
    
    /**
     * Initialize event observer and define appropriate actions
     */
    this.init = function() {
        var products = $('products');
        
        if (products) {
            // Products mouseover / mouseout observer
            products.observe('mouseover', setHoverState.bindAsEventListener(this));
            products.observe('mouseout', removeHoverState.bindAsEventListener(this));
            
            // Products click observer
            products.observe('click', clickHandler.bindAsEventListener(this));
    
            // Event observer to open express shop / mini cart
            $(document.body).observe(':openEsMc', openEsMc.bindAsEventListener(this));
            
            // Event observer to close express shop / mini cart
            $(document.body).observe(':closeEsMc', closeEsMc.bindAsEventListener(this));
        }
    }
    
    /** 
     * Click event handler
     *
     * @param e Event object
     */
    function clickHandler(e) {
        var target = Event.element(e);
            
        // If buy it now was clicked
        if (target.hasClassName(settings.buyItNowClass)) {
            buyItNow(e);
        }
    }
    
    /** 
     * Start buy it now express shop process
     *
     * @param e Event object
     */
    function buyItNow(e) {
        if (isHoverState) return false;
     
        isHoverState = true;
        currentBuyItNowElement.addClassName('show-hover');
        var prd = getParentElement(e, productItemSelector);
        
        // Position express shop popup
        if (prd.hasClassName(settings.positionClass.right)) {
            // to the left of buy it now button
            positionElement(prd, $('ins1'), -181, 147);
        } else {
            // to the right of buy it now button
            positionElement(prd, $('ins1'), 125, 147);
        }
        
        // Fire loadProduct event to trigger express shop popup
        $(document.body).fire(':loadProduct', {
            productId: prd.id.split('-')[1]
        });
    }
    
    /** 
     * Open Express Shop / Mini Cart window
     */
    function openEsMc() {
        isHoverState = true;
        $('ins1').show();
    }
    
    /** 
     * Close Express Shop / Mini Cart window
     */
    function closeEsMc() {
        isHoverState = false;
        currentProductElement.removeClassName('bb-white');
        currentBuyItNowElement.removeClassName('show-hover');
        $('ins1').hide();
    }
    
    /** 
     * Set hover state for product item
     *
     * @param e Event object
     */
    function setHoverState(e) {
        if (isHoverState) return false;
        
        // Get product item element that was hovered over
        var target = Event.element(e);
        if (target == null || typeof(target) == 'undefined' || target.id == settings.productContainerId) {
            return false;
        } else if (!target.hasClassName("hproduct")) {
            target = target.up(productItemSelector);
        }
        
        // Store target element in class variable for later use
        currentProductElement = target;
        
        // Get and set positioned offset of product item
        // Note: positionedOffset requires product container to be positioned relative
        var offset = target.positionedOffset(); 
        offset.top = offset.top + settings.offset.top;
        
        // Set product container class name based on class name of hovered item
        if (target.hasClassName(settings.positionClass.left)) {
            productContainer.className = settings.positionClass.left;
            offset.left = offset.left + settings.offset.left;
        }
        else if (target.hasClassName(settings.positionClass.center)) {
            productContainer.className = settings.positionClass.center;
            offset.left = offset.left + settings.offset.center;
        }
        else if (target.hasClassName(settings.positionClass.right)) {
            productContainer.className = settings.positionClass.right;
            offset.left = offset.left + settings.offset.right;
        }
        else if (target.hasClassName(settings.positionClass.last)) {
            productContainer.className = settings.positionClass.last;
            offset.left = offset.left + settings.offset.last;
        }
        
        // Hide bottom border of hovered item
        target.addClassName('bb-white');
        
        // Set background position based on offset
        productContainer.setStyle({
                backgroundPosition: offset.left+'px '+offset.top+'px'
        });
        
        // Set buy it now button for this product item
        setBuyItNowButton(target);
    }
    
    /** 
     * Remove hover state for product item
     *
     * @param e The event triggered
     */
    function removeHoverState(e) {
        if (isHoverState) return false;
        
        try {
            productContainer.className = "";
            currentProductElement.removeClassName('bb-white');
            currentBuyItNowElement.removeClassName(settings.showClass);
        } catch(err) {}
    }
    
    /**
     * Set Buy It Now button
     *
     * @param productItem Product item that contains buy it now button
     */
    function setBuyItNowButton(productItem) {
        try {
            currentBuyItNowElement = productItem.down(buyItNowSelector);
            currentBuyItNowElement.addClassName(settings.showClass);
        } catch(err) {}
    }
    
    /** 
     * Position a target element relative to a source element
     *
     * @param srcElement Source element which position is cloned
     * @param targetElement Target element to be positioned relative to the source element 
     * @param offsetTop The target element's top offset relative to the source element
     * @param offsetLeft The target element's left offset relative to the source element
     */
    function positionElement(srcElement, targetElement, offsetLeft, offsetTop) {
        var offset = srcElement.positionedOffset(); 
        targetElement.setStyle({top: (offset.top+offsetTop)+'px', left: (offset.left+offsetLeft)+'px'});
    }
    
    /**
     * Return first parent element of the element which fired the event that matches selector
     *
     * @param e Event object
     * @param selector CSS selector to match the parent element
     */
    function getParentElement(e, selector) {
        return Event.findElement(e, selector);
    }
}
/** 
 * Color drawer functionality for Peacocks 
 */
var ColorDrawer = Class.create({
    initialize: function() {
        this.moreColorsClass = "more-colors";
        this.closeColorsClass = "close-colors";
        this.productSelector = '.hproduct';
        this.colorsContainerSelector = '.colors';
    },
    
    /* Set event listeners */
    setEvents: function() {
        var products = $('products');

        if (products) {
            products.observe('click', function(event) {
                var target = Event.element(event);

                if (target.hasClassName(this.moreColorsClass)) {
                    this.showDrawer(event);
                } else if (target.hasClassName(this.closeColorsClass)) {
                    this.hideDrawer(event);
                }
            }.bind(this));
        }
    },
    
    /* Show color drawer */
    showDrawer: function(event) {
        var showBtn = Event.element(event);
        var closeBtn = this.getCloseBtn(event);
        var drawer = this.getDrawer(event);

        if (!drawer) 
            return false;
        
        // If already open, close it
        if (drawer.hasClassName('show-block')) {
            this.hideDrawer(event);
            return false;
        }
        
        drawer.clonePosition(showBtn, {
            setWidth: false, 
            setHeight: false, 
            offsetTop: -drawer.getHeight(), 
            offsetLeft: -15
        });
        
        drawer.addClassName('show-block');
        closeBtn.addClassName('show-inline-block');
        
        this.isOpen = true;
    },
    
    /* Hide color drawer */
    hideDrawer: function(event) {
        var closeBtn = this.getCloseBtn(event);
        var drawer = this.getDrawer(event);
        
        drawer.removeClassName('show-block');
        closeBtn.removeClassName('show-inline-block');
    },
    
    /* Get color drawer of product element within which the event was fired */
    getDrawer: function(event) {
        var prd = Event.findElement(event, this.productSelector);
        return prd.down(this.colorsContainerSelector);
    },
    
    /* Get close color button of product element within which the event was fired */
    getCloseBtn: function(event) {
        var prd = Event.findElement(event, this.productSelector);
        return prd.down("."+this.closeColorsClass);
    }
});
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
eval(function(p,a,c,k,e,d){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)d[e(c)]=k[c]||e(c);k=[function(e){return d[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('5 6=q(a){7.H=a;7.1l=[\'5 $B = [];\',\'5 1g = q(B) {\',\'$B.y((T B == "1p")?B:(B||""));\',\'};\',\'1o($11){ \'].F(\'\');7.1k=\'}8 $B.F("");\';7.1h=[\'\\\\\',\'\\\'\',\'"\',[\'\\n\',\'\\\\n\'],[\'\\t\',\'\\\\t\'],[\'\\r\',\'\\\\r\']]};6.H={};6.1b.1q=q(a){7.19=6.R(a,7.H);7.15=6.13(7.19.G,7.H);7.12=6.Q(7.15,7.1h,7.H,7);1C{7.10=L 1A(\'$11\',7.1l+7.12+7.1k);8 N}1y(e){7.1x=e;8 K}};6.1b.1v=q(a,b){4(b)8 7.10.1u(b,[a]);x 8 7.10(a)};6.V=q(a,b){u(5 i=0;i<b.p;i++){4(b[i]17 16)a=a.I(L M(b[i][0],\'14\'),b[i][1]);x a=a.I(L M(\'\\\\\'+b[i],\'14\'),\'\\\\\'+b[i])}8 a};6.R=q(a,b){5 c,w,k;5 d=[],l=[],G=[];1n(a){u(5 i U b){4(!k||a.C(b[k].D)==-1)k=i;4(a.C(b[i].D)!=-1)4(a.C(b[k].D)>a.C(b[i].D))k=i}c=a.C(b[k].D);w=a.C(b[k].w)+b[k].w.p;4(c!=-1){d.y(a.P(0,c));l.y(a.P(c,w));a=a.P(w)}x{d.y(a);a=\'\'}}u(5 i=0;i<d.p;i++){G.y(d[i]);4(l[i])G.y(l[i])}8{B:d,l:l,G:G}};6.Z=q(a,b){5 c=6.R(b,{1B:{D:\'\\{\',w:\'\\}\'}}).l;b=6.V(b,[\'(\',\')\',\'[\',\']\',\',\',\'.\',\'<\',\'>\',\'*\',\'$\',\'@\']);u(5 i=0;i<c.p;i++){b=b.I(c[i],\'(.*)\');c[i]=c[i].I(\'\\{\',\'\').I(\'\\}\',\'\')}5 d=a.1j(L M(b));5 e={};4(d)u(5 i=0;i<c.p;i++)e[c[i]]=d[i+1];8 e};6.1i=q(a,b){5 c;u(5 i U b)4(a.C(b[i].D)==0){c=i;1z}4(!c)8 K;a=a.P(b[c].D.p,a.C(b[c].w));5 d=\'\';5 e=\'\';4(b[c].l){5 f=[];u(5 i U b[c].l)f.y(i);5 g=L M(\'^(\\/){0,1}(\'+f.F(\'|\')+\')\\\\\\s*(.*)\');5 h=a.1j(g);4(!h)8 K;e=h[1]?N:K;d=h[2];a=h[3]}4(d){4(b[c].l[d].Y==\'1w\'&&e)8 K;4(b[c].l[d].Y==\'1f\'&&e)8{k:c,v:d,w:N}}5 j={};4(d&&b[c].l[d].E)j=6.Z(a,b[c].l[d].E);x 4(!d&&b[c].E)j=6.Z(a,b[c].E);8{k:c,v:d,1e:a,E:j}};6.13=q(c,d){5 e,m,9,1d=0;5 f={1c:N,X:c.F(\'\'),z:[]};5 g=q(a,b){b.1d=a.z.p;a.z.y(b)};9=f;u(5 i=0;i<c.p;i++){m=6.1i(c[i],d);4(!m){4(c[i]){c[i].W=9;g(9,c[i])}}x{e={};e.i=i;e.v=m.v;e.k=m.k;e.E=m.E;e.1t=m.1e;e.W=9;4(m.v&&d[m.k].l[m.v].1s&&!m.w&&T 9.z[9.z.p-1]==\'1m\')9.z.1r();4(m.v&&d[m.k].l[m.v].Y==\'1f\'){4(!m.w){g(9,e);9=e;9.z=[]}x 4(9.v==m.v){9.X=\'\';u(5 j=9.i+1;j<i;j++){9.X+=c[j]}9=9.W}}x g(9,e)}}8 f};6.Q=q(a,b,c,d){4(T a==\'1m\')8\'1g(\\\'\'+6.V(a,b)+\'\\\');\';5 e,J=[];4(a.z)u(5 i=0;i<a.z.p;i++)J.y(6.Q(a.z[i],b,c,d));4(!a.1c){4(a.v)8 c[a.k].l[a.v].1a(a,J.F(\'\'),d);x 8 c[a.k].1a(a,J.F(\'\'),d)}x 8 J.F(\'\')};6.S=q(a){5 b;4(a.o&&a.o.p==1&&a.o[0].A=="#B"){b=a.o[0].18}x{b={};u(5 i=0;i<a.o.p;i++){4(b[a.o[i].A]){4(!(b[a.o[i].A]17 16))b[a.o[i].A]=[b[a.o[i].A]];b[a.o[i].A].y(6.S(a.o[i]))}x 4(a.o[i].A.C(\'#\')==-1)b[a.o[i].A]=6.S(a.o[i])}}4(a.O)u(5 i=0;i<a.O.p;i++)b[\'@\'+a.O[i].A]=a.O[i].18;8 b}',62,101,'||||if|var|ZParse|this|return|current|||||||||||delimiter|tags|res||childNodes|length|function||||for|tagname|closer|else|push|children|nodeName|text|indexOf|opener|arguments|join|all|implementation|replace|content|false|new|RegExp|true|attributes|substring|parseToScript|parseToArray|parseXMLToJSON|typeof|in|escape|parent|innerSource|type|parseArguments|functionScript|data|functionText|parseToTree|gi|sourceTree|Array|instanceof|nodeValue|sourceArray|handler|prototype|isDocument|nr|source|block|_write|escapeChars|parseTag|match|footer|header|string|while|with|number|parse|pop|noTextBefore|argSource|apply|process|single|error|catch|break|Function|expr|try'.split('|'),0,{}))
var Implementation =
{
	statement: {
		opener: '<:',
		closer: ':>',
		tags: {
			'foreach': {
				arguments: '{element} in {object}',
				type: 'block',
				handler: function(tree, content, caller) {
					var element = tree.arguments.element;
					var object = tree.arguments.object;

                    /* alert('--- implementation.js [ foreach ] ---' + '\nelement = ' + element + '\nobject = ' + object); */

                    //Check whether there are else tag after this tag, if yes, (if) tag will be included
					var cond = (tree.parent.children[tree.nr+1] && tree.parent.children[tree.nr+1].tagname == 'else');
					var iff = ['if( (',object,' instanceof Array && ',object,'.length > 0) || ',
								'(!(',object,' instanceof Array) && ',object,') ) {'].join('');
					return [
						cond?iff:'',
							'var ',element,';',
							'if(',object,' instanceof Array) {',
								'for(var ',element,'_index=0; ',element,'_index<',object,'.length; ',element,'_index++) {',
									element,' = ',object,'[',element,'_index];',
									content,
								'}',
							'} else {',
								'for (var ',element,'_index in ',object,') {',
									element,' = ',object,'[',element,'_index];',
									content,
								'}',
							'}',
						cond?'}':''
					].join('');
				}
			},
			'for': {
				arguments: '{element} in {object}',
				type: 'block',
				handler: function(tree, content, caller) {
					var element = tree.arguments.element;
					var object = tree.arguments.object;

                    /* alert('--- implementation.js [ for ] ---' + '\nelement = ' + element + '\nobject = ' + object); */

					//Check whether there are else tag after this tag, if yes, (if) tag will be included
					var cond = (tree.parent.children[tree.nr+1] && tree.parent.children[tree.nr+1].tagname == 'else');
					var iff = ['if( (',object,' instanceof Array && ',object,'.length > 0) || ',
								'(!(',object,' instanceof Array) && ',object,') ) {'].join('');
					return [
						cond?iff:'',
							'if(',object,' instanceof Array) {',
								'for(var ',element,'=0; ',element,'<',object,'.length; ',element,'++) {',
									content,
								'}',
							'} else {',
								'for(var ',element,' in ',object,') {',
									content,
								'}',
							'}',
						cond?'}':''
					].join('');
				}
			},
			'if': {
				type: 'block',
				handler: function(tree, content, caller) {
					var condition = tree.argSource;

                    /* alert('--- implementation.js [ if ] ---' + '\ncondition = ' + condition); */

					return [
						'if(',condition,') {',
							content,
						'}'
					].join('');
				}
			},
			'elseif': {
				type: 'block',
				noTextBefore: true,
				handler: function(tree, content, caller) {
					var condition = tree.argSource;

                    /* alert('--- implementation.js [ elseif ] ---' + '\ncondition = ' + condition); */

					return [
						'else if(',condition,') {',
							content,
						'}'
					].join('');
				}
			},
			'else': {
				type: 'block',
				noTextBefore: true,
				handler: function(tree, content, caller) {
					return [
						'else {',
							content,
						'}'
					].join('');
				}
			},
			'macro': {
				arguments: '{name}({args})',
				type: 'block',
				handler: function(tree, content, caller) {
					var name = tree.arguments.name;
					var args = tree.arguments.args;
					var point = (name.indexOf('.') > 0);
					return [
						point?'':'var ', name,' = function(',args,') {',
							'var $text = [];',
							'var _write = function(text) {',
								'$text.push((typeof text == "number")?text:(text||""));',
							'};',
							content,
							'return $text.join("");',
						'};'
					].join('');
				}
			},
			'cdata': {
				type: 'block',
				handler: function(tree, content, caller) {
					return '_write(\''+ZParse.escape(tree.innerSource, caller.escapeChars)+'\');';
				}
			}
		}
	},
	print: {
		opener: ':{',
		closer: '}',
		handler: function(tree, content, caller) {
			return '_write('+tree.argSource+');';
		}
	},
	alternatePrint: {
		opener: '<$',
		closer: ':>',
		handler: function(tree, content, caller) {
			return '_write('+tree.argSource+');';
		}
	},
	script: {
		opener: '<#',
		closer: '#\>',
		handler: function(tree, content, caller) {
			return tree.argSource;
		}
	}
};
/*
 *
 *	Never copy this file from a store ALWAYS use a fresh copy from the repository!!!!!
 *
 *
*/
// =================================== Store ========================================
Df.Namespace.create('Store')

Object.extend(Store, {
    version: '0.0.0'
})

// The unique id of the cart line of the last product id that was edited. I
// don't like doing this but I figured it was better than trying to pass
// through a variable as it goes through 6 events being fired and 3 other
// methods. Besides, this class may be rewritten sooner rather than later.
// Set in: Store.ES._updateCartItem
// Used and reset in: Store.MC._renderConfirmationView
Store.ESMCLastEditedProductID = 0;

// ========================== Store.ProductCacheManager ==============================
Store.ProductCacheManager = Class.create(Df.AjaxCacheManager, {
    loadSuccessObserver: function(e){
        if(e.memo.transport.responseText.evalJSON().products.length > 1){
            var prods = []
            e.memo.transport.responseText.evalJSON().products.each(function(v){
            var json = v
            this.getCacheInstance().set( v.productId, new Store.Product(json) )
            prods.push(v.productId)
            }.bind(this))
            this.fireSelectionEvent(prods)
        }else{
            var json = e.memo.transport.responseText.evalJSON().products[0]
            this.getCacheInstance().set( json.productId, new Store.Product(json) )
            this.fireSelectionEvent(json.productId)
        }
    },

    fireSelectionEvent: function(uri){
        if(uri.constructor == Array){
            var objs = []
            uri.each(function(v){
            objs.push(this.getCacheInstance().get(v))
            }.bind(this))
            this.fire(':ItemSelection', {object: objs})
        }else{
            this.fire(':ItemSelection', {object: this.getCacheInstance().get(uri)})
        }
    },

    'get': function(uri){
        if(uri.constructor == Array){
            var getUris = []
            var haveUris = []
            uri.each(function(v){
            if(this.getCacheInstance().get(v)){
                haveUris.push(v)
            } else {
                getUris.push(v)
            }
            }.bind(this))

            if(getUris.length > 0)
            this.callService(getUris)

            if(haveUris.length > 0 && getUris.length == 0)
            this.fireSelectionEvent(haveUris)

        }else{
            if(this.getCacheInstance().get(uri)){
            this.fireSelectionEvent(uri)
            } else {
            this.callService(uri)
            }
        }
        return this
    }
})

// =============================== Store.Product =====================================
Store.Product = Class.create(Df.Base, {
    initialize: function($super, pars){
        $super(pars)
        this._price
        this._images
        this._skus
        this._createGetters()

        return this
    },

    getPrice: function(){
        if(Object.isUndefined(this._price)){
            this._price = new Store.ProductPrice({product:this})
        }
        return this._price
    },

    getImages: function(){
        if(Object.isUndefined(this._images)){
            this._images = new Store.ProductImageGroup(this.pars.images)
        }

        return this._images
    },

    getSkus: function(){
        if(Object.isUndefined(this._skus)){
            this._skus = new Store.ProductSkuGroup(this.pars.skus)
        }
        return this._skus
    },

    getImagesBy: function(slice, value){
        if(this.pars.slices){
                var s = this.pars.slices.find(function(v){
                    return v.sliceAttribute == slice
                })
                if(s && s.sliceValues){
                    var i = s.sliceValues.find(function(v){
                        return v.sliceValueAttributeValue == value
                    })
                    if(i && i.images){
                        return new Store.ProductImageGroup(i.images)
                    } else {
                        return undefined
                    }
                }else{
                    return undefined
                }
        }
    }
})

// =============================== Store.Rating ============================
Store.Rating = Class.create(Df.Element, {
    initialize: function($super, element, pars){
        $super(element, pars)

        if(parseFloat(this.element.innerHTML))
            this.pars.rating = parseFloat(this.element.innerHTML)

        this.emptyElement = Df.e('div', {className:this.pars.emptyClassName})
        this.fullElement = Df.e('div',{className:this.pars.fullClassName})

        this.element.appendChild(this.emptyElement)
        this.element.appendChild(this.fullElement)

        if(this.pars.interactive){
            this.__rateItObserver = this._rateItObserver.bind(this)
            this.element.observe('mousemove', this.__rateItObserver)

            this.__recordItObserver = this._recordItObserver.bind(this)
            this.element.observe('click', this.__recordItObserver)

            this.__resetItObserver = this._resetItObserver.bind(this)
            this.element.observe('mouseout', this.__resetItObserver)

            this.__fullOverObserver = this._fullOverObserver.bind(this)
            this.fullElement.observe('mouseover', this.__fullOverObserver)
            this.emptyElement.observe('mouseover', this.__fullOverObserver)
        }

        return this
    },

    _initPars: function($super, pars){
        $super()
        this.setPars({
            emptyClassName: 'empty',
            fullClassName: 'full',
            total: 4,
            rating: 1,
            interactive: true,
            step: false,
            resetDelay: 500
        })
        this.setPars(pars)
    },

    setRating: function(rating){
        this.pars.rating = rating
        return this
    },

    render: function(rating){
        if(rating)
            this.setRating(rating)

        this.fullElement.animate({
            width: this.pars.rating / this.pars.total * this.element.getWidth() + 'px'
        })

        return this
    },

    _rateItObserver: function(e){
        e.stop()
        var l = this.element.getPointerX(e)

        if(this.pars.step){
            var s = this.element.getWidth() / this.pars.total * this.pars.step
            l = Math.ceil(l/s)*s
        }

        /* alert('--- Store.js ---\n--- _rateItObserver : this.fullElement.setStyle ---' + '\nthis.fullElement = ' + this.fullElement); */
        this.fullElement.setStyle({
            width: l + 'px'
        })

    },

    _recordItObserver: function(e){
        e.stop()
        /* alert('--- Store.js ---\n--- _recordItObserver ---' + '\nthis.fullElement = ' + this.fullElement); */
        return this.render(parseInt(this.fullElement.getStyle('width')) / this.element.getWidth() * this.pars.total)
    },

    _resetItObserver: function(e){
        this._out = true
        setTimeout(this._reset.bind(this, e), this.pars.resetDelay)
    },

    _fullOverObserver: function(e){
        this._out = false
    },

    _reset: function(e){
        if(this._out){
            this.render()
        }
    }
})

// =============================== Store.ProductImageGroup ============================
Store.ProductImageGroup = Class.create(Df.DictionaryCollection, {
})

// =============================== Store.ProductSkuGroup ============================
Store.ProductSkuGroup = Class.create(Df.DictionaryCollection, {
})


// =============================== Store.ProductPrice =================================
Store.ProductPrice = Class.create(Df.Base, {

    initialize: function($super, pars){
        $super(pars)
        this._hash = $H()
        this._skuPrices = []
        this._html = ''

        this._createGetters()
        this.parser = new ZParse(Implementation);

        this._buildHash()
        return this
    },

    _initPars: function($super, pars){
        $super()
        this.setPars({
            priceTemplate: $('express-shop-price-template').innerHTML
        })
        this.setPars(pars)
    },

    setPriceTemplate: function(str){
        this.pars.priceTemplate = str
        return this
    },

    getHash: function(){
        return this._hash
    },

    getHTML: function(){
        if(this._html == ''){
            this.parser.parse(this.getPriceTemplate())
            this._html =  this.parser.process(this._hash._object)
        }
        return this._html
    },

    getSkuPrices: function(){
        return this._skuPrices
    },

    _buildHash: function(){
        if (this.getProduct().getPriceType() == 'S') {
                this._hash.set('price', parseFloat(this.getProduct().pars.price))
        } else if (this.getProduct().getPriceType() == 'VP') {
            this._hash.set('base', parseFloat(this.getProduct().getBasePrice()))
            this._hash.set('price', parseFloat(this.getProduct().pars.price))
        } else {
            this._skuPrices = this.getProduct().getSkus().get().collect(function(v){
                return v.price
            }).uniq()

            if (this.getProduct().getPriceType() == 'SKU' || this.getProduct().getPriceType() == 'SKU+VP') {
                    this._hash.set('price', [ this._skuPrices.min(), this._skuPrices.max() ])
            } else {
                this._hash.set('base', parseFloat(this.getProduct().getBasePrice()))
                this._hash.set('price', [ this._skuPrices.min(), this._skuPrices.max() ])
            }
        }
    }
})

Store.ProductState = Class.create(Df.Base, {
    initialize: function($super, pars){
        $super(pars)

        this._qty
        this._createGetters()
        this.controllers()
        this.mappers()

        return this
    },

    controllers: function(){
        this.observeBefore(':stateUpdate', this.stateUpdateCommand.bind(this))
    },

    getQuantity: function(){
        return this._qty
    },

    setQuantity: function(qty){
        this._qty = qty
        this._fireStateUpdate()
    },

    _fireStateUpdate: function(){
        this.fire(':stateUpdate', {
            cartable: this.isCartable(),
            qty : this._qty,
            selectedSkus : this.getProductSpecification().getFilteredSkus(),
            selectedAttributes: this.getProductSpecification().getAttributes()
        })
    },

    isCartable: function(){
        if(this._qty > 0 && this.getProductSpecification().getFilteredSkus().length == 1){
            return true
        } else {
            return false
        }
    },

    mappers: function(){
        this.getProductSpecification().observe(':attributeUpdate', function(e){
            this._fireStateUpdate()
        }.bind(this))
    },

    stateUpdateCommand: function(e){
        /*	Df.console.log(
                '-------------------- state update ------------------',
                e.memo,
                '----------------------- end ------------------------'
            )
        */
    }
})

// =========================== Store.ProductSpecification ==============================
Store.ProductSpecification = Class.create(Df.DictionaryCollection, {
    initialize: function($super, data){
	$super(data)

        this._attributeSelections = {}
        this._attributeSelectionsShadow = {}
        this._availableAttributeValues = {}
        this._cascade = []
        this._attributeSelectors = {}
        this._product
        this.controllers()

        return this
    },

    controllers: function(){
        this.observe(':attributeUpdate', this.attributeUpdateCommand.bind(this))
        this.observe(':buildSelectors', this.buildSelectorsCommand.bind(this))
        this.observe(':buildSpecification', this.buildSpecificationCommand.bind(this))
    },

    getProduct: function(){
        return this._product
    },

    setProduct: function(product){
        this._product = product
        return this
    },

    attributeUpdateCommand: function(e){

        if(!this._cascade.include(e.memo.attribute)){
            this._cascade.push(e.memo.attribute)
            this.setAvailableAttributeValues(e.memo.attribute)
        }

        this.setAttribute(e.memo.attribute, e.memo.currentValue)
        this.setAttributeShadow(e.memo.attribute)

        var l
        var f = []
        for(var i=this._cascade.indexOf(e.memo.attribute)+1; i<this.getCascade().length; i++){
            this.deleteAttribute(this._cascade[i])
            this.setAvailableAttributeValues(this._cascade[i])

            if(this.isSelectedValueAvailable(this._cascade[i])){
                if(Object.isUndefined(l)){
                    this.setAttribute(this._cascade[i], this.getAttributeShadow(this._cascade[i]))
                }
            }else{
                this.deleteAttributeShadow(this._cascade[i])
                f.push(this._cascade[i])
                l = i
            }
        }
        if(l){
            this._cascade.length = l
        }

        for(a in this._attributeSelectors){
            if(!this._cascade.include(a)){
            this.setAvailableAttributeValues(a)
            }
        }


        this.fire(':'+ e.memo.attribute +'Update', {
            currentValue: e.memo.currentValue,
            currentLabel: e.memo.currentLabel
        })


/*	Df.console.log(
	    '-------- attributeUpdate ---------',
	    this._cascade,
	    this.getFilteredSkus(),
	    '------------- end ----------------',
	    '------ ' + e.memo.attribute + 'Update ------',
	    {
		currentValue: e.memo.currentValue,
		currentLabel: e.memo.currentLabel
	    },
	    '------------- end ----------------'
	)
*/
        f.each(function(v){
            this.fire(':'+ v +'Update', {
                currentValue: undefined,
                currentLabel: undefined
            })

/*	    Df.console.log(
		'------ ' + v + 'Update ------',
		{
		    currentValue: undefined,
		    currentLabel: undefined
		},
		'------------- end ----------------'
	    )
*/
        }.bind(this))
    },

    buildSelectorsCommand: function(e){
        for(var ss in this._attributeSelectors){
            this._attributeSelectors[ss].each(function(v){
                v.fire(':build')
            }.bind(this))
        }
    },

    buildSpecificationCommand: function(e){

        this._attributeSelections = {}
        this._attributeSelectionsShadow = {}
        this._availableAttributeValues = {}
        this._cascade = []

        if(e.memo.product){
            this.set(e.memo.product.getSkus().get())
            this.setProduct(e.memo.product)
        }
        if(e.memo.data){
            this.set(e.memo.data)
        }
        this.fire(':buildSelectors')
    },

    getFilteredSkus: function(){
        return this.getBy(this.getAttributes())
    },

    getFilteredByGroups: function(att){
        if(!att){
            att = this.keys()
        }
        return Df.DictionaryCollection.getAttributeValues(this.getFilteredSkus(), att)
    },

    isSelectedValueAvailable: function(att){
        return this.getAvailableAttributeValues(att).include(this.getAttributeShadow(att))
    },

    getAvailableAttributeValues: function(att){
        if(this._availableAttributeValues[att]){
            return this._availableAttributeValues[att]
        } else {
            return this.getFilteredByGroups(att)
        }
    },

    setAvailableAttributeValues: function(att){
        this._availableAttributeValues[att] = this.getFilteredByGroups(att)
        return this
    },

    setAttribute: function(att, value){
        this._attributeSelections[att] = value
        return this
    },

    getAttribute: function(att){
       return this._attributeSelections[att]
    },

    getAttributes: function(){
       return this._attributeSelections
    },

    deleteAttribute: function(att){
        delete this._attributeSelections[att]
        return this
    },

    setAttributeShadow: function(att){
        this._attributeSelectionsShadow[att] = this.getAttribute(att)
        return this
    },

    getAttributeShadow: function(att){
       return this._attributeSelectionsShadow[att]
    },

    deleteAttributeShadow: function(att){
        delete this._attributeSelectionsShadow[att]
        return this
    },

    registerSelector: function(selector){
        if(!this._attributeSelectors[selector.pars.attribute]){
            this._attributeSelectors[selector.pars.attribute] = []
        }
        this._attributeSelectors[selector.pars.attribute].push(selector)
        return this
    },

    getSelectors: function(){
        return this._attributeSelectors
    },

    getCascade: function(att){
        return this._cascade
    }
})

// ====================== Store.ProductSpecificationAttribute =========================
Store.ProductSpecificationAttribute = {
    registerEvents: function(){
        if(this.pars.fire){
            this.__updateObserver = this._updateObserver.bind(this)
            this.updateEvent()
        }

        if(this.pars.observe){
            this.__attributeUpdateObserver = this._attributeUpdateObserver.bind(this)
            this.observeEvent()
        }

        this.__buildObserver = this._buildObserver.bind(this)
        this.observe(':build', this.__buildObserver )
    },

    observeEvent: function(){
        this.pars.productSpecification.observe(':attributeUpdate', this.__attributeUpdateObserver)
        return this
    },

    updateEvent: function(){
        this.element.observe(':update', this.__updateObserver)
        return this
    },

    getProduct: function(){
	return this.pars.productSpecification.getProduct()
    },

    getListItemLabel: function(rec){
        var r
            if(this.pars.labelAttribute){
            var l = this.pars.productSpecification.get()
            loopie:
                for(var i=0; i < l.length; i++){
            if(l[i][this.pars.attribute] == rec){
                r = l[i][this.pars.labelAttribute]
                break loopie
            }
            }
            }
        return r
    },
    
    /* Return sku data based on given attribute (color or size) */
    getCommonSkuDataByAttribute: function(rec){
        var r = {};
        if(this.pars.labelAttribute){
            var l = this.pars.productSpecification.get();
            loopie:
                for(var i=0; i < l.length; i++){
                    if(l[i][this.pars.attribute] == rec){
                        r.label = l[i][this.pars.labelAttribute];   // Sku label
                        r.value = rec;                              // Sku value
                        r.sid = l[i].sid;                           // Sku ID
                        r.size = l[i].size;                         // Sku size
                        break loopie;
                    }
                }
        }
        return r;
    },
    
    /* Validate valid skus of a slice against a given attribute and check if skus have multiple prices */
    validateSkusAndGetPriceRangeByAttribute: function(rec) {
        var r = {};
        r.minPrice = 0;
        r.maxPrice = 0;

        if(this.pars.labelAttribute){
            var prodSpec = this.pars.productSpecification.get();
            for(var i=0; i < prodSpec.length; i++){
                if(prodSpec[i][this.pars.attribute] == rec){
                    // Store valid sizes in array so that we can validate against them later
                    var sizeString = (prodSpec[i].size).toString();
                    Store.validSize[sizeString] = true;

                    if (typeof(prodSpec[i].price) !== "undefined" && prodSpec[i].price != null) {
                        var skuPrice = prodSpec[i].price;

                        // Store price of color-size combination for easy access when updating dropdown upon selection
                        if (!Store.colorSizePrice[rec]) {
                            Store.colorSizePrice[rec] = [];
                        }
                        Store.colorSizePrice[rec][sizeString] = skuPrice;

                        // Update price range
                        if (r.minPrice == 0 || skuPrice < r.minPrice) {
                            r.minPrice = skuPrice;
                        }
                        if (skuPrice > r.maxPrice) {
                            r.maxPrice = skuPrice;
                        }
                    }
                }
            }
        }
        return r;
    },

    getListItemValue: function(rec){
        return rec
    },

    subscribeToSpecification: function(){
        this.pars.productSpecification.registerSelector(this)
    },

    getSpecificationValue: function(){
	return this.pars.productSpecification.getAttribute(this.pars.attribute)
    },

    getAvailableAttributeValues: function(){
        return this.pars.productSpecification.getAvailableAttributeValues(this.pars.attribute)
    }
}

// ============================= Store.DhtmlComboAttribute ===============================
Store.DhtmlComboAttribute = Class.create(Df.Combo)
Store.DhtmlComboAttribute.addMethods(Store.ProductSpecificationAttribute)
Store.DhtmlComboAttribute.addMethods({
    initialize: function($super, element, pars){
	$super(element, pars)
        this.subscribeToSpecification()
        this.registerEvents()
        return this
    },

    _initPars: function($super, pars){
        $super()
        this.setPars({
            attribute: false,
            productSpecification: false,
            data: [],
            selectText: 'Choose',
            observe: true,
            fire: true,
            labelAttribute: false,
            imageAttributes: {slice: 'color_code', type:'S20', view:'pattern'}
        })
        this.setPars(pars)
    },
    
    getListItemImage: function(rec){
        var r
        if(this.pars.imageAttributes){
            var ig = this.getProduct().getImagesBy(this.pars.imageAttributes.slice, this.getListItemValue(rec))
            if(ig){
                var i = ig.getBy({view:this.pars.imageAttributes.view, type:this.pars.imageAttributes.type})
                if(i && i[0]){
                   r = i[0]
                }
            }
        }
        return r
    },

    _updateObserver: function(e){
	if(this.getCurrentValue() !== this.getSpecificationValue()){
	    this.pars.productSpecification.fire(
		':attributeUpdate',
		Object.extend(e.memo, {attribute: this.pars.attribute}
	    ))
	}
    },

    _attributeUpdateObserver: function(e){
	this.fire(':build')
        if(this.getSpecificationValue()){
            this.setCurrentValue(this.getSpecificationValue())
            this.highlightSelection()
        } else {
            this.clearSelected()
            this.element.update(this.pars.selectText)
        }

        // Store currently selected color
        if (this.pars.attribute == 'color') {
            Store.selectedColor = this.currentValue;
        }
    },

    _buildObserver: function(e){
        this.element.update(this.pars.selectText);
        if (!Store.colorSizePrice)
            Store.colorSizePrice = {};
        if (!Store.validSize)
            Store.validSize = [];

        var productId = this.pars.productSpecification.getProduct().getProductId();

        var attributeData = this.getAvailableAttributeValues().collect(function(rec){

            // Get sku and attribute data based on attribute value (rec)
            var skuData = this.getCommonSkuDataByAttribute(rec);
                
            // For colors check if image type is available (image type is set in pars)
            var skuDataDescription;
            if (this.pars.attribute == "color") {
                var i = this.getListItemImage(rec);
                
                // Return null if sku does not have color swatch image
                if (!i && ess.esmc.productAvailableColorIds[productId.toString()].indexOf(rec) == -1)
                    return null;
                
                var skuPriceRange = this.validateSkusAndGetPriceRangeByAttribute(rec);
                var hasPriceRange = (skuPriceRange.minPrice != skuPriceRange.maxPrice && skuPriceRange.minPrice != 0);
                skuDataDescription = ess.titleCase(skuData.label);

                // Add price to color label if product has SKU level pricing and skus determined as valid have multiple prices
                if (this.getProduct().getPriceType() == 'SKU' && hasPriceRange) {
                    skuDataDescription += " - &pound;" + skuPriceRange.minPrice + " - &pound;" + skuPriceRange.maxPrice;
                } else if (this.getProduct().getPriceType() == 'SKU' && !hasPriceRange) {
                    skuDataDescription += " - &pound;"+skuPriceRange.minPrice;
                }
            } else if (this.pars.attribute == "size") {

                // Return null if not valid size (sku has no color swatch)
                if (!Store.validSize[skuData.size]) {
                    return null;
                }

                // Add price to size label
                skuDataDescription = skuData.label;
                if (this.getProduct().getPriceType() == 'SKU') {
                    if (typeof(Store.selectedColor) !== "undefined"
                        && Store.selectedColor != null
                        && Store.colorSizePrice[Store.selectedColor][skuData.size]) {
                        try {
                            skuDataDescription += " - &pound;"+Store.colorSizePrice[Store.selectedColor][skuData.size];
                        } catch(err) {/*no color size combination*/}
                    }
                }
            }
               
            return {
                'label': (skuDataDescription || rec),
                'value': skuData.value
            }
        }.bind(this))
        
        // Remove null values
        attributeData = attributeData.reject(function(item) {
            return item == null;
        });
        
        // Populate dropdown
        this.repopulateData(attributeData);

        if(this.getAvailableAttributeValues().length == 1 || attributeData.length == 1){
            this.setCurrentValue(attributeData[0].value);
            this.element.update(attributeData[0].label || attributeData[0].value);
            this.highlightSelection();
            this.element.removeClassName('combo');
            this.element.addClassName('comboSingleSelection');
            Event.stopObserving(this.element, 'click', this._down);
        }else{
            this.element.removeClassName('comboSingleSelection');
            this.element.addClassName('combo');
        }
        
        return this
    }
})

// ============================= Store.SwatchAttribute ===============================
Store.SwatchAttribute = Class.create(Df.Element)
Store.SwatchAttribute.addMethods(Store.ProductSpecificationAttribute)
Store.SwatchAttribute.addMethods({
    initialize: function($super, element, pars){
        $super(element, pars)

        this.subscribeToSpecification()
        this.registerEvents()

        return this
    },

    _initPars: function($super, pars){
        $super()
        this.setPars({
            attribute: false,
            productSpecification: false,
            swatchClassName : "swatch",
            selectedSwatchClassName : "selected",
            observe: true,
            fire: true,
            labelAttribute: false,
            imageAttributes: false
        })
        this.setPars(pars)
    },

    updateEvent: function(){
        this.element.observe('click', this.__updateObserver)
        return this
    },

    getListItemImage: function(rec){
	var r
	if(this.pars.imageAttributes){
	    var ig = this.getProduct().getImagesBy(this.pars.imageAttributes.slice, this.getListItemValue(rec))
	    if(ig){
		var i = ig.getBy({view:this.pars.imageAttributes.view, type:this.pars.imageAttributes.type})
		if(i && i[0]){
		   r = i[0]
		}
	    }
	}
	return r
    },

    selectChildByValue: function(val){
	this.element.select('div.' + this.pars.swatchClassName).each(function(v){
            if(val == this.getListItemValue(v.attributeValue)){
                v.addClassName(this.pars.selectedSwatchClassName)
            } else {
                v.removeClassName(this.pars.selectedSwatchClassName)
            }
        }.bind(this))
    },

    _updateObserver: function(e){
        if(e.target.hasClassName(this.pars.swatchClassName) && !e.target.hasClassName(this.pars.selectedSwatchClassName)){
            e.stop()

            this.element.selectedValue = this.getListItemValue(e.target.attributeValue)
	    this.selectChildByValue(this.element.selectedValue)

            this.pars.productSpecification.fire(':attributeUpdate', {
                currentValue: this.getListItemValue(e.target.attributeValue),
                currentLabel: this.getListItemLabel(e.target.attributeValue),
                attribute: this.pars.attribute
            })
        }
    },

    _attributeUpdateObserver: function(e){
	this.fire(':build')
	if(this.getSpecificationValue())
	    this.selectChildByValue(this.getSpecificationValue())
    },

    _buildObserver: function(e){
	this.element.update('')
        this.getAvailableAttributeValues().each(function(rec){
	    var el = this.element.e('div').addClassName(this.pars.swatchClassName)
            el.attributeValue = rec
	    var i = this.getListItemImage(rec)
	    if(i){
            /* alert('--- Store.js ---\n--- (1) _buildObserver ---' + '\nel = ' + el); */
            el.setStyle({backgroundImage:'url("' + i.src + '")'})
            el.title = this.getListItemLabel(rec) || this.getListItemValue(rec)
	    } else {
		    el.update(this.getListItemLabel(rec) || this.getListItemValue(rec))
	    }
	}.bind(this))
        this.element.insert('<div class="break">&nbsp;</div>')
	return this
    }
})

// ============================= Store.AltImagesAttribute ===============================
Store.AltImagesAttribute = Class.create(Store.SwatchAttribute, {

    observeEvent: function(){
        this.pars.productSpecification.observe(':' + this.pars.attribute + 'Update', this.__attributeUpdateObserver)
        return this
    },

    updateEvent: function(){
        this.element.observe('click', this.__updateObserver)
        return this
    },

    selectChildByValue: function(val){
        this.element.select('div.' + this.pars.swatchClassName).each(function(v){
            if(val == v.attributeValue.view){
                v.addClassName(this.pars.selectedSwatchClassName)
            } else {
                v.removeClassName(this.pars.selectedSwatchClassName)
            }
        }.bind(this))
    },

    _updateObserver: function(e){
        if(e.target.hasClassName(this.pars.swatchClassName) && !e.target.hasClassName(this.pars.selectedSwatchClassName)){
            e.stop()
            this.selectChildByValue(e.target.attributeValue.view)
            this.pars.productSpecification.fire(':viewUpdate', {
                view: e.target.attributeValue.view,
                currentValue: this.getSpecificationValue(),
                slice: this.pars.imageAttributes.slice
            })
        }
    },

    _attributeUpdateObserver: function(e){
        this.fire(':build')
    },

    getAvailableImages: function(){
        var r
        if(this.getSpecificationValue()){
            var ig = this.getProduct().getImagesBy(this.pars.imageAttributes.slice, this.getSpecificationValue())
            if(ig){
                var i = ig.getBy({type: this.pars.imageAttributes.type})
                if(i && i[0]){
                   r = i
                }
            }
        }
        if(r){
            return r
        } else {
            return this.getProduct().getImages().getBy({type: this.pars.imageAttributes.type})
        }
    },

    _buildObserver: function(e){
        this.element.update('')
        this.getAvailableImages().each(function(rec){
	    /*
            var el = this.element.e('li').e('img')
	    el.src = rec.src
            */
	    var el = this.element.e('div').addClassName(this.pars.swatchClassName)
        el.attributeValue = rec
        /* alert('--- Store.js ---\n--- (2) _buildObserver ---' + '\nel = ' + el); */
	    el.setStyle({backgroundImage:'url("' + rec.src + '")'})
	    el.title = rec.view
	}.bind(this))
        this.element.insert('<div class="break">&nbsp;</div>')
	return this
    }
})


Store.FormComboAttribute = Class.create(Df.Element, {
    initialize: function($super, element, pars){
        $super(element, pars)

        this.pars.productSpecification.registerSelector(this)

        if(this.pars.fire){
            this.__updateObserver = this._updateObserver.bind(this)
            this.element.observe('change', this.__updateObserver)
        }

        if(this.pars.observe){
            this.__attributeUpdateObserver = this._attributeUpdateObserver.bind(this)
            this.pars.productSpecification.observe(':attributeUpdate', this.__attributeUpdateObserver)
        }

        this.__buildObserver = this._buildObserver.bind(this)
        this.observe(':build', this.__buildObserver )

        return this
    },

    _initPars: function($super, pars){
        $super()
        this.setPars({
            attribute: false,
            productSpecification: false,
            data: [],
            observe: true,
            fire: true,
            labelAttribute: false
        })
        this.setPars(pars)
    },

    _updateObserver: function(e){
        this.pars.productSpecification.updateCascade(this.pars.attribute)

        //half way working
        //if(this.pars.productSpecification.getAttribute(this.pars.attribute) != e.target.value){
            this.pars.productSpecification.fire(
                ':attributeUpdate',
                Object.extend({currentIndex: e.target.selectedIndex, currentValue: e.target.value, currentLabel: e.target.value}, {attribute: this.pars.attribute})
            )
        //}
    },

    _attributeUpdateObserver: function(e){
        var memVal = this.pars.productSpecification.getAttribute(this.pars.attribute) || this.element.value

        if(!this.pars.productSpecification._cascade.include(this.pars.attribute)){
            this.fire(':build')
        }

        this.element.value(memVal)
    },

    _buildObserver: function(e){
        this.element.update(
            this._formatList(
                this.pars.productSpecification.getFilteredByGroups(this.pars.attribute)[this.pars.attribute],
                {'value': '', 'label': 'Choose :' + this.pars.attribute}
            )
        )
        return this
    },

    _formatList: function(list, empty){
        str = '<option value="'+ empty['value'] +'">'+ empty['label'] +'</option>'
        str += $A(list).collect(function(rec){
            var label = rec[0]
            if(this.pars.labelAttribute){
                label = rec[1][0][this.pars.labelAttribute]
            }
            return '<option value="'+rec[0]+'">'+label+'</option>'
        }.bind(this)).join('')

        return str
    }
});



Store.ES = Class.create(Df.Element, {

    _setup: function($super){
        $super()

        this.initializer = 'main'
        this.selectedSku = false
        this.__setSelectedSku = false
        this.state = 'new'
        this.carouselProdIds = false
        this.xsell = {fire:function(e){}}

        this.productSpecifications = []
        this.productStates = []

        this.parser = new ZParse(Implementation);
        this.productCacheManager = this.createProductCacheManager()

        this._close = this.close.bindAsEventListener(this)
        this.__addToCart = this._addToCart.bind(this)
        this.__updateCartItem = this._updateCartItem.bind(this)
        this.__addToWishlist = this._addToWishlist.bindAsEventListener(this)
        this.__esClickObserver = this._esClickObserver.bindAsEventListener(this)

        this.controllers()
        this.eventMaps()


        this.carouselItems = {
            next: false,
            previous: false
        }

        if(this.pars.crossSells){
            this.xsell = new Store.CrossSells(this.pars.crossSells)
                this.xsell.observe(this.pars.crossSells.crossSellClickEvent, function(e){
                    this.productStates = []
                    this.initializer = 'crossSellClick'
                    this.fire(':loadProduct', {productId:e.memo.pid, carouselProdIds: e.memo.xsells})
                }.bind(this))
        }

        if(this.pars.promoEngine){
            this.promoEngine = new Store.PromoEngine(this.pars.promoEngine)
        }

    },

    _initPars: function($super, pars){
        $super()
        this.setPars({
            crossSells: false,
            promoEngine: false,
            serviceURL: false,
	    tip: false
        })
        this.setPars(pars)
    },

    controllers: function(){
        this.observe(':loadProduct', this.loadProduct.bind(this))

        if(this.pars.useForEdits){
            $(document.body).observe(':loadProduct', this.loadProduct.bind(this))
        }

        this.observe(':renderMainProduct', this.renderMainProduct.bind(this))
    },

    eventMaps: function(){
        this.productCacheManager.observe(':ItemSelection', function(e){
            this.fire(':renderMainProduct', {data: e.memo.object})
        }.bind(this))

        this.element.observe('click', this.__esClickObserver)

    },

    _esClickObserver: function(e){
        var elem = $(e.target)

        if(elem.hasClassName('zoomIn')){
            e.stop()
            this.element.select('div.productImage')[0].fire(':zoomIn', {event:e})
        }
        if(elem.hasClassName('zoomOut')){
            e.stop()
            this.element.select('div.productImage')[0].fire(':zoomOut', {event:e})
        }
    },

    process: function(){
        this.parser.parse($('express-shop-template').innerHTML)
        this.element.update(this.parser.process({
            es:this,
            product: this.mainProduct,
            productPrice: this.mainProduct.getPrice().getHTML()
        }))

        this.parser.parse($('express-shop-sku-template').innerHTML)
    	this.element.select('.slices')[0].update(this.parser.process({}))

        this.renderAdditionalData()

    },

    renderAdditionalData: function(){
        if(this.promoEngine){
            this.promoEngine.getPromosByProducts(this.mainProduct.pars.productId)
        }
        if(this.pars.crossSells){
            this.xsell.fire(':getCrossSells',{pids:this.mainProduct.pars.productId})
        }
    },

    //BEGIN Command Methods
    _setSelectedSku: function(e){
        this.productState.getProductSpecification().getFilteredSkus().each(function(v){
            if(v.sid == e.memo.sku){
                this.selectedSku = v
                return
            }
        }.bind(this))
        this.selectedSku.cartId = e.memo.uniqueLineId
        this.selectedSku.quantity = e.memo.quantity

        es.productState.getProductSpecification().fire(':attributeUpdate', {attribute:'size', currentValue:this.selectedSku.size})
        es.productState.getProductSpecification().fire(':attributeUpdate', {attribute:'colorLabel', currentValue:this.selectedSku.colorLabel})
        this.buildQuantitybox(e)

        this.stopObserving(':productLoaded', this.__setSelectedSku)
    },

    fireAnalytics: function(){

        var memo = {
                id: this.mainProduct.getProductId(),
                longTitle: this.mainProduct.getLongTitle(),
                shortTitle: this.mainProduct.getTitle(),
                mfgStyleCode: '',
                type: 'STANDARD',
                available: true
        }

        switch(this.initializer){
            case 'crossSellClick':
                $(document).fire("es:product-view-cross-sell", memo)
                break;
            case 'carouselClick':
                $(document).fire("es:product-view-next", memo)
                break;
            case 'mcCrossSellClick':
                this.initializer = 'mcCrossSell'
                break;
            case 'mcCrossSell':
                $(document).fire("mc:product-add-cross-sell", memo)
                break;
            default:
                $(document).fire("es:product-view-initial", memo)
                break;
        }
    },

    renderMainProduct: function(e){
        this.element.removeClassName('expressShopLoader')
        this.mainProduct = e.memo.data

            if(this.carouselProdIds){
                this.processCarouselItems()
            }

            this.fireAnalytics()

        this.process()

        this.element.removeClassName('expressShopLoader')

        this.productSpec = new Store.ProductSpecification()

        this.productState = new Store.ProductState({
            product: this.mainProduct,
            productSpecification: this.productSpec
        })

        this.productSpecifications.push(new Store.ProductSpecification())
        this.productStates.push(this.productState)

        Store.validSize = [];
        Store.selectedColor = null;
        
        //color swatches
        this.buildColorSelector()
        
        //size selector
        this.buildSizeSelector()

        //alt images
        this.buildAltImageSelector()

        //productImage
        this.buildProductImage()

        //productPrice
        this.buildPrice()

        //product rating
        this.buildRating()

        //cart button
        try{
    	    this._cartTip = this.element.select(this.pars.tip.element)[0].tip(this.pars.tip.pars)
        }catch(e){
            this._cartTip = false
        }

        this.productState.observe(':stateUpdate', function(e){
            var c = this.element.select('div.addToCart')[0]
            var w = this.element.select('div.addToWishlist')
            if(w.length > 0){
                w = this.element.select('div.addToWishlist')[0]
            }else{
                w = false
            }
            if(e.memo.cartable){
                c.removeClassName('addToCartDisabled')
                if(w){
                    w.removeClassName('addToCartDisabled')
                    w.observe('click', this.__addToWishlist)
                }
                this._setCarTip('', false)

                if(this.state == 'edit'){
                    c.observe('click', this.__updateCartItem)
                }else{
                    c.observe('click', this.__addToCart)
                }
            } else {
                c.addClassName('addToCartDisabled')
                this._setCarTip(this.cartTipContent(), 'hover')

                c.stopObserving('click', this.__addToCart)
                c.stopObserving('click', this.__updateCartItem)

                if(w){
                    w.addClassName('addToCartDisabled')
                    w.stopObserving('click', this.__addToWishlist)
                }
            }
        }.bind(this))

        var n = this.element.select('div.esNextPreviousHolder')[0]
        if(n){
                n.observe('click', this._handleCarouselClick.bindAsEventListener(this))
        }

        this.productSpec.fire(':buildSpecification', {
            product: this.mainProduct
        })

        this.buildQuantitybox(e)
        this.fire(':productLoaded')

    },

    _setCarTip: function(c, e){
        if(this._cartTip){
            this._cartTip.setContent(c)
            this._cartTip.togglePane.eventType(e)
        }
    },

    buildQuantitybox: function(e){
        var elems = this.element.select('input.qty')
        var elem = elems[elems.length -1]

        if(this.state == 'edit'){
            elem.value = this.selectedSku.quantity
        }

        this.productState.setQuantity(elem.value)

        elem.observe('keyup', function(e){
             this.productState.setQuantity(e.target.value)
        }.bind(this))
    },

    buildSizeSelector: function(){
        var elems = this.element.select('div.combo')
        var elem = elems[elems.length-1]

        new Store.DhtmlComboAttribute(
            elem, {
                attribute: 'size',
                productSpecification: this.productSpec,
                selectText: 'Choose a size',
                labelAttribute: 'sizeLabel',
                appendto:this.element.select('.slices')[0],
                offSetType:"positionedOffset"
            }
        )
    },

    buildColorSelector: function(el){
        var elems = this.element.select('div.swatchContainer')
        var elem = elems[elems.length-1]

        new Store.SwatchAttribute(
            elem, {
            attribute: 'colorLabel',
            productSpecification: this.productSpec,
            imageAttributes: {slice: 'ColorName', type:'S22x20', view:'pattern'}
            }
        )
    },

    buildAltImageSelector: function(){
        new Store.AltImagesAttribute(
            this.element.select('div.altContainer')[0], {
            attribute: 'colorLabel',
            productSpecification: this.productSpec,
            imageAttributes: {slice: 'ColorName', type:'THN'}
            }
        )
    },

    buildPrice: function(){
        this.productSpec.observe(':attributeUpdate', function(e){
            var p = this.productSpec.getAvailableAttributeValues('price')
            var price = {}
            if(this.mainProduct.getPriceType() !== 'SKU'){
            price.base = parseFloat(this.mainProduct.getBasePrice())
            }
            if(p.length > 1){
            price.price = [p.min(), p.max()]
            }else{
            price.price = p[0]
            }
            this.setPrice(this.mainProduct.getPrice().parser.process(price))
        }.bind(this))
    },

    buildProductImage: function(){
        this.productSpec.observe(':colorLabelUpdate', function(e){
            this._productImage.load({
            base: this.getMainProductImageForSlice('ColorName', e.memo.currentValue, null, null).src,
            zoom: this.getMainProductImageForSlice('ColorName', e.memo.currentValue, null, '500x607').src
            })
        }.bind(this)).observe(':viewUpdate', function(e){
            this._productImage.load({
            base: this.getMainProductImageForSlice(e.memo.slice, e.memo.currentValue, e.memo.view, null).src,
            zoom: this.getMainProductImageForSlice(e.memo.slice, e.memo.currentValue, e.memo.view, '500x607').src
            })
        }.bind(this))

        this._productImage = new Df.EmbeddedZoom(this.element.select('div.productImage')[0], {
            loader: Df.e('div', {className:'loader'})
        }).load({
            base: this.getMainProductImageForSlice(null, null, null, null).src,
            zoom: this.getMainProductImageForSlice(null, null, null, '500x607').src
        })
    },

    buildRating: function(){
        new Store.Rating(this.element.select('a.rating')[0], {
            total: 5,
            interactive: false,
            rating: this.mainProduct.getAverageReviewRating()
        })
    },

    _handleCarouselClick: function(e){
        target = $(e.target)
        if (target.hasClassName('carouselEnabled')){
            if (target.hasClassName('carouselNext') ){
                this.goToCarouselItem(1)
            }else if(target.hasClassName('carouselPrevious') ){
                this.goToCarouselItem(-1)
            }
        }
    },

    _addToCart:function(e){
        var prods = []
        var prodId = this.mainProduct.getProductId()

        this.productStates.each(function(v){
            prods.push({
                productId: prodId,
                skuId: v.getProductSpecification().getFilteredSkus()[0].sid,
                quantity: v.getQuantity()
            })
        })

        $(document.body).fire(':addItemToCart', {products: prods})

        if(this.initializer == 'mcCrossSell'){
            this.fireAnalytics()
        }

        this.close()

    },

    _updateCartItem:function(e){
        Store.ESMCLastEditedProductID = this.selectedSku.cartId;
        if(this.productState.getProductSpecification().getFilteredSkus()[0].sid == this.selectedSku.sid){
            $(document.body).fire(':updateCartItem', {uniqueLineId:this.selectedSku.cartId, quantity: this.productState.getQuantity()})
        }else{
            $(document.body).fire(':replaceCartItem',{
                    uniqueLineId:this.selectedSku.cartId,
                    productId: this.mainProduct.getProductId(),
                    skuId: this.productState.getProductSpecification().getFilteredSkus()[0].sid,
                    quantity: this.productStates[0].getQuantity()
                })
        }
            this.close()
    },

    _addToWishlist:function(e){
        this.parser.parse($('wishlist-form-template').innerHTML)
        $$('.addToWishlist')[0].insert(this.parser.process({
            pid:this.mainProduct.getProductId(),
                color:this.productState.getProductSpecification().getFilteredSkus()[0].color,
            sid: this.productState.getProductSpecification().getFilteredSkus()[0].sid,
            qty: this.productState.getQuantity()
        }))
        $('esAddToWishlistForm').submit()
    },

    _updateWishlistItem:function(e){
        Df.console.log('<<<<<<<<<<<<<<<<<<<<<<<<',
            'updateWishlistItem < We may not need this function',
            '>>>>>>>>>>>>>>>>>>>>>>>>')
    },

    cartTipContent: function(){
        var selectors = this.productSpec.getSelectors()
        var selections = this.productSpec.getAttributes()
        var string = ''
        for (var p in selectors) {
            if(Object.isUndefined(selections[p])){
            string += '<div>Please select a ' + p + '<\/div>'
            }
        }
        if(!this.productState.getQuantity() > 0){
            string += '<div>Please select a quantity<\/div>'
        }
        return string
    },

    setPrice: function(price){
        try {
            if(price){
                this.element.select('.productPrice')[0].update(price)
            } else {
                this.element.select('.productPrice')[0].update(this.mainProduct.getPrice().getHTML())
            }
        } catch(err){}
    },

    getMainProductImageForSlice: function(slice, value, view, type){
        if(!view){
            view = 'main'
        }
        if(!type){
            type = 'REG'
        }
        var i
        if(slice && value){
            var ig = this.mainProduct.getImagesBy(slice, value)
            if(ig){
            igg = ig.getBy({view:view, type:type})
            if(igg){
                i = igg[0]
            }
            }
        }
        if(!i){
            i = this.mainProduct.getImages().getBy({view:view, type:type})[0]
        }
        return i
    },

    loadProduct: function(e){
        this.open()
        this.state = 'new'
        this.selectedSku = false
        if(e.memo.state && e.memo.state == 'edit'){
            this.state = e.memo.state
            this.__setSelectedSku = this._setSelectedSku.bind(this, e)
            this.observe(':productLoaded', this.__setSelectedSku)
        }

        this.element.update()
        this.element.addClassName('expressShopLoader')
        this.productCacheManager.get(e.memo.productId)

        if(e.memo.carouselProdIds){
            this.carouselProdIds = e.memo.carouselProdIds
        }

        this.initializer = ''
        if(e.memo.initializer){
                this.initializer = e.memo.initializer
        }
    },
    //END Command Methods

    processCarouselItems: function(){
        if(this.carouselProdIds.indexOf(this.mainProduct.pars.productId) > 0){
            this.carouselItems.previous = true
        }else{
            this.carouselItems.previous = false
        }

        if(this.carouselProdIds.indexOf(this.mainProduct.pars.productId) < this.carouselProdIds.length-1){
            this.carouselItems.next = true
        }else{
            this.carouselItems.next = false
        }
    },

    // next/previous
    goToCarouselItem: function(num){
        this.clearEventListeners()
        var pos = this.carouselProdIds[this.carouselProdIds.indexOf(this.mainProduct.pars.productId) + num]
        this.initializer = 'carouselClick'
        this.fire(':loadProduct', {productId: pos, carouselProdIds: this.carouselProdIds})
    },

    close: function(){
        this.productStates = []
        this.element.update('')
        this.element.hide()
    },

    open: function(){
        this.element.show()
    },

    clearEventListeners: function(){
        //deregister EventListeners
        var n = this.element.select('div.esNextPreviousHolder')[0]
        n.stopObserving('click', this._handleCarouselClick.bindAsEventListener(this))
    },

    createProductCacheManager: function(){
        return new Store.ProductCacheManager(this.pars.productService)
    }
})

Store.MC = Class.create(Df.Ui, {
    _setup: function($super){
        $super()

        this.cart = new Store.Cart(Object.extend({miniCart:this},this.pars));
        this.parser = new ZParse(Implementation);
        this.displayed = false
        this.state = 'mcView'
        this.miniCartHolder = $$(this.pars.elements.miniCart)
        this.confirmationHolder = false
        this._timeout

        this.__updateProductView = this._updateProductView.bindAsEventListener(this)
        this.__updateSummaryView = this._updateSummaryView.bindAsEventListener(this)
        this.__updateMicroView = this._updateMicroView.bindAsEventListener(this)
        this.__renderEmptyCart = this._renderEmptyCart.bindAsEventListener(this)
        this.__stopTimer = this._stopTimer.bindAsEventListener(this)
        this.__stopConfirmationTimer = this._stopConfirmationTimer.bindAsEventListener(this)
        this.__fireAnalytics = this._fireAnalytics.bindAsEventListener(this)
        this.__failureHandler = this._failureHandler.bindAsEventListener(this)
        this.__mcClickObserver = this._mcClickObserver.bindAsEventListener(this)
        this._showConfirmation = this.showConfirmation.bindAsEventListener(this)
        this.__renderConfirmationSummaryView = this._renderConfirmationSummaryView.bindAsEventListener(this)
        this._close = this.close.bindAsEventListener(this)
        this._resizeMiniCart = this.resizeMiniCart.bind(this)

        this.cart.observe(':cartProductsUpdated', this.__updateProductView)
        this.cart.observe(':summaryUpdated', this.__updateSummaryView)
        this.cart.observe(':summaryUpdated', this.__updateMicroView)
        this.cart.observe(':cartActionFailed', this.__failureHandler)

        this.element.observe('click', this.__mcClickObserver)

        $(document.body).observe(':viewCart', function(e){
            this.open(e)
        }.bind(this))

        this.observe(':viewConfirmation', this._showConfirmation)

        $(document.body).observe(':hideCart', function(e){
            this.displayed = false
            $$(this.pars.elements.miniCart)[0].stopObserving('mouseover', this.__stopTimer)
            this.close()
        }.bind(this))

        $(document.body).observe(':cartEmpty', function(e){
            this.__renderEmptyCart(e)
        }.bind(this))

        this.cart.observe(':addToBagViewEvent', function(e){

            if(this.pars.templates.confirmationView){
		this.confirmationHolder = $$(this.pars.elements.confirmationHolder)
                this.fire(':viewConfirmation')
                this.state = 'mcConfirmation'
            }else{
                this.cart.fire(':viewCart')
                this.state = 'mcAutoView'
            }

        }.bind(this))

        this.observe('mc:fireAnalytics', this.__fireAnalytics)

        if(this.pars.templates.confirmationSummary){
            this.cart.observe(':summaryUpdated', this.__renderConfirmationSummaryView)
        }
    },

    _mcClickObserver: function(e){
        var elem = $(e.target)
        if(elem.hasClassName('remove')){
            e.stop()
            $(document.body).fire(':removeCartItem', {uniqueLineId:elem.up().id})
            this._resizeMiniCart()
        }else if(elem.hasClassName('mcEdit')){
            e.stop()
            $(document.body).fire(':editCartItem', {uniqueLineId:elem.up().id})
            this.close()
        }else if(elem.hasClassName('mcContinueShopping')){
            this.close()
        }else if(elem.hasClassName('mcProdTitleLink') || elem.up('.mcProdTitleLink')){
            window.location = ess.productCollection[elem.down('.mcActionButtons').id].url
        }
    },

    resizeMiniCart: function(){
	return false;
    },

    _failureHandler: function(e){
        window.location.href = Store.vars.cartUrl;
    },

    _fireAnalytics: function(e){

        var memo = {
            mfgStyleCode: 'pvcs-msc',
            type: 'STANDARD',
            available: true,
            analyticsEmptyCart: e.memo.analyticsEmptyCart
        }

        if(e.memo.prod){
            Object.extend(memo, {id:e.memo.prod.productId, longTitle: e.memo.prod.longTitle, shortTitle: e.memo.prod.shortTitle})
        }

        switch(e.memo.event){
            case 'crossSellClick':
                $(document).fire("mc:product-view-cross-sell", memo)
                break;
            case 'removeItem':
                $(document).fire("mc:product-remove", memo)
                break;
            case 'viewMinicart':
                Object.extend(memo, {products:this.cart._cartItems})
                $(document).fire("mc:cart-view", memo)
                break;
            case 'editItem':
                $(document).fire("mc:product-view", memo)
                break;
            case 'addItem':
                var cartAddSrc = "ES";
                if (e.memo.cartAddSrc) {
                    cartAddSrc = e.memo.cartAddSrc;
                }
                Object.extend(memo, {cartAddSrc: cartAddSrc, skuId: e.memo.prod.skuId, quantity: e.memo.prod.quantity})
                $(document).fire("es:product-add-to-cart", memo)
                break;
            default:
                break;
        }
    },

    _stopTimer: function(e){
        clearTimeout(this._timer)
        $$(this.pars.elements.miniCart)[0].stopObserving('mouseover', this.__stopTimer)
    },

    _stopConfirmationTimer: function(e){
        clearTimeout(this._timer)
        $$(this.pars.elements.confirmationHolder)[0].stopObserving('mouseover', this.__stopConfirmationTimer)
    },

    fireClose: function(e){
        $(document.body).fire(':hideCart')
    },

    _initPars: function($super, pars){
        $super()
        this.setPars({
            templates:{
                cartProduct: $('minicart-products-template').innerHTML,
                cartSummary: $('minicart-summary-template').innerHTML,
                confirmationView: $('minicart-confirmview-template').innerHTML,
                microView: $('minicart-microview-template').innerHTML,
		        emptyCart: $('minicart-empty-template').innerHTML
            },
            elements:{
                miniCart: '.miniCart',
                confirmationHolder: '.mcConfirm',
                cartSummary:'.cartDetails',
                products:'.cartProducts',
		        emptyCart: '.cartProducts',
                micro:'.cartMicro',
                buttons:{
                    editProduct:'.mcEdit',
                    deleteProduct:'.mcDelete',
                    checkout:'.mcCheckout',
                    viewMainCart: '.mcViewCart',
                    close:'.mcClose',
                    continueShopping:'.mcContinueShopping'
                }
            },
            displayTimeOut: 4000,
            displayOnAddToBag: true,
            container: 'miniCart',
            crossSells: false,
            drag: false,
            hideOnEmpty: true,
            maxPromos: false
        })
        this.setPars(pars)
    },

    _renderEmptyCart: function(e){
        this._processTemplate(this.miniCartHolder, this.pars.templates.emptyCart, {}, this.pars.elements.emptyCart)
        this.resizeMiniCart(true)
    },

    _additionalConfirmationTasks: function(){

    },

    _renderConfirmationView: function(){
        var items = this.cart._orderItemsByDate();

        // moves the updated item to the front of the array
        items = this._shiftUpdatedItemFirst(items);

	    /* alert(items.length); */
        this._processTemplate(this.confirmationHolder, this.pars.templates.confirmationView, {pidData:this.cart._cartProds, cartProducts:items}, false, this._additionalConfirmationTasks)
        this.cart.confxsell.fire(':getCrossSells',{pids:[items[0].productId]})
    },

    _shiftUpdatedItemFirst: function(items) {
      // moves the updated item to the front of the array

      if (isNaN(Store.ESMCLastEditedProductID) || items.length < 2) {
        return items;
      }

      var updatedId = parseInt(Store.ESMCLastEditedProductID);
      var newItems = [];
      var updatedItem = [];
      for (var i = 0; i < items.length; i++) {
        if (updatedId == parseInt(items[i].uniqueLineId)) {
          updatedItem.push(items[i]);
        } else {
          newItems.push(items[i]);
        }
      }
      // reset the value
      Store.ESMCLastEditedProductID = 0;

      return updatedItem.concat(newItems);
    },

    _renderConfirmationSummaryView: function(e){
        if(this.state == 'mcConfirmation'){
            this._processTemplate(this.confirmationHolder, this.pars.templates.confirmationSummary, e.memo, this.pars.elements.confirmationSummary)
        }
    },

    _updateProductView: function(e){
        this._processTemplate(this.miniCartHolder, this.pars.templates.cartProduct, e.memo, this.pars.elements.products)
        this.fire(':productViewUpdated')
        this.resizeMiniCart()
    },

    _updateSummaryView: function(e){
        this._processTemplate(this.miniCartHolder, this.pars.templates.cartSummary, e.memo, this.pars.elements.cartSummary)
        this.resizeMiniCart()
    },

    _updateMicroView: function(e){
        this._processTemplate(this.miniCartHolder ,this.pars.templates.microView, e.memo, this.pars.elements.micro)
        this.resizeMiniCart()
    },

    _processTemplate: function(holder, template, data, el, callback){
        var succ = this.parser.parse(template);
        if(succ){
            holder.each(function(v){
                if(el){
                    v.select(el).each(function(vv){
                        vv.innerHTML = this.parser.process(data)
                    }.bind(this))
                }else{
                    v.innerHTML = this.parser.process(data)
                }
            }.bind(this))

            if(callback){
                callback.defer()
            }
        }

    },

    close: function(e){
        if(e){
            e.stop()
        }
        this.element.hide()
        $(document.body).stopObserving('click', this._close)
    },

    open: function(e){
        if(e){
            e.stop()
        }
        this.displayed = true
        this.element.show()
        $(document.body).observe('click', this._close)

        if(this.pars.displayTimeOut && this.state == 'mcAutoView'){
            this.state = 'mcView'
            this._timer = setTimeout( this.fireClose.bind(this), this.pars.displayTimeOut);
            $$(this.pars.elements.miniCart)[0].observe('mouseover', this.__stopTimer)
        }
    },

    showConfirmation: function(e){
		this._renderConfirmationView()
        if(this.pars.displayTimeOut){
            this._timer = setTimeout( this.closeConfirmation.bind(this), this.pars.displayTimeOut);
            $$(this.pars.elements.confirmationHolder)[0].observe('mouseover', this.__stopConfirmationTimer)
        }
    },

    closeConfirmation: function(){

    }
})
/*
 *	Cart Controller Class
 *		Events:
 *			Fired on
 *				document.body:
 *					':loadProduct'
 *						memo: {uniqueLineId:prod.uniqueLineId, productId:prod.productId, sku:sid, quantity:prod.quantity, state: 'edit'}
 *					':cartResponse'
 *						memo: {response:response.responseText}
 *					':cartRequestComplete'
 *						memo: {response: response} or {response:response, event:eventName}
 *
 *
 *
*/
Store.Cart = Class.create(Df.Base, {

    _setup: function($super){
	$super()

        this._cartData
        this.totalItemsInCart = 0
        this._cartProds = {}
        this._pidData = {}
        this._cartItems = []
        this._productCacheManager = this.createProductCacheManager()
        this.xsell = {fire:function(e){}}
        this.confxsell = {fire:function(e){}}

        if(this.pars.crossSells){
            this.xsell = new Store.CrossSells(this.pars.crossSells)
                this.xsell.observe(this.pars.crossSells.crossSellClickEvent, function(e){
                    $(document.body).fire(':loadProduct', {productId:e.memo.pid, carouselProdIds: e.memo.xsells, initializer:'mcCrossSell'})
                    $(document.body).fire(':hideCart')
                    this.pars.miniCart.fire('mc:fireAnalytics', {event:'crossSellClick', prod:{productId: e.memo.pid, longTitle: e.memo.prod.getLongTitle(), shortTitle: e.memo.prod.getTitle()} })
                }.bind(this))
        }

        if(this.pars.confirmationCrossSells){
            this.confxsell = new Store.CrossSells(this.pars.confirmationCrossSells)
                this.confxsell.observe(this.pars.confirmationCrossSells.crossSellClickEvent, function(e){
                    this.initializer = 'crossSellClick'
                    $(document.body).fire(':loadProduct', {productId:e.memo.pid, carouselProdIds: e.memo.xsells})
                }.bind(this))
        }

        //Event Listener Bindings
        this.__addToCart = this._addToCart.bindAsEventListener(this)
        this.__removeItem = this._removeItem.bindAsEventListener(this)
        this.__replaceCartItem = this._replaceCartItem.bindAsEventListener(this)
        this.__updateCartItem = this._updateCartItem.bindAsEventListener(this)
        this.__processCartResponse = this._processCartResponse.bindAsEventListener(this)
        this.__cartSuccessActions = this._cartSuccessActions.bindAsEventListener(this)
        this.__refreshCart = this._refreshCart.bindAsEventListener(this)
        this.__fireLoadItem = this._fireLoadItem.bindAsEventListener(this)
        this.__showCart = this._showCart.bindAsEventListener(this)
        this.__processViewCartRequest = this._processViewCartRequest.bindAsEventListener(this)

        //Observers for cart actions
        $(document.body).observe(':addItemToCart', this.__addToCart)
        $(document.body).observe(':viewCart', this.__processViewCartRequest)
        this.observe(':viewCart', this.__refreshCart())
        $(document.body).observe(':updateCartItem', this.__updateCartItem)
        $(document.body).observe(':removeCartItem', this.__removeItem)
        $(document.body).observe(':replaceCartItem', this.__replaceCartItem)
        $(document.body).observe(':editCartItem', this.__fireLoadItem)
        this.observe(':cartRequestComplete', this.__processCartResponse)
        this.observe(":cartActionSuccess", this.__cartSuccessActions)
        this.observe(':cartItemRemoved', this.__refreshCart)
        this.observe(':cartItemsUpdated', this.__refreshCart)


        this.observe(':cartResponse', function(e){
            this._getOrderSummary.bind(this)()
            if(this._cartItems.length != 0){
                this._getCartProducts.bind(this)()

                if(this.pars.crossSells){
                    var pids = []
                    this._cartItems.each(function(v){
                        pids.push(v.productId)
                    })

                    this.xsell.fire(':getCrossSells',{pids:pids})
                }
            }
        }.bind(this))

        this._productCacheManager.observe(':ItemSelection', function(e){
            this._pidData = e.memo.object
            this._compileProductData()
        }.bind(this))
    },

    _initPars: function($super, pars){
	    $super()
	    this.setPars({
            productLimit: false
        })
	    this.setPars(pars)
    },

    _showCart: function(e){
        if(this.pars.displayOnAddToBag){
            this.fire(':addToBagViewEvent')
        }
        this.stopObserving(':cartResponse', this.__showCart)
    },

    _setupCartActionObservers: function(e){
        this.observe(':cartResponse', this.__showCart)
    },

    _fireLoadItem:function(e){
        var uniqueLineId = e.memo.uniqueLineId
        var prod = this._cartProds[uniqueLineId]
        $(document.body).fire(':loadProduct', {uniqueLineId:prod.uniqueLineId, productId:prod.productId, sku:prod.skuId, quantity:prod.quantity, state: 'edit'})
        this.pars.miniCart.fire('mc:fireAnalytics', {event:'editItem', prod:prod})
        this.pars.miniCart.state = 'edit'
    },

    // Cart Methods
    _processCartResponse: function(e){
        if(e.memo.response[0].toString() != "OK"){
            this.fire(':cartActionFailed', {response:e.memo.response})
        }else if(e.memo.event){
            this.fire(e.memo.event, {response:e.memo.response})
        }else{
            this.fire(':cartActionSuccess', {response:e.memo.response})
        }
    },

    _refreshCart: function(e){
        this.getCart()
        this.pars.miniCart.state = 'mcView'
    },

    _processViewCartRequest: function(e){
        this._refreshCart(e)
        this.pars.miniCart.fire('mc:fireAnalytics', {event:'viewMinicart'})
    },

    _cartSuccessActions: function(e){
        this._refreshCart(e)
    },

    _getCartProducts: function(){
    	var pids = []
        this._cartItems.each(function(v){
            pids.push(v.productId)
        })

    	this._productCacheManager.get(pids)
    },

    _getItemSubtotal: function(prod){
        if(prod.pricing.itemLevelDiscountedPrice){
            return prod.pricing.itemLevelDiscountedPrice.amount
        }

        return prod.pricing.unitPrice.amount
    },

    _compileProductData: function(){
        var prods = []
        this._cartProds = {}
        var items = this._cartItems

        if(this.pars.productLimit && items.length > this.pars.productLimit){
            items.length = this.pars.productLimit
        }

        for (var i = 0; i<items.length;i++){

            var v = items[i]
            var prodInfo = {}

            if(this.pars.maxPromos && v.appliedPromos.length > this.pars.maxPromos){
                v.appliedPromos.length = this.pars.maxPromos
            }

            if(this._pidData.length){
                this._pidData.each(function(vv, ii){
                    if(v.productId == vv.pars.productId){
                        prodInfo = vv
                        return;
                    }
                }.bind(this));
            }else{
                prodInfo = this._pidData
            }

            var prod = v
            prod.subTotal = this._getItemSubtotal(v)
            this._cartProds[v.uniqueLineId] = prod

            prods.push(prod)
        }
        this.fire(':cartProductsUpdated', {cartProducts:prods})
    },

    _orderItemsByDate: function(){
        var r = this._cartItems
        r.sort(this._sortByDate)
	//r.sort(this._sortAutoPid)
        return r
    },

    _sortByDate: function(aa,bb) {
            if ( parseInt(aa.addedDate.getTime() /1000) == parseInt(bb.addedDate.getTime() /1000) && aa.autoPid && !bb.autoPid)
                return 1;
            if ( parseInt(aa.addedDate.getTime() /1000) == parseInt(bb.addedDate.getTime() /1000) && !aa.autoPid && bb.autoPid)
                return -1;
            if (aa.addedDate < bb.addedDate)
                return 1;
            if (aa.addedDate > bb.addedDate)
                return -1;
            return 0;
    },

    _sortAutoPid: function(aa,bb) {
            if (aa.autoPid &&  !bb.autoPid)
                return 1;
            return 0;
    },

    _sortByDisplayIndex: function(aa,bb) {
            if (aa.displayIndex > bb.displayIndex)
                return 1;
            if (aa.displayIndex < bb.displayIndex)
                return -1;
            return 0;
    },

    _getOrderSummary: function() {
        ShoppingCartServiceWrapper.getCostSummary(function(response) {
            var orderSummary = {
                totalItems: this.totalItemsInCart,
                itemSubTotal: response.subtotal.amount,
                tax: this._getCartTax(response.taxes),
                shippingTotal: response.shippingTotal.amount,
                orderSpecialHandlingAmount: response.specialHandlingAmount.amount,
                giftWrapTotal: response.giftWrapCharges.total.amount,
                discountTotal: response.discountTotal.amount,
                total: response.total.amount,
                cartPromos: this._getCartPromos(response)
            }
            this.fire(':summaryUpdated', {response:response, orderSummary:orderSummary})
        }.bind(this))

    },

    _getCartTax: function(data){
        return {salesTax:data.salesTax.amount, shippingTax: data.shippingTax.amount, totalTax: data.total.amount};
    },

    _getCartPromos: function(data){
        return {giftWrap:data.giftWrapPromotionSummary, service:data.servicePromotionSummary, shippingPromo:data.shippingPromotionSummary, valuePromo: data.valuePromotionSummary};
    },

    // Cart Calls
    getCart: function(action){
        ShoppingCartServiceWrapper.getDWRCartSummary(function(response) {

            this.totalItemsInCart = response.numberOfItems;
            this._cartTotal = response.total;
            this._cartItems = Object.toArray(response.cartItems);
            this.fire(':cartResponse', {response:response.cartItems})

            if(this.totalItemsInCart == 0) {
                $(document.body).fire(':cartEmpty');
            }
	}.bind(this));

        return this;
    },

    _getCartItems: function(numItems){
        ShoppingCartServiceWrapper.getDisplayableItems(function(response) {
            Df.console.log(response)
            this._cartItems = Object.toArray(response)
            this.fire(':cartResponse', {response:response})
        }.bind(this))

        return this
    },

    _removeItem: function(e){
        var prod = this._cartProds[e.memo.uniqueLineId]
        ShoppingCartServiceWrapper.remove(prod.uniqueLineId, function(response){
            this.fire(':cartRequestComplete', {response: response})
        }.bind(this));
        this.pars.miniCart.fire('mc:fireAnalytics', {event:'removeItem', prod:prod})
    },

    _updateCartItem: function(e){
        this._setupCartActionObservers()
        var updateRequest = {uniqueCartItemId:e.memo.uniqueLineId, quantity:e.memo.quantity};
        ShoppingCartServiceWrapper.update(updateRequest, function(response) {
            this.fire(':cartRequestComplete', {response:response})
        }.bind(this))
    },

    _replaceCartItem: function(e){
       this._setupCartActionObservers()
       var editRequest = {productId:e.memo.productId, skuId:e.memo.skuId, quantity:e.memo.quantity, uniqueCartItemId:e.memo.uniqueLineId}; // bs - blackshirt
        ShoppingCartServiceWrapper.edit("EditStandardItem", editRequest, function(response) {
            this.fire(':cartRequestComplete', {response: response})
        }.bind(this))
    },

    _addToCart: function(e){
        this._setupCartActionObservers()
        var addRequest
        var requestType = "AddStandardItem"
        /*
         *	Valid Request Types:
         *	AddStandardItem
         *       AddGiftCertificate
         *       AddGiftCard
         */
        if(e.memo.requestType){
            requestType = e.memo.requestType
        }
        
        var cartAddSrc = "ES";
        if (e.memo.cartAddSrc) {
            cartAddSrc = e.memo.cartAddSrc;
        }

        e.memo.products.each(function(v){
            addRequest = {}
            for (i in v){
                addRequest[i] = v[i]
            }

            var tempCart = this.getCart();
            var analyticsEmptyCart = false;
            if(tempCart.totalItemsInCart == 0) {
            	analyticsEmptyCart = true;
            }
            ShoppingCartServiceWrapper.add(requestType, addRequest, function(response) {
              this.fire(':cartRequestComplete', {response: response})

              if(response[0].toString() == "OK"){
                  this.pars.miniCart.fire('mc:fireAnalytics', {event:'addItem', cartAddSrc: cartAddSrc, prod:v, analyticsEmptyCart:analyticsEmptyCart})
                  $(document.body).fire(':addToCartSuccess', {response:e.memo.response})
              }
            }.bind(this))
        }.bind(this))
    },

    createProductCacheManager: function(){
        return new Store.ProductCacheManager(this.pars.productService)
    }
})

Store.CrossSells = Class.create(Df.Base, {

    _setup:function($super){
        $super()

        this._crossSellData
        this.productCacheManager = this.createProductCacheManager()
        this.parser = new ZParse(Implementation);

        this.__processCrossSellResponse = this._processCrossSellResponse.bindAsEventListener(this)
        this.__renderXsell = this._renderXsell.bindAsEventListener(this)

        if(this.pars.type == 'categoryData'){
            this.__getCrossSells = this._getCategoryInfo.bindAsEventListener(this)
        }else{
            this.__getCrossSells = this._getCrossSells.bindAsEventListener(this)
        }

        this._listeners();
    },

    _initPars: function($super, pars){
        $super()
        this.setPars({
            type:'cart',  // cart, expressShop, parametric
                errorEvent: ':esCrossSellsError',
            completeEvent:':cartCrossSellsComplete',
            responseEvent:':cartCrossSellResponse',
            url:'/proxy/bbw/xsell/cart/product/',
            productDataUrl:'/proxy/bbw/catalog/',
            format:'xml',
            appId:Store.vars.appId,
            catId:'3361802',
            stoken:Store.vars.stoken,
            locale:Store.vars.locale,
            storeCode:Store.vars.storeCode,
            xsltUri:'xsl/allurent/crosssell.xsl',
            template:false,
                parentNode: $(document.body),
                renderToElement: false,
            crossSellClickEvent:':cartCrossSellClick'
        })
        this.setPars(pars)
    },

    _listeners: function(){
        this.observe(this.pars.responseEvent, this.__processCrossSellResponse)
        this.observe(':getCrossSells', this.__getCrossSells)

        this.productCacheManager.observe(':ItemSelection', function(e){
            if(this.pars.renderToElement){
                this.fire(':renderXsell', {data: e.memo.object})
            }else{
                $(document.body).fire(this.pars.completeEvent, {data: e.memo.object})
            }
        }.bind(this))

        if(this.pars.renderToElement)
            this.observe(':renderXsell', this.__renderXsell)

    },

    _getCrossSells: function(e){
        new Ajax.Request(this.pars.url, {
            method:'get',
            parameters: {
            format:this.pars.format,
            appId:this.pars.appId,
            catId:this.pars.catId,
            stoken:this.pars.stoken,
            locale:this.pars.locale,
            storeCode:this.pars.storeCode,
            xsltUri:this.pars.xsltUri,
            productId:e.memo.pids
            },
            onSuccess: function(response){
            this.fire(this.pars.responseEvent, {response:response.responseText})
            }.bind(this)
        })

    },

    _getCategoryInfo: function(e){
        new Ajax.Request(this.pars.url, {
            method:'get',
            parameters: {
            format:this.pars.format,
            appId:this.pars.appId,
            catId:this.pars.catId,
            stoken:this.pars.stoken,
            locale:this.pars.locale,
            storeCode:this.pars.storeCode,
            xsltUri:this.pars.xsltUri
            },
            onSuccess: function(response){
            this.fire(this.pars.responseEvent, {response:response.responseText})
            }.bind(this)
        })
    },

    _processCrossSellResponse: function(e){
        this._crossSellData = new Df.XMLDocument(e.memo.response)
        var xsellHash = []
        nodes = this._crossSellData.xpath('//ProductRoot')

        for (var i=0;i<nodes.length;){
            i++
            xsellHash.push(this._crossSellData.getNodeValue('//ProductRoot['+i+']/productId'))
        }

        if(this.pars.renderToElement){
            this.pars.parentNode.select(this.pars.renderToElement).each(function(v){
                    v.innerHTML = ''
            })
        }

        this.productCacheManager.get(xsellHash)
    },

    createProductCacheManager: function(){
        return new Store.ProductCacheManager({
            ajaxRequestOptions: {
            method: 'get',
            parameters: {
                format:'json',
                appId:this.pars.appId,
                catId:this.pars.catId,
                stoken:this.pars.stoken,
                locale:this.pars.locale,
                storeCode:this.pars.storeCode
            }
            },
            serviceBaseUrl: this.pars.productDataUrl,
            cacheInstance: $H(),
            uri: 'productId'
        })
    },

    _renderXsell: function(e){
        try{
            this.xsells = Object.toArray(e.memo.data)
            this.xsellsIds = []

            var basicData = []

            this.xsells.each(function(v){
                basicData.push({
                    imageSrc:v.getImages().getBy({view:'main', type:'T50'})[0].src,
                    title:v.pars.longTitle
                })

                this.xsellsIds.push(v.pars.productId)
            }.bind(this))

            this.pars.parentNode.select(this.pars.renderToElement).each(function(v){
                v.update(Store.TemplateProcessor.processTemplate(this.pars.template, {data:this.xsells, basicData:basicData}))

                v.childElements().each(function(vv, i){
                    vv.observe('click', function(e){
                            this.fire(this.pars.crossSellClickEvent, {pid:this.xsells[i].pars.productId, prod:this.xsells[i], xsells:this.xsellsIds})//xsells:this.xsellsIds.without(this.xsells[i].pars.productId)})
                    }.bind(this))
                }.bind(this))
            }.bind(this))

            this._fireCompleteEvent.defer(this.pars.completeEvent, e.memo.object)
        }catch(e){
                Df.console.log('error',e)
                $(document.body).fire(this.pars.errorEvent, {error: e})
        }
    },

    _fireCompleteEvent: function(e, o){
        $(document.body).fire(e, {data: o})
    }

})

Store.PromoEngine = Class.create(Df.Base, {
     _setup:function($super){
    $super()

    this.__handlePromoResponse = this._handlePromoResponse.bindAsEventListener(this)
    this.observe(this.pars.responseEvent, this.__handlePromoResponse)
        this.promos = []

    },

    _initPars: function($super, pars){
        $super()
        this.setPars({
            completevent:':cartPromoComplete',
            responseEvent:':cartPromoResponse',
            errorEvent: ':cartPromoError',
            basePromoUrl:'/promo/promotioninquiryservices/svc/promotionservices/1.0/promotions/for/products/',
            extendedPromoUrl:'/for/store/TSA?format=json', //to be overwritten
            productDataUrl:'/bbw/catalog/',
            xsltUri:'xsl/allurent/crosssell.xsl',
            responseHandler: this._handlePromoResponse,
            parentNode: $(document.body),
            renderToElement: false,
	    maxPromos: false
        })
        this.setPars(pars)
    },

    getPromosByProducts: function(pids){
        new Ajax.Request(this.pars.basePromoUrl+pids+this.pars.extendedPromoUrl, {
            method: 'get',
            onSuccess:function(response){
                this.fire(this.pars.responseEvent, {response:response})
            }.bind(this)
        });
    },

    _handlePromoResponse: function(e){
        //override this function if you want to use xml
        if(e.memo.response.responseJSON.PromotionServiceErrorResponse){
            this.fire(this.pars.errorEvent, {response:e.memo.response.responseJSON})
        }else{
            this.promos = e.memo.response.responseJSON.PromotionInquiryResponse.ItemPromotions.Promotions.Promotion

            if(this.pars.maxPromos && this.promos.length > this.pars.maxPromos){
                var p = []

                for(var i=0;i<this.pars.maxPromos;i++){
                    p.push(this.promos[i])
                }
                e.memo.response.responseJSON.PromotionInquiryResponse.ItemPromotions.Promotions.Promotion = p
                this.promos = p
            }

            if(this.pars.renderToElement){
                this._renderPromos.bind(this).defer()
            }else{
                this.fire(this.pars.completeEvent, {promos:e.memo.response.responseJSON})
            }
        }
    },

    _renderPromos: function(){
        this.pars.parentNode.select(this.pars.renderToElement).each(function(v){
            v.insert(Store.TemplateProcessor.processTemplate(this.pars.promoTemplate, {promos:this.promos}))
        }.bind(this))
    }
})

Store.TemplateProcessor = {

    parser: new ZParse(Implementation),

    processTemplate: function(template, data){
	var succ = Store.TemplateProcessor.parser.parse(template);
	if(succ){
	    return Store.TemplateProcessor.parser.process(data)
	}
	return false
    }
}

Store.bookmarkThis = function(title, url){
    if (window.sidebar) { // Mozilla Firefox Bookmark
        window.sidebar.addPanel(title, url,"");
    } else if( window.external ) { // IE Favorite
        window.external.AddFavorite( url, title);
    } else if(window.opera && window.print) { // Opera Hotlist
        return true;
    } else if (Prototype.Browser.WebKit) {
        alert("You need to press Command/Cmd + D to bookmark our site.");
    } else {
        alert("In order to bookmark this site you need to do so manually through your browser.");
    }
}
/**
 * Peacocks specific Express Shop and Mini Cart implementation
 * for product page. Used to override default SRM implementation.
 */

Event.observe(window, 'load', function(e){
    if ($(document.body).id === 'product') {
            
        // Check whether mini cart is enabled before adding implementation
        if (ess.configuration && ess.configuration.miniCartEnabled) {

            /**
             * PEAC Mini Cart implementation
             *
             * @requires Store.js
             * @requires Mini Cart includes
             * @requires Mini Cart templates
             */
            Store.miniCart = Class.create(Store.MC, {

                /*
                 * Initial setup operations
                 *
                 * @param $super Reference to inherited method
                 */
                _setup:function($super){
                    $super();
                },

                /*
                * Initialize parameters
                *
                * @param $super Reference to inherited method
                * @param parse Parameters in JSON format
                */
                _initPars: function($super, pars){
                    $super();

                    this.setPars({
                        templates:{
                            cartProduct: $('minicart-products-template').innerHTML,
                            cartSummary: $('minicart-summary-template').innerHTML,
                            confirmationView: $('minicart-confirmview-template').innerHTML,
                            confirmationSummary: $('minicart-summary-template').innerHTML,
                            microView: $('minicart-microview-template').innerHTML,
                            emptyCart: $('minicart-empty-template').innerHTML
                        },
                        elements:{
                            miniCart: '.mini-cart',
                            confirmationHolder: '.mini-cart-holder',
                            confirmationSummary:'.conf-summary',
                            cartSummary:'.mini-cart-holder',
                            products:'.mini-cart-holder',
                            emptyCart: '.cart-micro',
                            micro:'.cart-micro',
                            buttons:{
                                editProduct:'.mcEdit',
                                deleteProduct:'.mcDelete',
                                checkout:'.mcCheckout',
                                viewMainCart: '.mcViewCart',
                                close:'.mcClose',
                                continueShopping:'.mcContinueShopping'
                            }
                        },
                        crossSells:false,
                        confirmationCrossSells:false,
                        productService:{
                            ajaxRequestOptions: {
                                method: 'get',
                                parameters: {
                                    format:'json',
                                    appId:Store.vars.appId,
                                    catId:'3036542',
                                    stoken:Store.vars.stoken,
                                    locale:Store.vars.locale,
                                    storeCode:Store.vars.storeCode
                                }
                            },
                            serviceBaseUrl: Store.vars.productDataUrl,
                            cacheInstance: $H(),
                            uri: 'productId'
                        },
                        productLimit: false,
                        displayTimeOut: 30000,
                        displayOnAddToBag: true,
                        drag: false,
                        maxPromos: false
                    });

                    this.setPars(pars);
                },

                /*
                 * Additional tasks when showing confirmation
                 *
                 * @param $super Reference to inherited method
                 * @param e Event object
                 */
                _additionalConfirmationTasks: function($super, e){
                    return false;
               },

                /*
                * Show mini cart confirmation view
                *
                * @param $super Reference to inherited method
                * @param e Event object
                */
                showConfirmation: function($super, e){
                    $super(e);
                    try { $('ins1').show(); } catch(e) { /* swallow */ }
                    try { $('your-basket').addClassName('active'); } catch(e) { /* swallow */ }
                    try { $('minicart-close').addClassName('active'); } catch(e) { /* swallow */ }
                },

                /*
                * Close mini cart confirmation view
                *
                * @param $super Reference to inherited method
                */
                closeConfirmation: function($super){
                    try { $('ins1').hide(); } catch(e) { /* swallow */ }
                    try { $('your-basket').removeClassName('active'); } catch(e) { /* swallow */ }
                    try { $('minicart-close').removeClassName('active'); } catch(e) { /* swallow */ }
                }
            });

            /*
             * Initialize mini cart
             */
            ess.initMinicart = function() {
                // Add required elements
                window.mc = new Store.miniCart($('main-container').e('div', 'bottom', {id:'ins1'}).addClassName('mini-cart-holder').hide());
                var mcClose = $("main-container").e('div', 'bottom', {id:'minicart-close'});

                // Set event listener to close mini cart
                if (mcClose) {
                    mcClose.observe('click', function() {
                        mc.closeConfirmation();
                    });
                }

                // Set event listener to trigger mini cart
                if($('add-to-cart')){
                    $('add-to-cart').observe('click', function(e){
                        e.stop();
                        if(ess.validateProduct()){
                            $(document.body).fire(':addItemToCart', {cartAddSrc: "PD",
                                products: [{
                                    productId: $F('productId'),
                                    skuId: $F('skuId'),
                                    quantity: $F('quantity')
                                }]
                            });
                        }
                    });
                }
            }

            // Trigger Mini Cart initialization
            ess.initMinicart();
        }
    }
});

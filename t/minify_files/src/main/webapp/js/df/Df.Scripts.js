/*
 -ref		Df.Scripts
 -type		Class
 -extends   Df.Base
 -returns	Df.Scripts
 -note		Base class for dynamic script loading
 -example	<script type="text/javascript">
				var scriptLoader = new Df.Scripts()
				scriptLoader.loadScript("xxx",callback);
			</script>
*/
Df.Scripts = Class.create(Df.Base,{
	initialize:  function($super,element) {
		
		$super(element);
		this._scriptBuffer = [];
		
		},

	/*	
	 -ref		Df.Scripts.load
	 -type		Method
	 -note		used for Safari only
	*/
	load: function( url, successHandler, failHandler, noCache )
	{
		
		if( noCache == undefined ) noCache = true;

	
		failHandler = ( typeof failHandler == 'function' ) ? failHandler  : function( req )
		{
			var s = "failed to load script dependancy\n";
			if( arguments && arguments.callee && arguments.callee.scriptURL ) s += arguments.callee.scriptURL;
			throw( s );
		};

	
		failHandler.scriptURL = url;

	
		var request = new Ajax.Request( url + ( noCache ? "?ts=" + this.uId() : "" ), {
				method: "get",
				onSuccess: successHandler || function( url, request ) { this.parse( request.responseText, url ).bind( this, url ) },
				onFailure: failHandler
			});

		return request;
	},

	/*	
	 -ref		Df.Scripts.loadScript
	 -type		Method
	 -note		best method to use
	 -arg		src and callback method
	*/
	loadScript: function(src, callback)
	{
		
		if( typeof callback !== "function" ) callback = function(){};

		var node = document.createElement("script");

		if (node.addEventListener) {
			node.addEventListener("load", callback, false);
		}
		else {
			node.onreadystatechange = function() {
				if (this.readyState == "complete"||this.readyState=="loaded") callback.call(this);
			}
		}

		node.src = src;
		document.getElementsByTagName("head").item(0).appendChild(node);
		delete node;
		
	},
	/*	
	 -ref		Df.Scripts.Bufferload
	 -type		Method
	 -note		mamages script array
	*/
	Bufferload : function( callback, internal )
		{
		//	If there weren't any scripts to load, call the callback right away
			if( this._scriptBuffer.length == 0 ) { return callback(); }

		//	Get the next script
			

		//	Load the script
			for(var i=0;i<this._scriptBuffer.length;i++)
			{
				scriptURL = this._scriptBuffer[i];
				
			
				if( Prototype.Browser.Webkit)
				{
					if(i==this._scriptBuffer.length-1)
					{
					this.load( scriptURL, this.parseResult.bind(this,scriptURL,callback) );
					}
					else
					{
					this.load( scriptURL, this.parseResult.bind(this,scriptURL,null) );	
					}
				}
				else
				{
					if(i==this._scriptBuffer.length-1)
					{
						this.loadScript( scriptURL, callback  );
					}
					else
					{
						this.loadScript( scriptURL, null  );
					}
				}
			}
			return this;
		},
	/*	
	 -ref		Df.Scripts.parseResult
	 -type		Method
	 -note		used by Buffer Loader
	*/		
	parseResult : function( url, callback, request )
		{
			this.parse( request.responseText, url );
		//	load the next script
			this.Bufferload( callback, true );
		},
	/*	
	 -ref		Df.Scripts.loadThese
	 -type		Method
	 -note		used to load multiple scripts
	 -arg		url array and callback method
	*/
	loadThese: function( urls, callback )
	{
		
		var i,len,url;
		for( i=0,len=urls.length;i<len;i++ )
		{
			url = urls[i];
			this.addToBuffer( url );
			
		}
		
		this.Bufferload( callback );
		
		return;
	},
	
	checkScripts: function( a, val, asObj, strict )
	{
		for( var i=0,len=a.length; i<len; i++)
		{
			if( ( strict && a[i] === val ) || ( !strict && a[i] == val ) ) return asObj ? a[i] : i;
		}
		return asObj ? undefined : -1;  
	},
	
	addToBuffer : function( url )
		{
		//	Is the script in the local buffer?
			var u = this.checkScripts( this._scriptBuffer, url, true );
			return u === undefined ? this._scriptBuffer.push( url ) : u;
		},

 	/*	
	 -ref		Df.Scripts.parse
	 -type		Element
	 -arg		String text
	 -arg		String url
	 -note		Parse the script into a DOM script tag
	*/
	parse: function( text, url )
	{
		var script = this.find(url);

		if( script === undefined )
		{
			script = Df.e("script",{"id":this.createID(url),"type":"text/javascript","text":text});
			document.getElementsByTagName("head")[0].appendChild(script);
		}
		return script;
	},

 	/*	
	 ref		Df.Scripts.find
	 type		Element
	 arg		String text
	 returns	Object
	 note		Find a script within the DOM by URL
	*/
	find: function(url)
	{
	//	get an id from the URL of the script
		var scriptID = this.createID( url );

	//	Check to see if we can find the script with that ID
		var o = document.getElementById( scriptID );
		if( o != undefined ) return o;

	//	Otherwise look through the SCRIPT tags for src=attribute
		var els = document.getElementsByTagName("script");
		for( var i=0,len=els.length; i<len; i++ )
		{
			if( els[i].src == url )
			{
				return els[i];
			}
		}

		return undefined;
	},

	createID: function(url)
	{
		url = url.split("/").join(":");
		url = url.split(" ").join("-");

		return "SCRIPT-" + url;
	},
	
	uId: function(pre)
	{
		return ( pre || "" ) + "u" + new Date().getTime() + "-" + parseInt(10000*Math.random())
	}
});
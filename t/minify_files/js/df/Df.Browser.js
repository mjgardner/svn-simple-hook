Df._Browser = Class.create({

	initialize: function(){
		
		this.browserIdentities = [
			{
				string: navigator.userAgent,
				subString: "OmniWeb",
				versionSearch: "OmniWeb/",
				identity: "OmniWeb"
			},
			{
				string: navigator.vendor,
				subString: "Apple",
				identity: "Safari"
			},
			{
				prop: window.opera,
				identity: "Opera"
			},
			{
				string: navigator.vendor,
				subString: "iCab",
				identity: "iCab"
			},
			{
				string: navigator.vendor,
				subString: "KDE",
				identity: "Konqueror"
			},
			{
				string: navigator.userAgent,
				subString: "Firefox",
				identity: "Firefox"
			},
			{
				string: navigator.vendor,
				subString: "Camino",
				identity: "Camino"
			},
			{		// for newer Netscapes (6+)
				string: navigator.userAgent,
				subString: "Netscape",
				identity: "Netscape"
			},
			{
				string: navigator.userAgent,
				subString: "MSIE",
				identity: "IE",
				versionSearch: "MSIE"
			},
			{
				string: navigator.userAgent,
				subString: "Gecko",
				identity: "Mozilla",
				versionSearch: "rv"
			},
			{ 		// for older Netscapes (4-)
				string: navigator.userAgent,
				subString: "Mozilla",
				identity: "Netscape",
				versionSearch: "Mozilla"
			}
		];
		
	
		this.platformIdentities = [
			{
				string: navigator.platform,
				subString: "Win",
				identity: "Windows"
			},
			{
				string: navigator.platform,
				subString: "Mac",
				identity: "Mac"
			},
			{
				string: navigator.platform,
				subString: "Linux",
				identity: "Linux"
			}
		];
		
		/*
		 ref:		Df.Browser.browser
		 type:		Static Parameter
		 returns:	String
		 example: 	<script type="text/javascript">
					Df.Browser().version
				</script>
		*/
		this.browser = this._searchString(this.browserIdentities) || "unknown";
		
		/*
		 ref:		Df.Browser.version
		 type:		Static Parameter
		 returns:	String
		 example: 	<script type="text/javascript">
					Df.Browser().browser
				</script>
		*/
		this.version = this._searchVersion(navigator.userAgent)
			|| this._searchVersion(navigator.appVersion)
			|| "unknown";
		
		/*
		 ref:		Df.Browser.os
		 type:		Static Parameter
		 returns:	Number
		 example: 	<script type="text/javascript">
					Df.Browser().os
				</script>
		*/
		this.os = this._searchString(this.platformIdentities) || "an unknown OS";
		
	},
	
	/*
	 ref:		Df.Browser.is
	 type:		Static Method
	 returns:	Boolean
	 arg:		stats Hash {OS: String, version: Number, browser: String}
	 example: 	<script type="text/javascript">
				Df.Browser().is({os: 'Mac'})
			</script>
	*/
	is: function( hash ){
		return $H(hash).all(function(pair){
			return this[pair.key] == pair.value
		}.bind(this))
	},

	_searchString: function (data){
		for (var i=0;i<data.length;i++)	{
			var dataString = data[i].string;
			var dataProp = data[i].prop;
			this.versionSearchString = data[i].versionSearch || data[i].identity;
			if (dataString) {
				if (dataString.indexOf(data[i].subString) != -1)
					return data[i].identity;
			}
			else if (dataProp)
				return data[i].identity;
		}
	},

	_searchVersion: function (dataString){
		var index = dataString.indexOf(this.versionSearchString);
		if (index == -1) return;
		return parseFloat(dataString.substring(index+this.versionSearchString.length+1));
	}
});

/*
 ref:		Df.Browser
 type:		Static Class
 note:		Browser Detection
 returns:	Df.Browser
*/
Df.Browser = function(){
	if(Df.Browser._instanceOf){
		return Df.Browser._instanceOf
	}else{
		Df.Browser._instanceOf = new Df._Browser()
		return Df.Browser._instanceOf
	}
}
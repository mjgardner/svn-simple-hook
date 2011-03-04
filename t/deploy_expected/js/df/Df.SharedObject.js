// Shared Object Class
Df.SharedObject = Class.create(Df.Base,{
		 initialize: function(pars)
		 {
				 
			this.setPars({
						 callBack:false,
						 soInstanceName:"Df.sharedObject",
						 oName:"DO",
						 idName:"GSI",
						 author:"default"
						 });
			this.setPars(pars);	
			
		 },
		flashMovie: function(movieName) {
			 if (navigator.appName.indexOf("Microsoft") != -1) {
				 return window[movieName];
			 } else {
				 return document[movieName];
			 }
     	},
		
		populateSharedObject: function(data)
		{
			this.flashMovie("SO").addDataJS(data);	

		},
		flashMessage: function(d)
		{
			
				this.data = d;
				//this.pars.callBack.call(this);
			
			
		
		},
		
		showData: function()
		{
			
		 	this.flashMovie("SO").showData();
		
			//Df.console.log("Data exposed in DOM");
		
		},
		
		clearSO: function()
		{
			this.flashMovie("SO").clearSO();
			delete this.data;
			//Df.console.log("Shared Object Flushed");
		},
		
		createSO: function(oName,idName,author)
		{
			var fl = Df.e("div",{id:"flashcontent"});
			document.body.appendChild(fl);
			

			
			swf = new SWFObject("/js/API-1-4/flash/SO.swf", "SO", "1", "1", "9", "#ff0000");
			if(swf.installedVer.major == 0)
			{
				this.flashMessage({noFlash:true});
				return;
			}
			
			swf.addParam("allowScriptAccess", "sameDomain");
			swf.addVariable("oname",this.pars.oName);
			swf.addVariable("idname",this.pars.idName);
			swf.addVariable("author",this.pars.author);
			swf.addVariable("soInstance",this.pars.soInstanceName);
			swf.write("flashcontent");
			$("flashcontent").setStyle({"visibility":"hidden"});
			
				
		

		}
		
});


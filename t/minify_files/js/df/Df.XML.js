//XML XSL Javascript Transform Class for Multiple data and style sources
//Written By Bruce Hubbard for Citi Inc. Copyright 2007.


//Instantiate Class in page like this for each div:

//*note: for each div variable must have a unique name example:

//var myData = new loadData("pathToXML","pathToXSL","el");
//var myData2 = new loadData("pathToXML","pathToXSL","el");
Df.XML = Class.create(Df.Base,{
		 initialize: function(element,pars)
		 {
			 
			 this.setPars({
				
				pathToXML: false,
				pathToXSL: false,	
				passQueryParams: false,
				params:false,
				transform:false,
				el: element
				 
			 })
			 
			 this.setPars(pars);
			 
			 	if(!this.pars.params && !this.pars.passQueryParams)
				{
					this.createFragment();
					return;
				}
				if(this.pars.passQueryParams)
				{
					if(window.location.search.substring(1) !== '')
					{
						this.passQuery();
					}
					else
					{
						this.createFragment();
					}
					return;
				}
				else
				{	var getVars = this.pars.params.split("=");
					this.createFragment(getVars[0],getVars[1]);
					return;
				}
			 
		 },
		 createFragment: function(variableName,variableValue){
			 
			 	var nodeVar = [];
				var holderNode;
					
			if(document.implementation && document.implementation.createDocument){
				// Mozilla
		//netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead");
				if(this.pars.pathToXSL)
				{
				var xsltProcessor = new XSLTProcessor();
				
				// load the xslt file
				var myXMLHTTPRequest = new XMLHttpRequest();
				myXMLHTTPRequest.open("GET", this.pars.pathToXSL, false);
				myXMLHTTPRequest.send(null);
				
				// get the XML document
				xslStylesheet = myXMLHTTPRequest.responseXML;
				xsltProcessor.importStylesheet(xslStylesheet);
				}
				
				// load the xml file
				
				myXMLHTTPRequest = new XMLHttpRequest();
				myXMLHTTPRequest.open("GET",this.pars.pathToXML, false);
				myXMLHTTPRequest.send(null);
				
				var xmlSource = myXMLHTTPRequest.responseXML;
				
				
				
				
				if(typeof(variableName)!='undefined' && this.pars.transform)
				{
					//Insert params into XML DOM
					holderNode = xmlSource.documentElement;
					
					if(typeof(variableName)!=='string'){
						for(var r = 0; r < variableName.length; r++) {
							nodeVar[r] = holderNode.setAttribute(unescape(variableName[r]), unescape(variableValue[r]));
						}
					}
					else
					{
						holderNode.setAttribute(unescape(variableName), unescape(variableValue));
					}
				}
				
				if(!this.pars.transform)
				{
					
					
					this.document = (new DOMParser()).parseFromString(myXMLHTTPRequest.responseText, "text/xml");
					if(this.pars.passQueryParams)
					{
						
						if(typeof(variableName)!=='string'){
						   for(var r = 0; r < variableName.length; r++) {
							   
							   this.document.childNodes[0].setAttribute(unescape(variableName[r]), unescape(variableValue[r]))
						   }
						}
						else
						{
							this.document.childNodes[0].setAttribute(unescape(variableName), unescape(variableValue))
						}
						
					}
					return;
					
				
				
				}
				
				//transform
				if(!xsltProcessor)
				{
					console.error('There is no path to your XSL file.');
					return
				}
				var resultDocument = xsltProcessor.transformToFragment(xmlSource, document);
				$(this.pars.el).appendChild(resultDocument);
				
				
			}else if(window.ActiveXObject){
				// IE			
				var arrMSXMLProgIDs = ["MSXML4.DOMDocument", "MSXML3.DOMDocument", "MSXML2.DOMDocument", "MSXML.DOMDocument", "Microsoft.XmlDom"];

				var blnSuccess = false;
				  for (var i=0; i < arrMSXMLProgIDs.length && !blnSuccess; i++) {
					try {
					  var xml = new ActiveXObject(arrMSXMLProgIDs[i]);
					  
					  if(this.pars.pathToXSL)
					  var xsl = new ActiveXObject(arrMSXMLProgIDs[i]);
					  
					  strMSXMLProgID = arrMSXMLProgIDs[i];
					  blnSuccess = true;
					} catch (oException) {
					}
				  }
				  if (!blnSuccess ){
					blnFailed = true;
					strFailedReason = "No suitable MSXML library on machine.";
				  }
				  
				  
				// Load XML
				xml.async = false
				xml.load(this.pars.pathToXML);

				
				if(this.pars.pathToXSL)
				{
				// Load XSL For Header and Menu's
				xsl.async = false
				xsl.load(this.pars.pathToXSL)
				}
			
				
				
				if(typeof(variableName)!='undefined')
				{
					//Insert params into XML DOM
					holderNode = xml.documentElement;
					
					if(typeof(variableName)!=='string'){
						for(var r = 0; r < variableName.length; r++) {
							nodeVar[r] = holderNode.setAttribute(unescape(variableName[r]), unescape(variableValue[r]));
						}	
					}
					else
					{
						holderNode.setAttribute(unescape(variableName), unescape(variableValue));
					}
				}
						
				
				if(!this.pars.transform)
				{
					var xmlString = xml.xml.toString()
					xml.loadXML(xmlString);
					this.document = xml;
					
					if(this.pars.passQueryParams)
					{
						if(typeof(variableName)!=='string'){
						   for(var r = 0; r < variableName.length; r++) {
							   
							   this.document.childNodes[1].setAttribute(unescape(variableName[r]), unescape(variableValue[r]))
						   }
						}
						else
						{
							this.document.childNodes[1].setAttribute(unescape(variableName), unescape(variableValue))
						}
						
					}

					
					return;
				
				
				}
				// Transform
				if(!xsl)
				{
					if(console)
					{
						console.error('There is no path to your xsl file');
					}
					else
					{
						alert('There is no path to your xsl file');
					}
					return;
				}
				$(this.pars.el).innerHTML=xml.transformNode(xsl);
				
				
			}else{
				// Browser unknown
				alert("Browser unknown");
			}
			
		
		},

		getQueryVariables: function () {
			var query = window.location.search.substring(1);
			var vars = query.split("&");
			for (var i=0;i<vars.length;i++) {
				var pair = vars[i].split("=");
		
					return pair,vars;
			}
	
		},

		passQuery: function () {
			var passingVarValue = [];
			var passingVar = [];
			var getUsersVars = this.getQueryVariables();
			for (var i = 0; i < getUsersVars.length; i++)
			{
				var getVar = getUsersVars[i].split("=");
				if(this.pars.passQueryParams === getVar[0])
				{
					this.createFragment(getVar[0], getVar[1]);
					return;
				}
				passingVar[i] = getVar[0];
				passingVarValue[i] = getVar[1];
			}
			
			this.createFragment(passingVar, passingVarValue);
	
		},
		xpath: function(exp){
			//Example returns the same in all browsers
			//myXML.xpath('//meeting[1]/title')[0].firstChild.nodeValue
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
});
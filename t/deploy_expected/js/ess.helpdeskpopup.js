//updates links in helpdesk popup to not load entire helpdesk landing page in popup.
Event.observe(window,'load',function(){
	if(document.links)
	{
		for(i=0;i<document.links.length;i++)
		{	
			if(document.links[i].href.match("/helpdesk/index.jsp")!=null)
			{
				document.links[i].href = document.links[i].href.replace("/helpdesk/index.jsp", "/helpdesk/popup.jsp");
			}else if(document.links[i].href.match("javascript:")==null)
			{
				document.links[i].href= "javascript:opener.location='"+document.links[i].href+"';self.close();";
			}
		}
	}
},false)



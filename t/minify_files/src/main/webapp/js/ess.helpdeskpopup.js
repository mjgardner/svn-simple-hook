/* updates links in helpdesk popup to not load entire helpdesk landing page in popup */
Event.observe(window,'load',function()
{
    if (document.links)
    {
        for (var i=0; i < document.links.length; i++)
        {
            var currentLink = document.links[i].href;
            /* alert('currentLink = ' + currentLink); */
            
            if (currentLink.indexOf('/helpdesk/index.jsp?display=store&subdisplay=contact') >= 0
                || currentLink.indexOf('/helpdesk/contactCSR/index.jsp?display=store&subdisplay=contact') >= 0)
            {
                document.links[i].href = "javascript:opener.location='"+document.links[i].href+"';self.close();";
                /* alert('document.links['+i+'].href = ' + document.links[i].href); */
            }
            else if (currentLink.indexOf("/helpdesk/index.jsp") >= 0)
            {
                document.links[i].href = currentLink.replace("/helpdesk/index.jsp", "/helpdesk/popup.jsp");
                /* alert('document.links['+i+'].href = ' + document.links[i].href); */
            }
            else
            {
                document.links[i].href = "javascript:opener.location='"+document.links[i].href+"';self.close();";
                /* alert('document.links['+i+'].href = ' + document.links[i].href); */
            }
        }
    }
},false)



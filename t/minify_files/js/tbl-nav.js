// show/hide navigation for the logo nav.

Event.observe(window,'load',function(e) {
    var isIE = new RegExp('MSIE (\\d+\\.\\d+);').test(navigator.userAgent); //tests if browser is IE	
    var ieversion = null;
    var isOpen = null;

    if (isIE) {
        ieversion=new Number(RegExp.$1); //check for the version number.
    }

    function addCloseListener() {
        $(document.body).observe('click', closeWindow);
    }

    function noObserve(){
        $(document.body).stopObserving('click', closeWindow); 
        isOpen = false;
    }

    function linkCheck() {
        var pBlk = this.up(2).readAttribute('class');	
        if (pBlk == 'global-dropdown') {
            closeWindow();
            noObserve();
        }
    }

    function closeWindow(e) {
        if (isOpen == true) {
            $('global-dropdown').hide();
			if($('logohover')){
            $('logohover').setAttribute("id", "logo");
			}
            $(document.body).stopObserving('click', closeWindow);
            isOpen = false;
        }
    }

    function toggleDropdown(e) {
        if(isOpen == false) {
            $('global-dropdown').show();
			if($('logo')){
            $('logo').setAttribute("id", "logohover");
			}
			if($('global-dropdown').visible() == true) {
                isOpen = true;
                if(isIE && ieversion<6) {
                } else {
                    addCloseListener.delay(0.1);
                }
            }
        }else if(isOpen == true) {
            closeWindow();
        }
    }

    if($('global-dropdown')) {
        $('global-dropdown').select('a').each(function(lnk) {
            lnk.onclick = function (){
                closeWindow();
                noObserve();
            }
        });
        //gets rid of the hide class, which interferes with prototype's show/hide.
        $('global-dropdown').removeClassName('hide');
        $('global-dropdown').hide();
        isOpen = false;
        $('logo').onclick = function() {
            toggleDropdown();
        }

        $('globalmenudrop').onmouseover = function() {
			if($('logo')){
            $('logo').setAttribute("id", "logohover");
			}
            toggleDropdown();
        }

		$('globalmenudrop').onmouseout = function() {
            $('global-dropdown').hide();
			if($('logohover')){
				$('logohover').setAttribute("id", "logo");
			}
			 closeWindow();
        }
    }
	if ($('shop-nav')){
		if($('parametric-filter')){
			$$('li.lvl2').each(function(sw){
				sw.observe('mouseover', function(){
					$('parametric-filter').select('select').each(function(el){el.setStyle({display:"none"})});					
				});
				sw.observe('mouseout', function(){
					$('parametric-filter').select('select').each(function(el){el.setStyle({display:""})});					
				});
			});
		}
	}
});
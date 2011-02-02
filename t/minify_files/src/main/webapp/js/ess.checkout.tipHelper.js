document.observe("dom:loaded", function(e) {
    $A($$('a.tooltip')).each(function(v){
		var info = null;
        if ($(v).up().next() && $(v).up().next().className == 'tooltip') {
            info = $(v).up().next();
        }else if ($(v).next() && $(v).next().className == 'tooltip') {
            info = $(v).next();
        }
		var tipPars = {
			data:info,
			eventType: 'click',
			treatAsMenu: true,
			xOffset: 5,
			yOffset: -3,
			yOffsetPointer: -1,
			xOffsetPointer: -32,
			pointerOrientation: 'top',
			xOrientation: 'right',
			yOrientation: 'top',
			toggleShowDelay: 0,
			toggleHideDelay: 0,
			animate: {
					opacity:.9,
					time: 200,
					pause: 20
			}
		};
		var ins = new Df.Tip(v, tipPars);
		
		if(info!=null) {
			info.select('a.close').each(function(node){
				node.observe('click', function(e){
					ins.togglePane.hide();
				});
			});
		}
//		v.tip(tipPars);
    });
});
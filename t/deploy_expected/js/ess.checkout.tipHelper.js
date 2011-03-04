document.observe('dom:loaded',function(e){

	$A($$('span.tooltip')).each(function(f){
		f.removeClassName("hide");
	}); 

	$A($$('a.close-tip')).each(function(f){
			f.writeAttribute("onclick", "return false");
	}); 
	
	$A($$('a.tooltip')).each(function(v){
		v.writeAttribute("href", "Javascript:void(0);");
		v.writeAttribute("onclick", "return false");
		var info=null;
		if($(v).up().next()&&$(v).up().next().className=='tooltip')info=$(v).up().next();
		else if($(v).next()&&$(v).next().className=='tooltip')info=$(v).next();
		var tipPars={
			data:info,
			eventType:'click',
			treatAsMenu:false,
			sensitive:true,
			xOffset:5,
			yOffset:-3,
			yOffsetPointer:-1,
			xOffsetPointer:-32,
			pointerOrientation:'top',
			xOrientation:'right',
			yOrientation:'top',
			toggleShowDelay:0,
			toggleHideDelay:0,
			animate:{
					opacity:.9,
					time:500,
					pause:20
			}
		};
		if(info!=null){
			var ins=new Df.Tip(v,tipPars);
			info.select('a.close-tip').each(function(n){
				n.observe('click',function(e){
					this.up(2).hide();
					ins.togglePane.hide();
				});
			});
		}
	});


});


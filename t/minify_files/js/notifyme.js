if('object'==typeof(Prototype)){
NotifyMe=Class.create({
	initialize:function(p){
		this.setColors();
	},
	
	setColors:function(){
		if('object'!=typeof(nmwa))return false;
		var swatches=$('nmwaProductSwatches');
		var sizes=$('nmwaProductSizes');
		sizes.observe('change',function(e){this.sizeChange();}.bind(this));
		var c=0;
		nmwa.colors.each(function(col){
			swatches.appendChild(
							new Element('li',{id:col.id}).update(
							new Element('a',{href:'#',className:'swatch',id:'swatch_'+col.id}).update(
							new Element('img',{src:col.image,alt:col.title,title:col.title})
							)));
			$('swatch_'+col.id).observe('click',function(e){e.stop();this.colorChange(col.id);}.bind(this));
			if(c==0){
				$(col.id).addClassName('active');
				col.skus.each(function(size){sizes.appendChild(new Element('option',{value:size.skuId,id:size.skuId}).update(size.name));});
			}
			c++;
		}.bind(this));
		this.preset();
		this.sizeChange();
		this.policy();
		
	},
	
	preset:function(){
		var skuId=$('skuId');
		if(!skuId)return false;
		var sku=skuId.value;
		if(''==sku)return false;
		var ccol='';
		var acol='';
		nmwa.colors.each(function(col){
			ccol=col.id;
			col.skus.each(function(sk){
				if(sku==sk.skuId){
					acol=ccol;throw $break;
				}
			});
		});
		
		$('nmwaProductSwatches').select('li').each(function(sw){
			sw.removeClassName('active');
			if(sw.id==acol)sw.addClassName('active');
		});
		this.colorChange(acol);
		
		$('nmwaProductSizes').select('option').each(function(sz){
			sz.selected=false;
			if(sz.value==sku){sz.selected=true;}
		});
		
	},
	
	colorChange:function(id){
		var swatches=$('nmwaProductSwatches');
		var sizes=$('nmwaProductSizes');
		swatches.select('li').each(function(sw){
			sw.removeClassName('active');
			if(sw.id==id)sw.addClassName('active');
		});
		
		sizes.innerHTML='';
		nmwa.colors.each(function(col){
			if(col.id==id)col.skus.each(function(size){sizes.appendChild(new Element('option',{value:size.skuId,id:size.skuId}).update(size.name));});
		});
		this.sizeChange();
	},
	
	sizeChange:function(){
		var val=$F('nmwaProductSizes');
		$('skuId').value=val;
		var colTitle=$('nmwaProductSwatches').select('li.active a img')[0].title;
		var sizeTitle=$(val).innerHTML;
		$('selectedColor').innerHTML=colTitle;
		$('selectedColorMain').innerHTML=colTitle;
		$('selectedSizeMain').innerHTML=sizeTitle;
	},
	
	policy:function(){
		var p=$('policy');
		if(!p)return false;
		Event.observe(p,'click',function(e){
			e.stop();
			var dim={width:800,height:600};
			var pos={left:((screen.width-dim.width)/2),top:((screen.height-dim.height)/2)};
			window.open(p.href, 'policy', 'width='+dim.width+',height='+dim.height+',left='+pos.left+',top='+pos.top+',toolbar=no,status=no,menubar=no,scrollbars=yes,resizable=no');
		});
	}
});
}



else{throw "ess.NotifyMe.js requires prototype.js and ess.js to be loaded.";}

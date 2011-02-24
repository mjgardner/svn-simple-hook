if('object'!=typeof(ess))var ess={};

ess.addToCartBtnId="add-to-cart";

ess.validateProduct=function(){
	var isCartable=true;
	
	if ($("colorContainer")) var colorContainer=$("colorContainer");
	var sizeQuantity=$("size-quantity");

	var sqErrors=$$('.formbuttons')[0].select(".error");
	if ($("colorContainer")) var cErrors=colorContainer.select(".error");
	
	if ($("colorContainer")) var errorArray=[cErrors, sqErrors]; else var errorArray=[sqErrors];

	// clear errors
	errorArray.each(function(er){er.each(function(e){e.remove()})});

	// check color
	if ($("colorContainer")){
		if(ess.product.currentView.colorId==''&&ess.betterproductJSON.colorSliceValues.length!=0){
			colorContainer.insert({bottom:new Element('p',{className:'error'}).update(ess.messages.validateColor)});
			isCartable=false;
		}
	}

	// check size
	if(ess.product.skuId==''){
		sizeContainer.insert({bottom:new Element('p',{className:'error'}).update(ess.messages.validateSize)});
		isCartable=false;
	}else{
		var skuId=$('skuId');		
		if(!skuId)$('options').insert({bottom:new Element('input',{id:'skuId',name:'skuId',type:'hidden',value:ess.product.skuId})});
		else skuId.value=ess.product.skuId;
	}
	var size=$('size');
	if(size){
	    if(0==size.value){
			$(ess.addToCartBtnId).insert({after:new Element('p',{className:'error'}).update(ess.messages.validateSize)});
			isCartable=false;
			if(Prototype.Browser.IE){
				var sizeDims=size.getDimensions();
				size.setStyle({position:"absolute",top:"-2px",left:"-2px",width:sizeDims.width+"px"});
				var sizeContainer=$('size-container');
				if(sizeContainer)sizeContainer.setStyle({position:"relative",overflow:"hidden",border:"1px solid #CC0000",width:(sizeDims.width-4)+"px",height:"18px"});
			}else{
				size.setStyle({border:'1px solid #CC0000'});
			}		
	    }
	}
	
	// check quantity
	var qty=$('quantity');
	if(qty){
		if(qty.present()){
			var qVal=qty.getValue();
			if(isNaN(qVal) || parseInt(qVal)<1){
				sizeQuantity.insert({bottom:new Element('p',{className:'error'}).update(ess.messages.validateQuantity)});
				isCartable=false;
			}
		} else{
			sizeQuantity.insert({bottom:new Element('p',{className:'error'}).update(ess.messages.validateQuantity)});
			isCartable=false;
		}
	}
	return isCartable;
}

//:: QC#98248 new Timberland requirement :: each color should have the same current & base prices
ess.setPrice=function(price){
	//:: Clear sale price
	var salePrice=$$('#money .amount');
	if('undefined'!=typeof(salePrice[0]))salePrice[0].remove();
	if(price.base==price.current){
		//::Regular price
		$$('#money .wasprice')[0].innerHTML=price.current;
	}else if(price.base>price.current){
		//:: Sale price
		$$('#money .wasprice')[0].innerHTML='Was '+price.base;
		$('money').insert({bottom:new Element('span',{className:'amount'}).update('Now '+price.current)});
	}
};

ess.checkPriceChangeByColor=function(colorId){
	if(ess.betterproductJSON.skus.length){
		var price={};
		ess.betterproductJSON.skus.each(function(el){
			if('IN_STOCK'==el.avail&&el.colorId==colorId){
				price={base:el.price.base,current:el.price.current};
				throw $break;
			}
		});
	}
	ess.setPrice(price);
};

ess.checkPriceChangeBySku=function(skuId){
	
	if(ess.betterproductJSON.skus.length){
		var price={};
		ess.betterproductJSON.skus.each(function(el){
			if('IN_STOCK'==el.avail&&el.sku_id==skuId){
				price={base:el.price.base,current:el.price.current};
				throw $break;
			}
		});
	}
	ess.setPrice(price);
};

ess.generateSaleSwatchWrapper=function(id,color){
	var saleSwatchWrapper=$('saleSwatchWrapper');
	if(!saleSwatchWrapper){
		saleSwatchWrapper=new Element('div',{id:'saleSwatchWrapper'});
		saleSwatchWrapper.insert({after:$('mainProductSwatches')});
	}
	var saleSwatches=new Element('div',{id:'saleSwatches_'+id,className:'saleSwatches'});
	saleSwatchWrapper.insert({bottom:saleSwatches});
	var salePrice=new Element('div',{id:'salePrice_'+id,className:'salePrice'}).update(new Element('p').update('Sale'));
	saleSwatches.insert({bottom:salePrice});
	salePrice.insert({bottom:new Element('p',{id:'skuSalePrice_'+id,className:'skuSalePrice'}).update(color.price.current)});
	var swatchLi=new Element('li',{id:'swatch_'+color.colorId}).update(new Element('a',{href:'#',title:color.title,id:'color-'+ess.betterproductJSON.productId+'-'+color.colorId}).update(new Element('img',{src:color.image,alt:color.title})));
	var swatches=new Element('ul',{id:'swatchUl_'+id,className:'swatches'}).update(swatchLi);
	saleSwatches.insert({bottom:swatches});
};

ess.maskSaleColors=function(){
	if(!ess.betterproductJSON.skus.length)return false;
	
	//:: get all available unique color ids
	var colorIds=[];
	ess.betterproductJSON.skus.each(function(el){
		if('IN_STOCK'==el.avail)colorIds.push(el.colorId);
	});
	colorIds=colorIds.uniq();
	
	//:: get sale colors
	var saleColors=[];
	if(colorIds.length){
		colorIds.each(function(id){
			ess.betterproductJSON.skus.each(function(el){
				if(el.colorId==id){
				if(el.price.base>el.price.current)saleColors.push({colorId:id,price:{base:el.price.base,current:el.price.current}});
				throw $break;
				}
			});
		});
	}
	//:: if all available colors are on sale then we will not generate color sale blocks
	if(saleColors.length==colorIds.length)return false;
	
	saleColors.each(function(color,id){
		var swatch=$('color-'+ess.betterproductJSON.productId+'-'+color.colorId);
		if(swatch){
			var image=swatch.select('img')[0];
			ess.generateSaleSwatchWrapper(id,{colorId:color.colorId,title:swatch.readAttribute('title'),image:image.readAttribute('src'),price:color.price});
			swatch.remove();
		}
	});
};

Event.observe(document,'dom:loaded',function(e){
	// Create instance of Product
 	ess.product=new ess.Product(ess.productJSON);
 	
	ess.maskSaleColors();
	
	// Color Swatches
	if($('mainProductSwatches')){
		$$('#mainProductSwatches li,#saleSwatchWrapper li').each(function(sw){
			sw.colorId=(sw.id).substring((sw.id).lastIndexOf('_')+1);
			sw.observe('click',function(e){e.stop();ess.product.changeColor(this.colorId); ess.checkPriceChangeByColor(this.colorId);});
			sw.observeProductColorChange=function(product){this.className=this.colorId==product.colorId?'active':'';};
			ess.product.addColorChangeListener(sw);
		});
	}
	
	// Alternate Views
	if($('alternate-images')){
		var ai=$('alternate-images');
		var i=0;
		ai.select('li').each(function(a){Event.observe(a.select('a')[0],'click',function(e){e.stop();ess.product.changeView('+i+');});});
		i=0;
		ai.observeProductColorChange=function(product){
			ai.update(
				new Element('li',{id:'more0'}).update(
				new Element('a',{href:'Javascript:ess.product.changeView(0);'}).update(
				new Element('img',{src:product.getCurrentColorSliceValue().thumbnailImageURL,alt:'Alternate product view'}))));
			i=1;
			product.getCurrentColorSliceValue().alternateViews.each(function(el){
				ai.insert({bottom:
					new Element('li',{id:'more'+i}).update(
					new Element('a',{href:'Javascript:ess.product.changeView('+i+');'}).update(
					new Element('img',{src:el.thumbnailImageURL,alt:'Alternate product view'})))
				});
				i++;
			});
			if('object'==typeof(ess.productJSON.alternateViews)){
			ess.productJSON.alternateViews.each(function(av){
					av.otherImages.each(function(v){
						if('FLASH'==v.type){
							ai.insert({bottom:
								new Element('li',{id:'more'+i}).update(
								new Element('a',{href:"Javascript:video.open('"+v.url+"');"}).update(
								new Element('img',{src:'/images/product-video.png',alt:'Video'})))
								});
							i++;
						}
					});
				});
			}
		};
		ess.product.addColorChangeListener(ai);
	}

	// Embedded Zoom
	if('function'==typeof(Df.Zoom)&&$('click-to-zoom')){
		var zoom=new Df.Zoom('product-image-main',{image:ess.product.getCurrentView().p.zoomImageURL,dims:{width:720,height:455},steps:3,stepStart:2, handlers:['click-to-zoom'],
		zoomedEl:false,
		deadZone:'product-image-main-zoom-controls',
		controls:{reset:'product-image-main-zoomReset',zoomIn:'product-image-main-zoomIn',zoomOut:'product-image-main-zoomOut'},
		onOpen:function(obj){
			var container=new Element('div',{id:'product-image-main-zoom-controls'});
			obj.element.insert({bottom:container});
			container.insert({bottom:new Element('a',{href:'#',id:'product-image-main-zoomIn'}).update(new Element('span').update(ess.productJSON.lang.controlsZoomIn))});
			container.insert({bottom:new Element('span').update(ess.productJSON.lang.zoomControls)});
			container.insert({bottom:new Element('a',{href:'#',id:'product-image-main-zoomOut'}).update(new Element('span').update(ess.productJSON.lang.controlsZoomOut))});
			container.insert({bottom:new Element('button',{id:'product-image-main-zoomReset',className:'button bl2'}).update(ess.productJSON.lang.controlsReset)});
			if(Prototype.Browser.ie6){var options=$('options');if(options)options.hide();}
			$$('#sidebar .pagination')[0].hide();
		},
		onClose:function(obj){
			var controls=$('product-image-main-zoom-controls');
			if(controls)controls.remove();
			if(Prototype.Browser.ie6){var options=$('options');if(options)options.show();}
			$$('#sidebar .pagination')[0].show();
		}
		});
	}

	// Main Product Image
	var mainProductImage=$('product-image-main');
	if(mainProductImage){
		mainProductImage.observeProductViewChange=function(product){
			var loaderId='product-image-flip-loader';
			var currentView=product.getCurrentView();
			if(!$(loaderId))this.insert({after:new Element('div',{id:'product-image-flip-loader',className:'loader'})});
			var loader=$(loaderId);
			loader.setStyle({opacity:.5,left:((parseInt(this.getStyle('width'))/2)-(parseInt(loader.getStyle('width'))/2))+'px',top:((parseInt(this.getStyle('height'))/2)-(parseInt(loader.getStyle('height'))/2))+'px'});
			loader.show();
			if(mainProductImage.readAttribute("src")==currentView.mainImageURL){
				if(loader)loader.hide();
			} else if (currentView!=null&& currentView!=currentView.mainImageURL && currentView.mainImageURL!=''){
				var zoomImg=currentView.zoomImageURL;
				this.setStyle({opacity:.3});
				this.observe('load',function(e){
					if(loader)loader.hide();
					if('function'==typeof(Df.Animate))new Df.Animate(this).setPars({time:300}).run({opacity:1});else this.setStyle({opacity:1});
				}).writeAttribute('src',currentView.mainImageURL);
			}else{
				var zoomImg=product.p.zoomImageURL;
				this.observe('load',function(e){
				if(loader)loader.hide();
				}).writeAttribute('src',product.p.mainImageURL);
			}
			if('object'==typeof(zoom))zoom.flip({base:this.src,zoom:zoomImg});
			//if('object'==typeof(video))video.close();
		};
				if('function'==typeof(Df.Animate))new Df.Animate(mainProductImage).setPars({time:300}).run({opacity:1});else mainProductImage.setStyle({opacity:1});
		ess.product.addViewChangeListener(mainProductImage);

	}
	var availMsg=$('availability-msg');
	if(availMsg){
		availMsg.observeProductSkuChange=function(product){
			var prodStock=product.getSkuById(product.skuId); 
			if(prodStock){
			var checkForInStockSku = false;
			for(var pr = 0; pr < product.p.skus.length; pr++){
				if(product.p.skus[pr].color){
					switch(product.p.skus[pr].avail){
						case "IN_STOCK":
							if(product.p.skus[pr].color == prodStock.color){
								this.innerHTML=product.p.skus[pr].availShipEstMessage;
								checkForInStockSku = true;
								if($(ess.addToCartBtnId))ess.product.flipButton({id:ess.addToCartBtnId,action:'enable',aClass:'add-to-cart',dClass:'out-of-stock'});
							}
							break;
						case "NOT_AVAILABLE":
							if(product.p.skus[pr].color == prodStock.color){
								this.innerHTML=product.p.skus[pr].availShipEstMessage;
							}
					}
					if(checkForInStockSku == true){
						break;
					}
				};
			};
            if('IN_STOCK'==prodStock.avail){
            	if($(ess.addToCartBtnId))ess.product.flipButton({id:ess.addToCartBtnId,action:'enable',aClass:'add-to-cart',dClass:'out-of-stock'});
            }
			};
        };
		ess.product.addSkuChangeListener(availMsg);
	}
	// HTML size drop down
	var s=$('size');
	if(s){
		s.observe('change',function(e){
			var formbuttons=$$('.formbuttons')[0];
			if(formbuttons)formbuttons.select('.error').each(function(el){el.remove();}); // clear errors
			if(Prototype.Browser.IE){
				var sizeDims=s.getDimensions();
				s.setStyle({top:"-2px",left:"-2px",width:sizeDims.width+"px"});
				var sizeContainer=$('size-container');
				if(sizeContainer)sizeContainer.setStyle({border:"1px solid #999999",width:(sizeDims.width-3)+"px",height:"18px"});
			}else{
				s.setStyle({border:'1px solid #999999'});
			}
			//checks the selected sku against the sale prices, and updates to a sale price if needed
			var skuId=this.value.split('|')[1];
			if(skuId!=0){
				ess.checkPriceChangeBySku(skuId);
				ess.product.changeSku(skuId);
			}
		
		});
		s.observeProductColorChange=function(product){
			var currentColorSlice=product.getCurrentColorSliceValue();
			//if there's only one size, show this non-dropdown form element.
			if(currentColorSlice.availableSkuIds.length < 2){
			    if($('sizeLabel')){
				$('sizeLabel').remove();
				$$('input#size')[0].remove();
			    }
			    var nonFormVal = ess.product.p.productId+"|"+currentColorSlice.availableSkuIds[0];
			    var nonFormEl = new Element ('input', {'value': nonFormVal, 'type': 'hidden', 'id': 'size', 'name': 'prod_0'});

			    $('sizeContainer').insert({top: nonFormEl});

			    for(var i = 0; i < ess.product.p.skus.length; i++){
				if(ess.product.p.skus[i].sku_id == currentColorSlice.availableSkuIds[0]){
				    $('sizeContainer').insert(new Element('span', {'id': 'sizeLabel'}).update(ess.product.p.skus[i].size));
				    if(ess.product.p.skus[i].avail == "NOT_AVAILABLE"){
						ess.product.flipButton({id:ess.addToCartBtnId,action:'disable',aClass:'add-to-cart',dClass:'out-of-stock'});
				    } 
				}

			    };
			    s.setStyle({'display': 'none'});
			    s.setAttribute('disabled', 'true');
			}else{
			//and if a color fired the if above, bring the form back
			    if($('sizeLabel')){
				var formSizeMenu = getSizeForm('select', 'size');
				//IE does not seem to like Prototype's object arrays. so the above is a little function to find the right object with the ID "size"
				formSizeMenu.setStyle({'display': 'block'});
				formSizeMenu.disabled = false;
				$('sizeLabel').remove();
				$$('input#size')[0].remove();
				s = formSizeMenu;
			    }
			//otherwise, build the dropdown
			
			s.update(new Element('option',{value:0}).update('Select Size'));
			currentColorSlice.availableSkuIds.each(function(el){
				//fills the option form with the skus (sizes)
				var sku=product.getSkuById(el);
				var prodStock=sku.avail;
				if('IN_STOCK'==prodStock)s.appendChild(new Element('option',{value:product.p.productId+'|'+sku.sku_id}).update(sku.size));
			});
			
			if($(ess.addToCartBtnId)){
				if($$('#size option').length <= 1){
					ess.product.flipButton({id:ess.addToCartBtnId,action:'disable',aClass:'add-to-cart',dClass:'out-of-stock'});
				};
			};
			};
		};
		ess.product.addColorChangeListener(s);
		s.observeProductSkuChange=function(product){
			this.value=product.p.productId+'|'+product.skuId;	
		};
		ess.product.addSkuChangeListener(s);
		
		//function to find an element by it's ID and NodeName. Workaround for IE not liking Prototype.
		function getSizeForm(targetNode, targetId){
		    var getNode = document.getElementsByTagName(targetNode);
		    for(var i = 0; i < getNode.length; i++){
			if(getNode[i].id == targetId ){
			    return getNode[i];
			    break;
			}
		    };
		};
	}
	
	//get c from the url and put it in colorId 
  	var colorId=window.location.search.toQueryParams().c;
  	if(colorId&&0<colorId){
  		ess.product.changeColor(colorId);
  		ess.checkPriceChangeByColor(colorId);
	}else if(0<ess.product.p.colorSliceValues.length){
		var swatchListItem=$$('#mainProductSwatches li:first')[0];
		if('undefined'!=typeof(swatchListItem)){
			colorId=swatchListItem.readAttribute('id').split('swatch_')[1];
			ess.product.changeColor(colorId);
  			ess.checkPriceChangeByColor(colorId);
		}
	}else{
		var saleSwatch=$$('.saleSwatches .swatches li:first')[0];
		if('undefined'!=typeof(saleSwatch)){
			colorId=saleSwatch.readAttribute('id').split('swatch_')[1];
			ess.product.changeColor(colorId);
  			ess.checkPriceChangeByColor(colorId);
  		}
	}
	
	if($("options")){$("options").onsubmit=function(e){return ess.validateProduct();};}
	//Added for QuickAdd analytics functionality.
	var quickadd=$$('#quick-add .button');
	if(quickadd.length > 0){
		quickadd.each( function(btn) {
			btn.observe("click", function(e){
				Df.AnalyticsLibrary.ExpressShopProductViewCrossSell();
			});
		});
	}

	var product_promos=$$('#product-promos .details');
	if(product_promos.length > 0){
		product_promos.each( function(details) {
			details.observe("click", function(e){
				Df.AnalyticsLibrary.Promotion();
			});
		});
	}
	
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

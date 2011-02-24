/**
 * Df.DynamicSlider is a minor mod of Df.Slider that allows the slider to function
 * with dynamic contents.  Simply call Df.DynamicSlider#set() each time the slider
 * height changes.
 */
Df.DynamicSlider = function(el){
	
	var ele = this.ele = $(el);
	
	var pars = this.pars = {
		classNames: {
			mask: 'mask',
			slider: 'slider',
			prev: {
				base: 'prevBase',
				on :'prevOn',
				off : 'prevOff',
				disable: 'prevDisable'
			},
			next: {
				base: 'nextBase',
				on :'nextOn',
				off : 'nextOff',
				disable: 'nextDisable'
			}
		}
	}
	Object.extend(pars,{
		mask: ele.select('.'+pars.classNames.mask)[0],
		maskHeight: false,
		maskWidth: false,
		slider: ele.select('.'+pars.classNames.slider)[0],
		sliderHeight: false,
		sliderWidth: false,
		arrowM: ele.select('.'+pars.classNames.prev.base)[0],
		arrowP: ele.select('.'+pars.classNames.next.base)[0],
		event: 'click',
		stopEvent: false,
		iterateBy: false,
		iterBy: false,
		animate: false,
		onComplete: false,
		direction: 'hor' //('hor'|'vert')
	});
	
	var firstSet = true;
	var move = null;
	var dir = false;
	
	var left = {
		attribute: 'left',
		offset: 'offsetWidth',
		maskDem: 'maskWidth',
		sliderDem: 'sliderWidth'
	}
	
	var top = {
		attribute: 'top',
		offset: 'offsetHeight',
		maskDem: 'maskHeight',
		sliderDem: 'sliderHeight'
	}
	
	this.set = function(para){
		
		if(para){
			pars = Object.extend(pars,para)
		}
		
		if (!move) {
			move = new Df.Animate(pars.slider)
		}
		
		if(pars.direction == 'hor'){
			dir = left
		}else if(pars.direction == 'vert'){
			dir = top
		}
		
		move.pars.onComplete = enableLogic
		
		if(pars.animate){
			move.pars = Object.extend(move.pars,pars.animate)
		}
		
		if(!pars.maskWidth && pars.mask){
			pars.maskWidth = parseInt(pars.mask.offsetWidth);
		}
		if(!pars.maskHeight && pars.mask){
			pars.maskHeight = parseInt(pars.mask.offsetHeight);
		}
		
		if(pars.slider){
			pars.sliderWidth = parseInt(pars.slider.offsetWidth);
		}
		if(pars.slider){
			pars.sliderHeight = parseInt(pars.slider.offsetHeight);
		}
		
		if(!pars.iterBy && pars.iterateBy){
			if(pars.iterateBy.constructor == String){
				var elems = pars.slider.getElementsByTagName(pars.iterateBy);
				if (elems.length > 0) {
					pars.iterBy = parseInt(elems[0][dir.offset])
				}
			}
			else {
				pars.iterBy = pars.iterateBy;
			}
		}
		
		if(pars.slider && pars.mask && pars[dir.sliderDem] > pars[dir.maskDem]){
			enableMinus()
			enablePlus()
			disableActions()
			enableLogic()
			
			if(pars.stopEvent){
				pars.arrowM['on'+pars.stopEvent] =  function(){
					enableLogic()
					move.clear()
				}
				pars.arrowP['on'+pars.stopEvent] =  function(){
					enableLogic()
					move.clear()
				}
			}
		}
	}
	
	function plus(){
		var px = 0;
		if(pars.iterBy){
			px = -1*(parseInt(pars.slider.getStyle(dir.attribute))) + pars.iterBy
			if(px > pars[dir.sliderDem] - pars[dir.maskDem]){
				px = pars[dir.sliderDem] - pars[dir.maskDem]
			}
		}else{
			px = pars[dir.sliderDem] - pars[dir.maskDem]
		}
		
		if(px || px == 0){
			if(!pars.stopEvent){
				disableActions()
			}
			move.pars[dir.attribute] = -1*(px)
			move.run()
		}
	}
	
	function minus(){
		var px = 0;
		if(pars.iterBy){
			px = parseInt(pars.slider.getStyle(dir.attribute)) + pars.iterBy
			if(px > 0){
				px = 0
			}
		}
		
		if(px || px == 0){
			if(!pars.stopEvent){
				disableActions()
			}
			move.pars[dir.attribute] = px
			move.run()
		}
	}
	
	function enableLogic(){
		if(pars.onComplete){
			pars.onComplete()
		}
		if(pars.stopEvent){
			disableActions()
		}
		var pos = parseInt(pars.slider.getStyle(dir.attribute))
		if(pos < 0){
			enableMinus()
		}
		if(pos > -1*(pars[dir.sliderDem]-pars[dir.maskDem])){
			enablePlus()
		}
	}
	
	function stopMinusMove(){
		pars.arrowM['on'+pars.event] = null
	}
	
	function stopPlusMove(){
		pars.arrowP['on'+pars.event] = null
	}
	
	function startMinusMove(){
		pars.arrowM['on'+pars.event] = minus
	}
	
	function startPlusMove(){
		pars.arrowP['on'+pars.event] = plus
	}
	
	function turnOffMinusArrow(){
		pars.arrowM.addClassName(pars.classNames.prev.off)
		pars.arrowM.removeClassName(pars.classNames.prev.on)
	}
	
	function turnOffPlusArrow(){
		pars.arrowP.addClassName(pars.classNames.next.off)
		pars.arrowP.removeClassName(pars.classNames.next.on)
	}
	
	function turnOnMinusArrow(){
		pars.arrowM.addClassName(pars.classNames.prev.on)
		pars.arrowM.removeClassName(pars.classNames.prev.off)
		pars.arrowM.removeClassName(pars.classNames.prev.disable)
	}
	
	function turnOnPlusArrow(){
		pars.arrowP.addClassName(pars.classNames.next.on)
		pars.arrowP.removeClassName(pars.classNames.next.off)
		pars.arrowP.removeClassName(pars.classNames.next.disable)
	}
	
	function enableMinus(){
		turnOnMinusArrow()
		startMinusMove()
	}
	
	function disableMinus(){
		turnOffMinusArrow()
		stopMinusMove()
	}
	
	function enablePlus(){
		turnOnPlusArrow()
		startPlusMove()
	}
	
	function disablePlus(){
		turnOffPlusArrow()
		stopPlusMove()
	}
	
	function disableActions(){
		disableMinus()
		disablePlus()
	}
}
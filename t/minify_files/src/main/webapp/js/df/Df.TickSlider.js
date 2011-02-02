Df.TickSlider = Class.create(Df.Ui,{
							 
		initialize : function()
		{
			
				Df.console.log("Tick Slider Class V 1.0 Loaded");
				this.backGroundClip = Df.e("div",{"id":"sliderMask","className":"slideControl"});
				document.body.appendChild(this.backGroundClip);
				this.foregroundClip = Df.e("div",{"id":"sliderFill","className":"slideControlFill"});
				this.backGroundClip.appendChild(this.foregroundClip);
				this.dragClip = Df.e("div",{"id":"slider","className":"slideControlPointer"});
				document.body.appendChild(this.dragClip);
				
				
		},
		
		build : function(parentEl,attachedZoom,tickValue)
		{

			parentEl.appendChild(this.backGroundClip);
			parentEl.appendChild(this.dragClip);
			this.tickValue = 10;
			if(tickValue)
			{
				this.tickValue = tickValue;
				
			}
			this.getMin = this.dragClip.getStyle('left');
			this.getMin = this.getMin.substring(0,this.getMin.indexOf("p"));
			this.getMax = this.backGroundClip.getStyle('width');
			this.getMax = this.getMax.substring(0,this.getMax.indexOf("p"));
			this.dragClip.dragable({dirY:false,dirX:{min:this.getMin - 2,max:(parseInt(this.getMax -8) + parseInt(this.getMin)) },onDrag:this.dragging.bind(this),onStart:this.startDragging.bind(this),onStop:this.stopDragging.bind(this)});
		
			this.attachedZoom = attachedZoom;
	
			},
			
		dirX: function(e){
				this._curX = Event.pointerX(e) - (parseInt(this.getMax) + 8);
				return this._curX;
			},
			
		startDragging: function()
		{
			this.getPosition = 0;
			
		},
		stopDragging: function(el)
		{
			
			
		},
		
		dragging : function(el,e)
		{
			Df.debug.log("Slider Previous: " +this.getPosition );
			Df.debug.log("Slider Position: " +this.dirX(e) );
			
				this.foregroundClip.setStyle({"width":this.dirX(e) + 'px'}); 
				
				if((this.dirX(e) - this.getPosition) > parseInt(this.tickValue) || (this.getPosition - this.dirX(e)) > parseInt(this.tickValue))
				{
				this.attachedZoom.element.fire(':zoomTo', {step:this.dirX(e) });
				this.getPosition = this.dirX(e);
				}
				
			
			
			
		},
		setZoom : function(e)
		{
			
			
			if(this.getPosition < this.dirX(e))
			{
				Df.debug.log("Fire Zoom: " +this.getPosition );
				this.attachedZoom.element.fire(':zoomInc');
				this.getPosition = this.dirX(e);
			}
			else
			{
	
				this.attachedZoom.element.fire(':zoomDec');
				this.getPosition = this.dirX(e);
				
			}
		}
		
		
});
							 
							 
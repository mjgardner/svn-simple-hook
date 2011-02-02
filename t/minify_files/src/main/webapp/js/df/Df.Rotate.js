Df.Rotate = Class.create({
	initialize: function(parentEl,pars)
	{
		Df.Namespace.create('Df.Rotate', window);
			
			Df.console.log("Rotate Class V 1.0 Loaded");
			
			
			//Params
			this.imageHeight = pars.height;
			this.imageWidth = pars.width;
			this.im = new Image(this.imageWidth,this.imageHeight);
			this.dupIm = new Image(this.imageWidth,this.imageHeight);
			if(pars.imageCue)
			{
				this.imageCue = pars.imageCue;
				this.im.src = this.imageCue[0].src;
				this.dupIm.src = this.imageCue[0].src;
			}
			else
			{
				Df.console.warn("imageCue is not specified in contructor");
				imageCue;
				return;
				
			}
			this.dupIm.className = "dupImage";
			this.dupIm.id = "effectImage";
			this.currentImage = 0;
			this.totalImages = pars.totalImages-1;
			this.intervalRight = 0;
			this.intervalLeft = 0;
			this.effectOn = true;
			
			if(typeof(pars.effect) != 'undefined')
			this.effectOn = pars.effect;


			//Parse pars
			this.parID = 'rotate';
			if(pars.id)
			this.parID = pars.id;
			var parClass = 'rotation';
			if(pars.className)
			parClass = pars.className;
			this.panSpeed = 80;
			if(pars.panSpeed)
			this.panSpeed = pars.panSpeed;
			this.arrowSpeed = .03;
			if(pars.arrowSpeed)	
			this.arrowSpeed = pars.arrowSpeed;
			
			var rotateCreate = Df.e("div",{"id":this.parID,"className":parClass});
			
			$(parentEl).appendChild(rotateCreate);
			$(rotateCreate).appendChild(this.dupIm);
			$(rotateCreate).appendChild(this.im);
			
			
			

	},
	 right: function(panning)
	 {
		 
		if(!panning && this.effectOn == true)
		{
		   this.trailEffect();
		}
		else
		{
			$("effectImage").hide();
		}
		   this.currentImage  =   this.currentImage  + 1;
		   if( this.currentImage == this.totalImages +1 )
		   {
			  this.currentImage = 0; 
		   }

		 
		 this.im.src = this.imageCue[ this.currentImage ].src ;
		 
		  

		 
	 },
 
 
	left: function(panning)
	 {
		 if(!panning  && this.effectOn == true)
		{
		   this.trailEffect();
		}
		else
		{
			$("effectImage").hide();
		}
		 this.currentImage  =   this.currentImage - 1;
		 if( this.currentImage == -1 )
		   {
			  this.currentImage = this.totalImages; 
		   }
		   
		this.im.src = this.imageCue[ this.currentImage ].src ;
	 },
	 trailEffect: function()
	 {
		 
		  $("effectImage").show();
		  this.dupIm.setStyle({opacity:.99});
		  this.dupIm.src = this.imageCue[ this.currentImage ].src ;
		  
		  var fadeEffect = new Df.Animate(this.dupIm);
		  fadeEffect.run({ opacity: .0,time:300});
		  
		  fadeEffect.getElement().observe(':complete',function(e){
							 $("effectImage").hide();}.bind(fadeEffect));

		 fadeEffect = "";
		 
	 },
	offsetX: function(e){
		return Event.pointerX(e);
	},
	dirX: function(e){
		this._curX = Event.pointerX(e) - this._offsetX;
		return this._curX;
	},
	rotateRightDown: function(e)
	{
		if(this.intervalRight == 0){
		this.intervalRight = new PeriodicalExecuter(function(){this.right(false);}.bind(this), this.arrowSpeed);
		}
		Event.stop(e);
		
	},
	rotateRightStop: function(e)
	{
		if(this.intervalRight != 0)
		this.intervalRight.stop();
		this.intervalRight = 0;
		Event.stop(e); 
		Event.stopObserving($(e.target),'mouseup', this.rotateRightStop.bind(this));
		Event.stopObserving($(e.target),'mouseout', this.rotateRightStop.bind(this));
		Event.stopObserving($(e.target),'mousedown', this.rotateRightDown.bind(this));

		
		
		
	},
	rotateActivateRight: function(e)
	{
		Event.stop(e);
		Event.observe($(e.target),'mouseup', this.rotateRightStop.bind(this));
		Event.observe($(e.target),'mouseout', this.rotateRightStop.bind(this));
		Event.observe($(e.target),'mousedown', this.rotateRightDown.bind(this));
		
		
	},
	rotateLeftDown: function(e)
	{
		if(this.intervalLeft == 0){
		this.intervalLeft = new PeriodicalExecuter(function(){this.left(false);}.bind(this), this.arrowSpeed);
		}
		Event.stop(e);
		
	},
	rotateLeftStop: function(e)
	{
		if(this.intervalLeft != 0)
		this.intervalLeft.stop();
		this.intervalLeft = 0;
		Event.stop(e); 
		Event.stopObserving($(e.target),'mouseup', this.rotateLeftStop);
		Event.stopObserving($(e.target),'mousedown', this.rotateLeftDown);
		Event.stopObserving($(e.target),'mouseout', this.rotateLeftStop);
		
		
	},
	rotateActivateLeft: function(e)
	{
		Event.stop(e); 
		Event.observe($(e.target),'mouseup', this.rotateLeftStop.bind(this));
		Event.observe($(e.target),'mouseout', this.rotateLeftStop.bind(this));
		Event.observe($(e.target),'mousedown', this.rotateLeftDown.bind(this));
		
	},
	startPan: function(e)
	{
		if(this.effectOn == true)
		{
			$("effectImage").hide();
		}
		Event.stop(e); 
		Event.observe(document.body,'mousemove', this.followMouse.bind(this));
		Event.observe(document.body,'mouseup', this.stopPan);
		this._offsetX = this.offsetX(e);
		this.getPosition = this.dirX(e);
		
	},
	stopPan: function(e)
	{
		
		Event.stop(e); 
		Event.stopObserving(document.body,'mousemove', this.followMouse)
		Event.stopObserving(document.body,'mouseup',this.stopPan)
		
	},
	followMouse: function(e)
	{		
		
		Event.stop(e); 
		
		if  (this.getPosition < this.dirX(e))
		{
			
			setTimeout(function(){this.right(true);}.bind(this),this.panSpeed);
			this.getPosition = this.dirX(e);
		}
		else
		{
			setTimeout(function(){this.left(true);}.bind(this),this.panSpeed);
			this.getPosition = this.dirX(e);
			
		}

	}
});

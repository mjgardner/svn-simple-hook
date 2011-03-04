if('object'==typeof(Prototype)&&'object'==typeof(swfobject)){
Video=Class.create({
	initialize:function(p){
		this.p={
			dims:{width:728,height:453}, /*{width:490,height:400} | overlayid:'element-id' | ( 'auto' | false )*/
			player:'/images/swf/productVideo.swf',
			xinstall:'/images/swf/expressInstall.swf',
			dynamicLocation:'',
			controlsLocation:'/images/swf/',
			onComplete:'javascript:video.close();'
		};
		if(p)Object.extend(this.p,p);
	},
	
	open:function(file){
		if($('video-element'))return;
		var idiv=$('product-image');
		var img=$('product-image-main');
		if(!idiv)return false;
		var con=new Element('div',{id:'video-element-container'});
		var cov=new Element('div',{id:'video-element',className:'video'}).update(con);
		idiv.insert({after:cov});
		if('auto'==this.p.dims||!this.p.dims){
			this.p.dims=img.getDimensions();
		}else if('string'==typeof(this.p.dims.overlayid)){
			var oel=$(this.p.dims.overlayid);
			this.p.dims={width:487,height:355};
			//if(oel)this.p.dims=oel.getDimensions();else this.p.dims={width:728,height:453};
		}
		
		con.update(swfobject.embedSWF(
									this.p.player,
									'video-element-container',
									this.p.dims.width,
									this.p.dims.height,
									'9.0.0',
									this.p.xinstall,
									{
										dynamicLocation:this.p.dynamicLocation,
										productMovieName:file,
										controlsLocation:this.p.controlsLocation,
										onComplete:this.p.onComplete
									},
									{
										menu:false,
										play:true,
										//scale:'scale',
										wmode:'window',
										name:'video-object',
										movie:'video-object',
										allowScriptAccess:'always',
										allowFullScreen:true,
										wmode:'transparent',
										runMode:0
									}));
		var closeEl=new Element('a',{href:'#',className:'close'}).update(new Element('span',{className:'hide'}).update('Close'));
		cov.insert({bottom:closeEl});
		Event.observe(closeEl,'click',function(e){e.stop();this.close();}.bind(this));
		cov.setStyle({backgroundColor:'#fff',position:'absolute',width:this.p.dims.width+'px',height:this.p.dims.height+'px',textAlign:'center'});
	},
	
	close:function(){	
		var vel=$('video-element');
		if(vel)vel.remove();else return false;
	}
});
}
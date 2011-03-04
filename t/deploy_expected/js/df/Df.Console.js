Ajax.Responders.register({
	
	onError: function(e,f){
		Df.console.error(f)
	},

	onException: function(e,f){
		Df.console.error(f)
	}
})


Df.Console = Class.create({
	initialize: function(){
	},
	
	log: function(){
                 try{
                                  $A(arguments).each(function(v){
                                          console.log(v)
                                  })
                 } catch(e) {
                                  
                 }
		return this;
	},
	
	debug: function(){
                 try{
                                  $A(arguments).each(function(v){
                                          console.debug(v)
                                  })
                } catch(e) {
                                  
                 }
		return this;
	},
	
	info: function(){
                 try{
                                  $A(arguments).each(function(v){
                                          console.info(v)
                                  })
                } catch(e) {
                                  
                 }
		return this;
	},
	
	warn: function(){
                 try{
                                  $A(arguments).each(function(v){
                                          console.warn(v)
                                  })
                } catch(e) {
                                  
                 }
	       return this;
	},
	
	error: function(){
                 try{
                                  $A(arguments).each(function(v){
                                          console.error(v)
                                  })
                } catch(e) {
                                  
                 }
		return this;
	},
	
	dir: function(){
                 try{
                                  $A(arguments).each(function(v){
                                          console.dir(v)
                                  })
                } catch(e) {
                                  
                 }
		return this;
	}
})
Df.console = new Df.Console()

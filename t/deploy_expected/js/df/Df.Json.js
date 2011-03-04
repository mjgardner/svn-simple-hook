
Df.Json = {
	
	fixer: function(string){
		string = string.replace(/,+/g,",");
		string = string.replace(/\[,/g,"[");
		string = string.replace(/,]/g,"]");
		string = string.replace(/,}/g,"}");
		string = string.replace(/{,/g,"{");
		string = string.replace(/:,/g,':"",');
		string = string.replace(/":}/g, '":""}');
		return string;
	},
	
	memberCount: function(obj){
		var i = 0
		if(obj.constructor == Object){
			for(p in obj){
				i++;
			}
		}
		return i;
	},
	
	toHtml: function(obj){
		
		var text = ''
		
		if(obj.constructor == Array){
			arrayRecusive(obj);
		}else if(obj.constructor == Object){
			objectRecusive(obj);
		}else{
			return "not a JSON Object or Array";
		}
		
		function dec(v){
			if(v == null){
				text += v;
			}
			else if(v.constructor == Array){
					arrayRecusive(v)
			}
			else if(v.constructor == Number){
				text += v;
			}
			else if(v.constructor == String){
				text += '"'+v+'"';
			}
			else if(v.constructor == Boolean){
				text += v
			}
			else if(v.constructor == Object){
				objectRecusive(v)
			}
		}
		
		//scan object
		function objectRecusive(obj){
			
			text += '<div style="background-color:lightBlue"><span style="font-weight:bold; color:blue">{</span>';
			var i = 0
			var j = 0
			
			for(q in obj)i++
			
			if(i>0){
				text += '<div style="margin-left:20px; border-left:1px dotted blue">';
				for(q in obj){
					j++
					text += '"<span style="font-weight:bold;">'+q+'</span>": '
					
					dec(obj[q]);
					
					if(j<i){
						text += '<span style="font-weight:bold; color:blue">,</span><br/>'
					}
				}
				text += '</div>'
			}
			text += '<span style="font-weight:bold; color:blue">}</span></div>'
		}
		
		//scan array
		function arrayRecusive(ary){
			text += '<div style="background-color:pink"><span style="font-weight:bold; color:red">[</span>'
			if(ary.length > 0){
				text += '<div style="margin-left:20px; border-left:1px dotted red">';
				for(var i=0; i<ary.length; i++){
					dec(ary[i]);
					if(i<(ary.length-1)){
						text += '<span style="font-weight:bold; color:red">,</span><br/>'
					}
				}
				text += '</div>';
			}
			text += '<span style="font-weight:bold; color:red">]</span></div>'
		}
		
		return text
	},
	
	//UNDER DEVELOPEMENT
	find: function(obj,val,para){
		var ary = [];
		
		var opts = {
			operation: '=', //('=','<','<=','>','>=','[]', '{}')
			returnParent: false,
			returnIndex: true,
			returnValue: true,
			returnLevel: true,
			scanMemberNames: true,
			scanMemberValues: true,
			scanArrayValues: true,
			scanLevels: 'full' //(full|int)
		}
		
		Object.extend(opts,para);
		
		if(opts.operation == '='){
			opts.operation = function(o,v,t,level){
				if(val.constructor == Array){
					for(var i=0; i<val.length; i++){
						if(t == val[i]){
							ary.push( getReturnParams(o,v,level) );
						}
					}		
				}
				
				if(t == val){
					ary.push( getReturnParams(o,v,level) );
				}
			}
		}
		else if(opts.operation == '<'){
			opts.operation = function(o,v,t,level){
				if(val.constructor == Array){
					for(var i=0; i<val.length; i++){
						if(t < val[i]){
							ary.push( getReturnParams(o,v,level) );
						}
					}		
				}
				
				if(t < val){
					ary.push( getReturnParams(o,v,level) );
				}
			}
		}
		else if(opts.operation == '<='){
			opts.operation = function(o,v,t,level){
				if(val.constructor == Array){
					for(var i=0; i<val.length; i++){
						if(t <= val[i]){
							ary.push( getReturnParams(o,v,level) );
						}
					}		
				}
				
				if(t <= val){
					ary.push( getReturnParams(o,v,level) );
				}
			}
		}
		else if(opts.operation == '>'){
			opts.operation = function(o,v,t,level){
				if(val.constructor == Array){
					for(var i=0; i<val.length; i++){
						if(t > val[i]){
							ary.push( getReturnParams(o,v,level) );
						}
					}		
				}
				
				if(t > val){
					ary.push( getReturnParams(o,v,level) );
				}
			}
		}
		else if(opts.operation == '>='){
			opts.operation = function(o,v,t,level){
				if(val.constructor == Array){
					for(var i=0; i<val.length; i++){
						if(t >= val[i]){
							ary.push( getReturnParams(o,v,level) );
						}
					}		
				}
				
				if(t >= val){
					ary.push( getReturnParams(o,v,level) );
				}
			}
		}
		else if(opts.operation == '[]'){
			opts.operation = function(o,v,t,level){
				if(val.constructor == Array){
					for(var i=0; i<val.length; i++){
						if(t >= val[i][0] && t <= val[i][1]){
							ary.push( getReturnParams(o,v,level) );
						}
					}		
				}
				
				if(t >= val[0] && t <= val[1]){
					ary.push( getReturnParams(o,v,level) );
				}
			}
		}
		else if(opts.operation == '{}'){
			opts.operation = function(o,v,t,level){
				if(val.constructor == Array){
					for(var i=0; i<val.length; i++){
						if(t > val[i][0] && t < val[i][1]){
							ary.push( getReturnParams(o,v,level) );
						}
					}		
				}
				
				if(t > val[0] && t < val[1]){
					ary.push( getReturnParams(o,v,level) );
				}
			}
		}
		
		if(obj.constructor == Array){
			arrayRecusive(obj,-1);
		}else if(obj.constructor == Object){
			objectRecusive(obj,-1);
		}else{
			return false;
		}
		
		function dec(o,v,level){
			
			level++;
			
			if(opts.scanLevels == 'full' || level<=opts.scanLevels){
				if(v == null){
					
				}
				else if(opts.scanMemberNames && o.constructor == Object){
					opts.operation(o,v,v,level);
				}
				
				if(o[v].constructor == Array){
					arrayRecusive(o[v],level);
				}
				else if(o[v].constructor == Number){
					toCompare(o,v,level);
				}
				else if(o[v].constructor == String){
					toCompare(o,v,level);
				}
				else if(o[v].constructor == Boolean){
					toCompare(o,v,level);
				}
				else if(o[v].constructor == Object){
					objectRecusive(o[v],level);
				}
				
			}
		}
		
		//scan object
		function objectRecusive(obj,level){
			for(q in obj){
				dec(obj,q,level);
			}
			
		}
		
		//scan array
		function arrayRecusive(ary,level){
			if(ary.length > 0){
				for(var i=0; i<ary.length; i++){
					dec(ary,i,level);
				}
			}
			
		}
		
		function getReturnParams(o,v,level){
			var ret = {}
			if(opts.returnParent){
				ret.obj = o;
			}
			if(opts.returnIndex){
				ret.ind = v;
			}
			if(opts.returnValue){
				ret.val = o[v];
			}
			if(opts.returnLevel){
				ret.lev = level;
			}
			return ret;
		}
		
		function toCompare(o,v,level){
			if( (opts.scanMemberValues && o.constructor == Object) || (opts.scanArrayValues && o.constructor == Array) ){
				opts.operation(o,v,o[v],level);
			}
		}
		
		if(ary.length > 0){
			return ary;
		}else{
			return false;
		}
	}
}

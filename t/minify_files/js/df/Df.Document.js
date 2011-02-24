Df.Document = {
	
	_inheritance: {},
	_reference: {},
	_current: {},
	
	_pars: {
		files:[],
		inheritanceNode: 'dynamicNav',
		contentNode: 'dynamicDoc',
		tags: [
			'note',
			'ref',
			'expando',
			'hint',
			'type',
			'extends',
			'delegate',
			'arg',
			'returns',
			'override',
			'example',
			'demo',
			'event',
			'default',
			'fire',
			'choice'
		]
	},
	
	document: function(hash){
		Object.extend(Df.Document._pars, hash)
		Df.Document._setupReponders()
		Df.Document._pars.files.each(function(v){
			Df.Document._loadJS(v)
		});
	},
	
	_setupReponders: function(){
		Ajax.Responders.register({
			onCreate: function() {
				Ajax.activeRequestCount++;
			},
			onComplete: function() {
				Ajax.activeRequestCount--;
				if(Ajax.activeRequestCount == 0){
				      Df.Document._handleCommentsObject()
				}
			},
			onException: function(x,e) {
				alert('exception ' + e)
			}
		});
	},
	
	_loadJS: function(file){
		var a = new Ajax.Request(file,{
			method: 'get',
			onSuccess: Df.Document._handleJS,
			onException: function(x,e) {
				alert('exception ' + e)
			},
			onFailure: function(x,e) {
				alert('failure ' + e)
			}
		});
	},
	
	_handleJS: function(response){
		Df.Document._writeComments(response.responseText)
	},
	
	_handleCommentsObject: function(){
		Df.Document.showInheritanceTree()
		Df.Document.displayDocumentation('Df')
	},
	
	_writeComments: function(string){
		var matches = string.match(/\/\*[\s\S]*?-ref[\s\S]*?\*\//gm)
		for (var i=0; i < matches.length; i++) {
			var hash = {}
			
			matches[i] = matches[i]
				.replace(/\</g, '&lt;')
				.replace(/\>/g, '&gt;')
				.replace('/*', '')
				.replace('*/', '')
				.split(/\n\s+-/);
			matches[i].shift()
			
			for (var j=0; j < matches[i].length; j++) {
				var val = false
				var par = matches[i][j].strip().gsub(/([a-z]+)\s+[\s\S]+/, "#{1}").strip()
				matches[i][j].strip().gsub(/[a-z]+\s+([\s\S]+)/, function(m){
					if(m[1])
						val = m[1].strip()
				})
				if(hash[par]){
					hash[par] = Object.toArray(hash[par])
					hash[par].push(val)
				} else {
					hash[par] = val
				}
			}
			
			//creates a reference for documentation information
			if(hash['ref']){
				
				if(Df.Document._reference[hash['ref']]){
					var o = Df.Document._reference[hash['ref']]
					for(var p in hash){
						if(!Object.isUndefined(o[p]) && Object.toJSON(Object.toArray(o[p])) != Object.toJSON(Object.toArray(hash[p]))){
							o[p] = Object.toArray(hash[p]).concat(Object.toArray(o[p]))
						}
					}
					hash = o
				}
				
				Df.Document._reference[hash['ref']] = hash
			} else {
				$(document.body).insert({top:'<div>'+matches[i]+'</div>'})
			}
		}
	},
	
	//BEGIN doc section
	
	displayDocumentation: function(ref){
		Df.Document._createDocObject(ref)
		Df.Document._writeDocHtml()
		Df.Document._docJS()
	},
	
	_docJS: function(){
		window.scrollTo(0,0)
		$$('#doc .breadC span, #doc .inheritHeader span, #doc .inheritHeaderCompact span, #doc .classLink').each(function(v){
			v.observe('click', function(e){
				Df.Document.displayDocumentation(this.innerHTML)
			}.bind(v))
		});
	},
	
	_createDocObject: function(ref){
		Df.Document._current = Df.Document._reference[ref]
		Df.Document._current._methods = {}
		Df.Document._current._parameters = {}
	
		sub(Df.Document._current, ref)
		
		function sub(thisRef, refName){
			Df.Document._current._methods[refName] = {}
			Df.Document._current._parameters[refName] = {}
			for(p in Df.Document._reference){
				var r = Df.Document._reference[p]
				
				var nodesRef = refName.split('.')
				var nodesI = r.ref.split('.')
				
				var nodeClasses = []
				var j = 0;
				for(var i=0; i < nodesI.length; i++){
					if(nodesI[i].match(/^[A-Z]/)){
						j++
						nodeClasses.push(nodesI[i])
					}
				}
				
				var con = false
				if((nodeClasses.length - nodesRef.length) === 0){
					con = true
					loopie:
					for(var i=0; i < nodesRef.length; i++){
						if(nodesRef[i] !== nodesI[i]){
							con = false
							break loopie
						}
					}
				}
				
				if(con){
					
					if(r.type.match(/[Mm]ethod/)){
						Df.Document._current._methods[refName][r.ref] = Df.Document._reference[r.ref]
					}
					else if (r.type.match(/[Pp]arameter/)){
						Df.Document._current._parameters[refName][r.ref] = Df.Document._reference[r.ref]
					}
				}
				
				if(thisRef['extends'] && r.type.match(/[Cc]lass/)){
					if(thisRef['extends'] === r.ref){
						sub(r, r.ref)
					}
				}
			}
		}
	},
	
	parsePre: function(str){
		
		str = str.replace(/\t*$/, '')
		
		var le = str.match(/r{0,1}\n/)[0]
		
		var ary = str.split(/\r{0,1}\n/)
		if(ary.length > 1 ){
			
			if(ary[ary.length-1].match(/^[\r|\n|\t]*$/)){
				ary.pop()
			}
			
			var search = new RegExp( '^' + ary[ary.length-1].replace(/(^\t*).*/, '$1') )
			
			for (var i=0; i < ary.length; i++) {
				ary[i] = ary[i].replace(search, '')
			}
		}
		return ary.join(le)
	},
	
	_writeExample: function(str, i, count, opt){
		var html = '<h3>Example: </h3>'
		var cl = '';
		if(opt && opt.className){
			cl = 'class="' +opt.className +'"'
		}
		html += '<pre '+cl+'>' + Df.Document.parsePre(str) + '</pre>'
		return html
	},
	
	_writeGen: function(str, i, count, opt){
		var html = ''
		var cl = ''
		if(opt && opt.className){
			cl = 'class="' +opt.className +'"'
		}
		if(i === false){
			html += '<div '+ cl +'>' + str + '</div>'		
		} else {
			
			if(i === 0){
				html += '<ul '+cl+'>'
			}

			html += '<li>'+ str +'</li>'
			
			if(i === count-1){
				html += '</ul>'
			}
		}

		return html
	},
	
	_writeDemo: function(str, i, count, opt){
		var ary = str.split(' ')
		var string =  '<a target="_blank" href="' + ary.shift() + '" >'  + ary.join(' ') + '</a>'
		var html = ''
		var cl = ''
		if(opt && opt.className){
			cl = 'class="' +opt.className +'"'
		}
		if(i === false){
			html += '<div '+ cl +'>' + string + '</div>'		
		} else {
			
			if(i === 0){
				html += '<ul '+cl+'>'
			}

			html += '<li>'+ string +'</li>'
			
			if(i === count-1){
				html += '</ul>'
			}
		}

		return html
	},
	
	_typeDelegate: function(data, callback, opt){
		var html = ''
		if(data){
			if(opt && opt.heading){
				html += '<h3>'+ opt.heading +'</h3>'
			}
			if(data.constructor === Array){
				for(var i=0; i < data.length; i++){
					html += callback(data[i], i, data.length, opt)
				}
			} else {
				html += callback(data, false, false, opt)
			}
		}
		return html
	},
	
	_writeSig: function(data){
		var args = ''
		var returns = ''
		var ins = ''
		var ref = data.ref
		if(data.returns){
			if(data.returns.match(/^.*$/)){
				returns = ':' + data.returns
			}
			else if(data.returns.match(/^[\t|\r|\n]*\{[\s\S]*\}[\t|\r|\n]*$/)){
				returns = ':Object'
			}
			else if(data.returns.match(/^[\t|\r|\n]*\[[\s\S]*\][\t|\r|\n]*$/)){
				returns = ':Array'
			}
		} else {
			returns = ':Void'
		}
		if(data.type.match(/^[Cc]lass/)){
			ins = 'new '
		}
		
		if(data.type.match(/^[Cc]lass/) || data.type.match(/[Mm]ethod/)){
		
			args = '('
			if(data.arg){
				if(data.arg.constructor == Array){
					var ary = []
					for(var i=0; i < data.arg.length; i++){
						ary.push(Df.Document._buildArg(data.arg[i], false))
					}
					args += ary.join(', ')
				}else{
					args += Df.Document._buildArg(data.arg, false)
				}
			}
			args += ')' 
		}
		if(data.type.match(/^[Mm]ethod/) || data.type.match(/^[Pp]arameter/)){
			ref = 'this.' + Df.Document._lastNS(ref)
		}
		html = '<pre class="sig">'+ ins + ref + args + returns +'</pre>'
		return html
	},
	
	_buildArg: function(arg, full) {
		var ary = arg.split(' ')
		var string =  ary.shift() + ':' + ary.shift()
		if(full && ary.length > 0){
			string += '<div class="argNote" >' + ary.join(' ') + '</div>'
		}
		return string
	},
	
	_writeReturn: function(str, opt){
		var html = ''
		if(str){
			var cl = ''
			if(opt && opt.heading){
				html += '<h3>'+ opt.heading +'</h3>'
			}
			
			if(opt && opt.className){
				cl = 'class="' +opt.className +'"'
			}
			
			if(str.match(/^.*$/)){
				var classLink = ''
				if(Df.Document._reference[str]){
					if(opt && opt.className){
						cl = 'class="classLink ' + opt.className +'"'
					} else {
						cl = 'class="classLink"'
					}
				}
				html += '<div '+ cl + '>' + str + '</div>'
			}
			else {
				html += '<pre '+ cl +'>' + Df.Document.parsePre(str) + '</pre>'
			}
		}
		return html
	},
	
	_writeArg: function(str, i, count, opt){
		str = Df.Document._buildArg(str, true)
		var html = ''
		var cl = ''
		if(opt && opt.className){
			cl = 'class="' +opt.className +'"'
		}
		if(i === false){
			html += '<div '+ cl +'>' + str + '</div>'		
		} else {
			
			if(i === 0){
				html += '<ul '+cl+'>'
			}

			html += '<li>'+ str +'</li>'
			
			if(i === count-1){
				html += '</ul>'
			}
		}

		return html
	},
	
	_writeCrumbs: function(data) {
		var html =''
		if(data._methods){
			var ary = $H(data._methods).keys()
			
			if(ary.length > 1){
				ary = ary.reverse()
				for(var i=0; i<ary.length-1; i++){
					ary[i] = '<span>'+ ary[i] + '</span>'
				}
				html += '<div class="breadC">' + ary.join(' &raquo; ') + '</div>'
			}
			
		}
		return html
	},
	
	_lastNS: function(ref){
		var ary = ref.split('.')
		
		
		while(ary.length){
			if(ary[0] && ary[0].match(/^[A-Z]/)){
				ary.shift()
				continue
			}else{
				break
			}
		}
		return ary.join('.')
	},
	
	_writeDocHtml: function(){
		var data = Df.Document._current
		
		var html = '<div class="classBlock">'
		
		//ref
		html += '<h1>' +  data.ref + '</h1>'
		
		//type
		html += '<h2>' +  data.type + '</h2>'
		
		//sig
		html += Df.Document._writeSig(data)
		
		//crumbs
		html += Df.Document._writeCrumbs(data)
		
		//notes
		html += Df.Document._typeDelegate(data.note, Df.Document._writeGen, {className: 'note'})
		
		//args
		html += Df.Document._typeDelegate(data.arg, Df.Document._writeArg, {heading: 'Arguments'})
		
		//fires
		html += Df.Document._typeDelegate(data.fire, Df.Document._writeGen, {heading: 'Fires'})
		
		//expando
		html += Df.Document._typeDelegate(data.expando, Df.Document._writeGen, {heading: 'Expando'})
		
		//delegate
		html += Df.Document._typeDelegate(data.delegate, Df.Document._writeGen, {heading: 'Delegate', className: 'classLink'})
		
		//returns
		html += Df.Document._writeReturn(data.returns, {heading: 'Returns', className: 'returns'})
		
		//hints
		html += Df.Document._typeDelegate(data.hint, Df.Document._writeGen, {heading: 'Hints'})
		
		//demos
		html += Df.Document._typeDelegate(data.demo, Df.Document._writeDemo, {heading: 'Demos'})
		
		//examples
		html += Df.Document._typeDelegate(data.example, Df.Document._writeExample)
		
		html += '</div>'
		html += '<div class="classBlock">'
		
		//Compact Parameters
		html += Df.Document._writeMemberCompact(data,'_parameters', 'Parameters')
		
		//Compact Methods
		html += Df.Document._writeMemberCompact(data,'_methods', 'Methods')
		
		//Events
		html += Df.Document._writeEventCompact(data)
		
		html += '</div>'
		
		//Parameters
		html += Df.Document._writeMember(data,'_parameters', 'Parameters')
		
		//Methods
		html += Df.Document._writeMember(data,'_methods', 'Methods')
		
		//Events
		html += Df.Document._writeEvent(data)
		
		$(Df.Document._pars.contentNode).update(html)	
	},
	
	_writeEvent: function(data){
		html = ''
		
		var heading = false
		
		if(data._methods){
			var i=0;
			for(p in data._methods){
				
				var ary = Df.Document._getEventAsArray(Df.Document._reference[p])
				
				if(ary.length > 0){
					if(!heading){
						html += '<h2>Events</h2>'
						heading = true
					}
					
					if(i !== 0){
						html += '<div class="inheritHeaderCompact">inherited from <span class="classLink">' + p +'</span></div>'
					}
					
					for(var j=0; j<ary.length; j++){
						var ev = ary[j].split(' ')
						html += '<a class="memberName" name="'+ p.replace('.','_') + ev[1].replace(':','_') +'">'+ ev[1] +'</a>'
						html += '<div class="toggleBlock">'
					
						html += '<h3>Target</h3>'
						html += '<div>' + ev[0] + '</div>'
						
						ev.shift()
						ev.shift()
						if(ary.length > 0){
							html += '<h3>Notes</h3>'
							html += '<div>' + ev.join(' ') + '</div>'
						}
						
						html += '</div>'	
					}
				}
				i++	
			}
		}
		return html
	},
	
	_writeEventCompact: function(data){
		html = ''
		
		var heading = false
		
		if(data._methods){
			var i=0;
			for(p in data._methods){
				
				var ary = Df.Document._getEventAsArray(Df.Document._reference[p])
		
				ary = Df.Document._getEventNamesForCompact(ary, p)
				
				if(ary.length > 0){
					if(!heading){
						html += '<h2>Events</h2>'
						heading = true
					}
					
					if(i !== 0){
						html += '<div class="inheritHeaderCompact">inherited from <span class="classLink">' + p +'</span></div>'
					}
					html += '<div class="memberCompact">' + ary.join(' | ') + '</div>'
				}
				i++	
			}
		}
		return html
	},
	
	_getEventAsArray: function(data){
		var ary = []
		if(data.event){
			if(data.event.constructor == Array){
				ary = ary.concat(data.event)
			}else{
				ary.push(data.event)
			}
		}
		return ary
	},
	
	_getEventNamesForCompact: function(ary, ns){
		for(var i=0; i<ary.length; i++){
			var t = ary[i].split(' ')
			ary[i] = ('<a href="#'+ ns.replace('.','_') + t[1].replace(':', '_') +'">' + t[1] + '</a>')
		}
		return ary
	},
	
	_writeMemberCompact: function(data, _par, par){
		html = ''
		if(data[_par]){
			var i=0;
			var lab = false
			for(p in data[_par]){
				
				var ary = $H(data[_par][p]).keys()
				
				if(ary.length > 0){
					if(!lab){
						html += '<h2>' + par + '</h2>'
						lab = true
					}
					
					if(i !== 0){
						html += '<div class="inheritHeaderCompact">inherited from <span class="classLink">' + p +'</span></div>'
					}
					
					var ary2 = []
					for(var j=0; j<ary.length; j++){
						ary2.push('<a href="#'+ ary[j] +'">' + ary[j] + '</a>')
					}
					html += '<div class="memberCompact">' + ary2.join(' | ') + '</div>'
				}
				i++	
			}
		}
		return html
	},
	
	_writeMember: function(data, _par, par){
		html = ''
		if(data[_par]){
			var i=0;
			var lab = false
			for(p in data[_par]){
				
				var ary = $H(data[_par][p]).keys()
				
				if(!lab && ary.length > 0){
					html += '<h2>' + par + '</h2>'
					lab = true
				}
				
				if(i !== 0 && ary.length > 0){
					html += '<div class="inheritHeader">inherited from <span class="classLink">' + p +'</span></div>'
				}
				
				for(var j=0; j<ary.length; j++){
					
					var ref = Df.Document._reference[ary[j]]
					
					var override = ''
					if(ref.override != undefined){
						override = 'override '
					}
					
					var stat = ''
					if(ref.type.match(/[Ss]tatic/)){
						override = 'static '
					}
					
					html += override + stat + '<a class="memberName" name="'+ ary[j] +'">'+ Df.Document._lastNS(ary[j]) +'</a>'
					html += '<div class="toggleBlock">'
					
					//sig
					html += Df.Document._writeSig(ref)
					
					//notes
					html += Df.Document._typeDelegate(ref.note, Df.Document._writeGen, {className: 'note'})
					
					//choice
					html += Df.Document._typeDelegate(ref.choice, Df.Document._writeGen, {heading: 'Choices'})
					
					//default
					html += Df.Document._typeDelegate(ref['default'], Df.Document._writeGen, {heading: 'Default'})
					
					//args
					html += Df.Document._typeDelegate(ref.arg, Df.Document._writeArg, {heading: 'Arguments'})
					
					//fires
					html += Df.Document._typeDelegate(ref.fire, Df.Document._writeGen, {heading: 'Fires'})
		
					//expando
					html += Df.Document._typeDelegate(ref.expando, Df.Document._writeGen, {heading: 'Expando'})
					
					//delegate
					html += Df.Document._typeDelegate(ref.delegate, Df.Document._writeGen, {heading: 'Delegate', className: 'classLink'})
					
					//returns
					html += Df.Document._writeReturn(ref.returns, {heading: 'Returns', className: 'returns'})
					
					//hints
					html += Df.Document._typeDelegate(ref.hint, Df.Document._writeGen, {heading: 'Hints'})
					
					//demos
					html += Df.Document._typeDelegate(ref.demo, Df.Document._writeDemo, {heading: 'Demos'})
					
					//examples
					html += Df.Document._typeDelegate(ref.example, Df.Document._writeExample)
						
					html += '</div>'
				}
				i++
			}
		}
		return html
	},
	//END doc section
	
	//BEGIN Inheritance tree
	showInheritanceTree: function(){
		//builds the inheritance chain to Df.Document._inheritance
		Df.Document._classTree()
		//writes Df.Document._inheritance to the dom
		$(Df.Document._pars.inheritanceNode).update(Df.Document._treeHtml(Df.Document._inheritance))
		//applies the ui behavior
		Df.Document._treeJs()
	},
	
	_classTree: function(){
		Df.Document._inheritanceTemp = {}
		Df.Document._tree(Df.Document._reference)
		Df.Document._getOrphans(Df.Document._inheritance)
		delete Df.Document._inheritanceTemp
	},
	
	_tree: function(ref){
		
		for(p in ref){
			var obj = ref[p]
			if(obj.type && obj.type.match(/[Cc]lass/)){
				if(obj['extends']){
					var f = Df.Json.find(Df.Document._inheritance, obj['extends'], {
						returnIndex: false,
						returnLevel: false,
						scanMemberValues: false,
						scanArrayValues: false
					});
					if(f && f[0] && f[0].val){
						f[0].val[obj.ref] = {}
					} else {
						if(Df.Document._inheritanceTemp[obj['extends']]){
						}else{
							Df.Document._inheritanceTemp[obj['extends']] = {}
						}
						Df.Document._inheritanceTemp[obj['extends']][obj.ref] = {}
					}
				} else {
					Df.Document._inheritance[obj.ref] = {}
				}
			}
		}
	},
	
	_getOrphans: function(obj){
		for(p in obj){
			for(c in Df.Document._inheritanceTemp){
				if(c === p){
					Object.extend(obj[p], Df.Document._inheritanceTemp[c])
					delete Df.Document._inheritanceTemp[c]
				}
			}
			Df.Document._getOrphans(obj[p])
		}
	},
	
	_treeHtml: function(obj){
		
		var html = ''
		
		for(p in obj){
			html += '<div class="treeRec"><div>'+p+'<\/div><\/div>'
			next(obj[p])
		}
		
		function next(obj){
			if(Df.Json.memberCount(obj)){
				html += '<div class="treeBlock">'
				html += '<div class="treeToggle"><\/div>'
				html += '<div class="treeBlockContent">'
				for(p in obj){
					html += '<div class="treeRec"><div>'+p+'<\/div><\/div>'
					
					next(obj[p])
				}
				html += '<\/div>'
				html += '<\/div>'
			}
		}
		
		return html
	},
	
	_treeJs: function(){
		
		var ary = []
		//create toggle panes
		$$('.treeBlockContent').each(function(v){
			var ins = new Df.TogglePane(v, {
				activeControllerClassName: 'treeToggleActive',
				controller: new Df.Ui(v.previous()),
				eventType: 'click'
			})
			
			this.push(ins)
		}.bind(ary));
		//create tips
		$$('.treeRec div').each(function(v){
			
			//handler for displaying documentation
			v.observe('click', function(e){
				Event.stop(e)
				Df.Document.displayDocumentation(e.target.innerHTML)	
			});
			
			if(Df.Document._reference[v.innerHTML].note){
				
				var data = Df.Document._reference[v.innerHTML].note
				
				v.insert({after:'<div class="info"><\/div>'})
				
				var tip = new Df.Tip(v.next('div.info'), {
					parent: $('nav'),
					fitInPage: false,
					xOrientation: 'right',
					yOrientation: 'center',
					treatAsMenu: false,
					pointerOrientation: 'right',
					data: data,
					toggleShowDelay: 150,
					toggleHideDelay: 150,
					xOffsetPointer: -1,
					animate: {
						opacity:.95
					}
				});
				
				tip.holder.setStyle({opacity:0})
				
				//handler for displaying documentation
				tip.getElement().observe('click', function(e){
					Event.stop(e)
					Df.Document.displayDocumentation(e.target.previous().innerHTML)	
				});
			}
		});
		
		$('treeToggleOpen').observe('click', function(e){
			this.each(function(v){
				v.show()
			});
		}.bind(ary));
		
		$('treeToggleClose').observe('click', function(e){
			this.each(function(v,i){
				v.hide()
			});

		}.bind(ary));
	}
	//END Inheritance tree
}
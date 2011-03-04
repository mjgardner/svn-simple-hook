Object.extend(Prototype.Browser,{ie6:navigator.userAgent.toLowerCase().indexOf("msie 6")>-1,ie7:navigator.userAgent.toLowerCase().indexOf("msie 7")>-1});var Df={}
Df.version="1.4.0";Df.classPath='../js/df/';Df.debug={clock:function(){},log:function(){}}
Object.toArray=function(){if($A(arguments).length==0){return[]}else if($A(arguments).length==1&&Object.isArray($A(arguments)[0])){return $(arguments)[0]}else if($A(arguments).length==1){return[$(arguments)[0]]}else{return $A(arguments)}}
Element.addMethods({getPointerX:function(element,e){var f=false;function isFixed(n){if($(n).getStyle('position')=='fixed'){f=true}
if(!f&&$(n).up()&&$(n).up().tagName.toLowerCase()!='body'){isFixed($(n).up())}}
isFixed(element)
var o=0
if(f){o=document.viewport.getScrollOffsets().left}
return Event.pointerX(e)-o-$(element).cumulativeOffset().left},getPointerY:function(element,e){var f=false;function isFixed(n){if($(n).getStyle('position')=='fixed'){f=true}
if(!f&&$(n).up()&&$(n).up().tagName.toLowerCase()!='body'){isFixed($(n).up())}}
isFixed(element)
var o=0
if(f){o=document.viewport.getScrollOffsets().top}
return Event.pointerY(e)-o-$(element).cumulativeOffset().top},replaceClassName:function(element,r,a){element.removeClassName(r).addClassName(a)},e:function(element,tag,position,pars){element=$(element)
var obj=$(document.createElement(tag))
if(pars)Object.extend(obj,pars)
if(Object.isUndefined(position)){element.insert(obj);}
else{var pos={}
pos[position]=obj
element.insert(pos)}
return obj;},setAttributes:function(element,pars){element=$(element)
Object.extend(element,pars)
return element},animate:function(element,pars){return new Df.Animate($(element)).run(pars);},toggleAnimation:function(element,action,pars){return Df.Animate.toggleBy($(element),action,pars)},dragable:function(element,pars){return new Df.Drag($(element),pars).enable();},resizable:function(element,pars){return new Df.Resize($(element),pars).enable();},ui:function(element,pars){new Df.Ui($(element),pars);},createNS:function(element,namespace){return Df.Namespace.create(namespace,$(element));},center:function(element){element=$(element)
var holder=element.up()
var hHeight
var hWidth
if(holder==document.body){hHeight=document.viewport.getHeight()
hWidth=document.viewport.getWidth()}else{hHeight=holder.getHeight()
hWidth=holder.getWidth()}
var top=(hHeight-element.getHeight())/2
var left=(hWidth-element.getWidth())/2
if(element.getStyle('position')!='fixed'&&holder==document.body){var offsets=document.viewport.getScrollOffsets()
top+=offsets.top
left+=offsets.left}
return element.setStyle({left:parseInt(left)+'px',top:parseInt(top)+'px'})},toViewPort:function(element){element=$(element)
var d=document.viewport.getDimensions()
var o=document.viewport.getScrollOffsets()
var h=element.getHeight()
var w=element.getWidth()
var t=parseInt(element.getStyle("top"))
var l=parseInt(element.getStyle("left"))
var maxT=o.top+d.height-h
var maxL=o.left+d.width-w
if(l>maxL||l<minL){element.setStyle({left:+l.toRange(minL,maxL)+'px'})}
if(t>maxT||t<minT){element.setStyle({top:+t.toRange(minT,maxT)+'px'})}
return element},distributeChildElements:function(element,groups,options){var tag=element.down().tagName
var nodes=element.down().childElements()
if(options&&options.minimumChildren&&nodes.length<options.minimumChildren){}else{nodes=$A(nodes).distributeEvenly(groups)
nodes.each(function(v){var node=Df.e(tag)
v.each(function(vv){node.insert(vv)})
element.insert(node)})
element.down().remove()}
return element},chunkChildElements:function(element,size,options){var tag=element.down().tagName
var nodes=element.down().childElements()
if(options&&options.minimumChildren&&nodes.length<options.minimumChildren){}else{nodes=$A(nodes).eachSlice(size)
nodes.each(function(v){var node=Df.e(tag)
v.each(function(vv){node.insert(vv)})
element.insert(node)})
element.down().remove()}
return element}});Object.extend(String.prototype,{uId:function(){return this+"u"+new Date().getTime()+parseInt(10000*Math.random());},exe:function(){return(eval('['+this+']')[0]);},capFirstChar:function(){return this.charAt(0).toUpperCase()+this.substring(1,this.length)},hexToRGB:function(){var hexColor,red,green,blue;hexColor=this.cssToHex()
if(hexColor){red=parseInt(hexColor.slice(1,3),16);green=parseInt(hexColor.slice(3,5),16);blue=parseInt(hexColor.slice(5,7),16);return[red,green,blue]}
return undefined},cssToHex:function(){var color='#'
var rgbRe=/^rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i.exec(this)
var hexRe=/^\#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.exec(this)
if(rgbRe){var part;for(var i=1;i<=3;i++){part=Math.max(0,Math.min(255,parseInt(rgbRe[i])));color+=(part.toColorPart());}
return color;}
else if(hexRe){if(hexRe[1].length==3){for(var i=0;i<3;i++){color+=hexRe[1].charAt(i)+hexRe[1].charAt(i);}
return color;}
return color+=hexRe[1];}
return false;}});Object.extend(Array.prototype,{_each:function(iterator){var n=this.length;var l=n
while(l--){iterator(this[n-l-1])}},distributeEvenly:function(groups){var a=[]
var s=Math.floor(this.length/groups)
new Number(groups).times(function(n){a.push(s)})
var r=this.length%groups
while(r){a[r-1]++
r--}
for(var i=0;i<a.length;i++){a[i]=this.splice(0,a[i])}
return a},sum:function(){var s=0;for(var i=0;i<this.length;i++){s+=this[i];}
return s;},descend:function(p){this.sort(function(a,b){if(p){a=a[p]
b=b[p]}
if(!parseInt(a)){a=String(a).toUpperCase()}
if(!parseInt(b)){b=String(b).toUpperCase()}
if(a>b)return-1;if(b>a)return 1;return 0;});},ascend:function(p){this.sort(function(a,b){if(p){a=a[p]
b=b[p]}
if(!parseInt(a)){a=String(a).toUpperCase()}
if(!parseInt(b)){b=String(b).toUpperCase()}
if(a>b)return 1;if(b>a)return-1;return 0;});}});Object.extend(Number.prototype,{suff:function(){var str=this.toString()
var count=parseInt(str.length-1)
if(this==0)return this
if((str[count]>3&&str[count]<10)||str[count-1]==1&&count!=0)return this+"th"
if(str[count]==1)return this+"st"
if(str[count]==2)return this+"nd"
if(str[count]==3)return this+"rd"
return this+"th"},roundTo:function(places){if(places){return Math.round((this+1-1)*(Math.pow(10,places)))/Math.pow(10,places);}else{return Math.round()}},dollars:function(){var num=this.roundTo(2)
num=num.toString()
var dec=num.indexOf(new String('.'))
if(dec==-1){num=num.concat(new String('.00'))}else if(((num.length-1)-dec)==1){num=num.concat(new String('0'))}
return'$'+num},toRange:function(min,max){return new Number(this).toMin(min).toMax(max)},toMin:function(min){if(this>=min){return this}else{return min}},toMax:function(max){if(this<=max){return this}else{return max}}});Df.importModule=function(){for(var i=0;i<arguments.length;i++){if(Df.Namespace.exists(arguments[i])){}else{document.write('<script type="text/javascript" src="'+Df.classPath+arguments[i]+'.js"></script>');}}};Df.loadJS=function(){for(var i=0;i<arguments.length;i++){document.write('<script type="text/javascript" src="'+arguments[i]+'"></script>');}};Df.ImageCache=Class.create({initialize:function(){this.imageHash=$H();if(arguments&&arguments.length>0){this.load($A(arguments))}
return this},load:function(){var ary=arguments[0]
if(arguments.length>1||arguments[0].constructor==String){ary=$A(arguments)}
for(var i=0;i<ary.length;i++){var image=new Image()
image.src=ary[i]
this.imageHash.set([escape(ary[i])],image)}
return this},get:function(url){return this.imageHash.get(escape(url))}});Df.e=function(tag,pars){var obj=$(document.createElement(tag))
if(pars)Object.extend(obj,pars)
return obj}
Df.Namespace={_ary:null,_obj:null,_exists:false,create:function(str,scope){Df.Namespace._ary=str.split('.');if(!scope){scope=window;}
if(!scope[Df.Namespace._ary[0]]){scope[Df.Namespace._ary[0]]={};}
Df.Namespace._obj=scope[Df.Namespace._ary[0]];if(Df.Namespace._ary[1]){Df.Namespace._next(1);}
return Df.Namespace._obj;},exists:function(str,scope){Df.Namespace._ary=str.split('.');Df.Namespace._exists=false;if(!scope){scope=window;}
if(!scope[Df.Namespace._ary[0]]){scope[Df.Namespace._ary[0]]={};}
Df.Namespace._obj=scope[Df.Namespace._ary[0]];if(Df.Namespace._ary[1]){Df.Namespace._exists=true;Df.Namespace._checkNext(1);}else{Df.Namespace._exists=false;}
return Df.Namespace._exists;},_next:function(i){if(!Df.Namespace._obj[Df.Namespace._ary[i]]){Df.Namespace._obj[Df.Namespace._ary[i]]={};}
Df.Namespace._obj=Df.Namespace._obj[Df.Namespace._ary[i]];if(Df.Namespace._ary[i+1]){Df.Namespace._next(i+1);}},_checkNext:function(i){if(Df.Namespace._obj[Df.Namespace._ary[i]]){Df.Namespace._obj=Df.Namespace._obj[Df.Namespace._ary[i]];if(Df.Namespace._ary[i+1]){Df.Namespace._checkNext(i+1);}else{Df.Namespace._exists=true;}}else{Df.Namespace._exists=false;}}}
Df.Event={registerEvent:function(){Df.Namespace.create('events',this)
for(var i=0;i<arguments.length;i++){this.events[arguments[i]]=[];this.events[arguments[i]].before=[];this.events[arguments[i]].after=[];}
return this;},unregisterEvent:function(){Df.Namespace.create('events',this)
for(var i=0;i<arguments.length;i++){if(this.events[arguments[i]]){delete this.events[arguments[i]];}}
return this;},observe:function(onx,fn){Df.Namespace.create('events',this)
if(Object.isUndefined(this.events[onx]))
this.registerEvent(onx);this.events[onx].push(fn);return this;},observeBefore:function(onx,fn){Df.Namespace.create('events',this)
if(Object.isUndefined(this.events[onx]))
this.registerEvent(onx);this.events[onx].before.push(fn);return this;},observeAfter:function(onx,fn){Df.Namespace.create('events',this)
if(Object.isUndefined(this.events[onx]))
this.registerEvent(onx);this.events[onx].after.push(fn);return this;},stopObserving:function(onx,fn){Df.Namespace.create('events',this)
for(var i=0;i<this.events[onx].length;i+=1){if(this.events[onx][i]===fn){this.events[onx].splice(i,1);}}
return this;},stopObservingBefore:function(onx,fn){Df.Namespace.create('events',this)
for(var i=0;i<this.events[onx].before.length;i+=1){if(this.events[onx].before[i]===fn){this.events[onx].before.splice(i,1);}}
return this;},stopObservingAfter:function(onx,fn){Df.Namespace.create('events',this)
for(var i=0;i<this.events[onx].after.length;i+=1){if(this.events[onx].after[i]===fn){this.events[onx].after.splice(i,1);}}
return this;},fire:function(onx,memo){Df.Namespace.create('events',this)
if(this.events[onx]){var r
for(var i=0;i<this.events[onx].before.length;i++){r=this.events[onx].before[i]({target:this,memo:memo});if(r&&r.memo)
memo=r.memo
else if(r===false){return this}}
for(var i=0;i<this.events[onx].length;i++){r=this.events[onx][i]({target:this,memo:memo});if(r&&r.memo)
memo=r.memo
else if(r===false){return this}}
for(var i=0;i<this.events[onx].after.length;i++){r=this.events[onx].after[i]({target:this,memo:memo});if(r&&r.memo)
memo=r.memo
else if(r===false){return this}}}
return this;}}
Df.Base=Class.create(Df.Event,{initialize:function(pars){this._addThisInstance()
this._initPars(pars)
this._setup()
return this;},_setup:function(){},setPars:function(pars){Df.Namespace.create('pars',this)
if(pars){Object.extend(this.pars,pars);}
return this;},_addThisInstance:function(){if(Object.isUndefined(this.constructor._instances)){this.constructor._instances=[]
this.constructor.getInstances=function(){return this.constructor._instances}.bind(this)}
this.constructor._instances.push(this)},_createGettersAndSetters:function(){this._createSetters()
this._createGetters()
return this},_createSetters:function(){for(p in this.pars){var pl=p.capFirstChar()
if(!this['set'+pl]){this['set'+pl]=function(p,obj){this.pars[p]=obj
return this}.bind(this,p)}}
return this},_createGetters:function(){for(p in this.pars){var pl=p.capFirstChar()
if(!this['get'+pl]){this['get'+pl]=function(p){return this.pars[p]}.bind(this,p)}}
return this},_initPars:function(pars){this.setPars(pars)}});Df.Element=Class.create(Df.Base,{initialize:function($super,element,pars){this.element=this.createOrGetElementReference(element);$super(pars)
return this},_setup:function($super){this._stopBubble()
$super()},createOrGetElementReference:function(element){if(element){try{return $(element)}catch(e){var el=document.createElement('div')
el.id=element
return $(el)}}else{return $(document.createElement('div'))}},getElement:function(){return this.element;},_stopBubble:function(){if(this.pars.stopBubble&&this.pars.stopBubble.length>0){this.pars.stopBubble.each(function(v){this.element.observe(v,function(e){e.stop()})}.bind(this))}}})
Df.Ui=Class.create(Df.Element,{_setup:function($super){this.togglePanes=[]
this.status=false
this.displayStatus=false
$super()
this._animationCompleteEvent=this.animationCompleteEvent.bindAsEventListener(this)
if(this.pars.animate){this.animate=new Df.Animate(this.getElement(),this.pars.animate);this.animate.getElement().observe(':complete',this._animationCompleteEvent);}else{this.animate=false}
if(this.pars.drag){this.drag=new Df.Drag(this.getElement(),this.pars.drag);this.drag.enable()}else{this.drag=false}
if(this.pars.resize){this.resize=new Df.Resize(this.getElement(),this.pars.resize);this.resize.enable()}else{this.resize=false}
if(this.pars.scroll){this.scroll=new Df.Scroll(this.getElement(),this.pars.scroll);}else{this.scroll=false}
try{this.getElement().fire(':set')}catch(e){}
if(this.pars.onSet){this.pars.onSet(this)}
if(this.pars.displayStateId){this._displayStateCookie=new Df.Cookie({name:'df_ui_display_state',path:'/'})
var o=this._displayStateCookie.getCookie()
if(o&&o[this.pars.displayStateId]==1){this._displayStateFirstRunFlag=true
this.show()}}
return this;},_initPars:function($super,pars){$super()
this.setPars({displayStateId:false,showClassName:'df_element_show',hideClassName:'df_element_hide',animate:false,drag:false,resize:false,scroll:false,iframe:false,onSet:false,onHide:false,onShow:false,onHidden:false,onShown:false});this.setPars(pars)},togglePane:function(element,pars){Object.extend(pars,{controller:this})
var togglePane=new Df.TogglePane(element,pars)
this.togglePanes.push(togglePane)
return togglePane;},animationCompleteEvent:function(e){e.stop()
if(e.memo.pointer==0){this._finishHide(e)}
else if(e.memo.pointer==1){this._finishShow(e)}},show:function(e){this.status=true
this.showByStatus(e)
return this},showByStatus:function(e){if(this.status&&!this.displayStatus){this.showActions(e)}
return this;},showActions:function(e){this.status=true
if(!this.displayStatus){this.displayStatus=true
if(this.pars.showClassName){this.getElement().addClassName(this.pars.showClassName)}
if(this.pars.hideClassName){this.getElement().removeClassName(this.pars.hideClassName)}
this.element.fire(':show',{event:e});if(this.pars.onShow){this.pars.onShow(this)}
if(this.animate){if(this.animate.getHistoryCount()==0){var f=null
if(this._displayStateFirstRunFlag){var f=true}
this.animate.run(false,false,f);this._displayStateFirstRunFlag=null}else{this.animate.last();}}else{this._finishShow(e)}}
return this},_finishShow:function(e){if(Prototype.Browser.ie6&&this.pars.iframe){this.showIframe();}
this.element.fire(':shown',{event:e});if(this.pars.onShown){this.pars.onShown(this)}
if(this.pars.displayStateId){var o=this._displayStateCookie.getCookie()
if(!o){var o={}}
o[this.pars.displayStateId]=1
this._displayStateCookie.setData(o)}},hide:function(e){this.status=false
this.hideByStatus(e)},hideByStatus:function(e){if(!this.status&&this.displayStatus){this.hideActions(e)}
return this},hideActions:function(e){this.status=false
if(this.displayStatus){this.displayStatus=false
this.element.fire(':hide',{event:e});if(this.pars.onHide){this.pars.onHide(this)}
if(this.animate&&this.animate.getHistoryCount()>0){this.animate.first();}else{this._finishHide(e)}}
return this},_finishHide:function(e){if(this.pars.hideClassName){this.getElement().addClassName(this.pars.hideClassName)}
if(this.pars.showClassName){this.getElement().removeClassName(this.pars.showClassName)}
if(Prototype.Browser.ie6&&this.pars.iframe){this.hideIframe();}
this.element.fire(':hidden',{event:e});if(this.pars.onHidden){this.pars.onHidden(this)}
if(this.pars.displayStateId){var o=this._displayStateCookie.getCookie()
if(!o){var o={}}
o[this.pars.displayStateId]=0
this._displayStateCookie.setData(o)}},showIframe:function(){if(this.iframe){this.iframe.style.display="block";}else{var html='<iframe class="ie6BlockerFrame" style="display:block; left:'+this.element.getStyle('left')+'; position:absolute; top:'+this.element.getStyle('top')+'; filter:progid:DXImageTransform.Microsoft.Alpha(style=0,opacity=0);" scrolling="no" src="javascript:false;" frameborder="0" height="'+parseInt(this.element.offsetHeight)+'px" width="'+parseInt(this.element.offsetWidth)+'px"></iframe>'
this.element.insert({before:html});this.iframe=this.element.previous('iframe')}
return this},hideIframe:function(){if(this.iframe){this.iframe.style.display="none";}
return this}});Df.UiCollection=Class.create(Df.Ui,{_setup:function($super){this.items=[];this.buildItems();$super()},_initPars:function($super,pars){$super()
this.setPars({collection:this});this.setPars(pars)},getItems:function(){return this.items;},getItem:function(i){return this.items[i];},showOnlyItem:function(type){var openItems=this.getShownItems()
for(var i=0;i<openItems.length;i++){openItems[i].hide();}
return this.showItem(type)},getShownItems:function(){var items=[]
for(var i=0;i<this.items.length;i++){if(this.items[i].displayStatus){items.push(this.items[i]);}}
return items},getHiddenItems:function(){var items=[]
for(var i=0;i<this.items.length;i++){if(!this.items[i].displayStatus){items.push(this.items[i]);}}
return items},getInstanceItemIndex:function(ins){var index=false
loopy:for(var i=0;i<this.items.length;i++){if(this.items[i]===ins){index=i
break loopy}}
return index},showItem:function(type){if(type.constructor==Number){return this.items[type].show();}else{return type.show();}},showItems:function(){for(var i=0;i<this.items.length;i++){if(!this.items[i].displayStatus){this.items[i].show();}}
return this},hideItem:function(index){return this.items[index].hide();},hideItems:function(){for(var i=0;i<this.items.length;i++){if(this.items[i].displayStatus){this.items[i].hide();}}
return this;},toggleItem:function(index){if(this.getItem(index).displayStatus){this.hideItem(index)}else{this.showItem(index)}
return this},toggleItems:function(){for(var i=0;i<this.items.length;i++){if(this.items[i].displayStatus){this.items[i].hide()}else{this.items[i].show()}}
return this},buildItems:function(){var elem=this.element.immediateDescendants();for(var i=0;i<elem.length;i++){if(this.pars.displayStateId){this.pars.displayStateId+='_'+i}
this.items.push(new Df.Ui($(elem[i])).set(this.pars));}}});Df.TogglePane=Class.create(Df.Ui,{_setup:function($super){this._controllerClickObserver=this.controllerClickObserver.bindAsEventListener(this)
this._controllerHoverOverObserver=this.controllerHoverOverObserver.bindAsEventListener(this)
this._controllerHoverOutObserver=this.controllerHoverOutObserver.bindAsEventListener(this)
this._paneHoverOverObserver=this.paneHoverOverObserver.bindAsEventListener(this)
this._paneHoverOutObserver=this.paneHoverOutObserver.bindAsEventListener(this)
this.element.observe(':show',this.addActiveTitleState.bind(this));this.element.observe(':hidden',this.removeActiveTitleState.bind(this));this.currentController=false
$super()
this.eventType()},_initPars:function($super,pars){$super()
this.setPars({toggleShowDelay:250,toggleHideDelay:250,activeControllerClassName:'activeController',treatAsMenu:true,controller:false,eventType:'hover'});this.setPars(pars)},addController:function(node){this.pars.controller.push(node)
var eventType=this.pars.eventType
this.eventType(false)
this.eventType(eventType)},removeController:function(node){this.pars.controller=$A(this.pars.controller).without(node)
var eventType=this.pars.eventType
this.eventType(false)
this.eventType(eventType)},eventType:function(type){if(type===this.pars.eventType){return this}else{if(type===false){this.pars.eventType=false}else if(type){this.pars.eventType=type}
if(this.pars.eventType=='hover'){this.removeClickEvent()
this.addHoverEvent()}
else if(this.pars.eventType=='click'){this.removeHoverEvent()
this.addClickEvent()}
else if(this.pars.eventType===false){this.removeHoverEvent()
this.removeClickEvent()}
return this}},addHoverEvent:function(){Object.toArray(this.pars.controller).each(function(v){v.getElement().observe('mouseover',this._controllerHoverOverObserver);v.getElement().observe('mouseout',this._controllerHoverOutObserver);}.bind(this))
if(this.pars.treatAsMenu){this.getElement().observe('mouseover',this._paneHoverOverObserver);this.getElement().observe('mouseout',this._paneHoverOutObserver);}},removeHoverEvent:function(){Object.toArray(this.pars.controller).each(function(v){v.getElement().stopObserving('mouseover',this._controllerHoverOverObserver);v.getElement().stopObserving('mouseout',this._controllerHoverOutObserver);}.bind(this))
if(this.pars.treatAsMenu){this.getElement().stopObserving('mouseover',this._paneHoverOverObserver);this.getElement().stopObserving('mouseout',this._paneHoverOutObserver);}},addClickEvent:function(){Object.toArray(this.pars.controller).each(function(v){v.getElement().observe('click',this._controllerClickObserver);}.bind(this));},removeClickEvent:function(){Object.toArray(this.pars.controller).each(function(v){v.getElement().stopObserving('click',this._controllerClickObserver);}.bind(this))},controllerClickObserver:function(e){if(this.status&&this.displayStatus){this.hideClickObserver(e)}
else if(!this.status&&!this.displayStatus){this.showClickObserver(e)}},hideClickObserver:function(e){this.hide(e)},showClickObserver:function(e){this.show(e)},controllerHoverOverObserver:function(e){if(this.currentController!=e.currentTarget){this.currentController=e.currentTarget
this.element.fire(':controllerChange',{event:e})}
Event.stop(e);this.status=true
setTimeout(this.showByStatus.bind(this,e),this.pars.toggleShowDelay)},controllerHoverOutObserver:function(e){Event.stop(e);this.status=false
setTimeout(this.hideByStatus.bind(this),this.pars.toggleHideDelay)},paneHoverOverObserver:function(e){Event.stop(e);this.status=true},paneHoverOutObserver:function(e){Event.stop(e);this.status=false
setTimeout(this.hideByStatus.bind(this),this.pars.toggleHideDelay)},removeActiveTitleState:function(e){Event.stop(e)
if(this.pars.activeControllerClassName){Object.toArray(this.pars.controller).each(function(v){v.element.removeClassName(this.pars.activeControllerClassName);}.bind(this));}
return this},addActiveTitleState:function(e){Event.stop(e)
if(this.pars.activeControllerClassName){Object.toArray(this.pars.controller).each(function(v){v.element.addClassName(this.pars.activeControllerClassName);}.bind(this));}
return this}});Df.Cookie=Class.create(Df.Base,{_setup:function($super){$super()
this._createGetters()},_initPars:function($super,pars){$super()
this.setPars({name:'df',path:false,domain:false,expires:false,data:false,onSet:false,onGet:false,onDelete:false});this.setPars(pars)},setName:function(name){this.pars.name=name
this.setCookie()
return this},setData:function(data){this.pars.data=data
this.setCookie()
return this},setPath:function(path){this.pars.path=path
this.setCookie()
return this},setDomain:function(domain){this.pars.domain=domain
this.setCookie()
return this},setExpires:function(expires){this.pars.expires=expires
this.setCookie()
return this},setCookie:function(pars){this.setPars(pars);var serial=false;if(this.pars.data.constructor==Array||this.pars.data.constructor==Object){serial=escape(Object.toJSON(this.pars.data));}else{serial=escape(this.pars.data);}
var value=this.pars.name+'='+serial+';'
if(this.pars.expires){value+=' expires='+this.pars.expires+';'}
if(this.pars.path){value+=' path='+this.pars.path+';'}
if(this.pars.domain){value+=' domain='+this.pars.domain+';'}
document.cookie=value;this.fire(':set',{cookie:this});if(this.pars.onSet){this.pars.onSet(this)}
return this;},deleteCookie:function(){var cookie_date=new Date();cookie_date.setTime(cookie_date.getTime()-1);document.cookie=this.pars.name+"=; expires="+cookie_date.toGMTString();this.fire(':delete',{cookie:this});if(this.pars.onDelete){this.pars.onDelete(this)}
return this;},getCookie:function(){var result=document.cookie.match(this.pars.name+'=(.*?)(;|$)');if(result){this.fire(':get',{cookie:this});if(this.pars.onGet){this.pars.onGet(this)}
try{return unescape(result[1]).evalJSON()}catch(e){return unescape(result[1]);}}else{return undefined;}}});Df.Scroll=Class.create(Df.Element,{_setup:function($super){this.startPointerX
this.startPointerY
this.startScrollTop
this.startScrollLeft
this.__mouseWheelObserver=this._mouseWheelObserver.bind(this)
this.__scrollContentObserver=this._scrollContentObserver.bind(this)
this.__mouseMoveObserver=this._mouseMoveObserver.bind(this)
this.__mouseDownDragObserver=this._mouseDownDragObserver.bind(this)
$super()
this.element.observe("mousewheel",this.__mouseWheelObserver);this.element.observe("DOMMouseScroll",this.__mouseWheelObserver);this.element.observe(':resize',this.adjustToContent.bind(this))
if(this.pars.moveEvent=='drag'){Event.observe(document,'mouseup',function(e){this.element.stopObserving('mousemove',this.__mouseMoveObserver)}.bind(this))
this.element.observe('click',function(e){e.stop()}.bind(this))}
this.adjustToContent()},_initPars:function($super,pars){$super()
this.setPars({onMousewheel:false,moveEvent:false,incrementPercent:.02,incrementPixel:false})
this.setPars(pars)},adjustToContent:function(e){this.element.stopObserving(':mousewheel',this.__scrollContentObserver)
this.element.stopObserving('mousedown',this.__mouseDownDragObserver)
this.element.stopObserving('mousemove',this.__mouseMoveObserver)
if(this.element.getHeight()<this.element.scrollHeight||this.element.getWidth()<this.element.scrollWidth){if(this.pars.moveEvent=='drag'){this.element.observe('mousedown',this.__mouseDownDragObserver)}
if(this.pars.moveEvent=='hover'){this.element.observe('mousemove',this.__mouseMoveObserver)}
if(this.element.getHeight()<this.element.scrollHeight){this.element.observe(':mousewheel',this.__scrollContentObserver);}}},_getIncrementY:function(){if(this.pars.incrementPixel){return this.pars.incrementPixel}else{return parseInt(this.pars.incrementPercent*this.element.scrollHeight)}},_getIncrementX:function(){if(this.pars.incrementPixel){return this.pars.incrementPixel}else{return parseInt(this.pars.incrementPercent*this.element.scrollWidth)}},incrementUp:function(){return this.moveY(this.element.scrollTop-this._getIncrementY())},incrementDown:function(){return this.moveY(this.element.scrollTop+this._getIncrementY())},incrementLeft:function(){return this.moveX(this.element.scrollLeft+this._getIncrementX())},incrementRight:function(){return this.moveX(this.element.scrollLeft-this._getIncrementX())},moveY:function(y){y=y.toRange(0,this.element.scrollHeight)
if(y!=this.element.scrollTop){this.element.scrollTop=y
this.element.fire(':scrollY',{y:y,instance:this})}
return this;},moveX:function(x){x=x.toRange(0,this.element.scrollWidth)
if(x!=this.element.scrollLeft){this.element.scrollLeft=x
this.element.fire(':scrollX',{x:x,instance:this})}
return this},zoomLeftPosition:function(e){return parseInt((this.element.getPointerX(e)/this.element.getWidth())*(this.element.scrollWidth-this.element.getWidth()));},zoomTopPosition:function(e){return parseInt((this.element.getPointerY(e)/this.element.getHeight())*(this.element.scrollHeight-this.element.getHeight()));},zoomLeftPositionDrag:function(e){return this.startScrollLeft+(this.startPointerX-this.element.getPointerX(e))},zoomTopPositionDrag:function(e){return this.startScrollTop+(this.startPointerY-this.element.getPointerY(e))},mouseWheelDelta:function(e){var delta=0;if(e.wheelDelta){delta=e.wheelDelta/120;if(window.opera)
delta=-delta;}
else if(e.detail){delta=-e.detail/3;}
return delta;},_mouseMoveObserver:function(e){e.stop()
if(this.pars.moveEvent==='hover'){this.moveY(this.zoomTopPosition(e))
this.moveX(this.zoomLeftPosition(e))}
else if(this.pars.moveEvent==='drag'){this.moveY(this.zoomTopPositionDrag(e))
this.moveX(this.zoomLeftPositionDrag(e))}},_mouseDownDragObserver:function(e){e.stop()
this.startPointerX=this.element.getPointerX(e)
this.startPointerY=this.element.getPointerY(e)
this.startScrollTop=this.element.scrollTop
this.startScrollLeft=this.element.scrollLeft
this.element.observe('mousemove',this.__mouseMoveObserver)},_mouseWheelObserver:function(e){e.stop()
this.element.fire(':mousewheel',{delta:this.mouseWheelDelta(e)});if(this.pars.onMousewheel)
this.pars.onMousewheel(this,e)},_scrollContentObserver:function(e){if(e.memo.delta>0){this.incrementUp()}
else if(e.memo.delta<0){this.incrementDown()}
return this}});Df.Transitions={linear:function(t,b,c,d){return c*t/d+b;},quadIn:function(t,b,c,d){return c*(t/=d)*t+b;},quadOut:function(t,b,c,d){return-c*(t/=d)*(t-2)+b;},quadInOut:function(t,b,c,d){if((t/=d/2)<1)return c/2*t*t+b;return-c/2*((--t)*(t-2)-1)+b;},cubicIn:function(t,b,c,d){return c*(t/=d)*t*t+b;},cubicOut:function(t,b,c,d){return c*((t=t/d-1)*t*t+1)+b;},cubicInOut:function(t,b,c,d){if((t/=d/2)<1)return c/2*t*t*t+b;return c/2*((t-=2)*t*t+2)+b;},quartIn:function(t,b,c,d){return c*(t/=d)*t*t*t+b;},quartOut:function(t,b,c,d){return-c*((t=t/d-1)*t*t*t-1)+b;},quartInOut:function(t,b,c,d){if((t/=d/2)<1)return c/2*t*t*t*t+b;return-c/2*((t-=2)*t*t*t-2)+b;},quintIn:function(t,b,c,d){return c*(t/=d)*t*t*t*t+b;},quintOut:function(t,b,c,d){return c*((t=t/d-1)*t*t*t*t+1)+b;},quintInOut:function(t,b,c,d){if((t/=d/2)<1)return c/2*t*t*t*t*t+b;return c/2*((t-=2)*t*t*t*t+2)+b;},sineIn:function(t,b,c,d){return-c*Math.cos(t/d*(Math.PI/2))+c+b;},sineOut:function(t,b,c,d){return c*Math.sin(t/d*(Math.PI/2))+b;},sineInOut:function(t,b,c,d){return-c/2*(Math.cos(Math.PI*t/d)-1)+b;},expoIn:function(t,b,c,d){return(t==0)?b:c*Math.pow(2,10*(t/d-1))+b;},expoOut:function(t,b,c,d){return(t==d)?b+c:c*(-Math.pow(2,-10*t/d)+1)+b;},expoInOut:function(t,b,c,d){if(t==0)return b;if(t==d)return b+c;if((t/=d/2)<1)return c/2*Math.pow(2,10*(t-1))+b;return c/2*(-Math.pow(2,-10*--t)+2)+b;},circIn:function(t,b,c,d){return-c*(Math.sqrt(1-(t/=d)*t)-1)+b;},circOut:function(t,b,c,d){return c*Math.sqrt(1-(t=t/d-1)*t)+b;},circInOut:function(t,b,c,d){if((t/=d/2)<1)return-c/2*(Math.sqrt(1-t*t)-1)+b;return c/2*(Math.sqrt(1-(t-=2)*t)+1)+b;},elasticIn:function(t,b,c,d,a,p){if(t==0)return b;if((t/=d)==1)return b+c;if(!p)p=d*.3;if(!a)a=1;if(a<Math.abs(c)){a=c;var s=p/4;}
else var s=p/(2*Math.PI)*Math.asin(c/a);return-(a*Math.pow(2,10*(t-=1))*Math.sin((t*d-s)*(2*Math.PI)/p))+b;},elasticOut:function(t,b,c,d,a,p){if(t==0)return b;if((t/=d)==1)return b+c;if(!p)p=d*.3;if(!a)a=1;if(a<Math.abs(c)){a=c;var s=p/4;}
else var s=p/(2*Math.PI)*Math.asin(c/a);return a*Math.pow(2,-10*t)*Math.sin((t*d-s)*(2*Math.PI)/p)+c+b;},elasticInOut:function(t,b,c,d,a,p){if(t==0)return b;if((t/=d/2)==2)return b+c;if(!p)p=d*(.3*1.5);if(!a)a=1;if(a<Math.abs(c)){a=c;var s=p/4;}
else var s=p/(2*Math.PI)*Math.asin(c/a);if(t<1)return-.5*(a*Math.pow(2,10*(t-=1))*Math.sin((t*d-s)*(2*Math.PI)/p))+b;return a*Math.pow(2,-10*(t-=1))*Math.sin((t*d-s)*(2*Math.PI)/p)*.5+c+b;},backIn:function(t,b,c,d,s){if(!s)s=1.70158;return c*(t/=d)*t*((s+1)*t-s)+b;},backOut:function(t,b,c,d,s){if(!s)s=1.70158;return c*((t=t/d-1)*t*((s+1)*t+s)+1)+b;},backInOut:function(t,b,c,d,s){if(!s)s=1.70158;if((t/=d/2)<1)return c/2*(t*t*(((s*=(1.525))+1)*t-s))+b;return c/2*((t-=2)*t*(((s*=(1.525))+1)*t+s)+2)+b;},bounceIn:function(t,b,c,d){return c-Df.Transitions.bounceOut(d-t,0,c,d)+b;},bounceOut:function(t,b,c,d){if((t/=d)<(1/2.75)){return c*(7.5625*t*t)+b;}else if(t<(2/2.75)){return c*(7.5625*(t-=(1.5/2.75))*t+.75)+b;}else if(t<(2.5/2.75)){return c*(7.5625*(t-=(2.25/2.75))*t+.9375)+b;}else{return c*(7.5625*(t-=(2.625/2.75))*t+.984375)+b;}},bounceInOut:function(t,b,c,d){if(t<d/2)return Df.Transitions.bounceIn(t*2,0,c,d)*.5+b;return Df.Transitions.bounceOut(t*2-d,0,c,d)*.5+c*.5+b;},highlight:function(t,b,c,d){if(t/d<.2){return c*t/d/.2+b}else if(t/d>.6){return c*(1-t/d)/.4+b}else{return b+c}}};Df.Animate=Class.create(Df.Element,{_setup:function($super){this.possibleSelectors=['width','height','color','left','top','fontSize','lineHeight','letterSpacing','paddingLeft','paddingRight','paddingTop','paddingBottom','marginLeft','marginRight','marginTop','marginBottom','opacity','backgroundColor','backgroundPosition','borderColor','borderWidth'];this.running=false;this.iterations=false;this.currentIteration=false;this.animators=[];this.coords=[];this.history=[];this.hpointer=0;this._timeout
$super()},_initPars:function($super,pars){$super()
this.setPars({stopBubble:[':complete',':iteration'],time:250,pause:40,skip:false,ease:Df.Transitions.linear,width:false,height:false,color:false,backgroundColor:false,borderColor:false,backgroundPosition:false,borderWidth:false,left:false,top:false,opacity:false,fontSize:false,lineHeight:false,letterSpacing:false,paddingLeft:false,paddingRight:false,paddingTop:false,paddingBottom:false,marginLeft:false,marginRight:false,marginTop:false,marginBottom:false,onComplete:false,onIteration:false,selectors:[]});this.setPars(pars)},run:function(pars,fromHistory,skip){clearTimeout(this._timeout)
this.setPars(pars);if(this.history.length==0){this.loadInitialState();this.hpointer=0;}
if(!fromHistory){this.loadState();this.hpointer=this.history.length-1}
this.createAnimators();if(this.animators.length==0&&!fromHistory){this.history.pop()
this.hpointer--}
this.setIterations();this.createCoordHash();if(this.coords.length>0){this.running=true;if(skip){this.skipToEnd.bind(this).defer()}else{this.stepThroughAnimation.bind(this).defer()}}
return this;},getPossibleSelectors:function(){return this.possibleSelectors},getHistoryCount:function(){return this.history.length;},clear:function(){this.running=false;this.animators=[];this.history=[];this.hpointer=0;this.iterations=false;this.currentIteration=false;this.coords=[];return this;},terminate:function(){running=false;coords=[];iterations=false;currentIteration=false;animators=[];return this;},pause:function(ms){this.running=false;if(ms){setTimeout(this.resume.bind(this),ms);}
return this;},resume:function(){this.running=true;this.stepThroughAnimation()
return this},back:function(pars,skip){if(this.hpointer>0){this.hpointer--;if(pars){Object.extend(this.history[this.hpointer],pars);}
this.run(false,true,skip);}},next:function(pars,skip){if((this.hpointer+1)<this.history.length){this.hpointer++;if(pars){Object.extend(this.history[this.hpointer],pars);}
this.run(false,true,skip);}},first:function(pars,skip){this.hpointer=0;if(pars){Object.extend(this.history[this.hpointer],pars);}
this.run(false,true,skip);},last:function(pars,skip){this.hpointer=this.history.length-1;if(pars){Object.extend(this.history[this.hpointer],pars);}
this.run(false,true,skip);},index:function(index,pars,skip){this.hpointer=index-1;if(pars){Object.extend(this.history[this.hpointer],pars);}
this.run(false,true,skip);},toggle:function(pars,skip){if(this.history.length==0){this.run(pars,false,skip);}
else if(this.hpointer==1){this.first(pars,skip);}
else if(this.hpointer==0){this.last(pars,skip);}},loadInitialState:function(){this.createSelectors();var copy=Object.clone(this.pars);var obj={}
for(var i=0;i<copy.selectors.length;i++){var val=this.element.getStyle(copy.selectors[i]);if(val!=undefined){obj[copy.selectors[i]]=val;}else{obj[copy.selectors[i]]=false;}}
this.history.push(Object.extend(copy,obj));},loadState:function(){this.createSelectors();this.history.push(Object.extend({},this.pars));},createSelectors:function(){this.pars.selectors.length==0
this.possibleSelectors.each(function(v){if(this.pars[v]!==false){this.pars.selectors.push(v)}}.bind(this));},createAnimators:function(){this.animators=[];for(var i=0;i<this.history[this.hpointer].selectors.length;i++){var elem=this.history[this.hpointer].selectors[i];if(this.history[this.hpointer][elem]!==false){var rawTargetValue=this.history[this.hpointer][elem]
if(rawTargetValue.constructor==Function){rawTargetValue=rawTargetValue(this);}
if(elem=='borderWidth'){if(this.element.style.borderWidth==''){this.element.style.borderWidth='0px';}}
if(elem=='borderColor'){if(this.element.getStyle('borderTopColor')!=''||this.element.getStyle('borderRightColor')!=''||this.element.getStyle('borderBottomColor')!=''||this.element.getStyle('borderLeftColor')!=''){this.element.style.borderColor=this.element.getStyle('borderTopColor');}}
var val=this.element.getStyle(elem);var currentValue=this.getCurrentValue(elem,val);var targetValue=this.getCurrentValue(elem,rawTargetValue);var units=this.getUnits(rawTargetValue);if(!units){units=this.getUnits(val);}
if(isNaN(currentValue)){if(elem=='top'||elem=='left'){currentValue=0;}}
var delta=this.getDelta(targetValue,currentValue);if(delta){this.animators.push({selector:elem,delta:delta,current:currentValue,units:units});}}}},setIterations:function(){var p=this.history[this.hpointer];if(p.pause&&p.time){this.iterations=Math.ceil(p.time/p.pause);}
else if(p.skip&&p.pause){this.iterations=Math.ceil(this.getMaxAbsVal()/p.skip);}
this.currentIteration=0;},createCoordHash:function(){this.coords=[];if(this.animators.length>0){for(var i=0;i<this.iterations;i++){this.coords.push(this.buildAnimateStep(i));}}},stepThroughAnimation:function(){clearTimeout(this._timeout)
if(this.running){try{if(this.iterations>this.currentIteration){this.element.setStyle(this.coords[this.currentIteration]);this.currentIteration++;this.fire(':iteration',{iteration:this.currentIteration,iterations:this.iterations});this.element.fire(':iteration',{iteration:this.currentIteration,iterations:this.iterations});if(this.history[this.hpointer].onIteration){this.history[this.hpointer].onIteration(this);}
this._timeout=setTimeout(this.stepThroughAnimation.bind(this),this.history[this.hpointer].pause);}else{this.running=false;this.fire(':complete',{pointer:this.hpointer});this.element.fire(':complete',{pointer:this.hpointer});if(this.history[this.hpointer].onComplete){this.history[this.hpointer].onComplete(this);}}}catch(e){}}},skipToEnd:function(){clearTimeout(this._timeout)
if(this.running){this.currentIteration=this.iterations-1
this.element.setStyle(this.coords[this.currentIteration]);this.running=false;this.fire(':complete',{pointer:this.hpointer});this.element.fire(':complete',{pointer:this.hpointer});if(this.history[this.hpointer].onComplete){this.history[this.hpointer].onComplete(this);}}},getMaxAbsVal:function(){var ary=[];for(var i=0;i<this.animators.length;i++){var val=this.animators[i].delta;if(val.constructor==Array){for(var j=0;j<val.length;j++){ary.push(Math.abs(val[j]));}}else{ary.push(Math.abs(val));}}
return ary.max();},buildAnimateStep:function(rec){var obj={}
for(var i=0;i<this.animators.length;i++){var elem=this.animators[i];var val=this.getInteratedValue(elem,rec);if(rec==(this.iterations-1)){var rawTargetValue=this.history[this.hpointer][elem.selector]
if(rawTargetValue.constructor==Function){rawTargetValue=rawTargetValue(this);}
val=this.getCurrentValue(elem.selector,rawTargetValue);}
obj[elem.selector]=this.setDisplayValue(elem.selector,val,elem.units);}
return obj;},getInteratedValue:function(elem,rec){var ease=false;if(this.history[this.hpointer].ease.constructor==Function){ease=this.history[this.hpointer].ease}else{ease=this.history[this.hpointer].ease[elem.selector]}
var val=false;if(elem.delta.constructor==Array){val=[];for(var i=0;i<elem.delta.length;i++){if(this.history[this.hpointer].pause&&this.history[this.hpointer].time){val.push(this.getEasedValueForTime(elem.current[i],rec+1,elem.delta[i],ease));}
else if(this.history[this.hpointer].pause&&this.history[this.hpointer].skip){val.push(this.plotSkipValue(elem.current[i],elem.delta[i],rec));}}}else{if(this.history[this.hpointer].pause&&this.history[this.hpointer].time){val=this.getEasedValueForTime(elem.current,rec+1,elem.delta,ease)}
else if(this.history[this.hpointer].pause&&this.history[this.hpointer].skip){val=this.plotSkipValue(elem.current,elem.delta,rec);}}
return val;},getEasedValueForTime:function(currentValue,interationStep,delta,ease){return ease(interationStep,currentValue,delta,this.iterations)},plotSkipValue:function(current,delta,rec){if(delta>0){var plot=current+((rec+1)*(this.history[this.hpointer].skip));if(plot<=current+delta){plot=plot;}else{plot=current+delta;}}else if(delta<0){var plot=current-((rec+1)*(this.history[this.hpointer].skip));if(plot>=current+delta){plot=plot;}else{plot=current+delta;}}else{var plot=0;}
return plot;},getDelta:function(targetValue,currentValue){var res=false;var keepIt=false;if(targetValue.constructor==Array|currentValue.constructor==Array){res=[];for(var i=0;i<targetValue.length;i++){var delta=targetValue[i]-currentValue[i]
if(delta){keepIt=true;}
res.push(delta);}
if(!keepIt){res=false;}}else{res=targetValue-currentValue;}
return res;},getUnits:function(val){var str=false;if(/px$/.test(val)){str='px';}else if(/%$/.test(val)){str='%';}else if(/em$/.test(val)){str='em';}
return str;},setDisplayValue:function(elem,val,units){if(elem=='width'|elem=='height'|elem=='top'|elem=='left'|elem=='fontSize'|elem=='lineHeight'|elem=='letterSpacing'|elem=='paddingLeft'|elem=='paddingRight'|elem=='paddingTop'|elem=='paddingBottom'|elem=='marginLeft'|elem=='marginRight'|elem=='margingTop'|elem=='marginBottom'|elem=='borderWidth'){val=parseInt(val);}else if(elem=='opacity'){val=val/100;}
else if(elem=='color'|elem=='backgroundColor'|elem=='borderColor'){val=this.hexFromArray(val);}
else if(elem=='backgroundPosition'){val=this.toBackgroundPositionString(val);}
if(units&&elem!='backgroundPosition'){val+=units;}
return val;},toBackgroundPositionString:function(val){str='';for(var i=0;i<val.length;i++){str+=Math.round(val[i])+'px ';}
return str;},hexFromArray:function(val){var str='#';for(var i=0;i<val.length;i++){str+=parseInt(val[i]).toColorPart();}
return str;},getCurrentValue:function(elem,val){if(elem=='width'|elem=='height'|elem=='top'|elem=='left'|elem=='fontSize'|elem=='lineHeight'|elem=='letterSpacing'|elem=='paddingLeft'|elem=='paddingRight'|elem=='paddingTop'|elem=='paddingBottom'|elem=='marginLeft'|elem=='marginRight'|elem=='marginTop'|elem=='marginBottom'|elem=='borderWidth'){val=parseInt(val);}
else if(elem=='opacity'){val=parseInt(val*100);}
else if(elem=='color'|elem=='backgroundColor'|elem=='borderColor'){val=this.toColorArray(val);}
else if(elem=='backgroundPosition'){val=this.toBackgroundPositionArray(val);}
return val;},toBackgroundPositionArray:function(val){val=val.split(' ');for(var i=0;i<val.length;i++){val[i]=parseInt(val[i])}
return val},toColorArray:function(val){if(/^#/.test(val)){val=val.replace(/^#/g,'').replace(/(..)/g,"$1,").replace(/,$/g,'').split(',');for(var i=0;i<val.length;i++){if(val[i].constructor==String){val[i]=parseInt(val[i],16);}
val[i]=Number(val[i])}}else if(/^rgb/.test(val)){val=val.replace(/^rgb\(|\)$/g,'').split(',');for(var i=0;i<val.length;i++){if(val[i].indexOf(')')>-1){val[i]=Number(val[i].substr(0,val[i].indexOf(')')));}else{val[i]=Number(val[i]);}}}
return val}});Df.Animate.toggleBy=function(element,action,pars){var animate=new Df.Animate(element,pars);if(action=='click'){element.observe('click',function(e){animate.toggle()}.bind(animate));}else if(action=='hover'){element.observe('mouseover',function(e){animate.toggle()}.bind(animate));element.observe('mouseout',function(e){animate.toggle()}.bind(animate));}
return animate;}
Df.Drag=Class.create(Df.Element,{_setup:function($super){this._offsetX
this._offsetY
this._curX
this._curY
this._followIt=this.followIt.bindAsEventListener(this)
this._startIt=this.startIt.bindAsEventListener(this)
this._stopIt=this.stopIt.bindAsEventListener(this)
$super()},_initPars:function($super,pars){$super()
this.setPars({dirX:true,dirY:true,onStart:false,onDrag:false,onDragX:false,onDragY:false,onStop:false,onEnable:false,onDisable:false,dragElement:false});this.setPars(pars)},enable:function(pars){this.setPars(pars)
this.element.fire(':enable');this.fire(':enable');if(this.pars.onEnable){this.pars.onEnable(this)}
if(this.pars.dragElement){this.element.select(this.pars.dragElement).each(function(v){Event.observe(v,'mousedown',this._startIt);}.bind(this));}else{Event.observe(this.element,'mousedown',this._startIt);}
return this},disable:function(pars){this.setPars(pars)
this.element.fire(':disable');this.fire(':disable');if(this.pars.onDisable){this.pars.onDisable(this)}
if(this.pars.dragElement){this.element.select(this.pars.dragElement).each(function(v){Event.stopObserving(v,'mousedown',this._startIt);}.bind(this));}else{Event.stopObserving(this.element,'mousedown',this._startIt);}
return this},startIt:function(e){Event.observe(document.body,'mousemove',this._followIt);Event.observe(document.body,'mouseup',this._stopIt);this._offsetX=this.offsetX(e);this._offsetY=this.offsetY(e);this.element.fire(':start',{e:e})
this.fire(':start',{e:e})
if(this.pars.onStart){this.pars.onStart(this,e)}
return this},offsetX:function(e){return Event.pointerX(e)-this.getElement().positionedOffset().left},offsetY:function(e){return Event.pointerY(e)-this.getElement().positionedOffset().top},stopIt:function(e){Event.stop(e);Event.stopObserving(document.body,'mousemove',this._followIt)
Event.stopObserving(document.body,'mouseup',this._stopIt)
if(this.pars.onStop){this.pars.onStop(this,e)}
this.element.fire(':stop',{e:e})
this.fire(':stop',{e:e})
return this},followIt:function(e){Event.stop(e);if(this.pars.dirX){this.dirX(e)}
if(this.pars.dirY){this.dirY(e)}
if(this.pars.onDrag){this.pars.onDrag(this,e)}
this.element.fire(':drag',{e:e})
this.fire(':drag',{e:e})
return this},dirX:function(e){this._curX=Event.pointerX(e)-this._offsetX;if(this.pars.dirX.min||this.pars.dirX.min==0){this.minDirX(e)}
if(this.pars.dirX.max||this.pars.dirX.max==0){this.maxDirX(e)}
this.element.style.left=this._curX+'px'
if(this.pars.onDragX){this.pars.onDragX(this,e)}
this.element.fire(':dragX',{e:e})
this.fire(':dragX',{e:e})},minDirX:function(e){if(this._curX<this.pars.dirX.min){this._curX=this.pars.dirX.min}},maxDirX:function(e){if(this._curX>this.pars.dirX.max){this._curX=this.pars.dirX.max}},dirY:function(e){this._curY=Event.pointerY(e)-this._offsetY
if(this.pars.dirY.min||this.pars.dirY.min==0){this.minDirY(e)}
if(this.pars.dirY.max||this.pars.dirY.max==0){this.maxDirY(e)}
this.element.style.top=this._curY+'px'
if(this.pars.onDragY){this.pars.onDragY(this,e)}
this.element.fire(':dragY',{e:e})
this.fire(':dragY',{e:e})},minDirY:function(e){if(this._curY<this.pars.dirY.min){this._curY=this.pars.dirY.min}},maxDirY:function(e){if(this._curY>this.pars.dirY.max){this._curY=this.pars.dirY.max}}});Df.Resize=Class.create(Df.Drag,{_setup:function($super){delete this.pars.dragElement
this._curH
this._curW
this._pointerX
this._pointerY
this._sizeHeight=false
this._sizeWidth=false
this._startH
this._startW
this._startL
this._startT
this._followCursor=this.followCursor.bindAsEventListener(this)
$super()},_initPars:function($super,pars){$super()
this.setPars({hitDepth:20,dirH:true,dirT:true,dirB:true,dirW:true,dirL:true,dirR:true,onSizeHeight:false,onSizeWidth:false,onSize:false});this.setPars(pars)},enable:function(pars){this.setPars(pars)
this.element.fire(':enable');this.fire(':enable');if(this.pars.onEnable){this.pars.onEnable(this)}
Event.observe(this.element,'mousemove',this._followCursor);Event.observe(this.element,'mousedown',this._startIt);return this},disable:function(pars){this.setPars(pars)
this.element.style.cursor='auto'
this.element.fire(':disable');this.fire(':disable');if(this.pars.onDisable){this.pars.onDisable(this)}
Event.stopObserving(this.element,'mousemove',this._followCursor);Event.stopObserving(this.element,'mousedown',this._startIt);return this},followCursor:function(e){this._pointerX=this.element.getPointerX(e)
this._pointerY=this.element.getPointerY(e)
if(this._pointerY<=this.pars.hitDepth){this._sizeHeight='top'}else if(this._pointerY>=this.element.getHeight()-this.pars.hitDepth){this._sizeHeight='bottom'}else{this._sizeHeight=false}
if(this.element.getWidth()<=this.pars.hitDepth){if(this.pars.dirR){this._sizeWidth='right'}}
else if(this._pointerX<=this.pars.hitDepth){this._sizeWidth='left'}else if(this._pointerX>=this.element.getWidth()-this.pars.hitDepth){this._sizeWidth='right'}else{this._sizeWidth=false}
if(this._sizeWidth!==false&&this._sizeHeight!==false){if(this._sizeWidth=='left'&&this._sizeHeight=='top'){if(this.pars.dirW&&this.pars.dirL&&this.pars.dirH&&this.pars.dirT){this.element.style.cursor='nw-resize'}
else if(this.pars.dirW&&this.pars.dirL){this.element.style.cursor='w-resize'}
else if(this.pars.dirH&&this.pars.dirT){this.element.style.cursor='n-resize'}
else{this.element.style.cursor='auto'}}
else if(this._sizeWidth=='left'&&this._sizeHeight=='bottom'){if(this.pars.dirW&&this.pars.dirL&&this.pars.dirH&&this.pars.dirB){this.element.style.cursor='sw-resize'}
else if(this.pars.dirW&&this.pars.dirL){this.element.style.cursor='w-resize'}
else if(this.pars.dirH&&this.pars.dirB){this.element.style.cursor='s-resize'}
else{this.element.style.cursor='auto'}}
if(this._sizeWidth=='right'&&this._sizeHeight=='top'){if(this.pars.dirW&&this.pars.dirR&&this.pars.dirH&&this.pars.dirT){this.element.style.cursor='ne-resize'}
else if(this.pars.dirW&&this.pars.dirR){this.element.style.cursor='e-resize'}
else if(this.pars.dirH&&this.pars.dirT){this.element.style.cursor='n-resize'}
else{this.element.style.cursor='auto'}}
else if(this._sizeWidth=='right'&&this._sizeHeight=='bottom'){if(this.pars.dirW&&this.pars.dirR&&this.pars.dirH&&this.pars.dirB){this.element.style.cursor='se-resize'}
else if(this.pars.dirW&&this.pars.dirR){this.element.style.cursor='e-resize'}
else if(this.pars.dirH&&this.pars.dirB){this.element.style.cursor='s-resize'}
else{this.element.style.cursor='auto'}}
else{this.element.style.cursor='auto'}}
else if(this._sizeWidth==false&&this._sizeHeight!==false){if(this._sizeHeight=='top'&&this.pars.dirH&&this.pars.dirT){this.element.style.cursor='n-resize'}
else if(this._sizeHeight=='bottom'&&this.pars.dirH&&this.pars.dirB){this.element.style.cursor='s-resize'}
else{this.element.style.cursor='auto'}}
else if(this._sizeWidth!==false&&this._sizeHeight==false){if(this._sizeWidth=='left'&&this.pars.dirW&&this.pars.dirL){this.element.style.cursor='w-resize'}
else if(this._sizeWidth=='right'&&this.pars.dirW&&this.pars.dirR){this.element.style.cursor='e-resize'}
else{this.element.style.cursor='auto'}}
else{this.element.style.cursor='auto'}},startIt:function(e){if(this.element.style.cursor=='auto')
{return;}
Event.stop(e);Event.stopObserving(this.element,'mousemove',this._followCursor);this._offsetX=this.offsetX(e)
this._offsetY=this.offsetY(e)
this._startH=this.element.getHeight()
this._startW=this.element.getWidth()
this._startL=parseInt(this.element.getStyle('left'))
this._startT=parseInt(this.element.getStyle('top'))
this._curX=Event.pointerX(e)-this._offsetX
this._curY=Event.pointerY(e)-this._offsetY
if(this._sizeHeight||this._sizeWidth){Event.observe(document.body,'mousemove',this._followIt);Event.observe(document.body,'mouseup',this._stopIt);}
if(this.pars.onStart){this.pars.onStart(this,e)}
this.element.fire(':start',{e:e})
this.fire(':start',{e:e})
return this},stopIt:function($super,e){$super(e)
Event.observe(this.element,'mousemove',this._followCursor);return this},followIt:function($super,e){Event.stop(e);if(this.pars.dirH&&this._sizeHeight){if(this._sizeHeight=='top'&&this.pars.dirT){this.dirY(e)}
this.dirH(e)}
if(this.pars.dirW&&this._sizeWidth){if(this._sizeWidth=='left'&&this.pars.dirL){this.dirX(e)}
this.dirW(e)}
if(this.pars.onSize){this.pars.onSize(this,e)}
this.element.fire(':size',{e:e})
this.fire(':size',{e:e})
return this},dirH:function(e){if(this._sizeHeight=='top'&&this.pars.dirT){this._curH=this._startH+(this._startT-this._curY)}else if(this._sizeHeight=='bottom'&&this.pars.dirB){this._curH=this.element.getPointerY(e)+(this._startH-this._pointerY)}
if(this._curH<0){this._curH=0;}
this.element.style.height=this._curH+'px'
if(this.pars.onSizeHeight){this.pars.onSizeHeight(this,e)}
this.element.fire(':sizeHeight',{e:e})
this.fire(':sizeHeight',{e:e})},dirW:function(e){if(this._sizeWidth=='left'&&this.pars.dirL){this._curW=this._startW+(this._startL-this._curX)}else if(this._sizeWidth=='right'&&this.pars.dirR){this._curW=this.element.getPointerX(e)+(this._startW-this._pointerX)}
if(this._curW<0){this._curW=0;}
this.element.style.width=this._curW+'px'
if(this.pars.onSizeWidth){this.pars.onSizeWidth(this,e)}
this.element.fire(':sizeWidth',{e:e})
this.fire(':sizeWidth',{e:e})}});Df.DictionaryCollection=Class.create(Df.Event,{initialize:function(ary){this.ary=ary||[]},'get':function(){return this.ary},'set':function(ary){this.ary=ary
return this},'push':function(hash){this.ary.push(hash)
return this},'splice':function(index,howmany){this.ary.splice(index,howmany)
return this},keys:function(){return $H(this.ary[0]).keys()},extend:function(ary){this.ary=this.ary.concat(ary)
return this},getBy:function(filters){return Df.DictionaryCollection.getRecordsByAttributes(this.ary,filters)},getByGroups:function(attributes){if(Object.isUndefined(attributes)){attributes=this.keys()}
return Df.DictionaryCollection.groupRecordsByAttributes(this.ary,attributes)},getAttributeValues:function(attribute){return Df.DictionaryCollection.getAttributeValues(this.ary,attribute)}})
Df.DictionaryCollection.getAttributeValues=function(records,attribute){var h=[]
var l=records.length
for(var i=0;i<l;i++){if(!h.include(records[i][attribute])){h.push(records[i][attribute])}}
return h}
Df.DictionaryCollection.groupRecordsByAttributes=function(records,attributes){var h={}
var l=records.length
for(var i=0;i<l;i++){for(p in records[i]){if(Object.toArray(attributes).include(p)){if(Object.isUndefined(h[p])){h[p]=[]}
if(h[p].find(function(v){if(this.par==v[0]){v[1].push(this.rec)
return true}else{return false}}.bind({par:records[i][p],rec:records[i]}))){}else{h[p].push([records[i][p],[records[i]]])}}}}
return h}
Df.DictionaryCollection.getRecordsByAttributes=function(records,filters){return records.findAll(function(v){var test=true
for(var p in filters){if(!Object.toArray(filters[p]).include(v[p])){test=false}}
return test})}
Df.XMLDocument=Class.create({initialize:function(string){this.document
if(string){this.load(string)}
return this},load:function(string){try{this.document=new DOMParser().parseFromString(string,"text/xml")
return this}catch(e){try{this.document=new ActiveXObject("Microsoft.XMLDOM")
this.document.async="false"
this.document.loadXML(string)
return this}catch(e){return false}}},getRoot:function(){return $XML(this.document.firstChild)},xpath:function(exp){try{var nodes=this.document.evaluate(exp,this.document,null,XPathResult.ANY_TYPE,null)
var a=[]
var r=nodes.iterateNext()
while(r){a.push(r)
r=nodes.iterateNext()}
return a}catch(e){try{this.document.setProperty("SelectionLanguage","XPath")
return this.document.selectNodes(exp)}catch(e){return false}}},getNodeValue:function(exp){var node=this.xpath(exp)
if(node&&node.length>0&&node[0].childNodes.length>0)
return node[0].childNodes[0].nodeValue;return false;}})
Df.XMLNode={_df_extended:true,remove:function(){this.parentNode.removeChild(this)
return this},childElements:function(){var a=[]
for(var i=0;i<this.childNodes.length;i++){if(this.childNodes[i].nodeType==1)
a.push($XML(this.childNodes[i]))}
return $A(a)},previousSiblings:function(){function previous(node){if(node.nodeType==1){a.push(node)}
if(node.previousSibling){next(node.previousSibling)}}
var a=[]
if(this.previousSibling)
previous(this.previousSibling)
return $A(a)},previous:function(){var s=this.previousSiblings()
if(s.length>0)
return s[0]
else
return null},nextSiblings:function(){function next(node){if(node.nodeType==1){a.push(node)}
if(node.nextSibling){next(node.nextSibling)}}
var a=[]
if(this.nextSibling)
next(this.nextSibling)
return $A(a)},next:function(){var s=this.nextSiblings()
if(s.length>0)
return s[0]
else
return null},down:function(){if(this.childElements().length>0)
return this.childElements()[0]
else
return null},up:function(){return $XML(this.parentNode)},getValue:function(){return $XML(this).childNodes[0].nodeValue;}}
var $XML=function(node){if(Object.isUndefined(node._df_extended)){Object.extend(node,Df.XMLNode)}
return node}
Df.AjaxCacheManager=Class.create(Df.Base,{_setup:function($super){this._loadSuccessObserver=this.loadSuccessObserver.bind(this)
this.observe(':LoadSuccess',this._loadSuccessObserver)
$super()
this._createGetters()
this._createSetters()},_initPars:function($super,pars){$super()
this.setPars({ajaxRequestOptions:{},serviceBaseUrl:'',cacheInstance:$H(),uri:'uri'})
this.setPars(pars)},'get':function(uri){if(this.getCacheInstance().get(uri)){this.fireSelectionEvent(uri)}else{this.callService(uri)}
return this},fireSelectionEvent:function(uri){this.fire(':ItemSelection',{object:this.getCacheInstance().get(uri)})},loadSuccessObserver:function(e){var json=e.memo.transport.responseText.evalJSON()
this.getCacheInstance().set(json.uri,json)
this.fireSelectionEvent(json.uri)},uriFormatter:function(uri){var u={}
u[this.getUri()]=uri
return u},callService:function(uri){var opts={onSuccess:function(transport){this.fire(':LoadSuccess',{transport:transport})}.bind(this),onFailure:function(transport,e){this.fire(':LoadFailure',{transport:transport,error:e})}.bind(this),onException:function(transport,e){this.fire(':LoadException',{transport:transport,exception:e})}.bind(this)}
Object.extend(opts,this.getAjaxRequestOptions())
if(opts.parameters&&this.getUri()){Object.extend(opts.parameters,this.uriFormatter(uri))}
new Ajax.Request(this.getServiceBaseUrl(),opts);}})
Df.Anchor={rewriteHandler:function(e){if(e.target.tagName.toLowerCase()=="a"){if(e.target.rel.match(/^redir:/)){e.stop();var url={q:[]}
var parts=e.target.href.split(/\?|\#/)
url.d=parts.shift()
while(parts.length>0){var p=parts.shift()
if(p.indexOf('=')>-1)
url.q=p.split('&')
else
url.h=p}
parts=e.target.rel.replace('redir:','').split('|')
while(parts.length>0){var p=parts.shift()
if(p.indexOf('p+')>-1)
url.q.push(p.replace('p+',''))
else if(p.indexOf('p-')>-1)
url.q=$A(url.q).without(p.replace('p-',''))
else if(p.indexOf('h+')>-1)
url.h=p.replace('h+','')
else if(p.indexOf('h-')>-1)
url.h=false}
var newLocation=url.d
if(url.q.length>0)newLocation+='?'+url.q.join('&')
if(url.h)newLocation+='#'+url.h
window.location=newLocation}}}}
Df.console={log:function(){return;},debug:function(){return;},info:function(){return;},warn:function(){return;},error:function(){return;},dir:function(){return;}}
Df.ClassAnimator=Class.create({initialize:function(element,selector,pars){this.selector=selector;this.CSSClassNameConversionTable={width:'width',height:'height',color:'color',left:'left',top:'top',fontsize:'fontSize',lineheight:'lineHeight',letterspacing:'letterSpacing',paddingleft:'paddingLeft',paddingright:'paddingRight',paddingtop:'paddingTop',paddingbottom:'paddingBottom',marginleft:'marginLeft',marginright:'marginRight',margintop:'marginTop',marginbottom:'marginBottom',opacity:'opacity',backgroundcolor:'backgroundColor',backgroundposition:'backgroundPosition'}
this.pars=this._getCSSPars(this.selector);if(pars){this.setPars(pars);}
this.animate=new Df.Animate(element,this.pars);},_getCSSPars:function(){var pars={};var obj=this;var sheets=document.styleSheets;$A(sheets).each(function(sheet,index){var rules=sheet.rules?sheet.rules:sheet.cssRules;$A(rules).each(function(rule,index){if(rule.selectorText==obj.selector){for(property in obj.CSSClassNameConversionTable){var val=rule.style[obj.CSSClassNameConversionTable[property]];if(val){pars[obj.CSSClassNameConversionTable[property]]=val;}}}});});return pars;},setPars:function(pars){Object.extend(this.pars,pars);},run:function(){this.animate.run();},toggle:function(){this.animate.toggle();}});
/* nav v2.0 */
if("object"==typeof(Prototype)){
Df.nav=Class.create({
	initialize:function(el,p){
		this.el=!Object.isElement(el)?$(el):el;
		this.stat=false;
		this.p={
			animate:{effect:'fade',duration:300},/* {effect:fade,duraton:300}|false */
			pause:{close:100,open:200},
			aClass:'active',/* Active Class Name */
			eventType:'hover',/* hover|click */
			onShow:false,
			onHide:false,
			child: 'UL' /* Child CSS */
		};
		if(Prototype.Browser.ie6)this.p.pause.open=(this.p.pause.open-50);
		if('object'==typeof(p))Object.extend(this.p,p);
		if(Object.isElement(this.el)){
			var s=1;
			this.el.childElements().each(function(l){
				var sub=l.select(this.p.child);
				if(0<sub.length){
				sub.each(function(c){if(!c.id)c.writeAttribute('id',this.el.id+'_child'+s);c.hide();s++;}.bind(this));//generate id's
				switch(this.p.eventType){
					case 'click':
						l.observe('click',function(e){this.on(e,l,false);}.bind(this));
					break;
					case 'hover':
					default:
						var lk=l.select('a')[0];
						if('#'==lk.getAttribute('href'))lk.observe('click',function(e){e.stop();if(this.stat)this.off(e,l,true);else this.on(e,l,true);}.bind(this));
						l.observe('mouseover',function(e){this.on(e,l,false);}.bind(this));
						l.observe('mouseout',function(e){this.off(e,l,false);}.bind(this));
					break;
				}
				}else{
					l.observe('mouseover',function(e){l.addClassName(this.p.aClass);}.bind(this));
					l.observe('mouseout',function(e){l.removeClassName(this.p.aClass);}.bind(this));
				}
			}.bind(this));
		}
	},
	
	/* show */
	on:function(e,l,now){
		e.stop();
		this.stat=true;
		if(this.p.aClass)l.addClassName(this.p.aClass);
		if('click'==this.p.eventType||now)this.wOn(e,l);else setTimeout(function(e){this.wOn(e,l)}.bind(this),this.p.pause.open);
	},
	
	/* hide */
	off:function(e,l,now){
		e.stop();
		this.stat=false;
		if(this.p.aClass)l.removeClassName(this.p.aClass);
		if('click'==this.p.eventType||now){this.wOff(e,l);}else{this.hold=true;setTimeout(function(e){this.wOff(e,l);this.hold=false;}.bind(this),this.p.pause.close);}
	},
	
	/* x clear */
	xcl:function(e,l){
		var el=l.select(this.p.child)[0];
		this.el.childElements().each(function(l){l.select(this.p.child).each(function(rm){if(el.id!=rm.id)this.fOff(e,l);}.bind(this));}.bind(this));
	},
	
	/* wait to show */
	wOn:function(e,l){
		if(true==this.hold)return false;
		var el=l.select(this.p.child)[0];
		var animate=(this.p.animate?new Df.Animate(el).setPars({time:this.p.animate.duration}):false)
		if(Object.isElement(el)&&(this.stat&&'none'==el.getStyle('display'))){
			if('click'==this.p.eventType){
				el.stopObserving('click');
				Event.observe(document,'click',function(e){this.wOff(e,l)}.bind(this));
			}
			if(animate){
				switch(this.p.animate.effect){
					case 'fade':
						el.setStyle({opacity:0,display:'block'});
						animate.run({opacity:1,onComplete:function(){if('function'==typeof(this.p.onShow))this.p.onShow();}.bind(this)});
					break;				
				}
			}else{
				el.setStyle({display:'block'});
				if('function'==typeof(this.p.onShow))this.p.onShow();
			}
			this.xcl(e,l);
			if(Prototype.Browser.ie6)this.ie6up(el);
		}
	},
	
	/* wait to hide */
	wOff:function(e,l){
		var el=l.select(this.p.child)[0];
		var animate=(this.p.animate?new Df.Animate(el).setPars({time:this.p.animate.duration}):false)
		if('click'==this.p.eventType)this.stat=false;
		if(Object.isElement(el)&&!this.stat){
			if('click'==this.p.eventType)Event.stopObserving(document,'click');
			if(Prototype.Browser.ie6)this.ie6down(el);
			if(animate){
				switch(this.p.animate.effect){
					case 'fade':
						animate.run({opacity:.3,onComplete:function(){this.fOff(e,l);if('function'==typeof(this.p.onHide))this.p.onHide();}.bind(this)});
					break;					
				}
			}else{this.fOff(e,l);if('function'==typeof(this.p.onHide))this.p.onHide();}
		}		
	},
	
	/* final hide */
	fOff:function(e,l){
		var el=l.select(this.p.child)[0];
		if(this.p.aClass)l.removeClassName(this.p.aClass);
		el.hide();
	},
	
	/* generate the iFrame for IE6 */
	ie6up:function(el){
		var selects=$$('select');
		if(selects)selects.each(function(sel){sel.hide();});
	},
	
	/* remove the iFrame for IE6 */
	ie6down:function(el){
		var selects=$$('select');
		if(selects)selects.each(function(sel){sel.show();});
	}
});
/* auto init start // $$('.DfNavigation').each(function(n){new Df.nav(n);}); // auto init end */
}

/* -- */
else{throw "Df.nav.js requires Prototype 1.6.1 or higher";}
// show/hide navigation for the logo nav.

Event.observe(window,'load',function(e) {
    var isIE = new RegExp('MSIE (\\d+\\.\\d+);').test(navigator.userAgent); //tests if browser is IE	
    var ieversion = null;
    var isOpen = null;

    if (isIE) {
        ieversion=new Number(RegExp.$1); //check for the version number.
    }

    function addCloseListener() {
        $(document.body).observe('click', closeWindow);
    }

    function noObserve(){
        $(document.body).stopObserving('click', closeWindow); 
        isOpen = false;
    }

    function linkCheck() {
        var pBlk = this.up(2).readAttribute('class');	
        if (pBlk == 'global-dropdown') {
            closeWindow();
            noObserve();
        }
    }

    function closeWindow(e) {
        if (isOpen == true) {
            $('global-dropdown').hide();
			if($('logohover')){
            $('logohover').setAttribute("id", "logo");
			}
            $(document.body).stopObserving('click', closeWindow);
            isOpen = false;
        }
    }

    function toggleDropdown(e) {
        if(isOpen == false) {
            $('global-dropdown').show();
			if($('logo')){
            $('logo').setAttribute("id", "logohover");
			}
			if($('global-dropdown').visible() == true) {
                isOpen = true;
                if(isIE && ieversion<6) {
                } else {
                    addCloseListener.delay(0.1);
                }
            }
        }else if(isOpen == true) {
            closeWindow();
        }
    }

    if($('global-dropdown')) {
        $('global-dropdown').select('a').each(function(lnk) {
            lnk.onclick = function (){
                closeWindow();
                noObserve();
            }
        });
        //gets rid of the hide class, which interferes with prototype's show/hide.
        $('global-dropdown').removeClassName('hide');
        $('global-dropdown').hide();
        isOpen = false;
        $('logo').onclick = function() {
            toggleDropdown();
        }

        $('globalmenudrop').onmouseover = function() {
			if($('logo')){
            $('logo').setAttribute("id", "logohover");
			}
            toggleDropdown();
        }

		$('globalmenudrop').onmouseout = function() {
            $('global-dropdown').hide();
			if($('logohover')){
				$('logohover').setAttribute("id", "logo");
			}
			 closeWindow();
        }
    }
	if ($('shop-nav')){
		if($('parametric-filter')){
			$$('li.lvl2').each(function(sw){
				sw.observe('mouseover', function(){
					$('parametric-filter').select('select').each(function(el){el.setStyle({display:"none"})});					
				});
				sw.observe('mouseout', function(){
					$('parametric-filter').select('select').each(function(el){el.setStyle({display:""})});					
				});
			});
		}
	}
});
if("object"==typeof(Prototype)){

// added string trimming support to native js
String.prototype.trim = function() {
	return this.replace(/^\s+|\s+$/g,'');
}
String.prototype.ltrim = function() {
	return this.replace(/^\s+/,'');
}
String.prototype.rtrim = function() {
	return this.replace(/\s+$/,'');
}

var Timberland=Class.create({
	initialize:function(p){
		/* init parameters */
		this.p={
			sbt:'Search',/* Search Box Text */
			sbterr:'Keyword please...?',
			srcherr:0,
			sb:'id-header-search',/* Search Box */
			frm:'header-search',
			nav:false,/* Dropdown navigation */
			tabs:{id:'',sel:0},
			eventType:'hover',
			preload:false
		};
  		if(p)Object.extend(this.p,p);
  		this.srchfocused=false;
  		/* init Events */
  		if('object'==typeof(this.p.preload))this.prld(this.p.preload);
  		Event.observe(window,'load',function(e){
	  		if(Object.isElement($(this.p.sb))){
	  			$(this.p.sb).observe('focus',this.sbf.bindAsEventListener(this));
	  			$(this.p.sb).observe('blur',function(e){this.srchfocused=false;}.bind(this));
	  			if(this.p.sbt)$(this.p.sb).value=($(this.p.sb).value!=this.p.sbt?this.p.sbt:$(this.p.sb).value);
	  		}
	  		this.p.nav.each(function(n){this.nav(n.id,n.pars);}.bind(this));
	  		this.tabs();
	  		var link=$('read-reviews-link');
	  		if(link)link.observe('click',this.readReviews.bindAsEventListener(this));
	  		if(Object.isElement($(this.p.frm)))$(this.p.frm).observe('submit',this.sfc.bindAsEventListener(this));
  		}.bind(this));
  		
  		return this;	
	},
	
	/* Search From Check */
	sfc:function(e){
		e.stop();
		var sb=$(this.p.sb);
		if(!Object.isElement(sb))return false;
		
		if(this.p.sbt){
			if(sb.value.trim().toLowerCase()==this.p.sbt.toLowerCase()||sb.value.trim()==''||sb.value.trim().toLowerCase()==this.p.sbterr.toLowerCase()){
				if(sb.value==this.p.sbterr){
					sb.value='';
					this.p.srcherr=false;
					sb.focus();
				}else{
					if(false!==this.p.srcherr)this.p.srcherr++;
					if(this.p.srcherr>=3){
						var wasval=sb.value;
						sb.value=this.p.sbterr;
						setTimeout(function(){if(false==this.srchfocused)sb.value=wasval;}.bind(this),2000); 
						this.p.srcherr=false;
					}
				}
				return false;
			}else{$(this.p.frm).submit();}
		}else{
			if(sb.value==''){
				sb.focus();
			}else{
				$(this.p.frm).submit();
			}
		}
		
	},
	
	/* Clear Search Box */
	csb:function(e){
		if(Object.isElement($(this.p.sb))&&($(this.p.sb).value==this.p.sbt||$(this.p.sb).value==this.p.sbterr))
			$(this.p.sb).value='';
	},
	
	/* Search Box Focus */
	sbf:function(e){
		this.srchfocused=true;
		this.csb(e);
	},
	
	/* Dropdown Navigation */
	nav:function(id,p){
		if(Object.isElement($(id))&&'function'==typeof(Df.nav))
			new Df.nav(id,p);
	},
	
	/* Initialize Tabs */
	tabs:function(){
		if(Object.isElement($(this.p.tabs.id))&&'function'==typeof(Df.Tabset)){
			this.tabset=new Df.Tabset($(this.p.tabs.id),{animate:{time:200,opacity:1}});
			this.tabset.showItem(this.p.tabs.sel);
		}
	},
	
	/* Preload images */
	prld:function(imgs){
		imgs.each(function(i){var img=new Image();img.src=i;});
	},
	
	readReviews:function(e){
		e.stop();
		$$('#info-nav dt').each(function(tb,c){
			if('customer-reviews-tab'==tb.id){
				this.tabset.showItem(c);
				this.tabset.updateTabsetHeight(tb);
				throw $break;
			}
		}.bind(this));
		$('customer-reviews-tab').scrollTo('read-reviews-link');
	}
});
}
/* -- */
else{throw "Timberland.js requires Prototype 1.6.1 or higher";}
/* --- Df.Modal - Example of usage:
- For best results, attach to href. Example: <a href="Javascript:modal.open({});>
- Options for scrolling on iFrame: scrolling: 'true'
- Options for close Button: closeButton: 'yes' OR closeButton: 'withScroll' (to be used with scrollbars for different styling). 
*/
if('object'==typeof(Prototype)&&'object'==typeof(Df)){
Df.Modal=Class.create({
	initialize:function(p){
  		this.p={
			dialog:{
				className:'modal-dialog',
		    	animate:{speed:300},/* false or {speed:300}*/
		    	width:'550px', /* false or '550px' */
		    	height:'400px' /* false or '400px' */
			},
			modal:{
				className:'modal-bg',
			    clickToClose:true,
			    animate:{speed:300},/* false or {speed:300}*/
			    styles:{
					backgroundColor:'#000000',
					opacity:.5
				},
				closeElement:false,
				loader:new Element('div').setStyle({opacity:.7}).addClassName('loader')
			}
		};
		this.wdim=document.viewport.getDimensions();
		this._modal=false;
  		if('object'==typeof(p)){
  			if(p.dialog)Object.extend(this.p.dialog,p.dialog);
  			if(p.modal)Object.extend(this.p.modal,p.modal);
  		}
  	},
  	
  	/* Set parameter */
  	params:function(p){
  		if(p)Object.extend(this.p,p);
  		return this;
  	},
  	
  	/* Set dialog data */
  	setData:function(d){
  		this._opened.update(d);
  	},
  	
  	/* Alias of setData */
  	setContent:function(d){
  		this.setData(d);
  	},
  	
  	/* Set timeout to close the dialog */
  	timeout:function(tm){
  		setTimeout(function(e){this.close();}.bind(this),tm);
  	},
  	
  	/* Sensitive: if set to true will close modal when scrolling */
  	sensitive:function(flag){
  		if(true==flag){
  			Event.stopObserving(window,'scroll');
  			Event.observe(window,'scroll',function(){
	    		this.close();
	    	}.bind(this));
  		}else{
  			Event.stopObserving(window,'scroll');
  			Event.observe(window,'scroll',function(){
	    		this._posm();
	    		this._repos();
	    	}.bind(this));
  		}
  	},
  	
  	/* Force: Disallows user to close modal by clicking outside the box */
  	force:function(flag){
  		if(false==flag){
  			this.forceMode=false;
  			this._modal.stopObserving('click');
  			this._modal.observe('click', function(e){this.close();}.bind(this));
  		} else {
  			this.forceMode=true;
  			this._modal.stopObserving('click');
  		}
  	},

    /* Resize modal window */
    resize:function(dims){
    	if('object'==typeof(dims)){
	    	this.wdim=document.viewport.getDimensions();
	    	var borderw=parseInt(this._opened.getStyle('border-width'))*2;
	    	var pos={left:Math.round((this.wdim.width/2)-(parseInt(dims.width)/2)),top:Math.round((this.wdim.height/2)-(parseInt(dims.height)/2))};
	    	if(this.wdim.width<=(dims.width+borderw))pos.left=0;
	    	if(this.wdim.height<=(dims.height+borderw))pos.top=0;
			if('function'==typeof(Df.Animate)&&false!=this.p.dialog.animate){
	    	new Df.Animate(this._opened).setPars({time:this.p.dialog.animate.speed,onComplete:function(){if('function'==typeof(dims.onComplete))dims.onComplete();}}).run({left:pos.left,top:pos.top,width:dims.width,height:dims.height});
	    	if(false!=this.p.dialog.url)new Df.Animate($('externaliframe')).setPars({time:this.p.dialog.animate.speed}).run({width:dims.width,height:dims.height});
	    	}else{
	    		this._opened.setStyle({left:pos.left,top:pos.top,width:dims.width,height:dims.height});if('function'==typeof(dims.onComplete))dims.onComplete();
	    		if(false!=this.p.dialog.url)$('externaliframe').setStyle({width:dims.width,height:dims.height});
	    	}
	    	return this;
    	}else if('fullscreen'==dims){
    		this.fullScreen(true);
    	}else if('normalscreen'==dims){
    		this.fullScreen(false);
    	}
    },
    
    /* Full Screen */
    fullScreen:function(flag){
    	if(!this._opened)return false;
    	var borderw=parseInt(this._opened.getStyle('border-width'))*2;
    	if(false==flag){
    		if(!this.fscreen)return false;
    		this.fscreen=false;
    		ddim=this.prevdims;
    		ddim.width=(ddim.width+borderw);
    		ddim.height=(ddim.height+borderw);
    		this.resize(ddim);
    		this.prevdims=false;
    	}else{
    		if(true==this.fscreen)return false;
    		this.fscreen=true;
    		this.prevdims=this._opened.getDimensions();
    		ddim=document.viewport.getDimensions();
    		ddim.width=(ddim.width-borderw);
    		ddim.height=(ddim.height-borderw);
    		this.resize(ddim);
    	}
    },
    
    /* Toggles fullscreen on or off*/
    fullScreenOnOff:function(){
    	if(this.fscreen)this.fullScreen(false); else this.fullScreen(true);
    },

	/* Hide modal window */
    close:function(){
    	if(!this._opened)return false;
    	if('function'==typeof(Df.Animate)&&false!=this.p.modal.animate)
    	new Df.Animate(this._modal).setPars({time:this.p.modal.animate.speed,onComplete:function(){this._modal.hide();}.bind(this)}).run({opacity:0});
   		else this._modal.hide();
   		if(!this._opened.id)this._opened.remove();else this._opened.hide();
   		this._opened=false;
   		if(Prototype.Browser.ie6||Prototype.Browser.ie7)this._ieFix(false);
   		Event.stopObserving(window,'scroll');
    	Event.stopObserving(window,'resize');
    	
    	if(this.frame)Event.stopObserving(this.frame,'keyup',this._keyup);    	
    	Event.stopObserving(document,'keyup',this._keyup);
    },
    
    /* Loading */
    loading:function(el){
    	var cover=new Element('div',{id:'modal-loader-cover'}).setStyle({position:'absolute',top:'0px',left:'0px',backgroundColor:'#000000',width:this._opened.getStyle('width'),height:this._opened.getStyle('height'),opacity:.3});
    	this._opened.insert({bottom:cover});
    	if(Object.isElement(el)){
    		cover.insert({bottom:el});
    		el.setStyle({top:Math.round((parseInt(this._opened.getStyle('height'))/2)-(parseInt(el.getStyle('height'))/2))+'px',left:Math.round((parseInt(this._opened.getStyle('width'))/2)-(parseInt(el.getStyle('width'))/2))+'px'});
    	}else if(Object.isElement(this.p.modal.loader)){
    		cover.insert({bottom:this.p.modal.loader});
    		this.p.modal.loader.setStyle({top:Math.round((parseInt(this._opened.getStyle('height'))/2)-(parseInt(this.p.modal.loader.getStyle('height'))/2))+'px',left:Math.round((parseInt(this._opened.getStyle('width'))/2)-(parseInt(this.p.modal.loader.getStyle('width'))/2))+'px'});
    	}
    },
    
    /* Loaded */
    loaded:function(){
    	if($('modal-loader-cover'))$('modal-loader-cover').remove();
    },
    
	/* Make dialog box */
   	open:function(opt){
   		if('object'!=typeof(opt))return false;
   		this._bg();
   		this._opened=false;
   		if(!opt.id){
   			if(!this._opened)this._opened=this._mknbox();
   		}else{
   			this._opened=$(opt.id);
   		}
   		this._opened.setStyle({display:'block',position:'fixed',zIndex:9999,top:'0px',left:'0px',opacity:0});
   		if(opt.title)this._opened.update(new Element('h1').update(opt.title));
    	if(opt.content)this._opened.insert({bottom:new Element('p').update(opt.content)});
   		if(opt.className)this._opened.addClassName(opt.className);
   		opt.scrolling=(opt.scrolling?'yes':'no');
		var scrollbarset = opt.scrolling;
		if(scrollbarset == 'yes' && /Firefox[\/\s](\d+\.\d+)/.test(navigator.userAgent)){scrollbarset = 'auto';};
		if(scrollbarset == 'yes' && /MSIE (\d+\.\d+);/.test(navigator.userAgent)){
			var ieHeight = opt.height.toString();
			var ieWidth = opt.width.toString();
			if(opt.width)this._opened.setStyle({width:(parseInt(ieWidth.substring(0, (ieWidth.length -2)))+4)+'px'});
			if(opt.height)this._opened.setStyle({height:(parseInt(ieHeight.substring(0, (ieHeight.length -2)))+2)+'px'});
		}else{
			if(opt.width)this._opened.setStyle({width:opt.width});
			if(opt.height)this._opened.setStyle({height:opt.height});
   		}
		this._pos();
   		if('function'==typeof(Df.Animate)&&false!=this.p.dialog.animate){
        	if(false!=this.p.modal.animate)
        	setTimeout(function(){new Df.Animate(this._opened).setPars({time:this.p.dialog.animate.speed}).run({opacity:1});}.bind(this), this.p.modal.animate.speed);
    		else new Df.Animate(this._opened).setPars({time:this.p.dialog.animate.speed}).run({opacity:1});
   		}else{
    		this._opened.setStyle({opacity:1,display:'block'});
    	}
   		if(false!=opt.url){
    		this._opened.innerHTML='';
    		this.iframe=new Element('iframe',{
									className:'externaliframe',
									id:'externaliframe',
									scrolling:scrollbarset,
									src:opt.url,
									frameborder:0,
									height:this._opened.getStyle('height'),
									width:this._opened.getStyle('width')
									}).setStyle({display:'block',top:'0px',left:'0px',position:'absolute'});
    		this._opened.update(this.iframe);
			this.loading(false);
			this.iframe.observe('load',function(e){this.loaded();}.bind(this));
    	}
		if(opt.closeButton == 'withScroll')this._opened.insert('<a href="Javascript:parent.modal.close();" class="close" id="modal-close-withscroll"><span class="hide">close</span></a>');
		if(opt.closeButton == 'yes')this._opened.insert('<a href="Javascript:parent.modal.close();" class="close" id="modal-close-noscroll"><span class="hide">close</span></a>'); 		
    	/*if(this.iframe){ commenting this out as this is setting a default for ie7 there by causing access denied error for iframe
    		this.frame=(Prototype.Browser.IE?this.iframe.contentWindow.document:this.iframe.contentDocument.defaultView);
    		Event.observe(this.frame,'keyup',this._keyup.bindAsEventListener(this));
    	}*/
    	Event.observe(document,'keyup',this._keyup.bindAsEventListener(this));
    	if(Prototype.Browser.ie6||Prototype.Browser.ie7)this._ieFix(true);
    },
    
    /* Keypress listener: close or resize on escape */
    _keyup:function(e){
    	if(this.fscreen&&Event.KEY_ESC==e.keyCode)this.fullScreen(false);
    	else if(Event.KEY_ESC==e.keyCode&&!this.forceMode)this.close();
    },
    
	/* Make background */
	_bg:function(){
		this._modal=$('id-modal-bg');
		var wdim=document.viewport.getDimensions();
		var o=(Prototype.Browser.ie6?document.viewport.getScrollOffsets():{left:0,top:0});
	    if(!this._modal){
		    this._modal=new Element('div',{id:'id-modal-bg'}).setStyle({position:'fixed',zIndex:9000,top:o.top+'px',left:o.left+'px',width:wdim.width+'px',height:wdim.height+'px',display:'block',opacity:0});
		    if('object'==typeof(this.p.modal.styles))this._modal.setStyle(this.p.modal.styles);
			$(document.body).insert({top:this._modal});
			if(this.p.modal.clickToClose)this._modal.observe('click', function(e){this.close();}.bind(this));
			if(this.p.modal.className)this._modal.addClassName(this.p.modal.className);
		}else{
			this._modal.setStyle({width:wdim.width+'px',height:wdim.height+'px'});
		}
		
		if('function'==typeof(Df.Animate)&&false!=this.p.modal.animate){
    		if(!this.p.modal.styles.opacity)this.p.modal.styles.opacity=.5;
    		this._modal.setStyle({display:'block',opacity:0});
    		new Df.Animate(this._modal).setPars({time:this.p.modal.animate.speed}).run({opacity:this.p.modal.styles.opacity});
   		}else{
    		this._modal.open();
    	}
    	//Event.observe(window,'resize',function(){this._resize();}.bind(this));this was causing js error in all the light boxes in ie
    },
    
    /* Make new dialog box */
    _mknbox:function(){
    	var dialog=new Element('div');
    	dialog.setStyle({backgroundColor:'#FFFFFF',width:this.p.dialog.width,height:this.p.dialog.height});
    	$(document.body).insert({top:dialog});
    	return dialog;
    },

	/* Position dialog */
    _pos:function(){
		var ddim=this._opened.getDimensions();
		var wdim=document.viewport.getDimensions();
		var pos={left:Math.round((wdim.width/2)-(ddim.width/2)),top:Math.round((wdim.height/2)-(ddim.height/2))};
		pos.left=(ddim.width>wdim.width?0:pos.left);
		pos.top=(ddim.height>wdim.height?0:pos.top);
		if(Prototype.Browser.ie6&&(pos.top==0||pos.left==0))pos=document.viewport.getScrollOffsets();
		this._opened.setStyle({left:pos.left+'px',top:pos.top+'px'});
    },
    
    /* Reposition dialog */
    _repos:function(){
    	var ddim=this._opened.getDimensions();
    	var wdim=document.viewport.getDimensions();
    	var o=(Prototype.Browser.ie6?document.viewport.getScrollOffsets():{left:0,top:0});
		var pos={left:Math.round(o.left+((wdim.width/2)-(ddim.width/2))),top:Math.round(o.top+((wdim.height/2)-(ddim.height/2)))};
		pos.left=(ddim.width>wdim.width?0:pos.left);
		pos.top=(ddim.height>wdim.height?0:pos.top);
		this._opened.setStyle({left:pos.left+'px',top:pos.top+'px'});
    },
    
    /* Resize dialog */
    _resize:function(){
    	var ddim=this._opened.getDimensions();
    	var wdim=document.viewport.getDimensions();
    	this._modal.setStyle({width:wdim.width+'px',height:wdim.height+'px'});
    	var borderw=parseInt(this._opened.getStyle('border-width'))*2;
    	if(this.fscreen){
    		ddim=wdim;	
    		ddim.width=(ddim.width-borderw);
    		ddim.height=(ddim.height-borderw);
    		this._opened.setStyle({width:ddim.width+'px',height:ddim.height+'px'});
    	}else if(this.prevdims){
    		ddim=this.prevdims;
    		ddim.width=(ddim.width+borderw);
    		ddim.height=(ddim.height+borderw);
    		this._opened.setStyle({width:ddim.width+'px',height:ddim.height+'px'});
    	}
    	if(this.iframe){
    		if(!this.fscreen&&!this.prevdims){
	    		ddim.width=(ddim.width-borderw);
	    		ddim.height=(ddim.height-borderw);
	    	}
    		this.iframe.setStyle({width:ddim.width+'px',height:ddim.height+'px'});
    	}
    	this._repos();
    },
    
    /* Position modal background */
    _posm:function(){
		var o=(Prototype.Browser.ie6?document.viewport.getScrollOffsets():{left:0,top:0});
		this._modal.setStyle({left:o.left+'px',top:o.top+'px'});
		if(Prototype.Browser.ie6)$('boycott-ie6-already').setStyle({left:o.left+'px',top:o.top+'px'});
    },
    
    /* It's about time to... */
    _ieFix:function(t){
    	if(true==t){
    		if(Prototype.Browser.ie6){
	    		this._opened.setStyle({position:'absolute'});
	    		this._modal.setStyle({position:'absolute'});
	    		$(document.body).insert({bottom:new Element('iframe',{
										className:'ie6again',
										id:'boycott-ie6-already',
										scrolling:'no',
										src:'javascript:false;',
										frameborder:0,
										height:this.wdim.height+'px',
										width:this.wdim.width+'px'
										}).setStyle({display:'block',top:'0px',left:'0px',position:'absolute',filter:'progid:DXImageTransform.Microsoft.Alpha(style=0,opacity=0)'})
				});
		    	Event.observe(window,'scroll',function(){
		    		this._posm();
		    		this._repos();
		    	}.bind(this));
	    	}
	    	if((Prototype.Browser.ie6||Prototype.Browser.ie7)&&!Df.Modal._ie6dialogcopy){
	    		var copy=Element.clone(this._opened,true);
	        	this._opened.remove();
	        	$(document.body).insert({top:copy});
	        	this._opened=copy;
	        	Df.Modal._ie6dialogcopy=true;
	    	}
    	}else{
    		if(Prototype.Browser.ie6){
    			$('boycott-ie6-already').remove();
    			Event.stopObserving(window,'scroll');
    		}
    	}
    }
});
}

else{throw "Df.Modal.js requires prototype.js and Df.js to be loaded.";}
// JavaScript Document
if (Object.isUndefined(ess))
    var ess = {};

ess.LTrim = function(value) {
    var re = /^\s*/;
    return value.replace(re, '');
}
ess.RTrim = function(value) {
    var re = /\s*$/;
    return value.replace(re, '');
}
ess.trim = function(value) {
    return ess.LTrim(ess.RTrim(value));
}

ess.showCustomPopUp = function(thisUrl,thisName,theseParams){
    remote = open(thisUrl, thisName, theseParams);
};

ess.emailSignup = function(form) {
    if (!ess.isEmpty(form) && !ess.isEmpty(form.action) && !ess.isEmpty(form.emailAddress) && !ess.isEmpty(form.emailAddress.value)) {
        /* alert('===== ess.emailSignup =====' + '\nform.action = ' + form.action + '\nform.emailAddress.value = ' + form.emailAddress.value + '\n\nForm.serialize(form) = ' + Form.serialize(form)); */
        new Ajax.Request(form.action, {
            method: 'post',
            postBody: Form.serialize(form) + '&ajax=true',
            // parameters: 'emailAddress='+form.emailAddress.value,
            onLoading: function(e) {
                $('sign-up').addClassName('hidden');
                $('sign-up-loader').removeClassName('hidden');
            },
            onComplete: function(e) {
                if (e.status == 200)
                {
                    //console.log(e.responseText);
                    if (null != e.responseText.match(/<!-- success -->/i)) {
                        $('sign-up-loader').addClassName('hidden');
                        $('sign-up-success').removeClassName('hidden');
                        /* alert('*** about to fire em:signup ***'); */
                        $(document).fire("em:signup");
                        /* alert('*** after firing em:signup ***'); */
                    } else {
                        $('sign-up-loader').addClassName('hidden');
                        $('sign-up').removeClassName('hidden');
                        alert(ess.trim(e.responseText));
                    }
                }
                else
                {
                    $('sign-up-loader').addClassName('hidden');
                    $('sign-up').removeClassName('hidden');
                    alert('We are sorry, an error occurred while processing your request.');
                }
            },
            on403: function(e, m) {
                /* TODO: if exception occurs we need to perform redirect to login page! */
                /* debugging: */ console.log('::::: request to :::::\n' + form.action + '\n::::: caught in on403 :::::' + '\n\ne = ' + e + '\n\nm = ' + m);
            },
            onException: function(e, m) {
                /* if exception occurs just swallow it */
                /* debugging: */ console.log('::::: request to :::::\n' + form.action + '\n::::: caught in onException :::::' + '\n\ne = ' + e + '\n\nm = ' + m);
            },
            onError: function(e, m) {
                /* if error occurs just swallow it */
                /* debugging: */ console.log('::::: request to :::::\n' + form.action + '\n::::: caught in onError :::::' + '\n\ne = ' + e + '\n\nm = ' + m);
            },
            onFailure: function (e, m) {
                /* debugging: */ console.log('::::: request to :::::\n' + form.action + '\n::::: caught in onFailure :::::' + '\n\ne = ' + e + '\n\nm = ' + m);
            }
        });
        return false;
    }
};

/* 
 * Global navigation sub-category columns height fix 
 * 
 * @param holderClassName Class name of the element which height is being referenced
 * @param columnClassName Class name of columns which height is being adjusted
 * @param offset Offset value to increase/decrease the column height relative to the holder height
 */
function setColumnHeight(holderClassName, columnClassName, offset) {
    $$('.'+holderClassName).each(function(holder) {
         
        // Get computed height of sub-category holder
        var holderHeight = holder.getHeight();
        
        // Apply height to columns within holder
        holder.select('.'+columnClassName).each(function(column) {
            column.setStyle({
                height: (holderHeight+offset) + 'px'
            });
        });
    });
}

/*
 * Dom:loaded Events
 */
$(document).observe('dom:loaded', function(e){
    /* Init dropnav */
    $$('.df-dropnav').each(function(v){
        v.dropnav();
    });
    
    /* Global navigation sub-category columns height fix */
    setColumnHeight('subcat-holder', 'col', -50);

	 /* Email Sign-up */
     var addEmailAddress = $('add-email-address');
     if (addEmailAddress) {
         $(addEmailAddress).observe('click', function(event) {
             $('sign-up-success').addClassName('hidden');
             $('sign-up').removeClassName('hidden');
         });
     }							
});

ess.createTabs = function(tabId) {
    if (!$(tabId)) {
        return;
    }

    var pars = {
        hideClassName: "inactive",
        showClassName: "active"
    };

    try {
        var tabs = new Df.Tabset(tabId, pars);
        var items = tabs.getItems();
        for (var i = 0; i < items.length; i++) {
            items[i].getElement().addClassName(pars.hideClassName);
        }
        tabs.showItem(0);
    } catch(err) {}
};
ess.isEmpty = function(val) {
    if (typeof val == "undefined") {
        return true;
    }
    if (val == undefined || val == null) {
        return true;
    }
    if (typeof val == "string") {
        return val.length == 0 || val == "null" || val == "undefined" || val == "false";
    }
    return false;
};
ess.validateEmail = function(name) {
    var regEx = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    var elemenet = $(name);
    return elemenet && !ess.isEmpty(elemenet.getValue()) && elemenet.getValue().match(regEx);
};

ess.previewEmailWishlist = function(url){
    var customerEmailAddress = $('customerEmailAddress').value;
    var recipientEmailAddress = $('recipientEmailAddress').value;
    var customerName = $('customerName').value;
    var message = $('message').value;
    $H({customerEmailAddress: customerEmailAddress, recipientEmailAddress: recipientEmailAddress, customerName: customerName, message: message}).toQueryString()
    // var previewUrl = url + '&customerEmailAddress=' + customerEmailAddress + '&recipientEmailAddress=' + recipientEmailAddress + '&customerName=' + customerName + '&message=' + message;
    var previewUrl = url + '?' + $H({customerEmailAddress: customerEmailAddress, recipientEmailAddress: recipientEmailAddress, customerName: customerName, message: message}).toQueryString();
    ess.showCustomPopUp(previewUrl, 'previewemailwishlist','width=580,height=550,toolbar=no,status=no,menubar=no,scrollbars=yes,resizable=no');
};

String.prototype.decimalAsciiToRegEx=function(chars){
	var decimalToOctal=function(num){
		num=parseInt(num);
		var str=new String();str=num;
		return str.toString(8);
	}
	if("object"!=typeof(this))return false;
	var regex='';
	if("object"==typeof(chars)&&"string"==typeof(chars.range)){
		chars.range.split(',').each(function(r){
			r=r.split('-');
			for(i=r[0];i<=r[1];i++){
				regex+="\\"+decimalToOctal(i)+'|';
			}
		});
	}else{
		if("string"==typeof(chars))chars=chars.split(",");
		chars.each(function(ch){
			if("string"==typeof(ch)||"number"==typeof(ch)){
				regex+="\\"+decimalToOctal(ch)+'|';
			}else if("object"==typeof(ch)){
				if("string"==typeof(ch.range)){
					ch.range.split(',').each(function(r){
						r=r.split('-');
						if(r[0]&&r[1]){
							for(i=r[0];i<=r[1];i++){regex+="\\"+decimalToOctal(i)+'|';}
						}
					});
				}
			}
		});
	}
	regex=regex.slice(0,-1);
	return (regex?new RegExp(regex,"g"):false);
}
String.prototype.removeAscii=function(chars){
	var regex=this.decimalAsciiToRegEx(chars);
	return (regex?new String(this.replace(regex,'')):this);
};
String.prototype.matchAscii=function(chars){
	var regex=this.decimalAsciiToRegEx(chars);
	var matches=(regex?this.match(regex):false);
	return (matches?matches.uniq():false);
};
if (Object.isUndefined(ess)) {
    var ess = {};
}

ess.swatches = {};
ess.swatches.products = {};

ess.swatches.init = function(options) {
    options = options || { switchOnEvent: "mouseover", preventEventPropagation: false };
    var products = $$(".products li");
    for (var i = 0; i < products.length; i++) {
        var product = products[i];
        var productId = product.identify().replace("product-", "");
        var productObject = ess.swatches.products[productId];

        if (!productObject) {
            continue;
        }

        var colors = product.select(".colors li a");
		
		function switchHighlight(eventTarget){
                    //parentNode spam is because of IE
				var getSiblings = eventTarget.parentNode.parentNode.parentNode.select('li');
			for (var col = 0; col < getSiblings.length; col++) {
				if (getSiblings[col].hasClassName('active-swatch'))
					getSiblings[col].removeClassName('active-swatch');
			}
			eventTarget.parentNode.parentNode.addClassName('active-swatch');

		};

        for (var j = 0; j < colors.length; j++) {
            var color = colors[j];
            var colorId = color.identify().replace("color-" + productId + "-", "");
            var colorObject = productObject.colors[colorId];

            if (!colorObject) {
                continue;
            }

            if ($$(".family-category")) {
                color.observe("click", function (e) {
                    var colorHref = this.colorElement.rel;
                    var imageType = this.colorElement.classNames().toArray()[0] || 'T240x240';
                    var imageSource = this.colorObject.images[imageType] || 'images/no-image-v150.gif';
					switchHighlight(e.target);
                    this.productElement.select(".product-photo").each(function(photoAnchor) { photoAnchor.href = colorHref; });
                    this.productElement.select(".product-title a").each(function(titleAnchor) { titleAnchor.href = colorHref; });
                    this.productElement.select(".product-photo img").each(function(photoImage) { photoImage.src = imageSource; });
                    Event.stop(e);
                }.bind({colorElement: color, productElement: product, colorObject: colorObject}));
            } else {
                color.observe(options['switchOnEvent'], function (e) {
                    var colorHref = this.colorElement.rel;
                    var imageType = this.colorElement.classNames().toArray()[0] || 'ENH-VAR';
                    var imageSource = this.colorObject.images[imageType] || 'images/no-image-v150.gif';
                    this.productElement.select(".photo").each(function(photoAnchor) { photoAnchor.href = colorHref; });
                    this.productElement.select(".fn a").each(function(titleAnchor) { titleAnchor.href = colorHref; });
                    this.productElement.select(".photo img").each(function(photoImage) { photoImage.src = imageSource; });
                    if (options['preventEventPropagation']) {
                        Event.stop(e);
                    }
                }.bind({colorElement: color, productElement: product, colorObject: colorObject}));
            }
        }
    }
};

document.observe("dom:loaded", function(e) {
    ess.swatches.init({ switchOnEvent: "click", preventEventPropagation: true });
    // for 'mouseover', see default options for ess.swatches.ini
});

// JavaScript Document
if (Object.isUndefined(store))
	var store = {};
	
// This is to ensure that helpdesk links open in a new window on each click regardless of if the user doesn't close the first window
var helpdeskCount = 0;

store.popup = {};

store.popup.height = 630;
store.popup.width = 530;

store.popup.standard = "width=" + store.popup.width + ",height=" + store.popup.height
	+ ",toolbar=no,status=no,menubar=no";
store.popup.helpDesk = function(url) {
	helpdeskCount += 1;
	var helpdeskName = "helpdesk" + helpdeskCount;
	window.open(url, helpdeskName, store.popup.standard + ",scrollbars=yes,resizable=yes");
};
store.popup.promo = function(url) {
	window.open(url, "promo", "width=480,height=350,left=380,top=160,toolbar=no,status=no,menubar=no,resizable=no,scrollbars=yes");
};
store.popup.emailFriend = function(productId) {		//Gets productID from HTML button's name attribute.
	window.open("/emailAProduct/index.jsp?id="+productId, "emailFriend", store.popup.standard + ",scrollbars=no,resizable=yes");
};
store.popup.customemailFriend = function (productId, recipe) {
            window.open("/emailAProduct/index.jsp?id="+productId+"&recipe="+recipe+"", "emailFriend", store.popup.standard + ",scrollbars=no,resizable=yes");
};
store.popup.emailSignup = function(url) {
	window.open(url, "emailFriend", store.popup.standard + ",scrollbars=no,resizable=yes");
};
store.popup.sizeChart = function(url) {
	window.open(url, "sizeChart", "width=640,height=555,left=380,top=160,toolbar=no,status=no,menubar=no,scrollbars=no,resizable=no");
};
store.popup.giftCert = function(url) {
	window.open(url, "giftCert", store.popup.standard + ",directories=no,location=no,resizable=no,scrollbars=yes,left=((screen.width- 500)/2),top=((screen.height - 500)/2)");
};
store.popup.largeImage = function(url) {
	window.open(url, "largeImage", "width=630,height=750,scrollbars=yes,left=((screen.width- 500)/2),top=((screen.height - 500)/2)");
};
store.popup.webCollage = function(url) {
	window.open(url, "webCollage", "width=630,height=545,scrollbars=yes");
};

store.popup.chkBalance = function(url) {
    //window.open( url, "giftCard-lightbox", store.popup.standard + ",scrollbars=no,resizable=yes, width=550,height=auto" );
};
store.popup.resize = function() {
	// default values are for firefox
	var width = store.popup.width;
	var height = store.popup.height;
	if (Prototype.Browser.IE) {
		width += 21;
	}
	if (Prototype.Browser.WebKit) {
		width -= 8;
	}
	window.resizeTo(width, height);
};

/**
 * Transforms links that have a rel attribute to JavaScript links. This is done
 * so that people with JavaScript off will still be able to use links.
 */
store.popup.transform = function() {
	// select all links whose rel attribute contains "popup"
	var links = $$("a[href*=popup]");
	for (var i = 0; i < links.length; i++) {
		var link = links[i];
		link.oldHref = link.href;
		if (link.href.indexOf("helpdesk") >= 0) {
			link.observe("click", function(e) {
				e.preventDefault();
				store.popup.helpDesk(this.oldHref);
			});
			link.href = "javascript:void(0);";
		}
		if (link.href.indexOf("promo") >= 0) {
			link.observe("click", function(e) {
				e.preventDefault();
				store.popup.promo(this.oldHref);
			});
			link.href = "javascript:void(0);";
		}
		if (link.href.indexOf("email") >= 0) {
			link.observe("click", function(e) {
				e.preventDefault();
				store.popup.emailFriend(this.oldHref);
			});
			link.href = "javascript:void(0);";
		}
		if (link.href.indexOf("sizechart") >= 0) {
			link.observe("click", function(e) {
				e.preventDefault();
				store.popup.sizeChart(this.oldHref);
			});
			link.href = "javascript:void(0);";
		}
		if (link.href.indexOf("signup") >= 0) {
			link.observe("click", function(e) {
				e.preventDefault();
				store.popup.emailSignup(this.oldHref);
			});
			link.href = "javascript:void(0);";
		}
		if (link.href.indexOf("web-collage") >= 0) {
			link.observe("click", function(e) {
				e.preventDefault();
				store.popup.webCollage(this.oldHref);
			});
			link.href = "javascript:void(0);";
		}
	}
	
	links = $$("#shopFooter3 li:nth-child(3) a");	//Target third footer nav link "Check You Balance"
	//TODO: Better solution to work for instead of using for loop for gettin only one element.
	
	for (var i = 0; i < links.length; i++){
		var link = links[i];
		link.oldHref = link.href;
		if (link.href.indexOf("checkGCBalance") >= 0) {
			link.observe("click", function(e){
				e.preventDefault();
				//store.popup.chkBalance(this.oldHref);
				modal.open( {
					url: '/checkout/checkGCBalance.jsp',
					closeButton: 'withScroll',
					width: '570px',
					height: '465px',
					scrolling: 'yes'
				} );return false;
			});
		}
		link.href = "javascript:void(0);";			
	}
};

$(document).observe("dom:loaded", function(e) {
	store.popup.transform();
	if($("email-a-friend")){ //always always always! wrap listeners in an if statement.
		$("email-a-friend").observe("click", function(){store.popup.emailFriend($("email-a-friend").name)
			Df.AnalyticsLibrary.EmailAProduct();
		});
	}
});

function checklength(val)
{
	if(val.length == 0) return false;
	for(var j=val.length;j > 0;j--)
	{
		if(val.charAt(j-1) != ' ')
		{
			return true;
		}
	}
	return false;
}

function emailCheck(val)
{
var EmailOk  = true
var Temp     = val;
var AtSym    = Temp.indexOf('@')
var Period   = Temp.lastIndexOf('.')
var Space    = Temp.indexOf(' ')
var Length   = Temp.length - 1   // Array is from 0 to length-1

	if ((AtSym < 1) ||                 // '@' cannot be in first position
    (Period <= AtSym+1) ||             // Must be atleast one valid char btwn '@' and '.'
    (Period == Length ) ||             // Must be atleast one valid char after '.'
    (Space  != -1))                    // No empty spaces permitted
 	{
    	  return false;
 	}
   	return true;
}					

function valForm(frm)
{
	if(!emailCheck(frm.emailAddress.value))
	{
		alert("Please enter a valid email address.");
		if(!document.layers) frm.emailAddress.style.backgroundColor='yellow';
		frm.emailAddress.focus();
		return false;
	}
	return true;
}

document.observe("dom:loaded", function(e) {
  var emailsignup = $("sign-up");
   if (emailsignup) {
    emailsignup.onsubmit = function() {
      return verifyFields();
    };
  }
});

function ValidateEmail(field, alerttxt) {
	with (field) {
	apos=value.indexOf("@");
	dotpos=value.lastIndexOf(".");
	if (apos < 1 || dotpos-apos < 2)
	{
	alert(alerttxt);return false;}
	else {return true;}
	}
	}

function validateFirstName(){

}

function ValidateEmail(field, alerttxt) {
	with (field) {
	apos=value.indexOf("@");
	dotpos=value.lastIndexOf(".");
	if (apos < 1 || dotpos-apos < 2)
	{
	alert(alerttxt);return false;}
	else {return true;}
	}
	}


function verifyFields() {
 var alertText="";
 var emailReg = "^[\\w-_\.]*[\\w-_\.]\@[\\w]\.+[\\w]+[\\w]$";
 var ele = $("emailAddress");
  if (!ess.validateEmail(ele.identify())) {

  alertText += "Please Enter Correct Email Address \r\n";
    //alert("Please Enter Correct Email Address");
    //ele.focus();
	ele.value="";
	//return false;
  }
     ele = $("gender1","gender2");
	if (!ele[0].checked && !ele[1].checked){
	   //alert("Please Select Gender");
	   alertText += "Please Select Gender \r\n";
	   //return false;
   }


  var fnameReg = /^[a-zA-Z ]+$/;
  var ele = $("firstName");
  if (ele && !ele.present()) {
    //alert("Please Enter Your First Name");
    //ele.focus();
	//return false;
	alertText += "Please Enter Your First Name \r\n";
	} else
  if (!fnameReg.test(ele.value) ) {
	//alert("Please Enter Valid First Name");
	//ele.focus();
	ele.value="";
	alertText += "Please Enter Valid First Name \r\n";
	//return false;
	}

  var lnameReg = /^[a-zA-Z ]+$/;
  var ele = $("lastName");
  if (ele && !ele.present()) {
    //alert("Please Enter Your Last Name");
    //ele.focus();
    alertText += "Please Enter Your Last Name \r\n";
	//return false;
  } else
  if (!lnameReg.test(ele.value) ) {
	//alert("Please Enter Your Last Name");
	//ele.focus();
	ele.value="";
	alertText += "Please Enter Valid Last Name \r\n";
	//return false;
	}

   ele = $("country");
  if (ele.value=="-1"){
   //alert("Please Select Country");
   alertText += "Please Select Country \r\n";
   //return false;
   }

  var zipReg = /^[0-9a-zA-Z\-\. ]+$/;
  var ele = $("zipCode");
  if (ele && !ele.present()){
   //alert("Please Enter Zip Code");
   alertText += "Please Enter Zip Code \r\n";
   //return false;
   } else
     if (!zipReg.test(ele.value) ) {
	//alert("Please Enter Zip Code");
	//ele.focus();
	ele.value="";
	alertText += "Please Enter Valid Zip Code \r\n";
	//return false;
	}
  var add1Reg = /^[0-9a-zA-Z\-\#\,\. ]+$/;
  var ele = $("address1");

    if (ele.value!="" && !add1Reg.test(ele.value) ) {
	//alert("Please enter Your Address1");
	//ele.focus();
	ele.value="";
	alertText += "Please Enter Valid Address 1 \r\n";
	//return false;
	}
	var add2Reg = /^[0-9a-zA-Z\-\#\,\. ]+$/;
  var ele = $("address2");

    if (ele.value!="" && !add2Reg.test(ele.value) ) {
	//alert("Please enter Your Address2");
	//ele.focus();
	ele.value="";
	alertText += "Please Enter Valid Address 2 \r\n";
	//return false;
	}

  var cityReg = /^[a-zA-Z ]+$/;
  var ele = $("city");

    if (ele.value!="" && !cityReg.test(ele.value) ) {
	//alert("Please enter Your City");
	//ele.focus();
	ele.value="";
	alertText += "Please Enter Valid City \r\n";
	//return false;
	}
  var stateReg = /^[a-zA-Z ]+$/;
  var ele = $("state");

    if (ele.value!="" && !stateReg.test(ele.value) ) {
	//alert("Please enter Your State");
	//ele.focus();
	ele.value="";
	alertText += "Please Enter Valid State \r\n";
	//return false;
	}

   //var eleCountry = $("country");
   var elePromo = $("sendEmailUpdates");
   
   if(elePromo){
	   if(elePromo.checked == false){
	   	alertText +="Marketing policy checkbox must be accepted in order to sign up for emails";
	   }
   }
   
    if(alertText !=""){
		alert(alertText);
		return false;
	}  
  
  return true; 

   }
    
 function change(){
var a = document.getElementById('country');
var b=document.getElementById('sendEmailUpdates');
if(a.value=='US'||a.value=="UK"){
b.checked=true;
}
else
b.checked=false;
}

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
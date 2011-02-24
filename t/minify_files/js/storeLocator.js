$(document).observe('dom:loaded', function(e){
	Event.observe(document.body, 'mousemove', Loader.follow);
	storeLocator.vars.mapControler = 'controls'
	storeLocator.map.setup('map')

	$('searchBtn').observe('click', function(e){
	    storeLocator.updateMap()
	});
})

Df.TickSlider = Class.create(Df.Drag,{

	initialize: function($super, element, pars){
	$super(element, pars)

	this._offsetX
	this._offsetY
	this._curX
	this._curY
	this.tickValue = 0;
	this.getPosition = 0;

	this._followIt = this.followIt.bindAsEventListener(this)
	this._startIt = this.startIt.bindAsEventListener(this)
	this._stopIt = this.stopIt.bindAsEventListener(this)

	return this
}});

Df.Ticker = function(obj, para){

	obj = $(obj)

	var paraObj = {
		onStop: false,
		currentValue:0
	}

	Object.extend(paraObj,para)

	var marker = obj.e('div').addClassName('marker')

	var dirX = {min:new Number(0),max:parseInt(obj.offsetWidth)-parseInt(marker.offsetWidth)}

	var inc = new Df.Drag(marker, {
		onDrag:function(event){
			var minPos = 0
			var maxPos = parseInt(obj.offsetWidth)- parseInt(marker.offsetWidth)

			var curPos = parseInt(Event.pointerX(event)) - inc.getOffset()[0]
			if(curPos<=maxPos ){
				if(curPos>=minPos){
				}else{
					curPos = minPos
				}
			}else{
				curPos = maxPos
			}

			var values = paraObj.values.length -1
			paraObj.currentValue = paraObj.values[Math.floor((curPos*values)/maxPos)]
		},
		onStart:function(event){
			marker.style.cursor = 'move'
		},
		onStop:function(event){
			if(paraObj.onStop)paraObj.onStop()
			marker.style.cursor = 'pointer'
		},
		dirY:false,
		dirX:dirX
	});

	this.getCurrentValue = function(){
		return paraObj.currentValue
	}

	this.setCurrentValue = function(value){
		var left = parseInt((parseInt(obj.offsetWidth)/paraObj.values.length)*value)
		marker.style.left = left +'px'
		return left
	}
}

window.onunload = function(){
	GUnload()
};

Ajax.Responders.register({
	onCreate: function(){
		Loader.on()
	},

	onComplete: function() {
		if(Ajax.activeRequestCount == 0){
			Loader.off()
		}
	},

	onError: function(e,f){
		console.log(f)
		storeLocator.msg({dataString:f})
		Loader.off()
	},

	onException: function(e,f){
		console.log(f)
		storeLocator.msg({dataString:f})
		Loader.off()
	}
});

var Loader = {
	on: function(){
		$('sl_loader').style.display = 'block'
	},

	off: function(){
		$('sl_loader').style.display = 'none'
	},

	follow: function(e){
		var loader = $('sl_loader')
		loader.style.left = e.pointerX()  + 13 + 'px'
		loader.style.top = e.pointerY()  + 13 + 'px'
	}
};

var storeLocator = {

	//page scope variables
	vars: {
		storeHeight: 144,
		storesPerPage: 3,
		pageMultiplier: 50,
		zoom: 11,
		minZoomLevel: 3,
		maxZoomLevel: 17,
		mapControler:false,

		map: false,
		marker: true,
		currentPageVar: false,
		stores: [],
		totalPages: false,
		address: false,
		miles: true,
		slider: null,
		sliderAry:[],
		initialLoad: true,
		storeAvail: false
	},

	services: {
		store: storeLocatorService
	},

	//base parameters
	pars: {
		operation:'coSearch',
		lat:54.533833, // Latitude for initial map
		lon:-2.504883,  // Longitude for initial map
		numResults:100,
		mnlt:false,
		mxlt:false,
		mnln:false,
		mxln:false,
		token:storeCode,
		heavy: true
	},

	//recent request caches
	cache: {
		geo: {count:50,recs:[{call:false,response:{lat:false,lon:false}}]},
		store: {count:10,recs:[{call:false,response:false}]}
	},

	stopReturn: function(event){
		if(event.keyCode == 13){
			storeLocator.updateMap()
			return false
		}else{
			return undefined
		}
	},

	resetPage: function(obj){
		//clear points
		storeLocator.map.clearMarkers(storeLocator.vars.map,storeLocator.vars.stores)

		storeLocator.vars.currentPageVar = 1

		$('ResultHeader').update();
		$('ResultList').update();
		$('ResultFooter').update();
		$('errorBox').update();
		$('errorBox').style.display = 'none';

	},

	//message handling
	msg: function(para){
		$('errorBox').style.display = 'block'
		$('errorBox').update(para.dataString)
	},

	buildAddress: function(){
		var string = '';

		//Using single field for location/address.
		var location;
		if($('fldLocation')){
			location = $('fldLocation').value.strip();
			string = location;
		}

		//Using multiple fields for location/address.
		var address;
		var city;
		var state;
		var zip;
		if($('fldAddress')) address = $('fldAddress').value.strip();
		if($('fldCity')) city = $('fldCity').value.strip();
		if($('fldState')) state = $('fldState').value.strip();
		if($('fldZip')) zip = $('fldZip').value.strip();

		if((city && state)|| zip){
			if(address)string += address + ' ';
			if(city)string += city + ', ';
			if(state)string += state + '. ';
			if(zip){
				string += zip;
			}

			//validation
			if(!string){
				storeLocator.resetPage();
				storeLocator.msg({dataString:'Please enter an address that our system can search for.'});
			}

			if(string.match(/0/g)){
				if(string.length == string.match(/0/g).length){
					string='';
					storeLocator.resetPage();
					storeLocator.msg({dataString:'Search Not Recognized'});

				}
			}

		}else{
			storeLocator.resetPage();
			storeLocator.msg({dataString:'Please enter a City and State OR a Zip Code.'});

		}

		return string;
	},

	//START OF MAP UPDATE CASCADE
	updateMap: function(){
		if(GBrowserIsCompatible()) {

			//clear bubble
			storeLocator.map.bubble.hide()

			//populate global pars object
			storeLocator.vars.address = storeLocator.buildAddress()
			if(!storeLocator.vars.address){
				return
			}

			//scan cache
			var cached = storeLocator.cache.geo.recs.detect(function(v,i){
				if(storeLocator.vars.address == v.call){
					//update lat and lng
					storeLocator.pars.lat = v.response.lat
					storeLocator.pars.lon = v.response.lon
					return true
				}else{
					return false
				}
			});

			if(cached){
				storeLocator.setLocation()
			}else{
				storeLocator.getLocation()
			}
			
			// Store result in array and activate option to return to last result (PEAC specific)
			if (storeLocator.map.returning == false) {
                storeLocator.map.searchQueries.push($('fldLocation').value);
                console.log('Added: '+$('fldLocation').value);
                console.log('Array size: '+storeLocator.map.searchQueries.length);
                if (storeLocator.map.searchQueries.length > 1)
                    $('return-to-last').addClassName('active');
            } else {
                storeLocator.map.returning = false;
            }
			
			$(document).fire("sl:store-locator-search");
		}
	},

	getLocation: function(){
		var geocoder = new GClientGeocoder();
		geocoder.getLatLng(storeLocator.vars.address,function(point){

			//validation
			if(point == null){
				storeLocator.resetPage()
				storeLocator.msg({dataString:'Search Not Recognized'})
				$('ResultList').update('<div class="paddMsg"><p class="fB">Sorry, no locations found in this area.</p><p>While we have a vast network of stores, no stores were found using your current selection.</p><ul>Please refine your search by:<li>Altering your search parameters </li><li>Expanding your zoom level</li></ul></div>')

				return false
			}else{
				//load results in cache
				storeLocator.cache.geo.recs.unshift({call:storeLocator.vars.address,response:{lat:point.lat(),lon:point.lng()}})
				//check size of cache and remove if nessessary
				if(storeLocator.cache.geo.recs.length>storeLocator.cache.geo.count)
					storeLocator.cache.geo.recs.pop()

				//set new points
				storeLocator.pars.lat = point.lat()
				storeLocator.pars.lon = point.lng()

				//set new location on map
				return storeLocator.setLocation()
			}
		});
	},

	setLocation: function(point){
		if(!point)
			point = new GLatLng(storeLocator.pars.lat,storeLocator.pars.lon)

		GEvent.clearInstanceListeners(storeLocator.vars.map)

		//pan to center of address
		storeLocator.vars.map.setCenter(point)

		window.setTimeout(function(){
			storeLocator.map.addEvents(storeLocator.vars.map)
		},100)

		storeLocator.vars.miles = true

		if(storeLocator.vars.initialLoad == true){
			storeLocator.map.cachedSetup(storeLocator.vars.map,false,false)
			storeLocator.vars.initialLoad = false
			storeLocator.vars.map.savePosition()
		}

		//set map bounds for stores
		storeLocator.setBounds()
	},

	getFromHere: function(){
		var point = storeLocator.vars.map.getCenter();

		//set new points
		storeLocator.pars.lat = point.lat()
		storeLocator.pars.lon = point.lng()

		//set map bounds for stores
		storeLocator.setBounds()
	},

	setBounds: function(){
		var bounds = storeLocator.vars.map.getBounds()
		storeLocator.pars.mnlt = Math.min(bounds.getSouthWest().lat(),bounds.getNorthEast().lat())
		storeLocator.pars.mxlt = Math.max(bounds.getSouthWest().lat(),bounds.getNorthEast().lat())
		storeLocator.pars.mnln = Math.min(bounds.getSouthWest().lng(),bounds.getNorthEast().lng())
		storeLocator.pars.mxln = Math.max(bounds.getSouthWest().lng(),bounds.getNorthEast().lng())

		//set cookie
		storeLocator.setCookie()
	},

	setCookie: function(){
		//store the new points
		var today = new Date();
		var expire = new Date();
		expire.setTime(today.getTime() + 3600000*2);
		document.cookie = "stLocLat="+escape(storeLocator.pars.lat) + ";expires="+expire.toGMTString();
		document.cookie = "stLocLon="+escape(storeLocator.pars.lon) + ";expires="+expire.toGMTString();
		document.cookie = "stLocZoom="+escape(storeLocator.vars.zoom) + ";expires="+expire.toGMTString();

		//go get the stores
		storeLocator.getStores()
	},

	getStores: function(){
		//clear bubble
		storeLocator.map.bubble.hide()

		var paraObj = {}
		Object.extend(paraObj,storeLocator.pars)

		var pars = Object.toQueryString(paraObj);

		//scan cache
		var cached = storeLocator.cache.store.recs.detect(function(v,i){
			if(pars == v.call){
				return v
			}else{
				return false
			}
		});

		if(cached){
			storeLocator.showList(cached.response)
		}else{
			storeLocator.locatorService(storeLocator.services.store,pars,storeLocator.showList)
		}
	},

	locatorService: function(url,pars,callBack){

		//$('status').innerHTML = encodeURI(pars)
		var myAjax = new Ajax.Request(url, {
			method: 'get',
			parameters: encodeURI(pars),
			onComplete: callBack
		});
	},

	showList: function (originalRequest){
		//alert('redraw')
		//$('status').innerHTML = $('status').innerHTML +(originalRequest.responseText)

		//is the data from the service or the cache
		if(originalRequest.responseText){
			var obj = originalRequest.responseText.evalJSON()
			//load results in cache
			storeLocator.cache.store.recs.unshift({call:this.parameters,response:obj})
			//check size of cache and remove if nessessary
			if(storeLocator.cache.store.recs.length>storeLocator.cache.store.count)
				storeLocator.cache.store.recs.pop()
		}else{
			var obj = originalRequest
		}

		//reset current page vars
		storeLocator.resetPage(obj)

		//if no stores
		if(obj.COUNT==0){
			storeLocator.msg({dataString:'Sorry, no locations were found in this area'})
			$('ResultHeader').update('<h2 class="welcome">Sorry, no locations were found.</h2>')
			$('ResultList').update('<p>Sorry, no locations were found in this area. <strong style="color:#d81027">Tip: Try zooming out further</strong></p><p>While we have a vast network of stores, no stores were found using your current selection.</p><p><strong>Please refine your search by:</strong><br /><br />- Altering your search parameters<br />- Expanding your zoom level</p>')
			return
		}

		//if There are to many stores
		if(obj.COUNT>storeLocator.pars.numResults){
			storeLocator.msg({dataString:'Please Narrow Your Search'})
			$('ResultHeader').update('<h2 class="welcome">Please Narrow Your Search</h2>')
			$('ResultList').update('<p>Please narrow your search.<br /><strong style="color:#d81027">Tip: Try zooming in closer</strong></p><p>With our vast network of stores, the area you have selected includes more than '+ storeLocator.pars.numResults +' stores.</p><p><strong>Please narrow your search by:</strong><br /><br />- Altering your search parameters<br />- Narrowing your zoom level</p>')
			return
		}

		//just right amount of stores
		storeLocator.vars.totalPages = Math.ceil(parseInt(obj.COUNT)/storeLocator.vars.storesPerPage)

		//number header
		storeLocator.list.updateStoreNumber(obj)

		//record set
		var recSlider = Df.e('div')
		recSlider.id = 'recSlider'
		recSlider.style.top = '0px'

		//for each store

		obj.RESULTS.each(function(v,i){
			if(v.store){
				//each store
				var rec = Df.e('div')
				rec.id = 'storeList'+i
				rec.className = 'rec'
				if(i==0)rec.className = 'rec first'
				if(i==obj.COUNT-1)rec.className = 'rec last'

				//BEGIN map stuff
				//the stores location icon
				var icon = storeLocator.map.icon.store()
				if(v.store.shipToStore && v.store.shipToStore == 'Y'){
					icon = storeLocator.map.icon.shipToStore()
				}

				//create and add store to map
				var point = new GLatLng(v.store.latitude,v.store.longitude)

				var marker = new GMarker(point,icon)
				storeLocator.vars.map.addOverlay(marker);

				//add store to stores array
				storeLocator.vars.stores.push(marker)

				//add bubble to marker
				GEvent.addListener(marker, "click", function() {
					//storeLocator.vars.map.setCenter(point)
					storeLocator.map.bubble.show(i,v,rec.id,marker,true)

				});
				//END map stuff

				//div for holding store icons
				var storeIcon = document.createElement('div');
				storeIcon.className = 'storeIcon';

				//store type icon
				if(v.store.typeID == 'QUKD'){
					storeIcon.e('div').addClassName("iconAffiliate").update()
				}
				else if(v.store.typeID == 'QUKL' || v.store.typeID == 'QUKF' || v.store.typeID == 'QUKC'){
					storeIcon.e('div').addClassName("iconStore").update()
				}

				//append storeIcon to rec
				rec.insert(storeIcon);

				//div for holding store information
				var storeInfo = Df.e('div').addClassName('storeInfo')

				//store Name
				if (v.store.mallPlazaName != null) {
					var a = storeInfo.e('a').addClassName("storeName").update("<div>" + v.store.locationName + "</div>" + v.store.mallPlazaName)
				}
				else {
					var a = storeInfo.e('a').addClassName("storeName2").update(v.store.locationName)
				}
				//var a = storeInfo.e('div').addClassName("storeName").update(v.store.locationName + "&nbsp;" + v.store.mallPlazaName)
				//map link

				a.observe('click', function(e){
					//map link
					//storeLocator.vars.map.setCenter(this.marker.getPoint())
					storeLocator.map.bubble.show(this.index,this.value,this.rec,this.marker,false)
				}.bind({
					index: i,
					'value': v,
					rec: rec.id,
					marker: marker
				}))

				//location code
				//$E('div',rec,{className:"locationCode",innerHTML:'#'+v.store.locationCode})
				//address
				storeInfo.e('div').addClassName("address").update(v.store.address1)
				if(v.store.address2){
					storeInfo.e('div').addClassName("address").update(v.store.address2)
				}
				storeInfo.e('div').addClassName("address").update(v.store.city+', '+v.store.stateCode+ ' ' +v.store.postalCode)

				//phone number
				if(v.store.phoneNumber){
					storeInfo.e('div').addClassName("phoneNumber").update(storeLocator.val.phone(v.store.phoneNumber))
				}
				//miles
				if(storeLocator.vars.miles){
					storeInfo.e('div').addClassName("miles").update('Approx: ' + v['distance'].round(1) + ' Miles')
				}

				//store url
				if(v.store.storeInfoURL){
					storeInfo.e('div').addClassName("storeInfoURL").update('<a href="http://' + v.store.storeInfoURL + '" target="_blank">' + v.store.storeInfoURL + '</a>')
				}

				storeInfo.e('div').addClassName("space").update('&nbsp;')

				//driving directions link (in progress)
				//if(storeLocator.val.directions(v)){
				//	var a2 = storeInfo.e('a', 'bottom', {href:storeLocator.val.directions(v), target:"_blank"}).addClassName("drivingDirections").update('Driving Directions')
				//}

				//store hours link
				var a = storeInfo.e('div').addClassName("storeHours").update('Details')

				a.observe('mouseover', function(e){
					e.target.style.color = '#d81027';
				})

				a.observe('mouseout', function(e){
					e.target.style.color = '#505050';
				})

				//map link
				a.observe('click', function(e){
					//map link
					//storeLocator.vars.map.setCenter(this.marker.getPoint())
					storeLocator.map.bubble.show(this.index,this.value,this.rec,this.marker)
				}.bind({
					index: i,
					'value': v,
					rec: rec.id,
					marker: marker
				}))

				//append storeInfo to rec
				rec.insert(storeInfo);

				//div that clears floats on storeIcon/storeInfo
				var clearIconInfo = Df.e('div').addClassName('clear')

				//append clearIconInfo to rec
				rec.insert(clearIconInfo);

				//add to rec
				recSlider.insert(rec)
			}
		});

		$('ResultList').insert(recSlider)

		//record navigation
		var nav = Df.e('div').addClassName("nav")

		//back button
		var backBtn = nav.e('div','bottom', {id:'backBtn'}).addClassName("off").update('<< Previous')

		backBtn.observe('click', function(e){
			storeLocator.list.pan(storeLocator.vars.currentPageVar - 2)
		})

		//next button
		var nextBtn = nav.e('div', 'bottom', {id: 'nextBtn'}).update('Next >>')
		if(obj.COUNT<4)
			nextBtn.className = 'off'
		nextBtn.observe('click', function(e){
			storeLocator.list.pan(storeLocator.vars.currentPageVar)
		})

		$('ResultFooter').insert(nav)

		//status bar
		var status = Df.e('div').addClassName("status")
		status.appendChild(document.createTextNode('Page '))

		//current page
		status.e('span','bottom', {id:"currentPage"}).update(storeLocator.vars.currentPageVar)
		status.appendChild(document.createTextNode(' of '))

		//total pages
		status.e('span').addClassName("drivingLink").update(storeLocator.vars.totalPages)
		$('ResultFooter').insert(status)
	}

	//END OF MAP UPDATE CASCADE
}

storeLocator.map = {

	setup:function(map) {
		map = storeLocator.vars.map = new GMap2($(map));

		//get rid of bubble shadow
		map.getPane(G_MAP_FLOAT_SHADOW_PANE).style.display = 'none'

		if(storeLocator.vars.initialLoad == true){
			storeLocator.map.initialSetup(map)
		}
		else if (location.href.toQueryParams().lat != null && location.href.toQueryParams().lon  != null) {
			storeLocator.map.cachedSetup(map,true,true)
		}
		else
		{
			storeLocator.map.cachedSetup(map,true,false)
		}
	},

	initialSetup: function(map){
		map.setCenter(new GLatLng(storeLocator.pars.lat, storeLocator.pars.lon), 3);
		if (!storeLocator.vars.storeAvail)
		{
			$('ResultHeader').update('<h2 class="welcome">Finding the store<br/> nearest you is easy.</h2>')
			$('ResultList').update('<p>Enter your <strong>address</strong>, <strong>city</strong>, or <strong>post code</strong> in the search field above to find the Timberland near you.</p>')
		}

		storeLocator.map.addMapControls(map);
		
		// Create array to store results instanceof (PEAC specific)
		storeLocator.map.searchQueries = new Array();
	},

	cachedSetup: function(map,init,pdp) {

		if (pdp) {
			map.setCenter(new GLatLng(location.href.toQueryParams().lat, location.href.toQueryParams().lon), storeLocator.vars.zoom);
			storeLocator.getFromHere()
		} else {
			map.setCenter(new GLatLng(storeLocator.pars.lat, storeLocator.pars.lon), storeLocator.vars.zoom);
		}

		//$('controlsBg').style.background = '#000';
		//storeLocator.map.addMapControls(map);

		if(init){
			storeLocator.map.addEvents(map)
			var point = new GLatLng(storeLocator.pars.lat,storeLocator.pars.lon)
			storeLocator.setBounds(point)
		}
	},

	addMapControls: function(map){
		//get map container
		var obj = map.getContainer()
		if(storeLocator.vars.mapControler){
			obj = $(storeLocator.vars.mapControler)
		}

		//add pan control
		//up
		obj.e('div','bottom',{className:'control panUp',
			onclick:function(){
			map.panDirection(0,+1)
			storeLocator.vars.miles = false
		}});
		//down
		obj.e('div','bottom',{className:'control panDown',
			onclick:function(){
			map.panDirection(0,-1)
			storeLocator.vars.miles = false
		}});
		//left
		obj.e('div','bottom',{className:'control panLeft',
			onclick:function(){
			map.panDirection(+1,0)
			storeLocator.vars.miles = false
		}});
		//right
		obj.e('div','bottom',{className:'control panRight',
			onclick:function(){
			map.panDirection(-1,0)
			storeLocator.vars.miles = false
		}});

		//recenter
		var recenter = obj.e('div','bottom',{className:'control recenter',
			onclick:function(){
			storeLocator.vars.miles = true
			map.returnToSavedPosition()
		}});

		//add zoom control
		//in
		obj.e('div','bottom',{id:'zoomIn',className:'control zoomIn',
			onclick:function(){
			storeLocator.map.zoom(map,+1)
		}});
		//out
		obj.e('div','bottom',{id:'zoomOut',className:'control zoomOut',
			onclick:function(){
			storeLocator.map.zoom(map,-1)
		}});
		
		// Add zoom label and event listener (PEAC specific)
		obj.e('div','bottom',{id:'zoom-label',className:'extra-field',
			onmouseover:function(){
			    try {
                    $('ptooltip').addClassName('show');
                } catch(err) {}
            }
		});
		
		$('zoom-label').observe('mouseout', function() {
            try {
                $('ptooltip').removeClassName('show');
            } catch(err) {}
		});
		
		// Add return to last result field and event listener (PEAC specific)
		obj.e('div','bottom',{id:'return-to-last',className:'extra-field',
			onclick:function(){
			    if (storeLocator.map.searchQueries.length > 1) {
			        Form.Element.setValue($('fldLocation'), storeLocator.map.searchQueries[storeLocator.map.searchQueries.length-2]);
			        storeLocator.map.searchQueries.splice(storeLocator.map.searchQueries.length-1, 1);
			        storeLocator.map.returning = true;
			        
			        if (storeLocator.map.searchQueries.length == 1)
			            $('return-to-last').removeClassName('active');
			            
			        storeLocator.updateMap();
			    }
			}
		});

		//build slider
		for(var i=storeLocator.vars.maxZoomLevel; i>=storeLocator.vars.minZoomLevel; i--){
			storeLocator.vars.sliderAry.push(i)
		}
		var slider = obj.e('div','bottom',{className:'slider'})

		var marker = slider.e('div','bottom',{className:'marker'})

		storeLocator.slider = new Df.TickSlider(marker)
		storeLocator.slider.pars.dirY =  false;
		storeLocator.slider.pars.dirX = {min:0,max:parseInt(slider.offsetWidth)- parseInt(marker.offsetWidth)};
		storeLocator.slider.pars.tickValue = 10;
		storeLocator.slider.pars.startPosition = 0;
		storeLocator.slider.pars.values=storeLocator.vars.sliderAry;
		storeLocator.slider.pars.onDrag = function(e){
				var minPos = 0
				var maxPos = parseInt(slider.offsetWidth)- parseInt(marker.offsetWidth)

				var curPos = parseInt(e._curX);
				if(curPos<=maxPos ){
					if(curPos>=minPos){
					}else{
						curPos = minPos
					}
				}else{
					curPos = maxPos
				}

				var values = this.pars.values.length -1
				this.currentValue = this.pars.values[Math.floor((curPos*values)/maxPos)]
			}.bind(storeLocator.slider);
			storeLocator.slider.pars.onStart = function(event){
				marker.style.cursor = 'move'
			}.bind(storeLocator.slider);
			storeLocator.slider.pars.onStop = function(event){
				marker.style.cursor = 'pointer'
				map.setZoom(parseInt(this.currentValue))
				this.pars.setCurrentValue(storeLocator.map.index(storeLocator.vars.sliderAry,storeLocator.vars.zoom))
				storeLocator.map.adjustZoomButtons(map)
			}.bind(storeLocator.slider);
			storeLocator.slider.pars.setCurrentValue = function(value){
			var left = parseInt((parseInt(slider.offsetWidth)/this.pars.values.length)*value)
			marker.style.left = left +'px'
			return left
		}.bind(storeLocator.slider);

		storeLocator.slider.enable()

		storeLocator.map.adjustZoomButtons(map)

		//add map type
		//map
		obj.e('div','bottom',{innerHTML:'Map',id:'cmap',className:'control cmap',
			onmouseover:function(){
				Element.addClassName('cmap', 'cmapHover');
			},
			onmouseout:function(){
				Element.removeClassName('cmap', 'cmapHover');
			},
			onclick:function(){
			storeLocator.map.mapType(map,0)
		}});
		//sat
		obj.e('div','bottom',{innerHTML:'Satellite',id:'csat',className:'control csat',
			onmouseover:function(){
				Element.addClassName('csat', 'csatHover');
			},
			onmouseout:function(){
				Element.removeClassName('csat', 'csatHover');
			},
			onclick:function(){
			storeLocator.map.mapType(map,1)
		}});
		//hybrid
		obj.e('div','bottom',{innerHTML:'Hybrid',id:'chybrid',className:'control chybrid',
			onmouseover:function(){
				Element.addClassName('chybrid', 'cmapHover');
			},
			onmouseout:function(){
				Element.removeClassName('chybrid', 'cmapHover');
			},
			onclick:function(){
			storeLocator.map.mapType(map,2)
		}});

		//adjust map type
		storeLocator.map.adjustMapButtons(storeLocator.vars.map)
	},

	addEvents: function(map){
		GEvent.addListener(map, "dragstart", function() {
			storeLocator.vars.miles = false
		});

		GEvent.addListener(map, "moveend", function() {
			storeLocator.getFromHere()
		});

		GEvent.addListener(map, "movestart", function() {
			//clear bubble
			storeLocator.map.bubble.hide()
		});
	},

	clearMarkers: function(map,stores){
		if(stores.length>0)while(stores.length>0)map.removeOverlay(stores.shift());
	},

	zoom: function(map,dir){
		if(dir>0){
			if(storeLocator.vars.maxZoomLevel>(parseInt(map.getZoom())))map.zoomIn()
		}else if(dir<0){
			if(storeLocator.vars.minZoomLevel<(parseInt(map.getZoom())))map.zoomOut()
		}
		storeLocator.map.adjustZoomButtons(map)
	},

	adjustZoomButtons: function(map){
		Element.removeClassName('zoomOut','zoomOutOff')
		Element.removeClassName('zoomIn','zoomInOff')
		storeLocator.vars.zoom = map.getZoom()

		if(storeLocator.vars.minZoomLevel>(storeLocator.vars.zoom-1)){
			Element.addClassName('zoomOut','zoomOutOff')
		}
		else if(storeLocator.vars.maxZoomLevel<(storeLocator.vars.zoom+1)){
			Element.addClassName('zoomIn','zoomInOff')
		}
		storeLocator.slider.pars.setCurrentValue(storeLocator.map.index(storeLocator.vars.sliderAry,storeLocator.vars.zoom))
	},

	mapType: function(map,i){
		map.setMapType(G_DEFAULT_MAP_TYPES[i])
		storeLocator.map.adjustMapButtons(map)

	},

	adjustMapButtons: function(map){
		Element.removeClassName('cmap','cmapOn')
		Element.removeClassName('csat','csatOn')
		Element.removeClassName('chybrid','chybridOn')

		var type = map.getCurrentMapType().getName()
		if(type == 'Map'){
			Element.addClassName('cmap','cmapOn')
		}else if(type == 'Satellite'){
			Element.addClassName('csat','csatOn')
		}else if(type == 'Hybrid'){
			Element.addClassName('chybrid','chybridOn')
		}
	},

	markerToPixel: function(marker){
		var par = false
		loopster:
		for(p in marker){
			try{
				if(marker[p].tagName == 'IMG'){
					par = p
					break loopster
				}
			}catch(e){

			}
		}
		if(!par){
			loopster2:
			for(p in marker){
				try{
					if(marker[p].tagName == 'DIV'){
						par = p
						break loopster2
					}
				}catch(e){

				}
			}
		}

		if(par){
			var pixels = Position.cumulativeOffset(marker[par])
			var pos = Position.cumulativeOffset($('body'))
			var x = parseInt(pixels[0]) - parseInt(pos[0])
			var y = parseInt(pixels[1]) - parseInt(pos[1])
		}else{
			var x = 0
			var y = 0
		}
		return {x:x,y:y}
	},

	index: function(ary,value){
		loopster:
		for(var i=0; i<ary.length; i++){
			if(ary[i] == value){
				return i
				break loopster
			}
		}
		return false
	}
}

storeLocator.map.icon = {
	shipToStore: function(){
		var icon = new GIcon();
		icon.image = "../images/storeLocator/icon_ship.png";
		icon.shadow = "../images/storeLocator/icon_shadow.png";
		icon.iconSize = new GSize(39, 55);
		icon.shadowSize = new GSize(55, 55);
		icon.iconAnchor = new GPoint(20, 55);
		icon.infoWindowAnchor = new GPoint(0, 0);
		return icon
	},

	store: function(){
		var icon = new GIcon();
		icon.image = "../images/storeLocator/icon.png";
		icon.shadow = "../images/storeLocator/icon_shadow.png";
		icon.iconSize = new GSize(39, 55);
		icon.shadowSize = new GSize(55, 55);
		icon.iconAnchor = new GPoint(20, 55);
		icon.infoWindowAnchor = new GPoint(0, 0);
		return icon
	}
}

storeLocator.map.bubble = {

	store: function(i,v){
		var bubble = Df.e('div').addClassName('mapBubble')

		//tab 1
		var tab1 = bubble.e('div').addClassName('tab1')

		//tab 2
		var tab2 = bubble.e('div').addClassName('tab2')

		//tab 1 hit area
		var tab1HitArea = bubble.e('div').addClassName('hitArea1')
		tab1HitArea.onclick = function(){
			tab1HitArea.style.display = 'none'
			tab2HitArea.style.display = 'block'
			tab2.style.display = 'none'
			tab1.style.display = 'block'
		}

		if(v.store.storeHours){
			//tab 2 hit area
			var tab2HitArea = bubble.e('div').addClassName('hitArea2')
			tab2HitArea.onclick = function(){
				tab2HitArea.style.display = 'none'
				tab1HitArea.style.display = 'block'
				tab1.style.display = 'none'
				tab2.style.display = 'block'
			}

			//tab 2 content
			var content2 = tab2.e('div').addClassName('bubbleContent')
			//store Name
			content2.e('span').addClassName("storeName").update(v.store.locationName)
			//location code
			content2.e('span').addClassName("locationCode").update('&nbsp;#'+v.store.locationCode)
			content2.e('div').addClassName("fB").update('Store Hours*')
			//store hours
			content2.e('div').addClassName("storeHours").update(v.store.storeHours)
			content2.e('div').addClassName("space").update('')
			content2.e('div').addClassName("discl").update('*Hours may vary slightly, particularly during the holidays. Please call the store for exact hours.')

		}else{
			//tab 2 no hit area
			var tab2HitArea = bubble.e('div').addClassName("hitArea2Inactive")
		}
		//tab 1 content
		var content = tab1.e('div').addClassName("bubbleContent")

		//store Name
		content.e('span').addClassName("storeName ").update(v.store.locationName)

		//location code
		content.e('span').addClassName("locationCode").update('&nbsp;#'+v.store.locationCode)



		//address
		content.e('div').addClassName("address").update(v.store.address1)
		if(v.store.address2){
			content.e('div').addClassName("address").update(v.store.address2)
		}
		content.e('div').addClassName("address").update(v.store.city+', '+v.store.stateCode+ ' ' +v.store.postalCode)

		//phone number
		if(v.store.phoneNumber){
			content.e('div').addClassName("phoneNumber").update(storeLocator.val.phone(v.store.phoneNumber))
		}
		//miles
		if(storeLocator.vars.miles){
			content.e('div').addClassName("miles").update('Approx: ' + v['distance'].round(1) + ' Miles')
		}
		//store url
		if(v.store.storeInfoURL){
			content.e('div').addClassName("storeInfoURL").update('<a href="http://' + v.store.storeInfoURL + '" target="_blank">' + v.store.storeInfoURL + '</a>')
		}
		//directions
		var a = content.e('a','bottom',{href:storeLocator.val.directions(v), className:"directions", target:"_blank", innerHTML:'Get Directions'})


		//close btn
		var closeIt = Df.e('div').addClassName("closeIt")

		closeIt.observe('click', function(e){
			storeLocator.map.bubble.hide()
			storeLocator.list.goDim()
		})

		bubble.insert(closeIt)

		var mapBubbleContainer = Df.e('div').addClassName('mapBubbleContainer')
		mapBubbleContainer.page = Math.floor(i/storeLocator.vars.storesPerPage)
		mapBubbleContainer.insert(bubble)

		return mapBubbleContainer;
	},

	hide: function(){
		var bubbles = $$('.mapBubbleContainer')
		for(var i=0; i<bubbles.length; i++){
			bubbles[i].remove()
		}
	},

	show: function(i,v,rec,marker,pan){

		//hide Bubbles
		storeLocator.map.bubble.hide()

		//get pixels
		var pixels = storeLocator.map.markerToPixel(marker)

		var left = pixels.x - 115
		var top = pixels.y - 175

		//show bubble
		var bubble = storeLocator.map.bubble.store(i,v)
		bubble.style.left = left + 'px'
		bubble.style.top = top + 'px'
		$('body').insert(bubble)

		if(pan){
			storeLocator.list.pan(bubble.page)
		}

		storeLocator.list.hightLight(rec)
		$(document).fire("sl:store-locator-store-select", { memo : v.store.locationCode } )
	}
}

storeLocator.list = {
	pan: function(page){
		var top = page*(storeLocator.vars.storeHeight*-storeLocator.vars.storesPerPage)
		var elm = $('recSlider')
		var current = parseInt(elm.style.top)
		var skip = parseInt(Math.abs(top-current)/(storeLocator.vars.storeHeight*storeLocator.vars.storesPerPage))
		var update = false

		if(top>current){
			if(page>=0){
				$('recSlider').animate({top: top})
				update = true
			}else{
				$('backBtn').className = 'off'
			}
		}else if(top<current){
			if(page<storeLocator.vars.totalPages){
				$('recSlider').animate({top: top})
				update = true
			}
		}
		if(update){
			storeLocator.vars.currentPageVar = page + 1
			$('currentPage').update(storeLocator.vars.currentPageVar)
			$('nextBtn').className = ''
			$('backBtn').className = ''
			if(storeLocator.vars.currentPageVar==storeLocator.vars.totalPages){
				$('nextBtn').className = 'off'
			}
			else if(storeLocator.vars.currentPageVar==1){
				$('backBtn').className = 'off'
			}
		}
	},

	hightLight: function(obj){
		storeLocator.list.goDim()
		$(obj).addClassName('on')
	},

	goDim: function(){
		var ary = $$('#ResultList .rec')
		ary.each(function(v,i){
			Element.removeClassName(v,'on')
		});
	},

	updateStoreNumber: function(obj){
		var count = document.createElement('div')
		var html = '<div class="fB"><b>' + obj.COUNT + '</b> Store in your area</div>'
		if(obj.COUNT > 1){
			html = '<div class="fB"><b>' + obj.COUNT + '</b> Stores in your area</div>'
		}
		$('ResultHeader').update(html)
	}
}

storeLocator.val = {
	hours: function(start,end){
		if(start && end){
			return '<td align="right">' + start.toStdTime() + ' to ' + end.toStdTime() + '</td>'
		}else{
			return '<td align="right">CLOSED</td>'
		}
	},

	phone: function(string){
		string = string.replace(/-/g,'')
		if(string && string.length == 10){
			return '<span>Tel: </span>('+string.substring(0,3)+') '+string.substring(3,6)+'-'+string.substring(6,10)
		}else{
			return '<span>Tel: </span>'+string
		}
	},

	directions: function(v){
		if(storeLocator.vars.address != " "){
			return 'http://maps.google.co.uk/maps?saddr='+storeLocator.pars.lat+','+storeLocator.pars.lon+'('+encodeURI(storeLocator.vars.address)+')&daddr='+v.store.latitude+','+v.store.longitude+'('+encodeURI(v.store.address1+' '+v.store.city+', '+v.store.stateCode+' '+v.store.postalCode)+')'
		}else{
			return 'http://maps.google.co.uk/maps?q='+v.store.latitude+','+v.store.longitude+'('+encodeURI(v.store.address1+' '+v.store.city+', '+v.store.stateCode+' '+v.store.postalCode)+')'
		}
	}
}

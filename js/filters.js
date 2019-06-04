var activeFilter = {}; //Dictionary of the current selected filters
var timerForFilter, markerCode;
var profiles = { //Colour profiles for the filters
"defaultMarker": {code: "#004387"},
"redMarker": {code: "#ff0000"},
"darkredMarker": {code: "#6b1c1c"},
"lightredMarker": {code: "#d25151"},
"greenMarker": {code: "#00c700"},
"darkgreenMarker": {code: "#19641b"},
"blueMarker": {code: "#000dff"},
"darkblueMarker": {code: "#001369"},
"lightblueMarker": {code: "#3274c7"},
"orangeMarker": {code: "#d76b00"},
"yellowMarker": {code: "#ddc600"},
"darkyellowMarker": {code: "#877800"},
"lightyellowMarker": {code: "#ffe92c"},
"greyMarker": {code: "#5c5c5c"},
"lightgreyMarker": {code: "#a0a0a0"},
"violetMarker": {code: "#7a00b7"},
"lightvioletMarker": {code: "#dc1369"}
};
var filter_defaultValues = {"active": false, "layers": [], "coordinates": {"max": {"north": 0, "south": 0, "east": 0, "west": 0}, "current": {"north": 0, "south": 0, "east": 0, "west": 0}}, "usedBefore" : false}; //its active state, markers belonging to that filter, the boundings of a filter (area downloaded and cached)
var filter = { //The filters, the query they trigger, their colour profile, their address and technical description as dictionary (JSON)
0: {"query": {"node|way": ["[\"healthcare:speciality\"~\"paediatrics\"]"]},  "color": profiles.redMarker, "address" : "health paediatrics"},
1: {"query": {"node|way": ["[\"healthcare\"=\"midwife\"]"]},  "color": profiles.darkredMarker, "address" : "health midwife"},
2: {"query": {"node|way": ["[\"healthcare\"=\"birthing_center\"]"]},  "color": profiles.lightredMarker, "address" : "health birth"},
3: {"query": {"nwr": ["[\"leisure\"=\"playground\"]", "[\"access\"!=\"private\"]", "[\"min_age\"!~\"[4-99]\"]"]},  "color": profiles.greenMarker, "address" : "activity playground"},
4: {"query": {"way|relation": ["[\"leisure\"=\"park\"]", "[\"access\"!=\"private\"]", "[\"name\"]", "[\"min_age\"!~\"[4-99]\"]"]},  "color": profiles.darkgreenMarker, "address" : "activity park"},
5: {"query": {"node|way": ["[\"shop\"=\"baby_goods\"]"]},  "color": profiles.blueMarker, "address" : "shop baby_goods"},
6: {"query": {"node|way": ["[\"shop\"=\"toys\"]"]},  "color": profiles.darkblueMarker, "address" : "shop toys"},
7: {"query": {"node|way": ["[\"shop\"=\"clothes\"]", "[\"clothes\"~\"babies|children\"]"]},  "color": profiles.lightblueMarker, "address" : "shop clothes"},
8: {"query": {"node|way": ["[\"amenity\"~\"kindergarten|childcare\"]"]},  "color": profiles.orangeMarker, "address" : "childcare kindergarten"},
9: {"query": {"node|way": ["[\"tourism\"=\"zoo\"]"]},  "color": profiles.yellowMarker, "address" : "activity zoo"},
10: {"query": {"node|way": ["[\"diaper\"]", "[\"diaper\"!=\"no\"]"]},  "color": profiles.lightgreyMarker, "address" : "childcare diaper"},
11: {"query": {"node|way": ["[\"diaper:male\"=\"yes\"]"], "node|way_": ["[\"diaper:unisex\"=\"yes\"]"], "node|way__": ["[\"diaper\"=\"room\"]"], "node|way___": ["[\"diaper:wheelchair\"=\"yes\"]"]},  "color": profiles.greyMarker, "address" : "childcare diaper"},
12: {"query": {"node|way": ["[\"amenity\"=\"cafe\"]", "[\"min_age\"!~\"[4-99]\"]"]},  "color": profiles.violetMarker, "address" : "eat cafe"},
13: {"query": {"node|way": ["[\"amenity\"=\"restaurant\"]", , "[\"min_age\"!~\"[4-99]\"]"]},  "color": profiles.lightvioletMarker, "address" : "eat restaurant"}
};
function triggerActivationOfFilters() {
	clearTimeout(timerForFilter);
	timerForFilter = setTimeout(activateFilters, 1000); // Activate fillters after every user action regarding the filter menu has taken place. Gives the user 1sec time to react (activate/deactivate one or more filters)
}
function toggleLayers(id, toggle) {
	// Removes/Adds cached filter data to the map
	if (toggle == 0) {
		//Removes the filter marker from the map. (e.g. red marker). Data remains in cache.
		if (filter[id].layers.length > 0) {
			for (var layer in filter[id].layers) {
				//Removes every single marker that belongs to the filter.
				filter[id].layers[layer].removeFrom(map);
			}
		}
	} else {
		//Readds a recently used filter marker to the map (e.g. red marker)
		if (filter[id].layers.length > 0) {
			for (var layer in filter[id].layers) {
				//Adds every single POI that belongs to the filter.
				filter[id].layers[layer].addTo(map);
			}
		}
	}
}
function activateFilters() {
	hideFilterListOnMobile(); //Hides the menu on mobile devices when filter loads
	for (var entry in filter) {
		if (filter[entry].active) {
			activeFilter[entry] = true;
			toggleLayers(entry, 1) //Adds the POIs belonging to the filter to the map.
		} else {
			if (activeFilter[entry]) {
				delete activeFilter[entry];
				toggleLayers(entry, 0) //Removes the POIs belonging to the filter from the map.
			}
		}
		entry += 1;
	}
	loadPOIS(""); //Send request to overpass and interpret/render the results for the POI popup
}
function setFilter(id) {
	//Gets called when the user (un)checks a filter.
	if (filter[id].active) {
		//The filter is currently active, deactivate it because the user unchecked it.
		filter[id].active = false;
	} else {
		//The filter is deactivated, activate it because the user checked it.
		filter[id].active = true;
	}
	triggerActivationOfFilters();
}
function setAllFilters() {
	var checkbox = document.getElementById("setFilters"); //Gets the "(Un)check them all" checkbox
	if (checkbox.checked) { //User checked it. Activate all filters
		for (var i in filter) {
			if (!filter[i].active) {
				setFilter(i);
				document.getElementById("filter" + i).checked = true; //Check all filters
			}
		}
	} else { //Deactivate all filters
		for (var i in filter) {
			if (filter[i].active) {
				setFilter(i);
				document.getElementById("filter" + i).checked = false; //Uncheck all filters
			}
		}
	}
}
function initFilters() {
	//Initialize filters at startup of this webapp
	var output = "";
	var filtersGround = document.getElementById("filtersGround");
	output += "<label style='color:#007399;'><input id='setFilters' onclick='setAllFilters()' type='checkbox'><span style='color:white;font-weight:bold;font-size:16px;'>&#9632; </span><span>" + String(getText().FLTR_SELECTALL) + "</span></label>"; //Adds the necessary HTML for checkbox element of '(Un)check them all'
	for (var id in filter) {
		if (filter[id].layers == undefined) {
			filter[id] = $.extend(true, filter[id], filter_defaultValues); //Initialize the JSON variable 'filter'.
		}
		var fltr = filter[id];
		output += "<label><input id='filter" + String(id) + "' onclick='setFilter(" + String(id) + ")' type='checkbox'><span style='color:" + fltr.color.code + ";font-weight:bold;font-size:16px;'>&#9632; </span><span>" + String(getText().filtername[id]) + "</span></label>";  //Adds the necessary HTML for checkbox element of every single filter
	}
	filtersGround.innerHTML = output; //Add filters to the site (displaying them to user)
}
function osmExpression(poi, value) {
	var key, content, result;
	var regExpression = "";
	value = value.replace("\"", "").replace("\"", "").replace("[", "").replace("]", "").replace("\"", "").replace("\"", "")
	if (value.indexOf("=") > -1) {
		value = value.split("=");
		regExpression = "==";
	} else if (value.indexOf("~") > -1) {
		value = value.split("~");
		regExpression = "~";
	} else {
		return ((poi.tags[value]) ? true : false);
	}
	if (value[0].endsWith("!")) {
		regExpression = "!" + regExpression.replace("=", "");
		value[0] = value[0].replace("!", "");
	}
	key = poi.tags[value[0]];
	if (!key) {return false}
	content = value[1];
	if (regExpression.indexOf("~") == -1) {
		result = eval("((\"" + key + "\" " + regExpression + " \"" + content + "\") ? true : false)");
		return result;
	} else {
		result = ((key.match(new RegExp(content)) != null) ? true : false);
		if (regExpression.indexOf("!") > -1) {
			if (result) {result = false} else {result = true}
		}
		return result;
	}
}
function getData(url, dataType, data,  fail, success, type) {
	if (type == undefined) {type = "GET"}
	if (fail == undefined) {fail = function() {showGlobalPopup(getText().LOADING_FAILURE);progressbar();}}
	$.ajax({
		type: type,
		url: String(url),
		dataType: String(dataType),
		data: data,
		fail: fail,
		success: success
		});
}
function getSubtitle(poi) {
	var json = getText().filtertranslations;
	for (var i in json) {
		var key = i.split("=");
		if (poi.tags[key[0]] == key[1]) {
			return getText().filtertranslations[i];
		}
	}
	return undefined;
}
function groupIntoLayers(poi) {
	// Guess which data received by Babykarte belongs to which filter
	var marker = "";
	var name = "";
	marker = new Object();
	for (var fltr in activeFilter) { //Goes throw all active filters. (Those the user has currently selected).
		var query = filter[fltr].query; //Gets the list of queries the filter has.
		for (var type in query) { //Gets throw all the queries the filter has..
			type = query[type]; //Instead of its query name it gets the content of the type.
			name = getSubtitle(poi);
			if (osmExpression(poi, type[0])) {
				marker.fltr = fltr;
				marker.name = name || getText().filtername[fltr]; //Sets the subtitle which appears under the POI's name as text in grey
				marker.address = filter[fltr].address;
				marker.color = filter[fltr].color.code;
				return marker;
			}
		}
	}
	marker.address = "";
	marker.name = "";
	marker.color = "default";
	return marker;
}
getData("/markers/marker.svg", "text", "", undefined, function (data) {markerCode = data; /* Caches the marker for later altering (change of its colour for every single individual filter) */}); //Triggers the loading and caching of the marker icon at startup of Babykarte

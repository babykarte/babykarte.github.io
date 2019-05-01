var activeFilter = {}; //Dictionary of the current selected filters
var timerForFilter;
var profiles = {default: {iconSize: [25, 41], popupAnchor: [4, -32], iconAnchor: [8, 40]}, //Colour profiles for the filters
"defaultMarker": {iconUrl: "/markers/marker.svg", code: "#004387ff"},
"redMarker": {iconUrl: "/markers/marker-red.svg", code: "#ff0000"},
"darkredMarker": {iconUrl: "/markers/marker-darkred.svg", code: "#6b1c1cff"},
"lightredMarker": {iconUrl: "/markers/marker-lightred.svg", code: "#d25151ff"},
"greenMarker": {iconUrl: "/markers/marker-green.svg", code: "#00c700"},
"darkgreenMarker": {iconUrl: "/markers/marker-darkgreen.svg", code: "#19641bff"},
"blueMarker": {iconUrl: "/markers/marker-blue.svg", code: "#000dff"},
"darkblueMarker": {iconUrl: "/markers/marker-darkblue.svg", code: "#001369"},
"lightblueMarker": {iconUrl: "/markers/marker-lightblue.svg", code: "#3274c7ff"},
"orangeMarker": {iconUrl: "/markers/marker-orange.svg", code: "#d76b00ff"},
"yellowMarker": {iconUrl: "/markers/marker-yellow.svg", code: "#ddc600ff"},
"darkyellowMarker": {iconUrl: "/markers/marker-darkyellow.svg", code: "#877800ff"},
"lightyellowMarker": {iconUrl: "/markers/marker-lightyellow.svg", code: "#ffe92cff"},
"greyMarker": {iconUrl: "/markers/marker-grey.svg", code: "#5c5c5cff"},
"lightgreyMarker": {iconUrl: "/markers/marker-lightgrey.svg", code: "#a0a0a0ff"},
"violetMarker": {iconUrl: "/markers/marker-violet.svg", code: "#7a00b7ff"},
"lightvioletMarker": {iconUrl: "/markers/marker-lightviolet.svg", code: "#dc1369"}
};
var filter_defaultValues = {"active": false, "layers": [], "coordinates": {"max": {"north": 0, "south": 0, "east": 0, "west": 0}, "current": {"north": 0, "south": 0, "east": 0, "west": 0}}, "usedBefore" : false};
var filter = { //The filters, the query they trigger, their names and technical description as dictionary (JSON)
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
11: {"query": {"node|way": ["[\"amenity\"=\"cafe\"]", , "[\"min_age\"!~\"[4-99]\"]"]},  "color": profiles.violetMarker, "address" : "eat cafe"},
12: {"query": {"node|way": ["[\"amenity\"=\"restaurant\"]", , "[\"min_age\"!~\"[4-99]\"]"]},  "color": profiles.lightvioletMarker, "address" : "eat restaurant"}
};
function triggerActivationOfFilters() {
	clearTimeout(timerForFilter);
	timerForFilter = setTimeout(activateFilters, 1000);
}
function toggleLayers(id, toggle) {
	if (toggle == 0) {
		//Removes the filter from the map.
		if (filter[id].layers.length > 0) {
			for (var layer in filter[id].layers) {
				//Removes every single POI that belongs to the filter.
				filter[id].layers[layer].removeFrom(map);
			}
		}
	} else {
		//Readds a recently used filter to the map
		if (filter[id].layers.length > 0) {
			for (var layer in filter[id].layers) {
				//Adds every single POI that belongs to the filter.
				filter[id].layers[layer].addTo(map);
			}
		}
	}
}
function activateFilters() {
	hideFilterListOnMobile();
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
	loadPOIS("");
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
	var checkbox = document.getElementById("setFilters");
	if (checkbox.checked) { //Activate all filters
		for (var i in filter) {
			if (!filter[i].active) {
				setFilter(i);
				document.getElementById("filter" + i).checked = true;
			}
		}
	} else { //Deactivate all filters
		for (var i in filter) {
			if (filter[i].active) {
				setFilter(i);
				document.getElementById("filter" + i).checked = false;
			}
		}
	}
}
function initFilters() {
	var output = "";
	var filtersGround = document.getElementById("filtersGround");
	output += "<label style='color:#007399;'><input id='setFilters' onclick='setAllFilters()' type='checkbox'><span style='color:white;font-weight:bold;font-size:16px;'>&#9632; </span><span>" + String(getText().FLTR_SELECTALL) + "</span></label>";
	for (var id in filter) {
		if (filter[id].layers == undefined) {
			filter[id] = $.extend(true, filter[id], filter_defaultValues);
		}
		var fltr = filter[id];
		output += "<label><input id='filter" + String(id) + "' onclick='setFilter(" + String(id) + ")' type='checkbox'><span style='color:" + fltr.color.code + ";font-weight:bold;font-size:16px;'>&#9632; </span><span>" + String(getText().filtername[id]) + "</span></label>";
	}
	filtersGround.innerHTML = output;
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
function groupIntoLayers(poi) {
	var marker;
	var name = "";
	for (var fltr in activeFilter) { //Goes throw all active filters. (Those the user has currently selected).
		var query = filter[fltr].query; //Gets the list of queries the filter has.
		for (var type in query) { //Gets throw all the queries the filter has..
			type = query[type]; //Instead of its query name it gets the content of the type.
			name = getText().filtertranslations[type[0]];
			if (osmExpression(poi, type[0])) {
				marker = L.icon($.extend(true, filter[fltr].color, profiles.default));
				marker = L.marker([poi.lat, poi.lon], {icon: marker});
				filter[fltr].layers.push(marker); //Adds the POI to the filter's layers list.
				marker.name = name || getText().filtername[fltr];
				marker.address = filter[fltr].address;
				return marker;
			}
		}
	}
	marker = L.marker([poi.lat, poi.lon], {icon: L.icon($.extend(true, profiles.defaultMarker, profiles.default))});
	marker.address = "";
	marker.name = "";
	return marker;
}

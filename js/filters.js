var activeFilter = {}; //Dictionary of the current selected filters
var profiles = {default: {iconSize: [25, 41], popupAnchor: [4, -32], iconAnchor: [8, 40]}, //Colour profiles for the filters
"defaultMarker": {iconUrl: "/markers/marker.svg"},
"redMarker": {iconUrl: "/markers/marker-red.svg"},
"darkredMarker": {iconUrl: "/markers/marker-darkred.svg"},
"lightredMarker": {iconUrl: "/markers/marker-lightred.svg"},
"greenMarker": {iconUrl: "/markers/marker-green.svg"},
"darkgreenMarker": {iconUrl: "/markers/marker-darkgreen.svg"},
"blueMarker": {iconUrl: "/markers/marker-blue.svg"},
"darkblueMarker": {iconUrl: "/markers/marker-darkblue.svg"},
"lightblueMarker": {iconUrl: "/markers/marker-lightblue.svg"},
"orangeMarker": {iconUrl: "/markers/marker-orange.svg"},
"yellowMarker": {iconUrl: "/markers/marker-yellow.svg"},
"darkyellowMarker": {iconUrl: "/markers/marker-darkyellow.svg"},
"lightyellowMarker": {iconUrl: "/markers/marker-lightyellow.svg"},
"greyMarker": {iconUrl: "/markers/marker-grey.svg"},
"lightgreyMarker": {iconUrl: "/markers/marker-lightgrey.svg"},
"violetMarker": {iconUrl: "/markers/marker-violet.svg"},
"lightvioletMarker": {iconUrl: "/markers/marker-lightviolet.svg"}
};
var filter = { //The filters, the query they trigger, their names and technical descriptions as dictionary (JSON)
0: {"query": {"node|way": ["[\"healthcare\"=\"doctor\"]", "[\"healthcare:speciality\"=\"paediatrics\"]"]}, "active": false, "layers": [], "coordinates": {"max": {"north": 0, "south": 0, "east": 0, "west": 0}, "current": {"north": 0, "south": 0, "east": 0, "west": 0}}, "usedBefore" : false, "color": profiles.redMarker},
1: {"query": {"node|way": ["[\"healthcare\"=\"midwife\"]"]}, "active": false, "layers": [], "coordinates": {"max": {"north": 0, "south": 0, "east": 0, "west": 0}, "current": {"north": 0, "south": 0, "east": 0, "west": 0}}, "usedBefore" : false, "color": profiles.darkredMarker},
2: {"query": {"node|way": ["[\"healthcare\"=\"birthing_center\"]"]}, "active": false, "layers": [], "coordinates": {"max": {"north": 0, "south": 0, "east": 0, "west": 0}, "current": {"north": 0, "south": 0, "east": 0, "west": 0}}, "usedBefore" : false, "color": profiles.lightredMarker},
3: {"query": {"node|way": ["[\"leisure\"=\"playground\"]"]}, "active": false, "layers": [], "coordinates": {"max": {"north": 0, "south": 0, "east": 0, "west": 0}, "current": {"north": 0, "south": 0, "east": 0, "west": 0}}, "usedBefore" : false, "color": profiles.greenMarker},
4: {"query": {"way|relation": ["[\"leisure\"=\"park\"]", "[\"name\"]"]}, "active": false, "layers": [], "coordinates": {"max": {"north": 0, "south": 0, "east": 0, "west": 0}, "current": {"north": 0, "south": 0, "east": 0, "west": 0}}, "usedBefore" : false, "color": profiles.darkgreenMarker},
5: {"query": {"node|way": ["[\"shop\"=\"baby_goods\"]"]}, "active": false, "layers": [], "coordinates": {"max": {"north": 0, "south": 0, "east": 0, "west": 0}, "current": {"north": 0, "south": 0, "east": 0, "west": 0}}, "usedBefore" : false, "color": profiles.blueMarker},
6: {"query": {"node|way": ["[\"shop\"=\"toys\"]"]}, "active": false, "layers": [], "coordinates": {"max": {"north": 0, "south": 0, "east": 0, "west": 0}, "current": {"north": 0, "south": 0, "east": 0, "west": 0}}, "usedBefore" : false, "color": profiles.darkblueMarker},
7: {"query": {"node|way": ["[\"shop\"=\"clothes\"]", "[\"clothes\"~\"babies|children\"]"]}, "active": false, "layers": [], "coordinates": {"max": {"north": 0, "south": 0, "east": 0, "west": 0}, "current": {"north": 0, "south": 0, "east": 0, "west": 0}}, "usedBefore" : false, "color": profiles.lightblueMarker},
8: {"query": {"node|way": ["[\"amenity\"=\"kindergarten\"]"]}, "active": false, "layers": [], "coordinates": {"max": {"north": 0, "south": 0, "east": 0, "west": 0}, "current": {"north": 0, "south": 0, "east": 0, "west": 0}}, "usedBefore" : false, "color": profiles.orangeMarker},
9: {"query": {"node|way": ["[\"tourism\"=\"zoo\"]"]}, "active": false, "layers": [], "coordinates": {"max": {"north": 0, "south": 0, "east": 0, "west": 0}, "current": {"north": 0, "south": 0, "east": 0, "west": 0}}, "usedBefore" : false, "color": profiles.yellowMarker},
10: {"query": {"node|way": ["[\"amenity\"=\"theatre\"]", "[\"theatre:genre\"=puppet\"]"]}, "active": false, "layers": [], "coordinates": {"max": {"north": 0, "south": 0, "east": 0, "west": 0}, "current": {"north": 0, "south": 0, "east": 0, "west": 0}}, "usedBefore" : false, "color": profiles.darkyellowMarker},
11: {"query": {"node|way": ["[\"attraction\"=\"animal\"]"]}, "active": false, "layers": [], "coordinates": {"max": {"north": 0, "south": 0, "east": 0, "west": 0}, "current": {"north": 0, "south": 0, "east": 0, "west": 0}}, "usedBefore" : false, "color": profiles.lightyellowMarker},
13: {"query": {"node|way": ["[\"amenity\"=\"toilets\"]", "[\"diaper\"]","[\"diaper\"!=\"no\"]"], "node|way ": ["[\"shop\"=\"chemist\"]", "[\"diaper\"]", "[\"diaper\"!=\"no\"]"], "node|way  ": ["[\"diaper:access\"=\"public\"]"]}, "active": false, "layers": [], "coordinates": {"max": {"north": 0, "south": 0, "east": 0, "west": 0}, "current": {"north": 0, "south": 0, "east": 0, "west": 0}}, "usedBefore" : false, "color": profiles.lightgreyMarker},
14: {"query": {"node|way": ["[\"amenity\"=\"cafe\"]"]}, "active": false, "layers": [], "coordinates": {"max": {"north": 0, "south": 0, "east": 0, "west": 0}, "current": {"north": 0, "south": 0, "east": 0, "west": 0}}, "usedBefore" : false, "color": profiles.violetMarker},
15: {"query": {"node|way": ["[\"amenity\"=\"restaurant\"]"]}, "active": false, "layers": [], "coordinates": {"max": {"north": 0, "south": 0, "east": 0, "west": 0}, "current": {"north": 0, "south": 0, "east": 0, "west": 0}}, "usedBefore" : false, "color": profiles.lightvioletMarker}
};
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
}
function setFilter(id) {
	document.getElementById("query-button").removeAttribute("disabled");
	//Gets called when the user (un)checks a filter.
	if (filter[id].active) {
		//The filter is currently active, deactivate it because the user unchecked it.
		filter[id].active = false;
		//toggleLayers(id, 0) //Removes the POIs belonging to the filter from the map.
		//delete activeFilter[id];
	} else {
		//The filter is deactivated, activate it because the user checked it.
		filter[id].active = true;
		//activeFilter[id] = true;
		//toggleLayers(id, 1) //Adds the POIs belonging to the filter to the map.
	}
}
function initFilters() {
	//Creates the list of the filters for the user so he/she can (un)check.
	var oac = document.getElementById("filtersGround");
	if (oac == null) {
		return 0;
	}
	oac.innerHTML = "";
	for (var id in filter) { //Go throw the list of our filters.
		var fltr = filter[id];
		var label = document.createElement("label"); //Creates the surrounding container of checkbox and human readable name.
        var checkbox = document.createElement("input"); //Creates the checkbox itself.
        var span = document.createElement("span"); //Needed to have 'title' attribut supported
        var text = document.createTextNode(langRef[document.body.id][languageOfUser].filtername[id]); //The text inside the 'span' element.
        checkbox.type = "checkbox";
        checkbox.setAttribute("onclick", "setFilter(" + id + ")"); //Add function 'setFilter(id)'.
        span.setAttribute("title", "Filter: " + langRef[document.body.id][languageOfUser].filtername[id]); //Adds the title
        label.appendChild(checkbox); //Assigns the checkbox to the text node.
        span.appendChild(text); //Adds the human readable name of the filter to element 'span'
        label.appendChild(span); //Adds the 'span' element to the surrounding container. 
        oac.appendChild(label); //Finally adds the container itself to the filter list and displays it to the user.
	}
}
function groupIntoLayers(poi) {
	var marker;
	for (var fltr in activeFilter) { //Goes throw all active filters. (Those the user has currently selected).
		var query = filter[fltr].query; //Gets the list of queries the filter has.
		for (var type in query) { //Gets throw all the queries the filter has.
			var length = 0;
			var matches = 0; //Initiates the counter.
			type = query[type]; //Instead of its query name it gets the content of the type.
			length += type.length;
			for (var vle in type) {
				var item = "";
				var value = type[vle];
				value = value.replace("\"", "").replace("\"", "").replace("[", "").replace("]", "").replace("\"", "").replace("\"", "").split(new RegExp("[=~]")); //Splits the query into a pair of key, value.
				if (value.length == 2) {
					item = value[1].split("|");
				} else {
					item = value[0].split("|");
				}
				for (var i in item) {
					if (value.length == 1) {
						if (poi.tags[value] != undefined) {
							matches += 1; //Yes
						}
					} else if (value[0].indexOf("!") > -1) {
						if (poi.tags[value[0]] != item[i]) { //Has the POI not the same attribute like the filter we're checking against.
							matches += 1; //Yes
						}
					} else {
						if (poi.tags[value[0]] == item[i]) { //Has the POI the same attribute like the filter we're checking against.
							matches += 1; //Yes
						}
					}
				}
			}
			if (length == matches) { //Checks, if the amount of matches is equal to the amount of the matches it needs in order to have the POI grouped into this filter.
				marker = L.icon(Object.assign({}, filter[fltr].color, profiles.default));
				marker = L.marker([poi.lat, poi.lon], {icon: marker});
				filter[fltr].layers.push(marker); //Adds the POI to the filter's layers list.
				marker.name = langRef[document.body.id][languageOfUser].filtername[fltr];
				return marker;
		}
		}
	}
	marker = L.marker([poi.lat, poi.lon], {icon: L.icon(Object.assign({}, profiles.defaultMarker, profiles.default))});
	return marker;
}

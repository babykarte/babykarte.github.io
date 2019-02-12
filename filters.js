var activeFilter = {}; //Dictionary of the current selected filters
var filter = { //The filters, the query they trigger, their names and technical descriptions as dictionary (JSON)
0: {"name": "Kinderärzte", "query": ["\"healthcare\"=\"doctor\"", "\"healthcare:speciality\"=\"paediatrics\""], "active": false, "layers": [], "coordinates": {"max": {"north": 0, "south": 0, "east": 0, "west": 0}, "current": {"north": 0, "south": 0, "east": 0, "west": 0}}},
1: {"name": "Hebamme", "query": ["\"healthcare\"=\"midwife\""], "active": false, "layers": [], "coordinates": {"max": {"north": 0, "south": 0, "east": 0, "west": 0}, "current": {"north": 0, "south": 0, "east": 0, "west": 0}}},
2: {"name": "Spielplätze", "query": ["\"leisure\"=\"playground\""], "active": false, "layers": [], "coordinates": {"max": {"north": 0, "south": 0, "east": 0, "west": 0}, "current": {"north": 0, "south": 0, "east": 0, "west": 0}}},
3: {"name": "Babysachen einkaufen", "query": ["\"shop\"=\"baby_goods\""], "active": false, "layers": [], "coordinates": {"max": {"north": 0, "south": 0, "east": 0, "west": 0}, "current": {"north": 0, "south": 0, "east": 0, "west": 0}}},
4: {"name": "Spielsachen einkaufen", "query": ["\"shop\"=\"toys\""], "active": false, "layers": [], "coordinates": {"max": {"north": 0, "south": 0, "east": 0, "west": 0}, "current": {"north": 0, "south": 0, "east": 0, "west": 0}}},
5: {"name": "Kinderkleidung einkaufen", "query": ["\"shop\"=\"clothes\"", "\"clothes\"=\"babies|children\""], "active": false, "layers": [], "coordinates": {"max": {"north": 0, "south": 0, "east": 0, "west": 0}, "current": {"north": 0, "south": 0, "east": 0, "west": 0}}},
6: {"name": "Kindergärten", "query": ["\"amenity\"=\"kindergarten\""], "active": false, "layers": [], "coordinates": {"max": {"north": 0, "south": 0, "east": 0, "west": 0}, "current": {"north": 0, "south": 0, "east": 0, "west": 0}}},
7: {"name": "Zoo", "query": ["\"tourism\"=\"zoo\""], "active": false, "layers": [], "coordinates": {"max": {"north": 0, "south": 0, "east": 0, "west": 0}, "current": {"north": 0, "south": 0, "east": 0, "west": 0}}},
8: {"name": "Puppentheater", "query": ["\"amenity\"=\"theatre\"", "\"theatre:genre\"=puppet\""], "active": false, "layers": [], "coordinates": {"max": {"north": 0, "south": 0, "east": 0, "west": 0}, "current": {"north": 0, "south": 0, "east": 0, "west": 0}}},
9: {"name": "Tierattraktionen", "query": ["\"attraction\"=\"animal\""], "active": false, "layers": [], "coordinates": {"max": {"north": 0, "south": 0, "east": 0, "west": 0}, "current": {"north": 0, "south": 0, "east": 0, "west": 0}}},
10: {"name": "Wickelplätze", "query": ["\"diaper\"=\"yes\""], "active": false, "layers": [], "coordinates": {"max": {"north": 0, "south": 0, "east": 0, "west": 0}, "current": {"north": 0, "south": 0, "east": 0, "west": 0}}},
11: {"name": "Cafés", "query": ["\"amenity\"=\"cafe\""], "active": false, "layers": [], "coordinates": {"max": {"north": 0, "south": 0, "east": 0, "west": 0}, "current": {"north": 0, "south": 0, "east": 0, "west": 0}}},
12: {"name": "Restaurant", "query": ["\"amenity\"=\"restaurant\""], "active": false, "layers": [], "coordinates": {"max": {"north": 0, "south": 0, "east": 0, "west": 0}, "current": {"north": 0, "south": 0, "east": 0, "west": 0}}}
};
function toggleLayers(id, toggle) {
	if (toggle == 0) {
		if (filter[id].layers.length > 0) {
			for (var layer in filter[id].layers) {
				console.log(filter[id].layers[layer]);
				filter[id].layers[layer].removeFrom(map);
			}
		}
	} else {
		if (filter[id].layers.length > 0) {
			for (var layer in filter[id].layers) {
				filter[id].layers[layer].addTo(map);
			}
		}
	}
}
function setFilter(id) {
	document.getElementById("query-button").removeAttribute("disabled");
	//Gets called when the user (un)checks a filter.
	if (filter[id].active) {
		//The filter is currently active, deactivate it because the user unchecked it.
		filter[id].active = false;
		toggleLayers(id, 0) //Removes the POIs belonging to the filter from the map.
		delete activeFilter[id];
	} else {
		//The filter is deactivated, activate it because the user checked it.
		filter[id].active = true;
		activeFilter[id] = true;
		toggleLayers(id, 1) //Adds the POIs belonging to the filter from the map.
	}
}
function initFilters() {
	//Creates the list of the filters for the user so he/she can (un)check.
	var oac = document.getElementById("filtersGround");
	for (var id in filter) { //Go throw the list of our filters.
		var fltr = filter[id];
		var label = document.createElement("label"); //Creates the surrounding container of checkbox and human readable name.
        var checkbox = document.createElement("input"); //Creates the checkbox itself.
        checkbox.type = "checkbox";
        checkbox.setAttribute("onclick", "setFilter(" + id + ")"); //Add function 'setFilter(id)'.
        label.appendChild(checkbox); //Assigns the checkbox to the text node.
        label.appendChild(document.createTextNode(fltr.name)); //Creates the text node to display the human readable name and adds it to the container.
        oac.appendChild(label); //Finally adds the container itself to the filter list and displays it to the user.
	}
}
function groupIntoLayers(poi) {
	var marker = L.marker([poi.geometry.coordinates[1], poi.geometry.coordinates[0]])
	for (var fltr in activeFilter) {
		var matches = 0;
		var query = filter[fltr].query;
		for (var qry in query) {
			qry = query[qry];
			var name = qry.split("=");
			var value = name[1].replace("\"", "").replace("\"", "");
			name = name[0].replace("\"", "").replace("\"", "");
			console.log(name.replace("\"", "").replace("\"", ""));
			console.log(poi.properties.tags);
			console.log(poi.properties.tags[name] + " ? " + value);
			if (poi.properties.tags[name] == value) {
				console.log("  one match");
				matches += 1;
			}
		}
		if (query.length == matches) {
			filter[fltr].layers.push(marker);
			marker.name = filter[fltr].name;
			console.log(marker.name);
			return marker;
		}
	}
	return marker
}
initFilters();

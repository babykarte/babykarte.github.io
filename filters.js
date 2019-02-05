var activeFilter = {};
var filter = {
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
				layer.removeFrom(map);
			}
		}
	} else {
		if (filter[id].layers.length > 0) {
			for (var layer in filter[id].layers) {
				layer.addTo(map);
			}
		}
	}
}
function setFilter(id) {
	if (filter[id].active) {
		filter[id].active = false;
		toggleLayers(id, 0)
		delete activeFilter[id];
	} else {
		filter[id].active = true;
		activeFilter[id] = true;
		toggleLayers(id, 1)
	}
}
function initFilters() {
	var oac = document.getElementById("filtersGround");
	for (var id in filter) {
		var fltr = filter[id];
		var label = document.createElement("label");
        var checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.setAttribute("onclick", "setFilter(" + id + ")");
        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(fltr.name));
        oac.appendChild(label);
	}
}
function groupIntoLayers(poi) {
	var marker = L.marker([poi.geometry.coordinates[1], poi.geometry.coordinates[0]])
	for (var fltr in activeFilter) {
		var matches = 0;
		var query = filter[fltr].query;
		for (var qry in query) {
			var name = qry.split("=");
			var value = name[1];
			name = name[0];
			if (poi.properties.tags[name] == value) {
				matches += 1;
			}
		}
		if (query.length == matches) {
			filter[fltr].layers.push(marker);
			return marker
		}
	}
}
initFilters();

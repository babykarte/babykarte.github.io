var activeFilter = {}; //Dictionary of the current selected filters
var languageOfUser = navigator.language.toLowerCase();
var lang_default = "de";
/*Meaning of the abreviations used in 'langRef' JSON.
PDV - POI Details view (The view displayed to the user when the user clicks on a POI marker).
BTN - A 'button' element.
LNK - A 'a' (hyperlink) element.
TB - Textbox (or type 'text') element.
OH - Opening Hours
MI - More Information
*/
var langRef = {
"de": {
	"LOCATING_FAILURE": "Standort nicht ermittelbar",
	"LOCATING_SUCCESS": "Dein Standort.",
	"PDV_UNKNOWN": "Unbekannt",
	"PDV_TITLE_HOME": "Allgemein",
	"PDV_TITLE_BABY": "Babytauglichkeit",
	"PDV_TITLE_OH": "Öffnungszeiten",
	"PDV_TITLE_CONTACT": "Kontakt",
	"PDV_TITLE_MI": "Weitere informationen",
	"opening_hours": {"Mo" : "Montag", "Tu" : "Dienstag", "We" : "Mittwoch", "Th" : "Donnerstag", "Fr" : "Freitag", "Sa" : "Samstag", "Su" : "Sonntag", "off" : "geschlossen", "Jan" : "Januar", "Feb" : "Februar", "Mar" : "März", "Apr" : "April", "May" : "Mai", "Jun" : "Juni", "Jul" : "Juli", "Aug" : "August", "Sep" : "September", "Oct" : "Oktober", "Nov" : "November", "Dec" : "Dezember", "PH" : "Feiertag"},
	"filtername": {
		0: "Kinderärzte",
		1: "Hebamme",
		2: "Spielplätze",
		3: "Babysachen einkaufen",
		4: "Spielsachen einkaufen",
		5: "Kinderkleidung einkaufen",
		6: "Kindergärten",
		7: "Zoo",
		8: "Puppentheater",
		9: "Tierattraktionen",
		10: "Wickelplätze",
		11: "Cafés",
		12: "Restaurants"
	}
},
"en": {
	"LOCATING_FAILURE": "Did not find your position.",
	"LOCATING_SUCCESS": "Your position.",
	"PDV_UNKNOWN": "Unknown",
	"PDV_TITLE_HOME": "General",
	"PDV_TITLE_BABY": "Baby friendly",
	"PDV_TITLE_OH": "Opening hours",
	"PDV_TITLE_CONTACT": "Contact",
	"PDV_TITLE_MI": "More information",
	"BTN_APPLY_FILTERS": "Apply filters",
	"LNK_PROJECT_SITE": "About & Privacy Policy (german only)",
	"TB_SEARCHFIELD": "Place",
	"opening_hours": {"Mo" : "Monday", "Tu" : "Tuesday", "We" : "Wednesday", "Th" : "Thursday", "Fr" : "Friday", "Sa" : "Saturday", "Su" : "Sunday", "off" : "closed", "Jan" : "January", "Feb" : "February", "Mar" : "March", "Apr" : "April", "May" : "May", "Jun" : "June", "Jul" : "July", "Aug" : "August", "Sep" : "Septembre", "Oct" : "Oktobre", "Nov" : "Novembre", "Dec" : "Decembre", "PH" : "holiday"},
	"filtername": {
		0: "Paediatricians",
		1: "Midwifes",
		2: "Playgrounds",
		3: "Shop: baby goods",
		4: "Shop: Toys",
		5: "Shop: children clothes",
		6: "Kindergarten",
		7: "Zoo",
		8: "Puppet theatre",
		9: "Animal attractions",
		10: "Diapers",
		11: "Cafés",
		12: "Restaurants"
	}
}
};
//determine language of user
if (languageOfUser.indexOf("-") > -1) {
	languageOfUser = languageOfUser.split("-");
	languageOfUser = languageOfUser[0];
	var supported = false;
	for (var lang in langRef) {
		if (lang == languageOfUser) {
			supported = true;
			break;
		}
	}
	if (!supported) {
		//The user's language isn't supported, so we set it to standalone german.
		languageOfUser = lang_default;
	}
}
var filter = { //The filters, the query they trigger, their names and technical descriptions as dictionary (JSON)
0: {"query": ["\"healthcare\"=\"doctor\"", "\"healthcare:speciality\"=\"paediatrics\""], "active": false, "layers": [], "coordinates": {"max": {"north": 0, "south": 0, "east": 0, "west": 0}, "current": {"north": 0, "south": 0, "east": 0, "west": 0}}, "usedBefore" : false},
1: {"query": ["\"healthcare\"=\"midwife\""], "active": false, "layers": [], "coordinates": {"max": {"north": 0, "south": 0, "east": 0, "west": 0}, "current": {"north": 0, "south": 0, "east": 0, "west": 0}}, "usedBefore" : false},
2: {"query": ["\"leisure\"=\"playground\""], "active": false, "layers": [], "coordinates": {"max": {"north": 0, "south": 0, "east": 0, "west": 0}, "current": {"north": 0, "south": 0, "east": 0, "west": 0}}, "usedBefore" : false},
3: {"query": ["\"shop\"=\"baby_goods\""], "active": false, "layers": [], "coordinates": {"max": {"north": 0, "south": 0, "east": 0, "west": 0}, "current": {"north": 0, "south": 0, "east": 0, "west": 0}}, "usedBefore" : false},
4: {"query": ["\"shop\"=\"toys\""], "active": false, "layers": [], "coordinates": {"max": {"north": 0, "south": 0, "east": 0, "west": 0}, "current": {"north": 0, "south": 0, "east": 0, "west": 0}}, "usedBefore" : false},
5: {"query": ["\"shop\"=\"clothes\"", "\"clothes\"=\"babies|children\""], "active": false, "layers": [], "coordinates": {"max": {"north": 0, "south": 0, "east": 0, "west": 0}, "current": {"north": 0, "south": 0, "east": 0, "west": 0}}, "usedBefore" : false},
6: {"query": ["\"amenity\"=\"kindergarten\""], "active": false, "layers": [], "coordinates": {"max": {"north": 0, "south": 0, "east": 0, "west": 0}, "current": {"north": 0, "south": 0, "east": 0, "west": 0}}, "usedBefore" : false},
7: {"query": ["\"tourism\"=\"zoo\""], "active": false, "layers": [], "coordinates": {"max": {"north": 0, "south": 0, "east": 0, "west": 0}, "current": {"north": 0, "south": 0, "east": 0, "west": 0}}, "usedBefore" : false},
8: {"query": ["\"amenity\"=\"theatre\"", "\"theatre:genre\"=puppet\""], "active": false, "layers": [], "coordinates": {"max": {"north": 0, "south": 0, "east": 0, "west": 0}, "current": {"north": 0, "south": 0, "east": 0, "west": 0}}, "usedBefore" : false},
9: {"query": ["\"attraction\"=\"animal\""], "active": false, "layers": [], "coordinates": {"max": {"north": 0, "south": 0, "east": 0, "west": 0}, "current": {"north": 0, "south": 0, "east": 0, "west": 0}}, "usedBefore" : false},
10: {"query": ["\"diaper\"=\"yes\""], "active": false, "layers": [], "coordinates": {"max": {"north": 0, "south": 0, "east": 0, "west": 0}, "current": {"north": 0, "south": 0, "east": 0, "west": 0}}, "usedBefore" : false},
11: {"query": ["\"amenity\"=\"cafe\""], "active": false, "layers": [], "coordinates": {"max": {"north": 0, "south": 0, "east": 0, "west": 0}, "current": {"north": 0, "south": 0, "east": 0, "west": 0}}, "usedBefore" : false},
12: {"query": ["\"amenity\"=\"restaurant\""], "active": false, "layers": [], "coordinates": {"max": {"north": 0, "south": 0, "east": 0, "west": 0}, "current": {"north": 0, "south": 0, "east": 0, "west": 0}}, "usedBefore" : false}
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
        var span = document.createElement("span"); //Needed to have 'title' attribut supported
        var text = document.createTextNode(langRef[languageOfUser].filtername[id]); //The text inside the 'span' element.
        checkbox.type = "checkbox";
        checkbox.setAttribute("onclick", "setFilter(" + id + ")"); //Add function 'setFilter(id)'.
        span.setAttribute("title", "Filter: " + langRef[languageOfUser].filtername[id]); //Adds the title
        label.appendChild(checkbox); //Assigns the checkbox to the text node.
        span.appendChild(text); //Adds the human readable name of the filter to element 'span'
        label.appendChild(span); //Adds the 'span' element to the surrounding container. 
        oac.appendChild(label); //Finally adds the container itself to the filter list and displays it to the user.
	}
}
function groupIntoLayers(poi) {
	var marker = L.marker([poi.geometry.coordinates[1], poi.geometry.coordinates[0]]) //Creates the marker with the POI coordinates.
	for (var fltr in activeFilter) { //Goes throw all active filters. (Those the user has currently selected).
		var matches = 0; //Initiates the counter.
		var query = filter[fltr].query; //Gets the list of queries the filter has.
		for (var qry in query) { //Gets throw all the queries the filter has.
			qry = query[qry]; //Instead of its array position it gets the query itself.
			var name = qry.split("="); //Splits the query into a pair of key, value.
			var value = name[1].replace("\"", "").replace("\"", ""); //Removes chars Overpass needs. They don't help here.
			name = name[0].replace("\"", "").replace("\"", ""); //Removes chars Overpass needs. They don't help here.
			if (poi.properties.tags[name] == value) { //Has the POI the same attribute like the filter we're checking against.
				matches += 1; //Yes
			}
		}
		if (query.length == matches) { //Checks, if the amount of matches is equal to the amount of the matches it needs in order to have the POI grouped into this filter.
			filter[fltr].layers.push(marker); //Adds the POI to the filter's layers list.
			marker.name = langRef[languageOfUser].filtername[fltr];
			return marker;
		}
	}
	return marker;
}
initFilters();
document.body.onload = function() {
	if (languageOfUser != "de") {
		document.getElementById("query-button").value = langRef[languageOfUser].BTN_APPLY_FILTERS;
		document.getElementById("linkToProject").innerHTML = langRef[languageOfUser].LNK_PROJECT_SITE;
		document.getElementById("searchfield").placeholder = langRef[languageOfUser].TB_SEARCHFIELD;
	}
};

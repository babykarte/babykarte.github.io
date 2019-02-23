var activeFilter = {}; //Dictionary of the current selected filters
var languageOfUser = navigator.language.toLowerCase();
var lang_default = "de";
/*Meaning of the abreviations used in 'langRef' JSON.
PDV - POI Details view (The view displayed to the user when the user clicks on a POI marker).
BTN - A 'button' element.
LNK - A 'a' (hyperlink) element.
TB - Textbox (or input type 'text') element.
OH - Opening Hours
MI - More Information
*/
var langRef = {
"de": {
	"LOCATING_FAILURE": "Standort nicht ermittelbar",
	"LOCATING_SUCCESS": "Dein Standort.",
	"LNK_OSM_EDIT": "Mit OSM editieren",
	"LNK_OSM_REPORT": "Falschinformationen melden",
	"LNK_OSM_VIEW": "POI in OpenStreetMap ansehen",
	"PDV_UNKNOWN": "Unbekannt",
	"PDV_TITLE_HOME": "Allgemein",
	"PDV_TITLE_BABY": "Babytauglichkeit",
	"PDV_TITLE_OH": "Öffnungszeiten",
	"PDV_TITLE_CONTACT": "Kontakt",
	"PDV_TITLE_MI": "Weitere informationen",
	"PDV_DIAPER_YES": "Wickeltisch vorhanden",
	"PDV_DIAPER_BENCH": "Kein Wickeltisch, aber Bank auf der Toilette",
	"PDV_DIAPER_ROOM": "Wickelraum",
	"PDV_DIAPER_MALE": "Wickeltisch in der Herrentoilette",
	"PDV_DIAPER_FEMALE": "Wickeltisch in der Damentoilette",
	"PDV_DIAPER_UNISEX": "Wickeltisch in der Unisextoilette",
	"PDV_DIAPER_FEE": "Kostenpflichtiger Wickeltisch",
	"PDV_DIAPER_FEE_NO": "Kostenloser Wickeltisch",
	"TOILET": "Toiletten",
	"BTN_APPLY_FILTERS": "Filter anwenden",
	"LNK_PROJECT_SITE": "Über das Projekt & Datenschutzerklärung",
	"TB_SEARCHFIELD": "Ort",
	"opening_hours": {"Mo" : "Montag", "Tu" : "Dienstag", "We" : "Mittwoch", "Th" : "Donnerstag", "Fr" : "Freitag", "Sa" : "Samstag", "Su" : "Sonntag", "off" : "geschlossen", "Jan" : "Januar", "Feb" : "Februar", "Mar" : "März", "Apr" : "April", "May" : "Mai", "Jun" : "Juni", "Jul" : "Juli", "Aug" : "August", "Sep" : "September", "Oct" : "Oktober", "Nov" : "November", "Dec" : "Dezember", "PH" : "Feiertag"},
	"filtername": {
		0: "Kinderärzte",
		1: "Hebamme",
		2: "Spielplätze",
		3: "Parks",
		4: "Babysachen einkaufen",
		5: "Spielsachen einkaufen",
		6: "Kinderkleidung einkaufen",
		7: "Kindergärten",
		8: "Zoo",
		9: "Puppentheater",
		10: "Tierattraktionen",
		11: "Toiletten",
		12: "Wickelplätze",
		13: "Cafés",
		14: "Restaurants"
	}
},
"en": {
	"LOCATING_FAILURE": "Did not find your position.",
	"LOCATING_SUCCESS": "Your position.",
	"LNK_OSM_EDIT": "Edit via OSM",
	"LNK_OSM_REPORT": "Report wrong information",
	"LNK_OSM_VIEW": "View POI in OpenStreetMap",
	"PDV_UNKNOWN": "Unknown",
	"PDV_TITLE_HOME": "General",
	"PDV_TITLE_BABY": "Baby friendly",
	"PDV_TITLE_OH": "Opening hours",
	"PDV_TITLE_CONTACT": "Contact",
	"PDV_TITLE_MI": "More information",
	"PDV_DIAPER": "Wickeltisch(e):",
	"PDV_DIAPER_YES": "Diaper available",
	"PDV_DIAPER_BENCH": "No diaper, but bench in the restroom",
	"PDV_DIAPER_ROOM": "Baby changing room",
	"PDV_DIAPER_MALE": "Diaper in the men's toilet",
	"PDV_DIAPER_FEMALE": "Diaper in the women's toilet",
	"PDV_DIAPER_UNISEX": "Diaper in the Unisex toilet",
	"PDV_DIAPER_FEE": "Diaper fee",
	"PDV_DIAPER_FEE_NO": "Free diaper",
	"TOILET": "Toilets",
	"BTN_APPLY_FILTERS": "Apply filters",
	"LNK_PROJECT_SITE": "About & Privacy Policy (german only)",
	"TB_SEARCHFIELD": "Place",
	"opening_hours": {"Mo" : "Monday", "Tu" : "Tuesday", "We" : "Wednesday", "Th" : "Thursday", "Fr" : "Friday", "Sa" : "Saturday", "Su" : "Sunday", "off" : "closed", "Jan" : "January", "Feb" : "February", "Mar" : "March", "Apr" : "April", "May" : "May", "Jun" : "June", "Jul" : "July", "Aug" : "August", "Sep" : "Septembre", "Oct" : "Oktobre", "Nov" : "Novembre", "Dec" : "Decembre", "PH" : "holiday"},
	"filtername": {
		0: "Paediatricians",
		1: "Midwifes",
		2: "Playgrounds",
		3: "Parks",
		4: "Shop: baby goods",
		5: "Shop: Toys",
		6: "Shop: children clothes",
		7: "Kindergarten",
		8: "Zoo",
		9: "Puppet theatre",
		10: "Animal attractions",
		11: "Toilets",
		12: "Diapers",
		13: "Cafés",
		14: "Restaurants"
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
0: {"query": ["[\"healthcare\"=\"doctor\"]", "[\"healthcare:speciality\"=\"paediatrics\"]"], "active": false, "layers": [], "coordinates": {"max": {"north": 0, "south": 0, "east": 0, "west": 0}, "current": {"north": 0, "south": 0, "east": 0, "west": 0}}, "usedBefore" : false},
1: {"query": ["[\"healthcare\"=\"midwife\"]"], "active": false, "layers": [], "coordinates": {"max": {"north": 0, "south": 0, "east": 0, "west": 0}, "current": {"north": 0, "south": 0, "east": 0, "west": 0}}, "usedBefore" : false},
2: {"query": ["[\"leisure\"=\"playground\"]"], "active": false, "layers": [], "coordinates": {"max": {"north": 0, "south": 0, "east": 0, "west": 0}, "current": {"north": 0, "south": 0, "east": 0, "west": 0}}, "usedBefore" : false},
3: {"query": ["[\"leisure\"=\"park\"]"], "active": false, "layers": [], "coordinates": {"max": {"north": 0, "south": 0, "east": 0, "west": 0}, "current": {"north": 0, "south": 0, "east": 0, "west": 0}}, "usedBefore" : false},
4: {"query": ["[\"shop\"=\"baby_goods\"]"], "active": false, "layers": [], "coordinates": {"max": {"north": 0, "south": 0, "east": 0, "west": 0}, "current": {"north": 0, "south": 0, "east": 0, "west": 0}}, "usedBefore" : false},
5: {"query": ["[\"shop\"=\"toys\"]"], "active": false, "layers": [], "coordinates": {"max": {"north": 0, "south": 0, "east": 0, "west": 0}, "current": {"north": 0, "south": 0, "east": 0, "west": 0}}, "usedBefore" : false},
6: {"query": ["[\"shop\"=\"clothes\"]", "\"clothes\"=\"babies|children\""], "active": false, "layers": [], "coordinates": {"max": {"north": 0, "south": 0, "east": 0, "west": 0}, "current": {"north": 0, "south": 0, "east": 0, "west": 0}}, "usedBefore" : false},
7: {"query": ["[\"amenity\"~\"kindergarten|childcare\"]"], "active": false, "layers": [], "coordinates": {"max": {"north": 0, "south": 0, "east": 0, "west": 0}, "current": {"north": 0, "south": 0, "east": 0, "west": 0}}, "usedBefore" : false},
8: {"query": ["[\"tourism\"=\"zoo\"]"], "active": false, "layers": [], "coordinates": {"max": {"north": 0, "south": 0, "east": 0, "west": 0}, "current": {"north": 0, "south": 0, "east": 0, "west": 0}}, "usedBefore" : false},
9: {"query": ["[\"amenity\"=\"theatre\"]", "\"theatre:genre\"=puppet\""], "active": false, "layers": [], "coordinates": {"max": {"north": 0, "south": 0, "east": 0, "west": 0}, "current": {"north": 0, "south": 0, "east": 0, "west": 0}}, "usedBefore" : false},
10: {"query": ["[\"attraction\"=\"animal\"]"], "active": false, "layers": [], "coordinates": {"max": {"north": 0, "south": 0, "east": 0, "west": 0}, "current": {"north": 0, "south": 0, "east": 0, "west": 0}}, "usedBefore" : false},
11: {"query": ["[\"amenity\"=\"toilets\"]"], "active": false, "layers": [], "coordinates": {"max": {"north": 0, "south": 0, "east": 0, "west": 0}, "current": {"north": 0, "south": 0, "east": 0, "west": 0}}, "usedBefore" : false},
12: {"query": ["[\"diaper\"!=\"no\"]"], "active": false, "layers": [], "coordinates": {"max": {"north": 0, "south": 0, "east": 0, "west": 0}, "current": {"north": 0, "south": 0, "east": 0, "west": 0}}, "usedBefore" : false},
13: {"query": ["[\"amenity\"=\"cafe\"]"], "active": false, "layers": [], "coordinates": {"max": {"north": 0, "south": 0, "east": 0, "west": 0}, "current": {"north": 0, "south": 0, "east": 0, "west": 0}}, "usedBefore" : false},
14: {"query": ["[\"amenity\"=\"restaurant\"]"], "active": false, "layers": [], "coordinates": {"max": {"north": 0, "south": 0, "east": 0, "west": 0}, "current": {"north": 0, "south": 0, "east": 0, "west": 0}}, "usedBefore" : false}
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
	oac.innerHTML = "";
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
			var name = qry.replace("\"", "").replace("\"", "").replace("[", "").replace("]", "").split(new RegExp("[=~]")); //Splits the query into a pair of key, value.
			var value = name[1].replace("\"", "").replace("\"", "").split("|"); //Removes chars Overpass needs. They don't help here.
			name = name[0].replace("\"", "").replace("\"", ""); //Removes chars Overpass needs. They don't help here.
			for (var vle in value) {
				if (value[vle].indexOf("!") > -1) {
					if (poi.properties.tags[name] != value[vle]) { //Has the POI not the same attribute like the filter we're checking against.
						matches += 1; //Yes
						break;
					}
				} else {
					if (poi.properties.tags[name] == value[vle]) { //Has the POI the same attribute like the filter we're checking against.
						matches += 1; //Yes
						break;
					}
				}
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
function setLang(e, lang) {
	if (lang != undefined) {
		languageOfUser = lang;
	}
	document.getElementById("query-button").value = langRef[languageOfUser].BTN_APPLY_FILTERS;
	document.getElementById("linkToProject").innerHTML = langRef[languageOfUser].LNK_PROJECT_SITE;
	document.getElementById("searchfield").placeholder = langRef[languageOfUser].TB_SEARCHFIELD;
	initFilters();
}
document.body.onload = setLang;

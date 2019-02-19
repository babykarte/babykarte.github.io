function locationFound(e) {
	//Clicks on the button, so we jump to the coordinates of the user.
	document.getElementById('query-button').click();
	//Fires the notification that Babykarte shows the location of the user.
	showGlobalPopup(langRef[languageOfUser].LOCATING_SUCCESS);
	progressbar();
}
function locationError(e) {
	//Fires the notification that Babykarte shows NOT the location of the user, because it has no permission to do so.
	showGlobalPopup(langRef[languageOfUser].LOCATING_FAILURE);
	progressbar();
}
function checkboxes2overpass(bounds, actFilter) {
	if (!bounds) {
		bounds = map.getBounds().getSouth() + ',' + map.getBounds().getWest() + ',' + map.getBounds().getNorth() + ',' + map.getBounds().getEast();
	}
	if (!actFilter) {
		actFilter = activeFilter;
	}
	var andquery = "(";
	for (var id in actFilter) {
		var value = filter[id].query;
		andquery += "node"
		for (var i in value) {
			andquery += "[" + value[i] + "]";
		}
		andquery += "(" + bounds + ");way";
		for (var i in value) {
			andquery += "[" + value[i] + "]";
		}
			andquery += "(" + bounds + ");";
	}
	return andquery + ");";
}
function locateNewArea(fltr, maxNorth, maxSouth, maxWest, maxEast) {
	//Complex algorithm. It calculates the coordinates when the user moves the map. Then the coordinates will be used to fetch just more POIs without overwriting/overlaying the existing ones.
	//NORTH: Number increases when moving to the top (North)
	//SOUTH: Number decreases when moving to the bottom (South)
	//WEST: Number decreases when moving to the left (West)
	//EAST: Number increases when moving to the right (East)
	var accuracy = 0.001;
	var clear = 0;
	var loadingAllowed = false;
	var south_new = map.getBounds().getSouth();
	var west_new = map.getBounds().getWest();
	var north_new = map.getBounds().getNorth();
	var east_new = map.getBounds().getEast();
	var north_old = filter[fltr].coordinates.current.north;
	var east_old = filter[fltr].coordinates.current.east;
	var south_old = filter[fltr].coordinates.current.south;
	var west_old = filter[fltr].coordinates.current.west;
	if (north_new - north_old >= accuracy && west_old - west_new >= accuracy) {
		//Possible bug
		south_new = north_old;
		east_new = west_old;
		if (north_new > maxNorth && maxWest > west_new) {
			loadingAllowed = true;
			maxNorth = north_new;
			maxWest = west_new;
		}
	} else if (north_new - north_old >= accuracy) {
		south_new = north_old;
		if (north_new > maxNorth) {
			loadingAllowed = true;
			south_new = maxNorth;
			maxNorth = north_new;
			
		}
	} else if (north_new - north_old >= accuracy && east_new - east_old >= accuracy) {
		south_new = north_old;
		west_new = east_old;
		if (north_new > maxNorth && east_new > maxEast) {
			loadingAllowed = true;
			clear = 1;
			maxNorth = north_new;
			maxEast = east_new;
		}
	} else if (east_new - east_old >= accuracy) {
		west_new = east_old;
		if (east_new > maxEast) {
			loadingAllowed = true;
			west_new = maxEast;
			maxEast = east_new;
		}
	} else if (east_new - east_old >= accuracy && south_old - south_new >= accuracy) {
		west_new = east_old;
		north_new = south_old;
		if (east_new > maxEast && maxSouth > south_new) {
			loadingAllowed = true;
			clear = 1;
			maxEast = east_new;
			maxSouth = south_new;
		}
	} else if (south_old - south_new >= accuracy) {
		north_new = south_old;
		if (maxSouth > south_new) {
			loadingAllowed = true;
			north_new = maxSouth;
			maxSouth = south_new;
		}
	} else if (south_old - south_new >= accuracy && west_old - west_new >= accuracy) {
		//Possible bug
		north_new = south_old;
		east_new = west_old;
		if (maxSouth > south_new && maxWest > west_new) {
			loadingAllowed = true;
			clear = 1;
			maxSouth = south_new;
			maxWest = west_new;
		}
	} else if (west_old - west_new >= accuracy) {
		//Possible no bug but on watchlist
		east_new = west_old;
		if (maxWest > west_new) {
			loadingAllowed = true;
			east_new = maxWest;
			maxWest = west_new;
		}
	}
	filter[fltr].coordinates.current.north = north_new;
	filter[fltr].coordinates.current.south = south_new;
	filter[fltr].coordinates.current.west = west_new;
	filter[fltr].coordinates.current.east = east_new;
	if (loadingAllowed) {
		var dict = {};
		dict[fltr] = true;
		filter[fltr].coordinates.max.south = maxSouth;
		filter[fltr].coordinates.max.west = maxWest;
		filter[fltr].coordinates.max.north = maxNorth;
		filter[fltr].coordinates.max.east = maxEast;
		console.log(String(south_new) + "," + String(west_new) + "," + String(north_new) + "," + String(east_new));
		return checkboxes2overpass(String(south_new) + "," + String(west_new) + "," + String(north_new) + "," + String(east_new), dict);
	}
	return false;
}
function locateNewAreaBasedOnFilter() {
	//Wrapper around locateNewArea().
	//Adds filter compactibility to locateNewArea() function.
	var url = "";
	var result = "";
	for (var fltr in activeFilter) {
		if (!filter[fltr].usedBefore) {
			filter[fltr].usedBefore = true;
			filter[fltr].coordinates.current.south = map.getBounds().getSouth();
			filter[fltr].coordinates.current.west = map.getBounds().getWest();
			filter[fltr].coordinates.current.north = map.getBounds().getNorth();
			filter[fltr].coordinates.current.east = map.getBounds().getEast();
			filter[fltr].coordinates.max.south = map.getBounds().getSouth();
			filter[fltr].coordinates.max.west = map.getBounds().getWest();
			filter[fltr].coordinates.max.north = map.getBounds().getNorth();
			filter[fltr].coordinates.max.east = map.getBounds().getEast();
		}
		result = locateNewArea(fltr, filter[fltr].coordinates.max.north, filter[fltr].coordinates.max.south, filter[fltr].coordinates.max.west, filter[fltr].coordinates.max.east);
		if (result) {
			url += result
		} else {
			console.log("Filter '" + langRef[languageOfUser].filtername[fltr] + "' doesn't need to be queried to OSM Server");
		}
		url = url.replace(");(", "") //Removes the delimiter between Overpass union syntax, because we want to have just one 'union' tag. Combines two (or more 'union's (we're in a loop)) into one.
		fltr++;
	}
	loadPOIS("", url);
}
function parseOpening_hours(value) {
	//Parsing opening hours syntax of OSM.
	// var toTranslate = {"<OSM expression>": "<human expression, will be shown to user instead of <OSM expression>>", ...}
	var toTranslate = langRef[languageOfUser].opening_hours;
	var syntaxToHTML = {"; " : "<br/>", ";" : "<br/>",  "," : ", ", "-" : " - "}
	//Translates by replacing <OSM expression>'s with the respective <human expression>'s.
	for (var item in toTranslate) {
		value = value.replace(new RegExp(item, "g"), "<b>" + toTranslate[item] + "</b>");
	}
	//Do some translating of special command chars into HTML code or beautiful looking human speech.
	for (var item in syntaxToHTML) {
		value = value.replace(new RegExp(item, "g"), "<b>" + syntaxToHTML[item] + "</b>");
	}
   	return value
}
function buildOverpassApiUrlFromCheckboxes(overpassQuery) {
	//Wrapper araund checkboxes2overpass() function to support filters.
	/*south_old = map.getBounds().getSouth();
	west_old = map.getBounds().getWest();
	north_old = map.getBounds().getNorth();
	east_old = map.getBounds().getSouth();*/
	if (!overpassQuery) {
		overpassQuery = checkboxes2overpass();
	}
	var query = "?data=[out:json][timeout:15];" + overpassQuery + "out body center;";
	var baseUrl = "https://overpass-api.de/api/interpreter";
	var resultUrl = baseUrl + query;
	return resultUrl;
}
function addrTrigger(poi, marker) {
	marker.on("click", function() {
		if (marker.popupContent.indexOf("%data_address%") > -1) {
			$.get("https://nominatim.openstreetmap.org/reverse?accept-language=" + languageOfUser + "&format=json&osm_type=" + String(poi.properties.type)[0].toUpperCase() + "&osm_id=" + String(poi.properties.id), function(data, status, xhr, trash) {
				var address = data["address"];
				var street = address["road"] || address["pedestrian"] || address["street"] || address["footway"] || address["path"];
				var housenumber = address["housenumber"] || address["house_number"] || "";
				var postcode = address["postcode"] || "";
				var city = address["city"] || address["town"] || address["county"] || address["state"] || "Kommune unbekannt"
				marker.popupContent = marker.popupContent.replace("%data_address%", street + " " + housenumber + "<br/>" + postcode + " " + city)
				marker.bindPopup(marker.popupContent);
				marker.openPopup();
			});
		}
	});
	return "%data_address%";
}
function toggleTab(id) {
	var tab = document.getElementById(id);
	var tabs = document.getElementsByClassName("tabcontent");
	for (var item = 0;item < tabs.length;item++) {
		tabs[item].style.display = "none";
	}
	tab.style.display = "block";
}
function loadPOIS(e, url) {
	progressbar(50);
	//Main function of POI loading.
	//Handles connection to OSM Overpass server and parses the response into beautiful looking details view for each POI
	document.getElementById("query-button").setAttribute("disabled", true);
	if (!url) {
		//No url was specified, because none of the filter functions called it.
		url = buildOverpassApiUrlFromCheckboxes();
	} else {
		url = "https://overpass-api.de/api/interpreter?data=[out:json][timeout:15];" + url + "out body center;";
	}
	//Connect to OSM server
	$.get(url, function (osmDataAsJson) {
		//Convert to GEOjson, a special format for handling with coordinate details (POI's).
		var resultAsGeojson = osmtogeojson(osmDataAsJson);
		for (var poi in resultAsGeojson.features) {
			var marker;
			var popupContent = "";
			var poi = resultAsGeojson.features[poi];
			var classId = String(poi.properties.type)[0].toUpperCase() + String(poi.properties.id);
			//creates a new Marker() Object and groups into the layers given by our filters.
			marker = groupIntoLayers(poi);
			var details_data = {"home": {"elements": {"<h1>%s</h1>": String(poi.properties.tags["name"]) || String(langRef[languageOfUser].PDV_UNKNOWN), "<h2>%s</h2>": String(marker.name), "%s": addrTrigger}, "symbol": "/home2.svg", "title": String(langRef[languageOfUser].PDV_TITLE_HOME)},
			"baby": {"elements": {}, "symbol": "/baby.svg", "title": langRef[languageOfUser].PDV_TITLE_BABY},
			"opening_hours": {"elements": {}, "symbol": "/clock.png", "title": langRef[languageOfUser].PDV_TITLE_OH},
			"contact": {"elements": {}, "symbol": "", "title": langRef[languageOfUser].PDV_TITLE_CONTACT},
			"furtherInfos": {"elements": {}, "symbol": "", "title": langRef[languageOfUser].PDV_TITLE_MI}
			};
			for (var entry in details_data) {
				popupContent += "<img class='pdv-icon' onclick='toggleTab(\"" + classId + entry + "\")' src='" + details_data[entry].symbol + "' alt='" + details_data[entry].title + "' title='" + details_data[entry].title + "' />"
			}
			for (var entry in details_data) {
				popupContent += "<div class='tabcontent' id='" + classId + entry + "'>";
				for (var elem in details_data[entry].elements) {
					if (typeof(details_data[entry].elements[elem]) == "function") {
						popupContent += elem.replace("%s", details_data[entry].elements[elem](poi, marker))
					} else {
						popupContent += elem.replace("%s", details_data[entry].elements[elem])
					}
				}
				popupContent += "</div>";
			}
			//Analysing, filtering and preparing for display of the OSM keys
			
			//and then finally add then to Popup
			marker.popupContent = popupContent + "<a target=\"_blank\" title=\"Bei OSM registrierte Nutzer können diese POI direkt bearbeiten. Veraltete Informationen raus nehmen und neue hinzufügen.\" href=\"https://www.openstreetmap.org/edit?" + String(poi.properties.type) + "=" + String(poi.properties.id) + "\">Mit OSM editieren</a>&nbsp;&nbsp;<a target=\"_blank\" title=\"Eine falsche Information entdeckt? Informiere mithilfe dieses Linkes die OSM Community.\" href=\"https://www.openstreetmap.org/note/new#map=15/" + poi.geometry.coordinates[1] + "/" + poi.geometry.coordinates[0] + "&layers=N\">Falschinformation melden</a>";;
			marker.bindPopup(marker.popupContent);
			//Show marker on map
			marker.addTo(map);
			progressbar();
		}
	});
}
function getStateFromHash() {
	var hash = location.hash;
	if (hash != "") {
		hash = hash.replace("#", "").split("&");
		zoomLevel = Number(hash[0]);
		saved_lat = Number(hash[1]);
		saved_lon = Number(hash[2]);
		map.setView([saved_lat, saved_lon], zoomLevel);
	}
}
//init map
progressbar(30);
var map = L.map('map')
map.options.maxZoom = 19;
map.options.minZoom = 10;
map.setView([saved_lat, saved_lon], 15);
maxSouth = map.getBounds().getSouth();
maxWest = map.getBounds().getWest();
getStateFromHash();
map.on("locationfound", locationFound);
map.on("locationerror", locationError);
map.on("click", function(e) {location.hash = String(map.getZoom()) + "&" + String(e.latlng.lat) + "&" + String(e.latlng.lng);})
map.on("moveend", locateNewAreaBasedOnFilter);
var Layergroup = new L.LayerGroup();
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: 'Map data &copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> contributors</a>, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Map Tiles &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);
map.locate({setView: true});
progressbar(50);
//load POIs
document.getElementById("query-button").onclick = loadPOIS;
document.getElementById("query-button").setAttribute("disabled", true);

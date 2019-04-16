var zoomLevel = "";
var colorcode = {"yes": "color-green", "no": "color-red", "room": "color-green", "bench": "color-green", undefined: "color-grey", "limited": "color-yellow"}
var babyData = {"diaper": {"values": ["yes", "no", "room", "bench", undefined, "*"],
					"children": {"female" : {"values": ["yes", "no", undefined]},
								"male" : {"values": ["yes", "no", undefined]},
								"unisex": {"values": ["yes", "no", undefined]},
								"fee" : {"values": ["yes", "no", undefined, "*"]},
								"description": {"values": [undefined, "*"]}
								}
							},
				"highchair": {"values": ["yes", "no", undefined, "*"]},
				"stroller": {"values": ["yes", "limited", "no", undefined],
					"children": {"description": {"values" : [undefined, "*"]}}
							},
				"kids_area": {"values": ["yes", "no", undefined],
					"children": {"indoor" :  {"values": ["yes", "no", undefined]},
								"outdoor": {"values": ["yes", "no", undefined]},
								"supervised": {"values": ["yes", "no", undefined]},
								"fee": {"values": ["yes", "no", undefined]}
								}
							},
				"baby_feeding": {"values": ["yes", "no", "room", undefined],
					"children": {"female" : {"values": ["yes", "no", undefined]},
								"male" : {"values": ["yes", "no", undefined]}
								}
							}
				}
function locationFound(e) {
	//Fires the notification that Babykarte shows the location of the user.
	showGlobalPopup(getText().LOCATING_SUCCESS);
	progressbar();
}
function locationError(e) {
	//Fires the notification that Babykarte shows NOT the location of the user, because it has no permission to do so.
	showGlobalPopup(getText().LOCATING_FAILURE);
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
		for (var value in filter[id].query) {
			var content = filter[id].query[value];
			value = value.trim();
			value = value.split("|");
			for (var type in value) {
				andquery += value[type];
				for (var i in content) {
					andquery += content[i];
				}
				andquery += "(" + bounds + ");"
			}
		}
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
		north_new = south_old;
		east_new = west_old;
		if (maxSouth > south_new && maxWest > west_new) {
			loadingAllowed = true;
			clear = 1;
			maxSouth = south_new;
			maxWest = west_new;
		}
	} else if (west_old - west_new >= accuracy) {
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
		if (south_new == 0) {
			south_new = map.getBounds().getSouth();
		}
		/*toggleLayers(fltr, 0);
		filter[fltr].layers = [];*/
		return checkboxes2overpass(String(south_new) + "," + String(west_new) + "," + String(north_new) + "," + String(east_new), dict);
	}
	return false;
}
function setCoordinates(fltr) {
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
function resetFilter(fltr) {
	filter[fltr].usedBefore = true;
	filter[fltr].coordinates.current.south = 0;
	filter[fltr].coordinates.current.west = 0;
	filter[fltr].coordinates.current.north = 0;
	filter[fltr].coordinates.current.east = 0;
	filter[fltr].coordinates.max.south = 0;
	filter[fltr].coordinates.max.west = 0;
	filter[fltr].coordinates.max.north = 0;
	filter[fltr].coordinates.max.east = 0;
	filter[fltr].layers = [];
}
function locateNewAreaBasedOnFilter() {
	//Wrapper around locateNewArea().
	//Adds filter compactibility to locateNewArea() function.
	var url = "";
	var result = "";
	for (var fltr in activeFilter) {
		result = locateNewArea(fltr, filter[fltr].coordinates.max.north, filter[fltr].coordinates.max.south, filter[fltr].coordinates.max.west, filter[fltr].coordinates.max.east);
		if (!filter[fltr].usedBefore) { setCoordinates(fltr); }
		if (result) {
			url += result
		}
		url = url.replace(");(", "") //Removes the delimiter between Overpass union syntax, because we want to have just one 'union' tag. Combines two (or more 'union's (we're in a loop)) into one.
		fltr++;
	}
	return url
}
function onMapMove() {
	loadPOIS("", locateNewAreaBasedOnFilter());
}
function onMapZoom() {
	var newZoomLevel = String(map.getZoom());
	if (zoomLevel > newZoomLevel) {
		//zoom out
		for (var fltr in activeFilter) {
			toggleLayers(fltr, 0);
			filter[fltr].usedBefore = false;
			resetFilter(fltr);
		}
	}
}
function parseOpening_hours(value) {
	if (!value) {
		return value;
	}
	//Parsing opening hours syntax of OSM.
	// var toTranslate = {"<OSM expression>": "<human expression, will be shown to user instead of <OSM expression>>", ...}
	var toTranslate = getText().opening_hours;
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
function addrTrigger_intern(poi, marker) {
	if (marker.popupContent.indexOf("%data_address%") > -1) {
		$.get("https://nominatim.openstreetmap.org/reverse?accept-language=" + languageOfUser + "&format=json&osm_type=" + String(poi.type)[0].toUpperCase() + "&osm_id=" + String(poi.id), function(data, status, xhr, trash) {
			var address = data["address"];
			if (address) {
				var street = address["road"] || address["pedestrian"] || address["street"] || address["footway"] || address["path"] || address["address26"] || getText().PDV_STREET_UNKNOWN;
				var housenumber = address["housenumber"] || address["house_number"] || getText().PDV_HOUSENUMBER_UNKNOWN;
				var postcode = address["postcode"] || getText().PDV_ZIPCODE_UNKNOWN;
				var city = address["city"] || address["town"] || address["county"] || address["state"] || getText().PDV_COMMUNE_UNKNOWN;
				marker.popupContent = marker.popupContent.replace("%data_address%", street + " " + housenumber + "<br/>" + postcode + " " + city);
			} else {
				marker.popupContent = marker.popupContent.replace("%data_address%", "<i><span style='color:red;'>" + getText().PDV_ADDRESS_UNKNOWN + "</span></i>");
			}
			marker.bindPopup(marker.popupContent);
			marker.openPopup();
		});
	}
}
function addrTrigger(poi, marker) {
	marker.on("click", function() {addrTrigger_intern(poi, marker)});
	return "%data_address%";
}
function toggleTab(bla, id) {
	var tab = document.getElementById(id);
	var icon = document.getElementById("icon" + id);
	if (icon.classList.contains("inactive") == true) {
		return 0;
	}
	if (!bla) {
		tab.setAttribute("active", true);
		return 0;
	}
	var tabs = document.getElementsByClassName("tabcontent");
	var icons = document.getElementsByClassName("pdv-icon");
	for (var item = 0;item < tabs.length;item++) {
		tabs[item].style.display = "none";
		if (bla.id.endsWith(icons[item].id)) {
			icons[item].setAttribute("active", true);
		} else {
			icons[item].removeAttribute("active");
		}
	}
	tab.style.display = "block";
}
function addrTab(poi, prefix , condition, symbol) {
	return "<div class='grid-container'><a target='_blank' href='" + prefix  + eval(condition) + "'><img class='small-icon' src='" + symbol + "' /></a><a target='_blank' href='"+ prefix + eval(condition) + "'>" + eval(condition) + "</a></div>\n";
}
function babyTab_intern(poi, tag, values, data) {
	for (var i in values) {
		var title;
		if (values[i] == "*") {values[i] = poi.tags[tag];}
		if (poi.tags[tag] == values[i]) {
			var langcode = tag.replace("_", "").replace(":", "_");
			if (values[i] == undefined) {
				langcode += "_UNKNOWN";
			} else {
				langcode += "_" + values[i];
			}
			title = getText("PDV_" + langcode.toUpperCase());
			if (title != undefined) {
				data.title = title;
				data.color = colorcode[values[i]];
			} else {
				if (tag.endsWith("description") && poi.tags[tag] != undefined) {
					data.title = "\"" + poi.tags[tag] + "\"";
				} else {
					data.title = "NODISPLAY";
				}
			}
		}
		i += 1;
	}
	return data
}
function babyTab(poi) {
	var data = {};
	var output = "";
	for (var tag in babyData) {
		var values = babyData[tag].values;
		var children = babyData[tag].children;
		data[tag] = {};
		data[tag] = babyTab_intern(poi, tag, values, data[tag]);
		data[tag].children = {};
		for (var child in children) {
			data[tag].children[child] = {};
			data[tag].children[child] = babyTab_intern(poi, tag + ":" + child,  babyData[tag].children[child].values, data[tag].children[child])
			if (data[tag].children[child].title == "NODISPLAY") {
				delete data[tag].children[child];
			}
		}
		if (Object.keys(data[tag].children).length == 0 || Object.keys(data[tag]).length == 0) {
			output += "<ul><li class='" + data[tag].color + "'>" + data[tag].title + "</li></ul>\n";
		} else {
			output += "<details><summary class='" + data[tag].color + "'>" + data[tag].title + "</summary><div>\n%content</div></details>\n";
			var childrenHTML = "";
			if (data[tag].title != "NODISPLAY") {	
				for (var child in data[tag].children) {
					childrenHTML += "<ul><li>" + data[tag].children[child].title + "</li></ul>\n"
				}
			}
			output = output.replace("%content", childrenHTML);
		}
	}
	return output
}
function loadPOIS(e, url) {
	hideFilterListOnMobile();
	progressbar(50);
	//Main function of POI loading.
	//Handles connection to OSM Overpass server and parses the response into beautiful looking details views for each POI
	if (!url) {
		//No url was specified, because none of the filter functions called it.
		var result = locateNewAreaBasedOnFilter();
		if (!result) {
			progressbar();
			return 0;
		}
		url = "https://overpass-api.de/api/interpreter?data=[out:json][timeout:15];" + result + "out body center;";
	} else {
		url = "https://overpass-api.de/api/interpreter?data=[out:json][timeout:15];" + url + "out body center;";
	}
	//Connect to OSM server
	$.get(url, function (osmDataAsJson) {
		//Go throw all elements (ways, relations, nodes) sent by Overpass
		for (var poi in osmDataAsJson.elements) {
			var marker;
			var popupContent = "";
			var popupContent_header = ""
			poi = osmDataAsJson.elements[poi];
			if (poi.center != undefined) {
				poi.lat = poi.center.lat;
				poi.lon = poi.center.lon;
			}
			var classId = String(poi.type)[0].toUpperCase() + String(poi.id);
			//creates a new Marker() Object and groups into the layers given by our filters.
			marker = groupIntoLayers(poi);
			var details_data = {"home": {"content": `<h1>${ ((poi.tags["name"] == undefined) ? ((poi.tags["amenity"] == "toilets") ? getText().TOILET : getText().PDV_UNNAME) : poi.tags["name"]) }</h1><h2>${  String(marker.name) }</h2><address>${ addrTrigger(poi, marker) }</address>`, "symbol": "/images/home.svg", "title": getText().PDV_TITLE_HOME, "active": true, "default": true},
			"baby": {"content": `${babyTab(poi)}`, "symbol": "/images/baby.svg", "title": getText().PDV_TITLE_BABY, "active": true},
			"opening_hours": {"content": `${ parseOpening_hours(poi.tags["opening_hours"]) || "NODISPLAY" }`, "symbol": "/images/clock.svg", "title": getText().PDV_TITLE_OH, "active": true},
			"contact" : {"content": `${ addrTab(poi, "", "poi.tags['website'] || poi.tags['contact:website'] || 'NODISPLAY'", "/images/www.svg") }${ addrTab(poi, "", "poi.tags['phone'] || poi.tags['contact:phone'] || 'NODISPLAY'", "/images/call.svg") }${ addrTab(poi, "", "poi.tags['email'] || poi.tags['contact:email'] || 'NODISPLAY'", "/images/email.png") }${ addrTab(poi, "", "((poi.tags['facebook'] != undefined) ? ((poi.tags['facebook'].indexOf('/') > -1) ? poi.tags['facebook'] : ((poi.tags['facebook'] == -1) ? 'https://www.facebook.com/' + poi.tags['facebook'] : undefined)) : ((poi.tags['contact:facebook'] != undefined) ? ((poi.tags['contact:facebook'].indexOf('/') > -1) ? poi.tags['contact:facebook'] : ((poi.tags['contact:facebook'] == -1) ? 'https://www.facebook.com/' + poi.tags['contact:facebook'] : 'NODISPLAY')) : 'NODISPLAY'))", "/images/facebook-logo.svg") }`, "symbol": "/images/contact.svg", "title": getText().PDV_TITLE_CONTACT, "active": true},
			"furtherInfos": {"content": `<b>${ getText().PDV_OPERATOR }:</b><br/> ${ ((poi.tags["operator"]) ? poi.tags["operator"] + "<br/>" : "NODISPLAY") }\n<b>${ getText().PDV_DESCRIPTION }:</b><br/>"${ ((poi.tags["description:" + languageOfUser]) ? getText().PDV_DESCRIPTION + ": " + poi.tags["description:" + languageOfUser] : ((poi.tags["description"]) ? getText().PDV_DESCRIPTION + ": " + poi.tags["description"] : "NODISPLAY")) }"\n<br/><a target='_blank' href='${ "https://www.openstreetmap.org/" + String(poi.type).toLowerCase() + "/" + String(poi.id) }'>${ getText().LNK_OSM_VIEW }</a><br/>\n<a href='${ "geo:" + poi.lat + "," + poi.lon }'>${ getText().LNK_OPEN_WITH }</a>`, "symbol": "/images/moreInfo.svg", "title": getText().PDV_TITLE_MI, "active": true}
			};
			for (var entry in details_data) {
				var tabContent = "";
				var defaultOpen = "";
				var content = details_data[entry].content;
				content = content.split("\n");
				if (details_data[entry].default == true) {
					defaultOpen = "style='display:block;'"
				}
				popupContent += "<div class='tabcontent' id='" + classId + entry + "' " + defaultOpen + ">";
				for (var i in content) {
					var tmp = "";
					var result = "";
					result += content[i];
					if (result.indexOf("NODISPLAY") == -1) {
						//result = result.replace(new RegExp("</ul>\n<ul>", "g"), "");
					} else {result = ""}
					tabContent += result;
				}
				if (tabContent == "") {
					details_data[entry].active = false;
				} else {
					popupContent += tabContent;
				}
				popupContent += "</div>";
			}
			popupContent_header += "<div style='display:flex;'>";
			for (var entry in details_data) {
				var classList = "pdv-icon active";
				if (!details_data[entry].active) {
					classList = "pdv-icon inactive";
				}
				popupContent_header += "<img class='" + classList + "' id='icon" + classId + entry + "' onclick='toggleTab(this, \"" + classId + entry + "\")' src='" + details_data[entry].symbol + "' alt='" + details_data[entry].title + "' title='" + details_data[entry].title + "' />";
			}
			popupContent_header += "</div>";
			marker.popupContent = popupContent_header + popupContent + "<hr/><a target=\"_blank\" href=\"https://www.openstreetmap.org/edit?" + String(poi.type) + "=" + String(poi.id) + "\">" + getText().LNK_OSM_EDIT + "</a>&nbsp;&nbsp;<a target=\"_blank\" href=\"https://www.openstreetmap.org/note/new#map=17/" + poi.lat + "/" + poi.lon + "&layers=N\">" + getText().LNK_OSM_REPORT + "</a>";;
			marker.bindPopup(marker.popupContent);
			//Show marker on map
			marker.addTo(map);
			if (poi.lat == saved_lat && poi.lon == saved_lon) {
				addrTrigger_intern(poi, marker);
			}
		}
		progressbar();
	}).fail(function() {
		showGlobalPopup(getText().LOADING_FAILURE);
		progressbar();
	});
}
function getStateFromHash() {
	var hash = location.hash;
	if (hash != "") {
		hash = hash.replace("#", "").split("&");
		if (String(Number(hash[0])) == "NaN") {
			languageOfUser = hash[0];
			zoomLevel = Number(hash[1]);
			saved_lat = Number(hash[2]);
			saved_lon = Number(hash[3]);
		} else {
			zoomLevel = Number(hash[0]);
			saved_lat = Number(hash[1]);
			saved_lon = Number(hash[2]);
		}
		map.setView([saved_lat, saved_lon], zoomLevel);
	}
}
function requestLocation() {
	map.locate({setView: true, zoom: zoomLevel});
}
//init map
progressbar(30);
var map = L.map('map')
map.options.maxZoom = 19;
map.options.minZoom = 10;
map.setView([saved_lat, saved_lon], 15);
getStateFromHash();
map.on("locationfound", locationFound);
map.on("locationerror", locationError);
map.on("click", function(e) {location.hash = String(map.getZoom()) + "&" + String(e.latlng.lat) + "&" + String(e.latlng.lng);})
map.on("moveend", onMapMove);
map.on("zoomend", onMapZoom);
var Layergroup = new L.LayerGroup();
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: 'Map data &copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> contributors</a>, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Map Tiles &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);
progressbar();
zoomLevel = String(map.getZoom());
loadLang("", languageOfUser);

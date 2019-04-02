var zoomLevel = "";
function locationFound(e) {
	//Clicks on the button, so we jump to the coordinates of the user.
	//document.getElementById('query-button').click();
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
	
	//Outcommented code with javascripts' multiline comment option /*...*/ is the old algorithm Babykarte has used. It stays here in code deactivated until a solution for the bug described at https://github.com/babykarte/babykarte.github.io/issues/37 can be found.
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
function locateNewAreaBasedOnFilter() {
	//Wrapper around locateNewArea().
	//Adds filter compactibility to locateNewArea() function.
	var url = "";
	var result = "";
	for (var fltr in activeFilter) {
		result = locateNewArea(fltr, filter[fltr].coordinates.max.north, filter[fltr].coordinates.max.south, filter[fltr].coordinates.max.west, filter[fltr].coordinates.max.east);
		if (!filter[fltr].usedBefore) {
			filter[fltr].usedBefore = true;
			setCoordinates(fltr);
		}
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
			filter[fltr].layers = [];
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
			"baby": {"content": `<ul><li class='${ ((poi.tags["diaper"] == "yes" || poi.tags["diaper"] == "bench" || poi.tags["diaper"] == "room") ? "color-green" : "color-red") }'>${ ((poi.tags["diaper"] == "yes" || poi.tags["diaper"] == "bench" || poi.tags["diaper"] == "room") ? getText().PDV_DIAPER_YES : ((poi.tags["diaper" == "no"]) ? getText().PDV_DIAPER_NO : getText().PDV_DIAPER_UNKNOWN)) }\n<ul><li>${ ((poi.tags["diaper"] == "room") ? getText().PDV_DIAPER_ROOM : "NODISPLAY") }</li></ul>\n<ul><li>${ ((poi.tags["diaper:male"] == "yes") ? getText().PDV_DIAPER_MALE : ((poi.tags["diaper"] == "yes" || poi.tags["diaper"] == "bench" || poi.tags["diaper"] == "room") ? getText().PDV_DIAPER_MALE_NO : "NODISPLAY")) }</li></ul>\n<ul><li>${ ((poi.tags["diaper:female"] == "yes") ? getText().PDV_DIAPER_FEMALE : ((poi.tags["diaper"] == "yes" || poi.tags["diaper"] == "bench" || poi.tags["diaper"] == "room") ? getText().PDV_DIAPER_FEMALE_NO :"NODISPLAY")) }</li></ul>\n<ul><li>${ ((poi.tags["diaper:unisex"] == "yes") ? getText().PDV_DIAPER_UNISEX : ((poi.tags["diaper"] == "yes" || poi.tags["diaper"] == "bench" || poi.tags["diaper"] == "room") ? getText().PDV_DIAPER_UNISEX_NO : "NODISPLAY")) }</li></ul>\n<ul><li>${ ((poi.tags["diaper:fee"] == "yes") ? + getText().PDV_DIAPER_FEE : ((poi.tags["diaper"] == "yes" || poi.tags["diaper"] == "bench" || poi.tags["diaper"] == "room") ? getText().PDV_DIAPER_FEE_NO : "NODISPLAY")) }</li></ul>\n</li>\n<li class='${ ((poi.tags["highchair"] == "yes" || poi.tags["highchair"] > 0) ? "color-green" : "color-red") }'>${ ((poi.tags["highchair"] == "yes") ? getText().PDV_HIGHCHAIR_YES : ((poi.tags["highchair"] == "no") ? getText().PDV_HIGHCHAIR_NO : ((poi.tags["highchair"]) > 0) ? poi.tags["highchair"] + " " + getText().PDV_HIGHCHAIR_COUNT : ((poi.tags["highchair"] == "no") ? getText().PDV_HIGHCHAIR_NO : getText().PDV_HIGHCHAIR_UNKNOWN))) }</li>\n<li class='${ ((poi.tags["stroller"] == "yes") ? "color-green" : ((poi.tags["stroller"] == "limited") ? "color-yellow" : ((poi.tags["stroller"] == "no") ? "color-red" : "color-grey"))) }'>${ ((poi.tags["stroller"] == "yes") ? getText().PDV_STROLLER_YES : ((poi.tags["stroller"] == "limited") ? getText().PDV_STROLLER_LIMITED : ((poi.tags["stroller"] == "no") ? getText().PDV_STROLLER_NO : getText().PDV_STROLLER_UNKNOWN))) }\n<ul><li>${ ((poi.tags["stroller:description:" + document.body.id]) ? "\"" + poi.tags["stroller:description:" + document.body.id] + "\"" : ((poi.tags["stroller:description"]) ? "\"" + poi.tags["stroller:description"] + "\"" : "NODISPLAY")) }</li></ul>\n</li>\n<li class='${ ((poi.tags["kids_area"] == "yes" && poi.tags["amenity"] != "kindergarten") ? "color-green" : ((poi.tags["kids_area"] == "no") ? "color-red" : "color-grey")) }'>${ ((poi.tags["kids_area"] == "yes") ? getText().PDV_KIDSAREA_YES : ((poi.tags["kids_area"] == "no") ? getText().PDV_KIDSAREA_NO : getText().PDV_KIDSAREA_UNKNOWN)) }</li>\n</ul>`, "symbol": "/images/baby.svg", "title": getText().PDV_TITLE_BABY, "active": true},
			"opening_hours": {"content": `${ parseOpening_hours(poi.tags["opening_hours"]) || "NODISPLAY" }`, "symbol": "/images/clock.svg", "title": getText().PDV_TITLE_OH, "active": true},
			"contact" : {"content": `<div clas='grid-container'><a target='_blank' href='${ poi.tags["website"] || poi.tags["contact:website"] || "NODISPLAY" }'><img class='small-icon' src='/images/www.svg' />${ poi.tags["website"] || poi.tags["contact:website"] || "NODISPLAY" }</a></div>\n<div clas='grid-container'><a href='tel:${ poi.tags["phone"] || poi.tags["contact:phone"] || "NODISPLAY" }'><img class='small-icon' src='/images/call.svg' />${ poi.tags["phone"] || poi.tags["contact:phone"] || "NODISPLAY" }</a></div>\n<div clas='grid-container'><a target='_blank' href='${ ((poi.tags["facebook"] != undefined) ? ((poi.tags["facebook"].indexOf("/") > -1) ? poi.tags["facebook"] : ((poi.tags["facebook"] == -1) ? "https://www.facebook.com/" + poi.tags["facebook"] : undefined)) : ((poi.tags["contact:facebook"] != undefined) ? ((poi.tags["contact:facebook"].indexOf("/") > -1) ? poi.tags["contact:facebook"] : ((poi.tags["contact:facebook"] == -1) ? "https://www.facebook.com/" + poi.tags["contact:facebook"] : "NODISPLAY")) : "NODISPLAY")) }'><img class='small-icon' src='/images/facebook-logo.svg' />${ ((poi.tags["facebook"] != undefined) ? ((poi.tags["facebook"].indexOf("/") > -1) ? poi.tags["facebook"] : ((poi.tags["facebook"] == -1) ? "https://www.facebook.com/" + poi.tags["facebook"] : undefined)) : ((poi.tags["contact:facebook"] != undefined) ? ((poi.tags["contact:facebook"].indexOf("/") > -1) ? poi.tags["contact:facebook"] : ((poi.tags["contact:facebook"] == -1) ? "https://www.facebook.com/" + poi.tags["contact:facebook"] : "NODISPLAY")) : "NODISPLAY")) }</a></div>`, "symbol": "/images/contact.svg", "title": getText().PDV_TITLE_CONTACT, "active": true},
			"furtherInfos": {"content": `<b>${ getText().PDV_OPERATOR }":</b><br/>" ${ ((poi.tags["operator"]) ? poi.tags["operator"] + "<br/>" : "NODISPLAY") }\n<b>${ getText().PDV_DESCRIPTION }:</b><br/>${ ((poi.tags["description:" + languageOfUser]) ? getText().PDV_DESCRIPTION + ": " + poi.tags["description:" + languageOfUser] : ((poi.tags["description"]) ? getText().PDV_DESCRIPTION + ": " + poi.tags["description"] : "NODISPLAY")) }\n<a target='_blank' href='${ "https://www.openstreetmap.org/" + String(poi.type).toLowerCase() + "/" + String(poi.id) }'>${ getText().LNK_OSM_VIEW }</a><br/>\n<a href='${ "geo:" + poi.lat + "," + poi.lon }'>${ getText().LNK_OPEN_WITH }</a>`, "symbol": "/images/moreInfo.svg", "title": getText().PDV_TITLE_MI, "active": true}
			}
			var details_data_old = {"home": {"elements": {"<h1>%s</h1>": ((poi.tags["name"] == undefined) ? ((poi.tags["amenity"] == "toilets") ? getText().TOILET : getText().PDV_UNNAME) : poi.tags["name"]), "<h2>%s</h2>": String(marker.name), "%s": addrTrigger}, "symbol": "/images/home.svg", "title": getText().PDV_TITLE_HOME, "active": true, default: true},
			"baby": {"elements": {"%s<!--Diaper info-->": ((poi.tags["diaper"] == "yes") ? getText().PDV_DIAPER_YES : ((poi.tags["diaper"] == "bench") ? getText().PDV_DIAPER_BENCH : ((poi.tags["diaper"] == "room") ? getText().PDV_DIAPER_ROOM : getText().PDV_DIAPER_NO))) || "", "<br/>%s<!--Diaper info for men-->": ((poi.tags["diaper:male"] == "yes") ? getText().PDV_DIAPER_MALE : "") /*((poi.tags["diaper:male"] == "no") ? getText().PDV_DIAPER_MALE_NO : getText().PDV_DIAPER_MALE_UNKNOWN))*/, "<br/>%s<!--Diaper info for women-->": ((poi.tags["diaper:female"] == "yes") ? getText().PDV_DIAPER_FEMALE : "") /*((poi.tags["diaper:female"] == "no") ? getText().PDV_DIAPER_FEMALE_NO : getText().PDV_DIAPER_FEMALE_UNKNOWN))*/, "<br/>%s<!--Diaper unisex info-->": ((poi.tags["diaper:unisex"] == "yes") ? getText().PDV_DIAPER_UNISEX : ""), "<br/>%s<!--Diaper fee info-->": ((poi.tags["diaper:fee"] == "yes") ? "<span style='color:red;'>" + getText().PDV_DIAPER_FEE + "</span>": ((poi.tags["diaper:fee"] == "no") ? "<span style='color:darkgreen;'>" + getText().PDV_DIAPER_FEE_NO + "</span>" : "")), "<br/>%s<!--Highchair info-->": ((poi.tags["highchair"] == "yes") ? getText().PDV_HIGHCHAIR_YES : ((poi.tags["highchair"] == "no") ? getText().PDV_HIGHCHAIR_NO : ((poi.tags["highchair"]) > 0) ? poi.tags["highchair"] + " " + getText().PDV_HIGHCHAIR_COUNT : "")), "<br/>%s<!--Kids area info-->": ((poi.tags["kids_area"] == "yes" && poi.tags["amenity"] != "kindergarten") ? getText().PDV_KIDSAREA_YES : ((poi.tags["kids_area"] == "no" && poi.tags["amenity"] != "kindergarten") ? getText().PDV_KIDSAREA_NO : "")), "<br/>%s<!--Stroller info-->": ((poi.tags["stroller"] == "yes") ? getText().PDV_STROLLER_YES : ((poi.tags["stroller"] == "limited") ? getText().PDV_STROLLER_LIMITED : ((poi.tags["stroller"] == "no") ? getText().PDV_STROLLER_NO : "")))}, "symbol": "/images/baby.svg", "title": getText().PDV_TITLE_BABY, "active": true},
			"opening_hours": {"elements": {"%s": parseOpening_hours(poi.tags["opening_hours"]) || ""}, "symbol": "/images/clock.svg", "title": getText().PDV_TITLE_OH, "active": true},
			"contact": {"elements": {"<a target='_blank' href='%s'><img class='small-icon' src='/images/www.svg' />%s</a><br/>": poi.tags["website"] || poi.tags["contact:website"] || "", "<a href='tel:%s'><img class='small-icon' src='/images/call.svg' />%s</a><br/>": poi.tags["phone"] || poi.tags["contact:phone"] || "", "<a href='mailto:%s'><img class='small-icon' src='/images/email.png' />%s</a><br/>": poi.tags["email"] || poi.tags["contact:email"] || "", "<a target='_blank' href='%s'><img class='small-icon' src='/images/facebook-logo.svg' />%s</a>": ((poi.tags["facebook"] != undefined) ? ((poi.tags["facebook"].indexOf("/") > -1) ? poi.tags["facebook"] : ((poi.tags["facebook"] == -1) ? "https://www.facebook.com/" + poi.tags["facebook"] : undefined)) : ((poi.tags["contact:facebook"] != undefined) ? ((poi.tags["contact:facebook"].indexOf("/") > -1) ? poi.tags["contact:facebook"] : ((poi.tags["contact:facebook"] == -1) ? "https://www.facebook.com/" + poi.tags["contact:facebook"] : "")) : ""))}, "symbol": "/images/contact.svg", "title": getText().PDV_TITLE_CONTACT, "active": true},
			"furtherInfos": {"elements": {"%s<!--Operator name--><br/>": ((poi.tags["operator"]) ? getText().PDV_OPERATOR + ": " + poi.tags["operator"] : ""), "%s<!--Description--><br/>": ((poi.tags["description:" + languageOfUser]) ? getText().PDV_DESCRIPTION + ": " + poi.tags["description:" + languageOfUser] : ((poi.tags["description"]) ? getText().PDV_DESCRIPTION + ": " + poi.tags["description"] : "")), "<a target=\"_blank\" href='%s</a>": "https://www.openstreetmap.org/" + String(poi.type).toLowerCase() + "/" + String(poi.id) + "'>" + getText().LNK_OSM_VIEW, "<br/><a href='%s</a>": "geo:" + poi.lat + "," + poi.lon + "'>" + getText().LNK_OPEN_WITH}, "symbol": "/images/moreInfo.svg", "title": getText().PDV_TITLE_MI, "active": true}
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
						result = result.replace(new RegExp("</ul>\n<ul>", "g"), "");
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
			/*if (poi.lat == saved_lat && poi.lon == saved_lon) {
				addrTrigger_intern(poi, marker);
			}*/
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
	map.locate({setView: true});
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
map.on("zoomend", onMapZoom());
var Layergroup = new L.LayerGroup();
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: 'Map data &copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> contributors</a>, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Map Tiles &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);
progressbar();
loadLang("", languageOfUser);

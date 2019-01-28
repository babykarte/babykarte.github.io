'use strict';
var supported_languages = ["de", "en", "it", "fr"]
var saved_lat = 48.160474925320834;
var saved_lon = 11.4992094039917;
var maxSouth = 0;
var maxWest = 0;
var maxNorth = 0;
var maxEast = 0;
var languageOfUser, south_old, west_old, north_old, east_old, maxSouth, maxWest, maxNorth, maxEast;
var poi_markers = new Array();
var message;
function showGlobalPopup(m) {
	message = m
	setTimeout(function() {
		document.getElementById("infoPopup").innerHTML = message;
		document.getElementById("infoPopup").style.display = "block";
		setTimeout(function() {
			document.getElementById("infoPopup").style.display = "none";
		}, 3000);
		}, 1000);
}
function jumpto(lat, lon, locname="") {
	if (locname != "") {
		$("#searchfield").value = locname;
	}
	$("#autocomplete").hide();
	map.setView([lat, lon]);
	location.hash = String(map.getZoom()) + "&" + String(lat) + "&" + String(lon);
	maxSouth = map.getBounds().getSouth();
	maxWest = map.getBounds().getWest();
	maxNorth = 0;
	maxEast = 0;
	$('#query-button').click();
	showGlobalPopup(locname);
}
function languageOfUser() {
	languageOfUser = navigator.language.toLowerCase();
	if (languageOfUser.indexOf("-") > -1) {
		languageOfUser = languageOfUser.split("-");
		languageOfUser = languageOfUser[0]
		var supported = false;
		var index;
		for (index in supported_languages) {
			if (supported_languages[index] == languageOfUser) {
				supported = true;
				break
			}
		}
		if (!supported) {
			//The user's language isn't supported by photon.komoot.de, so we set it to standalone english (most of the time it's en-US despite the logic)
			languageOfUser = "en";
		}
	}
}
function geocode() {
	var searchword = $("#searchfield").val();
	if(searchword.length > 3) {
		$.getJSON("https://photon.komoot.de/api/", {
			"q": searchword,
			"lat": saved_lat,
			"lon": saved_lon,
			"limit": 5,
			"lang": languageOfUser
		}, function(data) {
			var current_bounds = map.getBounds();
			var autocomplete_content = "<ul>";

			$.each(data.features, function(number, feature) {
				var latlng = [feature.geometry.coordinates[1], feature.geometry.coordinates[0]];

				autocomplete_content += "<li onclick='jumpto(" + latlng[0] + ", " + latlng[1] + ", \"" + feature.properties.name + ", " + feature.properties.country + "\")'>" + feature.properties.name + ", " + feature.properties.country + "</li>";
			});
			if (autocomplete) {
				$("#autocomplete").html(autocomplete_content+"</ul>");
				$("#autocomplete").show();
			}
		});
	}
};
//choosing language
languageOfUser();
// init search
$("#searchfield").keyup(function() {
	geocode();
});

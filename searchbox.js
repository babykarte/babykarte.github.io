var saved_lat = 48.160474925320834;
var saved_lon = 11.4992094039917;
var mobile = false;
var message;
function mobileTrue() {mobile = true;}
function toggleFilterList(value=false) {
	var obj = document.getElementsByClassName("layermenu")[0]
	if (value == true) {
		obj.style.height = "auto";
	}
	if (obj.style.height != "auto") {
		obj.style.height = "auto";
	} else {
		obj.style.height = "68px";
	}
}
function hideFilterListOnMobile() {
	if (mobile) {
		toggleFilterList(true);
	}
}
function progressbar(value=false) {
	var elem = document.getElementById("progressbar");
	if (!value) {
		elem.style.width = "0%";
		elem.style.display = "none";
	} else {
		elem.style.width = String(value) + "%";
		elem.style.display = "block";
	}
}
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
function geocode() {
	var searchword = $("#searchfield").val();
	if(searchword.length > 3) {
		$.getJSON("https://photon.komoot.de/api/", {
			"q": searchword,
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
// Makes the search happen directly after a char is typed in searchfield.
$("#searchfield").keyup(function() {
	geocode();
});

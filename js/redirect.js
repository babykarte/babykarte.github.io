var remapping = {};
var hash = location.hash;
var filename = location.pathname;
filename = ((remapping[filename]) ? remapping[filename] : filename)
var url = "https://babykarte.openstreetmap.de/" + filename + hash
document.getElementById("redirect-url").innerHTML = "<a href='" + url + "'>" + url + "</a>";

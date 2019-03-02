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
var langRef = {"site-map": {
"de": {
	"LOCATING_FAILURE": "Standort nicht ermittelbar",
	"LOCATING_SUCCESS": "Dein Standort.",
	"LNK_OSM_EDIT": "Mit OSM editieren",
	"LNK_OSM_REPORT": "Falschinformationen melden",
	"LNK_OSM_VIEW": "POI in OpenStreetMap ansehen",
	"LNK_OPEN_WITH": "Mit App öffnen",
	"PDV_UNNAME": "Kein Name",
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
	"PDV_HIGHCHAIR_YES": "Babystuhl vorhanden",
	"PDV_HIGHCHAIR_NO": "Babystuhl nicht vorhanden",
	"PDV_HIGHCHAIR_COUNT": "Babystühle vorhanden",
	"PDV_KIDSAREA_YES": "Spielecke vorhanden",
	"PDV_KIDSAREA_NO": "Spielecke nicht vorhanden",
	"TOILET": "WC",
	"BTN_APPLY_FILTERS": "Filter anwenden",
	"LNK_IMPRESS": "Impressum",
	"LNK_PROJECT_SITE": "Über das Projekt & Datenschutzerklärung",
	"TB_SEARCHFIELD": "Ort",
	"IMPRESS_SUBTITLE": "Angaben gemäß $ 5 TMG:",
	"IMPRESS_COUNTRY": "Deutschland",
	"opening_hours": {"Mo" : "Montag", "Tu" : "Dienstag", "We" : "Mittwoch", "Th" : "Donnerstag", "Fr" : "Freitag", "Sa" : "Samstag", "Su" : "Sonntag", "off" : "geschlossen", "Jan" : "Januar", "Feb" : "Februar", "Mar" : "März", "Apr" : "April", "May" : "Mai", "Jun" : "Juni", "Jul" : "Juli", "Aug" : "August", "Sep" : "September", "Oct" : "Oktober", "Nov" : "November", "Dec" : "Dezember", "PH" : "Feiertag"},
	"filtername": {
		0: "Kinderärzte",
		1: "Hebamme",
		2: "Spielplätze",
		3: "Parks",
		4: "Geschäfte für Babybedarf",
		5: "Spielwarenläden",
		6: "Bekleidungsgeschäfte",
		7: "Kindergärten",
		8: "Zoo",
		9: "Puppentheater",
		10: "Tierattraktionen",
		11: "Toiletten",
		12: "Wickelplätze",
		13: "Cafés",
		14: "Restaurants"
		}
	}
},
"site-impress" : {
	"IMPRESS_TITLE": "Impressum",
	"IMPRESS_SUBTITLE": "Angaben gemäß § 5 TMG:",
	"IMPRESS_COUNTRY": "Deutschland",
	"IMPRESS_CONTACT": "Kontakt",
	"IMPRESS_NOTE": "Alle Daten auf dieser Website stammen aus dem Projekt OpenStreetMap. Die Babykarte wertet diese Daten lediglich aus.<br/>Für die Richtigkeit der Angaben kann keine Garantie übernommen werden. Anmerkungen zu falschen oder fehlenden Daten<br/>übermitteln Sie bitte direkt an OpenStreetMap über die bereitgestellten Links. Darüber hinaus gibt es die Möglichkeit durch Einrichtung eines OpenStreetMap-Accounts falsche- zu berichtigen oder fehlende Daten hinzuzufügen."
	}
};
//determine language of user
if (languageOfUser.indexOf("-") > -1) {
	languageOfUser = languageOfUser.split("-");
	languageOfUser = languageOfUser[0];
}
function registerLang(lang, json) {
	langRef[document.body.id][lang] = json[document.body.id];
}
function loadLang(e, lang) {
	if (lang in langRef[document.body.id] == false) {
		var script = document.createElement("script");
		script.setAttribute("src", "/" + String(lang) + ".js");
		document.body.appendChild(script);
	} else {
		setLang(e, lang);
	}
}
function setLang(e, lang) {
	if (lang != undefined) {
		languageOfUser = lang;
	}
	if (languageOfUser in langRef[document.body.id]) {
		var data = {
		0: ((document.getElementById("query-button") != null) ? document.getElementById("query-button").value = langRef[document.body.id][languageOfUser].BTN_APPLY_FILTERS : ""),
		1: ((document.getElementById("linkToProject") != null) ? document.getElementById("linkToProject").innerHTML = langRef[document.body.id][languageOfUser].LNK_PROJECT_SITE : ""),
		2: ((document.getElementById("searchfield") != null) ? document.getElementById("searchfield").placeholder = langRef[document.body.id][languageOfUser].TB_SEARCHFIELD : ""),
		3: ((document.getElementById("lnk-impress") != null) ? document.getElementById("lnk-impress").innerHTML = langRef[document.body.id][languageOfUser].LNK_IMPRESS : ""),
		4: ((document.getElementById("title") != null) ? document.getElementById("title").innerHTML = langRef[document.body.id][languageOfUser].IMPRESS_TITLE : ""),
		5: ((document.getElementById("subtitle") != null) ? document.getElementById("subtitle").innerHTML = langRef[document.body.id][languageOfUser].IMPRESS_SUBTITLE : ""),
		6: ((document.getElementById("country") != null) ? document.getElementById("country").innerHTML = langRef[document.body.id][languageOfUser].IMPRESS_COUNTRY : ""),
		7: ((document.getElementById("contact") != null) ? document.getElementById("contact").innerHTML = langRef[document.body.id][languageOfUser].IMPRESS_CONTACT : ""),
		8: ((document.getElementById("note") != null) ? document.getElementById("note").innerHTML = langRef[document.body.id][languageOfUser].IMPRESS_NOTE : ""),
		};
		initFilters();
	} else {
		alert("Language datas couldn't be loaded.");
	}
}

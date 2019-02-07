https://wiki.openstreetmap.org/wiki/Baby-Karte

# Babykarte
OpenStreetMap-Karte mit relevanten Informationen für die Eltern von Babys und Kleinkindern (0-3 Jahre).

Zur [dazugehörigen Wikiseite](https://wiki.openstreetmap.org/wiki/Baby-Karte)

## Was wertet die Karte aus

### OpenStreetMap Daten
Die Babykarte wertet folgende OSM Daten aus

ToDo: Liste erstellen.

## Datenerhebung (von der Babykarte nicht selber durchgeführt)

### Nutzungsdaten (Fließtext)
Die Babykarte nutzt folgende Drittanbieter. Ihre Funktion ist ebenso beschrieben. Die Babykarte selber wertet keine Nutzerdaten aus. Sie leitet die Eingaben des Nutzers lediglich nur weiter.

Bei der Verwendung der Suche zur Suche nach einem Ort sendet die Babykarte nach dem 3. Buchstaben die Sucheingabe an Komoot, welcher eine Suche nach Orten auf der Weltkarte ermöglicht. Wie Komoot mit den gesendeten Daten umgeht erfährst Du in deren [Privacy Policy](https://www.komoot.de/privacy).

Beim Besuch der Babykarte fragt Dein Browser diverse Dateien bei fremden Servern ab. Diese Server sind Cacheserver von zwei unterschiedlichen Anbietern. Der erste ist Google und deren Datenschutzerklärung ist [hier einsehbar](https://policies.google.com/privacy#infocollect). Der zweite nennt sich DigitalOcean und hat ebenso eine eigene [Privacy Policy](https://www.digitalocean.com/legal/privacy-policy/).

Die Babykarte nutzt zur Darstellung der Karte und anderen Daten wie z.B. Adresse-, Öffnungszeiten- und Name des Geschäftes/der Einrichtung Kartenmaterial und andere Daten der OpenStreetMap Community. Die OpenStreetMap Foundation hostet diese Daten auf ihren eigenen Servern. Auch diese haben eine eigene [Privacy Policy]( https://wiki.osmfoundation.org/wiki/Privacy_Policy#Data_we_receive_automatically).

### Nutzungsdaten (Stichpunkte) (technisch)
Die Babykarte nutzt folgende Drittanbieter. Ihre Funktion ist ebenso beschrieben. Die Babykarte selber wertet keine Nutzerdaten aus. Sie leitet die Eingaben des Nutzers lediglich nur weiter.

- Photon von Komoot
  - Suchanbieter
  - Siehe [Komoot's Privacy Policy](https://www.komoot.de/privacy)
- Unpkg
  - Cacheserver, nutzt Google Sites.
  - Siehe [Google's Privacy Policy](https://policies.google.com/privacy#infocollect)
- JQuery Cacheserver
  - Cacheserver, nutzt digitalocean als Webhoster
  - Siehe [DigitalOcean's Privacy Policy](https://www.digitalocean.com/legal/privacy-policy/)
- OpenStreetMap Tiles
  - Map Tiles; Darstellung der Karte.
  - Erfasst anonymisiert Daten, die erforderlich sind z.B. um Missbrauch der OSM Server zu vermeiden bzw. zu erkennen. OSM hat ne strenge aber akzeptable [Usage Policy](https://operations.osmfoundation.org/policies/tiles/).
  - Auch führen sie eine anonyme Nutzungsanalyse durch, um die Server auf die Nutzung der Nutzer auszurichten sowie Nutzungszahlen zu erheben, die in öffentlich einsehbare Statistiken einfließen.
  - Sie sammeln: IP Addresse, Name des Browser und Gerätetyp, Name des Betriebssystem, die Seite woher der Nutzer kommt (Dies ist immer die Internetadresse der Babykarte, wenn die Nutzer die Babykarte nutzen), das Datum und die Uhrzeit und die aufgerufene Webseite innerhalb der OSM Webseite.
  - Dies ist eine runtergebrochene Version davon, bitte berufe Dich nicht auf dieser. Stattdessen lese mehr dazu auf der englischsprachigen OSM Foundation Webseite: https://wiki.osmfoundation.org/wiki/Privacy_Policy#Data_we_receive_automatically
- OSM Overpass
  - Holt die Daten der in OSM eingetragenen Geschäfte
  - Verhält sich gleich wie "OpenStreetMap Tiles"
- OSM Nominatim
  - Holt die Adressdaten der in OSM eingetragenen Geschäfte
  - Verhält sich gleich wie "OpenStreetMap Tiles"

### Beschreibung der Nutzerdaten
Die Babykarte selber wertet keine Nutzerdaten aus. Sie leitet die Eingaben des Nutzers lediglich nur weiter.

Beginn der allgemeinen Behandlung des Themas mit Bezug zu der Babykarte.

- (Öffentliche) IP Adresse
  - Die Adresse Deines Routers, die von Deinem Internetanbieter Dir bzw. Deinem Netzwerk zugeteilt wird. Dabei ist hier nicht die Adresse Deines Computers, Smartphones etc. gemeint, sondern die öffentliche Adresse, die Dein Router nutzt, um mit anderen Rechnern (OpenStreetMap, komoot etc.) zu konmunizieren. Diese Adresse wird von OpenStreetMap genutzt und gespeichert. Nach normalerweise 24 Stunden erhälst Du eine neue öffentliche IP Adresse.
  - Die Adresse Deines Computers, Smartphones etc. ist die private IP Adresse. Diese wird nur innerhalb Deines eigenen Rechnernetzes (Netzwerk) genutzt. Das Internet weiß darüber nichts. Jeder mit einem Router hat ein eigenes Netzwerk (Intranet).
  - Der Router ist somit der Punkt zum Internet. Er ist die Firewall und verschleiert die private IP Adresse Deines PCs und nimmt stattdessen seine eigene vom Internetanbieter zugeteilte öffentliche IP Adresse.
- Zeitdaten
  - Darunter fallen Datumsangaben und die Uhrzeit.
  - Diese werden nicht von Deinem Browser gesendet, sondern vom Server selbst ergänzt.
- Name des Browsers
  - Den Browser nutzt Du um Internetseiten ansehen zu können. Beispiele hierfür sind die Seiten von OpenStreetMap, Komoot, GitHub, Google etc.
  - Name z.B. Firefox, Chrome und Safari. Die Versionsnummer dieser Programme gehört dazu.
- Gerätetyp
  - Name bzw. Modellbezeichnung Deines Gerätes, welches Du nutzt um ins Internet zu gehen.
  - Beispiel: Huawei p9 lite, Samsung S3 Mini
- Name des Betriebssystems
  - Den Namen des Betriebssystems, welches Du nutzt um ins Internet zu gehen.
  - Beispiel: Windows 10, Linux/Debian
- die Seite woher der Nutzer kommt (Referrerurl).
  - Die Internetseite, von der die Anfrage an den OSM Server, an komoot etc. kommt. Im Fall der Babykarte wird es immer die zukünftige Internetadresse der Babykarte sein.

### Andere Definitionen

#### Cacheserver
Ein Cacheserver speichert Dateien, die oft von den Browsern der Nutzer angefragt werden. Dadurch wird die Ladezeit einer Webseite in Deinem Browser verkürzt. Cacheserver dienen Webseitenentwicklern als Speicherort für in der Programmierung häufig benötigten Dateien. Cacheserver können maschinell, durch Erhebung von Browserdaten, aber auch von Hand gepflegt werden. Wenn sie von Hand gepflegt werden, dann stimmen sich mehrere Entwickler ab oder der Serverbetreiber/Servermieter orientiert sich an den verwendeten Standards.

Eine häufig verwendete Datei in der Webprogrammierung nennt sich z.B. "JQuery", von dem es auch mehrere Versionen gibt. Diese Datei erleichert Programmierern die Arbeit und verkürzt deren Code, was sich positiv auf die Ladeperformance Deines Browsers auswirkt. Dadurch, dass die Datei von vielen Webentwicklern verwendet und damit von vielen Webseiten angefordert wird, lohnt es sich diese Datei an einem Ort abzuspeichern, damit Dein Browser diese nur einmal herunterladen muss und das Laden von Webseiten sich verschnellert.

### Standort des Nutzers
Idealerweise fragt Dein Browser nach, ob die Babykarte Deinen Standort verwenden darf. Wenn Du zustimmst, dann springt die Kaffee zu dem Punkt auf der Weltkarte, an der Dein Browser Deine Position vermutet. Dieser Standort ist je nach verwendeter Ermittlungsmethode nicht unbedingt genau. Bei der Verwendung von Standortdiensten wie GPS ist das Ergebnis um viel mehr genauer als bei der Verwendung Deiner öffentlichen IP Adresse zur Ermittlung Deines Standortes. Wenn Du nicht zustimmen solltest, so springt die Babykarte in einen Park in München oder zu der gewünschten Adresse, die vorher in der Url specifiziert wurde. Wenn Dein Browser Dich nicht fragt, dann hat die Babykarte nicht die Erlaubnis auf Deinen Standort zuzugreifen. Sie funktioniert auch ohne Standort. Sollte dies dennoch der Fall sein, dass die Babykarte auf Deinen Standort zugreifen kann und Du wurdest nicht gefragt, dann a) Du hast schon einmal die Nachfrage erhalten und zusätzlich zur Zusage Deinem Browser gesagt, dass er Deine Entscheidung speichern soll, b) Du verwendest einen schlechten Browser und solltest zu einem anderen wechseln.

Die Babykarte fragt den Standort nicht im Hintergrund ab, sondern nur beim Besuch der Webseite oder beim Neuladen dieser. Die Babykarte greift nicht die ganze Zeit auf Deinen Standort zu. Die Babykarte ist vielmehr darauf ausgerichtet Dir zu helfen, ein Kaffee anbietendes Geschäft in Deiner näheren Umgebung zu finden. Dazu benötigt die Babykarte Deinen Standort nur einmal und nicht die ganze Zeit. Es verfügt also nicht über Routenberechnungstechniken.

Es kommt übrigens auf die Situation drauf an, ob Standortdaten zu den personenbezogenen Daten gezählt werden können. Wenn Du Dich im öffentlichen Raum bewegst, wie es auch so vorgesehen ist, dann ist es nicht Dein Standort, sondern der Standort von vielen. Das heißt, in dieser Situation ist er nicht individuell. Da die Babykarte nur beim Besuch oder beim Neuladen der Seite den Standort abfragt, kann durch die Babykarte kein Bewegungsprofil erstellt werden. Idealerweise solltest Du die Babykarte innerhalb des öffentlichen Raumes nutzen und nur verwenden, wenn Du nach einem Kaffee anbietendem Geschäft in Deiner näheren Umgebung suchst. Dabei wird der Standort nur einmal abgefragt, was Energie spart und auch als Nebeneffekt Deine Privatsphäre nicht wirklich einschränkt. Sind die Daten der näheren Umgebung erstmal geladen, kommt die Babykarte ohne den aktuellen Standort aus und fragt diesen nicht nach.

Wenn Du Zuhause den Standortdienst verwendest, dann ist dieser Personenbezogen. Meines Wissens verwenden die Drittanbieter die Standortdaten nur zur Filterung der Ergebnisse, werten oder speichern den Standort nicht. Du kannst aber gerne selber nachlesen, da ich hier keine Garrantie für die Richtigkeit meiner Aussagen geben kann: https://wiki.osmfoundation.org/wiki/Privacy_Policy

### Sind diese Daten gefährlich für mich?
Allgemeine Informationen. Kein Bezug zur Babykarte.

Nein, sind diese nicht. In Zeiten, wo Software geupdated wird wie das Zeug hält.

- Fast jeder hat heutzutage Windows 10 oder Windows 7. Somit ist der Name des Betriebssystems bei vielen identisch.
- Fast jeder nutzt Safari, Chrome oder Firefox. Diese befinden sich meist auf dem eigenen Rechner auf der neuesten Version.
- Die (öffentliche) IP Adresse ist zwar für jedes Netzwerk individuell, jedoch wird sie normalerweise nach 24 Stunden geändert. Die IP Adresse gehört nicht einer individuellen Person.
- Gerätetyp: Niemand hat eine Geräteversion für sich allein. Zum Beispiel haben mehrere Leute das Huawei p9 lite.

### Warum werden diese Daten gesammelt?
Dies kann mehrere Gründe haben.

- Um herauszufinden, wie viele Nutzer z.B. welches Betriebssystem verwenden, welchen Browser. Diese Daten werden verwendet, da Browser Webseitencode anders interpretieren und jede Webseite auf jeden Browser etwas anders funktioniert. Dies kann dem Nutzer in Form von etw. anderem Aussehen, nicht richtiges funktionieren einzelner Elemente auf der Seite usw. auffallen. Der Anbieter erhofft sich durch die anonymisierte Erhebung dieser Daten herauszufinden, ob sich die Anpassung der Webseite für bestimmte Browser oder Betriebssysteme lohnt.
- Fehler beheben zu können.
- Zur Möglichkeit der Zurückverfolgung der IP Adresse seitens der Behörden bei einem Serverangriff.
- Herauszufinden was der Nutzer mag oder nicht. Google oder Facebook tun das. Dazu ziehen sie aber auch andere Daten in Betracht.

### Wie kann man sich vor Datenerhebung schützen.
- TOR Browser nutzen.
- Vom Browser gespeicherte Informationen kann man von diesem nach dem Beenden löschen lassen. Lese dazu in der Bedienungsanleitung Deines Browsers nach.

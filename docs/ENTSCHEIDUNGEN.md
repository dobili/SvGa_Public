# Entscheidungen

Protokoll aller Entscheidungen mit Datum und Begründung. Die Entscheidungen bis zum 13.10.2026
stehen ausführlich im Pflichtenheft (Abschnitt „Entscheidungen vom 13.10.2026“) und im
technischen Konzept; hier nur die Kurzfassung und alles, was danach dazukam.

## 26.10.2026 – Beschlossen in der Ideensammlung, noch nicht umgesetzt

Der Autor hat im Chat zugestimmt (Empfehlungen aus der Nachsicht Q1 und der Recherche Q2):

- **Anzeige bei Bots ohne Fehlerarten:** Statt „menschlich“ steht „Keine Fehlerneigung“ (ohne
  eingestellte Fehlerarten und Häufigkeit; der Bot spielt wie die reine Engine).
- **Ein Knopf für Lernsammlung und Fehlerdatenbank:** Ein Lesezeichen im Rückblick öffnet ein
  Fenster mit den Zielen „Lernen“ und „Fehler“; bei Zügen mit ?, ?? oder „verpasst“ ist „Fehler“
  vorgewählt, sonst „Lernen“. Dazu: Felder aus der Auswertung vorschlagen (Eröffnung, Fehlerart,
  Motiv, besserer Zug), goldenes Aufleuchten bei einer guten Gelegenheit.
- **Neue Trainingspläne:** 5 Minuten (nur fällige Wiederholungen), 15 Minuten (5 Minuten
  Wiederholungen plus 10 Minuten Taktik-Themenblock oder Studie), Taktik auf Zeit (3 Minuten leichte
  Aufgaben, Ende nach drei Fehlern, freiwillig), Tagesaufgabe mit Serie (Tage in Folge). Die
  Aufteilung der Pläne ist ein Vorschlag der App, kein Buchinhalt, und wird als solcher gekennzeichnet.
- **Umsetzung:** In getrennten Chats parallel; jeder Chat prüft vorher die hier festgehaltenen
  Ergebnisse noch einmal gegen den Code.

## 26.10.2026 – Phase in eigenen Partien bleibt wie sie ist

- Die Lesart für eigene Partien bleibt: Mittelspiel, sobald eine Seite entwickelt ist (höchstens
  eine Leichtfigur zu Hause). Die strenge Glossarregel (beide entwickelt und rochiert) gilt weiter
  nur für Stellungen des Buches. Anlass: In der Partie des Autors galt die Stellung nach 5. Sbd2
  schon als Mittelspiel; der Autor hätte noch Eröffnung gesagt, will aber keine Änderung, weil
  sie Phasengrenzen und Spielstärke je Phase verschieben würde. Auch die Lage des „M“ in der
  Zugliste bleibt.

## 13.10.2026 – Grundlagen (mit dem Autor abgestimmt)

- Progressive Web App unter schach-von-grund-auf.com, ohne Unterpfade, nach der Installation offline,
  mit Update-Funktion. Sprache wird in der App gewählt.
- Im Buch ein QR-Code (Vorwort oder Kapitel 0) und in jedem Kasten „Training zu diesem Kapitel“ eine
  Zeile „In der App:“ mit Trainername und Weg. Trainernamen ab Druck fest.
- Code GPLv3, Buchinhalte alle Rechte vorbehalten.
- TypeScript mit **React** statt Svelte: Claude arbeitet damit am zuverlässigsten, Qualität geht vor
  Lesbarkeit für den Autor.
- Brett und Figuren wie im Buch: Felder #F5F0E6 und #7F8794, Figuren der Schrift SkakNew in Navy.
- Hosting bei Cloudflare (Workers mit statischen Dateien), Code auf GitHub.

## 13.10.2026 – beim Bau des Gerüsts (Claude)

- **Buchquellen nicht im Repository.** Abweichung vom Konzept (dort `buch/a1/` im Repository).
  Grund: Das Repository muss wegen der GPL öffentlich werden, der vollständige Buchtext wäre dann
  frei lesbar. Die Quellen liegen nur lokal und kommen aus dem privaten Repository
  `dobili/schachbuch-quellen` (angelegt 13.10.2026, bleibt immer privat); ins
  Repository kommen nur die erzeugten App-Daten. Die Pipeline-Tests nutzen ein eigenes Testkapitel.
- **Stockfish 19 statt 17.** Das npm-Paket `stockfish` (Stockfish.js von Nathan Rugg, GPL-3.0) liegt
  in Version 19 vor. Gewählt wird `stockfish-19-lite-single` (≈1,7 MB, ein Kern, braucht keine
  besonderen Server-Kopfzeilen).
- **Figuren als TypeScript-Modul** statt einzelner SVG-Dateien in `public/figuren/`: Das Brett zeichnet
  die Pfade direkt, so lassen sich Farben (auch dunkler Modus) zur Laufzeit setzen. Erzeugt von
  `pipeline/figuren/erzeuge_figuren.py`.
- **Bildunterschriften als Textteile** (Text mit Stil fett/kursiv, Zug, Verweis), damit Hervorhebungen
  und Abbildungsverweise in der App erhalten bleiben und Verweise antippbar werden.
- **Art „loesung“ und „merksatz“** zusätzlich zu den Arten aus dem Konzept, weil im Buch Diagramme
  auch in diesen Kästen stehen können.
- **Netzzugang der Cloud-Umgebung „Voll“** (Autor, 22:04): nötig für npm, CTAN, die Lichess-Datenbank
  und Endspieltabellen.

## 13.10.2026 – AP 0 und AP 1 (Claude, zweite Sitzung)

- **TypeScript 6.0.3 statt 7.0.** typescript-eslint 8.71 unterstützt nur TypeScript < 6.1.
- **Abtauschbilanz mit beidseitigem Aufhören.** Jede Seite schlägt mit der billigsten Figur und
  darf aufhören, sobald weiteres Schlagen Material kostet. Das Beispiel im Text von Kapitel 1
  (Springer und Dame gegen Turm) nennt +3 für den Fall, dass der Turm zurückschlägt; bei bestem
  Spiel schlägt er nicht zurück, die App nennt deshalb +1. Bei Gleichstand (Abb. 1.26) lohnt der
  erste Schlag nicht („Noch geht nichts“), wie im Vorsicht-Kasten.
- **Batterie** heißt: Eine Läufer-, Turm- oder Damenfigur steht hinter einer eigenen Figur, die das
  Feld selbst angreift (Abb. 1.26: Dame b6 hinter Bauer c5). Steht vorn eine Figur, die das Feld
  nicht angreift, zählt die hintere nicht (Abb. 1.6: Dame d8 hinter d5, Dame d1 hinter Ld3).
- **Farben beim Zählen wie im Buch:** Rot die angreifende Seite (Gegner der Figur auf dem Feld,
  bei leerem Feld die Seite am Zug), Gold die verteidigende, das Feld rot umrandet.
- **Eigener Service Worker** (vite-plugin-pwa „injectManifest“) statt des erzeugten: nur so kann
  die Installationsseite den Ladefortschritt in Prozent zeigen, und eine neue Version wird erst nach
  Tippen auf „Jetzt aktualisieren“ aktiv.
- **Android-Zurück:** Die Adresse bleibt gleich; ein zusätzlicher Verlaufseintrag fängt die
  Zurück-Taste ab, solange es in der App etwas zum Zurückgehen gibt.
- **Brett mit 64 unsichtbaren Knöpfen** über dem SVG: zuverlässig auf Touchscreens, jedes Feld ist
  für Bildschirmleser benannt („d4, Bauer (Weiß)“).
- **Überschriften in Source Serif 4** wie in den Bildschirmentwürfen (zusätzlich zu Source Sans 3,
  beide SIL OFL, mitgeliefert). Gold für Text auf Creme dunkler (#7D6007), damit der Kontrast
  4,5 : 1 erreicht.
- **App-Symbol:** weißer Springer aus SkakNew auf Navy (`app/skripte/erzeuge-symbole.mjs`).
- **„Zuletzt geöffnet“ im localStorage.** Eine Bequemlichkeit, die verloren gehen darf. Fortschritt
  und eigene Daten kommen mit dem Modul Speicher in IndexedDB.
- **CI ohne Buchquellen:** GitHub Actions prüft die eingecheckten Daten gegen die Schemas
  (`python -m pipeline.pruefen.daten`), statt den Datenlauf zu wiederholen.
- **Kein Umweg über den Zweig `ci-berichte`** mehr: npm ist erreichbar, CI-Ergebnisse lese ich über
  die GitHub-Werkzeuge der Sitzung.
- **Cloudflare zunächst mit `ap0-geruest` als Hauptzweig**, weil `main` noch leer ist; nach der
  Freigabe wird auf `main` umgestellt (`docs/archiv/stand-0.2.30/CLOUDFLARE.md`, Schritt 6).

## 13.10.2026 – AP 2 (Claude)

- **AP 2 vor dem Handytest** auf eigenem Zweig `ap2-datenpipeline`, damit `ap0-geruest` für den Test
  unverändert bleibt (mit dem Autor abgestimmt).
- **Prüfungen aus `pruefe_buch.py` gehören zum Datenlauf** und landen im Bericht. Schwere: was die
  App-Daten verfälschen würde (Nummern, Glossaranker) ist Fehler und stoppt den Lauf; fehlende
  `\bibitem` sind Warnungen; Stil und Regel R10.4 sind Hinweise. Der Bericht ist öffentlich und
  nennt keine Buchsätze.
- **Lehrbilder ohne König** (Kapitel 0, 5, Abb. 8.37) sind wie im alten Skript erlaubt; die App
  bietet dort nur das Zählen an, keine Engine.
- **Seitenverweise:** Die App hat keine Seiten. „S.~\glseite{anker}“ wird zu „Abschnitt x.y“ mit
  Sprung zur nächsten Abbildung an der Stelle; „\ref“ zeigt die Nummer wie im Buch; „\cite“ zeigt
  „[n]“ in der Reihenfolge der Quellen.
- **Übungen:** Aus dem Buch kommen Aufgabe, Diagramm(e) und Lösungstext. Die Felder, die der Autor
  freigeben muss (Lösungszüge, akzeptierte Züge, Kurz-Erklärung, Motive, Konzept 4.3), kommen
  später aus `inhalte/de/`. Reine Textübungen ohne Diagramm sind kein Befund.
- **Bilanzen als Folge von Text- und Tabellenblöcken**, weil eine Zielbilanz mehrere Varianten mit
  eigener Tabelle enthalten kann („Damengambit: weitere Varianten“). Die Zeichen am Zellenanfang
  werden als Wertung gespeichert (ja/teils/nein, Waage vornlinks/vornrechts/gleichstand): Grundlage
  der späteren Kalibrierung (Konzept 13).
- **Glossar-Pfeile** werden dem längsten passenden Eintrag zugeordnet, auch ohne Klammerzusatz
  („→ Bauernhebel“ zu „Bauernhebel (Hebel)“). Findet sich keiner, bleibt der Pfeil Text und es gibt
  einen Hinweis.

## 14.10.2026 – AP 3 Zugfolgen-Verfahren (Claude, Fable)

- **Beispiele entstehen aus dem Text, nicht aus einer Liste.** Jede `\zugfolge` mit Zugnummer wird
  nachgespielt; wo sie anschließt, entscheidet die Reihenfolge aus dem Dateikopf von
  `pipeline/zugfolgen/nachspielen.py` (Übungsstellung, genannte Abbildung, Spitze, letzte
  Abbildung, Knoten des Abschnitts, Grundstellung, Abbildungen nach Abstand, andere Abschnitte,
  frühere Kapitel). Gewählt wird der erste Anschluss, an dem alle Züge legal sind; nennt der Text
  hinter der Zugfolge eine Abbildung („… (Abb. 5.27)“), gewinnt der Anschluss, der dorthin führt.
- **Ein Beispiel je Eröffnung:** Je Abschnitt beginnt für jeden anderen ersten Zug ein eigener Baum
  in der Grundstellung. Sonst lägen alle Gambits in einem Baum.
- **Abbildungen gehören zum Beispiel ihres Abschnitts.** Alle 1.-e4-e5-Eröffnungen teilen die
  ersten Züge; „Nach 1. e4 e5“ der Italienischen Partie hängt trotzdem am italienischen Beispiel.
  Erst am Kapitelende zählt jeder passende Knoten.
- **Frühere Kapitel als Anschluss:** Kapitel 5 und 6 setzen Eröffnungen aus Kapitel 2 fort
  („Nach 8. d5 Se7 … (Abb. 5.27)“). Solche Abbildungen hängen am Beispiel von Kapitel 2; der
  Anschluss zählt nur, wenn die ganze Zugfolge legal ist.
- **Schachzeichen zählen:** „Tb7+“ ohne Schach passt nicht (python-chess übergeht „+“). Ein
  fehlendes „+“ im Buch ist nur ein Hinweis.
- **Nebenvarianten:** Beginnt eine Zugfolge mit „?“, „??“ oder „?!“, verschiebt sie die Spitze
  nicht („etwa 1. Kh7?“, danach „Nach 1... h4“ wieder in der Hauptlinie). Eine Antwort mit „!“ oder
  nach „??“ setzt die Nebenvariante fort („5... Dg6?? folgt 6. Sxc7+!“).
- **Nummerierte Einzelzüge** („im Englund-Gambit (6. Lc3??)“) hängen nur an der unmittelbaren
  Umgebung und nur bei passender Zugnummer; sonst sind sie Erwähnungen.
- **PGN-Entwürfe liegen im Repository** (`inhalte/de/zugfolgen/`), damit der Autor sie direkt
  freigeben kann. Sie enthalten nur Züge, Zugzeichen und Abbildungsnummern, keinen Buchtext.
  Freigegebene Dateien werden nie überschrieben; nur sie kommen in die App.
- **Engine-Prüfung der Zugzeichen** mit derselben Engine wie in der App (Stockfish 19 lite unter
  Node, Tiefe 14, Startwerte: ?? ab 2,0, ? ab 0,8, ?! ab 0,3, ! höchstens 0,3 schlechter). Nur als
  Hinweis; Schwellen mit dem Autor abstimmen.

## 14.10.2026 – AP 4 vorbereitet: Prüfhilfe und genauere Zuordnung (Claude, Opus)

- **Prüfhilfe statt PGN lesen:** `docs/freigabe/kapNN.md` (von der Pipeline geschrieben) zeigt jedes
  Beispiel in deutscher Notation mit Abbildungen am Zug, Abzweigungen mit LaTeX-Zeile und Befunden.
  Keine Buchsätze, nur Züge, Nummern, Abschnittstitel und Fundstellen.
- **Einschätzungen von Hand** in `inhalte/de/einschaetzungen.json`, zugeordnet über Datei,
  Prüfung und ein Textstück des Befunds (keine Zeilennummern, die verschieben sich).
- **Von den 9 Warnungen aus AP 3 waren 7 Fehlgriffe der Pipeline**, keine Buchfehler. Die
  Zuordnung wurde deshalb genauer:
  - Lösungen bleiben im Baum ihrer Übung; Zugnummern zählen dort auch ab der Übung („1. Dd8+!!“
    in Abb. 7.56 bei Zug 9). Übungstext und Lösung müssen die Zugnummer treffen und wandern nie in
    den Baum einer anderen Übung. Eine Übung ohne eigenes Diagramm nutzt das, auf das sie verweist.
  - Unterschriften und Text vor seinen Diagrammen werden nur gespielt, wenn sie die Abbildung
    erreichen. „Nach 5. Sc3“ wird am Kapitelende gegen die letzten Züge vor der Stellung geprüft.
  - Nennt eine Zugfolge die letzten Züge einer schon gezeigten Abbildung desselben Abschnitts
    („… 9. Sbd2 (Abb. 2.23)“), setzt sie dort an, statt eine Kopie anzulegen.
  - „x“ und „+“ zählen bei der Wahl des Anschlusses (python-chess nimmt „Sxe5“ auch ohne Schlagen).
  - Der Anschluss und seine Vorgänger gelten als zuletzt berührt.
- **Beispiele, deren Startstellung auch in einem anderen Baum vorkommt**, führt die Pipeline nicht
  selbst zusammen (eine Übung zu einer Partiestellung soll eigenständig bleiben können); die
  Prüfhilfe weist darauf hin, der Autor entscheidet. Dafür gibt es den Status „verworfen“.
- **Engine-Prüfung reproduzierbar und zweistufig:** jede Suche als neue Partie (sonst andere Werte
  je Lauf), erst Tiefe 14, Abweichungen mit Tiefe 22 bestätigt. Führen bester und gespielter Zug
  beide in ein Matt derselben Seite, gilt der Verlust als 0. Dauer des Laufs mit `--zugzeichen`:
  etwa 4,5 Minuten.

## 14.10.2026 – AP 6 Lösungserklärungen als Entwürfe (Claude, Opus)

- **Eine Datei je Kapitel** `inhalte/de/texte/loesungen-kapNN.json` mit Status je Erklärung, damit
  der Autor einzeln freigeben kann. Die Pipeline schreibt diese Dateien nie (anders als die
  PGN-Entwürfe), weil sie von Hand verfasst sind.
- **Felder:** Lösungszüge wie im Buch (deutsch, mit Zugzeichen und Buchnummerierung), akzeptierte
  Alternativen, Motiv, Text. Die Zugnummern bleiben die des Buches (relativ zur Übung); die Prüfung
  spielt nur die Züge nach.
- **Prüfung gegen das Buch:** erster Lösungszug muss in den Zugfolgen der Buchlösung vorkommen;
  Züge müssen ab der Übungsstellung (oder bei Eröffnungen ab der Grundstellung) spielbar sein.
  Übungen ohne eigenes Diagramm nutzen das, auf das die Aufgabe verweist.
- **Engine-Prüfung** des ersten Lösungszugs mit `--zugzeichen`, gleicher Maßstab wie „!“
  (höchstens 0,3 schlechter als der beste Zug, Bestätigung mit Tiefe 22). Alle 86 Entwürfe bestehen.
- **In die App** kommen nur freigegebene Erklärungen als optionales Feld `uebung.erklaerung`
  (Schema `uebung.schema.json`, Typ aus `loesungstexte.schema.json#/$defs/erklaerung`).

## 14.10.2026 – Feinere Zuordnung und Empfehlungen zur Freigabe (Claude, Opus)

- **Fortsetzungen aus früheren Kapiteln:** Zeigt Kapitel 5 eine Stellung aus einer Eröffnung von
  Kapitel 2, ohne die Züge zu wiederholen, wird das Beispiel des früheren Kapitels kopiert und die
  Abbildung daran gehängt. Warum: Sonst fehlte die Abbildung in jedem Entwurf.
- **Übungsdiagramme bilden eigene Abschnitte** („Übung N“): Der Übungskasten steht im letzten
  Abschnitt eines Kapitels, ohne das rutschten Übungsstellungen in dessen Eröffnungsbaum.
- **„nach 12. Lxf7+“ mitten in einer Unterschrift** wird gelesen, aber nicht als Befund gemeldet:
  Dort beschreibt der Satz meist etwas anderes als die gezeigte Stellung.
- **Alternativen in Klammern** verschieben die Hauptlinie nicht, wie Züge mit „?“.
- **Empfehlungen** in `inhalte/de/empfehlungen.json` statt Entscheidungen der Pipeline: Bei gleicher
  Startstellung rät Claude von Hand zu „zusammenführen“, „Vorlauf übernehmen“, „aufteilen“ oder
  „verwerfen“; bei Übungen automatisch „getrennt lassen“. Alle Abbildungen ohne Zugfolge sind
  eingeordnet; wo eine Zugfolge sinnvoll wäre, steht ein geprüfter Zug als Vorschlag. Warum: Was
  ein Beispiel ist, ist Lehrentscheidung des Autors, nicht der Maschine.

## 14.10.2026 – Stabile Kennungen der Beispiele (Claude, Opus)

- **Kennung nach der Abbildung** statt laufender Nummer: die Abbildung, an der das Beispiel
  beginnt, sonst die kleinste (als Zahl verglichen, 2.55 vor 2.132); ohne Abbildung die ersten drei
  Züge der Hauptlinie (`k03-z-d4-d5-c4`), bei Gleichheit `-2`, `-3`. Warum: Laufende Nummern
  rückten nach, sobald die Zuordnung ein Beispiel strich, und eine freigegebene Datei hätte dann
  einen fremden Entwurf blockiert.
- **Abweichung melden:** Weicht ein neuer Entwurf in seinen Abbildungen von einer freigegebenen
  oder verworfenen Datei gleicher Kennung ab, ist das ein Hinweis (`entwurf-abweichend`) in Bericht
  und Prüfhilfe.

## 14.10.2026 – AP 5 Kernoberfläche (Claude, Opus)

- **Entwürfe in der App bis zur Veröffentlichung** (Vorschlag, Antwort des Autors steht aus):
  Die Pipeline nimmt mit `--mit-entwuerfen` auch PGN-Entwürfe in die Daten, mit Status „entwurf“;
  die Zugleiste zeigt dann den Hinweis, dass der Autor noch nicht freigegeben hat. Warum: Der
  Autor kann Teil E (Zugfolgen freigeben) direkt in der App auf dem Handy prüfen. Freigegebene
  Beispiele gewinnen, wenn eine Abbildung in zwei Beispielen steht. Vor AP 17 (Veröffentlichung)
  läuft der Datenlauf wieder ohne den Schalter.
- **Zugleiste:** Halbzug vor und zurück, Anfang, Ende; die ganze Zeile durch den aktuellen Zug als
  Tippflächen, Abbildungen als goldene Marken, andere Züge an dieser Stelle als Chips, „Zurück zur
  Hauptvariante“. Die Pfeile des Buches erscheinen nur, solange die Stellung einer Abbildung
  gezeigt wird; Zählen und Engine arbeiten auf der gezeigten Stellung.
- **Datentest:** Jede verknüpfte Abbildung muss im Beispiel genau an ihrer Stellung stehen
  (Figuren und Zugrecht). Alle 662 Verknüpfungen bestehen.

## 14.10.2026 – AP 7 Analyse-Grundbausteine (Claude, Fable)

- **Ein Profil je Stellung** (`analyse/stellungsprofil.ts`): Die Bausteine hängen über eine
  WeakMap an der unveränderlichen Stellung und rechnen jeden Teil erst beim ersten Zugriff. Die
  Werkzeuge greifen nur über `profil(stellung)` zu, nie direkt auf `angreifer.ts`; so steckt ein
  Fehler oder eine Verbesserung nur an einer Stelle (Konzept 15.1: „Ein Fehler hier steckt
  sonst in allem“).
- **Schlagreihenfolge bei gleichem Wert:** Springer vor Läufer (Abb. 7.30 spielt 1. Sxd5; das
  Läuferpaar bleibt, Kapitel 5). Die Bilanz ändert sich dadurch nicht, die Schlagfolge wird
  eindeutig.
- **Fesselungen bleiben in der Abtauschrechnung unberücksichtigt**, wie das Buch es verlangt
  (Kapitel 7, „Nicht überschätzen: Eine gefesselte Figur wirkt weiter“) und das Pflichtenheft
  festlegt (6.6: „Fesselungen werden dabei nicht berücksichtigt, ihre Wirkung prüft F3“).
- **Sicheres Feld:** Was die Figur auf dem Feld schlägt, abzüglich dessen, was der Gegner laut
  Abtauschrechnung zurückgewinnt, ist nicht negativ. Ein gleichwertiger Abtausch (Lxf3 Dxf3 in
  Abb. 1.32) gilt als „verliert nichts“. Die Rechnung sieht nur das Zielfeld: Ein relativ
  gefesselter Springer bekommt deshalb sichere Felder, obwohl sein Wegzug die Dame kostet; das
  prüft erst F3 (AP 8).
- **Drohung** genau nach Konzept 7.2: ein Schlag mit positiver Bilanz oder ein Matt in einem Zug,
  als wäre die Seite (nochmals) am Zug; steht die Seite am Zug im Schach, entfällt die Frage.
  Ein „drohender Zug“ ist ein stiller Zug, nach dem eine Drohung besteht, die es vorher nicht
  gab; Schachs und Schläge stehen in ihren eigenen Listen (Reihenfolge der Röntgen-Regel). Die
  Bilanz eines Schlages gilt für den genannten Schläger (Sxd3 in Abb. 1.34), danach läuft die
  Rechnung mit der billigsten Figur weiter. Folge: Von den „beiden schwarzen Drohungen“ in
  Abb. 1.34 ist nur Sxd3 eine Drohung im Sinne der App; Dxg5 gewinnt nichts, weil der Läufer c1
  den Springer deckt. Kein Buchbefund: Das Buch nennt dort Angriffe, keine Gewinne.
- **Vorprüfung der Schachs:** Ein Zug wird nur gespielt und geprüft, wenn die Figur vom Zielfeld
  aus den König trifft, das Startfeld auf einer Linie mit dem König liegt, ein Bauer umwandelt
  oder der König rochiert. Ein Test vergleicht das auf allen 765 Abbildungen mit dem vollen Lauf.
  Damit bleiben die erzwingenden Züge unter 11 ms je Stellung (Node).
- **Linienmotive:** Fesselung, wenn hinter der vorderen gegnerischen Figur eine wertvollere
  steht (König immer am wertvollsten, dann absolut); Spieß, wenn die vordere wertvoller ist;
  gleich wertvolle Figuren hintereinander sind keines von beiden. Vorn eine eigene
  Langschrittfigur, die in dieselbe Richtung zieht: Batterie; sonst vorn eine eigene Figur und
  dahinter eine gegnerische: Abzug. „Hinten ungedeckt“ wird beim Spieß mitgeliefert, das
  Warnsignal W2 (AP 8) entscheidet damit nach Pflichtenheft 6.6.
- **W1 und W3** nach den Regeln der App in Pflichtenheft 6.6. Für die Fluchtfelder wird der
  König weggedacht, damit ein Turm auch die Felder hinter ihm beherrscht (Abb. 7.36).
- **Bauernkette** wie in Kapitel 5: nur Bauern, denen ein gegnerischer Bauer direkt
  gegenübersteht, bilden die Kette; Nachbarn, die noch ziehen können, sind „Stützen“ der Basis
  (c3 in Abb. 1.26). **Rückständig** ist ein Bauer, dessen Nachbarn alle vor ihm stehen _und_
  der den Deckungstest nicht besteht (b7 in Abb. 5.8 ist nicht rückständig: nach ...b5 deckt a6).
  **Löcher** werden auf den eigenen Reihen 3 bis 6 gesucht, **starke Felder** sind gegnerische
  Löcher auf der eigenen 5. und 6. Reihe. **Mehrheiten** zählen a bis d und e bis h (Berliner
  Endspiel: „vier gegen drei“ am Königsflügel).
- **„Rochiert“** ist aus einer Stellung allein nicht ablesbar. Regel der App: König auf a bis c
  oder g bis h und kein Rochaderecht mehr. Für die Königsprüfung der Zielbilanz (AP 8) reicht
  das; bei Bedarf liefert der Verlauf die genaue Antwort.
- **Zugleiste:** Die vier Zugknöpfe stehen ganz unten im Kasten, direkt über dem Brett (Wunsch
  des Autors, 14.10.2026), damit sie bei langen Partien ohne Scrollen erreichbar bleiben.

## 14.10.2026 – AP 8 Werkzeuge Kapitel 1 bis 4 (Claude, Opus)

- **Regeln aus Pflichtenheft 6.6 und Kalibrierung (vorläufig, Autor entscheidet).** Die Regel aus
  6.6 gilt, wenn sie an den Bilanzen und Beispielen des Buches das Kalibrierziel aus Konzept 13
  (90 Prozent) erreicht. Verfehlt sie es deutlich, benutzt die App die am Buch geeichte Regel,
  nennt sie unter „So prüft die App“ und meldet die Abweichung als Entscheidung in
  `FORTSCHRITT.md`. Wo das Buch präzise zählt (Abb. 1.36 und 1.37), gilt das Buch (6.6: „Wo das
  Buch präzise ist, gilt das Buch“). Betroffen in AP 8: Königssicherheit und Aktivität der
  Faktorenbilanz, Angriffssektor. Nach 6.6 umgesetzt: Zentrumskontrolle durch Figuren (96 Prozent).
- **Kalibrierung als Test.** Jede Bilanztabelle des Buches ist ein Testfall (`bilanzfaelle()` in
  `schach/buchabbildungen.testhilfe.ts`); bekannte Abweichungen stehen benannt im Test und als
  Befund in `FORTSCHRITT.md`, jede andere lässt den Test scheitern.
- **Engine-Werkzeuge** rechnen in eigenen Karten (FalleKarte, AntwortenKarte), weil die
  Werkzeug-Schnittstelle synchron ist; das Werkzeug selbst liefert den sofort berechenbaren Teil.
- **Buchzüge ohne Fragezeichen** aus den Eröffnungen der Kapitel 2 und 3 sind nie eine Todsünde.
- **Fallenchecks** aus Kapitel 4 sind App-Daten (`kapitel.fallenchecks`).

## 14.10.2026 – AP 9 Werkzeuge Kapitel 5 (Claude, Fable)

- **Skelett- und Planbilanzen sind App-Daten** (`kapitel.bilanzen`, Art `skelett` und `plan`),
  gelesen wie Ziel- und Faktorenbilanzen; die Folgerung (`skelettfolgerung`, `planplan`) steht
  im Feld `urteil`. Damit sind sie Kalibrierfälle wie in AP 8.
- **Kalibrierung je Zeile und Seite.** Skelettbilanzen sind Prosa; der Test
  (`k5-kalibrierung.test.ts`) hält zu jeder Zeile und Seite die Felder und Zahlen fest, die das
  Buch nennt, und scheitert an jeder Zeile ohne Erwartung. Abweichungen stehen benannt im Test
  und als Befund in `FORTSCHRITT.md`.
- **Stellungstyp „offen“ nach dem Buch statt nach 6.6:** offen, wenn auf keiner Zentrumslinie
  Bauern beider Seiten stehen (Abb. 5.37 ohne Bauern, 6.3 und 11.43 mit Isolani). 6.6 verlangt
  „kein Bauer mehr“ und verfehlt damit drei von sieben Beispielen; vorläufig, Autor entscheidet.
- **„Vorher“ je Bauer wie Abb. 5.2:** rot die Felder, die der gezogene Bauer nie wieder deckt;
  neue Löcher (kein eigener Bauer mehr) als zweite Zeile. 6.3 spricht von „kein Bauer mehr“;
  vorläufig, Autor entscheidet.
- **Löcher nur „nutzbar“ melden:** ein gegnerischer Bauer stützt das Loch, oder eine gegnerische
  Figur erreicht es mit einem Zug und keine eigene Figur greift es an (Kapitel 5: „erreichen und
  sich dort halten“). Sonst zeigt die App zu viele Löcher (5.43: d3 und d6; 11.70: a6).
- **Mehrheiten ohne verkeilte Zentrumsbauern und Freibauern** (Abb. 11.43: „a2 und b2 gegen a6“,
  11.57: Zentrum als eigene Zeile). Zentrumsbauern stehen in der Zeile „Zentrum“.
- **Reihenfolge der Felder wie im Buch:** von der eigenen Grundreihe nach vorn, dann a bis h
  („c7 und c6“, „a7, c6“); Figuren nach Faustwert (Läufer vor Dame).
- **Eine Schwäche je Bauer, die genauere zuerst:** Doppelbauer, Isolani, Kettenbasis ohne Stütze,
  rückständig, hängend, sonst „Deckungstest nicht bestanden“ (5.26: d4 ist Basis, auch wenn es
  rückständig ist).
- **Königsflügel erst nach der Rochade** (Haken, Löcher vor dem König, Luftloch); vorher gibt es
  keinen Schild, den ein Bauernzug schwächen könnte.

## 14.10.2026 – AP 9 Werkzeuge Kapitel 6 (Claude, Fable)

- **Planfrage 1 als Lagen der Buchtabelle:** Die App prüft die fünf Lagen von oben nach unten und
  zeigt jede zutreffende; die Antwort ist die erste, die einen Ort nennt (geschlossen: Kette;
  verschiedene Flügel: Sturm gegen den gegnerischen König; gleicher Flügel nur mit allen drei
  Bedingungen; offen: Zentrum; sonst fixierte Schwäche oder Minderheitsangriff, sonst Kette).
  „Offen“ heißt „keine verkeilten Bauern“ (Kapitel 6), unabhängig vom Stellungstyp aus Kapitel 5.
- **Zählung auf dem Zielfeld eines Hebels, als stünde der Bauer schon dort** (Abb. 6.3: der Turm
  d1 hinter dem Bauern zählt, „drei gegen drei“).
- **Sturm:** Züge bis ein eigener Bauer einen Schildbauern (die vordersten Bauern auf den drei
  Linien um den gegnerischen König) angreift; Doppelschritt ein Zug, besetzte Felder sperren,
  höchstens vier Züge (Abb. 6.6: zwei gegen drei).
- **Ziel im Schild:** ein Feld des Schildes oder neben dem König, das außer dem König keine
  gegnerische Figur deckt und das eine eigene Figur (kein Bauer) angreift (Abb. 6.7: h7).
- **Fixiert:** das Feld vor dem schwachen Bauern ist besetzt oder von einem eigenen Bauern
  bewacht, ohne dass ein gegnerischer Bauer es deckt (Abb. 6.10: c6 durch d4).
- **LAP-Reihenfolge:** Leichtfiguren auf dem Startfeld zuerst (Entwicklung), dann Leichtfiguren
  nach freien Feldern, dann Türme, dann die Dame (Abb. 6.16: der Springer d2, nicht der Turm f1
  mit einem Feld). Vorläufig, Autor entscheidet.
- **Vorschlag (N):** Springer auf ein Loch, sonst ein Springerfeld, sonst das Feld mit der
  größten Wirkung in die gegnerische Hälfte (Felder unter Bauernfeuer gesperrt, eigene Figuren
  im Weg machen Platz, höchstens drei Züge); Türme auf die offene, sonst halboffene Linie (ohne
  eigenen Turm zuerst), von dort auf die 7. Reihe; Läufer auf ein sicheres Feld mit mehr Wirkung,
  schlechte Läufer in den Tausch; die Dame zuletzt.
- **Plan des Gegners ohne Engine** ist seine Antwort auf Planfrage 1 (Hebel gegen die eigene
  Basis, Sturm, Gegenschlag). Was er spielen würde, rechnet die Engine nach einem Nullzug (drei
  Varianten); im Schach gibt es keinen Nullzug.
- **„Der Angriff läuft“** ab drei gegnerischen Angreifern im Sektor um den eigenen König
  (Faustregel des Buches); davor stehen die fünf Mittel „für später“.
- **Hängende Bauern stehen auf derselben Reihe** (Präzisierung; Abb. 6.10 c6/d5 ist eine Kette).
- **Planbilanz des Buches als App-Daten** (`Werkzeugeingabe.bilanz`), wie der Fallencheck.

## 14.10.2026 – AP 9 Werkzeuge Kapitel 7 (Claude, Fable)

- **W6 Gabelgeometrie nach 6.6, ohne Bauern als Ziel:** Felder, die ein Springer oder Bauer mit
  einem Zug erreicht und von denen er zwei gegnerische Figuren trifft (König, wertvollere oder
  ungedeckte); ob das Feld gedeckt ist, bleibt offen (Art E, wie 6.6).
- **W7 Figur am Rand (6.6, präzisiert, Art N):** höchstens zwei sichere Felder, und die Figur
  ist angegriffen, steht auf der a- oder h-Linie oder in der gegnerischen Hälfte; nicht
  unangegriffen auf der eigenen Grundreihe.
- **Kandidaten in Rechenreihenfolge:** Schachs, Schläge nach Bilanz, dann Züge mit neuer Drohung;
  ein Schach, das schlägt, steht nur bei den Schachs; Nummern am Brett höchstens zwölf.
- **Motiv benennen an der Zugfolge:** Der Schlüsselzug ist der nächste Zug im Buch mit seiner
  Fortsetzung (Hauptvariante, bis acht Halbzüge), wenn er selbst ein Motiv trägt, sonst der
  letzte Zug (Abbildungen „nach 1. Dd5+“). Die Rangfolge der Motive nennt Zugfolge-Motive
  (Räumung, Beseitigung, Überlastung, Ablenkung, Hinlenkung, Zwischenzug, Desperado, Patt,
  Dauerschach) vor Ein-Zug-Motiven (Doppelschach, Abzug, Batterie, Gabel, Doppelangriff, Spieß,
  Fesselung, Umwandlung, gefangene Figur). Ablenkung heißt: Die Figur, die den Köder nahm, sperrte
  die Linie des Folgezuges; Hinlenkung: Der Folgezug trifft sie auf dem Köderfeld oder setzt matt.
- **Mattbilder** werden an der Mattstellung erkannt (Schachgeber, Decker, Nachbarfelder):
  Erstickung, Anastasia, Arabisch (nur in der Ecke), Boden, Damiano, Lolli, Dame mit Läufer auf
  h7, Dame mit Springer, Treppe, Grundreihe (Felder davor eigene Figuren oder beherrscht). Ein
  gedrohtes Matt (Abb. 7.61: Dh6 droht Dg7#) zählt als „Droht: Lolli-Matt“.
- **Ruhe** nach Kapitel 7: Die Hauptvariante der Engine endet nach dem letzten Schach oder
  Schlag; Schritte zu höchstens vier Halbzügen; die Bilanz zählt das Material aus Sicht der
  Seite am Zug vorher und am Ende.
- **Abwehrfragen** gelten der stärksten gegnerischen Drohung im nächsten Zug (Matt vor
  Material); eigene Schachs zählen als Gegendrohung (Dauerschach, Motiv 12).

## 14.10.2026 – AP 10 Werkzeuge Kapitel 8 (Claude, Fable; Autor abwesend, AP 10 freigegeben)

- **Sechs Regeln als Näherung:** Je Regel sagt die App, was in der Stellung dazu zu sehen ist:
  Stand und sicherer Weg des Königs (zu den Schlüsselfeldern des eigenen Freibauern, sonst ins
  Zentrum; Figuren bleiben dabei stehen), Opposition, Bauernrennen vor entferntem Freibauern
  (ab drei Linien vom gegnerischen König), Materialstand mit Tauschrat, passive Könige auf den
  beiden hintersten Reihen (nur ohne Damen) und Türme mit weniger als sieben Feldern, Freibauern
  mit Zügen bis zur Umwandlung.
- **Opposition:** Die Seite, die nicht am Zug ist, hat sie (Buch). Züge, die sie nehmen, in der
  Reihenfolge direkt, fern (näher zuerst), diagonal; Fernopposition mit fünf Feldern gilt als
  solche (Abb. 8.23 nennt nur Kf3, Kf1 steht dahinter).
- **Schlüsselfelder:** Tabelle des Buches wörtlich; Bauer auf der 7. Reihe ohne Felder (das Buch
  nennt keine). Gegnerische Freibauern in Rot als Präzisierung. „Erreichbar“ nur, wenn die
  Bauernseite am Zug ist.
- **Quadrat:** Startreihe eine Reihe weiter bei Zugrecht der Bauernseite und bei Doppelschritt
  (beides zusammen zwei Reihen); der König holt ein, wenn er im Quadrat oder direkt daneben
  steht. Vorbehalte des Schachtipps als Zeilen: Weg blockiert, eigener König hilft, weitere
  Figuren am Brett.
- **Elementarmatt:** Kasten als Fläche jenseits der Sperrfigur (Turm: nur, wo er die Könige
  trennt; Dame: Reihe und Linie zur Seite des Königs) ohne Felder des starken Königs; erreichbare
  Felder darin über unangegriffene Felder. Abwartezug: Fläche gleich, Figur außer Reichweite,
  kein Schach. Sperrzug: Fläche kleiner (Dame nur mit König in höchstens zwei Feldern Abstand).
  Treibezug: Schach, nach dem jede Antwort in kleinerer Fläche oder näher am Rand steht. Steht
  ein Matt bereit, nennt die Karte nur Matt und Pattfalle.

## 14.10.2026 – AP 10 Werkzeuge Kapitel 9 und 10 (Claude, Fable; Autor abwesend)

- **Drei Begriffe:** Angreifer ist die Seite mit dem vordersten Freibauern. Abschneiden: ein
  Turm auf einer Linie zwischen dem gegnerischen König und dem Bauern (Linien dazwischen
  gezählt, ab drei „reicht es oft“) oder auf einer Reihe zwischen diesem König und dem
  Umwandlungsfeld (Übung 9.50); bei Turm und Bauer gegen Turm nur der Turm des Angreifers, bei
  Turm gegen Bauer der Turm gegen den König der Bauernseite (Abb. 9.18). Schachdistanz: Linien
  zwischen dem verteidigenden Turm und dem Bauern, mindestens drei. Kurze und lange Seite nur,
  wenn beide einen Turm haben; Randbauern haben keine Seiten (Vancura).
- **Erkennungsbilder:** Reihenfolge der Tabelle. Lucena: Bauer auf der 7., angreifender König auf
  dem Umwandlungsfeld, gegnerischer König nicht vor dem Bauern (E, wenn auf der Linie
  abgeschnitten). Vancura: Randbauer ab der 6. Reihe mit dem angreifenden Turm davor (E, wenn der
  verteidigende Turm auf der Bauernreihe steht und der König auf g7/h7 bzw. a7/b7). Philidor:
  verteidigender König vor dem Bauern und angreifender König nicht vor dem Bauern (E, wenn der
  Turm die Reihe vor dem Bauern sperrt; ab der 6. Reihe, wenn er hinter dem Bauern steht). Sonst
  kurze Seite (E bei König kurz, Turm lang mit Schachdistanz). Turm gegen ein bis zwei Bauern,
  Mehrbauern-Turmendspiel (Turm hinter dem Freibauern), Dame gegen Bauer (Läufer- und Randbauer
  rot, Patt nach dem Schlag geprüft), Dame gegen Dame (nur die Frage), Turm gegen Läufer (Ecke
  nach Läuferfarbe), Läuferendspiele (gleich, ungleich, falscher Läufer mit König in der Ecke),
  Läufer gegen Springer (Flügel), Springer (Tempi).
- **Vier Prüfungen:** Prüfung 1 zählt die Züge des Gegners, wäre er am Zug (bis drei: Patt liegt
  nahe), und seine Schachs. Prüfung 2 spielt jede Umwandlung in Dame, Turm, Läufer, Springer
  und meldet Matt, Patt, Schach, sofort schlagbar. Prüfung 3 nennt freie Nachbarfelder,
  Pattreserve (Figuren, die ziehen könnten) und eigene Pattzüge. Prüfung 4 nennt die drei
  stillen Züge mit den wenigsten Antworten (Umwandlungen ausgenommen). Näherung, keine Engine.

## 14.10.2026 – AP 10 Werkzeuge Kapitel 11 und 12 (Claude, Fable; Autor abwesend)

- **Phase:** Endspiel bei mindestens drei Ja der vier Prüffragen aus Kapitel 8 (Damen vom
  Brett; Könige ohne Mattdrohung in einem Zug; sicherer Königsweg ins Zentrum; Freibauern,
  Mehrheiten oder höchstens 13 Punkte Figurenmaterial je Seite). Eröffnung, solange Entwicklung
  oder Königssicherheit der Zielbilanz „nein“ sind; „teils“ gilt als erfüllt (Abb. 12.1: „die
  meisten Leichtfiguren sind entwickelt … Das ist Mittelspiel“). Das Endspiel geht vor.
- **Werkzeug je Phase:** die Zeilen der Merkseite aus Kapitel 12; bei Beispielpartien aus
  Kapitel 11 die Zeile der Buchtabelle über den Abschnittsanker der Abbildung (neue freiwillige
  Eingabe `abschnitt`).
- **Erfassen:** Der letzte Zug kommt aus dem Verlauf der Abbildung; die Drohungen sind die des
  Profils (Materialgewinn, Matt in einem Zug). Warnsignale über das Werkzeug W1–W7 mit der
  Seite vor jeder Zeile.
- **Kandidaten:** je Art höchstens zwei, insgesamt vier, dazu der Buchzug als ruhiger Kandidat;
  stärkste Antwort einen Zug tief (Matt vor Schlag mit Gewinn vor Schach vor Drohung); Material
  danach aus eigener Sicht. Keine Engine; die Rechnung bis zur Ruhe bleibt beim Werkzeug Ruhe.
- **Sicherheitsblick:** gilt dem nächsten Buchzug oder dem eigenen Zug über Ziehen. Zusätzlich
  zu den drei Fragen des Buches warnt er vor einem Zug, der patt setzt (Kapitel 10, Prüfung 3),
  und meldet ein Matt. Ein schlagbarer Zug wird nicht als Fehler gewertet („Opfer oder
  Versehen?“, Abb. 12.1: „gerade der Plan“).

## AP 12 Speicher (15.10.2026, Opus)

- **Ein Eintrag statt vieler:** Die Nutzerdaten liegen als ein Objekt unter dem Schlüssel
  „aktuell“ in der IndexedDB „schach-von-grund-auf“. Sie sind klein; jedes Speichern schreibt
  einen vollständigen, stimmigen Stand, und Export und Import sind dasselbe Objekt.
- **Formate:** Format 0 sind die Merker von 0.2.0 bis 0.2.20 („einstellungen“, „lernstand“),
  Format 1 das neue Objekt. Die Teile aus Konzept 4.7, die es noch nicht gibt (Karten,
  Fehlerdatenbank, Lernsammlung, Partien, „Zug erraten“), kommen mit ihren Trainern als Format 2;
  leere Platzhalter ohne festen Aufbau hätten nur eine weitere Umwandlung erzwungen.
- **Unlesbares geht nicht verloren:** Daten aus einer neueren App oder beschädigte Daten werden
  unter „defekt-<Zeitpunkt>“ aufgehoben, bevor ein neuer Stand beginnt; der Leser sieht einen
  Hinweis.
- **Start ohne Warten:** Die App zeichnet sofort; bis die Daten geladen sind, gilt der Stand der
  alten Merker oder der Standard. Änderungen vor dem Laden warten auf den geladenen Stand.
- **Fehler sichtbar:** Ein Hinweis oben über jedem Bildschirm, bis der Leser ihn schließt; ein
  erfolgreiches Speichern nimmt den Hinweis „speichern“ zurück.
- **Merker bleiben** nur für „zuletzt“ (zuletzt geöffnete Abbildung) und „koordinaten“.
- **Fortschritt:** „angesehen“ zählt die geöffnete Abbildung und jede, die beim Nachspielen auf
  dem Brett steht. Übungen und Trainer haben Zähler (Versuche, gelöst; Durchgänge, Aufgaben,
  richtig), gefüllt ab AP 13; bis dahin zeigt die Kapitelübersicht einen Satz statt „0 von N“.
- **Anzeige:** goldener Balken wie auf der Installationsseite des Entwurfs; im Buch erst nach dem
  ersten Ansehen, damit die Liste für Neue ruhig bleibt.
- **Sicherungsdatei:** JSON mit Kennung, App-Version, Zeitpunkt und den Nutzerdaten. Beim
  Einspielen dieselbe Umwandlung wie beim Laden; die Rückfrage nennt Datum und Inhalt, weil das
  Einspielen alles ersetzt (kein Zusammenführen: einfacher und vorhersehbar).
- **Hinweis zur Sicherung:** nach 28 Tagen ohne Sicherung (ohne Sicherung ab dem ersten Start),
  nur wenn es eigene Daten gibt, nur im Bereich Ich.

## AP 14 Vorbereitete Texte (15.10.2026, Opus)

- **JSON statt YAML:** Das Konzept nennt `texte/kapNN.yaml`; wie bei den Lösungserklärungen (AP 6)
  liegen die Texte als JSON mit Schema in `inhalte/de/texte/vorbereitet-kapNN.json`. Ein Format
  für alle Texte, geprüft mit denselben Werkzeugen.
- **Fragen an der Abbildung:** Eine Warum-Frage gehört zu einer Abbildung und fragt nach dem
  nächsten Buchzug (`zug`, deutsch mit Zugnummer) oder nach der Stellung (ohne `zug`). Sie
  erscheint, solange die Stellung der Abbildung auf dem Brett steht. So passt sie zu „Erst selbst
  denken“: Der Leser überlegt, bevor er den Zug nachspielt.
- **Werkzeugkennungen aus der App:** Die Pipeline liest die bekannten Werkzeuge aus den
  Oberflächentexten (`werkzeug.<kennung>.name` in `de.json`); das Kapitel steckt in der Kennung.
- **Engine-Prüfung als Hinweis:** Ein erfragter Zug, der laut Engine mehr als 0,3 schlechter ist
  als der beste, ergibt einen Hinweis, keinen Fehler: Manche Fragen gelten gerade einem
  Fehlversuch des Buches.
- **Keine Texte an Übungsstellungen**, damit die Übungen nicht verraten werden.
- **Entwürfe in Testversionen:** Mit `--text-entwuerfe` kommen nur die Text-Entwürfe in die App,
  mit der Plakette „Entwurf“; die PGN-Entwürfe bleiben draußen.
- **Umfang der Entwürfe (15.10.2026):** etwa ein Drittel der Abbildungen je Kapitel, die
  lehrreichsten; zusammen 253. Fragen nach einem Fehlzug des Buches stehen meist ohne `zug`,
  damit die Engine-Prüfung nur dort anschlägt, wo eine Frage einen guten Zug unterstellt.
- **Weicht ein Werkzeug vom Buch ab, folgt der vorbereitete Text dem Buch;** die Abweichung steht
  als Befund in FORTSCHRITT. Eindeutige Textfehler der Werkzeuge werden sofort behoben, Regeln
  (Heuristiken) erst nach Entscheidung des Autors.

## AP 11 Spiel gegen die Engine (15.10.2026, Opus; Kalibrierung folgt mit Fable)

- **Aufteilung:** Opus baut den Handwerksteil (Partie, Uhr, Rücknahme, Speicher, Bildschirme,
  Auswertung als Gerüst, PGN). Stufen und Fehlerprofile liegen abgegrenzt in
  `engine/stufen.ts`, `engine/fehlerart.ts` und `engine/zugwahl.ts` und sind als Platzhalter
  markiert; Fable kalibriert sie und prüft den Rest gegen.
- **Stärke je Auftrag:** Jeder Auftrag an die Engine setzt die Stärke neu (Skill Level, Elo-
  Begrenzung oder voll). So bleiben die Werkzeuge immer bei voller Stärke, auch wenn vorher eine
  Partie lief.
- **Neuer Ordner `spiel/`:** Partie, Partieende, Uhr, PGN und die Umrechnung UCI ↔ SAN sind
  reine Funktionen ohne Oberfläche. Die Partie speichert SAN wie die Buchdaten und berechnet die
  Stellungen aus Startstellung und Zügen; so ist sie klein und lässt sich sicher speichern.
- **Uhr ohne eigenen Takt:** Die Uhr rechnet mit der übergebenen Zeit; die Oberfläche fragt sie
  ab und hält sie an, wenn die App in den Hintergrund geht. Vorgaben: ohne Uhr (Standard),
  30+20, 15+10, 5+3.
- **Rücknahme:** nimmt den letzten eigenen Zug samt Antwort der Engine zurück und hebt ein
  Partieende auf; die Zahl der Rücknahmen merkt sich die Partie für die Auswertung.
- **PGN in englischer Schreibweise,** damit jedes Programm sie lesen kann; absichtliche Fehler
  der Engine stehen als Kommentar hinter dem Zug.
- **Sicherheitsblick vor dem Zug (Bildschirmentwurf „Partie“):** Erlaubt ein Zug des Lesers ein
  Matt oder verliert er die gezogene Figur (Abtauschbilanz), fragt die App nach. Standard an,
  abschaltbar; die Prüfung nutzt k12-sicherheitsblick.
- **Hinweis im Spiel aus der Engine** (Wunsch des Autors): drei Stufen wie an den Abbildungen,
  die Engine rechnet erst beim ersten Tipp (1,5 s, volle Stärke). Die Werkzeuge des Kapitels
  (Pflichtenheft 5.2) bleiben eine offene Frage an den Autor (P1).
- **Auswertung:** Werte je Stellung aus Sicht von Weiß, auf ±10 begrenzt (Matt zählt wie 10),
  damit ein Wechsel von „Matt in 3“ zu „+8“ kein Patzer ist. Wert und bester Zug je Stellung
  liegen im Speicher, die Auswertung läuft je Partie nur einmal.
- **Bereich „Spielen“ statt „folgt“:** Der Platzhalter-Bildschirm „Folgt“ entfällt; alle fünf
  Bereiche der Leiste sind gebaut.

## Rückmeldung zu 0.2.26 (15.10.2026, Autor und Opus)

Grundlage: `docs/archiv/stand-0.2.30/VORSCHLAEGE_0.2.26.md` (Abschnitt „Entscheidungen des Autors“).

- **Perspektive:** Zugbezogene Werkzeuge rechnen für die Seite am Zug und nennen sie. Ein Schalter
  „Sicht“ in der Werkzeugkarte tauscht die Seite der Berechnung; nach jedem Zug und beim
  Abbildungswechsel gilt wieder die Seite am Zug. Gegenüberstellungen (Spalten, Zeilen, Waage)
  stehen immer Weiß links, Schwarz rechts, wie im Buch.
- **Keine Buchtexte in der App** außer den Bildunterschriften. Fallencheck, Planbilanz,
  Steckbriefe und Buchtabellen werden durch Verweise ersetzt, wo nötig mit eigener knapper
  Zusammenfassung. Die Buchdaten bleiben als Prüfmaßstab für Tests in den Daten.
- **Pflichtenheft 3 geändert:** Keine vorbereiteten Einschätzungen an den Abbildungen (sie nähmen
  das Buch vorweg). Die Warum-Fragen bleiben, freigeschaltet erst nach dem Ansehen der Abbildung,
  zugeklappt.
- **„Angesehen“** zählt erst nach 30 Sekunden am Stück auf dem Bildschirm; dazu Abhaken von Hand in
  der Kapitelübersicht.
- **„Vier Prüfungen“ (Kap. 10) entfällt** als Werkzeug: zu speziell für Studien. Die Patt-Prüfung
  steckt im Sicherheitsblick.
- **Ordnung der Werkzeuge** nach Buch und Denkroutine (Bündel, Symbole am Brett) folgt nach einem
  Bildschirmentwurf.

## Startseite des Buches vor der App (15.10.2026, Autor)

Änderung am Plan: Der Aufruf der Website führt nicht mehr sofort in die App. Die bisherige
Installationsseite wird zur **Startseite des Buches**.

- **Inhalt:** Cover, kurze Buchbeschreibung, Links zu den Shops (vorerst Platzhalter, je Sprache
  eigene Shops), darunter „App installieren“ (mit Anleitung je Gerät und Offline-Fortschritt) und
  „Im Browser verwenden“, unten Impressum, Datenschutz und Lizenzen.
- **Die installierte App** (display-mode standalone) startet direkt in der App.
- **Der QR-Code im Buch** führt direkt zum Installationsteil, ohne Shop-Links.
- **Eine Domain, keine Subdomain:** Startseite und App liegen unter derselben Adresse, damit
  Fortschritt und Offline-Daten (gebunden an die Domain) erhalten bleiben.
- **Statisches HTML** für die Startseite (Suchmaschinen, Vorschau beim Teilen mit Open Graph).
- **Später zwei Domains** (deutsch und englisch) am selben Cloudflare-Worker, die Startsprache
  richtet sich nach der Domain.

Umsetzung (Opus, 0.2.27):

| Adresse                        | Inhalt                                                          |
| ------------------------------ | --------------------------------------------------------------- |
| `/`                            | Startseite (statisch): Buch, Shops, Installationsteil, Fußzeile |
| `/installieren/`               | nur der Installationsteil, ohne Shops (Ziel des QR-Codes)       |
| `/app/`                        | die App (bisher unter `/`)                                      |
| `/impressum/`, `/datenschutz/` | statische Seiten (Entwürfe, Angaben des Autors folgen)          |

- Ein Service Worker für alle Seiten (Geltungsbereich `/`), damit die Startseite schon beim
  ersten Besuch alles für die Offline-Nutzung lädt. Manifest: `start_url` `/app/`, `id` bleibt
  `/`, damit bestehende Installationen dieselbe App bleiben.
- Startseite und Installationsseite leiten im Standalone-Modus sofort nach `/app/` weiter. So
  starten auch Installationen, die sich noch `/` als Startadresse gemerkt haben (iPhone, ältere
  Android-Installationen), direkt in der App.
- „Im Browser verwenden“ öffnet `/app/`. Die App selbst zeigt keine Installationsseite mehr; unter
  **Ich** führt ein Verweis zu `/installieren/`.
- Die Sprachwahl nach Domain kommt mit der englischen Fassung (AP 18): Dann liefert ein kleiner
  Worker je Domain die passende Startseite aus.

## Rückmeldung zu 0.2.27 (15.10.2026, Autor und Opus)

Der Autor hat die Nachtests bis N113 gemacht und die eigenen Kurzfassungen
(`docs/freigabe/kurzfassungen.md`) abgenommen. Impressum, Datenschutz, Buchbeschreibung und
Bezugsquellen erledigt er, wenn App und Website sonst fertig sind. Umgesetzt in 0.2.28:

- **Zweites Tippen auf ein Werkzeug** wählt es ab (zurück zu den Markierungen des Buches). Nur
  „Zählen“ und „Ziehen“, bei denen man mit dem Brett arbeitet, zeigen dabei weiter ihre Erklärung.
  Die Erklärung der übrigen steht in der Karte unter „So prüft die App“ (bei der Engine „So rechnet
  die Engine“); ein Kreuz im gewählten Knopf zeigt, dass ein Tipp abwählt.
- **Sicht bestimmt die Markierungen:** Faktorenbilanz und Zielbilanz markieren nur die Seite der
  Sicht (wie Planbilanz). Werkzeuge, bei denen die Sicht nichts ändert, haben keinen Schalter;
  dazu kommen Vorher und Erkennungsbild. Ein Test prüft beides an Buchabbildungen.
- **Sicht-Schalter** oben rechts in der Kopfzeile der Karte, zweizeilig („Sicht: Weiß“, darunter
  klein „am Zug“), damit er neben den Namen passt.
- **Prüffragen ohne Angebot:** Der Hinweis steht nur einmal (als Fazit).
- **Tipp auf den Hintergrund:** Es zählt jede Fläche außer Brett, Karten, Leisten, Knöpfen und
  Text, auch die Fläche neben der App auf breiten Bildschirmen.
- **„Alle abhaken“** fragt nach, wie „Alle zurücksetzen“.
- **Knochen-Symbol und Symbole am Brett** (Engine, Ziehen, Röntgen, Warnsignale am Brett,
  Skelett-Röntgen in die Leiste): gehört zum Werkzeug-Umbau und kommt mit dem Bildschirmentwurf.

## Rückmeldung zu 0.2.28 (15.10.2026, Autor und Opus)

Umgesetzt in 0.2.29:

- **Kein Werkzeug als Ausgangszustand,** auch nicht „Zählen“. Abwählen (zweites Tippen, Tipp auf
  den Hintergrund) führt dorthin zurück: Das Brett zeigt die Markierungen des Buches. Ein Tipp aufs
  Brett ohne Werkzeug wählt „Zählen“ und zählt das Feld (wie in Kapitel 1 geübt).
- **Mehr Markierungen in den Bilanzen,** weil nur noch eine Seite markiert wird
  (`analyse/bilanzmarkierungen.ts`): Zielbilanz mit entwickelten Leichtfiguren, haltbaren und
  angreifbaren Zentrumsbauern bzw. kontrollierten Zentrumsfeldern, König nach Wertung und
  Schildbauern; Faktorenbilanz mit Figuren im Spiel und zu Hause, König nach Wertung, angegriffenen
  Nachbarfeldern, Schwerfiguren auf Linien zum König, Drohungen (gold) und Angriffen (grau).
- **Tipp auf den Hintergrund:** Auf dem Handy füllen Brett (dessen Felder Knöpfe sind), Leisten und
  Karten fast die ganze Breite; frei war nur ein schmaler Rand. Jetzt zählt alles, was nicht bedient
  wird: Bildunterschrift, Fundstelle, die Zeile unter dem Brett, Kopfzeile, Abstände, Fläche neben
  der App. Ausgenommen: Bedienelemente, Brett, Werkzeug- und Zugleiste, Karten, Dialoge; markierter
  Text löst nichts aus.

## Rückmeldung zu 0.2.29 und Werkzeug-Umbau (15.10.2026, Autor und Opus)

Der Autor wünschte drei Dinge zugleich und prüft sie gemeinsam: Ohne Werkzeug bewirkt ein Tipp aufs
Feld nichts; die Legende der Markierungen steht klein in jeder Karte („So prüft die App“ lässt
keine Legende erwarten); dazu jetzt gleich der Werkzeug-Umbau (ohne vorherigen Bildschirmentwurf).
Umgesetzt in 0.2.30:

- **Ohne Werkzeug tut ein Tipp aufs Feld nichts.** Mit einem anderen Werkzeug als Zählen oder
  Ziehen schaltet der Tipp weiter auf „Zählen“ um (wie bisher).
- **Legende „Am Brett: …“** in jeder Karte zwischen Fazit und „So prüft die App“, ein Text je
  Werkzeug (`werkzeug.<id>.legende`, am Code geprüft). Nur „Eröffnung“ markiert nichts und hat
  keine. Ein Test verlangt für jedes andere Werkzeug eine Legende mit Farbangabe.
- **Symbole am Brett** (unten rechts neben „Brett drehen“): Ziehen, Engine, Röntgen ab Kapitel 1,
  Warnsignale ab Kapitel 4 (bis Kapitel 6 W1–W5, ab Kapitel 7 W1–W7, ein Symbol). Ohne König
  (Lehrbilder) keine Symbole, wie bisher kein Ziehen und keine Engine.
- **Bündel in der Leiste**, ein Knopf je Verfahren des Buches, Reihenfolge der Denkroutine:
  Zählen (immer), Denkroutine (11, 12), Eröffnung prüfen (1 bis 3), Angriffsregel (1),
  Skelett-Röntgen (5), Planfindung (6), Endspiel (8 bis 10), Taktik (7), Fallencheck (4). Die
  Kapitel je Bündel sind ausdrücklich festgelegt, nicht aus den Teilen abgeleitet: Die Planfindung
  enthält die Angriffsregel (Vorschlag C, „Wo?“), gehört aber zu Kapitel 6; Kapitel 10 zeigt das
  Endspiel; „Phase“ (Kapitel 11) ist Schritt 1 der Denkroutine.
- **„◀ frühere“ und „spätere ▶“** schalten die Bündel anderer Kapitel zu; spätere gestrichelt mit
  „Kap. N“. Im Bündel stehen die Teile als Reiter; Teile aus späteren Kapiteln nur mit
  „spätere ▶“ und der Plakette „Vorschau“. Ein Tipp aufs Bündel öffnet den Teil des Kapitels.
- **Zweites Tippen** auf Bündel oder Symbol wählt ab; Zählen und Ziehen erklären sich (wie 0.2.28).
- **Gestufte Karten (D6):** zuerst Stufe 1, darunter „Mehr …“; Fazit und Legende immer. Bei
  **Zählen** zeigt schon Stufe 1 Angreifer und Verteidiger: Zählen heißt beide gegenüberstellen,
  und das Fazit nennt ohnehin beide Zahlen.
- **Koordinaten** stehen unter „Ich“ (Merker wie bisher), die **Skelett-Ansicht** als Schalter
  „Skelett zeigen“ im Bündel Skelett-Röntgen; sie gilt nur, solange das Bündel gewählt ist. Beim
  Spielen gegen die Engine gibt es sie damit nicht mehr (dort am Brett nur Drehen und die ruhige
  Ansicht); falls gewünscht, kommt sie dort als eigener Schalter zurück.
- **Neue Namen,** damit „Kandidaten“ nicht doppelt vorkommt: Kapitel 7 „Erzwingende Züge“,
  Kapitel 12 „Kandidaten“ (Schritte 2 bis 4 der Denkroutine), Kapitel 9 „Turmendspiel“. Die
  Kennungen (`k7-erzwingend` usw.) bleiben, damit Texte und Tests passen.
- **Erklärungen** der Werkzeuge ohne Brettbedienung stehen weiter unter „So prüft die App“.

Noch nicht umgesetzt (Vorschläge angenommen, folgen): D4 „Gegner?“ ganz in der Karte mit dem
Vorbeugezug der Engine; D1 Leerfälle (die Bedingungen gehören zur Regelarbeit mit Fable).

## Rückmeldung zu 0.2.30 (15.10.2026, Autor und Opus)

Umgesetzt in 0.2.31:

- **Zählen am Brett:** „Zählen“ ist ein Symbol unter dem Brett (vor Ziehen), kein Knopf in der
  Leiste mehr; auch Lehrbilder ohne König haben es. Begründung des Autors: Es soll immer
  zugänglich sein und arbeitet mit dem Brett.
- **Erklärkacheln von Zählen und Ziehen:** Da anfangs nichts gewählt ist, erscheint die Kachel
  gleich beim Wählen und bleibt, solange das Werkzeug gewählt ist; „Nicht mehr anzeigen“ blendet
  sie dauerhaft aus (Merker auf dem Gerät), die Einstellungen holen sie zurück. Ein zweites
  Tippen wählt damit bei allen Werkzeugen ab.
- **Reihenfolge der Bündel:** nach ihrer Einführung im Buch (Eröffnung prüfen 1.2, Angriffsregel
  1.6, Fallencheck 4, Skelett-Röntgen 5, Planfindung 6, Taktik 7, Endspiel 8, Denkroutine 11).
  Zuschalten fügt nur hinzu; die Reihenfolge der gezeigten Knöpfe bleibt (Test für alle
  Kapitel). Bis 0.2.30 galt die Reihenfolge der Denkroutine.
- **Engine-Karte:** Wert und Worte sofort; „Beste Fortsetzung zeigen“ auf Wunsch, dann mit
  goldenem Pfeil für den ersten Zug; „Letzten Zug bewerten“ auf Wunsch. Das Zeichen steht am
  Zielfeld. Die Grenzen sind dieselben wie in der Auswertung nach der Partie (Konzept 8.3): „?!“ ab
  0,5, „?“ ab 1,2, „??“ ab 3 Bauerneinheiten Verlust gegenüber dem besten Zug. Neu dazu: „!“, wenn
  der gespielte Zug der beste ist und jeder andere mindestens 1,2 kostet. Farben am Brett: rot für
  ? und ??, grau für ?!, gold für !. Die Engine rechnet dafür die Stellung vor dem Zug nach der
  Bewertung der gezeigten (eine Engine, nacheinander).
- **Nachtmodus** in den Einstellungen: wie das Gerät (Standard), aus, an. Merker auf dem Gerät
  (Helligkeit hängt am Gerät, nicht am Lernstand), vor dem ersten Zeichnen gesetzt.
- **Zahnrad statt „Ich“** in der Leiste, ohne Beschriftung; die Seite hat keine sichtbare
  Überschrift (Bildschirmleser hören „Einstellungen“). Intern heißt der Bereich weiter „ich“.
- **Skelett-Schalter** (mit Knochen, „Skelett“) rechts neben dem letzten Reiter.
- **Erklärungen unter „So prüft die App“** ohne Farbangaben; die Farben stehen nur noch in der
  Legende „Am Brett:“.

**Taktik-Pfeile (Frage des Autors, noch nicht umgesetzt, AUFGABEN_AUTOR B1):** Laut Buch sind die
erzwingenden Züge (Kapitel 7, Schritt 2) genau die ersten drei Fragen der Schach-Röntgen-Regel
(Kapitel 1): „Erzwingend sind die Züge, nach denen auch die Schach-Röntgen-Regel zunächst fragt.“
Der Unterschied liegt im Zweck: Röntgen ist der kurze Rundumblick vor jedem Zug für beide Seiten,
einen Zug tief, mit Frage 4 (bester ruhiger Zug); die erzwingenden Züge sind die eigenen
Kandidaten einer Kombination, vollständig gesammelt, in der Reihenfolge Schachs, Schläge,
Drohungen, und jeder wird bis zur Ruhe gerechnet. Die App bildet das so ab (Röntgen: beide
Seiten, Gewinnschläge gold, Abtausch grau; Erzwingende Züge: nur eigene, nummeriert, auch
Schläge ohne Gewinn). Eigene Farben je Zugart würden den Farbcode des Buches brechen (alle
Diagramme nur gold, rot, grau; gold = eigene Möglichkeit). Vorschlag: Pfeile bleiben gold, dazu
ein Kürzel am Zielfeld („+“ Schach, „x“ Schlag, „D“ Drohung) neben der Nummer.

**Domain und E-Mail (15.10.2026, Autor):** `schach-von-grund-auf.com` bei Cloudflare registriert
und mit dem Worker verbunden; `kontakt@schach-von-grund-auf.com` eingerichtet (für Impressum,
Datenschutz und Kontakt, eingetragen mit den übrigen Impressumsangaben).

**Doku aufgeräumt (Wunsch des Autors):** Alle Dokumente bis 0.2.30 als Kopie in
`docs/archiv/stand-0.2.30/`. `docs/AUFGABEN_AUTOR.md` und `docs/TESTANLEITUNG.md` enthalten nur
noch Offenes; Wiedereinstieg, Vorschläge zu 0.2.26 und die Cloudflare-Anleitung liegen nur noch
im Archiv.

## Rückmeldung zu 0.2.31 (15.10.2026, Autor und Opus)

Umgesetzt in 0.2.32:

- **„Markierungen des Buchs“** unter dem Brett entfällt (Wunsch des Autors); dass die Pfeile aus
  dem Buch stammen, ist ohne Werkzeug selbstverständlich.
- **Engine, „Letzten Zug bewerten“:** War der gespielte Zug nicht der beste, zeigt ein goldener
  Pfeil den besten Zug (neben dem Zeichen am Zielfeld).
- **Kürzel an den Taktik-Pfeilen** (Vorschlag B1 zu 0.2.30): Die Pfeile bleiben gold, am Zielfeld
  steht neben der Nummer „+“ (Schach), „x“ (Schlag) oder „D“ (Drohung), etwa „2+“.
- **„Gegner?“ in einer Karte** (Vorschlag D4, angenommen): Der Engine-Teil steht in der
  Werkzeugkarte, mit Überschriften, die die Farbe nennen („Was Weiß vorhat (Engine)“, „Vorbeugen:
  der Zug für Schwarz (Engine)“). Neu ist der **Vorbeugezug**: Die Engine prüft die drei besten
  eigenen Züge und nimmt den ersten, nach dem der Gegner seinen Plan (den besten Zug im Nullzug)
  nicht mehr spielt (`engine/vorbeugezug.ts`); gold am Brett, der Plan rot. Findet sie keinen,
  sagt die Karte das und nennt den besten eigenen Zug.
- **Sicherheitsblick in der Partie entfernt** (P2: „ganz raus“): keine Rückfrage vor dem Zug, keine
  Einstellung mehr. Das Werkzeug „Sicherheitsblick“ der Denkroutine (Kapitel 11) bleibt.
- **Warum-Fragen freigegeben** (E1): alle 253 vorbereiteten Texte aller Kapitel, ohne
  „Entwurf“.
- **Hinweis zur Datensicherung** (Q4): nach je vier Stunden Nutzung (nur gezählt, solange die App
  sichtbar ist) ohne Sicherung ein Hinweis mit „Jetzt sichern“, „Später“ und „Nicht mehr
  nachfragen“ (`app/sicherungshinweis.ts`).
- **Abb. 2.128, Zielbilanz:** Das Buch hat recht (Lb2 kontrolliert e5 mit). Fehler der App: Sie
  zählte für Schwarz die Dame c7 hinter dem Läufer d6 als Batterie und kam so auf mehr
  Schwarze als Weiße. Die Zentrumsprüfung zählt jetzt nur direkte Angreifer, wie das Buch.
- **Plakette „exakt“ entfernt** (Frage des Autors): Sie zeigte nur, dass ein Befund sicher
  berechnet und nicht geschätzt ist; für den Leser ohne Nutzen. Die Einstufung bleibt intern.
- **Eröffnungen außerhalb des Buches** (Vorschlag G, Lizenz geprüft): freie Liste von Lichess
  (`lichess-org/chess-openings`, CC0, 3 864 Stellungen, offline in der App). Das Werkzeug
  „Eröffnung“ sagt bei Stellungen außerhalb des Buches „Nicht im Buch – bekannt als …“ (Familie
  deutsch, Variante englisch), nach dem Verlassen der bekannten Wege die letzte benannte Stellung.
  Buchstellungen gehen immer vor.
- **Zusammenführen gleicher Startstellungen** (Autor): nur innerhalb desselben Kapitels. Die zwei
  Paare k04-a45 → k04-a38 und k07-a21 → k07-a3 sind zusammengeführt; über Kapitelgrenzen bleibt
  alles getrennt.

Entschieden oder beantwortet, ohne Umsetzung in 0.2.32:

- **Q1** (Speicherform) passt so. **Q5:** eigene Züge beim Weiterspielen werden nicht gespeichert.
  **Q6:** Eine Übung zählt auch nach „Lösung anzeigen“ als gelöst (umsetzen in AP 13).
- **P1** (Werkzeuge in der Partie gegen die Engine): gewünscht, zuschaltbar Denkroutine, Taktik,
  Planfindung, Endspiel, Skelett-Röntgen, Eröffnung prüfen; als Vorstufe Warnsignale, Röntgen und
  Zählen als Symbole. Eigenes Arbeitspaket, Reihenfolge offen (AUFGABEN_AUTOR B2).
- **P3** (Spielziel) erklärt, Vorschlag Tablebase (AUFGABEN_AUTOR B3). **P4:** ja.
- **T1** passt, **T4** reicht.
- **Zugzeichen des Buches:** 4.5 und 4.43/4.44 bleiben, wie sie sind. Die Schwellen der
  Engine-Prüfung sind erklärt (AUFGABEN_AUTOR B5, Empfehlung: so lassen).
- **Zugfolgen aus dem Netz** (C7): Die Datenbanken von Lichess verlangen inzwischen eine
  Anmeldung; ohne Zugang bleiben die Abbildungen ohne Zugfolge. Zwei lassen sich aus einem anderen
  Kapitel des Buches anschließen (6.11, 11.68; Frage B4).
- **Erzwingende Züge und Röntgen** (Frage des Autors): Heute rechnet das Werkzeug jeden
  Kandidaten nur einen Zug tief; Vorschlag, jeden bis zur Ruhe zu rechnen (AUFGABEN_AUTOR B1).
- **Werkzeuge und Buchbefunde aus AP 8 bis 10:** ausführlich erklärt mit Empfehlungen in
  `docs/entscheidungshilfe/c1-werkzeuge.md` und `docs/entscheidungshilfe/c2-regeln-und-buchbefunde.md`
  (C1, C2, D.1 bis D.6).

## Rückmeldung zu 0.2.32 (16.10.2026, Autor und Opus)

Der Autor hat N147 bis N157 getestet und alle offenen Punkte aus `docs/AUFGABEN_AUTOR.md`
beantwortet. Umgesetzt in 0.2.33:

**Spielen und Einstellungen**

- **B3, Spielziel entfällt:** „Gegen die Engine spielen“ heißt nur, von dieser Stellung aus zu
  spielen; Ziel ist immer der Sieg. Die Auswahl „Spielziel“ und „Ziel erreicht/verfehlt“ sind weg
  (gespeicherte Partien mit altem Eintrag lesen sich weiter).
- **B2, Werkzeuge in der Partie, Vorstufe:** Zählen, Röntgen und W1–W7 als Symbole am Partie-Brett
  mit derselben Ergebniskarte wie an den Abbildungen. Röntgen und W1–W7 zeigen nur an; mit
  „Zählen“ zählt ein Tipp das Feld statt zu ziehen. In der ruhigen Ansicht ausgeblendet. Die
  Bündel folgen als nächster Schritt.
- **Plakette „vorbereitet“** an den Warum-Fragen entfernt (alle sind freigegeben; „Entwurf“ bleibt
  für Datenstände mit Entwürfen).
- **„Erst selbst denken“** war ein Platzhalter (wirkt erst mit den Trainern, AP 13) und ist bis
  dahin ausgeblendet; der gespeicherte Wert bleibt.
- **Figurensatz „kontrastreich“** (Figuren von Colin M. L. Burnett, GPLv2+, wie bei Lichess) und
  **Ton** (Klacken bei Zug, kräftiger bei Schlag; im Browser erzeugt, ohne Tondateien) sind
  wählbar.

**Zugfolgen**

- **B4:** Abb. 6.11 bekommt den Vorlauf aus Karpow–Unzicker (Kapitel 11), Abb. 11.68 den aus der
  London-Zugfolge (Kapitel 5); beide lassen sich jetzt von der Grundstellung an nachspielen.
- **B5:** Die Schwellen der Zugzeichen-Prüfung bleiben, wie sie sind.

**Regeln der Werkzeuge (C1, C2, D)** – Einzelheiten in den Abschnitten unten.

**Abrechnung GitHub Actions (16.10.2026, nachts):** Die 2000 freien Minuten des privaten
Repositorys waren verbraucht, weil jeder Push auf jeden Zweig einen Lauf von etwa 12 Minuten
startete und jeder Stand auf drei Zweige ging. Der Autor möchte keine Kosten: Die Prüfungen laufen
bis zur Veröffentlichung nur noch von Hand; Plan zum Aufräumen und Umschalten auf „öffentlich“ in
`docs/VEROEFFENTLICHUNG.md` (Besprechung am 16.10.2026).

### Regeln der Werkzeuge: Antworten des Autors zu C1, C2 und D (16.10.2026)

Grundlage: `docs/entscheidungshilfe/c1-werkzeuge.md` und `c2-regeln-und-buchbefunde.md`. Der
Autor hat bei fast allen Punkten „Empfehlung umsetzen“ gesagt. Wo eine geeichte App-Regel vom
Pflichtenheft 6.6 abweicht und bestätigt ist (C2.1 (a), C2.2, C2.5, C2.6), gilt sie **anstelle**
des Pflichtenhefts (das Pflichtenheft selbst bleibt als Claude-Doc unverändert).

**Kapitel 2 und 3 (Zielbilanz, Faktorenbilanz, Todsünden, Phase)**

- C1.1/C1.2: Ein Zentrumsbauer zählt voll; ist er nach Zählung schlagbar, heißt er nur
  „angegriffen“ (grau). Die Engine rechnet asynchron nach (2 s je Bauer, Material am ruhigen Ende
  der Hauptvariante, höchstens 10 Halbzüge nach dem Schlag; ab +1 Bauer „hängt wirklich“).
  2.40, 2.113 und 2.24 jetzt „ja“ wie im Buch, 2.30 bleibt „teils“ (Engine: d5 hängt).
- C1.3, C1.4: so gelassen (C1.3 als Lernanlass, Wunsch des Autors).
- C1.5: Grund „rochiert, aber ohne f-Bauern vor dem König“; Turm oder Dame nur, wenn zwischen
  ihnen und dem König kein Bauer steht, dann „offene“ oder „halboffene Linie“.
- C1.6: Matt oder Patt: nur „Die Partie ist entschieden“; im Schach steht „Erst das Schach und
  die Taktik zu Ende rechnen …“ vorn, die Königssicherheit dieser Seite ist höchstens „teils“.
- C1.27/C2.18/C2.20: Die Phase gilt für beide Seiten gleich. Eröffnung, solange eine Seite noch
  mindestens zwei Leichtfiguren auf dem Startfeld hat; ein rochierter König auf der zweiten Reihe
  (h7, g2 …) zählt als „rochiert, Schild beschädigt“ = teils. 11.28 bis 11.31, 11.41, 11.82,
  11.84, 12.2, 12.3: Mittelspiel.
- C2.3: Regeln bestätigt; die Karte heißt „Mögliche Todsünden“ und sagt oben, dass es nur
  Kandidaten sind (etwa ist das frühe Herausholen der Dame manchmal sinnvoll).
- C2.1 (a), C2.2: geeichte Regeln bestätigt.

**Kapitel 4 (Warnsignale, Prüffragen)**

- C1.7 (mit D.1): W4 auch für den einzigen Verteidiger gegen ein Matt (4.29: Springer f3, h2).
- C1.8: W2 auch mit König oder Dame vorn und einer ungedeckten eigenen Figur dahinter (4.8).
- C2.9: Übung 7.53, die Dame d8 hält c7 und e8 (Rückschlag-Probe); das Motiv heißt jetzt
  „Überlastung“. Der Grund war ein anderer als in der Entscheidungshilfe vermutet (der Springer
  c7 deckte e8 mit).
- D.4: W5 nennt scheinbar gedeckte Figuren („nur von der gefesselten Figur f6 gedeckt“, 4.13).
- C2.4: Schwellen bestätigt. D.3 hat der Autor im Buch geändert (Fassung im privaten Repository
  noch nicht hochgeladen). D.2, D.5, D.6: ignorieren (Autor).

**Kapitel 5 und 6 (Skelett-Röntgen, Planfindung)**

- C1.9/C1.14: Fazit der Richtung: Kette, dann gesunde eigene Mehrheit mit Kandidat, dann
  gegnerische Schwäche, Minderheitsangriff nur gegen eine gesunde Mehrheit, nicht vor dem eigenen
  König (dort „Gegenspiel mit Figuren“), nicht mit einem einzelnen Bauern. „Minderheitsangriff“
  als Fazit: vorher 64, jetzt 13 von 187 Abbildungen.
- C1.10: Der Hebel gegen die Basis allein gold, die übrigen grau unter „Weitere Hebel“.
- C1.11: Ein Läufer vor der eigenen Kette heißt „schlecht nach der Farbe, aber aktiv“ (5.40).
- C1.12: „Luftloch h3: der König hat Luft auf h2“; Haken nur, wenn ein gegnerischer Bauer ihn
  mit einem Hebel erreicht.
- C1.13: Gegenschlag nur ein Feld weit oder als bestehende Spannung („Der Gegenschlag ist schon
  da: d5 greift e4 an“). Abweichung von der Empfehlung: Bei Hebeln zählt die App weiter auf dem
  Zielfeld, weil das Buch in 6.3 und 6.5 so zählt.
- C1.15: Verdoppelte Türme auf offener Linie: „Dringe mit Turm d2 nach d7 ein“ (6.17).
- C1.16: Im Schach oder bei angegriffener Dame sagen die Planwerkzeuge nur „Erst das Schach (die
  Drohung) beantworten“.
- C2.5 (dazu: auch „halboffen“ als Begriff), C2.6, C2.7, C2.8, C2.10, C2.11: bestätigt.

**Kapitel 7 (Taktik)**

- B1: Erzwingende Züge rechnet die ersten sechs Kandidaten mit der Engine bis zur Ruhe, mit
  Ergebnis je Kandidat; der stärkste trägt „!“ am Brett, Kandidaten ohne Gewinn werden grau.
- C1.17: „Relative Fesselung durchbrochen“ als Zusatz; Boden-Matt nur, wenn die beiden Läufer
  allein mattsetzen (7.21 heißt jetzt „Zwischenzug, Matt“).
- C1.18: Im Schach nennt Motiv die Schachfolge, die zur Abbildung geführt hat (7.28
  Dauerschach). 7.10: Die Zugfolge beginnt jetzt eine Stellung früher mit 1. Sf7+ (eindeutig
  erschlossen: nur von e5 gibt Sf7 Abzugsschach des Turms e1) – zur Kenntnis des Autors.
  Zusatzregel: Dauerschach nur, wenn die schachgebende Seite mindestens eine Leichtfigur zurückliegt
  (Motiv 12, „Wer klar verliert …“); sonst hießen die Schachs im Turmendspiel 9.6 Dauerschach.
- C2.12 mit der Ergänzung des Autors: Gabel(geometrie) nur, wenn sie Material gewinnt; ungedeckte
  Bauern zählen als Ziel, gedeckte nicht. Umgesetzt so, dass jedes genannte Ziel für sich
  gewinnbar ist (König, wertvoller als der Gabler, oder ungedeckt) – sonst hieße König plus
  gedeckter Läufer auch Gabel.

**Kapitel 8 und 9 (Endspiel)**

- C1.19/C2.14: Exakte Endspieldatenbank König und Bauer gegen König in der App (beim ersten
  Gebrauch berechnet, geprüft gegen die Syzygy-Tafeln: keine Abweichung). Die Opposition nennt nur
  Züge, die das Ergebnis halten; sonst „Hier entscheidet nicht die Opposition, sondern …“
  (Patt 8.31, Quadrat 8.36, Reserve-Tempo 8.53). Mit mehr Bauern eine Regel (Bauernverlust,
  Reserve-Tempo), keine Rechnung.
- C1.20: „Weiß gewinnt mit e7 (Sonderfall 6. Reihe)“ (8.29).
- C1.21–C1.23: Quadrat mit verbundenen Freibauern, Bauern hinter eigenem Bauern, dem kommenden
  Freibauern (8.46: a6) und dem begleitenden König.
- C1.24: Philidor-Plan statt Schachdistanz, solange der verteidigende König vor dem Bauern steht.
- C1.25: Turmbegriffe nur mit einem Bauern, sonst Verweis auf das Erkennungsbild.
- C1.26: Ungleichfarbige Läufer: getrennte Freibauern (3 Linien Abstand) „meist gewonnen“.
- C2.13, C2.15, C2.16, C2.17, C2.19: bestätigt bzw. hingenommen.

**Kapitel 12 (Kandidaten, Sicherheitsblick)**

- C1.28: Ein Kandidat, auf den Matt folgt, scheidet aus (12.4: „Auf b5: Dxf7# (Matt) – scheidet
  aus: Matt“). Zusätzlich (sonst wäre Dd1+ mit −9 der beste gewesen): Droht der Gegner Matt in
  einem Zug, kommt ein Zug dazu, der das Matt abwehrt (Schritt 2 des Buches: „Verteidigung einer
  Drohung“); in 12.4 ist das 5... Sf6 wie in der Opernpartie. Ein Kandidat, der selbst
  mattsetzt, gilt als der beste.
- C1.29: Im Schach sind alle Abwehrzüge die Kandidaten, je mit der stärksten Antwort (12.3: auf
  f5 folgt Sxe6 mit Gabel gegen Dame und Turm). Der Sicherheitsblick sagt bei Frage 1 „König im
  Freien“, wenn der König die Grundreihe verlassen hat, höchstens ein Bauer vor ihm steht, der
  Gegner mindestens zwei freie Nachbarfelder angreift und noch eine Dame hat. Grenze: Die
  Bewertung bleibt einen Zug tief; in 12.3 ist Kxg5 nach Material am besten (mit dem Hinweis
  „der König steht danach im Freien“), das Buch widerlegt es erst mit 4. f4+.

## Vormerkung: Kästen „Training zu diesem Kapitel“ auf Website und App (15.10.2026, Autor)

Der Autor plant, die Inhalte der 13 Kästen „Training zu diesem Kapitel“ (Kapitel 0 bis 12) aus dem
Buch auf die Website und in die App zu verlagern. Im Buch steht dann im Kasten nur ein Link auf den
Trainingskasten der Website und ein Hinweis, wo er in der App zu finden ist. Grund: Die Kästen
verweisen auf Webinhalte, die sich ändern; so lässt sich alles aktualisieren, ohne neu zu drucken.

**Umsetzen, sobald wir in der App „Training“ anfassen, vollständig samt Website** (Wunsch des
Autors). Vorschlag dazu:

- Feste Adressen, die sich nie ändern, etwa `schach-von-grund-auf.com/training/kap07/` (statische
  Seite wie die Startseite); im Buch je Kapitel kurzer Link und QR-Code.
- Website und App aus einer Quelle (eine Datei je Kapitel); in der App im Bereich **Training** beim
  Kapitel. Änderungen erreichen Website und App mit dem nächsten Update.
- Eigene Lizenzangabe für die Textdateien, getrennt vom GPL-Code, bevor sie ins Repository kommen.
- Kastentexte und Links müssen vor dem Druck feststehen, also mit AP 16 (Buchverweise) abstimmen.

**Umgesetzt (16.10.2026, Wunsch des Autors):** Website-Seiten `/training/kapNN/` und
`/training/werkzeugkasten/` aus `inhalte/de/training/` (eine Datei je Kapitel). Entscheidungen
dabei:

- Die Seiten zeigen den Kastentext unverändert; Kapitel-, Abschnitts- und Tabellennummern bleiben
  die des Buches (der Einleitungssatz der Seite sagt das). Ausnahmen: „auf Seite …“ wird „im Buch“,
  „Tabelle 12.x“ (Werkzeugkasten) wird ein Link auf die Seite Werkzeugkasten, Quellen (`\cite`)
  werden Links.
- Die Texte stehen unter „Alle Rechte vorbehalten“ wie die übrigen Buchinhalte (`docs/LIZENZEN.md`),
  getrennt vom GPL-Code.
- Website und App aus einer Quelle: Die App verlinkt die Seiten (offline über die PWA) statt sie
  ein zweites Mal darzustellen.
- Im Buch: QR-Code und gedruckter Link mit Schrägstrich am Ende (genau die Adresse, die die Seite
  hat), der QR-Code schwarz statt in der Linkfarbe Gold (sonst schlecht lesbar). Der Abschnitt
  „Dein Werkzeugkasten“ bleibt im Buch (es soll ohne Internet vollständig sein) und bekommt nur
  einen Hinweis auf den aktuellen Stand im Netz. Vorschlag: `docs/freigabe/trainingsverweise.tex`.

## AP 11 Kalibrierung der Stufen und Fehlerprofile (16.10.2026, Fable)

Grundlage: Konzept 8.2 (Stufen, Fehlerarten, „Fehler bleiben plausibel … Ein grundloses
Damenopfer gibt es ab Stufe 2 nicht“, Abnahme „Jede Stufe gewinnt die Mehrheit gegen die Stufe
darunter. Die Fehlerquote je Stufe liegt im Sollbereich“), Übergabe von Opus in
`docs/FORTSCHRITT.md` (AP 11). Zweig `ap11-kalibrierung`, Version 0.2.36.

- **Wie Stockfish 19 sich begrenzt (gemessen):** Mit „Skill Level“ rechnet die Engine die ganze
  Zeit mit vier Varianten, wählt den Zug aber an der Suchtiefe Level + 1 gewichtet zufällig unter
  den vier besten (bis etwa einen Bauern schlechter). Die Stärke hängt also von der Tiefe ab, nicht
  vom Gerät: ein langsames Handy spielt auf Stufe 4 bis 7 genauso stark wie dieser Rechner. Die
  Elo-Begrenzung („UCI_Elo“, 1320 bis 3190) rechnet Stockfish selbst in ein Skill Level um
  (1600 Elo ≈ Level 2, 2000 Elo ≈ Level 4). Die Startwerte hätten Stufe 6 („Elo 1600“) schwächer
  gemacht als Stufe 5 („Skill 8“) und sogar als Stufe 4 („Skill 3“).
- **Stufen (`engine/stufen.ts`):** Jede Stufe hat eine Grundstärke, eine Fehlerquote und einen
  Höchstverlust. Stufe 1 bis 3: Skill Level 0 (die „flache Suche“ aus Konzept 8.2, Tiefe 1) mit
  den Fehlerquoten des Konzepts (jeder dritte, vierte, achte Zug) und Höchstverlust Dame, Turm,
  Leichtfigur. Stufe 4: Skill Level 3 und „selten ein typischer Fehler“ (jeder sechzehnte Zug,
  höchstens eine Leichtfigur). Stufe 5 bis 7: Skill Level 6, 10 und 15 ohne Fehlerprofile.
  Stufe 8: volle Stärke, 2 Sekunden. Die Elo-Begrenzung bleibt im Engine-Dienst verfügbar, wird
  aber von keiner Stufe genutzt. Rechenzeiten 0,3 bis 2 Sekunden wie bisher; auf Stufe 1 bis 4
  braucht ein Fehlerzug bis zu drei Aufträge (Kandidaten, gezielte Prüfung, normaler Zug).
- **Fehlerarten (`engine/fehlerart.ts`), alle sechs aus Konzept 8.2 mit den Werkzeugen des
  Buches:** Figur hängen lassen = nach dem Zug ist eine eigene Figur ab Leichtfigur laut
  Abtauschrechnung (Kapitel 1) verloren (Gewinn des Gegners mindestens 2, also mehr als ein
  Bauer), vorher nicht; Schlagreflex und Köder = ein Schlag mit negativer Abtauschbilanz oder
  laut Engine mindestens einem Bauern Verlust (5... Sxd5?! im Zweispringerspiel gilt als Köder);
  verfrühte Dame und König in der Mitte wie bisher (Regeln aus `schach/todsuenden.ts`);
  **Taktik übersehen** = nach dem Zug hat der Gegner eine neue Gabel (W6 Gabelgeometrie,
  `schach/gabeln.ts`), eine neue gefährliche Linie gegen die ziehende Seite (W2,
  `analyse/k4-warnsignale.ts`), oder seine Antwort laut Engine ist ein Motiv aus Kapitel 7
  (Gabel, Doppelangriff, Fesselung, Spieß, Abzug, Doppelschach; `schach/taktikmotive.ts`);
  **Drohung ignorieren** = vor dem Zug drohte der Gegner Matt oder Materialgewinn ab einem Bauern
  (Röntgen-Frage „Was droht mein Gegner?“, `schach/drohungen.ts`), und derselbe Schlag oder ein
  Matt in einem Zug geht nach dem Zug noch. Reihenfolge bei mehreren Treffern: Mattdrohung oder
  Drohung ab Leichtfigur, Schlagreflex, Figur hängen, kleinere Drohung, Taktik, Dame, König.
- **Fehlersuche (`engine/fehlersuche.ts`), breiter als MultiPV 8:** Die Engine rechnet mit
  voller Stärke acht Kandidaten (für den besten Wert); dazu prüfen die Werkzeuge alle legalen
  Züge und liefern typische Fehlerzüge je Art; bis zu sechs davon (reihum je Art, konkrete Arten
  zuerst) bewertet die Engine gezielt mit „searchmoves“ (neu im Engine-Dienst). Gewählt wird
  zufällig unter den Zügen mit Verlust zwischen 0,5 (Mindestverlust, unverändert) und dem
  Höchstverlust der Stufe, Züge mit erkannter Art bevorzugt. **Damenopfer:** Ab Stufe 2 fällt
  jeder Zug weg, nach dem der Gegner laut Abtauschrechnung auf dem Feld einer eigenen Dame
  mindestens Dame gegen Leichtfigur gewinnt, unabhängig davon, was die Engine dem Zug an Verlust
  zuschreibt (Tests mit einer Engine, die den Verlust unterschätzt). Nur Stufe 1 darf die Dame
  verschenken (Höchstverlust 9). Die Buchtreue 0,85 bleibt auf allen Stufen (Rückfrage K3).
- **Messung (`npm run messen:stufen`):** `skripte/messe-stufen.mjs` startet je Paarung einen
  Lauf von `src/engine/stufen.messung.ts` (eigene Vitest-Einstellung, nicht in der Prüfkette):
  Partien Stufe gegen Stufe mit der echten Engine und der Zugwahl der App, Farben wechselnd,
  Eröffnungen aus Kapitel 2 und 3 (zwei Halbzüge), höchstens 240 Halbzüge. Ergebnisse liegen nur
  lokal in `buch/arbeit/stufenmessung/`. Ergebnis vom 16.10.2026 (10 Partien je Paarung):

  | Paarung a-b | Punkte b : a | Fehlerquote a / b | Höchster Verlust a / b | Halbzüge | Dauer je Partie |
  | ----------- | ------------ | ----------------- | ---------------------- | -------- | --------------- |
  | 1-2         | 9 : 1        | 36 % / 29 %       | 8,6 / 5,0              | 73       | 33 s            |
  | 2-3         | 9 : 1        | 30 % / 12 %       | 5,0 / 3,0              | 74       | 40 s            |
  | 3-4         | 9 : 1        | 13 % / 7 %        | 3,0 / 3,0              | 68       | 39 s            |
  | 4-5         | 10 : 0       | 6 % / 0 %         | 3,0 / 0                | 85       | 58 s            |
  | 5-6         | 7 : 3        | 0 % / 0 %         | 0 / 0                  | 111      | 93 s            |
  | 6-7         | 8 : 2        | 0 % / 0 %         | 0 / 0                  | 123      | 147 s           |
  | 7-8         | 9 : 1        | 0 % / 0 %         | 0 / 0                  | 110      | 185 s           |

  Jede Stufe gewinnt die Mehrheit gegen die Stufe darunter (Abnahme aus Konzept 8.2). Die
  Fehlerquoten sind die gemessenen Anteile absichtlicher Fehlerzüge; der höchste Verlust hält
  die Grenzen (Dame 9, Turm 5, Leichtfigur 3) ein. Zwei Läufe: Mit den Würfen 1/3, 1/4, 1/8, 1/16
  trafen nur 30 %, 18 %, 10 %, 5 % der Züge (die Fehlersuche findet nicht in jeder Stellung einen
  Zug in den Grenzen); die Paarungen 1-2 bis 4-5 wurden mit angehobenen Würfen (0,36, 0,33, 0,15,
  0,075) nachgemessen, 5-6 bis 7-8 stammen aus dem ersten Lauf (dort ohne Fehlerprofile, also
  unverändert). Endgültige Würfe: 0,34, 0,30, 0,15, 0,075 (Stufe 1 und 2 leicht gesenkt, erwartet
  etwa 34 % und 26 %). Häufigste Fehlerarten auf Stufe 1 und 2: Drohung ignoriert, Taktik
  übersehen, Figur hängen lassen, Schlagreflex; „ungenau“ nur noch etwa jeder zehnte Fehlerzug.
  Die Dauer je Partie gilt für diesen Rechner (ein Kern); auf Stufe 1 bis 7 hängt die Stärke
  nicht von der Rechenzeit ab.

- **Gegenprüfung** (`spiel/`, `speicher/partien.ts`, `ui/komponenten/usePartie.ts`,
  `spiel/auswertung.ts`), drei Befunde behoben: (1) Zog die Engine, während die App im
  Hintergrund war, startete ihr Zug die Uhr des Lesers, obwohl die Pause sie gerade angehalten
  hatte; jetzt bleibt die Uhr nach dem Zug stehen und läuft bei der Rückkehr weiter. (2) Eine beim
  Speichern laufende Uhr hätte nach dem Neuladen die ganze Abwesenheit abgezogen; jetzt steht sie
  nach dem Laden mit der gespeicherten Restzeit. (3) Ein Werkzeug, das die Engine unterbrach,
  ließ die Auswertung dauerhaft bei „läuft“ stehen; jetzt bewertet sie dieselbe Stellung noch
  einmal. Geprüft und so belassen: Rücknahme während die Engine rechnet (ihr Zug fällt weg, weil
  die Stellung nicht mehr passt), Zeitüberschreitung während die Engine rechnet (ihr Zug kommt zu
  spät und wird abgelehnt), Grenzen der Auswertung (±10, Matt = 10, Zeichen ab 0,5 / 1,2 / 3),
  Partieende (Matt, Patt, Material, 50 Züge, Wiederholung, Zeit mit Remis bei zu wenig Material),
  Speicher (beschädigte Züge kürzen die Partie, fremde Stufen fallen weg).

## AP 13 Teil 1 und 2: Übungen und erste Trainer (Nacht zum 17.10.2026, Opus, Version 0.2.37)

Der Autor hat die Arbeit über Nacht freigegeben („Los“). Rückfragen dazu stehen in
`docs/AUFGABEN_AUTOR.md`, Teil U.

- **Aufräumen (A1 bis A3, D2):** Budget, Aufräumen und Veröffentlichen sind mit dem Umzug nach
  `dobili/SvGa_Public` erledigt (16.10.2026); die Prüfungen laufen wieder bei jedem Push. D2
  (Buchverweise, AP 16) erledigt am 16.10.2026.
- **Q6 umgesetzt, wie entschieden:** Eine Übung zählt auch nach „Lösung zeigen“ als gelöst. Die
  Wiederholungskarte geht dann zurück in Kasten 1 (morgen wieder fällig).
- **Wiederholung (Konzept 9.1):** fünf Kästen mit 1, 3, 7, 16 und 35 Tagen. Ohne Fehler und
  ohne Hinweis gelöst: ein Kasten weiter; mit Fehlversuch oder Hinweis: Kasten bleibt; „Lösung
  zeigen“ oder „nicht gelöst“: Kasten 1. Speicherformat 3 ergänzt die Karten; ältere Formate
  werden ohne Verlust übernommen.
- **Übungen ohne Buchtext:** Die App zeigt nicht die Aufgabe des Buches, sondern verweist auf die
  Abbildung (Entscheidung „keine Buchtexte in der App außer den Bildunterschriften“). Die
  freigegebene Erklärung (`inhalte/de/texte/`) erscheint nach dem Lösen oder „Lösung zeigen“.
- **Zugaufgaben und Denkaufgaben:** 63 Übungen haben eine Zugfolge ab ihrem Diagramm; der Leser
  zieht seine Züge, die App antwortet mit der Gegenseite aus der Lösung. „akzeptiert“ zählt als
  gleichwertig. Die übrigen 23 sind Denkaufgaben mit Selbsteinschätzung.
- **„Erst selbst denken“** wirkt jetzt bei den Übungen und steht wieder in den Einstellungen:
  locker nach „Ich habe nachgedacht“, streng nach dem ersten eigenen Zug (bei Denkaufgaben auch
  streng nach „Ich habe nachgedacht“, weil es keinen Zug gibt).
- **Erste Trainer** ohne neue Daten: Zähltrainer (Bilanz zählen, hängende Figuren),
  Schach-Röntgen-Trainer (drei Schritte mit Pfeilen), „Koordinaten, Notation, Gangarten“ (Feld
  finden, Zug aufschreiben, Zug ausführen, Gangarten). Aufgaben aus den Diagrammen des Buches;
  nur die Sonderzüge (Rochade, en passant, Umwandlung) haben sieben eigene kurze Stellungen.
  Rechnung wie in den Werkzeugen „Zählen“ und „Röntgen“, damit Trainer und Werkzeug nie
  verschieden urteilen. Jede Runde zählt als Durchgang im Fortschritt.
- **Warten auf Fable:** Taktiktrainer, Strukturerkenner und „Falle oder Köder“ brauchen die
  Trainerdaten aus dem Zweig `trainerdaten` (noch in Arbeit).
- **H Rückblick nach der Partie (0.2.38):** Zeichen am Zielfeld (?! grau, ? und ?? rot), goldener
  Pfeil für den besseren Zug, wenn der gespielte ein Zeichen hat und nicht selbst der beste war;
  Bewertungsbalken links am Brett nur beim Nachspielen nach der Partie und nicht in der ruhigen
  Ansicht; Verlaufskurve über der Auswertung (±5, Matt am Rand, Fehler „?“ und „??“ als Punkte).
  „!“ fehlt noch (Rückfrage U10).

## Rückmeldung zu 0.2.38 (Nacht zum 17.10.2026, Fable, Version 0.2.39)

Grundlage: Rückmeldung des Autors zum Nachtest bis N174 (Spielen, Auswertung, Stufen, Figuren,
Abbildungsnummer, Werkzeugtexte). Zweig `rueckmeldung-0.2.39`. Opus arbeitet parallel an AP 13;
Dateien unter `app/src/training/`, `Uebung*`, `Trainer*` sind unberührt.

- **Werkzeugtexte ohne „+9“:** Ein Materialgewinn aus der Abtauschrechnung sah aus wie eine
  Engine-Bewertung. Die Werkzeuge nennen jetzt die Figur (`analyse/texte.ts`, `schlagtext`):
  „gewinnt den Läufer“ (Bilanz mindestens der Faustwert der geschlagenen Figur), „schlägt die
  Dame mit Gewinn“ (Teilgewinn, etwa Dame gegen Läufer), „nur Abtausch“, „verliert Material“.
  Betroffen: Röntgen, Warnsignale W5, Gegnerplan, Erzwingende Züge, Ruhe, Erfassen, Falle,
  Prüffragen, Sicherheitsblick. Zahlen bleiben, wo das Buch selbst zählt: Zählen (Abtauschbilanz),
  Faktorenbilanz (Material), Kandidatenzeile („Material bis zur Ruhe: +5“, jetzt mit dem Wort
  „Material“ davor, damit es nicht wie die Engine-Zahl daneben aussieht).
- **Figurensätze:** „kontrastreich“ heißt „klassisch“ (gespeicherte Stände werden beim Lesen
  übernommen, `speicher/format.ts`); dritter Satz „Holz“ = dieselben Figuren von Colin Burnett in
  Elfenbein und Dunkelbraun (fast schwarz) mit dunklem Rand, durch Umfärben der SVG-Dateien
  erzeugt (Lizenz unverändert GPL). Vorbild ist das Bild des Autors (chess.com, Design „Dunkles
  Holz“); die Figurenformen von chess.com sind nicht frei, deshalb nur die Farben (R1).
- **Nummernsprung:** Der Titel „Abb. 7.12“ ist ein Knopf; ein Tipp öffnet unter der Kopfzeile
  dasselbe Nummernfeld wie auf dem Buch-Bildschirm (`ui/komponenten/Nummernsprung.tsx`, Logik aus
  `daten/finde.ts`). Die gefundene Nummer ersetzt die Ansicht im Stapel (wie das Blättern), damit
  „Zurück“ weiter zum Kapitel führt.
- **Rückblick-Karte (Nachspielen wie bei chess.com):** Beim Nachspielen einer ausgewerteten
  Partie steht unter dem Brett eine Karte zum gezeigten Zug: Urteil („war der beste Zug“, „war
  der einzige gute Zug“, „ist in Ordnung (0,3 hinter …)“, „kostet etwa 1,8 Bauern“), die
  Bewertung davor und danach, der bessere Zug (goldener Pfeil wie bisher) und bei einem Zug mit
  Zeichen die **Erklärung** nach den Regeln des Buches. Die Erklärung nutzt dieselben Regeln, mit
  denen die Engine ihre absichtlichen Fehler einordnet (`engine/fehlerart.ts`, jetzt mit
  Einzelheiten: `fehlerbefundIn` liefert die Drohung, das Feld der hängenden Figur, die Gabel,
  die gefährliche Linie oder das Motiv der Antwort), damit Fehlersuche und Rückblick nie
  verschieden urteilen. Texte und Markierungen in `spiel/erklaerung.ts`: Drohung (roter Pfeil,
  rotes Zielfeld), hängende Figur (rotes Feld „W1“), Gabel (Pfeil und rote Zielfelder), Linie
  (Pfeil), Motiv der Antwort und Schlagreflex (Pfeil der Antwort), verfrühte Dame und König in
  der Mitte (nur Text). Gerechnet wird nur für die gezeigte Stellung, ohne Engine, erst beim
  Nachspielen („nur auf Anfrage“). Als Antwort der Engine dient der gespeicherte beste Zug der
  Folgestellung. Die Eröffnungsregeln stehen in `engine/fehlerart-eroeffnung.ts`, die
  UCI-Schreibweise in `engine/engineZuege.ts` (Dateigrenze 400 Zeilen).
- **„!“ (U10):** Die Auswertung bewertet jede Stellung mit zwei Varianten und speichert den
  Abstand des besten zum zweitbesten Zug (`Partieeintrag.abstaende`). „!“ bekommt ein Zug, der
  der beste war und mindestens 1,2 Bauern (Fehlergrenze) vor dem zweitbesten lag, dieselbe Regel
  wie in der Engine-Karte (`engine/letzterzug.ts`). Ältere Auswertungen ohne Abstände bleiben
  gültig, nur ohne „!“ (keine Neuauswertung, Speicherformat unverändert).
- **Spielstärke (`spiel/genauigkeit.ts`, Karte in der Auswertung):** Genauigkeit nach der
  offenen Rechnung von Lichess: Bewertung → Gewinnwahrscheinlichkeit (50 + 50 · (2 / (1 +
  e^(−0,00368208 · Centibauern)) − 1)), Genauigkeit eines Zuges 103,1668 · e^(−0,04354 ·
  verlorene Prozentpunkte) − 3,1669, Partie = Mittel über die eigenen Züge (Lichess gewichtet
  zusätzlich nach Spannung; hier das einfache Mittel, nachvollziehbar). Spielstärke = Tabelle aus
  dem durchschnittlichen Verlust je Zug (0,1 → 2600, 0,3 → 2000, 0,5 → 1650, 1,0 → 1100, 2,5 →
  500, dazwischen linear, auf 50 gerundet), erst ab zehn eigenen Zügen; ausdrücklich eine grobe
  Schätzung und so beschriftet (R3). Die Engine bekommt dieselbe Bewertung; auf niedrigen Stufen
  macht sie absichtlich Fehler und landet entsprechend tief, was dem Leser die Stufen einordnet.
  Dazu je Seite: Verlust je Zug, beste Züge, Zeichen („! 1 · ?! 2 · ? 1 · ?? 0“).
- **Eröffnung für die Engine (N178):** Die Engine folgte schon immer den Buchvarianten (Buchtreue
  0,85), aber zufällig unter allen; der Leser konnte keine wählen. Jetzt gibt es aus der
  Grundstellung die Karte „Eröffnung“ (Liste der Eröffnungen aus Kapitel 2 und 3, Vorschau der
  Hauptvariante). Mit Vorgabe spielt die Engine nur Buchzüge, die in dieser Eröffnung bleiben
  (`schach/eroeffnungsindex.ts`, `buchzuegeZu`), mit Buchtreue 1; verlässt der Leser die
  Eröffnung, gelten wieder alle Buchzüge mit 0,85, danach die Engine selbst. Gespeichert in der
  Partieeinstellung (`eroeffnung`), angezeigt im Untertitel. Aus Abbildungen und eigenen
  Stellungen gibt es die Karte nicht (dort ist die Eröffnung schon vorbei).
- **Stufen: warum „dämlich und dann genial“, und wie andere es machen.** Die Stufen 1 bis 3
  nutzen Stockfishs „Skill Level 0“ plus Fehlerwürfe (AP 11). Skill Level 0 wählt den Zug an
  Suchtiefe 1 gewichtet zufällig unter den vier besten Varianten einer _vollen_ Suche: Alles,
  was eine Tiefe von einem Zug sieht (jeder sofortige Schlag, jedes Matt in einem, jede Gabel,
  die schon da ist), spielt die Engine fehlerfrei; alles Tiefere ist ihr egal. Die Fehlerwürfe
  treffen zufällige Züge unabhängig von der Lage. Daraus entsteht genau der Eindruck des Autors:
  Die Engine verschenkt in einem ruhigen Moment eine Figur (Fehlerwurf) und findet zwei Züge
  später eine Kombination, weil sie in erzwungenen Stellungen trotzdem die Hauptvariante der
  vollen Suche spielt. Ein Mensch auf 1000 Elo ist umgekehrt: gleichmäßig blind für Taktik ab
  zwei Zügen Tiefe, selten grundlos verschenkend. **chess.com** baut seine Bots auf Komodo
  (Dragon) mit „Persönlichkeiten“: je Bot eine Elo-Grenze, die die Suche begrenzt, dazu
  Rauschen auf der Bewertung und Vorlieben (Angriff, Material, Bauernstruktur); die Fehler
  kommen aus der verrauschten Bewertung, nicht aus getrennten Würfen, und sind deshalb
  gleichmäßig. **Lichess** bietet Stockfish-Stufen (Skill Level mit Tiefen- und Zeitgrenze, also
  dieselbe Art wie hier) und seit 2023 die **Maia**-Netze (University of Toronto), die aus
  Millionen Menschenpartien je Spielstärkeklasse (1100 bis 1900) gelernt haben, welchen Zug ein
  Mensch dieser Stärke _wahrscheinlich_ spielt, Fehler eingeschlossen; das ist der menschlichste
  Gegner, aber ein Netz von einigen Megabyte, das im Browser eine eigene Laufzeit bräuchte.
  **Fünf Wege für die App** (alle offline, mit der vorhandenen Engine):
  1. _Gewichtete Zugwahl mit Temperatur statt Skill Level:_ MultiPV 6 bis 8 bei voller Suche,
     Zugwahl nach e^(Wert/Temperatur) mit Temperatur je Stufe (etwa 1,5 Bauern auf Stufe 1, 0,2
     auf Stufe 6). Schwäche gleichmäßig, Fehler meist klein, große Fehler nur mit kleiner
     Wahrscheinlichkeit; kein „Genie“, weil auch in erzwungenen Lagen gewürfelt wird (dort ist
     der Abstand groß, also bleibt der beste Zug sehr wahrscheinlich: menschlich).
  2. _Tiefengrenze je Stufe_ („go depth 2 … 8“ statt Zeit) zusätzlich zu 1: Taktik jenseits der
     Grenze sieht die Engine gar nicht, so wie ein Mensch einen Horizont hat. Geräteunabhängig.
  3. _Fehlerneigung nach Lage und Strähnen:_ Fehlerwurf nicht gleichverteilt, sondern höher in
     ruhigen Stellungen mit vielen Kandidaten, niedriger im Schach oder bei einem einzigen guten
     Zug; nach einem Fehler für drei Züge erhöht („Tilt“), dazu eine „Tagesform“ je Partie
     (Fehlerquote ±30 %). So entstehen Phasen, wie Menschen sie haben.
  4. _Menschliche Blindstellen:_ Auf Stufe 1 bis 3 Kandidaten der Engine vorab filtern wie ein
     Anfänger: Rückwärtszüge und lange Diagonalen seltener, Schläge und Schachs bevorzugt
     (Schlagreflex), Springergabeln des Gegners „nicht gesehen“. Die Fehlerarten aus
     `engine/fehlerart.ts` liefern die Prüfungen dafür schon.
  5. _Stärken-Schwächen-Profile_ („Angreifer“, „Materialist“, „Verteidiger“, „Endspielkünstler“)
     als Zuschlag auf die Bewertung der Kandidaten (Angreifer: +0,3 für Züge gegen den König,
     −0,3 für Rückzüge; Materialist: Schläge +0,4, Opfer nie): kleine Verschiebungen, die über eine
     Partie einen Charakter ergeben; auswählbar oder je Stufe fest.
     Empfehlung: 1 bis 3 zusammen als eigenes Arbeitspaket mit der Messung aus AP 11
     (`npm run messen:stufen`: jede Stufe gewinnt weiter die Mehrheit gegen die darunter); 4 und 5
     danach. Heute Nacht nicht umgesetzt, weil AP 11 die Stufen gerade erst kalibriert hat und der
     Autor die Richtung entscheiden soll (R4).
- **Zusammenführung (17.10.2026 früh, Freigabe des Autors im Chat):** `main` stand noch auf
  0.2.38 (keine weiteren Pushes von Opus), der Zweig `rueckmeldung-0.2.39` baut darauf auf. Der
  fertige Zweig `trainerdaten` (Prüfung grün) ist mit hineingeführt, die Lizenz der Lichess-Daten
  in `docs/LIZENZEN.md` eingetragen; beides zusammen als 0.2.39 nach `main`. AP-13-Dateien von
  Opus sind unberührt. Die Anleitungen (`TESTANLEITUNG`, `AUFGABEN_AUTOR`, `FORTSCHRITT`) sind auf
  0.2.39 abgeglichen: alle Nachtest-Nummern gelten für die aktuelle Version, die Rückfragen
  stehen in der Reihenfolge B, R, U, T, C, K, D, E.

## Spielen: Ideen des Autors vom 17.10.2026 (Fable, Version 0.2.40)

Grundlage: Nachricht des Autors vom 17.10.2026 (Auswertung, Spielstärke je Phase, Zugklassen wie
bei chess.com, Stufe je Phase, typische Fehler je Niveau, Partienliste, Eröffnung „frei“).
Zweig `rueckmeldung-0.2.39`, nach grüner Prüfung nach `main`.

- **Zugklassen wie bei chess.com** (`spiel/auswertung.ts`, `klasseVon`): chess.com ordnet jeden
  Zug nach verlorenen „erwarteten Punkten“ ein (Best 0, Excellent bis 0,02, Good bis 0,05,
  Inaccuracy bis 0,10, Mistake bis 0,20, Blunder darüber; dazu Great = kritischer Zug, Brilliant
  = gutes Figurenopfer, das nicht in eine schlechte und nicht aus einer schon gewonnenen Stellung
  kommt, Miss = Fehler des Gegners nicht genutzt, Book = Theoriezug; Quelle: Hilfeseiten von
  chess.com, „How are moves classified“). Die App behält ihre Grenzen in Bauerneinheiten (0,5 /
  1,2 / 3) und ergänzt: **brillant** = bester Zug, der laut Abtauschrechnung mindestens eine
  Leichtfigur hergibt (`opferwert`), und die Stellung war vorher nicht schon klar gewonnen
  (unter +4); **stark** = der einzige gute Zug (bester, zweitbester mindestens 1,2 dahinter) oder
  der beste Zug direkt nach einem Fehler des Gegners (ab „?“); **bester**; **sehr gut** (unter
  0,2 hinter dem besten); **gut** (unter 0,5); **Buch** = ein Zug aus den Eröffnungen des Buches
  (Eröffnungsindex Kapitel 2 und 3), solange er kein Fehler ist; **ungenau**, **Fehler**,
  **verpasst** (nach einem Fehler des Gegners mindestens 0,5 verloren, statt ungenau/Fehler),
  **Patzer**. Marken am Brett (`spiel/rueckblick.ts`): „!!“ blau, „!“ gold, „✓“ grün für den
  besten Zug, „?!“ grau, „?“ und „??“ rot; dafür zwei neue Markierungsfarben Grün und Blau nur
  für den Rückblick (keine Buchfarben). Die Rückblick-Karte hat je Klasse einen Satz, die
  Spielstärke zählt je Klasse. Zeichen in Zugliste und PGN: „!!“, „!“, „?!“, „?“, „??“.
- **Phasen** (`spiel/phasen.ts`): die Regel des Werkzeugs „Welche Phase, welches Werkzeug?“
  (Kapitel 11, `schach/phase.ts`), je Stellung, nie rückwärts. Verlaufskurve: senkrechte goldene
  Linien mit „M“ und „E“ am ersten Zug des Mittelspiels und des Endspiels. Spielstärke-Karte:
  je Phase Genauigkeit und Schätzung (ab sechs Zügen je Phase), beide Seiten.
- **Auswertung im Hintergrund** (`ui/komponenten/useAuswertung.ts`): Während der Partie rechnet
  die Engine die noch nicht bewerteten Stellungen, wenn der Leser am Zug ist und die Engine frei
  ist (`EngineDienst.beschaeftigt`), 0,5 s je Stellung mit zwei Varianten; Ergebnisse liegen je
  Partie in einem Zwischenspeicher je Stellung mit ihrer FEN. Nach einer Rücknahme passen die
  Einträge jenseits der Rücknahme nicht mehr zur FEN und werden neu gerechnet; gleiche Stellungen
  werden wiederverwendet. Hinweise, Werkzeuge und der Zug der Engine haben Vorrang: Sie
  unterbrechen die Hintergrundrechnung, die danach die Stellung wiederholt. Am Ende fehlen meist
  nur die letzten Stellungen; dann wird gespeichert wie bisher. Während der Partie zeigt die App
  nichts davon. Wird die App mitten in der Partie geschlossen, geht nur der Zwischenspeicher
  verloren (die Partie bleibt), nach dem Öffnen rechnet sie weiter.
- **Stufe je Phase** (`Partieeinstellung.stufenJePhase`, Regler in `ui/komponenten/StufenWahl.tsx`):
  drei gerasterte Regler (1 bis 8) für Eröffnung, Mittelspiel, Endspiel; „Stufe“ der Partie
  bleibt die des Mittelspiels (Anzeige, PGN, Vorlieben). Vor jedem Zug der Engine bestimmt die
  App die Phase der Stellung und geht von der Stufe des vorigen Engine-Zuges um höchstens eine
  Stufe auf die Zielstufe zu (`engine/stufen.ts`, `naechsteStufe`; die Stufe steht am Engine-Zug
  im Protokoll). Beispiel des Autors: Eröffnung 1, Mittelspiel 4 → im Mittelspiel 2, 3, 4. Ältere
  gespeicherte Partien und Vorlieben bekommen überall ihre Stufe.
- **Eröffnung „frei“** heißt ohne Buch (Frage des Autors): Die Engine spielt die Eröffnung selbst.
  „eine Eröffnung des Buches (zufällig)“ ist das bisherige Verhalten (Buchtreue 0,85), eine
  bestimmte Eröffnung wie in 0.2.39 (Buchtreue 1). Vorgabe beim Öffnen: frei.
- **Partienliste:** je Partie der König in der gespielten Farbe (gewählter Figurensatz) und
  „du: etwa 1400“ (oder „du: 78 % genau“ bei weniger als zehn Zügen), sobald die Auswertung
  gespeichert ist.
- **Auswertung:** „Hast du es gesehen?“ bei den Fehlern der Engine entfällt (Wunsch des Autors).
- **Typische Fehler von Menschen je Niveau und Phase** (Recherche am 17.10.2026; Quellen:
  thechessworld.com „Most Common Chess Mistakes by Rating (800–2000)“, Lichess-Blogs „3 mistakes
  keeping you stuck at 400“ und „7 most common chess mistakes“, chess.com-Blog „Most common
  beginner chess mistakes“, US Chess Academy „Addressing common mistakes“, rarepike.com „10
  common chess mistakes“; dazu die Fehlerarten aus Konzept 8.2 und die Todsünden aus Kapitel 1):
  - _Einsteiger (bis etwa 1000, Stufe 1 und 2):_ Figuren hängen lassen und Drohungen nicht
    sehen (mit Abstand das häufigste), Dame zu früh herausziehen, nicht rochieren, Bauernraub mit
    der Dame (b2/b7, g2/g7), Schlagreflex (jeden Schlag annehmen), Springer an den Rand, dieselbe
    Figur mehrfach ziehen, im Endspiel den König nicht einsetzen, Patt setzen in gewonnener
    Stellung, Bauernrennen falsch zählen.
  - _Anfänger (1000 bis 1400, Stufe 3 und 4):_ Taktik über zwei bis drei Züge übersehen (Gabel,
    Fesselung, Abzug), Bauern vor dem rochierten König ohne Not ziehen, ohne Plan entwickeln,
    im Rückstand abtauschen, Bauernstruktur unterschätzen (Isolani, Doppelbauern durch eigene
    Züge), Figuren passiv lassen, Zeitnot, im Endspiel Bauern vorschnell vorschieben, Turm nicht
    hinter den Freibauern.
  - _Fortgeschrittene (1400 bis 2000, Stufe 5 bis 7):_ falscher Plan, Prophylaxe vergessen,
    Läuferpaar hergeben, Schwächen im eigenen Lager schaffen, Endspieltechnik (Opposition,
    Schlüsselfelder, aktive Türme), Zeitnotfehler. Diese Fehler lassen sich mit den Regeln der
    App schwer erkennen; die Stufen 5 bis 7 bleiben deshalb ohne Fehlerprofile (Skill Level).
    Umgesetzt als sieben neue Fehlerarten (`engine/fehlerart-phasen.ts`, mit den Regeln des Buches):
    Tempoverlust (Eröffnung: entwickelte Figur zieht noch einmal, zwei Leichtfiguren zu Hause, nicht
    angegriffen), Bauernraub (Dame schlägt einen Bauern mit Verlust oder einen Köder auf b/g),
    Königsschild (Bauer vor dem rochierten König zieht ohne Not), falscher Abtausch (gleicher
    Abtausch ab Leichtfigur bei mindestens zwei Bauerneinheiten Rückstand), passiver König
    (Endspiel: bester Zug ist ein Königszug, gespielt wird ein anderer), Bauernvorstoß (Endspiel:
    Bauernzug mit Verlust), Patt gesetzt (in gewonnener Stellung). Dazu ein **Fehlerprofil je Phase
    und Stufe** (`engine/fehlerprofil.ts`): Gewichte je Fehlerart; Einsteiger (Stufe 1 und 2) grobe
    Fehler, Anfänger (Stufe 3 und 4) kleinere; die Fehlersuche prüft Arten mit hohem Gewicht zuerst
    und wählt unter den gefundenen Fehlerzügen gewichtet. Die Fehlerquoten je Stufe (AP 11)
    bleiben; die Messung `npm run messen:stufen` prüft weiter, dass jede Stufe die darunter schlägt.
- **Noch nicht umgesetzt, Vorschläge des Autors für später:** eine Abhakliste der Fehlerarten
  in erweiterten Einstellungen (wenn die Profile stehen), vorgefertigte Gegner („Bots“) mit Namen,
  Stärke je Phase (Streuung höchstens 2 um das Mittelspiel), Durchschnittswertung und Sortierung
  nach den Stufennamen; beides passt auf die jetzige Struktur (`stufenJePhase`, Fehlerprofil).

## Phase: Lesart des Übergangs ins Mittelspiel und ins Endspiel (17.10.2026, Autor und Fable, Version 0.2.44)

Entscheidung des Autors: S16 (Lesart „Bauern entscheiden“) umsetzen, dazu eine Regel für den
Übergang ins Mittelspiel ohne Zugzahl („Anfänger lassen gern eine Figur zu Hause oder sichern
nie ihren König; das kann nicht ewig Eröffnung bleiben“). Der Autor wählte aus drei Ideen
(eine Seite entwickelt; Figurenmaterial ungleich; erster Figurentausch nach Suetin) die ersten
beiden; die dritte wäre in der Berliner Verteidigung zu früh (6. Lxc6).

- **Mittelspiel** (`schach/phase.ts`, `mittelspielOderEroeffnung`), sobald eine Seite entwickelt
  ist (höchstens eine Leichtfigur zu Hause; der Rückstand des Gegners ist ein Mittelspielthema,
  Gambitkapitel) oder das Figurenmaterial ohne Bauern um mindestens eine Leichtfigur (3 Punkte)
  ungleich ist. **Eröffnung** nur, solange beide Seiten zwei oder mehr Leichtfiguren zu Hause
  haben und das Material gleich ist. Die Rochade spielt für die Phase weiter keine Rolle (C1.27).
  Lesart der Buchregel „Mittelspiel, sobald die Ziele erfüllt sind“, keine Zusatzregel.
- **„Bauern entscheiden“** (vierte Endspielfrage) ist ja bei einem Freibauern oder bei wenig
  Figurenmaterial (höchstens 13 Punkte je Seite ohne Bauern); eine bloße Bauernmehrheit reicht
  nicht mehr. Damit ist die Berliner Verteidigung nach 8. Dxd8+ Kxd8 ein Mittelspiel (vorher
  Endspiel), wie es Bücker und Smith beschreiben („damenloses Mittelspiel“).
- **Grund im Befund** (`Phasenbefund.grund`, `entwickelt`): zuHause, beideEntwickelt,
  eineEntwickelt (mit Farbe), materialUngleich, fragen, wenigMaterial. `analyse/phasentext.ts`
  macht daraus den Satz, den das Werkzeug „Phase“ (erste Zeile) und die Rückblick-Karte teilen.
- **Erklärung am Phasenwechsel** (Wunsch des Autors; `useRueckblick.tsx`, `phasenwechselText`;
  `Rueckblickkarte.tsx`): Beginnt mit der Stellung nach dem gezeigten Zug eine neue Phase (nach
  `phasenJeStellung`, nie rückwärts), steht in der Karte „Neue Phase ab hier. …“ mit dem Satz
  zur Phase und, falls die Speelman-Regel griff, dem Satz zur Zusatzregel.
- **Fehlerarten** (`engine/fehlerart-phasen.ts`): Tempoverlust und Bauernraub waren an die Phase
  „Eröffnung“ gebunden; da die Phase jetzt Mittelspiel sein kann, obwohl die ziehende Seite noch
  in der Entwicklung steckt, zählen sie nun, solange die ziehende Seite mindestens zwei
  Leichtfiguren zu Hause hat (und kein Endspiel ist). Beispiel: 8… Dxb2 im vergifteten Bauern
  bleibt Bauernraub.
- **Befund an den Autor (S17):** Abb. 11.4 (Opernpartie, nach 9… b5) wird Mittelspiel (Weiß
  entwickelt, Schwarz mit Sb8 und Lf8 zu Hause); 11.1 bis 11.3 bleiben Eröffnung, alle anderen
  Referenzabbildungen unverändert. Referenztest angepasst, Entscheidung offen.

## Phase und Zugliste: Nachricht des Autors vom 17.10.2026 abends (Fable, Version 0.2.43)

- **Zusatzregel „ab Zug 15 Mittelspiel“ gestrichen** (Entscheidung des Autors: Der Wechsel folgt
  der Stellung, nicht der Zugnummer). Es bleibt die Zusatzregel nach Speelman (höchstens 13
  Punkte je Seite außer dem König → Endspiel); `Zusatzregel` ist nur noch `"wenigMaterial"`.
- **„M“ und „E“ in der Zugliste** (`ui/komponenten/Partiezuege.tsx`, `phasenmarken`): vor dem
  ersten Zug des Mittelspiels und des Endspiels ein goldenes Kästchen, an denselben Stellen wie
  die Linien der Kurve (`spiel/phasen.ts`, `phasenwechsel`); auch während der Partie, weil die
  Phase ohnehin die Stufe der Engine steuert und nichts von der Auswertung verrät.
- **Beobachtung des Autors: Partien springen von der Eröffnung direkt ins Endspiel.** Ursache
  geprüft (Probe am Code): `phase()` prüft die vier Endspielfragen vor der Entwicklung. Nach
  einem frühen Damentausch sind „Damen vom Brett“ und „Könige sicher“ ja, und „Bauern
  entscheiden“ ist ja, sobald eine Bauernmehrheit oder ein Freibauer existiert, unabhängig vom
  Figurenmaterial. Die Berliner Verteidigung nach 8. Dxd8+ Kxd8 ergibt in Zug 9 „Endspiel“ (3
  Ja) mit Lc8 und Lf8 zu Hause und 19 Punkten Figuren je Seite. Literatur: Bücker (New In Chess,
  Berlin-Repertoire) und Smith (chess.com, „Endgame or Middlegame?“) nennen solche Stellungen
  „damenloses Mittelspiel“; Smiths Faustregel: Endspiel erst, wenn so viel getauscht ist, dass
  die Bauernstruktur entscheidet. Vorschlag an den Autor (S16): „Bauern entscheiden“ bei
  Mehrheit nur ja, wenn jede Seite höchstens 13 Punkte Figuren (ohne Bauern) hat oder ein
  Freibauer steht. Nicht gebaut, bis der Autor entscheidet.

## Spielen: Ergänzungen des Autors vom 17.10.2026 abends (Fable, Version 0.2.42)

Grundlage: vier Nachrichten des Autors während der Arbeit an 0.2.41 (Wertung nur aus der
Grundstellung, Wertung zurücksetzen, Frage nach der höchsten Stufe, eigene Gegner mit Stil,
Kurve je Phase). Zweig `rueckmeldung-0.2.39`, nach grüner Prüfung nach `main`.

- **Wertung nur aus der Grundstellung** (`spiel/wertung.ts`, `ausGrundstellung`; Spielen.tsx,
  `wertbar`): Partien aus Abbildungen, aufgebauten oder per FEN eingegebenen Stellungen und
  Partien zu zweit zählen nie; der Haken verschwindet dort zugunsten eines Satzes, und die
  Wertung prüft die Startstellung noch einmal selbst (die ersten vier FEN-Felder).
- **Wertung zurücksetzen** (`speicher/partien.ts`, `setzeWertungZurueck`; Knopf mit Nachfrage in
  `Wertungskurve.tsx`): leert den Verlauf und setzt `gewertet` aller gespeicherten Partien
  (auch der laufenden) dauerhaft auf falsch, damit eine später fertig werdende Auswertung sie
  nicht wieder einrechnet. Die Partien selbst bleiben.
- **Frage des Autors: Wie stark ist Stufe 8?** Stufe 8 ist Stockfish 19 (kleine NNUE-Fassung für
  den Browser) mit voller Stärke und 2 Sekunden je Zug in einem Thread. Auf einem Handy erreicht
  das Suchtiefen um 15 bis 20; gegen Menschen entspricht das deutlich über 3000 Elo; die
  Begrenzung liegt nicht in der Engine, sondern nur in Rechenzeit und Gerät. Stufe 7 (Skill
  Level 15) liegt nach der Skala von Stockfish bei etwa 2600 bis 2700, Stufe 6 (Level 10) bei
  etwa 2300, Stufe 5 (Level 6) bei etwa 1900, Stufe 4 (Level 3, selten ein Fehler) bei etwa
  1700; die Skala stammt aus Engine-gegen-Engine-Partien und überzeichnet gegenüber Menschen
  eher. Die Spielstärke-Schätzung der App (Tabelle in `spiel/genauigkeit.ts`) reicht bis 2900
  (0 Verlust je Zug); die Wertung nach Elo ist nach oben offen. Wunsch des Autors (bis 2500,
  gern 3000) ist damit erfüllt; eine Messung gegen Menschen gibt es nicht.
- **Eigene Gegner** (`engine/gegner.ts` `EigenerGegner`, `speicher/gegner.ts`,
  `ui/komponenten/GegnerEditor.tsx`): Name (bis 24 Zeichen), Stufen je Phase, erlaubte
  Fehlerarten (Haken je Art; wirken in Stufe 1 bis 4; leer: nie ein absichtlicher Fehler) und
  Stil −2 bis 2. Höchstens 20, im Spielstand (`eigeneGegner`), anlegen, bearbeiten, löschen mit
  Nachfrage; im Auswahlfeld eine eigene Gruppe. Die Partie merkt sich `botName`, `fehlerarten`
  und `stil` (`Partieeinstellung`, wahlfrei, damit ältere Partien unverändert bleiben), so bleibt
  der Name nach dem Löschen. Die Zugwahl (`engine/zugwahl.ts`, `Gegnerprofil`) reicht die
  Fehlerarten an die Fehlersuche (Filter auf `art`) und entfällt ganz ohne erlaubte Arten.
- **Spielstil** (`engine/stil.ts`, Vorschlag des Autors): bei Stil ungleich 0 holt die Engine
  vier Kandidaten mit der Stärke der Stufe; unter denen bis 0,15 Bauerneinheiten je Reglerstufe
  hinter dem besten gewinnt der höchste Stilwert. Aggressiv: Zielfeld in der gegnerischen Hälfte
  (1), im Viertel des gegnerischen Königs (1), Schlag (0,5), Schach (0,5). Defensiv: eigene
  Hälfte (1), Viertel des eigenen Königs (1), kein Schlag (0,5). Bewusst sanft, damit die Stufe
  ihre Stärke behält (Rückfrage S13 mit der Alternative 0,3).
- **Kurve je Phase** (`Wertungspunkt.phasen`, `Wertungskurve.tsx` Ansicht): Jeder Wertungspunkt
  speichert die Schätzung der Engine für den Leser je Phase dieser Partie (`spielstaerkeJePhase`,
  ab sechs Zügen je Phase, sonst null). Die Ansicht „Wertung“ zeigt die Elo-Kurve, „Eröffnung“,
  „Mittelspiel“, „Endspiel“ die Schätzungen je Partie mit dem Durchschnitt im Ausschnitt als
  Zahl. Eine Elo-Wertung je Phase gibt es nicht (Sieg und Niederlage gehören zur ganzen Partie).
- **Umwandlungsfrage** liegt in `ui/komponenten/Umwandlung.tsx` (geteilt von Brettbereich und
  Stellungseditor).

## Spielen: Antworten und Wünsche des Autors vom 17.10.2026 nachmittags (Fable, Version 0.2.41)

Grundlage: Nachricht des Autors mit den Antworten zu S1, S2, S4, S5, S6 und neuen Wünschen
(Spielhilfen zuschaltbar, Bots jetzt, Mensch gegen Mensch, Partienkachel, Wertung nach Elo,
Stellungen aufbauen). Zweig `rueckmeldung-0.2.39`, nach grüner Prüfung nach `main`.

- **S1 Zugklassen:** bleiben wie in 0.2.40 (Entscheidung des Autors).
- **S2 Phase, Zusatzregeln** (`schach/phase.ts`, `mitZusatzregeln`; Recherche am 17.10.2026,
  Quellen: Wikipedia „Chess endgame“ und „Chess middlegame“, chess.com „Opening, Middlegame,
  Endgame“, Speelman „Endgame Preparation“ 1981): Eine allgemeingültige Grenze gibt es nicht.
  Mittelspiel, sobald die Entwicklung abgeschlossen und der König in Sicherheit ist (deckt sich
  mit dem Buch); die Eröffnung dauert „etwa die ersten 10 bis 15 Züge“. Endspiel nach Speelman,
  wenn jede Seite höchstens 13 Punkte an Steinen außer dem König hat; daneben „die Könige können
  aktiv werden“ und „die Damen sind getauscht“ (beides in den Endspielfragen des Buches).
  Eingebaut: (1) ab Zug 15 kein Eröffnungsurteil mehr, auch mit Leichtfiguren zu Hause (in
  0.2.43 auf Wunsch des Autors wieder gestrichen); (2) Endspiel, sobald jede Seite höchstens 13 Punkte hat
  (`ENDSPIEL_BIS_PUNKTE`, Bauern mitgezählt), auch mit Damen (Damenendspiel). Beide greifen nur,
  wenn die Regeln des Buches nichts anderes sagen (das Endspiel des Buches geht vor); der Befund
  trägt `buchphase` und `zusatz`, das Werkzeug „Phase“ zeigt die Zusatzregel als zweite Zeile
  „Zusatzregel (nicht aus dem Buch): …“ mit der Phase nach dem Buch. Die Lehrbilder des Buches
  ändern ihre Phase nicht (Referenztests k11-phase unverändert); Mattführungen wie Dame gegen
  König sind jetzt Endspiel statt Mittelspiel. Rückfrage S8 (Zahlen 15 und 13).
- **S4 typische Fehler, S6 Eröffnung „frei“:** bestätigt.
- **S5 Bots** (`engine/gegner.ts`, `ui/komponenten/GegnerWahl.tsx`): zwölf vorgefertigte Gegner
  mit Kennung, Name, Satz und Stufen je Phase (Streuung höchstens 2, im Code geprüft): Lotta
  1·1·1, Opa Hans 2·1·2, Max 1·2·1, Frieda 2·2·3, Herr Lehmann 3·2·2, Nina 3·3·3, Jonas 2·3·4,
  Timo 5·4·3, Kurt 4·5·5, Lena 6·6·5, Doktor Berg 6·7·7, GM Grün 8·8·8. Auswahlfeld „Vorgefertigter
  Gegner“ über den Reglern, sortiert nach Durchschnitt (bei Gleichstand Mittelspiel), Klasse =
  Stufenname zum gerundeten Durchschnitt; die Wahl setzt die Regler, ein Regler löst die Wahl
  (`bot: null`). `Partieeinstellung.bot` steht in Untertitel und Partienliste. Die Abhakliste der
  Fehlerarten bleibt offen (Rückfrage S7).
- **Spielhilfen zuschaltbar** (`Partieeinstellung.hilfen`, Haken in `GegnerWahl.tsx`): `symbole`
  (Zählen, Röntgen, Warnsignale am Brett) und `werkzeuge` (Bündel, Werkzeugleiste, Hinweis).
  Die großen Werkzeuge verschwinden mit dem Partieende (`mitWerkzeugen = werkzeuge && !ende`),
  die Symbole dürfen bleiben (Wunsch des Autors). Vorgabe: beide an; die Vorlieben merken es.
- **Mensch gegen Mensch** (`Partieeinstellung.gegner: "engine" | "mensch"`): Bei „mensch“ zieht
  die Engine nie (`usePartie`, `amZugEngine`), `leserAmZug` gilt für beide Seiten, Aufgeben gilt
  für die Seite am Zug (`gibAuf`), das Ergebnis nennt die Farben („Matt! Weiß hat gewonnen.“,
  `partietexte.ts`), Status „Weiß am Zug.“ / „Schwarz am Zug.“, Überschrift „Partie zu zweit“,
  Spielstärke, Rückblick und PGN mit „Weiß“ und „Schwarz“ (PGN-Kopf „Mensch gegen Mensch“).
  Nicht gewertet, kein Bot, keine Eröffnungsvorgabe. Partienliste: beide Könige, „Mensch“,
  „Weiß etwa … · Schwarz etwa …“. Rückfrage S11 (Brett nach jedem Zug drehen?).
- **Partienkachel** (`ui/komponenten/Partienliste.tsx`): Ergebnis als „1–0“, „0–1“, „½–½“ oder
  „läuft“ (`ergebniszeichen`), Name des Gegners statt des Stufennamens, Näherungswertung beider
  Seiten („du etwa 1400 · Engine etwa 1600“, bei kurzen Partien „78 % genau“); die gemeinsame
  Rechnung liegt in `spiel/wertung.ts` (`staerkeDerPartie`).
- **Wertung des Lesers nach Elo** (`spiel/wertung.ts`, `Spielstand.wertung`,
  `ui/komponenten/Wertungskurve.tsx` oben in den Einstellungen): Haken „Gewertete Partie“
  (`Partieeinstellung.gewertet`, Vorgabe an bei Engine, nie bei Mensch; ältere Partien zählen
  nicht). Sobald die Auswertung einer gewerteten, beendeten Partie gespeichert wird
  (`mitWerten`), entsteht ein Wertungspunkt (Partie, Zeit, Schätzung des Gegners = Spielstärke der
  Engine-Seite in dieser Partie, Ergebnis, Wertung danach). Erste Partie: Wertung = Schätzung des
  Lesers; danach Elo mit Erwartung 1/(1+10^((Rg−R)/400)), K = 32 in den ersten zehn Partien, dann 20. Partien ohne Schätzung (unter zehn eigenen Zügen) zählen nicht. Der Verlauf liegt im
  Speicher (höchstens 1000 Punkte) und überlebt das Wegfallen alter Partien (50). Karte: Zahl
  groß, „N gewertete Partien, im Ausschnitt +16“, Auswahlfeld (letzte 10/25/50 Partien; 1 Woche,
  4 Wochen, 3 Monate, halbes Jahr, 1 Jahr; Vorgabe 25 Partien), SVG-Kurve mit Rasterlinien auf
  runden Wertungen, Punkte grün/rot/grau je Ergebnis mit Titel (Datum, Ergebnis, Gegner), bei
  Zeiträumen liegt jede Partie an ihrer Zeit, rechter Rand „jetzt“. Rückfragen S9 (Alternativen:
  gleitender Durchschnitt, Glicko; Rücknahmen) und S10 (Ausschnitte).
- **Stellungen aufbauen** (`spiel/stellungsbau.ts`, `ui/komponenten/Stellungseditor.tsx`, Knopf
  „Stellung aufbauen“ auf dem Spielen-Bildschirm, auch aus einer Abbildung): „Figuren setzen“
  (zwölf Steine und „Feld räumen“ als Kacheln, Felder antippen, zweiter Tipp räumt, „Am Zug“,
  „Brett leeren“, „Grundstellung“; beliebig viele Steine, Entscheidung des Autors) und „Züge
  spielen“ (Züge nach den Regeln mit Zielfeldern und Umwandlungsfrage; die Umwandlungsfrage liegt
  jetzt in `ui/komponenten/Umwandlung.tsx`, geteilt mit dem Brettbereich). Rochaderechte folgen
  den Steinen auf den Startfeldern, kein En passant, Zähler 0/1. Übernehmen nur, wenn `spielbar`;
  eine veränderte Abbildungsstellung zählt als eigene Stellung (`abbildungGilt`). Rückfrage S12.
- **Speicher:** keine neue Formatversion; neue Felder (`gegner`, `bot`, `hilfen`, `gewertet`,
  `wertung`) bekommen beim Lesen Vorgaben, ältere Partien gelten als Engine-Partien, ungewertet.

## Vormerkung: Bots mit Persönlichkeit (17.10.2026 abends, Autor; noch nicht umsetzen)

Wunsch des Autors: Manche Spieler haben eine „Blindheit“ für bestimmte Züge (sein Beispiel: die
langen Diagonalen der Läufer). Solche blinden Flecken sollen als Fehlerarten in die Fehlerliste
der Bots, die vorgefertigten Bots sollen verschiedene Fehlerlisten bekommen (dieselbe Stärke,
verschiedene Persönlichkeiten), und bei vorgefertigten Bots soll nur der Durchschnitt stehen,
nicht die Stufen je Phase. Ausdrücklich erst später; hier die Recherche (17.10.2026) als Grundlage.

**Bekannte blinde Flecken (Quellen: chess.com „The Unseeing Mind“; Substack „Blind Spots“ von
Eugene Perel und „Mind The Gap“ von Nick Vasquez; Lichess-Blog „Causes of blunders in chess“;
USCF Sales „Chess Blindness“; Ilyin-Zhenevsky 1928 „Psychologie der Schachfehler“, auf Lichess
wiederveröffentlicht; Avni, „Danger in Chess“, 1994):**

- **Rückzüge** („quiet retreating moves“; das berühmte Beispiel Christiansen–Karpov 1993, Karpov
  übersah einen Rückzug, der die Figur gewann). Klassenspieler übersehen Rückzüge und ruhige Züge
  besonders oft, wenn die Stellung „nach Aktion aussieht“.
- **Lange Diagonalen** der Läufer aus der Ecke oder vom Rand (Beispiel des Autors); verwandt:
  **lange Damenzüge** über das ganze Brett und **seitliche Turmzüge** (Perel nennt sie als seinen
  eigenen blinden Fleck, mit einem Großmeisterbeispiel).
- **Springerzüge rückwärts** und Springerzüge an den Rand (Springer „sieht“ man vor allem vorwärts).
- **Röntgen-Angriffe** (Angriff durch eine eigene oder fremde Figur hindurch) tauchen laut Vasquez
  „überraschend oft“ als übersehene Motive auf.
- **Zwischenzüge** und **Abzüge** (Abzugsschach, Abzugsangriff): Der Spieler rechnet nur die
  Zwangsfolge Schlag–Rückschlag.
- **Stille Bauernzüge**, die eine Figur fangen oder ein Feld nehmen (Beispiel bei thechessworld:
  ein Turm, den ein ruhiger Bauernzug einsperrt).
- **„Verschwindendes Feld“** (Ilyin-Zhenevsky): Ein Feld, das eben noch gedeckt war, wird nach dem
  eigenen Zug nicht mehr neu geprüft; verwandt mit „eine Figur zieht weg und deckt nicht mehr“.
- **Gegnerische Drohungen nicht prüfen** (laut Lichess-Blog der häufigste Grund für Patzer);
  Grundreihenmatt, en passant, Unterverwandlung als Sonderfälle.
- Außerdem **Stilschwächen** statt Blindheit: ungern zurückziehen, ungern tauschen (oder zu gern),
  Läufer oder Springer überschätzen, Opfer scheuen oder suchen; Avni beschreibt „Fehler des
  Unterlassens“ (Gefahr nicht spüren). Diese Seite deckt der Stilregler teils schon ab.

**Umsetzungsidee (noch nicht gebaut):** Blinde Flecken als eigene Liste neben den Fehlerarten
(`engine/blindeFlecken.ts`): Für jede Art ein Prüfer „ist dieser Zug von dieser Art?“ (Rückzug:
Figur zieht in Richtung eigener Grundreihe; lange Diagonale: Läuferzug über mindestens vier
Felder; Springer rückwärts; Damenzug über mindestens fünf Felder; seitlicher Turmzug; ruhiger Zug
ohne Schlag und Schach, während ein Schlag möglich wäre; Zwischenzug; Abzug; Bauernzug ohne
Schlag). Zugwahl: Ist der beste Zug der Engine von einer Art, für die der Bot blind ist, spielt er
mit einer Wahrscheinlichkeit (je Stufe) den nächstbesten Zug anderer Art; das Protokoll nennt den
blinden Fleck (Auswertung: „hat den Rückzug nicht gesehen“). Fehlersuche: Drohungen des Gegners
dieser Art gelten als nicht gesehen. Bots: je vorgefertigtem Bot eine feste Auswahl aus
Fehlerarten und ein bis zwei blinde Flecken, auch ab Stufe 5 (dort nur blinde Flecken, keine
groben Fehler); Anzeige nur mit Durchschnitt und Klasse. Eigene Gegner bekommen die blinden Flecken
als Haken dazu. Schätzung: zwei bis drei Sitzungsschritte; die Stufenmessung muss dabei zeigen,
dass blinde Flecken die Stufe nicht um mehr als etwa eine halbe Stufe senken.

## AP 13 Teil 3: Taktiktrainer, „Falle oder Köder“, Strukturerkenner (Opus, 17.10.2026, Version 0.2.45)

- **Daten:** Die Trainer lesen Fables Dateien aus `inhalte/de/trainer/`, die der Build nach
  `public/daten/de/trainer/` kopiert. So gibt es nur eine Quelle, geprüft gegen die Schemas.
- **Taktiktrainer:** Thema (gemischt, Mattbilder, eines der zwölf Motive) und Stufe 1 bis 5;
  Runde aus acht Aufgaben, leichteste zuerst, Buchaufgaben vor Lichess. Hilfen in der Reihenfolge
  des Pflichtenhefts. Richtig zählt nur ohne falschen Zug und ohne Hilfe; ein Matt löst immer.
  Das Benennen des Motivs zählt nicht mit. Rückfragen W1, W2, W7.
- **„Falle oder Köder“:** Angebot als grauer Pfeil, Warnsignale aus Kapitel 4 auf Wunsch statt
  selbst markieren (W3), Runden je zur Hälfte Fallen und Geschenke (W4).
- **Strukturerkenner:** zwei Schritte (schwache Bauern antippen, Plan wählen); die Struktur wird
  nicht abgefragt, falsche Pläne nur aus anderen Familien (W5). 19 Plan-Sätze und 13
  Strukturnamen von Claude (W6).
- **Übungen:** „Nur dieser Zug führt zum Ziel“ nach Fables Engine-Prüfung; gleichwertige Züge
  aus der Prüfung bleiben aus, bis der Autor T1 beantwortet.
- **Aufgabendatei:** Auf Wunsch des Autors hat jede offene Rückfrage eine begründete Empfehlung.

## Bots mit Persönlichkeit (17.10.2026 abends, Autor und Fable, Version 0.2.46)

Der Autor wollte die Vormerkung (Abschnitt „Vormerkung: Bots mit Persönlichkeit“) doch sofort.
Umgesetzt nach dem dort beschriebenen Plan:

- **Blinde Flecken** (`engine/blindeFlecken.ts`): acht Zugarten mit Prüfern auf der Stellung:
  Rückzug (Figur außer Bauer und König zieht Richtung eigene Grundreihe, ohne Schlag), lange
  Läuferdiagonale (mindestens vier Felder), Springer rückwärts, langer Damenzug (Königsabstand
  mindestens vier), seitlicher Turmzug (entlang der Reihe, mindestens drei Felder), ruhiger Zug
  (ohne Schlag und Schach, obwohl ein Schlag möglich wäre), Abzug (eine andere eigene
  Langschrittfigur greift nach dem Zug König, Dame oder Turm des Gegners neu an), stiller
  Bauernzug (ohne Schlag, Schach, Umwandlung). Noch nicht: Röntgen, Zwischenzug, Grundreihe.
- **Zugwahl** (`engine/zugwahl.ts`, `Gegnerprofil.blindeFlecken`): Hat der Gegner blinde Flecken
  oder einen Stil, holt die Engine vier Kandidaten mit der Stärke der Stufe. Gehört der beste Zug
  zu einem blinden Fleck, übersieht ihn der Gegner mit 70 % (`BLINDHEIT`) und spielt den
  nächstbesten Zug, der zu keinem seiner Flecke gehört und höchstens eine Leichtfigur kostet
  (`BLIND_HOECHSTVERLUST` 3); sonst den besten. Das Protokoll trägt die Fehlerart
  `blindRueckzug` usw. (`Fehlerart` um die blinden Flecken erweitert, `BLINDE_FEHLERARTEN`), die
  Auswertung sagt „einen Rückzug nicht gesehen“. Blinde Flecken wirken in jeder Stufe; die
  Fehlerarten weiter nur in Stufe 1 bis 4. Nicht gebaut: Blindheit gegenüber gegnerischen
  Drohungen in der Fehlersuche (offen in FORTSCHRITT).
- **18 vorgefertigte Gegner** (`engine/gegner.ts`): je Gegner eine feste Fehlerliste (grobe
  Fehler der Einsteiger, feinere der Anfänger, gemischt) und ein bis zwei blinde Flecken, auch ab
  Stufe 5 (Lena, Viktor, Doktor Berg nur blinde Flecken); sechs neue Gegner (Paula, Onkel Rudi,
  Selin, Benno, Frau Ortega, Viktor), damit es für ähnliche Stärke verschiedene Persönlichkeiten
  gibt. Die Liste steht als Rückfrage S7 beim Autor.
- **Stufen verborgen** (Wunsch des Autors): Auswahlfeld und Untertitel zeigen bei vorgefertigten
  Gegnern nur „⌀ 4 · Gelegenheitsspieler“; die drei Regler verschwinden, solange ein
  vorgefertigter Gegner gewählt ist (`Spielen.tsx`). Die Stufen gelten unverändert im Hintergrund.
- **Eigene Gegner** bekommen die blinden Flecken als Haken (`GegnerEditor.tsx`,
  `EigenerGegner.blindeFlecken`, Speicher `speicher/gegner.ts`); die Partie merkt sich sie in
  `Partieeinstellung.blindeFlecken` (wahlfrei, ältere Partien unverändert).
- **Nicht gemessen:** Ob blinde Flecken die Stufe spürbar senken, prüft erst eine Stufenmessung
  mit Profil (`npm run messen:stufen` kennt die Profile noch nicht); der Höchstverlust einer
  Leichtfigur und die 70 % sind Schätzungen, Nachtest N242.

## Empfehlungen vorab umgesetzt (Opus, 17.10.2026, Version 0.2.47)

Der Autor erlaubt (17.10.2026), Claudes Empfehlungen aus `docs/AUFGABEN_AUTOR.md` Teil 2 schon
umzusetzen, wo sie sich leicht zurücknehmen lassen. Die Rückfragen bleiben offen, bis er
zustimmt; ein Widerspruch genügt, um sie wieder auszubauen.

- **S9:** Partien mit Rücknahme sind ungewertet (`spiel/wertung.ts`, `wertungspunktFuer`).
  Texte `ich.wertung.erklaerung` und `spielen.gewertetHinweis` sagen es.
- **K5:** Steht die ziehende Seite nach dem Zug noch bei +5 oder besser, ist der Zug höchstens
  „ungenau“ (`spiel/auswertung.ts`, `KLAR_GEWONNEN`; ebenso `zeichenFuer` für die Engine-Karte
  und die Liste „Grobe Patzer“). Der Verlust bleibt in Bauern; nur die Einordnung ist gedeckelt,
  damit Genauigkeit und Spielstärke-Schätzung unverändert bleiben.
- **R3:** „Geschätzte Spielstärke“ statt „Spielstärke (geschätzt)“; Erklärung „keine Wertungszahl
  eines Verbands“.
- **C8:** Kein Minderheitsangriff gegen eine Mehrheit, deren Kandidat schon in der eigenen Hälfte
  steht (`analyse/skelett.ts`, `minderheitsplan`). Allgemeine Regel statt Sonderfall für Abb.
  5.30: Gegen einen vorgerückten Kandidaten geht es ums Aufhalten, nicht ums Aufbrechen.
  Carlsbad (5.32 bis 5.34, 6.8) unverändert.
- **T1:** Die gleich guten Züge der Engine-Prüfung gelten in den Übungen 6, 11, 15, 39
  (`training/uebungsaufgabe.ts`, `ENGINE_VORSCHLAEGE_UEBERNOMMEN`), geladen aus
  `uebungen-engine.json`; ohne geladene Prüfung gelten nur die Buchzüge. Neue Rückmeldung
  „Auch dieser Zug ist gleich gut“ für jede Linie außer der des Buches (auch für die schon
  vorher akzeptierten Züge aus der Erklärung).
- **U9:** Karten „taktik:<id>“ und „falle:<id>“ (`training/wiederholung.ts`). Nur eine falsche
  Antwort legt eine Karte an (`notiereTrainerantwort`); eine vorhandene wandert mit jeder Antwort.
  Fällige Aufgaben: Knopf „Wiederholen“ in der Auswahl des Trainers, Hinweis im Bereich Training.
- **E2:** Cloudflare stand schon im Entwurf der Datenschutzseite; offen bleibt der Verantwortliche.

## Anmerkungen des Autors vom 17.10.2026 abends: Töne, gesperrte Figur, Schlagring, Holzfiguren, Wertungsstern (Fable, Version 0.2.58)

- **Töne** (`app/ton.ts`, `spiel/zugton.ts`, `ui/brett/useZugton.ts`): Schach (ein Sinuston 880 Hz),
  Matt (drei fallende Töne), Remis bei Patt oder zu wenig Material (zwei gleiche Töne), jeweils
  kurz nach dem Klacken des Zuges; Warnung (tiefer Ton 220 Hz). Weiter ohne Tondateien, alles im
  Browser erzeugt. Die Tonart kommt aus der Stellung nach dem Zug (`tonartNach`).
- **Gesperrte Figur** (`schach/weiterspielen.ts` `zugsperre`, `useBrettbedienung.ts`): Ein Tipp
  auf eine eigene Figur ohne legalen Zug leuchtet 0,9 s rot (`gesperrt` am Brett), spielt den
  Warnton und zeigt unter dem Brett den Grund: Schach (der König steht im Schach), gefesselt
  (die Figur steht in den „blockers“ von chessops, deckt also den König), sonst blockiert.
- **Schlagring** (`Brett.tsx` `Zielring`): Auf besetzten Zielfeldern ein goldener Ring mit dunklem
  Rand statt des Punktes, der auf dunklen Figuren unterging.
- **Figurensatz „Holz“:** jetzt Merida (Armando Hernandez Marroquin, über Lichess, GPLv2+) in
  Elfenbein und Nussbaum statt der umgefärbten Burnett-Figuren; damit haben die drei Sätze
  verschiedene Formen (`docs/LIZENZEN.md`).
- **Wertungsstern** (`Partienliste.tsx`): goldener Stern hinter dem Ergebnis gewerteter Partien.

## Blinde Flecken vollständig (17.10.2026, Fable, Zweig `blinde-flecken-2`, Version 0.2.57)

Der Rest aus 0.2.46, nach Regel 9 umgesetzt.

- **Drei weitere Flecken** (`engine/blindeFlecken.ts`, `fleckeVon`): Röntgen (die gezogene
  Langschrittfigur zielt durch den ersten Stein auf König, Dame oder Turm; Kapitel 7 Fesselung und
  Spieß; auch Dh5 durch f7 auf e8), Zwischenzug (eine eigene Figur ist angegriffen, der Zug gibt
  stattdessen mit einer anderen Figur Schach), Grundreihe (Dame oder Turm mit Schach auf die
  Grundreihe des Gegners). Zugeteilt: Paula und Opa Hans Grundreihe, Frieda Röntgen, Timo und
  Lena Zwischenzug.
- **Blindheit gegenüber gegnerischen Zügen** (`blindeWahl`, zweiter Teil): Übersieht der Gegner
  nicht seinen eigenen besten Zug, prüft die Wahl die weiteren Kandidaten der Engine: Der erste,
  dessen Antwort in der Variante der Engine zu einem blinden Fleck gehört, wird gespielt, als
  wäre er gut (höchstens eine Leichtfigur Verlust, derselbe Wurf gegen 70 %). Protokoll und
  Auswertung nennen den Fleck wie bisher. Ruhige Züge und stille Bauernzüge zählen hier nicht als
  Drohung (fast jede Widerlegung ist einer).
- **Messung** (`npm run messen:stufen -- 3b-3 3b-2 5b-5`, Kürzel „b“ = alle elf Flecken):
  alle elf Flecken zugleich: Stufe 3 blind 2:8 gegen Stufe 3, 10:0 gegen Stufe 2, Stufe 5 blind 4:6 gegen Stufe 5 (Fehlerquote 52 bis 61 %, Extremfall). Vorgefertigte Gegner gegen ihre Stufe ohne Flecken: Nina 4:6, Paula 6:4, Lena zuerst 1,5:8,5, weil fast jede Widerlegung ein ruhiger Zug ist; nach Ausschluss von „ruhig“ und „bauer“ aus dem Drohungsteil (`KEINE_DROHUNGSFLECKEN`) 5:5 bei 12 % Fehlerquote. Alle elf zugleich danach 1:9. Ziel „höchstens eine halbe Stufe je Gegner“ erreicht

## R5: Engine-Variante im Rückblick (17.10.2026, Fable, Zweig `rueckblick-variante`, Version 0.2.56)

Nach Regel 9 umgesetzt, mit geänderter Empfehlung: Die Vergleiche mit chess.com zeigten, dass dort
zu jedem Fehler die Fortsetzung der Engine steht, und der Autor wollte die Auswertung daran messen.

- **Speicher** (`speicher/partien.ts`): `Partieeintrag.varianten`, je Stellung die Hauptvariante der
  Engine in UCI (bis sechs Halbzüge, beginnt mit dem besten Zug), geschrieben von `mitWerten`;
  ältere Auswertungen haben eine leere Liste und bleiben gültig. Beim Einlesen muss die Länge zu
  den Werten passen, sonst leer.
- **Auswertung** (`useAuswertung.ts`): nimmt die Hauptvariante aus der ersten Variante der Engine
  mit; keine zusätzliche Rechenzeit.
- **Karte** (`spiel/rueckblick.ts`, `variantentext`; `Rueckblickkarte.tsx`): nach „Besser war 12.
  Sf3.“ folgt „Danach etwa 12... Sc6 13. Lc4 Sf6 14. Sg5 d5.“, höchstens fünf Halbzüge nach dem
  besseren Zug, deutsche Figurenbuchstaben; bei einem besten Zug nichts. Rückfrage zur Länge in
  N275.
- **Nebenbei bereinigt:** `docs/FORTSCHRITT.md` nannte R4 noch als wartend und Endspiel- und
  Repertoire-Trainer als offen.

## Brillant am Prüfstand von chess.com (17.10.2026, Autor und Fable, Zweig `opfer-pruefstand`, Version 0.2.54)

Der Autor hat beide Empfehlungen aus der Recherche zu den chess.com-Klassen angenommen: die 100
Brillant-Züge des Chessigma-Vergleichs (chess.com-Partien 2020 bis 2026, Datei mit PGN und Halbzug
je Partie, liegt nur lokal in `buch/arbeit/chessigma/`, Lizenz ungeklärt) als Prüfstand für unsere
Opfererkennung nutzen; die Gewinnchance nicht von der Spielstärke des Lesers abhängig machen (bei
chess.com hängen erwartete Punkte und die Großzügigkeit bei Brillant und Großartig von der Wertung
ab; unsere Zahlen blieben sonst je Leser verschieden und schwerer erklärbar).

- **Opfererkennung** (`engine/fehlerart.ts`, `opferwert`): Von den 100 Brillanten erkannte die
  Abtauschrechnung zuerst 56. Zwei Ursachen: Eine schon angegriffene Figur zählte nie als Opfer
  (Dxc6+ mit einer angegriffenen Dame), jetzt zählt die gezogene Figur auch dann (andere Figuren
  weiter nur, wenn sie erst durch den Zug hängen: ein Königszug neben einer längst hängenden Dame
  ist kein Opfer); und die Grenze „Netto mindestens 2“ ließ einen Springer für zwei Bauern aus
  (10. Sxb5 in der Opernpartie), jetzt Netto mindestens 1 (`OPFER_AB` in spiel/auswertung.ts).
  Damit 100 von 100 erkannt; 7,5 % aller Züge der 100 Partien sind Opferkandidaten.
- **Brillant-Regel** (`spiel/auswertung.ts`, `brillant`): Mit „bester oder bis 0,2 dahinter“
  allein wären 73 der 100 erkannt, aber 230 weitere Züge brillant (zwei je Partie; chess.com
  null). Die Fehlalarme lagen vor allem in verlorenen Stellungen (98 unter −1) und in schon
  gewonnenen (67 über +5). Nach dem Nachbau „freechess“ (WintrCat) jetzt zusätzlich: nach dem Zug
  mindestens −1, nicht aus dem Schach heraus, der zweitbeste Zug gewinnt nicht ohnehin (Wert vor
  dem Zug minus Abstand zum zweitbesten unter +7); dafür reicht „bis 0,5 hinter dem besten“.
  Ergebnis am Prüfstand: Opfer erkannt 62 von 100 (38 Brillante lassen eine schon vorher angegriffene, nicht gezogene Figur stehen; die zählt nicht, siehe oben), brillant 46 von 100, 25 Fehlalarme in 100 Partien. Großzügigere Fassung (jede schon angegriffene Figur zählt als Opfer): 79 von 100, aber 98 Fehlalarme in 56 Partien, also etwa einer je Partie. Entschieden für die strenge Fassung: Ein grundlos vergebenes „!!“ lehrt den Leser Falsches, ein verpasstes schadet nicht (Rückfrage S19).
- **Zunächst nicht übernommen (seit 0.2.59 doch, siehe unten):** chess.com prüft zusätzlich, ob
  die geopferte Figur „wirklich zu nehmen“ ist.
- **Messlauf:** `app/src/spiel/opfer.messung.ts` (nicht in der CI) rechnet die Datei mit der
  Engine durch; Aufruf `npm run messen:opfer` im Ordner app, Ergebnis nur lokal.

## Abhakliste der Fehlerarten (17.10.2026, Fable, Zweig `fehlerarten-abhakliste`, Version 0.2.60)

Rest aus Rückfrage S7 (Vorschlag des Autors seit 0.2.40), nach Regel 9 ohne weitere Rückfrage
gebaut, da der Rückbau einfach ist (eine Vorliebe, die beim Lesen fehlen darf).

- **Was:** In den Einstellungen steht unter „Darstellung und Training“ die Karte „Absichtliche
  Fehler der Engine“ (`ui/komponenten/FehlerartenKarte.tsx`): die 14 Fehlerarten als Haken, dazu
  „Alle erlauben“, „Keine erlauben“ und die Zeile „n von 14 Arten erlaubt“. Die Liste liegt in den
  Spielvorlieben (`Spielvorlieben.erlaubteFehlerarten`, Vorgabe alle; fehlt sie in alten Daten,
  gelten alle).
- **Wirkung:** Beim Anlegen einer Partie (`Spielen.tsx`, `gegnerprofil`) wird die Liste des
  Gegners mit der Abhakliste geschnitten (`engine/gegner.ts`, `unterAbhakliste`): für die
  Engine-Stufen 1 bis 4 (bisher alle Arten) und die vorgefertigten Gegner (ihre Persönlichkeit).
  Sind alle Arten erlaubt, ändert sich nichts. Eine leere Liste heißt „keine absichtlichen
  Fehler“, die Stufe spielt dann nur noch ihre Rechenstärke. Eigene Gegner behalten ihre eigene
  Liste aus dem Editor (so in S7 und S14 festgehalten). Die Liste gilt ab der nächsten neuen
  Partie, eine laufende Partie behält ihre Einstellung.
- **Warum nicht je Stufe:** Eine Liste je Stufe hätte vier Karten gebraucht; wer das will, legt
  einen eigenen Gegner an. Die allgemeine Liste ist für den Lesefortschritt gedacht („nur die
  Fehler aus Kapitel 1 und 4“).

## Brillant, zweiter Schritt: Opfer wirklich annehmbar (17.10.2026, Fable, Zweig `brillant-annehmbar`, Version 0.2.59)

Nach Regel 9 (Empfehlungen gleich umsetzen) gebaut, was in 0.2.54 noch „bei Bedarf später“
hieß. Die Opfererkennung liegt jetzt in `app/src/engine/opfer.ts` (vorher in `fehlerart.ts`, das
über 400 Zeilen wuchs); das Spielen eines Zuges aus UCI in `engine/zugprobe.ts`.

- **Wirklich zu nehmen:** Eine Figur zählt nur als Opfer, wenn der Gegner sie nach dem Zug legal
  schlagen kann (`annehmbar`: ein legaler Zug auf ihr Feld). Das schließt aus: einen Angreifer, der
  an den eigenen König gefesselt ist, und eine Figur, die stehen bleibt, während der Gegner ein
  Schach beantworten muss, das nicht von ihr ausgeht. Die Abtauschrechnung des Buches kennt
  Fesselungen nicht (Kapitel 1); hier geht es nur um die Frage „geopfert oder nicht“.
- **Nicht übernommen:** „Nehmen erlaubt kein Matt in einem.“ Genau das ist 16. Db8+!! in der
  Opernpartie (Sxb8 Td8#), und chess.com nennt es brillant. Die Regel wäre also falsch.
- **Fassung der schon verlorenen Figuren** (`OPFER_ALT_VERLORENE`): Der Messlauf prüft drei
  Fassungen, je mit der Nehmbarkeitsprüfung (100 Brillant-Züge, 500 ms je Stellung):

  | Fassung                                                                                            | Opfer erkannt | Brillant erkannt | Fehlalarme       |
  | -------------------------------------------------------------------------------------------------- | ------------- | ---------------- | ---------------- |
  | „keine“ (nur, was erst durch den Zug verloren geht; Stand 0.2.54, dort ohne Nehmbarkeit 46 bei 25) | 61            | 50               | 20 in 18 Partien |
  | „gezogene“ (dazu die gezogene Figur, auch wenn sie vorher schon angegriffen war)                   | 73            | 59               | 19 in 18 Partien |
  | „alle“ (auch eine angegriffene Figur, die der Zug stehen lässt)                                    | 99            | 81               | 59 in 39 Partien |

  Entschieden für **„gezogene“**: mehr Treffer als „keine“ bei gleich vielen Fehlalarmen (einer je
  fünf Partien, vorher einer je vier). „Alle“ träfe 81, gäbe aber in jeder zweiten Partie ein
  grundloses „!!“; das widerspricht S19 (lieber ein verpasstes als ein grundloses). Die Angabe in
  der Entscheidung zu 0.2.54, die gezogene Figur zähle schon, stimmte für den Code nicht (der
  Aufruf stand auf „keine“); jetzt stimmt sie. Die Opferkandidaten sinken von 7,5 % auf 3 % aller
  Züge, die Auswertung wird dadurch eher schneller.

- **Messlauf:** `MESSUNG_OPFER_ALT=keine|gezogene|alle npm run messen:opfer`, Bericht
  `bericht-<Fassung>.md` neben der Datei, jetzt auch mit der Liste der Fehlalarme.

## R4: Stufen 1 bis 3 menschlicher (17.10.2026, Fable, Zweig `stufen-menschlich`, Version 0.2.52)

Nach Regel 9 (Empfehlungen gleich umsetzen) umgesetzt: Wege 1 bis 3 aus der Rückfrage R4.

- **Warum:** Skill Level 0 (Tiefe 1) spielte alles Einzügige fehlerfrei und traf in erzwungenen
  Lagen die Hauptvariante; die Fehlerwürfe trafen dagegen zufällige ruhige Züge („dämlich, dann
  genial“). Ein Mensch um 1000 Elo ist gleichmäßig blind ab zwei Zügen Tiefe und verschenkt selten
  grundlos.
- **Tiefengrenze** (`engine/engineDienst.ts`, Stärke „tiefe“): volle Stärke, aber `go depth N`
  (mit der Rechenzeit als Deckel). Stufe 1: 2, Stufe 2: 4, Stufe 3: 5 Halbzüge (die Ruhesuche
  der Engine sieht Schlagfolgen trotzdem zu Ende; blind ist sie für stille Züge dahinter). Was dahinter liegt,
  sieht die Engine gar nicht.
- **Gewichtete Zugwahl** (`engine/menschlich.ts`): sechs Kandidaten der tiefenbegrenzten Suche,
  Gewicht e^(−Verlust/Temperatur); Temperatur 1,0, 0,7, 0,5 Bauerneinheiten. Höchstverlust und
  Damenopfer-Verbot der Stufe gelten weiter, der beste Zug bleibt immer wählbar. Temperatur nach
  Lage: im Schach halb, bei 30 und mehr legalen Zügen ein Drittel mehr; Strähne: je eigenem Zug
  mit Verlust ab 0,5 unter den letzten drei ein Viertel mehr; Tagesform je Partie 0,75 bis 1,25
  (aus der Kennung der Partie). Der Verlauf kommt über das Gegnerprofil (`verlauf`), die Oberfläche
  (`usePartie.ts`) rechnet ihn aus der Partie.
- **Fehlerprofile bleiben** (Fehlerquote, erklärbare Fehler mit Art); blinde Flecken und Stil
  wirken wie bisher (bei Stil-Gegnern wählt der Stil, nicht die Temperatur).
- **Messung** (`npm run messen:stufen -- 1-2 2-3 3-4`, je 10 Partien): je 10 Partien, 17.10.2026: Erste Fassung (Tiefen 3, 5, 7) 1-2 10:0, 2-3 9:1, aber 3-4 5:5 (Stufe 3 mit Tiefe 7 so stark wie Skill Level 3); mit Tiefe 6 und Temperatur 0,55 weiter 5:5. Endfassung Tiefen 2, 4, 5, Temperaturen 1,0, 0,7, 0,5 und Stufe 4 auf Skill Level 4: 1-2 10:0, 2-3 10:0, 3-4 6,5:3,5, 4-5 10:0 (Punkte der höheren Stufe); Fehlerquoten 33 %, 27 %, 13 %, 8 % (Soll etwa 34, 26, 13, 6), höchster Verlust eines Fehlerzuges 8,8 / 4,9 / 3,0 / 2,8. Jede Stufe gewinnt die Mehrheit gegen die darunter (Abnahme Konzept 8.2).

## Vergleich mit chess.com an drei Partien, S18 und T4 umgesetzt (17.10.2026, Autor und Fable, Version 0.2.51)

Der Autor hat drei Partien bei chess.com prüfen lassen (Opernpartie Morphy 1858, Lasker–Thomas 1912,
eine ruhige Berliner Partie mit Remis) und die Screenshots geschickt; dazu seine neue Arbeitsregel
(CLAUDE.md, Regel 9): Empfehlungen gleich umsetzen, Widerspruch genügt.

- **Befund Genauigkeit:** Für die Gewinner stimmen App und chess.com nach 0.2.50 auf ein bis drei
  Punkte überein (Oper 95 zu 96,1; Lasker 90 zu 92,8; Berlin 97 zu 97,9 und 95 zu 95,0). Für die
  Verlierer weicht es in beide Richtungen ab (Oper 82 zu 63,2; Lasker 58 zu 73,3): chess.com
  rechnet mit einer eigenen, nicht veröffentlichten Formel; unsere folgt Lichess. Nicht geändert.
- **Befund Brillant:** Die App vergab in der ruhigen Partie vier „Brillant“ für Abtausche (Lxg5
  gegen einen Springer, danach Lxg5), chess.com null. Ursache: `opferwert` (engine/fehlerart.ts)
  zählte, was der Gegner nach dem Zug gewinnen kann, ohne abzuziehen, was der Zug selbst schlägt.
  Behoben: Opfer = Verlust laut Abtauschrechnung minus geschlagene Figur. Dazu ist brillant jetzt
  auch ein Opfer bis 0,2 hinter dem besten Zug und auch in gewonnener Stellung (chess.com gibt 16. Db8+!! in der Opernpartie); die Grenze „ab +4 kein brillant“ ist weg. Zweiter Fehler: Ein
  Zug mit Schach zählte nie als Opfer (die Prüfung „Figur hängen lassen“, W1, lässt Schachgebote
  aus, und `opferwert` nutzte dieselbe Rechnung); 16. Db8+ und das Beispiel 2. Th8+ (Abb. 7.14)
  konnten also nie brillant sein. Jetzt rechnet der Opferwert auch mit Schach. Opernpartie: zwei
  Brillant (13. Txd7, 16. Db8+; chess.com drei, dazu 10. Sxb5, ein Springer für zwei Bauern, den
  die Abtauschrechnung nicht als Opfer ab einer Leichtfigur zählt).
- **Befund Rechenzeit:** Bei 500 ms je Stellung unter Last (ein zweiter Stockfish lief parallel)
  bewertete die Engine eine Stellung der Opernpartie mit +2,6 statt Matt; daraus wurde „15. Lxd7+??“
  mit 7,4 und „15... Sxd7?“ als verpasst. Ein Wert, der um mindestens 3 springt und sofort
  zurückspringt, gilt jetzt als verdächtig (`ausreisser` in spiel/auswertung.ts) und wird nach dem
  ersten Durchgang mit 2 s nachgeprüft (useAuswertung.ts). Ein echter Patzer, den der Gegner nicht
  nutzt, sieht genauso aus und bekommt damit nur eine zweite, längere Rechnung.
- **Befund Stark:** Die App gab in der Opernpartie acht „!“ (jeder Zug im Mattangriff ist
  „einziger Zug“ oder „bestraft einen Fehler“), chess.com ein „Großartig“. Jetzt gibt es „stark“
  nur, solange die Stellung nach dem Zug nicht klar gewonnen ist (ab +5, dieselbe Grenze wie K5);
  das Matt 4. Dxf7# bekommt damit kein „!“ mehr.
- **Rechenzeit während der Partie:** Der Autor hat bei chess.com (Diamant) „Maximal“ statt
  „Standard“ probiert: seine Stufe-3-Partie 77,2 statt 76,1 und 68,6 statt 67,8, die drei
  Vergleichspartien ebenso um ein bis zwei Punkte; mehr Tiefe ändert die Zahlen also kaum, nur
  einzelne Fehlurteile. Weil die Auswertung während der Partie läuft, solange der Leser nachdenkt,
  rechnet sie dort jetzt 2 s je Stellung (statt 0,5 s); nach dem Ende bleiben 0,5 s, damit die
  restlichen Stellungen schnell fertig sind. Ein Auftrag des Lesers bricht die Hintergrundrechnung
  wie bisher ab.
- **Stufe-3-Partie des Autors (52 Züge, geblitzt auf 0.2.49):** chess.com 76,1 und 67,8
  (Maximal 77,2 und 68,6), die App 76 bis 79 und 76 bis 77 je Rechenlauf. Zwei Abweichungen in
  den Klassen: Weiß bekam 15 „?!“ in klar gewonnener Stellung (chess.com zwei), weil K5 jeden
  Verlust ab 0,5 dort als „ungenau“ zählte, obwohl die Gewinnchance bei +8 kaum sinkt; jetzt
  gibt es in klar gewonnener Stellung (ab +5 nach dem Zug) „?!“ erst ab 3 Verlust, darunter
  „gut“ (auch in der Engine-Karte, zeichenFuer). Und die Engine bekam acht „!“ (chess.com null),
  weil in verlorener Stellung jeder Zug, der nicht sofort noch mehr verliert, „einziger Zug“ ist;
  „stark“ gibt es jetzt nur, solange die Stellung nach dem Zug nicht entschieden ist (ab ±5).
  Danach: Weiß ungenau 2, verpasst 3, Patzer 1 (chess.com 2, 3, 1); Schwarz Fehler 7, verpasst
  4 (chess.com 8, 4).
- **S18 umgesetzt:** Die geschätzte Spielstärke kommt aus der Genauigkeit (Stützstellen 100 → 2900,
  97 → 2700, 95 → 2500, 90 → 2200, 85 → 1900, 80 → 1600, 75 → 1400, 70 → 1200, 60 → 900, 50 → 600,
  darunter 500; Erfahrungswerte aus den Durchschnitten bei Lichess und chess.com). Beispielpartie
  des Autors: 2100 und 1450 statt 2250 und 1700. Die Elo-Wertung (spiel/wertung.ts) nutzt die neue
  Zahl ab der nächsten gewerteten Partie; gespeicherte Wertungspunkte bleiben.
- **T4 umgesetzt:** `pipeline/trainer/falle.py` zieht zusätzlich jeden Schlag mit Fragezeichen aus
  den Zugfolgen der Kapitel 2 und 3 (alle Äste), prüft ihn mit der Engine (Falle ab 1,5) und
  lässt Doppelte zu den Fallenchecks weg; Herkunft „buch“ mit Beispiel und der letzten Abbildung
  davor. Neue Option `--bisherige`: ohne die lokale Lichess-Datei bleiben die 120 Lichess-Aufgaben
  aus der vorhandenen falle.json erhalten. Buchaufgaben jetzt 17 statt 12.
- **Offen geblieben (eigene Arbeitspakete):** R4 (Stufen 1 bis 3 menschlicher: gewichtete Zugwahl,
  Tiefengrenze, Fehlerneigung nach Lage, mit der Messung aus AP 11) folgt als Nächstes; U12
  (Leerfälle der Werkzeuge) und W9/W10 (Texte aus AP 14) liegen bei Opus beziehungsweise warten
  auf die Texte.

## Genauigkeit und Zugklassen wie bei chess.com (17.10.2026, Autor und Fable, Version 0.2.50)

Anlass: Der Autor verglich die Auswertung seiner Partie gegen Stufe 5 (1. d4 Sf6 2. Lg5 Sh5? 3. Sf3?
Sf4?? 4. e3?? … 37. Tb1#) mit dem Game Review von chess.com: dort Genauigkeit 86,8 und 80,3, bei
uns 97 % und 93 %; dort für Weiß 0 Patzer und 2 „Verpasst“, bei uns 1 Patzer (4. e3) und 1
Verpasst; „Beste Züge 15 von 37“ neben „Bester Zug 26“; Platzhalter „{brillant}“ in der Zeile
„Zeichen“. Frage: Rechnet chess.com nicht tief genug?

- **Rechentiefe ist nicht die Ursache.** Nachgerechnet mit Stockfish 19 lite bei 500 ms je
  Stellung (wie die App, Tiefe 15 bis 20) und bei 3 s (Tiefe 20 bis 25): Werte, Verluste und
  Zeichen sind praktisch gleich (3... Sf4 −6,3 / −6,3, 4. e3 −6,0 / −5,9, 6... Sg5 −6,0 / −5,6).
  chess.com rechnet eher tiefer als die App, kommt aber zu denselben Werten. Die Rechenzeit bleibt
  bei 500 ms.
- **Genauigkeit** (`spiel/genauigkeit.ts`): Die App nahm das einfache Mittel der Zuggenauigkeiten;
  dreißig fehlerfreie Züge in gewonnener Stellung glichen den Fehler aus, der die Partie entschied.
  Jetzt wie bei Lichess (offen dokumentiert): Mittel aus dem gewichteten Mittel (Gewicht = Schwankung
  der Gewinnwahrscheinlichkeit in einem Fenster um den Zug, 0,5 bis 12; Fenster ein Zehntel der
  Züge, 2 bis 8) und dem harmonischen Mittel (Zuggenauigkeit mindestens 1). Ergebnis für die
  Partie: 88 % und 76 % (chess.com 86,8 und 80,3; chess.com ist zur verlierenden Seite etwas
  milder, weil es Verluste in schon verlorener Stellung kaum zählt). Dieselbe Rechnung je Phase.
- **Verpasst vor Patzer** (`spiel/auswertung.ts`, `klasseVon`): Nach einem Fehler des Gegners
  (ab 1,2) ist ein Zug mit Verlust ab 0,5 „verpasst“, auch bei großem Verlust, solange er
  höchstens zurückgibt, was der Gegner geschenkt hat (man steht nicht schlechter als vor dessen
  Fehler). 4. e3 ist damit „verpasst“ mit „?“ wie bei chess.com; wer mehr zurückgibt, bleibt beim
  Patzer. „Grobe Patzer“ in der Auswertung nennt den Zug weiter (Verlust über zwei Bauern).
- **Bester nur der Zug der Engine:** Die Klasse „bester“ galt auch für gleichwertige Züge (unter
  0,05 Verlust), die Zeile „Beste Züge“ zählte nur den Zug der Engine; daher 26 neben 15. Jetzt
  ist „bester“ nur der Zug der Engine, gleichwertige Züge sind „sehr gut“ (chess.com „exzellent“);
  die Rückblickkarte sagt dann „… ist so gut wie Sf3, der Zug der Engine.“ Für die Partie:
  Bester 13, Sehr gut 21 (chess.com 13 und 17).
- **Platzhalter:** Die Zeile „Zeichen“ bekam den Wert für „!!“ nicht übergeben; behoben.
- **Nicht geändert:** Die Klassengrenzen bleiben in Bauerneinheiten (Konzept 8.3; Einsteiger
  verstehen „kostet einen Bauern“ besser als Gewinnchancen), die geschätzte Spielstärke bleibt beim
  Verlust je Zug (Rückfrage S18 mit Empfehlung), die Regel K5 (noch klar gewonnen → höchstens „?!“)
  bleibt; für die verlierende Seite gibt es keine Milderung (ein hängender Läufer ist für den
  Lernenden ein Patzer, chess.com sagt „gut“).

## AP 13: Endspieltrainer (17.10.2026, Fable, Zweig `endspieltrainer`, Version 0.2.49)

Auftrag des Autors: Trainer „endspiel“ (Kapitel 8 und 9) auf eigenem Zweig, parallel zu Opus
(Repertoire, Zielbilanz, Faktorenbilanz, 0.2.47); unberührt blieben spiel/auswertung.ts,
spiel/wertung.ts, analyse/skelett.ts, analyse/k5-richtung.ts, training/wiederholung.ts,
speicher/fortschritt.ts.

- **Daten** (`pipeline/trainer/endspiel.py` → `inhalte/de/trainer/endspiel.json`, Schema
  `trainer-endspiel.schema.json`, `trainer-gemeinsam` um „endspiel“ erweitert): 80 Kandidaten aus
  den Abbildungen der Kapitel 8 und 9 mit Thema und Stichwort (Liste im Skript); die Engine
  (Stockfish 19 lite, Tiefe 18) entscheidet Seite und Ziel: Gewinn ab +2,0, Remis bis ±0,8,
  dazwischen ausgelassen. Erste Fassung mit allen Zügen in Tiefe 24 brauchte für fünf
  Mattführungen 17 Minuten; jetzt eine Hauptvariante in Tiefe 18 und „einziger Zug“ mit allen
  Zügen in Tiefe 12 (eine Minute für alles). Kein Buchtext, keine Merksätze in den Daten.
- **Befunde** (Rückfrage X1): 9.41 unklar (+1,05, Theorie Remis), 9.23 Buch „Txa7 gewinnt“
  gegen Engine Remis (+0,25), beide ausgelassen; 8.25 und 8.26 laut Engine Remis (Schwarz hält).
  9.40: Seite per Vorgabe (Schwarz muss den Bauern aufhalten), weil die Regel „ärmere Seite hält“
  dort die falsche Seite träfe.
- **Ablauf** (`ui/trainer/useEndspielpartie.ts`): Leser zieht, Engine antwortet mit voller
  Stärke (1,2 s); derselbe Auftrag liefert den Wert aus Sicht des Lesers. Kippen
  (`training/endspieltrainer.ts`, `gekippt`): Gewinn unter gewinnAb − 0,5, Remis unter
  −(remisBis + 0,7); dann „verfehlt“ mit dem besten Zug der vorigen Stellung als „Gehalten hätte
  …“. Erreicht: Matt, Umwandlung bei gehaltener Gewinnstellung, Remis im Remisziel, zwölf
  gehaltene eigene Züge (`HALTEN_ZUEGE`). Ist der Leser am Zug, rechnet die Engine 0,7 s den
  besten Zug für die Hilfen (Hinweis 2 goldene Figur, Hinweis 3 goldener Pfeil); Hinweis 1 ist
  der Merksatz zum Thema plus Stichwort (`endspiel.merksatz.*`, `endspiel.stichwort.*` in
  de.json, Claudes Worte). „Aufgabe abbrechen“ zählt falsch. Richtig nur ohne Hilfe.
- **Rahmen:** `Rundenablauf`, `Rundenrahmen`, `useRunde`, `Stufenwahl` wiederverwendet; sechs
  Aufgaben je Runde; Gruppen Alles, Mattführung, Bauernendspiele, Turmendspiele, Dame gegen
  Bauer, Leichtfiguren. `Trainer.tsx` nur um eine Zeile in EIGENE_BEREICHE ergänzt,
  `training/trainer.ts` „endspiel“ fertig.
- **Tests:** `training/endspieltrainer.test.ts` (Runde, Kippen, Ergebnis),
  `training/endspiel.engine.test.ts` (echte Engine bestätigt fünf Stellungen),
  `pipeline/tests/test_trainer_daten.py` (Schema, Spielbarkeit, Wert passt zum Ziel), e2e in
  `trainer.spec.ts` (Mattführung Stufe 1, Merksatz, Abbrechen).

## Zielbilanz-Übung, Faktorenbilanz- und Repertoire-Trainer (Opus, 17.10.2026, Version 0.2.48)

- **Zielbilanz-Übung** (`training/zielbilanztrainer.ts`): Buchstellungen der Kapitel 2 und 3
  mit Zugnummer 6 bis 20 und beiden Königen; ohne angegriffene Zentrumsbauern, weil dort im
  Werkzeug erst die Engine entscheidet (C1.1). Lösung aus `schach/zielbilanz.ts`; ein Test
  vergleicht sie mit allen Bilanztabellen des Buches, die als Aufgabe taugen (Befund 2.71
  Zentrum Schwarz wie im Werkzeug). Richtig nur, wenn alle sechs Felder stimmen (Rückfrage W8).
- **Faktorenbilanz-Trainer** (`training/faktorentrainer.ts`): Buchstellungen aus Kapitel 3 mit
  Regeln, ohne Schach und ohne Matt oder Patt. Je Faktor „Weiß, gleich, Schwarz“ aus
  `faktorwertungen` (Waage für Material und Zeit, Einschätzung gut/teils/schlecht für
  Königssicherheit und Aktivität). Urteil des Buches und „annehmen oder ablehnen?“ fehlen noch
  (Rückfrage W9); der Ablauftext des Trainers sagt nur, was er kann.
- Gemeinsame Auswahlzeile `ui/trainer/Wahlzeile.tsx` mit „App: …“ nach der Antwort.
- **Repertoire-Trainer** (`training/repertoiretrainer.ts`): Eröffnungen sind die Zugfolgen
  (`beispiele`) von Kapitel 2, deren Abschnitt einen Steckbrief hat. Varianten sind alle Wege
  bis zu einem Blatt mit mindestens acht Halbzügen, gekürzt auf 24 Halbzüge, ohne Doppelte;
  höchstens sechs je Runde. Falscher Zug oder „Zug zeigen“: goldener Pfeil, der Leser zieht nach,
  die Variante zählt als falsch. Warum-Fragen fehlen bis zu den freigegebenen Texten (W10).

## Studien lösen und Zug erraten (Opus, 17.10.2026, Version 0.2.53)

- `training/studientrainer.ts`: Hauptvariante (je Knoten die erste Fortsetzung) der Zugfolgen
  aus den Abschnitten eines Kapitels (`abschnitt` beginnt mit der Kapitelnummer, also ohne
  Übungen). Studien: Kapitel 10, ab 3 Halbzügen, Seite am Zug der Startstellung, Ablauf wie im
  Repertoire-Trainer (Buchzug finden, Pfeil bei Fehler). Abweichung vom Pflichtenheft: Die App
  antwortet mit dem Buchzug statt dem stärksten Engine-Zug; die „vier Prüfungen“ als Erinnerung
  fehlen (kein erfundener Wortlaut). Rückfrage W11.
- Zug erraten: Kapitel 11, ab 30 Halbzügen; Partie und Seite wählt der Leser (der Sieger steht
  nicht in den Daten). Jeder eigene Zug wird geraten, dann der Partiezug gesetzt; gut geraten ab
  der Hälfte. Ohne Drei-Minuten-Uhr und ohne Satz zum Abweichen. Rückfrage W12.
- Der Platzhalter-Test „folgt mit einem Update“ prüft jetzt die Planbilanz.

## Nachlesen im Buch zu allen Rückfragen (Opus, 17.10.2026, Version 0.2.55)

Wunsch des Autors: Bei jedem offenen Punkt, der Buchinhalte berührt, im aktuellen Buchstand
nachlesen, ob das Buch die Frage schon klärt (Anlass: Abb. 9.23, das Buch nennt dort keinen
Gewinn). Ergebnis je Rückfrage in `docs/AUFGABEN_AUTOR.md` („Nachgelesen im Buch“). Umgesetzt:

- **X1:** 9.23 Remisaufgabe für Weiß; 9.41 nach dem Urteil des Buches (`Kandidat.buch`, gilt nur,
  wenn die Engine unklar bleibt), Remisaufgabe für Schwarz; Pipeline-Test lässt das zu.
- **X2:** 9.42 hält Schwarz (das Buch nennt den weißen Läufer im Vorteil).
- **X4:** Merksätze Zugzwang und verbundene Freibauern nach Kapitel 8.
- **C1:** König im Schach mit genau einem legalen Zug heißt „schlecht“ (`imSchachEinzig`,
  `Koenigsumgebung.abwehrzuege`); Abb. 3.68.
- **C2:** Ein Verteidiger gegen ein Matt zählt nur, wenn er nach dem Mattzug legal ziehen darf
  (`aufgaben.ts`, `wehrtMattAb`); Abb. 4.21: nur g2.
- **C5:** Dauerschach auch bei Wiederholung der Stellung durch Schachs (`schach/dauerschach.ts`);
  Abb. 9.34.
- **T1:** Statt der Engine-Vorschläge nur vom Buch gestützte Alternativen
  (`uebungsaufgabe.ts`, `zusaetzlichAkzeptiert`): Übung 6 Lb4+, 15 Sf6, 83 Te1.
- **U6:** Englische Figurenbuchstaben richtig mit Hinweis (Kapitel 0: „Nf3 … dasselbe wie Sf3“).
- **W6/T5:** Plan-Sätze nach Kapitel 5; 5.43, 5.44 und 11.70 nach der Skelettfolgerung
  (`pipeline/trainer/struktur.py`, `BUCHFOLGERUNGEN`). Die Schlüssel `isolaniVorstossen`,
  `haengendeVorstossen` und `doppelbauerAufloesen` heißen weiter so, meinen jetzt aber den Plan
  des Besitzers nach dem Buch (aktiv spielen, zusammenhalten, Figuren behalten).
- **W11:** Die vier Prüfungen aus Kapitel 10 als Erinnerung über den Studien.
- **E3:** Startseite „in Richtung Elo 2000“ (Kapitel 0, Kapitel 12).
- Bestätigt ohne Änderung: S8 (Kapitel 9 kennt das Damenendspiel), U7, T4, K4, C6, C7, C9.
- Offen beim Autor: S17 und C3 (Glossar „beide entwickelt und rochiert“ gegen die gewählte
  Lesart), W5 und U5 (Umbau nach Zustimmung), D1 (Bestätigung).

## Rückmeldung des Autors zu 0.2.56 (17.10.2026 abends, Opus, Version 0.2.61)

Der Autor hat X, S, R, W und U durchgesehen. Angenommen wie empfohlen, mit diesen Änderungen:

- **X:** alles angenommen außer X5 (Schwierigkeit), das der Autor noch testet.
- **S9:** angenommen, dazu: Eine gewertete Partie hat weder Zugrücknahme noch Spielhilfen (Symbole
  am Brett, Werkzeuge und Hinweis). Die Haken sind dann gesperrt (`Spielen.tsx`, `wirdGewertet`;
  `GegnerWahl.tsx`, `HilfenWahl`).
- **S12:** Befund des Autors: In einer aufgebauten Stellung mit zwei weißen Damen auf der Grundreihe
  zog die schwarze Engine nie. Ursache: Stockfish 19 lehnt Stellungen ab, deren Steine mehr
  Umwandlungen verlangen, als Bauern fehlen („Too many pieces“), und beendet sich. Jetzt prüft
  `spielbar` (`spiel/partie.ts`, `spiel/umwandlung.ts`), dass je Seite höchstens acht Bauern stehen
  und die Zusatzfiguren nicht mehr sind als fehlende Bauern; gespeicherte Partien lädt `ladbar` wie
  bisher. Sonst bleibt S12 wie empfohlen.
- **S13:** Toleranz des Spielstils 0,3 Bauern je Reglerstufe (statt 0,15), mit dem Hinweis in der
  App, dass ein Stil die Spielstärke deutlich senken kann (`engine/stil.ts`, `STIL_TOLERANZ`).
- **S17:** An den Abbildungen und Buchlinien gilt die Phase nach dem Glossar („Das Mittelspiel
  beginnt, sobald beide Seiten entwickelt und rochiert haben“), in eigenen Partien die Lesart vom
  17.10. (`schach/phase.ts`, `Phasenregel`; `schach/rochade.ts` liest „rochiert haben“ aus den
  Buchzügen). Die drei Stellen, an denen Glossar und Steckbriefe auseinandergehen, stehen als
  Befund D2 beim Autor (ersetzt C3).
- **R1:** erledigt, die Holzfiguren sind seit 0.2.58 Merida (Fable). Der Rest von R angenommen.
- **W5:** Der Strukturerkenner beginnt mit den starken Feldern (Leitfrage 1, Checkliste: Felder auf
  der eigenen 5. und 6. Reihe, die kein gegnerischer Bauer mehr angreifen kann), dann schwache
  Bauern, dann Plan. Mehr als vier solche Felder (Lehrbilder): Der Schritt entfällt
  (`training/strukturtrainer.ts`, `starkeFelder`).
- **W9:** Wo das Buch eine Faktorenbilanz hat, gilt im Faktorenbilanz-Trainer ihr Urteil je Faktor
  (`training/faktorentrainer.ts`, `buchloesung`; Zuordnung in `training/buchbilanzen.ts`), sonst
  die Rechnung der App; nach dem Prüfen die Warum-Fragen der Abbildung. Eine eigene Frage
  „annehmen oder ablehnen?“ gibt es nicht, weil das Buch dazu je Gambit kein Urteil in fester Form
  hat; die Warum-Fragen decken es teils ab.
- **W10:** Warum-Fragen der Abbildungen aus Kapitel 2 an den Zügen der Varianten
  (`training/repertoiretrainer.ts`, `schluesselfragen`), 20 Fragen.
- **W12:** Frage des Autors: Wozu Zug erraten, wenn man keine Meisterpartien auswendig lernen soll?
  Antwort nach Kapitel 12: Die Methode übt das eigene Entscheiden („erst selbst denken und dann
  vergleichen“) an Stellungen, in denen ein starker Spieler einen guten Plan hatte; der Lerngewinn
  liegt im Vergleich und in der Frage, warum der Meister anders zog, nicht in der Trefferzahl („Die
  Zahl sagt wenig über deine Spielstärke“). Umgesetzt: Nach einem verfehlten Zug vergleicht die
  Engine den eigenen Zug mit dem Partiezug (gleichwertig bis 0,3, sonst schwächer oder stärker),
  dazu die Frage des Buches (`training/rateurteil.ts`, `ui/trainer/useRatevergleich.ts`).
- **U5:** Sonderzüge zuerst an den Buchstellungen 0.12 bis 0.19, die eigenen Stellungen nur für
  en passant mit Schwarz und Umwandlung mit Schlag, etwa jeder vierte Sonderzug
  (`training/koordinatentrainer.ts`, `BUCHSONDERZUEGE`).
- **U:** alles angenommen außer U12 (der Autor sieht noch einmal hin).

### Die erledigten Rückfragen im Wortlaut zur Zeit der Entscheidung

- [x] X1. **Stellungen:** 78 Abbildungen aus Kapitel 8 und 9, jede mit Stockfish geprüft (Tiefe
      18, einziger Zug in Tiefe 12). Gewinn ab +2,0 für den Leser, Remis bis ±0,8; alles
      dazwischen fällt weg. Weggefallen: Abb. 9.41 (falscher Läufer mit h-Bauer; die Engine sieht
      in Tiefe 18 nur +1,05 statt des klaren Remis) und Abb. 9.23 (Turm auf der 7. Reihe: Das
      Buch nennt 1. Txa7 gewinnend, die Engine sieht nur +0,25, also Remis; bitte prüfen, ob das
      Buch dort einen Gewinn verspricht, den es nicht gibt, oder die Engine zu flach rechnet).
      Zwei weitere Befunde: Abb. 8.25 (Bauer e4, König e2 gegen König e8, Weiß am Zug) und 8.26
      (Bauer e5, König c3 gegen König c8) sind laut Engine Remis, obwohl beide die Schlüsselfelder
      zeigen; im Trainer hält dort Schwarz. Passt das zum Buch? **Empfehlung:** 9.23 und 9.41
      draußen lassen, bis du sie angesehen hast; 8.25 und 8.26 als Remis-Aufgaben lassen (die
      Schlüsselfelder lehren gerade, dass Weiß ohne sie nicht gewinnt).
      **Nachgelesen im Buch (17.10.2026):** 9.23: Das Buch sagt nur, dass Weiß mit Txa7 den Bauern
      zurückgewinnt (Schwarz hat vorher einen Bauern mehr), nicht dass Weiß gewinnt. Buch und
      Engine (Remis) stimmen also überein; 9.23 ist jetzt eine Remisaufgabe für Weiß, und der beste
      Zug der Engine ist 1. Txa7 wie im Buch. 8.25 und 8.26: Das Buch zeigt dort nur, wo die
      Schlüsselfelder liegen, nicht dass Weiß sie erreicht; erst 8.27 und 8.28 zeigen das
      Erreichen. Kein Befund, beide bleiben Remisaufgaben für Schwarz. 9.41: Das Buch sagt „remis“
      (falscher Läufer); Stockfish ohne Endspieldatenbank zeigt etwa +1, bleibt beim Ausspielen
      über 14 Zugpaare aber unter +1 (wie du es bei chess.com gesehen hast). Ist die Engine unklar,
      gilt jetzt das Urteil des Buches; 9.41 ist eine Remisaufgabe für Schwarz. Schon umgesetzt in
      0.2.55 (Nachtest N269), Widerspruch genügt.

- [x] X2. **Wer spielt:** Bei Gewinnaufgaben die gewinnende Seite. Bei Remisaufgaben die Seite,
      die halten muss: die mit weniger Material, bei gleichem Material die am Zug; eine Ausnahme
      ist Abb. 9.40 (Springer gegen Bauer: Schwarz muss den Bauern aufhalten). Ist die andere
      Seite am Zug, zieht die Engine zuerst. **Empfehlung:** so lassen.
      **Nachgelesen im Buch (17.10.2026):** 9.40 bestätigt (kap09: „Schwarz am Zug hält remis“).
      Neu: In 9.42 (Läufer gegen Springer, gleiches Material) hätte nach der Regel Weiß halten
      müssen; das Buch nennt aber gerade den weißen Läufer „im Vorteil“. Jetzt hält Schwarz mit dem
      Springer. Schon umgesetzt in 0.2.55, Widerspruch genügt.

- [x] X3. **Ziel erreicht oder verfehlt:** Erreicht bei Matt, bei Umwandlung mit weiter gewonnener
      Stellung („der Rest ist Technik“), bei Remis (Patt, Material, 50 Züge, Wiederholung) im
      Remisziel und nach zwölf gehaltenen eigenen Zügen. Verfehlt, wenn die Stellung laut Engine
      kippt: Gewinn unter +1,5, Remis unter −1,5 (die Grenzen aus der Prüfung mit 0,5 bzw. 0,7
      Spielraum, weil die Engine bei 1,2 Sekunden je Zug schwankt). Dann nennt die Karte den Zug,
      der gehalten hätte (den besten Zug der vorigen Stellung). **Empfehlung:** so lassen; sind
      zwölf Züge zu lang, auf acht kürzen.

- [x] X4. **Hilfen und Merksätze:** Hinweis 1 Merksatz zum Thema (14 Themen: Matt mit Dame,
      Turm, Läuferpaar; Opposition; Schlüsselfelder; Quadrat; Bauernrennen; Durchbruch; Freibauern;
      Zugzwang; Randbauer; Turmendspiel; Dame gegen Bauer; Leichtfiguren) plus Stichwort
      (Philidor, Lucena, Vancura, Abschneiden, kurze Seite, Patt, Unterverwandlung, falscher
      Läufer, ungleichfarbig, Springer, Kasten, Fern- und Diagonalopposition, Dreieck, entfernter
      und verbundener Freibauer, Mehrheit, Turm hinter dem Freibauern, 7. Reihe); Hinweis 2 die
      goldene Figur; Hinweis 3 der goldene Pfeil (der Zug der Engine). Die Merksätze sind Claudes
      Worte, kein Buchtext; sie sollen zur Lehre des Buches passen. **Empfehlung:** in der App
      lesen (N255) und Formulierungen, die nicht zu Kapitel 8 und 9 passen, mit Wortlaut melden.
      **Nachgelesen im Buch (17.10.2026):** Die Merksätze passen zu Kapitel 8 und 9 (Opposition,
      Schlüsselfelder, Läuferpaar, Bauernrennen, Philidor, Dame gegen Bauer, Turm hinter dem
      Freibauern, Randbauer). Zwei waren unscharf und sind jetzt nach dem Buch formuliert: Zugzwang
      („wer ziehen muss, verschlechtert mit jedem Zug seine Stellung“ statt „verliert“) und
      verbundene Freibauern („der hintere deckt den vorderen; schlägt der König den hinteren, läuft
      der vordere durch; erst den König heranführen“). Schon umgesetzt in 0.2.55.

- [x] X6. **Umfang der Runde:** sechs Stellungen (statt acht), weil ein Endspiel länger dauert;
      die Engine rechnet 1,2 Sekunden je Zug mit voller Stärke, der Hilfezug 0,7 Sekunden.
      **Empfehlung:** so lassen.

- [x] S3. **Spielstärke je Phase** rechnet ab sechs Zügen je Phase (gesamt ab zehn). So lassen?
      **Empfehlung:** so lassen. Unter sechs Zügen bestimmt ein einzelner Patzer den Durchschnitt;
      die Schätzung würde von Partie zu Partie springen.

- [x] S7. **Die 18 Gegner mit Persönlichkeit** (Stufen Eröffnung · Mittelspiel · Endspiel nur
      hier für dich, in der App verborgen; dann erlaubte Fehlerarten und blinde Flecken): Lotta
      1·1·1, alle Fehlerarten, ruhige Züge; Paula 1·1·2, grobe Fehler, Diagonalen und Rückzüge;
      Max 1·2·1, Dame früh, Bauernraub, Figur hängen, Tempoverlust, Rückzüge; Opa Hans 2·1·2,
      Figur hängen, Schlagreflex, König in der Mitte, passiver König, Bauernvorstoß, Springer
      rückwärts; Onkel Rudi 2·2·1, Schlagreflex, Bauernraub, Dame früh, Drohung ignoriert, Abzüge;
      Frieda 2·2·3, Drohung ignoriert, Schlagreflex, Königsschild, falscher Abtausch, ungenau,
      Diagonalen; Herr Lehmann 3·2·2, König in der Mitte, Tempoverlust, passiver König, Figur
      hängen, Patt, lange Damen- und seitliche Turmzüge; Selin 3·3·2, Königsschild, Bauernvorstoß,
      passiver König, ungenau, lange Damenzüge; Nina 3·3·3, Taktik übersehen, Drohung ignoriert,
      ungenau, Abzüge; Jonas 2·3·4, Bauernraub, Schlagreflex, Königsschild, Taktik übersehen,
      stille Bauernzüge; Benno 4·4·4, Taktik übersehen, ungenau, ruhige Züge und Springer
      rückwärts; Timo 5·4·3, Taktik übersehen, falscher Abtausch, Bauernvorstoß, ungenau, Rückzüge
      und Diagonalen; Kurt 4·5·5, Königsschild, falscher Abtausch, ungenau, Springer rückwärts;
      Frau Ortega 5·5·4, ungenau, Rückzüge; Lena 6·6·5, keine Fehler, ruhige Züge; Viktor 7·6·6,
      keine Fehler, Abzüge und stille Bauernzüge; Doktor Berg 6·7·7, keine Fehler, seitliche
      Turmzüge; Großmeister Grün 8·8·8, nichts. Seit 0.2.57 dazu: Paula und Opa Hans die
      Grundreihe, Frieda Röntgenangriffe, Timo und Lena Zwischenzüge. Fehlerarten wirken nur in
      Stufe 1 bis 4, blinde
      Flecken in jeder Stufe (er übersieht einen besten Zug dieser Art zu 70 %, Ersatz höchstens
      eine Leichtfigur schlechter). Namen, Stufen, Listen oder Sätze ändern? Die allgemeine
      Abhakliste der Fehlerarten gibt es seit 0.2.60 in den Einstellungen (N284); sie beschneidet
      die Listen der vorgefertigten Gegner, eigene Gegner haben sie je Gegner.
      **Empfehlung:** so lassen und erst nach ein paar Partien (N241, N242) nachjustieren.

- [x] S8. **Zusatzregel für die Phase** (deine Frage S2, Recherche): Eine allgemeingültige
      Grenze gibt es nicht; die Lehrbücher setzen das Mittelspiel, sobald die Entwicklung
      abgeschlossen und der König in Sicherheit ist (das deckt sich mit dem Buch). Fürs Endspiel
      gilt verbreitet Speelman: jede Seite höchstens 13 Punkte an Steinen außer dem König (Bauer
      1, Leichtfigur 3, Turm 5, Dame 9); daneben „die Könige können aktiv werden“ (deine vierte
      Frage) und „die Damen sind getauscht“. Eingebaut ist eine Zusatzregel, die nur greift, wenn
      das Buch nichts anderes sagt, und die das Werkzeug „Phase“ ausdrücklich als „Zusatzregel
      (nicht aus dem Buch)“ nennt: Endspiel, sobald jede Seite höchstens 13 Punkte hat, auch mit
      Damen (Damenendspiel). Die Regel nach der Zugzahl ist auf deinen Wunsch gestrichen. Die
      Regeln des Buches (zwei Leichtfiguren zu Hause, die vier Endspielfragen) bleiben vorrangig.
      Passt die Zahl 13?
      **Empfehlung:** 13 lassen. Das ist Speelmans verbreitete Grenze; 12 oder 14 verschieben nur
      wenige Grenzfälle, und die Regeln des Buches gehen ohnehin vor.
      **Nachgelesen im Buch (17.10.2026):** Kapitel 8 sagt „Mit Damen ist es fast immer noch
      Mittelspiel“, und Kapitel 9 spricht selbst vom „Damenendspiel“ (Abb. 9.34, Erkennungstabelle
      „Dame gegen Dame“). Die Regel „auch mit Damen“ widerspricht dem Buch also nicht; die Zahl 13
      steht nicht im Buch und bleibt als Zusatzregel gekennzeichnet. Empfehlung bestätigt.

- [x] S9. **Wertung nach Elo:** Die erste gewertete Partie setzt die Wertung auf die Schätzung der
      Engine für dich; jede weitere zählt wie eine Partie gegen einen Spieler mit der Schätzung der
      Engine in dieser Partie (ihrer tatsächlichen Stärke, nicht der Stufe), mit K = 32 in den
      ersten zehn Partien und danach K = 20 (wie beim Weltschachbund unter 2400). Es zählen nur
      Partien gegen die Engine aus der Grundstellung (dein Wunsch; nichts aus Abbildungen oder
      aufgebauten Stellungen). Partien mit weniger als zehn eigenen Zügen haben keine Schätzung
      und zählen nicht; Partien mit Rücknahmen zählten bis 0.2.46 (seit 0.2.47 nicht mehr, siehe unten). Alternativen, falls dir das zu
      sprunghaft ist: (a) die Wertung als gleitender Durchschnitt der Schätzungen der letzten zehn
      Partien, ohne Sieg und Niederlage; (b) Glicko (Elo mit Unsicherheit, die mit jeder Partie
      sinkt). Empfehlung: Elo lassen, weil Sieg und Niederlage zählen sollen. Sollen Partien mit
      Rücknahmen ungewertet sein?
      **Empfehlung zu den Rücknahmen: Partien mit Rücknahme ungewertet lassen. Wer einen Patzer
      zurücknehmen kann, spielt stärker, als er ist; Lichess und chess.com werten solche Partien aus
      demselben Grund nicht.
      **Schon umgesetzt in 0.2.47 (Nachtest N244): Partien mit Rücknahme zählen nicht. Widerspruch
      genügt.**

- [x] S10. **Ausschnitte der Kurve:** letzte 10, 25 oder 50 Partien; 1 Woche, 4 Wochen, 3 Monate,
      halbes Jahr, 1 Jahr; Vorgabe „letzte 25 Partien“. Bei den Zeiträumen liegt jede Partie an
      ihrer Zeit, der rechte Rand ist jetzt. Andere Stufen oder Vorgabe?
      **Empfehlung:** so lassen. 25 Partien zeigen einen Trend, ohne dass eine einzelne Partie die
      Kurve kippt.

- [x] S11. **Zu zweit:** Das Brett bleibt aus der Sicht der Seite, die beim Start am Zug war; drehen
      geht mit dem Schalter am Brett. Soll es sich nach jedem Zug von selbst drehen? Partien zu
      zweit sind nie gewertet, ohne Gegnerwahl und ohne Eröffnungsvorgabe; Symbole und Werkzeuge
      gelten für die Seite am Zug.
      **Empfehlung:** nicht von selbst drehen. Am Tisch sitzen sich zwei Spieler meist gegenüber und
      legen das Handy dazwischen; ein Brett, das sich bei jedem Zug dreht, verwirrt dann beide. Der
      Schalter reicht.

- [x] S12. **Stellung aufbauen:** Beliebig viele Steine (dein Wunsch), Rochaderechte ergeben sich
      von selbst (König und Turm auf den Startfeldern), kein En passant, Zugzähler beginnt bei 1;
      übernehmen geht nur, wenn sich eine Partie spielen lässt (beide Könige genau einmal, die
      Seite ohne Zugrecht nicht im Schach, keine Bauern auf der ersten oder letzten Reihe, kein
      Matt oder Patt). Passt das?
      **Empfehlung:** so lassen. En passant und Zugzähler braucht man beim Aufbauen fast nie; wer
      sie braucht, nimmt „Eigene Stellung eingeben (FEN)“.

- [x] S13. **Spielstil eigener Gegner:** Umsetzung deines Vorschlags: Der Gegner holt bei Stil
      ungleich 0 vier Kandidaten der Engine (mit der Stärke seiner Stufe) und wählt unter denen,
      die höchstens 0,15 Bauerneinheiten je Reglerstufe hinter dem besten liegen (bei „sehr
      aggressiv“ also 0,3), den mit den meisten Stilpunkten: aggressiv je ein Punkt für ein
      Zielfeld in deiner Bretthälfte und im Viertel deines Königs, ein halber für einen Schlag und
      für ein Schach; defensiv je ein Punkt für die eigene Hälfte und das Viertel des eigenen
      Königs, ein halber für „kein Schlag“. Bei Gleichstand der bessere Zug. Der Stil kostet so
      nie mehr als eine kleine Ungenauigkeit je Zug und ändert die Stärke kaum. Alternative mit
      mehr Wirkung: die Toleranz auf 0,3 je Stufe erhöhen (dann spielt ein sehr aggressiver
      Gegner spürbar schlechter, etwa eine halbe Stufe). Passt die sanfte Fassung?
      **Empfehlung:** die sanfte Fassung lassen. So bleiben die gemessenen Stufen aus AP 11 gültig;
      die stärkere Fassung würde jeden Stil-Gegner schwächer machen, ohne dass die Stufe es sagt.

- [x] S14. **Eigene Gegner, Grenzen:** höchstens 20 eigene Gegner, Namen bis 24 Zeichen,
      Vorgabe beim Anlegen Stufe 3 · 3 · 3, alle Fehlerarten, ausgeglichen. Fehlerarten wirken nur
      in Stufe 1 bis 4 (darüber gibt es keine absichtlichen Fehler); eine Abhakliste je Stufe gibt
      es damit für eigene Gegner, die allgemeine Abhakliste aus S7 seit 0.2.60 in den
      Einstellungen (N284). Reicht das?
      **Empfehlung:** reicht so.

- [x] S15. **Kurve je Phase:** Die Ansicht „Eröffnung/Mittelspiel/Endspiel“ zeigt nicht die Elo-
      Wertung (die gibt es nur je Partie), sondern die Schätzung der Engine für dich in dieser
      Phase je gewerteter Partie, und als Zahl den Durchschnitt im Ausschnitt. Partien ohne sechs
      eigene Züge in der Phase fehlen dort. So gemeint, oder lieber ein gleitender Durchschnitt
      als Linie?
      **Empfehlung:** so lassen. Ein gleitender Durchschnitt glättet bei den wenigen Partien je
      Phase so stark, dass Fortschritte kaum zu sehen sind; der Durchschnitt als Zahl steht ohnehin
      daneben.

- [x] S17. **Abb. 11.4 wechselt die Phase** (Befund aus der neuen Lesart „eine Seite
      entwickelt“): Die Opernpartie ist im Buch „Eröffnung bis Mattangriff“. Abb. 11.1 bis 11.3
      bleiben Eröffnung, aber Abb. 11.4 (nach 9… b5, Weiß am Zug, 10. Sxb5 beginnt den
      Mattangriff) sagt die App jetzt „Mittelspiel: Weiß ist entwickelt (höchstens eine
      Leichtfigur noch auf dem Startfeld); der Entwicklungsrückstand der anderen Seite ist ein
      Mittelspielthema.“ Weiß hat dort alle Leichtfiguren im Spiel, Schwarz noch Sb8 und Lf8 zu
      Hause. Vorher stand bei allen vier Abbildungen „Eröffnung“. Alle anderen Abbildungen aus
      Kapitel 1, 8, 11 und 12 behalten ihre Phase (Anderssen 11.22 bis 11.24 bleiben Eröffnung).
      Ich finde das stimmig („bis Mattangriff“: Hier beginnt er), melde es aber, weil das Buch die
      Partie als Eröffnung führt. Passt das, oder soll 11.4 Eröffnung bleiben (dann bräuchte die
      Lesart eine Ausnahme, etwa „eine Seite entwickelt zählt erst nach dem ersten Figurentausch“)?
      **Empfehlung:** so lassen (siehe oben). Eine Ausnahme nur für 11.4 würde die Regel für alle
      anderen Partien unklarer machen.
      **Nachgelesen im Buch (17.10.2026):** Das Glossar sagt: Das Mittelspiel beginnt, „sobald
      beide Seiten entwickelt und rochiert haben“; ebenso Kapitel 3 („spätestens wenn beide Seiten
      entwickelt und rochiert sind, also wenn das Mittelspiel beginnt“), Kapitel 6 und 12. In 11.4
      hat Weiß noch nicht rochiert (erst 12. O-O-O), Schwarz ist kaum entwickelt: nach dem Buch
      also Eröffnung. Deine Lesart vom 17.10. („eine Seite entwickelt“, Rochade spielt keine Rolle)
      weicht davon ab. Ich ändere sie nicht ohne dich, weil du sie bewusst gewählt hast (Anfänger
      lassen gern eine Figur zu Hause). **Neue Empfehlung:** für die Abbildungen des Buches die
      Regel des Glossars (beide entwickelt und rochiert), für eigene Partien deine Lesart behalten;
      oder einheitlich das Glossar. Sag, was dir lieber ist.

- [x] S18. **Geschätzte Spielstärke bleibt beim Verlust je Zug** (deine Partie: „etwa 2250“ für
      dich trotz 4. e3). Die Zahl kommt aus dem durchschnittlichen Verlust in Bauern je Zug, und
      der ist mit 0,2 klein, weil dreißig fehlerfreie Züge in gewonnener Stellung den einen
      großen Verlust verdünnen (Lichess rechnet seinen „Verlust je Zug“ genauso). Die Genauigkeit
      zählt seit 0.2.50 den Fehler stärker (N257). Soll auch die geschätzte Spielstärke aus der
      neuen Genauigkeit kommen (deine Partie läge dann grob bei 1900 statt 2250), oder beim
      Verlust je Zug bleiben? **Empfehlung:** aus der Genauigkeit ableiten, mit einer neuen
      Tabelle (etwa 95 % → 2500, 90 % → 2200, 85 % → 1900, 80 % → 1600, 70 % → 1200, 60 % →
      900), sobald du nach ein paar Partien sagst, ob dir die Genauigkeit plausibel vorkommt.
      **Schon umgesetzt in 0.2.51 (Nachtest N260), auf deinen Wunsch vom 17.10.2026 nachmittags,
      Empfehlungen gleich umzusetzen. Widerspruch genügt.**

- [x] S19. **Brillant: streng oder großzügig?** Am Prüfstand mit 100 Brillant-Zügen aus
      chess.com-Partien erkennt die App seit 0.2.59 59 Züge, mit 19 Fehlalarmen in 100 Partien
      (einer je fünf Partien; 0.2.54: 46 bei 25). Eine großzügigere Fassung (auch eine schon
      angegriffene Figur, die man beim Zug stehen lässt, zählt als Opfer) erkennt 81, gibt aber 59
      Fehlalarme (einer je zwei Partien). chess.com selbst gibt null Fehlalarme (es ist der
      Maßstab). **Empfehlung:** streng lassen. Ein grundlos vergebenes „!!“ lehrt den Leser
      Falsches, ein verpasstes schadet nicht; die freien Werkzeuge im selben Vergleich liegen bei
      23 bis 45 Treffern. **Schon so umgesetzt in 0.2.54 und 0.2.59 (Nachtests N268, N283).
      Widerspruch genügt.**

- [x] R1. **Holzfiguren:** Vorbild ist dein Bild (chess.com, Design „Dunkles Holz“): helle
      Figuren elfenbeinfarben, dunkle fast schwarz mit warmem Braunton. Die Formen bleiben die
      von Colin Burnett (die Figuren von chess.com sind nicht frei); die Farben sind `#EEE1C6`
      und `#2E2119` mit dunklem Rand (durch Umfärben erzeugt). Passt
      das (N201)? Andere Werte sind in Minuten geändert.
      **Empfehlung:** so lassen und bei N201 nur prüfen, ob die dunklen Figuren auf dunklen Feldern
      gut genug zu sehen sind.

- [x] R2. **„!“ (U10 damit umgesetzt):** „!“ bekommt ein Zug, der der beste der Engine war und
      mindestens 1,2 Bauern vor dem zweitbesten lag (dieselbe Regel wie in der Engine-Karte).
      Dafür bewertet die Auswertung jede Stellung jetzt mit zwei Varianten (gleiche Rechenzeit,
      etwas weniger Tiefe). So lassen?
      **Empfehlung:** so lassen. 1,2 ist dieselbe Grenze wie für „?“, nur gespiegelt; damit passen
      Engine-Karte und Rückblick zusammen.

- [x] R3. **Spielstärke-Schätzung:** Die Zahl („etwa 1400“) kommt aus dem durchschnittlichen
      Verlust je Zug über eine feste Tabelle (0,1 Bauern → 2600, 0,3 → 2000, 0,5 → 1650, 1,0 →
      1100; grobe Erfahrungswerte, keine Wertungszahl eines Verbands); die Genauigkeit rechnet wie Lichess.
      Soll die Zahl bleiben, nur die Genauigkeit stehen, oder ein anderes Wort als „Spielstärke“?
      **Empfehlung:** Zahl behalten, aber als „geschätzte Spielstärke“ mit dem Wort „etwa“. Eine
      Zahl motiviert mehr als eine Prozentangabe; das „etwa“ sagt ehrlich, dass sie grob ist.
      **Schon umgesetzt in 0.2.47 (Nachtest N246): „Geschätzte Spielstärke“, Wert „etwa 1400“.
      Widerspruch genügt.**

- [x] R4. **Stufen menschlicher machen.** Warum die Engine auf Stufe 1 bis 3 „dämlich und dann
      genial“ wirkt: Sie nutzt Stockfishs „Skill Level 0“ plus zufällige Fehlerwürfe. Skill
      Level 0 würfelt an Suchtiefe 1 unter den vier besten Zügen einer vollen Suche. Alles, was
      einen Zug tief sichtbar ist (jeder Schlag, jedes Matt in einem, jede fertige Gabel), spielt
      sie fehlerfrei, und in erzwungenen Stellungen trifft sie die Hauptvariante; die
      Fehlerwürfe treffen dagegen zufällige ruhige Züge. Ein Mensch auf 1000 Elo ist umgekehrt:
      gleichmäßig blind ab zwei Zügen Tiefe, selten grundlos verschenkend. chess.com baut seine
      Bots auf Komodo mit verrauschter Bewertung und Vorlieben (Angriff, Material); Lichess nutzt
      dieselben Skill Levels wie wir und zusätzlich die Maia-Netze, die aus Menschenpartien je
      Spielstärke gelernt haben (menschlichster Gegner, aber ein Netz mit eigener Laufzeit im
      Browser). Fünf Wege für die App, alle offline mit der vorhandenen Engine: 1. Gewichtete Zugwahl mit „Temperatur“ je Stufe statt Skill Level (Fehler meist klein,
      große nur selten; in erzwungenen Lagen bleibt der beste Zug sehr wahrscheinlich). 2. Tiefengrenze je Stufe (die Engine sieht Taktik jenseits ihres Horizonts gar nicht). 3. Fehlerneigung nach Lage und Strähnen (mehr Fehler in ruhigen Stellungen mit vielen
      Kandidaten, weniger im Schach; nach einem Fehler drei Züge erhöht; „Tagesform“ je Partie). 4. Menschliche Blindstellen auf Stufe 1 bis 3 (Rückwärtszüge und lange Diagonalen seltener,
      Schläge und Schachs bevorzugt, Springergabeln „übersehen“). 5. Stärken-Schwächen-Profile („Angreifer“, „Materialist“, „Verteidiger“) als kleine
      Zuschläge auf die Kandidaten.
      Empfehlung: 1 bis 3 zusammen als eigenes Arbeitspaket mit der Messung aus AP 11 (jede Stufe
      gewinnt weiter die Mehrheit gegen die darunter), 4 und 5 danach. Soll Claude das angehen,
      und welche Stufe soll zuerst dran sein?
      **Empfehlung zur Reihenfolge: Stufe 1 bis 3 zuerst, denn dort fällt das „dämlich, dann genial“
      am meisten auf; ab Stufe 4 spielt die Engine ohne absichtliche Fehler.
      **Schon umgesetzt in 0.2.52 (Nachtest N264, N265), Wege 1 bis 3 für Stufe 1 bis 3:
      Tiefengrenze 2, 4, 5 Halbzüge; gewichtete Zugwahl mit Temperatur 1,0, 0,7, 0,5 Bauern;
      Stufe 4 auf Skill Level 4 (statt 3), damit sie Stufe 3 schlägt;
      im Schach halbe Temperatur, bei über 30 legalen Zügen ein Drittel mehr, je eigenem Fehler
      unter den letzten drei Zügen ein Viertel mehr, Tagesform 0,75 bis 1,25 je Partie. Die
      Fehlerprofile bleiben. Wege 4 und 5 sind seit 0.2.46 die blinden Flecken und der Spielstil.
      Widerspruch genügt.**

- [x] R5. **Erklärungen im Rückblick:** Die Karte erklärt Fehler mit den sechs Fehlerarten der
      Engine (Drohung, hängende Figur, Gabel, gefährliche Linie, Motiv der Antwort, Schlagreflex,
      Dame, König). Ohne passende Regel steht nur „kostet etwa … Bauern. Besser war …“. Reicht
      das, oder soll die Engine-Variante (die nächsten Züge nach dem besseren Zug) dazu?
      **Empfehlung (geändert nach deinen Vergleichen mit chess.com, wo die Variante zu jedem Fehler
      steht):** die Engine-Variante dazu.
      **Schon umgesetzt in 0.2.56 (Nachtest N275): Die Auswertung speichert je Stellung die
      Hauptvariante der Engine (bis sechs Halbzüge), die Karte nennt nach „Besser war …“ die
      nächsten bis zu fünf Halbzüge als „Danach etwa …“. Widerspruch genügt.**

- [x] W1. **Was im Taktiktrainer als richtig zählt:** nur eine Aufgabe ohne falschen Zug und ohne
      Hinweis. Das Benennen des Motivs zeigt dir nur, ob es stimmte, und zählt nicht mit.
      **Empfehlung:** so lassen. Das Motiv zu benennen ist eine Lernhilfe; zählte es mit, würde ein
      richtig gefundener Gewinnzug wegen eines Wortes als Fehler gelten.

- [x] W2. **Matt geht vor:** Ein Zug, der mattsetzt, löst jede Aufgabe, auch wenn die Lösung einen
      anderen Weg zeigt. **Empfehlung:** so lassen. Wer mattsetzt, hat die Aufgabe gelöst; alles
      andere wäre für den Leser nicht nachvollziehbar.

- [x] W3. **Warnsignale im Fallentrainer:** Das Pflichtenheft sagt „du markierst vorher die
      Warnsignale“. Gebaut ist ein Knopf „Erst die Warnsignale prüfen“, der W1 bis W5 am Brett zeigt;
      selbst markieren muss der Leser sie nicht. **Empfehlung:** so lassen. W1 bis W5 betreffen
      Felder, Linien und Figuren beider Seiten; sie auf dem Handy einzeln anzutippen wäre mühsam,
      und der Knopf übt dieselbe Gewohnheit: erst prüfen, dann nehmen.

- [x] W4. **Fallen und Geschenke je zur Hälfte** in jeder Runde. **Empfehlung:** so lassen. Kämen
      fast nur Fallen, lernte der Leser „nie nehmen“; der Fallencheck soll aber unterscheiden.

- [x] W5. **Strukturerkenner in zwei Schritten** statt der vier Leitfragen: schwache Bauern
      antippen (geprüft gegen die Merkmale aus Fables Daten), dann den Plan wählen. Die Struktur
      selbst wird nicht abgefragt, weil eine Stellung oft mehrere hat (etwa Doppelbauer und
      Isolani in Abb. 5.16) und eine falsche Antwort dann womöglich auch richtig wäre.
      **Empfehlung:** so lassen. Löcher, Richtung und Läufer als eigene Schritte kommen dazu, sobald
      die Daten je Aufgabe die Antworten dazu enthalten (Fable kann sie mit den Werkzeugen aus
      Kapitel 5 ziehen).
      **Nachgelesen im Buch (17.10.2026):** Kapitel 5 stützt den Verzicht auf Strukturnamen („Du
      musst dir keine hundert Bauernstrukturen merken“). Die Leitfragen beginnen aber mit den
      Feldern (Löcher), weil man sie sonst übersieht. **Empfehlung angepasst:** Löcher als ersten
      Schritt einbauen, dann schwache Bauern, dann den Plan; das baue ich, wenn du zustimmst
      (größerer Umbau der Aufgabe).

- [x] W6. **Die 19 Plan-Sätze** hat Claude geschrieben (Fable hatte nur die Schlüssel geliefert),
      zum Beispiel „Den Isolani blockieren: eine Figur, am besten einen Springer, direkt vor ihn
      stellen und ihn dann angreifen.“ oder „Die Bauernkette an ihrer Basis angreifen, mit einem
      Bauernhebel.“ Falsche Wahlmöglichkeiten kommen nur aus anderen Strukturfamilien, damit kein
      ebenfalls passender Plan als falsch gilt. **Empfehlung:** in der App lesen (N238) und
      Formulierungen, die nicht nach deinem Buch klingen, mit Wortlaut melden.
      **Nachgelesen im Buch (17.10.2026):** Vier Sätze widersprachen Kapitel 5 und sind jetzt nach
      dem Buch formuliert: Isolani aus Sicht des Besitzers („aktiv spielen, möglichst keine Figuren
      tauschen“ statt „vorstoßen“), hängende Bauern aus Sicht des Besitzers („zusammenhalten, nur
      mit konkreter Drohung vorziehen“), Doppelbauer des Besitzers („Figuren behalten, offene Linie
      und Läuferpaar nutzen, Bauernendspiel meiden“ statt „auflösen“), hängende Bauern angreifen
      („das Feld vor dem zurückbleibenden Bauern wird zum Loch“). Dazu kleinere: Isolani blockieren
      mit „Figuren tauschen“, schlechter Läufer „gegen einen guten gegnerischen Läufer“, Luftloch
      „nicht auf Verdacht“. Schon umgesetzt in 0.2.55 (Nachtest N272).

- [x] W7. **Rundenlänge acht, leichteste zuerst, Buchaufgaben vor Lichess** bei gleicher Stufe.
      **Empfehlung:** so lassen. Acht Aufgaben passen in eine kurze Pause, und der Leser trifft
      zuerst auf die Stellungen aus seinem Buch.

- [x] W8. **Zielbilanz-Übung (0.2.48):** Stellungen aus Kapitel 2 und 3 ab Zug 6 bis Zug 20,
      fünf je Runde. Stellungen, in denen ein Zentrumsbauer angegriffen ist, kommen nicht dran,
      weil dort im Werkzeug erst die Engine entscheidet, ob er hängt (die Übung soll ohne Engine
      laufen und kein strittiges „teils“ abfragen). Richtig ist eine Aufgabe nur, wenn alle sechs
      Felder stimmen. So lassen?
      **Empfehlung:** so lassen. Sechs Felder sind schnell ausgefüllt, und die App zeigt je Feld,
      was stimmte; „teilweise richtig“ würde die Zählung der Runde unscharf machen.

- [x] W9. **Faktorenbilanz-Trainer (0.2.48):** Stellungen aus Kapitel 3 (ohne Schach und ohne
      entschiedene Stellung), je Faktor „Weiß, gleich, Schwarz“. Königssicherheit und Aktivität
      vergleicht die App über ihre Einschätzung je Seite (gut, teils, schlecht); bei gleicher
      Einschätzung heißt es „gleich“. Noch nicht drin: das Urteil des Buches zu Buchstellungen und
      die Frage „annehmen oder ablehnen?“ aus dem Pflichtenheft. Dafür bräuchte die App je Gambit
      einen Satz, ob man annimmt oder ablehnt, und den kann nur das Buch liefern. Soll das kommen?
      **Empfehlung:** ja, aber erst mit den vorbereiteten Texten (AP 14): Dort steht je Abbildung
      ohnehin eine Einschätzung in eigenen Worten, die du freigibst. Bis dahin vergleicht der
      Trainer nur mit der Rechnung der App.

- [x] W10. **Repertoire-Trainer (0.2.48):** Varianten sind alle Wege durch die Zugfolge einer
      Eröffnung in Kapitel 2 mit mindestens acht Halbzügen, gekürzt auf zwölf Züge je Seite. Du
      wählst die Seite selbst (das Buch sagt im Steckbrief, wer die Eröffnung wählt, aber man
      übt auch die Gegenseite). Eine Variante gilt als richtig, wenn sie ohne Fehler und ohne
      „Zug zeigen“ gelingt. Die Warum-Fragen an Schlüsselzügen aus dem Pflichtenheft fehlen noch:
      Sie brauchen die vorbereiteten Texte (AP 14), die du noch freigeben musst. So lassen?
      **Empfehlung:** so lassen und die Warum-Fragen nachrüsten, sobald die Texte zu Kapitel 2
      freigegeben sind. Die Seite selbst zu wählen ist nützlich, weil man jede Eröffnung auch als
      Gegner kennen sollte.

- [x] W11. **Studien lösen (0.2.53):** Studien sind die Zugfolgen der Abschnitte von Kapitel 10
      (Saavedra, Réti, Heuäcker, die zwei Springer, das kürzeste Patt), ohne die Übungen 73 bis 78,
      die schon als Übungen in der App sind. Der Leser spielt die Seite am Zug und muss die
      Hauptvariante des Buches finden; die App antwortet mit dem Buchzug, nicht mit dem stärksten
      Zug der Engine, wie im Pflichtenheft steht. Ein anderer, ebenfalls gewinnender Zug zählt als
      Fehler. Die „vier Prüfungen“ als Erinnerung neben dem Brett fehlen, weil ich den Wortlaut
      nicht erfinden will.
      **Empfehlung:** so lassen. In Studien ist der Buchzug fast immer der einzige, der gewinnt,
      und die Antwort aus dem Buch führt durch genau die Idee, die das Kapitel erklärt. Schon
      umgesetzt in 0.2.53, Widerspruch genügt. Für die Erinnerung bräuchte ich die vier Prüfungen
      als kurzen Satz von dir (oder die Freigabe, sie aus dem Kapitel zu übernehmen).
      **Nachgelesen im Buch (17.10.2026):** Die vier Prüfungen stehen in Kapitel 10 am Anfang: Was
      will der Gegner (oft ein Patt)? Jede Umwandlung prüfen, auch die Unterverwandlung. Am Ende
      jeder Variante das Patt prüfen. Stille Züge ernst nehmen. Sie stehen jetzt in eigenen kurzen
      Worten als aufklappbare Erinnerung über den Studien. Schon umgesetzt in 0.2.55 (Nachtest
      N273).

- [x] W12. **Zug erraten (0.2.53):** Partien sind die Meisterpartien der Abschnitte von Kapitel 11
      (ab 30 Halbzügen, also ohne den London-Vorlauf und ohne Übungen). Du wählst Partie und Seite
      selbst, die App weiß nicht, wer gewonnen hat. Jeder eigene Zug wird geraten; danach steht der
      Partiezug auf dem Brett und die App spielt die Antwort. Gut geraten ab der Hälfte der Züge.
      Die drei Minuten je Zug und der Satz „warum zog der Meister anders“ fehlen: Eine Uhr setzt
      unter Druck, und einen Satz könnte die App nicht prüfen.
      **Empfehlung:** so lassen. Schon umgesetzt in 0.2.53, Widerspruch genügt. Falls du den
      Sieger vorgeben willst, genügt je Partie ein Wort (Weiß oder Schwarz).

- [x] U1. **„Mit Hilfe“:** Wer eine Übung erst nach einem falschen Zug oder einem Hinweis löst,
      bekommt sie als gelöst, die Wiederholungskarte bleibt aber in ihrem Kasten (sie rückt nicht
      vor). Ohne Fehler und ohne Hinweis rückt sie einen Kasten weiter. Einverstanden?
      **Empfehlung:** so lassen. Im Karteikasten heißt „vorrücken“: sicher gekonnt. Wer Hilfe
      brauchte, soll die Übung im gleichen Abstand wiedersehen.

- [x] U2. **Denkaufgaben:** 23 Übungen haben keine Zugfolge ab ihrem Diagramm (Notation
      schreiben, Planfragen). Dort liest der Leser nach „Ich habe nachgedacht“ die Erklärung und
      schätzt sich selbst ein (gelöst, teilweise, nicht gelöst). Passt das?
      **Empfehlung:** so lassen. Ohne Zugfolge kann die App nichts prüfen; die Selbsteinschätzung
      ist bei Lernkarten üblich (etwa bei Anki).

- [x] U3. **Hinweise in drei Stufen:** 1 Motiv (aus der Erklärung), 2 welche Figur zieht,
      3 der Zug als goldener Pfeil. Passt die Reihenfolge?
      **Empfehlung:** so lassen. Von allgemein zu konkret wie im Taktiktrainer: Erst das Motiv lässt
      noch selbst denken, der Pfeil verrät alles.

- [x] U4. **Röntgen-Trainer, Frage 3:** Die eigenen drohenden Züge muss der Leser nicht markieren
      (es sind oft zehn und mehr); die App nennt nur ihre Anzahl. Markiert werden: deine Schachs,
      deine Schläge (ohne die, die Material verlieren) und Schachs und Schläge des Gegners, als
      wäre er am Zug. Einverstanden?
      **Empfehlung:** so lassen. Frage 3 für die eigene Seite ist ein Suchauftrag ohne feste Liste;
      als Pflicht zu markieren wäre sie auf dem Handy mühsam und kaum vollständig zu schaffen.

- [x] U5. **Sonderzüge mit eigenen Stellungen:** Für Rochade, en passant und Umwandlung im
      Trainer „Koordinaten, Notation, Gangarten“ gibt es sieben kurze Stellungen, die nicht aus
      dem Buch stammen (die Diagramme zeigen kaum en passant oder Umwandlung). Alles andere kommt
      aus den Abbildungen. Freigeben?
      **Empfehlung:** freigeben. Regel 1 betrifft die Abbildungen des Buches; die Sonderzüge sind
      Regelwissen aus Kapitel 0, und die kurzen Stellungen geben nichts als eigene Buchstellung aus.
      **Nachgelesen im Buch (17.10.2026):** Kapitel 0 hat zu jedem Sonderzug eine Buchstellung:
      0.12 kurze Rochade, 0.14 lange Rochade, 0.16/0.17 en passant, 0.19 Umwandlung. Die Begründung
      „die Diagramme zeigen kaum en passant oder Umwandlung“ stimmt also nicht. **Empfehlung
      angepasst:** zuerst die Buchstellungen nehmen, die eigenen Stellungen nur ergänzend (schwarze
      Rochade, en passant für Schwarz, Umwandlung mit Schlag). Baue ich nach deiner Zustimmung.

- [x] U6. **Notation:** Ein fehlendes Schach- oder Mattzeichen zählt als richtig, mit dem Hinweis
      „Denk an das Schachzeichen“. Englische Buchstaben (N, B, R, Q) zählen als falsch. So lassen?
      **Empfehlung:** so lassen. Das Schachzeichen ist Schreibweise, nicht Schachverständnis;
      englische Buchstaben sind dagegen ein echter Fehler gegen die Notation des Buches.
      **Nachgelesen im Buch (17.10.2026):** Kapitel 0 sagt selbst „Nf3 ist also dasselbe wie unser
      Sf3“, und die Zusatzzeichen machen Zugfolgen nur „besser lesbar“. Englische Buchstaben gelten
      jetzt als richtig, mit dem Hinweis „Im Buch stehen deutsche Buchstaben (S, L, T, D)“. Schon
      umgesetzt in 0.2.55 (Nachtest N271), Widerspruch genügt.

- [x] U7. **Hängende Figur:** Eine Figur hängt, wenn der Gegner sie mit Gewinn schlagen kann
      (Abtauschrechnung aus Kapitel 1, auch gedeckte Figuren, etwa ein Turm, den ein Bauer
      angreift). Gabeln und Drohungen zählen nicht. Passt das?
      **Empfehlung:** so lassen. Das ist genau die Zählregel aus Kapitel 1; Gabeln und Drohungen übt
      der Taktiktrainer.
      **Nachgelesen im Buch (17.10.2026):** Glossar: „Eine Figur hängt, wenn sie angegriffen und
      nicht ausreichend gedeckt ist“; Kapitel 1 vergleicht dazu die Gesamtwerte. Empfehlung
      bestätigt.

- [x] U8. **Rundenlängen:** Feld finden 16, Röntgen 5, alle anderen 8 Aufgaben. Passt das?
      **Empfehlung:** so lassen. Feld finden geht in Sekunden, Röntgen dauert je Aufgabe am
      längsten.

- [x] U9. **Trainer in der Wiederholung:** Bisher kommen nur die Übungen des Buches in die
      Wiederholung (fünf Kästen). Sollen auch Aufgaben der Trainer dort landen, etwa jede falsch
      beantwortete Röntgen-Aufgabe?
      **Empfehlung:** ja, aber nur für Taktiktrainer und „Falle oder Köder“. Deren Aufgaben haben
      feste Kennungen; eine falsch gelöste Aufgabe kommt als Karte wieder. Zähltrainer, Röntgen und
      Koordinaten erzeugen ihre Aufgaben zufällig, dort ergibt eine Wiederholung keinen Sinn.
      **Schon umgesetzt in 0.2.47 (Nachtest N249): Eine falsch gelöste Aufgabe (auch „Lösung
      zeigen“) wird zur Karte; richtig gelöste neue Aufgaben nicht. Widerspruch genügt.**

- [x] U11. **Bewertungsbalken** nur nach der Partie (wie empfohlen, R13), nicht während der
      Partie. So lassen?
      **Empfehlung:** so lassen. Ein Balken während der Partie verrät, wer besser steht, und nimmt
      dir das eigene Urteil ab.

## 64 Gegner mit Porträts (18.10.2026 nachts, Fable, Zweig `bots-galerie`, Version 0.2.67)

Wunsch des Autors (18.10.2026, mit Bildschirmfoto der Bot-Auswahl von chess.com): acht Bots je
Spielstärke mit verschiedenen Stärken und Schwächen, Auswahl mit Porträts, freie Bilder in
einheitlichem Stil, ungefähre Spielstärke gemessen. Seine Frage, ob die Bots die verschärfte
Stil-Toleranz und die blinden Flecken schon berücksichtigen: blinde Flecken ja (seit 0.2.46, elf
Arten seit 0.2.57); einen Stil hatten die vorgefertigten Gegner bis 0.2.62 gar nicht, nur eigene
Gegner (die Toleranz 0,3 kam mit S13 in 0.2.61). Jetzt hat jeder Bot einen Stil.

- **Liste** (`engine/gegnerliste1.ts` Stufen 1 bis 4, `gegnerliste2.ts` Stufen 5 bis 8,
  `gegnerbau.ts` Typ und Helfer, `gegnerliste.ts` zusammengeführt; `engine/gegner.ts` behält die
  Funktionen, neu `gegnerDerStufe`): 64 Gegner, je Stufe acht (Stufe = gerundeter Durchschnitt
  der drei Phasen, Streuung höchstens zwei). Die 18 Gegner aus 0.2.46 bleiben unverändert, nur
  ihr Stil ist neu. Je Stufe gibt es einen Eröffnungskenner (Eröffnung eine Stufe höher,
  Endspiel eine tiefer), einen Endspielfuchs (umgekehrt), einen Mittelspielkämpfer, Gleichmäßige,
  dazu Stile von −2 bis +2 und ein bis drei blinde Flecken; in Stufe 1 bis 4 außerdem je eine
  eigene Fehlerliste (Kapitel 1 und 4 grob, 5 bis 8 fein). Stufe 8 spielt in voller Stärke, dort
  unterscheiden nur Stil und blinde Flecken (Großmeister Grün ohne beides). Namen und Sätze in
  `de.json` (`gegner.<kennung>`), Titel ab Stufe 7 (Trainer, Dr.) und 8 (FM, IM, WIM, WGM, GM).
- **Stil der Bots** (`Gegner.stil`, in `Spielen.tsx` an die Partie weitergegeben wie bei
  eigenen Gegnern): dieselbe Toleranz 0,3 je Reglerstufe wie seit S13 (0.2.61). Was der Stil
  die Stärke kostet, zeigt die Messung unten; eine eigene Toleranz je Bot gibt es nicht.
- **Porträts** (`app/public/gegner/<kennung>.svg`, 64 Dateien, zusammen 344 KB, im
  Offline-Vorrat): aus DiceBear, Stil „Personas“ (Draftbit, CC BY 4.0; Code MIT), erzeugt mit
  `app/skripte/erzeuge-gegnerbilder.mjs` deterministisch aus der Kennung, mit Vorgaben je Gegner
  für Frisur, Bart und Haarfarbe (Oma, Opa, Doktor, GM grau; Kinder mit Käppi oder Zöpfen),
  einheitlich dunkelblauer Hintergrund und Rundung. Geprüft wurden „Adventurer“ und „Big Smile“
  (beide CC BY 4.0) und die CC0-Stile „Open Peeps“, „Lorelei“, „Notionists“; Personas kommt dem
  Vorbild (bunte Köpfe mit Oberkörper) am nächsten. Die Pakete sind keine Abhängigkeit der App.
  Namensnennung unter Einstellungen → Lizenzen und in `docs/LIZENZEN.md`, Lizenztext in
  `app/public/lizenzen/cc-by-4.0.txt`. Keine Bilder von chess.com (nicht frei).
- **Gegnerwahl** (`ui/komponenten/GegnerWahl.tsx`): statt des Auswahlfelds eine Sprechblase
  (Porträt, Name, „⌀ 1,3 · Einsteiger“, Satz) und ein Gitter mit vier Kacheln je Zeile: zuerst
  „Eigene Stufen“ und die eigenen Gegner (Anfangsbuchstabe), dann je Stufe eine Gruppe mit
  Überschrift „Stufe 3 · Fortgeschrittener Anfänger“. Kacheln sind Radio-Knöpfe (Bildschirmleser:
  „Vorgefertigter Gegner“, Name). Die Stufen je Phase bleiben verborgen.
- **Messung** (`npm run messen:stufen -- 1@lotta-1 …`, das Kürzel `N@kennung` nimmt seit 0.2.65
  das ganze Profil des Bots: Fehlerarten, Stil, blinde Flecken): alle 64 Bots gegen die reine
  Stufe ihres Durchschnitts, sechs Partien je Paarung. **Erster Befund (Stufe 1 bis 4, 0.2.65):**
  Bots mit kurzer Fehlerliste spielten stärker als ihre Stufe (Jonas 6:0, Pit 6:0, Timo 6:0,
  zehn weitere 4,5:1,5 oder besser), weil die Fehlersuche mit vier erlaubten Arten in den meisten
  Stellungen gar keinen Fehler fand und dann den besten Zug spielte. Deshalb seit 0.2.68
  (`engine/fehlersuche.ts`, `mitFehlerliste`): Die Liste bestimmt die Art, nicht die Menge.
  Passt keine erlaubte Art zur Stellung, bleibt eine Ungenauigkeit bis zu einem Bauern (im
  Protokoll „ungenau“). Das gilt auch für eigene Gegner und die Abhakliste (Hinweistexte
  angepasst); eine leere Liste heißt weiter „kein absichtlicher Fehler“. Die Messung der Stufen
  1 bis 4 wird danach wiederholt; das Ergebnis aller 64 Bots steht in der nächsten Fassung dieses
  Abschnitts.

## Messung aller 64 Bots, Stil-Fehler gefunden und behoben (18.10.2026, Fable und Opus, Zweig `werkzeuge-textarbeit`, Versionen 0.2.74 bis 0.2.81)

Jeder Bot spielt sechs Partien gegen die reine Stufe seiner Nummer (`npm run messen:stufen --
3@jonas-3 …`, Ergebnisse nur lokal in `buch/arbeit/stufenmessung/`), dazu bei Bedarf gegen die
nächsthöhere Stufe (`3@jonas-4`). Zwei benachbarte reine Stufen trennen 10 : 0 (Messung 0.2.52,
außer 3 gegen 4 mit 6,5 : 3,5); eine Stufe ist also ein großer Schritt. Maßstab deshalb: Ein Bot
soll gegen seine Stufe mindestens 1,5 von 6 Punkten holen und gegen die nächsthöhere verlieren.

**Verlauf:**

1. Erste Messung (0.2.73 und 0.2.74): Zwölf Bots der Stufen 1 bis 5 schlugen ihre Stufe klar,
   vier verloren klar. Versuch, die starken über eine Phasenstufe weniger und teurere Fehlerarten
   zu bremsen: half bei manchen, bei anderen (Leon, Ayşe, Sophie, Greta) gar nicht.
2. Messfehler (behoben in 0.2.77): Das Messwerkzeug trennte eine Paarung am ersten Bindestrich.
   Bei den 25 Kennungen mit Bindestrich spielte also etwa „4@frau“ gegen „berger“, zwei
   unbekannte Stufen; diese Zahlen galten nicht. Jetzt Trennung am letzten Bindestrich
   (`stufen.messung.ts`, `messe-stufen.mjs`).
3. **Ursache** (behoben in 0.2.78): Alle Bots, die zu stark waren, haben einen Stil ungleich 0.
   Gültige Messungen der Stufen 1 bis 4: Stil 0 im Mittel 3,1 von 6 Punkten gegen die eigene
   Stufe (9 Bots), Stil ungleich 0 im Mittel 4,8 (23 Bots). Der Stil wählte unter den Zügen, die
   höchstens 0,3 je Stilstufe hinter dem **besten Zug der Engine** liegen. In den Stufen 1 bis 3
   ersetzte das die gewichtete, absichtlich schwächere Zugwahl ganz; ab Stufe 4 ersetzte es den
   Zug, den die Engine mit Skill Level gewählt hätte. Ein Bot mit Stil spielte damit fast immer
   nahe am besten Zug. Jetzt wählt der Stil um den **Zug der Stufe** herum (`stilwahl` mit Bezug,
   `engine/stil.ts`, `engine/zugwahl.ts`), nach oben wie nach unten, in den Stufen 1 bis 3 nur
   unter den Kandidaten der Stufe. Damit ändert er den Charakter, aber im Mittel kaum die Stärke.
   Der Hinweis zum Stil in der App ist angepasst. S13 (Toleranz 0,3) bleibt.

**Folgen für die Bots (0.2.78):** Die Anpassungen gegen „zu stark“ aus Schritt 1 bekämpften nur
die Folgen dieses Fehlers und sind zurückgenommen (Stufen 1 bis 5 wieder wie in 0.2.67, auch die
Sprechblasen). Mit dem korrigierten Stil holen die 20 Bots der Stufen 1 bis 4 mit Stil im Mittel
3,05 von 6 Punkten gegen ihre Stufe, genauso viel wie die Bots ohne Stil (3,06).

4. **Endmessung (0.2.81)** mit festen Regeln, damit das Nachjustieren nicht endlos wird. Sechs
   Partien streuen um etwa ±1,2 Punkte; deshalb gilt ein Bot erst als Ausreißer, wenn zwei
   unabhängige Stichproben (zwölf Partien, zweite mit anderen Saaten über `MESSUNG_SAAT_AB`)
   unter 25 % oder über 75 % liegen, oder wenn ein schon bekannter Mechanismus vorliegt (teurer
   blinder Fleck). Jeder Bot bekommt höchstens eine Anpassung; wer danach knapp daneben liegt,
   bleibt als Grenzfall. Ab Stufe 5 gibt es keine absichtlichen Fehler mehr, ein Bot ist dort die
   reine Stufe minus blinde Flecken und Stil und damit eher schwächer. Die oberen Stufen liegen
   näher beieinander (Stufe 6 gegen 5: 7 : 3, 7 gegen 6: 8 : 2, 8 gegen 7: 9 : 1). Für die
   Stufen 5 bis 8 gilt deshalb als Prüfstein zusätzlich: Ein Bot, der gegen seine Stufe wenig
   holt, soll gegen die Stufe darunter mindestens die Hälfte holen, also zwischen beiden liegen.

Angepasst in der Endmessung (Begründung, Ergebnis danach):

| Stufe | Bot          | Änderung                                                    | Ergebnis gegen die eigene Stufe                            |
| ----- | ------------ | ----------------------------------------------------------- | ---------------------------------------------------------- |
| 2     | Ayşe         | „figurHaengen“ statt „koenigsschild“ (nur billige Arten)    | vorher 10 : 2, jetzt 8 : 4 (12)                            |
| 2     | Sophie       | „figurHaengen“ statt „ungenau“ (nur billige Arten)          | vorher 10 : 2, jetzt 8 : 4 (12)                            |
| 5     | Hanna        | Fleck „ruhig“ statt „rueckzug“ (wie 0.2.67 sonst)           | vorher 0,5 : 5,5, jetzt 7 : 5 (12)                         |
| 5     | Paul         | Fleck nur „abzug“ (statt „zwischenzug“, „turm“)             | 2,5 : 3,5                                                  |
| 5     | Frau Kaya    | Fleck „springer“ gestrichen                                 | vorher 1 : 5, jetzt 5 : 7 (12)                             |
| 5     | Herr Weber   | Eröffnung 4 → 5                                             | vorher 1 : 5, jetzt 4,5 : 7,5 (12)                         |
| 6     | Elif         | Mittelspiel 6 → 7, Fleck „ruhig“ statt „rueckzug“           | 3 : 3                                                      |
| 7     | Yara         | Fleck „ruhig“ statt „rueckzug“                              | 1 : 5, gegen Stufe 6 4 : 2                                 |
| 7     | Frau Dr. Ahl | Fleck „zwischenzug“ statt „bauer“                           | vorher 2,5 : 8,5, jetzt 1,5 : 4,5, gegen Stufe 6 4,5 : 1,5 |
| 8     | WGM Sato     | Fleck „ruhig“ statt „rueckzug“                              | vorher 0 : 6, jetzt 2 : 4                                  |
| 8     | IM Haas      | Stil −1 statt −2 (Stufe 8 kann der Stil nur verschlechtern) | 0 : 6, gegen Stufe 7 vorher 1,5 : 4,5, jetzt 5,5 : 0,5     |

Ergebnis aller 64 Bots in der Fassung von 0.2.81 (Punkte des Bots gegen die reine Stufe seiner
Nummer, sechs Partien, „(12)“ zwei Stichproben):

| Stufe | Bots                                                                                                                                                                                                                                                                     |
| ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1     | Lotta 3 : 3; Paula 2,5 : 3,5; Max 2 : 4; Finn 3 : 3; Oma Gerda 3 : 9 (12); Leon 4 : 2; Mia 3 : 3; Emil 4 : 8 (12)                                                                                                                                                        |
| 2     | Opa Hans 3 : 3; Onkel Rudi 8 : 4 (12); Frieda 2 : 4; Herr Lehmann 2,5 : 3,5; Ayşe 8 : 4 (12); Pit 4 : 2; Sophie 8 : 4 (12); Karl 4 : 2                                                                                                                                   |
| 3     | Selin 2 : 4; Nina 3 : 3; Jonas 3,5 : 2,5; Tobias 3 : 3; Greta 4 : 2; Herr Nowak 3 : 9 (12); Ida 3,5 : 2,5; Omar 3 : 3                                                                                                                                                    |
| 4     | Benno 3 : 3; Timo 4 : 2; Frau Berger 2,5 : 3,5; Lukas 4,5 : 1,5; Zoë 2 : 4; Herr Schmitt 5,5 : 6,5 (12); Amira 3,5 : 2,5; Jan 4 : 2                                                                                                                                      |
| 5     | Kurt 2 : 4; Frau Ortega 2,5 : 3,5; Nils 1,5 : 4,5; Hanna 7 : 5 (12); Herr Weber 4,5 : 7,5 (12); Lea 2,5 : 3,5; Paul 2,5 : 3,5; Frau Kaya 5 : 7 (12)                                                                                                                      |
| 6     | Lena 7,5 : 4,5 (12); Viktor 2,5 : 3,5; Sara 3 : 3; Herr Fischer 2 : 4; Elif 3 : 3; Matteo 3,5 : 2,5; Frau Lind 1,5 : 4,5; Ben 2 : 4                                                                                                                                      |
| 7     | Doktor Berg 4 : 2; Trainer Koch 1 : 5, gegen Stufe 6 3 : 3; Yara 1 : 5, gegen Stufe 6 4 : 2; Herr Brandt 1,5 : 4,5, gegen Stufe 6 3,5 : 2,5; Noah 3,5 : 8,5 (12), gegen Stufe 6 5 : 1; Frau Stein 2,5 : 3,5; Ravi 2 : 4; Frau Dr. Ahl 1,5 : 4,5, gegen Stufe 6 4,5 : 1,5 |
| 8     | Großmeister Grün 3 : 3; IM Vogt 1,5 : 4,5; WGM Sato 2 : 4; FM Ortiz 2,5 : 3,5; GM Petrova 1 : 5, gegen Stufe 7 3,5 : 2,5; IM Haas 0 : 6 vor der Anpassung, jetzt gegen Stufe 7 5,5 : 0,5; WIM Nkemelu 1,5 : 4,5; GM Lindqvist 2 : 4                                      |

Grenzfälle, die so bleiben: Oma Gerda und Herr Nowak (je 3 : 9, beide sehr defensiv, genau an
der Grenze), Nils, Frau Lind, Herr Brandt, Frau Dr. Ahl, IM Vogt und WIM Nkemelu (je 1,5 von 6).
Leon, Lukas und Herr Schmitt liegen am oberen, Trainer Koch (gegen Stufe 6 3 : 3) am unteren Rand.
Großmeister Grün, identisch mit der reinen Stufe 8, holt 3 : 3 und bestätigt damit, dass die
Messung selbst nicht verzerrt.

**Stufe 8 mit Stil:** IM Haas (sehr defensiv, Endspiel 7) holte gegen die volle Engine 0 : 6
und gegen Stufe 7 nur 1,5 : 4,5, GM Petrova (defensiv) 1 : 5 und gegen Stufe 7 3,5 : 2,5. Auf
Stufe 8 ist der Zug der Stufe der beste, der Stil kann dort nur schwächere Züge wählen (bis 0,3
je Stilstufe). IM Haas spielt deshalb jetzt mit Stil −1 statt −2 und schlägt Stufe 7 mit
5,5 : 0,5; GM Petrova bleibt. Der Hinweis zum Stil in der App sagt, dass ein Stil auf Stufe 8
schwächer macht, sehr aggressiv oder sehr defensiv etwa um eine Stufe.

## Spielbewertung an chess.com geeicht, Urteil je Phase, Taktik und Strategie (18.10.2026 nachts, Fable, Zweig `werkzeuge-textarbeit`, Version 0.2.72)

Der Autor schickte sieben eigene Partien von chess.com (drei gegen Bots, vier gegen Menschen,
15 bis 87 Züge) mit Genauigkeit, Spielbewertung, Zugklassen und den Symbolen je Phase aus der
Partieanalyse von chess.com, mit dem Wunsch, Spielbewertung und Phasen genauer zu justieren.
Der neue Messlauf `npm run messen:vergleich` (Datei nur lokal in `buch/arbeit/chesscom/`,
500 ms und zwei Varianten je Stellung) rechnet die Partien durch die Auswertung der App.

**Befund Genauigkeit:** Unsere Genauigkeit (Rechnung wie bei Lichess) liegt über der von
chess.com, bei schwachem Spiel um 10 bis 19 Punkte, bei starkem um 1 bis 3. chess.com rechnet
tiefer und mit eigener Formel; die Rechnung bleibt, weil sie offen dokumentiert ist und in der
App dieselbe Engine die Werte liefert. Zwei Läufe mit 0,5 s je Stellung schwanken um bis zu
4 Punkte; in der App rechnet die Auswertung 2 s.

**Entscheidung Spielstärke:** Die Tabelle Genauigkeit → Spielstärke war aus Durchschnittswerten
(Meister über 92 %) und lag an 14 Seiten 450 bis 1150 über der Spielbewertung von chess.com. Neue
Stützstellen: 100 → 2800, 97 → 2350, 95 → 2100, 92 → 1750, 89 → 1550, 86 → 1350, 83 → 1100,
80 → 900, 75 → 700, 70 → 500, 60 → 350, 50 → 250. Ergebnis an den 14 Seiten (Genauigkeit
chess.com / App, Spielbewertung chess.com / App alt / App neu):

| Partie                | Seite  | Genauigkeit | Spielbewertung chess.com | App alt | App neu |
| --------------------- | ------ | ----------- | ------------------------ | ------- | ------- |
| 1, gegen Bot, 58 Züge | Autor  | 80,1 / 88,1 | 1650                     | 2100    | 1500    |
|                       | Gegner | 70,6 / 82,5 | 650                      | 1800    | 1050    |
| 2, gegen Bot 1575, 87 | Autor  | 74,9 / 85,3 | 1350                     | 1850    | 1300    |
|                       | Gegner | 71,5 / 81,0 | 900                      | 1650    | 950     |
| 3, gegen Mensch, 15   | Autor  | 91,6 / 93,5 | 1700                     | 2450    | 1900    |
|                       | Gegner | 56,7 / 74,8 | 800                      | 1400    | 700     |
| 4, gegen Mensch, 26   | Gegner | 70,8 / 83,6 | 1000                     | 1900    | 1150    |
|                       | Autor  | 90,3 / 90,8 | 1700                     | 2300    | 1650    |
| 5, gegen Mensch, 23   | Autor  | 91,4 / 90,4 | 1500                     | 2450    | 1650    |
|                       | Gegner | 74,1 / 80,3 | 1000                     | 1800    | 900     |
| 6, gegen Mensch, 19   | Gegner | 61,6 / 68,4 | 450                      | 1300    | 500     |
|                       | Autor  | 84,9 / 81,5 | 1450                     | 1950    | 1000    |
| 7, gegen Bot 1700, 51 | Autor  | 92,4 / 94,6 | 2000                     | 2450    | 2050    |
|                       | Gegner | 83,9 / 88,9 | 1600                     | 2150    | 1550    |

Abweichung neu zu chess.com: im Mittel 0, Median 0, höchstens 450 (Partie 6, Autor; chess.com
schwankt selbst, 94 % ergibt dort 1500 und 2000). Die Wertung des Lesers (Elo-System) rechnet ab
jetzt mit den neuen Schätzungen; alte Punkte bleiben (keine Umrechnung gespeicherter Daten,
Rückfrage S20 empfiehlt dem Autor einmal „Wertung zurücksetzen“).

**Phasen-Symbole von chess.com:** nicht veröffentlicht. Aus den 13 Bewertungen des Autors:
„Strategie“ immer „Gut“, „Endspiel“ auch bei 95 % nur „Gut“, „Eröffnung“ meist „Bester“, einmal
„Großartig“, „Taktik“ „Exzellent“ oder „Gut“. Das spricht für einen Durchschnitt der Zugklassen
je Phase (Eröffnung: viele Buch- und beste Züge; ruhige Stellungen und gewonnene Endspiele: viele
gleich gute Züge, also „Gut“), nicht für eine Genauigkeit. Als Information für den Leser taugt
das wenig. **Entscheidung:** eigenes Urteilswort je Phase aus der Genauigkeit der Phase, Grenzen
aus der Spielstärke-Tabelle (hervorragend ab 95 %, sehr gut ab 88 %, gut ab 78 %, ungenau ab
68 %, fehlerhaft ab 55 %, sonst schwach), als farbige Marke vor den Zahlen (`phasenurteil` in
`spiel/genauigkeit.ts`, Marke `.phasenurteil` in `spiel.css`).

**Taktik und Strategie:** Das Mittelspiel steht zusätzlich getrennt nach Zugart (`spiel/taktik.ts`,
`spielstaerkeImMittelspiel`): Eine Stellung ist taktisch nach der Regel des Sicherheitsblicks
(Kapitel 12) und der erzwingenden Züge (Kapitel 7), wenn die Seite am Zug im Schach steht, der
Gegner Material oder Matt droht, sie selbst mit Gewinn schlagen oder Matt setzen kann; sonst
ruhig (Strategie). Eröffnung und Endspiel bleiben ungeteilt wie bei chess.com. In den sieben
Partien liegt die Taktik des Autors meist über seiner Strategie (Partie 4: 2200 gegen 750,
Partie 7: 2000 gegen 1550), wie bei chess.com (Taktik „Exzellent“, Strategie „Gut“).

**Zugklassen im Vergleich** (nicht geändert, zur Beobachtung): „bester“ und „sehr gut“ zusammen
treffen chess.com „Bester“ plus „Exzellent“ gut; unser „stark“ (einziger guter Zug oder Fehler
bestraft) ist häufiger als „Großartig“ bei chess.com (Partie 7: 6 gegen 0); unser „patzer“ ab
drei Bauern ist häufiger als dort (Partie 2, Gegner: 5 gegen 2); „buch“ bleibt 0, weil nur die
Eröffnungen des Buches zählen. Prüfschritt N260 (alte Zahlen) ist durch N290 ersetzt.

## Werkzeugabweichungen aus der Textarbeit geprüft (18.10.2026 nachts, Fable, Zweig `werkzeuge-textarbeit`, Version 0.2.68)

Die Helfer der Textarbeit (AP 14, 15.10.2026, Stand 0.2.25) hatten zwölf Gruppen von
Werkzeugausgaben notiert, die vom Buch abweichen (Liste bis 0.2.67 in FORTSCHRITT unter AP 14).
Nach Regel 9 jetzt ohne Rückfrage geprüft: Jede genannte Abbildung durch das heutige Werkzeug
gerechnet und mit dem Buch verglichen. Ergebnis: Von den zwölf Gruppen waren neun seit den
Rückfragen C1 bis C9 und den Versionen 0.2.26 bis 0.2.62 schon erledigt, zwei fehlten noch und
sind jetzt umgesetzt, eine ist ein Befund an das Buch.

| Werkzeug, Abbildungen                                                       | Stand heute                                                                                                                                                                                                                                                                                 |
| --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| k2-zielbilanz 2.40, 2.113 („mit Gewinn schlagbar“), 2.24 (nur d4)           | erledigt seit 0.2.33 (C1.1): angegriffene Zentrumsbauern prüft die Engine; 2.24 nennt d4 und e4                                                                                                                                                                                             |
| k2-eroeffnung 2.85 (Nimzo-Indisch)                                          | kein Fehler: Das Nimzo-Beispiel des Buches (k02-a135) enthält 2. Lg5 als Abweichung, das Werkzeug sagt „noch offen: Nimzo-Indisch oder Trompowsky“                                                                                                                                          |
| k3-faktorenbilanz 3.6, 3.42 (Turm f8 „auf offener Linie“)                   | erledigt: Der Turm zählt nur bei der Zeit „im Spiel“, wie die Tabelle des Buches                                                                                                                                                                                                            |
| k3-faktorenbilanz 3.23, 3.32, 3.60, 3.68, 3.69 (Taktik)                     | erledigt: im Schach „erst zu Ende rechnen“, Matt „Partie entschieden“; 3.32 stimmt mit der Tabelle des Buches überein                                                                                                                                                                       |
| k3-faktorenbilanz 3.1, 3.18, 3.36 („Schwarz vorn bei Zeit“ bei 0:0)         | **Befund an das Buch** (Rückfrage B6): Die Zählhilfe des Buches („Ist Schwarz am Zug, ziehe vom weißen Vorsprung eine Figur ab“) und die Tabelle zu 3.14 (zwei gegen zwei, Schwarz +1) ergeben das so; die App folgt dem Buch (Regel 1). Vorschlag im Buch: „nie unter null“                |
| k4-warnsignale 4.29 (h2 nur von Sf3 gedeckt), 4.8 (Lb2–De5–g7)              | erledigt (C2 und W2 seit 0.2.39)                                                                                                                                                                                                                                                            |
| k5-richtung 5.15, 5.30, 5.21, 5.27, 5.35, 5.13; k5-figuren 5.40             | erledigt (C1.9, C1.10, Luftloch): gesunde Mehrheit vor Minderheitsangriff, Hebel gegen die Basis zuerst, „schlecht nach der Farbe, aber aktiv“                                                                                                                                              |
| k5-richtung 5.17 (Weiß, Besitzer des Isolani)                               | **jetzt umgesetzt:** Fazit für den Besitzer eines zentralen Isolani im Mittelspiel nach Kapitel 5 („aktives Figurenspiel, Vorstoß d4–d5, keine Figuren tauschen“); nicht, wenn der Gegner das Feld davor blockiert (5.18) oder die Damen fehlen. Auch 11.43 (Petrosjan) bekommt diesen Satz |
| k6-wo/k6-lap 6.4, 6.8 bis 6.10, 6.17, 6.32                                  | erledigt: Gegenschlag im Zentrum, Minderheitsangriff nur am Damenflügel, Td7 als Eindringen, im Schach keine Planfrage                                                                                                                                                                      |
| k7-motiv 7.21, 7.10, 7.28                                                   | erledigt: 7.21 „Abzug, relative Fesselung durchbrochen“; 7.10 und 7.28 über den letzten Zug des Verlaufs (Abzug, Dauerschach)                                                                                                                                                               |
| k8-opposition, k8-quadrat 8.19 bis 8.53                                     | erledigt (Endspieldatenbank, Patt, Quadrat, Reserve-Tempo, verbundene Freibauern, König vor dem Bauern)                                                                                                                                                                                     |
| k8-schluesselfelder 8.29 aus Sicht von Schwarz                              | **jetzt umgesetzt:** Der Sonderfall 6. Reihe steht auch im Fazit des Verteidigers („Weiß gewinnt mit e7“), nicht mehr „die Opposition entscheidet“                                                                                                                                          |
| k9 9.3, 9.4, 9.23 bis 9.26, 9.37; k11-phase 11.28 bis 11.84; k12 12.3, 12.4 | erledigt (X1, C3, C9 und die Endspielwerkzeuge seit 0.2.49: Philidor, Vancura nur mit einem Bauern, ungleichfarbige Läufer mit getrennten Freibauern „meist gewonnen“, Phase Mittelspiel, Matt scheidet aus, Sicherheitsblick „König im Freien“)                                            |

Die Liste in FORTSCHRITT ist damit abgearbeitet und dort durch diesen Verweis ersetzt.

## Impressum und Datenschutz (17.10.2026 abends, Autor und Opus, Version 0.2.62)

- Der Autor hat Name und Anschrift für das Impressum genannt (Hannover), bestätigt
  kontakt@schach-von-grund-auf.com, Cloudflare als Hoster, keine Web Analytics und das Postfach
  ebenfalls über Cloudflare. Telefon und Umsatzsteuer-ID entfallen.
- Impressum: Angaben nach § 5 DDG, Verantwortlicher nach § 18 Abs. 2 MStV, Hinweis auf GPL für den
  Code und geschützte Buchinhalte. Datenschutz: Verantwortlicher, Cloudflare als
  Auftragsverarbeiter (Art. 6 Abs. 1 lit. f DSGVO, Übermittlung in die USA nach dem EU-US Data
  Privacy Framework), E-Mail, Rechte nach Art. 15 bis 21 DSGVO, Beschwerde bei der
  Landesbeauftragten für den Datenschutz Niedersachsen. E1 und E2 erledigt, Nachtest N294.
- Nachtrag: Cloudflare leitet die E-Mails an ein Postfach bei goneo weiter (Angabe des Autors);
  goneo steht als Auftragsverarbeiter im Datenschutz. Die Zieladresse selbst steht nicht im
  Repository.
- Bekannt und vom Autor so gewollt: Name und Anschrift stehen damit dauerhaft im öffentlichen
  Repository.

## U12: Leerfälle der Werkzeugkarten (18.10.2026 nachts, Opus, Zweig `leerfaelle`, Version 0.2.64)

Nach Regel 9 umgesetzt, wie in U12 empfohlen (Wortlaut der Rückfrage unten). Umsetzung als
Schicht vor der Karte (`app/src/ui/werkzeuge/leerfall.ts`), die Werkzeuge in `analyse/`
(Fables Bereich) bleiben unverändert:

- Ein Satz „{gilt} Hier nicht: {grund}“ statt leerer Befunde; ohne Markierungen und Legende.
- Bedingungen: Angriffsregel und Zielbilanz nicht im Endspiel; Todsünden nur in der Eröffnung;
  Faktorenbilanz in Eröffnung und Endspiel immer, im Mittelspiel nur, wenn ein Faktor vorn liegt;
  die vier Skelett-Werkzeuge nur mit Bauern (Figuren zusätzlich mit Figuren); Ruhe nur mit Schach,
  Schlag oder Drohung; Warnsignale Kapitel 7 nur mit Signal; Sechs Regeln nicht in der Eröffnung;
  Opposition nur im Bauernendspiel, Schlüsselfelder und Quadrat dazu nur mit Bauern. Die Phase wie
  im Werkzeug „Phase“ (Glossar an Buchstellungen, Lesart in Partien).
- Abweichung von der Empfehlung: Die Zielbilanz ist auch im Mittelspiel voll, weil das Buch 14
  Zielbilanzen an Mittelspiel-Stellungen hat (Kapitel 2); die Faktorenbilanz auch im Endspiel
  (Abb. 3.24). Ein Test sorgt dafür, dass kein Leerfall eine Buchtabelle verdeckt.
- Bei allen Werkzeugen fällt der Satz weg, der als Befund und als Fazit doppelt stand (gemessen an
  allen Abbildungen: Planbilanz, Elementarmatt, Quadrat, Erkennungsbilder, Turmendspiel, LAP, Wo?,
  Gegner?, Schlüsselfelder, Opposition, Faktorenbilanz). Das Turmendspiel hatte seine Leerfall-Sätze
  schon. Nachtest N300.

- [x] U12. **Leerfälle (D1, angenommen am 15.10.2026, noch offen):** Bestandsaufnahme vom
      17.10.2026: 11 Werkzeuge haben schon einen Leerfall, aber jedes mit eigenem Text (und meist
      mit dem Satz doppelt, als Befund und als Fazit). 15 Werkzeuge prüfen nicht, ob sie greifen,
      und zeigen immer eine volle Karte: Angriffsregel, Todsünden, Zielbilanz, Faktorenbilanz,
      die vier Skelett-Werkzeuge, Ruhe, Sechs Regeln, Opposition, Schlüsselfelder, Quadrat,
      Turmendspiel (teils), Warnsignale Kapitel 7. Claude hat D1 über Nacht **nicht** umgesetzt,
      weil es Ergebnisse ändert, die du gerade nachtestest (etwa die Faktorenbilanz an Abb. 3.6,
      N166: Material gleich, also nur noch „Material gleich – hier hilft die Planfindung mehr“).
      Vorschlag: einheitlich nur ein Satz (ohne leere Befunde), Bedingungen wie in der Tabelle
      von damals; die Eröffnungsphase nach der Phasenregel der App (eine Seite hat noch zwei
      Leichtfiguren zu Hause), nicht nach Zug 15. Soll Claude das so umsetzen, und gilt die
      Faktorenbilanz dann auch in der Eröffnung bei gleichem Material (wie 3.6)?
      **Empfehlung:** ja, umsetzen, aber erst nach deinem Nachtest N158 bis N174, damit du die
      Werkzeuge noch einmal mit vollen Karten siehst. Die Faktorenbilanz auch in der Eröffnung
      zeigen: Das Buch nutzt sie gerade bei den Gambits, also in der Eröffnung. (Abb. 3.6 gilt seit
      0.2.44 übrigens als Mittelspiel.)

## Fehlerdatenbank (18.10.2026 nachts, Opus, Zweig `fehlerdatenbank`, Version 0.2.65)

- Trainer „fehlerdatenbank“ fertig (AP 13, Stufe 3): `training/fehlerdatenbank.ts` (Einträge,
  Auswertung je Fehlerart und Woche, Vorschlag), `ui/trainer/FehlerBereich.tsx`,
  `ui/trainer/FehlerFormular.tsx`, Knopf „In die Fehlerdatenbank“ in der Rückblickkarte.
- Nutzerdaten Format 4 mit dem Feld „fehler“; Format 3 und älter lesen sich mit leerer Liste.
- Entscheidungen wie in F1 (`docs/AUFGABEN_AUTOR.md`), nach Regel 9 sofort umgesetzt.

## Denkroutine-Trainer (18.10.2026 nachts, Opus, Zweig `denkroutine`, Version 0.2.66)

- Trainer „denkroutine“ fertig (AP 13, Stufe 3): `training/denkroutinetrainer.ts` (Stellungen,
  Lesen der Eingaben, Urteil), `ui/trainer/Denkroutineaufgabe.tsx`, `ui/trainer/useDenkvergleich.ts`
  (Engine nacheinander: bester Zug, nur die Kandidaten, je Kandidat die stärkste Antwort).
- Entscheidungen wie in F2 (`docs/AUFGABEN_AUTOR.md`), nach Regel 9 sofort umgesetzt.

## Planbilanz-Übung (18.10.2026 nachts, Opus, Zweig `planbilanz`, Version 0.2.69)

- Trainer „planbilanz“ fertig (AP 13, Stufe 3) mit drei Übungsarten:
  `training/planbilanztrainer.ts`, `ui/trainer/Planaufgaben.tsx`.
- Entscheidungen wie in F3 (`docs/AUFGABEN_AUTOR.md`), nach Regel 9 sofort umgesetzt.
- Nebenbei: Der Oberflächentest des Faktorenbilanz-Trainers erwartete nur „App:“; seit W9 steht
  bei Buchtabellen „Buch:“. Je nach Zufallsstellung schlug er fehl, jetzt behoben.

## Abweichungsmodus (18.10.2026 nachts, Opus, Zweig `abweichung`, Version 0.2.70)

- Trainer „abweichung“ fertig (AP 13, Stufe 3): `training/abweichungstrainer.ts`,
  `ui/trainer/AbweichungBereich.tsx`, `ui/trainer/Abweichungsaufgabe.tsx`,
  `ui/trainer/useAbweichung.ts` (Engine nacheinander: Abweichzug, dann Bewertung der Antwort).
- Entscheidungen wie in F4 (`docs/AUFGABEN_AUTOR.md`), nach Regel 9 sofort umgesetzt.

## 30-Minuten-Plan (18.10.2026 nachts, Opus, Zweig `dreissig-minuten`, Version 0.2.71)

- Trainer „dreissigMinuten“ fertig (AP 13, Stufe 3); damit sind alle Trainer des Pflichtenhefts
  spielbar. `training/dreissigminuten.ts` (Plan, Wechsel, Uhr, gemerkter Stand),
  `ui/trainer/DreissigMinutenBereich.tsx`, `ui/trainer/Planschritte.tsx`,
  `ui/trainer/usePlanstand.ts` (Merker `svga.dreissigMinuten` im Gerätespeicher).
- Entscheidungen wie in F5 (`docs/AUFGABEN_AUTOR.md`), nach Regel 9 sofort umgesetzt.
- Anfrage an Fable: Bedenkzeit 10+0 in `spiel/uhr.ts` (`UHR_VORGABEN`) und auf Wunsch eine
  Vorgabe der Uhr in der Ansicht „spielen“, damit der Plan die Partie mit 10+0 starten kann.
- Der Oberflächentest „Training zeigt alle Trainer“ prüft jetzt, dass kein Trainer mehr „folgt
  mit einem Update“ trägt.

## Lichess-Aufgaben im Training, Lizenzen, X5 (18.10.2026 nachts, Opus, Zweig `lichess-lizenzen`, Version 0.2.73; vorbereitet als 0.2.72, Fable hatte die Nummer zuerst)

- Geprüft: Die Lichess-Aufgaben aus `inhalte/de/trainer/` sind im Training angeschlossen.
  Taktiktrainer 637 von 674 Aufgaben, „Falle oder Köder“ 120 von 137; Strukturerkenner und
  Endspieltrainer haben nur Buchstellungen. `skripte/kopiere-trainerdaten.mjs` kopiert die Dateien
  beim Bauen nach `public/daten/de/trainer/` (gleich mit `inhalte/`); jede Aufgabe zeigt ihre
  Herkunft („Aus der freien Lichess-Datenbank (Wertung …)“). Nichts mehr offen.
- Lizenzen-Bildschirm: Eintrag für die Lichess-Puzzle-Datenbank (CC0) ergänzt; der Link der App
  zeigte noch auf das alte, private Repository und zeigt jetzt auf `github.com/dobili/SvGa_Public`.
- X5 (Schwierigkeit im Endspieltrainer): Verteilung geprüft, Empfehlung „so lassen“ nach Regel 9
  als umgesetzt vermerkt (`docs/AUFGABEN_AUTOR.md`, X5).

## Aufgabenseite in der App (18.10.2026 morgens, Opus, Zweig `autor-aufgaben`, Version 0.2.75; vorbereitet als 0.2.74, Fable hatte die Nummer zuerst)

Wunsch des Autors: Die Aufgabendatei `docs/AUFGABEN_AUTOR.md` in der App, geöffnet über drei
Sekunden Druck auf das Zahnrad, mit Links zu Abbildungen, Spielen und Trainern, Haken je Punkt und
einem Knopf, der den Stand für den Chat in die Zwischenablage legt.

- Die Datei kommt beim Bauen als eigener, nachgeladener Teil in die App (`?raw`-Import, etwa
  36 kB gepackt, offline im Service Worker). Sie ist damit so neu wie die App; eine eigene Kopie
  gibt es nicht. Sie ist ohnehin öffentlich (Repository).
- `autor/aufgabendatei.ts` liest „##“- und „###“-Abschnitte und Punkte „- [ ] N307. …“ mit
  eingerückten Folgezeilen; `autor/verweise.ts` findet Links: „Abb. 6.20“ (auch Ketten wie
  „6.20 und 11.34“, „0.12 bis 0.19“), Trainernamen in „…“, Spielen, Partienliste, Einstellungen,
  Nachschlagen, Glossar, Gesamt-Checkliste, Lizenzen und „Training ›“. „Kapitel 12“ ist kein
  Link (in „Training › Kapitel 12“ wäre das Buchkapitel das falsche Ziel).
- `autor/abhakstand.ts`: Haken, Notizen, aufgeklappte Abschnitte und der zuletzt angetippte Punkt
  liegen als Merker `svga.autorAufgaben` auf dem Gerät, nicht in den Nutzerdaten (gehört zur
  Arbeit am Buch, nicht zum Lesen; zieht nicht mit der Datensicherung um). Text für den Chat:
  „N306 ok“, „N305: Notiz“, „F5 ok: Notiz“, in der Reihenfolge der Datei, mit App-Version und
  Version der Datei in der Kopfzeile.
- Langer Druck: `ui/komponenten/useLangerDruck.ts` (3 s, Kontextmenü des Handys unterdrückt);
  ein kurzer Tipp bleibt der Wechsel zu den Einstellungen. Am Rechner `/app/#aufgaben`.
- Rückweg: Nach einem Link steht über der Leiste „‹ Zurück zu den Aufgaben“
  (`ui/komponenten/AufgabenRueckweg.tsx`), weil eine installierte App auf dem iPhone keine
  Zurück-Taste hat und etwa die Einstellungen keinen eigenen „Zurück“-Knopf.
- Links im Fließtext sind echte Links (`<a>`), keine Knöpfe: Knöpfe haben 44 Pixel Mindesthöhe
  und brechen nicht mit dem Satz um.
- Folge für alle Sitzungen (CLAUDE.md, Regel 8): Das Format der Punkte in
  `docs/AUFGABEN_AUTOR.md` bleibt „- [ ] Kennung. Text“ mit eingerückten Folgezeilen, sonst sieht
  die App sie nicht (ein Test liest die echte Datei).

## Genauigkeit und Spielstärke neu eichen (Plan, 18.10.2026 vormittags, Opus; Entscheidungen des Autors)

Ausgangslage: Unsere Genauigkeit folgt der Formel von Lichess und liegt bei schwachem Spiel 10 bis
19 Punkte über chess.com (CAPS2, Formel geheim). Die Spielstärke-Tabelle ist seit 0.2.72 an sieben
Partien des Autors geeicht, also an ihn gebunden; die Spielbewertung von chess.com nimmt zudem die
eigene Wertungszahl als Ausgangspunkt. Der Autor möchte, dass seine Leser (die beide Plattformen
nutzen) Zahlen bekommen, die zu beiden passen. Entschieden (alle Punkte vom Autor bestätigt):

1. **Schalter in den Einstellungen** für die Genauigkeit: „Lichess“, „Mittelweg“ (Standard),
   „nahe chess.com“. Eine Rechnung mit zwei Reglern: Steilheit der Zugkurve (Lichess 0,04354;
   strenger heißt kleine Fehler zählen mehr) und Gewicht der Züge in entschiedenen Stellungen
   (weniger Polster). „Lichess“ = genau die Lichess-Werte; „nahe chess.com“ = an chess.com-
   Genauigkeiten geeicht; „Mittelweg“ = Regler halb dazwischen. Die gespeicherten Bewertungen je
   Stellung reichen: Ein Wechsel rechnet alle Partien sofort neu, kein neues Speicherformat.
2. **Anzeige:** eine Zahl mit dem Modus darunter; die beiden anderen Werte in der aufklappbaren
   Erklärung.
3. **Spielstärke unabhängig vom Schalter,** aus einer festen inneren Genauigkeit. Sie ist die
   **Mitte zweier Kurven:** Genauigkeit → chess.com-Wertungszahl (geeicht an gewerteten
   chess.com-Partien) und Genauigkeit → Lichess-Wertungszahl (geeicht an Lichess-Partien). Die
   Erklärung nennt beide, etwa „≈ 1250 (chess.com ≈ 1100 · Lichess ≈ 1400)“, und sagt, dass die
   Mitte zu keiner echten Liste gehört. Damit ist die Schätzung nicht mehr an den Autor gebunden.
4. **Zusätzlich die Spielstärke über die letzten zehn Partien** (eine einzelne Partie streut
   erwartbar um etwa ±300 Punkte; über zehn gleicht sich das aus).
5. **Urteilswörter je Phase** („Sehr gut“, „Gut“ …) hängen an der festen inneren Genauigkeit,
   damit der Schalter sie nicht verschiebt.
6. **Daten:** öffentliche Schnittstellen von chess.com (`api.chess.com/pub/…`: Partien mit
   Wertungszahlen, PGN, `time_class`, `rated`, `accuracies` bei ausgewerteten Partien; Anfragen
   nacheinander) und Lichess (Partien je Spieler mit Bewertung und offizieller Genauigkeit).
   Gewertete Schnellschach-Partien, gleich viele je 200-Punkte-Band von 400 bis 2400, zuerst 300
   Partien je Plattform, aufstocken nur bei zu großer Streuung. Ausgelassen: unsichere Wertungen
   (neue Konten), sehr kurze Partien, Abbrüche. Kennung bei den Abfragen: nur der Name der Website
   (`schach-von-grund-auf.com`), keine Adresse. Rohdaten nur lokal (`buch/arbeit/eichung/`, nie
   committen); ins Repository nur die geeichten Zahlen und eine Zusammenfassung ohne Namen.
7. **Engine:** dieselbe wie in der App (Stockfish 19 lite, ein Kern), **feste Tiefe 18** statt
   fester Zeit, mit Zeitgrenze als Sicherung; auch die Auswertung in der App rechnet künftig bis
   Tiefe 18, damit Eichung und App übereinstimmen und alte und neue Handys dasselbe ergeben.
   Nachrechnen mit Zwischenständen (fortsetzbar), in Läufen unter zwei Stunden.
8. **Kontrolle:** ein Teil der Partien bleibt beim Eichen außen vor und prüft das Ergebnis; der
   Lichess-Modus wird gegen die offizielle Lichess-Genauigkeit geprüft.
9. **Bot-Stufen:** Nach Abschluss der Bot-Eichung (anderer Chat) werden die Elo-Angaben der
   Stufen auf dieselbe Skala gebracht wie die neue Spielstärke.
10. **Zuständigkeit:** Fables Kontingent ist verbraucht; Opus macht alles, auch die Teile in
    `spiel/` und `engine/` (Ausnahme von der Aufteilung vom 18.10.2026). Vor dem Einbau `main`
    einmergen, weil die Bot-Eichung noch läuft.

## Einstellungen, Kapitelseiten und Spielen neu geordnet (18.10.2026 mittags, Opus, Zweig `layout-einstellungen`, Version 0.2.80)

Wunsch des Autors vom 18.10.2026 (Layout in drei Teilen: Einstellungen, Kapitelseiten, Spielen).
Einstellungen:

1. **Neue Bausteine** in `ui/komponenten/`: `Reiter` (Tabs nebeneinander, kleine Schrift, mit
   Symbol), `MitInfo` (kurze Zeile mit Fragezeichen im Kreis, Erklärung anfangs eingeklappt),
   `Kreisanzeige` und `Ring` (Fortschritt als goldener Ring mit Prozentzahl statt Balken),
   `Vorschauwahl` mit `Brettausschnitt` (vier Felder mit Figuren, gezeichnet wie auf dem Brett).
   Stil in `ui/stil/bausteine.css`.
2. **Wertungskurve:** Gesamt und Phasen als Reiter; die Erklärung zum Elo-System hinter dem
   Fragezeichen.
3. **Fortschritt:** Ringe in „Dein Fortschritt“ und auf den Kapitelseiten (gemeinsame
   `Fortschrittszeile`), je Kapitel ein kleiner Ring.
4. **Update:** Ist eine neue Version gefunden, ersetzt „Jetzt aktualisieren“ den Knopf „Nach
   Update suchen“.
5. **Darstellung und Training:** Reiter Brett, Figuren, Anzeige, Ton, Training mit Symbolen;
   Brettfarben und Figurensätze als Kacheln mit Vorschau (die Vorschau der einen Wahl zeigt die
   jeweils andere aktuelle Wahl mit).
6. **Daten auf diesem Gerät:** kurzer Satz, Einzelheiten (auch iPhone und Safari) hinter dem
   Fragezeichen; ebenso die Datensicherung.
7. **Absichtliche Fehler der Engine** stehen nicht mehr in den Einstellungen, sondern unter
   Spielen bei einer Stufe ohne vorgefertigten Gegner (aufklappbar, Stand in der Überschrift).
   Sie gilt seitdem nur für die eigene Stufe, nicht mehr für vorgefertigte Bots (Empfehlung nach
   Regel 9, Rückfrage S22): Die Bots sind mit ihrer eigenen Liste gemessen und beschrieben, und
   eine unsichtbare Liste, die heimlich wirkt, wäre verwirrend.

Kapitelseiten:

8. Ringe statt Balken auch in der Kapitelliste des Buches (kleiner Ring).
9. Trainer und Übungen in einer Karte „Training und Übungen“.
10. „Alle abhaken“ und „Alle zurücksetzen“ direkt über der Galerie (Kopf „Abbildungen“ mit der
    30-Sekunden-Erklärung hinter dem Fragezeichen); Galerie in `Abbildungsgalerie.tsx`.
11. Abschnitte aufklappbar mit Ring, Stand und eigenem Knopf „Abschnitt 1.4 abhaken“ / „Haken
    in 1.4 lösen“ (ohne Rückfrage, weil ein Abschnitt klein ist und der Knopf sich selbst
    umkehrt). Anfangs offen sind nur Abschnitte mit offenen Abbildungen (Empfehlung nach Regel
    9); die kleinen Bretter entstehen erst beim Aufklappen.

Spielen:

12. Gegnerwahl mit drei Kacheln (Eigene Stufe, Vorgefertigte Bots, Eigene Bots); darunter nur
    der Inhalt der gewählten. Der Wechsel wählt gleich einen passenden Gegner
    (`gegnerkategorie.ts`), damit die Partie zur sichtbaren Wahl passt; „Eigene Bots“ ohne
    gewählten Bot sperrt „Partie beginnen“. Die Verwaltung eigener Bots ist keine eigene Karte
    mehr, sondern Teil von „Eigene Bots“.
13. Die Eröffnungswahl gilt für alle drei Kategorien (Engine aus der Grundstellung) und bleibt
    deshalb unten, wie der Autor es für diesen Fall wollte.
14. Engine-Knopf in der Partie statt der gestuften Hinweise (`SpielEngine.tsx`,
    `spielEngineSchritte.ts`): 1. Bewertung, 2. Zeichen des eigenen letzten Zuges ohne
    Erklärung, 3. „Warum?“ nur bei ?!, ? und ?? (Regel des Buches aus `spiel/erklaerung.ts`,
    besserer Zug), 4. bester Zug jetzt mit goldenem Pfeil. Je Stellung 1,5 Sekunden Rechenzeit
    (Konzept 8.1); Schritt 2 rechnet die Stellungen vor und nach dem eigenen Zug. In gewerteten
    Partien fehlt der Knopf wie vorher der Hinweis (S9).

## Rückmeldung zu 0.2.80 und neue Figurensätze (18.10.2026 nachmittags, Opus, Zweig `layout-nachtrag`, Version 0.2.82)

Rückmeldung des Autors zum Layout von 0.2.80:

1. **Blinde Flecken bei eigener Stufe:** neue Vorliebe `blindeFlecken` (Vorgabe keine; ältere
   Daten ohne Eintrag lesen sich so, kein neues Format), Abschnitt „Blinde Flecken der Engine“
   unter den absichtlichen Fehlern; gilt nur ohne vorgefertigten oder eigenen Bot.
2. **Abschnitte der Kapitelseite anfangs eingeklappt,** mit Pfeil (rechts zu, unten auf). Die
   Regel-9-Empfehlung aus 0.2.80 (offen, wo etwas fehlt) ist damit ersetzt.
3. **Reiter:** nur noch waagerecht scrollbar (`overflow-y: hidden`; vorher machte
   `overflow-x: auto` die Zeile auch senkrecht um den 3-px-Unterstrich verschiebbar).
4. **Engine in der Partie als Symbol am Brett** (Prozessor wie bei den Abbildungen) statt eines
   großen Knopfes unten: Das Symbol zeigt gleich die Bewertung, die weiteren Schritte sind kleine
   Schaltflächen in der Karte direkt unter dem Brett. Es gehört zur Spielhilfe „Werkzeuge“, die
   übrigen Symbole zur Spielhilfe „Symbole“.

**Figurensätze (Wunsch des Autors):** Die neun Sätze aus seiner Auswahl ersetzen „klassisch“ und
„Holz“; „wie im Buch“ bleibt. Quelle der Dateien ist `pipeline/figuren/saetze/` (mit
`LIZENZEN.md` und den Lizenztexten), die App liefert Kopien unter `app/public/figuren/<satz>/`
aus. Die drei Holzsätze erzeugt `pipeline/figuren/holz_maserung.py` aus den Originalen in
`saetze/quelle/` (Test `pipeline/tests/test_holz_maserung.py` prüft, dass die eingecheckten
Dateien dem Skript entsprechen). Gespeicherte alte Werte werden übernommen: „klassisch“ und
„kontrastreich“ → Cburnett (dieselben Figuren), „holz“ → Kiefer & Kirsche (Holz bleibt Holz).
Lizenztexte für MIT (chess-art) und Apache 2.0 (Chessnut, mit Copyright-Datei) liegen in
`app/public/lizenzen/`; die Seite „Lizenzen“ der App nennt jeden Satz. Aus der mitgeschickten
Zip-Datei wurden nur Figuren, Lizenzen und Skript übernommen; die beigelegten Fassungen von
`docs/ENTSCHEIDUNGEN.md`, `FORTSCHRITT.md` und `LIZENZEN.md` waren ein alter Stand (0.2.32) und
hätten Neueres überschrieben.

## Genauigkeit und Spielstärke neu geeicht: Ergebnis und Einbau (18.10.2026 nachmittags, Opus, Zweig `eichung`, Version 0.2.83)

Umsetzung des Plans „Genauigkeit und Spielstärke neu eichen“ (Abschnitt oben), Schritt d nach
Freigabe des Autors („Ja, bau es so“). Rohdaten und Bericht nur lokal (`buch/arbeit/eichung/`).

**Daten:** je 300 gewertete Schnellschach-Partien von chess.com und Lichess, je 30 in jedem
200-Punkte-Band von 400 bis 2200 (600 Seiten je Plattform), mit der Engine der App nachgerechnet
(Stockfish 19 lite, Tiefe 18). Etwa 20 % der Seiten blieben als Kontrolle außen vor.

**Genauigkeit (Kontrolle, Abweichung in Prozentpunkten):** Lichess-Rechnung gegen Lichess im
Mittel −1,1, Betrag 2,4 (alle 600 Seiten). Gegen chess.com: Lichess-Rechnung +2,4/6,9, Mittelweg
+1,7 bis +2,6/6,3 bis 6,5, nahe chess.com +0,9 bis +2,7/5,4 bis 5,8 (zwei Läufe mit erweitertem
Raster). chess.com veröffentlicht seine Rechnung nicht; näher als etwa ±6 kommt man an eine
einzelne Partie nicht heran. Eingebaut: Polster 1 (Lichess), 0,55 (Mittelweg, Standard), 0,1 (nahe
chess.com), Abfall überall 0,04354 (0,040 passte auf den Eichpartien etwas besser, auf der
Kontrolle schlechter, also Rauschen).

**Spielstärke (Kontrolle, Schätzung minus echte Wertung):** je Partie im Betrag 370 bis 480,
Streuung 440 bis 560; über zehn Partien 240 bis 440 (die umgekehrte Kurve hilft auf der
chess.com-Seite: 438 → 370, auf der Lichess-Seite nicht: 257 → 285). Die Genauigkeit einer
Partie sagt wenig über die Wertung; sie hängt stark vom Gegner und vom Verlauf ab. Eingebaut
(`spiel/staerkemodell.ts`): je Partie die Mitte der beiden Kurven Genauigkeit → Wertung
(chess.com, Lichess) mit Spanne ±400, beide Einzelwerte hinter dem Fragezeichen; über die letzten
höchstens zehn Partien je Skala das Mittel aus Einzelschätzungen und umgekehrter Kurve, Spanne
von ±400 (eine Partie) bis ±250 (zehn Partien), Karte „Deine Spielstärke“ im Bereich Spielen.
Spielstärke und Urteilswort je Phase hängen an der inneren Genauigkeit (Lichess-Rechnung), nicht
am Schalter.

**Auswertung in der App:** feste Tiefe 18 wie bei der Eichung (Zeitgrenze 4 s nach der Partie,
8 s während der Partie), Nachprüfung verdächtiger Werte mit Tiefe 22.

**Ersetzt:** die Tabelle von 0.2.72 (sieben Partien des Autors, N290 und die alte S20 sind damit
erledigt; S20 fragt jetzt nur noch nach dem Zurücksetzen der Wertung). Offen bleibt S23 (Elo je
Bot-Stufe): braucht die Züge aus der Bot-Messung, die der andere Chat betreut.

## Neue Bretter und Rahmen im Dunkelmodus (18.10.2026 abends, Opus, Zweig `bretter`, Version 0.2.84)

Auswahl des Autors (Zip „figurensaetze_fuer_repo“ mit `bretter/`, Werte in
`pipeline/bretter/farben.json`, Herkunft in `pipeline/bretter/LIZENZEN.md`).

- **Brettfarben in drei Gruppen:** Farben (Wie im Buch, Grün, dazu neu Braun, Blau, Sand, Koralle,
  Lavendel, Nacht), Holz (das bisherige „Holz“, jetzt „Ahorn & Nussbaum“; gespeicherter Wert
  `holz` bleibt, keine Umwandlung nötig), Material (Intarsie Ahorn & Kirsche, Holz klassisch,
  Marmor grün). Die gespeicherten Werte sind die Kennungen aus `farben.json`; unbekannte Werte
  fallen wie bisher auf „Wie im Buch“ zurück.
- **Schimmer des letzten Zuges je Brett:** Gelbgrün (`rgba(155, 199, 0, 0.45)`, wie Lichess) auf
  Holz und dunklen Farben (Braun, Blau, Lavendel, Nacht, Ahorn & Nussbaum, Intarsie, Holz
  klassisch), sonst das Blau der App. Figurenfarbe Schwarz überall.
- **Materialbretter als Bild:** ein ganzes Brettbild (8 × 8 Felder) über den Feldfarben, unter
  Markierungen und Figuren (`Brettbild` in `ui/brett/Holzfelder.tsx`); die Feldfarben darunter
  sind die gemessenen Mittelwerte der Bilder und gelten für Vorschau, Markierungen und Ränder.
  Bei gedrehtem Brett bleibt das Bild stehen (die Felder sind gleich gefärbt, a1 dunkel). Die
  Bilder sind von Lichess (AGPLv3 oder neuer), in der App als WebP (Qualität 82), weil der
  Offline-Speicher keine JPEG-Dateien vorhält; Lizenztext unter `/lizenzen/agpl-3.0.txt`.
- **Rahmen der gewählten Vorschaukachel im Dunkelmodus:** Gold statt Navy (Rückmeldung des
  Autors mit Bildschirmfoto: Navy auf dunklem Grund kaum zu sehen), gleiche Regel wie beim
  gewählten Reiter und bei den Chips.

## Elo-Zahl der Bots (18.10.2026 abends, Opus, Zweig `bot-elo`, Version 0.2.85)

Rückfrage S23 (Elo-Angaben der Bot-Stufen), nach Rücksprache mit dem Autor: Er wollte Zahlen auf
der Skala von „Deine Spielstärke“, je Stufe einen Bereich (leichte Überschneidungen erlaubt) und
je Bot eine eigene Zahl. Die Bewertungen eines anderen Chats (Zweig `botstaerke`) gelten nicht
(„Es zählt am Ende dein Plan“); der Zweig wird nicht übernommen.

- **Verfahren:** Die Genauigkeit einer Bot-Partie taugt nicht als Maß je Bot (sie hängt vom
  Gegner ab, die Kurven ziehen zur Mitte). Deshalb kommen die **Abstände aus Ergebnissen**: eine
  Elo-Leiter nach Bradley und Terry mit einem gedachten Remis je Begegnung (`engine/eloleiter.ts`)
  aus 806 Partien: reine Stufen gegen ihre Nachbarn, jeder Bot gegen seine Stufe und gegen die
  Stufe darüber (Stufe 1 bis 4), dazu die gültigen Partien der Messung aus 0.2.81. Die **Lage**
  kommt aus Ankern: Stufen spielen 20 Partien gegen sich selbst, die Züge werden in Tiefe 18
  bewertet, und die innere Genauigkeit beider Seiten geht in Blöcken zu zehn durch dieselbe
  Rechnung wie „Deine Spielstärke“ (`staerkeUeberPartien`). Eine gemeinsame Verschiebung legt die
  Leiter auf die Anker; die Abstände bleiben die der Ergebnisse. Messlauf
  `engine/botstaerke.messung.ts` (Daten nur lokal in `buch/arbeit/botelo/`), Ausgabe
  `engine/botstaerke-daten.ts`.
- **Anker:** Stufe 1: 70,3 % → 1188; Stufe 2: 77,2 % → 1563; Stufe 3: 82,7 % → 1888. Die Leiter
  trifft sie auf +8, −31 und +23 Punkte, Ergebnisse und Genauigkeit passen also zusammen. Stufe 4
  bis 6 (86 bis 92 %) liegen über dem Ende der Eichkurven (die umgekehrte Lichess-Kurve endet bei
  83,4 %) und ergeben alle 2000 bis 2100; sie gelten als gesättigt und verankern nicht (Grenze
  83 % im Messlauf).
- **Ergebnis:** Stufe 1 bis 8: 1195, 1532, 1911, 2080, 2359, 2595, 2912, 3223. Bots je Stufe:
  1042 bis 1301, 1392 bis 1688, 1887 bis 2075, 1870 bis 2161 (Jan 1870), 2200 bis 2409, 2436 bis
  2671, 2630 bis 3014, 2976 bis 3223. Unsicherheit je Bot durch Nachziehen der Ergebnisse
  (200 Durchgänge): Median ±118, höchstens ±234; die Erklärung in der App sagt „etwa ±150“.
  GM Grün (wie Stufe 8 eingestellt) landet auf derselben Zahl wie Stufe 8, eine Probe des
  Verfahrens.
- **Anzeige:** auf 50 gerundet, über 2200 nur „über 2200“, unter 400 nur „unter 400“ (dort hat
  die Eichung keine Partien). Überschrift je Stufe: Bereich ihrer acht Bots (Stufe eines Bots =
  gerundeter Durchschnitt seiner Phasen). Kachel: Zahl des Bots. Sprechblase: „etwa 1550
  (Stufe 2)“ mit Erklärung hinter dem Fragezeichen. Eigene Bots und eigene Stufen: aus dem
  Mittel der drei Stufen je Phase zwischen den reinen Stufen linear geschätzt, „(geschätzt)“.
  Keine Zahl je Phase. Karte „Spielstärke“ im Rückblick: „Leon (etwa 1300) hat in dieser Partie
  wie etwa … gespielt.“
- **Wertung:** Eine gewertete Partie rechnet jetzt mit der festen Zahl des Bots (oder der
  Schätzung bei eigenen Stufen) als Gegnerwertung statt mit seiner Leistung in der Partie (die
  streut um etwa ±400 und ist nach oben gedeckelt). Gespeicherte Wertungspunkte bleiben, das
  Format ändert sich nicht.
- **Stufe 3 schwächer:** Die reine Stufe 3 war so stark wie Stufe 4 (12 : 8 für Stufe 3) und
  verletzte damit Konzept 8.2 („Jede Stufe gewinnt die Mehrheit gegen die Stufe darunter“).
  Fehlerquote 0,2 statt 0,15, Temperatur 0,6 statt 0,5. Neu gemessen: 3 : 17 gegen Stufe 4,
  19,5 : 0,5 gegen Stufe 2. Die 18 Bots mit einer Phase auf Stufe 3 und alle Brücken der Stufe 2
  sind neu gemessen. Pit und Sophie holen 5 : 1 gegen Stufe 2, Frieda 1 : 5; Jan (Stufe 4) 1 : 5
  gegen Stufe 4. Ein Versuch, Jan mit [4, 4, 5] zu stärken, änderte nichts (1 : 5) und ist
  zurückgenommen; Jan bleibt Grenzfall und schwächster Bot der Stufe 4.
- **Offen (S24):** Auf dieser Skala sind die Bots stärker als ihre Namen (Stufe 1 etwa 1200,
  Stufe 5 bis 8 über 2200). Unklar bleibt, ob ein Bot mit 70 % so spielt wie ein Mensch mit
  70 % (Bots machen seltene grobe Fehler, Menschen viele mittlere); das prüft nur ein Mensch
  (N335). Vorschlag an den Autor: nach N335 die Stufen 1 bis 4 schwächer machen und alle Bots neu
  messen. Nicht vorab umgesetzt, weil es alle 64 Bots und die Abstufung aus Konzept 8.2 ändert.

## Auswertung, Werkzeuge und Training übersichtlicher (18.10.2026 abends, Opus, Zweig `auswertung-ausbau`, Version 0.2.86)

Wünsche und Rückmeldungen des Autors vom Abend, nach Regel 9 gleich umgesetzt.

- **Gewinnchance statt Bauerneinheiten im Rückblick:** Stockfish rechnet seine Zahl seit 15.1
  aus der Gewinnchance; eine Figur mehr ergibt 5 bis 7, chess.com zeigt kleinere Zahlen
  (nachgerechnet: 10. Tab1?? −5,8 lite, −7,1 volles Netz, chess.com −3,28). Die Karte nennt die
  Gewinnchance vorher und nachher (Lichess-Formel), das Material die Erklärung nach dem Buch.
  Neue Regel „schlägt nicht zurück“ (Kapitel 1, Abtausch): Der beste Zug schlug auf dem Feld, auf
  dem der Gegner gerade geschlagen hatte, der gespielte nicht.
- **Nebenzweige:** „Besser war …“ (Hauptvariante vor dem Zug) und „So wird der Fehler bestraft“
  (Hauptvariante nach dem Zug, bei „?“ und „??“) als antippbare Züge am Brett, aus den
  gespeicherten Varianten der Auswertung (höchstens sechs Halbzüge).
- **Engine-Wachhund:** Kommt lange nach der Rechenzeit (plus 10 s) kein „bestmove“, startet der
  Dienst die Engine neu und lehnt den Auftrag als abgebrochen ab; Partie und Auswertung versuchen
  es dann erneut. Grund: Fehlerbericht „Auswertung startet nicht“; ein vom Handy beendeter Worker
  ließ den Auftrag ewig offen.
- **Werkzeugkarten ohne „Mehr …“:** Die Stufen von 0.2.30 (Vorschlag D6) sind entfallen; jede
  Karte zeigt alle Befunde. Werkzeugleiste waagerecht scrollbar mit Symbol je Bündel.
- **Auswertung:** Schalter „Genauigkeit wie“ in der Karte, Symbole je Zeile, Marken je Zugklasse,
  grobe Patzer beider Seiten mit Farbe, drei Engine-Fehler und „Alle zeigen“.
- **Spielen, Einstellungen, Training:** „Partie beginnen“ unter den Kategorien, Stufen
  aufklappbar mit Merker auf dem Gerät; Kacheln „Über die App“ und „Einstellungen“, Vorschau
  2 × 2; Trainer als Zeilen mit Symbol, Übungen als Nummernraster.

## Rückmeldung zu 0.2.86 (18.10.2026 spätabends, Opus, Zweig `rueckmeldung-0.2.86`, Version 0.2.87)

- **„Genauigkeit wie“ nur in der Auswertung:** Genauigkeiten zeigt die App nur in der Auswertung
  einer Partie (die Partienliste zeigt die Spielstärke, die nicht vom Schalter abhängt; nur bei
  zu wenigen Zügen die Genauigkeit). Deshalb ist der Schalter aus Einstellungen › Training
  entfernt; der gespeicherte Wert bleibt und wird in der Auswertung umgeschaltet. Als
  Segmentleiste in einer Zeile mit Fragezeichen (Erklärung aller drei Rechnungen).
- **Namen:** „Mittelweg“ heißt „App“ (der Standard dieser App), „nahe chess.com“ kurz
  „chess.com“; das „nahe“ erklärt das Fragezeichen. Gespeichert bleiben die Kennungen
  `mittelweg` und `chesscom`, keine Umwandlung nötig.
- **Tabellen:** feste Spaltenbreiten (Name 36 %, bei den Zugklassen 64 %), Umbruch in den Zellen.
- **Trainer:** „Trainieren“ als runder Symbolknopf (Name bleibt für Bildschirmleser), lange
  Namen brechen um.
- **Bretter:** Holz und Material in einer Gruppe.

## Spaß-Bots und Zahlen über 2200 (18.10.2026 abends, Opus, Zweig `spass-bots`, Version 0.2.88)

Rückmeldung des Autors zu 0.2.85: Ab Stufe 5 stand überall „über 2200“, obwohl die Kalibrierung
die Stufen klar trennen sollte; er erwartete oben etwa 2700 und mehr. Dazu wünschte er eine
Spaßkategorie unter den Einsteigern mit vier Bots um 500 bis 1000.

- **Obere Stufen:** Die Bots waren getrennt (Leiter: Stufe 5 bis 8 etwa 2360, 2600, 2910, 3220),
  nur die Anzeige hörte bei 2200 auf, weil dort die Eichdaten von „Deine Spielstärke“ enden.
  Seit 0.2.88 zeigt die App die Zahl der Leiter auch darüber; die Grenze liegt erst bei 3300
  (über der vollen Engine). Die Erklärung sagt, dass die Zahl über 2200 allein aus Ergebnissen
  gegen die verankerten tieferen Stufen kommt und ungenauer ist (etwa ±200).
- **Spaß-Bots:** neue Eigenschaft „Anteil an Zufallszügen“ (`engine/zufallszug.ts`, Würfel in
  `waehleZug` vor allem anderen, Umwandlung immer in eine Dame), sonst Stufe 1 mit den groben
  Fehlern. Die Partie liest den Anteil zur Laufzeit aus der Liste der Bots, das Speicherformat
  bleibt unverändert. Eigene Gruppe „Zum Spaß“ vor Stufe 1 (Schlüssel 0 im Merker der offenen
  Gruppen), Sprechblase „(zum Spaß)“. Kennungen ohne Bindestrich (`willi`, `trude`), weil der
  Messlauf Paarungen am letzten Bindestrich trennt.
- **Messung (je Runde neu, alte Daten nach `buch/arbeit/botelo/veraltet/`):** Runde 1 mit 75, 50,
  35, 20 %: etwa 300 bis 1050, Willi und Trude gleich. Runde 2 mit 60, 42, 32, 25 %: 550 bis 870.
  Runde 3 mit 60, 38, 25, 15 % (je 20 Partien gegen Stufe 1, gegen den Nachbarn und den
  übernächsten): Fritzi 584, Onkel Willi 777, Tante Trude 883, Bruno 1081 (je etwa ±70 bis 90).
  Nach zwei Anpassungen Schluss (Regel gegen endloses Nachjustieren aus der Messung der 64 Bots);
  Bruno liegt etwas über dem Wunsch.
- **Folge für S24:** Der Vorschlag, Stufe 1 bis 4 schwächer zu machen, entfällt, weil die
  Spaß-Bots den unteren Bereich abdecken. Offen bleiben die Namen der Stufen, abhängig von N335.
- **Beobachtung:** `engine/zentrumsschlag.test.ts` (echte Engine) schlug einmal im vollen Lauf fehl
  und lief allein und im zweiten vollen Lauf grün; vermutlich knappe Rechenzeit unter Last.

## Gleich große Kacheln in der Gegnerwahl (18.10.2026 abends, Opus, Zweig `kacheln-gleich`, Version 0.2.89)

Bildschirmfoto des Autors: In Stufe 8 waren die Kacheln von Großmeister Grün und GM Lindqvist
größer. Ursache: `grid-template-columns: repeat(4, 1fr)` lässt eine Spalte nie schmaler werden
als ihren Inhalt, und die Namen standen ohne Umbruch. Jetzt `minmax(0, 1fr)`, die Kachel darf
schrumpfen, Namen brechen mittig um (statt abgeschnitten zu werden). Der Oberflächentest misst
die acht Porträts der Stufe 8; mit dem alten Stil wichen sie um 24 Pixel ab.

## Ziehen per Wischen (18.10.2026 abends, Opus, Zweig `ziehen-wischen`, Version 0.2.92)

Auftrag des Autors (abgesegnet am 18.10.2026): Figuren mit Finger oder Maus ziehen, zusätzlich
zum Antippen, in den Einstellungen abschaltbar (Voreinstellung an), ohne dass das Scrollen der
Seite leidet.

- **Wo es gilt:** überall, wo die Brettbedienung „Ziehen“ wirkt (`useBrettbedienung`), also
  Partie, Abbildungen mit „Ziehen“, Übungen und alle Trainer mit Zügen. Stellungseditor,
  Zähl- und Koordinatentrainer bleiben beim Antippen.
- **Scrollen:** `touch-action: none` nur auf den Knöpfen der Felder mit ziehbarer Figur
  (`ziehbareFelder` in `schach/weiterspielen.ts`); alle anderen Felder behalten `manipulation`
  des Brettes. Ein Wischen beginnt erst nach 6 Bildpunkten Bewegung, darunter bleibt es ein Tipp.
- **Ablegen:** regelgerechtes Feld → Zug (mit Umwandlungswahl wie beim Tippen); Startfeld,
  verbotenes Feld oder neben dem Brett → die Figur bleibt gewählt. Der Klick nach dem Ablegen
  wird 400 ms gesperrt, sonst wählte er die Figur gleich wieder ab.
- **Einstellung:** Merker `wischen` auf dem Gerät statt im Speicherformat, wie die Koordinaten:
  hängt von Gerät und Hand ab, nicht vom Lernstand; außerdem bleibt das Speicherformat für die
  parallel laufende Erweiterung frei.
- **Aufbau:** `ui/brett/useZiehen.ts` (Zeiger-Ereignisse), `geometrie.ts` `feldAnPunkt`,
  Marken aus `Brett.tsx` nach `Brettmarken.tsx` (Datei unter 400 Zeilen). Oberflächentest
  `tests/e2e/wischen.spec.ts`: Maus, Finger (Touch über CDP, nur Chromium), Scrollen und
  Abschalten.

## Lernsammlung (18.10.2026 nachts, Opus, Zweig `lernsammlung`, Version 0.2.93, Format 5)

Auftrag des Autors (abgesegnet am 18.10.2026): eigene Stellungen aus Abbildung, Partie oder
Trainer mit Notiz und einem Plan-Satz speichern, nach Eröffnung geordnet, PGN-Export für
Lichess-Studien, in der Datensicherung enthalten (Pflichtenheft Stufe 3, AP 15, Konzept 4.7).

- **Format 5:** neues Feld `sammlung` in den Nutzerdaten (`training/lernsammlung.ts`,
  `sammlungAus`). Anders als die stillen Ergänzungen ohne neue Nummer (Figurensatz, 0.2.90
  Trefferzahl und Plan) erhöht die Sammlung die Formatnummer: Eine ältere App würde das
  unbekannte Feld beim nächsten Speichern verwerfen, und eigene Notizen sind zu wertvoll dafür.
  Format 4 und älter lesen sich mit leerer Sammlung; Tests in `format.test.ts` und
  `sicherung.test.ts` (Rundreise).
- **Eintrag:** Stellung, Herkunft (Abbildung, Partie, Trainer, eigene FEN) mit Fundstelle,
  Eröffnung, Plan (höchstens 200 Zeichen), Notiz (1000), wenn bekannt der Weg (Start und Züge).
  Höchstens 1000 Einträge.
- **Eröffnung:** beim Speichern vorgeschlagen, änderbar: Buchvarianten der Kapitel 2 und 3
  (die Stellung, sonst die letzte Buchstellung des Weges), sonst die Familie aus der
  Lichess-Liste ohne Variante (damit die Gruppen nicht zu fein werden), sonst leer.
- **Wo man sammelt:** Lesezeichen am Brett der Abbildung (neben „Brett drehen“, ein Symbol statt
  einer Zeile, weil der Autor Platz sparen will); Rückblick einer Partie unter dem Zug; nach
  jeder beantworteten Trainer-Aufgabe (die Aufgabe meldet ihre Stellung über
  `ui/trainer/sammelstellung.ts`; bei Taktik und Endspiel die Ausgangsstellung, bei Repertoire,
  Zug erraten und Abweichung die erreichte Stellung).
- **Bildschirm:** eigener Bildschirm „Lernsammlung“ mit Karte im Training (die Sammlung gehört
  zum Lernen, nicht zu den Einstellungen; sie ist kein Trainer des Pflichtenhefts, deshalb kein
  neuer Eintrag in der Trainerliste, deren Namen ins Buch kommen).
- **Abfrage:** zufällige Folge, „Plan zeigen“ deckt auf; ohne Speichern. Eine Wiederholung nach
  Kästen wäre der nächste Schritt, falls der Autor sie möchte.
- **PGN:** je Eintrag eine Partie; Lichess benennt Kapitel nach „Weiß – Schwarz“, daher Weiß =
  Eröffnung, Schwarz = Fundstelle, dazu `ChapterName`. Mit Weg: Züge ab dem Start, sonst
  `[SetUp]`/`[FEN]`. Plan und Notiz als Kommentar am Ende. Ganze Sammlung oder je Gruppe,
  kopieren oder als Datei.
- **Oberflächentest:** `tests/e2e/lernsammlung.spec.ts` (Abb. 2.2 sammeln, Neuladen, Gruppe,
  Abfrage, PGN-Datei, Löschen).

## Technik für die englische Fassung (18.10.2026 nachts, Opus, Zweig `sprache-technik`, Version 0.2.94)

Auftrag des Autors (abgesegnet am 18.10.2026, AP 18 ohne Übersetzung).

- **Sprachwahl:** `i18n/sprache.ts` (verfügbare Sprachen = eingetragene Sprachdateien,
  `startsprache`, Wechsel mit Benachrichtigung), `app/sprachwahl.ts` (Start, Wahl, `useSprache`).
  Die Wahl liegt als Merker `sprache` auf dem Gerät, nicht in den Nutzerdaten: Sie muss beim
  Start sofort da sein, bevor IndexedDB geladen ist, und ohne Wahl gilt die Sprache des Geräts
  (`navigator.languages`, erste verfügbare, sonst Deutsch). In den Einstellungen (Reiter
  Anzeige) erscheint eine Auswahl erst ab zwei Sprachen.
- **Wechsel:** vergisst geladene Buch- und Trainerdaten (`vergissBuchdaten`,
  `vergissTrainerdaten`), die Datenordner hängen an der Sprache (`/daten/<sprache>/a1`,
  `/daten/<sprache>/trainer`), `App.tsx` baut die Oberfläche mit `key` neu auf;
  `document.documentElement.lang` folgt (Start in `main.tsx`).
- **Feste Texte:** Lizenzen (alle Bausteine, Überschriften), die Angaben unter „Fehler melden“
  und der Kopf der Meldung auf der Aufgabenseite stehen jetzt in `de.json`. Die Namen der
  Bot-Gegner bleiben Eigennamen (Dateien des Bot-Chats).
- **Klartextzüge:** `pipeline/lesen/klartextzuege.py` markiert Zugfolgen mit Zugnummer in den
  Bildunterschriften als Teil `zug` (697 Stellen, nur was `lies_zuege` liest, nur normaler
  Stil). Die App zeigt sie mit `buchzugInSprache` (auf Deutsch unverändert, auf Englisch
  „Lf4“ → „Bf4“, „=D“ → „=Q“). Die Kapiteldaten sind nur um diese Markierung ergänzt; die
  Buchquellen sind neuer als die Daten (Literaturnummern im Glossar, Kapitel 1 und 11) und
  werden beim nächsten vollen Datenlauf übernommen, nicht in diesem Zweig.
- **Tests:** `i18n/sprache.test.ts`, `schach/notation.test.ts`, `pipeline/tests/test_klartextzuege.py`,
  Oberflächentest `tests/e2e/sprache.spec.ts`.

## Befunde aus dem Durchprüfen der Aufgabenliste (18.10.2026, Opus, Zweig `aufgaben-zurueck`, Version 0.2.95)

Gefunden beim Durchprüfen der Aufgabenliste (N307): Nach einem Link und „‹ Zurück zu den
Aufgaben“ stand die Seite oben statt beim angetippten Punkt. Ursache: Die Seite merkte sich den
Punkt („zuletzt“) erst im State-Updater von React; der Link baute die Seite ab, bevor der Updater
lief, und im Merker blieb `zuletzt: null`. Jetzt schreibt `aendere` den Merker sofort aus dem
neuesten Stand (Referenz, die sich nur dort ändert). Ein neuer Oberflächentest öffnet einen
Abschnitt weit unten, folgt einem Link und prüft, dass der Punkt nach der Rückkehr im Bild ist;
mit dem alten Stand schlug er fehl.

Weitere Fehler, die das Durchprüfen von Teil 1 mit Playwright fand, alle behoben:

- **Endspieltrainer, Hinweis 2 und 3 (N254 bis N256):** Goldene Figur und goldener Pfeil fehlten
  bei Figurenzügen. Die Engine liefert den Zug in UCI („b3b7“), die Markierung erwartete SAN;
  nur Bauernzüge las der SAN-Leser zufällig richtig. Jetzt wird erst umgewandelt. Der
  Oberflächentest des Endspieltrainers prüft den Pfeil bei der Mattführung (mit dem alten Stand
  rot). Danach ließen sich Mattführung bis „Matt! Ziel erreicht.“ und ein Turmendspiel bis
  „Zwölf Züge gehalten“ mit den Hinweisen ausspielen.
- **„..“ nach „Warum?“ (N320):** Der Text „Warum: Der Zug {text}.“ setzte einen zweiten Punkt
  hinter die Erklärung, die schon mit Punkt endet.
- **Uhr nach der Rückkehr aus dem Hintergrund (N179):** Die Anzeige rechnete einen Takt lang mit
  der alten Uhrzeit und zeigte die Zeit im Hintergrund kurz als Guthaben (5:21 statt 5:00).
  Jetzt frischt die Rückkehr die Uhrzeit der Anzeige sofort auf.
- **Einzahl:** „1 Durchgang“ (Fortschritt im Kapitel, N195), „1 gewertete Partie“ (Deine
  Wertung, N224), „aus 1 Partie“ (Deine Spielstärke, N326).
- **„Aus dem Buch: Abb. 0.12“ beim Zug ausführen (N314):** Die Sonderzüge an den Buchstellungen
  nannten ihre Abbildung nicht, obwohl der Nachtest das versprach; jetzt steht sie unter dem
  Brett wie in den anderen Trainern.
- **Nicht behoben, bleibt als Befund bei N180:** Beim schnellen Neuladen am Rechner ging die
  Bedenkzeit seit dem letzten Zug verloren (die Uhr stand danach wieder auf der Zeit beim
  letzten Engine-Zug). Das Anhalten beim Verlassen wird zwar gespeichert, aber das Schreiben in
  die Datenbank wird beim Neuladen abgebrochen. Eine sichere Lösung bräuchte einen zweiten,
  sofortigen Speicherweg für die Uhr; auf dem Handy (App wechseln, dann schließen) bleibt
  meist genug Zeit zum Schreiben. Der Autor prüft das auf dem Handy.
- **Partie zu zweit (N222):** Die Auswertung sagte „Die Engine hat in dieser Partie keinen
  absichtlichen Fehler gemacht.“, obwohl keine Engine mitspielte. Der Abschnitt fehlt jetzt bei
  Mensch gegen Mensch; der Oberflächentest „Stellung aufbauen … zu zweit“ prüft es.
- **Erklärung der Karte „Spielstärke“:** nannte noch „in den Einstellungen (wie Lichess,
  Mittelweg oder nahe chess.com)“; seit 0.2.87 steht der Schalter nur in der Karte und heißt
  „Lichess, App, chess.com“.
- **Kennungen mit zwei Buchstaben auf der Aufgabenseite:** Die Seite las nur Kennungen mit einem
  Buchstaben (N307, F5); die Rückfragen der parallelen Chats heißen NA1, LS…, ZF… und ließen
  sich nicht abhaken. Jetzt gelten ein oder zwei Großbuchstaben.
- Kein Fehler: Die Rochade heißt im Trainer „O-O“ mit Buchstaben O, wie im Buch (190-mal O-O,
  nie 0-0).

## Aufgabenliste entlastet (18.10.2026, Opus, Zweig `claude/aufgabenliste-entlasten-6y3tgp`, nur Doku)

Auftrag des Autors vom 18.10.2026: `docs/AUFGABEN_AUTOR.md` kürzer machen, damit er auf dem Handy
nur noch liest, was wirklich sein Auge, sein Schachgefühl oder seine Entscheidung braucht.

### Teil 2 neu geordnet

Teil 2 hat jetzt oben „Nur bestätigen“ mit je einer Zeile für jede Rückfrage, die Claude schon
entschieden (meist umgesetzt) hat, damit der Autor mit „alle ok außer …“ antworten kann; darunter
„Buchbefunde“ (B6, D1, D2) und „Braucht deine Entscheidung oder Handlung“ (S24, S20, E4). Die
Kennungen sind geblieben (die App speichert Haken und Notizen je Kennung). Rückfrage A2 der
Trainerdaten ist dieselbe Frage wie T2 und steht dort mit Verweis; A1, A3, A4 und A5 entsprechen
T1, T3, T4 und T5.

- **K6 überholt durch 0.2.85 und S24:** K6 fragte, ob die Stufen ohne Elo-Zahl bleiben sollen
  („eine Elo-Zahl zeigt die App nicht“). Seit 0.2.85 zeigt die App je Stufe und Bot eine Zahl aus
  der Elo-Leiter (Abschnitt „Elo-Zahl der Bots“); die offene Frage zu Namen und Lage der Skala
  ist S24.

### Teil 1: von Claude geprüft am 18.10.2026 (gelöscht)

Geprüft mit Playwright an der gebauten App (Chromium, Pixel 7 mit 412 px Breite, hell und dunkel,
mit der echten Engine, wo nötig). Je Punkt, wie geprüft wurde.

- **N279** (Warnton und roter Hinweis bei gesperrter Figur): von Claude geprüft am 18.10.2026: in einer Partie zu zweit Lc1 in der Grundstellung („hat gerade keinen Zug“), h7 im Schach nach 3. Lb5+ („Erst das Schach beantworten“) und Sc6 gefesselt nach 4. a3: je der Satz und das rote Feld, beides nach unter 3 s weg. Den Warnton prüft der Autor bei N278
- **N280** (Schlagring statt Punkt): von Claude geprüft am 18.10.2026: Sf3 angetippt: auf e5 ein goldener Ring mit Navy-Rand, auf leeren Zielfeldern Punkte
- **N306** (Lizenzen): von Claude geprüft am 18.10.2026: Einstellungen › Lizenzen: Lichess-Puzzle-Eintrag mit CC0 1.0, beim Eintrag der App github.com/dobili/SvGa_Public
- **N308** (Einstellungen neu geordnet): von Claude geprüft am 18.10.2026: Reiter mit Symbolen, Holz-Vorschau unter Figuren, Anzeige und Training wie beschrieben, Erklärungen hinter den Fragezeichen von „Daten auf diesem Gerät“ (mit iPhone und Safari) und „Datensicherung“, keine Fehlerarten-Karte mehr. Abweichung im Text: Ringe gibt es für Abbildungen und Lernziele, Übungen und Trainer stehen als Zeilen, sobald es welche gibt
- **N309** (Kapitelseiten): von Claude geprüft am 18.10.2026: Kapitel 1: Fortschritt, „Training und Übungen“ (Trainer vor Übungen), Abbildungen mit Erklärung, „Alle abhaken“/„Alle zurücksetzen“, Abschnitte anfangs zu mit Pfeil und „0 von 7“, „Abschnitt 1.1 abhaken“ wird zu „Haken in 1.1 lösen“, Ring in der Buchliste
- **N322** (Neue Figurensätze): von Claude geprüft am 18.10.2026: drei Gruppen mit je drei Sätzen und „wie im Buch“; Kiefer & Kirsche und Spatial erscheinen am Brett von Abb. 1.26; alle Sätze mit Lizenz unter Lizenzen
- **N323** (Reiter ohne Wackeln): von Claude geprüft am 18.10.2026: Reiterzeile mit overflow-x auto und overflow-y hidden (nur waagerecht verschiebbar)
- **N329** (Rahmen der gewählten Kachel im Dunkelmodus): von Claude geprüft am 18.10.2026: gewählte Brett- und Figurenkachel dunkel Gold (201, 162, 39), hell Navy. Abweichung im Text: Die gewählte Gegnerkachel ist auch hell golden
- **N342** (Einstellungen): von Claude geprüft am 18.10.2026: Karten „Über die App“, „Einstellungen“ und „Deine Wertung“; Vorschau 2 × 2 Felder (je 66 px)
- **N343** (Training): von Claude geprüft am 18.10.2026: 13 Kapitelkarten mit Nummer, 19 Trainerzeilen mit Symbol, Fragezeichen und „Trainieren“; Übungen als Nummernraster, gelöste grün. „Halb angefangen“ ließ sich mit einem falschen Zug nicht auslösen (bleibt offen); nicht weiter verfolgt
- **N344** (Auswertung auf dem Handy): von Claude geprüft am 18.10.2026: Partie zu zweit (24 Halbzüge, aufgegeben): Karte „Spielstärke“ 348 px breit, Tabellen innerhalb, kein Überlauf der Seite; „Genauigkeit wie“ in einer Zeile mit Fragezeichen
- **N345** (Trainer): von Claude geprüft am 18.10.2026: alle 19 „Trainieren“-Knöpfe rund mit Abspielsymbol, kein Name abgeschnitten oder vom Fragezeichen verdeckt
- **N346** (Bretter): von Claude geprüft am 18.10.2026: Gruppe „Holz und Material“ da, „Genauigkeit wie“ fehlt unter Einstellungen › Training
- **N160** (Warum-Fragen): von Claude geprüft am 18.10.2026: Warum-Fragen an 1.26, 2.2 und 5.17 nach 30 s aufgeklappt, nirgends „vorbereitet“
- **N162** (Vorlauf): von Claude geprüft am 18.10.2026: Zugfolgen von 6.11 (61 Halbzüge) und 11.68 (18) führen von der Grundstellung genau zur Stellung der Abbildung; in der App von „Zum Anfang“ Halbzug für Halbzug bis zum Brett der Abbildung
- **N163** (Zielbilanz, Abb. 2.40): von Claude geprüft am 18.10.2026: 2.40: „Zentrum: ja – … e4 ist angegriffen“, e4 grau umrahmt (Sicht Weiß), darunter „Sxe4 gewinnt den Bauern e4 nicht: 3... Sxe4 4. De2 …“; 2.24: „d4 und e4“
- **N164** (Todsünden, Abb. 1.8): von Claude geprüft am 18.10.2026: 1.8: Überschrift „Mögliche Todsünden“, Hinweis „Nur Kandidaten …“, „3... Df6: mögliche verfrühte Dame“
- **N165** (Phase): von Claude geprüft am 18.10.2026: 11.28: „Eröffnung … Schwarz muss noch rochieren“, auch nach Wechsel der Sicht (über Röntgen; die Karte „Phase“ hat keinen eigenen Schalter); 12.2: Mittelspiel
- **N166** (Faktorenbilanz): von Claude geprüft am 18.10.2026: 3.6 „Weiß: teils – rochiert, aber ohne f-Bauern vor dem König“; 3.60 nur „Matt: Die Partie ist entschieden.“; 3.23 beginnt mit „Erst das Schach und die Taktik zu Ende rechnen …“
- **N167** (Warnsignale): von Claude geprüft am 18.10.2026: die drei Sätze an 4.29 (W4), 4.8 (W2) und 4.13 (W5) wörtlich
- **N168** (Skelett-Röntgen): von Claude geprüft am 18.10.2026: 5.30 Richtung für Weiß; 5.27 Hebel c4–c5 gold, weitere Hebel grau; 5.40 Läufer f4 mit goldenem Rahmen in Sicht Weiß; 5.13 „Luftloch h3: der König hat Luft auf h2“
- **N169** (Planfindung): von Claude geprüft am 18.10.2026: 6.4 in Sicht Schwarz „Der Gegenschlag ist schon da: d5 greift e4 an“; 6.17 LAP „Dringe mit Turm d2 nach d7 ein“ mit goldenem Pfeil; 6.32 nur „Erst das Schach beantworten …“
- **N170** (Taktik): von Claude geprüft am 18.10.2026: 7.14 alle Kandidaten mit „Material bis zur Ruhe“, „Am stärksten: 2. Th8+“, am Brett „2+!“; 7.10 „Sf7+: Abzug.“; 7.28 „De1+: Dauerschach.“; Übung an 7.53 „Dxc7: Überlastung.“
- **N171** (Opposition): von Claude geprüft am 18.10.2026: 8.23 nur Kf3, 8.36 der Quadrat-Satz, 8.53 „Reserve-Tempo h4“
- **N172** (Schlüsselfelder und Quadrat): von Claude geprüft am 18.10.2026: 8.29 „Weiß gewinnt mit e7 (Sonderfall 6. Reihe).“, 8.50 Satz zu verbundenen Freibauern, 8.46 „Nach a6 läuft der Bauer a6 durch“
- **N173** (Turmendspiel und Erkennungsbilder): von Claude geprüft am 18.10.2026: 9.3 Philidor-Satz, 9.23 „Mehrere Bauern am Brett“, 9.37 „getrennte Freibauern b5 und g5: meist gewonnen“
- **N174** (Kandidaten): von Claude geprüft am 18.10.2026: 12.4: „Auf b5: Dxf7# (Matt) – scheidet aus“, b5 nicht bester Kandidat; 12.3: „Auf f5: Sxe6 …“
- **N196** (Getauschte Abbildungen): von Claude geprüft am 18.10.2026: 2.29, 2.30, 3.31 bis 3.34 von „Zum Anfang“ nachgespielt (an Abzweigen über „Andere Züge hier“): Das Brett stimmt jeweils mit der Abbildung überein
- **N202** (Nummernsprung): von Claude geprüft am 18.10.2026: Tipp auf den Titel öffnet und schließt „Abbildung öffnen“, „1,28“ öffnet 1.28, „1.99“ meldet „gibt es nicht“ mit Vorschlägen, „Zurück“ führt zurück
- **N203** (Werkzeugtexte ohne Zahl): von Claude geprüft am 18.10.2026: 1.30 „Sxd4: gewinnt den Bauern“, 4.11 „Lxf3 (schlägt die Dame mit Gewinn)“, 7.14 „+5 (gewinnt die Dame); Engine +6,5“. An 4.13 lautet die Prüffrage „Sxd5 nimmt Material: Warum lässt Schwarz das zu?“, weil der nächste Buchzug selbst schlägt (so gewollt)
- **N247** (Berliner Endspiel (C8)): von Claude geprüft am 18.10.2026: 5.30 in Sicht Schwarz „Minderheit am Königsflügel (3 gegen 4)“ ohne Minderheitsangriff, Fazit „Schwarz spielt am Damenflügel …“; 5.32 für Weiß „Minderheitsangriff“
- **N274** (Werkzeuge (C1, C2, C5)): von Claude geprüft am 18.10.2026: 3.68 „Weiß: schlecht – der König steht im Schach und hat nur einen Zug“; 4.21 nur g2; 9.34 „Dauerschach“; Startseite „in Richtung Elo 2000“
- **N288** (Isolani aus Besitzersicht und Sonderfall 6. Reihe): von Claude geprüft am 18.10.2026: 5.17 Satz gegen den Isolani für Schwarz und Besitzer-Satz für Weiß; 5.18 ohne Isolani-Satz; 8.29 aus Sicht Schwarz „Weiß gewinnt mit e7 (Sonderfall 6. Reihe).“
- **N300** (Leerfälle der Werkzeuge (U12)): von Claude geprüft am 18.10.2026: die Leer-Sätze an 8.2 (Opposition, Schlüsselfelder, Quadrat), 1.26 (Sechs Regeln) und 8.1 (Zielbilanz, Angriffsregel) wörtlich und je einmal, ohne Legende; Zielbilanz im Mittelspiel (12.2) und Faktorenbilanz an 3.24 voll
- **N313** (Phase nach dem Glossar (S17)): von Claude geprüft am 18.10.2026: 11.4 zeigt den Glossar-Satz wörtlich, 11.12 Mittelspiel; die eigene Lesart in Partien prüfte die Gruppe Spielen (N233)
- **N182** (Übungen im Kapitel): von Claude geprüft am 18.10.2026: Kapitel 1 zeigt „Übungen lösen (… offen von …)“ und die Übungen 1.40 bis 1.42; eine Übung öffnet mit „Die Aufgabe steht im Buch … Abb. 1.40“ und Brett
- **N183** (Lösen auf dem Brett (Abb. 1.40)): von Claude geprüft am 18.10.2026: Hinweis 1 (Motiv), 2 (Figur), 3 (goldener Pfeil b5–c7, aus dem SVG gelesen); falscher Zug abgewiesen, Springer zurück auf b5; richtiger Zug „Richtig!“, Erklärung mit Sc7+, „Nächste Übung“
- **N184** (Mehrzügige Lösung (Abb. 1.41)): von Claude geprüft am 18.10.2026: 1.41: nach cxd5 antwortet die App, bis die Lösung mit „Richtig!“ endet; der akzeptierte erste Zug exd5 zählt ebenfalls
- **N185** (Lösung zeigen (Q6)): von Claude geprüft am 18.10.2026: „Lösung zeigen“ stellt die Lösung aufs Brett mit Erklärung; im Kapitel trägt 1.41 „gelöst“
- **N186** (Denkaufgabe (Kapitel 0, Abb. 0.27)): von Claude geprüft am 18.10.2026: 0.27: „im Kopf oder auf Papier“, Erklärung, drei Knöpfe, „Gespeichert“
- **N187** (Erst selbst denken): von Claude geprüft am 18.10.2026: „Erst selbst denken“ locker und streng mit Satz; bei „streng“ Hinweise und „Lösung zeigen“ erst nach dem ersten (auch falschen) Zug
- **N188** (Wiederholung): von Claude geprüft am 18.10.2026: „Als Nächstes am …“ unter „Fällige Wiederholungen“; mit Uhr +48 h fällig, „Jetzt wiederholen“ öffnet die Übung
- **N189** (Koordinaten, Feld finden): von Claude geprüft am 18.10.2026: 16 Felder aus beiden Richtungen mit Zeit (Oberflächentest), falscher Tipp zeigt das gesuchte Feld rot
- **N190** (Zug aufschreiben und ausführen): von Claude geprüft am 18.10.2026: Zug aufschreiben ohne Schachzeichen gilt; „Zug ausführen“ mit Rochade, en passant und Umwandlung samt Figurenwahl
- **N191** (Gangarten): von Claude geprüft am 18.10.2026: nach „Prüfen“ „Die Figur hat N Zielfelder“ mit Markierungen
- **N192** (Zähltrainer, Bilanz zählen): von Claude geprüft am 18.10.2026: nach „Prüfen“ Rechnung und Pfeile des Werkzeugs „Zählen“ am Brett
- **N197** (Neue Nummern der Übungen): von Claude geprüft am 18.10.2026: Kapitelseiten: Kapitel 3 Übungen 14 bis 18, Kapitel 4 19 bis 22, Kapitel 12 83 bis 86
- **N236** (Taktiktrainer): von Claude geprüft am 18.10.2026: Thema und Stufe wählbar, „Aufgabe 1 von 8“, Quelle (Buch oder Lichess) und Stufe, Hinweise 1 bis 3, „Lösung zeigen“, Motivfrage (Oberflächentest), bei Schwarz am Zug gedrehtes Brett
- **N237** (Falle oder Köder): von Claude geprüft am 18.10.2026: grauer Pfeil, Warnsignale, „Nehmen“/„Nicht nehmen“ führen zu „Eine Falle“ oder „Ein Geschenk“ mit Fortsetzung
- **N238** (Strukturerkenner): von Claude geprüft am 18.10.2026: Brett nur mit Bauern und Königen, Schritt 1 starke Felder bzw. schwache Bauern mit gold/rot/grau, danach der Plan
- **N239** („Nur dieser Zug“ bei Übungen): von Claude geprüft am 18.10.2026: 1.40 mit „Nur dieser Zug führt zum Ziel …“, 1.42 mit Lb4+ ohne den Satz
- **N249** (Wiederholung in Taktik und „Falle oder Köder“ (U9)): von Claude geprüft am 18.10.2026: „Lösung zeigen“ setzt einen Termin; mit Uhr +30 h „Taktiktrainer: 1 fällig“ und eine Runde nur mit dieser Aufgabe
- **N251** (Faktorenbilanz-Trainer): von Claude geprüft am 18.10.2026: vier Faktoren, je Zeile „App:“ bzw. „Buch:“, darunter die ganze Bilanz
- **N252** (Repertoire-Trainer): von Claude geprüft am 18.10.2026: als Schwarz steht 1. e4 schon da, Brett gedreht; als Weiß falscher Zug mit Pfeil (Oberflächentest)
- **N253** (Endspieltrainer öffnen): von Claude geprüft am 18.10.2026: Auswahl mit Gruppen und Anzahl (alles gemischt 80, nicht mehr 78), Stufen alle und 1 bis 5, Runde mit sechs Aufgaben
- **N263** (Fallen aus den Eröffnungskapiteln): von Claude geprüft am 18.10.2026: 17 Buchaufgaben in den Fallendaten (darunter 2.27, 2.28, 3.33, 3.67), „Aus dem Buch: Abb. …“ in der Runde
- **N266** (Studien lösen): von Claude geprüft am 18.10.2026: Saavedra: 1. c7 mit Buchantwort; falscher Zug zeigt goldenen Pfeil, nachgezogen geht es weiter
- **N267** (Zug erraten): von Claude geprüft am 18.10.2026: Opernpartie: „Getroffen: 1 von 1“, „In der Partie geschah Sf3.“, „1 von 2“ (Oberflächentest)
- **N269** (Endspieltrainer, 9.23 und 9.41): von Claude geprüft am 18.10.2026: Endspieldaten: 9.23 Remis für Weiß, 9.41 und 9.42 Remis für Schwarz
- **N270** (Übungen mit Zügen, die das Buch stützt (T1)): von Claude geprüft am 18.10.2026: Übung 6: Df6 und Sxd4 abgewiesen, Lb4+ „gleich gut“; 15: dxc3 abgewiesen, Sf6 gilt; 83: Te1 gilt; 11: Dc7 abgewiesen; 39: Sxf6+ abgewiesen
- **N271** (Notation mit englischen Buchstaben (U6)): von Claude geprüft am 18.10.2026: Zug mit englischem Figurenbuchstaben gilt mit „Im Buch stehen deutsche Buchstaben (S, L, T, D)“
- **N272** (Strukturerkenner (W6, T5)): von Claude geprüft am 18.10.2026: Daten: 5.43 „Stellung öffnen“, 5.44 „Raum nutzen“, 11.70 „Vorposten besetzen“; Plan-Sätze wie beschrieben
- **N273** (Studien (W11)): von Claude geprüft am 18.10.2026: aufklappbare Zeile „Die vier Prüfungen für Studien (Kapitel 10)“
- **N301** (Fehlerdatenbank): von Claude geprüft am 18.10.2026: Eintrag mit FEN, Auswertung, Vorschlag, Löschen (Oberflächentest); aus dem Rückblick einer Partie öffnet „In die Fehlerdatenbank“ das Formular mit der Stellung vor dem Zug
- **N302** (Denkroutine-Trainer): von Claude geprüft am 18.10.2026: Minute zählt herunter, Kandidat und Antwort nebeneinander ohne Überlauf, Vergleich mit der Engine (Oberflächentest)
- **N303** (Planbilanz-Übung): von Claude geprüft am 18.10.2026: Planfragen mit Antworten, LAP-Lösung als goldener Pfeil, Wettrennen (Oberflächentest); 6.6 Weiß 2, Schwarz 3 (Werkzeugtest „Wo?“)
- **N304** (Abweichungsmodus): von Claude geprüft am 18.10.2026: Engine verlässt das Buch, Urteil, Einschätzung, drei Aufgaben (Oberflächentest)
- **N305** (30-Minuten-Plan): von Claude geprüft am 18.10.2026: Tabelle beider Tage, Uhr, „Schritt erledigt“, Neuladen (Oberflächentest); „Letzte Partie ansehen“ öffnet den Rückblick, „Einheit geschafft …“, Tag B mit „Zur Fehlerdatenbank“
- **N315** (Strukturerkenner mit Feldern zuerst (W5)): von Claude geprüft am 18.10.2026: „Schritt 1 von 3: Welche Felder …“ wörtlich; 5.8 ergibt b6 und d5 (Komponententest, die Oberfläche wählt Aufgaben zufällig)
- **N316** (Faktorenbilanz-Trainer mit dem Urteil des Buches (W9)): von Claude geprüft am 18.10.2026: Buchaufgabe 3.77: vier Zeilen „Buch: …“ und „Verglichen mit der Faktorenbilanz des Buches zu Abb. 3.77.“; ohne Buchbilanz „App:“
- **N317** (Warum-Fragen im Repertoire-Trainer (W10)): von Claude geprüft am 18.10.2026: Spanisch als Schwarz: nach 3... a6 zugeklappt die Warum-Frage „Warum spielt Schwarz 3... a6?“
- **N318** (Zug erraten mit Vergleich (W12)): von Claude geprüft am 18.10.2026: Opernpartie 2. d4 statt Sf3: Vergleich der Engine und „warum der Meister anders zog“ (Oberflächentest)
- **N161** (Werkzeuge in der Partie): von Claude geprüft am 18.10.2026: Zählen, Röntgen und W1–W7 am Brett, Röntgen zeigt die Karte und gezogen wird weiter, Bündel „Taktik“ mit „Erzwingende Züge“; in der ruhigen Ansicht nur „Brett drehen“ und „Ruhige Ansicht“
- **N179** (Uhr im Hintergrund): von Claude geprüft am 18.10.2026: Sichtbarkeit „hidden“ ausgelöst: Die Engine zog im Hintergrund, die Uhr des Lesers stand 20 s auf 5:00. Die Anzeige zeigte nach der Rückkehr einen Takt lang 5:21; behoben in 0.2.95, danach 5:00, 4:59 …
- **N208** (Eröffnung wählen): von Claude geprüft am 18.10.2026: Vorschau „Hauptvariante: 1. e4 e5 2. Sf3 Sc6 3. Lb5 a6 …“, Untertitel „… · Spanische Partie“, gespielt 1. e4 e5 2. Sf3 Sc6 3. Lb5 a6
- **N209** (Eröffnung verlassen): von Claude geprüft am 18.10.2026: Spanisch gewählt, 1. d4: Die Engine antwortet ohne Fehlermeldung
- **N210** (Stufe je Phase): von Claude geprüft am 18.10.2026: „Eigene Stufe“ 1 · 4 · 2: Untertitel „Stufen 1 · 4 · 2 (Eröffnung · Mittelspiel · Endspiel) · du spielst Weiß“; 4 · 4 · 4: „Stufe 4 · Gelegenheitsspieler …“
- **N211** (Eröffnung „frei“): von Claude geprüft am 18.10.2026: „frei (die Engine spielt selbst)“ vorgewählt, darunter „eine Eröffnung des Buches (zufällig)“ und 24 Eröffnungen
- **N212** (Auswertung ohne Wartezeit): von Claude geprüft am 18.10.2026: zwölf Züge mit Pausen und einer Rücknahme: beim Ende 15 von 23 Stellungen schon ausgewertet, der Rest 23 s auf der ausgelasteten Testmaschine (die Zeit auf dem Handy fragt N327)
- **N220** (Spielhilfen zuschalten): von Claude geprüft am 18.10.2026: nur Symbole: Symbole da, keine Leiste, kein Engine-Knopf; beides aus: nur Brett, Uhr, Zugliste; nach dem Ende keine Leiste, Symbole bleiben
- **N221** (Gewertete Partie): von Claude geprüft am 18.10.2026: Haken „Gewertete Partie (zählt für deine Spielstärke)“ mit Satz; bei „Mensch“ fehlen Haken, Seite und Eröffnung
- **N224** (Deine Wertung): von Claude geprüft am 18.10.2026: gewertete Partie gegen Leon, zwölf eigene Züge, aufgegeben: Karte „Deine Wertung“ mit Zahl gleich der Schätzung der Partie, Ausschnitt-Wahl mit allen acht Werten, Kurve mit Punkt; „1 gewertete Partien“ hieß es vorher, seit 0.2.95 „1 gewertete Partie“
- **N228** (Wertung nur aus der Grundstellung): von Claude geprüft am 18.10.2026: aus Abb. 1.26 und aus einer aufgebauten Stellung der Satz „Diese Partie zählt nicht für deine Wertung …“ ohne Haken; aus der Grundstellung mit Haken; bei „Mensch“ ohne
- **N229** (Wertung zurücksetzen): von Claude geprüft am 18.10.2026: „Wertung zurücksetzen“, „Ja, zurücksetzen“, danach wieder der Hinweis vor der ersten Partie; die Partien bleiben, ihr Stern verschwindet
- **N243** (Eigene Gegner mit blinden Flecken): von Claude geprüft am 18.10.2026: alle elf blinden Flecken im Formular; ein Bot 6 · 6 · 6 nur mit „lange Läuferdiagonalen“ ließ sich anlegen, wählen und spielen
- **N276** (Drei neue blinde Flecken): von Claude geprüft am 18.10.2026: Röntgenangriffe, Zwischenzüge und Grundreihe im Formular; die genannten Bots haben diese Flecken (Gegnerliste)
- **N282** (Stern für gewertete Partien): von Claude geprüft am 18.10.2026: gewertete Partie mit Stern, ungewertete ohne
- **N284** (Abhakliste der Fehlerarten): von Claude geprüft am 18.10.2026: 14 Haken, „14 von 14 Arten erlaubt“; „Keine erlauben“ 0, nur W1 1, „Alle erlauben“ 14
- **N310** (Gewertete Partie ohne Hilfen (S9)): von Claude geprüft am 18.10.2026: bei gewerteter Partie drei Haken grau und leer mit dem Satz; ohne Haken wieder wählbar; in der Partie weder Zurücknehmen noch Werkzeuge
- **N319** (Gegnerwahl in drei Kategorien): von Claude geprüft am 18.10.2026: drei Kacheln, je nur der passende Inhalt; bei „Eigene Bots“ ohne Bot „Partie beginnen“ gesperrt mit Satz, dazu „Eigene Bots verwalten“
- **N320** (Engine-Knopf in der Partie): von Claude geprüft am 18.10.2026: Engine-Symbol: Bewertung, „Deinen letzten Zug bewerten“ („Dein Zug 2. Dh5? ist ein Fehler.“), „Warum?“, „Besten Zug zeigen“; nach „Warum?“ stand ein doppelter Punkt, behoben in 0.2.95
- **N321** (Blinde Flecken bei eigener Stufe): von Claude geprüft am 18.10.2026: „(0 gewählt)“, Rückzüge angehakt „(1 gewählt)“, bleibt nach dem Neuladen
- **N330** (Zahlen in der Gegnerwahl): von Claude geprüft am 18.10.2026: Überschriften mit Bereichen wie im Punkt (Stufe 1 etwa 1050 bis 1300 … Stufe 8 etwa 3000 bis 3200), jede Kachel mit „etwa …“
- **N331** (Sprechblase und Erklärung): von Claude geprüft am 18.10.2026: Ayşe „etwa 1550 (Stufe 2)“, Fragezeichen mit Elo-Leiter und ±150; eigener Bot „etwa … (geschätzt)“; eigene Stufe „Deine Einstellung 3 · 4 · 3 · etwa 1950 (geschätzt)“, ändert sich mit dem Regler
- **N332** (Gegner in der Karte „Spielstärke“): von Claude geprüft am 18.10.2026: nach der Partie gegen Leon „Leon (etwa 1300) hat in dieser Partie wie etwa … gespielt.“
- **N333** (Wertung mit fester Gegnerzahl): von Claude geprüft am 18.10.2026: Niederlage gegen Großmeister Grün (etwa 3200) bei Wertung 1150 ändert die Wertung um ±0; die Erklärung nennt die feste Zahl des Gegners
- **N339** (Auswertung startet immer): von Claude geprüft am 18.10.2026: eine hängende Engine lässt sich im Browser nicht erzeugen; der Komponententest „hängende Engine: neu starten …“ (engineWachhund) besteht. Bleibt eine Auswertung trotzdem stehen, meldet der Autor es ohnehin
- **N340** (Spielen): von Claude geprüft am 18.10.2026: „Partie beginnen“ unter den Kacheln und über dem Gitter, Stufen aufklappbar, anfangs die des gewählten Bots offen, die Wahl bleibt (Oberflächentest)
- **N341** (Werkzeuge): von Claude geprüft am 18.10.2026: in der Partie eine waagerecht scrollbare Leiste, jedes Bündel mit Symbol; an Abb. 5.17 „frühere“ und „spätere“ am Anfang und Ende; Angriffsregel an 1.37 ohne „Mehr …“
- **N348** (Stufe 5 bis 8 mit eigener Zahl): von Claude geprüft am 18.10.2026: Stufe 5 bis 8 mit den Bereichen wie im Punkt, Fragezeichen „über 2200 … ungenauer (etwa ±200)“
- **N349** (Gleich große Kacheln in der Gegnerwahl): von Claude geprüft am 18.10.2026: Porträts in Stufe 7 und 8 alle 72,5 px breit, hell und dunkel
- **N158** (Kein Spielziel): von Claude geprüft am 18.10.2026: keine Auswahl „Spielziel“, nach dem Ende kein „Ziel erreicht/verfehlt“
- **N198** (Zeichen und besserer Zug am Brett): von Claude geprüft am 18.10.2026: zu zweit nach 1. f3 e5 2. g4?? Dh4#: auf g4 ein rotes „??“, goldener Pfeil zum besseren Zug (laut Engine 2. e4, nicht e3 wie im alten Text)
- **N199** (Bewertungsbalken): von Claude geprüft am 18.10.2026: Balken nur nach dem Ende, „−M“ nach Dh4#, als Schwarz gedreht; in der ruhigen Ansicht nicht (Oberflächentest)
- **N200** (Verlaufskurve): von Claude geprüft am 18.10.2026: Kurve über der Auswertung, Fehler als rote Punkte, ein Tipp springt zur Stelle
- **N205** (Erklärung mit Markierung): von Claude geprüft am 18.10.2026: Das alte Beispiel 2... Sf6 ist laut Engine kein Fehler; mit 2... a6?! geprüft: Karte „… lässt die Drohung Dxe5+ stehen (gewinnt den Bauern).“, roter Pfeil h5–e5, rotes Feld e5; gegen die Engine heißt es „Du …“
- **N206** („!“ für den einzigen guten Zug): von Claude geprüft am 18.10.2026: goldenes „!“ am Brett, Karte „… ist stark: der einzige gute Zug oder die Strafe für den Fehler davor.“ (Wortlaut neuer als im Punkt)
- **N213** (Zugklassen am Brett): von Claude geprüft am 18.10.2026: Marken am Zielfeld: !! blau, ! gold, ✓ grün, ?! grau, ? und ?? rot; gut und Buch ohne Marke, mit Satz. Die Lesbarkeit von „?!“ im Dunkelmodus fragt N328
- **N215** (Phasen in der Kurve): von Claude geprüft am 18.10.2026: goldene Linie „M“ in der Kurve
- **N218** (Auswertung ohne Nachfrage): von Claude geprüft am 18.10.2026: „Hast du es gesehen?“ kommt nicht vor (Partie gegen Stufe 1)
- **N222** (Zu zweit spielen): von Claude geprüft am 18.10.2026: Überschrift „Partie zu zweit“, Untertitel, Status im Wechsel, „Matt! Weiß hat gewonnen.“, Aufgeben für die Seite am Zug, Uhr für beide, Spalten Weiß und Schwarz. Dabei gefunden: Die Auswertung nannte „keinen absichtlichen Fehler der Engine“; behoben in 0.2.95
- **N225** (Phase, Zusatzregeln): von Claude geprüft am 18.10.2026: K + D gegen K + D aufgebaut: „Endspiel …“ und „Zusatzregel (nicht aus dem Buch): Jede Seite hat höchstens 13 Punkte …“
- **N226** (Stellung aufbauen, Figuren setzen): von Claude geprüft am 18.10.2026: 12 Steine, „Feld räumen“, „Am Zug“, „Brett leeren“, „Grundstellung“; zweiter Tipp räumt; „Stellung übernehmen“ gesperrt mit rotem Satz bis zu zwei Königen; Seite am Zug vorgewählt; aus Abb. 1.26 geändert „Aus einer eigenen Stellung“
- **N227** (Stellung aufbauen, Züge spielen): von Claude geprüft am 18.10.2026: Züge mit Zielpunkten, Umwandlungsfrage mit vier Figuren; nach 1. e4 e5 2. Sf3 spielt der Leser Schwarz
- **N232** („M“ und „E“ in der Zugliste): von Claude geprüft am 18.10.2026: goldenes „M“ vor dem ersten Mittelspielzug mit Titel „Mittelspiel“
- **N233** (Übergang ins Mittelspiel ohne Zugzahl): von Claude geprüft am 18.10.2026: alle drei Fälle mit den Sätzen aus dem Punkt (entwickelt, Material ungleich, je zwei Figuren zu Hause bleibt Eröffnung über 14 Züge)
- **N234** (Erklärung am Phasenwechsel): von Claude geprüft am 18.10.2026: „Neue Phase ab hier. Mittelspiel: …“ nur beim Zug mit dem „M“
- **N235** (Damenloses Mittelspiel bleibt Mittelspiel): von Claude geprüft am 18.10.2026: Berliner Linie bis 9. Sc3: „Mittelspiel“, „Bauern entscheiden … nein“
- **N245** (Kein „??“ bei klarem Gewinn (K5)): von Claude geprüft am 18.10.2026: Matt in 1 auf dem Brett, gespielt 1. h3 (+M → +8,3): kein Zeichen, nicht unter „Grobe Patzer“; der Satz zu „+5 oder besser“ steht in der Engine-Karte
- **N246** (Geschätzte Spielstärke (R3)): von Claude geprüft am 18.10.2026: Zeile „Geschätzte Spielstärke“ mit „etwa … (…–…)“; die Erklärung sagt jetzt „gehört zu keiner echten Liste“
- **N258** (Verpasst statt Patzer): von Claude geprüft am 18.10.2026: 1. e4 e5 2. Sf3 Dg5?? 3. a3?: „3. a3? verpasst die Chance nach dem Fehler des Gegners …“, unter „Grobe Patzer“ beide, „Verpasst“ 1
- **N259** (Beste Züge und Zugklassen passen zusammen): von Claude geprüft am 18.10.2026: „!! 0“ am Anfang der Zeile „Zeichen“, „… ist so gut wie …, der Zug der Engine“. Anders als im Punkt: „Beste Züge“ zählt jeden Zug gleich dem der Engine (auch !!, ! und Buchzüge), „Bester Zug“ unter „Züge nach Art“ nur die übrigen; beide Zahlen sind deshalb nicht gleich
- **N275** („Danach etwa …“ in der Rückblickkarte): von Claude geprüft am 18.10.2026: „Besser war …, danach etwa …“ mit fünf Halbzügen, beim besten Zug ohne. Die Länge bleibt nach Regel 9 bei fünf Halbzügen; Widerspruch genügt
- **N283** (Brillant nur bei wirklich nehmbarem Opfer): von Claude geprüft am 18.10.2026: Opernpartie zu zweit: Weiß „!! 3“ (10. Sxb5, 13. Txd7, 16. Db8+), in drei Läufen gleich
- **N311** (Unmögliche Stellungen (S12)): von Claude geprüft am 18.10.2026: drei Damen und acht Bauern: schon „Stellung übernehmen“ gesperrt mit dem Satz zu den Umwandlungen; zwei Damen und sieben Bauern gehen, die Engine zieht
- **N336** (Fehler im Rückblick): von Claude geprüft am 18.10.2026: „4... h6??: Die Gewinnchance von Schwarz fällt von 50 % auf 9 %.“, „schlägt nicht zurück: dxc6 nahm den Läufer c6 wieder …“ mit rotem Feld; Fragezeichen erklärt Balken und Gewinnchance
- **N337** (Nebenzweige): von Claude geprüft am 18.10.2026: „Besser war …“ und „So wird der Fehler bestraft: …“ antippbar, Stellung am Brett, Zug für Zug weiter, „Zurück zur Partie“; bei gutem Zug keine Strafe
- **N338** (Auswertung): von Claude geprüft am 18.10.2026: Schalter „Genauigkeit wie“, Symbole je Zeile, Marken je Klasse, Erklärungen hinter Fragezeichen; Patzer mit Bauer in Seitenfarbe, Tipp springt hin; Fehler der Engine erst 3, „Alle 8 zeigen“; „Noch einmal aus derselben Stellung“ nur bei eigener Stellung. Der Erklärtext nannte noch „Mittelweg“ und die Einstellungen; nachgeführt in 0.2.95
- **N176** (Stufe 2 (Anfänger), kein Damenopfer): von Claude geprüft am 18.10.2026: nicht über eine Partie, sondern an der Regel: Absichtliche Fehler ab Stufe 2 schließen ein Damenopfer aus (`damenopferErlaubt` nur bei Stufe 1, Filter in der Fehlersuche und bei den menschlichen Zügen), Komponententest „Damenopfer (Konzept 8.2)“
- **N195** (Fortschritt): von Claude geprüft am 18.10.2026: nach einer ganzen Runde zeigt Kapitel 0 den Trainer mit Durchgängen und richtigen Aufgaben; „1 Durchgänge“ heißt seit 0.2.95 „1 Durchgang“
- **N254** (Mattführung gewinnen): von Claude geprüft am 18.10.2026: Mattführung Stufe 1: Auftrag, Herkunftszeile und Status wie beschrieben. Hinweis 2 und 3 zeigten bei Damen- und Königszügen weder Figur noch Pfeil; behoben in 0.2.95, danach mit den Hinweisen bis „Richtig! Matt! Ziel erreicht.“ ausgespielt
- **N256** (Remis halten): von Claude geprüft am 18.10.2026: Turmendspiel als Schwarz: Brett gedreht, Engine zieht zuerst, „Aufgabe abbrechen“ nennt den besten Zug; nach der Behebung in 0.2.95 mit den Hinweisen bis „Richtig! Zwölf Züge gehalten … Ziel erreicht.“ ausgespielt
- **N307** (Aufgabenseite): von Claude geprüft am 18.10.2026: langer Druck, Link, Haken, Notiz, „Stand in die Zwischenablage“, „Nur offene Punkte zeigen“, Erhalt nach dem Neuladen gingen; „‹ Zurück zu den Aufgaben“ landete aber oben statt beim Punkt. Behoben in 0.2.95 (auch für Safari); ein Oberflächentest prüft es in Chromium und WebKit
- **N314** (Sonderzüge aus Kapitel 0 (U5)): von Claude geprüft am 18.10.2026: Sonderzüge an den Buchstellungen 0.12 bis 0.19 (Rochaden, en passant, Umwandlung) kommen; die Abbildung stand nicht dabei, seit 0.2.95 „Aus dem Buch: Abb. 0.14“ usw. unter dem Brett
- **N223** (Partienliste): von Claude geprüft am 18.10.2026: zu zweit „0–1 · Mensch (beide Seiten selbst) · 2 Züge · Weiß 25 % genau · Schwarz 100 % genau“; gegen Stufe 1 „0–1 · … · Stufe 1 · 12 Züge · du etwa 900 · Engine etwa 900“
- **N324** (Genauigkeit wie): von Claude geprüft am 18.10.2026: Schalter Lichess | App | chess.com in der Karte, Zeile heißt jeweils „Genauigkeit (…)“; Spielstärken und Urteilswörter blieben beim Umschalten gleich
- **N325** (Spielstärke mit Spanne): von Claude geprüft am 18.10.2026: „Geschätzte Spielstärke“ mit „etwa 900 (500–1300)“; das Fragezeichen „Erklärung: Spielstärke“ nennt beide Skalen (chess.com etwa …, Lichess etwa …)

### Teil 1: durch spätere Versionen überholte Punkte (gelöscht)

Diese Punkte beschrieben einen Stand, den eine spätere Version geändert hat; der neuere Punkt
prüft dasselbe am aktuellen Stand. Die Nummern bleiben frei (die App speichert Haken je Nummer).

- **N159** (Figurensatz und Ton): überholt durch N322 (neue Figurensätze seit 0.2.82) und N278 (Töne einschließlich Klacken).
- **N175** (Stufe 1 (Einsteiger)): überholt durch N264 (Stufen 1 bis 3 menschlicher, 0.2.52) und N336 bis N338 (Fehler im Rückblick).
- **N177** (Abstufung): überholt durch N334 und N348 (Abstufung gemessen, Elo-Zahl je Stufe) und N335.
- **N178** (Eröffnung): überholt durch N211 (Eröffnung „frei“ oder „eine Eröffnung des Buches (zufällig)“, 0.2.40).
- **N201** (Figurensätze): überholt durch N322 (Figurensätze „klassisch“ und „Holz“ seit 0.2.82 ersetzt).
- **N204** (Rückblick-Karte): überholt durch N336 und N337 (Gewinnchance statt Bauern, Nebenzweige, 0.2.86).
- **N207** (Spielstärke): überholt durch N324, N325 und N338 (Karte „Spielstärke“ neu geeicht und neu geordnet).
- **N214** (Spielstärke je Phase und Züge nach Art): überholt durch N291 (Urteilswort je Phase) und N338 (Züge nach Art mit Marken).
- **N216** (Partienliste): überholt durch N223 (Partienliste mit Ergebnis und Stärke beider Seiten, 0.2.41).
- **N217** (Fehler der Engine je Phase): überholt durch N264 und N286 (ob die Fehler der Engine menschlich wirken).
- **N219** (Gegner wählen): überholt durch N319 (Gegnerwahl in drei Kategorien, 0.2.80) und N330 (Porträts mit Zahl).
- **N231** (Eigene Gegner): überholt durch N319 („Eigene Bots verwalten“) und N312 (Stil spürbar); der Oberflächentest „Eigener Gegner Rambo“ prüft Anlegen, Spielen, Löschen.
- **N240** (Gegnerliste ohne Stufen): überholt durch N319 und N330 (Gegnerwahl mit Porträts, Regler nur bei „Eigene Stufe“).
- **N241** (Persönlichkeit): überholt durch N286 (Persönlichkeit spürbar, 64 Bots seit 0.2.67).
- **N242** (Blinde Flecken auch bei starken Gegnern): überholt durch N287 und N295 (starke Bots mit Charakter, alle 64 gemessen).
- **N244** (Rücknahme macht die Partie ungewertet (S9)): überholt durch N310 (gewertete Partie hat seit 0.2.61 gar keine Rücknahme).
- **N257** (Genauigkeit wie bei chess.com): überholt durch N324 und N325 (Genauigkeit und Spielstärke neu geeicht, 0.2.83; die Zahlen im Punkt stimmen nicht mehr).
- **N261** (Brillant und Stark wie bei chess.com): überholt durch N283 (Opernpartie: Brillant 3 seit 0.2.54/0.2.59).
- **N265** (Strähne und Tagesform): überholt durch N334 (Stufe 3 und 4 neu gemessen, 0.2.85); das Gefühl bleibt bei N264.
- **N268** (Brillant wie bei chess.com): überholt durch N283 (Brillant, zweiter Schritt).
- **N277** (Blind auch für Drohungen): überholt durch N286 und N295 (blinde Flecken aller 64 Bots gemessen, Sprechblasen nennen sie).
- **N281** (Figurensatz „Holz“ mit eigenen Formen): überholt durch N322 („Holz“ seit 0.2.82 durch drei Holzsätze ersetzt).
- **N291** (Urteilswort je Phase und Mittelspiel nach Taktik und Strategie): überholt durch N344 (Urteilswörter dürfen zweizeilig werden) und N338 (Karte neu geordnet).
- **N181**: überholt durch N220 (seit 0.2.41 verschwinden Werkzeugleiste und Bündel nach dem Partieende; den Ablauf gibt es so nicht mehr). Geprüft: Die Auswertung läuft mit geöffnetem Werkzeug zu Ende.
- **N312**: überholt durch N295 (der Hinweis unter dem Stil sagt seit 0.2.81: im Mittel etwa gleich stark, nur auf Stufe 8 schwächer); das Gefühl prüft der Autor bei N286 und N295.

### Teil 2 im Wortlaut vor dem Umbau

Damit beim Rückbau nach einem Widerspruch nichts fehlt, hier der ganze alte Text der Rückfragen.

#### B. Buchbefunde aus der Textarbeit (Fable, 0.2.67; nur du änderst das Buch)

- B6. **Zeit-Zählhilfe in Kapitel 3:** Die Faktorenbilanz der App sagt nach 1. e4 e5 2. f4
  (Abb. 3.1, ebenso 3.18 und 3.36) „Schwarz liegt vorn bei Zeit“, obwohl beide Seiten null
  Figuren im Spiel haben. Das folgt der Zählhilfe des Buches („Ist Schwarz am Zug, ziehe vom
  weißen Vorsprung eine Figur ab“) und der Tabelle zu Abb. 3.14 (zwei gegen zwei, Schwarz am
  Zug: Schwarz +1). Der Fließtext sagt dagegen nur „sein Vorsprung ist eine Figur kleiner“,
  also nie unter null. Die Helfer der Textarbeit fanden das Ergebnis bei 0:0 falsch, ich auch.
  **Empfehlung:** im Buch die Zählhilfe um „nie unter null“ ergänzen und die Tabelle zu 3.14
  auf „gleich“ setzen; dann ändere ich die App (ein Zeile) und die Kalibrierung. Bis dahin
  bleibt die App beim Buch (Regel 1).

#### S. Spielbewertung (Fable, 0.2.72; schon umgesetzt, Widerspruch genügt)

- S20. **Deine Wertung nach der neuen Eichung (0.2.83):** Die Wertung in den Einstellungen
  (Elo-System aus deinen gewerteten Partien) rechnet mit der geschätzten Stärke des Gegners.
  Die stammt jetzt aus den neuen Kurven: Bei niedriger Genauigkeit liegt sie höher als vorher
  (die alte Tabelle aus deinen sieben Partien ging bis 250 hinunter, die neue fängt bei etwa
  1000 an, weil echte Spieler mit 50 % meist um 1000 stehen). Alte Punkte bleiben, die
  Wertung wandert mit den nächsten Partien. **Empfehlung:** einmal „Wertung zurücksetzen“ in
  den Einstellungen, dann baut sie sich auf der neuen Skala auf. Ich ändere gespeicherte
  Daten nicht selbst (Regel 9: Daten im Speicher der Leser).
- S21. **Urteilswort statt Symbole, Taktik und Strategie nach dem Buch:** chess.com
  veröffentlicht nicht, wie die Symbole je Phase entstehen. Aus deinen 13 Bewertungen
  lässt sich ablesen: „Strategie“ war alle 13 Male „Gut“, „Endspiel“ auch bei 95 %
  Genauigkeit nur „Gut“, „Eröffnung“ meist „Bester“. Das passt zu einem Durchschnitt der
  Zugklassen je Phase (in der Eröffnung sind viele Züge Buch oder bester Zug, in ruhigen
  Stellungen und gewonnenen Endspielen sind gleich gute Züge nur „Gut“), nicht zu einer
  Genauigkeit. Das sagt dem Leser wenig. **Empfehlung (umgesetzt):** Unser Wort je Phase
  kommt aus der Genauigkeit der Phase mit denselben Grenzen wie die Spielstärke, und Taktik
  gegen Strategie trennt die Regel des Sicherheitsblicks (Kapitel 12): Schach, Drohung,
  Schlag mit Gewinn oder Matt möglich heißt Taktik. Beides ist im Erklärtext der Karte
  beschrieben. Sag Bescheid, wenn du lieber die Wörter von chess.com (Bester, Exzellent, Gut,
  Ungenauigkeit, Fehler) oder Symbole statt Wörter möchtest.
- S22. **Absichtliche Fehler nur für die eigene Stufe (Opus, 0.2.80):** Die Liste „Absichtliche
  Fehler der Engine“ stand bisher in den Einstellungen und beschnitt auch die vorgefertigten
  Bots. Seit deinem Wunsch steht sie unter Spielen bei „Eigene Stufe“. Dort sieht man sie bei
  einem vorgefertigten Bot nicht mehr; sie heimlich weiter wirken zu lassen, wäre verwirrend,
  und die Bots sind mit ihrer eigenen Liste gemessen und beschrieben (Sprechblase).
  **Empfehlung (umgesetzt):** Die Liste gilt nur für die eigene Stufe; vorgefertigte und
  eigene Bots spielen immer mit ihrer eigenen Liste. Sag Bescheid, wenn die Liste auch die
  vorgefertigten Bots beschneiden soll; dann zeige ich sie auch dort.
- S24. **Namen der Stufen und Lage der Skala (Opus, 0.2.85, Stand 0.2.88):** Gemessen ist
  Stufe 1 („Einsteiger“) etwa 1200, Stufe 2 („Anfänger“) etwa 1550, Stufe 3 etwa 1900,
  Stufe 4 etwa 2100, Stufe 5 („Vereinsanfänger“) etwa 2350 bis Stufe 8 etwa 3200. Die
  Abstände stammen aus über 800 Partien der Bots gegeneinander, die Lage aus Partien der
  Stufen 1 bis 3 gegen sich selbst: Ihre Genauigkeit (70 %, 77 %, 83 %) ergibt über dieselbe
  Rechnung wie „Deine Spielstärke“ etwa 1190, 1560 und 1890, und diese drei Anker passen auf
  etwa 30 Punkte zu den Ergebnissen. Unsicher bleibt, ob ein Bot mit 70 % so spielt wie ein
  Mensch mit 70 % (Bots machen seltene grobe Fehler, Menschen viele mittlere); das zeigt erst
  dein Test N335. Seit 0.2.88 gibt es für schwache Leser die Gruppe „Zum Spaß“ (etwa 600 bis
  1100), damit ist der frühere Vorschlag, die Stufen 1 bis 4 schwächer zu machen, vom Tisch.
  Offen sind nur die Namen: „Vereinsanfänger“ bei etwa 2350 passt nicht. **Empfehlung:** Nach
  N335 entscheiden. Bestätigt dein Test die Zahlen, schlage ich neue Namen vor (etwa
  Gelegenheitsspieler, Vereinsspieler, Starker Vereinsspieler, Experte, Meister, Großmeister,
  Weltklasse, Engine); liegen die Zahlen zu hoch, verschiebe ich die ganze Skala. Noch nicht
  umgesetzt, weil beides an deinem Test hängt.

#### F. Trainer der Stufe 3 (Opus, 18.10.2026; schon umgesetzt, Widerspruch genügt)

- F1. **Fehlerdatenbank (0.2.65):** Fehlerart ist je eine Zeile der Gesamt-Checkliste
  (Kapitel 0 bis 12, gespeichert als Kapitelnummer, damit sich die Texte ändern dürfen).
  Höchstens 500 Einträge, der älteste fällt dann weg. Der Vorschlag nimmt die häufigste
  Fehlerart der letzten vier Wochen und den ersten fertigen Trainer zu ihrem Kapitel (Kapitel 1
  → Schach-Röntgen-Trainer, 7 → Taktiktrainer); zu Kapitel 11 gibt es keinen eigenen Fehler-
  Trainer, dann kommt die nächsthäufige Fehlerart. Der Knopf im Rückblick steht bei jedem Zug,
  auch bei guten (ein Fehler zeigt sich manchmal erst einen Zug später). Die Einträge stehen in
  deinen Nutzerdaten (Format 4) und kommen mit in die Datensicherung.
  **Empfehlung:** so lassen. Schon umgesetzt in 0.2.65, Widerspruch genügt.

- F2. **Denkroutine-Trainer (0.2.66):** Stellungen aus Kapitel 7, 11 und 12 (Taktik,
  Meisterpartien, Denkroutine), ohne Schach, mit mindestens zehn Steinen und acht Zügen zur
  Wahl; drei je Runde. Die Minute ist fest, ohne Abkürzung. Die Eingabe ist Text in
  Buchnotation (englische Buchstaben gehen auch), weil zwei Kandidaten und zwei Antworten auf
  dem Brett schwer auseinanderzuhalten sind. Gelöst, wenn zu beiden Kandidaten eine
  regelgerechte Antwort steht und der bessere Kandidat höchstens 0,5 Bauern hinter dem Zug der
  Engine liegt; ob die Antwort die stärkste war, zeigt die App, zählt aber nicht.
  **Empfehlung:** so lassen. Schon umgesetzt in 0.2.66, Widerspruch genügt.

- F3. **Planbilanz-Übung (0.2.69):** Die Antworten der Planfragen sind die Sätze, die die
  Werkzeuge der App zu den drei Fragen rechnen, nicht die Texte deiner Planbilanzen (die zeigt
  die App seit dem 15.10. nicht mehr). Falsche Antworten: derselbe Satz für die andere Seite
  und der einer weit entfernten Stellung. Stellungen, in denen ein Satz nichts sagt („Noch
  offen“, „noch kein erkennbarer Plan“, „keine Figur“), fallen weg. Die LAP-Lösung kommt aus
  dem Werkzeug „Welche Figur?“, das Wettrennen aus dem schnellsten Sturm je Seite (bis sechs
  Züge). Die Planfragen-Runde hat vier, LAP sechs, Wettrennen fünf Aufgaben.
  **Empfehlung:** so lassen. Schon umgesetzt in 0.2.69, Widerspruch genügt. Wenn du lieber
  deine eigenen Planbilanz-Sätze als Antworten hättest, bräuchte die App sie als freigegebenen
  Text (sie sind Buchtext).

- F4. **Abweichungsmodus (0.2.70):** Die Eröffnungen und Varianten sind die aus Kapitel 2
  (wie im Repertoire-Trainer). Die Engine weicht frühestens nach dem 4., spätestens nach dem 12. Halbzug ab, immer mit ihrem besten Zug, der kein Buchzug ist (Buch heißt: irgendeine
  Zugfolge der Kapitel 2 und 3). Gut ist eine Antwort bis 0,5 Bauern hinter dem besten Zug,
  ungenau bis 1,2, darüber ein Fehler (wie die Auswertung nach der Partie). Die Einschätzung
  zeigt die Fazits der Werkzeuge Zielbilanz und Todsünden, keine vorbereiteten Texte, weil es
  zu Stellungen außerhalb des Buches keine gibt.
  **Empfehlung:** so lassen. Schon umgesetzt in 0.2.70, Widerspruch genügt.

- F5. **30-Minuten-Plan (0.2.71):** Eine geführte Einheit mit den drei Schritten deiner
  Tabelle in Kapitel 12; die Uhr zeigt die Restzeit des Schritts und läuft über die Zeit
  weiter, statt abzubrechen (das Buch nennt Richtzeiten). Die Taktikaufgaben sind zwei
  gemischte der leichtesten Stufe; die Partie spielst du im normalen Spielen-Bildschirm, die
  Analyse im Rückblick der letzten Partie; am Studientag führen Knöpfe zu den Trainern des
  Bereichs (Taktik: Taktiktrainer, Studien; Endspiel: Endspieltrainer; Strategie: Zug
  erraten, Planbilanz, Strukturerkenner; Eröffnung: Repertoire, Abweichungsmodus,
  Zielbilanz, Faktorenbilanz). Tag und Bereich wechseln nach jeder abgeschlossenen Einheit,
  ein Abbruch schaltet nicht weiter. Der Stand liegt nur auf dem Gerät (nicht in der
  Datensicherung); eine Einheit, die drei Stunden liegt, verfällt. Eine abgeschlossene
  Einheit zählt als Durchgang im Fortschritt. Die Bedenkzeit 10+0 bietet der
  Spielen-Bildschirm noch nicht an (Fables Bereich, ist bei Fable angefragt); bis dahin
  steht im Plan „ohne Uhr spielen“.
  **Empfehlung:** so lassen. Schon umgesetzt in 0.2.71, Widerspruch genügt.

#### X. Endspieltrainer (Fable, 0.2.49; plausibel entschieden, bitte prüfen)

- X5. **Schwierigkeit:** Grundstufe je Thema (Dame 1, Quadrat 1, Turmmatt 2, Opposition 2,
  Bauernrennen 2, Randbauer 2, Läuferpaar 3, Schlüsselfelder 3, Durchbruch 3, Freibauer 3,
  Zugzwang 4, Turmendspiel 4, Dame gegen Bauer 4, Leichtfiguren 4), eine Stufe mehr, wenn der
  erste Zug der einzige ist. Nicht an Lichess geeicht (dort gibt es keine ausspielbaren
  Endspiele). Verteilung der 80 Stellungen: Stufe 1 viermal, 2 achtmal, 3 19-mal, 4 38-mal,
  5 elfmal. Das Gewicht bei 4 und 5 kommt von den Turmendspielen (23) und Leichtfiguren (11)
  aus Kapitel 9 und folgt damit dem Buch (Kapitel 8 Grundlagen, Kapitel 9 schwerer). Wer eine
  Stufe wählt, von der es wenige gibt, bekommt die Nachbarstufen dazu; eine Runde hat sechs
  Stellungen. **Empfehlung (Opus, 18.10.):** so lassen und nach deinem Test nachjustieren.
  Schon umgesetzt (so in der App seit 0.2.49), Widerspruch genügt.

#### T. Trainerdaten für Taktiktrainer, Strukturerkenner und „Falle oder Köder“ (Fable; plausibel entschieden)

Die drei Trainer sind seit 0.2.45 in der App (Teil 1, N236 bis N238; Rückfragen W1 bis W7, am 17.10. entschieden). Was Claude entschieden
hat, mit Rückfrage:

- T1. **Übungen, Engine-Prüfung:** Alle 86 Übungen sind mit Stockfish gegengeprüft: 56
  Lösungen halten, 6 sind gleichwertig zu einem anderen Zug, eine ist etwas schwächer, keine
  ist widerlegt. Vorschläge für zusätzlich „akzeptierte“ Züge (gleich gut laut Engine):
  Übung 2 (Abb. 0.26, Buch 6... h6): a6, Le7, d6, a5; Übung 6 (1.42, Buch 4... Sf6,
  akzeptiert Lc5): dazu Df6, Lb4+, Sxd4; Übung 11 (2.151, Buch 4... h5, akzeptiert h6): dazu
  Dc7, Da5+, a6; Übung 15 (3.81, Buch 4... d5): dxc3, Sf6; Übung 39 (7.51, Buch 1. Sf4+):
  Sxf6+ gewinnt ebenfalls klar. Bei den Technikübungen 60 (8.65, 1. g5) und 66 (9.47, Lucena)
  gewinnen auch viele andere Züge, Vorschlag: dort nichts ergänzen, die Übung lehrt einen
  Weg. Befund: Übung 83 (12.5, Kandidatenzüge): 1. Dc2 ist 0,44 schwächer als 1. Te1, beide
  vorteilhaft. Welche Vorschläge übernehmen, und Übung 83 so lassen?
  **Empfehlung:** die Vorschläge für die Übungen 6, 11, 15 und 39 übernehmen. Wer einen laut
  Engine gleich guten Zug findet, soll nicht „falsch“ hören; die Erklärung zeigt danach ohnehin
  die Lösung des Buches. Übung 2 ist in der App eine Denkaufgabe (Notation schreiben), dort
  ändern die Vorschläge nichts. Übung 83 so lassen, beide Züge sind gut.
  **Nachgelesen im Buch (17.10.2026):** Das Buch spricht gegen mehrere Engine-Vorschläge,
  deshalb ist die Umsetzung aus 0.2.47 geändert. Übung 6: Das Buch kritisiert 4... Sxd4?! und
  empfiehlt „einen Entwicklungszug, der selbst etwas angreift“; dazu passt nur 4... Lb4+ (Df6
  wäre die verfrühte Dame). Übung 11: „Richtig ist 4... h5 oder 4... h6“; kein Zusatz. Übung
  15: gesucht ist ein Zug „ohne weiteres Material zu nehmen“, 4... d5 nur „die einfachste
  Antwort“: 4... Sf6 gilt, dxc3 nicht. Übung 39: „Auch 1. Sxf6+ gibt Schach, … lässt die Dame
  allerdings stehen“; kein Zusatz. Übung 83: „ein ruhiger Zug wie 1. Dc2“, also ist Dc2 nur ein
  Beispiel: 1. Te1 gilt jetzt auch. Schon umgesetzt in 0.2.55 (Nachtest N270), Widerspruch
  genügt.
- T2. **Menge der Zusatzaufgaben von Lichess** (gemeinfrei, CC0): 637 Taktikaufgaben (je
  Motiv und Stufe 8) und 120 Fallen-Aufgaben (je Stufe 12 Fallen und 12 Geschenke), dazu 37
  Taktik- und 12 Fallenaufgaben aus dem Buch. Genug, zu viel, oder lieber mehr für die Stufen
  1 bis 3?
  **Empfehlung:** reicht vorerst. Je Motiv und Stufe acht Aufgaben sind etwa zehn Runden; mehr
  erst, wenn du oder Testleser merken, dass sich Aufgaben wiederholen.
- T3. **Schwierigkeit:** Die Stufe 1 bis 5 jeder Aufgabe ist gemessen (Lichess-Wertung aus
  Millionen Lösungsversuchen; Buchaufgaben über die Suchtiefe der Engine daran geeicht). Soll
  es zusätzlich ein Feld geben, mit dem du die Stufe einzelner Buchaufgaben selbst setzt?
  **Empfehlung:** nein. Die Stufen sind gemessen, nicht geschätzt; ein Handfeld lohnt sich erst,
  wenn dir einzelne Buchaufgaben auffallen, die falsch eingestuft wirken.
- T4. **Fallen aus Kapitel 2 und 3:** Der Fallentrainer hat die zwölf Fallenchecks aus
  Kapitel 4 (Klammerfalle bis Damenfang auf b2). Sollen auch die Fallen aus den
  Eröffnungskapiteln dazu (Zugfolgen, in denen ein Schlag mit „?“ steht, etwa im
  Damengambit)? Die Pipeline könnte sie genauso ziehen.
  **Empfehlung:** ja. Fallen aus den Eröffnungen des Buches sind genau die, in die Leser später
  tappen; die Pipeline kann sie mit wenig Aufwand gleich ziehen (Fable).
  **Schon umgesetzt in 0.2.51 (Nachtest N263): jeder Schlag mit Fragezeichen in den Zugfolgen
  der Kapitel 2 und 3, den die Engine als Falle bestätigt. Widerspruch genügt.**
  **Nachgelesen im Buch (17.10.2026):** Kapitel 4: Eine Falle sieht aus wie Gewinn und kostet
  durch „eine sofortige taktische Möglichkeit“, anders als ein Gambit mit dauerhafter
  Kompensation. Empfehlung bestätigt: nur Schläge mit sofortiger Widerlegung.
- T5. **Strukturerkenner:** 134 Aufgaben, davon 46 aus Kapitel 5 mit Struktur, Seite und
  Plan nach dem Unterabschnitt, in dem das Buch die Abbildung zeigt, und 88 aus anderen
  Kapiteln mit einer klaren Struktur (Isolani, hängende Bauern, Minderheitsangriff,
  Doppelbauer, festgefahrene Kette, Mehrheit). Die Zuordnung Abbildung → Struktur und die
  Plan-Sätze sind ein Vorschlag von Claude (die Sätze stehen jetzt in der App, W6 am 17.10. angenommen). Reicht dir die Durchsicht in der App, wenn der
  Trainer da ist, oder willst du die Tabelle vorher als Liste im Chat sehen?
  **Empfehlung:** in der App durchsehen. Der Trainer ist seit 0.2.45 da (N238); auffällige
  Abbildungen und Sätze einfach mit Nummer melden.
  **Nachgelesen im Buch (17.10.2026):** Das Buch liefert die Zuordnung selbst (Strukturtabelle,
  Tabelle der Schwächen, Skelettbilanzen mit Folgerung). Drei Pläne wichen ab und folgen jetzt
  der Folgerung des Buches: 5.43 „Stellung öffnen“ (statt guten Läufer behalten), 5.44 „Raum
  nutzen“ (statt Flügel der Kette), 11.70 „Vorposten besetzen“ (Springer nach e5; der
  Doppelbauer ist gedeckt und kein Ziel). 5.17 und 5.22 passen mit den neuen Plan-Sätzen (W6).
  Schon umgesetzt in 0.2.55 (Nachtest N272).

#### C. Neue Regeln der Werkzeuge (plausibel entschieden)

- C1. **König im Schach in der Faktorenbilanz** (C1.6): Claude wertet ihn „teils“ (die
  Empfehlung sagte nur „nicht gut“). Deshalb heißt es in 3.23 und 3.68 weiter „Weiß liegt
  vorn bei Königssicherheit“ (der schwarze König ist „schlecht“). Soll ein König im Schach
  „schlecht“ heißen?
  **Empfehlung:** „teils“ lassen. Ein Schach ist oft nur vorübergehend; „schlecht“ wäre der
  König erst, wenn er dauerhaft ungeschützt steht.
  **Nachgelesen im Buch (17.10.2026):** Abb. 3.68: Das Buch sagt „Weiß ist schon verloren“, es
  bleibt nur 8. Ke2, dann Lg4#. Dort war „Weiß liegt vorn bei Königssicherheit“ falsch. Jetzt
  heißt ein König im Schach mit nur einem einzigen Zug „schlecht – der König steht im Schach
  und hat nur einen Zug“; sonst bleibt es bei „teils“ (3.23 hat mehrere Abwehrzüge, das Buch
  gibt dort keine Bilanz). Schon umgesetzt in 0.2.55, Widerspruch genügt.
- C2. **W4 in 4.21** (C1.7): Mit der neuen Regel (einziger Verteidiger gegen Matt) meldet die
  App dort zusätzlich die Bauern e2 und g2 als einzige Verteidiger von f3 gegen Sxf3#.
  Schachlich richtig, aber nicht das, was das Buch nennt. So lassen?
  **Empfehlung:** so lassen. Es ist schachlich richtig, und der Leser lernt dabei, wer f3
  wirklich verteidigt.
  **Nachgelesen im Buch (17.10.2026):** Die Rückfrage war falsch gestellt: Nach Sxf3+ verlässt
  der Springer e5 die e-Linie, dann fesselt die Dame e7 den Bauern e2 an den König, genau wie
  das Buch es für 4.22 erklärt („exd3 ist illegal“). e2 verteidigt f3 also nicht. Jetzt zählt
  ein Verteidiger gegen ein Matt nur, wenn er nach dem Mattzug legal ziehen darf; in 4.21
  bleibt nur „Bauer g2, einziger Verteidiger von f3 gegen Sxf3#“. Schon umgesetzt in 0.2.55.
- C4. **Gegenschlag zählen** (C1.13): Bei einem Hebel zählt die App weiter auf dem Zielfeld,
  weil du in 6.3 („drei gegen drei“) und 6.5 so zählst; nur bei schon bestehender Spannung auf
  dem Feld des angegriffenen Bauern. Einverstanden?
  **Empfehlung:** so lassen. So zählst du selbst in 6.3 und 6.5.
- C5. **Dauerschach** (C1.18): Claude nennt es nur, wenn die schachgebende Seite mindestens
  eine Leichtfigur zurückliegt (dein Motiv 12: „Wer klar verliert …“). Sonst hießen die
  Schachs im Turmendspiel 9.6 Dauerschach. Einverstanden?
  **Empfehlung:** so lassen. Sonst würde jede Schachserie im Turmendspiel als Dauerschach
  gemeldet.
  **Nachgelesen im Buch (17.10.2026):** Glossar und Kapitel 0: Dauerschach heißt, „der König
  entkommt den Schachs nicht“; eine Materialbedingung gibt es nicht. Abb. 9.34: Schwarz liegt
  nur einen Bauern zurück, und das Buch nennt die Rettung „das Dauerschach“. Jetzt zählt auch
  eine Schachfolge, die die Stellung wiederholt (der König entkommt nicht); die
  Leichtfigur-Regel bleibt für Schachserien ohne Wiederholung. 9.34 heißt damit Dauerschach.
  Schon umgesetzt in 0.2.55 (Nachtest N274).
- C6. **Gabel** (C2.12): Claude verlangt, dass jedes genannte Ziel für sich gewinnbar ist
  (König, wertvoller als der Gabler oder ungedeckt), sonst wäre König plus gedeckter Läufer
  auch eine Gabel. Passt das zu deinem „Eine Gabel sollte Material gewinnen“?
  **Empfehlung:** so lassen. Das ist genau dein Satz „Eine Gabel sollte Material gewinnen“.
  **Nachgelesen im Buch (17.10.2026):** Kapitel 7: „Material gewinnt die Gabel allerdings nur,
  wenn mindestens ein Ziel ungedeckt oder mehr wert ist als der Springer.“ Das ist eine
  notwendige Bedingung. Die Regel der App (jedes genannte Ziel für sich gewinnbar, König zählt
  immer) ist strenger, aber folgerichtig: Der Gegner rettet das wertvollere Ziel, also muss das
  andere fallen können. Ein Satz „Eine Gabel sollte Material gewinnen“ steht so nicht im Buch,
  das war deine Formulierung bei C2.12. Empfehlung: so lassen.
- C7. **Abb. 7.10** (C1.18): Die Zugfolge beginnt jetzt eine Stellung früher mit 1. Sf7+
  (der Springer kann nur von e5 kommen). Damit nennt „Motiv“ das Abzugsschach. Freigeben?
  **Empfehlung:** freigeben. Die Zugfolge ist legal und führt zur Abbildung, und der Springer
  kann nur von e5 kommen.
  **Nachgelesen im Buch (17.10.2026):** Die Bildunterschrift sagt „Abzugsschach nach 1. Sf7+“
  mit dem Turm e1; das geht nur vom Feld e5 aus. Empfehlung bestätigt.
- C8. **Berliner Endspiel aus schwarzer Sicht** (C1.9): Die App schlägt Schwarz dort einen
  Minderheitsangriff am Königsflügel vor; das Buch sagt dazu nichts. So lassen?
  **Empfehlung:** nicht mehr anzeigen. Im Berliner Endspiel spielt Schwarz in der Praxis mit dem
  Läuferpaar und der Mehrheit am Damenflügel, nicht mit einem Minderheitsangriff am
  Königsflügel; ein Rat, den das Buch nicht stützt, verwirrt eher.
  **Schon umgesetzt in 0.2.47 (Nachtest N247): Steht der Kandidat der gegnerischen Mehrheit
  schon in der eigenen Hälfte (im Berliner Endspiel e5), nennt die App keinen
  Minderheitsangriff. Schwarz bekommt dann die allgemeine Regel „Schwarz spielt am
  Damenflügel: Dort bildet die Mehrheit einen Freibauern.“ (die Mehrheit ist durch den
  Doppelbauern c7/c6 krank; das Läuferpaar sieht das Werkzeug nicht, es schaut nur auf die
  Bauern). Carlsbad (5.32 bis 5.34, 6.8) bleibt unverändert. Widerspruch genügt.**

- C9. **Kandidaten in 12.4** (C1.28): Nur „Matt scheidet aus“ hätte Dd1+ (−9) zum besten
  Kandidaten gemacht. Claude ergänzt deshalb einen Zug, der ein drohendes Matt abwehrt (dort
  5... Sf6, wie in der Opernpartie). Einverstanden?
  **Empfehlung:** so lassen. Ohne den Abwehrzug wäre ein Damenschach mit −9 der „beste“
  Kandidat, was dem Leser offensichtlich falsch vorkäme.
  **Nachgelesen im Buch (17.10.2026):** Kapitel 11: „6. Lc4 droht Matt auf f7“, und Schwarz
  stellt mit 6... Sf6 den Springer dazwischen (es ist Zug 6..., nicht 5...). Empfehlung
  bestätigt.

#### K. Stufen der Engine (AP 11, Fable; plausibel entschieden)

- K1. **Abstufung:** Fühlt sich die Abstufung nach N175 bis N177 richtig an (Konzept 8.2)?
  Wenn eine Stufe zu stark oder zu schwach ist: Welche? (Stufe 1 bis 3: Skill Level 0 mit
  Fehlerquote jeder dritte, vierte, fünfte Zug (Stufe 3 seit 0.2.85, vorher etwa jeder siebte); Stufe 4: Skill 3, jeder sechzehnte; Stufe 5 bis 7:
  Skill 6, 10, 15 ohne Fehler; Stufe 8 volle Stärke.)
  **Empfehlung:** erst nach deinem Test entscheiden. Wirkt eine Stufe zu sprunghaft, ist das
  eher ein Fall für R4 (Stufen menschlicher, seit 0.2.52) als für andere Zahlen.
- K2. **Damenopfer auf Stufe 1:** Nur Stufe 1 darf die Dame verschenken (Konzept: „ab Stufe
  2 nicht“). Soll auch Stufe 1 die Dame behalten (dann höchstens ein Turm Verlust)?
  **Empfehlung:** so lassen. Echte Einsteiger verlieren auch mal die Dame, und das Konzept nimmt
  erst ab Stufe 2 die Dame aus.
- K3. **Buchtreue:** Die Engine folgt auf allen Stufen zu 85 % je Zug den Eröffnungen aus
  Kapitel 2 und 3, also auch der „Einsteiger“ einige Züge lang fehlerfrei. So lassen (der
  Leser sieht die Eröffnungen des Buches), oder je Stufe weniger (etwa 50 % auf Stufe 1)?
  Seit 0.2.40 betrifft die Frage nur die Wahl „eine Eröffnung des Buches (zufällig)“; „frei“
  spielt ohne Buch, eine bestimmte Eröffnung mit Buchtreue 1.
  **Empfehlung:** so lassen. Seit 0.2.40 gibt es „frei“; wer ohne Buch spielen will, wählt das,
  und wer die Eröffnungen sehen will, bekommt sie auch auf Stufe 1.
- K4. **Drohung ignoriert ab einem Bauern:** Nach der Röntgen-Regel (Kapitel 1) zählt jede
  Drohung, Material zu gewinnen, also auch ein Bauer (2. Dh5 droht Dxe5+). Soll die Fehlerart
  „Drohung ignoriert“ erst ab einer Leichtfigur heißen?
  **Empfehlung:** so lassen. Das Buch zählt jede Drohung, Material zu gewinnen (Kapitel 1); auch
  ein verlorener Bauer ist ein Fehler, den der Leser sehen soll.
  **Nachgelesen im Buch (17.10.2026):** Kapitel 1: Eine Drohung ist jeder Materialgewinn im
  nächsten Zug, auch ein Bauer (Abb. 1.13). Empfehlung bestätigt. Kapitel 1 sagt aber auch,
  dass man eine Drohung ignorieren darf, wenn die eigene größer ist; „Drohung ignoriert“ ist
  ein Fehler nur, wenn die Engine den Verlust bestätigt (so ist es eingebaut).
- K5. **Verpasstes Matt in der Auswertung:** Werte sind auf ±10 begrenzt (Matt = 10). Wer
  von „Matt in 2“ zu „+5“ wechselt, bekommt deshalb „??“ (Verlust 5). So lassen?
  **Empfehlung:** ändern. Wer von Matt in 2 zu +5 wechselt, steht weiter klar auf Gewinn; „??“
  ist dafür zu hart. Lichess und chess.com rechnen die Bewertung vorher in eine Gewinnchance um;
  dann kostet dieser Zug fast nichts. Vorschlag: Verlust über die Gewinnchance messen, ab +5 nie
  mehr als „?!“.
  **Schon umgesetzt in 0.2.47 (Nachtest N245): Steht die ziehende Seite nach dem Zug noch bei
  +5 oder besser, gibt es höchstens „?!“, auch in der Engine-Karte und ohne Eintrag unter
  „Grobe Patzer“. Der Verlust je Zug bleibt in Bauern (die Genauigkeit rechnet ohnehin über die
  Gewinnchance). Widerspruch genügt.**
- K6. **Stufen 4 bis 7 ohne Elo-Begrenzung:** Die Stufen nutzen Skill Level 3, 6, 10, 15
  (geräteunabhängig: Die Stärke hängt von der Suchtiefe ab, nicht vom Gerät). Die Namen der Stufen bleiben; eine
  Elo-Zahl zeigt die App nicht. Einverstanden?
  **Empfehlung:** so lassen. Feste Skill Levels geben auf jedem Gerät dieselbe Stärke; eine Elo-
  Zahl je Stufe wäre nur geraten.

#### D. Buch

- D1. **Abb. 4.45 (D.3):** Der Buchstand vom 16.10.2026 ist vollständig übernommen. Stellung,
  Pfeile, Feldmarkierungen und Bildunterschrift von 4.45 sind dabei unverändert geblieben
  (nur die Zeile im LaTeX hat sich verschoben). Betraf deine Änderung den Text um die
  Abbildung, ist alles drin; betraf sie die Stellung oder die Markierungen, fehlt sie noch im
  privaten Repository. Bitte kurz bestätigen.
  **Empfehlung:** Ein Wort genügt („Text“ oder „Stellung“); bei „Stellung“ die neue Fassung
  hochladen, Claude macht den Datenlauf.
  **Nachgelesen im Buch (17.10.2026):** Im Buchstand vom 16.10. ist an der Stellung von 4.45
  nichts geändert, wohl aber die Zeile F3 der Fallenprüfung „Damenfalle im Dänischen Gambit“
  (jetzt: der Läufer b2 fesselt g7 relativ an den Turm h8, „teils“). Diese Zeile ist in der App
  übernommen. Bitte nur bestätigen, dass du den Text meintest.

- D2. **Glossar und Steckbriefe sind sich bei der Phase uneins (Befund aus S17, ersetzt C3).**
  Seit 0.2.61 folgt die Phase an allen Abbildungen dem Glossar, wie du entschieden hast:
  Mittelspiel erst, wenn beide Seiten entwickelt sind (höchstens eine Leichtfigur zu Hause) und
  rochiert haben. „Rochiert haben“ liest die App aus den Zügen des Buches, damit ein König, der
  rochiert hatte und dann gejagt wird, weiter als rochiert gilt (Colle 11.12 bis 11.14, Lasker
  11.18 bis 11.21 für Schwarz, Unzicker 11.82 und 11.84). Damit stimmen die Opernpartie (11.4 bis
  11.9) und Anderssen–Dufresne (11.25 bis 11.31) mit ihren Steckbriefen „Eröffnung bis
  Mattangriff“ überein. Drei Stellen widersprechen ihrem Steckbrief, weil eine Seite nicht
  rochiert hat: **Lasker–Thomas** (Steckbrief „Mittelspiel“; Weiß rochiert erst mit dem Mattzug,
  also nach dem Glossar Eröffnung bis zum Schluss), **Fischer–Petrosjan 11.43 und 11.44**
  (Steckbrief „Mittelspiel bis Endspiel“, an 11.43 steht die Skelettbilanz; Schwarz rochiert erst
  im 15. Zug) und **Opernpartie 11.98** (Übung, nach 11. Lxb5+). In den Kapiteln 1 bis 7 und 10
  werden dadurch 127 Abbildungen von „Mittelspiel“ zu „Eröffnung“, fast alle aus Eröffnungen
  der Kapitel 2 und 3, was zum Buch passt.
  **Empfehlung:** Im Buch die Steckbriefe von Lasker–Thomas („Eröffnung bis Mattangriff“) und
  Fischer–Petrosjan („Eröffnung bis Endspiel“) angleichen, oder im Glossar ergänzen, dass ein
  König, der in der Mitte bleibt, das Mittelspiel nicht aufhält, wenn beide Seiten entwickelt
  sind. Die App bleibt beim Glossar, bis du entscheidest.

#### E. Vor der Veröffentlichung der App (zurückgestellt, bis App und Website fertig sind)

- E3. **Buchbeschreibung** auf der Startseite: Entwurf bestätigen oder ersetzen.
  **Empfehlung:** denselben Text wie auf der Rückseite des Buches nehmen, dann stimmen Buch
  und Website überein.
  **Nachgelesen im Buch (17.10.2026):** In den Buchquellen gibt es keinen Rückseitentext. Der
  Untertitel lautet „Vom sicheren Einstieg zum strategischen Plan – Eröffnungen meistern,
  Fallen durchschauen und souverän gewinnen“. Korrigiert: Die Startseite sagte „bis zu einer
  Spielstärke von etwa 2000 Elo“; das Buch sagt „in Richtung Elo 2000“ und ausdrücklich „Allein
  aus einem Buch heraus erreicht niemand 2000 Elo“. Jetzt: „bis zu den Ideen, die für den Weg
  in Richtung Elo 2000 entscheidend sind“. Schon umgesetzt in 0.2.55.
- E4. **Bezugsquellen:** ISBN und Shop-Links, sobald sie feststehen.
  **Empfehlung:** nachtragen, sobald die ISBN vergeben ist; bis dahin bleibt der Platz leer.

## Konstruierte Zugfolgen und Tablebase (19.10.2026 nachts, Opus, Zweig `zugfolgen-konstruiert`, Version 0.2.96)

Entscheidung des Autors vom 18.10.2026: Zugfolgen für alle Abbildungen, die aus einer
realistischen Partie erwachsen können; deutlich gekennzeichnet, weil das Buch die einzige Quelle
ist (Regel 1). Dazu die Tablebase für die Endspielabbildungen.

- **Einordnung** (`inhalte/de/konstruktion.json`, je Abbildung mit Grund): 67 Abbildungen ohne
  Zugfolge (die Zahl 125 in älteren Notizen war veraltet), 30 realistisch, 37 nicht (Lehrbilder
  ohne König, Bauernskelette, Mattmuster mit weggelassenen Steinen, Schemata). Rückfrage ZF1.
- **Status „konstruiert“:** PGN `kNN-aMM-k.pgn`, nie überschrieben oder gelöscht, immer in den
  Daten (nach den freigegebenen), in der App der Hinweis „Zugfolge von Claude konstruiert, nicht
  aus dem Buch“. Erreicht die Partie die Abbildung nicht exakt (Stellung, Zugrecht,
  Rochaderechte, schlagbarer En-passant-Bauer; Zähler zählen nicht), ist das ein Fehler im
  Datenlauf. Studien- und Zugerraten-Trainer, Repertoire-Trainer, Eröffnungsindex (die Buchzüge
  der Engine) und die Taktikdaten nehmen sie nicht (`app/src/daten/buchbeispiele.ts`).
- **Verfahren** (`pipeline/zugfolgen/konstruktion.py`, `zielabstand.py`, `konstruieren.py`):
  Strahlsuche ab einer gängigen Eröffnung der Lichess-Liste (Spanisch Abtausch, Italienisch,
  Damengambit Abtausch, Sizilianisch offen). Zur Wahl je Stellung die acht besten Züge der
  Engine und die sechs zielnächsten; ein Zug bleibt nur mit höchstens 4 Prozentpunkten
  Gewinnchance Verlust. Ausnahmen: das späte Zugeständnis (das Ziel verlangt Material ohne
  Gegenwert, der Gegner hat höchstens noch 3 Bauerneinheiten zum Tauschen, die beste Antwort
  schlägt; bis 40 Prozentpunkte) und der Zug, der die Abbildung erreicht (Patt in Abb. 0.11 und
  8.7). Abstand: eindeutige Zuordnung der Steine (Bitmaske), Bauern nur vorwärts, Überzahl,
  ab 12 Bauerneinheiten Überzahl ein Schlagweg zu den überzähligen Steinen (bei 4 wanderten Türme
  und Könige bis zu 50 Züge). Am Ende kürzt eine Breitensuche reine Königswege. Die Suche
  nutzt eine native Stockfish nur lokal; geprüft wird mit der Engine der App.
- **Ergebnis:** 29 von 30 Partien, 25 bis 130 Halbzüge. Genauigkeit (Formel der App,
  `app/src/spiel/konstruiert.messung.ts`, Tiefe 18, als Kopfzeile `[Genauigkeit "…"]` in der
  PGN): in 27 Partien beide Seiten mindestens 80 %, meist 85 bis 98 %. „??“ fast nur bei
  geplanten Zugeständnissen und Patt. Abb. 10.21 Schwarz 78 %, Abb. 11.10 Schwarz 69 % (die
  Abbildung ist für Weiß gewonnen, 1. Lxh7+ +4,2, der letzte schwarze Zug muss ein Fehler sein).
  Die Mittelspiele sind von Hand gebaut (Semi-Tarrasch für 5.18 und 11.42, 85 und 83 %, ohne
  „??“; Französisch klassisch mit Sce2 für 11.10), weil die Suche Mittelspiele nicht trifft;
  die erste Fassung von 5.18 hatte drei „??“ (Lb5 vor der Rochade erlaubte Da5+), die zweite
  rochiert, solange der Springer c3 die Diagonale sperrt, und endet mit dem Zurückschlagen Sxd4.
- **Nicht gelungen:** Abb. 7.24 (lange Rochade, eingesperrter Läufer a2), auch mit Vorlauf.
  Rückfrage ZF3.
- **Daten:** Die Kapiteldaten auf `main` stammen von einem älteren Buchstand; ein voller Datenlauf
  mit dem Buchstand vom 17.10. hätte auch Glossar und Prüfsummen geändert. Deshalb sind nur die
  konstruierten Beispiele und die 29 Verknüpfungen in die vorhandenen Daten eingefügt (mit
  `lies_freigegebene` der Pipeline, Schema geprüft). Der nächste volle Datenlauf erzeugt dasselbe.
- **Tablebase** (`pipeline/pruefen/tablebase.py`): Lichess-API mit Kennung
  „schach-von-grund-auf.com“, eine Abfrage je Sekunde, Zwischenspeicher nur lokal; 137
  Endspielabbildungen bis sieben Steine. Keine Endspielaufgabe des Trainers widerspricht.
  8.25 und 8.26 mit Weiß am Zug remis (Buch behauptet nichts anderes, Vorschlag für die
  Unterschrift in ZF4), 9.41 remis wie im Buch, 9.23 zu viele Steine, Engine Tiefe 32 nach
  1. Txa7 +0,03 (passt zum Buch). Syzygy lokal wäre knapp 1 GB gewesen, für diese Fälle unnötig.

## Design-Überprüfung (19.10.2026, Opus, Zweig `design-ueberarbeitung`, Version 0.2.98)

Auftrag des Autors vom 18.10.2026; am 19.10.2026 alle 18 Vorschläge angenommen („Alle, ja“,
Rückfrage G1). Grundlage: Apple HIG, Material 3, WCAG 2.2, Regeln für Lern-Apps, Vergleich mit
Lichess, chess.com und ChessKid. Bilder vorher und nachher im privaten Artifact
<https://claude.ai/artifact/8HuxsERV6rwM2YyXvyfRii> (nicht im Repository, weil sie Abbildungen
und Bildunterschriften des Buches zeigen). Je Vorschlag ein Commit mit „DSn“ im Betreff.

- DS1: Schriftgrößen nur noch als Stufen `--groesse-*` in rem; 1 rem = 17 px bei
  Standardschrift, folgt der Systemschrift (iPhone `font: -apple-system-body` nur mit
  `-webkit-touch-callout`, Chrome Android `<meta name="text-scale" content="scale">`). Kleinste
  Schrift 13 px. Fest bleiben die Beschriftung der Leiste unten (12 px, wie die Tab-Leiste am
  iPhone) und Zahlen in Ring und Bewertungsbalken. Bei 200 % kein Überlauf bei 360 px.
- DS2: `ui/stil/breit.css`: ab 600 px Breite im Querformat Leiste als Schiene links, jeder
  Behälter mit `.brettbereich` als direktem Kind zweispaltig (Brett links in voller Höhe,
  klebend; alles andere rechts), Bildschirme ohne Brett in 760 px Lesebreite; Tablet hoch
  720 statt 640 px. Brett mit Bewertungsbalken nimmt die volle Breite.
- DS3 runde Marke „am Zug“; DS4 Trainer in der Trainingsliste als Zeilen; DS5 Wort unter jedem
  Brettsymbol (`*.kurz` in de.json); DS6 Trainerrunde ohne Beschreibung, mit
  Fortschrittsbalken, Auftrag linksbündig 20 px; DS7 Reiter mit Symbol über dem Wort; DS8 Chips
  und Aufklappzeilen 44 px; DS9 lange Titel der Kopfzeile; DS10 „Aufgeben“ klein rechts; DS11
  Aufklappzeilen in Spielen mit Dreieck; DS12 Werkzeugleiste blendet rechts aus; DS13 „Alle
  abhaken/zurücksetzen“ nebeneinander; DS14 „Über die App“ am Ende der Einstellungen; DS15
  „Bewegung reduzieren“ überall; DS16 Knöpfe unter den Trainingsseiten der Website; DS17
  Spielstärke-Tabelle unter 480 px mit Beschriftung über den Werten; DS18 Kapitelnummern im
  Training wie im Buch.
- Bewusst nicht geändert: Gegnerwahl (Bot-Chat), kein sichtbarer Seitentitel in den
  Einstellungen (Wunsch 0.2.30), Werkzeugleiste bleibt waagerecht scrollbar (Wunsch 0.2.86).

## Wünsche des Autors vom 19.10.2026 morgens (Opus, Zweig `spielen-sammlung-nachschlagen`, Version 0.2.99)

Der Autor erlaubte dafür ausdrücklich, die Dateien des Bot-Chats anzufassen (GegnerWahl.tsx,
Gegnerstufen.tsx, engine/gegner.ts).

- Spielen: Farbe, Bedenkzeit, Rücknahme, Spielhilfen und „Gewertete Partie“ stehen als Block
  zwischen Gegnerart und „Partie beginnen“ (über den `beginnen`-Platz der Gegnerwahl); die
  Erklärung zur Wertung hinter einem Fragezeichen.
- Porträts für eigene Bots: feste Liste von 30 Bildern (`engine/portraetwahl.ts`,
  `app/public/gegner/wahl-01.svg` bis `wahl-30.svg`, Skript `skripte/erzeuge-portraetwahl.mjs`,
  DiceBear „Personas“ wie die vorgefertigten), fünf Altersgruppen zu je sechs; Auswahlmenü mit
  Gruppen im Editor. Feld `portraet` am eigenen Gegner, optional.
- Besiegte Bots: Liste `spiel.besiegt` (Kennungen), wächst beim Ablegen einer gewerteten, vom
  Leser gewonnenen Partie gegen einen Bot; ältere Daten ergänzt aus den gespeicherten Partien;
  „Wertung zurücksetzen“ leert sie. Stern am Porträt (`GegnerBild.tsx`).
- Partienliste: Porträt je Partie, Filter nach Ergebnis (aus Sicht des Lesers) und Wertung ab
  vier Partien, „Weitere Partien zeigen“ in Zehnerschritten, Löschen nur ungewerteter Partien
  mit Nachfrage (`ohnePartie`).
- Kapitelübersicht: Zeichen für Warum-Fragen (gesperrt, offen, beantwortet) mit Legende;
  beantwortete Fragen im Feld `fortschritt.warum` (Abbildung → Stellen der Fragen), Zähler im
  Kapitelfortschritt und Summe in den Einstellungen. Eine Frage zählt als beantwortet, ob richtig
  oder falsch (bearbeitet wie eine gelesene Karte).
- Nachschlagen geprüft: Glossar, Denkroutine und Gesamt-Checkliste vollständig; neu die Seiten
  „Steckbriefe“ (13 Eröffnungen aus Kapitel 2, 14 Fallenchecks aus Kapitel 4, Begriffe wie im
  Buch) und „Werkzeuge des Buches“ (alle Werkzeuge nach Kapiteln mit Bedienung und Regel).
- Nutzerdaten: Die neuen Felder (`portraet`, `besiegt`, `warum`) sind zusätzlich und optional wie
  in 0.2.90; das Format bleibt 5. Eine ältere App ließe sie beim Speichern fallen, ohne Schaden.

## Porträtwahl mit Vorschaubildern (19.10.2026, Opus, Zweig `portraet-bildauswahl`, Version 0.2.100)

Wunsch des Autors: Im Auswahlmenü für das Porträt eines eigenen Bots sollen die Bilder schon zu
sehen sein, statt jedes einzeln wählen zu müssen. Ein Auswahlmenü des Systems (`<select>`) kann
keine Bilder zeigen; deshalb jetzt ein eigenes Aufklappmenü (`ui/komponenten/PortraetAuswahl.tsx`):
ein Knopf mit gewähltem Bild, Beschreibung und Pfeil, darunter ein Gitter aller Porträts nach
Altersgruppen (drei je Zeile auf dem Handy, sechs ab 480 px). Die Kacheln sind Optionsfelder einer
Gruppe: Pfeiltasten wählen, ohne zu schließen; Tippen auf ein Bild oder die Eingabetaste wählen und
schließen; Escape schließt. Der Bildschirmleser liest Gruppe „Porträt“ und die Beschreibung jedes
Bildes. Gespeicherte Daten unverändert (`EigenerGegner.portraet`).

## Symbolsprache DS19 bis DS29 (19.10.2026, Opus, Zweig `symbolsprache`, Version 0.2.101)

Wunsch des Autors: Seiten sollen beim Scrollen ohne Lesen erfassbar sein, mit allgemein bekannten
Zeichen, Farben und Strukturen (Beispiele des Autors: Aufklappzeichen, Diskette, farbige Zahlen,
die Stufen der Bots). Grundlage: Durchsicht aller Bildschirme und eine Recherche (NN/g zu
Layer-Cake-Scanning, Icon Usability, Akkordeon-Zeichen und Diskette; Apple HIG Color und Icons;
WCAG 1.4.1 und 1.4.11; Lichess und chess.com). Leitsätze: Wort und Zeichen immer zusammen; eine
Bedeutung, ein Zeichen; Farbe nie allein; Pfeil nach unten klappt auf, Pfeil nach rechts öffnet
eine Seite; Kennfarben sparsam (Gold für Zeichen, Gürtelfarben nur für Stufen, Rot nur für Gefahr).

- DS19 Stufenmarken in Gürtelfarben (Weiß, Gelb, Orange, Grün, Blau, Lila, Braun, Schwarz; die
  Helligkeit nimmt mit der Stufe ab, die Zahl steht in der Marke), Spaß-Gruppe mit Konfetti;
  Porträtreihe und Zähler besiegter Bots in jeder Stufenzeile (`Stufenmarke.tsx`, `Gegnerstufen.tsx`).
- DS20 ein Aufklappzeichen: Pfeil nach unten am Zeilenende, offen nach oben; Zeilen ohne eigenen
  Pfeil bekommen ihn über `symbole.css` statt des Dreiecks ▶.
- DS21 Pfeil nach rechts an Zeilen, die eine Seite öffnen (Buch, Nachschlagen).
- DS22 Zeichen an Knöpfen (`Knopfsymbol.tsx`): Diskette nur für Speichern in der App, Pfeil nach
  unten für Dateien; Fahne für Aufgeben wie bei Lichess und chess.com (die Flagge des Endspiels ist
  eine Zielflagge in anderem Zusammenhang).
- DS23 Löschen rot schon vor der Nachfrage.
- DS24 Zeichen vor Abschnittsköpfen (`Titelsymbol.tsx`, `Auswahl` mit `symbol`).
- DS25 Ergebnismarke aus Sicht des Lesers (`Ergebnismarke.tsx`): Pokal/Gold, Händedruck/Grau,
  Kreuz/Rot; neutral bei Mensch gegen Mensch.
- DS26 Phasenzeichen aus der Auswertung an den Stufenreglern und in der Denkroutine
  (`Phasenzeichen.tsx`, `phaseZumNamen`).
- DS27 Fortschritt als goldener Rand der Kapitelnummer im Buch und in der Gesamt-Checkliste
  (`Kapitelnummer.tsx`); der kleine Ring neben dem Text im Buch (Wunsch vom 18.10.2026) ist an
  die Nummer gewandert.
- DS28 Werkzeugzeichen in „Werkzeuge des Buches“ wie am Brett und in der Werkzeugleiste.
- DS29 Glossar ohne Suche nach Anfangsbuchstaben mit stehenden Trennern und Sprungleiste.

Vorlage mit Bildern vorher und nachher als privates Artifact (Bilder nicht im Repository).
Freigabe des Autors am 19.10.2026: „Alles, ja“. Testpunkte N475 bis N482.

## Uhr beim Verlassen sofort sichern (19.10.2026, Opus, Zweig `uhr-sichern`, Version 0.2.102)

Befund N180 (seit 0.2.36 offen): Beim schnellen Neuladen am Rechner ging die Bedenkzeit seit dem
letzten Zug verloren, weil der Browser das Schreiben in IndexedDB abbricht. Der Autor hatte den
Punkt noch nicht beantwortet; nach seinem „Ja“ vom 19.10.2026 zur Liste der nächsten Schritte
(Punkt b) ist der zweite Speicherweg jetzt gebaut: Beim Anhalten der Uhr (Hintergrund, `pagehide`,
Bildschirm verlassen) legt `ui/komponenten/uhrNotsicherung.ts` den angehaltenen Uhrstand
synchron in den Gerätespeicher (Merker `uhrNotsicherung` mit Kennung und Zahl der Züge). Beim
Öffnen der Partie gilt er, wenn Kennung und Zugzahl passen; bei der Rückkehr wird er verworfen.
Kein neues Speicherformat: Der Merker darf verloren gehen, dann gilt wie bisher IndexedDB.
Komponententests in `uhrNotsicherung.test.ts`, Oberflächentest „Neuladen mitten im Nachdenken“
in `spielen.spec.ts` (Hinweis: Chromium ohne Kopf bricht beim Neuladen das Schreiben nicht ab,
der Test bestand auch vorher; er sichert das Verhalten für die Zukunft ab).
Nebenbefund: Der Oberflächentest „Alle Daten löschen entfernt auch die Datenbank“ scheitert lokal,
wenn er mit zwei Arbeitern neben `spielen.spec.ts` läuft, auch auf dem unveränderten Stand 0.2.101;
allein und in GitHub Actions besteht er. Nicht durch diese Änderung verursacht.

## Spielstärke nur bis zur Entscheidung, Kurven und Bot-Zahlen neu geeicht (19.10.2026, Opus, Zweig `genauigkeit-bis-entscheidung`, Version 0.2.103)

Anlass: In einer Partie des Autors gegen Stufe 1 verlor die Engine nach 9...Db8?? die Dame, spielte
34 Züge in verlorener Stellung weiter und bekam 89 % Genauigkeit und „etwa 1700“. Ursache: Die
Lichess-Rechnung kappt die Bewertung bei ±10 Bauern; in entschiedener Stellung gibt es keine
Gewinnchance mehr zu verlieren, jeder Zug zählt als fast perfekt. Wunsch des Autors: Für die
Spielstärke zählen nur die Züge, bis die Partie dauerhaft entschieden ist; Schwankungen
verschieben den Punkt nach hinten. Danach die Kurve Genauigkeit → Spielstärke neu eichen; die Bots
nicht neu messen (Absprache mit dem Autor: Ihre Stärke und Reihenfolge bleiben, nur die Anker
verschieben die Zahlen).

- **Regel** (`spiel/entscheidung.ts`): Entscheidungspunkt ist die erste Stellung, ab der eine
  Seite bis zum Ende mindestens 90 % Gewinnchance hat (dieselbe Grenze wie „entschieden“ beim
  Polster). Es zählen die Züge davor, auch der Zug in die entschiedene Stellung. Ist schon die
  Startstellung entschieden oder endet die Partie offen, zählen alle Züge. Gilt für die innere
  Genauigkeit, die Spielstärke je Partie, die Spielstärke je Phase und Zugart, das Urteilswort je
  Phase und „Deine Spielstärke“ über zehn Partien. Die angezeigte Genauigkeit (Schalter „wie
  Lichess / App / chess.com“) zählt weiter alle Züge, damit sie mit diesen Seiten vergleichbar
  bleibt. Schätzung weiter ab zehn gezählten Zügen (je Phase sechs).
- **Anzeige:** „aus N Zügen bis zur Entscheidung“ hinter der Spanne, „zu wenige Züge vor der
  Entscheidung“, je Phase „nach der Entscheidung“ ohne Urteilswort; Satz in der Erklärung.
- **Eichung:** je 300 neu gesammelte gewertete Schnellschach-Partien von chess.com und Lichess
  (je 30 in jedem 200-Punkte-Band von 400 bis 2399; die Rohdaten von 0.2.83 lagen in einem anderen
  Container), in Tiefe 18 nachgerechnet, Seiten mit mindestens zehn gezählten Zügen. Vergleich an
  denselben Kontrollseiten, Betrag der Abweichung Schätzung − Wertung (neue Regel gegen alle
  Züge): chess.com je Partie 524 gegen 556, über zehn Partien 572 gegen 577; Lichess je Partie
  331 gegen 373, über zehn 312 gegen 345. Die Regel trifft also überall etwas besser. Auf der
  chess.com-Seite streut die Schätzung in dieser Stichprobe stärker als 2026-10-18 (damals 370
  bis 480 je Partie); die Genauigkeit sagt bei chess.com über 1800 kaum noch etwas (Kurve endet
  bei etwa 1860). Spanne in der App unverändert (±400 bis ±250).
- **Neue Kurven** (`spiel/staerkemodell.ts`): Beispiele 80 % → etwa 1550 (chess.com 1500,
  Lichess 1650); zehn Partien mit 75 % → etwa 1550 (1300 bis 1800). Regler der Schalterstellungen
  unverändert (die Eichung fand Mittelweg 0,60 und nahe chess.com 0,2 statt 0,55 und 0,1; der
  Unterschied liegt im Rauschen wie 2026-10-18).
- **Bot-Zahlen** (`engine/botstaerke-daten.ts`, Messlauf `engine/botstaerke.messung.ts` mit der
  neuen Regel und den neuen Kurven auf denselben Anker-Partien): Anker Stufe 1 bei 57 % → 850,
  Stufe 2 bei 72 % → 1413, Stufe 3 bei 79 % → 1738 (Stufe 4 bis 6 gesättigt wie bisher). Alle
  Zahlen sinken gemeinsam um 212: Stufen 983, 1319, 1698, 1868, 2147, 2383, 2699, 3011;
  Spaß-Bots Fritzi 371, Onkel Willi 564, Tante Trude 670, Bruno 869. GE1 (Spaß-Bots
  unter dem Wunschbereich 500 bis 1000): Der Autor entschied am 19.10.2026 „so lassen“; die Spaß-Bots
  werden nicht neu gemessen.
- **Vergleichsschalter:** `EICHUNG_ALLE_ZUEGE=1 npm run messen:eichung` rechnet die Eichung wie
  vor 0.2.103 über alle Züge.

## Englische Fassung als Vorschau (19.10.2026, Opus, Zweig `englisch`, Version 0.2.104)

Wunsch des Autors (19.10.2026): „erarbeite doch schon einmal eine englische Fassung der App. Nur
bei Texten, die wörtlich aus dem Buch zitiert werden, müsstest du meine Fassung warten … Züge im
Englischen teilweise anders notiert, zB B statt L.“

- `app/src/i18n/en.json`: alle Schlüssel von de.json außer 27 wörtlichen Buchzitaten
  (`en.buchzitate.json`, Rückfrage EN2); diese erscheinen deutsch. Gefunden per Abgleich jedes
  Textes mit dem LaTeX (Stücke ab 30 Zeichen oder ganzer Text), dann von Hand gesichtet:
  Regeln, Merksätze, Fragen und Überschriften des Buches bleiben deutsch, Schachbegriffe und
  Werkzeugnamen werden übersetzt (vorläufige Namen, Rückfrage EN1, Liste
  `docs/ENGLISCH_BEGRIFFE.md`). Übersetzt in sechs Teilen mit gemeinsamer Begriffsliste, danach
  geprüft: gleiche Platzhalter, keine deutschen Figurenbuchstaben in Zügen, kein Dezimalkomma,
  Knopfnamen in Sätzen gleich wie auf den Knöpfen (Test `i18n/en.test.ts`).
- Englisch ist Vorschau: nur auf Wahl in den Einstellungen, nie nach der Sprache des Geräts
  (`FERTIGE_SPRACHEN`). Buch- und Trainerdaten kommen weiter aus `/daten/de/`
  (`datensprache()`), bis es englische Buchquellen gibt; Züge darin erscheinen englisch
  (`buchzugInSprache`).
- Notation überall nach der Sprache: Stellen, die fest „de“ übergaben (Auswertung, Rückblick,
  Nebenzweige, Eröffnungswahl, Fehlerdatenbank, Denkroutine, Abweichung, Nachspielen), nehmen
  jetzt `sprache()`. Zahlen und Daten über `zahlText` und `datumText` (1,5 / 1.5,
  19.10.2026 / 10/19/2026). „Abb.“ an zwei Stellen aus dem Code in die Sprachdatei.
- Kürzel am Brett aus dem Code in die Sprachdatei: Bauernschwächen und Drohung (Englisch B für
  backward, C für chain base, T für threat; Rückfrage EN3). Der Notations-Trainer gibt auf
  Englisch keinen Hinweis „das Buch schreibt S, L, T, D“ mehr.
- Oberflächentest `englisch.spec.ts` (Wahl, Neuladen, Abbildung, Spielen, Training).

## Kurze Partien zählen für die Wertung (19.10.2026, Opus, Zweig `wertung-kurze-partien`, Version 0.2.105)

Rückmeldung des Autors: Gegen die Spaß-Bots steht seit 0.2.103 bei vielen Partien „zu wenige
Züge vor der Entscheidung“. Das ist gewollt (zehn eigene Züge vor der Entscheidung, je Phase
sechs; ein Sieg nach acht Zügen sagt nichts über die Spielstärke). Ungewollt war die Folge für die
Elo-Wertung: `wertungspunktFuer` verlangte noch eine Schätzung des Gegners (Regel bis 0.2.83, als
die Gegnerzahl aus dieser Schätzung kam). Seit 0.2.85 ist die Gegnerzahl fest (Bot oder Stufen),
die Bedingung also überflüssig; sie ließ seit 0.2.103 fast jede kurze Partie gegen Spaß-Bots aus
der Wertung fallen. Jetzt gestrichen. Die erste gewertete Partie braucht weiter die Schätzung des
Lesers (sie setzt den Anfangswert); „Deine Spielstärke“ über zehn Partien nimmt weiter nur
Partien mit Schätzung des Lesers.

## Farbabstimmung DS30 bis DS37 (19.10.2026, Opus, Zweig `farbabstimmung`, Version 0.2.106)

Frage des Autors: Ist die Farbgebung hell und dunkel stimmig, nicht zu bunt, nicht zu
kontrastarm? Der Hintergrund der Porträts wirkte im hellen Modus zu dunkel. Dazu der Wunsch, den
Springer des Covers als App-Symbol zu nehmen. Vorgehen: Bilder aller Bildschirme in hell und
dunkel, dazu eine Messung je Bildschirm und Modus (axe für Text, eigenes Skript für Zeichen,
Marken und Rahmen gegen ihren Hintergrund, Bestand der bunten Farben). Ergebnis vorher: kein
Textkontrast-Fehler; 460 Marken und Rahmen und 7 Zeichen unter 3:1 (WCAG 1.4.11); Haken und
Regler im Systemblau; navy Zahlkreise im Dunkelmodus fast unsichtbar (1,1:1); helle Gürtel auf
Weiß (1,5 bis 1,8:1) und dunkle Gürtel auf Navy (1,7 bis 2:1) kaum abgegrenzt. Nachher: 32 Stellen,
die das Skript nicht messen kann (Ringe als Verlauf oder Schatten), von Hand geprüft 3:1.

- DS30 Porträts ohne eingebauten Hintergrund (Rechteck #3b4a6b aus allen 98 SVG entfernt, Skripte
  entfernen es nach DiceBear, damit die Gesichter gleich bleiben); die App legt `--portraet-grund`
  dahinter: helles Navy #dfe5ee (hell, aus derselben Farbfamilie wie das Navy und mit besserem
  Abstand zu warmen Hauttönen als Creme oder Sand), Schieferblau #3b4a6b (dunkel, wie bisher).
- DS31 `accent-color` aller Haken, Optionsfelder und Regler: Navy (hell), Gold (dunkel).
- DS32 Zahlkreise (`--marke-grund`): im Dunkeln #3b4f75 mit hellem Rand statt Navy auf Navy.
- DS33 Stufenmarken etwas ruhiger; Weiß, Gelb, Orange mit dunklerem Rand ihrer Farbe (hell),
  alle mit hellem Rand (dunkel); „Zum Spaß“ Konfetti in Gold statt Regenbogen.
- DS34 `--rand-bedien` für Chips, Zweitknöpfe und Felder: #958a73 (3,4:1 auf Weiß, 3:1 auf
  Creme), dunkel #6b7fa3; Fortschrittsringe in `--gold-strich` #b08a1a (3,2:1).
- DS35 Warum-Zeichen mit Rand; Zugarten-Marken (Farben wie chess.com) so weit abgedunkelt, dass
  das weiße Zeichen 3:1 erreicht; großes Ergebniszeichen mit Rand in seiner Farbe.
- DS36 Partien gegen eine Engine-Stufe zeigen die Stufenmarke statt „S“; dabei behoben: die Regel
  `.partienliste .begriff-knopf span` färbte auch Ergebnis- und Stufenmarke grau.
- DS37 App-Symbol für den Startbildschirm aus dem goldenen Springer des Covers
  (`skripte/erzeuge-appsymbol.mjs`, Ausschnitt mit den Pfeilen, zum Rand in Navy abgedunkelt,
  eigener Ausschnitt für das runde maskierbare Symbol, auf 256 Farben verkleinert). Bei 60 Pixeln
  gut erkennbar, bei 16 bis 40 Pixeln nicht; der Browser-Tab behält den schlichten Springer.

Vorlage mit Messwerten und Bildern vorher und nachher als privates Artifact (Bilder nicht im
Repository). Freigabe des Autors am 19.10.2026: „Alles ja“. Testpunkte N483 bis N489.

## Testpunkte 0.2.98 bis 0.2.101 vorgeprüft (19.10.2026, Opus, Zweig `testpunkte-vorpruefen`, Version 0.2.107)

Wie Chat C am 18./19.10.: mit der gebauten App in Playwright (Handygröße 393 px, quer 844 × 390,
Tablet 1024 × 768, hell und dunkel, „Bewegung reduzieren“), Bildschirmfotos durchgesehen.
Gestrichen, weil ohne Auge des Autors prüfbar und in Ordnung:

- **N452** runder Stein „am Zug“ (Klasse `am-zug-marke`, im Dunkelmodus mit hellem Rand),
  **N453** Trainer als Zeilen, „Abweichungsmodus“ und „Strukturerkenner“ einzeilig,
  **N454** Brettsymbole in einer Zeile (Abb. 7.10: Zählen, Ziehen, Engine, Röntgen, W1–W7; in
  der Partie dazu Drehen, Ruhig), **N455** Fortschrittsbalken in der Trainerrunde,
  **N456** fünf Reiter nebeneinander mit Symbol, **N457** Chips 44 px hoch, **N458** Titel,
  **N459** Zurücknehmen und Aufgeben in einer Zeile, Aufgeben grau rechts,
  **N461** Werkzeugleiste blendet rechts aus (Maske), **N462** „Alle abhaken“ und „Alle
  zurücksetzen“ nebeneinander, **N463** Reihenfolge der Einstellungen, **N464** Übergänge
  bei „Bewegung reduzieren“ 0,00001 s, **N465** Website Kapitel 1: drei gleich breite Knöpfe
  (110 px) in einer Zeile, **N466** Zeilenbeschriftung über den Werten, **N467** Kapitelnummern
  in Navy-Kreisen.
- **N460** überholt: Seit DS20 (0.2.101) haben die Aufklappzeilen einen Pfeil statt ▶.
- **N468** Spielhilfen und „Partie beginnen“ über dem Gitter, **N471** Partienliste mit vier
  Partien: Filter Ergebnis und Wertung, Löschen einer ungewerteten (4 → 3), **N472**
  Warum-Zeichen (Schloss, Sprechblase nach dem Ansehen), Antwort zählt in den Einstellungen
  („Warum-Fragen beantwortet 1“), **N474** 34 Werkzeuge nach Kapiteln, jedes mit Zeichen.
- **N476** kein ▶ mehr (Buch, Spielen, Nachschlagen, Glossar durchsucht), **N477** Zeichen an
  Daten sichern, Sicherung einspielen, Löschen (rot), Zurücknehmen, Aufgeben, Hinweis, Lösung
  zeigen, **N478** goldene Zeichen vor den genannten Überschriften, **N479** Pokal am Partieende
  und „1–0“ in goldener Marke, **N480** Phasenzeichen mit Gürtelmarke in Spielen und
  Denkroutine, **N481** Fortschritt am Kreis der Kapitelnummer, **N482** Werkzeugzeichen,
  Glossar mit Buchstaben und Sprungleiste.

Geblieben (gekürzt): N450, N451 (echtes Gerät), N469, N470 (gewerteter Sieg gegen einen Bot),
N473 (Inhalt gegen das Buch), N475 (Gesamteindruck, enthält das Urteil aus N477).

Befunde dabei: „1 Züge“ in der Partienliste (jetzt „1 Zug“, Schlüssel
`spielen.partiezeileEinZug`). Auffällig, aber Sache des Bot-Chats: Die Elo-Bereiche seit 0.2.103
überlappen bei Stufe 3 (etwa 1700 bis 1850) und Stufe 4 (etwa 1650 bis 1950); Stufe 3 beginnt
höher als Stufe 4.

## Version 1.0 vorbereitet, nicht veröffentlicht (19.10.2026, Opus, Zweig `ap17-vorbereitung`, Version 0.2.108)

Vom Autor abgesegnet (19.10.2026, Punkt d): AP 17 vorbereiten, ohne zu veröffentlichen.

- Abnahmeliste des Pflichtenhefts (Abschnitt 9) und Inhalt von Stufe 1 gegen den Stand geprüft:
  `docs/ABNAHME_1.0.md` (Tabelle, was fehlt, technische Schritte). Technisch ist Stufe 1 erfüllt;
  offen sind vor allem endgültiges Buch und Datenlauf, Gerätetests, Rechtliches, Domain und die
  Sammelfreigabe (Rückfragen V1 bis V6).
- Bauschalter `VEROEFFENTLICHUNG=1` (`npm run build:veroeffentlichung`): Fassung für die Leser
  ohne Aufgabenseite des Autors (langer Druck und `#aufgaben` wirkungslos, Markdown nicht im
  Build) und ohne englische Vorschau (nur `de` in `SPRACHDATEIEN`, Einstellungen zeigen
  „Deutsch (Englisch folgt …)“). `skripte/pruefe-veroeffentlichung.mjs` prüft das, auch in
  GitHub Actions. Die gewöhnliche Fassung (main, Testweg des Autors) bleibt unverändert.
- `python -m pipeline.pruefen.daten --veroeffentlichung …` meldet jeden Eintrag mit Status
  „entwurf“ als Fehler; ohne Schalter bleiben Entwürfe erlaubt (Wunsch des Autors bis AP 17).
- Empfehlung V1 (Englisch in 1.0 ausblenden) ist damit vorbereitet; sie wirkt erst mit dem Bau
  für die Leser.

## Bot-Gruppen ohne Überschneidung (19.10.2026, Opus, Zweig `bot-gruppen`, Version 0.2.109)

Wunsch des Autors: Die Stufen der Gegnerwahl sollen sich möglichst nicht überschneiden (Stufe 3
und 4 taten es), ohne die Bots neu zu messen. Die Gruppe eines Bots war der gerundete
Durchschnitt seiner Stufen je Phase; nach den Zahlen der Elo-Leiter (seit 0.2.103) lagen acht
Bots jenseits der Nachbargruppe. Sie tauschen paarweise die Gruppe (`engine/botgruppe.ts`), jede
Stufe behält acht Bots, ihre Stufen je Phase und damit ihr Spiel bleiben gleich:

- Stufe 3 ↔ 4: Jan (1657) und Lukas (1788) nach 3, Omar (1809) und Selin (1863) nach 4.
- Stufe 6 ↔ 7: Trainer Koch (2417) nach 6, Lena (2458) nach 7.
- Stufe 7 ↔ 8: GM Petrova (2764) nach 7, Doktor Berg (2802) nach 8.

Bereiche danach: 1: 830–1089, 2: 1180–1476, 3: 1657–1788, 4: 1809–1949, 5: 1988–2197,
6: 2223–2433, 7: 2458–2764, 8: 2802–3011. Die Einordnung („Stufe 3 · Fortgeschrittene“ in der
Partie und in der Sprechblase) folgt der Gruppe. Ein Test prüft, dass benachbarte Bereiche sich
nicht überschneiden; ändern sich die Zahlen nach einer neuen Messung, schlägt er an. Die Abstände
an den Grenzen (etwa 20 bis 40 Punkte) liegen innerhalb der Messunsicherheit (±70 bis ±220).

## App-Symbol knackiger (19.10.2026, Opus, Zweig `symbol-knackig`, Version 0.2.110)

Rückmeldung des Autors mit Bildschirmfoto vom Startbildschirm: „Bekommen wir die Farben des Icons
noch etwas knackiger?“ Ursachen: das weich gezeichnete Cover, das Rauschen der Verkleinerung auf
256 Farben und ein halb deckender Rand, durch den die roten Figuren grau-rosa schimmerten.
Verglichen wurden sieben Varianten auf einem dunkelblauen Startbildschirm in 180 und 60 Pixeln.
Mehr Sättigung (1,35 bis 1,45) machte das Gold orange-rot; gewählt: Kontrast 1,2, Sättigung 1,1,
leichte Schärfe (Laplace-Kern 0,6), Rand ab 45 % des Radius fast deckend in Navy (97 %). Die
Symbole mit 180 und 192 Pixeln bleiben in voller Farbtiefe (je etwa 100 KB), nur die beiden 512er
werden auf 256 Farben verkleinert (Android rechnet sie klein). Skript `skripte/erzeuge-appsymbol.mjs`.

## Datenschutz und Impressum ergänzt, Cloudflare Web Analytics aus (19.10.2026, Opus, Zweig `datenschutz-luecken`, Version 0.2.111)

Anlass: Ein Scan der Website mit e-recht24 meldete „Hosting nicht datenschutzkonform“, „Tools,
die nicht in der Datenschutzerklärung stehen“ und zwei Probleme bei den Rechtstexten. Prüfung der
Live-Seite mit einem echten Browser (alle Seiten, Netzwerkverkehr mitgeschnitten):

- **Cloudflare Web Analytics war eingeschaltet:** Cloudflare spielte auf jeder Seite
  `static.cloudflareinsights.com/beacon.min.js` ein, das bei jedem Aufruf Adresse und Ladezeiten
  an `/cdn-cgi/rum` schickte, obwohl die Erklärung „keine Web Analytics“ sagte. Nicht im Code der
  App, sondern eine Einstellung im Dashboard (Real User Measurements). Der Autor hat sie am
  19.10.2026 auf „Disable“ gestellt; eine Minute später lud keine Seite mehr etwas von fremden
  Servern, Cookies gibt es keine. Ein neuer Oberflächentest hält fest, dass die gebaute Seite
  nichts von fremden Adressen lädt (was Cloudflare live einfügt, sieht er nicht).
- **Datenschutzerklärung ergänzt:** Rechtsgrundlage für IndexedDB, lokalen Speicher und Service
  Worker (§ 25 Abs. 2 Nr. 2 TDDDG, unbedingt erforderlich), Teilen der Datensicherung über die
  Teilen-Funktion des Geräts, Vertrag zur Auftragsverarbeitung mit Cloudflare und Übermittlung in
  die USA auf Grund des Angemessenheitsbeschlusses (Art. 45 DSGVO, Data Privacy Framework),
  welche Daten Cloudflare beim Aufruf verarbeitet und was wir davon sehen, die Fehlerberichte des
  Browsers an Cloudflare (Network Error Logging, eine Kopfzeile, die Cloudflare selbst setzt),
  „keine eingebundenen Inhalte anderer Anbieter“, Links zu anderen Seiten, Rechtsgrundlagen bei
  E-Mails, ausdrückliches Widerspruchsrecht (Art. 21), Beschwerderecht mit Anschrift der
  Landesbeauftragten Niedersachsen (Art. 77), keine automatisierte Entscheidung, Stand.
- **Impressum ergänzt:** Verbraucherstreitbeilegung (§ 36 VSBG: nicht verpflichtet und nicht
  bereit) und Haftung für Links. Der Hinweis auf die EU-Plattform zur Online-Streitbeilegung
  entfällt, die Plattform ist abgeschaltet.
- **Bleibt:** „Hosting“ wird in solchen Scans wegen des US-Anbieters wohl rot bleiben; ein Wechsel
  zu einem EU-Hoster wäre ein größerer Umbau und ist nicht nötig, solange das Data Privacy
  Framework gilt. Der Autor will die Texte später mit dem Generator von e-recht24 (anwaltlich
  geprüft) ersetzen; die Angaben für den Generator: Hosting Cloudflare Workers nur mit statischen
  Dateien, E-Mail-Weiterleitung über Cloudflare an goneo, keine Cookies, kein Analysewerkzeug,
  kein Kontaktformular, kein Newsletter, keine Anmeldung, keine Zahlungen, keine Werbung, keine
  eingebundenen Inhalte Dritter, Gerätespeicher und Service Worker, nur Links zu Lichess, GitHub
  und Buchhändlern.

## Ohne Autor, Teil 1: Hinweise je Gerät, Abnahmetest A1, Sitemap, Kopfzeilen (19.10.2026, Opus, Zweig `weiter-ohne-autor`, Version 0.2.112)

Vom Autor abgesegnet (19.10.2026, „Alle anderen Punkte auch ja“):

- **Zu alte Geräte:** Vite baut für Safari 16.4 und Chrome 111. Auf älteren Geräten (etwa iPhone
  7 mit iOS 15) blieb die App leer. Jetzt prüft ein kleines Skript in `app/index.html` vor dem
  Start die Mindestausstattung (Rückschau in regulären Ausdrücken, `:has()`, `structuredClone`,
  `findLast`) und zeigt sonst „Dieses Gerät ist zu alt für die App“ mit Anleitung; hat die App
  nach 25 Sekunden nichts gezeichnet, steht „Die App startet nicht“ mit „Neu laden“.
  `main.tsx` entfernt den Kasten, sobald die App steht. Dieselbe Warnung erscheint im
  Installationsteil (Startseite und /installieren/), bevor jemand installiert. Test
  `geraete.spec.ts` (alter Browser nachgestellt).
- **Sieben-Tage-Regel von Safari:** Safari (iPhone, iPad, Mac) darf den Speicher einer Website
  löschen, die sieben Tage nicht besucht wurde; installierte Apps sind ausgenommen. In Safari im
  Browser erscheint deshalb einmal oben ein Hinweis mit „So installierst du die App“ und
  „Verstanden“ (Merker `safariHinweis`), dauerhaft ein Satz in der Datensicherung
  (`app/safarihinweis.ts`, `SafariHinweis.tsx`). In den Oberflächentests ist der Hinweis
  vorab geschlossen (`starteImBrowser`), außer in `geraete.spec.ts`. Testpunkt N410.
- **Abnahme A1:** `daten/finde.test.ts` öffnet jede der 765 Nummern des Verzeichnisses (auch als
  „Abb. 1,26“) und prüft das Kapitel. Abb. 0.2 (Foto) steht nicht im Verzeichnis; offen in V6.
- **Website:** `robots.txt` und `sitemap.xml` (Startseite, Installation, Training mit allen
  13 Kapitelseiten und Werkzeugkasten, Impressum, Datenschutz), Test `sitemap.test.ts`.
  Kopfzeilen für alle Seiten in `_headers`: `X-Content-Type-Options: nosniff`,
  `X-Frame-Options: SAMEORIGIN`, `Referrer-Policy: strict-origin-when-cross-origin`,
  `Permissions-Policy` ohne Kamera, Mikrofon, Standort, Zahlung, USB. Eine Content Security
  Policy bewusst nicht: Sie könnte Engine (WebAssembly) oder Worker still lahmlegen, ohne dass es
  ein Test merkt.
- **Regel 4:** `Spielen.tsx` war 402 Zeilen lang; `gegnerprofil` steht jetzt in
  `ui/bildschirme/gegnerprofil.ts`.
- **CLAUDE.md** (Ja des Autors, 19.10.2026): Der Widerspruch zu den Testadressen von Cloudflare
  ist aufgelöst (Vorschau-Builds eingestellt, Funktion prüft der Autor in V2).

## Ohne Autor, Teil 2: Lektorat, Einzahl und Mehrzahl, Lizenzseite, Vorprüfung 0.2.90 bis 0.2.110 (19.10.2026, Opus, Zweig `weiter-ohne-autor`, Version 0.2.113)

Vom Autor abgesegnet (19.10.2026, „Alle anderen Punkte auch ja“; Texte nach Regel 9):

- **Einzahl und Mehrzahl:** `tZahl()` in `i18n/sprache.ts` nimmt bei der Zahl 1 den Schlüssel mit
  „Eins“, bei 0 den mit „Null“, sonst den Grundschlüssel („Noch 1 Sekunde nachdenken“ statt
  „1 Sekunden“, „kein sicheres Feld“ statt „0 sichere Felder“). Umgestellt sind 38 Stellen in
  Werkzeugen, Trainern, Auswertung und Fortschritt. Sätze mit mehreren Zahlen stehen als Liste
  („Schwache Bauern: Weiß 1, Schwarz 0“, „Weiß hat 8 Kandidaten (Schachs: 2, Schläge: 1,
  Drohungen: 5)“).
- **Lektorat** aller Texte in `de.json` (Rechtschreibung, Grammatik, Fachbegriffe wie im Buch),
  englische Fassung jeweils angeglichen; „Bauerneinheiten“ einheitlich, „Grundreihe: weder Turm
  noch Dame“, „Der König hat … noch nicht rochiert“, Großschreibung nach Doppelpunkt bei ganzem
  Satz. Englisch: kein Leerzeichen vor „%“.
- **Fehler N402** (Vorprüfung): Im Rückblick stand „Du übersieht die Gabel“, weil die
  Erklärungen in der dritten Person stehen. Jetzt „Dein Zug übersieht …“ bzw. „Der Zug der
  Engine …“ (`rueckblick.seite.*`).
- **Erklärung der Wertung** stimmte seit 0.2.105 nicht mehr: Nicht jede Partie braucht zehn
  eigene Züge, nur die erste gewertete (für die Schätzung der Spielstärke). Text in de und en
  angepasst; der Code (`spiel/wertung.ts`) bleibt.
- **Lizenzseite:** Quellcode der App als Link (GPL), Stockfish mit Fassung 19.0.1, Variante
  lite-single, Netz nn-61e7af4bb97d und Quellcode-Adresse; Vite schreibt beim Build die
  Lizenztexte aller eingebauten npm-Pakete nach `/lizenzen/bausteine.txt` (`build.license`),
  verlinkt bei chessops, React, Workbox, Lucide und neu idb und @badrap/result (MIT und ISC
  verlangen den Text). OFL-Texte mit der Copyright-Zeile von Adobe statt „Google Inc.“,
  Chessnut-Copyright im Apache-Text (eigene Datei entfällt), Umwandlungsdatum der
  Materialbretter. `docs/LIZENZEN.md` nachgezogen; Oberflächentest prüft Link und Datei.
- **Vorprüfung der Testliste** (0.2.90 bis 0.2.110, gebaute App, Partien mit Stockfish unter
  Node): 26 Punkte stimmten und sind gestrichen (N400, N401, N404 bis N408, N484 bis N489,
  N500, N502, N551 bis N556, N558 bis N560, N584, N585; N489 durch N490 überholt), N402 behoben,
  zehn gekürzt auf das Urteil des Autors. Beobachtungen ohne Handlungsbedarf: Zu N401 passen
  die Beispiele (Abb. 1.26 hat kein Zeichen, Abb. 4.21 ist eine Mattfalle), das Verhalten
  stimmt; N326 nennt Zahlen von vor der Neueichung (gekennzeichnet).
- **Buchbefund B7:** lichess.org/insights gibt es nicht (404); die Einblicke liegen unter
  /insights/NAME. Der Link der Trainingsseite bleibt wie im Buch, bis der Autor entscheidet.

## Buchbefunde nachgeprüft, Links in Kapitel 12 (19.10.2026, Opus, Version 0.2.114)

Auf Wunsch des Autors („zu allen Stellen des Buches eine Änderungsformulierung, teste die Links
in Kapitel 12“):

- **B6 neu bewertet:** Das Buch zählt die Zeit in drei Faktorenbilanzen auch unter null
  (Abb. 3.14, 3.47, 3.65), genau wie die App. Neue Empfehlung: nur den Fließtext angleichen
  statt „nie unter null“; die Formulierungen bekam der Autor im Chat.
- **Links in Kapitel 12:** 17 Lichess-Adressen und zehn andere Seiten aufgerufen. Fehlerhaft
  nur `lichess.org/insights` (404, B7); `/training/dashboard` braucht ein Konto. Menüwege und
  Bezeichnungen der Tabelle „Lichess-Funktionen“ gegen die deutsche Lichess-Oberfläche und
  ihre Übersetzungsdateien geprüft: alle richtig. Neuer Befund **B8**: schachtraining.de hat
  keine „Taktikaufgaben in drei Stufen“ (Blog, Tagesaufgabe endet Januar 2023).
- **ZF4:** Abb. 8.25 und 8.26 sind laut Tablebase remis, gleich wer am Zug ist.

## Buchbefunde ins Buch übernommen (19.10.2026, Opus, Version 0.2.115)

Der Autor hat B6, B7, B8, ZF4 und D2 freigegeben („bau die Änderungen ein und schieb es ins
Repo“). Claude hat sie im privaten Buch-Repository auf dem Zweig `claude/funny-bardeen-e7wpzs`
eingetragen (der Autor übernimmt sie nach `main`) und die App-Daten daraus neu gebaut:

- **B6:** Fließtext und Zählhilfe in Kapitel 3 sagen jetzt ausdrücklich, dass bei Gleichstand
  und Schwarz am Zug Schwarz eine Figur vorn liegt. Bilanzen und App unverändert.
- **B7, B8 und Adressen in Kapitel 12:** `/insights/dein-Name` (Schach-Einblicke, auch über das
  Profil), `/training/dashboard` „mit Konto“, schach-tipps.de mit Mattaufgaben in einem, zwei und
  drei Zügen, schachtraining.de als Artikelsammlung. Dieselben Änderungen in
  `inhalte/de/training/werkzeugkasten.json` (die Trainingsseiten sind seit dem Verweis im Buch
  die gepflegte Quelle; ein neuer Pipelinelauf schreibt sie nicht mehr).
- **ZF4:** Unterschriften von Abb. 8.25 und 8.26 nennen das Remis (Tablebase, gleich wer am
  Zug ist); in `kap08.json` übernommen.
- **D2:** Steckbriefe Lasker–Thomas („Eröffnung bis Mattangriff“) und Fischer–Petrosjan
  („Eröffnung bis Endspiel“) folgen dem Glossar; die App rechnete schon so.
- **D1 erledigt:** Die angekündigte Änderung zu Abb. 4.45 (Befund D.3, Fesselung in Zeile F3 der
  Fallenprüfung) steht im Buch und in der App; Buch und App widersprechen sich dort nicht.

## Rückmeldung des Autors zu allen Punkten bis 0.2.115 (19.10.2026 abends, Version 0.2.116)

Abgehakt („ok“, gilt als erledigt oder bleibt so): N410, N490, N483, N409, N580 bis N583, N180,
N475, N469, N470, N473, N450, N451, N550, N403, N347, N334, N335, N328, N326, N327, N295, N289,
N285 bis N287, N294, N264, N262, N255, N250, N230, N193; NA1, EN1, EN3, V3, V4, ZF1 bis ZF3, S21,
S22, F1, F3 bis F5, X5, T1 bis T5, C1, C2, C4 bis C9, K1 bis K5, S24, S20.

Mit Notiz (umgesetzt oder in der Arbeitsliste R1 bis R26, `docs/FORTSCHRITT.md`):

- **N501:** „KI“ statt „Claude“ im Hinweis zu konstruierten Zugfolgen (0.2.116).
- **N194:** Schritt 3 des Röntgen-Trainers ist unklar formuliert (R3).
- **NA1:** Nach der Einschätzung soll die richtige Antwort der Engine stehen; richtig
  eingeschätzte Stellungen merkt sich die App (R18).
- **EN2:** Die 27 Buchzitate selbst ins Englische übersetzen, nach gängigen Fassungen (R13).
- **V1:** Englisch bleibt in 1.0 eingeblendet; der Rest wird vorher übersetzt (R13, R25).
- **V2:** Die App ist fertig, bevor das Buch erscheint; der Autor testet weiter auf `main`
  (CLAUDE.md, Arbeitsablauf Punkt 2, angepasst mit seiner Erlaubnis).
- **V5:** Alle „vorerst abgesegneten“ Texte sind freigegeben. Entwurfs-Kennzeichen gibt es in den
  App-Daten keine mehr (geprüft).
- **F2:** Eingabe im Denkroutine-Trainer am Brett statt als Text (R19).
- **S24 ok:** Namen der Stufen nach den heutigen Zahlen (R8).
- **S20 ok:** Wertung zurücksetzen macht der Autor in der App selbst, falls gewünscht.

Dazu neue Wünsche (R7, R9 bis R12, R14 bis R17, R20 bis R24) und der Auftrag, alles selbst zu
machen, auch in Dateien des Bot-Chats; offene Fragen nach Claudes Empfehlung und am Ende als
Rückfrage in AUFGABEN_AUTOR.

## EN2 und V1 umgesetzt (19.10.2026, Opus, Version 0.2.116)

- **EN2:** Die 27 Buchzitate sind nach gängigen englischen Fassungen übersetzt und stehen in
  `en.json` (`en.buchzitate.json` ist leer): King to the short side · Same-colored bishops: the
  passed pawn decides · Recognition patterns of the endgame deep dive · Play where your pawn
  chain points · What does my opponent want? · Which piece do I bring there? · Rule of thumb: if
  the number of squares between the kings is odd, the player who has just moved has the
  opposition. · Which piece? · The plan in one sentence · Where do I play? · Rule 1: Activate your
  king · Rule 2: Use opposition and zugzwang · Rule 3: Be patient · Rule 4: Trade wisely · Rule 5:
  Defend actively · Rule 6: Calculate through to promotion · The six golden endgame rules · When
  is the calculation finished? · 1. Is my king safe afterwards? · 2. Can my opponent capture the
  moved piece right away? · 3. Do I allow a check or even mate? · Safety check before you move ·
  A handbook for beginners and improving players · At the end of every line, check for
  stalemate. · From warning sign to motif · Kings on opposite wings: who opens first?
- **V1:** Englisch bleibt in der Fassung für die Leser (`SPRACHDATEIEN = { de, en }` immer;
  `pruefe-veroeffentlichung.mjs` sucht nur noch die Aufgabenseite). „(preview)“ bleibt, bis die
  Buchdaten übersetzt sind (R25).

## Menschliche Bots und Uhr (20. und 21.10.2026, Opus, Zweig `menschliche-bots`)

Plan vom Autor am 20.10.2026 freigegeben („du darfst deinen kompletten Plan umsetzen“; offene
Fragen mit eigener Empfehlung entscheiden). Ergänzungen des Autors: sichtbare Wartezeit mit
Streuung (20.10.), Notmodus mit Vorzügen und Bedenkzeiten 3 + 2 und 3 + 0 (21.10.), keine
Abstriche an der Qualität zugunsten geringerer Kosten (21.10.).

- **Datengrundlage:** offene Lichess-Datenbank (CC0), Monat 2026-09: 1542 gewertete Partien mit
  Uhrzeiten (Blitz, Rapid, Klassisch), 111 752 Stellungen, je Stellung sechs Kandidaten in Tiefe
  12 mit Stockfish 17.1 und die typischen Fehlerzüge nach den Werkzeugen des Buches. Rohdaten nur
  lokal; in die App kommen nur die Tabellen (`app/src/engine/menschenprofil-daten.ts`).
- **Zugwahl (Stufen 1 bis 7 = Menschen mit 600 bis 2400 auf Lichess):** Fehlerschicht je
  Fehlerart (Gelegenheit, Wahrscheinlichkeit der Menschen, Verlustfaktor, Zug in der Art mit
  Gewicht Verlust^(−beta)), blinde Flecken, Grundschicht mit Potenzkern nur unter Zügen ohne
  Fehlerart; Stufe 8 ist die volle Engine. Alle Zahlen sind an den Lichess-Zügen geeicht
  (`pipeline/menschenprofil/eichen.py`). Nachgespielt trifft der Bot je Band die Anteile der
  Menschen an besten Zügen und an Verlusten ab 0,5, 1 und 3 Bauern auf etwa zwei Prozentpunkte.
  Verworfen: Fehlerzug mit dem typischen Verlust der Art und Deckel beim 90-%-Wert (schwache Bots
  patzten nur halb so oft grob wie Menschen, starke doppelt so oft); Wahl unter allen Kandidaten
  (Fehler zählten doppelt, abgewählte Fehlerarten kamen doch vor).
- **Bots:** 64 neue Bots (acht je Stufe) und vier Spaß-Bots, Porträts der alten, neue Namen;
  Persönlichkeit als Gewichte je Fehlerart und blindem Fleck, Fehlerhäufigkeit, Stil. Spaß-Bots
  bleiben (GE1, „So lassen“).
- **Erweiterter Modus eigener Bots:** Fehlerhäufigkeit insgesamt, Gewicht je Fehlerart und
  Fleck, Höchstverlust je Art (Vorgabe „unbegrenzt“, wie Menschen).
- **Bedenkzeit:** Ein Bot mit Uhr verbraucht die Zeit, die ein Mensch seiner Stärke gebraucht
  hätte (Anteil der Restzeit nach Zugnummer und Lage, unter 60 Sekunden feste kurze Zeiten);
  sichtbar wartet er höchstens etwa 2,5 Sekunden (in Zeitnot 0,6), mit ±10 % Streuung. In
  Zeitnot macht er mehr Fehler (Faktoren aus den Daten). Die Uhr des Bots läuft nicht in echter
  Zeit ab; die Rechenzeit des Geräts zählt nicht.
- **Notmodus (Idee des Autors):** Reicht die Bedenkzeit nicht, steht die Uhr des Bots nach dem
  Zug auf einer Sekunde. Er sagt die drei wahrscheinlichsten Antworten voraus (Tiefe 8), legt für
  jede eine Erwiderung mit seiner Zugwahl in Zeitnot zurecht und spielt dann unter den Vorzügen,
  die gehen, den mit der besten Bewertung (je eine Zehntelsekunde, wie bei chess.com). Geht
  keiner, ist die Zeit um. Mit Zuschlag verlässt er den Modus über fünf Sekunden. Nach einem
  Neuladen ist der Plan weg; der Bot kommt dann bei Bedarf erneut hinein.
- **Bedenkzeiten im Menü:** zusätzlich 3 + 2 und 3 + 0.
- **Stärkezahlen:** aus einer eigenen Messung (Leiter benachbarter Stufen, Anker, je Bot zwölf
  Partien gegen die Nachbarstufe, je Stufe mit Uhr gegen ohne für sechs Bedenkzeiten). Erste
  Leiter: Die Stufen liegen enger als die Wertungen der Menschen (Stufe 1 bis 7 etwa 870 Elo statt
  1800); angezeigt werden die gemessenen Zahlen.

### Zehn Stufen statt acht (21. und 22.10.2026, Opus, Vorschlag und Freigabe des Autors)

- **Warum:** Menschliche Fehlerraten allein trennten die Stufen nicht (gemessen: Stufe 5 bis 7 fast
  gleich stark, Stufe 1 bis 7 nur etwa 650 Elo). Vorschlag des Autors: Regler von 1 bis 10, die
  ohne Zusatzfehler 300 bis 3000 Elo abdecken; die Zusatzfehler machen Bots menschlicher.
- **Grundschicht:** Die Engine bewertet in den unteren Stufen alle legalen Züge in kleiner Tiefe und
  wählt mit dem Kern (1 + Verlust/tau)^(−1). Geeicht über eine Leiter freier Grundschichten,
  verankert an Partien gegen sich selbst (Tiefe 18). Einstellungen (Tiefe/tau): 1/100, 1/4,5,
  2/0,7, 4/0,2, 7/0,1, 8/0,3, 8/0,07, 11/0,03, 14/0,01, Stufe 10 volle Engine. Gemessen (vorläufig)
  etwa 270, 440, 730, 1050, 1350, 1740, 2170, 2450, 2740, 3000. Stufe 1 ist fast zufällig;
  schwächer geht es nicht, 300 ist daher nur ungefähr erreicht. Die App zeigt die gemessenen Zahlen.
- **Zusatzfehler:** Nur Bots; Raten der Menschen mit der Ziel-Elo der Stufe. Abzug gemessen
  („nm-n“): unten fast keiner, oben viel (Stufe 7 etwa −380, Stufe 10 über −500). Ohne Bot spielt
  die Stufe rein (abgehakte blinde Flecken der eigenen Stufe kommen dazu); die Abhakliste der
  Fehlerarten gilt den vorgefertigten Bots. Eigene Gegner: Haken = an; die geschätzte Zahl zieht den
  gemessenen Abzug anteilig ab.
- **Bots:** 64 Bots auf Zielgruppen 1 bis 10 verteilt, Grundstufe so, dass die gemessene Zahl dort
  landet; die stärksten machen die Fehler der Menschen seltener (Faktor 0,5 und 0,1). Die Gruppe
  folgt der gemessenen Zahl (300 je Gruppe). Spaß-Bots spielen Stufe 3 bis 6 mit Zufallszügen.
- **Speicher:** Format 6; alte Stufen werden die neue Stufe mit der nächsten Elo-Zahl (1 → 3, 2 → 4,
  3 und 4 → 6, 5 → 7, 6 → 8, 7 → 9, 8 → 10). Eine ältere App lehnt Format 6 ab.
- **Entfernt:** Strähne und Lagefaktoren der alten Zugwahl (zählten doppelt), der Wahlkern der
  Menschen für die Grundschicht (ersetzt durch die geeichte Grundschicht der Stufe).

## Eigenes Elo-System statt Schalter chess.com/Lichess (23.10.2026, Wunsch des Autors)

- Der Schalter „Genauigkeit wie Lichess / Mittelweg / chess.com“ und die Doppelanzeige
  (chess.com ≈ … · Lichess ≈ …) entfallen. Die App schätzt eine eigene Elo-Zahl, geeicht an den
  Lichess-Wertungen der gesammelten Spieler (Glicko-2, aktive Spieler mit eingeschwungener Zahl).
- **Eine Zahl je Zeitklasse** (Entscheidung des Autors): Blitz, Schnellschach und klassisch je
  eigenes Modell und eigene Skala (wie Lichess), keine Umrechnung auf eine gemeinsame Zahl.
- Schätzung aus mehreren Kennzahlen (Zugqualität, Schwierigkeit, Phasen, Fehlerarten, blinde
  Flecken, Zeit, Eröffnung), Prüfung an zurückgelegten Spielern; welche Kennzahlen bleiben,
  entscheidet der Zugewinn an Treffsicherheit (Stufenvergleich). Ausgabe mit 90-%-Bereich.
- Elo je Phase bleibt, als eigenes Teilmodell je Phase mit eigenem Bereich; angezeigt nur, wenn
  der Bereich schmal genug ist. Umsetzung nach der Auswertung der Spielerprofile.

## Fehlerarten geschärft und ergänzt (22. und 23.10.2026, Plan „Bots, zweite Runde“, Teil A)

- **Neue Arten** aus 2600 und 6147 Lichess-Partien (ein Drittel der Fehler passte vorher in keine
  Art): Bauer eingestellt, Schlag verpasst, Bauernzug ohne Not, Königszug ohne Not; „Figur
  hängen“ auch, wenn erst die Widerlegung der Engine die Figur mit Gewinn schlägt.
- **Taktik übersehen** nur, wenn die Widerlegung das Motiv spielt und Material gewinnt (Fehlalarme
  des Autors 9… Df6 „Gabel Sd5“, 4. c4 „Gabel e5“).
- **Schlagreflex** (Festlegung mit dem Autor, Glossar „scheinbar ungedeckte Figur“): Der Schlag
  sieht nach Gewinn aus, die Bestrafung folgt erzwungen in höchstens vier Halbzügen. Ein Schlag,
  der schon laut Abtausch verliert, ist „Figur hängen“; ein gleichwertiger Abtausch nie.
- **Falscher Abtausch** nicht beim Zurückschlagen. **König passiv** nach Kapitel 8, Regel 1 mit
  dem Königsweg des Endspielwerkzeugs.
- **Blinde Flecken:** Rochade ist kein Schlag, en passant schon (zwei Fehler der Regeln behoben).
  Der eigene Fleck zählt in Auswertungen nur bei klar bestem Zug (Abstand zum zweitbesten ≥ 0,3).
- **Prüfung** in Tiefe 20 (6885 Züge): bestätigt meist 89–97 %, schwächer König passiv,
  Bauernvorstoß, ungenau (Bewertungsrauschen der Tiefe 12); Zahlen in docs/FORTSCHRITT.md.

## Spielstile der Bots (23.10.2026, Plan „Bots, zweite Runde“, Teil D)

- **Recherche:** Keine begutachtete Studie trennt die üblichen Stile messbar; verbreitet sind vier
  Grundtypen nach Expertenmeinung (angreifend/taktisch, positionell, solide/defensiv,
  kreativ). Messbare Ersatzgrößen: Anteil erzwingender Züge, angegriffene Felder. Einzelne
  Spieler lassen sich an ihrem Stil sicher wiedererkennen (NeurIPS 2021, 98 % bei 100 Partien).
- **Daten:** 3889 Spieler (Spielerprofile, Lichess 2026-09), zehn Merkmale je Zug, je Kategorie um
  die Wertung bereinigt. Drei Achsen (Hauptkomponenten, zusammen 66 %): **Königsangriff**
  (Schach, Königsnähe, Opfer, scharfe Wahl gegen Spannung halten), **Aktivität** (Schläge,
  Abtausch, Vorwärts gegen Rückzug), **Bauernsturm gegen Vereinfachen**.
- **Ab welcher Spielstärke:** Schon ab 400 unterscheidbar. Zuverlässigkeit der Achsen über die
  Partien eines Spielers (Hälften, Spearman-Brown) in Blitz und Schnellschach bis 2000 meist
  0,5 bis 0,77. Ab 2200 in Schnellschach nur noch die Aktivität sicher (0,6 bis 0,7);
  Königsangriff und Bauernsturm fallen auf 0,2 bis 0,3. Klassisch niedriger (12 Partien).
- **Stile** (Achse ab einer Standardabweichung, sonst universell; je Kategorie etwa 10 % je Stil
  und 30 bis 40 % universell): Angreifer (Angriff +), Positionsspieler (Angriff −, Spannung),
  Taktiker (Aktivität +), Verteidiger (Aktivität −), Draufgänger (Bauernsturm und Opfer),
  Vereinfacher (Abtausch), Universell.
- **Je Bot genau ein Stil**, abgeleitet aus seiner Persönlichkeit (Umsetzung in der Zugwahl mit
  Teil E; der bisherige Regler −2 bis +2 geht darin auf). Über 2200 wirken Angreifer,
  Draufgänger und Positionsspieler in Schnellschach nach den Daten schwächer; sie bleiben, die
  Stärke des Stils folgt der gemessenen Streuung der Menschen.

| Bot              | Persönlichkeit  | Stilregler bisher | Stil neu         |
| ---------------- | --------------- | ----------------- | ---------------- |
| Kiki             | hektiker        | 1                 | Taktiker         |
| Onkel Otto       | materialist     | 0                 | Taktiker         |
| Tante Hilde      | vorsichtig      | -1                | Verteidiger      |
| Bodo             | angreifer       | 2                 | Angreifer        |
| Ella             | solide          | 0                 | Universell       |
| Marie            | vorsichtig      | -1                | Verteidiger      |
| Tom              | damenfan        | 2                 | Draufgänger      |
| Luis             | materialist     | 1                 | Taktiker         |
| Oma Erna         | endspieler      | -2                | Vereinfacher     |
| Henry            | angreifer       | 2                 | Angreifer        |
| Lina             | traeumer        | 0                 | Draufgänger      |
| Moritz           | hektiker        | 1                 | Taktiker         |
| Opa Heinz        | endspieler      | -1                | Vereinfacher     |
| Onkel Bernd      | materialist     | 0                 | Taktiker         |
| Clara            | solide          | 0                 | Universell       |
| Herr Krause      | theoretiker     | -1                | Positionsspieler |
| Leyla            | taktiker        | 1                 | Taktiker         |
| Jakob            | hektiker        | 2                 | Taktiker         |
| Johanna          | koenigswanderer | 1                 | Draufgänger      |
| Rolf             | vorsichtig      | -2                | Verteidiger      |
| Derya            | angreifer       | 2                 | Angreifer        |
| Svenja           | solide          | 0                 | Universell       |
| Felix            | endspieler      | -1                | Vereinfacher     |
| Marco            | theoretiker     | 0                 | Positionsspieler |
| Ronja            | traeumer        | 1                 | Draufgänger      |
| Herr Wolff       | stratege        | -2                | Positionsspieler |
| Pia              | damenfan        | 1                 | Draufgänger      |
| Yusuf            | taktiker        | 1                 | Taktiker         |
| Holger           | solide          | 0                 | Universell       |
| Dennis           | angreifer       | 2                 | Angreifer        |
| Frau Albrecht    | vorsichtig      | -2                | Verteidiger      |
| Philipp          | hektiker        | 1                 | Taktiker         |
| Mara             | taktiker        | 1                 | Taktiker         |
| Herr Kühn        | stratege        | -1                | Positionsspieler |
| Samira           | traeumer        | 0                 | Draufgänger      |
| Erik             | materialist     | 0                 | Taktiker         |
| Günter           | endspieler      | -1                | Vereinfacher     |
| Frau Romero      | solide          | 0                 | Universell       |
| Lars             | angreifer       | 2                 | Angreifer        |
| Katrin           | theoretiker     | 0                 | Positionsspieler |
| Herr Vogel       | stratege        | -2                | Positionsspieler |
| Nele             | taktiker        | 1                 | Taktiker         |
| Simon            | hektiker        | 1                 | Taktiker         |
| Frau Demir       | vorsichtig      | -1                | Verteidiger      |
| Jana             | solide          | 0                 | Universell       |
| Igor             | theoretiker     | -1                | Positionsspieler |
| Miriam           | traeumer        | 1                 | Draufgänger      |
| Herr Hartmann    | endspieler      | -2                | Vereinfacher     |
| Defne            | taktiker        | 2                 | Taktiker         |
| Luca             | angreifer       | 2                 | Angreifer        |
| Frau Sommer      | stratege        | -1                | Positionsspieler |
| David            | materialist     | 0                 | Taktiker         |
| Doktor Falk      | stratege        | -1                | Positionsspieler |
| Trainer Maier    | solide          | 0                 | Universell       |
| Amaya            | theoretiker     | 1                 | Positionsspieler |
| Herr Lorenz      | endspieler      | -2                | Vereinfacher     |
| Elias            | angreifer       | 2                 | Angreifer        |
| Frau Wagner      | vorsichtig      | -1                | Verteidiger      |
| Arjun            | taktiker        | 2                 | Taktiker         |
| Frau Prof. Reich | traeumer        | 0                 | Draufgänger      |
| GM Novak         | solide          | 0                 | Universell       |
| IM Becker        | stratege        | -1                | Positionsspieler |
| WGM Tanaka       | taktiker        | 1                 | Taktiker         |
| FM Duarte        | angreifer       | 0                 | Angreifer        |
| GM Ivanova       | endspieler      | 0                 | Vereinfacher     |
| IM Kraft         | theoretiker     | 0                 | Positionsspieler |
| WIM Okafor       | vorsichtig      | 0                 | Verteidiger      |
| GM Berglund      | solide          | 0                 | Universell       |

## Zugwahl der Bots, Plan (23.10.2026 abends, Freigabe des Autors)

- **Phasenregler Variante A:** Der Regler je Phase setzt die Ziel-Elo der Phase; daraus folgen die
  Fehlerraten der Phase. Fehlerart- und Fleckregler verschieben nur die Zusammensetzung (feste
  Stärke); im erweiterten Modus auch frei (Stärke wandert, Schätzung wird angezeigt).
- **Oberfläche:** Stil als Spinnennetz über die drei Achsen (sechs Speichen) mit Anzeige des
  nächsten Stils, dazu Auswahlliste; je Fehlerart und Fleck ein Regler auf den Quantilen der
  Menschen (5, 25, 50, 75, 95 %) plus je zwei Stufen darunter und darüber („unmenschlich“);
  Menschlichkeitsanzeige für die Kombination; geschätzte Elo aus den Einstellungen.
- **Zugwahl:** Wahrscheinlichkeit je Kandidat = Grundgewicht × Faktor Fehlerart × Faktor Flecken
  × Faktor Stil; Faktoren an den echten Stellungen der Spielerprofile geeicht (nachspielen, bis
  Raten, Flecken und Kopplungen die Ziele treffen); Tagesform je Partie, Zeitnot nach den Daten;
  kein Nachregeln während der Partie.
- **Bots je Kategorie:** jeder Stil einmal plus ein zweiter universeller, wechselnde Flecken,
  leicht gespreizte Phasen; echte Vorbilder und gezogene Profile gemischt; mehr Bots, wenn nötig.
- **Maia:** Versuch in Teil E (Maia-2 steht unter MIT; Maia-3 prüfen), Bedingung: Rechnen nicht
  spürbar länger als die künstliche Bedenkzeit.
- **Eröffnungen je Elo-Band** aus den Lichess-Partien: Bots wählen bevorzugt, was Menschen ihrer
  Stärke spielen; die Einschränkung „Eröffnung“ für Bots bekommt diese Varianten; im Trainer nur
  als eigener, gekennzeichneter Bereich „Aus der Praxis“ (das Buch bleibt die einzige Quelle für
  die Lehrinhalte).
- **Modelle:** Teil E und das Elo-Modell mit Fable (hoch), Auswertungen, Oberfläche und Teil F mit
  Opus (mittel).

## P3 Werkzeuge und Strukturbegriffe (23.10.2026, Fable, Zweig `p3-werkzeuge`)

Festlegungen des Autors (Arbeitsplan vom 23.10.2026), in der App umgesetzt; die Abweichungen
des Buches davon stehen als Vorschläge B9 bis B14 in AUFGABEN_AUTOR:

- **Rückständiger Bauer:** hinter den benachbarten eigenen Bauern zurückgeblieben, von keinem
  eigenen Bauern mehr zu decken (Deckungstest), am Vorrücken gehindert (ein gegnerischer Bauer
  kontrolliert das Feld davor), Ziel auf der halboffenen Linie (kein gegnerischer Bauer vor ihm
  auf seiner Linie). Bis dahin reichten Nachbarn vorn und Deckungstest; ein Bauer, der noch
  aufrücken kann, bekommt jetzt nur U. Folge für Leitfrage 4: Er zählt nicht mehr als
  festgelegter Bauer, fünf Läuferurteile ändern sich (Abb. 5.7 c8 nicht mehr schlecht, 11.77 c2
  schlecht).
- **Bauernloch:** Feld, meist 3. bis 5. Reihe aus eigener Sicht, das nie wieder ein eigener Bauer
  kontrollieren kann; Nistplatz für gegnerische Figuren. **Schwaches Feld** ist der Oberbegriff
  (jedes dauerhaft von eigenen Bauern nicht mehr deckbare Feld). **Starkes Feld:** gegnerische
  Hälfte, 4. bis 6. Reihe aus eigener Sicht (bisher 5. und 6. im Bauernprofil; das Werkzeug
  Felder rechnete schon ab der 4.), vom Gegner nicht mehr mit Bauern angreifbar. **Vorposten:**
  starkes Feld, zusätzlich von einem eigenen Bauern gedeckt, mit eigener Figur (ideal Springer)
  besetzt oder dafür vorgesehen (`besetztVon`, `erreichbar`).
- **Sicht (R41):** Die Legende nennt die Farben der gewählten Sicht. Werkzeuge erklären nur die
  gewählte Seite; Ausnahmen mit Begründung in der Regel: Schach-Röntgen (die Regel des Buches
  fragt beide Seiten), Warnsignale und Erfassen (Kapitel 12, Schritt 1: beide Seiten), Zielbilanz
  und Faktorenbilanz (Vergleichstabellen). Bei den Bauern bleiben die Schwächen des Gegners als
  „Ziele“, weil die Buchtabelle zu jeder Schwäche den Plan dagegen nennt.
- **Karten (R42):** Befunde einspaltig auf dem Handy, zweispaltig ab 760 px hoch und 1340 px
  quer. Doppelte Inhalte zwischen Reitern: nur die Phase in „Erfassen“ war doppelt; Figuren
  (Springerfelder, Turmlinien), Planbilanz (Zusammenfassung) und Endspielregeln bleiben, weil
  das Buch sie an der Stelle so wiederholt.
- **Kandidaten (R43):** Ruhige Kandidaten (Buchzug, Mattabwehr) ohne Materialstand; die Engine
  bewertet alle Kandidaten gegen die Stellung jetzt („hält“ bis 0,3 Bauern, sonst verbessert oder
  verschlechtert um den Betrag, Matt geht vor). Der Materialvergleich in Schritt 4 läuft weiter
  über alle Kandidaten (Abb. 12.4: Sf6 bleibt der beste); liegt ein ruhiger vorn, verweist der
  Satz auf die Engine. Versuch, ruhige Kandidaten aus dem Materialvergleich zu nehmen, verworfen:
  Dann gewann Dd1+ (−9) in Abb. 12.4.

## R21: Musterlösungen der Trainer gegen die Engine (19.10.2026, Opus)

Wunsch des Autors: Keine Musterlösung, die katastrophal schlechter ist als der beste Zug; sonst
ein neues Beispiel. Geprüft mit `npm run messen:loesungen` (Stockfish, Tiefe 14, ein Kern): alle
1498 Züge des Lesers in den 674 Aufgaben des Taktiktrainers. Katastrophal heißt mehr als zwei
Bauern schlechter als der beste Zug, Werte über sechs Bauern (klar gewonnen, Matt) gelten als
gleich. Ergebnis: **kein** katastrophaler Lösungszug, es muss keine Aufgabe ersetzt werden.
„Falle oder Köder“ ist schon mit der Engine gemessen (Verlust beim Nehmen, bester Zug), der
Endspieltrainer nimmt die Züge der Engine selbst, Repertoire und Zug erraten folgen dem Buch und
den Meisterpartien (Regel 1; „Zug erraten“ sagt seit W12 ohnehin, ob der eigene Zug gleichwertig
war). Der Messlauf bleibt für spätere Datenstände.

## 23.10.2026 – P4 Trainer-Inhalte (Fable, Zweig `p4-trainerinhalte`)

- **R50 Falle oder Köder, neuer Maßstab.** Falle = nach dem Nehmen hat der Gegner eine
  Widerlegung, der Leser steht mindestens 1,5 Bauern schlechter als vor dem Nehmen (bester Zug)
  und mindestens 0,8 im Minus (Tiefe 18). Grund: Die alte Regel „ein anderer Zug war 1,5 besser“
  machte aus verpassten Gewinnen Fallen (Befund des Autors, Lichess-Aufgabe mit Wertung 753).
  Grenze 0,8 statt 1,0, damit das Blackburne-Shilling-Gambit (Abb. 4.41, −0,88) Falle bleibt.
  Jede Aufgabe braucht den Köder-Zug des Gegners (`fenVorher`, `vorzug`), der das Angebot erst
  geschaffen hat (Figur hingestellt, Linie geöffnet, Verteidiger abgezogen); Lichess-Fallen nur
  aus Aufgaben ohne „crushing“ und ohne Mattthema. Die App zeigt den Köder-Zug rot, das Angebot
  grau, nach der Antwort Widerlegung mit Wirkung (Matt, Material, Stellung), Wert vorher/nachher
  und erst dann die Warnsignale. Drei Schläge mit „?“ aus Kapitel 2 und 3 (2.129, 2.49, 3.30)
  sind nach diesem Maßstab keine Fallen und fallen weg (Rückfrage P4-3).
- **R48 Planbilanz-Übung.** Ablenker nur aus Sicht der Seite am Zug: „Wo?“ aus anderen
  Stellungen mit anderer Lage (Ort, Grund, Flügel), „Gegner?“ nur Aussagen über denselben Gegner
  (Ersatz: anderer Flügel, „noch kein erkennbarer Plan“), „Welche Figur?“ andere eigene Figuren,
  die aktiver sind als die LAP; eigene Figuren mit „dein/deine“. Nur Mittelspielstellungen nach
  `schach/phase.ts` (Lesart). Hauptkette: längste, dann zentralste Kette zum Flügel der Antwort
  (Abb. 11.78: e4–d5). Der leere Zusatz „(Ziel )“ des Werkzeugs wird im Trainer entfernt;
  Befunde für P3: leeres Ziel in `plan.wo.figuren`, Kettenwahl in `planlage.ts` nimmt die erste
  Kette, Gliederfolge „d6–f6–e5“ bei zwei Basen.
- **R47 Endspieltrainer.** Abb. 8.31 raus (Weiß am Zug: Ka6 patt, die Engine beendet die Aufgabe
  vor dem ersten Zug des Lesers); alle übrigen 79 Buchstellungen über zwölf Züge geprüft (Engine
  Tiefe 12 für alle Züge, Tiefe 16 für ihren Zug): überall kann der Leser scheitern. 119 freie
  Lichess-Endspielaufgaben (Themen pawn/rook/queen/bishop/knightEndgame, „equality“ = Remis),
  höchstens acht Steine, Engine bestätigt Ziel und Nichttrivialität, Stufe nach Wertung, je
  Gruppe höchstens fünf (Startwert 20261023). Kurzübungen: drei neue Arten; Quadrat-Lösung als
  Pfeile aus k8-quadrat statt goldener Felder.
- **R49 Strukturerkenner** (nach dem Einmischen von `p3-werkzeuge`): echte Stellung, Skelett per
  Knopf; starke Felder und schwache Bauern rechnet der Trainer mit `felderFuer` und
  `bauernschwaechen` (Festlegungen des Autors) statt aus den Pipeline-Merkmalen; neuer Schritt
  Feldart (genaueste Art zählt: Vorposten vor starkem Feld, Loch vor schwachem Feld; schwaches
  Feld = dauerhaft nicht deckbares Feld außerhalb der Lochreihen 3 bis 5); Partiestellungen aus
  den Hauptvarianten der Kapitel 2, 3, 6, 11, 12 (ab Zug 10, höchstens zwei je Zugfolge,
  mindestens zehn Bauern und sechs Figuren, gleiche Skelette einmal): 28 neue Aufgaben. Die
  Pipeline-Regel „rückständig“ hat die vierte Bedingung (kein gegnerischer Bauer davor) dazu.

## 23.10.2026 – Startanimation und Werkzeug-Befunde (P1, Opus)

- **Startanimation (R39, Antwort auf P2-A):** 2,5 Sekunden statt 1,9 und bei jedem Start der App
  (neue Sitzung des Browsers; die installierte App startet nach dem Schließen neu), ohne die
  Stundensperre. Neuer Schalter Zahnrad › Brett › „Startbild beim Öffnen der App“ (Merker
  `startanimation`, Voreinstellung an). Beim bloßen Neuladen und bei „Bewegung reduzieren“ des
  Geräts weiter nicht. Wunsch des Autors.
- **Befunde aus P4 an den Werkzeugen aus P3:** Ohne Ziel und Haken schreibt „Wo spiele ich?“
  „alle drei Bedingungen erfüllt“ statt „(Ziel )“; die Kette des Plans ist die längste mit
  Richtung, bei Gleichstand die zentralste (Abb. 11.78: e4–d5–f5 statt c3–b4); verzweigte
  Ketten stehen von Linie zu Linie (Abb. 6.11: „d6–e5–f6“ statt „d6–f6–e5“).

## Zugwahl der Bots, Plan (23.10.2026 abends, Freigabe des Autors)

- **Phasenregler Variante A:** Der Regler je Phase setzt die Ziel-Elo der Phase; daraus folgen die
  Fehlerraten der Phase. Fehlerart- und Fleckregler verschieben nur die Zusammensetzung (feste
  Stärke); im erweiterten Modus auch frei (Stärke wandert, Schätzung wird angezeigt).
- **Oberfläche:** Stil als Spinnennetz über die drei Achsen (sechs Speichen) mit Anzeige des
  nächsten Stils, dazu Auswahlliste; je Fehlerart und Fleck ein Regler auf den Quantilen der
  Menschen (5, 25, 50, 75, 95 %) plus je zwei Stufen darunter und darüber („unmenschlich“);
  Menschlichkeitsanzeige für die Kombination; geschätzte Elo aus den Einstellungen.
- **Zugwahl:** Wahrscheinlichkeit je Kandidat = Grundgewicht × Faktor Fehlerart × Faktor Flecken
  × Faktor Stil; Faktoren an den echten Stellungen der Spielerprofile geeicht; Tagesform je
  Partie, Zeitnot nach den Daten; kein Nachregeln während der Partie.
- **Bots je Kategorie:** jeder Stil einmal plus ein zweiter universeller, wechselnde Flecken,
  leicht gespreizte Phasen; echte Vorbilder und gezogene Profile gemischt; mehr Bots, wenn nötig.
- **Maia:** Versuch in Teil E (Maia-2 steht unter MIT; Maia-3 prüfen), Bedingung: Rechnen nicht
  spürbar länger als die künstliche Bedenkzeit.
- **Eröffnungen je Elo-Band** aus den Lichess-Partien für Bots und die Einschränkung „Eröffnung“;
  im Trainer nur als gekennzeichneter Bereich „Aus der Praxis“.
- **Modelle:** Teil E und Elo-Modell mit Fable (hoch), Auswertungen, Oberfläche, Teil F mit Opus.
- **Koordination (Koordinations-Chat P1, 23.10.2026):** R51 (Zeitklassen, Abzeichen, „ohne Uhr“
  weg, 60+0, „besiegt“ je Zeitklasse, Zeit in der Partienliste) ist Teil F dieses Zweigs; ebenso
  Schritt 5 (Schalter weg, neue Schätzung) unter Erhalt von R32 (nur gewertete Partien zählen).
  Bullet wird nicht angeboten (Autor, 23.10.2026), auch nicht unter R51.
  Neue Testpunkte ab N770. Nach dem Einbau auf main den Autor informieren, damit P1 mit R24,
  R27, R28 beginnt.

## Wahlmodell der Bots als bedingtes Logit (24.10.2026 nachts, Fable, Teil E Schritt 1)

- **Idee:** Statt Fehlerraten nachzuregeln, lernt ein Modell direkt aus den gespielten Zügen der
  Menschen, welchen der Kandidaten sie wählen. Kandidaten sind genau die, die auch der Bot sieht
  (sechs beste Züge der Engine, typische Fehlerzüge je Art, in der Eichung dazu der gespielte Zug).
  Nutzen eines Kandidaten = Verlustkurve (Stützstellen 0; 0,5; 1,2; 3; 10 Bauern) + Gewicht je
  Fehlerart + Gewicht je eigenem Fleck + Gewicht je Fleck der Widerlegung + Stilmerkmale + Bonus
  „bester Zug“; jedes Gewicht linear in der Wertung. Wahrscheinlichkeit ∝ exp(Nutzen).
- **Warum so:** Dieselbe Kandidatenerzeugung in Eichung und Spiel macht die Raten des Bots von
  selbst menschlich (Gelegenheiten wie in echten Partien); die Kopplung Fleck → Fehlerart entsteht
  aus den Gewichten der Widerlegungsflecken; der Phasenregler (Variante A) setzt die Wertung ein;
  die Persönlichkeit eines Bots verschiebt einzelne Gewichte innerhalb der Spielerbereiche.
- **Probe (2000 Stellungen):** Trefferquote des gespielten Zuges 36–43 % (Zufall 10–12 %), die
  Verlustkurve fällt mit der Wertung steiler. Vollständige Eichung an 180 000 Stellungen läuft
  (lokal buch/arbeit/zugwahl/merkmale.py, wahlmodell.py).
- **Ergebnis (24.10.2026, 3 Uhr):** Geeicht an 180 000 Stellungen, Gewichte quadratisch in der
  Wertung und mit eigener Verlustkurve für Eröffnung und Endspiel (sonst schätzt das Modell
  starke Spieler in der Eröffnung zu fehlerhaft, weil ihm die Theoriekenntnis fehlt). Nachspielen
  trifft die echten Fehlerraten je Band, Phase und Art auf etwa einen Prozentpunkt. In der App
  seit 0.2.125 (engine/wahlmodell.ts); die Stellschrauben der Bots bleiben und werden übersetzt:
  Gewicht einer Fehlerart g → Verschiebung ln g (0 schließt aus), Fleckgewicht g → −(g − 1) · 0,5
  auf Züge mit diesem eigenen Fleck, Stilregler → ±0,25 je Stufe auf Schlag, Schach,
  Königsnähe, Bauernsturm, Vorwärts (Rückzug und Abtausch gegenläufig), Höchstverlust je Art als
  Filter; Tagesform und Zeitnot als Temperatur des Softmax.
- **Offen:** Maia als Grundgewicht statt der Verlustkurve (Versuch), Neumessung der Bots und
  Verankerung mit dem neuen Elo-Modell, Regler auf menschlichen Quantilen (Oberfläche).

## Eigenes Elo-Modell je Zeitklasse in der App (24.10.2026 nachts, Fable, Restplan Schritt 5)

- **Entscheidung des Autors (23.10.2026):** Eine eigene Wertung je Zeitklasse (Blitz, Schnellschach,
  Klassisch) am Maßstab von Lichess, geeicht an Lichess-Wertungen; kein Schalter
  chess.com/Lichess/Mittelweg mehr; chess.com und FIDE nur als „entspricht etwa“.
- **Modell (spiel/elomodell.ts, Daten spiel/elomodell-daten.ts):** additiv, je Kennzahl eine
  stückweise lineare Kurve an Quantil-Stützstellen, Ridge-Regression (λ 3); Kennzahlen der eigenen
  Züge bis zur Entscheidung: Zahl der Züge, Lichess-Genauigkeit, Verlust je Zug, Fehlerrate,
  Anteile Ungenauigkeit/Fehler/Patzer (Grenzen 0,5/1,2/3 Bauern, Patzer bei klar gewonnener Stellung
  danach nur Ungenauigkeit), Verlust je Fehler, je Phase Züge/Verlust/Genauigkeit/Fehler/Patzer.
  Ein Modell für 1 bis 10 Partien (Kennzahlen gemittelt, Zahl der Partien als Kennzahl). Eichung
  an 77 000 Partien von 3 900 Spielern (Tiefe 12, schnelle Auswertung), die Kennzahlen vorher mit
  den Geraden des Tiefe-18-Abgleichs (500 Partien mit der Engine der App) auf die Tiefe 18 der App
  umgerechnet (Stand 781 Partien: Verlust ×1,207, Fehlerrate 0,019 + 0,911·x, Patzer
  0,017 + 1,197·x, Züge bis Entscheidung 0,43 + 0,895·x).
- **Warum additiv statt Gradient Boosting:** erklärbar, klein (etwa 25 KB), in TypeScript
  nachrechenbar; Gradient Boosting war nur 5 bis 15 % genauer (Schnellschach je Partie 275 statt
  284, über zehn Partien 131 statt 147 mittlere Abweichung).
- **Entzerrung:** Das Modell neigt zur Mitte (Gerade Schätzung = 0,86·wahr + 235 bei zehn Partien
  Schnellschach). Die Schätzung wird mit der umgekehrten Geraden je Partienzahl entzerrt, damit
  Spieler jeder Wertung im Mittel ihre Lichess-Zahl bekommen (Rest je Band unter ±60); die Spanne
  ist die entzerrte 90-%-Grenze (Schnellschach ±370 bei einer Partie, ±165 bei zehn; Blitz ±460
  und ±215; Klassisch ±285 und ±140).
- **Phasen:** Teilmodelle je Phase aus den Kennzahlen der Phase; breit (zehn Partien
  Schnellschach: Mittelspiel ±370, Eröffnung ±530, Endspiel ±910). Eine Zahl je Phase erscheint nur,
  wenn die halbe Spanne höchstens 350 ist (SCHMAL), sonst Urteil und Genauigkeit allein. Die
  Wertungspunkte speichern je Phase weiter eine Zahl oder null.
- **Zeitklasse** wie Lichess aus der Uhr (Grundzeit + 40 · Zuschlag: unter 8 min Blitz, unter 25
  Schnellschach, sonst Klassisch; ohne Uhr Schnellschach). „Deine Spielstärke“ je Zeitklasse über
  die letzten zehn gewerteten Partien dieser Zeitklasse (R32 bleibt: nur gewertete).
- **Umrechnung (spiel/umrechnung.ts):** Zahlen aus chessgoals.com (Juli 2026), zusammengeführt
  über die gemeinsame Spalte chess.com Blitz; Blitz → chess.com Blitz, Schnellschach → chess.com
  Schnellschach, Klassisch → FIDE (erst ab 1730). Nur Fakten übernommen, Quelle genannt.
- **Gespeicherte Daten:** Das Feld `genauigkeitsmodus` der Einstellungen wird beim Lesen übergangen;
  Partien brauchen keine Neuauswertung (dieselben Engine-Werte).
- **Offen:** Neumessung und Verankerung der Bots mit diesem Modell (Restplan 8); Messung der
  Bot-Stärke (engine/botstaerke.messung.ts) rechnet die Anker vorerst ohne Phasen der Züge.

## R51 Zeitklassen und Abzeichen (24.10.2026 nachts, Fable, Teil F erster Teil)

- **Uhrwahl** (spiel/uhr.ts): Blitz 3 + 0, 3 + 2, 5 + 3; Schnellschach 10 + 0, 15 + 10; Klassisch
  30 + 20, 60 + 0 (neu); Namen mit Zeitklasse („Blitz 3 + 2“). Kein Bullet (Autor, 23.10.2026).
  „Ohne Uhr“ nur noch außerhalb der Grundstellung (Abbildung, aufgebaute Stellung; dort ohnehin
  ungewertet); gespeicherte Vorliebe „ohne Uhr“ wird aus der Grundstellung zu 10 + 0
  (ui/bildschirme/Spielen.tsx, wirksameUhr). Grund: Die Wertung gilt je Zeitklasse, eine Partie
  ohne Uhr gehört zu keiner.
- **Besiegte Bots je Zeitklasse** (speicher/besiegt.ts): `besiegt` ist jetzt ein Objekt
  {blitz, rapid, classical}; eine alte einfache Liste zählt als Schnellschach (Partien ohne Uhr),
  Siege werden aus den gespeicherten Partien ergänzt. Stern und Zähler in der Gegnerwahl gelten
  für die Zeitklasse der gerade gewählten Bedenkzeit. Kein neues Speicherformat: Eine ältere App
  liest das Objekt als leere Liste und baut die Sterne aus den Partien neu auf.
- **Partienliste:** Bedenkzeit je Zeile („· 10 + 0“, alte Partien „· ohne Uhr“; eingelesene PGN
  ohne Angabe).
- **Offen aus R51/Teil F:** eigene Raten der Bots für Blitz und 60 Minuten, drei Einstellungssätze
  und drei Wertungen je Bot (nach der Neumessung mit dem Wahlmodell, Restplan 8); „besiegt“
  je Zeitklasse könnte später drei Abzeichen am Porträt zeigen statt des Sterns der gewählten
  Zeitklasse (Entwurf offen).

## Bedenkzeit der Bots je Zeitklasse (24.10.2026 nachts, Fable, Restplan 8b)

- **Befund** (lokal buch/arbeit/bedenkzeit/eichung.py, 390 000 Züge mit Uhrdaten aus den
  Spielerprofilen): Der Anteil der Restzeit je Zug hängt stark von der Zeitklasse ab. Im Blitz
  braucht ein 1200er im 20. Zug etwa 2,5 % der Restzeit, im Schnellschach 1,3 %, im Klassischen
  0,7 %; starke Spieler (2200+) brauchen im Mittelspiel in allen Zeitklassen etwa 3 %, Anfänger im
  Klassischen nur 0,3 bis 0,9 % (sie nutzen ihre Zeit nicht). Die bisherige eine Tabelle (erste
  Sammlung, Blitz und Schnellschach gemischt) lag dazwischen; ein klassischer Bot verbrauchte
  seine Zeit damit doppelt so schnell wie Menschen, ein Blitz-Bot zu langsam.
- **Umsetzung:** engine/bedenkzeit-daten.ts (erzeugt) mit Anteilen und Zeitnot-Sekunden je
  Zeitklasse; Zellen mit unter 300 Zügen nehmen das nächste Band mit genug Daten, Zeitnot im
  Klassischen (wenig Daten) die Werte des Schnellschachs. engine/bedenkzeit.ts bekommt die
  Zeitklasse in der Bedenklage (spiel/botzeit.ts aus der Uhr der Partie). Lage-Faktoren und
  Streuung bleiben aus der ersten Sammlung (die Spielerprofile tragen die Lage nicht).
- **Offen:** Tagesform aus der Streuung zwischen Partien (Beta-Binomial) als Temperatur des
  Wahlmodells; Zeitnot-Faktoren der Fehler je Zeitklasse (bisher Blitz und Schnellschach gemischt).

## Tagesform als Temperatur des Wahlmodells (24.10.2026 morgens, Fable, Teil E)

- **Messung** (lokal buch/arbeit/zugwahl/temperatur.py): Fehlerrate des Wahlmodells je Band bei
  Temperatur T (Nutzen durch T). Schnellschach 1200: T 0,75 → 28,3, T 1 → 33,6, T 1,25 → 38,1
  Fehler je 100 Züge; die Rate ist fast linear in T. Eine je Partie gleichverteilte Temperatur
  zwischen 0,75 und 1,25 (bisherige Tagesform) streut die Fehlerrate zwischen Partien nur um
  etwa 3 je 100 Züge; das Beta-Binomial-Modell der Spielerprofile misst 5,0 bis 5,7.
- **Entscheidung:** Tagesform je Partie gleichverteilt zwischen 0,6 und 1,4 (engine/menschlich.ts,
  TAGESFORM_SPANNE 0,4): Streuung etwa 4,2 bis 5,3 ab 800, bei 400 etwa 3,4 (dort bleibt der Rest
  Gegner- und Eröffnungsstreuung). Zeitnot wirkt weiter multiplikativ auf die Temperatur
  (ZEITNOT-Faktoren der Fehler, bisher Blitz und Schnellschach gemischt; je Zeitklasse offen).

## Zeitnot der Bots als Temperatur je Zeitklasse (24.10.2026 morgens, Fable, Restplan 8b)

- **Messung** (lokal buch/arbeit/bedenkzeit/zeitnot.py): Fehler ab einem Bauern bei weniger als 60,
  30 und 10 s Rest gegenüber einer Minute und mehr, je Zeitklasse und Gruppe. Blitz ab 1800:
  ×1,25, ×1,33, ×1,55 (Patzer ×1,84, ×2,38, ×3,49); Blitz 1000 bis 1799: ×1,17, ×1,17, ×1,20;
  Blitz unter 1000: nur ×1,05 (Anfänger spielen in Zeitnot kaum schlechter als sonst).
  Schnellschach ab 1800 (genug Züge): ×1,14, ×1,14, ×1,29; Schnellschach darunter und Klassisch
  haben zu wenige Zeitnot-Züge und nehmen die Blitz-Faktoren.
- **Umsetzung:** Statt der Ratenfaktoren der ersten Sammlung (ZEITNOT, Blitz und Schnellschach
  gemischt) erhöht Zeitnot die Temperatur des Wahlmodells; der Temperaturfaktor je Zeitklasse,
  Stufe und Band ist so gewählt, dass die Fehlerrate des Modells um den gemessenen Faktor steigt
  (Umkehrung der Temperaturkurven aus zugwahl/temperatur.py, engine/zeitnot-daten.ts; Blitz 2000
  unter 10 s → Temperatur 1,6). Die Patzer steigen dabei von selbst stärker als die Fehler, wie
  bei Menschen (steile Verlustkurve). Alte Faktoren bleiben für die Messskripte (zeitnotFaktoren).

## Wünsche des Autors vom 24.10.2026 morgens (Fable): Partiekopf, Zonen der Zugklassen, Startbild bei der Rückkehr

- **Partiekopf:** Das Porträt des Bots steht nicht mehr in der Titelzeile (es drängte „gegen
  Johanna“ in den Umbruch), sondern linksbündig im Untertitel; daneben der Satz des Bots aus der
  Gegnerwahl, klein darunter die bisherige Stufen- und Farbzeile (Partieuntertitel.tsx).
- **Zonen des Bullet-Diagramms „Deine Züge“** (spiel/zugklassenvergleich.ts, Daten
  spiel/zugklassenvergleich-daten.ts aus den Spielerprofilen, je Zeitklasse und 400er-Band 160 bis
  430 Spieler mit mindestens 100 Zügen): „üblich“ ist der Median der Spieler, „normal“ reicht vom
  5-%- bis zum 95-%-Quantil der Spieler, je Seite quadratisch erweitert um die Zufallsstreuung
  einer Partie mit so vielen Zügen (Binomial, 90 %): Sonst hieße in einer 30-Züge-Partie fast
  jede Klasse „gut“ oder „schwach“, obwohl nur der Zufall spielt. Die Zonen sind deshalb je Zeile
  und je Partielänge verschieden breit; die Skala bleibt bis zum Doppelten des Üblichen.
  Brillant, stark und Buchzug kennen die Profile nicht (die Lichess-Auswertung unterscheidet sie
  nicht): vorläufige Schätzung mit fester Zone 75 bis 125 %; „bester“ ist der Profilwert aller
  Züge ohne Verlust minus diese drei. Damit ist die Aufgabe von P1 (echte Vergleichswerte für
  zugklassenvergleich.ts) erledigt.
- **Startbild bei der Rückkehr** (Startanimation.tsx, startanimationRegel.ts): Über
  `visibilitychange` merkt sich die App, wann sie unsichtbar wurde; wird sie nach mindestens 30
  Minuten wieder sichtbar, läuft die Animation 1,8 s (CSS-Variable `--startanimation-dauer`),
  aber nur auf Geräten mit grobem Zeiger (`pointer: coarse`, Handy und Tablet): Am Rechner
  wechselt man zwischen Fenstern, dort wäre sie störend. Einstellung „aus“ und „Bewegung
  reduzieren“ gelten weiter. Grenze: Wirft das System die Hintergrund-App aus dem Speicher,
  startet sie neu und zeigt das normale Startbild.

## Persönlichkeiten der Bots auf menschlichen Quantilen, sieben Stile (24.10.2026 mittags, Fable, Restplan 8 erster Teil)

- **Regler auf Quantilen** (engine/spielerbereiche.ts, Daten engine/spielerbereiche-daten.ts aus
  dem Beta-Binomial-Modell, Schnellschach, je 400er-Band): Eine Stufe je Fehlerart oder Fleck
  heißt −2 „so selten wie die 5 % unauffälligsten Spieler“, 0 Median, 2 „so oft wie die
  auffälligsten 5 %“; ±3 und ±4 setzen das Verhältnis 75 → 95 % geometrisch fort (unmenschlich).
  Der Faktor auf das Gewicht folgt aus Stufe und Wertung des Bots (zwischen den Bandmitten
  geometrisch). Die früheren festen Faktoren der Persönlichkeiten (1,5; 1,8; 3; 0,6 …) sind in
  Stufen übersetzt (etwa 1,3 bis 1,5 → 1, 1,8 bis 2 → 2, 3 → 3, 0,5 bis 0,6 → −1, 0,3 → −2);
  „besonders blind“ ist Stufe 2 des Flecks. Grund: Ein Faktor 3 bedeutete bei einer Art mit enger
  Streuung Unmenschliches, bei einer mit weiter Streuung fast nichts; jetzt sind die Stufen
  vergleichbar und bleiben innerhalb echter Spieler (Entscheidung des Autors, 23.10.2026).
- **Sieben Stile** (engine/stile.ts): je Bot einer nach der Tabelle in „Spielstile der Bots“;
  Verschiebung der Stilmerkmale des Wahlmodells, je Merkmal so geeicht, dass der Anteil solcher
  Züge um etwa anderthalb Standardabweichungen der Spieler steigt (Schach und Königsnähe 0,6,
  Schlag 0,4, Vorwärts 0,3, Rückzug 0,35, Bauernsturm 0,25, Abtausch 0,6; mit einheitlich 0,5
  wären Bauernsturm und Vorwärts drei Standardabweichungen gewesen) (Angreifer: Schach und Königsnähe;
  Positionsspieler umgekehrt; Taktiker: Schlag und Vorwärts, kein Rückzug; Verteidiger
  umgekehrt; Draufgänger: Bauernsturm und Vorwärts, kein Abtausch; Vereinfacher: Abtausch, kein
  Bauernsturm; Universell nichts). Der Regler −2 bis 2 bleibt für eigene Gegner.
- **Offen:** Neumessung und Verankerung der Bots; Regler eigener Gegner auf dieselben Stufen umstellen (Oberfläche).

## Verankerung der Bot-Leiter an menschlich spielenden Stufen (24.10.2026 mittags, Fable)

- **Befund:** Das Elo-Modell (spiel/elomodell.ts) ist an Menschen geeicht. Die reinen Grundschichten
  der Engine (Zufall auf die Bewertung, keine Zusatzfehler) haben ein anderes Fehlermuster; das
  Modell ordnet sie unplausibel ein (Grundschicht 1x1 mit 40 % Genauigkeit → 879, 4x0.2 mit 58 %
  → 700; Abweichung Leiter minus Anker −553 bis +490). Die alte Kurvenrechnung hatte dasselbe
  Problem schwächer (−303 bis +311).
- **Entscheidung:** Anker sind ab jetzt die Stufen mit allen Zusatzfehlern der Menschen (Kürzel
  „Nm“, Wahlmodell), die gegen sich selbst spielen; ihre Partien werden in Tiefe 18 mit der Engine
  der App bewertet und mit dem Elo-Modell samt Phasen eingeordnet. So liegt die Skala der Bots
  dort, wo das Modell gilt, und ein Bot, der wie ein 1200er von Lichess spielt, bekommt 1200.
  Die Leiter (Ergebnisse aller Paarungen) verbindet Bots, Stufen mit und ohne Zusatzfehler und
  die Kandidaten.

## Messung der Bots gegen menschlich spielende Stufen (24.10.2026 mittags, Fable)

- **Befund (botelo4, erster Lauf):** Mit dem Wahlmodell spielt ein Bot bei gegebener Wertung
  menschlich stark, unabhängig von seiner Grundschicht: Die Stufen mit Zusatzfehlern („Nm“)
  schlagen die reinen Grundschichten 1 bis 5 mit 20:0, erst bei Stufe 7 ist es ausgeglichen; alle
  64 Bots gewinnen 12:12 gegen ihre beiden Nachbarstufen. Die reinen Stufen 1 bis 6 sind viel
  schwächer als jeder Lichess-400er; Paarungen „Bot gegen reine Stufe“ sind gesättigt und tragen
  nichts zur Leiter bei.
- **Entscheidung:** Bots und Kandidaten werden gegen die zwei nächsten Nm-Stufen gemessen (Stufe
  ihres Mittelspiels und die darüber), die Nm-Stufen selbst gegen sich (Anker, Tiefe 18, Elo-Modell).
  Die Nm-Stufen bilden eine menschliche Leiter von etwa 400 (1m, 2m: die Wertung des Wahlmodells
  beginnt bei 400) bis 2966 (10m). Folge für die App: Eine eigene Stufe mit Zusatzfehlern spielt
  wie das Wahlmodell bei der Wertung der Stufe; der bisherige „Abzug der Zusatzfehler“
  (ZUSATZ_ABZUG) wird dadurch hinfällig und für Stufe 1 bis 6 sogar ein Aufschlag – wird mit der
  Verankerung neu gefasst (engine/botstaerke.ts).

## Website an das Buch angeglichen (24.10.2026 nachmittags, Fable, Wunsch des Autors)

- **Befund (Abgleich des Autors mit dem Buchstand vom 20.10.2026):** Im Buch stehen die Übungen
  nicht mehr im Kasten „Training zu diesem Kapitel“; der Kasten nennt Stichworte und führt per
  QR-Code auf die Trainingsseite. Kapitel 12 spricht von „Trainingsseiten“ und sagt, den aktuellen
  Stand der Online-Angebote zeige die Website. Die Website hatte an mehreren Stellen die alte
  Fassung („Übungen aus dem Kasten“, „nicht nur gedruckt“, „Trainingskästen“, „prüfe Bezeichnungen
  und Adressen beim ersten Aufruf“, Verweise auf „die Abschnitte davor“ und auf Merkseite und
  Kopiervorlage „im Buch“ ohne Ort).
- **Entscheidung:** Texte des Autors übernommen: Werkzeugkasten-Seite (erste beide Absätze,
  `inhalte/de/training/werkzeugkasten.json`), `training.uebersicht.einleitung`,
  `startseite.training.text`, `training.kastenText`, `training.seite.einleitung` (Punkt statt
  Semikolon), `startseite.buch.text1` („Eröffnungsgrundsätze und klassische Eröffnungssysteme“,
  weil Kapitel 2 die Systeme und das Repertoire behandelt), `installation.einleitung` (kostenlos,
  ohne Werbung, ohne Anmeldung, wie Kapitel 0 des Buches); englische Fassungen sinngleich.
  Stilregeln des Autors für alle neuen Texte: Du-Form, kein Semikolon, dasselbe Bindewort höchstens
  einmal je Absatz, keine zwei Sätze nacheinander mit demselben ersten Wort, nichts hinzuerfinden.
- **Schutz der Trainingsdateien:** `pipeline/training.py` bricht beim aktuellen Buch ab
  (`pruefe_alte_kaesten`, das Buch enthält `\trainingsverweis`) und schreibt nichts; geprüft am
  24.10.2026 gegen `buch/a1`. Die Dateien in `inhalte/de/training/` sind die Quelle und werden von
  Hand gepflegt.
- **Abbildungslinks:** In kap09.json (9.8 Lucena, 9.15 Vancura, 9.28 Dame gegen Bauer) und
  kap10.json (10.9 Réti, 10.14 Heuäcker) waren die Nummern nur Text; jetzt Verweise, die die App an
  der Abbildung öffnen. Zwei Tests in `pipeline/tests/test_training.py` sichern das für alle
  Trainingsseiten: keine Abbildungsnummer im Fließtext ohne Verweis (Nummern nach „Abschnitt“,
  „Tabelle“, „Kapitel“ zählen nicht), kein Verweis auf eine Abbildung, die es in den App-Daten
  nicht gibt.
- **Impressum, „Quelltext und Rechte“:** aus „(Texte, Abbildungen, Zugfolgen)“ wird „(Texte und
  Abbildungen)“. Grund (Autor): Die Notation historischer Partien ist in der Regel kein
  geschütztes Werk, der Anspruch wäre angreifbar. Das ist eine Einschätzung des Autors und ersetzt
  keine anwaltliche Prüfung (so auch im Kommentar der Datei).
- **Semikolons in Impressum und Datenschutz:** durch Punkt oder Komma mit Bindewort ersetzt, ohne
  die rechtliche Aussage zu ändern (eine Stelle gekürzt: „Zeitpunkt sowie deine IP-Adresse“ statt
  „Zeitpunkt; dabei wird auch deine IP-Adresse übertragen“). Paragrafen, Namen und Angaben
  unverändert; „Stand“ der Datenschutzerklärung bleibt 19. Oktober 2026, weil sich inhaltlich
  nichts geändert hat. Bezugsquellen auf der Startseite unverändert („ISBN folgt“, „Links folgen“).

## Gruppenmodus je Bot-Kategorie (Wunsch des Autors, 24.10.2026 nachmittags; geplant, noch nicht gebaut)

- **Idee des Autors:** Hat der Leser jeden Bot einer Kategorie geschlagen (egal in welcher
  Zeitklasse), erscheint einmal ein kleines Pop-up mit Gratulation und einer netten Grafik: Der
  Gruppenmodus dieser Kategorie ist freigeschaltet. In der ausgeklappten Kategorie steht dann unter
  den Porträts ein Knopf mit eigenem Symbol „Gruppenmodus“: eine Partie gegen alle Bots der
  Kategorie zugleich, als würden sie sich bei jedem Zug beraten und den Zug spielen, den sie
  gemeinsam für den besten halten.
- **Umsetzung (vom Autor vorgegeben):** Bei jedem Zug wählt jeder Bot der Kategorie seinen Zug wie
  in einer eigenen Partie (Wahlmodell mit Stil, Fehlerarten, Tagesform); aus dieser Auswahl spielt
  die Gruppe den Zug, den die Engine am besten bewertet. Die Stärke des Gruppenmodus wird vorab
  gemessen (wie die Bots: Paarungen gegen die Nm-Stufen, Leiter), in der App aber erst gezeigt, wenn
  der Leser den Gruppenmodus einmal besiegt hat; bis dahin steht dort „Stärke unbekannt“. Danach
  steht die Zahl dauerhaft im Menü.
- **Reihenfolge:** nach den regulären Bots (Messung, Auswahl, Charaktersätze) und vor dem
  gemeinsamen Push nach main (Restplan 9b in FORTSCHRITT). Offen zu klären beim Bau: Speicher
  (freigeschaltet und besiegt je Kategorie, ohne neues Speicherformat, wenn möglich), Wertung der
  Partie (gewertet mit der gemessenen Zahl), Zeitklassen (eine Zahl je Zeitklasse wie bei den Bots).

## Maia: Versuch später, bei Erfolg als nachladbares Zusatzpaket (24.10.2026 nachmittags, Autor)

- **Stand:** Die Bots wählen mit dem eigenen Wahlmodell (180 000 Lichess-Stellungen, Fehlerraten je
  Band, Phase und Art auf etwa einen Prozentpunkt). Maia (University of Toronto, 1100 bis 1900,
  Maia-2 unter MIT, Maia-3 prüfen) bleibt ein Versuch nach Messung und Gruppenmodus: nur, wenn die
  Bots damit messbar menschlicher werden als mit dem Wahlmodell, und nur, wenn das Rechnen nicht
  spürbar länger dauert als die künstliche Bedenkzeit. Unten (unter 1100) und oben (über 1900)
  bleibt ohnehin das eigene Modell.
- **Wunsch des Autors für den Erfolgsfall:** nicht fest einbauen, sondern als optionales
  Zusatzpaket: In den Einstellungen (und erklärt in der App-Tour) lässt sich das Netz nachladen;
  danach ein Schalter „Maia für die Bots“ an und aus, oder alternativ eine eigene Bot-Kategorie
  „Maia“. Das Größenbudget der App (25 MB) bleibt davon unberührt, weil das Paket getrennt geladen
  wird und offline gespeichert bleibt.
- **Zu klären vor dem Bau:** Mehrwert aus den Messungen (Fehlerraten und Zugverteilung gegen die
  Lichess-Daten, Vergleich mit dem Wahlmodell je Band); sauberes Umschalten ohne Bruch (laufende
  Partien behalten ihr Modell bis zum Ende, Wertung der Bots je Modell getrennt gemessen, kein
  Modellwechsel mitten in einer gewerteten Partie, Speicher und Nachladen mit klarer Anzeige und
  Fehlermeldung bei fehlendem Netz). Entscheidung über Schalter oder eigene Kategorie erst mit den
  Messergebnissen.

## 24.10.2026 – R57 Admin-Dashboard (P1, Opus)

- Website-Worker bekommt Code (`app/worker/`), aber nur für `/api/*` und `/admin*`
  (`run_worker_first`); alles andere liefert Cloudflare wie bisher direkt aus.
- Der Worker prüft das Zeichen von Cloudflare Access selbst (RS256, AUD, Ablauf), weil
  workers.dev und Vorschauadressen nicht hinter Access liegen. Team und AUD stehen in
  `wrangler.jsonc` (öffentlich sichtbar auf jeder Anmeldeseite).
- `/admin/` ist nicht im Offline-Speicher der App (sonst würde Access das Vorabladen auf
  Lesergeräten umleiten).
- Meldungen: Drossel fünf je Verbindung und Stunde (Prüfwert aus IP und Datum, nach einem Tag
  gelöscht), Meldungen nach zwölf Monaten gelöscht, Datenschutzerklärung um „Meldungen aus der
  App“ ergänzt. Turnstile vorerst nicht in der App (DB2, Widerspruch genügt).
- Wartungsprüfungen in Python ohne weitere Pakete (`pipeline/wartung`), Rot lässt den Lauf
  scheitern (Mail von GitHub). Zertifikat erst unter 14 Tagen gelb, weil Cloudflare etwa 30 Tage
  vor Ablauf erneuert.
- DB1 erledigt (24.10.2026): Der Autor hat `BERICHT_SCHLUESSEL` in GitHub (Actions-Secret) und Cloudflare (Worker-Secret) eingetragen; die Prüfberichte gehen damit ans Dashboard.

## Wertung je Zeitklasse, vorläufige Wertung, Phasenkurve über mehrere Partien (24.10.2026 nachmittags, Fable; Empfehlung, vom Autor angenommen)

- **Befund:** Nach der Umstellung auf das Elo-Modell waren die Phasen-Ansichten der Wertungskurve
  („Eröffnung“, „Mittelspiel“, „Endspiel“ in den Einstellungen) für neue Partien leer: Sie zeigten
  je Partie die Schätzung der Phase, und aus einer Partie ist die Spanne einer Phase nie schmal.
  Außerdem lief die Elo-Wertung als eine Zahl über alle Zeitklassen, während „Deine Spielstärke“
  je Zeitklasse schätzt; der Startwert aus einer Partie (±370) stand ohne Kennzeichnung da; und
  beide Zahlen (Ergebnisse, Zugqualität) standen an zwei Orten ohne Bezug zueinander.
- **Entscheidung (alle vier Empfehlungen angenommen):**
  1. Die Phasenkurve zeigt nach jeder Partie die Schätzung des Teilmodells aus den bis dahin letzten
     zehn Partien der Zeitklasse (`spiel/wertung.ts`, `phasenverlauf`), nur wo die Spanne schmal ist;
     sonst der Satz „noch zu wenige Partien … für eine Zahl“. Neue Wertungspunkte speichern keine
     Phasenwerte mehr (`phasen` bleibt für ältere Punkte lesbar).
  2. Wertung je Zeitklasse wie bei Lichess: eigene Elo-Kette für Blitz, Schnellschach und Klassisch,
     Reiter „Zeitklasse“ in der Karte, sobald mehr als eine Zeitklasse Partien hat; Startwert aus dem
     Elo-Modell der Zeitklasse; Gegnerzahl des Bots (je Zeitklasse, sobald gemessen). Kein neues
     Speicherformat: Neue Punkte tragen `tempo`, ältere Punkte ohne Angabe zählen als Schnellschach
     (bisherige Standarduhr 10+0), Blitz und Klassisch beginnen neu.
  3. „Vorläufig“ in den ersten zehn Partien einer Zeitklasse (K-Faktor 32), wie das „?“ bei Lichess.
  4. Jede Karte nennt die andere Zahl: „Deine Wertung“ zeigt „Aus deinen Zügen: etwa … (von bis)“,
     „Deine Spielstärke“ zeigt „Aus deinen Ergebnissen: Wertung …“.
- **Schwelle „schmal“ von 350 auf 400:** Die halbe 90-%-Spanne des Mittelspiels liegt bei zehn
  Schnellschach-Partien bei 395, bei Klassisch bei 315; mit 350 hätte das Mittelspiel im
  Schnellschach nie eine Zahl bekommen. Mit 400 erscheint sie ab etwa zehn Partien; Eröffnung (531)
  und Endspiel (911) bleiben im Schnellschach ohne Zahl, bis die Teilmodelle besser sind. Blitz
  bekommt keine Phasenzahl.

## Schriftgröße in den Einstellungen (24.10.2026 nachmittags, Wunsch des Autors)

- **Wunsch:** Die App folgt der Schriftgröße des Geräts; der Leser soll sie zusätzlich unabhängig
  vom System in 10-%-Schritten größer oder kleiner stellen können.
- **Umsetzung (0.2.125):** Einstellungen › Anzeige › „Schriftgröße“: Knöpfe „A−“ und „A+“, dazwischen
  die Prozentzahl (80 bis 150 %), „Standard“ zurück auf 100 %. Merker auf dem Gerät
  (`svga.schriftgroesse`, wie der Nachtmodus), angewendet als Variable `--schriftfaktor` am
  Wurzelelement, die basis.css in die Grundschrift einrechnet (`html { font-size: calc(100% *
var(--schriftfaktor, 1)) }`); ein Skript in app/index.html setzt sie vor dem ersten Zeichnen.
  Weil alle Schriftgrößen in rem stehen, skaliert der ganze Text mit.
- **Symbole (Frage des Autors):** Symbole, die in Textzeilen stehen (Stufenmarken, Plaketten,
  Ergebnismarken, Fortschrittskreise in symbole.css), skalieren mit: ihre festen Pixelbreiten sind
  jetzt rem (Kommentar nennt die Pixel bei Standardschrift). Das Brett und die Figuren folgen der
  Bildschirmbreite, nicht der Schrift; Tippflächen bleiben mindestens 44 px und wachsen mit dem
  Inhalt. Weitere feste Pixelmaße (Abstände, Ränder, Vorschaubilder) bleiben, damit das Layout bei
  150 % nicht auseinanderläuft; wo ein Symbol bei großer Schrift zu klein wirkt, wird es nachgezogen
  (Rückmeldung des Autors).

## Gruppenmodus gebaut (24.10.2026 nachmittags, Fable; Entwurf oben „Gruppenmodus je Bot-Kategorie“)

- **Zugwahl (engine/gruppenwahl.ts):** Die Analyse der Stellung läuft einmal (engine/menschenwahl.ts,
  `kandidatenpool`: sechs beste Züge und die typischen Fehlerzüge aller aktiven Arten der
  Mitglieder), dann wählt jeder Bot der Stufe mit seiner Wertung, seinem Stil, seinen Fehlerarten
  und Flecken aus demselben Pool (`wahlAusPool`); dann stimmt die Gruppe ab: Der Zug mit den
  meisten Stimmen wird gespielt, bei Gleichstand ein zufälliger der gleichauf liegenden Züge
  (Entscheidung des Autors, 24.10.2026 nachmittags: Mehrheit statt „bester Zug der Gruppe“, und
  bei Gleichstand das Los statt des besseren Zuges, damit die Gruppe etwas schwächer bleibt; so
  kann sie auch einen gemeinsamen Fehler machen, wenn zwei sich einig sind und die übrigen sechs
  sich zersplittern). So kostet die Gruppe kaum mehr Rechenzeit als ein Bot. Kein
  Eröffnungsbuch.
- **Gegner:** Kennung „gruppe-N“ (engine/gruppe.ts), Kategorie „vorgefertigt“, Name „Gruppe der
  Stufe N“, Stufen je Phase die höchsten der Mitglieder (Bedenkzeit), Beschreibung in der
  Sprechblase und unter dem Partietitel. Bild: die Gesichter der Stufe übereinandergelegt wie in der
  zugeklappten Stufenzeile (Wunsch des Autors), auch in der Partienliste.
- **Freischaltung:** frei, sobald jeder Bot der Stufe in irgendeiner Zeitklasse gewertet besiegt ist
  (speicher/besiegt.ts, keine neue Speicherung). Unter dem Porträtgitter steht sonst der Satz, was
  den Gruppenmodus freischaltet. Nach der Partie, die den letzten Bot besiegt, erscheint einmal je
  Gruppe eine Gratulation (Merker `svga.gruppenGratuliert` auf dem Gerät).
- **Stärke:** „Stärke unbekannt“, bis der Leser die Gruppe einmal besiegt hat (Sieg landet als
  „gruppe-N“ in den besiegten Bots) und eine gemessene Zahl vorliegt
  (engine/gruppenstaerke-daten.ts, noch leer). Für die Elo-Wertung gilt von Anfang an die gemessene
  Zahl, ohne Messung der stärkste Bot der Stufe plus 150.
- **Offen:** Messung der Gruppen (Paarungen „@gruppe-N“ gegen die menschlich spielenden Stufen im
  Messlauf), danach die Zahlen in gruppenstaerke-daten.ts; Gruppen erst nach dem endgültigen
  Bot-Satz messen, weil die Mitglieder sich mit der Auswahl ändern.

## Ergebnis des zweiten Messlaufs (24.10.2026 nachmittags, Fable, botelo4)

- **Anker (Nm-Stufen gegen sich selbst, 40 Partien je Stufe, Tiefe 18, Elo-Modell Schnellschach):**
  1m 643, 2m 971, 3m 1286, 4m 1579, 5m 1671, 6m 1921, 7m 2029; 8m bis 10m gesättigt (Genauigkeit
  über 83 %, das Modell endet bei etwa 2300). 9m und 10m spielten in allen 40 Partien identisch: Bei
  Wertungen ab etwa 2700 wählt das Wahlmodell praktisch immer den besten der Kandidaten aus Tiefe 10.
- **Leiter (Bots, Kandidaten, Nm-Stufen, reine Spitzenstufen; etwa 900 Paarungen):** Die Ergebnisse
  zwischen Bots liegen enger beieinander als ihre Zugqualität (Leiter 1m bis 7m 890 Elo breit, Anker
  1390). Deshalb legt eine Gerade (kleinste Quadrate über die sieben gültigen Anker) die Leiter auf
  die Anker; Rest je Anker danach −125 bis +112. Ergebnis: Nm 1 754, 2 941, 3 1239, 4 1454, 5 1696,
  6 1907, 7 2110, 8 2294, 9 2390; reine Stufe 8 2489, 9 2994, 10 (volle Engine) 3215. Bots 521 bis
  3238, Kandidaten 549 bis 2876 (mittlere Streuung ±128 bei zehn Partien je Paarung).
- **Stufe 10 ist die volle Engine:** Mit Zusatzfehlern wäre sie Stufe 9 (identische Partien); das
  Wahlmodell zieht nur aus den Kandidaten der Tiefe 10. Bots mit Stufe 10 stehen deshalb auf 9 (ihr
  Spiel ist dasselbe). Folge: Die Spitzengruppe 10 (2850 bis 3150) füllen Bots mit seltenen Fehlern
  (Faktor 0,1 bis 0,3), die Gruppen 1 und 2 Bots mit häufigeren Fehlern (Faktor 1,6 und 2,5); dafür
  32 Zusatzkandidaten, gemessen gegen 1m/2m bzw. 9m und die reine 9.
- **Uhr:** Mit der menschlichen Bedenkzeit je Zeitklasse kostet die Uhr die Bots nichts Messbares
  (Blitz +23, Schnellschach −54 gegenüber Klassisch, bei ±40 Streuung); der Uhrabzug ist 0, ein
  Abzug zählt erst ab 80 Elo Verlust. Drei Zahlen je Bot und Zeitklasse (R51) bleiben verschoben,
  weil die Uhr keinen messbaren Unterschied macht.
- **Offen:** Wertung je Zeitklasse der Bots ist damit vorerst dieselbe Zahl; Gruppenmodus-Messung
  nach dem endgültigen Satz.

## Zeitklassen wie bei Lichess, Stern je Zeitklasse (24.10.2026 nachmittags, Autor)

- **Hintergrund:** Die App teilt die Zeitklassen wie Lichess (Grundzeit plus 40 Züge Zuschlag:
  unter 8 min Blitz, unter 25 min Schnellschach, darüber Klassisch); 30+20 und 60+0 sind damit
  Klassisch, 15+10 Schnellschach. Beim Weltschachbund wäre 30+20 noch Schnellschach.
- **Entscheidung des Autors (nach kurzem Irrtum am selben Tag):** Es bleibt bei Lichess: Mit 30+20
  spielen die Bots nach der Klassisch-Kalibrierung, ein Sieg vergibt den Klassisch-Stern, wie bei
  60+0. Jede Zeitklasse hat ihren eigenen Stern; nichts wird doppelt vergeben.

## Endgültiger Bot-Satz (24.10.2026 abends, Fable, botelo4)

- **78 Bots in zehn Gruppen** (Gruppe 1 sechs, sonst acht), gewählt aus 64 Bestandsbots und 274
  Kandidaten nach der gemessenen Zahl (Schnellschach, verankerte Leiter): je Gruppe jeder der sieben
  Stile einmal plus ein zweiter Universeller, bei mehreren Treffern der nächste an der Gruppenmitte.
  Gruppe 1 (250 bis 450) hat nur sechs, weil für Taktiker und Universell kein Kandidat unter 450
  lag; Spielerinnen und Spieler unter 450 sind selten, und die Spaß-Bots füllen den Bereich.
- **Namen und Porträts:** Gewählte Bestandsbots behalten Name, Porträt und Kennung. Gewählte
  Kandidaten bekommen Name und Porträt aus dem Pool (nicht gewählte Bestandsbots, schwächste
  zuerst, dazu 19 neue Porträts); Titel (GM, IM, WGM, WIM, FM, Trainer, Doktor, Prof.) bleiben den
  Gruppen 8 bis 10 vorbehalten. Jedes Porträt wurde für seinen Namen erzeugt, deshalb passt das
  Geschlecht des Bildes zum Namen (Wunsch des Autors). Ein Porträt, das ein Bestandsbot trägt
  (Herr Krause trägt „herr-lehmann“), gilt nicht als frei.
- **Archiv** (`engine/botarchiv.ts`): die 49 nicht gewählten Bots von 0.2.117 mit ihren Werten,
  unter „alt-…“ wenn ein Kandidat ihre Kennung übernahm. Nicht in der Gegnerwahl, ohne Sätze.
  `engine/botmessnamen.ts` verbindet neue Kennungen mit den Kandidatenkennungen der Messung, damit
  `botstaerke-daten.ts` die gemessene Zahl unter dem neuen Namen führt.
- **Gruppe 10:** Zwei Kandidaten mit Faktor 0 (keine Zusatzfehler, Stufe 9 mit Persönlichkeit),
  gemessen gegen 9m und die reine Stufe 10: Opa Walter 3113, Frau Hoffmann 3025.
- **Charaktersätze** (de und en): zu jedem Bot zwei Sätze zu Stil, Persönlichkeit und Fehlerhäufigkeit,
  menschlich erzählt; nach Regel 9 in der App, der Autor liest sie später. Sätze alter Bots, die es
  nicht mehr gibt, wurden entfernt.
- **Lokal** (`buch/arbeit/botelo4/`): `auswahl.py` (Auswahl mit Alternativen je Stil, `auswahl.txt`),
  `satz.py --schreiben` (Satz, Archiv, Messnamen; nur einmal auf die ursprünglichen Listen anwenden),
  `satz/neue-bots.json`.

## 24.10.2026 abends – P6 abgeschlossen (R25, P1, Opus)

- Trainerdaten englisch ohne eigene Übersetzungstabelle: Die Aufgaben sind Stellungen, Züge und
  Kennungen; den einzigen sichtbaren Text (Name des Fallenchecks) nimmt der Build aus den
  englischen Buchdaten (Fallencheck mit derselben Stoppabbildung).
- Eröffnungsliste von Lichess englisch mit den Originalnamen; deutsch bleibt die Übersetzung der
  Familie (Entscheidung R12).
- Website (Startseite, Trainingsseiten, Impressum, Datenschutz) bleibt deutsch; „English
  (preview)“ bleibt als Bezeichnung, bis der Autor das englische Buch festlegt (EN1).

## Startbild aus dem Cover (24.10.2026 abends, Wunsch des Autors, R39)

- **Bild:** `app/public/bilder/startspringer.webp` (840 × 840, etwa 270 KB), erzeugt von
  `app/skripte/erzeuge-startbild.mjs` aus dem Cover in voller Auflösung (TIF des Autors, lokal als
  PNG umgewandelt). Ausschnitt um den Springer, unten bis ins Brett, oben unter der Unterzeile des
  Covers. Farbe, Schärfe und Abdunkeln zum Rand wie beim App-Symbol. Das Cover kommt nicht ins
  Repository, nur das erzeugte Bild.
- **Grund:** Das App-Symbol ist eng um den Springer geschnitten. Im Kreis der Startanimation stand
  sein Sockel deshalb auf dem Rand. Die Startanimation (`ui/komponenten/Startanimation.tsx`) zeigt
  seit 0.2.126 das neue Bild, es liegt im Offline-Speicher wie alle WebP-Dateien.

## Eigene Gegner: Stil im Spinnennetz, Regler auf menschlichen Quantilen (24.10.2026 abends, Teil E, Oberfläche)

- **Umgesetzt nach dem Plan vom 23.10.2026** („Zugwahl der Bots, Plan“, Oberfläche), auf Wunsch des
  Autors vor der Kalibrierung, weil es nur eigene Gegner betrifft. Die vorgefertigten Bots spielen
  unverändert, die laufenden Messungen bleiben gültig.
- **Stil** (`ui/komponenten/Stilnetz.tsx`): Netz mit sechs Speichen über die drei Achsen
  (Königsangriff: Angreifer gegen Positionsspieler, Aktivität: Taktiker gegen Verteidiger,
  Bauernsturm gegen Vereinfachen: Draufgänger gegen Vereinfacher), Mitte „Universell“, dazu eine
  Auswahlliste und ein Satz zum gewählten Stil. Der Stil wirkt wie bei den vorgefertigten Bots
  (`engine/stile.ts`). Der alte Regler −2 bis 2 bleibt für ältere Gegner wirksam, bis sie
  gespeichert werden; das Formular schlägt dann den passenden Stil vor (aggressiv → Angreifer,
  defensiv → Verteidiger).
- **Regler** (`engine/eigenstufen.ts`, `ui/komponenten/ErweiterteFehler.tsx`): je Fehlerart und
  Fleck die Stufen −4 bis 4 wie bei den vorgefertigten Bots (`engine/spielerbereiche.ts`), daraus
  beim Partiebeginn die Gewichte für die geschätzte Wertung des Gegners. Nur angehakte Arten und
  Flecken wirken. Alte freie Gewichte werden in die nächste Stufe übersetzt, sobald der Leser einen
  Regler bewegt.
- **Menschlichkeitsanzeige:** Anteil der Spieler, die in allen Punkten mindestens so auffällig sind,
  als Produkt der Anteile je Stufe (0: alle, ±1: die Hälfte, ±2: ein Zehntel), unter der
  vereinfachenden Annahme unabhängiger Arten. Ab 5 % „menschlich“, ab 0,1 % „ungewöhnlich“, darunter
  „kaum noch menschlich“, eine Stufe über ±2 „unmenschlich“.
- **Geschätzte Stärke:** Die Zahl bleibt die Schätzung aus den Stufen je Phase. Dazu sagt ein Satz,
  ob die Regler den Bot eher stärker oder schwächer machen (geometrisches Mittel der Faktoren ab
  1,25 oder unter 0,8). Eine Zahl für die Verschiebung gäbe es erst mit einer Messung je
  Kombination; eine erfundene Zahl wäre irreführend.
- **Speicher:** zwei neue, freiwillige Felder `stilname` und `reglerstufen` am eigenen Gegner und
  `stilname` an der Partie. Ältere Daten lesen sich unverändert, ein neues Speicherformat war nicht
  nötig.

## Gruppenmodus gemessen (24.10.2026 abends, 0.2.126)

- **Messung:** je Gruppe 16 Partien gegen die eigene und die nächste menschlich spielende Stufe
  (Nm), die Gruppen 8 bis 10 zusätzlich gegen die reinen Stufen 8, 9 und 10, Schnellschach mit der
  Bedenkzeit der Bots. Ausgewertet in derselben gestreckten Leiter wie die Bots
  (`engine/botstaerke.messung.ts`), lokal `buch/arbeit/botelo4/neu-gruppenmodus*/` und
  `bericht-mit-gruppen.md`.
- **Ergebnis** (Streuung ±90 bis ±140): Gruppe 1 346, 2 830, 3 1148, 4 1635, 5 1870, 6 2306, 7 2527,
  8 2733, 9 2796, 10 2773. Die Gruppen 2 bis 8 sind 100 bis 450 Elo stärker als ihr bester Bot, Gruppe 9 etwa 90.
  Gruppe 1 ist schwächer als ihr bester Bot (439), Gruppe 10 schwächer als ihre Bots (2871 bis
  3232): Ganz unten heben sich die häufigen Fehler bei der Abstimmung nicht auf, ganz oben ziehen
  die Bots mit Restfehlern die fast fehlerfreien herunter. Die Gruppen 8 bis 10 liegen innerhalb
  der Messunsicherheit gleichauf.
- **Bot-Zahlen bleiben:** Mit den Gruppenpartien in der Leiter verschieben sich die Bots um im
  Mittel 20 und höchstens 58 Elo. Die veröffentlichten Bot-Zahlen bleiben die ohne Gruppen, weil
  die Kalibrierung von Blitz und Klassisch auf ihnen aufbaut. Die Gruppenzahlen stammen aus dem
  Lauf mit Gruppen.
- **Mehrheitsregel bleibt** (Entscheidung des Autors). Ein Gewicht nach der Stärke der Mitglieder
  würde die Gruppe 10 stärker machen, wäre aber eine neue Regel; das bleibt dem Autor überlassen.

## Eigene Stufe mit den Einstellungen eigener Bots (24.10.2026 spätabends, Wunsch des Autors)

- **Wunsch:** „Eigene Stufe“ bekommt dieselben Einstellungen wie „Eigene Bots“: Stil im
  Spinnennetz, Fehlerarten, blinde Flecken, erweiterter Modus mit Reglern auf Quantilen,
  Fehlerhäufigkeit, Höchstverlust und Menschlichkeitsanzeige (`ui/komponenten/EigeneStufe.tsx`,
  gespeichert in den Spielvorlieben, freiwillige Felder).
- **Befund dabei:** Seit 0.2.117 spielte die eigene Stufe rein (ohne menschliche Zusatzfehler,
  `REINES_PROFIL`), seit 0.2.125 zeigte sie aber die Zahl der Stufe mit Zusatzfehlern („Nm“). Bei
  Stufe 5 stand etwa 1700 da, gespielt wurde etwa 720 (reine Stufe, gemessen). Auch die Wertung
  rechnete mit der falschen Zahl.
- **Entscheidung:** Neue Partien gegen die eigene Stufe spielen wie ein eigener Bot, also mit den
  angehakten Fehlerarten wie Menschen. Mit allen Haken ist das genau die gemessene Stufe „Nm“, die
  Zahl stimmt. Ohne angehakte Fehlerart spielt sie rein, die Zahl ist die der reinen Stufe
  (`engine/reinestufen-daten.ts`, aus derselben Messung). Das gilt auch für eigene Bots ohne
  Fehlerart. Erkennbar sind neue Partien am Stil in der Partie; ältere, noch laufende Partien
  spielen und zählen weiter wie begonnen.
- **Zweiter Fehler:** Die Karten „Fehlerarten“ und „Blinde Flecken“ schrieben selbst in den
  Speicher, der Spielbildschirm überschrieb das beim Partiebeginn mit seiner älteren Kopie. Jetzt
  laufen alle Änderungen über die Vorlieben des Bildschirms und werden zugleich gespeichert.
- **Messungen bleiben gültig:** Die vorgefertigten Bots und die Messstufen spielen unverändert.

## Bots ziehen ohne sichtbare Wartezeit (24.10.2026 spätabends, Klarstellung des Autors)

- **Wunsch:** „Die Uhr soll künstlich runterlaufen, aber die Ausführung des Zugs soll nicht
  künstlich länger dauern.“ Seit 0.2.117 wartete der Bot mit Uhr sichtbar bis zu 2,5 Sekunden
  (in Zeitnot 0,6 Sekunden, ±10 %), weil die Absprache vom 20.10.2026 so verstanden worden war.
- **Seit 0.2.126:** Der Bot zieht, sobald die Engine fertig ist. Seine Uhr wird wie bisher mit der
  simulierten menschlichen Bedenkzeit abgerechnet (`spiel/botzeit.ts`, zieheBotMitUhr), nicht mit
  der echten Rechenzeit. Der Notmodus bleibt: Ein Vorzug kostet echt und auf der Uhr 100 ms.
- **Messungen bleiben gültig:** Die Messläufe rechnen die Uhr ohnehin simuliert und warteten nie.

## 24.10.2026 nachts – R26 Abschluss der Arbeitsliste (P1, Opus)

- P1-B (vorläufige Tabelle für den Vergleich der Zugklassen) ist erledigt: Seit 0.2.125 kommen
  Übliches und Zonen aus den Spielerprofilen des Bot-Chats; nur brillant, stark und Buchzug
  bleiben geschätzt. Aus AUFGABEN_AUTOR gestrichen.
- Überholte Hinweise in AUFGABEN_AUTOR angepasst („folgt mit dem Bot-Chat“, „Symbol beim Spielen
  nach der Kalibrierung“, Zahl der Touren).
- P8 Teil B in 0.2.127 umgesetzt (Touren Spielen und Partie), P6 abgeschlossen (R25).

## Praxisbuch: Bots eröffnen wie Menschen ihrer Stärke (24./25.10.2026 nachts, Wunsch des Autors, 0.2.128)

- **Wunsch:** Das Buch behandelt nur Anfänger-Eröffnungen. Höhere Bots wirken wenig menschlich,
  wenn sie sich darauf beschränken oder wie eine Engine eröffnen.
- **Daten:** Ein ganzer Monat der Lichess-Datenbank (September 2026, gewertete Blitz-,
  Schnellschach- und Klassisch-Partien, CC0) als Datenstrom gezählt (C++-Zähler, lokal
  `buch/arbeit/praxisbuch/`). Je Zugfolge der ersten 20 Halbzüge ab der Grundstellung und je
  Zelle (Zeitklasse, 200er-Band 400 bis 2800 der ziehenden Seite) die Züge mit ihrer Anzahl.
  Zugfolgen statt Stellungen, weil das Rechnen jeder Stellung bei 90 Millionen Partien zu lange
  dauerte; Zugumstellungen verkürzen das Buch etwas. Ins Buch kommen Züge ab 2 % einer Stelle;
  der Rest ist das Buchende. Datei `app/public/daten/praxisbuch.json`, höchstens etwa 3 MB.
- **Zugwahl** (`engine/praxisbuch.ts`, `ui/komponenten/botzug.ts`): Solange die Partie aus der
  Grundstellung im Buch ist, zieht der Bot nach der Häufigkeit seiner Zelle (Zeitklasse der Uhr,
  Band nach der Wertung seiner Eröffnungsstufe). Mit dem Anteil der seltenen Züge verlässt er das
  Buch, wie ein Mensch, der hier eigene Wege geht; dann übernimmt das Wahlmodell. Buchtiefe:
  Theoretiker 20 Halbzüge, Hektiker 10, sonst 16. Dünne Zellen greifen auf Schnellschach und die
  Nachbarbänder zurück. Spaß-Bots spielen kein Buch.
- **Eröffnung festlegen:** Vorgabe „wie Menschen dieser Stärke“. Dazu die 120 häufigsten
  benannten Eröffnungen der Lichess-Liste, denen der Bot folgt, solange der Leser ihre Züge spielt.
  „ohne Buch“ (bisherige Vorgabe) und die Eröffnungen des Buches bleiben. Nach einer
  Buch-Eröffnung geht es mit dem Praxisbuch weiter statt mit der Engine.
- **Messung:** Die Messläufe ziehen mit demselben Buch (`engine/messbuch.testhilfe.ts`); „!“ am
  Kürzel misst ohne Buch. Die Kalibrierung von Blitz und Klassisch misst damit automatisch mit
  dem Praxisbuch.

## Stil-Mischung eigener Bots (24./25.10.2026 nachts, Wünsche des Autors, 0.2.128)

- **Wünsche:** Im Spinnennetz Zwischenwerte wählen können, dann vier Stufen 50, 75, 100 und
  125 % (über das Normalmaß hinaus), und mehrere Stile zugleich, nur nicht die beiden Enden einer
  Achse.
- **Umsetzung** (`engine/stile.ts`, `ui/komponenten/Stilnetz.tsx`): `stilmix` je Stil in Prozent,
  je Achse höchstens einer; die Verschiebungen addieren sich (Summe der Stile mal Prozent / 100).
  100 % ist die geeichte Stärke (etwa anderthalb Standardabweichungen der Spieler). Ein Tipp auf
  das Gegenüber ersetzt den Stil der Achse, derselbe Punkt nimmt ihn weg, die Mitte leert alles.
  Je Achse eine Auswahlliste. Gilt für eigene Bots und die eigene Stufe; `stilname` bleibt als
  erster Stil gespeichert, damit ältere Versionen etwas Sinnvolles lesen.
- **Vorgefertigte Bots** behalten ihren einen Stil mit 100 %.
- **Nebenbei behoben:** `skripte/gruppen-bots.mjs` las Bot-Zahlen nur mit Anführungszeichen
  und sortierte deshalb viele Bots falsch ein; die Kalibrier-Chats hätten falsche Gruppen gemessen.

## Prüfmessung Praxisbuch: Zahlen bleiben (25.10.2026 nachts, 0.2.128)

- **Messung:** Derselbe Spieler mit Praxisbuch gegen sich ohne Buch, je 20 Partien
  Schnellschach: 20 Bots (zwei je Gruppe, darunter Theoretiker und Hektiker) und die Stufen 1m bis
  9m, zusammen 580 Partien (lokal `buch/arbeit/praxisbuch/pruefung/`,
  `pruefung_auswerten.py`).
- **Ergebnis:** Mit Buch im Mittel +10 ± 12 Elo (alle Partien zusammen 298 aus 580, +10 Elo);
  einzelne Paarungen streuen zwischen −108 und +127, wie bei 20 Partien zu erwarten.
- **Entscheidung (Regel aus dem Auftrag des Autors):** Unter 50 Elo mittlerer Verschiebung bleiben
  alle gemessenen Zahlen der Bots, Stufen und Gruppen. Eine Neumessung ist nicht nötig. Die
  Kalibrierung von Blitz und Klassisch misst ab 0.2.128 mit dem Buch.

## Spielen neu geordnet DS38 bis DS45 (25.10.2026, Opus, Zweig `spielen-neu`, Version 0.2.129)

Wunsch des Autors (24.10.2026): Wie bei eigenen Bots und der eigenen Stufe Fehler und blinde
Flecken gewählt und stufenweise eingestellt werden, sei weder bedienfreundlich noch optisch
ansprechend; dazu alle übrigen unstimmigen Stellen. Vorschläge mit HTML-Vorschauen (Artifact),
Freigabe „Alles ja“, mit der Bitte, den neuen Stand 0.2.128 zu berücksichtigen.

- DS38 Fehlerprofil statt Abhakliste und erweitertem Modus mit gesperrten Reglern: je Fehlerart
  ein Stufenschalter „aus“ bis „sehr oft“ (Quantile −2 bis 2; mit Haken auch −4 bis 4,
  gestreift), Gruppen mit Zeichen, Vorlagen, Höchstverlust als Chips, blinde Flecken als Kacheln
  mit Weiterschalten. Neu gegenüber der Vorschau: die Vorlage „Keine Fehler“, weil die Liste
  „Keine erlauben“ wegfiel und die reine Stufe sonst nur über 18 Tipps erreichbar wäre.
  Logik in `ui/komponenten/fehlerprofil.ts` (mit Tests), Oberfläche in `Fehlerprofil.tsx` und
  `Fleckenkacheln.tsx`. Das Datenformat im Speicher bleibt (fehlerarten, blindeFlecken,
  reglerstufen, hoechstverlust); alte Gewichte fallen beim ersten Ändern weg wie bisher.
- DS39 Vier Reiter Stärke, Stil, Fehler, Flecken für eigene Stufe und eigene Bots
  (`GegnerReiter.tsx`). Angepasst an 0.2.128: Das neue Spinnennetz mit seinen Auswahllisten
  bleibt (Bedienung ohne Ziehen, Bildschirmleser); nur die Erklärung kommt hinter das „?“, die
  Listen bekommen den Rahmen der App.
- DS40 Feste Startleiste mit Gegner, Farbe, Bedenkzeit, Wertung und „Partie beginnen“
  (`Startleiste.tsx`); der Knopf steht nicht mehr in der Gegnerwahl.
- DS41 Bedenkzeit als Kacheln (`ZeitWahl.tsx`), vier je Zeile; „ohne Uhr“ nur außerhalb der
  Grundstellung wie seit R51.
- DS42 Partieuhr mit Porträt, Name und Stufenmarke des Gegners, Farbkreis auf beiden Seiten.
- DS43 Stufe 9 schwarz mit Goldring, Stufe 10 gold.
- DS44 Einstellungen mit sichtbarem Seitentitel (hebt die Entscheidung nach dem Test von 0.2.30
  auf); die Karte heißt „Darstellung und Training“.
- DS45 Rand der gestrichelten Chips in `--rand-bedien`; Überschrift im Formular eigener Bots.

## Zahlen je Zeitklasse: Blitz und Klassisch gemessen (25.10.2026 nachts, Bot-Chat, 0.2.130)

R51 (drei Zahlen je Bot wie bei Lichess) ist umgesetzt. Zehn Gruppen-Chats haben nach
`docs/MESSUNG_ZEITKLASSEN.md` je Gruppe die Nm-Anker (40 Partien gegen sich selbst, Tiefe 18) und
die acht Bots gegen die zwei nächsten Nm-Stufen gespielt, einmal mit 3 + 2 und einmal mit 30 + 20.
Der Koordinierungschat hat die Zweige `messung-blitz-N` und `messung-klassisch-N` mit
`app/skripte/sammle-zeitklasse.sh` zusammengelegt und mit `engine/botstaerke.messung.ts`
(BOTELO_TEMPO blitz bzw. classical) ausgewertet. Ergebnis: `engine/botstaerke-daten-blitz.ts` und
`engine/botstaerke-daten-klassisch.ts`, eingebunden in `engine/botstaerke-zeitklassen.ts`.

- **Stufen (Blitz / Schnellschach / Klassisch):** 1: 635/747/1007 · 2: 961/946/1220 ·
  3: 1264/1242/1482 · 4: 1516/1456/1564 · 5: 1750/1696/1677 · 6: 2009/1906/1758 ·
  7: 2206/2108/2006 · 8: 2353/2291/2116 · 9: 2361/2388/2198 · 10: 3323/3296/2775.
- **Plausibilität:** Leiter und Anker stimmen in Klassisch auf ±50 Elo, in Blitz auf ±145. Blitz
  liegt nah an Schnellschach (Bots im Mittel −176, Streuung 189). Klassisch ist gestaucht, unten
  etwa +300, oben bis −650: Die Lichess-Klassisch-Wertung beginnt unten höher und reicht oben
  selten über 2600. Oberhalb von 2200 (gesättigte Anker) ist die Unsicherheit groß (±250 bis ±300).
- **Lichess-Untergrenze 400 (Empfehlung, umgesetzt nach Regel 9):** Tom, Marie, Oma Erna, Luis,
  Clara und Onkel Bernd verlieren in Blitz fast jede Partie gegen Stufe 1; die Leiter setzte sie
  auf −231 bis 97. Messbar ist nur „schwächer als Stufe 1“, auf der Lichess-Skala heißt das 400
  (Lichess vergibt keine Zahl darunter). Die Zahlen je Zeitklasse beginnen deshalb bei 400
  (`zeitklassendatei`, `LICHESS_UNTERGRENZE`); die Schnellschach-Zahlen bleiben, wie sie sind.
- **Spaß-Bots:** gehören keiner Gruppe an, wurden nicht je Zeitklasse gemessen und behalten in
  allen Zeitklassen die Schnellschach-Zahl.
- **Gruppe 6:** Ihr Chat lief auf der Bewertung einer Blitz-Ankerpartie fest (Partie 20 von
  6m gegen 6m, am Ende mehrere Damen gegen den König; die Tiefe-18-Bewertung der WASM-Engine kam
  nach über einer Stunde nicht zum Ende, in zwei Umgebungen gleich). Der Koordinierungschat hat
  Blitz und Klassisch der Gruppe 6 lokal nachgemessen und diese eine Partie aus den Ankern
  gelassen (39 statt 40 Partien, 72 statt 80 Seiten). Gruppe 7 hat Blitz versehentlich auf `main`
  gemessen; das war derselbe Stand wie `menschliche-bots` (aac4d99), die Daten gelten.
- **Anzeige:** Gegnerwahl (Kacheln, Sprechblase, Bereich je Stufe, Reihenfolge) und die
  Sortierung der Partienliste nehmen die Zahl der Zeitklasse der gewählten Uhr; die feste
  Gegnerwertung (`gegnerstaerke`) tat das schon seit 0.2.125. Die Stufen bleiben nach der
  Schnellschach-Zahl eingeteilt; in Blitz und Klassisch können sich benachbarte Bereiche
  überschneiden.

## Nutzungsprüfung DS46 bis DS57, V1 bis V9, T1 bis T4 (25.10.2026, Opus, Zweig `nutzungspruefung`, Version 0.2.131)

Auftrag des Autors (25.10.2026): App und Website nach den Gruppen Design, Bedienung,
Verlässlichkeit und Tempo sowie Vertrauen und Recht prüfen (Barrierefreiheit und Lernen als
eigene Gruppen zurückgestellt). Grundlage: Fotos aller Bildschirme bei 360 Pixeln hell und
dunkel, Tastaturdurchlauf, Messung von Tippflächen, Schriftgrößen und Fokus unter festen
Leisten, Netzanfragen, Ladezeiten gedrosselt (CPU 4×, 1,6 Mbit/s). Vorschläge mit Vorher-Nachher-
Bildern der echten App im privaten Artifact „Nutzungsprüfung“
<https://claude.ai/artifact/SkEbgyv893PKa1vHt5PV2u> (nicht im Repository, weil es Abbildungen
zeigt). Freigabe: alles ja außer T5 (keine Erklärung zur Barrierefreiheit).

- DS46 Beta-Hinweis der Website in Creme (vorher Grau auf Navy, etwa 1,9 : 1).
- DS47 Website: „App öffnen“ und „Installieren“ im Kopf der Startseite.
- DS48 Partie: Untertitel einzeilig, Züge in einer rollenden Zeile neben den Zugknöpfen,
  Abstände 8 Pixel; beide Uhren und das Brett bei 360 × 740 auf einem Schirm.
- DS49 Zugliste der Abbildungen höchstens zwei Zeilen (4.3em); die Brettsymbole sind sichtbar.
- DS50 Startleiste: „Weiß · 10 + 0 · gewertet“, Knopf „Beginnen“ (Bildschirmleser „Partie
  beginnen“); neue Funktion `uhrnameKurz`.
- DS51 Spielen: Gegner zuerst, dann Farbe, Bedenkzeit und Hilfen (hebt die Reihenfolge vom
  19.10.2026 auf, weil die Startleiste sie zusammenfasst), Ausgangsstellung am Ende ohne Brett;
  ab Abbildung oder eigener Stellung oben mit Brett. Karte in `Startstellung.tsx`, Rundgang
  in derselben Reihenfolge.
- DS52 `scroll-padding-bottom` auf `html` (Leiste unten, auf Spielen auch Startleiste), im
  Querformat mit Schiene nur der sichere Rand (WCAG 2.4.11).
- DS53 Fortschrittsringe in einer Reihe, Wort darunter.
- DS54 Website-Link im Training als Zeichen in der Kapitelzeile.
- DS55 Wörter unter vier Symbolen der Leiste, Zahnrad ohne (nimmt den Wunsch von 0.2.116
  zurück).
- DS56 Zonenwörter in „Deine Züge“ in der Stufe „fein“ (13 px) statt 0.6rem.
- DS57 Manifest `orientation: "any"` (vorher „portrait“, das Querformat aus DS2 fehlte in der
  installierten Android-App).
- T1 Datenschutzerklärung: „Fehler melden“ sendet an uns (Satz „Die App selbst verschickt
  nichts“ war seit R57 falsch).
- T2 Links „Datenschutz“ und „Impressum“ am Ende von „Über die App“, Link im Meldeformular.
- T3 „Was wird gesendet?“ mit den echten Werten unter dem voreingestellten Häkchen; Segmente
  brechen um statt „…“.
- T4 HSTS (ein Jahr, ohne Unterdomains) in `public/_headers`; Content Security Policy aus
  `src/startseite/csp.ts`, beim Bauen mit den Prüfsummen der eingebetteten Skripte an
  `dist/_headers` angehängt, live zunächst als Report-Only. `tests/e2e/csp.spec.ts` erzwingt
  sie probeweise (Startseite, App, Engine, Partie: kein Verstoß; ohne Prüfsummen meldet derselbe
  Test drei). Scharf schalten: frühestens 1.11.2026, wenn bis dahin kein Fehler gemeldet ist;
  dann im Plugin `sicherheitsregelDatei` „-Report-Only“ streichen.

## Ergänzungen des Autors zur Nutzungsprüfung (25.10.2026, Opus, Version 0.2.131)

- **Marken der Zugklassen an Zugliste und Brett** (Wunsch: Symbole wie in „Deine Züge“ auch in
  der Zugnavigation und beim Nachspielen an der gezogenen Figur): `Partiezuege.tsx` zeigt die
  Marke statt des Zeichens als Text (Name für Bildschirmleser „2. g4, Patzer (??)“),
  `Zugmarke.tsx`/`zugmarke.ts` setzen sie oben rechts ans Zielfeld; `Brettbereich` nimmt die
  Überlagerung auch als Funktion der Drehung. Stile in `zugmarken.css`.
- **„Deine Züge“ deutlicher** (Frage nach Expertise: andere Farben für Bereiche oder Balken?).
  Empfehlung und Umsetzung: Balken in der Farbe des Urteils statt der Klasse (grün, ruhig grau,
  rot), Zonen schwach in denselben Farben getönt, schwache Zeile mit Warnzeichen, fettem Urteil
  und leichtem roten Grund. Warum so: Ein Bullet-Diagramm liest man am Ende des Balkens; die
  Klassenfarbe sagte nur „welche Klasse“, die steht schon an der Marke. Bedeutung nie nur über
  Farbe (Zeichen und Wort dazu).
- **Porträt in der Sprechblase** 96 statt 64 Pixel, Blase mit Zipfel.
- **Fehlerprofil als Säulen** (Wunsch: aufgeräumter, ähnlich den Balken in „Deine Züge“):
  „aus“ als Zeichen, steigende Säulen wie eine Lautstärkeanzeige, gefüllt bis zur Wahl, Strich
  unter „normal“, Wort rechts; jede Säule bleibt Optionsfeld mit dem Wort als Namen. Arten nur
  mit „aus | an“ behalten einen schmalen Schalter. Datenformat unverändert.

## Verlässlichkeit V1 bis V9 (25.10.2026, Opus mit einem Hilfsagenten, Version 0.2.131)

Teil der Nutzungsprüfung, vom Autor freigegeben.

- V1 „Offline bereit“ erst nach `navigator.serviceWorker.ready` und Zustand „activated“
  (`app/workerbereit.ts`); bis dahin höchstens 99 %. vite-plugin-pwa meldet „offline ready“
  schon beim Zustand „installed“; wer da ohne Netz neu lud, sah die Fehlerseite des Browsers.
- V2 Navigationsstapel als Merker `svga.stapel` (Format 1, Zeitstempel, `app/stapelMerker.ts`):
  beim Start wiederhergestellt, wenn jünger als 24 Stunden und jede Ansicht gültig; Sprungziele
  in der Adresse haben Vorrang. Partien gegen die Engine öffnen nicht direkt (die Uhr liefe
  sonst los), der Stapel endet davor auf „Spielen“ mit „Weiterspielen“. Die Zurück-Taste
  übernimmt den vorhandenen Wächtereintrag der Browsergeschichte. Folge: Ein Sprachwechsel
  bleibt auf dem Bildschirm. `starteImBrowser` löscht den Merker vor jedem Test (opt-in mit
  `weitermachen: true`). Nur ein Merker, das Format der Nutzerdaten bleibt 5.
- V3 Beim Sichtbarwerden höchstens stündlich `registration.update()` (`updateFaellig`); aktiv
  wird ein Update weiter nur nach Tipp. Text `startseite.beta` angepasst.
- V7 Fehlergrenze je Bildschirm (`app/Bildschirmgrenze.tsx`, Absturzbericht in
  `Absturzbericht.tsx` für beide Grenzen): Leiste bleibt, „Zurück“, „Fehler melden“, Technik
  eingeklappt, Geräteangaben nur mit Häkchen. Zurückgesetzt wird über einen Schlüssel des
  Bildschirms in `getDerivedStateFromProps` statt eines React-`key`, der jeden Bildschirm bei
  jedem Schritt neu aufbauen würde (gewähltes Werkzeug ginge verloren).
- V8 `persist()` bei jedem Start, solange `persisted()` falsch ist; Laden wartet nicht darauf.
- V9 Warteschlange für Meldungen ohne Netz (`app/meldeschlange.ts`, `svga.meldungen.warten`,
  höchstens zehn, höchstens 30 Tage); gesendet bei „online“, beim Start und nach jeder
  erfolgreichen Meldung; 4xx und 5xx kommen nicht in die Schlange. „Alle Daten löschen“ leert sie.
  Satz in der Datenschutzerklärung ergänzt.

## Tempo V4 bis V6 (25.10.2026, Opus mit einem Hilfsagenten, Version 0.2.131)

Gemessen mit Pixel 7, CPU 4× gedrosselt, Seiten zusätzlich 1,6 Mbit/s und 150 ms; vorher ein
Build von 8b2c3ae unter denselben Bedingungen.

- V4 Der Service Worker teilt die Dateiliste in Kern und Sprachpakete (`src/sw/dateiliste.ts`,
  `src/sw/sprachpakete.ts`); vorab lädt nur der Kern, `daten/en/**` und `en.json` beim ersten
  Abruf, mit Revision (deshalb nicht `globIgnores`, sonst bliebe Englisch nach Updates veraltet).
  `en.json` per `import()` (`i18n/sprachpaket-en.ts`). Wechsel auf Englisch ohne Netz und ohne
  Paket: Meldung, die App bleibt deutsch; mit Netz lädt das ganze Paket im Hintergrund.
  Vorab: 335 Dateien mit 20,9 MB → 313 Dateien mit 15,2 MB; Sprachbaustein 187 → 96 KB gzip.
  Die Entscheidung vom 15.10.2026 (die Startseite lädt schon vorab) bleibt.
- V5 Ursache war nicht der Fortschritt (sein `hidden` wirkte wegen `display: flex` nie), sondern
  die Anleitung je Gerät, die erst `startseite.ts` einblendete. Jetzt wählt ein kleines Skript
  im Installationsteil sie vor dem ersten Zeichnen (Test gegen `anleitungFuer` für 8
  Browserkennungen), der Fortschritt hält seinen Platz mit `visibility`, zwei Schriftschnitte
  per preload, die wechselnden Texte setzt der Build ins HTML. CLS auf / 0,092 → 0, auf
  /installieren/ 0,032 → 0; JavaScript der Startseite 625 KB → 12 KB; FCP etwa 80 ms später
  (Preload). Keine Ersatzschrift mit size-adjust: nur gegen Liberation Sans abstimmbar.
- V6 Eröffnungsindex einmal gebaut und gemerkt (`schach/eroeffnungsindexVorrat.ts`, erstes Mal
  nach dem nächsten Bild), Spielstufe in `usePartie` nur bei neuer Stellung und Engine am Zug,
  Leiste markiert sofort und wechselt im nächsten Bild, „Beginnen“ sofort gedrückt
  (`aria-busy`). `startTransition` verworfen (60 ms später). INP Spielen 152 → 24 ms, Partie
  beginnen 304 → 24 ms; das erste Zeichnen von Spielen bleibt etwa 160 ms.
- Die Sprachwahl steht in `SprachWahl.tsx` (EinstellungenKarte war fast 400 Zeilen).

## Korrekturen des Autors zur Nutzungsprüfung (25.10.2026, Opus, Version 0.2.133)

- Gemeint war das Porträt in der laufenden Partie (`.partie-gegnerzeile`), nicht in der
  Sprechblase: dort jetzt 80 statt 48 Pixel, die Sprechblase zurück auf 64 (Zipfel bleibt).
- Zugmarke am Brett 23 statt 26 Pixel.
- PGN-Knöpfe ganz oben in der Auswertung; nebeneinander brachen die Beschriftungen bei 360 Pixeln
  um, deshalb untereinander.
- Spinnennetz: Ringe in `--linie-stark`, im Dunkelmodus Ringe und Speichen #6b7fa3.

## Profil statt Zahnrad, Einstellungen neu geordnet (25.10.2026, Opus, Version 0.2.134)

Wunsch des Autors (25.10.2026 spät): unten rechts ein Profil mit Wort, darin oben ein Knopf zu den
Einstellungen, Wertung, Fortschritt und die Partienliste (bisher auf „Spielen“); die Reiter der
Einstellungen prüfen, umsortieren, umbenennen.

- Leiste: `CircleUserRound` mit „Profil“; jetzt tragen alle fünf Knöpfe ihr Wort. Der Bereich
  heißt intern weiter „ich“ (Navigation, Speicher, Merker unverändert). Drei Sekunden auf
  „Profil“ öffnen weiter die Aufgabenseite.
- Profil (`Ich.tsx`): Knopf „Einstellungen“, Wertungskurve, Fortschrittsringe, Partienliste mit
  Filter und PGN-Einlesen. Warum die Partien dorthin: Wer „Spielen“ antippt, will eine Partie
  beginnen; die Liste ist Rückschau und gehört zu Wertung und Fortschritt.
- Einstellungen als eigene Ansicht `einstellungen` im Stapel (`Einstellungen.tsx`, mit
  „‹ Profil“): Reiterkarte, Daten auf diesem Gerät, Über die App. Die Überschrift „Darstellung
  und Training“ (DS44) entfällt, weil die Seite selbst „Einstellungen“ heißt und die Reiter
  direkt darunter stehen.
- Reiter vorher Brett, Figuren, Ton, Anzeige, Training; jetzt Brett (Farben, Figuren,
  Koordinaten), Bedienung (Wischen, Zuganimation, Startanimation, Ton), Anzeige (Nachtmodus,
  Schriftgröße, Sprache), Training, Hilfe (Toursymbol und Rundgang, Erklärungen). Warum: Nach
  Fragen gruppiert, die ein Leser stellt („wie sieht das Brett aus“, „wie bediene ich es“, „wie
  groß und welche Sprache“, „wie übe ich“, „wo bekomme ich Hilfe“), statt einzelner kleiner
  Reiter für Figuren und Ton. Zuerst geöffnet bleibt „Training“. Datenformat unverändert.
- Rundgänge: `ich` erklärt jetzt das Profil, neu `einstellungen` für die Reiter, Daten und Über
  die App; der Rundgang „Spielen“ verliert die Partienliste. Texte zu Speicherfehlern nennen
  „Profil › Einstellungen“ statt „Zahnrad“.

## Theoriezug statt Buchzug (25.10.2026, Opus mit einem Hilfsagenten, Version 0.2.135)

Wunsch des Autors (25.10.2026): „Theoriezug“ wie „Book“ bei chess.com, aus der Lichess-Liste und
den Eröffnungen und Gambits des Buches; im Rückblick „Teil einer Eröffnung“ oder „eines Gambits“,
das Wort klappt höchstens fünf Namen auf, der Rest wird abgeschnitten.

- Regel (`schach/theorie.ts`): Ein Zug ist Theoriezug, wenn er (1) auf der Zugfolge einer
  benannten Eröffnung der Lichess-Liste liegt (auch über unbenannte Zwischenstellungen, nach
  Zugumstellung ab der nächsten benannten Stellung) oder als Buchzug in Kapitel 2 und 3 steht
  (ohne die mit „?“ markierten), (2) alle Züge davor Theoriezüge waren (chess.com: „out of
  book“; sonst zählte eine zufällig wieder erreichte Theoriestellung im Mittelspiel) und (3) er
  nicht 0,5 Bauern oder mehr verliert (Bongcloud 2. Ke2 bleibt „ungenau“).
- Die Lichess-Liste trägt ihre Zugfolgen (Schema 2, `pipeline/eroeffnungsliste.py`, etwa 165 KB
  je Sprache mehr; die ersten drei Felder unverändert). Die App baut daraus einmal einen Zugbaum
  ohne Schachregeln (etwa 5 ms); eine Menge aller Stellungsschlüssel kostete 80 bis 200 ms.
  Dafür fehlen Zugumstellungen in unbenannte Zwischenstellungen (etwa 2 % der Theoriezüge).
- Namen: zuerst die des Buches, dann Lichess (die Stellung selbst oder die letzte benannte davor,
  dann die kürzesten Fortsetzungen, bei gleicher Länge die mit mehr Varianten). „Gambit“ nur, wenn
  die Eröffnung der Partie selbst eines ist (Lichess-Name der Stellung oder eindeutiger Buchname);
  wörtlich wäre schon 1. e4 „Teil eines Gambits“. Damengambit und Abgelehntes Damengambit zählen
  nach ihrem Namen als Gambit. Varianten bleiben englisch (R12), Familien deutsch.
- Interner Schlüssel bleibt `"buch"`; gespeichert wird die Klasse nirgends. Genauigkeit,
  Elo-Modell, Wertung und Bots sehen die Klasse nicht.
- Üblicher Anteil in „Deine Züge“: nachgemessen an 60 000 Lichess-Partien (September 2026, ohne
  Bullet): neue Regel 6,9 bis 8,0 % der Züge einer Seite, der alte Buchindex 3,7 bis 4,7 %. Die
  Schätzung (6, 8, 10, 11 % bei 800, 1200, 1600, 2000) ersetzt durch die Schnellschach-Werte
  7,5, 7,6, 7,5, 8,0 % (Empfehlung nach Regel 9, N949). Messskript nur lokal.

## Fehlerprofil vereinfacht, Fehler und Flecken als Spinnennetz (25.10.2026, Opus, Version 0.2.136)

Auftrag „Variante A“ aus dem Koordinierungschat (vom Autor am 25.10.2026 freigegeben) und die
Netz-Vorschau (privates Artifact „Fehler und Flecken als Spinnennetz“, E1 bis E4 freigegeben).

- Begründung (Koordinierungschat): Zuverlässigkeit je Fehlerart und Fleck nach Split-Half mit
  Spearman-Brown an etwa 1 280 Spielerprofilen und Trennbarkeit der fünf Stufen je Elo-Band.
  Mehrere Regler messen kaum ein echtes Merkmal von Spielern oder stecken in anderen; die Flecken
  einzeln sind zu schwach, als Gruppen tragen sie.
- Regler (`ui/komponenten/fehlergruppen.ts`): figurHaengen, drohungIgnoriert, taktikUebersehen,
  schlagVerpasst (neu), koenigMitte, koenigsschild, bauernvorstoss, bauernzugOhneNot (neu),
  „Eröffnungsfehler“ für verfruehteDame + tempoverlust + bauernraub. Ohne Regler: schlagreflex,
  bauerEingestellt, falscherAbtausch, koenigPassiv, koenigszugOhneNot, ungenau; pattGesetzt als
  Schalter „Setzt nie Patt“. `REGLERARTEN` (engine/eigenstufen.ts) kennt dafür auch
  schlagVerpasst und bauernzugOhneNot (Quantile lagen schon vor); die gestrichenen bleiben dort,
  damit gespeicherte Werte bis zum Speichern wirken.
- Netz (E1, E2): fünf Achsen Figuren (Figur hängen, Drohung), Taktik (Taktik, Schlag verpasst),
  König (Mitte, Schild), Bauernzüge (Vorstoß, ohne Not), Eröffnung (Eröffnungsfehler). Eine Achse
  schreibt ihren Wert in alle Mitglieder und zeigt den gerundeten Mittelwert der eingeschalteten.
  Feinregler hinter einem Haken; dann sind Netz, Vorlagen und Höchstverlust gesperrt. Die
  Feinregler beginnen offen, wenn das Profil nicht ins Netz passt (Achse uneinheitlich,
  Höchstverluste verschieden, Häufigkeit nicht 100 %, unmenschliche Stufe). Fehlerhäufigkeit und
  „unmenschliche Werte“ stehen seitdem bei den Feinreglern.
- Ein Höchstverlust für alle Fehler (E3), im Feinmodus je Regler.
- Flecken nur als Netz (E4), fünf Gruppen: ruhig; bauer; rueckzug + springer; diagonale + turm +
  dame + roentgen; zwischenzug + abzug + grundreihe. Die Fehlervorlagen ändern die Flecken nicht
  mehr (vorher schaltete „Taktisch blind“ drei Flecken ein); die Flecken haben eigene Vorlagen.
- Speicherweg: Format unverändert, keine Migration. Gestrichene Arten mit gespeicherter Stufe,
  altem Gewicht, Höchstverlust oder abweichendem An/Aus wirken weiter, bis der Leser speichert
  (eigene Bots) oder im Fehler- oder Fleckenreiter etwas ändert (eigene Stufe); dann werden sie
  neutral (`neutralisiert`: ohne Stufe, Gewicht und Höchstverlust; an genau dann, wenn ein Regler
  an ist). Ein Satz weist vorher darauf hin. Test mit drei gespeicherten Gegnern aus 0.2.117 bis
  0.2.134 (`speicher/testdaten/alteGegner*.json`): wirksame Gewichte gleich wie in 0.2.134.
- Fertige Bots: CHARAKTERE unverändert (Variante B später mit Nachmessung). Kein Bildschirm zeigt
  ihr Fehlerprofil als Regler; die Beschreibungen nennen gestrichene Arten weiter in Worten.
  `engine/vorgefertigteUnveraendert.test.ts` vergleicht faktorenAus bei fünf Wertungen,
  menschenwerteAus und hatZusatzfehler aller 82 Bots mit 0.2.134.
- `hatZusatzfehler` prüft alle Fehlerarten außer „ungenau“ (vorher nur die zwölf mit
  Gelegenheitsdaten): Ein eigener Gegner mit nur „Schlag verpasst“ oder „Patt“ bekam vorher kein
  Wahlmodell. Für die fertigen Bots ändert sich nichts (geprüft).
- Nicht Teil: „ungenau“ im Spiel, gezielte Suche nach bauernzugOhneNot, koenigszugOhneNot,
  bauerEingestellt, CHARAKTERE neu zuordnen.

## Bots als ein Mensch mit drei Wertungen (25.10.2026, Bot-Chat, Version 0.2.137)

Ersetzt die gemessenen Blitz- und Klassisch-Zahlen aus 0.2.130 (Abschnitt „Zahlen je Zeitklasse:
Blitz und Klassisch gemessen“). Fragen des Autors: Sollte nicht Blitz < Schnell < Klassisch
gelten? Verhalten sich die Bots beim Wechsel der Bedenkzeit wie ein einzelner Mensch?

- **Befund 1 (Lichess):** Je Spieler unterscheiden sich die drei Wertungen deutlich. Blitz liegt
  in jedem Band im Median 45 bis 180 unter Schnellschach (bei 61 bis 88 % der Spieler darunter),
  Klassisch unten 200 bis 230 darüber, ab etwa 1900 im Median etwas darunter.
- **Befund 2 (Bots):** Wahlmodell, Zeitnot, Bedenkzeit und Praxisbuch sind an Lichess-Partien
  nach der Wertung _in der jeweiligen Zeitklasse_ geeicht. Die Bots übergaben in jeder Zeitklasse
  dieselbe Zahl und spielten in Blitz deshalb wie ein stärkerer Mensch; die direkte Messung aus
  0.2.130 bestätigte das (Blitz-Zahlen so hoch wie Schnellschach).
- **Umsetzung:** `engine/zeitklassenabstand.ts` rechnet die Schnellschach-Zahl in die Zahl
  desselben Menschen in Blitz und Klassisch um. Der Bot übergibt sie an Wahlmodell und Zeitnot
  (`engine/zugwahl.ts`, `engine/gruppenwahl.ts`), Bedenkzeit (`spiel/botzeit.ts`) und Praxisbuch
  (`ui/komponenten/botzug.ts`, Messlauf genauso); Anzeige und Wertung rechnen mit derselben
  Umrechnung (`engine/botstaerke.ts`, auch Gruppen, eigene Stufe und eigene Bots). Die gemessenen
  Tabellen entfallen, die Untergrenze 400 ebenso (sonst stünde Tom in Blitz gleich hoch wie in
  Schnellschach).
- **Stichprobe (Wünsche des Autors):** 871 364 Lichess-Profile aus den Monaten März bis September
  2026 (Spieler aus Klassisch-Partien vollständig, aus Schnellschach-Partien je Band nach Bedarf).
  Gezählt sind Spieler mit mindestens 20 Partien und fester Wertung in beiden Zeitklassen,
  eingeteilt nach dem Mittel beider Wertungen, gewichtet mit dem Verhältnis der Partienzahlen
  (kleinere durch größere). Ziel 10 000 je Band: für Blitz erreicht von 800 bis 2399, für
  Klassisch nicht (Mitte bis 9349; mehr Spieler mit fester Klassisch-Wertung gibt es bei Lichess
  nicht). Skripte und Bericht lokal in `buch/arbeit/wertungsvergleich/`.
- **Gewählte Werte:** Median, in Blitz höchstens −50, in Klassisch mindestens +50 (Wunsch des
  Autors: Blitz < Schnellschach < Klassisch für jeden Bot, Werte aus der 95-%-Spanne). Jeder
  gewählte Wert liegt in der Spanne der mittleren 95 % der Spieler seines Bandes. Über 1900 liegt
  Klassisch damit am oberen Rand dessen, was Spieler typisch zeigen (über 2200 haben drei von vier
  Spielern Klassisch unter Schnellschach).

| Band      | Blitz: Spieler / Median / 95 % / App | Klassisch: Spieler / Median / 95 % / App |
| --------- | ------------------------------------ | ---------------------------------------- |
| 400–599   | 1468 / −45 / −266 bis +212 / −50     | 20 / – / – / Randwert +213               |
| 600–799   | 8113 / −79 / −332 bis +293 / −79     | 354 / +213 / −23 bis +472 / +213         |
| 800–999   | 16 916 / −108 / −395 bis +304 / −108 | 1849 / +229 / −67 bis +558 / +229        |
| 1000–1199 | 24 000 / −157 / −455 bis +265 / −157 | 4391 / +232 / −77 bis +594 / +232        |
| 1200–1399 | 28 427 / −180 / −483 bis +182 / −180 | 6974 / +208 / −76 bis +512 / +208        |
| 1400–1599 | 31 250 / −174 / −464 bis +155 / −174 | 9037 / +149 / −136 bis +411 / +149       |
| 1600–1799 | 30 876 / −149 / −434 bis +127 / −149 | 9349 / +86 / −174 bis +338 / +86         |
| 1800–1999 | 26 017 / −130 / −399 bis +115 / −130 | 6903 / +12 / −229 bis +273 / +50         |
| 2000–2199 | 18 555 / −104 / −368 bis +111 / −104 | 3281 / −26 / −246 bis +232 / +50         |
| 2200–2399 | 8432 / −66 / −312 bis +167 / −66     | 879 / −70 / −272 bis +151 / +50          |
| 2400–2599 | 1640 / −22 / −267 bis +213 / −50     | 144 / −137 / −381 bis +76 / +50          |
| 2600–2799 | 233 / +7 / −234 bis +284 / −50       | 32 / – / – / Randwert +50                |

- **Stufen danach (Blitz / Schnellschach / Klassisch):** 1: 667/747/973 · 2: 839/946/1177 ·
  3: 1078/1242/1438 · 4: 1278/1456/1597 · 5: 1537/1696/1776 · 6: 1770/1906/1956 ·
  7: 1998/2108/2158 · 8: 2216/2291/2341 · 9: 2327/2388/2438 · 10: 3246/3296/3346.
- **Prüfmessung (25.10.2026, sechs Chats):** Anker der Nm-Stufen (je 40 Partien gegen sich
  selbst mit der Uhr der Zeitklasse, Tiefe 18), verglichen mit der Zahl der App; Messgenauigkeit
  etwa ±65. Runde 1 bis 3 gelten nicht: Die Messspieler (`engine/messspieler.testhilfe.ts`) gaben
  dem Wahlmodell die Zeitklasse nicht mit, die App schon (`ui/komponenten/botzug.ts`); gemessen war
  also Schnellschach-Wahl mit Blitz- oder Klassisch-Uhr. Erkannt daran, dass Runde 3 mit einer
  geänderten Blitz-Wertung Zug für Zug dieselben Partien spielte wie Runde 1. Ein Versuch dazwischen
  (Grundschicht je Zeitklasse breiter oder enger) wirkte aus demselben Grund nicht und ist
  zurückgebaut: Bots und Nm-Stufen wählen mit dem Wahlmodell, die Grundschicht nutzen nur reine
  Stufen. Behoben in 0.2.137, Test `engine/messspieler.test.ts`.
- **Runde 4 (mit Zeitklasse, ohne Korrektur), Blitz:** Stufe 2 bis 7 Anker 879, 1214, 1543, 1807,
  1864, 2021 gegen die Zahlen 839, 1078, 1278, 1537, 1770, 1998. Stufe 2 und 7 passen, 3 bis 6
  spielen 94 bis 270 zu stark: Das Wahlmodell mit der Blitz-Wertung desselben Menschen wählt in
  diesem Bereich noch zu gute Züge. Umsetzung: `engine/wahlkorrektur.ts` zieht für Stufe 3 bis 6
  die Abweichung durch 0,75 (Elo Stärke je Elo Wertung) von der Wahlwertung ab: −180, −350, −360,
  −125; Stufe 1, 2, 7 bis 10 ohne Korrektur. Anzeige und Wertung bleiben bei der umgerechneten Zahl.
- **Runde 5 (mit Korrektur), Blitz 3 bis 6:** Anker 1029, 1257, 1550, 1950 gegen 1078, 1278, 1537,
  1770: Stufe 3 bis 5 passen (−49, −21, +13). Stufe 6 liegt nahe der Sättigung (Genauigkeit 76 bis
  78 %): Mit Korrektur spielte sie ungenauer als ohne, der Anker stieg trotzdem; dort trennt die
  Messung nicht mehr, die Korrektur −125 bleibt.
- **Klassisch (Runde 4, ohne Korrektur):** Stufe 2 bis 7 Anker 1179, 1414, 1600, 1629, 1857, 2050
  gegen 1177, 1438, 1597, 1776, 1956, 2158. Stufe 2 bis 4 passen (+2, −24, +3). Stufe 5 spielte
  147 zu schwach; mit +195 (Runde 5) ergab sie 1950, in Klassisch wirkt die Korrektur also mit etwa
  1,65 Elo je Elo Wertung. Umsetzung +90, zwischen beiden Messungen auf der Zahl. Stufe 6 und 7
  (−99, −108) bleiben ohne Korrektur: Bei 81 bis 83 % Genauigkeit sättigen die Anker und messen zu
  niedrig.
- **Rohdaten** lokal in `buch/arbeit/zeitklassen/pruefung-0.2.131-r4` und `-r5`, Partien auf den
  Zweigen `pruefung-<zeitklasse>-<stufe>-r4` und `-r5`.

## Spielen aufgeräumt, Siege je Zeitart, goldener Rahmen (25.10.2026, Opus mit zwei Hilfsagenten, Version 0.2.138)

Ergänzungen des Autors vom 25.10.2026 abends.

- Schätzung der Stärke über den Reitern (`Gesamtstaerke.tsx`) statt im Reiter „Fehler“: Alle
  Einstellungen betreffen die Stärke. Die Zahl bleibt `staerkeGeschaetzt` (Stufen je Phase, rein
  ohne Fehlerart); Fehler und Flecken gehen nur als Richtung ein (`staerkerichtung`), der Stil gar
  nicht, weil dafür keine Messung vorliegt. Das steht hinter dem Fragezeichen.
- Spielstärke in der Startleiste hinter dem Namen (`bildschirme/startstaerke.ts`): dieselbe Zahl
  wie in der gewerteten Partie (`gegnerstaerke`, Zeitklasse der Uhr); wer zur Bedenkzeit scrollt,
  sieht die Änderung sofort.
- Eigene Karte „Partie“ für Farbe, Bedenkzeit, Wertung, Hilfen und Eröffnung (`Spielen.tsx`);
  `GegnerWahl` hat die Eigenschaft `einstellungen` nicht mehr.
- Sprechblase: einfacher Kasten, Porträt 64 Pixel. Ursache des Überlappens: Das Bild war seit
  0.2.131 96 Pixel groß, sein Rahmen nach der Korrektur 0.2.133 wieder 64.
- Erklärtexte im Spielen-Menü hinter Fragezeichen (`MitInfo`); Sätze, die die aktuelle Wahl
  beschreiben, und Warnungen bleiben sichtbar.
- Klare Trennung anderswo geprüft (Bildschirmfotos aller Hauptbildschirme): Kapitelseite
  „Abbildungen“ als Karte, Profil „Deine Partien“ als Karte; die übrigen waren schon gegliedert.
- Goldene Feldmarkierung: dünne gepunktete goldene Linie auf dem Umriss zwischen den Ecken
  (`ui/brett/Brettmarken.tsx`, Maße in `masse.ts`); Grau und Rot unverändert. Darstellung der App,
  kein Buchwert.
- Bots besiegt je Zeitart (`Symbolringe.tsx`, `zeitartzeichen.ts`): drei Ringe im Profil mit den
  Zeichen der Bedenkzeit, alle Ringe mit Zeichen in der Mitte und Legende; Spaß-Bots zählen mit (82),
  eigene Bots und Gruppen nicht. Siegmarken am Porträt für alle drei Zeitarten zugleich (vorher nur
  die der gewählten Uhr); die Zahl an der Stufe gilt weiter für die gewählte Uhr. Alte Siegliste
  (vor 0.2.125) wird der Zeitart der Partie zugeordnet, wenn die Partie noch gespeichert ist, sonst
  Schnellschach. Bullet zählt als Blitz. Speicherformat unverändert.

## Spielstärke unter Spielen, Trainer-Ring, Vorlagen als Liste (25.10.2026, Bot-Chat, Version 0.2.139)

Wünsche des Autors vom 25.10.2026 nachmittags; mit dem Design-Chat abgestimmt (er hat die Dateien
in dieser Zeit nicht angefasst).

- **„Deine Spielstärke“** (`LetzteSpielstaerke.tsx`) steht wieder unter Spielen, ganz oben über
  dem Gegner, nicht mehr über der Partienliste im Profil. Die Tour zeigt sie entsprechend früh.
- **„Trainings erstmalig absolviert“:** dritter Ring in der ersten Zeile von „Dein Fortschritt“.
  Gezählt wird jeder fertige Trainer aus `training/trainer.ts` mit mindestens einem
  abgeschlossenen Durchgang (`erstmalsTrainiert` in `speicher/fortschritt.ts`). „Erfolgreich“
  heißt damit „bis zum Ende durchgespielt“ (gezählt beim Abschluss der Runde, `useRunde.ts`, und
  in der 30-Minuten-Routine); eine Mindestzahl richtiger Antworten verlangt der Ring nicht.
- **Vorlagen für Fehler und Flecken** als Auswahlliste im Aussehen der Stilachsen
  (`.stilnetz-liste`); passt die Einstellung zu keiner Vorlage, steht „eigene Einstellung“. Mit
  offenen Feinreglern bleibt die Liste gesperrt wie vorher die Knöpfe.

## Spielerprofil mit Namen und Porträt, Baukasten auch für eigene Bots (25.10.2026, Opus, Version 0.2.140)

Wunsch des Autors (25.10.2026): im Profil freiwillig Porträt und Profilname, aus vorgefertigten
Porträts oder selbst zusammengebaut (Frisur, Haarfarbe, Gesicht, Augen …), sichtbar in der Partie
gegen die Engine und bei den gespielten Partien; Nachsatz: den Baukasten auch für eigene Bots.

- Machbarkeit: Die Porträts der Bots sind DiceBear „Personas“ aus festen Merkmalen (Frisur 20,
  Haarfarbe 7, Haut 7, Augen 6, Nase 3, Mund 7, Bart 6, Oberkörper 4, Kleidungsfarbe 7). Daraus
  wird der Baukasten (`ui/profil/merkmale.ts`, `Baukasten.tsx`); Schnuller und „wie Bots“-Werte
  weggelassen, „kein Bart“ ergänzt. Die Bibliothek (`@dicebear/core`, `@dicebear/personas` 9.4.3,
  MIT, Zeichnungen CC BY 4.0) wird nur im Baukasten nachgeladen; gespeichert wird das fertige SVG
  (höchstens 40 000 Zeichen, muss mit `<svg` beginnen, nur als `img` gezeigt, CSP erlaubt `data:`).
- Auswahl: die 30 Porträts für eigene Bots (fünf Altersgruppen, Frauen und Männer); für „alte
  Menschen“ ergänzt der Baukasten die Nase „mit Falten“, graues Haar, Halbglatze und Glatze.
- Speicher: neues Feld `profil` der Nutzerdaten (`speicher/profil.ts`) ohne neue Formatversion wie
  „zugErraten“ (0.2.90); fehlt es, gibt es kein Profil. Eigene Bots: neues Feld `portraetBau`
  neben `portraet`, nur eines gesetzt (`ui/profil/gegnerbildwahl.ts`). Eine ältere App ließe
  beide Felder beim Speichern weg.
- Anzeige: Profilkarte oben im Profil (`ProfilKarte.tsx`), eigene Uhr in der Partie
  (`Partieuhr.tsx`), Partienliste mit eigenem Porträt klein vor dem des Gegners und „Name gegen
  Gegner“, PGN-Name statt „Leser“. Partien speichern das Profil nicht; sie zeigen das aktuelle.
- Gemeinsame Porträtwahl (`Portraetwahl.tsx`, `portraetwahlZustand.ts`) für Profil und eigene
  Bots; das Aufklappmenü `PortraetAuswahl.tsx` (0.2.100) entfällt, im Bot-Formular steht die Wahl
  in einer Klappe mit dem Bild in der Zusammenfassung.

## Maia im Wahlmodell, Plan C und eine Neumessung (25.10.2026, Bot-Chat, Version 0.2.143)

Freigabe des Autors (25.10.2026 nachmittags): Maia als Komplettpaket, in den Einstellungen
ausschaltbar; dazu Plan C mit einer gemeinsamen Neumessung, alles mit den zehn Mess-Chats.

- **Vergleich vorab** (lokal, `/home/user/maia/vergleich.py`): 320 000 Lichess-Stellungen ab
  Halbzug 10, je Zeitklasse 80 % Eichung, 20 % Prüfung. Trefferquote des gespielten Zugs (A
  Wahlmodell / B nur Maia / C beides): Blitz 39,9 / 54,3 / 55,2 %, Schnellschach 40,8 / 53,7 /
  54,9 %, Klassisch 42,0 / 50,3 / 52,8 %. Fehlerrate (Verlust ab einem halben Bauern) je Band:
  A und C treffen die echte auf etwa einen bis zwei Prozentpunkte (Schnellschach 2000: echt 22,6,
  A 21,0, C 21,1), B allein nicht (unten zu wenige Fehler, über 2000 zu viele, Klassisch 2400:
  30,7 statt 12,2). Entscheidung: Variante C.
- **Maia-2** (CSSLab, University of Toronto, MIT): zwei Netze (Blitz, Schnellschach; Klassisch
  rechnet mit Schnellschach), ohne die ersten zehn Halbzüge trainiert (in der Grundstellung sagt
  es 1. Sf3, Sc3, Sa3 voraus), deshalb erst ab Halbzug 10. Als ONNX in halber Genauigkeit
  (Gruppe 1, Bericht auf Zweig `maia-onnx`: 42 MB je Netz, 99,9 % gleicher bester Zug wie das
  Original, im Browser etwa 100 bis 150 ms je Zug auf einem Kern). Die Netze liegen zerlegt in
  `app/public/maia/` (Teile zu 15 MB, Cloudflare nimmt höchstens 25 MiB je Datei), Prüfsummen in
  `maia.json`. Die Vorbereitung der Stellung (`engine/maia.ts`: 18 Ebenen, Spiegelung bei
  Schwarz am Zug, elf Wertungsklassen, Zugliste des Trainings) ist gegen PyTorch geprüft
  (`maia.messung.ts`, auf 0,01 genau).
- **Wahlmodell C** (`engine/wahlmodell-maia-daten.ts`, lokal `/home/user/maia/fit_c.py`):
  dieselben Merkmale wie bisher und ln p_Maia, gemeinsam an allen Stellungen ab Halbzug 10
  geeicht; Gewicht von ln p_Maia bei 1500: Blitz 0,84, Schnellschach 0,85, Klassisch 0,74
  (331 759 Stellungen; je Zeitklasse ein eigener Lauf, `fit_c1.py`). Ohne Maia-Karte (vor
  Halbzug 10, Paket fehlt oder aus) gelten die bisherigen Gewichte.
- **Zusatzpaket** (`app/maiapaket.ts`, Reiter „Bots“ der Einstellungen, `MaiaWahl.tsx`): etwa 96
  MB (zwei Netze und die Laufzeit onnxruntime-web 1.20.1, MIT), nur auf Wunsch geladen, im
  Speicher „maia-1“ des Browsers, auch offline; Prüfsumme je Netz; löschbar. Nicht vorab geladen
  (`vite.config.ts`, globIgnores), eigenes Größenbudget (`skripte/pruefe-groesse.mjs`); die App
  bleibt bei 22 MB. Die Laufzeit läuft mit einem Thread ohne Cross-Origin-Isolation (geprüft in
  Chromium, Oberflächentest `maia.spec.ts` mit echter Partie unter der Sicherheitsregel).
- **Schalter** „Maia für die Bots“ (Standard an, wirkt nur mit Paket); die Partie merkt sich beim
  Beginn, ob der Bot mit Maia wählt (Partieeinstellung `maia`), und bleibt dabei bis zum Ende.
  Ältere Speicherstände lesen sich ohne Umbau. Fehlt Maia mitten in einer Partie (Paket
  gelöscht), wählt der Bot ohne Maia weiter (Warnung im Protokoll).
- **Plan C:** „ungenau“ bleibt im Spiel als Art stehen (das Wahlmodell ist mit `art_ungenau`
  geeicht, Gewicht etwa +0,5; bis 0.2.140 fehlte es, die Bots spielten zu genau);
  Prüfkandidaten für Bauernzug ohne Not, Königszug ohne Not und eingestellte Bauern
  (`engine/pruefkandidaten.ts`, je Art höchstens zwei); „Patt gesetzt“ aktiv; Charaktere nur
  noch mit den Arten der Regler und ganzen Fleckengruppen (`engine/gegnerbau.ts`).
- **Neuling auf acht** (Wunsch des Autors): vier Kandidaten für die zwei fehlenden Universellen
  (Emma, Opa Kurt, Frau Schulz, Lotte; `engine/botkandidaten-neuling.ts`), die Neumessung wählt.
- **Neumessung** (`app/messplan/`, `skripte/messe-planc.sh`, zehn Chats): zwei Durchgänge, ohne
  und mit Maia (Kürzel „*“), je Anker 1m bis 10m (40 Partien, Tiefe 18) und alle Bots, Gruppen
  und Kandidaten gegen die zwei Nm-Stufen um ihre Zahl (12 Partien); zusammen 5408 Partien.
  Weichen die Zahlen mit und ohne Maia je Bot um höchstens 65 voneinander ab, gilt ein Satz,
  sonst zwei.
- **Ergebnis** (Auswertung `engine/botstaerke.messung.ts`, lokal `buch/arbeit/planc/{ohne,mit}`):
  Stufen ohne / mit Maia 598 / 508, 818 / 738, 1030 / 1035, 1236 / 1402, 1434 / 1619, 1636 / 1885,
  1740 / 1955, 1937 / 1973, 2079 / 2257, 2885 / 3617 (Streuung ohne ±30 bis ±120, mit ±40 bis
  ±320). Ab Stufe 4 spielt Maia im Mittel etwa 200 Elo stärker; der Unterschied liegt bei vier
  von fünf Bots über ±65. Entscheidung: **zwei Zahlensätze** (`engine/zahlensatz.ts`,
  `engine/botstaerke-maia-daten.ts`). Die Wertung einer Partie nimmt den Satz, mit dem sie gespielt
  wurde (alte Partien: ohne), die Anzeige den Satz, der gerade gilt (`useAnzeigesatz` in der Hülle).
  Uhrabzüge sind nur ohne Maia gemessen und gelten für beide. Untergrenze jeder Zahl 100
  (`skripte/uebernehme-planc.mjs`): Mit Maia lagen die schwächsten Bots unter 0 (±200).
- **Neulinge:** ohne Maia Emma 295 ±147, Opa Kurt 329 ±126, Frau Schulz 212 ±138, Lotte 295 ±136.
  Frau Schulz und Lotte liegen auch mit der Streuung unter 450 und stehen jetzt in Gruppe 1
  (acht Bots); Emma und Opa Kurt bleiben Kandidaten.
- **Persönlichkeit mit fester Wertung** (`engine/persoenlichkeitswertung.ts`): Die Faktoren der
  Persönlichkeit hingen an der gemessenen Zahl des Bots; mit den neuen Zahlen hätten alle Bots
  anders gespielt, als sie gemessen wurden. Seit 0.2.143 gilt dafür die eingefrorene Wertung vom
  Stand der Messung (Zahlen vom 24.10.2026) in App, Gruppenmodus, Messung und für eigene Gegner.
  `vorgefertigteUnveraendert.test.ts` bestätigt: alle 82 bisherigen Bots bekommen genau die
  Eingaben der Messung. Ebenso bleibt die Gruppe jedes Bots bei der Zahl seiner Auswahl
  (`engine/botgruppe.ts`): Mit den neuen Zahlen (12 Partien je Bot, ±130) überschnitten sich die
  angezeigten Bereiche benachbarter Gruppen (Stufe 2 bis 656, Stufe 3 ab 429); die Nachmessung mit
  mehr Partien soll das klären, danach werden die Gruppen neu geordnet.
- **Offen:** Blitz und Klassisch sind mit Maia nicht eigens gemessen (beide Sätze rechnen um wie
  bei Menschen, `engine/zeitklassenabstand.ts`). Gruppe 1 wurde noch mit sechs Bots gemessen; die
  Gruppen 2 und 3 liegen ohne Maia verkehrt (678 / 640, Streuung ±130). Beides misst die
  Nachmessung (Nachtarbeit 25./26.10.).

## Porträt-Baukasten mit Vorschaubildern und mehr Farben (25.10.2026, Opus, Version 0.2.141)

Rückmeldung des Autors zu 0.2.140: Gegnerporträts in der Partienliste viel zu groß; mehr Auswahl
beim Gestalten, Vorschaubilder statt Ausklappmenüs, wenn platzsparend möglich.

- Partienliste: Die Breite galt nur für `.partiezeile > .gegnerbild`; mit dem eigenen Porträt
  davor steckt das Gegnerbild in `.partie-paar` und füllte die Zeile. Regel ergänzt.
- Formen: „Personas“ hat feste Varianten (Frisur 20, Augen 6, Nase 3, Mund 7, Bart 6, Oberteil 4);
  mehr gibt es nur mit einem anderen Zeichenstil, der nicht zu den Bots passte. Farben nimmt
  DiceBear als beliebigen Hexwert: Haar 18, Haut 12, Oberteil 16. Neue Werte stehen hinter den
  alten, damit gespeicherte gültig bleiben.
- Vorschaubilder: je Merkmal eine waagerecht wischbare Reihe (60 Pixel je Bild, gewählt gold),
  jedes Bild das aktuelle Gesicht mit dieser Variante; bei Augen, Nase, Mund, Bart auf das Gesicht
  vergrößert. Dafür lädt `ladeBauer` DiceBear einmal und baut danach ohne Warten (etwa 45 Bilder
  je Änderung).

## Partienliste, Löschen per Auswahl, Spielstärke je Zeitart, mehr Porträt-Formen (25.10.2026, Opus, Version 0.2.142)

Wünsche des Autors (25.10.2026), nach drei HTML-Vorschauen freigegeben („Super, richtig gut. Nach
main damit“).

- Partienliste: neue Zeile `ui/komponenten/Partiezeile.tsx`, Stile `ui/stil/partienliste.css`.
  Eigenes Porträt und eigener Name entfallen (man ist an jeder Partie beteiligt). Links der Gegner
  mit Namen, gewertet als Stern am Porträt (der Autor zog das einem Stern auf der Rahmenecke vor);
  Mitte Ergebnis, Farbe, Zeitzeichen, klein Zeitart, Datum, Züge (Teile brechen nur an „ · “ um).
- Zahlen (`partiezahlen.ts`): Elo nur, wenn beide Seiten eine Schätzung haben, sonst stets die
  Genauigkeit beider; nie gemischt. Darstellung als Seitenmarken mit König in der Farbe der Seite,
  die eigene golden gerahmt, darüber „Elo“ oder „Genauigkeit“, bei der Genauigkeit ein Balken
  (der Autor fand „≈ 1450 vs ≈ 1520“ unbedacht).
- Platzhalter: eingelesene Partien Dateizeichen mit Gegnernamen aus dem PGN, zu zweit zwei
  Personen („Zu zweit“ statt des abgeschnittenen „Mensch (beide am Gerät)“), Engine ohne Bot Stufe.
- Löschen (Vorschlag des Autors): Papierkorb neben Filter und Sortieren schaltet einen
  Auswahlmodus ein (`PartieLoeschen.tsx`); gewertete Partien bleiben unwählbar
  (`speicher/partien.ts`, `ohnePartien`). Der Papierkorb je Zeile entfällt; er kostete Platz und
  stand nicht überall. Technisch liegt der Knopf zum Öffnen unsichtbar hinter der Zeile.
- „Deine Spielstärke“ (`LetzteSpielstaerke.tsx`): drei Kacheln für alle Zeitarten zugleich mit
  Legende; Einzelheiten hinter dem Fragezeichen.
- „Deine Wertung“ (`Wertungskurve.tsx`): Fragezeichen an der Überschrift mit allen Erklärtexten;
  sichtbar Zahl, Marke „vorläufig“, kurze Standzeile.
- Porträt-Baukasten: doppelt so viele Formen für Augen, Nase, Mund, Bart und Oberteil. Eigene
  Zeichnungen im Stil von Personas ersetzen den Inhalt der jeweiligen Bauteil-Gruppe an ihrer
  festen Stelle im SVG (`ui/profil/eigeneTeile.ts`); gespeichert wird weiter das fertige SVG.

## Nachtarbeit 25./26.10.2026: Nachmessung, feste Gruppen, Zeitklassen mit Maia, Feiern (Opus, Version 0.2.144)

Auftrag des Autors (25.10.2026 abends): alle offenen Punkte ohne Rückfragen umsetzen, auch nach
`main`, Messungen mit den anderen Chats anstoßen; dazu Gruppenbild als Kreis, Feuerwerk bei
Freischaltung und vollem Ring, kleine Siegesanimation, Erklärtexte für Leser ohne Vorwissen, Tour
überall prüfen; nachträglich ein Hinweis auf Maia beim ersten Bot.

- **Nachmessung** (`skripte/messe-nach.sh`, Zweige `messung-nach-*`): 24 Partien mehr je Bot und
  Kandidat, zusammen 36. Stufen ohne / mit Maia jetzt 607 / 592, 797 / 733, 1052 / 964,
  1233 / 1323, 1434 / 1544, 1610 / 1834, 1746 / 1959, 1977 / 2166, 2050 / 2324, 2864 / 3287.
- **Feste Gruppen** (`engine/botgruppen-daten.ts`, `skripte/ordne-gruppen.mjs`): Auch mit 36
  Partien überschnitten sich die Bereiche benachbarter Stufen, wenn die Gruppe aus der gerundeten
  Zahl kam. Seit 0.2.144 stehen die acht schwächsten Bots (nach der Zahl ohne Maia) in Stufe 1, die
  nächsten acht in Stufe 2 und so weiter. Die Liste bleibt fest, auch wenn neue Messungen die
  Zahlen leicht verschieben (Wunsch des Autors vom 19.10.: keine Überschneidung). Test: je Stufe
  acht Bots, höchste Zahl einer Stufe höchstens gleich der niedrigsten der nächsten.
- **Gruppen neu gemessen** (`skripte/sammle-gruppen.sh`, Zweige `messung-gruppen-{ohne,mit}-1/2`,
  72 Partien je Gruppe, alte Gruppenpartien aus der Auswertung genommen). Ohne Maia 411, 789, 932,
  1359, 1529, 1924, 2239, 2479, 2574, 2534; mit Maia 410, 674, 991, 1177, 1467, 1894, 2312, 2857,
  2941, 2891.
- **Zeitklassen** (`skripte/pruefe-anker.sh`, `sammle-pruefung.sh`, je Stufe 2 bis 9 ein Anker mit
  40 Partien in Blitz 3 + 2 und Klassisch 30 + 20, ohne und mit Maia). Vergleich: Abstand Anker
  Zeitklasse minus Anker Schnellschach gegen den erwarteten Abstand derselben Stufe. Blitz ohne
  Maia: Abweichungen −92 bis +114, nur Stufe 8 +291, im Mittel +59; die Umrechnung bleibt. Blitz mit
  Maia: Stufe 5 etwa −450, Stufe 4 −120 bis −260, Stufe 7 +130 bis +280, der Rest im Rauschen. Die
  Wertung geht mit Maia auch an deren Netz, deshalb wirkte die Blitz-Korrektur dort stärker; mit
  Maia gilt eine eigene Reihe (`engine/wahlkorrektur.ts`, KORREKTUR_MAIA), in zwei Runden
  nachgeprüft (`pruefung-blitz-N-maia2`, `-maia3`): Stufe 3 bis 7 jetzt −180, −175, −110, −125,
  −240 (ohne Maia −180, −350, −360, −125, 0); Stufe 4 und 5 passen auf etwa ±100, Stufe 7 liegt
  zwischen den Messungen mit −150 (+190) und −300 (−110). Seit 0.2.145. Klassisch ohne Maia:
  Abweichungen −94 bis +56, mit Maia −189 bis +125 (Stufe 2 bis 9); beides im Rauschen eines
  Ankers, die Reihe für Klassisch bleibt.
- **Feiern:** Gruppenbild als Kreis aus acht kleinen Gesichtern (`Gruppenbild` in
  `Gruppenmodus.tsx`); Feuerwerk (`Feuerwerk.tsx`, CSS, bei „Bewegung reduzieren“ nur ein
  Aufleuchten) und Fanfare (`app/ton.ts`, „feier“) bei der Freischaltung einer Gruppe und bei einem
  vollen Ring (`Ringfeier.tsx`, je Ring einmal, Merker `ringeGefeiert`); nach einem Sieg goldenes
  Leuchten, wenige Funken und ein Dreiklang („sieg“), bei Niederlage ein kurzes Abdunkeln ohne Ton,
  bei Remis nur das Schild (`Ergebnisblende.tsx`, `brett.css`).
- **Maia-Hinweis** (Wunsch des Autors, 26.10.2026): einmaliges Fenster beim ersten Antippen eines
  vorgefertigten Bots (`MaiaHinweis.tsx`, `maiahinweis.ts`, Merker `maiaHinweis`) mit kurzer
  Erklärung, MaiaWahl in Kurzform (Laden oder Schalter) und dem Weg Zahnrad › Bots. Kommt nicht,
  wenn Maia schon an ist; die automatische Vorauswahl beim Wechsel zählt nicht.
- **Texte:** 32 Erklär- und Tourtexte einfacher (keine Median, Quantile, Eichung, Skala; Agent
  auf Zweig `texte-einfach`), die Regel der Zugzeichen ohne Grenzwerte, 13 ungenutzte Texte des
  alten Gegner-Editors entfernt. Tour: Ziele repariert (Trainerwahl, Sichtbarkeit, Partiestatus,
  Gegnerstufen), neue Schritte zu Profilkarte, Reiter „Bots“, Gegnerart, Werkzeugen am Brett.
- **Befunde der Vorprüfung** (Testliste N600 bis N776, Agent): Planbilanz-Ablenker nur von
  derselben Seite, Warum-Fragen mit eigener Überschrift und nur im Mittelspiel, Mattfalle ohne
  Bauernzahl, kein doppelter Punkt in den Endspiel-Kurzübungen; sieben veraltete Testpunkttexte
  angepasst.
- **CSP:** Die Prüfung mit erzwungener Regel deckt alle Bereiche ab (Website, /admin/, alle
  Trainer, Nachschlagen, Baukasten, Einstellungen, Englisch); die Regel bleibt bis mindestens
  1.11.2026 „Report-Only“ wie entschieden.

## Codeführer und Konzeptkarte (26.10.2026, Opus, Version 0.2.146)

Wunsch des Autors: den Code so beschreiben, dass er ihn mit seinen Kenntnissen versteht, gern in
einem eigenen Dokument, dazu eine Karte aller Dateien und Verbindungen; die Beschreibung soll von
Menschen gut bearbeitbar sein („eventuell ein Wiki?“), und Verbesserungsideen als To-do.

- **Seiten statt Wiki:** `docs/codefuehrer/` mit acht kurzen Markdown-Seiten. Ein GitHub-Wiki ist
  ein eigenes Repository, ändert sich nicht im selben Schritt wie der Code und ist aus den
  Sitzungen nicht erreichbar; Markdown im Repository lässt sich auf GitHub ebenso mit dem Stift
  bearbeiten (auch am Handy). Schon umgesetzt, Widerspruch genügt.
- **Konzeptkarte:** `docs/konzeptkarte.html` (drei Ebenen: alle Ordner, ein Ordner, eine Datei;
  Suche). Die Daten erzeugt `app/skripte/konzeptkarte.mjs` aus den Dateiköpfen, den Kommentaren der
  Exporte und den Importen; die Ordnertexte liest es aus `docs/codefuehrer/3-ordner.md`, damit sie
  von Menschen bearbeitbar bleiben.
- **Kommentare:** über allen 94 exportierten Funktionen und Bausteinen ohne Kommentar ein kurzer
  deutscher Satz (Zweig `kommentare-ergaenzt`); kein Code geändert.
- **Verbesserungen:** Liste in `docs/codefuehrer/8-verbesserungen.md` (zwei Dateien über 400
  Zeilen, 173 Dateien in `ui/komponenten/`, Messcode zwischen App-Code, gegenseitige Importe,
  Versionsgeschichte in Dateiköpfen, Zeitgrenze für den Browser-Schritt der CI, zwei offene
  Messungen).

## Version 0.3.0: Zugklassen gemessen, Varianten abspielen, Zugliste, Wertungsmaßstab (26.10.2026, Opus)

- **Zugklassen gemessen** (Frage des Autors, ob die 90-%-Spannen auch für brillant, stark und
  Theoriezug bestimmt waren: nein, sie waren geschätzt). Der Messlauf `spiel/zugklassen.messung.ts`
  setzt die Partien der Spielerprofile zusammen und bestimmt die Klasse jedes Zuges mit der Regel
  der App (Opfer, Theoriekette, Gambit). Ungenau, Fehler, Verpasst und Patzer kommen genau wie in
  der alten Tabelle heraus, das bestätigt den Lauf. Neu: brillant Median 0,1 bis 0,5 %, stark 7 bis
  9 % (vorher auf 1 bis 2,5 % geschätzt; die Regel „Fehler des Gegners bestraft“ greift in
  Amateurpartien oft), Theoriezug 5 bis 7 %; „bester“ enthält diese Klassen nicht mehr. Ist der
  Median 0 (brillant), steht als „üblich“ das Mittel der Spieler. Schon umgesetzt, Widerspruch genügt.
- **Varianten abspielen** (Wunsch des Autors): Knöpfe direkt unter dem Brett spielen „Besser war …“
  (Glühbirne) und „So wird der Fehler bestraft“ (Schwerter) ab, 1,2 Sekunden je Zug, ein zweiter
  Tipp hält an (`ui/komponenten/Variantenknoepfe.tsx`).
- **Zugliste beim Nachspielen** (Wunsch des Autors): aufklappbar auf bis zu fünf Zeilen, Wahl auf dem
  Gerät gemerkt; „Zum Anfang“ und „Zum Ende“ an den Rand, Zurück und Vor breit in der Mitte
  (`ui/komponenten/Zugknoepfe.tsx`, auch an Abbildungen und bei „Zug erraten“).
- **Wertungsmaßstab** (Frage des Autors nach der Umrechnung): chess.com ist im Mittel recht
  verlässlich (Umfrage unter aktiven Spielern), für Einzelne etwa ±100 bis 150; FIDE deutlich
  unsicherer, ±200 und mehr, und erst ab etwa 1730 Lichess Klassisch. Deshalb ein kleiner Schalter
  „Lichess | chess.com · FIDE“ mit „≈“ und Erklärung; die Kurve bleibt bei Lichess. Schon umgesetzt,
  Widerspruch genügt.
- **Codepflege:** CI-Browser-Schritt mit Zeitgrenze 5 Minuten; `spiel/genauigkeit.ts` und
  `ui/komponenten/GegnerWahl.tsx` unter 400 Zeilen (`spiel/zuggenauigkeit.ts`,
  `ui/komponenten/HilfenWahl.tsx`); der doppelte Wahlkontext ist eine Funktion (`wahlkontextVon`).

## Codepflege nach dem Codeführer (26.10.2026, Opus, nach 0.3.0)

Die Liste `docs/codefuehrer/8-verbesserungen.md` abgearbeitet (Wunsch des Autors: „alle
Verbesserungsvorschläge einarbeiten, ohne dass die Funktion der App bricht“). Nur Ordnung, kein
geändertes Verhalten; nach jedem Schritt alle Prüfungen (Vitest, Build, Playwright).

- **README:** Die Regel „kein Modul kennt `ui/`“ nennt jetzt die Hülle `app/` als einzige Ausnahme
  (sie setzt die Bildschirme zusammen); `App.tsx` bleibt, wo es ist.
- **Erzeugte Dateien:** Die Köpfe aus Zeilenkommentaren nennen jetzt den Zweck; die Konzeptkarte
  liest auch diese Form.
- **Ungenutzte Texte:** 21 Texte gelöscht (de und en), die kein Code mehr aufrief; geprüft mit
  Suche und Typprüfung (zwei scheinbar ungenutzte, `plan.gegenschlagDa` und `wo.gegenschlagDa`,
  setzt `analyse/planfragen.ts` zusammen und blieben). Neuer Test `i18n/ungenutzt.test.ts` meldet
  jeden neuen ungenutzten Text; 57 Kandidaten stehen dort zur Prüfung.
- **`ui/komponenten/`** in 19 Themenordner (bausteine, rahmen, hinweise, einstellungen, gegner,
  gegnereditor, spielstart, partie, partienliste, auswertung, rueckblick, fortschritt,
  werkzeugkarten, werkzeugwahl, brettbedienung, abbildung, kapitel, training, lernsammlung); die
  Konzeptkarte zeigt sie als eigene Gruppen, der Codeführer hat je Ordner einen Abschnitt.
- **Messcode** nach `engine/messung/` und `spiel/messung/` (nur, was vom Einstieg der App nicht
  erreichbar ist); die `*.messung.ts` bleiben neben dem gemessenen Code.
- **Gegenseitige Importe:** von 18 Paaren auf 3 (alle nur über Typen); neue Dateien für gemeinsame
  Typen (`engine/fehlerart-typen.ts`, `engine/gruppenbasis.ts`, `speicher/partieeintrag.ts`,
  `analyse/k12-kandidat.ts`, `schach/erkennungsbild-typen.ts`, `schach/eroeffnungsnamen-typen.ts`),
  die alten Dateien reichen alles weiter.
- **Prüfmessung Blitz mit Maia, Stufe 7** (`pruefung-blitz-7-maia4`, Korrektur −240): Anker 1786,
  erwartet etwa 1824, Abweichung etwa −40, im Rauschen; die Korrektur bleibt.
- **Prüfmessung Blitz ohne Maia, Stufe 8:** Die Wiederholung `pruefung-blitz-8-r2` ergab dieselben
  Partien wie die erste Runde (feste Zufallssaaten); `skripte/pruefe-anker.sh` nennt jetzt
  `MESSUNG_SAAT_AB` für eine neue Stichprobe. Mit `MESSUNG_SAAT_AB=1000` (`pruefung-blitz-8-r3`):
  Anker 1813 statt 2063, erwartet etwa 1772, Abweichung etwa +40. Der Ausreißer von +291 war
  Zufall; die Umrechnung bleibt. Zwei Stichproben derselben Stufe lagen 250 Punkte auseinander, die
  Streuung einer Prüfmessung mit 40 Partien ist also größer als die Blöcke zu zehn vermuten lassen.
- **Kommentare** (drei Agenten, je Ordner getrennt): rund 400 Dateiköpfe auf den heutigen Stand
  gekürzt (ohne Versionsgeschichte; Wünsche und Entscheidungen des Autors bleiben als Grund), alle
  exportierten Werte kommentiert (die Konzeptkarte meldet keinen mehr), rund 145 reine
  Versionsetiketten in Kommentaren entfernt. Ein Vergleichsskript hat für jede geänderte Datei
  bestätigt, dass das übersetzte Programm ohne Kommentare gleich bleibt.
- **Weitere 44 ungenutzte Texte** gelöscht (einzeln geprüft); der Test erkennt jetzt auch Anfänge
  mitten in Vorlagen (`{{training.ort.${ort}}}`), die Prüfliste nennt nur noch die acht Texte, die
  `MerkerWahl` als `${schluessel}.${w}` zusammensetzt.
- **Letzte drei gegenseitige Importe** (nur Typen) in `ui/komponenten/` gelöst
  (`werkzeugwahl/werkzeugwahltyp.ts`, `rueckblick/rueckblicktyp.ts`).


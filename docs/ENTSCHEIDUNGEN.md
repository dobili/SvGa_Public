# Entscheidungen

Protokoll aller Entscheidungen mit Datum und Begründung. Die Entscheidungen bis zum 13.10.2026
stehen ausführlich im Pflichtenheft (Abschnitt „Entscheidungen vom 13.10.2026“) und im
technischen Konzept; hier nur die Kurzfassung und alles, was danach dazukam.

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
- **Nicht angefasst:** `docs/FORTSCHRITT.md` nur um die Version und den nächsten Schritt
  ergänzt; AP-13-Dateien von Opus unberührt; der Zweig `trainerdaten` läuft getrennt weiter.

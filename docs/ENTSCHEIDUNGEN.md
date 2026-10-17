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

## 64 Gegner mit Porträts (18.10.2026 nachts, Fable, Zweig `bots-galerie`, Version 0.2.65)

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
  Stellungen gar keinen Fehler fand und dann den besten Zug spielte. Deshalb seit 0.2.66
  (`engine/fehlersuche.ts`, `mitFehlerliste`): Die Liste bestimmt die Art, nicht die Menge.
  Passt keine erlaubte Art zur Stellung, bleibt eine Ungenauigkeit bis zu einem Bauern (im
  Protokoll „ungenau“). Das gilt auch für eigene Gegner und die Abhakliste (Hinweistexte
  angepasst); eine leere Liste heißt weiter „kein absichtlicher Fehler“. Die Messung der Stufen
  1 bis 4 wird danach wiederholt; das Ergebnis aller 64 Bots steht in der nächsten Fassung dieses
  Abschnitts.

## Werkzeugabweichungen aus der Textarbeit geprüft (18.10.2026 nachts, Fable, Zweig `werkzeuge-textarbeit`, Version 0.2.66)

Die Helfer der Textarbeit (AP 14, 15.10.2026, Stand 0.2.25) hatten zwölf Gruppen von
Werkzeugausgaben notiert, die vom Buch abweichen (Liste bis 0.2.65 in FORTSCHRITT unter AP 14).
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

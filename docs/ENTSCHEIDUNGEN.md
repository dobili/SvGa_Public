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
- **Nicht übernommen:** chess.com prüft zusätzlich, ob die geopferte Figur „wirklich zu nehmen“
  ist (Angreifer nicht gefesselt, Nehmen erlaubt kein Matt in einem). Das bräuchte je Opfer eine
  weitere Suche; bei Bedarf später.
- **Messlauf:** `app/src/spiel/opfer.messung.ts` (nicht in der CI) rechnet die Datei mit der
  Engine durch; Aufruf `npm run messen:opfer` im Ordner app, Ergebnis nur lokal.

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

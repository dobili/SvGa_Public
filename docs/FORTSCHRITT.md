# Fortschritt – Wiederaufsetzpunkt

Stand: 24.10.2026 mittags · **Version 0.2.124, R57 Dashboard** (P1, Opus, auf Wunsch des Autors vor dem Bot-Chat nach main; der Bot-Chat nimmt 0.2.125): Worker `app/worker/` (Meldungen `/api/melden` mit Drossel, Prüfberichte `/api/bericht`, Dashboard-Schnittstellen `/api/admin/*` mit eigener Prüfung des Access-Zeichens, D1 `svga-admin`, täglich aufräumen, Wochenmail), Seite `/admin/` (`app/admin/`, `src/admin/`), Wartungslauf `.github/workflows/wartung.yml` mit `pipeline/wartung`, `version.json`, „Fehler melden“ als Formular, „Fehler im Buch melden“ an jeder Abbildung, Absturzbericht in der Fehlergrenze, Datenschutzerklärung ergänzt, Werkzeug-Links unter den Übungen der Trainingsseiten (`inhalte/de/werkzeuglinks.json`, `src/startseite/werkzeuglinks.ts`). Offen: Turnstile nur bei Spam (DB2). **Nächster Schritt:** Autor trägt `BERICHT_SCHLUESSEL` ein (DB1), erster Lauf „Wartung“ prüfen; danach R26 Abschluss, P8 Teil B. Davor: 24.10.2026 nachts · **Version 0.2.123** (P1, Opus): Bereich Spielen ohne Kalibrierung fertig: R54 Partienliste mit „Filter“ und „Sortieren“ (Variante A), R28 Bot mit Porträt als Titel, R27 „Art des Gegners“ direkt über „Partie beginnen“, R51 Anzeigeteil (Zeitklasse aus der Bedenkzeit in Liste und Filter, gewertet nur mit Uhr, 60 + 0; `spiel/zeitklasse.ts`), R24 Bot bleibt nach dem Buch in der Familie der Lichess-Liste (`schach/eroeffnungsfamilie.ts`). Offen: R26 Abschluss, P8 Teil B (Touren für Spielen, im Chat P8). Davor 0.2.122: neue Auswertung R55/R56 (Umschalter Weiß/Schwarz, Fehler und Patzer eingeklappt, Ring und Balken, Zugklassen als Bullet-Diagramm mit vorläufiger Vergleichstabelle `spiel/zugklassenvergleich.ts`, Zoom und Fingerfahren der Kurve). Davor 0.2.121: P8 App-Tour Teil A eingemischt (Toursymbol, Rundgang, 32 Touren), Aufgabenseite erkennt Paketrückfragen wie P8-1. Davor 0.2.120: Startanimation 2,5 s bei jedem Start, abschaltbar (Wunsch des Autors, P2-A); R32 Spielstärke nur aus gewerteten Partien, Haken bleibt; Werkzeug-Befunde aus P4 behoben. R51 macht der Bot-Chat (Teil F seines Restplans), R24, R27, R28, P8 und R26 nach der Kalibrierung. Davor 0.2.119: P2 fertig eingemischt (R39 Startanimation, R40 zwei Spalten ab 5 : 4, R53), dazu P4 Trainerinhalte (R50 Falle oder Köder, R48 Planbilanz, R47 Endspieltrainer, R49 Strukturerkenner; Fable) und die letzten P6-Anpassungen. Davor 0.2.118: R15 bis R23 und R33 dazu P2 (R35–R38, R29), P3 (R41–R44), P5 (R30, R31, R45, R46) und P6 (R25, englische Buchdaten in der App eingeschaltet) eingemischt; nach main gebracht, obwohl die Bot-Kalibrierung noch läuft (Wunsch des Autors, sie dauert noch Stunden). Davor: Zweig `weiter-ohne-autor`: R15 bis R23 fertig (Aufklapplisten, Zahleneingabe, Ortsmarken der Trainingsseiten, Urteil der Engine nach der Einschätzung, Denkroutine am Brett, Faktorenbilanz mit Waagen, Musterlösungen geprüft, Partienliste mit Symbolfiltern, PGN-Import); main 0.2.117 (zehn Stufen, Format 6) am 23.10.2026 eingemischt. **Nächster Schritt:** Arbeitsplan der Pakete P1 ff. unten („Arbeitsplan ab 23.10.2026“). Davor: 22.10.2026 · **Version 0.2.117** (Zweig `menschliche-bots`, nach main übernommen): menschliche Zusatzfehler der Bots (Lichess-Daten, `engine/menschenwahl.ts`, `pipeline/menschenprofil/`), Bedenkzeit, sichtbare Wartezeit ±10 %, Notmodus mit Vorzügen (`spiel/notmodus.ts`, `ui/komponenten/botzug.ts`), 3+2 und 3+0, **zehn Stufen** (Grundschicht `engine/grundschicht.ts`, geeicht: 250, 400, 715, 1050, 1350, 1700, 2140, 2440, 2700, 2970), Speicherformat 6 (`speicher/stufenskala.ts`), 64 Bots in Gruppen 1–10 nach gemessener Zahl (5 bis 8 je Gruppe, `engine/botgruppe.ts`), Spaß-Bots 430–1180, Abzug der Zusatzfehler je Stufe und Uhrabzug (3+0 −265, 10+0 −100, mit Zuschlag 0) in `engine/botstaerke-daten.ts` (Messung `buch/arbeit/botelo3`, nur lokal; Auswertung mit `BOTELO_ORDNER=../buch/arbeit/botelo3 npx vitest run --config vitest.messung.config.ts src/engine/botstaerke.messung.ts`). Testpunkte N620–N627 in AUFGABEN_AUTOR. Bekannt: Der Oberflächentest „Alle Daten löschen“ ist in der Cloud-Umgebung unzuverlässig (auch auf main 2 von 5 Läufen rot), in GitHub Actions grün. **Nächster Schritt:** Rückmeldung des Autors zu N620–N627 abwarten; offene Arbeitsliste R15 ff. (siehe unten). Davor: 19.10.2026 · **Version 0.2.116**, Arbeitsliste R1 bis R26 begonnen (Opus: R1 Aufgabenliste geleert, CLAUDE.md V2; R2 „KI“ statt „Claude“; R3 bis R8 Texte, Reiter Training, Leiste nur Symbole, Bots nach Stärke, Stufennamen; R9 bis R11 Aufklapper mit Erklärung, Zeichen der Zielbilanz; R12 Klappen Spielhilfen und Eröffnung; R13 Buchzitate englisch, Englisch in 1.0; R14 Aufgabe wiederholen; Nächstes: R15); davor 0.2.115, Buchbefunde ins Buch übernommen (Opus: B6, B7, B8, ZF4, D2 im Buch-Repository auf Zweig `claude/funny-bardeen-e7wpzs`, Daten von Kapitel 3, 8 und 12 neu gebaut, Werkzeugkasten-Seite angepasst, D1 erledigt; Nächstes: Autor übernimmt den Buchzweig nach `main`); davor 0.2.114, Buchbefunde nachgeprüft und Links in Kapitel 12 getestet (Opus, nur Aufgabenliste: B6 neu bewertet, B7 ergänzt, neuer Befund B8 schachtraining.de, ZF4 nachgeprüft; Formulierungsvorschläge an den Autor im Chat); davor 0.2.113, Lektorat, Einzahl und Mehrzahl, Lizenzseite, Vorprüfung der Testliste (Opus, Zweig `weiter-ohne-autor`: `tZahl()` für 1 und 0, Texte in de und en lektoriert, Fehler N402 „Du übersieht“ behoben, Erklärung der Wertung berichtigt, Lizenztexte der npm-Pakete aus dem Build, Quellcode als Link, 26 Testpunkte gestrichen und zehn gekürzt, Buchbefund B7 Lichess-Adresse; Nächstes: Antworten des Autors); davor 0.2.112, Hinweise je Gerät und Kleinkram ohne Autor (Hinweis für zu alte Geräte, Sieben-Tage-Hinweis in Safari, Test „jede Abbildungsnummer öffnet“, robots.txt und sitemap.xml, Sicherheits-Kopfzeilen, Spielen.tsx unter 400 Zeilen, CLAUDE.md zu Cloudflare); davor 0.2.111, Datenschutz und Impressum ergänzt (Lücken aus einem e-recht24-Scan), Cloudflare Web Analytics im Dashboard abgeschaltet, Test gegen fremde Adressen (Opus, Zweig `datenschutz-luecken`); davor 0.2.110 App-Symbol knackiger (Opus, Zweig `symbol-knackig`: mehr Kontrast, etwas Sättigung und Schärfe, dunklerer Rand, 180 und 192 Pixel in voller Farbtiefe; Nächstes: N490); davor 0.2.109, Bot-Gruppen ohne Überschneidung (Opus, Zweig `bot-gruppen`: acht Bots tauschen paarweise die Gruppe der Gegnerwahl, `engine/botgruppe.ts`, ohne neue Messung; Nächstes: N585); davor 0.2.108, Version 1.0 vorbereitet, nicht veröffentlicht (Opus, Zweig `ap17-vorbereitung`: Abnahmeliste `docs/ABNAHME_1.0.md`, Bau `npm run build:veroeffentlichung` ohne Aufgabenseite und englische Vorschau, Datenprüfung `--veroeffentlichung` gegen Entwürfe, Rückfragen V1 bis V6; Nächstes: Antworten des Autors, endgültiges Buch); davor 0.2.107, Testpunkte 0.2.98 bis 0.2.101 vorgeprüft (Opus, Zweig `testpunkte-vorpruefen`: 27 Punkte mit der gebauten App geprüft und gestrichen, N460 überholt, sieben gekürzt geblieben; „1 Zug“ in der Partienliste; Nächstes: Version 1.0 vorbereiten); davor 0.2.106, Farbabstimmung DS30 bis DS37 (Opus, Zweig `farbabstimmung`: Porträts ohne eingebauten Hintergrund, helles Navy im hellen Modus; Haken und Regler in App-Farben; Zahlkreise und Stufenmarken im Dunkeln mit Rand; Rahmen der Bedienelemente 3:1; App-Symbol aus dem goldenen Springer des Covers; vom Autor freigegeben; Nächstes: N483 bis N489); davor 0.2.105, kurze Partien zählen für die Wertung (Opus, Zweig `wertung-kurze-partien`: Die Elo-Wertung verlangt keine Schätzung des Gegners mehr, dessen Zahl seit 0.2.85 fest ist; seit 0.2.103 fielen schnelle Siege gegen Spaß-Bots sonst heraus; Nächstes: N584); davor 0.2.104, englische Fassung als Vorschau (Opus, Zweig `englisch`: en.json mit allen Texten außer 27 Buchzitaten, englische Notation überall, Zahlen und Daten nach der Sprache, Kürzel am Brett in der Sprachdatei, Buchdaten weiter deutsch; Nächstes: N409, Rückfragen EN1 bis EN3); davor 0.2.103, Spielstärke nur bis zur Entscheidung der Partie (Opus, Zweig `genauigkeit-bis-entscheidung`, Wunsch des Autors: Züge nach dem Punkt, ab dem eine Seite dauerhaft mindestens 90 % Gewinnchance hat, zählen nicht mehr für Spielstärke und Urteilswort; Kurven Genauigkeit → Spielstärke an 600 neu gesammelten Partien neu geeicht, Bot-Zahlen über die Anker um 212 tiefer, Bots selbst unverändert; Nächstes: N580 bis N583; GE1 vom Autor mit „so lassen“ entschieden); davor 0.2.102, Uhr beim Verlassen sofort gesichert (Opus, Zweig `uhr-sichern`, N180: angehaltener Uhrstand zusätzlich synchron im Gerätespeicher, weil ein Neuladen das Schreiben in IndexedDB abbricht; Nächstes: englische Fassung, Zweig `englisch`); davor 0.2.101, Symbolsprache DS19 bis DS29 (Opus, Zweig `symbolsprache`: Stufenmarken in Gürtelfarben, ein Aufklappzeichen, Pfeil für Weiter, Zeichen an Knöpfen und Überschriften, Ergebnismarke, Phasenzeichen, Fortschritt an der Kapitelnummer, Werkzeugzeichen, Glossar nach Buchstaben; vom Autor freigegeben; Nächstes: N475 bis N482); davor 0.2.100, Porträtwahl mit Vorschaubildern (Opus, Zweig `portraet-bildauswahl`: Aufklappmenü mit allen 30 Porträts nach Altersgruppen statt Auswahlmenü ohne Bilder; Nächstes: N469); davor 0.2.99, Wünsche des Autors vom 19.10.2026 morgens (Opus, Zweig `spielen-sammlung-nachschlagen`: Spielhilfen über „Partie beginnen“, Porträts für eigene Bots, Stern für besiegte Bots, Partienliste mit Porträt, Filter und Löschen, Zeichen für Warum-Fragen in der Kapitelübersicht mit Fortschritt, Nachschlagen mit Steckbriefen und Werkzeugen; Nächstes: N468 bis N474); davor 0.2.98, Design-Überprüfung (Opus, Zweig `design-ueberarbeitung`: alle 18 Vorschläge DS1 bis DS18 vom Autor angenommen, Schrift folgt dem Gerät, Querformat und Tablet mit Brett links, beschriftete Brettsymbole, Tippflächen 44 px; Nächstes: N450 bis N467); davor 0.2.97, Datenlauf mit dem Buchstand vom 17.10.2026 (`schachbuch-quellen` 931597a; Opus, Zweig `buchstand-neu`: an allen 765 Abbildungen Stellung, Pfeile, Felder, Unterschrift und Nummern unverändert; geändert nur die Literaturnummern in vier Glossareinträgen ([12]→[14], [10]→[11], [13]→[15], [14]→[16]), Zeilenangaben der Fundstellen und die Prüfsummen, die seit dem Nachtrag der Klartextzüge (0.2.94) nicht neu gerechnet waren; Nächstes: Rückmeldung des Autors); davor 0.2.96, konstruierte Zugfolgen und Tablebase (Opus, Zweig `zugfolgen-konstruiert`: 29 Partien ab der Grundstellung zu Abbildungen ohne Zugfolge, Status „konstruiert“ mit Hinweis in der App, Einordnung aller 67 in `inhalte/de/konstruktion.json`, Tablebase-Prüfung der Endspiele; Nächstes: Rückfragen ZF1 bis ZF4, Abb. 7.24 offen); davor 0.2.95, Befunde aus dem Durchprüfen der Aufgabenliste behoben: „Zurück zu den Aufgaben“ führt wieder zum Punkt, Pfeil und Figur bei Hinweis 2 und 3 im Endspieltrainer, „..“ nach „Warum?“, Uhranzeige nach dem Hintergrund, Einzahl, Abbildung beim Zug ausführen, kein Satz über Enginefehler bei Partien zu zweit (Opus, Zweig `aufgaben-zurueck`; Aufgabenliste entlastet auf Zweig `claude/aufgabenliste-entlasten-6y3tgp`); davor 0.2.94 Technik für die englische Fassung (Chat E, Opus, Zweig `sprache-technik`: Sprachwahl nach Gerät, `<html lang>`, Buchdaten je Sprache, Lizenztexte in de.json, Klartextzüge der Unterschriften in der Pipeline); davor 0.2.93 Lernsammlung (Chat E, Opus, Zweig `lernsammlung`: eigene Stellungen mit Plan und Notiz aus Abbildung, Partie und Trainer, nach Eröffnung geordnet, Abfrage, PGN für Lichess-Studien, Nutzerdaten Format 5); davor 0.2.92 Ziehen per Wischen (Chat E, Opus, Zweig `ziehen-wischen`: Figuren mit Finger oder Maus ziehen, nur auf ziehbaren Figuren, abschaltbar in den Einstellungen); davor 0.2.91 Endspiel-Kurzübungen (Quadrat, Opposition, Schlüsselfelder, Erkennungsbild-Quiz; `training/endspieldrills.ts`, `ui/trainer/Drillaufgabe.tsx`), Referenzergebnisse aller Werkzeuge (`src/analyse/__referenz__/werkzeuge.txt`), `speicher/partienLesen.ts` abgetrennt (Opus, Chat A, Zweig `nacht-stabilitaet`; Nächstes: Rückmeldung des Autors zu N400 bis N408 und NA1); davor 0.2.90 Nachtarbeit Chat A (Opus, Zweig `nacht-stabilitaet`: Engine-Tests mit fester Tiefe 16, axe auf Spielen/Partie/Auswertung/Trainern/Dunkelmodus, 360 px, `/training/*` ohne Zwischenspeicher; Uhr 10+0 im 30-Minuten-Plan; Gewinnchance im Zugurteil und in der Falle; Gabel mit Figurennamen; Sicherung teilen; Kontrast am Bewertungsbalken; „Erst selbst denken“ auch vor Werkzeugen (Einstellung, Voreinstellung aus, NA1); Wiederholung für Struktur und Endspiel; Trefferzahl bei Zug erraten und Planstand in den Nutzerdaten); davor 0.2.89 gleich große Kacheln in der Gegnerwahl (Opus, Zweig `kacheln-gleich`: Spalten minmax(0, 1fr), Namen brechen um; Nächstes wie bei 0.2.88); davor 0.2.88 Spaß-Bots und Zahlen über 2200 (Opus, Zweig `spass-bots`: Gruppe „Zum Spaß“ mit Fritzi, Onkel Willi, Tante Trude, Bruno, etwa 600 bis 1100, Zufallszüge 60/38/25/15 %; Stufe 5 bis 8 mit der Zahl der Elo-Leiter statt „über 2200“; Nächstes: N335 des Autors, dann S24 Namen der Stufen); davor 0.2.87 Rückmeldung zu 0.2.86 (Opus, Zweig `rueckmeldung-0.2.86`: „Genauigkeit wie“ nur in der Auswertung als Segmentleiste mit Fragezeichen, „App“ statt „Mittelweg“, Tabellen ohne Überlauf, Trainer-Knopf als Symbol, Holz und Material eine Gruppe; Nächstes: Rückmeldung zu N336 bis N346); davor 0.2.86, Auswertung, Werkzeuge und Training übersichtlicher (Opus, Zweig `auswertung-ausbau`: Gewinnchance statt Bauern im Rückblick, „schlägt nicht zurück“, Nebenzweige „Besser war“ und „So wird der Fehler bestraft“, Engine-Wachhund gegen hängende Auswertung, Symbole und Genauigkeitsschalter in der Auswertung, Werkzeugkarten ohne „Mehr“, Werkzeugleiste scrollbar mit Symbolen, Partie-beginnen oben, Bot-Stufen aufklappbar, Trainingsseite mit Symbolen; Nächstes: Rückmeldung des Autors zu N336 bis N343); davor 0.2.85, Elo-Zahl der Bots (Opus, Zweig `bot-elo`, S23: Elo-Leiter aus 806 Partien, verankert an Stufe 1 bis 3 gegen sich selbst über „Deine Spielstärke“, Anker ab 83 % Genauigkeit gesättigt; Bereich je Stufe, Zahl je Bot, „über 2200“ als Grenze, feste Gegnerwertung in der Elo-Wertung; Stufe 3 schwächer, weil sie Stufe 4 ebenbürtig war; Nächstes: Test N335 des Autors abwarten, dann S24 Stufen 1 bis 4 schwächer und alle Bots neu messen); davor 0.2.84 neue Bretter nach der Auswahl des Autors (Opus, Zweig `bretter`: Farben Braun, Blau, Sand, Koralle, Lavendel, Nacht; „Holz“ heißt jetzt „Ahorn & Nussbaum“; Materialbretter Intarsie, Holz klassisch, Marmor grün von Lichess unter AGPL; goldener Rahmen der gewählten Kachel im Dunkelmodus; Nächstes: S23 Elo je Bot-Stufe nach Rücksprache mit dem anderen Chat); davor 0.2.83 Genauigkeit und Spielstärke neu geeicht und eingebaut (Opus, Zweig `eichung`: je 300 Partien von chess.com und Lichess mit Tiefe 18 nachgerechnet; Schalter „Genauigkeit wie“ Lichess/Mittelweg/nahe chess.com, Spielstärke als Mitte zweier Kurven mit Spanne, Karte „Deine Spielstärke“ über zehn Partien, Auswertung mit Tiefe 18; Nächstes: S23 Elo je Bot-Stufe, sobald die Bot-Messung Züge speichert); davor 0.2.82 Rückmeldung zu 0.2.80 (blinde Flecken bei eigener Stufe, Abschnitte eingeklappt mit Pfeil, Reiter nur waagerecht, Engine als Symbol am Brett) und neun neue Figurensätze aus der Auswahl des Autors (Opus, Zweig `layout-nachtrag`; Nächstes: Eichung Punkt 6, Bericht zu Schritt c an den Autor); davor 0.2.81 alle 64 Bots mit korrigiertem Stil gemessen und eingestellt (Opus, Zweig `werkzeuge-textarbeit`: Regeln gegen endloses Nachjustieren, zwei Stichproben je Grenzfall, höchstens eine Anpassung je Bot, ab Stufe 5 Vergleich mit der Stufe darunter; elf Bots gegenüber 0.2.67 geändert, Ergebnis in ENTSCHEIDUNGEN „Messung aller 64 Bots“; Saat-Verschiebung `MESSUNG_SAAT_AB` für zweite Stichproben); davor 0.2.80 Layout nach dem Wunsch des Autors: Einstellungen mit Reitern, Vorschau, Ringen und Erklärungen hinter Fragezeichen; Kapitelseiten mit „Training und Übungen“ in einer Karte, Abhaken über der Galerie und aufklappbaren Abschnitten; Spielen mit drei Gegnerkategorien und Engine-Knopf in der Partie statt der Hinweise; absichtliche Fehler nur für die eigene Stufe (S22) (Opus, Zweig `layout-einstellungen`; Nächstes: Eichung Punkt 6 weiter); davor 0.2.79 Plan „Genauigkeit und Spielstärke neu eichen“ festgehalten (Opus, Nächster Schritt Punkt 6); davor 0.2.78 Stil-Fehler behoben: Der Stil wählte nahe am besten Zug der Engine statt am Zug der Stufe, Bots mit Stil waren dadurch in den Stufen 1 bis 4 fast so stark wie die Engine; jetzt Bezug auf den Zug der Stufe, Anpassungen gegen „zu stark“ aus 0.2.74 bis 0.2.76 zurückgenommen (Opus, Zweig `werkzeuge-textarbeit`; Nächstes: 53 Bots mit korrigiertem Stil neu messen, Liste in `buch/arbeit` bzw. ENTSCHEIDUNGEN „Messung aller 64 Bots“, Ausreißer anpassen); davor 0.2.77 Messfehler behoben: Paarungen wurden am ersten Bindestrich getrennt, 25 Bots mit Bindestrich waren falsch gemessen; Frau Berger und Frau Ortega zurückgenommen, Yara mit Fleck „ruhig“ (Opus, Zweig `werkzeuge-textarbeit`; Nächstes: die 25 Bots neu messen, Ergebnis in ENTSCHEIDUNGEN „Ergebnis der Messung aller 64 Bots“ nachtragen, Ausreißer anpassen); davor 0.2.76 Bot-Messung Stufen 1 bis 6: Greta, Paul, Hanna und Elif nachgebessert, Leon, Ayşe und Sophie bleiben als Stärkste ihrer Stufe (verlieren gegen die nächsthöhere; benachbarte reine Stufen trennen 10 : 0) (Opus, Zweig `werkzeuge-textarbeit`; Nächstes: Matteo, Ben und die Stufen 7 und 8 messen, Ergebnis in ENTSCHEIDUNGEN „Ergebnis der Messung aller 64 Bots“ nachtragen, Ausreißer anpassen); davor 0.2.75 Aufgabenseite in der App (Opus, Zweig `autor-aufgaben`: `docs/AUFGABEN_AUTOR.md` als Seite nach drei Sekunden Druck aufs Zahnrad, Links, Haken, Notizen, Text für den Chat); davor 0.2.74 Messung aller 64 Bots, Stufen 1 bis 5 vollständig: zwölf zu starke und vier zu schwache Bots über Phasenstufe und teure Fehlerart angepasst (Fable, Zweig `werkzeuge-textarbeit`; Stufen 6 bis 8 laufen noch, Nächstes: deren Ergebnis auswerten und in ENTSCHEIDUNGEN nachtragen); davor 0.2.73 Lichess-Aufgaben im Training geprüft (angeschlossen), Lizenzen ergänzt, X5 nach Regel 9 (Opus, Zweig `lichess-lizenzen`); davor 0.2.72 Spielbewertung an sieben chess.com-Partien des Autors geeicht (Fable, Zweig `werkzeuge-textarbeit`: neue Stützstellen Genauigkeit → Spielstärke, etwa 500 Punkte tiefer, Abweichung zu chess.com im Mittel 0; Urteilswort je Phase als farbige Marke; Mittelspiel nach Taktik und Strategie getrennt, Regel des Sicherheitsblicks; Messlauf `messen:vergleich`); davor 0.2.71 30-Minuten-Plan (Opus, Zweig `dreissig-minuten`, AP 13 Stufe 3: geführte Einheit mit Uhr, Tag A und B im Wechsel, Bereiche des Studientags; damit alle Trainer spielbar); davor 0.2.70 Abweichungsmodus (Opus, Zweig `abweichung`, AP 13 Stufe 3: die Engine verlässt das Buch, der Leser antwortet, Bewertung und Einschätzung); davor 0.2.69 Planbilanz-Übung (Opus, Zweig `planbilanz`, AP 13 Stufe 3: Planfragen mit Antwortauswahl, LAP, Wettrennen); davor 0.2.68 Werkzeugabweichungen aus der Textarbeit geprüft (Fable, Zweig `werkzeuge-textarbeit`: neun von zwölf Gruppen waren erledigt, Isolani-Besitzer in der Richtung und Sonderfall 6. Reihe aus Verteidigersicht umgesetzt, Zeit-Zählhilfe als Buchbefund B6); davor 0.2.67 64 Gegner mit Porträts (Fable, Zweig `bots-galerie`: acht Bots je Stufe mit Stil, Fehlerliste und blinden Flecken, Porträts aus DiceBear „Personas“, Gegnerwahl als Porträtgitter mit Sprechblase, Messung je Bot); davor 0.2.66 Denkroutine-Trainer (Opus, Zweig `denkroutine`, AP 13 Stufe 3: eine Minute, zwei Kandidaten mit stärkster Antwort, Vergleich mit der Engine); davor 0.2.65 Fehlerdatenbank (Opus, Zweig `fehlerdatenbank`, AP 13 Stufe 3: Einträge mit Stellung, Satz und Fehlerart der Gesamt-Checkliste, Auswertung je Woche, Trainer-Vorschlag, Knopf im Rückblick; Nutzerdaten Format 4); davor 0.2.64 Leerfälle der Werkzeugkarten (Opus, Zweig `leerfaelle`, U12: ein Satz statt leerer Befunde, kein doppelter Satz; Schicht `ui/werkzeuge/leerfall.ts`); davor 0.2.63 Datenschutz: E-Mail-Weiterleitung an goneo (Opus); davor 0.2.62 Impressum und Datenschutz mit den Angaben des Autors (E1, E2 erledigt); davor 0.2.61 Rückmeldung des Autors zu 0.2.56 (Opus, Zweig `rueckmeldung-0.2.56`: S9 gewertete Partie ohne Rücknahme und Spielhilfen, S12 nur Stellungen mit möglichen Umwandlungen (Stockfish beendet sich sonst), S13 Stil-Toleranz 0,3 mit Hinweis, S17 Phase der Buchstellungen nach dem Glossar mit „rochiert haben“ aus den Buchzügen, U5 Sonderzüge an Abb. 0.12 bis 0.19, W5 Strukturerkenner mit starken Feldern zuerst, W9 Urteil der Faktorenbilanz des Buches, W10 Warum-Fragen im Repertoire-Trainer, W12 Engine-Vergleich beim Zugerraten; X, S, R, W und U bis auf X5 und U12 erledigt; Befund D2 Glossar gegen Steckbriefe); davor 0.2.60 Abhakliste der Fehlerarten (Fable, Zweig `fehlerarten-abhakliste`, Rest aus S7: Karte „Absichtliche Fehler der Engine“ in den Einstellungen, Vorliebe `erlaubteFehlerarten`, Schnitt mit der Liste der vorgefertigten Gegner beim Anlegen einer Partie); davor 0.2.59 Brillant zweiter Schritt (Fable, Zweig `brillant-annehmbar`: Opfer nur, wenn der Gegner die Figur legal nehmen kann; gezogene Figur zählt auch schon angegriffen; Opfererkennung in `engine/opfer.ts`; Prüfstand 59 von 100 bei 19 Fehlalarmen); davor 0.2.58 Anmerkungen des Autors vom Abend (Fable, Zweig `oberflaeche-toene`: Töne für Schach, Matt, Remis und Warnung; roter Hinweis und Satz bei gesperrter Figur; Schlagring statt Punkt; Figurensatz „Holz“ jetzt Merida; Stern für gewertete Partien); davor 0.2.57 blinde Flecken vollständig (Fable, Zweig `blinde-flecken-2`: Röntgen, Zwischenzug, Grundreihe; Blindheit auch gegenüber gegnerischen Zügen dieser Art; Messung mit allen Flecken); davor 0.2.56 Engine-Variante im Rückblick (Fable, Zweig `rueckblick-variante`, Empfehlung R5: Hauptvariante je Stellung gespeichert, Rückblickkarte „Danach etwa …“); davor 0.2.55 Nachlesen im Buch zu allen Rückfragen (Opus: X1 9.23/9.41, X2 9.42, X4, C1, C2, C5, T1, U6, W6/T5, W11, E3 umgesetzt; S17, C3, W5, U5, D1 beim Autor); davor 0.2.54 Brillant am Prüfstand von chess.com (Fable, Zweig `opfer-pruefstand`: Opfer ab Netto 1, nur die gezogene Figur darf vorher schon angegriffen sein, brillant nur bei gutem Stand danach, nicht aus dem Schach, zweitbester nicht ohnehin gewinnend; 100 Brillant-Züge aus chess.com-Partien als lokaler Prüfstand); davor 0.2.53 Studien lösen und Zug erraten (Opus, AP 13 Stufe 3: Zugfolgen aus Kapitel 10 und 11, Rückfragen W11, W12); davor 0.2.52 Stufen 1 bis 3 menschlicher (Fable, Zweig `stufen-menschlich`, Empfehlung R4: Tiefengrenze statt Skill Level 0, gewichtete Zugwahl mit Temperatur, Fehlerneigung nach Lage, Strähne und Tagesform; Stufen neu gemessen); davor 0.2.51 Vergleich mit chess.com an drei Partien (Fable: Abtausch ist kein Opfer mehr, „stark“ nur vor klarem Gewinn, S18 Spielstärke aus der Genauigkeit, T4 Fallen aus Kapitel 2 und 3, in entschiedener Stellung „?!“ erst ab drei Bauern und kein „!“, 2 s Rechenzeit während der Partie; neue Regel 9 in CLAUDE.md: Empfehlungen gleich umsetzen); davor 0.2.50 Genauigkeit wie bei chess.com (Fable, Zweig `auswertung-chesscom`: Genauigkeit wie bei Lichess aus gewichtetem und harmonischem Mittel, „verpasst“ vor „patzer“, „bester“ nur der Zug der Engine, Platzhalter in der Zeile „Zeichen“ behoben; Rechentiefe war nicht die Ursache); davor 0.2.49 Endspieltrainer (Fable, Zweig `endspieltrainer`: 78 Buchstellungen aus Kapitel 8 und 9 mit Stockfish geprüft, gegen die Engine gewinnen oder Remis halten, Kippen erkannt, gestufte Hilfen); davor 0.2.48 Zielbilanz-Übung, Faktorenbilanz- und Repertoire-Trainer (Opus, AP 13, Buchstellungen und Zugfolgen der Kapitel 2 und 3, Lösung aus den Werkzeugen und dem Buch); davor 0.2.47 Empfehlungen vorab umgesetzt (Opus: S9 Rücknahme ungewertet, K5 kein „??“ bei klarem Gewinn, R3 „Geschätzte Spielstärke“, C8 kein Minderheitsangriff gegen vorgerückten Kandidaten, T1 gleich gute Engine-Züge in vier Übungen, U9 Wiederholung für Taktik und Falle; Widerspruch des Autors genügt); davor 0.2.46 Bots mit Persönlichkeit (Fable: blinde Flecken als Zugarten, die ein Gegner nicht sieht; 18 vorgefertigte Gegner mit eigener Fehlerliste und blinden Flecken; Stufen je Phase verborgen; blinde Flecken auch für eigene Gegner); davor 0.2.45 AP 13 Teil 3 (Opus): Taktiktrainer, „Falle oder Köder“ und Strukturerkenner auf Fables Trainerdaten, Hinweis „Nur dieser Zug“ bei Übungen, Empfehlungen zu allen offenen Rückfragen in `docs/AUFGABEN_AUTOR.md`; davor Lesart der Phase: Mittelspiel, sobald eine Seite entwickelt ist oder das Material ungleich ist; „Bauern entscheiden“ nur bei Freibauer oder wenig Material; Erklärung am Phasenwechsel im Rückblick (Befund S17: Abb. 11.4); davor 0.2.43 „M“ und „E“ in der Zugliste, Zusatzregel „Zug 15“ gestrichen; davor 0.2.42 Ergänzungen des Autors vom Abend (Fable: Wertung nur aus der Grundstellung, Wertung zurücksetzen, eigene Gegner mit Fehlerarten und Spielstil, Wertungskurve je Phase); davor 0.2.41 Spielen nach den Wünschen des Autors vom Nachmittag (Fable: zwölf vorgefertigte Gegner, Mensch gegen Mensch, Spielhilfen zuschaltbar, Partienkachel mit Ergebnis und Stärke beider Seiten, Wertung nach Elo mit Kurve in den Einstellungen, Zusatzregeln für die Phase, Stellungseditor); davor 0.2.40 Spielen nach den Ideen des Autors (Fable: Zugklassen wie bei chess.com, Phasen in Kurve und Spielstärke, Auswertung im Hintergrund, Stufe je Phase, Fehlerprofile je Phase); davor 0.2.39 Rückmeldung zum Nachtest bis N174 (Fable, Zweig `rueckmeldung-0.2.39`: Figurensätze, Nummernsprung, Werkzeugtexte, Rückblick-Karte mit Erklärung, „!“, Spielstärke, Eröffnung wählen) und die Trainerdaten (Fable, Zweig `trainerdaten`, zusammengeführt); davor 0.2.38 H Rückblick nach der Partie (Zweig `rueckblick`); 0.2.37 AP 13 Teil 1 und 2: Übungen des Buches lösen, Wiederholung, erste Trainer (Opus, Zweig `nacht-ap13`; davor 0.2.36 AP 11 Kalibrierung (Fable), 0.2.35 neuer Buchstand, 0.2.34 erster Stand im öffentlichen Repository `dobili/SvGa_Public`) · Nächstes: Nachtest N182 bis N200, Rückfragen U1 bis U11 in `docs/AUFGABEN_AUTOR.md`; Trainerdaten von Fable zusammenführen · Die ganze ältere Arbeitsgeschichte (Prüfhilfen, Berichte, Archiv) liegt im früheren privaten Repository des Autors
Stand: 24.10.2026 nachts · **Version 0.2.123** (P1, Opus): Bereich Spielen ohne Kalibrierung fertig: R54 Partienliste mit „Filter“ und „Sortieren“ (Variante A), R28 Bot mit Porträt als Titel, R27 „Art des Gegners“ direkt über „Partie beginnen“, R51 Anzeigeteil (Zeitklasse aus der Bedenkzeit in Liste und Filter, gewertet nur mit Uhr, 60 + 0; `spiel/zeitklasse.ts`), R24 Bot bleibt nach dem Buch in der Familie der Lichess-Liste (`schach/eroeffnungsfamilie.ts`). Offen: R26 Abschluss, P8 Teil B (Touren für Spielen, im Chat P8). Davor 0.2.122: neue Auswertung R55/R56 (Umschalter Weiß/Schwarz, Fehler und Patzer eingeklappt, Ring und Balken, Zugklassen als Bullet-Diagramm mit vorläufiger Vergleichstabelle `spiel/zugklassenvergleich.ts`, Zoom und Fingerfahren der Kurve). Davor 0.2.124: P8 App-Tour Teil A eingemischt (Toursymbol, Rundgang, 32 Touren), Aufgabenseite erkennt Paketrückfragen wie P8-1. Davor 0.2.120: Startanimation 2,5 s bei jedem Start, abschaltbar (Wunsch des Autors, P2-A); R32 Spielstärke nur aus gewerteten Partien, Haken bleibt; Werkzeug-Befunde aus P4 behoben. R51 macht der Bot-Chat (Teil F seines Restplans), R24, R27, R28, P8 und R26 nach der Kalibrierung. Davor 0.2.119: P2 fertig eingemischt (R39 Startanimation, R40 zwei Spalten ab 5 : 4, R53), dazu P4 Trainerinhalte (R50 Falle oder Köder, R48 Planbilanz, R47 Endspieltrainer, R49 Strukturerkenner; Fable) und die letzten P6-Anpassungen. Davor 0.2.118: R15 bis R23 und R33 dazu P2 (R35–R38, R29), P3 (R41–R44), P5 (R30, R31, R45, R46) und P6 (R25, englische Buchdaten in der App eingeschaltet) eingemischt; nach main gebracht, obwohl die Bot-Kalibrierung noch läuft (Wunsch des Autors, sie dauert noch Stunden). Davor: Zweig `weiter-ohne-autor`: R15 bis R23 fertig (Aufklapplisten, Zahleneingabe, Ortsmarken der Trainingsseiten, Urteil der Engine nach der Einschätzung, Denkroutine am Brett, Faktorenbilanz mit Waagen, Musterlösungen geprüft, Partienliste mit Symbolfiltern, PGN-Import); main 0.2.117 (zehn Stufen, Format 6) am 23.10.2026 eingemischt. **Nächster Schritt:** Arbeitsplan der Pakete P1 ff. unten („Arbeitsplan ab 23.10.2026“). Davor: 22.10.2026 · **Version 0.2.117** (Zweig `menschliche-bots`, nach main übernommen): menschliche Zusatzfehler der Bots (Lichess-Daten, `engine/menschenwahl.ts`, `pipeline/menschenprofil/`), Bedenkzeit, sichtbare Wartezeit ±10 %, Notmodus mit Vorzügen (`spiel/notmodus.ts`, `ui/komponenten/botzug.ts`), 3+2 und 3+0, **zehn Stufen** (Grundschicht `engine/grundschicht.ts`, geeicht: 250, 400, 715, 1050, 1350, 1700, 2140, 2440, 2700, 2970), Speicherformat 6 (`speicher/stufenskala.ts`), 64 Bots in Gruppen 1–10 nach gemessener Zahl (5 bis 8 je Gruppe, `engine/botgruppe.ts`), Spaß-Bots 430–1180, Abzug der Zusatzfehler je Stufe und Uhrabzug (3+0 −265, 10+0 −100, mit Zuschlag 0) in `engine/botstaerke-daten.ts` (Messung `buch/arbeit/botelo3`, nur lokal; Auswertung mit `BOTELO_ORDNER=../buch/arbeit/botelo3 npx vitest run --config vitest.messung.config.ts src/engine/botstaerke.messung.ts`). Testpunkte N620–N627 in AUFGABEN_AUTOR. Bekannt: Der Oberflächentest „Alle Daten löschen“ ist in der Cloud-Umgebung unzuverlässig (auch auf main 2 von 5 Läufen rot), in GitHub Actions grün. **Nächster Schritt:** Rückmeldung des Autors zu N620–N627 abwarten; offene Arbeitsliste R15 ff. (siehe unten). Davor: 19.10.2026 · **Version 0.2.116**, Arbeitsliste R1 bis R26 begonnen (Opus: R1 Aufgabenliste geleert, CLAUDE.md V2; R2 „KI“ statt „Claude“; R3 bis R8 Texte, Reiter Training, Leiste nur Symbole, Bots nach Stärke, Stufennamen; R9 bis R11 Aufklapper mit Erklärung, Zeichen der Zielbilanz; R12 Klappen Spielhilfen und Eröffnung; R13 Buchzitate englisch, Englisch in 1.0; R14 Aufgabe wiederholen; Nächstes: R15); davor 0.2.115, Buchbefunde ins Buch übernommen (Opus: B6, B7, B8, ZF4, D2 im Buch-Repository auf Zweig `claude/funny-bardeen-e7wpzs`, Daten von Kapitel 3, 8 und 12 neu gebaut, Werkzeugkasten-Seite angepasst, D1 erledigt; Nächstes: Autor übernimmt den Buchzweig nach `main`); davor 0.2.114, Buchbefunde nachgeprüft und Links in Kapitel 12 getestet (Opus, nur Aufgabenliste: B6 neu bewertet, B7 ergänzt, neuer Befund B8 schachtraining.de, ZF4 nachgeprüft; Formulierungsvorschläge an den Autor im Chat); davor 0.2.113, Lektorat, Einzahl und Mehrzahl, Lizenzseite, Vorprüfung der Testliste (Opus, Zweig `weiter-ohne-autor`: `tZahl()` für 1 und 0, Texte in de und en lektoriert, Fehler N402 „Du übersieht“ behoben, Erklärung der Wertung berichtigt, Lizenztexte der npm-Pakete aus dem Build, Quellcode als Link, 26 Testpunkte gestrichen und zehn gekürzt, Buchbefund B7 Lichess-Adresse; Nächstes: Antworten des Autors); davor 0.2.112, Hinweise je Gerät und Kleinkram ohne Autor (Hinweis für zu alte Geräte, Sieben-Tage-Hinweis in Safari, Test „jede Abbildungsnummer öffnet“, robots.txt und sitemap.xml, Sicherheits-Kopfzeilen, Spielen.tsx unter 400 Zeilen, CLAUDE.md zu Cloudflare); davor 0.2.111, Datenschutz und Impressum ergänzt (Lücken aus einem e-recht24-Scan), Cloudflare Web Analytics im Dashboard abgeschaltet, Test gegen fremde Adressen (Opus, Zweig `datenschutz-luecken`); davor 0.2.110 App-Symbol knackiger (Opus, Zweig `symbol-knackig`: mehr Kontrast, etwas Sättigung und Schärfe, dunklerer Rand, 180 und 192 Pixel in voller Farbtiefe; Nächstes: N490); davor 0.2.109, Bot-Gruppen ohne Überschneidung (Opus, Zweig `bot-gruppen`: acht Bots tauschen paarweise die Gruppe der Gegnerwahl, `engine/botgruppe.ts`, ohne neue Messung; Nächstes: N585); davor 0.2.108, Version 1.0 vorbereitet, nicht veröffentlicht (Opus, Zweig `ap17-vorbereitung`: Abnahmeliste `docs/ABNAHME_1.0.md`, Bau `npm run build:veroeffentlichung` ohne Aufgabenseite und englische Vorschau, Datenprüfung `--veroeffentlichung` gegen Entwürfe, Rückfragen V1 bis V6; Nächstes: Antworten des Autors, endgültiges Buch); davor 0.2.107, Testpunkte 0.2.98 bis 0.2.101 vorgeprüft (Opus, Zweig `testpunkte-vorpruefen`: 27 Punkte mit der gebauten App geprüft und gestrichen, N460 überholt, sieben gekürzt geblieben; „1 Zug“ in der Partienliste; Nächstes: Version 1.0 vorbereiten); davor 0.2.106, Farbabstimmung DS30 bis DS37 (Opus, Zweig `farbabstimmung`: Porträts ohne eingebauten Hintergrund, helles Navy im hellen Modus; Haken und Regler in App-Farben; Zahlkreise und Stufenmarken im Dunkeln mit Rand; Rahmen der Bedienelemente 3:1; App-Symbol aus dem goldenen Springer des Covers; vom Autor freigegeben; Nächstes: N483 bis N489); davor 0.2.105, kurze Partien zählen für die Wertung (Opus, Zweig `wertung-kurze-partien`: Die Elo-Wertung verlangt keine Schätzung des Gegners mehr, dessen Zahl seit 0.2.85 fest ist; seit 0.2.103 fielen schnelle Siege gegen Spaß-Bots sonst heraus; Nächstes: N584); davor 0.2.104, englische Fassung als Vorschau (Opus, Zweig `englisch`: en.json mit allen Texten außer 27 Buchzitaten, englische Notation überall, Zahlen und Daten nach der Sprache, Kürzel am Brett in der Sprachdatei, Buchdaten weiter deutsch; Nächstes: N409, Rückfragen EN1 bis EN3); davor 0.2.103, Spielstärke nur bis zur Entscheidung der Partie (Opus, Zweig `genauigkeit-bis-entscheidung`, Wunsch des Autors: Züge nach dem Punkt, ab dem eine Seite dauerhaft mindestens 90 % Gewinnchance hat, zählen nicht mehr für Spielstärke und Urteilswort; Kurven Genauigkeit → Spielstärke an 600 neu gesammelten Partien neu geeicht, Bot-Zahlen über die Anker um 212 tiefer, Bots selbst unverändert; Nächstes: N580 bis N583; GE1 vom Autor mit „so lassen“ entschieden); davor 0.2.102, Uhr beim Verlassen sofort gesichert (Opus, Zweig `uhr-sichern`, N180: angehaltener Uhrstand zusätzlich synchron im Gerätespeicher, weil ein Neuladen das Schreiben in IndexedDB abbricht; Nächstes: englische Fassung, Zweig `englisch`); davor 0.2.101, Symbolsprache DS19 bis DS29 (Opus, Zweig `symbolsprache`: Stufenmarken in Gürtelfarben, ein Aufklappzeichen, Pfeil für Weiter, Zeichen an Knöpfen und Überschriften, Ergebnismarke, Phasenzeichen, Fortschritt an der Kapitelnummer, Werkzeugzeichen, Glossar nach Buchstaben; vom Autor freigegeben; Nächstes: N475 bis N482); davor 0.2.100, Porträtwahl mit Vorschaubildern (Opus, Zweig `portraet-bildauswahl`: Aufklappmenü mit allen 30 Porträts nach Altersgruppen statt Auswahlmenü ohne Bilder; Nächstes: N469); davor 0.2.99, Wünsche des Autors vom 19.10.2026 morgens (Opus, Zweig `spielen-sammlung-nachschlagen`: Spielhilfen über „Partie beginnen“, Porträts für eigene Bots, Stern für besiegte Bots, Partienliste mit Porträt, Filter und Löschen, Zeichen für Warum-Fragen in der Kapitelübersicht mit Fortschritt, Nachschlagen mit Steckbriefen und Werkzeugen; Nächstes: N468 bis N474); davor 0.2.98, Design-Überprüfung (Opus, Zweig `design-ueberarbeitung`: alle 18 Vorschläge DS1 bis DS18 vom Autor angenommen, Schrift folgt dem Gerät, Querformat und Tablet mit Brett links, beschriftete Brettsymbole, Tippflächen 44 px; Nächstes: N450 bis N467); davor 0.2.97, Datenlauf mit dem Buchstand vom 17.10.2026 (`schachbuch-quellen` 931597a; Opus, Zweig `buchstand-neu`: an allen 765 Abbildungen Stellung, Pfeile, Felder, Unterschrift und Nummern unverändert; geändert nur die Literaturnummern in vier Glossareinträgen ([12]→[14], [10]→[11], [13]→[15], [14]→[16]), Zeilenangaben der Fundstellen und die Prüfsummen, die seit dem Nachtrag der Klartextzüge (0.2.94) nicht neu gerechnet waren; Nächstes: Rückmeldung des Autors); davor 0.2.96, konstruierte Zugfolgen und Tablebase (Opus, Zweig `zugfolgen-konstruiert`: 29 Partien ab der Grundstellung zu Abbildungen ohne Zugfolge, Status „konstruiert“ mit Hinweis in der App, Einordnung aller 67 in `inhalte/de/konstruktion.json`, Tablebase-Prüfung der Endspiele; Nächstes: Rückfragen ZF1 bis ZF4, Abb. 7.24 offen); davor 0.2.95, Befunde aus dem Durchprüfen der Aufgabenliste behoben: „Zurück zu den Aufgaben“ führt wieder zum Punkt, Pfeil und Figur bei Hinweis 2 und 3 im Endspieltrainer, „..“ nach „Warum?“, Uhranzeige nach dem Hintergrund, Einzahl, Abbildung beim Zug ausführen, kein Satz über Enginefehler bei Partien zu zweit (Opus, Zweig `aufgaben-zurueck`; Aufgabenliste entlastet auf Zweig `claude/aufgabenliste-entlasten-6y3tgp`); davor 0.2.94 Technik für die englische Fassung (Chat E, Opus, Zweig `sprache-technik`: Sprachwahl nach Gerät, `<html lang>`, Buchdaten je Sprache, Lizenztexte in de.json, Klartextzüge der Unterschriften in der Pipeline); davor 0.2.93 Lernsammlung (Chat E, Opus, Zweig `lernsammlung`: eigene Stellungen mit Plan und Notiz aus Abbildung, Partie und Trainer, nach Eröffnung geordnet, Abfrage, PGN für Lichess-Studien, Nutzerdaten Format 5); davor 0.2.92 Ziehen per Wischen (Chat E, Opus, Zweig `ziehen-wischen`: Figuren mit Finger oder Maus ziehen, nur auf ziehbaren Figuren, abschaltbar in den Einstellungen); davor 0.2.91 Endspiel-Kurzübungen (Quadrat, Opposition, Schlüsselfelder, Erkennungsbild-Quiz; `training/endspieldrills.ts`, `ui/trainer/Drillaufgabe.tsx`), Referenzergebnisse aller Werkzeuge (`src/analyse/__referenz__/werkzeuge.txt`), `speicher/partienLesen.ts` abgetrennt (Opus, Chat A, Zweig `nacht-stabilitaet`; Nächstes: Rückmeldung des Autors zu N400 bis N408 und NA1); davor 0.2.90 Nachtarbeit Chat A (Opus, Zweig `nacht-stabilitaet`: Engine-Tests mit fester Tiefe 16, axe auf Spielen/Partie/Auswertung/Trainern/Dunkelmodus, 360 px, `/training/*` ohne Zwischenspeicher; Uhr 10+0 im 30-Minuten-Plan; Gewinnchance im Zugurteil und in der Falle; Gabel mit Figurennamen; Sicherung teilen; Kontrast am Bewertungsbalken; „Erst selbst denken“ auch vor Werkzeugen (Einstellung, Voreinstellung aus, NA1); Wiederholung für Struktur und Endspiel; Trefferzahl bei Zug erraten und Planstand in den Nutzerdaten); davor 0.2.89 gleich große Kacheln in der Gegnerwahl (Opus, Zweig `kacheln-gleich`: Spalten minmax(0, 1fr), Namen brechen um; Nächstes wie bei 0.2.88); davor 0.2.88 Spaß-Bots und Zahlen über 2200 (Opus, Zweig `spass-bots`: Gruppe „Zum Spaß“ mit Fritzi, Onkel Willi, Tante Trude, Bruno, etwa 600 bis 1100, Zufallszüge 60/38/25/15 %; Stufe 5 bis 8 mit der Zahl der Elo-Leiter statt „über 2200“; Nächstes: N335 des Autors, dann S24 Namen der Stufen); davor 0.2.87 Rückmeldung zu 0.2.86 (Opus, Zweig `rueckmeldung-0.2.86`: „Genauigkeit wie“ nur in der Auswertung als Segmentleiste mit Fragezeichen, „App“ statt „Mittelweg“, Tabellen ohne Überlauf, Trainer-Knopf als Symbol, Holz und Material eine Gruppe; Nächstes: Rückmeldung zu N336 bis N346); davor 0.2.86, Auswertung, Werkzeuge und Training übersichtlicher (Opus, Zweig `auswertung-ausbau`: Gewinnchance statt Bauern im Rückblick, „schlägt nicht zurück“, Nebenzweige „Besser war“ und „So wird der Fehler bestraft“, Engine-Wachhund gegen hängende Auswertung, Symbole und Genauigkeitsschalter in der Auswertung, Werkzeugkarten ohne „Mehr“, Werkzeugleiste scrollbar mit Symbolen, Partie-beginnen oben, Bot-Stufen aufklappbar, Trainingsseite mit Symbolen; Nächstes: Rückmeldung des Autors zu N336 bis N343); davor 0.2.85, Elo-Zahl der Bots (Opus, Zweig `bot-elo`, S23: Elo-Leiter aus 806 Partien, verankert an Stufe 1 bis 3 gegen sich selbst über „Deine Spielstärke“, Anker ab 83 % Genauigkeit gesättigt; Bereich je Stufe, Zahl je Bot, „über 2200“ als Grenze, feste Gegnerwertung in der Elo-Wertung; Stufe 3 schwächer, weil sie Stufe 4 ebenbürtig war; Nächstes: Test N335 des Autors abwarten, dann S24 Stufen 1 bis 4 schwächer und alle Bots neu messen); davor 0.2.84 neue Bretter nach der Auswahl des Autors (Opus, Zweig `bretter`: Farben Braun, Blau, Sand, Koralle, Lavendel, Nacht; „Holz“ heißt jetzt „Ahorn & Nussbaum“; Materialbretter Intarsie, Holz klassisch, Marmor grün von Lichess unter AGPL; goldener Rahmen der gewählten Kachel im Dunkelmodus; Nächstes: S23 Elo je Bot-Stufe nach Rücksprache mit dem anderen Chat); davor 0.2.83 Genauigkeit und Spielstärke neu geeicht und eingebaut (Opus, Zweig `eichung`: je 300 Partien von chess.com und Lichess mit Tiefe 18 nachgerechnet; Schalter „Genauigkeit wie“ Lichess/Mittelweg/nahe chess.com, Spielstärke als Mitte zweier Kurven mit Spanne, Karte „Deine Spielstärke“ über zehn Partien, Auswertung mit Tiefe 18; Nächstes: S23 Elo je Bot-Stufe, sobald die Bot-Messung Züge speichert); davor 0.2.82 Rückmeldung zu 0.2.80 (blinde Flecken bei eigener Stufe, Abschnitte eingeklappt mit Pfeil, Reiter nur waagerecht, Engine als Symbol am Brett) und neun neue Figurensätze aus der Auswahl des Autors (Opus, Zweig `layout-nachtrag`; Nächstes: Eichung Punkt 6, Bericht zu Schritt c an den Autor); davor 0.2.81 alle 64 Bots mit korrigiertem Stil gemessen und eingestellt (Opus, Zweig `werkzeuge-textarbeit`: Regeln gegen endloses Nachjustieren, zwei Stichproben je Grenzfall, höchstens eine Anpassung je Bot, ab Stufe 5 Vergleich mit der Stufe darunter; elf Bots gegenüber 0.2.67 geändert, Ergebnis in ENTSCHEIDUNGEN „Messung aller 64 Bots“; Saat-Verschiebung `MESSUNG_SAAT_AB` für zweite Stichproben); davor 0.2.80 Layout nach dem Wunsch des Autors: Einstellungen mit Reitern, Vorschau, Ringen und Erklärungen hinter Fragezeichen; Kapitelseiten mit „Training und Übungen“ in einer Karte, Abhaken über der Galerie und aufklappbaren Abschnitten; Spielen mit drei Gegnerkategorien und Engine-Knopf in der Partie statt der Hinweise; absichtliche Fehler nur für die eigene Stufe (S22) (Opus, Zweig `layout-einstellungen`; Nächstes: Eichung Punkt 6 weiter); davor 0.2.79 Plan „Genauigkeit und Spielstärke neu eichen“ festgehalten (Opus, Nächster Schritt Punkt 6); davor 0.2.78 Stil-Fehler behoben: Der Stil wählte nahe am besten Zug der Engine statt am Zug der Stufe, Bots mit Stil waren dadurch in den Stufen 1 bis 4 fast so stark wie die Engine; jetzt Bezug auf den Zug der Stufe, Anpassungen gegen „zu stark“ aus 0.2.74 bis 0.2.76 zurückgenommen (Opus, Zweig `werkzeuge-textarbeit`; Nächstes: 53 Bots mit korrigiertem Stil neu messen, Liste in `buch/arbeit` bzw. ENTSCHEIDUNGEN „Messung aller 64 Bots“, Ausreißer anpassen); davor 0.2.77 Messfehler behoben: Paarungen wurden am ersten Bindestrich getrennt, 25 Bots mit Bindestrich waren falsch gemessen; Frau Berger und Frau Ortega zurückgenommen, Yara mit Fleck „ruhig“ (Opus, Zweig `werkzeuge-textarbeit`; Nächstes: die 25 Bots neu messen, Ergebnis in ENTSCHEIDUNGEN „Ergebnis der Messung aller 64 Bots“ nachtragen, Ausreißer anpassen); davor 0.2.76 Bot-Messung Stufen 1 bis 6: Greta, Paul, Hanna und Elif nachgebessert, Leon, Ayşe und Sophie bleiben als Stärkste ihrer Stufe (verlieren gegen die nächsthöhere; benachbarte reine Stufen trennen 10 : 0) (Opus, Zweig `werkzeuge-textarbeit`; Nächstes: Matteo, Ben und die Stufen 7 und 8 messen, Ergebnis in ENTSCHEIDUNGEN „Ergebnis der Messung aller 64 Bots“ nachtragen, Ausreißer anpassen); davor 0.2.75 Aufgabenseite in der App (Opus, Zweig `autor-aufgaben`: `docs/AUFGABEN_AUTOR.md` als Seite nach drei Sekunden Druck aufs Zahnrad, Links, Haken, Notizen, Text für den Chat); davor 0.2.74 Messung aller 64 Bots, Stufen 1 bis 5 vollständig: zwölf zu starke und vier zu schwache Bots über Phasenstufe und teure Fehlerart angepasst (Fable, Zweig `werkzeuge-textarbeit`; Stufen 6 bis 8 laufen noch, Nächstes: deren Ergebnis auswerten und in ENTSCHEIDUNGEN nachtragen); davor 0.2.73 Lichess-Aufgaben im Training geprüft (angeschlossen), Lizenzen ergänzt, X5 nach Regel 9 (Opus, Zweig `lichess-lizenzen`); davor 0.2.72 Spielbewertung an sieben chess.com-Partien des Autors geeicht (Fable, Zweig `werkzeuge-textarbeit`: neue Stützstellen Genauigkeit → Spielstärke, etwa 500 Punkte tiefer, Abweichung zu chess.com im Mittel 0; Urteilswort je Phase als farbige Marke; Mittelspiel nach Taktik und Strategie getrennt, Regel des Sicherheitsblicks; Messlauf `messen:vergleich`); davor 0.2.71 30-Minuten-Plan (Opus, Zweig `dreissig-minuten`, AP 13 Stufe 3: geführte Einheit mit Uhr, Tag A und B im Wechsel, Bereiche des Studientags; damit alle Trainer spielbar); davor 0.2.70 Abweichungsmodus (Opus, Zweig `abweichung`, AP 13 Stufe 3: die Engine verlässt das Buch, der Leser antwortet, Bewertung und Einschätzung); davor 0.2.69 Planbilanz-Übung (Opus, Zweig `planbilanz`, AP 13 Stufe 3: Planfragen mit Antwortauswahl, LAP, Wettrennen); davor 0.2.68 Werkzeugabweichungen aus der Textarbeit geprüft (Fable, Zweig `werkzeuge-textarbeit`: neun von zwölf Gruppen waren erledigt, Isolani-Besitzer in der Richtung und Sonderfall 6. Reihe aus Verteidigersicht umgesetzt, Zeit-Zählhilfe als Buchbefund B6); davor 0.2.67 64 Gegner mit Porträts (Fable, Zweig `bots-galerie`: acht Bots je Stufe mit Stil, Fehlerliste und blinden Flecken, Porträts aus DiceBear „Personas“, Gegnerwahl als Porträtgitter mit Sprechblase, Messung je Bot); davor 0.2.66 Denkroutine-Trainer (Opus, Zweig `denkroutine`, AP 13 Stufe 3: eine Minute, zwei Kandidaten mit stärkster Antwort, Vergleich mit der Engine); davor 0.2.65 Fehlerdatenbank (Opus, Zweig `fehlerdatenbank`, AP 13 Stufe 3: Einträge mit Stellung, Satz und Fehlerart der Gesamt-Checkliste, Auswertung je Woche, Trainer-Vorschlag, Knopf im Rückblick; Nutzerdaten Format 4); davor 0.2.64 Leerfälle der Werkzeugkarten (Opus, Zweig `leerfaelle`, U12: ein Satz statt leerer Befunde, kein doppelter Satz; Schicht `ui/werkzeuge/leerfall.ts`); davor 0.2.63 Datenschutz: E-Mail-Weiterleitung an goneo (Opus); davor 0.2.62 Impressum und Datenschutz mit den Angaben des Autors (E1, E2 erledigt); davor 0.2.61 Rückmeldung des Autors zu 0.2.56 (Opus, Zweig `rueckmeldung-0.2.56`: S9 gewertete Partie ohne Rücknahme und Spielhilfen, S12 nur Stellungen mit möglichen Umwandlungen (Stockfish beendet sich sonst), S13 Stil-Toleranz 0,3 mit Hinweis, S17 Phase der Buchstellungen nach dem Glossar mit „rochiert haben“ aus den Buchzügen, U5 Sonderzüge an Abb. 0.12 bis 0.19, W5 Strukturerkenner mit starken Feldern zuerst, W9 Urteil der Faktorenbilanz des Buches, W10 Warum-Fragen im Repertoire-Trainer, W12 Engine-Vergleich beim Zugerraten; X, S, R, W und U bis auf X5 und U12 erledigt; Befund D2 Glossar gegen Steckbriefe); davor 0.2.60 Abhakliste der Fehlerarten (Fable, Zweig `fehlerarten-abhakliste`, Rest aus S7: Karte „Absichtliche Fehler der Engine“ in den Einstellungen, Vorliebe `erlaubteFehlerarten`, Schnitt mit der Liste der vorgefertigten Gegner beim Anlegen einer Partie); davor 0.2.59 Brillant zweiter Schritt (Fable, Zweig `brillant-annehmbar`: Opfer nur, wenn der Gegner die Figur legal nehmen kann; gezogene Figur zählt auch schon angegriffen; Opfererkennung in `engine/opfer.ts`; Prüfstand 59 von 100 bei 19 Fehlalarmen); davor 0.2.58 Anmerkungen des Autors vom Abend (Fable, Zweig `oberflaeche-toene`: Töne für Schach, Matt, Remis und Warnung; roter Hinweis und Satz bei gesperrter Figur; Schlagring statt Punkt; Figurensatz „Holz“ jetzt Merida; Stern für gewertete Partien); davor 0.2.57 blinde Flecken vollständig (Fable, Zweig `blinde-flecken-2`: Röntgen, Zwischenzug, Grundreihe; Blindheit auch gegenüber gegnerischen Zügen dieser Art; Messung mit allen Flecken); davor 0.2.56 Engine-Variante im Rückblick (Fable, Zweig `rueckblick-variante`, Empfehlung R5: Hauptvariante je Stellung gespeichert, Rückblickkarte „Danach etwa …“); davor 0.2.55 Nachlesen im Buch zu allen Rückfragen (Opus: X1 9.23/9.41, X2 9.42, X4, C1, C2, C5, T1, U6, W6/T5, W11, E3 umgesetzt; S17, C3, W5, U5, D1 beim Autor); davor 0.2.54 Brillant am Prüfstand von chess.com (Fable, Zweig `opfer-pruefstand`: Opfer ab Netto 1, nur die gezogene Figur darf vorher schon angegriffen sein, brillant nur bei gutem Stand danach, nicht aus dem Schach, zweitbester nicht ohnehin gewinnend; 100 Brillant-Züge aus chess.com-Partien als lokaler Prüfstand); davor 0.2.53 Studien lösen und Zug erraten (Opus, AP 13 Stufe 3: Zugfolgen aus Kapitel 10 und 11, Rückfragen W11, W12); davor 0.2.52 Stufen 1 bis 3 menschlicher (Fable, Zweig `stufen-menschlich`, Empfehlung R4: Tiefengrenze statt Skill Level 0, gewichtete Zugwahl mit Temperatur, Fehlerneigung nach Lage, Strähne und Tagesform; Stufen neu gemessen); davor 0.2.51 Vergleich mit chess.com an drei Partien (Fable: Abtausch ist kein Opfer mehr, „stark“ nur vor klarem Gewinn, S18 Spielstärke aus der Genauigkeit, T4 Fallen aus Kapitel 2 und 3, in entschiedener Stellung „?!“ erst ab drei Bauern und kein „!“, 2 s Rechenzeit während der Partie; neue Regel 9 in CLAUDE.md: Empfehlungen gleich umsetzen); davor 0.2.50 Genauigkeit wie bei chess.com (Fable, Zweig `auswertung-chesscom`: Genauigkeit wie bei Lichess aus gewichtetem und harmonischem Mittel, „verpasst“ vor „patzer“, „bester“ nur der Zug der Engine, Platzhalter in der Zeile „Zeichen“ behoben; Rechentiefe war nicht die Ursache); davor 0.2.49 Endspieltrainer (Fable, Zweig `endspieltrainer`: 78 Buchstellungen aus Kapitel 8 und 9 mit Stockfish geprüft, gegen die Engine gewinnen oder Remis halten, Kippen erkannt, gestufte Hilfen); davor 0.2.48 Zielbilanz-Übung, Faktorenbilanz- und Repertoire-Trainer (Opus, AP 13, Buchstellungen und Zugfolgen der Kapitel 2 und 3, Lösung aus den Werkzeugen und dem Buch); davor 0.2.47 Empfehlungen vorab umgesetzt (Opus: S9 Rücknahme ungewertet, K5 kein „??“ bei klarem Gewinn, R3 „Geschätzte Spielstärke“, C8 kein Minderheitsangriff gegen vorgerückten Kandidaten, T1 gleich gute Engine-Züge in vier Übungen, U9 Wiederholung für Taktik und Falle; Widerspruch des Autors genügt); davor 0.2.46 Bots mit Persönlichkeit (Fable: blinde Flecken als Zugarten, die ein Gegner nicht sieht; 18 vorgefertigte Gegner mit eigener Fehlerliste und blinden Flecken; Stufen je Phase verborgen; blinde Flecken auch für eigene Gegner); davor 0.2.45 AP 13 Teil 3 (Opus): Taktiktrainer, „Falle oder Köder“ und Strukturerkenner auf Fables Trainerdaten, Hinweis „Nur dieser Zug“ bei Übungen, Empfehlungen zu allen offenen Rückfragen in `docs/AUFGABEN_AUTOR.md`; davor Lesart der Phase: Mittelspiel, sobald eine Seite entwickelt ist oder das Material ungleich ist; „Bauern entscheiden“ nur bei Freibauer oder wenig Material; Erklärung am Phasenwechsel im Rückblick (Befund S17: Abb. 11.4); davor 0.2.43 „M“ und „E“ in der Zugliste, Zusatzregel „Zug 15“ gestrichen; davor 0.2.42 Ergänzungen des Autors vom Abend (Fable: Wertung nur aus der Grundstellung, Wertung zurücksetzen, eigene Gegner mit Fehlerarten und Spielstil, Wertungskurve je Phase); davor 0.2.41 Spielen nach den Wünschen des Autors vom Nachmittag (Fable: zwölf vorgefertigte Gegner, Mensch gegen Mensch, Spielhilfen zuschaltbar, Partienkachel mit Ergebnis und Stärke beider Seiten, Wertung nach Elo mit Kurve in den Einstellungen, Zusatzregeln für die Phase, Stellungseditor); davor 0.2.40 Spielen nach den Ideen des Autors (Fable: Zugklassen wie bei chess.com, Phasen in Kurve und Spielstärke, Auswertung im Hintergrund, Stufe je Phase, Fehlerprofile je Phase); davor 0.2.39 Rückmeldung zum Nachtest bis N174 (Fable, Zweig `rueckmeldung-0.2.39`: Figurensätze, Nummernsprung, Werkzeugtexte, Rückblick-Karte mit Erklärung, „!“, Spielstärke, Eröffnung wählen) und die Trainerdaten (Fable, Zweig `trainerdaten`, zusammengeführt); davor 0.2.38 H Rückblick nach der Partie (Zweig `rueckblick`); 0.2.37 AP 13 Teil 1 und 2: Übungen des Buches lösen, Wiederholung, erste Trainer (Opus, Zweig `nacht-ap13`; davor 0.2.36 AP 11 Kalibrierung (Fable), 0.2.35 neuer Buchstand, 0.2.34 erster Stand im öffentlichen Repository `dobili/SvGa_Public`) · Nächstes: Nachtest N182 bis N200, Rückfragen U1 bis U11 in `docs/AUFGABEN_AUTOR.md`; Trainerdaten von Fable zusammenführen · Die ganze ältere Arbeitsgeschichte (Prüfhilfen, Berichte, Archiv) liegt im früheren privaten Repository des Autors

Stand: 22.10.2026 · **Version 0.2.117** (Zweig `menschliche-bots`, nach main übernommen): menschliche Zusatzfehler der Bots (Lichess-Daten, `engine/menschenwahl.ts`, `pipeline/menschenprofil/`), Bedenkzeit, sichtbare Wartezeit ±10 %, Notmodus mit Vorzügen (`spiel/notmodus.ts`, `ui/komponenten/botzug.ts`), 3+2 und 3+0, **zehn Stufen** (Grundschicht `engine/grundschicht.ts`, geeicht: 250, 400, 715, 1050, 1350, 1700, 2140, 2440, 2700, 2970), Speicherformat 6 (`speicher/stufenskala.ts`), 64 Bots in Gruppen 1–10 nach gemessener Zahl (5 bis 8 je Gruppe, `engine/botgruppe.ts`), Spaß-Bots 430–1180, Abzug der Zusatzfehler je Stufe und Uhrabzug (3+0 −265, 10+0 −100, mit Zuschlag 0) in `engine/botstaerke-daten.ts` (Messung `buch/arbeit/botelo3`, nur lokal; Auswertung mit `BOTELO_ORDNER=../buch/arbeit/botelo3 npx vitest run --config vitest.messung.config.ts src/engine/botstaerke.messung.ts`). Testpunkte N620–N627 in AUFGABEN_AUTOR. Bekannt: Der Oberflächentest „Alle Daten löschen“ ist in der Cloud-Umgebung unzuverlässig (auch auf main 2 von 5 Läufen rot), in GitHub Actions grün. **Nächster Schritt (Plan „Bots, zweite Runde“, vom Autor am 22.10.2026 ganz freigegeben, inkl. Speicherumstellungen):** A Fehlerarten und blinde Flecken zu einer Liste zusammenführen (Engine, UI, Speicher); Erkennung nur, wenn das Motiv in der Widerlegung der Engine vorkommt und dem Gegner messbar gewinnt (Beispiele des Autors: 9… Df6 „Gabel Sd5“, 4. c4 „Gabel e5“ waren Fehlalarme), Stichprobe von 300 Fehlern prüfen. B/C Partien: `buch/arbeit/menschenprofil2` (Lichess 2026-09, Bullet/Blitz/Rapid/Classical, 120 je Band und Klasse, Namen und Engine-Fortsetzung je Kandidat), Analyse läuft (`analyse.sh`, `nachlauf.sh`); Spielervergleich Blitz/Schnellschach in `buch/arbeit/spielervergleich/spieler.json` (Lichess 2026-08, nur Kopfzeilen). Danach je Kategorie (ab 400, 800, 1200, 1600, 2000, 2200, 2400, 2600) × Phase × Zeitklasse: Fehlerraten, Raten je Art, Genauigkeit, Bedenkzeit; neue Fehlerarten aus ungeklärten Fehlern; Plausibilität (Vertrauensintervalle, Modell Elo × Phase × Zeitklasse, kleine Zellen zum Modell hin). D Spielstile (positionell, taktisch, universell, aggressiv, ggf. solide u. a.; ab welchem Band unterscheidbar), jeder Bot ein Stil. E Neueichung Schnellschach: Kategorien Spaß (4, extrem schwankend) und 8 Kategorien zu je 8 Bots, 4-fach Kandidaten (256 + 16), Stufen je Phase aus den Genauigkeitswerten. F Blitz (Ziel-Elo-Verlust aus dem Spielervergleich, erst Blitz-Fehlerraten, dann Stufen nachstellen) und 60 Minuten (Lichess-Klassisch, sonst Annahme); „ohne Uhr“ entfällt für gewertete Partien (Empfehlung: ungewertete Partien ab Abbildung dürfen ohne Uhr bleiben, Autor hat freigegeben), drei Einstellungssätze und Zahlen je Bot, Gruppen je Zeitklasse, „besiegt“-Symbol je Zeitklasse, Zeit in der Partienliste. Bullet nur auswerten. Aufteilung: Chat 1 A (Opus hoch), 2 B+C (Fable hoch), 3 D (Opus mittel), 4 E (Fable hoch), 5 F (Opus mittel bis hoch). Stand 22.10. abends: Analyse fertig (2612 Partien, Tabellen `buch/arbeit/menschenprofil2/tabellen.py` → tabellen.txt: Fehlerraten ≥0,5/1/3, Genauigkeit, Bedenkzeit je Kategorie × Phase × Zeitklasse, geglättet mit logistischem Modell). Spielervergleich (Lichess 2026-08, 36 Mio. Partien, Median Blitz − Schnellschach derselben Spieler je Schnellschach-Kategorie): 400 −11, 800 −121, 1200 −183, 1600 −161, 2000 −124, 2200 −100, 2400 −43; Klassisch − Schnellschach 400 +337 … 1600 +21 … 2400 −139 (Skalen der Zeitklassen sind verschoben: bei gleicher Zahl ist ein Rapid-Spieler unten schwächer als ein Blitz-Spieler). Fehlerarten werden erst nach Teil A (neue Erkennung, Fortsetzung ist gespeichert) ausgezählt. Bis der Autor wieder Opus hat (24.10.), nur Rechenarbeit in diesem Chat. Davor: 19.10.2026 · **Version 0.2.116**, Arbeitsliste R1 bis R26 begonnen (Opus: R1 Aufgabenliste geleert, CLAUDE.md V2; R2 „KI“ statt „Claude“; R3 bis R8 Texte, Reiter Training, Leiste nur Symbole, Bots nach Stärke, Stufennamen; R9 bis R11 Aufklapper mit Erklärung, Zeichen der Zielbilanz; R12 Klappen Spielhilfen und Eröffnung; R13 Buchzitate englisch, Englisch in 1.0; R14 Aufgabe wiederholen; Nächstes: R15); davor 0.2.115, Buchbefunde ins Buch übernommen (Opus: B6, B7, B8, ZF4, D2 im Buch-Repository auf Zweig `claude/funny-bardeen-e7wpzs`, Daten von Kapitel 3, 8 und 12 neu gebaut, Werkzeugkasten-Seite angepasst, D1 erledigt; Nächstes: Autor übernimmt den Buchzweig nach `main`); davor 0.2.114, Buchbefunde nachgeprüft und Links in Kapitel 12 getestet (Opus, nur Aufgabenliste: B6 neu bewertet, B7 ergänzt, neuer Befund B8 schachtraining.de, ZF4 nachgeprüft; Formulierungsvorschläge an den Autor im Chat); davor 0.2.113, Lektorat, Einzahl und Mehrzahl, Lizenzseite, Vorprüfung der Testliste (Opus, Zweig `weiter-ohne-autor`: `tZahl()` für 1 und 0, Texte in de und en lektoriert, Fehler N402 „Du übersieht“ behoben, Erklärung der Wertung berichtigt, Lizenztexte der npm-Pakete aus dem Build, Quellcode als Link, 26 Testpunkte gestrichen und zehn gekürzt, Buchbefund B7 Lichess-Adresse; Nächstes: Antworten des Autors); davor 0.2.112, Hinweise je Gerät und Kleinkram ohne Autor (Hinweis für zu alte Geräte, Sieben-Tage-Hinweis in Safari, Test „jede Abbildungsnummer öffnet“, robots.txt und sitemap.xml, Sicherheits-Kopfzeilen, Spielen.tsx unter 400 Zeilen, CLAUDE.md zu Cloudflare); davor 0.2.111, Datenschutz und Impressum ergänzt (Lücken aus einem e-recht24-Scan), Cloudflare Web Analytics im Dashboard abgeschaltet, Test gegen fremde Adressen (Opus, Zweig `datenschutz-luecken`); davor 0.2.110 App-Symbol knackiger (Opus, Zweig `symbol-knackig`: mehr Kontrast, etwas Sättigung und Schärfe, dunklerer Rand, 180 und 192 Pixel in voller Farbtiefe; Nächstes: N490); davor 0.2.109, Bot-Gruppen ohne Überschneidung (Opus, Zweig `bot-gruppen`: acht Bots tauschen paarweise die Gruppe der Gegnerwahl, `engine/botgruppe.ts`, ohne neue Messung; Nächstes: N585); davor 0.2.108, Version 1.0 vorbereitet, nicht veröffentlicht (Opus, Zweig `ap17-vorbereitung`: Abnahmeliste `docs/ABNAHME_1.0.md`, Bau `npm run build:veroeffentlichung` ohne Aufgabenseite und englische Vorschau, Datenprüfung `--veroeffentlichung` gegen Entwürfe, Rückfragen V1 bis V6; Nächstes: Antworten des Autors, endgültiges Buch); davor 0.2.107, Testpunkte 0.2.98 bis 0.2.101 vorgeprüft (Opus, Zweig `testpunkte-vorpruefen`: 27 Punkte mit der gebauten App geprüft und gestrichen, N460 überholt, sieben gekürzt geblieben; „1 Zug“ in der Partienliste; Nächstes: Version 1.0 vorbereiten); davor 0.2.106, Farbabstimmung DS30 bis DS37 (Opus, Zweig `farbabstimmung`: Porträts ohne eingebauten Hintergrund, helles Navy im hellen Modus; Haken und Regler in App-Farben; Zahlkreise und Stufenmarken im Dunkeln mit Rand; Rahmen der Bedienelemente 3:1; App-Symbol aus dem goldenen Springer des Covers; vom Autor freigegeben; Nächstes: N483 bis N489); davor 0.2.105, kurze Partien zählen für die Wertung (Opus, Zweig `wertung-kurze-partien`: Die Elo-Wertung verlangt keine Schätzung des Gegners mehr, dessen Zahl seit 0.2.85 fest ist; seit 0.2.103 fielen schnelle Siege gegen Spaß-Bots sonst heraus; Nächstes: N584); davor 0.2.104, englische Fassung als Vorschau (Opus, Zweig `englisch`: en.json mit allen Texten außer 27 Buchzitaten, englische Notation überall, Zahlen und Daten nach der Sprache, Kürzel am Brett in der Sprachdatei, Buchdaten weiter deutsch; Nächstes: N409, Rückfragen EN1 bis EN3); davor 0.2.103, Spielstärke nur bis zur Entscheidung der Partie (Opus, Zweig `genauigkeit-bis-entscheidung`, Wunsch des Autors: Züge nach dem Punkt, ab dem eine Seite dauerhaft mindestens 90 % Gewinnchance hat, zählen nicht mehr für Spielstärke und Urteilswort; Kurven Genauigkeit → Spielstärke an 600 neu gesammelten Partien neu geeicht, Bot-Zahlen über die Anker um 212 tiefer, Bots selbst unverändert; Nächstes: N580 bis N583; GE1 vom Autor mit „so lassen“ entschieden); davor 0.2.102, Uhr beim Verlassen sofort gesichert (Opus, Zweig `uhr-sichern`, N180: angehaltener Uhrstand zusätzlich synchron im Gerätespeicher, weil ein Neuladen das Schreiben in IndexedDB abbricht; Nächstes: englische Fassung, Zweig `englisch`); davor 0.2.101, Symbolsprache DS19 bis DS29 (Opus, Zweig `symbolsprache`: Stufenmarken in Gürtelfarben, ein Aufklappzeichen, Pfeil für Weiter, Zeichen an Knöpfen und Überschriften, Ergebnismarke, Phasenzeichen, Fortschritt an der Kapitelnummer, Werkzeugzeichen, Glossar nach Buchstaben; vom Autor freigegeben; Nächstes: N475 bis N482); davor 0.2.100, Porträtwahl mit Vorschaubildern (Opus, Zweig `portraet-bildauswahl`: Aufklappmenü mit allen 30 Porträts nach Altersgruppen statt Auswahlmenü ohne Bilder; Nächstes: N469); davor 0.2.99, Wünsche des Autors vom 19.10.2026 morgens (Opus, Zweig `spielen-sammlung-nachschlagen`: Spielhilfen über „Partie beginnen“, Porträts für eigene Bots, Stern für besiegte Bots, Partienliste mit Porträt, Filter und Löschen, Zeichen für Warum-Fragen in der Kapitelübersicht mit Fortschritt, Nachschlagen mit Steckbriefen und Werkzeugen; Nächstes: N468 bis N474); davor 0.2.98, Design-Überprüfung (Opus, Zweig `design-ueberarbeitung`: alle 18 Vorschläge DS1 bis DS18 vom Autor angenommen, Schrift folgt dem Gerät, Querformat und Tablet mit Brett links, beschriftete Brettsymbole, Tippflächen 44 px; Nächstes: N450 bis N467); davor 0.2.97, Datenlauf mit dem Buchstand vom 17.10.2026 (`schachbuch-quellen` 931597a; Opus, Zweig `buchstand-neu`: an allen 765 Abbildungen Stellung, Pfeile, Felder, Unterschrift und Nummern unverändert; geändert nur die Literaturnummern in vier Glossareinträgen ([12]→[14], [10]→[11], [13]→[15], [14]→[16]), Zeilenangaben der Fundstellen und die Prüfsummen, die seit dem Nachtrag der Klartextzüge (0.2.94) nicht neu gerechnet waren; Nächstes: Rückmeldung des Autors); davor 0.2.96, konstruierte Zugfolgen und Tablebase (Opus, Zweig `zugfolgen-konstruiert`: 29 Partien ab der Grundstellung zu Abbildungen ohne Zugfolge, Status „konstruiert“ mit Hinweis in der App, Einordnung aller 67 in `inhalte/de/konstruktion.json`, Tablebase-Prüfung der Endspiele; Nächstes: Rückfragen ZF1 bis ZF4, Abb. 7.24 offen); davor 0.2.95, Befunde aus dem Durchprüfen der Aufgabenliste behoben: „Zurück zu den Aufgaben“ führt wieder zum Punkt, Pfeil und Figur bei Hinweis 2 und 3 im Endspieltrainer, „..“ nach „Warum?“, Uhranzeige nach dem Hintergrund, Einzahl, Abbildung beim Zug ausführen, kein Satz über Enginefehler bei Partien zu zweit (Opus, Zweig `aufgaben-zurueck`; Aufgabenliste entlastet auf Zweig `claude/aufgabenliste-entlasten-6y3tgp`); davor 0.2.94 Technik für die englische Fassung (Chat E, Opus, Zweig `sprache-technik`: Sprachwahl nach Gerät, `<html lang>`, Buchdaten je Sprache, Lizenztexte in de.json, Klartextzüge der Unterschriften in der Pipeline); davor 0.2.93 Lernsammlung (Chat E, Opus, Zweig `lernsammlung`: eigene Stellungen mit Plan und Notiz aus Abbildung, Partie und Trainer, nach Eröffnung geordnet, Abfrage, PGN für Lichess-Studien, Nutzerdaten Format 5); davor 0.2.92 Ziehen per Wischen (Chat E, Opus, Zweig `ziehen-wischen`: Figuren mit Finger oder Maus ziehen, nur auf ziehbaren Figuren, abschaltbar in den Einstellungen); davor 0.2.91 Endspiel-Kurzübungen (Quadrat, Opposition, Schlüsselfelder, Erkennungsbild-Quiz; `training/endspieldrills.ts`, `ui/trainer/Drillaufgabe.tsx`), Referenzergebnisse aller Werkzeuge (`src/analyse/__referenz__/werkzeuge.txt`), `speicher/partienLesen.ts` abgetrennt (Opus, Chat A, Zweig `nacht-stabilitaet`; Nächstes: Rückmeldung des Autors zu N400 bis N408 und NA1); davor 0.2.90 Nachtarbeit Chat A (Opus, Zweig `nacht-stabilitaet`: Engine-Tests mit fester Tiefe 16, axe auf Spielen/Partie/Auswertung/Trainern/Dunkelmodus, 360 px, `/training/*` ohne Zwischenspeicher; Uhr 10+0 im 30-Minuten-Plan; Gewinnchance im Zugurteil und in der Falle; Gabel mit Figurennamen; Sicherung teilen; Kontrast am Bewertungsbalken; „Erst selbst denken“ auch vor Werkzeugen (Einstellung, Voreinstellung aus, NA1); Wiederholung für Struktur und Endspiel; Trefferzahl bei Zug erraten und Planstand in den Nutzerdaten); davor 0.2.89 gleich große Kacheln in der Gegnerwahl (Opus, Zweig `kacheln-gleich`: Spalten minmax(0, 1fr), Namen brechen um; Nächstes wie bei 0.2.88); davor 0.2.88 Spaß-Bots und Zahlen über 2200 (Opus, Zweig `spass-bots`: Gruppe „Zum Spaß“ mit Fritzi, Onkel Willi, Tante Trude, Bruno, etwa 600 bis 1100, Zufallszüge 60/38/25/15 %; Stufe 5 bis 8 mit der Zahl der Elo-Leiter statt „über 2200“; Nächstes: N335 des Autors, dann S24 Namen der Stufen); davor 0.2.87 Rückmeldung zu 0.2.86 (Opus, Zweig `rueckmeldung-0.2.86`: „Genauigkeit wie“ nur in der Auswertung als Segmentleiste mit Fragezeichen, „App“ statt „Mittelweg“, Tabellen ohne Überlauf, Trainer-Knopf als Symbol, Holz und Material eine Gruppe; Nächstes: Rückmeldung zu N336 bis N346); davor 0.2.86, Auswertung, Werkzeuge und Training übersichtlicher (Opus, Zweig `auswertung-ausbau`: Gewinnchance statt Bauern im Rückblick, „schlägt nicht zurück“, Nebenzweige „Besser war“ und „So wird der Fehler bestraft“, Engine-Wachhund gegen hängende Auswertung, Symbole und Genauigkeitsschalter in der Auswertung, Werkzeugkarten ohne „Mehr“, Werkzeugleiste scrollbar mit Symbolen, Partie-beginnen oben, Bot-Stufen aufklappbar, Trainingsseite mit Symbolen; Nächstes: Rückmeldung des Autors zu N336 bis N343); davor 0.2.85, Elo-Zahl der Bots (Opus, Zweig `bot-elo`, S23: Elo-Leiter aus 806 Partien, verankert an Stufe 1 bis 3 gegen sich selbst über „Deine Spielstärke“, Anker ab 83 % Genauigkeit gesättigt; Bereich je Stufe, Zahl je Bot, „über 2200“ als Grenze, feste Gegnerwertung in der Elo-Wertung; Stufe 3 schwächer, weil sie Stufe 4 ebenbürtig war; Nächstes: Test N335 des Autors abwarten, dann S24 Stufen 1 bis 4 schwächer und alle Bots neu messen); davor 0.2.84 neue Bretter nach der Auswahl des Autors (Opus, Zweig `bretter`: Farben Braun, Blau, Sand, Koralle, Lavendel, Nacht; „Holz“ heißt jetzt „Ahorn & Nussbaum“; Materialbretter Intarsie, Holz klassisch, Marmor grün von Lichess unter AGPL; goldener Rahmen der gewählten Kachel im Dunkelmodus; Nächstes: S23 Elo je Bot-Stufe nach Rücksprache mit dem anderen Chat); davor 0.2.83 Genauigkeit und Spielstärke neu geeicht und eingebaut (Opus, Zweig `eichung`: je 300 Partien von chess.com und Lichess mit Tiefe 18 nachgerechnet; Schalter „Genauigkeit wie“ Lichess/Mittelweg/nahe chess.com, Spielstärke als Mitte zweier Kurven mit Spanne, Karte „Deine Spielstärke“ über zehn Partien, Auswertung mit Tiefe 18; Nächstes: S23 Elo je Bot-Stufe, sobald die Bot-Messung Züge speichert); davor 0.2.82 Rückmeldung zu 0.2.80 (blinde Flecken bei eigener Stufe, Abschnitte eingeklappt mit Pfeil, Reiter nur waagerecht, Engine als Symbol am Brett) und neun neue Figurensätze aus der Auswahl des Autors (Opus, Zweig `layout-nachtrag`; Nächstes: Eichung Punkt 6, Bericht zu Schritt c an den Autor); davor 0.2.81 alle 64 Bots mit korrigiertem Stil gemessen und eingestellt (Opus, Zweig `werkzeuge-textarbeit`: Regeln gegen endloses Nachjustieren, zwei Stichproben je Grenzfall, höchstens eine Anpassung je Bot, ab Stufe 5 Vergleich mit der Stufe darunter; elf Bots gegenüber 0.2.67 geändert, Ergebnis in ENTSCHEIDUNGEN „Messung aller 64 Bots“; Saat-Verschiebung `MESSUNG_SAAT_AB` für zweite Stichproben); davor 0.2.80 Layout nach dem Wunsch des Autors: Einstellungen mit Reitern, Vorschau, Ringen und Erklärungen hinter Fragezeichen; Kapitelseiten mit „Training und Übungen“ in einer Karte, Abhaken über der Galerie und aufklappbaren Abschnitten; Spielen mit drei Gegnerkategorien und Engine-Knopf in der Partie statt der Hinweise; absichtliche Fehler nur für die eigene Stufe (S22) (Opus, Zweig `layout-einstellungen`; Nächstes: Eichung Punkt 6 weiter); davor 0.2.79 Plan „Genauigkeit und Spielstärke neu eichen“ festgehalten (Opus, Nächster Schritt Punkt 6); davor 0.2.78 Stil-Fehler behoben: Der Stil wählte nahe am besten Zug der Engine statt am Zug der Stufe, Bots mit Stil waren dadurch in den Stufen 1 bis 4 fast so stark wie die Engine; jetzt Bezug auf den Zug der Stufe, Anpassungen gegen „zu stark“ aus 0.2.74 bis 0.2.76 zurückgenommen (Opus, Zweig `werkzeuge-textarbeit`; Nächstes: 53 Bots mit korrigiertem Stil neu messen, Liste in `buch/arbeit` bzw. ENTSCHEIDUNGEN „Messung aller 64 Bots“, Ausreißer anpassen); davor 0.2.77 Messfehler behoben: Paarungen wurden am ersten Bindestrich getrennt, 25 Bots mit Bindestrich waren falsch gemessen; Frau Berger und Frau Ortega zurückgenommen, Yara mit Fleck „ruhig“ (Opus, Zweig `werkzeuge-textarbeit`; Nächstes: die 25 Bots neu messen, Ergebnis in ENTSCHEIDUNGEN „Ergebnis der Messung aller 64 Bots“ nachtragen, Ausreißer anpassen); davor 0.2.76 Bot-Messung Stufen 1 bis 6: Greta, Paul, Hanna und Elif nachgebessert, Leon, Ayşe und Sophie bleiben als Stärkste ihrer Stufe (verlieren gegen die nächsthöhere; benachbarte reine Stufen trennen 10 : 0) (Opus, Zweig `werkzeuge-textarbeit`; Nächstes: Matteo, Ben und die Stufen 7 und 8 messen, Ergebnis in ENTSCHEIDUNGEN „Ergebnis der Messung aller 64 Bots“ nachtragen, Ausreißer anpassen); davor 0.2.75 Aufgabenseite in der App (Opus, Zweig `autor-aufgaben`: `docs/AUFGABEN_AUTOR.md` als Seite nach drei Sekunden Druck aufs Zahnrad, Links, Haken, Notizen, Text für den Chat); davor 0.2.74 Messung aller 64 Bots, Stufen 1 bis 5 vollständig: zwölf zu starke und vier zu schwache Bots über Phasenstufe und teure Fehlerart angepasst (Fable, Zweig `werkzeuge-textarbeit`; Stufen 6 bis 8 laufen noch, Nächstes: deren Ergebnis auswerten und in ENTSCHEIDUNGEN nachtragen); davor 0.2.73 Lichess-Aufgaben im Training geprüft (angeschlossen), Lizenzen ergänzt, X5 nach Regel 9 (Opus, Zweig `lichess-lizenzen`); davor 0.2.72 Spielbewertung an sieben chess.com-Partien des Autors geeicht (Fable, Zweig `werkzeuge-textarbeit`: neue Stützstellen Genauigkeit → Spielstärke, etwa 500 Punkte tiefer, Abweichung zu chess.com im Mittel 0; Urteilswort je Phase als farbige Marke; Mittelspiel nach Taktik und Strategie getrennt, Regel des Sicherheitsblicks; Messlauf `messen:vergleich`); davor 0.2.71 30-Minuten-Plan (Opus, Zweig `dreissig-minuten`, AP 13 Stufe 3: geführte Einheit mit Uhr, Tag A und B im Wechsel, Bereiche des Studientags; damit alle Trainer spielbar); davor 0.2.70 Abweichungsmodus (Opus, Zweig `abweichung`, AP 13 Stufe 3: die Engine verlässt das Buch, der Leser antwortet, Bewertung und Einschätzung); davor 0.2.69 Planbilanz-Übung (Opus, Zweig `planbilanz`, AP 13 Stufe 3: Planfragen mit Antwortauswahl, LAP, Wettrennen); davor 0.2.68 Werkzeugabweichungen aus der Textarbeit geprüft (Fable, Zweig `werkzeuge-textarbeit`: neun von zwölf Gruppen waren erledigt, Isolani-Besitzer in der Richtung und Sonderfall 6. Reihe aus Verteidigersicht umgesetzt, Zeit-Zählhilfe als Buchbefund B6); davor 0.2.67 64 Gegner mit Porträts (Fable, Zweig `bots-galerie`: acht Bots je Stufe mit Stil, Fehlerliste und blinden Flecken, Porträts aus DiceBear „Personas“, Gegnerwahl als Porträtgitter mit Sprechblase, Messung je Bot); davor 0.2.66 Denkroutine-Trainer (Opus, Zweig `denkroutine`, AP 13 Stufe 3: eine Minute, zwei Kandidaten mit stärkster Antwort, Vergleich mit der Engine); davor 0.2.65 Fehlerdatenbank (Opus, Zweig `fehlerdatenbank`, AP 13 Stufe 3: Einträge mit Stellung, Satz und Fehlerart der Gesamt-Checkliste, Auswertung je Woche, Trainer-Vorschlag, Knopf im Rückblick; Nutzerdaten Format 4); davor 0.2.64 Leerfälle der Werkzeugkarten (Opus, Zweig `leerfaelle`, U12: ein Satz statt leerer Befunde, kein doppelter Satz; Schicht `ui/werkzeuge/leerfall.ts`); davor 0.2.63 Datenschutz: E-Mail-Weiterleitung an goneo (Opus); davor 0.2.62 Impressum und Datenschutz mit den Angaben des Autors (E1, E2 erledigt); davor 0.2.61 Rückmeldung des Autors zu 0.2.56 (Opus, Zweig `rueckmeldung-0.2.56`: S9 gewertete Partie ohne Rücknahme und Spielhilfen, S12 nur Stellungen mit möglichen Umwandlungen (Stockfish beendet sich sonst), S13 Stil-Toleranz 0,3 mit Hinweis, S17 Phase der Buchstellungen nach dem Glossar mit „rochiert haben“ aus den Buchzügen, U5 Sonderzüge an Abb. 0.12 bis 0.19, W5 Strukturerkenner mit starken Feldern zuerst, W9 Urteil der Faktorenbilanz des Buches, W10 Warum-Fragen im Repertoire-Trainer, W12 Engine-Vergleich beim Zugerraten; X, S, R, W und U bis auf X5 und U12 erledigt; Befund D2 Glossar gegen Steckbriefe); davor 0.2.60 Abhakliste der Fehlerarten (Fable, Zweig `fehlerarten-abhakliste`, Rest aus S7: Karte „Absichtliche Fehler der Engine“ in den Einstellungen, Vorliebe `erlaubteFehlerarten`, Schnitt mit der Liste der vorgefertigten Gegner beim Anlegen einer Partie); davor 0.2.59 Brillant zweiter Schritt (Fable, Zweig `brillant-annehmbar`: Opfer nur, wenn der Gegner die Figur legal nehmen kann; gezogene Figur zählt auch schon angegriffen; Opfererkennung in `engine/opfer.ts`; Prüfstand 59 von 100 bei 19 Fehlalarmen); davor 0.2.58 Anmerkungen des Autors vom Abend (Fable, Zweig `oberflaeche-toene`: Töne für Schach, Matt, Remis und Warnung; roter Hinweis und Satz bei gesperrter Figur; Schlagring statt Punkt; Figurensatz „Holz“ jetzt Merida; Stern für gewertete Partien); davor 0.2.57 blinde Flecken vollständig (Fable, Zweig `blinde-flecken-2`: Röntgen, Zwischenzug, Grundreihe; Blindheit auch gegenüber gegnerischen Zügen dieser Art; Messung mit allen Flecken); davor 0.2.56 Engine-Variante im Rückblick (Fable, Zweig `rueckblick-variante`, Empfehlung R5: Hauptvariante je Stellung gespeichert, Rückblickkarte „Danach etwa …“); davor 0.2.55 Nachlesen im Buch zu allen Rückfragen (Opus: X1 9.23/9.41, X2 9.42, X4, C1, C2, C5, T1, U6, W6/T5, W11, E3 umgesetzt; S17, C3, W5, U5, D1 beim Autor); davor 0.2.54 Brillant am Prüfstand von chess.com (Fable, Zweig `opfer-pruefstand`: Opfer ab Netto 1, nur die gezogene Figur darf vorher schon angegriffen sein, brillant nur bei gutem Stand danach, nicht aus dem Schach, zweitbester nicht ohnehin gewinnend; 100 Brillant-Züge aus chess.com-Partien als lokaler Prüfstand); davor 0.2.53 Studien lösen und Zug erraten (Opus, AP 13 Stufe 3: Zugfolgen aus Kapitel 10 und 11, Rückfragen W11, W12); davor 0.2.52 Stufen 1 bis 3 menschlicher (Fable, Zweig `stufen-menschlich`, Empfehlung R4: Tiefengrenze statt Skill Level 0, gewichtete Zugwahl mit Temperatur, Fehlerneigung nach Lage, Strähne und Tagesform; Stufen neu gemessen); davor 0.2.51 Vergleich mit chess.com an drei Partien (Fable: Abtausch ist kein Opfer mehr, „stark“ nur vor klarem Gewinn, S18 Spielstärke aus der Genauigkeit, T4 Fallen aus Kapitel 2 und 3, in entschiedener Stellung „?!“ erst ab drei Bauern und kein „!“, 2 s Rechenzeit während der Partie; neue Regel 9 in CLAUDE.md: Empfehlungen gleich umsetzen); davor 0.2.50 Genauigkeit wie bei chess.com (Fable, Zweig `auswertung-chesscom`: Genauigkeit wie bei Lichess aus gewichtetem und harmonischem Mittel, „verpasst“ vor „patzer“, „bester“ nur der Zug der Engine, Platzhalter in der Zeile „Zeichen“ behoben; Rechentiefe war nicht die Ursache); davor 0.2.49 Endspieltrainer (Fable, Zweig `endspieltrainer`: 78 Buchstellungen aus Kapitel 8 und 9 mit Stockfish geprüft, gegen die Engine gewinnen oder Remis halten, Kippen erkannt, gestufte Hilfen); davor 0.2.48 Zielbilanz-Übung, Faktorenbilanz- und Repertoire-Trainer (Opus, AP 13, Buchstellungen und Zugfolgen der Kapitel 2 und 3, Lösung aus den Werkzeugen und dem Buch); davor 0.2.47 Empfehlungen vorab umgesetzt (Opus: S9 Rücknahme ungewertet, K5 kein „??“ bei klarem Gewinn, R3 „Geschätzte Spielstärke“, C8 kein Minderheitsangriff gegen vorgerückten Kandidaten, T1 gleich gute Engine-Züge in vier Übungen, U9 Wiederholung für Taktik und Falle; Widerspruch des Autors genügt); davor 0.2.46 Bots mit Persönlichkeit (Fable: blinde Flecken als Zugarten, die ein Gegner nicht sieht; 18 vorgefertigte Gegner mit eigener Fehlerliste und blinden Flecken; Stufen je Phase verborgen; blinde Flecken auch für eigene Gegner); davor 0.2.45 AP 13 Teil 3 (Opus): Taktiktrainer, „Falle oder Köder“ und Strukturerkenner auf Fables Trainerdaten, Hinweis „Nur dieser Zug“ bei Übungen, Empfehlungen zu allen offenen Rückfragen in `docs/AUFGABEN_AUTOR.md`; davor Lesart der Phase: Mittelspiel, sobald eine Seite entwickelt ist oder das Material ungleich ist; „Bauern entscheiden“ nur bei Freibauer oder wenig Material; Erklärung am Phasenwechsel im Rückblick (Befund S17: Abb. 11.4); davor 0.2.43 „M“ und „E“ in der Zugliste, Zusatzregel „Zug 15“ gestrichen; davor 0.2.42 Ergänzungen des Autors vom Abend (Fable: Wertung nur aus der Grundstellung, Wertung zurücksetzen, eigene Gegner mit Fehlerarten und Spielstil, Wertungskurve je Phase); davor 0.2.41 Spielen nach den Wünschen des Autors vom Nachmittag (Fable: zwölf vorgefertigte Gegner, Mensch gegen Mensch, Spielhilfen zuschaltbar, Partienkachel mit Ergebnis und Stärke beider Seiten, Wertung nach Elo mit Kurve in den Einstellungen, Zusatzregeln für die Phase, Stellungseditor); davor 0.2.40 Spielen nach den Ideen des Autors (Fable: Zugklassen wie bei chess.com, Phasen in Kurve und Spielstärke, Auswertung im Hintergrund, Stufe je Phase, Fehlerprofile je Phase); davor 0.2.39 Rückmeldung zum Nachtest bis N174 (Fable, Zweig `rueckmeldung-0.2.39`: Figurensätze, Nummernsprung, Werkzeugtexte, Rückblick-Karte mit Erklärung, „!“, Spielstärke, Eröffnung wählen) und die Trainerdaten (Fable, Zweig `trainerdaten`, zusammengeführt); davor 0.2.38 H Rückblick nach der Partie (Zweig `rueckblick`); 0.2.37 AP 13 Teil 1 und 2: Übungen des Buches lösen, Wiederholung, erste Trainer (Opus, Zweig `nacht-ap13`; davor 0.2.36 AP 11 Kalibrierung (Fable), 0.2.35 neuer Buchstand, 0.2.34 erster Stand im öffentlichen Repository `dobili/SvGa_Public`) · Nächstes: Nachtest N182 bis N200, Rückfragen U1 bis U11 in `docs/AUFGABEN_AUTOR.md`; Trainerdaten von Fable zusammenführen · Die ganze ältere Arbeitsgeschichte (Prüfhilfen, Berichte, Archiv) liegt im früheren privaten Repository des Autors

Stand: 23.10.2026 abends · **Version 0.2.120** (P1, Opus): Startanimation 2,5 s bei jedem Start, abschaltbar (Wunsch des Autors, P2-A); R32 Spielstärke nur aus gewerteten Partien, Haken bleibt; Werkzeug-Befunde aus P4 behoben. R51 macht der Bot-Chat (Teil F seines Restplans), R24, R27, R28, P8 und R26 nach der Kalibrierung. Davor 0.2.119: P2 fertig eingemischt (R39 Startanimation, R40 zwei Spalten ab 5 : 4, R53), dazu P4 Trainerinhalte (R50 Falle oder Köder, R48 Planbilanz, R47 Endspieltrainer, R49 Strukturerkenner; Fable) und die letzten P6-Anpassungen. Davor 0.2.118: R15 bis R23 und R33 dazu P2 (R35–R38, R29), P3 (R41–R44), P5 (R30, R31, R45, R46) und P6 (R25, englische Buchdaten in der App eingeschaltet) eingemischt; nach main gebracht, obwohl die Bot-Kalibrierung noch läuft (Wunsch des Autors, sie dauert noch Stunden). Davor: Zweig `weiter-ohne-autor`: R15 bis R23 fertig (Aufklapplisten, Zahleneingabe, Ortsmarken der Trainingsseiten, Urteil der Engine nach der Einschätzung, Denkroutine am Brett, Faktorenbilanz mit Waagen, Musterlösungen geprüft, Partienliste mit Symbolfiltern, PGN-Import); main 0.2.117 (zehn Stufen, Format 6) am 23.10.2026 eingemischt. **Nächster Schritt:** Arbeitsplan der Pakete P1 ff. unten („Arbeitsplan ab 23.10.2026“). Davor: 22.10.2026 · **Version 0.2.117** (Zweig `menschliche-bots`, nach main übernommen): menschliche Zusatzfehler der Bots (Lichess-Daten, `engine/menschenwahl.ts`, `pipeline/menschenprofil/`), Bedenkzeit, sichtbare Wartezeit ±10 %, Notmodus mit Vorzügen (`spiel/notmodus.ts`, `ui/komponenten/botzug.ts`), 3+2 und 3+0, **zehn Stufen** (Grundschicht `engine/grundschicht.ts`, geeicht: 250, 400, 715, 1050, 1350, 1700, 2140, 2440, 2700, 2970), Speicherformat 6 (`speicher/stufenskala.ts`), 64 Bots in Gruppen 1–10 nach gemessener Zahl (5 bis 8 je Gruppe, `engine/botgruppe.ts`), Spaß-Bots 430–1180, Abzug der Zusatzfehler je Stufe und Uhrabzug (3+0 −265, 10+0 −100, mit Zuschlag 0) in `engine/botstaerke-daten.ts` (Messung `buch/arbeit/botelo3`, nur lokal; Auswertung mit `BOTELO_ORDNER=../buch/arbeit/botelo3 npx vitest run --config vitest.messung.config.ts src/engine/botstaerke.messung.ts`). Testpunkte N620–N627 in AUFGABEN_AUTOR. Bekannt: Der Oberflächentest „Alle Daten löschen“ ist in der Cloud-Umgebung unzuverlässig (auch auf main 2 von 5 Läufen rot), in GitHub Actions grün. **Nächster Schritt:** Rückmeldung des Autors zu N620–N627 abwarten; offene Arbeitsliste R15 ff. (siehe unten). Davor: 19.10.2026 · **Version 0.2.116**, Arbeitsliste R1 bis R26 begonnen (Opus: R1 Aufgabenliste geleert, CLAUDE.md V2; R2 „KI“ statt „Claude“; R3 bis R8 Texte, Reiter Training, Leiste nur Symbole, Bots nach Stärke, Stufennamen; R9 bis R11 Aufklapper mit Erklärung, Zeichen der Zielbilanz; R12 Klappen Spielhilfen und Eröffnung; R13 Buchzitate englisch, Englisch in 1.0; R14 Aufgabe wiederholen; Nächstes: R15); davor 0.2.115, Buchbefunde ins Buch übernommen (Opus: B6, B7, B8, ZF4, D2 im Buch-Repository auf Zweig `claude/funny-bardeen-e7wpzs`, Daten von Kapitel 3, 8 und 12 neu gebaut, Werkzeugkasten-Seite angepasst, D1 erledigt; Nächstes: Autor übernimmt den Buchzweig nach `main`); davor 0.2.114, Buchbefunde nachgeprüft und Links in Kapitel 12 getestet (Opus, nur Aufgabenliste: B6 neu bewertet, B7 ergänzt, neuer Befund B8 schachtraining.de, ZF4 nachgeprüft; Formulierungsvorschläge an den Autor im Chat); davor 0.2.113, Lektorat, Einzahl und Mehrzahl, Lizenzseite, Vorprüfung der Testliste (Opus, Zweig `weiter-ohne-autor`: `tZahl()` für 1 und 0, Texte in de und en lektoriert, Fehler N402 „Du übersieht“ behoben, Erklärung der Wertung berichtigt, Lizenztexte der npm-Pakete aus dem Build, Quellcode als Link, 26 Testpunkte gestrichen und zehn gekürzt, Buchbefund B7 Lichess-Adresse; Nächstes: Antworten des Autors); davor 0.2.112, Hinweise je Gerät und Kleinkram ohne Autor (Hinweis für zu alte Geräte, Sieben-Tage-Hinweis in Safari, Test „jede Abbildungsnummer öffnet“, robots.txt und sitemap.xml, Sicherheits-Kopfzeilen, Spielen.tsx unter 400 Zeilen, CLAUDE.md zu Cloudflare); davor 0.2.111, Datenschutz und Impressum ergänzt (Lücken aus einem e-recht24-Scan), Cloudflare Web Analytics im Dashboard abgeschaltet, Test gegen fremde Adressen (Opus, Zweig `datenschutz-luecken`); davor 0.2.110 App-Symbol knackiger (Opus, Zweig `symbol-knackig`: mehr Kontrast, etwas Sättigung und Schärfe, dunklerer Rand, 180 und 192 Pixel in voller Farbtiefe; Nächstes: N490); davor 0.2.109, Bot-Gruppen ohne Überschneidung (Opus, Zweig `bot-gruppen`: acht Bots tauschen paarweise die Gruppe der Gegnerwahl, `engine/botgruppe.ts`, ohne neue Messung; Nächstes: N585); davor 0.2.108, Version 1.0 vorbereitet, nicht veröffentlicht (Opus, Zweig `ap17-vorbereitung`: Abnahmeliste `docs/ABNAHME_1.0.md`, Bau `npm run build:veroeffentlichung` ohne Aufgabenseite und englische Vorschau, Datenprüfung `--veroeffentlichung` gegen Entwürfe, Rückfragen V1 bis V6; Nächstes: Antworten des Autors, endgültiges Buch); davor 0.2.107, Testpunkte 0.2.98 bis 0.2.101 vorgeprüft (Opus, Zweig `testpunkte-vorpruefen`: 27 Punkte mit der gebauten App geprüft und gestrichen, N460 überholt, sieben gekürzt geblieben; „1 Zug“ in der Partienliste; Nächstes: Version 1.0 vorbereiten); davor 0.2.106, Farbabstimmung DS30 bis DS37 (Opus, Zweig `farbabstimmung`: Porträts ohne eingebauten Hintergrund, helles Navy im hellen Modus; Haken und Regler in App-Farben; Zahlkreise und Stufenmarken im Dunkeln mit Rand; Rahmen der Bedienelemente 3:1; App-Symbol aus dem goldenen Springer des Covers; vom Autor freigegeben; Nächstes: N483 bis N489); davor 0.2.105, kurze Partien zählen für die Wertung (Opus, Zweig `wertung-kurze-partien`: Die Elo-Wertung verlangt keine Schätzung des Gegners mehr, dessen Zahl seit 0.2.85 fest ist; seit 0.2.103 fielen schnelle Siege gegen Spaß-Bots sonst heraus; Nächstes: N584); davor 0.2.104, englische Fassung als Vorschau (Opus, Zweig `englisch`: en.json mit allen Texten außer 27 Buchzitaten, englische Notation überall, Zahlen und Daten nach der Sprache, Kürzel am Brett in der Sprachdatei, Buchdaten weiter deutsch; Nächstes: N409, Rückfragen EN1 bis EN3); davor 0.2.103, Spielstärke nur bis zur Entscheidung der Partie (Opus, Zweig `genauigkeit-bis-entscheidung`, Wunsch des Autors: Züge nach dem Punkt, ab dem eine Seite dauerhaft mindestens 90 % Gewinnchance hat, zählen nicht mehr für Spielstärke und Urteilswort; Kurven Genauigkeit → Spielstärke an 600 neu gesammelten Partien neu geeicht, Bot-Zahlen über die Anker um 212 tiefer, Bots selbst unverändert; Nächstes: N580 bis N583; GE1 vom Autor mit „so lassen“ entschieden); davor 0.2.102, Uhr beim Verlassen sofort gesichert (Opus, Zweig `uhr-sichern`, N180: angehaltener Uhrstand zusätzlich synchron im Gerätespeicher, weil ein Neuladen das Schreiben in IndexedDB abbricht; Nächstes: englische Fassung, Zweig `englisch`); davor 0.2.101, Symbolsprache DS19 bis DS29 (Opus, Zweig `symbolsprache`: Stufenmarken in Gürtelfarben, ein Aufklappzeichen, Pfeil für Weiter, Zeichen an Knöpfen und Überschriften, Ergebnismarke, Phasenzeichen, Fortschritt an der Kapitelnummer, Werkzeugzeichen, Glossar nach Buchstaben; vom Autor freigegeben; Nächstes: N475 bis N482); davor 0.2.100, Porträtwahl mit Vorschaubildern (Opus, Zweig `portraet-bildauswahl`: Aufklappmenü mit allen 30 Porträts nach Altersgruppen statt Auswahlmenü ohne Bilder; Nächstes: N469); davor 0.2.99, Wünsche des Autors vom 19.10.2026 morgens (Opus, Zweig `spielen-sammlung-nachschlagen`: Spielhilfen über „Partie beginnen“, Porträts für eigene Bots, Stern für besiegte Bots, Partienliste mit Porträt, Filter und Löschen, Zeichen für Warum-Fragen in der Kapitelübersicht mit Fortschritt, Nachschlagen mit Steckbriefen und Werkzeugen; Nächstes: N468 bis N474); davor 0.2.98, Design-Überprüfung (Opus, Zweig `design-ueberarbeitung`: alle 18 Vorschläge DS1 bis DS18 vom Autor angenommen, Schrift folgt dem Gerät, Querformat und Tablet mit Brett links, beschriftete Brettsymbole, Tippflächen 44 px; Nächstes: N450 bis N467); davor 0.2.97, Datenlauf mit dem Buchstand vom 17.10.2026 (`schachbuch-quellen` 931597a; Opus, Zweig `buchstand-neu`: an allen 765 Abbildungen Stellung, Pfeile, Felder, Unterschrift und Nummern unverändert; geändert nur die Literaturnummern in vier Glossareinträgen ([12]→[14], [10]→[11], [13]→[15], [14]→[16]), Zeilenangaben der Fundstellen und die Prüfsummen, die seit dem Nachtrag der Klartextzüge (0.2.94) nicht neu gerechnet waren; Nächstes: Rückmeldung des Autors); davor 0.2.96, konstruierte Zugfolgen und Tablebase (Opus, Zweig `zugfolgen-konstruiert`: 29 Partien ab der Grundstellung zu Abbildungen ohne Zugfolge, Status „konstruiert“ mit Hinweis in der App, Einordnung aller 67 in `inhalte/de/konstruktion.json`, Tablebase-Prüfung der Endspiele; Nächstes: Rückfragen ZF1 bis ZF4, Abb. 7.24 offen); davor 0.2.95, Befunde aus dem Durchprüfen der Aufgabenliste behoben: „Zurück zu den Aufgaben“ führt wieder zum Punkt, Pfeil und Figur bei Hinweis 2 und 3 im Endspieltrainer, „..“ nach „Warum?“, Uhranzeige nach dem Hintergrund, Einzahl, Abbildung beim Zug ausführen, kein Satz über Enginefehler bei Partien zu zweit (Opus, Zweig `aufgaben-zurueck`; Aufgabenliste entlastet auf Zweig `claude/aufgabenliste-entlasten-6y3tgp`); davor 0.2.94 Technik für die englische Fassung (Chat E, Opus, Zweig `sprache-technik`: Sprachwahl nach Gerät, `<html lang>`, Buchdaten je Sprache, Lizenztexte in de.json, Klartextzüge der Unterschriften in der Pipeline); davor 0.2.93 Lernsammlung (Chat E, Opus, Zweig `lernsammlung`: eigene Stellungen mit Plan und Notiz aus Abbildung, Partie und Trainer, nach Eröffnung geordnet, Abfrage, PGN für Lichess-Studien, Nutzerdaten Format 5); davor 0.2.92 Ziehen per Wischen (Chat E, Opus, Zweig `ziehen-wischen`: Figuren mit Finger oder Maus ziehen, nur auf ziehbaren Figuren, abschaltbar in den Einstellungen); davor 0.2.91 Endspiel-Kurzübungen (Quadrat, Opposition, Schlüsselfelder, Erkennungsbild-Quiz; `training/endspieldrills.ts`, `ui/trainer/Drillaufgabe.tsx`), Referenzergebnisse aller Werkzeuge (`src/analyse/__referenz__/werkzeuge.txt`), `speicher/partienLesen.ts` abgetrennt (Opus, Chat A, Zweig `nacht-stabilitaet`; Nächstes: Rückmeldung des Autors zu N400 bis N408 und NA1); davor 0.2.90 Nachtarbeit Chat A (Opus, Zweig `nacht-stabilitaet`: Engine-Tests mit fester Tiefe 16, axe auf Spielen/Partie/Auswertung/Trainern/Dunkelmodus, 360 px, `/training/*` ohne Zwischenspeicher; Uhr 10+0 im 30-Minuten-Plan; Gewinnchance im Zugurteil und in der Falle; Gabel mit Figurennamen; Sicherung teilen; Kontrast am Bewertungsbalken; „Erst selbst denken“ auch vor Werkzeugen (Einstellung, Voreinstellung aus, NA1); Wiederholung für Struktur und Endspiel; Trefferzahl bei Zug erraten und Planstand in den Nutzerdaten); davor 0.2.89 gleich große Kacheln in der Gegnerwahl (Opus, Zweig `kacheln-gleich`: Spalten minmax(0, 1fr), Namen brechen um; Nächstes wie bei 0.2.88); davor 0.2.88 Spaß-Bots und Zahlen über 2200 (Opus, Zweig `spass-bots`: Gruppe „Zum Spaß“ mit Fritzi, Onkel Willi, Tante Trude, Bruno, etwa 600 bis 1100, Zufallszüge 60/38/25/15 %; Stufe 5 bis 8 mit der Zahl der Elo-Leiter statt „über 2200“; Nächstes: N335 des Autors, dann S24 Namen der Stufen); davor 0.2.87 Rückmeldung zu 0.2.86 (Opus, Zweig `rueckmeldung-0.2.86`: „Genauigkeit wie“ nur in der Auswertung als Segmentleiste mit Fragezeichen, „App“ statt „Mittelweg“, Tabellen ohne Überlauf, Trainer-Knopf als Symbol, Holz und Material eine Gruppe; Nächstes: Rückmeldung zu N336 bis N346); davor 0.2.86, Auswertung, Werkzeuge und Training übersichtlicher (Opus, Zweig `auswertung-ausbau`: Gewinnchance statt Bauern im Rückblick, „schlägt nicht zurück“, Nebenzweige „Besser war“ und „So wird der Fehler bestraft“, Engine-Wachhund gegen hängende Auswertung, Symbole und Genauigkeitsschalter in der Auswertung, Werkzeugkarten ohne „Mehr“, Werkzeugleiste scrollbar mit Symbolen, Partie-beginnen oben, Bot-Stufen aufklappbar, Trainingsseite mit Symbolen; Nächstes: Rückmeldung des Autors zu N336 bis N343); davor 0.2.85, Elo-Zahl der Bots (Opus, Zweig `bot-elo`, S23: Elo-Leiter aus 806 Partien, verankert an Stufe 1 bis 3 gegen sich selbst über „Deine Spielstärke“, Anker ab 83 % Genauigkeit gesättigt; Bereich je Stufe, Zahl je Bot, „über 2200“ als Grenze, feste Gegnerwertung in der Elo-Wertung; Stufe 3 schwächer, weil sie Stufe 4 ebenbürtig war; Nächstes: Test N335 des Autors abwarten, dann S24 Stufen 1 bis 4 schwächer und alle Bots neu messen); davor 0.2.84 neue Bretter nach der Auswahl des Autors (Opus, Zweig `bretter`: Farben Braun, Blau, Sand, Koralle, Lavendel, Nacht; „Holz“ heißt jetzt „Ahorn & Nussbaum“; Materialbretter Intarsie, Holz klassisch, Marmor grün von Lichess unter AGPL; goldener Rahmen der gewählten Kachel im Dunkelmodus; Nächstes: S23 Elo je Bot-Stufe nach Rücksprache mit dem anderen Chat); davor 0.2.83 Genauigkeit und Spielstärke neu geeicht und eingebaut (Opus, Zweig `eichung`: je 300 Partien von chess.com und Lichess mit Tiefe 18 nachgerechnet; Schalter „Genauigkeit wie“ Lichess/Mittelweg/nahe chess.com, Spielstärke als Mitte zweier Kurven mit Spanne, Karte „Deine Spielstärke“ über zehn Partien, Auswertung mit Tiefe 18; Nächstes: S23 Elo je Bot-Stufe, sobald die Bot-Messung Züge speichert); davor 0.2.82 Rückmeldung zu 0.2.80 (blinde Flecken bei eigener Stufe, Abschnitte eingeklappt mit Pfeil, Reiter nur waagerecht, Engine als Symbol am Brett) und neun neue Figurensätze aus der Auswahl des Autors (Opus, Zweig `layout-nachtrag`; Nächstes: Eichung Punkt 6, Bericht zu Schritt c an den Autor); davor 0.2.81 alle 64 Bots mit korrigiertem Stil gemessen und eingestellt (Opus, Zweig `werkzeuge-textarbeit`: Regeln gegen endloses Nachjustieren, zwei Stichproben je Grenzfall, höchstens eine Anpassung je Bot, ab Stufe 5 Vergleich mit der Stufe darunter; elf Bots gegenüber 0.2.67 geändert, Ergebnis in ENTSCHEIDUNGEN „Messung aller 64 Bots“; Saat-Verschiebung `MESSUNG_SAAT_AB` für zweite Stichproben); davor 0.2.80 Layout nach dem Wunsch des Autors: Einstellungen mit Reitern, Vorschau, Ringen und Erklärungen hinter Fragezeichen; Kapitelseiten mit „Training und Übungen“ in einer Karte, Abhaken über der Galerie und aufklappbaren Abschnitten; Spielen mit drei Gegnerkategorien und Engine-Knopf in der Partie statt der Hinweise; absichtliche Fehler nur für die eigene Stufe (S22) (Opus, Zweig `layout-einstellungen`; Nächstes: Eichung Punkt 6 weiter); davor 0.2.79 Plan „Genauigkeit und Spielstärke neu eichen“ festgehalten (Opus, Nächster Schritt Punkt 6); davor 0.2.78 Stil-Fehler behoben: Der Stil wählte nahe am besten Zug der Engine statt am Zug der Stufe, Bots mit Stil waren dadurch in den Stufen 1 bis 4 fast so stark wie die Engine; jetzt Bezug auf den Zug der Stufe, Anpassungen gegen „zu stark“ aus 0.2.74 bis 0.2.76 zurückgenommen (Opus, Zweig `werkzeuge-textarbeit`; Nächstes: 53 Bots mit korrigiertem Stil neu messen, Liste in `buch/arbeit` bzw. ENTSCHEIDUNGEN „Messung aller 64 Bots“, Ausreißer anpassen); davor 0.2.77 Messfehler behoben: Paarungen wurden am ersten Bindestrich getrennt, 25 Bots mit Bindestrich waren falsch gemessen; Frau Berger und Frau Ortega zurückgenommen, Yara mit Fleck „ruhig“ (Opus, Zweig `werkzeuge-textarbeit`; Nächstes: die 25 Bots neu messen, Ergebnis in ENTSCHEIDUNGEN „Ergebnis der Messung aller 64 Bots“ nachtragen, Ausreißer anpassen); davor 0.2.76 Bot-Messung Stufen 1 bis 6: Greta, Paul, Hanna und Elif nachgebessert, Leon, Ayşe und Sophie bleiben als Stärkste ihrer Stufe (verlieren gegen die nächsthöhere; benachbarte reine Stufen trennen 10 : 0) (Opus, Zweig `werkzeuge-textarbeit`; Nächstes: Matteo, Ben und die Stufen 7 und 8 messen, Ergebnis in ENTSCHEIDUNGEN „Ergebnis der Messung aller 64 Bots“ nachtragen, Ausreißer anpassen); davor 0.2.75 Aufgabenseite in der App (Opus, Zweig `autor-aufgaben`: `docs/AUFGABEN_AUTOR.md` als Seite nach drei Sekunden Druck aufs Zahnrad, Links, Haken, Notizen, Text für den Chat); davor 0.2.74 Messung aller 64 Bots, Stufen 1 bis 5 vollständig: zwölf zu starke und vier zu schwache Bots über Phasenstufe und teure Fehlerart angepasst (Fable, Zweig `werkzeuge-textarbeit`; Stufen 6 bis 8 laufen noch, Nächstes: deren Ergebnis auswerten und in ENTSCHEIDUNGEN nachtragen); davor 0.2.73 Lichess-Aufgaben im Training geprüft (angeschlossen), Lizenzen ergänzt, X5 nach Regel 9 (Opus, Zweig `lichess-lizenzen`); davor 0.2.72 Spielbewertung an sieben chess.com-Partien des Autors geeicht (Fable, Zweig `werkzeuge-textarbeit`: neue Stützstellen Genauigkeit → Spielstärke, etwa 500 Punkte tiefer, Abweichung zu chess.com im Mittel 0; Urteilswort je Phase als farbige Marke; Mittelspiel nach Taktik und Strategie getrennt, Regel des Sicherheitsblicks; Messlauf `messen:vergleich`); davor 0.2.71 30-Minuten-Plan (Opus, Zweig `dreissig-minuten`, AP 13 Stufe 3: geführte Einheit mit Uhr, Tag A und B im Wechsel, Bereiche des Studientags; damit alle Trainer spielbar); davor 0.2.70 Abweichungsmodus (Opus, Zweig `abweichung`, AP 13 Stufe 3: die Engine verlässt das Buch, der Leser antwortet, Bewertung und Einschätzung); davor 0.2.69 Planbilanz-Übung (Opus, Zweig `planbilanz`, AP 13 Stufe 3: Planfragen mit Antwortauswahl, LAP, Wettrennen); davor 0.2.68 Werkzeugabweichungen aus der Textarbeit geprüft (Fable, Zweig `werkzeuge-textarbeit`: neun von zwölf Gruppen waren erledigt, Isolani-Besitzer in der Richtung und Sonderfall 6. Reihe aus Verteidigersicht umgesetzt, Zeit-Zählhilfe als Buchbefund B6); davor 0.2.67 64 Gegner mit Porträts (Fable, Zweig `bots-galerie`: acht Bots je Stufe mit Stil, Fehlerliste und blinden Flecken, Porträts aus DiceBear „Personas“, Gegnerwahl als Porträtgitter mit Sprechblase, Messung je Bot); davor 0.2.66 Denkroutine-Trainer (Opus, Zweig `denkroutine`, AP 13 Stufe 3: eine Minute, zwei Kandidaten mit stärkster Antwort, Vergleich mit der Engine); davor 0.2.65 Fehlerdatenbank (Opus, Zweig `fehlerdatenbank`, AP 13 Stufe 3: Einträge mit Stellung, Satz und Fehlerart der Gesamt-Checkliste, Auswertung je Woche, Trainer-Vorschlag, Knopf im Rückblick; Nutzerdaten Format 4); davor 0.2.64 Leerfälle der Werkzeugkarten (Opus, Zweig `leerfaelle`, U12: ein Satz statt leerer Befunde, kein doppelter Satz; Schicht `ui/werkzeuge/leerfall.ts`); davor 0.2.63 Datenschutz: E-Mail-Weiterleitung an goneo (Opus); davor 0.2.62 Impressum und Datenschutz mit den Angaben des Autors (E1, E2 erledigt); davor 0.2.61 Rückmeldung des Autors zu 0.2.56 (Opus, Zweig `rueckmeldung-0.2.56`: S9 gewertete Partie ohne Rücknahme und Spielhilfen, S12 nur Stellungen mit möglichen Umwandlungen (Stockfish beendet sich sonst), S13 Stil-Toleranz 0,3 mit Hinweis, S17 Phase der Buchstellungen nach dem Glossar mit „rochiert haben“ aus den Buchzügen, U5 Sonderzüge an Abb. 0.12 bis 0.19, W5 Strukturerkenner mit starken Feldern zuerst, W9 Urteil der Faktorenbilanz des Buches, W10 Warum-Fragen im Repertoire-Trainer, W12 Engine-Vergleich beim Zugerraten; X, S, R, W und U bis auf X5 und U12 erledigt; Befund D2 Glossar gegen Steckbriefe); davor 0.2.60 Abhakliste der Fehlerarten (Fable, Zweig `fehlerarten-abhakliste`, Rest aus S7: Karte „Absichtliche Fehler der Engine“ in den Einstellungen, Vorliebe `erlaubteFehlerarten`, Schnitt mit der Liste der vorgefertigten Gegner beim Anlegen einer Partie); davor 0.2.59 Brillant zweiter Schritt (Fable, Zweig `brillant-annehmbar`: Opfer nur, wenn der Gegner die Figur legal nehmen kann; gezogene Figur zählt auch schon angegriffen; Opfererkennung in `engine/opfer.ts`; Prüfstand 59 von 100 bei 19 Fehlalarmen); davor 0.2.58 Anmerkungen des Autors vom Abend (Fable, Zweig `oberflaeche-toene`: Töne für Schach, Matt, Remis und Warnung; roter Hinweis und Satz bei gesperrter Figur; Schlagring statt Punkt; Figurensatz „Holz“ jetzt Merida; Stern für gewertete Partien); davor 0.2.57 blinde Flecken vollständig (Fable, Zweig `blinde-flecken-2`: Röntgen, Zwischenzug, Grundreihe; Blindheit auch gegenüber gegnerischen Zügen dieser Art; Messung mit allen Flecken); davor 0.2.56 Engine-Variante im Rückblick (Fable, Zweig `rueckblick-variante`, Empfehlung R5: Hauptvariante je Stellung gespeichert, Rückblickkarte „Danach etwa …“); davor 0.2.55 Nachlesen im Buch zu allen Rückfragen (Opus: X1 9.23/9.41, X2 9.42, X4, C1, C2, C5, T1, U6, W6/T5, W11, E3 umgesetzt; S17, C3, W5, U5, D1 beim Autor); davor 0.2.54 Brillant am Prüfstand von chess.com (Fable, Zweig `opfer-pruefstand`: Opfer ab Netto 1, nur die gezogene Figur darf vorher schon angegriffen sein, brillant nur bei gutem Stand danach, nicht aus dem Schach, zweitbester nicht ohnehin gewinnend; 100 Brillant-Züge aus chess.com-Partien als lokaler Prüfstand); davor 0.2.53 Studien lösen und Zug erraten (Opus, AP 13 Stufe 3: Zugfolgen aus Kapitel 10 und 11, Rückfragen W11, W12); davor 0.2.52 Stufen 1 bis 3 menschlicher (Fable, Zweig `stufen-menschlich`, Empfehlung R4: Tiefengrenze statt Skill Level 0, gewichtete Zugwahl mit Temperatur, Fehlerneigung nach Lage, Strähne und Tagesform; Stufen neu gemessen); davor 0.2.51 Vergleich mit chess.com an drei Partien (Fable: Abtausch ist kein Opfer mehr, „stark“ nur vor klarem Gewinn, S18 Spielstärke aus der Genauigkeit, T4 Fallen aus Kapitel 2 und 3, in entschiedener Stellung „?!“ erst ab drei Bauern und kein „!“, 2 s Rechenzeit während der Partie; neue Regel 9 in CLAUDE.md: Empfehlungen gleich umsetzen); davor 0.2.50 Genauigkeit wie bei chess.com (Fable, Zweig `auswertung-chesscom`: Genauigkeit wie bei Lichess aus gewichtetem und harmonischem Mittel, „verpasst“ vor „patzer“, „bester“ nur der Zug der Engine, Platzhalter in der Zeile „Zeichen“ behoben; Rechentiefe war nicht die Ursache); davor 0.2.49 Endspieltrainer (Fable, Zweig `endspieltrainer`: 78 Buchstellungen aus Kapitel 8 und 9 mit Stockfish geprüft, gegen die Engine gewinnen oder Remis halten, Kippen erkannt, gestufte Hilfen); davor 0.2.48 Zielbilanz-Übung, Faktorenbilanz- und Repertoire-Trainer (Opus, AP 13, Buchstellungen und Zugfolgen der Kapitel 2 und 3, Lösung aus den Werkzeugen und dem Buch); davor 0.2.47 Empfehlungen vorab umgesetzt (Opus: S9 Rücknahme ungewertet, K5 kein „??“ bei klarem Gewinn, R3 „Geschätzte Spielstärke“, C8 kein Minderheitsangriff gegen vorgerückten Kandidaten, T1 gleich gute Engine-Züge in vier Übungen, U9 Wiederholung für Taktik und Falle; Widerspruch des Autors genügt); davor 0.2.46 Bots mit Persönlichkeit (Fable: blinde Flecken als Zugarten, die ein Gegner nicht sieht; 18 vorgefertigte Gegner mit eigener Fehlerliste und blinden Flecken; Stufen je Phase verborgen; blinde Flecken auch für eigene Gegner); davor 0.2.45 AP 13 Teil 3 (Opus): Taktiktrainer, „Falle oder Köder“ und Strukturerkenner auf Fables Trainerdaten, Hinweis „Nur dieser Zug“ bei Übungen, Empfehlungen zu allen offenen Rückfragen in `docs/AUFGABEN_AUTOR.md`; davor Lesart der Phase: Mittelspiel, sobald eine Seite entwickelt ist oder das Material ungleich ist; „Bauern entscheiden“ nur bei Freibauer oder wenig Material; Erklärung am Phasenwechsel im Rückblick (Befund S17: Abb. 11.4); davor 0.2.43 „M“ und „E“ in der Zugliste, Zusatzregel „Zug 15“ gestrichen; davor 0.2.42 Ergänzungen des Autors vom Abend (Fable: Wertung nur aus der Grundstellung, Wertung zurücksetzen, eigene Gegner mit Fehlerarten und Spielstil, Wertungskurve je Phase); davor 0.2.41 Spielen nach den Wünschen des Autors vom Nachmittag (Fable: zwölf vorgefertigte Gegner, Mensch gegen Mensch, Spielhilfen zuschaltbar, Partienkachel mit Ergebnis und Stärke beider Seiten, Wertung nach Elo mit Kurve in den Einstellungen, Zusatzregeln für die Phase, Stellungseditor); davor 0.2.40 Spielen nach den Ideen des Autors (Fable: Zugklassen wie bei chess.com, Phasen in Kurve und Spielstärke, Auswertung im Hintergrund, Stufe je Phase, Fehlerprofile je Phase); davor 0.2.39 Rückmeldung zum Nachtest bis N174 (Fable, Zweig `rueckmeldung-0.2.39`: Figurensätze, Nummernsprung, Werkzeugtexte, Rückblick-Karte mit Erklärung, „!“, Spielstärke, Eröffnung wählen) und die Trainerdaten (Fable, Zweig `trainerdaten`, zusammengeführt); davor 0.2.38 H Rückblick nach der Partie (Zweig `rueckblick`); 0.2.37 AP 13 Teil 1 und 2: Übungen des Buches lösen, Wiederholung, erste Trainer (Opus, Zweig `nacht-ap13`; davor 0.2.36 AP 11 Kalibrierung (Fable), 0.2.35 neuer Buchstand, 0.2.34 erster Stand im öffentlichen Repository `dobili/SvGa_Public`) · Nächstes: Nachtest N182 bis N200, Rückfragen U1 bis U11 in `docs/AUFGABEN_AUTOR.md`; Trainerdaten von Fable zusammenführen · Die ganze ältere Arbeitsgeschichte (Prüfhilfen, Berichte, Archiv) liegt im früheren privaten Repository des Autors

Jede neue Sitzung liest zuerst `CLAUDE.md`, dann diese Datei, und macht beim Abschnitt
„Nächster Schritt“ weiter.

## Freigaben des Autors

- 13.10.2026: Pflichtenheft, technisches Konzept und Bildschirmentwürfe angesehen und einverstanden.
- 13.10.2026: AP 0 (Gerüst) und AP 1 (Durchstich) freigegeben, dazu alles, was ohne seinen Eingriff
  geht (also auch AP 2 Datenpipeline). Er wünscht eine **Test-Checkliste** für den Handytest.
- 13.10.2026 abends: AP 2 vor seinem Handytest vorziehen, eigener Zweig `ap2-datenpipeline` erlaubt.
  `pruefe_buch.py` liegt in `dobili/schachbuch-quellen` unter `werkzeuge/`; seine Prüfungen sollen
  in die Pipeline.
- 14.10.2026: AP 3 ebenfalls vor dem Handytest (Pipeline-Arbeit). Modell gewechselt auf **Fable**.
- Der Autor möchte erinnert werden, wann ein Wechsel auf Fable sinnvoll ist (AP 3, 7, 9, 11).
- 17.10.2026 nachmittags: **Empfehlungen gleich umsetzen** (CLAUDE.md, Regel 9): Rückfrage mit
  Empfehlung dokumentieren, dann sofort umsetzen; Widerspruch genügt für den Rückbau. Warten nur,
  wenn Umsetzen und Rückbau verwickelte Probleme machen könnten. Gilt auch für Opus.
- 14.10.2026: Teil E (Zugfolgen) freigegeben, alle 251 Beispiele. Version 0.2.3 nach dem Nachtest
  vollständig getestet: **AP 5 freigegeben** (damit AP 2 bis AP 6). Der Autor erlaubt Pushes nach
  `main`, wenn sinnvoll. AP 7 startet in einer **neuen Sitzung mit Fable** (ein Modellwechsel im
  langen Verlauf würde den ganzen Chat neu einlesen).

## Konten und Umgebung

- GitHub: Konto `dobili`. Öffentliches Repository `dobili/SvGa_Public` (seit 16.10.2026, GPL),
  davor das private Repository des Autors (jetzt Archiv). Claude-GitHub-App für `dobili/SvGa_Public`
  und `dobili/schachbuch-quellen` (privat, Buchquellen).
- Cloudflare: Worker `schach-von-grund-auf`, seit 16.10.2026 mit `dobili/SvGa_Public` verbunden
  (Root directory `app`, Produktionszweig `main`, Vorschau-Builds an). Nach dem Verbinden baut
  Cloudflare erst beim nächsten Push, nicht sofort.
- **Domain:** Der Autor hat am 15.10.2026 `schach-von-grund-auf.com` bei Cloudflare registriert und
  mit dem Worker verbunden (App unter `https://schach-von-grund-auf.com/app/`, Startseite des
  Buches unter `/`, QR-Ziel `/installieren/`). Davor liefen die Tests über `*.workers.dev`.
- **E-Mail:** `kontakt@schach-von-grund-auf.com` (vom Autor eingerichtet, 15.10.2026). Gedacht für
  Impressum, Datenschutz, „Fehler melden“ und die Startseite; seit 0.2.62 mit den übrigen
  Impressumsangaben eingetragen.
- Netzzugang der Cloud-Umgebung: am 13.10.2026 um 22:04 vom Autor auf „Voll“ gestellt (beide
  Umgebungen „Default“). Gilt für Sitzungen, die danach starten. Die Sitzung davor hatte nur GitHub.
- Ein Testzweig `probe-ci` liegt noch im Repository (ließ sich über den Proxy nicht löschen).
- Sitzung vom 13.10.2026 abends: npm und PyPI erreichbar, normaler Ablauf (siehe `CLAUDE.md`).
  Die Sitzung arbeitete auf `ap0-geruest` und spiegelte jeden Stand nach
  `claude/funny-bardeen-e7wpzs` (Vorgabe der Sitzungsumgebung). Einen eigenen Zweig
  `ap1-durchstich` gibt es nicht: AP 1 liegt mit AP 0 zusammen auf `ap0-geruest`.

## Erledigt

### AP 0 Gerüst – fertig

- `LICENSE` (GPLv3), `README.md` mit Wegweiser, `CLAUDE.md`, `.gitignore` (Buchquellen ausgeschlossen)
- Figuren: `pipeline/figuren/erzeuge_figuren.py` → `app/src/ui/brett/figurenpfade.generiert.ts`
  (SkakNew, LPPL 1.2 oder neuer, Lizenztext 1.3c in `app/public/lizenzen/`)
- Schemas: `schemas/abbildung.schema.json`, `kapitel.schema.json`, `index.schema.json`
- App-Gerüst `app/`: Vite 8.3.4, React 19.3, TypeScript 6.0.3 (strikt), vite-plugin-pwa 2.0
  (eigener Service Worker `src/sw.ts`), chessops 0.15.1, Stockfish 19.0.1, ESLint 10, Prettier 3.9,
  Vitest 5, Playwright 1.64 mit axe-core. Versionen fest in `app/package.json`.
- Typen aus Schemas: `app/skripte/erzeuge-typen.mjs` → `src/daten/generiert/` vor jedem tsc/Build
- Engine-Kopie beim Build: `app/skripte/kopiere-engine.mjs` → `public/engine/`
- Größenbudget beim Build: `app/skripte/pruefe-groesse.mjs` (25 MB; aktuell 2,5 MB)
- App-Symbole: seit 0.2.106 `app/skripte/erzeuge-appsymbol.mjs` (goldener Springer aus dem Cover, Startbildschirm) und `app/skripte/erzeuge-symbole.mjs` (weißer Springer auf Navy, nur Browser-Tab `symbol.svg`) → `public/symbole/`
- Cover als WebP: `app/public/cover.webp` (aus `buch/a1/cover_a4.pdf`, 480 px breit)
- CI `.github/workflows/pruefen.yml`: Pipeline (ruff, pytest, Daten gegen Schemas ohne
  Buchquellen), App (Typen, ESLint, Prettier, Vitest, Build, Größenbudget,
  `wrangler deploy --dry-run`), Oberfläche (Playwright Chromium + WebKit in Handygröße).
  **Erster Lauf am 13.10.2026: alles grün, 16 von 16 Oberflächentests.**
- Cloudflare: `app/wrangler.jsonc` (Worker `schach-von-grund-auf`, statische Dateien aus `dist/`),
  `app/public/_headers`; Klickanleitung für den Autor `docs/archiv/stand-0.2.30/CLOUDFLARE.md`
- Doku: `docs/ARCHITEKTUR.md`, `docs/BEGRIFFE.md`, `docs/LIZENZEN.md`, README je Modulordner

### AP 1 Durchstich – fertig, wartet auf den Handytest des Autors

- Schachlogik: `schach/angreifer.ts` (mit Batterien), `schach/abtausch.ts` (billigste Figur zuerst,
  beide Seiten dürfen aufhören), `schach/notation.ts` (deutsche Notation)
- Werkzeug **k1-zaehlen** (`analyse/k1-zaehlen.ts`) mit gemeinsamer Werkzeug-Schnittstelle
  (`analyse/werkzeug.ts`, `register.ts`). Referenztests reproduzieren die Buchpfeile von
  Abb. 1.6, 1.26 und 1.28 exakt (aus `kap01.json`).
- Engine-Dienst (`engine/engineDienst.ts`): Stockfish 19 lite single im Web Worker, ein Auftrag zur
  Zeit, Abbruch, Messung von Start- und Rechenzeit; Vitest mit der echten Engine unter Node.
- Bildschirme: Installationsseite (Cover, „App installieren“, iPhone-/Mac-/andere Anleitung,
  Offline-Fortschritt in Prozent, „Erst im Browser ausprobieren“, Lizenzen), Buch (Nummernfeld mit
  Vorschlägen, „Zuletzt“, Kapitel mit Abbildungen), Abbildung (SVG-Brett nach den Buchmaßen,
  Feld antippen → Zählen, Engine-Karte, Blättern, Bildunterschrift mit Verweisen), Ich
  (App-Version, Datenstand, Offline bereit, Nach Update suchen, Fehler melden), Lizenzen,
  „Folgt mit einem Update“ für Training, Spielen, Nachschlagen.
- Update-Hinweis „Neue Version verfügbar – Jetzt aktualisieren“ (nur nach Tippen)
- Navigation als Stapel, Android-Zurück über einen Verlaufseintrag
- Dunkler Modus, Kontrast nach axe ohne schwere Verstöße
- Test-Checkliste für das Handy: `docs/TESTANLEITUNG.md` (iPhone und Android getrennt)
- **Änderung 15.10.2026 (Autor):** Die Installationsseite wird zur statischen Startseite des
  Buches unter `/` (Cover, Beschreibung, Shops, Installationsteil); die App zieht nach `/app/`, der
  QR-Code zeigt auf `/installieren/`. Entscheidung und Adressen: `docs/ENTSCHEIDUNGEN.md`,
  Abschnitt „Startseite des Buches vor der App“. Umgesetzt in Version 0.2.27.

### AP 2 Datenpipeline – Daten fertig (Zweig `ap2-datenpipeline`)

- **Prüfungen aus `pruefe_buch.py`** in `pipeline/pruefen/buch.py` (Nummern lückenlos und eindeutig,
  Verweise mit Ziel, Glossaranker, `\ref`/`\cite`, Regel R10.4, Stil R7.6/R7.8) und
  `pipeline/pruefen/abbildungen.py` (Lehrbilder ohne König erlaubt, Matt ohne Nennung, Zugseite nach
  erster Nennung). Ergebnis auf den Quellen vom 13.10.2026 wie beim alten Skript: 0 Fehler, 0 Hinweise.
- **Fehler im Leser behoben:** Satzende-Punkt hinter dem letzten Zug („5. Se5.“) ergab 22 falsche
  Zugseiten-Warnungen.
- **Datenlauf über alle Kapitel 0–12:** 765 Abbildungen, 86 Übungen (Übung 1–86 mit Lösung),
  255 Glossareinträge, 13 Steckbriefe, 17 Zielbilanzen, 18 Faktorenbilanzen; 0 Fehler, 0 Warnungen,
  11 Hinweise (10 Lehrbilder ohne König, Abb. 0.2 ist ein Bild). Bericht
  `docs/berichte/datenlauf-2026-10-13.md`. Daten 1,2 MB, App gesamt 3,6 MB.
- Neue Module: `lesen/quellen.py`, `lesen/verzeichnis.py` (Labels, Literatur, Glossaranker wie
  LaTeX), `lesen/uebungen.py`, `lesen/glossar.py`, `lesen/bilanzen.py`, `bauen/inhalte.py`;
  Textwandler mit Absätzen, Zustandszeichen, `\ref`, `\cite`, `\glseite`, Begriffsverweisen.
- Neue Schemas: `text`, `uebung`, `bilanz`, `glossar`; `kapitel` und `index` erweitert.
- App: alle Kapitel im Buch-Bildschirm, Lehrbilder ohne Engine-Knopf, Bildunterschrift zeigt auch
  Absätze und Zeichen. Tests: 32 Pipeline, 62 App (davon Daten-Zusammenhang und k1-zaehlen auf allen
  765 Abbildungen unter 50 ms), 10 Oberflächentests lokal (CI zusätzlich WebKit).

### AP 3 Zugfolgen-Verfahren – Pipeline fertig, Entwürfe warten auf Freigabe (Zweig `ap3-zugfolgen`)

- `lesen/zugfolgen.py`: alle 2738 `\zugfolge`-Stellen lesbar (deutsche Notation, Zugzeichen,
  Langnotation, „e.p.“, Doppelschach), 2347 Zugfolgen mit Zusammenhang (Fließtext, Unterschrift,
  Übung, Lösung), Verweise auf Abbildungen davor und danach; dazu die Züge aus „Nach …“-Unterschriften.
- `zugfolgen/nachspielen.py`: Variantenbäume je Beispiel, Anschlusssuche (Reihenfolge im Dateikopf),
  Schach-/Mattzeichen zählen mit, Nebenvarianten, ein Beispiel je Eröffnung, Abbildungen gehören
  zum Beispiel ihres Abschnitts, Fortsetzungen in späteren Kapiteln (Kapitel 5/6 → Kapitel 2).
- Ergebnis auf den Quellen vom 13.10.2026: **196 Beispiele, 3213 Züge, 436 Abzweigungen,
  640 von 765 Abbildungen erreicht** (Kapitel 1, 3, 4, 12 vollständig; Kapitel 0 und 5 enthalten
  viele Lehrbilder ohne Zugfolge). Befunde für den Autor im Bericht: 4 nicht spielbare Züge,
  3 Zugfolgen ohne Anschluss, 2 Unterschriften, deren Züge nicht zur Abbildung führen,
  Zugnummern und fehlende „+“ als Hinweise. **Korrektur (AP 4):** Diese Befunde waren nicht alle
  echt. Die Durchsicht in AP 4 ergab, dass 7 der 9 Warnungen Fehlgriffe der Pipeline waren (etwa
  Kapitel 7, Zeile 1005: die Lösung zu Abb. 7.56 zählt ab der Übung, die Pipeline hängte
  „2... Ke8 3. Td8#“ an einen fremden Baum).
- `zugfolgen/pgn.py`: PGN-Entwürfe in `inhalte/de/zugfolgen/kapNN/` (`[Status "entwurf"]`), nie
  überschriebene freigegebene Dateien, Einlesen und Abgleich freigegebener Beispiele in die
  Kapiteldaten (`beispiele`, `abbildung.beispiel`); Schema `schemas/beispiel.schema.json`.
  Anleitung zur Freigabe: `inhalte/de/README.md`.
- `zugfolgen/zugzeichen.py`: Engine-Prüfung der Zugzeichen (Stockfish 19 lite unter Node, Tiefe 14),
  Aufruf `--zugzeichen`, Hinweise im Bericht; Schwellen sind Startwerte.
- Tests: 39 Pipeline-Tests (eigenes Testkapitel `kap10_zugfolgen.tex`, Engine-Test wird ohne
  Engine übersprungen), App 66 Tests, 10 Oberflächentests.

### AP 4 Zugfolgen erfassen – vorbereitet (Zweig `ap4-freigabe`, Opus)

- **Prüfhilfe** `docs/freigabe/kapNN.md` und Übersicht `docs/freigabe/README.md`
  (`pipeline/zugfolgen/freigabe.py`, bei jedem Datenlauf neu): je Beispiel Start, Hauptlinie in
  deutscher Notation mit Abbildungen am Zug, Abzweigungen mit LaTeX-Zeile, Befunde mit
  Einschätzung, Hinweis auf Beispiele mit gleicher Startstellung. Status „verworfen“ für Entwürfe,
  die nicht in die App sollen; veraltete Entwürfe löscht die Pipeline.
- **Einschätzungen** `inhalte/de/einschaetzungen.json`: alle verbliebenen Befunde zu den Zugfolgen
  von Hand geprüft. Ergebnis: **ein echter Buchbefund** (Kapitel 6, Abb. 6.29: „22... Dg2“ ist
  Matt, im Buch fehlt „#“), 2 Warnungen ohne Buchfehler (Abb. 7.24 ohne Ausgangsstellung, Drohung
  in der Lösung zu Abb. 9.45), 4 Zugzeichen-Hinweise durch falsch angehängte Erwähnungen (mit
  Anweisung, welcher Zweig im Entwurf zu löschen ist), 2 Studien-/Aufgabenfälle, 7 Fälle
  „Ermessen des Autors“ (Engine weicht auch bei Tiefe 22 ab).
- **Zuordnung genauer** (`zugfolgen/anschluss.py`, aus `nachspielen.py` ausgelagert): Lösungen
  bleiben im Baum ihrer Übung und zählen auch ab der Übung; Übungen wandern nicht in fremde
  Übungsbäume; Unterschriften und Text vor seinen Diagrammen nur, wenn sie die Abbildung
  erreichen; erneute Erwähnungen ohne Kopie; „x“ und „+“ zählen. Ergebnis: **193 Beispiele,
  3191 Züge, 639 von 765 Abbildungen** (die fehlende, Abb. 8.50, war vorher falsch verknüpft),
  **2 Warnungen statt 9, keine Zugnummer-Hinweise mehr.**
- **Engine-Prüfung reproduzierbar** (neue Partie je Suche) und zweistufig (Tiefe 14, Bestätigung
  mit Tiefe 22): 13 statt 25 Zugzeichen-Hinweise. Lauf mit `--zugzeichen` etwa 4,5 Minuten.
- Tests: 43 Pipeline-Tests (Testkapitel um Übung mit relativer Zählung und kurze Unterschriften
  erweitert, Prüfhilfe, Status „verworfen“).

### AP 6 Lösungserklärungen – Entwürfe fertig (Zweig `ap4-freigabe`, Opus)

- **86 Entwürfe** in `inhalte/de/texte/loesungen-kap00.json` bis `kap12.json`: je Übung
  Lösungszüge, akzeptierte Alternativen, Motiv und zwei bis drei Sätze, verdichtet aus der
  Buchlösung. Lesefassung: `docs/freigabe/erklaerungen.md`.
- `pipeline/texte/loesungen.py`: Schema `schemas/loesungstexte.schema.json`, Prüfung gegen das Buch
  (Übung, Nummer, Züge spielbar, erster Zug in der Buchlösung), Engine-Prüfung mit `--zugzeichen`,
  freigegebene als `uebung.erklaerung` in `kapNN.json`. Alle 86 Entwürfe ohne Befund.
- Tests: 47 Pipeline-Tests (neu `test_loesungstexte.py`, prüft auch alle Entwürfe im Repository).

### AP 4 Empfehlungen zur Freigabe (Zweig `ap4-freigabe`, Opus)

- **Feinere Zuordnung:** Fortsetzungen aus früheren Kapiteln (Kopie des früheren Beispiels),
  Übungsdiagramme als eigene Abschnitte, Alternativen in Klammern ohne Einfluss auf die Hauptlinie,
  „nach N.“ mitten in Unterschriften ohne Befund. Ergebnis: **207 Beispiele, 662 von 765
  Abbildungen**, jede erreichte Abbildung steht in einem Entwurf.
- **`inhalte/de/empfehlungen.json`** (`pipeline/zugfolgen/empfehlungen.py`):
  - 15 Empfehlungen zu Beispielen mit gleicher Startstellung (zusammenführen, Vorlauf übernehmen,
    aufteilen, verwerfen) mit Begründung; Übungen automatisch „getrennt lassen“.
  - Alle 103 Abbildungen ohne Zugfolge eingeordnet (Lehrbild, Skelett, Mattbild,
    Endspiel-Lehrstellung, Übungsstellung, Partiestellung, gedachte Stellung). 27 als „Zugfolge
    möglich“ mit maschinell geprüftem Zug (etwa Abb. 0.12 → 0.13 mit O-O).
  - Die Prüfhilfe zeigt beides: Empfehlung unter dem Beispiel, Tabelle am Ende jeder Datei.
- Tests: 55 Pipeline-Tests (neu `test_empfehlungen.py`, prüft auch die Datei im Repository).

### Handytest AP 0 und AP 1 (14.10.2026)

- Getestet vom Autor: iPhone (Safari, installiert), MacBook Safari, MacBook Chrome. Punkte A bis G
  ohne Fehler, Update von 0.1.0 auf 0.1.1 klappte. Kein Android-Gerät zur Hand.
- Messzeile der Engine (Abb. 1.26, 2,5 s Rechenzeit, Start 0,1 s): iPhone Tiefe 23,
  1273 Tsd. Stellungen/s; MacBook Chrome Tiefe 19, 712 Tsd. Stellungen/s.
- Hauptadresse: https://schach-von-grund-auf.bilitewski-d.workers.dev
- Anregungen des Autors, umgesetzt in Version 0.1.2: Rahmen um die App auf breiten Bildschirmen;
  zweites Tippen auf das gewählte Werkzeug erklärt es; im Bereich Ich „Alle Daten dieser App
  löschen“ mit Anleitung zum Entfernen der App.
- Nachtest 0.1.2 bestanden; Gerät des Autors: iPhone 17 Pro, aktuelles iOS. **AP 0 und AP 1 am
  14.10.2026 freigegeben.** Zwei weitere Wünsche in Version 0.1.3: Die Erklärung eines Werkzeugs
  schließt sich bei jedem Tippen daneben (nicht beim Scrollen); übereinanderliegende Pfeile werden
  leicht versetzt gezeichnet (Abb. 1.26: b6–d4 neben c5–d4), nur Darstellung, Buchdaten unverändert.

### AP 5 Kernoberfläche – fertig, freigegeben 14.10.2026 (Zweig `ap5-oberflaeche`, Opus)

Inhalt laut Konzept 15.1: Navigation, Nummernfeld, Kapitel, Abbildung, Nachspielen, Weiterspielen,
Skelett-Ansicht, Glossar, Denkroutine, Checkliste, Einstellungen, Installationsseite, Impressum,
Updates, Trainingsmenü mit allen Trainernamen. Teilschritte:

1. **Nachspielen – fertig.** `schach/variantenbaum.ts` (Zeile, Stellung nach Pfad, Abzweigungen),
   `ui/komponenten/Zugleiste.tsx`, `useNachspielen.ts`. Pipeline `--mit-entwuerfen` (Entwürfe als
   „Entwurf“ in der App, Antwort des Autors steht aus). Datentest: alle 662 verknüpften
   Abbildungen stehen an ihrer Stellung.
2. **Weiterspielen und Brettknöpfe – fertig.** Werkzeug „Ziehen“ (Figur und Zielfeld antippen,
   Punkte für erlaubte Felder, Umwandlung mit Auswahl); eigene Züge erscheinen in der Zugleiste,
   ein Buchzug führt im Buch weiter, „Zurück zur Buchvariante“. Letzter Zug mit hellem Schimmer.
   Brett drehen, Koordinaten (gemerkt), Skelett-Ansicht. Eigene Züge bleiben bis AP 12 (Speicher)
   nur im Bildschirm; Ziehen per Wischen folgt.
3. **Kapitelübersicht – fertig.** Ein Tipp auf ein Kapitel im Buch öffnet die Übersicht: Abschnitte
   mit allen Abbildungen als kleine Bretter (Pfeile wie im Buch, Anfang der Unterschrift), ein Tipp
   öffnet die Abbildung. Kapitelbild folgt, wenn die Bilder des Buches final sind.
4. **Nachschlagen – fertig.** Glossar mit Suche (Begriff vor Text), Eintrag mit antippbaren
   Querverweisen und Stellen im Buch (öffnet die Abbildung). Denkroutine (zwei Karten, Phasen
   aufklappbar) und Gesamt-Checkliste (jede Zeile führt zum Kapitel) aus `nachschlagen.json`,
   das die Pipeline aus `anhang_kopiervorlage.tex` und Tabelle `tab:checkliste` liest
   (`pipeline/lesen/nachschlagen.py`, Schema `nachschlagen.schema.json`).
5. **Trainingsmenü und Einstellungen – fertig; Testanleitung AP 5 in `docs/TESTANLEITUNG.md`.** Training zeigt alle
   17 Trainer aus Pflichtenheft 7 je Kapitel mit Ablauf und „folgt mit einem Update“ (auch in der
   Kapitelübersicht); `training/trainer.ts`. Ich: Brettfarben (wie im Buch, Holz, Grün), Strenge
   „Erst selbst denken“ (locker, streng; wirkt ab den Trainern), Sprache, Figurensatz und Ton
   mit „folgt“; `app/einstellungen.ts`. Impressum bleibt Platzhalter bis zu den Angaben des
   Autors. Der Autor testet nach `docs/TESTANLEITUNG.md` (AP 5) auf der Testadresse von
   `ap5-oberflaeche`.

- Teil C, Nr. 5 (Heuäcker-Studie, 1. h7?) per Endspieldatenbank geklärt: „?“ bleibt.

6. **Teil E (Zugfolgen) – zweimal unabhängig geprüft, berichtigt und am 14.10.2026 freigegeben.** Der Autor hat A bis D
   freigegeben und für E die Empfehlungen angenommen, soweit sie das Buch nicht ändern. Fünf
   unabhängige Prüfungen (je Kapitelgruppe) fanden rund 90 Beispiele mit Mängeln (Hauptlinie war
   der Fehlversuch statt der Buchlösung, Streuerwähnungen aus Tabellen als Abzweigungen,
   Sammelbäume, fehlende Züge aus Unterschriften); keiner verlangt eine Buchänderung. Alle sind
   umgesetzt, alle nicht verworfenen PGN stehen auf dem neuen Status `geprueft` (die Pipeline
   überschreibt sie nicht; in der App mit `--mit-entwuerfen` als Entwurf).
   Werkzeuge: `pipeline/zugfolgen/bearbeiten.py` (pfropfen, abtrennen, Vorlauf, Hauptlinie …),
   `python -m pipeline.zugfolgen.pruefe_pgn 0 1 … 12` (lesbar, Abbildungen an ihrer Stellung,
   keine Abbildung doppelt): 0 Befunde. `inhalte/de/empfehlungen.json` enthält nur noch die
   Einordnung der Abbildungen ohne Zugfolge.
   Außerdem: Die Pipeline liest jetzt auch `\section[kurz]{lang}`; dadurch stimmen die
   Abschnittsnummern in Kap. 2, 4, 5, 6 … mit dem Buch überein.
   **Zweite unabhängige Prüfung (fünf neue Prüfer, nur lesend):** 250 Beispiele, alle Züge legal,
   alle Abbildungen an ihrer Stellung. Rund 35 kleinere Punkte, alle umgesetzt: im Buch genannte
   Schlusszüge ergänzt (etwa k07-a14 3. Sxd6, k08-a29 2. Kd7), zwei Hauptlinien auf die Buchlösung
   (k01-a13 3... g6!, k01-a26 7... Ld7!), k07-a53, k12-a5 und k12-a6 wie die Heuäcker-Studie
   (Lösungszug vorn, Fehlversuch als Abzweigung), k05-a7 geteilt (neu k05-a11), neue Beispiele
   k06-a19 und k08-a50, Streuerwähnungen entfernt (k02-a77, a119, a135), k11-a57 und k11-a32:
   „Schwarz gab auf“ am richtigen Zug, danach als Analyse gekennzeichnet. Die Pipeline hatte
   zwei Entwürfe neu erzeugt (k04-a35 doppelt, k04-z-e4-e5-sf3 ohne Abbildung): verworfen.
   Bewusst so gelassen: k01-a13 Abzweigung 3. Dxe5+?? (bezieht sich ausdrücklich auf Abb. 1.14),
   k06-a34 (die Übung fragt genau nach 10. Lxh7+), k11-a32 Abzweigung 10. O-O-O (führt zu Abb.
   11.32), Übungsstellungen 11.99 bis 11.101 (haben eigene Übungsbeispiele), Abb. 7.45 und
   gedachte Stellungen mit Weiß am Zug zu 8.50 und 8.53 (keine Verbindung zu einer Abbildung).
   Buchbefunde nur formal (Halbzugzähler in FEN 8.17, 8.18, 8.20–8.22, 9.4; Zugnummern 7.56).
   Gegenprüfung an der sprachlich überarbeiteten Buchfassung (Autor, 14.10.2026): Daten und alle
   Züge im Text gleich (Skript-Vergleich alt/neu), neu nur 22... Dg2# (Kap. 6) und 2. Dxf2+ (Kap. 9).
   Nach der Vorgabe des Autors damit freigegeben: 251 Beispiele `freigegeben`, 13 verworfen.

7. **Handytest 0.2.0 (14.10.2026) → Version 0.2.1.** Alles lief; umgesetzt: Schimmer des letzten
   Zuges hellblau statt weiß (war auf hellen Feldern unsichtbar), Buchmarkierungen beim Ziehen und
   in der Skelett-Ansicht ausgeblendet, Trainer-Überschriften linksbündig, Brettfarbe „Holz“ mit
   Maserung (`ui/brett/Holzmaserung.tsx`, SVG-Rauschen, nur auf großen Brettern). Nachtest N8–N12.
   **Wünsche des Autors für AP 11 (Spielen gegen die Engine, Pflichtenheft 5.2 und 9 „ab einer
   Buchstellung“):** aus jeder Stellung „gegen die Engine zu Ende spielen“; Knopf für eine ruhige
   Ansicht nur mit Brett, Zugnavigation und gespielten Zügen; Züge zurücknehmen; Stufe wählen;
   Tipps auf Grundlage der Engine-Bewertung (passend zu den gestuften Hinweisen, Pflichtenheft 6).
   **Gesamt-Checkliste:** derzeit Nachschlagekarte der Tabelle aus Kap. 12. Sie bekommt ihren Nutzen
   mit AP 12/13: Fehlerdatenbank (Spalte Fehlerart), Phasen-Werkzeug (schlägt das Werkzeug vor),
   Aufruf aus den Trainern. Autor fragen, ob zusätzlich Abhaken je Kapitel (Lernstand) gewünscht ist.

8. **Version 0.2.2 (14.10.2026):** Gesamt-Checkliste als Abhakliste. Die Pipeline liest am Ende
   jedes Kapitels „Bevor du … weiterliest, solltest du Folgendes können“ (Kap. 0 als Fließtext,
   Kap. 12 „Bevor du das Buch zuklappst“): 77 Punkte in 13 Kapiteln, `pipeline/lesen/lernziele.py`,
   `nachschlagen.json` Feld `lernziele`. Die App zeigt je Kapitel Kernfrage, Stand, Punkte zum
   Abhaken, Werkzeug, Fehlerart; Haken in `app/lernstand.ts` (Merker; mit AP 12 in den
   gemeinsamen Speicher). Holz nach dem Vorbild von Lichess neu (durchgehende weiche Faser,
   Schimmer gelbgrün), Werkzeugknöpfe über der Zugleiste. Nachtest N13–N16.

9. **Version 0.2.3 (14.10.2026):** Zugleiste über dem Brett, Werkzeuge und ihre Ergebnisse direkt
   darunter (Ergebnis erscheint dort, wo getippt wurde). Rochade wie bei Chess.com über das
   Zielfeld des Königs (`schach/weiterspielen.ts`, `rochadeziel`). Holz mit Fotos echten Holzes
   (ambientCG Wood095/Wood026, CC0, `app/public/holz/`, `ui/brett/Holzfelder.tsx`) statt
   gerechneter Maserung, Figuren auf Holz schwarz. Nachtest N17–N19.

10. **Version 0.2.4 (14.10.2026, mit AP 7):** Die vier Zugknöpfe (Anfang, zurück, vor, Ende)
    stehen ganz unten in der Zugleiste, direkt über dem Brett, damit sie ohne Scrollen erreichbar
    sind (Wunsch des Autors). Nachtest N20.

### AP 7 Analyse-Grundbausteine – fertig (Zweig `ap7-analyse`, Fable)

Konzept 7.2: „Für jede Stellung berechnet der Kern einmal ein Profil, das alle Werkzeuge teilen.“
Alle Bausteine sind reine Funktionen in `app/src/schach/`, zusammengefasst in
`app/src/analyse/stellungsprofil.ts` (`profil(stellung)`, je Stellung einmal, jeder Teil erst beim
ersten Zugriff). Jeder Baustein hat Referenztests an Buchabbildungen (über
`schach/buchabbildungen.testhilfe.ts` direkt aus den erzeugten Daten):

- **Angriffskarte** (`angriffskarte.ts`): Angreifer je Feld und Farbe mit und ohne Batterien,
  gemerkt; angegriffene, ungedeckte (W1 nach Pflichtenheft 6.6) und hängende Figuren.
  Tests: Abb. 7.30, 7.33 (Turm d1 als dritter Angreifer), 7.7 (Turm a1 ungedeckt), 1.34.
- **Abtauschrechnung** (`abtausch.ts`, erweitert): bei gleichem Wert schlägt der Springer vor dem
  Läufer (Abb. 7.30: 1. Sxd5). Tests: Abb. 7.30 (verliert trotz drei gegen drei), 7.33 (+1),
  7.33 mit Turm d7 (gedeckt). Fesselungen bleiben wie im Buch unberücksichtigt (Kapitel 7,
  „Nicht überschätzen“; Pflichtenheft 6.6: „ihre Wirkung prüft F3“).
- **Strahlen und Linienmotive** (`strahlen.ts`, `linienmotive.ts`): je Langschrittfigur die
  erste und zweite Figur auf jedem Strahl; daraus Fesselung (absolut/relativ), Spieß (mit
  Schach, hinten ungedeckt), Abzug (mit Schach), Batterie. Tests: Abb. 7.4, 7.5, 7.7, 7.8, 7.9.
- **Sichere Felder** (`sichereFelder.ts`): je Figur die Zielfelder, auf denen sie laut
  Abtauschrechnung nichts verliert (ein Schlag zählt seinen Gewinn mit); Zugziele auch für die
  Seite, die nicht am Zug ist, und für Lehrbilder ohne König. Tests: Abb. 1.32 (Lh5, Le6), 7.24
  (Läufer a2 eingesperrt).
- **Bauernprofil** (`bauernprofil.ts`, `bauernschwaechen.ts`): Bauern je Linie, Inseln, Ketten
  (nur blockierte Bauern, Basis, Spitze, Stützen von außen), Duos, offene und halboffene Linien,
  Löcher, starke Felder, Mehrheiten mit Kandidat; Deckungstest, Doppelbauern, Isolani,
  rückständige und hängende Bauern, Freibauern. Tests: Abb. 5.6, 5.8, 5.15, 5.17, 5.22, 5.25,
  5.29, 5.30, 5.31, 1.26.
- **Königsumgebung** (`koenigsumgebung.ts`): Nachbarfelder, Fluchtfelder (W3 nach Pflichtenheft
  6.6, der König wird weggedacht), eigene besetzte und angegriffene Nachbarfelder, Bauernschild,
  Linien zum König mit gegnerischen Schwerfiguren, „rochiert“. Tests: Abb. 1.35, 5.12, 5.13,
  7.35, 7.36.
- **Drohungen** (`drohungen.ts`): Schachs (mit Matt), Schläge mit Bilanz des konkreten Schlages,
  Drohungen nach Konzept 7.2 (Materialgewinn oder Matt in einem, als wäre die Seite am Zug;
  entfällt im Schach), drohende Züge (nur neue Drohungen), erzwingende Züge in der Reihenfolge
  des Buches. Vorprüfung, welche Züge Schach geben können (Test: auf allen 765 Abbildungen
  gleich dem vollen Lauf). Tests: Abb. 1.23, 1.24, 1.28, 1.30, 1.34, 7.8.
- **k1-zaehlen** nutzt jetzt das Profil (Angriffskarte und Abtausch), Ergebnis unverändert.
- Laufzeit (Node, alle 765 Abbildungen, alle Bausteine): im Mittel unter 4 ms je Stellung,
  teuerster Teil die erzwingenden Züge (Mittel 1,8 ms, höchstens 11 ms). Test: unter 50 ms.
- Tests: 155 App-Tests (vorher 66), Pipeline unverändert.

Für AP 8 noch offen (keine Bausteine, sondern Werkzeuge): Angriffssektor für die goldene
Angriffsregel, Gabelfelder (W6), Zentrumskontrolle durch Figuren, Eröffnungserkennung über den
Stellungsvergleich.

### AP 8 Werkzeuge Kapitel 1 bis 4 – fertig, Abnahme offen (Zweig `ap8-werkzeuge`, Opus)

Reihenfolge laut Autor: k1-roentgen, k4-warnsignale, k4-prueffragen, k2-zielbilanz,
k3-faktorenbilanz, k1-angriffsregel, k2-eroeffnung, k1-todsuenden, k4-falle. Nach jedem Werkzeug
eine kurze Meldung an den Autor (was es kann, welche Abbildungen es reproduziert, offene Befunde).

1. **k1-roentgen – fertig (Version 0.2.5).** `analyse/k1-roentgen.ts`: vier Fragen der
   Schach-Röntgen-Regel für beide Seiten. Eigene Schachs, Schläge (mit Bilanz; verlierende nur als
   Anzahl), drohende Züge (nach stärkster Drohung geordnet, höchstens sechs mit Namen); für den
   Gegner, als wäre er nochmals am Zug, seine Schachs, Schläge und Drohungen (entfällt im Schach,
   Konzept 7.2). Frage 4 „Optimierung“ als N mit Verweis auf „Engine“. Pfeile: Gold eigene
   Schachs und Gewinnschläge, Grau Abtausch (Sxc5 in Abb. 1.23 wie im Buch), Rot Schachs und
   Drohungen des Gegners; Pfeile für drohende Züge nur, wenn es kein Schach und keinen
   Gewinnschlag gibt (Übersicht). Profil erweitert um `schachsVon(farbe)`, `schlaegeVon(farbe)`.
   Tests: Abb. 1.23, 1.24, 1.30, 1.34, 7.8; alle 765 Abbildungen unter 50 ms.
   **Werkzeugleiste** nimmt jetzt die angemeldeten Werkzeuge: „Zählen“, Werkzeuge des Kapitels,
   „Ziehen“, „Engine“; frühere Kapitel hinter „Mehr …“ (Pflichtenheft 6.1). Neues Pflichtfeld
   `erklaerung` im Werkzeug (zweites Antippen).
   Offen (Entscheidung): gestufte Hinweise (Pflichtenheft 6.1: Liste, dann Markierungen, dann
   Auswertung) zeigt die Karte noch nicht; alle Werkzeuge zeigen sofort alles. Vorschlag: mit dem
   Modus „Erst selbst denken“ in den Trainern (AP 13) umsetzen.
2. **k4-warnsignale – fertig (Version 0.2.6).** `analyse/k4-warnsignale.ts`: W1 bis W5 nach
   Pflichtenheft 6.6 für beide Seiten. Eigene Seite rot („Gefahr“), Gegner gold („Ziele“), W5
   (Schläge mit Gewinn laut Abtauschrechnung) gold mit Pfeil. Jede betroffene Figur trägt am Brett
   ihre Kennung oben rechts im Feld (`ui/brett/Beschriftung.tsx`, Feldmarkierung mit `text`,
   mehrere als „W1·W2“). W2 mit Pfeil von der Langschrittfigur. W4 über das Wegdenken der Figur
   (`schach/aufgaben.ts`: was gewönne der Gegner ohne sie sofort; Matt vor Material, je Feld eine
   Aufgabe; Abschirmen des eigenen Königs zählt), Art N, im Text „(Einschätzung)“. Profil
   erweitert um `doppelteAufgaben(farbe)`. Präzisierung der App zu W2: Ein Bauer vor einer eigenen
   Langschrittfigur auf einer Linie zählt nur als Abzug, wenn er etwas schlagen kann (sonst kann
   er die Linie nicht verlassen; vorher meldete Abb. 4.2 „Dame d1 – Bauer d4 – Dame d8 (Abzug)“).
   Tests: Abb. 4.2, 4.11, 4.13, 4.21, 4.24, 4.38, 4.45, 4.51; alle Abbildungen unter 50 ms.
   Reproduziert: W1 4.2 (Ta8), 4.45 (Dg5), 4.51 (c7, Ta8); W2 4.11 (Df3–b7–Ta8), 4.13
   (Lg5–Sf6–Dd8); W3 4.11, 4.21, 4.24; W4 4.13 (Sf6 hält d5 und d8); W5 4.5, 4.11 (Lxf3 +6),
   4.24, 4.34, 4.38, 4.41, 4.45, 4.48.
   **Befunde und Entscheidungen (an den Autor gemeldet):**
   - Abb. 4.29: Das Buch nennt den Springer f3 als W4 (einziger Verteidiger von h2). Er hat nur
     diese eine Aufgabe; Pflichtenheft 6.6 verlangt zwei Ziele. Die App meldet dort kein W4.
     Entscheidung: Buchtext oder Regel anpassen (etwa „ein wichtiges Feld genügt, wenn dort Matt
     droht“).
   - Abb. 4.21: Das Buch sieht auf der e-Linie ein W2, zwischen Turm und König stehen aber zwei
     Figuren; die Regel verlangt „direkt dahinter“. Die App meldet dort stattdessen die Fesselung
     Lb4–Sd2–Ke1. Entscheidung: Regel erweitern (Linie mit zwei Figuren dazwischen) oder Buchtext.
   - Abb. 4.13: Das Buch nennt W5 auf d5 „scheinbar“ (Sxd5?? scheitert an der Fesselung). Die
     Abtauschrechnung kennt keine Fesselungen und zeigt dort keinen Gewinn, also kein W5. Das passt
     im Ergebnis, aber die App nennt das Scheingeschenk nicht. Vorschlag: k4-falle (Engine) zeigt
     solche Scheingeschenke.
   - W1 meldet unentwickelte Türme in den Ecken fast immer (regelgerecht, aber viel). Vorschlag:
     so lassen; sonst W1 nur für angegriffene oder entwickelte Figuren.
   - W2 nannte auch Linien mit ungedecktem Turm hinter einem Bauern (Abb. 4.2: Ta1–a7–Ta8),
     regelgerecht nach „wertvoller als die vordere“.
   - (In 0.2.7 erledigt: Ein Bauer auf einer Linie zählt bei W2 gar nicht mehr, wenn er nicht
     schlagen kann, auch nicht als Fesselung; damit entfällt Ta1–a7–Ta8 in Abb. 4.2.)
3. **k4-prueffragen – fertig (Version 0.2.7).** `analyse/k4-prueffragen.ts` und
   `schach/fesselungen.ts`. Geplanter Zug: in der Abbildung der nächste Zug der Zugleiste
   (`useNachspielen.naechsterZug`, nächster eigener Zug, sonst nächster Buchzug); neues
   Eingabefeld `zug` im Werkzeug, `braucht: ["stellung", "zug"]` (Zug freiwillig).
   F1 (V): geplanter Schlag oder Schläge mit Gewinn laut Abtausch, „Warum lässt … das zu?“.
   F2 (V): vorbereiteter Text mit Verweis auf „Engine“ (die zwei stärksten Antworten in
   Schritten zu vier Halbzügen kommen mit k4-falle, weil beide die Engine im Werkzeug brauchen).
   F3 (E): alle Fesselungen, absolut immer, relativ nur mit drohendem Materialverlust (hintere
   Figur wertvoller als die Langschrittfigur oder ungedeckt, und die gefesselte Figur kann die
   Linie verlassen; ein Bauer auf einer Linie nur mit Schlag). Dazu **verdeckte** Fesselungen
   gegen den König (Langschrittfigur – Figur – Figur – König). Zweiter Teil mit geplantem Zug:
   aufgehobene, neue und bleibende absolute Fesselungen gegen dich, dazu Antworten des Gegners,
   die eine neue Fesselung gegen den König aufbauen und sofort mindestens eine Leichtfigur
   gewinnen oder mattsetzen. Pfeile: grau Fesselungslinien, rot gegen dich nach dem Zug, gold
   der geplante Zug. Werkzeugleiste bricht jetzt um (drei Werkzeuge in Kapitel 4).
   **Kalibrierung an den F3-Zeilen der Fallenchecks:** „Keine Fesselung im Spiel“ in 4.2, 4.5,
   4.29, 4.34, 4.38 (App ebenso, auch nach dem Buchzug); relativ in 4.13 (Lg5–Sf6–Dd8) und 4.17
   (Lg4–Sf3–Dd1); zweite Fesselung in 4.21 (nach axb4: Lb4–Sd2–Ke1 aufgehoben, verdeckt
   De7–Se5–e2–Ke1 bleibt, Antwort Sd3#) und 4.24 (nach Sxe4: Antwort De2 baut De2–Se4–e7–Ke8
   auf). Tests: 13 Referenztests, alle Abbildungen mit nächstem Buchzug unter 50 ms.
   **Befunde und Entscheidungen:**
   - Abb. 4.45: Das Buch sagt „Keine Fesselung im Spiel“; der Läufer b2 fesselt aber den Bauern
     g7 an den ungedeckten Turm h8 (zieht g7, fällt h8). Die App nennt sie. Buchtext prüfen.
   - Abb. 4.41 (kein F3 im Buch): Nach 4. Sxe5 nennt die App die Antwort De7 (verdeckte
     Fesselung De7–Se5–e4–Ke1, der Springer hängt). Das Buch zeigt Dg5. Kein Fehler, nur eine
     zweite Widerlegung; zur Kenntnis.
   - Kalibrierung relativer Fesselungen (App-Regel, siehe oben) und Mindestgewinn einer
     aufbauenden Antwort (eine Leichtfigur, sonst meldet 4.2 Da4 gegen b5): bitte bestätigen.
   - F2 mit Engine folgt mit k4-falle (Entscheidung der Reihenfolge, nicht des Inhalts).
4. **k2-zielbilanz – fertig (Version 0.2.8).** `schach/zielbilanz.ts` und
   `analyse/k2-zielbilanz.ts`: die drei Prüfungen aus Kapitel 2 für beide Seiten, je ja, teils
   oder nein, als zwei Spalten wie die Tabelle im Buch. Zentrum: eigener Bauer auf d4, e4, d5,
   e5 (teils, wenn der Gegner am Zug ihn laut Abtausch mit Gewinn schlägt); ohne Bauern
   Figurenkontrolle nach Pflichtenheft 6.6 (seit 0.2.10): ja, wenn eigene Figuren mindestens zwei
   Zentrumsfelder mindestens so oft angreifen wie der Gegner, teils bei einem Feld (N). In 0.2.8
   galt versehentlich eine eigene Regel (drei kontrollierte Felder). Entwicklung: Leichtfiguren auf
   ihrem Startfeld; alle weg ja, zwei oder drei weg teils, sonst nein. König: rochiert (Grundreihe,
   Linie a, b, c, g, h) und mindestens zwei der drei Schildbauern auf Reihe 2/3 (7/6): ja;
   rochiert mit gelockertem Schild teils; sonst nein. Markierungen: rot offene Leichtfiguren und
   König in der Mitte, gold haltbare Zentrumsbauern und sicherer König, grau übrige Zentrumsfelder.
   **Kalibrierung:** alle 17 Bilanztabellen aus Kapitel 2 (51 Wertungen je Seite und Ziel),
   49 stimmen (96 Prozent); der Test vergleicht jede Wertung mit dem Buch
   (`k2-zielbilanz.test.ts`, Ausnahmen nur als benannte Befunde).
   Neue Testhilfe `bilanzfaelle(art)` (auch für k3-faktorenbilanz). Gemeinsame Textbausteine in
   `analyse/texte.ts` (Figurenname, Farbe, Aufzählung „d4, e4 und d5“).
   **Befunde und Entscheidungen:**
   - Abb. 2.71 (Angenommenes Damengambit, Tabelle in der Bilanz zu Abb. 2.76): Schwarz hat keinen
     Zentrumsbauern, seine Figuren beherrschen aber e4 und d5 mindestens so oft wie Weiß. Das Buch
     wertet „teils“, nach Pflichtenheft 6.6 ist es „ja“ (wie Abb. 2.142, Buch „ja“). Buchtext
     prüfen oder Regel verschärfen.
   - Abb. 2.128 (Zweispringerspiel): Weiß ohne Zentrumsbauern beherrscht nur d4 mindestens so oft
     wie Schwarz (e4 und e5 greift Schwarz öfter an). Das Buch wertet „ja“ („Springer d3 und
     Läufer b2 beherrschen e5 und d4“), nach Pflichtenheft 6.6 ist es „teils“. Buchtext prüfen.
   - Abb. 2.16 (Berliner Verteidigung): Das Buch nennt den König auf d8 ohne Damen „sicher“; die
     App sagt nach der Regel „nein“ (nicht rochiert). Das Buch nennt das selbst eine Ausnahme;
     zur Kenntnis.
5. **k3-faktorenbilanz – fertig (Version 0.2.9).** `schach/faktorenbilanz.ts` (Material, Zeit),
   `schach/faktoreinschaetzung.ts` (Königssicherheit, Aktivität), `analyse/k3-faktorenbilanz.ts`,
   `ui/komponenten/Waage.tsx`. Material und Zeit als Vergleich mit **Waage** (Grafik, neigt sich
   zur Seite, die vorn liegt; neues Feld `waage` im Befund). Zeit nach der Zählhilfe in Kapitel 3,
   Figuren in Buchreihenfolge („Lc4, Df3 und Tf1“), mit Abzug, wenn Schwarz am Zug ist.
   Königssicherheit und Aktivität je Seite gut, teils, schlecht (N), Haltbarkeit (V, eigene Worte
   nach der Tabelle „Wie lange hält welcher Faktor?“), Fazit „wer liegt wo vorn“ mit Hinweis auf
   die Engine. Gold: Figuren, die bei der Zeit zählen; Rot: gegnerische Türme und Damen auf
   offenen Linien am König.
   **Kalibrierung an allen 18 Faktorenbilanzen** (Kapitel 3, 6, 11): Material und Zeit 36 von 36
   wie die Waage im Buch, einschließlich des Vorsprungs. Königssicherheit 32 von 36, Aktivität
   29 von 36 (Konzept 13 nennt 90 Prozent; beide sind Einschätzungen, Abweichungen immer nur eine
   Stufe): Königssicherheit 3.8 Schwarz, 3.14 Weiß, 3.47 Schwarz, 11.25 Schwarz; Aktivität 3.34,
   3.43, 6.31, 11.26 Weiß (Buch gut, App teils), 3.65 Schwarz, 11.25 Weiß, 11.26 Schwarz (Buch
   teils, App gut). Das Buch urteilt hier mit konkreten Drohungen und Plänen, die keine einfache
   Zählregel trifft; die genaue Bewertung bleibt der Engine (AP 11) überlassen.
   **Pipeline:** Bilanzen gehören jetzt zur Abbildung, deren Unterschrift mit dem Zug aus dem
   Titel beginnt (`pipeline/lesen/bilanzen.py`, Test in `test_inhalte.py`). Dadurch hängt die
   Stafford-Bilanz („nach 6. Le2!“) an Abb. 3.65 statt 3.66; erst damit stimmen Material und Zeit.
   Beim Datenlauf sind die Prüfhilfen `docs/freigabe/` mit dem aktuellen Buchstand neu geschrieben
   worden (weniger Befunde als vorher; die Buchquellen hatten sich seit dem letzten Lauf geändert).
   **Entscheidung (wichtig): Regeln für Königssicherheit und Aktivität.** Pflichtenheft 6.6 legt
   beide fest; an den Buchbilanzen gemessen treffen sie aber deutlich seltener:
   - Königssicherheit nach 6.6 („gut: Königsprüfung bestanden und keine offene Linie mit
     Schwerfigur; teils: eine Bedingung verletzt oder Rochade im nächsten Zug möglich“): 22 von 36.
     Hauptgründe: Das Buch nennt einen König ohne gegnerische Dame auch in der Mitte sicher
     (3.24, 3.77), und die künstliche Rochade (3.53, König g2) besteht die Königsprüfung nicht.
   - Aktivität nach 6.6 (Durchschnitt sicherer Felder, jede W7-Figur eine Stufe tiefer): mit den
     besten Schwellen höchstens 10 von 36, weil unentwickelte Figuren in der Eröffnung fast immer
     höchstens zwei sichere Felder haben; ohne den W7-Abzug 26 von 36.
     Die App benutzt deshalb die oben beschriebenen, am Buch geeichten Regeln (32 und 29 von 36) und
     nennt sie unter „So prüft die App“. Vorschlag: Pflichtenheft 6.6 auf diese Regeln ändern.
     Alternative: 6.6 wörtlich umsetzen (schwächere Übereinstimmung) oder beide Faktoren in AP 11
     aus der Engine ableiten. Grundsatz für alle Werkzeuge: Die Regel aus 6.6 gilt, wenn sie das
     Kalibrierziel aus Konzept 13 (90 Prozent) erreicht; sonst gilt die geeichte Regel als
     Vorschlag, bis du entscheidest.
6. **k1-angriffsregel – fertig (Version 0.2.11).** `schach/angriffssektor.ts`,
   `analyse/k1-angriffsregel.ts`: goldene Angriffsregel für beide Seiten. Sektor: Linien des
   Flügels mit dem gegnerischen König (Pflichtenheft 6.6), in dessen Brett-Hälfte. Angreifer:
   eigene Figuren außer König und Bauer, die ein Sektorfeld angreifen; Langschrittfiguren auch
   durch eine eigene Figur (kein Bauer) hindurch, die wegziehen kann. Verteidiger: gegnerische
   Figuren außer König und Bauer, die im Sektor stehen. Absolut gefesselte Figuren beider Seiten
   und überlastete Verteidiger (W4) zählen nicht und werden genannt. Urteil: Übermacht (mindestens
   drei Angreifer und mehr als Verteidiger), Gleichstand oder zu wenig. Gold Angreifer, Rot
   Verteidiger, Grau die Grenze des Sektors. Tests: Abb. 1.36 (zu wenig), 1.37 (Sf3, Ld3 und Dd1
   gegen Tf8: Übermacht), 1.12 (Se4 gefesselt).
   **Befunde und Entscheidungen:**
   - Abweichung von Pflichtenheft 6.6: Dort zählen Angreifer, die ein Sektorfeld „angreifen oder
     mit einem Zug angreifen können“, und Verteidiger, die ein Sektorfeld „decken“. Wörtlich
     umgesetzt hätte Weiß in Abb. 1.36 schon vier Angreifer (Le2–d3, Dd1–b1 …) gegen fünf
     Verteidiger, und 1.36 und 1.37 bekämen dasselbe Urteil. Das Buch zählt in beiden Abbildungen
     präzise; die App folgt deshalb dem Buch (Pflichtenheft 6.6: „Wo das Buch präzise ist, gilt
     das Buch“). Bitte 6.6 entsprechend anpassen oder anders entscheiden.
   - Abb. 1.36: Das Buch zählt nur den Springer f3; die App zählt auch den Läufer e2, der durch
     den Springer nach h5 blickt (dieselbe Geometrie wie die Dame in 1.37). Das Urteil „zu wenig“
     stimmt; die Zahl weicht ab. Zur Kenntnis.
   - Abb. 1.12: Das Buch nennt den Springer e4 als gefesselten Verteidiger; in der App erscheint er
     beim schwarzen Angriff („Se4 zählt nicht: gefesselt“), weil er auf e4 nicht im Sektor um den
     schwarzen König steht.
7. **k2-eroeffnung – fertig (Version 0.2.12).** `schach/eroeffnungsindex.ts` (Index aller
   Stellungen aus den Zugfolgen von Kapitel 2 und 3, 673 Stellungen in 24 Eröffnungen; Schlüssel
   Figurenstellung, Zugrecht, Rochaderechte, damit auch nach Zugumstellung), `analyse/k2-eroeffnung.ts`,
   `ui/komponenten/useEroeffnungsindex.ts` (lädt Kapitel 2 und 3 ab Kapitel 2). Ergebnis: Name,
   Hauptvariante oder Abzweigung, Zugfolge im Buch, Steckbrief (Kapitel 2) und ein Knopf zur
   ersten Abbildung des Abschnitts (neues Feld `sprung` im Befund, in der Karte als Verweis).
   Gehört eine Stellung zu mehreren Eröffnungen, heißt es „noch offen“ mit allen Namen; Kapitel 2
   geht dabei vor den Gambits aus Kapitel 3 (Stafford ist eine Abzweigung der Russischen
   Verteidigung). Namen in Kapitel 3 aus dem Beispieltitel, bei „Weitere Varianten“ aus dem
   Abschnitt. Erkannt: 211 Abbildungen aus Kapitel 2 und 3, noch offen 17 (gemeinsame Stämme),
   keine Buchstellung 8 (Übungen, Zugumstellungs-Beispiele). Index in 54 ms gebaut.
   Offen (Vorschlag): Eine eigene Steckbrief-Ansicht im Buchbereich (heute zeigt nur das Werkzeug
   die Steckbriefe; der Sprung führt zur ersten Abbildung des Abschnitts).
8. **k1-todsuenden – fertig (Version 0.2.13).** `schach/todsuenden.ts`,
   `analyse/k1-todsuenden.ts`. Die Zugleiste liefert die Zugfolge bis zur gezeigten Stellung
   (`useNachspielen.verlauf`, neues Eingabefeld `verlauf`). Geprüft wird je Seite nur in der
   Eröffnungsphase (Pflichtenheft 6.6: bis die drei Ziele erfüllt sind). **Regeln der App** (das
   Buch nennt die vier Sünden ohne Zählregel):
   - verfrühte Dame: Damenzug vom Startfeld ohne Schlag, mindestens zwei Leichtfiguren zu Hause;
   - Materialgier: Schlag, nach dem die Seite im Material vorn liegt, König unrochiert, mindestens
     zwei Leichtfiguren zu Hause;
   - Passivität: a- oder h-Bauernzug ohne Schlag, der danach keine Figur angreift, solange noch
     mindestens drei Leichtfiguren zu Hause stehen;
   - König in der Mitte: nach dem zehnten Zug nicht rochiert.
     Züge aus den Eröffnungen der Kapitel 2 und 3 ohne Fragezeichen sind nie eine Sünde (der
     Eröffnungsindex merkt sich jetzt jeden Buchzug mit Zeichen). Tests: Abb. 1.8 (3... Df6), 1.13
     (2. Dh5), 1.12 (König e8 nach zehn Zügen), Spanische Hauptvariante 2.11 ohne Sünde, 4. Sxe5?
     im Blackburne-Shilling-Gambit, 2... h6. Über alle Abbildungen der Kapitel 1 bis 3: 10-mal
     verfrühte Dame, 7-mal Materialgier, 20-mal König in der Mitte, 1-mal Passivität (4. h4 in
     der Caro-Kann-Übung).
     **Bitte prüfen:** die vier Regeln oben (vor allem „zwei Leichtfiguren zu Hause“ und „zehn
     Züge“). Ohne die Ausnahme für Buchzüge meldete die App in den Eröffnungen aus Kapitel 2 über
     hundert Sünden (etwa 3... cxd4 in der Sizilianischen oder Damentausch in der Berliner
     Verteidigung).
9. **k4-falle und F2 mit Engine – fertig (Version 0.2.14).** Pipeline: Fallenchecks aus
   Kapitel 4 als App-Daten (`pipeline/lesen/fallenchecks.py`, Schema
   `bilanz.schema.json#/$defs/fallencheck`, `kapitel.fallenchecks`; 14 Fallenchecks, jeder mit
   Stopp-Moment). App: `analyse/k4-falle.ts` (Angebot: der geplante Schlag, sonst der größte
   Gewinn nach W5; dazu der Fallencheck des Buches an der Abbildung des Stopp-Moments, Art V),
   `engine/fallenurteil.ts` (Schlag mindestens eine Bauerneinheit schlechter als der beste andere
   Zug: Falle), `engine/fallenpruefung.ts` (MultiPV 4, sonst zweite Rechnung nach dem Schlag),
   `ui/komponenten/FalleKarte.tsx` (Urteil, Werte, Folge; Pfeile rot Fehlzug, gold Rettung) und
   `useFalle.ts`. F2 der Prüffragen: `ui/komponenten/AntwortenKarte.tsx` zeigt die zwei
   stärksten Antworten auf den geplanten Zug, je vier Halbzüge.
   Tests mit echtem Stockfish: die nächsten Buchzüge an den Stopp-Momenten 4.11 (Lxf3), 4.21
   (axb4), 4.24 (Sxe4) und 4.38 (fxe5) sind Fallen, eine ungedeckte Dame ist ein Geschenk.
   Oberflächentest: 4.21 „Falle: Nach axb4 folgt Matt. Besser ist Sxe5.“ und F2 mit Sd3#.
   Hinweis: Die Rettung der Engine kann vom Buch abweichen (4.21: Engine Sxe5, Buch 8. e3); beides
   steht in der Karte.

**AP 8 ist damit vollständig** (neun Werkzeuge, Version 0.2.14). Offene Entscheidungen des
Autors aus AP 8, gesammelt:

- Königssicherheit und Aktivität der Faktorenbilanz: Pflichtenheft 6.6 ändern oder wörtlich
  umsetzen (Punkt 5).
- Angriffssektor: Lesart des Buches statt 6.6 (Punkt 6).
- Regeln der Todsünden bestätigen (Punkt 8).
- Kalibrierung der Fesselungen in F3 und der Aufbau-Antworten (Punkt 3).
- Befunde im Buchtext: 2.71 und 2.128 (Zentrum), 4.29 (W4), 4.21 (W2 e-Linie), 4.45 (Fesselung
  Lb2–g7–Th8), 4.13 (W5 scheinbar).
- Gestufte Hinweise (Punkt 1): Vorschlag AP 13.

### AP 9 Werkzeuge Kapitel 5 bis 7 mit Kalibrierung – fertig, Abnahme offen (Zweig `ap9-werkzeuge`, Fable)

Reihenfolge laut Autor (14.10.2026): k5-vorher, k5-felder, k5-bauern, k5-richtung, k5-figuren;
k6-lap, k6-wo, k6-planbilanz, k6-gegner (Engine); k7-warnsignale (W1 bis W7), k7-erzwingend,
k7-motiv, k7-ruhe (Engine). Je Werkzeug eine Datei `analyse/kN-name.ts`, Eintrag in
`register.ts`, Texte in `i18n/de.json`, Referenztests mit Buchabbildungen, Kalibrierung an den
Bilanzen des Buches als Test. Abweichungen vom Buch nie still korrigieren, sondern hier als Befund.

1. **Pipeline: Skelett- und Planbilanzen – fertig.** `pipeline/lesen/bilanzen.py` liest neben
   Ziel- und Faktorenbilanzen jetzt `skelettbilanz` (mit `skelettfolgerung` als Urteil) und
   `planbilanz` (mit `planplan`), Schema `bilanz.schema.json` (Art `skelett`, `plan`). Die
   Abbildung kommt aus dem Titel (`\abb{…}`). Daten: 10 Skelettbilanzen (5.14, 5.17, 5.22, 5.26,
   5.32, 5.43, 5.44, 11.43, 11.57, 11.70), 2 Planbilanzen (6.20, 11.34). Tests in
   `pipeline/tests/test_inhalte.py` und `app/src/daten/buchdaten.test.ts`.
2. **k5-vorher, k5-felder, k5-bauern, k5-richtung, k5-figuren – fertig (Version 0.2.15).**
   Neue Bausteine in `schach/`: `bauernzug.ts` (was ein Bauernzug vorn gewinnt, hinten aufgibt,
   die vier Gründe), `skelettfelder.ts` (Löcher mit „nutzbar“, sichere Felder, Springerfelder,
   Königsflügel), `skelettrichtung.ts` (Kettenrichtung, Raum, Mehrheit und Minderheit je Flügel,
   Hebel in ein oder zwei Zügen, Spannung), `skelettfiguren.ts` (Stellungstyp, guter und
   schlechter Läufer, Zielfelder, schwache Bauern mit Art); `analyse/skelett.ts` bündelt sie über
   das Profil. `bauernprofil.ts`: `fluegelbauern` (verkeilte Zentrumsbauern und Freibauern zählen
   bei der Mehrheit nicht mit, Abb. 11.43 und 11.57), `vonHinten` (Reihenfolge wie im Buch:
   „c7 und c6“). `bauernschwaechen.ts`: hängende Bauern nur abseits des Rands und beide gezogen.
   - **k5-vorher** („Vorher“): prüft den geplanten Buchzug, wenn er ein Bauernzug ist, sonst den
     letzten Zug der Zugleiste. Gold die neu gedeckten Felder, rot die Felder, die der Bauer nie
     wieder deckt (wie Abb. 5.2), dazu neue Löcher; die vier Gründe (Felder, Bauernschwäche,
     Richtung, Figur) mit Fazit „erfüllt 2 von 4 Gründen“. Reproduziert: Grundstellung e4 wie
     Abb. 5.1 und 5.2 (d5, f5 gold; d3, f3 rot; öffnet Läufer f1 und Dame d1), Abb. 5.3 (3... c5
     Hebel gegen d4), 5.4 (4. c3 beseitigt die Basis d4 ohne Stütze), 5.13 (h3 Luftloch).
   - **k5-felder** („Felder“): eigene Löcher (rot, nur nutzbare), sichere Felder und
     Springerfelder (gold), Königsflügel (Haken, Löcher, Luftloch, Grundreihe), Löcher des
     Gegners. Reproduziert: Abb. 5.6 (h6 Loch, f6 nicht), 5.8 (d5 Vorposten für Sc3), 5.12 und
     5.13 (Grundreihe ohne und mit Luftloch), 5.32 (Springerfeld e5 bis ...f6), 11.34 (Haken g6).
   - **k5-bauern** („Bauern“): jeder schwache Bauer mit Art und Kürzel am Brett (D, R, I, H, B,
     U; eigene rot, gegnerische gold als Ziele wie bei den Warnsignalen), Bauerninseln,
     Freibauern, offene und halboffene Linien grau. Reproduziert: Abb. 5.15
     (Doppelbauern c7, c6), 5.17 (Isolani d4, 3 Inseln), 5.22 (hängende c5, d5; a7), 5.26 (Basis
     d4 ohne Stütze, Kürzel B), 5.34 (c6 rückständig, a7 isoliert).
   - **k5-richtung** („Richtung“): Ketten mit Basis, Stütze und Richtung (grau Basis → Spitze),
     Raum, Mehrheit und Minderheit je Flügel mit Kandidat, Zentrumsbauern, Hebel (gold; in zwei
     Zügen „b2–…–b5“; eigene Figur im Weg wie Sf6 in Abb. 6.20), Spannung, rot die gegnerische
     Basis ohne Stütze. Reproduziert: Abb. 5.24, 5.26, 5.28, 5.30, 5.32, 6.20.
   - **k5-figuren** („Figuren“): Stellungstyp (offen, geschlossen, beweglich, halboffen,
     gemischt), je Läufer gut/schlecht/neutral nach festgelegten eigenen Bauern auf seiner
     Feldfarbe, „passiv“ hinter der eigenen Kette, Zielfelder für Springer und Türme, Tauschfrage
     (wer die Schwäche hat, behält Figuren; wer mehr Raum hat, tauscht nicht). Reproduziert:
     Abb. 5.35 bis 5.38 (die vier Typen), 5.43, 5.24, 5.26, 5.8, 6.3.
   - **Kalibrierung** (`k5-kalibrierung.test.ts`): alle zehn Skelettbilanzen, jede Zeile und
     Seite mit den Feldern und Zahlen des Buches; 39 von 40 Zellen bestehen, eine Zelle (11.57
     Figuren, Aktivität) ist Sache von k6-lap. Oberflächentests: Bauern 5.17, Vorher 5.3,
     Richtung 5.32. Nachtests N44 bis N48.
     **Befunde (Buch) und Entscheidungen (an den Autor gemeldet):**
   - Abb. 5.43 (London): „Ein dauerhaftes Loch gibt es auf keiner Seite.“ Nach der Definition des
     Buches sind d3 (Weiß) und d6 (Schwarz) Löcher (kein c- oder e-Bauer kann sie mehr decken);
     die App zeigt sie nicht, weil keine gegnerische Figur sie erreicht und hält („nutzbar“).
     Vorschlag: Buchtext „kein nutzbares Loch“, oder so lassen.
   - Abb. 11.43: „Mehrheit am Damenflügel (a2 und b2 gegen a6)“ zählt den Isolani d5 nicht zum
     Damenflügel. Regel der App: Zentrumsbauern (d, e) zählen bei Mehrheiten nicht mit, wenn sie
     verkeilt sind oder Freibauern (11.57: „Mehrheit im Zentrum“ ist eine eigene Zeile). Passt zu
     allen zehn Bilanzen; bitte bestätigen.
   - Abb. 5.12 ist bereits das Matt (Weiß im Schach); der Test zum Luftloch h3 nutzt die
     Stellung vor dem Turmzug. Kein Fehler im Buch, nur ein Hinweis.
   - Stellungstyp „offen“ weicht von Pflichtenheft 6.6 ab („kein Bauer mehr auf der d- und
     e-Linie“): Das Buch nennt Abb. 6.3 und 11.43 (je ein Isolani) und 5.17 offen. Regel der App:
     offen, wenn auf keiner Zentrumslinie Bauern beider Seiten stehen. Alle Beispiele 5.35 bis
     5.38, 6.3, 11.43, 11.70 stimmen. Entscheidung: 6.6 entsprechend ändern.
   - Pflichtenheft 6.3 zu „Vorher“ sagt „Felder dahinter, die kein Bauer mehr kontrollieren
     kann“; das Buch (Abb. 5.2) markiert rot die Felder, die _dieser_ Bauer nie wieder deckt
     (d3, f3, obwohl c2 und g2 sie decken könnten). Die App folgt dem Buch und nennt neue Löcher
     als zweite Zeile. Entscheidung: 6.3 entsprechend präzisieren.
   - Präzisierungen der App ohne Buchstelle (bitte prüfen): Löcher gelten als nutzbar, wenn ein
     gegnerischer Bauer sie stützt oder eine gegnerische Figur sie mit einem Zug erreicht und
     keine eigene Figur sie angreift (sonst meldete 11.70 „Loch a6“ wegen Da6??); Königsflügel
     (Haken, Luftloch) erst nach der Rochade; Luftloch nur für den rochierten König; hängende
     Bauern nicht am Rand (a2–b2) und erst gezogen; Hebel auch in zwei Zügen, eigene Figuren im
     Weg zählen als „erst Platz machen“; hat ein Bauer mehrere Schwächen, zählt die genauere
     (Doppelbauer, Isolani, Kettenbasis, rückständig, hängend; 5.26: d4 ist Basis, obwohl auch
     rückständig); Tauschfrage nach Schwäche und Raum (Kapitel 5, Leitfrage 4).
3. **k6-wo, k6-gegner, k6-lap, k6-planbilanz – fertig (Version 0.2.16).** Neue Bausteine:
   `schach/aktivitaet.ts` (freie Zielfelder je Figur, LAP-Reihenfolge, aktivste Figur),
   `schach/figurenziel.ts` (Zielfeld und Weg: Springer auf Löcher, Springerfelder, sonst Wirkung;
   Türme auf Linien und die 7. Reihe; Läufer; eigene Figuren im Weg machen Platz),
   `schach/sturm.ts` (Bauernzüge bis zum ersten Hebel gegen den Schild, Ziele im Schild, die nur
   der König deckt), `analyse/planlage.ts` (die fünf Lagen der Tabelle in Kapitel 6 mit Antwort),
   `analyse/planfragen.ts` (gemeinsame Texte, Plan in einem Satz), `engine/gegnerplan.ts`
   (Nullzug und Bewertung), `ui/komponenten/GegnerKarte.tsx` mit `useEngineMarkierungen.ts`.
   Werkzeugeingabe um `bilanz` (Planbilanz des Buches zur Abbildung) erweitert.
   - **k6-wo** („Wo?“): Lage (Stellungstyp, verkeilte Paare, Könige), je zutreffender Lage ein
     Befund: Kette und Hebel gegen die Basis (geschlossen); Figurenspiel in der Mitte mit der
     Zählung auf dem Zielfeld des eigenen Hebels, als stünde der Bauer schon dort (offen);
     Bauernzüge bis zum ersten Hebel für beide Seiten und eigene Linien zum König (verschiedene
     Flügel); die drei Bedingungen als Checkliste (gleicher Flügel); fixierte Schwächen oder
     Minderheitsangriff. Gold eigener Sturm und Hebel, rot gegnerischer Sturm, grau Ziel im
     Schild, gold fixierte Schwäche. Reproduziert: Abb. 6.2 (Damen-/Königsflügel), 6.3 („drei
     gegen drei“ auf d5), 6.5 (zwei gegen zwei), 6.6 (Weiß 2 Züge, Schwarz 3, c-Linie), 6.7
     (alle drei Bedingungen, h7 deckt nur der König, Ld3 greift an), 6.8 (Minderheitsangriff),
     6.10 (c6 fixiert durch d4), 11.34 (h4–h5 in einem Zug gegen den Haken g6).
   - **k6-gegner** („Gegner?“): sein Plan (Hebel gegen die eigene Basis, Sturm, Gegenschlag),
     was er jetzt droht, was du sichern musst (Basis unter seinem Hebel, Schildbauer unter seinem
     Sturm, Felder, die nur der König deckt), Prophylaxe-Hinweis, die fünf Verteidigungsmittel
     mit Anhaltspunkten aus der Stellung („Der Angriff läuft“ ab drei Angreifern im Sektor).
     Rot sein Plan als Pfeil. Darunter die Engine-Karte „Wäre Schwarz am Zug“: Nullzug, drei
     beste Züge mit Wert und Folge, roter Pfeil; im Schach kein Nullzug. Reproduziert: 6.20
     (…f5 gegen e4, Weiß muss e4 sichern), 6.13 (Sichern e6 und h7; Dame d1 tauschen; Engine:
     Lxh7+), 6.12 (Gegenschlag d4–d5 drei gegen drei).
   - **k6-lap** („LAP“): Zählung je Figur, die am wenigsten aktive Figur (rot), Vorschlag mit Weg
     (gold) und Platzmachern (grau), Tauschfrage. Reproduziert: Abb. 6.16 (Springer d2 mit b1 und
     b3; Ziel g3 über f1, der Turm f1 macht Platz, wie im Buch), 6.20 (Läufer c1 zu Hause, nach
     e3 wie 13. Le3), 6.17 (Turm e8 auf die d-Linie).
   - **k6-planbilanz** („Planbilanz“): die drei Planfragen je Seite nebeneinander, der Plan in
     einem Satz, die Planbilanz des Buches (V) an Abb. 6.20 und 11.34. Kalibrierung
     (`k6-planbilanz.test.ts`): je Zeile und Seite; 6.20 vollständig, 11.34 in der Zeile „Wo“.
   - Oberflächentests: Wo? 6.6, LAP 6.20, Planbilanz 6.20, Gegner? 6.13 mit Engine. Nachtests
     N49 bis N52.
     **Befunde (Buch) und Entscheidungen (an den Autor gemeldet):**
   - Abb. 6.16: Nach der reinen Zählung hätte der Turm f1 (nur e1) weniger Felder als der
     Springer d2 (b1, b3). Das Buch nennt den Springer. Regel der App: Leichtfiguren zuerst, dann
     Türme, dann die Dame (Türme gehören auf Linien, nicht ins Gedränge). Bitte bestätigen oder
     im Buch „unter den Leichtfiguren“ ergänzen.
   - Abb. 11.34, Planbilanz: „Springer d4 … auf e2 deckt er c3“, „Läufer e3 nach h6“, „Dame d8
     nach a5, Turm f8 auf die c-Linie“ und „Schwarz will ...Txc3 opfern“ sind Planwissen, das die
     Zählung nicht liefert (die App nennt Sc3 nach d5 und den Läufer g7). Die Engine-Karte zeigt
     den Plan des Gegners. Kein Fehler im Buch; Grenze des Werkzeugs (Art N).
   - Abb. 6.20, Zeile „Welche Figur?“: „Der Springer f6 muss dem f-Bauern Platz machen“ steht in
     k5-richtung („erst Platz machen: Springer f6“), nicht in k6-lap (dort Läufer c8). Vorschlag:
     so lassen.
   - Abb. 6.6, Tauschfrage: Das Buch nennt den Läufer g7 als aktivste schwarze Figur; nach der
     Zählung ist es der Springer c6 (der Fianchetto-Läufer hat nur zwei Felder, seine Diagonale
     ist verstellt). Vorschlag: Tauschfrage bleibt Näherung (N).
   - Präzisierung der App: Hängende Bauern stehen nebeneinander auf derselben Reihe (sonst
     meldete Abb. 6.10 d5 als hängend statt c6 als rückständig). Fehler behoben: Das Feld vor
     einem Bauern (`feldVor`) rechnete falsch; betroffen war nur AP 9.
   - Lage „offen“ heißt in der App „keine verkeilten Bauern“ (Tabelle Kapitel 6), auch wenn der
     Stellungstyp aus Kapitel 5 „halboffen“ sagt (Abb. 6.6). Lage 5 (Schwäche) steht immer in der
     Karte, als Rückfall.
4. **k7-warnsignale, k7-erzwingend, k7-motiv, k7-ruhe – fertig (Version 0.2.17).** Neue
   Bausteine: `schach/gabeln.ts` (W6 Gabelfelder), `schach/taktikmotive.ts` (die zwölf
   Grundmotive an einer Lösungszugfolge), `schach/mattbilder.ts` (zehn Mattbilder),
   `engine/ruhe.ts` (Hauptvariante bis zur Ruhe, Bilanz), `ui/komponenten/RuheKarte.tsx`,
   `variantenbaum.hauptlinie` und die Eingaben `fortsetzung` und `uebung` für die Werkzeuge.
   - **k7-warnsignale** („W1–W7“): baut auf k4-warnsignale auf und ergänzt W6 Gabelgeometrie
     (Felder, von denen ein Springer oder Bauer nach einem Zug zwei Ziele trifft: König,
     wertvollere oder ungedeckte Figur, keine Bauern; gegen dich rot, für dich grau) und W7 Figur
     am Rand (höchstens zwei sichere Felder, Art N), dazu je Signal die Motive der Buchtabelle,
     „Freibauer auf der vorletzten Reihe“ (11) und „Du stehst auf Verlust“ (12). Kennungen am
     Brett verbinden sich („W1·W2“). Reproduziert: Abb. 7.11 (W6 Sf6 gegen h5 und e8), 7.18
     (W6 Se7), 7.20 (W4 Td8), 7.24 (W7 La2), 7.25 (W7 Lb3), 7.26 (Freibauer e7, Verlust).
   - **k7-erzwingend** („Kandidaten“): Schachs, Schläge (mit Bilanz), Drohungen der eigenen Seite,
     nummeriert in Rechenreihenfolge, Nummern und Pfeile gold am Brett (höchstens zwölf); im
     Schach die Abwehrfragen. Reproduziert: 7.11 (Sd6+, Sf6+ unter den Schachs), 7.14 (Te8+,
     Th8+, dann Sxf7 (−2)), 7.44 (Tg1+, Te7+).
   - **k7-motiv** („Motiv“): spielt die Lösung nach (nächster Buchzug mit Fortsetzung, sonst
     der letzte Zug) und benennt Motive und Mattbild; bei Übungen des Buches das Motiv laut Buch
     (V) daneben. Reproduziert an den Abbildungen der Motive: 7.6 Spieß, 7.8 Batterie, 7.9
     Abzug, 7.11 Doppelschach, 7.14 und 7.16 Hinlenkung mit Gabel, 7.17 Räumung, 7.18
     Beseitigung, 7.20 Überlastung, 7.21 Zwischenzug, 7.23 Desperado, 7.25 gefangene Figur,
     7.26 Umwandlung, 7.27 Dauerschach, 7.29 Patt, 7.37 Anastasia-Matt. Kalibrierung an den 18
     Übungen (`k7-motiv.test.ts`): 16 stimmen mit dem Motiv laut Buch überein (Mattbilder
     Grundreihe, Arabisch, Erstickung, Anastasia, Boden, Damiano, Lolli als Drohung).
   - **k7-ruhe** („Ruhe“): die vier Prüfpunkte mit Anhaltspunkten (Zwischenschachs des Gegners,
     seine Mattdrohungen, Bilanz) und zur stärksten gegnerischen Drohung die fünf Abwehrfragen
     (Schlagen, Wegziehen, Decken, Dazwischenstellen, Gegendrohung; eigene Schachs als Rettung).
     Engine-Karte: Hauptvariante bis zur Ruhe (nach dem letzten Schach oder Schlag) in Schritten
     zu vier Halbzügen, Ende (Matt, Ruhe, offen), Bilanz vorher und nachher, Wert der Engine;
     goldene Pfeile für den ersten Schritt. Test mit Stockfish an 7.14 (Th8+, Bilanz 0 → +4).
   - Oberflächentests: W1–W7 7.18, Kandidaten 7.14, Motiv 7.46, Ruhe 7.14 mit Engine. Nachtests
     N53 bis N56.
     **Befunde und Entscheidungen (an den Autor gemeldet):**
   - Übung an Abb. 7.53 („Überlastung“, 1. Dxc7!): W4 findet die zwei Aufgaben der Dame d8 (c7
     und e8) nicht, deshalb meldet k7-motiv dort kein Motiv. Grund: Die Aufgabenprüfung
     (`schach/aufgaben.ts`, AP 8) zählt nur Gewinne, die ohne die Figur _neu_ entstehen; Dxc7 ist
     schon jetzt ein Schlag. Vorschlag: in AP 8-Nacharbeit prüfen (Teilschritt des Autors).
   - Übung an Abb. 7.44 („Rasender Turm und Patt“): Die App nennt das Dauerschach; das Patt nach
     Txe7 erkennt sie nur, wenn der Köder sofort geschlagen wird (Te7+ Kxe7). Grenze (N).
   - Übung an Abb. 7.56 („Damenopfer und Doppelschach“): erstes Motiv Hinlenkung, Doppelschach
     als zweites (es fällt im zweiten Zug). So gelassen.
   - Präzisierungen der App ohne Buchstelle: W7 nur für angegriffene Figuren, Figuren auf der
     a- oder h-Linie oder in der gegnerischen Hälfte, nicht unangegriffen auf der Grundreihe
     (sonst meldete jede Eröffnung die Türme); W6 ohne Bauern als Ziel; „Lage offen“ vgl. AP 9,
     Punkt 3; Spieß nur, wenn die hintere Figur ungedeckt ist; Dauerschach nur ohne Schläge;
     Desperado nur für eine ohnehin verlorene Figur; Arabisches Matt nur in der Ecke, sonst
     Grundreihenmatt; „Dame neben dem König, gedeckt vom Springer“ auch seitlich (Abb. 7.17).

**AP 9 ist damit vollständig** (dreizehn Werkzeuge, Version 0.2.17). Offene Entscheidungen des
Autors aus AP 9, gesammelt: Stellungstyp „offen“ (6.6) und „Vorher“ (6.3) im Pflichtenheft
anpassen; Befunde 5.43 und 11.43; LAP-Reihenfolge (Abb. 6.16); Planwissen in 11.34 als Grenze;
W4 in Übung 7.53 (AP 8-Nacharbeit); die Präzisierungen der App in den Punkten 2 bis 4.

### AP 10 Werkzeuge Kapitel 8 bis 12 – fertig, Abnahme offen (Zweig `ap10-werkzeuge`, Fable)

Der Autor (14.10.2026, abwesend) hat erlaubt, nach AP 9 selbstständig mit AP 10 weiterzumachen,
obwohl es für Opus vorgesehen war. Reihenfolge nach Konzept 7.3: k8-regeln, k8-opposition,
k8-schluesselfelder, k8-quadrat, k8-elementarmatt; k9-turmbegriffe, k9-erkennungsbilder;
k10-pruefungen; k11-phase; k12-erfassen, k12-kandidaten, k12-sicherheitsblick. Vorgehen wie in
AP 9 (eine Datei je Werkzeug, Referenztests an Buchabbildungen, Kalibrierung an den Übungen).

1. **Kapitel 8 – fertig (Version 0.2.18).** Neue Bausteine in `schach/`: `koenigsweg.ts`
   (Königsabstand nach Abb. 8.37, kürzester sicherer Weg zu Zielfeldern, gerade vor Bogen),
   `opposition.ts` (direkt, fern mit drei oder fünf Feldern, diagonal mit einem oder drei; wer sie
   hat; Züge, die sie nehmen), `schluesselfelder.ts` (Tabelle des Buches, Stand der Könige,
   Sonderfall 6. Reihe), `quadrat.ts` (Zugrecht und Doppelschritt als Startreihe, Vorbehalte des
   Schachtipps), `elementarmatt.ts` (Kasten als Fläche jenseits der Sperrfigur, erreichbare
   Felder, Matt-, Patt-, Sperr-, Abwarte- und Treibezüge). Werkzeuge: **Sechs Regeln** (N, je
   Regel eine Zeile zur Stellung, goldene Pfeile für den Weg des Königs), **Opposition** (E, grau
   die Felder dazwischen, gold die Felder, die sie nehmen), **Schlüsselfelder** (E, gold eigene,
   rot gegnerische, Pfeil zum erreichbaren Feld), **Quadrat** (E, goldener Bauernweg, graue
   Seiten, König gold oder rot; angetippter Freibauer zuerst), **Elementarmatt** (E, grauer
   Kasten, Mattzüge gold, Pattzüge rot, Sperrzüge grau). Abbildungen wie im Buch: 8.19 bis 8.24,
   8.28 (Opposition), 8.21, 8.25 bis 8.31 (Schlüsselfelder), 8.35, 8.36, 8.38, 8.47
   (Quadrat), 8.4 bis 8.17 (Elementarmatt), 8.1, 8.2, 8.19, 8.47, 8.66 (Regeln). Kalibrierung an
   den Übungen 8.55 bis 8.66: 8.55/8.56 Pattfalle, 8.58/8.59 Kf6, 8.60 Kc3 (Weg c3–c4–c5),
   8.61 Kb6 (Weg b6–b7), 8.62 Regel 4, 8.63 a4 (Doppelschritt), 8.64 Bauernrennen, 8.66
   entfernter Freibauer. **Grenzen** (kein Werkzeug des Pflichtenhefts trifft den Lösungszug):
   8.57 (1. Tb6! gibt dem König ein Feld; die App warnt nur vor Kb6?? und Kc7??), 8.65
   (Freibauer bilden), 8.67 (Durchbruch mit Bauernopfer), 8.68 (Reserve-Tempo). Bauernrennen
   (vier Fragen), Triangulation und Reserve-Tempo sind keine Werkzeuge des Pflichtenhefts.
   **Präzisierungen der App:** Beim Turm sperrt die Figur nur dort, wo sie die Könige trennt,
   die Dame auch zur Seite des Königs hin (Abb. 8.4 „6. Reihe und c-Linie“); Abwartezüge halten
   die Figur außer Reichweite des Königs (Buchwort) und lassen die Fläche des Kastens gleich
   (Abb. 8.11: Ta7, Tf7, Tg7, Th7); Sperrzüge der Dame erst, wenn der eigene König höchstens
   zwei Felder entfernt steht (Pattgefahr, Abb. 8.4 gegen 8.5); Treibezüge sind Schachs, nach
   denen jede Königsantwort in einem kleineren Kasten oder näher am Rand steht (Abb. 8.5:
   Dc7+). Fernopposition mit fünf Feldern (Abb. 8.23: auch Kf1) steht nach der mit drei.
   Schlüsselfelder des Gegners in Rot (Pflichtenheft nennt nur Gold). Quadrat: „betreten“ heißt
   im Quadrat oder direkt daneben stehen, wenn der König am Zug ist. **Befund:** keiner; die
   Texte des Kapitels stimmen mit den Diagrammen überein.
2. **Kapitel 9 und 10 – fertig (Version 0.2.19).** Neue Bausteine: `schach/turmendspiel.ts`
   (Angreifer ist die Seite mit dem vordersten Freibauern; Abschneiden auf der Linie zwischen
   König und Bauer oder auf der Reihe zwischen König und Umwandlungsfeld, bei Turm gegen Bauer mit
   dem verteidigenden Turm gegen den König der Bauernseite, Abb. 9.18; Schachdistanz als Linien
   zwischen Turm und Bauer; kurze und lange Seite), `schach/erkennungsbilder.ts` (die elf Zeilen
   der Rückblick-Tabelle als Erkennung von oben nach unten), `schach/studienpruefung.ts`
   (Umwandlungen mit sofortiger Folge, Pattprüfung mit Reserve und Pattzügen, stille Züge mit
   den wenigsten Antworten, Idee des Gegners). Werkzeuge: **Drei Begriffe** (E; grau Sperrlinie
   und Schachdistanz, König und Turm des Verteidigers gold oder rot), **Erkennungsbild** (E bei
   Standardnähe, sonst N; Bild, Erkennungsfrage, Merkmale mit ✓, Plan der Tabelle als V),
   **Vier Prüfungen** (N; Gegner, Umwandlungen E, Patt E, stille Züge). Abbildungen wie im Buch:
   9.1, 9.2, 9.3, 9.5, 9.6, 9.8, 9.18 (Begriffe); 9.3, 9.4, 9.5, 9.6, 9.8, 9.15, 9.16, 9.18,
   9.22, 9.25, 9.28, 9.31, 9.32, 9.34, 9.35, 9.38, 9.41, 9.42, 9.43, 9.44 (Bilder); 10.6,
   10.19 (Prüfungen). Kalibrierung: Übungen 9.45 bis 9.53 treffen alle das Bild des Buches
   (9.45 Philidor noch nicht erreicht → Th6, 9.46 kurze Seite → Kg8, 9.47 Lucena, 9.48 Vancura
   → Ta6, 9.49 und 9.51 Turm gegen Bauern, 9.52 Randbauer, 9.53 falscher Läufer); Übungen
   10.23 (f8=S#), 10.24 (b8=D patt, b8=T), 10.25 (stiller Zug Tc1 mit einer Antwort), 10.28
   (Dxc7 patt, Pattreserve c7) treffen den Lösungszug; 10.19 nennt Sg5 als stillen Zug mit
   einer Antwort. **Grenzen:** 10.26 (Réti-Weg) und 10.27 (Wegversperrung Lb8) findet keine
   Prüfung; die Rechnung bleibt dem Leser, das Werkzeug stellt die Fragen. Übung 9.51 (b6 und
   c5) ist nicht „zwei verbundene Bauern auf der 6. Reihe“, die Tabelle greift erst nach …c4.
   **Präzisierungen der App:** Philidor gilt nur, solange der angreifende König nicht vor dem
   Bauern steht (Übung 9.46 ist dann „kurze Seite“); bei Turm und Bauer gegen Turm zählt das
   Abschneiden nur mit dem Turm des Angreifers; Randbauern haben keine kurze Seite (Hinweis auf
   Vancura); beim Erkennungsbild ist der Angreifer die Seite mit dem vordersten Freibauern, bei
   beiden die Seite am Zug. **Befund:** keiner.
3. **Kapitel 11 und 12 – fertig (Version 0.2.20).** Neuer Baustein `schach/phase.ts`: Endspiel,
   wenn mindestens drei der vier Prüffragen aus Kapitel 8 Ja ergeben (Damen vom Brett; Könige
   ohne Mattdrohung; sicherer Königsweg ins Zentrum; Freibauern, Mehrheiten oder wenig
   Figurenmaterial); Eröffnung, solange Entwicklung oder Königssicherheit der Zielbilanz „nein“
   sind („teils“ gilt als erfüllt: „die meisten Leichtfiguren sind entwickelt“, Abb. 12.1);
   sonst Mittelspiel. Werkzeuge: **Phase** (N; Phase mit Gründen, die Werkzeuge der Merkseite,
   bei den Beispielpartien aus Kapitel 11 die Zeile der Buchtabelle über den Abschnittsanker
   der Abbildung, neu in `Werkzeugeingabe.abschnitt`; gold der Königsweg ins Zentrum im
   Endspiel), **Erfassen** (E; letzter Zug aus dem Verlauf und die Drohungen des Gegners rot,
   Warnsignale W1–W7 beider Seiten mit Markierungen, Phase und Werkzeug für Schritt 2),
   **Denkroutine** (Schritte 2 bis 4; Sammeln E: je zwei Schachs, Schläge ohne Verlust, Züge mit neuer Drohung,
   dazu der Buchzug als ruhiger Kandidat; Antwort N: je Kandidat die stärkste Antwort in der
   Reihenfolge Matt, Schlag mit Gewinn, Schach, Drohung, ein Zug tief; Bewerten N: Material
   danach, bester Kandidat), **Sicherheitsblick** (E; die drei Fragen zum nächsten Buchzug oder
   zum eigenen Zug über Ziehen: Luft und Schachs, Schlag auf die gezogene Figur mit
   Abtauschbilanz, erlaubte Schachs und Matt). Abbildungen wie im Buch: 8.1, 8.2, 8.3, 12.1,
   1.26, 11.2 (Phase); 12.1, 12.2, 4.21 (Erfassen); 12.1, 7.14 (Kandidaten); 12.1 Lxh7+
   („gerade der Plan“), Übung 12.6 Txd5? erlaubt Lh2+, g3 (Sicherheitsblick). Übung 12.5: Der
   Buchzug Dc2 steht als ruhiger Kandidat, auf Lxh7+ nennt die Karte Kxh7. **Grenzen:** Die
   stärkste Antwort wird nur einen Zug tief gesucht (12.1: „Material danach −2“ nach Kxh7; die
   Rechnung bis zur Ruhe übernimmt das Werkzeug Ruhe); ein aus der Rochade gezogener König
   zählt für die Zielbilanz als unsicher, Abb. 12.2 heißt deshalb „Eröffnung“; der ruhige
   Kandidat 1. Tc1 aus Abb. 12.1 kommt nur aus dem Buchtext. **Präzisierungen der App:** Der
   Sicherheitsblick warnt zusätzlich vor einem Zug, der patt setzt (Kapitel 10, Prüfung 3;
   Abb. 8.6 Df7??); „Entwicklung teils“ zählt als erfüllt. **Befund:** keiner.

**AP 10 ist damit vollständig** (zwölf Werkzeuge, Versionen 0.2.18 bis 0.2.20, alle in `main`).
Offene Entscheidungen des Autors aus AP 10: die Präzisierungen in den Punkten 1 bis 3 (Turm
sperrt nur, wo er die Könige trennt; Fernopposition mit fünf Feldern; Schlüsselfelder des
Gegners rot; Philidor nur ohne angreifenden König vor dem Bauern; Pattwarnung im
Sicherheitsblick; „Entwicklung teils“ als erfüllt), die Grenzen der Übungen 8.57, 8.65, 8.67,
8.68, 10.26, 10.27 und die Phase in Abb. 12.2.

### AP 12 Speicher – fertig, Abnahme offen (Zweig `ap12-speicher`, Opus)

Auftrag des Autors (15.10.2026): Speicher auf IndexedDB, Fortschritt je Kapitel mit Anzeige,
Export und Import, Löschen erweitern, Tests; danach AP 14. Fragen sammeln statt nachfragen.

1. **Teil 1 Speicher-Modul – fertig.** `src/speicher/`: `format.ts` (Nutzerdaten Format 1 mit
   `schemaVersion`, Einstellungen, Lernstand, Fortschritt, Datum der letzten Sicherung; leere
   Daten; `wandleUm` für Format 0 = Merker von 0.2.x und Format 1, lehnt neuere Formate ab),
   `datenbank.ts` (IndexedDB „schach-von-grund-auf“, ein Eintrag „aktuell“, Unlesbares wird unter
   „defekt-<Zeitpunkt>“ aufgehoben), `speicher.ts` (`lade`, `speichere`, `aendere`,
   `bitteUmDauerhaftenSpeicher` beim ersten Start, `useSpeicher`). Einstellungen und Lernstand
   lesen und schreiben jetzt über den Speicher; die Merker „einstellungen“ und „lernstand“ werden
   beim ersten Laden übernommen und danach entfernt. Merker bleiben für „zuletzt“ und
   „koordinaten“. Fehler beim Laden oder Speichern zeigt ein Hinweis oben (`Speicherhinweis`).
   „Alle Daten löschen“ schließt vorher die eigene Verbindung, sonst blockierte sie das Löschen.
   Tests: `format.test.ts` (Umwandlung), `speicher.test.ts` (fake-indexeddb).
2. **Teil 2 Fortschritt – fertig (Version 0.2.21).** `speicher/fortschritt.ts` (rein:
   `markiereGesehen`, `notiereUebung`, `notiereDurchgang`, `kapitelfortschritt`). Angesehen zählt
   die geöffnete Abbildung und jede, die beim Nachspielen auf dem Brett steht
   (`ui/komponenten/useGesehen.ts`). **Anzeige (Vorschlag nach den Bildschirmentwürfen;** einen
   Entwurf für „Ich“ gibt es nicht, die Kapitelliste im Entwurf „Buch“ und der goldene Balken der
   Installationsseite sind die Vorlage): Buch – unter jedem Kapitel „x von y Abbildungen
   angesehen“ mit schmalem goldenem Balken, erst nach dem ersten Ansehen; Kapitelübersicht –
   Karte „Dein Fortschritt“ (Abbildungen, Lernziele mit Sprung zur Checkliste, Übungen, Trainer)
   und ein grüner Haken an angesehenen Abbildungen; Ich – Karte „Dein Fortschritt“ mit Summen und
   aufklappbar „Je Kapitel“. Übungen und Trainer zeigen Zahlen, sobald es die Trainer gibt
   (AP 13); bis dahin steht „N Übungen im Kapitel. Lösen in der App folgt mit den Trainern.“
   Playwright: `tests/e2e/speicher.spec.ts`.
3. **Teil 3 Datensicherung – fertig (Version 0.2.22).** `speicher/sicherung.ts`: `exportiere`
   (JSON mit Kennung „schach-von-grund-auf/nutzerdaten“, App-Version, Zeitpunkt, Nutzerdaten;
   merkt das Datum der Sicherung), `pruefeSicherung` (kein JSON, fremd, beschädigt, neuer;
   ältere Formate werden umgewandelt), `importiere`, `sicherungFaellig` (sanfter Hinweis nach
   28 Tagen ohne Sicherung, nur mit eigenen Daten). Oberfläche `ui/komponenten/Datensicherung.tsx`
   in der Karte „Daten auf diesem Gerät“ über „Alle Daten löschen“: Sichern, Einspielen mit
   Rückfrage samt Inhaltsangabe, letzte Sicherung, Zeile „Dauerhafter Speicher“. „Alle Daten
   löschen“ löscht die Datenbank mit (Playwright prüft `indexedDB.databases()`), der Text der
   Rückfrage warnt vor dem Verlust des Fortschritts. Tests: `sicherung.test.ts` (Rundreise auf
   ein zweites Gerät, Ablehnungen, Hinweis), Playwright mit zwei Browserkontexten. Nachtests
   N73 bis N77.

**Offene Fragen zu AP 12 (gesammelt, nicht nachgefragt):**

- Q1. Anzeige des Fortschritts: Ist der Vorschlag (Balken im Buch erst nach dem ersten Ansehen,
  Karte in der Kapitelübersicht, Haken an Kacheln, Summen in Ich) so recht? Sollen auch die
  Lernziele in der Buchliste erscheinen?
- Q2. Zählt eine Abbildung schon als angesehen, wenn sie beim Nachspielen nur auf dem Brett
  stand (so umgesetzt), oder nur beim Öffnen?
- Q3. iPhone: Klappt das Herunterladen der Sicherung in der installierten App (N73)? Falls
  nicht, wäre „Teilen“ (`navigator.share` mit Datei) der Ausweg.
- Q4. Soll der Hinweis „Zeit für eine Datensicherung“ zusätzlich oben in der App erscheinen
  (bisher nur im Bereich Ich, damit er sanft bleibt)?
- Q5. Eigene Züge beim Weiterspielen werden weiterhin nicht gespeichert. Gewünscht (dann als
  Teil der Lernsammlung oder der Partien, Format 2)?
- Q6. Übungen und Trainer: Die Zählung steht, gefüllt wird sie mit AP 13. Soll eine Übung als
  „gelöst“ gelten, wenn der Leser die Lösung selbst gefunden hat, oder auch nach „Lösung zeigen“?

**Test `stellungsprofil.test.ts` (erledigt):** Die Zeitgrenze von 50 ms je Abbildung riss
einmal lokal knapp (50,9 ms bei voller Last). Der Test misst jetzt jede Abbildung dreimal und
wertet die schnellste Messung; die Grenze selbst bleibt bei 50 ms.

### AP 14 Vorbereitete Texte – fertig, alle 253 Texte freigegeben (E1, 16.10.2026; Zweig `ap14-texte`, Opus)

Grundlagen: Pflichtenheft 3 („Für jede Buchstellung … Einschätzungen je Werkzeug, gestufte
Hinweise und Warum-Fragen mit Antwortauswahl … mit Claude erstellt, mit der Engine geprüft und vom
Autor freigegeben“), 6.1 (gestufte Hinweise, Art V), Konzept 4.5 und 7.4 (`einschaetzung`).

1. **Teil 1 Format und Pipeline – fertig.** `schemas/vorbereitet.schema.json`, Dateien
   `inhalte/de/texte/vorbereitet-kapNN.json` (Beschreibung in `inhalte/de/README.md`),
   `pipeline/texte/vorbereitet.py`: prüft Abbildung, Werkzeug (Kennungen aus `de.json` der App)
   und Freischaltung, Zug spielbar, richtige Antwort; mit `--zugzeichen` Engine-Prüfung der
   erfragten Züge; übernimmt Freigegebenes als `abbildung.vorbereitet`; Übersicht
   `docs/freigabe/vorbereitet.md`. Neuer Schalter `--text-entwuerfe`: nur die Text-Entwürfe in
   die App (gekennzeichnet), damit der Autor sie dort prüfen kann.
2. **Teil 2 Anzeige – fertig (Version 0.2.23).** `analyse/einschaetzung.ts`,
   `ui/komponenten/VorbereitetKarte.tsx` (Hinweis 1 bis 3, dann Einschätzung; Plakette
   „vorbereitet“ oder „Entwurf“) und `WarumFrage.tsx` (Antwortauswahl, Auswertung mit ✓ und ✗,
   Erklärung). Erscheinen, solange die Stellung der Abbildung auf dem Brett steht.
3. **Teil 3 Entwürfe – alle Kapitel fertig (Version 0.2.25).** Wunsch des Autors (15.10.2026):
   gleich alle Kapitel als Entwurf. 253 Abbildungen in Kapitel 1 bis 12: 18, 35, 30, 23, 20, 16,
   17, 23, 21, 13, 33, 4 (Kapitel 0 hat keine Werkzeuge). Auswahl etwa ein Drittel je Kapitel, die
   lehrreichsten Stellen, keine Übungsstellungen. Die Kapitel 2 bis 12 haben zehn Helfer nach
   einer gemeinsamen Anleitung geschrieben (Materialsammlung je Kapitel mit Unterschrift,
   Buchzügen und Werkzeugausgaben; konkrete Züge mit python-chess, Endspiele mit der
   Endspieldatenbank geprüft); ich habe jede Datei mit der Pipeline und alle erfragten Züge mit
   Stockfish geprüft (15.10.2026). Die richtige Antwort steht nicht mehr immer an erster Stelle
   (auch in Kapitel 1 korrigiert). Fragen nach einem Fehlzug des Buches stehen meist ohne `zug`.
   **Hinweise der Engine (alle gewollt):** 1.12 (11. Sxe4 gewinnt, 11. Sd5 stärker), 1.36
   (Fehlversuch 1. Sg5), 6.13 (1... f5, Engine bevorzugt f6 um 0,5), 10.4 (3. c8=D? ist der
   Fehler), 11.11 (12. Lxh7+, 0,3), 11.26 (17. Sf6+ von Anderssen, die Engine hält das Opfer für
   unkorrekt), 11.35 (16. Sde2, 0,5), 12.3 (3... f5 ist der Fehler).
   **Lesen:** `docs/freigabe/vorbereitet.md`; freigeben in `inhalte/de/texte/vorbereitet-kapNN.json`.

**Hinweise der Helfer zum Buch (bitte prüfen, nichts geändert):**

- 4.5: 7... dxc3 ohne Zugzeichen; die Engine hält 7... Sf6 für etwa 1,0 besser („?!“ oder „?“).
- 4.43/4.44: 7. Le2 läuft sofort ins Matt, 7. De2 hält länger („7. Le2??“).
- 2.128: Die Unterschrift sagt, beide Seiten hätten alle drei Ziele erreicht; die Zielbilanz gibt
  Weiß beim Zentrum nur „teils“ (Figuren kontrollieren nur d4).
- 12.4 trägt den Vermerk „erst nach der Übung ansehen“, ist aber keine Übungsabbildung; der
  Entwurf hat dort einen Text.

**Werkzeugausgaben, die vom Buch abweichen:** Die zwölf Gruppen der Helferliste (Stand 0.2.25)
sind in 0.2.68 geprüft und abgearbeitet; die Tabelle mit dem Stand je Gruppe steht in
`docs/ENTSCHEIDUNGEN.md`, Abschnitt „Werkzeugabweichungen aus der Textarbeit geprüft“. Offen ist
nur der Buchbefund B6 (Zeit-Zählhilfe) in `docs/AUFGABEN_AUTOR.md`.

**Version 0.2.24 (nur Test):** Die GitHub-Prüfung von 0.2.23 auf `main` war rot, weil der
Engine-Test der Fallenprüfung (Abb. 4.24) mit 500 ms Rechenzeit auf einem ausgelasteten Rechner
einmal „Geschenk“ statt „Falle“ ergab; derselbe Stand war auf den Zweigen grün. Der Test rechnet
jetzt 2 s je Rechnung. An der App ändert sich nichts.

**Offene Fragen zu AP 14:**

- T1. Passen Umfang und Ton der Entwürfe (ein bis zwei Sätze, drei Hinweise, drei Antworten)?
- T2. Sollen Text-Entwürfe bis zur Freigabe in den Testversionen sichtbar bleiben (so umgesetzt,
  Plakette „Entwurf“)?
- T3. Abb. 1.36: Das Werkzeug Angriffsregel zählt den Läufer e2 als Angreifer (durch den Springer
  f3 hindurch), das Buch nur den Springer. Die vorbereitete Einschätzung folgt dem Buch; das
  Ergebnis „zu wenig“ stimmt in beiden.
- T4. Für jede Buchstellung (Pflichtenheft) wären es über 750 Einträge; die Entwürfe decken etwa
  ein Drittel ab (253). Reicht das, oder sollen weitere folgen?

### AP 11 Spiel gegen die Engine – Handwerksteil fertig, Stufen und Fehlerprofile für Fable (Zweig `ap11-partie`, Opus)

Grundlagen: Pflichtenheft 5.2 und 5.3, Konzept 8.1 bis 8.3, Bildschirmentwurf „Partie“, Wünsche
des Autors (AP 5, Punkt 7): aus jeder Stellung gegen die Engine zu Ende spielen, ruhige Ansicht
(nur Brett, Zugnavigation, Züge), Züge zurücknehmen, Stufe wählen, Tipps aus der
Engine-Bewertung passend zu den gestuften Hinweisen. Aufteilung (Autor, 15.10.2026): Opus baut den
Handwerksteil; Stufen und Fehlerprofile bekommen eine abgegrenzte Schnittstelle mit einfacher
Übergangslösung, ausdrücklich als Platzhalter markiert; Fable kalibriert sie und prüft den Rest.

1. **Teil 1 Engine-Stärke und Schnittstelle – fertig.** `engine/engineDienst.ts`: Stärke je
   Auftrag (voll, Skill Level, Elo-Begrenzung; danach wieder voll). **Platzhalter:**
   `engine/stufen.ts` (acht Stufen, Startwerte aus Konzept 8.2), `engine/fehlerart.ts` (einfache
   Regeln), `engine/zugwahl.ts` (Buchzug, Fehlerzug, Stärkebegrenzung).
   `schach/eroeffnungsindex.ts`: `buchzuegeAb` für den Eröffnungsmodus.
2. **Teil 2 Partie – fertig.** Neuer Ordner `spiel/`: `partie.ts` (rein: Züge, Rücknahme,
   Aufgabe, Zeit, Spielziel), `ergebnis.ts` (Matt, Patt, 50 Züge, Wiederholung, Material,
   Zeit), `uhr.ts` (Fischer-Uhr ohne eigenen Takt), `ablauf.ts` (Zug mit Uhr, Pause), `pgn.ts`,
   `zuege.ts` (UCI ↔ SAN), `enginezug.ts`, `auswertung.ts`.
3. **Teil 3 Speicher Format 2 – fertig.** `speicher/partien.ts`: laufende Partie, bis zu 50
   beendete Partien mit Wert und bestem Zug je Stellung, Vorlieben (Stufe, Uhr, Rücknahme,
   ruhige Ansicht, Sicherheitsblick). Umwandlung 1 → 2, beschädigte Partien werden gekürzt.
4. **Teil 4 Oberfläche – fertig.** Bereich **Spielen** (statt „folgt“): Startstellung
   (Grundstellung, Abbildung, eigene FEN), Seite, Stufe, Spielziel (an Abbildungen aus Kapitel 8
   und 9 „Gewinnen“), Bedenkzeit (ohne, 30+20, 15+10, 5+3), Rücknahme, Sicherheitsblick; laufende
   Partie fortsetzen; letzte Partien. **Partie**: Uhren über und unter dem Brett, Brett bei
   Schwarz gedreht, Zugliste mit Navigation, Zurücknehmen (auch nach dem Ende), Aufgeben,
   ruhige Ansicht (Auge oben rechts), Hinweis in drei Stufen (Lage und Zugart, Figur, Zug der
   Engine), Sicherheitsblick vor dem Zug („Erlaubst du ein Matt?“ / „Verlierst du die Figur?“).
   An jeder Abbildung: **Gegen die Engine spielen** mit der gezeigten Stellung.
5. **Teil 5 Auswertung – fertig (Gerüst).** Nach dem Ende bewertet die Engine jede Stellung
   (0,5 s je Stellung, mit Fortschritt); Zugzeichen in der Zugliste (?! ab 0,5, ? ab 1,2, ?? ab
   3 Bauern), erste klare Abweichung mit „Zur Stellung“ (gold der bessere, rot der gespielte
   Zug), grobe Patzer (mehr als zwei Bauern), absichtliche Fehler der Engine („Mit 12... Sf6 hat
   die Engine eine Figur hängen lassen (W1). Hast du es gesehen?“), PGN kopieren oder als Datei.

**Kalibrierung und Gegenprüfung (Fable, 16.10.2026, Zweig `ap11-kalibrierung`, Version 0.2.36)**
– erledigt, Entscheidungen und Messergebnis in `docs/ENTSCHEIDUNGEN.md` („AP 11 Kalibrierung“):

- `engine/stufen.ts`: Jede Stufe hat Grundstärke (Skill Level, geräteunabhängig: Stockfish wählt
  den Zug an der Tiefe Level + 1), Fehlerquote und Höchstverlust. Stufe 1 bis 3 Skill 0 mit
  jedem dritten, vierten, achten Zug ein Fehler (Dame, Turm, Leichtfigur), Stufe 4 Skill 3 mit
  jedem sechzehnten Zug, Stufe 5 bis 7 Skill 6, 10, 15, Stufe 8 voll. Die Elo-Begrenzung nutzt
  keine Stufe mehr (sie wäre schwächer als Skill 8 gewesen).
- `engine/fehlerart.ts`: alle sechs Fehlerarten mit den Werkzeugen der Kapitel 1, 4 und 7
  (Abtauschrechnung, Drohungen, Gabelgeometrie W6, gefährliche Linie W2, Motive), geprüft an
  Buchstellungen (Abb. 1.8, 1.13, Zweispringerspiel).
- `engine/fehlersuche.ts` (neu) und `engine/zugwahl.ts`: typische Fehlerzüge aus allen legalen
  Zügen, bis zu sechs davon gezielt von der Engine bewertet (`searchmoves` im Engine-Dienst);
  Mindestverlust 0,5 und Buchtreue 0,85 bleiben; ab Stufe 2 nie ein Damenopfer (Abtauschrechnung,
  unabhängig von der Engine).
- Messung: `npm run messen:stufen` (`skripte/messe-stufen.mjs`, `src/engine/stufen.messung.ts`),
  Partien Stufe gegen Stufe mit der echten Engine; Ergebnisse nur lokal in
  `buch/arbeit/stufenmessung/`. Ergebnis (10 Partien je
  Paarung): Jede Stufe gewinnt die Mehrheit gegen die Stufe darunter (9:1, 9:1, 9:1, 10:0, 7:3,
  8:2, 9:1); gemessene Fehlerquoten Stufe 1 bis 4 etwa 36 %, 29 %, 13 %, 6 %; Höchstverluste
  eingehalten.
- Gegenprüfung: drei Befunde behoben (Uhr nach Engine-Zug im Hintergrund, laufende Uhr nach dem
  Laden, Auswertung nach unterbrochenem Auftrag); Rest geprüft und belassen.
- Nicht gebaut (später): Endspieldatenbank für KPK (Konzept 8.3, „exakte Endspielergebnisse“;
  `schach/kpk.ts` gibt es seit 0.2.33 für die Werkzeuge), Übernahme in die Fehlerdatenbank
  (AP 15), Hinweis mit den Werkzeugen des passenden Kapitels (Pflichtenheft 5.2; jetzt aus der
  Engine nach Wunsch des Autors).
- Rückfragen K1 bis K6 in `docs/AUFGABEN_AUTOR.md`; Nachtests N175 bis N181.

**Offene Fragen zu AP 11:**

- P1. Hinweis: drei Stufen aus der Engine (Lage und Zugart, Figur, Zug). Passt das, oder sollen
  zuerst die Werkzeuge des Kapitels sprechen (Pflichtenheft 5.2)?
- P2. Sicherheitsblick vor dem Zug ist standardmäßig an (abschaltbar im Spielen-Bildschirm). Er
  fragt auch bei gewollten Opfern (Abb. 12.1, 1. Lxh7+: „Verlierst du die Figur?“). So lassen?
- P3. Spielziel an Abbildungen aus Kapitel 8 und 9: voreingestellt „Gewinnen“. Für
  Remisstellungen (etwa Philidor) wäre „Remis halten“ richtig; das weiß die App erst mit
  Daten je Abbildung. Soll ich eine Liste anlegen?
- P4. Die Uhr hält an, wenn die App in den Hintergrund geht. Gewünscht?

### Rückmeldung zu 0.2.26 – Version 0.2.27 (Zweig `rueckmeldung-0.2.27`, Opus)

Grundlage: `docs/archiv/stand-0.2.30/VORSCHLAEGE_0.2.26.md` mit den Entscheidungen des Autors vom 15.10.2026 und
`docs/ENTSCHEIDUNGEN.md` („Rückmeldung zu 0.2.26“, „Startseite des Buches vor der App“). Umgesetzt
in acht Teilschritten (T1 bis T8), jeder mit Tests und eigenem Commit:

1. **T1 Entscheidungen und Testanleitung:** Entscheidungen festgehalten, N21, N31, N45, N55, N56,
   N67 berichtigt.
2. **T2 Regeln:** Ruhe endet nach zwei ruhigen Halbzügen nach dem letzten Schlag oder Schach
   (`engine/ruhe.ts`, Abb. 7.14: +5 nach 5 Halbzügen); Quadrat am Bauern gezeichnet, mit Zugrecht
   das geschrumpfte Quadrat (`schach/quadrat.ts`, 8.35, 8.63); ein Spieß zählt nur, wenn die
   vordere Figur den Angreifer nicht schlagen kann oder er gedeckt ist (7.14); Prüffragen ohne
   Material im Angebot nur der Hinweis, mit Fesselung F3 (4.17, 4.29); F2 „Kachel weiter unten“.
3. **T3 Sicht:** Schalter „Sicht: Weiß/Schwarz“ in der Werkzeugkarte (`useSicht.ts`), fällt nach
   jedem Zug und Abbildungswechsel zurück; Zielbilanz, Faktorenbilanz, Planbilanz mit Weiß zuerst.
4. **T4:** „Vier Prüfungen“ gestrichen (Werkzeug, Texte, neun Einschätzungen); Tipp auf die freie
   Fläche schaltet das Werkzeug ab (`useHintergrundTipp.ts`); Partie: Zugliste oben, Auge am Brett.
5. **T5 Angesehen:** erst nach 30 Sekunden am Stück (`useGesehen.ts`), Kästchen in jeder Kachel
   der Kapitelübersicht, „Alle abhaken“ und „Alle zurücksetzen“.
6. **T6 Buchtexte:** Falle? und Planbilanz verweisen aufs Buch; Eröffnung mit eigener Kurzfassung
   (13 Entwürfe); W1–W7 ohne Motivnummern; Erkennungsbild in eigenen Worten; Phase ohne die
   Lehre. Einschätzungen entfallen (Pipeline übergibt nur Warum-Fragen, Schema `fuerApp`);
   Warum-Fragen erst nach „angesehen“, zugeklappt, unter den Werkzeugkacheln; Hinweis „Die
   Werkzeuge … können sich irren. Maßgeblich ist das Buch.“ Prüfliste der eigenen Texte:
   `docs/freigabe/kurzfassungen.md`.
7. **T8 Startseite:** `/` statische Startseite des Buches (Cover, Beschreibung, Shops,
   Installationsteil), `/installieren/` als QR-Ziel ohne Shops, App unter `/app/`, Impressum und
   Datenschutz als Entwürfe; installierte App springt sofort nach `/app/`.
8. **T7:** Version 0.2.27, Nachtests N96 bis N113 in `docs/TESTANLEITUNG.md`, Wiedereinstieg
   und Aufgaben des Autors (Teile F und G) ergänzt.

Bewusst nicht in 0.2.27 (nach dem Bildschirmentwurf): Ordnung der Werkzeuge nach der Denkroutine
mit „◀ frühere“ und „spätere ▶“, Bündel, Leerfälle, gestufte Karten, Gegner?-Kachel in der Karte.

### Rückmeldung zu 0.2.27 – Version 0.2.28 (Zweig `rueckmeldung-0.2.28`, Opus)

Der Autor hat N96 bis N113 getestet und die Kurzfassungen abgenommen (Teil F stellt er zurück).
Umgesetzt (Einzelheiten in `docs/ENTSCHEIDUNGEN.md`, „Rückmeldung zu 0.2.27“): Link-Knopf in
Safari mittig; Prüffragen-Hinweis nur einmal; Sicht-Schalter oben rechts; zweites Tippen wählt
ab (außer Zählen und Ziehen), Erklärungen in „So prüft die App“ (`SoPrueft.tsx`); Hintergrund-Tipp
überall außer auf Inhalten; Faktorenbilanz und Zielbilanz markieren nur die Seite der Sicht; kein
Schalter bei Vorher und Erkennungsbild (Test `werkzeugergebnis.test.ts`); Rückfrage bei „Alle
abhaken“. Nachtests N114 bis N121.

### Rückmeldung zu 0.2.28 – Version 0.2.29 (Zweig `rueckmeldung-0.2.29`, Opus)

Kein Werkzeug als Ausgangszustand; mehr Markierungen in Zielbilanz und Faktorenbilanz
(`analyse/bilanzmarkierungen.ts`); Tipp auf den Hintergrund zählt überall außer auf
Bedienelementen, Brett, Leisten, Karten und Dialogen. Einzelheiten in `docs/ENTSCHEIDUNGEN.md`,
„Rückmeldung zu 0.2.28“. Nachtests N122 bis N125.

### Rückmeldung zu 0.2.29 und Werkzeug-Umbau – Version 0.2.30 (Zweig `rueckmeldung-0.2.30`, Opus)

Ohne Werkzeug tut ein Tipp aufs Feld nichts; Legende „Am Brett:“ in jeder Karte
(`legendeVon` in `analyse/register.ts`, Test `register.test.ts`); Werkzeug-Umbau mit Symbolen am
Brett, Bündeln, „◀ frühere“ und „spätere ▶“, Reitern und gestuften Karten (Tests
`werkzeugordnung.test.ts`, `stufen.test.ts`, Oberflächentest „Werkzeug-Umbau (0.2.30)“ in
`tests/e2e/bedienung.spec.ts`, Hilfe `waehleWerkzeug` in `tests/e2e/hilfen.ts`). Die zu lange
`durchstich.spec.ts` ist geteilt: dazu `werkzeuge-k1-k5.spec.ts`, `werkzeuge-k6-k12.spec.ts` und
`bedienung.spec.ts`, jede unter 400 Zeilen. Zählen zeigt schon auf Stufe 1 beide Seiten.
Einzelheiten in `docs/ENTSCHEIDUNGEN.md`, „Rückmeldung zu 0.2.29 und Werkzeug-Umbau“. Nachtests
N126 bis N135.

**Vorgemerkt (Autor, 15.10.2026):** Die Kästen „Training zu diesem Kapitel“ wandern auf Website und
in die App; umsetzen, sobald wir in der App „Training“ anfassen, vollständig samt Website (Vorschlag
in `docs/ENTSCHEIDUNGEN.md`, „Vormerkung: Kästen …“).

### Trainingsseiten der Website (Zweig `trainingskaesten`, 16.10.2026, Opus)

Wunsch des Autors (16.10.2026): Die 13 Kästen „Training zu diesem Kapitel“ bekommen je eine eigene
Seite auf der Website, mit allen Inhalten aus dem Buch; im Buch bleiben QR-Code und Link.

- **Quelle:** `inhalte/de/training/kap00.json` bis `kap12.json` und `werkzeugkasten.json`
  (Schema `schemas/training.schema.json`), einmalig aus dem LaTeX gelesen mit
  `python -m pipeline.training --buch buch/a1`. Ab der Buchumstellung sind die Dateien die Quelle
  und werden dort gepflegt; steht im Buch schon `\trainingsverweis`, bricht der Lauf ab.
- **Seiten:** `/training/` (Übersicht), `/training/kap00/` bis `/training/kap12/`,
  `/training/werkzeugkasten/`. Sie entstehen beim Bau (`app/vite.config.ts`,
  `app/src/startseite/trainingsseiten.ts` und `trainingsrahmen.ts`) nach `app/training/` (nicht im
  Repository) und sind über die PWA offline vorhanden. Abbildungsverweise öffnen die Abbildung in
  der App (`/app/#abb-6.20`), Lichess-Adressen sind Links, Tabellen am Handy als Kärtchen.
- **Verknüpfung:** Karte „Training“ auf der Startseite; in der App im Bereich Training oben ein
  Link zur Übersicht und bei jedem Kapitel „Training zu diesem Kapitel (Website)“. Seit diesem
  Stand stehen dort alle 13 Kapitel: Trainer für mehrere Kapitel (Endspieltrainer 8 und 9,
  Abweichungsmodus 2 und 3) erscheinen bei jedem davon; vorher fehlte Kapitel 9 ganz.
- **Buch (Vorschlag, Freigabe offen):** `docs/freigabe/trainingsverweise.tex` mit Präambel-Befehlen
  (`\qrzeile`, `\trainingsverweis`, `\werkzeugkastenverweis`, Paket `qrcode`), dem neuen Abschnitt
  „Die App zum Buch“ für Kapitel 0, je einer Zeile für die 13 Kästen, einem Hinweis im
  Werkzeugkasten und den Folgeänderungen; Erläuterung in `docs/freigabe/trainingsverweise.md`.
  Geprüft: Übersetzung mit den Kästen der Präambel, alle 15 QR-Codes maschinell gelesen (150 dpi,
  Graustufen), Pipeline über eine geänderte Kopie des Buches ohne neue Befunde.
- Prüfungen: pytest 90, Vitest 867, Playwright Chromium 77 (lokal; GitHub Actions nur von Hand).

### Buchstand 16.10.2026: Abbildungen in Kapitel 2 und 3 getauscht – Version 0.2.35 (Zweig `buch-abbildungen-kap2-kap3`, Opus)

Der Autor hat im Buch die Reihenfolge einiger Abbildungen getauscht und wollte **nur** diese
Änderungen in der App (16.10.2026):

- Kapitel 2: 2.29 = Greco-Variante nach 10... d5!, 2.30 = nach 10... Lxa1? 11. Lxf7+ Kf8 12. Lg5;
  dazu die Diagrammreihen 2.26/2.27 und 2.28/2.29, die Bilanz (jetzt an 2.29) und der Verweis in
  der Lösung der Übung „Italienisch: Bilanz“.
- Kapitel 3 (Milner-Barry): 3.31 = nach 12. Kh1, 3.32 = nach 13. f4 (mit der Bilanz),
  3.33 = nach 7... Sxd4??, 3.34 = nach 9. Lb5+!.
- Zugfolgen `k02-a18.pgn` und `k03-a28.pgn`, vorbereitete Texte (2.29, 3.33), Tests und Kommentare
  auf die neuen Nummern umgestellt. Jede der Abbildungen geprüft: Die Zugfolge aus dem Text,
  auch die Nebenvarianten, führt genau zur FEN der Abbildung.
- Tabelle 2.2 gestrichen: Die App nutzt keine Tabellennummern aus Kapitel 2; nichts zu ändern.
- Pipeline: `\vspace` und `\hspace` (auch mit Stern) werden übersprungen; der neue Buchstand
  enthält sie, vorher brach der Datenlauf ab.

**Danach vollständiger Datenlauf (Wunsch des Autors, 16.10.2026):** Der ganze neue Buchstand ist
übernommen. Neu nummeriert sind die Übungen in Kapitel 3 (14–18), Kapitel 4 (19–22) und Kapitel
12 (84–86); der Fortschritt hängt an der Kennung der Übung und bleibt erhalten, die Kopfzeilen von
fünf Zugfolgen (k03-a81, k03-a83, k04-a54, k04-a55, k12-a6) zeigen die neuen Nummern. Inhaltlich
neu: Abb. 0.6 (Unterschrift, Felder), Abb. 1.29 (Fließtext statt Vorsicht-Kasten), Diagrammreihen
in Kapitel 1, 2, 9 und 11, Unterabschnitte bei 2.41, 9.16 und 9.17, Bilanztitel Nimzo-Indisch,
Fallenchecks in Kapitel 4, Aufgaben der Übungen 73 bis 78, 13 Glossareinträge. Neue Zugfolge in
Kapitel 6 als Entwurf `k06-z-e4-e5-sf3.pgn` war keine neue Zugfolge, sondern ein Fehler der Pipeline (siehe unten). Die
Abbildungen selbst (FEN, Pfeile) sind außer 0.6 unverändert.

**Pipeline: Anschluss an frühere Kapitel (16.10.2026).** Im neuen Buchstand steht Abb. 6.20 erst
nach dem Satz „Zwischenstand nach 8. d5 Se7“. Ohne genanntes Ziel nahm die Pipeline die erste
frühere Linie, in der die Züge legal sind: das Lettische Gambit aus Kapitel 3 statt der
Königsindischen Hauptvariante aus Kapitel 2, und schrieb daraus einen falschen Entwurf. Jetzt
gewinnt unter mehreren Anschlüssen aus früheren Kapiteln der, der genau in einer Abbildung
endet (`zugfolgen/anschluss.py`, Test in `test_zugfolgen.py`). Der falsche Entwurf ist gelöscht;
die App-Daten ändern sich dadurch nicht.

### AP 13 Teil 1 und 2: Übungen und erste Trainer – Version 0.2.37 (Zweig `nacht-ap13`, Opus, Nacht zum 17.10.2026)

Vorher aufgeräumt: Zweig `pipeline-anschluss` (Anschluss an frühere Kapitel) ist zusammengeführt.

**Teil 1, Übungen des Buches** (Konzept 9.1 und 9.2):

- `training/uebungsaufgabe.ts`: Lösung aus der freigegebenen Erklärung (deutsche Notation) als
  Linien, dazu „akzeptiert“; Prüfung eines Zuges (weiter, gelöst, falsch). 63 Zugaufgaben,
  23 Denkaufgaben (Test an allen 86 Übungen).
- `training/wiederholung.ts`: fünf Kästen (1/3/7/16/35 Tage), Karten mit Verlauf, fällige Karten.
- `speicher/format.ts` Format 3 mit `karten`; `speicher/fortschritt.ts`,
  `notiereUebungsergebnis` (Q6: auch „Lösung zeigen“ zählt als gelöst, Karte in Kasten 1).
- Oberfläche: `ui/bildschirme/Uebung.tsx` mit `ui/komponenten/useUebung.ts` (Hinweise in drei
  Stufen, „Lösung zeigen“, „Erst selbst denken“ locker oder streng, Erklärung, „Nächste Übung“),
  `KapitelUebungen.tsx` (Liste im Kapitel), `FaelligeWiederholungen.tsx` (Training),
  „Erst selbst denken“ wieder in den Einstellungen. Stil `ui/stil/uebung.css`.

**Teil 2, erste Trainer** (ohne neue Daten, Aufgaben aus den Diagrammen des Buches):

- Logik in `training/`: `zufall.ts` (wiederholbar in Tests), `buchstellungen.ts` (alle
  regelgerechten Diagramme, je Stellung einmal), `zaehltrainer.ts`, `roentgentrainer.ts`,
  `koordinatentrainer.ts`; Tests `trainerrunden.test.ts`.
- Oberfläche: `ui/bildschirme/Trainer.tsx` (Übungsart wählen, Runde), `ui/trainer/`
  (`useRunde.ts` Ablauf und Speichern, `Rundenrahmen.tsx`, `Trainerbrett.tsx`, je Trainer eine
  Datei). `training/trainer.ts`: `zaehlen`, `roentgen`, `koordinaten` sind `fertig`; die
  Trainerkarte zeigt dann „Trainieren“.
- Oberflächentests `tests/e2e/uebungen.spec.ts` und `trainer.spec.ts`.

### H Rückblick nach der Partie – Version 0.2.38 (Zweig `rueckblick`, Opus, Nacht zum 17.10.2026)

- `spiel/rueckblick.ts` (Zeichen und besserer Zug als Markierungen, Balkenanteil und -text,
  Kurvenpunkte; Tests), `ui/komponenten/Bewertungsbalken.tsx`, `Verlaufskurve.tsx`,
  `Brettbereich.tsx` mit optionaler `seitenleiste`, eingebunden in `Partie.tsx` und
  `Auswertung.tsx`, Stil in `ui/stil/spiel.css`. Oberflächentest in `spielen.spec.ts` (2. g4??).
- Offen: „!“ für den einzigen guten Zug (Rückfrage U10).

### AP 13 Teil 3: Trainer auf Fables Daten – Version 0.2.45 (Zweig `ap13-trainer2`, Opus, 17.10.2026)

- Trainerdaten in die App: `skripte/kopiere-trainerdaten.mjs` kopiert `inhalte/de/trainer/*.json`
  bei jedem Build nach `public/daten/de/trainer/` (gitignored, eine Quelle);
  `daten/trainerdaten.ts` lädt sie.
- Taktiktrainer: `training/taktiktrainer.ts` (Thema, Stufe, Zugprüfung, Matt geht vor; Test spielt
  alle 674 Lösungen), `ui/trainer/TaktikBereich.tsx`, `Taktikaufgabe.tsx` (Hilfen Warnsignal,
  Motiv, Schlüsselfigur, Lösung; Motiv benennen).
- „Falle oder Köder“: `training/fallentrainer.ts` (Runden je zur Hälfte Fallen und Geschenke),
  `ui/trainer/FallenBereich.tsx`, `Fallenaufgabe.tsx` (Angebot grau, Warnsignale auf Wunsch).
- Strukturerkenner: `training/strukturtrainer.ts` (schwache Bauern, Planwahl ohne Pläne derselben
  Familie), `ui/trainer/StrukturBereich.tsx`, `Strukturaufgabe.tsx`; Plan-Sätze und
  Strukturnamen `struktur.plan.*`, `struktur.art.*` in `i18n/de.json`.
- Gemeinsam: `ui/trainer/Rundenablauf.tsx` (aus `Trainer.tsx` gelöst), `Stufenwahl.tsx`.
- Übungen: `ui/komponenten/EinzigerZug.tsx` aus `uebungen-engine.json`.
- `AUFGABEN_AUTOR.md`: jede offene Rückfrage hat jetzt eine begründete Empfehlung; neu N236 bis
  N239 und W1 bis W7.

### Design-Überprüfung – fertig, alle 18 Vorschläge angenommen, Version 0.2.98 (Zweig `design-ueberarbeitung`, Opus, 18./19.10.2026)

Auftrag des Autors vom 18.10.2026 (Nummernbereich N450–N499, Vorschläge DS1, DS2, …). Am
19.10.2026 alle angenommen („Alle, ja“), als 0.2.98 auf main; Testpunkte N450–N467.

- **Kriterien** (Websuche): Apple HIG (44 pt, Body 17 pt, Sidebar ab iPad), Material 3 (48 dp,
  Fensterklassen ab 600 dp, Navigation Rail, „supporting pane“), WCAG 2.2 (Kontrast, 1.4.4
  Textgröße 200 %, 1.4.10 Reflow, 2.5.5 Tippfläche 44 px, 2.3.3 Bewegung), Lern-Apps (eine
  Hauptaktion, schrittweise aufdecken, sofortige Rückmeldung), Lichess (Brett links im
  Querformat), chess.com, ChessKid. Systemschrift im Web: iOS über `font: -apple-system-body`
  (nur mit `-webkit-touch-callout`, sonst 13 px am Mac), Chrome Android über
  `<meta name="text-scale" content="scale">` (seit Chrome 146).
- **Bestandsaufnahme:** Playwright-Skript (nur im Scratchpad der Sitzung, nicht im Repository,
  weil die Bilder Buchinhalte zeigen): 62 Bildschirme × 6 Ansichten (hell/dunkel × 360/430,
  Tablet quer 1024), dazu Prüfung aller Tippflächen und ein Lauf mit 200 % Schrift.
- **Umgesetzt, je Vorschlag ein Commit** (Rückbau mit `git revert`, Folge-Commits mit gleicher
  Nummer im Betreff): DS1 Schriftstufen `--groesse-*` in rem, 1 rem = 17 px, folgt der
  Systemschrift, nichts unter 13 px, 200 % ohne Überlauf; DS2 `ui/stil/breit.css`: ab 600 px quer
  Schiene links, Brett links in voller Höhe (jeder Behälter mit `.brettbereich` als Kind wird
  zweispaltig), Lesespalte 760 px, Tablet hoch 720 px; DS3 runde Marke „am Zug“; DS4
  Trainerzeilen ohne Karte in der Karte; DS5 Wörter unter den Brettsymbolen (neue Schlüssel
  `*.kurz`); DS6 Trainerrunde ohne Beschreibung, mit Fortschrittsbalken, Auftrag linksbündig;
  DS7 Reiter mit Symbol über dem Wort; DS8 Chips und Aufklappzeilen 44 px; DS9 lange Titel der
  Kopfzeile; DS10 „Aufgeben“ klein rechts; DS11 Aufklappzeilen in Spielen mit Dreieck; DS12
  Werkzeugleiste blendet rechts aus; DS13 „Alle abhaken/zurücksetzen“ nebeneinander; DS14 „Über
  die App“ ans Ende der Einstellungen; DS15 „Bewegung reduzieren“ überall; DS16 Knöpfe unter
  den Trainingsseiten der Website; DS17 Spielstärke-Tabelle unter 480 px umgebaut; DS18
  Kapitelnummern im Training wie im Buch.
- Nicht angefasst: Gegnerwahl und Bot-Logik (gehören dem Bot-Chat), Seitentitel der
  Einstellungen (Wunsch des Autors 0.2.30: keiner sichtbar), Werkzeugleiste bleibt waagerecht
  scrollbar (Wunsch 0.2.86).
- **Nächster Schritt:** Rückmeldung des Autors zu N450–N467; Entscheidungen in
  `docs/ENTSCHEIDUNGEN.md`, Abschnitt „Design-Überprüfung“.

### Wünsche des Autors vom 19.10.2026 morgens – fertig, Version 0.2.99 (Zweig `spielen-sammlung-nachschlagen`, Opus)

Alles in `docs/ENTSCHEIDUNGEN.md`, Abschnitt „Wünsche des Autors vom 19.10.2026 morgens“;
Testpunkte N468 bis N474. Nächster Schritt: Rückmeldung des Autors.

## P4 Trainerinhalte (Zweig `p4-trainerinhalte`, Fable, 23.10.2026)

Basis `weiter-ohne-autor`; nicht auf main, keine neue Versionsnummer. Nicht angefasst:
`app/src/engine/*`, Werkzeuge in `app/src/analyse` (nur gelesen und aufgerufen; Befunde für P3
unten). Testpunkte N690–N701 und Rückfragen P4-1 bis P4-7 in `docs/AUFGABEN_AUTOR.md`.

- [x] **R50 Falle oder Köder** (`pipeline/trainer/falle.py`, `falle_buch.py`, Schema, Daten,
      `training/fallentrainer.ts`, `ui/trainer/Fallenaufgabe.tsx`): Falle = nach dem Nehmen
      mindestens 1,5 schlechter als vorher und mindestens 0,8 im Minus; Köder-Zug je Aufgabe
      (`fenVorher`, `vorzug`, roter Pfeil), Erklärsatz mit Widerlegung und Wirkung, Warnsignale
      erst nach der Antwort. 137 Aufgaben neu (17 Buch, 120 Lichess, je Stufe 12 Fallen und 12
      Geschenke). Lauf: `python -m pipeline.trainer.falle --lichess … --teil i/4` (vier Teile
      parallel, je Teil etwa 10 Minuten) und `--zusammen`.
- [x] **R48 Planbilanz-Übung** (`training/planablenker.ts` neu, `planbilanztrainer.ts`): Ablenker
      aus Sicht der Seite am Zug, Figuren mit „dein“, nur Mittelspiel (49 Stellungen),
      Hauptkette. Prüflauf `npx vitest run --config vitest.messung.config.ts
      src/training/planbilanz.messung.ts` schreibt alle Aufgaben nach `buch/arbeit/planbilanz.txt`
      (durchgesehen: alle 49 Stellungen plausibel).
- [x] **R47 Endspieltrainer** (`training/endspieldrills.ts`, `endspielzugdrills.ts` neu,
      `ui/trainer/Drillaufgabe.tsx`, `pipeline/trainer/endspiel.py`, `endspiel_lichess.py` neu):
      drei neue Kurzübungen, Quadrat als Pfeile aus k8-quadrat, Abb. 8.31 raus, Plausibilität aller
      Buchstellungen über zwölf Züge geprüft (nur 8.31 trivial), 119 freie Lichess-Endspielaufgaben
      (Themen `bauernendspiel`, `damenendspiel` neu). Lauf: `python -m pipeline.trainer.endspiel
      --lichess buch/arbeit/lichess/passende-endspiel.pkl --teil i/4` und `--zusammen`; die
      Stichprobe entsteht mit `lichess.lies_datenbank(pfad, endspiele=True)` (zwei Minuten).
- [x] **R49 Strukturerkenner** (`p3-werkzeuge` eingemischt; `training/strukturtrainer.ts`,
      `ui/trainer/Strukturaufgabe.tsx`, `pipeline/trainer/struktur.py`): echte Stellung mit Knopf
      „Nur das Skelett zeigen“; starke Felder (4. bis 6. Reihe) und schwache Bauern aus denselben
      Bausteinen wie die Werkzeuge nach den Festlegungen des Autors (P3); neuer Schritt
      „Welche Feldart ist das goldene Feld?“ mit Loch, schwachem Feld, starkem Feld, Vorposten,
      rückständigem Bauern; 28 Stellungen aus den Partien und Zugfolgen der Kapitel 2, 3, 6, 11
      und 12 dazu (162 Aufgaben). Lauf: `python -m pipeline.trainer.struktur` (ohne Engine).

**Befunde für P3 (Werkzeuge, nur gelesen):** `plan.wo.figuren` schreibt „(Ziel )“ mit leerem
Ziel, wenn `bedingungen.ziele` und `haken` leer sind (Abb. 11.14, 11.15, 11.67); `planlage.ts`
nimmt als `kette` die erste Kette mit Richtung statt der längsten/zentralsten (Abb. 11.78:
c3–b4 statt e4–d5); die Gliederfolge einer Kette mit zwei Basen liest sich „d6–f6–e5“ (Abb.
6.11). Der Trainer umgeht alle drei lokal (`planablenker.ts`).
**Erledigt (P1, 23.10.2026):** Alle drei im Werkzeug behoben: ohne Ziel und Haken heißt es nur
„alle drei Bedingungen erfüllt“ (`plan.wo.figurenOhneZiel`); die Hauptkette ist die längste mit
Richtung, bei Gleichstand die zentralste; verzweigte Ketten (zwei Basen oder zwei Spitzen) stehen
von Linie zu Linie („d6–e5–f6“). Tests in `planlage.test.ts` und `bauernprofil.test.ts`. Die
Umgehungen in `planablenker.ts` bleiben unschädlich stehen.

**Nächster Schritt:** Rückmeldung des Autors zu N690–N705 und P4-1 bis P4-9; danach den Zweig
nach `weiter-ohne-autor` (oder main) übernehmen.

## Wartet auf den Autor

**Alles Offene steht in `docs/AUFGABEN_AUTOR.md`** (seit 0.2.31 nur noch Offenes: Nachtest,
Entscheidungen mit Wortlaut der Fragen, Buchhinweise, Freigaben, Rechtliches). Erledigte Nachtests
(N1 bis N135), der Wiedereinstieg und die Vorschläge zu 0.2.26 liegen in
`docs/archiv/stand-0.2.30/`. Offen aus den angenommenen Vorschlägen (Archiv,
VORSCHLAEGE_0.2.26.md): D1 Leerfälle und H Rückblick im Spielen (D4 „Gegner?“ und G
Eröffnungsliste sind seit 0.2.32 umgesetzt).

## Nächster Schritt

### Arbeitsplan ab 23.10.2026 (Pakete, mehrere Chats)

Der Autor hat die Arbeitsliste am 23.10.2026 um R27 bis R53 erweitert und in Pakete aufgeteilt.
Jeder Chat arbeitet auf eigenem Zweig ab `weiter-ohne-autor`; nur P1 mischt ein, erhöht die
Version und pusht nach `main`. Den Code der Bots fasst niemand an, solange der Bot-Chat kalibriert.
Testpunkt-Nummern je Paket getrennt.

| Paket | Zweig | Inhalt | Modell | Testpunkte | Stand |
|---|---|---|---|---|---|
| P1 Koordination | `weiter-ohne-autor` | R33, Einmischen, main, R26 | Opus mittel | N630–N649 | läuft (R33 fertig, 0.2.118) |
| P2 Brett | `p2-brett` | R35–R40, R29, R53 | Opus mittel | N650–N669 | fertig (0.2.119) |
| P3 Werkzeuge | `p3-werkzeuge` | R41–R44, Glossarvorschläge | Fable hoch | N670–N689 | fertig (0.2.118) |
| P4 Trainerinhalte | `p4-trainerinhalte` | R50, R48, R47 (mit R34), danach R49 | Fable hoch | N690–N709 | fertig (0.2.119) |
| P5 Trainerbedienung | `p5-trainerbedienung` | R30, R31, R46, R45 | Opus mittel | N710–N729 | fertig (0.2.118) |
| P6 Englisch | `p6-englisch` | R25 | Opus niedrig | N730–N739 | läuft |
| P7 Spielen | `weiter-ohne-autor` (P1) | R51, R24, R27, R28, R32 | Opus mittel | N632–N645 | in 0.2.120 bis 0.2.123 erledigt; R51 nur Anzeigeteil, Wertung und „besiegt“ je Zeitklasse beim Bot-Chat |
| P8 App-Tour | `p8-tour` | R52 | Opus mittel | N760–N769 | Teil A in 0.2.121, Teil B Spielen nach der Kalibrierung |

Kurzbeschreibung der neuen Punkte: R27 „Art des Gegners“ über „Partie beginnen“; R28 Bot-Name als
Partietitel mit Porträt; R29 Fortschrittsbalken der Auswertung; R30 Taktik ohne Motivfrage bei
einem Motiv; R31 „Nehmen: …“ ohne Zugzeichen; R32 Spielstärke-Karte nur gewertet, Haken nicht
automatisch; R33 Eröffnung ohne „zu wenige Züge“ (erledigt); R34 Quadrat im Endspieltrainer wie im
Buch; R35 Tippen großzügiger; R36 zusammenhängende Markierungen als ein Umriss; R37 Zuganimation;
R38 Partieende auf dem Brett; R39 Startanimation; R40 Quer-/Hochformat live; R41 Sichtwechsel in
Werkzeugen; R42 einspaltig, keine Dopplungen; R43 Denkroutine mit Engine-Bewertung; R44
Strukturbegriffe (rückständiger Bauer, Loch, schwaches/starkes Feld, Vorposten); R45 Zug erraten
ausbauen; R46 Studien mit Pfeilen und Engine; R47 Endspieltrainer prüfen und erweitern; R48
Planbilanz-Trainer neu erzeugen; R49 Strukturerkenner mit echten Stellungen; R50 Falle/Köder mit
echtem Verfahren; R51 Zeitklassen und Abzeichen; R52 App-Tour; R53 Nachtmodus der Seitensymbole.


### Rückmeldung des Autors vom 19.10.2026 abends: 30 Punkte (Arbeitsliste, in dieser Reihenfolge)

Der Autor hat alle Punkte freigegeben („Du darfst gerne alles machen. Nichts soll an einen anderen
Chat.“), auch Dateien des Bot-Chats. Offene Fragen: jeweils Claudes Empfehlung nehmen und am Ende
als Rückfrage in `docs/AUFGABEN_AUTOR.md` (Teil 2) stellen; neue Testpunkte in Teil 1. Nach
jedem Punkt committen und pushen (Nutzungslimit des Autors). Reihenfolge nach Aufwand:

- [x] R1 Aufräumen: alle „ok“-Punkte aus AUFGABEN_AUTOR nach ENTSCHEIDUNGEN; V5 „alle frei“
      (Entwurfs-Kennzeichen prüfen); V2: CLAUDE.md Arbeitsablauf (Autor testet auf main).
- [x] R2 N501: „von Claude konstruiert“ → „von einer KI konstruiert“ (de, en; sonst sichtbares
      „Claude“ suchen).
- [x] R3 N194: Text Schritt 3 Röntgen-Trainer (Schachs und Schläge ohne Verlust nach Abtausch;
      Drohungen nicht extra).
- [x] R4 Satz zur Bot-Stärke „benachbarte Stufen überschneiden sich etwas“ berichtigen.
- [x] R5 Einstellungen: Reiter „Training“ beim Öffnen gewählt.
- [x] R6 Hauptleiste ohne Beschriftung, Symbole größer (Name für Screenreader bleibt).
- [x] R7 Spielen: Bots innerhalb der Kategorie nach Spielstärke sortieren.
- [x] R8 S24 Namen der Stufen nach den heutigen Zahlen (Empfehlung: Einsteiger, Anfänger,
      Gelegenheitsspieler, Vereinsspieler, Starker Vereinsspieler, Experte, Meister, Großmeister;
      en entsprechend; Bot-Texte mit „Vereinsanfänger“).
- [x] R9 Sammeln unter dem Brett: Info-Symbol in der Kachel.
- [x] R10 Rückblick: Info-Symbole „In die Fehlerdatenbank“/„In die Lernsammlung“, Fenster wieder
      zuklappbar.
- [x] R11 Zielbilanz-Übung: Zeichen ja/nein/teils wie im Buch.
- [x] R12 Spielen: Spielhilfen (mit „Zug zurücknehmen“) und Eröffnung festlegen aufklappbar über
      „Partie beginnen“.
- [x] R13 EN2: 27 Buchzitate ins Englische (recherchiert); V1: Englisch auch in der
      Veröffentlichungsfassung.
- [x] R14 Trainer: Knopf „Übung wiederholen“ überall.
- [x] R15 Trainer: Auswahl aus vielen per Aufklappliste (Repertoire, Abweichung, Taktik, …).
- [x] R16 Zähltrainer und Co.: Zahleneingabe schöner als ein Knopf je Zahl, Zahlen mittig.
- [x] R17 Trainingsseiten der Website: klar, wann App und wann Website (Lichess) und was zu tun ist.
- [x] R18 NA1: nach der Einschätzung Urteil der Engine (ausgeglichen bis 0,5 Bauern), richtig
      eingeschätzte Abbildungen merken → Werkzeuge gleich da. Umgesetzt als zusätzliches Feld
      `fortschritt.eingeschaetzt` ohne neue Formatversion (wie `warum` seit 0.2.99); es steckt
      automatisch in der Sicherung.
- [x] R19 F2 Denkroutine-Trainer: Kandidaten und Antworten am Brett ziehen statt Text.
- [x] R20 Faktorenbilanz-Trainer: Eingabe mit Waagen wie im Buch.
- [x] R21 Musterlösungen der Zug-Trainer mit der Engine prüfen (katastrophal = mehr als etwa
      2 Bauern schlechter als der beste Zug), sonst neues Beispiel.
- [x] R22 Partienliste: Filter und Sortierung über Symbole, mehrere Filter zugleich.
- [x] R23 PGN-Import bei der Partienliste: auswerten, als nicht gewertete Partie speichern.
- [ ] R57 Admin-Dashboard (Idee des Autors, 24.10.2026). Stand 24.10.2026 vormittags: Stufe 1
      und 2 gebaut, Werkzeug-Links auf den Trainingsseiten (Zweig `weiter-ohne-autor`, Testpunkte
      N740 bis N746, Einrichtung DB1 bis DB4); offen: Ausrollen nach dem Bot-Chat. Ursprünglicher Plan: geschützte Seite
      `/admin/` (Cloudflare Access); wöchentliche Prüfung per GitHub Actions (Links in Kapitel 12,
      Trainingsseiten, Lizenzen; Lichess-Eröffnungsliste und Aufgaben; Live-Version gegen main; CI;
      Sicherheitswarnungen npm, Stockfish-Version; Buchstand neuer als App-Daten; Zertifikat,
      Domain) als Ampel; Bug-Reports über einen Cloudflare Worker gespeichert (D1/KV) und per
      Mail gemeldet; Knopf „Aufgabe für Claude“ fasst rote Punkte zu einem Prompt zusammen.
      Autor richtet Cloudflare ein (Anleitung von P1), Datenschutzerklärung ergänzen. Plan mit
      Funktionen und Einrichtung: `docs/PLAN_DASHBOARD.md`.
      Dazu (Wunsch des Autors): Auf den Trainingsseiten `/training/kapNN/` und im Trainingsteil
      der App direkte Links zu den externen Werkzeugen, die die Trainingskästen empfehlen
      (etwa Lichess-Aufgaben, Analysebrett, Eröffnungsexplorer, Koordinatentraining), als
      eigene Liste `inhalte/de/werkzeuglinks.json` mit Fundstelle im Buch; das Dashboard prüft
      sie mit.
- [x] R54 Partienliste (entschieden 23.10.2026, umgesetzt in 0.2.123): Variante A, zwei Knöpfe „Filter“ und
      „Sortieren“ mit aufklappender Liste in Worten, aktive Filter als Chips mit × (P7b).
- [x] R55 Auswertung: Liste der Fehler und Patzer immer eingeklappt, Anzahl als Badge (0.2.122).
- [x] R56 Auswertung (entschieden 23.10.2026, umgesetzt in 0.2.122; Vergleichswerte vorläufig):
      - Umschalter Weiß/Schwarz ganz oben, gilt für die ganze Seite (Satz, Fehlerliste,
        Auswertung); Voreinstellung eigene Seite, volle Breite.
      - Bewertungskurve bleibt die einzige Kurve (keine zweite für Genauigkeit je Zug, sie wäre
        doppelt). Zoom: Phase unter der Kurve antippen zieht sie auf volle Breite, „Ganze
        Partie“ zurück; Finger auf der Kurve fahren zeigt Zug für Zug „23. Sf5“, Loslassen springt
        dorthin; zusätzlich Aufziehen mit zwei Fingern.
      - Großer Ring mit der Gesamtgenauigkeit, daneben Urteil, Genauigkeit und geschätzte
        Spielstärke mit Spanne.
      - Darunter Balken (Skala 50–100 %) für Eröffnung, Mittelspiel, Endspiel, Strategie und
        Taktik, mit den Phasensymbolen der App, Prozent, Urteilswort und Elo; Phase mit zu
        wenigen Zügen grau, „–“.
      - Zugklassen einzig als Bullet-Diagramm mit Zonen: je Klasse Marke, Name, Badge mit
        Anzahl und „x % des Üblichen · Urteil“; eigene Skala 0 bis doppelt üblich; Strich =
        üblich bei der eigenen Stärke; Zonen schwach/normal/gut (bei schwachen Klassen
        umgekehrt); über der Skala „▸“.
      - Zonengrenzen aus der Streuung der Lichess-Daten des Bot-Chats; unter etwa 15 eigenen
        Zügen nur Badges.
      - Erklärtexte hinter dem Fragezeichen.
      - Vorschau: vorschau-auswertung.html (Chat P1).
- [x] R24 (0.2.123) Bot mit festgelegter Eröffnung: ohne Buchzug Zugfolgen derselben Eröffnung aus der
      Lichess-Liste.
- [ ] R25 V1: restliche Buchdaten ins Englische (inhalte/en, kapitelweise).
- [ ] R26 Abschluss: Rückfragen mit den genommenen Empfehlungen und Testpunkte in AUFGABEN_AUTOR.

Stand 19.10.2026 (0.2.102). Der Nachtplan vom 18.10.2026 ist erledigt: Chat A (0.2.90, 0.2.91,
0.2.97), Chat B (Design 0.2.98, Symbolsprache 0.2.101), Chat C (Aufgabenliste entlastet, 0.2.95),
Chat D (konstruierte Zugfolgen und Tablebase, 0.2.96), Chat E (Wischen, Lernsammlung, Technik für
Englisch, 0.2.92 bis 0.2.94); dazu 0.2.99 und 0.2.100 (Wünsche des Autors, Porträtwahl). Die
Nummernbereiche der Chats bleiben gültig (A N400–N449, B N450–N499, D N500–N549, E N550–N599,
Bot-Chat N350–N399); der Bot-Chat behält seine Dateien.

1. **Autor:** alles in `docs/AUFGABEN_AUTOR.md` (Regel 8): Teil 1 Tests (neueste zuerst),
   Teil 2 „Nur bestätigen“ (NA1, ZF1 bis ZF3), S24 nach N335 (Buchbefunde sind seit 0.2.115
   erledigt; der Autor übernimmt den Buchzweig `claude/funny-bardeen-e7wpzs` nach `main`),
   S20, E4, Frage zu N326; offene Frage zu CLAUDE.md (Satz über `claude/App_Fortschritt.md`
   streichen?).
2. **Vom Autor am 19.10.2026 abgesegnet, in dieser Reihenfolge (Opus):**
   a. N180 Uhr sofort sichern: erledigt in 0.2.102.
   b. Englische Fassung der App: erledigt in 0.2.103 als Vorschau. Offen für AP 18: englische
   Buchquellen des Autors → Pipeline mit `--ziel app/public/daten/en/a1`, Trainerdaten nach
   `inhalte/en/trainer/`, dann „en“ in `DATENSPRACHEN` und `FERTIGE_SPRACHEN`
   (`i18n/sprache.ts`); die 27 Buchzitate (EN2) eintragen; Namen der Bots sind noch deutsch
   (`engine/gegnerliste*.ts`, Bot-Chat).
   c. Neue Testpunkte 0.2.98 bis 0.2.101 vorprüfen: erledigt in 0.2.107.
   d. Version 1.0 vorbereiten (AP 17): erledigt in 0.2.108 (`docs/ABNAHME_1.0.md`). Zum
   Veröffentlichen: endgültiger Buchstand, Datenlauf ohne Entwürfe und Prüfung mit
   `--veroeffentlichung`, Version 1.0.0, Bau mit `npm run build:veroeffentlichung`
   (Cloudflare, `docs/VEROEFFENTLICHUNG.md`), Antworten V1 bis V6.
3. **Vorgemerkt (Wunsch des Autors, 19.10.2026):** Die Erklärung zur Bot-Stärke
   (`botstaerke.erklaerung` in `de.json` und `en.json`) sagt noch „benachbarte Stufen
   überschneiden sich etwas“; seit 0.2.109 schließen die Bereiche aneinander an, ohne sich zu
   überschneiden. Den Satz entsprechend ändern. Der Text gehört zum Bereich des Bot-Chats, also
   mit ihm abstimmen oder dort erledigen lassen.

### P8 App-Tour (Zweig `p8-tour` von main 0.2.120, Opus, 23.10.2026) – Teil A fertig, Abnahme offen

R52: Toursymbol (Kompass) oben rechts, Frage nach dem Rundgang beim ersten Start, Schalter in den
Einstellungen › Anzeige, Haupttour und 31 Bildschirmtouren (alle außer Spielen). Technik in
`app/src/tour/` (README dort): Tourdaten `touren.ts` (eine Zeile je Schritt, Ziele über
`data-tour`), Ablauf `TourEbene.tsx`, Merker `tourMerker.ts` (nur Gerät), Test `touren.test.ts`
meldet Ziele, die es im Code nicht gibt; Oberflächentests `tests/e2e/tour.spec.ts`. Plan, Texte
und Rückfragen: `docs/AUFGABEN_AUTOR.md` P8-1 bis P8-44, Testpunkte N760–N768. Version nicht
erhöht (macht P1). **Nächster Schritt:** Teil B (Touren für Spielen, Partie, Auswertung,
Partienliste, P8-44), sobald der Autor meldet, dass die Kalibrierung auf main ist: dann main in
`p8-tour` mischen, `data-tour` an Spielen.tsx, GegnerWahl, Partie, Auswertung, Partienliste
setzen, Touren „spielen“ und „partie“ in `touren.ts` und `tourFuerAnsicht` ergänzen, Texte de/en.

### P5 Trainerbedienung (Zweig `p5-trainerbedienung` von `weiter-ohne-autor`, Opus, 23.10.2026)

Auftrag: Paket P5 „Trainer-Bedienung“ (R30, R31, R46, R45), nicht nach main, keine
Versionsnummer, Testpunkte N710–N729. Nicht angefasst: `app/src/engine/*` (Bots) und die
Trainerdaten in `inhalte/` (Paket P4).

- [x] R30 Taktiktrainer: Ist nur ein Motiv gewählt, entfällt „Welches Motiv war es?“
      (`TaktikBereich.tsx` gibt `motivAbfragen={false}` an `Taktikaufgabe`). N710.
- [x] R31 Falle oder Köder: Auftrag und Knopf „Nehmen: …“ ohne „+ # ! ?“
      (`ohneZugzeichen` in `schach/notation.ts`); die Auflösung zeigt den Zug vollständig. N711.
- [x] R46 Studien-Trainer: bei falschem Zug roter Pfeil (eigener Zug) und goldener Pfeil (Zug der
      Studie), Vergleich beider mit der Engine (`Repertoireaufgabe` mit `vergleichen`,
      gemeinsame Anzeige `Zugvergleich.tsx` und `vergleichspfeile.ts` für Studien und Zug
      erraten; `rateurteil` liefert beide Werte und die Variante nach dem eigenen Zug). N712.
- [x] R45 Zug erraten: Hinweis-Knopf (Figur; Treffer mit Hinweis zählt nicht), Pfeile für den
      letzten Zug, Bewertungsbalken live, Kommentar nach Motiven und Fehlerarten, Zugnavigation,
      Analysemodus. Dateien: `ui/trainer/Zugerratenaufgabe.tsx` (Brett und Ablauf),
      `useRatestand.ts` (Stand und Raten), `useZugerratenEngine.ts` (eine Engine nacheinander für
      Vergleich und Balken, mit Zwischenspeicher je Stellung), `Zugerratenleiste.tsx` (Blättern,
      Analyse), `Zugkommentare.tsx` und `training/zugkommentar.ts` (Motive aus Kapitel 7 nur bei
      Materialgewinn ab 2 oder Matt, Rückschläge ausgenommen; Fehlerart wie im Rückblick ab
      „?!“). Der Oberflächentest `feld()` in `trainer-kapitel2bis12.spec.ts` sucht nur noch auf
      dem Brett, weil die Zugleiste gleichnamige Knöpfe hat. N713–N718.

Prüfung: `npm run pruefen` (1251 Tests) und alle 142 Oberflächentests in Chromium grün.

**Nächster Schritt:** Paket P5 fertig. Rückmeldung des Autors zu N710–N718 abwarten; Zweig
`p5-trainerbedienung` danach mit `weiter-ohne-autor` zusammenführen (nicht nach main ohne
Auftrag).

### P3 Werkzeuge und Strukturbegriffe (Zweig `p3-werkzeuge`, Fable, 23.10.2026) – fertig, Abnahme offen

Basis `weiter-ohne-autor`; nicht auf `main`, keine Versionsnummer. Testpunkte N670 bis N679 und
Rückfragen B9 bis B14 (Buchvorschläge zu den Strukturbegriffen) in `docs/AUFGABEN_AUTOR.md`.

- [x] **R44 Bauernstruktur** nach den Festlegungen des Autors: `schach/bauernschwaechen.ts`
      (rückständig = Nachbarn vorn, kein eigener Bauer deckt mehr, gegnerischer Bauer hält das
      Feld davor, kein gegnerischer Bauer auf der Linie davor), `schach/bauernprofil.ts` (starke
      Felder 4. bis 6. Reihe), `schach/skelettfelder.ts` (`besetztVon` am starken Feld: Vorposten
      besetzt oder vorgesehen). Texte der Werkzeuge Felder, Bauern, LAP und des Plan-Satzes
      „Vorposten besetzen“ mit Bauernloch, schwachem Feld, starkem Feld, Vorposten (de, en).
      Folge: fünf Abbildungen mit anderem Läuferurteil (weniger Bauern gelten als festgelegt),
      Referenz `analyse/__referenz__/werkzeuge.txt` neu. Buchvorschläge B9 bis B14.
- [x] **R41 Sichtwechsel:** `wende` (analyse/register.ts) stempelt die Sicht ins Ergebnis
      (`Werkzeugergebnis.seite`), die Legende der Werkzeugkarte nennt die Farben über `{eigen}`
      und `{gegner}` in allen 22 Legenden mit Seitenbezug. Nur die gewählte Seite: k5-felder (ohne
      vierten Befund), k5-bauern (Gegner nur als „Ziele bei …“), k5-richtung, k5-figuren,
      k6-planbilanz. Beide Seiten mit Begründung in der Regel: Röntgen, Warnsignale, Erfassen,
      Zielbilanz, Faktorenbilanz.
- [x] **R42 Karten:** `.befunde` einspaltig (basis.css), zwei Spalten erst im Tablet-Hochformat
      ab 760 px und im Querformat ab 1340 px (breit.css). Phase aus `k12-erfassen` entfernt (nur
      im Fazit), Reiter „Phase“ bleibt die einzige Stelle.
- [x] **R43 Kandidaten:** `ui/komponenten/KandidatenKarte.tsx` (Engine-Abschnitt über
      `Werkzeugzusatz`, auch in der Partie), reine Teile in `kandidatenbewertung.ts` mit Test;
      `kandidatenliste()` und `istRuhig()` in `analyse/k12-kandidaten.ts`; Texte für ruhige
      Kandidaten ohne Materialstand (`kandidaten.antwortRuhig`, `besteRuhig`, `ruhigeUnten`).
      Oberflächentests angepasst (Planbilanz, Bauern, Kandidaten mit Engine, Legende der Sicht).

**Für P4 (Strukturerkenner):** Die neue Strukturerkennung liegt in `schach/bauernschwaechen.ts`
(`rueckstaendige` mit den vier Bedingungen), `schach/bauernprofil.ts` (`loecher`, `starkeFelder`
ab der eigenen 4. Reihe) und `schach/skelettfelder.ts` (`SicheresFeld.gestuetzt` = Vorposten,
`besetztVon`, `Springerfeld`). `training/strukturtrainer.ts` rechnet noch mit seiner eigenen
Zeile `STARKE_REIHEN = [4, 5]` (5. und 6. Reihe) und den Merkmalen aus den Trainerdaten
(`merkmale.rueckstaendige` von Fable, alte Definition); beides auf die neue Erkennung umstellen,
dazu die Texte `strukturtrainer.auftrag.felder` und `strukturtrainer.keine.felder` („5. und 6. Reihe“ → „4. bis 6. Reihe“). Nächster Schritt: Rückmeldung des Autors zu N670 bis N679 und
B9 bis B14; danach `p3-werkzeuge` in `weiter-ohne-autor` übernehmen.

## Offene Punkte

- Zugfolgen, die eine im Buch nicht gezeigte Ausgangsstellung brauchen („Stünde der Turm auf b8 …“,
  Kapitel 9), bleiben ohne Anschluss; falls gewünscht, als freigegebene PGN mit `[FEN]` anlegen.
- Abb. 7.24: ohne konstruierte Zugfolge (Chat D, siehe ZF in AUFGABEN_AUTOR).
- Gleiche Startstellungen: Nach der Regel des Autors (nur im selben Kapitel zusammenführen) sind
  die zwei Paare zusammengeführt (0.2.32); über Kapitelgrenzen bleibt alles getrennt.

### Teil A, Stand 22.10.2026 mittags (Fehlerarten und Raten je Art)

- Neue Fehlerarten (engine/fehlerart-neu.ts): bauerEingestellt, schlagVerpasst, bauernzugOhneNot,
  koenigszugOhneNot; „Figur hängen“ erkennt auch Figuren, die erst die Widerlegung schlägt.
- Fehlalarme behoben: Taktik zählt nur, wenn die Widerlegung das Motiv spielt und Material gewinnt;
  ein gleichwertiger Abtausch (Sxb3 axb3, Lxf4 Dxf4) ist nicht „Figur hängen“.
- Neueinordnung aller 181 000 gespeicherten Stellungen ohne Engine
  (engine/fehlerart.neuauswertung.messung.ts, gut 5 Minuten). Anteile an allen Fehlern ab 0,5:
  ungenau 36,6 %, drohungIgnoriert 15,8, bauernzugOhneNot 10,3, schlagreflex 9,3,
  taktikUebersehen 5,6 (vorher 24,7, meist Fehlalarme), schlagVerpasst 4,7, figurHaengen 3,7,
  koenigMitte 3,0, bauerEingestellt 2,4, bauernvorstoss 2,1, übrige je unter 1,5.
  Der Rest „ungenau“ sind fast nur ruhige Figurenzüge mit kleinem Verlust (Stellungsfehler).
- Stichprobe 319 Fehler: Materialarten ohne Materialverlust in sieben Halbzügen von Hand geprüft;
  echte Fehlalarme etwa 2 von 48 bei drohungIgnoriert, 0 bei figurHaengen; schlagreflex,
  bauernraub und falscherAbtausch sind absichtlich materialneutral (Stellungsfolgen).
- Raten je Fehlerart × Kategorie × Phase × Zeitklasse (geglättet, je 100 Züge) lokal in
  buch/arbeit/menschenprofil2/fehlerarten.json und .txt (Skript fehlerarten.py, stichprobe.py).
- Nächster Schritt: blinde Flecken in die Fehlerarten überführen (Engine, Oberfläche, Speicher mit
  Umwandlung), dann die Raten aus fehlerarten.json als Fehlerprofile der Stufen übernehmen.

### Teil A: blinde Flecken × Fehlerarten (22.10.2026, Hinweis des Autors)

- Blinde Flecken sind Ursachen, Fehlerarten Folgen; beide hängen am selben Zug. Für alle 181 000
  gespielten Züge bestimmt (engine/blindeFlecken.kopplung.messung.ts, ohne Engine): Flecken des
  besten Zuges (eigenen Zug übersehen) und der Widerlegung (Zug des Gegners übersehen). Auswertung
  lokal: buch/arbeit/menschenprofil2/flecken.py → flecken.txt, flecken.json (je Zeitklasse ×
  Kategorie × Phase).
- Eigene Flecken: Fehlerrate ×1,2 bis ×2,4 gegenüber Stellungen ohne Fleck; am stärksten
  Zwischenzug (×1,5–2,3), lange Damenzüge (×1,6–1,9), Abzug (bis ×2,4 bei 2400), Rückzug und
  Springer rückwärts (×1,4–1,8); stille Bauernzüge am schwächsten (×1,1–1,4).
- Gegnerflecken (Widerlegung): Abzug ×2,0–2,6, Zwischenzug ×2,3–3,4, Grundreihe ×1,3–3,8
  (sinkt mit der Wertung), lange Damenzüge ×1,8–2,9, Diagonale ×1,0–2,0; Rückzug, Ruhig und
  Bauer sind keine Gegnerflecken (unter 1).
- Kopplung: Gegner-Abzug → taktikUebersehen (Lift 4,4), Gegner-Diagonale → figurHaengen (2,6)
  und bauerEingestellt (2,2), Gegner-Dame → drohungIgnoriert, schlagreflex, taktik (1,7–1,9);
  eigene Diagonale und Dame → schlagVerpasst (Lift 3), eigener Bauernzug → bauernzugOhneNot,
  tempoverlust, verfrühte Dame (1,5–1,8).
- Folgerung für das Zusammenführen: Flecken bleiben Ursachen mit eigener Rate (Faktor auf die
  Fehlerrate je Kategorie), die Fehlerart des Zuges bestimmt weiter die Erkennung. „Ruhig“ und
  „Bauer“ als Gegnerflecken streichen.

### Teil A: Doppelprüfung mit der Engine (22.10.2026 nachmittags, Wunsch des Autors)

- Fleck-Regeln: zwei Fehler behoben (Rochaderecht galt als „Schlag möglich“, en passant als
  stiller Bauernzug). Zweitfassung der Regeln in python-chess (lokal flecken_unabhaengig.py)
  stimmt bei über 400 000 Zuordnungen überein (Rest: 269 doppelt gespeicherte Stellungen).
- Engine-Gegenprüfung (engine/fehlerpruefung.messung.ts, Tiefe 20 statt 12, 6235 Züge: je Art
  bis 300 Fehler, dazu 1500 Züge ohne Fehler; lokal pruefung.txt):
  bestätigt 89–96 % bei figurHaengen, schlagreflex, taktikUebersehen, bauerEingestellt,
  schlagVerpasst, bauernraub, drohungIgnoriert; 82–85 % bei bauernzugOhneNot, koenigMitte,
  koenigszugOhneNot, tempoverlust, verfruehteDame; schwächer koenigsschild 79, ungenau 76,
  bauernvorstoss 74, koenigPassiv 74, falscherAbtausch 60 (Rest meist Grenzfälle 0,3–0,5).
  Fehlerart in Tiefe 20 gleich: meist 82–100 %, falscherAbtausch 61 % (oft schlagreflex).
  Von den Zügen ohne Fehler sind in Tiefe 20 8 % doch Fehler (Tiefe 12 übersieht sie).
- Hochgerechnet gleichen sich Fehlalarme und übersehene Fehler fast aus (+3,5 %). Je Art ein
  Korrekturfaktor (0,80 koenigsschild bis 1,29 bauernvorstoss, lokal korrektur.json), in
  fehlerarten.json schon eingerechnet.
- Flecken: Bester Zug ist in Tiefe 20 nur zu 71 % derselbe; je Fleck weichen 3–30 % der
  Zuordnungen ab, aber in beide Richtungen etwa gleich oft. Raten und Kopplungen bleiben damit
  im Mittel richtig, einzelne Zuordnungen sind unsicher. Fleckraten nach der Korrektur fast
  unverändert (flecken.txt).
- Offen für die Erkennung: falscherAbtausch und koenigPassiv schärfen (Grenze zu schlagreflex
  und ungenau), sonst Zusammenführen von Flecken und Fehlerarten (Engine, Oberfläche, Speicher).

### Teil A: Schärfung und Vertrauensintervalle (22.10.2026 abends)

- Festlegungen mit dem Autor (umgesetzt, engine/fehlerart-schlag.ts, fehlerart-koenig.ts):
  - Schlagreflex: Schlag sieht nach Gewinn aus (Abtausch ≥ 1), jeder Gegnerzug der ersten vier
    Halbzüge der Widerlegung zwingt (Schlag, Schach, Angriff ab Leichtfigur), danach mindestens
    ein Bauer schlechter (Material oder Bewertung). Schlag mit Verlust laut Abtausch = Figur hängen.
  - Falscher Abtausch: zurück um ≥ 2, gleichwertiger Figurentausch, nicht beim Zurückschlagen.
  - König passiv: nur Endspiel, Kapitel 8 Regel 1 mit dem Königsweg von k8-regeln (keine
    gegnerische Dame, König nicht am Ziel, bester Zug bringt ihn näher oder Zug vom Ziel weg).
- Tiefe-20-Prüfung danach: Schlagreflex 96 % bestätigt (Art gleich 80 %), falscher Abtausch
  96 % (99 %), König passiv 75 % (85 %; Rest Bewertungsrauschen der Tiefe 12 im Endspiel).
- Vertrauensintervalle 90 % (lokal intervalle.py, .json, .txt): Bootstrap über Partien (300×),
  Korrekturfaktoren im selben Bootstrap. Fleckfaktoren je Kategorie und Kopplungen meist eng
  (±5–20 %); Raten je Zelle (Art × Zeitklasse × Kategorie × Phase) für häufige Arten ±14–32 %,
  für seltene ±35–70 %. Breite ∝ 1/√n.
- Deshalb läuft eine zweite Sammlung (sammeln --tempi blitz,rapid,classical --je-band 360, Ziel
  dreifache Datenmenge, Bullet bleibt bei der ersten Runde), danach dauerlauf.sh (Tiefe 12),
  Neueinordnung, Flecken, Intervalle neu. Erste Runde gesichert in partien-erste-runde.jsonl.

### Spielerprofile: 90-%-Bereich der Spieler (Freigabe des Autors, 22.10.2026 abends)

- Ziel: „90 % aller Spieler einer Zelle liegen bei dieser Fehlerart zwischen X und Y“ (und
  ebenso für die Kopplungen blinder Fleck × Fehlerart). Verfahren: Beta-Binomial-Modell je Zelle
  [Zeitklasse × Kategorie × Phase × Art] über Spieler, Quantile 5/95 % der Beta-Verteilung,
  Bootstrap über Spieler; Tagesform aus der Überstreuung auf Partie-Ebene; seltene Arten mit ρ
  gemeinsam über Phasen (eigenes μ je Phase), sonst über Kategorien.
- Lichess gibt Partien je Spieler nur angemeldet heraus (keine Zugangsdaten). Deshalb
  pipeline/menschenprofil/spieler.py: Auswahl der Aktivsten aus den ersten 15 Mio. Partien
  2026-09 (je Zelle 220 Kandidaten), dann Sammeln im selben Strom (Soll 25, klassisch 12).
- Auswertung app/src/engine/spielerprofil.messung.ts (nur Züge des Spielers, bester und
  gespielter Zug, Tiefe 12, etwa 28 Stellungen/s je Prozess); lokal buch/arbeit/spielerprofil/
  lauf.sh (Runden zu 60 min, vier Prozesse), Modell betabinom.py → betabinom.json.
- Bestand (menschenprofil2, 6147 Partien) liefert weiter Mittelwerte, Kopplungen, Partie-Streuung.
- Läufe (losgelöst gestartet): Sammler (sammeln.log), lauf.sh (lauf.log), dauerlauf.sh der
  zweiten Runde (menschenprofil2/dauerlauf.log). Nach einem Neustart des Containers: Sammler mit
  gleichem Aufruf neu starten (doppelte Partien überspringt die Auswertung nicht, also vorher
  spielerpartien.jsonl sichern oder Soll anpassen), lauf.sh und dauerlauf.sh einfach neu starten.
- Kennzahlen für die spätere Elo-Abbildung (Wunsch des Autors, 22.10.2026 abends), lokal
  buch/arbeit/spielerprofil/aufbereiten.py → zuege.jsonl (je Zug) und partien.jsonl (je Partie):
  Gewinnchance vor/nach (Lichess-Formel, Werte auf ±10 wie die App), Verlust, Zuggenauigkeit,
  Lichess-Fenstergewicht, „entschieden vorher“ (≥ 90 %/≤ 10 %), „bis Entscheidung“ (Regel von
  spiel/entscheidung.ts), Klasse (ungenau 0,5 / fehler 1,2 / patzer 3 / verpasst wie
  spiel/auswertung.ts, ohne Buch, brillant, stark), Fehlerart, Flecken, Bedenk- und Restzeit,
  Stellungstyp (taktisch: Schach, Schlag/Schach/Umwandlung als bester oder gespielter Zug,
  gegnerische Materialdrohung; sonst ruhig); je Partie Genauigkeit nach Lichess über alle Züge und
  bis zur Entscheidung, Elo, Gegner-Elo, Ergebnis, Klassenzahlen.
- betabinom.py liest zuege.jsonl, FILTER=offen|alle|bis_entscheidung, Zellen auch nach Phase
  „alle“ und Stellungstyp, zusätzlich Klassen als Raten und stetige Kennzahlen je Spieler
  (Verlust, Genauigkeit; Streuung der wahren Mittel = beobachtet minus Messrauschen).
- Achtung für die Elo-Abbildung: Die Eichung der App rechnet in Tiefe 18 (Stockfish 19 lite),
  die Spielerdaten in Tiefe 12 (Stockfish 17.1). Vor dem Einsatz eine Teilmenge in Tiefe 18
  nachrechnen und die Verschiebung bestimmen.

### Gegenprobe der schnellen Auswertung (23.10.2026, Wunsch des Autors)

- Dieselbe Stichprobe (6885 Züge) schnell (bester und gespielter Zug, Tiefe 12) gegen voll
  (MultiPV 6, Tiefe 12) und gegen Tiefe 20 (lokal menschenprofil2/schnell_vergleich.py):
  Fehler gegen Tiefe 20 richtig: voll 86,6 %, schnell 85,3 % (schnell weniger Fehlalarme, mehr
  übersehene). Fehlerart bei gemeinsamen Fehlern gleich: meist 91–100 %, Schlagreflex 82 %,
  Taktik 81 %, Bauer eingestellt 82 %, König passiv 74 %. Gegnerflecken 64–91 % gleich.
- Eigene Flecken nur 45–90 % gleich: Der beste Zug ist in Tiefe 12 oft einer von mehreren fast
  gleichwertigen (gleich in beiden Methoden 65 %). Mit Abstand zum zweitbesten ≥ 0,3 ist er zu
  91 % auch der beste in Tiefe 20 (44 % der Stellungen). Deshalb seit 23.10.2026 zwei Varianten
  in spielerprofil.messung.ts (b2, w2) und Neustart aller Spielerpartien (alte Ergebnisse in
  spielerprofil/alt-einevariante); der eigene Fleck zählt in der Kopplung nur bei Abstand ≥ 0,3.
- Korrekturfaktoren schnell → Tiefe 20 je Art (lokal korrektur_schnell.json, 0,85 bis 1,43;
  alle Fehler 0,96), im Modell eingerechnet.
- betabinom.py zusätzlich: Fehler je Partie (alle, ungenau, fehler, patzer, verpasst) und
  Verlust je Fehler, je Zelle mit 90-%-Bereich der Spieler (Wunsch des Autors, 23.10.2026).

### Restplan bis zum Abschluss aller Pläne (Freigabe des Autors, 23.10.2026 abends)

Eigenes Elo je Zeitklasse = Lichess-Entsprechung (geeicht an Lichess-Wertungen); dazu „entspricht
etwa“ chess.com und FIDE über veröffentlichte Umrechnungen.

**Stand nach der Nacht zum 24.10.2026 (Fable), Zweig `menschliche-bots`, Version 0.2.125, noch
nicht auf main:** fertig 1 (Filter „offen“ und „bis zur Entscheidung“; „alle“ abgebrochen), 2
(Geraden aus 781 Partien), 3, 4, 5, 7, 8b, Teil E
Kern (Wahlmodell in der App, Tagesform und Zeitnot als Temperatur), R51 (Teil F erster Teil).
Offen: 6 (eingesperrte Figur), 8 (Bots je Kategorie neu, Neumessung mit vierfachen Kandidaten,
Ergebnisleiter, Verankerung mit dem neuen Elo-Modell; vorher Gespräch mit dem Autor zum Bot-Satz),
Rest von 9 (Bot-Raten Blitz und 60 min, drei Einstellungssätze und Wertungen je Bot), 9b
**Gruppenmodus je Bot-Kategorie** (Wunsch des Autors, 24.10.2026 nachmittags, nach den regulären
Bots und vor dem gemeinsamen Push nach main; Einzelheiten in ENTSCHEIDUNGEN „Gruppenmodus“), 10
(nach main mit grüner CI, dann P1 informieren). Offene Punkte für den Autor: AUFGABEN_AUTOR
N770–N778 und E1–E4. **Nächster Schritt:** Restplan 8 (Messung läuft), dann 9 (Rest) und 10.

**Für das kommende Update 0.2.125 verschoben (Wunsch des Autors, 24.10.2026: festhalten, was
geschoben wird):**
- Oberfläche von Teil E: Spinnennetz der drei Stilachsen, Regler eigener Gegner auf den
  menschlichen Quantilen (−2 bis 2 plus zwei unmenschliche Stufen), Menschlichkeitsanzeige,
  geschätzte Wertung eines eigenen Bots. Eigene Gegner nutzen bis dahin weiter Faktoren und den
  Regler −2 bis 2.
- Restplan 6 „eingesperrte Figur“ als Fehlerart (erst mit der nächsten Eichung des Wahlmodells).
- Maia als Grundgewicht (Versuch nach Messung und Gruppenmodus; bei Erfolg als nachladbares
  Zusatzpaket mit Schalter oder eigener Kategorie, ENTSCHEIDUNGEN „Maia“) und das tiefere
  Eröffnungsbuch aus einem ganzen Lichess-Monat.
- Zugklassen „brillant“, „stark“ und „Buchzug“ im Bullet-Diagramm: weiter geschätzt (die
  Lichess-Auswertung unterscheidet sie nicht).
- Drei Wertungen je Bot (Blitz, Schnellschach, Klassisch): erst nach der Messung je Zeitklasse.
- Neue Charaktersätze der Bots (kreative Vignetten, de und en): nach der Auswahl des Bot-Satzes.
- Die App und die Startseite nennen sich seit 0.2.125 „Beta“ (Wunsch des Autors): laufende
  Updates sind angekündigt.

**Website an den Buchstand angeglichen (24.10.2026 nachmittags, Auftrag des Autors):** Werkzeugkasten-
Absätze, Trainings- und Startseitentexte (de und en), Installationstext (kostenlos, ohne Werbung,
ohne Anmeldung), Abbildungslinks 9.8, 9.15, 9.28, 10.9, 10.14 als Verweise mit zwei dauerhaften
Tests (Nummern ohne Verweis, Verweise ohne Abbildung), Impressum „(Texte und Abbildungen)“,
Semikolons aus den Rechtstexten. Testpunkte N784–N787. Einzelheiten in ENTSCHEIDUNGEN „Website an
das Buch angeglichen“.

**Wertung und Spielstärke angepasst (24.10.2026 nachmittags, Empfehlungen vom Autor angenommen):**
Wertung je Zeitklasse (eigene Elo-Kette, Reiter, ohne neues Speicherformat), „vorläufig“ in den ersten
zehn Partien, Phasenkurve aus der Schätzung über die letzten zehn Partien statt leerer Werte je
Partie, beide Zahlen (Ergebnisse, Züge) nennen einander; Schwelle „schmal“ 400. Testpunkte N788–N791.
Offen dazu: Gegnerzahl je Zeitklasse in der Wertung, sobald die drei Zahlen je Bot gemessen sind.

**Schriftgröße in den Einstellungen (24.10.2026 nachmittags, Wunsch des Autors):** A−/A+ in
10-%-Schritten (80 bis 150 %), Merker auf dem Gerät, `--schriftfaktor` am Wurzelelement, Symbole in
symbole.css in rem. Testpunkt N792. Einzelheiten in ENTSCHEIDUNGEN „Schriftgröße“.

**Gruppenmodus gebaut (24.10.2026 nachmittags, Plan 9b):** engine/gruppe.ts, engine/gruppenwahl.ts
(gemeinsame Analyse, Wahl je Bot, bester Zug), Knopf und Hinweis unter jeder Stufe, Gesichterbild,
Sprechblase, Gratulation einmal je Gruppe, „Stärke unbekannt“ bis zum ersten Sieg und zur Messung.
Testpunkte N793–N795. Offen: Messung der Gruppen nach dem endgültigen Bot-Satz
(gruppenstaerke-daten.ts), Unterstützung „@gruppe-N“ im Messlauf.

1. Spielerprofile: Auswertung abschließen, aufbereiten.py, betabinom.py für alle drei Filter;
   Bericht an den Autor (Raten, Fehler je Partie, Verlust je Fehler, Kopplungen, Tagesform).
2. Tiefe 18: etwa 1000 Spielerpartien mit der Engine der App nachrechnen, Umrechnung der
   Kennzahlen Tiefe 12 → 18.
3. Elo-Modell je Zeitklasse und Teilmodelle je Phase; Stufenvergleich der Kennzahlen an
   zurückgelegten Spielern (je Partie, über zehn Partien), 90-%-Bereich.
4. Umrechnung chess.com/FIDE recherchieren (Quelle, Nutzungsbedingungen, je Zeitklasse).
5. App: Schalter chess.com/Lichess/Mittelweg entfernen, neue Schätzung (Konstanten), Phasenzahl
   nur bei schmalem Bereich, Texte de/en, alte Einstellung beim Lesen übergehen, Tests.
6. Teil A, Rest: Zusammenführen von Flecken und Fehlerarten entfällt (Autor, 23.10.2026: Flecken
   sind Ursachen, keine Fehlerart; die Kopplung bildet das ab). Gespeicherte vollständige Listen
   erlaubter Fehlerarten bekommen die vier neuen Arten (speicher/gegner.ts, erledigt 23.10.2026).
   Beispiele des Autors geprüft: 9… Df6 und 4. c4 zeigen keine Gabel mehr. Offen: 4. c4 (Läufer
   f4 wird mit e5 und h4 eingesperrt, Gewinn erst im 7. Halbzug) heißt jetzt „Bauernzug ohne
   Not“; Vorschlag: eingesperrte Figur erkennen (Widerlegung gewinnt die Figur innerhalb der
   ganzen Fortsetzung, die Figur hat kein sicheres Feld) und als „Figur hängen“ einordnen.
7. Teil D: erledigt (23.10.2026, ENTSCHEIDUNGEN „Spielstile der Bots“); Umsetzung in der Zugwahl mit Teil E.
8. Teil E: Bots für Schnellschach neu (Spaß 4 + 8 × 8), Fehlerraten je Phase aus den Spielerprofilen,
   Unterscheidung der Bots über die Bereiche und Kopplungen (vorher Gespräch mit dem Autor),
   Messung mit vierfachen Kandidaten (256 + 16), Ergebnisleiter, Verankerung mit dem neuen Modell.
   Dazu (Autor, 23.10.2026): tieferes Eröffnungsbuch je Elo-Band aus einem ganzen Monat der
   Lichess-Datenbank (Zugfolgen zählen, nur Rechenzeit).
8b. Bedenkzeit und Zeitnot der Bots aus den Spielerprofilen neu eichen (Teil C verlangte die
   Bedenkzeit je Zelle; das Uhrmodell beruht noch auf der ersten Sammlung), ebenso die Tagesform
   (Streuung zwischen Partien) aus dem Beta-Binomial-Modell.
9. Teil F: Blitz und 60 Minuten (eigene Raten, Feinabstimmung), drei Einstellungssätze und drei
   Wertungen je Bot, „ohne Uhr“ weg (außer ungewertet ab Buchabbildung), „besiegt“ je Zeitklasse,
   Zeitkontrolle in der Partieliste.
10. Abschluss: Dokumente, AUFGABEN_AUTOR (Tests), Version, Prüfungen, CI grün, nach main.

## P2 Brett

Zweig `p2-brett` (Opus, ab 23.10.2026, Basis `weiter-ohne-autor` mit main 0.2.117). Version und
`main` macht der Koordinations-Chat. Testpunkte N650–N669 in AUFGABEN_AUTOR.

- [x] R35 Tippen: `ui/brett/useZiehen.ts` erkennt den Tipp selbst über Zeiger-Ereignisse (bis
      0.4 Feldbreiten Rutschen; Wischen erst ab 10 statt 6 px), die Klicksperre gilt nur noch für
      den Klick desselben Tipps; `ui/brett/treffer.ts` zieht einen Tipp bis 0.25 Feldbreiten neben
      einem Zielfeld dorthin (auf eigener Figur 0.1), abgelehnt nur auf der Kante zwischen zwei
      Zielfeldern; mit gewählter Figur scrollt das Brett nicht. N650.
- [x] R36 Feldmarkierungen mit gemeinsamem Umriss: `ui/brett/umriss.ts` rechnet je Farbe die
      Randzüge der zusammenhängenden Felder (nur Kantennachbarn, Ecke an Ecke bleibt getrennt),
      `Brettmarken.tsx` zeichnet sie als einen Rahmen (Gold: Ecken an jedem Knick). Nur
      Darstellung, Buchdaten unverändert. N651.
- [x] R29 Fortschrittsbalken in der Auswertung: `Auswertungsfortschritt` in
      `komponenten/Auswertung.tsx`, Prozent daneben (`auswertung.prozent`), Text ohne Zahlen. N652.
- [x] R37 Zuganimation: `ui/brett/useZuganimation.ts` (welche Figuren gleiten, Rochade mit
      Turm, en passant, nichts beim Zurückblättern; Merker „zuganimation“, aus bei reduzierter
      Bewegung) und `Zuganimation.tsx` (Web Animations API, 220 ms, drei Nachbilder). Uhr nur
      minimal: `restzeit` zählt nichts vor `seitMs`, `mitUhrverzug` in `spiel/ablauf.ts` schiebt
      den Start der Gegenuhr um die Animationsdauer (Aufrufe in `usePartie.ts` und `botzug.ts`).
      Bekannt: Nach einem gewischten Zug bekommt die Gegenuhr den Verzug trotzdem (0,22 s,
      unschädlich). N653.
- [x] R38 Partieende auf dem Brett: `komponenten/Ergebnisblende.tsx` als `ueberlagerung` von
      Brett und Brettbereich, nur beim Übergang laufend → beendet, 0,25 s nach dem Zug, 2,8 s
      Animation (`ui/stil/brett.css`, neue Stildatei des Pakets). Karte darunter unverändert. N654.
- [x] R39 Startanimation: `komponenten/Startanimation.tsx` in `App.tsx`, Bild
      `symbole/symbol-512.png` (schon offline), 1,9 s, Tipp überspringt; nur in neuer
      Browsersitzung und höchstens einmal je Stunde (Merker `startanimation.zuletzt`), nie bei
      reduzierter Bewegung. `starteImBrowser` in den Oberflächentests schaltet sie ab
      (`startanimation: true` zum Prüfen). N655, Rückfrage P2-A.
- [x] R40 Desktop: Das Layout war schon reines CSS und wechselte live, kippte aber erst bei
      quadratischem Fenster. `ui/stil/breit.css` nimmt jetzt das Seitenverhältnis 5 : 4 als
      Grenze; Oberflächentest in `brett.spec.ts` (läuft in CI auch in WebKit). N656, P2-B.
- [x] R53 Nachtmodus: `.seitenfigur` in `ui/stil/spiel.css` steht auf einem runden Plättchen
      in der Farbe der Seite mit Rand (`--linie-stark`), in hell und dunkel geprüft. N657.

Rückfragen nach Regel 9 in AUFGABEN_AUTOR Teil 2: P2-A (wann die Startanimation kommt), P2-B
(Grenze 5 : 4 für zwei Spalten). Bekannt: `trainer.spec.ts` „Wiederholung … Strukturerkenner“
ist in der Cloud-Umgebung unter Last gelegentlich rot, auf `weiter-ohne-autor` ebenso (1–2 von
14 je Lauf), einzeln grün.

**Nächster Schritt:** Paket P2 fertig. Koordinations-Chat: Zweig `p2-brett` übernehmen,
Version erhöhen; dann Rückmeldung des Autors zu N650–N657, P2-A, P2-B.

## P6 Englisch

Paket P6 (R25, V1), Zweig `p6-englisch` (Basis `weiter-ohne-autor`, nicht auf main, keine
Versionsnummer). Auftrag: die restlichen Buchdaten (Bildunterschriften, Glossar, Übungstexte,
vorbereitete Texte, Nachschlagen) Kapitel für Kapitel ins Englische, Begriffe nach
`docs/ENGLISCH_BEGRIFFE.md`, die 27 Buchzitate wie in `en.json`. Geändert werden nur
`inhalte/en/`, `app/public/daten/en/` und die Übersetzungsschicht `pipeline/uebersetzen/`
(mit `pipeline/tests/test_uebersetzen.py`). Testpunkte nur N730–N739.

**Übersetzungsschicht (fertig):** `python -m pipeline.uebersetzen` baut aus
`app/public/daten/de/a1/` und den Tabellen `inhalte/en/a1/<datei>` die Daten
`app/public/daten/en/a1/`. Eine Teilliste (Unterschrift, Übung …) wird als ein Satz mit
Platzhaltern übersetzt (`{z1}` Zug, `{v1}` Verweis, `{s1}` Stelle, `<b>`, `<i>`, `<g1>` Begriff),
Züge, Verweise und Stellen überträgt die Schicht selbst. Die Tabellen sind nach Kennung (SHA-1 der
deutschen Vorlage) geschlüsselt und enthalten keinen deutschen Text (Regel „Öffentlich“).
Lösungszüge der Übungen und erfragte Züge der Warum-Fragen bekommen englische Buchstaben;
Kennungen, FEN, Abschnittsnummern, Werkzeugkennungen bleiben. Glossar: Verweise auf die
englischen Namen, Einträge nach englischem Alphabet. Nicht Übersetztes bleibt deutsch. Lokale
Arbeitsdateien und Prüfhilfe Deutsch/Englisch in `buch/arbeit/uebersetzung/`. Format und Ablauf:
`inhalte/en/README.md`. Der Test prüft, dass die eingecheckten englischen Daten genau zu den
Tabellen passen, gegen die Schemas gültig sind und keine Kennung verwaist ist.

**Prüfung je Kapitel:** lokal mit vorübergehend `DATENSPRACHEN = ["de", "en"]` in
`app/src/i18n/sprache.ts` (nicht eingecheckt): jede Abbildung des Kapitels, die Kapitelseite und
jede Übung mit Lösung in „English (preview)“ geöffnet, sichtbarer Text auf deutsche Wörter und
deutsche Züge durchsucht (Playwright, Skript nur lokal).

| Schritt | Stand |
| --- | --- |
| Schicht, Tests, Kapiteltitel (index.json) | fertig |
| Kapitel 0 bis 12 (mit Lernzielen und Zeilen der Gesamt-Checkliste) | fertig, jedes in der App geprüft |
| Glossar (255 Einträge, Verweise, englisches Alphabet) | fertig, in der App geprüft |
| Nachschlagen (Denkroutine, Gesamt-Checkliste, Lernziele) | fertig, in der App geprüft |

`python -m pipeline.uebersetzen --streng` meldet für alle 16 Dateien „0 Sätze offen“. Übersetzt
in Teilaufträgen je Datei mit gemeinsamer Anleitung (lokal `buch/arbeit/uebersetzung/ANLEITUNG.md`,
verbindliche Begriffe: `docs/ENGLISCH_BEGRIFFE.md`, die 255 Glossarstichwörter und die Namen und
Buchzitate aus `en.json`); Sätze, die in mehreren Kapiteln stehen, und die Stichwörter vorab
einheitlich. Testpunkte N730–N739, Rückfragen EN4 (Buchbefunde aus der Übersetzung) und EN5
(neue englische Begriffe) in `docs/AUFGABEN_AUTOR.md`.

**App eingeschaltet (Wunsch des Autors, 23.10.2026, auf P6 nachgezogen):**

1. `DATENSPRACHEN = ["de", "en"]` in `app/src/i18n/sprache.ts`; die Trainer laden über
   `trainerdatensprache()` (eigene Liste `TRAINERSPRACHEN = ["de"]`) weiter die deutschen
   Trainerdaten, bis sie übersetzt sind.
2. Stellen, die Datentexte als Schlüssel lesen, kennen auch die englischen Formen:
   `training/faktorentrainer.ts` (Zeilen „Time“, „King safety“, „Activity“, erste Spalte
   „White …“), `analyse/k2-eroeffnung.ts` (`KURZFASSUNGEN` auch unter den englischen
   Steckbriefnamen), `schach/eroeffnungsindex.ts` (Artikel „The“, allgemeine Titel „Further
   lines“, „Basic position“). In `en.json` heißt die Spanische Partie wie in den Daten „Ruy Lopez“.
3. Tests: `daten/englischeBuchdaten.test.ts` (jeder englische Steckbrief hat seine Kurzfassung,
   jede Faktorenbilanz ergibt englisch dieselbe Buchlösung wie deutsch, der Eröffnungsindex hat
   gleich viele Namen), `i18n/sprache.test.ts` (Daten- und Trainersprache), Oberflächentest
   `englisch.spec.ts` prüft eine englische Bildunterschrift.

„English (preview)“ bleibt Vorschau (Wahl nur in den Einstellungen), weil Trainerdaten,
Trainingsseiten und Bot-Namen noch deutsch sind.

**Nächster Schritt:** P6 ist fertig und eingeschaltet. Nach der Übernahme nach main die
Rückmeldung zu N730–N739 und die Antworten zu EN4/EN5 einarbeiten. Ändert der Autor Buchtext, erscheinen die geänderten Sätze
beim nächsten `python -m pipeline.uebersetzen` als offen (`buch/arbeit/uebersetzung/offen/`).
Noch deutsch und außerhalb von P6: Trainerdaten (`inhalte/de/trainer/`), Trainingsseiten der
Website (`inhalte/de/training/`), Namen der Bots.

### Eröffnungen je Elo-Band (23.10.2026 abends)

- pipeline/menschenprofil/eroeffnungen.py → lokal buch/arbeit/eroeffnungen/ (eroeffnungsbuch.json:
  Stellung → Zug → Anzahl je Zeitklasse und Kategorie der ziehenden Seite, erste 16 Halbzüge, ab
  20 Partien; eroeffnungen.json: häufigste benannte Eröffnungen je Zelle). Grundlage 83 000
  Partien ohne Bullet; je Zelle 100 bis 280 Stellungen (klassisch und 2400 dünner).
- Beispiele Schnellschach: 400 Wayward Queen 4,2 %, Van't Kruijs 4,0 %, Skandinavisch 3,4 %;
  1200 Philidor, beschleunigtes London; 2400 Damengambit Abtausch, Caro-Kann Abtausch, London,
  Najdorf. Erster Zug: 400 e4 63 % d4 20 % e3 5 %; 2400 e4 46 % d4 34 % Sf3 11 %.
- Für ein tieferes Buch später (Teil E) den Monatsstrom der Lichess-Datenbank nach Zugfolgen
  zählen (nur Rechenzeit).

### Nachtlauf 23./24.10.2026 (Fable, Freigabe des Autors)

- Läuft: Beta-Binomial (drei Filter nacheinander, kette2.sh), Tiefe-18-Abgleich (814 Spielerpartien,
  je Zelle bis 40, eine je Spieler; app/skripte/eichung-rechnen.mjs mit der Engine der App,
  Ausgabe buch/arbeit/tiefe18/bewertet-*.jsonl), Elo-Modell (buch/arbeit/spielerprofil/
  elomodell.py: Kennzahlen je Partie → partiekennzahlen.jsonl, dann Stufenvergleich je Zeitklasse
  mit Gradient Boosting, Prüfung an 20 % zurückgelegten Spielern, Teilmodelle je Phase).
- Nach einem Neustart des Containers: den Engine-Lauf (gleicher Aufruf, fortsetzbar) neu
  starten; Beta-Binomial und Elo-Modell sind fertig (Stand 7 Uhr).

### Ergebnisse der Nacht, Teil 1 (24.10.2026, 0 Uhr): Spieler-Bereiche und Elo-Modell

**Beta-Binomial, Filter „offen“ (10–90 % Gewinnchance), lokal spielerprofil/betabinom-offen.json,
bericht-offen.txt.** 6705 Zellen, 2581 Kopplungen; 3510 Zellen mit eigener Streuung, 1388 mit
zusammengefasster. Alle Fehler ≥ 0,5 je 100 Züge, Schnellschach, 5–95 % der Spieler:
400: 46,6 [37–56]; 800: 38,1 [30–47]; 1200: 31,2 [24–38]; 1600: 27,1 [22–33]; 2000: 23,2 [18–29];
2200: 18,6 [13–25]; 2400: 13,9 [7–23]. Unsicherheit der Grenzen etwa ±1. Streuung zwischen
Spielern 3,3–5,6 Punkte, Tagesform (zwischen Partien desselben Spielers) 5,3–5,8: Die Tagesform
ist so groß wie die Persönlichkeit. 1200, je Phase: Eröffnung 20 [11–31], Mittelspiel 36 [30–43],
Endspiel 30 [23–38]; Verlust je Fehler 1,2 / 1,8 / 1,7 Bauern; Fehler je Partie 1,3 / 5,9 / 5,3,
gesamt 9,3 [6,6–12,0]. Taktische und ruhige Stellungen fast gleich fehlerträchtig. Fehlerarten
1200: ungenau 13,1 [10,5–15,8], Drohung ignoriert 4,9 [2,8–7,4], Bauernzug ohne Not 3,0 [1,5–4,9],
Taktik 2,0 [1,3–2,8], Schlag verpasst 1,4, Figur hängen 1,3 [0,7–2,1], König in der Mitte 1,1
[0,2–2,7] (sehr spielerabhängig), übrige unter 1. Kopplungen je Spieler (Lift): Schlagreflex ←
Grundreihe 7,7 [5,0–10,8], Zwischenzug 6,9, Dame 4,5; Taktik ← Abzug 3,9; Bauer eingestellt ←
Diagonale 2,4; einige Bereiche entartet (ρ → 0), dort nur der Mittelwert belastbar.

**Elo-Modell (spielerprofil/elomodell.py, Gradient Boosting, Filter bis zur Entscheidung,
Prüfung an 20 % zurückgelegten Spielern), Abweichung in Elo:**

| Zeitklasse | nur Genauigkeit je Partie / Mittel über 10 | alle Kennzahlen je Partie / Mittel über 10 | Spielerebene (Kennzahlen über 10 Partien gemittelt) |
|---|---|---|---|
| Blitz | 425 / 392 | 305 / 261 | 167 (90 % unter 355) |
| Schnellschach | 366 / 328 | 262 / 200 | 131 (90 % unter 272) |
| Klassisch | 255 / 178 | 194 / 134 | 129 (90 % unter 265) |

Stufenvergleich Schnellschach je Partie: Genauigkeit 366 → + Fehler je Partie und Verlust 295 →
+ Phasen 276 → + Fehlerarten 272 → + Flecken 270 → + Schwierigkeit und Zeit 262. Fehlerarten und
Flecken verbessern die Schätzung also kaum (sie sind für die Bots wichtig, nicht für die Zahl).
Teilmodelle je Phase (Schnellschach): Eröffnung 382, Mittelspiel 321, Endspiel 470 je Partie;
Eröffnung sagt wie erwartet am wenigsten. Filter „alle Züge“ ist etwas schlechter (266 / 143).
**Verzerrung zur Mitte:** Das Modell schätzt schwache Spieler zu hoch, starke zu tief (je Partie
400: +280, 2400: −210; Spielerebene 400: +108, 2400: −80). Entzerrung über die Gerade
E[Schätzung | wahr] und Umkehrung macht die Bänder fast unverzerrt (±35) bei etwas größerer
Abweichung (139 statt 131). Vorschlag für die App: entzerrte Zahl anzeigen, Bereich aus der
Prüfung. Noch offen: Tiefe 18 (läuft), Umrechnung chess.com/FIDE, Einbau.
- **Umrechnung chess.com/FIDE (Schritt 4) recherchiert:** ChessGoals (chessgoals.com/
  rating-comparison, Stand Juli 2026, knapp 20 000 aktive Spieler mit RD < 150, Selbstangaben):
  Tabellen über die gemeinsame Spalte chess.com Blitz; halbe Breite der mittleren 50 %: FIDE ±75,
  chess.com Rapid ±115, Lichess Blitz ±70, Rapid ±90, Classical ±90 (N nur 240). Kein Wert unter
  etwa 1550 FIDE. Tabelle lokal in buch/arbeit/umrechnung/chessgoals-2026-07.json; für die App
  eine glatte Kurve anpassen (Zahlen sind Fakten, Text nicht übernehmen) und die Quelle in der
  Erklärung und in LIZENZEN nennen. Zweite Quelle (Lichess-Blog „universal rating converter
  2024“) nur hinter Cloudflare erreichbar, nicht geprüft. Lichess-Forum-Analysen (Selbstangaben):
  Lichess Blitz etwa 80–130 über FIDE, Classical etwa 170–200 über FIDE; passt zu ChessGoals.

### Ergebnisse der Nacht, Teil 2 (24.10.2026, 1 Uhr): Wahlmodell geeicht

- Bedingtes Logit an 180 000 Stellungen (lokal zugwahl/wahlmodell.py, Prüfung an 20 %
  zurückgelegten Stellungen): Trefferquote des gespielten Zuges Blitz 39,4 %, Schnellschach
  40,7 %, klassisch 41,4 % (Zufall 11–12 %). **Nachspielen:** Die erwarteten Fehlerraten des
  Modells treffen die echten je Band und Art meist auf ±1 Prozentpunkt (Schnellschach 1200: echt
  31,5, Modell 33,2; ungenau 13,4/14,2; Drohung ignoriert 4,8/5,8; Bauernzug 3,0/2,9; Taktik
  2,1/1,9). Schwächer am oberen Rand (2400: 15,1/16,0, ungenau 7,3/9,0; 2800 zu wenige Daten):
  Gewichte linear in der Wertung sättigen; Variante mit quadratischem Term läuft (wahlmodell-elo2).
- Damit steht der Kern von Teil E: Dieselbe Kandidatenerzeugung (sechs Engine-Züge, typische
  Fehlerzüge) plus diese Gewichte ergibt menschliche Raten je Band ohne Nachregeln. Noch zu tun:
  Gewichte je Phase prüfen, Tagesform/Zeitnot als Faktor, Persönlichkeit als Verschiebung
  einzelner Gewichte innerhalb der Spielerbereiche, Übertragung in engine/menschenwahl.ts.

### Ergebnisse der Nacht, Teil 3 (24.10.2026, 2 Uhr)

- **Beta-Binomial, Filter „bis zur Entscheidung“** fertig (betabinom-bis_entscheidung.json,
  bericht-bis_entscheidung.txt): Werte fast wie „offen“ (Schnellschach 1200: 31,7 [25–39], Fehler
  je Partie 10,0 [7,1–12,9]). Filter „alle Züge“ läuft.
- **Wahlmodell mit quadratischem Elo-Term** (wahlmodell-elo2): oberer Rand besser (Schnellschach
  2400 echt 15,1, Modell 15,3 statt 16,0; klassisch 9,2/10,7 statt 12,5). **Prüfung je Phase**
  (phasenpruefung.txt): Mittel- und Endspiel treffen auf 1–2 Punkte; in der **Eröffnung schätzt das
  Modell starke Spieler zu fehlerhaft** (Schnellschach 2000: echt 8,1, Modell 12,4; 2400: 4,9/9,3):
  Theoriekenntnis fehlt dem Modell. Zwei Wege, beide vorgesehen: Eröffnungsbuch je Elo-Band
  (Bots spielen Buchzüge, solange sie im Buch sind) und Gewichte je Phase (Variante
  wahlmodell-elo2-phase läuft).
- **Tiefe 18** (500 von 814 Partien): Verlust je Zug T18 ≈ 1,21 · T12, Genauigkeit ≈ T12 − 1,
  Fehlerrate ≈ 0,02 + 0,89 · T12 (Korrelation 0,90), Patzer je Zug ≈ 0,017 + 1,21 · T12 (0,066
  statt 0,041), Verlust je Fehler ≈ 1,23 · T12. Umrechnung je Kennzahl linear, gut bestimmt.
- **Wahlmodell mit Gewichten je Phase** (wahlmodell-elo2-phase, Eröffnung und Endspiel mit eigener
  Verlustkurve und eigenem Bonus „bester“): Eröffnung jetzt richtig (Schnellschach 2000: echt 8,1,
  Modell 7,6; 2400: 4,9/4,6), Mittel- und Endspiel unverändert gut, Trefferquote gleich. **Das ist
  das Modell für die App.** Lokal buch/arbeit/zugwahl/wahlmodell-elo2-phase.json.

### Ergebnisse der Nacht, Teil 4 (24.10.2026, 3 Uhr): Wahlmodell in der App

- **Wahlmodell übertragen** (Commit 475f6f0 auf `menschliche-bots`): engine/wahlmodell-daten.ts
  (64 Merkmale, Gewichte g0/g1/g2 je Zeitklasse aus wahlmodell-elo2-phase.json),
  engine/wahlmodell.ts (Merkmale, Gewichte, Softmax mit Temperatur, Zeitklasse wie Lichess),
  engine/stilmerkmale.ts (sieben Stilmerkmale wie in der Eichung), engine/wahlschritt.ts
  (Stellschrauben der Bots → Verschiebungen: Fehlerart ln g, Fleck −(g−1)·0,5, Stil ±0,25 je
  Stufe, Höchstverlust als Filter). engine/menschenwahl.ts zieht jetzt aus dem Pool
  (Engine-Kandidaten + gezielte Fehlerzüge) mit dem Wahlmodell; Fehlerwürfe je Gelegenheit und der
  Wurf auf blinde Flecken sind weg. Die Zeitklasse kommt aus der Uhr der Partie
  (ui/komponenten/botzug.ts), ohne Uhr Schnellschach. Tests 1305 grün, Chromium-E2E grün (eine
  Wiederholung: „Alle Daten löschen“ ist zeitabhängig und bestand allein).
- **Noch nicht neu gemessen:** Die Wertungen der Bots (Ergebnisleiter, Anker) gelten für die alte
  Zugwahl. Messung mit vierfachen Kandidaten und Verankerung mit dem neuen Elo-Modell folgen
  (Restplan 8).

### Ergebnisse der Nacht, Teil 5 (24.10.2026, 4 Uhr): eigenes Elo-Modell in der App (Schritt 5)

- **Additives Elo-Modell** (lokal buch/arbeit/appmodell/appmodell.py, Bericht appmodell-bis_txt):
  Kennzahlen bis zur Entscheidung auf Tiefe 18 umgerechnet, ein Modell für 1 bis 10 Partien, je
  Zeitklasse Gesamt- und drei Phasenmodelle, Entzerrung je Partienzahl, 90-%-Spanne je Partienzahl.
  Prüfung an zurückgelegten Spielern: Schnellschach je Partie MAE 284 (GBM 275), über zehn 147
  (GBM 131); Blitz 329/200; Klassisch 208/121. Einzelheiten in ENTSCHEIDUNGEN „Eigenes Elo-Modell“.
- **App umgebaut:** spiel/elomodell.ts (+ Daten), spiel/umrechnung.ts (+ Daten aus chessgoals.com),
  spiel/genauigkeit.ts (Seitenbilanz mit Kennzahlen und Wertungsschätzung, Phasen je Zug immer),
  spiel/wertung.ts (staerkeLetzterPartien je Zeitklasse mit Phasen), ui Spielstaerke.tsx ohne
  Schalter, LetzteSpielstaerke.tsx je Zeitklasse, wertungstext.ts („entspricht etwa“),
  Partienliste ohne Modus, speicher/format.ts ohne genauigkeitsmodus (beim Lesen übergangen),
  spiel/staerkemodell.ts gelöscht, botstaerke.messung.ts auf das neue Modell (ohne Phasen).
  Texte de/en neu, Tests neu (elomodell, umrechnung), E2E angepasst. AUFGABEN_AUTOR N770–N774
  und Entscheidungen E1–E4.
- **Restplan:** Schritt 1 (Filter „alle“ läuft noch), 2 (Tiefe 18: 731 von 814, Geraden aus 500
  Partien verwendet; nach Abschluss nachrechnen), 3, 4, 5 fertig; 6 offen (eingesperrte Figur);
  7 fertig; 8, 8b, 9, 10 offen.

### Ergebnisse der Nacht, Teil 6 (24.10.2026, 5 Uhr): R51 Zeitklassen und Abzeichen (Teil F, erster Teil)

- Uhrwahl nach Zeitklassen mit 60 + 0 und ohne „Ohne Uhr“ aus der Grundstellung, besiegte Bots
  je Zeitklasse (speicher/besiegt.ts, Objekt statt Liste, alte Liste → Schnellschach), Stern und
  Zähler je gewählter Zeitklasse, Bedenkzeit in der Partienliste. E2E-Namen der Uhren angepasst
  („Blitz 5 + 3“, „Schnellschach 10 + 0“). AUFGABEN_AUTOR N775–N777; ENTSCHEIDUNGEN „R51“.
- Offen in Teil F: Bot-Raten für Blitz und 60 Minuten, drei Einstellungssätze und drei Wertungen
  je Bot (nach Restplan 8).

### Ergebnisse der Nacht, Teil 7 (24.10.2026, 6 Uhr): Bedenkzeit je Zeitklasse (Restplan 8b, erster Teil)

- Bedenkzeit der Menschen je Zeitklasse × Band × Zugstufe aus den Spielerprofilen gemessen
  (buch/arbeit/bedenkzeit/eichung.py → eichung.txt); Blitz etwa doppelter Anteil der Restzeit je
  Zug gegenüber Schnellschach, Klassisch etwa die Hälfte. engine/bedenkzeit-daten.ts erzeugt,
  engine/bedenkzeit.ts mit Zeitklasse in der Bedenklage, spiel/botzeit.ts und stufen.messung.ts
  angepasst, Test ergänzt. ENTSCHEIDUNGEN „Bedenkzeit der Bots je Zeitklasse“.
- Zeitnot-Faktoren je Zeitklasse: siehe Teil 9. Damit ist 8b fertig.

### Ergebnisse der Nacht, Teil 8 (24.10.2026, 6:30 Uhr): Tagesform als Temperatur geeicht

- Temperatur des Wahlmodells gegen die Tagesform des Beta-Binomial-Modells geeicht
  (buch/arbeit/zugwahl/temperatur.py → temperatur.txt): Tagesform jetzt 0,6 bis 1,4 je Partie
  (vorher 0,75 bis 1,25), ENTSCHEIDUNGEN „Tagesform als Temperatur“. Beta-Binomial Filter „alle“
  abgebrochen (seit 03:08 kein Fortschritt im klassischen Teil, 8 GB); „offen“ und „bis zur
  Entscheidung“ liegen vor und reichen.

### Ergebnisse der Nacht, Teil 9 (24.10.2026, 7 Uhr): Zeitnot je Zeitklasse als Temperatur

- Zeitnot-Faktoren der Fehler je Zeitklasse und Gruppe aus den Spielerprofilen
  (buch/arbeit/bedenkzeit/zeitnot.py), in Temperaturfaktoren des Wahlmodells umgerechnet
  (engine/zeitnot-daten.ts, menschenprofil.ts zeitnotTemperatur, menschenwahl.ts grundfaktor).
  ENTSCHEIDUNGEN „Zeitnot der Bots als Temperatur je Zeitklasse“. E2E „Alle Daten löschen“ wartet
  jetzt bis 15 s auf die Bestätigung (unter Last zweimal in der Nacht zu knapp).

### Ergebnisse der Nacht, Teil 10 (24.10.2026, 8:30 Uhr): Tiefe-18-Abgleich abgeschlossen

- 781 Partien im Abgleich (790 von 814 bewertet, der letzte Lauf lief noch aus): Geraden fast
  unverändert (Verlust ×1,207, Genauigkeit −3,6 + 1,03·x, Fehlerrate 0,019 + 0,911·x, Patzer
  0,017 + 1,197·x, Züge bis Entscheidung 0,43 + 0,895·x). Elo-Modell neu erzeugt (die Güte ist von
  der linearen Umrechnung unabhängig; nur die Stützstellen in spiel/elomodell-daten.ts rückten
  etwas). Restplan 2 damit fertig.

### 24.10.2026 vormittags (Fable): main 0.2.123 eingemischt, Wünsche des Autors

- main 0.2.123 eingemischt (Commit 72203f1), Version 0.2.125: Spielstärke-Karte von P1 (Ring,
  Balken) ohne Schalter, Uhrwahl in ui/komponenten/uhrwahl.ts mit unseren Regeln, P1s
  Zeitangabe in der Partienliste, P1s spiel/zeitklasse.ts bleibt neben spiel/elomodell.ts
  (Wertung kennt nur drei Klassen; Bullet zählt dort als Blitz, wird nicht angeboten).
- Aufgabe von P1 erledigt: spiel/zugklassenvergleich.ts mit Werten aus den Spielerprofilen
  (Median, Zonen aus den 5/95-%-Quantilen der Spieler plus Zufall der Partie).
- Wünsche des Autors: Partiekopf mit Porträt und Bot-Satz im Untertitel, Startbild bei der
  Rückkehr aus dem Hintergrund (Handy, ab 30 Minuten, 1,8 s). AUFGABEN_AUTOR N779–N781.
- Restplan 8, erster Teil: Persönlichkeiten der Bots als Stufen auf menschlichen Quantilen
  (engine/spielerbereiche.ts), je Bot einer der sieben Stile (engine/stile.ts, Tabelle Teil D),
  Faktoren entstehen beim Spielen aus der Wertung des Bots. ENTSCHEIDUNGEN „Persönlichkeiten der
  Bots auf menschlichen Quantilen“.
- **Neumessung läuft** (24.10.2026 ab 9:50 Uhr): buch/arbeit/botelo4/lauf.sh im eingefrorenen
  Stand /home/user/messstand3 (git worktree auf 3fcce77, native Stockfish): Bots gegen Stufen
  (bots-paarungen.txt, 12 Partien), Stufen mit Zusatzfehlern gegen Stufen (1m-1 … 10m-10, 20),
  Spaß-Bots, dann Uhr je Zeitklasse (180+2, 600+0, 1800+20 je Stufe 1 bis 8, 20 Partien).
  Leiter und Anker der Grundschicht aus botelo3 kopiert (unverändert). Nach einem Neustart des
  Containers: `git worktree add -f --detach /home/user/messstand3 94ae97e`, node_modules
  verknüpfen, lauf.sh neu starten (fertige Paarungen überspringt messe-stufen.mjs nicht; dann die
  fertigen aus der Liste nehmen). Danach: `BOTELO_ORDNER=../buch/arbeit/botelo4 npx vitest run
  --config vitest.messung.config.ts src/engine/botstaerke.messung.ts` → botstaerke-daten.ts
  (Anker mit dem neuen Elo-Modell), Uhrabzug je Zeitklasse eintragen.
- **Zweiter Lauf umgestellt** (botelo4/lauf2.sh, 24.10. mittags): Bots gegen reine Stufen waren
  gesättigt (alle 12:12; ENTSCHEIDUNGEN „Messung der Bots gegen menschlich spielende Stufen“);
  jetzt Anker 1m-1m … 10m-10m (40 Partien, Tiefe 18), dann die 64 Bots (bots-paarungen-m.txt,
  12 Partien) und die 240 Kandidaten (kandidaten-paarungen-m.txt, 10) je gegen zwei Nm-Stufen.
- **Zweiter Lauf, erste Fassung** (botelo4/lauf2.sh, Stand 869cb36): Befund: Das Elo-Modell gilt nur
  für menschliches Spiel; die reinen Grundschichten (anker-s0 aus botelo3) bewertet es unplausibel
  (1x1 → 879, 4x0.2 → 700). Deshalb neue Anker an den Stufen mit Zusatzfehlern (1m-1m … 8m-8m,
  40 Partien, Ordner anker-s9), Bewertung in Tiefe 18 mit der Engine der App
  (anker-bewertung, eichung-rechnen --quellen stufen), parallel dazu die 240 Kandidaten
  (engine/botkandidaten.ts, kandidaten-paarungen.txt, je zwei Nachbarstufen, 12 Partien).
  Danach: botstaerke.messung → botstaerke-daten.ts und botkandidaten-daten.ts (beide nach
  engine/), Auswahl je Gruppe mit Alternativen in AUFGABEN_AUTOR, neue Charaktersätze
  (Wunsch des Autors: kreative Vignetten statt Aufzählung der Einstellungen, de und en).

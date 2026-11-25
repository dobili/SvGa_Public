# CLAUDE.md – Arbeitsregeln für dieses Repository

Diese Datei liest jede Sitzung zuerst. Danach `docs/FORTSCHRITT.md` lesen und genau dort weitermachen.

## ⚠ Verbot

Das Repository `garnas/einrad.hockey` gehört nicht dem Autor. Es wird unter keinen Umständen
angeschaut, geklont, an eine Sitzung gehängt oder verändert. Für diese App gibt es ausschließlich
`dobili/SvGa_Public` (öffentlich, seit 16.10.2026) und die privaten Buchquellen
`dobili/schachbuch-quellen`. Das frühere private Repository mit der ganzen Arbeitsgeschichte bleibt
als Archiv; dorthin wird nichts mehr gepusht, und nichts aus seiner Geschichte kommt hierher.

## Ziel der App

Die App begleitet das Buch „Schach von Grund auf – Ein Handbuch für Einsteiger und leicht
Fortgeschrittene“ (Kapitel 0 bis 12, Einsteiger bis etwa 2000 Elo). Sie zeigt jede Abbildung des
Buches als lebendiges Brett, wendet die Werkzeuge des Buches automatisch an und trainiert mit
Aufgaben, Wiederholung und einer Engine auf acht Stufen. Sie läuft als Progressive Web App unter
schach-von-grund-auf.com, nach der Installation vollständig offline.

Grundlagen (Claude Docs, nur lesen):

- Pflichtenheft: https://claude.ai/code/artifact/1955fac6-aa03-4618-badb-a66ea9573317
- Technisches Konzept: https://claude.ai/code/artifact/edd39725-5d7d-49cd-b1a6-2878e64abe86
- Bildschirmentwürfe: https://claude.ai/artifact/WHJfmWo59UrnDRQnkLnaBu
- Kurzfassung im Repository: `docs/ARCHITEKTUR.md`, Entscheidungen: `docs/ENTSCHEIDUNGEN.md`

## Feste Regeln

1. **Das Buch ist die einzige Quelle.** FEN, Pfeile, Feldmarkierungen und Bildunterschriften kommen
   aus dem LaTeX. Nie stillschweigend ändern: Abweichungen und Fehler werden als Befund an den
   Autor gemeldet (Bericht der Pipeline).
2. **Buchquellen nie ins Repository.** Die LaTeX-Dateien liegen nur lokal in `buch/a1/`
   (in `.gitignore`). Sie kommen aus dem privaten Repository `dobili/schachbuch-quellen`:
   zu Beginn einer Sitzung `git clone https://github.com/dobili/schachbuch-quellen buch/a1`
   (oder `git -C buch/a1 pull`). Ins Repository kommen nur die erzeugten App-Daten.
   Grund: Das Repository wird wegen der GPL öffentlich, der Buchtext ist urheberrechtlich geschützt.
3. **Kommentare auf Deutsch**, Regeln aus Konzept Abschnitt 12: Dateikopf in jeder Datei, jede
   öffentliche Funktion mit Zweck, Warum, Eingaben, Ausgabe, Beispiel aus dem Buch, Sonderfällen.
   Jede Schachregel mit Buchbezug („Regel: Kapitel 1, Zählen von Angreifern und Verteidigern“).
4. **Code:** sprechende Namen, Fachbegriffe wie im Buch ohne Umlaute, Funktionen möglichst unter
   40 Zeilen, Dateien unter 400 Zeilen, keine nackten Zahlen, kein `any`, keine verschluckten Fehler.
5. **Tests vor jedem Speichern.** Jeder gespeicherte Stand ist lauffähig und besteht alle Tests.
6. **Alles auf Deutsch:** Oberflächentexte (über `src/i18n/de.json`), Kommentare, Commit-Texte mit
   dem Warum.
7. **Keine Zugangsdaten** im Chat oder im Repository. Verknüpfungen bestätigt der Autor selbst.
8. **Eine Datei für den Autor:** Alles, was der Autor testen oder entscheiden soll, steht
   vollständig in `docs/AUFGABEN_AUTOR.md` (Teil 1 Tests, Teil 2 Rückfragen), mit allen nötigen
   Informationen im Text, ohne Verweise auf andere Dateien, und nur Offenes (Wunsch des Autors,
   17.10.2026: Er liest auf dem Handy). Erledigtes wird dort gelöscht und in
   `docs/ENTSCHEIDUNGEN.md` festgehalten. Eine eigene Testanleitung gibt es nicht mehr. Die App
   zeigt die Datei als Aufgabenseite (drei Sekunden auf das Zahnrad, seit 0.2.75) und liest dafür
   die Punkte im Format „- [ ] N307. Text“ mit eingerückten Folgezeilen: Dieses Format bleibt.
   Der Autor schickt seinen Stand als Text („N306 ok“, „N305: Notiz“); den einarbeiten wie
   jede Antwort.
9. **Empfehlungen gleich umsetzen** (Wunsch des Autors, 17.10.2026 nachmittags, auch an Opus):
   Zu jeder Rückfrage eine fundierte Empfehlung erarbeiten, sie in `docs/AUFGABEN_AUTOR.md`
   festhalten und dann sofort umsetzen („Schon umgesetzt in …, Widerspruch genügt“). Widerspricht
   der Autor später, wird es zurückgebaut. Nur warten, wenn Umsetzen und späterer Rückbau
   verwickelte Probleme machen könnten (etwa Datenformate im Speicher der Leser, Löschen von
   Buchdaten, Veröffentlichung). Ausnahme für die Beta (Wunsch des Autors, 6.11.2026): Solange es
   keine echten Leser gibt, darf das Speicherformat jederzeit geändert werden, wenn es sinnvoll
   ist, auch wenn dabei Speicherstände verloren gehen; dafür nicht mehr fragen. Ergänzung (Wunsch des Autors, 17.10.2026 nachts): Texte, die der
   Autor absegnen soll (Entwürfe von Erklärungen, Fragen, Sätzen in der App), gelten vorerst als
   abgesegnet und kommen in die App; er liest sie später. Buchbefunde (Fehler oder Widersprüche
   im Buch) bleiben Rückfragen, weil nur er das Buch ändert.

## Aufbau

| Ordner        | Inhalt                                                                                         |
| ------------- | ---------------------------------------------------------------------------------------------- |
| `app/`        | TypeScript-App (React 19, Vite, vite-plugin-pwa, chessops)                                     |
| `pipeline/`   | Python-Pipeline: LaTeX lesen, prüfen, Daten bauen                                              |
| `schemas/`    | JSON-Schemas, Vertrag zwischen Pipeline und App                                                |
| `inhalte/de/` | Zugfolgen als PGN (Entwürfe der Pipeline, Freigabe durch den Autor), später Texte              |
| `docs/`       | Architektur, Entscheidungen, Fortschritt, Aufgaben des Autors (Tests und Rückfragen), Lizenzen |
| `buch/a1/`    | nur lokal, nie committen (siehe Regel 2)                                                       |

## Befehle

```bash
# App (im Ordner app/)
npm ci                 # Abhängigkeiten
npm run dev            # lokal starten
npm run pruefen        # Typen, Stil, Komponententests (Vitest, auch mit echter Engine)
npm run test:e2e       # Playwright (Chromium und WebKit)
npm run build          # Auslieferung nach app/dist/
WEGSPERRE=S17 WEGSPERRE_E=1200 npx vitest run --config vitest.messung.config.ts src/abenteuer/wegsperren.messung.ts   # Messlauf Wegsperre (S15 bis S17) oder jeder kurzen Begegnung (WEGSPERRE=summitCity.sol) gegen einen Bot in Lesestärke 800, 1200 oder 1600; Ergebnis nach buch/arbeit/wegsperren/ (nie zwei Läufe zugleich)
BESPRECHUNG_HTML=DATEI npx vitest run --config vitest.messung.config.ts src/abenteuer/besprechung.messung.ts   # Messlauf Partiebesprechung: 40 Besprechungen echter Partien (Stockfish, Stufen 1 bis 3, alle Stimmen) nach buch/arbeit/besprechung/, mit BESPRECHUNG_HTML eine Seite mit Brett und Satz je Moment (nur lokal)

# Pipeline (im Hauptordner)
python -m pipeline.bauen --buch buch/a1 --ziel app/public/daten/de/a1   # alle Kapitel, Glossar, PGN-Entwürfe, Bericht
python -m pipeline.bauen --buch buch/a1 --ziel app/public/daten/de/a1 --zugzeichen   # dazu Engine-Prüfung
python -m pipeline.bauen ... --mit-entwuerfen   # PGN-Entwürfe als „Entwurf“ in die App (bis AP 17, nach Wunsch des Autors)
python -m pipeline.bauen ... --text-entwuerfe   # nur Entwürfe der vorbereiteten Texte (AP 14) in die App, zur Durchsicht
python -m pytest pipeline/tests
python -m pipeline.pruefen.daten app/public/daten/de/a1   # Daten gegen Schemas, ohne Buchquellen
python -m pipeline.wartung   # Wartungsprüfungen des Dashboards (R57): Live-Seite, Links, CI, Abhängigkeiten; läuft wöchentlich in Actions
python -m pipeline.eroeffnungsliste   # Eröffnungsnamen von Lichess (inhalte/lichess) für das Werkzeug „Eröffnung“
python -m pipeline.zugfolgen.konstruieren --engine PFAD   # konstruierte Partien zu Abbildungen ohne Zugfolge (schnelle UCI-Engine, nur lokal)
python -m pipeline.pruefen.tablebase   # Endspielabbildungen bis 7 Steine gegen die Lichess-Tablebase (Netz, Zwischenspeicher in buch/arbeit)
python -m pipeline.praxisbuch.baender app/public/daten/eroeffnungsbaender.json buch/arbeit/praxisbuch/voll.tsv buch/arbeit/praxisbuch/voll2.tsv   # Eröffnungen je Elo-Band (Zählungen nur lokal)
python -m pipeline.abenteuer.weltpuzzle --bild /tmp/welt.png   # Schach-Abenteuer: Außenkarten über ihre Zugänge aneinanderlegen (Überlappungen, offene Ringe, Randbrüche); --ort KENNUNG grenzt ein
python -m pipeline.abenteuer.weltkarte PRIVAT ZIEL --orte mapleFalls,cedarCreek   # Weltkarte: Kartenbilder, daten.json und weltkarte.html mit Ausgängen und Reisen (nichts ins private Paket)
python -m pipeline.abenteuer.portraetblatt EINGABE.png AUSGABE.png --raster 3x2   # Porträtblatt aus einem Gemini-Blatt (grüner Grund): Felder, Pixelraster, 3×2 à 64
python -m pipeline.abenteuer.brettbilder BRETT.png FIGURENBLATT.png --stil schiefer PRIVAT   # Gemini-Brett und -Figurensatz zuschneiden, prüfen, nach spiel/brett/<stil>/ legen ("-" für einen fehlenden Teil)
python -m pipeline.abenteuer.uebergangsbilder [--ort KENNUNG] [--boegen ORDNER --privat PRIVAT]   # Übergangsbilder prüfen (Regel 10.77), Kontaktbögen beider Seiten
python -m pipeline.abenteuer.ausrichtung [--ort KENNUNG] [--bilder ORDNER --privat PRIVAT]   # Ausrichtung der Bilder und Bauteile (Regel 10.78)
python -m pipeline.abenteuer.sprache [--woerterbuch]   # Sprachprüfung der Spieltexte (Zeichen, Anrede, Namen; Wörterbuch braucht pyspellchecker)
python -m pipeline.abenteuer.inkbesuche [--alle]   # Besuchszähler in Ink-Bedingungen, die einen früheren Dialog voraussetzen (die App beginnt jeden Dialog neu; dafür VAR nehmen)
python -m pipeline.abenteuer.naechsterschritt [--alle]   # nennt der Dialog nach jedem Questschritt das nächste Ziel (Person oder Ort)? Ausnahmen im Werkzeug, Bericht docs/spiel/auftraege/naechster_schritt_19-11.md
python -m pipeline.abenteuer.erzaehlzeit [--alle]   # Erzählzeilen im Gespräch mit einer Figur, die vom Weg erzählen (Treppe, Tür, Ankommen): an den Eingang der Karte verlegen oder als passend eintragen; Bericht docs/spiel/auftraege/erzaehlzeit_19-11.md
python -m pipeline.abenteuer.figurenort [--alle]   # Kartenbelegung gegen Dialoge: Figur steht nicht an dem Ort, den ihr Dialog erzählt, oder steht nach Abschied/Aufbruch noch da; beheben oder in figurenort_geprueft.py mit Grund; Bericht docs/spiel/auftraege/figurenort_19-11.md
python -m pipeline.abenteuer.sprecherort [--alle]   # Dialog gegen Haltung und Ort der Sprechenden: Schlaf ohne Bett (#stelle), Figur kommt ohne #gehe, sitzt im Text/steht auf der Karte, ruft von unten und steht daneben; beheben oder in sprecherort_geprueft.py (GEPRUEFT passt, GEMELDET Kartenbefund); Bericht docs/spiel/auftraege/sprecherort_20-11.md
node pipeline/abenteuer/inkuebersetzung.cjs [--ordner ORDNER]   # alle Ink-Dateien übersetzen, Fehler mit Datei und Zeile (läuft auch als pytest-Dauertest)
node pipeline/abenteuer/lesefassung.cjs --ziel DATEI.md [--akte]   # Lesefassung: ganzer Spielverlauf als Lesetext aus der Gesamtsimulation (Sprecher, Ort, Questschritt, gewählte Antwort)
node pipeline/abenteuer/ambrose-danach.cjs [--startwert 1] [--spieler gruendlich,eilig,launisch] [--hinweise] [--abdeckung]   # Ambrose nach dem Abschied (Q21-5): spielt bis nach dem Abschied, geht die Welt ab, meldet jede Zeile, Partie und jeden Moment von ihm („0 Funde“; pytest mit ABENTEUER_SIMULATION=1)
node pipeline/abenteuer/rueckmeldung.cjs [--startwerte 1,2,3]   # Rückmeldung nach dem Ergebnis: Jede Partie, Runde, jedes Rätsel, Simultan und jede Gedächtnisstellung aus Ink bekommt danach eine Reaktion, die das Ergebnis aufgreift und nicht ohne Wahl neu startet („0 Funde“; pytest mit ABENTEUER_SIMULATION=1)
node pipeline/abenteuer/pfeilziel.cjs [--startwert 1] [--zeige]   # Hauptpfeil: Bringt das Pfeilziel jedes Hauptquestschritts den Schritt voran oder schickt es nur weiter? Spricht es mit dem Stand der Gesamtsimulation an; Abhilfe: `umwege` in quests.json („0 Funde“; pytest mit ABENTEUER_SIMULATION=1)
python -m pipeline.wiki --zeigen   # Seiten beider Wikis im Dashboard (Paket D): „app“ (Schach-App) und „spiel“ (Schach-Abenteuer, pipeline/wiki_spiel.py aus docs/spiel/, Codeführer in docs/spiel/codefuehrer/); --senden schickt sie (nur in Actions mit BERICHT_SCHLUESSEL)
python -m pipeline.abenteuer.editorpaket PRIVAT PRIVAT/editor   # Karteneditor-Paket (Seite + daten.js mit Szenen, Bildern, Kacheln) fürs private Repo; Anleitung docs/spiel/KARTENEDITOR.md
python -m pipeline.abenteuer.editorrueck PRIVAT/editor/rueck/DATEI.json --privat PRIVAT   # Änderungen des Editors zurück in die Szenen, Bericht und Vorschauen nach buch/arbeit/editor/, Kartenbau
python -m pipeline.abenteuer.proportionen [--alle] [--messen PRIVAT]   # Möbel im Maß der Figur (Regel 10.93): Bildhöhe je Art gegen die Figur (außen 20, innen 26⅔ px), Befunde mit vorgeschlagenem Maßstab; Dauertest „0 Befunde“, Ausnahmen mit Grund im Werkzeug
python -m pipeline.abenteuer.proportionen [--alle]   # dazu seit AP8a: Außenteile (Bäume, Zäune, Büsche, AUSSEN_BAENDER) und „unscharf“ (Maßstab unter 0,7)
python -m pipeline.abenteuer.kronenhoehe [--alle]   # Innenräume: Objekt ragt in die weiße Mauerkrone über einer Nordwand (deckende Bildränder aus deckrahmen.json); Dauertest 0
python -m pipeline.abenteuer.deckrahmen PRIVAT   # deckende Bildränder je Katalogeintrag nach katalog_korrekturen/deckrahmen.json (braucht Pillow; Grundlage für kronenhoehe, untergrund, proportionen)
python -m pipeline.abenteuer.waldrand [--alle]   # Außenkarten: Rasen mehr als 10 Felder offen bis an den Bildrand ohne Baum, Hecke, Feld, Wasser; Feld endet 1 bis 2 Felder vor dem Rand statt bis an ihn (Regel 6.3: Felder reichen bis zum Rand)
python -m pipeline.abenteuer.wiederholung [--alle]   # gleiches Gebäude mehr als 2-mal oder 2-mal in einer Reihe, Kleinteil mehr als 3-mal in Sichtweite (12×8), Blickfänger (Teppich, Rundtisch, Schulstuhl) in mehr als 2 Karten eines Orts
python -m pipeline.abenteuer.jahreszeit   # Jahreszeit je Außenkarte (RO53.5): Pflichtkarten im Süden winter_mild, Schnee nur Norden und Berge, kein Sprung Schnee–Sommer an Kartengrenzen zu Fuß
python -m pipeline.abenteuer.untergrund [--alle] [--messen PRIVAT]   # Katalogfeld „untergrund“ (Fuß auf Gras oder Wasser gezeichnet) gegen den Boden unter dem Fuß; --messen setzt das Feld aus den Bildfarben
python -m pipeline.abenteuer.zusammenhang [--alle]   # Gleise enden nur am Rand, Prellbock, Bahnhof oder Tunnel; Wege enden direkt an Tür oder Tor (zusammenhang_enden.py)
python -m pipeline.abenteuer.bodenflaeche [--privat PRIVAT] [--alle] [SZENE …]   # Kein Boden zeigt das Kachelraster (Kartenblick M01): gemessen am gezeichneten Hintergrund (Bretterverband, Streuung); Dauertest „0 Befunde“ mit SVGA_PRIVAT
python -m pipeline.abenteuer.uferart [--alle] [--muster M]   # Ufer nach Nachbarboden (Holz ohne Rand, Pflaster mit Kaimauer, Sand mit Saum); Dauertest „0 Befunde“
python -m pipeline.abenteuer.treppenrand [--hinweise] [--muster M]   # Ufer und Wegränder ohne Kacheltreppen und Pfeilspitzen, Stichwege enden gerade an Tür und Tor; Dauertest „0 Befunde“
python -m pipeline.abenteuer.klippenband [--alle] [--muster M]   # Klippen als Gelände (Band, Seitenwand, Fuß nach Boden, Böschung/Stützmauer); offene Liste OFFEN für die Szenen, schrumpft nur
python -m pipeline.abenteuer.statistenrolle [--alle] [--privat PRIVAT] [--probe]   # Statistenbild nach Rolle (statistenrollen.json, gleiche Wahl in App und Vorschau), Bauhelm nur bei Bauarbeit; Dauertest „0 Befunde“
python -m pipeline.abenteuer.tunplatz [--muster MUSTER] [--bericht DATEI]   # Statisten, deren `tun` Sitzen sagt, ohne Eigenschaft `sitzt`; Obergrenze schrumpft nur
# Querschnitt AP8a: Obergrenzen je Prüfung in pipeline/tests/test_abenteuer_querschnitt.py, dürfen nur sinken (Ziel 0)
python -m pipeline.abenteuer.proportionsvergleich PRIVAT ZIEL   # Vergleichsseite Figurengröße für den Autor (Varianten A bis D an 8 Stellen, Zahlen); enthält Paketbilder, nie ins öffentliche Repo
python -m pipeline.abenteuer.figurstil PRIVAT/spiel/figuren-neu buch/arbeit/figurstil [--limezu PRIVAT/spiel/figuren]   # Figurstil chibi oder realistisch (Kopfanteil von Hand in GEMESSEN, Kontur, Sättigung): Kontaktbogen, Tabelle, Lineal-Bild für neue Figuren, dazu plan.html/plan.md: Neubau im Stil des Coachs (Vergleich, Alter und Höhe, Animationen je Figur, Reihenfolge, fertige Prompts; Ziel Kopfanteil 0,45 bis 0,50)
python -m pipeline.abenteuer.heldneutral   # Held oder Heldin: Pronomen nach {held}, Anreden und Bezeichnungen mit Geschlecht in Ink und Spieltexten; Dauertest „0 Befunde“, Ausnahmen mit Grund im Werkzeug
python -m pipeline.abenteuer.rivalneutral   # Rivale Victor oder Rivalin Victoria: kein festes „Victor“, keine Pronomen nach {rivale}, Platzhalter erklärt (Story-Bibel 5.2a); Dauertest „0 Befunde“; Simulation der Rivalin-Fassung mit ABENTEUER_RIVALIN=1
python -m pipeline.abenteuer.uhrstellen   # Spieluhr: Erzählzeilen mit Tageszeit und #licht:abend|nacht|tag ohne #uhr (Ink-Tag stellt die Uhr); Ausnahmen mit Grund im Werkzeug, Dauertest „0 Befunde“
python -m pipeline.abenteuer.brettbeispiel [--liste] [--bericht DATEI]   # Brettbeispiele im Dialog: Erklärstellen (Glossarbegriffe, Erklärmuster) mit #brett oder Grund (brettbeispiel_ohne.py), Beispiele schachlich geprüft (python-chess); Dauertest „0 Befunde“
python -m pipeline.abenteuer.geraeuschquellen [--ort KENNUNG] [--alle] [--schreiben] [--bild DATEI]   # Quellen des Dauergeräuschs je Karte (Wasser, Wasserfall, Brunnen …), Vorschau mit Ringen; der Kartenbau schreibt sie als Eigenschaft in die Karte
python -m pipeline.abenteuer.ton.raumprobe TONORDNER ZIEL   # Hörprobe räumliche Geräusche (Park Maple Falls, vorher/nachher): Video, Seite mit Pegelkurve, Pegelprotokoll; nur lokal
python -m pipeline.abenteuer.raumgroesse   # Innenräume gegen ihr Gebäude außen (Regel 10.75, R065), Bericht nach docs/spiel/auftraege/rueckmeldung/
python -m pipeline.abenteuer.blickrichtung   # Blickrichtung stehender Figuren zu Tresen, Brett, Gesprächspartner (R008)
python -m pipeline.abenteuer.ton.lautheit DATEI_ODER_ORDNER …   # gleichmäßige Lautheit der Musik (Klangplan A0.6): LUFS, LRA, Ausreißer mit Zeitpunkt, Spitze, Naht der Schleife; Einmal-Stücke nach einmal.json (braucht numpy, scipy, ffmpeg)
python -m pipeline.abenteuer.ton.ortsthemenprobe PRIVAT   # Probestück einprägsame Ortsthemen (A0) mit Spuren und Lautheitskurven nach PRIVAT/hoerprobe/ortsthemen/ (Proben über musikbau --laden)
python -m pipeline.abenteuer.ton.hoerseite PRIVAT --akt N [--sichere-alt]   # Hörseite für den Autor mit allen neuen Stücken eines Akts (Spuren, Mischpult, Lautheit) nach PRIVAT/hoerprobe/aktN/; --sichere-alt vor dem Musikbau kopiert die bisherigen Fassungen
python -m pipeline.abenteuer.pixellabimport PRIVAT [--nur NAME …]   # PixelLab-Sammelexporte (ki-roh/selected_characters*.zip, Zuordnung ki-roh/zuordnung_23-11.json) nach spiel/figuren-neu/<name>/: 4 Richtungen, Gehen/Rennen vom Zustand, an dem sie hängen, Standbild nach pixellabtabelle.py, Zustände Stuhl/Boden/Schlaf, alte statist-NN als Kopie ihres Typs; Bericht buch/arbeit/pixellab/import.md
python -m pipeline.abenteuer.pixellabhoehen PRIVAT   # sichtbare Höhe je Figur und Höhenfaktor auf die Zielhöhe der Altersgruppe (Erwachsene 30,5, Alte 29,5, Jugendliche 27,5, Kinder 22; höchstens ×1,1) nach app/src/abenteuer/oberwelt/figurhoehen.json (braucht Pillow)
(cd app && node skripte/figurenboegen-ordner.mjs PRIVAT/spiel/figuren-neu ZIEL) && python -m pipeline.abenteuer.pixellabuebersicht ZIEL buch/arbeit/pixellab   # Bögen als PNG und Übersichtsseite aller Figuren für den Autor (Standbilder, Gehen und Rennen als Film, Zustände, Faktor)
python -m pipeline.abenteuer.pixellab_tiere PRIVAT [--tierarten]   # PixelLab-Tiere: Bögen aus ki-roh/selected_characters*.zip nach spiel/tiere/<art>.png (Wahl der Zustände mit Grund in pixellab_tierwahl.py, Wasser auf unsere Palette in pixellab_wasser.py); --tierarten schreibt Maße und Maßstab nach tierarten.json (danach prettier)
python -m pipeline.abenteuer.pixellab_tierseite PRIVAT buch/arbeit/tiere/pixellab   # Übersichtsseite aller PixelLab-Tiere: Standbilder, Bewegung als Filmstreifen, Zustände, Wasser vorher/nachher (nur lokal)
python -m pipeline.abenteuer.pixellab_tierfotos stellen ORDNER && (cd app && PROBE_STAND=DATEI.json TIERFOTO_LISTE=ORDNER/stellen.json TIERFOTO_ORDNER=ORDNER CHROMIUM_PFAD=… npx playwright test --config playwright.durchlauf.config.ts tierfoto) && python -m pipeline.abenteuer.pixellab_tierfotos seite ORDNER   # Tierfotos im Spiel: je Art eine Stelle (Uhr nach „wann“), Vergleiche kleine Tiere 6/8 px und Hund 9/13 px, Seite ORDNER/index.html (Paketbilder, nur lokal oder privat); nach npm run build, Stand aus aktstand.cjs --akt 4; einzeln: TIERFOTO_STELLE="karte,x,y,name" mit TIERFOTO_ABSTAND, TIERFOTO_STUNDE, TIERFOTO_SERIE, TIERFOTO_BEWEGT=1
python -m pipeline.abenteuer.verdeckung [--bericht DATEI]   # Vordergrund über Sitzenden und Liegenden (vordergrund.ts): alle Sitz- und Liegestellen aus Szenen, Tagesabläufen und Ink mit Möbel und Art; Befund ohne Sitzart oder Bett mit Kopfseite (Name oder Katalog `ende`); Dauertest „0 Befunde“, Ausnahmen mit Grund im Werkzeug
(cd app && VERDECKUNG_STELLEN=STELLEN.json VERDECKUNG_STAENDE=ORDNER VERDECKUNG_ORDNER=../buch/arbeit/verdeckung/fotos/vorher CHROMIUM_PFAD=… npx playwright test --config playwright.durchlauf.config.ts verdeckungsfoto)   # Verdeckungsfotos im Spiel: je Stelle {karte,x,y,stunde,stand,datei} Stand (akt2/akt3/akt4/ende.json aus aktstand.cjs), Uhr, Held auf freiem Feld daneben, Foto ganz und Ausschnitt (nach npm run build mit ABENTEUER_PRIVAT; Fotos nur lokal)
python -m pipeline.abenteuer.fussmatte [--messen PRIVAT] [--beheben]   # Fußmatten perspektivisch direkt hinter der Tür (Notiz des Autors 20.11.2026): sichtbare Unterkante 6 px (±1) unter der Türoberkante, ebene -2; Ränder in fussmatte_masse.json (--messen braucht Pillow und das Paket), --beheben setzt Versatz und Ebene; Dauertest „0 Befunde“, Ausnahmen mit Grund im Werkzeug
python -m pipeline.abenteuer.figurenzustaende [--privat PRIVAT]   # welche Figur welche PixelLab-Zustände braucht (Stuhl, Boden, Liegen) aus Szenen, Tagesabläufen und Ink; mit --privat PRIVAT/spiel zusätzlich: was fehlt (Seite fehlende.html für den Autor, häufigstes zuerst, mit Wortlaut für PixelLab), app/src/abenteuer/regeln/ohnesitzbild.json (Tagesablauf: ohne Stuhlbild neben dem Stuhl stehen), Dauertest gegen WARTET_AUF_BILD; Liste und Seite mit Vorschaubildern nach buch/arbeit/zustaende/ (Ablage der Zustände: docs/spiel/24_Figuren_und_Portraets.md, Punkt 6)
python -m pipeline.abenteuer.schildsprache [--privat PRIVAT]   # Sprache der Schilder (RO53.6): Namen englisch, Hinweise deutsch; jede Aufschrift aus schildbild.py und PRIVAT/werkzeuge/*.py in NAMEN, HINWEISE oder KEIN_TEXT eingeordnet; Dauertest „0 Befunde“
python -m pipeline.abenteuer.blickpunkte   # Blickpunkte (ambrose_blickpunkte.json): Eintrag und Knoten in ambrose-blick.ink paarweise, Feld auf der Karte, erreichbares Feld im Radius, nicht im Eingang der Karte; Dauertest „0 Befunde“
python -m pipeline.abenteuer.kopfkachel [--alle]   # Kacheln über Figuren, die begehbar wurden (Figuren sperren seit 18.11.2026 nur die Fußkachel): neue Bereiche (Befund), Abkürzungen (Hinweis)
python -m pipeline.abenteuer.durchlass [--hinweise] [SZENE …]   # pixelgenaue Durchlässe (Regel 10.92): Ziele, die nur durch eine Lücke von Körperbreite (12 px) erreichbar sind; leere Nischen als Hinweis
python -m pipeline.abenteuer.laufbahn [--beheben] [--muster MUSTER]   # Statisten mit Laufweg mitten auf einem schmalen Pfad (höchstens 4 Kacheln, Kanalweg 24.11.2026): Befund ab 3 Feldern in der Mitte, --beheben verschiebt die Strecke an den Rand (nur diese Textstellen); Dauertest „0 Befunde“ für alle Szenen, Ausnahmen mit Grund im Werkzeug
python -m pipeline.abenteuer.schriftglyphe   # großes Z der Pixelschrift neu zeichnen (sah aus wie die 2); nur nach einem Tausch der Schriftdatei nötig
(cd app && DURCHLAUF_ORDNER=/tmp/durchlauf DURCHLAUF_MINUTEN=30 CHROMIUM_PFAD=… npx playwright test --config playwright.durchlauf.config.ts)   # Spieler-Durchlauf: das Spiel nur mit Spielereingaben spielen, je Akt messen (nach npm run build; Etappen über das Profil im Ordner; DURCHLAUF_FORMAT=quer, DURCHLAUF_STAND=DATEI für einen Aktbeginn, DURCHLAUF_SPIELER=schwach verliert jede Partie und Runde beim ersten Versuch, S17 bis zum Notausgang; DURCHLAUF_SPIELER=eilig tippt doppelt, nimmt die erste Antwort, bricht Läden und Tagebuch ab, dreht nach Kartenwechseln um, Wettlaufwache in wache.ts; nie in CI)
(cd app && PROBE_STAND=DATEI.json PROBE_KARTE=portDelacroix.musikhaus PROBE_VARIABLEN='{"musikhausOffen":true}' CHROMIUM_PFAD=… npx playwright test --config playwright.durchlauf.config.ts ansprechprobe)   # Ansprechprobe: auf einer Karte jede Figur und jeden Dialog-Auslöser aufsuchen, Aktionsknopf prüfen (nach npm run build)
(cd app && PROBE_STAND=DATEI.json PROBE_KARTE=capitalArena.aussen PROBE_DING=treppe PROBE_NEULADEN_BEI="Ich muss dir etwas sagen" PROBE_ZIEL=abenteuer-abspann CHROMIUM_PFAD=… npx playwright test --config playwright.durchlauf.config.ts neuladeprobe)   # Neuladeprobe: Ding ansprechen, bei einer Zeile mitten im Gespräch neu laden, wieder ansprechen, bis zum Ziel (Stand: aktstand.cjs --bis finaleBesprochen)
node pipeline/abenteuer/blickstaende.cjs --ziel ORDNER && (cd app && BLICK_STAENDE=ORDNER BLICK_FOTOS=FOTOORDNER [BLICK_TEIL=1/3] [BLICK_NUR=park_skater] [BLICK_FORMAT=quer] CHROMIUM_PFAD=… npx playwright test --config playwright.durchlauf.config.ts blickprobe)   # Blickprobe: Stand der Simulation je Blickpunkt, dann jeden im Spiel ablaufen (löst im Vorbeigehen aus, Geist neben dem Helden, Gedanken, danach weg, nicht doppelt), Foto und Ausschnitt je Stelle; Ergebnis FOTOORDNER/ergebnis-N.jsonl (nach npm run build mit Paket; Fotos nur lokal)
(cd app && PROBE_STAND=DATEI.json PROBE_KARTE=mapleFalls.aussen PROBE_DING=calloway PROBE_VARIABLEN='{"nadelMapleFalls":1}' GESPRAECH_FOTOS=ORDNER [PROBE_FORMAT=quer] CHROMIUM_PFAD=… npx playwright test --config playwright.durchlauf.config.ts gespraechsprobe)   # Gesprächsprobe: Gespräch mit einer Figur, jede Zeile von Ambrose fotografiert (geflüstert, Geist neben dem Helden)
node pipeline/abenteuer/aktstand.cjs --akt 2|3|4 --ziel DATEI.json   # Stand der Gesamtsimulation zu Beginn eines Akts (oder --bis VARIABLE: sobald sie gesetzt ist), für den Spieler-Durchlauf (DURCHLAUF_STAND; dazu DURCHLAUF_OHNE=ort.karte.ding,…, DURCHLAUF_BIS_ORT, DURCHLAUF_BIS_QUEST)
```

## Arbeitsumgebung (Stand 13.10.2026, abends)

Netzzugang der Cloud-Umgebung: „Voll“. npm und PyPI sind erreichbar, es gilt der normale Ablauf:

- Python: `python3 -m venv .venv && . .venv/bin/activate && pip install -r pipeline/requirements.txt`
- App: `cd app && npm ci`
- Playwright lokal: In der Cloud-Umgebung liegt ein Chromium unter `/opt/pw-browsers`, das nicht zur
  Playwright-Version passt. Deshalb lokal nur Chromium und mit festem Pfad:
  `CHROMIUM_PFAD=/opt/pw-browsers/chromium-1194/chrome-linux/chrome PLAYWRIGHT_NUR_CHROMIUM=1 npm run test:e2e`
  (vorher `npm run build`). Der Ordner unter `/opt/pw-browsers` wechselt je Umgebung (auch
  `chromium-1243/chrome-linux64/chrome` kam vor); vorher mit `ls /opt/pw-browsers` nachsehen.
  WebKit läuft nur in GitHub Actions.
- GitHub Actions (`.github/workflows/pruefen.yml`) prüft bei jedem Push und Pull Request Pipeline,
  App und Oberfläche (Chromium und WebKit). Im öffentlichen Repository kostet das nichts. Ergebnisse
  über die GitHub-Werkzeuge lesen, alle 2 Minuten nachsehen (Wunsch des Autors, 15.10.2026); ein
  Lauf dauert etwa 9 Minuten.
- **Öffentlich:** Alles, was gepusht wird, ist sofort für alle lesbar. Keine Buchtexte über kurze
  Regelzitate mit Fundstelle hinaus (Regel 3), keine Prüfhilfen oder Berichte (die schreibt die
  Pipeline nach `buch/arbeit/`, nur lokal), keine Zugangsdaten, keine privaten Angaben des Autors.
- Zweige löschen geht über den Proxy nicht; der Autor räumt sie bei Bedarf auf GitHub auf.

## Arbeitsablauf

1. Je Arbeitspaket ein eigener Zweig (`ap1-durchstich` usw.).
2. Jeder Push löst die Prüfungen aus. Der Autor testet auf `main` (schach-von-grund-auf.com/app/);
   die App ist fertig, bevor das Buch erscheint, deshalb bleibt das so (Entscheidung V2,
   19.10.2026).
3. Der Autor prüft nach `docs/AUFGABEN_AUTOR.md` (Teil 1) auf dem Handy und gibt frei.
4. Nach der Freigabe wird der Zweig in `main` übernommen. `main` ist die veröffentlichte App.
   Der Autor erlaubt ausdrücklich (14.10.2026), jederzeit nach `main` zu pushen, wenn es sinnvoll
   ist (etwa Testversionen). Vorher immer alle Prüfungen bestehen lassen und die Versionsnummer
   erhöhen.
5. Schutz vor Arbeitsverlust: Teilschritte, die in eine Sitzung passen. Nach jedem Teilschritt
   committen und pushen, spätestens nach etwa 30 Minuten. `docs/FORTSCHRITT.md` hält fest, was fertig
   ist, was offen ist und den genauen nächsten Schritt. Im claude.ai-Projekt hält
   `claude/App_Fortschritt.md` denselben Stand.

6. **Helfer liefern, der Hauptchat baut zusammen** (Wunsch des Autors, 14.11.2026): Helfer (Unteragenten
   und Nebenchats) committen und pushen nicht selbst. Sie lassen ihre fertigen, geprüften Änderungen
   liegen oder übergeben sie und melden Dateien und Prüfergebnis. Der Hauptchat führt alles zusammen,
   prüft das Ganze und pusht.

## Wann Fable sinnvoll ist

Den Autor vor diesen Arbeitspaketen an den Wechsel erinnern:

- **AP 3** Zugfolgen-Verfahren (Zugfolgen aus Fließtext den Diagrammen zuordnen)
- **AP 7** Analyse-Grundbausteine (Abtausch, Drohungen, Strahlen tragen alle Werkzeuge)
- **AP 9** Werkzeuge Kapitel 5 bis 7 mit Kalibrierung
- **AP 11** Engine, Stufen und Fehlerprofile
- zusätzlich bei hartnäckigen Fehlern nach zwei erfolglosen Anläufen

Alles andere: Opus.

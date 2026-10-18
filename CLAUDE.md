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
   zeigt die Datei als Aufgabenseite (drei Sekunden auf das Zahnrad, seit 0.2.74) und liest dafür
   die Punkte im Format „- [ ] N307. Text“ mit eingerückten Folgezeilen: Dieses Format bleibt.
   Der Autor schickt seinen Stand als Text („N306 ok“, „N305: Notiz“); den einarbeiten wie
   jede Antwort.
9. **Empfehlungen gleich umsetzen** (Wunsch des Autors, 17.10.2026 nachmittags, auch an Opus):
   Zu jeder Rückfrage eine fundierte Empfehlung erarbeiten, sie in `docs/AUFGABEN_AUTOR.md`
   festhalten und dann sofort umsetzen („Schon umgesetzt in …, Widerspruch genügt“). Widerspricht
   der Autor später, wird es zurückgebaut. Nur warten, wenn Umsetzen und späterer Rückbau
   verwickelte Probleme machen könnten (etwa Datenformate im Speicher der Leser, Löschen von
   Buchdaten, Veröffentlichung). Ergänzung (Wunsch des Autors, 17.10.2026 nachts): Texte, die der
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

# Pipeline (im Hauptordner)
python -m pipeline.bauen --buch buch/a1 --ziel app/public/daten/de/a1   # alle Kapitel, Glossar, PGN-Entwürfe, Bericht
python -m pipeline.bauen --buch buch/a1 --ziel app/public/daten/de/a1 --zugzeichen   # dazu Engine-Prüfung
python -m pipeline.bauen ... --mit-entwuerfen   # PGN-Entwürfe als „Entwurf“ in die App (bis AP 17, nach Wunsch des Autors)
python -m pipeline.bauen ... --text-entwuerfe   # nur Entwürfe der vorbereiteten Texte (AP 14) in die App, zur Durchsicht
python -m pytest pipeline/tests
python -m pipeline.pruefen.daten app/public/daten/de/a1   # Daten gegen Schemas, ohne Buchquellen
python -m pipeline.eroeffnungsliste   # Eröffnungsnamen von Lichess (inhalte/lichess) für das Werkzeug „Eröffnung“
```

## Arbeitsumgebung (Stand 13.10.2026, abends)

Netzzugang der Cloud-Umgebung: „Voll“. npm und PyPI sind erreichbar, es gilt der normale Ablauf:

- Python: `python3 -m venv .venv && . .venv/bin/activate && pip install -r pipeline/requirements.txt`
- App: `cd app && npm ci`
- Playwright lokal: In der Cloud-Umgebung liegt ein Chromium unter `/opt/pw-browsers`, das nicht zur
  Playwright-Version passt. Deshalb lokal nur Chromium und mit festem Pfad:
  `CHROMIUM_PFAD=/opt/pw-browsers/chromium-1194/chrome-linux/chrome PLAYWRIGHT_NUR_CHROMIUM=1 npm run test:e2e`
  (vorher `npm run build`). WebKit läuft nur in GitHub Actions.
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
2. Jeder Push löst die Prüfungen aus. Cloudflare baut aus jedem Zweig eine Testadresse.
3. Der Autor prüft nach `docs/AUFGABEN_AUTOR.md` (Teil 1) auf dem Handy und gibt frei.
4. Nach der Freigabe wird der Zweig in `main` übernommen. `main` ist die veröffentlichte App.
   Der Autor erlaubt ausdrücklich (14.10.2026), jederzeit nach `main` zu pushen, wenn es sinnvoll
   ist (etwa Testversionen, solange Cloudflare keine Testadressen für Zweige baut). Vorher immer
   alle Prüfungen bestehen lassen und die Versionsnummer erhöhen.
5. Schutz vor Arbeitsverlust: Teilschritte, die in eine Sitzung passen. Nach jedem Teilschritt
   committen und pushen, spätestens nach etwa 30 Minuten. `docs/FORTSCHRITT.md` hält fest, was fertig
   ist, was offen ist und den genauen nächsten Schritt. Im claude.ai-Projekt hält
   `claude/App_Fortschritt.md` denselben Stand.

## Wann Fable sinnvoll ist

Den Autor vor diesen Arbeitspaketen an den Wechsel erinnern:

- **AP 3** Zugfolgen-Verfahren (Zugfolgen aus Fließtext den Diagrammen zuordnen)
- **AP 7** Analyse-Grundbausteine (Abtausch, Drohungen, Strahlen tragen alle Werkzeuge)
- **AP 9** Werkzeuge Kapitel 5 bis 7 mit Kalibrierung
- **AP 11** Engine, Stufen und Fehlerprofile
- zusätzlich bei hartnäckigen Fehlern nach zwei erfolglosen Anläufen

Alles andere: Opus.

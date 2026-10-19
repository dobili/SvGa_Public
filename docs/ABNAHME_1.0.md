# AP 17 Abnahme Stufe 1 – Checkliste für Version 1.0

**Nachtrag 0.2.108 (Opus, Zweig `ap17-vorbereitung`):** Punkt 2, 8 (Bau) und 9 aus Abschnitt 2 sind
vorbereitet. `npm run build:veroeffentlichung` baut mit `VEROEFFENTLICHUNG=1` die Fassung für die
Leser ohne Aufgabenseite und ohne englische Vorschau und prüft das (`skripte/pruefe-
veroeffentlichung.mjs`, auch in GitHub Actions). `python -m pipeline.pruefen.daten
--veroeffentlichung app/public/daten/de/a1` lehnt Entwürfe ab. Die normale Fassung auf `main`
bleibt unverändert, bis der Autor 1.0 freigibt. Die Fragen an den Autor stehen in
`docs/AUFGABEN_AUTOR.md`, Teil 2, Abschnitt „V. Version 1.0“.

Stand: 19.10.2026, Repository-Stand 0.2.107 (`main` steht
laut GitHub Actions bei 0.2.106, letzter Lauf „Prüfen“ #300 grün). Quellen: Pflichtenheft (Claude
Docs, Rev. 30, vollständig gelesen), `docs/FORTSCHRITT.md`, `docs/AUFGABEN_AUTOR.md`,
`docs/ENTSCHEIDUNGEN.md`, `docs/LIZENZEN.md`, `docs/VEROEFFENTLICHUNG.md`, Code in `app/` und
`pipeline/`, lokale Buchquellen `buch/a1` (letzter Commit 17.10.2026, nur gelesen). Nichts im
Repository geändert. Vermutungen sind als „(Vermutung)“ markiert.

Kurzfassung: Technisch ist Stufe 1 erfüllt; die App enthält dazu fast alles aus Stufe 2 und 3.
Für 1.0 fehlen vor allem Dinge beim Autor (endgültiges Buch und endgültiger Datenlauf, Gerätetests,
Rechtstexte, Domain, Freigaben) und drei technische Schalter, die Claude allein bauen kann
(Aufgabenseite und englische Vorschau aus der veröffentlichten Fassung, Schutz gegen Entwürfe in
den Daten).

---

## 1 Abnahmetabelle

Status: **erfüllt** · **teilweise** · **offen** · **beim Autor** (nur der Autor kann es prüfen
oder entscheiden).

### 1.1 Abnahme vor dem Erscheinen (Pflichtenheft Abschnitt 9, „Abnahme vor dem Erscheinen“)

| Nr. | Kriterium (Pflichtenheft 9)                                                                | Status                 | Beleg / was fehlt                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| --- | ------------------------------------------------------------------------------------------ | ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A1  | Jede Abbildung des Buches lässt sich über ihre Nummer öffnen                               | teilweise              | 765 Abbildungen in `app/public/daten/de/a1/index.json`; alle Stellungen werden in `app/src/analyse/alleAbbildungen.test.ts` gelesen; Nummernsuche in `app/src/daten/finde.test.ts` nur an Beispielen (1.26, unbekannte, vertauschte Nummern), Oberfläche stichprobenweise (`tests/e2e/durchstich.spec.ts`, `buchdaten.spec.ts`: 1.26, 1.28, 7.13, 12.1). **Fehlt:** ein Test „jede Nummer aus index.json wird von `findeAbbildung` gefunden“. Abb. 0.2 ist ein Foto und steht nicht im Index (Pipeline-Hinweis); klären, was die Eingabe „0.2“ zeigen soll. Endgültig erst nach dem letzten Datenlauf mit den finalen Nummern.                                                                                                            |
| A2  | App startet und funktioniert im Flugmodus vollständig                                      | teilweise              | Automatisch: `durchstich.spec.ts` „offline: nach dem ersten Laden geht alles ohne Netz“ (Chromium, WebKit in CI). App holt keine fremden Adressen (nur `fetch` auf eigene Daten in `src/daten/laden.ts`, `trainerdaten.ts`). **Beim Autor:** echter Flugmodus-Test auf iPhone und Android mit installierter 1.0.                                                                                                                                                                                                                                                                                                                                                                                                                          |
| A3  | Installation auf iPhone und Android gelingt nach der Anleitung im Buch                     | beim Autor             | Anleitung im Buch: `buch/a1/chapters/kap00_notation.tex`, Abschnitt „Die App zum Buch“ mit `\qrzeile{installieren/}`; Installationsteil `/installieren/` (`tests/e2e/startseite.spec.ts`). Nur auf echten Geräten prüfbar, mit dem gedruckten bzw. PDF-QR-Code.                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| A4  | Alle automatischen Prüfungen laufen ohne Fehler                                            | erfüllt (für 0.2.106)  | `.github/workflows/pruefen.yml`: ruff, pytest, Daten gegen Schemas, Typen, ESLint, Prettier, Vitest (mit echter Engine), Build mit Größenbudget, `wrangler deploy --dry-run`, Playwright Chromium und WebKit. Lauf #300 auf `main` (0.2.106) grün. Für 1.0 erneut auf dem Freigabestand.                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| A5  | Alle Werkzeuge der Art E liefern bei allen Buchstellungen das Ergebnis, das das Buch nennt | teilweise              | Referenzergebnisse je Abbildung und Werkzeug (`app/src/analyse/referenzergebnisse.test.ts`), Kalibrierung: Zielbilanz 49 von 51 Wertungen (`k2-zielbilanz.test.ts`), Faktorenbilanz Material/Zeit 36 von 36 (`k3-faktorenbilanz`), Skelettbilanzen (`k5-kalibrierung.test.ts`). **Offene Buchbefunde** (Autor ändert das Buch oder entscheidet): B6 Zeit-Zählhilfe Kap. 3 (App folgt der Buchregel, Fließtext widerspricht), D1 Abb. 4.45, D2 Phase Glossar gegen Steckbriefe, ZF4 Tablebase-Befund 8.25/8.26/9.23/9.41 (`docs/AUFGABEN_AUTOR.md`, Teil 2). Ob die Zielbilanz-Befunde 2.71 und 2.128 (`docs/FORTSCHRITT.md`, AP 8) erledigt sind, ist aus den Unterlagen nicht ersichtlich (Vermutung: im Buch geändert oder akzeptiert). |
| A6  | Alle vorbereiteten Texte sind vom Autor freigegeben                                        | teilweise / beim Autor | 253 vorbereitete Texte freigegeben (E1, 16.10.2026, `docs/FORTSCHRITT.md` AP 14); Daten: 504× `freigegeben`, 0× `entwurf`. Seit Regel 9 (17.10.2026 nachts) gelten neue Texte „vorerst als abgesegnet“; Texte, die danach entstanden (Trainer, Endspiel-Merksätze N255, Steckbrief-Karten N473, Bot-Texte u. a.), sind also nicht ausdrücklich gelesen. **Fehlt:** eine ausdrückliche Sammelfreigabe des Autors vor 1.0.                                                                                                                                                                                                                                                                                                                  |
| A7  | Datensicherung: Export auf einem Gerät, Import auf einem anderen                           | teilweise              | Automatisch: `tests/e2e/speicher.spec.ts` „Datensicherung: Export auf einem Gerät, Import auf einem anderen“ und Ablehnung fremder Dateien; Format `src/speicher/format.ts` (SCHEMA_VERSION 5, neuere Dateien werden erkannt). **Beim Autor:** N558 und N403 (echter Gerätewechsel, Teilen am Handy).                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| A8  | Impressum, Datenschutzerklärung und Lizenzangaben sind online                              | teilweise              | `/impressum/`, `/datenschutz/` (Angaben des Autors vom 17.10.2026, `app/impressum/index.html`, `app/datenschutz/index.html`), Lizenzen in der App (`/app/#lizenzen`, Fußzeile der Startseite; `tests/e2e/startseite.spec.ts`). Datenschutz nennt Cloudflare (Zugriffsdaten) und goneo. **Beim Autor:** N294 (Angaben prüfen), N560 (Lizenzseite); Pflichtenheft 2 empfiehlt zur Lizenzfrage der Buchinhalte eine kurze Rückfrage bei einer Fachperson; dazu nichts dokumentiert.                                                                                                                                                                                                                                                          |
| A9  | Domain mehrere Jahre im Voraus bezahlt, Zugangsdaten dokumentiert                          | beim Autor             | Domain am 15.10.2026 bei Cloudflare registriert (`docs/FORTSCHRITT.md`, „Konten und Umgebung“). Laufzeit, automatische Verlängerung und Ablage der Zugangsdaten sind nirgends festgehalten (gehören nicht ins Repository, Regel 7).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |

### 1.2 Inhalt von Stufe 1 (Pflichtenheft 10 und Abschnitt 4, Spalte „Stufe 1“)

| Nr. | Anforderung                                                                                      | Status                  | Beleg / was fehlt                                                                                                                                                                                                                          |
| --- | ------------------------------------------------------------------------------------------------ | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| S1  | Datengewinnung aus dem LaTeX (3, 10)                                                             | teilweise               | `pipeline/` (lesen, prüfen, bauen), Datenstand 2026-10-19; Bericht nur lokal in `buch/arbeit/`. **Fehlt:** der endgültige Datenlauf mit den finalen Abbildungsnummern, sobald das Buch inhaltlich fertig ist (Pflichtenheft 10).           |
| S2  | Zugfolgen als PGN für alle Beispiele (3, 10)                                                     | erfüllt                 | `inhalte/de/zugfolgen/`: 251 `freigegeben`, 15 `verworfen`, 29 `konstruiert` (von Claude gebaut, in der App mit Hinweis „nicht aus dem Buch“, `durchstich.spec.ts`). ZF1 bis ZF3 (konstruierte Partien) wartet auf Bestätigung des Autors. |
| S3  | Abbildung aufrufen: Nummer eintippen, Kapitelübersicht mit kleinen Brettern (4)                  | erfüllt                 | `durchstich.spec.ts` (Nummer, unbekannte Nummer, Nummernsprung), `buchdaten.spec.ts` (Kapitelübersicht).                                                                                                                                   |
| S4  | Brettdarstellung: Pfeile, Felder, Farbcode mit Linienart, Zugseite, drehen, Koordinaten (4, 8)   | erfüllt                 | `durchstich.spec.ts` „Brett drehen; Koordinaten …“; Linienarten in `src/ui/brett/masse.ts`, `Werkzeugkarte.tsx`.                                                                                                                           |
| S5  | Nachspielen mit Abbildungssprüngen und Abzweigungen (4)                                          | erfüllt                 | `durchstich.spec.ts` „Nachspielen: Abb. 1.26 vor und zurück, Sprung zu Abb. 1.28, Abzweigung“.                                                                                                                                             |
| S6  | Weiterspielen mit Variantenbaum, „Zurück zur Buchvariante“ (4)                                   | erfüllt                 | `durchstich.spec.ts` „Weiterspielen …“.                                                                                                                                                                                                    |
| S7  | Skelett-Ansicht (4)                                                                              | erfüllt                 | `durchstich.spec.ts` (Skelett im Bündel Skelett-Röntgen).                                                                                                                                                                                  |
| S8  | Glossar: Suche, Kurzdefinition, Querverweise, Sprung zu Abbildungen (4)                          | erfüllt                 | `buchdaten.spec.ts` „Nachschlagen: Glossar suchen …“, `src/daten/glossarsuche.test.ts`.                                                                                                                                                    |
| S9  | Denkroutine als Karte, aus jedem Trainer aufrufbar (4)                                           | erfüllt                 | `src/ui/bildschirme/Denkroutine.tsx`, `buchdaten.spec.ts`. Aufruf aus jedem Trainer nicht eigens getestet (Vermutung: über Nachschlagen erreichbar).                                                                                       |
| S10 | Gesamt-Checkliste aus Kapitel 12, Zeilen verlinkt (4)                                            | erfüllt                 | `src/ui/bildschirme/Checkliste.tsx`, `buchdaten.spec.ts`.                                                                                                                                                                                  |
| S11 | Einstellungen: Sprache, Brettfarben, Figurensatz, Ton, Auflage, Strenge „Erst selbst denken“ (4) | erfüllt bis auf Auflage | Alle vorhanden (`EinstellungenKarte.tsx`, `durchstich.spec.ts`). Auflage: nur a1 (`src/daten/laden.ts`, `AUFLAGE = "a1"`), Anzeige als „Datenstand“; Auswahl erst nötig ab der 2. Auflage (Pflichtenheft 2).                               |
| S12 | Website mit Installationsanleitung (2, 10)                                                       | erfüllt                 | Startseite `/`, `/installieren/` (QR-Ziel), Anleitung je Gerät, Offline-Fortschritt (`startseite.spec.ts`, `durchstich.spec.ts`). Shop-Angaben noch Platzhalter („ISBN folgt“, E4).                                                        |

### 1.3 Rahmenbedingungen, Recht, Bedienung, Qualitätssicherung

| Nr. | Anforderung                                                                                                                                     | Status                             | Beleg / was fehlt                                                                                                                                                                                                                                                                            |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| R1  | Statische PWA, offline nach dem ersten Aufruf (2)                                                                                               | erfüllt                            | `src/sw.ts`, vite-plugin-pwa, Cloudflare Worker mit statischen Dateien (`app/wrangler.jsonc`).                                                                                                                                                                                               |
| R2  | Update still holen, Hinweis „Neue Version verfügbar“, Fortschritt bleibt (2)                                                                    | erfüllt                            | Update-Hinweis nur nach Tippen (`docs/ARCHITEKTUR.md`); Übernahme alter Merker 0.2.x (`speicher.spec.ts`). Beim Sprung auf 1.0.0 einmal auf einem Gerät mit 0.2.x prüfen.                                                                                                                    |
| R3  | Größe unter 25 MB (2)                                                                                                                           | erfüllt                            | `app/skripte/pruefe-groesse.mjs` bricht den Build ab; lokaler `dist/` 13 MB (Stand 19.10.2026, 11:43).                                                                                                                                                                                       |
| R4  | Geräte: Safari iOS und Chrome Android, ab 360 px (2)                                                                                            | erfüllt (automatisch)              | Playwright „android-chromium“ und „iphone-webkit“ (`playwright.config.ts`), `barrierefreiheit.spec.ts` „360 px Breite“.                                                                                                                                                                      |
| R5  | Sprache: Deutsch zum Start, Englisch später (2)                                                                                                 | teilweise                          | Englisch seit 0.2.104 als Vorschau wählbar (`src/i18n/sprache.ts`: `FERTIGE_SPRACHEN = ["de"]`, `DATENSPRACHEN = ["de"]`); Buchdaten, 27 Buchzitate und Bot-Namen deutsch. Entscheidung für 1.0 offen (siehe 3.4).                                                                           |
| R6  | Kein Konto, kein Tracking, keine Cookies, keine Fremdinhalte (1, 2)                                                                             | erfüllt                            | Keine externen Abrufe im Code; Schriften lokal (`app/public/lizenzen/ofl-*`); Datenschutz bestätigt „keine Web Analytics“.                                                                                                                                                                   |
| R7  | Zwei Lizenzen: Code GPLv3 öffentlich, Buchinhalte alle Rechte vorbehalten; Bibliotheken GPL-verträglich; Lichess CC0 geprüft (2)                | erfüllt / beim Autor               | `LICENSE`, `docs/LIZENZEN.md` (alle Bausteine, inkl. AGPL-Bretter, CC BY-Porträts), Lizenzseite `lizenzen.buch.*`. Rückfrage bei einer Fachperson (Pflichtenheft 2) nicht dokumentiert.                                                                                                      |
| R8  | Datenbasis: Abbildungsnummer als Schlüssel, Datenstand je Auflage eingefroren, lesbare versionierte Dateien, Befunde statt stiller Änderung (3) | erfüllt                            | Schemas `schemas/`, Daten als JSON im Repository, Befunde im lokalen Bericht und in `AUFGABEN_AUTOR.md`. „Eingefroren“ erst mit dem endgültigen Datenlauf.                                                                                                                                   |
| R9  | Verweise nur auf Abbildungen und Abschnitte, keine Seitenzahlen (3)                                                                             | erfüllt (Vermutung)                | Glossar mit Kapitel statt Seite (`docs/FORTSCHRITT.md` AP 2); nicht eigens durchsucht.                                                                                                                                                                                                       |
| R10 | Bedienung: eine Hand, Leiste mit fünf Bereichen, Tippflächen 44 × 44, Systemschriftgröße, Kontrast hell/dunkel, Bildschirmleser, Ton aus (8)    | erfüllt (automatisch) / beim Autor | `--tippflaeche` in den Stylesheets, axe-Tests hell und dunkel, Tastaturbedienung (`barrierefreiheit.spec.ts`); offen beim Autor: N450 (Schriftgröße des Geräts), N451 (Querformat).                                                                                                          |
| R11 | Fehler melden kopiert Stellung, Werkzeug, Version, Gerät (9)                                                                                    | erfüllt                            | `src/ui/bildschirme/Ich.tsx` („Fehler melden“).                                                                                                                                                                                                                                              |
| R12 | Autor testet jede Ausbaustufe auf dem Handy (9)                                                                                                 | offen                              | 63 offene Testpunkte in Teil 1 und 41 Punkte in Teil 2 von `docs/AUFGABEN_AUTOR.md`. Die meisten gehören zu Stufe 2 und 3 (Engine, Bots, Trainer).                                                                                                                                           |
| R13 | Trainingsmenü zeigt alle Trainer; Trainernamen vor dem Druck festgelegt, danach unverändert (7)                                                 | erfüllt / beim Autor               | Alle 17 Trainer `fertig: true` (`src/training/trainer.ts`). Festschreiben der Namen (stehen in `de.json` und auf den Trainingsseiten) muss der Autor vor dem Druck bestätigen.                                                                                                               |
| R14 | Aufgaben am Buch (10): QR-Code und Kurzanleitung in Kap. 0; Zeile „In der App“ je Trainingskasten; Kap. 7 Wortlaut W2/W3                        | beim Autor                         | Im Buchstand vom 17.10.2026 vorhanden: „Die App zum Buch“ mit QR (Kap. 0), `\trainingsverweis` in allen 13 Kapiteln (QR auf `/training/kapNN/`), W2/W3 in Kap. 7 allgemein gefasst. Der Kap.-7-Wortlaut weicht vom Vorschlag in 6.6 ab; der Autor sollte bestätigen, dass er so gemeint ist. |

### 1.4 Abweichungen vom Pflichtenheft, vom Autor beschlossen (keine Lücke, nur zur Kenntnis bei der Abnahme)

- Adressen: Pflichtenheft 2 sagt „keine Unterseiten, die App wertet keine Adressen aus“. Beschlossen
  am 15. und 16.10.2026: App unter `/app/`, `/installieren/` als QR-Ziel, `/impressum/`,
  `/datenschutz/`, `/training/kapNN/`, dazu Sprünge `#lizenzen`, `#abb-6.20`, `#aufgaben`
  (`app/src/app/App.tsx`, `docs/ENTSCHEIDUNGEN.md`).
- Weitere QR-Codes: Pflichtenheft 2 sieht nur einen vor. Beschlossen: je Trainingskasten ein QR-Code
  auf die Trainingsseite (16.10.2026).
- Fließtext des Buches: Die Trainingsseiten zeigen die Kastentexte des Buches unverändert,
  „Alle Rechte vorbehalten“ (Entscheidung 16.10.2026).
- Umfang: Die App enthält schon fast alles aus Stufe 2 und 3. Damit werden deren offene Tests
  (Engine-Stufen S24, N335 usw.) für 1.0 sichtbar, obwohl Stufe 1 sie nicht verlangt.

---

## 2 Was für 1.0 fehlt (nach Wichtigkeit)

| #   | Was                                                                                                                                                                                                               | Wer                                                   | Anmerkung                                                                                                                                                                                                                                                                                                                             |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **Endgültiges Buch und endgültiger Datenlauf** mit den finalen Abbildungsnummern; Bericht mit 0 Fehlern; Buchbefunde B6, D1, D2, ZF4 entschieden                                                                  | Autor (Buch fertig, Befunde), dann Claude (Datenlauf) | Pflichtenheft 10. Ohne das ist A1, A5, S1 und R8 nicht abschließbar.                                                                                                                                                                                                                                                                  |
| 2   | **Aufgabenseite des Autors aus der veröffentlichten Fassung**                                                                                                                                                     | Claude allein (Bau), Autor (Testweg bestätigen)       | Heute im Build: `dist/assets/AUFGABEN_AUTOR-*.js` (46 KB), in `dist/sw.js` vorab geladen; drei Sekunden auf das Zahnrad oder `/app/#aufgaben` öffnen sie. Siehe 3.3.                                                                                                                                                                  |
| 3   | **Testweg nach 1.0 klären:** Heute testet der Autor auf `schach-von-grund-auf.com/app/` (= `main`). Nach 1.0 ist `main` die Leserfassung.                                                                         | Autor                                                 | Cloudflare-Vorschau-Builds sind laut `docs/VEROEFFENTLICHUNG.md` an, laut `CLAUDE.md` baut Cloudflare aber „keine Testadressen für Zweige“. Klären, ob eine Vorschauadresse je Zweig funktioniert; sonst eigener Test-Worker. Dazu die Erlaubnis „jederzeit nach main pushen“ (CLAUDE.md, Ablauf 4) für die Zeit nach 1.0 neu fassen. |
| 4   | **Gerätetests der Abnahme:** Installation nach Buchanleitung (iPhone, Android), Flugmodus, Export/Import zwischen zwei Geräten (N558, N403)                                                                       | Autor                                                 | A2, A3, A7. Etwa 20 Minuten.                                                                                                                                                                                                                                                                                                          |
| 5   | **Rechtliches:** Impressum und Datenschutz prüfen (N294), Lizenzseite (N560); optional Rückfrage bei einer Fachperson (Pflichtenheft 2)                                                                           | Autor                                                 | Claude ist kein Anwalt; Texte sind vorhanden und online.                                                                                                                                                                                                                                                                              |
| 6   | **Domain:** mehrere Jahre im Voraus bezahlt, Verlängerung automatisch, Zugangsdaten außerhalb des Repositorys dokumentiert                                                                                        | Autor                                                 | A9.                                                                                                                                                                                                                                                                                                                                   |
| 7   | **Sammelfreigabe der Texte**, die seit dem 17.10.2026 „vorerst als abgesegnet“ gelten; Bestätigung ZF1 bis ZF3 (29 konstruierte Partien) und „Nur bestätigen“ (NA1, S21, S22, F1–F5, X5, T1–T5, C1–C9, K1–K5, E3) | Autor                                                 | A6. Ein Satz („alle ok außer …“) genügt laut Aufgabenliste.                                                                                                                                                                                                                                                                           |
| 8   | **Englische Vorschau:** in 1.0 zeigen (entschieden V1, 19.10.2026, siehe 3.4)                                                                                                                                     | Autor entscheidet, Claude baut                        | Nach Regel 9 kann Claude die Empfehlung gleich umsetzen; Rückbau ist einfach.                                                                                                                                                                                                                                                         |
| 9   | **Schutz gegen Entwürfe:** Prüfung in CI bzw. im Build, die `"status": "entwurf"` in `app/public/daten/` und `inhalte/de/trainer/` ablehnt                                                                        | Claude allein                                         | Heute 0 Entwürfe, aber nichts verhindert einen versehentlichen Lauf mit `--mit-entwuerfen`.                                                                                                                                                                                                                                           |
| 10  | **Test „jede Nummer öffnet ihre Abbildung“** über alle Nummern aus `index.json`; Verhalten bei Abb. 0.2 (Foto) festlegen                                                                                          | Claude allein (Test), Autor (0.2)                     | A1.                                                                                                                                                                                                                                                                                                                                   |
| 11  | **Trainernamen und Wege einfrieren** (stehen ab dem Druck im Buch)                                                                                                                                                | Autor bestätigt, Claude hält fest                     | Pflichtenheft 2 und 7.                                                                                                                                                                                                                                                                                                                |
| 12  | **Version 1.0.0** in `app/package.json` und `package-lock.json`, Versionsprüfung beim Update von 0.2.x                                                                                                            | Claude allein                                         | Siehe 3.5.                                                                                                                                                                                                                                                                                                                            |
| 13  | Stufen-Namen und Skala der Engine (S24 nach Test N335), Wertung S20                                                                                                                                               | Autor                                                 | Stufe 2, für 1.0 nicht zwingend; aber sichtbar, solange „Vereinsanfänger“ bei etwa 2350 steht.                                                                                                                                                                                                                                        |
| 14  | Bezugsquellen auf der Startseite (ISBN, Shop-Links, E4)                                                                                                                                                           | Autor liefert, Claude trägt ein                       | Kann auch nach 1.0 als Update kommen; Platzhalter sind sauber formuliert.                                                                                                                                                                                                                                                             |

---

## 3 Technische Schritte zur Veröffentlichung

Reihenfolge für einen Zweig `ap17-abnahme` (von `main`); jeder Schritt mit Tests vor dem Commit
(CLAUDE.md, Regel 5).

### 3.1 Buchquellen und Datenlauf ohne Entwürfe

1. `git -C buch/a1 pull` (endgültiger Buchstand; lokal liegt der Stand vom 17.10.2026).
2. Datenlauf **ohne** `--mit-entwuerfen` und **ohne** `--text-entwuerfe`:
   `python -m pipeline.bauen --buch buch/a1 --ziel app/public/daten/de/a1 --zugzeichen`
   (Schalter in `pipeline/bauen/__main__.py`, Zeilen 126 bis 134; ohne Schalter nimmt
   `pipeline/zugfolgen/pgn.py` nur `freigegeben` und `konstruiert` auf).
3. Prüfen:
   - `grep -c '"entwurf"' app/public/daten/de/a1/*.json` ergibt überall 0. Stand heute: 0×
     `entwurf`, 504× `freigegeben`, 29× `konstruiert`; `inhalte/de/zugfolgen` 251 freigegeben,
     29 konstruiert, 15 verworfen; `inhalte/de/texte` und `inhalte/de/trainer` ohne Entwürfe.
   - Bericht in `buch/arbeit/berichte/` (nur lokal): 0 Fehler, Hinweise durchgesehen.
   - `python -m pipeline.pruefen.daten app/public/daten/de/a1`, `python -m pytest pipeline/tests`.
   - `npx vitest run src/analyse/referenzergebnisse.test.ts`: geänderte Zeilen nur, wenn das Buch
     sich geändert hat; dann mit `-u` neu schreiben und im Commit begründen.
4. Optional (Claude allein, Punkt 9 oben): Prüfschritt in `.github/workflows/pruefen.yml` oder in
   `pipeline.pruefen.daten`, der `entwurf` in den ausgelieferten Daten als Fehler wertet.
5. Konstruierte Partien: bleiben drin, solange der Autor ZF1 nicht widerspricht. Es gibt keinen
   Schalter, der sie weglässt (Vermutung: Ausschluss ginge über das Löschen bzw. Umstellen der 29
   PGN-Dateien `inhalte/de/zugfolgen/kapNN/kNN-aMM-k.pgn`).

### 3.2 Trainerdaten

`npm run vorbereiten` kopiert die Trainerdaten (`app/skripte/kopiere-trainerdaten.mjs`); nach dem
Datenlauf die Trainer-Pipeline nur nötig, wenn sich Buchübungen geändert haben (Vermutung). Die
Lichess-Aufgaben (CC0) bleiben unverändert.

### 3.3 Aufgabenseite aus der veröffentlichten Fassung

Heutiger Stand:

- Langer Druck: `app/src/ui/komponenten/Leiste.tsx` (`LANGER_DRUCK_MS = 3000`, `useLangerDruck`
  navigiert zu `autoraufgaben`).
- Adresse: `app/src/app/App.tsx` (`SPRUNG_AUFGABEN = "#aufgaben"`, Fall `autoraufgaben`).
- Inhalt: `app/src/ui/bildschirme/AutorAufgaben.tsx` lädt
  `import("../../../../docs/AUFGABEN_AUTOR.md?raw")`; daraus entsteht ein eigener Teil
  `assets/AUFGABEN_AUTOR-*.js`, der über `globPatterns` in `app/vite.config.ts` (Zeile 148)
  vorab geladen wird. Dazu `src/autor/*`, `AufgabenRueckweg.tsx`, `Aufgabenpunkt.tsx`,
  `tests/e2e/autoraufgaben.spec.ts`.

Vorschlag (Claude allein):

1. Konstante zur Bauzeit in `vite.config.ts` unter `define`, etwa `__AUTORSEITE__`, gesetzt aus
   einer Umgebungsvariable. Vermutung: Cloudflare Workers Builds setzt `WORKERS_CI_BRANCH`;
   dann `__AUTORSEITE__ = process.env.WORKERS_CI_BRANCH !== "main"`. Sonst eine eigene Variable in
   den Build-Einstellungen von Cloudflare (Autor) oder umgekehrt `VEROEFFENTLICHUNG=1` nur für
   Produktion. Vor dem Bau in der Cloudflare-Dokumentation prüfen.
2. In `Leiste.tsx`, `App.tsx` (`ansichtZumSprung`, `Ansicht`) und beim Import von `AutorAufgaben`
   hinter `if (__AUTORSEITE__)`, damit Rollup den Teil samt Markdown weglässt.
3. Lokal und in CI wird mit Aufgabenseite gebaut (bestehende e2e-Tests bleiben); zusätzlich ein
   Build ohne sie mit einer Prüfung: `ls dist/assets | grep AUFGABEN` leer,
   `grep AUFGABEN dist/sw.js` leer, langer Druck öffnet nur die Einstellungen.
4. Nicht nötig: den Merker `autorAufgaben` auf dem Gerät des Autors löschen (harmlos).
5. Hängt an Punkt 3 in Abschnitt 2: Der Autor braucht danach eine Testadresse, auf der die Seite
   weiter da ist.

Alternative (schwächer): nur den langen Druck entfernen und `#aufgaben` lassen. Die Datei ist ohnehin
öffentlich im Repository, ein Datenschutzproblem entsteht also nicht; es geht um Leser, die
zufällig darauf stoßen, und um 46 KB im Offline-Speicher.

### 3.4 Englische Vorschau

Entschieden (V1, 19.10.2026): Englisch bleibt auch in 1.0 wählbar, weil vor 1.0 der Rest übersetzt
wird, unabhängig vom englischen Buch. Seit 0.2.116 gilt `SPRACHDATEIEN = { de, en }` in beiden
Fassungen, und die 27 Buchzitate sind übersetzt (EN2). Offen bis 1.0: Buchdaten, Trainerdaten,
Trainingsseiten und Bot-Namen auf Englisch (Arbeitsliste R25), danach „(preview)“ weglassen und
„en“ in `FERTIGE_SPRACHEN` und `DATENSPRACHEN`.

### 3.5 Versionsnummer 1.0.0

- `app/package.json` steht bei `0.2.107`. Mit `npm version 1.0.0 --no-git-tag-version` im Ordner
  `app/` (ändert auch `package-lock.json`). Die App liest sie über `__APP_VERSION__`
  (`vite.config.ts`, `src/app/version.ts`); Einstellungen, „Fehler melden“ und Datensicherung
  zeigen sie.
- Prüfen, dass nichts die Versionszeichenkette vergleicht: Die Übernahme alter Merker
  (`src/speicher/speicher.ts`, „Merker der Versionen 0.2.x“) arbeitet nach den Schlüsseln, nicht
  nach der Version (Vermutung nach dem Kommentar; beim Umstellen lesen). Speicherformat bleibt
  `SCHEMA_VERSION = 5`, Datenbank `DATENBANK_VERSION = 1`.
- `docs/AUFGABEN_AUTOR.md`, `docs/FORTSCHRITT.md` und `CLAUDE.md` auf 1.0 umstellen; Git-Tag
  `v1.0.0` und auf Wunsch ein GitHub-Release mit kurzem Änderungstext.

### 3.6 Lizenzen, Impressum, Datenschutz

- Lizenzseite: vorhanden (`src/ui/bildschirme/Lizenzen.tsx`, Texte `lizenzen.*` in `de.json`,
  Volltexte in `app/public/lizenzen/`, Engine-Lizenz beim Build nach `/engine/`). Vor 1.0 mit
  `docs/LIZENZEN.md` abgleichen (alle Zeilen der Tabelle in der App?). Optional (Claude allein):
  Lizenzliste der npm-Pakete aus `node_modules` erzeugen, statt sie von Hand zu pflegen.
- Impressum und Datenschutz: `app/impressum/index.html`, `app/datenschutz/index.html` (feste Texte,
  nicht in `de.json`, Angaben vom 17.10.2026). Inhalt prüft der Autor (N294). Nach jeder Änderung
  am Hosting (etwa Cloudflare Web Analytics) muss die Datenschutzerklärung mitziehen.
- `app/public/_headers`: Seiten und `sw.js` mit `no-cache`; passt.

### 3.7 Prüfen, zusammenführen, ausliefern

1. `npm ci && npm run pruefen && npm run build` im Ordner `app/`; lokal
   `CHROMIUM_PFAD=/opt/pw-browsers/chromium-1194/chrome-linux/chrome PLAYWRIGHT_NUR_CHROMIUM=1 npm run test:e2e`.
2. Build ohne Aufgabenseite und ohne Englisch prüfen (3.3, 3.4) und `pruefe-groesse` (unter 25 MB).
3. Push des Zweigs, GitHub Actions grün (Chromium und WebKit).
4. Autor: Abnahmetests aus Abschnitt 2 (Punkte 4 bis 7) auf der Testadresse.
5. Zusammenführen nach `main`; Cloudflare baut mit `npm ci && npm run build`, Deploy
   `npx wrangler deploy`, Root `app`, `NODE_VERSION` 22 (`docs/VEROEFFENTLICHUNG.md`).
6. Nach dem Deploy: `https://schach-von-grund-auf.com/app/` zeigt „App-Version 1.0.0“; ein Gerät
   mit 0.2.x bekommt „Neue Version verfügbar“ und behält Fortschritt und Partien; `/installieren/`,
   `/impressum/`, `/datenschutz/`, `/training/` erreichbar; installierte App im Flugmodus starten.
7. Danach: der Arbeitsablauf aus `CLAUDE.md` gilt für eine veröffentlichte App (Testadresse vor
   `main`, siehe Abschnitt 2, Punkt 3).

---

## 4 Nicht geprüft

- Das technische Konzept (Claude Docs) mit der genauen Beschreibung von AP 17 habe ich nicht
  gelesen; die Liste stützt sich auf das Pflichtenheft und das Repository.
- Ob der lokale Buchstand (17.10.2026) der neueste ist; nichts gezogen.
- Ob Cloudflare-Vorschauadressen je Zweig wirklich gebaut werden (widersprüchliche Angaben in
  `CLAUDE.md` und `docs/VEROEFFENTLICHUNG.md`).

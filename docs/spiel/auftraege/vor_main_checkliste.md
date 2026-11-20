# Vor dem Schritt nach main: Prüfung der Leserfassung und Checkliste (20.11.2026)

Auftrag des Hauptchats vom 20.11.2026 (Vorbereitung, nichts nach main). Das Spiel geht auf main,
wenn der Autor nach seinem Durchspielen freigibt. Dieses Blatt hat zwei Teile:

- A: Was ich am Bau für die Leser geprüft habe.
- B: Die Checkliste für den Schritt selbst.

Die Versionsnotizen stehen in `versionsnotizen_entwurf.md`.

## A Befunde

Grundlage: Stand `uebergabe/innenraeume` nach dem Merge mit beta (20.11.2026, Version 0.3.56).
Gebaut habe ich beide Fassungen:

- `npm run build`: die Fassung des Autors, wie main und beta heute bauen;
- `npm run build:veroeffentlichung`: die Fassung für die Leser, geplant für 1.0.

### A1 Testhilfen: in der Leserfassung nicht drin

- In der Fassung des Autors gibt es diese Testhilfen:
  - Testleiste unter jeder Partie des Spiels („Gewinnen“, „Remis“, „Verlieren“);
  - bei Rätseln, Aufgabenrunden, Erinnerungen und Gedächtnisstellungen „Bestehen“ und „Verfehlen“.
- Die Testleiste hängt an `TESTKNOEPFE_AN = !__VEROEFFENTLICHUNG__` (`anbindung/testende.ts`).
- Im Bündel der Leserfassung steht keine Spur davon. Geprüft im Bündel und im Browser.
- Weitere Testhilfen im Spiel habe ich nicht gefunden.
  - Die Kachelanzeige (`abenteuer-kachel`) ist ein verstecktes Feld für die Tests.
  - Der Testschalter `__abenteuerOhneMaia` setzt nur Playwright; im Spiel setzt ihn niemand.

### A2 Zugang über das Adminmenü: in der Leserfassung gesperrt

- In der Leserfassung fehlt die Aufgabenseite samt Karte „Schach-Abenteuer“ („Spiel öffnen“).
  - Drei Sekunden auf „Profil“ öffnen nichts.
  - Die Adresse `/app/#aufgaben` öffnet nichts.
- Damit bleibt für Leser nur ein Weg ins Spiel: die Adresse `/app/#abenteuer`.
- Die Karte auf „Spielen“ erscheint erst, wenn das Paket geladen ist oder ein Spielstand besteht.
  Das war der Wunsch des Autors vom 8.11.2026: ohne Spiel sieht die App aus wie bisher.
- **Folge:** In der Leserfassung finden Leser das Spiel nicht von selbst. Das ist so gewollt,
  solange das Spiel verborgen bleiben soll. Soll es mit dem Schritt nach main sichtbar werden,
  fehlt noch der sichtbare Einstieg. FORTSCHRITT nennt ihn „Einstieg über die Seite Spielen“ als
  nötig vor der Veröffentlichung; das ist Frage F1 unten.

### A3 main baut heute die Fassung des Autors

- Cloudflare baut main mit `npm ci && npm run build` (`docs/VEROEFFENTLICHUNG.md`). Die Leserfassung
  ist erst für 1.0 vorgesehen, und der Autor testet auf main mit der Aufgabenseite.
- Kommt das Spiel so auf main, sieht jeder, der `/app/#abenteuer` öffnet, die Testleiste.
- Das schadet niemandem: Wer sie nutzt, gewinnt nur das eigene Spiel. Es wirkt aber unfertig.
- Siehe Frage F2.

### A4 Spielpaket: liegt in beiden Fassungen bereit

- `dist/abenteuer/` hat 1394 Dateien und 126 MB, Paketversion `0.3.56-ad13f4a3`.
  - Die Paketversion ist die App-Version plus ein Hash über den Inhalt.
  - Jede Änderung am Inhalt ergibt also eine neue Paketversion, und die Startkarte meldet
    „neue Version des Spiels“.
- Großbilder, Figuren und Musik kommen aus dem privaten Repository.
- Maia (91,7 MB) liegt daneben unter `/maia/`. Beide sind nicht vorab im Service Worker
  (`globIgnores`) und laden erst auf Wunsch.
- Grenzen von Cloudflare passen: 1824 Dateien im ganzen Bau, keine Datei über 20 MB, die
  Maia-Netze sind in Teile zu 15 MB zerlegt.
- **Risiko:** Bei Cloudflare holt der Bau die gekaufte Grafik mit `GRAFIK_TOKEN`. Ohne Schlüssel
  baute er bisher still mit Platzhaltern weiter, auch auf main.
  - Neu: `skripte/hole-privatgrafik.mjs` bricht beim Bau von main (`WORKERS_CI_BRANCH=main`) ab,
    wenn Schlüssel oder Holen fehlen. Dann bleibt die alte Fassung online, und das Protokoll
    nennt den Grund.
  - Vorschauen und beta bauen weiter mit Platzhaltern.
  - Ob `GRAFIK_TOKEN` auch für die Produktion eingetragen ist, sieht nur der Autor im
    Cloudflare-Dashboard (B4).

### A5 beta gegen main

- main hat einen Commit, der beta fehlt: `7bae5b35` vom 17.11.2026, „Startseite: Das Buch ist
  erschienen – Thalia, Amazon und ISBN, Version 0.3.55“.
- Ein Ersetzen von main durch beta nähme die Links zum erschienenen Buch zurück. Deshalb main
  zuerst nach beta mergen.
- Geprüft per `git merge-tree`: Konflikte nur in `app/package.json` und `app/package-lock.json`
  (Versionsnummer) sowie in `docs/AUFGABEN_AUTOR.md` und `docs/FORTSCHRITT.md`.
  - Startseite (`app/index.html`, CSS) und Texte (`de.json`, `en.json`) gehen ohne Konflikt durch.
- **Versionsnummer:** beta steht seit dem 8.11.2026 auf 0.3.56, main auf 0.3.55. Für den Schritt
  braucht es eine neue Nummer.
  - Empfehlung: 0.4.0, weil das Spiel ein großer Schritt ist.
  - Sonst meldet die installierte App kein Update, und das Paket hieße weiter `0.3.56-…`.

### A6 Speicherstände der Leser

- main speichert in Format 10, beta in Format 11 (mit Spielstand, Ton und Steuerkreuz des Spiels).
- Ab dem Schritt haben echte Leser Daten. Die Ausnahme der Beta („Speicherstände dürfen verloren
  gehen“) gilt für sie nicht mehr.
- Neu: `app/src/speicher/format10.test.ts` prüft, dass Daten aus Format 10 verlustfrei
  übernommen werden. Nur der leere Spielstand und die Vorgaben des Spiels kommen dazu. Grün.

## B Checkliste „Vor dem Schritt nach main“

In dieser Reihenfolge. **(Autor)** heißt: nur der Autor kann es tun.

- **B1 Freigabe:** Der Autor hat durchgespielt und gibt frei (**Autor**). Offene Punkte aus seinem
  Durchspielen sind erledigt oder bewusst verschoben.
- **B2 Entscheidungen F1 und F2** unten sind getroffen und umgesetzt.
- **B3 main nach beta mergen:** `git fetch origin main beta`, dann auf einem Zweig von beta
  `git merge origin/main`.
  - Konflikte in Version und docs von Hand lösen. Die Startseite muss „Das Buch ist erschienen“
    mit Thalia, Amazon und ISBN zeigen.
  - Prüfen: `git log HEAD..origin/main` ist leer.
- **B4 Cloudflare (Autor):** Workers & Pages › `schach-von-grund-auf` › Settings.
  - Ist `GRAFIK_TOKEN` für die Produktion (main) eingetragen und gültig? Ohne ihn bricht der Bau
    von main jetzt ab (A4).
  - Build command der Produktion bleibt `npm ci && npm run build`, außer F2 entscheidet für die
    Leserfassung.
  - `NODE_VERSION` 22.
- **B5 Versionsnummer:** in `app/package.json` und `app/package-lock.json` erhöhen (Empfehlung
  0.4.0, A5).
  - Die Paketversion des Spiels folgt von selbst: App-Version plus Hash.
  - Versionsnotizen aus `versionsnotizen_entwurf.md` dort eintragen, wo die App ihre Neuerungen
    zeigt.
- **B6 Prüfungen:**
  - `npm run pruefen`, `npm run build`, `npm run build:veroeffentlichung`.
  - CI ganz grün.
  - Dazu die Leserfassung im Browser: `LESERFASSUNG=1 PLAYWRIGHT_NUR_CHROMIUM=1 CHROMIUM_PFAD=…
    npx playwright test abenteuer-leserfassung` nach `npm run build:veroeffentlichung`.
- **B7 Werkzeug:** `node skripte/pruefe-vor-main.mjs` nach `git fetch origin main` und einem Build
  (im Ordner `app/`). Prüft:
  - Arbeitsstand eingecheckt;
  - die Versionsnummer liegt über der von main;
  - nichts von main fehlt;
  - Spielpaket gebaut, passend zur App-Version und mit echter Grafik.
  Es nennt auch, welche Fassung in `dist/` liegt. Alle Punkte müssen „ok“ sein.
- **B8 Service-Worker-Update:** Nach dem Push wartet `pipeline.wartung` bis zu 15 Minuten, bis
  Cloudflare ausliefert. Dann auf dem Handy die installierte App öffnen (**Autor**):
  - sie meldet „Neue Version“ (`registerType: prompt`);
  - nach dem Tippen zeigt sie die neue Nummer (Einstellungen › Über die App);
  - Daten und Lernstand sind noch da (A6).
  - Ein schon geladenes Spiel meldet auf der Startkarte „neue Version des Spiels“ und lädt nur,
    was sich geändert hat. Maia bleibt im Speicher `maia-1`.
- **B9 Spiel auf main (Autor, iPhone und Android):**
  - `/app/#abenteuer` öffnen, Spiel laden, Einleitung bis ins Wohnzimmer.
  - Eine Partie und ein Rätsel spielen. Je nach F2 gibt es keine Testleiste.
  - Flugmodus an, App neu öffnen, weiterspielen.
- **B10 Nachher:**
  - `docs/FORTSCHRITT.md` und `docs/ENTSCHEIDUNGEN.md` nachtragen.
  - Erledigte Testpunkte aus `docs/AUFGABEN_AUTOR.md` löschen.
  - `docs/spiel/31_Veroeffentlichung.md` (rechtliche Punkte, Sensibilitätslesung J6) gilt weiter
    für die Veröffentlichung des Spiels an alle Leser, nicht für diesen Schritt allein.

## Fragen an Hauptchat und Autor

- **F1 Sichtbar oder verborgen?** Soll das Spiel mit dem Schritt nach main für Leser sichtbar sein
  oder weiter nur über `#abenteuer` und das Adminmenü erreichbar?
  - **Empfehlung: verborgen lassen**, bis die offenen Punkte zur Veröffentlichung in
    `31_Veroeffentlichung.md` geklärt sind: Sensibilitätslesung J6, Lizenzen L4 und L5, Prüfung
    der Datenschutzerklärung.
  - Danach eine Karte auf „Spielen“ auch ohne Paket („Schach-Abenteuer: das Spiel zum Buch,
    einmal 216 MB laden“). Das ist ein kleiner Schritt in `Abenteuerkarte.tsx`.
  - Noch nicht umgesetzt, weil es die Veröffentlichung betrifft (Regel 9, Ausnahme).
- **F2 Testleiste auf main:** Bis 1.0 baut main die Fassung des Autors (A3).
  - **Empfehlung:** Die Testleiste nur zeigen, wenn auf diesem Gerät die Aufgabenseite geöffnet
    wurde, mit einem Merker im Gerät wie beim Adminmenü. Dann sieht der Autor sie auf main und
    beta, Leser auf main nie.
  - Kleiner Eingriff in `testende.ts`; die Oberflächentests müssten den Merker setzen.
  - Die andere Möglichkeit: main auf `build:veroeffentlichung` stellen. Dann verliert der Autor
    die Aufgabenseite auf main und testet nur noch auf beta.
  - Noch nicht umgesetzt; Hauptchat bitte entscheiden.

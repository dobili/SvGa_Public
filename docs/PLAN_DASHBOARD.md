# Plan R57: Admin-Dashboard (Stand 24.10.2026)

Idee des Autors vom 24.10.2026. **Stand 24.10.2026 vormittags:** Stufe 1 und 2 gebaut (Worker
`app/worker/`, Seite `/admin/` aus `app/admin/` und `src/admin/`, Wartungslauf
`.github/workflows/wartung.yml` mit `pipeline/wartung/`, Meldeformular in der App); offen sind
die Werkzeug-Links (Punkt 18), „Was ist neu“ und der Wartungshinweis (16, 17), axe und Ladezeit
der Live-Seite (4) und der Abgleich mit dem Buchstand (7, braucht Zugang zu den privaten
Buchquellen aus GitHub Actions). Diese Datei hält Funktionsumfang,
Aufbau und die Einrichtungsschritte fest. Sie enthält keine Zugangsdaten; die legt der Autor
selbst in Cloudflare, GitHub und den Einstellungen der Claude-Umgebung an.

## Aufbau

- **Prüfungen:** GitHub Actions, wöchentlich und nach jedem Push nach `main`. Ergebnis als Bericht
  (JSON, Ampel je Punkt). Ein roter Punkt lässt den Lauf scheitern; GitHub schickt dann von selbst
  eine Mail an den Autor.
- **Speicher:** Cloudflare D1 (Datenbank `svga-admin`), Bindung `ADMIN_DB` in `app/wrangler.jsonc`
  (Database ID `eee93b47-008d-4d08-875d-a9a73aa98b32`, vom Autor am 24.10.2026 angelegt; sie ist
  kein Geheimnis). Die Bindung kommt erst mit dem Worker-Code in Stufe 2 in die Datei. Die
  Tabellen legt der Code beim ersten Aufruf selbst an.
- **Access (eingerichtet 24.10.2026):** Selbst gehostete Anwendung mit den Zielen
  `schach-von-grund-auf.com/admin` und `schach-von-grund-auf.com/api/admin`; Regel „Nur Autor“
  (Einmalcode) und Service Token für Claude (Umgebungsvariablen `CF_ACCESS_CLIENT_ID`,
  `CF_ACCESS_CLIENT_SECRET`, wirksam ab der nächsten Sitzung).
- **Turnstile (eingerichtet 24.10.2026):** Site Key `0x4AAAAAAFjr7y8zQDfrZp3I` (öffentlich, kommt
  in das Meldeformular); den Secret Key trägt der Autor später als `TURNSTILE_SECRET` ein.
- **Wichtig (Befund 24.10.2026):** Die Website ist ein Cloudflare Worker nur mit statischen Dateien
  (`app/wrangler.jsonc`), kein Pages-Projekt. Solange er keinen Code hat, sperrt Cloudflare die
  Felder für Secrets und Bindings. Deshalb zuerst ein kleiner Worker-Code (`main` in
  `app/wrangler.jsonc`, Assets bleiben), erst danach trägt der Autor die Secrets unter Settings ›
  „Runtime variables and secrets“ ein.
- **Schnittstellen:** Code des Workers (statt Pages Functions):
  `/api/melden` (öffentlich, Meldungen aus App und Website, mit Drosselung und optional
  Turnstile), `/api/admin/*` (nur hinter Cloudflare Access), `/api/bericht` (Upload des
  Prüfberichts aus GitHub Actions mit gemeinsamem Schlüssel `BERICHT_SCHLUESSEL`).
- **Seite:** `/admin/`, hinter Cloudflare Access (Einmalcode an die Adresse des Autors).
- **Öffentliches Repository:** Code öffentlich, Meldungen und Berichte nur in D1.

## Funktionen

### Stufe 1: Prüfungen (ohne Einrichtung durch den Autor möglich)

1. Links: Literatur und Webseiten aus den Buchdaten (Kapitel 12, Glossar), Trainingsseiten,
   Lizenzseite, Impressum, Datenschutz, die neuen Werkzeug-Links.
2. Lichess: Eröffnungsliste (Abgleich mit `inhalte/lichess`), verwendete Aufgaben noch
   vorhanden, Lizenzangaben unverändert.
3. Live-Seite: ausgelieferte Version gleich `main`; Service Worker und Manifest erreichbar;
   robots.txt, sitemap.xml, Sicherheits-Kopfzeilen.
4. Qualität der Live-Seite: axe (Barrierefreiheit) und Ladezeit auf drei Bildschirmen, Größe des
   App-Pakets mit Verlauf.
5. CI: Stand von `main`, Tests, die erst beim Wiederholen grün wurden (wackelige Tests).
6. Abhängigkeiten: `npm audit`, neue Hauptversionen (React, Vite, chessops), neue
   Stockfish-Version, geänderte Lizenzen.
7. Buch: `schachbuch-quellen` neuer als die Daten der App (Datenlauf fällig); Zahl offener
   Testpunkte und Rückfragen in `AUFGABEN_AUTOR.md`, Punkte älter als 14 Tage.
8. Domain und Zertifikat: Ablaufdatum.

Bis Stufe 2 steht der Bericht als Zusammenfassung im Actions-Lauf; Rot kommt per GitHub-Mail.

### Stufe 2: Dashboard und Meldungen

9. Ampelübersicht mit Verlauf (wann zuletzt grün, seit wann rot).
10. Meldungen aus der App (Zahnrad › Fehler melden) und der Website: Text, App-Version, Gerät,
    Bildschirm, Sprache; auf Wunsch FEN oder PGN der aktuellen Stellung. Status „neu, in Arbeit,
    erledigt, kein Fehler“, Doppelte zusammenfassen.
11. „Fehler im Buch melden“ an jeder Abbildung (Abbildungsnummer und FEN mitgeschickt), als
    eigene Kategorie „Buchbefund“.
12. Wünsche der Leser als eigene Kategorie.
13. Freiwillige Absturzberichte: Bei einem Fehler bietet die App an, die technische Meldung
    mitzuschicken (nur mit Zustimmung, ohne persönliche Daten).
14. Knopf „Aufgabe für Claude“: fasst alle roten Punkte und offenen Meldungen zu einem fertigen
    Prompt zusammen.
15. Wochenübersicht per Mail (nur mit Mailversand, siehe Einrichtung Schritt 7).

### Stufe 3: Ergänzungen

16. „Was ist neu“: Liste der Änderungen je Version, aus den Commit-Texten vorbereitet, vom Autor
    freigegeben, in der App sichtbar.
17. Wartungshinweis: Text, den die App beim Start einmal zeigt (etwa „Neue Kapiteldaten“), im
    Dashboard schreibbar.
18. Werkzeug-Links (R57-Zusatz): `inhalte/de/werkzeuglinks.json` mit Fundstelle im Buch, auf den
    Trainingsseiten und im Trainingsteil der App; Prüfung in Stufe 1.

Bewusst nicht: Nutzungsstatistik oder Tracking (Cloudflare Web Analytics wurde aus
Datenschutzgründen abgeschaltet).

## Einrichtung durch den Autor

Siehe `docs/AUFGABEN_AUTOR.md`, sobald R57 ansteht; die Schritte stehen auch in der Antwort im
Chat P1 vom 24.10.2026. Kurz: D1 anlegen und binden, Secret `BERICHT_SCHLUESSEL` in Cloudflare
und GitHub, Cloudflare Access für `/admin` und `/api/admin`, GitHub-Mail bei gescheiterten
Läufen, optional Mailversand und Turnstile, optional ein Access-Servicetoken als
Umgebungsvariablen `CF_ACCESS_CLIENT_ID` und `CF_ACCESS_CLIENT_SECRET` in der Claude-Umgebung.

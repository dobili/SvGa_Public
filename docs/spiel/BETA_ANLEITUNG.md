# Beta-Fassung (Entwicklerversion) des Schach-Abenteuers

Stand: 07.11.2026 (Entscheidung D2). Die Beta ist die Vorschau-Adresse des Zweigs `beta` bei
Cloudflare: eine eigene Adresse, also für den Browser eine eigene App mit eigenem Speicher, neben
der richtigen App installierbar. Vorschau-Builds heißen „Schach von Grund auf (Beta)“ mit dem
Kurznamen „Schach Beta“ (vite.config.ts liest `WORKERS_CI_BRANCH`). Der Haupt-Chat pusht den
Stand des Spiels auf `beta`; `main` bleibt die richtige App und bekommt das Spiel erst, wenn es
fertig ist.

## Einmalig einrichten (Autor, Cloudflare-Dashboard)

1. **Vorschau-Adresse finden:** Workers & Pages › `schach-von-grund-auf` › „Deployments“ (oder
   „Versions“). Nach dem ersten Push auf `beta` erscheint dort ein Build mit dem Zweig `beta` und
   einer Adresse der Form `beta-schach-von-grund-auf.<dein-konto>.workers.dev`. Diese Adresse
   ist die Beta. (Falls keine Vorschau-Builds laufen: Settings › Build › „Preview builds“ /
   „Non-production branch builds“ einschalten; Build command und Deploy command wie für
   `main`, siehe `docs/VEROEFFENTLICHUNG.md`.)
2. **Nur für dich (Cloudflare Access):** Zero Trust › Access › Applications › „Add an
   application“ › Self-hosted. Application domain: die Vorschau-Adresse aus Schritt 1
   (Subdomain `beta-schach-von-grund-auf`, Domain `<dein-konto>.workers.dev`). Policy: Allow,
   Include „Emails“ mit deiner Adresse (wie beim Dashboard unter `/admin`). Session duration so
   lang wie möglich (ein Monat), damit die installierte Beta nicht ständig nach der Anmeldung
   fragt. Hinweis: Die Workers-Vorschau-Adresse muss dafür in Access als Domain erlaubt sein; wenn
   Cloudflare `workers.dev` dort nicht annimmt, Alternative in Schritt 4.
3. **Installieren:** Die Vorschau-Adresse im Handy-Browser öffnen, anmelden, dann wie die App
   „Zum Home-Bildschirm“. Das Symbol heißt „Schach Beta“. Daten der richtigen App bleiben
   unberührt; wer Daten in der Beta haben will, spielt eine Sicherung der richtigen App ein
   (Profil › Einstellungen › Deine Daten).
4. **Alternative, falls Access die workers.dev-Adresse nicht schützt:** eigene Subdomain
   `beta.schach-von-grund-auf.com` als zweiten Worker (Wrangler-Umgebung `beta` mit eigenem
   Namen und Route) und Access darauf. Das richtet der Haupt-Chat ein, wenn Schritt 2 scheitert;
   dann bitte Bescheid sagen.

## Laufender Betrieb

- Jeder Push auf `beta` baut die Beta neu; die installierte Beta meldet das Update wie die App
  („Neue Version, Aktualisieren“).
- Das Spielpaket (`/abenteuer/`) lädt die Beta von ihrer eigenen Adresse; der Spielstand liegt in
  den Nutzerdaten der Beta (Format 11).
- Testpunkte der Beta stehen wie immer in `docs/AUFGABEN_AUTOR.md` („Neu in 0.3.5x: Schach-
  Abenteuer“); die Aufgabenseite in der Beta (drei Sekunden auf das Zahnrad) zeigt sie.
- Meldungen aus der Beta („Fehler melden“) landen im selben Dashboard wie die der App.

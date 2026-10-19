# Veröffentlichung des Repositorys (16.10.2026)

Das Repository `dobili/SvGa_Public` ist der öffentliche Stand der App. Es beginnt mit einem
einzigen Anfangsstand (Version 0.2.34). Die ganze Arbeitsgeschichte bis dahin, mit Prüfhilfen,
Berichten und Arbeitsnotizen, liegt im früheren privaten Repository des Autors (Archiv).

Grund: Die freien Actions-Minuten des privaten Repositorys waren verbraucht, und der Autor möchte
keine Kosten. In einem öffentlichen Repository kosten die Prüfungen nichts. Ein neues Repository
statt des alten, weil dessen Geschichte ältere Prüfhilfen mit Buchtext enthält, die auch nach dem
Löschen sichtbar geblieben wären.

## Was beim Anfangsstand wegfiel

- `docs/freigabe/` (Prüfhilfen, Buchvorschläge), `docs/berichte/`, `docs/archiv/`,
  `docs/entscheidungshilfe/`: Sie zitierten Buchtext oder waren erledigt. Die Pipeline schreibt
  Prüfhilfen und Berichte seitdem nach `buch/arbeit/` (nur lokal, wie die Buchquellen).
- Geprüft vor der Veröffentlichung: keine Zugangsdaten; Buchtext nur als kurze Regelzitate mit
  Fundstelle im Code (CLAUDE.md, Regel 3) und in den Daten, die die App ohnehin ausliefert
  (`inhalte/`, `app/public/daten/`, Lizenz „Alle Rechte vorbehalten“, `docs/LIZENZEN.md`).

## Schritte des Autors

1. Kostenbremse: github.com › Settings › Billing and licensing › Budgets and alerts, Actions 0 $
   mit „Stop usage when budget limit is reached“.
2. Neues Repository `dobili/SvGa_Public` angelegt (erst privat), Claude-App und „Cloudflare
   Workers and Pages“ dafür freigegeben (github.com/settings/installations › Configure).
3. Claude pusht den Anfangsstand nach `main`.
4. Durchsehen, dann Settings › General › Danger Zone › Change visibility › Make public.
5. Cloudflare: Worker `schach-von-grund-auf` › Settings › Build › Git repository auf
   `dobili/SvGa_Public` umstellen (Werte siehe unten).
6. Altes Repository: Settings › General › Danger Zone › „Archive this repository“ (schreibgeschützt,
   keine Actions mehr).

Werte für Cloudflare (wie bisher): Build command `npm ci && npm run build`, Deploy command
`npx wrangler deploy`, Preview command `npx wrangler preview`, Path (Root directory) `app`,
Variable `NODE_VERSION` = `22`, Produktionszweig `main`, Vorschau-Builds an.

## Version 1.0 freischalten (AP 17, vorbereitet in 0.2.108)

Die Fassung für die Leser entsteht mit `npm run build:veroeffentlichung` (Umgebungsvariable
`VEROEFFENTLICHUNG=1`): ohne Aufgabenseite des Autors; Englisch bleibt drin (Entscheidung V1, 19.10.2026). Für 1.0 in
Cloudflare den Build command des Produktionszweigs auf `npm ci && npm run build:veroeffentlichung`
stellen oder die Variable `VEROEFFENTLICHUNG` = `1` nur für die Produktion setzen (prüfen, ob
Cloudflare Variablen je Umgebung trennt; dann behalten die Vorschau-Builds die Aufgabenseite als
Testweg des Autors). Vorher: `python -m pipeline.pruefen.daten --veroeffentlichung
app/public/daten/de/a1` (keine Entwürfe), Version 1.0.0, alle Prüfungen grün. Checkliste:
`docs/ABNAHME_1.0.md`.

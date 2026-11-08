# Schach-Abenteuer: Anschlüsse in der App (Info für den App-Chat)

Stand: 8.11.2026, abends. Gepflegt vom Spiel-Chat (Sitzung „SA Storyspiel“). Diese Datei sagt dem
Chat, der an der App selbst arbeitet, was das Spiel außerhalb seiner eigenen Ordner berührt, damit
beide Stränge später sauber zusammengeführt werden können. Bei jeder neuen Änderung an der App
ergänzt der Spiel-Chat diese Datei.

## 1. Grundsätze (Wunsch des Autors, 8.11.2026)

- Der Spiel-Chat ist nur für das Spiel zuständig. Fragen und Änderungen der App betreut der App-Chat;
  der Spiel-Chat gibt dazu höchstens Empfehlungen (Abschnitt 6).
- Anschlüsse in der App sind erlaubt, solange **Aussehen und Funktion der App ohne geladenes Spiel
  unverändert** bleiben. Jede neue Änderung meldet der Spiel-Chat dem Autor im Chat und trägt sie hier ein.

## 2. Zweige und Zusammenführen

- Arbeitszweig des Spiels: `claude/friendly-shannon-y8bf90`, jeder geprüfte Stand auch auf `beta`
  (Vorschau-Build, Name „Schach Beta“). Noch **nicht auf `main`**.
- Version im Zweig: 0.3.56 (`app/package.json`). Beim Zusammenführen mit `main` die Version neu
  vergeben (höher als beide Stände).
- Eigene Ordner des Spiels (dort ändert nur der Spiel-Chat): `app/src/abenteuer/`,
  `inhalte/abenteuer/`, `docs/spiel/`, `schemas/abenteuer-*.json`, `pipeline/abenteuer/`,
  `pipeline/tests/test_abenteuer*.py`, `app/tests/e2e/abenteuer*.spec.ts`,
  `app/skripte/baue-abenteuerpaket.mjs`, `app/src/daten/generiert/abenteuer-*.ts` (erzeugt).
- Wahrscheinliche Konfliktstellen beim Zusammenführen: `app/src/i18n/de.json` und `en.json`
  (Schlüssel `abenteuer.*`, `partie.zurueckZurStadt`), `app/src/speicher/format.ts` (Format 11),
  `app/package.json` und `package-lock.json` (Pakete `phaser`, `inkjs`), `docs/AUFGABEN_AUTOR.md`,
  `docs/LIZENZEN.md`, `docs/FORTSCHRITT.md`.

## 3. Anschlüsse in der App, Datei für Datei

| Datei | Was das Spiel dort braucht | Wirkung ohne Spiel |
| ----- | -------------------------- | ------------------ |
| `app/src/app/App.tsx` | Vollbild ohne Leiste für die Zusatzansicht des Spiels und für Partien mit `einstellung.abenteuer` | keine |
| `app/src/app/zusatzansichten.ts`, `spruenge.ts` | Zusatzansichten `abenteuer` und `abenteuer-aufgaben`, Adresse `#abenteuer` | keine (nur über die Adresse erreichbar) |
| `app/src/ui/bildschirme/Spielen.tsx` | Karte „Schach-Abenteuer“ | seit 8.11. abends unsichtbar, solange das Spiel nicht geladen ist und kein Spielstand existiert |
| `app/src/ui/bildschirme/Partie.tsx`, `ui/komponenten/partie/partieerweiterungen.ts` | Erweiterungspunkt für Leisten unter dem Brett (Kartenleiste) | keine (Leiste nur bei Partien mit `abenteuer`) |
| `app/src/ui/komponenten/partie/Partieabschluss.tsx` | Knopf „Zurück zur Stadt“ | keine (nur bei Partien mit `abenteuer`) |
| `app/src/ui/komponenten/partie/botzug.ts`, `app/src/spiel/botzeit.ts` | `wahlRestzeit`: gefühlte Zeitnot des Bots nach dem Spruch „Großes Maul“; `wahlHaeufigkeit`: Stärkewechsel mitten in der Partie (Halbfinale, 8.11. abends) | keine (ohne `einstellung.abenteuer` gleich der echten Restzeit und Häufigkeit) |
| `app/src/spiel/partie.ts`, `app/src/speicher/partienLesen.ts` | Feld `einstellung.abenteuer` `{ kennung, zeitnotBis?, abgelenktAb? }` | keine (fehlt bei gewöhnlichen Partien) |
| `app/src/speicher/format.ts` | **Format 11**: Feld `abenteuer` im Speicher (Spielstand des Spiels, sonst `null`); Brettart `pavillon` | Format steigt von 10 auf 11; ältere Stände werden ohne Verlust gelesen |
| `app/src/training/extras.ts`, `ui/komponenten/extras/*` | Bedingung `abenteuer` (Funde), Extra „Brett Riverton-Pavillon“ | seit 8.11. abends unsichtbar ohne Spielstand (`sichtbareExtras`), Zähler wie vorher |
| `app/src/ui/brett/masse.ts`, `app/public/extras/brett-pavillon.svg` | Farben des Pavillon-Bretts | keine (nur mit dem Extra wählbar) |
| `app/src/ui/stil/basis.css` | Abstand unten im Vollbild | keine |
| `app/src/sw/dateiliste.ts`, `app/vite.config.ts`, `app/public/_headers` | Spiel als eigener Baustein, Zusatzpaket `public/abenteuer/` nur auf Wunsch geladen; Beta-Name im Manifest | keine Mehrlast beim Start |
| `app/skripte/pruefe-groesse.mjs` | Größenbudget weist das Zusatzpaket gesondert aus | keine |
| `app/package.json` | Pakete `phaser` 4.2.1, `inkjs` 2.4.0; `vorbereiten` baut das Zusatzpaket | keine |
| `app/src/ui/bildschirme/lizenzbausteine.ts`, `docs/LIZENZEN.md` | Lizenzen von Phaser und inkjs | Lizenzseite zeigt zwei Einträge mehr |
| `app/src/i18n/de.json`, `en.json` | Schlüssel `abenteuer.*` u. a. | keine |
| Tests: `speicher/format.test.ts`, `spiel/buchkuerzel.test.ts`, `sw/dateiliste.test.ts`, `tests/e2e/varianten.spec.ts` | an Format 11 und den neuen Baustein angepasst | – |

## 4. Format 11 im Detail

`daten.abenteuer` hält den Spielstand (`app/src/abenteuer/schnittstelle/spielstand.ts`, eigene
Version im Stand). Gelesen wird er nur über `abenteuerstandAus` (robust gegen Lücken). Die App
selbst liest daraus nur die Funde (Extras). Ein Stand ohne Feld gilt als „kein Spiel begonnen“.

## 5. Antworten des Autors zur App, eingegangen über die Entscheidungsseite des Spiels (8.11.2026)

Der Autor hat auf der Entscheidungsseite (inzwischen nur noch Spielfragen) auch Fragen der App
beantwortet. Sie stehen zusätzlich in `docs/AUFGABEN_AUTOR.md`, Teil 2, und gehören dem App-Chat:

- Q10-1 Empfehlung folgen (Notiz mit einer Spielidee, im Spiel umgesetzt: Karte „Farbwahl“).
- Q10-2 Rückfrage: „Betrifft das die Anzeige im Spiel oder die Anzeige in der App unter Profil?“
- Q10-3, Q10-4, Q10-5: Empfehlung folgen.
- Q11-1 Rückfrage: „Erläuter mir das bitte.“
- Q12-4: Empfehlung folgen. Q16-1: Empfehlung folgen.

## 6. Empfehlungen des Spiel-Chats an die App (nur Vorschläge)

1. **Entscheidungsseite für die App:** Der Autor beantwortet Rückfragen gern per Klick (Empfehlung
   folgen, Nein, Notiz). Der Spiel-Chat hat dafür eine private Artifact-Seite mit Datenbank gebaut;
   der App-Chat könnte für Teil 2 der App eine eigene bauen (Muster: Fragen aus `AUFGABEN_AUTOR.md`
   einlesen, Antworten je Frage in der Datenbank der Seite).
2. **Vor dem Zusammenführen:** auf `beta` testen lassen, dann die Versionen beider Zweige abgleichen
   und die Konfliktstellen aus Abschnitt 2 zuerst ansehen.

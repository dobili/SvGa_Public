# Partiebesprechung mit Ambrose (Entwurf und Stand, 25.11.2026)

Wunsch des Autors: Nach seiner ersten Partie gegen den Coach wurde die Partie nicht ausgewertet. Er
wünscht ein Nachgespräch mit Ambrose: die Partie noch einmal ansehen, Ambrose kommentiert in einer
Sprechblase über dem Brett, am Zielfeld des Zuges steht die Marke der Zugklasse (bester Zug,
Fehler, Patzer, brillant, Theoriezug …). Anfangs sehr sparsam, Begriffe erst, wenn der Spieler sie
in der Geschichte kennengelernt hat. Aufruf über das Tagebuch; nach der ersten Partie gegen den
Coach weist Ambrose darauf hin.

## 1. Voller Umfang am Ende

- Im Tagebuch steht bei jeder beendeten Partie unter „Meine Partien“ neben „Ansehen“ der Knopf
  „Besprechen“ (sobald Ambrose die Besprechung angekündigt hat).
- Die Besprechung ist ein eigener Bildschirm im Rahmen der Spielhülle (Kopf mit Porträt, Pixelrahmen,
  Brett im Stil des Ortes). Hoch: Sprechblase über dem Brett, darunter Brett, darunter Bedienung.
  Quer: Brett links, rechts Blase und Bedienung.
- Ist die Partie noch nicht ausgewertet, rechnet die Auswertungs-Engine der App sie durch; Ambrose
  „sieht sie sich an“ (Fortschritt in seiner Stimme, ohne Prozentzahl und ohne Zahlen der Engine).
- Danach: Eröffnungssatz, dann Zug für Zug mit ◀ ▶, dazu „vorige / nächste Stelle“ (⏮ ⏭), die
  nur die Momente anspringen, über die Ambrose etwas sagt. Unter der Bedienung eine Reihe kleiner
  Marken (eine je Moment) zum direkten Sprung.
- Am Zielfeld des gezeigten Zuges steht die Marke der Zugklasse (wie in der App, Zugmarke.tsx). Bei
  einem Fehler zeigt das Brett die Stellung vor dem Zug mit goldenem Pfeil (besserer Zug) und rotem
  Pfeil (gespielter Zug), wie die Sprünge der App-Auswertung (sprung.ts).
- Ambrose sagt je Moment einen bis drei kurze Sätze: Kategorie (Stufe), Begriff (wenn bekannt),
  Folge (ab Stufe 3). Am Ende ein Schlusssatz zum Ausgang.
- Fehlt Ambrose (Tiefpunkt, nach dem Abschied), geht der Held die Partie allein durch: dieselbe
  Bedienung, dieselben Marken, die Sätze als knappe Notizen im Tagebuchton, ohne Porträt; ein
  eigener Eröffnungssatz sagt, warum („Ambrose ist nicht da …“ bzw. nach dem Abschied „Du gehst die
  Partie allein durch. Manchmal weißt du, was er gesagt hätte.“).

## 2. Stufen der Progression (Auslöser)

Zwei getrennte Achsen: wie viel Ambrose sagt (Stufe, nach dem Fortschritt der Geschichte), und welche
Wörter er benutzt (Begriffe, nach den Lektionen).

| Stufe | Auslöser (Dialogvariable)                        | Was dazukommt                                                                                                                                                                          |
| ----- | ------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0     | ohne `besprechungAngekuendigt`                   | keine Besprechung (Knopf fehlt)                                                                                                                                                        |
| 1     | `besprechungAngekuendigt` (Clubraum Maple Falls) | nur die Art des Moments: „Hier ist dir ein Fehler passiert.“, „Hier wäre Sf3 der beste Zug gewesen.“, „Schön.“ Höchstens 4 Momente: Patzer, Fehler, verpasste Chancen, brillant, stark |
| 2     | `endeAkt1Gesehen`                                | dazu der Grund mit den bekannten Begriffen („Danach hing dein Läufer.“), Fehler des Gegners („Hast du es gesehen?“), ungenaue Züge, höchstens 6 Momente                                |
| 3     | `endeAkt3Gesehen`                                | dazu die Folge („Danach etwa Sxe5 und Dh5.“, die ersten zwei Züge der Engine), höchstens 8 Momente                                                                                     |

Begriffe: Ein Begriff gilt als bekannt, sobald der Held eine Aufgabenrunde mit dem passenden Thema
versucht hat (Variable `<ort><Name>Versucht`, die die Hülle nach jeder Runde setzt; die Themen stehen
in `runden.json`). So hängt die Freischaltung an den Lektionen selbst und wächst mit neuen Runden
mit, ohne Liste im Code. Die Zuordnung Thema → Begriff:

| Begriff    | Themen der Runden                         | Erste Runde (Beispiel)                             |
| ---------- | ----------------------------------------- | -------------------------------------------------- |
| haengend   | haengend                                  | `mapleFalls.reiheSam` (Sam, Clubraum)              |
| matt       | matt1, matt2, mattbilder, grundreihenmatt | `mapleFalls.reiheJuno`                             |
| gabel      | doppelangriff                             | `mapleFalls.springerLily`, `riverton.reiheTamsin`  |
| fesselung  | fesselung                                 | `wegRivertonIronwood.tafel`, `ironwood.reiheHank`  |
| spiess     | spiess                                    | `ironwood.reihePriya`                              |
| falle      | falle (Eröffnungsfallen, Grundsätze)      | `wegIronwoodSilicon.tafel`, `siliconBay.reiheNova` |
| struktur   | struktur                                  | `portDelacroix.reiheRemy`                          |
| abzug      | abzug, doppelschach                       | `desertSprings.reiheDot`                           |
| hinlenkung | hinlenkung                                | `desertSprings.reiheTomas`                         |
| umwandlung | umwandlung                                | `wegSiliconDelacroix.tafel`                        |
| endspiel   | endspiel                                  | `summitCity.reiheKit`                              |

Dazu „theorie“ (Theoriezug, Name der Eröffnung) ab `nadelSiliconBay > 0` (Club der
Eröffnungsgrundsätze; Lin: „Ich spiele, was die Theorie sagt.“). Vorher heißt ein Theoriezug nur
„ein bekannter Weg“, ohne das Wort Theorie und ohne Namen.

Ein Moment ohne bekannten Begriff bekommt nur den Satz der Stufe; der Begriff wird nie vorweggenommen.

## 3. Genutzte Bausteine der App

- `ui/komponenten/auswertung/useAuswertung.ts`: Engine-Bewertung je Stellung mit eigener
  Auswertungs-Engine (Tiefe 18), Zwischenspeicher je FEN, Ergebnis über `mitWerten` im Speicher.
- `spiel/auswertung.ts`: `zugurteile` (Zugklassen brillant bis patzer, Theoriezug), `ZEICHEN_JE_KLASSE`.
- `ui/komponenten/rueckblick/useTheorie.ts`, `schach/theorie.ts`, `schach/theorienamen.ts`:
  Theoriezüge und Eröffnungsname.
- `engine/fehlerart.ts` (`fehlerbefundIn`): was der Fehler war (hängende Figur, Drohung, übersehene
  Gabel, Fesselung, Spieß, Abzug, Dame zu früh, König in der Mitte …); `schach/taktikmotive.ts`
  (`erkenneMotive`): welches Motiv der bessere Zug gehabt hätte (für verpasste Chancen und
  brillante Züge).
- `spiel/erklaerung.ts` (`widerlegungAus`): Widerlegung aus der gespeicherten Hauptvariante.
- `ui/komponenten/auswertung/sprung.ts` (Pfeile), `ui/komponenten/rueckblick/Zugmarke.tsx`
  (Marke am Feld), `Brettbereich` (Brett), `useAbenteuerBrettstil` (Pixelbrett).
- Abenteuer: `Huelle`, Porträt, `zieheAus` aus `tischtexte.ts` (Varianten ohne Wiederholung, fester
  Zufall je Partie), `ambroseNichtDa` und `ambroseVerabschiedet` aus `regeln/abwesenheit.ts`.

Nicht übernommen (absichtlich): Verlaufskurve, Genauigkeit in Prozent, Elo-Schätzung, Tabellen
(Ambrose spricht nie von Zahlen, Story-Bibel 5.3, Regel 5).

## 4. Speicherung der Partien

Das Abenteuer speichert die Partien schon: Jede Partie liegt wie alle Partien der App in
`daten.spiel.partien` (Züge in SAN mit Herkunft, Einstellung mit `abenteuer.kennung`, Ende), höchstens
50, die neuesten zuerst. Neu ist nur die Auswertung: Die Besprechung schreibt die Werte, besten Züge,
Abstände und Hauptvarianten mit `mitWerten` in denselben Eintrag (Felder `werte`, `beste`,
`abstaende`, `varianten`), einmal je Partie. Das Speicherformat ändert sich nicht.

## 5. Leistung auf dem Handy

- Die Auswertung rechnet auf der eigenen Auswertungs-Engine (eigener Worker), Tiefe 18, höchstens
  4 Sekunden je Stellung; eine Partie von 40 Zügen braucht auf einem Mittelklassehandy etwa eine
  halbe bis eine Minute. Ergebnisse jeder Stellung kommen sofort in den Zwischenspeicher (je FEN),
  ein Abbruch (Zurück, Bildschirm aus) verliert nichts, was schon fertig ist.
- Fertige Auswertungen liegen im Speicher; eine zweite Besprechung derselben Partie rechnet nichts.
- Die Motive rechnet die Besprechung nur für die gewählten Momente (höchstens 8 Stellungen, ohne
  Engine, Millisekunden).
- Offen (siehe unten): schon während der Partie im Hintergrund vorrechnen, wie die App es tut.

## 6. Texte

Schlüssel in `inhalte/abenteuer/texte/de.json`:

- `besprechung.ambrose.<stufe>.<kategorie>.<n>`: Satz der Kategorie je Stufe (1 knapp, 2 mit
  besserem Zug und Ton, 3 wie 2); Platzhalter `{zug}` (gespielter Zug) und `{besser}` (besserer Zug).
  Kategorien: brillant, stark, fehler, patzer, verpasst, ungenau, theorie, gegnerfehler.
- `besprechung.ambrose.begriff.<begriff>.gegen.<n>` (der Gegner bekam danach das Motiv) und
  `….fuer.<n>` (der eigene, bessere oder gespielte Zug hatte es).
- `besprechung.ambrose.folge.<n>` (Stufe 3, `{folge}`), `besprechung.ambrose.auftakt.<n>`,
  `besprechung.ambrose.schluss.<ausgang>.<n>`, `besprechung.ambrose.ruhig.<n>` (keine Momente),
  `besprechung.ambrose.rechnet.<n>`.
- Dasselbe unter `besprechung.allein.…` (Notizen ohne Ambrose, weniger Varianten).

Je Gruppe drei bis fünf Varianten; gezogen wird ohne Wiederholung in einer Besprechung, mit festem
Zufall je Partie (`zieheAus`), sodass zwei Partien verschieden klingen. Ambroses Stimme nach der
Story-Bibel 5.3: gebaute Sätze, höchstens ein altes Wort je Zeile, Bilder aus seiner Zeit, nie Zahlen,
„Rechenmaschine“ statt Engine, kein Verweis auf das Buch.

## 7. Hinweis nach der ersten Partie gegen den Coach

`maple-falls-clubraum.ink`, Knoten `besprechung_ankuendigen` (setzt `besprechungAngekuendigt`): nach
dem ersten Clubkampf, im Heimweg-Gespräch nach dem Sieg (an „Zu meiner Zeit hätte man so etwas
nicht aufgeschrieben.“) und nach einer Niederlage beim Coach. Nach dem Abschied schweigt Ambrose
(dann kommt der Hinweis nicht; die Besprechung bleibt allein möglich, Variable trotzdem gesetzt).

## 8. Ambrose fehlt: Entscheidung

Im Tiefpunkt und nach dem Abschied ist die Besprechung **ohne ihn** möglich, nicht gesperrt.
Begründung: Die Besprechung ist ein Lernwerkzeug; sie in einem ganzen Akt (Tiefpunkt) oder im
Post-Game zu sperren, nähme dem Spieler genau dann die Rückmeldung, wenn die Gegner am stärksten
sind. Ambrose zu zeigen, wäre ein Bruch der Geschichte (R29, Q21-5). Allein geht der Held die Partie
mit dem durch, was Ambrose ihm beigebracht hat: gleiche Marken und Stufen, knappe Notizen ohne Porträt
und ohne Geist. Nach dem Abschied klingt das an („Manchmal weißt du, was er gesagt hätte.“).

## 9. Stand der Umsetzung (25.11.2026)

Umgesetzt:

- Regeln: `app/src/abenteuer/regeln/besprechung.ts` (offen, Stufe, Begriffe, Stimme) und
  `regeln/besprechungsmomente.ts` (Auswahl je Stufe, Sprung zur nächsten Stelle).
- Analyse: `anbindung/besprechungsmotiv.ts` (Fehlerbefund und Motiv der besseren Folge als Begriff),
  `anbindung/besprechungsdaten.ts` (Zugtext, besserer Zug, Folge, Eröffnungsname, Pfeile).
- Sätze: `anbindung/besprechungstexte.ts`, 196 Texte unter `besprechung.*` in
  `inhalte/abenteuer/texte/de.json` (Ambrose Stufe 1 und ab 2, zwölf Begriffe in zwei Richtungen,
  Folge, Auftakt, Schluss je Ausgang; dieselben Arten als Notizen ohne Ambrose).
- Bildschirm: `anbindung/Besprechung.tsx` mit `useBesprechung.ts` und `besprechung.css`, Zusatzansicht
  `abenteuer-besprechung` (`schnittstelle/modul.ts`, `anbindung/dienste.ts`, `app/zusatzansichten.ts`).
- Tagebuch: „Besprechen“ neben „Ansehen“ (`oberwelt/Tagebuch.tsx`, `oberwelt/Oberwelt.tsx`).
- Ink: `maple-falls-clubraum.ink`, Knoten `besprechung_ankuendigen`, Variable
  `besprechungAngekuendigt`.
- Tests: Vitest für Regeln, Auswahl je Stufe, Sätze je Stufe und Stimme, Vollständigkeit der Texte,
  Motive; Playwright `tests/e2e/abenteuer-besprechung.spec.ts` (Aufruf aus dem Tagebuch hoch und quer,
  ohne Ankündigung kein Knopf, im Tiefpunkt allein).

## Offen

- Auswertung schon während der Partie im Hintergrund (wie Partie.tsx mit `auswertungImHintergrund`):
  nicht eingebaut, weil die Spielhülle neben dem Bot auch Maia, Schutzengel und Zugerraten rechnet;
  erst auf echten Handys messen.
- Ambrose zeigt auf Wunsch die bessere Fortsetzung Zug für Zug auf dem Brett (Variante abspielen).
- Englische Texte (`texte/en.json`) für die Besprechung.
- Lesefassung und Gesamtsimulation kennen die Besprechung nicht (sie ist kein Questschritt).

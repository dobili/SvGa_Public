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
- Seit 26.11.2026 rechnet die Auswertung schon während der Partie (Wunsch des Autors: „Besprechen“
  im Tagebuch sofort bereit): `abenteuer/anbindung/useHintergrundauswertung.ts` in jeder Partie der
  Spielhülle (`PartieHuelle.tsx`), dieselbe Regel wie in der App (`auswertungImHintergrund`): ab
  4 Kernen durchgehend, auf knappen Geräten nur, solange der Spieler am Zug ist, damit der Bot,
  Maia, Schutzengel und Zugerraten ihren Kern für sich haben und die Zugzeit nicht länger wird
  (Bot, Schutzengel und Zugerraten rechnen auf der Engine des Spiels, die Auswertung auf ihrem
  eigenen Worker; Kurzform und Kipppunkt teilen sich den Worker, die Auswertung wartet, solange er
  beschäftigt ist).
- Nach dem Ende rechnet der Nachlauf (`ui/komponenten/auswertung/nachlauf.ts`) die letzten
  Stellungen zu Ende, auch wenn der Spieler schon in der Oberwelt ist, und speichert mit `mitWerten`
  in den Partieeintrag. Beginnt eine neue Partie, hält er an; den Rest rechnet dann die Besprechung
  beim Öffnen. Speichern nur einmal je Partie (kein doppeltes `nachAuswertung`, wenn Nachlauf und
  Besprechung zugleich fertig werden).
- Nur Partien nach den normalen Regeln (Wunsch des Autors, 26.11.2026; `besprechbarePartie` in
  `regeln/besprechung.ts`): ohne Variante oder mit „blind“ und „gehoer“ (nur die Darstellung ist
  anders). Schach960 und jede künftige Variante mit anderen Regeln oder Figuren werden weder im
  Hintergrund ausgewertet noch besprochen; im Tagebuch fehlt dort „Besprechen“, „Ansehen“ bleibt.

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

## 10. Plan B: „Soll ich es dir zeigen?“ (26.11.2026)

- Wo: an Fehlern, Patzern, verpassten Chancen, Fehlern des Gegners, ungenauen Zügen ab Stufe 2,
  ab Stufe 2 auch an brillanten Zügen (dort die Folge des gespielten Zuges, „wie es weitergegangen
  wäre“). Unter dem Satz in der Blase ein Knopf: mit Ambrose „Zeig es mir.“ (dazu sein Angebot als
  letzter Satz der Blase, `besprechung.ambrose.angebot.<n>`), ohne ihn „Besseren Weg zeigen“.
- Welche Folge: die Hauptvariante der Engine aus dem Eintrag (`beste` und `varianten`) an der
  Stelle des besseren Zuges (vor dem Zug; beim Fehler des Gegners nach seinem Zug, Antwort des
  Helden). Kein Rechnen mit der Engine.
- Länge je Stufe (`regeln/zeigefolge.ts`, rein): Stufe 1 nur der bessere Zug; Stufe 2 der Zug und
  die Antwort, bis 4 Halbzüge, wenn darin ein Schlag den Materialgewinn auflöst oder Matt fällt
  (endet die Folge dort); Stufe 3 bis 6 Halbzüge, bei Matt oder Schlag bis dahin gekürzt. Nie über
  das Ende der gespeicherten Variante hinaus; kein Halbzug, der nicht legal ist.
- Ablauf: Das Brett spielt die Folge ab (ein Halbzug je 0,9 Sekunden, letzter Zug hervorgehoben,
  Pfeil des nächsten Zuges), die Blase zeigt den Zug als Text, darunter „Zurück zur Partie“. Ohne
  Bewegung (Einstellung „Bewegung verringern“) sofort die Schlussstellung mit der ganzen Folge
  als Text. Bedienung der Partie ist so lange gesperrt.
- Dateien: `regeln/zeigefolge.ts` (Länge, Abbruch), `anbindung/besprechungsfolge.ts` (Stellungen
  und Texte der Folge aus dem Eintrag), `anbindung/Zeigefolge.tsx` (Abspielen), Besprechung.tsx
  bindet ein; Texte `besprechung.zeigen*`. Tests: Vitest für Länge je Stufe und Abbruch, Playwright
  in `abenteuer-besprechung.spec.ts` (Knopf, Abspielen bis zum Ende, zurück).
- Aufwand: etwa eine halbe Sitzung.
- Umgesetzt (26.11.2026): `regeln/zeigefolge.ts`, `anbindung/besprechungsfolge.ts`,
  `anbindung/useAbspielen.ts` (Takt, bei reduzierter Bewegung sofort die Schlussstellung),
  `anbindung/Zeigefolge.tsx` (Knöpfe), Angebot in Ambroses Blase (`angebotssatz`), Texte
  `besprechung.zeigen*`, `besprechung.zurueckZurPartie`, `besprechung.zeigeStand`,
  `besprechung.ambrose.angebot*`, `besprechung.ambrose.zeigt`, `besprechung.allein.zeigt`. Tests:
  Vitest (Länge je Stufe, Folge aus dem Eintrag), Playwright (Knopf, Abspielen, zurück).

## 11. Plan C: tiefere, persönlichere Sätze (regelbasiert, offline)

Grundsatz: Ein Satz entsteht nur, wenn der Befund ihn sicher trägt; sonst bleibt der bisherige
Satz der Kategorie. Kein Satz nennt Bauerneinheiten oder Zahlen der Rechenmaschine.

1. **Ursache des Fehlers** aus `fehlerbefundIn` (18 Fehlerarten) mit den Einzelheiten:
   - `figurHaengen`: Figur und Feld („Dein Läufer auf c4 stand danach ohne Schutz.“),
   - `drohungIgnoriert`: die Drohung als Zug und Ziel („Dein Gegner drohte Dxf7, und du hast nichts
     dagegen getan.“), bei Matt „drohte Matt“,
   - `taktikUebersehen`: Gabel mit Figur und Feld der Gabel, Linie (Fesselung, Spieß, Abzug) mit
     der Figur, die getroffen wird, Motiv der Antwort,
   - Schlagreflex, falscher Abtausch, Bauernraub, verfrühte Dame, König in der Mitte,
     Tempoverlust, Königsschild, Bauernvorstoß, König passiv, Patt, Bauer eingestellt, Schlag
     verpasst, Bauern- und Königszug ohne Not: je eine Satzgruppe mit den Feldern des Zuges.
   - Die Arten ohne Begriff des Helden (Stufe, Lektionen) sagen die Sache ohne Fachwort.
2. **Verlorenes Material als Figur**: aus der Widerlegung (höchstens 6 Halbzüge) die Bilanz der
   geschlagenen Figuren; genannt wird die größte verlorene Figur („Das kostet dich den Springer.“,
   „… die Dame.“), bei Matt das Matt. Nur, wenn die Bilanz nach der Folge ruhig ist (kein Schlag
   im letzten Halbzug offen); sonst kein Materialsatz.
3. **Phase und Lage vor dem Zug**: Phase aus `schach/phase.ts` (Eröffnung, Mittelspiel,
   Endspiel) und Lage aus dem Wert vor dem Zug (aus Sicht des Helden: klar besser, ausgeglichen,
   schlechter; Schwellen wie die Zugklassen der App). Beispiel: „Du standest gut, und gerade im
   Endspiel wiegt so ein Zug schwer.“ Nur ein Lagesatz je zwei Momente.
4. **Warum brillant oder stark**: Opfer aus `engine/opfer.ts` (welche Figur hergegeben wird) und
   das Motiv der Folge (`erkenneMotive`, Mattbild): „Du gibst den Turm her, und danach steht der
   König im Matt.“ Ohne Opfer und ohne Motiv der knappe Lobsatz.
5. **Rückbezüge** (höchstens einer je Moment, zwei je Besprechung):
   - Lektion und Lehrer: Begriff des Moments → die Runde aus runden.json, die ihn lehrt (Feld
     `steller`, Ort), nur wenn sie gespielt ist (`…Versucht`): „Wie Sam es dir im Club gezeigt
     hat: erst schauen, was hängt.“
   - Gegner: Name aus der Partie, bei Wiederholung derselben Paarung („Gegen Coach Delgado ist dir
     das schon einmal passiert.“).
   - Frühere Partien: dieselbe Fehlerart in einer der letzten fünf ausgewerteten Partien des
     Helden (nur aus den gespeicherten Werten, ohne neue Rechnung; Befund je Partie einmal in den
     Eintrag gelegt, Feld `fehlerarten`, Speicherformat der Beta darf sich ändern).
6. **Eine Anekdote je Besprechung** höchstens, aus Ambroses Zeit (Kaffeehaus, Dampfer, Josiah Hale
   nicht vor dem Stand der Geschichte, der das erlaubt), je Begriff zwei bis drei; nur mit Ambrose,
   nicht allein und nicht nach dem Abschied.
7. **Stimme** nach Story-Bibel 5.3: gebaute Sätze, ein altes Wort je Zeile, Bilder aus seiner
   Zeit, nie Zahlen. Allein als Notiz des Helden, nüchtern.

Umsetzung in Teilen (je eigener Patch):

- C1 Ursache mit Figur und Feld, Material als Figur (`anbindung/besprechungsursache.ts`,
  Texte `besprechung.<stimme>.ursache.<art>.<n>` und `….material.<figur>.<n>`), etwa 180 Texte.
  Umgesetzt (26.11.2026): `anbindung/besprechungsursache.ts` (Ursache aus `fehlerbefundIn`:
  hängende Figur mit Feld, stehengebliebene Drohung mit Zug, Ziel und Feld, Mattdrohung, Gabel mit
  der gegnerischen Figur und ihrem Feld, Fesselung und Spieß nur, wenn vordere und hintere Figur
  dem Helden gehören; die übrigen Fehlerarten mit dem gespielten Zug; Abzug und andere Linien ohne
  eigenen Satz, dort bleibt der Begriff), `anbindung/besprechungsmaterial.ts` (Bilanz der Folge an
  einer ruhigen Stelle, schwerste netto verlorene Figur ohne Figurenausgleich, sonst kein Satz;
  Matt geht vor). Ursache ab Stufe 2 (ersetzt den Satz zum Begriff, Fachwort nur bei bekanntem
  Begriff), Material beim eigenen Fehler auf jeder Stufe, bei einer Chance ab Stufe 2. Texte
  `besprechung.figur.<rolle>.<form>`, `besprechung.<stimme>.ursache.*`, `….material.*`.
- C2 Phase und Lage, Lob mit Opfer und Motiv (`anbindung/besprechungslage.ts`), etwa 80 Texte.
  Umgesetzt (26.11.2026): `anbindung/besprechungslage.ts`. Lage vor einem Fehler oder Patzer aus
  dem gespeicherten Wert (Sicht des Helden): ab 2 Bauern „gut“ oder „schlecht“, bis 0,6
  „ausgeglichen“, dazwischen kein Satz; mit der Phase der App (`lageVon`) als „in der Eröffnung“,
  „im Mittelspiel“, „im Endspiel“; ab Stufe 2, höchstens an jedem zweiten Moment. Opfer eines
  brillanten oder starken Zuges über `opferwert` (wie die Zugklasse „brillant“), genannt wird die
  gezogene Figur, sonst die wertvollste verlorene; auf jeder Stufe. Das Motiv der Folge nennt wie
  bisher der Satz zum Begriff („für“). Texte `besprechung.phase.*`, `….lage.*`, `….opfer.*`.
- C3 Rückbezüge und Anekdoten (`anbindung/besprechungsbezug.ts`, Lehrer aus runden.json),
  etwa 60 Texte.
  Umgesetzt (26.11.2026): `anbindung/besprechungsbezug.ts`. Lehrer je Begriff aus der ersten
  versuchten Runde mit passendem Thema (Feld `steller` in runden.json, Name aus `figur.<name>.name`;
  ohne Namen kein Bezug). Frühere Fehler aus den letzten fünf früheren, ausgewerteten, besprechbaren
  Partien, ohne neues Feld im Speicher: Die Ursachen ihrer eigenen Fehler und Patzer werden aus den
  gespeicherten Werten neu bestimmt (wie in C1). Ab Stufe 2 höchstens zwei Rückbezüge je
  Besprechung, die frühere Partie vor dem Lehrer; mit demselben Gegner ein eigener Satz. Eine
  Anekdote je Besprechung, nur von Ambrose, ab Stufe 2 und nur zu einem Begriff, den der Held
  kennt; nichts zu Reise, Tod oder Josiah Hale (Story-Bibel 2.2). Texte `….bezug.*`,
  `besprechung.ambrose.anekdote.<begriff>.*`.
- C4 Messlauf: 40 Besprechungen aus gespeicherten Partien (phasenpartien.json, Partien des
  Spieler-Durchlaufs) mit Stufen 1 bis 3 und allen drei Stimmen nach `buch/arbeit/besprechung/`
  (Text und HTML, nur lokal), Stichprobe von 100 Sätzen von Hand gegen das Brett geprüft,
  Fehlerquote im Bericht; Sprache, heldneutral und rivalneutral mit 0 Befunden.
- Aufwand: C1 eine Sitzung, C2 eine halbe, C3 eine halbe bis eine, C4 eine halbe; zusammen etwa
  drei Sitzungen.

## Offen

- Auswertung während der Partie (seit 26.11.2026, Abschnitt 5): Zugzeit des Bots auf echten
  knappen Handys messen (2 Kerne: Auswertung nur, solange der Spieler am Zug ist).
- Englische Texte (`texte/en.json`) für die Besprechung.
- Lesefassung und Gesamtsimulation kennen die Besprechung nicht (sie ist kein Questschritt).

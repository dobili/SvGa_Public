# Auftrag mittel-2: Gegner und Begegnungen von Akt 3 als Daten

**Stand:** fertig (mittel-2, 08.11.2026; vorher offen, Haupt-Chat, neunter Auftrag)

**Zweig:** dein fester Sitzungszweig, Basis `claude/friendly-shannon-y8bf90` (vorher hereinholen)
**Darf ändern:** `inhalte/abenteuer/gegner.json` (nur neue Einträge für Akt 3),
`inhalte/abenteuer/begegnungen.json` (nur neue Einträge), `inhalte/abenteuer/texte/de.json` (nur neue
Schlüssel, etwa `figur.<name>.name`), `docs/spiel/auftraege/mittel-2.md`
**Prüfung vor dem Push:** `python -m pytest pipeline/tests`, im Ordner `app/` `npm run pruefen`

## Ziel

Akt 3 steht in der Story-Bibel (dein siebter Auftrag); als Nächstes braucht er Daten. Zuerst die
Gegner und Begegnungen, damit Karten und Dialoge später nur noch darauf verweisen.

## Vorgaben

1. Je Gegner aus Akt 3 (Clubchefs, Clubmitglieder, Straßengegner, Story) ein Profil wie die
   vorhandenen: Kennung `<ort>.<name>`, Rolle, Stärke nach den Versatzbereichen (Pipeline-Test
   prüft: Straße −150..0 auf A, Clubmitglied −100..+50, Clubchef genau E + 160 + 60 · Clubnummer),
   Stil, Eröffnung, Steckbrief mit mindestens einer Zeile.
2. `immunGegen` nach den Vorschlägen von niedrig-1 (ENTSCHEIDUNGEN, „Antworten aus Akt 3“): Dash
   grossesMaul und ablenkung, Batiste alle Sprüche außer schmeichelei, Joggerin grossesMaul,
   Schiffskoch ablenkung. Die Kennungen müssen zu den Konter-Texten passen (`spruch.konter.<name>`).
3. Begegnungen: Clubkämpfe und Partien mit `zeit: "wahl"`, Stellungsduelle aus Abbildungen des
   Buches (Kapitel des Clubs, mit Nummer, Vorteil etwa +1), Uhren wie in der Bibel.
4. Was nicht passt oder fehlt (Clubnummern, Orte ohne Eintrag in `orte.json`), im Bericht nennen.

## Bericht

**Fertig** auf `abenteuer-regelwerk` (Basis 43dc8988 hereingeholt), mit einer Lücke: die drei
Clubchefs und ihre Clubkämpfe (unten, fertig zum Einfügen).

**Neue Gegner** (`gegner.json`, Steckbrief je mindestens eine Zeile):

| Kennung                           | Rolle        | Stärke  | Stil                          | Immun gegen                                       |
| --------------------------------- | ------------ | ------- | ----------------------------- | ------------------------------------------------- |
| `wegIronwoodSilicon.joggerin`     | strasse      | A − 100 | draufgaenger                  | grossesMaul                                       |
| `siliconBay.dash`                 | strasse      | A − 50  | angreifer/draufgaenger        | grossesMaul, ablenkung                            |
| `siliconBay.nova`                 | clubmitglied | A + 50  | universell, Sizilianisch      | –                                                 |
| `siliconBay.theo`                 | clubmitglied | A ± 0   | positionsspieler              | –                                                 |
| `wegSiliconDelacroix.schiffskoch` | strasse      | A − 50  | vereinfacher                  | ablenkung                                         |
| `portDelacroix.batiste`           | strasse      | A ± 0   | verteidiger                   | kuehlerKopf, gruebelfalle, grossesMaul, ablenkung |
| `portDelacroix.remy`              | clubmitglied | A ± 0   | angreifer, Königsgambit       | –                                                 |
| `portDelacroix.lou`               | clubmitglied | A − 50  | positionsspieler              | –                                                 |
| `portDelacroix.celeste`           | story        | A − 300 | universell                    | –                                                 |
| `desertSprings.buck`              | strasse      | A − 100 | angreifer                     | –                                                 |
| `desertSprings.tomas`             | clubmitglied | A ± 0   | verteidiger                   | –                                                 |
| `desertSprings.dot`               | clubmitglied | A + 50  | positionsspieler, Damengambit | –                                                 |

Die Namen der Konter passen: `spruch.konter.joggerin|dash|schiffskoch|batiste|buck` gibt es.

**Neue Begegnungen** (`begegnungen.json`): Stellungsduelle 10 Züge, Mindestvorteil 1,0, Leser Weiß,
alle Abbildungen im dritten und zweiten Auftrag mit der Engine geprüft (Tiefe 12):
`wegIronwoodSilicon.joggerin` (Abb. 4.41, +0,98, Uhr 3 + 2), `siliconBay.dash` (Abb. 1.19, +1,74,
3 + 2), `wegSiliconDelacroix.schiffskoch` (Abb. 6.25, +0,81, 10 + 5), `portDelacroix.batiste`
(Abb. 6.5, +0,84, ohne Uhr), `desertSprings.buck` (Abb. 1.36, +0,84, 3 + 2); dazu
`portDelacroix.celeste` (Partie aus der Grundstellung, ohne Uhr, Szene 68). **Texte:** 14 neue
`figur.*.name`, darunter schon Dr. Lin, Miss Odile und Mira.

**Prüfungen:** `pytest pipeline/tests` 375 bestanden; `npm run pruefen` bestanden (358 Dateien, 2407 Tests).

**Was nicht passt oder fehlt**

1. **Clubchefs nicht angelegt:** Der Pipeline-Test rechnet den Soll-Versatz eines Clubchefs aus der
   Clubnummer seines Ortes in `orte.json`; Silicon Bay, Port Delacroix und Desert Springs haben dort
   noch keinen Eintrag, also wäre der Soll-Wert 160 und der Test rot. Sobald die Orte (Nummern 5,
   6, 7, mit Club und `chef`) stehen, diese Einträge anhängen:

```json
{"kennung":"siliconBay.lin","name":"figur.lin.name","rolle":"clubchef","portraet":"portraets/lin.webp","staerke":{"art":"eingang","versatz":460},"phasenversatz":{"eroeffnung":1,"mittelspiel":-1},"gewichte":{"koenigPassiv":1.5,"taktikUebersehen":0.8},"stil":"positionsspieler","eroeffnung":{"art":"fest","eroeffnungen":["praxis:Italian Game","praxis:Queen's Gambit Declined"],"abweichung":5},"steckbrief":[{"art":"eroeffnung","wert":"praxis:Italian Game"},{"art":"fehlerart","wert":"koenigPassiv"},{"art":"stil","wert":"positionsspieler"}]}
{"kennung":"portDelacroix.odile","name":"figur.odile.name","rolle":"clubchef","portraet":"portraets/odile.webp","staerke":{"art":"eingang","versatz":520},"gewichte":{"koenigsschild":1.6,"tempoverlust":1.2},"stil":"positionsspieler","eroeffnung":{"art":"fest","eroeffnungen":["praxis:French Defense","praxis:English Opening"],"abweichung":15},"steckbrief":[{"art":"stil","wert":"positionsspieler"},{"art":"fehlerart","wert":"koenigsschild"},{"art":"eroeffnung","wert":"praxis:French Defense"}]}
{"kennung":"desertSprings.mira","name":"figur.mira.name","rolle":"clubchef","portraet":"portraets/mira.webp","staerke":{"art":"eingang","versatz":580},"phasenversatz":{"endspiel":-1},"gewichte":{"falscherAbtausch":1.6,"drohungIgnoriert":1.2},"stil":{"angreifer":120,"taktiker":100},"eroeffnung":{"art":"fest","eroeffnungen":["praxis:King's Gambit","praxis:Italian Game: Evans Gambit"],"abweichung":10},"steckbrief":[{"art":"stil","wert":"angreifer"},{"art":"fehlerart","wert":"falscherAbtausch"},{"art":"eroeffnung","wert":"praxis:King's Gambit"}]}
```

Begegnungen dazu (Clubkampf Port Delacroix ohne Karten nach R28, Szene 67):

```json
{"kennung":"siliconBay.clubkampf","gegner":"siliconBay.lin","farbe":"zufall","format":{"art":"partie"},"startstellung":{"art":"grundstellung"},"kartenErlaubt":true,"zeit":"wahl"}
{"kennung":"portDelacroix.clubkampf","gegner":"portDelacroix.odile","farbe":"zufall","format":{"art":"partie"},"startstellung":{"art":"grundstellung"},"kartenErlaubt":false,"zeit":"wahl"}
{"kennung":"desertSprings.clubkampf","gegner":"desertSprings.mira","farbe":"zufall","format":{"art":"partie"},"startstellung":{"art":"grundstellung"},"kartenErlaubt":true,"zeit":"wahl"}
```

Alle Eröffnungsnamen kommen in `praxisbuch.json` vor oder werden im Code schon benutzt. 2. **Orte ohne Eintrag:** `siliconBay`, `portDelacroix`, `desertSprings` und die Wege
`wegIronwoodSilicon`, `wegSiliconDelacroix`, `wegDelacroixDesert` fehlen in `orte.json`; die
Gegner-Kennungen folgen schon der Bibel. 3. **Buck aus Kapitel 1 statt 8:** Die Bibel (Szene 74) nennt Abb. 8.44; der Auftrag will das Kapitel
des Clubs (Desert Springs: Königsangriff, Kapitel 1.6), deshalb Abb. 1.36 (Goldene Angriffsregel).
8.44 bleibt frei für Summit City. 4. **Batiste immun gegen „Kühler Kopf“:** wörtlich nach „alles außer Schmeichelei“; die Karte
wirkt auf die eigene Uhr, Immunität dagegen ändert nichts. Vorschlag: aus der Liste nehmen. 5. **Erinnerung 1858** (Szene 77) und die Joggerin-Stellung aus Kapitel 2 fehlen weiter; die
Erinnerung braucht eine mit der Engine gebaute Stellung aus Ambroses erfundener Partie. 6. **Mama** reist mit nach Port Delacroix, spielt aber keine Partie; kein Profil nötig.

## Letzter Auftrag (erledigt, zur Nachlese)

**Zweig:** dein fester Sitzungszweig, Basis `claude/friendly-shannon-y8bf90` (vorher hereinholen)
**Darf ändern:** `docs/spiel/05_Story_Bibel.md` (neuer Teil „Akt 3“ anhängen),
`docs/spiel/09_Weltbeschreibung.md` (Abschnitte 5.6 bis 5.8 und die Karte in Abschnitt 1, soweit
Akt 3 sie ändert), `docs/spiel/auftraege/mittel-2.md`
**Prüfung vor dem Push:** `npx prettier --check ../docs/spiel` in `app/`

## Ziel

Akt 3 in derselben Form wie Akt 2 (Szenen mit Nummern, Ort, Figuren, Zweck, Dauer, Buchbezug,
Quests, Belohnungen, Wege, Funde, Läden), mit den neuen Schauplätzen aus `10`, Abschnitt 2.

## Vorgaben

1. **Orte:** Silicon Bay (Konzern-Akademie, Dr. Lin, Schummelgeräte, Ambrose fasziniert von der
   KI), **Port Delacroix** statt Old Harbor (O1, O2: Ambroses Geburtsstadt, vom Hurrikan
   zerstörter Club im alten Musikhaus, Wiederaufbau als Nebenquest über drei Besuche, Tiefpunkt:
   Schummelvorwurf, der Held spielt ohne Ambrose, Versöhnung über die Nachfahren, die Klavierbauer
   Whitlock-Duval mit einer Teenagerin ohne Schachinteresse), Desert Springs mit Canyon-Weg (O4,
   Mira). Clubs, Buchkapitel nach `07_Aufgabenzuordnung.md`.
2. **Wege** zwischen Ironwood → Silicon Bay → Port Delacroix → Desert Springs mit Stationen (W4),
   Verkehrsmittel nach 08 (Bus, Fähre oder Küstenzug, Zug durch die Wüste).
3. **Sprüche** (S1 bis S6): Straßengegner mit eigenen Sprüchen und Immunität im Steckbrief; eine
   Szene, in der Ambrose erklärt, warum im Club geschwiegen wird.
4. **Funde und übergreifende Quests:** „Umschlag ohne Brief“ und „Nietenkopf J. H.“ aus Akt 2
   auflösen; eine neue übergreifende Quest anlegen, die in Akt 4 aufgeht.
5. **Ein Flashback** in Port Delacroix (Ambroses Kindheit in der Klavierwerkstatt, kurz, mit einer
   Stellung aus `inhalte/zusatzpartien/klassiker.json`).
6. **Ton:** Der Hurrikan ist echt und ernst, aber nicht traurig erzählt; Wiederaufbau ist Hoffnung.
   Keine realen Personen, Firmen oder Katastrophen-Namen.

## Was nicht dazugehört

Akt 4 (das erfundene Volk O5 und die Varianten kommen dort), Daten, Dialoge, Karten.

## Bericht

**Fertig** auf `abenteuer-regelwerk` (Basis bc09d58a hereingeholt). `05_Story_Bibel.md` hat einen
neuen Teil 3 „Akt 3“ (Abschnitte 16 bis 24, Szenen 51 bis 80, etwa 5 bis 6 Stunden);
`09_Weltbeschreibung.md`: Karte in Abschnitt 1 (Port Delacroix statt Old Harbor, Reise über Ashford
hinaus) und Abschnitte 5.6 bis 5.8 neu. Prettier besteht.

**Inhalt nach Vorgaben**

1. **Orte und Clubs:** Silicon Bay (Club 5, Dr. Lin, E + 460, Eröffnungsgrundsätze; Nova, Theo;
   Straße Dash; Laden Rosies Food-Truck), Port Delacroix (Club 6, Miss Odile, E + 520,
   Bauernstruktur und Pläne; Remy, Lou; Straße Mr. Batiste; Nachfahren Henri und Céleste
   Whitlock-Duval; Laden Gebäckstand), Desert Springs (Club 7, Mira, E + 580, Königsangriff und
   Opfer; Tomás, Dot; Straße Buck; Laden Antiquariat Mr. Okoro). Buchübungen nach `07`.
   Tiefpunkt (Szene 63, Vorwurf durch Remy, Clubkampf ohne Karten, R28/R29), Versöhnung in zwei
   Stufen: Nachfahren in Port Delacroix (Szene 68, O2), ganz im Canyon (Szene 73).
2. **Wege:** `wegIronwoodSilicon` (Bus bis zur Raststätte, Glasbrücke zu Fuß),
   `wegSiliconDelacroix` (Küstenfähre als begehbares Deck, Deich), `wegDelacroixDesert` (Wüstenzug,
   Canyonpfad, Felsbogen), je mit Rätseltafel, Gegner mit Uhr oder Mira, Funden, Figur mit Weisheit.
3. **Sprüche:** Dash (immun gegen „Großes Maul“), Batiste (immun gegen beide), Buck und der
   Schiffskoch (nicht immun), eigene Sprüche je Gegner; Szene 59: Ambrose erklärt, warum im Club
   geschwiegen wird (S2). Grübelfalle und Großes Maul als Belohnungen (Z4: nicht im Laden).
4. **Funde und E4:** 14 Funde; „Umschlag ohne Brief“ aufgelöst (Szene 76, Hales Brief „Ich
   warte.“), „Nietenkopf J. H.“ aufgelöst (Szene 73, Canyonbrücke von 1879); neu **„Die fehlende
   Seite“** (Notizbuch der Hales in der Lobby von Silicon Bay, Victor hat die Seite, Auflösung Akt 4
   in Summit City und Ghost Town).
5. **Flashback:** Klavierwerkstatt 1840 und 1852, Zugerraten `klassik-unsterbliche` Züge 1 bis 11.
6. **Ton:** Hurrikan als Vergangenheit, Wiederaufbau über drei Besuche als Hoffnung; keine realen
   Personen, Firmen oder Sturmnamen.

**Widersprüche und Vorschläge für gesperrte Stellen**

- **Geburtsort:** Teil 1 (Zeitlinie, 2.2) nennt New Orleans. Vorschlag: Zeile 1831 in Teil 1 auf
  „Port Delacroix, im Delta vor New Orleans; Schach in den Kaffeehäusern von New Orleans“ ändern.
- **Jahreszeit:** O1 sagt Spätsommer, 09 Abschnitt 2 setzt Akt 3 in Winter/Frühjahr. Gelöst:
  Hurrikan im letzten Spätsommer, Akt 3 im Winter danach. 09 Abschnitt 2 (Akt-3-Zeile „Old Harbor
  Sturm und Gischt“), Abschnitt 3.5 (Hafenkneipe), 4 und 4a (Old Harbor) nennen noch Old Harbor;
  durfte ich nicht ändern.
- **Flashback-Partie:** `klassiker.json` hat vor 1866 nur drei Partien, alle benutzt (Paulsen–Morphy
  in Cedar Creek, Unsterbliche in Riverton, Bird–Morphy in Ironwood). Vorschlag: eine öffentliche
  Partie aus den 1830er/1840er Jahren aufnehmen (C3 erlaubt das), dann den Flashback umstellen.
- **Steckbrief:** Immunität gegen Sprüche (S4) braucht eine neue Art der Steckbriefzeile, etwa
  `{ "art": "spruch", "wert": "immun:grossesMaul" }`.
- **Erinnerung 1858** (Szene 77): Stellung aus Ambroses erfundener Matchpartie muss mit der Engine
  gebaut werden (R13), eigener Auftrag.
- **Neue Dialogvariablen:** `ambroseSprichtWieder`, `musikhausOffen`, `briefGelesen`.
- **Begegnungen ohne Stellung:** Joggerin (Weg 4) und Schiffskoch (Weg 5) brauchen noch geprüfte
  Stellungen; Batiste 6.5 und Buck 8.44 sind geprüft.

**Offen:** nichts Blockierendes; sechs Fragen mit Empfehlung in Abschnitt 24 der Bibel.

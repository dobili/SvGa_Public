# Auftrag mittel-2: Gegenstände und Karten in der Geschichte, Limo-Nebenquest

**Stand:** fertig (mittel-2, 08.11.2026; vorher offen, Haupt-Chat, achter Auftrag)

**Zweig:** dein fester Sitzungszweig, Basis `claude/friendly-shannon-y8bf90` (vorher hereinholen)
**Darf ändern:** `docs/spiel/05_Story_Bibel.md` (Abschnitt „Hilfskarten und Zeitkarten“ je Akt und
neue Szenen), `docs/spiel/11_Karten_und_Gegenstaende.md` (Abschnitt 6 und ein neuer Abschnitt 7
„Verteilung und Preise“), `docs/spiel/auftraege/mittel-2.md`
**Prüfung vor dem Push:** im Ordner `app/` `npx prettier --check ../docs/spiel` (falls die Dateien
schon so formatiert sind), sonst nur sorgfältig lesen

## Ziel

Der Autor will viele Karten und Gegenstände („je mehr, desto besser“, Balancing später). Gebaut
sind 27 Karten, die Gegenstände Fahrrad, Laterne und Kartentasche, Läden in Maple Falls, Riverton
und Ironwood (`inhalte/abenteuer/laeden.json`) und Lernkarten aus dem Buch. Noch nicht verteilt
sind die Ideen aus `11_Karten_und_Gegenstaende.md`: Limo, Lupe des Uhrmachers, Reisebrett,
Partienotizbuch, Monatskarte, Spickzettel, Pokerface, Schutzengel.

## Vorgaben

1. Abschnitt 7 in Dokument 11: Tabelle aller Karten und Gegenstände mit Herkunft (Szene, Laden,
   Lernkarte), Preis und Akt; die Münzen, die man bis zum jeweiligen Laden realistisch hat
   (Münzregeln in `docs/spiel/08_Wege_und_Entdeckungen.md`, G1 bis G6), daneben. Ziel: In jedem Akt
   gibt es etwas Neues zu kaufen, nichts Starkes ist zu früh erreichbar (Grundsätze G1 bis G5).
2. Limo-Nebenquest für Akt 1 (Park Maple Falls): Jo will nach einer Niederlage des Lesers Limo;
   der Leser kauft sie am Kiosk (5 Münzen) und bringt sie ihr; dafür eine Steckbriefzeile über Jo
   oder eine Revanche mit Vorteil. Als Szene in der Story-Bibel, mit Quest-Schritten (Format wie die
   vorhandenen Quests), ohne Ink-Dateien.
3. Für Lupe, Reisebrett, Partienotizbuch und Monatskarte je eine Szene in Akt 2 oder 3, in der der
   Gegenstand ins Spiel kommt (wer gibt ihn, warum, was sagt Ambrose).
4. Im Bericht: Vorschläge für Preise, die du ändern würdest, und was davon zu stark wirkt.

## Bericht

**Fertig** auf `abenteuer-regelwerk` (Basis d31d0671 hereingeholt). Prettier über `docs/spiel`
besteht.

**Was neu ist**

- **Dokument 11, Abschnitt 6** auf den gebauten Stand gebracht (27 Karten, drei Gegenstände) mit
  Reihenfolge für das Ungebaute; **Abschnitt 7 „Verteilung und Preise“**: 7.1 Münzen, die man bis
  zu jedem Ort realistisch hat (aus `regeln/muenzen.ts`, Funden, Runden; Akt 3 geplant): etwa 110
  nach Maple Falls, 245 nach Akt 1, 530 nach Akt 2, 990 nach Akt 3. 7.2 alle 27 Karten plus
  Spickzettel, Pokerface, Schutzengel mit Herkunft, Preis, Akt, Münzen bis dahin. 7.3 Gegenstände
  (Limo, Fahrrad, Laterne, Monatskarte, Lupe, Partienotizbuch, Kartentasche, Reisebrett). 7.4 was
  zu stark oder zu früh wirkt.
- **Story-Bibel:** neue Szenen **10a Limo für Jo** (mit Quest-Schritten im Format von
  `quests.json`), **30a Monatskarte** (Pops, 80 Münzen), **31a Lupe des Uhrmachers** (Harlan nach
  drei Siegen), **39a Mamas Turnierheft** (Partienotizbuch von Oma Ruth), **51a Reisebrett** (Juno
  zum Abschied); Szene 34 gibt zusätzlich den Spickzettel, Szene 65 Pokerface, Szene 69 den
  Schutzengel. Kartentabellen je Akt ergänzt; die von Akt 1 an die Spieldaten angepasst
  (Gefahrenradar und Mentor-Zug kommen laut `quests.json` schon mit der Nadel von Maple Falls).

**Preise, die ich ändern würde, und was zu stark wirkt** (Einzelheiten in 11, 7.4)

1. **Fahrrad in Maple Falls (120):** am Ende von Maple Falls bezahlbar, entwertet den Schlüssel in
   Riverton. Streichen oder 180; bei Edna 120 lassen.
2. **Kartentasche (300, Ironwood):** in Akt 2 erreichbar (≈ 530 Münzen), vier Karten machen die
   Clubkämpfe von Akt 2 leicht. Nach Silicon Bay, 350, oder Wirkung erst ab Akt 3.
3. **Remisangebot im Clubkampf:** sichert in ausgeglichener Stellung eine Bronzenadel ohne Sieg.
   Im Clubkampf sperren oder Remis durch die Karte ohne Nadel.
4. **Ablenkung im Laden:** widerspricht Z4 (Zeitkarten nie im Laden); als Belohnung vergeben
   oder Z4 auf die Uhr-Sprüche beschränken.
5. **Straßensiege ohne Grenze:** 10 Münzen je Sieg, beliebig oft; Vorschlag: nur der erste Sieg je
   Gegner und Tag zählt voll, danach 2.
6. **Was droht? (45, dauerhaft):** auf 60, weil die Karte jede Partie mitspielt.

**Abweichungen in den Daten, die mir aufgefallen sind**

- `riverton.flashbackLondon` gibt eine Bauernvorgabe, obwohl laut ENTSCHEIDUNGEN nur die erste
  Erinnerung je Staffel sie gibt (Cedar Creek war die erste). Vorschlag: 20 Münzen statt Karte.
- Jo (`mapleFalls.skaterJo`) hat keinen Steckbrief; die Limo-Quest braucht eine Zeile (Vorschlag
  `fleck: rueckzug`).
- Für Verbrauchsgegenstände (Limo) fehlt eine Wirkung „Gegenstand abgeben“ (etwa
  `{ "art": "gegenstandWeg", "gegenstand": "limo" }` oder eine Dialogfunktion).
- Neue Dialogknoten für mittel-1: `maple-falls-park.jo_limo`, `.patel_limo`, `.jo_limo_gebracht`.

**Offen:** nichts Blockierendes.

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

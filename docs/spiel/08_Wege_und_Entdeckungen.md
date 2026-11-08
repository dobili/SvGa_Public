# 08 Wege, Entdeckungen, Zeitkarten, Flashbacks, Läden (Entwurf nach den Wünschen des Autors vom 8.11.2026)

Der Autor wünscht sich (Nachricht vom 8.11.2026): Wege zwischen den Städten selbst gehen wie in
Pokémon, unterwegs Schachrätsel und kurze Partien, Kleinigkeiten entdecken, übergreifende
Nebenquests (ein früher Fund wird viel später wichtig), Boni wie Brettfiguren und
Bretthintergründe, Zeit als Hilfemechanismus (Blitz oder Schnellschach wählen, Karten für die
Bedenkzeit), Fortbewegungsmittel (zu Fuß, Bus, Zug, Fahrrad), Flashback-Abschnitte in den
Erinnerungen des Geistes, Geld und Läden. Dieses Dokument legt fest, wie das in die vorhandenen
Systeme passt (Regelwerk 06, Architektur 04), was es kostet und in welcher Reihenfolge es kommt.
Alles Folgende gilt als Empfehlung „schon so geplant, Widerspruch genügt“ (Regel 9).

## 1. Wege zwischen den Städten (W1 bis W6)

- **W1 Jede Verbindung ist eine begehbare Route**, eine oder zwei Außenkarten (28 × 20 wie der
  Park) mit Landstraße, Feldweg, Bach, Haltestellen. Die Route hat `start`-Auslöser an beiden
  Enden; Übergänge innerhalb der Route wie in einer Stadt (R41). Neue Datei
  `inhalte/abenteuer/wege.json`: `kennung`, `von`, `nach` (Orte), `karten[]`, `verkehrsmittel[]`,
  `stationen[]` (Rätseltafeln, Gegner, Funde als Auslösernamen).
- **W2 Zu Fuß zuerst.** Der erste Weg in eine neue Stadt wird gegangen. Danach ist die Schnellreise
  frei (Bus oder Zug, je nach Route), wie „Fliegen“ in Pokémon: Dialog an der Haltestelle mit
  `reise` (gibt es schon), Fahrkarte kostet Münzen (siehe Abschnitt 5) oder ist nach Clubnadel der
  Stadt frei.
- **W3 Fahrrad** als Gegenstand (Fund oder Kauf in Cedar Creek): doppeltes Lauftempo auf Außen-
  und Routenkarten, nicht in Innenräumen. Technisch ein Faktor auf `TEMPO` in `szene.ts`, Besitz
  im Spielstand (`gegenstaende`).
- **W4 Stationen am Weg:** (a) Rätseltafeln: Aufgabenrunde mit `anzahl` 1 bis 3 (R30a), Steller
  „Tafel“ ohne Figur, Belohnung Münzen oder Fund; (b) Straßengegner wie bisher (Stellungsduell,
  R13), auf Routen mit Uhr (Abschnitt 3); (c) Funde (Abschnitt 2); (d) kurze Dialoge (Wanderer,
  Bauer, Kind) mit einem Satz Schachweisheit aus dem Buch (Abschnitt, keine Seitenzahl).
- **W5 Erste Route:** Maple Falls → Cedar Creek, zwei Karten („Landstraße“, „Flussweg“), ersetzt
  den Bus-Sprung von Schritt 8; der Bus bleibt als Schnellreise, sobald der Weg einmal gegangen ist.
  Stationen: Rätseltafel am Ortsausgang (3 Mattaufgaben), Skater-Jos Freundin als Straßengegnerin
  mit Uhr (Blitz 3+2), Fund „altes Partieformular“ (Abschnitt 2), Wanderer mit Weisheit.
- **W6 Zeitbudget:** eine Route 10 bis 15 Minuten beim ersten Mal, danach 0 (Schnellreise). Das
  passt in die Richtwerte R39/R40, wenn die Nebenquests der Stadt entsprechend schlanker bleiben.

## 2. Entdeckungen und Boni (E1 bis E5)

- **E1 Funde** sind Gegenstände auf Karten (Auslöser `gegenstand` mit neuer Wirkung `fund` in
  `quests.json`), teils sichtbar (Kiste), teils versteckt (Büsche, Regale: Auslöser ohne Bild,
  „Hier liegt etwas“). Je Stadt und Route 3 bis 6 Funde. Besitz im Spielstand: `funde[]`.
- **E2 Das Album der App** („Fundstücke“, Gamifizierung, `ui/komponenten/fundstuecke/`) zeigt die
  Funde des Abenteuers als eigene Seite mit Bild und einem Satz; kein zweites Album.
- **E3 Boni:** Funde schalten Extras der App frei, die es schon gibt („Dein Aussehen“: Brettfarben,
  Figurensätze, Konfetti) und neue Abenteuer-Extras (Bretthintergrund „Maple Falls im Herbst“,
  Figurensatz „Ambroses Holzfiguren“). Technisch über die vorhandene Liste `verdient` der App;
  jedes Extra bekommt eine Quelle `abenteuer:<fund>`.
- **E4 Übergreifende Nebenquests** („Mondfossil“): ein Fund ohne sofortigen Nutzen, der später an
  einem anderen Ort gebraucht wird. Erste zwei: (1) „altes Partieformular“ (Route 1) → im Archiv
  von Cedar Creek entschlüsselt Mr. Boateng die Handschrift → Fragment von Ambroses Partie; (2)
  „verrosteter Schlüssel“ (Cedar Creek, Steg) → öffnet in Stadt 3 den Schuppen mit dem Fahrrad.
  Quests mit Voraussetzung über Orte hinweg kann die Quest-Auswertung schon (`voraussetzung`).
- **E5 Sammelziel:** Alle Funde einer Stadt → „Entdecker-Nadel“ (ohne Spielwirkung, Album).

## 3. Zeit als Hilfe (Z1 bis Z5)

- **Z1 Wahl der Zeitklasse vor jeder Partie, auch im Clubkampf** (Entscheidung des Autors,
  8.11.2026): ohne Uhr (wie bisher), Schnellschach 10 + 5, Blitz 3 + 2. Die Nadel ändert sich durch
  die Uhr nicht; R16 wird entsprechend angepasst.
- **Z2 Warum das hilft:** Die Engine der App spielt mit Uhr nach gemessenen Bedenkzeiten
  (`engine/bedenkzeit-daten.ts`) und schwächer in Zeitnot (unter 60, 30, 10 Sekunden). Wer selbst
  schnell ist, kann den Gegner in Zeitnot treiben. Das ist ehrlich erspielt, deshalb ohne Folge für
  die Nadel.
- **Z3 Zeitkarten** (Regelwerk R24 erweitern): „Zeitbonus“ (gibt es, +2 Minuten eigene Uhr,
  bisher nur Landesmeisterschaft) wird auf allen Partien mit Uhr spielbar; neu „Zeitdruck“ (−1
  Minute auf der Uhr des Gegners, Verbrauchskarte, leicht) und „Zeitgeschenk“ (Gegner verliert
  keine Zeit beim nächsten Zug, dauerhaft, Spielwitz ohne Vorteil: fürs Album). Zeitkarten zählen
  für die Nadel als leichte Karten (R17); „Sanduhr“ (R25) bleibt die Ausnahme.
- **Z6 Zeitnot-Trick** (Wunsch des Autors, 8.11.2026): Ambrose gaukelt dem Gegner Zeitnot vor.
  Die Uhr bleibt unverändert; die Engine spielt für die nächsten 5 gegnerischen Züge wie in
  Zeitnot (Stufe „30“ aus `engine/menschenprofil.ts`: mehr Fehler, Patzerneigung, kurze
  Bedenkzeit). Wirkt auch in Partien ohne Uhr, deshalb mittlere Karte (R17: Silber höchstens),
  Verbrauchskarte, einmal je Partie. Technisch: `Partiesteuerung` bekommt
  `setzeGefuehlteZeitnot(stufe, zuege)`, die Zugwahl des Bots nimmt statt der echten Restzeit die
  vorgegaukelte Stufe, solange Züge übrig sind.
- **Z4 Belohnungen:** Zeitkarten gibt es nur auf Routen und für Nebenquests (nicht im Laden), damit
  sich die Wege lohnen.
- **Z5 Vertrag:** `Partieauftrag.uhr` ist schon da; `Kartensorte.wirkung` bekommt die Arten
  `zeit` (Sekunden für `leser` oder `gegner`). Die Kartenleiste braucht dafür einen Zugriff auf
  die Uhr der Partie (`Partiesteuerung`), ein kleiner Einhängepunkt.

## 4. Flashbacks (F1 bis F3)

- **F1 Kurze spielbare Erinnerungen** (2 bis 5 Minuten) an Wendepunkten der Haupthandlung: eine
  Karte in Sepia (Tönung über die vorhandene Tag-Nacht-Technik), Ambrose als Held (eigene
  Figur), 1850er bis 1890er, ein Raum oder eine Straße, ein Dialog, am Ende eine Stellung aus einer
  echten Partie der Zeit (`inhalte/zusatzpartien/klassiker.json`, Entscheidung C3: Zugerraten
  oder Stellungsduell).
- **F2 Erste drei:** (1) New York 1857 (schon als Erinnerung in Cedar Creek geplant), (2) London,
  das Kaffeehaus, (3) die letzte Partie vor dem Verschwinden (Finale von Akt 3). Belohnung je ein
  Fragment.
- **F3 Kosten:** je Flashback eine kleine Karte, ein Dialog, ein Figurenbild; die Technik ist die
  der Oberwelt mit einem Flag `flashback` an der Karte (Tönung, andere Heldenfigur, kein Tagebuch).

## 5. Geld und Läden (G1 bis G6, vom Autor am 8.11.2026 gewünscht: „bitte gerne einbauen“)

- **G1 Münzen** (Spielwährung, nie Echtgeld, keine Käufe in der App): Siege gegen Straßengegner
  (10), bestandene Aufgabenrunden (5 bis 15), Rätseltafeln (5), Funde (5 bis 20), Clubnadel (50).
  Im Spielstand `muenzen`.
- **G2 Ein Laden je Stadt** (Kiosk, Buchladen, Waschsalon-Automat): verkauft Verbrauchskarten
  (Fingerzeig 15, Zweite Chance 20, Flüstern 40), Fahrkarten (10), Gegenstände (Fahrrad 120,
  Taschenlampe für versteckte Funde 60), Extras (Bretthintergründe 30 bis 80).
- **G3 Keine Nadel zu kaufen:** Gold gibt es nur ohne Karten (R17); gekaufte Karten führen zu
  Silber oder Bronze wie gefundene. Mentor-Zug und Sanduhr sind nicht käuflich.
- **G4 Preise so, dass ein Clubbesuch (60 bis 90 Minuten) etwa 60 bis 100 Münzen bringt:** eine
  Karte oder zwei Fahrkarten je Stadt, das Fahrrad nach zwei Städten.
- **G5 Technik:** `inhalte/abenteuer/laeden.json` (Ort, Figur, Angebot mit Preis und Vorrat),
  Dialogfunktion `oeffneLaden(kennung)` → React-Fenster wie die Deckwahl; Wirkung `muenzen` in
  `quests.json`.
- **G6 Anzeige:** Münzen im Tagebuch und oben rechts in der Welt (klein), Album für Funde und Extras.

## 6. Reihenfolge und Aufwand

| Schritt | Inhalt                                                                                       | Aufwand (Haupt-Chat) | Helfer                                       |
| ------- | -------------------------------------------------------------------------------------------- | -------------------- | -------------------------------------------- |
| 9       | Akt 1 durchspielen (Autor), Befunde, Grafik (Q17)                                            | läuft                | –                                            |
| 10      | Wege: `wege.json`, Route 1 mit zwei Karten, Fahrrad, Schnellreise nach erstem Fußweg (W1–W6) | 1 Sitzung            | niedrig-1 Karten, mittel-1 Dialoge der Route |
| 11      | Entdeckungen: Funde, Album-Seite, Extras, zwei übergreifende Quests (E1–E5)                  | 1 Sitzung            | mittel-2 Fundliste je Stadt, mittel-1 Texte  |
| 12      | Münzen und Läden (G1–G6)                                                                     | ½ Sitzung            | mittel-2 Angebote und Preise                 |
| 13      | Zeit: Wahl der Zeitklasse, Zeitkarten (Z1–Z5)                                                | ½ Sitzung            | –                                            |
| 14      | Flashbacks (F1–F3), erster in Cedar Creek                                                    | ½ Sitzung            | mittel-1 Dialog, niedrig-1 Karte             |

Schritt 10 kommt vor dem Rest, weil die Route den Bus-Sprung ersetzt und die anderen Systeme
(Funde, Tafeln, Gegner mit Uhr) ihre Bühne brauchen. Alles bleibt in Staffel 1 (Maple Falls,
Cedar Creek, Stadt 3); die Landesmeisterschaft rückt entsprechend nach hinten.

## 7. Antworten des Autors (8.11.2026)

Blitz auch im Clubkampf: ja. Reihenfolge: in Ordnung. Geldsystem: ja, einbauen. Zusätzliche
Karte „Zeitnot-Trick“ (Z6). Die übrigen Empfehlungen (Wege, Entdeckungen, Flashbacks) gelten als
abgesegnet (Regel 9). Offen bleibt nur die Grafik (Q17).

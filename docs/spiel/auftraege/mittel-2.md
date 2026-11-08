# Auftrag mittel-2: Pixel-Porträts aller Figuren per Skript

**Stand:** offen (Haupt-Chat, 08.11.2026, elfter Auftrag)

**Zweig:** dein fester Sitzungszweig, Basis `claude/friendly-shannon-y8bf90` (vorher hereinholen)
**Darf ändern:** `app/skripte/erzeuge-figurenbilder.mjs` (neu), die erzeugten Bilder unter
`inhalte/abenteuer/portraets/` (neu, oder wohin der Paketbau `portraets/` heute liest, bitte
nachsehen in `app/skripte/baue-abenteuerpaket.mjs`), `docs/spiel/LIZENZEN.md`,
`docs/spiel/auftraege/mittel-2.md`
**Prüfung vor dem Push:** `python -m pytest pipeline/tests`, im Ordner `app/` `npm run pruefen` und Paketbau

## Ziel

Der Autor fragte, ob wir die Porträts selbst erstellen können (Q17-2): ja, per Skript im Stil
„Pixel Art“ von DiceBear, deterministisch je Figur, wie `app/skripte/erzeuge-gegnerbilder.mjs` die
Bots der App mit DiceBear „Personas“ zeichnet (Vorbild für Aufbau, Aufruf, Kommentare).

## Vorgaben

1. **Lizenz zuerst prüfen:** die Lizenz des Stils „pixel-art“ im Paket `@dicebear/pixel-art`
   (package.json, LICENSE) lesen und in `LIZENZEN.md` des Spiels mit Fundstelle eintragen. Nur
   weiter, wenn sie die Nutzung in einer öffentlichen App erlaubt (erwartet: CC0); sonst Stand
   „Frage“ und berichten. Die Pakete nur zum Erzeugen installieren (`npm install --no-save`).
2. Eine Tabelle im Skript: je Figur aus `gegner.json` und den Figuren in `orte.json` (Kennung,
   Porträtpfad aus `gegner.json` wo vorhanden) Haar, Haarfarbe, Hautton, Kleidung, Brille, Bart,
   passend zur Story-Bibel (Abschnitte Figuren, Sprechweisen) und zu den Namen. Vielfalt bei
   Hauttönen und Alter, nichts Klischeehaftes. Ambrose zweimal: alt und jung (`ambrose-jung`).
3. Ausgabe als SVG (oder PNG, falls der Paketbau nur das kennt) in einheitlicher Größe; der
   Paketbau soll sie statt der Platzhalter nehmen. Was dafür im Paketbau oder in der Anzeige des
   Dialogs fehlt (Porträt neben der Sprechblase), im Bericht als Vorschlag beschreiben.

## Bericht

(vom Helfer auszufüllen)

## Bericht des letzten Auftrags, zur Nachlese

**Fertig** auf `abenteuer-regelwerk` (Basis d0437d2c hereingeholt).

**Dialoge** (alle Knoten aus der Liste von mittel-1, dazu Unterknoten):

- `weg-ironwood-silicon.ink` (Szene 52): `kowalczyk` (Weisheit Kapitel 1.2), `joggerin` (Duell mit
  Uhr, Wiederholung), `zurueck_ironwood`, `tafel` (Runde), `fund_anstecker`, `fund_ohrstoepsel`.
- `silicon-bay-aussen.ink`: `ankunft_zu_fuss` (Szene 53, Victor holt ab), `dash` (Szene 54, Sprüche,
  beim ersten Sieg `gibKarte("gruebelfalle")`), `rosie`, `glasbruecke`, `hotel` mit `hotel_nacht`
  (Szene 61, nach der Clubnadel), `bus_ironwood` (`reise` zum Bus in Ironwood), `faehre` (Sperre bis
  `nadelSiliconBay`).
- `silicon-bay-akademie.ink`: `lin` (Szene 55, Reihe offen, Szene 59 „Warum man im Club schweigt“,
  Clubkampf, nach Niederlage/Sieg, Alltag mit Revanche), `theo` (Probepartie, Tablet, Reihe, öffnet
  nach der Auswertung den Serverraum: `serverraumOffen`), `nova` (Reihe, Bitte nach dem Fund),
  `serverraum_zu`.
- `silicon-bay-lobby.ink`: `victor` mit `victor_berichte` (Szene 56, Runde `siliconBay.auswertung`)
  und `victor_falsch` („Das ist falsch.“, Buchbezug Kapitel 12.2), `empfangsroboter`, `vitrine` mit
  `vitrine_foto` (Szene 57, übergreifende Quest „Die fehlende Seite“).
- `silicon-bay-serverraum.ink`: `schummelgeraete` (Ohrempfänger, Nova bittet um Schweigen).
- `ironwood-aussen.ink`, nur `bus_silicon_bay`: Szene 51 (Mama, Juno) und 51a (Reisebrett), dann
  `reise("wegIronwoodSilicon.raststaette", "start")`; neue Variable `abfahrtSiliconGesehen`.

**Quests** (eigener Block hinter Akt 2): Haupt `siliconBay.akademie` (7 Schritte: Glasbrücke mit
Reisebrett, Ankunft, Dr. Lin, Reihe Theo, Reihe Nova mit Zweiter Chance, Clubkampf mit Mentor-Zug,
Hotelnacht), `siliconBay.spielberichte` (Auswertung → Steckbrief und „analysiert“ für Dr. Lin;
Serverraum → Gegenstand `ohrempfaenger`), `siliconBay.fehlendeSeite` (Gegenstand `notizbuchseite`),
`wegIronwoodSilicon.tafelRaststaette`. **Runden:** `wegIronwoodSilicon.tafel` (3), `siliconBay.reiheTheo`,
`siliconBay.reiheNova`, `siliconBay.auswertung` (3); Novas Reihe und die Tafel nutzen nach dem Hinweis
des Haupt-Chats das neue Thema `falle`. **Texte:** 15 neue Schlüssel.

**Prüfungen:** `pytest pipeline/tests` 385 bestanden; Paketbau kompiliert alle Ink-Dateien;
Simulation mit inkjs (alle Knoten wie im Spiel gemeldet, Variablen beim Dialogende zurückgeschrieben
wie in `Oberwelt.beiDialogende`, Quests wie `regeln/quests.ts`): ein Durchgang von der Abfahrt in
Ironwood bis zur Fähre mit verlorener und gewonnener Joggerin- und Clubpartie; alle vier Quests
erledigt. `npm run pruefen`: bestanden (nach dem Hereinholen von 62297ddb: 360 Dateien, 2411 Tests; pytest 470).

**Befunde**

1. **Fehler in der Hülle bzw. in den Dialogen (wichtig):** Beim Dialogende schreibt
   `beiDialogende` alle Ink-Variablen in `dialogvariablen` zurück. Deklariert eine Datei
   `VAR gefunden<Fund> = false` und ruft im selben Dialog `gibFund`, überschreibt der Startwert den
   Wert, den die Hülle gerade gesetzt hat. Betroffen heute: `cedar-creek-aussen.ink`
   (`gefundenSchluessel`): Der Schlüssel vom Steg wird gefunden, aber `gefundenSchluessel` bleibt
   false, also bietet Mrs. Albescu in Riverton den Schuppen nie an. Vorschlag: In `beiDialogende`
   Werte nicht zurückschreiben, die die Hülle im Dialog gesetzt hat (Funde, Besitz), oder in den
   Dialogen eigene Merker benutzen wie hier. Meine Dateien benutzen eigene Merker.
2. **Funde fehlen in `funde.json`** (nicht meine Datei): Der Querverweis-Test verlangt jeden
   `gibFund`. Vorschlag für Einträge: `anstecker` (Weg 4, 5 Münzen), `ohrstoepsel` (Weg 4),
   `zeroTablet` (Silicon Bay, Theos Geschenk), `ohrempfaenger` und `notizbuchseite` (heute als
   Quest-Gegenstand), `holzdame` (Campus, versteckt; noch kein Auslöser in `orte.json`). Bis dahin
   merken sich die Dialoge die kleinen Funde selbst.
3. **Laden fehlt:** `siliconBay.foodtruck` (Rosie) steht nicht in `laeden.json`; Rosie erzählt nur.
   Angebot laut Bibel Abschnitt 22.
4. **Buchübungen des Clubs** (`ueb:spannung-halten`, `ueb:k2-italienisch-sg5`, `ueb:k2-carokann-h4`,
   `ueb:lasker-falle`) liegen nicht im Taktiktrainer; die Reihen nutzen nur Themen (`haengend`, `falle`). Die Auswertung der Spielberichte (Szene 56) läuft als Runde mit dem Thema `haengend`,
   bis es eine Aufgabenart „Welcher Zug ist zu gut?“ gibt.
5. **Szenen-Wirkungen:** Hauptquest setzt `akt3.abfahrt` bis `akt3.ambroseGebannt`; Nebenquests setzen
   keine Szene, damit die Haupthandlung nicht springt.

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

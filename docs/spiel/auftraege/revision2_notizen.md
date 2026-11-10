# Revision 2: Wahlen und Notizen des Autors (10.11.2026)

Quelle: Revisionsseite (Sammlung `varianten2`). Der Autor sieht gerade alle Karten durch. Bis er
fertig ist, werden die Notizen hier nur gesammelt. Verbessert wird danach in einem Durchgang (Wunsch
des Autors, 10.11.2026, 10:25).

Ausnahme: Regel 10.55 (Statisten und Tiere nicht im Wasser oder in Bäumen) war schon an alle Helfer
verteilt und ist weitgehend umgesetzt. Die Antworten auf die Fragen zum Park stehen in
`docs/spiel/ENTSCHEIDUNGEN.md`.

## Nächster Schritt nach der Wahl: Zustände je Karte zeichnen

Wunsch des Autors (10.11.2026): Sobald für jede Karte eine Variante gewählt ist, wird jede Karte in
allen Zuständen gezeichnet, die sie in der Geschichte hat. Beispiele sind Sperren offen oder zu,
ein Bus, der da ist oder nicht, und ein Schild alt oder neu. Diese Bilder kommen auf eine eigene
Seite zum Ansehen.

Quellen der Zustände:

- `zustaende` in `orte.json` (zweite Fassung einer Karte);
- Sperren mit `wenn` (Absperrung, Gatter, Hochwasser);
- Objekte, die nur in einer Szene erscheinen (Schulbus in Szene 13);
- Tönung je Tageszeit.

## Akt 1 (alle Wahl A)

### `mapleFalls.aussen`

- Sofern das Diner einen Hinterausgang hat, um zum Haus dahinter zu gelangen, ist das in Ordnung.
- Der Zaun am Gebäude ganz links an der Straße braucht einen Endpfosten oder muss bis zum Bildrand gehen.
- Frage: Soll die Straße links von der Geschichte her nicht weitergehen? Dann ist das in Ordnung.

### `mapleFalls.park`

Erledigt durch niedrig-1 (a9d6a3ba, privat b7c37e40), bevor der Wunsch „erst sammeln“ ankam:
Halfpipe, Reisebrett, Schild. **Noch offen:** Auf dem Absperrbock ist das letzte T von
„GESPERRT“ weiter abgeschnitten. Der Limostand braucht Waren auf dem Wagen (Nachtrag des Autors).

- „GESPERRT“ passt nicht ganz aufs Schild.
- Fragen: Reisebrett sichtbar? Halfpipe fehlt. Schulbus schon zu sehen? Die Absperrung steht am kaputten Steg, nicht am begehbaren.

### `wegMapleCedar.flussweg`

- Tiere und eine Figur stehen in der Mitte im Wasser.
- Der Übergang vom Trampelweg zur Hauptstraße rechts ist abrupt.

### `wegMapleCedar.landstrasse`

- Das „Garage Sale“-Schild hängt (Befestigung oben); passt perspektivisch nicht.

### `wegMapleCedar.zedernpfad`

- Ein Tier hängt rechts in einem Baum.

### `cedarCreek.aussen`

- Der Prellbock am Gleisende zeigt zum Betrachter; er müsste quer am Gleisende stehen, eventuell braucht es ein anderes Bild.
- Beim großen Gebäude in der Mitte sitzen Eingang und Treppe zu weit links, Gras scheint durch.
- Einige Tiere stehen rechts im Wasser.
- Links steht ein Briefkasten mitten auf dem Weg; er gehört an den Wegrand.

Die übrigen Akt-1-Punkte (Maple Falls, Weg 1, Cedar Creek) hat niedrig-1 ebenfalls schon umgesetzt.

## Akt 2 bis 4

### `riverton.aussen` (Wahl A)

- Die Bäckerei ist nur eine Fassade, das Gebäude dahinter fehlt. Ist das Bild eine Ansicht von vorn
  statt schräg von oben?
- Einige Gebäude stehen nicht an einem Weg, haben keinen Weg zum Eingang oder stehen teilweise auf
  Weg oder Pflaster.
- Die Trampelpfade unten haben keine Ränder, es sind nur orangebraune Flächen.
- Tiere stehen im Wasser.
- Der Wasserturm oben rechts ist schön. Er sollte aber zumindest mit einem Trampelpfad angeschlossen
  sein, vielleicht mit Zaun. Frage: Hat er eine Geschichte oder ist er nur Deko?
- Die Stände sind alle leer; es fehlen Waren.
- Die „Bildschirmtische“ unten sehen eher aus wie aufrecht stehende Bildschirme. Eine Figur steht
  hinter oder unter einem.

### `riverton.bahnhofshalle` (Wahl A)

- Das Bild links unten mit „Ticket“ ist abgeschnitten (rechte Hälfte fehlt), womöglich fehlen
  mehrere Teile. Unklar, was es darstellt (Schaufenster mit Ticket oben?).
- Pflanzen gern mehr, aber symmetrisch und sinnvoll, etwa an den Säulen.
- Die Taube darf bleiben.
- Der Wasserspender steht mitten im Weg; er gehört neben eine Sitzreihe.
- Getränkeautomat (unten rechts) und Kaffeeautomat (oben rechts) sollen nebeneinander stehen.
- Der Tresen unten rechts neben dem Automaten ergibt keinen Sinn.
- Das herrenlose Gepäck steht rechts mittig an der Wand; besser neben den Bänken (kurz abgestellt
  und vergessen).
- Der Holztisch mit Kasse (oben links) ist kein Fahrkartenschalter. Ein richtiger Ticketschalter
  gehört hin (Tresen mit Kasse, Schalterfenster).

### `riverton.pavillon` (Wahl A)

- Frage: Was ist der kleine blau-graue Tisch oben rechts, hat er eine Bedeutung? Antwort: Das ist
  der Getränketisch `rv5Limonade` und nur Deko, ohne Rolle in der Geschichte.
- Runde Tische, über die die Bretter mit den Ecken ragen. In einem Club mit langer Geschichte eher
  rechteckige Tische, auf die zwei Bretter nebeneinander passen.
- In der Mitte ist viel leerer Raum. Etwas Schönes, das zur Geschichte des Pavillons passt, soll
  hinein.

### Slicks Wohnwagen (`riverton.wohnwagen`)

- Der Raum muss die Form und den Aufbau eines Wohnwagens haben, nicht die eines Zimmers. Dazu
  gehören Mini-Toilette, kleine Kochnische, Bettbereich, Schränke und vielleicht ein Tisch, alles
  sehr eng.
- Grundrisse echter Wohnwagen recherchieren und danach bauen.

### `riverton.schuppen` (Wahl C)

- Keine Notiz.

### `wegCedarRiverton.bahndamm` (Wahl C, „dichter Birkenwald“)

- Kein Wald zu sehen, nur etwa acht Bäume. Ein Wäldchen gehört hin.
- Ein Haus hat keinen Zugang zum Weg; mindestens ein Trampelpfad zur Tür.
- Im eingezäunten Bereich liegt die Tür des roten Hauses unten links direkt am Zaun; niemand kommt
  hinein oder hinaus.
- Rechts über dem großen Schild liegt ein Zaunstück direkt am Damm (rechts mit Pfosten, links
  ohne). Es gehört dort wohl nicht hin, der Damm soll über die ganze Länge gehen.
- Das Dammdesign ist gelungen. Ganz links reicht der Anstieg aber nicht bis zum Rand, dort ist eine
  Lücke.
- Die Haltestelle unterbricht den Damm ohne Übergang; der Damm ist links und rechts einfach
  abgeschnitten. Frage: Liegt die Haltestelle oben auf dem Damm oder unten davor? Die Perspektive
  passt nicht, die Gleise sind oben, die Haltestelle wirkt wie unten im Gras.
- Tunnel: Die Umsetzung ist gut, aber der Trampelpfad trifft nur die rechte Hälfte des Eingangs.
  Der Tunnel führt durch den Damm genau dort, wo oben ein kleiner Teich liegt; den Teich versetzen.
- Frage: Wie sieht die andere Seite des Damms aus? Oben sind Büsche, und es geht auf gleicher Höhe
  weiter statt wieder hinunter.
- Frage: Warum gibt es den Damm? Trennt er Wasser (Staudamm) oder hebt er nur das Gleis? Was liegt
  auf der anderen Seite (Wohngebiet, Naturschutzgebiet, Wasser)? Davon hängt ab, was dort hingehört.
- Der Güterwaggon liegt unter den Gleisen (die Gleise laufen über das Bild des Waggons).
- Darüber steckt ein Hund in einem Busch.

### `wegCedarRiverton.zedernwald` (Wahl C)

- Bisher keine Notiz.

### `wegRivertonIronwood.bruecke` (Wahl A)

- Bisher keine Notiz.

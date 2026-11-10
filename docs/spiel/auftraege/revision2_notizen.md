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

## Allgemeine Punkte (aus den Notizen, für alle Karten)

1. **Kanäle bekommen befestigte Ufer.** Ein gerader, von Menschen gebauter Kanal hat eine
   Steineinfassung wie in Lockport. Natürliche Ufer haben nur Flüsse, und die winden sich. Das gilt
   besonders für die Wegkarten (Eisenbrücke, Kanalweg, Ironwood).
2. **Maße von Wasser und Booten stimmen.** Ein Kanal mit Schleuse muss breit genug für
   Frachtkähne sein. Ruderboote passen zu kleinen Flüssen. Boote liegen nicht quer und verstopfen
   nicht das Wasser.
3. **Innenräume nach der Logik des Gebäudes, nicht nach einer Höchstgröße.**
   - Bisher gilt KARTENREGELN 7a.2 und 7b.5: „Räume auf etwa einem Bildschirm“, Wohnräume
     8–11 × 8–9, öffentliche Räume 10–14 × 8–9.
   - Der Autor will das nicht: Jeder Raum bekommt die Größe, die das Gebäude von außen und sein
     Zweck nahelegen, abwechslungsreich und auch breiter als ein Bildschirm.
   - Die App scrollt Innenräume wie Außenkarten mit dem Helden.
   - Das bedeutet: Regel ändern, dann alle Innenräume nach logischer Größe prüfen und erweitern.
4. **Gebäude haben einen Weg zur Tür.** Das fiel auf fast jeder Karte auf.
5. **Stände tragen Waren**, an offenen Ständen steht jemand.
6. **Bilder ohne Tiefe** (Fassaden von vorn, Lok auf Sockel, Industriehallen) passen nicht zur
   Draufsicht schräg von oben und werden ersetzt.
7. **Zäune** laufen bis zum Rand oder enden an einem Pfosten. Torpfosten passen zum Zaun.
8. **Absperrungen an Gleisenden** stehen quer zum Gleis. Gleise führen irgendwohin.
9. **Laternen und Pfosten** stehen in regelmäßigen Abständen, Laternen am Weg, nicht an Gleisen.
10. **Jedes auffällige Objekt hat einen Grund** in der Welt oder in der Geschichte. Beispiele sind
    Graffiti-Mauern, Silo, Mast, Spieltische auf der Wiese, Zickzackweg und Kapelle. Sonst kommt es
    weg.
11. **Grünflächen abwechslungsreicher** gestalten: Bäume, Büsche, Gras, kleine Gebäude.

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

### `wegRivertonIronwood.bruecke` (Wahl A, „Eisenbrücke“)

- Frage: Soll es eine Brücke aus Eisen geben? Dann fehlt sie, es gibt keine Eisenbrücke.
- Das Wärterhäuschen hat keinen Pfad zum Weg.
- Straßenlaternen: Nur am Häuschen ist in Ordnung, dann aber am Pfad zum Häuschen. Für den ganzen
  Weg braucht es mehr Laternen.
- Fluss und Weg sind sehr gerade. Ein natürlicher Fluss windet sich, ein Kanal nicht (siehe
  Kanalweg, falls es derselbe Kanal ist).
- Die Spieltische stehen ohne Grund in einer Reihe auf der Wiese, nicht gepflastert, ohne Bänke.
  Es braucht einen sichtbaren Grund und einen in der Geschichte. Klapptische lassen sich bei Regen
  wegräumen, aber warum gerade dort?
- Eine Parkbank steht irgendwo auf der Wiese statt an einem Weg oder Aussichtspunkt.
- Der Weg läuft im Zickzack mit Zäunen. Das ist in Ordnung, braucht aber einen erkennbaren Grund,
  etwa eine Blühwiese für Bienen oder eine Koppel mit Pferden.
- Die große Steinmauer mit Graffiti unten steht allein da. Frage: Was hat es damit auf sich?
  - Möglicher Grund: Die Stadt hatte Graffiti-Probleme und baute eine Mauer für legale Kunst.
  - Dann sollten Graffiti-Künstler davor stehen.
- Tiere stehen im Wasser.
- Ein Springer ist an der Brücke ins Gras gezeichnet, links daneben liegt ein Schildchen mit einem
  Huhn. Frage: Was bedeuten sie? Warum liegt ein Schild im Gras, warum ein Springer aus Kreide im
  Gras? In Ordnung, wenn die Geschichte das vorsieht. Vermutlich sind das das Kreidezeichen K1 und
  das Finkenschild.

### `wegRivertonIronwood.kanalweg` (Wahl A)

- Vermutung des Autors: Die Eisenbrücke geht in den Kanalweg über; das erklärt den geraden Lauf.
- Gebäude ohne Weganbindung.
- Graffiti-Mauern brauchen eine Erklärung in der Geschichte (wie oben).
- Tiere stehen im Wasser.
- Das große Silo hat keinen Weg zum Hauptweg. Frage: Warum steht dort ein Silo, ohne Farm und Felder
  ringsum? Mit der Farm unten ließe sich oben am Silo Anbau ergänzen.
- Ein Boot liegt quer und verstopft den ganzen Kanal; es ist so breit wie der Kanal. Ist es ein
  Kanal für große Schiffe? Dann muss er breiter sein, auch auf der Eisenbrücke. Weiter unten liegt
  ein zweites Boot quer.
- Farm:
  - Wenig Bepflanzung.
  - Die Anbaufläche (Kohl, Kürbis) hat denselben Boden wie der Trampelweg; das passt nicht.
  - Dichter bepflanzen.
- Das Farmhaus hat keinen Weg zum Hauptweg.
- Das Gebäude neben dem Farmhaus hat nur ein vernageltes Fenster und keine Tür. Ist es ein Anbau,
  der an das Farmhaus gehört? Dann die Lücke schließen.
- Unten links steht ein einzelner Mast (Telegrafen- oder Strommast) neben einem Baum. Gehört er zur
  Geschichte? Sonst weg.
- Die freien Grünflächen interessanter gestalten:
  - mehr Abwechslung bei Gras und Bepflanzung;
  - kleine Häuser ohne Innenraum;
  - anderes, was man an so einem Weg in der Wirklichkeit fände.

### `wegRivertonIronwood.kanalweg` (Wahl A)

- Bisher keine Notiz.

### `lockport.aussen` (Wahl A, größte Wasserfläche)

- Die Steineinfassung des Kanals ist schön (Vorbild für andere Kanäle).
- Tiere stehen im Wasser. Inzwischen geprüft: Die Regel 10.55 ist auf allen Karten behoben; die
  Vorschau auf der Seite ist noch alt.
- Die Schleuse ist zu klein, gerade ein Ruderboot passt hindurch. Für Frachtkähne müssen Kanal und
  Schleuse größer werden.
- Frage: Gibt es eine Brücke über den Kanal? Eine fehlt.
- Der gepflasterte Platz direkt unter der Schleuse wird ohne Grund von einem Grünstreifen
  unterbrochen.
- Gern mehr Häuser. Frage: Passt das Farmhaus unten zur Stadt und zur Geschichte?
- Ein kleiner Schuppen unter dem Zugangskanal hat keinen Weg.
- Das Schild „zur Schleuse“ am Gasthaus verdeckt die Tür.

### `lockport.gasthaus` (Wahl C)

- Unter dem rechten Stuhl am Tisch unten links liegt ein schwarzer Haken wie ein Rohr.
- Die Kegelbahn liegt hinter der Theke. Die Gäste kämen dem Wirt in die Quere. Den Raum breiter
  machen und die Kegelbahn von der Theke trennen. Die Länge der Bahn ist in Ordnung.
- Die Barhocker stehen zu weit vom Tresen.
- Die Kegelbahn braucht unten eine Bande, und neben dem Abwurf ein Regal für die Kugeln.
- Siehe allgemeiner Punkt 3 (Innenraumgrößen).

### `ironwood.aussen`

- Der Kanal braucht ein befestigtes Ufer.
- Das Gleis unten führt nirgendwohin: Es ist links und rechts abgesperrt, die Absperrungen stehen
  waagerecht statt quer zum Gleis.
- Die Hauptstraße (Mitte, links nach rechts) ist links nicht vollständig mit Pflaster eingefasst.
- Die L-förmige Seitenstraße (nach oben, dann nach links vor die Häuser) ist nicht vollständig
  eingefasst und von der Hauptstraße durch Pflaster getrennt; sie muss durchgehend anschließen.
- Die Marktstände sind ohne Waren und ohne Leute (oder ist der Markt gerade zu?).
- Industriegelände oben rechts:
  - Die rotbraunen Hallen sind Fassaden von vorn ohne Tiefe, mit seltsamem Schatten; sie passen
    nicht und werden ersetzt.
  - Das gelbe kranartige Gebilde mit Fässern (Förderanlage über einem Loch?) ist nicht
    erkennbar und hat keine Tiefe; es muss klarer dargestellt werden.
  - Der Zaun ist nicht durchgehend: Oben links bricht er ohne Endpfosten ab, rechts reicht er nicht
    bis zum Rand. Die Torpfosten passen nicht zum Zaun.
- Drei kleine Pfosten am Kanal nahe der Hauptstraße stehen in unregelmäßigen Abständen.
- Die Lok auf dem Sockel unter der Hauptstraße am Fluss hat keine Tiefe.
- Die Kapelle rechts (christlich, kryptaähnlich) hat keinen Weg. Gehört sie zu einem Friedhof,
  dann mit kleinem Friedhof, Zaun und Bepflanzung. Frage: Rolle in der Geschichte?
- Der Fußgängerüberweg über die Gleise unten unterbricht die Gleise, als wäre er darübergelegt.
- Laternen am Weg an den Gleisen stehen mal oben, mal unten, unregelmäßig. Besser oben am Weg; an
  der Hauptstraße ist der Wechsel oben/unten in Ordnung.
- Der Marktplatz endet schnurgerade im Gras; eine schönere Einfassung suchen.
- Mehr Abwechslung bei Bäumen und Büschen.

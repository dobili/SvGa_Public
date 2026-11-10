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
12. **Küche getrennt vom Gastraum** (Kantine, Diner, Mensa):
    - Die Küche steht nie mitten im Raum.
    - Sie hat genug Geräte, Arbeitsflächen und Schränke für ihren Zweck.
    - Der Gastraum ist voll mit Tischreihen.
    - Aufenthalts- oder Schachecken sind abgesetzt, etwa durch Teppich, anderen Boden oder Pflanzen.
13. **Möbel stehen richtig:**
    - Rücken an die Wand (Ofen, Herd, Schränke); Türen von Spinden und Schränken zeigen in den Raum.
    - Kamine stehen an der Wand.
    - Stühle zum Tisch (alte Regel).
    - Kein Schrank vor der Tür.
    - Kein Möbel allein ohne Zusammenhang an der Wand, etwa ein Sessel ohne Tisch oder Lampe.
14. **Dinge passen auf ihre Unterlage:** Kaffeemaschine nicht breiter als der Tresen, Pokal nicht in
    der Luft über einem zu schmalen Regal, Tellergestell auf dem Tresen, Fußmatte vor der Tür, nicht
    auf ihr.
15. **Wandbilder an die Wand, Standbilder davor:** Ein Schild mit Füßen hängt nicht an der Wand.
    Für Umkleiden einen Wandspiegel statt eines Standspiegels.
16. **Räume voll nutzen:** keine großen leeren Flächen ohne Grund.
17. **Räume mit eigener Logik:**
    - Museum: Vitrinen in Reihen, gefüllt, große Vitrinen mit Platz ringsum. Keine Kisten, Fässer
      oder Koffer ohne Grund. Mehrere Räume, wenn das Gebäude es hergibt.
    - Umkleide: Duschen hinter einer Trennwand, mit Brause.
    - Schlafzimmer: mit Kleiderschrank.
18. **Gelände mit Höhen erkennbar machen:** Eine Grube, die in Stufen abfällt, darf nicht wie drei
    Räume mit Erdwänden aussehen. Kanten und Rampen müssen Tiefe zeigen.
    - Graffiti gibt es nicht auf Erde.
    - Ein Wasserloch hat keine gemauerte Einfassung.
    - Türen werden nicht als Ausschnitt auf eine Erdfläche geklebt.
19. **Loren und Gleise:** Die Spurweite passt zu den Loren. Türen öffnen sich nicht auf Gleise.
20. **Straßen und Autobahnen:**
    - Leitplanken und Grünstreifen als Lärm- und Sichtschutz.
    - Fahrbahnmarkierungen; Spuren passen zur Breite der Autos (etwa 4 + 4 statt „18 Spuren“).
    - Autos fahren in Fahrtrichtung, nicht gegen die Leitplanke, und haben Gegenverkehr.
21. **Brücken sind als Brücken lesbar:** Rampen hinauf und hinunter, Pfeiler, Schatten auf die
    Straße darunter. Glas ist teilweise durchsichtig. Die Ansicht ist schräg von oben, nicht reine
    Vogelschau.
22. **Plätze und Asphalt haben eine Einfassung** (Bordstein, Kante, Übergang zum Gras).
23. **Bepflanzung ordentlich:**
    - Hecken zusammenhängend, nicht in Stücken.
    - Abwechslung statt immer desselben Bildes.
    - Grünflächen gestaltet, nicht leer.
24. **Laternen, Bänke, Mülleimer an Rastplätzen**, nicht drei Laternen am Anfang eines Wegs.
25. **Gleiche Gebäude nicht zu oft:** Höchstens zweimal dasselbe Gebäudebild je Karte.
26. **Stände und Buden zeigen ihre Öffnung zum Platz.** Bänke zeigen auf etwas Sehenswertes.
27. **Alte Kirchen und Kapellen** stehen frei, mit Platz, Zaun und Grün oder Friedhof, nicht in
    einer Häuserreihe. Ohne Rolle in der Geschichte kommen sie weg.
28. **Holz in Stollen** (Stempel, Kappen) steht im Gang und nicht in den Wänden.
29. **Anlegepfosten stehen direkt am Ufer.**
30. **Winter:** Der Autor fragt, ob es Schnee-Bilder gibt; im Katalog gibt es keine. Antwort und
    Empfehlung in `docs/spiel/ENTSCHEIDUNGEN.md` (10.11.2026).

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

### `ironwood.kantine` (Wahl A, meiste Tische)

- Die Küche steht mitten im Raum (wie im Diner); sie gehört getrennt vom Gastraum. Genug Geräte,
  Tresen und Schränke für eine Werkskantine.
- Die Kaffeemaschine steht auf einem zu schmalen Tresen und ragt über.
- Das Tellergestell oben in der Mitte steht vor dem Tresen statt darauf.
- Im Pokalregal daneben hängt der goldene Pokal in der Luft (Regal zu schmal).
- Der Kamin oben rechts steht mitten im Raum.
- Die Spinde unten links stehen falsch herum vor der Wand und lassen sich nicht öffnen.
- Nur auf einem der zwei runden Tische liegt ein Schachbrett. Absicht?
- Viel ungenutzte Fläche in der Mitte und rechts. Eine Kantine ist voll mit Tischreihen. Die
  Schachecke soll ein abgesetzter Aufenthaltsbereich sein, mit Teppich oder anderem Boden.
- Mehr Pflanzen.
- Gilt genauso für das Diner in Maple Falls.

### `ironwood.mamasZimmer` (Wahl B)

- Der Ofen steht mit der Seite an der linken Wand statt mit dem Rücken.
- Die Stühle sind nicht zum Tisch gedreht.
- Der alte Schrank steht mitten im Raum, fast vor der Eingangstür.
- Schlafzimmer: Der Schreibtisch mit Stuhl und Lampe ist in Ordnung. Der untere ist eine Art
  Couchtisch, mit Sitzkissen ginge das. Es fehlt ein Kleiderschrank. Oder soll das Zimmer karg sein
  (Geschichte)?
- Erster Raum: Der Sessel an der Innenwand steht allein. Wozu dient die Ecke oben?

### `ironwood.museum` (Wahl B, Heimatmuseum im alten Bahnhof)

- Zu klein für ein Museum: Es braucht mehrere Räume oder einen größeren Raum, wenn das Gebäude
  außen es hergibt.
- Die Beschreibung spricht von drei hohen Fenstern; zu sehen sind zwei Standardfenster.
- Die Vitrinen sind leer und zufällig verteilt. Sie gehören in Reihen; um die zwei großen Vitrinen
  links und rechts muss Platz zum Herumgehen sein.
- Ohne erkennbaren Grund stehen dort:
  - rechts ein Trolley-Koffer mit drei gleichen Bildern;
  - eine Kiste mit Brettern;
  - ein Tisch mit Stuhl und Schemel;
  - ein Fass.
- Welche Möbel erwartet man in einem Museum? Den Raum danach überarbeiten.
- Die alten Fahrkartenschalter sind alte Computer. Gibt es ein besseres Bild?
- Das alte Fahrplanschild hat Füße, steht aber in der Wand; es gehört davor.

### `ironwood.umkleide` (Wahl A)

- Insgesamt gut.
- Den großen Doppelspind in die Ecke oder neben die übrigen Schließfächer.
- Die Duschwannen unten rechts haben keine Brause. Besser an die Nordwand, mit einer Trennwand (gern
  durchsichtig) zur Umkleide.
- Ein Standspiegel steht frei an der Wand. Besser ein Wandspiegel, es sei denn, die Geschichte
  braucht ihn.
- Die Fußmatte unten liegt auf der Tür.

### `steinbruch.grube` (Wahl C)

- Der Schotterweg der Zufahrt hat keine Übergangskante zum Gras und wirkt aufgeklebt.
- Die Karte wirkt wie drei übereinanderliegende Räume mit Erdwänden. Frage: Sollen das Höhenstufen
  sein? Dann muss die Tiefe sichtbar werden, etwa über einen Weg, der hinunterführt.
- Zufahrt oben:
  - Die Hütte steht ganz auf dem Weg.
  - Die Bänke zeigen in die falsche Richtung.
  - Figuren stehen in den Erdwänden. Schauen sie hinunter?
- Mittlerer Abschnitt: zufällig verteilte Steine auf einer Fläche, wirkt hingeklatscht.
- Unten:
  - Graffiti auf Erdwänden geht nicht.
  - Fahrzeuge und Holzstapel sind in Ordnung.
  - Der Teich hat eine gemauerte, symmetrische Einfassung wie ein Pool. Ist er ein vollgelaufenes
    Loch? Dann ohne Einfassung.
- Gleise und Loren:
  - Die Gleise sind viel breiter als die Loren.
  - Links steht ein Absperrschild statt eines Prellbocks.
  - Die Gleise enden links und rechts im Nichts.
  - Die Tür eines Hauses öffnet sich direkt auf die Gleise.
- Das Haus unten rechts besteht ganz aus Erde, die Tür ist als Ausschnitt aufgeklebt.
- Grundfrage: Was soll die Karte darstellen? Gibt es verschiedene Höhen, geht der Weg hinunter?
  Das muss das Bild zeigen.

### `steinbruch.stollen` (Wahl B)

- Das Gleis reicht unten nicht bis zum Bildrand und bricht ab. Oben ist das wohl Absicht.
- Im Hauptgang liegen links und rechts Holzstämme in den Wänden.
- Sonst nichts aufgefallen.

### `wegIronwoodSilicon.glasbruecke` (keine Variante passt, neu bauen)

- Die Autobahn braucht Leitplanken und seitlich Bepflanzung als Lärm- und Sichtschutz.
- Die gepflasterten Plätze haben keine Umrandung.
- Die Grünflächen ringsum sind nicht gestaltet.
- Die Glasbrücke sieht nicht wie eine Brücke aus:
  - Sie ist über die Autobahn geklebt.
  - Man sieht nicht, dass man hinauf- und hinuntergeht.
  - Pfeiler und Träger fehlen.
  - Die Ansicht ist Vogelschau statt schräg von oben.
  - Das Glas sollte teils durchsichtig sein.
- Die Autobahn hat keine Fahrbahnmarkierung und ist nach Autobreite etwa 18 Spuren breit. Alle
  Autos fahren in eine Richtung. Besser etwa 4 + 4 Spuren.
- „Hier muss wirklich nochmal ganz genau auf alles geguckt werden.“

### `wegIronwoodSilicon.raststaette` (Wahl C)

- Die Autos auf der Schnellstraße fahren gegen die Leitplanke (falsche Ausrichtung).
- Die Lärmschutz-Bepflanzung ist immer dasselbe kopierte Bild.
- Am Weg von links nach rechts stehen am Anfang drei Laternen, dann keine mehr. Laternen gehören an
  Rastplätze mit Bank und Mülleimer.
- Tiere stehen im Wasser (Vorschau noch alt, Regel 10.55 ist inzwischen umgesetzt).
- Eine Hütte hat keinen Weg.
- Die Anlegepfosten am Fluss stehen nicht alle am Ufer, weil der Fluss eine Einbuchtung macht.
- Vor der Tankstelle steht ein LKW ohne Tiefe.
- Der Asphalt hat keine Umrandung und keinen Übergang zum Gras.
- Die Tische unten rechts sind zufällig verteilt; ein Tisch überlappt einen Mülleimer oder
  Wasserspender.
- Eine hölzerne Anschlagtafel zeigt von der Straße weg, Zettel sind nicht zu sehen. Leer ist in
  Ordnung, wenn gewollt.

### `siliconBay.akademie` (keine Variante passt, neu bauen)

- Passt nicht zur Beschreibung: Die Glaswand fehlt, oben ist eine normale Wand mit Smartboards.
- Überall Tische mit Kapsel-Kaffeemaschinen; warum?
- Eine Akademie hat mehr als einen Raum.
- Das Schachbrett am rechten Tisch steht nicht ganz auf dem Tisch; der Tisch wirkt oben
  abgeschnitten.
- Getränkeautomat und Wasserspender stehen mitten im Raum.
- Unten stehen Sitzbänke, ein Doppelsitz und zwei Einzelsitze, nicht aneinander.
- Alle Stühle zeigen nach unten statt zum Tisch.
- „Braucht einen kompletten Overhaul, das Mobiliar ist komplett daneben.“

### `siliconBay.altstadt` (Wahl C)

- Die Bepflanzung ist zufällig: Heckenstücke einzeln statt zusammenhängend.
- Dasselbe Market-Gebäude kommt vier- bis sechsmal vor, fast gleich.
- Die Kapelle steht angereiht an einen Market. Alte Kirchen haben Platz, Zaun, Grün oder Friedhof.
  Ohne Rolle in der Geschichte weglassen.
- Der große Kaffeebecher-Stand zeigt mit seiner Öffnung vom Platz weg.
- Die Bänke auf dem Platz schauen auf die Grünflächen hinaus; das ergibt wenig Sinn.
- Die Übergänge zwischen Gras und Wegen sind unschön. Gibt es passende Bilder?

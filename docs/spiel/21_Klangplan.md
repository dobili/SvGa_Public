# 21 Klangplan für Akt 1

Stand 13.11.2026, mittel-4 im Auftrag des Hauptchats. Grundlagen: `19_Ton_und_Spannungsbogen.md`
(Stimmung je Abschnitt, Abschnitt 8: Leitmotive), `20_Ortsblaetter.md` (Zeile „Klang“ je Ort),
`roman/akt1_befunde.md` (Abschnitt 2: was jedes Kapitel braucht) und die 16 Randnotizen
`[Klang: …]` in `roman/akt1_teil1.md` bis `akt1_teil4.md`. Kapitelnummern beziehen sich auf den
Roman.

Dieses Dokument plant nur. Es legt **keine Tondateien** ins Repository; Teil D nennt, woher sie
rechtssicher kommen können. Was es im Spiel dafür braucht (Musik je Karte, Pausen mit Dauer, Dialog
in der Partie), steht in der Technikliste `roman/akt1_befunde.md`, Abschnitt 3 (T1 bis T3, T5).

## Grundsätze

1. **Akustisch und warm.** Gitarre, Klavier, Mundharmonika, Cello, Glockenspiel; für Ambrose ein
   altes Klavier oder Cembalo. Kein Synthesizer außer im Konzernmotiv. Die Musik passt zur
   Pixelgrafik, weil sie klein besetzt ist (zwei bis vier Instrumente), nicht weil sie nach Chip
   klingt.
2. **Jeder Ort hat ein Thema, jede Lage eine Fassung davon.** Dieselbe Melodie wird schneller
   (Weg), flotter (Clubraum), gespannter (Clubkampf) oder leiser (Innenraum). Wer die Fassung hört,
   weiß, wo er ist und was gerade auf dem Spiel steht.
3. **Kein Schlagzeug in Cedar Creek** (Ortsblatt „Nicht hier“). Den Puls gibt dort die Turmuhr.
4. **Stille ist ein Mittel, kein Fehler** (Dokument 19, Befund: „zu wenig Stille“). Teil C zählt
   jede Stelle auf, an der die Musik bewusst aussetzt. Der Dachboden hat bis zum Erscheinen des
   Geistes gar keine Musik.
5. **Geräusche sind das Wahrzeichen.** Den Wasserfall hört man in Maple Falls überall, die Turmuhr
   in Cedar Creek. Dauergeräusche laufen unter der Musik weiter, auch wenn sie aussetzt.
6. **Lautstärke als Rangfolge:** Dialog vor Geräusch an der Zeile vor Musik vor Dauergeräusch. In
   Innenräumen spielt die Ortsmusik 6 dB leiser, in der Bibliothek 10 dB.

### Vorschlag für die Marken im Dialog (zu T1, T2, T3)

Es gibt schon `#klang:pfiff`, `#klang:bus`, `#klang:knarren`, `#klang:waschmaschine` und
`#klang:karte`. Die Kennungen in Teil B übernehmen diese Namen. Dazu kommen:

| Marke                   | Wirkung                                                                                   |
| ----------------------- | ----------------------------------------------------------------------------------------- |
| `#musik:KENNUNG`        | Stück aus Teil A einblenden (1,5 s); läuft, bis die Karte wechselt oder eine Marke kommt. |
| `#musik:aus`            | Musik in 0,5 s ausblenden. Dauergeräusche laufen weiter.                                  |
| `#musik:weiter`         | Das Stück der Karte wieder einblenden (an der Stelle, an der es aufgehört hat).           |
| `#motiv:KENNUNG`        | Kurzmotiv aus Teil A, Abschnitt A4, einmal über der laufenden Musik.                      |
| `#stille:SEKUNDEN`      | Musik und Dauergeräusche aus, Text steht, nach der Dauer geht es weiter (T3).             |
| `#klang:NAME:ANZAHL`    | Einmaliges Geräusch mehrmals mit festem Abstand (Turmuhr: `#klang:turmuhr:7`).            |
| `ambiente` in der Karte | Dauergeräusche je Karte und Tageszeit (Teil B, Abschnitt B1); keine Dialogmarke nötig.    |

---

## Teil A: Musik

### A1. Leitmotive und ihre Verwandtschaft

Alle Motive sind in Stufen der Tonleiter angegeben (1 = Grundton), damit jede Fassung in ihrer
eigenen Tonart steht. Die Beispiele stehen in G-Dur, der Tonart von Maple Falls.

| Motiv                    | Töne                                                          | Rhythmus und Klang                                                                                                   | Bedeutung                                                                                            |
| ------------------------ | ------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| **Ambrose, Kopf**        | 5 – 3 – 4 – 2 (D – H – C – A)                                 | frei, der zweite und vierte Ton gedehnt, mit Vorschlag auf der 4; altes Klavier oder Cembalo, viel Pedal             | eine Frage: Die Linie fällt, steigt kurz und bleibt offen auf der 2 hängen.                          |
| **Ambrose, vollständig** | Kopf + 3 – 1 – 2 – 1 (H – G – A – G)                          | dieselbe freie Bewegung; die zweite Hälfte antwortet und landet auf dem Grundton                                     | die Antwort, die er sucht: die Partie ohne Makel. Erst in Kapitel 12 zu hören, dann Kapitel 16.      |
| **Victor**               | 5 – ♭3 – 4 – 2 (D – B – C – A, in g-Moll)                     | gleich lange Achtel, streng im Takt, ohne Pedal und ohne Vorschlag; trockenes, helles Klavier, 120 Schläge je Minute | dieselbe Frage ohne Zweifel. Ein Ton ist anders (kleine Terz), der Rest gleich.                      |
| **Aha**                  | 2 – 5 aufwärts (A – D), dann ein Hauch der 1 (G) darüber      | Glockenspiel, kurz und hell, 0,8 s                                                                                   | die Einsicht beantwortet Ambroses Frage: Sein Kopf endet auf der 2, das Aha springt von dort weiter. |
| **Konzern**              | ein einzelner Ton, Tritonus zum Grundton des Orts (in G: Cis) | trockenes Klavier oder Digitalpiano, ohne Nachhall, abrupt abgedämpft                                                | etwas, das in keine Tonart des Orts passt. Wird nie zu einer Melodie.                                |

**Warum die Verwandtschaft erst spät auffällt** (Dokument 19, Abschnitt 8): Ambroses Thema ist
langsam, gedehnt und verziert, Victors Thema gleichmäßig, schnell und nackt; dazu der eine andere
Ton. Erst in Akt 4, wenn beide Themen einmal im selben Tempo nacheinander kommen (Bergstation),
hört man, dass es dieselbe Linie ist. In Akt 1 dürfen sie nie direkt nacheinander erklingen. Die
einzige Ausnahme ist Kapitel 9: Victors Thema in der Partie, danach bricht Ambroses Kopf bei
„Hale“ ab. Auch dort trennt sie eine Pause (Teil C, S10).

**Wie die Ortsthemen damit zusammenhängen:** Das Thema von Maple Falls beginnt mit 1 – 2 – 3 – 5
(G – A – H – D), steigt also genau zu dem Ton, mit dem Ambroses Kopf beginnt. Das Thema von Cedar
Creek (d-Moll) ist eine Umkehrung des Kopfes in langen Noten: 1 – 3 – 2 – 4 – 5. Am Steg
(Kapitel 16) laufen beide übereinander und passen zusammen.

### A2. Ortsthemen und ihre Fassungen

Länge der Schleife: so, dass sie in einem Aufenthalt auf der Karte höchstens zwei- bis dreimal
läuft, ohne dass der Anfang hörbar „springt“ (Ende und Anfang auf derselben Harmonie).

| Kennung                 | Ort oder Szene                                                | Stimmung                            | Instrumente                                                                                                                                  | Tempo | Schleife | Setzt ein                                                                             | Setzt aus                                                                            |
| ----------------------- | ------------------------------------------------------------- | ----------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | ----- | -------- | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| `mapleFalls`            | `mapleFalls.aussen`, `.park`; Wohnzimmer leiser               | warm, tastend, Spätsommer           | akustische Gitarre (Fingerpicking), leises Klavier, ab dem zweiten Durchgang Cello                                                           | 76    | 96 s     | Kap. 1 erst nach der Pizza, nur Gitarre (Teil C, S1); danach beim Betreten der Karten | beim Betreten des Dachbodens; bei Victors Wagen (S9); in der Nacht (S5)              |
| `mapleFalls.club`       | `mapleFalls.clubraum`                                         | munter, aufgenommen                 | Gitarre, Klavier, Mundharmonika, Klatschen auf 2 und 4                                                                                       | 104   | 64 s     | Betreten des Clubraums (Kap. 5)                                                       | Beginn einer Clubpartie (dann `.clubkampf`) oder der Lernreihen (`.lernen`)          |
| `mapleFalls.lernen`     | Aufgabenreihen in Maple Falls (Clubraum, Park, Kreidebrett)   | Lernen als Spiel                    | Gitarre und Glockenspiel, Klavier tupft die Melodie                                                                                          | 92    | 48 s     | Beginn einer Aufgabenreihe                                                            | Ende der Reihe; jede gelöste Aufgabe legt das Aha-Motiv darüber                      |
| `mapleFalls.clubkampf`  | Clubkampf um die Nadel (Kap. 8), Partien gegen Clubmitglieder | Herzklopfen, nicht bedrohlich       | Gitarre gedämpft, Kontrabass gezupft, Besen auf kleiner Trommel, Cello-Liegeton                                                              | 84    | 80 s     | erster Zug der Clubpartie                                                             | bei „Was hängt?“ alles bis auf den Herzschlag (S8); nach dem Matt die Fanfare        |
| `diner`                 | `mapleFalls.diner`, Szene `akt1.dinerAbend`                   | frech, warm, Abend                  | „aus der Jukebox“: E-Gitarre clean, Kontrabass, Besen, Orgel leise; klingt wie aus einem kleinen Lautsprecher (Höhen und Tiefen beschnitten) | 112   | 72 s     | Betreten des Diners                                                                   | bei Hectors Bericht für einen Takt (S7); Verlassen                                   |
| `weg`                   | `wegMapleCedar.landstrasse`; Kürbishof als `weg.kuerbishof`   | frei, Sommerende                    | Thema von Maple Falls schneller: Gitarre, Mundharmonika, Fiedel; Kürbishof mit Banjo statt Fiedel                                            | 112   | 90 s     | Betreten der Landstraße                                                               | Wechsel zum Flussweg (fließend, siehe nächste Zeile)                                 |
| `weg.fluss`             | `wegMapleCedar.flussweg`                                      | schattig, Atem holen                | Gitarre allein, Cello; die Mundharmonika ist weg                                                                                             | 96    | 90 s     | Betreten des Flusswegs (Überblendung 3 s)                                             | Wechsel zum Zedernpfad                                                               |
| `weg.zedern`            | `wegMapleCedar.zedernpfad`                                    | still, man kommt woanders an        | Gitarre leise, darüber zum ersten Mal das Klavier von Cedar Creek                                                                            | 80    | 96 s     | Betreten des Zedernpfads                                                              | am Ortseingang von Cedar Creek: Turmuhr, vier Schläge, ohne Musik (S12)              |
| `cedarCreek`            | `cedarCreek.aussen`, Drechslerei, Waschsalon leiser           | still, forschend                    | Klavier allein, mit langen Pausen zwischen den Phrasen                                                                                       | 63    | 120 s    | nach den vier Uhrschlägen bei der Ankunft; danach beim Betreten                       | wenn Victor im Bild ist (S18); in der Nacht am Steg (S20)                            |
| `cedarCreek.bibliothek` | `cedarCreek.bibliothek`                                       | gedämpft, feierlich                 | dasselbe Klavier, 10 dB leiser, mit Hall wie in einem hohen Raum                                                                             | 63    | 120 s    | Betreten der Bibliothek                                                               | bei „Whitlock“ (S13)                                                                 |
| `cedarCreek.archiv`     | `cedarCreek.archiv`                                           | feierlich, ein einzelner Lichtkegel | Klavier von Cedar Creek, darunter tiefes Cello (Liegetöne)                                                                                   | 56    | 120 s    | Betreten des Archivs                                                                  | beim Zeitungsabsatz (S14); geht über in `ambrose.erinnerung`                         |
| `cedarCreek.clubkampf`  | Clubkampf gegen Mrs. Okafor (Kap. 15), Partien im Club        | still gespannt                      | Klavier und gezupfter Kontrabass, sehr sparsam; **kein Schlagwerk**, die Turmuhr tickt darunter                                              | 72    | 96 s     | erster Zug                                                                            | beim angebotenen Bauern (S22); bei „Lass mich“ übernimmt `ambrose.lassMich`          |
| `cedarCreek.steg`       | Abend am Steg (Kap. 16)                                       | leise, entschlossen, Abendrot       | Klavier von Cedar Creek und Ambroses Kopf zum ersten Mal zusammen, Cello                                                                     | 60    | 120 s    | Beginn der Szene am Steg                                                              | bei „Eine Partie ohne Makel“ nur noch `ambrose` vollständig; bei seinem Lachen (S25) |
| `nachtstueck`           | Sternennacht (Kap. 14), nur diese Szene                       | weit, zärtlich                      | Klavier in hoher Lage, Glockenspiel, ein Hauch Streicher                                                                                     | 54    | 150 s    | nach der ersten Sternschnuppe, sehr leise (S20)                                       | am Morgen: Vögel, Nebel, keine Musik                                                 |
| `bus`                   | Busfahrt nach Maple Falls (Kap. 16)                           | müde, glücklich                     | Thema von Maple Falls, nur Gitarre, kehrt leise zurück                                                                                       | 76    | 96 s     | wenn der Bus anfährt                                                                  | bei Junos Nachricht (S26), danach ein Ton `konzern`                                  |

### A3. Figuren- und Szenenstücke

| Kennung              | Szene                                                        | Stimmung             | Instrumente                                                                                            | Tempo | Länge           | Setzt ein                                                                           | Setzt aus                                                       |
| -------------------- | ------------------------------------------------------------ | -------------------- | ------------------------------------------------------------------------------------------------------ | ----- | --------------- | ----------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| `ambrose`            | Dachboden nach dem Erwachen; Partien mit Ambrose; Kap. 3, 4  | Staunen, fragend     | altes Klavier oder Cembalo, nur der Kopf (vier Töne), darunter leise Gitarre                           | 66    | Schleife 64 s   | mit Ambroses erstem Satz (Kap. 2); leise unter der ersten Partie (Kap. 3)           | bei „Hale“ (Kap. 9) bricht der Kopf mitten im dritten Ton ab    |
| `ambrose.erinnerung` | Erzählung von 1858 im Archiv (Kap. 12)                       | feierlich, schuldig  | Cembalo und Cello, das Thema **vollständig** (acht Töne), Sepia-Bilder dazu                            | 58    | 90 s, einmal    | Beginn der Erzählung                                                                | bei „Später“: dumpfer Schlag (`spaeter`), dann 2 s Stille (S15) |
| `ambrose.walzer`     | Erinnerung New York 1857 (Kap. 12, Szene 20)                 | hell, glänzend, jung | dieselbe Melodie als Walzer im Dreiertakt, kleines Streichorchester, Klavier                           | 138   | 60 s, einmal    | Beginn der Erinnerung                                                               | beim Damenopfer hält alles an (S16), dann volle Auflösung, Ende |
| `ambrose.lassMich`   | „Lass mich“ im Clubkampf von Cedar Creek (Kap. 15)           | drängend, Versuchung | Ambroses Kopf, lauter als je zuvor, mit Streichern, immer wieder ansetzend                             | 72    | bis zur Zeile   | bei „Lass mich“                                                                     | reißt bei „Ich weiß es nicht“ ab (S23)                          |
| `victor`             | Victor in Maple Falls (Kap. 9), an der Haltestelle (Kap. 13) | kalt, kurz           | trockenes Klavier, Victors Motiv in Achteln, ohne Begleitung; in der Partie ersetzt durch das Metronom | 120   | 4 Töne bis 16 s | Kap. 9 nach der Musikpause beim Wagen; Kap. 13 als vier einzelne Töne beim Weggehen | nach dem Motiv; nie unter einem Dialog von Ambrose              |
| `titel`              | Titelbild des Abenteuers                                     | Aufbruch, Staunen    | Gitarre mit dem Thema von Maple Falls, dann Ambroses Kopf auf dem alten Klavier, zum Schluss das Aha   | 76    | 75 s, Schleife  | Titelbild                                                                           | Start oder Fortsetzen                                           |

### A4. Kurzmotive (Stinger, einmalig, 1 bis 6 s)

| Kennung      | Wann                                                                                                                      | Instrumente                                                                      | Dauer |
| ------------ | ------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- | ----- |
| `aha`        | jede gelöste Aufgabe, jede gelernte Einsicht; Kap. 3 bei „Niemand“, Kap. 8 beim Schlagen, Kap. 15 bei „Zähl“ (ganz leise) | Glockenspiel                                                                     | 0,8 s |
| `konzern`    | Kap. 16 bei Junos Nachricht; später überall, wo ein Bildschirmtisch zum ersten Mal ins Bild kommt                         | trockenes Digitalpiano, ein Ton                                                  | 1,5 s |
| `hale`       | Kap. 9 bei „Hale“: ein einzelner tiefer Ton                                                                               | Kontrabass gestrichen oder tiefes Klavier mit Pedal                              | 3 s   |
| `fanfare`    | Clubnadel gewonnen (Kap. 8, Kap. 15 nach den zwölf Uhrschlägen)                                                           | Gitarre, Mundharmonika, Glockenspiel: Dur-Dreiklang aufwärts, endet mit dem Aha  | 4 s   |
| `sieg`       | jede andere gewonnene Partie im Abenteuer (Clubmitglied, Straßengegner)                                                   | Gitarre und Glockenspiel, zwei Akkorde                                           | 2,5 s |
| `niederlage` | verlorene Partie; kein Spott (Leitsatz 5)                                                                                 | Gitarre allein, ein Akkord, der sich nach Moll neigt und dann doch auf Dur endet | 3 s   |
| `remis`      | Remis                                                                                                                     | Gitarre, zwei gleiche Akkorde                                                    | 2 s   |
| `ankunft`    | erstes Betreten eines Orts mit Club (Ortsschild)                                                                          | Kopf des Ortsthemas, solo                                                        | 3 s   |

Die bisherigen Töne beim Ziehen (`app/src/app/ton.ts`: Zug, Schlag, Schach, Matt) bleiben im
Browser erzeugt. Im Abenteuer ersetzen `sieg`, `niederlage` und `fanfare` nur den Ton nach der
Partie.

### A5. Mindestumfang und Reihenfolge der Beschaffung

16 Stücke (A2 und A3) und 8 Kurzmotive. Wenn nicht alles auf einmal kommen kann, in dieser
Reihenfolge, weil sie die meiste Spielzeit tragen:

1. `mapleFalls`, `ambrose`, `aha` (Anfang des Spiels, Dachboden, jede Aufgabe)
2. `mapleFalls.clubkampf`, `cedarCreek.clubkampf`, `fanfare`, `sieg`, `niederlage`
3. `cedarCreek`, `weg`, `mapleFalls.lernen`, `mapleFalls.club`
4. `ambrose.erinnerung`, `ambrose.walzer`, `nachtstueck`, `cedarCreek.steg`
5. der Rest

Die Fassungen eines Orts sollten aus **einer** Hand kommen (dieselbe Melodie, dieselben
Instrumente). Bei gekauften oder freien Stücken heißt das: ein Paket je Ort, nicht Einzelstücke von
verschiedenen Leuten.

---

## Teil B: Geräusche

„Dauer“: **dauernd** = Schleife unter der Karte, solange man dort ist; **zufällig** = einzelne
Ereignisse in unregelmäßigem Abstand; **einmalig** = an Zeile, Ding oder Handlung gebunden.

### B1. Dauergeräusche je Karte

| Kennung              | Karte, Tageszeit                                                                                        | Dauer                       | Herkunft im Roman           |
| -------------------- | ------------------------------------------------------------------------------------------------------- | --------------------------- | --------------------------- |
| `wasserfall`         | `mapleFalls.aussen` leise, `.park` lauter, `.wohnzimmer` und `.dachboden` sehr leise; Abspann von Akt 1 | dauernd                     | Kap. 1, 4, 6, 16; Ortsblatt |
| `voegel`             | `mapleFalls.aussen` (Birch Lane) und `.park` am Tag; Landstraße, Flussweg; Steg am Morgen (Kap. 14)     | zufällig, 4–12 s            | Kap. 5, 14                  |
| `enten`              | `mapleFalls.park` am Wasser                                                                             | zufällig, 10–30 s           | Kap. 6                      |
| `rollen`             | `mapleFalls.park`, Skateplatz: Räder auf Beton                                                          | zufällig, 8–20 s            | Kap. 6, Ortsblatt           |
| `wind_fenster`       | `mapleFalls.dachboden`                                                                                  | dauernd, leise              | Kap. 2, 9                   |
| `holzknacken`        | `mapleFalls.dachboden`, auch im Haus nachts                                                             | zufällig, 8–25 s            | Kap. 2                      |
| `kuehlschrank`       | `mapleFalls.wohnzimmer` nachts (Szene `akt1.ersteNacht`)                                                | dauernd, Summen             | Kap. 4                      |
| `grillen`            | abends und nachts draußen: Wohnzimmer am offenen Fenster (Ende Kap. 3), Landstraße, Steg in der Nacht   | dauernd                     | Kap. 3, 14; Ortsblatt Weg   |
| `schulflur`          | Vorraum zum `mapleFalls.clubraum`, Szenen in der Schule: Stimmen, Schritte, ab und zu eine Spindtür     | dauernd, gedämpft           | Kap. 5                      |
| `diner_kueche`       | `mapleFalls.diner`: Bratgeräusche, Geschirr, Kaffeemaschine                                             | dauernd, unter `diner`      | Kap. 7                      |
| `traktor_fern`       | `wegMapleCedar.landstrasse`                                                                             | zufällig, 30–60 s           | Ortsblatt Weg               |
| `zaun_wind`          | `wegMapleCedar.landstrasse`: Zäune klappern leise im Wind                                               | zufällig, 10–20 s           | Kap. 10                     |
| `kuehe`              | `wegMapleCedar.landstrasse` bei der Weide (Otis)                                                        | zufällig, 20–40 s           | Ortsblatt Weg               |
| `fluss`              | `wegMapleCedar.flussweg`, Fährstelle                                                                    | dauernd                     | Kap. 10                     |
| `wald_still`         | `wegMapleCedar.zedernpfad`: leiser Wind in hohen Bäumen, ein Specht                                     | dauernd, leise              | Kap. 10                     |
| `huehner`, `windrad` | `kuerbishof.hof`                                                                                        | zufällig / dauernd          | Ortsblatt Kürbishof         |
| `bach`               | `cedarCreek.aussen` in der Nähe des Stegs; nachts lauter                                                | dauernd                     | Kap. 14, 16; Ortsblatt      |
| `uhr_ticken`         | `cedarCreek.bibliothek` (Uhr im Türmchen); draußen neben der Bibliothek leise                           | dauernd                     | Kap. 11, 13, 15             |
| `bibliothek`         | `cedarCreek.bibliothek`: Seitenblättern, ein Stuhl, Flüstern                                            | zufällig, 6–15 s            | Kap. 11                     |
| `waschmaschine`      | `cedarCreek.waschsalon`: Brummen der Trockner, dazu leise ein Radio (Kennung `radio`)                   | dauernd (gibt es als Marke) | Kap. 11                     |
| `archiv`             | `cedarCreek.archiv`: Tropfen (`tropfen`), Summen einer flackernden Lampe (`lampe`)                      | zufällig 5–12 s / dauernd   | Kap. 12                     |
| `steg_holz`          | Steg in Cedar Creek: Holz knarzt, wenn man darauf steht; nachts                                         | zufällig, 6–15 s            | Kap. 14                     |
| `bus_innen`          | Busfahrt (Kap. 16): Motor, Rütteln                                                                      | dauernd                     | Kap. 16                     |

**Schritte** (je Boden, an das Laufen gebunden): `schritt_holz` (Dielen, Treppe, Steg),
`schritt_kies` (Landstraße, Flussweg), `schritt_nadeln` (Zedernpfad, dumpf), `schritt_stein`
(Bibliothek, mit leichtem Hall), `schritt_gras` (leise). Kap. 10 verlangt, dass die Schritte unter
den Zedern dumpf werden; daran merkt man den Ortswechsel auch mit geschlossenen Augen.

### B2. Einmalige Geräusche

| Kennung            | Auslöser                                                                                                                                                                                              | Art                                       | Herkunft                   |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------- | -------------------------- |
| `treppe`           | jede Stufe der Dachbodentreppe im Whitlock-Haus                                                                                                                                                       | einmalig je Stufe                         | Kap. 1                     |
| `knarren`          | die neunte Stufe; Dachboden (`#klang:knarren`, gibt es schon)                                                                                                                                         | einmalig                                  | Kap. 1, 2, 4               |
| `koenig_heben`     | Ding „König“ auf dem Brett im Dachboden anheben: tiefer, weicher Ton, schwillt an wie ein Einatmen (kein Schreck)                                                                                     | einmalig, 3 s                             | Kap. 2                     |
| `glocke_hell`      | direkt danach ein einzelner Glockenton, klingt lange nach                                                                                                                                             | einmalig, 4 s                             | Kap. 2                     |
| `auto_nacht`       | Szene `akt1.ersteNacht`: ein Auto fährt draußen vorbei, Licht wandert über die Decke                                                                                                                  | einmalig                                  | Kap. 4                     |
| `schulglocke`      | erster Schultag, Ankunft an der Schule; Ende einer Lernreihe im Clubraum                                                                                                                              | einmalig                                  | Kap. 5                     |
| `spindtuer`        | im Schulflur, auch zufällig unter `schulflur`                                                                                                                                                         | einmalig                                  | Kap. 5                     |
| `pfiff`            | Coach Delgado mit Trillerpfeife (`#klang:pfiff`, gibt es schon): Begrüßung, Abpfiff, Bus                                                                                                              | einmalig                                  | Kap. 5, 8, 15, 16          |
| `pfiff_finger`     | Pfiff auf zwei Fingern: nach dem Sieg in Kap. 8; Schluss der Sternennacht (Kap. 14)                                                                                                                   | einmalig, laut                            | Kap. 8, 14                 |
| `kreide`           | Kreidebrett auf dem Gehweg (Kap. 6), beim Ansehen                                                                                                                                                     | einmalig                                  | Kap. 6                     |
| `tuerglocke`       | Tür des Diners öffnet sich                                                                                                                                                                            | einmalig                                  | Kap. 7                     |
| `herzschlag`       | Clubkampf in Maple Falls bei „Was hängt?“, bis {held} zieht                                                                                                                                           | wiederholt, 70 je Minute                  | Kap. 8                     |
| `tagebuch`         | {held} schreibt das Ziel ins Tagebuch (Schreibanimation)                                                                                                                                              | einmalig, Stift auf Papier                | Kap. 8                     |
| `wagen`            | Victors Wagen hält vor dem Clubraum: leiser, teurer Motor, Tür                                                                                                                                        | einmalig                                  | Kap. 9                     |
| `metronom`         | Partie gegen Victor in Maple Falls                                                                                                                                                                    | wiederholt, 120 je Minute, ganze Partie   | Kap. 9                     |
| `tablet`           | Victor tippt auf dem Tablet: kurzes, trockenes Klicken                                                                                                                                                | wiederholt in Kap. 13, einmalig in Kap. 9 | Kap. 9, 13                 |
| `kasse_muenzen`    | Ehrlichkeitskasse am Apfelstand ansehen, Ada zählt                                                                                                                                                    | einmalig                                  | Kap. 10                    |
| `kraehen`          | Ada und die Krähen („Drei gegen zwei“)                                                                                                                                                                | einmalig                                  | Kap. 10                    |
| `turmuhr`          | Glockenschlag der Turmuhr, mit Anzahl: vier bei der Ankunft (Kap. 10), sieben im Archiv (Kap. 12), zwölf nach dem Sieg im Clubkampf (Kap. 15); sonst beim Betreten von `cedarCreek.aussen` ein Schlag | einmalig je Schlag, 2,5 s Abstand         | Kap. 10, 12, 15; Ortsblatt |
| `zeitung`          | Großansicht der Zeitung von 1858 öffnen                                                                                                                                                               | einmalig, Papier                          | Kap. 12                    |
| `spaeter`          | bei „Später“ in der Erzählung von 1858: dumpfer Schlag wie eine Tür                                                                                                                                   | einmalig                                  | Kap. 12                    |
| `trockner_figuren` | Brett auf dem Trockner ansehen: Figuren zittern leise                                                                                                                                                 | einmalig über `waschmaschine`             | Kap. 11                    |
| `sternschnuppe`    | jede Sternschnuppe in der Sternennacht: heller, kurzer Glockenton (die erste etwas lauter)                                                                                                            | einmalig je Schnuppe                      | Kap. 14                    |
| `angelschnur`      | Morgen am Steg: eine Angelschnur surrt                                                                                                                                                                | einmalig                                  | Kap. 14                    |
| `bus`              | Bus hält mit einem Seufzer, Türen (`#klang:bus`, gibt es schon); Kap. 14 von fern klappernd                                                                                                           | einmalig                                  | Kap. 14, 16                |
| `bus_hupe`         | der Bus hupt am Steg                                                                                                                                                                                  | einmalig                                  | Kap. 16                    |
| `handy`            | Junos Handy summt (Nachricht aus Riverton)                                                                                                                                                            | einmalig                                  | Kap. 16                    |
| `karte`            | eine Karte wird vergeben (`#klang:karte`, gibt es schon)                                                                                                                                              | einmalig                                  | alle                       |
| `nadel`            | die Clubnadel wird angesteckt: kleines Klicken unter der Fanfare                                                                                                                                      | einmalig                                  | Kap. 8, 15                 |

Nicht als Geräusch, sondern als Musik geführt (Teil A4): der tiefe Ton bei „Hale“, der kalte
Konzernton, das Aha, die Fanfare. Ambroses Lachen in Kapitel 16 ist Text, kein Geräusch; dort ist
nur Stille (S25).

---

## Teil C: Stillen

Jede Stelle, an der die Musik bewusst aussetzt. „Dauer“ ist die Zeit ohne Musik; Dauergeräusche
laufen weiter, außer bei „vollkommen“.

| Nr. | Kap. | Stelle                                                | Was bleibt                             | Dauer                                                             |
| --- | ---- | ----------------------------------------------------- | -------------------------------------- | ----------------------------------------------------------------- |
| S1  | 1    | Ankunft im Whitlock-Haus bis zur Pizza                | Wasserfall, Schritte, Treppe           | ganze Szene, etwa 90 s                                            |
| S2  | 2    | Dachboden, bevor der Geist erscheint                  | Wind, Holzknacken                      | ganze Erkundung, bis der König angehoben wird                     |
| S3  | 2    | nach `glocke_hell`, bevor Ambrose spricht             | nichts (vollkommen)                    | 2 s                                                               |
| S4  | 4    | Mama: „Schwarz steht besser“                          | Raumgeräusche                          | 2 s, dann `mapleFalls` weiter                                     |
| S5  | 4    | Nachtszene `akt1.ersteNacht`                          | Kühlschrank, Wasserfall, Auto          | ganze Szene, etwa 3 min; ganz am Schluss Ambroses Kopf, vier Töne |
| S6  | 6    | Park, vor dem ersten Rätsel am Kreidebrett (optional) | Wasserfall, Rollen                     | bis zum ersten Zug                                                |
| S7  | 7    | Diner: Hector erzählt vom Mann im Anzug               | Küche                                  | ein Takt der Jukebox, etwa 2 s                                    |
| S8  | 8    | Clubkampf: „Was hängt?“                               | nur Herzschlag                         | bis {held} zieht, höchstens 20 s, dann leise zurück               |
| S9  | 9    | Victors Wagen hält                                    | Wagen, Stimmen                         | bis Victor spricht, etwa 5 s                                      |
| S10 | 9    | Partie gegen Victor; danach „Hale“                    | Metronom; nach `hale` nichts           | ganze Partie; nach `hale` 3 s                                     |
| S11 | 9    | Dachboden am Abend nach Victor                        | Wind                                   | ganze Szene                                                       |
| S12 | 10   | Ankunft in Cedar Creek                                | Turmuhr, vier Schläge, Bach            | etwa 10 s, dann `cedarCreek`                                      |
| S13 | 11   | Mrs. Okafor sagt „Whitlock“                           | nur das Ticken der Uhr                 | 4 s                                                               |
| S14 | 12   | Archiv: der Zeitungsabsatz                            | Lampe, Tropfen                         | solange die Zeitung offen ist, mindestens 3 s                     |
| S15 | 12   | Erzählung von 1858: nach `spaeter`                    | nichts (vollkommen)                    | 2 s                                                               |
| S16 | 12   | New York 1857: das Damenopfer                         | nichts (vollkommen)                    | 1,5 s, dann die warme Auflösung                                   |
| S17 | 12   | Ende des Archivs: Turmuhr, sieben Schläge             | Turmuhr                                | etwa 18 s                                                         |
| S18 | 13   | Victor an der Haltestelle                             | Klicken des Tablets, Uhr               | ganze Szene                                                       |
| S19 | 13   | nach der Frage „Macht dir das Spaß?“                  | nichts (vollkommen, auch kein Klicken) | **3 s** (die drei Sekunden Zögern)                                |
| S20 | 14   | Sternennacht bis zur ersten Sternschnuppe             | Bach, Grillen, Steg                    | etwa 60–90 s                                                      |
| S21 | 14   | Morgen am Steg                                        | Vögel, Bach, Angelschnur               | ganze Szene bis zum Bus                                           |
| S22 | 15   | Clubkampf: Mrs. Okafor bietet den Bauern an           | Ticken der Uhr                         | bis {held} zieht, höchstens 30 s                                  |
| S23 | 15   | „Lass mich“ reißt ab bei „Ich weiß es nicht“          | Ticken der Uhr                         | 3 s, dann bei „Zähl“ das Aha, ganz leise                          |
| S24 | 15   | nach dem Sieg: zwölf Uhrschläge                       | Turmuhr                                | etwa 30 s, dann `fanfare`                                         |
| S25 | 16   | Ambrose lacht über seinen eigenen Fehler              | Bach                                   | 4 s                                                               |
| S26 | 16   | Junos Nachricht im Bus                                | Motor                                  | 2 s, dann `konzern`, danach keine Musik mehr bis zum Abspann      |
| S27 | 16   | Abspann von Akt 1                                     | nur der Wasserfall                     | ganzer Abspann                                                    |

Regeln, die daraus folgen:

- Eine Stille von mehr als 10 s braucht ein Dauergeräusch, sonst wirkt das Spiel abgestürzt.
- Nach einer Stille kehrt die Musik nicht mit voller Lautstärke zurück, sondern blendet über 3 s
  ein.
- In einer Partie setzt die Musik nur an festen Momenten aus (T5), nie, weil der Spieler lange
  nachdenkt.

---

## Teil D: Beschaffung

Recherche vom 13.11.2026. Die Lizenzseiten wurden selbst abgerufen; was dort nicht gelesen werden
konnte, ist mit „(nicht geprüft)“ markiert. **Kein Stück wurde angehört**: Ob es zum Stil passt, ist
aus Instrumentenangaben, Schlagworten und Beschreibungen geschlossen. Vor jeder Übernahme anhören.

### D1. Was für ein öffentliches GPL-Repository gilt

Das Repository ist öffentlich, also wird jede Tondatei als Rohdatei weitergegeben, nicht nur im
fertigen Spiel. Drei Folgen:

1. **Brauchbar sind nur freie Lizenzen:** CC0 und CC BY 4.0 sind laut FSF mit der GPL verträglich
   („Both public domain works and the lax license provided by CC0 are compatible with the GNU
   GPL“; zu CC BY 4.0: „It is compatible with all versions of the GNU GPL“,
   gnu.org/licenses/license-list). Medien dürfen eine andere Lizenz haben als der Code
   (OpenGameArt-FAQ: „game code and game media are separate entities“).
2. **CC BY-SA 4.0 nur in eine Richtung:** Eine bearbeitete Fassung darf unter GPL-3.0 stehen
   (creativecommons.org/compatiblelicenses: „one-way only“), aber nicht unter CC0 oder CC BY. CC BY
   3.0 und CC BY-SA 3.0 dürfen als eigene Datei mit ihrer Lizenz im Repository liegen, lassen sich
   aber nicht unter die GPL stellen.
3. **„Nicht kommerziell“ (NC) ist ausgeschlossen:** Die GPL erlaubt jedem den Verkauf, NC verbietet
   ihn.

### D2. Quellen

| Quelle                                   | Lizenz                                             | Im öffentlichen Repo?                                                                                                               | Namensnennung                                                                                                                                                          | Preis               | Beleg                                                                                                                 |
| ---------------------------------------- | -------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------- | --------------------------------------------------------------------------------------------------------------------- |
| **OpenGameArt.org**                      | je Datei CC0, CC BY 3.0/4.0, CC BY-SA, OGA-BY, GPL | ja bei CC0, CC BY 4.0, OGA-BY, GPL 3, CC BY-SA 4.0 (siehe D1); CC BY 3.0 nur als eigene Datei                                       | außer bei CC0 Pflicht: „[Titel]“ by [Urheber] licensed [Lizenz]: [Link]                                                                                                | kostenlos           | opengameart.org/content/faq: „the licenses that can be selected on this site are meant to be GPL-compatible“          |
| **Freesound.org**                        | je Datei CC0, CC BY 4.0, CC BY-NC                  | CC0 und CC BY: ja; **NC nie**                                                                                                       | bei CC BY: Titel, Urheber, Link, Lizenz                                                                                                                                | kostenlos           | freesound.org/help/faq: „For "attribution" you should always mention the original creators“                           |
| **Kenney.nl**                            | CC0                                                | ja                                                                                                                                  | nicht nötig                                                                                                                                                            | kostenlos           | kenney.nl/support: „all game assets on the asset pages are public domain licensed (CC0)“                              |
| **Incompetech (Kevin MacLeod)**          | CC BY 4.0 (oder Kauflizenz ohne Nennung)           | ja                                                                                                                                  | Pflicht, sichtbar im Abspann: „Titel Kevin MacLeod (incompetech.com) Licensed under Creative Commons: By Attribution 4.0 https://creativecommons.org/licenses/by/4.0/“ | kostenlos           | incompetech.com/music/royalty-free/faq.html („Video Games — Most commonly, credits are placed on a "Credits" screen“) |
| **itch.io, Pakete mit CC0 oder CC BY**   | je Paket                                           | nur wenn die Seite CC0 oder CC BY nennt; eigene Lizenzen verbieten meist das Weiterverteilen                                        | je Paket                                                                                                                                                               | 0 bis 15 $          | Beispiel eines Verbots: ELV Games, Farming RPG Music Pack („You cannot: Resell these asset packs, not even modified“) |
| **Pixabay** (Musik und Geräusche)        | Pixabay Content License                            | **nein**: verboten ist die Weitergabe „on a Standalone basis“, also unverändert als Datei                                           | nicht nötig                                                                                                                                                            | kostenlos           | pixabay.com/service/terms, Abschnitt 5                                                                                |
| **Sonniss GDC Bundle**                   | eigene Lizenz                                      | **nein**: „may not distribute … the sound effects as sound effects“                                                                 | –                                                                                                                                                                      | kostenlos           | sonniss.com/gdc-bundle-license                                                                                        |
| **BBC Sound Effects**                    | nur persönlich, Bildung, Forschung                 | **nein** (Lizenzseite lädt nur mit JavaScript, nicht geprüft)                                                                       | –                                                                                                                                                                      | –                   | sound-effects.bbcrewind.co.uk                                                                                         |
| **Unity Asset Store**                    | Standard-EULA                                      | **nein**: Weitergabe nur „as incorporated and embedded“ in ein Produkt; einzeln herunterladbare Dateien zählen nicht dazu           | –                                                                                                                                                                      | kostenpflichtig     | unity.com/legal/as-terms §2.2.1, assetstore.unity.com/browse/eula-faq                                                 |
| **GameDev Market, Humble-Bundle-Pakete** | proprietär                                         | vermutlich nein (Lizenzseiten nicht ladbar, nicht geprüft)                                                                          | –                                                                                                                                                                      | kostenpflichtig     | –                                                                                                                     |
| **Suno** (KI)                            | AGB vom 10.08.2026                                 | kostenlose und Basic-Stufe: **nein** (nur privat); Pro/Premier: Rechte gehen an den Nutzer, ob ein Urheberrecht entsteht, ist offen | –                                                                                                                                                                      | Pro kostenpflichtig | suno.com/terms: „Suno makes no representation or warranty to you that any copyright will vest in any Output“          |
| **Udio** (KI)                            | AGB                                                | **nein**: nur privat, Herunterladen nicht erlaubt                                                                                   | –                                                                                                                                                                      | –                   | udio.com/terms-of-service                                                                                             |
| **Stable Audio** (KI)                    | Stability Community License (Modelle)              | Ausgaben gehören dem Nutzer bis 1 Mio. $ Jahresumsatz; AGB des Webdiensts nicht geprüft                                             | –                                                                                                                                                                      | –                   | stability.ai/license                                                                                                  |

**KI-Musik:** Nach dem Bericht des US Copyright Office (Januar 2025) machen Eingaben allein den
Nutzer nicht zum Urheber („prompts alone do not provide sufficient human control“). Eine GPL- oder
CC-Angabe an einer solchen Datei wäre rechtlich leer, die AGB des Anbieters gelten trotzdem, und es
bleibt das Risiko, dass das Modell fremde Werke nachbildet. Für dieses Repository deshalb nicht.

### D3. Kandidaten für die fünf Schlüsselstücke

Lizenz und Urheber auf der Seite selbst gelesen; für Incompetech aus dem offiziellen Katalog
(incompetech.com/music/royalty-free/pieces.json), die MP3-Links antworten. Nicht angehört.

| Stück                                          | Kandidat                            | Urheber           | Link                                                                                 | Lizenz    | Anmerkung                                                                                                                 |
| ---------------------------------------------- | ----------------------------------- | ----------------- | ------------------------------------------------------------------------------------ | --------- | ------------------------------------------------------------------------------------------------------------------------- |
| `mapleFalls`                                   | Clear Air                           | Kevin MacLeod     | https://incompetech.com/music/royalty-free/mp3-royaltyfree/Clear%20Air.mp3           | CC BY 4.0 | Gitarre und Klavier, ruhig, 68 BPM, 3:04, ohne Schlagzeug. Passt am besten zur Vorgabe.                                   |
|                                                | A Small Fire Will Do (Calming Loop) | Trex0n            | https://opengameart.org/content/a-small-fire-will-do-calming-loop                    | CC0       | akustische Gitarre, „village“, schon als Schleife                                                                         |
|                                                | Sunset Plains                       | Yoiyami           | https://opengameart.org/content/sunset-plains                                        | CC0       | sanfte Gitarre, aber mit Flächenklängen; eher New Age                                                                     |
| `ambrose`                                      | Harpsichord Flurry                  | Spring Spring     | https://opengameart.org/content/harpsichord-flurry                                   | CC0       | Cembalo mit Cello-Pizzicato; **MIDI liegt bei**, also lässt sich das Motiv aus A1 damit neu setzen                        |
|                                                | Sinfonia Number 5 (nach J. S. Bach) | Kevin MacLeod     | https://incompetech.com/music/royalty-free/mp3-royaltyfree/Sinfonia%20Number%205.mp3 | CC BY 4.0 | Cembalo allein, ernst; ein Ausschnitt für `ambrose.erinnerung`                                                            |
|                                                | Harpsichord                         | Alexandr Zhelanov | https://opengameart.org/content/harpsichord                                          | CC BY 3.0 | barock; nur als eigene Datei, nicht unter GPL zu stellen                                                                  |
| `koenig_heben` und `glocke_hell`               | Cymbal Swell 2.wav (Anschwellen)    | rubberduckie      | https://freesound.org/people/rubberduckie/sounds/219835/                             | CC0       | Becken mit weichen Schlägeln; Ausschnitt, tiefer und weicher abmischen                                                    |
|                                                | Mystical female choir swell 01      | Johnmode          | https://freesound.org/people/Johnmode/sounds/819290/                                 | CC0       | Chor mit Hall, 7,6 s; geisterhaft, nicht gruselig                                                                         |
|                                                | Single Chime 2 (Glockenton)         | steffcaffrey      | https://freesound.org/people/steffcaffrey/sounds/449947/                             | CC0       | ein Schlag eines Windspiels, 4,5 s                                                                                        |
|                                                | Single chime (Glockenton)           | LloydEvans09      | https://freesound.org/people/LloydEvans09/sounds/185822/                             | CC0       | 7,7 s, trocken, Hall selbst hinzufügen                                                                                    |
| `turmuhr`                                      | Church Clock Strikes 8.wav          | JarredGibb        | https://freesound.org/people/JarredGibb/sounds/219055/                               | CC0       | acht Schläge, 22 s; einzelne Schläge herausschneiden für `#klang:turmuhr:N`                                               |
|                                                | mourezebellsHPF1.wav                | AGC66             | https://freesound.org/people/AGC66/sounds/394657/                                    | CC0       | sechs Schläge mit Wind, 15 s                                                                                              |
|                                                | church_clock_striking.wav           | reinsamba         | https://freesound.org/people/reinsamba/sounds/38010/                                 | CC BY 4.0 | Kleinstadt, neun Schläge, 1:15; Nennung nötig. **Nicht** Freesound 481969 (CC0 angegeben, aber „ASK FOR COMMERCIAL USE!“) |
| `mapleFalls.clubkampf`, `cedarCreek.clubkampf` | Thinking Music                      | Kevin MacLeod     | https://incompetech.com/music/royalty-free/mp3-royaltyfree/Thinking%20Music.mp3      | CC BY 4.0 | Streicher und Harfe, spannend mit Augenzwinkern, ohne Schlagzeug; eher für Cedar Creek                                    |
|                                                | Investigations                      | Kevin MacLeod     | https://incompetech.com/music/royalty-free/mp3-royaltyfree/Investigations.mp3        | CC BY 4.0 | Pizzicato, Glockenspiel, Marimba; leichtes Schlagwerk, eher für Maple Falls                                               |
|                                                | winter courtyard                    | Bobjt             | https://opengameart.org/content/winter-courtyard                                     | CC0       | akustisch, „tense conversation“, MIDI vorhanden                                                                           |

**Ein ganzes Paket für die Ortsthemen** (passend zu Grundsatz A5, eine Hand je Ort): „Pelican
Breeze: The Cozy Farm Music Pack“ (Agavius), https://agavius.itch.io/pelicanbreeze, laut Seite
„Creative Commons Zero v1.0 Universal“ und „No generative AI was used“, 3,99 $ (im Angebot 2,79 $);
akustische Gitarre, Holzbläser, Marimba, im Stil von Stardew Valley. Weitere mit CC BY:
„Enchanted Village“ (musicMenace, ab 5 $) und „RPG Town Theme“ (Sirental, kostenlos, CC BY 4.0;
das Gitarrensample zusätzlich „by CodexBeats (ProdByNic) CC BY“ nennen).

**Die Leitmotive gibt es nirgends fertig.** Ambroses Kopf, Victors Fassung, das Aha und der
Konzernton (A1) müssen dieselben Töne haben, sonst trägt die Verwandtschaft nicht. Zwei Wege ohne
Lizenzfrage: die kurzen Motive wie die Zugtöne in `app/src/app/ton.ts` im Browser erzeugen (für
`aha`, `konzern`, `victor` genügt das), oder sie als MIDI setzen und mit einem frei lizenzierten
Klangsatz rendern (dessen Lizenz dann eigens prüfen; nicht geprüft). Die CC0-MIDI-Datei von
„Harpsichord Flurry“ ist ein guter Ausgangspunkt für `ambrose`.

### D4. Ordnung im Repository

- Je Tondatei ein Eintrag in einer Liste der Herkünfte (`docs/LIZENZEN.md` oder eine eigene
  `KLANG_QUELLEN.md`): Kennung aus diesem Plan, Titel, Urheber, Link, Lizenz, Änderungen (Schnitt,
  Schleife, Lautstärke).
- Alle Namensnennungen erscheinen im Spiel auf einer Seite „Musik und Geräusche“ im Abspann.
- Bearbeitete Fassungen von CC-BY-SA-4.0-Dateien stehen unter GPL-3.0 oder CC BY-SA 4.0, nie unter
  CC0.

### D5. Empfehlung

Musik und Geräusche nur aus CC0- und CC-BY-4.0-Quellen nehmen (OpenGameArt, Freesound, Kenney,
Incompetech, CC0-Pakete auf itch.io) und jede Herkunft mit Titel, Urheber, Lizenz und Link im
Repository und im Abspann festhalten; Pixabay, Sonniss, BBC, den Unity Asset Store und KI-Dienste
meiden, weil sie die Weitergabe der Rohdatei verbieten oder offenlassen. Für die Ortsthemen ein
Paket aus einer Hand wählen (etwa „Pelican Breeze“, CC0) und die Leitmotive aus A1 selbst setzen,
weil kein fertiges Stück ihre gemeinsamen vier Töne hat. Als Startbesetzung, nach dem Anhören:
„Clear Air“ für Maple Falls, „Harpsichord Flurry“ (aus der MIDI gekürzt) für Ambrose, „Cymbal
Swell 2“ mit „Single Chime 2“ für den König, „Church Clock Strikes 8“ für die Turmuhr und
„Investigations“ beziehungsweise „Thinking Music“ für die Clubkämpfe in Maple Falls und Cedar
Creek.

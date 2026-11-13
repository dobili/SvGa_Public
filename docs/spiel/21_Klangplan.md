# 21 Klangplan (Akt 1 bis 4)

Stand 13.11.2026, mittel-4 im Auftrag des Hauptchats. Grundlagen: `19_Ton_und_Spannungsbogen.md`
(Stimmung je Abschnitt, Abschnitt 8: Leitmotive), `20_Ortsblaetter.md` (Zeile „Klang“ je Ort), die
Befunde zu jedem Akt (`roman/akt1_befunde.md` Abschnitt 2, `akt2_befunde.md` und `akt3_befunde.md`
mit den Tabellen „Persönlichkeit der Orte“) und alle Randnotizen `[Klang: …]` im Roman (16 in
Akt 1, 13 in Akt 2, 17 in Akt 3, 20 in Akt 4). Kapitelnummern beziehen sich auf den Roman.

Aufbau: Die Grundsätze und die Leitmotive (A1) gelten für alle Akte. Danach je Akt die Teile A
(Musik), B (Geräusche) und C (Stillen); Teil D (Beschaffung) gilt für alle. Am Ende steht eine
Gesamtübersicht über alle vier Akte mit Größen und der Reihenfolge der Beschaffung.

Dieses Dokument plant nur. Es legt **keine Tondateien** ins Repository; Teil D nennt, woher sie
rechtssicher kommen können. Was es im Spiel dafür braucht (Musik je Karte, Pausen mit Dauer, Dialog
in der Partie), steht in `23_Technik_Atmosphaere.md` (T1 bis T10) und in den Technikabschnitten der
Befunde (T11 bis T28).

## Grundsätze

1. **Akustisch und warm.** Gitarre, Klavier, Mundharmonika, Cello, Glockenspiel; für Ambrose ein
   altes Klavier oder Cembalo. Jeder Ort bringt eigene Instrumente dazu (Akt 2: gedämpfte
   Trompete, tiefe Bläser, Akkordeon; Akt 3: Klarinette, Waschbrett, Slide-Gitarre). Synthesizer
   gibt es nur beim Konzern (Konzernton, ZERO, Silicon Bay): Wer ihn hört, weiß, wer da ist. Die
   Musik passt zur Pixelgrafik, weil sie klein besetzt ist (zwei bis vier Instrumente), nicht weil
   sie nach Chip klingt.
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

### Marken im Dialog (Schreibweise von `23_Technik_Atmosphaere.md`)

Die Marken legt mittel-2 in `23_Technik_Atmosphaere.md` (T1 bis T3) fest; dieser Plan benutzt nur
diese Schreibweise. Die Kennungen in Teil A und B sind die Werte dahinter. Vorhandene Namen
(`#klang:pfiff`, `#klang:bus`, `#klang:knarren`, `#klang:waschmaschine`, `#klang:karte`) bleiben.

| Was dieser Plan will                                 | Marke                                                                                    |
| ---------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| Stück aus Teil A2 oder A3 spielen                    | `#musik:kennung` (Überblendung)                                                          |
| Musik aussetzen                                      | `#musik:aus`                                                                             |
| zurück zur Musik der Karte                           | `#musik:karte`                                                                           |
| Musik über einen Kartenwechsel behalten (Bus, Weg)   | `#musik:bleibt`                                                                          |
| Kurzmotiv aus A4 (bis etwa 6 s) über der Musik       | `#klang:kennung` (etwa `#klang:aha`, `#klang:hale`, `#klang:fanfare`)                    |
| längeres Motiv (Victors Thema, Ambroses Kopf allein) | `#musik:kennung`                                                                         |
| einmaliges Geräusch aus B2                           | `#klang:kennung`                                                                         |
| Dauergeräusch nur während einer Szene                | `#geraeusch:kennung`, `#geraeusch:aus`                                                   |
| Stille (Teil C)                                      | `#musik:aus` und `#pause:N` an derselben Zeile; „vollkommen“ zusätzlich `#geraeusch:aus` |
| Turmuhr mit Anzahl                                   | eigene Kennungen je Anzahl: `#klang:turmuhr1`, `turmuhr4`, `turmuhr7`, `turmuhr12`       |

Musik und Dauergeräusch einer Karte stehen in `orte.json` (`musik`, `geraeusch`). Hat eine Karte
mehrere Dauergeräusche oder zufällige Ereignisse (Teil B1), werden sie zu **einer** Schleife je
Karte gemischt (Kennung `ort_karte`, etwa `mapleFalls_park`), weil die Karte nur ein `geraeusch`
kennt.

---

## Leitmotive (alle Akte)

### A1. Leitmotive und ihre Verwandtschaft

Alle Motive sind in Stufen der Tonleiter angegeben (1 = Grundton, ♯4 = übermäßige Quarte), damit
jede Fassung in ihrer eigenen Tonart stehen kann. Die Beispiele stehen in G-Dur, der Tonart von
Maple Falls. Eine Zeile „Akt“ nennt, wann ein Motiv zum ersten Mal erklingt.

| Motiv                              | Töne (Beispiel in G)                                                                                                                | Rhythmus und Klang                                                                                                                                                                                                                                                       | Akt, erstes Erklingen                                      | Bedeutung                                                                                                                                                                                                                                                                                                                                                                 |
| ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Ambrose, Kopf**                  | 5 – 3 – **♯4** – 2 (D – H – **Cis** – A)                                                                                            | frei, der zweite und vierte Ton gedehnt, Vorschlag vor der ♯4; altes Klavier oder Cembalo, viel Pedal                                                                                                                                                                    | Akt 1, Kap. 2                                              | eine Frage: Die Linie fällt, steigt kurz und bleibt offen auf der 2 hängen. Die ♯4 ist der **fremde Ton**, der nicht ganz in die Tonart passt.                                                                                                                                                                                                                            |
| **Ambrose, vollständig**           | Kopf + 3 – 1 – 2 – 1 (H – G – A – G)                                                                                                | dieselbe freie Bewegung; die zweite Hälfte antwortet und landet auf dem Grundton. Bis Kap. 57 antwortet die Begleitung mit einem **Trugschluss** (Akkord der 6. Stufe): Die Melodie ist da, die Harmonie bleibt offen. Einstimmige Fassungen enden auf der 1 ohne Akkord | Akt 1, Kap. 12                                             | seine eigene Antwort: die Partie ohne Makel. Sie klingt angekommen und fragt doch weiter.                                                                                                                                                                                                                                                                                 |
| **Ambrose, rein**                  | 5 – 3 – **4** – 2 – 3 – 1 – 2 – 1 (mit C statt Cis)                                                                                 | wie vollständig, aber in reinem Dur, ruhiger, Gitarre oder gestimmtes Klavier                                                                                                                                                                                            | Akt 3, Kap. 45                                             | der fremde Ton ist weg: Er muss nicht mehr makellos sein.                                                                                                                                                                                                                                                                                                                 |
| **Victor**                         | genau die Töne des Kopfes: 5 – 3 – ♯4 – 2                                                                                           | gleich lange Achtel, streng im Takt, ohne Pedal und ohne Vorschlag; trockenes, helles Klavier, 120 Schläge je Minute; darunter ein gleichmäßiger Bass in e-Moll                                                                                                          | Akt 1, Kap. 9                                              | dieselbe Frage ohne Zweifel. Kalt wird sie nur durch Rhythmus, Anschlag und die Moll-Begleitung, nicht durch andere Töne.                                                                                                                                                                                                                                                 |
| **Hale**                           | dieselben Töne: 5 – 3 – ♯4 – 2                                                                                                      | Victors gleiche Notenwerte, aber halb so schnell, auf einem Horn, warm; ohne Moll-Begleitung                                                                                                                                                                             | Akt 3, Kap. 42                                             | woher Victors Thema kommt: Es war einmal nicht kalt.                                                                                                                                                                                                                                                                                                                      |
| **Mira**                           | Kopf doppelt so schnell, mit der **reinen** 4: 5 – 3 – 4 – 2, verspielt wiederholt und umspielt                                     | Gitarre und Händeklatschen, hell, Sechzehntel                                                                                                                                                                                                                            | Akt 3, Kap. 41                                             | Ambroses Thema, wie ein Kind es pfeift: Sie kennt den fremden Ton nicht. In Kap. 45 übernimmt er ihre Fassung.                                                                                                                                                                                                                                                            |
| **Aha**                            | 2 – 5 aufwärts (A – D), dann ein Hauch der 1 (G) darüber                                                                            | Glockenspiel, kurz und hell, 0,8 s                                                                                                                                                                                                                                       | Akt 1, Kap. 3                                              | die Einsicht antwortet auf Ambroses offene 2. Sie ist zugleich das Gerüst des Themas des Helden.                                                                                                                                                                                                                                                                          |
| **Held**                           | 2 – 3 – 5 aufwärts (A – H – D)                                                                                                      | ein einzelnes Instrument (Gitarre oder Klavier), einfach, ohne Verzierung                                                                                                                                                                                                | Akt 3, Kap. 39                                             | die eigene Antwort: Sie beginnt auf Ambroses offenem Ton und steigt zu dem Ton, mit dem er anfängt. **Vollständig** (Sieg in Kap. 39): 2 – 3 – 5 · 2 – 3 – 5 – 6 · 5 – 3 – 2 – 1; die 6 ist Mamas fünfter Ton, der Schluss landet auf dem Grundton.                                                                                                                       |
| **Mama**                           | 1 – 2 – 3 – 5 – **6**, Auflösung auf 5 (G – A – H – D – E – D)                                                                      | Klavier allein, langsam, die 5 gehalten, als ob sie zögert                                                                                                                                                                                                               | Akt 2, Kap. 25 (nur vier Töne)                             | bricht nach der 5 ab (am leeren Blatt); vollständig mit der 6 und der Auflösung erst in Kap. 27.                                                                                                                                                                                                                                                                          |
| **Konzern**                        | ein einzelner Ton: ♯4 des Orts (in G: Cis)                                                                                          | trockenes Digitalpiano, ohne Nachhall, abrupt abgedämpft; in Akt 2 auch als heller Synthesizerton, der liegen bleibt                                                                                                                                                     | Akt 1, Kap. 16; zum letzten Mal Kap. 62                    | etwas, das nicht in die Tonart passt. **Es ist derselbe Ton wie der fremde Ton in Ambroses Thema.** Mit dem letzten Bildschirm in Kap. 62 verschwindet es aus dem Spiel.                                                                                                                                                                                                  |
| **ZERO**                           | gleichmäßige Sechzehntel aus 1 – 2 – 3 – ♯4 – 5 – 6 – 7 (lydisch), um die ♯4 kreisend, auf und ab, ohne je anzukommen               | Glasharfe oder Celesta mit Synthesizerfläche, perlend, vollkommen gleichmäßig, wunderschön                                                                                                                                                                               | Akt 3, Kap. 32; zum letzten Mal Kap. 63                    | der Konzernton als Melodie. Was bei Ambrose ein einzelner fremder Ton ist, ist bei ZERO die Mitte. Im Halbfinale (Kap. 63) reißt es mitten im Lauf ab und kehrt nicht wieder. ZERO ist ein eigenes Motiv; das Konzernmotiv (der einzelne Ton) endet schon in Kap. 62.                                                                                                     |
| **Miss Odile**                     | 5 – 6 – 1' – 6 – 5 – 3 – 2 – 1 (pentatonisch, ohne 4 und 7)                                                                         | eine Stimme ohne Begleitung; später Trompete und Tanz                                                                                                                                                                                                                    | Akt 3, Kap. 37                                             | das Lied des Wiederaufbaus. Es beginnt auf dem Ton, den Ambroses Vater stimmt (die 5), und kennt keinen fremden Ton.                                                                                                                                                                                                                                                      |
| **Endspiel**                       | Quintenturm 1 – 5 – 2' – 6' – 3'' (in D: D – A – E – H – Fis), aufwärts, jeder Ton einzeln                                          | einzelne Klaviertöne mit viel Raum, darüber ein hohes Streicherflageolett; langsam, kalt, schön                                                                                                                                                                          | Akt 3, Kap. 46 (die ersten vier Töne); Summit City Kap. 48 | Thema von Summit City: wenige Figuren, jede zählt. **Mit jedem Abtausch fällt der oberste Ton weg** (Kap. 50, 52). Bleiben 1 und 5, sind es die zwei Könige: Der obere Ton steigt erst eine Oktave höher ein (5') und geht stufenweise abwärts auf den unteren zu, bis beide eine **reine Quinte** bilden; in der Opposition klingen sie gleichzeitig und bleiben stehen. |
| **Arena**                          | das Heldenthema vollständig als Fanfare: 2 – 3 – 5 · 2 – 3 – 5 – 6 · 5 – 3 – 2 – 1, darunter ein Marsch                             | Bläser, Pauke, Streicher, aber die Melodie führt eine einzelne Trompete; 104 Schläge je Minute                                                                                                                                                                           | Akt 4, Kap. 60                                             | festlich und menschlich: Die große Halle spielt das Thema eines Kindes.                                                                                                                                                                                                                                                                                                   |
| **Nova**                           | ♯4 – 5 · 6 – 5 – 3 · 2 – 3 – 1                                                                                                      | zuerst nur ♯4 – 5, zögernd wiederholt (Klavier, leise); mit der Partie fester, am Ende mit Cello                                                                                                                                                                         | Akt 4, Kap. 61                                             | Sie beginnt auf dem Konzernton und löst ihn einen Halbton aufwärts in die Tonart auf: Sie nimmt mit, woher sie kommt, und kommt an.                                                                                                                                                                                                                                       |
| **Ambrose und Held, eine Melodie** | 5 – 3 – 4 – 2 – 3 – 5 · 6 – 5 – 3 – 2 – 1 (reine 4)                                                                                 | alle Instrumente des Spiels, vier Takte; in Kap. 66 leise auf zwei Instrumenten (altes Klavier und Gitarre)                                                                                                                                                              | Akt 4, Kap. 63                                             | Ambroses reiner Kopf, vom Helden weitergeführt und mit dessen Abstieg auf den Grundton gebracht. Die Linie aus Kap. 42 (noch mit ♯4) ohne den fremden Ton.                                                                                                                                                                                                                |
| **Schlusston**                     | Ambrose vollständig, dann die 1 über der Kadenz V – I, in der tiefen Oktave verdoppelt und gehalten                                 | wie Ambrose vollständig; der letzte Ton klingt lange aus (Kap. 66: sehr lange)                                                                                                                                                                                           | Akt 4, Kap. 58; wieder Kap. 66                             | zum ersten Mal schließt auch die Harmonie: keine Frage mehr.                                                                                                                                                                                                                                                                                                              |
| **Lauf**                           | der Kopf des London-Walzers (Ambroses junger Kopf, mit ♯4) als Galopp, dann eine Tonleiter aufwärts bis zur hohen 1 und eine Kadenz | Kap. 21: Streicher pizzicato und Cembalo, 10 s; Kap. 65: volles Orchester, 20 s                                                                                                                                                                                          | Akt 2, Kap. 21 (Kieseritzky); Akt 4, Kap. 65 (Victor)      | wer verloren hat und trotzdem rennt, um es allen zu erzählen.                                                                                                                                                                                                                                                                                                             |
| **Schlussklang**                   | Aha (2 – 5, dann ein Hauch der 1) über den vier Tönen vom Dachboden als Bass (5 – 3 – ♯4 – 2, eine Oktave tiefer)                   | Glockenspiel über altem Klavier; leise; der letzte Klang des Spiels                                                                                                                                                                                                      | Akt 4, Kap. 66                                             | der Kreis beginnt von vorn: die alte Frage mit ihrem fremden Ton für ein neues Kind, darüber die Antwort einer Einsicht. Der Bass endet offen auf der 2.                                                                                                                                                                                                                  |

**Wie die Verwandtschaften aufgehen:**

- **Ambrose, Victor, Hale:** Alle drei haben dieselben vier Töne mit dem fremden Ton ♯4. Victor
  klingt nur durch Rhythmus, Anschlag und die Moll-Begleitung kalt; Hale spielt Victors Rhythmus
  langsam und warm. Darum passen in Kapitel 29 Ambrose und Victor **gleichzeitig** zusammen (man
  hört zum ersten Mal, dass es dieselbe Melodie ist), in Kapitel 32 einstimmig an der Vitrine und
  in Kapitel 44 Ambrose und Hale als Kanon im Abstand eines Takts. In Akt 1 erklingen Ambrose und
  Victor nie direkt nacheinander; die einzige Nähe (Kapitel 9) trennt eine Pause (Teil C, S10).
- **Der fremde Ton ist der Konzernton.** Die ♯4 in Ambroses Kopf ist genau der Ton des
  Konzernmotivs und die Mitte von ZERO. So erklärt die Musik, warum die Maschine Ambrose anzieht:
  Sein Makel ist ihr Grundton. In Kapitel 21 („Oder doch?“) wird die ♯4 in seinem Thema zum ersten
  Mal auf dem Digitalpiano des Konzerns gespielt; in Kapitel 45 verschwindet sie (Ambrose, rein).
  Victors Thema behält sie: In Kapitel 46 endet es mit einem falschen, maschinellen Ton.
- **Mira** pfeift Ambroses Kopf doppelt so schnell und mit der reinen 4. Als sie in Kapitel 45 ruft,
  dass das Opfer richtig war, übernimmt Ambrose ihre Fassung und verliert den fremden Ton.
- **Der Held, das Aha und Mama:** Das Aha (2 → 5) ist das Gerüst des Heldenthemas (2 – 3 – 5); jede
  gelernte Einsicht hat es schon angedeutet. Das Heldenthema sind Mamas Töne zwei bis vier, und
  Mamas erste vier Töne (1 – 2 – 3 – 5) sind der Anfang des Themas von Maple Falls. Das Kind hat
  sein Thema von zu Hause. Wer Mamas Thema in Kapitel 25 hört, erkennt Maple Falls darin, nur
  langsamer und allein.
- **Frage und Antwort:** Ambroses Kopf endet offen auf der 2. Das Heldenthema beginnt auf dieser 2
  und steigt zur 5, mit der Ambrose anfängt. Zusammen ergibt das eine geschlossene Linie
  (5 – 3 – ♯4 – 2 – 3 – 5); so ergänzen sie sich in Kapitel 42 zu einer Melodie.
- **Herkunft:** Der erste Ton von Ambroses Thema (die 5) ist der Ton, den sein Vater stimmt
  (Kapitel 38), und der erste Ton von Miss Odiles Lied. Port Delacroix ist, wo das Thema herkommt.
- **Akt 4:** Das Konzernmotiv endet mit dem letzten Bildschirm in Kapitel 62, ZERO reißt in
  Kapitel 63 ab. Novas Thema beginnt auf dem Konzernton und löst ihn auf. Das Arena-Thema und die
  gemeinsame Melodie des Halbfinales sind aus dem Heldenthema gebaut. Ambroses Thema schließt in
  Kapitel 58 zum ersten Mal mit einem Schlusston (die Harmonie schließt), und der letzte Klang des
  Spiels setzt das Aha über die vier fragenden Töne vom Dachboden: Für ein neues Kind beginnt die
  Frage von vorn.
- **Ortsthemen:** Maple Falls beginnt mit 1 – 2 – 3 – 5 (Mamas Kopf) und steigt damit zu Ambroses
  Anfangston. Cedar Creek (d-Moll) ist eine Umkehrung des Kopfes in langen Noten: 1 – 3 – 2 – 4 – 5.
  Am Steg (Kapitel 16) laufen beide übereinander und passen zusammen.

## Akt 1, Teil A: Musik

### A2. Ortsthemen und ihre Fassungen

Länge der Schleife: so, dass sie in einem Aufenthalt auf der Karte höchstens zwei- bis dreimal
läuft, ohne dass der Anfang hörbar „springt“ (Ende und Anfang auf derselben Harmonie).

| Kennung                 | Ort oder Szene                                                   | Stimmung                            | Instrumente                                                                                                                                  | Tempo | Schleife | Setzt ein                                                                             | Setzt aus                                                                            |
| ----------------------- | ---------------------------------------------------------------- | ----------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | ----- | -------- | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| `mapleFalls`            | `mapleFalls.aussen`, `.park`; Wohnzimmer leiser                  | warm, tastend, Spätsommer           | akustische Gitarre (Fingerpicking), leises Klavier, ab dem zweiten Durchgang Cello                                                           | 76    | 96 s     | Kap. 1 erst nach der Pizza, nur Gitarre (Teil C, S1); danach beim Betreten der Karten | beim Betreten des Dachbodens; bei Victors Wagen (S9); in der Nacht (S5)              |
| `mapleFalls.club`       | `mapleFalls.clubraum`                                            | munter, aufgenommen                 | Gitarre, Klavier, Mundharmonika, Klatschen auf 2 und 4                                                                                       | 104   | 64 s     | Betreten des Clubraums (Kap. 5)                                                       | Beginn einer Clubpartie (dann `.clubkampf`) oder der Lernreihen (`.lernen`)          |
| `mapleFalls.lernen`     | Aufgabenreihen in Maple Falls (Clubraum, Park, Kreidebrett)      | Lernen als Spiel                    | Gitarre und Glockenspiel, Klavier tupft die Melodie                                                                                          | 92    | 48 s     | Beginn einer Aufgabenreihe                                                            | Ende der Reihe; jede gelöste Aufgabe legt das Aha-Motiv darüber                      |
| `mapleFalls.clubkampf`  | Clubkampf um die Nadel (Kap. 8), Partien gegen Clubmitglieder    | Herzklopfen, nicht bedrohlich       | Gitarre gedämpft, Kontrabass gezupft, Besen auf kleiner Trommel, Cello-Liegeton                                                              | 84    | 80 s     | erster Zug der Clubpartie                                                             | bei „Was hängt?“ alles bis auf den Herzschlag (S8); nach dem Matt die Fanfare        |
| `diner`                 | `mapleFalls.diner`, Szene `akt1.dinerAbend`                      | frech, warm, Abend                  | „aus der Jukebox“: E-Gitarre clean, Kontrabass, Besen, Orgel leise; klingt wie aus einem kleinen Lautsprecher (Höhen und Tiefen beschnitten) | 112   | 72 s     | Betreten des Diners                                                                   | bei Hectors Bericht für einen Takt (S7); Verlassen                                   |
| `weg`                   | `wegMapleCedar.landstrasse`; Kürbishof als `weg.kuerbishof`      | frei, Sommerende                    | Thema von Maple Falls schneller: Gitarre, Mundharmonika, Fiedel; Kürbishof mit Banjo statt Fiedel                                            | 112   | 90 s     | Betreten der Landstraße                                                               | Wechsel zum Flussweg (fließend, siehe nächste Zeile)                                 |
| `weg.fluss`             | `wegMapleCedar.flussweg`                                         | schattig, Atem holen                | Gitarre allein, Cello; die Mundharmonika ist weg                                                                                             | 96    | 90 s     | Betreten des Flusswegs (Überblendung 3 s)                                             | Wechsel zum Zedernpfad                                                               |
| `weg.zedern`            | `wegMapleCedar.zedernpfad`                                       | still, man kommt woanders an        | Gitarre leise, darüber zum ersten Mal das Klavier von Cedar Creek                                                                            | 80    | 96 s     | Betreten des Zedernpfads                                                              | am Ortseingang von Cedar Creek: Turmuhr, vier Schläge, ohne Musik (S12)              |
| `cedarCreek`            | `cedarCreek.aussen`, Drechslerei, Waschsalon leiser              | still, forschend                    | Klavier allein, mit langen Pausen zwischen den Phrasen                                                                                       | 63    | 120 s    | nach den vier Uhrschlägen bei der Ankunft; danach beim Betreten                       | wenn Victor im Bild ist (S18); in der Nacht am Steg (S20)                            |
| `cedarCreek.bibliothek` | `cedarCreek.bibliothek`                                          | gedämpft, feierlich                 | dasselbe Klavier, 10 dB leiser, mit Hall wie in einem hohen Raum                                                                             | 63    | 120 s    | Betreten der Bibliothek                                                               | bei „Whitlock“ (S13)                                                                 |
| `cedarCreek.archiv`     | `cedarCreek.archiv`                                              | feierlich, ein einzelner Lichtkegel | Klavier von Cedar Creek, darunter tiefes Cello (Liegetöne)                                                                                   | 56    | 120 s    | Betreten des Archivs                                                                  | beim Zeitungsabsatz (S14); geht über in `ambrose.erinnerung`                         |
| `cedarCreek.clubkampf`  | Clubkampf gegen Mrs. Okafor (Kap. 15), Partien im Club           | still gespannt                      | Klavier und gezupfter Kontrabass, sehr sparsam; **kein Schlagwerk**, die Turmuhr tickt darunter                                              | 72    | 96 s     | erster Zug                                                                            | beim angebotenen Bauern (S22); bei „Lass mich“ übernimmt `ambrose.lassMich`          |
| `cedarCreek.steg`       | Abend am Steg (Kap. 16)                                          | leise, entschlossen, Abendrot       | Klavier von Cedar Creek und Ambroses Kopf zum ersten Mal zusammen, Cello                                                                     | 60    | 120 s    | Beginn der Szene am Steg                                                              | bei „Eine Partie ohne Makel“ nur noch `ambrose` vollständig; bei seinem Lachen (S25) |
| `nachtstueck`           | Sternennacht (Kap. 14); genau dreimal im Spiel (Kap. 14, 55, 59) | weit, zärtlich                      | Klavier in hoher Lage, Glockenspiel, ein Hauch Streicher                                                                                     | 54    | 150 s    | nach der ersten Sternschnuppe, sehr leise (S20)                                       | am Morgen: Vögel, Nebel, keine Musik                                                 |
| `busfahrt`              | Busfahrt nach Maple Falls (Kap. 16)                              | müde, glücklich                     | Thema von Maple Falls, nur Gitarre, kehrt leise zurück                                                                                       | 76    | 96 s     | wenn der Bus anfährt                                                                  | bei Junos Nachricht (S26), danach ein Ton `konzern`                                  |

### A3. Figuren- und Szenenstücke

| Kennung              | Szene                                                        | Stimmung             | Instrumente                                                                                              | Tempo | Länge           | Setzt ein                                                                           | Setzt aus                                                       |
| -------------------- | ------------------------------------------------------------ | -------------------- | -------------------------------------------------------------------------------------------------------- | ----- | --------------- | ----------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| `ambrose`            | Dachboden nach dem Erwachen; Partien mit Ambrose; Kap. 3, 4  | Staunen, fragend     | altes Klavier oder Cembalo, nur der Kopf (vier Töne), darunter leise Gitarre                             | 66    | Schleife 64 s   | mit Ambroses erstem Satz (Kap. 2); leise unter der ersten Partie (Kap. 3)           | bei „Hale“ (Kap. 9) bricht der Kopf mitten im dritten Ton ab    |
| `ambrose.erinnerung` | Erzählung von 1858 im Archiv (Kap. 12)                       | feierlich, schuldig  | Cembalo und Cello, das Thema **vollständig** (acht Töne), Sepia-Bilder dazu                              | 58    | 90 s, einmal    | Beginn der Erzählung                                                                | bei „Später“: dumpfer Schlag (`spaeter`), dann 2 s Stille (S15) |
| `ambrose.walzer`     | Erinnerung New York 1857 (Kap. 12, Szene 20)                 | hell, glänzend, jung | dieselbe Melodie als Walzer im Dreiertakt, kleines Streichorchester, Klavier                             | 138   | 60 s, einmal    | Beginn der Erinnerung                                                               | beim Damenopfer hält alles an (S16), dann volle Auflösung, Ende |
| `ambrose.lassMich`   | „Lass mich“ im Clubkampf von Cedar Creek (Kap. 15)           | drängend, Versuchung | Ambroses Kopf, lauter als je zuvor, mit Streichern, immer wieder ansetzend                               | 72    | bis zur Zeile   | bei „Lass mich“                                                                     | reißt bei „Ich weiß es nicht“ ab (S23)                          |
| `victor`             | Victor in Maple Falls (Kap. 9), an der Haltestelle (Kap. 13) | kalt, kurz           | trockenes Klavier, Victors Motiv in Achteln über dem Moll-Bass; in der Partie ersetzt durch das Metronom | 120   | 4 Töne bis 16 s | Kap. 9 nach der Musikpause beim Wagen; Kap. 13 als vier einzelne Töne beim Weggehen | nach dem Motiv; nie unter einem Dialog von Ambrose              |
| `titel`              | Titelbild des Abenteuers                                     | Aufbruch, Staunen    | Gitarre mit dem Thema von Maple Falls, dann Ambroses Kopf auf dem alten Klavier, zum Schluss das Aha     | 76    | 75 s, Schleife  | Titelbild                                                                           | Start oder Fortsetzen                                           |

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

## Akt 1, Teil B: Geräusche

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

| Kennung                                         | Auslöser                                                                                                                                                                                              | Art                                       | Herkunft                   |
| ----------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------- | -------------------------- |
| `treppe`                                        | jede Stufe der Dachbodentreppe im Whitlock-Haus                                                                                                                                                       | einmalig je Stufe                         | Kap. 1                     |
| `knarren`                                       | die neunte Stufe; Dachboden (`#klang:knarren`, gibt es schon)                                                                                                                                         | einmalig                                  | Kap. 1, 2, 4               |
| `koenig_heben`                                  | Ding „König“ auf dem Brett im Dachboden anheben: tiefer, weicher Ton, schwillt an wie ein Einatmen (kein Schreck)                                                                                     | einmalig, 3 s                             | Kap. 2                     |
| `glocke_hell`                                   | direkt danach ein einzelner Glockenton, klingt lange nach                                                                                                                                             | einmalig, 4 s                             | Kap. 2                     |
| `auto_nacht`                                    | Szene `akt1.ersteNacht`: ein Auto fährt draußen vorbei, Licht wandert über die Decke                                                                                                                  | einmalig                                  | Kap. 4                     |
| `schulglocke`                                   | erster Schultag, Ankunft an der Schule; Ende einer Lernreihe im Clubraum                                                                                                                              | einmalig                                  | Kap. 5                     |
| `spindtuer`                                     | im Schulflur, auch zufällig unter `schulflur`                                                                                                                                                         | einmalig                                  | Kap. 5                     |
| `pfiff`                                         | Coach Delgado mit Trillerpfeife (`#klang:pfiff`, gibt es schon): Begrüßung, Abpfiff, Bus                                                                                                              | einmalig                                  | Kap. 5, 8, 15, 16          |
| `pfiff_finger`                                  | Pfiff auf zwei Fingern: nach dem Sieg in Kap. 8; Schluss der Sternennacht (Kap. 14)                                                                                                                   | einmalig, laut                            | Kap. 8, 14                 |
| `kreide`                                        | Kreidebrett auf dem Gehweg (Kap. 6), beim Ansehen                                                                                                                                                     | einmalig                                  | Kap. 6                     |
| `tuerglocke`                                    | Tür des Diners öffnet sich                                                                                                                                                                            | einmalig                                  | Kap. 7                     |
| `herzschlag`                                    | Clubkampf in Maple Falls bei „Was hängt?“, bis {held} zieht                                                                                                                                           | wiederholt, 70 je Minute                  | Kap. 8                     |
| `tagebuch`                                      | {held} schreibt das Ziel ins Tagebuch (Schreibanimation)                                                                                                                                              | einmalig, Stift auf Papier                | Kap. 8                     |
| `wagen`                                         | Victors Wagen hält vor dem Clubraum: leiser, teurer Motor, Tür                                                                                                                                        | einmalig                                  | Kap. 9                     |
| `metronom`                                      | Partie gegen Victor in Maple Falls                                                                                                                                                                    | wiederholt, 120 je Minute, ganze Partie   | Kap. 9                     |
| `tablet`                                        | Victor tippt auf dem Tablet: kurzes, trockenes Klicken                                                                                                                                                | wiederholt in Kap. 13, einmalig in Kap. 9 | Kap. 9, 13                 |
| `kasse_muenzen`                                 | Ehrlichkeitskasse am Apfelstand ansehen, Ada zählt                                                                                                                                                    | einmalig                                  | Kap. 10                    |
| `kraehen`                                       | Ada und die Krähen („Drei gegen zwei“)                                                                                                                                                                | einmalig                                  | Kap. 10                    |
| `turmuhr1`, `turmuhr4`, `turmuhr7`, `turmuhr12` | Glockenschlag der Turmuhr, mit Anzahl: vier bei der Ankunft (Kap. 10), sieben im Archiv (Kap. 12), zwölf nach dem Sieg im Clubkampf (Kap. 15); sonst beim Betreten von `cedarCreek.aussen` ein Schlag | einmalig je Schlag, 2,5 s Abstand         | Kap. 10, 12, 15; Ortsblatt |
| `zeitung`                                       | Großansicht der Zeitung von 1858 öffnen                                                                                                                                                               | einmalig, Papier                          | Kap. 12                    |
| `spaeter`                                       | bei „Später“ in der Erzählung von 1858: dumpfer Schlag wie eine Tür                                                                                                                                   | einmalig                                  | Kap. 12                    |
| `trockner_figuren`                              | Brett auf dem Trockner ansehen: Figuren zittern leise                                                                                                                                                 | einmalig über `waschmaschine`             | Kap. 11                    |
| `sternschnuppe`                                 | jede Sternschnuppe in der Sternennacht: heller, kurzer Glockenton (die erste etwas lauter)                                                                                                            | einmalig je Schnuppe                      | Kap. 14                    |
| `angelschnur`                                   | Morgen am Steg: eine Angelschnur surrt                                                                                                                                                                | einmalig                                  | Kap. 14                    |
| `bus`                                           | Bus hält mit einem Seufzer, Türen (`#klang:bus`, gibt es schon); Kap. 14 von fern klappernd                                                                                                           | einmalig                                  | Kap. 14, 16                |
| `bus_hupe`                                      | der Bus hupt am Steg                                                                                                                                                                                  | einmalig                                  | Kap. 16                    |
| `handy`                                         | Junos Handy summt (Nachricht aus Riverton)                                                                                                                                                            | einmalig                                  | Kap. 16                    |
| `karte`                                         | eine Karte wird vergeben (`#klang:karte`, gibt es schon)                                                                                                                                              | einmalig                                  | alle                       |
| `nadel`                                         | die Clubnadel wird angesteckt: kleines Klicken unter der Fanfare                                                                                                                                      | einmalig                                  | Kap. 8, 15                 |

Nicht als Geräusch, sondern als Musik geführt (Teil A4): der tiefe Ton bei „Hale“, der kalte
Konzernton, das Aha, die Fanfare. Ambroses Lachen in Kapitel 16 ist Text, kein Geräusch; dort ist
nur Stille (S25).

---

## Akt 1, Teil C: Stillen

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

## Akt 2, Teil A: Musik

Akt 2 hat zwei Gegensätze (Befunde Akt 2, Abschnitt 3): Riverton ist wild und schnell, Ironwood
fest und schwer. Die Wege dazwischen (Bahndamm, Eisenbrücke) haben **kein Thema**, nur Geräusche.
Neue Leitmotive: Mamas Thema (Kapitel 25, vollständig Kapitel 27); am Schluss erklingen Ambroses
und Victors Thema gleichzeitig (Kapitel 29).

### 2A1. Ortsthemen und ihre Fassungen

| Kennung              | Ort oder Szene                                 | Stimmung                   | Instrumente                                                                                                                      | Tempo | Schleife | Setzt ein                                      | Setzt aus                                                                                                                   |
| -------------------- | ---------------------------------------------- | -------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | ----- | -------- | ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `weg.zedernwald`     | `wegCedarRiverton.zedernwald` (Kap. 17)        | Aufbruch im Schatten       | das Klavier von Cedar Creek mit einem leichten, gehenden Kontrabass                                                              | 72    | 96 s     | Betreten                                       | am Bahndamm: Musik aus (S28)                                                                                                |
| `riverton`           | `riverton.aussen` (Kap. 18 bis 22)             | laut, nass, lebendig       | gedämpfte Trompete, Kontrabass, Besen auf der kleinen Trommel; Swing in Moll, Uhrenklopfen als Rhythmus                          | 132   | 72 s     | Betreten                                       | bei „dann ist er …“ fällt die Trompete einen Takt weg (S29); nahe den Bildschirmtischen legt sich `konzern.flaeche` darüber |
| `riverton.pavillon`  | `riverton.pavillon`                            | Blitz, Freude              | wie `riverton`, schneller; das Klopfen der Schachuhren ist der Schlag                                                            | 152   | 64 s     | Betreten des Pavillons                         | am Montag (Kap. 22): weg, nur noch `konzern.flaeche` (S33)                                                                  |
| `riverton.pops`      | Pops’ Erzählung über Mr. Odum (Kap. 19)        | Erinnerung, Respekt        | das Stadtthema nur auf dem Kontrabass, langsam                                                                                   | 80    | 60 s     | Beginn der Erzählung                           | Ende der Erzählung                                                                                                          |
| `riverton.gitarre`   | Kap. 20 (Schuppen, Fahrrad)                    | ruhig, Morgen              | das Stadtthema nur auf einer Gitarre, langsam                                                                                    | 84    | 72 s     | Betreten des Schuppens                         | Verlassen                                                                                                                   |
| `riverton.clubkampf` | Clubkampf gegen Slick (Kap. 22)                | schnell, frech, dann leise | das Stadtthema schnell, Trompete vorn, Uhrenschläge, Regen auf Blech darunter                                                    | 160   | 64 s     | erster Zug                                     | bei den leisen Zügen Zug um Zug dünner, bis nur Regen bleibt (S31); Slicks Nachdenken (S32)                                 |
| `riverton.wohnwagen` | `riverton.wohnwagen` (Kap. 22)                 | leise, Verlust             | das Stadtthema auf einer einzelnen Mundharmonika, langsam                                                                        | 66    | 80 s     | Betreten                                       | Verlassen                                                                                                                   |
| `weg.fahrrad`        | `wegRivertonIronwood.kanalweg` (Kap. 24)       | leicht, Bewegung           | das Wegthema schnell, Gitarre und Mundharmonika; die Fahrradklingel als Akzent am Ende jeder Phrase                              | 126   | 80 s     | Betreten                                       | an der Eisenbrücke: Musik aus (S34)                                                                                         |
| `ironwood`           | `ironwood.aussen` (Kap. 25 bis 29)             | schwer, rußig              | tiefe Blechbläser (Posaune, Tuba), ein schwerer, langsamer Schlag wie ein Schmiedehammer, darüber eine einzelne warme Klarinette | 60    | 120 s    | Betreten                                       | am Werkstor (Kap. 29): kein Thema (S42)                                                                                     |
| `ironwood.kantine`   | `ironwood.kantine`                             | drinnen warm               | das Ironwood-Thema mit Akkordeon statt Bläsern, Klarinette; der Hammer nur fern                                                  | 76    | 96 s     | Betreten (nach 2 s Stille beim Eintreten, S38) | bei „Bist du Lauries Kind?“ (S35)                                                                                           |
| `ironwood.feier`     | Feier in der Kantine (Kap. 28)                 | ausgelassen                | das Ironwood-Thema als Tanz: Akkordeon, Klarinette, Klatschen, Stimmengewirr                                                     | 120   | 64 s     | Beginn der Feier                               | bei Big Joes Pokal kurz leise (S40)                                                                                         |
| `ironwood.clubkampf` | Clubkampf gegen Big Joe (Kap. 28)              | Schraubstock               | der Schmiedehammer als langsamer Puls, tiefe Bläser, deren Akkorde Zug um Zug enger werden (Halbtöne)                            | 56    | 96 s     | erster Zug                                     | beim Opfer hält der Hammer an (S41)                                                                                         |
| `mapleFalls.klavier` | Küche in Maple Falls nach dem Verbot (Kap. 23) | allein, traurig            | das Thema von Maple Falls nur auf dem Klavier, langsam                                                                           | 60    | 96 s     | nachdem Mamas Wagen weggefahren ist            | Ende der Szene                                                                                                              |

### 2A2. Figuren- und Szenenstücke

| Kennung               | Szene                                                     | Stimmung               | Instrumente und Töne                                                                                                     | Länge                                 | Setzt ein                                             | Setzt aus                                                                                                                 |
| --------------------- | --------------------------------------------------------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------ | ------------------------------------- | ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `konzern.flaeche`     | Bildschirmtische in Riverton; Graham Hales Rede (Kap. 29) | glatt, hell, ohne Atem | der Konzernton (♯4) als liegender Synthesizerton, dazu leise die Quinte darüber                                          | Schleife 30 s                         | in der Nähe der Tische; am Pavillon am Montag         | im Pavillon (Kap. 18, 19); bei „Vater, vielleicht …“ 0,5 s (S44)                                                          |
| `ambrose.london`      | Erinnerung London 1851 (Kap. 21)                          | glänzend, jung         | Walzer mit Streichern und Cembalo; Ambroses Kopf in der jungen, schnellen Fassung; Murmeln und Tassen darunter           | 75 s, einmal                          | wenn die neun Uhrschläge in Hufschlag übergehen (T13) | Anderssens stiller Königszug (S30); Damenopfer: gehaltener Akkord; Matt: Auflösung; Rückkehr: der Walzer zerfällt in Hall |
| `london.lauf`         | Kieseritzky läuft zum Telegrafenamt (Kap. 21)             | übermütig              | der Lauf (A1) als Galopp: Streicher pizzicato und Cembalo                                                                | 10 s, einmal                          | bei „Er ist zum Telegrafenamt gelaufen“               | Rückkehr in die Halle                                                                                                     |
| `ambrose.zweifel`     | „Oder doch?“ (Kap. 21); Schluss am Fluss (Kap. 22)        | Versuchung             | Ambroses Kopf, die ♯4 aber auf dem Digitalpiano des Konzerns; am Fluss liegt `konzern.flaeche` darunter und reibt sich   | 12 s                                  | an der Zeile                                          | nach dem Motiv                                                                                                            |
| `ambrose.cello`       | Museum nach dem Brief (Kap. 26)                           | erschüttert            | Ambroses vollständiges Thema auf einem einzelnen Cello, sehr langsam                                                     | 60 s, einmal                          | nach der langen Pause (S37)                           | Beginn der Erinnerung                                                                                                     |
| `ambrose.nachtwalzer` | Erinnerung an Morphy in New York (Kap. 26)                | nachts, dann hell      | das New-York-Thema in Moll, Klavier allein, Kerzenknistern; mit Morphys Damenzug nach Dur und mit Streichern             | 70 s, einmal                          | Beginn der Erinnerung                                 | Rückkehr ins Museum                                                                                                       |
| `mama`                | Elm Street (Kap. 25), Küche (Kap. 27), Schnee (Kap. 29)   | zögernd, warm          | Mamas Thema (A1) auf dem Klavier; in Kap. 25 und bei „jede Nacht“ (Kap. 27) nur vier Töne, dann bricht es ab             | 20 s                                  | nach der Umarmung (Kap. 25)                           | beim leeren Blatt nach dem vierten Ton                                                                                    |
| `mama.vollstaendig`   | „Ich hab ihn gesehen“ (Kap. 27)                           | Erlösung               | Mamas Thema mit allen fünf Tönen und der Auflösung; danach mit dem ganzen Kantinenklang (Akkordeon, Klarinette, Stimmen) | 45 s, einmal, dann `ironwood.kantine` | an der Zeile                                          | Ende der Szene                                                                                                            |
| `ambrose.mama`        | Schluss Kap. 28                                           | Frieden                | Ambroses Kopf, dann Mamas Thema, nacheinander, ohne Konzernton                                                           | 30 s                                  | Ende von Kap. 28                                      | –                                                                                                                         |
| `victor.unsicher`     | Brücke (Kap. 29)                                          | zögernd                | Victors Thema auf dem trockenen Klavier, aber nicht im Takt: Pause vor dem letzten Ton                                   | 10 s                                  | wenn Victor auf der Brücke steht                      | –                                                                                                                         |
| `ambrose.victor`      | „J. H.“ am Ende von Akt 2 (Kap. 29)                       | Erkennen               | Ambroses Kopf (altes Klavier, frei) und Victors Thema (trockenes Klavier, Achtel) **gleichzeitig**: dieselben Töne       | 20 s                                  | bei „J. H.“                                           | Abspann: Schnee, Stille (S45)                                                                                             |

### 2A3. Kurzmotive in Akt 2

Die Kurzmotive aus A4 gelten weiter. Die `fanfare` bekommt die Farbe des Orts: in Riverton mit
gedämpfter Trompete (`fanfare.riverton`), in Ironwood mit Bläsern und einem Hammerschlag
(`fanfare.ironwood`). `hale` (der einzelne tiefe Ton aus Akt 1) kehrt in Kapitel 24 bei „J. H.“
wieder.

## Akt 2, Teil B: Geräusche

### 2B1. Dauergeräusche je Karte

| Kennung          | Karte, Tageszeit                                                                                        | Dauer                         | Kapitel    |
| ---------------- | ------------------------------------------------------------------------------------------------------- | ----------------------------- | ---------- |
| `specht`, `bach` | `wegCedarRiverton.zedernwald`                                                                           | zufällig / dauernd            | 17         |
| `schiene_singt`  | `wegCedarRiverton.bahndamm`: Schienen singen leise, Wind                                                | dauernd                       | 17         |
| `regen`          | `riverton.aussen`, `.pavillon` (auf Planen), `.wohnwagen` (auf Blech, `regen_blech`); Abend in Riverton | dauernd (Zustand Regen, T14)  | 18, 19, 22 |
| `stadt_riverton` | `riverton.aussen`: Stimmen, Hupen, aus Fenstern verschiedene Musik (sehr leise, kurz)                   | zufällig, 5–15 s              | 18         |
| `uhrenklopfen`   | `riverton.pavillon`: Spieler drücken die Schachuhren                                                    | dauernd, als Rhythmus         | 18, 19     |
| `bahnhofshalle`  | `riverton.bahnhofshalle`: große Uhr tickt als Grundpuls; Durchsagen als Hall ohne Worte; Tauben         | dauernd / zufällig            | 19, 21     |
| `fluss`          | Riverton am Fluss (Schluss Kap. 22)                                                                     | dauernd                       | 22         |
| `kraehen`        | `wegRivertonIronwood.kanalweg`                                                                          | zufällig, 10–25 s             | 24         |
| `wind_traeger`   | `wegRivertonIronwood.bruecke`: Wind in den Trägern als tiefer, singender Ton                            | dauernd                       | 24         |
| `werk`           | `ironwood.aussen`: Fauchen des Hochofens in Abständen, fernes Rangieren, ab und zu ein Hammerschlag     | zufällig, 15–40 s             | 25, 27, 29 |
| `kantine`        | `ironwood.kantine`: der Ofen bullert, Tassen, Stimmen                                                   | dauernd                       | 25, 27, 28 |
| `standuhr`       | `ironwood.museum`: Standuhr, die unregelmäßig tickt                                                     | dauernd                       | 26         |
| `kueche`         | Küche in Maple Falls (`mapleFalls.wohnzimmer`): Kühlschrank, Küchenuhr, Wasserfall leise                | dauernd                       | 23, 27     |
| `schnee`         | `ironwood.aussen` im ersten Schnee: gedämpfte Welt, Schritte knirschen (`schritt_schnee`)               | dauernd (Zustand Schnee, T14) | 29, 30     |

### 2B2. Einmalige Geräusche

| Kennung                 | Auslöser                                                                                               | Art                            | Kapitel    |
| ----------------------- | ------------------------------------------------------------------------------------------------------ | ------------------------------ | ---------- |
| `gueterzug`             | Güterzug am Bahndamm: von fern hörbar, laut, lang, danach Wind                                         | einmalig, 25 s                 | 17         |
| `schachuhr`             | Partie mit Uhr am Bahndamm, Blitz gegen Harlan: Ticken, das mit sinkender Zeit lauter und dichter wird | wiederholt, ganze Partie       | 17, 19     |
| `donner_fern`           | Schluss Kap. 17                                                                                        | einmalig                       | 17         |
| `uhr_hufschlag`         | Bahnhofshalle: neun Schläge der großen Uhr, die in Hufschlag übergehen (T13)                           | einmalig, 15 s                 | 21         |
| `kaffeehaus`            | London 1851: Murmeln, Tassen (unter `ambrose.london`)                                                  | dauernd während der Erinnerung | 21         |
| `lachen_kieseritzky`    | nach dem Matt in der Erinnerung                                                                        | einmalig                       | 21         |
| `applaus_regen`         | Sieg gegen Slick: Applaus, der wie Regen klingt, vor der Fanfare                                       | einmalig                       | 22         |
| `besen_stein`           | Fegen vor dem Schuppen                                                                                 | einmalig                       | 20         |
| `schloss`               | Schloss am Fahrrad klemmt, dann gibt es nach                                                           | einmalig                       | 20         |
| `fahrradklingel`        | heller Ton; wird das Geräusch für „Fahrrad benutzen“; Morgen nach dem Verbot                           | einmalig                       | 20, 23, 24 |
| `reifen_erde`           | Fahren mit dem Fahrrad auf Erde                                                                        | dauernd beim Fahren            | 24         |
| `spruehdose`            | Graffiti-Mauer: Klackern der Kugel, Zischen                                                            | einmalig, 4 s                  | 24         |
| `haustuer`, `wagen_weg` | Mama verlässt das Haus, der Wagen fährt weg (Kap. 23)                                                  | einmalig                       | 23         |
| `siegel`                | Wachssiegel bricht (Museum; wieder im Antiquariat, Kap. 44)                                            | einmalig                       | 26, 44     |
| `kerze`                 | Kerzenknistern in der Erinnerung an Morphy                                                             | dauernd während der Erinnerung | 26         |
| `pokale`                | Big Joe trägt den Karton: Klirren der Pokale bei jedem Schritt                                         | wiederholt je Schritt          | 29         |
| `kantine_jubel`         | Sieg gegen Big Joe: das Brüllen der Kantine nach der Fanfare                                           | einmalig                       | 28         |
| `bus_abfahrt`           | Bus fährt aus Ironwood ab                                                                              | einmalig                       | 29         |

## Akt 2, Teil C: Stillen

| Nr. | Kap. | Stelle                                                | Was bleibt                                                                             | Dauer                                                    |
| --- | ---- | ----------------------------------------------------- | -------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| S28 | 17   | Bahndamm, auch die Partie mit Uhr                     | Schiene, Güterzug, Wind; in der Partie nur das Ticken                                  | ganze Karte                                              |
| S29 | 18   | „dann ist er …“                                       | Stadtthema ohne Trompete                                                               | ein Takt, etwa 2 s                                       |
| S30 | 21   | London: Anderssens stiller Königszug                  | nichts (vollkommen)                                                                    | 2 s, dann das Damenopfer als gehaltener Akkord           |
| S31 | 22   | Clubkampf: die leisen Züge                            | die Musik wird je Zug dünner, am Ende nur Regen                                        | bis Slick nachdenkt                                      |
| S32 | 22   | Slicks langes Nachdenken                              | Regen und Ticken                                                                       | bis Slick zieht, höchstens 30 s                          |
| S33 | 22   | Montag im Pavillon                                    | nur `konzern.flaeche`, wo die Uhren klopften                                           | ganze Szene                                              |
| –   | 23   | Mama: „Nein“                                          | **keine** Stille und **keine** Pause: Das Verbot kommt trocken, der Dialog geht weiter | –                                                        |
| S34 | 24   | Eisenbrücke                                           | Wind in den Trägern; bei „J. H.“ der Ton `hale`                                        | ganze Karte                                              |
| S35 | 25   | „Bist du Lauries Kind?“                               | nichts (vollkommen)                                                                    | 3 s                                                      |
| S36 | 25   | Elm Street bis zur Umarmung                           | Schritte, Schnee                                                                       | bis zur Umarmung, dann `mama`                            |
| S37 | 26   | Museum: Absender „J. Hale“                            | nichts, auch die Standuhr fällt weg                                                    | **mindestens 5 s**, nicht füllen; dann `ambrose.cello`   |
| S38 | 27   | Mamas Erzählung; Eintreten in die Kantine             | Kühlschrank, Wasserfall; Ofen                                                          | ganze Erzählung; beim Eintreten 2 s                      |
| S39 | 27   | Partie gegen Mama: sie hält inne                      | nichts (vollkommen); vorher nur Ofen und ab und zu der Hammer                          | bis Mama zieht, höchstens 20 s; dann `mama.vollstaendig` |
| S40 | 28   | Feier: Big Joes Pokal                                 | Stimmen leise                                                                          | 3 s                                                      |
| S41 | 28   | Clubkampf: das Opfer des Helden; danach „Ach, Kumpel“ | Kantine; der Hammer hält an                                                            | 2 s; „Ach, Kumpel“ ohne Musik                            |
| S42 | 29   | Werkstor                                              | Wind, fernes Werk; `konzern.flaeche` unter der Rede                                    | ganze Szene                                              |
| S43 | 29   | Big Joe kommt heraus                                  | nur `pokale`                                                                           | bis er steht                                             |
| S44 | 29   | „Vater, vielleicht …“                                 | der Konzernton setzt aus                                                               | 0,5 s                                                    |
| S45 | 29   | Abspann von Akt 2                                     | Schnee                                                                                 | ganzer Abspann                                           |

## Akt 3, Teil A: Musik

Akt 3 ist der Akt von Ambrose. Seine Musik wird erst gebannt (ZERO), fehlt dann ganz (Kapitel 36
bis 40), kehrt verstimmt zurück und wird am Ende rein. Neue Leitmotive: ZERO, Miss Odiles Lied, das
Thema des Helden, Miras Motiv, Hales Motiv (A1).

### 3A1. Ortsthemen und ihre Fassungen

| Kennung                   | Ort oder Szene                                                                         | Stimmung                 | Instrumente                                                                                                                     | Tempo | Schleife | Setzt ein                          | Setzt aus                                                                                    |
| ------------------------- | -------------------------------------------------------------------------------------- | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------- | ----- | -------- | ---------------------------------- | -------------------------------------------------------------------------------------------- |
| `weg.bus`                 | Busfahrt nach Silicon Bay (Kap. 30)                                                    | flach, gleichmäßig       | das Wegthema ohne Verzierung, gleichmäßige Achtel, Gitarre und Bass                                                             | 100   | 90 s     | Abfahrt                            | an der Schnellstraße: nur Rauschen                                                           |
| `siliconBay`              | `siliconBay.aussen`, `wegIronwoodSilicon.glasbruecke` (Schluss), `.hafen`, `.altstadt` | schön, ohne Atem         | Synthesizerflächen in **einer** Tonart (lydisch, die ♯4 liegt oben), ein gleichmäßiger Puls ohne Schlagzeug (gefilterte Achtel) | 96    | 120 s    | Ende der Glasbrücke (Kap. 30)      | an Rosies Wagen (in Reichweite, siehe `rosie`)                                               |
| `siliconBay.akademie`     | `siliconBay.akademie`, `.lobby`                                                        | Raumklang                | dasselbe Thema 10 dB leiser, wie aus der Decke; Hall                                                                            | 96    | 120 s    | Betreten                           | wenn ZERO spielt                                                                             |
| `siliconBay.clubkampf`    | Clubkampf gegen Dr. Lin (Kap. 33)                                                      | klar, geordnet           | das Thema als saubere Klavierfigur (Arpeggien in Sechzehnteln), über der Fläche                                                 | 108   | 80 s     | erster Zug                         | nach dem seltsamen Bauernzug stockt die Figur, Töne fehlen; Sieg: `fanfare` gedämpft         |
| `rosie`                   | Rosies Food-Truck (Kap. 31)                                                            | warm, laut, lebendig     | Gitarre, Händeklatschen, Bratgeräusche; Dashs Stimme als Rhythmus                                                               | 112   | 64 s     | in 20 Schritten Umkreis des Wagens | außerhalb wieder `siliconBay` (braucht eine Klangquelle mit Reichweite, Hinweis an mittel-2) |
| `faehre`                  | `wegSiliconDelacroix.faehre` (Kap. 35)                                                 | weit, salzig             | Akkordeon, Gitarre, langsamer Walzer; Wellen und Möwen darunter                                                                 | 84    | 120 s    | Ablegen                            | Deich                                                                                        |
| `portDelacroix.trauer`    | `portDelacroix.aussen`, erste Ankunft; draußen nach dem Vorwurf (Kap. 35, 36)          | wund                     | eine einzelne Trompete, langsam, ohne Begleitung; die Melodie ist Miss Odiles Lied                                              | 56    | 90 s     | Ankunft                            | ohne Übergang `portDelacroix` (Kap. 35)                                                      |
| `portDelacroix`           | `portDelacroix.aussen` (Kap. 35 bis 40)                                                | trotzig, tanzend         | Trompete, Klarinette, Waschbrett, Banjo; Hämmern aus den Häusern im Rhythmus                                                    | 116   | 80 s     | direkt nach `portDelacroix.trauer` | bis Kap. 40 an jeder Stelle, an der Ambrose sonst spräche: kurze Lücke (S52)                 |
| `portDelacroix.werkstatt` | `portDelacroix.werkstatt`, Rue des Facteurs (Kap. 38, 40)                              | Handwerk, Geduld         | keine Musik, nur einzelne Klaviertöne aus offenen Türen und singende Sägen                                                      | –     | –        | Betreten                           | bei „Hier war es“ `ambrose.verstimmt`                                                        |
| `odile.tanz`              | Benefiz (Kap. 40)                                                                      | Fest                     | Miss Odiles Lied als Tanz: Remys Trompete schnell, Klarinette, Waschbrett, Klatschen der Halle                                  | 132   | 64 s     | Beginn des Benefiz                 | Ende                                                                                         |
| `weg.wueste`              | Wüstenzug, `wegDelacroixDesert.canyonpfad` (Kap. 41)                                   | weit, leer               | das Wegthema weit und langsam, Slide-Gitarre, viel Hall                                                                         | 70    | 120 s    | Zug                                | im Canyon: keine Musik, bis Ambrose spricht (S55)                                            |
| `desertSprings`           | `desertSprings.aussen` (Kap. 43 bis 46)                                                | trocken, hell, tröstlich | Slide-Gitarre, sehr sparsam, viel Raum zwischen den Tönen; Windspiel                                                            | 66    | 120 s    | Betreten                           | –                                                                                            |
| `desertSprings.clubkampf` | Clubkampf gegen Mira (Kap. 46)                                                         | Sturm gegen Ruhe         | Miras Motiv als Sturm (Gitarre, Händeklatschen, schnell), darunter das Thema des Helden ruhig                                   | 144   | 64 s     | erster Zug                         | beim stillen Zug bricht Miras Motiv ab (S60); nach „Atme“ `mira.held`                        |
| `motel.nacht`             | Nacht am Motel (Kap. 46)                                                               | weit, leer, zärtlich     | Slide-Gitarre allein, darüber leise das Thema des Helden; kein Glockenspiel (das Nachtstück bleibt für Kap. 14, 55, 59)         | 50    | 150 s    | Beginn der Nacht                   | Victors Nachricht                                                                            |

### 3A2. Figuren- und Szenenstücke

| Kennung                     | Szene                                                                      | Stimmung                | Instrumente und Töne                                                                                                                   | Länge         | Setzt ein                                    | Setzt aus                                               |
| --------------------------- | -------------------------------------------------------------------------- | ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | ------------- | -------------------------------------------- | ------------------------------------------------------- |
| `mama.schnee`               | Haltestelle in Maple Falls (Kap. 30); Abfahrt aus Desert Springs (Kap. 46) | warm                    | Mamas Thema vollständig, Klavier, gedämpfte Schritte im Schnee                                                                         | 30 s          | an der Haltestelle                           | Bus fährt an                                            |
| `zero`                      | ZERO spielt (Kap. 32); Nacht mit dem Tablet (Kap. 34)                      | vollkommen, schön, leer | das ZERO-Motiv (A1): perlende, gleichmäßige Sechzehntel, Celesta und Synthesizer                                                       | Schleife 60 s | wenn ZERO spielt; in Kap. 34 die ganze Nacht | **läuft bei „Und ich?“ weiter** (keine Stille, Kap. 34) |
| `ambrose.gebannt`           | Ambrose sieht ZERO zu (Kap. 32)                                            | gebannt                 | Ambroses Kopf versucht, im Takt von `zero` mitzuspielen, wird schneller, bis er nicht mehr mitkommt und zerfällt                       | 25 s          | an der Zeile                                 | –                                                       |
| `ambrose.victor.einstimmig` | Vitrine in der Akademie (Kap. 32)                                          | Erkennen, leise         | Ambroses und Victors Thema **einstimmig** als eine Melodie, sehr leise, Klavier                                                        | 15 s          | nach der Stille an der Vitrine (S46)         | –                                                       |
| `spannung`                  | Auswertung (Kap. 33)                                                       | Unbehagen               | ein tiefer, gehaltener Ton (Kontrabass gestrichen), dazu Tippen auf Glas                                                               | 30 s          | Beginn der Auswertung                        | Ende                                                    |
| `ambrose.fern`              | Schluss Kap. 34                                                            | Sehnsucht               | vier Töne von Ambroses Kopf, weit weg, wie aus einem anderen Raum (Hall, Tiefpass)                                                     | 10 s          | am Schluss                                   | –                                                       |
| `ambrose.verzerrt`          | Ambrose am Bug der Fähre (Kap. 35)                                         | gestört                 | Ambroses Kopf, über den sich das perlende `zero` legt und nicht weggeht                                                                | 20 s          | an der Zeile                                 | –                                                       |
| `remy.mauer`                | Partie gegen Remy (Kap. 36)                                                | Druck                   | tiefe, näherkommende Töne (Bläser und Pauke gerieben), immer lauter                                                                    | Schleife 40 s | Remys Mauer                                  | „König nach h1“: `zero` aus Ambroses Mund               |
| `ambrose.ende`              | „Dann spiele ich ohne dich“ (Kap. 36)                                      | Abschied                | vier Töne stufenweise abwärts: 5 – ♯4 – 3 – 2 (der fremde Ton bleibt), keine Antwort, dann nichts                                      | 6 s           | an der Zeile                                 | Ambroses Thema kehrt bis Kap. 38 nicht wieder           |
| `odile`                     | Miss Odile singt am Kai (Kap. 37); summt im Clubkampf (Kap. 39)            | alt, einfach            | ihr Lied (A1), eine Stimme ohne Begleitung; im Clubkampf gesummt, bricht ab                                                            | 40 s          | an der Zeile                                 | –                                                       |
| `ambrose.verstimmt`         | „Hier war es“ (Kap. 38); „Das bin ich“ (Kap. 40)                           | zart                    | Ambroses Thema auf einem einzelnen verstimmten Klavier; in Kap. 40 vollständig, und das Klavier wird im Lauf der Szene rein gestimmt   | 40 bis 60 s   | an der Zeile                                 | Foto: Stille (S54)                                      |
| `stimmton`                  | Erinnerung 1840 (Kap. 38)                                                  | Ursprung                | der Vater schlägt eine Saite an: die 5 von Ambroses Thema, erst schwebend, dann rein; bei der Rückkehr verklingt der reine Ton         | 12 s          | Beginn der Erinnerung                        | –                                                       |
| `ambrose.vierhaendig`       | Erinnerung 1852 (Kap. 38)                                                  | fröhlich                | Ambroses Thema als fröhliches Stück zu vier Händen, Claires Klatschen                                                                  | 40 s, einmal  | 1852                                         | Rückkehr: `stimmton`                                    |
| `held`                      | Clubkampf gegen Miss Odile (Kap. 39)                                       | eigen, still            | das Thema des Helden (A1): drei aufsteigende Töne auf einem einzelnen Instrument, ganz leise; zum Sieg einmal vollständig              | 8 s / 25 s    | wenn der Plan entsteht                       | Sieg: **keine Fanfare**, sondern `held` vollständig     |
| `celeste`                   | Céleste in der Werkstatt (Kap. 40)                                         | heute                   | ein leichter Beat aus ihren Kopfhörern, leise, mischt sich in `ambrose.verstimmt` und stört nicht                                      | Schleife 30 s | wenn Céleste im Raum ist                     | –                                                       |
| `ambrose.held`              | „Mit dir“ (Kap. 40); „Das ist schöner“ (Kap. 42)                           | zusammen                | Ambroses Thema, dann übernimmt der Held die zweite Hälfte mit seinen drei Tönen (5 – 3 – ♯4 – 2 – 3 – 5); am Felsbogen auf der Gitarre | 30 s          | an der Zeile                                 | –                                                       |
| `ambrose.gitarre`           | Canyon, wenn Ambrose spricht (Kap. 41)                                     | vorsichtig              | Ambroses Kopf auf der Gitarre statt auf dem Klavier                                                                                    | Schleife 60 s | Ambroses erster Satz im Canyon               | Felsbogen: Wind, dann Stille                            |
| `mira`                      | Mira tritt auf (Kap. 41, 43, 45)                                           | verspielt, hell         | Miras Motiv (A1), Gitarre und Klatschen                                                                                                | 8 s           | wenn Mira hereinkommt                        | –                                                       |
| `tiefer_streicher`          | „Erzähl mir von 1866“ (Kap. 42)                                            | ernst                   | ein einziger tiefer Streicherton                                                                                                       | 8 s           | an der Zeile                                 | –                                                       |
| `ambrose.heiter`            | Lektion am Felsbogen (Kap. 42)                                             | hell, fast heiter       | Ambroses Thema auf der Gitarre, schneller, Dur-Begleitung                                                                              | Schleife 60 s | Beginn der Lektion                           | Brücke                                                  |
| `hale.horn`                 | Brücke am Felsbogen (Kap. 42)                                              | friedlich               | Hales Motiv (A1) auf dem Horn                                                                                                          | 15 s          | auf der Brücke                               | –                                                       |
| `ambrose.hale`              | „Er hat gewartet“ (Kap. 44)                                                | Antwort                 | Ambroses Thema und Hales Motiv (Horn) dieselbe Melodie im Kanon, ein Takt Abstand; am Schluss beide einstimmig                         | 45 s          | an der Zeile, nach der Stille (S57)          | Ende der Szene                                          |
| `ambrose.stolpert`          | Die Stellung von 1858 in der Garage (Kap. 45)                              | Erinnerung, Unruhe      | `ambrose.erinnerung` gedämpft; bei den drei fahrigen Zügen stolpert das Thema (Takte fehlen, Töne doppelt)                             | 40 s          | Aufbau der Stellung                          | Mira: „Das Opfer war richtig!“, `mira` bricht herein    |
| `ambrose.rein`              | Schluss Kap. 45                                                            | Frieden                 | Ambroses Thema rein (A1): in Dur, ohne den fremden Ton, Gitarre und gestimmtes Klavier                                                 | 40 s          | nach seinem Lachen (S59)                     | –                                                       |
| `atme`                      | „Atme“ im Clubkampf (Kap. 46)                                              | Ruhe                    | ein einzelner langer Ton (die 5), Cello                                                                                                | 6 s           | an der Wahl „Atme“ (T19)                     | danach `mira.held`                                      |
| `mira.held`                 | nach „Atme“ (Kap. 46)                                                      | zäh und schön           | Miras Motiv und das Thema des Helden miteinander, im selben Tempo                                                                      | Schleife 64 s | nach `atme`                                  | Sieg: `fanfare`                                         |
| `victor.maschine`           | Victors Nachricht (Kap. 46)                                                | kalt, falsch            | Victors Thema; der letzte Ton kommt vom Digitalpiano des Konzerns und ist einen Halbton zu tief                                        | 6 s           | an der Nachricht                             | –                                                       |
| `endspiel`                  | Schluss von Akt 3 (Kap. 46)                                                | kalt, schön             | das Endspielmotiv (A1), vier Töne, Streicher ohne Vibrato                                                                              | 12 s          | nach `mama.schnee` bei der Abfahrt           | Abspann                                                 |

### 3A3. Kurzmotive in Akt 3

`fanfare` in Silicon Bay gedämpft (`fanfare.gedaempft`), in Port Delacroix **keine** (dort `held`
vollständig), in Desert Springs mit Slide-Gitarre (`fanfare.wueste`). `riverton.postkarte`: das
Riverton-Thema kurz auf der Mundharmonika, wenn Slicks Postkarte gelesen wird (Kap. 37, 5 s).
`abschaltton`: der Bildschirm in der Akademie geht aus (Kap. 33), ein leiser fallender
Synthesizerton, danach wirkliche Stille (S48).

**Geklärt (13.11.2026):** Die Randnotiz zu Kapitel 36 sagt jetzt „bis Kapitel 38“; Ambroses Thema
kehrt dort zart auf dem verstimmten Klavier des Hauses zurück.

**Befund an den Hauptchat:** Die Randnotiz zu Kapitel 46 nennt für die Nacht am Motel „das
Nachtstück von Cedar Creek“. Nach der Vorgabe erklingt das Nachtstück genau dreimal (Kapitel 14, 55,
59), und Kapitel 55 nennt sich „zum zweiten Mal im Spiel“. Der Plan setzt am Motel deshalb ein
eigenes Stück (`motel.nacht`); die Randnotiz zu Kapitel 46 sollte entsprechend geändert werden.
Außerdem nennt die Randnotiz zu Kapitel 21 keine Musik für Kieseritzkys Lauf; der Plan ergänzt
`london.lauf`, weil Kapitel 65 ihn aufnimmt.

## Akt 3, Teil B: Geräusche

### 3B1. Dauergeräusche je Karte

| Kennung          | Karte, Tageszeit                                                                                                    | Dauer                      | Kapitel |
| ---------------- | ------------------------------------------------------------------------------------------------------------------- | -------------------------- | ------- |
| `schnee`         | Haltestelle in Maple Falls: gedämpfte Schritte                                                                      | dauernd                    | 30      |
| `bus_innen`      | Busfahrt (aus Akt 1)                                                                                                | dauernd                    | 30      |
| `schnellstrasse` | `wegIronwoodSilicon.raststaette`: gleichförmiges Rauschen ohne Rhythmus                                             | dauernd                    | 30      |
| `glasbruecke`    | `wegIronwoodSilicon.glasbruecke`: Schritte hell und hohl (`schritt_glas`), darunter Rauschen                        | dauernd                    | 30      |
| `geraete`        | `siliconBay.aussen`: leises Summen von Geräten; **kein** Tier, **kein** Wind                                        | dauernd                    | 31      |
| `stadtpuls`      | Hotel, Morgen in Silicon Bay: ferner, gleichmäßiger Stadtpuls                                                       | dauernd                    | 33, 34  |
| `akademie`       | `siliconBay.akademie`: Tippen auf Glas; `.lobby`: Hall, Schritte auf Stein                                          | zufällig / dauernd         | 32      |
| `serverraum`     | `siliconBay.serverraum`: Lüfterrauschen, hohes Sirren, kalt                                                         | dauernd                    | 33      |
| `see`            | Fähre: Wellen, Möwen, Schiffsmaschine                                                                               | dauernd                    | 35      |
| `deich`          | `wegSiliconDelacroix.deich`: Schaufeln, Sandsäcke                                                                   | zufällig, 4–10 s           | 35      |
| `wiederaufbau`   | `portDelacroix.aussen`: Hämmern aus den Häusern (läuft im Takt von `portDelacroix`), Sägen                          | dauernd                    | 35, 37  |
| `kai`            | Kai in Port Delacroix: Wellen an Holz                                                                               | dauernd                    | 37      |
| `turnhalle`      | `portDelacroix.turnhalle`: Hall, Stimmen, Stühle                                                                    | dauernd                    | 36, 40  |
| `werkstatt`      | `portDelacroix.werkstatt`: Leim, Hobel; Rue des Facteurs: singende Sägen, einzelne Klaviertöne                      | zufällig, 5–15 s           | 38, 40  |
| `zug`            | Wüstenzug: Schienen, gleichmäßig                                                                                    | dauernd                    | 41      |
| `canyon`         | `wegDelacroixDesert.canyonpfad`, `.felsbogen`: Wind in Felsen, ein einzelner Vogelruf, Echo auf Stimmen             | dauernd / zufällig 30–60 s | 41, 42  |
| `wueste`         | `desertSprings.aussen`: Wind, Windspiel                                                                             | dauernd                    | 43      |
| `motel`          | Motel in Desert Springs: ein altes Radio, leise                                                                     | dauernd                    | 43, 45  |
| `garage`         | `desertSprings.garage`: Werkzeugklirren, ein Ratschenschlüssel als Rhythmus; abends Grillen und das Radio vom Motel | dauernd                    | 43, 45  |
| `antiquariat`    | `desertSprings.antiquariat`: Papier, Wanduhr, Wind an den Fensterläden; im Keller nur eine summende Glühbirne       | dauernd                    | 44      |

### 3B2. Einmalige Geräusche

| Kennung          | Auslöser                                                                             | Art                             | Kapitel |
| ---------------- | ------------------------------------------------------------------------------------ | ------------------------------- | ------- |
| `lieferroboter`  | ein Lieferroboter fährt vorbei: Summen, das näher kommt und vergeht                  | einmalig je Roboter             | 31      |
| `abschaltton`    | Bildschirm aus in der Akademie                                                       | einmalig                        | 33      |
| `delfin`         | ein Delfin springt neben der Fähre: heller Spritzer                                  | einmalig                        | 35      |
| `stuhl_faellt`   | Remy stößt den Stuhl um; die Halle verstummt                                         | einmalig                        | 36      |
| `saite`          | Erinnerung 1840: eine Klaviersaite wird angeschlagen und gestimmt (siehe `stimmton`) | einmalig                        | 38      |
| `klatschen`      | Claires Klatschen (1852); die Halle beim Benefiz                                     | einmalig / dauernd beim Benefiz | 38, 40  |
| `zapfsaeule`     | Tankstelle in Desert Springs: quietschende Zapfsäule                                 | einmalig beim Ansehen           | 43      |
| `siegel`         | zwei gleiche Siegel; das Siegel von Hales Brief bricht                               | einmalig                        | 44      |
| `figuren_kippen` | die drei fahrigen Züge in der Garage: Figuren klappern auf dem Brett                 | einmalig je Zug                 | 45      |

## Akt 3, Teil C: Stillen

| Nr. | Kap. | Stelle                                                                                 | Was bleibt                                                                          | Dauer                                                                  |
| --- | ---- | -------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| S46 | 32   | Vitrine in der Akademie                                                                | nichts (vollkommen)                                                                 | 3 s, dann `ambrose.victor.einstimmig`                                  |
| S47 | 33   | Hotelzimmer                                                                            | ferner Stadtpuls                                                                    | ganze Szene                                                            |
| S48 | 33   | Bildschirm aus                                                                         | nichts (vollkommen), nach dem `abschaltton`                                         | 4 s, „wirkliche Stille“                                                |
| –   | 34   | „Und ich?“                                                                             | **keine Stille**: `zero` läuft einfach weiter; Ambroses Thema fehlt die ganze Szene | – (das ist das Schlimme)                                               |
| S49 | 36   | Turnhalle, Remy stößt den Stuhl um                                                     | nichts, auch die Halle schweigt                                                     | 3 s                                                                    |
| S50 | 36   | „Er hat nicht ganz unrecht“                                                            | nichts (vollkommen)                                                                 | 4 s                                                                    |
| S51 | 36   | nach `ambrose.ende` bis Kap. 38                                                        | Ambroses Thema fehlt                                                                | zwei Kapitel                                                           |
| S52 | 37   | wo Ambrose sonst spräche (Stadt, Kai)                                                  | eine kurze Lücke in `portDelacroix`                                                 | je 1,5 s                                                               |
| S53 | 39   | Clubkampf gegen Miss Odile                                                             | Raumklang: Atmen, ein Stuhl, fernes Hämmern; Odiles Summen bricht ab                | die ganze Partie, bis der Plan entsteht (`held`)                       |
| S54 | 40   | das Foto in der Werkstatt                                                              | Werkstatt leise                                                                     | 3 s                                                                    |
| S55 | 41   | Canyon                                                                                 | Wind, Vogelruf, Schritte auf Kies                                                   | bis Ambrose spricht                                                    |
| S56 | 42   | Felsbogen: Wind, dann Stille; Ambroses Bitte um Verzeihung; „Ich bin nicht angekommen“ | nichts (vollkommen)                                                                 | Ankunft 4 s; die Bitte ganz ohne Musik; „Ich bin nicht angekommen“ 4 s |
| S57 | 44   | Hales Brief wird gelesen; nach „Ich warte.“                                            | Wanduhr während des Lesens; danach nichts                                           | Brief ohne Musik; nach „Ich warte.“ **mindestens 5 s** vollkommen      |
| S58 | 45   | die Stellung von 1858: nach den drei fahrigen Zügen                                    | Grillen                                                                             | 2 s                                                                    |
| S59 | 45   | Ambroses Lachen                                                                        | Grillen, Radio                                                                      | lang: 6 s, dann `ambrose.rein`                                         |
| S60 | 46   | Clubkampf: der stille Zug                                                              | Miras Motiv bricht ab, nur Raumklang                                                | bis „Atme“                                                             |
| S61 | 46   | Miras „Noch mal. Jetzt.“                                                               | Raumklang                                                                           | ohne Musik, 3 s                                                        |

---

## Akt 4, Teil A: Musik

Akt 4 löst ein, was die ersten drei Akte angelegt haben (Befunde Akt 4, Abschnitt 1). Musikalisch
heißt das: Die Leitmotive kommen an. Victors Thema wird warm, Ambroses Thema schließt mit einem
Schlusston, der Held und Ambrose spielen eine Melodie, das Konzernmotiv verschwindet. Neu: das
Endspielmotiv, das Arena-Thema, Novas Thema, das Crossroads-Stück, das Lagerfeuerlied, der Aufbau
der Fernpartie, der Lauf, der Schlussklang (alle in A1).

### 4A1. Ortsthemen und ihre Fassungen

| Kennung                | Ort oder Szene                                                          | Stimmung                   | Instrumente                                                                                                                                                                                                                                       | Tempo | Schleife | Setzt ein                            | Setzt aus                                                                    |
| ---------------------- | ----------------------------------------------------------------------- | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----- | -------- | ------------------------------------ | ---------------------------------------------------------------------------- |
| `weg.wueste.held`      | Fahrt zur Hochebene, `wegDesertSummit.bergstrasse` (Kap. 47)            | Aufbruch, weit             | das Wegthema mit Slide-Gitarre (wie `weg.wueste`), das Thema des Helden als zweite Stimme                                                                                                                                                         | 76    | 120 s    | Abfahrt                              | Diner                                                                        |
| `diner`                | `wegDesertSummit.diner` (Kap. 47)                                       | wie in Akt 1               | das Jukebox-Stück aus Akt 1, mit Slide-Gitarre statt E-Gitarre                                                                                                                                                                                    | 112   | 72 s     | Betreten                             | Verlassen                                                                    |
| `hochebene`            | `hochebene.felsentuerme`, `.schule` (Kap. 47)                           | heutig, mit Humor          | Flöte und Handtrommel, eine Gitarre; nicht „alt“                                                                                                                                                                                                  | 100   | 80 s     | Betreten                             | –                                                                            |
| `summitCity`           | `summitCity.aussen`, `.bergstation`, `.bergladen` (Kap. 48 bis 52)      | klar, kalt, karg           | das Endspielmotiv: einzelne Klaviertöne mit viel Raum, ein hohes Streicherflageolett                                                                                                                                                              | 48    | 150 s    | Betreten                             | Bergstation: kein Thema, bis Victor rückt (S65)                              |
| `summitCity.lernen`    | Lernen bei Ward (Kap. 48)                                               | ruhig                      | das Endspielmotiv als ruhige Schleife, Klavier und Cello                                                                                                                                                                                          | 56    | 90 s     | Beginn einer Aufgabenreihe           | Ende der Reihe                                                               |
| `summitCity.clubkampf` | Clubkampf gegen Ward (Kap. 52)                                          | Klarheit                   | das Endspielmotiv; mit jedem Abtausch fällt ein Ton weg; das Thema des Helden sehr ruhig darunter                                                                                                                                                 | 52    | 120 s    | erster Zug                           | Opposition: reine Quinte gehalten (A1); Sieg **ohne** Fanfare (S67)          |
| `crossroads`           | `crossroads.aussen`, `.raststaette` (Kap. 53)                           | bunt, alle sind da         | Ortsthemen nacheinander, je vier Takte, in G-Dur über einem durchgehenden, fröhlichen Rhythmus (Gitarre, Kontrabass, Besen): Ironwood, Riverton, Silicon Bay als Rosies Gitarre, Desert Springs, Maple Falls; Stimmengewirr und Geschirr darunter | 112   | 50 s     | Betreten                             | Nova: alles tritt zurück (S69); Schluss: Kaffeehausklang aus London darunter |
| `wald.orgelpunkt`      | `wegCrossroadsPinewood.riesenbaeume`, `.huetten` (Kap. 54)              | Stille, Ehrfurcht          | ein tiefer, langer Ton wie ein Orgelpunkt (die 1), kaum hörbar                                                                                                                                                                                    | –     | 120 s    | Betreten                             | –                                                                            |
| `blindschach`          | Blindschach im Wald (Kap. 54)                                           | konzentriert               | jeder gesagte Zug ein leiser Ton: Linie a bis h = Stufen 1 bis 7 und 1', Reihe 1 bis 8 = Lage von tief nach hoch; Glockenspiel                                                                                                                    | –     | –        | erster gesagter Zug                  | Ende der Partie                                                              |
| `pinewood`             | `pinewoodCamp.aussen` am Tag (Kap. 55)                                  | verspielt                  | das Wegthema mit Banjo und Gitarre, leichter Rhythmus; darunter Kinderstimmen                                                                                                                                                                     | 108   | 80 s     | Betreten                             | Lagerfeuer                                                                   |
| `lagerfeuer`           | Lagerfeuer im Camp (Kap. 55)                                            | warm, kindlich             | Ezras Gitarre mit zwei fehlenden Saiten (nur drei Akkorde I, IV, V): die Köpfe aller acht Ortsthemen als Strophen eines Kinderlieds, je zwei Takte, Refrain = das Thema des Helden; Mitsingen ohne Worte                                          | 96    | 70 s     | am Feuer                             | Räuberschach (`held.rueckwaerts`), Steg (`nachtstueck`)                      |
| `staubstrasse`         | `wegPinewoodGhost.canyonrand`, `.staubstrasse`, `.tankstelle` (Kap. 56) | die Farbe geht             | das Wegthema; mit den Farben (T22) verliert es Obertöne (Tiefpass, dann Hochpass), bis ein dünner hoher Ton bleibt                                                                                                                                | 72    | 120 s    | Canyonrand                           | Ghost Town: keine Musik (S71)                                                |
| `seeufer`              | `wegGhostCapital.seeufer`, `.leuchtturm` (Kap. 60)                      | alle Farben zurück         | das Wegthema in voller Besetzung (Gitarre, Mundharmonika, Fiedel, Klavier, Cello, Glockenspiel), weit und hell                                                                                                                                    | 96    | 120 s    | Betreten                             | Hauptstadt                                                                   |
| `arena`                | `capitalArena.aussen`, `.innenstadt`, Treppe (Kap. 60)                  | groß, festlich, menschlich | das Arena-Thema (A1); an der Treppe nacheinander alle acht Ortsthemen je zwei Takte darunter                                                                                                                                                      | 104   | 90 s     | nach dem Verkehrslärm der Hauptstadt | Halle                                                                        |
| `arena.halle`          | `capitalArena.halle` zwischen den Partien (Kap. 61, 62)                 | gedämpft                   | keine Musik; Raumklang der Halle                                                                                                                                                                                                                  | –     | –        | –                                    | –                                                                            |
| `arena.vorrunde`       | Montage Runde 1 und 2 (Kap. 61)                                         | Fortschritt                | das Thema des Helden als kurze, gleichmäßige Schleife, Gitarre und Klavier                                                                                                                                                                        | 100   | 40 s     | Runde 1                              | Runde 3: Stille um den Tisch (S75)                                           |

### 4A2. Figuren- und Szenenstücke

| Kennung                  | Szene                                                      | Stimmung             | Instrumente und Töne                                                                                                                                                                                                                                                                               | Länge                | Setzt ein                        | Setzt aus                                                                      |
| ------------------------ | ---------------------------------------------------------- | -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------- | -------------------------------- | ------------------------------------------------------------------------------ |
| `hastings`               | Wards Erzählung von Hastings (Kap. 49)                     | später, reifer       | der Erinnerungswalzer als Streichquartett statt Cembalo; bei jedem Schach des Turms ein gezupfter Ton, sechsmal, steigend; Auflösung warm                                                                                                                                                          | 80 s, einmal         | Beginn der Erzählung             | danach `ambrose.rein`                                                          |
| `geraet`                 | Victors Partie mit dem Gerät (Kap. 50)                     | leer                 | kein Thema: Das Summen des Geräts (kurz, lang, lang) ersetzt Victors Thema; mit jedem Summen verliert `summitCity` einen Ton                                                                                                                                                                       | ganze Partie         | Beginn der Zuschauerpartie (T23) | Telefon; das Gerät schlittert (S64)                                            |
| `bergstation`            | Partie an der Bergstation (Kap. 51)                        | einfach so           | das Thema des Helden, leicht; Victors Thema versucht mitzugehen und stolpert bei den dummen Zügen, und das Stolpern klingt fröhlich                                                                                                                                                                | Schleife 60 s        | wenn Victor rückt                | sein Lachen (S66)                                                              |
| `victor.warm`            | nach dem Lachen (Kap. 51); Aussage (Kap. 62)               | warm                 | Victors Thema mit Pedal und Atem, Dur-Begleitung statt Moll-Bass                                                                                                                                                                                                                                   | 15 s                 | an der Zeile                     | –                                                                              |
| `ambrose.hale.grundton`  | „Er hat geantwortet“ (Kap. 51)                             | Antwort              | Ambroses Thema und Hales Motiv einstimmig; beide enden gemeinsam auf dem Grundton (ohne Akkord)                                                                                                                                                                                                    | 20 s                 | an der Zeile                     | –                                                                              |
| `fanfare.leise`          | nach „Jetzt zeig mir, wie“ (Kap. 52)                       | spät, wachsend       | die Fanfare leise, wächst mit dem Klatschen                                                                                                                                                                                                                                                        | 8 s                  | nach der Erklärung               | –                                                                              |
| `ambrose.still`          | Blindschach, „Es ist still“ (Kap. 54)                      | Ruhe                 | Ambroses Thema ohne Begleitung, langsam; endet auf der 1, die nicht mehr fragt                                                                                                                                                                                                                     | 30 s                 | Ambroses Satz im Wald            | –                                                                              |
| `held.rueckwaerts`       | Räuberschach (Kap. 55)                                     | Spaß                 | das Thema des Helden rückwärts (5 – 3 – 2), schnell, auf der Gitarre mit zwei fehlenden Saiten                                                                                                                                                                                                     | 5 s                  | jede geschlagene Figur           | –                                                                              |
| `ambrose.angekommen`     | Friedhof, „Hier bin ich angekommen“ (Kap. 56)              | fern                 | Ambroses Thema einmal, auf einer einzelnen Mundharmonika, sehr fern                                                                                                                                                                                                                                | 20 s                 | an der Zeile                     | Bus                                                                            |
| `kerzenton`              | Übergang in die Erinnerung 1866 (Kap. 57)                  | warm                 | ein einzelner warmer Ton, wenn das Mondlicht Kerzenlicht wird                                                                                                                                                                                                                                      | 4 s                  | Übergang                         | –                                                                              |
| `ambrose.1866`           | der Königszug in der Erinnerung (Kap. 57)                  | erfüllt              | Ambroses Thema vollständig, einzelnes Klavier, langsam, endet auf dem Grundton (einstimmig)                                                                                                                                                                                                        | 40 s                 | beim Königszug 40. Kxg3          | Kerze aus: Stille (S72)                                                        |
| `fernpartie`             | Aufbau der Fernpartie im Saloon (Kap. 58, T24)             | Sammlung             | zu jedem Fragment vier Takte aus dem Ortsthema des Fundorts, immer leiser: Maple Falls, Cedar Creek, Riverton, Ironwood, Port Delacroix, Desert Springs, Summit City                                                                                                                               | 7 × etwa 8 s         | erstes Fragment                  | bei der Stellung: Stille                                                       |
| `b5`                     | Victors Zug b5 (Kap. 58)                                   | Antwort              | ein einzelnes Holzgeräusch, dann Ambroses Thema und Hales Motiv einstimmig, einmal                                                                                                                                                                                                                 | 15 s                 | an der Zeile                     | die Partie selbst: keine Musik, nur Züge und Wind                              |
| `hale.springer`          | Victors Springerzug (Kap. 58); Novas Springerzug (Kap. 61) | ein Mensch findet es | Hales Motiv einmal auf dem Horn; in Kap. 61 nur dieser eine Hornton (die 5) als Hinweis                                                                                                                                                                                                            | 10 s / 3 s           | an der Zeile                     | –                                                                              |
| `ambrose.schluss`        | „Nicht makellos. Schön.“ (Kap. 58)                         | erfüllt              | Ambroses Thema vollständig mit dem Schlusston (A1)                                                                                                                                                                                                                                                 | 45 s                 | an der Zeile                     | –                                                                              |
| `nachtstueck`            | Steg im Camp (Kap. 55); vor dem Saloon (Kap. 59)           | weit, zärtlich       | das Nachtstück aus Akt 1 vollständig; in Kap. 59 mit Ambroses Thema als Gegenstimme. **Danach nie wieder.**                                                                                                                                                                                        | 150 s                | Steg / draußen in der Nacht      | Kap. 59: „Bleib“ hält an (ein gehaltener Ton), „Ein Möbelstück“ weiter, leiser |
| `ambrose.held.gespraech` | Schluss Kap. 59                                            | Gespräch             | das Thema des Helden und Ambroses Thema im Wechsel, Phrase um Phrase                                                                                                                                                                                                                               | 40 s                 | Schluss der Szene                | –                                                                              |
| `leuchtturm`             | Leuchtturm am See (Kap. 60)                                | ruhig                | ein tiefer, langsamer Ton für jedes Aufleuchten                                                                                                                                                                                                                                                    | Schleife 12 s        | in Sichtweite                    | –                                                                              |
| `nova`                   | Runde 3 gegen Nova (Kap. 61)                               | zart, dann fest      | Novas Thema (A1), zuerst nur der Anfang, unsicher; im Lauf der Partie fester; beim Remis vollständig                                                                                                                                                                                               | Schleife 60 s / 25 s | wenn Nova sich „anders hinsetzt“ | Remis: `nova` vollständig                                                      |
| `zero.halbfinale`        | Halbfinale (Kap. 63)                                       | schön, unerbittlich  | das ZERO-Motiv über einem tiefen Puls; das Thema des Helden versucht dagegen anzukommen und wird Zug um Zug dünner                                                                                                                                                                                 | Schleife 60 s        | erster Zug                       | der Turm wird gesehen: Herzschlag (S77); der Schuh: ZERO reißt ab (S78)        |
| `ambrose.suchend`        | „Ambrose.“ und „Ich weiß es nicht“ (Kap. 63)               | gemeinsam suchend    | Ambroses Thema sofort, leise; dann beide Themen suchend ineinander                                                                                                                                                                                                                                 | 30 s                 | „Ambrose.“                       | der Schuh                                                                      |
| `zusammen`               | „Zusammen“ (Kap. 63)                                       | Höhepunkt            | die eine Melodie von Ambrose und Held (A1), voll, mit allem, was das Spiel an Instrumenten hat                                                                                                                                                                                                     | vier Takte, 12 s     | an der Zeile                     | Matt: Jubel                                                                    |
| `mit.dir`                | „Mit dir“ nach dem Halbfinale (Kap. 63)                    | still                | dieselbe Melodie, nur Klavier                                                                                                                                                                                                                                                                      | 15 s                 | an der Zeile                     | –                                                                              |
| `hale.victor`            | „Entschuldige, Victor“ (Kap. 64)                           | Versöhnung           | Hales Motiv und Victors Thema, dieselbe Melodie, eine Oktave auseinander                                                                                                                                                                                                                           | 20 s                 | an der Zeile                     | –                                                                              |
| `mama.ruhig`             | Mama im Gang (Kap. 64)                                     | ruhig                | Mamas Thema vollständig, ruhig                                                                                                                                                                                                                                                                     | 25 s                 | an der Zeile                     | –                                                                              |
| `ambrose.scherzo`        | Ambrose am Automaten (Kap. 64)                             | heiter               | Ambroses Kopf (rein) als Scherzo, vier Töne, Pizzicato und Glockenspiel                                                                                                                                                                                                                            | 4 s                  | an der Zeile                     | –                                                                              |
| `finale.eroeffnung`      | Finale, Eröffnung (Kap. 65)                                | freundlich           | Victors Thema und das Thema des Helden abwechselnd                                                                                                                                                                                                                                                 | Schleife 60 s        | erster Zug                       | „Zug zwölf“                                                                    |
| `zug.zwoelf`             | „Zug zwölf“ (Kap. 65)                                      | Erinnerung, gewendet | Victors Thema wie in Kap. 9 (Achtel, trockenes Klavier), aber mit Dur-Begleitung                                                                                                                                                                                                                   | 8 s                  | an der Zeile                     | Mittelspiel                                                                    |
| `finale.mittelspiel`     | Finale, Mittelspiel (Kap. 65)                              | ruhig, reich         | beide Themen miteinander; nacheinander scheinen die Farben aller Lehrer auf, je ein Instrument: Delgado Mundharmonika, Mrs. Okafor Klavier allein, Slick gedämpfte Trompete, Big Joe Akkordeon, Dr. Lin Celesta, Miss Odile Klarinette, Mira Slide-Gitarre mit Klatschen, Ward Streicherflageolett | Schleife 120 s       | Mittelspiel                      | Fehler: ein einzelner falscher Ton, dann Stille (S79)                          |
| `held.allein`            | „Einen, den du merkst“ (Kap. 65)                           | wachsen              | das Thema des Helden beginnt allein, sehr leise, und wächst                                                                                                                                                                                                                                        | 40 s                 | an der Zeile                     | der Bauer: Stille (S80)                                                        |
| `victor.lauf`            | Victors Lauf (Kap. 65)                                     | Freude               | der Lauf (A1) mit vollem Orchester, Jubel darüber                                                                                                                                                                                                                                                  | 20 s                 | Victor rennt                     | Schluss: Ambroses Thema kaum hörbar unter dem Lärm                             |
| `abschied.treppe`        | Treppe nach dem Finale (Kap. 66)                           | Abschied, warm       | Ambroses Thema ganz zart, durchgehend, als Grund unter dem Gespräch; die Trompete weit weg                                                                                                                                                                                                         | Schleife 90 s        | Treppe                           | „Menschen, die kämpfen …“                                                      |
| `abschied`               | „Menschen, die kämpfen …“, Verbeugung (Kap. 66)            | leise                | die eine Melodie aus dem Halbfinale auf zwei Instrumenten; zur Verbeugung die vier fragenden Töne vom Dachboden                                                                                                                                                                                    | 30 s                 | an der Zeile                     | „Später?“: Stille (S81)                                                        |
| `ambrose.nichtSpaeter`   | „Dieses eine Mal nicht später“ (Kap. 66)                   | Ende                 | Ambroses Thema vollständig mit dem Schlusston, der sehr lange verklingt                                                                                                                                                                                                                            | 50 s                 | an der Zeile                     | Lichtwechsel                                                                   |
| `mapleFalls.herbst`      | Herbst in Maple Falls (Kap. 66)                            | wie am ersten Tag    | das Thema von Maple Falls wie in Kap. 1: nur Gitarre                                                                                                                                                                                                                                               | 96 s                 | Herbst                           | Abspann                                                                        |
| `abspann`                | Abspann des Spiels (Kap. 66, T27)                          | Rückblick            | alle Ortsthemen nacheinander zu den Bildern (je acht Takte), zwischen den Akten Mamas, Victors und Ambroses Thema                                                                                                                                                                                  | etwa 4 min           | Abspann                          | Dachboden                                                                      |
| `schlussklang`           | „Was hängt?“ (Kap. 66)                                     | Anfang               | der Schlussklang (A1)                                                                                                                                                                                                                                                                              | 6 s                  | an der Zeile                     | Ende des Spiels                                                                |

### 4A3. Kurzmotive in Akt 4

`fanfare` in Summit City erst spät und leise (`fanfare.leise`), im Halbfinale keine (dort `zusammen`
und Jubel), im Finale keine (dort `victor.lauf`). `aufgabe`: Victor gibt auf, ein einzelner Ton
(die 1, Klavier, 3 s). `fehler`: ein einzelner falscher Ton im Finale (die ♭2 auf dem Klavier).
`konzern` erklingt zum letzten Mal in Kapitel 62.

## Akt 4, Teil B: Geräusche

### 4B1. Dauergeräusche je Karte

| Kennung              | Karte, Tageszeit                                                                                           | Dauer              | Kapitel   |
| -------------------- | ---------------------------------------------------------------------------------------------------------- | ------------------ | --------- |
| `diner_kueche`       | `wegDesertSummit.diner`: Kaffeetassen, Küche (aus Akt 1)                                                   | dauernd            | 47        |
| `hochebene_wind`     | `hochebene.*`: Wind über Fels, Falkenrufe                                                                  | dauernd / zufällig | 47        |
| `summit`             | `summitCity.aussen`: Wind, Seilbahn surrt, Murmeltierpfiffe; abends Kuhglocken fern                        | dauernd / zufällig | 48        |
| `kamin`              | `summitCity.huette`: Kaminfeuer, sonst nichts                                                              | dauernd            | 48 bis 52 |
| `seilbahnrad`        | `summitCity.bergstation`: Wind, das Rad der Seilbahn als langsamer, gleichmäßiger Puls                     | dauernd            | 51        |
| `fest_fern`          | Summit City am Abend: Trommeln, Lachen, Feuerwerk von unten, gedämpft durch die Höhe                       | zufällig           | 49        |
| `geysire`            | `wegSummitCrossroads.geysirbecken`: Fauchen, Blubbern                                                      | dauernd / zufällig | 53        |
| `praerie`            | `wegSummitCrossroads.praerie`: Wind im Gras, Schnauben der Bisons                                          | dauernd / zufällig | 53        |
| `crossroads_stimmen` | `crossroads.*`: Stimmengewirr, Geschirr; am Schluss der Kaffeehausklang aus London (`kaffeehaus`)          | dauernd            | 53        |
| `wald_tief`          | `wegCrossroadsPinewood.*`: fast vollkommene Stille, fernes Tropfen, Schritte auf weichem Boden             | dauernd            | 54        |
| `camp`               | `pinewoodCamp.aussen`: Stimmen von vierzig Kindern, See, Specht; abends Lagerfeuer knistert                | dauernd            | 55        |
| `canyonrand`         | `wegPinewoodGhost.canyonrand`: Rufe mit dreifachem Echo                                                    | zufällig           | 56        |
| `staubstrasse_wind`  | `wegPinewoodGhost.staubstrasse`: Motor, Wind                                                               | dauernd            | 56        |
| `ghosttown`          | `ghostTown.aussen`: Wind in Brettern, eine Tür, die schlägt, der rollende Busch; nachts Grillen            | dauernd / zufällig | 56, 57    |
| `saloon`             | `ghostTown.saloon`: Wind durch das Dach, Gaskocher; Stimmen durch die Wand                                 | dauernd            | 58, 59    |
| `see_hell`           | `wegGhostCapital.seeufer`: Wellen, Möwen                                                                   | dauernd            | 60        |
| `hauptstadt`         | `capitalArena.innenstadt`, `.ubahnhof`: Verkehr                                                            | dauernd            | 60        |
| `halle`              | `capitalArena.halle`: Hall, Stimmen, Lautsprecherdurchsagen ohne Worte; im Turnier gedämpft: Uhren, Husten | dauernd            | 60 bis 65 |
| `halle_still`        | Aussage und Finale: der Raumton einer sehr großen, sehr stillen Halle                                      | dauernd            | 62, 65    |
| `gang`               | Gang hinter der Halle: Neonsummen, Automat, ferner Hallenlärm                                              | dauernd            | 64        |
| `abend_treppe`       | Treppe nach dem Finale: Abend, ferne Stimmen                                                               | dauernd            | 66        |
| `dachboden`          | Epilog: Holzknacken, Wind (aus Akt 1), dazu der Schaukelstuhl                                              | dauernd / zufällig | 66        |

### 4B2. Einmalige Geräusche

| Kennung                    | Auslöser                                                                                     | Art                            | Kapitel |
| -------------------------- | -------------------------------------------------------------------------------------------- | ------------------------------ | ------- |
| `schraubenschluessel`      | jemand arbeitet unter dem Bus                                                                | einmalig                       | 47      |
| `turm_zupf`                | Hastings: jedes Schach des Turms, ein gezupfter Ton, sechsmal steigend (Teil von `hastings`) | einmalig je Schach             | 49      |
| `geraet_summen`            | Victors Gerät: kurz, lang, lang                                                              | einmalig je Zug                | 50      |
| `telefon`                  | Telefon in der Hütte                                                                         | einmalig                       | 50      |
| `geraet_faellt`            | das Gerät schlittert über das Brett, Könige fallen                                           | einmalig                       | 50      |
| `tuer_schritte`            | Tür, rennende Schritte, die sich nach oben entfernen                                         | einmalig                       | 50      |
| `tippen_hoert_auf`         | Theo tippt auf dem Tablet und hört auf                                                       | einmalig                       | 53      |
| `pfiff`                    | Coach Delgado (aus Akt 1)                                                                    | einmalig                       | 53      |
| `tandem`                   | Kreischen und Lachen beim Tandem                                                             | einmalig                       | 55      |
| `sternschnuppe`            | derselbe Glockenton wie in Akt 1                                                             | einmalig                       | 55, 59  |
| `metalldetektor`           | Piepen des Metalldetektors in Ghost Town                                                     | wiederholt                     | 56      |
| `bus`                      | Bus (aus Akt 1)                                                                              | einmalig                       | 56      |
| `feder`                    | Erinnerung 1866: Kerze knistert, Atem, Feder auf Papier                                      | dauernd während der Erinnerung | 57      |
| `stiefel_pferd`            | Stiefel auf der Treppe, Pferd, Hufe                                                          | einmalig                       | 57      |
| `besen`                    | im Saloon wird gefegt                                                                        | einmalig                       | 58      |
| `holz_zug`                 | ein einzelnes Holzgeräusch (eine Figur wird gesetzt), bei b5                                 | einmalig                       | 58      |
| `scheinwerfer`             | tiefes Einschaltgeräusch                                                                     | einmalig                       | 62      |
| `mikrofon`                 | Mikrofonklopfen                                                                              | einmalig                       | 62      |
| `abschaltton`              | jeder Bildschirm geht aus, im Kreis; mit dem letzten endet das Konzernmotiv                  | einmalig je Bildschirm         | 62      |
| `aufstehen`                | Stühle, Stoff, kein Applaus                                                                  | einmalig                       | 62      |
| `nova_summen`              | Novas Hand am Ohr: kaum hörbares, abgebrochenes Summen (Erinnerung an das Gerät)             | einmalig je Griff              | 61      |
| `schachuhr`                | Runde 4: Ticken, schnell (aus Akt 2)                                                         | dauernd während der Partie     | 61      |
| `herzschlag`               | der Turm wird gesehen (aus Akt 1)                                                            | wiederholt                     | 63      |
| `jubel`                    | Matt im Halbfinale; Victors Lauf                                                             | einmalig                       | 63, 65  |
| `gong`                     | Gong vor dem Finale                                                                          | einmalig                       | 64      |
| `atem`                     | Victors Nachdenken im Finale: nur Atem                                                       | dauernd bis zum Zug            | 65      |
| `koenig_heben_rueckwaerts` | Lichtwechsel: der weiche Ton aus Kapitel 2 rückwärts                                         | einmalig                       | 66      |
| `tagebuch`                 | Stift auf Papier (aus Akt 1)                                                                 | einmalig                       | 66      |
| `treppe`, `knarren`        | die neunte Stufe im Epilog (aus Akt 1)                                                       | einmalig                       | 66      |
| `schaukelstuhl`            | der Schaukelstuhl auf dem Dachboden                                                          | wiederholt                     | 66      |

## Akt 4, Teil C: Stillen

| Nr. | Kap. | Stelle                                                           | Was bleibt                                                   | Dauer                                                             |
| --- | ---- | ---------------------------------------------------------------- | ------------------------------------------------------------ | ----------------------------------------------------------------- |
| S62 | 48   | die drei Figuren auf dem Brett in der Hütte                      | nichts (vollkommen)                                          | solange man hinsieht, mindestens 3 s                              |
| S63 | 50   | Victors Partie mit dem Gerät                                     | Kamin, das zwischendurch still wird; Summen, Züge            | ganze Partie                                                      |
| S64 | 50   | nach den rennenden Schritten                                     | nichts                                                       | 3 s                                                               |
| S65 | 51   | Bergstation, bis Victor rückt                                    | Wind, Seilbahnrad                                            | bis zum ersten Zug                                                |
| S66 | 51   | Victors Lachen; das Blatt mit Hales Seite                        | Wind                                                         | Lachen 4 s ohne Musik; das Blatt 4 s                              |
| S67 | 52   | Sieg gegen Ward                                                  | Kamin                                                        | bis „Jetzt zeig mir, wie“ und die Erklärung; dann `fanfare.leise` |
| S68 | 53   | Prärie                                                           | Wind im Gras, Bisons                                         | ganze Karte                                                       |
| S69 | 53   | Nova spricht in Crossroads                                       | `crossroads` tritt zurück, nur ihre Stimme                   | ganzes Gespräch                                                   |
| S70 | 54   | Wald                                                             | Orgelpunkt, Tropfen                                          | ganze Karte                                                       |
| S71 | 56   | Ghost Town                                                       | Wind, Tür, Busch                                             | ganze Karte (außer `ambrose.angekommen`)                          |
| S72 | 57   | das Zimmer; die Erinnerung bis zum Königszug; die Kerze geht aus | Kerze, Atem, Feder; danach nichts, **zwei Sekunden Schwarz** | Erinnerung bis zum Königszug; Kerze aus 2 s; Rückkehr ohne Musik  |
| S73 | 58   | die fertige Stellung; die Partie selbst; Remis                   | Wind, Züge                                                   | Stellung 3 s; ganze Partie; Remis 3 s                             |
| S74 | 59   | „Bleib“                                                          | ein einzelner gehaltener Ton                                 | 4 s                                                               |
| S75 | 61   | Runde 3: Stille um den Tisch                                     | gedämpftes Turniergeräusch                                   | bis Nova sich anders hinsetzt                                     |
| S76 | 62   | die Aussage                                                      | Raumton; Stimmen trocken, ohne Musik                         | ganze Aussage                                                     |
| S77 | 63   | der Turm wird gesehen                                            | nur Herzschlag                                               | bis „Ambrose.“                                                    |
| S78 | 63   | der Schuh: ZERO reißt ab                                         | nichts (vollkommen)                                          | 3 s, dann „Zusammen“                                              |
| S79 | 65   | nach dem Fehler im Finale                                        | Raumton; **auch kein Ambrose-Thema: hörbare Leere**          | **10 s**                                                          |
| S80 | 65   | der Bauer; „Oh.“; Victors Nachdenken; sein Lachen                | Atem                                                         | Bauer 3 s; Nachdenken bis zur Aufgabe; Lachen ohne Musik 4 s      |
| S81 | 66   | „Später?“                                                        | Abend                                                        | 3 s                                                               |
| S82 | 66   | Ambroses Lachen                                                  | Abend                                                        | 4 s, ohne Musik                                                   |
| S83 | 66   | nach dem Lichtwechsel                                            | nur Abendgeräusche                                           | bis zum Tagebuch                                                  |

---

## Teil D: Beschaffung (alle Akte)

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
| `turmuhr`                                      | Church Clock Strikes 8.wav          | JarredGibb        | https://freesound.org/people/JarredGibb/sounds/219055/                               | CC0       | acht Schläge, 22 s; einzelne Schläge herausschneiden für `turmuhr1` bis `turmuhr12`                                       |
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

### D3a. Ergänzung für die Stile von Akt 2 und 3

Die Lizenzlage aus D1 und D2 gilt unverändert. Neu sind nur die Stile: Jazz mit gedämpfter Trompete
(Riverton), tiefe Bläser mit Amboss (Ironwood), Akkordeon (Kantine, Fähre), Synthesizerflächen ohne
Schlagzeug (Silicon Bay), New-Orleans-Besetzung mit Klarinette und Waschbrett (Port Delacroix) und
Slide-Gitarre (Canyon, Desert Springs). Kandidaten aus dem offiziellen Katalog von Incompetech
(incompetech.com/music/royalty-free/pieces.json, Lizenz CC BY 4.0 für den ganzen Katalog, siehe D2;
Links antworten). **Nicht angehört.**

| Kennung                          | Kandidat                 | Instrumente laut Katalog                                 | Tempo, Länge | Link                                                                                          | Anmerkung                                                                                                                                                                |
| -------------------------------- | ------------------------ | -------------------------------------------------------- | ------------ | --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `riverton`                       | Long Stroll              | Besen, Trompete, Kontrabass, Klavier                     | 98, 4:15     | https://incompetech.com/music/royalty-free/mp3-royaltyfree/Long%20Stroll.mp3                  | genau die Besetzung der Vorgabe; „Relaxed, Bouncy“                                                                                                                       |
| `portDelacroix`                  | Look Busy                | Klavier, Bass, Schlagzeug, Klarinette, Tuba, Trompete    | 100, 1:47    | https://incompetech.com/music/royalty-free/mp3-royaltyfree/Look%20Busy.mp3                    | „Almost New Orleans-style“; ohne Waschbrett                                                                                                                              |
| `ironwood`, `ironwood.clubkampf` | Crusade - Heavy Industry | Kontrabässe, Celli, **Ambosse**, Hörner, Posaunen, Tuben | 90, 9:17     | https://incompetech.com/music/royalty-free/mp3-royaltyfree/Crusade%20-%20Heavy%20Industry.mp3 | „Somber, Driving“; Ausschnitt nehmen, ohne die Klarinette der Vorgabe                                                                                                    |
| `faehre`, `ironwood.kantine`     | Cattails                 | Banjo, Akkordeon, Gitarre, Erhu, Violinen                | 77, 2:39     | https://incompetech.com/music/royalty-free/mp3-royaltyfree/Cattails.mp3                       | ruhig; eher für die Fähre als für die Kantine                                                                                                                            |
| `siliconBay`                     | Equatorial Complex       | Synthesizer, Stimmfläche                                 | frei, 4:00   | https://incompetech.com/music/royalty-free/mp3-royaltyfree/Equatorial%20Complex.mp3           | ohne Schlagzeug, „Relaxed, Mystical“; den Puls müsste man dazulegen                                                                                                      |
| `weg.wueste`, `desertSprings`    | –                        | –                                                        | –            | –                                                                                             | Im Katalog gibt es nur einen kurzen, lauten Stinger mit Dobro („Cowboy Sting“). Für Slide-Gitarre auf OpenGameArt und itch.io nach CC0 oder CC BY suchen (nicht geprüft) |

**Geräusche für Akt 2 und 3:** auf Freesound mit dem Filter CC0 oder CC BY suchen (nie NC), etwa
„freight train passing“, „rain on tin roof“, „chess clock“, „blast furnace“, „anvil“, „server room
hum“, „glass footsteps“, „seagulls harbour“, „washboard“, „wind chimes desert“, „old radio“,
„ratchet wrench“, „wax seal break“. Die Seiten von Kenney ließen sich bei dieser Recherche nicht
abrufen (Antwort 403); deren Pakete sind laut D2 CC0, einzelne Pakete wurden nicht geprüft.

**Was weiter selbst gesetzt werden muss:** alle Leitmotive aus A1 und jede Fassung, in der sie
vorkommen (Mama, Held, Mira, Hale, ZERO, Miss Odiles Lied, `ambrose.*`, `victor.*`). Kein fertiges
Stück hat ihre gemeinsamen Töne. Fertige Stücke taugen für Ortsthemen, Wege und Dauergeräusche.

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

---

## Gesamtübersicht (Akt 1 bis 4)

Die Listen sind aus den Tabellen dieses Dokuments ausgezogen; eine Kennung steht beim Akt, in dem sie zum ersten Mal vorkommt. Größen nach `23_Technik_Atmosphaere.md`: Musik als m4a (AAC), 96 kbit/s, Stereo, also etwa 0,012 MB je Sekunde. Geräusche als m4a in Mono: einmalige Geräusche unter 100 KB (gerechnet 0,05 MB), Dauergeräusche als Schleife von etwa 30 s mit 64 kbit/s (gerechnet 0,24 MB; nach Abschnitt „Marken im Dialog“ werden sie je Karte zu einer Schleife gemischt, dann sind es weniger Dateien). Stücke, die einmal gespielt werden, sind mit ihrer ganzen Länge gerechnet.

### Ü1. Alle Stücke

| Akt | Kennung                     | Länge | Größe (MB) | Anmerkung                            | Stufe |
| --- | --------------------------- | ----- | ---------- | ------------------------------------ | ----- |
| 1   | `aha`                       | 0.8 s | 0.01       |                                      | 1     |
| 1   | `ambrose`                   | 64 s  | 0.77       |                                      | 1     |
| 1   | `ambrose.erinnerung`        | 90 s  | 1.08       |                                      | 1     |
| 1   | `ambrose.lassMich`          | 30 s  | 0.36       |                                      | 1     |
| 1   | `ambrose.walzer`            | 60 s  | 0.72       |                                      | 1     |
| 1   | `ankunft`                   | 3 s   | 0.04       |                                      | 1     |
| 1   | `busfahrt`                  | 96 s  | 1.15       |                                      | 1     |
| 1   | `cedarCreek`                | 120 s | 1.44       |                                      | 1     |
| 1   | `cedarCreek.archiv`         | 120 s | 1.44       |                                      | 1     |
| 1   | `cedarCreek.bibliothek`     | 120 s | 1.44       |                                      | 1     |
| 1   | `cedarCreek.clubkampf`      | 96 s  | 1.15       |                                      | 1     |
| 1   | `cedarCreek.steg`           | 120 s | 1.44       |                                      | 1     |
| 1   | `diner`                     | 72 s  | 0.86       |                                      | 1     |
| 1   | `fanfare`                   | 4 s   | 0.05       |                                      | 1     |
| 1   | `hale`                      | 3 s   | 0.04       |                                      | 1     |
| 1   | `konzern`                   | 1.5 s | 0.02       |                                      | 1     |
| 1   | `mapleFalls`                | 96 s  | 1.15       |                                      | 1     |
| 1   | `mapleFalls.club`           | 64 s  | 0.77       |                                      | 1     |
| 1   | `mapleFalls.clubkampf`      | 80 s  | 0.96       |                                      | 1     |
| 1   | `mapleFalls.lernen`         | 48 s  | 0.58       |                                      | 1     |
| 1   | `nachtstueck`               | 150 s | 1.80       |                                      | 1     |
| 1   | `niederlage`                | 3 s   | 0.04       |                                      | 1     |
| 1   | `remis`                     | 2 s   | 0.02       |                                      | 1     |
| 1   | `sieg`                      | 2.5 s | 0.03       |                                      | 1     |
| 1   | `titel`                     | 75 s  | 0.90       |                                      | 1     |
| 1   | `victor`                    | 16 s  | 0.19       |                                      | 1     |
| 1   | `weg`                       | 90 s  | 1.08       |                                      | 1     |
| 1   | `weg.fluss`                 | 90 s  | 1.08       |                                      | 1     |
| 1   | `weg.zedern`                | 96 s  | 1.15       |                                      | 1     |
| 2   | `ambrose.cello`             | 60 s  | 0.72       |                                      | 2     |
| 2   | `ambrose.london`            | 75 s  | 0.90       |                                      | 2     |
| 2   | `ambrose.mama`              | 30 s  | 0.36       |                                      | 2     |
| 2   | `ambrose.nachtwalzer`       | 70 s  | 0.84       |                                      | 2     |
| 2   | `ambrose.victor`            | 20 s  | 0.24       |                                      | 2     |
| 2   | `ambrose.zweifel`           | 12 s  | 0.14       |                                      | 2     |
| 2   | `fanfare.ironwood`          | 4 s   | 0.05       |                                      | 3     |
| 2   | `fanfare.riverton`          | 4 s   | 0.05       |                                      | 3     |
| 2   | `ironwood`                  | 120 s | 1.44       |                                      | 3     |
| 2   | `ironwood.clubkampf`        | 96 s  | 1.15       |                                      | 3     |
| 2   | `ironwood.feier`            | 64 s  | 0.77       |                                      | 3     |
| 2   | `ironwood.kantine`          | 96 s  | 1.15       |                                      | 3     |
| 2   | `konzern.flaeche`           | 30 s  | 0.36       |                                      | 2     |
| 2   | `london.lauf`               | 10 s  | 0.12       |                                      | 2     |
| 2   | `mama`                      | 20 s  | 0.24       |                                      | 2     |
| 2   | `mama.vollstaendig`         | 45 s  | 0.54       |                                      | 2     |
| 2   | `mapleFalls.klavier`        | 96 s  | 1.15       |                                      | 3     |
| 2   | `riverton`                  | 72 s  | 0.86       |                                      | 3     |
| 2   | `riverton.clubkampf`        | 64 s  | 0.77       |                                      | 3     |
| 2   | `riverton.gitarre`          | 72 s  | 0.86       |                                      | 3     |
| 2   | `riverton.pavillon`         | 64 s  | 0.77       |                                      | 3     |
| 2   | `riverton.pops`             | 60 s  | 0.72       |                                      | 3     |
| 2   | `riverton.wohnwagen`        | 80 s  | 0.96       |                                      | 3     |
| 2   | `victor.unsicher`           | 10 s  | 0.12       |                                      | 2     |
| 2   | `weg.fahrrad`               | 80 s  | 0.96       |                                      | 3     |
| 2   | `weg.zedernwald`            | 96 s  | 1.15       |                                      | 3     |
| 3   | `ambrose.ende`              | 6 s   | 0.07       |                                      | 2     |
| 3   | `ambrose.fern`              | 10 s  | 0.12       |                                      | 2     |
| 3   | `ambrose.gebannt`           | 25 s  | 0.30       |                                      | 2     |
| 3   | `ambrose.gitarre`           | 60 s  | 0.72       |                                      | 2     |
| 3   | `ambrose.hale`              | 45 s  | 0.54       |                                      | 2     |
| 3   | `ambrose.heiter`            | 60 s  | 0.72       |                                      | 2     |
| 3   | `ambrose.held`              | 30 s  | 0.36       |                                      | 2     |
| 3   | `ambrose.rein`              | 40 s  | 0.48       |                                      | 2     |
| 3   | `ambrose.stolpert`          | 40 s  | 0.48       |                                      | 2     |
| 3   | `ambrose.verstimmt`         | 60 s  | 0.72       |                                      | 2     |
| 3   | `ambrose.verzerrt`          | 20 s  | 0.24       |                                      | 2     |
| 3   | `ambrose.victor.einstimmig` | 15 s  | 0.18       |                                      | 2     |
| 3   | `ambrose.vierhaendig`       | 40 s  | 0.48       |                                      | 2     |
| 3   | `atme`                      | 6 s   | 0.07       |                                      | 2     |
| 3   | `celeste`                   | 30 s  | 0.36       |                                      | 3     |
| 3   | `desertSprings`             | 120 s | 1.44       |                                      | 3     |
| 3   | `desertSprings.clubkampf`   | 64 s  | 0.77       |                                      | 3     |
| 3   | `endspiel`                  | 12 s  | 0.14       |                                      | 2     |
| 3   | `faehre`                    | 120 s | 1.44       |                                      | 3     |
| 3   | `fanfare.gedaempft`         | 4 s   | 0.05       |                                      | 3     |
| 3   | `fanfare.wueste`            | 4 s   | 0.05       |                                      | 3     |
| 3   | `hale.horn`                 | 15 s  | 0.18       |                                      | 2     |
| 3   | `held`                      | 8 s   | 0.10       |                                      | 2     |
| 3   | `mama.schnee`               | 30 s  | 0.36       |                                      | 2     |
| 3   | `mira`                      | 8 s   | 0.10       |                                      | 2     |
| 3   | `mira.held`                 | 64 s  | 0.77       |                                      | 2     |
| 3   | `motel.nacht`               | 150 s | 1.80       |                                      | 3     |
| 3   | `odile`                     | 40 s  | 0.48       |                                      | 2     |
| 3   | `odile.tanz`                | 64 s  | 0.77       |                                      | 2     |
| 3   | `portDelacroix`             | 80 s  | 0.96       |                                      | 3     |
| 3   | `portDelacroix.trauer`      | 90 s  | 1.08       |                                      | 3     |
| 3   | `portDelacroix.werkstatt`   | –     | –          | nur Geräusche                        | –     |
| 3   | `remy.mauer`                | 40 s  | 0.48       |                                      | 2     |
| 3   | `riverton.postkarte`        | 5 s   | 0.06       |                                      | 3     |
| 3   | `rosie`                     | 64 s  | 0.77       |                                      | 3     |
| 3   | `siliconBay`                | 120 s | 1.44       |                                      | 3     |
| 3   | `siliconBay.akademie`       | 120 s | 1.44       |                                      | 3     |
| 3   | `siliconBay.clubkampf`      | 80 s  | 0.96       |                                      | 3     |
| 3   | `spannung`                  | 30 s  | 0.36       |                                      | 2     |
| 3   | `stimmton`                  | 12 s  | 0.14       |                                      | 2     |
| 3   | `tiefer_streicher`          | 8 s   | 0.10       |                                      | 2     |
| 3   | `victor.maschine`           | 6 s   | 0.07       |                                      | 2     |
| 3   | `weg.bus`                   | 90 s  | 1.08       |                                      | 3     |
| 3   | `weg.wueste`                | 120 s | 1.44       |                                      | 3     |
| 3   | `zero`                      | 60 s  | 0.72       |                                      | 2     |
| 4   | `abschied`                  | 30 s  | 0.36       |                                      | 2     |
| 4   | `abschied.treppe`           | 90 s  | 1.08       |                                      | 2     |
| 4   | `abspann`                   | 240 s | 2.88       |                                      | 3     |
| 4   | `ambrose.1866`              | 40 s  | 0.48       |                                      | 2     |
| 4   | `ambrose.angekommen`        | 20 s  | 0.24       |                                      | 2     |
| 4   | `ambrose.hale.grundton`     | 20 s  | 0.24       |                                      | 2     |
| 4   | `ambrose.held.gespraech`    | 40 s  | 0.48       |                                      | 2     |
| 4   | `ambrose.nichtSpaeter`      | 50 s  | 0.60       |                                      | 2     |
| 4   | `ambrose.scherzo`           | 4 s   | 0.05       |                                      | 2     |
| 4   | `ambrose.schluss`           | 45 s  | 0.54       |                                      | 2     |
| 4   | `ambrose.still`             | 30 s  | 0.36       |                                      | 2     |
| 4   | `ambrose.suchend`           | 30 s  | 0.36       |                                      | 2     |
| 4   | `arena`                     | 90 s  | 1.08       |                                      | 2     |
| 4   | `arena.halle`               | –     | –          | nur Raumklang                        | –     |
| 4   | `arena.vorrunde`            | 40 s  | 0.48       |                                      | 3     |
| 4   | `aufgabe`                   | 3 s   | 0.04       |                                      | 3     |
| 4   | `b5`                        | 15 s  | 0.18       |                                      | 2     |
| 4   | `bergstation`               | 60 s  | 0.72       |                                      | 3     |
| 4   | `blindschach`               | –     | –          | im Browser erzeugt (ein Ton je Feld) | –     |
| 4   | `crossroads`                | 50 s  | 0.60       |                                      | 3     |
| 4   | `fanfare.leise`             | 8 s   | 0.10       |                                      | 3     |
| 4   | `fehler`                    | 1 s   | 0.01       |                                      | 3     |
| 4   | `fernpartie`                | 56 s  | 0.67       |                                      | 3     |
| 4   | `finale.eroeffnung`         | 60 s  | 0.72       |                                      | 3     |
| 4   | `finale.mittelspiel`        | 120 s | 1.44       |                                      | 3     |
| 4   | `geraet`                    | –     | –          | Geräusch `geraet_summen`             | –     |
| 4   | `hale.springer`             | 10 s  | 0.12       |                                      | 2     |
| 4   | `hale.victor`               | 20 s  | 0.24       |                                      | 2     |
| 4   | `hastings`                  | 80 s  | 0.96       |                                      | 3     |
| 4   | `held.allein`               | 40 s  | 0.48       |                                      | 2     |
| 4   | `held.rueckwaerts`          | 5 s   | 0.06       |                                      | 2     |
| 4   | `hochebene`                 | 80 s  | 0.96       |                                      | 3     |
| 4   | `kerzenton`                 | 4 s   | 0.05       |                                      | 2     |
| 4   | `lagerfeuer`                | 70 s  | 0.84       |                                      | 3     |
| 4   | `leuchtturm`                | 12 s  | 0.14       |                                      | 3     |
| 4   | `mama.ruhig`                | 25 s  | 0.30       |                                      | 2     |
| 4   | `mapleFalls.herbst`         | 96 s  | 1.15       |                                      | 3     |
| 4   | `mit.dir`                   | 15 s  | 0.18       |                                      | 2     |
| 4   | `nova`                      | 60 s  | 0.72       |                                      | 2     |
| 4   | `pinewood`                  | 80 s  | 0.96       |                                      | 3     |
| 4   | `schlussklang`              | 6 s   | 0.07       |                                      | 2     |
| 4   | `seeufer`                   | 120 s | 1.44       |                                      | 3     |
| 4   | `staubstrasse`              | 120 s | 1.44       |                                      | 3     |
| 4   | `summitCity`                | 150 s | 1.80       |                                      | 3     |
| 4   | `summitCity.clubkampf`      | 120 s | 1.44       |                                      | 3     |
| 4   | `summitCity.lernen`         | 90 s  | 1.08       |                                      | 3     |
| 4   | `victor.lauf`               | 20 s  | 0.24       |                                      | 2     |
| 4   | `victor.warm`               | 15 s  | 0.18       |                                      | 2     |
| 4   | `wald.orgelpunkt`           | 120 s | 1.44       |                                      | 3     |
| 4   | `weg.wueste.held`           | 120 s | 1.44       |                                      | 3     |
| 4   | `zero.halbfinale`           | 60 s  | 0.72       |                                      | 2     |
| 4   | `zug.zwoelf`                | 8 s   | 0.10       |                                      | 3     |
| 4   | `zusammen`                  | 12 s  | 0.14       |                                      | 2     |

Summe Musik: 149 Dateien, etwa 97 MB.

### Ü2. Alle Geräusche

- **Akt 1, Dauer (24):** `archiv`, `bach`, `bibliothek`, `bus_innen`, `diner_kueche`, `enten`, `fluss`, `grillen`, `holzknacken`, `huehner`, `kuehe`, `kuehlschrank`, `rollen`, `schulflur`, `steg_holz`, `traktor_fern`, `uhr_ticken`, `voegel`, `wald_still`, `waschmaschine`, `wasserfall`, `wind_fenster`, `windrad`, `zaun_wind`
- **Akt 1, einmalig (32):** `angelschnur`, `auto_nacht`, `bus`, `bus_hupe`, `glocke_hell`, `handy`, `herzschlag`, `karte`, `kasse_muenzen`, `knarren`, `koenig_heben`, `kraehen`, `kreide`, `metronom`, `nadel`, `pfiff`, `pfiff_finger`, `schulglocke`, `spaeter`, `spindtuer`, `sternschnuppe`, `tablet`, `tagebuch`, `treppe`, `trockner_figuren`, `tuerglocke`, `turmuhr1`, `turmuhr12`, `turmuhr4`, `turmuhr7`, `wagen`, `zeitung`
- **Akt 2, Dauer (15):** `bahnhofshalle`, `kaffeehaus`, `kantine`, `kerze`, `kueche`, `regen`, `reifen_erde`, `schiene_singt`, `schnee`, `specht`, `stadt_riverton`, `standuhr`, `uhrenklopfen`, `werk`, `wind_traeger`
- **Akt 2, einmalig (16):** `applaus_regen`, `besen_stein`, `bus_abfahrt`, `donner_fern`, `fahrradklingel`, `gueterzug`, `haustuer`, `kantine_jubel`, `lachen_kieseritzky`, `pokale`, `schachuhr`, `schloss`, `siegel`, `spruehdose`, `uhr_hufschlag`, `wagen_weg`
- **Akt 3, Dauer (19):** `akademie`, `antiquariat`, `canyon`, `deich`, `garage`, `geraete`, `glasbruecke`, `kai`, `klatschen`, `motel`, `schnellstrasse`, `see`, `serverraum`, `stadtpuls`, `turnhalle`, `werkstatt`, `wiederaufbau`, `wueste`, `zug`
- **Akt 3, einmalig (7):** `abschaltton`, `delfin`, `figuren_kippen`, `lieferroboter`, `saite`, `stuhl_faellt`, `zapfsaeule`
- **Akt 4, Dauer (23):** `abend_treppe`, `atem`, `camp`, `canyonrand`, `crossroads_stimmen`, `dachboden`, `feder`, `fest_fern`, `gang`, `geysire`, `ghosttown`, `halle`, `halle_still`, `hauptstadt`, `hochebene_wind`, `kamin`, `praerie`, `saloon`, `see_hell`, `seilbahnrad`, `staubstrasse_wind`, `summit`, `wald_tief`
- **Akt 4, einmalig (20):** `aufstehen`, `besen`, `geraet_faellt`, `geraet_summen`, `gong`, `holz_zug`, `jubel`, `koenig_heben_rueckwaerts`, `metalldetektor`, `mikrofon`, `nova_summen`, `schaukelstuhl`, `scheinwerfer`, `schraubenschluessel`, `stiefel_pferd`, `tandem`, `telefon`, `tippen_hoert_auf`, `tuer_schritte`, `turm_zupf`

Dazu die Schritte je Boden aus Akt 1 (`schritt_holz`, `schritt_kies`, `schritt_nadeln`, `schritt_stein`, `schritt_gras`) und aus Akt 2 und 3 (`schritt_schnee`, `schritt_glas`): sieben kurze Geräusche, zusammen etwa 0,35 MB.

Summe Geräusche: 81 Dauergeräusche und 75 einmalige, etwa 24 MB.

### Ü3. Summe der Dateigrößen

| Gruppe    | Dateien | Größe           |
| --------- | ------- | --------------- |
| Musik     | 149     | etwa 97 MB      |
| Geräusche | 163     | etwa 24 MB      |
| **Alles** | **312** | **etwa 120 MB** |

Das liegt deutlich über den 15 MB, die `23_Technik_Atmosphaere.md` für Akt 1 ansetzt, weil die vier Akte zusammen viel mehr Szenenstücke haben. Zwei Wege, das zu verkleinern, ohne etwas zu streichen: kurze Motive (Aha, Konzernton, Hale, Aufgabe, Fehler, Atme, Kerzenton, Blindschach) im Browser erzeugen wie die Zugtöne (`app/src/app/ton.ts`), und Musik je Akt als eigene Gruppe des Pakets laden, sodass auf dem Gerät nur der laufende Akt liegt.

### Ü4. Reihenfolge der Beschaffung in drei Stufen

| Stufe | Inhalt                                                                                                                                                                                                                            | Dateien | Größe      |
| ----- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- | ---------- |
| 1     | **Unverzichtbar für Akt 1:** alle Stücke und Geräusche von Akt 1, einschließlich der Leitmotive, die dort schon erklingen (Ambrose, Victor, Aha, Konzernton, Hale) und der Kurzmotive (Fanfare, Sieg, Niederlage, Remis, Ankunft) | 85      | etwa 29 MB |
| 2     | **Die Leitmotive** in ihren Fassungen aus Akt 2 bis 4 (Ambrose, Victor, Hale, Mama, Held, Mira, Nova, ZERO, Miss Odile, Endspiel, Arena, die gemeinsame Melodie, der Lauf, der Schlussklang, der Konzernton)                      | 65      | etwa 24 MB |
| 3     | **Der Rest:** Ortsthemen und Szenenstücke von Akt 2 bis 4 und ihre Geräusche                                                                                                                                                      | 155     | etwa 67 MB |

Die sieben Schritte gehören zu Stufe 1 (fünf aus Akt 1) und Stufe 3 (Schnee, Glas). Stufe 1 ist mit etwa 29 MB größer als die 15 MB, die `23_Technik_Atmosphaere.md` für Akt 1 schätzt: Der Roman hat in Akt 1 mehr Szenenstücke gebracht (Erinnerung, Walzer, Steg, Bus, Nachtstück) als damals gezählt.

Innerhalb jeder Stufe gilt die Reihenfolge aus A5: zuerst, was die meiste Spielzeit trägt (Ortsthemen, Clubkämpfe), dann die Szenenstücke. Stufe 2 kann nicht aus fertigen Stücken kommen (Teil D, D3a); sie muss gesetzt werden, und die Fassungen eines Motivs sollten aus einer Hand kommen.

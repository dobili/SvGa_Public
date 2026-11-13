# 16 Statisten und Tiere: Die Welt ist bewohnt

Stand: 10.11.2026, morgens (Haupt-Chat). Wunsch des Autors nach der Revision der Karten:

> Erheblich mehr Figuren, Menschen, auch Tiere. Die Charaktere sollen etwas zu sagen haben, über
> die Welt, über Schach, ihren Lieblingszug, Schachgeschichte, nette historische Dinge. Realistisch,
> so dass sie in die Welt passen. Auf den Routen laufen Tiere herum, die vor dem Helden weglaufen
> oder einfach da sind. Kleine Geschichten, etwa eine Figur am Waldrand, die wilde Pferde beobachtet
> und sagt: „Ich verstehe nicht, warum der Springer springt. Pferde rennen doch geradeaus.“

Alles hier gilt nach Regel 9 als geplant; Widerspruch genügt. Regel 10.53 in `KARTENREGELN.md`
legt die Mindestzahlen fest, und der Kartenbauer prüft sie.

## 1. Stand und was fehlt

- Die Szenen haben schon `belebung`: Statisten mit Laufweg (`von`, `bis`), Tätigkeit (`tun`) und
  Tageszeit (`wann`), Tiere mit Verhalten:
  - `fliegen`, `sitzen`, `ausweichen`, `folgen`;
  - `flitzen`, `schwimmen`, `rennen`, `schlafen`.
- **Die App zeichnet sie noch nicht** (`oberwelt/szene.ts` überspringt `statist` und `tier`).
  Deshalb wirken die Karten leer. Das ändert Runde 7 (Abschnitt 5).
- Statisten können noch nichts sagen. Neu ist `eigenschaften.sagt` mit einem Textschlüssel.
- Es sind zu wenige: Stadtkarten haben 1 bis 6 Statisten, Wege 0 bis 4.

## 2. Wie viele (Regel 10.53, mit Prüfung)

| Karte                                   | Statisten | davon ansprechbar | Tiere (eine Schar zählt als eins) |
| --------------------------------------- | --------- | ----------------- | --------------------------------- |
| Außenkarte oder Viertel einer Stadt     | 12        | 6                 | 4                                 |
| Karte eines Wegs                        | 4         | 3                 | 6                                 |
| Öffentlicher Raum (Laden, Diner, Halle) | 2–6       | alle              | –                                 |

Die Zahlen sind Mindestwerte. Eine Stadt im Sommerfest oder ein Markttag darf voller sein.

## 3. Was Statisten sagen

### 3.1 Form

- **Länge:** ein bis drei kurze Sätze (Stilregeln 5.1 der Story-Bibel), in der Sprechweise der
  Figur.
- **Schlüssel:** `statist.<karte>.<name>` in `inhalte/abenteuer/texte/de.json`. Der Schlüssel
  selbst ist der erste Satz; weitere Sätze stehen als `…<name>.2`, `…<name>.3`. Die App zeigt beim
  ersten Ansprechen den ersten, danach reihum.
- **Jeder Statist ist ein Mensch dieser Welt:** Name oder Rolle („die Briefträgerin“), Alter
  ungefähr, Tätigkeit passend zum Ort und zur Tageszeit.
- **Ambrose** antwortet manchmal mit einem Satz (`statist.<karte>.<name>.ambrose`), höchstens bei
  jedem fünften Statisten. Er ist kein Dauerkommentator.
- **Neutral für {held}:** Statisten reden {held} nie mit „Junge“ oder „Mädchen“ an (Stilregel 5.2).

### 3.2 Zehn Arten von Sätzen

Je Karte gemischt, keine Art mehr als dreimal:

1. **Welt:** über den Ort, das Wetter, die Arbeit, die Nachbarn, die Geschichte des Orts. Sie
   machen das Land glaubhaft.
   > Briefträgerin in Riverton: „Seit die Bildschirmtische da sind, schreibt mir niemand mehr
   > Schachzüge auf Postkarten. Ich vermisse die Postkarten.“
2. **Lieblingszug:** jemand erzählt, welchen Zug er liebt und warum, in seinen eigenen Worten.
   > Bäcker in Cedar Creek: „Mein Lieblingszug? Rochade. Danach ist der König zu Hause und die Tür
   > ist zu.“
3. **Schachgeschichte:** eine wahre Begebenheit aus dem Vorrat in Abschnitt 4, nie erfunden.
   > Rentner auf der Parkbank: „Wusstest du, dass die Dame früher die schwächste Figur war? Ein
   > Feld schräg, mehr nicht. Dann kam Spanien, um 1475, und auf einmal durfte sie alles.“
4. **Missverständnis mit Herz:** jemand, der Schach kaum kennt, sieht es von außen. Das ist das
   Pferde-Beispiel des Autors.
   > Frau am Waldrand, die wilde Pferde beobachtet: „Ich verstehe nicht, warum der Springer
   > springt. Pferde rennen doch geradeaus. Und über andere Pferde springen sie nie.“ Ambrose:
   > „Weil ein Ritter nicht durch die Tür geht, sondern über die Mauer.“
5. **Rat:** ein Satz Schachweisheit in den Worten der Figur, ohne Verweis auf das Buch und ohne
   Buchtext (Entscheidung vom 10.11.2026, `docs/spiel/ENTSCHEIDUNGEN.md`).
   > Lkw-Fahrer: „Mein Vater sagte immer: Erst schauen, was hängt, dann ziehen. Gilt auch beim
   > Rangieren.“
6. **Kleine Geschichte in zwei Teilen:** Beim ersten Besuch sagt jemand etwas, bei einem späteren
   Besuch oder im nächsten Akt kommt die Fortsetzung. Das ist Stoff für Rückwege.
   > Junge mit Drachen in Maple Falls, Akt 1: „Mein Drachen steckt im Baum.“ Akt 2: „Papa hat ihn
   > runtergeholt. Mit einer Leiter. Und mit Fluchen.“
7. **Perfect Move im Alltag:** wie Menschen den Konzern erleben, ohne zu urteilen.

   > Mann an der Bushaltestelle: „Die App sagt, mein Zug war ein Fehler. Sie sagt nie, warum. Meine
   > Frau sagt wenigstens, warum.“

8. **Lieblingseröffnung mit Vor- und Nachteil** (Nachtrag des Autors, 10.11.2026): in einem Satz,
   was jemand an seiner Eröffnung mag und was ihn daran ärgert. Vorrat in 4.6.
   > Anglerin am Kanal: „Ich spiele immer Londoner System. Langweilig, sagen alle. Aber ich verliere
   > nie in den ersten zehn Zügen.“
9. **Taktisches Motiv:** jemand schwärmt von seiner Lieblingsfalle oder seinem Lieblingsmotiv.
   > Bauarbeiter in der Pause: „Gabeln. Ich liebe Gabeln. Ein Springer, zwei Opfer. Wie Mittagessen
   > für zwei.“
10. **Ein brillanter Zug, den man gesehen hat:** aus einem berühmten Spiel (Vorrat 4.5) oder aus
    einem Turnier im Ort („letzten Sonntag im Club“). Hier dürfen Menschen sich ungenau erinnern
    („ich glaube, es war 1912“). Was sie erzählen, stammt trotzdem aus dem Vorrat.
    > Rentner in Port Delacroix: „Marshall hat 1912 seine Dame auf ein Feld gestellt, wo drei
    > Figuren sie schlagen konnten. Die Zuschauer haben Goldmünzen aufs Brett geworfen. Sagt man.“

Dazu passen kurze **Sätze berühmter Spielerinnen und Spieler** aus Interviews und bekannten Zitaten
(Vorrat 4.5), immer mit Namen: „Tartakower hat gesagt …“. Höchstens ein Satz, sinngemäß.

### 3.3 Wer wo steht (Beispiele für die Helfer)

- **Stadt:**
  - Briefträgerin, Bäcker vor der Tür, Kinder mit Kreidebrett, Rentner beim Taubenfüttern;
  - Jogger, Hundebesitzerin, Bauarbeiter in der Pause, Schüler auf dem Heimweg;
  - Touristen mit Karte, Straßenmusiker, Lieferfahrer.
- **Weg:**
  - Wanderer, Angler, Radfahrerin, Bauer am Zaun, Vogelbeobachterin, Landvermesser;
  - Pilzsammler, Picknick-Familie, Jäger mit Kamera statt Gewehr, Fotografin;
  - Kinder beim Steinehüpfen.
- **Akt und Jahreszeit:** Akt 1 und 2 Herbst, Akt 3 Winter (Schal, Schneeschaufel), Akt 4 Sommer
  (Eis, Badesachen). Ein Statist wiederholt sich nie über zwei Orte hinweg, außer er reist
  (Wanderer, Lkw-Fahrer, Odette Finch).

### 3.4 Vorführen statt nur erzählen (Wunsch des Autors, 10.11.2026)

Wer von einem brillanten Zug erzählt, kann ihn auch zeigen.

- **In der App:** Nach dem Satz fragt der Statist: „Soll ich ihn dir zeigen?“ Dann öffnet sich ein
  kleines Brett mit der Stellung vor dem Zug. Er spielt den Zug und die Fortsetzung Zug für Zug
  vor, mit einem kurzen Satz je Zug, wie der Folgespieler der Trainer
  (`ui/trainer/Folgespieler.tsx`).
- **Daten:**
  - Die Vorführung steht in `inhalte/abenteuer/vorfuehrungen.json`, mit Partie, Quelle und Zügen.
  - Der Statist bekommt `"zeigt": "<kennung>"`.
  - Die Texte stehen in `texte/de.json`: `vorfuehrung.<kennung>.titel` und ein Satz je Zug
    (`vorfuehrung.<kennung>.1`, `.2` …; der Satz zum letzten Zug ist Pflicht).
- **Prüfung** (`python -m pipeline.abenteuer.vorfuehrungen`, auch in pytest):
  - Die Partie ergibt nach `ab` Halbzügen genau die Stellung.
  - Jeder Zug ist legal.
  - Texte und Verweise sind da.
- **Erste Vorführung:** die Opernpartie, Morphy 1858, die letzten fünf Züge bis zum Matt
  (`operPartie`). Weitere kommen aus dem Vorrat 4.5. Höchstens eine Vorführung je Karte, damit sie
  etwas Besonderes bleibt.
- **Auch Lieblingsmotive und Eröffnungen** lassen sich so zeigen. Dafür genügt eine kurze, selbst
  gebaute Zugfolge mit Quelle „eigenes Beispiel“, ebenfalls geprüft.

## 4. Vorrat: Schachgeschichte (nur das hier, oder vom Haupt-Chat geprüft)

Die Helfer nehmen Begebenheiten nur aus dieser Liste. Jede ist gut belegt. Neue Begebenheiten
schlagen sie dem Haupt-Chat vor, statt sie selbst zu erfinden. Jahreszahlen nur, wo sie hier
stehen.

### 4.1 Herkunft und Regeln

1. „Schach“ kommt vom persischen „Schah“, König. „Schachmatt“ von „schāh māt“: Der König ist
   geschlagen oder hilflos.
2. Die Dame war im mittelalterlichen Schach der Wesir und zog nur ein Feld schräg. Gegen Ende des 15. Jahrhunderts, zuerst in Spanien, bekam sie ihre heutige Kraft. Damals nannte man das
   „Schach der rasenden Dame“.
3. Der Läufer hieß im alten Schach Alfil, nach dem arabischen Wort für Elefant. Er sprang genau
   zwei Felder schräg.
4. Der Turm kommt vom persischen „Rukh“, dem Streitwagen. Daher das englische „rook“.
5. Der Springer heißt im Englischen „knight“ (Ritter), im Russischen „Pferd“. Er ist die einzige
   Figur, die über andere springen darf.
6. Den Doppelschritt des Bauern und damit „en passant“ gibt es erst seit dem späten Mittelalter;
   vorher zog der Bauer immer nur ein Feld.
7. Dass Weiß anfängt, wurde erst im 19. Jahrhundert zur festen Regel.
8. Die Weizenkorn-Legende: Der Erfinder des Schachs wünschte sich ein Korn auf dem ersten Feld,
   zwei auf dem zweiten, vier auf dem dritten und so weiter. Für alle 64 Felder reicht die Ernte
   der ganzen Welt nicht. (Legende, kein Ereignis.)
9. Das kürzeste mögliche Matt ist das Narrenmatt: Schwarz setzt im zweiten Zug matt, wenn Weiß
   zuerst f3 oder f4 und dann g4 zieht.
10. Die Dame steht am Anfang auf einem Feld ihrer Farbe: weiße Dame auf d1 (hell), schwarze auf d8
    (dunkel).
11. Deutsche Wörter im englischen Schach: Zugzwang, Zwischenzug, Kiebitz (englisch „kibitzer“,
    der ungebetene Ratgeber am Brett) und Patzer.

### 4.2 Figuren und Bretter

12. Die Lewis-Schachfiguren aus dem 12. Jahrhundert wurden auf einer schottischen Insel gefunden,
    geschnitzt aus Walrosszahn. Einer der Türme ist ein Krieger, der vor Wut in seinen Schild
    beißt.
13. Die heutigen Standardfiguren heißen Staunton-Figuren, nach dem englischen Meister Howard
    Staunton. Sie kamen 1849 auf den Markt.
14. Englische Bücher schrieben früher „P-K4“ statt „e4“ (beschreibende Notation). Heute schreibt
    man überall „e4“ (algebraische Notation).
15. Der Schachautomat „Türke“ von Wolfgang von Kempelen (1770) spielte gegen Napoleon und Benjamin
    Franklin. In der Kiste saß ein Mensch.

### 4.3 Menschen und Partien

16. Paul Morphy aus New Orleans spielte 1858 in der Pariser Oper gegen einen Herzog und einen
    Grafen. Die Partie dauerte nur 17 Züge, und Morphy schaute dabei kaum auf die Bühne.
17. „Die Unsterbliche Partie“: Adolf Anderssen gewann 1851 in London gegen Lionel Kieseritzky. Er
    opferte dabei beide Türme und die Dame.
18. „Die Immergrüne Partie“ spielte Anderssen 1852 in Berlin gegen Jean Dufresne.
19. Die erste offizielle Weltmeisterschaft fand 1886 in drei amerikanischen Städten statt: New
    York, St. Louis und New Orleans. Wilhelm Steinitz gewann gegen Johannes Zukertort.
20. Emanuel Lasker war 27 Jahre lang Weltmeister (1894 bis 1921), länger als jeder andere.
21. Vera Menchik wurde 1927 die erste Weltmeisterin.
22. Bobby Fischer wurde mit 14 Jahren Meister der USA. 1972 gewann er in Reykjavík den
    Weltmeistertitel gegen Boris Spasski.
23. Judit Polgár wurde 1991 mit 15 Jahren Großmeisterin, jünger als Fischer damals. Sie gilt als
    stärkste Spielerin aller Zeiten.
24. Magnus Carlsen erreichte 2014 eine Elo-Zahl von 2882, die höchste bis heute.
25. Die Elo-Zahl stammt von Arpad Elo, einem Physikprofessor in den USA. Die FIDE führt sie seit 1970.
26. 1997 verlor Weltmeister Garri Kasparow in New York einen Wettkampf gegen den Rechner Deep
    Blue. Zum ersten Mal hatte eine Maschine einen Weltmeister in einem Match unter
    Turnierbedingungen geschlagen.
27. 2017 brachte sich das Programm AlphaZero Schach selbst bei, nur durch Spiele gegen sich
    selbst, in wenigen Stunden. (Gut für Gespräche über ZERO, ohne Perfect Move gleichzusetzen.)
28. Die Französische Verteidigung hat ihren Namen von einer Fernpartie London gegen Paris im Jahr 1834.
29. Benjamin Franklin schrieb einen Aufsatz „Die Moral des Schachspiels“: Schach lehre
    Voraussicht, Umsicht und Ausdauer.
30. Der Künstler Marcel Duchamp spielte für Frankreich bei Schacholympiaden.

### 4.4 Feste, Orte, Bräuche

31. Der Internationale Tag des Schachs ist der 20. Juli, der Gründungstag des Weltschachbunds FIDE
    1924 in Paris.
32. Die erste offizielle Schacholympiade fand 1927 in London statt.
33. In Ströbeck in Sachsen-Anhalt ist Schach seit 1823 Schulfach. Das Dorf heißt deshalb
    „Schachdorf“.
34. In Marostica in Italien spielen Menschen alle zwei Jahre auf dem Marktplatz Lebendschach. Das
    geht auf eine Legende von 1454 zurück: Zwei Ritter spielten um die Hand einer Tochter, statt
    sich zu duellieren.
35. Schachboxen gibt es wirklich. Die Idee stammt aus einem Comic von Enki Bilal; der erste
    Wettkampf fand 2003 in Berlin statt.
36. Im Washington Square Park in New York spielen seit Jahrzehnten Leute an Steintischen um kleine
    Einsätze Blitz.
37. Fernschach per Post: Eine Partie konnte Jahre dauern. Manche Spieler spielten Dutzende Partien
    gleichzeitig, jede mit eigener Postkarte.
38. In den 1860er-Jahren maß man die Bedenkzeit noch mit Sanduhren. Erst später kamen
    Schachuhren mit zwei Zifferblättern.
39. Den Titel Großmeister vergibt die FIDE seit 1950.
40. „Kiebitze“ dürfen im Turnier nicht reden. Im Park reden sie umso mehr.

### 4.5 Zitate, brillante Züge, Interviews, Eröffnungen, Motive

Steht mit Quellen in `16a_Vorrat_Zitate_Zuege.md`:

- 36 Zitate mit Status gesichert, überliefert oder zugeschrieben, dazu bekannte
  Falschzuschreibungen;
- 20 berühmte Züge (davon zwei Studien);
- 19 Interview-Schnipsel heutiger Spitzenspieler;
- 15 Eröffnungen mit Vorteil und Nachteil;
- 10 taktische Motive mit echtem Beispiel.

Die Regeln für den Gebrauch stehen dort am Anfang. Aus dem Vorrat darf jeder Statist schöpfen; je
Karte höchstens zwei Zitate, damit es nicht wie ein Kalender klingt.

## 5. Tiere

### 5.1 Verhalten (schon in den Szenen benutzt)

| Verhalten    | Bedeutung in der App (Runde 7)                                                                           |
| ------------ | -------------------------------------------------------------------------------------------------------- |
| `sitzen`     | steht oder sitzt, schaut sich ab und zu um                                                               |
| `schlafen`   | liegt, rührt sich nicht                                                                                  |
| `fliegen`    | Vogel oder Schar fliegt zwischen `von` und `bis`, landet, pickt                                          |
| `ausweichen` | läuft langsam zwischen `von` und `bis`; kommt der Held näher als 3 Kacheln, läuft das Tier ein Stück weg |
| `flitzen`    | wie ausweichen, aber schnell und weiter (Hase, Eichhörnchen, Eidechse, Roadrunner)                       |
| `folgen`     | läuft dem Helden ein paar Schritte nach und bleibt dann stehen (Hund, Katze, Ziege)                      |
| `rennen`     | Herde zieht über die Karte (Bisons, wilde Pferde)                                                        |
| `schwimmen`  | auf Wasserfeldern zwischen `von` und `bis` (Enten, Alligator, Delfin)                                    |

Tiere sperren nicht. Der Held läuft nie an einem Tier fest.

### 5.2 Bilder

- **Mit Laufbildern bei LimeZu** (Modern Farm, `Animals`): Katzen, Hühner, Hähne, Küken, Kühe,
  Hunde, Esel, Enten, Ziegen, Schweine, Hasen, Schafe. Dazu Tauben aus Modern Exteriors.
- **Selbst zeichnen** (wie Bisons und Pelikane, aber mit Laufbildern):
  - Pferd (wilde Pferde), Reh, Eichhörnchen, Möwe, Krähe, Reiher, Eidechse;
  - Roadrunner, Alligator, Murmeltier, Bison, Pelikan.

  Zeichnen kommt nach den Karten. Bis dahin steht ein naher Ersatz (Ziege statt Reh) oder das
  stehende Bild ohne Laufen.

### 5.3 Kleine Geschichten mit Tieren (Vorschläge für die Helfer)

- **Weg 1, Feldrand:** die Frau mit den wilden Pferden (Abschnitt 3.2, Beispiel 4). Die Pferde
  stehen auf der Kuhweide des Kürbishofs; in Akt 4 sind Fohlen dabei.
- **Riverton:** Der Taubenmann zählt seine Tauben. „Siebzehn. Gestern waren es achtzehn. Die
  achtzehnte ist eine Dame, die macht, was sie will.“
- **Ironwood:** Die Werkskatze schläft auf dem Brett im Pausenraum. Wer zieht, muss um sie herum.
- **Weg 3, Kanal:** Eine Entenfamilie zieht in Reihe, sieben Küken. Ein Kind: „Wie Bauern. Nur
  ohne Umwandlung.“
- **Weg 6, Canyon:** Ein Roadrunner rennt jedes Mal weg, wenn {held} kommt, und wartet hinter der
  nächsten Kurve. Ambrose: „Er spielt mit dir. Er hat die Opposition.“
- **Weg 8, Prärie:** Rangerin Bell über die Bisons: „Sie gehen, wohin sie wollen. Wie Türme auf
  einer offenen Linie.“
- **Weg 9, Riesenbäume:** Ein Eichhörnchen hat eine Schachfigur im Maul, einen schwarzen Bauern
  aus dem Camp. Wer ihm folgt, findet sein Versteck mit fünf weiteren Figuren für das Camp.
- **Pelikaninsel:** Pelikane stehen in einer Reihe auf den Pfählen wie Bauern vor dem Doppelschritt.
- **Ghost Town:** Ein alter Hund begleitet {held} bis zum Grab von Ambrose und legt sich davor.
  Ambrose wird still.

## 6. Für die Helfer: Ablauf je Karte

1. Statisten und Tiere auf die Mindestzahl bringen, Tätigkeit und Laufweg passend zum Ort.
2. Für jeden ansprechbaren Statisten `"sagt": "statist.<karte>.<name>"` setzen und den Satz in
   `inhalte/abenteuer/texte/de.json` schreiben. Geschichte nur aus Abschnitt 4.
3. In allen drei Varianten dieselben Statisten mit denselben Sätzen; nur die Felder dürfen sich
   ändern.
4. Kartenbauer ohne Befunde, dann wie immer Bild, pytest, Prettier, Commit.

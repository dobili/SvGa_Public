# 15 Routen-Ereignisse: Auf jedem Weg passiert etwas

Stand: 10.11.2026, morgens (Haupt-Chat). Wunsch des Autors nach der Revision der Karten von Akt 2
bis 4:

> Auf jeder Route soll irgendwann in der Geschichte etwas passieren, das man entdecken kann. Es muss
> die Hauptgeschichte nicht voranbringen.

Vorbilder sind Schach-Events, wie sie Chess.com und Vereine ausrichten, für Kinder und Erwachsene.
Der Autor nennt als Ideen: eine Schachschnitzeljagd mit versteckten Figuren, Buchseiten aus seinem
Buch (sparsam, nichts verraten), Schach im Park, einen versteckten Untergrundclub und Machenschaften
der KI-Firma.

Alles hier gilt nach Regel 9 als „schon so geplant, Widerspruch genügt“. Die Karten bekommen die
Ereignisorte schon jetzt (Regel 10.52 in `KARTENREGELN.md`). Dialoge und Quests folgen in Runde 6.

Grundlagen:

- `05_Story_Bibel.md`: Figuren, Akte, Funde je Weg;
- `08_Wege_und_Entdeckungen.md`: W4 (Stationen am Weg), E1 bis E5 (Funde, Album, Boni);
- `13_Wegenetz.md`: Wege, Sperren, Rückkehr;
- `10_Sprueche_Schauplaetze_Varianten.md`: L1 bis L10.

## 0. Grundsätze

1. **Ein Ereignis je Weg**, zusätzlich zu den Stationen aus W4 (Tafel, Gegner, Figur mit Weisheit,
   Fund) und zu den Spielen der Leute in Akt 4 (L1 bis L10). Das Ereignis hat eine eigene Figur,
   eine kleine Geschichte in zwei bis vier Schritten und einen Lohn. Es dauert 5 bis 15 Minuten.
2. **Später in der Geschichte:**
   - Viele Ereignisse beginnen erst bei der Rückkehr oder in einem späteren Akt.
   - Der Ort ist aber vom ersten Durchgehen an zu sehen: ein Wohnmobil, ein Baumhaus, ein Funkmast,
     ein Plakat „Bald“.
   - So lohnen sich Rückwege (Wegenetz, Grundsatz 5).
3. **Nebenquest mit `klein: true`:** Ereignisse zählen nicht für R27. Sie geben keine Nadel.
4. **Schach ist dabei, aber nicht immer als Partie.** Möglich sind:
   - Rätsel lösen, eine Stellung erklären oder einen Zug zeigen;
   - jemandem etwas beibringen;
   - eine Partie mit besonderer Regel;
   - Figuren suchen.
5. **Vier Sammelstränge** ziehen sich über alle Wege (Abschnitt 1). Jeder hat ein Ende in Capital,
   das man ohne Druck erreicht oder auslässt.
6. **Keine Buchtexte über kurze Regelzitate hinaus** (CLAUDE.md, Regel 3). Buchseiten zeigen
   Kapitelnummer, Titel und einen einzigen Satz mit Fundstelle.

## 1. Die vier Sammelstränge

### 1.1 Die Finch-Jagd (Schachschnitzeljagd, 16 weiße Figuren)

**Figur:** Odette Finch, 71, sie, Schachproblem-Komponistin im Ruhestand. Sie reist mit ihrem
Wohnmobil „Gambit“ durchs Land und lacht viel. Ihre Probleme hießen früher „Finchs Fallen“.

**Was sie tut:** Für ihre letzte große Aufgabe hat sie die 16 weißen Figuren eines alten Satzes
aus Buchsbaum entlang der Wege versteckt. Unter jeder Figur ist ein Feld eingebrannt
(„Turm: a1“). Wer alle 16 findet und sie auf ihre Felder stellt, hat Weiß in Finchs Meisterproblem
vor sich. Schwarz stellt sie selbst auf, am Leuchtturm von Weg 11.

**Ablauf:**

- **Start, Akt 1:** Flohmarkt an der Landstraße von Weg 1. Odette verkauft dort alte Problemhefte
  und gibt {held} eine Karte mit 16 leeren Kästchen.
- **Figuren:** auf 13 Wegen je eine, eine im Steinbruch, eine in der Sternwarte, eine auf der
  Pelikaninsel (Tabelle in Abschnitt 3). Der König liegt nicht versteckt: Odette übergibt ihn
  selbst am Leuchtturm.
- **Verstecke:** Die Figuren liegen nicht offen herum, aber nie ganz ohne Hinweis. Jede Fundstelle
  hat ein kleines Zeichen, das Odette hinterlässt: ein Finkenpiktogramm aus Kreide oder Blech.
- **Ende:** Am Leuchtturm stellt Odette Schwarz auf. Ihr Meisterproblem ist eine Falle, keine
  Mattaufgabe: Weiß hat alle 16 Figuren noch auf dem Brett, so wie {held} sie gefunden hat, die
  meisten auf ihren Startfeldern.
  - **Stellung:** nach 1.e4 e5 2.Sf3 d6 3.Lc4 Lg4 4.Sc3 g6, die Falle von Légal (Seekadettenmatt,
    Paris um 1750).
  - **Felder unter den Figuren:**
    - Türme a1 und h1, Springer c3 und f3, Läufer c1 und c4, Dame d1, König e1;
    - Bauern a2, b2, c2, d2, e4, f2, g2, h2.
  - **Aufgabe:** „Weiß zieht und gewinnt.“ Die Lösung 5.Sxe5! lässt die eigene Dame hängen:
    - 5…Lxd1 6.Lxf7+ Ke7 7.Sd5# ist Matt;
    - 5…dxe5 6.Dxg4 gewinnt einen Bauern.
  - **Geprüft** mit python-chess. Nach dem Lösen spielt Odette die Falle vor (Vorführung
    `finchFalle`).
  - Odette: „Die Dame ist die teuerste Figur. Deshalb nimmt sie jeder. Deshalb ist sie der beste
    Köder.“
- **Lohn:** der Figurensatz „Finchs Buchsbaum“ als Extra der App (E3) und ein Platz im Album.
- **Später:** Wer weniger als 16 Figuren hat, bekommt am Leuchtturm einen Hinweis auf die fehlenden
  Wege. Odette wartet bis zum Ende des Spiels dort.

Die Pfeilspitze und der „Springer aus Holz“ von Route 2 (05, Abschnitt 12) passen dazu. Der
Springer wird Finchs erste Figur, die man findet, ohne von der Jagd zu wissen. Odette auf dem
Flohmarkt sieht ihn dann später: „Den hast du schon? Du bist schneller als die letzten drei.“

### 1.2 Die verlorenen Seiten (13 Buchseiten, eine je Kapitel)

**Figur:** der Wanderer mit dem gelben Rucksack (er, ohne Namen). Er läuft quer durchs Land zu
seinem Verlag in Capital. In seinem Rucksack steckt das Manuskript eines Schachbuchs „für
Einsteiger und leicht Fortgeschrittene“, Kapitel 0 bis 12. Ein kleiner Gruß an das Buch, zu dem die
App gehört; der Autor taucht so als stille Figur auf. **Widerspruch genügt.**

**Was passiert:** Bei jedem Wind fliegen ihm Seiten davon. Auf jedem der 13 Wege liegt eine, je
Kapitel eine.

- **Was die Seite zeigt:**
  - Kapitelnummer und Titel;
  - einen einzigen Satz mit Fundstelle;
  - die erste Abbildung des Kapitels als Brett (aus den App-Daten).

  Keine Lösungen und keine Aufgaben aus dem Buch.

- **Was der Wanderer sagt:** Wer ihn wieder trifft (zufällig auf einem späteren Weg, auf einer
  Bank), gibt ihm die Seiten zurück. Für jede sagt er einen Satz, warum er dieses Kapitel geschrieben
  hat. Diese Sätze schreibt der Autor selbst oder segnet sie ab.
- **Ende in Capital, nach dem Finale:** Er schenkt {held} das gedruckte Buch. In der App öffnet der
  Knopf „Im Buch nachlesen“ die Kapitelübersicht.
- **Lohn:**
  - je Seite 5 Münzen;
  - alle 13: der Bretthintergrund „Manuskript“ (Papier mit Bleistiftnotizen) und das Album-Foto
    „Der Wanderer“.

Die Reihenfolge der Kapitel folgt den Clubs am Weg (Abschnitt 3). So passt die Seite meist zu dem,
was {held} gerade lernt.

### 1.3 Die Spuren von Perfect Move (sechs Spuren, eine Mappe)

Neben der Hauptgeschichte sammelt {held} sechs Spuren dessen, was Perfect Move im Land treibt. Die
Hauptgeschichte ändert sich nicht: Dr. Lin und Nova legen in Akt 4 die Beweise vor. Wer die Spuren
hat, bekommt in Capital zusätzliche Sätze von Dr. Lin („Das hier kenne ich. Woher hast du das?“)
und ein Album-Foto.

| Spur | Weg                 | Was {held} findet                                                                                                |
| ---- | ------------------- | ---------------------------------------------------------------------------------------------------------------- |
| P1   | Weg 3, Brücke       | Eine Drohne mit dem Logo von Perfect Move filmt die Partien unter der Brücke (Abschnitt 2.3).                    |
| P2   | Weg 4, Glasbrücke   | Ein Funkmast „Testfeld Signal“ und der schon geplante „verlorene Ohrstöpsel“: Er ist ein Empfänger.              |
| P3   | Weg 5, Deich        | Ein Messwagen; Pläne für „Hochwasserhilfe mit Bildschirmtischen“, die Stimmen in Port Delacroix einsammeln soll. |
| P4   | Weg 7, Bergstraße   | Ein Sattelzug fährt Server ins Gebirge; der Fahrer wundert sich über die Fracht (Abschnitt 2.8).                 |
| P5   | Weg 8, Geysirbecken | Ein Antrag, die Geysire zum Kühlen eines Rechenzentrums anzuzapfen, abgelehnt von Rangerin Bell.                 |
| P6   | Weg 10, Staubstraße | Der Prototyp „Z-1“, ein Greifarm, der in einer alten Tankstelle allein Schach spielt (Abschnitt 2.11).           |

Technisch sind das Funde (E1) mit einem eigenen Album-Kapitel „Mappe“. Die Voraussetzung für die
Sätze von Dr. Lin ist der Besitz aller sechs.

### 1.4 Der Untergrundclub „Die Kreidespringer“

**Was es ist:** ein Club ohne Haus, ohne Mitgliedsbeiträge und ohne Bildschirme. Gespielt wird, wo
gerade Platz ist: unter Brücken, in Hinterzimmern, in stillgelegten Bahnhöfen. Vorbild sind die
Spieler im Washington Square Park und die Blitzturniere von Chess.com. Erkennungszeichen ist ein
Springer aus Kreide an einer Mauer. Wer ihn findet und das Losungswort kennt, darf mitspielen.

**Losungswörter:** Jeder Treffpunkt hat ein eigenes. {held} erfährt es am Treffpunkt davor oder
löst ein Rätsel neben dem Kreidespringer. Die Lösung ist ein Zug, und das Wort ist dessen Notation,
zum Beispiel „Sf7“.

**Treffpunkte:**

| Nr. | Ort                                       | Akt |
| --- | ----------------------------------------- | --- |
| K1  | Weg 3, unter der Brücke                   | 2   |
| K2  | Weg 4, hinter der Raststätte              | 3   |
| K3  | Weg 7, Hinterzimmer des Diners            | 4   |
| K4  | Weg 9, Holzfällerhütte                    | 4   |
| K5  | Capital, stillgelegter U-Bahnhof (Finale) | 4   |

**Ablauf:** An jedem Treffpunkt spielt {held} eine Blitzpartie (3 + 2) gegen die Kreidespringer
dort. Gewinnen ist nicht nötig; mitspielen reicht für das nächste Losungswort.

**Finale:** Im alten U-Bahnhof von Capital findet die Nacht der Kreidespringer statt, ein offenes
Blitzturnier. Dort treffen sich die Leute aus allen früheren Treffpunkten.

**Lohn:**

- die Zeitkarte „Kreide“ (+15 Sekunden einmal je Partie, nur im Blitz);
- ein Album-Foto;
- Victor taucht im Finale verkleidet auf. Kleiner Moment: Er spielt hier zum ersten Mal ohne
  Vater, ohne Kamera und ohne Namen.

## 2. Die Ereignisse je Weg

Jeder Abschnitt nennt:

- **Vorbild**: das echte Schach-Event;
- **Wann**: der Akt und ob das Ereignis erst bei der Rückkehr beginnt;
- **Geschichte**;
- **Schach**: was {held} am Brett tut;
- **Lohn**;
- **Auf der Karte**: Ereignisort, Bilder, Auslöser.

### 2.1 Weg 1 `wegMapleCedar`: Der Flohmarkt an der Landstraße

- **Vorbild:** Schachflohmärkte und Problemlöse-Wettbewerbe.
- **Wann:** Akt 1, an einem Samstag nach der ersten Clubnadel.
- **Geschichte:**
  1. Vor einem Farmhaus an der Landstraße ist Garagenflohmarkt: Kisten, Lampen, ein Fahrrad ohne
     Kette.
  2. Daneben parkt das Wohnmobil „Gambit“. Odette Finch verkauft Problemhefte für 50 Cent und
     stellt jedem, der stehen bleibt, „eine Falle“: ein Matt in eins, das wie ein Patt aussieht.
  3. Wer es löst, bekommt die Karte der Finch-Jagd (1.1).
  4. Ambrose kennt den Stil: „Diese Art Aufgabe hat man 1850 in den Zeitungen gedruckt. Sie ist
     schön und gemein.“
- **Schach:** drei Finch-Fallen, immer schwerer (Kapitel 4, Das Fallenkabinett).
- **Lohn:**
  - die Karte der Jagd;
  - ein Problemheft als Fund mit drei weiteren Aufgaben für unterwegs;
  - Buchseite Kapitel 0 im Graben neben dem Flohmarkt.
- **Auf der Karte:**
  - **Ereignisort:** Landstraße, Hofeinfahrt eines Farmhauses mit Garagenflohmarkt. Bilder aus dem
    Thema `garage sales` (Kisten, Tisch, Kleiderständer), Wohnmobil aus `vehicles`.
  - **Vorher:** ein Schild „Flohmarkt Samstag“ am Zaun.
  - **Auslöser:**
    - `ereignisFlohmarkt` (Odette);
    - `seite00` (Graben);
    - `finchBauerA` (Flussweg, unter der Bank am Steg, Finkenzeichen am Pfosten).

### 2.2 Weg 2 `wegCedarRiverton`: Die Zugpartie

- **Vorbild:** Fernschach und die Partien, die Bahnwärter mit Lokführern über Jahre spielten.
- **Wann:** Akt 2, beim ersten Gang zu Fuß.
- **Geschichte:**
  1. Am Bahndamm steht ein altes Stellwerk mit Signal. Die Wärterin Rosalind Kettering, 68, sie,
     spielt seit 23 Jahren eine Partie mit Lokführer Earl Dubois. Ja, demselben, der in Akt 4 Lkw
     fährt: Er hat den Beruf gewechselt, die Partie nicht.
  2. Ein Zug pro Vorbeifahrt: Er hält eine Tafel aus dem Fenster, sie hängt ihre Antwort an das
     Signal.
  3. Heute hat sie sich die Hand verstaucht und kann die Tafel nicht hochhalten. Der Güterzug kommt
     in zwei Minuten.
  4. {held} hängt den Zug auf, aber nicht ihren ersten Einfall: Der würde eine Figur einstellen.
- **Schach:** „Was hängt?“ (Kapitel 1). {held} findet in Rosalinds Stellung, warum ihr Zug eine
  Figur verliert, und zeigt einen besseren.
- **Später:**
  - **Akt 4:** Earl erzählt im Diner von Weg 7, dass die Partie remis endete, „nach 31 Jahren,
    zwei Kindern und einem Lkw-Führerschein“. Das ist Ambroses Thema, eine Partie, die zu Ende
    gespielt wird.
  - **Ambrose:** „Sie warten aufeinander. Und es macht sie nicht unglücklich.“
- **Lohn:** eine Bahnwärter-Laterne als Fund und Deko im Album; Buchseite Kapitel 1 im Schotter.
- **Auf der Karte:**
  - **Ereignisort:** Stellwerk am Bahndamm mit dem Signal (`spiel/eigene/bahn_signal.png`), Bank,
    Tafel an der Hauswand.
  - **Bilder:**
    - ein kleines Stellwerkshäuschen; das zeichnen wir selbst, wenn der Katalog keins hat;
    - der Güterwagen mit Katze für die Vorbeifahrt als Belebung.
  - **Auslöser:**
    - `ereignisZugpartie`;
    - `seite01`;
    - `finchSpringerA`: der schon geplante „Springer aus Holz“ im hohlen Stamm.

### 2.3 Weg 3 `wegRivertonIronwood`: Die Brückenbauern

- **Vorbild:** die Schachspieler im Washington Square Park, die um kleine Einsätze Blitz spielen.
- **Wann:** Akt 2.
- **Geschichte:**
  1. Unter der Kanalbrücke stehen drei Klapptische. Die „Brückenbauern“ spielen um zehn Cent die
     Partie, Fünf-Minuten-Blitz. Ihr Anführer heißt Dime, er, 40, redet ununterbrochen.
  2. Bevor {held} spielen darf: Am Pfeiler ist ein Kreidespringer gezeichnet (1.4), und Dime will
     das Losungswort. Es steht als Rätsel daneben.
  3. Während der Partie surrt über dem Kanal eine Drohne mit dem Logo von Perfect Move. Dime:
     „Seit zwei Wochen. Filmt jede Partie. Fragt keiner, wozu.“ Das ist Spur P1.
- **Schach:** eine Blitzpartie 3 + 2 gegen Dime. Er spielt aggressiv und stellt gern Fallen
  (Kapitel 7, Taktik).
- **Lohn:**
  - 20 Münzen (zehn Cent mal Dimes Übertreibung);
  - der Zugang zu den Kreidespringern;
  - Buchseite Kapitel 7 am Kanalufer.
- **Auf der Karte:**
  - **Ereignisort:** unter der Brücke. Ufer mit Kaimauer, drei Klapptische, Kreidespringer am
    Pfeiler, Graffiti aus `subway and train station`.
  - **Drohne:** die Drohne aus `city props` als Belebung über dem Wasser.
  - **Auslöser:**
    - `ereignisBrueckenbauern`;
    - `kreide1`;
    - `spurPM1`;
    - `seite07`;
    - `finchLaeuferA`: unter der Treppe zur Brücke.

### 2.4 Weg 4 `wegIronwoodSilicon`: Live auf der Glasbrücke

- **Vorbild:** Schach-Streamer und Showturniere wie PogChamps; Partien, bei denen der Chat den Zug
  wählt.
- **Wann:** Akt 3, Winter.
- **Geschichte:**
  1. Auf der Glasbrücke steht ein Ringlicht. Kiki Blitz, 19, sie, Streamerin mit 80 000
     Zuschauern, spielt live und wird von Perfect Move gesponsert.
  2. Sie fordert {held} vor der Kamera heraus: „Chat wählt meine Züge!“ Abgestimmt wird zwischen
     drei Zügen, einer davon schlecht.
  3. Mitten im Stream stockt das Bild. Am Funkmast neben der Brücke blinkt eine Leuchte, „Testfeld
     Signal“. Kiki zuckt: „Das ist jedes Mal so, wenn die da testen.“
  4. Später findet {held} den „verlorenen Ohrstöpsel“ (schon geplant). Das ist Spur P2.
  5. Hinter der Raststätte ist der zweite Kreidespringer (K2).
- **Schach:** eine Partie, in der der Gegner zufällig zwischen drei Kandidatenzügen wählt (einer
  davon ein Fehler). {held} soll den Fehler bestrafen, wenn er kommt (Kapitel 7, Taktik).
- **Später:**
  - **Akt 4:** Kiki kündigt ihren Vertrag. In Capital sitzt sie im Publikum und streamt ohne Logo.
- **Lohn:** ein Ringlicht als Album-Foto „Live“; Buchseite Kapitel 4 an der Raststätte.
- **Auf der Karte:**
  - **Ereignisort:** Mitte der Glasbrücke. Ringlicht, Klapptisch, Laptop (`spiel/eigene/`,
    `strasse.py`), Funkmast mit Schild „Testfeld Signal“; den Mast zeichnen wir selbst, ein
    Gittermast mit Antennen.
  - **Container:** Müllcontainer hinter der Raststätte (`city props`) mit dem Kreidespringer an der
    Wand.
  - **Auslöser:**
    - `ereignisStream`;
    - `kreide2`;
    - `spurPM2`;
    - `seite04`;
    - `finchBauerB`: im Blumenkübel der Raststätte.

### 2.5 Weg 5 `wegSiliconDelacroix`: Das Kapitänsproblem

- **Vorbild:** Problemlöse-Meisterschaften und Schach auf Kreuzfahrtschiffen.
- **Wann:** Akt 3.
- **Geschichte:**
  1. In der Kajüte der Fähre hängt ein gerahmtes Brett. Kapitän Amadou Fall, 60, er, hat es von
     seinem Vorgänger geerbt, mit der Aufgabe „Weiß zieht und gewinnt“. Seit 30 Jahren hat sie
     niemand gelöst. Wer sie löst, darf einmal das Horn blasen.
  2. Drei Fahrgäste haben falsche Lösungen auf Zettel geschrieben und an den Rahmen gesteckt.
     {held} prüft sie: Wo genau scheitert jede?
  3. Auf dem Deich danach steht ein weißer Messwagen von Perfect Move. Ein Techniker misst den
     Pegel und lässt eine Mappe liegen: „Hochwasserhilfe: 40 Bildschirmtische, Nutzerdaten
     Port Delacroix“. Das ist Spur P3.
- **Schach:** eine Studie (Kapitel 10, Studien und Kuriositäten; Unterverwandlung oder
  Läuferopfer). Die drei falschen Lösungen widerlegt {held} je mit einem Zug.
- **Lohn:**
  - das Horn (Klang beim Anlegen, ab dann bei jeder Überfahrt);
  - die Kapitänsmütze als Extra „Dein Aussehen“;
  - Buchseite Kapitel 2 an der Reling.
- **Auf der Karte:**
  - **Ereignisort:** die Kajüte auf dem Fährdeck. Gerahmtes Brett an der Wand, Zettel daran,
    Kapitän am Steuer.
  - **Deich:** Messwagen aus `vehicles` (Lieferwagen weiß), Sandsäcke.
  - **Auslöser:**
    - `ereignisKapitaen`;
    - `spurPM3`;
    - `seite02`;
    - `finchTurmA`: im Rettungsringkasten.

### 2.6 Abzweig `bayou`: Die Kiste im Hausboot

- **Vorbild:** die Kaffeehäuser von New Orleans um 1850 und alte Partieformulare als
  Sammlerstücke.
- **Wann:** Akt 3 im Hochwasser mit Gummistiefeln, oder Akt 4 bei der Rückkehr im Sommer.
- **Geschichte:**
  1. Am Ende des Stegs liegt ein Hausboot. Pépé Thibodeaux, 84, er, Fischer, hat eine Blechkiste
     mit Partieformularen aus dem Café des Exilés von 1852. Er will sie verbrennen: „Keiner liest das
     mehr.“
  2. {held} blättert, und Ambrose wird still: Auf einem Blatt steht seine eigene Handschrift. Er
     hat die Partie gegen einen Hafenarbeiter verloren und es damals niemandem erzählt.
  3. {held} spielt die Stellung nach dem 20. Zug weiter, mit Ambroses Seite. Ambrose verliert
     nicht noch einmal, oder doch, und lacht.
- **Schach:** Stellung aus der alten Partie, weiterspielen gegen die Engine (Kapitel 11, Beispielpartien).
- **Lohn:**
  - das Formular als Fund für Ambroses Album;
  - Pépé behält die Kiste und bringt sie ins Musikhaus;
  - Buchseite Kapitel 5 an einer Sumpfzypresse.
- **Auf der Karte:**
  - **Ereignisort:** Ende des Stegs. Hausboot (`spiel/eigene/` Delta-Bilder, sonst bestellen),
    Laterne, Blechkiste, Angeln.
  - **Auslöser:**
    - `ereignisHausboot`;
    - `seite05`;
    - `finchBauerC`: in einer Reuse am Steg.

### 2.7 Weg 6 `wegDelacroixDesert`: Die Seilschaft

- **Vorbild:** Schach am Berg (Rekordpartien auf Gipfeln) und Kletterwettbewerbe.
- **Wann:** Akt 3, nach der Versöhnung am Felsbogen (Hauptgeschichte). Bei der Rückkehr.
- **Geschichte:**
  1. Zwei Kletterinnen hängen in der Wand des Felsbogens. Sie spielen eine Partie, ein Zug je
     Seillänge: Wren Okoro, sie, unten, und Sol Ferris, sie, oben.
  2. Unten hört Wren nichts mehr, der Wind ist zu laut. {held} muss die Züge durch den Canyon
     rufen, mit Echo.
  3. Rufen kann man aber nur, was man sich merkt: Wren sieht das Brett nicht. Es ist eine kleine
     Übung im Blindspiel.
- **Schach:** Stellung mit sieben Figuren, die {held} kurz sieht und dann aus dem Gedächtnis
  beschreibt (Kapitel 7, Typische Mattbilder). Dazu ein Zug, der die Partie entscheidet.
- **Lohn:** ein Karabiner als Fund; Buchseite Kapitel 6 unter dem Felsbogen.
- **Auf der Karte:**
  - **Ereignisort:** Fuß der Felswand am Felsbogen. Seil, Rucksäcke, Kreidebeutel; zwei Figuren
    an der Wand, die zweite höher.
  - **Bilder:** Kletterseil und Haken zeichnen wir selbst (Pinewood hat schon eine Kletterwand).
  - **Auslöser:**
    - `ereignisSeilschaft`;
    - `seite06`;
    - `finchLaeuferB`: in einem Felsspalt.

### 2.8 Weg 7 `wegDesertSummit`: Schach über Funk

- **Vorbild:** Partien über Amateurfunk und CB-Funk (sie gab es wirklich) und die
  Dienstagsturniere von Chess.com.
- **Wann:** Akt 4, Sommer.
- **Geschichte:**
  1. Im Diner (schon geplant: Earl Dubois, Königsrennen) hängt ein CB-Funkgerät. Jeden Dienstag
     spielen die Fernfahrer zwischen Albuquerque und den Bergen ein Funkturnier: Züge in
     Buchstabiertafel („Echo vier, Echo zwei“), Bedenkzeit bis zur nächsten Ausfahrt.
  2. Heute fehlt einer, und {held} springt ein.
  3. Im Funk erzählt die Fahrerin „Mama Bear“ (Ruth Keene, sie), dass sie seit drei Wochen
     versiegelte Kisten von Perfect Move ins Gebirge fährt. „Sie summen. Kisten summen nicht.“ Das
     ist Spur P4.
  4. Das Hinterzimmer des Diners ist Treffpunkt K3 der Kreidespringer.
- **Schach:** eine Partie, bei der {held} die Züge des Gegners nur hört. Ein Brett gibt es auf dem
  Bildschirm, aber die gegnerischen Züge kommen als Notation (Notation aus Kapitel 0;
  Königsaktivität aus Kapitel 8).
- **Lohn:**
  - der Funkname „{held} Junior“, ab dann bei jedem Besuch im Diner;
  - 30 Münzen;
  - Buchseite Kapitel 8 auf dem Parkplatz;
  - die Spur P4.
- **Auf der Karte:**
  - **Ereignisort:** am Diner (schon da) das Funkgerät in der Fensterbank.
  - **Hinterzimmer:** eine Tür an der Rückseite; das Hinterzimmer ist ein kleiner Innenraum für
    Runde 6.
  - **Bergstraße:** ein Sattelzug (`spiel/eigene/sattelzug`) in einer Haltebucht, mit Kisten.
  - **Auslöser:**
    - `ereignisFunkschach`;
    - `kreide3`;
    - `spurPM4`;
    - `seite08`;
    - `finchSpringerB`: im Blumenkasten am Motel.

### 2.9 Abzweig `hochebene`: Das Bauerndiplom

- **Vorbild:** die Schachdiplome für Kinder (Bauerndiplom, Turmdiplom des Deutschen Schachbunds) und
  Schulschach.
- **Wann:** Akt 4, nach der Begegnung mit den Vells (Szene 82).
- **Geschichte:**
  1. Die Lehrerin Annek Vell richtet zum ersten Mal ein Schachdiplom für die Kleinen der Schule aus.
     Sie ist aber selbst noch Anfängerin und bittet {held}, Prüfer zu sein.
  2. {held} stellt drei Kindern je eine Aufgabe, prüft die Antwort und erklärt, wenn etwas falsch
     ist: im Spiel genau so wie bei Familie Hayes in Maple Falls (13, 7.3).
  3. Kira Vell spielt dabei die Rolle der Unruhestifterin: Sie hat die Diplome selbst gemalt, mit
     Falke und Bison darauf.
- **Schach:** {held} wählt für jedes Kind die passende Aufgabe aus drei. Gut ist die, die das Kind
  schaffen kann und bei der es etwas lernt (Kapitel 12, Trainingsmethodik).
- **Lohn:**
  - ein selbstgemaltes Diplom als Album-Seite;
  - Ambrose: „Lehren ist Spielen mit einem Brett, das man nicht sieht.“;
  - Buchseite Kapitel 3 an der Fahnenstange.
- **Auf der Karte:**
  - **Ereignisort:** Schulhof der Schule. Tribüne aus `school` (zwei Teile, Spiegelbild), drei
    Tische mit Brettern, Fahnenstange.
  - **Vorher:** ein Plakat „Diplomtag“.
  - **Auslöser:**
    - `ereignisDiplom`;
    - `seite03`;
    - `finchTurmB`: in der Kiste mit den Sportgeräten.

### 2.10 Weg 8 `wegSummitCrossroads`: Der Geysirblitz

- **Vorbild:** Puzzle Rush von Chess.com (so viele Aufgaben wie möglich in kurzer Zeit) und
  Armageddon.
- **Wann:** Akt 4.
- **Geschichte:**
  1. Der Geysir „Old Patience“ bricht alle neun Minuten aus. Rangerin Bell und die Schulklasse aus
     Summit City veranstalten den „Geysirblitz“: Aufgaben lösen, bis der Geysir kommt.
  2. Auf dem Infobrett im Rangerhäuschen hängt ein abgelehnter Antrag von Perfect Move, „Kühlung
     für Rechenzentrum Summit“ mit Geysirwasser. Bell: „Über meine Leiche. Und über die der
     Bisons.“ Das ist Spur P5.
  3. In der Prärie danach zieht ein Gewitter auf. {held} wartet mit Sturmjäger Ray Castillo im
     Sturmkeller und spielt beim Licht der Taschenlampe. Das ist eine ruhige Szene ohne Aufgabe.
- **Schach:** eine Runde mit sechs Aufgaben in vier Minuten (Spielzeit). Die Uhr ist der Geysir.
  Aufgaben aus Kapitel 7 (Taktik).
- **Lohn:**
  - Rangerabzeichen als Fund;
  - bei sechs von sechs das Album-Foto „Old Patience“;
  - Buchseite Kapitel 9 am Sturmkeller.
- **Auf der Karte:**
  - **Ereignisort:** Plattform am großen Geysir. Holzsteg, Bänke, Infotafel, Rangerhäuschen
    (Bild aus `land.py` oder `berg.py`; sonst zeichnen).
  - **Prärie:** Sturmkeller mit Klappe (zeichnen) neben dem Windrad.
  - **Auslöser:**
    - `ereignisGeysirblitz`;
    - `spurPM5`;
    - `seite09`;
    - `finchBauerD`: unter dem Steg, vom Ufer aus sichtbar.

### 2.11 Weg 9 `wegCrossroadsPinewood`: Lebendschach unter den Mammutbäumen

- **Vorbild:** Lebendschach mit Menschen als Figuren, wie in Marostica oder im Schachdorf Ströbeck.
- **Wann:** Akt 4. Die Pfadfinder aus Pinewood Camp üben für ihr Sommerfest.
- **Geschichte:**
  1. Auf einer Lichtung ist ein Brett aus Rasen und Kies ausgelegt, 8 × 8. Dreißig Kinder in
     weißen und schwarzen Westen warten, aber der Feldherr der Weißen ist krank.
  2. Betreuer Ezra bittet {held} zu kommandieren. Die Kinder ziehen erst, wenn sie den Zug laut
     hören, und protestieren, wenn sie geschlagen werden sollen: „Ich will nicht raus!“
  3. Bei der Holzfällerhütte am Weg ist Treffpunkt K4 der Kreidespringer.
- **Schach:** eine kurze Partie ab einer Mittelspielstellung. Wer eine Figur ohne Not opfert,
  bekommt einen Satz vom betroffenen Kind zu hören (Kapitel 1, Grundprinzipien).
- **Lohn:**
  - Album-Foto „Lebendschach“;
  - die Weste als Extra „Dein Aussehen“;
  - Buchseite Kapitel 10 an einem Mammutbaum.
- **Auf der Karte:**
  - **Ereignisort:** Lichtung mit Rasenbrett; 64 Felder aus zwei Böden, Figuren als Kinder.
  - **Bilder:** Fahnen an den Ecken, eine kleine Tribüne aus Holz.
  - **Holzfällerhütte:** mit Kreidespringer.
  - **Auslöser:**
    - `ereignisLebendschach`;
    - `kreide4`;
    - `seite10`;
    - `finchDame`: in einer Astgabel.

### 2.12 Weg 10 `wegPinewoodGhost`: Das Gespenst der Tankstelle

- **Vorbild:** die Schachautomaten des 18. und 19. Jahrhunderts (der „Türke“) und heutige
  Schachroboter.
- **Wann:** Akt 4, bevor {held} Ghost Town erreicht.
- **Geschichte:**
  1. Die Kinder aus Pinewood erzählen von einem Gespenst, das nachts in der alten Tankstelle an der
     Staubstraße Schach spielt. Ambrose ist beleidigt: „Gespenster spielen nicht in Tankstellen.“
  2. Drinnen steht ein Greifarm mit dem Logo von Perfect Move, Prototyp „Z-1“. Er hat Strom von
     einem Solarpaneel und spielt jeden, der sich setzt. Er ist vergessen worden, als das Testlabor
     umzog. Das ist Spur P6.
  3. Er spielt stark, aber nur eine Eröffnung, und er gerät in Panik, wenn man davon abweicht. Sein
     Arm zittert dann.
  4. Ambrose zum Schluss: „Eine Nähmaschine mit Ehrgeiz. Lasst ihn spielen, er hat sonst niemanden.“
- **Schach:** Partie gegen Z-1. Die Engine spielt stark, bis {held} von der Hauptvariante abweicht.
  Danach spielt sie wie Stufe 2 (Kapitel 2, Klassische Eröffnungssysteme).
- **Lohn:**
  - der Bauer von Z-1, eine Metallfigur, als Fund;
  - Spur P6;
  - Buchseite Kapitel 11 im Ölwechsel-Graben.
- **Auf der Karte:**
  - **Ereignisort:** verlassene Tankstelle an der Staubstraße. Zapfsäulen, Vordach, Solarpaneel auf
    dem Dach, Autowracks aus `city props`. Innen ein kleiner Raum für Runde 6.
  - **Bilder:** Greifarm zeichnen wir selbst.
  - **Auslöser:**
    - `ereignisTankstelle`;
    - `spurPM6`;
    - `seite11`;
    - `finchSpringer` fehlt hier bewusst: Die Tankstelle ist Perfect Moves Ort.
    - `finchBauerE`: am Canyonrand bei der Aussicht.

### 2.13 Weg 11 `wegGhostCapital`: Weltschachtag am Leuchtturm

- **Vorbild:**
  - der Internationale Tag des Schachs am 20. Juli;
  - die „Partie gegen die Welt“ (Kasparow, 1999), bei der alle über einen Zug abstimmen;
  - Simultanvorstellungen.
- **Wann:** Akt 4, am 20. Juli, zwei Tage vor der Landesmeisterschaft.
- **Geschichte:**
  1. Leuchtturmwärter Abe Lindgren hat zum Weltschachtag eingeladen. Am Seeufer stehen ein
     Eiswagen, ein Taco-Truck und eine Bühne. Leute aus allen Städten kommen: Slick, Big Joe,
     Mrs. Okafor, Céleste, die Kinder aus Pinewood.
  2. **Simultan:** {held} spielt auf einer langen Tafel gegen fünf Bekannte gleichzeitig.
  3. **Odette Finch** steht oben am Leuchtturm. Sie übergibt den König und stellt Schwarz auf: das
     Meisterproblem der Finch-Jagd (1.1).
  4. **Der Wanderer** sitzt auf einer Bank und bekommt seine Seiten zurück (1.2).
  5. **Abe** funkt eine Partie über das ganze Land: Jeder im Publikum stimmt über den nächsten Zug
     ab, gegen ihn. {held} darf einmal vorschlagen.
- **Schach:**
  - Simultan gegen fünf, je eine kurze Stellung mit Vorteil (Kapitel 6, Abschnitt 6.8: den Vorteil verwerten);
  - Finchs Falle: Weiß zieht und gewinnt (1.1).
- **Lohn:**
  - Album-Foto „Weltschachtag“;
  - der König von Finch und das Problem (1.1);
  - Buchseite Kapitel 12 am Steg.
- **Auf der Karte:**
  - **Ereignisort:** das Seeufer vor dem Leuchtturm. Bühne aus `beach` (Bühnenboden,
    Absperrungen), Eiswagen und Taco-Truck aus `vehicles`, lange Tafel mit Brettern,
    Lichterketten. Odettes Wohnmobil steht am Fuß des Leuchtturms.
  - **Vorher:** ein Plakat „20. Juli“ am Leuchtturm.
  - **Auslöser:**
    - `ereignisWeltschachtag`;
    - `seite12`;
    - `finchKoenig` (Odette);
    - `wandererCapital`.

### 2.14 Capital: Die Nacht der Kreidespringer (Treffpunkt K5)

Kein Weg, aber das Ende von 1.4.

- **Ort:** der stillgelegte U-Bahnhof unter der Innenstadt von Capital, im neuen Viertel
  `capitalArena.innenstadt` (Regel 10.51). Eingang mit Gitter und Kreidespringer.
- **Bilder:** Bahnsteig, Fliesen, Graffiti und Bänke aus `subway and train station` (582 Bilder,
  bisher kaum genutzt).
- **Ereignis:** offenes Blitzturnier mit drei Runden. Die Gegner kommen aus allen Treffpunkten:
  Dime, Mama Bear, die Holzfäller. In der dritten Runde sitzt ein Junge mit Kapuze gegenüber, und
  es ist Victor.
- **Auslöser:** `ereignisKreidenacht`, `kreide5`.

## 3. Übersicht: was auf welcher Karte liegt

Die Karten bekommen in Runde 7 alle Ereignisorte als Bild, in allen drei Varianten. Die Auslöser
selbst kommen mit den Dialogen in Runde 6 nach `orte.json`. Bis dahin legt der Kartenbauer ihre
Felder fest und trägt sie ins Ortsdokument ein (Teil 3.3, „für Runde 6“). Die Felder der
Fundstellen bleiben frei begehbar.

| Weg          | Karte, Ereignisort            | Ereignis                 | Seite | Finch-Figur               | Perfect Move       | Kreide         |
| ------------ | ----------------------------- | ------------------------ | ----- | ------------------------- | ------------------ | -------------- |
| Weg 1        | `landstrasse`, Hofeinfahrt    | Flohmarkt                | 0     | Bauer A (`flussweg`)      | –                  | –              |
| Weg 2        | `bahndamm`, Stellwerk         | Zugpartie                | 1     | Springer A (`zedernwald`) | –                  | –              |
| Weg 3        | `bruecke`, unter der Brücke   | Brückenbauern            | 7     | Läufer A                  | P1                 | K1             |
| Weg 4        | `glasbruecke`, Mitte          | Stream                   | 4     | Bauer B (`raststaette`)   | P2                 | K2             |
| Weg 5        | `faehre`, Kajüte              | Kapitänsproblem          | 2     | Turm A                    | P3 (`deich`)       | –              |
| Bayou        | `steg`, Hausboot              | Kiste im Hausboot        | 5     | Bauer C                   | –                  | –              |
| Weg 6        | `felsbogen`, Wandfuß          | Seilschaft               | 6     | Läufer B                  | –                  | –              |
| Weg 7        | `diner`, Funkgerät            | Funkschach               | 8     | Springer B                | P4 (`bergstrasse`) | K3             |
| Hochebene    | `schule`, Schulhof            | Bauerndiplom             | 3     | Turm B                    | –                  | –              |
| Weg 8        | `geysirbecken`, Plattform     | Geysirblitz              | 9     | Bauer D                   | P5                 | –              |
| Weg 9        | `riesenbaeume`, Lichtung      | Lebendschach             | 10    | Dame                      | –                  | K4 (`huetten`) |
| Weg 10       | `staubstrasse`, Tankstelle    | Gespenst                 | 11    | Bauer E (`canyonrand`)    | P6                 | –              |
| Weg 11       | `seeufer`, vor dem Leuchtturm | Weltschachtag            | 12    | König (Odette)            | –                  | –              |
| Steinbruch   | `grube`                       | –                        | –     | Bauer F                   | –                  | –              |
| Sternwarte   | `kuppel`                      | –                        | –     | Bauer G                   | –                  | –              |
| Pelikaninsel | `dorf`                        | –                        | –     | Bauer H                   | –                  | –              |
| Capital      | `innenstadt`, U-Bahnhof       | Nacht der Kreidespringer | –     | –                         | –                  | K5             |

Zählung: 8 Bauern (A bis H), 2 Springer, 2 Läufer, 2 Türme, Dame, König, zusammen 16 Figuren.
Buchseiten: 13 (Kapitel 0 bis 12). Die Kapitelbezüge im Schachteil folgen den Kapiteltiteln der App
(`app/public/daten/de/a1/`); die Buchseite eines Wegs gehört nicht immer zum Thema seines Ereignisses.

## 4. Was die Technik dafür braucht (für Runde 6)

Das meiste geht mit dem, was es schon gibt:

- Dialoge (Ink), Funde (E1), Aufgabenrunden (R30a), Stellungsduelle und Partien mit Uhr;
- `voraussetzung` über Orte hinweg und Album-Seiten.

Neu oder zu erweitern:

1. **Sammelkarte der Finch-Jagd:** eine Seite wie das Album mit 16 Kästchen und Feldnamen. Das
   Meisterproblem steht in Abschnitt 1.1, mit python-chess geprüft.
2. **Finchs Falle** als Aufgabe „Weiß zieht und gewinnt“ mit beiden Antworten von Schwarz (Daten oben, Abschnitt 1.1).
3. **Partie mit Kandidatenwahl** (Stream, 2.4): Der Gegner zieht zufällig einen von drei
   vorgegebenen Zügen. Das ist ein kleiner Zusatz zur Engine-Stufe.
4. **Partie nach Gehör** (Funkschach, 2.8): Gegnerzüge erscheinen erst als Notation und dann auf
   dem Brett.
5. **Simultan** (2.13): fünf kurze Stellungsduelle hintereinander auf einer Tafel. Das reicht als
   erste Fassung.
6. **Gedächtnisstellung** (Seilschaft, 2.7): Stellung 5 Sekunden zeigen, dann leeres Brett zum
   Aufbauen. Das ist neu, aber klein.
7. **Gegner mit Eröffnungsbuch und Bruch** (Z-1, 2.12): stark im Buch, danach schwach. Das ist eine
   Fehlerprofil-Einstellung der vorhandenen Engine-Stufen (AP 11).
8. **Lebendschach** (2.11): Figuren als Kinder auf der Karte. Bis zur Animation reicht die normale
   Brettansicht mit dem Bild der Lichtung dahinter.

## 5. Offene Punkte für den Autor (Widerspruch genügt)

- **Der Wanderer mit dem gelben Rucksack** ist ein stiller Gruß an dich und dein Buch. Die 13
  Sätze („warum ich dieses Kapitel geschrieben habe“) kommen von dir oder werden dir vorgelegt.
- **Buchseiten:** Sie zeigen nur Titel, einen Satz und die erste Abbildung. Wenn dir das schon zu
  viel ist, zeigen sie nur den Titel.
- **Earl Dubois** ist sowohl Lokführer in Akt 2 (früher) als auch Fernfahrer in Akt 4. Er hat den
  Beruf gewechselt, und die Zugpartie verbindet beides.
- **Victor bei den Kreidespringern:** ein kleiner Moment vor dem Finale, der Hauptgeschichte
  nicht im Weg.

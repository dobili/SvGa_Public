# Schach-Abenteuer – Story-Bibel, Teil 1 (Akt 1: Maple Falls und Cedar Creek)

Stand: 07.11.2026, Helfer-Chat mittel-1. Grundlage: `01_Konzeptsammlung.md`,
`02_Pruefung_Vorschlaege_Projektplan.md`, `03_Technische_Stellungnahme.md` (Abschnitt 3,
Clubs und Buchkapitel), `04_Architektur.md`, `ENTSCHEIDUNGEN.md` und die Beispiele in
`inhalte/abenteuer/`. Diese Datei ist die Wahrheit für alle Dialoge, Quests und Gegnerprofile von
Akt 1. Sie gilt als abgesegnet, solange der Autor nicht widerspricht (CLAUDE.md, Regel 9).

Was hier steht und was nicht: Figuren, Welt, Zeitlinie, Szenen und Stilregeln. Keine Ink-Dateien,
keine JSON-Daten, kein Code; die entstehen in Folgeaufträgen aus dieser Datei. Alle Namen sind
Arbeitsnamen bis zum Markencheck (Dokument 02, 2.5). Buchbezüge nennen nur Kapitel und
Abschnitte, nie Seitenzahlen.

## 0. Der Kern von Akt 1 in fünf Sätzen

1. {held} zieht mit der Mutter nach Maple Falls, findet auf dem Dachboden ein altes Brett und
   weckt den Geist Ambrose Whitlock, der seit 1866 auf das Ende einer Partie wartet.
2. Ambrose bringt {held} das Zählen und die eine Frage „Was hängt?“ bei; {held} gewinnt im
   Schulteam von Coach Delgado die erste Clubnadel.
3. Gleich danach schlägt Victor Hale {held} kühl und ohne Mühe; Ambrose erschrickt über den
   Namen Hale, sagt aber nicht, warum.
4. In Cedar Creek findet {held} mit Mrs. Okafor im Archiv der Bibliothek eine Zeitung von 1858:
   Ambrose hat damals ein Match gegen „den Ingenieur“ verloren und erzählt zum ersten Mal davon.
5. Nach dem Sieg im Bibliotheksclub steht das Ziel fest: „Ich will besser werden.“ Ambrose
   gesteht, was er sich wünscht: eine Partie ohne Makel.

## 1. Zeitlinie

| Jahr     | Ereignis                                                                                                                                                       |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1831     | Ambrose Whitlock wird in New Orleans geboren, Sohn eines Klavierbauers.                                                                                        |
| ab 1848  | Ambrose spielt in den Kaffeehäusern von New Orleans und wird dort der Beste nach dem jungen Paul Morphy (historische Figur, nur im Hintergrund).               |
| 1857     | Ambrose reist nach New York zum Ersten Amerikanischen Schachkongress, als Zuschauer. Er sieht Morphy gegen Paulsen gewinnen (Erinnerung in Cedar Creek).       |
| 1858     | Match in New Orleans gegen Josiah Hale, „den Ingenieur“, Brückenbauer aus dem Norden. Sieben Partien, Ambrose verliert 3 zu 4 mit einem tollkühnen Opfer.      |
| 1859     | Ambrose fordert Revanche. Hale antwortet mit einem Wort: „Später.“                                                                                             |
| 1860–64  | Schwere Jahre im Land, in denen kaum jemand Schach spielt. Die beiden schreiben sich Briefe.                                                                   |
| 1865     | Hale willigt ein: eine Revanchepartie per Brief (Fernpartie). Ambrose stellt sie auf seinem Brett nach.                                                        |
| 1866     | Ambrose reist nach Norden, um Hale die letzten Züge selbst zu bringen, und stirbt unterwegs am Fieber in einer Bergbausiedlung (später Ghost Town, Akt 4).     |
| danach   | Das Brett geht an Ambroses Schwester, die nach Maple Falls heiratet. Es bleibt in der Familie, die Figuren stehen noch in der Stellung der unbeendeten Partie. |
| bis 2025 | Die letzte Nachfahrin, die alte Mrs. Whitlock, lebt im Haus an der Birch Lane. Nach ihrem Tod wird das Haus mit vollem Dachboden günstig verkauft.             |
| 2026     | {held} und die Mutter ziehen ein. Gegenwart des Spiels: Spätsommer, Schulbeginn.                                                                               |

Hinweise für spätere Akte, die Akt 1 nur andeutet:

- Die unbeendete Fernpartie von 1865/66 ist die Quelle der **Partiefragmente** (Dokument 02,
  3.3): In jeder Stadt kommt ein Stück zurück, in Ghost Town wird sie zusammengesetzt. Sie endete
  in einem Endspiel (Dokument 02, 2.2, für Club 8). Ihre Züge sind erfunden und werden in einem
  Folgeauftrag mit der Engine gebaut.
- Victor ist ein Nachfahre von Josiah Hale. Rechnerisch liegen fünf Generationen dazwischen;
  „Urenkel“ aus der Konzeptsammlung stimmt nicht (Frage 3 in Abschnitt 6).
- „Später“ ist Ambroses wunder Punkt. Das Wort steht schon im Ink-Beispiel (Knoten
  `ambrose_wartet`) und wird zum Leitmotiv: Hale hat ihn warten lassen, bis es zu spät war.

## 2. Figuren

Pronomen: Für erfundene Figuren legt diese Bibel Pronomen fest. Für {held} gibt es keine;
die Regeln dazu stehen in Abschnitt 5.

### 2.1 {held} (Name wählbar)

**Hintergrund.** 14 Jahre, gerade umgezogen, neue Schule, keine Freunde in der Stadt. Kann die
Züge, aber kaum mehr. Ist eher still, beobachtet viel und sagt dann etwas Überraschendes. Der
Vater kommt im Spiel nicht vor und wird nicht erklärt; das bleibt der Fantasie der Kinder
überlassen und vermeidet ein schweres Thema, das die Geschichte nicht trägt.

**Sprechweise.** Der Held spricht nur in Antwortwahlen (Ink `*`), nie in langen Zeilen. Jede
Wahl ist kurz (höchstens zehn Wörter) und hat einen erkennbaren Ton: ehrlich, frech, vorsichtig.
Keine Wahl ist gemein; „frech“ heißt schlagfertig, nicht verletzend.

- „Ich kann kaum Schach.“
- „Und wenn ich verliere?“
- „Du bist ziemlich streng für jemanden aus Holz.“

**Rolle.** Lernt Schach von Grund auf, erst mit Ambrose, dann mehr und mehr allein. In Akt 1 ist
das Ziel klein und persönlich: dazugehören, dann besser werden.

**Verhältnis zum Schach.** Anfangs ein Spiel unter vielen, nach der Niederlage gegen Victor ein
Ziel. {held} will nicht wie Ambrose „schön“ spielen und nicht wie Victor „richtig“, sondern
herausfinden, was das eigene Schach ist. Das ist der Bogen über alle vier Akte.

### 2.2 Ambrose Whitlock, der Geist im Brett

**Hintergrund.** Geboren 1831 in New Orleans, gestorben 1866 auf der Reise zu seinem Rivalen.
Ein Meister der romantischen Schachzeit, fiktiver Zeitgenosse von Paul Morphy (Dokument 02, 3.2),
den er bewundert und nie geschlagen hat. Liebt mutige Opfer, schöne Angriffe und Ehre; findet
vorsichtiges Schach langweilig. Hat 1858 das Match gegen Josiah Hale verloren, weil er im
letzten Spiel lieber schön als richtig spielen wollte, und das nie verwunden. Wohnt im Brett,
kann es nicht verlassen und nur sprechen, wenn {held} es berührt oder in der Nähe hat. Andere
Menschen hören ihn nicht.

Entwicklung über das ganze Spiel (Konzeptsammlung, Charakterentwicklung des Geistes): Er
wünscht sich die eine makellose, unsterbliche Partie, hadert mit seinem Dasein, ist später von der
Konzern-KI fasziniert und läuft fast über, bis er begreift, dass Schach durch Menschen schön
wird, die kämpfen und Fehler machen. **In Akt 1** zeigt er nur die ersten Schichten: Er ist
hochmütig, ungeduldig und behandelt {held} zuerst wie einen Lehrling, den man ihm zugeteilt hat.
Er taut auf, als {held} ehrlich ist und nicht aufgibt. Am Ende von Akt 1 spricht er zum ersten Mal
von seinem Wunsch.

**Sprechweise.** Altmodisch, aber für Zehnjährige verständlich; die fünf Regeln stehen in
Abschnitt 5.3. Trockener Humor über das eigene Totsein, nie gruselig. Er sagt „du“ zu {held},
weil er „Lehrling“ meint, und siezt Erwachsene in Gedanken („Ihre Mutter, wenn ich so sagen
darf“, nur im Gespräch mit {held}).

- „Was hängt? Diese Frage stellt man vor jedem Zug. Vor jedem.“
- „Ein Taschenspiegel, der rechnet. Und er hat dir nicht gesagt, dass dein Läufer hängt?“
- „Ich bin seit hundertsechzig Jahren tot. Geduld habe ich trotzdem nicht gelernt.“

**Rolle.** Mentor, Erzähler der Lektionen aus dem Buch (in kleinen Häppchen, Dokument 02, 2.2),
Kommentator der Schlüsselmomente nach jeder Partie, Geber der Hilfskarten. Er verweist auf das
Buch nur als „ein Buch, das ich gern geschrieben hätte“, mit Abschnitt („Kapitel 1, Abschnitt
1.4“), nie mit Seiten.

**Verhältnis zum Schach.** Schach ist Kunst und Ehre. Ein Sieg ohne Schönheit ist für ihn nur
halb so viel wert; eine Niederlage mit einem kühnen Opfer findet er fast in Ordnung. Genau das
kollidiert mit dem, was {held} braucht: erst einmal nichts einstellen.

### 2.3 Mama (Laura)

**Hintergrund.** Anfang vierzig, Krankenpflegerin im Kreiskrankenhaus, arbeitet im Schichtdienst
und hat den Umzug wegen der neuen Stelle gemacht. Allein erziehend, liebevoll, müde, praktisch.
Hält von Schach scheinbar nichts. Geheimnis für Akt 2 (Ironwood, Dokument 02, 3.2): Sie hat als
Jugendliche Turniere gespielt und aufgehört, nachdem eine verlorene Partie ihr eine Meisterschaft
gekostet hat. In Akt 1 nur Andeutungen: Sie kennt Fachwörter, die sie nicht kennen dürfte, und
schaut zu lange auf das alte Brett.

**Sprechweise.** Kurze, praktische Sätze, Fragen nach dem Alltag, Humor aus Müdigkeit. Nennt
{held} beim Namen, nie „Schatz“ in einer Form, die nach Geschlecht klingt.

- „Kisten auf den Dachboden, dann Pizza. In der Reihenfolge.“
- „Schach? Na gut. Hauptsache, du bist vor zehn zu Hause.“
- „Das Brett ist alt. Pass auf die Figuren auf. Die … sind bestimmt was wert.“

**Rolle.** Heimat und Halt. Erlaubt in Akt 1 den Schachclub ohne Begeisterung. Ihre Andeutungen
bereiten die Versöhnung in Ironwood vor.

**Verhältnis zum Schach.** Abgebrochen, nicht gleichgültig. Sie hat Angst, dass {held} dieselbe
Erfahrung macht: dass ein Spiel einem das Herz brechen kann.

### 2.4 Victor Hale, der Rivale

**Hintergrund.** 15 Jahre, Sohn von Graham Hale, leitendem Entwickler bei Perfect Move Inc. in
Silicon Bay. Privattrainer seit dem fünften Lebensjahr, besucht eine Privatschule, hat eine
Wertung, mit der er bei Erwachsenenturnieren vorne mitspielt. Kommt nach Maple Falls, weil der
Vater dort das Schulamt für ein „Pilotprojekt“ des Konzerns gewinnen soll (Trainer-App statt
Trainer), und langweilt sich. Er ist nicht fies, sondern unter Druck: Jede Partie ist für ihn eine
Prüfung, die der Vater nachrechnet. Später wird er Freund (Konzeptsammlung, Der Rivale).

**Sprechweise.** Kühl, korrekt, wenig Gefühl in der Stimme. Spricht in Zahlen und Fachwörtern,
redet {held} mit dem Namen an, als würde er ihn ablesen. Nie Beleidigungen, aber Sätze, die
kleinmachen. Manchmal ein halber Satz, der verrät, wie müde er ist.

- „Italienisch. Natürlich. Das spielen alle, die gerade die Regeln gelernt haben.“
- „Du hast in Zug zwölf verloren. Den Rest hast du nur nicht gemerkt.“
- „Mein Vater sagt, ein Remis gegen Schwächere ist eine Niederlage. … Er hat meistens recht.“

**Rolle.** Gegenpol und Antrieb. In Akt 1 zweimal: die Niederlage in Maple Falls (Szene 12) und
ein kurzer Auftritt ohne Partie in Cedar Creek (Szene 21).

**Verhältnis zum Schach.** Er ist sehr gut und hat vergessen, warum er spielt. Spaß kommt in
seinem Wortschatz nicht vor. Wenn {held} in Cedar Creek fragt „Macht dir das eigentlich Spaß?“,
hat er keine Antwort; das ist der erste Riss.

**Victors Vater, Graham Hale.** Überfordert, nicht böse (Dokument 02, 2.3). Ingenieur wie sein
Vorfahre, glaubt an Zahlen, liebt seinen Sohn und zeigt es durch Erwartungen. Telefoniert ständig.
In Akt 1 nur ein Auftritt (Szene 12), freundlich zu {held}, abwesend zu Victor. Beispielsatz:
„Gut gespielt, Victor. Nächstes Mal schneller, ja? Wir haben um vier den Termin.“

### 2.5 Coach Delgado (Club 1, Maple Falls)

**Hintergrund.** Marisol Delgado, Ende dreißig, Mathelehrerin an der Maple Falls High und Coach
des Schachteams, früher Fußballtrainerin der Mädchenmannschaft. Hat das Team vor vier Jahren mit
drei Kindern gegründet; jetzt sind es sieben, und es fehlt immer ein viertes Brett für die
Kreisliga. Kämpft um jeden Dollar für Bretter und Busfahrten, deshalb ist sie für das Pilotprojekt
von Perfect Move offen und gleichzeitig misstrauisch.

**Sprechweise.** Sportlich, laut, herzlich. Benutzt Wörter vom Spielfeld: Aufstellung, Abpfiff,
Auswärtsspiel. Lobt konkret, nicht allgemein. Pfeift gelegentlich (Tag `#klang:pfiff`).

- „Willkommen im Team, das noch keins ist. Wir arbeiten dran.“
- „Gute Partie! Aber dein Springer auf a3 hat zwanzig Züge Pause gemacht.“
- „Erst zählen, dann schlagen. Das ist hier Gesetz, und ich bin die Polizei.“

**Rolle.** Clubchefin 1. Ihre Clubnadel ist der Eintritt ins Team. Stellt das Ziel „Kreisliga,
dann Bundesstaat“ und damit den Rahmen der Reise (Konzeptsammlung, Setting).

**Verhältnis zum Schach.** Schach ist für sie Teamsport und der Ort, an dem schüchterne Kinder
laut werden dürfen. Spielt solide, positionell, mit dem Italiener (Gegnerprofil
`mapleFalls.coachDelgado`); ihre bekannte Schwäche: Sie übersieht Drohungen, wenn sie selbst
angreift (`drohungIgnoriert`).

### 2.6 Sam (Clubmitglied, Maple Falls)

**Hintergrund.** Sam Brooks, 15, er. Bestes Brett des Teams, bis {held} kommt. Laut, schnell,
spielt jede Partie mit früher Dame (Gegnerprofil `mapleFalls.sam`, Stil Draufgänger), gewinnt
damit gegen Anfänger und verliert gegen alle anderen. Großes Herz, kleiner Geduldsfaden. Hat
Angst, seinen Platz zu verlieren, und zeigt es als Prahlerei.

**Sprechweise.** Schnell, viele Ausrufe, Spitznamen für Figuren („die Chefin“ für die Dame).
Gibt Fehler nicht zu, bis er lacht und es doch tut.

- „Dame raus, Zug zwei. Funktioniert immer. Fast immer.“
- „Die Chefin wurde gefangen. Das zählt nicht, das war Pech!“
- „Okay, okay. Zeig mir das noch mal mit dem Zählen.“

**Rolle.** Erster Freund im Team nach anfänglicher Eifersucht. Stellt eine Aufgabenreihe vor dem
Clubkampf und die Begegnungs-Quest „Sams Dame“ (`mapleFalls.samsDame`).

**Verhältnis zum Schach.** Liebt es laut. Lernt in Akt 1, dass die Dame nicht allein gewinnt
(Buch Kapitel 1, Abschnitt 1.2, die vier Todsünden, als Vorgeschmack).

### 2.7 Juno Martínez, beste Freundin

Entscheidung: beste Freundin statt bester Freund, weil Sam schon ein Junge im Team ist und das
Team dann gemischt wirkt. Die Rolle ist geschlechtsunabhängig geschrieben; ein Tausch wäre billig.

**Hintergrund.** 14, sie, wohnt zwei Häuser weiter, kennt jeden in Maple Falls und jedes Gerücht.
Ist im Schachteam, weil ihre große Schwester es war, und spielt schlecht, aber mit Herz: Sie
verliert fröhlich und will trotzdem jedes Mal wissen, warum. Führt das **Clubtagebuch** (Dokument
02, 3.2), ein dickes Heft mit Stickern, in dem Clubnadeln, Karten und Steckbriefe der Gegner
stehen. Damit ist sie die Erzählerin des Menüs.

**Sprechweise.** Begeistert, viele Fragen, kleine Wortspiele, die Kinder verstehen (kein Sarkasmus).
Spricht über Figuren wie über Haustiere.

- „Neu hier? Perfekt. Wir brauchen ein viertes Brett und ich brauche jemanden zum Reden.“
- „Ich hab meinen Turm verloren. Schon wieder. Er war so jung.“
- „Das kommt ins Tagebuch. Mit Glitzer.“

**Rolle.** Bringt {held} ins Team (Szene 5), begleitet nach Cedar Creek, schreibt die Steckbriefe.
Wenn das Clubtagebuch etwas Neues bekommt, sagt Juno einen Satz dazu.

**Verhältnis zum Schach.** Ein Ort, um mit Freunden zusammen zu sein. Sie ist der Beweis im Spiel,
dass man nicht gewinnen muss, um dazuzugehören.

### 2.8 Mrs. Okafor (Club 2, Cedar Creek)

**Hintergrund.** Grace Okafor, Anfang siebzig, sie. Als Mädchen in Lagos Schach von ihrem Onkel
gelernt, später Geschichtslehrerin in Cedar Creek, jetzt im Ruhestand. Leitet ehrenamtlich den
Schachclub der Stadtbibliothek und kümmert sich um das Archiv im Keller, alte Zeitungen und
Briefe aus zwei Jahrhunderten. Kennt den Namen Ambrose Whitlock aus einer Fußnote in einem alten
Schachkalender (Konzeptsammlung: ältere Trainerin, die Ambrose aus Archiven kennt). Spielt
Grundreihen- und Mattbilder-Schach: Sie stellt Fallen, die man erst sieht, wenn es zu spät ist.

**Sprechweise.** Ruhig, warm, genau. Antwortet oft mit einer Gegenfrage. Benutzt Sprichwörter,
die sie dann erklärt. Ihr Lieblingswort ist „Geduld“.

- „Was glaubst du denn, warum der König dort steht?“
- „Bei uns sagte man: Wer nur auf seinen Weg schaut, fällt in das Loch daneben.“
- „Ein Matt ist ein Bild. Wer viele Bilder kennt, sieht sie im eigenen Spiel.“

**Rolle.** Clubchefin 2, Hüterin des Archivs, öffnet die Geschichte von 1858. Ahnt, dass mit dem
Brett etwas Besonderes ist, fragt aber nicht nach („Manche Dinge erzählt man, wenn man so weit
ist.“). Wird in späteren Akten eine stille Verbündete gegen Perfect Move (Bibliothek als Ort ohne
Bildschirme).

**Verhältnis zum Schach.** Schach ist Gedächtnis: Jede Partie erzählt von den Menschen, die sie
gespielt haben. Damit ist sie die Brücke zwischen Ambrose und der Gegenwart.

### 2.9 Nebenfiguren Maple Falls

**Mr. Abernathy.** Pensionierter Bibliothekar, um die achtzig, er. Sitzt jeden Nachmittag im
Stadtpark auf derselben Bank mit Reiseschach und Thermoskanne, war mit der alten Mrs. Whitlock
befreundet und hat beim Ausräumen ihres Hauses einen Brief mit Schachzügen abgeschrieben. Spricht
umständlich und freundlich, verliert ständig Dinge. Beispiel: „Ich hatte doch … nein, das ist meine
Brille. Das Brett, das Brett!“ Rolle: Rätsel-Quest „Das vergessene Brett im Park“
(`mapleFalls.verlorenesBrett`), liefert das erste Partiefragment.

**Jo.** Skaterin im Park, 16, sie. Spielt auf einem zerkratzten Brett auf der Halfpipe-Kante
Blitzpartien um Limo, angriffslustig und taktisch (Gegnerprofil `mapleFalls.skaterJo`). Kurz
angebunden, fair. Beispiel: „Fünf Minuten, eine Partie. Wer verliert, holt Limo.“ Rolle:
Straßengegnerin, Kurzformat (Stellungsduell, Entscheidung C1).

**Lily.** Nachbarskind, 8, sie. Will unbedingt wissen, wie der Springer zieht, weil ihr großer
Cousin sie damit aufzieht. Beispiel: „Der Pferd hüpft doch einfach irgendwohin, oder?“ Rolle:
Hilfe-Quest „Lilys Springer“ (`mapleFalls.lilysSpringer`).

### 2.10 Nebenfiguren Cedar Creek

**Mr. Boateng.** Besitzer des Waschsalons, Mitte sechzig, er. Hat auf einem Trockner ein Brett
festgeklebt und lässt jede Woche eine neue Stellung stehen: Wer sie löst, wäscht einmal umsonst.
Ruhiger Humor, liebt Grundreihenmatts. Beispiel: „Die Maschine schleudert, du denkst. Beides
braucht zwölf Minuten.“ Rolle: Rätsel-Quest „Die Stellung auf dem Trockner“.

**Dex.** Dexter Okafor, 13, er, Enkel von Mrs. Okafor, Clubmitglied. Bastler, baut aus Schrott
Dinge, die fast funktionieren, rechnet Varianten wie Schaltpläne. Beispiel: „Wenn der Turm hier
steht, ist das wie ein Kurzschluss. Alles ist tot.“ Rolle: stellt eine Aufgabenreihe (Matt in
eins).

**Mae.** Mae Lindqvist, 11, sie, jüngstes Clubmitglied und Mattbilder-Expertin, kennt die Namen
aller Mattbilder und sagt sie wie Zaubersprüche. Hat ein Teleskop. Beispiel: „Anastasia! Das ist
ein Matt mit Namen. Das klingt wie eine Prinzessin, ist aber gemein.“ Rolle: stellt eine
Aufgabenreihe (Matt in zwei), lädt zur Sternennacht ein (Begegnungs-Quest).

**Rosa.** Anglerin am Steg, Ende fünfzig, sie. Spielt Schach, während sie auf Fische wartet, auf
einem Brett mit Magnetfiguren. Beispiel: „Ruhig, ruhig. Der Fisch merkt, wenn du zappelst. Der
Gegner auch.“ Rolle: Straßengegnerin, Kurzformat.

## 3. Welt

Grundsatz (Dokument 02, 2.1): je Stadt eine Außenkarte und zwei bis drei Innenräume. Kennungen
nach `inhalte/abenteuer/README.md`. Die vorhandenen Kennungen aus `orte.json` sind übernommen.

### 3.1 Maple Falls (Ort 1, `mapleFalls`)

Kleinstadt am Fluss mit Wasserfall, Ahornbäume, eine Hauptstraße, Holzhäuser mit Veranden.
Spätsommer, die Blätter werden an den Rändern schon rot. Ruhig, freundlich, ein bisschen
verschlafen.

| Karte                   | Art               | Zweck                                                                                | Figuren                                    | Atmosphäre                                                                        |
| ----------------------- | ----------------- | ------------------------------------------------------------------------------------ | ------------------------------------------ | --------------------------------------------------------------------------------- |
| `mapleFalls.aussen`     | außen             | Hauptstraße mit Haus an der Birch Lane, Schule, Diner, Bushaltestelle; Wege zu allem | Lily (vor dem Nachbarhaus), Juno (Szene 5) | Ahornblätter auf dem Gehweg, das Rauschen des Wasserfalls hinter den Dächern.     |
| `mapleFalls.park`       | außen (Randkarte) | Stadtpark am Fluss mit Halfpipe und Bänken; Ausgang zur Landstraße nach Cedar Creek  | Jo, Mr. Abernathy                          | Rollen auf Beton, Enten, eine Bank, auf der immer jemand sitzt.                   |
| `mapleFalls.wohnzimmer` | innen             | Zuhause, Speichern im Gespräch mit Mama, Treppe zum Dachboden                        | Mama                                       | Umzugskartons als Möbel, Pizzakarton auf dem Boden, Licht durch staubige Fenster. |
| `mapleFalls.dachboden`  | innen             | Fund des Bretts, Ort für Gespräche allein mit Ambrose                                | Ambrose (im Brett)                         | Staub, Kisten der alten Mrs. Whitlock, ein Fenster mit Blick auf die Ahornbäume.  |
| `mapleFalls.clubraum`   | innen             | Schachteam: Aufgabenreihen, Clubkampf, Victor-Szene                                  | Coach Delgado, Sam, Juno, später Victor    | Klassenzimmer mit Pokalen von 1994, ein Brett mit fehlender schwarzer Dame.       |

Entscheidung: Der Park bleibt eine eigene kleine Außenkarte, wie in `orte.json` angelegt, und
wird zugleich der Stadtrand mit dem Weg nach Cedar Creek (wie ein kurzer Weg zwischen zwei
Städten). Damit hat Maple Falls zwei kleine Außenkarten und drei Innenräume; das bleibt im Rahmen,
weil der Park die Route ersetzt.

### 3.2 Cedar Creek (Ort 2, `cedarCreek`)

Kleinerer Ort am Bach, zwanzig Minuten mit dem Bus, rote Zedern, ein Steg, eine Bibliothek aus
Backstein von 1890 als größtes Gebäude. Ein wenig altmodisch, still, riecht nach Holz und Papier.

| Karte                   | Art   | Zweck                                                                   | Figuren                          | Atmosphäre                                                                       |
| ----------------------- | ----- | ----------------------------------------------------------------------- | -------------------------------- | -------------------------------------------------------------------------------- |
| `cedarCreek.aussen`     | außen | Ortskern mit Bibliothek, Waschsalon, Bushaltestelle, Steg am Bach       | Rosa (Steg), Victor (Szene 21)   | Zedern, ein klappernder Bus, der Bach glitzert unter dem Steg.                   |
| `cedarCreek.bibliothek` | innen | Bibliotheksclub: Aufgabenreihen und Clubkampf                           | Mrs. Okafor, Dex, Mae            | Hohe Regale, Leselampen mit grünen Schirmen, vier Bretter an einem langen Tisch. |
| `cedarCreek.archiv`     | innen | Keller der Bibliothek: Zeitung von 1858, Ambroses Erzählung, Erinnerung | Mrs. Okafor (zeitweise), Ambrose | Kartons, eine flackernde Lampe, der Geruch von altem Papier.                     |
| `cedarCreek.waschsalon` | innen | Rätsel-Quest auf dem Trockner                                           | Mr. Boateng                      | Brummende Maschinen, warme Luft, ein Brett mit Klebeband auf einem Trockner.     |

### 3.3 Was in Akt 1 nicht vorkommt

Perfect Move Inc. und die KI ZERO erscheinen in Akt 1 nur als Namen: auf Victors Tablet, im
Gespräch über das Pilotprojekt, auf einem Plakat in Cedar Creek. Kein Aufkauf, kein Schummeln;
das beginnt in Akt 2 (Riverton). Die Arbeitsnamen bleiben bis zum Markencheck; „ZERO“ soll
wegen der Nähe zu einem realen Programm umbenannt werden (Dokument 02, Abschnitt 5).

## 4. Szenenliste Akt 1

Etwa 3 bis 4 Stunden Spielzeit. Kennungen: Szenen `akt1.name` (wie `akt1.ambroseErwacht` im
Ink-Beispiel), Quests und Begegnungen `ort.name`, Ink-Dateien `ort-karte.ink`, Knoten
`datei.knoten`. **H** = Hauptquest, **N** = Nebenquest mit Typ (rätsel, hilfe, begegnung,
Dokument 02, 3.3), **S** = Straßengegner. Gegnerstärken nach `04_Architektur.md`, Abschnitt 4.

### Maple Falls

**1. Ankunft** · `akt1.ankunft` · H `mapleFalls.dasBrett`
Ort `mapleFalls.wohnzimmer` · Figuren: Mama, {held} · Ink `maple-falls-wohnzimmer.ankunft`.
Zweck: Name wählen (Spielstand, Feld `held`), Steuerung lernen, Ziel geben. Ereignis: Dialog.
Mama schickt {held} mit einer Kiste auf den Dachboden. Erste Andeutung: Auf einer Kiste steht
„Whitlock – nicht wegwerfen“; Mama: „Die Vorbesitzerin. Alles, was oben ist, gehört jetzt uns.“
Etwa 5 Minuten.

**2. Ambrose erwacht** · `akt1.ambroseErwacht` · H `mapleFalls.dasBrett`
Ort `mapleFalls.dachboden` · Ambrose · Ink `maple-falls-dachboden` (vorhanden, Knoten
`dachboden_brett` bis `partie_beginnt`). Ereignis: Dialog, erste Karte **Fingerzeig**
(`gibKarte("fingerzeig")`, schon im Beispiel). Die Figuren auf dem Brett stehen „mitten in einer
Partie“: das ist die unbeendete Fernpartie von 1866 (Abschnitt 1). Ambrose räumt sie für die
Lektion nicht ab, sondern stellt ein zweites, unsichtbares Brett daneben („Diese Stellung rührt
niemand an.“). Etwa 5 Minuten.

**3. Die erste Lektion** · `akt1.erstePartie` · Begegnung `mapleFalls.ersteLektion`
Ort `mapleFalls.dachboden` · Ambrose. Ereignis: Partie aus der Grundstellung gegen Ambrose. Zweck:
Einstufung ohne eigenen Test (Entscheidung A5): Leser ohne Wertung bekommen die Schätzung aus
dieser Partie; sie zählt zu den ersten zehn Partien der Eingangswertung (Ergänzung A6). Ambrose
spielt als Lehrer: feste mittlere Stärke mit hoher Fehlerhäufigkeit, die er bewusst „anbietet“
(„Mein Läufer steht dort, wo er nicht stehen sollte. Siehst du es?“). Jeder Ausgang führt weiter:
Sieg („Glück ist der Anfang jeder Begabung.“), Remis, Niederlage („Gut. Jetzt weißt du, was du
lernen willst.“). Danach die zwei Schlüsselmomente mit Ambrose und die Lektion „Was hängt?“
(Buch Kapitel 1, Abschnitt 1.4, Angreifer und Verteidiger zählen). Etwa 20 Minuten.

**4. Abend im neuen Haus** · `akt1.ersterAbend`
Ort `mapleFalls.wohnzimmer` · Mama · Ink `maple-falls-wohnzimmer.erster_abend`. Ereignis: Dialog.
{held} kommt mit dem Brett herunter. Mama sieht die Stellung und sagt, ohne nachzudenken: „Schwarz
steht besser.“ Dann schnell: „Hab ich irgendwo gelesen.“ Sie erwähnt, dass die Schule ein
Schachteam hat (Zettel im Briefkasten). Ambrose leise: „Ihre Mutter, wenn ich so sagen darf, lügt
schlecht.“ Andeutung für Ironwood. Etwa 3 Minuten.

**5. Erster Schultag** · `akt1.ersterSchultag`
Ort `mapleFalls.aussen`, dann `mapleFalls.clubraum` · Juno, Coach Delgado, Sam ·
Ink `maple-falls-aussen.juno_trifft`, `maple-falls-clubraum.coach`. Ereignis: Dialog. Juno spricht
{held} an der Bushaltestelle an („Du bist das Kind aus dem Whitlock-Haus!“) und zieht {held} nach
der Schule in den Clubraum. Coach Delgado erklärt: Es fehlt ein viertes Brett für die Kreisliga;
wer die Clubnadel holt, spielt mit. Sam ist sofort eifersüchtig. Das Clubtagebuch wird
freigeschaltet (Menü). Etwa 8 Minuten.

**6. Aufgabenreihe Maple Falls** · Runden `mapleFalls.reiheSam`, `mapleFalls.reiheJuno`
Ort `mapleFalls.clubraum` · Sam, Juno. Ereignis: Aufgaben (`beginneAufgaben`). Umfang nach
Zeitbudget (Entscheidung A7): 12 bis 15 Aufgaben, bestanden ab 70 Prozent. Sam stellt Zählaufgaben
und hängende Figuren (Buch Kapitel 1, Abschnitt 1.4; Übungen `droh-ignorieren`,
`zaehlen-vorstoss`, `angriff-zaehlen`), Juno die Notationsübungen aus Kapitel 0 („Ich hab das
aufgeschrieben, aber ich kann meine Schrift nicht lesen. Kannst du?“) und Matt in eins als
Vorgeschmack. Danach öffnet Coach Delgado den Clubkampf. Etwa 15 Minuten.

**7. Das vergessene Brett im Park** · N rätsel `mapleFalls.verlorenesBrett` (vorhanden)
Ort `mapleFalls.park` · Mr. Abernathy · Ink `maple-falls-park.bibliothekar`, `.parkbank`.
Ereignis: Stellungsrätsel, Fund. Abernathy hat sein Reisebrett auf einer anderen Bank vergessen;
{held} findet es, darauf eine Stellung „Weiß am Zug gewinnt eine Figur“ (Zählaufgabe, Kapitel 1).
Gelöst, erzählt Abernathy, dass er die Stellung aus einem Brief der alten Mrs. Whitlock
abgeschrieben hat. Ambrose erkennt sie: Es ist ein Stück seiner Fernpartie. Belohnung:
**Partiefragment 0** (`fragment`, Halbzug 0, wie im Beispiel). Ambrose: „Er hat das abgeschrieben?
Mit Bleistift? Ich bin gerührt. Und beleidigt, es fehlt ein Bauer.“ Etwa 8 Minuten.

**8. Lilys Springer** · N hilfe `mapleFalls.lilysSpringer`
Ort `mapleFalls.aussen` · Lily · Ink `maple-falls-aussen.lily`. Ereignis: Aufgaben (Springerzüge,
Kapitel 0, Gangart der Figuren, drei bis vier kurze Aufgaben im Format der App) und Dialog.
{held} erklärt Lily den Springer; Ambrose schweigt dabei absichtlich („Lehre es ihr. Dann weißt du,
ob du es kannst.“). Belohnung: Karte **Gefahrenradar**. Zweck: erstes Erlebnis „Ich kann etwas
erklären“, ohne Ambrose. Etwa 6 Minuten.

**9. Sams Dame** · N begegnung `mapleFalls.samsDame` (vorhanden)
Ort `mapleFalls.clubraum` · Sam · Ink `maple-falls-clubraum.sam_klagt`. Ereignis: Aufgaben
(Runde `mapleFalls.todsuenden`, vier Todsünden, Kapitel 1, Abschnitt 1.2) und Revanche-Partie
`mapleFalls.samRevanche`. Sam klagt, dass seine Dame „immer gefangen wird“; {held} zeigt es ihm.
Wirkungen wie im Beispiel: Steckbriefzeile für Sam, Coach Delgado **analysiert** (Sam verrät:
„Der Coach guckt nur auf ihren eigenen Angriff. Immer.“), nach Sieg zweimal **Zweite Chance**.
Danach ist Sam Freund statt Rivale im Team. Etwa 20 Minuten.

**10. Jo auf der Halfpipe** · S `mapleFalls.skaterJo`
Ort `mapleFalls.park` · Jo. Ereignis: Stellungsduell (Entscheidung C1): Stellung aus Kapitel 1
mit leichtem Vorteil, gewonnen nach 10 bis 15 Zügen bei gehaltenem Vorteil oder Matt. Zielstärke
A − 100. Remis zählt als Sieg (Dokument 02, 2.7). Wiederholbar, bei Sieg Limo-Witz und Karte
Zweite Chance beim ersten Sieg. Etwa 8 Minuten.

**11. Clubkampf Maple Falls** · `akt1.clubnadelMapleFalls` · H `mapleFalls.clubkampf`
Ort `mapleFalls.clubraum` · Coach Delgado, Juno, Sam als Zuschauer. Ereignis: Partie gegen den
Clubchef (Zielstärke E + 220, Italienisch, Gegnerprofil vorhanden). Kartenwahl vor der Partie
(Deck aus höchstens drei Karten). Bei Niederlage Ambrose mit dem Kipppunkt und Wiedereinstieg
(Entscheidungen B1, B2). Belohnung: **Clubnadel Maple Falls** (Gold, Silber oder Bronze),
„Ambroses Notiz“ mit dem Schlüsselmoment (Dokument 02, 3.4), Platz im Team. Coach Delgado: „Viertes
Brett, du bist dran. Samstag spielen wir in Cedar Creek.“ Etwa 30 Minuten.

**12. Victor** · `akt1.victorTrifft`, danach `akt1.victorNiederlage` · H `mapleFalls.victor`
Ort `mapleFalls.clubraum` · Victor, Graham Hale, Coach Delgado, Juno ·
Ink `maple-falls-clubraum.victor`. Graham Hale stellt dem Schulamt im Clubraum das Pilotprojekt
vor; Victor wartet gelangweilt, sieht die Clubnadel und fordert {held} heraus („Zeig mal, was eine
Nadel hier wert ist.“). Ambrose hört den Namen Hale und verstummt mitten im Satz.
Ereignis: Partie gegen Victor (Zielstärke E + 500, menschlich; Profil `mapleFalls.victor`,
Begegnung `mapleFalls.victor`) nach Regelwerk R33: **Trainingsstellung** aus dem Spanier um Zug
12, {held} hat Schwarz und einen Springer weniger, Karten gesperrt, kein Wiedereinstieg, zählt
nicht für die App. Victor begründet die Stellung selbst (`maple-falls-clubraum.ink`, Knoten
`victor_wartet`): „Ich spiele nicht von vorn gegen Anfänger. Mein Trainer gibt mir Stellungen.“
Ambrose: „Diese Stellung ist verloren, ehrlich gesagt. Aber verlieren kann man auf viele Arten.“
Entscheidung des Haupt-Chats (08.11.2026, `ENTSCHEIDUNGEN.md`): R33 statt der früheren Fassung
dieser Szene (echte Partie aus der Grundstellung). Grund: Dokument 02, 2.7 will, dass {held} die
Niederlage nicht als unfair erlebt; die Stellung erklärt sie offen, und Victors Satz zeigt seinen
Trainingsalltag. Ein Trick ist das nicht, weil es vor der Partie gesagt wird.

- **Variante Niederlage** (der Normalfall): Victor: „Du hast in Zug zwölf verloren. Den Rest hast
  du nur nicht gemerkt.“ Er geht, ohne die Hand zu geben; Graham Hale ruft ihn weg. Juno: „Der war
  nicht nett. Aber er war gut.“ Szene `akt1.victorNiederlage`.
- **Variante Sieg oder Remis** (selten): Victor wird blass, rechnet laut nach, findet keinen Fehler
  bei sich und sagt: „Glück. Das passiert einmal.“ Der Vater fragt: „Victor? Wir fahren.“ Szene
  `akt1.victorUeberrascht`. Die Geschichte geht gleich weiter; der Satz „Ich will besser werden“
  heißt dann „Ich will das noch mal schaffen, ohne Glück“.

Danach auf dem Dachboden (Ink `maple-falls-dachboden.nach_victor`): {held} ist geknickt; Ambrose
zeigt die zwei Momente, dann fragt {held} nach dem Namen Hale. Ambrose: „Ein Name. Es gibt viele
Hales.“ Ziel im Tagebuch: „Ich will besser werden.“ Etwa 30 Minuten.

**13. Aufbruch** · `akt1.aufbruch`
Ort `mapleFalls.wohnzimmer`, dann `mapleFalls.park` · Mama, Juno. Ereignis: Dialog. Mama erlaubt
das Auswärtsspiel („Mit dem Coach im Schulbus? Gut. Brett nicht verlieren.“). An der
Bushaltestelle im Park (Auslöser `bushaltestelle`, Ink `maple-falls-park.bushaltestelle`) wartet
der Schulbus; „Einsteigen“ ruft `reise("cedarCreek.aussen", "bushaltestelle")` (Regelwerk R41).
Vorher sagt die Haltestelle nur: „Heute fährt er ohne dich.“ Etwa 3 Minuten.

### Cedar Creek

**14. Ankunft in Cedar Creek** · `akt1.ankunftCedarCreek`
Ort `cedarCreek.aussen` (Ankunft am Auslöser `bushaltestelle`) · Coach Delgado, Juno, Sam.
Ereignis: Dialog. Zurück nach Maple Falls geht es jederzeit mit dem Bus am Auslöser `busZurueck`
(Dialog, `reise` zum Park). Das Auswärtsspiel der
Kreisliga findet im Bibliotheksclub statt; der Coach sagt, die Clubchefin sei „eine Legende, die
niemand kennt“. Auf einem Plakat: „Perfect Move – Schach für die Zukunft. Bald auch in deiner
Stadt.“ Ambrose: „Ein Plakat, das droht. Wie reizend.“ Etwa 3 Minuten.

**15. Der Bibliotheksclub** · `akt1.bibliotheksclub` · H `cedarCreek.archiv1858`
Ort `cedarCreek.bibliothek` · Mrs. Okafor, Dex, Mae · Ink `cedar-creek-bibliothek.okafor`.
Ereignis: Dialog. Mrs. Okafor bemerkt das Brett im Rucksack und die eingebrannten Buchstaben
„A. W. 1857“ am Rand. Sie sagt den Namen Whitlock, bevor {held} ihn nennt: Er steht als Fußnote
in einem alten Schachkalender im Archiv. Sie bietet an, nach dem Clubkampf gemeinsam zu suchen,
oder gleich, wenn {held} beim Sortieren hilft (Szene 18). Etwa 5 Minuten.

**16. Aufgabenreihe Cedar Creek** · Runden `cedarCreek.reiheDex`, `cedarCreek.reiheMae`
Ort `cedarCreek.bibliothek` · Dex, Mae. Ereignis: Aufgaben, 12 bis 15, bestanden ab 70 Prozent.
Dex stellt Matt in eins, Mae Matt in zwei und benannte Mattbilder (Buch Kapitel 7, Abschnitt 7.4:
Erstickungs-, Grundreihen-, Anastasia-, Arabisches Matt; Übungen nach `03_Technische_Stellungnahme.md`,
Abschnitt 3, Zeile Cedar Creek). Ambrose dazu: „Mattbilder sind wie Gesichter. Wer eines kennt,
erkennt es in jeder Menge.“ Etwa 15 Minuten.

**17. Die Stellung auf dem Trockner** · N rätsel `cedarCreek.trockner`
Ort `cedarCreek.waschsalon` · Mr. Boateng · Ink `cedar-creek-waschsalon.boateng`. Ereignis:
Stellungsrätsel (Grundreihenmatt in zwei, Kapitel 7, Abschnitt 7.4). Gelöst: Boateng klebt eine neue
Stellung auf und sagt, die alte habe ihm ein Mädchen aus Lagos vor fünfzig Jahren gezeigt. Er meint
Mrs. Okafor; so erfährt {held}, dass sie früher Turniere gespielt hat. Belohnung: Steckbriefzeile
für Mrs. Okafor (Fehlerart oder Stil aus ihrem Profil, Entscheidung C7). Etwa 6 Minuten.

**18. Das Archiv** · N hilfe `cedarCreek.archivOrdnen`
Ort `cedarCreek.archiv` · Mrs. Okafor · Ink `cedar-creek-archiv.ordnen`. Ereignis: Dialog und ein
kleines Sortierspiel im Dialog (drei Wahlen: welcher Karton zu welchem Jahrzehnt). {held} hilft,
nasse Kartons nach einem Wasserschaden umzuräumen. Belohnung: Karte **Ambroses Flüstern**
(Konzeptsammlung: Erhalt über Nebenaufgabe) und der Zugang zum Karton „1850–1859“, der Szene 19
öffnet. Ohne diese Quest öffnet Mrs. Okafor den Karton nach dem Clubkampf. Etwa 6 Minuten.

**19. 1858** · `akt1.erzaehlung1858` · H `cedarCreek.archiv1858`
Ort `cedarCreek.archiv` · Ambrose, {held} (Mrs. Okafor ist nach oben gegangen) ·
Ink `cedar-creek-archiv.erzaehlung_1858`. Ereignis: Dialog, der längste von Akt 1 (höchstens
zwei Bildschirme am Stück, dann eine Wahl). In einer vergilbten Zeitung (erfundener Titel, etwa
„Crescent City Herald“) steht: „Mr. Hale, Ingenieur, schlägt Mr. Whitlock im Match, vier zu drei.
Mr. Whitlocks Opfer im letzten Spiel wird noch lange besprochen werden. Mr. Hale nannte es
‚bemerkenswert unnötig‘.“ Ambrose erzählt zum ersten Mal: das Match, das Opfer, das er nicht lassen
konnte, die Revanche und das Wort „Später“. Er erwähnt nicht, dass er auf der Reise zu Hale
gestorben ist, und nicht, wie Hale mit Vornamen hieß. {held} fragt: „Hale wie Victor?“ Ambrose:
„Hale wie viele.“ Wirkung: Szene gesetzt, Ambroses Vertrauen +1 (`ambroseVertrauen`). Etwa 8
Minuten.

**20. Erinnerung: New York, 1857** · `akt1.erinnerungNewYork` · N begegnung (Erinnerung)
`cedarCreek.erinnerungNewYork`
Ort `cedarCreek.archiv` · Ambrose. Ereignis: Zugerraten (Entscheidung C3) der Partie Paulsen gegen
Morphy, Erster Amerikanischer Schachkongress, New York 1857, `klassik-paulsen-morphy` aus
`inhalte/zusatzpartien/klassiker.json`, mit Schwarz, ab Zug 13 bis zum Ende, im vorhandenen Modus
„Zug erraten“. Auslöser: Im Karton liegt das Programmheft des Kongresses. Ambrose: „Ich stand in der
dritten Reihe. Dieser Junge opferte seine Dame, und ich vergaß zu atmen.“ Der Höhepunkt ist
Morphys Damenopfer im 17. Zug; Ambrose hält vorher an: „Jetzt. Was hätte er gespielt? Was hättest
du gespielt?“ Zweck: die romantische Schachzeit fühlbar machen, Ambroses Bewunderung zeigen und
die erste Reibung säen („Siehst du? Das ist Schach. Nicht dieses Zählen.“ – {held}: „Gestern
hast du gesagt, Zählen ist alles.“). Belohnung: **Partiefragment 1**. Wahl der Partie: Sie ist aus
Ambroses eigener Zeit und Gegend, er kann sie als Augenzeuge erzählen, und das Damenopfer passt zu
den Mattbildern von Club 2. Etwa 12 Minuten.

**21. Victor in Cedar Creek** · `akt1.victorCedarCreek`
Ort `cedarCreek.aussen` · Victor. Ereignis: Dialog, keine Partie. Victor sitzt allein an der
Bushaltestelle mit einem Tablet von Perfect Move und spielt gegen das Programm. Er sieht nicht auf.
{held} kann fragen: „Macht dir das eigentlich Spaß?“ Victor schweigt, dann: „Das ist keine Frage,
die man beim Training stellt.“ Ambrose ist auffällig still. Optional, aber mit Tagebucheintrag; der
erste Riss in Victors Fassade. Etwa 3 Minuten.

**22. Sternennacht** · N begegnung `cedarCreek.sternennacht`
Ort `cedarCreek.aussen` (Steg, Abend) · Mae, Dex, Juno, Mrs. Okafor · Ink `cedar-creek-aussen.sterne`.
Ereignis: Dialog. Mae lädt alle zum Sternschnuppenschauen am Steg ein; Mrs. Okafor passt auf und
bleibt bis nach Mitternacht, weil es so schön ist. {held} kann ablehnen. Wirkung bei Teilnahme:
Mrs. Okafor ist am nächsten Morgen **abgelenkt** (`setzeZustand`, Faktor 1,3, Grund
`zustand.schlechtGeschlafen`), vor der Partie sichtbar per Dialog und Symbol (Konzeptsammlung,
Gegner schwächen über die Story). Wichtig: {held} plant das nicht; es ist ein schöner Abend, der
eine Folge hat. Nach der Partie Mrs. Okafor: „Revanche, wenn ich ausgeschlafen bin!“ Etwa 5 Minuten.

**23. Rosa am Steg** · S `cedarCreek.rosa`
Ort `cedarCreek.aussen` · Rosa. Ereignis: Stellungsduell aus Abbildung 1.41 (Buch Kapitel 1,
Abschnitt 1.6, Goldene Angriffsregel: Königsangriff, Weiß am Zug etwa +1,1), 10 Züge, Mindestvorteil
1,0, Zielstärke A − 50 (Begegnung `cedarCreek.rosaDuell`). Nicht mehr „Mattbild aus 7.4“: Alle
Stellungen dort sind erzwungene Matts, und Regelwerk R13 verlangt einen Vorteil von +0,8 bis +2,5
ohne Matt in drei oder weniger; 1.41 ist die nächste passende Stellung mit Königsangriff. Rosa
dazu: „Ruhig, ruhig. Der König läuft nicht weg, wenn du zappelst.“ Etwa 8 Minuten.

**24. Clubkampf Cedar Creek** · `akt1.clubnadelCedarCreek` · H `cedarCreek.clubkampf`
Ort `cedarCreek.bibliothek` · Mrs. Okafor, Team Maple Falls als Zuschauer. Ereignis: Partie gegen
den Clubchef, Zielstärke E + 280, Stil Fallensteller (Grundreihe, Mattbilder), Gegnerprofil im
Folgeauftrag. Wie Szene 11: Kartenwahl, Kipppunkt, Clubnadel, Ambroses Notiz. Zusätzliche
Belohnung beim ersten Sieg: Karte **Mentor-Zug** mit Ambroses erstem Zögern („Lass mich. Nur dieses
eine Mal.“, Spruch aus den Spieltexten). Dazu gewinnt das Team das Auswärtsspiel; der Coach pfeift.
Etwa 30 Minuten.

**25. Ende von Akt 1** · `akt1.ende`
Ort `cedarCreek.aussen` (Steg, Abenddämmerung), dann Rückfahrt · Ambrose, {held}, kurz Juno ·
Ink `cedar-creek-aussen.ende_akt1`. Ereignis: Dialog. Am Steg fragt {held}, was Ambrose eigentlich
will. Ambrose zum ersten Mal offen: „Eine Partie ohne Makel. Eine, über die man in hundert Jahren
noch spricht. Ich hatte sie fast. Dann sagte jemand ‚Später‘.“ {held}: „Dann spielen wir sie eben
jetzt.“ Ambrose lacht, zum ersten Mal ohne Spott. Im Bus liest Juno aus dem Tagebuch vor: zwei
Clubnadeln. Auf Junos Handy eine Nachricht: Der Schachclub im Park von Riverton wird „neu
aufgestellt“, mit Perfect Move. Übergang zu Akt 2. Etwa 4 Minuten.

### Zeitrechnung

| Teil                                                      | Minuten                                                   |
| --------------------------------------------------------- | --------------------------------------------------------- |
| Dialoge und Laufen (Szenen 1, 2, 4, 5, 13–15, 19, 21, 25) | etwa 50                                                   |
| Partien Hauptstory (3, 11, 12, 24)                        | etwa 110                                                  |
| Aufgabenreihen (6, 16)                                    | etwa 30                                                   |
| Nebenquests und Erinnerung (7–9, 17, 18, 20, 22)          | etwa 65                                                   |
| Straßengegner (10, 23)                                    | etwa 15                                                   |
| **Summe**                                                 | **etwa 270, also 3,5 bis 4,5 Stunden mit Wiederholungen** |

Das liegt am oberen Rand der Vorgabe. Wenn der Spielzeitzähler (Entscheidung C5) mehr zeigt,
entfallen zuerst Szene 21 (optional) und Szene 23 (Straße), dann wird die Erinnerung kürzer
(ab Zug 15).

### Verteilung der Nebenquests

| Stadt       | rätsel                       | hilfe                      | begegnung                                                  |
| ----------- | ---------------------------- | -------------------------- | ---------------------------------------------------------- |
| Maple Falls | `mapleFalls.verlorenesBrett` | `mapleFalls.lilysSpringer` | `mapleFalls.samsDame` (analysiert)                         |
| Cedar Creek | `cedarCreek.trockner`        | `cedarCreek.archivOrdnen`  | `cedarCreek.sternennacht` (abgelenkt), Erinnerung New York |

Damit kommen beide Zustände aus dem Regelwerk in Akt 1 einmal vor: „analysiert“ in Maple Falls,
„abgelenkt“ in Cedar Creek.

### Hilfskarten in Akt 1 (Vorschlag für das Regelwerk)

| Karte             | Wo                                 | Warum hier                                                                                        |
| ----------------- | ---------------------------------- | ------------------------------------------------------------------------------------------------- |
| Fingerzeig        | Szene 2, Ambrose                   | erste Karte, im Ink-Beispiel schon so                                                             |
| Gefahrenradar     | Szene 8, Lilys Springer            | passt zur Frage „Was hängt?“                                                                      |
| Zweite Chance     | Szene 9 (zwei) und Szene 10 (eine) | häufige leichte Karte, macht Anfänger mutiger                                                     |
| Ambroses Flüstern | Szene 18, Archiv                   | erste mittlere Karte, als Dank für Hilfe                                                          |
| Mentor-Zug        | Szene 24, Clubsieg Cedar Creek     | Clubsieg nach Konzeptsammlung; nicht schon in Club 1, damit Ambrose ihn als Vertrauensbeweis gibt |

## 5. Dialog-Stilregeln

### 5.1 Länge und Lesbarkeit

- Höchstens **zwei Sätze je Zeile** und etwa 140 Zeichen; eine Zeile ist ein Bildschirm im
  Dialogfenster.
- Höchstens **sechs Zeilen am Stück**, dann eine Wahl, eine Pause (`#pause`) oder ein Ereignis.
  Einzige Ausnahme: Szene 19 (zwei Blöcke zu je sechs Zeilen).
- **Lesealter 10:** Hauptsätze, höchstens ein Nebensatz; keine Fremdwörter außer Schachbegriffen
  wie im Buch (Fachbegriffe ohne Umlaute nur im Code, im Text normal geschrieben).
- Schachbegriffe beim ersten Auftreten kurz erklären, im Satz und nicht als Fußnote: „Das ist eine
  Gabel: ein Zug, zwei Angriffe.“
- **Keine Ironie, die Kinder nicht verstehen.** Erlaubt sind Übertreibung, Wortwitz und trockener
  Humor, der auch wörtlich genommen funktioniert („Ich bin tot. Streng ist das Mindeste, was ich
  noch kann.“). Verboten: Sarkasmus, der das Gegenteil meint („Toll gemacht.“ nach einem Fehler).
- Kein Erwachsener demütigt ein Kind (Dokument 02, 2.3). Victor darf kühl sein, weil er selbst ein
  Kind ist und später einsieht, wie er war.
- Lob konkret, nicht allgemein: nicht „Super!“, sondern „Dein Turm stand auf der offenen Linie. Das
  war es.“
- Buchverweise nur als Kapitel und Abschnitt, höchstens einer je Gespräch, nie als Pflicht: „Wenn
  du mehr willst: Kapitel 7, Abschnitt 7.4.“ Keine Buchzitate über einen kurzen Satz hinaus.
- Keine Namen realer Produkte, Spiele, Serien oder lebender Spieler. Historische Meister vor 1900
  (Morphy, Paulsen, Anderssen) dürfen im Hintergrund vorkommen, wenn die Partie in
  `klassiker.json` steht.

### 5.2 Geschlechtsneutral für {held}

- {held} wird mit **du** oder dem **Namen** angesprochen. Über {held} in der dritten Person wird
  mit dem Namen gesprochen („{held} hat gewonnen“), nie mit er oder sie.
- Keine Substantive mit Geschlecht für {held}: nicht „der Neue“, „die Neue“, „Herausforderer“,
  „Gewinnerin“. Stattdessen: „das Kind aus dem Whitlock-Haus“, „neu hier“, „unser viertes Brett“,
  „Lehrling“ (Ambrose), „Neuzugang“, „Gast“.
- Adjektive nur prädikativ, da sind sie im Deutschen ohne Endung: „Du bist mutig.“ Nicht: „Du
  mutiger …“.
- Antwortwahlen in der ersten Person brauchen kein Geschlecht und sind deshalb bevorzugt.
- Mama sagt Kosenamen nur in neutraler Form („Hey, du“, „Spatz“ geht, „mein Großer“ nicht).

### 5.3 Ambroses altmodische Sprache in fünf Regeln

1. **Vollständige, gebaute Sätze.** Keine Jugendsprache, keine Abkürzungen, keine Füllwörter wie
   „halt“ oder „voll“. Beispiel: „Du hast den Läufer verloren, weil du nicht hingesehen hast.“
2. **Ein altes Wort je Zeile, nicht mehr**, und nur eines, das ein Kind aus dem Satz versteht:
   gewiss, fürwahr, Herrje, Donnerwetter, alsbald, sogleich, Gentleman. Beispiel: „Herrje. Du
   rochierst in einen Angriff hinein.“
3. **Bilder aus seiner Zeit** statt moderner Vergleiche: Dampfer, Kutschen, Kerzen, der
   Mississippi, Kaffeehäuser, Briefe. Beispiel: „Dein König steht da wie ein Dampfer im Nebel.
   Ohne Lotsen.“
4. **Moderne Dinge umschreibt er**, statt sie zu benennen, und staunt dabei: Handy =
   „Taschenspiegel mit Stimmen“, Engine = „Rechenmaschine“, Internet = „Telegraf ohne Draht“.
   Beispiel: „Dieser Spiegel in deiner Tasche spielt Schach? Und gewinnt? Wie beleidigend.“
5. **Schach als Kunst und Ehre**: Er spricht von schönen Zügen, mutigen Opfern und ehrlichen
   Partien, nie von Zahlen. Beispiel: „Ein Sieg ohne Schönheit ist ein Abendessen ohne Salz.
   Man wird satt, aber man erinnert sich nicht.“

Dazu: Ambroses Humor über seinen Tod bleibt freundlich und kurz, nie gruselig, nie mit Details zum
Sterben. Über 1866 spricht er in Akt 1 gar nicht.

### 5.4 Sprechweisen der anderen auf einen Blick

| Figur         | Erkennungszeichen                                                       |
| ------------- | ----------------------------------------------------------------------- |
| Mama          | kurz, praktisch, Alltagsfragen, müder Humor                             |
| Victor        | kühl, Zahlen und Fachwörter, nie Beleidigung, halbe Sätze bei Müdigkeit |
| Coach Delgado | Sportwörter, laut, konkretes Lob, `#klang:pfiff`                        |
| Sam           | Ausrufe, Spitznamen für Figuren, gibt Fehler spät zu                    |
| Juno          | Fragen, kleine Wortspiele, Figuren wie Haustiere, Tagebuch              |
| Mrs. Okafor   | Gegenfragen, Sprichwörter mit Erklärung, „Geduld“                       |

### 5.5 Technik: Tags und externe Funktionen

Wie in `inhalte/abenteuer/README.md` und im Ink-Beispiel, hier nur die Regeln für Autoren:

- Jede Zeile trägt `#sprecher:<kennung>` (`ambrose`, `mutter`, `victor`, `coachDelgado`, `sam`,
  `juno`, `okafor`, `erzaehler`, Nebenfiguren mit ihrer Kennung ohne Ort). Erzähltext hat
  `#sprecher:erzaehler`.
- `#stimmung:<variante>` nur, wenn sich das Porträt ändert. Vorrat in Akt 1: Ambrose `streng`,
  `stolz`, `lacht`, `bitter`, `traurig`; Victor `kalt`, `muede`; sonst `froh`, `ernst`.
- `#klang:<name>` sparsam, höchstens einmal je Gespräch: `knarren`, `karte`, `pfiff`, `bus`,
  `waschmaschine`.
- `#pause` vor einer Enthüllung oder nach einem Schlag, höchstens einmal je sechs Zeilen.
- Externe Funktionen nur am Ende eines Knotens oder direkt nach der auslösenden Zeile, nie mitten
  in einer Erzählung: `gibKarte(kennung)`, `setzeSzene(kennung)`, `beginnePartie(begegnung)`,
  `beginneAufgaben(runde)`, `setzeZustand(gegner, faktor, grund)`,
  `schalteSteckbrief(gegner, zeile)`.
- Globale Variablen für Akt 1: `held`, `ambroseVertrauen` (vorhanden), `brettBeruehrt`
  (vorhanden), dazu `kenntHale` (nach Szene 12), `sternennacht` (Teilnahme in Szene 22),
  `victorBesiegt` (seltene Variante in Szene 12).
- Jede Wahl führt weiter; keine Sackgassen, aus denen man nur durch Neustart kommt. Wer „Später“
  wählt, kommt mit einem Satz zurück an denselben Ort.

## 6. Offene Fragen an den Autor

Zu jeder Frage meine Empfehlung; nach Regel 9 gilt die Empfehlung, bis du widersprichst.

1. **Todesjahr und Alter von Ambrose.** Die Konzeptsammlung sagt „um 1860“, das Ink-Beispiel
   „hundertsechzig Jahre gewartet“ (also 1866) und „New Orleans, 1858“. Empfehlung: geboren 1831,
   Match 1858, gestorben 1866, wie in der Zeitlinie. Damit passen alle vorhandenen Sätze.
2. **Wie offen über die schweren Jahre 1860 bis 1865 sprechen?** Der Bürgerkrieg fällt genau in
   Ambroses letzte Jahre, und New Orleans war mittendrin. Empfehlung: nur „schwere Jahre, in denen
   niemand Schach spielte“, kein Krieg, keine Sklaverei als Nebensatz. Ein Kinderspiel kann das
   Thema nicht angemessen erzählen, und ein falscher Ton wäre schlimmer als eine Leerstelle. Wenn
   du das anders siehst, braucht es eine eigene, sorgfältige Szene in Akt 3 oder 4.
3. **„Urenkel“ stimmt rechnerisch nicht.** Zwischen Josiah Hale (geboren um 1825) und Victor
   (geboren 2011) liegen etwa fünf Generationen. Empfehlung: im Spiel „Nachfahre“ sagen; Ambrose
   darf in Akt 4 einmal die „Ur“ zählen und aufgeben („Ur-ur-ur … Herrje. Ein Hale eben.“).
4. **Vorname von Victors Vorfahr.** Empfehlung: Josiah Hale, Brückenbauer. In Akt 1 nennt ihn
   niemand beim Vornamen; der Name fällt erst in Akt 4.
5. **Ambroses Partie in Szene 3 als Einstufung.** Entscheidung A5 sagt: Leser ohne Wertung
   bekommen die Schätzung aus der ersten Story-Partie. Empfehlung: Ambrose spielt mit fester
   mittlerer Stärke (etwa 900) und hoher Fehlerhäufigkeit, damit Anfänger nicht in 15 Zügen
   untergehen, und die Schätzung kommt aus den Zügen des Lesers (Genauigkeit), nicht aus dem
   Ergebnis. Das berührt die Architektur und ist deshalb auch als Vorschlag im Bericht.
6. **Erzwungene Niederlage gegen Victor.** Empfehlung: echte Partie mit zwei Dialogvarianten
   (Szene 12), keine gestellte Verluststellung. Begründung in der Szene.
7. **Beste Freundin oder bester Freund?** Empfehlung: Juno, beste Freundin, weil Sam schon ein
   Junge im Team ist. Ein Tausch kostet nur Namen und Pronomen.
8. **Mentor-Zug schon in Akt 1?** Empfehlung: ja, als Belohnung für Club 2, aber erst dort, damit
   er sich wie ein Vertrauensbeweis anfühlt. In Akt 3 wird er gesperrt (Dokument 02, 2.7).
9. **Die Mutter als frühere Turnierspielerin** (Dokument 02, 3.2) wird in Akt 1 nur angedeutet
   (Szene 4). Empfehlung: so lassen; die Auflösung gehört nach Ironwood.
10. **Zeitbedarf am oberen Rand.** Die Szenenliste rechnet mit 3,5 bis 4,5 Stunden. Empfehlung:
    so bauen und mit dem Spielzeitzähler nachmessen; Kürzungen stehen unter „Zeitrechnung“.

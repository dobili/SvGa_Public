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
| 1831     | Ambrose Whitlock wird in Port Delacroix geboren, Sohn eines Klavierbauers.                                                                                     |
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

**Hintergrund.** Geboren 1831 in Port Delacroix (Hafenstadt im Delta, eine Tagesreise flussab von New Orleans), gestorben 1866 auf der Reise zu seinem Rivalen.
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

**10a. Limo für Jo** · N begegnung `mapleFalls.limo` · Gegenstand Limo (11, I5)
Ort `mapleFalls.park` (Halfpipe und Kiosk von Mr. Patel) · Jo, Mr. Patel, Ambrose. Auslöser:
{held} verliert ein Duell gegen Jo. Jo grinst: „Fünf Minuten, eine Partie. Wer verliert, holt Limo.“
Ereignis: Laden und Dialog. Am Kiosk kostet eine Limo 5 Münzen; Mr. Patel: „Für Jo? Die mit dem
zerkratzten Brett? Die trinkt nur Zitrone.“ {held} bringt die Limo zur Halfpipe. Jo trinkt, setzt
sich auf die Kante und erzählt mehr als sonst: „Ich greif immer an. Rückwärts zieh ich nicht gern.
Ist so.“ Ambrose: „Eine Limonade für eine Schwäche. Ein guter Handel.“ Belohnung: Steckbriefzeile
für Jo (sie zieht ungern zurück) und beim nächsten Duell Jos Zustand „analysiert“. Wer Jo schon
geschlagen hat, kann die Limo trotzdem bringen: dann nur die Steckbriefzeile und Jos Satz
„Revanche, wenn ich satt bin.“ Etwa 3 Minuten.

Quest-Schritte (Format wie `quests.json`):

```json
{
  "kennung": "mapleFalls.limo",
  "titel": "quest.limo.titel",
  "typ": "begegnung",
  "ort": "mapleFalls",
  "haupt": false,
  "start": {
    "art": "partie",
    "begegnung": "mapleFalls.skaterJo",
    "ausgang": ["niederlage"]
  },
  "schritte": [
    {
      "text": "quest.limo.schritt1",
      "ereignis": { "art": "dialog", "knoten": "maple-falls-park.jo_limo" }
    },
    {
      "text": "quest.limo.schritt2",
      "ereignis": { "art": "dialog", "knoten": "maple-falls-park.patel_limo" },
      "wirkungen": [{ "art": "gegenstand", "gegenstand": "limo" }]
    },
    {
      "text": "quest.limo.schritt3",
      "ereignis": {
        "art": "dialog",
        "knoten": "maple-falls-park.jo_limo_gebracht"
      },
      "wirkungen": [
        { "art": "steckbrief", "gegner": "mapleFalls.skaterJo", "zeile": 0 },
        {
          "art": "zustand",
          "gegner": "mapleFalls.skaterJo",
          "analysiert": true
        }
      ]
    }
  ]
}
```

Texte: „Limo für Jo“; „Hör dir an, was Jo will.“; „Kauf am Kiosk eine Limo (5 Münzen).“; „Bring
Jo die Limo.“ Daten dazu: Jos Profil braucht eine Steckbriefzeile (`{ "art": "fleck", "wert":
"rueckzug" }`, passt zu „rückwärts zieh ich nicht gern“), die Limo eine Ware am Kiosk (5) und eine
Wirkung, die den Gegenstand beim Übergeben verbraucht (Bericht). Den Kauf öffnet der Dialog mit
`oeffneLaden("mapleFalls.kiosk")`; die Quest wartet auf den Knoten danach.

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
dazu: „Ruhig, ruhig. Der König läuft nicht weg, wenn du zappelst.“ Am Steg liegt im Schilf ein
verrosteter Schlüssel (Fund, übergreifende Quest E4, Auflösung in Akt 2, Szene 33); Rosa: „Den
hat ein Angler verloren. Vor zwei Jahren schon.“ Etwa 8 Minuten.

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

### Hilfskarten und Gegenstände in Akt 1

Stand nach den Spieldaten (`quests.json`, `laeden.json`) und dem achten Auftrag; Preise und
Münzen in `11_Karten_und_Gegenstaende.md`, Abschnitt 7.

| Karte oder Gegenstand | Wo                                                                                        | Warum hier                                            |
| --------------------- | ----------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| Fingerzeig            | Szene 2, Ambrose                                                                          | erste Karte, im Ink-Beispiel schon so                 |
| Gefahrenradar         | Clubnadel Maple Falls (Quest `mapleFalls.viertesBrett`)                                   | passt zur Frage „Was hängt?“                          |
| Mentor-Zug            | erste Clubnadel Maple Falls und Cedar Creek (R27)                                         | erste Nadel je Club                                   |
| Zweite Chance         | Szene 9 (zwei), Straßensiege, erste Reihe Cedar Creek                                     | häufige leichte Karte, macht Anfänger mutiger         |
| Ambroses Flüstern     | Szenen 7, 8, 17, 18 (Rätsel und Hilfe, R27)                                               | erste mittlere Karte, als Dank für Hilfe              |
| Bauernvorgabe         | Szene 20, Erinnerung New York                                                             | erste Erinnerung der Staffel                          |
| Limo                  | Szene 10a, Kiosk Maple Falls (5 Münzen)                                                   | erste kleine Geschichte mit Gegenstand und Steckbrief |
| Laden Maple Falls     | Kiosk Mr. Patel: Zweite Chance, Gefahrenradar, Flüstern, Röntgenblick, Ablenkung, Fahrrad | erster Laden; das Fahrrad dort ist zu früh (11, 7.4)  |

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

---

# Teil 2: Akt 2 (Staffel 1: Riverton und Ironwood)

Stand: 08.11.2026, Helfer-Chat mittel-2. Grundlage zusätzlich zu Teil 1: `06_Regelwerk.md`
(Zielstärken R4, Karten R27, Formate R12 bis R14, Uhr R16), `07_Aufgabenzuordnung.md` (Clubs 3
und 4) und `08_Wege_und_Entdeckungen.md` (Wege W1 bis W6, Funde E1 bis E5, Zeit Z1 bis Z6,
Flashbacks F1 bis F3, Münzen und Läden G1 bis G6). Es gelten die Stilregeln aus Abschnitt 5 von
Teil 1 unverändert. Alle Namen sind Arbeitsnamen bis zum Markencheck.

## 7. Der Kern von Akt 2 in sechs Sätzen

1. {held} geht zu Fuß nach Riverton und findet den Parkclub halb verkauft: Perfect Move hat die
   Wiese vor dem Parkpavillon mit Bildschirmtischen vollgestellt, und der Pavillon, in dem Slicks
   Club seit Jahrzehnten spielt, muss bis Sonntag geräumt sein.
2. Der letzte Clubkampf im Pavillon bringt die dritte Clubnadel; am nächsten Tag stehen auch dort
   Bildschirmtische. Zum ersten Mal sieht {held}, was der Konzern tut.
3. Ambrose erinnert sich an London 1851 und an das Kaffeehaus, in dem er die schönste Partie seines
   Lebens gesehen hat (Flashback); die Rechenmaschine des Konzerns findet er zugleich empörend und
   faszinierend.
4. Mama verbietet Ironwood, ohne zu sagen, warum; {held} findet heraus, dass sie dort als
   Jugendliche Turniere gespielt und das letzte Finale verloren hat.
5. Im Stahlwerker-Club von Big Joe spielt Mama zum ersten Mal seit fünfundzwanzig Jahren eine
   Partie, gegen {held}, und fährt danach mit zu den Turnieren.
6. Kaum hat {held} die vierte Clubnadel, kauft Perfect Move den Club von Ironwood; Victor, der beim
   Kauf dabei sein musste, lädt {held} nach Silicon Bay ein und fragt leise, ob das richtig ist.

## 8. Zeitlinie, Ergänzung für Akt 2

| Jahr | Ereignis                                                                                                                                                                                              |
| ---- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1851 | Der zwanzigjährige Ambrose begleitet seinen Vater auf einer Reise nach London (Klavierholz kaufen). In einem Kaffeehaus am Strand sieht er die „Unsterbliche Partie“ von Anderssen gegen Kieseritzky. |
| 1858 | Nach der Niederlage gegen Hale liest Ambrose in der Zeitung, wie Morphy in London Bird schlägt, und spielt die Partie nachts nach (Erinnerung in Ironwood).                                           |
| 1866 | Ein Brief von Hale an Ambrose wird nie zugestellt: Er bleibt im Postamt der Bahnstation Ironwood liegen (übergreifender Fund, Auflösung in Akt 3).                                                    |
| 2001 | Laura (Mama), 17, verliert in Ironwood das Finale der Jugendmeisterschaft des Bundesstaats nach einem übersehenen Spieß und hört auf zu spielen. Big Joe war damals ihr Trainer.                      |
| 2026 | Herbst: Perfect Move kauft den Parkclub von Riverton und danach den Stahlwerker-Club von Ironwood.                                                                                                    |

Entscheidung: Der nie zugestellte Brief verbindet Akt 2 mit Akt 3 (Versöhnung in Desert Springs):
Hale hat Ambrose nicht vergessen. Sein Inhalt wird erst in Akt 3 gelesen (Abschnitt 11.3).

## 9. Figuren in Akt 2

### 9.1 Weiterentwicklung der Hauptfiguren

**Ambrose.** Neu in Akt 2 ist die Versuchung (Konzeptsammlung): Die Bildschirmtische in Riverton
spielen fehlerlos. Ambrose ist empört („Eine Rechenmaschine, die nie zweifelt, ist kein Spieler.“)
und schaut doch immer wieder hin. Nach dem Flashback sagt er zum ersten Mal: „Was wäre, wenn sie
die Partie spielen könnte, die ich nie spielte?“ {held} merkt es; Juno auch. Das bereitet Akt 3
vor (er läuft fast zur Maschine über). Sprechweise unverändert; neue Stimmung `fern` (wenn er auf
die Tische schaut).

**Mama (Laura).** Ihr Geheimnis wird in Ironwood aufgelöst (Dokument 02, 3.2). Sie war mit 17 eine
der besten Jugendspielerinnen des Bundesstaats, Big Joe war ihr Trainer im Stahlwerker-Club, und
sie verlor das Finale mit einem übersehenen Spieß. Danach hat sie nie wieder eine Figur berührt.
Ihr Verbot ist keine Strafe, sondern Angst. Neue Beispielsätze:

- „Nicht Ironwood. Frag nicht, bitte. Nicht heute.“
- „Ich hab den Läufer nicht gesehen. Fünfundzwanzig Jahre, und ich sehe ihn jede Nacht.“
- „Gut. Eine Partie. Aber wenn ich gewinne, räumst du die Spülmaschine aus.“

**Victor.** In Akt 2 zweimal, ohne Partie: in Riverton bei der Eröffnung der Bildschirmtische
(neben Nova, als Gesicht der Jugendmannschaft des Konzerns) und in Ironwood beim Kauf des Clubs.
Der Riss wird größer: In Riverton verteidigt er die Tische mit den Sätzen seines Vaters, in
Ironwood sieht er Big Joes Gesicht und bricht einen Satz ab. Am Ende lädt er {held} nach Silicon
Bay ein. Neuer Beispielsatz: „Sie sagen, es ist effizienter. … Effizienter für wen, hab ich nicht
gefragt.“

**Juno.** Begleitet {held} auf beiden Wegen, führt das Tagebuch weiter und findet das Zeitungsfoto
von Mama (Szene 39). Neu: Sie wird beim Laufen mutiger und fordert selbst Straßengegner heraus
(und verliert fröhlich).

### 9.2 Neue Figuren Riverton

**Slick** (Clubchef 3). Marcus „Slick“ Bellamy, Mitte zwanzig, er. Fahrradkurier, spielt seit
seinem zwölften Jahr im Pavillon des Riverside-Parks, Blitzpartien um Limonade, und wohnt in einem
Wohnwagen am Fluss (Trophäen aus Dosen). Schnell,
freundlich, großmäulig, mit einem Herzen für die Kinder im Park. Hat den alten Parkclub von seinem
Lehrer übernommen, der dieses Jahr gestorben ist; der Stadtrat hat die Tische an Perfect Move
verpachtet, der Pavillon soll ein „Trainingszentrum“ werden. Stil: Angreifer und Taktiker, sieht Gabeln sofort. Schwäche: spielt auch dann
schnell, wenn er nachdenken müsste, und übersieht stille Drohungen (Fehlerart `drohungIgnoriert`
hoch, `schlagreflex` hoch). Sprechweise: schnell, Rhythmus, Wortspiele mit Gabeln und Pferden.

- „Zwei Angriffe, ein Zug. Das nennt man Gabel, und ich esse damit.“
- „Ich denk nicht lang. Lang denken die Bildschirme.“
- „Das hier ist der letzte Tisch mit echten Figuren. Wenn du verlierst, verlierst du gegen Riverton.“

Zielstärke E + 340 (Club 3, R4). Eröffnung: Schottisch und Evans-Gambit (schnelle offene Spiele).

**Tamsin** (Clubmitglied). Tamsin Ortega, 12, sie. Spielt nur Blitz, zählt laut die Sekunden mit
und ist fest davon überzeugt, dass man jede Partie in fünf Minuten gewinnen kann. Stellt die
Aufgabenreihe zu Springergabeln. Beispiel: „Drei, zwei, eins, Gabel! Siehst du? Nicht nachdenken,
gucken.“

**Ray** (Clubmitglied). Raymond Jessup, Anfang siebzig, er. Ehemaliger Busfahrer, kennt jeden
Doppelangriff aus vierzig Jahren Parkschach und erklärt sie mit Busfahrplänen. Stellt die
Aufgabenreihe zu Doppelangriffen und Hinlenkung. Beispiel: „Zwei Haltestellen, ein Bus. Der Gegner
kann nur an einer aussteigen.“

**Mr. Harlan** (Straßengegner). Ein pensionierter Uhrmacher, Ende sechzig, er, sitzt mit
Lupenbrille auf der Bank unter der großen Uhr in der Bahnhofshalle (er zieht sie jeden Morgen auf)
und denkt über jeden Zug zehn Minuten nach. Sehr genau,
sehr langsam. Rolle: die Blitz-Szene (Szene 31). Zielstärke A ± 0. Beispiel: „Eile ist der Feind
der Feder. Und der Unruh.“

**Nova** (Nebenfigur, Gesicht des Konzerns). Nova Sinclair, 16, sie, Highschool-Champion mit
Werbevertrag bei Perfect Move (Dokument 02, 3.2). Glänzt bei der Eröffnung der Bildschirmtische,
lächelt in jede Kamera und wirkt einen Moment lang erschöpft, als die Kameras aus sind. In Akt 2
nur dieser Auftritt; ihr Geheimnis (sie wurde zum Schummeln gezwungen) kommt in Akt 3. Beispiel:
„Mit Perfect Move trainiert jeder wie ein Champion! … Kann ich jetzt kurz sitzen?“

**Pops** (Laden). Theodore „Pops“ Banks, Inhaber des Zeitungsstands in der Bahnhofshalle, er, Anfang sechzig. Verkauft
Zeitungen, Limo und seit dreißig Jahren Taschenschachspiele; kennt jeden im Park. Beispiel: „Ein
Kiosk ist eine Bibliothek, die man essen kann.“

**Mrs. Albescu** (Nebenfigur). Ileana Albescu, fünfzig, sie, hatte die Fahrradwerkstatt hinter dem
Park, die seit dem Frühjahr geschlossen ist. Der Schuppen dahinter ist verschlossen, der Schlüssel
verloren. Rolle: übergreifende Quest „Der verrostete Schlüssel“ (E4, Szene 33).

### 9.3 Neue Figuren Ironwood

**Big Joe** (Clubchef 4). Joseph „Big Joe“ Kowalski, Ende fünfzig, er. Kranführer im Stahlwerk,
leitet seit dreißig Jahren den Werksclub in der Kantine (sein Brett ist aus Stahl, selbst
geschweißt), laut, herzlich, bärenstark und sanft mit
Figuren. War Mamas Trainer und hat sich nie verziehen, dass er sie nach dem verlorenen Finale nicht
zurückgeholt hat. Stil: Positionsspieler, der Figuren festnagelt (liebt Fesselungen). Schwäche:
übersieht Spieße auf der eigenen Grundreihe, besonders müde (Fehlerart `taktikUebersehen` hoch,
blinder Fleck `roentgen`). Sprechweise: Werkhallen-Bilder, viele Ausrufe, nennt alle „Kumpel“
(auch {held}: geschlechtsneutral).

- „Eine Fesselung ist wie ein Kranhaken: Was dranhängt, kann nicht weg.“
- „Kumpel, du spielst wie jemand, den ich mal kannte.“
- „Revanche, wenn ich ausgeschlafen bin!“ (nach Szene 44, Konzeptsammlung)

Zielstärke E + 400 (Club 4, R4). Eröffnung: Damengambit und Londoner System (feste Aufbauten).

**Hank** (Clubmitglied). Hank Morrow, Mitte vierzig, er, Schichtarbeiter, wortkarg. Stellt die
Aufgabenreihe zu Fesselungen. Beispiel: „Gefesselt. Nicht bewegen. Wie ich nach der Nachtschicht.“

**Priya** (Clubmitglied). Priya Raman, 19, sie, Werkstudentin im Stahlwerk, will Brücken bauen
und liebt Spieße, weil sie „wie eine Statik-Rechnung“ sind. Stellt die Aufgabenreihe zu Spießen und
Scheinbarem Schutz. Beispiel: „Erst das Wertvolle angreifen, dann das dahinter nehmen. Ingenieurwesen.“
Hinweis: Priyas Wunsch, Brücken zu bauen, ist ein leiser Bezug auf den „Ingenieur“ Hale, ohne dass
sie davon weiß.

**Gus** (Straßengegner). Gus Petrakis, Rangierer am Güterbahnhof, sechzig, er. Spielt in der
Pause auf einer umgedrehten Kabeltrommel, immer mit Uhr, weil die Pause genau fünfzehn Minuten
dauert. Stellungsduell mit Uhr (R13, W4). Zielstärke A − 50. Beispiel: „Fünfzehn Minuten Pause.
Zehn für dich, fünf für mein Sandwich.“

**Edna** (Laden). Edna Price, Eisenwarenhändlerin, siebzig, sie. Verkauft durch das Fenster
ihres Ladens an der Hauptstraße Schrauben, Laternen und seit Neuestem Fahrradteile; erklärt alles mit „Das hält“. Beispiel: „Kauf das Gute. Das Billige
kaufst du zweimal.“

**Oma Ruth** (Nebenfigur). Ruth M., Mamas Mutter, Mitte siebzig, sie. Wohnt noch im Reihenhaus
in der Elm Street, in dem Mama aufgewachsen ist; telefoniert jeden Sonntag mit Mama und hat {held}
seit dem Umzug nicht gesehen. Hält Mamas altes Zimmer unverändert, „falls sie mal wieder
schlafen will“. Beispiel: „Deine Mutter war das stillste Kind der Straße. Außer, wenn sie
gewonnen hat.“ Rolle: öffnet Mamas Geheimnis (Szene 39).

**Mr. Teague** (Nebenfigur). Walter Teague, achtzig, er, ehrenamtlicher Hüter des Heimatmuseums im
alten Bahnhof. Hütet Postsäcke von 1870, die nie geöffnet wurden. Rolle: übergreifender Fund „Der
leere Umschlag“ (Szene 41).

### 9.4 Sprechweisen auf einen Blick (Ergänzung zu 5.4)

| Figur      | Erkennungszeichen                                              |
| ---------- | -------------------------------------------------------------- |
| Slick      | schnell, Rhythmus, Wortspiele mit Gabeln, großmäulig, herzlich |
| Tamsin     | zählt Sekunden, Ausrufe, „nicht nachdenken, gucken“            |
| Ray        | Busfahrpläne als Bilder, geduldig                              |
| Mr. Harlan | Uhrmacherbilder, langsam, genau                                |
| Nova       | Werbesätze, dann ein müder halber Satz                         |
| Big Joe    | „Kumpel“, Werkhallenbilder, laut, herzlich                     |
| Priya      | Technikwörter, begeistert, „Ingenieurwesen“                    |
| Gus        | Pausen und Fahrpläne, knapp                                    |
| Oma Ruth   | warm, erzählt von früher, nennt Mama „Laurie“                  |

## 10. Welt in Akt 2

Grundsatz wie in Teil 1: je Stadt eine Außenkarte und zwei bis drei Innenräume; dazu je Route zwei
Karten (W1). Kennungen nach `inhalte/abenteuer/README.md`; Wege sind Orte mit `art: "weg"`
(Schritt 10) und heißen wie `wegMapleCedar` (Route 1): Route 2 ist `wegCedarRiverton`, Route 3
`wegRivertonIronwood`. Das Fahrrad ist der Gegenstand `fahrrad` (Quest-Wirkung `gegenstand`), die
Schnellreise prüft `besuchtRiverton` und `besuchtIronwood`.

### 10.1 Route 2: Cedar Creek → Riverton (`wegCedarRiverton`, Schnellreise mit dem Zug)

| Karte                         | Zweck                                                | Stationen (W4)                                                                                                                         | Atmosphäre                                                              |
| ----------------------------- | ---------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| `wegCedarRiverton.zedernwald` | Waldweg ab dem Steg von Cedar Creek, am Bach entlang | Rätseltafel am Wegweiser (3 Doppelangriffe, Münzen), Fund „Pfeilspitze“, Wanderin mit Weisheit                                         | Rote Zedern, Moos, ein Specht, Sonnenflecken.                           |
| `wegCedarRiverton.bahndamm`   | Feldweg neben den Gleisen bis zum Bahnhof Riverton   | Straßengegner mit Uhr: Juno fordert einen Zugschaffner heraus und verliert, dann ist {held} dran (Szene 27); Fund „Fahrkarte von 1958“ | Ein Güterzug rattert vorbei, Schotter, Löwenzahn, in der Ferne Brücken. |

Die Wanderin am Wegweiser (Mrs. Fenwick, sie, Rucksack und Stock) sagt einen Satz Schachweisheit:
„Wer angreift, soll zuerst zählen, wer verteidigt.“ (Buch Kapitel 1, Abschnitt 1.4). Erstes Mal zu
Fuß etwa 12 Minuten; danach Schnellreise mit dem Zug am Bahnhof Cedar Creek oder Riverton
(Fahrkarte 10 Münzen, nach der Clubnadel von Riverton frei, W2).

### 10.2 Riverton (Ort 3, `riverton`)

Bild, Areale und Innenräume nach `09_Weltbeschreibung.md`, Abschnitt 5.4: Flussstadt mit Park,
Brücke und Bahnhof, Backstein und Regen. Herbst, Laub in den Pfützen, Schach ist hier laut.

| Karte                    | Art           | Zweck                                                                                                                         | Figuren                                                    | Atmosphäre                                                             |
| ------------------------ | ------------- | ----------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- | ---------------------------------------------------------------------- |
| `riverton.aussen`        | außen         | Bahnhof, Brücke, Park mit Pavillon und Bildschirmtischen, Handyladen (Kulisse), Bushaltestelle, geschlossene Fahrradwerkstatt | Mrs. Albescu, Nova und Victor (Szene 29), Statisten aus 09 | Regenpfützen mit Spiegelung, Tauben, Banner von Perfect Move.          |
| `riverton.pavillon`      | innen (offen) | Slicks Club: Aufgabenreihen, Zuschauen, Clubkampf                                                                             | Slick, Tamsin, Ray                                         | Regen trommelt aufs Dach, Marmorbretter, Uhren klopfen.                |
| `riverton.bahnhofshalle` | innen         | Zeitungsstand (Laden), große Uhr, Bank des Uhrmachers, Auslöser des Flashbacks                                                | Pops, Mr. Harlan                                           | Hall der Durchsagen, die Uhr tickt laut, Geruch nach nassen Mänteln.   |
| `riverton.wohnwagen`     | innen         | Slicks Zuhause, Nachgespräch nach dem Clubkampf                                                                               | Slick                                                      | Trophäen aus Dosen, ein Kurierrad an der Wand, ein Brett auf dem Bett. |
| `riverton.schuppen`      | innen (klein) | Fahrradschuppen hinter der Werkstatt (nach dem Schlüssel, E4)                                                                 | –                                                          | Staub, Spinnweben, ein grünes Fahrrad unter einer Plane.               |

Der Handyladen verkauft Tablets von Perfect Move und ist bewusst kein Laden für {held}: Gekauft
wird am Zeitungsstand von Pops (Abschnitt 13). Ergänzt in `09`, Abschnitt 5.4.

### 10.3 Route 3: Riverton → Ironwood (`wegRivertonIronwood`, Kanalweg, das Fahrrad lohnt sich)

| Karte                          | Zweck                                                     | Stationen (W4)                                                                                 | Atmosphäre                                                       |
| ------------------------------ | --------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| `wegRivertonIronwood.kanalweg` | Treidelpfad am Kanal, an stillgelegten Fabriken vorbei    | Rätseltafel an der Bushaltestelle ohne Bus (2 Fesselungen), Fund „Zahnrad“, Bauer mit Weisheit | Leere Hallen, Graffiti mit Schachfiguren, Krähen auf den Zäunen. |
| `wegRivertonIronwood.bruecke`  | Eisenbrücke über den Kanal, dann der Abhang nach Ironwood | Ambrose und der Zeitnot-Trick (Szene 40), Fund „Nietenkopf mit Initialen“                      | Wind, das Tal tief unten, Rauch aus dem Stahlwerk am Horizont.   |

Die Route ist doppelt so lang wie Route 2 (zu Fuß etwa 15 Minuten, mit Fahrrad etwa 8; W3, W6):
Das Fahrrad aus dem Schuppen (Szene 33) lohnt sich hier zum ersten Mal spürbar. Der Bauer am
Zaun (Mr. Dale, er) sagt: „Ein Bauer zieht nie zurück. Also überleg vorher.“ (Buch Kapitel 5,
Grundgesetz der Bauern; nur Kapitel nennen). Schnellreise: Bus vom Bahnhof Riverton nach Ironwood
(10 Münzen, nach der Clubnadel von Ironwood frei).

### 10.4 Ironwood (Ort 4, `ironwood`)

Bild, Areale und Innenräume nach `09_Weltbeschreibung.md`, Abschnitt 5.5: Stahlstadt, Rauch,
Brücken, Werksschornsteine, Kälte, ein warmer Kern in der Kantine. Spätherbst; am Ende von Akt 2
fällt der erste Schnee.

| Karte                  | Art           | Zweck                                                                                                                                     | Figuren                                              | Atmosphäre                                                             |
| ---------------------- | ------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- | ---------------------------------------------------------------------- |
| `ironwood.aussen`      | außen         | Werkstor, Brücke, Reihenhäuser (Elm Street), Kantine, Güterbahnhof, Eisenwarenfenster, alter Bahnhof, Bushaltestelle an der Schnellstraße | Gus (Güterbahnhof), Edna (Fenster), Statisten aus 09 | Rauch und Funken, Kinder malen Bretter mit Kreide, Krähen auf Trägern. |
| `ironwood.kantine`     | innen         | Werksclub: Aufgabenreihen, Clubkampf, Mamas Partie, Feier                                                                                 | Big Joe, Hank, Priya, später Mama                    | Lange Tische, der Ofen, Big Joes Stahlbrett, eine Lücke im Pokalregal. |
| `ironwood.mamasZimmer` | innen (klein) | Mamas altes Zimmer im Reihenhaus von Oma Ruth: das Geheimnis                                                                              | Oma Ruth                                             | Poster, eine Silbermedaille, ein Partieformular unter Glas.            |
| `ironwood.umkleide`    | innen (klein) | Umkleide des Werks, Schließfach mit Fund (Laterne nötig)                                                                                  | –                                                    | Spinde, tropfende Dusche, ein vergessener Helm.                        |
| `ironwood.museum`      | innen         | Heimatmuseum im alten Bahnhof: Postsäcke, Erinnerung Ambroses                                                                             | Mr. Teague                                           | Alte Schalter, eine Standuhr, Postsäcke mit Wachssiegeln.              |

Ergänzt in `09`, Abschnitt 5.5: Museum, Güterbahnhof, Eisenwarenfenster statt Kiosk.

## 11. Szenenliste Akt 2

Etwa 3,5 bis 4,5 Stunden mit beiden Wegen (Abschnitt „Zeitrechnung“). Kennungen: Szenen
`akt2.name`, Quests und Begegnungen `ort.name`, Runden `ort.reiheName`. **H** = Hauptquest,
**N** = Nebenquest mit Typ, **S** = Straßengegner, **W** = Weg, **F** = Fund, **E4** = übergreifende
Quest. Münzen nach G1, Karten nach Regelwerk R27, Zeitkarten nur auf Wegen und in Nebenquests
(Z4).

### Route 2 und Riverton

**26. Aufbruch nach Riverton** · `akt2.aufbruch` · H `riverton.parkclub`
Ort `cedarCreek.aussen` (Steg), dann `wegCedarRiverton.zedernwald` · Juno, Ambrose. Ereignis: Dialog. Juno
zeigt die Nachricht über den Parkclub von Riverton; Coach Delgado kann nicht mit, Mama erlaubt den
Ausflug mit Juno („Mit dem Zug zurück, vor dem Dunkelwerden.“). Der erste Weg wird gegangen (W2).
Ambrose über den Wald: „Bäume, die älter sind als ich. Endlich jemand in meinem Alter.“ Etwa 3
Minuten.

**27. Am Bahndamm** · W `wegCedarRiverton` · S `wegCedarRiverton.schaffner`
Ort `wegCedarRiverton.zedernwald`, `wegCedarRiverton.bahndamm` · Juno, Mr. Quinn (Zugschaffner in der Pause, er),
Mrs. Fenwick. Ereignis: Rätseltafel (Runde `wegCedarRiverton.tafelWegweiser`, 3 Doppelangriffe, 5 Münzen),
Wanderin mit Weisheit, Straßengegner mit Uhr: Stellungsduell 3 + 2 (R13, W4), Zielstärke A − 100.
Juno spielt zuerst und verliert lachend („Ich hab die Zeit gewonnen. Er hatte mehr übrig.“). Sieg:
10 Münzen und beim ersten Sieg die Karte **Kühler Kopf** (bisher Zeitbonus) (Z3, Z4). Funde F „Pfeilspitze“, F
„Fahrkarte von 1958“. Etwa 12 Minuten.

**28. Ankunft in Riverton** · `akt2.ankunftRiverton` · H `riverton.parkclub`
Ort `riverton.aussen` (Bahnhof) · Juno, Ambrose. Ereignis: Dialog. Überall Plakate: „Perfect Move
Park – Schach für alle, ohne Wartezeit“. Ambrose: „Ohne Wartezeit. Als wäre das Warten nicht das
Schönste am Schach.“ Ein Schild weist zum Park. Etwa 3 Minuten.

**29. Die Bildschirmtische** · `akt2.bildschirmtische` · H `riverton.parkclub`
Ort `riverton.aussen` (Park), dann `riverton.pavillon` · Nova, Victor, Slick, Tamsin, Ray, Juno.
Ereignis: Dialog. Nova eröffnet im Regen unter einem Schirm die Bildschirmtische auf der Wiese
vor Kameras; Victor steht daneben im Trainingsanzug des Konzerns und sagt
auswendig gelernte Sätze. Im Pavillon spielen Slick, Tamsin und Ray weiter, die Uhren klopfen. Slick: „Sie haben uns den
Pavillon gelassen. Bis Sonntag.“ Victor zu {held}, als die
Kameras aus sind: „Die Tische machen keine Fehler. Das ist der Punkt.“ – {held} kann fragen: „Und
das ist gut?“ Victor: „Mein Vater sagt ja.“ Ambrose starrt auf einen Bildschirm, auf dem die
Maschine eine Partie in Sekunden gewinnt (`#stimmung:fern`). Der Clubkampf wird verabredet: das
letzte Spiel im Pavillon, Sonntag. Etwa 6 Minuten.

**30. Pops’ Zeitungsstand** · `akt2.ladenRiverton`
Ort `riverton.bahnhofshalle` · Pops. Ereignis: Laden (G2, G5; `oeffneLaden("riverton.zeitungsstand")`), Angebot
in Abschnitt 13. Pops erzählt, dass Slicks Lehrer, der alte Mr. Odum, hier jeden Morgen eine
Zeitung kaufte und die Schachspalte zuerst las. Etwa 3 Minuten.

**30a. Die Monatskarte** · Gegenstand Monatskarte (11, I6)
Ort `riverton.bahnhofshalle` · Pops, Mr. Quinn (Schaffner in der Pause), Ambrose. Ereignis: Laden.
Pops hängt ein neues Schild auf: „Monatskarte – alle Züge und Busse zwischen besuchten Städten“
(80 Münzen). Mr. Quinn trinkt Kaffee daneben: „Damit fährst du, wohin du willst. Nur nicht in
Städte, in denen du noch nie warst. Die musst du erst mal finden.“ (W2: Schnellreise nur nach dem
ersten Fußweg.) Ambrose: „Ein Billett für einen ganzen Monat. Zu meiner Zeit kaufte man dafür ein
Pferd.“ Wirkung: Schnellreise zwischen allen besuchten Städten ohne einzelne Fahrkarten. Etwa 2
Minuten.

**31. Der Uhrmacher** · S `riverton.harlan` · Zeit (Vorgabe 5)
Ort `riverton.bahnhofshalle` (Bank unter der großen Uhr) · Mr. Harlan, Juno, Ambrose. Ereignis: Stellungsduell
aus einer Abbildung des Buches (Kapitel 3, Abbildung 3.77, Weiß am Zug etwa +1,6, geprüft im
dritten Auftrag von mittel-2), Zielstärke A ± 0, **Wahl der Zeitklasse** vor der Partie (Z1). Juno
hat ihn schon einmal ohne Uhr gespielt: „Er hat eine Stunde für zwölf Züge gebraucht und dann
gewonnen.“ Ambrose: „Ein Mann, der jeden Zug zehn Minuten wiegt. Gib ihm keine zehn Minuten.“ Wer
Blitz (3 + 2) wählt, sieht den Effekt: Harlan gerät nach wenigen Zügen in Zeitnot und macht Fehler
(Z2). Die Wahl bleibt frei; ohne Uhr ist die Partie schwerer, aber möglich. Belohnung: 10 Münzen,
beim ersten Sieg **Zweite Chance** (R27). Lehre: Die Zeitklasse ist eine ehrliche Hilfe, sie kostet
keine Nadel (Z2). Harlan nach der Partie: „Die Unruh tickt für alle gleich. Nur nicht für mich.“
Etwa 8 Minuten.

**31a. Die Lupe des Uhrmachers** · Gegenstand Lupe (11, I1)
Ort `riverton.bahnhofshalle` · Mr. Harlan, Ambrose. Auslöser: der dritte Sieg gegen Mr. Harlan (in
beliebiger Zeitklasse). Ereignis: Dialog. Harlan nimmt die Lupenbrille ab, putzt sie lange und gibt
{held} seine alte Taschenlupe: „Ich habe sie fünfzig Jahre an Uhrwerken benutzt. Du siehst damit
nicht die Zahnräder, sondern die Schwächen. Bei mir: Ich denke zu lange.“ Ambrose: „Ein ehrliches
Werkzeug. Es zeigt nur, was ohnehin da ist.“ Wirkung: Vor jeder Partie zwei Zeilen aus dem
Steckbrief des Gegners sichtbar, auch ohne Vorbereitungsquest, Immunität gegen Sprüche
eingeschlossen. Der Zustand „analysiert“ bleibt den Quests vorbehalten. Etwa 2 Minuten.

**32. Aufgabenreihe Riverton** · Runden `riverton.reiheTamsin`, `riverton.reiheRay`
Ort `riverton.pavillon` · Tamsin, Ray. Ereignis: Aufgaben nach R30a, Zeitbudget 15
Minuten. Tamsin: Springergabeln (Buch Kapitel 7, Abschnitt 7.2, Motiv 1; Übung 35
`ueb:taktik-a01`, Übung 4 `ueb:droh-ignorieren`). Ray: Doppelangriff und Hinlenkung (Übung 40
`ueb:taktik-a06`, Übung 10 `ueb:k2-zweispringer-la4`; Kapitel 4, Abschnitt 4.10 „Springergabel auf
c7“). Themen `doppelangriff` (Lichess und Zusatzaufgaben). Ambrose: „Eine Gabel ist ein Zug, der
zwei Briefe auf einmal zustellt.“ Erste bestandene Reihe: **Zweite Chance**, 15 Münzen. Etwa 15
Minuten.

**33. Der verrostete Schlüssel** · N hilfe `riverton.schuppen` · E4 (2)
Ort `riverton.aussen`, `riverton.schuppen` · Mrs. Albescu. Voraussetzung: Fund „verrosteter
Schlüssel“ vom Steg in Cedar Creek (E4, Abschnitt 12). Ereignis: Dialog, dann Ort. Mrs. Albescu
erkennt den Schlüssel: „Den hat mein Mann beim Angeln verloren. Vor zwei Jahren!“ Im Schuppen steht
ihr altes grünes Fahrrad. Sie schenkt es {held}: „Es soll fahren, nicht stehen.“ Belohnung:
Gegenstand **Fahrrad** (W3). Ohne Schlüssel kann man das Fahrrad bei Edna in Ironwood kaufen
(Abschnitt 13). Etwa 5 Minuten.

**34. Zuschauen im Pavillon** · N begegnung `riverton.zuschauen`
Ort `riverton.pavillon` · Slick, Tamsin. Ereignis: Aufgaben und Dialog. Tamsin lädt {held} ein, eine
Runde Blitz zwischen Slick und Ray zu beobachten und mitzuzählen (Runde `riverton.slickBeobachten`,
3 Aufgaben: Welche Drohung hat Slick übersehen?). Wirkung: Slick **analysiert**, zwei
Steckbriefzeilen (Fehlerart „übersieht stille Drohungen“, Eröffnung „Schottisch“; C7). Tamsin: „Er
guckt nur nach vorn. Nie nach hinten.“ Belohnung zusätzlich: Karte **Zeitdruck** (Z3, heute „Grübelfalle“) und der **Spickzettel**
(K7): Tamsin schreibt Slicks Lieblingseröffnung auf einen Zettel.
Etwa 7 Minuten.

**35. Flashback: London, 1851** · `akt2.flashbackLondon` · N begegnung (Erinnerung)
`riverton.flashbackLondon` · F2 (2)
Ort: Sepia-Karte `flashback.london` (eine Straße am Strand, ein Kaffeehaus innen), Ambrose als
Held (F1, F3). Auslöser: Am Abend nach Szene 29 wartet {held} in der Bahnhofshalle auf den Zug; die große Uhr
schlägt, draußen leuchten die Bildschirmtische, und Ambrose und sagt: „Ich war einmal jünger als du jetzt. Fast.“ Ereignis: kurzer
Gang durch das Kaffeehaus (Zeitungsleser, Kaffeeduft, Tabakrauch nur als Wort), Ambrose (20) steht
hinter zwei Spielern. Dann Zugerraten (C3) der Partie Anderssen gegen Kieseritzky, London 1851,
`klassik-unsterbliche` aus `inhalte/zusatzpartien/klassiker.json`, mit Weiß ab Zug 17 bis zum
Matt im 23. Zug: Anderssen gibt beide Türme und die Dame. Ambrose hält vor Zug 18 an: „Jetzt gibt
er den zweiten Turm. Was hättest du getan?“ Zurück in der Gegenwart, leise: „Diese Maschinen
würden das nie spielen. Oder doch? Was wäre, wenn sie meine Partie spielen könnten?“ Juno merkt,
dass {held} still ist. Belohnung: **Partiefragment 3**, bei mindestens 70 Prozent Karte
**Bauernvorgabe** (R27, R31). Etwa 5 Minuten (2 Minuten Gang, 3 Minuten Zugerraten).

**36. Clubkampf Riverton** · `akt2.clubnadelRiverton` · H `riverton.parkclub`
Ort `riverton.pavillon` · Slick, Tamsin, Ray, Juno, Zuschauer aus dem Park unter Schirmen.
Ereignis: Partie gegen den Clubchef (Zielstärke E + 340, Profil `riverton.slick`), Wahl der
Zeitklasse (Z1; Slick schlägt Blitz vor, Ambrose rät ab: „Er lebt von der Eile. Nimm ihm die
Eile.“), Kartenwahl, Kipppunkt nach R14. Belohnung: **Clubnadel Riverton**, „Ambroses Notiz“,
**Mentor-Zug** (R27, erste Nadel eines Clubs), 50 Münzen. Slick nach der Partie, bei jedem Ausgang: „Das war das letzte Spiel in diesem Pavillon.
Gut, dass es ein richtiges war.“ Etwa 30 Minuten.

**37. Sonntagabend** · `akt2.pavillonGeraeumt`
Ort `riverton.pavillon`, dann `riverton.wohnwagen` · Slick, Juno, Ambrose. Ereignis: Dialog. Am
nächsten Morgen stehen im Pavillon Bildschirmtische. Slick packt das letzte Marmorbrett in die
Kuriertasche: „Dann spielen wir eben auf der Treppe.“ Im Wohnwagen zwischen den Dosentrophäen schenkt er {held} eine
Figur aus dem letzten Satz, den weißen Springer mit der abgestoßenen Mähne (Fund F „Springer aus
dem Pavillon“, schaltet Bretthintergrund „Riverton-Pavillon“ frei, E3). Ambrose zum ersten Mal unsicher: „Er hat recht. Und die Tische
spielen trotzdem besser als er. Was heißt das?“ Etwa 4 Minuten.

### Route 3 und Ironwood

**38. Nicht Ironwood** · `akt2.verbot` · H `ironwood.mamasFinale`
Ort `mapleFalls.wohnzimmer` · Mama, Ambrose. Ereignis: Dialog. Coach Delgado hat das Team zu einem
Freundschaftsturnier in Ironwood angemeldet. Mama liest den Zettel und sagt sofort: „Nein. Nicht
Ironwood.“ Kein Grund, keine Diskussion; sie geht zur Nachtschicht. Ambrose: „Ihre Mutter hat
Angst. Vor einer Stadt. Das ist selten.“ {held} kann trotzdem nach Ironwood laufen (die Route ist
frei), aber Mama erwartet {held} abends zurück. Wichtig: Die Geschichte bestraft nichts; das Verbot
gilt dem Turnier, nicht dem Ort, und löst sich in Szene 43. Etwa 3 Minuten.

**39. Mamas altes Zimmer** · `akt2.fotoGefunden` · H `ironwood.mamasFinale`
Ort `ironwood.kantine`, dann `ironwood.mamasZimmer` · Big Joe, Oma Ruth, Juno. Ereignis: Dialog,
Fund. Beim ersten Besuch in der Kantine stutzt Big Joe: „Kumpel, du hast ein Gesicht, das ich
kenne. … Bist du Lauries Kind?“ Im Pokalregal ist eine Lücke, wo der Pokal von 2001 stehen
sollte. Big Joe nennt die Elm Street: „Sag ihr, Big Joe lässt grüßen. Und dass es ihm leidtut.“
Dort öffnet Oma Ruth, umarmt {held} lange und zeigt Mamas altes Zimmer: eine Silbermedaille, ein
Foto „Jugendmeisterschaft 2001, Finale – Laura M., Stahlwerker-Club Ironwood“ und, unter Glas, das
Partieformular des Finales mit einem Kreis um den 33. Zug. Oma Ruth: „Sie hat es eingerahmt und nie
wieder angesehen.“ Fund F „Foto von 2001“ (Hauptquest-Gegenstand). Etwa 7 Minuten.

**39a. Mamas Turnierheft** · Gegenstand Partienotizbuch (11, I4)
Ort `ironwood.mamasZimmer` · Oma Ruth, Ambrose. Auslöser: nach Szene 39, beim zweiten Besuch bei Oma
Ruth. Ereignis: Dialog. Oma Ruth holt aus der Schreibtischschublade ein dickes, blaues Heft: Mamas
Partienotizbuch von damals, jede Turnierpartie mit Datum, Gegner und drei Sätzen „Was ich gelernt
habe“. Die letzte beschriebene Seite ist das Finale 2001, danach nur leere Seiten. „Sie hat es mir
dagelassen. Ich glaube, sie wollte, dass jemand weiterschreibt.“ Ambrose: „Drei Sätze nach jeder
Partie. Ihre Mutter war eine ordentliche Spielerin. Ich war das nie.“ Wirkung: Nach jeder Partie
hält Ambrose im Tagebuch die drei wichtigsten Momente fest (Kipppunkt, bester Zug, Fehler), auf
den leeren Seiten von Mamas Heft. In Szene 43 sieht Mama das Heft und lacht: „Du schreibst ja in
mein Heft.“ Etwa 3 Minuten.

**40. Die Eisenbrücke** · W `wegRivertonIronwood` · Zeit (Vorgabe 5, Zeitnot-Trick)
Ort `wegRivertonIronwood.kanalweg`, `wegRivertonIronwood.bruecke` · Ambrose, Juno, Mr. Dale. Ereignis: Rätseltafel
(Runde `wegRivertonIronwood.tafelHaltestelle`, 2 Fesselungen, 5 Münzen), Bauer mit Weisheit, Funde F „Zahnrad“
und F „Nietenkopf mit Initialen J. H.“ (der Ingenieur hat diese Brücke gebaut; Ambrose erkennt die
Initialen nicht oder will sie nicht erkennen). Auf der Brücke, im Wind, erklärt Ambrose den
**Zeitnot-Trick** (Z6) und schenkt die Karte (Verbrauchskarte, mittlere Stufe, einmal):
„Im Kaffeehaus tat man so, als brenne die Kerze des Gegners schon herunter. Er glaubte es, und er
eilte.“ {held}: „Ist das nicht Schummeln?“ Ambrose: „Es ist Theater. Der Gegner sieht dieselbe Uhr
wie du.“ Dazu der ehrliche Teil aus dem Buch: Wer selbst nicht in Zeitnot ist, soll nicht
mitblitzen, sondern die eigene Zeit nutzen (Kapitel 12, Abschnitt 12.5, „Ist bloß dein Gegner in
Zeitnot, blitze nicht mit, sondern nutze die Zeit, die du hast.“). Das Buch kennt keine
„gefühlte Zeitnot“; der Satz zur echten Zeitnot ist der Buchbezug. Hinweis für später: Die Karte
macht die Clubnadel höchstens Silber (R17). Etwa 12 Minuten (zu Fuß), 8 mit Fahrrad.

**41. Der leere Umschlag** · N rätsel `ironwood.postsack` · E4 (3, neu)
Ort `ironwood.museum` · Mr. Teague, Ambrose. Ereignis: Stellungsrätsel aus der Welt. Mr. Teague
zeigt einen ungeöffneten Postsack von 1866; auf dem Wachssiegel ist eine Schachstellung geprägt
(eine Fesselung, Weiß am Zug gewinnt die Dame; Runde `ironwood.siegelStellung`, 1 Aufgabe aus dem
Thema `fesselung`). Gelöst, darf {held} den Sack öffnen: Darin liegt ein Umschlag, adressiert an
„A. Whitlock, New Orleans“, mit dem Absender „J. Hale“. Der Umschlag ist leer; der Brief fehlt.
Ambrose schweigt lange (`#pause`), dann: „Er hat mir geschrieben. Nachdem ich … Er hat
geschrieben.“ Belohnung: Fund F **„Umschlag ohne Brief“** (übergreifend, Auflösung in Akt 3:
Der Brief liegt in Desert Springs, Abschnitt 12), Steckbriefzeile für Big Joe (Mr. Teague kennt
ihn: „Joe spielt immer das Damengambit. Seit vierzig Jahren.“), Karte **Flüstern** (R27, Rätsel).
Etwa 7 Minuten.

**42. Ednas Eisenwaren** · `akt2.ladenIronwood`
Ort `ironwood.aussen` (Verkaufsfenster) · Edna. Ereignis: Laden (`oeffneLaden("ironwood.eisenwaren")`). Edna verkauft das
Fahrrad für alle, die den Schlüssel nicht gefunden haben, und eine Laterne für versteckte Funde.
„Das hält.“ Etwa 3 Minuten.

**43. Mamas Partie** · `akt2.mamasPartie` · H `ironwood.mamasFinale` · Begegnung `ironwood.mama`
Ort `mapleFalls.wohnzimmer`, dann `ironwood.kantine` · Mama, Big Joe, Juno, Ambrose. Ereignis:
Dialog, dann Partie. {held} zeigt Mama das Foto (Wahl: „Ich hab das gefunden.“ / „Big Joe lässt
grüßen.“). Mama setzt sich, lange Pause. Sie erzählt kurz vom Finale 2001 und vom Spieß, den sie
übersah. Dann: „Gut. Eine Partie. In Ironwood. Ich will den Raum sehen.“ Sie fährt mit {held} nach
Ironwood, zuerst zu Oma Ruth, dann in die Kantine; Big Joe und sie umarmen sich ohne Worte. Partie aus der Grundstellung: Mama mit Weiß,
Damengambit (Profil `mapleFalls.mutter`, Rolle `story`, Zielstärke E + 250, eingerostet: hohe
Fehlerhäufigkeit im Mittelspiel, Gewicht `taktikUebersehen` hoch, blinder Fleck `roentgen`
(Spieße!)), Karten erlaubt, zählt für die App (R37), jeder Ausgang führt weiter.

- **{held} gewinnt:** Mama lacht und weint gleichzeitig. „Du hast mich mit einem Spieß erwischt.
  Natürlich.“ Big Joe: „Kumpel, das war ihr Fehler von damals. Jetzt ist er erledigt.“
- **Mama gewinnt oder Remis:** „Ich hab ihn gesehen. Den Läufer. Diesmal hab ich ihn gesehen.“ Sie
  muss sich setzen.

In beiden Fällen: Mama sagt, sie fährt ab jetzt mit zu den Turnieren. „Jemand muss ja auf die
Zeit achten. Du spielst zu langsam.“ Ambrose leise: „Ihre Mutter, wenn ich so sagen darf, spielt
besser, als sie lügt.“ Wirkung: Szene gesetzt, Dialogvariable `mamaSpielt` = true, Juno klebt das
Foto ins Tagebuch („Mit Glitzer. Diesmal ja.“). Etwa 25 Minuten.

**44. Die Feier in der Kantine** · N begegnung `ironwood.feier`
Ort `ironwood.kantine` (Abend) · Big Joe, Hank, Priya, Mama, Juno. Ereignis: Dialog. Nach Mamas
Partie feiert der Werksclub das Wiedersehen bis spät. {held} kann bleiben oder früh gehen. Wer
bleibt, sieht Big Joe um Mitternacht noch Geschichten erzählen. Wirkung bei Teilnahme: Big Joe ist
am nächsten Tag **abgelenkt** (`setzeZustand`, Faktor 1,4, Grund `zustand.schlechtGeschlafen`,
R8), sichtbar per Dialog und in der Kartenleiste. Nach dem Clubkampf: „Revanche, wenn ich
ausgeschlafen bin!“ Wie in Akt 1: {held} plant das nicht. Etwa 5 Minuten.

**45. Gus am Güterbahnhof** · S `ironwood.gus`
Ort `ironwood.aussen` · Gus. Ereignis: Stellungsduell mit Uhr (Schnellschach 10 + 5, weil die
Pause fünfzehn Minuten dauert), Stellung aus Kapitel 6, Abbildung 6.14 (Weiß am Zug etwa +0,9,
geprüft im dritten Auftrag), Zielstärke A − 50. Belohnung: 10 Münzen, beim ersten Sieg
**Zweite Chance**. Etwa 8 Minuten.

**46. Aufgabenreihe Ironwood** · Runden `ironwood.reiheHank`, `ironwood.reihePriya`
Ort `ironwood.kantine` · Hank, Priya. Ereignis: Aufgaben nach R30a, Zeitbudget 15 Minuten.
Hank: Fesselungen (Buch Kapitel 7, Abschnitt 7.2, Motiv 2; Übung 38 `ueb:taktik-a04`, Übung 17
`ueb:elefant`). Priya: Spieße und Scheinbarer Schutz (Motiv 3; Übung 37 `ueb:taktik-a03`, Übung 22
`ueb:legal-verteidigung`; Kapitel 4, Abschnitte 4.5 und 4.6). Themen `fesselung`, `spiess`.
Priya: „Ein Spieß ist eine Fesselung von hinten. Statik!“ Erste bestandene Reihe: **Zweite
Chance**, 15 Münzen. Etwa 15 Minuten.

**47. Erinnerung: Die Zeitung von 1858** · N begegnung (Erinnerung) `ironwood.erinnerungBird`
Ort `ironwood.museum` · Ambrose. Auslöser: In Mr. Teagues Vitrine liegt eine alte Zeitung mit
Schachspalte. Ambrose: „Diese Partie habe ich in der Nacht nach meiner Niederlage nachgespielt.
Zwanzigmal.“ Ereignis: Zugerraten (C3) der Partie Bird gegen Morphy, London 1858,
`klassik-bird-morphy`, mit Schwarz ab Zug 17 bis zum Ende. Ambrose: „Morphy verlor nie den Mut. Ich
schon, einen Abend lang.“ Belohnung: **Partiefragment 4**; bei mindestens 70 Prozent keine weitere
starke Karte (die Bauernvorgabe gab es in Szene 35), stattdessen 20 Münzen (Abweichung von R27,
siehe Bericht). Etwa 10 Minuten.

**48. Clubkampf Ironwood** · `akt2.clubnadelIronwood` · H `ironwood.clubkampf`
Ort `ironwood.kantine` · Big Joe, Mama, Juno, Hank, Priya. Ereignis: Partie gegen den
Clubchef (Zielstärke E + 400, Profil `ironwood.bigJoe`, Damengambit), Wahl der Zeitklasse,
Kartenwahl, Kipppunkt. Mama sitzt zum ersten Mal als Zuschauerin dabei und sagt vor der Partie nur:
„Grundreihe. Immer die Grundreihe.“ (Hinweis auf Big Joes Schwäche, wie ein Steckbrief.)
Belohnung: **Clubnadel Ironwood**, „Ambroses Notiz“, 50 Münzen; Karte nach R27 wie in Szene 36.
Etwa 30 Minuten.

**49. Der Kauf** · `akt2.ironwoodVerkauft` · H `ironwood.clubkampf`
Ort `ironwood.aussen` (Werkstor) · Big Joe, Victor, Graham Hale, Mama, Juno, Ambrose. Ereignis:
Dialog. Am Werkstor hängt ein neues Schild: Das Stahlwerk hat die Kantine „für ein
Trainingszentrum“ an Perfect Move vermietet; der Club zieht in die Bildschirmtische um oder gar
nicht. Graham Hale erklärt freundlich die Vorteile. Big Joe sagt nichts und trägt die Pokale in
einem Karton hinaus. Victor steht neben seinem Vater und sieht Big Joe an; er fängt an: „Vater,
vielleicht …“ und bricht ab. Mama stellt sich neben Big Joe. Etwa 5 Minuten.

**50. Einladung nach Silicon Bay** · `akt2.einladung` · Ende Staffel 1 (Cliffhanger)
Ort `ironwood.aussen` (Brücke und Bushaltestelle an der Schnellstraße, Abend, erster Schnee) ·
Victor, {held}, Ambrose. Ereignis: Dialog. Victor kommt allein vom Werkstor herüber, zum ersten
Mal ohne Tablet; Schneeflocken auf seinem Trainingsanzug. Er gibt {held} eine Einladung zum Jugendturnier der
Konzern-Akademie in Silicon Bay. „Komm. Dann siehst du, wogegen du spielst.“ Pause. „Und vielleicht
sagst du mir dann, ob ich auf der richtigen Seite stehe.“ Er steigt in den Bus nach Silicon Bay, bevor {held}
antworten kann. Ambrose sieht ihm nach, dann auf die Nieten der Brücke mit „J. H.“ (dieselben Initialen wie auf Route 3): „Ein Hale, der fragt.
Das ist neu.“ Ende der Staffel: Im Tagebuch steht „Silicon Bay“, Juno hat ein Fragezeichen mit
Glitzer gemalt. Etwa 4 Minuten.

### Zeitrechnung

| Teil                                                   | Minuten                                                   |
| ------------------------------------------------------ | --------------------------------------------------------- |
| Wege beim ersten Mal (Szenen 26–27, 40)                | etwa 25 (mit Fahrrad auf Route 3 etwa 20)                 |
| Dialoge und Laufen (28–30, 37–39, 42, 49–50)           | etwa 40                                                   |
| Partien Hauptstory (36, 43, 48)                        | etwa 85                                                   |
| Aufgabenreihen (32, 46)                                | etwa 30                                                   |
| Nebenquests, Erinnerung, Flashback (33–35, 41, 44, 47) | etwa 40                                                   |
| Straßengegner (31, 45)                                 | etwa 16                                                   |
| **Summe**                                              | **etwa 235, also 3,5 bis 4,5 Stunden mit Wiederholungen** |

Kürzungen, falls der Spielzeitzähler mehr zeigt: zuerst Szene 45 (Straße), dann Szene 47
(Erinnerung kürzer, ab Zug 20), dann Szene 44 (Feier nur als Dialog ohne Wahl).

### Verteilung der Nebenquests

| Stadt    | rätsel                                              | hilfe                               | begegnung                                                               |
| -------- | --------------------------------------------------- | ----------------------------------- | ----------------------------------------------------------------------- |
| Riverton | Rätseltafel `wegCedarRiverton.tafelWegweiser` (Weg) | `riverton.schuppen` (E4, Fahrrad)   | `riverton.zuschauen` (analysiert), Flashback `riverton.flashbackLondon` |
| Ironwood | `ironwood.postsack` (E4 neu)                        | Mamas Partie (Hauptquest, kein Typ) | `ironwood.feier` (abgelenkt), Erinnerung `ironwood.erinnerungBird`      |

Damit kommen beide Zustände aus dem Regelwerk wieder je einmal vor, in umgekehrter Reihenfolge wie
in Akt 1 (Riverton analysiert, Ironwood abgelenkt). In Ironwood ersetzt Mamas Partie die
Hilfe-Quest; eine eigene Hilfe-Quest wäre neben der Hauptlinie zu viel.

## 12. Entdeckungen in Akt 2 (E1 bis E5)

Funde je Ort mit einem Satz; „E3“ heißt: schaltet ein Extra frei (Quelle `abenteuer:<fund>`).
Münzen nach G1 (5 bis 20).

| Ort      | Fund                            | Wo                                                     | Satz (Ambrose oder Juno)                                              | Wirkung                                  |
| -------- | ------------------------------- | ------------------------------------------------------ | --------------------------------------------------------------------- | ---------------------------------------- |
| Route 2  | Pfeilspitze                     | unter einem Farn am Bach (versteckt)                   | „Wer hier jagte, kannte den Wald besser als jede Karte.“              | 5 Münzen                                 |
| Route 2  | Fahrkarte von 1958              | im Schotter am Bahndamm                                | „Riverton, einfache Fahrt. Wer fuhr damals, und kam er an?“           | 10 Münzen                                |
| Route 2  | Springer aus Holz               | in einem hohlen Baumstamm (versteckt)                  | „Ein Springer, allein im Wald. Er hüpft wohl noch.“                   | E3: Figurensatz „Waldholz“ (1/3)         |
| Riverton | Springer aus dem Pavillon       | Geschenk von Slick (Szene 37)                          | „Hier haben Menschen gespielt. Man sieht die Kratzer ihrer Ungeduld.“ | E3: Bretthintergrund „Riverton-Pavillon“ |
| Riverton | Zeitungsausschnitt Schachspalte | am Zeitungsstand hinter dem Ständer (versteckt)        | „Mr. Odums letzte Aufgabe, nie gelöst.“                               | Rätsel mit 1 Aufgabe, 10 Münzen          |
| Riverton | Taubenfeder                     | auf der Bank von Mr. Harlan in der Bahnhofshalle       | „Eine Feder. Damit schrieb man früher Partien auf.“                   | 5 Münzen                                 |
| Riverton | Läufer aus Holz                 | unter der Brücke beim Straßenmusiker (versteckt)       | „Noch ein Holzstück. Jemand hat einen ganzen Satz verloren.“          | E3: Figurensatz „Waldholz“ (2/3)         |
| Route 3  | Zahnrad                         | am Zaun der leeren Fabrik                              | „Ein Rad, das kein anderes mehr dreht.“                               | 5 Münzen                                 |
| Route 3  | Nietenkopf mit Initialen J. H.  | am Brückengeländer                                     | Ambrose schweigt; Juno: „J. H.? Wer ist das?“                         | übergreifend, Akt 3 (siehe unten)        |
| Ironwood | Foto von 2001                   | Mamas altes Zimmer (Szene 39)                          | Juno: „Sie hat genau so gelacht wie deine Mama.“                      | Hauptquest                               |
| Ironwood | Umschlag ohne Brief             | Postsack im Museum (Szene 41)                          | „Er hat geschrieben.“                                                 | übergreifend, Akt 3 (E4 neu)             |
| Ironwood | Turm aus Holz                   | Schließfach in der Umkleide (versteckt, Laterne nötig) | „Der letzte. Jetzt ist der Satz vollständig.“                         | E3: Figurensatz „Waldholz“ (3/3)         |
| Ironwood | Funke aus Glas                  | Schaukasten im Museum                                  | „Hübsch. Aber in meinem Kaffeehaus hätte er nicht gebrannt.“          | 10 Münzen                                |

**Übergreifende Quests (E4):**

1. **„Altes Partieformular“** (aus Route 1, W5): Weitergeführt in Akt 2 am Anfang von Szene 26:
   Wer das Formular hat und Mr. Boateng im Waschsalon in Cedar Creek fragt, bekommt die
   Handschrift entziffert: „Das ist eine alte Schrift. Die Züge sind englisch notiert, K für König,
   Kt für Springer.“ Belohnung: **Partiefragment 2** (Ambroses Fernpartie). Quest
   `cedarCreek.partieformular`, Voraussetzung Fund Partieformular.
2. **„Verrosteter Schlüssel“** (Cedar Creek, Steg): Szene 33, Fahrradschuppen in Riverton. Der
   Fund am Steg gehört nach Akt 1 (siehe Bericht); die Auflösung ist hier.
3. **„Umschlag ohne Brief“** (neu, Ironwood, Szene 41) mit **„Nietenkopf J. H.“** (Route 3): geht
   erst in Akt 3 auf. Plan für Akt 3: In Desert Springs, nach der Versöhnung, findet {held} in
   einem Antiquariat den Brief, der zum Umschlag gehört (das Siegel passt). Hale schreibt 1866:
   „Komm nach Norden. Wir spielen die letzten Züge an einem Brett.“ Ambrose erfährt, dass Hale auf
   ihn gewartet hat; das trägt die Versöhnung mit dem Geist und die Enthüllung in Akt 4 (Victor
   ist ein Nachfahre). Der Nietenkopf zeigt vorher, dass Hale nach 1866 noch Brücken baute, also
   lange lebte.

**Sammelziel (E5):** Alle Funde von Riverton (mit Route 2) und alle von Ironwood (mit Route 3)
geben je eine „Entdecker-Nadel“. Der Figurensatz „Waldholz“ verteilt sich bewusst über drei Orte,
damit sich das Suchen über die Staffel lohnt.

## 13. Läden in Akt 2 (G2, G4)

Preise als Vorschlag, im Rahmen von `08_Wege_und_Entdeckungen.md`, Abschnitt 5. Mentor-Zug,
Sanduhr, Vorgaben und Zeitkarten sind nie käuflich (G3, Z4). Ein Clubbesuch bringt etwa 60 bis
100 Münzen (G4): In Riverton sind es mit Route 2 etwa 15 + 10 + 10 + 15 + 50 + Funde ≈ 120, in
Ironwood ähnlich; das reicht für eine Karte und eine Fahrkarte je Stadt oder das Fahrrad nach zwei
Städten.

| Laden                    | Figur | Angebot                                                    | Preis | Vorrat      |
| ------------------------ | ----- | ---------------------------------------------------------- | ----- | ----------- |
| `riverton.zeitungsstand` | Pops  | Fingerzeig (Verbrauchskarte)                               | 15    | 3 je Besuch |
|                          |       | Zweite Chance                                              | 20    | 2 je Besuch |
|                          |       | Zugfahrkarte Cedar Creek ↔ Riverton                        | 10    | unbegrenzt  |
|                          |       | Bretthintergrund „Zeitungspapier“ (Extra)                  | 40    | einmal      |
|                          |       | Taschenschach „Bahnhofs-Edition“ (Album, ohne Wirkung)     | 10    | einmal      |
| `ironwood.eisenwaren`    | Edna  | Zweite Chance                                              | 20    | 2 je Besuch |
|                          |       | Ambroses Flüstern                                          | 40    | 1 je Besuch |
|                          |       | Fahrrad (W3), nur ohne Schlüssel aus Szene 33              | 120   | einmal      |
|                          |       | Laterne (versteckte Funde in dunklen Innenräumen sichtbar) | 60    | einmal      |
|                          |       | Busfahrkarte Riverton ↔ Ironwood                           | 10    | unbegrenzt  |
|                          |       | Bretthintergrund „Glühender Hochofen“ (Extra)              | 80    | einmal      |

Hinweis: „Fingerzeig“ ist im Kartenverzeichnis eine dauerhafte Karte (`karten.json`); als
Ladenware ist er hier als Verbrauchskarte gedacht (G2). Das braucht entweder eine zweite Sorte
„Fingerzeig (einmal)“ oder eine Änderung von G2 (Bericht).

## 14. Hilfskarten und Zeitkarten in Akt 2

| Karte               | Wo                                                                                                                                                             | Warum hier                                                 |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| Kühler Kopf         | Szene 27, Schaffner am Bahndamm (erster Sieg)                                                                                                                  | erste Partie mit Uhr, Zeit als Hilfe wird spürbar (Z3, Z4) |
| Grübelfalle         | Szene 37, Slicks Wohnwagen (Abschied)                                                                                                                          | Slick bringt den ersten Spruch bei (docs/spiel/10, S1)     |
| Großes Maul         | Szene 40, Ambrose auf der Brücke (Geschenk)                                                                                                                    | Z6, mit dem ehrlichen Satz aus Kapitel 12, Abschnitt 12.5  |
| Bauernvorgabe       | Szene 35, Flashback London (≥ 70 %)                                                                                                                            | Erinnerung nach R27                                        |
| Flüstern            | Szene 41, Rätsel im Museum                                                                                                                                     | Rätsel nach R27                                            |
| Zweite Chance       | Szenen 31, 32, 45, 46                                                                                                                                          | Straßensiege und Aufgabenreihen nach R27                   |
| Springervorgabe     | alle Nebenquests einer Stadt                                                                                                                                   | R27; in Akt 2 realistisch erst in Ironwood                 |
| Spickzettel (K7)    | Szene 34, Zuschauen im Pavillon (zu den Steckbriefzeilen)                                                                                                      | Vorbereitung lohnt sich: Slicks Eröffnung steht fest       |
| Monatskarte         | Szene 30a, Zeitungsstand (80 Münzen)                                                                                                                           | Schnellreise nach dem ersten Fußweg (W2)                   |
| Lupe des Uhrmachers | Szene 31a, dritter Sieg gegen Mr. Harlan                                                                                                                       | Belohnung für Ausdauer, zeigt Steckbriefzeilen             |
| Partienotizbuch     | Szene 39a, Oma Ruth gibt Mamas Turnierheft                                                                                                                     | verbindet Mamas Geschichte mit Ambroses Rückblick          |
| Läden               | Riverton: Fingerzeig, Zweite Chance, Waage, Schmeichelei, Remisangebot; Ironwood: Zweite Chance, Flüstern, Fahrrad, Laterne, Auszeit, Was droht?, Kartentasche | Preise und Bedenken in 11, Abschnitt 7                     |

## 15. Offene Fragen an den Autor (Akt 2)

Zu jeder Frage meine Empfehlung; nach Regel 9 gilt sie, bis du widersprichst.

1. **Mamas Verbot.** Empfehlung: Sie verbietet das Turnier, nicht die Stadt, und ohne Strafe; die
   Geschichte zwingt {held} nicht zum Ungehorsam (Lesealter 10, Dokument 02, 2.3).
2. **Ambroses Aufenthalt in London 1851.** Erfunden (Reise mit dem Vater, Klavierholz), damit er die
   „Unsterbliche Partie“ als Augenzeuge erzählen kann. Das Kaffeehaus bleibt ohne Namen.
3. **Fahrrad als Geschenk oder Kauf.** Empfehlung: beides (Schlüssel-Quest oder 120 Münzen bei
   Edna), damit niemand ohne Fahrrad bleibt, der den Schlüssel übersehen hat.
4. **Zweite Erinnerung in Akt 2 ohne starke Karte.** R27 gäbe für jede Erinnerung eine
   Bauernvorgabe; zwei starke Karten in einer Staffel machen Clubkämpfe zu leicht. Empfehlung: nur
   die erste Erinnerung je Staffel gibt die Bauernvorgabe, weitere geben 20 Münzen (Bericht, für
   R27).
5. **Nova schon in Akt 2.** Empfehlung: ja, ein kurzer Auftritt in Riverton, damit ihr Geheimnis in
   Akt 3 nicht aus dem Nichts kommt.
6. **Victor ohne Partie in Akt 2.** Empfehlung: ja; seine Entwicklung läuft über zwei Gespräche, die
   nächste Partie gegen ihn gehört nach Silicon Bay.

---

# Teil 3: Akt 3 (Staffel 2: Silicon Bay, Port Delacroix, Desert Springs)

Stand: 08.11.2026, Helfer-Chat mittel-2. Grundlage zusätzlich zu Teil 1 und 2:
`10_Sprueche_Schauplaetze_Varianten.md` (Sprüche S1 bis S6, Schauplätze O1, O2, O4, O6),
`06_Regelwerk.md` (R4 Zielstärken, R27 Karten, R28 und R29 Story-Sperren), `07_Aufgabenzuordnung.md`
(Clubs 5 bis 7), `08_Wege_und_Entdeckungen.md` und `09_Weltbeschreibung.md`. Stilregeln wie in
Abschnitt 5. Port Delacroix ersetzt Old Harbor (O1). Alle Namen sind Arbeitsnamen; „ZERO“ soll vor
der Veröffentlichung umbenannt werden (Dokument 02, Abschnitt 5).

## 16. Der Kern von Akt 3 in sieben Sätzen

1. In Silicon Bay sieht {held} die Konzern-Akademie von innen: Bildschirme statt Bretter, eine
   ehrliche Trainerin, Dr. Lin, und eine Champion-Spielerin, Nova, deren Partien zu genau sind.
2. Ambrose ist von der Maschine ZERO gebannt: Sie spielt die makellosen Partien, von denen er sein
   Leben lang geträumt hat.
3. In Port Delacroix, Ambroses Geburtsstadt im Delta, hat ein Hurrikan das alte Musikhaus mit dem
   Schachclub zerstört; der Club spielt in einer Turnhalle weiter, und {held} hilft beim
   Wiederaufbau.
4. Dort wirft man {held} vor, mit dem Brett zu schummeln wie der Konzern mit der Maschine; {held}
   spielt den Clubkampf allein, und Ambrose zieht sich zu ZERO zurück (Tiefpunkt).
5. Ambrose findet seine Nachfahren, die Klavierbauer Whitlock-Duval, die ohne Schach glücklich
   sind; die junge Céleste spielt eine einzige Partie aus Neugier, und Ambrose lernt loszulassen.
6. Im Canyon vor Desert Springs versöhnen sich {held} und Ambrose; er lehrt das romantische Opfer
   und erzählt endlich, wie er 1866 auf der Reise zu Hale starb.
7. In Desert Springs findet {held} den Brief zum leeren Umschlag: Hale hat auf Ambrose gewartet.

## 17. Zeitlinie, Ergänzung für Akt 3

| Jahr         | Ereignis                                                                                                                                                                                                            |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1831         | Ambrose wird in **Port Delacroix** geboren, einer Hafenstadt im Delta eine Tagesreise flussab von New Orleans; Teil 1 nennt New Orleans, weil er dort spielte (siehe Bericht).                                      |
| 1840         | Der neunjährige Ambrose fegt Sägespäne in der Klavierwerkstatt seines Vaters und lernt dort Schach auf einem Brett aus Resthölzern (Flashback, Szene 66).                                                           |
| 1852         | Nach der Londonreise spielt Ambrose seinem Vater und der kleinen Schwester Claire in der Werkstatt den Anfang der „Unsterblichen Partie“ vor (Flashback, Szene 66).                                                 |
| 1866         | Hale schreibt aus dem Westen: „Komm nach Norden. Wir spielen die letzten Züge an einem Brett.“ Ambrose bricht auf und stirbt unterwegs; der Brief erreicht ihn nie (Umschlag in Ironwood, Brief in Desert Springs). |
| 1879         | Josiah Hale baut die Eisenbahnbrücke über den Canyon bei Desert Springs, seine letzte Brücke; die Nieten tragen „J. H.“ wie in Ironwood.                                                                            |
| 1885         | Hale stirbt in Desert Springs. Sein Nachlass geht an seine Söhne; ein Notizbuch bleibt in der Familie (übergreifende Quest für Akt 4).                                                                              |
| letztes Jahr | Ein Hurrikan trifft Port Delacroix im Spätsommer und zerstört das alte Musikhaus. Akt 3 spielt im Winter und Frühjahr danach: Wiederaufbau.                                                                         |

## 18. Figuren in Akt 3

### 18.1 Weiterentwicklung der Hauptfiguren

**Ambrose.** Akt 3 ist sein Akt (Konzeptsammlung, Charakterentwicklung). Er läuft fast zur
Maschine über: Theo schenkt {held} in Silicon Bay ein Tablet des Konzerns, und nachts „schaut“
Ambrose ZERO beim Spielen zu. Er wird stiller, spricht von „vollkommenen“ Partien und findet
{held}s Fehler plötzlich unerträglich. Nach dem Vorwurf in Port Delacroix verstummt er ganz. Bei
den Whitlock-Duvals sieht er, dass seine Familie ohne ihn und ohne Schach glücklich geworden ist,
und im Canyon begreift er, dass Schach durch Menschen schön wird, die Fehler machen. Neue
Stimmungen: `gebannt` (vor dem Bildschirm), `still` (im Tiefpunkt, nur ein Satz je Szene).
Erst jetzt spricht er über 1866, kurz und ohne Einzelheiten (Abschnitt 5.3 gilt weiter).

- „Sie zweifelt nie. Siehst du, wie schön das ist? … Oder wie leer?“
- „Ich bin in dieser Werkstatt aufgewachsen. Sie riecht noch genauso.“
- „Ich bin nicht angekommen, {held}. Aber er hat gewartet. Das reicht mir.“

**Victor.** Er ist in Silicon Bay zu Hause und Gastgeber des Akademie-Turniers. Als er sieht, wie
Nova vor einer Partie ein winziges Gerät ins Ohr steckt, sagt er zum ersten Mal laut: „Das ist
falsch.“ Er schweigt danach vor seinem Vater, aber er gibt {held} die Spielberichte der Akademie
(Szene 56). In Port Delacroix taucht er nicht auf; er schickt eine einzige Nachricht: „Ich glaube
dir. Wegen des Bretts.“

**Juno** kommt nach Silicon Bay mit und fährt danach zurück (Schule); in Port Delacroix und Desert
Springs ruft sie nur an. **Mama** fährt mit nach Port Delacroix (Turnier der Region, Abschnitt 2.3)
und hilft beim Wiederaufbau mit ihren Händen als Krankenpflegerin im Notzelt.

### 18.2 Silicon Bay

**Dr. Lin** (Clubchefin 5). Dr. Evelyn Lin, Mitte vierzig, sie. Leitet die Schachakademie von
Perfect Move, war früher Turnierspielerin und glaubt an gute Eröffnungen und ehrliche Arbeit. Sie
weiß nicht, dass manche ihrer Schützlinge Geräte tragen, und wird in Akt 4 beim Aufdecken helfen
(Dokument 02, 2.7). Stil: Lehrbuch, saubere Eröffnungen, Grundsätze aus Kapitel 1 (drei Ziele,
vier Todsünden). Schwäche: Sobald die Stellung das Lehrbuch verlässt, spielt sie vorsichtig und
passiv (Phasenversatz Eröffnung +1, Mittelspiel −1; Fehlerart `koenigPassiv` im Endspiel). Sprechweise:
genau, freundlich, Fragen wie im Unterricht.

- „Drei Ziele: Zentrum, Entwicklung, König in Sicherheit. Welches hast du vergessen?“
- „Ich bringe hier Kindern Schach bei. Die Bildschirme helfen. Glaube ich.“
- „Das sind die Spielberichte meiner Klasse. Ich habe sie nie so genau angesehen.“

Zielstärke E + 460 (Club 5, R4). Eröffnung: Italienisch und Damengambit, abweichungsarm.

**Nova** (Clubmitglied). Siehe Teil 2, 9.2. In Silicon Bay stellt sie eine Aufgabenreihe
(Eröffnungsfallen) und lächelt dabei zu viel. Ihr Geheimnis: Sie spielt Turniere mit einem
Ohrgerät, weil ihr Vertrag es verlangt; sie hasst es. Rolle in Akt 3: Ihre Partien sind der erste
Beweis (Szene 56), aber sie bittet {held}, noch nichts zu sagen („Wenn das rauskommt, bin ich die
Schuldige. Nicht die.“). Auflösung in Akt 4.

**Theo** (Clubmitglied). Theodore Park, 14, er, Datenfreak der Akademie, hält Zahlen für die einzige
Wahrheit, ist aber neugierig und ehrlich. Stellt die Aufgabenreihe zu Eröffnungsgrundsätzen.
Schenkt {held} ein Tablet mit ZERO („Damit trainierst du in einer Woche mehr als in einem Jahr.“).
Beispiel: „Du hast 71 Prozent Genauigkeit. Das ist … menschlich.“

**Dash** (Straßengegner, Sprüche). Dashiell Moore, 19, er, Lieferradfahrer, spielt in der Mittagspause
auf der Bank vor dem Food-Truck Blitz um Burritos und redet ununterbrochen (S4). Nicht immun gegen
„Grübelfalle“, aber immun gegen „Großes Maul“ („Ich spiel immer schnell, Kleines.“; Steckbrief).
Zielstärke A − 50. Eigene Sprüche: „Tick, tack, dein König hat Angst.“ – „Denkst du noch oder
verlierst du schon?“

**Rosie** (Laden). Rosalind Ortiz, Food-Truck-Besitzerin, sie, Anfang dreißig, verkauft Burritos
und am Fenster Karten und Fahrkarten („Ich bin das Einzige in dieser Stadt, das nicht leuchtet.“).

### 18.3 Port Delacroix

**Miss Odile** (Clubchefin 6). Odile Fontaine, Anfang sechzig, sie, Musiklehrerin, leitet den
Schachclub seit dreißig Jahren im alten Musikhaus am Kai. Nach dem Hurrikan spielt der Club in der
Turnhalle der Schule und in zwei Zelten. Ruhig, unerschütterlich, singt beim Aufräumen. Stil:
Positionsspielerin der Bauernstrukturen (Kapitel 5 und 6), langsame Pläne. Schwäche: verteidigt
schlecht gegen schnelle Angriffe am Königsflügel (Fehlerart `koenigsschild` hoch). Sprechweise:
Musik als Bild, „Takt“, „Melodie“.

- „Bauern sind die Melodie. Die Figuren spielen nur dazu.“
- „Das Wasser hat das Haus genommen, nicht die Musik.“
- „Spiel langsam. Ein Plan ist kein Sprint.“

Zielstärke E + 520 (Club 6, R4). Eröffnung: Französisch und Englisch.

**Remy** (Clubmitglied). Rémy Arceneaux, 16, er, Trompeter in einer Schulband, stolz auf seine Stadt
und misstrauisch gegen Fremde, seit Perfect Move nach dem Sturm „Hilfe“ angeboten hat: Bildschirme
statt eines neuen Musikhauses. Er erhebt den Schummelvorwurf (Szene 63). Stellt die Aufgabenreihe zu
Bauernstrukturen. Später entschuldigt er sich (Szene 69). Beispiel: „Hier hilft man mit den Händen.
Nicht mit Bildschirmen.“

**Lou** (Clubmitglied). Louise Thibodeaux, 12, sie, sammelt Muscheln und Pläne („Ich hab einen Plan.
Er ist noch nicht fertig, aber er ist gut.“). Stellt die Aufgabenreihe zu Plänen (Kapitel 6).

**Mr. Batiste** (Straßengegner, Sprüche). Lucien Batiste, Ende fünfzig, er, flickt am Kai Boote und
spielt dabei Schach auf einem umgedrehten Eimer. Gelassen, immun gegen beide Sprüche („Junge Leute
reden. Das Wasser hört nicht zu.“; Steckbrief). Zielstärke A ± 0. Eigene Sprüche: langsame
Lebensweisheiten, die nichts mit der Partie zu tun haben und gerade dadurch ablenken.

**Henri Whitlock-Duval** (Nebenfigur). Fünfzig, er, Klavierbauer in sechster Generation, Werkstatt
in der Rue des Facteurs. Der Sturm hat das Dach beschädigt, die Klaviere sind gerettet. Freundlich,
geschäftig, keine Ahnung von Schach. Beispiel: „Ein Klavier hat zweihundertdreißig Saiten. Jede
muss stimmen. Ihr Schach hat nur vierundsechzig Felder? Klingt erholsam.“

**Céleste Whitlock-Duval** (Nebenfigur). 15, sie, Henris Tochter, macht Musik am Laptop, skatet,
findet Schach „was für alte Leute“ (O2). Nicht unhöflich, nur ehrlich gelangweilt. Rolle: die eine
Partie aus Neugier (Szene 68). Beispiel: „Also, ich schieb die Pferde einfach rum, okay?“

**Mrs. Arceneaux** (Laden). Remys Großmutter, verkauft am Gebäckstand vor der Turnhalle Gebäck,
Karten und Fahrkarten; der Erlös geht in den Wiederaufbau.

### 18.4 Desert Springs und der Canyon

**Mira** (Clubchefin 7). Mira Castillo, 10, sie, Wunderkind, trainiert allein auf einem flachen
Stein im Canyon, weil es dort still ist. Ernst, schnell, mag Opfer, weil sie „schöner sind als
Recht haben“; genau Ambroses Schach. Club: die Garage ihres Bruders am Motel. Stil: Angreiferin,
opferfreudig. Schwäche: opfert auch, wenn es nicht geht (Fehlerart `falscherAbtausch`, Phasenversatz
Endspiel −1). Sprechweise: kurze Sätze, sehr direkt, manchmal ein Kinderwitz.

- „Ich opfere den Läufer. Weil ich kann.“
- „Im Canyon antwortet das Echo. Am Brett nicht. Deshalb mag ich das Brett.“
- „Du hast mich geschlagen. Noch mal. Jetzt.“

Zielstärke E + 580 (Club 7, R4). Eröffnung: Königsgambit und Evans-Gambit (Kapitel 3).

**Tomás** (Clubmitglied). Tomás Castillo, 17, er, Miras Bruder, Mechaniker in der Garage, spielt
solide und passt auf seine Schwester auf. Stellt die Aufgabenreihe zu Mattbildern mit Opfer.

**Dot** (Clubmitglied). Dorothy Marsh, siebzig, sie, Motelbesitzerin, spielt seit fünfzig Jahren
Fernschach per Post und hat Briefe aus aller Welt. Stellt die Aufgabenreihe zum Königsangriff und
kennt das Antiquariat, in dem der Brief liegt (Szene 76).

**Buck** (Straßengegner, Sprüche). Buck Harmon, sechzig, er, Tankwart, spielt auf der Motorhaube
und hat für jede Lage einen Spruch. Nicht immun („Na, jetzt willst du's aber wissen!“). Zielstärke
A − 100. Eigene Sprüche: „Hier draußen fährt keiner langsam. Auch nicht am Brett.“

**Mr. Okoro** (Laden, Antiquariat). Samuel Okoro, siebzig, er, führt das Antiquariat im alten
Bahnhof; verkauft Karten, Fahrkarten und alte Bücher. Hütet den Nachlass der Familie Hale aus
Desert Springs, ohne es zu wissen.

### 18.5 Sprechweisen auf einen Blick (Ergänzung)

| Figur      | Erkennungszeichen                            |
| ---------- | -------------------------------------------- |
| Dr. Lin    | Lehrerfragen, „drei Ziele“, freundlich genau |
| Theo       | Prozente und Daten, ehrlich neugierig        |
| Dash       | Sprüche ohne Pause, Rhythmus, nie gemein     |
| Miss Odile | Musik, Takt, Melodie, singt beim Aufräumen   |
| Remy       | stolz, misstrauisch, „mit den Händen“        |
| Céleste    | gelangweilt ehrlich, Laptop-Musik, „okay?“   |
| Mira       | kurze Sätze, sehr direkt, „noch mal“         |
| Buck       | Tankstellen-Sprüche, laut, herzlich          |

## 19. Welt in Akt 3

Bilder, Areale und Innenräume nach `09_Weltbeschreibung.md`, Abschnitte 5.6 bis 5.8 (in diesem
Auftrag ergänzt). Jahreszeit: Winter bis Frühjahr (09, Abschnitt 2); Silicon Bay ohne Jahreszeit,
Port Delacroix nasser Winter mit Stürmen und Sonne über den Baustellen, Desert Springs erste Wärme.
Wege heißen wie die Wege-Orte aus Schritt 10.

### 19.1 Weg 4: Ironwood → Silicon Bay (`wegIronwoodSilicon`, Bus)

| Karte                            | Zweck                                                    | Stationen (W4)                                                                                              |
| -------------------------------- | -------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `wegIronwoodSilicon.raststaette` | Raststätte an der Schnellstraße, wo der Bus Pause macht  | Rätseltafel am Kaffeeautomaten (3 Eröffnungsfallen), Fund „Werbe-Anstecker ZERO“, Fernfahrerin mit Weisheit |
| `wegIronwoodSilicon.glasbruecke` | Fußgängerbrücke aus Glas in die Stadt, darunter Autobahn | Straßengegnerin mit Uhr: eine Joggerin mit Smartwatch (Stellungsduell 3 + 2), Fund „verlorener Ohrstöpsel“  |

Der Bus hält an der Raststätte, den Rest geht {held} zu Fuß über die Glasbrücke (W2). Die
Fernfahrerin (Mrs. Kowalczyk, sie) sagt: „Erst die Figuren raus, dann die Dame.“ (Kapitel 1,
Abschnitt 1.2). Der verlorene Ohrstöpsel ist in Wahrheit ein Empfänger (Fund, Szene 56).

### 19.2 Silicon Bay (Ort 5, `siliconBay`)

| Karte                   | Art   | Zweck                                                            | Figuren                       |
| ----------------------- | ----- | ---------------------------------------------------------------- | ----------------------------- |
| `siliconBay.aussen`     | außen | Campus, Straßenbahn, Werbetafeln, Food-Truck, Bank vor dem Truck | Rosie, Dash, Statisten aus 09 |
| `siliconBay.akademie`   | innen | Glasbüro mit Bildschirmen: Club, Aufgabenreihen, Clubkampf       | Dr. Lin, Nova, Theo           |
| `siliconBay.serverraum` | innen | Kühl, blinkend; Fund der Schummelgeräte                          | –                             |
| `siliconBay.lobby`      | innen | Firmengeschichte mit Vitrine der Familie Hale (übergreifend)     | Empfangsroboter, Victor       |

### 19.3 Weg 5: Silicon Bay → Port Delacroix (`wegSiliconDelacroix`, Küstenfähre)

| Karte                        | Zweck                                      | Stationen (W4)                                                                                                         |
| ---------------------------- | ------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------- |
| `wegSiliconDelacroix.faehre` | Deck der Küstenfähre, zwei Tage nach Süden | Rätseltafel im Salon (3 Bauernstrukturen), Straßengegner mit Uhr: der Schiffskoch (Schnellschach), Fund „Flaschenpost“ |
| `wegSiliconDelacroix.deich`  | Deichweg vom Anleger in die Stadt          | Fund „Muschel mit Loch“, Helfer mit Sandsäcken mit Weisheit, erster Blick auf die Schäden                              |

Die Fähre ist eine begehbare Karte (zwei Decks); Möwen, Gischt, ein Delfin als einmalige Animation.
Weisheit am Deich (Mr. Guidry, er): „Ein Loch im Deich ist wie ein Loch in der Bauernkette. Man
stopft es, bevor es größer wird.“ (Kapitel 5, Bauernstrukturen). Schnellreise danach: Fähre (15
Münzen) oder Küstenzug.

### 19.4 Port Delacroix (Ort 6, `portDelacroix`)

| Karte                     | Art   | Zweck                                                                     | Figuren                             |
| ------------------------- | ----- | ------------------------------------------------------------------------- | ----------------------------------- |
| `portDelacroix.aussen`    | außen | Kai mit Booten, Ruine des Musikhauses, Zelte, Turnhalle, Rue des Facteurs | Mr. Batiste, Mrs. Arceneaux, Helfer |
| `portDelacroix.turnhalle` | innen | Ausweichquartier des Clubs: Aufgabenreihen, Clubkampf, Benefiz-Simultan   | Miss Odile, Remy, Lou               |
| `portDelacroix.werkstatt` | innen | Klavierwerkstatt Whitlock-Duval, Flashback-Auslöser                       | Henri, Céleste                      |
| `portDelacroix.musikhaus` | innen | Ruine, nach dem Wiederaufbau der neue Clubraum (Spur: Schild, Bretter)    | Miss Odile (dritter Besuch)         |

### 19.5 Weg 6: Port Delacroix → Desert Springs (`wegDelacroixDesert`, Wüstenzug und Canyon)

| Karte                           | Zweck                                                     | Stationen (W4)                                                                                                               |
| ------------------------------- | --------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `wegDelacroixDesert.canyonpfad` | Pfad vom Wüstenbahnhof durch den Canyon                   | Rätseltafel am Wanderschild (3 Königsangriffe), Fund „Eidechsenhaut“, Wanderin mit Weisheit, Mira auf ihrem Stein (Szene 72) |
| `wegDelacroixDesert.felsbogen`  | Felsbogen und Eisenbahnbrücke von 1879, Abstieg zur Stadt | Versöhnung (Szene 73), Fund „Nieten J. H. an der Brücke“ (Auflösung)                                                         |

Der Wüstenzug hält an einem einsamen Bahnhof oberhalb des Canyons; der Pfad nach Desert Springs
ist der erste Weg (O4). Hitze als Tönung, Eidechsen, ein Roadrunner, Geier als Kreise (09).
Weisheit der Wanderin (Mrs. Holloway, sie): „Wer angreift, braucht mehr Figuren am König als der Verteidiger.“
(Kapitel 1, Abschnitt 1.6, Goldene Angriffsregel).

### 19.6 Desert Springs (Ort 7, `desertSprings`)

| Karte                       | Art   | Zweck                                                   | Figuren          |
| --------------------------- | ----- | ------------------------------------------------------- | ---------------- |
| `desertSprings.aussen`      | außen | Motel, Diner, Tankstelle, alter Bahnhof mit Antiquariat | Buck, Statisten  |
| `desertSprings.garage`      | innen | Club in der Garage am Motel: Aufgabenreihen, Clubkampf  | Mira, Tomás, Dot |
| `desertSprings.antiquariat` | innen | Antiquariat im alten Bahnhof: der Brief, Laden          | Mr. Okoro        |

## 20. Szenenliste Akt 3

Etwa 5 bis 6 Stunden mit drei Wegen. Kennungen: Szenen `akt3.name`, Quests `ort.name`. Sprüche nur
gegen Straßengegner (S2), nie im Club. Mentor-Zug ist von Szene 63 (Tiefpunkt) bis Szene 73
(Versöhnung) gesperrt (R29); im Clubkampf von Port Delacroix sind alle Karten gesperrt (R28).

### Weg 4 und Silicon Bay

**51. Abfahrt im Schnee** · `akt3.abfahrt` · H `siliconBay.akademie`
Ort `ironwood.aussen` (Bushaltestelle an der Schnellstraße) · Mama, Juno, Ambrose. Ereignis: Dialog.
Mama erlaubt das Turnier in Silicon Bay („Ich hab Nachtschicht. Juno, du passt auf.“). Ambrose
starrt auf Victors Einladung: „Eine Stadt aus Glas. Wie man wohl darin Schach spielt?“ Etwa 3 Minuten.

**51a. Das Reisebrett** · Gegenstand Reisebrett (11, I3)
Ort `ironwood.aussen` (Bushaltestelle) · Juno, Ambrose. Ereignis: Dialog. Bevor der Bus fährt, drückt
Juno {held} eine kleine Holzkiste in die Hand: ihr Reisebrett mit Magnetfiguren, auf dem Deckel
Sticker und „Clubtagebuch, Außenstelle“. „Damit du nicht vergisst, wie man verliert. Spiel mit
Ambrose. Oder mit mir, wenn ich anrufe.“ Ambrose: „Ein Brett für die Tasche. Meines ist schwerer.
Und gesprächiger.“ Wirkung: überall in der Welt eine freie Übungspartie gegen Ambrose oder Juno
(zählt nicht für Nadeln und nicht für A). Etwa 2 Minuten.

**52. Die Raststätte** · W `wegIronwoodSilicon`
Ort `wegIronwoodSilicon.raststaette`, `.glasbruecke` · Juno, Fernfahrerin, Joggerin. Ereignis:
Rätseltafel (3 Eröffnungsfallen, Münzen), Weisheit, Stellungsduell mit Uhr gegen die Joggerin
(Abbildung aus Kapitel 2 oder 4, Auswahl im Datenauftrag nach R13), Funde. Etwa 12 Minuten.

**53. Glas und Licht** · `akt3.ankunftSiliconBay`
Ort `siliconBay.aussen` · Juno, Victor, Ambrose. Ereignis: Dialog. Niemand spielt an einem Brett,
alle schauen auf Bildschirme; ein Lieferroboter fährt {held} fast um. Victor holt die beiden ab,
höflich und müde. Ambrose: „Kein Baum. Keine Taube. Wo wohnen hier die Tiere?“ Victor: „Die stören
die Sensoren.“ Etwa 4 Minuten.

**54. Dash am Food-Truck** · S `siliconBay.dash` · Sprüche (S1 bis S4)
Ort `siliconBay.aussen` · Dash, Rosie, Ambrose. Ereignis: Stellungsduell mit Uhr (Blitz 3 + 2),
Zielstärke A − 50. Dash redet von der ersten Sekunde an. Zum ersten Mal kann {held} selbst einen
Spruch spielen („Grübelfalle“ wirkt, „Großes Maul“ prallt ab: „Ich spiel immer schnell, Kleines.“).
Ambrose vorher: „Im Park redet man. Hier ist ein Park, wenn auch einer aus Glas.“ Belohnung beim
ersten Sieg: Karte **Grübelfalle** (Zeitkarte, S1), 10 Münzen. Etwa 8 Minuten.

**55. Die Akademie** · `akt3.akademie` · H `siliconBay.akademie`
Ort `siliconBay.akademie` · Dr. Lin, Nova, Theo, Victor. Ereignis: Dialog. Dr. Lin begrüßt {held}
herzlich und zeigt die Bildschirmbretter. Theo misst {held}s Genauigkeit bei einer Probepartie
(„71 Prozent. Menschlich.“) und schenkt {held} ein Tablet mit ZERO. Nova lächelt in eine Kamera und
setzt sich danach still auf die Fensterbank. Ambrose sieht ZERO auf dem Tablet eine Partie in zwölf
Sekunden gewinnen (`#stimmung:gebannt`): „Kein einziger Fehler. Nicht einer.“ Etwa 6 Minuten.

**56. Die Spielberichte** · N begegnung `siliconBay.spielberichte` · Buchbezug Kapitel 12.2
Ort `siliconBay.akademie`, `siliconBay.serverraum` · Victor, Dr. Lin, Nova. Ereignis: Dialog und
Aufgaben. Victor gibt {held} heimlich die Spielberichte der Akademie (Entscheidung C2): Mit der
Partieauswertung der App sieht {held}, dass Novas Turnierpartien 98 Prozent Genauigkeit haben,
ihre Trainingspartien 74 (Runde `siliconBay.auswertung`, 3 Aufgaben: „Welcher Zug ist zu gut?“,
Buch Kapitel 12, Abschnitt 12.2, Partieanalyse ohne Selbsttäuschung). Im Serverraum findet {held}
eine Schublade mit winzigen Empfängern (Fund „Ohrempfänger“, passt zum Ohrstöpsel von der
Glasbrücke). Nova kommt dazu: „Bitte. Noch nicht. Wenn das rauskommt, bin ich die Schuldige.“
{held} schweigt (keine Wahl, Akt 4 löst auf). Wirkung: Steckbriefzeile Dr. Lin, Dr. Lin
**analysiert**. Etwa 10 Minuten.

**57. Die Vitrine der Hales** · `akt3.vitrine` · übergreifend (neu, Akt 4)
Ort `siliconBay.lobby` · Victor, Ambrose. Ereignis: Dialog, Fund. In der Lobby steht eine Vitrine
„Hale – Ingenieure seit 1850“: ein Rechenschieber, eine Brückenzeichnung, und ein aufgeschlagenes
Notizbuch, aus dem eine Seite herausgerissen ist. Auf der linken Seite stehen Schachzüge in
altmodischer Notation. Ambrose erkennt seine eigene Fernpartie (`#pause`): „Das sind meine Züge.
Und das … das war seine Antwort, auf der Seite, die fehlt.“ Victor: „Mein Vater sagt, die Seite war
schon immer weg.“ Fund **„Foto der Notizbuchseite“** (übergreifende Quest, Abschnitt 21). Etwa 5
Minuten.

**58. Aufgabenreihe Silicon Bay** · Runden `siliconBay.reiheTheo`, `siliconBay.reiheNova`
Ort `siliconBay.akademie` · Theo, Nova. Ereignis: Aufgaben nach R30a. Theo: Eröffnungsgrundsätze
(Buch Kapitel 1, Abschnitte 1.1 bis 1.3; Übungen 6, 8, 9 nach `07_Aufgabenzuordnung.md`). Nova:
Fallen (Kapitel 4, Abschnitte 4.1 bis 4.3; Übungen 19, 20, 21, Thema `falle`). Erste bestandene
Reihe: Zweite Chance. Etwa 15 Minuten.

**59. Warum man im Club schweigt** · `akt3.schweigen` · Sprüche (S2)
Ort `siliconBay.akademie`, vor dem Clubkampf · Ambrose, {held}. Ereignis: Dialog (kurz). {held}
will vor der Partie gegen Dr. Lin einen Spruch üben. Ambrose: „Am Brett eines Clubs schweigt man.
Im Park redet man.“ {held}: „Warum?“ Ambrose: „Im Park spielt man um eine Limonade. Im Club um die
Ehre des anderen. Wer ihn stört, nimmt ihm die Partie weg, nicht nur die Zeit.“ Dazu: Auch in
echten Turnieren gilt Ruhe, und den Gegner abzulenken ist verboten. Die Sprüche sind im Clubkampf
nicht spielbar (S2); die Kartenleiste zeigt sie grau. Etwa 2 Minuten.

**60. Clubkampf Silicon Bay** · `akt3.clubnadelSiliconBay` · H `siliconBay.akademie`
Ort `siliconBay.akademie` · Dr. Lin, Victor, Juno. Ereignis: Partie gegen die Clubchefin
(Zielstärke E + 460), Wahl der Zeitklasse, Karten (keine Sprüche). Dr. Lin spielt die Eröffnung
lehrbuchrein und wird im Mittelspiel vorsichtig; Ambrose rät zu Mut („Lass sie das Buch zuklappen.“).
Belohnung: **Clubnadel Silicon Bay**, Ambroses Notiz, Mentor-Zug (R27), 50 Münzen. Dr. Lin nach der
Partie: „Ich habe Sie nichts gelehrt. Sie mich.“ (Sie siezt aus Respekt, einmal.) Etwa 30 Minuten.

**61. Die Nacht mit dem Tablet** · `akt3.ambroseGebannt`
Ort `siliconBay.aussen` (Hotel, Nacht) · Ambrose, {held}. Ereignis: Dialog. {held} wacht nachts auf;
das Tablet leuchtet neben dem Brett, ZERO spielt Partie um Partie gegen sich selbst. Ambrose: „Ich
habe zugesehen. Die ganze Nacht. Sie spielt, wie ich immer spielen wollte.“ {held}: „Und ich?“
Ambrose antwortet nicht. Juno fährt am Morgen zurück: „Pass auf ihn auf. Er klingt komisch.“ Etwa
3 Minuten.

### Weg 5 und Port Delacroix

**62. Auf der Fähre** · W `wegSiliconDelacroix` · Flashback-Vorbereitung
Ort `wegSiliconDelacroix.faehre`, `.deich` · Mama, Ambrose, Schiffskoch Mr. Ruiz (er). Ereignis:
Rätseltafel (3 Bauernstrukturen), Stellungsduell mit Uhr gegen den Schiffskoch (Schnellschach,
Sprüche erlaubt, er ist nicht immun), Funde, Weisheit am Deich. Mama fährt mit: Das Regionalturnier
findet in Port Delacroix statt, und sie hat sich als Helferin im Notzelt gemeldet. Ambrose ist
unruhig, je näher die Küste kommt: „Diese Luft. Salz und Holz. Ich kenne diese Luft.“ Am Deich der
erste Blick auf die Stadt: abgedeckte Dächer, Bauzäune, Musik aus einem Zelt. Etwa 15 Minuten.

**63. Der Vorwurf** · `akt3.tiefpunkt` · H `portDelacroix.tiefpunkt` · R28, R29
Ort `portDelacroix.turnhalle` · Miss Odile, Remy, Lou, Mama, Ambrose. Ereignis: Dialog. Beim
Regionalturnier gewinnt {held} eine Partie mit einem Zug, den Remy für „unmöglich“ hält. Er hat
gesehen, wie {held} vorher mit dem Brett geflüstert hat, und sagt vor allen: „Du schummelst. Wie die
mit ihren Bildschirmen. Nur altmodischer.“ Stille in der Halle. {held} kann nichts beweisen. Ambrose
sagt nur: „Er hat nicht ganz unrecht.“ (`#stimmung:still`). {held} entscheidet: „Dann spiele ich
ohne dich.“ Ab jetzt: Mentor-Zug gesperrt (R29), Clubkampf ohne Karten (R28), Ambrose schweigt bis
Szene 68 außer einem Satz je Szene. Mama nimmt {held} danach in den Arm: „Ich weiß, wie sich das
anfühlt. Fast.“ Etwa 5 Minuten.

**64. Bretter sammeln** · N hilfe `portDelacroix.wiederaufbau` (Besuch 1 von 3)
Ort `portDelacroix.aussen` · Miss Odile, Helfer, Mrs. Arceneaux. Ereignis: Ort und Dialog. Der Club
braucht Bretter; {held} geht durch die Stadt und sammelt bei den Familien gerettete Bretter und
Figuren (vier Auslöser an Häusern, je ein Satz: „Das hat mein Großvater geschnitzt. Nehmt es.“).
Miss Odile singt beim Sortieren. Ohne Ambrose fühlt sich das gut und einsam zugleich an. Belohnung:
20 Münzen, Wiederaufbau Schritt 1. Etwa 8 Minuten.

**65. Batiste am Kai** · S `portDelacroix.batiste` · Sprüche (S4, immun)
Ort `portDelacroix.aussen` · Mr. Batiste. Ereignis: Stellungsduell ohne Uhr aus Kapitel 6
(Abbildung 6.5, geprüft im dritten Auftrag), Zielstärke A ± 0. Batiste ist gegen beide Sprüche
immun („Junge Leute reden. Das Wasser hört nicht zu.“), das steht nach dem ersten Versuch im
Steckbrief. Wer ihn schlagen will, muss einfach gut spielen. Belohnung: 10 Münzen, beim ersten Sieg Zweite Chance und der
Spruch **Pokerface** (S8); Batiste: „Mach ein Gesicht wie das Wasser. Dann weiß keiner, was
darunter ist.“ Etwa 8 Minuten.

**66. Flashback: Die Werkstatt** · `akt3.flashbackWerkstatt` · F (Port Delacroix)
Ort Sepia-Karte `flashback.werkstatt` · der junge Ambrose als Held. Auslöser: Vor der Werkstatt
Whitlock-Duval riecht {held} frisch gehobeltes Holz; Ambrose, der seit Tagen schweigt, sagt: „Hier.
Hier war es.“ Teil 1 (1840, etwa 1 Minute): Der neunjährige Ambrose fegt Späne, der Vater stellt
Figuren aus Resthölzern auf: „Ein Klavier und ein Schachbrett haben eines gemeinsam, Ambrose. Jede
Taste, jede Figur muss ihren Platz kennen.“ Teil 2 (1852, etwa 3 Minuten): Ambrose, 21, zurück aus
London, spielt Vater und der kleinen Schwester Claire den Anfang der „Unsterblichen Partie“ vor:
Zugerraten von `klassik-unsterbliche` aus `inhalte/zusatzpartien/klassiker.json`, mit Weiß von Zug 1
bis Zug 11 (Königsgambit, der Läufer wird schon im 5. Zug angegriffen). Claire klatscht bei jedem
Opfer. Zurück in der Gegenwart, leise: „Claire. Sie hat das Brett geerbt. Deshalb bist du hier.“
Belohnung: **Partiefragment 5**. Hinweis: Die Sammlung hat vor 1866 nur drei Partien, alle schon
benutzt; deshalb der Anfang der Partie, deren Ende der Flashback in Riverton zeigt (Bericht).
Etwa 4 Minuten.

**67. Clubkampf Port Delacroix (ohne Ambrose)** · `akt3.clubnadelPortDelacroix` · H `portDelacroix.tiefpunkt`
Ort `portDelacroix.turnhalle` · Miss Odile, Remy, Lou, Mama. Ereignis: Partie gegen die Clubchefin
(Zielstärke E + 520), **keine Karten** (R28), Wahl der Zeitklasse erlaubt. Ambrose schweigt; vor der
Partie nur ein Satz: „Spiel deine Partie.“ Miss Odile: „Ein Plan ist kein Sprint.“ Nach der Partie
bei jedem Ausgang: Miss Odile reicht {held} die Hand und sagt vor allen: „Das war deine Partie. Jeder
hier hat es gesehen.“ Remy schweigt, aber nickt. Belohnung: **Clubnadel Port Delacroix** (bei Sieg;
ohne Karten ist Gold möglich), Ambroses Notiz erst nach Szene 73 (er kommentiert nicht), 50 Münzen,
Mentor-Zug wie R27, aber erst nach der Versöhnung spielbar. Etwa 30 Minuten.

**68. Die Nachfahren** · `akt3.nachfahren` · N begegnung `portDelacroix.nachfahren` · O2
Ort `portDelacroix.werkstatt` · Henri, Céleste, Ambrose. Ereignis: Dialog, dann Partie. Henri zeigt
die Werkstatt, die Klaviere, ein altes Foto an der Wand: ein junger Mann mit einem Schachbrett, „ein
Vorfahr, keiner weiß mehr, wer“. Ambrose bricht sein Schweigen: „Das bin ich.“ (`#pause`) Céleste
findet Schach langweilig, aber das alte Brett in {held}s Rucksack „sieht cool aus“. Sie spielt eine
Partie aus Neugier (Begegnung aus der Grundstellung, Rolle `story`, sehr schwach, A − 300; zählt
für die App), schiebt „die Pferde rum“ und verliert gern: „Okay, das war nicht so schlecht. Aber ich
geh jetzt skaten.“ Ambrose, zum ersten Mal seit Tagen warm: „Sie muss es nicht lieben. Es reicht,
dass sie einmal gespielt hat.“ (O2) Dann zu {held}: „Ich wollte, dass alles, was ich war, Schach
ist. Hier sehe ich: Es reicht, dass es Menschen gibt, die weitermachen. Mit Klavieren. Mit dir.“
Wirkung: Dialogvariable `ambroseSprichtWieder`. Etwa 12 Minuten.

**69. Die Benefiz-Simultan** · N hilfe `portDelacroix.wiederaufbau` (Besuch 2 von 3)
Ort `portDelacroix.turnhalle` · Miss Odile, Remy, Lou, Kinder der Stadt. Ereignis: Benefiz-Simultan:
{held} spielt nacheinander drei kurze Stellungsduelle gegen Kinder der Stadt (Aufgabenformat oder
drei Duelle, Datenauftrag), jedes Kind spendet einen Dollar in die Kasse für das Musikhaus. Remy
spielt das dritte Brett und entschuldigt sich danach: „Ich hab dich beobachtet. Du redest mit dem
Brett, aber du spielst allein. Tut mir leid.“ Belohnung: 30 Münzen (gehen in die Kasse), Wiederaufbau
Schritt 2, und von Miss Odile die Karte **Schutzengel** (K4): „Damit du nicht wieder etwas
verlierst, was dir wichtig ist.“ Etwa 10 Minuten.

**70. Das Schild** · N hilfe `portDelacroix.wiederaufbau` (Besuch 3 von 3)
Ort `portDelacroix.musikhaus` · Miss Odile, Remy, Lou, Henri, Mama. Ereignis: Dialog, Ort. Beim
dritten Besuch (frühestens nach Desert Springs, Schnellreise mit der Fähre) ist das Dach des
Musikhauses neu; Henri hat ein Klavier gestiftet. {held} hängt das Schild auf: „Musik- und Schachclub
Port Delacroix, seit 1889“. Spur auf der Karte (09, Regel 4): Bretter auf den Tischen, das Schild
über der Tür. Belohnung: Karte **Springervorgabe** (R27: alle Nebenquests der Stadt), Fund „Erstes
Brett im neuen Musikhaus“ (Bretthintergrund „Musikhaus am Kai“), Dialogvariable `musikhausOffen`.
Etwa 5 Minuten.

### Weg 6 und Desert Springs

**71. Der Wüstenzug** · W `wegDelacroixDesert`
Ort `wegDelacroixDesert.canyonpfad` · Ambrose, Mrs. Holloway. Ereignis: Rätseltafel (3
Königsangriffe), Weisheit, Fund „Eidechsenhaut“. Der Zug hält an einem einsamen Bahnhof; dann zu
Fuß in den Canyon. Hitze, Stille, ein Roadrunner. Ambrose spricht wieder, aber vorsichtig: „Ich war
nie in einer Wüste. Sie ist so still wie ein Club.“ Etwa 8 Minuten.

**72. Mira auf dem Stein** · `akt3.miraStein`
Ort `wegDelacroixDesert.canyonpfad` · Mira, Ambrose. Ereignis: Dialog. Mitten im Canyon sitzt ein
Mädchen auf einem flachen Stein und spielt gegen sich selbst. Sie opfert gerade ihre Dame. Ambrose
ist hingerissen: „Sie spielt wie ich mit zwanzig. Nur besser.“ Mira: „Wer bist du? Bist du gut?
Dann komm morgen in die Garage.“ Etwa 3 Minuten.

**73. Die Versöhnung** · `akt3.versoehnung` · H `desertSprings.versoehnung` · R29 endet
Ort `wegDelacroixDesert.felsbogen` (Abend, Licht wie Kupfer) · Ambrose, {held}. Ereignis: Dialog. Am
Felsbogen bleibt {held} stehen. Ambrose bittet um Verzeihung, auf seine Art: „Ich habe einer Maschine
zugesehen, weil sie nie zweifelt. Aber ich habe vergessen, dass du zweifelst. Und trotzdem spielst.
Das ist schöner.“ Wahl: „Ich hab dich vermisst.“ / „Du warst ein Idiot.“ / „Erzähl mir von 1866.“
Bei jeder Wahl erzählt er kurz und ohne Einzelheiten: Hale hatte geschrieben, er solle kommen; er
brach auf, wurde unterwegs krank und kam nie an. „Ich bin nicht angekommen. Darum warte ich noch.“
Er lehrt das **romantische Opfer** (Buch Kapitel 1, Abschnitt 1.6, Goldene Angriffsregel; Kapitel
11, Abschnitt 11.2, Morphy) in einer Lektion mit zwei Bildschirmen. Ab jetzt ist der Mentor-Zug
wieder spielbar (R29). Unter dem Felsbogen läuft die alte Eisenbahnbrücke; an ihren Nieten steht
„J. H.“. Fund **„Nieten J. H. an der Canyonbrücke“** (Auflösung von „Nietenkopf J. H.“ aus Akt 2:
Hale baute nach 1866 weiter, bis hierher). Ambrose: „Er hat gelebt. Lange. Gut so.“ Etwa 8 Minuten.

**74. Buck an der Tankstelle** · S `desertSprings.buck` · Sprüche
Ort `desertSprings.aussen` · Buck. Ereignis: Stellungsduell mit Uhr (Blitz) aus Kapitel 8
(Abbildung 8.44, geprüft im dritten Auftrag), Zielstärke A − 100, Sprüche erlaubt, Buck nicht immun
und mit eigenen Sprüchen („Hier draußen fährt keiner langsam. Auch nicht am Brett.“). Belohnung:
Karte **Großes Maul** beim ersten Sieg (S1, Zeitkarte), 10 Münzen. Etwa 8 Minuten.

**75. Aufgabenreihe Desert Springs** · Runden `desertSprings.reiheTomas`, `desertSprings.reiheDot`
Ort `desertSprings.garage` · Tomás, Dot. Ereignis: Aufgaben nach R30a. Tomás: Mattbilder mit Opfer
(Buch Kapitel 7, Abschnitt 7.4; Übungen 44, 45, 48). Dot: Königsangriff (Kapitel 1, Abschnitt 1.6;
Kapitel 6, Abschnitte 6.3, 6.6; Übungen 7, 27, 33, 34). Erste bestandene Reihe: Zweite Chance. Etwa
15 Minuten.

**76. Der Brief** · N rätsel `desertSprings.brief` · E4 (Auflösung „Umschlag ohne Brief“)
Ort `desertSprings.antiquariat` · Mr. Okoro, Dot, Ambrose. Ereignis: Stellungsrätsel und Dialog. Dot
erzählt, dass Mr. Okoro „den Kram von einem alten Brückenbauer“ im Keller hat. In einer Kiste liegt
ein Bündel Briefe; einer ist mit einem Siegel verschlossen, auf dem dieselbe Stellung geprägt ist
wie auf dem Umschlag aus Ironwood (Runde `desertSprings.siegel`, 1 Aufgabe, Thema `fesselung`). Wer
den Umschlag hat (`hatUmschlagOhneBrief`), sieht: Das Siegel passt. Der Brief, 1866, von Josiah
Hale: „Komm nach Norden. Wir spielen die letzten Züge an einem Brett. Ich warte.“ Ambrose liest mit
{held} (`#pause`), dann: „Er hat gewartet. Er hat wirklich gewartet.“ Wirkung: Gegenstand
**„Hales Brief“**, Fragment 7 (die letzten Züge, die Hale vorschlug), Dialogvariable `briefGelesen`.
Belohnung: Flüstern (R27, Rätsel). Etwa 8 Minuten.

**77. Erinnerung: Das letzte Spiel 1858** · N begegnung (Erinnerung) `desertSprings.erinnerung1858`
Ort `desertSprings.garage` (Abend) · Ambrose, Mira. Ereignis: Stellungsduell aus Ambroses erfundener
siebter Matchpartie gegen Hale (1858), am Moment seines tollkühnen Opfers: Diesmal spielt {held} die
Stellung weiter, mit Weiß, gegen Hale (Rolle `story`, E + 500). Die Stellung baut ein Folgeauftrag
mit der Engine (erfunden, C3: „Ambroses eigene Partie bleibt erfunden“; Vorteil +0,8 bis +2,5 nach
R13, weil das Opfer korrekt war und Ambrose es nur falsch fortsetzte). Mira schaut zu und ruft:
„Das Opfer war richtig! Du hast nur danach gezögert!“ Ambrose lacht: „Hundertsechzig Jahre, und ein
Kind sagt es mir.“ Belohnung: **Partiefragment 6** (keine weitere starke Karte, ENTSCHEIDUNGEN 08.11.: nur die
erste Erinnerung je Staffel gibt die Bauernvorgabe), 20 Münzen. Etwa 10 Minuten.

**78. Clubkampf Desert Springs** · `akt3.clubnadelDesertSprings` · H `desertSprings.versoehnung`
Ort `desertSprings.garage` · Mira, Tomás, Dot, Ambrose. Ereignis: Partie gegen die Clubchefin
(Zielstärke E + 580), Wahl der Zeitklasse, Karten erlaubt (Mentor-Zug wieder frei). Ambrose und
{held} spielen zum ersten Mal wieder „gemeinsam“: Er kommentiert, aber {held} entscheidet. Mira
opfert früh; wer kühl rechnet, gewinnt. Belohnung: **Clubnadel Desert Springs**, Ambroses Notiz
(jetzt auch für Port Delacroix nachgeholt), 50 Münzen, Mentor-Zug (R27). Mira: „Noch mal. Jetzt.“
Etwa 30 Minuten.

**79. Abend am Motel** · `akt3.abendMotel`
Ort `desertSprings.aussen` (Nacht, Sterne) · Ambrose, {held}, Anruf von Juno, Nachricht von Victor.
Ereignis: Dialog. Juno ruft an und zählt die Nadeln: sieben. Victor schreibt: „Ich glaube dir. Wegen
des Bretts.“ und „Landesmeisterschaft im Sommer. Ich hab gehört, Nova spielt auch.“ Ambrose blickt
auf das Tablet, das {held} in den Rucksack gesteckt hat: „Gib es Theo zurück, wenn du ihn siehst.
Ich brauche es nicht mehr.“ Etwa 4 Minuten.

**80. Rückweg und Ausblick** · `akt3.ende`
Ort Schnellreise nach Port Delacroix (Szene 70, falls offen) oder nach Maple Falls · Mama, Ambrose.
Ereignis: Dialog. Mama auf der Rückfahrt: „Nächster Halt: Summit City. Großmeisterin Ward. Ich hab
schon Urlaub eingereicht.“ Ende von Akt 3. Etwa 3 Minuten.

### Zeitrechnung

| Teil                                                            | Minuten                                               |
| --------------------------------------------------------------- | ----------------------------------------------------- |
| Wege beim ersten Mal (52, 62, 71)                               | etwa 35                                               |
| Dialoge und Laufen (51, 53, 55, 57, 59, 61, 63, 72, 73, 79, 80) | etwa 50                                               |
| Partien Hauptstory (60, 67, 78)                                 | etwa 90                                               |
| Aufgabenreihen (58, 75)                                         | etwa 30                                               |
| Nebenquests, Flashback, Erinnerung (56, 64, 66, 68–70, 76, 77)  | etwa 65                                               |
| Straßengegner (54, 65, 74)                                      | etwa 24                                               |
| **Summe**                                                       | **etwa 295, also 5 bis 6 Stunden mit Wiederholungen** |

Kürzungen, falls nötig: zuerst Szene 74 (Straße), dann Szene 77 (Erinnerung kürzer), dann der dritte
Wiederaufbau-Besuch als reiner Dialog.

### Verteilung der Nebenquests

| Stadt          | rätsel                                | hilfe                                       | begegnung                                            |
| -------------- | ------------------------------------- | ------------------------------------------- | ---------------------------------------------------- |
| Silicon Bay    | Rätseltafel Weg 4                     | –                                           | `siliconBay.spielberichte` (analysiert, C2)          |
| Port Delacroix | Rätseltafel Weg 5                     | `portDelacroix.wiederaufbau` (drei Besuche) | `portDelacroix.nachfahren` (O2), Flashback Werkstatt |
| Desert Springs | `desertSprings.brief` (E4, Auflösung) | –                                           | Erinnerung 1858                                      |

Der Zustand „abgelenkt“ kommt in Akt 3 nicht vor; nach dem Tiefpunkt wäre eine Ablenkungs-Quest
gegen Miss Odile unpassend, und Mira ist zehn Jahre alt. Stattdessen wirken die Sprüche gegen
Straßengegner.

## 21. Entdeckungen in Akt 3

| Ort            | Fund                                | Wo                               | Satz                                                             | Wirkung                                     |
| -------------- | ----------------------------------- | -------------------------------- | ---------------------------------------------------------------- | ------------------------------------------- |
| Weg 4          | Werbe-Anstecker ZERO                | Raststätte, Boden                | Juno: „Gratis. Natürlich.“                                       | 5 Münzen                                    |
| Weg 4          | verlorener Ohrstöpsel               | Glasbrücke                       | „Für einen Ohrstöpsel ist er sehr schwer.“                       | Hinweis zu Szene 56                         |
| Silicon Bay    | Ohrempfänger                        | Serverraum, Schublade (Szene 56) | „Das ist kein Kopfhörer.“                                        | Beweisstück für Akt 4                       |
| Silicon Bay    | Foto der Notizbuchseite             | Lobby, Vitrine (Szene 57)        | Ambrose: „Das sind meine Züge.“                                  | übergreifend, Akt 4 (neu)                   |
| Silicon Bay    | Holzdame im Blumenkübel             | Campus (versteckt)               | „Die einzige Holzfigur in dieser Stadt.“                         | E3: Figurensatz „Waldholz“-Ergänzung (Dame) |
| Weg 5          | Flaschenpost                        | Fährdeck, Reling                 | „Ein Brief ohne Absender. Wie romantisch.“                       | 10 Münzen                                   |
| Weg 5          | Muschel mit Loch                    | Deich (versteckt)                | Lou später: „Die bringt Glück. Steht fest.“                      | 5 Münzen                                    |
| Port Delacroix | Altes Foto mit Brett                | Werkstatt (Szene 68)             | Ambrose: „Das bin ich.“                                          | Album                                       |
| Port Delacroix | Trompetenmundstück                  | Ruine des Musikhauses            | Remy: „Das ist meins! Ich dachte, es ist weg.“ (Remy freut sich) | 10 Münzen                                   |
| Port Delacroix | Erstes Brett im neuen Musikhaus     | Szene 70                         | „Seit 1889. Und wieder.“                                         | E3: Bretthintergrund „Musikhaus am Kai“     |
| Weg 6          | Eidechsenhaut                       | Canyonpfad                       | „Sie hat sich umgezogen und ist weg.“                            | 5 Münzen                                    |
| Weg 6          | Nieten J. H. an der Canyonbrücke    | Felsbogen (Szene 73)             | „Er hat gelebt. Lange.“                                          | Auflösung Akt 2                             |
| Desert Springs | Hales Brief                         | Antiquariat (Szene 76)           | „Ich warte.“                                                     | Auflösung Akt 2, Fragment 7                 |
| Desert Springs | Miras erster Pokal (aus einer Dose) | Garage                           | „Ich hab ihn selbst gemacht. Von Slick inspiriert.“              | 10 Münzen                                   |

**Übergreifende Quests (E4):**

1. **„Umschlag ohne Brief“ (aus Akt 2) – aufgelöst** in Szene 76: Das Siegel passt, Hale hat auf
   Ambrose gewartet. Voraussetzung im Datenauftrag: Gegenstand `umschlagOhneBrief`.
2. **„Nietenkopf J. H.“ (aus Akt 2) – aufgelöst** in Szene 73: dieselben Nieten an der Canyonbrücke
   von 1879; Hale baute weiter und lebte lange.
3. **„Die fehlende Seite“ (neu, geht in Akt 4 auf):** Das Foto der Notizbuchseite aus der Vitrine
   der Hales (Szene 57) zeigt Ambroses Züge der Fernpartie; Hales Antwort stand auf der
   herausgerissenen Seite. Plan für Akt 4: Victor hat die Seite seit Jahren in seinem Schachbuch
   versteckt, weil sein Vater sie „wertlos“ fand; er gibt sie {held} nach seiner Krise (Summit City).
   Mit Hales Brief (Fragment 7), der Seite und allen Fragmenten wird in Ghost Town die Fernpartie
   vollständig, und Ambrose spielt sie am Ende mit {held} zu Ende.

## 22. Läden in Akt 3

| Laden                        | Figur          | Angebot                                                                             | Preis |
| ---------------------------- | -------------- | ----------------------------------------------------------------------------------- | ----- |
| `siliconBay.foodtruck`       | Rosie          | Zweite Chance                                                                       | 20    |
|                              |                | Ambroses Flüstern                                                                   | 40    |
|                              |                | Fährfahrkarte Silicon Bay ↔ Port Delacroix                                          | 15    |
| `portDelacroix.gebaeckstand` | Mrs. Arceneaux | Zweite Chance (Erlös für das Musikhaus)                                             | 20    |
|                              |                | Bretthintergrund „Delta bei Sonnenuntergang“ (Extra)                                | 60    |
|                              |                | Spende für das Musikhaus (Album, ohne Wirkung)                                      | 10    |
| `desertSprings.antiquariat`  | Mr. Okoro      | Ambroses Flüstern                                                                   | 40    |
|                              |                | Zugfahrkarte Port Delacroix ↔ Desert Springs                                        | 15    |
|                              |                | Altes Schachbuch (Album, Text „Ein Buch, das ich gern geschrieben hätte“ – Ambrose) | 30    |

Zeitkarten (Sprüche) gibt es nie im Laden (Z4): Grübelfalle (Szene 54), Großes Maul (Szene 74),
Kühler Kopf aus Akt 2 (Zeitbonus).

## 23. Hilfskarten, Sprüche und Sperren in Akt 3

| Karte oder Regel     | Wo                                      | Warum                                                          |
| -------------------- | --------------------------------------- | -------------------------------------------------------------- |
| Grübelfalle (S1)     | Szene 54, erster Sieg gegen Dash        | erste Spruchkarte, im Park von Silicon Bay                     |
| Großes Maul (S1)     | Szene 74, erster Sieg gegen Buck        | ersetzt den Zeitnot-Trick aus Akt 2 dem Namen nach             |
| Mentor-Zug gesperrt  | Szenen 63 bis 73                        | R29, Tiefpunkt bis Versöhnung                                  |
| Alle Karten gesperrt | Szene 67                                | R28, Clubkampf ohne Ambrose                                    |
| Springervorgabe      | Szene 70 (alle Nebenquests einer Stadt) | R27                                                            |
| Flüstern             | Szene 76                                | R27, Rätsel                                                    |
| Reisebrett           | Szene 51a, Juno zum Abschied            | freie Übungspartien überall (11, I3)                           |
| Pokerface (S8)       | Szene 65, erster Sieg gegen Mr. Batiste | „ein Gesicht wie das Wasser“; danach Laden Port Delacroix (30) |
| Schutzengel (K4)     | Szene 69, Benefiz-Simultan              | Dank des Clubs; danach Laden Desert Springs (50)               |
| Spickzettel (K7)     | Laden Silicon Bay (20)                  | erste käufliche Vorbereitung                                   |
| Kartentasche (I2)    | Vorschlag: Laden Silicon Bay (350)      | vier Karten erst ab Akt 3 (11, 7.4)                            |

Immunität im Steckbrief (S4): Dash immun gegen „Großes Maul“, Batiste immun gegen beide. Das
Format der Steckbriefzeile kennt dafür noch keine Art (Bericht).

## 24. Offene Fragen an den Autor (Akt 3)

1. **Geburtsort Ambroses.** Teil 1 nennt New Orleans, O1 Port Delacroix. Empfehlung: geboren und
   aufgewachsen in Port Delacroix (Klavierwerkstatt), Schach in den Kaffeehäusern von New Orleans;
   die Zeile 1831 in Teil 1 wird angepasst (Bericht, Haupt-Chat).
2. **Hurrikan und Jahreszeit.** O1 sagt Spätsommer, 09 setzt Akt 3 in Winter und Frühjahr.
   Empfehlung: Der Hurrikan war im letzten Spätsommer; Akt 3 zeigt den Wiederaufbau im nassen
   Winter. So bleibt der Ton Hoffnung statt Katastrophe.
3. **Wer erhebt den Vorwurf?** Empfehlung: Remy, ein Kind aus der Stadt, das dem Konzern misstraut;
   nicht Nova (sie hat selbst ein Geheimnis) und kein Erwachsener (Dokument 02, 2.3). Er entschuldigt
   sich in Szene 69.
4. **Nova in Akt 3 noch ohne Auflösung.** Empfehlung: ja; {held} schweigt aus Rücksicht, der Beweis
   (Spielberichte, Empfänger) wird in Akt 4 zusammen mit Dr. Lin vorgelegt.
5. **Flashback mit einer schon benutzten Partie.** Empfehlung: die Sammlung um eine öffentliche Partie
   vor 1850 erweitern (C3 erlaubt das), etwa aus den Matches der 1830er Jahre, und den Flashback
   dann umstellen; bis dahin der Anfang der Unsterblichen.
6. **Céleste ohne Bekehrung.** Empfehlung: Sie bleibt ohne Schachinteresse; genau das ist die Lehre
   für Ambrose (O2).

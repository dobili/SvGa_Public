# Sammlung der Rückmeldungen zum Schach-Abenteuer (Beta)

Stand: 11.11.2026. Offene Punkte: 31. Abgeschickt (gepusht): noch nichts.

Reihenfolge je Kategorie: zuerst, was das Weiterspielen verhindert, dann Störendes, dann Schönheitsfehler.

## Fehler (etwas geht nicht)

## Übergänge und Kollision

- [ ] R026. Maple Falls, Stadtpark, oben, Stege und Ufer: Oberhalb des Flusses ist nur Gras. Optisch kann man über den rechten Steg gehen und am Ufer links zum linken Steg laufen, oder umgekehrt. Alle Orte oben wären so über beide Stege erreichbar. Soll der kaputte Steg nach seiner Reparatur in der Geschichte Sinn haben, darf man den Ort nicht auch über den anderen Steg erreichen können. Das müsste optisch so gelöst sein, dass man nicht einfach am anderen Ufer von Steg zu Steg laufen kann. Zusammenhang mit R024 und R025.
- [ ] R030. Zedernpfad, Wald: Der Zedernwald ist nicht sehr dicht. Mit der Figur kann man nahezu unten am Rand von links nach rechts laufen und dann nach oben zum Ausgang, ohne dem Weg zu folgen. Dabei umgeht man das komplette Gebirge. Das kann nicht Sinn der Sache sein.
- [ ] R031. Alle Karten, Abkürzungen: Prüfen, ob man an Stellen, an denen man dem Weg folgen soll, durch Wald oder Ähnliches abkürzen kann. Ist vorgesehen, dass man dem Weg folgt, soll das nicht möglich sein. Ausnahme: Es ist für die Geschichte nicht schlimm oder es gibt im Wald etwas zu entdecken. Zusammenhang mit R030.

## Karten und Grafik

### Alle Karten (Regel)

- [ ] R005. Alle Karten, Innentüren: Für Türen im Inneren (zwischen Räumen) wird dasselbe Asset wie für die Haustür benutzt. Es wirkt falsch, weil die Wand fast doppelt so hoch ist wie die Tür. Für Innentüren muss ein anderes, passendes Asset gefunden werden. Konkret betroffen: Diner (siehe R005a).
  > „Wir müssen für so Türen in den Innenräumen ein anderes Asset finden.“

### Maple Falls, Falls Diner (`maple-falls-diner`)

- [ ] R003. Maple Falls, Diner: Die Kaffeemaschine steht nicht auf der Theke, sondern schwebt in der Luft neben der Theke (vom Autor bestätigt).
  > „Da steht die Kaffeemaschine nicht auf der Theke, sondern halt schwebt so in der Luft neben der Kaffeemaschine.“
- [ ] R004. Maple Falls, Diner, Theke: Kasse und Kaffeemaschine zeigen zu den Barhockern hin, wo die Kundschaft sitzt. Das ergibt keinen Sinn. Vorschlag des Autors: Anordnung drehen. Unterhalb der Theke der Bereich, wo die Mitarbeiter stehen; die Barhocker oberhalb der Theke, wo die Kunden sitzen. Dann müssen die Assets für Kasse und Kaffeemaschine nicht getauscht werden.
- [ ] R005a. Maple Falls, Diner, Innentüren: Die Innentür rechts, die nach hinten ins Hinterzimmer führt, ist dasselbe Asset wie die Haustür und wirkt merkwürdig (Wand fast doppelt so hoch wie die Tür). Dasselbe gilt für die Innentüren der Toiletten auf der linken Seite. Siehe R005.
- [ ] R006. Maple Falls, Diner, Hinterraum oben rechts: Dort steht eine zerstörte Kommode. Dem Autor erschließt sich nicht, warum. Bleibt nur, wenn es eine Geschichte dazu gibt, die sie erklärt; sonst weg.
- [ ] R007. Maple Falls, Diner, Küche hinten: Wunsch nach einem größeren Arbeitstischbereich. Derzeit stehen zwei Tische im Raum. Die Fläche in der Mitte soll mit mehr Tischen in einer Reihe bestückt werden, an denen die Küche arbeiten würde.
- [ ] R009. Maple Falls, Diner: Ein kleiner Barhocker steht links direkt hinter einem der roten Stühle (beziehungsweise rechts daneben). Er passt nicht zum Diner und sein Platz erschließt sich nicht.
- [ ] R010. Maple Falls, Diner, Eingangsbereich: Der Bereich ist nur eine leere Fläche. Idee: ein netter Teppich, der zu einem Diner passt.

### Maple Falls, Clubraum der Maple Falls High (`maple-falls-clubraum`, Variante Pokal: `maple-falls-clubraum-pokal`)

- [ ] R011. Maple Falls, Clubraum, Pokalschrank (Vitrine) und Spinde hinten rechts: Die Assets passen perspektivisch nicht. Bei den sonst benutzten Regalen sieht man von oben auch ein Stück der Oberseite des Schranks; bei Vitrine und Spinden nicht, sie sind frontal gedacht. Eine Decke daraufzumalen würde nach Einschätzung des Autors vermutlich nicht gut aussehen. Beide Elemente gefallen ihm und sollen bleiben, brauchen aber andere Assets. Außerdem prüfen, ob dieselben Assets auf anderen Karten eingesetzt sind.
- [ ] R012. Maple Falls, Clubraum, linke und rechte Wand mittig (vermutlich, Autor unsicher): Ein Bücherregal von der Seite. Das Asset ist hässlich. Zuerst klären, was es überhaupt darstellen soll, dann ein anderes Asset dafür finden.
- [ ] R013. Maple Falls, Clubraum, hinten rechts an der Wand: Drei Rechtecke (rot, blau, grün), die scheinbar an einer Stange hängen, sehen aus wie ein Aufkleber an der Wand. Soll es ein Aufkleber sein, ist es in Ordnung. Soll es etwas mit Tiefe sein (etwa eine Stange, an der etwas hängt), muss ein anderes Asset her. Der Autor sieht darin und in R011/R012 mögliche Beispiele für selbst mit Gemini erstellte Assets; der Hauptchat soll entscheiden.
- [ ] R014. Maple Falls, Clubraum, hinten an der Wand: Das Schild „Erst zählen“ bedeckt die ganze Wand (in Ordnung), ragt aber leicht in die Decke hinein, ist also etwas zu groß oder zu hoch. Wunsch: herunterskalieren, sodass der Text noch lesbar ist und das Schild nur die Wandhöhe bedeckt.
- [ ] R015. Maple Falls, Clubraum, Tisch in der Mitte oben: Der Globus steht direkt auf dem Buch, das würde man so nicht machen. Vorschlag: den Globus auf eines der Regale stellen, etwa oben auf das Regal, das links im Raum steht.
- [ ] R016. Maple Falls, Clubraum, Wechsel von der Variante Grund zur Variante Pokal: Das Plakat „Erst zählen“ oben rechts verschiebt sich.
- [ ] R017. Maple Falls, Clubraum, Variante Pokal: Es kommen Stühle hinzu, an Tischen, an denen in der Variante Grund nur ein Stuhl stand. Der Autor weiß nicht, ob das gewollt ist. Wenn es von der Geschichte so gewollt ist, in Ordnung (Hauptchat prüfen).
- [x] R018. Maple Falls, Clubraum, Variante Pokal: Der Pokal steht auf dem Tisch, vermutlich direkt auf einem anderen Gegenstand. Der Autor: kann so bleiben, fällt kaum auf. Kein Handlungsbedarf.
- [ ] R019. Maple Falls, Clubraum, Variante Pokal: Der Stuhl in der Mitte steht direkt vor oder auf einer der Figuren. Bewegen sich die Figuren, ist das zufällig und in Ordnung. Stehen sie immer an derselben Stelle, muss die Figur woanders hingehen, wenn der Stuhl kommt.

### Maple Falls, Aussen (Hauptstraße, `maple-falls-aussen`)

- [ ] R002. Maple Falls, Hauptstraße, unten links zwischen den beiden größeren Häusern: Ein kleiner rötlich-brauner Schuppen passt vom Asset her nicht. Er hat keine Tiefe wie die anderen Gebäude, wirkt wie ein Abziehbild und fällt optisch heraus. Er soll gegen etwas ausgetauscht werden, das besser passt. Wird das Asset woanders benutzt, muss es dort ebenfalls weg, weil es insgesamt nicht zum Stil passt.
  > „Sieht aus wie ein Abziehbildchen.“

### Maple Falls, Stadtpark (`maple-falls-park`, Varianten `maple-falls-park-steg-neu`, `maple-falls-park-schulbus`)

- [ ] R023. Maple Falls, Stadtpark, Brücke der Hauptstraße: Die Hauptstraße läuft von links nach rechts durchs Bild und über einen Fluss. Die Brücke überdeckt den Fluss nicht ganz, rechts bleibt ein Spalt. Entweder ist das Brücken-Asset falsch gesetzt oder generell zu kurz. Muss auf jeden Fall behoben werden.
- [ ] R024. Maple Falls, Stadtpark, oben links, defekter Steg: Er steht zum Teil auf dem Ufer, obwohl unter dem Steg-Asset Wasser zu sehen ist. Das wirkt merkwürdig. Entweder den kaputten Steg ganz ins Wasser verschieben oder den Fluss um den Steg herumbiegen.
- [ ] R021. Maple Falls, Stadtpark, Basketballplatz unten links: Das Asset wurde „aus irgendwelchen Gründen“ gegen ein neues gewechselt. Das neue zeigt einen Indoor-Platz statt eines Outdoor-Platzes und ist ein Abziehbild ohne Tiefe. Unbrauchbar. In alten Versionen nachsehen: Dort gab es einen sehr schönen asphaltierten Basketballplatz.
- [ ] R022. Maple Falls, Stadtpark, unten mittig: Ein hölzernes Gebilde, der Autor weiß nicht, ob es eine Halfpipe sein soll. Abziehbild ohne Tiefe, so nicht verwendbar. Je nachdem, was es darstellen soll, ein vernünftiges Asset erstellen. Zuerst klären, was es sein soll.
- [ ] R025. Maple Falls, Stadtpark, oben, zwei Stege: Dem Autor erschließt sich nicht, warum es zwei Stege gibt. Laut seiner Übersichtskarte führt nur der rechte Steg zu einer neuen Karte, der linke führt nirgendwohin: In dieser Übersichtskarte, die dem Autor gebaut wurde, liegt dort keine Kachel, die das Öffnen einer neuen Karte auslöst (vom Autor bestätigt). Der defekte Steg liegt laut R024 oben links. Klären (Hauptchat), ob es zwei Stege braucht.

### Weg Maple Falls nach Cedar Creek, Zedernpfad (`weg-maple-cedar-zedernpfad`)

- [ ] R027. Zedernpfad, Treppen: Der Weg führt in Schwüngen mittig durch die Karte nach oben, an zwei Stellen über Treppen. Die Treppenabschnitte sehen nicht gut aus: Es fehlen ständig Treppenkacheln, dort schimmert plötzlich der Weg durch, der ursprünglich darunter lag. Die Treppen sind nicht vollständig umgesetzt.
- [ ] R028. Zedernpfad, Gebirgszug von linkem Bildrand nach rechts: Er hört etwa mittig im Bild auf, daneben ist wieder Gras. Das ergibt perspektivisch keinen Sinn. Man könnte rechts am Gebirgszug vorbeigehen, das Gras hoch und stünde oben, ohne Höhe erklommen zu haben. Eine durchgehende Grasfläche liegt einmal oberhalb und einmal unterhalb des Gebirges, ohne dass ein Asset einen Anstieg andeutet (Problem der Höhenwahrnehmung und Perspektive). Der Autor möchte, dass online bei dem Asset-Pack, aus dem die Gebirgs-Assets stammen, und bei anderen Packs zu Gebirgen nachgesehen wird, wie das gelöst ist: ziehen die Gebirge immer komplett übers Bild, damit das Problem gar nicht entsteht, oder gibt es Assets für einen leichten, begrasten Anstieg über einen längeren Bereich (dieselbe Höhe, ohne senkrechte Wand)? Wenn nein, wird so etwas hier gebraucht.
- [ ] R029. Zedernpfad, oberer Gebirgszug: Er beginnt links relativ mittig im Bild und hört etwas weiter rechts wieder auf. Man kann links und rechts daran vorbeigehen. Dasselbe Problem wie R028.

### Maple Falls, Wohnzimmer (`maple-falls-wohnzimmer-ausgepackt`)

- [ ] R001. Maple Falls, Wohnzimmer (Familie, am Anfang; Autor meint den ausgepackten Zustand später): Die Küche ist im unteren Bereich noch kahl. Etwas ergänzen, damit es belebter aussieht.

## Figuren und Tiere

- [ ] R008. Alle Karten (zuerst gesehen im Diner, Küche): Eine Person in der Küche steht mit dem Gesicht zur Wand. Bewegen sich Figuren im Spiel von selbst hin und her, ist das in Ordnung. Stehen sie still, müssen sie logisch platziert sein, an einer sinnvollen Stelle und mit sinnvoller Blickrichtung. Der Autor bittet, das bei allen Karten zu prüfen, bei denen sich Figuren nicht von selbst bewegen.
- [ ] R020. Alle Karten, besonders Clubraum Maple Falls High: Figuren sollen sich bewegen, wenn es Sinn macht, und nicht wie Säulen herumstehen. Im Clubraum sollen sie eigentlich auf den Stühlen sitzen, weil sie Schach spielen. Der Autor weiß nicht, ob man das grafisch hinbekommt; der Hauptchat soll entscheiden, auch in Bezug auf die Geschichte. Zusammenhang mit R008 und R019.

## Geschichte und Texte

## Partien

## Aufgaben und Spielhülle

## Bedienung

## Ton

## Ideen und Wünsche

## Unklar


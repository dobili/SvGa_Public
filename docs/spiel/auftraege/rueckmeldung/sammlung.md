# Sammlung der Rückmeldungen zum Schach-Abenteuer (Beta)

Stand: 11.11.2026. Offene Punkte: 56. Abgeschickt (gepusht): noch nichts.

Reihenfolge je Kategorie: zuerst, was das Weiterspielen verhindert, dann Störendes, dann Schönheitsfehler.

## Fehler (etwas geht nicht)

## Übergänge und Kollision

- [ ] R026. Maple Falls, Stadtpark, oben, Stege und Ufer: Oberhalb des Flusses ist nur Gras. Optisch kann man über den rechten Steg gehen und am Ufer links zum linken Steg laufen, oder umgekehrt. Alle Orte oben wären so über beide Stege erreichbar. Soll der kaputte Steg nach seiner Reparatur in der Geschichte Sinn haben, darf man den Ort nicht auch über den anderen Steg erreichen können. Das müsste optisch so gelöst sein, dass man nicht einfach am anderen Ufer von Steg zu Steg laufen kann. Zusammenhang mit R024 und R025.
- [ ] R030. Zedernpfad, Wald: Der Zedernwald ist nicht sehr dicht. Mit der Figur kann man nahezu unten am Rand von links nach rechts laufen und dann nach oben zum Ausgang, ohne dem Weg zu folgen. Dabei umgeht man das komplette Gebirge. Das kann nicht Sinn der Sache sein.
- [ ] R031. Alle Karten, Abkürzungen: Prüfen, ob man an Stellen, an denen man dem Weg folgen soll, durch Wald oder Ähnliches abkürzen kann. Ist vorgesehen, dass man dem Weg folgt, soll das nicht möglich sein. Ausnahme: Es ist für die Geschichte nicht schlimm oder es gibt im Wald etwas zu entdecken. Zusammenhang mit R030.
- [ ] R032. Zedernpfad, Weltlogik (Ergänzung zum Zedernwald): Der Zedernpfad führt oben rechts hinaus zum Ortskern von Cedar Creek. Man kommt auch anders dorthin: vom Stadtpark die Hauptstraße rechts zur Landstraße, von dort ganz rechts zum Flussweg, von dort ganz rechts zum Ortskern. Landstraße plus Flussweg sind in der Breite viel länger als der Zedernpfad. Legt man die Karten aneinander, passt das nicht. Der Zedernpfad müsste sehr viel breiter sein, damit die Strecke zur Logik passt.
- [ ] R033. Weltlogik, Kürbishof und Zedernpfad: Legt man die Karten auf einer großen Fläche von links nach rechts aneinander (Stadtpark, Landstraße, Flussweg, Ortskern), liegt der Kürbishof, der von der Landstraße nach oben abgeht, oberhalb der Landstraße. Der Zedernpfad müsste dann oberhalb des Kürbishofs verlaufen. Der Autor meint, dafür müssten Verbindungskarten gebaut werden: eine, die am Kürbishof vorbei nach oben zum Zedernpfad führt, und ein Verbindungsstück vom Ende des Zedernpfads (der dann ein ganzes Stück nach rechts weitergeht) zum Ortskern. Legt er den Zedernpfad mit seinem Zugang auf den Zugang des Ortskerns, überlappt er mit der Karte „Flussweg“ (diktiert als „Plusweg“, vom Autor als Flussweg bestätigt).
- [ ] R034. Alle Außenkarten, Weltkarte (Auftrag an den Hauptchat): Der Autor bittet darum, dass eine KI die Weltkarte tatsächlich zusammenpuzzelt, indem sie die Karten über ihre Zugänge aneinanderlegt. Innenräume werden dafür nicht gebraucht. Die Weltkarte muss konsistent sein, nichts darf überlappen.
  Ergänzung des Autors: Beim Zusammensetzen auch die Übergänge von Karte zu Karte prüfen, damit zum Beispiel Flüsse und Flusswege glaubwürdig ineinander übergehen. Kleine Inkonsistenzen sind in Ordnung, wenn man sie mit einem kleinen Zwischenstück erklären kann, das nicht als Karte gezeichnet wird (sonst werden es zu viele Karten). Beispiel: Auf der Landstraße taucht oben direkt das Feld auf, das im Stadtpark noch nicht zu sehen war; das lässt sich mit einem kurzen, nicht gezeichneten Wegstück dazwischen erklären. Nicht in Ordnung wäre etwa, wenn auf der Landstraße unten links plötzlich kein Wasser mehr wäre, wo es im Anschluss noch Wasser gab; da fragt man sich, warum. Das gilt für das ganze Puzzle.
- [ ] R036. Übergang Stadtpark zur Landstraße (Maple Falls): Im Stadtpark ist die Straße gepflastert und hat Straßenmarkierungen, ein Bus fährt darüber. Beim Kartenwechsel zur Landstraße ist sie plötzlich nur noch das bräunliche Asset, wie ein Trampelpfad. Ein Übergang von der gepflasterten Straße zur Landstraße fehlt.

## Karten und Grafik

### Alle Karten (Regel)

- [ ] R055. Alle Karten, „Abziehbild“-Assets: Der Autor weiß nicht, woher die Kartenbauer diese Assets haben. Sie haben keine Tiefe und können nicht verwendet werden (siehe R002, R021, R022, R054). Er vermutet, dass sie auch auf anderen Karten eingesetzt sind; alle prüfen und überarbeiten. Mögliche Wege laut Autor: Er lässt Assets im passenden Stil zeichnen (Gemini), oder es werden passende, gut kombinierbare Asset-Packs gesucht. Die Entscheidung liegt beim Hauptchat.
- [ ] R042. Alle Karten, Bodenübergänge: Prüfen, ob die Übergänge zwischen zwei verschiedenen Boden-Assets so sinnvoll sind, wie sie sind. Sollen es scharfe Kanten sein, oder braucht es ein Übergangs-Asset? Siehe R041.
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

### Weg Maple Falls nach Cedar Creek, Landstraße (`weg-maple-cedar-landstrasse`)

- [ ] R037. Landstraße: Sie hat dasselbe bräunliche Asset wie der Zedernpfad, der im Grunde ein Trampelpfad durch den Wald ist. Das ist unlogisch, weil über die Landstraße ein Bus fahren soll (er geht ganz rechts in den Flussweg über und vom Flussweg auf eine gepflasterte Straße beim Ortskern). Ein Bus darf auch über eine nicht gepflasterte Landstraße fahren, wäre aber unüblich. Grafisch muss deutlich werden, dass es eine Straße ist, die ein Bus befährt. Zusammenhang mit R036.
  Lösungsvorschlag des Autors: Entweder ein anderes Asset für Trampelpfade, die nur von Menschen begangen werden (etwa Zedernpfad), oder ein anderes Asset für Wege, auf denen auch ein Bus fährt (Landstraße), damit beide Arten sich unterscheiden.
- [ ] R038. Landstraße, Felder oben: Die Felder sind Rechtecke, in zwei Reihen aneinandergereiht. Die Pflanzen (Pflanzenassets) liegen teilweise außerhalb der Pflanzkästen oder eingegrenzten Felder, teilweise auf deren Begrenzungen, und auch in den Zwischenräumen zwischen den beiden Reihen. Das ergibt keinen Sinn; Pflanzen gehören nur in die Felder.
- [ ] R039. Landstraße, kleiner Stand relativ mittig im Bild: Auf dem Dach wachsen Pflanzen, dieselben wie links und rechts neben dem Stand. Das ergibt keinen Sinn.
- [ ] R040. Landstraße, Stand: Er ist komplett leer, Ware scheint zu fehlen. Der Autor weiß nicht, ob das in der Geschichte so gedacht ist (Hauptchat prüfen). Rechts daneben steht eine Figur. Gehört sie zum Stand, sollte sie näher an der Straße neben dem Stand stehen und nicht so weit oben. Zusammenhang mit R008. Der Autor bestätigt: Die Figur steht rechts neben dem Stand, er vermutet, dass sie zum Stand gehört, weiß es aber nicht.
- [ ] R041. Landstraße, Fläche des Flohmarkts: Das gräuliche Boden-Asset ist an sich in Ordnung, aber der Übergang zum Gras daneben ist eine scharfe, gerade Kante. Es sieht aus, als wäre das Boden-Asset auf das Gras geklebt. Wunsch: ein passendes Übergangs-Asset finden, um den Rand natürlicher zu machen, oder einen angelegten Rand, der klarer trennt. Eine rechteckige Asphaltierung ist als Menschenwerk denkbar, die abrupte gerade Linie stört aber das Bild. Als Beispiel nennt der Autor den Weg: Der hat die orange-braune Farbe und ein Randasset für den Übergang zu Gras.
- [ ] R044. Landstraße, Variante mit offenem Garten (Variante `weg-maple-cedar-landstrasse-gatter-offen`): Das Tor im Zaun verschwindet einfach. Das ist unlogisch, man baut ein Tor nicht ab, man öffnet es. Wunsch: ein passendes Asset, bei dem das Tor einmal offen und einmal zu ist, und das in beiden Varianten verwendet wird.

### Weg Maple Falls nach Cedar Creek, Flussweg (`weg-maple-cedar-flussweg`)

- [ ] R049. Flussweg, Übergang vom (noch) Trampelpfad zur Hauptstraße: Dort liegen die gräulichen Boden-Kacheln, und es gibt wieder den sehr harten Randübergang zum Gras und den Assets drumherum. Wunsch: mit passenden Assets einen allmählichen Übergang schaffen, falls machbar. Der Autor vermutet, dass der Gesamtweg ohnehin umgebaut wird, weil der Bus dort fährt. Zusammenhang mit R036, R037, R041 und R042.
- [ ] R050. Flussweg, rechts unten im Wasser: Dort liegt ein Boot, am Ufer steht ein Pfosten, an dem man es wohl festmachen soll. Es fehlt aber ein Seil, das das Boot am Pfosten festbindet. Der Autor weiß nicht, ob das so gewollt ist; logisch würde das Boot wegschwimmen. Wunsch: ein kleines Seil, das das Boot festbindet, falls möglich.

### Weg Maple Falls nach Cedar Creek, Zedernpfad (`weg-maple-cedar-zedernpfad`)

- [ ] R027. Zedernpfad, Treppen: Der Weg führt in Schwüngen mittig durch die Karte nach oben, an zwei Stellen über Treppen. Die Treppenabschnitte sehen nicht gut aus: Es fehlen ständig Treppenkacheln, dort schimmert plötzlich der Weg durch, der ursprünglich darunter lag. Die Treppen sind nicht vollständig umgesetzt.
- [ ] R028. Zedernpfad, Gebirgszug von linkem Bildrand nach rechts: Er hört etwa mittig im Bild auf, daneben ist wieder Gras. Das ergibt perspektivisch keinen Sinn. Man könnte rechts am Gebirgszug vorbeigehen, das Gras hoch und stünde oben, ohne Höhe erklommen zu haben. Eine durchgehende Grasfläche liegt einmal oberhalb und einmal unterhalb des Gebirges, ohne dass ein Asset einen Anstieg andeutet (Problem der Höhenwahrnehmung und Perspektive). Der Autor möchte, dass online bei dem Asset-Pack, aus dem die Gebirgs-Assets stammen, und bei anderen Packs zu Gebirgen nachgesehen wird, wie das gelöst ist: ziehen die Gebirge immer komplett übers Bild, damit das Problem gar nicht entsteht, oder gibt es Assets für einen leichten, begrasten Anstieg über einen längeren Bereich (dieselbe Höhe, ohne senkrechte Wand)? Wenn nein, wird so etwas hier gebraucht.
- [ ] R029. Zedernpfad, oberer Gebirgszug: Er beginnt links relativ mittig im Bild und hört etwas weiter rechts wieder auf. Man kann links und rechts daran vorbeigehen. Dasselbe Problem wie R028.

### Kürbishof (`kuerbishof-hof`)

- [ ] R048. Kürbishof, Feld oben links (Gerste/Ähren, möglicherweise Kornlabyrinth): Unter den Ähren liegen wieder die rechteckigen Feld-Assets. Die Ähren wachsen teilweise auf dem Rahmen dieser Feld-Assets oder in den Lücken, wo eigentlich Gras sein sollte. Das funktioniert so nicht. Es sieht aus, als hätte jemand Wege durchs Feld geplant (ob es ein Labyrinth sein soll, weiß der Autor nicht). Der Autor vermutet, dass es bewusst ein Weg ist, weil in der Mitte eine Vogelscheuche mit einem Schachbrett auf der Brust steht, die man finden soll (Hauptchat mit der Geschichte abgleichen). Ist es ein Kornlabyrinth, braucht es ein durchgängiges Untergrund-Asset, das nicht durch die Holzrahmen der Feldkästen unterbrochen wird. Ist kein Labyrinth geplant, müssen die Ähren zumindest innerhalb der Kästen bleiben.
- [ ] R045. Kürbishof, Zaun rechts, beim Feld oben rechts: Die Enden des Zauns fehlen, also die Endpfosten.
- [ ] R046. Kürbishof, Kürbisfeld (oben rechts): Die Kürbisse liegen nicht vollständig auf dem Feld. Einige liegen auf der Graskante.
- [ ] R047. Kürbishof, Kürbisfeld (oben rechts): Der Untergrund ist dasselbe Asset wie für die Wege. Das ergibt keinen Sinn, der Boden eines Kürbisfelds sieht anders aus als ein Trampelpfad. Ein anderes Asset ist nötig; vermutlich gibt es im Bestand (Datenbank) ein geeignetes.

### Cedar Creek, Ortskern (`cedar-creek-aussen`)

- [ ] R053. Ortskern, Eingang der Bibliothek (das große Gebäude in der Mitte ist die Stadtbibliothek, vom Autor bestätigt): Zwischen dem Asset des Eingangsbereichs mit der Treppe und dem Asset des Bibliotheksgebäudes ist immer noch eine grafische Lücke, durch die das Gras schimmert. Der Autor hat das schon mehrfach angemerkt, es ist nach seiner Zählung etwa zum fünften Mal schiefgegangen. Vorschlag des Autors: das Eingangs-Asset im Layer oberhalb der Bibliothek anlegen und nur noch ein Stückchen nach rechts schieben, sodass es oben beim Balkon die Wand wirklich berührt. Auftrag: Eine KI soll es zusammenbauen und sich das Bild konkret ansehen, ob noch Grün oder Hintergrund-Assets durchschimmern.
- [ ] R056. Ortskern, Hauptstraße von links nach rechts bis zum Platz: Am Ende der Straße sind die Straßenmarkierungen verrutscht, die letzte Markierung ist nach unten gerutscht.
- [ ] R057. Ortskern, Platz am Ende der Hauptstraße (Wende- und Parkbereich, dort parkt der Bus, vor der Bushaltestelle): Der asphaltierte Bereich ist nicht überall vollständig mit den Pflastersteinen umrandet. Wunsch: Wende- und Parkbereich überarbeiten, sodass ein sauberes Rechteck entsteht, schön umrandet mit den kleinen grauen Steinen, und die Fahrbahnmarkierungen passen. Auch hier soll sich eine KI das Ergebnis im Bild ansehen.
- [ ] R054. Ortskern, Gebäude als „Abziehbilder“ ohne Tiefe, passen perspektivisch und vielleicht auch stilistisch nicht zum Rest (der Autor ist sich bei Perspektive und Stil nicht sicher, sie fallen optisch jedenfalls heraus). Betroffen sind: das kleine Häuschen rechts neben der Bibliothek; der Schuppen am Fluss rechts, relativ mittig im Bild; das Häuschen ganz unten am Fluss, links vom Fluss; die drei Häuser ganz links unten in der unteren Häuserreihe; die Häuser darüber auf der linken Bildseite unter der Hauptstraße. Bitte durch etwas Sinnvolles ersetzen, oder der Autor lässt in Gemini passende Assets erstellen.
- [ ] R051. Ortskern, Bahnhaltestelle oben (Schilder „Fahrplan“ und „Cedar Creek“): Die Schilder sind nach Einschätzung des Autors okay, auch wenn die Assets nicht gerade dreidimensional sind; nicht schlimm. Die Bank zwischen den beiden Schildern steht aber auf dem Gras. Vorschlag: den gepflasterten Bereich ein Stück nach unten erweitern, sodass die Bank auf der Pflasterung steht, und die Schilder entsprechend ein Stück nach unten verschieben.
- [ ] R052. Ortskern, Bahnhaltestelle: Der Übergang zwischen dem Trampelpfad, der zur Haltestelle führt, und der gepflasterten Haltestelle besteht nur aus einer einzigen Ecke. Wird die Haltestelle nach unten erweitert (R051), muss der Übergang entsprechend erweitert und der Trampelpfad verbreitert werden.

### Maple Falls, Wohnzimmer (`maple-falls-wohnzimmer-ausgepackt`)

- [ ] R001. Maple Falls, Wohnzimmer (Familie, am Anfang; Autor meint den ausgepackten Zustand später): Die Küche ist im unteren Bereich noch kahl. Etwas ergänzen, damit es belebter aussieht.

## Figuren und Tiere

- [ ] R008. Alle Karten (zuerst gesehen im Diner, Küche): Eine Person in der Küche steht mit dem Gesicht zur Wand. Bewegen sich Figuren im Spiel von selbst hin und her, ist das in Ordnung. Stehen sie still, müssen sie logisch platziert sein, an einer sinnvollen Stelle und mit sinnvoller Blickrichtung. Der Autor bittet, das bei allen Karten zu prüfen, bei denen sich Figuren nicht von selbst bewegen.
- [ ] R020. Alle Karten, besonders Clubraum Maple Falls High: Figuren sollen sich bewegen, wenn es Sinn macht, und nicht wie Säulen herumstehen. Im Clubraum sollen sie eigentlich auf den Stühlen sitzen, weil sie Schach spielen. Der Autor weiß nicht, ob man das grafisch hinbekommt; der Hauptchat soll entscheiden, auch in Bezug auf die Geschichte. Zusammenhang mit R008 und R019.
- [ ] R043. Landstraße, Tiere rechts im Bild: Das Größenverhältnis stimmt nicht. Der Hase ist fast so groß wie das Reh (der Autor glaubt, es ist ein Reh). Das ergibt wenig Sinn.

## Geschichte und Texte

## Partien

## Aufgaben und Spielhülle

## Bedienung

## Ton

## Ideen und Wünsche

## Unklar



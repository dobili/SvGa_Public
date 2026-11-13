// Ort: Wohnzimmer im Haus an der Birch Lane (Akt 1, Maple Falls). Figur: Mama.
//
// Szenen der Story-Bibel (docs/spiel/05_Story_Bibel.md, Abschnitt 4):
// 1 Ankunft (akt1.ankunft), 4 Abend im neuen Haus (akt1.ersterAbend), 13 Aufbruch (akt1.aufbruch;
// seit Runde 11 nach dem Roman: zu Fuß am Freitag, Knoten aufbruch_freitag).
// Einstieg für die Figur ist der Knoten „mutter“ (orte.json, Figur mapleFalls.mutter); er verzweigt
// nach dem Spielstand. Wirkungen (Karten, Szenen) stehen in quests.json, nicht hier.
//
// Variablen: Die mit „Gesehen“ setzt diese Datei selbst. ausgangMapleFallsErsteLektion und
// nadelMapleFalls setzt die Hülle nach der Partie bzw. dem Clubkampf (regeln/dialogvariablen.ts); solange sie
// leer bzw. 0 sind, bleibt Mama beim Alltagsgespräch. Den Abend gibt es erst, wenn Ambrose die
// erste Partie besprochen hat (ersteLektionBesprochen aus maple-falls-dachboden.ink), weil die Quest
// mapleFalls.ersterAbend erst dort beginnt. Das Spiel beginnt heute auf dem Dachboden
// (regeln/spielstand.ts); wer das Brett schon berührt hat, bekommt eine kurze Begrüßung statt der
// Ankunft mit der Kiste.

EXTERNAL setzeSzene(kennung)

VAR held = "Du"
VAR brettBeruehrt = false
VAR ankunftGesehen = false
VAR ersterAbendGesehen = false
VAR aufbruchGesehen = false
VAR kenntHale = false
VAR ausgangMapleFallsErsteLektion = ""
VAR ersteLektionBesprochen = false
VAR nadelMapleFalls = 0
// Neu nach dem Roman zu Akt 1 (Kapitel 7, Szene akt1.dinerAbend): joGetroffen setzt
// maple-falls-park.ink, dinerAbendGesehen diese Datei.
VAR joGetroffen = false
VAR dinerAbendGesehen = false
// Akt 2, Szene 38 (Roman, Kapitel 23): nadelRiverton setzt die Hülle, verbotGesehen setzt diese
// Datei oder, wer ohne Heimweg nach Ironwood geht, ironwood-aussen.ankunft_zu_fuss (Anruf).
VAR nadelRiverton = 0
VAR verbotGesehen = false
VAR ankunftIronwoodGesehen = false
// Kapitel 27 (Roman): Das Foto aus der Elm Street liegt auf dem Küchentisch. fotoGefunden setzt
// ironwood-mamas-zimmer.ink, mamaFotoGesehen diese Datei (Quest ironwood.mamasFinale, Schritt 3).
VAR fotoGefunden = false
VAR mamaFotoGesehen = false

=== mutter ===
{
- not ankunftGesehen and not brettBeruehrt: -> ankunft
- not ankunftGesehen: -> ankunft_kurz
- ausgangMapleFallsErsteLektion != "" and ausgangMapleFallsErsteLektion != "abgebrochen" and not ersteLektionBesprochen:
    Bist du oben fertig? Die Pizza wird kalt, aber ein paar Minuten hat sie noch. #sprecher:mutter
    -> END
- ersteLektionBesprochen and not ersterAbendGesehen: -> erster_abend
- kenntHale and nadelMapleFalls > 0 and not aufbruchGesehen: -> aufbruch
- joGetroffen and not dinerAbendGesehen: -> diner_einladung
- nadelRiverton > 0 and not verbotGesehen and not ankunftIronwoodGesehen: -> nicht_ironwood
- fotoGefunden and not mamaFotoGesehen: -> mama_foto
- else: -> mutter_alltag
}

=== ankunft ===
// Szene 1 nach dem Roman, Kapitel 1, und der Dialogprüfung (docs/spiel/22, VM1 bis VM6).
// Stimmung: fremd, müde, Sommerende. Keine Musik bis zur Pizza; Wasserfall fern.
~ ankunftGesehen = true
~ setzeSzene("akt1.ankunft")
Der Umzugswagen ist weg. Kartons, ein Sofa schief vor dem Fenster, sonst nichts. Das Licht fällt in langen staubigen Streifen. #sprecher:erzaehler #musik:aus
Auf den meisten Kartons steht nur ein Name, deiner oder ihrer. #sprecher:erzaehler
Alles, wo nur ein Name draufsteht, ins Wohnzimmer. #sprecher:mutter #stimmung:muede
Hinter den Dächern rauscht etwas, gleichmäßig, wie eine ferne Straße. #sprecher:erzaehler
Hörst du das? Der Wasserfall. Daher der Name. #sprecher:mutter
Man gewöhnt sich dran, sagt die Maklerin. Nach einer Woche hört man ihn nicht mehr. #sprecher:mutter
* [„Es ist ziemlich groß.“]
    Groß. Und alt. #sprecher:mutter
* [„Ich vermisse die alte Wohnung.“]
    Ich auch. #sprecher:mutter #pause
- Mama fragt nicht, wie es dir geht. Dafür bist du ihr dankbar. #sprecher:erzaehler
Eins noch. #sprecher:mutter
Sie schiebt dir mit dem Fuß eine Kiste hin. Aus Holz, nicht aus Pappe. Auf dem Deckel, in steiler, altmodischer Schrift: „Whitlock – nicht wegwerfen.“ #sprecher:erzaehler
Stand im Flur. Die Vorbesitzerin. Sie hat hier gewohnt, seit … immer, glaube ich. #sprecher:mutter
Der Dachboden ist noch voll von ihren Sachen. Deshalb war das Haus so günstig. Alles, was oben ist, gehört jetzt uns. #sprecher:mutter
* [„Und was machen wir damit?“]
    Erst mal nichts. #sprecher:mutter
* [„Erst Pizza?“]
    Gleich. #sprecher:mutter
- Bring die hier hoch zu den anderen, ja? Ich kann heute keine Treppe mehr sehen. #sprecher:mutter #stimmung:muede
Etwas darin verrutscht, als du sie anhebst. Ein leises hölzernes Klacken, wie Kegel, die aneinanderstoßen. #sprecher:erzaehler #klang:holzklacken #musik:karte
-> END

=== ankunft_kurz ===
~ ankunftGesehen = true
~ setzeSzene("akt1.ankunft")
Da bist du ja. Warst du schon auf dem Dachboden? Staubig, oder? #sprecher:mutter #stimmung:muede
Hörst du das Rauschen? Der Wasserfall. Nach einer Woche hört man ihn nicht mehr, sagt die Maklerin. #sprecher:mutter
-> mutter

=== erster_abend ===
// Szene 4 nach dem Roman, Kapitel 4, und der Dialogprüfung (VM20 bis VM26). Mamas Können zeigt
// sich ohne Worte; „Weiß steht besser“ (Entscheidung 13.11.2026, roman/akt1_befunde.md, 7).
// Klang: Bei Mamas Satz setzt die Musik zwei Sekunden aus. Porträt „ertappt“ fehlt noch als Tag.
~ ersterAbendGesehen = true
Du kommst mit dem alten Brett die Treppe herunter. Auf der neunten Stufe knarrt es. #sprecher:erzaehler #klang:knarren
Die hat schon geknarrt, als das Haus neu war. #sprecher:ambrose
Mama sitzt auf dem Boden und schraubt den Tisch zusammen, die Anleitung verkehrt herum neben sich. #sprecher:erzaehler
Ihr Blick fällt auf das Brett. Sie sieht dich nicht an. Sie sieht die Stellung an. #sprecher:erzaehler #pause:2
Weiß steht besser. #sprecher:mutter #pause:2 #musik:aus
Dann hört sie, was sie gesagt hat. Ihr Gesicht macht zu, wie eine Tür, die jemand leise schließt. #sprecher:erzaehler #musik:karte
Hab ich irgendwo gelesen. Dass Weiß oft … ach, keine Ahnung. Wo hast du das her? #sprecher:mutter #stimmung:ertappt
* [„Vom Dachboden.“]
    Schön. Ist alt, oder? Pass auf, dass keine Figur wegkommt. #sprecher:mutter
* [„Spielst du Schach?“]
    Ich? Nein. #sprecher:mutter
    Sie lacht, ein bisschen zu kurz. Ich kann nicht mal diesen Tisch. #sprecher:mutter
- Deine Mutter, wenn ich das sagen darf, lügt schlecht. #sprecher:ambrose
In der Schule gibt es übrigens ein Schachteam. Lag ein Zettel im Briefkasten. #sprecher:mutter
Falls du Leute kennenlernen willst. #sprecher:mutter
* [„Vielleicht schau ich mal hin.“]
    Mach das. #sprecher:mutter #stimmung:froh
* [„Schach ist doch nur für Streber.“]
    Dann eben nicht. Halt mal das Tischbein. #sprecher:mutter
- Ein Schachteam. Wie vornehm diese Zeit ist. Morgen gehen wir hin. #sprecher:ambrose
// Roman, Kapitel 4 (neu): Der Tisch wackelt, ein Pizzakarton kommt unter das Bein. Wärme ohne
// Worte; das Wohnzimmer bekommt dafür eine Zustandsfassung (Karten, eigener Auftrag). Danach der
// Hinweis auf die Nacht auf dem Dachboden (maple-falls-dachboden.erste_nacht).
Als der Tisch steht, wackelt er. Ihr schiebt einen gefalteten Pizzakarton unter ein Bein. #sprecher:erzaehler
Das ist jetzt eben so. #sprecher:mutter #stimmung:froh
* [„Das ist jetzt eben so.“]
    Für einen Moment ist es fast wie zu Hause. #sprecher:erzaehler
* [Nichts sagen, nur nicken]
    Mama lacht. Für einen Moment ist es fast wie zu Hause. #sprecher:erzaehler
- In der Nacht, als das Haus still ist, kannst du nicht schlafen. Das Brett zieht dich noch einmal nach oben. #sprecher:erzaehler
-> END

=== aufbruch ===
// Szene 13 nach dem Roman, Kapitel 10 (zu Fuß mit Juno, Nacht im Lesesaal; Entscheidung 13.11.2026)
// und der Dialogprüfung (Szene 13, ohne Nummer). Der Schulbus mit dem Team fährt am Samstag.
~ aufbruchGesehen = true
Coach Delgado hat angerufen. Ihr spielt Samstag in Cedar Creek? #sprecher:mutter
* [„Juno und ich gehen Freitag schon. Zu Fuß.“]
    Zu Fuß. #sprecher:mutter
* [„Ich spiele am vierten Brett!“]
    Am vierten Brett. Und Juno sagt, ihr geht schon Freitag. Zu Fuß. #sprecher:mutter
- Sie sieht dich an, über den Rand ihrer Kaffeetasse. Der Tisch wackelt nicht mehr; der Pizzakarton liegt noch unter dem Bein. #sprecher:erzaehler
Du hast in vier Wochen mehr geredet als im ganzen letzten Jahr. #sprecher:mutter
* [„Zwei Stunden. Am Fluss entlang.“]
* [„Wir schlafen in der Bibliothek. Es gibt Matten.“]
- Sie sieht auf das Brett. Sie will etwas sagen und sagt es nicht. #sprecher:erzaehler #pause:2
Mit Juno. Am Fluss. Gut. #sprecher:mutter
Sie drückt dir eine Tüte in die Hand, belegte Brote, als hätte sie es die ganze Zeit gewusst. #sprecher:erzaehler
Brett nicht verlieren. #sprecher:mutter #stimmung:froh
* [„Woher weißt du, dass ich es mitnehme?“]
    Du trägst es seit Tagen herum. Wie ein Haustier. #sprecher:mutter
* [„Versprochen.“]
- Juno wartet am Park, wo die Landstraße beginnt. #sprecher:erzaehler
-> END

=== aufbruch_freitag ===
// Stimmung: frei, Sommerende (Dokument 19, Abschnitt 4). Mama zeigt die Veränderung von {held}
// von außen (Roman, Kapitel 10). Musik: die der Karte; das Wegthema beginnt auf der Landstraße.
Coach Delgado hat angerufen. Ihr spielt Samstag in Cedar Creek. Und du willst schon morgen los? #sprecher:mutter
* [„Zu Fuß, mit Juno. Sie kennt den Weg.“]
    Zu Fuß. #sprecher:mutter
* [„Wir schlafen in der Bibliothek. Es gibt Matten.“]
    In einer Bibliothek. Zwischen den Büchern. #sprecher:mutter
- Du erklärst alles in einem Atemzug: Der Coach kommt Samstag mit dem Bus nach, Mrs. Okafor hat es erlaubt. #sprecher:erzaehler
Mama sieht dich über den Rand ihrer Tasse an. #sprecher:erzaehler
Du hast in vier Wochen mehr geredet als im ganzen letzten Jahr. #sprecher:mutter #pause
Wie weit ist es? #sprecher:mutter
* [„Zwei Stunden. Am Fluss entlang.“]
* [„Nicht weit. Juno ist ihn hundertmal gegangen.“]
- Sie sieht auf das Brett im Handtuch. Sie will etwas sagen und sagt es nicht. #sprecher:erzaehler
Mit Juno. Am Fluss. Gut. #sprecher:mutter
Sie drückt dir eine Tüte mit belegten Broten in die Hand, als hätte sie es die ganze Zeit gewusst. #sprecher:erzaehler
Samstagabend fahrt ihr alle mit dem Bus zurück. Und das Brett nicht verlieren. #sprecher:mutter
Juno wartet am Stadtpark. Dahinter beginnt die Landstraße. #sprecher:erzaehler
-> END

=== mama_foto ===
// Kapitel 27, erster Teil (Roman). Mamas Erzählung ohne Musik; bei „jede Nacht“ Mamas Thema,
// vier Töne, abgebrochen (Klangplan `mama`). Porträt „erzählt“, dann „denkt nach“.
~ mamaFotoGesehen = true
Du legst das Foto auf den Küchentisch. Dorthin, wo der Zettel gelegen hat. #sprecher:erzaehler #musik:aus #geraeusch:kuehlschrank
Mama kommt von der Frühschicht. Mantel, Tasche, ob du gegessen hast. Dann sieht sie es. #sprecher:erzaehler
* [„Ich hab das gefunden.“]
- Sie setzt sich. Nicht auf den Stuhl, an dem sie steht. Auf den nächsten, als wäre der Weg zu weit. #sprecher:erzaehler #pause:2
Du warst in Ironwood. Bei Mama. #sprecher:mutter #stimmung:verschlossen
* [„Und bei Big Joe. Er lässt grüßen.“]
- Und es tut ihm leid. Das sagst du auch. #sprecher:erzaehler
Ihm tut es leid. Joe. Dieser sture, alberne … Ihm tut es leid. #sprecher:mutter #stimmung:riss
Sie nimmt das Foto. Das Mädchen mit den Händen in den Ärmeln. #sprecher:erzaehler
Ich war siebzehn. Ich war gut, weißt du. Ich sage das nicht, um anzugeben. #sprecher:mutter #stimmung:erzaehlt
Im Finale stand ich auf Gewinn. Joe stand hinten an der Wand und hat sich nicht getraut zu atmen. #sprecher:mutter
Zug dreiunddreißig. Ich sehe nur meinen Angriff. Ich ziehe den Turm vor, hinter meine Dame, auf dieselbe Schräge. #sprecher:mutter
Und ganz hinten steht sein Läufer und sieht die Schräge entlang. Seit zwanzig Zügen. #sprecher:mutter
Ein Spieß. Das Einfachste, was es gibt. #sprecher:mutter
Ich hab den Läufer nicht gesehen. Fünfundzwanzig Jahre, und ich sehe ihn jede Nacht. #sprecher:mutter #musik:mama
„Wenn ich angreife, sehe ich nichts anderes. Aufpassen!!“ Sie hat es mit dreizehn ins blaue Heft geschrieben. #sprecher:erzaehler
Ich wollte nicht, dass es jedem passiert. Ich wollte, dass es mir nicht passiert. #sprecher:mutter #musik:aus
Ich hab die Figuren in den Keller getragen. Schule, Ausbildung. Du. Es ging ja. #sprecher:mutter
* [„Du hast gesagt: Weiß steht besser.“]
- Sie sieht dich an. #sprecher:erzaehler
* [„Am ersten Abend. Drei Sekunden.“]
- Zwei. Es waren zwei. Ich hab mich so erschrocken. #sprecher:mutter #stimmung:lachtOhneSpott
Du legst das blaue Heft neben das Foto, aufgeschlagen auf der letzten Seite. Mama sieht auf die leere Stelle. #sprecher:erzaehler #bild:blaues_heft
Sie steht auf, geht zum Fenster und schiebt die Hände in die Ärmel ihrer Strickjacke. #sprecher:erzaehler #bild:aus #stimmung:denktNach
Gut. Eine Partie. #sprecher:mutter
In Ironwood. Ich will den Raum sehen. Und wenn ich gewinne, räumst du die Spülmaschine aus. #sprecher:mutter
-> END

=== mutter_alltag ===
{~Ich hab gleich Nachtschicht. Im Kühlschrank ist noch Pizza.|Hast du die Kartons in deinem Zimmer schon ausgepackt? Einen wenigstens?|Wenn du rausgehst: Hauptsache, du bist vor zehn zu Hause.|Mrs. Calloway von gegenüber hat Kuchen gebracht. Die Leute hier sind nett.} #sprecher:mutter
-> END

// ---------------------------------------------------------------- Abend im Diner

// Szene akt1.dinerAbend (Roman, Kapitel 7; neu gegenüber der Story-Bibel), etwa vier Minuten,
// freigeschaltet nach der ersten Begegnung mit Jo. Mama findet die Lösung vor {held}, nur als
// Erzählerzeile (ihr Geheimnis ein zweites Mal ohne Worte); Hector erzählt vom Mann im Anzug
// (Graham Hale als Vorzeichen). Stimmung: warm, am Ende ein Schatten. Klang: eigenes kleines
// Diner-Stück wie aus einer Musikbox, Bratgeräusche, Geschirr; bei Hectors Bericht fällt die
// Musik einen Takt aus.
// Die Szene spielt im Dialog; der Ort Diner bekommt für Hector eine Figur, wenn die Karten so weit
// sind (maple-falls-diner.ink, kleine Geschichte Hector).
=== diner_einladung ===
~ dinerAbendGesehen = true
{not kenntHale:
    ~ setzeSzene("akt1.dinerAbend")
}
Ich hab heute frei. Und der Herd ist immer noch nicht angeschlossen. #sprecher:mutter
Diner? Ich lade dich ein. #sprecher:mutter #stimmung:froh
* [„Pommes?“]
    Pommes. Und vielleicht sogar ein Salat. Vielleicht. #sprecher:mutter
* [„Gern.“]
- -> diner_abend

=== diner_abend ===
Das Diner an der Hauptstraße ist lang und schmal wie ein Eisenbahnwagen. Rote Bänke, eine Theke aus Blech. #sprecher:erzaehler #musik:diner #geraeusch:diner_kueche #klang:tuerglocke
Es riecht nach Zwiebeln und Kaffee. Aus der Musikbox kommt leise ein altes Lied. #sprecher:erzaehler
Bestellung läuft! #sprecher:hector #stimmung:froh
Er ruft es in die Küche, obwohl außer ihm niemand in der Küche ist. Auf seiner Schürze steht „Hector“. #sprecher:erzaehler
Er legt euch Papiersets hin. Darauf ein Schachbrett: „Rätsel der Woche: Weiß zieht und setzt in einem Zug matt.“ #sprecher:erzaehler
Nimm zwei. Ist schwer diese Woche. Ich krieg's nicht raus. #sprecher:hector
* [Das Rätsel ansehen]
* [Erst Pommes bestellen]
    Pommes kommen. Das Rätsel läuft nicht weg. #sprecher:hector
- Neben der Kasse liegt ein Stapel Sets, mindestens zwanzig. Auf keinem ist etwas eingezeichnet. #sprecher:erzaehler
Du suchst. Was hängt? Wohin kann die Dame? #sprecher:erzaehler #pause
Mama sieht zu. Sie sagt nichts. #sprecher:erzaehler
Aber ihr Finger bewegt sich, einen Zentimeter über dem Papier, auf ein Feld. Eine halbe Sekunde vor deinem Stift. #sprecher:erzaehler #pause:3
Du tust, als hättest du es nicht gesehen. Dann zeichnest du den Pfeil ein. #sprecher:erzaehler
Hector hält das Set ins Licht wie einen Geldschein. #sprecher:erzaehler
Matt in eins! Am ersten Abend! Das kommt an die Wand. #sprecher:hector #stimmung:froh
Deine Mutter war schneller. Ich sage es nur, damit du es weißt. #sprecher:ambrose
* [Den Kopf schütteln, ganz leicht]
    Schon gut. Ich schweige. Gentlemen schweigen über Damen. #sprecher:ambrose #stimmung:lacht
* [„Pst.“]
    Mama sieht auf. „Was?“ Du zeigst auf die Pommes. #sprecher:erzaehler
- Die Pommes kommen. Hector bleibt am Tisch stehen, das Geschirrtuch über der Schulter. #sprecher:erzaehler
Gestern saß hier einer. Anzug, zwei Telefone, kein Lächeln. #sprecher:hector
Hat Kaffee bestellt und nur auf Zahlen geguckt. Wollte wissen, wem das Schulgebäude gehört. #sprecher:hector
Hab gesagt: der Schule. #sprecher:hector #stimmung:lacht
Dann lacht er nicht mehr. Die Musikbox setzt für einen Takt aus. #sprecher:erzaehler #pause #musik:aus
Hat er nicht komisch gefunden. #sprecher:hector #musik:diner
* [„Wer war das?“]
    Keine Ahnung. Hat nicht mal Trinkgeld gegeben. Kaffee schwarz, ohne alles. #sprecher:hector
* [Nichts sagen]
- Gibt es hier Ketchup? #sprecher:mutter
Draußen ist es dunkel geworden. Hinter dem Fenster die Hauptstraße, die einzige Ampel, dahinter schwarze Bäume. #sprecher:erzaehler
Es ist ein guter Abend. Du merkst es erst, als er fast vorbei ist. #sprecher:erzaehler
Du hast den ganzen Tag nicht an die alte Wohnung gedacht. #sprecher:erzaehler #musik:karte #geraeusch:aus
-> END

// ---------------------------------------------------------------- Akt 2: Nicht Ironwood

// Szene 38 nach dem Roman, Kapitel 23 („Frag nicht“). Stimmung: häuslich, dann eine geschlossene
// Tür. Das Verbot kommt trocken: bei „Nein“ keine Musik und keine Pause, der Dialog geht einfach
// weiter. Danach Tür, Wagen, das Thema von Maple Falls nur auf dem Klavier. Mamas Porträt
// „verschlossen“ (fällt auf die Grundfassung zurück, solange es das Bild nicht gibt).
=== nicht_ironwood ===
~ verbotGesehen = true
~ setzeSzene("akt2.verbot")
Im November kommt ein Zettel von Coach Delgado, schief kopiert: „Freundschaftsturnier beim Stahlwerker-Club Ironwood. Vier Bretter. Wir fahren!!!“ #sprecher:erzaehler #bild:zettel_ironwood #musik:aus #geraeusch:kuehlschrank
Drei Ausrufezeichen. So viele hat sie seit Wochen nicht gemacht. Du legst ihn neben Mamas Tasse. #sprecher:erzaehler #bild:aus
Mama liest ihn im Stehen, den Mantel schon an, die Schlüssel in der Hand. Ihre Augen halten an. #sprecher:erzaehler
Nein. #sprecher:mutter #stimmung:verschlossen
Nicht Ironwood. #sprecher:mutter #stimmung:verschlossen
* [„Aber der Coach hat …“]
    Der Coach kann fahren, wohin sie will. #sprecher:mutter #stimmung:verschlossen
* [„Warum?“]
- Sie legt den Zettel hin, mit der Schrift nach unten. #sprecher:erzaehler
Du fährst nach Riverton, du läufst durch Wälder, ich sage zu allem Ja. Dieses eine Mal sage ich Nein. #sprecher:mutter
Frag nicht. Bitte. Nicht heute. #sprecher:mutter #stimmung:verschlossen
Dann ist sie an der Tür, und die Tür ist zu. Der Wagen springt an und rollt die Einfahrt hinunter. Nachtschicht. #sprecher:erzaehler #klang:wagen
Deine Mutter hat Angst. Vor einer Stadt. Das ist selten. #sprecher:ambrose #musik:mapleFalls.klavier
Vor Menschen hat man Angst, vor Schulden, vor dem Zahnarzt. Aber vor einer Stadt. #sprecher:ambrose
* [„Sie hat nur gesagt: nicht zum Turnier.“]
    Das ist eine Unterscheidung, die Advokaten machen. #sprecher:ambrose
    Er klingt nicht tadelnd. Er klingt neugierig. Zum ersten Mal seit Riverton interessiert ihn etwas mehr als die Tische. #sprecher:erzaehler
* [Den Zettel umdrehen]
    Ein Turnier, eine Stadt, ein Nein. Ich frage mich, was dahintersteckt. #sprecher:ambrose
- Am Samstag steht das grüne Fahrrad vor der Tür. Juno sitzt schon auf dem Gepäckträger. #sprecher:erzaehler #klang:fahrradklingel #geraeusch:aus
Ich frag gar nicht. Ich komm einfach mit. #sprecher:juno #stimmung:froh
-> END

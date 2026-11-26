// Ort: Wohnzimmer im Haus an der Birch Lane (Akt 1, Maple Falls). Figur: Mama.
//
// Szenen der Story-Bibel (docs/spiel/05_Story_Bibel.md, Abschnitt 4):
// 1 Ankunft (akt1.ankunft), 4 Abend im neuen Haus (akt1.ersterAbend), 13 Aufbruch (akt1.aufbruch;
// nach dem Roman: zu Fuß am Freitag).
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
EXTERNAL reise(karte, ausloeser)

VAR held = "Du"
VAR brettBeruehrt = false
VAR ankunftGesehen = false
VAR ersterAbendGesehen = false
VAR ersteNachtGesehen = false
VAR aufbruchGesehen = false
VAR kenntHale = false
VAR ausgangMapleFallsErsteLektion = ""
VAR ersteLektionBesprochen = false
VAR nadelMapleFalls = 0
// Neu nach dem Roman zu Akt 1 (Kapitel 7, Szene akt1.dinerAbend): joGetroffen setzt
// maple-falls-park.ink, dinerAbendGesehen diese Datei.
VAR joGetroffen = false
VAR dinerAbendGesehen = false
// Der Abend im Diner ist erlebt (Ende von diner_abend): Mama sitzt danach nicht mehr in der Nische,
// und der Eingang des Diners spielt die Szene nicht noch einmal (orte.json, mapleFalls.diner).
VAR dinerAbendErlebt = false
VAR hectorGetroffen = false
// Eingang des Wohnzimmers (19.11.2026, Wunsch des Autors): Das Knarren der Treppe gehört zum
// Herunterkommen, nicht ins Gespräch mit Mama. treppeAbendGesehen setzt treppe_abend.
VAR treppeAbendGesehen = false
// Der erste Morgen mit Mama an der Haustür (morgen_mama, Eingang des Wohnzimmers).
VAR morgenMamaGesehen = false
// Akt 2, Szene 38 (Roman, Kapitel 23): nadelRiverton setzt die Hülle, verbotGesehen setzt diese
// Datei oder, wer ohne Heimweg nach Ironwood geht, ironwood-aussen.ankunft_zu_fuss (Anruf).
VAR nadelRiverton = 0
VAR verbotGesehen = false
VAR ankunftIronwoodGesehen = false
// Kapitel 27 (Roman): Das Foto aus der Elm Street liegt auf dem Küchentisch. fotoGefunden setzt
// ironwood-mamas-zimmer.ink, mamaFotoGesehen diese Datei (Quest ironwood.mamasFinale, Schritt 3).
VAR fotoGefunden = false
VAR mamaFotoGesehen = false
VAR mamaInKantine = false
// Mamas Alltag je Akt (Querschnitt 17.11.2026): endeAkt1Gesehen setzt cedar-creek-aussen.ink,
// mamaSpielt ironwood-kantine.ink, einladungGesehen ironwood-aussen.ink, tiefpunktGesehen
// port-delacroix-turnhalle.ink, endeAkt3Gesehen desert-springs-aussen.ink.
VAR endeAkt1Gesehen = false
VAR mamaSpielt = false
VAR einladungGesehen = false
VAR tiefpunktGesehen = false
VAR endeAkt3Gesehen = false
VAR abschiedGesehen = false

=== mutter ===
{
- not ankunftGesehen and not brettBeruehrt: -> ankunft
- not ankunftGesehen: -> ankunft_kurz
// Einleitung (19.11.2026): Nach der Ankunft und vor dem Brett erinnert Mama an die Kiste.
- not brettBeruehrt and not ersteLektionBesprochen:
    Die Kiste gehört nach oben, zu den anderen Sachen von Mrs. Whitlock. Die Treppe hier rauf, dann die steile zum Dachboden. #sprecher:mutter #stimmung:muede
    -> END
- ausgangMapleFallsErsteLektion != "" and ausgangMapleFallsErsteLektion != "abgebrochen" and not ersteLektionBesprochen:
    Bist du oben fertig? Die Pizza wird kalt, aber ein paar Minuten hat sie noch. #sprecher:mutter #stimmung:laechelt
    -> END
- ersteLektionBesprochen and not ersterAbendGesehen: -> erster_abend
- kenntHale and nadelMapleFalls > 0 and not aufbruchGesehen: -> aufbruch
- fotoGefunden and not mamaFotoGesehen: -> mama_foto
- mamaFotoGesehen and not mamaInKantine: -> mama_fahrt
- nadelRiverton > 0 and not verbotGesehen and not ankunftIronwoodGesehen: -> nicht_ironwood
- joGetroffen and not dinerAbendGesehen: -> diner_einladung
- else: -> mutter_alltag
}

// Eingangsdialog des Wohnzimmers (orte.json, Feld „eingang“): beim ersten Betreten die Ankunft, am
// Abend nach der ersten Lektion das Herunterkommen über die Treppe.
=== eingang ===
{
- not ankunftGesehen: -> ankunft
- ersteNachtGesehen and not morgenMamaGesehen: -> morgen_mama
- else: -> treppe_abend
}

// Der erste Morgen (vorher am Ende von maple-falls-dachboden.erste_nacht, im Zimmer ohne Mama;
// Anwesenheit 25.11.2026, Wortlaut nach Wunsch des Autors vom 26.11. erhalten): Wer herunterkommt,
// trifft Mama an der Haustür.
=== morgen_mama ===
~ morgenMamaGesehen = true
Am Morgen steht Mama schon in der Tür, den Autoschlüssel in der Hand. #sprecher:erzaehler #licht:tag #uhr:morgen #gehe:mutter>5,10
Die Schule ist die Straße runter. Frag nach Coach Delgado und dem Schachteam, ja? #sprecher:mutter #stimmung:laechelt
-> END

// Wunsch des Autors (19.11.2026): Das Bild hält an, wenn {held} am Abend herunterkommt; das Knarren
// der neunten Stufe und wo Mama ist, stehen hier statt im Gespräch mit ihr (erster_abend).
=== treppe_abend ===
~ treppeAbendGesehen = true
Du kommst mit dem alten Brett die Treppe herunter. Auf der neunten Stufe knarrt es. #sprecher:erzaehler #klang:knarren
Die hat schon geknarrt, als das Haus neu war. #sprecher:ambrose #stimmung:laechelt
Unten im Wohnzimmer sitzt Mama auf dem Boden zwischen den Kartons und schraubt an einem Tisch. #sprecher:erzaehler #schwenk:mutter
-> END

=== ankunft ===
// Szene 1 nach dem Roman, Kapitel 1, und der Dialogprüfung (docs/spiel/22, VM1 bis VM6).
// Stimmung: fremd, müde, Sommerende. Keine Musik bis zur Pizza; Wasserfall fern.
~ ankunftGesehen = true
~ setzeSzene("akt1.ankunft")
// Erstspieler-Durchgang 20.11.2026: kürzer bis zum ersten Schritt; Sofa und Rauschen erzählt schon die Einleitung.
Am Abend ist der Umzugswagen weg. Kartons überall, das Licht fällt in langen staubigen Streifen. #sprecher:erzaehler #musik:aus #bild:einzug_wohnzimmer #uhr:abend #schwenk:mf4KartonStapel
Auf den meisten Kartons steht nur ein Name, deiner oder ihrer. #sprecher:erzaehler #bild:aus
Alles, wo nur ein Name draufsteht, ins Wohnzimmer. #sprecher:mutter #stimmung:muede #schwenk:mutter
Hörst du das? Der Wasserfall. Daher der Name. #sprecher:mutter #stimmung:laechelt
Man gewöhnt sich dran, sagt die Maklerin. Nach einer Woche hört man ihn nicht mehr. #sprecher:mutter #stimmung:nachdenklich
* [„Es ist ziemlich groß.“]
    Groß. Und alt. #sprecher:mutter #stimmung:nachdenklich
* [„Ich vermisse die alte Wohnung.“]
    Ich auch. #sprecher:mutter #stimmung:bitter #pause
- Mama fragt nicht, wie es dir geht. Dafür bist du ihr dankbar. #sprecher:erzaehler
Eins noch. #sprecher:mutter #stimmung:nachdenklich
Sie schiebt dir mit dem Fuß eine Kiste hin. Aus Holz, nicht aus Pappe. #sprecher:erzaehler #bild:kiste_whitlock #schwenk:held
Auf dem Deckel, in steiler, altmodischer Schrift: „Whitlock – nicht wegwerfen.“ #sprecher:erzaehler
Stand im Flur. Die Vorbesitzerin. #sprecher:mutter #stimmung:nachdenklich #bild:aus
Sie hat hier gewohnt, seit … immer, glaube ich. #sprecher:mutter #stimmung:nachdenklich
Der Dachboden ist noch voll von ihren Sachen. Deshalb war das Haus so günstig. #sprecher:mutter #stimmung:nachdenklich
Alles, was oben ist, gehört jetzt uns. #sprecher:mutter #stimmung:nachdenklich
* [„Und was machen wir damit?“]
    Erst mal nichts. #sprecher:mutter #stimmung:nachdenklich
* [„Erst Pizza?“]
    Gleich. #sprecher:mutter #stimmung:nachdenklich
- Bring die hier hoch zu den anderen, ja? Ich kann heute keine Treppe mehr sehen. #sprecher:mutter #stimmung:muede
Die Treppe hier rauf, und oben gleich die steile weiter zum Dachboden. Ich mach so lange die Pizza warm. #sprecher:mutter #stimmung:laechelt
Etwas darin verrutscht, als du sie anhebst. Ein leises hölzernes Klacken, wie Kegel, die aneinanderstoßen. #sprecher:erzaehler #klang:holzklacken #musik:karte
-> END

=== ankunft_kurz ===
~ ankunftGesehen = true
~ setzeSzene("akt1.ankunft")
// Lektorat der Lesefassung, 17.11.2026: Wer nach der ersten Lektion herunterkommt (der übliche Weg,
// seit die Haustür bis dahin zu bleibt), beginnt gleich mit dem Abend. Sonst fragte Mama „Warst du
// schon auf dem Dachboden?“, und erst danach kam {held} mit dem Brett die Treppe herunter.
{not ersteLektionBesprochen:
    Da bist du ja. Warst du schon auf dem Dachboden? #sprecher:mutter #stimmung:muede
    Staubig, oder? #sprecher:mutter #stimmung:muede
    Hörst du das Rauschen? Der Wasserfall. #sprecher:mutter #stimmung:laechelt
    Nach einer Woche hört man ihn nicht mehr, sagt die Maklerin. #sprecher:mutter #stimmung:laechelt
}
-> mutter

=== erster_abend ===
// Szene 4 nach dem Roman, Kapitel 4, und der Dialogprüfung (VM20 bis VM26). Mamas Können zeigt
// sich ohne Worte; „Weiß steht besser“ (Entscheidung 13.11.2026, roman/akt1_befunde.md, 7).
// Klang: Bei Mamas Satz setzt die Musik zwei Sekunden aus. Porträt „ertappt“ fehlt noch als Tag.
~ ersterAbendGesehen = true
// Das Herunterkommen über die knarrende Treppe steht seit dem 19.11.2026 in treppe_abend (Eingang).
Du stellst dich mit dem Brett neben sie. Mama schraubt weiter am Tisch. #sprecher:erzaehler
Ihr Blick fällt auf das Brett. Sie sieht nicht dich an, sondern die Stellung. #sprecher:erzaehler #pause:2
Weiß steht besser. #sprecher:mutter #stimmung:nachdenklich #pause:2 #musik:aus
Dann hört sie, was sie gesagt hat. Ihr Gesicht macht zu, wie eine Tür, die jemand leise schließt. #sprecher:erzaehler #musik:karte
Hab ich irgendwo gelesen. Dass Weiß oft … ach, keine Ahnung. #sprecher:mutter #stimmung:ertappt
Wo hast du das her? #sprecher:mutter #stimmung:ertappt
* [„Vom Dachboden.“]
    Schön. Ist alt, oder? #sprecher:mutter #stimmung:laechelt
    Pass auf, dass keine Figur wegkommt. #sprecher:mutter #stimmung:laechelt
* [„Spielst du Schach?“]
    Ich? Nein. #sprecher:mutter #stimmung:ueberrascht
    Sie lacht, ein bisschen zu kurz. #sprecher:erzaehler
    Ich kann nicht mal diesen Tisch. #sprecher:mutter #stimmung:ueberrascht
- Deine Mutter, wenn ich das sagen darf, lügt schlecht. #sprecher:ambrose #stimmung:laechelt
In der Schule gibt es übrigens ein Schachteam. Lag ein Zettel im Briefkasten. #sprecher:mutter #stimmung:laechelt
Falls du Leute kennenlernen willst. #sprecher:mutter #stimmung:laechelt
* [„Vielleicht schau ich mal hin.“]
    Mach das. #sprecher:mutter #stimmung:froh
* [„Schach ist doch nur für Streber.“]
    Dann eben nicht. Halt mal das Tischbein. #sprecher:mutter #stimmung:nachdenklich
- Ein Schachteam. Wie vornehm diese Zeit ist. #sprecher:ambrose #stimmung:laechelt
Morgen gehen wir hin. #sprecher:ambrose #stimmung:laechelt
// Roman, Kapitel 4 (neu): Der Tisch wackelt, ein Pizzakarton kommt unter das Bein. Wärme ohne
// Worte; das Wohnzimmer bekommt dafür eine Zustandsfassung (Karten, eigener Auftrag). Danach der
// Hinweis auf die Nacht auf dem Dachboden (maple-falls-dachboden.erste_nacht).
Als der Tisch steht, wackelt er. Ihr schiebt einen gefalteten Pizzakarton unter ein Bein. #sprecher:erzaehler
Das ist jetzt eben so. #sprecher:mutter #stimmung:froh
* [„Das ist jetzt eben so.“]
    Für einen Moment ist es fast wie zu Hause. #sprecher:erzaehler
* [Nichts sagen, nur nicken]
    Mama lacht. Für einen Moment ist es fast wie zu Hause. #sprecher:erzaehler
- In der Nacht, als das Haus still ist, kannst du nicht schlafen. Das Brett wartet oben in deinem Zimmer. #sprecher:erzaehler #uhr:nacht
-> END

=== aufbruch ===
// Szene 13 nach dem Roman, Kapitel 10 (zu Fuß mit Juno, Nacht im Lesesaal; Entscheidung 13.11.2026)
// und der Dialogprüfung (Szene 13, ohne Nummer). Der Schulbus mit dem Team fährt am Samstag.
~ aufbruchGesehen = true
Coach Delgado hat angerufen. Ihr spielt Samstag in Cedar Creek? #sprecher:mutter #stimmung:laechelt
* [„Juno und ich gehen Freitag schon. Zu Fuß.“]
    Zu Fuß. #sprecher:mutter #stimmung:ueberrascht
* [„Ich spiele am vierten Brett!“]
    Am vierten Brett. Und Juno sagt, ihr geht schon Freitag – zu Fuß. #sprecher:mutter #stimmung:ueberrascht
// Lektorat Akt 1, 17.11.2026: der Grund für Freitag und zu Fuß, für jeden Spieler (Roman, Kapitel 10:
// „in einem Atemzug“; der Bus fährt nur samstags, Zettel an der Haltestelle im Park).
- Du sagst alles in einem Atemzug: Der Bus fährt erst Samstag früh, Juno kennt den Weg, und die Vorhut schläft immer in der Bibliothek. #sprecher:erzaehler
Sie sieht dich an, über den Rand ihrer Kaffeetasse. Der Tisch wackelt nicht mehr; der Pizzakarton liegt noch unter dem Bein. #sprecher:erzaehler
Du hast in vier Wochen mehr geredet als im ganzen letzten Jahr. #sprecher:mutter #stimmung:laechelt
* [„Zwei Stunden. Am Fluss entlang.“]
* [„Es gibt sogar Matten.“]
- Sie sieht auf das Brett. Sie will etwas sagen und sagt es nicht. #sprecher:erzaehler #pause:2
Mit Juno. Gut. #sprecher:mutter #stimmung:laechelt
Sie drückt dir eine Tüte in die Hand, belegte Brote, als hätte sie es die ganze Zeit gewusst. #sprecher:erzaehler
Brett nicht verlieren. #sprecher:mutter #stimmung:froh
* [„Woher weißt du, dass ich es mitnehme?“]
    Du trägst es seit Wochen herum. Wie ein Haustier. #sprecher:mutter #stimmung:lacht
* [„Versprochen.“]
- Juno wartet am Park, wo die Landstraße beginnt. #sprecher:erzaehler
-> END

=== mama_foto ===
// Kapitel 27, erster Teil (Roman). Mamas Erzählung ohne Musik; bei „jede Nacht“ Mamas Thema,
// vier Töne, abgebrochen (Klangplan `mama`). Porträt „erzählt“, dann „denkt nach“.
~ mamaFotoGesehen = true
Du legst das Foto auf den Küchentisch. Dorthin, wo der Zettel gelegen hat. #sprecher:erzaehler #musik:aus #geraeusch:kuehlschrank
Mama kommt von der Frühschicht. Mantel, Tasche, ob du gegessen hast. #sprecher:erzaehler
Dann sieht sie es. #sprecher:erzaehler
* [„Ich hab das gefunden.“]
- Sie setzt sich. Nicht auf den Stuhl, an dem sie steht. #sprecher:erzaehler
Auf den nächsten, als wäre der Weg zu weit. #sprecher:erzaehler #pause:2
{held}. Du warst in Ironwood, bei Oma Ruth. #sprecher:mutter #stimmung:verschlossen
* [„Und bei Big Joe. Er lässt grüßen.“]
- Und es tut ihm leid. Das sagst du auch. #sprecher:erzaehler
Ihm tut es leid. Joe. #sprecher:mutter #stimmung:riss
Dieser sture, alberne … Ihm tut es leid. #sprecher:mutter #stimmung:riss
Sie nimmt das Foto. Das Mädchen mit den Händen in den Ärmeln. #sprecher:erzaehler #pause:2
Ich war siebzehn. Ich war gut, weißt du. #sprecher:mutter #stimmung:erzaehlt
Ich sage das nicht, um anzugeben. #sprecher:mutter #stimmung:erzaehlt
Im Finale stand ich auf Gewinn. Joe stand hinten an der Wand und hat sich nicht getraut zu atmen. #sprecher:mutter #stimmung:nachdenklich
Zug dreiunddreißig. Ich sehe nur meinen Angriff. #sprecher:mutter #stimmung:nachdenklich
Ich ziehe den Turm vor, hinter meine Dame, auf dieselbe Schräge. #sprecher:mutter #stimmung:nachdenklich #brett:mamaspiess
Und ganz hinten, am anderen Ende des Brettes, steht sein Läufer und sieht die Schräge entlang. Seit zwanzig Zügen. #sprecher:mutter #stimmung:nachdenklich #brett:mamaspiess.1
Die Dame muss weg, und der Turm dahinter fällt. Ein Spieß. #sprecher:mutter #stimmung:bitter #brett:mamaspiess.2
Das Einfachste, was es gibt. #sprecher:mutter #stimmung:bitter
Ich hab den Läufer nicht gesehen. Fünfundzwanzig Jahre, und ich sehe ihn jede Nacht. #sprecher:mutter #stimmung:bitter #musik:mama #pause:2
„Wenn ich angreife, sehe ich nichts anderes. Aufpassen!!“ Sie hat es mit dreizehn ins blaue Heft geschrieben. #sprecher:erzaehler
Alle haben gesagt, das passiert. Das passiert jedem. #sprecher:mutter #stimmung:bitter
Joe hat es gesagt, meine Mutter, der Gegner sogar. Ein netter Junge. #sprecher:mutter #stimmung:nachdenklich
Er hat sich entschuldigt. #sprecher:mutter #stimmung:nachdenklich
Ich wollte nicht, dass es jedem passiert. Ich wollte, dass es mir nicht passiert. #sprecher:mutter #stimmung:bitter #musik:aus
Ich hab die Figuren in den Keller getragen. Schule, Ausbildung. #sprecher:mutter #stimmung:nachdenklich
Du. Es ging ja. #sprecher:mutter #stimmung:nachdenklich
* [„Du hast gesagt: Weiß steht besser.“]
- Sie sieht dich an. #sprecher:erzaehler
* [„Am ersten Abend. Drei Sekunden.“]
- Zwei. Es waren zwei. #sprecher:mutter #stimmung:lachtOhneSpott
Ich hab mich so erschrocken. #sprecher:mutter #stimmung:lachtOhneSpott
Du legst das blaue Heft neben das Foto, aufgeschlagen auf der letzten Seite. Mama sieht auf die leere Stelle. #sprecher:erzaehler #bild:blaues_heft
Sie steht auf, geht zum Fenster und schiebt die Hände in die Ärmel ihrer Strickjacke. #sprecher:erzaehler #bild:aus #pause:2 #gehe:mutter>14,3
Gut. Eine Partie. #sprecher:mutter #stimmung:denktNach
In Ironwood. Ich will den Raum sehen. #sprecher:mutter #stimmung:laechelt
Und wenn ich gewinne, räumst du die Spülmaschine aus. #sprecher:mutter #stimmung:laechelt
-> mama_fahrt

=== mama_fahrt ===
* [Am Samstag mit Mama nach Ironwood fahren]
    ~ reise("ironwood.kantine", "kantineAusgang")
    -> END
* [„Nicht jetzt.“]
    Samstag. Ich hab frei. #sprecher:mutter #stimmung:laechelt
    -> END

=== mutter_alltag ===
// Je Akt eine Stufe (Querschnitt 17.11.2026), damit Mama nie hinter der Geschichte zurückbleibt:
// Akt 4 Stolz, Akt 3 Nähe am Telefon (nach dem Vorwurf: sie glaubt {held}), nach Ironwood das
// Taschenschach, Akt 2 Sorge und das Verbot, Akt 1 der Einzug.
{
// Lektorat 19.11.2026: Nach der Meisterschaft spricht Mama nicht mehr davor.
- abschiedGesehen:
    {~Dein Partieformular hängt am Kühlschrank. Neben meinem von damals.|Joe hat dein Foto aus der Arena in einen Rahmen aus Stahl gesteckt. Es hängt jetzt im Werk.|Ich bin stolz auf dich, weißt du das? Nicht wegen des Pokals.} #sprecher:mutter #stimmung:froh
- endeAkt3Gesehen:
    {~Ich hab auf Station erzählt, dass du gegen eine Großmeisterin spielst. Die halbe Nachtschicht weiß es jetzt.|Dein Partieformular hängt am Kühlschrank. Neben meinem von damals.|Grundreihe, und dann spiel, wie du willst. Ich bin stolz auf dich, weißt du das?} #sprecher:mutter #stimmung:froh
- tiefpunktGesehen:
    {~Was die in Port Delacroix gesagt haben, glaube ich keine Sekunde. Ich kenne deine Züge.|Ruf an, wenn du angekommen bist, egal wie spät. Ich hab das Telefon in der Kitteltasche.|Wer dir das noch mal vorwirft, kriegt es mit mir zu tun. Und mit Joe.} #sprecher:mutter #stimmung:nachdenklich
- einladungGesehen:
    {~Ruf an, wenn du angekommen bist, egal wie spät. Ich hab das Telefon in der Kitteltasche.|Juno hat versprochen, dass du isst. Ich glaube ihr nicht immer.|Nachtschicht. Aber wenn du anrufst, gehe ich ran, immer.} #sprecher:mutter #stimmung:laechelt
- mamaSpielt:
    {~Ich hab mir ein Taschenschach gekauft. Für die Nachtschicht.|Das blaue Heft liegt auf dem Küchentisch. Schreib rein, wenn du gespielt hast.|Fünfundzwanzig Jahre. Und die Figuren fühlen sich an wie gestern.} #sprecher:mutter #stimmung:laechelt
- endeAkt1Gesehen:
    {verbotGesehen:
        {~Ironwood nicht. Ich weiß, dass du fragen willst, bitte nicht.|Riverton ist in Ordnung. Ruf an, wenn der Zug Verspätung hat.|Ich hab gleich Nachtschicht. Schließ ab, wenn du gehst.} #sprecher:mutter #stimmung:nachdenklich
    - else:
        {~Riverton, ja? Mit dem Zug zurück, vor dem Dunkelwerden.|Du läufst jetzt durch Wälder bis nach Riverton. Ich sag dazu nichts, fast nichts.|Ich hab gleich Nachtschicht. Im Kühlschrank ist noch Pizza.} #sprecher:mutter #stimmung:nachdenklich
    }
// Lektorat 20.11.2026: Am Einzugsabend fängt Mama noch nicht an, und Mrs. Calloway kennt man nicht.
- not ersteNachtGesehen:
    Geh schlafen, Spatz. Morgen sieht alles weniger nach Kartons aus. #sprecher:mutter #stimmung:muede
- else:
    {~Ich hab gleich Nachtschicht. Im Kühlschrank ist noch Pizza.|{aufbruchGesehen:Dein Zimmer sieht fast bewohnt aus. Fast.|Hast du die Kartons in deinem Zimmer schon ausgepackt? Einen wenigstens?}|Wenn du rausgehst: Hauptsache, du bist vor zehn zu Hause.|Mrs. Calloway von gegenüber hat Kuchen gebracht. Die Leute hier sind nett.} #sprecher:mutter #stimmung:laechelt
}
-> END

// ---------------------------------------------------------------- Haustür am ersten Tag

// Übergang „haustuer“ nach draußen (orte.json, `wenn: ersteLektionBesprochen`): Der Dialog läuft vor
// dem Wechsel, die Hülle prüft die Bedingung danach. Bis Ambrose die erste Partie besprochen hat
// („Nimm das Brett mit, Kind“, maple-falls-dachboden.nach_erster_partie), bleibt {held} im Haus;
// sonst spräche Ambrose draußen (Lily, Mr. Abernathy, Mrs. Calloway, Jo), obwohl das Brett noch auf
// dem Dachboden liegt (Dialogprüfung 17.11.2026). Danach kommt hier keine Zeile, die Tür geht
// einfach auf. Ambrose spricht in diesem Knoten nie: Vorher ist er nicht erwacht oder nicht dabei.
=== haustuer ===
// Lektorat 19.11.2026: Die Tür bleibt bis nach der ersten Nacht zu; vorher stimmten draußen
// Tageszeit (Guten Morgen, Schule) und Reihenfolge (Mama erzählt vom Schachteam) nicht.
{ersteNachtGesehen: -> END}
{
- ersterAbendGesehen:
    Draußen ist es dunkel. Oben in deinem Zimmer wartet das Brett. #sprecher:erzaehler
    -> END
- ersteLektionBesprochen:
    Unten wartet Mama mit der Pizza. Die Stadt läuft nicht weg. #sprecher:erzaehler
    -> END
}
{brettBeruehrt:
    Du hast die Hand schon an der Klinke. Aber oben auf dem Dachboden steht das Brett, und es lässt dich nicht los. #sprecher:erzaehler
- else:
    Die Stadt läuft nicht weg. Heute ist Umzug. #sprecher:mutter #stimmung:muede
    Sieh dich lieber erst auf dem Dachboden um, da oben steht noch alles voll. #sprecher:mutter #stimmung:muede
}
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
Ich hab heute frei. Und der Herd ist immer noch nicht angeschlossen. #sprecher:mutter #stimmung:laechelt
Diner? Ich lade dich ein. #sprecher:mutter #stimmung:froh
* [„Pommes?“]
    Pommes. Und vielleicht sogar ein Salat – vielleicht. #sprecher:mutter #stimmung:lacht
* [„Gern.“]
// Anwesenheit (Befund des Autors, 25.11.2026): Der Abend spielte im Wohnzimmer, Hector redete
// dort, und Mama fragte „Gibt es hier Ketchup?“. Jetzt geht ihr ins Diner; dort sitzt Mama in der
// Nische (mapleFalls.mutterDiner), Hector steht hinter der Theke, und der Eingang des Diners
// spielt den Abend (diner_abend).
- Mama nimmt die Jacke vom Haken. Ihr geht die Hauptstraße hinunter, bis die Leuchtschrift vom Diner über euch summt. #sprecher:erzaehler
~ reise("mapleFalls.diner", "dinerAusgang")
-> END

// Mama in der Nische, falls {held} den Abend abgebrochen hat und sie anspricht.
=== mutter_diner ===
Setz dich, Spatz. Die Pommes kommen gleich. #sprecher:mutter #stimmung:laechelt
-> diner_abend

=== diner_abend ===
Das Diner an der Hauptstraße ist lang und schmal wie ein Eisenbahnwagen. Rote Bänke, eine Theke aus Blech. #sprecher:erzaehler #musik:diner #geraeusch:diner_kueche #klang:tuerglocke #schwenk:hector
Es riecht nach Zwiebeln und Kaffee. Aus der Musikbox kommt leise ein altes Lied. #sprecher:erzaehler
Bestellung läuft! #sprecher:hector #stimmung:froh
{hectorGetroffen:Hector ruft es in die Küche, obwohl außer ihm niemand in der Küche ist.|Er ruft es in die Küche, obwohl außer ihm niemand in der Küche ist. Auf seiner Schürze steht „Hector“.} #sprecher:erzaehler
Er legt euch Papiersets hin. Darauf ein Schachbrett: „Rätsel der Woche: Weiß zieht und setzt in einem Zug matt.“ #sprecher:erzaehler
Nimm zwei. Ist schwer diese Woche. #sprecher:hector #stimmung:nachdenklich
Ich krieg's nicht raus. #sprecher:hector #stimmung:nachdenklich
* [Das Rätsel ansehen]
* [Erst Pommes bestellen]
    Pommes kommen. Das Rätsel läuft nicht weg. #sprecher:hector #stimmung:laechelt
- Neben der Kasse liegt ein Stapel Sets, mindestens zwanzig. Auf keinem ist etwas eingezeichnet. #sprecher:erzaehler
Du suchst. Was hängt? #sprecher:erzaehler
Wohin kann die Dame? #sprecher:erzaehler #pause
Mama sieht zu. Sie sagt nichts. #sprecher:erzaehler
Aber ihr Finger bewegt sich, einen Zentimeter über dem Papier, auf ein Feld. Eine halbe Sekunde vor deinem Stift. #sprecher:erzaehler #pause:3
Du tust, als hättest du es nicht gesehen. Dann zeichnest du den Pfeil ein. #sprecher:erzaehler
Hector hält das Set ins Licht wie einen Geldschein. #sprecher:erzaehler
Matt in eins! Am ersten Abend! #sprecher:hector #stimmung:froh
Das kommt an die Wand. #sprecher:hector #stimmung:froh
Deine Mutter war schneller. Ich sage es nur, damit du es weißt. #sprecher:ambrose #stimmung:laechelt
* [Den Kopf schütteln, ganz leicht]
    Schon gut. Ich schweige. #sprecher:ambrose #stimmung:lacht
    Gentlemen schweigen über Damen. #sprecher:ambrose #stimmung:lacht
* [„Pst.“]
    Mama sieht auf. „Was?“ Du zeigst auf die Musikbox. #sprecher:erzaehler
- Die Pommes kommen. Hector bleibt am Tisch stehen, das Geschirrtuch über der Schulter. #sprecher:erzaehler
Gestern saß hier einer. Anzug, zwei Telefone, kein Lächeln. #sprecher:hector #stimmung:nachdenklich
Hat Kaffee bestellt und nur auf Zahlen geguckt. Wollte wissen, wem das Schulgebäude gehört. #sprecher:hector #stimmung:nachdenklich
Hab gesagt: der Schule. #sprecher:hector #stimmung:lacht
Dann lacht er nicht mehr. Die Musikbox setzt für einen Takt aus. #sprecher:erzaehler #pause #musik:aus
Hat er nicht komisch gefunden. #sprecher:hector #stimmung:laechelt #musik:diner
* [„Wer war das?“]
    Keine Ahnung. Hat nicht mal Trinkgeld gegeben. #sprecher:hector #stimmung:bitter
    Kaffee schwarz, ohne alles. #sprecher:hector #stimmung:bitter
* [Nichts sagen]
- Gibt es hier Ketchup? #sprecher:mutter #stimmung:laechelt
Draußen ist es dunkel geworden. Hinter dem Fenster die Hauptstraße, die einzige Ampel, dahinter schwarze Bäume. #sprecher:erzaehler
Es ist ein guter Abend. Du merkst es erst, als er fast vorbei ist. #sprecher:erzaehler
Du hast den ganzen Tag nicht an die alte Wohnung gedacht. #sprecher:erzaehler #musik:karte #geraeusch:aus
~ dinerAbendErlebt = true
Mama zahlt. Ihr geht zusammen nach Hause, die Hände in den Jackentaschen. #sprecher:erzaehler
~ reise("mapleFalls.wohnzimmer", "haustuer")
-> END

// ---------------------------------------------------------------- Akt 2: Nicht Ironwood

// Szene 38 nach dem Roman, Kapitel 23 („Frag nicht“). Stimmung: häuslich, dann eine geschlossene
// Tür. Das Verbot kommt trocken: bei „Nein“ keine Musik und keine Pause, der Dialog geht einfach
// weiter. Danach Tür, Wagen, das Thema von Maple Falls nur auf dem Klavier. Mamas Porträt
// „verschlossen“ (fällt auf die Grundfassung zurück, solange es das Bild nicht gibt).
=== nicht_ironwood ===
~ verbotGesehen = true
~ setzeSzene("akt2.verbot")
// Spieltest 2 (17.11.2026): Juno hat den Zettel in Riverton schon angekündigt (riverton-wohnwagen.turnier_nachricht), deshalb liegt er hier nur noch da.
Der Zettel von Coach Delgado liegt auf dem Küchentisch, wie Juno gesagt hat. #sprecher:erzaehler #musik:aus #geraeusch:kuehlschrank
Schief kopiert: „Freundschaftsturnier beim Stahlwerker-Club Ironwood. Vier Bretter. Wir fahren!!!“ #sprecher:erzaehler #bild:zettel_ironwood
Unten ist eine Zeile frei für die Unterschrift. Du legst ihn neben Mamas Tasse. #sprecher:erzaehler #bild:aus
Mama liest ihn im Stehen, den Mantel schon an, die Schlüssel in der Hand. Ihre Augen halten an. #sprecher:erzaehler
Nein. #sprecher:mutter #stimmung:verschlossen
Nicht Ironwood. #sprecher:mutter #stimmung:verschlossen
* [„Aber der Coach hat …“]
    Der Coach kann fahren, wohin sie will. #sprecher:mutter #stimmung:verschlossen
* [„Warum?“]
- Sie legt den Zettel hin, mit der Schrift nach unten. #sprecher:erzaehler
Du fährst nach Riverton, du läufst durch Wälder, ich sage zu allem Ja. Dieses eine Mal sage ich Nein. #sprecher:mutter #stimmung:bitter
Frag nicht. Bitte, nicht heute. #sprecher:mutter #stimmung:verschlossen
Dann ist sie an der Tür, und die Tür ist zu. Der Wagen springt an und rollt die Einfahrt hinunter – Nachtschicht. #sprecher:erzaehler #klang:wagen
Deine Mutter hat Angst. Vor einer Stadt, das ist selten. #sprecher:ambrose #stimmung:nachdenklich #musik:mapleFalls.klavier
Vor Menschen hat man Angst, vor Schulden, vor dem Zahnarzt. Aber vor einer Stadt. #sprecher:ambrose #stimmung:nachdenklich
* [„Sie hat nur gesagt: nicht zum Turnier.“]
* [Den Zettel umdrehen]
    Du drehst ihn um. Nein zum Zettel, denkst du. #sprecher:erzaehler
    Nein zum Turnier. #sprecher:erzaehler
- Nicht zum Turnier, sagst du. Das ist eine Unterscheidung, die Advokaten machen. #sprecher:ambrose #stimmung:laechelt
Er klingt nicht tadelnd. Er klingt neugierig. #sprecher:erzaehler
Zum ersten Mal seit Riverton interessiert ihn etwas mehr als die Tische. #sprecher:erzaehler
// Anwesenheit (Befund des Autors, 25.11.2026): Juno sprach hier im Wohnzimmer, stand aber draußen
// vor der Tür. Jetzt klingelt sie, {held} geht hinaus, und das Gespräch mit dem Rad führt sie vor
// dem Haus (maple-falls-aussen.juno_fahrrad).
Am Samstag klingelt draußen eine Fahrradklingel. Vor der Haustür wartet Juno mit dem grünen Rad. #sprecher:erzaehler #klang:fahrradklingel #geraeusch:aus
~ reise("mapleFalls.aussen", "start")
-> END

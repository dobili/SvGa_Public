// Ort: Wohnzimmer im Haus an der Birch Lane (Akt 1, Maple Falls). Figur: Mama.
//
// Szenen der Story-Bibel (docs/spiel/05_Story_Bibel.md, Abschnitt 4):
// 1 Ankunft (akt1.ankunft), 4 Abend im neuen Haus (akt1.ersterAbend), 13 Aufbruch (akt1.aufbruch).
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

=== mutter ===
{
- not ankunftGesehen and not brettBeruehrt: -> ankunft
- not ankunftGesehen: -> ankunft_kurz
- ausgangMapleFallsErsteLektion != "" and ausgangMapleFallsErsteLektion != "abgebrochen" and not ersteLektionBesprochen:
    Bist du oben fertig? Die Pizza wird kalt, aber ein paar Minuten hat sie noch. #sprecher:mutter
    -> END
- ersteLektionBesprochen and not ersterAbendGesehen: -> erster_abend
- kenntHale and nadelMapleFalls > 0 and not aufbruchGesehen: -> aufbruch
- else: -> mutter_alltag
}

=== ankunft ===
~ ankunftGesehen = true
~ setzeSzene("akt1.ankunft")
Der Umzugswagen ist weg. Im Wohnzimmer stehen nur Kartons, ein Sofa und ein Pizzakarton. #sprecher:erzaehler
Da bist du ja, {held}. Willkommen in Maple Falls. #sprecher:mutter #stimmung:froh
Ich weiß, es sieht noch nicht nach Zuhause aus. Gib dem Haus eine Woche. #sprecher:mutter
* [„Es ist ziemlich groß.“]
    Groß und alt. Deshalb konnten wir es uns leisten. #sprecher:mutter
* [„Ich vermisse die alte Wohnung.“]
    Ich auch. Aber hier hast du ein Zimmer mit Fenster zum Garten. #sprecher:mutter
- Die alte Mrs. Whitlock hat hier gewohnt, ihr ganzes Leben lang. #sprecher:mutter
Ihr Dachboden ist noch voll. #sprecher:mutter
Auf einer Kiste neben der Treppe steht mit dickem Stift: „Whitlock – nicht wegwerfen“. #sprecher:erzaehler
Bringst du die Kiste nach oben? Kisten auf den Dachboden, dann Pizza. #sprecher:mutter
In der Reihenfolge. #sprecher:mutter
* [„Schon unterwegs.“]
    Danke. Und schau nicht zu lange in die alten Sachen. Da oben ist es staubig. #sprecher:mutter
* [„Erst Pizza?“]
    Netter Versuch. Erst die Kiste. #sprecher:mutter #stimmung:ernst
- -> END

=== ankunft_kurz ===
~ ankunftGesehen = true
~ setzeSzene("akt1.ankunft")
Da bist du ja, {held}. Warst du schon auf dem Dachboden? Staubig, oder? #sprecher:mutter
Gib dem Haus eine Woche. Dann ist es ein Zuhause. #sprecher:mutter #stimmung:froh
-> mutter

=== erster_abend ===
~ ersterAbendGesehen = true
Du kommst mit dem alten Brett die Treppe herunter. Mama sitzt mit einem Stück Pizza auf einem Karton. #sprecher:erzaehler
Was hast du da? Zeig mal. #sprecher:mutter
Sie sieht lange auf die Stellung. Dann sagt sie, ohne nachzudenken: „Schwarz steht besser.“ #sprecher:erzaehler #pause
* [„Du kannst Schach?“]
    Ich? Nein. Das hab ich irgendwo gelesen. #sprecher:mutter
* [„Woher weißt du das?“]
    Weiß ich nicht. Sieht halt so aus. #sprecher:mutter
- Deine Mutter, wenn ich das sagen darf, lügt schlecht. #sprecher:ambrose
Das Brett ist alt. Pass auf die Figuren auf. Die sind bestimmt was wert. #sprecher:mutter
Ach, und im Briefkasten lag ein Zettel von der Schule. Die haben ein Schachteam. #sprecher:mutter
* [„Vielleicht schau ich mal hin.“]
    Mach das. Vielleicht findest du da Freunde. #sprecher:mutter #stimmung:froh
* [„Schach ist doch nur für Streber.“]
    Das haben sie früher auch zu mir gesagt. #sprecher:mutter
    Zu … ach, egal. Iss deine Pizza. #sprecher:mutter
- Ein Schachteam. Wie vornehm diese Zeit ist. Morgen gehen wir hin. #sprecher:ambrose
-> END

=== aufbruch ===
~ aufbruchGesehen = true
Coach Delgado hat angerufen. Ihr spielt Samstag auswärts in Cedar Creek? #sprecher:mutter
* [„Ich spiele am vierten Brett!“]
    Am vierten Brett. Ich weiß, was das heißt. Glaube ich. #sprecher:mutter #stimmung:froh
* [„Darf ich mit?“]
    Du darfst. Ich hab schon unterschrieben. #sprecher:mutter
- Mit dem Coach im Schulbus, und um acht seid ihr zurück. #sprecher:mutter
Und das alte Brett nimmst du mit, oder? Dann verlier es nicht. #sprecher:mutter
* [„Woher weißt du, dass ich es mitnehme?“]
    Du trägst es seit Tagen herum. Wie ein Haustier. #sprecher:mutter
* [„Versprochen.“]
    Gut. Viel Glück, {held}. #sprecher:mutter #stimmung:froh
- Der Bus wartet am Stadtpark. #sprecher:erzaehler
-> END

=== mutter_alltag ===
{~Ich hab gleich Nachtschicht. Im Kühlschrank ist noch Pizza.|Hast du die Kartons in deinem Zimmer schon ausgepackt? Einen wenigstens?|Wenn du rausgehst: Hauptsache, du bist vor zehn zu Hause.|Die Nachbarin hat Kuchen gebracht. Die Leute hier sind nett.} #sprecher:mutter
-> END

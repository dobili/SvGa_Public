// Szene: Fund des Schachbretts auf dem Dachboden (Akt 1, Maple Falls, Hauptquest „Das Brett“).
//
// Aufbau einer Ink-Datei im Abenteuer (docs/spiel/04_Architektur.md, Abschnitt 9):
// - Jede Datei ist ein Ort oder eine Szene; die Knoten (=== name ===) heißen in den Quests
//   „datei.knoten“, hier etwa „maple-falls-dachboden.ambrose_erwacht“.
// - Tags am Zeilenende steuern die Anzeige: #sprecher:ambrose (Porträt und Name),
//   #stimmung:streng (Porträtvariante), #klang:knarren (Geräusch), #pause (kurze Pause).
// - Externe Funktionen (EXTERNAL) führt die React-Hülle aus; sie schreiben in den Spielstand.
//   Ihre Namen sind fest: gibKarte, setzeSzene, beginnePartie, beginneAufgaben, setzeZustand,
//   schalteSteckbrief. Das Spiel bindet sie beim Laden der Geschichte (inkjs BindExternalFunction).
// - Globale Variablen (VAR) liegen im Spielstand (Feld dialogvariablen) und überleben Szenen.
// - Der Name des Helden kommt aus dem Spielstand: {held}.
// - Keine Seitenzahlen des Buches, nur Abschnitte und Abbildungen (CLAUDE.md, Regel 1).

EXTERNAL gibKarte(kennung)
EXTERNAL setzeSzene(kennung)
EXTERNAL beginnePartie(begegnung)

VAR held = "Du"
VAR ambroseVertrauen = 0
VAR brettBeruehrt = false
// Ergänzt mit dem Auftrag mittel-1 (Dialoge Maple Falls): ausgangErsteLektion, reiheSamBestanden,
// reiheJunoBestanden und nadelMapleFalls setzt die Hülle nach Partie, Aufgabenrunde und Clubkampf
// (Vorschlag im Bericht); die übrigen setzt Ink selbst.
VAR ersteLektionBesprochen = false
VAR clubBeigetreten = false
VAR kenntHale = false
VAR ausgangErsteLektion = ""
VAR reiheSamBestanden = false
VAR reiheJunoBestanden = false
VAR nadelMapleFalls = 0

=== dachboden_brett ===
Staub, Kisten, ein kaputter Lampenschirm. Unter einer Decke liegt etwas Flaches, Schweres. #sprecher:erzaehler
{ brettBeruehrt:
    Das alte Brett. Die Figuren stehen noch so, wie du sie verlassen hast. #sprecher:erzaehler
    -> ambrose
}
* [Die Decke wegziehen] -> brett_beruehren
* [Lieber nicht anfassen]
    Du lässt die Decke liegen. Aber irgendetwas an der Form darunter lässt dich nicht los. #sprecher:erzaehler
    -> dachboden_brett

=== brett_beruehren ===
~ brettBeruehrt = true
Ein Schachbrett. Holz, abgewetzt, die Ecken dunkel vom Anfassen. Die Figuren stehen mitten in einer Partie. #sprecher:erzaehler #klang:knarren
Du hebst den weißen König an. #sprecher:erzaehler #pause
Wer wagt es, mein Brett zu berühren? #sprecher:ambrose #stimmung:streng
* [„Wer … wer ist da?“]
    Ein Meister. Einst. Jetzt offenbar ein Mieter in einer Kiste. #sprecher:ambrose
    -> ambrose_erwacht
* [Den König fallen lassen und wegrennen]
    Der König kullert über die Dielen. Hinter dir ein Seufzen, wie von jemandem, der lange geschwiegen hat. #sprecher:erzaehler
    Lauf nur. Das Brett wartet. Es hat hundertsechzig Jahre gewartet. #sprecher:ambrose
    -> dachboden_brett

=== ambrose_erwacht ===
Ambrose Whitlock, zu Diensten. New Orleans, 1858. Ich habe gegen Männer gespielt, deren Namen du in Büchern findest. #sprecher:ambrose #stimmung:stolz
Und du, {held}, hältst einen König wie einen Suppenlöffel. #sprecher:ambrose
* [„Ich kann kaum Schach.“]
    ~ ambroseVertrauen = ambroseVertrauen + 1
    Ehrlich. Das ist mehr, als die meisten mitbringen. #sprecher:ambrose
    -> erste_lektion
* [„Ich kann schon ein bisschen.“]
    Das sagen alle. Dann zeig es mir. #sprecher:ambrose #stimmung:streng
    -> erste_lektion

=== erste_lektion ===
Wir fangen vorne an. Nicht mit Tricks. Mit der einen Frage, die jeder Zug beantworten muss: Was hängt? #sprecher:ambrose
Nimm das hier. Es ist kein Zauber. Es ist ein Fingerzeig. #sprecher:ambrose #klang:karte
~ gibKarte("fingerzeig")
~ setzeSzene("akt1.ambroseErwacht")
Und jetzt: Du gegen mich. Nur ein paar Züge. Ich will sehen, wie du denkst. #sprecher:ambrose
* [„Jetzt?“]
    Die Zeit, in der ich warten konnte, ist vorbei. #sprecher:ambrose
    -> partie_beginnt
* [„Gut. Aber sei nicht streng.“]
    Ich bin tot. Streng ist das Mindeste, was ich noch kann. #sprecher:ambrose #stimmung:lacht
    -> partie_beginnt

=== partie_beginnt ===
~ beginnePartie("mapleFalls.ersteLektion")
-> END

=== ambrose_wartet ===
Nun? Hast du das Brett nur zum Anschauen hochgetragen? #sprecher:ambrose
* [„Lass uns spielen.“]
    -> partie_beginnt
* [„Später.“]
    Später. Das Wort, mit dem mein Rivale mich in den Tod warten ließ. #sprecher:ambrose #stimmung:bitter
    -> END

// Ab hier ergänzt (Story-Bibel, Szene 3 Nachgespräch und Gespräche allein mit Ambrose).

=== ambrose ===
{
- ausgangErsteLektion == "": -> ambrose_wartet
- not ersteLektionBesprochen: -> nach_erster_partie
- else: -> ambrose_rat
}

=== nach_erster_partie ===
~ ersteLektionBesprochen = true
{ausgangErsteLektion:
- "sieg": Du hast gewonnen. Glück ist der Anfang jeder Begabung. Der Rest ist Arbeit. #sprecher:ambrose #stimmung:stolz
- "remis": Remis. Weder du noch ich. Für den ersten Abend ist das gar nicht übel. #sprecher:ambrose
- else: Verloren. Gut. Jetzt weißt du, was du lernen willst. #sprecher:ambrose
}
Nun zu der Karte, die ich dir gab. Der Fingerzeig. #sprecher:ambrose
In einer Partie zeigt er dir die Figur, die arbeiten will. Welcher Zug, das findest du selbst. #sprecher:ambrose
Einmal je Partie darfst du ihn spielen. Er geht nicht verloren. #sprecher:ambrose
* [„Und was ist mit der Frage von vorhin?“]
    Was hängt? Gut, dass du fragst. #sprecher:ambrose
* [„Kann ich nicht einfach immer den Fingerzeig nehmen?“]
    Dann lernst du nur, auf Finger zu sehen. Hör lieber zu. #sprecher:ambrose #stimmung:streng
- Eine Figur hängt, wenn sie angegriffen wird und niemand sie schützt. #sprecher:ambrose
Oder wenn mehr Figuren sie angreifen, als sie verteidigen. Zähle beide Seiten. Immer. #sprecher:ambrose
Wer mehr wissen will: Kapitel 1, Abschnitt 1.4. Ein Buch, das ich gern geschrieben hätte. #sprecher:ambrose
* [„Zählen. Verstanden.“]
    ~ ambroseVertrauen = ambroseVertrauen + 1
    Das sagen viele. Wir werden sehen. #sprecher:ambrose
* [„Das klingt langweilig.“]
    Langweilig ist ein verlorener Turm. Zählen dauert drei Sekunden. #sprecher:ambrose #stimmung:streng
- Deine Mutter erwähnte ein Schachteam an deiner Schule. #sprecher:ambrose
Geh hin. Nimm mich mit. Ich will sehen, wie man heute spielt. #sprecher:ambrose
-> END

=== ambrose_rat ===
{
- not clubBeigetreten: Die Schule, {held}. Das Schachteam wartet, und ich werde nicht jünger. #sprecher:ambrose
- not (reiheSamBestanden and reiheJunoBestanden): Erst die Aufgaben deiner Mitspieler. Wer die Aufgaben scheut, scheut auch den Gegner. #sprecher:ambrose
- nadelMapleFalls == 0: Die Trainerin wartet. Und denk daran: Sie sieht nur ihren eigenen Angriff. #sprecher:ambrose
- not kenntHale: Eine Nadel am Kragen. Zu meiner Zeit gab es dafür Wein, für dich gibt es Limonade. #sprecher:ambrose #stimmung:lacht
- else: Cedar Creek? Den Namen habe ich nie gehört. Ich war allerdings eine Weile verhindert. #sprecher:ambrose
}
+ [„Erzähl mir von früher.“]
    {~New Orleans hatte Kaffeehäuser, in denen man bis Mitternacht spielte. Bei Kerzenlicht.|Ich habe einmal gegen den Kapitän eines Dampfers gespielt. Er setzte sein Schiff. Ich lehnte ab.|Der junge Morphy war der Beste von uns allen. Ich habe ihn nie geschlagen. Nie.} #sprecher:ambrose
    -> END
+ [„Bis später.“]
    Später. Ja. Geh nur. #sprecher:ambrose #stimmung:bitter
    -> END

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

=== dachboden_brett ===
Staub, Kisten, ein kaputter Lampenschirm. Unter einer Decke liegt etwas Flaches, Schweres. #sprecher:erzaehler
{ brettBeruehrt:
    Das alte Brett. Die Figuren stehen noch so, wie du sie verlassen hast. #sprecher:erzaehler
    -> ambrose_wartet
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
// Karte und Szene vergibt die Quest „Das Brett auf dem Dachboden“ (quests.json), sobald dieser
// Knoten erreicht ist; gibKarte/setzeSzene bleiben für Belohnungen ohne Quest.
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

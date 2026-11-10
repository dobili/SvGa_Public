// Szene: Fund des Schachbretts auf dem Dachboden (Akt 1, Maple Falls, Hauptquest „Das Brett“).
//
// Aufbau einer Ink-Datei im Abenteuer (docs/spiel/04_Architektur.md, Abschnitt 9):
// - Jede Datei ist ein Ort oder eine Szene; die Knoten (=== name ===) heißen in den Quests
//   „datei.knoten“, hier etwa „maple-falls-dachboden.ambrose_erwacht“.
// - Tags am Zeilenende steuern die Anzeige: #sprecher:ambrose (Porträt und Name),
//   #stimmung:streng (Porträtvariante), #klang:knarren (Geräusch), #pause (kurze Pause).
// - Externe Funktionen (EXTERNAL) führt die React-Hülle aus; sie schreiben in den Spielstand.
//   Ihre Namen sind fest: gibKarte, setzeSzene, beginnePartie, beginneAufgaben, setzeZustand,
//   schalteSteckbrief, reise(karte, ausloeser). Das Spiel bindet sie beim Laden der Geschichte (inkjs BindExternalFunction).
// - Globale Variablen (VAR) liegen im Spielstand (Feld dialogvariablen) und überleben Szenen.
// - Der Name des Helden kommt aus dem Spielstand: {held}.
// - Keine Verweise auf das Buch (Kapitel, Abschnitte, Seiten): docs/spiel/ENTSCHEIDUNGEN.md, 10.11.2026.

EXTERNAL gibKarte(kennung)
EXTERNAL setzeSzene(kennung)
EXTERNAL beginnePartie(begegnung)

VAR held = "Du"
VAR ambroseVertrauen = 0
VAR brettBeruehrt = false
// Ergänzt mit dem Auftrag mittel-1 (Dialoge Maple Falls): ausgangMapleFallsErsteLektion,
// reiheSamBestanden, reiheJunoBestanden und nadelMapleFalls setzt die Hülle nach Partie,
// Aufgabenrunde und Clubkampf (regeln/dialogvariablen.ts); endeAkt1Gesehen setzt
// cedar-creek-aussen.ink; die übrigen setzt Ink in dieser Datei.
VAR ersteLektionBesprochen = false
VAR ambroseErwachtGesehen = false
VAR clubBeigetreten = false
VAR kenntHale = false
VAR ausgangMapleFallsErsteLektion = ""
VAR reiheSamBestanden = false
VAR reiheJunoBestanden = false
VAR nadelMapleFalls = 0
VAR endeAkt1Gesehen = false

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
    Lauf nur. Das Brett wartet. Darin ist es geübt. #sprecher:ambrose
    -> dachboden_brett

=== ambrose_erwacht ===
~ ambroseErwachtGesehen = true
Ein Kind. Bei allen Heiligen, ein Kind hält meinen König. Wie lange habe ich in dieser Kiste gelegen? #sprecher:ambrose
Ambrose Whitlock, zu Diensten. Schachmeister aus New Orleans. Verzeih den Ton, ich habe lange mit niemandem gesprochen. #sprecher:ambrose #stimmung:stolz
Und du bist {held}? Der Name steht hier oben auf jeder zweiten Kiste. Du hältst den König wie einen Suppenlöffel. #sprecher:ambrose
* [„Ich kann kaum Schach.“]
    ~ ambroseVertrauen = ambroseVertrauen + 1
    Ehrlich. Das ist mehr, als die meisten mitbringen. #sprecher:ambrose
    -> erste_lektion
* [„Ich kann schon ein bisschen.“]
    Das sagen alle. Dann zeig es mir. #sprecher:ambrose #stimmung:streng
    -> erste_lektion

=== erste_lektion ===
Stell ihn zurück. Sachte. Sag mir nur eines: Spielt man noch, dort draußen? #sprecher:ambrose
Du nickst? Gut. Dann ist nicht alles verloren. #sprecher:ambrose
Nimm das hier. Es ist kein Zauber, nur ein Versprechen: Stockst du, so zeige ich dir die Figur, die arbeiten will. Ein Fingerzeig. #sprecher:ambrose #klang:karte
// Karte und Szene vergibt die Quest „Das Brett auf dem Dachboden“ (quests.json), sobald dieser
// Knoten erreicht ist; gibKarte/setzeSzene bleiben für Belohnungen ohne Quest.
Und jetzt setz dich. Du gegen mich, nur ein paar Züge. Ich möchte sehen, wie du denkst. #sprecher:ambrose
* [„Jetzt?“]
    Ich habe lange genug gewartet. Länger, als du dir vorstellen kannst. #sprecher:ambrose
    -> partie_beginnt
* [„Gut. Aber sei nicht streng.“]
    Ich bin tot. Streng ist das Mindeste, was ich noch kann. #sprecher:ambrose #stimmung:lacht
    -> partie_beginnt

=== partie_beginnt ===
~ beginnePartie("mapleFalls.ersteLektion")
-> END

=== ambrose_wartet ===
Nun? Die Figuren stehen, und ich habe Zeit. Zu viel davon. #sprecher:ambrose
* [„Lass uns spielen.“]
    -> partie_beginnt
* [„Später.“]
    Später. Ich kenne das Wort. Ich habe sehr lange darauf gewartet, dass es endet. #sprecher:ambrose #stimmung:bitter
    -> END

// Ab hier ergänzt (Story-Bibel, Szene 3 Nachgespräch und Gespräche allein mit Ambrose).

=== ambrose ===
{
- not ambroseErwachtGesehen: -> ambrose_erwacht
- ausgangMapleFallsErsteLektion == "" or ausgangMapleFallsErsteLektion == "abgebrochen": -> ambrose_wartet
- not ersteLektionBesprochen: -> nach_erster_partie
- else: -> ambrose_rat
}

=== nach_erster_partie ===
~ ersteLektionBesprochen = true
{ausgangMapleFallsErsteLektion:
- "sieg": Du hast gewonnen. Glück ist der Anfang jeder Begabung. Der Rest ist Arbeit. #sprecher:ambrose #stimmung:stolz
- "remis": Remis. Weder du noch ich. Für den ersten Abend ist das gar nicht übel. #sprecher:ambrose
- else: Verloren. Gut. Jetzt weißt du, was du lernen willst. #sprecher:ambrose
}
Und mein Versprechen gilt weiter. Der Fingerzeig bleibt dir. #sprecher:ambrose
Ich zeige dir die Figur, die arbeiten will. Den Zug findest du selbst, das nehme ich dir nicht ab. #sprecher:ambrose
Einmal in jeder Partie darfst du mich so fragen. Morgen wieder, und übermorgen auch. #sprecher:ambrose
* [„Du hast beim Spielen gemurmelt: Was hängt?“]
    Habe ich das? Eine alte Gewohnheit. Ich frage es vor jedem Zug. #sprecher:ambrose
* [„Kannst du mir nicht jeden Zug zeigen?“]
    Dann spielte ich und nicht du. Merk dir lieber eine Frage: Was hängt? #sprecher:ambrose #stimmung:streng
- Eine Figur hängt, wenn sie angegriffen wird und niemand sie schützt. #sprecher:ambrose
Oder wenn mehr Figuren sie angreifen, als sie verteidigen. Zähle beide Seiten. Immer. #sprecher:ambrose
Ich habe das an einem verlorenen Turm gelernt, vor einem vollen Kaffeehaus. Du lernst es billiger. #sprecher:ambrose
* [„Zählen. Verstanden.“]
    ~ ambroseVertrauen = ambroseVertrauen + 1
    Das sagen viele. Wir werden sehen. #sprecher:ambrose
* [„Das klingt langweilig.“]
    Langweilig ist ein verlorener Turm. Zählen dauert drei Sekunden. #sprecher:ambrose #stimmung:streng
- Und nun trag mich hinunter, {held}. Ich möchte sehen, in welcher Welt ich aufgewacht bin. #sprecher:ambrose
Nimm das Brett mit. Wo es ist, da bin ich auch. #sprecher:ambrose
-> END

=== ambrose_rat ===
{
- not clubBeigetreten: Die Schule, {held}. Das Schachteam wartet, und ich werde nicht jünger. #sprecher:ambrose
- not (reiheSamBestanden and reiheJunoBestanden): Erst die Stellungen, die deine Mitspieler dir vorlegen. Wer das Rätsel scheut, scheut auch den Gegner. #sprecher:ambrose
- nadelMapleFalls == 0: Die Trainerin wartet. Und denk daran: Sie sieht nur ihren eigenen Angriff. #sprecher:ambrose
- not kenntHale: Eine Nadel am Kragen. Zu meiner Zeit gab es dafür Wein, für dich gibt es Limonade. #sprecher:ambrose #stimmung:lacht
- endeAkt1Gesehen: Der Weg führt weiter, aber nicht heute. Ruh dich aus, {held}. #sprecher:ambrose
- else: Cedar Creek? Den Namen habe ich nie gehört. Ich war allerdings eine Weile verhindert. #sprecher:ambrose
}
+ [„Erzähl mir von früher.“]
    {~New Orleans hatte Kaffeehäuser, in denen man bis Mitternacht spielte. Bei Kerzenlicht.|Ich habe einmal gegen den Kapitän eines Dampfers gespielt. Er setzte sein Schiff. Ich lehnte ab.|Der junge Morphy war der Beste von uns allen. Ich habe ihn nie geschlagen. Nie.} #sprecher:ambrose
    -> END
+ [„Bis später.“]
    Später. Ja. Geh nur. #sprecher:ambrose #stimmung:bitter
    -> END

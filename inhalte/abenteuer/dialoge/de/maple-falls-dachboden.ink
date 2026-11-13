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
EXTERNAL zeigeFensterbank()

VAR held = "Du"
VAR ambroseImHalbfinaleGerufen = false
VAR mentorzugFreiGespielt = false
VAR epilogGesehen = false
VAR abschiedGesehen = false
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
// Ergänzt nach dem Roman zu Akt 1 (13.11.2026): ersterAbendGesehen setzt maple-falls-wohnzimmer.ink,
// ersteNachtGesehen diese Datei (Szene akt1.ersteNacht).
VAR ersterAbendGesehen = false
VAR ersteNachtGesehen = false
// Abende nach den Aufgabenreihen (Roman, Kapitel 6): todsuendenBestanden setzt die Hülle nach der
// Runde mapleFalls.todsuenden (Sams Dame); die „abend…Gesehen“ setzt diese Datei.
VAR todsuendenBestanden = false
VAR abendSamGesehen = false
VAR abendJunoGesehen = false
VAR abendDameGesehen = false
VAR ersterTagSpaeter = false

=== dachboden_brett ===
{abschiedGesehen and not epilogGesehen: -> epilog}
// Szene 2 nach dem Roman, Kapitel 2, und der Dialogprüfung (VM8 bis VM13). Stimmung: still,
// dann Staunen, nie gruselig. Klang: keine Musik, Holzknacken, Wind am Fenster.
Staub, Kisten, ein Lampenschirm ohne Lampe. Unter einer Decke liegt etwas Flaches, Schweres. #sprecher:erzaehler #musik:aus
// Roman, Kapitel 2: Die Decke ist das Einzige ohne Staub (Mrs. Whitlock hat das Brett gepflegt).
{ not brettBeruehrt:
    Auf allem hier oben liegt Staub. Nur auf dieser Decke nicht. #sprecher:erzaehler
}
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
Ein Schachbrett. Altes Holz, dunkel an den Ecken. Am Rand eingebrannt, ganz klein: A. W. 1857. #sprecher:erzaehler
Die Figuren stehen mitten in einer Partie. Ein Turm weit vorn, zwei Springer dicht beieinander, eine Handvoll Bauern. #sprecher:erzaehler
Du hebst den weißen König an. Er ist schwerer, als du dachtest. #sprecher:erzaehler #pause #klang:koenig_heben
Das Licht im Fenster wird anders. Der Staub beginnt, sich langsam zu drehen. Die Dielen knacken. Einmal, zweimal. #sprecher:erzaehler #pause:2 #klang:glocke_hell
Wer wagt es, mein Brett zu berühren? #sprecher:ambrose #stimmung:streng #erscheint #geist #musik:ambrose
* [„Wer … wer ist da?“]
    Ein Meister. Einst. Jetzt offenbar ein Mieter in einer Kiste. #sprecher:ambrose
    -> ambrose_erwacht
* [Den König fallen lassen und wegrennen]
    Der König kullert über die Dielen. Hinter dir ein Seufzen, wie von jemandem, der lange geschwiegen hat. #sprecher:erzaehler
    Lauf nur. Das Brett wartet. Darin ist es geübt. #sprecher:ambrose
    -> dachboden_brett

=== ambrose_erwacht ===
~ ambroseErwachtGesehen = true
Über dem Brett steht jemand, halb durchsichtig wie ein Bild in einer dunklen Fensterscheibe. Ein schmaler Mann in einem langen Rock. #sprecher:erzaehler
Ein Kind. Bei allen Heiligen. Ein Kind hält meinen König. #sprecher:ambrose #stimmung:streng #pause
Er sieht sich um, sieht die Kisten, das Fenster. Etwas in seinem Gesicht gibt nach. #sprecher:erzaehler
Wie lange habe ich hier gelegen? #sprecher:ambrose #stimmung:still
* [„Ich weiß nicht. Wir sind heute eingezogen.“]
- Heute. #sprecher:ambrose #pause
Ambrose Whitlock, zu Diensten. Schachmeister aus New Orleans. Verzeih den Ton, ich habe lange mit niemandem gesprochen. #sprecher:ambrose #stimmung:stolz
Whitlock. Wie auf der Kiste. #sprecher:erzaehler
* [„Ich bin {held}.“]
- Das habe ich mir gedacht. Der Name steht dort unten auf jedem zweiten Karton. #sprecher:ambrose
Du hältst den König wie einen Suppenlöffel. #sprecher:ambrose
* [„Ich kann kaum Schach.“]
    ~ ambroseVertrauen = ambroseVertrauen + 1
    Ehrlich. Das ist mehr, als die meisten mitbringen. #sprecher:ambrose
    -> erste_lektion
* [„Ich kann schon ein bisschen.“]
    Das sagen alle. Dann zeig es mir. #sprecher:ambrose #stimmung:streng
    -> erste_lektion

=== erste_lektion ===
Stell ihn zurück. Sachte. #sprecher:ambrose #pause
Sag mir nur eines. Spielt man noch? Dort draußen? #sprecher:ambrose #stimmung:still
Du nickst. #sprecher:erzaehler #pause
Er schließt die Augen. Gut. Dann ist nicht alles verloren. #sprecher:ambrose #stimmung:still
Nimm das hier. Es ist kein Zauber, nur ein Versprechen: Stockst du, so zeige ich dir die Figur, die arbeiten will. Ein Fingerzeig. #sprecher:ambrose #klang:karte
// Karte und Szene vergibt die Quest „Das Brett auf dem Dachboden“ (quests.json), sobald dieser
// Knoten erreicht ist; gibKarte/setzeSzene bleiben für Belohnungen ohne Quest. Der Fingerzeig
// kommt vor der Partie (Entscheidung 13.11.2026); der Roman erzählt ihn danach.
Diese Stellung rührt niemand an. Wir spielen daneben. #sprecher:ambrose
Er macht eine Bewegung mit zwei Fingern. Auf der anderen Hälfte des Tisches liegt ein zweites Brett, aus demselben Licht wie er. #sprecher:erzaehler
Setz dich. Du gegen mich. Nur ein paar Züge. Ich möchte sehen, wie du denkst. #sprecher:ambrose
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
// „Später“ am ersten Tag: eine der drei Stellen des Leitmotivs in Akt 1 (Archiv, Steg).
* [„Später.“]
    // Runde 11: Das Archiv erinnert sich daran (Leitmotiv „Später“, Dokument 19, Abschnitt 8).
    ~ ersterTagSpaeter = true
    Später. #sprecher:ambrose #pause
    Ich kenne das Wort. Ich habe sehr lange darauf gewartet, dass es endet. #sprecher:ambrose #stimmung:bitter
    -> END

// Ab hier ergänzt (Story-Bibel, Szene 3 Nachgespräch und Gespräche allein mit Ambrose).

=== ambrose ===
{
- not ambroseErwachtGesehen: -> ambrose_erwacht
- ausgangMapleFallsErsteLektion == "" or ausgangMapleFallsErsteLektion == "abgebrochen": -> ambrose_wartet
- not ersteLektionBesprochen: -> nach_erster_partie
- ersterAbendGesehen and not ersteNachtGesehen: -> erste_nacht
- reiheSamBestanden and not abendSamGesehen: -> abend_nach_sam
- reiheJunoBestanden and not abendJunoGesehen: -> abend_nach_juno
- todsuendenBestanden and not abendDameGesehen: -> abend_nach_dame
- else: -> ambrose_rat
}

=== nach_erster_partie ===
// Szene 3 nach dem Roman, Kapitel 3, und der Dialogprüfung (VM15 bis VM19).
~ ersteLektionBesprochen = true
{ausgangMapleFallsErsteLektion:
- "sieg": Du hast gewonnen. Glück ist der Anfang jeder Begabung. Der Rest ist Arbeit. #sprecher:ambrose #stimmung:stolz
- "remis": Remis. Weder du noch ich. Für den ersten Abend ist das gar nicht übel. #sprecher:ambrose
- else: Verloren. Gut. Jetzt weißt du, was du lernen willst. #sprecher:ambrose
}
Draußen dämmert es. Ihr habt über eine Stunde gespielt. Durch das Fenster zirpen Grillen. #sprecher:erzaehler #licht:abend #geraeusch:grillen
Du hast zweimal gefragt, bevor du gezogen hast. Die meisten, gegen die ich spielte, haben in ihrem Leben nicht zweimal gefragt. #sprecher:ambrose
Der Fingerzeig bleibt dir. Ich zeige die Figur, die arbeiten will. Den Zug findest du selbst. #sprecher:ambrose
* [„Was hängt? Das hast du mich gefragt.“]
    Eine alte Gewohnheit. Ich frage es vor jedem Zug. #sprecher:ambrose
* [„Kannst du mir nicht jeden Zug zeigen?“]
    Dann spielte ich und nicht du. Merk dir lieber eine Frage: Was hängt? #sprecher:ambrose #stimmung:streng
- Eine Figur hängt, wenn man sie schlagen kann und niemand zurückschlägt. Geh sie durch. Deine zuerst. Dann meine. #sprecher:ambrose
Ich habe das an einem verlorenen Turm gelernt, vor einem vollen Kaffeehaus. Du lernst es billiger. #sprecher:ambrose
* [„Was hängt. Verstanden.“]
    ~ ambroseVertrauen = ambroseVertrauen + 1
    Das sagen viele. Wir werden sehen. #sprecher:ambrose
* [„Das klingt langweilig.“]
    Langweilig ist ein verlorener Turm. Fragen dauert drei Sekunden. #sprecher:ambrose #stimmung:streng
// Roman, Kapitel 3 (neu): dieselbe Schrift auf Karte und Kisten; Mrs. Whitlock hat das Brett
// sechzig Jahre abgestaubt und Ambrose nie gehört. Gibt ihm von Anfang an Schuld und Dank.
- Du drehst die Karte um. Auf der Rückseite steht in steiler Schrift: „Fingerzeig“. #sprecher:erzaehler
Dieselbe Schrift wie auf den Kisten. #sprecher:erzaehler #pause
* [„Wer hat hier gewohnt? Vor uns?“]
* [„Wer hat das geschrieben?“]
- Ambrose sieht zum Fenster. Draußen ist der Ahorn schwarz geworden vor dem Himmel. #sprecher:erzaehler #pause:3
Jemand, der dieses Brett sechzig Jahre lang abgestaubt hat. Und nie einen Zug darauf gemacht. #sprecher:ambrose #stimmung:still #pause
Ich habe ihr nie danken können. Sie hat mich nicht gehört. #sprecher:ambrose #stimmung:still
Er sagt es leichthin. Aber er sieht dich nicht an dabei. #sprecher:erzaehler
Nimm das Brett mit, Kind. Wo es ist, bin ich. Weiter komme ich nicht. #sprecher:ambrose #pause
Ich habe es versucht. #sprecher:ambrose #stimmung:still
-> END

=== ambrose_rat ===
{
- not clubBeigetreten: Die Schule, Kind. Das Schachteam wartet, und ich werde nicht jünger. #sprecher:ambrose
- not (reiheSamBestanden and reiheJunoBestanden): Erst die Stellungen, die deine Mitspieler dir vorlegen. Wer das Rätsel scheut, scheut auch den Gegner. #sprecher:ambrose
- nadelMapleFalls == 0: Die Trainerin wartet. #sprecher:ambrose
- not kenntHale: Eine Nadel am Kragen. Zu meiner Zeit gab es dafür Wein, für dich gibt es Limonade. #sprecher:ambrose #stimmung:lacht
- endeAkt1Gesehen: Der Weg führt weiter, aber nicht heute. Ruh dich aus. #sprecher:ambrose
- else: Cedar Creek? Den Namen habe ich nie gehört. Ich war allerdings eine Weile verhindert. #sprecher:ambrose
}
+ [„Erzähl mir von früher.“]
    {~New Orleans hatte Kaffeehäuser, in denen man bis Mitternacht spielte. Bei Kerzenlicht.|Ich habe einmal gegen den Kapitän eines Dampfers gespielt. Er setzte sein Schiff. Ich lehnte ab.|Der junge Morphy war der Beste von uns allen. Ich habe ihn nie geschlagen. Nie.} #sprecher:ambrose
    -> END
+ [„Bis morgen.“]
    Geh nur. #sprecher:ambrose
    -> END

// ---------------------------------------------------------------- Die erste Nacht

// Szene akt1.ersteNacht (Roman, Kapitel 4; neu gegenüber der Story-Bibel), etwa drei Minuten.
// Stimmung: warm, Nähe, leiser Humor; dann die offene Partie als Frage des ganzen Spiels.
// Ort ist das Zimmer von {held} (mapleFalls.zimmer): Das Brett steht auf dem Schreibtisch unter dem
// Fenster (Roman, Kapitel 4); die Laterne kommt vom Dachboden.
// Klang (docs/spiel/21_Klangplan.md): keine Musik, nur Kühlschrank, Wasserfall, ein Auto; ganz am
// Schluss vier Töne von Ambroses Thema (#musik:ambrose auf der letzten Zeile).
=== erste_nacht ===
~ ersteNachtGesehen = true
~ setzeSzene("akt1.ersteNacht")
Nacht. Das Haus ist still, nur du nicht. Die Schatten stehen an den falschen Stellen. #sprecher:erzaehler #musik:aus #licht:nacht #geraeusch:kuehlschrank
Du hast die Laterne vom Dachboden geholt. Das Brett steht auf dem Schreibtisch unter deinem Fenster. #sprecher:erzaehler #klang:knarren
Unten summt der Kühlschrank. Von weit her rauscht der Wasserfall. #sprecher:erzaehler
* [„Bist du wach?“]
    Ich schlafe nicht. Das ist eine der Unannehmlichkeiten. #sprecher:ambrose
* [„Kannst du auch nicht schlafen?“]
    Ich schlafe überhaupt nicht. Das ist eine der Unannehmlichkeiten. #sprecher:ambrose
- Er steht am Fenster, kaum zu sehen, ein hellerer Fleck vor der Scheibe. #sprecher:erzaehler
Was ist das für ein Licht dort drüben? Es brennt ohne Flamme. #sprecher:ambrose
* [„Eine Straßenlaterne.“]
- Und das Summen? #sprecher:ambrose
* [„Der Kühlschrank.“]
- Aha. #sprecher:ambrose #pause
Er hat keine Ahnung, was ein Kühlschrank ist. Und er ist zu stolz, um zu fragen. #sprecher:erzaehler
* [Leise lachen]
    Lach nur. Ich bin seit hundertsechzig Jahren tot. Mir darf einiges entgangen sein. #sprecher:ambrose #stimmung:lacht
* [„Ein Kasten, der das Essen kalt hält.“]
    Ein Eiskeller in der Küche. Herrje. Ihr seid verwöhnt. #sprecher:ambrose #stimmung:lacht
- Hundertsechzig Jahre. Du versuchst, es dir vorzustellen, und kannst es nicht. #sprecher:erzaehler #klang:auto_nacht
Unter dem Fenster liegt die alte Stellung. Niemand hat sie angerührt. #sprecher:erzaehler
* [„Wer hat diese Partie gespielt?“]
* [„Warum darf niemand die Figuren anrühren?“]
- Lange kommt keine Antwort. Der Wasserfall rauscht. #sprecher:erzaehler #pause:3
Ich. Und einer, der mir noch einen Zug schuldet. #sprecher:ambrose #stimmung:still
* [„Und wer ist am Zug?“]
- Er. #sprecher:ambrose #stimmung:still #pause:3
Mehr sagt er nicht. Du fragst nicht weiter. #sprecher:erzaehler
Kurz bevor dir die Augen zufallen, denkst du: Mama hatte recht. Weiß steht besser. #sprecher:erzaehler
Du weißt nur nicht, woher du das weißt. #sprecher:erzaehler #musik:ambrose #geraeusch:aus
-> END

// ---------------------------------------------------------------- Abende auf dem Dachboden

// Roman, Kapitel 6 (neu): Die Lernwochen als Abende mit Ambrose, je etwa eine Minute, nach jeder
// bestandenen Aufgabenreihe. Stimmung: Lernen als Spiel, Tage, die ineinanderlaufen. Ambrose ist
// ein ungeduldiger Lehrer; er seufzt und geht am Fenster auf und ab. Klang: Lernthema als Schleife,
// Grillen durch das Fenster; beim Merksatz das Aha-Motiv (Klangplan).

=== abend_nach_sam ===
~ abendSamGesehen = true
Abend. Durch das runde Fenster zirpen Grillen. Ihr geht Sams Stellungen noch einmal durch. #sprecher:erzaehler #licht:abend #musik:mapleFalls.lernen
Ambrose geht am Fenster auf und ab. Bei jemandem, durch den man hindurchsehen kann, lenkt das sehr ab. #sprecher:erzaehler
Du zählst richtig. Aber du zählst wie ein Buchhalter. #sprecher:ambrose #stimmung:streng
Es geht nicht nur darum, wie viele. Es geht darum, wer zuerst schlägt und was er dabei aufs Spiel setzt. #sprecher:ambrose
Mit der Dame fängt man keinen Tausch an. Man schickt den Bauern vor. #sprecher:ambrose
* [„Warum?“]
    Weil der Bauer nichts zu verlieren hat. Das ist bei Menschen ebenso. #sprecher:ambrose
* [„Ein Buchhalter gewinnt auch.“]
    Gewiss. Aber er erzählt hinterher niemandem davon. #sprecher:ambrose #stimmung:lacht
    Der Bauer zuerst. Er hat am wenigsten zu verlieren. Das ist bei Menschen ebenso. #sprecher:ambrose
- -> END

=== abend_nach_juno ===
~ abendJunoGesehen = true
Abend. Junos Aufgaben liegen ausgebreitet auf dem Dachboden, in rosa Tinte. Neben guten Zügen klebt ein Stern. #sprecher:erzaehler #licht:abend #musik:mapleFalls.lernen
Es gibt wenige Sterne. Es stört sie nicht. #sprecher:erzaehler
Sie schreibt alles auf. Das ist mehr wert, als sie glaubt. Wer aufschreibt, kann zurückblättern. #sprecher:ambrose
* [„Und du? Hast du deine Partien aufgeschrieben?“]
    Jede. Auf Zettel, die nach Kaffee und Kerzenwachs rochen. Ich habe sie alle verloren. #sprecher:ambrose #stimmung:still
    Bis auf eine. Die steht hier unter dem Fenster. #sprecher:ambrose #stimmung:still
* [„Sie kann ihre eigene Schrift nicht lesen.“]
    Dann bist du ihre Brille. Auch eine Aufgabe. #sprecher:ambrose #stimmung:lacht
- -> END

=== abend_nach_dame ===
~ abendDameGesehen = true
Abend. Du denkst an Sam, den Kopf auf dem Tisch, und an seine gefangene Dame. #sprecher:erzaehler #licht:abend #musik:mapleFalls.lernen
Du hast es ihm erklärt, nicht ich. Wie hast du es gesagt? #sprecher:ambrose
* [„Die Dame läuft allein über einen leeren Platz.“]
    Und jeder kann auf sie zeigen. Während die anderen in Ruhe ihre Leute aufstellen. #sprecher:ambrose
* [„Ich hab erzählt, wie es mir ging.“]
    Vor zwei Wochen wusstest du es selbst nicht. Deshalb hat er dir zugehört. #sprecher:ambrose
- Er schweigt einen Moment. Dann klingt er beinahe verlegen. #sprecher:erzaehler
Das war gut. Besser, als ich es erklärt hätte. Ich hätte ihm von Morphy erzählt, und er wäre eingeschlafen. #sprecher:ambrose #stimmung:lacht
-> END

// ---------------------------------------------------------------- Fensterbank (T15)

// Roman, Kapitel 23 („Neu gegenüber“): Auf der Fensterbank im Zimmer des Helden stehen die Funde,
// der Springer aus Riverton zuerst. zeigeFensterbank öffnet die Ansicht aller Funde. Noch ohne
// Auslöser auf einer Karte: Ein Zimmer des Helden gibt es bisher nicht; der Hauptchat legt den
// Kartenpunkt fest (Einstieg maple-falls-dachboden.fensterbank).
=== fensterbank ===
Auf der Fensterbank steht, was du unterwegs gefunden hast. Das Zimmer erzählt die Reise. #sprecher:erzaehler
~ zeigeFensterbank()
-> END

// ================================================================ Epilog (Szene 109, Roman Kapitel 66)
// Ein Jahr später, im Herbst. Nach Abschied und Abspann reist der Held auf den Dachboden; das Brett
// startet den Epilog (Quest mapleFalls.epilog). Der Zettel von Ambrose liegt nur dort, wenn der
// Mentor-Zug im Halbfinale nicht gespielt und Ambrose nicht gerufen wurde (Extra-Abspann, R29).
// Danach Post-Game (Szene 110). Klang: mapleFalls.herbst, schlussklang.
=== epilog ===
~ epilogGesehen = true
Im Herbst werden die Ahornbäume an der Birch Lane wieder rot. Erst an den Rändern. Du hörst den Wasserfall noch immer. #sprecher:erzaehler #musik:mapleFalls.herbst
Auf Mrs. Calloways Veranda verliert sie jeden Nachmittag gegen einen Achtjährigen. In Raum zwölf bringt Carla den Neuen das Zählen bei. #sprecher:erzaehler
In einem Keller in Silicon Bay unterrichtet eine Frau acht Kinder bei einem Heizlüfter. #sprecher:erzaehler
Eines davon hatte früher zwei Titel und kommt jetzt jeden Tag. #sprecher:erzaehler
* [Auf den Dachboden gehen]
-
Das Brett steht auf dem Dachboden, auf dem niedrigen Tisch unter dem runden Fenster. Keine Decke darüber. Du staubst es ab. Oft. #sprecher:erzaehler
{not (mentorzugFreiGespielt or ambroseImHalbfinaleGerufen): -> epilog_zettel}
-> epilog_lily

=== epilog_zettel ===
Eine Figur steht anders als am Abend. Daneben liegt ein Zettel in alter, steiler Schrift. #sprecher:erzaehler #pause:2
„Du hast mich nicht gebraucht. Das ist das schönste Geschenk. – A. W.“ #sprecher:erzaehler #pause:3
* [Den Zettel einstecken]
- -> epilog_lily

=== epilog_lily ===
An einem Nachmittag im Oktober steht jemand auf der Treppe. Du hörst die neunte Stufe. #sprecher:erzaehler #klang:stufe
Mama sagt, du bist Meister. Mein Cousin sagt, Mädchen können nicht richtig spielen. Nur den Springer. #sprecher:lily
* [„Dein Cousin redet viel.“]
- Bringst du es mir bei? Richtig? #sprecher:lily
Du räumst die zwei Könige und den Springer ab, vorsichtig, und legst sie in den Geigenkasten. Dann stellst du alle zweiunddreißig auf. #sprecher:erzaehler
Der weiße König ist schwer, unten mit Blei ausgegossen, und das Kreuz auf seiner Krone ist ein bisschen schief. #sprecher:erzaehler
* [„Setz dich. Du hast Weiß.“]
- Lily klettert auf den Schaukelstuhl. Er knarrt. Sie sieht auf zweiunddreißig Dinge, von denen ihr keines etwas sagt. #sprecher:erzaehler
Und jetzt? #sprecher:lily
Durch das runde Fenster fällt das Licht. Der Staub hängt in der Luft wie etwas, das sich entschieden hat, nicht zu fallen. #sprecher:erzaehler
* [„Schau nicht auf alles. Stell eine Frage.“]
- Welche? #sprecher:lily
* [„Was hängt?“]
- Ende. #sprecher:erzaehler #musik:schlussklang #pause:4
~ setzeSzene("akt5.postGame")
-> END

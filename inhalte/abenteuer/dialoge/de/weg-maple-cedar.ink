// Route 1 von Maple Falls nach Cedar Creek: Karten „Landstraße“ und „Flussweg“ (Akt 1, W5 in
// docs/spiel/08_Wege_und_Entdeckungen.md).
//
// Stationen (W4): Rätseltafel am Ortsausgang (drei Mattaufgaben), Wanderer mit einer Weisheit aus
// Kapitel 1 bis 3, Straßengegnerin Nia (Jos Freundin, Blitz 3 + 2, Stellungsduell aus
// Abbildung 3.77), Fund „altes Partieformular“ (E4, wird später im Archiv von Cedar Creek
// entschlüsselt), Rastbank am Fluss, Ortsschild von Cedar Creek.
// Einstiege: „tafel“, „wanderer“, „gegnerin“, „fund_formular“, „rast“, „schild_cedar“.
//
// Kennungen: Die Schemas erlauben nur zwei Teile (ort.name); die Route heißt deshalb
// „wegMapleCedar“, die Begegnung „wegMapleCedar.nia“ (Variable ausgangWegMapleCedarNia, R42) und
// die Runde „wegMapleCedar.tafelLandstrasse“ (Variable tafelLandstrasseBestanden, eindeutig auch
// mit weiteren Routen). Beide setzt die Hülle (regeln/dialogvariablen.ts); „abgebrochen“ zählt wie
// nicht gespielt (R35). gibFund kommt mit Schritt 11.

EXTERNAL beginnePartie(begegnung)
EXTERNAL beginneAufgaben(runde)
EXTERNAL gibFund(kennung)

VAR held = "Du"
VAR tafelLandstrasseBestanden = false
VAR wandererBesuche = 0
VAR niaGetroffen = false
VAR ausgangWegMapleCedarNia = ""
VAR formularGefunden = false

// ---------------------------------------------------------------- Rätseltafel

=== tafel ===
{tafelLandstrasseBestanden:
    Auf der Tafel steht in Kreide: „Gelöst!“ Jemand hat einen Smiley daneben gemalt. #sprecher:erzaehler
    -> END
}
Am Ortsausgang hängt eine Holztafel mit drei Schachdiagrammen: „Matt in eins. Wer alle drei findet, kennt den Weg.“ #sprecher:erzaehler
* [Die Aufgaben lösen]
    // Die Runde fehlt noch in runden.json (Haupt-Chat, Schritt 10; Runden brauchen dort bisher
    // einen Ort mit Club). Sobald sie da ist, hier einkommentieren:
    ~ beginneAufgaben("wegMapleCedar.tafel")
    Du betrachtest die Diagramme eine Weile. Die Lösung musst du dir noch aufschreiben. #sprecher:erzaehler
    -> END
* [Weitergehen]
    -> END

// ---------------------------------------------------------------- Wanderer

=== wanderer ===
~ wandererBesuche = wandererBesuche + 1
{
- wandererBesuche == 1: -> wanderer_erstes
- wandererBesuche == 2: -> wanderer_zweites
- else: -> wanderer_drittes
}

=== wanderer_erstes ===
Ein Mann mit Rucksack und Wanderstock sitzt am Wegrand. Aus der Tasche schaut ein Taschenschach. #sprecher:erzaehler
Auch unterwegs nach Cedar Creek? Ich gehe die Strecke jede Woche, und jede Woche spiele ich eine Partie im Kopf. #sprecher:wanderer
Ein Rat für den Weg: Bring erst deine Figuren ins Spiel, dann greif an. Kapitel 1, Abschnitt 1.1, wenn du nachlesen willst. #sprecher:wanderer
Ein Mann, der im Gehen Schach spielt. Ich mag ihn. #sprecher:ambrose
-> END

=== wanderer_zweites ===
Wieder unterwegs? Dann noch ein Rat. #sprecher:wanderer
Schlag nicht vorschnell. Manchmal ist die Spannung die stärkere Waffe, steht in Abschnitt 1.5. #sprecher:wanderer
Er hat recht. Ich habe zu Lebzeiten zu oft zu früh geschlagen. #sprecher:ambrose
-> END

=== wanderer_drittes ===
{~Ein Gambit tauscht einen Bauern gegen Zeit, so steht es in Kapitel 3, Abschnitt 3.1. Wer die Zeit nicht nutzt, hat nur einen Bauern weniger.|Der Weg ist das halbe Spiel. Die andere Hälfte ist das Brett.|Ich gehe weiter. Viel Glück in Cedar Creek!} #sprecher:wanderer
-> END

// ---------------------------------------------------------------- Nia

=== gegnerin ===
{
- not niaGetroffen: -> nia_erstes_treffen
- ausgangWegMapleCedarNia == "" or ausgangWegMapleCedarNia == "abgebrochen": -> nia_angebot
- ausgangWegMapleCedarNia == "niederlage": -> nia_nach_niederlage
- else: -> nia_nach_sieg
}

=== nia_erstes_treffen ===
~ niaGetroffen = true
Ein Mädchen mit Skateboard unter dem Arm versperrt halb den Weg. Auf dem Board klebt ein Schachbrett. #sprecher:erzaehler
Du bist das Kind, das Jo im Park geschlagen hat? Oder das sie geschlagen hat? #sprecher:nia
Egal. Ich bin Nia. #sprecher:nia
-> nia_angebot

=== nia_angebot ===
Blitz, drei Minuten und zwei Sekunden dazu je Zug. Ich stell dir eine Stellung hin, du hast Weiß und bist besser. #sprecher:nia
Zehn Züge. Hältst du deinen Vorteil, darfst du vorbei. #sprecher:nia
Sonst trägst du mein Board bis Cedar Creek. #sprecher:nia
* [„Abgemacht.“]
    -> nia_duell
* [„Später.“]
    Ich bin schnell. Du nicht. Bis gleich. #sprecher:nia
    -> END

=== nia_duell ===
Sie greift an, bevor sie nachdenkt. Und sie zieht nie zurück, nicht einmal, wenn sie muss. #sprecher:ambrose
~ beginnePartie("wegMapleCedar.nia")
Nia stellt die Figuren auf ihr Board, so schnell, dass du kaum hinsiehst. #sprecher:erzaehler
-> END

=== nia_nach_sieg ===
Okay, okay. Du bist schneller, als du aussiehst. Noch mal? #sprecher:nia
Gut. Du hast gewartet, bis sie sich selbst verrannt hat. #sprecher:ambrose
+ [„Noch eine.“]
    -> nia_duell
+ [„Ich muss weiter.“]
    Sag Jo, ich hab extra langsam gespielt. Stimmt nicht, aber sag es ihr. #sprecher:nia
    -> END

=== nia_nach_niederlage ===
Board tragen! War nur Spaß. Noch eine Runde? #sprecher:nia
Bei drei Minuten denkt man nicht, man sieht. Das kommt mit der Übung. #sprecher:ambrose
+ [„Revanche.“]
    -> nia_duell
+ [„Später.“]
    -> END

// ---------------------------------------------------------------- Fund

=== fund_formular ===
{formularGefunden:
    Hier im Gras lag das alte Formular. Jetzt ist hier nur noch Gras. #sprecher:erzaehler
    -> END
}
~ formularGefunden = true
Im Gras unter einem Busch steckt ein vergilbtes Blatt in einer Blechdose. #sprecher:erzaehler
Ein Partieformular, eng beschrieben, die Tinte verblasst. #sprecher:erzaehler
~ gibFund("formular1857")
Diese Handschrift. Ich kenne sie, aber ich kann sie nicht mehr lesen. #sprecher:ambrose #stimmung:traurig
Heb es gut auf, {held}. #sprecher:ambrose
-> END

// ---------------------------------------------------------------- Rast und Schild

=== rast ===
Eine Bank am Fluss, das Wasser glitzert. Du setzt dich kurz. #sprecher:erzaehler
Zu meiner Zeit ging man oft zu Fuß von Stadt zu Stadt, das Brett im Gepäck. #sprecher:ambrose
Ein Tag Weg für eine gute Partie war nicht zu viel. Man hatte unterwegs Zeit, die Züge im Kopf zu sortieren. #sprecher:ambrose
-> END

=== schild_cedar ===
Ein Holzschild: „Cedar Creek. Langsam fahren, hier spielen Kinder Schach.“ #sprecher:erzaehler
Eine Stadt, die vor Schach warnt. Wir sind am richtigen Ort. #sprecher:ambrose #stimmung:lacht
-> END

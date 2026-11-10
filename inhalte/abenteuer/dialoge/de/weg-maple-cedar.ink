// Route 1 von Maple Falls nach Cedar Creek: Karten „Landstraße“ und „Flussweg“ (Akt 1, W5 in
// docs/spiel/08_Wege_und_Entdeckungen.md).
//
// Stationen (W4): Rätseltafel am Ortsausgang (drei Mattaufgaben), Wanderer mit einer Weisheit aus
// Kapitel 1 bis 3, Straßengegnerin Nia (Jos Freundin, Blitz 3 + 2, Stellungsduell aus
// Abbildung 3.77), Fund „altes Partieformular“ (E4, wird später im Archiv von Cedar Creek
// entschlüsselt), Rastbank am Fluss, Ortsschild von Cedar Creek.
// Einstiege: „tafel“, „wanderer“, „gegnerin“, „fund_formular“, „fund_muenzen“, „rast“,
// „schild_cedar“.
//
// Kennungen (zweiteilig, wie die Schemas verlangen): Begegnung „wegMapleCedar.nia“ (Variable
// ausgangWegMapleCedarNia, R42), Runde „wegMapleCedar.tafel“ (runden.json, Variable in der
// Langform wegMapleCedarTafelBestanden, damit sie nicht mit anderen Tafeln kollidiert). Beide setzt die Hülle (regeln/dialogvariablen.ts); „abgebrochen“ zählt wie
// nicht gespielt (R35). gibFund kommt mit Schritt 11. Auslöser wie in orte.json: tafel,
// fundFormular, rast, fundMuenzen, schildCedar; Figuren wanderer und gegnerin.

EXTERNAL beginnePartie(begegnung)
EXTERNAL beginneAufgaben(runde)
EXTERNAL gibFund(kennung)

VAR buchseiten = 0
VAR finchFiguren = 0
VAR held = "Du"
VAR wegMapleCedarTafelBestanden = false
VAR wandererBesuche = 0
VAR niaGetroffen = false
VAR ausgangWegMapleCedarNia = ""
VAR formularGefunden = false
VAR muenzenGefunden = false
VAR nadelMapleFalls = 0
VAR nadelCedarCreek = 0
VAR wegMapleCedarFinchFallenBestanden = false
VAR odetteGetroffen = false
VAR flohmarktKarteErhalten = false
VAR seite00Gefunden = false
VAR finchBauerAGefunden = false
VAR gatterOffenGesehen = false

// ---------------------------------------------------------------- Rätseltafel

=== tafel ===
{wegMapleCedarTafelBestanden:
    Auf der Tafel steht in Kreide: „Gelöst!“ Jemand hat einen Smiley daneben gemalt. #sprecher:erzaehler
    -> END
}
Am Ortsausgang hängt eine Holztafel mit drei Schachdiagrammen: „Matt in eins. Wer alle drei findet, kennt den Weg.“ #sprecher:erzaehler
* [Die Aufgaben lösen]
    ~ beginneAufgaben("wegMapleCedar.tafel")
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
Ein Rat für den Weg: Bring erst deine Figuren ins Spiel, dann greif an. Wer mit zwei Figuren stürmt, stürmt allein. #sprecher:wanderer
Ein Mann, der im Gehen Schach spielt. Ich mag ihn. #sprecher:ambrose
-> END

=== wanderer_zweites ===
Wieder unterwegs? Dann noch ein Rat. #sprecher:wanderer
Schlag nicht vorschnell. Manchmal ist die Spannung die stärkere Waffe. #sprecher:wanderer
Er hat recht. Ich habe zu Lebzeiten zu oft zu früh geschlagen. #sprecher:ambrose
-> END

=== wanderer_drittes ===
{~Ein Gambit tauscht einen Bauern gegen Zeit. Wer die Zeit nicht nutzt, hat nur einen Bauern weniger.|Der Weg ist das halbe Spiel. Die andere Hälfte ist das Brett.|Ich gehe weiter. Viel Glück in Cedar Creek!} #sprecher:wanderer
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

=== fund_muenzen ===
{muenzenGefunden:
    Die alte Kiste am Flussufer ist leer. #sprecher:erzaehler
    -> END
}
~ muenzenGefunden = true
Zwischen zwei Steinen am Ufer klemmt eine kleine Holzkiste. Darin klimpern Münzen. #sprecher:erzaehler
~ gibFund("muenzenFlussweg")
Ein Schatz am Wegrand. Zu meiner Zeit hätte man dafür ein Abendessen bekommen, mit Nachtisch. #sprecher:ambrose #stimmung:lacht
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

// ---------------------------------------------------------------- Runde 6: Gatter S1 (Kürbishof)

// Läuft vor dem Übergang „kuerbishof“ (wenn: wegMapleCedarTafelBestanden). Walt Miller lässt nur
// herein, wer die Tafel am Ortsausgang gelöst hat (13_Wegenetz.md, S1).
=== gatter_s1 ===
{wegMapleCedarTafelBestanden:
    {gatterOffenGesehen:
        -> END
    }
    ~ gatterOffenGesehen = true
    Das Gatter steht einen Spalt offen. Dahinter winkt ein Mann mit Strohhut. #sprecher:erzaehler
    „Du hast die Tafel am Ortsausgang gelöst? Dann komm. Die Kühe suche ich später mit dir.“ #sprecher:erzaehler
    -> END
- else:
    Das Gatter ist zu. Am Pfosten hängt ein Zettel: „Kühe ausgebüxt. Rein darf nur, wer denken kann. Die Tafel am Ortsausgang zeigt es. W. Miller.“ #sprecher:erzaehler
    -> END
}

// ---------------------------------------------------------------- Runde 6: Flohmarkt (15, 2.1)

// Odette Finch, Problemkomponistin mit dem Wohnmobil „Gambit“. Erst nach der ersten Clubnadel
// (Samstag). Drei Finch-Fallen (Runde wegMapleCedar.finchFallen, Matt in eins), Lohn: die Karte
// der Finch-Jagd und ein Problemheft.
=== ereignis_flohmarkt ===
{nadelMapleFalls < 1:
    Das Wohnmobil „Gambit“ parkt in der Einfahrt, die Tür ist zu. Auf den Tischen liegen Decken über den Kisten. #sprecher:erzaehler
    Am Aufsteller steht: „Flohmarkt am Samstag.“ #sprecher:erzaehler
    -> END
}
{flohmarktKarteErhalten: -> flohmarkt_spaeter}
{wegMapleCedarFinchFallenBestanden: -> flohmarkt_karte}
{odetteGetroffen: -> flohmarkt_angebot}
~ odetteGetroffen = true
Auf den Tischen liegen Lampen, Kisten und ein Fahrrad ohne Kette. Vor dem Wohnmobil sitzt eine alte Dame auf einem Klappstuhl und lacht. #sprecher:erzaehler
„Odette Finch. Problemhefte, fünfzig Cent das Stück. Aber erst stelle ich dir eine Falle.“ #sprecher:erzaehler
-> flohmarkt_angebot

=== flohmarkt_angebot ===
„Matt in einem Zug. Sieht aus wie Patt, ist es aber nicht. Drei Stück hab ich, eine gemeiner als die andere.“ #sprecher:erzaehler
Solche Aufgaben standen zu meiner Zeit in den Zeitungen. Schön und gemein. #sprecher:ambrose
* [Die Fallen lösen]
    ~ beginneAufgaben("wegMapleCedar.finchFallen")
    -> END
* [Später]
    „Ich bin den ganzen Samstag hier. Die Fallen laufen nicht weg.“ #sprecher:erzaehler
    -> END

=== flohmarkt_karte ===
~ flohmarktKarteErhalten = true
Odette klatscht in die Hände. „Alle drei! Dann bist du genau richtig für meine letzte große Aufgabe.“ #sprecher:erzaehler
Sie gibt dir eine Karte mit sechzehn leeren Kästchen. „Sechzehn weiße Figuren aus Buchsbaum, versteckt an den Wegen. Unter jeder steht ihr Feld.“ #sprecher:erzaehler
~ gibFund("finchKarte")
„Wo eine liegt, hab ich einen Finken hingemalt. Und das Heft hier nimmst du auch mit, drei Aufgaben für unterwegs.“ #sprecher:erzaehler
~ gibFund("problemheft")
Sechzehn Figuren. Das wird ein langer Spaziergang, {held}. Ein schöner. #sprecher:ambrose #stimmung:lacht
-> END

=== flohmarkt_spaeter ===
„Hast du schon einen Finken gesehen? Die Figuren liegen nie ohne Zeichen.“ #sprecher:erzaehler
Odette packt eine Lampe in Zeitungspapier. „Am Leuchtturm bei Capital sehen wir uns wieder. Dort stelle ich Schwarz auf.“ #sprecher:erzaehler
-> END

// ---------------------------------------------------------------- Runde 6: Sammelstellen

=== seite00 ===
{seite00Gefunden:
    Im Graben liegt nur noch Laub. #sprecher:erzaehler
    -> END
}
~ seite00Gefunden = true
Im Graben neben dem Hof steckt ein Blatt Papier, feucht vom Tau. #sprecher:erzaehler
Eine lose Seite voller Schachdiagramme. #sprecher:erzaehler
~ gibFund("seite00")
~ buchseiten = buchseiten + 1
Eine Seite aus einem Buch, das es zu meiner Zeit noch nicht gab. Heb sie auf. #sprecher:ambrose
-> END

=== finch_bauer_a ===
{finchBauerAGefunden:
    Unter der Bank ist nichts mehr, nur das Blechschild mit dem Finken am Pfosten. #sprecher:erzaehler
    -> END
}
~ finchBauerAGefunden = true
Am Pfosten neben der Bank hängt ein Blechschild mit einem Finken. Unter der Bank klemmt etwas. #sprecher:erzaehler
Ein weißer Bauer aus hellem Holz. Unter dem Fuß ist ein Feld eingebrannt. #sprecher:erzaehler
~ gibFund("finchBauerA")
~ finchFiguren = finchFiguren + 1
-> END

// ---------------------------------------------------------------- Runde 6: Stamm auf dem Zedernpfad (S2)

// Vor dem Übergang „zedernZurueckPark“ (wenn: nadelCedarCreek). Mr. Dunmore räumt den Stamm nach
// der Clubnadel von Cedar Creek.
=== stamm_s2 ===
{nadelCedarCreek >= 1:
    -> END
- else:
    Eine Zeder liegt quer über dem Pfad, der Sturm hat sie umgeworfen. Darüber kommst du nicht. #sprecher:erzaehler
    Hinter dem Stamm sieht man schon den Park von Maple Falls. #sprecher:erzaehler
    -> END
}

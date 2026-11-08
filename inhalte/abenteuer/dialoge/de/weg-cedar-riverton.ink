// Route 2 von Cedar Creek nach Riverton: Karten „Zedernwald“ und „Bahndamm“ (Akt 2, Szene 27 der
// Story-Bibel, Abschnitt 10.1).
//
// Stationen (W4): Wanderin Mrs. Fenwick mit einer Weisheit (Kapitel 1, Abschnitt 1.4),
// Rätseltafel am Wegweiser (Runde wegCedarRiverton.tafel, Quest wegCedarRiverton.tafelWegweiser),
// Zugschaffner Mr. Quinn als Straßengegner mit Uhr (Begegnung wegCedarRiverton.schaffner; Juno
// spielt zuerst und verliert), Funde Pfeilspitze, Springer aus Holz, Fahrkarte von 1958.
// Einstiege wie in orte.json: fenwick, schaffner, tafel, fund_pfeilspitze, fund_holzspringer,
// fund_fahrkarte. Den Aufbruch erzählt der Übergang am Steg (cedar-creek-aussen.zedernwald), die
// Ankunft der Übergang nach Riverton (riverton-aussen.ankunft_zu_fuss).
//
// Variablen: ausgangWegCedarRivertonSchaffner setzt die Hülle (regeln/dialogvariablen.ts),
// „abgebrochen“ zählt wie nicht gespielt (R35). Die Tafel fragt die Langform
// wegCedarRivertonTafelBestanden ab (eindeutig je Route). Funde merkt sich Ink selbst.

EXTERNAL beginnePartie(begegnung)
EXTERNAL beginneAufgaben(runde)
EXTERNAL gibFund(kennung)

VAR wegCedarRivertonTafelBestanden = false
VAR fenwickGetroffen = false
VAR quinnGetroffen = false
VAR ausgangWegCedarRivertonSchaffner = ""
VAR pfeilspitzeGefunden = false
VAR holzspringerGefunden = false
VAR fahrkarte1958Gefunden = false

// ---------------------------------------------------------------- Mrs. Fenwick

=== fenwick ===
{fenwickGetroffen:
    {~Immer noch unterwegs? Der Wald hat Zeit. Du auch.|Zähl zuerst, wer verteidigt. Dann greif an. Mehr weiß ich auch nicht.|Grüß Riverton von mir. Und den Fluss.} #sprecher:fenwick
    -> END
}
~ fenwickGetroffen = true
Am Wegweiser rastet eine Frau mit Rucksack und Wanderstock. Ihre Stiefel sind voller Moos. #sprecher:erzaehler
Nach Riverton? Dann ein Rat für unterwegs. #sprecher:fenwick
Wer angreift, soll zuerst zählen, wer verteidigt. So steht es in Kapitel 1, Abschnitt 1.4. #sprecher:fenwick
Eine Dame, die Bücher im Kopf trägt und Moos an den Stiefeln. Sie gefällt mir. #sprecher:ambrose
-> END

// ---------------------------------------------------------------- Rätseltafel

=== tafel ===
{wegCedarRivertonTafelBestanden:
    Auf der Tafel am Wegweiser steht in Kreide: „Gelöst! Gute Reise.“ #sprecher:erzaehler
    -> END
}
Am Wegweiser „Riverton, 3 Meilen“ hängt eine Holztafel mit drei Diagrammen: „Ein Zug, zwei Angriffe. Findest du sie?“ #sprecher:erzaehler
Doppelangriffe. Ein Zug, der zwei Briefe auf einmal zustellt. #sprecher:ambrose
* [Die Aufgaben lösen]
    ~ beginneAufgaben("wegCedarRiverton.tafel")
    -> END
* [Weitergehen]
    -> END

// ---------------------------------------------------------------- Mr. Quinn, der Schaffner

=== schaffner ===
{
- not quinnGetroffen: -> quinn_erstes_treffen
- ausgangWegCedarRivertonSchaffner == "" or ausgangWegCedarRivertonSchaffner == "abgebrochen": -> quinn_angebot
- ausgangWegCedarRivertonSchaffner == "niederlage": -> quinn_nach_niederlage
- else: -> quinn_nach_sieg
}

=== quinn_erstes_treffen ===
~ quinnGetroffen = true
Am Bahndamm sitzt ein Mann in Schaffneruniform auf einem Schwellenstapel. Vor ihm ein Brett und eine Schachuhr. #sprecher:erzaehler
Quinn, Schaffner. Ich habe zwölf Minuten Pause, und keine Minute davon verschwende ich. #sprecher:schaffner
Juno setzt sich sofort hin. „Ich zuerst!“ #sprecher:erzaehler
Drei Minuten später ist ihr König matt. #sprecher:erzaehler #pause
Ich hab die Zeit gewonnen. Er hatte mehr übrig. #sprecher:juno #stimmung:froh
-> quinn_angebot

=== quinn_angebot ===
Jetzt du. Drei Minuten und zwei Sekunden dazu je Zug, eine Stellung mit Vorteil für Weiß. #sprecher:schaffner
Zehn Züge, dann fährt mein Zug. #sprecher:schaffner
* [„Abgemacht.“]
    Er spielt wie ein Fahrplan: genau, pünktlich, ohne Umwege. Lass dich nicht hetzen. #sprecher:ambrose
    ~ beginnePartie("wegCedarRiverton.schaffner")
    -> END
* [„Später.“]
    Der nächste Zug kommt in einer Stunde. Ich auch. #sprecher:schaffner
    -> END

=== quinn_nach_sieg ===
Pünktlich gewonnen. Das sehe ich gern. Noch eine, bevor die Pause um ist? #sprecher:schaffner
Du hast die Uhr behandelt wie eine Figur. Gut. #sprecher:ambrose
+ [„Noch eine.“]
    ~ beginnePartie("wegCedarRiverton.schaffner")
    -> END
+ [„Wir müssen weiter.“]
    Gute Fahrt nach Riverton. Zu Fuß ist auch eine Fahrt. #sprecher:schaffner
    -> END

=== quinn_nach_niederlage ===
Verspätung. Das passiert den Besten. Noch einmal? #sprecher:schaffner
Mit Uhr sieht man weniger als ohne. Das ist der Preis der Eile. #sprecher:ambrose
+ [„Revanche.“]
    ~ beginnePartie("wegCedarRiverton.schaffner")
    -> END
+ [„Später.“]
    -> END

// ---------------------------------------------------------------- Funde

=== fund_pfeilspitze ===
{pfeilspitzeGefunden:
    Unter dem Farn am Bach ist jetzt nur noch Erde. #sprecher:erzaehler
    -> END
}
~ pfeilspitzeGefunden = true
Unter einem Farn am Bach glänzt etwas: eine Pfeilspitze aus Stein, scharf wie am ersten Tag. #sprecher:erzaehler
~ gibFund("pfeilspitze")
Wer hier jagte, kannte den Wald besser als jede Karte. #sprecher:ambrose
-> END

=== fund_holzspringer ===
{holzspringerGefunden:
    Der hohle Baumstamm ist leer. Nur ein Käfer wohnt noch darin. #sprecher:erzaehler
    -> END
}
~ holzspringerGefunden = true
In einem hohlen Baumstamm liegt ein Springer aus hellem Holz, glatt gegriffen. #sprecher:erzaehler
~ gibFund("holzspringer")
Ein Springer, allein im Wald. Er hüpft wohl noch. #sprecher:ambrose #stimmung:lacht
-> END

=== fund_fahrkarte ===
{fahrkarte1958Gefunden:
    Im Schotter am Bahndamm liegen nur Steine. #sprecher:erzaehler
    -> END
}
~ fahrkarte1958Gefunden = true
Im Schotter steckt eine vergilbte Pappkarte: „Riverton, einfache Fahrt, 1958“. #sprecher:erzaehler
~ gibFund("fahrkarte1958")
Einfache Fahrt. Wer fuhr damals, und kam er an? #sprecher:ambrose
-> END

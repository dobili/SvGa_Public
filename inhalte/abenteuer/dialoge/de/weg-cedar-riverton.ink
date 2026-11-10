// Route 2 von Cedar Creek nach Riverton: Karten „Zedernwald“ und „Bahndamm“ (Akt 2, Szene 27 der
// Story-Bibel, Abschnitt 10.1).
//
// Stationen (W4): Wanderin Mrs. Fenwick mit einer Weisheit (Kapitel 1, Abschnitt 1.4),
// Rätseltafel am Wegweiser (Runde wegCedarRiverton.tafel, Quest wegCedarRiverton.tafelWegweiser),
// Zugschaffner Mr. Quinn als Straßengegner mit Uhr (Begegnung wegCedarRiverton.schaffner; Juno
// spielt zuerst und verliert; beim ersten Sieg die Karte kuehlerKopf), Funde Pfeilspitze, Springer aus Holz, Fahrkarte von 1958.
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
EXTERNAL gibKarte(kennung)

VAR buchseiten = 0
VAR finchFiguren = 0
VAR wegCedarRivertonTafelBestanden = false
VAR fenwickGetroffen = false
VAR quinnGetroffen = false
VAR quinnKarteGegeben = false
VAR ausgangWegCedarRivertonSchaffner = ""
VAR pfeilspitzeGefunden = false
VAR holzspringerGefunden = false
VAR fahrkarte1958Gefunden = false
VAR held = "Du"
VAR hatLaterne = false
VAR wegCedarRivertonZugpartieBestanden = false
VAR rosalindGetroffen = false
VAR zugpartieErledigt = false
VAR seite01Gefunden = false
VAR thermoskanneGefunden = false

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
{not quinnKarteGegeben:
    ~ quinnKarteGegeben = true
    Bevor ich es vergesse, ein Rat von der Strecke: Wenn alle drängeln, atme einmal durch. #sprecher:schaffner
    ~ gibKarte("kuehlerKopf")
    Ein kühler Kopf ist mehr wert als zwei Minuten. Aber zwei Minuten sind auch nicht schlecht. #sprecher:ambrose
}
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
Unter dem Fuß ist ein Feld eingebrannt, daneben ein winziger Fink. #sprecher:erzaehler
~ gibFund("finchSpringerA")
~ finchFiguren = finchFiguren + 1
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

// ---------------------------------------------------------------- Runde 6: Zugpartie am Stellwerk (15, 2.2)

// Rosalind Kettering spielt seit 23 Jahren eine Partie mit Lokführer Earl Dubois, ein Zug pro
// Vorbeifahrt. Heute hat sie sich die Hand verstaucht. {held} findet, warum ihr erster Einfall
// eine Figur einstellt (Kapitel 1, was hängt?), und hängt einen besseren Zug ans Signal.
=== ereignis_zugpartie ===
{zugpartieErledigt: -> zugpartie_danach}
{wegCedarRivertonZugpartieBestanden: -> zugpartie_geloest}
{rosalindGetroffen: -> zugpartie_angebot}
~ rosalindGetroffen = true
Vor dem Stellwerk sitzt eine ältere Frau auf der Bank, die rechte Hand im Verband. #sprecher:erzaehler
„Rosalind Kettering. Ich spiele seit dreiundzwanzig Jahren eine Partie mit Earl, dem Lokführer vom Güterzug. Ein Zug pro Vorbeifahrt.“ #sprecher:erzaehler
-> zugpartie_angebot

=== zugpartie_angebot ===
„Er hält seinen Zug auf einer Tafel aus dem Fenster, ich hänge meine Antwort ans Signal. Heute krieg ich die Tafel nicht hoch, und der Zug kommt gleich.“ #sprecher:erzaehler
„Mein erster Einfall ist der Läufer nach vorn. Schaust du drauf, bevor wir ihn aufhängen?“ #sprecher:erzaehler
* [Die Stellung ansehen]
    ~ beginneAufgaben("wegCedarRiverton.zugpartie")
    -> END
* [Gleich]
    „Viel Zeit ist nicht. Hörst du die Schienen schon?“ #sprecher:erzaehler
    -> END

=== zugpartie_geloest ===
~ zugpartieErledigt = true
Rosalind sieht auf das Brett. „Der Läufer hätte gehangen. Und Earl sieht so etwas sofort.“ #sprecher:erzaehler
Du hängst den besseren Zug ans Signal. Der Güterzug rattert vorbei, aus dem Führerhaus winkt eine Hand mit einer Tafel. #sprecher:erzaehler
„Hier, die alte Signalkelle aus dem Stellwerk. Die brauch ich nicht mehr, seit es Strom gibt.“ #sprecher:erzaehler
~ gibFund("signalkelle")
Sie warten aufeinander. Und es macht sie nicht unglücklich. #sprecher:ambrose
-> END

=== zugpartie_danach ===
„Earl hat geantwortet. Er sagt, das war nicht mein Zug. Er kennt mich zu gut.“ #sprecher:erzaehler
-> END

// ---------------------------------------------------------------- Runde 6: Buchseite und Durchlass S14

=== seite01 ===
{seite01Gefunden:
    Im Schotter neben dem Bahnsteig liegen nur Steine. #sprecher:erzaehler
    -> END
}
~ seite01Gefunden = true
Zwischen den Schottersteinen neben dem Bahnsteig flattert ein Blatt Papier. #sprecher:erzaehler
Eine Seite aus einem Handbuch, Kapitel 1: „Grundprinzipien des Schachs“. #sprecher:erzaehler
~ gibFund("seite01")
~ buchseiten = buchseiten + 1
-> END

// Durchlass unter dem Damm (13_Wegenetz.md, S14): stockdunkel, nur mit der Laterne aus Ironwood.
=== durchlass ===
{not hatLaterne:
    Ein gemauerter Durchlass unter dem Damm, dahinter stockdunkel. Es tropft. #sprecher:erzaehler
    Gwen hat gesagt, da wohne was. Ohne Licht gehst du da nicht hinein. #sprecher:erzaehler
    -> END
}
{thermoskanneGefunden:
    Im Licht der Laterne glänzt nasses Mauerwerk. Sonst ist hier nichts mehr. #sprecher:erzaehler
    -> END
}
~ thermoskanneGefunden = true
Die Laterne leuchtet in den Durchlass. Eine Kröte hüpft davon, das war wohl das, was hier wohnt. #sprecher:erzaehler
Auf einem Mauervorsprung steht eine verbeulte Thermoskanne mit Namen: „G. Tolliver“. #sprecher:erzaehler
~ gibFund("thermoskanneGwen")
-> END

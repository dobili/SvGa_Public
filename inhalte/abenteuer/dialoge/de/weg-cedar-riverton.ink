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
// Runde 11 (13.11.2026): an den Roman angeglichen (roman/akt2_teil1.md, Kapitel 17): die Wanderin
// am Wegweiser („Bis er angreift“), der Güterzug und Ambroses „Elf Tage, und ich bin nicht
// angekommen“, Mr. Quinns Pause mit Uhr, die Herkunft der Karte „Kühler Kopf“ (ein alter Herr mit
// Thermoskanne) und der graue Himmel über Riverton. Am Bahndamm ist keine Musik (21_Klangplan.md, S28).
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
VAR gueterzugGesehen = false

// ---------------------------------------------------------------- Mrs. Fenwick

=== fenwick ===
{fenwickGetroffen:
    {~Immer den Gleisen nach. Der Wald hat Zeit. Du auch.|Zähl zuerst, wer verteidigt. Dann greif an.|Grüß Riverton von mir. Und nehmt einen Schirm mit.} #sprecher:fenwick
    -> END
}
~ fenwickGetroffen = true
An einem Wegweiser steht eine Frau mit Rucksack und Stock und isst einen Apfel. #sprecher:erzaehler
Riverton? Immer den Gleisen nach. Und merkt euch eins, wenn ihr dort spielen wollt. #sprecher:fenwick
Sie zeigt mit dem Apfel auf euch. #sprecher:erzaehler
Wer angreift, soll zuerst zählen, wer verteidigt. #sprecher:fenwick
Das wissen wir. #sprecher:juno
Das weiß jeder. Bis er angreift. #sprecher:fenwick
-> END

// ---------------------------------------------------------------- Rätseltafel

=== tafel ===
{wegCedarRivertonTafelBestanden:
    Auf der Tafel am Wegweiser steht in Kreide: „Gelöst! Gute Reise.“ #sprecher:erzaehler
    -> END
}
Am Wegweiser „Riverton, 3 Meilen“ hängt eine Holztafel mit drei Diagrammen: „Ein Zug, zwei Angriffe. Findest du sie?“ #sprecher:erzaehler
Doppelangriffe. Ein Zug, zwei Ziele. #sprecher:ambrose
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
{not gueterzugGesehen: -> gueterzug ->}
An einer Bude neben den Gleisen sitzt ein Mann in Uniform. Auf einer Kiste ein Brett und eine Uhr mit zwei Zifferblättern. #sprecher:erzaehler
Pause. Zwanzig Minuten, dann kommt der Elfuhrsieben. Wer will? #sprecher:schaffner
Ich! #sprecher:juno #stimmung:froh
Juno spielt, als würde das Haus brennen. Sie verliert einen Läufer, einen Turm, und wirft vor Lachen den König selbst um. #sprecher:erzaehler
Ich hab die Zeit gewonnen. Er hatte mehr übrig. #sprecher:juno #stimmung:froh
-> quinn_angebot

// Kapitel 17: Der Güterzug, lange bevor man ihn sieht; Ambroses erste Andeutung von 1866.
=== gueterzug ===
~ gueterzugGesehen = true
Erst singt die Schiene. Dann zittert der Boden. Dann rattert ein Güterzug vorbei, vierzig Wagen. Du zählst sie. #sprecher:erzaehler #klang:gueterzug
So schnell. #sprecher:ambrose #pause:2
Er klingt nicht beeindruckt. Er klingt müde. #sprecher:erzaehler
Ich habe elf Tage gebraucht. Von New Orleans bis … nun. Elf Tage, und ich bin nicht angekommen. #sprecher:ambrose #stimmung:traurig
* [Warten, ob er weiterspricht]
* [„Wohin?“]
- ->->

=== quinn_angebot ===
Jetzt du. Drei Minuten, und zwei Sekunden für jeden Zug dazu. #sprecher:schaffner
* [„Abgemacht.“]
    Ruhig. Die Uhr ist auch eine Figur. Sie gehört zum Spiel. Aber sie ist nicht der König. #sprecher:ambrose
    ~ beginnePartie("wegCedarRiverton.schaffner")
    -> END
* [„Nicht jetzt.“]
    Der nächste Zug kommt in einer Stunde. Ich auch. #sprecher:schaffner
    -> END

=== quinn_nach_sieg ===
{not quinnKarteGegeben: -> quinn_karte}
Pünktlich gewonnen. Das sehe ich gern. Noch eine, bevor die Pause um ist? #sprecher:schaffner
+ [„Noch eine.“]
    ~ beginnePartie("wegCedarRiverton.schaffner")
    -> END
+ [„Wir müssen weiter.“]
    Gute Fahrt nach Riverton. Zu Fuß ist auch eine Fahrt. #sprecher:schaffner
    -> END

// Kapitel 17: Die Karte hat eine Herkunft; danach der graue Himmel über den drei Brücken.
=== quinn_karte ===
~ quinnKarteGegeben = true
Er gibt dir die Hand. #sprecher:erzaehler
Quinn. Seit neunzehn Jahren auf der Strecke. #sprecher:schaffner
Aus der Brusttasche zieht er eine Karte: ein Kopf, über dem eine kleine Wolke hängt. #sprecher:erzaehler
~ gibKarte("kuehlerKopf")
Die hat mir mal einer dagelassen. Alter Herr mit einer Thermoskanne. Ich hab nie verstanden, wofür sie gut ist. #sprecher:schaffner
Die Schrift auf der Rückseite ist steil und altmodisch. #sprecher:erzaehler
* [Die Karte umdrehen]
* [Einstecken]
- In der Ferne stehen drei Brücken über einem breiten Fluss. Der Himmel darüber hängt grau und schwer. #sprecher:erzaehler #klang:donner_fern
Riverton. Nehmt einen Schirm. #sprecher:schaffner
Ihr habt keinen. #sprecher:erzaehler
-> END

=== quinn_nach_niederlage ===
Verspätung. Das passiert den Besten. Noch einmal? #sprecher:schaffner
Lass dich nicht hetzen. #sprecher:ambrose
+ [„Revanche.“]
    ~ beginnePartie("wegCedarRiverton.schaffner")
    -> END
+ [„Nicht jetzt.“]
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

// Rosalind Marsh spielt seit 23 Jahren eine Partie mit Lokführer Earl Dubois, ein Zug pro
// Vorbeifahrt. Heute hat sie sich die Hand verstaucht. {held} findet, warum ihr erster Einfall
// eine Figur einstellt (Kapitel 1, was hängt?), und hängt einen besseren Zug ans Signal.
=== ereignis_zugpartie ===
{zugpartieErledigt: -> zugpartie_danach}
{wegCedarRivertonZugpartieBestanden: -> zugpartie_geloest}
{rosalindGetroffen: -> zugpartie_angebot}
~ rosalindGetroffen = true
Vor dem Stellwerk sitzt eine ältere Frau auf der Bank, die rechte Hand im Verband. #sprecher:erzaehler
„Rosalind Marsh. Ich spiele seit dreiundzwanzig Jahren eine Partie mit Earl, dem Lokführer vom Güterzug. Ein Zug pro Vorbeifahrt.“ #sprecher:erzaehler
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
// Kein Buchverweis (Entscheidung vom 10.11.2026): ein loses Blatt mit einer Stellung.
Ein loses Blatt mit einer gezeichneten Stellung. Darunter steht mit Bleistift: „Schwarz zieht und gewinnt.“ #sprecher:erzaehler
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

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
// Runde 11 (13.11.2026): Teil B2 der Dialogprüfung (docs/spiel/22_Dialogpruefung.md, VC1 bis
// VC25) und der Roman zu Akt 1 (roman/akt1_teil3.md, Kapitel 10) eingearbeitet. Maßstab ist der
// Roman: Auf der Landstraße schweigt Ambrose; sein erster Satz fällt am Stein der Fährstelle
// (Knoten „rast“). „Später“ fällt in Akt 1 nur dreimal (erster Tag, Archiv, Steg); hier heißen
// die Wahlen „Nicht jetzt.“.
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
VAR nadelRiverton = 0
VAR nadelIronwood = 0
VAR adaGetroffen = false
VAR faehrsteinGesehen = false
VAR tafelGesehen = false
VAR schildCedarGesehen = false

// ---------------------------------------------------------------- Rätseltafel

=== tafel ===
{wegMapleCedarTafelBestanden:
    Auf der Tafel steht in Kreide: „Gelöst!“ Jemand hat einen Smiley daneben gemalt. #sprecher:erzaehler
    -> END
}
{not tafelGesehen:
    ~ tafelGesehen = true
    Hinter dem Park hört die Stadt einfach auf. Ein Schild: „Maple Falls, 2 140 Einwohner.“ #sprecher:erzaehler
}
Unter dem Ortsschild hängt eine Blechtafel mit Magnetfiguren: „Rätsel am Ortsausgang. Wer es löst, darf gehen. Wer nicht, auch.“ #sprecher:erzaehler
{tafel == 1: Das macht Mr. Pratt. Jeden Monat ein neues. Niemand weiß, warum. #sprecher:juno #stimmung:froh}
* [Die Aufgaben lösen]
    ~ beginneAufgaben("wegMapleCedar.tafel")
    -> END
* [Weitergehen]
    {tafel == 1: -> juno_weg}
    -> END

// Runde 11 (Dialogprüfung B2, „Fehlt im Spiel“; Roman Kapitel 10): Juno erzählt auf der
// Landstraße. Läuft einmal, nach dem ersten Blick auf die Tafel.
=== juno_weg ===
Die Landstraße läuft zwischen Feldern, gerade wie mit dem Lineal gezogen. Der Himmel ist sehr groß. #sprecher:erzaehler
Meine Schwester Carla war drei Jahre im Team. Dann kam das Auto. Jetzt tut sie, als hätte es sie nie interessiert. #sprecher:juno
Gegen Mrs. Okafor hat noch niemand aus Maple Falls gewonnen. #sprecher:juno
* [„Niemand?“]
    Der Coach einmal. Vor drei Jahren. Sie redet heute noch davon. #sprecher:juno #stimmung:froh
* [Zum Himmel sehen]
    Du siehst immer wieder hinauf. In der Stadt hattest du nie so viel Himmel. #sprecher:erzaehler
- -> END

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
Nach Cedar Creek? Zwei Stunden. Ich spiele unterwegs eine Partie im Kopf. #sprecher:wanderer
Bei der Brücke bin ich meistens matt. #sprecher:wanderer
-> END

=== wanderer_zweites ===
Wieder unterwegs? #sprecher:wanderer
Heute hab ich am Gatter einen Bauern geschlagen. Am Fluss hat es mir leidgetan. #sprecher:wanderer
-> END

=== wanderer_drittes ===
{~Der Weg ist das halbe Spiel. Die andere Hälfte ist das Brett.|Ich gehe weiter. Viel Glück in Cedar Creek!} #sprecher:wanderer
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
Blitz. Drei Minuten. Du kriegst Weiß und die bessere Stellung, ich bin nett. #sprecher:nia
Zehn Züge. Hältst du deinen Vorteil, darfst du vorbei. #sprecher:nia
Sonst trägst du mein Board bis Cedar Creek. #sprecher:nia
* [„Abgemacht.“]
    -> nia_duell
* [„Nicht jetzt.“]
    Ich bin schnell. Du nicht. Bis gleich. #sprecher:nia
    -> END

=== nia_duell ===
// Ambrose schweigt auf dem ersten Weg bis zum Fluss (Roman, Kapitel 10).
{faehrsteinGesehen: Sie hat die Figuren aufgestellt, bevor ich „Guten Tag“ sagen konnte. #sprecher:ambrose}
~ beginnePartie("wegMapleCedar.nia")
Nia stellt die Figuren auf ihr Board, so schnell, dass du kaum hinsiehst. #sprecher:erzaehler
-> END

=== nia_nach_sieg ===
Okay, okay. Du bist schneller, als du aussiehst. Noch mal? #sprecher:nia
{faehrsteinGesehen: Schnell war sie. Du warst da. #sprecher:ambrose}
+ [„Noch eine.“]
    -> nia_duell
+ [„Ich muss weiter.“]
    Sag Jo, ich hab extra langsam gespielt. Stimmt nicht, aber sag es ihr. #sprecher:nia
    -> END

=== nia_nach_niederlage ===
Board tragen! War nur Spaß. Noch eine Runde? #sprecher:nia
{faehrsteinGesehen: Bei drei Minuten denkt man nicht, man sieht. Das kommt mit der Übung. #sprecher:ambrose}
+ [„Revanche.“]
    -> nia_duell
+ [„Nicht jetzt.“]
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
Diese Handschrift. Ich kenne sie, aber ich kann sie nicht mehr lesen. #sprecher:ambrose #stimmung:traurig #pause:2
Heb es gut auf, Kind. #sprecher:ambrose
-> END

=== fund_muenzen ===
{muenzenGefunden:
    Die alte Kiste am Flussufer ist leer. #sprecher:erzaehler
    -> END
}
~ muenzenGefunden = true
Zwischen zwei Steinen am Ufer klemmt eine kleine Holzkiste. Darin klimpern Münzen. #sprecher:erzaehler
~ gibFund("muenzenFlussweg")
Münzen im Fluss. Jemand hat sich hier etwas gewünscht und es sich anders überlegt. #sprecher:ambrose
-> END

// ---------------------------------------------------------------- Rast und Schild

=== rast ===
// Fährstelle am Flussweg (Auslöser „rast“): der Stein mit dem eingeritzten Brett, Silas mit der
// Angel, Ambroses erster Satz seit dem Aufbruch und seine erste eigene Erinnerung (Roman, Kapitel 10;
// VC15 bis VC18). Später: #musik:flussweg (Wasser statt Mundharmonika).
{faehrsteinGesehen: -> faehrstein_spaeter}
-> faehrstein

=== schild_cedar ===
// VC19, VC20: Gründungsjahr statt Witz; die Uhr spricht. Am Ende des Flusswegs stehen die Zedern.
~ schildCedarGesehen = true
Die Zedern stehen so dicht, dass die Schritte auf den Nadeln kein Geräusch mehr machen. Selbst Juno redet leiser. #sprecher:erzaehler
Ein Schild aus Holz: „Cedar Creek. Gegr. 1851.“ Dahinter, zwischen den Bäumen, schlägt eine Uhr. Viermal, langsam. #sprecher:erzaehler #klang:turmuhr #pause:3
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
    „Du bist das Kind von der Tafel. Mr. Pratt hat es erzählt. Komm rein. Gatter zu.“ #sprecher:erzaehler
    -> END
- else:
    Das Gatter ist zu. Am Pfosten ein Zettel: „Kühe ausgebüxt. Bin suchen. W. Miller.“ #sprecher:erzaehler
    Darunter, kleiner: „Wer die Tafel am Ortsausgang gelöst hat, darf helfen.“ #sprecher:erzaehler
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
Auf den Tischen liegen Lampen, Kisten und ein Fahrrad ohne Kette. Vor dem Wohnmobil sitzt eine alte Dame und lacht. #sprecher:erzaehler
Odette Finch. Problemhefte, fünfzig Cent das Stück. Aber erst stelle ich dir eine Falle. #sprecher:odette
-> flohmarkt_angebot

=== flohmarkt_angebot ===
Matt in einem Zug. Sieht aus wie Patt, ist es aber nicht. #sprecher:odette
Drei Stück hab ich, eine gemeiner als die andere. #sprecher:odette
Solche Aufgaben standen zu meiner Zeit in den Zeitungen. Schön und gemein. #sprecher:ambrose
* [Die Fallen lösen]
    ~ beginneAufgaben("wegMapleCedar.finchFallen")
    -> END
* [Nicht jetzt]
    Ich bin den ganzen Samstag hier. Die Fallen laufen nicht weg. #sprecher:odette
    -> END

=== flohmarkt_karte ===
~ flohmarktKarteErhalten = true
Odette klatscht in die Hände. #sprecher:erzaehler
Alle drei! Dann bist du genau richtig für meine letzte große Aufgabe. #sprecher:odette #stimmung:froh
Sie gibt dir eine Karte mit sechzehn leeren Kästchen. #sprecher:erzaehler
Sechzehn weiße Figuren aus Buchsbaum, versteckt an den Wegen. Unter jeder steht ihr Feld. #sprecher:odette
~ gibFund("finchKarte")
Wo eine liegt, hab ich einen Finken hingemalt. Und das Heft nimmst du mit, drei Aufgaben für unterwegs. #sprecher:odette
~ gibFund("problemheft")
Sechzehn Figuren. Das wird ein langer Spaziergang, Lehrling. Ein schöner. #sprecher:ambrose #stimmung:lacht
-> END

=== flohmarkt_spaeter ===
Hast du schon einen Finken gesehen? Die Figuren liegen nie ohne Zeichen. #sprecher:odette
Odette packt eine Lampe in Zeitungspapier. #sprecher:erzaehler
Wir sehen uns wieder. Ich fahre weiter, als du denkst. #sprecher:odette
-> END

// ---------------------------------------------------------------- Runde 6: Sammelstellen

=== seite00 ===
{seite00Gefunden:
    Im Graben liegt nur noch Laub. #sprecher:erzaehler
    -> END
}
~ seite00Gefunden = true
Im Graben neben dem Hof steckt ein Blatt Papier, feucht vom Tau. #sprecher:erzaehler
// Runde 11: Kein Buchverweis (Entscheidung vom 10.11.2026, Befund in 22_Dialogpruefung.md); ein
// loses Blatt mit einer Stellung. Die Sammlung „buchseiten“ bleibt als Zähler bestehen.
Ein loses Blatt mit einer gezeichneten Stellung. Jemand hat mit Bleistift „Weiß zieht“ darunter geschrieben. #sprecher:erzaehler
~ gibFund("seite00")
~ buchseiten = buchseiten + 1
Eine Stellung, die der Wind gebracht hat. Heb sie auf, man weiß nie. #sprecher:ambrose
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

// ================================================================ Runde 11: Roman, Kapitel 10
// Neu gegenüber der Story-Bibel (docs/spiel/roman/akt1_teil3.md, Tabelle am Ende): Ada und die
// Krähen, die Ehrlichkeitskasse in drei Stufen, Silas am Stein der Fährstelle mit Ambroses erster
// eigener Erinnerung (nur beim ersten Besuch), Tessa in vier Stufen. Stimmung: frei, Sommerende,
// Atem holen (Dokument 19, Abschnitt 4; Ortsblatt „Weg“ in Dokument 20).
//
// Stufen der kleinen Geschichten (Dokument 20, Ortsblatt Weg). Die Spalte B des Ortsblatts („nach
// der Nadel von Maple Falls“) liegt vor dem ersten Weg; deshalb zählt hier der erste Weg als A:
//   A erster Weg (nadelCedarCreek == 0), B nach der Nadel von Cedar Creek (bis zur Nadel von
//   Riverton), C in Akt 2 (nadelRiverton > 0), D nach Akt 2 (nadelIronwood > 0).
//
// Auslöser für die Karten (fehlen noch, Karten baut ein anderer Helfer):
//   apfelstand  Landstraße, Kasse am Apfelstand (Gegenstand)   → weg-maple-cedar.apfelstand
//   ada         Landstraße, Figur „Ada“ (heute Statistin apfelverkaeuferin) → weg-maple-cedar.ada
//   Fährstelle  Flussweg, Stein mit eingeritztem Brett: läuft über den vorhandenen Auslöser „rast“
//   tessa       Landstraße, Flussweg oder Zedernpfad je Stufe (heute Statistin joggerin) → weg-maple-cedar.tessa
// Ada, Silas und Otis haben noch kein Porträt; ihre Sätze stehen deshalb in Anführungszeichen beim
// Erzähler (wie Walt Miller und Odette Finch oben).

// ---------------------------------------------------------------- Ehrlichkeitskasse

=== apfelstand ===
{
- nadelIronwood > 0: -> apfelstand_d
- nadelRiverton > 0: -> apfelstand_c
- nadelCedarCreek > 0: -> apfelstand_b
- else: -> apfelstand_a
}

=== apfelstand_a ===
Ein Tisch am Gatter: Äpfel, Flaschen mit dunklem Sirup und eine Blechdose mit Schlitz. Niemand ist da. #sprecher:erzaehler
Auf einem Pappschild steht: „Äpfel 1 Dollar. Sirup 4. Bitte ehrlich.“ #sprecher:erzaehler
Juno legt einen Dollar in die Dose und nimmt zwei Äpfel. Einen gibt sie dir. #sprecher:erzaehler
{not adaGetroffen: -> ada}
-> END

=== apfelstand_b ===
An der Blechdose klebt jetzt ein Zettel in großer Schrift. #sprecher:erzaehler
„Wer es war, kann es zurücklegen. Ich frag nicht.“ #sprecher:erzaehler
Eine Frau, die nicht fragt. Das ist mehr Vertrauen, als ich je hatte. #sprecher:ambrose
-> END

=== apfelstand_c ===
Der Zettel hängt noch an der Dose. Darunter hat jemand einen Apfelkern geklebt. #sprecher:erzaehler
„Stimmt wieder“, steht in Adas Schrift daneben. „Mit Zinsen.“ #sprecher:erzaehler
Ein Apfelkern als Entschuldigung. Das gefällt mir. #sprecher:ambrose #stimmung:lacht
-> END

=== apfelstand_d ===
Die Kasse stimmt, der Zettel hängt noch. Daneben ein Zeitungsausschnitt in einer Klarsichthülle. #sprecher:erzaehler
Ein Foto von der Joggerin, die Arme oben, hinter ihr ein Zielband. Sie selbst ist heute nicht da. #sprecher:erzaehler
-> END

// ---------------------------------------------------------------- Ada und die Krähen

=== ada ===
{adaGetroffen: -> ada_alltag}
~ adaGetroffen = true
Eine Frau in Gummistiefeln kommt über die Wiese, in jeder Hand einen Eimer. #sprecher:erzaehler
„Die Kasse stimmt fast immer. Fast.“ #sprecher:erzaehler
Sie stellt die Eimer ab und sieht auf das Feld. „Drei Krähen, zwei Vogelscheuchen. Wer gewinnt?“ #sprecher:erzaehler
* [„Die Krähen. Drei gegen zwei.“]
    Sie sieht dich an, zum ersten Mal richtig. „Die zählen in der Schule jetzt, was?“ #sprecher:erzaehler
* [„Die Vogelscheuchen. Die laufen nicht weg.“]
    „Weglaufen tun sie nicht. Aber es sind drei gegen zwei.“ #sprecher:erzaehler
- Sie nimmt den Deckel von der Dose, zählt mit den Lippen und seufzt. #sprecher:erzaehler
„Diese Woche fehlen wieder sechs. Ich frag nicht, wer. Ich schreib bloß einen Zettel.“ #sprecher:erzaehler
Ein Traktor fährt vorbei. Der Mann darauf hebt zwei Finger vom Lenkrad. Das ist alles. #sprecher:erzaehler
„Otis. Redet mit den Kühen.“ Sie nimmt die Eimer wieder auf. „Gatter zu, wenn ihr geht.“ #sprecher:erzaehler
-> END

=== ada_alltag ===
{
- nadelRiverton > 0: „Die Kasse stimmt. Ich lass den Zettel trotzdem hängen. Man weiß ja nie.“ #sprecher:erzaehler
- nadelCedarCreek > 0: „Der Zettel hängt. Mal sehen, wer ihn liest.“ #sprecher:erzaehler
- else: „Drei Krähen, zwei Vogelscheuchen. Ich sag ja: Die Krähen gewinnen.“ #sprecher:erzaehler
}
-> END

// ---------------------------------------------------------------- Silas am Stein der Fährstelle

=== faehrstein ===
{faehrsteinGesehen: -> faehrstein_spaeter}
~ faehrsteinGesehen = true
Wo das Ufer flach ist, liegt ein großer Stein im Gras. Darin sind Linien eingeritzt, acht mal acht. #sprecher:erzaehler
Daneben sitzt ein alter Mann auf einem Klappstuhl. Die Angel hängt im Wasser, der Eimer ist leer. #sprecher:erzaehler
„Mein Großvater hat hier Leute übergesetzt. Als es die Brücke noch nicht gab.“ #sprecher:erzaehler
„Die Fährleute haben auf dem Stein gespielt, während sie warteten. Mit Kieseln. Helle und dunkle.“ #sprecher:erzaehler
* [Die Hand auf den Stein legen]
    Der Stein ist warm von der Sonne. #sprecher:erzaehler
* [„Beißen die Fische heute?“]
    Er zieht die Angel heraus. Der Haken ist leer. „Die wissen, wann ich komme.“ #sprecher:erzaehler
- Hier ist es schöner. Es ist das Erste, was Ambrose seit dem Aufbruch sagt. #sprecher:erzaehler
Auf Straßen wie der dort oben bin ich wochenlang gefahren. In einer Kutsche, die jede Furche mitnahm. #sprecher:ambrose
Am Fluss kann man wenigstens denken. #sprecher:ambrose
* [„Wohin bist du gefahren?“]
    Er antwortet nicht gleich. #sprecher:erzaehler #pause:2
    Nach Norden. Es ist lange her. #sprecher:ambrose
* [Nichts sagen]
- Auf so etwas habe ich auch gespielt. An einem Kai, auf einem Fass, mit Knöpfen. Ich war neun. #sprecher:ambrose
Ich verlor gegen einen Matrosen aus Marseille und weinte. Er schenkte mir eine Orange. #sprecher:ambrose
Daran habe ich seit … Ich wusste nicht, dass ich das noch weiß. #sprecher:ambrose #stimmung:lacht
Juno hat nichts gehört. Sie fotografiert den Stein für das Tagebuch. #sprecher:erzaehler
-> END

=== faehrstein_spaeter ===
Der Stein mit dem eingeritzten Brett. Man fühlt die Linien eher, als man sie sieht. #sprecher:erzaehler
{nadelCedarCreek == 0: „Fische? Die wissen, wann ich komme.“ #sprecher:erzaehler}
-> END

// ---------------------------------------------------------------- Tessa, die Joggerin

=== tessa ===
{
- nadelIronwood > 0: -> tessa_d
- nadelRiverton > 0: -> tessa_c
- nadelCedarCreek > 0: -> tessa_b
- else: -> tessa_a
}

=== tessa_a ===
Eine Frau läuft vorbei, rot im Gesicht. Am Gatter bleibt sie stehen und keucht. #sprecher:erzaehler
Noch – drei Kilometer! Halbe – Strecke! #sprecher:joggerin
Und weg ist sie. #sprecher:erzaehler
-> END

=== tessa_b ===
Die Joggerin kommt dir am Fluss entgegen, diesmal ohne Keuchen. #sprecher:erzaehler
Bis zum Steg! Ganz! Morgen weiter! #sprecher:joggerin #stimmung:froh
Am Steg steht ihre Wasserflasche, wie ein Merkzeichen. #sprecher:erzaehler
-> END

=== tessa_c ===
Unter den Zedern läuft dir jemand entgegen, gleichmäßig, ohne Hast. Die Joggerin. #sprecher:erzaehler
Sie hebt nur die Hand und läuft weiter. Zum Reden braucht sie den Atem nicht mehr. #sprecher:erzaehler
Die ganze Strecke. Wer hätte das gedacht? Sie vermutlich nicht. #sprecher:ambrose
-> END

=== tessa_d ===
Von der Joggerin ist heute nichts zu sehen. #sprecher:erzaehler
Am Apfelstand hängt ein Zeitungsausschnitt. Vielleicht weiß Ada mehr. #sprecher:erzaehler
-> END

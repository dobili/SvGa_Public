// Weg 10 vom Pinewood Camp nach Ghost Town: Karten „Canyonrand“ und „Staubstraße“ (Akt 4, Szene 97
// der Story-Bibel, Abschnitt 28 und 29; Landschaft L3 Echo Canyon).
//
// Stationen (W4): Kletterin Juniper mit Drei-Schach (Variante, noch ohne Technik: Juniper erklärt
// sie nur), Rätseltafel am Canyonrand (Runde wegPinewoodGhost.tafel, drei Aufgaben mit Schach).
// Einstiege wie in orte.json: juniper, zurueck_camp, tafel. Die Ankunft erzählt
// ghost-town-aussen.ankunft_zu_fuss.
//
// Variablen: wegPinewoodGhostTafelBestanden setzt die Hülle (R42), die übrigen setzt diese Datei.

EXTERNAL beginneAufgaben(runde)

VAR wegPinewoodGhostTafelBestanden = false
VAR juniperGetroffen = false

// ---------------------------------------------------------------- Juniper am Canyonrand

=== juniper ===
{juniperGetroffen:
    {~Drei Schachs, drei Echos. Dann ist die Partie vorbei.|Das Seil hält. Das Brett auch.|Hinter der Staubstraße liegt Ghost Town. Niemand wohnt da. Fast niemand.} #sprecher:juniper
    -> END
}
~ juniperGetroffen = true
Am Canyonrand hängt eine Frau im Seil und winkt. Unten auf einem Felsvorsprung steht ein Brett. #sprecher:erzaehler
Juniper. Wir Kletterer spielen hier Drei-Schach. Wer dreimal Schach gibt, gewinnt. #sprecher:juniper
Bei jedem Schach rufen wir laut. Wenn das dritte Echo verklungen ist, ist Schluss. #sprecher:juniper
Drei Schachs, und keiner muss matt sein. Wie ungeduldig. Und wie lustig. #sprecher:ambrose #stimmung:lacht
-> END

// ---------------------------------------------------------------- Rätseltafel und Rückweg

=== tafel ===
{wegPinewoodGhostTafelBestanden:
    Auf der Tafel am Canyonrand steht in Kreide: „Gelöst. Echo!“ #sprecher:erzaehler
    -> END
}
An einem Pfosten am Canyonrand hängt eine Tafel mit drei Diagrammen: „Ein Schach mit Folgen. Findest du es?“ #sprecher:erzaehler
* [Die Aufgaben lösen]
    ~ beginneAufgaben("wegPinewoodGhost.tafel")
    -> END
* [Weitergehen]
    -> END

=== zurueck_camp ===
Der Pfad führt zurück in den Wald, zum Pinewood Camp. #sprecher:erzaehler
-> END

// >>> Runde 6 (mittel-4)
VAR spurenPM = 0
VAR finchFiguren = 0
VAR buchseiten = 0
EXTERNAL beginnePartie(begegnung)
EXTERNAL gibFund(kennung)
VAR held = "Du"
VAR ambroseSprichtWieder = false
VAR tankstelleGesehen = false
VAR ausgangWegPinewoodGhostZ1 = ""
VAR z1Fertig = false
VAR z1Gesehen = false
VAR gefundenSpurPM6 = false
VAR gefundenSeite11 = false
VAR gefundenFinchBauerE = false

// ---------------------------------------------------------------- Ereignis: Das Gespenst der Tankstelle (Dokument 15, 2.12)
// Akt 4. Draußen die verlassene Tankstelle, drinnen der Greifarm Z-1 (Innenraum wegPinewoodGhost.tankstelle).
// Gegner mit Buch und Bruch kommt von mittel-2; bis dahin spielt Z-1 fest Italienisch (Gegner wegPinewoodGhost.z1).

=== ereignis_tankstelle ===
{tankstelleGesehen:
    Die alte Tankstelle. Auf dem Dach glänzt ein Solarpaneel, viel zu neu für das Blech darunter. #sprecher:erzaehler
    -> END
}
~ tankstelleGesehen = true
Eine verlassene Tankstelle, die Zapfsäulen voller Staub. Auf dem Dach glänzt ein nagelneues Solarpaneel. #sprecher:erzaehler
Von drinnen kommt ein Geräusch: klack. Pause. Klack. #sprecher:erzaehler
Die Kinder im Camp reden von einem Gespenst, das hier nachts Schach spielt. #sprecher:erzaehler
{ambroseSprichtWieder:
    Gespenster spielen nicht in Tankstellen. Ich muss es wissen. #sprecher:ambrose
}
-> END

=== greifarm ===
{
- z1Fertig:
    Z-1 hat die Figuren wieder aufgestellt. Auf dem kleinen Bildschirm steht: „Nächste Partie?“ #sprecher:erzaehler
    -> END
- ausgangWegPinewoodGhostZ1 != "" and ausgangWegPinewoodGhostZ1 != "abgebrochen": -> greifarm_ende
- z1Gesehen: -> greifarm_angebot
}
-> greifarm_start

=== greifarm_start ===
~ z1Gesehen = true
Vor einem Tisch mit Brett steht ein Greifarm mit dem Logo von Perfect Move. Ein Kabel führt hinauf zum Solarpaneel. #sprecher:erzaehler
Auf seinem kleinen Bildschirm leuchtet: „Prototyp Z-1. Bereit. Weiß beginnt.“ #sprecher:greifarm
-> greifarm_angebot

=== greifarm_angebot ===
+ [Sich an den Tisch setzen.]
    Der Arm zuckt, dann setzt er einen Bauern nach e4. Klack. #sprecher:greifarm
    ~ beginnePartie("wegPinewoodGhost.z1")
    -> END
+ [Lieber nicht.]
    Der Arm senkt sich wieder. Auf dem Bildschirm steht: „Warte.“ #sprecher:greifarm
    -> END

=== greifarm_ende ===
{z1Fertig: -> END}
~ z1Fertig = true
Der Arm zittert, als die Partie das Buch verlassen hat. Dann legt er einen Bauern aus Metall vor {held} hin. #sprecher:erzaehler
„Danke für die Partie.“ #sprecher:greifarm
~ gibFund("bauerZ1")
{ambroseSprichtWieder:
    Eine Nähmaschine mit Ehrgeiz. Lasst ihn spielen, er hat sonst niemanden. #sprecher:ambrose
}
-> END

// ---------------------------------------------------------------- Funde und Ansehen

=== spur_pm6 ===
{gefundenSpurPM6:
    An der Tür klebt noch der Rest eines Etiketts. #sprecher:erzaehler
    -> END
}
~ gefundenSpurPM6 = true
An der Tür klebt ein Typenschild: „Prototyp Z-1, Testlabor Perfect Move. Nicht entfernen.“ Es ist schon halb abgelöst. #sprecher:erzaehler
~ gibFund("spurPM6")
~ spurenPM = spurenPM + 1
-> END

=== seite11 ===
{gefundenSeite11:
    Im Ölwechsel-Graben liegt nur noch Staub. #sprecher:erzaehler
    -> END
}
~ gefundenSeite11 = true
Im alten Ölwechsel-Graben liegt eine Buchseite, kaum ölig. Oben steht: Kapitel 11, Beispielpartien. #sprecher:erzaehler
~ gibFund("seite11")
~ buchseiten = buchseiten + 1
-> END

=== finch_bauer_e ===
{gefundenFinchBauerE:
    An der Aussicht ist nur noch das Finkenzeichen aus Blech. #sprecher:erzaehler
    -> END
}
~ gefundenFinchBauerE = true
Neben der Bank an der Aussicht hängt ein kleiner Fink aus Blech. Darunter, zwischen zwei Steinen, liegt ein weißer Bauer aus Buchsbaum. #sprecher:erzaehler
~ gibFund("finchBauerE")
~ finchFiguren = finchFiguren + 1
-> END

=== kletterwand ===
Eine Kletterwand mit zwei Routen ragt über die Kante. Die Griffe sind bunt, die Seile frisch. #sprecher:erzaehler
-> END

=== wagen ===
Ein Autowrack, rot vom Rost und vom Sand. Im Handschuhfach liegt eine Straßenkarte von 1962. #sprecher:erzaehler
-> END
// <<< Runde 6 (mittel-4)

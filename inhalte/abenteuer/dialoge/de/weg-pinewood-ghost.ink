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
// Zähl-Merker der Sammelstücke (Chaos-Prüfung, 14.11.2026): gesetzt erst zusammen mit dem
// Zähler und dem Fund, damit Abbrechen oder Neuladen kein Stück verliert.
VAR spurPM6Gezaehlt = false
VAR seite11Gezaehlt = false
VAR finchBauerEGezaehlt = false

// ---------------------------------------------------------------- Juniper am Canyonrand

=== juniper ===
{juniperGetroffen:
    {~Drei Schachs, drei Echos. Dann ist die Partie vorbei.|Das Seil hält. Das Brett auch.|Hinter der Staubstraße liegt Ghost Town. Niemand wohnt da. Fast niemand.} #sprecher:juniper #stimmung:laechelt
    -> END
}
~ juniperGetroffen = true
Am Canyonrand hängt eine Frau im Seil und winkt. Unten auf einem Felsvorsprung steht ein Brett. #sprecher:erzaehler
Juniper. Wir Kletterer spielen hier Drei-Schach. Wer dreimal Schach gibt, gewinnt. #sprecher:juniper #stimmung:laechelt
Bei jedem Schach rufen wir laut. Wenn das dritte Echo verklungen ist, ist Schluss. #sprecher:juniper #stimmung:laechelt
Sie rufen sich die Züge zu und warten auf das Echo, bevor die Nächste zieht. Ein seltsames, schönes Spiel. #sprecher:erzaehler #geraeusch:canyonrand
Aber Ambrose ist still geworden. Er sieht nach Norden. #sprecher:erzaehler
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
// Buch und Bruch (begegnungen.json, wegPinewoodGhost.z1): Z-1 spielt die Hauptvariante des Italieners
// (Giuoco Pianissimo, 20 Halbzüge) in voller Stärke; weicht {held} ab, zittert der Arm und spielt auf Stufe 2.

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
    Gespenster spielen nicht in Tankstellen. Ich muss es wissen. #sprecher:ambrose #stimmung:lacht
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
Auf seinem kleinen Bildschirm leuchtet: „Prototyp Z-1. Bereit. Weiß beginnt.“ #sprecher:greifarm #stimmung:neutral
-> greifarm_angebot

=== greifarm_angebot ===
+ [Sich an den Tisch setzen.]
    Der Arm zuckt, dann setzt er einen Bauern nach e4. Klack. #sprecher:greifarm #stimmung:neutral
    ~ beginnePartie("wegPinewoodGhost.z1")
    -> END
+ [Lieber nicht.]
    Der Arm senkt sich wieder. Auf dem Bildschirm steht: „Warte.“ #sprecher:greifarm #stimmung:neutral
    -> END

=== greifarm_ende ===
{z1Fertig: -> END}
~ z1Fertig = true
Der Arm zittert, als die Partie das Buch verlassen hat. Dann legt er einen Bauern aus Metall vor {held} hin. #sprecher:erzaehler
„Danke für die Partie.“ #sprecher:greifarm #stimmung:neutral
~ gibFund("bauerZ1")
{ambroseSprichtWieder:
    Eine Nähmaschine mit Ehrgeiz. Lasst ihn spielen, er hat sonst niemanden. #sprecher:ambrose #stimmung:laechelt
}
-> END

// ---------------------------------------------------------------- Funde und Ansehen

=== spur_pm6 ===
{spurPM6Gezaehlt:
    An der Tür klebt noch der Rest eines Etiketts. #sprecher:erzaehler
    -> END
}
An der Tür klebt ein Typenschild: „Prototyp Z-1, Testlabor Perfect Move. Nicht entfernen.“ Es ist schon halb abgelöst. #sprecher:erzaehler
~ spurPM6Gezaehlt = true
~ spurenPM = spurenPM + 1
~ gibFund("spurPM6")
-> END

=== seite11 ===
{seite11Gezaehlt:
    Im Ölwechsel-Graben liegt nur noch Staub. #sprecher:erzaehler
    -> END
}
Im alten Ölwechsel-Graben liegt eine lose Seite, kaum ölig und voller Schachdiagramme. #sprecher:erzaehler
~ seite11Gezaehlt = true
~ buchseiten = buchseiten + 1
~ gibFund("seite11")
-> END

=== finch_bauer_e ===
{finchBauerEGezaehlt:
    An der Aussicht ist nur noch das Finkenzeichen aus Blech. #sprecher:erzaehler
    -> END
}
Neben der Bank an der Aussicht hängt ein kleiner Fink aus Blech. Darunter, zwischen zwei Steinen, liegt ein weißer Bauer aus Buchsbaum. #sprecher:erzaehler
~ finchBauerEGezaehlt = true
~ finchFiguren = finchFiguren + 1
~ gibFund("finchBauerE")
-> END

=== kletterwand ===
Eine Kletterwand mit zwei Routen ragt über die Kante. Die Griffe sind bunt, die Seile frisch. #sprecher:erzaehler
-> END

=== wagen ===
Ein Autowrack, rot vom Rost und vom Sand. Im Handschuhfach liegt eine Straßenkarte von 1962. #sprecher:erzaehler
-> END
// <<< Runde 6 (mittel-4)

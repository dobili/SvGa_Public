// Route 3 von Riverton nach Ironwood: Karten „Kanalweg“ und „Brücke“ (Akt 2, Szene 40 der
// Story-Bibel, Abschnitt 10.3).
//
// Stationen (W4): Bauer Mr. Dale mit einer Weisheit (Kapitel 5, nur das Kapitel), Rätseltafel an
// der Bushaltestelle ohne Bus (Runde wegRivertonIronwood.tafel, zwei Fesselungen), Funde Zahnrad
// und Nietenkopf „J. H.“ (übergreifend, Akt 3), der Zeitnot-Trick auf der Brücke (Z6).
// Einstiege wie in orte.json: dale, tafel, fund_zahnrad, fund_nietenkopf, zeitnot_trick. Die
// Ankunft erzählt der Übergang nach Ironwood (ironwood-aussen.ankunft_zu_fuss).
//
// Karte des Zeitnot-Tricks: Der Name in karten.json kommt mit Schritt 13; bis dahin gibt der
// Knoten zeitnot_trick: die Karte „Großes Maul“ (Schritt 13, docs/spiel/10, S1). Der Roman beschreibt
// eine Sanduhr; Name und Bild der Karte sind noch nicht angeglichen (Gutachten L1, Rand).
// Variablen: wegRivertonIronwoodTafelBestanden setzt die Hülle (Langform, R42).

EXTERNAL beginneAufgaben(runde)
EXTERNAL beginnePartie(begegnung)
EXTERNAL gibFund(kennung)
EXTERNAL gibKarte(kennung)

VAR wegRivertonIronwoodTafelBestanden = false
VAR daleGetroffen = false
VAR zahnradGefunden = false
VAR nietenkopfGefunden = false
VAR zeitnotTrickErhalten = false
// Kapitel 24 (Roman): Noors Wandbild wächst mit der Nadel von Ironwood (Hülle setzt nadelIronwood);
// {held} spricht Ambrose erst nach dem Archiv aus, Kapitel 24 liegt danach.
VAR nadelIronwood = 0
VAR noorGetroffen = false
VAR held = ""
// Runde 6: Ereignis „Brückenbauern“ (Dokument 15, 2.3) und Sammelstränge. gefunden<Fund> setzt die
// Hülle nach gibFund, ausgangWegRivertonIronwoodDime nach der Partie (R42).
VAR gefundenKonservendose = false
VAR gefundenKreide1 = false
VAR gefundenSpurPM1 = false
VAR gefundenSeite07 = false
VAR gefundenFinchLaeuferA = false
VAR ausgangWegRivertonIronwoodDime = ""
// Zähler der Sammelstränge (Vereinbarung Runde 6): jeder Fundknoten zählt zu gibFund hoch.
VAR finchFiguren = 0
VAR buchseiten = 0
VAR spurenPM = 0
VAR kreideTreffpunkte = 0

// ---------------------------------------------------------------- Mr. Dale

=== dale ===
{daleGetroffen:
    {~Ein Bauer zieht nie zurück.|Überleg vorher. Sag ich den Kühen auch.} #sprecher:dale
    -> END
}
~ daleGetroffen = true
Ein Mann lehnt am Zaun und kaut einen Halm. #sprecher:erzaehler
Ein Bauer zieht nie zurück. #sprecher:dale
Also überleg vorher. #sprecher:dale
Keiner hat ihn gefragt. Er meint vermutlich auch sich selbst. #sprecher:erzaehler
-> END

// ---------------------------------------------------------------- Noor Haddad (Kapitel 24)
// Wandbild in Stufen (Roman, „Neu gegenüber“): Umrisse in Akt 2, Farbe nach der Nadel von
// Ironwood. Die Stufen in Akt 3 (fertig mit Signatur, Künstlerin fort) kommen mit Akt 3.
// Noch ohne Figur auf der Karte (Kartenpunkt vor der Fabrikmauer, K2).

=== noor ===
{nadelIronwood > 0:
    -> noor_farbe
}
{noorGetroffen:
    Nicht stehen bleiben. Das ist noch nichts. #sprecher:noor
    -> END
}
~ noorGetroffen = true
An einer langen Mauer steht eine junge Frau auf einer Leiter. Auf ihrem Eimer steht „Noor“. #sprecher:erzaehler #geraeusch:spruehdose
Auf der Mauer wachsen schwarze Umrisse. Ein Turm. Ein halber Springer. #sprecher:erzaehler
Nicht stehen bleiben. Das ist noch nichts. #sprecher:noor
* [„Was wird es?“]
- Weiß ich, wenn es fertig ist. #sprecher:noor
Sie schüttelt eine Dose. Es klackert. #sprecher:erzaehler
Mein Opa hat da drin gearbeitet. #sprecher:noor
Die haben in der Pause gespielt, auf einer Werkbank. Ich mal die Bank. Vielleicht. #sprecher:noor
-> END

= noor_farbe
Die Umrisse haben Farbe bekommen. Unter dem Turm steht jetzt eine Werkbank, zwei Männer in Blaumann beugen sich darüber. #sprecher:erzaehler
Der Turm kriegt Ultramarin. Opa hätte gesagt: zu bunt. #sprecher:noor
-> END

// ---------------------------------------------------------------- Rätseltafel

=== tafel ===
{wegRivertonIronwoodTafelBestanden:
    Unter dem Fahrplan steht in Kreide: „Gelöst. Der Bus kommt trotzdem nicht.“ #sprecher:erzaehler
    -> END
}
An einer Bushaltestelle ohne Bus hängt eine Rätseltafel aus Blech: „Was festgenagelt ist, kann nicht weg.“ #sprecher:erzaehler
Festgenagelt. Ein hartes Wort für eine Figur, die nur treu ist. #sprecher:ambrose
* [Die Aufgaben lösen]
    ~ beginneAufgaben("wegRivertonIronwood.tafel")
    -> END
* [Weitergehen]
    -> END

// ---------------------------------------------------------------- Funde

=== fund_zahnrad ===
{zahnradGefunden:
    Am Zaun der leeren Fabrik sitzen Krähen. Sie sehen dir nach, als hätten sie hier das Sagen. #sprecher:erzaehler
    -> END
}
~ zahnradGefunden = true
Eine Fabrik aus rotem Stein, und niemand ist darin. Fenster ohne Glas. Aus dem Schornstein wächst ein Baum. #sprecher:erzaehler
Am Zaun liegt ein Zahnrad, so groß wie eine Hand. #sprecher:erzaehler
~ gibFund("zahnrad")
Ein Rad, das kein anderes mehr dreht. #sprecher:ambrose
-> END

=== fund_nietenkopf ===
{nietenkopfGefunden:
    Am Geländer sitzen die Nieten in langen Reihen. Auf jedem Kopf: J. H. #sprecher:erzaehler
    -> END
}
-> jh ->
-> END

// Kapitel 24, Ende: Juno findet die Buchstaben, Ambrose erkennt sie und kann es nicht sagen. Als
// Tunnel, weil es nach dem Zeitnot-Trick oder am Geländer zuerst kommen kann.
=== jh ===
~ nietenkopfGefunden = true
Hier ist was eingeschlagen! In die Dinger. Die runden. #sprecher:juno
Auf einem Nietenkopf am Fuß eines Pfostens stehen zwei Buchstaben. Klein, sauber, ins heiße Eisen gestempelt. #sprecher:erzaehler #bild:nietenkopf_jh
J. H. #sprecher:erzaehler #klang:hale
Auf dem nächsten auch. Und auf dem übernächsten. #sprecher:erzaehler
Der Erbauer. Der hat überall unterschrieben. Eitel! #sprecher:juno
~ gibFund("nietenkopf")
Ambrose sieht auf die Buchstaben. Sein Gesicht ist leer. Wie ein Zimmer, aus dem gerade jemand hinausgegangen ist. #sprecher:erzaehler #bild:aus
* [„Ambrose?“]
- Ein Brückenbauer. Es gibt viele. #sprecher:ambrose #stimmung:still
* [„Du sagtest, er war Brückenbauer. Aus dem Norden.“]
- Es gibt viele Brücken. #sprecher:ambrose #stimmung:still
Der Wind pfeift durch die Dreiecke. #sprecher:erzaehler #pause
Ambrose steht noch einen Augenblick am Geländer. Eine Hand ausgestreckt, dicht über dem Eisen, ohne es zu berühren. #sprecher:erzaehler
->->

// ---------------------------------------------------------------- Der Zeitnot-Trick

=== zeitnot_trick ===
{zeitnotTrickErhalten:
    Der Wind singt in den Trägern. Am Ende des Tals raucht ein Schornstein. #sprecher:erzaehler
    -> END
}
~ zeitnotTrickErhalten = true
Über das Tal läuft eine Brücke aus schwarzem Eisen, sehr alt und sehr schön, auf eine strenge Art. Lauter Dreiecke, jedes genau so groß wie das nächste. #sprecher:erzaehler #musik:aus #geraeusch:wind_traeger
Und Tausende Nieten, runde Köpfe in geraden Reihen. #sprecher:erzaehler
Wer baut so etwas? #sprecher:juno
* [„Jemand, der nichts dem Zufall überlässt.“]
- Du weißt nicht, warum du das sagst. Ambrose ist sehr still. #sprecher:erzaehler #pause
Im Kaffeehaus gab es einen Trick. Man tat, als brenne die Kerze des Gegners schon herunter. #sprecher:ambrose
Man sah darauf. Man seufzte. Er glaubte es, und er eilte. #sprecher:ambrose
* [„Ist das nicht Schummeln?“]
- Es ist Theater. Der Gegner sieht dieselbe Kerze wie du. #sprecher:ambrose
Er hält dir eine Karte hin. Eine Sanduhr darauf, fast leer. #sprecher:erzaehler
~ gibKarte("grossesMaul")
Sie ist nicht ganz sauber. Wenn du sie spielst, glänzt deine Nadel weniger. #sprecher:ambrose
Ich sage es dir, weil ich es früher niemandem gesagt habe. #sprecher:ambrose
* [„Und wenn der andere wirklich keine Zeit hat?“]
- Dann spielt man nicht mit ihm um die Wette. Man nimmt sich die eigene Zeit und zieht in Ruhe. #sprecher:ambrose
Das hat mich dreißig Jahre gekostet. Dann war ich tot. #sprecher:ambrose #stimmung:alt
{nietenkopfGefunden == false:
    -> jh ->
}
-> END

// ---------------------------------------------------------------- Kanalweg: Ansehen (Runde 6)

=== meilenstein ===
Ein Meilenstein aus rotem Sandstein, halb im Gras: „Meile 0“. Von hier an zählt der Kanal. #sprecher:erzaehler
-> END

=== rast_kanal ===
Eine Bank am Schilf. Über dem Wasser stehen Libellen in der Luft, als hätten sie alle Zeit der Welt. #sprecher:erzaehler
-> END

=== fund_konservendose ===
{gefundenKonservendose:
    Am Anleger schwappt nur noch Wasser gegen das Holz. #sprecher:erzaehler
    -> END
}
Am Rastanleger treibt eine Konservendose mit Deckel. Darin steckt ein trockener Zettel. #sprecher:erzaehler
„Wer das findet: komm nach Lockport. Ich hab schon 41 Flaschen. Finn“ #sprecher:erzaehler
~ gibFund("konservendose")
-> END

// ---------------------------------------------------------------- Brücke: Ansehen (Runde 6)

=== waerterhaus ===
Ein Häuschen mit vernagelter Tür. Auf dem Schild steht „Brückenwärter. Bitte klopfen.“ Niemand klopft hier mehr. #sprecher:erzaehler
-> END

=== aussicht_tal ===
Tief unten liegt der Kanal wie ein Strich. Am Ende des Tals stehen Schornsteine im Dunst. Aus einem kommt Rauch. #sprecher:erzaehler
-> END

// ---------------------------------------------------------------- Ereignis „Die Brückenbauern“

=== kreide1 ===
{gefundenKreide1:
    Der Springer aus Kreide am Brückenfuß. Das Wort kennst du schon: Td8. #sprecher:erzaehler
    -> END
}
Am Brückenfuß ist ein Springer aus Kreide gezeichnet. Darunter, kleiner: #sprecher:erzaehler
„Weiß: König g1, Turm d1. Schwarz: König g8, Bauern f7, g7 und h7. Weiß am Zug. Ein Zug, und es ist vorbei. Der Zug ist das Wort.“ #sprecher:erzaehler
-> raten

= raten
* [Td8]
    -> kreidespringer_geloest
* [Td7]
    Der Turm steht schön auf der siebten Reihe. Aber der König hat noch Luft. #sprecher:erzaehler
    -> raten
* [Kf2]
    Der König geht spazieren. Ein Matt ist das nicht. #sprecher:erzaehler
    -> raten
* [Erst nachdenken]
    -> END

=== kreidespringer_geloest ===
Td8. Der König steckt hinter seinen eigenen Bauern fest: Matt auf der Grundreihe. #sprecher:erzaehler
Das Wort ist „Td8“. #sprecher:erzaehler
~ gibFund("kreide1")
~ kreideTreffpunkte = kreideTreffpunkte + 1
-> END

=== brueckenbauern ===
{gefundenKreide1 == false:
    Unter der Brücke stehen drei Klapptische. Ein Mann mit Schiebermütze redet, ohne Luft zu holen. #sprecher:erzaehler
    Zehn Cent die Partie, drei Minuten, zwei Sekunden dazu. Aber erst das Wort. #sprecher:dime
    Das Wort steht am Pfeiler, wenn man richtig hinschaut. Die meisten schauen nicht richtig. #sprecher:dime
    -> END
}
{ausgangWegRivertonIronwoodDime != "":
    -> nach_der_partie
}
„Td8“? Richtig. Setz dich. Ich bin Dime, wie die Münze, und ich verliere nie. Fast nie. #sprecher:dime
Über dem Kanal surrt etwas. Eine kleine Drohne steht in der Luft und dreht sich zum Tisch. #sprecher:erzaehler
Die da? Seit zwei Wochen. Filmt jede Partie. Fragt keiner, wozu. #sprecher:dime
-> spielen

= spielen
* [Spielen]
    Dime stellt die Uhr. Bevor du den ersten Zug machst, hat er schon drei Sätze gesagt. #sprecher:erzaehler
    ~ beginnePartie("wegRivertonIronwood.dime")
    -> END
* [Nicht jetzt]
    Ich bin hier. Die Brücke auch. #sprecher:dime
    -> END

= nach_der_partie
{ausgangWegRivertonIronwoodDime:
- "sieg":
    Gewonnen hast du. Zehn Cent? Sagen wir zwanzig. Ich übertreibe immer, das ist mein Stil. #sprecher:dime
- "remis":
    Remis. Fünf Cent für jeden. Ich schreib's an. #sprecher:dime
- else:
    Gewonnen hab ich. Aber du hast gespielt, und das zählt hier. Wer spielt, kennt den nächsten Springer. #sprecher:dime
}
Noch eine? #sprecher:dime
-> spielen

=== spur_pm1 ===
{gefundenSpurPM1:
    Die Drohne steht wieder über dem Wasser. Sie hat Geduld. #sprecher:erzaehler
    -> END
}
Über dem Kanal steht eine Drohne. Auf der Unterseite leuchtet ein Logo: Perfect Move. #sprecher:erzaehler
Sie dreht sich langsam zu den Klapptischen, als würde sie zuschauen. #sprecher:erzaehler
~ gibFund("spurPM1")
~ spurenPM = spurenPM + 1
-> END

=== seite07 ===
{gefundenSeite07:
    Am Ufer liegt nur noch Kies. #sprecher:erzaehler
    -> END
}
Zwischen den Steinen am Kanalufer klemmt ein Blatt, trocken und sauber. #sprecher:erzaehler
Eine lose Seite voller Schachdiagramme. #sprecher:erzaehler
~ gibFund("seite07")
~ buchseiten = buchseiten + 1
-> END

=== finch_laeufer_a ===
{gefundenFinchLaeuferA:
    Am Brückenfuß hängt nur noch der kleine Fink aus Blech. #sprecher:erzaehler
    -> END
}
Am Brückenfuß hängt ein kleiner Fink aus Blech. Darunter, im Spalt zwischen zwei Steinen, steckt ein weißer Läufer aus hellem Holz. #sprecher:erzaehler
~ gibFund("finchLaeuferA")
~ finchFiguren = finchFiguren + 1
-> END

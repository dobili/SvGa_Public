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
// Knoten zeitnot_trick: die Karte „Großes Maul“ (Schritt 13, docs/spiel/10, S1). Der Buchbezug ist ein
// einziger Satz aus Kapitel 12, Abschnitt 12.5, mit Fundstelle.
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
    {~Der Kanal friert bald zu. Dann gehen die Kinder darauf Schlittschuh laufen und spielen am Ufer Schach.|Überleg vorher. Ich sag das meinen Kühen auch, aber die hören nicht zu.} #sprecher:dale
    -> END
}
~ daleGetroffen = true
An einem Zaun lehnt ein Mann in Latzhose und schaut auf den Kanal. Hinter ihm grasen drei Kühe. #sprecher:erzaehler
Dale. Ich hab hier früher Gemüse an die Fabriken verkauft. #sprecher:dale
Jetzt verkaufe ich nichts, ich schaue nur. #sprecher:dale
Ein Bauer zieht nie zurück. Also überleg vorher. #sprecher:dale
Sagt mein Enkel. Der spielt Schach, ich baue Zäune. #sprecher:dale
Ein Landwirt, der Bauern versteht. Das ist naheliegend und trotzdem selten. #sprecher:ambrose #stimmung:lacht
-> END

// ---------------------------------------------------------------- Rätseltafel

=== tafel ===
{wegRivertonIronwoodTafelBestanden:
    Unter dem Fahrplan der Haltestelle steht in Kreide: „Gelöst. Der Bus kommt trotzdem nicht.“ #sprecher:erzaehler
    -> END
}
An einer Bushaltestelle ohne Bus hängt eine Tafel mit zwei Diagrammen: „Was festgenagelt ist, kann nicht weg.“ #sprecher:erzaehler
Fesselungen. Eine Figur, die stehen bleiben muss, weil hinter ihr etwas Wertvolleres steht. #sprecher:ambrose
* [Die Aufgaben lösen]
    ~ beginneAufgaben("wegRivertonIronwood.tafel")
    -> END
* [Weitergehen]
    -> END

// ---------------------------------------------------------------- Funde

=== fund_zahnrad ===
{zahnradGefunden:
    Am Zaun der leeren Fabrik hängt nur noch Rost. #sprecher:erzaehler
    -> END
}
~ zahnradGefunden = true
Am Zaun einer leeren Fabrik liegt ein Zahnrad, so groß wie eine Hand. #sprecher:erzaehler
~ gibFund("zahnrad")
Ein Rad, das kein anderes mehr dreht. Wie traurig für ein Rad. #sprecher:ambrose
-> END

=== fund_nietenkopf ===
{nietenkopfGefunden:
    Am Brückengeländer sitzen die Nieten in langen Reihen, eine fehlt. #sprecher:erzaehler
    -> END
}
~ nietenkopfGefunden = true
Am Geländer der Eisenbrücke hat sich ein Nietenkopf gelöst. Eingeprägt sind zwei Buchstaben: J. H. #sprecher:erzaehler
~ gibFund("nietenkopf")
J. H.? Wer ist das? Ambrose, kennst du das? #sprecher:juno
Ambrose schweigt. Sehr lange. #sprecher:erzaehler #pause
-> END

// ---------------------------------------------------------------- Der Zeitnot-Trick

=== zeitnot_trick ===
{zeitnotTrickErhalten:
    Der Wind pfeift durch die Brücke. Unten im Tal raucht das Stahlwerk. #sprecher:erzaehler
    -> END
}
~ zeitnotTrickErhalten = true
Mitten auf der Eisenbrücke bleibt Ambrose stehen, wenn man das so nennen kann. Der Wind zerrt an deiner Jacke. #sprecher:erzaehler
Ich zeige dir einen Trick aus dem Kaffeehaus. Man tat so, als brenne die Kerze des Gegners schon herunter. #sprecher:ambrose
Er glaubte es, und er eilte. Wer eilt, übersieht. #sprecher:ambrose
* [„Ist das nicht Schummeln?“]
    Es ist Theater. Der Gegner sieht dieselbe Uhr wie du. #sprecher:ambrose
    Ich rücke nichts, ich verrate nichts. #sprecher:ambrose
* [„Und wenn ich selbst in Zeitnot bin?“]
    Dann hilft dir kein Theater. Dann hilft nur Übung. #sprecher:ambrose
- Und der ehrliche Teil: Ist bloß dein Gegner in Zeitnot, blitze nicht mit. Nutze die Zeit, die du hast. #sprecher:ambrose
Nimm diese Karte. Einmal, und nur wenn die Uhr läuft. #sprecher:ambrose
Eine Goldnadel bekommst du damit nicht. #sprecher:ambrose
~ gibKarte("grossesMaul")
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
Tief unten liegt ein graues Tal. Aus zwei Schornsteinen steigt Rauch, und der Wind trägt ein fernes Hämmern herauf. #sprecher:erzaehler
Von hier oben sieht jede Stadt aus wie eine Stellung. Man erkennt erst unten, wer wo steht. #sprecher:ambrose
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
* [Später nachdenken]
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
* [Später]
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

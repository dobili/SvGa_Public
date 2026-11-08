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
// Knoten zeitnot_trick als Platzhalter die Karte „zeitbonus“ (Bericht). Der Buchbezug ist ein
// einziger Satz aus Kapitel 12, Abschnitt 12.5, mit Fundstelle.
// Variablen: wegRivertonIronwoodTafelBestanden setzt die Hülle (Langform, R42).

EXTERNAL beginneAufgaben(runde)
EXTERNAL gibFund(kennung)
EXTERNAL gibKarte(kennung)

VAR wegRivertonIronwoodTafelBestanden = false
VAR daleGetroffen = false
VAR zahnradGefunden = false
VAR nietenkopfGefunden = false
VAR zeitnotTrickErhalten = false

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
Steht in Kapitel 5 von so einem Schachbuch, sagt mein Enkel. #sprecher:dale
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
- Und der ehrliche Teil, aus dem Buch: „Ist bloß dein Gegner in Zeitnot, blitze nicht mit, sondern nutze die Zeit, die du hast.“ Kapitel 12, Abschnitt 12.5. #sprecher:ambrose
Nimm diese Karte. Einmal, und nur wenn die Uhr läuft. #sprecher:ambrose
Eine Goldnadel bekommst du damit nicht. #sprecher:ambrose
~ gibKarte("zeitbonus")
-> END

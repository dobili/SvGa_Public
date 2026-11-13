// Weg 4 von Ironwood nach Silicon Bay: Karten „Raststätte“ und „Glasbrücke“ (Akt 3, Szene 52 der
// Story-Bibel, Abschnitt 19.1). Der Bus hält an der Raststätte, den Rest geht {held} zu Fuß.
//
// Stationen (W4): Fernfahrerin Mrs. Kowalczyk mit einer Weisheit (Kapitel 1, Abschnitt 1.2),
// Rätseltafel am Kaffeeautomaten (Runde wegIronwoodSilicon.tafel, Quest
// wegIronwoodSilicon.tafelRaststaette), die Joggerin als Straßengegnerin mit Uhr 3 + 2 (Begegnung
// wegIronwoodSilicon.joggerin; immun gegen „Großes Maul“), Funde Werbe-Anstecker und Ohrstöpsel.
// Einstiege wie in orte.json: kowalczyk, joggerin, zurueck_ironwood, tafel, fund_anstecker,
// fund_ohrstoepsel. Die Ankunft in Silicon Bay erzählt silicon-bay-aussen.ankunft_zu_fuss.
//
// Runde 11 (13.11.2026): an den Roman angeglichen (roman/akt3_teil1.md, Kapitel 30): Mrs. Kowalczyk
// („Erst laden, dann fahren“), die Glasbrücke als Gegenstück zur Eisenbrücke, der Ohrstöpsel in der
// Mitte der Brücke. Klang nach 21_Klangplan.md (Akt 3). Keine Hinweise auf ein Buch (Entscheidung
// vom 13.11.2026).
//
// Variablen: ausgangWegIronwoodSiliconJoggerin und wegIronwoodSiliconTafelBestanden setzt die
// Hülle (R42), „abgebrochen“ zählt wie nicht gespielt (R35). Die Funde (Anstecker, Ohrstöpsel)
// gibt gibFund; Ink merkt sie sich zusätzlich selbst. ohrstoepselGefunden
// liest auch silicon-bay-serverraum.ink.

EXTERNAL beginnePartie(begegnung)
EXTERNAL beginneAufgaben(runde)
EXTERNAL gibFund(kennung)

VAR held = "Du"
VAR glasbrueckeGesehen = false
VAR buchseiten = 0
VAR finchFiguren = 0
VAR kreideTreffpunkte = 0
VAR spurenPM = 0
VAR wegIronwoodSiliconTafelBestanden = false
VAR ausgangWegIronwoodSiliconJoggerin = ""
VAR kowalczykGetroffen = false
VAR joggerinGetroffen = false
VAR ansteckerGefunden = false
VAR ohrstoepselGefunden = false
VAR wegIronwoodSiliconStreamBestanden = false
VAR ausgangWegIronwoodSiliconStream = ""
VAR streamGesehen = false
VAR streamBelohnt = false
VAR kreide2Gefunden = false
VAR finchBauerBGefunden = false
VAR seite04Gefunden = false

// ---------------------------------------------------------------- Mrs. Kowalczyk

=== kowalczyk ===
{kowalczykGetroffen:
    {~Silicon Bay? Da parkt keiner. Da fährt alles von allein.|Erst die Figuren raus. Dann die Dame.|Ich fahr gleich weiter. Neun Stunden bis zur Küste.} #sprecher:kowalczyk
    -> END
}
~ kowalczykGetroffen = true
Eine Fernfahrerin mit Armen wie Big Joe sieht dir zu, wie du in die erste Falle der Tafel hineintrittst. #sprecher:erzaehler
Erst die Figuren raus. Dann die Dame. #sprecher:kowalczyk
Ich fahr seit dreißig Jahren. Erst laden, dann fahren. Ist dasselbe. #sprecher:kowalczyk
Sie heißt Kowalczyk. Du fragst nicht, ob sie mit jemandem verwandt ist. #sprecher:erzaehler
-> END

// ---------------------------------------------------------------- Rätseltafel

=== tafel ===
{wegIronwoodSiliconTafelBestanden:
    Auf der Tafel am Automaten steht in Filzstift: „Gelöst. Kaffee ist trotzdem kaputt.“ #sprecher:erzaehler
    -> END
}
Am Kaffeeautomaten hängt eine Blechtafel mit Magnetfiguren, wie am Ortsausgang von Maple Falls: „Wer hier hängt, verliert.“ #sprecher:erzaehler
+ [Die Aufgaben lösen]
    ~ beginneAufgaben("wegIronwoodSilicon.tafel")
    -> END
* [Weitergehen]
    -> END

// ---------------------------------------------------------------- Die Joggerin

=== joggerin ===
{
- not joggerinGetroffen: -> joggerin_erstes_treffen
- ausgangWegIronwoodSiliconJoggerin == "" or ausgangWegIronwoodSiliconJoggerin == "abgebrochen": -> joggerin_angebot
- ausgangWegIronwoodSiliconJoggerin == "niederlage": -> joggerin_nach_niederlage
- else: -> joggerin_nach_sieg
}

=== joggerin_erstes_treffen ===
~ joggerinGetroffen = true
Auf der Glasbrücke läuft eine Frau auf der Stelle. Ihre Uhr am Handgelenk piept ohne Pause. #sprecher:erzaehler
Schach? Klar. Drei Minuten, plus zwei Sekunden. Mein Puls bleibt oben. #sprecher:joggerin
Sie ist schneller als du. Aber du bist schlauer. Vielleicht. #sprecher:juno
-> joggerin_angebot

=== joggerin_angebot ===
Eine Stellung, zehn Züge, die Uhr läuft. Bereit? #sprecher:joggerin
Sie läuft schnell und denkt schnell. Lass sie laufen, {held}. Denk du. #sprecher:ambrose
+ [„Los.“]
    ~ beginnePartie("wegIronwoodSilicon.joggerin")
    -> END
* [„Nicht jetzt.“]
    Ich lauf noch zwei Runden. #sprecher:joggerin
    -> END

=== joggerin_nach_niederlage ===
Puls bei hundertsechzig, Partie gewonnen. Guter Tag. #sprecher:joggerin
Sie hat schneller gezogen, nicht besser. Noch einmal, und diesmal in deinem Takt. #sprecher:ambrose
+ [„Noch einmal.“]
    ~ beginnePartie("wegIronwoodSilicon.joggerin")
    -> END
* [„Nicht jetzt.“]
    -> END

=== joggerin_nach_sieg ===
{~Du hast mich ausgebremst. Respekt.|Nächstes Mal lauf ich vorher weniger.|Meine Uhr sagt, ich soll mich ausruhen. Deine sagt, du hast gewonnen.} #sprecher:joggerin
+ [„Noch eine Runde?“]
    ~ beginnePartie("wegIronwoodSilicon.joggerin")
    -> END
+ [„Bis bald.“]
    -> END

// ---------------------------------------------------------------- Rückweg

=== zurueck_ironwood ===
An der Raststätte wartet der Bus zurück nach Ironwood. Der Fahrer winkt. #sprecher:erzaehler
-> END

// ---------------------------------------------------------------- Funde

=== fund_anstecker ===
{ansteckerGefunden:
    Hier lag der Anstecker. Jetzt nur noch Kaffeeflecken. #sprecher:erzaehler
    -> END
}
~ ansteckerGefunden = true
~ gibFund("anstecker")
Auf dem Boden glänzt ein Anstecker: „ZERO – Spiel wie die Zukunft.“ #sprecher:erzaehler
Gratis. Natürlich. #sprecher:juno
-> END

=== fund_ohrstoepsel ===
// Kapitel 30: Der Stöpsel liegt in der Mitte der Brücke; der Held steckt ihn ein, ohne zu wissen,
// warum. Ambrose sagt nichts dazu (er freut sich auf die Stadt).
{ohrstoepselGefunden:
    Auf dem Glas ist nichts mehr. Unter dir fließen die Lichter der Autobahn. #sprecher:erzaehler
    -> END
}
~ ohrstoepselGefunden = true
In der Mitte der Brücke liegt etwas auf dem Glas. Klein, hautfarben, wie ein Kieselstein. Ein Ohrstöpsel. #sprecher:erzaehler
Er ist schwerer, als er sein sollte. An einer Seite ist ein winziges Loch, darin glänzt etwas Metallenes. #sprecher:erzaehler
Hat jemand verloren. #sprecher:juno
~ gibFund("ohrstoepsel")
~ gibFund("spurPM2")
~ spurenPM = spurenPM + 1
Du steckst ihn ein. Du hast dir angewöhnt, Dinge einzustecken. #sprecher:erzaehler
-> END

// Kapitel 30: die Glasbrücke als Gegenstück zur Eisenbrücke. Läuft beim Übergang vom Rastplatz
// auf die Brücke (orte.json, weiterGlasbruecke); ab dem zweiten Mal nur ein Satz.
=== glasbruecke ===
{glasbrueckeGesehen:
    Glas unter den Schuhen. Zwölf Meter tiefer die Autobahn, ein Fluss aus weißen und roten Lichtern. #sprecher:erzaehler
    -> END
}
~ glasbrueckeGesehen = true
Die Brücke ist aus Glas. Der Boden, das Geländer, alles. Zwölf Meter tiefer fließen die Lichter der Autobahn. #sprecher:erzaehler
Juno geht auf Zehenspitzen und hält sich an dir fest. Woher weißt du, dass das trägt? #sprecher:juno
* [„Das trägt.“]
* [„Ich weiß es nicht.“]
- Du denkst an eine andere Brücke, aus schwarzem Eisen, mit Tausenden von Nieten, jede signiert. An der hast du nicht gezweifelt. #sprecher:erzaehler
-> END

// ---------------------------------------------------------------- Ereignis: Live auf der Glasbrücke
// Runde 6 (Dokument 15, 2.4): Kiki Blitz streamt auf der Aussichtsplattform. Bis die Partie mit
// Kandidatenwahl gebaut ist (mittel-2), spielt {held} eine Aufgabenrunde zu Fallen (Kapitel 4).
// Quest wegIronwoodSilicon.stream; Lohn Fund fotoLive. Spur P2 kommt mit dem Ohrstöpsel.

=== kiki ===
-> ereignis_stream

=== ereignis_stream ===
{streamBelohnt: -> stream_danach}
{ausgangWegIronwoodSiliconStream == "sieg" or ausgangWegIronwoodSiliconStream == "remis" or ausgangWegIronwoodSiliconStream == "niederlage": -> stream_ende}
{wegIronwoodSiliconStreamBestanden: -> stream_partie}
{streamGesehen: -> stream_angebot}
~ streamGesehen = true
Auf der Aussichtsplattform steht ein Ringlicht, daneben ein Klapptisch mit Laptop. Eine junge Frau mit grüner Mütze spricht in eine Kamera. #sprecher:erzaehler
Achtzigtausend Leute schauen zu, und da kommt jemand über die Brücke! #sprecher:kiki #stimmung:froh
Kiki Blitz. Ich spiele live, und heute wählt der Chat meine Züge. Drei Vorschläge, einer davon ist Unsinn. #sprecher:kiki
-> stream_angebot

=== stream_angebot ===
Der Chat liebt Fallen. Wenn er dir eine stellt, sieh sie. Wenn er sich selbst eine stellt, bestraf sie. Spielst du mit? #sprecher:kiki
Fallen erkennt man, bevor man hineintritt, {held}. #sprecher:ambrose
+ [„Ich spiele mit.“]
    ~ beginneAufgaben("wegIronwoodSilicon.stream")
    -> END
+ [„Nicht jetzt.“]
    Der Stream läuft bis heute Abend. Komm wieder! #sprecher:kiki
    -> END

=== stream_partie ===
// Partie mit Kandidatenwahl (mittel-2): Nach 1.e4 e5 2.Lc4 Sc6 3.Dh5 wählt der Chat zwischen g6, De7
// und Sf6. Sf6 ist der Fehler: Dxf7 ist matt (Kapitel 4, Fallenkabinett).
Aufgewärmt? Jetzt live. Weiß hat die Dame schon draußen, und der Chat stimmt über meinen Zug ab. #sprecher:kiki #stimmung:froh
Einer der drei Vorschläge ist eine Falle, {held}. Nicht für dich. Für sie. #sprecher:ambrose
+ [„Los geht's.“]
    ~ beginnePartie("wegIronwoodSilicon.stream")
    -> END
+ [„Gleich.“]
    Der Chat wartet nicht gern. Aber gut. #sprecher:kiki
    -> END

=== stream_ende ===
~ streamBelohnt = true
{ausgangWegIronwoodSiliconStream == "sieg":
    Der Chat hat mich reingelegt. Und du hast es gesehen! #sprecher:kiki #stimmung:lacht
- else:
    Gut gespielt! Der Chat war heute auf meiner Seite. #sprecher:kiki #stimmung:froh
}
Der Chat jubelt. Dann friert das Bild auf dem Laptop ein. Am Funkmast neben der Brücke blinkt eine rote Leuchte: „Testfeld Signal“. #sprecher:erzaehler
Das ist jedes Mal so, wenn die da testen. Perfect Move sponsert mich. Ich frage lieber nicht, was sie testen. #sprecher:kiki #stimmung:still
Ein Mast, der blinkt, wenn Bilder abreißen. Merk ihn dir. #sprecher:ambrose
Hier, ein Foto vom Ringlicht, signiert. Der Chat mochte dich. #sprecher:kiki #stimmung:froh
~ gibFund("fotoLive")
-> END

=== stream_danach ===
{~Der Chat fragt nach dir. Ich sage, du bist auf Reisen.|Das Signal bricht immer noch ab. Ich hab mich fast daran gewöhnt.|Spielst du bei der Meisterschaft? Vielleicht sitze ich im Publikum.} #sprecher:kiki
-> END

// ---------------------------------------------------------------- Sammelstellen an der Raststätte

=== kreide2 ===
{kreide2Gefunden:
    Der Kreidespringer am Container ist ein wenig verwischt. Das Wort darunter auch. #sprecher:erzaehler
    -> END
}
~ kreide2Gefunden = true
An der Wand des Containers hinter dem Rasthaus ist ein Springer aus Kreide gemalt. #sprecher:erzaehler
Darunter, ganz klein: „K2. Wer das Wort kennt, spielt mit.“ #sprecher:erzaehler
Ein Club ohne Haus. Die besten Clubs, die ich kannte, hatten nur einen Tisch und einen Ofen. #sprecher:ambrose
~ gibFund("kreide2")
~ kreideTreffpunkte = kreideTreffpunkte + 1
-> END

=== finch_bauer_b ===
{finchBauerBGefunden:
    Im Blumenkübel wachsen nur noch Blumen. #sprecher:erzaehler
    -> END
}
~ finchBauerBGefunden = true
Am Rand des Blumenkübels klebt ein kleiner Fink aus Blech. #sprecher:erzaehler
Zwischen den Stielen steckt ein weißer Bauer aus Buchsbaum. Unter seinem Fuß ist ein Feld eingebrannt. #sprecher:erzaehler
~ gibFund("finchBauerB")
~ finchFiguren = finchFiguren + 1
-> END

=== seite04 ===
{seite04Gefunden:
    Hier lag die Seite. Der Wind hat nichts mehr dagelassen. #sprecher:erzaehler
    -> END
}
~ seite04Gefunden = true
Unter der Rätseltafel klemmt ein loses Blatt, vom Wind hergeweht. Darauf eine gezeichnete Stellung. #sprecher:erzaehler
Jemand hat hier in der Pause gerechnet. Heb es auf. #sprecher:ambrose
~ gibFund("seite04")
~ buchseiten = buchseiten + 1
-> END

// ---------------------------------------------------------------- Ansehen auf der Glasbrücke (Runde 6)

=== schild_smart_city ===
Am Fuß der Rampe steht ein Schild: „Ab hier: Smart City. Bitte Sensoren nicht verdecken.“ #sprecher:erzaehler
Welche Sensoren? Ich sehe nur Glas. Schönes Glas, das gebe ich zu. #sprecher:ambrose
-> END

=== werbetafel_zero ===
Auf der Werbetafel am Stadtrand dreht sich ein gläserner König, dann erscheint die Schrift: „ZERO. Nie wieder Fehler.“ #sprecher:erzaehler
Aus Fehlern habe ich alles gelernt, was ich weiß. Was lernt man aus gar nichts? #sprecher:ambrose
-> END


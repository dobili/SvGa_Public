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
// Variablen: ausgangWegIronwoodSiliconJoggerin und wegIronwoodSiliconTafelBestanden setzt die
// Hülle (R42), „abgebrochen“ zählt wie nicht gespielt (R35). Die Funde (Anstecker, Ohrstöpsel)
// gibt gibFund; Ink merkt sie sich zusätzlich selbst. ohrstoepselGefunden
// liest auch silicon-bay-serverraum.ink.

EXTERNAL beginnePartie(begegnung)
EXTERNAL beginneAufgaben(runde)
EXTERNAL gibFund(kennung)

VAR held = "Du"
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
VAR streamGesehen = false
VAR streamBelohnt = false
VAR kreide2Gefunden = false
VAR finchBauerBGefunden = false
VAR seite04Gefunden = false

// ---------------------------------------------------------------- Mrs. Kowalczyk

=== kowalczyk ===
{kowalczykGetroffen:
    {~Silicon Bay? Da parkt keiner. Da fährt alles von allein.|Erst die Figuren raus, Kind. Dann die Dame. Merk dir das.|Ich fahr gleich weiter. Neun Stunden bis zur Küste.} #sprecher:kowalczyk
    -> END
}
~ kowalczykGetroffen = true
Am Kaffeeautomaten lehnt eine Frau in Latzhose. Auf ihrer Tasse steht „Königin der Landstraße“. #sprecher:erzaehler
Du spielst Schach? Mein Vater hat's mir im Führerhaus beigebracht. #sprecher:kowalczyk
Er hat immer gesagt: Erst die Figuren raus, dann die Dame. Sonst jagen sie dir die Dame übers Brett. #sprecher:kowalczyk
Das steht in Kapitel 1, Abschnitt 1.2. Die Dame zu früh, das ist eine Todsünde. #sprecher:kowalczyk
Eine Kutscherin mit Verstand. Die Landstraße erzieht gut. #sprecher:ambrose
-> END

// ---------------------------------------------------------------- Rätseltafel

=== tafel ===
{wegIronwoodSiliconTafelBestanden:
    Auf der Tafel am Automaten steht in Filzstift: „Gelöst. Kaffee ist trotzdem kaputt.“ #sprecher:erzaehler
    -> END
}
Neben dem Kaffeeautomaten hängt eine Tafel: „Wer hier hängt, verliert. Drei Stellungen für die Pause.“ #sprecher:erzaehler
Hängende Figuren. Die erste Frage vor jedem Zug, {held}. Du kennst sie. #sprecher:ambrose
* [Die Aufgaben lösen]
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
Juno hält dir die Daumen hoch: „Sie ist schneller als du. Aber du bist schlauer. Vielleicht.“ #sprecher:juno
-> joggerin_angebot

=== joggerin_angebot ===
Eine Stellung, zehn Züge, die Uhr läuft. Bereit? #sprecher:joggerin
Sie läuft schnell und denkt schnell. Lass sie laufen, {held}. Denk du. #sprecher:ambrose
* [„Los.“]
    ~ beginnePartie("wegIronwoodSilicon.joggerin")
    -> END
* [„Später.“]
    Ich lauf noch zwei Runden. #sprecher:joggerin
    -> END

=== joggerin_nach_niederlage ===
Puls bei hundertsechzig, Partie gewonnen. Guter Tag. #sprecher:joggerin
Sie hat schneller gezogen, nicht besser. Noch einmal, und diesmal in deinem Takt. #sprecher:ambrose
* [„Noch einmal.“]
    ~ beginnePartie("wegIronwoodSilicon.joggerin")
    -> END
* [„Später.“]
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
{ohrstoepselGefunden:
    Auf dem Geländer der Brücke ist nichts mehr. #sprecher:erzaehler
    -> END
}
~ ohrstoepselGefunden = true
~ gibFund("ohrstoepsel")
~ gibFund("spurPM2")
~ spurenPM = spurenPM + 1
Am Geländer klemmt ein winziger, schwarzer Ohrstöpsel. Er ist schwerer, als er aussieht. #sprecher:erzaehler
Für einen Ohrstöpsel ist er sehr schwer. Behalte ihn, {held}. #sprecher:ambrose
-> END

// ---------------------------------------------------------------- Ereignis: Live auf der Glasbrücke
// Runde 6 (Dokument 15, 2.4): Kiki Blitz streamt auf der Aussichtsplattform. Bis die Partie mit
// Kandidatenwahl gebaut ist (mittel-2), spielt {held} eine Aufgabenrunde zu Fallen (Kapitel 4).
// Quest wegIronwoodSilicon.stream; Lohn Fund fotoLive. Spur P2 kommt mit dem Ohrstöpsel.

=== ereignis_stream ===
{streamBelohnt: -> stream_danach}
{wegIronwoodSiliconStreamBestanden: -> stream_ende}
{streamGesehen: -> stream_angebot}
~ streamGesehen = true
Auf der Aussichtsplattform steht ein Ringlicht, daneben ein Klapptisch mit Laptop. Eine junge Frau mit grüner Mütze spricht in eine Kamera. #sprecher:erzaehler
Achtzigtausend Leute schauen zu, und da kommt jemand über die Brücke! #sprecher:kiki #stimmung:froh
Kiki Blitz. Ich spiele live, und heute wählt der Chat meine Züge. Drei Vorschläge, einer davon ist Unsinn. #sprecher:kiki
-> stream_angebot

=== stream_angebot ===
Der Chat liebt Fallen. Wenn er dir eine stellt, sieh sie. Wenn er sich selbst eine stellt, bestraf sie. Spielst du mit? #sprecher:kiki
Kapitel 4, {held}: Fallen erkennen, bevor man hineintritt. #sprecher:ambrose
+ [„Ich spiele mit.“]
    ~ beginneAufgaben("wegIronwoodSilicon.stream")
    -> END
+ [„Später.“]
    Der Stream läuft bis heute Abend. Komm wieder! #sprecher:kiki
    -> END

=== stream_ende ===
~ streamBelohnt = true
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
An der Wand des Containers hinter dem Rasthaus ist ein Springer aus Kreide gemalt. Darunter, ganz klein: „K2. Wer das Wort kennt, spielt mit.“ #sprecher:erzaehler
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
Am Rand des Blumenkübels klebt ein kleiner Fink aus Blech. Zwischen den Stielen steckt ein weißer Bauer aus Buchsbaum. Unter seinem Fuß ist ein Feld eingebrannt. #sprecher:erzaehler
~ gibFund("finchBauerB")
~ finchFiguren = finchFiguren + 1
-> END

=== seite04 ===
{seite04Gefunden:
    Hier lag die Buchseite. Der Wind hat nichts mehr dagelassen. #sprecher:erzaehler
    -> END
}
~ seite04Gefunden = true
Unter der Rätseltafel klemmt ein Blatt Papier, vom Wind hergeweht. Oben steht: Kapitel 4, „Das Fallenkabinett“. #sprecher:erzaehler
Eine Seite aus einem Handbuch. Jemand vermisst sie bestimmt. #sprecher:ambrose
~ gibFund("seite04")
~ buchseiten = buchseiten + 1
-> END


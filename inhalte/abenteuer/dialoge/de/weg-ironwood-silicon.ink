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
VAR wegIronwoodSiliconTafelBestanden = false
VAR ausgangWegIronwoodSiliconJoggerin = ""
VAR kowalczykGetroffen = false
VAR joggerinGetroffen = false
VAR ansteckerGefunden = false
VAR ohrstoepselGefunden = false

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
Am Geländer klemmt ein winziger, schwarzer Ohrstöpsel. Er ist schwerer, als er aussieht. #sprecher:erzaehler
Für einen Ohrstöpsel ist er sehr schwer. Behalte ihn, {held}. #sprecher:ambrose
-> END

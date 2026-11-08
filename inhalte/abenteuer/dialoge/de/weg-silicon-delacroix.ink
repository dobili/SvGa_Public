// Weg 5 von Silicon Bay nach Port Delacroix: Karten „Fähre“ und „Deich“ (Akt 3, Szene 62 der
// Story-Bibel, Abschnitt 19.3).
//
// Stationen (W4): Rätseltafel im Salon (Runde wegSiliconDelacroix.tafel), Schiffskoch Mr. Ruiz als
// Straßengegner mit Uhr (Begegnung wegSiliconDelacroix.schiffskoch, Schnellschach 10 + 5, Sprüche
// erlaubt), Mr. Guidry am Deich mit einer Weisheit (Kapitel 5), Funde Flaschenpost und Muschel.
// Mama fährt mit (Helferin im Notzelt). Ambrose wird unruhig, je näher die Küste kommt.
// Einstiege wie in orte.json: schiffskoch, guidry, zurueck_silicon, tafel, fund_flaschenpost,
// fund_muschel.
//
// Funde: In funde.json gibt es für Akt 3 noch keine Einträge; die Aufrufe stehen als Kommentar
// bereit (Bericht mittel-1, fünfzehnter Auftrag), bis dahin merkt sich Ink den Fund selbst.
// Variablen: ausgangWegSiliconDelacroixSchiffskoch und wegSiliconDelacroixTafelBestanden setzt die
// Hülle (R42); „abgebrochen“ zählt wie nicht gespielt (R35).

EXTERNAL beginnePartie(begegnung)
EXTERNAL beginneAufgaben(runde)

VAR ausgangWegSiliconDelacroixSchiffskoch = ""
VAR wegSiliconDelacroixTafelBestanden = false
VAR ruizGetroffen = false
VAR guidryGetroffen = false
VAR flaschenpostGefunden = false
VAR muschelGefunden = false

// ---------------------------------------------------------------- Mr. Ruiz, der Schiffskoch

=== schiffskoch ===
{
- not ruizGetroffen: -> ruiz_erstes_treffen
- ausgangWegSiliconDelacroixSchiffskoch == "" or ausgangWegSiliconDelacroixSchiffskoch == "abgebrochen": -> ruiz_angebot
- ausgangWegSiliconDelacroixSchiffskoch == "niederlage": -> ruiz_nach_niederlage
- else: -> ruiz_nach_sieg
}

=== ruiz_erstes_treffen ===
~ ruizGetroffen = true
In der Kombüse rührt ein Mann mit Kochmütze in einem Topf. Auf der Arbeitsplatte steht ein Brett zwischen Zwiebeln. #sprecher:erzaehler
Ruiz, Schiffskoch. Zwei Tage bis Port Delacroix, und keiner an Bord spielt mit mir. #sprecher:schiffskoch
Mama lehnt in der Tür. „Spiel ruhig. Ich hol uns Kaffee.“ #sprecher:erzaehler
-> ruiz_angebot

=== ruiz_angebot ===
Zehn Minuten und fünf Sekunden je Zug, solange die Suppe zieht. Eine Stellung, du hast Weiß. #sprecher:schiffskoch
* [„Abgemacht.“]
    ~ beginnePartie("wegSiliconDelacroix.schiffskoch")
    -> END
* [„Nach dem Essen.“]
    Gute Antwort. Die Suppe ist wichtiger. #sprecher:schiffskoch
    -> END

=== ruiz_nach_sieg ===
Du spielst, wie ich koche: nicht zu schnell, nicht zu langsam. Noch eine? #sprecher:schiffskoch
+ [„Noch eine.“]
    ~ beginnePartie("wegSiliconDelacroix.schiffskoch")
    -> END
+ [„Später.“]
    -> END

=== ruiz_nach_niederlage ===
Angebrannt. Passiert. Noch einmal, solange das Meer ruhig ist? #sprecher:schiffskoch
+ [„Revanche.“]
    ~ beginnePartie("wegSiliconDelacroix.schiffskoch")
    -> END
+ [„Später.“]
    -> END

// ---------------------------------------------------------------- Mr. Guidry am Deich

=== guidry ===
{guidryGetroffen:
    {~Jeder Sandsack zählt. Jeder Bauer auch.|Die Stadt steht wieder auf. Langsam. Aber sie steht.} #sprecher:guidry
    -> END
}
~ guidryGetroffen = true
Am Deich stapelt ein Mann Sandsäcke. Hinter ihm liegt die Stadt: abgedeckte Dächer, Bauzäune, aus einem Zelt klingt Musik. #sprecher:erzaehler
Guidry. Der Sturm hat uns erwischt, aber nicht umgeworfen. #sprecher:guidry
Ein Loch im Deich ist wie ein Loch in der Bauernkette. Man stopft es, bevor es größer wird. Kapitel 5, sagt meine Enkelin, die spielt Schach. #sprecher:guidry
Diese Luft. Salz und Holz. Ich kenne diese Luft. #sprecher:ambrose #stimmung:fern
-> END

// ---------------------------------------------------------------- Rätseltafel und Rückweg

=== tafel ===
{wegSiliconDelacroixTafelBestanden:
    Auf der Tafel im Salon hat jemand mit Kreide eine Möwe gemalt. Darunter: „Gelöst“. #sprecher:erzaehler
    -> END
}
Im Salon der Fähre hängt eine Tafel mit drei Diagrammen: „Wer die Bauern versteht, versteht das Spiel.“ #sprecher:erzaehler
* [Die Aufgaben lösen]
    ~ beginneAufgaben("wegSiliconDelacroix.tafel")
    -> END
* [Weiter an Deck]
    -> END

=== zurueck_silicon ===
Die Fähre legt bald wieder ab, zurück nach Silicon Bay. #sprecher:erzaehler
-> END

// ---------------------------------------------------------------- Funde

=== fund_flaschenpost ===
{flaschenpostGefunden:
    An der Reling glitzert nur noch Gischt. #sprecher:erzaehler
    -> END
}
~ flaschenpostGefunden = true
Zwischen zwei Rettungsringen klemmt eine Flasche mit einem gerollten Zettel darin. Darauf ein Schachdiagramm und „Wer findet den Zug?“. #sprecher:erzaehler
// ~ gibFund("flaschenpost")  (Fund fehlt noch in funde.json)
Jemand hat ein Rätsel ins Meer geworfen. Das ist die schönste Art, Post zu verschicken. #sprecher:ambrose
-> END

=== fund_muschel ===
{muschelGefunden:
    Am Deich liegen nur noch Kiesel. #sprecher:erzaehler
    -> END
}
~ muschelGefunden = true
Im Sand am Deich liegt eine Muschel mit einem kleinen, runden Loch, wie für eine Kette gemacht. #sprecher:erzaehler
// ~ gibFund("muschelMitLoch")  (Fund fehlt noch in funde.json)
Meine Schwester sammelte solche. Sie fädelte sie auf und trug sie sonntags. #sprecher:ambrose #stimmung:fern
-> END

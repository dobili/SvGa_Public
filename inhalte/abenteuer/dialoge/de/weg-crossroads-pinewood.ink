// Weg 9 von Crossroads nach Pinewood Camp: Karten „Schutzhütte“ und „Riesenbäume“ (Akt 4,
// Szene 94 der Story-Bibel, Abschnitt 29; Landschaft L2 Fernwanderweg, Weltbeschreibung 5.12, O3).
//
// Stationen (W4): Hüttenwirtin Greta mit Blindschach (Begegnung wegCrossroadsPinewood.blindschach,
// Gegner Ambrose; Buchbezug Kapitel 11, Varianten berechnen), Rätseltafel (Runde
// wegCrossroadsPinewood.tafel, Quest wegCrossroadsPinewood.tafelHuette), Rangerhaus mit
// Bärenspuren. Einstiege wie in orte.json: greta, zurueck_crossroads, tafel, rangerhaus. Die
// Ankunft im Camp erzählt pinewood-camp-aussen.ankunft_zu_fuss.
//
// Blindschach ist die erste gebaute Variante (Begegnungsfeld variante „blind“); sie zählt nie für
// Nadeln, Wertung oder die App. Ambrose ist der Gegner, weil er zwölf Jahre Fernpartien gespielt hat
// (Bibel Szene 94); Greta selbst hat kein Gegnerprofil.
// Variablen: wegCrossroadsPinewoodTafelBestanden und ausgangWegCrossroadsPinewoodBlindschach setzt
// die Hülle (R42); die übrigen setzt diese Datei.

EXTERNAL beginnePartie(begegnung)
EXTERNAL beginneAufgaben(runde)

VAR held = "Du"
VAR wegCrossroadsPinewoodTafelBestanden = false
VAR ausgangWegCrossroadsPinewoodBlindschach = ""
VAR gretaGetroffen = false
VAR varianteBlindschachGelernt = false

// ---------------------------------------------------------------- Greta und das Blindschach

=== greta ===
{
- not gretaGetroffen: -> greta_erstes_treffen
- ausgangWegCrossroadsPinewoodBlindschach == "sieg" or ausgangWegCrossroadsPinewoodBlindschach == "remis" or ausgangWegCrossroadsPinewoodBlindschach == "niederlage": -> greta_nach_partie
- else: -> greta_angebot
}

=== greta_erstes_treffen ===
~ gretaGetroffen = true
~ varianteBlindschachGelernt = true
Vor der Schutzhütte hackt eine Frau Holz. Auf der Bank daneben sitzen zwei Wanderer mit riesigen Rucksäcken und rufen sich Züge zu. #sprecher:erzaehler
„Springer f3.“ – „Hm. Bauer d5.“ Kein Brett weit und breit. #sprecher:erzaehler
Greta. Mir gehört die Hütte. Wer wochenlang wandert, trägt kein Brett. Also spielt man im Kopf. #sprecher:greta
Blindschach. Du sagst deinen Zug, ich sage meinen. Wer sich verzählt, verliert. #sprecher:greta
Ich habe zwölf Jahre lang Partien in Briefen gespielt. Das hier ist meine Heimat. #sprecher:ambrose #stimmung:friedlich
Kapitel 11, {held}: Varianten berechnen. Das Brett im Kopf ist dasselbe Brett. Nur leiser. #sprecher:ambrose
-> greta_angebot

=== greta_angebot ===
Der Geist da spielt doch, oder? Ich seh's dir an. Setz dich mit ihm auf die Bank. Ich schreib mit. #sprecher:greta
+ [Blindschach gegen Ambrose]
    Die Figuren verschwinden. Nur die Züge bleiben. #sprecher:erzaehler
    ~ beginnePartie("wegCrossroadsPinewood.blindschach")
    -> END
+ [„Später.“]
    Die Hütte steht seit hundert Jahren. Die läuft nicht weg. #sprecher:greta
    -> END

=== greta_nach_partie ===
{~Ich hab mitgeschrieben. Siebenundzwanzig Züge, kein einziger falscher. Fast.|Die Wanderer da reden nur noch von dir.|Suppe? Bohnen, wie jeden Tag.} #sprecher:greta
{ausgangWegCrossroadsPinewoodBlindschach == "niederlage":
    Verloren gegen einen, der seit hundertsechzig Jahren kein Brett mehr sieht. Keine Schande. #sprecher:ambrose #stimmung:lacht
}
+ [Noch eine Partie blind]
    ~ beginnePartie("wegCrossroadsPinewood.blindschach")
    -> END
+ [„Ich wandere weiter.“]
    Gute Wanderung. Die Bären sind satt um diese Zeit. Meistens. #sprecher:greta
    -> END

// ---------------------------------------------------------------- Rätseltafel

=== tafel ===
{wegCrossroadsPinewoodTafelBestanden:
    An der Hüttenwand steht mit Kohle: „Gelöst. Weiter so, Wanderer.“ #sprecher:erzaehler
    -> END
}
An der Hüttenwand hängt eine Schiefertafel: „Drei Stellungen. Erst rechnen, dann ziehen. Wie beim Wandern.“ #sprecher:erzaehler
Zwei Züge im Voraus. Was antwortet er, was ziehe ich dann? Rechne es zu Ende, {held}. #sprecher:ambrose
+ [Die Aufgaben lösen]
    ~ beginneAufgaben("wegCrossroadsPinewood.tafel")
    -> END
+ [Weitergehen]
    -> END

// ---------------------------------------------------------------- Rangerhaus und Weg

=== rangerhaus ===
{~Am Rangerhaus hängt ein Zettel: „Bärenspuren am Bach. Essen nicht offen lassen.“|Im Nebel zwischen den Riesenbäumen ist das Rangerhaus winzig wie eine Spielfigur.|Vor dem Rangerhaus ein Abdruck im Schlamm, so groß wie eine Pfanne.} #sprecher:erzaehler
Diese Bäume standen schon, als ich geboren wurde. Und sie stehen noch, wenn du alt bist. #sprecher:ambrose
-> END

=== zurueck_crossroads ===
Der Fernwanderweg führt zurück aus dem Wald, zur Kreuzung in der Prärie. #sprecher:erzaehler
-> END

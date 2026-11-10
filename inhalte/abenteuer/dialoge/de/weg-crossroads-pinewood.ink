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
EXTERNAL gibFund(kennung)

VAR held = "Du"
VAR buchseiten = 0
VAR kreideTreffpunkte = 0
VAR wegCrossroadsPinewoodTafelBestanden = false
VAR ausgangWegCrossroadsPinewoodBlindschach = ""
VAR gretaGetroffen = false
VAR varianteBlindschachGelernt = false
VAR wegCrossroadsPinewoodLebendschachBestanden = false
VAR lebendschachGesehen = false
VAR lebendschachBelohnt = false
VAR kreide4Gefunden = false
VAR seite10Gefunden = false
VAR finchFiguren = 0
VAR finchDameGefunden = false

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
Kapitel 7, {held}: Rechnen statt hoffen. Das Brett im Kopf ist dasselbe Brett. Nur leiser. #sprecher:ambrose
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

// ---------------------------------------------------------------- Ereignis: Lebendschach
// Runde 6 (Dokument 15, 2.11): Ezra und die Pfadfinder aus Pinewood Camp üben auf dem Rasenbrett.
// Bis die Brettansicht mit der Lichtung gebaut ist (mittel-2), eine Aufgabenrunde. Quest
// wegCrossroadsPinewood.lebendschach; Lohn Fund fotoLebendschach.

=== ereignis_lebendschach ===
{lebendschachBelohnt: -> lebendschach_danach}
{wegCrossroadsPinewoodLebendschachBestanden: -> lebendschach_ende}
{lebendschachGesehen: -> lebendschach_angebot}
~ lebendschachGesehen = true
Auf der Lichtung ist ein Brett aus Rasen und Kies ausgelegt. Dreißig Kinder in weißen und schwarzen Westen warten an den Rändern. #sprecher:erzaehler
Der Feldherr der Weißen liegt mit Fieber im Zelt. Du kommst wie gerufen. Kannst du kommandieren? #sprecher:ezra
-> lebendschach_angebot

=== lebendschach_angebot ===
Die Kinder ziehen erst, wenn sie den Zug laut hören. Und wer geschlagen werden soll, protestiert. #sprecher:ezra
Opfere niemanden ohne Not, {held}. Diese Figuren haben eine Stimme. #sprecher:ambrose
+ [„Ich kommandiere.“]
    ~ beginneAufgaben("wegCrossroadsPinewood.lebendschach")
    -> END
+ [„Später.“]
    Wir üben bis zum Sommerfest. Du findest uns hier. #sprecher:ezra
    -> END

=== lebendschach_ende ===
~ lebendschachBelohnt = true
Die weißen Kinder reißen die Arme hoch. Ein geschlagener schwarzer Bauer setzt sich ins Gras und ruft: „Ich war gerade so schön vorne!“ #sprecher:erzaehler
Gut kommandiert. Die Kinder wollen ein Foto mit dir. #sprecher:ezra #stimmung:froh
~ gibFund("fotoLebendschach")
-> END

=== lebendschach_danach ===
{~Die Kinder fragen, wann du wieder kommandierst.|Der Feldherr ist wieder gesund. Er sagt, du warst zu streng mit den Bauern.|Das Sommerfest wird groß. Komm, wenn du kannst.} #sprecher:ezra
-> END

=== seite10 ===
{seite10Gefunden:
    Hier lag die Buchseite. Zwischen den Wurzeln ist nichts mehr. #sprecher:erzaehler
    -> END
}
~ seite10Gefunden = true
Zwischen den Wurzeln eines Mammutbaums steckt ein Blatt Papier. Oben steht: Kapitel 10, „Studien und Kuriositäten“. #sprecher:erzaehler
Eine Seite aus einem Handbuch, an einem Baum, der älter ist als jedes Buch. #sprecher:ambrose
~ gibFund("seite10")
~ buchseiten = buchseiten + 1
-> END

// ---------------------------------------------------------------- Mammutbaum: Finchs Dame

=== finch_dame ===
{finchDameGefunden:
    In der Astgabel sitzt nur noch Moos. #sprecher:erzaehler
    -> END
}
~ finchDameGefunden = true
In der Astgabel eines Mammutbaums, gerade in Reichweite, glänzt ein kleiner Fink aus Blech. Darunter steckt eine weiße Dame aus Buchsbaum. Unter ihrem Fuß ist ein Feld eingebrannt. #sprecher:erzaehler
Die stärkste Figur, versteckt im ältesten Baum. Finch hatte Sinn für so etwas. #sprecher:ambrose
~ gibFund("finchDame")
~ finchFiguren = finchFiguren + 1
-> END

// ---------------------------------------------------------------- Holzfällerhütte: Kreidespringer K4

=== kreide4 ===
{kreide4Gefunden:
    Der Kreidespringer an der Hütte ist noch da. Jemand hat ihn nachgezogen. #sprecher:erzaehler
    -> END
}
~ kreide4Gefunden = true
An der Wand der Holzfällerhütte ist ein Springer aus Kreide gemalt. Darunter, klein: „K4. Wer das Wort kennt, spielt mit.“ #sprecher:erzaehler
Wieder dieser Springer. Er reist schneller als wir. #sprecher:ambrose
~ gibFund("kreide4")
~ kreideTreffpunkte = kreideTreffpunkte + 1
-> END


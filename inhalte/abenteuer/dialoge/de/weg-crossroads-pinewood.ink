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
// Kapitel 54 (Roman): Ambrose sieht die Stellung der Fernpartie nicht mehr im Dunkeln.
VAR esIstStillGesagt = false
VAR baeumeGesehen = false

// ---------------------------------------------------------------- Greta und das Blindschach

=== greta ===
{
- not gretaGetroffen: -> greta_erstes_treffen
- ausgangWegCrossroadsPinewoodBlindschach == "sieg" or ausgangWegCrossroadsPinewoodBlindschach == "remis" or ausgangWegCrossroadsPinewoodBlindschach == "niederlage": -> greta_nach_partie
- else: -> greta_angebot
}

=== greta_erstes_treffen ===
// Kapitel 54 (Roman): Blindschach auf der Bank; Ambrose sieht für {held}. Klang: nur Stimmen, die
// Züge sagen; Ambroses Thema ohne Begleitung.
~ gretaGetroffen = true
~ varianteBlindschachGelernt = true
An einer Hütte aus Stämmen sitzen Wanderer mit staubigen Stiefeln. Sie haben kein Brett. Aber sie spielen. #sprecher:erzaehler #musik:aus
Springer f3. #sprecher:greta
d5. #sprecher:erzaehler
Ein Mann sagt es, ohne die Augen zu öffnen. #sprecher:erzaehler
Wo ist das Brett? #sprecher:juno
Wer drei Wochen läuft, trägt kein Holz, das er nicht braucht. Das Brett ist da drin. #sprecher:greta
Sie tippt sich an die Stirn. Am ersten Tag sieht man nichts. Am dritten die Mitte. Nach einer Woche alles. Greta. Ich mach hier den Kaffee. #sprecher:greta
Sie lässt dich mitspielen. Nach sechs Zügen weißt du nicht mehr, wo dein Läufer steht. #sprecher:erzaehler #musik:blindschach
c4. Er steht auf c4. Du hast ihn im dritten Zug dorthin gestellt. #sprecher:ambrose
Er hat die Augen geschlossen, die Hände auf dem Rücken. Sein Gesicht ist so ruhig, wie du es noch nie gesehen hast. #sprecher:erzaehler #musik:ambrose.still
Zwölf Jahre habe ich Partien in Briefen gespielt. Ich bin mit der Stellung aufgestanden und mit ihr zu Bett gegangen. #sprecher:ambrose #stimmung:friedlich
Und danach, hundertsechzig Jahre lang, hatte ich nichts anderes mehr. Eine einzige Stellung. Im Dunkeln. #sprecher:ambrose
* [„Das klingt furchtbar.“]
- Es war furchtbar. Aber es ist auch ein Zuhause. Dieses Sehen ohne Augen. #sprecher:ambrose
Ich habe nicht gewusst, dass man es üben kann. Auf einem Wanderweg, zum Vergnügen. #sprecher:ambrose
Sag der Dame: Läufer schlägt f7, Schach. #sprecher:ambrose
* [„Läufer schlägt f7, Schach.“]
- Greta macht die Augen auf. Der steht doch gar nicht … #sprecher:greta
Ihre Lippen bewegen sich. Doch. Der steht da. Seit dem dritten Zug. Du siehst gut, für den ersten Tag. #sprecher:greta
* [„Ich hab einen Freund. Der sieht für mich.“]
- Dann halt ihn fest. Solche findet man nicht oft. #sprecher:greta
-> greta_angebot

=== greta_angebot ===
Der Geist da spielt doch, oder? Ich seh's dir an. Setz dich mit ihm auf die Bank. Ich schreib mit. #sprecher:greta
+ [Blindschach gegen Ambrose]
    Die Figuren verschwinden. Nur die Züge bleiben. #sprecher:erzaehler
    ~ beginnePartie("wegCrossroadsPinewood.blindschach")
    -> END
+ [„Nicht jetzt.“]
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
{gretaGetroffen and not esIstStillGesagt: -> es_ist_still}
{not baeumeGesehen:
    ~ baeumeGesehen = true
    Die Bäume sind so dick, dass zehn Leute sie nicht umfassen. Die Rinde ist rot, weich und tief gefurcht. #sprecher:erzaehler #geraeusch:wald_tief #musik:wald.orgelpunkt
    Diese sind älter. Älter als die in Cedar Creek, älter als ich, als das Land, als das Spiel. #sprecher:ambrose
    Ich nehme zurück, was ich damals gesagt habe. Das hier ist jemand in meinem Alter. #sprecher:ambrose #stimmung:lachtOhneSpott
    -> END
}
{~Am Rangerhaus hängt ein Zettel: „Bärenspuren am Bach. Essen nicht offen lassen.“|Im Nebel zwischen den Riesenbäumen ist das Rangerhaus winzig wie eine Spielfigur.|Vor dem Rangerhaus ein Abdruck im Schlamm, so groß wie eine Pfanne.} #sprecher:erzaehler
-> END

// Kapitel 54, Schluss: erstes Zeichen des Abschieds, ohne das Wort.
=== es_ist_still ===
~ esIstStillGesagt = true
Nebel hängt zwischen den Stämmen. Im weichen Boden sind Spuren, breit, mit fünf Zehen. Mama geht ein wenig schneller. #sprecher:erzaehler #bild:baerenspuren
{held}. Die Stellung auf dem kleinen Brett in deiner Tasche. Ich sehe sie nicht mehr im Dunkeln. #sprecher:ambrose #bild:aus
* [„Was heißt das?“]
- Ich weiß es nicht genau. Seit der Bergstation. Seit dieser Zug gekommen ist. #sprecher:ambrose
Wenn ich die Augen schließe, ist da nichts mehr. Das erste Mal seit achtzehnhundertsechsundsechzig ist es still. #sprecher:ambrose #stimmung:friedlich
Du bleibst stehen. #sprecher:erzaehler #pause:2
Geh weiter. Es ist gut. Es ist sehr gut. Ich wollte es dir nur sagen. #sprecher:ambrose #stimmung:friedlich
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
    Hier lag die Seite. Zwischen den Wurzeln ist nichts mehr. #sprecher:erzaehler
    -> END
}
~ seite10Gefunden = true
Zwischen den Wurzeln eines Mammutbaums steckt ein loses Blatt mit einer gezeichneten Stellung. #sprecher:erzaehler
Ein Blatt Papier an einem Baum, der älter ist als jedes Papier. #sprecher:ambrose
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


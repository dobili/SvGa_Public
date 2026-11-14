// Ort: Pinewood Camp am See im Red-Giants-Nationalpark (Akt 4): Hütten, Lagerfeuerplatz, Kanus,
// Kiosk (Story-Bibel 27.3, Weltbeschreibung 5.12, O3).
//
// Szenen der Bibel (Abschnitt 29): 95 Das Sommercamp (Betreuer Ezra, Kinder aus allen Städten:
// Dex und Mae aus Cedar Creek, Tamsin aus Riverton, Lou aus Port Delacroix; am Lagerfeuer Tandem
// und Räuberschach, Mae zeigt Sterne, Fund Marshmallow-Stock), 96 Hollis im Wald (Begegnung
// pinewoodCamp.hollis, ohne Uhr, beim ersten Sieg Zweite Chance). Kiosk: Laden pinewoodCamp.kiosk.
// Einstiege wie in orte.json: ankunft_zu_fuss, ezra, hollis, dex, mae, lou, tamsin,
// weg_crossroads, lagerfeuer, kiosk, weg_ghost.
//
// Varianten: Tandem und Räuberschach sind noch nicht gebaut (VARIANTE-FEHLT, Bericht); Ezra
// erklärt die Regeln, am Lagerfeuer wird erzählt statt gespielt.
// Variablen: ausgangPinewoodCampHollis setzt die Hülle (R42); die übrigen setzt diese Datei.
// Der Marshmallow-Stock kommt über gibFund; Ink merkt ihn sich selbst (stockGefunden).

EXTERNAL beginnePartie(begegnung)
EXTERNAL gibKarte(kennung)
EXTERNAL gibFund(kennung)
EXTERNAL oeffneLaden(kennung)

VAR held = "Du"
VAR ankunftCampGesehen = false
VAR ezraGetroffen = false
VAR lagerfeuerGesehen = false
VAR stockGefunden = false
VAR varianteRaeuberschachGelernt = false
VAR varianteTandemGelernt = false
VAR hollisGetroffen = false
VAR hollisKarteGegeben = false
VAR ausgangPinewoodCampHollis = ""
VAR kioskGesehen = false
// Gutachten M3.4: „Es ist still“ (Kapitel 54, Schluss) fällt beim Eintritt ins Camp, nicht am Rangerhaus.
VAR esIstStillGesagt = false

// ---------------------------------------------------------------- Ankunft (Szene 95)

=== ankunft_zu_fuss ===
{ankunftCampGesehen:
    Zwischen den Riesenbäumen öffnet sich der Wald. Vor dir liegt der See mit den Hütten des Camps. #sprecher:erzaehler
    -> END
}
-> ankunft_camp

=== ankunft_camp ===
// Kapitel 55 (Roman): vierzig Kinder aus dem ganzen Staat, ein Drittel kennt {held}.
{not esIstStillGesagt: -> es_ist_still ->}
~ ankunftCampGesehen = true
Das Camp liegt an einem See zwischen den Bäumen. Zelte im Halbkreis, ein Steg, Kanus kieloben. #sprecher:erzaehler #musik:pinewood #geraeusch:camp
Ein Schild aus einem halben Baumstamm: „Pinewood Camp. Schach, Schwimmen, Schlafen. In dieser Reihenfolge.“ #sprecher:erzaehler #bild:schild_camp
Vierzig Kinder aus dem ganzen Staat. Ein Drittel davon kennst du. #sprecher:erzaehler #bild:aus
Dex hat etwas gebaut, das Marshmallows von selbst dreht. Es funktioniert fast. Mae hat ihr Teleskop dabei. Lou hat Muscheln im Haar und einen Plan. #sprecher:erzaehler
Die kennen sich alle seit einer Woche. Mae hat allen die Sterne erklärt. Ich brauch ein zweites Tagebuch. #sprecher:juno #stimmung:froh
-> END

// Kapitel 54, Schluss (Roman): erstes Zeichen des Abschieds, ohne das Wort; am Waldrand vor dem Camp.
=== es_ist_still ===
~ esIstStillGesagt = true
Nebel hängt zwischen den Stämmen. Im weichen Boden sind Spuren, breit, mit fünf Zehen. Mama geht ein wenig schneller. #sprecher:erzaehler #bild:baerenspuren
{held}. Die Stellung auf dem kleinen Brett in deiner Tasche. Ich sehe sie nicht mehr im Dunkeln. #sprecher:ambrose #stimmung:nachdenklich #bild:aus
* [„Was heißt das?“]
- Ich weiß es nicht genau. Seit der Bergstation. Seit dieser Zug gekommen ist. #sprecher:ambrose #stimmung:nachdenklich
Wenn ich die Augen schließe, ist da nichts mehr. Das erste Mal seit achtzehnhundertsechsundsechzig ist es still. #sprecher:ambrose #stimmung:friedlich
Du bleibst stehen. #sprecher:erzaehler #pause:2
Geh weiter. Es ist gut. Es ist sehr gut. Ich wollte es dir nur sagen. #sprecher:ambrose #stimmung:friedlich
->->

// ---------------------------------------------------------------- Ezra

=== ezra ===
{ezraGetroffen: -> ezra_alltag}
~ ezraGetroffen = true
Ein junger Mann mit Pfeife um den Hals und Klemmbrett unter dem Arm kommt angelaufen. #sprecher:erzaehler
Ezra, ich bin hier der Betreuer. Du bist das Schachkind, von dem alle reden? Wunderbar. Heute Abend ist Lagerfeuer. #sprecher:ezra #stimmung:froh
-> ezra_regeln

=== ezra_regeln ===
~ varianteRaeuberschachGelernt = true
~ varianteTandemGelernt = true
Ezra hat eine Gitarre, auf der zwei Saiten fehlen. #sprecher:erzaehler
Tandem! Zwei gegen zwei! Was dein Partner schlägt, kriegst du in die Hand und darfst es einsetzen! Wer redet, wird gekitzelt! #sprecher:ezra #stimmung:lacht
Und Räuberschach: Wer alles verliert, gewinnt. Schlagen ist Pflicht. Wer als Erster keine Figur mehr hat, ist Sieger. #sprecher:ezra #stimmung:laechelt
-> END

=== ezra_alltag ===
{~Kanus nur mit Weste! Auch du, {held}!|Am Kiosk gibt's Limo und Marshmallows. Die Marshmallows sind für heute Abend.|Lou hat gestern im Räuberschach die Dame im ersten Zug verschenkt. Absichtlich. Genial.} #sprecher:ezra #stimmung:laechelt
+ [„Erklär mir die Regeln vom Lagerfeuer noch einmal.“]
    -> ezra_regeln
+ [„Bis nachher.“]
    -> END

// ---------------------------------------------------------------- Lagerfeuer

=== lagerfeuer ===
{
- not ankunftCampGesehen:
    Ein Kreis aus Steinen, darin kalte Asche. #sprecher:erzaehler
    -> END
- not lagerfeuerGesehen: -> lagerfeuer_abend
- else: -> lagerfeuer_alltag
}

=== lagerfeuer_abend ===
// Kapitel 55 (Roman): die letzte unbeschwerte Nacht. Lagerfeuer mit Ezras Gitarre, Tandem als
// Wahnsinn, Räuberschach (held.rueckwaerts), dann der Steg mit dem Nachtstück, zum zweiten Mal.
~ lagerfeuerGesehen = true
{not varianteTandemGelernt:
    ~ varianteRaeuberschachGelernt = true
    ~ varianteTandemGelernt = true
}
// VARIANTE-FEHLT: Tandem und Räuberschach. Bis sie gebaut sind, wird am Feuer erzählt statt gespielt.
Am Abend brennt das Feuer. Du sitzt neben Sam, gegenüber Dex und Mae, und Figuren fliegen über den Tisch. #sprecher:erzaehler #licht:nacht #musik:lagerfeuer #klang:tandem
Springer! Ich brauch einen Springer! #sprecher:dex #stimmung:lacht
Sam stellt eine Dame mitten in die feindliche Stellung, aus der Hand. #sprecher:erzaehler
Die Chefin ist zurück! #sprecher:sam #stimmung:froh
Er wird gekitzelt. #sprecher:erzaehler
Das ist kein Schach. #sprecher:ambrose #stimmung:ueberrascht
* [„Nein.“]
- Es ist Wahnsinn. Figuren fallen vom Himmel. #sprecher:ambrose #stimmung:lachtOhneSpott
Ich hätte gern mitgespielt. Mit zwanzig. Ich wäre unerträglich gewesen. #sprecher:ambrose #stimmung:lacht
Dann Räuberschach gegen Lou. Alles ist verkehrt herum. Du stellst deine Dame hin und flehst, dass jemand sie nimmt. #sprecher:erzaehler #musik:held.rueckwaerts
Lou gewinnt. Sie hatte einen Plan. #sprecher:erzaehler
Ein Spiel, bei dem man alles hergibt, und am Ende hat der gewonnen, dem nichts bleibt. #sprecher:ambrose #stimmung:still #pause:2
Es ist nicht das dümmste Spiel, das ich gesehen habe. #sprecher:ambrose #stimmung:laechelt
-> steg_nacht

// Am Steg: derselbe Himmelsausschnitt wie in Cedar Creek (Kapitel 14), Nachtstück zum zweiten Mal.
= steg_nacht
Als die Kleinen in den Zelten sind, liegt ihr am Steg. Mae zeigt nach oben. #sprecher:erzaehler #musik:nachtstueck #teilchen:sternschnuppen
Kassiopeia. Sieht aus wie ein W. #sprecher:mae #stimmung:laechelt
Du musst nicht alles benennen. #sprecher:dex #stimmung:laechelt
Doch. #sprecher:mae #stimmung:laechelt
Dieselbe Stelle am Himmel. Ein Jahr später, fünfhundert Meilen weiter. #sprecher:erzaehler
{not stockGefunden:
    ~ stockGefunden = true
    Sam reicht dir einen Stock, vom Feuer geschwärzt, mit Kerben in der Rinde. #sprecher:erzaehler
    Für jeden Sieg eine. Tradition. Du hast acht. Und eine für die Sache mit der Chefin. Die erste. Im Clubraum. #sprecher:sam #stimmung:laechelt
    ~ gibFund("marshmallowStock")
    Da hast du nicht gewonnen, sagst du. Da hast du ihm was gezeigt. #sprecher:erzaehler
    Ja. Eben. #sprecher:sam #stimmung:laechelt
}
Sie stehen noch wie früher. Das habe ich schon einmal bemerkt. An einem anderen Steg. #sprecher:ambrose #stimmung:nachdenklich
Ich war damals beleidigt, weil ich nur eine Fußnote bin. Erinnerst du dich? #sprecher:ambrose #stimmung:laechelt
* [„Sechs Wörter.“]
- Sechs Wörter. #sprecher:ambrose #stimmung:lachtOhneSpott
Vierzig Kinder. In hundert Jahren weiß niemand mehr, wie sie hießen. Und es wird nicht das Geringste ausmachen. #sprecher:ambrose #stimmung:friedlich
Sie haben heute Abend gespielt. Das war es. Das war immer alles. #sprecher:ambrose #stimmung:friedlich #pause:2
Über euch fällt ein Stern. Mae schreit auf. #sprecher:erzaehler #klang:sternschnuppe
Du wünschst dir etwas und weißt, dass es nicht in Erfüllung geht. Das ist in Ordnung. #sprecher:erzaehler
-> END

=== lagerfeuer_alltag ===
{~Das Feuer ist heruntergebrannt. In der Glut liegt ein verkohlter Marshmallow.|Am Feuerplatz stehen noch zwei Bretter. Auf einem liegt ein Stapel geschlagener Figuren für das Tandem.|Über dem See steht der Polarstern. Er bleibt immer da.} #sprecher:erzaehler
-> END

// ---------------------------------------------------------------- Hollis im Wald (Szene 96)

=== hollis ===
{
- not hollisGetroffen: -> hollis_erstes_treffen
- ausgangPinewoodCampHollis == "" or ausgangPinewoodCampHollis == "abgebrochen": -> hollis_angebot
- ausgangPinewoodCampHollis == "niederlage": -> hollis_nach_niederlage
- else: -> hollis_nach_sieg
}

=== hollis_erstes_treffen ===
~ hollisGetroffen = true
Unter einem der Riesenbäume sitzt eine Rangerin, ein Fernglas um den Hals. Das Brett steht auf einer Wurzel. Über euch arbeitet ein Specht. #sprecher:erzaehler
Hollis. Ich spiele nur draußen. Drinnen kann ich nicht denken. #sprecher:hollis #stimmung:laechelt
-> hollis_angebot

=== hollis_angebot ===
Eine Stellung, du hast Weiß. Keine Uhr. Der Wald hat Zeit, wir auch. #sprecher:hollis #stimmung:laechelt
+ [„Gern.“]
    ~ beginnePartie("pinewoodCamp.hollis")
    -> END
+ [„Nicht jetzt.“]
    Ich bin hier. Meistens. Wenn kein Bär im Camp ist. #sprecher:hollis #stimmung:lacht
    -> END

=== hollis_nach_sieg ===
{not hollisKarteGegeben:
    ~ hollisKarteGegeben = true
    Gut gespielt. Ruhig, wie ein Baum, der wächst. #sprecher:hollis #stimmung:froh
Es war die erste Partie seit langem, die für nichts zählte. Du merkst, wie sehr dir das gefehlt hat. #sprecher:erzaehler
    Hier. Jeder verdient im Wald eine zweite Chance. Auch auf dem Brett. #sprecher:hollis #stimmung:laechelt
    ~ gibKarte("zweiteChance")
}
Noch eine? Die Sonne steht noch über den Wipfeln. #sprecher:hollis #stimmung:laechelt
+ [„Noch eine.“]
    ~ beginnePartie("pinewoodCamp.hollis")
    -> END
+ [„Ich gehe zurück ins Camp.“]
    -> END

=== hollis_nach_niederlage ===
Der Wald gewinnt oft. Willst du es noch einmal versuchen? #sprecher:hollis #stimmung:laechelt
+ [„Revanche.“]
    ~ beginnePartie("pinewoodCamp.hollis")
    -> END
+ [„Nicht jetzt.“]
    -> END

// ---------------------------------------------------------------- Die Kinder

=== dex ===
{~Ich hab Mae dreimal geschlagen. Im Räuberschach. Da ist Verlieren Gewinnen, also hat sie gewonnen. Glaube ich.|Bea ist Maes große Schwester. Die spielt bei der Meisterschaft! Gegen dich vielleicht!|Wusstest du, dass Kanus umkippen? Ich jetzt schon.} #sprecher:dex #stimmung:lacht
-> END

=== mae ===
{~Bea ist meine Schwester. Sie spielt bei der Meisterschaft. Sie spielt immer auf Remis. Du brauchst Geduld.|Heute Nacht sieht man die Milchstraße. In der Stadt sieht man die nie.|Sterne sind wie Figuren. Man muss wissen, wo sie stehen.} #sprecher:mae #stimmung:laechelt
-> END

=== tamsin ===
{~In Riverton regnet es jetzt bestimmt. Hier regnet es nie. Doch, gestern.|Slick hat gesagt, du bist jetzt berühmt. Bist du berühmt?|Ich hab Ezra im Tandem einen Turm gegeben. Er hat ihn sofort verloren.} #sprecher:tamsin #stimmung:lacht
-> END

=== lou ===
{~Das Musikhaus ist fertig! Also fast. Das Dach ist neu. Miss Odile spielt jeden Abend.|Hier ist es so still. Zu Hause hört man immer irgendwo Musik.|Räuberschach ist wie Jazz. Man gibt alles her und gewinnt trotzdem.} #sprecher:lou #stimmung:laechelt
-> END

// ---------------------------------------------------------------- Kiosk und Wege

=== kiosk ===
{not kioskGesehen:
    ~ kioskGesehen = true
    Am Kiosk des Camps hängen Schwimmwesten, Taschenlampen und ein Schild: „Limo 5, Marshmallows 5. Für Bären nichts.“ #sprecher:erzaehler
- else:
    Der Kiosk des Camps. Ezra hat einen Zettel hingehängt: „Bin am See. Geld in die Dose.“ #sprecher:erzaehler
}
~ oeffneLaden("pinewoodCamp.kiosk")
-> END

=== weg_crossroads ===
Der Fernwanderweg führt zurück unter die Riesenbäume, Richtung Crossroads. #sprecher:erzaehler
-> END

=== weg_ghost ===
Hinter dem Camp führt eine Staubstraße nach Osten, zum Rand eines Canyons. Ein verwittertes Schild: „Ghost Town, 20 Meilen“. #sprecher:erzaehler
-> END

// >>> Runde 6 (mittel-4)
=== steg ===
Der Steg ragt in den See. Das Wasser ist so klar, dass man die Fische zählen könnte. #sprecher:erzaehler
-> END

=== kanus ===
Zwei Kanus liegen kieloben am Ufer. Auf eins hat jemand mit Kreide ein Schachbrett gemalt. #sprecher:erzaehler
-> END
// <<< Runde 6 (mittel-4)

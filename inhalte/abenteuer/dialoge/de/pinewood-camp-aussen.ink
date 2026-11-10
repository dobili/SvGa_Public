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

// ---------------------------------------------------------------- Ankunft (Szene 95)

=== ankunft_zu_fuss ===
{ankunftCampGesehen:
    Zwischen den Riesenbäumen öffnet sich der Wald. Vor dir liegt der See mit den Hütten des Camps. #sprecher:erzaehler
    -> END
}
-> ankunft_camp

=== ankunft_camp ===
~ ankunftCampGesehen = true
Zwischen den Riesenbäumen öffnet sich der Wald. Ein See, Holzhütten, Kanus am Steg. Libellen über dem Wasser. #sprecher:erzaehler
Auf dem Steg sitzen vier Kinder und lassen die Beine baumeln. Eins dreht sich um und schreit. #sprecher:erzaehler
Da ist {held}! Ich hab's euch gesagt, dass {held} kommt! #sprecher:dex #stimmung:froh
Dex aus Cedar Creek, Mae, Tamsin aus Riverton, Lou aus Port Delacroix. Kinder aus allen Städten. #sprecher:erzaehler
Sie haben sich alle gefunden. Ohne dich hätten sie sich nie getroffen. #sprecher:ambrose #stimmung:friedlich
-> END

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
Am Feuer spielen wir zwei Sachen. Erstens Räuberschach: Wer schlagen kann, muss schlagen. Wer zuerst alle Figuren los ist, gewinnt. #sprecher:ezra
Zweitens Tandem: zwei gegen zwei, an zwei Brettern. Was du schlägst, gibst du deinem Partner. Der darf es einsetzen, wo er will. #sprecher:ezra
Wer alles verliert, gewinnt. In meinem Kaffeehaus hätte es dafür eine Schlägerei gegeben. #sprecher:ambrose #stimmung:lacht
-> END

=== ezra_alltag ===
{~Kanus nur mit Weste! Auch du, {held}!|Am Kiosk gibt's Limo und Marshmallows. Die Marshmallows sind für heute Abend.|Lou hat gestern im Räuberschach die Dame im ersten Zug verschenkt. Absichtlich. Genial.} #sprecher:ezra
+ [„Erklär mir die Regeln vom Lagerfeuer noch einmal.“]
    -> ezra_regeln
+ [„Bis später.“]
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
~ lagerfeuerGesehen = true
{not varianteTandemGelernt:
    ~ varianteRaeuberschachGelernt = true
    ~ varianteTandemGelernt = true
}
Es wird dunkel. Ezra zündet das Feuer an, die Kinder bringen Bretter und Stöcke mit Marshmallows. #sprecher:erzaehler
// VARIANTE-FEHLT: Tandem und Räuberschach. Bis sie gebaut sind, wird am Feuer erzählt statt gespielt.
An zwei Brettern spielen Dex und Tamsin gegen Lou und Ezra Tandem. Alle schreien durcheinander: „Gib mir einen Springer! Jetzt!“ #sprecher:erzaehler
Mae spielt nicht mit. Sie liegt auf dem Rücken und zeigt nach oben. #sprecher:erzaehler
Da, das ist der Große Wagen. Und wenn du die hinteren Räder fünfmal verlängerst, kommt der Polarstern. Der bleibt immer da. #sprecher:mae
Wie ein König in der Rochade. #sprecher:dex
Nein, Dex. Wie ein Freund. #sprecher:mae
Ambrose sitzt ein Stück abseits und sieht ins Feuer. Er sagt lange nichts. #sprecher:erzaehler
Weißt du, {held}, ich habe nie Freunde in deinem Alter gehabt. Nur Gegner. Das hier ist besser. #sprecher:ambrose #stimmung:friedlich
{not stockGefunden:
    ~ stockGefunden = true
    Ezra schnitzt eine Kerbe in einen Marshmallow-Stock und gibt ihn dir. #sprecher:erzaehler
    Jede Kerbe ein Sieg. Die erste schenke ich dir. Für die Meisterschaft. #sprecher:ezra
    ~ gibFund("marshmallowStock")
}
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
Unter einem Riesenbaum am Ufer sitzt eine Rangerin auf einem Baumstumpf. Das Brett liegt auf ihren Knien. #sprecher:erzaehler
Hollis. Rangerin. Ich spiele nur draußen. Drinnen denke ich zu schnell. #sprecher:hollis
-> hollis_angebot

=== hollis_angebot ===
Eine Stellung, du hast Weiß. Keine Uhr. Der Wald hat Zeit, wir auch. #sprecher:hollis
+ [„Gern.“]
    ~ beginnePartie("pinewoodCamp.hollis")
    -> END
+ [„Später.“]
    Ich bin hier. Meistens. Wenn kein Bär im Camp ist. #sprecher:hollis
    -> END

=== hollis_nach_sieg ===
{not hollisKarteGegeben:
    ~ hollisKarteGegeben = true
    Gut gespielt. Ruhig, wie ein Baum, der wächst. #sprecher:hollis #stimmung:froh
    Hier. Jeder verdient im Wald eine zweite Chance. Auch auf dem Brett. #sprecher:hollis
    ~ gibKarte("zweiteChance")
}
Noch eine? Die Sonne steht noch über den Wipfeln. #sprecher:hollis
+ [„Noch eine.“]
    ~ beginnePartie("pinewoodCamp.hollis")
    -> END
+ [„Ich gehe zurück ins Camp.“]
    -> END

=== hollis_nach_niederlage ===
Der Wald gewinnt oft. Willst du es noch einmal versuchen? #sprecher:hollis
+ [„Revanche.“]
    ~ beginnePartie("pinewoodCamp.hollis")
    -> END
+ [„Später.“]
    -> END

// ---------------------------------------------------------------- Die Kinder

=== dex ===
{~Ich hab Mae dreimal geschlagen. Im Räuberschach. Da ist Verlieren Gewinnen, also hat sie gewonnen. Glaube ich.|Bea ist Maes große Schwester. Die spielt bei der Meisterschaft! Gegen dich vielleicht!|Wusstest du, dass Kanus umkippen? Ich jetzt schon.} #sprecher:dex
-> END

=== mae ===
{~Bea ist meine Schwester. Sie spielt bei der Meisterschaft. Sie spielt immer auf Remis. Du brauchst Geduld.|Heute Nacht sieht man die Milchstraße. In der Stadt sieht man die nie.|Sterne sind wie Figuren. Man muss wissen, wo sie stehen.} #sprecher:mae
-> END

=== tamsin ===
{~In Riverton regnet es jetzt bestimmt. Hier regnet es nie. Doch, gestern.|Slick hat gesagt, du bist jetzt berühmt. Bist du berühmt?|Ich hab Ezra im Tandem einen Turm gegeben. Er hat ihn sofort verloren.} #sprecher:tamsin
-> END

=== lou ===
{~Das Musikhaus ist fertig! Also fast. Das Dach ist neu. Miss Odile spielt jeden Abend.|Hier ist es so still. Zu Hause hört man immer irgendwo Musik.|Räuberschach ist wie Jazz. Man gibt alles her und gewinnt trotzdem.} #sprecher:lou
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

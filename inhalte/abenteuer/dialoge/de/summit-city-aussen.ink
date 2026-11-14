// Ort: Summit City außen (Akt 4, Club 8): Talstation der Seilbahn, Marktplatz mit Drachenbrunnen,
// Hütten und Gipfelfelsen (Story-Bibel 27.2, Weltbeschreibung 5.10).
//
// Szenen der Bibel (Abschnitt 29): 83 Ankunft (Mama, Juno in den Sommerferien, Plakate der
// Landesmeisterschaft, Victor mit einem Mann im Anzug), 89 Sol auf dem Gipfelfelsen (Begegnung
// summitCity.sol, Uhr 3 + 2, Sprüche erlaubt, beim ersten Sieg Kühler Kopf), 90 Drachenfest (L10,
// Variante Drache, noch nicht gebaut: VARIANTE-FEHLT).
// Einstiege wie in orte.json: ankunft_zu_fuss, sol, weg_desert, seilbahn, drachenfest,
// weg_crossroads.
//
// Runde 11 (13.11.2026): Ankunft nach dem Roman (roman/akt4_teil1.md, Kapitel 48): Wolken von oben,
// Murmeltiere („Vor uns.“), acht Gesichter auf dem Plakat, das achte mit Ketchup am Kinn, Victor
// und der Bote im grauen Anzug.
//
// Variablen: ausgangSummitCitySol und nadelSummitCity setzt die Hülle (R42); victorKriseGesehen
// setzt summit-city-huette.ink, victorSeiteGegeben summit-city-bergstation.ink; die übrigen
// setzt diese Datei. Die Drachenschuppe kommt über gibFund; Ink merkt sie sich selbst.

EXTERNAL beginnePartie(begegnung)
EXTERNAL gibKarte(kennung)
EXTERNAL gibFund(kennung)

VAR held = "Du"
VAR ankunftSummitGesehen = false
VAR solGetroffen = false
VAR solKarteGegeben = false
VAR ausgangSummitCitySol = ""
VAR nadelSummitCity = 0
VAR victorKriseGesehen = false
VAR victorSeiteGegeben = false
VAR varianteDracheGelernt = false
VAR drachenschuppeGefunden = false
VAR abschiedSummitGesehen = false

// ---------------------------------------------------------------- Ankunft (Szene 83)

=== ankunft_zu_fuss ===
{ankunftSummitGesehen:
    Die Bergstraße endet an der Talstation von Summit City. Irgendwo pfeift ein Murmeltier. #sprecher:erzaehler
    -> END
}
-> ankunft_summit

=== ankunft_summit ===
~ ankunftSummitGesehen = true
Summit City liegt so hoch, dass man die Wolken von oben sieht. Holzhäuser, eine Seilbahn, die leise surrt. #sprecher:erzaehler
Es ist Juli, und auf den Gipfeln liegt Schnee. #sprecher:erzaehler
Zwischen den Häusern pfeift etwas, schrill und kurz. #sprecher:erzaehler #klang:murmeltier
Murmeltiere. Die warnen sich. #sprecher:mutter #stimmung:laechelt
* [„Wovor?“]
- Vor uns. #sprecher:mutter #stimmung:lacht
An der Seilbahnstation glänzt ein Plakat: „Landesmeisterschaft der Jugend. Präsentiert von Perfect Move.“ Acht Gesichter. #sprecher:erzaehler
Das zweite ist Nova. Das vierte Victor. Das achte bist du. #sprecher:erzaehler
Das ist von meinem Foto! Da hast du Ketchup am Kinn! #sprecher:juno #stimmung:froh
* [Zum Hotel sehen]
- Vor dem Hotel steht Victor, in Weiß. Ein Mann im grauen Anzug beugt sich zu ihm und sagt ihm etwas ins Ohr. Victor nickt. #sprecher:erzaehler
* [„Der Trainer, der kein Mensch ist.“]
- Der dort ist ein Mensch. Aber ich glaube, er ist nur der Bote. #sprecher:ambrose #stimmung:nachdenklich
Die Hütte der Großmeisterin liegt eine Stunde über der Stadt. Mama bleibt unten. #sprecher:erzaehler
Sie hat mich in neunzehn Zügen geschlagen. Ich will ihr nicht gleich am ersten Tag begegnen. #sprecher:mutter #stimmung:nachdenklich
-> END

// ---------------------------------------------------------------- Sol auf dem Gipfelfelsen (Szene 89)

=== sol ===
{
- not solGetroffen: -> sol_erstes_treffen
- ausgangSummitCitySol == "" or ausgangSummitCitySol == "abgebrochen": -> sol_angebot
- ausgangSummitCitySol == "niederlage": -> sol_nach_niederlage
- else: -> sol_nach_sieg
}

=== sol_erstes_treffen ===
~ solGetroffen = true
Auf dem Gipfelfelsen sitzt eine Frau mit Kletterseil über der Schulter. Vor ihr ein Brett und eine Uhr. #sprecher:erzaehler
Sol. Bergführerin. Wer hier oben ankommt, spielt eine Partie gegen mich. #sprecher:sol #stimmung:laechelt
Mit Uhr. Das Wetter schlägt schneller um, als man denkt. #sprecher:sol #stimmung:nachdenklich
-> sol_angebot

=== sol_angebot ===
Drei Minuten, zwei Sekunden Zuschlag. Eine Stellung, du hast Weiß. Bevor die Wolken kommen? #sprecher:sol #stimmung:laechelt
+ [„Los.“]
    Sie redet vom Wetter, um dich zu treiben. Das Brett kennt kein Wetter. #sprecher:ambrose #stimmung:laechelt
    ~ beginnePartie("summitCity.sol")
    -> END
+ [„Nicht jetzt.“]
    Der Felsen läuft nicht weg. Die Wolken schon. #sprecher:sol #stimmung:laechelt
    -> END

=== sol_nach_sieg ===
{not solKarteGegeben:
    ~ solKarteGegeben = true
    Gewonnen, und keine Sekunde Panik. So steigt man auf einen Berg. #sprecher:sol #stimmung:froh
    Nimm die. Für die Partie, in der die Uhr dich jagt. #sprecher:sol #stimmung:laechelt
    ~ gibKarte("kuehlerKopf")
}
Noch eine? Die Sonne hält noch eine Weile. #sprecher:sol #stimmung:laechelt
+ [„Noch eine.“]
    ~ beginnePartie("summitCity.sol")
    -> END
+ [„Ich steige ab.“]
    Langsam abwärts. Abwärts passieren die Unfälle. #sprecher:sol #stimmung:nachdenklich
    -> END

=== sol_nach_niederlage ===
Gewitter. Ich hab dich gewarnt. Noch mal, bevor es regnet? #sprecher:sol #stimmung:lacht
+ [„Revanche.“]
    ~ beginnePartie("summitCity.sol")
    -> END
+ [„Nicht jetzt.“]
    -> END

// ---------------------------------------------------------------- Seilbahn

=== seilbahn ===
{
- victorKriseGesehen and not victorSeiteGegeben:
    Der Wärter an der Talstation zeigt nach oben. „Ein Junge ist eben den Pfad hinaufgerannt. Nicht hinunter. Allein.“ #sprecher:erzaehler
- else:
    Die Gondel schaukelt bergauf, über Tannen und Murmeltierbauten, bis über die Wolken. #sprecher:erzaehler
}
-> END

// ---------------------------------------------------------------- Drachenfest (Szene 90, L10)

=== drachenfest ===
{
- not ankunftSummitGesehen:
    Ein Brunnen mit einem steinernen Drachen. Wasser läuft aus seinem Maul. #sprecher:erzaehler
    -> END
- varianteDracheGelernt: -> drachenfest_alltag
- else: -> drachenfest_erstes_mal
}

=== drachenfest_erstes_mal ===
~ varianteDracheGelernt = true
Am Abend hängen Laternen über dem Marktplatz. Rund um den Drachenbrunnen stehen zwanzig Bretter auf Bierbänken. #sprecher:erzaehler
Ein Mädchen erklärt dir die Regel, ohne zu fragen, ob du sie hören willst. #sprecher:erzaehler
Einmal im Jahr spielt hier jeder mit dem Drachen. Der Drache zieht wie eine Dame und springt wie ein Springer. #sprecher:erzaehler
Die Sage sagt, er hat die Bergleute aus dem Stollen geführt. Deshalb darf er alles. #sprecher:erzaehler
Eine Figur, die alles darf. Und keiner hier findet das ungerecht. #sprecher:ambrose #stimmung:lacht
{not drachenschuppeGefunden:
    ~ drachenschuppeGefunden = true
    Das Mädchen drückt dir eine Schuppe aus grünem Glas in die Hand. Für alle, die zum ersten Mal mitmachen. #sprecher:erzaehler
    ~ gibFund("drachenschuppe")
}
-> drachenfest_angebot

=== drachenfest_angebot ===
// VARIANTE-FEHLT: Drache (L10). Bis sie gebaut ist, nur die Regel und eine Vertröstung.
Alle Bretter sind belegt. Die Bergführer spielen bis Mitternacht, und die Kinder schauen zu. #sprecher:erzaehler
Nächstes Mal setzen wir uns dazu. Ich will sehen, wie man einen Drachen fängt. #sprecher:ambrose #stimmung:laechelt
-> END

=== drachenfest_alltag ===
{~Am Drachenbrunnen liegt eine vergessene Figur mit Flügeln.|Ein Murmeltier sitzt auf dem Brunnenrand und pfeift.|Die Laternen vom Fest hängen noch. Am Brunnen erklärt ein Vater seinem Sohn den Drachen.} #sprecher:erzaehler
-> drachenfest_angebot

// ---------------------------------------------------------------- Wege

=== weg_desert ===
Die Bergstraße windet sich hinunter, Richtung Wüste. #sprecher:erzaehler
-> END

=== weg_crossroads ===
{abschiedSummitGesehen:
    Hinter Summit City wird die Straße flacher. Weit vorn dampft der Boden. #sprecher:erzaehler
    -> END
}
~ abschiedSummitGesehen = true
Am Ortsausgang steht Mama mit dem Auto, Juno sitzt schon hinten. #sprecher:erzaehler
Acht Nadeln. Acht! Jetzt fehlt nur noch die Meisterschaft. #sprecher:juno #stimmung:froh
Bis zur Capital Arena sind es noch ein paar Tage. Über die Geysire, dann nach Crossroads. #sprecher:mutter
Hinter Summit City wird die Straße flacher. Weit vorn dampft der Boden. #sprecher:erzaehler
-> END

// >>> Runde 6 (mittel-4)
VAR ambroseSprichtWieder = false

=== plakat ===
Ein Plakat am Platz: „Landesmeisterschaft – Finale in der Capital Arena“. Darunter hat jemand mit Bleistift geschrieben: „Wir fahren hin!“ #sprecher:erzaehler
-> END

=== fernrohr ===
Vom Felsplateau sieht man über das ganze Tal. Die Gondel hängt wie eine Figur am Faden über dem Abgrund. #sprecher:erzaehler
{ambroseSprichtWieder:
    Von hier oben sieht das Tal aus wie ein Brett nach der Eröffnung. Alles steht noch, nichts ist entschieden. #sprecher:ambrose #stimmung:nachdenklich
}
-> END
// <<< Runde 6 (mittel-4)

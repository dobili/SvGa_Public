// Ort: Crossroads außen (Akt 4): Kreuzung von vier Straßen mit Tankstelle, Parkplatz, Werksbus
// aus Ironwood, Rosies Food-Truck und Wegweiser in alle Städte (Story-Bibel 27.3, Weltbeschreibung
// 5.11).
//
// Szene 93 „Crossroads“ (erster Teil): Wiedersehen mit Figuren aus früheren Städten: Slick auf dem
// Weg zur Meisterschaft, Mira mit Tomás, Big Joe als Fahrer des Werksbusses, Rosie mit dem
// Food-Truck (Laden siliconBay.foodtruck). Die Raststätte mit Darlene, Nova und dem
// Varianten-Tisch erzählt crossroads-raststaette.ink.
// Einstiege wie in orte.json: ankunft_zu_fuss, slick, mira, big_joe, rosie, weg_summit, wegweiser,
// weg_pinewood.
//
// Variablen: alle setzt diese Datei; novaBitteGehoert setzt crossroads-raststaette.ink.

EXTERNAL oeffneLaden(kennung)
EXTERNAL reise(karte, ausloeser)

VAR held = "Du"
VAR ankunftCrossroadsGesehen = false
VAR novaBitteGehoert = false
VAR slickGetroffen = false
VAR miraCrossroadsGetroffen = false
VAR bigJoeCrossroadsGetroffen = false
VAR rosieCrossroadsGetroffen = false
VAR gatterschluessel = false
// Kapitel 53 (Roman): Delgado und der Bildschirm; noch ohne Figur in Crossroads.
VAR coachCrossroadsGetroffen = false

// ---------------------------------------------------------------- Ankunft (Szene 93)

=== ankunft_zu_fuss ===
{ankunftCrossroadsGesehen:
    Die Prärie endet an einer Kreuzung. Vier Straßen, eine Raststätte, ein Wegweiser. #sprecher:erzaehler
    -> END
}
-> ankunft_crossroads

=== ankunft_crossroads ===
// Kapitel 53 (Roman): vier Straßen, die sich in der Mitte von nichts treffen. Musik: die
// Ortsthemen nacheinander über einem fröhlichen Rhythmus (crossroads), Stimmengewirr.
~ ankunftCrossroadsGesehen = true
Vier Straßen kommen aus vier Richtungen und treffen sich in der Mitte von nichts. #sprecher:erzaehler #musik:crossroads #geraeusch:crossroads_stimmen #licht:abend
An der Ecke eine Raststätte, niedrig und breit, mit Veranda rundherum: „Darlene's. Alle Wege. Alle Spiele.“ #sprecher:erzaehler #bild:schild_darlene
Der Parkplatz ist voll. Ein grauer Werksbus mit Rostflecken: „Stahlwerk Ironwood. Schicht B.“ #sprecher:erzaehler #bild:aus
Alle Wege führen zur Capital Arena. Und alle machen hier Pause. #sprecher:mutter
-> END

// ---------------------------------------------------------------- Slick

=== slick ===
{slickGetroffen:
    {~Wände sind was für Leute, die Angst vor Wetter haben.|Meine Pokale sind schief. Aber es sind welche.|Tamsin hat nur einmal verloren. Deshalb ja.} #sprecher:slick
    -> END
}
// Kapitel 53 (Roman): Slick redet langsamer und lässt Platz zwischen den Sätzen.
~ slickGetroffen = true
Auf dem Geländer der Veranda sitzt jemand und redet auf drei Kinder mit einem Klappbrett ein. Dünner geworden, brauner. #sprecher:erzaehler
… und ich sag, Wände sind was für Leute, die Angst vor Wetter haben … #sprecher:slick
Er sieht dich und rutscht vom Geländer. #sprecher:erzaehler
Maple Falls! #sprecher:slick #stimmung:froh
Hast du den Springer? #sprecher:tamsin
* [Den Springer aus Stein hervorholen]
- Slick dreht ihn in den Fingern. Die Mähne ist an einer Stelle abgestoßen. #sprecher:erzaehler
Du hast mir ein Foto geschickt. Von einem Pokal aus einer Dose. In einer Garage in der Wüste. #sprecher:slick
Ich hab es an die Brücke gehängt. Unter den Bogen, wo der Stein liegt. #sprecher:slick
Ich hab seit März wieder angefangen. Mit den Dosen. Meine sind schief. Tamsin hat einen gekriegt. Bester Verlierer. #sprecher:slick
Ich hab nur einmal verloren! #sprecher:tamsin
Deshalb ja. Den Springer nehm ich wieder mit, wenn's recht ist. Der gehört auf den Stein. #sprecher:slick
Es ist recht. #sprecher:erzaehler
-> END

// ---------------------------------------------------------------- Mira und Tomás

=== mira ===
{miraCrossroadsGetroffen:
    {~Noch mal. Jetzt.|Atmen ist langweilig. Aber es hilft.|Die Frau vom Pfarrer spielt an zwei Brettern. Gegen mich. Gleichzeitig.} #sprecher:mira
    -> END
}
~ miraCrossroadsGetroffen = true
Mira sitzt im Schneidersitz auf einem Tisch und spielt gegen Tomás, Dot und die Frau des Pfarrers zugleich. Die Frau des Pfarrers spielt an zwei Brettern. #sprecher:erzaehler #musik:mira
Du. Noch mal. Jetzt. #sprecher:mira
* [„Nach dem Essen.“]
- Ich hab geübt. Atmen. Es ist langweilig. Aber es hilft. #sprecher:mira
Sie zieht an vier Brettern hintereinander, ohne hinzusehen. #sprecher:erzaehler #musik:crossroads
-> END

// ---------------------------------------------------------------- Big Joe

=== big_joe ===
{bigJoeCrossroadsGetroffen:
    {~Geliehen ist ein großes Wort, Kumpel.|Zwölf Mann, ein Heizstrahler. Mehr braucht ein Club nicht.|Der Pokal steht jetzt auf der Werkbank. Laurie hat gesagt, er soll stehen, wo man ihn sieht.} #sprecher:bigJoe
    -> END
}
// Kapitel 53 (Roman): Big Joe hebt {held} hoch; der Club spielt jetzt in seiner Garage.
~ bigJoeCrossroadsGetroffen = true
Kumpel! #sprecher:bigJoe #stimmung:froh
Big Joe braucht eine Weile, bis er ausgestiegen ist. Dann hebt er dich hoch. Einfach so, mit dem Rucksack. #sprecher:erzaehler
Acht! Hab ich gehört! Die Ward! Die hat mich neunzehnachtundachtzig in sechzig Zügen zerlegt. #sprecher:bigJoe
Wir fahren zur Meisterschaft. Die ganze Schicht. Den Bus hab ich geliehen. Geliehen ist ein großes Wort. #sprecher:bigJoe
* [„Wo spielt ihr jetzt?“]
- Sein Gesicht wird einen Moment lang ernst. #sprecher:erzaehler
In meiner Garage. Zwölf Mann, ein Heizstrahler. Die Tische in der Kantine leuchten, hab ich gehört. Es geht keiner hin. #sprecher:bigJoe
Das Stahlbrett steht auf der Werkbank. Und daneben der Pokal von zweitausendeins. Deine Mutter hat gesagt, er soll stehen, wo man ihn sieht. #sprecher:bigJoe
Hinter ihm steigen Hank und Priya aus. Hank nickt, was bei ihm eine Rede ist. #sprecher:erzaehler
-> END

// ---------------------------------------------------------------- Rosie

=== rosie ===
{not rosieCrossroadsGetroffen:
    ~ rosieCrossroadsGetroffen = true
    Am Ende der Veranda dampft ein türkisfarbener Lastwagen mit Beulen. Rosie winkt mit einem Pfannenwender. #sprecher:erzaehler
    Davor redet Dash auf Buck ein, Buck redet zurück. Keiner hört dem anderen zu, und beide sind glücklich. #sprecher:erzaehler
    Wo Schachspieler sind, ist Hunger. Das hab ich in Silicon Bay gelernt. #sprecher:rosie #stimmung:froh
- else:
    {~Heute im Angebot: alles. Wie immer.|Die Sauce ist neu. Scharf wie ein Doppelangriff.} #sprecher:rosie
}
~ oeffneLaden("siliconBay.foodtruck")
-> END

// ---------------------------------------------------------------- Coach Delgado (Kapitel 53)
// Figur crossroads.coach auf dem Parkplatz (Gutachten M3.1).

=== coach ===
{coachCrossroadsGetroffen:
    {~Aufstellung! Wer zuletzt am Büfett ist, spielt gegen Mira!|Mr. Pratt verkauft den Kuchen. Er ist erschreckend gut darin.} #sprecher:coachDelgado
    -> END
}
~ coachCrossroadsGetroffen = true
Auf der Veranda pfeift jemand. Auf zwei Fingern. Du kennst den Pfiff. #sprecher:erzaehler #klang:pfiff
Coach Delgado zählt neben einem Schulbus Köpfe. Sam, zwei Jüngere. Und eine Siebzehnjährige mit Fahrrad auf dem Dachträger, die so tut, als gehöre sie nicht dazu. #sprecher:erzaehler
Carla spielt Brett drei. Sie hat gesagt, nur dieses eine Mal. Sie hat es dreimal gesagt. #sprecher:juno #stimmung:froh
Viertes Brett! Du stehst auf einem Plakat! Mit Ketchup! #sprecher:coachDelgado
* [„Was ist mit dem Bildschirm im Clubraum?“]
- Sie wird nicht verlegen. Sie sieht dich gerade an. #sprecher:erzaehler
Ich hab unterschrieben. Im September, in der Woche, nachdem der Junge mit dem Tablet bei uns war. #sprecher:coachDelgado
Wir hatten kein Geld für den Bus nach Cedar Creek. Die haben den Bus bezahlt und die Bretter und das Startgeld für sieben Kinder. #sprecher:coachDelgado
Im Frühjahr wollten sie dafür den Raum. Dienstags und donnerstags, für ihr Programm, ohne mich. #sprecher:coachDelgado
Da hab ich gekündigt. Den Vertrag, nicht die Schule. #sprecher:coachDelgado
Der Bildschirm steht im Flur und zeigt den Vertretungsplan. Das Beste, was er je gezeigt hat. #sprecher:coachDelgado #stimmung:lachtOhneSpott
Für den Bus backen wir Kuchen. Mr. Pratt verkauft ihn. Er ist erschreckend gut darin. #sprecher:coachDelgado
-> END

// ---------------------------------------------------------------- Wegweiser und Wege

=== wegweiser ===
Ein Wegweiser mit Schildern in alle Richtungen: Maple Falls, Cedar Creek, Riverton, Ironwood, Silicon Bay, Port Delacroix, Desert Springs, Summit City. #sprecher:erzaehler
Ganz oben, neu angeschraubt: „Capital Arena – Landesmeisterschaft“. #sprecher:erzaehler
{novaBitteGehoert:
    Acht Städte. Und in jeder habe ich etwas gelernt. Oder verlernt. #sprecher:ambrose #stimmung:friedlich
}
-> END

=== weg_summit ===
Die Straße führt durch die Prärie zurück, Richtung Geysire und Berge. #sprecher:erzaehler
-> END

=== weg_pinewood ===
Ein Wanderweg führt nach Norden in den Wald. Ein Schild: „Fernwanderweg – Pinewood Camp“. #sprecher:erzaehler
-> END

// ---------------------------------------------------------------- Viehgatter (Sperre S13, Q4)
// Runde 6 (13_Wegenetz, Abschnitt 5): Das Gatter vor der Alten Minenstraße öffnet Darlenes
// Schlüssel (gatterschluessel, crossroads-raststaette.darlene_lieferung). Q4-FEHLT: Die Karte der
// Minenstraße ist noch nicht gebaut; bis dahin reist {held} nach Ghost Town außen.

=== viehgatter ===
{gatterschluessel: -> viehgatter_offen}
Ein Viehgatter sperrt die Alte Minenstraße. Dahinter stehen Rinder mitten auf dem Asphalt. Am Gatter hängt ein Schild: „Privatweg. Schlüssel bei Darlene.“ #sprecher:erzaehler
Ein Hindernis, das man nicht schlagen kann. Nur fragen, wer den Schlüssel hat. #sprecher:ambrose
-> END

=== viehgatter_offen ===
Darlenes Schlüssel passt. Hinter dem Gatter führt die Alte Minenstraße über die Hügel nach Ghost Town. Die Rinder machen widerwillig Platz. #sprecher:erzaehler
+ [Die Minenstraße nach Ghost Town nehmen]
    ~ reise("ghostTown.aussen", "wegPinewood")
    -> END
+ [Hierbleiben]
    -> END

// ---------------------------------------------------------------- Fernbus (Q3)
// Runde 6 (13_Wegenetz, Abschnitt 5): Der Fernbus an der Haltestelle am Highway West bringt {held}
// schnell zurück in die alten Städte (Revanchen, Bayou, Schach960). Er fährt nur hin; zurück geht
// es mit den Bussen und Zügen der Städte oder zu Fuß. Ziel ist je Stadt ihre Haltestelle oder ihr
// Bahnhof; Silicon Bay hält an der Raststätte an der Küste, Summit City am Südrand.

=== fernbus ===
An der Haltestelle hängt ein Fahrplan mit allen Städten. Der Fernbus wartet mit laufendem Motor. #sprecher:erzaehler
Die Fahrerin lehnt sich aus dem Fenster: „Wohin? Ich fahre überallhin, wo es eine Straße gibt.“ #sprecher:erzaehler
+ [Maple Falls]
    ~ reise("mapleFalls.park", "bushaltestelle")
    -> END
+ [Cedar Creek]
    ~ reise("cedarCreek.aussen", "bushaltestelle")
    -> END
+ [Riverton]
    ~ reise("riverton.aussen", "bahnhof")
    -> END
+ [Ironwood]
    ~ reise("ironwood.aussen", "bushaltestelle")
    -> END
+ [Silicon Bay, Raststätte an der Küste]
    ~ reise("wegIronwoodSilicon.raststaette", "zurueckIronwood")
    -> END
+ [Port Delacroix]
    ~ reise("portDelacroix.aussen", "wuestenzug")
    -> END
+ [Desert Springs]
    ~ reise("desertSprings.aussen", "bahnhof")
    -> END
+ [Summit City]
    ~ reise("summitCity.aussen", "wegCrossroads")
    -> END
+ [Hierbleiben]
    „Ich fahre in zehn Minuten. Oder in zwanzig. Kommt drauf an, wann der Kaffee alle ist.“ #sprecher:erzaehler
    -> END


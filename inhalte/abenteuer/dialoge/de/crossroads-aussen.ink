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

// ---------------------------------------------------------------- Ankunft (Szene 93)

=== ankunft_zu_fuss ===
{ankunftCrossroadsGesehen:
    Die Prärie endet an einer Kreuzung. Vier Straßen, eine Raststätte, ein Wegweiser. #sprecher:erzaehler
    -> END
}
-> ankunft_crossroads

=== ankunft_crossroads ===
~ ankunftCrossroadsGesehen = true
Mitten in der Prärie kreuzen sich vier Straßen. An der Ecke eine Tankstelle und eine Raststätte mit rotem Dach. #sprecher:erzaehler
Auf dem Parkplatz steht ein Bus mit der Aufschrift „Ironwood Werke“. Daneben ein Food-Truck, den du kennst. #sprecher:erzaehler
Und da, am Wegweiser: ein Kurierrad, das du auch kennst. #sprecher:erzaehler
Alle Wege führen zur Capital Arena. Und alle machen hier Pause. #sprecher:mutter
Das ist wie das Ende einer langen Partie. Alle Figuren kommen noch einmal aufs Brett. #sprecher:ambrose #stimmung:friedlich
-> END

// ---------------------------------------------------------------- Slick

=== slick ===
{slickGetroffen:
    {~Die Arena hat dreitausend Plätze. Ich hab gefragt.|Sechshundert Meilen mit dem Rad. Na gut, die Hälfte im Bus.|Ich spiele nicht mit. Ich schaue zu und erzähle es allen.} #sprecher:slick
    -> END
}
~ slickGetroffen = true
Am Wegweiser lehnt Slick an seinem Kurierrad und grinst. #sprecher:erzaehler
Na, wenn das nicht {held} aus Riverton ist! Ich bin auf dem Weg zur Meisterschaft. Als Zuschauer, bevor du fragst. #sprecher:slick #stimmung:froh
Ich hab's allen im Pavillon erzählt. Du bist jetzt eine kleine Berühmtheit am Fluss. #sprecher:slick
Berühmtheit. Ich hatte das auch einmal. Es ist weniger warm, als man denkt. #sprecher:ambrose #stimmung:lacht
-> END

// ---------------------------------------------------------------- Mira und Tomás

=== mira ===
{miraCrossroadsGetroffen:
    {~Ich hab im Auto zwölf Damen geopfert. Gegen Tomás. Elf waren richtig.|Onkel Ray hat angerufen. Du hast ihn getroffen? Er redet nur von Enten.|Spielst du in der Arena auch so ruhig? Ich nicht. Ich bin nur Zuschauerin.} #sprecher:mira
    -> END
}
~ miraCrossroadsGetroffen = true
Auf der Bank vor der Tankstelle sitzt Mira im Schneidersitz. Tomás tankt den alten Wagen voll. #sprecher:erzaehler
Da bist du! Wir fahren zur Meisterschaft. Zum Zuschauen. Und zum Anfeuern. Laut. #sprecher:mira #stimmung:froh
Sie meint es so. Sehr laut. #sprecher:tomas
Ein Opfer ist ein Versprechen, das man halten muss. Du hast es gehalten, damals im Canyon. #sprecher:ambrose
-> END

// ---------------------------------------------------------------- Big Joe

=== big_joe ===
{bigJoeCrossroadsGetroffen:
    {~Der Bus braucht Diesel. Ich brauche Kaffee. Wir sind ein gutes Team.|Hank lässt grüßen. Er sagt, du sollst auf die Läufer achten.|Halb Ironwood sitzt in der Arena. Wir haben Schilder gemalt.} #sprecher:bigJoe
    -> END
}
~ bigJoeCrossroadsGetroffen = true
Ein großer Mann steigt aus dem Werksbus und breitet die Arme aus. #sprecher:erzaehler
Da ist ja mein Lieblingsgegner! Ich fahre die halbe Belegschaft zur Meisterschaft. Wir haben Schilder gemalt. Mit deinem Namen. #sprecher:bigJoe #stimmung:lacht
Schilder. Mit deinem Namen. #sprecher:ambrose #pause
Ich fürchte, {held}, jetzt musst du gewinnen. #sprecher:ambrose #stimmung:lacht
-> END

// ---------------------------------------------------------------- Rosie

=== rosie ===
{not rosieCrossroadsGetroffen:
    ~ rosieCrossroadsGetroffen = true
    Aus dem Food-Truck winkt Rosie mit einem Pfannenwender. #sprecher:erzaehler
    Ich fahre der Meisterschaft hinterher! Wo Schachspieler sind, ist Hunger. Das habe ich in Silicon Bay gelernt. #sprecher:rosie #stimmung:froh
- else:
    {~Heute im Angebot: alles. Wie immer.|Die Sauce ist neu. Scharf wie ein Doppelangriff.} #sprecher:rosie
}
~ oeffneLaden("siliconBay.foodtruck")
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


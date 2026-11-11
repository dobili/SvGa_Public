// Ort: Raststätte von Darlene in Crossroads (Akt 4): Diner mit Tresen, Varianten-Tisch,
// Darlenes Laden, Wand mit Postkarten aller Städte (Story-Bibel 27.3, Weltbeschreibung 5.11).
//
// Szene 93 „Crossroads“ (zweiter Teil): Darlene und ihr Laden (crossroads.raststaette), der
// Varianten-Tisch mit allen Varianten, die {held} unterwegs gelernt hat, Nova allein in der Ecke
// mit ihrer Bitte („Ich sage aus. Hilfst du mir?“, beide Antworten führen weiter), Fund
// Postkarte aller Städte.
// Einstiege wie in orte.json: darlene, nova, varianten_tisch, fund_postkarte.
//
// Varianten: Gebaut sind Blindschach (Begegnung wegCrossroadsPinewood.blindschach, gelernt
// bei Greta an Weg 9) und Schach960 (Begegnung crossroads.schach960 gegen Ambrose, gelernt bei
// Mabel im Musikhaus von Port Delacroix). Die übrigen nennt der Tisch mit „kommt bald“ (VARIANTE-FEHLT, Bericht).
// Variablen: variante<Name>Gelernt setzen die Dialoge der Wege und von Summit City;
// novaBitteGehoert, novaHilfeZugesagt und die übrigen setzt diese Datei. novaBitteGehoert und
// novaHilfeZugesagt sind für die Dialoge der Capital Arena gedacht (Szene 103).

EXTERNAL beginnePartie(begegnung)
EXTERNAL oeffneLaden(kennung)
EXTERNAL gibFund(kennung)

VAR held = "Du"
VAR darleneGetroffen = false
VAR novaBitteGehoert = false
VAR novaHilfeZugesagt = false
VAR postkarteGefunden = false
VAR lieferungFuerDolores = false
VAR gatterschluessel = false
VAR varianteKoenigsrennenGelernt = false
VAR varianteDracheGelernt = false
VAR varianteAtomschachGelernt = false
VAR varianteEntenschachGelernt = false
VAR varianteBlindschachGelernt = false
VAR varianteRaeuberschachGelernt = false
VAR varianteTandemGelernt = false
VAR varianteSchach960Gelernt = false
VAR varianteFalkeUndBisonGelernt = false

// ---------------------------------------------------------------- Darlene

=== darlene ===
{novaBitteGehoert and not lieferungFuerDolores: -> darlene_lieferung}
{not darleneGetroffen:
    ~ darleneGetroffen = true
    Hinter dem Tresen steht eine Frau mit Brille an einer Kette und gießt Kaffee ein, ohne hinzusehen. #sprecher:erzaehler
    Darlene. Mir gehört die Raststätte, seit es die Kreuzung gibt. Fast. #sprecher:darlene
    Hier kommt jeder vorbei, früher oder später. Und jeder kauft was. Du auch? #sprecher:darlene #stimmung:froh
- else:
    {~Kaffee? Geht aufs Haus, wenn du was kaufst.|Ich hab alles, was die Läden davor hatten. Nur netter verpackt.|Der Tisch da hinten? Da spielt man alles, nur kein normales Schach.} #sprecher:darlene
}
~ oeffneLaden("crossroads.raststaette")
-> END

=== darlene_lieferung ===
// Runde 6: Nach Novas Bitte schickt Darlene eine Lieferung zum Jahrmarkt und gibt den
// Gatterschlüssel mit (13_Wegenetz, S13). Quest crossroads.lieferung.
~ lieferungFuerDolores = true
~ gatterschluessel = true
Darlene stellt eine Kiste auf den Tresen. Darin klirren Glühbirnen. #sprecher:erzaehler
Tust du mir einen Gefallen? Die Kiste ist für Dolores, drüben auf dem Jahrmarkt hinter dem Feld. Glühbirnen für ihre Lichterketten. #sprecher:darlene
Und nimm den hier. Der Schlüssel fürs Viehgatter an der Minenstraße. Nova sagt, du musst nach Ghost Town. Das ist der kürzeste Weg. #sprecher:darlene
Eine Kiste, ein Schlüssel und ein Auftrag. So fingen meine besten Reisen an. #sprecher:ambrose
-> END

// ---------------------------------------------------------------- Nova (Szene 93)

=== nova ===
{novaBitteGehoert:
    {~Dr. Lin sagt, wir legen alles vor. Die Berichte, den Empfänger. Alles.|Ich hab Angst. Aber eine gute Angst. Glaube ich.|Zum ersten Mal weiß ich nicht, ob ich gewinne. Das fühlt sich gut an.} #sprecher:nova
    -> END
}
-> nova_bitte

=== nova_bitte ===
~ novaBitteGehoert = true
In der hintersten Ecke sitzt Nova, allein, vor einem kalten Kakao. Kein Tablet. Kein Ohrstöpsel. #sprecher:erzaehler
Hallo. Setz dich, wenn du willst. #sprecher:nova
Dr. Lin hat angerufen. Sie legt bei der Meisterschaft alles vor. Die Spielberichte, den Empfänger aus dem Serverraum. #sprecher:nova
Ich sage aus. Ich sage, wie es war. #sprecher:nova #pause
Hilfst du mir? #sprecher:nova
+ [„Ja. Ich stehe neben dir.“]
    ~ novaHilfeZugesagt = true
    Danke. Ich glaube, allein hätte ich es mir noch mal anders überlegt. #sprecher:nova #stimmung:froh
+ [„Das schaffst du allein. Aber ich bin da.“]
    Allein. Ja. Das muss ich wohl. Aber es ist gut zu wissen, dass jemand im Saal sitzt. #sprecher:nova
- Sie war die Erste, die das Gerät getragen hat, und sie ist die Erste, die es ablegt. Das braucht mehr Mut als jedes Opfer. #sprecher:ambrose #stimmung:still
-> END

// ---------------------------------------------------------------- Varianten-Tisch

=== varianten_tisch ===
An einem runden Tisch liegen Bretter in allen Größen, Kisten mit seltsamen Figuren, eine Holzente, ein Drache aus Glas. #sprecher:erzaehler
Ein Schild: „Varianten-Tisch. Alles erlaubt, nur kein normales Schach.“ #sprecher:erzaehler
{not (varianteKoenigsrennenGelernt or varianteDracheGelernt or varianteAtomschachGelernt or varianteEntenschachGelernt or varianteBlindschachGelernt or varianteRaeuberschachGelernt or varianteTandemGelernt or varianteFalkeUndBisonGelernt or varianteSchach960Gelernt):
    Du kennst noch keine der Varianten. Unterwegs spielen die Leute sie, an jedem Weg eine andere. #sprecher:darlene
    -> END
}
Was du schon kennst: #sprecher:erzaehler
{varianteKoenigsrennenGelernt:
    Königsrennen, von Earl am Diner. Zwei Fernfahrer jagen ihre Könige gerade um die Wette nach oben. #sprecher:erzaehler
}
{varianteDracheGelernt:
    Schach mit dem Drachen, vom Fest in Summit City. Der Glasdrache wartet neben dem Brett auf seinen Einsatz. #sprecher:erzaehler
}
{varianteAtomschachGelernt:
    Atomschach, von Bell am Geysir. Auf einem Brett fehlt schon die halbe Mitte. #sprecher:erzaehler
}
{varianteEntenschachGelernt:
    Entenschach, von Ray im Sturmkeller. Die Holzente steht mitten auf e4 und rührt sich nicht. #sprecher:erzaehler
}
{varianteRaeuberschachGelernt:
    Räuberschach, vom Lagerfeuer im Camp. Ein Junge verschenkt strahlend seine Dame. #sprecher:erzaehler
}
{varianteTandemGelernt:
    Tandem, vom Lagerfeuer im Camp. Vier Leute an zwei Brettern, und alle reden durcheinander. #sprecher:erzaehler
}
{varianteFalkeUndBisonGelernt:
    Falke und Bison, von Kira auf der Hochebene. Die zwei Figuren liegen obenauf in der Kiste. #sprecher:erzaehler
}
{varianteBlindschachGelernt:
    Blindschach, von Greta an der Hütte. Eine Frau sagt ihre Züge an und sieht dabei aus dem Fenster. #sprecher:erzaehler
}
{varianteSchach960Gelernt:
    Schach960, von Mabel im Musikhaus. Jemand würfelt die Grundreihe aus und stöhnt. #sprecher:erzaehler
}
// Der Tisch ist Kulisse: Die Sätze zeigen, was dort gespielt wird, ohne ein Versprechen an den
// Spieler („Kommt bald“). Spielbar sind bisher nur Blindschach und Schach960 bei ihren Figuren.
+ {varianteBlindschachGelernt} [Blindschach gegen Ambrose]
    Zwölf Jahre Briefe, {held}. Ich sehe das Brett mit geschlossenen Augen besser als mit offenen. #sprecher:ambrose #stimmung:lacht
    ~ beginnePartie("wegCrossroadsPinewood.blindschach")
    -> END
+ {varianteSchach960Gelernt} [Schach960 gegen Ambrose]
    Gemischte Figuren. Mal sehen, ob ein alter Mann noch umlernen kann. #sprecher:ambrose #stimmung:lacht
    ~ beginnePartie("crossroads.schach960")
    -> END
+ [Nur schauen]
    -> END

// ---------------------------------------------------------------- Fund

=== fund_postkarte ===
{postkarteGefunden:
    An der Wand hängen Postkarten aus allen Städten, dicht an dicht. #sprecher:erzaehler
    -> END
}
~ postkarteGefunden = true
Neben der Kasse steht ein Drehständer mit Postkarten. Auf einer sind alle Städte zugleich: Maple Falls, die Brücke von Cedar Creek, der Pavillon, die Werkhallen, die Glasbrücke, das Musikhaus, der Canyon, die Seilbahn. #sprecher:erzaehler
Wir waren überall! Die kommt ins Tagebuch. Ganz hinten, auf die letzte Seite. #sprecher:juno #stimmung:froh
~ gibFund("postkarteStaedte")
-> END

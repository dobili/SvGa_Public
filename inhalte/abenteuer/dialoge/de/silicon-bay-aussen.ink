// Ort: Silicon Bay, Campus mit Glasgebäuden, Food-Truck und Bank (Akt 3). Figuren: Dash, Rosie.
//
// Szenen der Story-Bibel (Abschnitt 20): 53 Glas und Licht (Ankunft, akt3.ankunftSiliconBay),
// 54 Dash am Food-Truck (Begegnung siliconBay.dash, Sprüche S1 bis S4, beim ersten Sieg die Karte
// gruebelfalle), 61 Die Nacht mit dem Tablet (Auslöser hotel, akt3.ambroseGebannt), dazu Bus
// zurück nach Ironwood und die Fähre nach Port Delacroix (nach der Clubnadel).
// Einstiege wie in orte.json: ankunft_zu_fuss, dash, rosie, glasbruecke, hotel, bus_ironwood,
// faehre. Rosie öffnet nach dem Gespräch ihren Laden (siliconBay.foodtruck).
//
// Variablen: ausgangSiliconBayDash, ausgangSiliconBayClubkampf und nadelSiliconBay setzt die
// Hülle (R42). Victor holt {held} und Juno bei der Ankunft ab.

EXTERNAL beginnePartie(begegnung)
EXTERNAL gibKarte(kennung)
EXTERNAL reise(karte, ausloeser)
EXTERNAL oeffneLaden(laden)
EXTERNAL setzeToenung(name)

VAR held = "Du"
VAR ausgangSiliconBayDash = ""
VAR nadelSiliconBay = 0
VAR ankunftSiliconBayGesehen = false
VAR dashGetroffen = false
VAR dashKarteGegeben = false
VAR rosieGetroffen = false
VAR tabletNachtGesehen = false

// ---------------------------------------------------------------- Ankunft

=== ankunft_zu_fuss ===
{ankunftSiliconBayGesehen:
    Die Glasbrücke endet am Campus von Silicon Bay. #sprecher:erzaehler
    -> END
}
~ ankunftSiliconBayGesehen = true
Hinter der Glasbrücke glänzt eine Stadt aus Glas. Niemand trägt ein Brett, alle schauen auf Bildschirme. #sprecher:erzaehler
Ein Lieferroboter rollt vorbei und fährt {held} fast über die Füße. #sprecher:erzaehler
Victor wartet am Ende der Brücke, die Hände in den Taschen. Er sieht müde aus. #sprecher:erzaehler
Ihr seid gekommen. Gut. Die Akademie ist dort drüben. #sprecher:victor
Kein Baum. Keine Taube. Wo wohnen hier die Tiere? #sprecher:ambrose
Juno flüstert: „Frag ihn, wo die Tiere sind.“ Victor zuckt mit den Schultern: „Die stören die Sensoren.“ #sprecher:erzaehler
-> END

=== glasbruecke ===
Die Glasbrücke führt zurück zur Raststätte an der Schnellstraße. #sprecher:erzaehler
-> END

// ---------------------------------------------------------------- Dash

=== dash ===
{
- not dashGetroffen: -> dash_erstes_treffen
- ausgangSiliconBayDash == "" or ausgangSiliconBayDash == "abgebrochen": -> dash_angebot
- ausgangSiliconBayDash == "niederlage": -> dash_nach_niederlage
- else: -> dash_nach_sieg
}

=== dash_erstes_treffen ===
~ dashGetroffen = true
Auf der Bank vor dem Food-Truck sitzt ein Lieferradfahrer mit Helm und einem Brett auf den Knien. #sprecher:erzaehler
Hey! Blitz um einen Burrito? Drei Minuten, ich red die ganze Zeit. Das gehört dazu. #sprecher:dash
Im Park redet man, {held}. Hier ist ein Park, wenn auch einer aus Glas. #sprecher:ambrose
Wenn er redet, darfst du zurückreden. Mit einem Spruch. Aber nie gemein. #sprecher:ambrose
-> dash_angebot

=== dash_angebot ===
Tick, tack, dein König hat Angst. Spielen wir? #sprecher:dash
* [„Los, drei Minuten.“]
    ~ beginnePartie("siliconBay.dash")
    -> END
* [„Nach dem Essen.“]
    Denkst du noch oder verlierst du schon? Ich bin hier. #sprecher:dash
    -> END

=== dash_nach_niederlage ===
Burrito für mich! Denkst du noch oder verlierst du schon? #sprecher:dash
Er redet, damit du nicht denkst. Mach das Gegenteil. #sprecher:ambrose
* [„Revanche.“]
    ~ beginnePartie("siliconBay.dash")
    -> END
* [„Später.“]
    -> END

=== dash_nach_sieg ===
{not dashKarteGegeben:
    ~ dashKarteGegeben = true
    Okay, okay. Du hast mich zum Grübeln gebracht. Das schafft sonst keiner. #sprecher:dash
    Hier, nimm den. Den Spruch hab ich von meiner Oma: Lass sie zweifeln. #sprecher:dash
    ~ gibKarte("gruebelfalle")
    Eine Karte, die Zweifel sät. Benutze sie mit Anstand, {held}. #sprecher:ambrose
    -> END
}
{~Du schon wieder. Mein Burrito wird kalt.|Okay, du bist gut. Aber ich bin lauter.|Morgen gewinn ich. Wahrscheinlich.} #sprecher:dash
+ [„Noch eine?“]
    ~ beginnePartie("siliconBay.dash")
    -> END
+ [„Guten Appetit.“]
    -> END

// ---------------------------------------------------------------- Rosie

=== rosie ===
{rosieGetroffen:
    {~Burrito? Nein? Dann eben nicht.|Hier leuchtet nur meine Kochplatte.|Pass auf dich auf in der Akademie.} #sprecher:rosie
    -> rosie_laden
}
~ rosieGetroffen = true
Aus dem Food-Truck duftet es nach Bohnen und Mais. Eine Frau mit Kochmütze lehnt sich aus dem Fenster. #sprecher:erzaehler
Willkommen in Silicon Bay. Ich bin das Einzige hier, das nicht leuchtet. #sprecher:rosie
Karten verkauf ich auch. Auf Papier, nicht auf dem Bildschirm. #sprecher:rosie
Eine Köchin, die lacht. In dieser Stadt aus Glas ist das ein Wunder. #sprecher:ambrose
-> rosie_laden

=== rosie_laden ===
~ oeffneLaden("siliconBay.foodtruck")
-> END

// ---------------------------------------------------------------- Hotel (Szene 61)

=== hotel ===
{
- nadelSiliconBay == 0:
    Das Hotel der Akademie. Dein Zimmer ist im zwölften Stock. Schlafen kannst du nach dem Turnier. #sprecher:erzaehler
    -> END
- tabletNachtGesehen:
    Im Hotelzimmer liegt das Tablet neben dem Brett. Der Bildschirm ist dunkel. #sprecher:erzaehler
    -> END
}
-> hotel_nacht

=== hotel_nacht ===
~ tabletNachtGesehen = true
~ setzeToenung("nacht")
Mitten in der Nacht wachst du auf. Das Tablet leuchtet neben dem Brett. #sprecher:erzaehler
Die Maschine spielt gegen sich selbst. Partie um Partie, ohne Pause. #sprecher:erzaehler
Ich habe zugesehen. Die ganze Nacht. #sprecher:ambrose #stimmung:gebannt
Sie spielt, wie ich immer spielen wollte. Kein einziger Zweifel. #sprecher:ambrose #stimmung:gebannt
* [„Und ich?“]
    Ambrose antwortet nicht. Auf dem Bildschirm fällt ein König. #sprecher:erzaehler #pause
* [„Mach das aus.“]
    Gleich. Nur noch diese eine Partie. #sprecher:ambrose #stimmung:gebannt
    Er sagt es dreimal in dieser Nacht. #sprecher:erzaehler
- ~ setzeToenung("keine")
Am Morgen fährt Juno zurück nach Hause. „Pass auf ihn auf“, sagt sie leise. „Er klingt komisch.“ #sprecher:erzaehler
-> END

// ---------------------------------------------------------------- Bus und Fähre

=== bus_ironwood ===
Der Fernbus nach Ironwood hält an der Haltestelle vor dem Campus. #sprecher:erzaehler
* [Einsteigen]
    Der Bus fährt über die Schnellstraße zurück in die Stadt aus Stahl. #sprecher:erzaehler
    ~ reise("ironwood.aussen", "busSiliconBay")
    -> END
* [Noch bleiben]
    -> END

=== faehre ===
{nadelSiliconBay > 0:
    Am Kai liegt die Küstenfähre nach Süden. Zwei Tage bis nach Port Delacroix. #sprecher:erzaehler
    Port Delacroix. Ich kenne diesen Namen. Ich kenne ihn sehr gut. #sprecher:ambrose #stimmung:traurig
- else:
    Am Kai liegt eine Fähre nach Süden. „Erst das Turnier“, steht auf deinem Zettel. #sprecher:erzaehler
    Erst die Akademie, {held}. Dann die Reise. #sprecher:ambrose
}
-> END

// ---------------------------------------------------------------- Inselfähre (Sperre S6)
// Runde 6 (13_Wegenetz, Abschnitt 4): Nach der Nadel von Silicon Bay fährt die Fähre zur
// Pelikaninsel dauerhaft; vorher nur der Fahrplan („sonntags“ ist Erzählung, Befund 16).

=== inselfaehre ===
{nadelSiliconBay:
    Der Fährmann winkt dich an Bord. Seit du die Nadel hast, fährt er für dich jeden Tag. #sprecher:erzaehler
    -> END
}
Am Fährhäuschen hängt ein Fahrplan: „Pelikaninsel. Sonntags.“ Der Fährmann flickt ein Tau und schaut nicht auf. #sprecher:erzaehler
Heute ist nicht Sonntag. Und für die Insel brauchst du einen Grund. Hol dir erst die Nadel im Club. #sprecher:faehrmann
-> END


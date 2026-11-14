// Ort: Mamas altes Zimmer im Reihenhaus von Oma Ruth, Elm Street, Ironwood (Akt 2).
// Figur: Oma Ruth. Gegenstände: Medaille, Partieformular von 2001 (Auslöser partieformular2001).
//
// Szene 39 der Story-Bibel, zweiter Teil (akt2.fotoGefunden): Oma Ruth öffnet Mamas Zimmer; das
// Foto von 2001 ist der Gegenstand der Hauptquest ironwood.mamasFinale (Wirkung in quests.json)
// und zugleich ein Fund fürs Album (gibFund). {held} zeigt es Mama zu Hause in der Küche
// (maple-falls-wohnzimmer.mama_foto, Roman Kapitel 27); danach spielt Mama in der Kantine.
// Im selben Besuch gibt Oma Ruth Mamas Turnierheft (Szene 39a, oma_ruth_heft; Roman, Kapitel 25).
// Einstiege wie in orte.json: oma_ruth, medaille, partieformular.

EXTERNAL gibFund(kennung)
EXTERNAL reise(karte, ausloeser)

VAR held = "Du"
VAR fotoGefunden = false
VAR medailleGesehen = false
VAR partieformular2001Gesehen = false
VAR turnierheftBekommen = false
VAR mamaFotoGesehen = false

=== oma_ruth ===
// Kapitel 25 (Roman): Oma Ruth kennt {held}; die Umarmung auf der Schwelle, dann Mamas Thema
// (Klangplan S36, `mama`), das am leeren Blatt nach vier Tönen abbricht. Das Heft gibt sie im
// selben Besuch (oma_ruth_heft); wer früher schon hier war, bekommt es beim nächsten Mal.
{fotoGefunden and not turnierheftBekommen: -> oma_ruth_heft}
{fotoGefunden and not mamaFotoGesehen: -> oma_ruth_heft.heimfahrt}
{fotoGefunden:
    {~Deine Mutter war das stillste Kind der Straße. Außer, wenn sie gewonnen hat.|Ich hab ihr Zimmer so gelassen, falls sie mal wieder schlafen will.|Du bist schon wieder gewachsen. Das gehört verboten.} #sprecher:omaRuth #stimmung:laechelt
    -> END
}
~ fotoGefunden = true
Die Frau in der Tür ist klein und hat Mamas Kinn. #sprecher:erzaehler
Sie sieht dich an und sagt nichts. #sprecher:erzaehler #pause:2
Dann zieht sie dich an sich. Sie riecht nach Mamas altem Waschmittel. Dem von früher. #sprecher:erzaehler #musik:mama
Du bist gewachsen. Seit dem Frühjahr. Das gehört verboten. #sprecher:omaRuth #stimmung:laechelt
Sie macht Kakao und stellt Juno Fragen, als wäre Juno die Hauptperson. Juno beantwortet sie alle. #sprecher:erzaehler
Komm. Ich zeig dir was. Sie wird mir böse sein. Soll sie. #sprecher:omaRuth #stimmung:laechelt
Ein kleines Zimmer unter dem Dach. Die Tür war immer zu, solange du denken kannst. Poster von Bands, eine gehäkelte Decke. Durchs Fenster sieht man die Schornsteine. #sprecher:erzaehler
An der Wand ein Foto: ein Mädchen, die Hände in den Ärmeln, über einem Brett. „Jugendmeisterschaft des Bundesstaats 2001. Finale. Laura M., Stahlwerker-Club Ironwood.“ #sprecher:erzaehler #bild:foto2001
~ gibFund("foto2001")
Sie sieht so sicher aus. #sprecher:erzaehler #bild:aus #pause
Daneben unter Glas ein Partieformular. Um den dreiunddreißigsten Zug ist ein Kreis, so fest gedrückt, dass das Papier fast durch ist. #sprecher:erzaehler #bild:partieformular2001
Sie hat es eingerahmt und nie wieder angesehen. #sprecher:omaRuth #stimmung:nachdenklich #bild:aus
Deine Mutter war das stillste Kind der Straße. Außer, wenn sie gewonnen hat. Dann hat man sie bis zum Werkstor gehört. #sprecher:omaRuth #stimmung:laechelt
Joe sagt, er hat in dreißig Jahren keine zweite gehabt. Dann kam das Finale. Sie hat etwas übersehen, einen Läufer. #sprecher:omaRuth #stimmung:nachdenklich
Sie kam nach Hause und trug den Koffer mit den Figuren in den Keller. #sprecher:omaRuth #stimmung:traurig
* [„Und Big Joe?“]
- Joe hat drei Tage gewartet, dann hat er geklingelt. Ich hab gesagt, sie will niemanden sehen. #sprecher:omaRuth #stimmung:bitter
Er dachte, er lässt ihr Zeit. Sie dachte, er ist enttäuscht. #sprecher:omaRuth #stimmung:nachdenklich
So sind fünfundzwanzig Jahre vergangen. Zwei Dickköpfe. #sprecher:omaRuth #stimmung:nachdenklich
Nimm das Foto mit. Zeig es ihr. #sprecher:omaRuth #stimmung:nachdenklich
-> oma_ruth_heft

// Szene 39a: Mamas Turnierheft (Gegenstand notizbuch, Quest ironwood.turnierheft gibt ihn).
=== oma_ruth_heft ===
~ turnierheftBekommen = true
Sie zieht die Schublade des Schreibtischs auf. Ein Heft, dick, blau, die Ecken abgestoßen. #sprecher:erzaehler
Jede Seite eine Partie. Datum, Gegner, Ergebnis. Darunter drei Sätze: „Was ich gelernt habe.“ #sprecher:erzaehler #bild:blaues_heft
„Nicht mit der Dame zuerst.“ #sprecher:erzaehler
„Wenn ich angreife, sehe ich nichts anderes. Aufpassen!!“ #sprecher:erzaehler
„Geduld ist kein Warten. Geduld ist Hinsehen.“ #sprecher:erzaehler
Die Schrift wird erwachsener. Die letzte beschriebene Seite: „Finale. 12. Mai 2001.“ Darunter die Überschrift. #sprecher:erzaehler
Und darunter nichts. Danach nur leere Seiten. Mehr als die Hälfte des Hefts. #sprecher:erzaehler #musik:aus #pause:2
Sie hat es mir dagelassen. Ich glaube, sie wollte, dass jemand weiterschreibt. #sprecher:omaRuth #stimmung:nachdenklich
Draußen leuchtet der Himmel über dem Werk orange auf. Das Fauchen kommt einen Atemzug später. #sprecher:erzaehler #licht:ironwood #klang:hochofen
Drei Sätze nach jeder Partie. Deine Mutter war eine ordentliche Spielerin, {held}. #sprecher:ambrose #stimmung:still
Ich war das nie. Ich habe meine Niederlagen nicht aufgeschrieben. Ich habe sie auswendig gelernt. #sprecher:ambrose #stimmung:nachdenklich
* [„Was macht man damit?“]
- Mit einem halb leeren Heft? Man schreibt hinein. Was sonst. #sprecher:ambrose #stimmung:laechelt
-> heimfahrt

// Kapitel 27 beginnt zu Hause: Das Foto gehört auf den Küchentisch (maple-falls-wohnzimmer.mama_foto).
= heimfahrt
* [Mit dem Abendbus nach Hause fahren]
    ~ reise("mapleFalls.wohnzimmer", "haustuer")
    -> END
* [Noch bleiben]
    -> END

=== medaille ===
{medailleGesehen:
    Die Silbermedaille dreht sich langsam am Band, wenn du vorbeigehst. #sprecher:erzaehler
    -> END
}
~ medailleGesehen = true
An der Wand hängt eine Medaille an einem blauen Band. Silber. #sprecher:erzaehler
Silber. Eine Niederlage, die man aufhängt. Mutig. #sprecher:ambrose #stimmung:laechelt
-> END

=== partieformular ===
{partieformular2001Gesehen:
    Unter dem Glas der Kreis um den dreiunddreißigsten Zug. #sprecher:erzaehler
    -> END
}
~ partieformular2001Gesehen = true
Unter Glas ein Partieformular. Züge in zwei Spalten, in einer Schrift, die du kennst. Nur runder, jünger. #sprecher:erzaehler #bild:partieformular2001
Um den dreiunddreißigsten Zug ist ein Kreis. So fest gedrückt, dass das Papier fast durch ist. #sprecher:erzaehler
Sie hat es eingerahmt und nie wieder angesehen. #sprecher:omaRuth #stimmung:nachdenklich
-> END

// Ort: Mamas altes Zimmer im Reihenhaus von Oma Ruth, Elm Street, Ironwood (Akt 2).
// Figur: Oma Ruth. Gegenstände: Medaille, Partieformular von 2001 (Auslöser partieformular2001).
//
// Szene 39 der Story-Bibel, zweiter Teil (akt2.fotoGefunden): Oma Ruth öffnet Mamas Zimmer; das
// Foto von 2001 ist der Gegenstand der Hauptquest ironwood.mamasFinale (Wirkung in quests.json)
// und zugleich ein Fund fürs Album (gibFund). Danach ruft Oma Ruth Mama an; Mama kommt in die
// Kantine (ironwood-kantine.mama_foto).
// Einstiege wie in orte.json: oma_ruth, medaille, partieformular.

EXTERNAL gibFund(kennung)

VAR fotoGefunden = false
VAR medailleGesehen = false
VAR partieformular2001Gesehen = false

=== oma_ruth ===
{fotoGefunden:
    {~Deine Mutter war das stillste Kind der Straße. Außer, wenn sie gewonnen hat.|Ich hab ihr Zimmer so gelassen, falls sie mal wieder schlafen will.|Laurie hat angerufen. Sie klang, als hätte sie lange geweint und dann gelacht.} #sprecher:omaRuth
    -> END
}
~ fotoGefunden = true
Eine kleine Frau mit Strickjacke öffnet die Tür, sieht dich an und hält sich am Rahmen fest. #sprecher:erzaehler
Du bist Lauries Kind. Komm her. #sprecher:omaRuth #stimmung:froh
Sie umarmt dich lange. Dann führt sie dich eine schmale Treppe hinauf in ein kleines Zimmer. #sprecher:erzaehler
Poster an der Wand, eine Silbermedaille am Haken, auf dem Schreibtisch ein Foto: „Jugendmeisterschaft 2001, Finale – Laura M., Stahlwerker-Club Ironwood“. #sprecher:erzaehler
~ gibFund("foto2001")
Sie hat genau so gelacht wie deine Mama heute. Nur jünger. #sprecher:juno
Sie hat das Formular vom Finale eingerahmt und nie wieder angesehen. Nimm das Foto mit. #sprecher:omaRuth
Ich ruf sie an. #sprecher:omaRuth
Ihre Mutter, wenn ich so sagen darf, war eine Meisterin. Und niemand hat es mir erzählt. #sprecher:ambrose #stimmung:stolz
-> END

=== medaille ===
{medailleGesehen:
    Die Silbermedaille dreht sich langsam am Haken, wenn du vorbeigehst. #sprecher:erzaehler
    -> END
}
~ medailleGesehen = true
Eine Silbermedaille an einem rot-weißen Band: „2. Platz, Jugendmeisterschaft des Bundesstaats, 2001“. #sprecher:erzaehler
Silber. Das ist eine Niederlage, die man aufhängt. Mutig. #sprecher:ambrose
-> END

=== partieformular ===
{partieformular2001Gesehen:
    Unter dem Glas der Kreis um den 33. Zug. #sprecher:erzaehler
    Die Tinte ist verblasst, der Kreis nicht. #sprecher:erzaehler
    -> END
}
~ partieformular2001Gesehen = true
Unter Glas ein Partieformular, sauber ausgefüllt in runder Schrift. #sprecher:erzaehler
Um den 33. Zug ist ein Kreis gemalt, fest und dick. #sprecher:erzaehler
Ein Spieß. Der Läufer greift durch. #sprecher:ambrose
Ein einziger Zug in einer langen, guten Partie. #sprecher:ambrose
-> END

// Ort: Ghost Town außen (Akt 4): verlassene Goldgräberstadt, Hauptstraße, Friedhof mit dem Grab
// ohne Namen, Mr. Pruitt mit dem Metalldetektor (Story-Bibel 27.3 und 28).
//
// Szenen der Bibel (Abschnitt 29): Ankunft über die Staubstraße (Ende von Szene 97), 98 Ghost Town
// (Hauptquest ghostTown.fernpartie, das Grab), 101 Die Nacht in Ghost Town (nach der Fernpartie).
// Einstiege wie in orte.json: ankunft_zu_fuss, pruitt, weg_pinewood, grab, nacht, weg_capital. Wer
// nach der Fernpartie gleich zum Bus geht, erlebt vorher die Nacht (Quest ghostTown.fernpartie).
//
// Variablen: fernpartieGespielt setzt ghost-town-saloon.ink; die übrigen setzt diese Datei.

VAR ankunftGhostTownGesehen = false
VAR pruittGetroffen = false
VAR grabGesehen = false
VAR fernpartieGespielt = false
VAR ambroseSagtEsGesehen = false

// ---------------------------------------------------------------- Ankunft und Wege

=== ankunft_zu_fuss ===
{ankunftGhostTownGesehen:
    Die Staubstraße endet an der Hauptstraße von Ghost Town. #sprecher:erzaehler
    -> END
}
~ ankunftGhostTownGesehen = true
Die Staubstraße endet zwischen Holzfassaden. Ein Saloon, ein Laden ohne Fenster, ein Friedhof am Hang. #sprecher:erzaehler
Die Mittagssonne macht alles braun wie ein altes Foto. Ein Geier zieht Kreise. #sprecher:erzaehler
Ich kenne diese Straße nicht. Aber meine Füße kennen sie. #sprecher:ambrose #stimmung:fern
-> END

=== weg_pinewood ===
Die Staubstraße führt zurück zum Canyon und weiter zum Camp. #sprecher:erzaehler
-> END

=== weg_capital ===
{
- fernpartieGespielt and not ambroseSagtEsGesehen:
    Der Bus fährt erst am Morgen. Du wartest auf den Stufen des Saloons. #sprecher:erzaehler
    -> nacht_ambrose
- fernpartieGespielt:
    Ein Bus hält am Ortsrand: „Große Seen, Capital Arena“. Victor steigt mit dir ein. #sprecher:erzaehler
- else:
    Am Ortsrand steht ein Bus nach Norden. Erst willst du hier etwas zu Ende bringen. #sprecher:erzaehler
}
-> END

// ---------------------------------------------------------------- Mr. Pruitt

=== pruitt ===
{pruittGetroffen:
    {~Gold findet hier keiner mehr. Geschichten schon.|Mein Detektor piept bei jedem Nagel. Nägel gibt es hier viele.|Der Saloon ist offen. Die Tür klemmt nur.} #sprecher:pruitt
    -> END
}
~ pruittGetroffen = true
Ein alter Mann mit Strohhut schwenkt einen Metalldetektor über den Staub. Es piept. Er hebt einen Nagel auf. #sprecher:erzaehler
Pruitt. Ich sammle die Geschichten dieser Stadt. Gold gibt es keins mehr. #sprecher:pruitt
Am Rand vom Friedhof liegt einer, der hatte ein Schachbrett bei sich. Das erzählt man sich hier. #sprecher:pruitt
-> END

// ---------------------------------------------------------------- Das Grab (Szene 98)

=== grab ===
{grabGesehen:
    Das Grab ohne Namen. Jemand hat einen flachen Stein darauf gelegt. #sprecher:erzaehler
    -> END
}
-> grab_erstes

=== grab_erstes ===
~ grabGesehen = true
Am Rand des Friedhofs liegt ein Grab ohne Namen, nur ein Holzkreuz, vom Wind gebleicht. #sprecher:erzaehler
Mr. Pruitt nimmt den Hut ab. #sprecher:erzaehler
Ein Reisender aus dem Süden, 1866. Er hatte ein Schachbrett bei sich. Mehr weiß keiner. #sprecher:pruitt
Hier bin ich angekommen. Nur nicht dort, wo ich wollte. #sprecher:ambrose #stimmung:friedlich #pause
* [Einen Stein auf das Grab legen]
    Du legst einen flachen Stein auf das Holzkreuz. Ambrose sagt nichts. Er muss nichts sagen. #sprecher:erzaehler
* [„Es tut mir leid, Ambrose.“]
    Mir nicht mehr. Ich habe dich gefunden, oder du mich. #sprecher:ambrose #stimmung:friedlich
- Victor kommt mit dem nächsten Bus. Er wartet im Saloon, sagt Mr. Pruitt. #sprecher:erzaehler
-> END

// ---------------------------------------------------------------- Die Nacht (Szene 101)

=== nacht ===
{
- not fernpartieGespielt:
    Über Ghost Town steht die Sonne. Die Sterne kommen erst heute Nacht. #sprecher:erzaehler
    -> END
- ambroseSagtEsGesehen:
    Über Ghost Town stehen mehr Sterne als Häuser. #sprecher:erzaehler
    -> END
}
-> nacht_ambrose

=== nacht_ambrose ===
~ ambroseSagtEsGesehen = true
Nachts ist es still. Über der Hauptstraße stehen mehr Sterne als Häuser. Du setzt dich auf die Stufen des Saloons. #sprecher:erzaehler
Noch eine Partie will ich sehen. Deine, gegen ihn. Dann ist es gut. #sprecher:ambrose #stimmung:friedlich
* [„Bleib.“]
    Du hast es nicht lange überlegt. Das ehrt mich. #sprecher:ambrose
* [„Ich weiß.“]
    Natürlich weißt du es. Du weißt es schon länger als ich. #sprecher:ambrose
- Ein Geist, der bleibt, wird ein Möbelstück. Ich war lange genug ein Brett. #sprecher:ambrose #stimmung:lacht
-> END

// ---------------------------------------------------------------- Ansehen (Runde 6)

=== ortsschild ===
Ein Holzschild am Ortseingang: „Gold Hill, pop. 312“. Die Zahl ist durchgestrichen, darunter steht mit Kreide eine Null. #sprecher:erzaehler
-> END

=== steckbrief ===
Am Brett vor dem Sheriffbüro klebt ein Steckbrief, von der Sonne fast weiß: „Gesucht: Kartenzinker. 50 Dollar.“ Das Gesicht ist nicht mehr zu erkennen. #sprecher:erzaehler
-> END

=== amboss ===
Ein rostiger Amboss im Sand. Ein Hufeisen liegt noch darauf, als wäre der Schmied nur kurz weg. #sprecher:erzaehler
-> END

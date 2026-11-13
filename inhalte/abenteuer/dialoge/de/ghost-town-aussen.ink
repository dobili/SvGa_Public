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
VAR held = "Du"

// ---------------------------------------------------------------- Ankunft und Wege

=== ankunft_zu_fuss ===
{ankunftGhostTownGesehen:
    Die Staubstraße endet an der Hauptstraße von Ghost Town. #sprecher:erzaehler
    -> END
}
// Kapitel 56 (Roman): Die Farben gehen fort (T22); Ghost Town ohne Musik (S71). Ambrose erkennt
// den Laden und das Zimmer darüber.
~ ankunftGhostTownGesehen = true
Mit jedem Kilometer wird alles blasser. Das Rot der Erde, das Grün der Büsche, das Blau am Himmel. #sprecher:erzaehler #musik:aus #geraeusch:ghosttown
Guck mal. Es sieht aus wie ein altes Foto. #sprecher:juno
Die Stadt kommt ohne Schild. Häuser aus Brettern, die das Wetter silbern gemacht hat. Ein Saloon mit einem Balkon, der an einer Seite herunterhängt. #sprecher:erzaehler
Es ist niemand da. Seit hundert Jahren. Der Wind schiebt einen Busch über die Straße. #sprecher:erzaehler
Hier. #sprecher:ambrose #stimmung:fern
Er steht mitten auf der Straße und dreht sich langsam um sich selbst. #sprecher:erzaehler
Der Laden. Das war der Laden. Darüber war ein Zimmer. Es hatte eine Tapete mit Rosen. #sprecher:ambrose
Ich habe die Rosen gezählt, als ich nicht schlafen konnte. #sprecher:ambrose #stimmung:still
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
    {~Hufnagel. Der dreiundvierzigste diese Woche.|Ich bin die Einwohnerzahl.|Die meisten fragen nach dem Gold.} #sprecher:pruitt
    -> END
}
~ pruittGetroffen = true
Etwas piept. Hinter dem Saloon kommt ein alter Mann mit Strohhut hervor und schwenkt ein Gerät an einer Stange über den Boden. #sprecher:erzaehler #klang:metalldetektor
Hufnagel. Der dreiundvierzigste diese Woche. #sprecher:pruitt
Besuch! Ich hab seit April keinen gehabt. Pruitt. Ich bin die Einwohnerzahl. #sprecher:pruitt #stimmung:froh
Achtzehnhundertdreiundsechzig Gold gefunden, viertausend Menschen in zwei Jahren. Ein Opernhaus, das nie fertig wurde. #sprecher:pruitt
Achtzehnhundertdreiundsiebzig ging der Letzte. Ein Schmied. Er ließ die Tür offen, weil es nichts mehr zu stehlen gab. #sprecher:pruitt
* [„Und der Friedhof?“]
- Er sieht dich an. Sehr helle Augen unter dem Hut. #sprecher:erzaehler
Die meisten fragen nach dem Gold. #sprecher:pruitt
-> END

// ---------------------------------------------------------------- Das Grab (Szene 98)

=== grab ===
{grabGesehen:
    Der Stein ohne Namen. Auf e4 liegt eine gelbe Blume. #sprecher:erzaehler
    -> END
}
-> grab_erstes

=== grab_erstes ===
// Kapitel 56 (Roman): der Stein ohne Namen mit dem eingeritzten Brett; „Hier bin ich angekommen“
// mit ambrose.angekommen; Junos gelbe Blume auf e4, das einzige Farbige im Bild.
~ grabGesehen = true
Ganz hinten, wo der Zaun aufhört und die Wüste anfängt, liegt ein niedriger Stein ohne Namen. Eingeritzt: acht mal acht Vierecke. #sprecher:erzaehler #bild:stein_brett
Mr. Pruitt nimmt den Hut ab. Im Kirchenbuch steht eine Zeile dazu. Ich kann sie auswendig. #sprecher:pruitt #bild:aus
„Ein Reisender aus dem Süden, Februar 1866. Fieber. Führte ein Schachbrett mit sich und bat, es seiner Schwester zu senden. Name unleserlich.“ #sprecher:pruitt
Der Schmied hat den Stein gemacht. Der Fremde hat ihm in drei Tagen das Spiel beigebracht, zwischen zwei Fieberanfällen. #sprecher:pruitt
Ambrose steht lange vor dem Stein. #sprecher:erzaehler #pause:3
Hier bin ich angekommen. #sprecher:ambrose #stimmung:friedlich #musik:ambrose.angekommen
Nur nicht dort, wo ich wollte. #sprecher:ambrose #stimmung:friedlich
Er kniet nieder und legt die Hand auf den Stein. Sie geht nicht hindurch. #sprecher:erzaehler
Ein Schmied. Er hieß Gideon. Er hat jeden Springerzug laut mitgezählt. Eins, zwei, und eins. Ich habe ihn ganz vergessen. #sprecher:ambrose #stimmung:lachtOhneSpott
Ist er hier? Ist das seiner? #sprecher:juno
* [Nicken]
- Juno pflückt eine kleine gelbe Blume, die einzige weit und breit, und legt sie auf den Stein. Auf e4. #sprecher:erzaehler #bild:blume_e4
Guter Zug. #sprecher:ambrose
Du sagst es ihr. Sie wird rot. #sprecher:erzaehler #bild:aus
Ein Überlandbus hält am Ende der Hauptstraße, wo seit hundert Jahren nichts gehalten hat. #sprecher:erzaehler #klang:bus
Ein Junge steigt aus, im zu großen Pullover, mit Rucksack und einem kleinen alten Buch. Victor. #sprecher:erzaehler
Er hebt die Hand, ein wenig steif, wie jemand, der das Winken noch übt. Er geht in den Saloon. #sprecher:erzaehler
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

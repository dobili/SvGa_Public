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
VAR esIstStillGesagt = false

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
{not pruittGetroffen:
    ~ pruittGetroffen = true
    Ein alter Mann mit Strohhut und einem Metalldetektor kommt zwischen den Kreuzen heran. Pruitt. Ich bin die Einwohnerzahl. #sprecher:pruitt #klang:metalldetektor
}
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
// Kapitel 59 (Roman): Ambrose sagt es. Nachtstück zum dritten und letzten Mal mit Ambroses
// Thema als Gegenstimme; bei „Bleib“ ein gehaltener Ton (S74). Er sitzt zum vierten Mal.
~ ambroseSagtEsGesehen = true
Im Saloon kocht Mr. Pruitt Bohnen. Juno und Victor streiten, ob man eine Remispartie ins Tagebuch kleben darf. #sprecher:erzaehler #licht:nacht #geraeusch:saloon
Glitzer ist für alles, was man nicht vergessen will. Das ist die Regel. Ich hab sie gemacht. #sprecher:juno #stimmung:froh
Draußen liegt Mondlicht auf den Brettern. Die Stadt kommt dir nicht mehr leer vor. Sie kommt dir vor wie etwas, das fertig ist. #sprecher:erzaehler #geraeusch:ghosttown #musik:nachtstueck
Er wartet am Ende des Gehsteigs, wo die Bretter aufhören. #sprecher:erzaehler
Setz dich. #sprecher:ambrose
Du setzt dich auf die Kante. Der Staub ist noch warm vom Tag. #sprecher:erzaehler
Ich muss dir etwas sagen. Ich glaube, du weißt es schon. #sprecher:ambrose #stimmung:still
{esIstStillGesagt:
    Im Wald habe ich dir erzählt, dass es still geworden ist. Seit heute Mittag ist es mehr als das. #sprecher:ambrose
- else:
    Seit der Bergstation sehe ich die Stellung nicht mehr im Dunkeln. Seit heute Mittag ist es mehr als das. #sprecher:ambrose
}
Ich bin leichter. Das Brett hält mich nicht mehr so fest. #sprecher:ambrose
Er betrachtet seine Hand. Sie ist durchsichtiger als sonst. #sprecher:erzaehler
Ich könnte, glaube ich, ein paar Schritte weiter gehen, als das Brett liegt. Ich habe es nicht versucht. #sprecher:ambrose
* [„Warum nicht?“]
- Weil ich nicht weiß, ob ich dann zurückkäme. Und es gibt noch etwas, das ich sehen will. #sprecher:ambrose
Er setzt sich neben dich, die Füße im Staub. Das vierte Mal. Du hast mitgezählt. #sprecher:erzaehler
Noch eine Partie. Deine. Gegen ihn. In der großen Halle, vor allen Leuten. Dann ist es gut. #sprecher:ambrose #stimmung:friedlich
* [„Und dann gehst du.“]
- Ja. #sprecher:ambrose #pause
* [„Bleib.“]
    Du sagst es wie jemand, der fünf ist. Er lacht nicht. #sprecher:erzaehler #musik:aus #pause:4
* [„Ich weiß.“]
    Natürlich weißt du es. Vielleicht seit dem Felsbogen. #sprecher:ambrose #musik:aus #pause:4
    Du weißt, dass er gehen muss. Bleib, sagst du trotzdem. Du wolltest es nur einmal sagen. #sprecher:erzaehler
- Ich könnte bleiben. In deinem Zimmer auf der Fensterbank, in einem Geigenkasten. Ich könnte deine Partien kommentieren, bis du mich nicht mehr hören willst. #sprecher:ambrose #musik:nachtstueck
Ein Geist, der bleibt, wird ein Möbelstück, {held}. Etwas, um das man herumgeht. Ich war lange genug ein Brett. #sprecher:ambrose
In Maple Falls sitzt eine alte Frau auf einer Veranda mit zwei Stühlen. Ich möchte nicht der sein, wegen dem du einen leeren Stuhl hinstellst. #sprecher:ambrose
* [„Mrs. Calloway lernt jetzt Schach. Von Owen.“]
- Juno hat geschrieben: Sie haben einen Tisch zwischen die Stühle gestellt. #sprecher:erzaehler
Dann ist es noch besser, als ich dachte. #sprecher:ambrose #stimmung:lachtOhneSpott
Ich bin froh, dass du es gesagt hast. Es hat mich in meinem ganzen Leben niemand gebeten zu bleiben. Ich war sehr gut im Gehen. Es ist ein seltsames Geschenk, am Ende gefragt zu werden. #sprecher:ambrose
Über euch fällt ein Stern, lang und hell, bis hinter den Friedhof. #sprecher:erzaehler #teilchen:sternschnuppen #klang:sternschnuppe
Ich habe mir auch etwas gewünscht. Ich bin tot, mir kann nichts mehr misslingen. #sprecher:ambrose
Dass du im Finale einen Fehler machst. Einen kleinen, den du merkst. Und dass du danach den besten Zug deines Lebens spielst. #sprecher:ambrose
* [„Das ist ein gemeiner Wunsch.“]
- Es ist der schönste, den ich habe. #sprecher:ambrose #stimmung:friedlich #musik:ambrose.held.gespraech
-> END

// ---------------------------------------------------------------- Ansehen (Runde 6)

=== ortsschild ===
Am Ortseingang stehen zwei Pfosten. Das Schild dazwischen fehlt. #sprecher:erzaehler
-> END

=== steckbrief ===
Am Brett vor dem Sheriffbüro klebt ein Steckbrief, von der Sonne fast weiß: „Gesucht: Kartenzinker. 50 Dollar.“ Das Gesicht ist nicht mehr zu erkennen. #sprecher:erzaehler
-> END

=== amboss ===
Ein rostiger Amboss im Sand. Ein Hufeisen liegt noch darauf, als wäre der Schmied nur kurz weg. #sprecher:erzaehler
-> END

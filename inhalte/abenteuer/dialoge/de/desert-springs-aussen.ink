// Ort: Desert Springs außen (Akt 3): Hauptstraße mit Motel, Diner, Tankstelle und altem Bahnhof
// (Story-Bibel 19.6).
//
// Szenen der Bibel (Abschnitt 20): Ankunft vom Canyon, 74 Buck an der Tankstelle (Begegnung
// desertSprings.buck, Blitz, Sprüche erlaubt, beim ersten Sieg die Karte Großes Maul), 79 Abend am
// Motel (Anruf von Juno, Nachricht von Victor), 80 Rückweg und Ausblick (Ende von Akt 3, Reise
// nach Port Delacroix oder Maple Falls).
// Einstiege wie in orte.json: ankunft_zu_fuss, buck, canyon, motel, bahnhof, highway (Akt 4:
// Aufbruch über Weg 7 nach Summit City, Szene 81 der Bibel).
//
// Variablen: ausgangDesertSpringsBuck und nadelDesertSprings setzt die Hülle (R42);
// versoehnungGesehen setzt weg-delacroix-desert.ink; die übrigen setzt diese Datei.

EXTERNAL beginnePartie(begegnung)
EXTERNAL gibKarte(kennung)
EXTERNAL reise(karte, ausloeser)

VAR ankunftDesertSpringsGesehen = false
VAR versoehnungGesehen = false
VAR buckGetroffen = false
VAR buckKarteGegeben = false
VAR ausgangDesertSpringsBuck = ""
VAR nadelDesertSprings = 0
VAR abendMotelGesehen = false
VAR endeAkt3Gesehen = false
VAR highwayAufbruchGesehen = false

// ---------------------------------------------------------------- Ankunft und Wege

=== ankunft_zu_fuss ===
{ankunftDesertSpringsGesehen:
    Der Pfad aus dem Canyon endet an der Hauptstraße von Desert Springs. #sprecher:erzaehler
    -> END
}
// Kapitel 43 (Roman): Desert Springs ist eine Straße. Musik sparsam, Windspiel.
~ ankunftDesertSpringsGesehen = true
Desert Springs ist eine Straße. Eine Tankstelle, ein Diner, an dessen Leuchtreklame drei Buchstaben fehlen. #sprecher:erzaehler #musik:desertSprings #geraeusch:wueste
Ein Motel mit zwölf Türen in zwölf Farben. Im Schwimmbecken ohne Wasser hat jemand Kakteen gepflanzt. #sprecher:erzaehler
Am Ortseingang ein Schild: „Desert Springs. Einwohner: 211. Schachspieler: 211.“ #sprecher:erzaehler #bild:ortsschild_211
{versoehnungGesehen:
    Eine Stadt, so klein wie ein Brett. Und trotzdem spielt man hier. #sprecher:ambrose #bild:aus
}
-> END

=== canyon ===
Der Pfad führt zurück in den Canyon, zum Felsbogen. #sprecher:erzaehler
-> END

// ---------------------------------------------------------------- Buck an der Tankstelle

=== buck ===
{
- not buckGetroffen: -> buck_erstes_treffen
- ausgangDesertSpringsBuck == "" or ausgangDesertSpringsBuck == "abgebrochen": -> buck_angebot
- ausgangDesertSpringsBuck == "niederlage": -> buck_nach_niederlage
- else: -> buck_nach_sieg
}

=== buck_erstes_treffen ===
~ buckGetroffen = true
An der Tankstelle steht ein Brett auf der Motorhaube eines Pick-ups. Daneben lehnt ein Mann mit Zahnstocher. #sprecher:erzaehler #klang:zapfsaeule
Stimmt nicht ganz, das mit den 211. Der Pfarrer weigert sich. Aber seine Frau spielt für zwei. #sprecher:buck
Er spuckt den Zahnstocher aus. Buck. Drei Minuten. Hier draußen fährt keiner langsam. Auch nicht am Brett. #sprecher:buck
-> buck_angebot

=== buck_angebot ===
Drei Minuten, zwei Sekunden je Zug. Eine Stellung, du hast Weiß. Na, traust du dich? #sprecher:buck
* [„Klar.“]
    {versoehnungGesehen:
        Er redet so schnell, wie er zieht. Lass ihn reden. Du denkst. #sprecher:ambrose
    }
    ~ beginnePartie("desertSprings.buck")
    -> END
* [„Nicht jetzt.“]
    Die Tankstelle hat immer offen. Ich auch. #sprecher:buck
    -> END

=== buck_nach_sieg ===
{not buckKarteGegeben:
    ~ buckKarteGegeben = true
    Na, jetzt willst du's aber wissen! Hier, die hab ich mal einem Lkw-Fahrer abgewonnen. #sprecher:buck #stimmung:lacht
    {versoehnungGesehen: Das war beinahe fein. #sprecher:ambrose}
    ~ gibKarte("grossesMaul")
}
Schnell und gut. Das gibt's hier draußen selten. Noch eine Runde? #sprecher:buck
+ [„Noch eine.“]
    ~ beginnePartie("desertSprings.buck")
    -> END
+ [„Ich muss weiter.“]
    Gute Fahrt! Und tank voll. #sprecher:buck
    -> END

=== buck_nach_niederlage ===
Zu langsam an der Zapfsäule! Noch mal? #sprecher:buck #stimmung:lacht
+ [„Revanche.“]
    ~ beginnePartie("desertSprings.buck")
    -> END
+ [„Nicht jetzt.“]
    -> END

// ---------------------------------------------------------------- Abend am Motel

=== motel ===
{
- nadelDesertSprings > 0 and not abendMotelGesehen: -> abend_motel
- else:
    {~Am Motel „Zur Quelle“ summt die Leuchtschrift. Zwei Buchstaben fehlen.|Vor dem Motel steht ein Liegestuhl. Auf dem Tisch daneben ein Fernschachbrief mit Briefmarken aus aller Welt.} #sprecher:erzaehler
    -> END
}

=== abend_motel ===
// Kapitel 46 (Roman): Nacht am Beckenrand, Sternschnuppen (#teilchen), eigenes Stück motel.nacht;
// Victors Nachricht mit victor.maschine.
~ abendMotelGesehen = true
In der Nacht sitzt du am Rand des Schwimmbeckens, die Füße zwischen den Kakteen. Die Sterne gehen bis auf den Boden hinunter. #sprecher:erzaehler #licht:nacht #teilchen:sternschnuppen #musik:motel.nacht
Das Telefon summt. Juno. #sprecher:erzaehler #klang:handy
Sieben! Ich hab's nachgezählt. Blatt, Buch, Achteck, Zahnrad, Glas, Lyra, Kaktus. Der Kaktus kriegt Glitzer. #sprecher:juno #stimmung:froh
Wie geht es ihm? #sprecher:juno
Er steht am Beckenrand und sieht hinauf. #sprecher:erzaehler
* [„Er hat gelacht. Eine Viertelstunde lang.“]
- Worüber? #sprecher:juno
* [„Über sich.“]
- Oh. Oh, das ist gut. Das schreib ich auf. #sprecher:juno
Als sie aufgelegt hat, ist da noch eine Nachricht. Ohne Gruß. „Ich glaube dir. Wegen des Bretts.“ #sprecher:erzaehler
Eine Minute später: „Landesmeisterschaft im Sommer. Nova spielt auch. Mein Vater hat mir einen Trainer besorgt. Er ist kein Mensch.“ #sprecher:erzaehler #musik:victor.maschine
Der zweite Satz gefällt dir nicht. #sprecher:erzaehler #pause
Das Tablet von dem Jungen mit den Zahlen. Es liegt in deinem Rucksack. Gib es ihm zurück, wenn du ihn siehst. #sprecher:ambrose #musik:motel.nacht
Ich brauche es nicht mehr. #sprecher:ambrose #stimmung:still
* [„Sicher?“]
- Nein. Aber ich hoffe es. Und ich habe es geprüft, so gut ich kann. #sprecher:ambrose #stimmung:lachtOhneSpott
-> END

// ---------------------------------------------------------------- Bahnhof und Ende von Akt 3

=== bahnhof ===
{
- abendMotelGesehen and not endeAkt3Gesehen: -> bahnhof_ende
- endeAkt3Gesehen: -> bahnhof_fahrten
- else:
    Am alten Bahnhof hält einmal am Tag ein Zug. In der Halle ist ein Antiquariat. #sprecher:erzaehler
    -> END
}

=== bahnhof_ende ===
// Kapitel 46, Schluss: Mama holt {held} ab; Mamas Thema, Schluss auf dem Endspielmotiv.
~ endeAkt3Gesehen = true
Mama ist da. Sonnenbrand auf der Nase, das blaue Heft unter dem Arm. Es ist dicker geworden. #sprecher:erzaehler #musik:mama.schnee
Port Delacroix lässt grüßen. Das Dach vom Musikhaus ist drauf. Miss Odile sagt, das nächste Mal hängst du das Schild auf. #sprecher:mutter #stimmung:froh
Und danach: Summit City. Großmeisterin Ward. Ich hab schon Urlaub eingereicht. #sprecher:mutter
* [„Wer ist das?“]
- Die Beste im Staat. Sie hat mich mal in neunzehn Zügen geschlagen, als ich sechzehn war. #sprecher:mutter
Sie spielt Endspiele, als hätte sie alle Zeit der Welt. Kalt wie ein Berg. #sprecher:mutter
Ein Endspiel. Auf Junos Reisebrett steht eine Stellung, die seit hundertsechzig Jahren auf einen einzigen Zug wartet. #sprecher:erzaehler #musik:endspiel
Schwarz am Zug. #sprecher:erzaehler #pause:3
-> bahnhof_fahrten

=== bahnhof_fahrten ===
Der Zug fährt gleich. Wohin? #sprecher:erzaehler
+ [„Nach Port Delacroix.“]
    ~ reise("portDelacroix.aussen", "wuestenzug")
    -> END
+ [„Nach Hause, nach Maple Falls.“]
    ~ reise("mapleFalls.park", "bushaltestelle")
    -> END
+ [„Noch nicht.“]
    -> END

// ---------------------------------------------------------------- Highway nach Summit City (Akt 4)

=== highway ===
{highwayAufbruchGesehen:
    Der Highway führt nach Norden, durch die Wüste, Richtung Berge. #sprecher:erzaehler
    -> END
}
~ highwayAufbruchGesehen = true
Am Ende der Hauptstraße beginnt der Highway. Mama klimpert mit einem Autoschlüssel. #sprecher:erzaehler
Dot leiht uns ihr Auto. Es ist alt, aber es fährt, und wir sehen mehr als vom Zug aus. #sprecher:mutter
Juno kommt in Summit City dazu, mit dem Bus. Sommerferien. #sprecher:mutter #stimmung:froh
Ein Auto. Zu meiner Zeit nahm man die Postkutsche, und die Postkutsche nahm einen nicht immer mit. #sprecher:ambrose #stimmung:lacht
Die Straße flimmert. Nach einer Stunde taucht ein Diner mit Neonschild auf. Mama hält an. #sprecher:erzaehler
-> END

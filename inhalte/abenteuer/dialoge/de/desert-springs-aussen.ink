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
~ ankunftDesertSpringsGesehen = true
Der Pfad aus dem Canyon endet an einer staubigen Hauptstraße. Ein Motel, ein Diner, eine Tankstelle, ein alter Bahnhof. #sprecher:erzaehler
Aus einer offenen Garage am Motel klappern Figuren. Jemand ruft: „Schach!“ #sprecher:erzaehler
{versoehnungGesehen:
    Eine Stadt, so klein wie ein Brett. Und trotzdem spielt man hier. #sprecher:ambrose
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
An der Tankstelle lehnt ein Mann mit Schirmmütze an einem Pick-up. Auf der Motorhaube steht ein Brett. #sprecher:erzaehler
Buck! Benzin, Wasser und Schach, alles aus einer Hand. #sprecher:buck #stimmung:froh
Hier draußen fährt keiner langsam. Auch nicht am Brett. #sprecher:buck
-> buck_angebot

=== buck_angebot ===
Drei Minuten, zwei Sekunden je Zug. Eine Stellung, du hast Weiß. Na, traust du dich? #sprecher:buck
* [„Klar.“]
    {versoehnungGesehen:
        Er redet so schnell, wie er zieht. Lass ihn reden. Du denkst. #sprecher:ambrose
    }
    ~ beginnePartie("desertSprings.buck")
    -> END
* [„Später.“]
    Die Tankstelle hat immer offen. Ich auch. #sprecher:buck
    -> END

=== buck_nach_sieg ===
{not buckKarteGegeben:
    ~ buckKarteGegeben = true
    Na, jetzt willst du's aber wissen! Hier, die hab ich mal einem Lkw-Fahrer abgewonnen. #sprecher:buck #stimmung:lacht
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
+ [„Später.“]
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
~ abendMotelGesehen = true
Nachts ist es kühl. Über dem Motel stehen mehr Sterne, als du je gesehen hast. #sprecher:erzaehler
Dein Telefon klingelt. Juno zählt die Nadeln, laut und langsam. #sprecher:erzaehler
Eins, zwei, drei, vier, fünf, sechs, sieben! Sieben Nadeln! Ich klebe sie alle ins Tagebuch! #sprecher:juno #stimmung:froh
Dann kommt eine Nachricht von Victor: „Ich glaube dir. Wegen des Bretts.“ #sprecher:erzaehler
Und gleich danach: „Landesmeisterschaft im Sommer. Ich hab gehört, Nova spielt auch.“ #sprecher:erzaehler #pause
Im Rucksack liegt noch das Tablet von Theo. Ambrose sieht es lange an. #sprecher:erzaehler
Gib es Theo zurück, wenn du ihn siehst. Ich brauche es nicht mehr. #sprecher:ambrose #stimmung:still
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
~ endeAkt3Gesehen = true
Am Bahnsteig wartet Mama mit zwei Fahrkarten und einer Thermoskanne. #sprecher:erzaehler
Nächster Halt: Summit City. Großmeisterin Ward. #sprecher:mutter
Ich hab schon Urlaub eingereicht. #sprecher:mutter #stimmung:froh
Summit City. Dann wird es ernst. #sprecher:ambrose
Aber diesmal sind wir zu zweit. Zu dritt, mit deiner Mutter. #sprecher:ambrose
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
Die Fahrkarten hab ich zurückgegeben. Dot leiht uns ihr Auto. Es ist alt, aber es fährt, und wir sehen mehr als vom Zug aus. #sprecher:mutter
Juno kommt in Summit City dazu, mit dem Bus. Sommerferien. #sprecher:mutter #stimmung:froh
Ein Auto. Zu meiner Zeit nahm man die Postkutsche, und die Postkutsche nahm einen nicht immer mit. #sprecher:ambrose #stimmung:lacht
Die Straße flimmert. Nach einer Stunde taucht ein Diner mit Neonschild auf. Mama hält an. #sprecher:erzaehler
-> END

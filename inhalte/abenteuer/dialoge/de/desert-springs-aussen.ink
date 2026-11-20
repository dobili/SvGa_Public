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
// Aus capital-arena-aussen.ink: Nach dem Abschied (Szene 109) spricht Ambrose nicht mehr
// (Story-Bibel Abschnitt 33, Frage 5; Entscheidung Q21-5). Hier nur gelesen.
VAR abschiedGesehen = false

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
Ambrose schweigt. Das Schild sagt alles. #sprecher:erzaehler #bild:aus
-> END

=== canyon ===
Der Pfad führt zurück in den Canyon, zum Felsbogen. #sprecher:erzaehler
-> END

// ---------------------------------------------------------------- Buck an der Tankstelle

=== buck ===
{
- not buckGetroffen: -> buck_erstes_treffen
- ausgangDesertSpringsBuck == "" or ausgangDesertSpringsBuck == "abgebrochen": -> buck_angebot
- ausgangDesertSpringsBuck == "remis": -> buck_nach_remis
- ausgangDesertSpringsBuck == "niederlage": -> buck_nach_niederlage
- else: -> buck_nach_sieg
}

=== buck_erstes_treffen ===
~ buckGetroffen = true
An der Tankstelle steht ein Brett auf der Motorhaube eines Pick-ups. Daneben lehnt ein Mann mit Zahnstocher. #sprecher:erzaehler #klang:zapfsaeule
Das Schild am Ortseingang? Stimmt nicht ganz, das mit den 211. Der Pfarrer weigert sich. #sprecher:buck #stimmung:lacht
Aber seine Frau spielt für zwei. #sprecher:buck #stimmung:lacht
Er spuckt den Zahnstocher aus. #sprecher:erzaehler
Buck. Hier draußen fährt keiner langsam. #sprecher:buck #stimmung:laechelt
Auch nicht am Brett. #sprecher:buck #stimmung:laechelt
-> buck_angebot

=== buck_angebot ===
Drei Minuten, zwei Sekunden je Zug. Eine Stellung, du hast Weiß. #sprecher:buck #stimmung:laechelt
Na, traust du dich? #sprecher:buck #stimmung:laechelt
+ [„Klar.“]
    {versoehnungGesehen and not abschiedGesehen:
        Er redet so schnell, wie er zieht. Lass ihn reden. #sprecher:ambrose #stimmung:laechelt
        Du denkst. #sprecher:ambrose #stimmung:laechelt
    }
    ~ beginnePartie("desertSprings.buck")
    -> END
+ [„Nicht jetzt.“]
    Die Tankstelle hat immer offen. Ich auch. #sprecher:buck #stimmung:lacht
    -> END

=== buck_nach_sieg ===
{not buckKarteGegeben:
    ~ buckKarteGegeben = true
    Mitten in der Partie hast du einen guten Zug gefunden und gesagt: „Na, das wird teuer.“ Buck hat sofort gezogen, zu schnell. #sprecher:erzaehler
    Na, jetzt willst du's aber wissen! Hier, die Karte hab ich mal einem Lkw-Fahrer abgewonnen. #sprecher:buck #stimmung:lacht
    {versoehnungGesehen and not abschiedGesehen: Das war beinahe fein. #sprecher:ambrose #stimmung:laechelt}
    ~ gibKarte("grossesMaul")
}
Schnell und gut. Das gibt's hier draußen selten. #sprecher:buck #stimmung:laechelt
Noch eine Runde? #sprecher:buck #stimmung:laechelt
+ [„Noch eine.“]
    ~ beginnePartie("desertSprings.buck")
    -> END
+ [„Ich muss weiter.“]
    Gute Fahrt! Und tank voll. #sprecher:buck #stimmung:laechelt
    -> END

=== buck_nach_niederlage ===
Zu langsam an der Zapfsäule! Noch mal? #sprecher:buck #stimmung:lacht
+ [„Revanche.“]
    ~ beginnePartie("desertSprings.buck")
    -> END
+ [„Nicht jetzt.“]
    -> END

// Remis im Stellungsduell oder Endspiel (Regelwerk R13, R13a): Vorteil unter dem Mindest-
// vorteil. Vorher ging es in buck_nach_sieg mit „gewonnen“ und Karte (schwacher Spieler im
// Spieler-Durchlauf, 19.11.2026).
=== buck_nach_remis ===
Unentschieden! Volltanken reicht nicht, du musst auch losfahren. #sprecher:buck #stimmung:laechelt
Noch mal? #sprecher:buck #stimmung:laechelt
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
Sieben! Ich hab's nachgezählt. #sprecher:juno #stimmung:froh
Blatt, Buch, Achteck, Zahnrad, Glas, Lyra, Kaktus. Der Kaktus kriegt Glitzer. #sprecher:juno #stimmung:froh
Wie geht es ihm? #sprecher:juno #stimmung:nachdenklich
Er steht am Beckenrand und sieht hinauf. #sprecher:erzaehler
* [„Er hat gelacht. Eine Viertelstunde lang.“]
- Worüber? #sprecher:juno #stimmung:ueberrascht
* [„Über sich.“]
- Oh. Oh, das ist gut. #sprecher:juno #stimmung:laechelt
Das schreib ich auf. #sprecher:juno #stimmung:laechelt
Als sie aufgelegt hat, ist da noch eine Nachricht. Ohne Gruß. #sprecher:erzaehler
„Port Delacroix hat sich herumgesprochen. Wer schummelt, schleppt kein altes Brett mit.“ #sprecher:erzaehler
„Ich glaube dir. Wegen des Bretts.“ #sprecher:erzaehler
Eine Minute später: „Landesmeisterschaft im Sommer. Nova spielt auch.“ #sprecher:erzaehler
„Mein Vater hat mir einen Trainer besorgt. Er ist kein Mensch.“ #sprecher:erzaehler
Der letzte Satz gefällt dir nicht. #sprecher:erzaehler #pause
Das Tablet von dem Jungen mit den Zahlen. Es liegt in deinem Rucksack. #sprecher:ambrose #stimmung:nachdenklich #musik:motel.nacht
Gib es ihm zurück, wenn du ihn siehst. #sprecher:ambrose #stimmung:nachdenklich
Ich brauche es nicht mehr. #sprecher:ambrose #stimmung:still
* [„Sicher?“]
- Nein. Aber ich hoffe es. #sprecher:ambrose #stimmung:lachtOhneSpott
Und ich habe es geprüft, so gut ich kann. #sprecher:ambrose #stimmung:lachtOhneSpott
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
Mama ist da. Sonnenbrand auf der Nase, das blaue Heft unter dem Arm. #sprecher:erzaehler #musik:mama.schnee
Es ist dicker geworden. #sprecher:erzaehler
Port Delacroix lässt grüßen. Am Musikhaus decken sie das Dach, und Miss Odile sagt, das Schild hängst du auf. #sprecher:mutter #stimmung:froh
Und danach: Summit City. Großmeisterin Ward. #sprecher:mutter #stimmung:laechelt
Ich hab schon Urlaub eingereicht. #sprecher:mutter #stimmung:laechelt
* [„Wer ist das?“]
- Die Beste im Staat. Sie hat mich mal in neunzehn Zügen geschlagen, als ich sechzehn war. #sprecher:mutter #stimmung:lacht
Sie spielt Endspiele, als hätte sie alle Zeit der Welt. Kalt wie ein Berg. #sprecher:mutter #stimmung:nachdenklich
Ein Endspiel. Auf Junos Reisebrett steht eine Stellung, die seit hundertsechzig Jahren auf einen einzigen Zug wartet. #sprecher:erzaehler #musik:endspiel
Schwarz am Zug. #sprecher:erzaehler #pause:3
-> END

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
{not endeAkt3Gesehen:
    Am Ende der Hauptstraße beginnt der Highway nach Norden. Zu Fuß ist die Wüste zu weit. #sprecher:erzaehler
    -> END
}
{highwayAufbruchGesehen:
    Der Highway führt nach Norden, durch die Wüste, Richtung Berge. #sprecher:erzaehler
    -> END
}
~ highwayAufbruchGesehen = true
Es ist Sommer, und du bist fünfzehn. #sprecher:erzaehler
Juno hat dir eine Seite im Tagebuch geschenkt, leer, mit einem Rahmen aus Glitzer: Für das, was noch kommt. #sprecher:erzaehler
Am Ende der Hauptstraße beginnt der Highway. Mama klimpert mit einem Autoschlüssel. #sprecher:erzaehler
Dot leiht uns ihr Auto. Drei Wochen Urlaub, und wir sehen mehr als vom Zug aus. #sprecher:mutter #stimmung:laechelt
Juno kommt in Summit City dazu, mit dem Bus. Sommerferien. #sprecher:mutter #stimmung:froh
Ein Auto. Zu meiner Zeit nahm man die Postkutsche, und die Postkutsche nahm einen nicht immer mit. #sprecher:ambrose #stimmung:lacht
* [Weiterfahren]
- Ambrose ist leichter seit dem Canyon. Er lobt einen Bauern, der einfach ein Feld vorrückt. #sprecher:erzaehler
Hässlich. Und vollkommen richtig. #sprecher:ambrose #stimmung:lacht
Ich beginne, an hässlichen Zügen Gefallen zu finden. Sag es niemandem. #sprecher:ambrose #stimmung:lacht
Die Straße flimmert. Nach einer Stunde taucht ein Diner auf, über der Tür ein Neonschild: „ING'S DINER“. #sprecher:erzaehler
Das K fehlt. Mama hält zum Tanken. #sprecher:erzaehler
-> END

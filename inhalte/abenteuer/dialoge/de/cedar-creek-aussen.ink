// Ort: Ortskern von Cedar Creek mit Bushaltestelle und Steg (Akt 1). Figuren: Rosa, Victor.
// Gegenstände: Plakat, Steg. Dialog-Auslöser: busZurueck.
//
// Szenen der Story-Bibel (docs/spiel/05_Story_Bibel.md, Abschnitt 4): 14 Ankunft
// (akt1.ankunftCedarCreek), 21 Victor in Cedar Creek, 22 Sternennacht (Quest
// cedarCreek.sternennacht, Okafor abgelenkt), 23 Rosa am Steg (Begegnung cedarCreek.rosaDuell),
// 25 Ende von Akt 1 (akt1.ende), dazu die Rückfahrt nach Maple Falls.
// Einstiege wie in orte.json: „rosa“, „victor“, „plakat“, „steg“, „bus_zurueck“.
// Die Ankunft (Coach, Juno, Sam) läuft beim ersten Gespräch mit irgendetwas hier draußen, weil
// beim Aussteigen kein Dialog von selbst startet (Vorschlag im Bericht mittel-1).
//
// Variablen: ausgangCedarCreekRosaDuell und nadelCedarCreek setzt die Hülle (Vorschlag V-Dialog);
// maeEingeladen setzt cedar-creek-bibliothek.ink; die übrigen setzt diese Datei.

EXTERNAL beginnePartie(begegnung)
EXTERNAL setzeZustand(gegner, faktor, grund)
EXTERNAL reise(karte, ausloeser)

VAR held = "Du"
VAR ambroseVertrauen = 0
VAR ankunftCedarCreekGesehen = false
VAR plakatGesehen = false
VAR maeEingeladen = false
VAR sternennachtGesehen = false
VAR rosaGetroffen = false
VAR ausgangCedarCreekRosaDuell = ""
VAR victorCedarCreekGesehen = false
VAR nadelCedarCreek = 0
VAR endeAkt1Gesehen = false

// ---------------------------------------------------------------- Ankunft

=== ankunft ===
~ ankunftCedarCreekGesehen = true
Der gelbe Schulbus hält mit einem Seufzer. Rote Zedern, ein Bach, eine Bibliothek aus Backstein. #sprecher:erzaehler #klang:bus
Auswärtsspiel, Leute! Wir spielen im Bibliotheksclub. #sprecher:coachDelgado #klang:pfiff
Die Chefin dort ist eine Legende, die niemand kennt. #sprecher:coachDelgado
Eine Bibliothek als Club. Spielen die da flüsternd? #sprecher:sam
Ich hab Kekse dabei. Für die Nerven. Und fürs Tagebuch, falls wir gewinnen. #sprecher:juno #stimmung:froh
Bevor ihr reingeht: Seht euch ruhig um. Der Bus fährt erst am Abend zurück. #sprecher:coachDelgado
Eine Stadt mit Bäumen, die älter sind als ich. Endlich etwas, das mich nicht jung fühlen lässt. #sprecher:ambrose
-> END

// ---------------------------------------------------------------- Plakat

=== plakat ===
{not ankunftCedarCreekGesehen: -> ankunft}
~ plakatGesehen = true
Ein großes, glänzendes Plakat: „Perfect Move – Schach für die Zukunft. Bald auch in deiner Stadt.“ #sprecher:erzaehler
Darauf ein Schachbrett aus Licht und eine Hand, die keinem Menschen gehört. #sprecher:erzaehler
Ein Plakat, das droht. Wie reizend. #sprecher:ambrose #stimmung:streng
* [„Das ist die Firma von Victors Vater.“]
    Dann wissen wir, wer den Leim angerührt hat. #sprecher:ambrose
* [„Vielleicht ist das gar nicht so schlecht.“]
    Vielleicht. Eine Maschine, die Schach spielt. #sprecher:ambrose
    Ich gestehe: Ich bin neugierig. #sprecher:ambrose
- -> END

// ---------------------------------------------------------------- Steg

=== steg ===
{
- not ankunftCedarCreekGesehen: -> ankunft
- nadelCedarCreek > 0 and not endeAkt1Gesehen: -> ende_akt1
- maeEingeladen and not sternennachtGesehen and nadelCedarCreek == 0: -> sterne_angebot
- else: -> steg_alltag
}

=== sterne_angebot ===
Es wird dunkel. Am Steg sitzen Mae, Dex und Juno auf einer Decke. #sprecher:erzaehler
Mrs. Okafor hat eine Thermoskanne dabei. #sprecher:erzaehler
Da bist du ja! Gleich geht es los! #sprecher:mae #stimmung:froh
* [Dazusetzen]
    -> sterne
* [„Ich bin zu müde. Ein andermal.“]
    Okay. Morgen erzähle ich dir alles. Jede einzelne Sternschnuppe. #sprecher:mae
    -> END

=== sterne ===
~ sternennachtGesehen = true
Ihr liegt auf der Decke und schaut nach oben. Der Bach plätschert, irgendwo quakt ein Frosch. #sprecher:erzaehler
Da! Und da! Drei auf einmal! #sprecher:mae #stimmung:froh
Das war ein Flugzeug. #sprecher:dex
Mrs. Okafor erzählt von den Sternen über Lagos. Es wird spät, dann sehr spät. #sprecher:erzaehler
Keiner will nach Hause. #sprecher:erzaehler
Zu meiner Zeit sah man über dem Mississippi mehr Sterne als Wasser. Diese hier sind auch nicht übel. #sprecher:ambrose
Um Mitternacht gähnt Mrs. Okafor. So spät war ich seit Jahren nicht wach. #sprecher:okafor
Morgen bin ich bestimmt müde. #sprecher:okafor
~ setzeZustand("cedarCreek.okafor", 1.3, "zustand.schlechtGeschlafen")
Du hast das nicht geplant, {held}. Es war einfach ein schöner Abend. #sprecher:ambrose
Aber du wirst es morgen am Brett merken. #sprecher:ambrose
-> END

=== ende_akt1 ===
~ endeAkt1Gesehen = true
Die Sonne geht hinter den Zedern unter. Am Steg ist es still, nur der Bach redet. #sprecher:erzaehler
* [„Ambrose? Was willst du eigentlich?“]
    Was ich will? Das hat mich seit hundertsechzig Jahren niemand gefragt. #sprecher:ambrose
* [„Du warst heute im Archiv sehr still.“]
    Ich habe nachgedacht. Das kann ich gut, ich habe ja Zeit. #sprecher:ambrose
- Eine Partie ohne Makel. Eine, über die man in hundert Jahren noch spricht. #sprecher:ambrose
Ich hatte sie fast. Dann sagte jemand „Später“. #sprecher:ambrose #stimmung:traurig #pause
* [„Dann spielen wir sie eben jetzt.“]
    ~ ambroseVertrauen = ambroseVertrauen + 1
    Ambrose lacht. Zum ersten Mal ohne Spott. #sprecher:erzaehler
    Jetzt. Ein schönes Wort. Ich hatte vergessen, wie es klingt. #sprecher:ambrose #stimmung:lacht
* [„Ich will erst mal besser werden.“]
    Das ist der richtige Anfang. Die makellose Partie kommt am Ende, nie am Anfang. #sprecher:ambrose
- Im Bus liest Juno aus dem Tagebuch vor: zwei Clubnadeln. Dann piept ihr Handy. #sprecher:erzaehler #klang:bus
Oh. Der Schachclub im Park von Riverton wird „neu aufgestellt“. #sprecher:juno
Mit Perfect Move. #sprecher:juno
Neu aufgestellt. So nennt man es, wenn jemand die Figuren vom Brett wischt. #sprecher:ambrose #stimmung:streng
-> END

=== steg_alltag ===
{nadelCedarCreek > 0:
    Der Steg liegt still in der Abendsonne. Der Bus nach Maple Falls wartet an der Haltestelle. #sprecher:erzaehler
- else:
    Der Bach glitzert unter dem Steg. Hier sieht man abends bestimmt gut die Sterne. #sprecher:erzaehler
}
-> END

// ---------------------------------------------------------------- Rosa

=== rosa ===
{
- not ankunftCedarCreekGesehen: -> ankunft
- not rosaGetroffen: -> rosa_erstes_treffen
- ausgangCedarCreekRosaDuell == "": -> rosa_angebot
- ausgangCedarCreekRosaDuell == "niederlage": -> rosa_nach_niederlage
- else: -> rosa_nach_sieg
}

=== rosa_erstes_treffen ===
~ rosaGetroffen = true
Am Ende des Stegs sitzt eine Frau mit Angel. Neben ihr ein Brett mit Magnetfiguren. #sprecher:erzaehler
Ruhig, ruhig. Der Fisch merkt, wenn du zappelst. #sprecher:rosa
Der Gegner auch. Ich bin Rosa. #sprecher:rosa
-> rosa_angebot

=== rosa_angebot ===
Ich stelle dir ein Mattbild auf. Du hast Weiß und einen Vorteil, zehn Züge lang. #sprecher:rosa
Hältst du ihn, hast du gewonnen. #sprecher:rosa
* [„Abgemacht.“]
    -> rosa_duell
* [„Später.“]
    Die Fische warten. Ich auch. #sprecher:rosa
    -> END

=== rosa_duell ===
~ beginnePartie("cedarCreek.rosaDuell")
Rosa legt die Angel quer über die Knie und stellt die Figuren auf. #sprecher:erzaehler
-> END

=== rosa_nach_sieg ===
Nicht gezappelt. Gut. Noch eine Runde, während die Fische schlafen? #sprecher:rosa
Ruhige Hände, ruhiger Kopf. Das hatte ich in deinem Alter nicht. #sprecher:ambrose
+ [„Noch eine.“]
    -> rosa_duell
+ [„Später.“]
    -> END

=== rosa_nach_niederlage ===
Gezappelt. Der Vorteil ist weggeschwommen. Noch mal? #sprecher:rosa
Ein Vorteil ist wie ein Fisch an der Leine. Man muss ihn halten, nicht nur fangen. #sprecher:ambrose
+ [„Revanche.“]
    -> rosa_duell
+ [„Später.“]
    -> END

// ---------------------------------------------------------------- Victor

=== victor ===
{
- not ankunftCedarCreekGesehen: -> ankunft
- not victorCedarCreekGesehen: -> victor_tablet
- else: -> victor_alltag
}

=== victor_tablet ===
~ victorCedarCreekGesehen = true
An der Bushaltestelle sitzt Victor allein. Auf seinem Tablet leuchtet ein Brett, er spielt gegen das Programm. #sprecher:erzaehler
Er sieht nicht auf. #sprecher:erzaehler
* [„Macht dir das eigentlich Spaß?“]
    Er schweigt lange. #sprecher:erzaehler #pause
    Das ist keine Frage, die man beim Training stellt. #sprecher:victor #stimmung:muede
    -> victor_tablet_ende
* [„Hallo, Victor.“]
    Hallo. Ich trainiere. #sprecher:victor #stimmung:kalt
    -> victor_tablet_ende
* [Leise weitergehen]
    -> END

=== victor_tablet_ende ===
Das Programm auf dem Tablet zieht, ohne zu zögern. Victor verliert die Partie und startet sofort eine neue. #sprecher:erzaehler
Ambrose sagt kein Wort. Das ist ungewöhnlich für ihn. #sprecher:erzaehler
-> END

=== victor_alltag ===
Victor spielt weiter auf seinem Tablet. Er sieht nicht auf. #sprecher:erzaehler
-> END

// ---------------------------------------------------------------- Rückfahrt

=== bus_zurueck ===
{
- not ankunftCedarCreekGesehen: -> ankunft
- endeAkt1Gesehen:
    Der Bus nach Maple Falls. Die Fenster sind golden vom Abendlicht. #sprecher:erzaehler #klang:bus
- nadelCedarCreek > 0:
    Der Bus nach Maple Falls. Ambrose wollte dir am Steg noch etwas sagen. #sprecher:erzaehler
- else:
    Der Linienbus nach Maple Falls fährt jede Stunde. Das Auswärtsspiel läuft noch. #sprecher:erzaehler
}
* [Nach Maple Falls fahren]
    Der Bus rollt die Landstraße entlang. Hinter dir werden die Zedern kleiner. #sprecher:erzaehler
    ~ reise("mapleFalls.park", "bushaltestelle")
    -> END
* [Noch bleiben]
    -> END

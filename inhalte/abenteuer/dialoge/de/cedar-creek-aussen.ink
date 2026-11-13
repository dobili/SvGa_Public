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
// Variablen: ausgangCedarCreekRosaDuell und nadelCedarCreek setzt die Hülle (regeln/dialogvariablen.ts);
// maeEingeladen setzt cedar-creek-bibliothek.ink; die übrigen setzt diese Datei.

EXTERNAL beginnePartie(begegnung)
EXTERNAL setzeZustand(gegner, faktor, grund)
EXTERNAL reise(karte, ausloeser)
EXTERNAL gibFund(kennung)

VAR held = "Du"
VAR ambroseVertrauen = 0
VAR ankunftCedarCreekGesehen = false
VAR maeEingeladen = false
VAR sternennachtGesehen = false
VAR rosaGetroffen = false
VAR ausgangCedarCreekRosaDuell = ""
VAR victorCedarCreekGesehen = false
VAR nadelCedarCreek = 0
VAR endeAkt1Gesehen = false
VAR aufbruchRivertonGesehen = false
VAR gefundenSchluessel = false
VAR nachtImLesesaal = false
VAR schildCedarGesehen = false
VAR teamAngekommen = false
VAR nadelRiverton = 0
VAR nadelIronwood = 0
VAR clubkampfZaehlGesagt = false
VAR ambroseNenntNamen = false

// ---------------------------------------------------------------- Ankunft

=== ankunft ===
// Runde 11 (VC26 bis VC30, Roman Kapitel 10 und 11): ein Knoten für beide Wege. {held} und Juno
// kommen am Freitag still an; Coach und Bus kommen erst am Samstagmorgen (team_kommt). Ambrose
// spricht in dieser Szene nur am Plakat. Später: #musik:cedarCreek (Klavier allein) nach der Uhr.
~ ankunftCedarCreekGesehen = true
{not schildCedarGesehen: Zwischen den Bäumen schlägt eine Uhr. Viermal, langsam. #sprecher:erzaehler #klang:turmuhr #pause:3}
Cedar Creek ist kleiner als Maple Falls und sieht älter aus. In der Mitte, wo woanders eine Kirche steht, steht die Bibliothek. #sprecher:erzaehler
Auf ihrer Treppe sitzen zwei Kinder, die gleich aussehen, mit Figuren in den Händen und ohne Brett. #sprecher:erzaehler
„Ich hab gewonnen!“ – „Du hast den Turm bewegt, als ich nicht geguckt hab!“ – „Du guckst nie!“ #sprecher:erzaehler
* [„Wer hat denn gewonnen?“]
    Beide zeigen auf sich. Dann aufeinander. #sprecher:erzaehler
* [Leise vorbeigehen]
    Sie verstummen und sehen euch nach. #sprecher:erzaehler
- Hier flüstert sogar die Straße. #sprecher:juno
Mrs. Okafor erwartet uns. Der Coach kommt erst morgen mit dem Bus. #sprecher:juno
-> END

// ---------------------------------------------------------------- Plakat

=== plakat ===
{not ankunftCedarCreekGesehen: -> ankunft}
{nachtImLesesaal and not teamAngekommen: -> team_kommt}
Ein großes, glänzendes Plakat: „Perfect Move – Schach für die Zukunft. Bald auch in deiner Stadt.“ #sprecher:erzaehler
Darauf ein Kind, das in einen Bildschirm lächelt. Es ist das einzige Glänzende weit und breit. #sprecher:erzaehler
Ein Plakat, das droht. Wie reizend. #sprecher:ambrose #stimmung:streng
* [„Das ist die Firma von Victors Vater.“]
    So. Dann hat die Drohung einen Namen. #sprecher:ambrose
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
- not gefundenSchluessel: -> fund_schluessel
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
    ~ nachtImLesesaal = true
    Du gehst früh hinüber in den Lesesaal. Durch das Fenster hörst du die anderen am Steg lachen. #sprecher:erzaehler
    -> END

=== sterne ===
~ sternennachtGesehen = true
Ihr liegt auf der Decke und schaut nach oben. Der Bach plätschert, irgendwo quakt ein Frosch. #sprecher:erzaehler
Da! Und da! Drei auf einmal! #sprecher:mae #stimmung:froh
Das war ein Flugzeug. #sprecher:dex
Mrs. Okafor erzählt von den Sternen über Lagos. Es wird spät, dann sehr spät. #sprecher:erzaehler
Keiner will nach Hause. #sprecher:erzaehler
// Runde 11 (Roman, Kapitel 14): Ambrose spricht nur, wenn das Brett dabei ist (die Hand auf dem
// Brett), Mrs. Okafor erzählt von ihrem Onkel. Später: #klang:sternschnuppe (heller Glockenton) und
// #musik:nachtstueck, sobald mittel-2 sie gebaut hat.
* [Die Hand auf das Brett legen]
    Das Brett liegt neben dir auf der Decke, in sein Handtuch gewickelt. #sprecher:erzaehler
    -> sterne_ambrose ->
* [Nach oben sehen]
    Über den Zedern kommen mehr Sterne heraus, als du je gesehen hast. #sprecher:erzaehler
- Als ich so alt war wie ihr, hat mein Onkel mir Schach beigebracht. Auf einem Dach in Lagos. #sprecher:okafor
Er sagte: Geduld, Grace. Die Nacht ist lang, und der Gegner wird müde vor dir. #sprecher:okafor
Ich habe sechzig Jahre geglaubt, das sei ein Rat fürs Schach. #sprecher:okafor #pause
* [„Und wofür ist er jetzt?“]
    Für alles, was lang ist. Nächte, Partien, Leben. #sprecher:okafor
* [Nichts sagen]
- 
Zu meiner Zeit sah man über dem Mississippi mehr Sterne als Wasser. Diese hier sind auch nicht übel. #sprecher:ambrose
Um Mitternacht gähnt Mrs. Okafor. So spät war ich seit Jahren nicht wach. #sprecher:okafor
Morgen bin ich bestimmt müde. #sprecher:okafor
~ setzeZustand("cedarCreek.okafor", 1.3, "zustand.schlechtGeschlafen")
Du hast das nicht geplant, {held}. Es war einfach ein schöner Abend. #sprecher:ambrose
Aber du wirst es morgen am Brett merken. #sprecher:ambrose
// Runde 11: Die Nacht verbringen {held} und Juno im Lesesaal (Roman, Kapitel 10 und 14).
~ nachtImLesesaal = true
Nach Mitternacht geht ihr hinüber in den Lesesaal. Die Matten liegen zwischen den Regalen. #sprecher:erzaehler
-> END

=== ende_akt1 ===
~ endeAkt1Gesehen = true
Die Sonne geht hinter den Zedern unter. Am Steg ist es still, nur der Bach redet. #sprecher:erzaehler
// Runde 11 (Roman, Kapitel 16): erst der Fehler, dann der Wunsch. Den Fehler gesteht Ambrose
// nur, wenn er im Clubkampf „Lass mich“ gesagt hat (clubkampfZaehlGesagt aus der Bibliothek).
// Später: #musik:abendstueck (Klavier von Cedar Creek mit Ambroses Thema), sein Lachen ohne Musik.
{clubkampfZaehlGesagt: -> fehler_am_steg ->}
* [„Ambrose? Was willst du eigentlich?“]
    Was ich will? Das hat mich seit hundertsechzig Jahren niemand gefragt. #sprecher:ambrose
* [„Du warst heute im Archiv sehr still.“]
    Ich habe nachgedacht. Das kann ich gut, ich habe ja Zeit. #sprecher:ambrose
- Eine Partie ohne Makel. Eine, über die man in hundert Jahren noch spricht. #sprecher:ambrose
// Runde 11: Die Fernpartie war die Partie ohne Makel, langsam und ehrlich (Roman, Kapitel 16).
Mein Leben lang glaubte ich, man müsse wählen: richtig oder schön. Hale spielte richtig, ich schön. #sprecher:ambrose
Auf diesem Brett hatte ich sie, die eine. Gegen ihn, per Brief. Jeder Zug tagelang unterwegs, manchmal Wochen. #sprecher:ambrose
Ich habe nie so langsam gespielt. So ehrlich. #sprecher:ambrose
Ich hatte sie fast. Dann sagte jemand „Später“. #sprecher:ambrose #stimmung:traurig #pause
* [„Dann spielen wir sie eben jetzt.“]
    ~ ambroseVertrauen = ambroseVertrauen + 1
    Du weißt nicht, was du da sagst. #sprecher:ambrose
    ** [„Nein. Aber ich sag es trotzdem.“]
    ** [„Ich werde besser. Du bringst es mir bei.“]
    -- Ambrose lacht. Zum ersten Mal ohne Spott. #sprecher:erzaehler
    Jetzt. Ein schönes Wort. Ich hatte vergessen, wie es klingt. #sprecher:ambrose #stimmung:lacht
    Ein Kind mit einem Radiergummi als Dame. Bei allen Heiligen. #sprecher:ambrose #stimmung:lacht
* [„Ich will erst mal besser werden.“]
    Das ist der richtige Anfang. Die makellose Partie kommt am Ende, nie am Anfang. #sprecher:ambrose
// Runde 11 (Roman, Kapitel 16): Busfahrt mit Mr. Ketterings Kurvennamen; Coach Delgado rechnet
// Dollarbeträge (ihre Versuchung durch den Konzern bleibt offen, Dokument 19, Abschnitt 8).
- Mr. Kettering fährt, wie er seit einunddreißig Jahren fährt, und sagt jede Kurve an. #sprecher:erzaehler
„Die Witwe.“ – „Der Hühnerstall.“ – „Achtung, der lange Otis.“ #sprecher:erzaehler
Sam schläft nach der dritten Kurve ein, den Kopf auf dem Schachkoffer. #sprecher:erzaehler
Coach Delgado rechnet auf der Rückseite eines Spielberichts. Keine Schachaufgabe: Zahlen mit Dollarzeichen. #sprecher:erzaehler
* [Juno fragen, was der Coach rechnet]
    Keine Ahnung. Seit der Bildschirm im Clubraum steht, rechnet sie dauernd. #sprecher:juno
* [Aus dem Fenster sehen]
    Die Zedern bleiben zurück, eine nach der anderen. #sprecher:erzaehler
- Im Bus liest Juno aus dem Tagebuch vor: zwei Clubnadeln. Dann piept ihr Handy. #sprecher:erzaehler #klang:bus
Oh. Der Schachclub im Park von Riverton wird „neu aufgestellt“. #sprecher:juno
Mit Perfect Move. #sprecher:juno
// Runde 11: Die Nachricht kommt mit Foto. Später: #bild:fotoRiverton als Großansicht und ein
// einzelner kalter Klavierton (#musik:konzernmotiv), sobald mittel-2 sie gebaut hat.
Unter der Nachricht ein Foto: eine Wiese, Bäume, und in einer Reihe Tische mit Bildschirmen. Niemand sitzt daran. #sprecher:erzaehler
Neu aufgestellt. So nennt man es, wenn jemand die Figuren vom Brett wischt. #sprecher:ambrose #stimmung:streng
In deinem Rucksack liegt das Brett. Schwarz ist am Zug. #sprecher:erzaehler
-> END

// Runde 11 (Roman, Kapitel 16): Ambrose gesteht den Fehler aus dem Clubkampf, bevor er den Wunsch
// gesteht. Tunnel aus ende_akt1. Den Namen sagt er nur, wenn er ihn im Archiv schon gesagt hat.
=== fehler_am_steg ===
Ambrose steht am Geländer. Ich hätte dich die Partie gekostet. #sprecher:ambrose
* [„Hast du aber nicht.“]
* [„Ich hab gezählt. Wie du es mir beigebracht hast.“]
- Weil du gefragt hast. Ich hätte nicht gefragt. Ich habe nie gefragt. #sprecher:ambrose
Ein Loch in einer Königsstellung, und ich bin wieder siebenundzwanzig und will, dass die Treppe klatscht. #sprecher:ambrose
Du spielst nicht schön, {ambroseNenntNamen:{held}|Lehrling}. Ich sage das ohne Bosheit. #sprecher:ambrose
Du spielst wie jemand, der ein Haus abschließt, bevor er geht. Erst die Fenster, dann die Tür. #sprecher:ambrose
Und du hast heute eine Frau geschlagen, gegen die ich nicht sicher wäre. #sprecher:ambrose #stimmung:stolz
->->

// Runde 11 (Roman, Kapitel 14): Ambrose in der Sternennacht, nur mit dem Brett. Bereitet Port
// Delacroix vor (Geburtsort, Vater Klavierbauer; akt1_befunde.md, Abschnitt 7), ohne es zu nennen.
// Tunnel aus „sterne“.
=== sterne_ambrose ===
Sie stehen noch wie früher. Alles andere hat sich verändert: Lichter ohne Flamme, Wagen ohne Pferde. #sprecher:ambrose
Wo ich geboren bin, saß ich nachts am Kai. Mein Vater baute Klaviere und lieferte sie flussauf aus. Er kam spät. #sprecher:ambrose
Ich sah hinauf und dachte, ich würde einmal so bekannt wie einer von denen. Einer mit Namen. #sprecher:ambrose
Eine Fußnote. Sechs Wörter. #sprecher:ambrose #stimmung:traurig
Antworten kannst du ihm nicht, nicht vor den anderen. Du lässt die Hand auf dem Brett. #sprecher:erzaehler
->->

=== fund_schluessel ===
// Übergreifender Fund E4.2 (Bibel, Szene 23): Auflösung in Riverton bei Mrs. Albescu (Szene 33).
// gefundenSchluessel setzt die Hülle bei gibFund (regeln/dialogvariablen.ts).
Im Schilf am Steg glänzt etwas Rostiges: ein großer Schlüssel mit einem Ring aus Messing. #sprecher:erzaehler
Den hat ein Angler verloren. Vor zwei Jahren schon. #sprecher:rosa
Nimm ihn ruhig, mir schließt er nichts auf. #sprecher:rosa
~ gibFund("schluessel")
Ein Schlüssel ohne Tür. Irgendwo wartet eine Tür ohne Schlüssel. #sprecher:ambrose
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
- ausgangCedarCreekRosaDuell == "" or ausgangCedarCreekRosaDuell == "abgebrochen": -> rosa_angebot
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
// Runde 11 (Roman, Kapitel 13): Victor verliert täglich gegen das Programm; sein Vater will die
// drei Bibliotheken des Bezirks. Auf dem Weg zum Steg erkennt Ambrose Hale in Victor, ohne es
// auszusprechen. Später, wenn mittel-2 es gebaut hat: #pause:3 nach der Frage (die drei Sekunden).
* [„Gewinnst du manchmal?“]
    Remis. Einmal im Monat. #sprecher:victor #stimmung:kalt
    Gegen Schwächere ist ein Remis eine Niederlage, sagt mein Vater. Gegen das hier ist es ein Erfolg. #sprecher:victor
* [„Was macht dein Vater in Cedar Creek?“]
    Er ist im Rathaus. Der Bezirk hat drei Bibliotheken. Er will alle drei. #sprecher:victor #stimmung:kalt
    Für Bildschirme. Es ist effizienter. #sprecher:victor
* [Aufstehen und gehen]
- Klick. Klick. Das Programm antwortet sofort, jedes Mal. #sprecher:erzaehler
Erst auf dem Weg zum Steg, zwischen den Zedernhecken, hörst du Ambrose wieder. #sprecher:erzaehler
Er hält den Kopf wie er. Ein wenig schief. Wenn er rechnet. #sprecher:ambrose
* [„Wie wer?“]
    Keine Antwort. #sprecher:erzaehler
* [Nichts sagen]
- -> END

=== victor_alltag ===
Victor spielt weiter auf seinem Tablet. Er sieht nicht auf. #sprecher:erzaehler
-> END

// ---------------------------------------------------------------- Rückfahrt

=== bus_zurueck ===
{
- not ankunftCedarCreekGesehen: -> ankunft
- nachtImLesesaal and not teamAngekommen: -> team_kommt
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
+ [Mit dem Busfahrer reden]
    -> kettering
* [Noch bleiben]
    -> END

// ---------------------------------------------------------------- Ankunft zu Fuß (W5)
// Ankunft über den Flussweg: dieselbe Szene wie „ankunft“ (Runde 11, VC30).

=== ankunft_zu_fuss ===
{ankunftCedarCreekGesehen:
    Der Flussweg endet an der Bushaltestelle von Cedar Creek. #sprecher:erzaehler
    -> END
}
-> ankunft

// ---------------------------------------------------------------- Aufbruch nach Riverton (Akt 2)
// Übergang „zedernwald“ am Steg (orte.json, wenn: endeAkt1Gesehen): läuft vor dem Wechsel auf
// die Route wegCedarRiverton. Erstes Mal: Szene 26 der Bibel (akt2.aufbruch); die Quest
// riverton.parkclub beginnt danach mit dem Betreten des Zedernwalds.

=== zedernwald ===
{
- not endeAkt1Gesehen:
    Ein schmaler Waldweg führt zwischen die Zedern. Für heute ist es zu spät, der Bus wartet. #sprecher:erzaehler
    -> END
- aufbruchRivertonGesehen:
    Der Waldweg nach Riverton. Juno läuft schon ein Stück voraus. #sprecher:erzaehler
    -> END
}
~ aufbruchRivertonGesehen = true
Juno hält dir ihr Handy hin. Darauf ein Foto: ein Pavillon im Regen, davor Tische mit Bildschirmen. #sprecher:erzaehler
Der Parkclub von Riverton muss bis Sonntag raus. Wir müssen da hin, bevor es ihn nicht mehr gibt! #sprecher:juno
Coach Delgado hat heute Elternabend. Aber deine Mama hat ja gesagt, ich hab sie gefragt. #sprecher:juno #stimmung:froh
Auf dem Handy eine Nachricht von Mama: „Mit dem Zug zurück, vor dem Dunkelwerden. Hab euch lieb.“ #sprecher:erzaehler
* [„Dann los. Zu Fuß durch den Wald?“]
    Zu Fuß! Zurück nehmen wir den Zug. Abenteuer mit Rückfahrkarte. #sprecher:juno
* [„Was machen wir, wenn wir zu spät sind?“]
    Dann spielen wir wenigstens das letzte Spiel. Das ist auch was. #sprecher:juno
- Bäume, die älter sind als ich. Endlich jemand in meinem Alter. #sprecher:ambrose #stimmung:lacht
-> END

// ================================================================ Runde 11: Roman, Kapitel 10
// Geänderter Ablauf (docs/spiel/roman/akt1_teil3.md, „Neu gegenüber der Story-Bibel“): {held}
// und Juno kommen am Freitag zu Fuß an, schlafen im Lesesaal, das Team kommt am Samstag mit dem
// Bus. Der Bus bleibt für die Rückfahrt und zum Hin- und Herfahren. Die Turmuhr schlägt bei der
// Ankunft (Klang turmuhr, neu; Dokument 21 ordnet ihn zu); die Ankunft selbst steht im Knoten
// „ankunft“ oben. Stimmung: still, dann forschend.

=== team_kommt ===
~ teamAngekommen = true
Über dem Ort schlägt die Uhr acht. Auf der Straße klappert ein Bus, dann ein Pfiff auf zwei Fingern. #sprecher:erzaehler #klang:pfiff
Morgen, Vorhut! Steht die Bibliothek noch? #sprecher:coachDelgado
Ich hab im Bus geschlafen. Mit dem Kopf auf dem Schachkoffer. Der ist hart. #sprecher:sam
* [„Wir haben elf Sternschnuppen gesehen.“]
    Elf? Und ich hab geschlafen. Typisch. #sprecher:sam
* [„Mrs. Okafor ist heute müde.“]
    Müde ist gut. Müde ist sehr gut. #sprecher:coachDelgado
- Clubkampf am Vormittag. Bis dahin: Kopf frei, Figuren sortiert. #sprecher:coachDelgado #klang:pfiff
Der Bus wartet bis heute Abend. Mr. Kettering fährt uns zurück. #sprecher:coachDelgado
-> END

// ---------------------------------------------------------------- Mr. Kettering, der Busfahrer
// Kleine Geschichte (Dokument 20, Cedar Creek). Stufen wie auf dem Weg: A bis zur Nadel von Cedar
// Creek, B danach bis zur Nadel von Riverton, C in Akt 2, D nach Akt 2 (nadelIronwood). Ohne
// Porträt; seine Sätze stehen in Anführungszeichen beim Erzähler. Einstieg: Wahl in bus_zurueck.

=== kettering ===
{
- nadelIronwood > 0: -> kettering_d
- nadelRiverton > 0: -> kettering_c
- nadelCedarCreek > 0: -> kettering_b
- else: -> kettering_a
}

=== kettering_a ===
Der Busfahrer hat die Mütze in den Nacken geschoben und liest Zeitung. #sprecher:erzaehler
„Einunddreißig Jahre fahr ich diese Strecke. Jede Kurve hat einen Namen. Die meisten hab ich vergeben.“ #sprecher:erzaehler
* [„Welche Kurve ist die schönste?“]
    „Die Witwe. Nach der sieht man den Wasserfall.“ #sprecher:erzaehler
* [„Wird es nicht langweilig?“]
    „Die Kurven sind dieselben. Die Leute nicht.“ #sprecher:erzaehler
- -> bus_zurueck

=== kettering_b ===
„Die Linie wird geprüft, haben sie gesagt. Was es da zu prüfen gibt, weiß ich nicht.“ #sprecher:erzaehler
Er faltet die Zeitung zusammen. „Ich fahr sie jedenfalls, solange sie mich lassen.“ #sprecher:erzaehler
-> bus_zurueck

=== kettering_c ===
An der Haltestelle hängt ein neuer Fahrplan. Die Spalten sind kürzer als früher. #sprecher:erzaehler
Mr. Kettering sieht hinüber und sagt nichts. Er nickt dir zu und lässt den Motor an. #sprecher:erzaehler
-> bus_zurueck

=== kettering_d ===
Der neue Fahrplan ist überklebt. Darauf steht mit Kugelschreiber: „Fährt doch.“ #sprecher:erzaehler
„Einunddreißig Jahre“, sagt Mr. Kettering. „Und ein paar Monate. Wer zählt mit?“ #sprecher:erzaehler
Ein Mann, der seine Strecke nicht hergibt. Zu meiner Zeit hätte er Postkutschen gefahren. #sprecher:ambrose
-> bus_zurueck

// ================================================================ Runde 11: Roman, Kapitel 11
// Kleine Geschichte der Zwillinge Ivy und Jonah Pell (Dokument 20, Cedar Creek), draußen auf der
// Bibliothekstreppe: A bis zur Nadel von Cedar Creek, B danach bis zur Nadel von Riverton. Ab
// Stufe C sitzen sie drinnen (cedar-creek-bibliothek.zwillinge). Ohne Porträt; Sätze beim Erzähler.
// Auslöser für die Karte (fehlt noch): zwillinge (Figur auf der Treppe, Stufe A und B).

=== zwillinge ===
{
- nadelRiverton > 0:
    Die Treppe ist leer. Drinnen hört man zwei Stimmen flüstern. #sprecher:erzaehler
    -> END
- nadelCedarCreek > 0: -> zwillinge_b
- else: -> zwillinge_a
}

=== zwillinge_a ===
Auf der Bibliothekstreppe sitzen zwei Kinder, die genau gleich aussehen. Sie haben Figuren in den Händen und kein Brett. #sprecher:erzaehler
„Ich hab gewonnen!“ – „Du hast den Turm bewegt, als ich nicht geguckt hab!“ – „Du guckst nie!“ #sprecher:erzaehler
* [„Wer hat denn gewonnen?“]
    Beide zeigen auf sich. Dann aufeinander. Dann wieder auf sich. #sprecher:erzaehler
* [Leise vorbeigehen]
    Als du vorbeigehst, verstummen sie und sehen dir nach. #sprecher:erzaehler
- Zwei Könige und kein Brett. Daraus wird nie ein Ende. #sprecher:ambrose #stimmung:lacht
-> END

=== zwillinge_b ===
Die Zwillinge sitzen wieder auf der Treppe. Zwischen ihnen liegt jetzt ein Zettel mit Strichen. #sprecher:erzaehler
„Miss Ashby zählt mit“, sagt das Mädchen. „Sie ist die Schiedsrichterin. Sie guckt immer.“ #sprecher:erzaehler
„Dreizehn zu zwölf“, sagt der Junge. „Für mich.“ – „Für mich!“ #sprecher:erzaehler
-> END

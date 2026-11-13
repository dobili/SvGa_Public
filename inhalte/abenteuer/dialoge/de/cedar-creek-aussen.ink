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
// Gutachten Teil K (13.11.2026): K1.2, K1.3, K1.9, K1.10, K1.13, K1.14, K1.16 bis K1.20 umgesetzt.
//
// Variablen: ausgangCedarCreekRosaDuell und nadelCedarCreek setzt die Hülle (regeln/dialogvariablen.ts);
// maeEingeladen setzt cedar-creek-bibliothek.ink; die übrigen setzt diese Datei.

EXTERNAL beginnePartie(begegnung)
EXTERNAL setzeZustand(gegner, faktor, grund)
EXTERNAL reise(karte, ausloeser)
EXTERNAL gibFund(kennung)

VAR held = "Du"
VAR clubkampfZaehlGesagt = false
VAR erzaehlung1858Gesehen = false
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
VAR ambroseNenntNamen = false

// ---------------------------------------------------------------- Ankunft

=== ankunft ===
// Runde 11 (VC26 bis VC30, Roman Kapitel 10 und 11): ein Knoten für beide Wege. {held} und Juno
// kommen am Freitag still an; Coach und Bus kommen erst am Samstagmorgen (team_kommt). Ambrose
// spricht in dieser Szene nur am Plakat. Klang: Stille S12 (Turmuhr, vier Schläge), dann die
// Musik der Karte.
~ ankunftCedarCreekGesehen = true
{not schildCedarGesehen: Zwischen den Bäumen schlägt eine Uhr. Viermal, langsam. #sprecher:erzaehler #klang:turmuhr4 #musik:aus #pause:3}
Cedar Creek ist kleiner als Maple Falls und sieht älter aus. In der Mitte, wo woanders eine Kirche steht, steht die Bibliothek. #sprecher:erzaehler #musik:karte
Auf ihrer Treppe sitzen zwei Kinder, die gleich aussehen, mit Figuren in den Händen und ohne Brett. #sprecher:erzaehler
Ich hab gewonnen! #sprecher:ivy
Du hast den Turm bewegt, als ich nicht geguckt hab! #sprecher:jonah
Du guckst nie! #sprecher:ivy
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
    Vielleicht. #sprecher:ambrose #pause
- -> END

// ---------------------------------------------------------------- Steg

=== steg ===
{
- not ankunftCedarCreekGesehen: -> ankunft
- nadelCedarCreek > 0 and not endeAkt1Gesehen and not erzaehlung1858Gesehen: -> steg_vor_archiv
- nadelCedarCreek > 0 and not endeAkt1Gesehen: -> ende_akt1
- maeEingeladen and not sternennachtGesehen and nadelCedarCreek == 0: -> sterne_angebot
- not gefundenSchluessel: -> fund_schluessel
- else: -> steg_alltag
}

// Gutachten K1.3: Der Abend am Steg setzt die Geschichte von 1858 voraus (Treppe, siebenundzwanzig).
=== steg_vor_archiv ===
Er steht am Geländer und sieht aufs Wasser. Er sagt nichts. #sprecher:erzaehler #pause:2
Unten im Archiv steht noch ein Karton. #sprecher:erzaehler
-> END

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
// Runde 11 (VC77 bis VC81, Roman Kapitel 14): weit, warm, zärtlich. Keine Erklärung der
// Spielwirkung; die Müdigkeit zeigt sich erst am Morgen am Brett. Ambroses Erinnerung nur, wenn
// die Hand auf dem Brett liegt (sterne_ambrose). Klang: Stille S20 bis zur ersten Sternschnuppe,
// dann das Nachtstück.
~ sternennachtGesehen = true
Am Steg liegen Decken. Mae hat ein Teleskop aufgebaut, das größer ist als sie selbst. #sprecher:erzaehler #musik:aus #geraeusch:grillen #licht:nacht #teilchen:sternschnuppen
Dex hat eine rote Lampe gebastelt, „damit die Augen sich nicht erschrecken“. Alle paar Minuten geht sie aus. #sprecher:erzaehler
Mrs. Okafor hatte gesagt, eine halbe Stunde. Das war vor zwei Stunden. #sprecher:erzaehler
Die da ist Kassiopeia. Sieht aus wie ein W. Und das ist der Große Wagen, und das … #sprecher:mae
Mae. Du musst nicht alles benennen. #sprecher:dex
Doch. Sonst weiß man nicht, was man sieht. #sprecher:mae
* [Die Hand auf das Brett legen]
    Das Brett liegt neben dir auf der Decke, in sein Handtuch gewickelt. #sprecher:erzaehler
    -> sterne_ambrose ->
* [Nach oben sehen]
    Über den Zedern kommen mehr Sterne heraus, als du je gesehen hast. #sprecher:erzaehler #bild:sternenhimmel
- Da! #sprecher:mae #stimmung:froh
Das war ein Flugzeug. #sprecher:dex
Dann ein Strich über den Himmel, hell und schon vorbei. #sprecher:erzaehler #klang:sternschnuppe #pause
Hast du dir was gewünscht? #sprecher:juno #musik:nachtstueck
* [Nicken]
* [Nach oben sehen]
- Man darf es nicht sagen. #sprecher:mae
Du hast dir etwas gewünscht. Es hat mit dem Brett zu tun, und mit jemandem, der einen Zug schuldig ist. #sprecher:erzaehler #pause
Mrs. Okafor ist aufgestanden und steht hinter euch, die Decke um die Schultern. #sprecher:erzaehler
Als ich so alt war wie ihr, hat mein Onkel mir Schach beigebracht. Auf einem Dach in Lagos. #sprecher:okafor
Er sagte: Geduld, Grace. Die Nacht ist lang, und der Gegner wird müde vor dir. #sprecher:okafor #pause
Ich habe sechzig Jahre geglaubt, das sei ein Rat fürs Schach. #sprecher:okafor
* [Weiter nach oben sehen]
* [Die Augen schließen]
- Sie bleibt bis nach Mitternacht. Ihr zählt elf Sternschnuppen. #sprecher:erzaehler
Dex’ Lampe geht endgültig aus. Niemand vermisst sie. #sprecher:erzaehler
~ setzeZustand("cedarCreek.okafor", 1.3, "zustand.schlechtGeschlafen")
// Die Nacht verbringen {held} und Juno im Lesesaal (Roman, Kapitel 10 und 14).
~ nachtImLesesaal = true
Nach Mitternacht geht ihr hinüber in den Lesesaal. Die Matten liegen zwischen den Regalen. #sprecher:erzaehler
-> END

=== ende_akt1 ===
// Runde 11 (VC95 bis VC104, Roman Kapitel 16): leise, entschlossen; am Schluss ein Schatten, den
// niemand ausdeutet. Erst der Fehler („Lass mich“ kam als Partiemoment im Clubkampf), dann der
// Wunsch als Folge. Hier fällt das dritte „Später“. Klang nach 21_Klangplan.md (S25, S26).
// Porträtfassung „lacht ohne Spott“ gibt es noch nicht.
~ endeAkt1Gesehen = true
Das Wasser ist rot von der Sonne. Die Zedern stehen schwarz dagegen. #sprecher:erzaehler #musik:cedarCreek.steg #licht:abend
Du setzt dich ans Ende der Bretter und legst das Brett neben dich, ohne Handtuch. Er steht am Geländer. #sprecher:erzaehler
-> fehler_am_steg ->
* [„Was willst du eigentlich?“]
* [„Du findest das Zählen langweilig. Was willst du?“]
- Was ich will. #sprecher:ambrose
Ein Fisch springt. Die Ringe laufen auseinander. #sprecher:erzaehler #pause:2
Eine Partie ohne Makel. #sprecher:ambrose #musik:ambrose
Er sagt es einfach so. Nicht stolz. Wie man etwas zugibt. #sprecher:erzaehler
Eine. Von Anfang bis Ende richtig und von Anfang bis Ende schön. #sprecher:ambrose
Ich habe mein ganzes Leben geglaubt, man müsse wählen. Hale hat richtig gespielt und ich schön. #sprecher:ambrose
* [Zuhören]
- Er hat gewonnen. Und ich habe mir gesagt, dass es das wert war. #sprecher:ambrose #pause
Ich hatte sie fast. Die eine Partie. Auf diesem Brett. #sprecher:ambrose
* [„Die Fernpartie.“]
* [Auf das Brett sehen]
- Gegen ihn. Per Brief. Jeder Zug tagelang unterwegs, manchmal Wochen. #sprecher:ambrose
Ich habe nie so langsam gespielt. So ehrlich. #sprecher:ambrose
Es fehlte nur noch seine Antwort. Ein Zug. #sprecher:ambrose #pause:2
* [„Und er hat nicht geantwortet.“]
* [Warten]
- Jemand sagte: Später. #sprecher:ambrose #stimmung:traurig #musik:aus #pause:3
Das Wort liegt zwischen euch auf dem Steg. #sprecher:erzaehler
* [„Dann spielen wir sie eben jetzt.“]
    ~ ambroseVertrauen = ambroseVertrauen + 1
    Ambrose starrt dich an. #sprecher:erzaehler
    Du weißt nicht, was du da sagst. #sprecher:ambrose
    ** [„Nein. Aber ich sag es trotzdem.“]
    ** [„Ich werde besser. Du bringst es mir bei.“]
    -- -> ende_akt1_lachen
* [„Ich bin nicht gut genug. Noch nicht.“]
    Nein. Noch nicht. #sprecher:ambrose #pause:2
    ** [„Aber ich werde besser. Dann spielen wir sie jetzt.“]
        ~ ambroseVertrauen = ambroseVertrauen + 1
        Du weißt nicht, was du da sagst. #sprecher:ambrose
        -> ende_akt1_lachen

// Gutachten K1.2: Das Lachen ohne Spott fällt in jedem Zweig.
=== ende_akt1_lachen ===
Ambrose lacht. Zum ersten Mal ohne Spott. Es klingt wie jemand, der sehr lange die Luft angehalten hat. #sprecher:erzaehler #musik:aus #pause:4
Ein Kind. Bei allen Heiligen. Ein Kind mit einem Radiergummi als Dame. #sprecher:ambrose #stimmung:lacht
-> ende_akt1_bus

=== ende_akt1_bus ===
Hinter euch hupt der Bus. Mr. Kettering fährt, wie er seit einunddreißig Jahren fährt. #sprecher:erzaehler #klang:bus_hupe
Die Witwe. – Der Hühnerstall. – Achtung, der lange Otis. #sprecher:kettering #musik:busfahrt #geraeusch:bus_innen
Sam schläft nach der dritten Kurve ein, den Kopf auf dem Schachkoffer. #sprecher:erzaehler
Vorn rechnet der Coach etwas auf einem Spielbericht. Keine Schachaufgabe: Zahlen mit Dollarzeichen. #sprecher:erzaehler
* [Juno fragen, was der Coach rechnet]
    Weiß ich nicht. Sie hat das Blatt umgedreht, als ich geguckt hab. #sprecher:juno
* [Aus dem Fenster sehen]
    Die Zedern bleiben zurück, eine nach der anderen. #sprecher:erzaehler
- Zwei Clubnadeln. Ein Ahornblatt, ein Buch. {sternennachtGesehen:Sternschnuppen: elf.} #sprecher:juno
Ihr Handy summt. Ihr Gesicht verändert sich. #sprecher:erzaehler #klang:handy
Meine Cousine. Aus Riverton. Die haben da einen Club im Park, schon immer. Der wird neu aufgestellt. #sprecher:juno
Ein Foto: eine Reihe Tische mit Bildschirmen, an denen niemand sitzt. Darunter: „Mit Perfect Move. Ist das nicht toll?“ #sprecher:erzaehler #bild:fotoRiverton #musik:aus #klang:konzern #pause:2
Im Rucksack liegt das Brett. Schwarz ist am Zug. #sprecher:erzaehler
Später, denkst du. Aber nicht mehr lange. #sprecher:erzaehler
-> END

=== fehler_am_steg ===
Ich hätte dich die Partie gekostet. #sprecher:ambrose
* [„Hast du aber nicht.“]
* [„Ich hab gezählt. Wie du es mir beigebracht hast.“]
- {clubkampfZaehlGesagt:Weil du gefragt hast. Ich hätte nicht gefragt. Ich habe nie gefragt.|Weil du gezählt hast. Ich hätte nicht gezählt. Ich habe nie gezählt.} #sprecher:ambrose
Ein Loch in einer Königsstellung, und ich bin wieder siebenundzwanzig und will, dass die Treppe klatscht. #sprecher:ambrose
Du spielst nicht schön, {ambroseNenntNamen:{held}|Lehrling}. Ich sage das ohne Bosheit. #sprecher:ambrose
Du spielst wie jemand, der ein Haus abschließt, bevor er geht. Erst die Fenster, dann die Tür. #sprecher:ambrose
Zu meiner Zeit hätte ich so jemanden nicht einmal gegrüßt. #sprecher:ambrose
Und du hast heute eine Frau geschlagen, gegen die ich nicht sicher wäre. #sprecher:ambrose #stimmung:stolz
->->

// Runde 11 (Roman, Kapitel 14): Ambrose in der Sternennacht, nur mit dem Brett. Bereitet Port
// Delacroix vor (Geburtsort, Vater Klavierbauer; akt1_befunde.md, Abschnitt 7), ohne es zu nennen.
// Tunnel aus „sterne“.
=== sterne_ambrose ===
Sie stehen noch wie früher. Alles andere hat sich verändert: Lichter ohne Flamme, Wagen ohne Pferde. #sprecher:ambrose #stimmung:still
Wo ich geboren bin, saß ich nachts am Kai. Mein Vater baute Klaviere und lieferte sie flussauf aus. Er kam spät. #sprecher:ambrose
Ich sah hinauf und dachte, ich würde einmal so bekannt wie einer von denen. Einer mit Namen. #sprecher:ambrose
Eine Fußnote. Sechs Wörter. #sprecher:ambrose #stimmung:still #pause:2
Antworten kannst du ihm nicht, nicht vor den anderen. #sprecher:erzaehler
* [Die Hand auf dem Brett lassen]
* [Nach oben sehen]
- ->->

=== fund_schluessel ===
// Übergreifender Fund E4.2 (Bibel, Szene 23): Auflösung in Riverton bei Mrs. Albescu (Szene 33).
// gefundenSchluessel setzt die Hülle bei gibFund (regeln/dialogvariablen.ts). Runde 11 (VC84,
// VC85, Roman Kapitel 14): Rosa sagt es einfach, Ambrose schweigt.
{nachtImLesesaal: Am Morgen liegt Nebel auf dem Bach. Irgendwo surrt eine Angelschnur. #sprecher:erzaehler #klang:angelschnur}
Im Schilf am Steg glänzt etwas Rostiges: ein großer Schlüssel mit einem runden Griff. #sprecher:erzaehler
{not rosaGetroffen: Am Ende des Stegs sitzt eine Frau mit Angel. Sie dreht sich nicht um. #sprecher:erzaehler}
Den hat ein Angler verloren. Vor zwei Jahren schon. #sprecher:rosa
Nimm ihn mit. Vielleicht findest du das Schloss. #sprecher:rosa
~ gibFund("schluessel")
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
Ich stell dir was hin. Du hast Weiß und darfst angreifen. Zehn Züge. Nicht zappeln. #sprecher:rosa
* [„Abgemacht.“]
    -> rosa_duell
* [„Nicht jetzt.“]
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
+ [„Nicht jetzt.“]
    -> END

=== rosa_nach_niederlage ===
Gezappelt. Der Vorteil ist weggeschwommen. Noch mal? #sprecher:rosa
Ruhig, ruhig. Der König läuft nicht weg. #sprecher:rosa
+ [„Revanche.“]
    -> rosa_duell
+ [„Nicht jetzt.“]
    -> END

// ---------------------------------------------------------------- Victor

=== victor ===
{
- not ankunftCedarCreekGesehen: -> ankunft
- not victorCedarCreekGesehen: -> victor_tablet
- else: -> victor_alltag
}

=== victor_tablet ===
// Runde 11 (VC74 bis VC76, Roman Kapitel 13): erst sieht man ihn verlieren, dann kommt die Frage;
// der Riss ist eine gemessene Stille von drei Sekunden (#pause:3). Victor durchgehend kalt; die
// Porträtfassung „Riss“ für genau eine Zeile gibt es noch nicht (bis dahin muede). Klang: Stillen
// S18 und S19 (21_Klangplan.md), Victors Thema beim Gehen.
An der Haltestelle sitzt jemand. Gerade, die Füße nebeneinander, das Tablet auf den Knien. Das Plakat hängt über ihm. #sprecher:erzaehler #musik:aus
Er zieht. Das Programm antwortet sofort. Ein leises Klicken, wie ein Fingernagel auf Glas. #sprecher:erzaehler #klang:tablet
* [„Spielst du gegen das Ding?“]
    Ich trainiere. Mein Vater ist im Rathaus. #sprecher:victor #stimmung:kalt
    Der Bezirk hat drei Bibliotheken. Er will alle drei. Für Bildschirme. Es ist effizienter. #sprecher:victor #stimmung:kalt
* [Leise weitergehen]
    Er sieht nicht auf. Klick. #sprecher:erzaehler #klang:tablet
    -> END
- Auf dem Brett geht es sehr schnell und sehr genau. Er verliert. Langsam, Zug um Zug, gegen etwas, das nie zögert. #sprecher:erzaehler
* [„Gewinnst du manchmal?“]
    Remis. Einmal im Monat. #sprecher:victor #stimmung:kalt
    Mein Vater sagt, ein Remis gegen Schwächere ist eine Niederlage. Gegen das hier ist es ein Erfolg. #sprecher:victor
* [Gehen]
    -> END
- Er tippt auf „Neue Partie“. #sprecher:erzaehler
* [„Macht dir das eigentlich Spaß?“]
    ~ victorCedarCreekGesehen = true
    Seine Hand bleibt über dem Bildschirm stehen. #sprecher:erzaehler #geraeusch:aus #pause:3
    Das ist keine Frage, die man beim Training stellt. #sprecher:victor #stimmung:muede
    Er zieht. Das Programm antwortet. Aber er hat drei Sekunden gebraucht. Du hast mitgezählt. #sprecher:erzaehler #klang:tablet
    -> victor_weg
* [Gehen]
    -> END

=== victor_weg ===
Erst auf dem Weg zum Steg, zwischen den Zedernhecken, hörst du Ambrose wieder. #sprecher:erzaehler #musik:victor
Er hält den Kopf wie er. Ein wenig schief. Wenn er rechnet. #sprecher:ambrose
* [„Wie wer?“]
    Keine Antwort. #sprecher:erzaehler #pause:2
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
    Der Bus fährt um sieben. Am Steg ist das Wasser rot von der Sonne. #sprecher:erzaehler
- else:
    Der Linienbus nach Maple Falls fährt jede Stunde. {teamAngekommen:Das Auswärtsspiel läuft noch.|Morgen ist der Clubkampf.} #sprecher:erzaehler
}
+ [Nach Maple Falls fahren]
    Der Bus rollt die Landstraße entlang. Hinter dir werden die Zedern kleiner. #sprecher:erzaehler
    ~ reise("mapleFalls.park", "bushaltestelle")
    -> END
+ [Mit dem Busfahrer reden]
    -> kettering
+ [Noch bleiben]
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
// Runde 11 (Roman, Kapitel 17, Szene 26): Oktober; Juno zeigt jeden Tag dasselbe Foto (die Reihe
// Bildschirmtische, wie im Bus am Ende von Akt 1); Coach Delgado hat eine Sitzung im Schulamt und
// sieht dabei zum Bildschirm; Mama fragt weniger. Den Baumwitz sagt Ambrose nur hier (nicht mehr bei
// der Ankunft in Akt 1). Musik: das Klavier von Cedar Creek mit gehendem Bass (Klangplan Akt 2).
~ aufbruchRivertonGesehen = true
Es ist Oktober geworden. Ihr seid mit dem Bus bis Cedar Creek gefahren und steht am Steg, wo der Bach in den Wald läuft. #sprecher:erzaehler
Juno hält dir ihr Handy hin. Dasselbe Foto wie im Bus: eine Wiese, eine Reihe Tische mit Bildschirmen. #sprecher:erzaehler
Sie zeigt es dir jeden Tag. Als könnte es sich ändern, wenn man es oft genug ansieht. #sprecher:erzaehler
Wir müssen hin. Bevor es weg ist. #sprecher:juno
* [„Was weg ist?“]
    Weiß ich nicht. Das, was vorher da war. #sprecher:juno
* [Nicken]
- Coach Delgado kann nicht mit. Sitzung im Schulamt. Als sie das sagte, sah sie zum Bildschirm auf ihrem Pult. #sprecher:erzaehler
Auf dem Handy eine Nachricht von Mama: „Riverton. Mit dem Zug zurück, vor dem Dunkelwerden.“ #sprecher:erzaehler
Sie hat nicht gefragt, warum. Sie fragt in letzter Zeit weniger. #sprecher:erzaehler
* [„Dann los. Zu Fuß durch den Wald.“]
    Zu Fuß! Zurück nehmen wir den Zug. Abenteuer mit Rückfahrkarte. #sprecher:juno #stimmung:froh
* [„Und wenn wir zu spät sind?“]
    Dann sehen wir wenigstens, was da jetzt steht. Und ich schreib es auf. #sprecher:juno
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
Über dem Ort schlägt die Uhr acht. Auf der Straße klappert ein Bus. #sprecher:erzaehler #klang:bus
Dann ein Pfiff auf zwei Fingern. #sprecher:erzaehler #klang:pfiff_finger
Morgen, Vorhut! Steht die Bibliothek noch? #sprecher:coachDelgado
Ich hab im Bus geschlafen. Mit dem Kopf auf dem Schachkoffer. Der ist hart. #sprecher:sam
* {sternennachtGesehen} [„Wir haben elf Sternschnuppen gesehen.“]
    Elf? Und ich hab geschlafen. Typisch. #sprecher:sam
* [„Wir haben auf Matten geschlafen. Zwischen den Regalen.“]
    Zwischen Büchern? Da wär ich nie eingeschlafen. Doch. Wär ich. #sprecher:sam
- Clubkampf am Vormittag. Bis dahin: Kopf frei, Figuren sortiert. #sprecher:coachDelgado #klang:pfiff
Der Bus wartet bis heute Abend. Mr. Kettering fährt uns zurück. #sprecher:coachDelgado
-> END

// ---------------------------------------------------------------- Mr. Kettering, der Busfahrer
// Kleine Geschichte (Dokument 20, Cedar Creek). Stufen wie auf dem Weg: A bis zur Nadel von Cedar
// Creek, B danach bis zur Nadel von Riverton, C in Akt 2, D nach Akt 2 (nadelIronwood). Spricht
// mit eigener Kennung „kettering“ (noch ohne Porträt). Einstieg: Wahl in bus_zurueck.

=== kettering ===
{
- nadelIronwood > 0: -> kettering_d
- nadelRiverton > 0: -> kettering_c
- nadelCedarCreek > 0: -> kettering_b
- else: -> kettering_a
}

=== kettering_a ===
Der Busfahrer hat die Mütze in den Nacken geschoben und liest Zeitung. #sprecher:erzaehler
Einunddreißig Jahre fahr ich diese Strecke. Jede Kurve hat einen Namen. Die meisten hab ich vergeben. #sprecher:kettering
+ [„Welche Kurve ist die schönste?“]
    Die Witwe. Nach der sieht man den Wasserfall. #sprecher:kettering
+ [„Wird es nicht langweilig?“]
    Die Kurven sind dieselben. Die Leute nicht. #sprecher:kettering
- -> bus_zurueck

=== kettering_b ===
Die Linie wird geprüft, haben sie gesagt. Was es da zu prüfen gibt, weiß ich nicht. #sprecher:kettering
Er faltet die Zeitung zusammen. #sprecher:erzaehler
Ich fahr sie jedenfalls, solange sie mich lassen. #sprecher:kettering
-> bus_zurueck

=== kettering_c ===
An der Haltestelle hängt ein neuer Fahrplan. Die Spalten sind kürzer als früher. #sprecher:erzaehler
Mr. Kettering sieht hinüber und sagt nichts. Er nickt dir zu und lässt den Motor an. #sprecher:erzaehler
-> bus_zurueck

=== kettering_d ===
Der neue Fahrplan ist überklebt. Darauf steht mit Kugelschreiber: „Fährt doch.“ #sprecher:erzaehler
Einunddreißig Jahre. Und ein paar Monate. Wer zählt mit? #sprecher:kettering
Ein Mann, der seine Strecke nicht hergibt. Zu meiner Zeit hätte er Postkutschen gefahren. #sprecher:ambrose
-> bus_zurueck

// ================================================================ Runde 11: Roman, Kapitel 11
// Kleine Geschichte der Zwillinge Ivy und Jonah Pell (Dokument 20, Cedar Creek), draußen auf der
// Bibliothekstreppe: A bis zur Nadel von Cedar Creek, B danach bis zur Nadel von Riverton. Ab
// Stufe C sitzen sie drinnen (cedar-creek-bibliothek.zwillinge). Kennungen ivy und jonah.
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
// Gutachten K1 (Nachtrag): Der Streit steht schon in „ankunft“; hier eine neue Runde.
Die Zwillinge sitzen noch auf der Treppe. Jetzt hat jeder einen Turm in der Faust. #sprecher:erzaehler
Diesmal guck ich die ganze Zeit. #sprecher:jonah
Dann ziehst du ja nie! #sprecher:ivy
* [„Wer hat denn gewonnen?“]
    Beide zeigen auf sich. Dann aufeinander. Dann wieder auf sich. #sprecher:erzaehler
* [Leise vorbeigehen]
    Als du vorbeigehst, verstummen sie und sehen dir nach. #sprecher:erzaehler
- Zwei Könige und kein Brett. Daraus wird nie ein Ende. #sprecher:ambrose #stimmung:lacht
-> END

=== zwillinge_b ===
Die Zwillinge sitzen wieder auf der Treppe. Zwischen ihnen liegt jetzt ein Zettel mit Strichen. #sprecher:erzaehler
Miss Ashby zählt mit. Sie ist die Schiedsrichterin. Sie guckt immer. #sprecher:ivy
Dreizehn zu zwölf. Für mich. #sprecher:jonah
Für mich! #sprecher:ivy
-> END

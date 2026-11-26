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

// Wer mit {held} geht (regeln/gefolge.ts); die Heimfahrt im Bus beendet Junos Begleitung.
VAR begleiter = ""
VAR rivalin = false
VAR rivale = "Victor"
VAR rv_er = "er"
VAR rv_Er = "Er"
VAR rv_ihn = "ihn"
VAR rv_Ihn = "Ihn"
VAR rv_ihm = "ihm"
VAR rv_Ihm = "Ihm"
VAR rv_sein = "sein"
VAR rv_Sein = "Sein"
VAR ausgangCedarCreekClubkampf = ""
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
VAR okaforGetroffen = false
VAR nachtImLesesaal = false
VAR schildCedarGesehen = false
VAR teamAngekommen = false
VAR nadelRiverton = 0
VAR nadelIronwood = 0
VAR ambroseNenntNamen = false
// Aus capital-arena-aussen.ink: Nach dem Abschied (Szene 109) spricht Ambrose nicht mehr
// (Story-Bibel Abschnitt 33, Frage 5; Entscheidung Q21-5). Hier nur gelesen.
VAR abschiedGesehen = false

// ---------------------------------------------------------------- Ankunft

=== ankunft ===
// Runde 11 (VC26 bis VC30, Roman Kapitel 10 und 11): ein Knoten für beide Wege. {held} und Juno
// kommen am Freitag still an; Coach und Bus kommen erst am Samstagmorgen (team_kommt). Ambrose
// spricht in dieser Szene nur am Plakat. Klang: Stille S12 (Turmuhr, vier Schläge), dann die
// Musik der Karte.
~ ankunftCedarCreekGesehen = true
{not schildCedarGesehen: Zwischen den Bäumen schlägt eine Uhr. Viermal, langsam. #sprecher:erzaehler #klang:turmuhr4 #musik:aus #pause:3}
Cedar Creek ist kleiner als Maple Falls und sieht älter aus. In der Mitte, wo woanders eine Kirche steht, steht die Bibliothek. #sprecher:erzaehler #musik:karte #schwenk:mf2Bibliothek
Auf ihrer Treppe sitzen zwei Kinder, die gleich aussehen, mit Figuren in den Händen und ohne Brett. #sprecher:erzaehler #schwenk:zwillinge
Ich hab gewonnen! #sprecher:ivy #stimmung:laechelt
Du hast den Turm bewegt, als ich nicht geguckt hab! #sprecher:jonah #stimmung:bitter
Du guckst nie! #sprecher:ivy #stimmung:lacht
* [„Wer hat denn gewonnen?“]
    Beide zeigen auf sich. Dann aufeinander. #sprecher:erzaehler
* [Leise vorbeigehen]
    Sie verstummen und sehen euch nach. #sprecher:erzaehler
- Hier flüstert sogar die Straße. #sprecher:juno #stimmung:laechelt #schwenk:held
Mrs. Okafor erwartet uns. Der Coach kommt erst morgen mit dem Bus. #sprecher:juno #stimmung:neutral
-> END

// ---------------------------------------------------------------- Plakat

=== plakat ===
{not ankunftCedarCreekGesehen: -> ankunft}
{nachtImLesesaal and not teamAngekommen: -> team_kommt}
Ein großes, glänzendes Plakat: „Perfect Move – Schach für die Zukunft. Bald auch in deiner Stadt.“ #sprecher:erzaehler
Darauf ein Kind, das in einen Bildschirm lächelt. Es ist das einzige Glänzende weit und breit. #sprecher:erzaehler
{abschiedGesehen: -> END}
Ein Plakat, das droht. Und es lächelt dabei. #sprecher:ambrose #stimmung:streng
* [„Das ist die Firma von {rivale}s Vater.“]
    So. Dann hat die Drohung einen Namen. #sprecher:ambrose #stimmung:nachdenklich
* [„Vielleicht ist das gar nicht so schlecht.“]
    Vielleicht. #sprecher:ambrose #stimmung:nachdenklich #pause
- -> END

// ---------------------------------------------------------------- Steg

=== steg ===
{
- not ankunftCedarCreekGesehen: -> ankunft
- nadelCedarCreek > 0 and not endeAkt1Gesehen and not erzaehlung1858Gesehen: -> steg_vor_archiv
- nadelCedarCreek > 0 and not endeAkt1Gesehen: -> ende_akt1
- maeEingeladen and not sternennachtGesehen and not nachtImLesesaal and nadelCedarCreek == 0: -> sterne_angebot
- not gefundenSchluessel: -> fund_schluessel
- else: -> steg_alltag
}

// Gutachten K1.3: Der Abend am Steg setzt die Geschichte von 1858 voraus (Treppe, siebenundzwanzig).
=== steg_vor_archiv ===
Er steht am Geländer und sieht aufs Wasser. Er sagt nichts. #sprecher:erzaehler #pause:2
Unten im Archiv steht noch ein Karton. #sprecher:erzaehler
-> END

=== sterne_angebot ===
// Anwesenheit (25.11.2026): Mae, Dex und Mrs. Okafor stehen jetzt am Steg (cedarCreek.maeSteg,
// dexSteg, okaforSteg), solange die Sternennacht aussteht; Maes Teleskop steht schon dort.
Es wird dunkel. Am Steg breiten Mae, Dex und Juno eine Decke aus. #sprecher:erzaehler #uhr:abend #schwenk:steg
Mrs. Okafor hat eine Thermoskanne dabei. #sprecher:erzaehler
Da bist du ja! Gleich geht es los! #sprecher:mae #stimmung:froh
* [Dazusetzen]
    -> sterne
// Nicht zu verpassen (19.11.2026): Die Nacht im Lesesaal beginnt erst nach den Sternen (sterne_ende).
// Wer müde ist, wird von Mae überredet; vorher ging die Szene hier verloren, in der Simulation in
// neun von zwölf Läufen.
* [„Ich bin zu müde. Ein andermal.“]
    Nur ein paar Minuten! Die erste kommt bestimmt gleich. #sprecher:mae #stimmung:froh
    Juno rückt auf der Decke zur Seite und klopft neben sich. #sprecher:erzaehler
    -> sterne

=== sterne ===
// Runde 11 (VC77 bis VC81, Roman Kapitel 14): weit, warm, zärtlich. Keine Erklärung der
// Spielwirkung; die Müdigkeit zeigt sich erst am Morgen am Brett. Ambroses Erinnerung nur, wenn
// die Hand auf dem Brett liegt (sterne_ambrose). Klang: Stille S20 bis zur ersten Sternschnuppe,
// dann das Nachtstück.
// sternennachtGesehen erst am Ende (sterne_ende): Wer mitten in der Nacht abbricht, bekommt die
// Sternennacht am Steg wieder angeboten, sonst bliebe die Quest offen (19.11.2026).
Mae hat ein Teleskop aufgebaut, das größer ist als sie selbst. #sprecher:erzaehler #musik:aus #geraeusch:grillen #licht:nacht #teilchen:sternschnuppen #uhr:nacht
Dex hat eine rote Lampe gebastelt, „damit die Augen sich nicht erschrecken“. Alle paar Minuten geht sie aus. #sprecher:erzaehler
Die da ist Kassiopeia. Sieht aus wie ein W. #sprecher:mae #stimmung:laechelt
Und das ist der Große Wagen, und das … #sprecher:mae #stimmung:laechelt
Mae. Du musst nicht alles benennen. #sprecher:dex #stimmung:laechelt
Doch. Sonst weiß man nicht, was man sieht. #sprecher:mae #stimmung:laechelt
* {not abschiedGesehen} [Die Hand auf das Brett legen]
    Das Brett liegt neben dir auf der Decke, in sein Handtuch gewickelt. #sprecher:erzaehler
    -> sterne_ambrose ->
* [Nach oben sehen]
    Über den Zedern kommen mehr Sterne heraus, als du je gesehen hast. #sprecher:erzaehler #bild:sternenhimmel
- Da! #sprecher:mae #stimmung:froh
Das war ein Flugzeug. #sprecher:dex #stimmung:laechelt
Dann ein Strich über den Himmel, hell und schon vorbei. #sprecher:erzaehler #klang:sternschnuppe #pause
Hast du dir was gewünscht? #sprecher:juno #stimmung:laechelt #musik:nachtstueck
* [Nicken]
* [Nach oben sehen]
- Man darf es nicht sagen. #sprecher:mae #stimmung:laechelt
Du hast dir etwas gewünscht. Es hat mit dem Brett zu tun, und mit jemandem, der einen Zug schuldig ist. #sprecher:erzaehler #pause
Mrs. Okafor ist aufgestanden und steht hinter euch, die Decke um die Schultern. #sprecher:erzaehler
Als ich so alt war wie ihr, hat mein Onkel mir Schach beigebracht. Auf einem Dach in Lagos. #sprecher:okafor #stimmung:laechelt
Er sagte: Geduld, Grace. Die Nacht ist lang, und der Gegner wird müde vor dir. #sprecher:okafor #stimmung:laechelt #pause
Ich habe sechzig Jahre geglaubt, das sei ein Rat fürs Schach. #sprecher:okafor #stimmung:nachdenklich
* [Weiter nach oben sehen]
* [Die Augen schließen]
- -> sterne_ende

// Eigener Knoten, damit die Quest „Sternennacht am Steg“ erst hier endet (sie beginnt bei Maes
// Einladung): Wer mitten in der Nacht abbricht, bekommt sie am Steg wieder angeboten. Ablehnen geht
// nicht mehr (sterne_angebot, okafor_bis_morgen; 19.11.2026), deshalb bleibt sie nie offen.
=== sterne_ende ===
~ sternennachtGesehen = true
Mrs. Okafor hatte gesagt, eine halbe Stunde. Sie bleibt bis nach Mitternacht. #sprecher:erzaehler
Ihr zählt elf Sternschnuppen. #sprecher:erzaehler
Dex' Lampe geht endgültig aus. Niemand vermisst sie. #sprecher:erzaehler
~ setzeZustand("cedarCreek.okafor", 1.3, "zustand.schlechtGeschlafen")
// Die Nacht verbringen {held} und Juno im Lesesaal (Roman, Kapitel 10 und 14).
~ nachtImLesesaal = true
Dann geht ihr hinüber in den Lesesaal. Die Matten liegen zwischen den Regalen. #sprecher:erzaehler
// Auftritt (26.11.2026): Der Text bringt {held} in den Lesesaal, also geht die Szene dorthin. Sonst
// stand {held} um Mitternacht noch am Steg, und der Coach und Sam (nachtImLesesaal) kamen dort an,
// Stunden vor ihrem Bus am Morgen (team_kommt).
~ reise("cedarCreek.bibliothek", "bibliothekAusgang")
-> END

=== ende_akt1 ===
// Runde 11 (VC95 bis VC104, Roman Kapitel 16): leise, entschlossen; am Schluss ein Schatten, den
// niemand ausdeutet. Erst der Fehler („Lass mich“ kam als Partiemoment im Clubkampf), dann der
// Wunsch als Folge. Hier fällt das dritte „Später“. Klang nach 21_Klangplan.md (S25, S26).
// Porträtfassung „lacht ohne Spott“ gibt es noch nicht.
~ endeAkt1Gesehen = true
Das Wasser ist rot von der Sonne. Die Zedern stehen schwarz dagegen. #sprecher:erzaehler #musik:cedarCreek.steg #licht:abend #uhr:abend
Du setzt dich ans Ende der Bretter und legst das Brett neben dich, ohne Handtuch. Er steht am Geländer. #sprecher:erzaehler
-> fehler_am_steg ->
* [„Was willst du eigentlich?“]
* [„Du findest das Zählen langweilig. Was willst du?“]
- Was ich will. #sprecher:ambrose #stimmung:nachdenklich
Ein Fisch springt. Die Ringe laufen auseinander. #sprecher:erzaehler #pause:2
Eine Partie ohne Makel. #sprecher:ambrose #stimmung:nachdenklich #musik:ambrose
Er sagt es einfach so. Nicht stolz. #sprecher:erzaehler
Wie man etwas zugibt. #sprecher:erzaehler
Eine. Von Anfang bis Ende richtig und von Anfang bis Ende schön. #sprecher:ambrose #stimmung:nachdenklich
Ich habe mein ganzes Leben geglaubt, man müsse wählen. Hale hat richtig gespielt und ich schön. #sprecher:ambrose #stimmung:nachdenklich
* [Zuhören]
- Er hat gewonnen. Und ich habe mir gesagt, dass es das wert war. #sprecher:ambrose #stimmung:bitter #pause
Ich hatte sie fast. Die eine Partie – auf diesem Brett. #sprecher:ambrose #stimmung:nachdenklich
* [„Die Fernpartie.“]
* [Auf das Brett sehen]
- Gegen ihn. Per Brief. #sprecher:ambrose #stimmung:nachdenklich
Jeder Zug tagelang unterwegs, manchmal Wochen. #sprecher:ambrose #stimmung:nachdenklich
Ich habe nie so langsam gespielt. So ehrlich. #sprecher:ambrose #stimmung:laechelt
Es fehlte nur noch seine Antwort. Ein Zug. #sprecher:ambrose #stimmung:nachdenklich #pause:2
* [„Und er hat nicht geantwortet.“]
* [Warten]
- Jemand sagte: Später. #sprecher:ambrose #stimmung:traurig #musik:aus #pause:3
Das Wort liegt zwischen euch auf dem Steg. #sprecher:erzaehler
* [„Dann spielen wir sie eben jetzt.“]
    ~ ambroseVertrauen = ambroseVertrauen + 1
    Ambrose starrt dich an. #sprecher:erzaehler
    Du weißt nicht, was du da sagst. #sprecher:ambrose #stimmung:ueberrascht
    ** [„Nein. Aber ich sag es trotzdem.“]
    ** [„Ich werde besser. Du bringst es mir bei.“]
    -- -> ende_akt1_lachen
* [„Ich bin nicht gut genug. Noch nicht.“]
    Nein. Noch nicht. #sprecher:ambrose #stimmung:nachdenklich #pause:2
    ** [„Aber ich werde besser. Und dann spielen wir sie.“]
        ~ ambroseVertrauen = ambroseVertrauen + 1
        Du weißt nicht, was du da sagst. #sprecher:ambrose #stimmung:ueberrascht
        -> ende_akt1_lachen

// Gutachten K1.2: Das Lachen ohne Spott fällt in jedem Zweig.
=== ende_akt1_lachen ===
Ambrose lacht. Zum ersten Mal ohne Spott. #sprecher:erzaehler #musik:aus
Es klingt wie jemand, der sehr lange die Luft angehalten hat. #sprecher:erzaehler #pause:4
Ein Kind. Bei allen Heiligen. #sprecher:ambrose #stimmung:lacht
Ein Kind mit einem Radiergummi als Dame. #sprecher:ambrose #stimmung:lacht
-> ende_akt1_bus

=== ende_akt1_bus ===
// Juno fährt mit im Bus; zu Hause steht sie wieder an ihren Plätzen (regeln/gefolge.ts).
~ begleiter = ""
Hinter euch hupt der Bus. Mr. Kettering fährt, wie er seit einunddreißig Jahren fährt. #sprecher:erzaehler #klang:bus_hupe
Die Witwe. – Der Hühnerstall. – Achtung, der lange Otis. #sprecher:kettering #stimmung:laechelt #musik:busfahrt #geraeusch:bus_innen
Sam schläft nach der dritten Kurve ein, den Kopf auf dem Schachkoffer. #sprecher:erzaehler
Vorn rechnet der Coach etwas auf einem Spielbericht. Keine Schachaufgabe: Zahlen mit Dollarzeichen. #sprecher:erzaehler
* [Juno fragen, was der Coach rechnet]
    Weiß ich nicht. Sie hat das Blatt umgedreht, als ich geguckt hab. #sprecher:juno #stimmung:nachdenklich
* [Aus dem Fenster sehen]
    Die Zedern bleiben zurück, eine nach der anderen. #sprecher:erzaehler
- Zwei Clubnadeln. Ein Ahornblatt, ein Buch. {sternennachtGesehen:Sternschnuppen: elf.} #sprecher:juno #stimmung:laechelt
Ihr Handy summt. Ihr Gesicht verändert sich. #sprecher:erzaehler #klang:handy
Meine Cousine. Aus Riverton. #sprecher:juno #stimmung:laechelt
Die haben da einen Club im Park, schon immer. Der wird neu aufgestellt. #sprecher:juno #stimmung:laechelt
Ein Foto: eine Reihe Tische mit Bildschirmen, an denen niemand sitzt. #sprecher:erzaehler #bild:fotoRiverton #musik:aus #klang:konzern
Darunter: „Mit Perfect Move. Ist das nicht toll?“ #sprecher:erzaehler #pause:2
Im Rucksack liegt das Brett. Schwarz ist am Zug. #sprecher:erzaehler
Später, denkst du. Aber nicht mehr lange. #sprecher:erzaehler
// Lektorat 19.11.2026: Die Heimfahrt ist erzählt; danach steht {held} in Maple Falls, nicht am Steg.
~ reise("mapleFalls.park", "bushaltestelle")
-> END

=== fehler_am_steg ===
// Lektorat 19.11.2026: Ohne den Moment „Lass mich“ (Partie früher gewonnen) spricht Ambrose nur von
// dem, was er gesehen hat; nach einem Remis hat {held} niemanden geschlagen.
{clubkampfZaehlGesagt:Ich hätte dich die Partie gekostet.|Ich habe heute ein Loch in ihrer Königsstellung gesehen. Ich habe geschwiegen.} #sprecher:ambrose #stimmung:bitter
* [„Hast du aber nicht.“]
* [„Ich hab gezählt. Wie du es mir beigebracht hast.“]
- {clubkampfZaehlGesagt:Weil du gefragt hast. Ich hätte nicht gefragt. Ich habe nie gefragt.|Weil du gezählt hast. Ich hätte nicht gezählt. Ich habe nie gezählt.} #sprecher:ambrose #stimmung:nachdenklich
{clubkampfZaehlGesagt:Ein Loch in einer Königsstellung, und ich bin wieder siebenundzwanzig und will, dass die Treppe klatscht.|Früher hätte ich den Turm hineingeworfen, damit die Treppe klatscht.} #sprecher:ambrose #stimmung:bitter
Du spielst nicht schön, {ambroseNenntNamen:{held}|Lehrling}. Ich sage das ohne Bosheit. #sprecher:ambrose #stimmung:nachdenklich
Du spielst wie jemand, der ein Haus abschließt, bevor er geht. Erst die Fenster, dann die Tür. #sprecher:ambrose #stimmung:laechelt
Zu meiner Zeit hätte ich so jemanden nicht einmal gegrüßt. #sprecher:ambrose #stimmung:laechelt
{ausgangCedarCreekClubkampf == "remis":Und du hast heute gegen eine Frau gehalten, gegen die ich nicht sicher wäre.|Und du hast heute eine Frau geschlagen, gegen die ich nicht sicher wäre.} #sprecher:ambrose #stimmung:stolz
->->

// Runde 11 (Roman, Kapitel 14): Ambrose in der Sternennacht, nur mit dem Brett. Bereitet Port
// Delacroix vor (Geburtsort, Vater Klavierbauer; akt1_befunde.md, Abschnitt 7), ohne es zu nennen.
// Tunnel aus „sterne“.
=== sterne_ambrose ===
Sie stehen noch wie früher. Alles andere hat sich verändert: Lichter ohne Flamme, Wagen ohne Pferde. #sprecher:ambrose #stimmung:still
Wo ich geboren bin, saß ich nachts am Kai. Mein Vater baute Klaviere und lieferte sie flussauf aus. #sprecher:ambrose #stimmung:nachdenklich
Er kam spät. #sprecher:ambrose #stimmung:nachdenklich
Ich sah hinauf und dachte, ich würde einmal so bekannt wie einer von denen. Einer mit Namen. #sprecher:ambrose #stimmung:nachdenklich
{okaforGetroffen:Eine Fußnote. Sechs Wörter.|Kein Stern trägt meinen Namen. Nicht einmal eine Zeitung.} #sprecher:ambrose #stimmung:still #pause:2
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
Den hat ein Angler verloren. Vor zwei Jahren schon. #sprecher:rosa #stimmung:nachdenklich
Nimm ihn mit. Vielleicht findest du das Schloss. #sprecher:rosa #stimmung:laechelt
~ gibFund("schluessel")
-> END

=== steg_alltag ===
{nadelCedarCreek > 0:
    Der Steg liegt still in der Abendsonne. Der Bus nach Maple Falls wartet an der Haltestelle. #sprecher:erzaehler
- else:
    Der Bach glitzert unter dem Steg. {sternennachtGesehen:Hier habt ihr elf Sternschnuppen gezählt.|Hier sieht man abends bestimmt gut die Sterne.} #sprecher:erzaehler
}
-> END

// ---------------------------------------------------------------- Rosa

=== rosa ===
{
- not ankunftCedarCreekGesehen: -> ankunft
- not rosaGetroffen: -> rosa_erstes_treffen
- ausgangCedarCreekRosaDuell == "" or ausgangCedarCreekRosaDuell == "abgebrochen": -> rosa_angebot
- ausgangCedarCreekRosaDuell == "remis": -> rosa_nach_remis
- ausgangCedarCreekRosaDuell == "niederlage": -> rosa_nach_niederlage
- else: -> rosa_nach_sieg
}

=== rosa_erstes_treffen ===
~ rosaGetroffen = true
{gefundenSchluessel:Die Frau mit der Angel dreht sich jetzt doch um. Neben ihr ein Brett mit Magnetfiguren.|Am Ende des Stegs sitzt eine Frau mit Angel. Neben ihr ein Brett mit Magnetfiguren.} #sprecher:erzaehler
Ruhig, ruhig. Der Fisch merkt, wenn du zappelst. #sprecher:rosa #stimmung:laechelt
Der Gegner auch. Ich bin Rosa. #sprecher:rosa #stimmung:laechelt
-> rosa_angebot

=== rosa_angebot ===
Ich stell dir was hin. Du hast Weiß und darfst angreifen. #sprecher:rosa #stimmung:laechelt
Zehn Züge. Nicht zappeln. #sprecher:rosa #stimmung:laechelt
* [„Abgemacht.“]
    -> rosa_duell
* [„Nicht jetzt.“]
    Die Fische warten. Ich auch. #sprecher:rosa #stimmung:laechelt
    -> END

=== rosa_duell ===
~ beginnePartie("cedarCreek.rosaDuell")
Rosa legt die Angel quer über die Knie und stellt die Figuren auf. #sprecher:erzaehler
-> END

=== rosa_nach_sieg ===
Nicht gezappelt. Gut. #sprecher:rosa #stimmung:laechelt
Noch eine Runde, während die Fische schlafen? #sprecher:rosa #stimmung:laechelt
{not abschiedGesehen:
    Ruhige Hände, ruhiger Kopf. Das hatte ich in deinem Alter nicht. #sprecher:ambrose #stimmung:laechelt
}
+ [„Noch eine.“]
    -> rosa_duell
+ [„Nicht jetzt.“]
    -> END

=== rosa_nach_niederlage ===
Gezappelt. Der Vorteil ist weggeschwommen, noch mal? #sprecher:rosa #stimmung:laechelt
Ruhig, ruhig. Der König läuft nicht weg. #sprecher:rosa #stimmung:laechelt
+ [„Revanche.“]
    -> rosa_duell
+ [„Nicht jetzt.“]
    -> END

// Remis im Stellungsduell oder Endspiel (Regelwerk R13, R13a): Vorteil unter dem Mindest-
// vorteil. Vorher ging es in rosa_nach_sieg mit „gewonnen“ und Karte (schwacher Spieler im
// Spieler-Durchlauf, 19.11.2026).
=== rosa_nach_remis ===
Gehalten, aber nicht ausgebaut. Remis, noch mal? #sprecher:rosa #stimmung:laechelt
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
An der Haltestelle steht jemand. Gerade, die Füße nebeneinander, das Tablet in beiden Händen. #sprecher:erzaehler #musik:aus #schwenk:victor
Das Plakat hängt über {rv_ihm}. #sprecher:erzaehler
{rv_Er} zieht. Das Programm antwortet sofort. #sprecher:erzaehler #klang:tablet
Ein leises Klicken, wie ein Fingernagel auf Glas. #sprecher:erzaehler
* [„Spielst du gegen das Ding?“]
    Ich trainiere. Mein Vater ist im Rathaus. #sprecher:victor #stimmung:kalt
    Der Bezirk hat drei Bibliotheken. Er will alle drei. #sprecher:victor #stimmung:kalt
    Für Bildschirme. Es ist effizienter. #sprecher:victor #stimmung:kalt
* [Leise weitergehen]
    {rv_Er} sieht nicht auf. Klick. #sprecher:erzaehler #klang:tablet
    -> END
- Auf dem Brett geht es sehr schnell und sehr genau. {rv_Er} verliert. #sprecher:erzaehler
Langsam, Zug um Zug, gegen etwas, das nie zögert. #sprecher:erzaehler
* [„Gewinnst du manchmal?“]
    Remis. Einmal im Monat. #sprecher:victor #stimmung:kalt
    Mein Vater sagt, ein Remis gegen Schwächere ist eine Niederlage. Gegen das hier ist es ein Erfolg. #sprecher:victor #stimmung:bitter
* [Gehen]
    -> END
- {rv_Er} tippt auf „Neue Partie“. #sprecher:erzaehler
* [„Macht dir das eigentlich Spaß?“]
    ~ victorCedarCreekGesehen = true
    {rv_Sein}e Hand bleibt über dem Bildschirm stehen. #sprecher:erzaehler #geraeusch:aus #pause:3
    Das ist keine Frage, die man beim Training stellt. #sprecher:victor #stimmung:muede
    {rv_Er} zieht. Das Programm antwortet. #sprecher:erzaehler #klang:tablet
    Aber {rv_er} hat drei Sekunden gebraucht. Du hast mitgezählt. #sprecher:erzaehler
    -> victor_weg
* [Gehen]
    -> END

=== victor_weg ===
Erst auf dem Weg zum Steg, zwischen den Zedernhecken, hörst du Ambrose wieder. #sprecher:erzaehler #musik:victor
{rv_Er} hält den Kopf wie er. Ein wenig schief – wenn er rechnet. #sprecher:ambrose #stimmung:nachdenklich
* [„Wie wer?“]
    Keine Antwort. #sprecher:erzaehler #pause:2
* [Nichts sagen]
- -> END

=== victor_alltag ===
{rivale} spielt weiter auf {rv_sein}em Tablet. {rv_Er} sieht nicht auf. #sprecher:erzaehler
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
    // Lektorat der Lesefassung, 17.11.2026: nicht mehr „fährt jede Stunde“; in Maple Falls hängt der
    // Zettel „Mr. Kettering fährt nach Cedar Creek nur samstags“, deshalb gehen die beiden zu Fuß.
    Die Haltestelle von Cedar Creek. {teamAngekommen:Das Auswärtsspiel läuft noch.|Morgen ist der Clubkampf.} #sprecher:erzaehler
    // Lektorat Akt 1, 17.11.2026: Am Freitag steht Mr. Kettering schon hier, obwohl er „nur samstags“
    // nach Cedar Creek fährt. Er wohnt im Ort; die Fahrt hinüber am Freitag ist seine Leerfahrt.
    {not teamAngekommen: Mr. Kettering wohnt hier. Heute fährt er den Bus leer nach Maple Falls, morgen früh bringt er das Team. #sprecher:erzaehler}
}
// Lektorat 19.11.2026: Nach dem Gespräch mit Kettering zurück zu den Wahlen, ohne die Einleitung.
// Lektorat 20.11.2026 (Story-Bibel, Ablauf Akt 1: „Der Bus … bleibt für die Rückfahrt“): Die
// Vorhut schläft erst im Lesesaal; vorher fährt der Bus ohne {held}.
{not nachtImLesesaal and not endeAkt1Gesehen: Heute fährt er ohne dich. Ihr seid die Vorhut. #sprecher:erzaehler}
- (wahl)
+ {nachtImLesesaal or endeAkt1Gesehen} [Nach Maple Falls fahren]
    Der Bus rollt die Landstraße entlang. Hinter dir werden die Zedern kleiner. #sprecher:erzaehler
    ~ reise("mapleFalls.park", "bushaltestelle")
    -> END
+ [Mit dem Busfahrer reden]
    -> kettering
+ [Noch bleiben]
    -> END

// ---------------------------------------------------------------- Ankunft zu Fuß (W5)
// Ankunft über den Flussweg: dieselbe Szene wie „ankunft“ (Runde 11, VC30).

// Anwesenheit (25.11.2026): Die Ankunft lief am Ende des Flusswegs, also auf dessen Karte, und
// erzählte schon die Zwillinge auf der Bibliothekstreppe. Jetzt spielt sie beim Betreten von Cedar
// Creek (Eingang der Karte cedarCreek.aussen, orte.json), wo die Zwillinge stehen.
=== ankunft_zu_fuss ===
Der Flussweg endet an der Bushaltestelle von Cedar Creek. #sprecher:erzaehler
-> END

// ---------------------------------------------------------------- Zedernpfad nach Maple Falls
// Übergang „zedernpfad“ (orte.json, wenn: nadelCedarCreek): Der Pfad ist bis zur zweiten Nadel
// gesperrt, wie auf der Seite des Parks (maple-falls-park.stamm_s2, Kartengutachten Akt 1).

=== zedernpfad_zu ===
{nadelCedarCreek >= 1:
    -> END
- else:
    Der Pfad führt zwischen die Zedern, Richtung Maple Falls. Nach ein paar Schritten liegt ein umgestürzter Stamm quer über dem Weg. #sprecher:erzaehler
    Von dieser Seite kommst du nicht hinüber. Mit dem Bus geht es schneller. #sprecher:erzaehler
    -> END
}

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
Wir müssen hin. Bevor es weg ist. #sprecher:juno #stimmung:ueberrascht
* [„Was weg ist?“]
    Weiß ich nicht. Das, was vorher da war. #sprecher:juno #stimmung:nachdenklich
* [Nicken]
- Coach Delgado kann nicht mit. Sitzung im Schulamt. #sprecher:erzaehler
Als sie das sagte, sah sie zum Bildschirm auf ihrem Pult. #sprecher:erzaehler
Auf dem Handy eine Nachricht von Mama: „Riverton. Mit dem Zug zurück, vor dem Dunkelwerden.“ #sprecher:erzaehler
Sie hat nicht gefragt, warum. Sie fragt in letzter Zeit weniger. #sprecher:erzaehler
* [„Dann los. Zu Fuß durch den Wald.“]
    Zu Fuß! Zurück nehmen wir den Zug. #sprecher:juno #stimmung:froh
    Abenteuer mit Rückfahrkarte. #sprecher:juno #stimmung:froh
* [„Und wenn wir zu spät sind?“]
    Dann sehen wir wenigstens, was da jetzt steht. Und ich schreib es auf. #sprecher:juno #stimmung:laechelt
- Bäume, die älter sind als ich. Endlich jemand in meinem Alter. #sprecher:ambrose #stimmung:lacht
-> END

// ================================================================ Runde 11: Roman, Kapitel 10
// Geänderter Ablauf (docs/spiel/roman/akt1_teil3.md, „Neu gegenüber der Story-Bibel“): {held}
// und Juno kommen am Freitag zu Fuß an, schlafen im Lesesaal, das Team kommt am Samstag mit dem
// Bus. Der Bus bleibt für die Rückfahrt und zum Hin- und Herfahren. Die Turmuhr schlägt bei der
// Ankunft (Klang turmuhr, neu; Dokument 21 ordnet ihn zu); die Ankunft selbst steht im Knoten
// „ankunft“ oben. Stimmung: still, dann forschend.

// Anwesenheit (25.11.2026): Coach und Sam stehen an der Haltestelle, solange das Team noch nicht
// angekommen ist (cedarCreek.coachCedar, samCedar); teamAngekommen erst am Ende, sonst verschwänden
// sie mitten im Gespräch, und am Schluss gehen sie zur Bibliothek.
=== team_kommt ===
Über dem Ort schlägt die Uhr acht. Auf der Straße klappert ein Bus. #sprecher:erzaehler #klang:bus
Dann ein Pfiff auf zwei Fingern. #sprecher:erzaehler #klang:pfiff_finger
Morgen, Vorhut! Steht die Bibliothek noch? #sprecher:coachDelgado #stimmung:laechelt
Ich hab im Bus geschlafen. Mit dem Kopf auf dem Schachkoffer, der ist hart. #sprecher:sam #stimmung:laechelt
* {sternennachtGesehen} [„Wir haben elf Sternschnuppen gesehen.“]
    Elf? Und ich hab geschlafen – typisch. #sprecher:sam #stimmung:ueberrascht
* [„Wir haben auf Matten geschlafen. Zwischen den Regalen.“]
    Zwischen Büchern? Da wär ich nie eingeschlafen. #sprecher:sam #stimmung:lacht
    Doch. Wär ich. #sprecher:sam #stimmung:lacht
- Clubkampf am Vormittag. Bis dahin: Kopf frei, Figuren sortiert. #sprecher:coachDelgado #stimmung:froh #klang:pfiff
Der Bus wartet bis heute Abend. Mr. Kettering fährt uns zurück. #sprecher:coachDelgado #stimmung:neutral
~ teamAngekommen = true
Der Coach und Sam gehen voraus zur Bibliothek. #sprecher:erzaehler #gehe:coachCedar>bibliothekTuer;samCedar>bibliothekTuer
-> END

// ---------------------------------------------------------------- Mr. Kettering, der Busfahrer
// Kleine Geschichte (Dokument 20, Cedar Creek). Stufen wie auf dem Weg: A bis zur Nadel von Cedar
// Creek, B danach bis zur Nadel von Riverton, C in Akt 2, D nach Akt 2 (nadelIronwood). Spricht
// mit eigener Kennung „kettering“ (noch ohne Porträt). Einstieg: Wahl in bus_zurueck.

=== kettering ===
// Lektorat der Lesefassung, 17.11.2026: Am Samstagmorgen kommt zuerst der Bus mit dem Team. Sonst las
// Mr. Kettering an der Haltestelle Zeitung, und gleich darauf klapperte sein Bus erst heran.
{nachtImLesesaal and not teamAngekommen: -> team_kommt}
{
- nadelIronwood > 0: -> kettering_d
- nadelRiverton > 0: -> kettering_c
- nadelCedarCreek > 0: -> kettering_b
- else: -> kettering_a
}

=== kettering_a ===
Der Busfahrer hat die Mütze in den Nacken geschoben und liest Zeitung. #sprecher:erzaehler
Einunddreißig Jahre fahr ich diese Strecke. Jede Kurve hat einen Namen. #sprecher:kettering #stimmung:laechelt
Die meisten hab ich vergeben. #sprecher:kettering #stimmung:laechelt
+ [„Welche Kurve ist die schönste?“]
    Die Witwe. Nach der sieht man den Wasserfall. #sprecher:kettering #stimmung:laechelt
+ [„Wird es nicht langweilig?“]
    Die Kurven sind dieselben. Die Leute nicht. #sprecher:kettering #stimmung:laechelt
- -> bus_zurueck.wahl

=== kettering_b ===
Die Linie wird geprüft, haben sie gesagt. Was es da zu prüfen gibt, weiß ich nicht. #sprecher:kettering #stimmung:nachdenklich
Er faltet die Zeitung zusammen. #sprecher:erzaehler
Ich fahr sie jedenfalls, solange sie mich lassen. #sprecher:kettering #stimmung:nachdenklich
-> bus_zurueck.wahl

=== kettering_c ===
An der Haltestelle hängt ein neuer Fahrplan. Die Spalten sind kürzer als früher. #sprecher:erzaehler
Mr. Kettering sieht hinüber und sagt nichts. Er nickt dir zu und lässt den Motor an. #sprecher:erzaehler
-> bus_zurueck.wahl

=== kettering_d ===
Der neue Fahrplan ist überklebt. Darauf steht mit Kugelschreiber: „Fährt doch.“ #sprecher:erzaehler
Einunddreißig Jahre. Und ein paar Monate, wer zählt mit? #sprecher:kettering #stimmung:laechelt
{not abschiedGesehen:
    Ein Mann, der seine Strecke nicht hergibt. Er hätte auch Postkutschen gefahren. #sprecher:ambrose #stimmung:laechelt
}
-> bus_zurueck.wahl

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
Diesmal guck ich die ganze Zeit. #sprecher:jonah #stimmung:nachdenklich
Dann ziehst du ja nie! #sprecher:ivy #stimmung:lacht
* [„Wer hat denn gewonnen?“]
    Beide zeigen auf sich. Dann aufeinander. #sprecher:erzaehler
    Dann wieder auf sich. #sprecher:erzaehler
* [Leise vorbeigehen]
    Als du vorbeigehst, verstummen sie und sehen dir nach. #sprecher:erzaehler
- Zwei Türme und kein Brett. Daraus wird nie ein Ende. #sprecher:ambrose #stimmung:lacht
-> END

=== zwillinge_b ===
Die Zwillinge sitzen wieder auf der Treppe. Zwischen ihnen liegt jetzt ein Zettel mit Strichen. #sprecher:erzaehler
Miss Ashby zählt mit. Sie ist die Schiedsrichterin – sie guckt immer. #sprecher:ivy #stimmung:laechelt
Dreizehn zu zwölf. Für mich. #sprecher:jonah #stimmung:laechelt
Für mich! #sprecher:ivy #stimmung:bitter
-> END

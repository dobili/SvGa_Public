// Weg 6 von Port Delacroix nach Desert Springs: Karten „Canyonpfad“ und „Felsbogen“ (Akt 3,
// Szenen 71 bis 73 der Story-Bibel, Abschnitt 19.5).
//
// Stationen (W4): Wanderin Mrs. Holloway mit einer Weisheit (Kapitel 1, Abschnitt 1.6),
// Rätseltafel am Wanderschild (Runde wegDelacroixDesert.tafel, drei Königsangriffe), Mira auf
// ihrem Stein (Szene 72, Hauptquest desertSprings.versoehnung), die Versöhnung am Felsbogen
// (Szene 73, R29 endet: die Quest gibt erst hier den Mentor-Zug aus Port Delacroix), Funde Eidechsenhaut und Nieten J. H. an der Canyonbrücke.
// Einstiege wie in orte.json: holloway, zurueck_delacroix, tafel, fund_eidechsenhaut, mira_stein,
// versoehnung, fund_nieten. Die Ankunft erzählt desert-springs-aussen.ankunft_zu_fuss.
//
// Ambrose spricht nur, wenn er nach den Nachfahren wieder redet (ambroseSprichtWieder); die
// Versöhnung setzt die Variable in jedem Fall. Die Funde gibt gibFund; Ink merkt sie sich
// zusätzlich selbst. Variablen: wegDelacroixDesertTafelBestanden setzt die Hülle (R42),
// versoehnungGesehen und miraSteinGesehen setzt diese Datei.

EXTERNAL beginneAufgaben(runde)
EXTERNAL gibFund(kennung)
EXTERNAL beginneGedaechtnis(kennung)

VAR held = "Du"
VAR ambroseSprichtWieder = false
VAR wegDelacroixDesertTafelBestanden = false
VAR hollowayGetroffen = false
VAR miraSteinGesehen = false
VAR versoehnungGesehen = false
VAR eidechsenhautGefunden = false
VAR nietenCanyonGefunden = false
VAR gefundenNietenkopf = false
VAR nietenAmbroseGesehen = false
// Aus capital-arena-aussen.ink: Nach dem Abschied (Szene 109) spricht Ambrose nicht mehr
// (Story-Bibel Abschnitt 33, Frage 5; Entscheidung Q21-5). Hier nur gelesen.
VAR abschiedGesehen = false
// Zähl-Merker der Sammelstücke (Chaos-Prüfung, 14.11.2026): gesetzt erst zusammen mit dem
// Zähler und dem Fund, damit Abbrechen oder Neuladen kein Stück verliert.
VAR seite06Gezaehlt = false
VAR finchLaeuferBGezaehlt = false

// ---------------------------------------------------------------- Mrs. Holloway

=== holloway ===
// Kapitel 41 (Roman): Mrs. Holloway füllt am Wanderschild ihre Flasche. Der stille Canyon und
// Ambroses erste Sätze stehen am Anfang von mira_stein (Pflichtschritt, Gutachten M1.7).
{hollowayGetroffen:
    {~Mehr Wasser als Weg.|Wer angreift, braucht mehr Figuren am König. Und mehr Wasser.} #sprecher:holloway #stimmung:laechelt
    -> END
}
~ hollowayGetroffen = true
Eine Frau mit Strohhut füllt am Wanderschild ihre Flasche an einem Rohr, aus dem ein dünner Strahl kommt. #sprecher:erzaehler
Wer angreift, braucht mehr Figuren am König als der Verteidiger. Sonst ist es kein Angriff, sondern ein Ausflug. #sprecher:holloway #stimmung:laechelt
Gilt auch fürs Wandern. Mehr Wasser als Weg. #sprecher:holloway #stimmung:lacht
-> END

= holloway_gefaellt
* [„Gefällt sie dir?“]
- Ich weiß es noch nicht. Ich bin es nicht mehr gewohnt, etwas nicht sofort zu wissen. #sprecher:ambrose #stimmung:nachdenklich
Er sieht zu dem Vogel hinauf. #sprecher:erzaehler
Es ist angenehm. #sprecher:ambrose #stimmung:still
->->

// ---------------------------------------------------------------- Rätseltafel und Rückweg

=== tafel ===
{wegDelacroixDesertTafelBestanden:
    Auf dem Wanderschild hat jemand mit Kreide einen kleinen Kaktus gemalt. Darunter: „Gelöst“. #sprecher:erzaehler
    -> END
}
// Nach einem Fehlversuch (Rückmeldung nach dem Ergebnis, 19.11.2026; vorher bot sich die Tafel
// wortgleich neu an).
{wegDelacroixDesertTafelVersucht: Auf der Tafel stehen noch deine Striche vom letzten Versuch. Ganz gelöst ist sie nicht. #sprecher:erzaehler}
Am Wanderschild „Desert Springs, 4 Meilen“ hängt eine Rätseltafel, das Blech heiß von der Sonne: „Der König steht im Freien. Greif an!“ #sprecher:erzaehler
+ [Die Aufgaben lösen]
    ~ beginneAufgaben("wegDelacroixDesert.tafel")
    -> END
+ [Weitergehen]
    -> END

=== zurueck_delacroix ===
Der Pfad führt zurück zum einsamen Bahnhof. Der nächste Zug fährt nach Port Delacroix. #sprecher:erzaehler
-> END

// ---------------------------------------------------------------- Mira auf dem Stein

=== mira_stein ===
// Kapitel 41 (Roman): Mira spielt gegen sich selbst und opfert die Dame. Ambrose merkt, wie er
// klingt (wie vor dem Tablet), und entschuldigt sich. Musik: Miras Motiv; Echo auf den Stimmen.
{miraSteinGesehen:
    Der flache Stein ist leer. Im Staub sieht man noch die Abdrücke eines Bretts. #sprecher:erzaehler
    -> END
}
~ miraSteinGesehen = true
// Gutachten M1.7: Ambrose spricht hier wieder (Bibel, Szene 71), ohne Bedingung.
~ ambroseSprichtWieder = true
Die Wände sind rot und gestreift, Schicht über Schicht, als hätte jemand die Zeit aufgeschnitten. #sprecher:erzaehler #musik:aus #geraeusch:canyon
Eine Eidechse rührt sich nicht. Hoch oben kreist ein Vogel, ohne die Flügel zu bewegen. #sprecher:erzaehler
Ambrose ist noch blass, aber er ist da. #sprecher:erzaehler
Ich war nie in einer Wüste. #sprecher:ambrose #stimmung:nachdenklich #musik:ambrose.gitarre
Sie ist so still wie ein Club. Wie ein guter. #sprecher:ambrose #stimmung:laechelt
Einer, in dem man hört, wenn jemand nachdenkt. #sprecher:ambrose #stimmung:laechelt
-> holloway.holloway_gefaellt ->
Hinter der nächsten Biegung, mitten im trockenen Bachbett, liegt ein Stein, flach wie ein Tisch. Darauf ein Mädchen, zwei Zöpfe, Schrammen an beiden Knien. #sprecher:erzaehler #musik:aus
Sie spielt gegen niemanden. Sie zieht für Weiß, dreht das Brett um, zieht für Schwarz. #sprecher:erzaehler
Ernst wie ein Chirurg. #sprecher:erzaehler
Sie hält die weiße Dame einen Atemzug lang in der Luft. Dann stellt sie sie mitten zwischen die schwarzen Figuren. #sprecher:erzaehler #bild:mira_damenopfer
Oh. #sprecher:ambrose #stimmung:ueberrascht
Sie dreht das Brett um und schlägt die Dame. Dreht es wieder. #sprecher:erzaehler #bild:aus
Ein Springer, ein Läufer, und der schwarze König liegt um. #sprecher:erzaehler
-> mira_ambrose ->
-> mira_spricht

= mira_ambrose
Sie spielt wie ich mit zwanzig. Nur besser, viel besser. #sprecher:ambrose #stimmung:froh
Sie zögert nicht. Aber sie rechnet. #sprecher:ambrose #stimmung:ueberrascht
Sie rechnet, und sie zögert nicht, und … #sprecher:ambrose #stimmung:ueberrascht
Er hört auf. Er hat gemerkt, wie er klingt. #sprecher:erzaehler
Wie vor einem Tablet in einer weißen Nacht. #sprecher:erzaehler #pause
Verzeih. #sprecher:ambrose #stimmung:ertappt
* [„Schon gut.“]
- Nein. Es ist nicht gut. #sprecher:ambrose #stimmung:nachdenklich
Aber es ist anders. Siehst du den Unterschied? #sprecher:ambrose #stimmung:nachdenklich
Ich sehe ihn erst jetzt. Sie hat sich die Knie aufgeschlagen. #sprecher:ambrose #stimmung:still
->->

= mira_spricht
Sie mustert dich, von den Schuhen bis zu den Nadeln. #sprecher:erzaehler #musik:mira
Wer bist du? #sprecher:mira #stimmung:nachdenklich
* [„{held}.“]
- Bist du gut? #sprecher:mira #stimmung:nachdenklich
* [„Ich werde besser.“]
- Sie denkt darüber nach. Es scheint ihr als Antwort zu genügen. #sprecher:erzaehler
Im Canyon antwortet das Echo. Am Brett nicht. #sprecher:mira #stimmung:nachdenklich
Deshalb mag ich das Brett. #sprecher:mira #stimmung:nachdenklich
Ich bin Mira. Komm morgen in die Garage, am Motel. #sprecher:mira #stimmung:laechelt
Wenn du gut bist, spielen wir. Wenn nicht, auch, aber kürzer. #sprecher:mira #stimmung:laechelt
Sie springt vom Stein und läuft barfuß über den heißen Sand davon, das Brett unter dem Arm. #sprecher:erzaehler
-> END

// ---------------------------------------------------------------- Die Versöhnung

=== versoehnung ===
{
- versoehnungGesehen:
    Unter dem Felsbogen pfeift der Wind durch die alte Eisenbahnbrücke. #sprecher:erzaehler
    -> END
- not miraSteinGesehen:
    Der Felsbogen wirft einen kurzen Schatten. Es ist noch früh am Tag. #sprecher:erzaehler
    Hinten im Canyon klappern Figuren. #sprecher:erzaehler
    -> END
}
-> versoehnung_abend

=== versoehnung_abend ===
// Kapitel 42 (Roman), das Herz von Akt 3. Klangplan S56: Wind, dann Stille; die Bitte ganz ohne
// Musik; bei „Das ist schöner“ ambrose.held; „Erzähl mir von 1866“ nur ein tiefer Streicherton;
// „Ich bin nicht angekommen“ Stille. Ambroses Erzählung von 1866 im Sepia-Rahmen (#erinnerung).
~ versoehnungGesehen = true
~ ambroseSprichtWieder = true
Wo der Canyon sich öffnet, steht ein Bogen aus Fels. Ein Tor ohne Mauer, so hoch wie ein Haus. #sprecher:erzaehler #licht:abend #musik:aus
Das Licht kommt flach und färbt alles: den Fels, den Sand, deine Hände. Kupfer, dann Gold. #sprecher:erzaehler
Wenn nicht hier, dann nirgends. Du stellst den Geigenkasten auf einen Stein und nimmst das Brett heraus. #sprecher:erzaehler
* [„Setz dich.“]
- Er sieht dich an. Dann setzt er sich, dir gegenüber, auf den Fels. #sprecher:erzaehler
Zum zweiten Mal in seinem Tod. Der Wind geht durch den Bogen. #sprecher:erzaehler #pause:4
Ich habe einer Maschine zugesehen. Tausendachthundert Partien in einer Nacht. #sprecher:ambrose #stimmung:still
Ich habe zugesehen, weil sie nie zweifelt. Weil sie die Gewissheit hat, bevor man die Hand hebt. #sprecher:ambrose #stimmung:nachdenklich
Du sagst nichts. #sprecher:erzaehler #pause
Dann hat ein Junge mit einer Trompete gesagt, dass du schummelst. Er hatte recht, und es war meine Schuld. #sprecher:ambrose #stimmung:bitter
Ich habe dir einen Zug gegeben, den ich nicht verstand. Ich habe ihn nur wiedererkannt, wie ein Papagei. #sprecher:ambrose #stimmung:ertappt
Sechs Tage im Kasten habe ich gehört, wie du nachdenkst. Und ich wusste nicht, was du ziehen wirst. #sprecher:ambrose #stimmung:nachdenklich
Er hebt den Kopf. #sprecher:erzaehler
Ich wusste es nicht, {held}. Zum ersten Mal. #sprecher:ambrose #stimmung:laechelt
Ich habe mir die Nägel abgekaut, die ich nicht habe. #sprecher:ambrose #stimmung:laechelt
Das Licht wird röter. #sprecher:erzaehler #pause
Du hast gefragt: Und ich? Ich schulde dir die Antwort. #sprecher:ambrose #stimmung:nachdenklich
Die Maschine zweifelt nie. Das ist wahr, und es ist schön, und ich nehme nichts davon zurück. #sprecher:ambrose #stimmung:nachdenklich
Aber ich habe etwas vergessen. Du zweifelst. #sprecher:ambrose #stimmung:riss
Du zählst dreimal. Du hast Angst, dass es nicht stimmt. #sprecher:ambrose #stimmung:riss
Und dann spielst du trotzdem. #sprecher:ambrose #stimmung:riss
Seine Stimme bricht. #sprecher:erzaehler #pause:2
Das ist schöner. #sprecher:ambrose #stimmung:laechelt #musik:ambrose.held
Ein Opfer von jemandem, der weiß, dass es stimmt, ist eine Rechnung. #sprecher:ambrose #stimmung:nachdenklich
Ein Opfer von jemandem, der hofft, dass es stimmt, und es geprüft hat, so gut er kann, und dem dabei das Herz schlägt … #sprecher:ambrose #stimmung:laechelt #pause
Das ist das, wofür der Verlierer zum Telegrafenamt läuft. #sprecher:ambrose #stimmung:laechelt
* [„Du warst ein Idiot.“]
- Ja. #sprecher:ambrose #stimmung:nachdenklich
* [„Ich hab dich vermisst.“]
- Ich dich auch. Und ich war die ganze Zeit drei Schritte neben dir. #sprecher:ambrose #stimmung:lachtOhneSpott
Das ist das Dümmste daran. #sprecher:ambrose #stimmung:lachtOhneSpott
Die Sonne berührt den Rand der Welt. #sprecher:erzaehler #licht:nacht
* [„Erzähl mir von 1866.“]
- Er nickt, als hätte er darauf gewartet. #sprecher:erzaehler #musik:tiefer_streicher
-> erzaehlung_1866

= erzaehlung_1866
Er hatte Ja gesagt. Zur Revanche. #sprecher:ambrose #stimmung:nachdenklich #erinnerung
Per Brief, weil er im Norden Brücken baute und ich im Süden saß. #sprecher:ambrose #stimmung:nachdenklich
Ein Zug, ein Brief. Über ein Jahr. #sprecher:ambrose #stimmung:laechelt
Es war die beste Partie meines Lebens. #sprecher:ambrose #stimmung:laechelt
Ich habe gespielt wie er, gewissenhaft. Und er ein wenig wie ich. #sprecher:ambrose #stimmung:alt
Er hat Dinge riskiert, die er im Match damals nie riskiert hätte. #sprecher:ambrose #stimmung:alt
* [„Und dann?“]
- Dann wurde es ein Endspiel. Und Winter. #sprecher:ambrose #stimmung:nachdenklich
Sein neununddreißigster Zug kam nicht. Vier Wochen. #sprecher:ambrose #stimmung:nachdenklich
Sechs. Acht. #sprecher:ambrose #stimmung:nachdenklich
Ich dachte, er lässt mich warten, weil er es kann. Ich konnte nicht mehr warten. #sprecher:ambrose #stimmung:bitter
Ich band die Figuren in der Stellung fest und stieg in eine Kutsche. Nach Norden. #sprecher:ambrose #stimmung:bitter
Ich wollte ihm ins Gesicht sehen. #sprecher:ambrose #stimmung:bitter
Elf Tage. In einer Bergbausiedlung bekam ich Fieber. #sprecher:ambrose #stimmung:bitter
Das Brett stand auf dem Stuhl neben dem Bett. #sprecher:ambrose #stimmung:bitter
Sein Zug hat mich dort noch erreicht. Ich habe geantwortet. #sprecher:ambrose #stimmung:nachdenklich
Wie, das erzähle ich dir ein andermal. #sprecher:ambrose #stimmung:nachdenklich
Ich bin nicht angekommen. Darum warte ich noch. #sprecher:ambrose #stimmung:traurig #musik:aus #erinnerung:aus #pause:3
Du denkst an einen leeren Umschlag in einem Postsack. An eine senkrechte Schrift. #sprecher:erzaehler
Sie sind aneinander vorbeigefahren. #sprecher:erzaehler
-> versoehnung_lektion

=== versoehnung_lektion ===
// Lektion: das Thema hell, fast heiter (ambrose.heiter). Ambrose ist ab hier wieder voll sichtbar.
Komm. #sprecher:ambrose #stimmung:laechelt #musik:ambrose.heiter
Er steht auf. Er ist nicht mehr blass. #sprecher:erzaehler
Ich habe dir das Zählen beigebracht, weil du es brauchtest. Was ich wirklich kann, habe ich dir nie gezeigt. #sprecher:ambrose #stimmung:nachdenklich
Ich hatte Angst, du würdest es so schlecht machen wie ich. Jetzt kannst du zählen. #sprecher:ambrose #stimmung:nachdenklich
Jetzt zeige ich es dir. #sprecher:ambrose #stimmung:nachdenklich
Ein Opfer ist kein Geschenk und kein Kunststück. Es ist ein Tausch. #sprecher:ambrose #stimmung:nachdenklich
Holz gegen Zeit, Raum oder einen König im Freien. #sprecher:ambrose #stimmung:nachdenklich
Erste Frage: Wie viele Angreifer am König, wie viele Verteidiger? Du brauchst mehr. #sprecher:ambrose #stimmung:nachdenklich
Zweite Frage: Hat er einen Zug, der alles hält? Den suchst du. #sprecher:ambrose #stimmung:nachdenklich
Für ihn. So gründlich, als wärst du er. #sprecher:ambrose #stimmung:nachdenklich
* [„Und wenn ich ihn nicht finde?“]
- Dann hoffst du. Und spielst es. #sprecher:ambrose #stimmung:lachtOhneSpott
Und siehst ihm ins Gesicht. #sprecher:ambrose #stimmung:lachtOhneSpott
Das ist der Teil, den keine Maschine kann. Sie muss nie hoffen, arme Maschine. #sprecher:ambrose #stimmung:laechelt
Ihr übt, bis das Licht fort ist. #sprecher:erzaehler
Morgen in die Garage am Motel, hat Mira gesagt. Wenn du gut bist, spielt ihr. #sprecher:erzaehler
Im Geigenkasten liegt eine Karte, die du seit Port Delacroix nicht angefasst hast. #sprecher:erzaehler
{nietenCanyonGefunden:
    Als ihr absteigt, im letzten Grau, bleibt ihr an der Brücke unter dem Felsbogen stehen. J. #sprecher:erzaehler
    H. auf jeder Niete, am Pfeiler die Platte: 1879. #sprecher:erzaehler
    -> fund_nieten.nieten_ambrose
}
Als ihr absteigt, im letzten Grau, siehst du etwas, das du vorher nicht bemerkt hast. #sprecher:erzaehler
-> fund_nieten

// ---------------------------------------------------------------- Funde

=== fund_eidechsenhaut ===
{eidechsenhautGefunden:
    Zwischen den Steinen sonnt sich eine Eidechse. Sie hat eine neue Haut. #sprecher:erzaehler
    -> END
}
~ eidechsenhautGefunden = true
Zwischen zwei Steinen liegt eine Eidechsenhaut, dünn wie Papier und ganz heil. #sprecher:erzaehler
~ gibFund("eidechsenhaut")
{ambroseSprichtWieder:
    {not abschiedGesehen:
        Sie lässt ihr Kleid einfach liegen. Donnerwetter. #sprecher:ambrose #stimmung:ueberrascht
    }
}
-> END

=== fund_nieten ===
// Kapitel 42, Schluss: die Brücke von 1879 unter dem Felsbogen, Hales Motiv auf dem Horn. Läuft am
// Ende der Lektion von selbst (Gutachten M1.8); wer sie früher antippt, bekommt nur das Bild.
{nietenCanyonGefunden and not versoehnungGesehen:
    Die Nieten der Brücke glänzen, Reihe um Reihe. Am Pfeiler die Platte: 1879. #sprecher:erzaehler
    -> END
}
{nietenCanyonGefunden and nietenAmbroseGesehen:
    Die Nieten der Brücke glänzen, Reihe um Reihe. Am Pfeiler die Platte: 1879. #sprecher:erzaehler
    -> END
}
// Nach dem Abschied (abschiedGesehen) entfällt Ambroses Satz an der Brücke.
{nietenCanyonGefunden and abschiedGesehen:
    Die Nieten der Brücke glänzen, Reihe um Reihe. Am Pfeiler die Platte: 1879. #sprecher:erzaehler
    -> END
}
{nietenCanyonGefunden: -> nieten_ambrose}
~ nietenCanyonGefunden = true
Unter dem Felsbogen überspannt eine Brücke die Schlucht, wo sie am engsten ist. Schwarzes Eisen, lauter Dreiecke. #sprecher:erzaehler
Auf jeder Niete, klein und sauber: J. H. #sprecher:erzaehler #bild:platte_1879
Am Pfeiler, eingegossen in eine Platte: 1879. #sprecher:erzaehler
~ gibFund("nietenCanyonbruecke")
{abschiedGesehen:
    Die Nieten glänzen, Reihe um Reihe. #sprecher:erzaehler #bild:aus
    -> END
}
{versoehnungGesehen:
    -> nieten_ambrose
}
Ambrose sagt nichts. Aber du spürst, dass er hinsieht. #sprecher:erzaehler #bild:aus
-> END

= nieten_ambrose
~ nietenAmbroseGesehen = true
* [„Dreizehn Jahre danach.“]
- Er hat gelebt. Lange. #sprecher:ambrose #stimmung:laechelt #musik:hale.horn #bild:aus
Er hat weitergebaut, bis hierher, ans Ende von allem. #sprecher:ambrose #stimmung:laechelt
Er legt die Hand auf das Eisen. #sprecher:erzaehler
Gut so. #sprecher:ambrose #stimmung:still
-> END

// >>> Runde 6 (mittel-4)
VAR finchFiguren = 0
VAR buchseiten = 0
VAR hatLaterne = false
VAR sternwarteOffen = false
VAR seilschaftBegonnen = false
VAR seilschaftFertig = false
VAR wegDelacroixDesertSeilschaftBestanden = false
VAR gefundenSeite06 = false
VAR gefundenFinchLaeuferB = false
// Setzt die Hülle nach jeder gespielten Runde, auch ohne Bestehen (regeln/dialogvariablen.ts).
VAR wegDelacroixDesertTafelVersucht = false

// ---------------------------------------------------------------- Ereignis: Die Seilschaft (Dokument 15, 2.7)
// Erst nach der Versöhnung (Akt 3, bei der Rückkehr). Vorher liegen nur Seile, Rucksäcke und ein Kreidebeutel
// am Wandfuß. Gedächtnisstellung wegDelacroixDesert.seilschaft (partieformen.json): Ferris zeigt oben die Stellung
// fünf Sekunden, {held} baut sie aus dem Gedächtnis auf; bestanden setzt wegDelacroixDesertSeilschaftBestanden.

=== ereignis_seilschaft ===
{not versoehnungGesehen:
    Am Fuß der Wand liegen zwei Rucksäcke, ein Kreidebeutel und ein Seil, das nach oben führt. Niemand ist zu sehen. #sprecher:erzaehler
    -> END
}
{seilschaftFertig:
    Wren winkt von unten, Tess von weit oben. Das Seil ist straff. #sprecher:erzaehler
    -> END
}
{wegDelacroixDesertSeilschaftBestanden: -> seilschaft_ende}
{seilschaftBegonnen: -> seilschaft_nochmal}
-> seilschaft_start

=== seilschaft_start ===
~ seilschaftBegonnen = true
Zwei Kletterinnen hängen in der Wand am Felsbogen, eine unten, eine hoch oben. Zwischen ihnen pfeift der Wind. #sprecher:erzaehler
Wir spielen eine Partie, ein Zug pro Seillänge. Aber ich höre Tess nicht mehr! #sprecher:wren #stimmung:ueberrascht
Ich zeige dir oben die Stellung. Merk sie dir und ruf sie Wren zu! #sprecher:ferris #stimmung:froh
-> seilschaft_runde

// Wiederkehr nach der Gedächtnisstellung (Rückmeldung, Wunsch des Autors, 19.11.2026): Vorher
// begann sie ohne Wahl sofort neu, nach einem Fehlversuch also gleich noch einmal.
=== seilschaft_nochmal ===
Wren greift ins Leere. Die Stellung ist unten nicht ganz angekommen. #sprecher:erzaehler
Noch einmal? Schau oben genau hin, dann ruf sie ihr zu. #sprecher:ferris #stimmung:nachdenklich
+ [Noch einmal hinschauen]
    -> seilschaft_runde
+ [„Später.“]
    Wir hängen hier noch eine Weile. Das Seil hält. #sprecher:ferris #stimmung:laechelt
    -> END

=== seilschaft_runde ===
Schau genau hin. Unten sieht Wren das Brett nicht. #sprecher:ferris #stimmung:nachdenklich
~ beginneGedaechtnis("wegDelacroixDesert.seilschaft")
-> END

=== seilschaft_ende ===
{seilschaftFertig: -> END}
~ seilschaftFertig = true
Das Echo trägt deine Züge durch den Canyon. Unten nickt Wren, oben jubelt Tess. #sprecher:erzaehler
Du hast die Stellung im Kopf behalten. Hier, der Karabiner gehört dir. #sprecher:wren #stimmung:laechelt
Er hält mehr, als er wiegt. #sprecher:wren #stimmung:laechelt
~ gibFund("karabiner")
{ambroseSprichtWieder:
    {not abschiedGesehen:
        Blind spielen heißt: das Brett tragen, ohne es zu sehen. #sprecher:ambrose #stimmung:nachdenklich
    }
}
-> END

// ---------------------------------------------------------------- Funde am Felsbogen

=== seite06 ===
{seite06Gezaehlt:
    Unter dem Bogen ist nur noch Sand. #sprecher:erzaehler
    -> END
}
Unter dem Felsbogen klemmt eine lose Seite zwischen zwei Steinen, voller Schachdiagramme. #sprecher:erzaehler
~ seite06Gezaehlt = true
~ buchseiten = buchseiten + 1
~ gibFund("seite06")
-> END

=== finch_laeufer_b ===
{finchLaeuferBGezaehlt:
    Im Felsspalt ist nur noch das Finkenzeichen aus Kreide. #sprecher:erzaehler
    -> END
}
Neben einem kleinen Fink aus Kreide steckt etwas im Felsspalt: ein weißer Läufer aus Buchsbaum. #sprecher:erzaehler
Unter seinem Fuß ist ein Feld eingebrannt. #sprecher:erzaehler
~ finchLaeuferBGezaehlt = true
~ finchFiguren = finchFiguren + 1
~ gibFund("finchLaeuferB")
-> END

// ---------------------------------------------------------------- Sperre S9: Abzweig zur Sternwarte
// Öffnet mit Laterne und Versöhnung (13_Wegenetz, S9). Der Dialog setzt sternwarteOffen, die Hülle
// prüft danach `wenn` am Übergang.

=== sternwarte_abzweig ===
{
- hatLaterne and versoehnungGesehen:
    ~ sternwarteOffen = true
    Die Laterne zeigt den schmalen Pfad zwischen dem Geröll. Oben auf der Felsnase schimmert eine weiße Kuppel. #sprecher:erzaehler
- not versoehnungGesehen:
    Geröll liegt quer über dem Pfad nach oben. Mit dem Streit im Kopf willst du hier nicht klettern. #sprecher:erzaehler
- else:
    Der Pfad zur Felsnase führt steil zwischen Geröll hinauf, und es wird schon dunkel. Ohne Licht ist das zu gefährlich. #sprecher:erzaehler
}
-> END
// <<< Runde 6 (mittel-4)

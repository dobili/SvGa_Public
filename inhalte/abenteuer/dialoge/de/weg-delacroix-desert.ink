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

// ---------------------------------------------------------------- Mrs. Holloway

=== holloway ===
// Kapitel 41 (Roman): Mrs. Holloway füllt am Wanderschild ihre Flasche. Der stille Canyon und
// Ambroses erste Sätze stehen am Anfang von mira_stein (Pflichtschritt, Gutachten M1.7).
{hollowayGetroffen:
    {~Mehr Wasser als Weg.|Wer angreift, braucht mehr Figuren am König. Und mehr Wasser.} #sprecher:holloway
    -> END
}
~ hollowayGetroffen = true
Eine Frau mit Strohhut füllt am Wanderschild ihre Flasche an einem Rohr, aus dem ein dünner Strahl kommt. #sprecher:erzaehler
Wer angreift, braucht mehr Figuren am König als der Verteidiger. Sonst ist es kein Angriff, sondern ein Ausflug. #sprecher:holloway
Gilt auch fürs Wandern. Mehr Wasser als Weg. #sprecher:holloway
-> END

= holloway_gefaellt
* [„Gefällt sie dir?“]
- Ich weiß es noch nicht. Ich bin es nicht mehr gewohnt, etwas nicht sofort zu wissen. #sprecher:ambrose
Er sieht zu dem Vogel hinauf. #sprecher:erzaehler
Es ist angenehm. #sprecher:ambrose #stimmung:still
->->

// ---------------------------------------------------------------- Rätseltafel und Rückweg

=== tafel ===
{wegDelacroixDesertTafelBestanden:
    Auf dem Wanderschild hat jemand mit Kreide einen kleinen Kaktus gemalt. Darunter: „Gelöst“. #sprecher:erzaehler
    -> END
}
Am Wanderschild „Desert Springs, 4 Meilen“ hängt eine Rätseltafel, das Blech heiß von der Sonne: „Der König steht im Freien. Greif an!“ #sprecher:erzaehler
* [Die Aufgaben lösen]
    ~ beginneAufgaben("wegDelacroixDesert.tafel")
    -> END
* [Weitergehen]
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
Eine Eidechse rührt sich nicht. Hoch oben kreist ein Vogel, ohne die Flügel zu bewegen. Er ist noch blass, aber er ist da. #sprecher:erzaehler
Ich war nie in einer Wüste. #sprecher:ambrose #musik:ambrose.gitarre
Sie ist so still wie ein Club. Wie ein guter. Einer, in dem man hört, wenn jemand nachdenkt. #sprecher:ambrose
-> holloway.holloway_gefaellt ->
Hinter der nächsten Biegung, mitten im trockenen Bachbett liegt ein Stein, flach wie ein Tisch. Darauf ein Mädchen, zwei Zöpfe, Schrammen an beiden Knien. #sprecher:erzaehler #musik:aus
Sie spielt gegen niemanden. Sie zieht für Weiß, dreht das Brett um, zieht für Schwarz. Ernst wie ein Chirurg. #sprecher:erzaehler
Sie hält die weiße Dame einen Atemzug lang in der Luft. Dann stellt sie sie mitten zwischen die schwarzen Figuren. #sprecher:erzaehler #bild:mira_damenopfer
Oh. #sprecher:ambrose
Sie dreht das Brett um und schlägt die Dame. Dreht es wieder. Ein Springer, ein Läufer, und der schwarze König liegt um. #sprecher:erzaehler #bild:aus
-> mira_ambrose ->
-> mira_spricht

= mira_ambrose
Sie spielt wie ich mit zwanzig. Nur besser. Viel besser. #sprecher:ambrose #stimmung:froh
Sie zögert nicht. Aber sie rechnet. Sie rechnet, und sie zögert nicht, und … #sprecher:ambrose
Er hört auf. Er hat gemerkt, wie er klingt. Wie vor einem Tablet in einer weißen Nacht. #sprecher:erzaehler #pause
Verzeih. #sprecher:ambrose #stimmung:ertappt
* [„Schon gut.“]
- Nein. Es ist nicht gut. Aber es ist anders. Siehst du den Unterschied? #sprecher:ambrose
Ich sehe ihn erst jetzt. Sie hat sich die Knie aufgeschlagen. #sprecher:ambrose #stimmung:still
->->

= mira_spricht
Sie mustert dich, von den Schuhen bis zu den Nadeln. #sprecher:erzaehler #musik:mira
Wer bist du? #sprecher:mira
* [„{held}.“]
- Bist du gut? #sprecher:mira
* [„Ich werde besser.“]
- Sie denkt darüber nach. Es scheint ihr als Antwort zu genügen. #sprecher:erzaehler
Im Canyon antwortet das Echo. Am Brett nicht. Deshalb mag ich das Brett. #sprecher:mira
Ich bin Mira. Komm morgen in die Garage. Am Motel. #sprecher:mira
Wenn du gut bist, spielen wir. Wenn nicht, auch, aber kürzer. #sprecher:mira
Sie springt vom Stein und läuft barfuß über den heißen Sand davon, das Brett unter dem Arm. #sprecher:erzaehler
-> END

// ---------------------------------------------------------------- Die Versöhnung

=== versoehnung ===
{
- versoehnungGesehen:
    Unter dem Felsbogen pfeift der Wind durch die alte Eisenbahnbrücke. #sprecher:erzaehler
    -> END
- not miraSteinGesehen:
    Der Felsbogen wirft einen kurzen Schatten. Es ist noch früh am Tag. Hinten im Canyon klappern Figuren. #sprecher:erzaehler
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
Das Licht kommt flach und färbt alles: den Fels, den Sand, deine Hände. Kupfer. Dann Gold. #sprecher:erzaehler
Wenn nicht hier, dann nirgends. Du stellst den Geigenkasten auf einen Stein und nimmst das Brett heraus. #sprecher:erzaehler
* [„Setz dich.“]
- Er sieht dich an. Dann setzt er sich, dir gegenüber, auf den Fels. Zum zweiten Mal in seinem Tod. Der Wind geht durch den Bogen. #sprecher:erzaehler #pause:4
Ich habe einer Maschine zugesehen. Tausendachthundert Partien in einer Nacht. #sprecher:ambrose #stimmung:still
Ich habe zugesehen, weil sie nie zweifelt. Weil sie die Gewissheit hat, bevor man die Hand hebt. #sprecher:ambrose
Du sagst nichts. #sprecher:erzaehler #pause
Dann hat ein Junge mit einer Trompete dich einen Betrüger genannt. Er hatte recht, und es war meine Schuld. #sprecher:ambrose
Ich habe dir einen Zug gegeben, den ich nicht verstand. Ich habe ihn nur wiedererkannt. Wie ein Papagei. #sprecher:ambrose #stimmung:ertappt
Sechs Tage im Kasten habe ich gehört, wie du nachdenkst. Und ich wusste nicht, was du ziehen wirst. #sprecher:ambrose
Er hebt den Kopf. Ich wusste es nicht, {held}. Zum ersten Mal. Ich habe mir die Nägel abgekaut, die ich nicht habe. #sprecher:ambrose
Das Licht wird röter. #sprecher:erzaehler #pause
Du hast gefragt: Und ich? Ich schulde dir die Antwort. #sprecher:ambrose
Die Maschine zweifelt nie. Das ist wahr, und es ist schön, und ich nehme nichts davon zurück. #sprecher:ambrose
Aber ich habe etwas vergessen. Du zweifelst. Du zählst dreimal. Du hast Angst, dass es nicht stimmt. #sprecher:ambrose #stimmung:riss
Und dann spielst du trotzdem. #sprecher:ambrose #stimmung:riss
Seine Stimme bricht. #sprecher:erzaehler #pause:2
Das ist schöner. #sprecher:ambrose #musik:ambrose.held
Ein Opfer von jemandem, der weiß, dass es stimmt, ist eine Rechnung. #sprecher:ambrose
Ein Opfer von jemandem, der hofft, dass es stimmt, und es geprüft hat, so gut er kann, und dem dabei das Herz schlägt … #sprecher:ambrose #pause
Das ist das, wofür der Verlierer zum Telegrafenamt läuft. #sprecher:ambrose
* [„Du warst ein Idiot.“]
- Ja. #sprecher:ambrose
* [„Ich hab dich vermisst.“]
- Ich dich auch. Und ich war die ganze Zeit drei Schritte neben dir. Das ist das Dümmste daran. #sprecher:ambrose #stimmung:lachtOhneSpott
Die Sonne berührt den Rand der Welt. #sprecher:erzaehler #licht:nacht
* [„Erzähl mir von 1866.“]
- Er nickt, als hätte er darauf gewartet. #sprecher:erzaehler #musik:tiefer_streicher
-> erzaehlung_1866

= erzaehlung_1866
Er hatte Ja gesagt. Zur Revanche. Per Brief, weil er im Norden Brücken baute und ich im Süden saß. #sprecher:ambrose #erinnerung
Ein Zug, ein Brief. Über ein Jahr. Es war die beste Partie meines Lebens. #sprecher:ambrose
Ich habe gespielt wie er, gewissenhaft. Und er ein wenig wie ich. Er hat Dinge riskiert, die er 1858 nie riskiert hätte. #sprecher:ambrose #stimmung:alt
* [„Und dann?“]
- Dann wurde es ein Endspiel. Und Winter. Sein neununddreißigster Zug kam nicht. Vier Wochen. Sechs. Acht. #sprecher:ambrose
Ich dachte, er lässt mich warten, weil er es kann. Ich konnte nicht mehr warten. #sprecher:ambrose
Ich band die Figuren in der Stellung fest und stieg in eine Kutsche. Nach Norden. Ich wollte ihm ins Gesicht sehen. #sprecher:ambrose
Elf Tage. In einer Bergbausiedlung bekam ich Fieber. Das Brett stand auf dem Stuhl neben dem Bett. #sprecher:ambrose
Sein Zug hat mich dort noch erreicht. Ich habe geantwortet. Wie, das erzähle ich dir ein andermal. #sprecher:ambrose
Ich bin nicht angekommen. Darum warte ich noch. #sprecher:ambrose #stimmung:traurig #musik:aus #erinnerung:aus #pause:3
Du denkst an einen leeren Umschlag in einem Postsack. An eine senkrechte Schrift. #sprecher:erzaehler
Sie sind aneinander vorbeigefahren. #sprecher:erzaehler
-> versoehnung_lektion

=== versoehnung_lektion ===
// Lektion: das Thema hell, fast heiter (ambrose.heiter). Ambrose ist ab hier wieder voll sichtbar.
Komm. Er steht auf. Er ist nicht mehr blass. #sprecher:ambrose #musik:ambrose.heiter
Ich habe dir das Zählen beigebracht, weil du es brauchtest. Was ich wirklich kann, habe ich dir nie gezeigt. #sprecher:ambrose
Ich hatte Angst, du würdest es so schlecht machen wie ich. Jetzt kannst du zählen. Jetzt zeige ich es dir. #sprecher:ambrose
Ein Opfer ist kein Geschenk und kein Kunststück. Es ist ein Tausch. Holz gegen Zeit, Raum oder einen König im Freien. #sprecher:ambrose
Erste Frage: Wie viele Angreifer am König, wie viele Verteidiger? Du brauchst mehr. #sprecher:ambrose
Zweite Frage: Hat er einen Zug, der alles hält? Den suchst du. Für ihn. So gründlich, als wärst du er. #sprecher:ambrose
* [„Und wenn ich ihn nicht finde?“]
- Dann hoffst du. Und spielst es. Und siehst ihm ins Gesicht. #sprecher:ambrose #stimmung:lachtOhneSpott
Das ist der Teil, den keine Maschine kann. Sie muss nie hoffen. Arme Maschine. #sprecher:ambrose
Ihr übt, bis das Licht fort ist. #sprecher:erzaehler
Im Geigenkasten liegt eine Karte, die du seit Port Delacroix nicht angefasst hast. #sprecher:erzaehler
Als ihr absteigt, im letzten Grau, siehst du unter dem Felsbogen etwas, das du vorher nicht bemerkt hast. #sprecher:erzaehler
{nietenCanyonGefunden:
    -> fund_nieten.nieten_ambrose
}
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
    Sie lässt ihr Kleid einfach liegen. Donnerwetter. #sprecher:ambrose
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
{nietenCanyonGefunden: -> nieten_ambrose}
~ nietenCanyonGefunden = true
Unter dem Felsbogen überspannt eine Brücke die Schlucht, wo sie am engsten ist. Schwarzes Eisen, lauter Dreiecke. #sprecher:erzaehler
Auf jeder Niete, klein und sauber: J. H. Am Pfeiler, eingegossen in eine Platte: 1879. #sprecher:erzaehler #bild:platte_1879
~ gibFund("nietenCanyonbruecke")
{versoehnungGesehen:
    -> nieten_ambrose
}
Ambrose sagt nichts. Aber du spürst, dass er hinsieht. #sprecher:erzaehler #bild:aus
-> END

= nieten_ambrose
~ nietenAmbroseGesehen = true
* [„Dreizehn Jahre danach.“]
- Er hat gelebt. Lange. Er hat weitergebaut, bis hierher, ans Ende von allem. #sprecher:ambrose #musik:hale.horn #bild:aus
Er legt die Hand auf das Eisen. Gut so. #sprecher:ambrose #stimmung:still
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
    Wren winkt von unten, Sol von weit oben. Das Seil ist straff. #sprecher:erzaehler
    -> END
}
{wegDelacroixDesertSeilschaftBestanden: -> seilschaft_ende}
{seilschaftBegonnen: -> seilschaft_runde}
-> seilschaft_start

=== seilschaft_start ===
~ seilschaftBegonnen = true
Zwei Kletterinnen hängen in der Wand am Felsbogen, eine unten, eine hoch oben. Zwischen ihnen pfeift der Wind. #sprecher:erzaehler
Wir spielen eine Partie, ein Zug pro Seillänge. Aber ich höre Sol nicht mehr! #sprecher:wren
Ich zeige dir oben die Stellung. Merk sie dir und ruf sie Wren zu! #sprecher:ferris
-> seilschaft_runde

=== seilschaft_runde ===
Schau genau hin. Unten sieht Wren das Brett nicht. #sprecher:ferris
~ beginneGedaechtnis("wegDelacroixDesert.seilschaft")
-> END

=== seilschaft_ende ===
{seilschaftFertig: -> END}
~ seilschaftFertig = true
Das Echo trägt deine Züge durch den Canyon. Unten nickt Wren, oben jubelt Sol. #sprecher:erzaehler
Du hast die Stellung im Kopf behalten. Hier, der gehört dir. Er hält mehr, als er wiegt. #sprecher:wren
~ gibFund("karabiner")
{ambroseSprichtWieder:
    Blind spielen heißt: das Brett tragen, ohne es zu sehen. #sprecher:ambrose
}
-> END

// ---------------------------------------------------------------- Funde am Felsbogen

=== seite06 ===
{gefundenSeite06:
    Unter dem Bogen ist nur noch Sand. #sprecher:erzaehler
    -> END
}
~ gefundenSeite06 = true
Unter dem Felsbogen klemmt eine lose Seite zwischen zwei Steinen, voller Schachdiagramme. #sprecher:erzaehler
~ gibFund("seite06")
~ buchseiten = buchseiten + 1
-> END

=== finch_laeufer_b ===
{gefundenFinchLaeuferB:
    Im Felsspalt ist nur noch das Finkenzeichen aus Kreide. #sprecher:erzaehler
    -> END
}
~ gefundenFinchLaeuferB = true
Neben einem kleinen Fink aus Kreide steckt etwas im Felsspalt: ein weißer Läufer aus Buchsbaum. #sprecher:erzaehler
Unter seinem Fuß ist ein Feld eingebrannt. #sprecher:erzaehler
~ gibFund("finchLaeuferB")
~ finchFiguren = finchFiguren + 1
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
    Geröll liegt quer über dem Pfad nach oben. Allein und mit dem Streit im Kopf will {held} hier nicht klettern. #sprecher:erzaehler
- else:
    Der Pfad zur Felsnase führt steil zwischen Geröll hinauf, und es wird schon dunkel. Ohne Licht ist das zu gefährlich. #sprecher:erzaehler
}
-> END
// <<< Runde 6 (mittel-4)

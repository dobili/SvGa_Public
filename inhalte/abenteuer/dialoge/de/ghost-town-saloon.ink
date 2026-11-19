// Ort: Saloon in Ghost Town (Akt 4): Schwingtür, staubiger Tisch mit dem Brett, das versteckte
// Postreiterabzeichen hinter dem Tresen (Story-Bibel 28 und 30).
//
// Szenen der Bibel (Abschnitt 29): der Auslöser des Flashbacks „Die letzte Kerze“ (Szene 99: nach
// dem Abzeichen führt die Treppe im Laden in erinnerung-siedlung.ink, ghost-town-laden.ink) und
// 100 Die Fernpartie (Hauptquest ghostTown.fernpartie, Begegnung ghostTown.fernpartie aus der Duell-Stellung von Abschnitt 35,
// Karten gesperrt). Einstiege wie in orte.json: victor, brett, fund_abzeichen.
//
// Variablen: ausgangGhostTownFernpartie und hatLaterne setzt die Hülle (R42); briefGelesen setzt
// desert-springs-antiquariat.ink, hatHalesSeite die Hülle aus dem Besitz (Gegenstand halesSeite,
// Quest siliconBay.fehlendeSeite), victorSeiteGegeben summit-city-bergstation.ink (Szene 88), grabGesehen ghost-town-aussen.ink, kerzeGesehen erinnerung-siedlung.ink; die übrigen
// setzt diese Datei. Funde merkt sich Ink zusätzlich selbst.

EXTERNAL beginnePartie(begegnung)
EXTERNAL gibFund(kennung)

VAR grabGesehen = false
VAR kerzeGesehen = false
VAR briefGelesen = false
VAR hatHalesSeite = false
VAR victorSeiteGegeben = false
VAR hatLaterne = false
VAR abzeichenGefunden = false
VAR ausgangGhostTownFernpartie = ""
VAR fernpartieGespielt = false
VAR victorSaloonGetroffen = false
VAR ausgangCapitalArenaFinale = ""
// Aus capital-arena-aussen.ink: Nach dem Abschied (Szene 109) spricht Ambrose nicht mehr
// (Story-Bibel Abschnitt 33, Frage 5; Entscheidung Q21-5). Hier nur gelesen.
VAR abschiedGesehen = false
// Die Fernpartie steht auf dem Brett (Victors b5 ist gezogen). Eine VAR, weil die App jeden Dialog
// neu beginnt und Besuchszähler von Knoten dann wieder auf null stehen.
VAR fernpartieAufgebaut = false
VAR held = "Du"

// ---------------------------------------------------------------- Victor und die Fernpartie

=== victor ===
{
// Victor steht erst nach dem Grab im Saloon (orte.json, wenn grabGesehen; sein Bus kommt am Grab).
- not kerzeGesehen: -> victor_wartet
- ausgangGhostTownFernpartie == "" or ausgangGhostTownFernpartie == "abgebrochen": -> victor_aufstellen
- not fernpartieGespielt: -> victor_nach_fernpartie
- else: -> victor_alltag
}

=== victor_wartet ===
~ victorSaloonGetroffen = true
Victor stellt Figuren auf, nimmt sie wieder weg, stellt sie neu auf. #sprecher:erzaehler
Mir fehlt noch etwas. Ambrose muss doch seinen letzten Zug irgendwo aufgeschrieben haben. #sprecher:victor #stimmung:nachdenklich
Hinter dem Tresen. Der Postreiter hat hier unten gewartet. #sprecher:ambrose #stimmung:fern
-> END

=== victor_aufstellen ===
// Kapitel 58 (Roman): Aufbau der Fernpartie unter dem Loch im Dach (Musik fernpartie: zu jedem
// Fragment vier Takte des Fundorts, immer leiser), dann Victors b5 (holz_zug, b5).
// Zweiter Besuch (nach „Gleich.“ oder abgebrochener Partie): die Stellung steht schon.
{fernpartieAufgebaut: -> fernpartie_bereit}
~ victorSaloonGetroffen = true
Am Morgen fegt Mr. Pruitt den Saloon, bis in die Ecken, als käme Besuch. Er rückt einen Tisch unter das Loch im Dach, wo die Sonne in einer schrägen Säule fällt. #sprecher:erzaehler #klang:besen
Ich hab hier dreißig Jahre nach Gold gesucht. Ich glaub, ich hab die ganze Zeit auf was anderes gewartet. #sprecher:pruitt #stimmung:nachdenklich
Du legst das Brett auf den Tisch. Altes Holz, dunkle Ecken. A. W. 1857. Daneben Junos Tagebuch mit acht eingeklebten Zetteln aus sieben Städten. #sprecher:erzaehler #bild:tagebuch_zettel
{briefGelesen:
    Und Hales Brief mit dem gebrochenen Siegel, auf der Rückseite vier Züge in senkrechter Schrift. #sprecher:erzaehler
}
{
- hatHalesSeite:
    Du legst die ausgefranste Seite daneben, die Victor dir an der Bergstation gegeben hat. #sprecher:erzaehler
- victorSeiteGegeben:
    Victor schlägt sein Buch hinten auf. Die Seite liegt da, ausgefranst an einem Rand. #sprecher:erzaehler
- else:
    Victor zieht eine vergilbte Seite aus seinem Buch. Für den Tag, an dem jemand weiterspielt. #sprecher:erzaehler
}
Wer baut auf? #sprecher:victor #stimmung:nachdenklich #bild:aus
+ [„Wir beide.“]
- Von vorn, Zug um Zug, wie man eine Geschichte vorliest. Du ziehst für Weiß, Victor für Schwarz. #sprecher:erzaehler #musik:fernpartie
Der Bauer, der sich im vierten Zug anbietet. Mein Gambit. Er hat es angenommen. Ich war so erleichtert. #sprecher:ambrose #stimmung:froh
Der Springer im sechsundzwanzigsten. Hier habe ich drei Wochen nachgedacht. Über einen Springerzug. Ich. Drei Wochen. #sprecher:ambrose #stimmung:lachtOhneSpott
Dann der fünfunddreißigste. Ein Läufer schlägt den Bauern vor dem König. Gleich darauf ein Springer. #sprecher:erzaehler
Zwei. Er opfert zwei Figuren hintereinander. #sprecher:victor #stimmung:ueberrascht
+ [„Stimmt es?“]
- Er rechnet, mit schiefem Kopf, lange. #sprecher:erzaehler
Ja. Knapp. Aber ja. Der hat nicht einfach gehofft, oder? #sprecher:victor #stimmung:laechelt
Dreimal nachgerechnet. Und dann habe ich gehofft. #sprecher:ambrose #stimmung:laechelt
Die letzten Züge kennst du aus einem Zimmer mit Rosen. Der König schlägt die Dame, einen Schritt ins Freie. #sprecher:erzaehler
Es ist die Stellung, die du an einem Abend im Spätsommer unter einer Decke gefunden hast. Schwarz am Zug. Seit hundertsechzig Jahren. #sprecher:erzaehler #musik:aus #pause:3
{hatHalesSeite:Victor nimmt die Seite vom Tisch. 40. … b5. Er fasst den Bauern an.|Victor legt die Seite neben das Brett. 40. … b5. Er fasst den Bauern an.} #sprecher:erzaehler
Darf ich? #sprecher:victor #stimmung:nachdenklich
Er fragt nicht dich. #sprecher:erzaehler
Sag ihm, es wäre mir eine Ehre. #sprecher:ambrose #stimmung:riss
Victor schiebt den Bauern vor. Ein Feld. Holz auf Holz. #sprecher:erzaehler #klang:holz_zug #musik:b5 #pause:3
So. So. Da ist er. #sprecher:ambrose #stimmung:friedlich
~ fernpartieAufgebaut = true
Diese Partie gehört euch. Keine Karten. Kein Wort von mir. Die nächsten Züge sind deine. #sprecher:ambrose #stimmung:laechelt
+ [„Ich spiele für dich.“]
- Nein. Du spielst für dich, mit meinen Figuren. Das ist ein Unterschied, und er ist mir wichtig. #sprecher:ambrose #stimmung:nachdenklich
Ein Turm gegen zwei Springer. Du stehst besser. Aber zwei Springer sind wie zwei Hunde, die ein Schaf nicht aus den Augen lassen. #sprecher:erzaehler #musik:aus
+ [Den ersten Zug machen]
    ~ beginnePartie("ghostTown.fernpartie")
    -> END
+ [„Gleich.“]
    Hundertsechzig Jahre. Ein paar Minuten mehr schaden nicht. #sprecher:victor #stimmung:laechelt
    -> END

=== fernpartie_bereit ===
Die Stellung steht noch unter dem Loch im Dach. Victors Bauer steht auf b5. #sprecher:erzaehler
Diese Partie gehört euch. Kein Wort von mir. #sprecher:ambrose #stimmung:laechelt
+ [Den ersten Zug machen]
    ~ beginnePartie("ghostTown.fernpartie")
    -> END
+ [„Gleich.“]
    Ich warte. Darin ist meine Familie gut, hab ich gehört. #sprecher:victor #stimmung:laechelt
    -> END

// ---------------------------------------------------------------- Partiemomente (Kapitel 58)
// begegnungen.json ghostTown.fernpartie: Ambrose hält sein Schweigen nicht ganz; später zählt
// {held} dreimal und weiß es nicht. Stellungsneutral.

=== fernpartie_wie_er ===
Seine Springer decken einander, jagen deinen Turm fort, und sobald er fort ist, rückt ein Bauer nach. Eine Brücke aus zwei Pferden. #sprecher:erzaehler
Er spielt wie er. Genau wie er. Nichts Überflüssiges. #sprecher:ambrose #stimmung:still
-> END

=== fernpartie_zaehlen ===
Es gibt vielleicht einen Weg. Er ist schmal. Du zählst. Dreimal. #sprecher:erzaehler
Du weißt es nicht. #sprecher:erzaehler #pause:2
-> END

=== victor_nach_fernpartie ===
// Kapitel 58, Schluss: jeder Ausgang führt weiter, Ambroses Schlusssatz bleibt derselbe
// (ambrose.schluss, zum ersten Mal mit Schlusston). Porträt „weint und lächelt“ nur hier.
~ fernpartieGespielt = true
// Gutachten M3.7: stellungsneutral; eine Niederlage erzählt das Spiel hier als Remis.
{ausgangGhostTownFernpartie == "sieg":
    Victor sieht lange auf das Brett. Dann gibt er dir die Hand. #sprecher:erzaehler
- else:
    Mehr ist nicht mehr zu wollen. Remis? #sprecher:victor #stimmung:laechelt
    -> verzaehlt ->
}
Ambrose steht neben dem Tisch und sieht auf das ganze Brett. Er weint. Es läuft ihm über das Gesicht, und er lächelt dabei. #sprecher:erzaehler #stimmung:weintUndLaechelt #musik:aus #pause:3
Hundertsechzig Jahre. Und sie ist schön. #sprecher:ambrose #stimmung:weintUndLaechelt
Sie ist zu Ende. Jemand hat sie zu Ende gespielt. #sprecher:ambrose #stimmung:nachdenklich
Ein Kind, das zählt und hofft, und ein Hale. #sprecher:ambrose #stimmung:laechelt
Ich wollte eine Partie ohne Makel. Mein ganzes Leben, und danach noch einmal so lang. #sprecher:ambrose #stimmung:nachdenklich
Vierzig Züge von mir. Einer von ihm, den er einem Toten geschrieben hat. Und eure, mit allem, was ihr gewagt habt. #sprecher:ambrose #stimmung:laechelt
Er wischt sich über die Augen. #sprecher:erzaehler #pause:2
Nicht makellos. Schön. #sprecher:ambrose #stimmung:friedlich #musik:ambrose.schluss
{ausgangGhostTownFernpartie == "sieg": Gewonnen. Ich habe es nie gebraucht, und es freut mich trotzdem wie einen Jungen am Kai. #sprecher:ambrose #stimmung:froh}
Die beste Partie, die ich je gespielt habe. Ich hab eine Stunde lang an nichts gedacht. Nur daran. #sprecher:victor #stimmung:laechelt
{hatHalesSeite:Er schreibt mit Junos Bleistift etwas unter die Seite. Du siehst nicht, was. Dann gibt er sie dir zurück.|Er schreibt mit Junos Bleistift etwas unter die Seite. Du siehst nicht, was. Er legt sie zurück in sein Buch.} #sprecher:erzaehler
Für den Tag, an dem wieder jemand weiterspielt. #sprecher:victor #stimmung:nachdenklich
In der Tür nimmt Mr. Pruitt den Hut ab. #sprecher:erzaehler
Bleibt über Nacht. Wenn es dunkel ist, stehen über Ghost Town mehr Sterne als Häuser. #sprecher:pruitt #stimmung:laechelt
~ gibFund("schlussstellungFernpartie")
-> END

= verzaehlt
* [„Es tut mir leid.“]
* [„Sie ist remis.“]
- {held}. #sprecher:ambrose #stimmung:nachdenklich
->->

=== victor_alltag ===
{~Mein Vater hat angerufen. Ich bin nicht rangegangen. Morgen vielleicht.|Ein Hale und ein Whitlock an einem Brett. Mein Großvater hätte das gern gesehen.|{ausgangCapitalArenaFinale != "" and ausgangCapitalArenaFinale != "abgebrochen":Das Finale war die zweitschönste Partie. Die schönste stand hier.|Wenn wir beide durchkommen, sehen wir uns im Finale. Ich freu mich drauf.}} #sprecher:victor #stimmung:laechelt
-> END

// ---------------------------------------------------------------- Brett und Abzeichen

=== brett ===
{fernpartieGespielt:
    Auf dem Brett steht noch die Schlussstellung der Fernpartie. Niemand räumt sie weg. #sprecher:erzaehler
- else:
    Ein altes Brett auf einem staubigen Tisch. Eine Figur fehlt, ein Springer. #sprecher:erzaehler
}
-> END

=== fund_abzeichen ===
// Kapitel 57 (Roman): In der Nacht im Saloon; im Zimmer über dem Laden hängt noch ein Fetzen
// Rosentapete. Danach führt die Treppe im Laden in die Erinnerung (ghost-town-laden.treppe,
// erinnerung-siedlung.kerze); das Abzeichen selbst ist nur ein Fund fürs Album.
{
- abzeichenGefunden:
    Hinter dem Tresen liegt nur noch Staub. Das Abzeichen trägst du bei dir. #sprecher:erzaehler
    -> END
- not grabGesehen:
    Hinter dem Tresen ist es dunkel und staubig. Hier liegt nur Gerümpel. #sprecher:erzaehler
    -> END
}
~ abzeichenGefunden = true
In der Nacht schlaft ihr im Saloon auf dem Boden. Mr. Pruitt hat eine Laterne auf die Theke gestellt. Du kannst nicht schlafen. #sprecher:erzaehler #licht:nacht #geraeusch:saloon
{hatLaterne:
    Du leuchtest mit deiner Laterne hinter den Tresen. Zwischen Flaschen liegt ein Abzeichen aus Messing: ein Pferd und die Zahl 1866. #sprecher:erzaehler
- else:
    Hinter dem Tresen, zwischen Flaschen, liegt ein Abzeichen aus Messing: ein Pferd und die Zahl 1866. #sprecher:erzaehler
}
~ gibFund("postreiterabzeichen")
Er hat meinen Brief getragen. #sprecher:ambrose #stimmung:fern #pause
Durch die Schwingtür siehst du gegenüber den Laden. Hinten darin führt eine Treppe hinauf zu dem Zimmer. #sprecher:erzaehler
Dreihundertzwölf Rosen. Auf einer Wand. Ich bin nie über die andere hinausgekommen. #sprecher:ambrose #stimmung:still #bild:aus
Der Mond scheint durch ihn hindurch. #sprecher:erzaehler
Am Felsbogen habe ich gesagt: ein andermal. Es ist ein andermal. #sprecher:ambrose #stimmung:friedlich
-> END

// ---------------------------------------------------------------- Ansehen (Runde 6)

=== klavier ===
Du drückst eine Taste. Nichts. Die nächste klingt schief und viel zu laut im leeren Saloon. #sprecher:erzaehler
{not abschiedGesehen:
    Ein Klavier verstimmt sich in der Hitze. Und in der Stille. #sprecher:ambrose #stimmung:nachdenklich
}
-> END

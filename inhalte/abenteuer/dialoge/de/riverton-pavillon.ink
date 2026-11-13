// Ort: Pavillon im Park von Riverton, Slicks Parkclub (Akt 2). Figuren: Slick, Tamsin, Ray.
//
// Szenen der Story-Bibel (Abschnitt 11): 29 Die Bildschirmtische, Teil im Pavillon
// (akt2.bildschirmtische), 32 Aufgabenreihe (Runden riverton.reiheTamsin, riverton.reiheRay),
// 34 Zuschauen im Pavillon (Quest riverton.zuschauen, Runde riverton.slickBeobachten), 36
// Clubkampf (Begegnung riverton.clubkampf), 37 Sonntagabend, erster Teil (Pavillon geräumt).
// Einstiege wie in orte.json: slick, tamsin, ray; Gegenstände gedenktafel, limonadenglas.
// Die Quest riverton.parkclub wartet auf den Knoten „slick“; deshalb steht dort vor dem
// Verzweigen eine Zeile (gemeldet wird der Knoten, in dem die erste Zeile steht).
//
// Runde 11 (13.11.2026): an den Roman zu Akt 2 angeglichen (Kapitel 18, 19, 22), Klang nach
// 21_Klangplan.md (Akt 2).
//
// Variablen: reiheTamsinBestanden, reiheRayBestanden, slickBeobachtenBestanden,
// ausgangRivertonClubkampf und nadelRiverton setzt die Hülle (R42). clubkampfRivertonBesprochen
// (Wahrheitswert) öffnet den Wohnwagen (orte.json, wenn); clubkampfRivertonNadel (Zahl) merkt
// sich die zuletzt gewürdigte Nadel, damit eine bessere Nadel noch einmal gewürdigt wird.

EXTERNAL beginnePartie(begegnung)
EXTERNAL beginneAufgaben(runde)

VAR held = "Du"
VAR slickGetroffen = false
VAR tamsinGetroffen = false
VAR rayGetroffen = false
VAR zuschauenAngeboten = false
VAR slickAbschiedGesehen = false
VAR reiheTamsinBestanden = false
VAR reiheRayBestanden = false
VAR slickBeobachtenBestanden = false
VAR ausgangRivertonClubkampf = ""
VAR nadelRiverton = 0
VAR clubkampfRivertonBesprochen = false
VAR clubkampfRivertonNadel = 0
VAR odumGedenktafelGesehen = false
VAR limonadenglasGesehen = false

// ---------------------------------------------------------------- Slick

=== slick ===
{~Regen trommelt aufs Pavillondach, irgendwo klopft eine Schachuhr.|Slick schiebt eine Figur, ohne hinzusehen, und gewinnt trotzdem.|Unter dem Dach riecht es nach nassem Holz und Limonade.} #sprecher:erzaehler
{
- not slickGetroffen: -> slick_erstes_treffen
- nadelRiverton > clubkampfRivertonNadel: -> slick_nach_sieg
- clubkampfRivertonBesprochen: -> slick_alltag
- not (reiheTamsinBestanden and reiheRayBestanden): -> slick_reihe_offen
- nadelRiverton == 0 and ausgangRivertonClubkampf == "niederlage": -> slick_nach_niederlage
- else: -> slick_clubkampf
}

=== slick_erstes_treffen ===
// Kapitel 18: Slick redet schnell und verstummt bei Mr. Odum (Stille S29: die Trompete setzt aus).
~ slickGetroffen = true
Steintische mit eingelassenen Brettern, glatt gespielt von sehr vielen Händen. An jedem schlagen zwei Leute auf die Uhren. #sprecher:erzaehler
Mittendrin einer mit Kuriertasche, ein Bein über der Bank. Er spielt, ohne hinzusehen, und redet dabei. #sprecher:erzaehler
Zwei Angriffe, ein Zug. Das nennt man Gabel, und ich esse damit. Schade um deinen Turm. #sprecher:slick #stimmung:froh
Er schlägt auf die Uhr. Dann sieht er euch. Kundschaft! #sprecher:slick
Slick. Eigentlich Marcus, aber so nennt mich keiner. Nicht mal meine Mutter. #sprecher:slick
* [„Wir sind aus Maple Falls.“]
* [Auf die Nadeln zeigen]
- Maple Falls! Zwei Nadeln, schau an. Die von der Delgado und die von der alten Okafor. #sprecher:slick
Die Okafor hat mich mal vierzig Züge lang warten lassen. Vierzig. Ich bin dabei gealtert. #sprecher:slick
Das hier ist der Parkclub. Seit 1953. Mr. Odum hat ihn gehabt, vierzig Jahre. Im Frühjahr hat er ihn mir gegeben, und dann ist er … #sprecher:slick #musik:aus #pause:2
Na ja. Dann eben ich. #sprecher:slick
* [„Was passiert mit dem Pavillon?“]
* [Hinaus auf die Wiese sehen]
- Der Stadtrat hat die Wiese verpachtet. Den Pavillon auch. Trainingszentrum soll das werden. #sprecher:slick #musik:karte
Sie haben uns den Pavillon gelassen. Er drückt die Dose zusammen. Bis Sonntag. #sprecher:slick
Sonntag ist das letzte Spiel. Wer spielt es? #sprecher:tamsin
Na, wer wohl. Wenn schon Schluss, dann mit Gästen. Vorher fragen dich Tamsin und Ray ab. #sprecher:slick
Ambrose steht nicht neben dir. Er steht am Rand des Pavillons, wo das Dach aufhört, und sieht hinaus auf die Tische. #sprecher:erzaehler
-> END

=== slick_reihe_offen ===
{not reiheTamsinBestanden:
    Erst Tamsin, dann Ray. Tamsin zählt die Sekunden, Ray die Haltestellen. #sprecher:slick
- else:
    Tamsin hast du geschafft. Jetzt Ray. Er ist langsam, aber er erwischt jeden. #sprecher:slick
}
-> END

=== slick_clubkampf ===
Sonntag. Das letzte Spiel im Pavillon. #sprecher:slick
Willst du Blitz? Blitz ist ehrlich. #sprecher:slick
Er lebt von der Eile. Nimm ihm die Eile, {held}. Wähle eine lange Bedenkzeit. #sprecher:ambrose
* [„Ich bin bereit.“]
    Das hier ist der letzte Tisch mit echten Figuren. Wenn du verlierst, verlierst du gegen Riverton. #sprecher:slick
    ~ beginnePartie("riverton.clubkampf")
    -> END
* [„Noch nicht.“]
    Bis Sonntag ist noch Zeit. Nicht viel. #sprecher:slick
    -> END

=== slick_nach_niederlage ===
Gut gekämpft. Aber Riverton bleibt bei mir. #sprecher:slick
Noch einmal, solange es den Pavillon gibt? #sprecher:slick
Er hat gewonnen, weil du ihm seine Eile gelassen hast. Diesmal nicht. #sprecher:ambrose
* [„Noch einmal.“]
    ~ beginnePartie("riverton.clubkampf")
    -> END
* [„Später.“]
    -> END

=== slick_nach_sieg ===
~ clubkampfRivertonNadel = nadelRiverton
{clubkampfRivertonBesprochen:
    Eine bessere Nadel, auf der Treppe erspielt. Die Treppe zählt genauso. #sprecher:slick #stimmung:froh
    -> END
}
~ clubkampfRivertonBesprochen = true
{ausgangRivertonClubkampf == "remis":
    Remis. Das ist fair. Die Bronzenadel gehört dir, und meine Limo auch. #sprecher:slick
- else:
    Gut. Du hast nachgedacht, wo ich gezogen hab. #sprecher:slick #stimmung:froh
}
Das war das letzte Spiel in diesem Pavillon. Gut, dass es ein richtiges war. #sprecher:slick #stimmung:ernst
Tamsin klatscht, Ray nickt langsam. Draußen auf der Wiese leuchten die Bildschirme. #sprecher:erzaehler
Komm morgen zum Wohnwagen am Fluss. Ich hab was für dich. #sprecher:slick
Die dritte Nadel. Und einen Mentor-Zug dazu. Gib gut auf ihn acht. #sprecher:ambrose
-> END

=== slick_alltag ===
{slickAbschiedGesehen:
    Im Pavillon stehen jetzt Bildschirmtische. Slick spielt draußen auf der Treppe Blitz gegen Tamsin. #sprecher:erzaehler
    Dann spielen wir eben auf der Treppe. Die Treppe gehört der Stadt. #sprecher:slick
- else:
    Slick packt das letzte Marmorbrett in seine Kuriertasche. #sprecher:erzaehler
    Wohnwagen am Fluss, gleich hinter der Brücke. Ich warte. #sprecher:slick
}
+ {nadelRiverton < 3} [„Revanche um eine bessere Nadel?“]
    Auf der Treppe? Immer. #sprecher:slick
    ~ beginnePartie("riverton.clubkampf")
    -> END
+ [„Bis später, Slick.“]
    -> END

// ---------------------------------------------------------------- Tamsin

=== tamsin ===
{
- not tamsinGetroffen: -> tamsin_erstes_treffen
- not reiheTamsinBestanden: -> tamsin_reihe
- not zuschauenAngeboten: -> tamsin_zuschauen
- not slickBeobachtenBestanden: -> tamsin_zuschauen_wieder
- else: -> tamsin_alltag
}

=== tamsin_erstes_treffen ===
~ tamsinGetroffen = true
Ein Mädchen mit Schachuhr unter dem Arm zählt laut mit, während Slick zieht. #sprecher:erzaehler
Drei, zwei, eins, Gabel! Siehst du? #sprecher:tamsin #stimmung:froh
Nicht nachdenken, gucken. Ich bin Tamsin. #sprecher:tamsin
-> tamsin_reihe

=== tamsin_reihe ===
Meine Aufgaben sind Springergabeln. Ein Springer, zwei Opfer. Bereit? #sprecher:tamsin
* [„Bereit.“]
    ~ beginneAufgaben("riverton.reiheTamsin")
    -> END
* [„Gleich.“]
    Ich zähle so lange bis tausend. Schnell. #sprecher:tamsin
    -> END

=== tamsin_zuschauen ===
~ zuschauenAngeboten = true
Willst du was sehen? Slick und Ray spielen gleich Blitz. #sprecher:tamsin
Zähl mit, was Slick übersieht. #sprecher:tamsin
Er guckt nur nach vorn. Nie nach hinten. #sprecher:tamsin
Das sag ich ihm nicht, das sag ich nur dir. #sprecher:tamsin
* [„Ich schau zu.“]
    ~ beginneAufgaben("riverton.slickBeobachten")
    -> END
* [„Später.“]
    Okay. Aber verpass es nicht, die beiden spielen nicht mehr lange hier. #sprecher:tamsin
    -> END

=== tamsin_zuschauen_wieder ===
Zuschauen? Slick und Ray spielen schon wieder. Zähl mit! #sprecher:tamsin
* [„Ja.“]
    ~ beginneAufgaben("riverton.slickBeobachten")
    -> END
* [„Später.“]
    -> END

=== tamsin_alltag ===
{~Fünf Minuten reichen für jede Partie. Fast jede.|Hast du gesehen? Er hat die Drohung wieder übersehen. Jedes Mal!|Die Bildschirmtische zählen nicht laut mit. Langweilig.} #sprecher:tamsin
-> END

// ---------------------------------------------------------------- Ray

=== ray ===
{
- not rayGetroffen: -> ray_erstes_treffen
- not reiheTamsinBestanden: -> ray_erst_tamsin
- not reiheRayBestanden: -> ray_reihe
- else: -> ray_alltag
}

=== ray_erstes_treffen ===
~ rayGetroffen = true
Ein älterer Herr mit Busfahrermütze stellt geduldig die Figuren auf. #sprecher:erzaehler
Ray. Vierzig Jahre Bus gefahren, vierzig Jahre hier gespielt. #sprecher:ray
Beides mit Fahrplan. #sprecher:ray
{reiheTamsinBestanden: -> ray_reihe}
-> ray_erst_tamsin

=== ray_erst_tamsin ===
Erst Tamsin, dann ich. Ein Bus hält auch nicht zweimal an derselben Haltestelle. #sprecher:ray
-> END

=== ray_reihe ===
Zwei Haltestellen, ein Bus. Der Gegner kann nur an einer aussteigen. #sprecher:ray
Das ist ein Doppelangriff. #sprecher:ray
Eine Gabel ist ein Zug, der zwei Briefe auf einmal zustellt. #sprecher:ambrose
* [„Zeigen Sie es mir.“]
    ~ beginneAufgaben("riverton.reiheRay")
    -> END
* [„Gleich.“]
    Ich warte. Ich bin das Warten gewohnt. #sprecher:ray
    -> END

=== ray_alltag ===
{~Der Pavillon war unsere Endhaltestelle. Mal sehen, wo die nächste ist.|Slick zieht zu schnell. Das sag ich ihm seit zehn Jahren.|Wenn du nach Ironwood fährst: Der Bus hält an der Schnellstraße. Aber der Kanalweg ist schöner.} #sprecher:ray
-> END

// ---------------------------------------------------------------- Gegenstände

=== gedenktafel ===
{odumGedenktafelGesehen:
    Jemand hat frische Blumen unter die Tafel gelegt. Daneben steht ein Bauer aus Holz. #sprecher:erzaehler
    -> END
}
~ odumGedenktafelGesehen = true
Eine kleine Messingtafel an einem Pfeiler: „Für Elias Odum, der hier Generationen von Kindern das Schachspiel zeigte.“ #sprecher:erzaehler
Ein Lehrer, der eine Tafel bekommt. Das ist mehr, als die meisten Meister bekommen. #sprecher:ambrose
-> END

=== limonadenglas ===
{limonadenglasGesehen:
    Das Glas ist voll, die Limo warm. Wer verliert, trinkt sie trotzdem. #sprecher:erzaehler
    -> END
}
~ limonadenglasGesehen = true
Auf dem Geländer stehen Limonadengläser in einer Reihe, jedes mit einem Zettel: „Slick gegen Ray“, „Tamsin gegen Slick“, „Slick gegen alle“. #sprecher:erzaehler
-> END

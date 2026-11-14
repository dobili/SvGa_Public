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
VAR rivertonMontagGesehen = false
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
VAR tamsinZettelGegeben = false
VAR tamsinEliErzaehlt = false
VAR moldeGefuehlt = false

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
Er schlägt auf die Uhr. Dann sieht er euch. #sprecher:erzaehler
Kundschaft! #sprecher:slick #stimmung:lacht
Slick. Eigentlich Marcus, aber so nennt mich keiner. Nicht mal meine Mutter. #sprecher:slick #stimmung:laechelt
* [„Wir sind aus Maple Falls.“]
* [Auf die Nadeln zeigen]
- Maple Falls! Zwei Nadeln, schau an. Die von der Delgado und die von der alten Okafor. #sprecher:slick #stimmung:laechelt
Die Okafor hat mich mal vierzig Züge lang warten lassen. Vierzig. Ich bin dabei gealtert. #sprecher:slick #stimmung:lacht
Das hier ist der Parkclub. Seit 1953. Mr. Odum hat ihn gehabt, vierzig Jahre. Im Frühjahr hat er ihn mir gegeben, und dann ist er … #sprecher:slick #stimmung:nachdenklich #musik:aus #pause:2
Na ja. Dann eben ich. #sprecher:slick #stimmung:bitter
* [„Was passiert mit dem Pavillon?“]
* [Hinaus auf die Wiese sehen]
- Der Stadtrat hat die Wiese verpachtet. Den Pavillon auch. Trainingszentrum soll das werden. #sprecher:slick #stimmung:bitter #musik:karte
Sie haben uns den Pavillon gelassen. Bis Sonntag. #sprecher:slick #stimmung:bitter
Sonntag ist das letzte Spiel. Wer spielt es? #sprecher:tamsin #stimmung:nachdenklich
Na, wer wohl. Wenn schon Schluss, dann mit Gästen. Vorher fragen dich Tamsin und Ray ab. #sprecher:slick #stimmung:laechelt
Ambrose steht nicht neben dir. Er steht am Rand des Pavillons, wo das Dach aufhört, und sieht hinaus auf die Tische. #sprecher:erzaehler
-> END

=== slick_reihe_offen ===
{not reiheTamsinBestanden:
    Erst Tamsin, dann Ray. Tamsin zählt die Sekunden, Ray die Haltestellen. #sprecher:slick #stimmung:laechelt
- else:
    Tamsin hast du geschafft. Jetzt Ray. Er ist langsam, aber er erwischt jeden. #sprecher:slick #stimmung:laechelt
}
-> END

=== slick_clubkampf ===
// Kapitel 22: Sonntag, Regen auf Blech, alle sind gekommen. Slick redet nicht. Die Zeit wählt
// {held} im Spiel; die Wahl hier ist die Antwort im Gespräch (lang ist die ehrliche Fassung).
// Momente in der Partie stehen in begegnungen.json (riverton.clubkampf). Musik riverton.clubkampf.
// Gutachten K2.9: erst die Frage, dann der Sonntag.
Sonntag ist das letzte Spiel. Bist du so weit? #sprecher:slick #stimmung:nachdenklich
* [„Ich bin so weit.“]
* [„Noch nicht.“]
    Bis Sonntag ist noch Zeit. Nicht viel. #sprecher:slick #stimmung:nachdenklich
    -> END
- Am Sonntag regnet es richtig. Es trommelt so laut aufs Blechdach, dass man schreien muss. #sprecher:erzaehler #musik:riverton.clubkampf
Trotzdem sind alle gekommen, unter Schirmen in drei Reihen. Pops, Mr. Harlan, Mrs. Albescu, Mr. Quinn zwischen zwei Zügen. #sprecher:erzaehler
Slick hat den Tisch mit der Mulde freigeräumt. Er hat die Kuriertasche abgelegt, zum ersten Mal. Er redet nicht. #sprecher:erzaehler
Blitz? Drei Minuten. Wie es sich gehört. #sprecher:slick #stimmung:laechelt
Er lebt von der Eile. Nimm ihm die Eile. #sprecher:ambrose #stimmung:nachdenklich
* [„Fünfundvierzig Minuten.“]
    Ein Murmeln geht durch die Schirme. Tamsin verdreht die Augen. #sprecher:erzaehler
    Slick grinst, schief, mit einem Mundwinkel. #sprecher:erzaehler
    Die Okafor hat dich verdorben. #sprecher:slick #stimmung:lacht
    Gut. Dann eben lang. Soll ja was davon bleiben. #sprecher:slick #stimmung:laechelt
* [„Blitz. Drei Minuten.“]
    Mutig. Oder dumm. Wir finden es raus. #sprecher:slick #stimmung:froh
- Er beugt sich vor, und einen Moment ist er wieder der Alte. #sprecher:erzaehler
Das hier ist der letzte Tisch mit echten Figuren. Wenn du verlierst, verlierst du gegen Riverton. #sprecher:slick #stimmung:nachdenklich
~ beginnePartie("riverton.clubkampf")
-> END

// Gutachten K2.10: Mr. Odums Satz als geführter Moment, mit der stehenden Hand (Partiemoment
// schachGegeben in begegnungen.json).
=== clubkampf_odum ===
Slicks Hand bleibt in der Luft stehen, über dem Brett. #sprecher:erzaehler #pause:2
Mr. Odum hat das immer gesagt. Marcus, du rennst nach vorn, und hinter dir brennt das Haus. #sprecher:slick #stimmung:nachdenklich
Jedes Mal. Vierzehn Jahre lang. #sprecher:slick #stimmung:nachdenklich
-> END

=== slick_nach_niederlage ===
Die Leute unter den Schirmen klatschen. Es war ihr Mann. #sprecher:erzaehler
Gut gekämpft. Aber Riverton bleibt bei mir. Noch einmal, solange es den Pavillon gibt? #sprecher:slick #stimmung:laechelt
* [„Noch einmal.“]
    ~ beginnePartie("riverton.clubkampf")
    -> END
* [„Nicht jetzt.“]
    -> END

=== slick_nach_sieg ===
// Kapitel 22: Slick nimmt den König in die Hand; Applaus wie Regen, dann die Fanfare; die Nadel
// als grünes Achteck mit Uhr; „Lang spielen. Ich.“
~ clubkampfRivertonNadel = nadelRiverton
{clubkampfRivertonBesprochen:
    Eine bessere Nadel, auf der Treppe erspielt. Die Treppe zählt genauso. #sprecher:slick #stimmung:froh
    -> END
}
~ clubkampfRivertonBesprochen = true
{ausgangRivertonClubkampf == "remis":
    Remis. Das ist fair. Wir wussten es beide. #sprecher:slick #stimmung:laechelt
- else:
    Slick legt seinen König nicht um. Er nimmt ihn in die Hand und sieht ihn an. #sprecher:erzaehler #musik:aus #pause:2
}
Das war das letzte Spiel in diesem Pavillon. Gut, dass es ein richtiges war. #sprecher:slick #stimmung:ernst
Applaus für Maple Falls! Na los! Es war umsonst, also klatscht! #sprecher:slick #stimmung:lacht #klang:applaus_regen
Sie klatschen. Es klingt wie noch mehr Regen. #sprecher:erzaehler #klang:fanfare.riverton
Er steckt dir die Nadel an, ein kleines Achteck aus grünem Blech mit einer Uhr darauf, und hält dich einen Moment an der Schulter. #sprecher:erzaehler
Lang spielen. Ich. Wer hätte das gedacht. #sprecher:slick #stimmung:laechelt
-> END

=== slick_alltag ===
// Kapitel 22: Montag im Pavillon (Stille S33: nur der Konzernton, wo vorher die Uhren klopften).
{slickAbschiedGesehen:
    Slick spielt draußen auf der Treppe Blitz gegen Tamsin. #sprecher:erzaehler
    Dann spielen wir eben auf der Treppe. Die Treppe gehört der Stadt. #sprecher:slick #stimmung:laechelt
    -> slick_alltag_wahl
}
// Gutachten K2.8: der Montag als eigener Zustand; erst danach öffnet der Wohnwagen.
~ rivertonMontagGesehen = true
Am Montag, nach der Schule, fahrt ihr noch einmal hin. Juno hat gesagt, man müsse es sehen. #sprecher:erzaehler #musik:aus
Im Pavillon stehen Bildschirmtische. Vier Stück, im Kreis, weiß. Die Steintische sind weg. #sprecher:erzaehler #musik:konzern.flaeche
Auf dem Boden sieht man noch, wo sie standen: vier helle Flecken im Holz. #sprecher:erzaehler #pause:2
Slick kniet in der Mitte und packt die Steinplatte mit der Mulde in seine Kuriertasche. Ohne das Reden sieht er jünger aus. #sprecher:erzaehler
Die haben sie mir gelassen. Einer von den Arbeitern hat weggeguckt. #sprecher:slick #stimmung:laechelt
* [Warten]
- Er zieht den Riemen fest. #sprecher:erzaehler
Dann spielen wir eben auf der Treppe. Ich wohn im Wohnwagen am Fluss, an der alten Steinbrücke. #sprecher:slick #stimmung:laechelt
-> slick_alltag_wahl

=== slick_alltag_wahl ===
+ {nadelRiverton < 3} [„Revanche um eine bessere Nadel?“]
    Auf der Treppe? Immer. #sprecher:slick #stimmung:laechelt
    ~ beginnePartie("riverton.clubkampf")
    -> END
+ [„Bis bald, Slick.“]
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
Ein Mädchen mit Schachuhr unter dem Arm zählt laut rückwärts, während Slick zieht. #sprecher:erzaehler
Fünf, vier, drei, zwei – Gabel! Siehst du? #sprecher:tamsin #stimmung:froh
Nicht nachdenken. Gucken. Ich bin Tamsin. #sprecher:tamsin #stimmung:laechelt
-> tamsin_reihe

=== tamsin_reihe ===
Meine Aufgaben sind Springer, die auf zwei Figuren gleichzeitig zeigen. Du findest sie, bevor ich bei null bin. #sprecher:tamsin #stimmung:laechelt
* [„Bereit.“]
    ~ beginneAufgaben("riverton.reiheTamsin")
    -> END
* [„Gleich.“]
    Ich zähle so lange bis tausend. Rückwärts. #sprecher:tamsin #stimmung:lacht
    -> END

=== tamsin_zuschauen ===
// Kapitel 19: Zuschauen bei Slick gegen Ray; Tamsins Zettel mit Slicks Eröffnungen.
~ zuschauenAngeboten = true
Willst du was sehen? Slick und Ray spielen gleich Blitz. #sprecher:tamsin #stimmung:laechelt
Achte nicht auf die Züge. Achte darauf, was Slick nicht sieht. #sprecher:tamsin #stimmung:nachdenklich
* [„Ich schau zu.“]
    ~ beginneAufgaben("riverton.slickBeobachten")
    -> END
* [„Nicht jetzt.“]
    Okay. Aber verpass es nicht. Die beiden spielen nicht mehr lange hier. #sprecher:tamsin #stimmung:nachdenklich
    -> END

=== tamsin_zuschauen_wieder ===
Zuschauen? Slick und Ray spielen schon wieder. #sprecher:tamsin #stimmung:laechelt
* [„Ja.“]
    ~ beginneAufgaben("riverton.slickBeobachten")
    -> END
* [„Nicht jetzt.“]
    -> END

=== tamsin_alltag ===
{not tamsinZettelGegeben: -> tamsin_zettel}
{nadelRiverton == 0 and not tamsinEliErzaehlt: -> tamsin_eli}
{~Fünf Minuten reichen für jede Partie. Fast jede.|Er guckt nur nach vorn. Jedes Mal!|Die Bildschirmtische zählen nicht laut mit. Langweilig.} #sprecher:tamsin #stimmung:laechelt
-> END

=== tamsin_zettel ===
~ tamsinZettelGegeben = true
// Gutachten K2.15: Die Entdeckung gehört dem Helden; Tamsin sagt nur die zwei Sätze.
Er guckt nur nach vorn. #sprecher:tamsin #stimmung:nachdenklich #pause
Nie nach hinten. #sprecher:tamsin #stimmung:nachdenklich
Sie schreibt etwas auf einen Zettel und schiebt ihn dir zu: „Schottisch. Immer. Und Evans, wenn er gut drauf ist.“ #sprecher:erzaehler
Hast du nicht von mir. #sprecher:tamsin #stimmung:laechelt
-> END

=== tamsin_eli ===
// Kapitel 19, Schluss: Eli am Bildschirmtisch in der Dämmerung.
~ tamsinEliErzaehlt = true
Draußen wird es dunkel. Die sechs Tische leuchten weiter, weiß und geduldig. An einem sitzt ein Junge, allein. #sprecher:erzaehler #musik:konzern.flaeche
Das ist Eli. Der war früher hier. Der redet nicht gern. #sprecher:tamsin #stimmung:nachdenklich
Sie zuckt die Schultern, aber sie sieht nicht weg. #sprecher:erzaehler
Der Tisch redet auch nicht. Vielleicht deshalb. #sprecher:tamsin #stimmung:nachdenklich
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
Ray. Dreißig Jahre Bus gefahren, sechzig Jahre hier gespielt. Beides mit Fahrplan. #sprecher:ray #stimmung:laechelt
{reiheTamsinBestanden: -> ray_reihe}
-> ray_erst_tamsin

=== ray_erst_tamsin ===
Erst Tamsin, dann ich. Ein Bus hält auch nicht zweimal an derselben Haltestelle. #sprecher:ray #stimmung:laechelt
-> END

=== ray_reihe ===
// Kapitel 19: die Mulde im Stein (Neu gegenüber der Story-Bibel); kehrt in Kapitel 22 wieder.
Zwei Haltestellen, ein Bus. Der Gegner kann nur an einer aussteigen. Also fährst du zu der anderen. #sprecher:ray #stimmung:laechelt
{not moldeGefuehlt: -> ray_mulde}
-> ray_reihe_wahl

=== ray_mulde ===
~ moldeGefuehlt = true
Er legt seine große Hand auf den Stein. #sprecher:erzaehler
Hier hab ich neunundsechzig gegen Odum verloren. Und zweiundsiebzig. #sprecher:ray #stimmung:laechelt
Und jedes Jahr danach. Der Stein ist hier dünner als da drüben. Fühl mal. #sprecher:ray #stimmung:laechelt
* [Die Hand auf den Stein legen]
* [Nicken]
    Du nickst. Dann legst du die Hand doch hin. #sprecher:erzaehler
- Es stimmt. Eine flache Mulde, wo sechzig Jahre lang Hände gelegen haben. #sprecher:erzaehler #pause:2
Eine Gabel ist ein Zug, der zwei Briefe auf einmal zustellt. #sprecher:ambrose #stimmung:laechelt
Er sagt es freundlich. Aber zwischen zwei Sätzen geht sein Blick hinaus auf die Wiese. #sprecher:erzaehler
-> ray_reihe_wahl

=== ray_reihe_wahl ===
* [„Zeigen Sie es mir.“]
    ~ beginneAufgaben("riverton.reiheRay")
    -> END
* [„Gleich.“]
    Ich warte. Ich bin das Warten gewohnt. #sprecher:ray #stimmung:laechelt
    -> END

=== ray_alltag ===
{~Der Pavillon war unsere Endhaltestelle. Mal sehen, wo die nächste ist.|Slick zieht zu schnell. Der Alte hat ihm das vierzehn Jahre lang gesagt.|Wenn du nach Ironwood fährst: Der Bus hält an der Schnellstraße. Aber der Kanalweg ist schöner.} #sprecher:ray #stimmung:nachdenklich
-> END

// ---------------------------------------------------------------- Gegenstände

=== gedenktafel ===
{odumGedenktafelGesehen:
    Jemand hat frische Blumen unter die Tafel gelegt. Daneben steht ein Bauer aus Holz. #sprecher:erzaehler
    -> END
}
~ odumGedenktafelGesehen = true
Eine kleine Messingtafel an einem Pfeiler: „Für Elias Odum, der hier Generationen von Kindern das Schachspiel zeigte.“ #sprecher:erzaehler
Ein Lehrer, der eine Tafel bekommt. Das ist mehr, als die meisten Meister bekommen. #sprecher:ambrose #stimmung:nachdenklich
-> END

=== limonadenglas ===
{limonadenglasGesehen:
    Das Glas ist voll, die Limo warm. Wer verliert, trinkt sie trotzdem. #sprecher:erzaehler
    -> END
}
~ limonadenglasGesehen = true
Auf dem Geländer stehen Limonadengläser in einer Reihe, jedes mit einem Zettel: „Slick gegen Ray“, „Tamsin gegen Slick“, „Slick gegen alle“. #sprecher:erzaehler
-> END

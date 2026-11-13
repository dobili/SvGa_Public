// Ort: Turnhalle von Port Delacroix (Akt 3), Ausweichquartier des Clubs nach dem Hurrikan. Figuren:
// Miss Odile (Clubchefin), Remy, Lou; Mama ist beim Vorwurf dabei (Story-Bibel 19.4).
//
// Szenen der Bibel (Abschnitt 20): 63 Der Vorwurf (Hauptquest portDelacroix.tiefpunkt, R28, R29),
// Aufgabenreihen bei Remy und Lou (Runden portDelacroix.reiheRemy, portDelacroix.reiheLou),
// 64 Auftrag zum Bretter sammeln (Start der Quest portDelacroix.wiederaufbau), 67 Clubkampf ohne
// Ambrose (Begegnung portDelacroix.clubkampf, keine Karten), 69 Benefiz-Simultan (Runde
// portDelacroix.simultan, Wiederaufbau Besuch 2) mit Remys Entschuldigung.
// Einstiege wie in orte.json: odile, remy, lou. Wer die Halle zum ersten Mal betritt und jemanden
// anspricht, erlebt zuerst den Vorwurf.
//
// Ambrose schweigt nach dem Vorwurf bis zur Familie (Szene 68) (ambroseSprichtWieder, gesetzt in
// port-delacroix-werkstatt.ink), außer einem Satz je Szene. Beim Benefiz (Szene 69) gibt Miss Odile die Karte
// Schutzengel.
// Runde 11 (13.11.2026): Der Vorwurf nach dem Roman (roman/akt3_teil2.md, Kapitel 36): Remys Mauer,
// „König nach h1“, der Stuhl fällt, „Er hat nicht ganz unrecht“, das Brett bleibt bei Miss Odile am
// Schiedsrichtertisch. Klang: remy.mauer, zero (aus Ambroses Mund), Stille S49 und S50,
// ambrose.ende. Danach fehlt Ambrose bis Kapitel 38.
// Kapitel 40 nach dem Roman: Benefiz mit Remys Entschuldigung („Du hattest nicht ganz unrecht“).
// Kapitel 39 nach dem Roman: Geigenkasten und Karten auf dem Schiedsrichtertisch, „Spiel deine
// Partie“ aus dem Kasten, im Spiel Raumklang und der erste eigene Plan (Partiemomente in
// begegnungen.json), nach dem Sieg steht die ganze Halle; Nadel als Lyra mit Grünspan.
// Variablen: reiheRemyBestanden, reiheLouBestanden, portDelacroixSimultanBestanden,
// ausgangPortDelacroixClubkampf und nadelPortDelacroix setzt die Hülle (R42); bretterGesammelt
// zählt port-delacroix-aussen.ink; die übrigen setzt diese Datei.

EXTERNAL beginnePartie(begegnung)
EXTERNAL beginneAufgaben(runde)
EXTERNAL gibKarte(kennung)

VAR leimAuftrag = false
VAR tiefpunktGesehen = false
VAR ambroseSprichtWieder = false
VAR brettersammelnBegonnen = false
VAR bretterGesammelt = 0
VAR reiheRemyBestanden = false
VAR reiheLouBestanden = false
VAR portDelacroixSimultanBestanden = false
VAR simultanGedankt = false
VAR ausgangPortDelacroixClubkampf = ""
VAR nadelPortDelacroix = 0
VAR clubkampfPortDelacroixNadel = 0
VAR odileHandGegeben = false
VAR louGetroffen = false
VAR angesehenSpendenkasse = false
VAR angesehenNotenheft = false
VAR angesehenPlakatTurnhalle = false

// ---------------------------------------------------------------- Der Vorwurf

=== vorwurf ===
~ tiefpunktGesehen = true
Das Turnier ist in der Turnhalle der Schule. Unter den Basketballkörben stehen Biertische, die Bretter passen nicht zusammen. #sprecher:erzaehler
Wenn ein Fremder hereinkommt, wird es einen Moment leiser. Du bist ein Fremder, mit fünf Nadeln, eine aus Glas. #sprecher:erzaehler
Aus Silicon Bay. Die waren hier, nach dem Sturm. Mit einem Lastwagen. Wir dachten, die bringen Decken. #sprecher:remy
Bildschirme haben sie gebracht. Zwanzig Stück. Damit die Kinder etwas zu tun haben. #sprecher:remy
Er stößt seinen Trompetenkasten mit dem Fuß an. #sprecher:erzaehler
Hier hilft man mit den Händen. #sprecher:remy
* [Zum ersten Brett gehen]
- Die erste Runde gewinnst du, die zweite endet remis. In der dritten sitzt dir Remy gegenüber. #sprecher:erzaehler
Er baut eine Mauer aus Bauern. Nach fünfunddreißig Zügen stehst du sehr viel schlechter. #sprecher:erzaehler #musik:remy.mauer
Du zählst. Es hilft nicht. Es hängt nichts, es gibt nur diese Mauer, und sie kommt näher. #sprecher:erzaehler
* [„Ambrose. Bitte.“]
- Eine Pause. Dann seine Stimme, flach, schnell, als läse er etwas ab. #sprecher:erzaehler #pause:2
König nach h1. #sprecher:ambrose #musik:zero
* [„Was?“]
- König. Eine Ecke weiter. Jetzt. #sprecher:ambrose
Dein König steht sicher. Ihn zu bewegen ergibt keinen Sinn. #sprecher:erzaehler
* [„Warum?“]
- Spiel es. #sprecher:ambrose
-> vorwurf_zug

=== vorwurf_zug ===
Seit dem Dachboden hast du keinen Zug gespielt, den du nicht verstehst. Du spielst ihn. #sprecher:erzaehler
Sechs Züge später steht dein König nicht mehr auf der Linie, auf die alles zielt. Dein Turm geht durch Remys Mauer. #sprecher:erzaehler
Er verliert in zwölf Zügen. Er begreift es in dreien. #sprecher:erzaehler
Er steht auf. Der Stuhl fällt um. #sprecher:erzaehler #klang:stuhl_faellt #musik:aus #geraeusch:aus #pause:3
Das ist unmöglich. Den Zug findet keiner. König in die Ecke, ohne Grund. #sprecher:remy #stimmung:wuetend
Du hast dich runtergebeugt. Du hast in deinen Rucksack geflüstert. Was ist da drin? #sprecher:remy
* [Den Rucksack aufmachen]
    -> vorwurf_brett

=== vorwurf_brett ===
Die ganze Halle sieht dich an. Am Rand steht Mama im Kittel aus dem Notzelt, eine Hand vor dem Mund. #sprecher:erzaehler
Du ziehst das Brett heraus. Altes Holz, dunkle Ecken. #sprecher:erzaehler
* [„Es ist nur ein Brett.“]
- Dann rede ich auch mit meinem. #sprecher:remy
Du schummelst. Wie die mit ihren Bildschirmen. Nur altmodischer. #sprecher:remy
Du hast den Zug nicht verstanden. Du hast ihn gespielt, weil man ihn dir gesagt hat. Achtundneunzig Prozent. #sprecher:erzaehler
* [„Ambrose. Sag etwas.“]
- Er sieht nicht Remy an und nicht dich. Er sieht auf den König in der Ecke. #sprecher:erzaehler
Er hat nicht ganz unrecht. #sprecher:ambrose #stimmung:still #pause:4
Nur du hörst es. Es ist das Schlimmste, was er je zu dir gesagt hat. #sprecher:erzaehler
* [„Das war ihr Zug. Von dem Tablet.“]
- Er war richtig. #sprecher:ambrose
* [„Er war nicht meiner!“]
- Die Halle hört es. Sie versteht es nicht, aber sie hört es. #sprecher:erzaehler
Du nimmst das Brett in beide Hände. Es ist so schwer wie am ersten Tag. #sprecher:erzaehler
* [„Dann spiele ich ohne dich.“]
    -> vorwurf_ende

// Ambroses Thema endet hier und fehlt bis Kapitel 38 (Klangplan S51).
=== vorwurf_ende ===
Er antwortet nicht. Er nickt, ein einziges Mal, wie jemand, der ein Urteil annimmt. #sprecher:erzaehler #musik:ambrose.ende
Am Schiedsrichtertisch sitzt eine Frau mit weißem Haar. Du legst das Brett vor sie hin. #sprecher:erzaehler
* [„Ich gebe die Partie auf. Die gegen ihn.“]
- * [„Schreiben Sie null. Das Brett bleibt, solange ich spiele.“]
- Sie sieht dich lange an. Sie hat sehr ruhige Hände. #sprecher:erzaehler
Das Wasser hat das Haus genommen, nicht die Musik. Setz dich, Kind. Wir fangen neu an. #sprecher:odile
Draußen auf den Stufen setzt Mama sich neben dich. Sie fragt nichts. Sie riecht nach Desinfektionsmittel und Meer. #sprecher:erzaehler
Ich weiß, wie sich das anfühlt. Wenn eine ganze Halle dich ansieht. #sprecher:mutter
Fast. #sprecher:mutter #pause
Aus dem Zelt neben der Ruine kommt die Trompete. Sie spielt nur das Langsame. #sprecher:erzaehler
-> END

// ---------------------------------------------------------------- Miss Odile

=== odile ===
{
- not tiefpunktGesehen: -> vorwurf
- portDelacroixSimultanBestanden and not simultanGedankt: -> odile_nach_simultan
- nadelPortDelacroix > clubkampfPortDelacroixNadel: -> odile_nach_partie
- ausgangPortDelacroixClubkampf == "niederlage" and not odileHandGegeben: -> odile_nach_partie
- not brettersammelnBegonnen: -> odile_bretter
- bretterGesammelt >= 4 and not leimAuftrag: -> odile_leim
- else: -> odile_alltag
}

=== odile_bretter ===
// Kapitel 37: Das Brett liegt im Geigenkasten; der Held sammelt Bretter mit dem Handkarren.
~ brettersammelnBegonnen = true
Die Frau mit dem weißen Haar heißt Miss Odile. Sie ist Musiklehrerin und leitet den Club seit dreißig Jahren. #sprecher:erzaehler
Sie legt dein Brett in einen leeren Geigenkasten und schließt den Deckel. #sprecher:erzaehler
Da liegt es trocken. Hol es, wenn du es brauchst. Nicht vorher. #sprecher:odile
* [Nicken]
- Sie gibt dir einen Handkarren. #sprecher:erzaehler
Wir haben elf Bretter für vierzig Kinder. Vor dem Sturm hatte jede Familie hier eines. Geh fragen. #sprecher:odile
Und wenn du um die Nadel spielen willst: erst Remy, dann Lou, dann ich. #sprecher:odile
-> END

// Gutachten L3.4, Roman Kapitel 38: Miss Odile schickt den Helden mit dem Geigenkasten zum
// Klavierbauer in der Rue des Facteurs.
=== odile_leim ===
~ leimAuftrag = true
In der Rue des Facteurs wohnt ein Klavierbauer. Der hat Leim, den guten, für die Bretter, die sich verzogen haben. #sprecher:odile
Den Geigenkasten gibt sie dir mit. #sprecher:erzaehler
* [„Er ist schwer.“]
- Das soll er sein. #sprecher:odile #pause
-> END

=== odile_alltag ===
{~Bauern sind die Melodie. Die Figuren spielen nur dazu.|Hör auf den Takt der Stellung. Nicht auf den Lärm in der Halle.} #sprecher:odile
+ {reiheRemyBestanden and reiheLouBestanden and nadelPortDelacroix == 0} [„Ich möchte um die Nadel spielen.“]
    -> odile_clubkampf
+ {nadelPortDelacroix > 0 and nadelPortDelacroix < 3} [„Revanche um eine bessere Nadel?“]
    -> odile_clubkampf
+ {bretterGesammelt >= 4 and ambroseSprichtWieder and not portDelacroixSimultanBestanden} [„Was kann ich noch für das Musikhaus tun?“]
    -> odile_simultan
+ [„Bis später, Miss Odile.“]
    -> END

=== odile_clubkampf ===
{nadelPortDelacroix > 0:
    Noch einmal? Gut. Ein Plan ist kein Sprint. #sprecher:odile
    -> odile_clubkampf_wahl
}
Die Turnhalle ist voll. Sie sind alle gekommen, um zu sehen, wer da in einen Rucksack flüstert. #sprecher:erzaehler #musik:aus
Du stellst den Geigenkasten auf den Schiedsrichtertisch, geschlossen. Deine Karten liegen daneben, mit dem Bild nach unten. #sprecher:erzaehler
Miss Odile setzt sich dir gegenüber, in einem Kleid mit kleinen Notenschlüsseln. #sprecher:erzaehler
Ein Plan ist kein Sprint. Ich spiele langsam. Du wirst denken, es passiert nichts. #sprecher:odile
Es passiert die ganze Zeit etwas. Bauern sind die Melodie. Die Figuren spielen nur dazu. #sprecher:odile
* [Die Hände auf den Tisch legen]
- Bevor ihr anfangt, hörst du ihn. Aus dem Kasten, drei Meter entfernt. Drei Wörter. #sprecher:erzaehler
Spiel deine Partie. #sprecher:ambrose #stimmung:still
Dann ist er fort, und du bist allein mit vierundsechzig Feldern. #sprecher:erzaehler
-> odile_clubkampf_wahl

=== odile_clubkampf_wahl ===
+ [„Ich bin bereit.“]
    ~ beginnePartie("portDelacroix.clubkampf")
    -> END
+ [„Noch nicht.“]
    Gut. Eine Melodie übt man, bevor man sie spielt. #sprecher:odile
    -> END

=== odile_nach_partie ===
~ clubkampfPortDelacroixNadel = nadelPortDelacroix
{
- ausgangPortDelacroixClubkampf == "sieg" and not odileHandGegeben:
    Ein Plan. Dein erster. Er war hässlich und langsam, und er gehört dir. #sprecher:erzaehler
    Miss Odile sieht es an. Sie nickt, im Takt von etwas, das nur sie hört. #sprecher:erzaehler #musik:held
    Der Königsflügel. Immer mein Königsflügel. Mein Mann hat mir das vierzig Jahre lang gesagt. #sprecher:odile
- ausgangPortDelacroixClubkampf == "sieg":
    Miss Odile legt ihren König um und lächelt. #sprecher:erzaehler
- ausgangPortDelacroixClubkampf == "remis":
    Remis. Zwei Stimmen, ein Akkord. #sprecher:odile
- else:
    Miss Odile hat gewonnen. Sie sieht nicht aus, als hätte sie gewonnen. #sprecher:erzaehler
}
{not odileHandGegeben: -> odile_hand}
{nadelPortDelacroix > 0:
    Eine bessere Nadel. Ganz ohne Karten. #sprecher:odile
- else:
    Noch einmal, wenn du willst. Ich bin hier, bis das Musikhaus wieder steht. #sprecher:odile
}
-> END

// Kapitel 39: Sie steht auf, und die ganze Halle steht mit ihr. Remy nickt einmal.
=== odile_hand ===
~ odileHandGegeben = true
Sie steht auf. Sie ist nicht groß. Aber als sie steht, steht die ganze Halle mit ihr. #sprecher:erzaehler
Das war deine Partie. Jeder hier hat es gesehen. #sprecher:odile
Niemand klatscht. Aber Gesichter, die dich vor einer Woche nicht angesehen haben, sehen dich an. #sprecher:erzaehler
Remy steht an der Wand, die Trompete unter dem Arm. Er sagt nichts. Er nickt. Einmal. #sprecher:erzaehler #pause
{nadelPortDelacroix > 0: Die Nadel ist eine kleine Lyra aus Messing, grün angelaufen, wo das Salzwasser war. Miss Odile steckt sie dir an, neben das Glas. #sprecher:erzaehler}
* [Zum Schiedsrichtertisch gehen]
- Du legst die Hand auf den Geigenkasten. Du öffnest ihn nicht. Noch nicht. #sprecher:erzaehler
-> END

// ---------------------------------------------------------------- Benefiz-Simultan (Besuch 2)

=== odile_simultan ===
Die Bretter sind da, jetzt brauchen wir Geld für das Dach. #sprecher:odile
Spielst du eine Simultan gegen die Kinder der Stadt? Jedes Kind gibt einen Dollar in die Kasse. #sprecher:odile
+ [„Ich spiele.“]
    Drei Tische, drei Kinder. Am dritten setzt sich Remy hin, die Arme verschränkt. #sprecher:erzaehler
    ~ beginneAufgaben("portDelacroix.simultan")
    -> END
+ [„Nicht jetzt.“]
    Die Kinder warten. Sie üben solange Springerzüge. #sprecher:odile
    -> END

=== odile_nach_simultan ===
// Kapitel 40: Remys Entschuldigung; der Held gibt ihm halb recht. Miss Odile gibt die Karte
// Schutzengel (Szene 69).
~ simultanGedankt = true
Jedes Kind legt einen Dollar in die Blechdose. Am dritten Brett verliert Remy knapp, legt seinen Dollar hinein und bleibt sitzen. #sprecher:erzaehler
Ich hab dich beobachtet. Die ganze Woche. Mit dem Karren. Bei Batiste. #sprecher:remy #stimmung:still
Du redest mit dem Brett. Ich weiß nicht, warum. Aber du spielst allein. #sprecher:remy
Tut mir leid. Die mit dem Glas haben uns Bildschirme gebracht, als wir Decken gebraucht haben. #sprecher:remy
* [„Du hattest nicht ganz unrecht. Den Zug fand ich nicht.“]
- Remy sieht dich lange an. Dann nimmt er die Trompete aus dem Kasten und spielt das Schnelle. #sprecher:erzaehler #musik:odile.tanz
Die ganze Halle klatscht im Takt. Mama tanzt mit einem Mann aus dem Notzelt. #sprecher:erzaehler
Miss Odile drückt dir eine Karte in die Hand: ein kleiner Engel mit einem Schild. #sprecher:erzaehler
Damit du nicht wieder etwas verlierst, was dir wichtig ist. #sprecher:odile
~ gibKarte("schutzengel")
Den Geigenkasten schiebt sie dir über den Tisch. Der Kasten hat lange keine Geige mehr getragen. Jetzt hat er wieder was zu tun. #sprecher:odile
Du siehst ihn an. Der Deckel steht offen. #sprecher:erzaehler
-> END

// ---------------------------------------------------------------- Remy

=== remy ===
{
- not tiefpunktGesehen: -> vorwurf
// Erst die Reihe, dann die Versöhnung: Wer das Simultan vor Remys Reihe spielt, darf die Reihe
// nicht verlieren (Sackgasse in der Gesamtsimulation, 10.11.2026).
- not reiheRemyBestanden: -> remy_reihe
- simultanGedankt: -> remy_versoehnt
- else: -> remy_alltag
}

=== remy_reihe ===
Remy poliert seine Trompete und sieht dich nicht an. #sprecher:erzaehler
Du willst um die Nadel spielen? Dann zeig mir, dass du Bauern verstehst. Ohne Flüstern. #sprecher:remy
+ [„Gib mir deine Aufgaben.“]
    ~ beginneAufgaben("portDelacroix.reiheRemy")
    -> END
+ [„Nicht jetzt.“]
    Hier hilft man mit den Händen. Nicht mit Bildschirmen. Und nicht mit Flüstern. #sprecher:remy
    -> END

=== remy_alltag ===
{~Remy übt Tonleitern auf der Trompete. Er hört kurz auf, als du vorbeigehst.|Meine Großmutter sagt, ich soll netter sein. Ich bin nett. Zu Leuten, die ich kenne.|Perfect Move wollte uns Bildschirme schenken. Wir wollten ein Dach.} #sprecher:remy
-> END

=== remy_versoehnt ===
{~Willst du hören, was ich zur Eröffnung des Musikhauses spiele? Es ist noch nicht fertig.|Du spielst wie jemand, der was verloren hat. Ich weiß, wie das ist. Der Sturm hat meine Trompete auch fast genommen.|Komm zur Eröffnung. Ich spiele, du hängst das Schild auf.} #sprecher:remy
-> END

// ---------------------------------------------------------------- Lou

=== lou ===
{
- not tiefpunktGesehen: -> vorwurf
- not reiheRemyBestanden: -> lou_warten
- not reiheLouBestanden: -> lou_reihe
- else: -> lou_alltag
}

=== lou_warten ===
~ louGetroffen = true
Ein Mädchen sortiert Muscheln in eine Eierschachtel, eine Sorte pro Fach. #sprecher:erzaehler
Lou. Erst Remy, dann ich. #sprecher:lou
So ist die Reihenfolge. Remy hat sie erfunden. #sprecher:lou
-> END

=== lou_reihe ===
{not louGetroffen:
    ~ louGetroffen = true
    Ein Mädchen sortiert Muscheln in eine Eierschachtel, eine Sorte pro Fach. #sprecher:erzaehler
    Lou. Ich sammle Muscheln und Pläne. #sprecher:lou
}
Ich hab einen Plan. Er ist noch nicht fertig, aber er ist gut. #sprecher:lou
Findest du in meinen Stellungen auch einen? Mit Läufern. Läufer sind wichtig für Pläne. #sprecher:lou
+ [„Zeig her.“]
    ~ beginneAufgaben("portDelacroix.reiheLou")
    -> END
+ [„Nicht jetzt.“]
    Gut. Ein Plan braucht Zeit. #sprecher:lou
    -> END

=== lou_alltag ===
{~Diese Muschel hat elf Rillen. Die hier zwölf. Das ist ein Plan, glaube ich.|Miss Odile sagt, ein Plan ist kein Sprint. Ich renne trotzdem gern.|Wenn das Musikhaus fertig ist, kriege ich ein Regal für meine Muscheln.} #sprecher:lou
-> END

// ---------------------------------------------------------------- Ansehen (Runde 6)

=== spendenkasse ===
{angesehenSpendenkasse:
    In der Kasse klimpert es. Jemand hat einen Zettel dazugelegt: „Für neue Bretter.“ #sprecher:erzaehler
    -> END
}
~ angesehenSpendenkasse = true
Eine Blechdose mit Schlitz: „Für das Musikhaus.“ Darin Münzen, ein Knopf und eine Busfahrkarte. #sprecher:erzaehler
-> END

=== notenheft ===
{angesehenNotenheft:
    Das Notenheft trocknet. Die Seiten wellen sich, die Töne bleiben. #sprecher:erzaehler
    -> END
}
~ angesehenNotenheft = true
Ein Notenheft, aufgequollen vom Hochwasser. Auf dem Umschlag steht in Bleistift: „Nicht wegwerfen. Spielt noch.“ #sprecher:erzaehler
{ambroseSprichtWieder: Musik und Schach. Beides wird nicht schlechter, wenn es nass wird. #sprecher:ambrose}
-> END

=== plakat_turnhalle ===
{angesehenPlakatTurnhalle:
    „Wir spielen weiter.“ Jemand hat ein Herz daneben gemalt. #sprecher:erzaehler
    -> END
}
~ angesehenPlakatTurnhalle = true
Ein handgemaltes Plakat an der Wand: „Wir spielen weiter. Jeden Abend, solange das Licht reicht.“ #sprecher:erzaehler
-> END

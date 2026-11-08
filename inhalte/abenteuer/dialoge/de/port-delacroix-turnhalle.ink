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
// Ambrose schweigt nach dem Vorwurf bis zu den Nachfahren (ambroseSprichtWieder, gesetzt in
// port-delacroix-werkstatt.ink), außer einem Satz je Szene. Die Karte Schutzengel (Szene 69) fehlt
// noch in karten.json; der Aufruf steht als Kommentar bereit.
// Variablen: reiheRemyBestanden, reiheLouBestanden, simultanBestanden,
// ausgangPortDelacroixClubkampf und nadelPortDelacroix setzt die Hülle (R42); bretterGesammelt
// zählt port-delacroix-aussen.ink; die übrigen setzt diese Datei.

EXTERNAL beginnePartie(begegnung)
EXTERNAL beginneAufgaben(runde)

VAR tiefpunktGesehen = false
VAR ambroseSprichtWieder = false
VAR brettersammelnBegonnen = false
VAR bretterGesammelt = 0
VAR reiheRemyBestanden = false
VAR reiheLouBestanden = false
VAR simultanBestanden = false
VAR simultanGedankt = false
VAR ausgangPortDelacroixClubkampf = ""
VAR nadelPortDelacroix = 0
VAR clubkampfPortDelacroixNadel = 0
VAR odileHandGegeben = false
VAR louGetroffen = false

// ---------------------------------------------------------------- Der Vorwurf

=== vorwurf ===
~ tiefpunktGesehen = true
In der Turnhalle läuft das Regionalturnier. Unter den Basketballkörben stehen zwanzig Tische, auf jedem ein Brett. #sprecher:erzaehler
Du gewinnst deine Partie mit einem Zug, den keiner erwartet hat. Am Nachbartisch springt ein Junge mit Trompetenkoffer auf. #sprecher:erzaehler
Das ist unmöglich. Ich hab gesehen, wie du vorher mit dem Brett geflüstert hast. #sprecher:remy #stimmung:wuetend
Du schummelst. Wie die mit ihren Bildschirmen. Nur altmodischer. #sprecher:remy
Es wird still in der Halle. Alle sehen dich an. Du kannst nichts beweisen. #sprecher:erzaehler #pause
Er hat nicht ganz unrecht. #sprecher:ambrose #stimmung:still
* [„Dann spiele ich ohne dich.“]
    Du legst das alte Brett in den Rucksack und ziehst den Reißverschluss zu. #sprecher:erzaehler
* [Nichts sagen und das Brett einpacken]
    Du legst das alte Brett in den Rucksack. „Dann spiele ich ohne dich.“ #sprecher:erzaehler
- Ambrose sagt nichts mehr. #sprecher:erzaehler #pause
Später, draußen vor der Halle, nimmt Mama dich in den Arm. #sprecher:erzaehler
Ich weiß, wie sich das anfühlt. Fast. #sprecher:mutter
-> END

// ---------------------------------------------------------------- Miss Odile

=== odile ===
{
- not tiefpunktGesehen: -> vorwurf
- simultanBestanden and not simultanGedankt: -> odile_nach_simultan
- nadelPortDelacroix > clubkampfPortDelacroixNadel: -> odile_nach_partie
- ausgangPortDelacroixClubkampf == "niederlage" and not odileHandGegeben: -> odile_nach_partie
- not brettersammelnBegonnen: -> odile_bretter
- else: -> odile_alltag
}

=== odile_bretter ===
~ brettersammelnBegonnen = true
Eine Frau mit grauen Locken stellt Figuren auf einen Klapptisch und summt dabei. #sprecher:erzaehler
Odile Fontaine. Ich leite den Club, seit dreißig Jahren. Früher im Musikhaus am Kai. #sprecher:odile
Das Wasser hat das Haus genommen, nicht die Musik. Aber es hat unsere Bretter genommen. #sprecher:odile
Die Familien in der Stadt haben noch welche gerettet. Holst du sie uns? Vier Häuser, vier Türen. #sprecher:odile
Und wenn du um die Nadel spielen willst: erst Remy, dann Lou, dann ich. #sprecher:odile
-> END

=== odile_alltag ===
{~Bauern sind die Melodie. Die Figuren spielen nur dazu.|Hör auf den Takt der Stellung. Nicht auf den Lärm in der Halle.|Miss Odile singt leise, während sie Figuren sortiert.} #sprecher:odile
+ {reiheRemyBestanden and reiheLouBestanden and nadelPortDelacroix == 0} [„Ich möchte um die Nadel spielen.“]
    -> odile_clubkampf
+ {nadelPortDelacroix > 0 and nadelPortDelacroix < 3} [„Revanche um eine bessere Nadel?“]
    -> odile_clubkampf
+ {bretterGesammelt >= 4 and not simultanBestanden} [„Was kann ich noch für das Musikhaus tun?“]
    -> odile_simultan
+ [„Bis später, Miss Odile.“]
    -> END

=== odile_clubkampf ===
Spiel langsam. Ein Plan ist kein Sprint. #sprecher:odile
Heute ohne Karten, nur du und das Brett. Die Uhr darfst du wählen. #sprecher:odile
{not ambroseSprichtWieder:
    Spiel deine Partie. #sprecher:ambrose #stimmung:still
}
* [„Ich bin bereit.“]
    ~ beginnePartie("portDelacroix.clubkampf")
    -> END
* [„Noch nicht.“]
    Gut. Eine Melodie übt man, bevor man sie spielt. #sprecher:odile
    -> END

=== odile_nach_partie ===
~ clubkampfPortDelacroixNadel = nadelPortDelacroix
{
- ausgangPortDelacroixClubkampf == "sieg":
    Miss Odile legt ihren König um und lächelt. #sprecher:erzaehler
- ausgangPortDelacroixClubkampf == "remis":
    Remis. Zwei Stimmen, ein Akkord. #sprecher:odile
- else:
    Miss Odile hat gewonnen. Sie sieht nicht aus, als hätte sie gewonnen. #sprecher:erzaehler
}
{not odileHandGegeben:
    ~ odileHandGegeben = true
    Dann steht sie auf, reicht dir die Hand und spricht laut, damit alle es hören. #sprecher:erzaehler
    Das war deine Partie. Jeder hier hat es gesehen. #sprecher:odile
    Remy schweigt. Aber er nickt. #sprecher:erzaehler #pause
}
{nadelPortDelacroix > 0:
    Die sechste Nadel. Ganz ohne Karten. #sprecher:odile
- else:
    Noch einmal, wenn du willst. Ich bin hier, bis das Musikhaus wieder steht. #sprecher:odile
}
-> END

// ---------------------------------------------------------------- Benefiz-Simultan (Besuch 2)

=== odile_simultan ===
Die Bretter sind da, jetzt brauchen wir Geld für das Dach. #sprecher:odile
Spielst du eine Simultan gegen die Kinder der Stadt? Jedes Kind gibt einen Dollar in die Kasse. #sprecher:odile
* [„Ich spiele.“]
    Drei Tische, drei Kinder. Am dritten setzt sich Remy hin, die Arme verschränkt. #sprecher:erzaehler
    ~ beginneAufgaben("portDelacroix.simultan")
    -> END
* [„Später.“]
    Die Kinder warten. Sie üben solange Springerzüge. #sprecher:odile
    -> END

=== odile_nach_simultan ===
~ simultanGedankt = true
Die Kasse klingelt. Drei Dollar, und ein Vierter, den Mrs. Arceneaux dazulegt. #sprecher:erzaehler
Remy bleibt am dritten Brett sitzen, als die anderen schon gehen. #sprecher:erzaehler
Ich hab dich beobachtet. Du redest mit dem Brett, aber du spielst allein. Tut mir leid. #sprecher:remy #stimmung:still
Miss Odile drückt dir eine Karte in die Hand. #sprecher:erzaehler
Damit du nicht wieder etwas verlierst, was dir wichtig ist. #sprecher:odile
// ~ gibKarte("schutzengel")  (Karte fehlt noch in karten.json)
-> END

// ---------------------------------------------------------------- Remy

=== remy ===
{
- not tiefpunktGesehen: -> vorwurf
- simultanGedankt: -> remy_versoehnt
- not reiheRemyBestanden: -> remy_reihe
- else: -> remy_alltag
}

=== remy_reihe ===
Remy poliert seine Trompete und sieht dich nicht an. #sprecher:erzaehler
Du willst um die Nadel spielen? Dann zeig mir, dass du Bauern verstehst. Ohne Flüstern. #sprecher:remy
* [„Gib mir deine Aufgaben.“]
    ~ beginneAufgaben("portDelacroix.reiheRemy")
    -> END
* [„Später.“]
    Hier hilft man mit den Händen. Nicht mit Bildschirmen. Und nicht mit Geistern. #sprecher:remy
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
Lou. Erst Remy, dann ich. So ist die Reihenfolge. Remy hat sie erfunden. #sprecher:lou
-> END

=== lou_reihe ===
{not louGetroffen:
    ~ louGetroffen = true
    Ein Mädchen sortiert Muscheln in eine Eierschachtel, eine Sorte pro Fach. #sprecher:erzaehler
    Lou. Ich sammle Muscheln und Pläne. #sprecher:lou
}
Ich hab einen Plan. Er ist noch nicht fertig, aber er ist gut. #sprecher:lou
Findest du in meinen Stellungen auch einen? Mit Läufern. Läufer sind wichtig für Pläne. #sprecher:lou
* [„Zeig her.“]
    ~ beginneAufgaben("portDelacroix.reiheLou")
    -> END
* [„Später.“]
    Gut. Ein Plan braucht Zeit. #sprecher:lou
    -> END

=== lou_alltag ===
{~Diese Muschel hat elf Rillen. Die hier zwölf. Das ist ein Plan, glaube ich.|Miss Odile sagt, ein Plan ist kein Sprint. Ich renne trotzdem gern.|Wenn das Musikhaus fertig ist, kriege ich ein Regal für meine Muscheln.} #sprecher:lou
-> END

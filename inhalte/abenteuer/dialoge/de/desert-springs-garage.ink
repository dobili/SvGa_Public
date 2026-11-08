// Ort: Garage am Motel von Desert Springs (Akt 3), Club von Mira Castillo. Figuren: Mira
// (Clubchefin), Tomás, Dot (Story-Bibel 18.4 und 19.6).
//
// Szenen der Bibel (Abschnitt 20): 75 Aufgabenreihen (Runden desertSprings.reiheTomas,
// desertSprings.reiheDot), 78 Clubkampf (Begegnung desertSprings.clubkampf, Karten erlaubt, der
// Mentor-Zug ist nach der Versöhnung wieder frei), Dots Hinweis auf das Antiquariat (Szene 76).
// Einstiege wie in orte.json: mira, tomas, dot. Die Szene 77 (Erinnerung 1858) wartet auf ihre
// Stellung (Folgeauftrag mit der Engine, Bericht).
//
// Der Club beginnt erst nach der Versöhnung (Hauptquest desertSprings.versoehnung, streng der
// Reihe nach). Variablen: reiheTomasBestanden, reiheDotBestanden, ausgangDesertSpringsClubkampf
// und nadelDesertSprings setzt die Hülle (R42); miraSteinGesehen und versoehnungGesehen setzt
// weg-delacroix-desert.ink; die übrigen setzt diese Datei.

EXTERNAL beginnePartie(begegnung)
EXTERNAL beginneAufgaben(runde)

VAR miraSteinGesehen = false
VAR versoehnungGesehen = false
VAR reiheTomasBestanden = false
VAR reiheDotBestanden = false
VAR ausgangDesertSpringsClubkampf = ""
VAR nadelDesertSprings = 0
VAR clubkampfDesertSpringsNadel = 0
VAR tomasGetroffen = false
VAR dotGetroffen = false
VAR dotOkoroErzaehlt = false

// ---------------------------------------------------------------- Vor der Versöhnung

=== garage_wartet ===
{
- not miraSteinGesehen:
    Mira ist im Canyon, auf ihrem Stein. Ohne sie fängt hier nichts an. #sprecher:tomas
- else:
    Warst du schon am Felsbogen, wenn die Sonne untergeht? Das sieht hier jeder einmal. Dann reden wir. #sprecher:tomas
}
-> END

// ---------------------------------------------------------------- Mira

=== mira ===
{
- not versoehnungGesehen: -> garage_wartet
- nadelDesertSprings > clubkampfDesertSpringsNadel: -> mira_nach_sieg
- not (reiheTomasBestanden and reiheDotBestanden): -> mira_reihe_offen
- nadelDesertSprings == 0 and ausgangDesertSpringsClubkampf == "niederlage": -> mira_nach_niederlage
- nadelDesertSprings == 0: -> mira_clubkampf
- else: -> mira_alltag
}

=== mira_reihe_offen ===
Du bist gekommen. Gut. #sprecher:mira
{not reiheTomasBestanden:
    Erst Tomás, dann Dot, dann ich. Tomás ist langsam. Aber er hat recht. #sprecher:mira
- else:
    Jetzt Dot. Sie spielt seit fünfzig Jahren per Post. Sie hat Zeit. #sprecher:mira
}
-> END

=== mira_clubkampf ===
Ich opfere den Läufer. Weil ich kann. Spielen wir? #sprecher:mira
Sie opfert früh und gern. Wer kühl rechnet, gewinnt. Aber du entscheidest. #sprecher:ambrose
* [„Spielen wir.“]
    ~ beginnePartie("desertSprings.clubkampf")
    -> END
* [„Noch nicht.“]
    Okay. Ich warte. #sprecher:mira
    -> END

=== mira_nach_niederlage ===
Ich hab gewonnen. Das Opfer war richtig. Noch mal? #sprecher:mira
* [„Noch mal.“]
    ~ beginnePartie("desertSprings.clubkampf")
    -> END
* [„Später.“]
    -> END

=== mira_nach_sieg ===
~ clubkampfDesertSpringsNadel = nadelDesertSprings
{ausgangDesertSpringsClubkampf == "remis":
    Remis. Langweilig. Aber gut gespielt. #sprecher:mira
- else:
    Du hast mich geschlagen. #sprecher:mira #pause
}
Noch mal. Jetzt. #sprecher:mira
Die siebte Nadel. Und diesmal haben wir sie zusammen gewonnen, auch wenn du jeden Zug selbst gemacht hast. #sprecher:ambrose #stimmung:froh
Auch für Port Delacroix schreibe ich dir noch eine Notiz. Ich war dort nicht still, weil ich nichts zu sagen hatte. #sprecher:ambrose
-> END

=== mira_alltag ===
{~Im Canyon antwortet das Echo. Am Brett nicht. Deshalb mag ich das Brett.|Opfer sind schöner als Recht haben.|Warum hat das Huhn die Straße überquert? Um den König zu schützen.} #sprecher:mira
+ {nadelDesertSprings > 0 and nadelDesertSprings < 3} [„Revanche um eine bessere Nadel?“]
    Jetzt. #sprecher:mira
    ~ beginnePartie("desertSprings.clubkampf")
    -> END
+ [„Bis später, Mira.“]
    -> END

// ---------------------------------------------------------------- Tomás

=== tomas ===
{
- not versoehnungGesehen: -> garage_wartet
- not reiheTomasBestanden: -> tomas_reihe
- else: -> tomas_alltag
}

=== tomas_reihe ===
{not tomasGetroffen:
    ~ tomasGetroffen = true
    Unter einem alten Auto rollt ein junger Mann hervor und wischt sich die Hände ab. #sprecher:erzaehler
    Tomás. Miras Bruder. Ich repariere Autos und passe auf, dass sie nicht alles opfert. #sprecher:tomas
}
Ein Opfer ist gut, wenn danach Matt steht. Sonst ist es nur weg. Findest du die Matts? #sprecher:tomas
* [„Zeig her.“]
    ~ beginneAufgaben("desertSprings.reiheTomas")
    -> END
* [„Später.“]
    Kein Problem. Das Auto wartet auch. #sprecher:tomas
    -> END

=== tomas_alltag ===
{~Mira hat heute schon drei Damen geopfert. Zwei waren richtig.|Ein Motor und ein Angriff brauchen dasselbe: alle Teile an der richtigen Stelle.|Wenn du Mira schlägst, ist sie einen Tag lang still. Dann redet sie doppelt.} #sprecher:tomas
-> END

// ---------------------------------------------------------------- Dot

=== dot ===
{
- not versoehnungGesehen: -> garage_wartet
- not reiheTomasBestanden: -> dot_warten
- not reiheDotBestanden: -> dot_reihe
- not dotOkoroErzaehlt: -> dot_okoro
- else: -> dot_alltag
}

=== dot_warten ===
~ dotGetroffen = true
Eine alte Dame sitzt in einem Gartenstuhl und schreibt einen Brief. Neben ihr liegt ein Taschenschachbrett. #sprecher:erzaehler
Dot. Mir gehört das Motel. #sprecher:dot
Erst Tomás, Liebes. Ich bin danach dran. #sprecher:dot
-> END

=== dot_reihe ===
{not dotGetroffen:
    ~ dotGetroffen = true
    Eine alte Dame sitzt in einem Gartenstuhl und schreibt einen Brief. Neben ihr liegt ein Taschenschachbrett. #sprecher:erzaehler
    Dot. Mir gehört das Motel. #sprecher:dot
}
Ich spiele seit fünfzig Jahren per Post. Ein Zug pro Woche, aber jeder sitzt. #sprecher:dot
Meine Aufgaben greifen den König an. Langsam, Liebes, wie ein Brief. #sprecher:dot
* [„Ich bin bereit.“]
    ~ beginneAufgaben("desertSprings.reiheDot")
    -> END
* [„Später.“]
    Die Post kommt auch nicht schneller. #sprecher:dot
    -> END

=== dot_okoro ===
~ dotOkoroErzaehlt = true
Du magst alte Sachen, oder? Dein Brett sieht aus, als hätte es Geschichten. #sprecher:dot
Mr. Okoro im Antiquariat hat den Kram von einem alten Brückenbauer im Keller. #sprecher:dot
Kisten voller Briefe. Frag ihn. #sprecher:dot
Ein Brückenbauer. Hier, in der Wüste. #sprecher:ambrose #pause
-> END

=== dot_alltag ===
{~Heute kam ein Brief aus Reykjavík. Mein Gegner hat endlich gezogen. Nach drei Wochen.|Briefe sind wie Züge, Liebes. Man schickt sie los und wartet.|Willst du ein Zimmer? Für Schachspieler die Hälfte.} #sprecher:dot
-> END

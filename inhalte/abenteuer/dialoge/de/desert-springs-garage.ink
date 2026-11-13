// Ort: Garage am Motel von Desert Springs (Akt 3), Club von Mira Castillo. Figuren: Mira
// (Clubchefin), Tomás, Dot (Story-Bibel 18.4 und 19.6).
//
// Szenen der Bibel (Abschnitt 20): 75 Aufgabenreihen (Runden desertSprings.reiheTomas,
// desertSprings.reiheDot), 78 Clubkampf (Begegnung desertSprings.clubkampf, Karten erlaubt, der
// Mentor-Zug ist nach der Versöhnung wieder frei), Dots Hinweis auf das Antiquariat (Szene 76).
// Szene 77 Erinnerung 1858 (Begegnung desertSprings.erinnerung1858, Quest gleichen Namens): die
// erfundene siebte Matchpartie gegen Hale als Stellungsduell nach Hales stillem Läuferzug
// (Entscheidung 13.11.2026; Stellung mit der Engine gebaut, Weiß etwa +1,9, nur Lxh7+ hält).
// Einstiege wie in orte.json: mira, tomas, dot.
//
// Der Club beginnt erst nach der Versöhnung (Hauptquest desertSprings.versoehnung, streng der
// Reihe nach). Variablen: reiheTomasBestanden, reiheDotBestanden, ausgangDesertSpringsClubkampf
// und nadelDesertSprings setzt die Hülle (R42); miraSteinGesehen und versoehnungGesehen setzt
// weg-delacroix-desert.ink; die übrigen setzt diese Datei.

EXTERNAL beginnePartie(begegnung)
EXTERNAL beginneAufgaben(runde)

VAR held = "Du"
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
// Kapitel 45: Stellungsduell ab Hales Läuferzug (Begegnung desertSprings.erinnerung1858, Gegner
// desertSprings.hale1858); den Ausgang setzt die Hülle (R42).
VAR ausgangDesertSpringsErinnerung1858 = ""
VAR erinnerung1858Besprochen = false
// Kapitel 43 (Roman): Dot und Margaret, Tomás und der Dosenpokal, Miras „Weil ich kann“.
VAR miraGarageGesehen = false
// Kapitel 46 (Roman): „Atme“ als Wahl mitten im Clubkampf (Partiemoment clubkampf_atme).
VAR atmeGesagt = false
VAR atmeMomentGesehen = false
VAR margaretErzaehlt = false

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
- ausgangDesertSpringsErinnerung1858 != "" and ausgangDesertSpringsErinnerung1858 != "abgebrochen" and not erinnerung1858Besprochen: -> mira_nach_erinnerung
- not (reiheTomasBestanden and reiheDotBestanden): -> mira_reihe_offen
- nadelDesertSprings == 0 and ausgangDesertSpringsClubkampf == "niederlage": -> mira_nach_niederlage
- nadelDesertSprings == 0: -> mira_clubkampf
- else: -> mira_alltag
}

=== mira_reihe_offen ===
{not miraGarageGesehen: -> mira_weil_ich_kann ->}
{not reiheTomasBestanden:
    Erst Tomás, dann Dot, dann ich. Tomás ist langsam. Aber er hat recht. #sprecher:mira
- else:
    Jetzt Dot. Sie spielt seit fünfzig Jahren per Post. Sie hat Zeit. #sprecher:mira
}
-> END

=== mira_weil_ich_kann ===
~ miraGarageGesehen = true
Als es dunkel wird, kommt Mira. Staubig bis zu den Ohren. Sie setzt sich an einen Tisch und sieht dich an. #sprecher:erzaehler #musik:mira
Ich opfere den Läufer. #sprecher:mira
* [„Wir haben noch nicht angefangen.“]
- Ich sag's dir nur. Weil ich kann. #sprecher:mira
->->

=== mira_clubkampf ===
// Kapitel 46 (Roman): ganz Desert Springs in der Garage; Nadel als Kupferkaktus mit Blüte.
Ganz Desert Springs passt in die Garage. Buck mit Zahnstocher, Dot mit Lockenwicklern, Mr. Okoro mit einem Buch, falls es langweilig wird. #sprecher:erzaehler
Die Nadel liegt auf einem Ölkanister. Ein kleiner Kaktus aus Kupfer, mit einer einzigen Blüte. #sprecher:erzaehler #bild:nadel_kaktus
Karten? #sprecher:tomas #bild:aus
Nur, wenn du willst. Dann kommentiere ich. Aber du entscheidest. #sprecher:ambrose
Ich habe gelernt, was geschieht, wenn es andersherum läuft. #sprecher:ambrose #stimmung:still
Mira setzt sich. Ihre Füße reichen nicht bis zum Boden. #sprecher:erzaehler
Ich opfere früh. Du kannst es nicht verhindern. #sprecher:mira
* [„Ich will sehen, ob es stimmt.“]
    Sie grinst. Zum ersten Mal sieht sie aus wie zehn. #sprecher:erzaehler #musik:desertSprings.clubkampf
    ~ beginnePartie("desertSprings.clubkampf")
    -> END
* [„Noch nicht.“]
    Okay. Ich warte. #sprecher:mira
    -> END

// ---------------------------------------------------------------- Partiemomente (Kapitel 46)
// Feste Momente im Clubkampf (begegnungen.json, momente). Stellungsneutral: Die Sätze stimmen
// in jeder Partie gegen Mira.

=== clubkampf_sturm ===
Es ist wie ein Sturm. Aber du warst schon in einem, in einem Pavillon im Regen. Im Sturm zählt man. #sprecher:erzaehler
Prüf es für sie. So gründlich, als wärst du sie. Angreifer, Verteidiger. #sprecher:ambrose
Sie opfert, weil es schön ist. Nicht immer, weil es geht. Ich erkenne es. #sprecher:ambrose #stimmung:alt
-> END

=== clubkampf_atme ===
{atmeMomentGesehen: -> END}
~ atmeMomentGesehen = true
Miras Summen hört auf. Ihre Hand geht vor, schnell. Die Hand von jemandem, unter dem der Boden weggebrochen ist. #sprecher:erzaehler #musik:aus
* [„Mira. Atme.“]
    ~ atmeGesagt = true
    Sie starrt dich an. #sprecher:erzaehler #musik:atme
    Er hat richtig geopfert und dann Angst gekriegt, hast du gesagt. Die Stellung ist noch nicht verloren. Guck hin. Zähl. #sprecher:erzaehler
    Mira zieht die Hand zurück und setzt sich auf ihre Finger. Sie sieht hin, lange, die Zunge zwischen den Zähnen. #sprecher:erzaehler #musik:mira.held
* [Schweigen]
    Du sagst nichts. Ihre Hand zieht. #sprecher:erzaehler #musik:desertSprings.clubkampf
- -> END

=== mira_nach_niederlage ===
Ich hab gewonnen. Das Opfer war richtig. Noch mal? #sprecher:mira
* [„Noch mal.“]
    ~ beginnePartie("desertSprings.clubkampf")
    -> END
* [„Nicht jetzt.“]
    -> END

=== mira_nach_sieg ===
// Kapitel 46: Fanfare, dann Miras „Noch mal. Jetzt.“ ohne Musik (S61).
~ clubkampfDesertSpringsNadel = nadelDesertSprings
{ausgangDesertSpringsClubkampf == "remis":
    Remis. Langweilig. Aber gut gespielt. #sprecher:mira
- else:
    Am Ende gibt sie dir die Hand. Ihre ist klebrig. #sprecher:erzaehler #klang:fanfare
    Du hast mich geschlagen. #sprecher:mira
}
Noch mal. Jetzt. #sprecher:mira #musik:aus #pause:3
Morgen. #sprecher:tomas
Jetzt! #sprecher:mira
Mira. #sprecher:tomas
Sie verschränkt die Arme. Dann drückt sie dir widerwillig den Kupferkaktus in die Hand. #sprecher:erzaehler
{atmeGesagt: -> warum_atme ->}
-> END

= warum_atme
Du hast gesagt: Atme. Warum? Ich hätte verloren. Schneller. #sprecher:mira
* [„Weil mir jemand erzählt hat, was sonst passiert.“]
- Sie versteht es nicht. Sie wird es verstehen. In zehn Jahren, oder in hundertsechzig. #sprecher:erzaehler
Ambrose sagt nichts. Aber er sieht dich an, wie er dich noch nie angesehen hat. #sprecher:erzaehler
->->

=== mira_alltag ===
{~Im Canyon antwortet das Echo. Am Brett nicht. Deshalb mag ich das Brett.|Opfer sind schöner als Recht haben.|Warum hat das Huhn die Straße überquert? Um den König zu schützen.} #sprecher:mira
+ {nadelDesertSprings > 0 and not erinnerung1858Besprochen} [„Ambrose, zeig sie mir. Die siebte von 1858.“]
    -> mira_erinnerung
+ {nadelDesertSprings > 0 and nadelDesertSprings < 3} [„Revanche um eine bessere Nadel?“]
    Jetzt. #sprecher:mira
    ~ beginnePartie("desertSprings.clubkampf")
    -> END
+ [„Bis später, Mira.“]
    -> END

// ---------------------------------------------------------------- Erinnerung 1858 (Szene 77)

=== mira_erinnerung ===
// Kapitel 45 (Roman): die siebte Partie von 1858 auf dem Klapptisch. Musik: die Erinnerung von
// Cedar Creek gedämpft; bei den drei fahrigen Zügen stolpert sie (ambrose.stolpert), S58.
Abend in der Garage. Grillen, ein Radio aus dem Motel. Mira hockt auf einem Reifenstapel, isst Kekse und tut, als höre sie nicht zu. #sprecher:erzaehler #geraeusch:garage
Ich habe sie niemandem gezeigt. Man hat nur das Ergebnis gedruckt. #sprecher:ambrose #stimmung:alt
* [„Er hat geschrieben, es war Mut.“]
- Er war höflich. #sprecher:ambrose
* [„Er war nie höflich. Er war unerträglich.“]
- Das sitzt. Auf dem Klapptisch, zwischen einer Zündkerze und einer Keksdose, liegt die Stellung. #sprecher:erzaehler #musik:ambrose.stolpert #erinnerung #bild:stellung1858
Weiß steht gut. Der Bauer, den man nehmen und nach Hause gehen konnte. Und daneben die offene Linie. #sprecher:erzaehler
Da. Dorthin der Turm. Jetzt du, für Schwarz. Such, was er gesucht hat. #sprecher:ambrose
Du weißt, dass es ihn gibt: den stillen Zug. Den Läufer, ein Feld zurück. Er deckt alles. #sprecher:erzaehler
Bemerkenswert unnötig. #sprecher:ambrose #stimmung:still
Er zeigt dir, was er danach spielte. Ein Schach, das nichts bringt. Ein Rückzug. Ein zweites Schach. #sprecher:erzaehler #klang:figuren_kippen
Ich wusste, dass ich mich verrechnet hatte. Dass alle es gesehen hatten. Ich wollte nur noch, dass es vorbei ist. #sprecher:ambrose #pause:2 #bild:aus #erinnerung:aus
Du siehst auf die Stellung nach dem Läuferzug. Bevor er fahrig wurde. Du zählst. #sprecher:erzaehler
* [Die Stellung von 1858 spielen]
    Du spielst Weiß. Gegen Hale, wie er damals saß. #sprecher:erzaehler
    ~ beginnePartie("desertSprings.erinnerung1858")
    -> END
* [„Ein andermal.“]
    Ich habe hundertsechzig Jahre gewartet. Ein Abend mehr schadet nicht. #sprecher:ambrose
    -> END

=== mira_nach_erinnerung ===
// Kapitel 45, Schluss: Miras Motiv bricht herein; Ambroses Lachen ohne Musik, lang (S59);
// dann sein Thema rein (ambrose.rein), zum ersten Mal ohne den fremden Ton.
~ erinnerung1858Besprochen = true
Du hast mehr Angreifer am König. Springer, Läufer, die Dame, ein Bauer. Gegen einen Läufer und einen fernen Turm. #sprecher:erzaehler
Das Opfer war richtig! #sprecher:mira #musik:mira
Mira ist vom Reifenstapel gesprungen, den Mund voll Keks. Das Brett aus Licht sieht sie nicht, aber du hast die Stellung daneben mitgebaut. #sprecher:erzaehler
Der Turm ist richtig da! Der Läufer geht zurück, na und? Dann kommt die Dame rüber, und der Bauer läuft. Das gewinnt. #sprecher:mira
Wer hat das gespielt? #sprecher:mira
* [„Ein Bekannter.“]
- Der hat aber danach gezögert. Das hier ist Quatsch. Das ist Angst. #sprecher:mira
Er hat richtig geopfert und dann Angst gekriegt. Sag ihm das. #sprecher:mira
Ambrose sitzt auf einem Ölkanister. Zum dritten Mal in seinem Tod. #sprecher:erzaehler #musik:aus
Es hat gestimmt. Es hat die ganze Zeit gestimmt. #sprecher:ambrose #stimmung:still
Ich hätte das Match gewonnen. Wenn ich nach seinem Läuferzug einmal durchgeatmet und gezählt hätte. #sprecher:ambrose
Ich habe geglaubt, mein Fehler sei der Mut gewesen. Mein Fehler kam danach. Als ich aufhörte, daran zu glauben. #sprecher:ambrose
Er beginnt zu lachen. Das Lachen vom Steg, nur lauter. Er lacht, bis er sich die Seiten hält, die er nicht hat. #sprecher:erzaehler #stimmung:lachtOhneSpott #pause:6
Hundertsechzig Jahre, und ein Kind mit Keksen sagt es mir. Im Vorbeigehen. In einer Garage. #sprecher:ambrose #stimmung:lachtOhneSpott
* [„Sie hat dich nicht mal gesehen.“]
- Das macht es schlimmer! #sprecher:ambrose #stimmung:lacht
Mira sieht herüber, ob ihr verrückt geworden seid, und entscheidet, dass es sie nichts angeht. #sprecher:erzaehler #musik:ambrose.rein
Als es still ist, sagt er noch etwas. #sprecher:erzaehler
Hale hat es gewusst. Deshalb hat er „unnötig“ gesagt, nicht „falsch“. Er war immer genau mit Worten. #sprecher:ambrose
Er wusste, dass er eine verlorene Partie gewonnen hatte, weil der andere die Nerven verlor. Das hätte mich auch nicht schlafen lassen. #sprecher:ambrose #stimmung:still
-> END

// ---------------------------------------------------------------- Tomás

=== tomas ===
{
- not versoehnungGesehen: -> garage_wartet
- not reiheTomasBestanden: -> tomas_reihe
- else: -> tomas_alltag
}

=== tomas_reihe ===
{not tomasGetroffen: -> tomas_erstes_treffen ->}
Sie opfert. Immer. Wenn du nicht weißt, wie ein Matt nach einem Opfer aussieht, bist du in zwölf Zügen fertig. #sprecher:tomas
* [„Zeig her.“]
    ~ beginneAufgaben("desertSprings.reiheTomas")
    -> END
* [„Nicht jetzt.“]
    Kein Problem. Das Auto wartet auch. #sprecher:tomas
    -> END

=== tomas_erstes_treffen ===
~ tomasGetroffen = true
Ein Auto auf der Hebebühne, Werkzeug an der Wand, zwischen Ölkanistern drei Klapptische. Unter dem Auto ragen Stiefel hervor. #sprecher:erzaehler #geraeusch:garage
Mira ist im Canyon. Die kommt, wenn es dunkel wird. #sprecher:tomas
Er rollt heraus, einen Schraubenschlüssel in der Hand. Ich bin Tomás. Der Bruder, der Club und die Aufsicht. #sprecher:tomas
Auf dem Regal über der Werkbank glänzt ein Pokal. Aus einer Limonadendose, aufgeschnitten, gebogen, mit Draht. #sprecher:erzaehler #bild:dosenpokal
Den hat sie selbst gemacht. Mit sechs. In der Zeitung war ein Typ aus Riverton mit einem ganzen Regal davon. #sprecher:tomas
Sie hat gesagt: Wenn der das darf, darf sie das auch. #sprecher:tomas
Du denkst an einen Wohnwagen unter einer Brücke. „Ich hab seit März keinen neuen.“ Du machst ein Foto. Du weißt, wem du es schickst. #sprecher:erzaehler #bild:aus
->->

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
{not dotGetroffen: -> dot_margaret ->}
Erst Tomás, Liebes. Ich bin danach dran. #sprecher:dot
-> END

// Kapitel 43 (Roman): Dots Weltkarte und Margaret aus Maple Falls. Das Thema von Maple Falls
// klingt drei Takte wie aus der Ferne (Klangplan).
=== dot_margaret ===
~ dotGetroffen = true
~ margaretErzaehlt = true
Dot ist siebzig und trägt am Nachmittag Lockenwickler. Hinter der Motel-Theke hängt eine Weltkarte voller Nadeln. #sprecher:erzaehler #geraeusch:motel
Von jeder Nadel läuft ein Faden zu einer Postkarte. #sprecher:erzaehler #bild:weltkarte_nadeln
Fernschach. Fünfzig Jahre. Einer in Reykjavík braucht vier Monate für einen Zug, der fährt zur See. #sprecher:dot
Eine in Kapstadt schummelt, glaube ich. Aber charmant. #sprecher:dot
Sie tippt auf eine Nadel im Nordosten. Daran hängt kein Faden mehr. #sprecher:erzaehler #bild:aus
Hier hatte ich eine, vierzig Jahre lang. Margaret. Aus einem Kaff mit einem Wasserfall. Ich hab sie nie gesehen. #sprecher:dot #musik:mapleFalls
Im letzten Brief schrieb sie, sie räumt jetzt auf. Dann kam nichts mehr. Wir waren im einunddreißigsten Zug. #sprecher:dot
Ich stand besser. Ich sag das nicht gern, wenn jemand nicht mehr widersprechen kann. #sprecher:dot
* [„Sie hat ein Brett abgestaubt. Sechzig Jahre lang.“]
- Dot sieht dich an. Du kommst aus dem Kaff. #sprecher:dot
* [„Ich wohne in ihrem Haus.“]
- Sie nimmt die Lesebrille ab und setzt sie wieder auf. Dann legt sie einen Stapel Postkarten hin. Oben ein Wasserfall. #sprecher:erzaehler #bild:postkarten_wasserfall
Dann weißt du vielleicht, was sie gezogen hätte. #sprecher:dot #bild:aus
An meinem Tisch. Vierzig Jahre. Mit dieser Frau. #sprecher:ambrose #stimmung:riss #musik:desertSprings
->->

=== dot_reihe ===
{not dotGetroffen: -> dot_margaret ->}
Ich spiele seit fünfzig Jahren per Post. Ein Zug pro Woche, aber jeder sitzt. #sprecher:dot
Meine Aufgaben greifen den König an. Langsam, Liebes, wie ein Brief. #sprecher:dot
* [„Ich bin bereit.“]
    ~ beginneAufgaben("desertSprings.reiheDot")
    -> END
* [„Nicht jetzt.“]
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

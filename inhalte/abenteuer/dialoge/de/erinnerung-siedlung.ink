// Erinnerung: Die letzte Kerze, 1866 (Akt 4, Szene 99 der Story-Bibel; Roman Kapitel 57; Ort
// erinnerungSiedlung, Sepia, Ambrose als Held). Das Zimmer über dem Laden mit der Rosentapete,
// Gideon der Schmied, eine Kerze, das Brett.
//
// Ambrose schreibt die letzten vier Züge der Fernpartie (37. Txd7 bis 40. Kxg3, Bibel Abschnitt 35)
// in den Brief. Weil die Fernpartie nicht in der Klassikersammlung steht, rät der Held die Züge als
// Wahl im Dialog; jeder falsche Tipp wird freundlich berichtigt. Keine Einzelheiten zum Sterben: die
// Kerze geht aus, Szenenwechsel (Stilregel 5.3).
// Einstiege wie in orte.json: postreiter, kerze, rueckkehr.
//
// Variablen: kerzeGesehen (für ghost-town-saloon.ink) und die Zählung setzt diese Datei.

VAR kerzeGesehen = false
VAR kerzeRichtig = 0

// Gideon sitzt an der Bettkante (Figur erinnerungSiedlung.gideon, Gutachten M3.3). Der Postreiter
// wartet unten und ist nicht zu sehen.
=== gideon ===
{kerzeGesehen:
    Gideon hält das Brett auf den Knien. Er rührt die Figuren nicht an. #sprecher:erzaehler
    -> END
}
-> kerze

// Kapitel 57 (Roman): Erinnerung bei Kerzenlicht (Klangplan S72: nur Kerze, Atem, Feder;
// Ambroses Thema fehlt bis zum Königszug, dann ambrose.1866). {held} rät die vier Züge mit;
// jeder falsche Tipp wird freundlich berichtigt.
=== kerze ===
{kerzeGesehen:
    Die Kerze ist heruntergebrannt. Auf dem Tisch liegt kein Brief mehr. #sprecher:erzaehler
    -> END
}
~ kerzeRichtig = 0
Das Mondlicht wird gelb. Es ist eine Kerze, weit heruntergebrannt. Die Rosen an der Wand tanzen im Flackern. #sprecher:erzaehler #erinnerung #musik:kerzenton #geraeusch:feder
Meine Hände liegen auf einer Decke. Sie sind sehr dünn. Es tut nichts weh. Das Fieber ist gerade fort, wie die Flut fortgeht. #sprecher:ambrose #stimmung:jung
Auf dem Stuhl neben dem Bett steht das Brett. Jemand hat die Fäden gelöst. Die Figuren stehen frei. #sprecher:erzaehler
Neben dem Brett ein aufgerissener Brief. Eine Zeile, senkrecht wie ein Zaun: „39. … Dame schlägt g3, Schach.“ #sprecher:erzaehler #bild:zettel_39
Er hat also gezogen. Sein Zug ist mir nachgereist, elf Tage durch den Schnee, bis in ein Zimmer mit Rosen. #sprecher:ambrose #stimmung:jung #bild:aus
Mister? #sprecher:gideon
In der Tür steht ein großer Mann mit Lederschurz und Armen wie Balken. Er trägt eine Schüssel, als wäre sie aus Glas. #sprecher:erzaehler
Gideon. Stell es hin. Setz dich. Sieh her. Ich zeige dir, wie die Partie hierhergekommen ist. Nur die letzten Züge. Rate mit. #sprecher:ambrose #stimmung:jung
-> zug37

=== zug37 ===
Der 37. Zug. Sein Turm steht auf d7. Was habe ich gespielt? #sprecher:ambrose #stimmung:jung
* [37. Txd7]
    ~ kerzeRichtig = kerzeRichtig + 1
    Ja. Der Turm geht auf die siebte Reihe und holt alles dort ab. #sprecher:ambrose #stimmung:jung
* [37. Dc4+]
    Dann schlägt der Springer von a5 meine Dame. Ich nahm: 37. Txd7. #sprecher:ambrose #stimmung:jung
* [37. Dxa5]
    Der Springer ist gedeckt. Ich nahm: 37. Txd7. #sprecher:ambrose #stimmung:jung
- Seine Dame fährt in meine Stellung und nimmt einen Bauern. 37… Dxf2. Grob, gierig, ganz unähnlich dem Mann, der sie führt. #sprecher:erzaehler
-> zug38

=== zug38 ===
Der 38. Zug. Meine Dame muss zurück zum König. #sprecher:ambrose #stimmung:jung
* [38. Da3]
    ~ kerzeRichtig = kerzeRichtig + 1
    Ja. Ein stilles Feld. Über a3 kommt sie nach g3. #sprecher:ambrose #stimmung:jung
* [38. Td8+]
    Ein Schach ins Leere. Ich zog: 38. Da3. #sprecher:ambrose #stimmung:jung
* [38. Dxc6]
    Zu gierig, dann jagt seine Dame meinen König. Ich zog: 38. Da3. #sprecher:ambrose #stimmung:jung
- Sein Springer kommt herüber. 38… Sc4. #sprecher:erzaehler
Und jetzt? #sprecher:gideon
-> zug39

=== zug39 ===
Der 39. Zug. Jetzt gebe ich Schach. Mit der Dame. #sprecher:ambrose #stimmung:jung
* [39. Dg3+]
    ~ kerzeRichtig = kerzeRichtig + 1
    Ja. Mit Schach. #sprecher:ambrose #stimmung:jung
* [39. Dxa7]
    Ein Bauer, aber seine Dame bleibt. Ich zog: 39. Dg3+. #sprecher:ambrose #stimmung:jung
* [39. Td8+]
    Der König geht nach g7, und nichts ist gewonnen. Ich zog: 39. Dg3+. #sprecher:ambrose #stimmung:jung
- Dann nimmt er sie doch. #sprecher:gideon
Ja. Dann nimmt er sie. Er tauscht immer, wenn er kann. Ich habe es trotzdem gespielt, weil es richtig war. #sprecher:ambrose #stimmung:jung
Zum ersten Mal in meinem Leben wollte ich nicht gewinnen, bevor es so weit war. #sprecher:ambrose #stimmung:jung
Auf dem Brett steht seine Dame neben meinem König. 39… Dxg3+. #sprecher:erzaehler
-> zug40

=== zug40 ===
Und dann? #sprecher:gideon
Der 40. Zug. Mein letzter. #sprecher:ambrose #stimmung:jung #pause
* [40. Kxg3]
    ~ kerzeRichtig = kerzeRichtig + 1
    Der König schlägt zurück. #sprecher:ambrose #stimmung:jung
* [40. Kh1]
    Der König in die Ecke? Nein. Der König schlägt zurück: 40. Kxg3. #sprecher:ambrose #stimmung:jung
* [40. Kg1]
    Dann bleibt die Dame stehen. Der König schlägt zurück: 40. Kxg3. #sprecher:ambrose #stimmung:jung
- Der König? Der schlägt doch nicht. Der versteckt sich. #sprecher:gideon
Das habe ich auch immer gedacht. #sprecher:ambrose #stimmung:jung
Er ist schwer, unten mit Blei ausgegossen, das Kreuz auf der Krone ein bisschen schief. Ein Schritt nach vorn, aus der Ecke heraus, ins Freie. #sprecher:erzaehler #musik:ambrose.1866
Ein kleiner Zug. Der einzige, den es gab. Jedes Kind hätte ihn gefunden. #sprecher:ambrose #stimmung:jung
-> letzter_brief

=== letzter_brief ===
~ kerzeGesehen = true
Gideon hält das Blatt. Die Feder kratzt. Zweimal muss ich absetzen. #sprecher:erzaehler
„40. König schlägt g3.“ #sprecher:erzaehler #pause
Darunter wollte ich schreiben, dass ich ihm verziehen habe. Irgendwann um den zwanzigsten Zug, ohne es zu merken. Die Hand tut es nicht mehr. #sprecher:ambrose #stimmung:jung
Gib es dem Postreiter. Bring ihn nach Norden. Er wartet. #sprecher:ambrose #stimmung:jung
Wer? #sprecher:gideon
Ein unerträglicher Mann. Der beste Gegner, den ich hatte. #sprecher:ambrose #stimmung:jung
Und das Brett, Mister? Wem soll ich es geben? #sprecher:gideon
Meiner Schwester. Claire. Die Adresse steht innen im Deckel. Und die Stellung rührt niemand an. Er ist dran. #sprecher:ambrose #stimmung:jung
Stiefel auf der Treppe, schwer, Stufe um Stufe. Unten ein Pferd. Hufe, die sich entfernen. #sprecher:erzaehler #klang:stiefel_pferd #geraeusch:aus
Es ist still. Sehr schön still. #sprecher:erzaehler #musik:aus
Die Flamme wird klein. Sie wird blau. #sprecher:erzaehler
Sie geht aus. #sprecher:erzaehler #pause:2
-> END

=== rueckkehr ===
// Rückkehr ohne Musik ins leere Zimmer über dem Laden (Kapitel 57, Schluss).
{not kerzeGesehen:
    Die Kerze brennt noch. Du gehst zurück in die Nacht von Ghost Town. #sprecher:erzaehler #erinnerung:aus
    -> END
}
Mondlicht. Die Farben kehren zurück, und deine Hände sind deine. Sie sind nass. #sprecher:erzaehler #erinnerung:aus
Ambrose steht am Fenster und sieht die Straße hinunter, nach Norden. #sprecher:erzaehler
* [„Er ist angekommen. Hale hat es aufgeschrieben.“]
- Ja. Gideon hat alles getan, worum ich ihn gebeten habe. #sprecher:ambrose #stimmung:still
Er hat das Brett nach Maple Falls geschickt. Er hat einen Stein behauen. Er hat einem Fremden drei Tage die Stirn gekühlt. #sprecher:ambrose
Hundertsechzig Jahre habe ich an Hale gedacht. Jeden Tag. Und nicht ein einziges Mal an den Schmied. #sprecher:ambrose
Nicht auf den Falschen gewartet. Das ist ungerecht. Aber nur auf den einen. #sprecher:ambrose #stimmung:friedlich
Morgen spielt ihr sie zu Ende. Du und der junge Hale. Ich sehe zu. Das ist schöner, als ich dachte. #sprecher:ambrose #stimmung:friedlich
-> END

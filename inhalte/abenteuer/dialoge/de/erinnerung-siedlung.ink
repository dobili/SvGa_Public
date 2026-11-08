// Erinnerung: Die letzte Kerze, 1866 (Akt 4, Szene 99 der Story-Bibel; Ort erinnerungSiedlung, Sepia,
// Ambrose als Held). Eine Bretterhütte der Bergbausiedlung, Fieber, eine Kerze, das Brett.
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

=== postreiter ===
{kerzeGesehen:
    Der Postreiter steckt den Brief in seine Tasche. „Nach Norden. Ich weiß.“ #sprecher:erzaehler
- else:
    Vor der Hütte wartet ein Postreiter neben seinem Pferd. „Der Brief, Sir? Ich reite bei Sonnenaufgang.“ #sprecher:erzaehler
}
-> END

=== kerze ===
{kerzeGesehen:
    Die Kerze ist heruntergebrannt. Auf dem Tisch liegt kein Brief mehr. #sprecher:erzaehler
    -> END
}
~ kerzeRichtig = 0
Eine Bretterhütte. Auf dem Tisch brennt eine Kerze, daneben das Brett und ein halb geschriebener Brief. #sprecher:erzaehler
Mir ist heiß und kalt zugleich. Aber die Partie wartet. Hale wartet. #sprecher:ambrose #stimmung:jung
Hale hat gerade mit der Dame auf f2 geschlagen. Mein König steht auf h2. Ich habe einen Turm auf d1. #sprecher:ambrose #stimmung:jung
-> zug37

=== zug37 ===
Der 37. Zug. Was schreibe ich? #sprecher:ambrose #stimmung:jung
* [37. Txd7]
    ~ kerzeRichtig = kerzeRichtig + 1
    Ja. Erst den Turm nehmen, der mich bedroht. #sprecher:ambrose #stimmung:jung
* [37. Dc4+]
    Dann schlägt der Springer von a5 meine Dame. Ich nahm: 37. Txd7. #sprecher:ambrose #stimmung:jung
* [37. Dxa5]
    Der Springer ist gedeckt. Ich nahm: 37. Txd7. #sprecher:ambrose #stimmung:jung
- Hale antwortete mit 37… Dxf2. Seine Dame dringt ein. #sprecher:erzaehler
-> zug38

=== zug38 ===
Der 38. Zug. Meine Dame muss zurück zum König. #sprecher:ambrose #stimmung:jung
* [38. Da3]
    ~ kerzeRichtig = kerzeRichtig + 1
    Ja. Über a3 kommt sie nach g3. #sprecher:ambrose #stimmung:jung
* [38. Td8+]
    Ein Schach ins Leere. Ich zog: 38. Da3. #sprecher:ambrose #stimmung:jung
* [38. Dxc6]
    Zu gierig, dann jagt seine Dame meinen König. Ich zog: 38. Da3. #sprecher:ambrose #stimmung:jung
- Hale antwortete mit 38… Sc4. #sprecher:erzaehler
-> zug39

=== zug39 ===
Der 39. Zug. Jetzt biete ich den Tausch der Damen an. #sprecher:ambrose #stimmung:jung
* [39. Dg3+]
    ~ kerzeRichtig = kerzeRichtig + 1
    Ja. Mit Schach, dann muss er tauschen. #sprecher:ambrose #stimmung:jung
* [39. Dxa7]
    Ein Bauer, aber seine Dame bleibt. Ich zog: 39. Dg3+. #sprecher:ambrose #stimmung:jung
* [39. Td8+]
    Der König geht nach g7, und nichts ist gewonnen. Ich zog: 39. Dg3+. #sprecher:ambrose #stimmung:jung
- Hale tauschte: 39… Dxg3+. #sprecher:erzaehler
-> zug40

=== zug40 ===
Der 40. Zug. Mein letzter. #sprecher:ambrose #stimmung:jung #pause
* [40. Kxg3]
    ~ kerzeRichtig = kerzeRichtig + 1
    Ja. Der König schlägt zurück und geht nach vorn. Im Endspiel ist er eine Figur. #sprecher:ambrose #stimmung:jung
* [40. Kh1]
    Der König in die Ecke? Ich schlug zurück: 40. Kxg3. #sprecher:ambrose #stimmung:jung
* [40. Kg1]
    Dann bleibt die Dame stehen. Ich schlug zurück: 40. Kxg3. #sprecher:ambrose #stimmung:jung
- -> letzter_brief

=== letzter_brief ===
~ kerzeGesehen = true
{kerzeRichtig == 4:
    Vier von vier. Du kennst meine Züge besser als ich. #sprecher:ambrose
- else:
    {kerzeRichtig} von vier. Die Partie gehört jetzt auch dir. #sprecher:ambrose
}
Ambrose faltet den Brief und schreibt außen: „J. Hale, im Norden“. #sprecher:erzaehler
Vor der Tür gibt er ihn dem Postreiter. „Bring ihn nach Norden. Er wartet.“ #sprecher:erzaehler
Drinnen flackert die Kerze. Dann geht sie aus. #sprecher:erzaehler #pause
-> END

=== rueckkehr ===
Die Farben kehren zurück. Du stehst wieder im Saloon, das Abzeichen in der Hand. #sprecher:erzaehler
-> END

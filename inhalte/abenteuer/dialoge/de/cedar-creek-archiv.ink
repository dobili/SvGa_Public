// Ort: Archiv im Keller der Stadtbibliothek von Cedar Creek (Akt 1). Gegenstände: Karton
// (Auslöser karton1858), Programmheft.
//
// Szenen der Story-Bibel (docs/spiel/05_Story_Bibel.md, Abschnitt 4): 18 Das Archiv (Hilfe-Quest
// cedarCreek.archivOrdnen), 19 1858 (akt1.erzaehlung1858, Hauptquest cedarCreek.archiv1858),
// 20 Erinnerung: New York, 1857 (Zugerraten der Partie klassik-paulsen-morphy, Runde
// cedarCreek.erinnerungNewYork). Einstiege wie in orte.json: „karton“, „programmheft“.
// Den Karton 1850–1859 gibt es nach dem Umräumen oder nach dem Clubkampf (Bibel, Szene 18).
// Ambrose erwähnt 1866 nicht und nennt Hales Vornamen nicht (Bibel, Szene 19).
// Runde 11 (Roman, Kapitel 12; Dialogprüfung B2, VC53 bis VC73): Ordnen als stilles Tragen mit
// einem Verlust; 1858 nach dem Roman (Abwehr, Saal, Turm, „Hat es gestimmt?“ – „Nein.“, der stille
// Läuferzug); „Später“ an den ersten Tag gebunden (ersterTagSpaeter aus maple-falls-dachboden.ink);
// nach der Erinnerung an New York nennt Ambrose {held} zum ersten Mal beim Namen
// (ambroseNenntNamen, Knoten name_im_archiv). In Akt 1 glaubt Ambrose, das Opfer sei falsch
// gewesen; die Auflösung kommt in Akt 3 (roman/akt1_befunde.md, Abschnitt 7).
// Klang nach 21_Klangplan.md (S14 bis S17); Bilder zeitung1858, stellung1858, erinnerungNewYork.
// Eine Porträtfassung „alt“ für Ambrose ab „Leg es weg“ gibt es noch nicht (bis dahin bitter).
//
// Variablen: erinnerungNewYorkBestanden und nadelCedarCreek setzt die Hülle
// (regeln/dialogvariablen.ts); die übrigen setzt Ink selbst.

EXTERNAL beginneAufgaben(runde)

VAR held = "Du"
VAR ambroseVertrauen = 0
VAR kenntHale = false
VAR okaforGetroffen = false
VAR archivGeordnet = false
VAR ordnenAngeboten = false
VAR erzaehlung1858Gesehen = false
VAR erinnerungNewYorkBestanden = false
VAR nadelCedarCreek = 0
VAR ersterTagSpaeter = false
VAR ambroseNenntNamen = false
VAR newYorkBesprochen = false

// ---------------------------------------------------------------- Karton

=== karton ===
{
- not okaforGetroffen: -> karton_fremd
- not archivGeordnet and (nadelCedarCreek == 0 or ordnenAngeboten): -> ordnen
- not erzaehlung1858Gesehen: -> karton_1858
- else: -> karton_alltag
}

=== karton_fremd ===
Kartons, Kartons, Kartons. Manche sind nass. #sprecher:erzaehler
Ohne Erlaubnis öffnest du hier lieber nichts. #sprecher:erzaehler
Frag oben die Dame mit dem Buch. Das gebietet der Anstand. #sprecher:ambrose
-> END

=== ordnen ===
// Wer einmal „Nicht jetzt“ gesagt hat, darf auch nach der Clubnadel noch ordnen (Quest
// cedarCreek.archivOrdnen beginnt hier; Befund der Gesamtsimulation).
~ ordnenAngeboten = true
Eine Wendeltreppe hinunter. Es riecht nach Büchern, die nass geworden sind. #sprecher:erzaehler
Eine einzige Lampe hängt am Kabel von der Decke. Sie flackert. #sprecher:erzaehler
Da bist du ja. Links das neunzehnte Jahrhundert, rechts das zwanzigste. Wo der Boden trocken ist. #sprecher:okafor
* [Anfangen]
    -> ordnen_wahl
* [Nicht jetzt]
    Kein Problem. Die Pfütze läuft nicht weg. Leider. #sprecher:okafor
    -> END

=== ordnen_wahl ===
Sie liest die Jahreszahlen vor. „1972.“ #sprecher:erzaehler
* [Nach links]
    Rechts. #sprecher:okafor
* [Nach rechts]
    Gut. #sprecher:okafor
- Ein Karton ist so durchweicht, dass der Boden nachgibt. Zeitungen rutschen heraus, braun und weich wie Herbstlaub. #sprecher:erzaehler
* [Sie aufheben]
* [Liegen lassen]
- Lass. Die sind verloren. Man kann nicht alles retten. #sprecher:okafor
Sie sagt es ruhig. Aber sie hebt trotzdem jede einzelne auf. #sprecher:erzaehler #pause:2
Der letzte Karton steht ganz hinten auf einem Regal. Auf ihm steht „1850 bis 1859“. Er ist trocken geblieben. #sprecher:erzaehler
* [Vorsichtig auf den Tisch stellen]
* [Unter die Lampe tragen]
- -> ordnen_fertig

=== ordnen_fertig ===
~ archivGeordnet = true
Bei uns sagte man: Wer nur auf seinen Weg schaut, fällt in das Loch daneben. #sprecher:okafor
Ich habe den Kalender gelesen und nie in den Karton daneben geschaut. #sprecher:okafor
Ich muss nach oben. Prudence schließt sonst die Kasse falsch ab. Du findest dich zurecht. #sprecher:okafor
Ihre Schritte auf der Wendeltreppe. Dann nichts mehr. #sprecher:erzaehler #pause:2
* [Den Karton öffnen]
    -> karton_1858
* [Nicht jetzt]
    -> END

// ---------------------------------------------------------------- 1858

=== karton_1858 ===
Im Karton liegt eine Zeitung. Vier Seiten, dünn, die Schrift so klein, dass sie vor den Augen schwimmt. #sprecher:erzaehler
„Crescent City Herald“, Mai 1858. Darunter ein Schachkalender und ein Heft. #sprecher:erzaehler
-> erzaehlung_1858

=== erzaehlung_1858 ===
~ erzaehlung1858Gesehen = true
Auf der dritten Seite, zwischen einer Anzeige für Schiffspassagen und dem Preis für Baumwolle, steht ein Absatz. #sprecher:erzaehler
„Mr. Hale, Ingenieur, schlägt Mr. Whitlock im Match, vier zu drei.“ #sprecher:erzaehler #bild:zeitung1858 #klang:zeitung
„Mr. Whitlocks Opfer im letzten Spiel wird noch lange besprochen werden. Mr. Hale nannte es ‚bemerkenswert unnötig‘.“ #sprecher:erzaehler #musik:aus #pause:3
Du liest es zweimal. #sprecher:erzaehler
Leg es weg. #sprecher:ambrose #stimmung:bitter #pause:2
Er steht neben dem Tisch, im Lichtkegel. Zum ersten Mal sieht er alt aus. #sprecher:erzaehler
* [„Du hast gesagt, es gibt viele Hales.“]
    Es gibt viele. #sprecher:ambrose
    Die Lampe flackert. Irgendwo tropft Wasser. #sprecher:erzaehler #pause:2
* [„Ambrose.“]
    Die Lampe flackert. Irgendwo tropft Wasser. #sprecher:erzaehler #pause:2
- Vier zu drei. Sieben Partien, in einem Saal über einem Kaffeehaus, und die halbe Stadt stand auf der Treppe. #sprecher:ambrose #musik:ambrose.erinnerung
Ich war siebenundzwanzig und der Beste, den sie hatten. Ich wusste es. Das war das Unglück. #sprecher:ambrose
* [„Und der andere?“]
    Ein Ingenieur, Brückenbauer aus dem Norden. Er spielte, wie man eine Brücke baut. #sprecher:ambrose
    Jeder Stein auf den anderen. Nichts Überflüssiges, nichts Schönes. Ich fand ihn unerträglich. #sprecher:ambrose
* [Ihn erzählen lassen]
    Er beginnt, auf und ab zu gehen. Drei Schritte, die Wand, drei Schritte zurück. #sprecher:erzaehler
- In der siebten stand ich auf Gewinn. Ein Kind hätte sie gewonnen. Einen Bauern nehmen und nach Hause gehen. #sprecher:ambrose
Aber ich sah ein Opfer. Einen Turm, mitten in seine Stellung. Ich wusste nicht einmal, ob es stimmte. #sprecher:ambrose
* [„Warum hast du es gespielt?“]
    Weil die Leute auf der Treppe standen. Ich wollte, dass sie in hundert Jahren noch davon reden. #sprecher:ambrose
    ** [„Hat es gestimmt?“]
        -> erzaehlung_1858_nein
* [„Hat es gestimmt?“]
    -> erzaehlung_1858_nein

=== erzaehlung_1858_nein ===
Nein. #sprecher:ambrose #pause:3
Das Wort bleibt im Raum. #sprecher:erzaehler
Es gab eine Verteidigung. Einen einzigen stillen Zug. Er brauchte vierzig Minuten. #sprecher:ambrose
Er sah mich nicht an dabei. Dann stellte er einen Läufer ein Feld zurück, und alles fiel zusammen. #sprecher:ambrose #bild:stellung1858
Bemerkenswert unnötig. Er hatte recht. Das habe ich ihm nie verziehen. #sprecher:ambrose #stimmung:bitter
* [„Das ist wie bei mir gegen Victor.“]
    Nein. Du hattest eine verlorene Stellung. #sprecher:ambrose
    Ich hatte eine gewonnene und habe sie verschenkt. #sprecher:ambrose
* [Nichts sagen]
- Ich habe Revanche verlangt. Im Jahr darauf, in einem langen Brief. Er schrieb zurück. Ein Wort. #sprecher:ambrose
* [„Welches?“]
* [Warten]
- Später. #sprecher:ambrose #stimmung:bitter #klang:spaeter #musik:aus #geraeusch:aus #pause:2
{ersterTagSpaeter: Du hast es am ersten Tag zu ihm gesagt, auf dem Dachboden, ohne nachzudenken. Er hat so seltsam geantwortet. #sprecher:erzaehler}
* {kenntHale} [„Hale wie Victor?“]
    ~ ambroseVertrauen = ambroseVertrauen + 1
    Hale wie viele. #sprecher:ambrose
    Aber er sieht dich an dabei. Er weiß es nicht. Und er hat Angst, es zu wissen. #sprecher:erzaehler
* [Schweigen]
    ~ ambroseVertrauen = ambroseVertrauen + 1
    Er sieht dich an. Er sagt nichts mehr. #sprecher:erzaehler
- -> END


=== karton_alltag ===
{~Der Karton mit den Jahren 1850 bis 1859 steht trocken im Regal. Die Zeitung liegt obenauf.|Bemerkenswert unnötig. Ich höre es noch.} #sprecher:ambrose
-> END

// ---------------------------------------------------------------- Programmheft

=== programmheft ===
{
- not erzaehlung1858Gesehen: -> programmheft_zu
- erinnerungNewYorkBestanden: -> programmheft_danach
- else: -> erinnerung
}

=== programmheft_zu ===
Ein dünnes, vergilbtes Heft. Es liegt in einem Karton, den du noch nicht öffnen sollst. #sprecher:erzaehler
-> END

=== erinnerung ===
„Erster Amerikanischer Schachkongress. New York, 1857.“ Ein Programmheft mit einem Adler auf dem Umschlag. #sprecher:erzaehler #bild:erinnerungNewYork
Ambrose macht ein Geräusch, das du von ihm nicht kennst. #sprecher:erzaehler
Ich war dort. Ich stand in der dritten Reihe. #sprecher:ambrose #stimmung:stolz #musik:ambrose.walzer
Ein Junge aus meiner Stadt spielte gegen einen Meister aus dem Westen, Paulsen. Der Junge hieß Morphy. #sprecher:ambrose
Er saß da, als ginge ihn das alles nichts an, und sah aus dem Fenster. #sprecher:ambrose
Setz dich. Du spielst seine Züge. Ich sage dir nichts. #sprecher:ambrose
* [„Los geht's.“]
    ~ beginneAufgaben("cedarCreek.erinnerungNewYork")
    -> END
* [„Später.“]
    Später. Ausgerechnet heute. Nun gut. #sprecher:ambrose #stimmung:bitter
    -> END

=== programmheft_danach ===
{newYorkBesprochen:
    Das Programmheft. Die Ecken sind weich vom Anfassen. #sprecher:erzaehler
    -> END
}
~ newYorkBesprochen = true
Er opferte seine Dame, und ich vergaß zu atmen. Dreihundert Leute, und man hätte eine Nadel fallen hören. #sprecher:ambrose #stimmung:stolz #musik:aus #pause:2
Siehst du? Das. Das ist Schach. Nicht dieses Zählen. #sprecher:ambrose #musik:ambrose.walzer
* [„Gestern hast du gesagt, Zählen ist alles.“]
    Er fährt herum. Er sucht nach einer Antwort und hat keine. #sprecher:erzaehler #pause:2
    Das habe ich gesagt. #sprecher:ambrose #stimmung:still
    ** [„Was stimmt denn nun?“]
        Er sieht auf das Brett aus Licht. Dann auf die Zeitung. Vier zu drei. #sprecher:erzaehler
        Wenn ich das wüsste, säße ich vielleicht nicht in einer Kiste. #sprecher:ambrose
    ** [Nichts sagen]
* [„Das war wunderschön.“]
    Ja. #sprecher:ambrose
- -> name_im_archiv

// Runde 11 (VC73, Roman Kapitel 12, Schluss): Ambrose nennt {held} zum ersten Mal beim Namen.
=== name_im_archiv ===
{ambroseNenntNamen: -> END}
~ ambroseNenntNamen = true
Über dir schlägt die Uhr. Sieben Mal. Du legst die Zeitung zurück, das Programm obenauf. #sprecher:erzaehler #klang:turmuhr7 #musik:aus
Als du den Deckel schließen willst, sagt er: #sprecher:erzaehler
{held}. #sprecher:ambrose #pause:2
Er hat dich noch nie beim Namen genannt. Immer nur „Kind“. Oder „Lehrling“. #sprecher:erzaehler
* [„Ja?“]
* [Den Deckel offen lassen]
- Ich habe das noch niemandem erzählt. #sprecher:ambrose
Er sieht zur Wendeltreppe. #sprecher:erzaehler
Es gab allerdings auch niemanden. #sprecher:ambrose #musik:karte
-> END


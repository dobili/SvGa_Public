// Ort: Archiv im Keller der Stadtbibliothek von Cedar Creek (Akt 1). Gegenstände: Karton
// (Auslöser karton1858), Programmheft.
//
// Szenen der Story-Bibel (docs/spiel/05_Story_Bibel.md, Abschnitt 4): 18 Das Archiv (Hilfe-Quest
// cedarCreek.archivOrdnen), 19 1858 (akt1.erzaehlung1858, Hauptquest cedarCreek.archiv1858),
// 20 Erinnerung: New York, 1857 (Zugerraten der Partie klassik-paulsen-morphy, Runde
// cedarCreek.erinnerungNewYork). Einstiege wie in orte.json: „karton“, „programmheft“.
// Gutachten Teil K (13.11.2026): Oktober 1858 (K1.1), „Gleich.“ statt „Später.“ (K1.5), die Reibung
// nach New York in beiden Zweigen; programmheft_danach startet nach der Runde von selbst
// (runden.json „danach“, K1.7), Hale und Treppe im Stamm (K1.8).
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

VAR rivalin = false
VAR rivale = "Victor"
VAR rv_er = "er"
VAR rv_Er = "Er"
VAR rv_ihn = "ihn"
VAR rv_Ihn = "Ihn"
VAR rv_ihm = "ihm"
VAR rv_Ihm = "Ihm"
VAR rv_sein = "sein"
VAR rv_Sein = "Sein"
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
// Ausgang der Partie gegen Victor (setzt die Hülle): Der Vergleich „wie bei mir gegen Victor“
// passt nur nach einer Niederlage (Dialogprüfung, 17.11.2026).
VAR ausgangMapleFallsVictor = ""
// Aus capital-arena-aussen.ink: Nach dem Abschied (Szene 109) spricht Ambrose nicht mehr
// (Story-Bibel Abschnitt 33, Frage 5; Entscheidung Q21-5). Hier nur gelesen.
VAR abschiedGesehen = false

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
Frag oben die Dame mit dem Buch. Das gebietet der Anstand. #sprecher:ambrose #stimmung:nachdenklich
-> END

=== ordnen ===
// Wer einmal „Nicht jetzt“ gesagt hat, darf auch nach der Clubnadel noch ordnen (Quest
// cedarCreek.archivOrdnen beginnt hier; Befund der Gesamtsimulation).
~ ordnenAngeboten = true
// Anwesenheit (25.11.2026): Mrs. Okafor sprach hier, stand aber oben im Lesesaal. Jetzt wartet sie
// im Archiv unten an der Treppe (cedarCreek.okaforArchiv), bis es geordnet ist.
Es riecht nach Büchern, die nass geworden sind. Eine einzige Lampe hängt am Kabel von der Decke. Sie flackert. #sprecher:erzaehler
Mrs. Okafor steht unten an der Treppe, die Brille in die Stirn geschoben. #sprecher:erzaehler
Da bist du ja. Links das neunzehnte Jahrhundert, rechts das zwanzigste. #sprecher:okafor #stimmung:laechelt
Wo der Boden trocken ist. #sprecher:okafor #stimmung:laechelt
* [Anfangen]
    -> ordnen_wahl
* [Nicht jetzt]
    Kein Problem. Die Pfütze läuft nicht weg. #sprecher:okafor #stimmung:lacht
    Leider. #sprecher:okafor #stimmung:lacht
    -> END

=== ordnen_wahl ===
Sie liest die Jahreszahlen vor. „1972.“ #sprecher:erzaehler
* [Nach links]
    Rechts. #sprecher:okafor #stimmung:laechelt
* [Nach rechts]
    Gut. #sprecher:okafor #stimmung:laechelt
- Ein Karton ist so durchweicht, dass der Boden nachgibt. Zeitungen rutschen heraus, braun und weich wie Herbstlaub. #sprecher:erzaehler
* [Sie aufheben]
    Lass. #sprecher:okafor #stimmung:bitter
* [Liegen lassen]
- Die sind verloren. Man kann nicht alles retten. #sprecher:okafor #stimmung:bitter
Sie sagt es ruhig. Aber sie hebt trotzdem jede einzelne auf. #sprecher:erzaehler #pause:2
Der letzte Karton steht ganz hinten auf einem Regal. Auf ihm steht „1850 bis 1859“. #sprecher:erzaehler
Er ist trocken geblieben. #sprecher:erzaehler
* [Vorsichtig auf den Tisch stellen]
* [Unter die Lampe tragen]
- -> ordnen_fertig

=== ordnen_fertig ===
~ archivGeordnet = true
Bei uns sagte man: Wer nur auf seinen Weg schaut, fällt in das Loch daneben. #sprecher:okafor #stimmung:nachdenklich
Ich habe den Kalender gelesen und nie in den Karton daneben geschaut. #sprecher:okafor #stimmung:bitter
Ich muss nach oben. Prudence schließt sonst die Kasse falsch ab. #sprecher:okafor #stimmung:laechelt
Du findest dich zurecht. #sprecher:okafor #stimmung:laechelt
Ihre Schritte auf der Wendeltreppe. Dann nichts mehr. #sprecher:erzaehler #pause:2 #gehe:okaforArchiv>10,2
* [Den Karton öffnen]
    -> karton_1858
* [Nicht jetzt]
    -> END

// ---------------------------------------------------------------- 1858

=== karton_1858 ===
Im Karton liegt eine Zeitung. Vier Seiten, dünn, die Schrift so klein, dass sie vor den Augen schwimmt. #sprecher:erzaehler
„Crescent City Herald“. Ein Datum im Oktober 1858. Ganz unten im Karton liegt ein Heft. #sprecher:erzaehler
-> erzaehlung_1858

=== erzaehlung_1858 ===
// Gutachten K1.8: Hale und die Treppe stehen im Stamm; die Wahlen sind nur Einwürfe.
~ erzaehlung1858Gesehen = true
Auf der dritten Seite, zwischen einer Anzeige für Schiffspassagen und dem Preis für Baumwolle, steht ein Absatz. #sprecher:erzaehler
„Mr. Hale, Ingenieur, schlägt Mr. Whitlock im Match, vier zu drei.“ #sprecher:erzaehler #bild:zeitung1858 #klang:zeitung
„Mr. Whitlocks Opfer im letzten Spiel wird noch lange besprochen werden. Mr. Hale nannte es ‚bemerkenswert unnötig‘.“ #sprecher:erzaehler #musik:aus #pause:3
Du liest es zweimal. #sprecher:erzaehler
Leg es weg. #sprecher:ambrose #stimmung:bitter #pause:2
Er steht neben dem Tisch, im Lichtkegel. Zum ersten Mal sieht er alt aus. #sprecher:erzaehler
* [„Hale.“]
    Es gibt viele. #sprecher:ambrose #stimmung:bitter
* [„Ambrose.“]
- Die Lampe flackert. Irgendwo tropft Wasser. #sprecher:erzaehler #pause:2
Vier zu drei. Sieben Partien, in einem Saal über einem Kaffeehaus, und die halbe Stadt stand auf der Treppe. #sprecher:ambrose #stimmung:nachdenklich #musik:ambrose.erinnerung
Ich war siebenundzwanzig und der Beste, den sie hatten. Ich wusste es. #sprecher:ambrose #stimmung:bitter
Das war das Unglück. #sprecher:ambrose #stimmung:bitter
* [„Und der andere?“]
* [Warten]
- Er beginnt, auf und ab zu gehen. Drei Schritte, die Wand, drei Schritte zurück. #sprecher:erzaehler
Ein Ingenieur, Brückenbauer aus dem Norden. Er spielte, wie man eine Brücke baut. #sprecher:ambrose #stimmung:nachdenklich
Jeder Stein auf den anderen. Nichts Überflüssiges, nichts Schönes. #sprecher:ambrose #stimmung:bitter
Ich fand ihn unerträglich. #sprecher:ambrose #stimmung:bitter
In der siebten stand ich auf Gewinn. Ein Kind hätte sie gewonnen. #sprecher:ambrose #stimmung:nachdenklich
Einen Bauern nehmen und nach Hause gehen. #sprecher:ambrose #stimmung:nachdenklich
Aber ich sah ein Opfer. Einen Turm, mitten in seine Stellung. #sprecher:ambrose #stimmung:nachdenklich
Ich wusste nicht einmal, ob es stimmte. #sprecher:ambrose #stimmung:nachdenklich
Ich habe es gespielt, weil die Leute auf der Treppe standen. Sie sollten in hundert Jahren noch davon reden. #sprecher:ambrose #stimmung:bitter
* [„Hat es gestimmt?“]
* [Warten]
- -> erzaehlung_1858_nein

=== erzaehlung_1858_nein ===
Nein. #sprecher:ambrose #stimmung:bitter #pause:3
Das Wort bleibt im Raum. #sprecher:erzaehler
Es gab eine Verteidigung. Einen einzigen stillen Zug. #sprecher:ambrose #stimmung:nachdenklich
Er brauchte vierzig Minuten. #sprecher:ambrose #stimmung:nachdenklich
Er sah mich nicht an dabei. Dann stellte er einen Läufer ein Feld zurück, und alles fiel zusammen. #sprecher:ambrose #stimmung:bitter #bild:stellung1858
Bemerkenswert unnötig. Er hatte recht. #sprecher:ambrose #stimmung:bitter
Das habe ich ihm nie verziehen. #sprecher:ambrose #stimmung:bitter
* {ausgangMapleFallsVictor == "niederlage"} [„Das ist wie bei mir gegen {rivale}.“]
    Nein. Du hattest eine verlorene Stellung. #sprecher:ambrose #stimmung:nachdenklich
    Ich hatte eine gewonnene und habe sie verschenkt. #sprecher:ambrose #stimmung:bitter
* [Nichts sagen]
- Ich habe Revanche verlangt. Im Jahr darauf, in einem langen Brief. #sprecher:ambrose #stimmung:bitter
Er schrieb zurück. Ein Wort. #sprecher:ambrose #stimmung:bitter
* [„Welches?“]
* [Warten]
- Später. #sprecher:ambrose #stimmung:bitter #klang:spaeter #musik:aus #geraeusch:aus #pause:2
{ersterTagSpaeter: Du hast es am ersten Tag zu ihm gesagt, auf dem Dachboden, ohne nachzudenken. Er hat so seltsam geantwortet. #sprecher:erzaehler}
* {kenntHale} [„Hale wie {rivale}?“]
    ~ ambroseVertrauen = ambroseVertrauen + 1
    Hale wie viele. #sprecher:ambrose #stimmung:nachdenklich
    Aber er sieht dich an dabei. Er weiß es nicht. #sprecher:erzaehler
    Und er hat Angst, es zu wissen. #sprecher:erzaehler
* [Schweigen]
    ~ ambroseVertrauen = ambroseVertrauen + 1
    Er sieht dich an. Er sagt nichts mehr. #sprecher:erzaehler
- -> END


=== karton_alltag ===
{abschiedGesehen:
    Die Zeitung von 1858 liegt obenauf. Du weißt, was darin steht. #sprecher:erzaehler
    -> END
}
{~Die Zeitung liegt obenauf. Ich weiß, was darin steht.|Bemerkenswert unnötig. Ich höre es noch.} #sprecher:ambrose #stimmung:nachdenklich
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
{abschiedGesehen: -> allein}
Ambrose macht ein Geräusch, das du von ihm nicht kennst. #sprecher:erzaehler
Ich war dort. Ich stand in der dritten Reihe. #sprecher:ambrose #stimmung:stolz #musik:ambrose.walzer
Ein Junge aus meiner Stadt spielte gegen einen Meister aus dem Westen, Paulsen. Der Junge hieß Morphy. #sprecher:ambrose #stimmung:laechelt
Er saß da, als ginge ihn das alles nichts an, und sah aus dem Fenster. #sprecher:ambrose #stimmung:laechelt
Setz dich. Du spielst seine Züge. #sprecher:ambrose #stimmung:laechelt
Ich sage dir nichts. #sprecher:ambrose #stimmung:laechelt
* [„Los geht's.“]
    ~ beginneAufgaben("cedarCreek.erinnerungNewYork")
    -> END
* [„Gleich.“]
    Nun gut. Der Junge sieht ohnehin aus dem Fenster. #sprecher:ambrose #stimmung:laechelt
    -> END

// Nach dem Abschied (abschiedGesehen) erzählt Ambrose nicht mehr; {held} spielt die Partie allein nach.
= allein
Darin steht eine Partie, Zug für Zug: Paulsen gegen Morphy. #sprecher:erzaehler
* [Die Partie nachspielen]
    ~ beginneAufgaben("cedarCreek.erinnerungNewYork")
    -> END
* [Das Heft zurücklegen]
    -> END

=== programmheft_danach ===
{not erinnerungNewYorkBestanden:
    Das Programmheft liegt aufgeschlagen. Die Züge warten. #sprecher:erzaehler
    -> END
}
{newYorkBesprochen:
    Das Programmheft. Die Ecken sind weich vom Anfassen. #sprecher:erzaehler
    -> END
}
~ newYorkBesprochen = true
{abschiedGesehen:
    Morphy opfert die Dame, und du vergisst zu atmen. Du legst das Heft zurück in den Karton. #sprecher:erzaehler #musik:aus
    -> END
}
Er opferte seine Dame, und ich vergaß zu atmen. Dreihundert Leute, und man hätte eine Nadel fallen hören. #sprecher:ambrose #stimmung:stolz #musik:aus #pause:2
Siehst du? Das. #sprecher:ambrose #stimmung:laechelt #musik:ambrose.walzer
Das ist Schach. Nicht dieses Zählen. #sprecher:ambrose #stimmung:laechelt
// Lektorat Akt 1, 17.11.2026: nicht mehr „Gestern hast du gesagt, Zählen ist alles“ (Roman): Den
// Satz sagt Ambrose im Spiel nie, und „gestern“ stimmt nicht in jedem Verlauf. Seine Frage „Was
// hängt?“ stellt er in jedem Verlauf (maple-falls-dachboden.ink, nach der ersten Lektion).
* [„Dieses Zählen habe ich von dir. Was hängt?“]
    Er fährt herum. Er sucht nach einer Antwort und hat keine. #sprecher:erzaehler #pause:2
    Das hast du von mir. #sprecher:ambrose #stimmung:still
    ** [„Was stimmt denn nun?“]
        Er sieht auf das Brett aus Licht. Dann auf die Zeitung – vier zu drei. #sprecher:erzaehler
        Wenn ich das wüsste, säße ich vielleicht nicht in einer Kiste. #sprecher:ambrose #stimmung:bitter
    ** [Nichts sagen]
* [Nichts sagen]
    Du denkst an seine Frage: Was hängt? #sprecher:erzaehler #pause
    Sieh mich nicht so an. Die Frage ist von mir. #sprecher:ambrose #stimmung:still
- -> name_im_archiv

// Runde 11 (VC73, Roman Kapitel 12, Schluss): Ambrose nennt {held} zum ersten Mal beim Namen.
=== name_im_archiv ===
{ambroseNenntNamen: -> END}
~ ambroseNenntNamen = true
Über dir schlägt die Uhr. Sieben Mal. #sprecher:erzaehler #klang:turmuhr7 #musik:aus
Du legst die Zeitung zurück, das Programm obenauf. #sprecher:erzaehler
Als du den Deckel schließen willst, sagt er: #sprecher:erzaehler
{held}. #sprecher:ambrose #stimmung:nachdenklich #pause:2
Er hat dich noch nie beim Namen genannt. Immer nur „Kind“. #sprecher:erzaehler
Oder „Lehrling“. #sprecher:erzaehler
* [„Ja?“]
* [Den Deckel offen lassen]
- Ich habe das noch niemandem erzählt. #sprecher:ambrose #stimmung:nachdenklich
Er sieht zur Wendeltreppe. #sprecher:erzaehler
Es gab allerdings auch niemanden. #sprecher:ambrose #stimmung:nachdenklich #musik:karte
-> END


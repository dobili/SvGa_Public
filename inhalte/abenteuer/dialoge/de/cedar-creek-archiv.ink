// Ort: Archiv im Keller der Stadtbibliothek von Cedar Creek (Akt 1). Gegenstände: Karton
// (Auslöser karton1858), Programmheft.
//
// Szenen der Story-Bibel (docs/spiel/05_Story_Bibel.md, Abschnitt 4): 18 Das Archiv (Hilfe-Quest
// cedarCreek.archivOrdnen), 19 1858 (akt1.erzaehlung1858, Hauptquest cedarCreek.archiv1858),
// 20 Erinnerung: New York, 1857 (Zugerraten der Partie klassik-paulsen-morphy, Runde
// cedarCreek.erinnerungNewYork). Einstiege wie in orte.json: „karton“, „programmheft“.
// Den Karton 1850–1859 gibt es nach dem Umräumen oder nach dem Clubkampf (Bibel, Szene 18).
// Ambrose erwähnt 1866 nicht und nennt Hales Vornamen nicht (Bibel, Szene 19).
//
// Variablen: erinnerungNewYorkBestanden und nadelCedarCreek setzt die Hülle (Vorschlag V-Dialog
// im Bericht mittel-1); die übrigen setzt Ink selbst.

EXTERNAL beginneAufgaben(runde)

VAR held = "Du"
VAR ambroseVertrauen = 0
VAR kenntHale = false
VAR okaforGetroffen = false
VAR archivGeordnet = false
VAR erzaehlung1858Gesehen = false
VAR erinnerungNewYorkBestanden = false
VAR nadelCedarCreek = 0

// ---------------------------------------------------------------- Karton

=== karton ===
{
- not okaforGetroffen: -> karton_fremd
- not archivGeordnet and nadelCedarCreek == 0: -> ordnen
- not erzaehlung1858Gesehen: -> karton_1858
- else: -> karton_alltag
}

=== karton_fremd ===
Kartons, Kartons, Kartons. Manche sind nass. #sprecher:erzaehler
Ohne Erlaubnis öffnest du hier lieber nichts. #sprecher:erzaehler
Frag oben die Dame mit dem Buch. Das gebietet der Anstand. #sprecher:ambrose
-> END

=== ordnen ===
Der Keller riecht nach altem Papier. Zehn Kartons stehen in einer Pfütze, auf jedem eine Jahreszahl. #sprecher:erzaehler
Mrs. Okafor kommt die Treppe herunter. Die Regale links sind für das neunzehnte Jahrhundert, rechts für das zwanzigste. #sprecher:okafor
* [Anfangen]
    -> ordnen_wahl
* [Später helfen]
    Kein Problem. Die Pfütze läuft nicht weg. Leider. #sprecher:okafor
    -> END

=== ordnen_wahl ===
Ein Karton mit der Aufschrift „1972“. Wohin damit? #sprecher:erzaehler
* [Nach links]
    Fast. 1972 gehört ins zwanzigste Jahrhundert. Nach rechts. #sprecher:okafor
* [Nach rechts]
    Richtig. #sprecher:okafor #stimmung:froh
- Ein Karton mit der Aufschrift „1890“, das Jahr, in dem die Bibliothek gebaut wurde. #sprecher:erzaehler
* [Nach links]
    Richtig. Das ist unser ältester Stolz. #sprecher:okafor #stimmung:froh
* [Nach rechts]
    Nein, 1890 ist noch das neunzehnte Jahrhundert. Nach links. #sprecher:okafor
- Der letzte Karton ist schwer. Auf ihm steht „1850 bis 1859“. Er ist trocken geblieben. #sprecher:erzaehler
* [Ganz oben ins Regal stellen]
    Gut. Dort kommt kein Wasser hin. #sprecher:okafor
* [Vorsichtig auf den Tisch stellen]
    Gut. Den wollten wir uns ja ansehen. #sprecher:okafor
- -> ordnen_fertig

=== ordnen_fertig ===
~ archivGeordnet = true
Geschafft. Danke, {held}. Ohne dich hätte ich bis morgen gebraucht. #sprecher:okafor #stimmung:froh
Sie sieht zum Karton mit den Jahren 1850 bis 1859. Dann zur Treppe. #sprecher:erzaehler
Schau ruhig hinein. Ich mache uns oben einen Tee. #sprecher:okafor
Manche Dinge liest man besser allein. #sprecher:okafor
Du hast gearbeitet, ohne zu fragen, was es dir bringt. Das ehrt dich. #sprecher:ambrose
* [Den Karton öffnen]
    -> karton_1858
* [Später]
    -> END

// ---------------------------------------------------------------- 1858

=== karton_1858 ===
Im Karton liegen vergilbte Zeitungen, ein Schachkalender und ein dünnes Heft mit Zügen. #sprecher:erzaehler
Im Kalender steckt ein Zettel, eine Fußnote ist angestrichen: „Whitlock, A., New Orleans.“ #sprecher:erzaehler
Darunter eine Zeitung von 1858, „Crescent City Herald“. Eine Meldung ist mit Tinte umrandet. #sprecher:erzaehler
-> erzaehlung_1858

=== erzaehlung_1858 ===
~ erzaehlung1858Gesehen = true
„Mr. Hale, Ingenieur, schlägt Mr. Whitlock im Match, vier zu drei.“ #sprecher:erzaehler
„Mr. Whitlocks Opfer im letzten Spiel wird noch lange besprochen werden. Mr. Hale nannte es ‚bemerkenswert unnötig‘.“ #sprecher:erzaehler
Bemerkenswert unnötig. Das hat er wirklich gesagt. #sprecher:ambrose #stimmung:bitter #pause
Ich hatte es fast vergessen. Fast. #sprecher:ambrose
* [„Willst du es mir erzählen?“]
    Ja. Ich glaube, ja. #sprecher:ambrose
* [„Du musst nicht darüber reden.“]
    Doch. Hundertsechzig Jahre Schweigen sind genug. #sprecher:ambrose
- New Orleans, 1858. Ein Ingenieur aus dem Norden baute bei uns eine Brücke. Er spielte Schach wie man Brücken baut. #sprecher:ambrose
Kein Zug ohne Rechnung, kein Stein ohne Grund. Ich fand das langweilig. #sprecher:ambrose
Und ich verlor. #sprecher:ambrose
Sieben Partien. Drei zu drei vor der letzten. #sprecher:ambrose
In der letzten stand ich gut. Sehr gut. #sprecher:ambrose
Dann sah ich ein Opfer. Einen Turm, mitten in seine Stellung. #sprecher:ambrose
Das schönste Opfer meines Lebens. #sprecher:ambrose
Es war falsch. Er nahm den Turm, verteidigte sich ruhig und gewann. #sprecher:ambrose #stimmung:traurig
* [„Warum hast du es trotzdem gespielt?“]
    Weil es schön war. Weil ich dachte, Schönheit gewinnt. #sprecher:ambrose
    Manchmal tut sie das. Damals nicht. #sprecher:ambrose
* [„Das ist wie bei mir gegen Victor.“]
    Nein. Du hattest eine verlorene Stellung. #sprecher:ambrose
    Ich hatte eine gewonnene und habe sie verschenkt. #sprecher:ambrose
- Ich forderte Revanche. Er schrieb mir einen Brief mit einem einzigen Wort. #sprecher:ambrose
„Später.“ #sprecher:ambrose #stimmung:bitter #pause
Dann kamen schwere Jahre, in denen niemand Schach spielte. Später wurde immer später. #sprecher:ambrose
* {kenntHale} [„Hale. Wie Victor?“]
    Hale wie viele. #sprecher:ambrose
    Er sagt es schnell. Zu schnell. #sprecher:erzaehler
* [„Danke, dass du es mir erzählt hast.“]
    ~ ambroseVertrauen = ambroseVertrauen + 1
    Danke, dass du zugehört hast. Das tut seit langer Zeit niemand mehr. #sprecher:ambrose
- Nun. Genug Staub für heute. In dem Karton liegt noch ein Heft. Sieh es dir an, wenn du magst. #sprecher:ambrose
-> END

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
„Erster Amerikanischer Schachkongress, New York, 1857.“ Ein Programmheft, die Ecken weich vom Anfassen. #sprecher:erzaehler
New York. Ich war sechsundzwanzig und fuhr eine Woche mit dem Dampfer, nur um zuzusehen. #sprecher:ambrose #stimmung:stolz
Ein Junge aus meiner Stadt spielte gegen einen Meister aus dem Westen, Paulsen. Der Junge hieß Morphy. #sprecher:ambrose
Ich stand in der dritten Reihe. Dieser Junge opferte seine Dame, und ich vergaß zu atmen. #sprecher:ambrose
Spiel mit mir nach, was er spielte. Du hast Schwarz. #sprecher:ambrose
Ich halte an, wenn es so weit ist. #sprecher:ambrose
Und dann frage ich dich: Was hätte er gespielt? Was hättest du gespielt? #sprecher:ambrose
* [„Los geht's.“]
    ~ beginneAufgaben("cedarCreek.erinnerungNewYork")
    -> END
* [„Später.“]
    Später. Ausgerechnet heute. Nun gut. #sprecher:ambrose #stimmung:bitter
    -> END

=== programmheft_danach ===
Siehst du? Das ist Schach. Kein Zählen, kein Abwägen, nur Mut. #sprecher:ambrose #stimmung:stolz
* [„Neulich hast du gesagt, Zählen ist alles.“]
    Habe ich das? Nun. #sprecher:ambrose
    Morphy hat gezählt, bevor er mutig war. Vielleicht ist das der Trick. #sprecher:ambrose
* [„Das war wunderschön.“]
    Ja. Und jetzt hast du ein Stück davon im Kopf. Niemand nimmt es dir. #sprecher:ambrose
- -> END

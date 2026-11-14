// Ort: Antiquariat im alten Bahnhof von Desert Springs (Akt 3). Figur: Mr. Okoro (Story-Bibel
// 18.4 und 19.6).
//
// Szene der Bibel (Abschnitt 20): 76 Der Brief (Quest desertSprings.brief, E4): das Siegel mit
// derselben Stellung wie auf dem Umschlag aus Ironwood (Runde desertSprings.siegel), Hales Brief
// von 1866, Partiefragment 7. Einstieg wie in orte.json: okoro.
//
// Hales Brief ist ein Fund (gibFund); Mr. Okoro hat den Laden desertSprings.antiquariat. Variablen: siegelBestanden und gefundenUmschlag setzt die Hülle (R42);
// dotOkoroErzaehlt setzt desert-springs-garage.ink; briefGelesen setzt diese Datei.

EXTERNAL beginneAufgaben(runde)
EXTERNAL gibFund(kennung)
EXTERNAL oeffneLaden(laden)

VAR okoroGetroffen = false
VAR dotOkoroErzaehlt = false
VAR siegelBestanden = false
VAR gefundenUmschlag = false
VAR briefGelesen = false
VAR held = "Du"
// Gutachten M1.10: Wer „Nicht jetzt“ wählt, hört die Kellerszene nicht noch einmal.
VAR kisteGesehen = false

=== okoro ===
{
- briefGelesen: -> okoro_alltag
- siegelBestanden: -> okoro_brief
- dotOkoroErzaehlt: -> okoro_kiste
- okoroGetroffen: -> okoro_alltag
- else: -> okoro_erstes_treffen
}

=== okoro_erstes_treffen ===
~ okoroGetroffen = true
Bücher bis unter die Decke, in Stapeln auf dem Boden, zwischen denen schmale Wege führen. Hier wird nichts nass. Hier hält sich alles. #sprecher:erzaehler #geraeusch:antiquariat
Hinter einem Schreibtisch, der einmal ein Fahrkartenschalter war, klebt ein Mann einen Buchrücken. #sprecher:erzaehler
Okoro. Bücher, Karten, alte Fahrpläne. Was hier liegt, hat schon einmal jemandem gehört. #sprecher:okoro #stimmung:laechelt
-> okoro_laden

=== okoro_kiste ===
{kisteGesehen:
    Das Blatt mit dem Siegel liegt noch auf der Kiste im Keller. #sprecher:erzaehler
    -> kiste_wahl
}
// Kapitel 44 (Roman): sieben Kisten im Keller, Ambroses eigene Briefe nach Jahren gebündelt,
// das Siegel mit einer Fesselung wie in Ironwood.
~ okoroGetroffen = true
Der Kram von dem Brückenbauer. Im Keller. Mein Vorgänger hat ihn mit dem Gebäude von der Bahn übernommen. #sprecher:okoro #geraeusch:antiquariat
Pläne, Rechnungen, ein Sextant. Ich wollte es immer durchsehen. Dann kam immer ein Buch dazwischen. #sprecher:okoro #stimmung:laechelt
{gefundenUmschlag:
    Du legst den Umschlag aus Ironwood auf den Schalter. Mr. Okoro sieht ihn lange an. #sprecher:erzaehler
    Der Keller ist die Treppe hinunter und dann links. #sprecher:okoro
}
Sieben Kisten. In der vierten Briefe, gebündelt mit Schnur, jedes Bündel ein Jahr. 1863. 1864. 1865. #sprecher:erzaehler #bild:briefbuendel
Die Schrift darauf ist schräg und ungeduldig. Meine. Er hat sie aufgehoben. Jeden. #sprecher:ambrose #stimmung:still #bild:aus
Unter dem Bündel 1866 liegt ein einzelnes Blatt, zweimal gefaltet, mit Wachs verschlossen. Ins Wachs ist eine Stellung gedrückt. #sprecher:erzaehler
Wieder eine Fesselung. Eine andere, schwerer. #sprecher:erzaehler
Wer mit der Post spielte, drückte dem anderen eine Stellung aufs Siegel. Wer sie nicht löste, hatte den Brief nicht verdient. #sprecher:ambrose #stimmung:nachdenklich
Er hat ihn versiegelt und nicht in den Umschlag gelegt. Der Umschlag ging leer hinaus. Hale. Der Mann, der jede Niete signiert. #sprecher:ambrose #stimmung:ueberrascht
* [„Ein Fehler.“]
- Sein einziger, soweit ich weiß. #sprecher:ambrose #stimmung:lachtOhneSpott
~ kisteGesehen = true
-> kiste_wahl

= kiste_wahl
* [Die Stellung lösen]
    ~ beginneAufgaben("desertSprings.siegel")
    -> END
* [Nicht jetzt]
    Die Briefe warten schon lange. Ein paar Tage mehr schaden nicht. #sprecher:okoro #stimmung:laechelt
    -> END

=== okoro_brief ===
// Klangplan S57: Der Brief wird ohne Musik gelesen (nur die Glühbirne); nach „Ich warte.“
// mindestens fünf Sekunden Stille; dann ambrose.hale (Kanon, am Schluss einstimmig).
~ briefGelesen = true
Du brichst das Wachs. #sprecher:erzaehler #klang:siegel #musik:aus
Zwölf Zeilen. Senkrecht, gerade, jede gleich lang. Du liest laut, bei einer Glühbirne, für jemanden, der hundertsechzig Jahre gewartet hat. #sprecher:erzaehler #bild:hales_brief
„Whitlock, mein neununddreißigster Zug ist seit Dienstag unterwegs zu Ihnen. Sie werden zurückschlagen müssen.“ #sprecher:erzaehler
„Danach stehen wir in einem Endspiel, und ich weiß nicht, wie es ausgeht. Ich weiß es zum ersten Mal nicht, und es gefällt mir.“ #sprecher:erzaehler
„Ich habe Ihnen 1859 ein Wort geschrieben, für das ich mich seither schäme. Ich hielt Ihr Spiel für Leichtsinn.“ #sprecher:erzaehler
„Ich habe sieben Jahre und diese Partie gebraucht, um zu begreifen, dass es Mut war. Und dass ich davon zu wenig habe.“ #sprecher:erzaehler
„Ein Endspiel spielt man nicht mit der Post. Kommen Sie nach Norden.“ #sprecher:erzaehler
„Wir spielen die letzten Züge an einem Brett, von Angesicht zu Angesicht. Ich lasse ein Zimmer richten.“ #sprecher:erzaehler
„Ich warte. J. Hale“ #sprecher:erzaehler #pause:5
Ambrose hat die Hand vor den Mund gelegt. Seine Schultern beben, und du hörst nichts. Das ist schlimmer. #sprecher:erzaehler #bild:aus #pause:3
Er hat gewartet. #sprecher:ambrose #stimmung:riss #musik:ambrose.hale
Er hat wirklich gewartet. Er hat ein Zimmer richten lassen. #sprecher:ambrose #stimmung:ueberrascht
Mut. Er schreibt, es war Mut. Der Mann, der es „bemerkenswert unnötig“ genannt hat. #sprecher:ambrose #stimmung:ueberrascht
* [„Er hat sich geschämt.“]
- Sieben Jahre lang. Und ich habe ihn sieben Jahre lang gehasst, für ein einziges Wort. #sprecher:ambrose #stimmung:bitter
Wir waren zwei Dickköpfe, {held}. Zwei Dickköpfe, und zwischen uns ein Land und ein Postmeister mit Fieber. #sprecher:ambrose #stimmung:lachtOhneSpott
Er hat auf mich gewartet und ich auf ihn. Und jeder hat gedacht, der andere schweigt. #sprecher:ambrose #stimmung:nachdenklich
* [„Wie Big Joe und Mama.“]
- Wie die halbe Welt, fürchte ich. #sprecher:ambrose #stimmung:laechelt
Auf der Rückseite stehen vier Züge, sauber untereinander. #sprecher:erzaehler
Neunundzwanzig bis zweiunddreißig. Zur Kontrolle. Damit wir dieselbe Stellung aufbauen, wenn ich ankomme. #sprecher:ambrose #stimmung:nachdenklich
Zwei Umschläge am selben Dienstag. Der mit dem Zug kam an. Der mit der Einladung blieb leer in einem Postsack liegen. #sprecher:ambrose #stimmung:bitter
Seine Antwort auf meinen letzten Zug hat er nie abgeschickt. An wen auch. Sie steht auf der Seite, die fehlt. #sprecher:ambrose #stimmung:still
Den Brief hat er auf seinem Tisch gefunden, als es zu spät war, und nie geöffnet. #sprecher:ambrose #stimmung:still
{gefundenUmschlag:
    Du faltest den Brief und legst ihn in den Umschlag aus Ironwood. Er passt genau. #sprecher:erzaehler
}
~ gibFund("halesBrief")
Oben sieht Mr. Okoro dein Gesicht und fragt nichts. #sprecher:erzaehler
Manche Bücher stehen fünfzig Jahre im Regal, bis der Richtige kommt. Das ist kein Unglück. Das ist ein Antiquariat. #sprecher:okoro #stimmung:laechelt
-> END

=== okoro_alltag ===
{~Eine Fahrkarte von 1923, ein Kochbuch ohne Umschlag. Alles hat seinen Preis, nur nicht die Geschichten.|Unten im Keller stehen noch sechs Kisten. Pläne, Rechnungen, ein Sextant.|Lies langsam. Bücher laufen nicht weg.} #sprecher:okoro #stimmung:laechelt
-> okoro_laden

=== okoro_laden ===
~ oeffneLaden("desertSprings.antiquariat")
-> END

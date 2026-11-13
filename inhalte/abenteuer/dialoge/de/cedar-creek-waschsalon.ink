// Ort: Waschsalon von Cedar Creek (Akt 1). Figur: Mr. Boateng. Gegenstand: Trockner.
//
// Szene der Story-Bibel (docs/spiel/05_Story_Bibel.md, Abschnitt 4): 17 Die Stellung auf dem
// Trockner (Rätsel-Quest cedarCreek.trockner, Grundreihenmatt in zwei, Kapitel 7, Abschnitt 7.4).
// Einstiege wie in orte.json: „boateng“, „trockner“. Die Quest beginnt mit dem ersten Gespräch
// (Knoten boateng_erstes_treffen); der Trockner bietet das Rätsel erst danach an, damit die Runde
// nicht vor dem Start der Quest gelöst wird.
// trocknerStellungBestanden setzt die Hülle (regeln/dialogvariablen.ts).

EXTERNAL beginneAufgaben(runde)

VAR boatengGetroffen = false
VAR boatengLagos = false
VAR trocknerStellungBestanden = false
VAR formularGefunden = false
VAR formularEntziffert = false
VAR okaforGetroffen = false

=== boateng ===
{
- not boatengGetroffen: -> boateng_erstes_treffen
- formularGefunden and not formularEntziffert: -> boateng_formular
- trocknerStellungBestanden and not boatengLagos: -> boateng_lagos
- trocknerStellungBestanden: -> boateng_alltag
- else: -> boateng_wartet
}

=== boateng_erstes_treffen ===
// Runde 11 (VC45, VC51, Roman Kapitel 11): Bild statt Vorstellung; das Brummen von Anfang an.
// Dauergeräusch und Radio kommen von der Karte (waschmaschine, 21_Klangplan.md B1).
~ boatengGetroffen = true
{okaforGetroffen: Mrs. Okafor hat dich mit einem Sack Tischdecken herübergeschickt. #sprecher:erzaehler}
Maschinen brummen, warme Luft, es riecht nach Seife. Hinter dem Tresen ein alter Mann mit sehr großen, ruhigen Händen. #sprecher:erzaehler #klang:waschmaschine
Die Stellung da steht seit Montag. #sprecher:boateng
Die Maschine schleudert, du denkst. Beides braucht zwölf Minuten. #sprecher:boateng
Auf dem Trockner dort klebt jede Woche eine neue Stellung. Wer sie löst, wäscht einmal umsonst. #sprecher:boateng
* [„Ich versuche es.“]
    Nur zu. Weiß am Zug, Matt in zwei. #sprecher:boateng
* [„Ich habe gar keine Wäsche dabei.“]
    Dann hast du einen Gutschein für nachher. Das ist auch was. #sprecher:boateng
- Ein Brett auf einer Maschine, die zittert. Und die Figuren halten. #sprecher:ambrose
-> END

=== boateng_wartet ===
Die Maschine ist gleich fertig. Du auch? #sprecher:boateng
-> END

=== trockner ===
{
- not boatengGetroffen:
    Auf einem Trockner klebt ein Brett mit Klebeband. Daneben ein Zettel: „Bitte beim Chef melden.“ #sprecher:erzaehler
    -> END
- trocknerStellungBestanden:
    Auf dem Trockner klebt schon eine neue Stellung. Für nächste Woche. #sprecher:erzaehler
    -> END
- else: -> trockner_raetsel
}

=== trockner_raetsel ===
Das Brett auf dem Trockner vibriert leise, die Figuren halten. Weiß am Zug, Matt in zwei. #sprecher:erzaehler #klang:trockner_figuren
Der König hinter seinen Bauern. Kein Fenster, keine Luft. #sprecher:ambrose
Das kennst du jetzt. #sprecher:ambrose
* [Die Stellung lösen]
    ~ beginneAufgaben("cedarCreek.trocknerStellung")
    -> END
* [Nicht jetzt]
    -> END

=== boateng_lagos ===
// Runde 11 (VC47 bis VC50, Roman Kapitel 11): Die Lagos-Geschichte als Pointe, Ambrose schweigt.
// Dieselben Sätze sollen als Steckbriefzeile von Mrs. Okafor erscheinen; dafür fehlt noch eine
// Zeilenart mit freiem Text.
~ boatengLagos = true
Mr. Boateng nickt, zieht das Paketband ab und stellt eine neue Stellung auf. #sprecher:erzaehler
Die alte hat mir ein Mädchen gezeigt. Vor fünfzig Jahren. Sie kam aus Lagos und hat im ganzen Staat Turniere gespielt. #sprecher:boateng
Die Männer mochten das nicht. #sprecher:boateng
Er lächelt auf das Brett hinunter. #sprecher:erzaehler
Sie hat gewartet. Immer. Bis einer zu früh gekommen ist. #sprecher:boateng #stimmung:froh
* [„Was ist aus ihr geworden?“]
    Er streicht das Paketband glatt. #sprecher:erzaehler #pause:2
* [Nichts fragen]
    Er streicht das Paketband glatt und lässt sich Zeit. #sprecher:erzaehler #pause:2
- Sie stellt Bücher ins Regal. Gegenüber. #sprecher:boateng
-> END

=== boateng_alltag ===
{~Die Maschine schleudert, du denkst. Beides braucht zwölf Minuten.|Dein Gutschein gilt. Komm mit Wäsche wieder.|Nächste Woche ein Erstickungsmatt. Verrat es niemandem.} #sprecher:boateng
-> END

// ---------------------------------------------------------------- Das alte Partieformular (E4.1)
// Quest cedarCreek.partieformular: beginnt mit boateng_formular, erledigt mit
// boateng_formular_entziffert (Partiefragment 2). Voraussetzung ist der Fund formular1857 auf
// Route 1; formularGefunden setzt weg-maple-cedar.ink, weil die Hülle Funde nicht als
// Dialogvariable meldet.

=== boateng_formular ===
Du zeigst Mr. Boateng das vergilbte Partieformular aus der Blechdose. Er setzt eine zweite Brille auf. #sprecher:erzaehler
Oh. Das ist alt. #sprecher:boateng
Sehr alt. Gib mir einen Moment und eine Waschladung Zeit. #sprecher:boateng
-> boateng_formular_entziffert

=== boateng_formular_entziffert ===
~ formularEntziffert = true
Das ist eine alte Schrift. Die Züge sind englisch notiert, K für König, Kt für Springer. #sprecher:boateng
Er schreibt die Züge Zeile für Zeile in heutiger Notation auf einen Zettel und reicht ihn dir. #sprecher:erzaehler
Das sind meine Züge. Ein Stück meiner letzten Partie, in meiner eigenen Hand. #sprecher:ambrose #stimmung:traurig
Ich hatte vergessen, wie ich schrieb. #sprecher:ambrose
* [„Danke, Mr. Boateng.“]
    Gern. Bring mehr davon, wenn du welche findest. #sprecher:boateng
* [„Woher können Sie das lesen?“]
    Mein Großvater schrieb so. Er war Lehrer in Accra und hat mir die alte Schrift beigebracht. #sprecher:boateng
- -> END

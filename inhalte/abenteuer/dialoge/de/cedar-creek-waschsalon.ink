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

=== boateng ===
{
- not boatengGetroffen: -> boateng_erstes_treffen
- trocknerStellungBestanden and not boatengLagos: -> boateng_lagos
- trocknerStellungBestanden: -> boateng_alltag
- else: -> boateng_wartet
}

=== boateng_erstes_treffen ===
~ boatengGetroffen = true
Maschinen brummen, warme Luft, es riecht nach Seife. Ein Mann in Strickjacke faltet Handtücher. #sprecher:erzaehler
Willkommen. Boateng, mir gehört der Laden. #sprecher:boateng
Die Maschine schleudert, du denkst. Beides braucht zwölf Minuten. #sprecher:boateng
Auf dem Trockner dort klebt jede Woche eine neue Stellung. Wer sie löst, wäscht einmal umsonst. #sprecher:boateng
* [„Ich versuche es.“]
    Nur zu. Weiß am Zug, Matt in zwei. #sprecher:boateng
* [„Ich habe gar keine Wäsche dabei.“]
    Dann hast du einen Gutschein für später. Das ist auch was. #sprecher:boateng
- Ein Brett auf einer Waschmaschine. Diese Zeit hat ihren eigenen Witz. Er gefällt mir. #sprecher:ambrose #stimmung:lacht
-> END

=== boateng_wartet ===
Die Stellung wartet auf dem Trockner. Kleiner Tipp: Schau dir die letzte Reihe an. #sprecher:boateng
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
Das Brett auf dem Trockner vibriert leise, die Figuren halten. Weiß am Zug, Matt in zwei. #sprecher:erzaehler #klang:waschmaschine
Der König hinter seinen Bauern. Kein Fenster, keine Luft. #sprecher:ambrose
Das kennst du jetzt. #sprecher:ambrose
* [Die Stellung lösen]
    ~ beginneAufgaben("cedarCreek.trocknerStellung")
    -> END
* [Später]
    -> END

=== boateng_lagos ===
~ boatengLagos = true
Gelöst! Gut gemacht. #sprecher:boateng
Die Stellung habe ich von einem Mädchen aus Lagos, vor fünfzig Jahren. #sprecher:boateng
Sie hat damals jedes Turnier hier gewonnen. Heute leitet sie den Club in der Bibliothek. #sprecher:boateng
* [„Mrs. Okafor?“]
    Genau die. Frag sie nach der Grundreihe. #sprecher:boateng #stimmung:froh
    Oder besser nicht, sonst stellt sie dir eine Falle. #sprecher:boateng
* [„Sie hat Turniere gespielt?“]
    Und wie. Sie stellt Fallen, die man erst sieht, wenn es zu spät ist. #sprecher:boateng
- Das kommt in Junos Tagebuch, nehme ich an. Mit Glitzer. #sprecher:ambrose
-> END

=== boateng_alltag ===
{~Die Maschine schleudert, du denkst. Beides braucht zwölf Minuten.|Dein Gutschein gilt. Komm mit Wäsche wieder.|Nächste Woche ein Erstickungsmatt. Verrat es niemandem.} #sprecher:boateng
-> END

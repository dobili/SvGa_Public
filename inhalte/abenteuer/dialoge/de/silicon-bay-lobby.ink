// Ort: Lobby des Konzerns in Silicon Bay (Akt 3). Figuren: Victor, der Empfangsroboter.
//
// Szenen der Story-Bibel (Abschnitt 20): 56 Die Spielberichte (Quest siliconBay.spielberichte,
// Runde siliconBay.auswertung, Buchbezug Kapitel 12, Abschnitt 12.2; Victor sagt zum ersten Mal
// „Das ist falsch“), 57 Die Vitrine der Hales (Gegenstand notizbuchseite über die Quest siliconBay.vitrine, übergreifende Quest „Die
// fehlende Seite“ für Akt 4).
// Einstiege wie in orte.json: victor, empfangsroboter, vitrine. Die Quest siliconBay.spielberichte
// beginnt im Knoten „victor_berichte“.
//
// Variablen: siliconBayAuswertungBestanden und nadelSiliconBay setzt die Hülle (R42),
// notizbuchseiteFotografiert der eigene Merker; den Gegenstand gibt die Quest beim Knoten
// „vitrine_foto“.

EXTERNAL beginneAufgaben(runde)

VAR held = "Du"
VAR victorLobbyGetroffen = false
VAR reiheTheoBestanden = false
VAR siliconBayAuswertungBestanden = false
VAR victorFalschGesagt = false
VAR notizbuchseiteFotografiert = false
VAR roboterGetroffen = false

// ---------------------------------------------------------------- Victor

=== victor ===
{
- not victorLobbyGetroffen: -> victor_erstes_treffen
- not reiheTheoBestanden: -> victor_warten
- not siliconBayAuswertungBestanden: -> victor_berichte
- not victorFalschGesagt: -> victor_falsch
- else: -> victor_alltag
}

=== victor_erstes_treffen ===
~ victorLobbyGetroffen = true
Victor sitzt auf einem weißen Sofa unter einem Bildschirm mit dem Gesicht seines Vaters. #sprecher:erzaehler
Mein Vater hält heute drei Reden. Ich muss bei allen klatschen. #sprecher:victor #stimmung:muede
Geh erst zu Dr. Lin. Sie ist die Einzige hier, die noch ein Holzbrett hat. #sprecher:victor
-> END

=== victor_warten ===
Theo misst dich gerade, oder? Er misst alle. Mich auch. #sprecher:victor
-> END

=== victor_berichte ===
Victor sieht sich um, dann zieht er einen Stapel Papier aus seiner Tasche. #sprecher:erzaehler
Spielberichte der Akademie. Novas Turnierpartien und ihre Trainingspartien. #sprecher:victor
Ich sollte sie nicht haben. Sieh sie dir an. Mit deinem eigenen Kopf, nicht mit unserem Programm. #sprecher:victor
Ein Bericht über Partien. Man liest ihn wie einen Brief: Was steht zwischen den Zeilen? #sprecher:ambrose
+ [Die Partien auswerten]
    ~ beginneAufgaben("siliconBay.auswertung")
    -> END
* [„Später.“]
    Gut. Aber nicht zu spät. #sprecher:victor
    -> END

=== victor_falsch ===
~ victorFalschGesagt = true
Achtundneunzig Prozent im Turnier, vierundsiebzig im Training. Das ist kein Talent. #sprecher:erzaehler
… Das ist falsch. #sprecher:victor #stimmung:ernst
Vor einer Partie hab ich gesehen, wie sie etwas ins Ohr gesteckt hat. Ich dachte, ein Kopfhörer. #sprecher:victor
Sag meinem Vater nichts. Noch nicht. Ich muss nachdenken. #sprecher:victor #stimmung:muede
Ein Hale, der zweifelt. Das habe ich nicht kommen sehen. #sprecher:ambrose
Zu meiner Zeit hieß das: sich selbst nicht belügen. Es ist die schwerste Übung von allen. #sprecher:ambrose
-> END

=== victor_alltag ===
{~Mein Vater hat gefragt, ob du gut bist. Ich hab „ja“ gesagt. Er hat nichts mehr gefragt.|Ich glaube, ich hab heute zum ersten Mal ein Spiel genossen. Gegen dich. Das ist peinlich.|Pass auf Nova auf. Sie hat keine Wahl, glaube ich.} #sprecher:victor
-> END

// ---------------------------------------------------------------- Empfangsroboter

=== empfangsroboter ===
{roboterGetroffen:
    Willkommen zurück, Besucher. Ihre Genauigkeit wurde gespeichert. #sprecher:empfangsroboter
    -> END
}
~ roboterGetroffen = true
Ein Roboter mit freundlichem Bildschirmgesicht rollt heran. #sprecher:erzaehler
Willkommen bei Perfect Move. Wir machen Menschen besser. Bitte lächeln Sie für die Kamera. #sprecher:empfangsroboter
Er lächelt mit Absicht. Das ist unheimlicher als ein Geist. Glaube mir, ich weiß das. #sprecher:ambrose
-> END

// ---------------------------------------------------------------- Vitrine der Hales (Szene 57)

=== vitrine ===
{notizbuchseiteFotografiert:
    Die Vitrine „Hale – Ingenieure seit 1850“. Das Notizbuch liegt aufgeschlagen, die Seite fehlt noch immer. #sprecher:erzaehler
    -> END
}
In einer Vitrine steht: „Hale – Ingenieure seit 1850“. Ein Rechenschieber, eine Brückenzeichnung, ein altes Notizbuch. #sprecher:erzaehler
Auf der linken Seite stehen Schachzüge in altmodischer Schrift. Die rechte Seite ist herausgerissen. #sprecher:erzaehler
Das sind meine Züge. #sprecher:ambrose #pause
Und das … das war seine Antwort. Auf der Seite, die fehlt. #sprecher:ambrose #stimmung:traurig
Mein Vater sagt, die Seite war schon immer weg. #sprecher:victor
* [Ein Foto machen]
    -> vitrine_foto
* [Nur ansehen]
    Du siehst lange hin. Dann machst du doch ein Foto. #sprecher:erzaehler
    -> vitrine_foto

=== vitrine_foto ===
~ notizbuchseiteFotografiert = true
Auf dem Foto sind alle Züge der linken Seite zu lesen. #sprecher:erzaehler
Irgendwo gibt es diese Seite. Und ich will wissen, was er geantwortet hat. #sprecher:ambrose
-> END

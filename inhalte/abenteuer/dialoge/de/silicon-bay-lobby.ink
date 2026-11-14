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

// Runde 11 (13.11.2026): Vitrine nach dem Roman (roman/akt3_teil1.md, Kapitel 32): Victor sagt den
// Text der Führung auf, Ambrose erkennt seine Züge, Juno macht das Foto. Klang nach 21_Klangplan.md
// (Stille S46, dann ambrose.victor.einstimmig).

EXTERNAL beginneAufgaben(runde)

VAR held = "Du"
VAR victorLobbyGetroffen = false
VAR reiheTheoBestanden = false
VAR siliconBayAuswertungBestanden = false
VAR victorFalschGesagt = false
VAR notizbuchseiteFotografiert = false
VAR roboterGetroffen = false
VAR tabletNachtGesehen = false

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
Victor sitzt auf dem weißen Sofa der Lobby, unter einem Bildschirm mit dem Gesicht seines Vaters. #sprecher:erzaehler
Mein Vater hält heute drei Reden. Ich muss bei allen klatschen. #sprecher:victor #stimmung:muede
Geh erst zu Dr. Lin. Sie ist die Einzige hier, die noch ein Holzbrett hat. #sprecher:victor #stimmung:nachdenklich
-> END

=== victor_warten ===
Theo misst dich gerade, oder? Er misst alle. Mich auch. #sprecher:victor #stimmung:nachdenklich
-> END

=== victor_berichte ===
Victor steht vor dir, als hätte er schon eine Weile gewartet. Dann hält er dir einen Speicherstift hin. #sprecher:erzaehler
Die Spielberichte der Akademie. Alle Partien vom letzten Jahr, Training und Turnier. Schau sie dir an. #sprecher:victor #stimmung:nachdenklich
* [„Warum?“]
- Weil ich sie mir angeschaut habe. Und ich will, dass jemand anders auch. #sprecher:victor #stimmung:nachdenklich
Er sieht an dir vorbei. Dafür hat er, schätzt du, den ganzen Tag gebraucht. #sprecher:erzaehler
+ [Die Partien auswerten]
    ~ beginneAufgaben("siliconBay.auswertung")
    -> END
* [„Nicht jetzt.“]
    Gut. Aber nicht zu spät. #sprecher:victor #stimmung:nachdenklich
    -> END

=== victor_falsch ===
// Kapitel 33: die Auswertung mit Juno; Ambrose sieht auf das dunkle Tablet. Victors „Das ist
// falsch“ aus der Story-Bibel (Abschnitt 18.1) steht am Schluss.
~ victorFalschGesagt = true
{tabletNachtGesehen:Am Abend, im Hotelzimmer. Du sitzt bis Mitternacht allein auf dem Teppich.|Am Abend, im Hotelzimmer. Juno und du sitzt bis Mitternacht auf dem Teppich.} #sprecher:erzaehler
Im Training spielt Nova vierundsiebzig Prozent, jede Woche, das ganze Jahr. Im Turnier achtundneunzig. #sprecher:erzaehler #musik:spannung
Vielleicht ist sie im Turnier besser. Manche sind das. #sprecher:juno #stimmung:nachdenklich
* [„Nicht so.“]
- Zug einunddreißig, ein Finale im Herbst: ein König ein Feld zur Seite, mitten im Angriff, ohne Grund. #sprecher:erzaehler
Der einzige Zug, der gewinnt. Das zeigt sich erst vierzehn Züge später. #sprecher:erzaehler
* [„Der ist zu gut.“]
- Kann ein Zug zu gut sein? #sprecher:juno #stimmung:ueberrascht
* [„Okafor hätte ihn nicht gefunden. Big Joe nicht. Du?“]
- Ambrose sieht nicht auf die Stellung. Er sieht auf das Tablet auf dem Nachttisch, dunkel. #sprecher:erzaehler
Er antwortet nicht gleich. #sprecher:erzaehler #pause
Nein. Ich nicht. #sprecher:ambrose #stimmung:fern
* [Schlafen gehen]
- Am nächsten Morgen wartet Victor in der Lobby. Er hat die Berichte auch gesehen. Zum ersten Mal sagt er es laut. #sprecher:erzaehler
Das ist falsch. #sprecher:victor #stimmung:ernst
Sag meinem Vater nichts. Noch nicht. Ich muss nachdenken. #sprecher:victor #stimmung:muede
-> END

=== victor_alltag ===
{~Mein Vater hat gefragt, ob du gut bist. Ich hab „ja“ gesagt. Er hat nichts mehr gefragt.|Ich glaube, ich hab heute zum ersten Mal ein Spiel genossen. Gegen dich. Das ist peinlich.|Pass auf Nova auf. Sie hat keine Wahl, glaube ich.} #sprecher:victor #stimmung:laechelt
-> END

// ---------------------------------------------------------------- Empfangsroboter

=== empfangsroboter ===
{roboterGetroffen:
    Willkommen zurück, Besucher. Ihre Genauigkeit wurde gespeichert. #sprecher:empfangsroboter #stimmung:laechelt
    -> END
}
~ roboterGetroffen = true
Ein Roboter mit freundlichem Bildschirmgesicht rollt heran. #sprecher:erzaehler
Willkommen bei Perfect Move. Wir machen Menschen besser. Bitte lächeln Sie für die Kamera. #sprecher:empfangsroboter #stimmung:laechelt
Er lächelt mit Absicht. Das ist unheimlicher als ein Geist. Glaube mir, ich weiß das. #sprecher:ambrose #stimmung:laechelt
-> END

// ---------------------------------------------------------------- Vitrine der Hales (Szene 57)

=== vitrine ===
{notizbuchseiteFotografiert:
    Die Vitrine „Hale – Ingenieure seit 1850“. Das Notizbuch liegt aufgeschlagen, die Seite fehlt noch immer. #sprecher:erzaehler
    -> END
}
Hale. Ingenieure seit 1850. Von der Brücke zum Algorithmus. #sprecher:victor
Victor sagt es auf, weil es zur Führung gehört. Hinter dem Glas liegt ein Rechenschieber aus Elfenbein. #sprecher:erzaehler
Daneben eine Zeichnung, braun vom Alter, lauter Dreiecke. Du erkennst sie, bevor du die Unterschrift liest. #sprecher:erzaehler
Auf einem Pult ein Notizbuch. Schachzüge in zwei Spalten, jeder Buchstabe wie mit dem Lineal gezogen. #sprecher:erzaehler
Die linke Seite ist voll. Die rechte ist herausgerissen, sauber, dicht am Falz. #sprecher:erzaehler #musik:aus #geraeusch:aus
* [Warten]
- Ambrose macht keinen Laut. Diesmal weißt du, dass du warten musst. #sprecher:erzaehler #pause:3
Das sind meine Züge. Die linke Spalte. Jeden einzelnen. #sprecher:ambrose #stimmung:still #musik:ambrose.victor.einstimmig
Ich habe sie in Briefe geschrieben und gewartet. Und er hat sie eingetragen. Mit einem Lineal, vermutlich. #sprecher:ambrose #stimmung:still
Und die Seite, die fehlt. Das war seine Antwort. #sprecher:ambrose #stimmung:traurig
Mein Vater sagt, die Seite war schon immer weg. #sprecher:victor #stimmung:nachdenklich
Victor hat Ambrose nicht gehört. Er sagt es, weil er sieht, wohin du schaust. #sprecher:erzaehler
* [„Wer hat das geschrieben?“]
    -> vitrine_victor

// Victor zählt die Generationen ab; Juno macht das Foto (Kapitel 32).
=== vitrine_victor ===
Er hält den Kopf ein wenig schief. #sprecher:erzaehler
Mein … der Vater vom Vater vom Großvater meines Vaters. Er hat Brücken gebaut. #sprecher:victor #stimmung:nachdenklich
Er soll Schach gespielt haben. Per Post, mit irgendwem aus dem Süden. #sprecher:victor #stimmung:nachdenklich
Mein Vater sagt, es war die einzige Zeitverschwendung, die er sich erlaubt hat. #sprecher:victor #stimmung:bitter
-> vitrine_foto

=== vitrine_foto ===
~ notizbuchseiteFotografiert = true
{tabletNachtGesehen:Du machst ein Foto für Juno.|Juno macht ein Foto.} Der Blitz spiegelt sich in der Scheibe. Auf dem Foto sind alle Züge der linken Seite zu lesen. #sprecher:erzaehler
Ambrose steht vor dem Glas, die Hand erhoben, und rührt es nicht an. #sprecher:erzaehler
Er hat sie aufgehoben. Meine Züge. In einem Buch. #sprecher:ambrose #stimmung:lacht
-> END


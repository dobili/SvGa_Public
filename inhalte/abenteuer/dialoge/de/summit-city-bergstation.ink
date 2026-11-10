// Ort: Bergstation der Seilbahn über Summit City (Akt 4), Bank am Fenster über den Wolken
// (Story-Bibel Abschnitt 29, Weltbeschreibung 5.10).
//
// Szene 88 „An der Bergstation“: Victor nach seiner Niederlage gegen Ward; Wahl „Dann spielen wir“
// oder „Erzähl“, freie Partie (Begegnung summitCity.victorFrei, ohne Uhr, jeder Ausgang führt
// weiter), danach gibt Victor Hales Seite weiter (übergreifende Quest „Die fehlende Seite“, Akt 3
// Szene 57). Versteckter Fund Murmeltierpfeife.
// Einstiege wie in orte.json: victor, fund_pfeife.
//
// Variablen: ausgangSummitCityVictorFrei setzt die Hülle (R42), „abgebrochen“ zählt wie nicht
// gespielt; victorKriseGesehen setzt summit-city-huette.ink; die übrigen setzt diese Datei.
// Die Pfeife kommt über gibFund; Ink merkt sie sich selbst (pfeifeGefunden).

EXTERNAL beginnePartie(begegnung)
EXTERNAL gibFund(kennung)

VAR held = "Du"
VAR victorKriseGesehen = false
VAR victorBergstationGesprochen = false
VAR victorSeiteGegeben = false
VAR ausgangSummitCityVictorFrei = ""
VAR pfeifeGefunden = false

// ---------------------------------------------------------------- Victor

=== victor ===
{
- not victorKriseGesehen: -> victor_vorher
- victorSeiteGegeben: -> victor_alltag
- ausgangSummitCityVictorFrei == "sieg" or ausgangSummitCityVictorFrei == "remis" or ausgangSummitCityVictorFrei == "niederlage": -> victor_seite
- victorBergstationGesprochen: -> victor_angebot
- else: -> victor_bergstation
}

=== victor_vorher ===
Victor steht am Fenster und hört etwas über einen Ohrstöpsel. Als er dich sieht, nimmt er ihn heraus. #sprecher:erzaehler
Nicht jetzt. Ich hab Vorbereitung. Der Coach sagt, ich darf mit niemandem spielen, der nicht im Plan steht. #sprecher:victor
-> END

=== victor_bergstation ===
~ victorBergstationGesprochen = true
Die Gondel hält über den Wolken. Auf der Bank am Fenster sitzt Victor und sieht hinaus, wo nichts ist als Weiß. #sprecher:erzaehler
Du schon wieder. #sprecher:victor #pause
Weißt du, was das Gerät macht? Es brummt einmal, wenn mein Zug gut ist. Zweimal, wenn er schlecht ist. Ich weiß gar nicht mehr, was ich selbst denke. #sprecher:victor
Ich will einmal verlieren dürfen. Einfach so. Ohne dass jemand nachrechnet. #sprecher:victor
+ [„Dann spielen wir. Ohne Uhr, ohne Gerät.“]
    -> victor_spielen
+ [„Erzähl.“]
    Mein Vater meint es gut. Glaube ich. Er hat einen Konzern und einen Sohn, und er verwechselt manchmal, was was ist. #sprecher:victor
    Der Coach ist von Perfect Move. Er hat mir das Gerät gegeben und gesagt, alle machen das. Ich glaube, das stimmt nicht. #sprecher:victor
    Er sagt es zum ersten Mal laut. Lass ihn. #sprecher:ambrose #stimmung:still
    -> victor_angebot

=== victor_angebot ===
Hast du ein Brett dabei? Natürlich hast du ein Brett dabei. #sprecher:victor
+ [„Spielen wir.“]
    -> victor_spielen
+ [„Gleich.“]
    Ich bleib hier. Hier oben ruft keiner an. Kein Netz. #sprecher:victor
    -> END

=== victor_spielen ===
Ihr stellt das alte Brett auf die Bank. Victor sieht es lange an, dann lächelt er schief. #sprecher:erzaehler
Du fängst an. Oder ich. Egal. Das ist das Schöne. #sprecher:victor
~ beginnePartie("summitCity.victorFrei")
-> END

=== victor_seite ===
~ victorSeiteGegeben = true
{
- ausgangSummitCityVictorFrei == "niederlage":
    Gewonnen. Und ich hab es selbst gesehen, ganz allein. #sprecher:victor #stimmung:lacht
- ausgangSummitCityVictorFrei == "remis":
    Remis. Und keiner hat mir gesagt, ob das gut ist. Ich finde, es ist gut. #sprecher:victor #stimmung:froh
- else:
    Verloren. #sprecher:victor #pause
    Und es ist mir egal. Nein, stimmt nicht. Es ist gut so. Dein Springerzug war schön. #sprecher:victor #stimmung:lacht
}
Er hat gelacht. Mitten in der Partie. Hast du es gehört? #sprecher:ambrose #stimmung:froh
Victor zieht ein altes Schachbuch aus dem Rucksack. Zwischen den Seiten steckt ein vergilbtes Blatt. #sprecher:erzaehler
Das gehört in das Notizbuch in der Lobby. Die Seite, die fehlt. Mein Großvater hat sie herausgenommen. #sprecher:victor
Er sagte: Für den Tag, an dem jemand weiterspielt. #sprecher:victor
Er legt dir das Blatt in die Hand. Darauf ein Zug in alter Schrift, und darunter: „Ich warte.“ #sprecher:erzaehler
Ein Hale. #sprecher:ambrose #pause
Ur-ur-ur … Herrje. Ein Hale eben. #sprecher:ambrose #stimmung:friedlich
Ein Hale, der lächelt. Ich habe zu lange gewartet, um das zu sehen. #sprecher:ambrose
Ich fahr runter. Ward soll gegen dich spielen, und ich will zusehen. Richtig zusehen. #sprecher:victor
-> END

=== victor_alltag ===
{~Hier oben ist kein Netz. Ich komme jetzt öfter her.|Mein Vater hat dreimal angerufen. Ich ruf morgen zurück. Vielleicht.|In der Capital Arena spielen wir gegeneinander. Ich freu mich. Ehrlich.} #sprecher:victor
-> END

// ---------------------------------------------------------------- Fund

=== fund_pfeife ===
{pfeifeGefunden:
    Unter der Bank liegt nur noch eine leere Bonbontüte. #sprecher:erzaehler
    -> END
}
~ pfeifeGefunden = true
Unter der Bank am Fenster liegt eine kleine Holzpfeife. Du pfeifst hinein. Draußen am Hang pfeift etwas zurück. #sprecher:erzaehler
Pfeif, und sie pfeifen zurück. Murmeltiere sind höflicher als die meisten Menschen. #sprecher:ambrose #stimmung:lacht
~ gibFund("murmeltierpfeife")
-> END

// >>> Runde 6 (mittel-4)
=== fahrplan ===
Der Fahrplan der Seilbahn: jede halbe Stunde eine Gondel, bei Sturm keine. Darunter ein Zettel: „Schachbretter bitte nicht in der Gondel liegen lassen.“ #sprecher:erzaehler
-> END
// <<< Runde 6 (mittel-4)

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

// Runde 11 (13.11.2026): Kapitel 51 nach dem Roman (roman/akt4_teil1.md): Victor im Hemd am
// Geländer über den Wolken, „Ich will einmal verlieren dürfen“, die Partie auf Junos Reisebrett
// (die Stellung der Fernpartie wird abgebaut und gemerkt), sein erstes Lachen, die Seite mit
// „40. … b5“ und Hales vier Zeilen, „Was sagt er?“ (Gutachten M2.2, M2.6: Buch, Vater weiß es nicht,
// „Wer?“, Ambrose nickt). Klang: bergstation, victor.warm,
// ambrose.hale.grundton.

EXTERNAL beginnePartie(begegnung)
EXTERNAL gibFund(kennung)

VAR held = "Du"
VAR victorGelacht = false
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
Unter der Plattform liegen die Wolken im Tal wie Milch in einer Schüssel. Die Gipfel ragen daraus hervor wie Inseln. #sprecher:erzaehler #musik:aus
Victor sitzt am Geländer, die Knie angezogen, nur im Hemd. Die weiße Jacke liegt neben ihm. #sprecher:erzaehler
* [Dich zwei Meter weiter hinsetzen]
- Du sagst nichts. Von Mrs. Okafor hast du gelernt, wie man das macht. Das Rad dreht sich, eine Gondel fährt hinunter. #sprecher:erzaehler
Ich war fünf, da hat er mir das erste Brett hingestellt. Das Einzige, bei dem man immer weiß, wer besser ist. #sprecher:victor
Mit sieben hab ich ihn geschlagen. Er hat sich so gefreut. Danach hat er aufgehört, mit mir zu spielen. #sprecher:victor
Seit acht Jahren rechnet er nur noch nach. Jede Partie. Er schickt mir die Kurve. #sprecher:victor
* [„Einundsiebzig Prozent. Meine. Menschlich, hat Theo gesagt.“]
- Er gibt ein Geräusch von sich, das fast ein Lachen ist. #sprecher:erzaehler
Ich hab die Brücke gesehen und gedacht: Das ist zu einfach, das hätte es doch gesagt. #sprecher:victor
Ich weiß nicht mehr, welche Züge meine sind. #sprecher:victor
Ich will einmal verlieren dürfen. Einfach so. Ohne dass jemand nachrechnet. Ohne Kurve. #sprecher:victor
+ [Junos Reisebrett aus der Jacke holen]
    -> victor_spielen
+ [„Gleich.“]
    -> victor_angebot

=== victor_angebot ===
Ich bleib hier. Hier oben ruft keiner an. Kein Netz. #sprecher:victor
+ [Junos Reisebrett aus der Jacke holen]
    -> victor_spielen
+ [„Gleich.“]
    -> END

=== victor_spielen ===
Auf dem Reisebrett steht die Stellung, die niemand anrührt. #sprecher:erzaehler #musik:bergstation
Du nimmst die Figuren herunter, eine nach der anderen, und merkst dir, wo sie hingehören. #sprecher:erzaehler
* [„Ohne Uhr. Ohne Gerät. Es zählt für nichts.“]
- Das ist ein Kinderbrett. #sprecher:victor
* [„Juno verliert darauf seit Jahren, und es geht ihr gut.“]
- Er sieht dich an. Dann rückt er herüber. #sprecher:erzaehler
~ beginnePartie("summitCity.victorFrei")
-> END

=== victor_seite ===
~ victorSeiteGegeben = true
{victorGelacht:Er hat gelacht, mitten in der Partie. Zum ersten Mal.|Du weißt nicht, wer gewonnen hat. Es ist nicht wichtig. Victor sieht leichter aus als vorher.} #sprecher:erzaehler #musik:victor.warm
Ein Hale, der lächelt. Ich habe zu lange gewartet, um das zu sehen. #sprecher:ambrose #stimmung:still
* [Ihm zusehen]
- Die Sonne kommt unter die Wolken, alles wird rot. #sprecher:erzaehler
Victor greift in die Innentasche der Jacke. Ein Buch, klein und alt, in Leinen gebunden. #sprecher:erzaehler
Das hat meinem Großvater gehört. Er hat es mir gegeben, als ich sieben war. Mein Vater weiß nicht, dass ich es habe. #sprecher:victor
Er hat gesagt, da ist etwas drin, das soll ich aufheben. Es sei wertlos. Aber man hebe es auf. #sprecher:victor
* [Hinsehen]
- Zwischen den letzten Seiten liegt ein Blatt, herausgerissen, sauber, dicht am Falz. Die Schrift ist klein und senkrecht. #sprecher:erzaehler #musik:aus #pause:2
In Silicon Bay hast du auf das Notizbuch gestarrt. In Ironwood auf ein Geländer. Und du redest mit einem Brett. #sprecher:victor
Ich hab meinen Vater gefragt, wer der Mann aus dem Süden war. Er hat es nicht gewusst. Ich glaub, du weißt es. #sprecher:victor
-> victor_blatt

// Kapitel 51: Hales Antwort von 1867; Ambrose liest sie. Danach „Was sagt er?“.
=== victor_blatt ===
Mein Großvater hat gesagt, das hat schon sein Großvater gesagt. Für den Tag, an dem jemand weiterspielt. #sprecher:victor
„März 1867. 40. … b5.“ Und darunter, in derselben Schrift, vier Zeilen. #sprecher:erzaehler
„Whitlocks vierzigster Zug kam mit der Nachricht seines Todes. Ich habe meinen notiert, wie es sich gehört.“ #sprecher:erzaehler
„Ich werde ihn niemandem schicken können. Für den Tag, an dem jemand weiterspielt.“ #sprecher:erzaehler
* [Ambrose ansehen]
- Er hat geantwortet. #sprecher:ambrose #stimmung:still #pause:2 #musik:ambrose.hale.grundton
Einem Toten. Wie es sich gehört. b5. Natürlich b5. Der gewissenhafte, unerträgliche … #sprecher:ambrose
Ein Hale. Ur-ur-ur … Herrje. Ein Hale eben. #sprecher:ambrose #stimmung:lacht
Was sagt er? #sprecher:victor #pause:2
* [„Wer?“]
- Der, mit dem du redest. Ich hab dir geschrieben, dass ich dir glaube. Wegen des Bretts. #sprecher:victor
Du siehst zu Ambrose. Er nickt. #sprecher:erzaehler #pause
* [„Er sagt, dein Vorfahr war gewissenhaft und unerträglich.“]
- Und dass er hundertsechzig Jahre auf diesen Zug gewartet hat. #sprecher:erzaehler
Wie ist er? Der Zug. Ist er gut? #sprecher:victor
Sag ihm, er ist genau der, den ich an seiner Stelle auch gespielt hätte. #sprecher:ambrose #stimmung:froh
Und dass das die größte Unverschämtheit ist, die mir je begegnet ist. #sprecher:ambrose #stimmung:lacht
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

// Gutachten M2.9: geführter Moment in der freien Partie (begegnungen.json, summitCity.victorFrei).
=== victor_luftig ===
Das ist schlecht. Warum hab ich das gemacht? #sprecher:victor
* [„Weiß ich nicht. Wie fühlt es sich an?“]
- Er denkt nach, ernsthaft, mit schiefem Kopf. #sprecher:erzaehler
Komisch. Luftig. #sprecher:victor #stimmung:lacht
-> END

// Gutachten M2.9: Victors erstes Lachen bei einer Gabel in der freien Partie (Merkmal gabel).
=== victor_gabel ===
{victorGelacht: -> END}
~ victorGelacht = true
Victor starrt auf das Brett. Und dann lacht er. #sprecher:erzaehler #musik:aus
Eine Gabel. Eine ganz gewöhnliche Gabel! Ich hab die nicht gesehen! #sprecher:victor #stimmung:lacht
Das ist so dumm. Das ist so schön dumm. #sprecher:victor #stimmung:lacht
-> END

// Ort: Hauptstraße von Maple Falls (Akt 1). Figuren: Juno, Lily.
//
// Szenen der Story-Bibel (docs/spiel/05_Story_Bibel.md, Abschnitt 4): 5 Erster Schultag, erster
// Teil (Juno an der Bushaltestelle, akt1.ersterSchultag), 8 Lilys Springer (Hilfe-Quest
// mapleFalls.lilysSpringer). Einstiege: „juno“ und „lily“; beide verzweigen nach dem Spielstand.
// springerLilyBestanden setzt die Hülle nach der Aufgabenrunde mapleFalls.springerLily
// (regeln/dialogvariablen.ts). Belohnungen stehen in quests.json.
//
// Neu nach dem Roman zu Akt 1 (docs/spiel/roman/akt1_teil2.md, Kapitel 5) und dem Ortsblatt
// (docs/spiel/20_Ortsblaetter.md, kleine Geschichten): Mrs. Calloway, die Nachbarin. Stufe A ist ein
// Pflichtgespräch auf dem Weg zur Haltestelle; es läuft vor dem ersten Gespräch mit Juno. Die Stufen
// B bis D (Einstieg „calloway“) brauchen eine Figur auf der Birch Lane und je Stufe ein sichtbares
// Ding (zweiter Stuhl, Kartenspiel, Tischchen mit Brett); das folgt mit den Karten.
// Ebenso Carla Martínez, Junos ältere Schwester (Einstieg „carla“, Stufen A bis D), die drei Jahre im
// Team war und aufgehört hat; Stufe C steht vor dem Fenster des Clubraums, Stufe D im Clubraum.

EXTERNAL beginneAufgaben(runde)

VAR ausgangMapleFallsErsteLektion = ""
VAR junoGetroffen = false
VAR clubBeigetreten = false
VAR lilyGetroffen = false
VAR lilyGeholfen = false
VAR springerLilyBestanden = false
VAR nadelMapleFalls = 0
VAR held = "Du"
VAR callowayGetroffen = false
VAR endeAkt1Gesehen = false
VAR nadelIronwood = 0

=== juno ===
{
- not callowayGetroffen and not junoGetroffen and ausgangMapleFallsErsteLektion != "" and ausgangMapleFallsErsteLektion != "abgebrochen": -> calloway_auf_dem_weg
- not junoGetroffen and ausgangMapleFallsErsteLektion != "" and ausgangMapleFallsErsteLektion != "abgebrochen": -> juno_trifft
- not junoGetroffen: -> juno_frueh
- not clubBeigetreten: -> juno_zum_club
- else: -> juno_alltag
}

=== juno_frueh ===
Ein Mädchen mit einem Heft voller Sticker winkt dir zu, aber ihr Bus kommt gerade. #sprecher:erzaehler
Morgen! Ich erklär dir morgen alles! #sprecher:juno #stimmung:froh
-> END

=== juno_trifft ===
// Szene 5 nach dem Roman, Kapitel 5, und der Dialogprüfung (VM27 bis VM29). Stimmung: fremd,
// dann überrumpelt. Juno redet schnell; das Brett steckt im Rucksack.
~ junoGetroffen = true
An der Bushaltestelle steht ein Mädchen mit zwei Zöpfen und einem Heft, das ein Gummiband zusammenhält. Ihr ganzes Gesicht geht auf. #sprecher:erzaehler
Du bist das Kind aus dem Whitlock-Haus! #sprecher:juno #stimmung:froh
Juno Martínez. Zwei Häuser weiter, das gelbe. Alle reden über euch. #sprecher:juno
Mrs. Whitlock hatte siebzehn Katzen, sagt man. Es waren drei. #sprecher:juno
Sie sieht die Ecke des Bretts aus deinem Rucksack ragen. #sprecher:erzaehler
* [„Ich hab es auf dem Dachboden gefunden.“]
    Ein echtes altes Schachbrett? Das ist ja wie im Film! #sprecher:juno
* [„Das ist nur ein altes Brett.“]
    Nur? Das ist ein Zeichen! #sprecher:juno
- Wir brauchen ein viertes Brett, und ich brauche jemanden zum Reden. Spielst du Schach? Sag ja. #sprecher:juno
* [„Ein bisschen.“]
    Ein bisschen reicht! Ich spiele auch nur ein bisschen. Ich verliere meistens. #sprecher:juno #stimmung:froh
* [„Ich kann kaum Schach.“]
    Ich auch nicht. Ich verliere meistens. Es stört mich nicht. #sprecher:juno
- Sie klopft auf das Heft. Das ist das Clubtagebuch. Da kommt alles rein. Du kommst auch rein. Wie schreibt man dich? #sprecher:juno
Nach der Schule, Raum 12 im Erdgeschoss. Keine Ausrede. #sprecher:juno
Eine junge Dame mit Tagebuch und Glitzer. Sie wird dich überallhin schleppen. #sprecher:ambrose
-> END

=== juno_zum_club ===
Raum 12, Erdgeschoss! Coach Delgado beißt nicht. Meistens. #sprecher:juno
-> END

=== juno_alltag ===
{nadelMapleFalls > 0:
    {~Die Clubnadel steht schon im Tagebuch. Mit Glitzer, wie versprochen.|Samstag Cedar Creek! Ich packe Kekse ein. Für die Nerven.}  #sprecher:juno #stimmung:froh
- else:
    {~Ich hab meinen Turm verloren. Schon wieder. Er war so jung.|Das Clubtagebuch hat jetzt eine Seite für dich. Noch leer. Noch!|Sam gibt an, aber er meint es nicht so. Meistens.} #sprecher:juno
}
-> END

=== lily ===
{
- not lilyGetroffen: -> lily_fragt
- springerLilyBestanden and not lilyGeholfen: -> lily_danke
- lilyGeholfen: -> lily_alltag
- else: -> lily_wartet
}

=== lily_fragt ===
// Szene 8 nach dem Roman, Kapitel 6, und der Dialogprüfung (VM43 bis VM47).
~ lilyGetroffen = true
Ein kleines Mädchen sitzt auf dem Bordstein. Auf dem Gehweg ein Schachbrett aus Kreide, schief, neun Felder in einer Reihe. Darauf ein Plastikpferd. #sprecher:erzaehler
Du kannst Schach, oder? Mein Cousin sagt, Mädchen können das Pferd nicht. #sprecher:lily
Der Pferd hüpft doch einfach irgendwohin, oder? #sprecher:lily
* [„Ich zeig es dir.“]
    -> lily_lektion
* [„Gleich, ich hab noch was vor.“]
    Okay. Aber nicht vergessen! #sprecher:lily
    -> END

=== lily_wartet ===
Zeigst du mir jetzt das Pferd? Den Springer, meine ich. #sprecher:lily
* [„Los geht's.“]
    -> lily_lektion
* [„Noch nicht.“]
    Ich warte hier. Ich warte gut. #sprecher:lily
    -> END

=== lily_lektion ===
Erklär es ihr. #sprecher:ambrose
* [„Du kannst das besser.“]
    Sie hört mich nicht. Und selbst wenn. #sprecher:ambrose
* [Neben sie auf den Bordstein setzen]
- Lehre es ihr. Dann weißt du, ob du es kannst. #sprecher:ambrose
Du setzt den Springer auf ihr Brett und fährst mit dem Finger: zwei Felder geradeaus, eins zur Seite. Wie ein L. #sprecher:erzaehler
Dann lässt du ihn über einen Bauern hüpfen. Das darf nur er. #sprecher:erzaehler
* [„Und er springt immer auf die andere Farbe.“]
- Lily sieht dich an, als hättest du ihr ein Geheimnis verraten. #sprecher:erzaehler
Zeig es mir an meinem Brett! #sprecher:lily #stimmung:froh
~ beginneAufgaben("mapleFalls.springerLily")
-> END

=== lily_danke ===
~ lilyGeholfen = true
Ein L! Und immer auf die andere Farbe! Weiß, schwarz, weiß, schwarz! #sprecher:lily #stimmung:froh
Sie lässt das Plastikpferd über den ganzen Gehweg hüpfen, bis zur Ecke. #sprecher:erzaehler
Ambrose sagt nichts. Aber er sieht ihr nach. #sprecher:erzaehler #pause:2
-> END

=== lily_alltag ===
{~Ich hab meinem Cousin eine Gabel gezeigt. Mit dem Springer! Er war sauer.|Der Springer ist mein Lieblingstier. Das ist er wirklich.} #sprecher:lily #stimmung:froh
-> END

// ---------------------------------------------------------------- Mrs. Calloway

// Stufe A (Ankunft), Pflicht vor Juno: Sie spricht von Margaret Whitlock in der Gegenwart.
// Stimmung: fremd, dann überrumpelt. Klang: Die Musik nimmt sich zurück, Vögel und Wasserfall.
=== calloway_auf_dem_weg ===
-> calloway_a ->
Juno winkt dir von der Haltestelle aus zu. #sprecher:erzaehler
-> juno_trifft

=== calloway ===
{
- nadelIronwood > 0: -> calloway_d
- endeAkt1Gesehen: -> calloway_c
- nadelMapleFalls > 0: -> calloway_b
- callowayGetroffen: -> calloway_a_wieder
- else: -> calloway_a -> END
}

=== calloway_a ===
~ callowayGetroffen = true
Gegenüber sitzt eine alte Frau auf ihrer Veranda. Sie hat zwei Stühle. Auf dem zweiten sitzt niemand. #sprecher:erzaehler
Du bist {held}. Ich bin Eunice Calloway. Ich wohne hier seit vierundsechzig. #sprecher:calloway
Ich habe gesehen, wie ihr die Kisten getragen habt. Alle auf einmal. Das ist schlecht für den Rücken. #sprecher:calloway
* [„Guten Morgen, Mrs. Calloway.“]
* [„Es waren nur ein paar Kisten.“]
    Einundzwanzig. Ich habe gezählt. #sprecher:calloway
- Margaret trägt nie mehr als eine. Sie sagt, man hat Zeit. #sprecher:calloway
Jeden Sonntag spielt sie Schach. Gegen Leute, die sie nie gesehen hat. Per Post. Ein Zug, eine Briefmarke. #sprecher:calloway
Sie sagt „spielt“. Nicht „spielte“. #sprecher:erzaehler #pause
Die Kisten auf dem Dachboden hat nie jemand aufgemacht. Nicht mal sie. #sprecher:calloway
Dann blinzelt sie, als käme sie von weit her zurück, und lächelt. #sprecher:erzaehler
Du kommst zu spät zur Schule, Kind. #sprecher:calloway #stimmung:froh
// Roman: Ambrose schweigt, bis sie außer Hörweite sind. Vorgemerkt: #pause:3 vor seinem Satz.
Ambrose schweigt, bis ihr außer Hörweite seid. #sprecher:erzaehler #pause
Per Post. Sechzig Jahre lang. #sprecher:ambrose #stimmung:still
An meinem Tisch. #sprecher:ambrose #stimmung:still
->->

=== calloway_a_wieder ===
{~Margaret sagt, man hat Zeit. Sie hat recht. Man hat immer mehr, als man denkt.|Zwei Kisten auf einmal, höchstens. Merk dir das.|Sonntags kommt die Post spät hier. Margaret wartet trotzdem am Fenster.} #sprecher:calloway
-> END

// Stufe B (nach der Clubnadel): Auf dem leeren Stuhl liegt ein Kartenspiel.
=== calloway_b ===
Auf dem zweiten Stuhl liegt jetzt ein Kartenspiel. Mrs. Calloway mischt es, ohne hinzusehen. #sprecher:erzaehler
Man hat mir erzählt, du hast der Lehrerin eine Nadel abgenommen. #sprecher:calloway
* [„Es war knapp.“]
    Knapp ist gut. Knapp heißt, beide haben sich Mühe gegeben. #sprecher:calloway
* [„Ich habe gezählt.“]
    Das hätte Margaret gefallen. Sie hat sogar die Briefmarken gezählt. #sprecher:calloway
- Margaret hätte dich gemocht. Sie mochte Leute, die verlieren können. #sprecher:calloway #stimmung:froh
Leute, die verlieren können. Dann hätte sie mich nicht gemocht. #sprecher:ambrose #stimmung:lacht
-> END

// Stufe C (nach Akt 1): Owen Fisk sitzt auf dem zweiten Stuhl und lernt Karten. Sie spricht von
// Margaret zum ersten Mal in der Vergangenheit.
=== calloway_c ===
Auf dem zweiten Stuhl sitzt ein Junge mit Fahrradhelm und hält fünf Karten wie einen Fächer. Owen Fisk von gegenüber. #sprecher:erzaehler
Ich bringe ihm Rommé bei. Er bringt mir bei, wie man ein Telefon lauter stellt. #sprecher:calloway #stimmung:froh
Margaret hat nie Karten gespielt. Sie fand, Karten sind Glück, und Glück war ihr zu laut. #sprecher:calloway
Sie sagt „hat“. Nicht mehr „spielt“. #sprecher:erzaehler #pause
* [„Sie fehlt Ihnen.“]
    Jeden Sonntag. Aber jetzt ist wenigstens der Stuhl nicht mehr leer. #sprecher:calloway
* [„Owen, du hältst die Karten falsch herum.“]
    Owen dreht die Karten um. Mrs. Calloway lacht so laut, dass eine Taube auffliegt. #sprecher:erzaehler
- -> END

// Stufe D (nach Akt 2): ein kleiner Tisch zwischen den Stühlen, darauf ein Schachbrett. Sie lernt
// es von Owen. Endet warm.
=== calloway_d ===
Zwischen den beiden Stühlen steht ein kleiner Tisch, darauf ein Schachbrett. Owen erklärt. Mrs. Calloway runzelt die Stirn. #sprecher:erzaehler
Der Springer, sagt der Junge, springt immer auf die andere Farbe. Stimmt das? #sprecher:calloway
* [„Das stimmt. Immer.“]
    Dann hat er es von Lily. Und Lily hat es von dir. So geht das hier. #sprecher:calloway #stimmung:froh
* [„Wer hat ihm das beigebracht?“]
    Lily von nebenan. Und die sagt, sie hat es von dir. #sprecher:calloway #stimmung:froh
- Seit vierundsechzig wohne ich neben einem Schachbrett. Jetzt fange ich an. #sprecher:calloway
Margaret hätte gelacht. Sie hat oft gelacht. Das weiß kaum einer. #sprecher:calloway
Das wusste ich nicht. #sprecher:ambrose #stimmung:still
-> END

// ---------------------------------------------------------------- Carla Martínez

// Kleine Geschichte nach dem Ortsblatt: Carla tut, als hätte Schach sie nie interessiert, und kommt
// über die Akte zurück. Keine Aufgabe, keine Belohnung; jede Stufe ändert etwas Sichtbares.
=== carla ===
{
- nadelIronwood > 0: -> carla_d
- endeAkt1Gesehen: -> carla_c
- nadelMapleFalls > 0: -> carla_b
- else: -> carla_a
}

// Stufe A (Ankunft): Sie repariert ein Fahrrad am Zaun und winkt ab, wenn es um Schach geht.
=== carla_a ===
Vor dem gelben Haus kniet ein Mädchen, älter als Juno, und schraubt an einem Fahrrad. #sprecher:erzaehler
Du bist Junos neues viertes Brett? Viel Glück. Sie redet, bis du umfällst. #sprecher:carla
* [„Spielst du auch Schach?“]
    Hab ich mal. Jetzt hab ich fast ein Auto. #sprecher:carla
* [„Juno sagt, du warst gut.“]
    Juno sagt viel. #sprecher:carla
- Sie winkt ab und dreht weiter an der Kette. #sprecher:erzaehler
-> END

// Stufe B (nach der Clubnadel): Das Fahrrad ist fertig. Sie kennt die Eröffnung.
=== carla_b ===
Das Fahrrad steht fertig am Zaun. Carla schiebt es gerade auf die Straße. #sprecher:erzaehler
Und? Wie war der Clubkampf? #sprecher:carla
* [„Gewonnen. Gegen den Coach.“]
    Echt? Gegen Delgado? #sprecher:carla
* [„Knapp.“]
    Gegen Delgado ist es immer knapp. #sprecher:carla
- Italienisch, oder? Läufer nach c4, und dann wartet sie nur auf ihren Angriff. #sprecher:carla
Sie merkt, was sie gesagt hat, und steigt auf das Rad. #sprecher:erzaehler
Sie kennt die Eröffnung. Und die Trainerin. Man vergisst nicht, was man geliebt hat. #sprecher:ambrose
-> END

// Stufe C (nach Akt 1): Sie steht von außen am Fenster des Clubraums und schaut zu. Sie geht,
// wenn man sie anspricht.
=== carla_c ===
Vor dem Fenster des Clubraums steht Carla und sieht hinein. Drinnen spielen zwei Kinder aus der Sechsten. #sprecher:erzaehler
* [„Willst du nicht reinkommen?“]
    Nur geguckt. Ich muss los. #sprecher:carla
* [Neben sie stellen und mitschauen]
    Ihr schaut zusammen zu. Dann sagt sie: „Der Kleine stellt seinen Läufer ein.“ Und geht. #sprecher:erzaehler
- Am Fenster bleibt ein Abdruck ihrer Hand. #sprecher:erzaehler
-> END

// Stufe D (nach Akt 2): Sie sitzt im Clubraum am Brett mit der fehlenden Dame und bringt Jüngeren
// das Zählen bei. Gehört dann in den Clubraum.
=== carla_d ===
Carla sitzt am Brett mit dem Radiergummi. Vor ihr zwei Kinder aus der Sechsten. #sprecher:erzaehler
Wer greift an? Wer verteidigt? Erst zählen, dann schlagen. #sprecher:carla
Sie sieht dich und zuckt die Schultern. #sprecher:erzaehler
Delgado hat gefragt. Und ich hatte samstags eh nichts vor. #sprecher:carla
* [„Schön, dass du da bist.“]
    Sag Juno nichts. Sonst steht es morgen im Tagebuch. Mit Glitzer. #sprecher:carla
* [„Der Radiergummi hat schon zwei Partien gewonnen.“]
    Drei. Heute Morgen noch eine. #sprecher:carla #stimmung:froh
- Sie kommt zurück. So fängt es an. #sprecher:ambrose #stimmung:still
-> END

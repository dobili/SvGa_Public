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
~ junoGetroffen = true
Du bist das Kind aus dem Whitlock-Haus! Ich bin Juno. Ich wohne zwei Häuser weiter. #sprecher:juno #stimmung:froh
Alle reden über euch. #sprecher:juno
Mrs. Whitlock hatte siebzehn Katzen, sagt man. Es waren drei. #sprecher:juno
Sie sieht das Brett unter deinem Arm. #sprecher:erzaehler
* [„Ich hab es auf dem Dachboden gefunden.“]
    Ein echtes altes Schachbrett? Das ist ja wie im Film! #sprecher:juno
* [„Das ist nur ein altes Brett.“]
    Nur? Das ist ein Zeichen! #sprecher:juno
- Wir haben ein Schachteam. Coach Delgado sucht dringend ein viertes Brett für die Kreisliga. #sprecher:juno
Ich spiele auch. Schlecht. Aber mit Herz. #sprecher:juno
* [„Ich komme mit.“]
    Perfekt! Nach der Schule, Clubraum im ersten Stock. #sprecher:juno #stimmung:froh
* [„Ich kann kaum Schach.“]
    Ich auch nicht. Deshalb brauche ich jemanden zum Reden. #sprecher:juno
    Nach der Schule, Clubraum im ersten Stock. Keine Ausrede. #sprecher:juno
- Eine junge Dame mit Tagebuch und Glitzer. Sie wird dich überallhin schleppen. Gut so. #sprecher:ambrose
-> END

=== juno_zum_club ===
Clubraum, erster Stock! Coach Delgado beißt nicht. Meistens. #sprecher:juno
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
~ lilyGetroffen = true
Ein kleines Mädchen sitzt vor dem Nachbarhaus und starrt auf einen Springer aus Plastik. #sprecher:erzaehler
Du kannst Schach, oder? Mein Cousin sagt, ich bin zu doof für das Pferd. #sprecher:lily
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
Lehre es ihr. Dann weißt du, ob du es kannst. Ich sage nichts. #sprecher:ambrose
Du setzt den Springer auf ihr Brett und fährst mit dem Finger: zwei Felder geradeaus, eins zur Seite. Wie ein L. #sprecher:erzaehler
Dann lässt du ihn über einen Bauern hüpfen. Das darf nur er. #sprecher:erzaehler
Zeig es mir an meinem Brett! #sprecher:lily #stimmung:froh
~ beginneAufgaben("mapleFalls.springerLily")
-> END

=== lily_danke ===
~ lilyGeholfen = true
Ein L! Immer ein L! Mein Cousin wird staunen. #sprecher:lily #stimmung:froh
Du hast es erklärt, ohne mich. Ich bin, nun ja, ein wenig stolz. Sag es niemandem. #sprecher:ambrose #stimmung:stolz
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

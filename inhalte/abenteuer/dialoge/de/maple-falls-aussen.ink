// Ort: Hauptstraße von Maple Falls (Akt 1). Figuren: Juno, Lily.
//
// Szenen der Story-Bibel (docs/spiel/05_Story_Bibel.md, Abschnitt 4): 5 Erster Schultag, erster
// Teil (Juno an der Bushaltestelle, akt1.ersterSchultag), 8 Lilys Springer (Hilfe-Quest
// mapleFalls.lilysSpringer). Einstiege: „juno“ und „lily“; beide verzweigen nach dem Spielstand.
// Einstieg „schultuer“ (Übergang „schule“ in orte.json): Wer Juno noch nicht kennt, trifft sie dort
// von selbst, bevor er die Schule betritt; im Clubraum gilt sie als bekannt („Juno, wen bringst du
// mir da?“, maple-falls-clubraum.coach_erstes_treffen).
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
EXTERNAL reise(karte, ausloeser)

VAR nadelRiverton = 0
VAR einladungGesehen = false
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
// Aus capital-arena-aussen.ink: Nach dem Abschied (Szene 109) spricht Ambrose nicht mehr
// (Story-Bibel Abschnitt 33, Frage 5; Entscheidung Q21-5). Hier nur gelesen.
VAR abschiedGesehen = false
// Einleitung (Wunsch des Autors, 19.11.2026): läuft beim ersten Betreten von selbst (orte.json,
// Feld „eingang“ der Karte mapleFalls.aussen), solange das Brett noch nicht berührt ist.
VAR einleitungGesehen = false
VAR brettBeruehrt = false

=== juno ===
// Alte Spielstände (vor der Schultür, 17.11.2026): Wer schon im Club ist, kennt Juno von dort; das
// erste Treffen läuft dann nicht mehr nach, auch nicht nach dem Finale.
{clubBeigetreten:
    ~ junoGetroffen = true
}
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
Juno Martínez. Zwei Häuser weiter, das gelbe. Alle reden über euch. #sprecher:juno #stimmung:laechelt
Mrs. Whitlock hatte siebzehn Katzen, sagt man. Es waren drei. #sprecher:juno #stimmung:lacht
Sie sieht die Ecke des Bretts aus deinem Rucksack ragen. #sprecher:erzaehler
* [„Ich hab es auf dem Dachboden gefunden.“]
    Ein echtes altes Schachbrett? Das ist ja wie im Film! #sprecher:juno #stimmung:ueberrascht
* [„Das ist nur ein altes Brett.“]
    Nur? Das ist ein Zeichen! #sprecher:juno #stimmung:laechelt
- Wir brauchen ein viertes Brett, und ich brauche jemanden zum Reden. Spielst du Schach? Sag ja. #sprecher:juno #stimmung:laechelt
* [„Ein bisschen.“]
    Ein bisschen reicht! Ich spiele auch nur ein bisschen. Ich verliere meistens. #sprecher:juno #stimmung:froh
* [„Ich kann kaum Schach.“]
    Ich auch nicht. Ich verliere meistens. Es stört mich nicht. #sprecher:juno #stimmung:laechelt
- Sie klopft auf das Heft. #sprecher:erzaehler
Das ist das Clubtagebuch. Da kommt alles rein. Du kommst auch rein. Wie schreibt man dich? #sprecher:juno #stimmung:laechelt
Nach der Schule, Raum 12 im Erdgeschoss. Keine Ausrede. #sprecher:juno #stimmung:laechelt
{not abschiedGesehen:
    Eine junge Dame mit Tagebuch und Glitzer. Sie wird dich überallhin schleppen. #sprecher:ambrose #stimmung:laechelt
}
-> END

// Die Schultür (Übergang „schule“, wenn: junoGetroffen oder clubBeigetreten). Warum: Das Treffen an
// der Haltestelle war überspringbar; ein Prüfspieler kam ohne es in den Club und bis ins Finale, die
// Szene lief dann danach (Bericht ambrose_danach_17-11, Nebenbefunde). Die Haltestelle liegt gleich
// neben der Schule; Juno ruft, die Szene läuft von selbst, danach geht die Tür auf. Die App fragt
// `wenn` nach dem Dialog mit den neuen Variablen (oberwelt/useDialogende.ts).
=== schultuer ===
{junoGetroffen or clubBeigetreten: -> END}
Du hast die Hand schon an der Schultür, da ruft jemand von der Bushaltestelle nebenan. Du drehst dich um. #sprecher:erzaehler
-> juno_trifft

=== juno_zum_club ===
Raum 12, Erdgeschoss! Coach Delgado beißt nicht. Meistens. #sprecher:juno #stimmung:lacht
-> END

// Lektorat Akt 2 (17.11.2026): Juno reist mit; zu Hause redet sie über den Stand der Reise.
=== function junoStand() ===
{
- einladungGesehen:
    ~ return "Silicon Bay! Ich hab im Tagebuch schon eine Seite freigemacht. Mit Glitzerrand."
- nadelIronwood > 0:
    ~ return "Vier Nadeln im Tagebuch. Und ein Foto von deiner Mama. Mit Glitzer, diesmal ja."
- nadelRiverton > 0:
    ~ return "Riverton hat im Tagebuch sieben Seiten. Eine davon ist nur Regen."
- endeAkt1Gesehen:
    ~ return "Cedar Creek hat im Tagebuch vier Seiten bekommen. Und einen Fettfleck von den Keksen."
- else:
    ~ return "Samstag Cedar Creek! Ich packe Kekse ein. Für die Nerven."
}

=== juno_alltag ===
{nadelMapleFalls > 0:
    {~Die Clubnadel steht schon im Tagebuch. Mit Glitzer, wie versprochen.|{junoStand()}}  #sprecher:juno #stimmung:froh
- else:
    {~Ich hab meinen Turm verloren. Schon wieder. Er war so jung.|Das Clubtagebuch hat jetzt eine Seite für dich. Noch leer. Noch!|Sam gibt an, aber er meint es nicht so. Meistens.} #sprecher:juno #stimmung:lacht
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
Kannst du Schach? Mein Cousin sagt, Mädchen können das Pferd nicht. #sprecher:lily #stimmung:nachdenklich
Der Pferd hüpft doch einfach irgendwohin, oder? #sprecher:lily #stimmung:nachdenklich
* [„Ich zeig es dir.“]
    -> lily_lektion
* [„Gleich, ich hab noch was vor.“]
    Okay. Aber nicht vergessen! #sprecher:lily #stimmung:laechelt
    -> END

=== lily_wartet ===
Zeigst du mir jetzt das Pferd? Den Springer, meine ich. #sprecher:lily #stimmung:laechelt
* [„Los geht's.“]
    -> lily_lektion
* [„Noch nicht.“]
    Ich warte hier. Ich warte gut. #sprecher:lily #stimmung:laechelt
    -> END

=== lily_lektion ===
// Nach dem Abschied (abschiedGesehen) fordert Ambrose nicht mehr auf: {held} setzt sich gleich zu Lily.
{abschiedGesehen: -> erklaeren}
Erklär es ihr. #sprecher:ambrose #stimmung:laechelt
* [„Du kannst das besser.“]
    Sie hört mich nicht. Und selbst wenn. #sprecher:ambrose #stimmung:nachdenklich
* [Neben sie auf den Bordstein setzen]
- Lehre es ihr. Dann weißt du, ob du es kannst. #sprecher:ambrose #stimmung:laechelt
-> erklaeren

= erklaeren
Du setzt den Springer auf ihr Brett und fährst mit dem Finger: zwei Felder geradeaus, eins zur Seite. Wie ein L. #sprecher:erzaehler
Dann lässt du ihn über einen Bauern hüpfen. Das darf nur er. #sprecher:erzaehler
* [„Und er springt immer auf die andere Farbe.“]
- Lily sieht dich an, als hättest du ihr ein Geheimnis verraten. #sprecher:erzaehler
Du malst mit ihrer Kreide zwei Kreuze auf den Gehweg und setzt den Springer so, dass er beide erreicht. #sprecher:erzaehler
* [„Jetzt greift er zwei auf einmal an. Das heißt Gabel.“]
- Zwei auf einmal? Dann kann ja nur einer weglaufen! #sprecher:lily #stimmung:froh
Noch mal! Zeig mir, wo er zwei erwischt! #sprecher:lily #stimmung:froh
~ beginneAufgaben("mapleFalls.springerLily")
-> END

=== lily_danke ===
~ lilyGeholfen = true
Ein L! Immer auf die andere Farbe! Und zwei auf einmal, das ist die Gabel! #sprecher:lily #stimmung:froh #klang:aha
Sie lässt das Plastikpferd über den ganzen Gehweg hüpfen, bis zur Ecke. #sprecher:erzaehler
{not abschiedGesehen:
    Ambrose sagt nichts. Aber er sieht ihr nach. #sprecher:erzaehler #pause:2
}
-> END

=== lily_alltag ===
{~Ich hab meinem Cousin eine Gabel gezeigt. Mit dem Springer! Er war sauer.|Der Springer ist mein Lieblingstier. Das ist er wirklich.} #sprecher:lily #stimmung:froh
-> END

// ---------------------------------------------------------------- Mrs. Calloway

// Stufe A (Ankunft), Pflicht vor Juno: Sie spricht von Margaret Whitlock in der Gegenwart.
// Stimmung: fremd, dann überrumpelt. Klang: Die Musik nimmt sich zurück, Vögel und Wasserfall.
=== calloway_auf_dem_weg ===
-> calloway_a ->
Von der Haltestelle winkt dir jemand zu. #sprecher:erzaehler
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
Gegenüber sitzt eine alte Frau auf ihrer Veranda. Sie hat zwei Stühle. Auf dem zweiten sitzt niemand. #sprecher:erzaehler #musik:aus
Du bist {held}. Ich bin Eunice Calloway. Ich wohne hier seit vierundsechzig. #sprecher:calloway #stimmung:laechelt
Ich habe gesehen, wie ihr die Kisten getragen habt. Alle auf einmal. Das ist schlecht für den Rücken. #sprecher:calloway #stimmung:nachdenklich
* [„Guten Morgen, Mrs. Calloway.“]
* [„Es waren nur ein paar Kisten.“]
    Einundzwanzig. Ich habe gezählt. #sprecher:calloway #stimmung:laechelt
- Margaret trägt nie mehr als eine. Sie sagt, man hat Zeit. #sprecher:calloway #stimmung:laechelt
Jeden Sonntag spielt sie Schach. Gegen Leute, die sie nie gesehen hat. Per Post. Ein Zug, eine Briefmarke. #sprecher:calloway #stimmung:laechelt
Sie sagt „spielt“. Nicht „spielte“. #sprecher:erzaehler #pause
Die Kisten auf dem Dachboden hat nie jemand aufgemacht. Nicht mal sie. #sprecher:calloway #stimmung:nachdenklich
Dann blinzelt sie, als käme sie von weit her zurück, und lächelt. #sprecher:erzaehler
Du kommst zu spät zur Schule, Kind. #sprecher:calloway #stimmung:froh
// Roman: Ambrose schweigt, bis sie außer Hörweite sind.
{not abschiedGesehen:
    Ambrose schweigt, bis ihr außer Hörweite seid. #sprecher:erzaehler #pause:3
    Per Post. Sechzig Jahre lang. #sprecher:ambrose #stimmung:still
    An meinem Tisch. #sprecher:ambrose #stimmung:still #musik:karte
}
->->

=== calloway_a_wieder ===
{~Margaret sagt, man hat Zeit. Sie hat recht. Man hat immer mehr, als man denkt.|Zwei Kisten auf einmal, höchstens. Merk dir das.|Sonntags kommt die Post spät hier. Margaret wartet trotzdem am Fenster.} #sprecher:calloway #stimmung:laechelt
-> END

// Stufe B (nach der Clubnadel): Auf dem leeren Stuhl liegt ein Kartenspiel.
=== calloway_b ===
Auf dem zweiten Stuhl liegt jetzt ein Kartenspiel. Mrs. Calloway mischt es, ohne hinzusehen. #sprecher:erzaehler
Man hat mir erzählt, du hast der Lehrerin eine Nadel abgenommen. #sprecher:calloway #stimmung:laechelt
* [„Es war knapp.“]
    Knapp ist gut. Knapp heißt, beide haben sich Mühe gegeben. #sprecher:calloway #stimmung:laechelt
* [„Ich habe gezählt.“]
    Das würde Margaret gefallen. Sie zählt sogar die Briefmarken. #sprecher:calloway #stimmung:laechelt
- Margaret würde dich mögen. Sie mag Leute, die verlieren können. #sprecher:calloway #stimmung:froh
Leute, die verlieren können. Dann hätte sie mich nicht gemocht. #sprecher:ambrose #stimmung:lacht
-> END

// Stufe C (nach Akt 1): Owen Fisk sitzt auf dem zweiten Stuhl und lernt Karten. Sie spricht von
// Margaret zum ersten Mal in der Vergangenheit.
=== calloway_c ===
Auf dem zweiten Stuhl sitzt ein Junge mit Fahrradhelm und hält fünf Karten wie einen Fächer. Owen Fisk von gegenüber. #sprecher:erzaehler
Ich bringe ihm Rommé bei. Er bringt mir bei, wie man ein Telefon lauter stellt. #sprecher:calloway #stimmung:froh
Margaret hat nie Karten gespielt. Sie fand, Karten sind Glück, und Glück war ihr zu laut. #sprecher:calloway #stimmung:nachdenklich
Sie sagt „hat“. Nicht mehr „spielt“. #sprecher:erzaehler #pause
* [„Sie fehlt Ihnen.“]
    Jeden Sonntag. Aber jetzt ist wenigstens der Stuhl nicht mehr leer. #sprecher:calloway #stimmung:laechelt
* [„Owen, du hältst die Karten falsch herum.“]
    Owen dreht die Karten um. Mrs. Calloway lacht so laut, dass eine Taube auffliegt. #sprecher:erzaehler
- -> END

// Stufe D (nach Akt 2): ein kleiner Tisch zwischen den Stühlen, darauf ein Schachbrett. Sie lernt
// es von Owen. Endet warm.
=== calloway_d ===
Zwischen den beiden Stühlen steht ein kleiner Tisch, darauf ein Schachbrett. Owen erklärt. Mrs. Calloway runzelt die Stirn. #sprecher:erzaehler
Der Springer, sagt der Junge, springt immer auf die andere Farbe. Stimmt das? #sprecher:calloway #stimmung:nachdenklich
* [„Das stimmt. Immer.“]
    {lilyGeholfen:Dann hat er es von Lily. Und Lily hat es von dir. So geht das hier.|Dann hat er es von Lily von nebenan. Die weiß alles über Pferde.} #sprecher:calloway #stimmung:froh
* [„Wer hat ihm das beigebracht?“]
    {lilyGeholfen:Lily von nebenan. Und die sagt, sie hat es von dir.|Lily von nebenan. Die weiß alles über Pferde.} #sprecher:calloway #stimmung:froh
- Seit vierundsechzig wohne ich neben einem Schachbrett. Jetzt fange ich an. #sprecher:calloway #stimmung:laechelt
Margaret hätte gelacht. Sie hat oft gelacht. Das weiß kaum einer. #sprecher:calloway #stimmung:laechelt
{not abschiedGesehen:
    Das wusste ich nicht. #sprecher:ambrose #stimmung:still
}
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
{junoGetroffen:Du bist Junos neues viertes Brett? Viel Glück. Sie redet, bis du umfällst.|Du bist aus dem Whitlock-Haus, oder? Meine Schwester Juno sucht ein viertes Brett fürs Schachteam. Sie findet dich.} #sprecher:carla #stimmung:laechelt
* [„Spielst du auch Schach?“]
    Hab ich mal. Jetzt hab ich fast ein Auto. #sprecher:carla #stimmung:laechelt
* {junoGetroffen} [„Juno sagt, du warst gut.“]
    Juno sagt viel. #sprecher:carla #stimmung:nachdenklich
- Sie winkt ab und dreht weiter an der Kette. #sprecher:erzaehler
-> END

// Stufe B (nach der Clubnadel): Das Fahrrad ist fertig. Sie kennt die Eröffnung.
=== carla_b ===
Das Fahrrad steht fertig am Zaun. Carla schiebt es gerade auf die Straße. #sprecher:erzaehler
Und? Wie war der Clubkampf? #sprecher:carla #stimmung:laechelt
* [„Gewonnen. Gegen den Coach.“]
    Echt? Gegen Delgado? #sprecher:carla #stimmung:ueberrascht
* [„Knapp.“]
    Gegen Delgado ist es immer knapp. #sprecher:carla #stimmung:laechelt
- Italienisch, oder? Läufer nach c4, und dann wartet sie nur auf ihren Angriff. #sprecher:carla #stimmung:nachdenklich
Sie merkt, was sie gesagt hat, und steigt auf das Rad. #sprecher:erzaehler
Sie kennt die Eröffnung. Und die Trainerin. Man vergisst nicht, was man geliebt hat. #sprecher:ambrose #stimmung:nachdenklich
-> END

// Stufe C (nach Akt 1): Sie steht von außen am Fenster des Clubraums und schaut zu. Sie geht,
// wenn man sie anspricht.
=== carla_c ===
Vor dem Fenster des Clubraums steht Carla und sieht hinein. Drinnen spielen zwei Kinder aus der Sechsten. #sprecher:erzaehler
* [„Willst du nicht reinkommen?“]
    Nur geguckt. Ich muss los. #sprecher:carla #stimmung:nachdenklich
* [Neben sie stellen und mitschauen]
    Ihr schaut zusammen zu. Dann sagt sie: „Der Kleine stellt seinen Läufer ein.“ Und geht. #sprecher:erzaehler
- Am Fenster bleibt ein Abdruck ihrer Hand. #sprecher:erzaehler
-> END

// Stufe D (nach Akt 2): Sie sitzt im Clubraum am Brett mit der fehlenden Dame und bringt Jüngeren
// das Zählen bei. Gehört dann in den Clubraum.
=== carla_d ===
Carla sitzt am Brett mit dem Radiergummi. Vor ihr zwei Kinder aus der Sechsten. #sprecher:erzaehler
Wer greift an? Wer verteidigt? Erst zählen, dann schlagen. #sprecher:carla #stimmung:laechelt
Sie sieht dich und zuckt die Schultern. #sprecher:erzaehler
Delgado hat gefragt. Und ich hatte samstags eh nichts vor. #sprecher:carla #stimmung:laechelt
* [„Schön, dass du da bist.“]
    Sag Juno nichts. Sonst steht es morgen im Tagebuch. Mit Glitzer. #sprecher:carla #stimmung:laechelt
* [„Der Radiergummi hat schon zwei Partien gewonnen.“]
    Drei. Heute Morgen noch eine. #sprecher:carla #stimmung:froh
- {not abschiedGesehen: Sie kommt zurück. So fängt es an. #sprecher:ambrose #stimmung:still}
-> END

// Rückmeldung nach der Runde (runden.json `danach`; Wunsch des Autors, 19.11.2026): nicht bestanden ein Satz von Lily; bestanden wie bisher (lily_danke).
=== lily_lektion_danach ===
{springerLilyBestanden: -> lily}
Lily schiebt das Plastikpferd über den Gehweg. Es hüpft mal zwei Felder, mal drei. #sprecher:erzaehler
Hüpft der jetzt gerade oder schief? Zeig's mir nochmal, ja? #sprecher:lily #stimmung:nachdenklich
-> END

// ---------------------------------------------------------------- Einleitung

=== einleitung ===
// Spielbeginn nach dem Roman, Kapitel 1 (docs/spiel/roman/akt1_teil1.md) und der Story-Bibel 2.3:
// Ende August, Mama hat eine neue Stelle im Kreiskrankenhaus, das Haus an der Birch Lane. Wunsch
// des Autors (19.11.2026): nicht in die Geschichte geworfen werden, sondern mit Mama ankommen und
// wissen, warum man auf den Dachboden geht. Die Bilder liefert Gemini (Auftrag
// docs/spiel/auftraege/gemini_einleitung_19-11.html); bis dahin steht nur der Text.
// Danach gehen beide hinein: Die Reise ins Wohnzimmer verhindert, dass man vor dem Dachboden
// schon durch die ganze Stadt läuft (Schule, Juno, Weg nach Cedar Creek).
~ einleitungGesehen = true
Ende August. Drei Tage Packen, ein langer Tag im Auto. Hinter dem Ortsschild von Maple Falls rauscht irgendwo Wasser. #sprecher:erzaehler #bild:einzug_fahrt #musik:aus
Birch Lane. Ein altes Holzhaus mit Veranda, davor ein Ahorn, dessen Blätter an den Rändern schon rot sind. Am Bordstein steht der Umzugswagen mit offener Klappe. #sprecher:erzaehler #bild:einzug_haus
Mama stellt den Motor ab und bleibt einen Moment sitzen, die Hände noch am Lenkrad. #sprecher:erzaehler #bild:aus
Das ist es. Unser Haus. #sprecher:mutter #stimmung:muede
Ich weiß, es ist nicht die alte Wohnung. Aber es hat einen Garten. Und einen Dachboden, so groß wie unsere ganze alte Küche. #sprecher:mutter #stimmung:laechelt
* [„Und eine Schule voller Leute, die ich nicht kenne.“]
    Die kennst du in einer Woche. Ich fange am Montag im Krankenhaus an, da kenne ich auch keinen. #sprecher:mutter #stimmung:nachdenklich
* [„Bleiben wir diesmal?“]
    Diesmal bleiben wir. Das Haus gehört jetzt uns. Die Bank sieht das noch etwas anders, aber uns. #sprecher:mutter #stimmung:laechelt
- Die Möbelpacker tragen das Sofa hinein, schief, wie alles heute. #sprecher:erzaehler
Nimm einen Karton, irgendeinen. Wir gehen zusammen rein. #sprecher:mutter #stimmung:muede
-> einleitung_hinein

=== einleitung_hinein ===
* [Einen Karton nehmen und mit Mama hineingehen]
    ~ reise("mapleFalls.wohnzimmer", "haustuer")
    -> END

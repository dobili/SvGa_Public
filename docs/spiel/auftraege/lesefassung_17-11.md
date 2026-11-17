# Schach-Abenteuer: Lesefassung eines vollständigen Spielverlaufs

Erzeugt mit `node pipeline/abenteuer/lesefassung.cjs --ziel DATEI.md --startwert 1`. Der Startwert legt nur die wechselnden Sätze fest (Zufallsfolgen in Ink); gleicher Aufruf, gleiche Datei.

**Reihenfolge.** Der Spieler geht die Gebiete in der Reihenfolge der Geschichte ab, fasst auf jeder Karte alles an (Figuren, Dinge zum Ansehen, Auslöser) und kommt in jedem neuen Zustand wieder; Nebenquests nimmt er mit. Am Ende holt er nie besuchte Orte nach und reist zu offenen Quests zurück (Teil „Nach dem Abspann“). Das ist der Weg der Gesamtsimulation (`pipeline/abenteuer/gesamtsimulation.cjs`), mit echtem inkjs und den Questregeln der App.

**Wahlen.** Neugierig und freundlich: die erste inhaltliche Antwort. Antworten, die aufschieben oder ablehnen („Nicht jetzt.“, „Gleich.“, „Später“, „Ein andermal.“), nur, wenn es keine andere gibt. Steht dieselbe Auswahl noch einmal da, kommt die nächste Antwort an die Reihe (Schleifen im Gespräch, zweiter Versuch bei einem Rätsel, die andere Frage beim nächsten Besuch). Die nicht gewählten Antworten stehen als „(andere Antworten: …)“ dabei.

**Partien und Aufgaben.** Je eine Zeile in eckigen Klammern. Der Spieler gewinnt jede Partie und besteht jede Aufgabenrunde beim ersten Versuch. Ausnahme, weil die Geschichte es so vorsieht: `mapleFalls.victor` (beim ersten Mal niederlage, danach Sieg). Abgebrochene Partien gibt es nicht. Eine Revanche gegen einen schon besiegten Gegner nimmt der Spieler je Angebot einmal an („erneut“), danach verabschiedet er sich; verlangt ein Dialog mehrere Siege (Mr. Harlans Lupe nach dreien), spielt er so oft.

**Erstdurchlauf.** Die Simulation spricht jede Figur in jedem neuen Zustand mehrfach an. Hier steht jedes Gespräch einmal: Weggelassen sind Dialoge ohne Zeile, wortgleiche Wiederholungen und Dialoge ohne eine neue Zeile. Zweitgespräche (dieselbe Auswahl, diesmal die nächste Antwort) sind gekürzt auf das Neue und so gekennzeichnet. Was eine Quest bewegt oder zum ersten Mal eine Partie, Aufgabenrunde oder einen Laden auslöst, bleibt immer stehen.

**Darstellung.** Erzähler kursiv, Sprecher fett, Antworten des Helden als „Kim (Antwort)“. Je Dialog eine Kopfzeile mit Nummer, Karte und Knoten (`datei.knoten`), darunter der Questschritt, zu dem er gehört; „→ Quest …“ meldet, was sich an den Quests ändert. Stimmung, Musik, Klang, Bild und Pausen sind nicht wiedergegeben. Der Held heißt Kim.

**Nicht enthalten.** Statisten und Tiere (Belebung der Karten): Die Simulation spricht sie nicht an. Ebenso Texte außerhalb der Dialoge (Tagebuch, Steckbriefe, Questtexte, Aufgabenstellungen, Kommentare in Partien, Läden).

**Umfang.** Mitgeschrieben wurden 17840 Dialoge der Simulation; weggelassen 14807 wortgleiche Wiederholungen, 1416 ohne neue Zeile und 424 ohne Zeile.

| Teil                                                 | Dialoge | Zeilen | Wörter |
| ---------------------------------------------------- | ------: | -----: | -----: |
| Akt 1                                                |     248 |   1104 |  11164 |
| Akt 2                                                |     254 |    960 |  10758 |
| Akt 3                                                |     282 |   1138 |  12914 |
| Akt 4                                                |     374 |   1301 |  16061 |
| Nach dem Abspann: Epilog und nachgeholte Nebenquests |      35 |     98 |   1226 |
| Gesamt                                               |    1193 |   4601 |  52123 |

**Was fehlt.** 102 von 1100 Knoten der Dialogdateien kommen in dieser Lesefassung nicht vor (andere Antworten, Niederlagen und Remis, Wartesätze, Zweitgespräche), verteilt auf 39 Dateien. Die Dateien mit den meisten ungelesenen Knoten:

- `maple-falls-clubraum`: 8 von 32 (coach_reihe_offen, pause_vor_clubkampf, coach_nach_niederlage, sam_vor_dem_coach, sam_klagt_wieder, juno_erst_sam, victor_ueberrascht, victor_weg)
- `ironwood-kantine`: 7 von 28 (big_joe_reihe_offen, big_joe_wartet, big_joe_nach_niederlage, mama_moment_rost, mama_moment_angriff, clubkampf_schraubstock, clubkampf_stimmt_es)
- `cedar-creek-bibliothek`: 6 von 25 (okafor_reihe_offen, okafor_nach_niederlage, mae_erst_dex, zwillinge_c, clubkampf_bauer, clubkampf_lass_mich)
- `desert-springs-garage`: 6 von 28 (garage_wartet, mira_wartet_brief, clubkampf_sturm, clubkampf_atme, mira_nach_niederlage, dot_vorher)
- `weg-ghost-capital`: 6 von 25 (weiter_leuchtturm, weltschachtag_nochmal, odette_erstes, odette_nochmal, odette_danach, wanderer_erstes)
- `weg-maple-cedar`: 6 von 38 (juno_weg, nia_nach_niederlage, stamm_s2, apfelstand_c, tessa_c, tessa_d)
- `maple-falls-aussen`: 5 von 23 (juno_frueh, juno_zum_club, lily_wartet, calloway_c, carla_c)
- `summit-city-huette`: 5 von 32 (ward_reihe_offen, ward_victor_fort, clubkampf_heimweg, ward_nach_niederlage, clubkampf_ah)
- `riverton-pavillon`: 4 von 26 (clubkampf_odum, slick_nach_niederlage, tamsin_zuschauen_wieder, tamsin_eli)
- `summit-city-bergstation`: 4 von 14 (victor_angebot, victor_spielen_wieder, victor_luftig, victor_gabel)
- `capital-arena-halle`: 3 von 39 (halbfinale_turm, halbfinale_zusammen, halbfinale_mit_dir)
- `cedar-creek-aussen`: 3 von 36 (steg_vor_archiv, rosa_nach_niederlage, kettering_c)
- `ghost-town-saloon`: 3 von 11 (fernpartie_bereit, fernpartie_wie_er, fernpartie_zaehlen)
- `maple-falls-wohnzimmer`: 3 von 12 (ankunft, haustuer, nicht_ironwood)
- `silicon-bay-akademie`: 3 von 26 (lin_nach_niederlage, theo_erst_lin, nova_erst_theo)

## Akt 1

### Maple Falls

#### 1 · Dachboden

`ansehen-maple-falls.hutschachtel` · Quest „Das Brett auf dem Dachboden“, Schritt 1 von 3: Das alte Schachbrett ansehen. Es liegt unter einer Decke auf dem runden Tisch vor dem Fenster.

→ Quest begonnen: „Das Brett auf dem Dachboden“

_Eine runde Hutschachtel mit Samtband. Darin liegt ein Damenhut mit einer kleinen Feder._

#### 2 · Dachboden

`ansehen-maple-falls.spiegel` · Quest „Das Brett auf dem Dachboden“, Schritt 1 von 3

_Ein alter Spiegel mit einem Sprung quer über das Glas. Darin siehst du dich und die Kisten, sonst niemand._

#### 3 · Dachboden

`ansehen-maple-falls.zeitungen1961` · Quest „Das Brett auf dem Dachboden“, Schritt 1 von 3

_Ein Stapel Zeitungen von 1961, gelb und brüchig. Ganz oben: „Miss Whitlock gewinnt die Schachmeisterschaft des Kreises“._

#### 4 · Dachboden

`ansehen-maple-falls.kiste_whitlock` · Quest „Das Brett auf dem Dachboden“, Schritt 1 von 3

_Eine Kiste aus Holz, nicht aus Pappe. Auf dem Deckel steht in steiler, altmodischer Schrift: „Whitlock – nicht wegwerfen“._

_Obenauf ein gerahmtes Foto: eine Frau mit weißem Dutt, vor ihr ein Schachbrett. Auf der Rückseite: „Margaret, Sonntag“._

#### 5 · Dachboden

`maple-falls-dachboden.dachboden_brett` · Quest „Das Brett auf dem Dachboden“, Schritt 1 von 3

_Staub, Kisten, ein Lampenschirm ohne Lampe. Unter einer Decke liegt etwas Flaches, Schweres._

_Auf allem hier oben liegt Staub. Nur auf dieser Decke nicht._

**Kim (Antwort):** Die Decke wegziehen\
(andere Antworten: Lieber nicht anfassen)

_Ein Schachbrett. Altes Holz, dunkel an den Ecken. Am Rand eingebrannt, ganz klein: A. W. 1857._

_Die Figuren stehen mitten in einer Partie. Ein Turm weit vorn, zwei Springer dicht beieinander, eine Handvoll Bauern._

_Du hebst den weißen König an. Er ist schwerer, als du dachtest._

_Das Licht im Fenster wird anders. Der Staub beginnt, sich langsam zu drehen. Die Dielen knacken. Einmal, zweimal._

**Ambrose:** Wer wagt es, mein Brett zu berühren?

**Kim (Antwort):** „Wer … wer ist da?“\
(andere Antworten: Den König fallen lassen und wegrennen)

**Ambrose:** Ein Meister. Einst. Jetzt offenbar ein Mieter in einer Kiste.

_Über dem Brett steht jemand, halb durchsichtig wie ein Bild in einer dunklen Fensterscheibe. Ein schmaler Mann in einem langen Rock._

**Ambrose:** Ein Kind. Bei allen Heiligen. Ein Kind hält meinen König.

**Ambrose:** Wie lange habe ich hier gelegen?

**Kim (Antwort):** „Ich weiß nicht. Wir sind heute eingezogen.“

**Ambrose:** Heute.

**Ambrose:** Ambrose Whitlock, zu Diensten. Schachmeister aus New Orleans. Verzeih den Ton, ich habe lange mit niemandem gesprochen.

_Whitlock. Wie auf der Kiste._

**Kim (Antwort):** „Ich bin Kim.“

**Ambrose:** Das habe ich mir gedacht. Der Name steht dort unten auf jedem zweiten Karton.

**Ambrose:** Du hältst den König wie einen Suppenlöffel.

**Kim (Antwort):** „Ich kann kaum Schach.“\
(andere Antworten: „Ich kann schon ein bisschen.“)

**Ambrose:** Ehrlich. Das ist mehr, als die meisten mitbringen.

**Ambrose:** Stell ihn zurück. Sachte. Und sag mir: Spielt man noch? Dort draußen?

**Kim (Antwort):** Nicken

_Er schließt die Augen._

**Ambrose:** Gut. Dann ist nicht alles verloren.

**Ambrose:** Nimm das hier. Es ist kein Zauber, nur ein Versprechen: Stockst du, so zeige ich dir die Figur, die arbeiten will. Ein Fingerzeig.

_Er macht eine Bewegung mit zwei Fingern. Auf der anderen Hälfte des Tisches liegt ein zweites Brett, aus demselben Licht wie er._

**Ambrose:** Die alte Stellung rührt niemand an. Wir spielen daneben, du gegen mich. Ich möchte sehen, wie du denkst.

**Kim (Antwort):** „Jetzt?“\
(andere Antworten: „Gut. Aber sei nicht streng.“)

**Ambrose:** Ich habe lange genug gewartet. Länger, als du dir vorstellen kannst.

→ Quest „Das Brett auf dem Dachboden“: Schritt 1 von 3 erledigt

→ Quest „Das Brett auf dem Dachboden“: Schritt 2 von 3 erledigt

[Partie gegen Ambrose – Ausgang: gewonnen]

→ Quest „Das Brett auf dem Dachboden“: Schritt 3 von 3 erledigt

→ Quest abgeschlossen: „Das Brett auf dem Dachboden“

#### 6 · Dachboden

`maple-falls-dachboden.dachboden_brett` · Quest „Ein Abend im neuen Haus“, Schritt 1 von 1: Mit dem Brett zu Mama gehen: zweimal die Treppe hinunter. Mama ist in der Küche rechts.

_Staub, Kisten, ein Lampenschirm ohne Lampe. Die Decke liegt zusammengeschoben neben dem Tisch._

_Das alte Brett. Die Figuren stehen noch so, wie du sie verlassen hast._

**Ambrose:** Du hast gewonnen. Glück ist der Anfang jeder Begabung. Der Rest ist Arbeit.

_Draußen dämmert es. Ihr habt lange gespielt. Durch das Fenster zirpen Grillen._

**Ambrose:** Du hast zweimal gefragt, bevor du gezogen hast. Die meisten, gegen die ich spielte, haben in ihrem Leben nicht zweimal gefragt.

**Ambrose:** Der Fingerzeig bleibt dir. Die Figur zeige ich. Den Zug findest du selbst.

**Kim (Antwort):** „Was hängt? Das hast du mich gefragt.“\
(andere Antworten: „Kannst du mir nicht jeden Zug zeigen?“)

**Ambrose:** Eine alte Gewohnheit. Ich frage es vor jedem Zug.

**Ambrose:** Eine Figur hängt, wenn man sie schlagen kann und niemand zurückschlägt. Geh sie durch. Deine zuerst. Dann meine.

**Ambrose:** Ich habe das an einem verlorenen Turm gelernt, vor einem vollen Kaffeehaus. Du lernst es billiger.

**Kim (Antwort):** „Was hängt. Verstanden.“\
(andere Antworten: „Das klingt langweilig.“)

**Ambrose:** Das sagen viele. Wir werden sehen.

_Du drehst die Karte um. Auf der Rückseite steht in steiler Schrift: „Fingerzeig“. Dieselbe Schrift wie auf den Kisten._

**Kim (Antwort):** „Wer hat hier gewohnt? Vor uns?“\
(andere Antworten: „Wer hat das geschrieben?“)

_Ambrose sieht zum Fenster. Draußen ist der Ahorn schwarz geworden vor dem Himmel._

**Ambrose:** Jemand, der dieses Brett sechzig Jahre lang abgestaubt hat. Und nie einen Zug darauf gemacht.

**Ambrose:** Ich habe ihr nie danken können. Sie hat mich nicht gehört.

_Er sagt es leichthin. Aber er sieht dich nicht an dabei._

**Ambrose:** Nimm das Brett mit, Kind. Wo es ist, bin ich. Weiter komme ich nicht.

**Ambrose:** Ich habe es versucht.

→ Quest begonnen: „Ein Abend im neuen Haus“

#### 7 · Dein Zimmer

`maple-falls-dachboden.fensterbank` · Quest „Ein Abend im neuen Haus“, Schritt 1 von 1

_Auf der Fensterbank steht, was du unterwegs gefunden hast. Das Zimmer erzählt die Reise._

#### 8 · Wohnzimmer

`ansehen-maple-falls.karton_kueche` · Quest „Ein Abend im neuen Haus“, Schritt 1 von 1

_Ein Karton mit der Aufschrift „Küche?“. Das Fragezeichen ist dreimal unterstrichen._

#### 9 · Wohnzimmer

`ansehen-maple-falls.pizzakarton` · Quest „Ein Abend im neuen Haus“, Schritt 1 von 1

_Ein leerer Pizzakarton auf dem Boden. Ein Stück fehlt, und niemand gibt es zu._

**Ambrose:** Zu meiner Zeit aß man von Tellern. Und man räumte sie weg.

#### 10 · Wohnzimmer

`maple-falls-wohnzimmer.mutter` · Quest „Ein Abend im neuen Haus“, Schritt 1 von 1

_Du kommst mit dem alten Brett die Treppe herunter. Auf der neunten Stufe knarrt es._

**Ambrose:** Die hat schon geknarrt, als das Haus neu war.

_Mama sitzt auf dem Boden und schraubt den Tisch zusammen. Ihr Blick fällt auf das Brett. Sie sieht nicht dich an, sondern die Stellung._

**Mama:** Weiß steht besser.

_Dann hört sie, was sie gesagt hat. Ihr Gesicht macht zu, wie eine Tür, die jemand leise schließt._

**Mama:** Hab ich irgendwo gelesen. Dass Weiß oft … ach, keine Ahnung. Wo hast du das her?

**Kim (Antwort):** „Vom Dachboden.“\
(andere Antworten: „Spielst du Schach?“)

**Mama:** Schön. Ist alt, oder? Pass auf, dass keine Figur wegkommt.

**Ambrose:** Deine Mutter, wenn ich das sagen darf, lügt schlecht.

**Mama:** In der Schule gibt es übrigens ein Schachteam. Lag ein Zettel im Briefkasten. Falls du Leute kennenlernen willst.

**Kim (Antwort):** „Vielleicht schau ich mal hin.“\
(andere Antworten: „Schach ist doch nur für Streber.“)

**Mama:** Mach das.

**Ambrose:** Ein Schachteam. Wie vornehm diese Zeit ist. Morgen gehen wir hin.

_Als der Tisch steht, wackelt er. Ihr schiebt einen gefalteten Pizzakarton unter ein Bein._

**Mama:** Das ist jetzt eben so.

**Kim (Antwort):** „Das ist jetzt eben so.“\
(andere Antworten: Nichts sagen, nur nicken)

_Für einen Moment ist es fast wie zu Hause._

_In der Nacht, als das Haus still ist, kannst du nicht schlafen. Das Brett zieht dich noch einmal nach oben._

→ Quest „Ein Abend im neuen Haus“: Schritt 1 von 1 erledigt

→ Quest abgeschlossen: „Ein Abend im neuen Haus“

#### 11 · Maple Falls, Hauptstraße

`ansehen-maple-falls.kreidebrett` · keine laufende Quest

_Ein Schachbrett aus Kreide auf dem Gehweg, schief, mit neun Feldern in einer Reihe. Darauf steht ein Plastikpferd._

#### 12 · Maple Falls, Hauptstraße

`maple-falls-aussen.juno` · keine laufende Quest

_Gegenüber sitzt eine alte Frau auf ihrer Veranda. Sie hat zwei Stühle. Auf dem zweiten sitzt niemand._

**Mrs. Calloway:** Du bist Kim. Ich bin Eunice Calloway. Ich wohne hier seit vierundsechzig.

**Mrs. Calloway:** Ich habe gesehen, wie ihr die Kisten getragen habt. Alle auf einmal. Das ist schlecht für den Rücken.

**Kim (Antwort):** „Guten Morgen, Mrs. Calloway.“\
(andere Antworten: „Es waren nur ein paar Kisten.“)

**Mrs. Calloway:** Margaret trägt nie mehr als eine. Sie sagt, man hat Zeit.

**Mrs. Calloway:** Jeden Sonntag spielt sie Schach. Gegen Leute, die sie nie gesehen hat. Per Post. Ein Zug, eine Briefmarke.

_Sie sagt „spielt“. Nicht „spielte“._

**Mrs. Calloway:** Die Kisten auf dem Dachboden hat nie jemand aufgemacht. Nicht mal sie.

_Dann blinzelt sie, als käme sie von weit her zurück, und lächelt._

**Mrs. Calloway:** Du kommst zu spät zur Schule, Kind.

_Ambrose schweigt, bis ihr außer Hörweite seid._

**Ambrose:** Per Post. Sechzig Jahre lang.

**Ambrose:** An meinem Tisch.

_Von der Haltestelle winkt dir jemand zu._

_An der Bushaltestelle steht ein Mädchen mit zwei Zöpfen und einem Heft, das ein Gummiband zusammenhält. Ihr ganzes Gesicht geht auf._

**Juno:** Du bist das Kind aus dem Whitlock-Haus!

**Juno:** Juno Martínez. Zwei Häuser weiter, das gelbe. Alle reden über euch.

**Juno:** Mrs. Whitlock hatte siebzehn Katzen, sagt man. Es waren drei.

_Sie sieht die Ecke des Bretts aus deinem Rucksack ragen._

**Kim (Antwort):** „Ich hab es auf dem Dachboden gefunden.“\
(andere Antworten: „Das ist nur ein altes Brett.“)

**Juno:** Ein echtes altes Schachbrett? Das ist ja wie im Film!

**Juno:** Wir brauchen ein viertes Brett, und ich brauche jemanden zum Reden. Spielst du Schach? Sag ja.

**Kim (Antwort):** „Ein bisschen.“\
(andere Antworten: „Ich kann kaum Schach.“)

**Juno:** Ein bisschen reicht! Ich spiele auch nur ein bisschen. Ich verliere meistens.

_Sie klopft auf das Heft._

**Juno:** Das ist das Clubtagebuch. Da kommt alles rein. Du kommst auch rein. Wie schreibt man dich?

**Juno:** Nach der Schule, Raum 12 im Erdgeschoss. Keine Ausrede.

**Ambrose:** Eine junge Dame mit Tagebuch und Glitzer. Sie wird dich überallhin schleppen.

#### 13 · Maple Falls, Hauptstraße

`maple-falls-aussen.lily` · Quest „Lilys Springer“, Schritt 1 von 2: Lily zeigen, wie der Springer zieht und zwei auf einmal angreift.

_Ein kleines Mädchen sitzt auf dem Bordstein. Auf dem Gehweg ein Schachbrett aus Kreide, schief, neun Felder in einer Reihe. Darauf ein Plastikpferd._

**Lily:** Kannst du Schach? Mein Cousin sagt, Mädchen können das Pferd nicht.

**Lily:** Der Pferd hüpft doch einfach irgendwohin, oder?

**Kim (Antwort):** „Ich zeig es dir.“\
(andere Antworten: „Gleich, ich hab noch was vor.“)

**Ambrose:** Erklär es ihr.

**Kim (Antwort):** „Du kannst das besser.“\
(andere Antworten: Neben sie auf den Bordstein setzen)

**Ambrose:** Sie hört mich nicht. Und selbst wenn.

**Ambrose:** Lehre es ihr. Dann weißt du, ob du es kannst.

_Du setzt den Springer auf ihr Brett und fährst mit dem Finger: zwei Felder geradeaus, eins zur Seite. Wie ein L._

_Dann lässt du ihn über einen Bauern hüpfen. Das darf nur er._

**Kim (Antwort):** „Und er springt immer auf die andere Farbe.“

_Lily sieht dich an, als hättest du ihr ein Geheimnis verraten._

_Du malst mit ihrer Kreide zwei Kreuze auf den Gehweg und setzt den Springer so, dass er beide erreicht._

**Kim (Antwort):** „Jetzt greift er zwei auf einmal an. Das heißt Gabel.“

**Lily:** Zwei auf einmal? Dann kann ja nur einer weglaufen!

**Lily:** Noch mal! Zeig mir, wo er zwei erwischt!

→ Quest begonnen: „Lilys Springer“

[Aufgaben von Lily (mapleFalls.springerLily) – Ausgang: bestanden]

→ Quest „Lilys Springer“: Schritt 1 von 2 erledigt

#### 14 · Maple Falls, Hauptstraße

`maple-falls-aussen.lily` · Quest „Lilys Springer“, Schritt 2 von 2: Hören, was Lily dazu sagt.

**Lily:** Ein L! Immer auf die andere Farbe! Und zwei auf einmal, das ist die Gabel!

_Sie lässt das Plastikpferd über den ganzen Gehweg hüpfen, bis zur Ecke._

_Ambrose sagt nichts. Aber er sieht ihr nach._

→ Quest „Lilys Springer“: Schritt 2 von 2 erledigt

→ Quest abgeschlossen: „Lilys Springer“

#### 15 · Maple Falls, Hauptstraße

`maple-falls-aussen.calloway` · keine laufende Quest

**Mrs. Calloway:** Margaret sagt, man hat Zeit. Sie hat recht. Man hat immer mehr, als man denkt.

#### 16 · Maple Falls, Hauptstraße

`maple-falls-aussen.carla` · keine laufende Quest

_Vor dem gelben Haus kniet ein Mädchen, älter als Juno, und schraubt an einem Fahrrad._

**Carla:** Du bist Junos neues viertes Brett? Viel Glück. Sie redet, bis du umfällst.

**Kim (Antwort):** „Spielst du auch Schach?“\
(andere Antworten: „Juno sagt, du warst gut.“)

**Carla:** Hab ich mal. Jetzt hab ich fast ein Auto.

_Sie winkt ab und dreht weiter an der Kette._

#### 17 · Clubraum der Maple Falls High

`ansehen-maple-falls.pokalvitrine` · keine laufende Quest

_In der Vitrine stehen drei Pokale, alle von 1994, darauf „Kreismeister Schach, Schule Maple Falls“._

#### 18 · Clubraum der Maple Falls High

`ansehen-maple-falls.brett_ohne_dame` · keine laufende Quest

_Auf einem Brett fehlt die schwarze Dame. An ihrer Stelle steht ein Radiergummi._

**Ambrose:** Wenigstens zieht diese Dame nicht zu früh heraus.

#### 19 · Clubraum der Maple Falls High

`ansehen-maple-falls.plakat_zaehlen` · keine laufende Quest

_Ein handgemaltes Plakat in großen Buchstaben: ERST ZÄHLEN. Darunter ist mit Filzstift eine Trillerpfeife gezeichnet._

**Ambrose:** Gegen dieses Plakat habe ich nichts einzuwenden. Ausnahmsweise.

#### 20 · Clubraum der Maple Falls High

`maple-falls-clubraum.coach` · Quest „Das vierte Brett“, Schritt 1 von 4: Sams Aufgaben lösen. Sam sitzt links am Tisch beim Fenster.

_Raum 12, Erdgeschoss, Blick auf den Fahnenmast. Die Tische sind zu vier Inseln zusammengeschoben. Pokale von 1994, ein Plakat: ERST ZÄHLEN._

**Coach Delgado:** Aufstellung! Juno, wen bringst du mir da?

**Juno:** Ein viertes Brett, Coach.

**Coach Delgado:** Na, das wollen wir sehen. Delgado. Mathe in der Sechsten und Achten, Schach immer.

**Coach Delgado:** Willkommen im Team, das noch keins ist. Wir arbeiten dran.

**Coach Delgado:** Kreisliga spielt man zu viert. Wer die Clubnadel holt, spielt mit. Die Nadel holt man gegen mich.

**Kim (Antwort):** „Gegen Sie?“\
(andere Antworten: „Was muss ich tun?“)

**Coach Delgado:** Gegen mich. Aber vorher zeigst du mir, dass du zählen kannst. Sam und Juno haben Aufgaben für dich.

**Coach Delgado:** Das ist hier Gesetz, und ich bin die Polizei.

_Am Fenster sitzt ein Junge, die Füße auf dem Stuhl. Er hat die ganze Zeit zugehört, ohne herzusehen. Das ist Sam._

_Auf einem der Bretter fehlt die schwarze Dame. An ihrer Stelle steht ein Radiergummi._

**Ambrose:** Ein Radiergummi als Dame. Ich habe Schlimmeres gesehen. Aber nicht oft.

→ Quest begonnen: „Das vierte Brett“

#### 21 · Clubraum der Maple Falls High

`maple-falls-clubraum.sam` · Quest „Das vierte Brett“, Schritt 1 von 4

**Sam:** Viertes Brett? Wir haben ein erstes Brett. Mich. Reicht doch.

**Sam:** Ich spiel Dame raus in Zug zwei. Funktioniert immer.

**Coach Delgado:** Fast immer.

**Sam:** Fast immer.

_Dann grinst er, weil er nicht anders kann._

**Kim (Antwort):** „Zeig mir deine Aufgaben.“\
(andere Antworten: „Gleich.“)

**Sam:** Hier. Die Figur steht da wie geschenkt. Na los, nimm sie.

**Kim (Antwort):** „Erst zählen.“\
(andere Antworten: „Gleich.“)

**Sam:** Langweilig. Aber gut.

[Aufgaben von Sam (mapleFalls.reiheSam) – Ausgang: bestanden]

→ Quest „Das vierte Brett“: Schritt 1 von 4 erledigt

#### 22 · Clubraum der Maple Falls High

`maple-falls-clubraum.sam` · Quest „Sams Dame“, Schritt 1 von 2: Sams Aufgaben lösen.

_Sam liegt mit dem Kopf auf dem Tisch._

**Sam:** Die Chefin wurde gefangen. Schon wieder. Das zählt nicht, das war Pech!

**Juno:** Wie oft war es Pech? Ich hab elfmal.

**Sam:** Du schreibst das auf?

**Juno:** Ich schreibe alles auf.

**Kim (Antwort):** „Soll ich dir zeigen, warum?“\
(andere Antworten: „Pech gibt es nicht im Schach.“)

**Sam:** Du? Mir? … Okay. Okay. Zeig mir das noch mal mit dem Zählen.

→ Quest begonnen: „Sams Dame“

[Aufgaben von Sam (mapleFalls.todsuenden) – Ausgang: bestanden]

→ Quest „Sams Dame“: Schritt 1 von 2 erledigt

#### 23 · Clubraum der Maple Falls High

`maple-falls-clubraum.juno` · Quest „Das vierte Brett“, Schritt 2 von 4: Die Aufgaben aus Junos Heft lösen.

**Juno:** Ich hab Aufgaben für dich! Ich hab sie aufgeschrieben, aber ich kann meine Schrift nicht lesen.

**Juno:** Kannst du? Es sind Züge in Notation.

**Juno:** Und ein Matt in eins, das hab ich selbst gefunden.

**Kim (Antwort):** „Her damit.“\
(andere Antworten: „Gleich.“)

[Aufgaben von Juno (mapleFalls.reiheJuno) – Ausgang: bestanden]

→ Quest „Das vierte Brett“: Schritt 2 von 4 erledigt

#### 24 · Clubraum der Maple Falls High

`maple-falls-clubraum.juno` · Quest „Das vierte Brett“, Schritt 3 von 4: Gegen Coach Delgado die Clubnadel gewinnen.

**Juno:** Für jeden guten Zug klebe ich einen Stern. Es gibt wenige Sterne.

#### 25 · Maple Falls, Hauptstraße

`ansehen-maple-falls.kreidebrett` · Quest „Das vierte Brett“, Schritt 3 von 4

_Neben dem Kreidebrett ist ein L gemalt, dann noch eins und noch eins, bis zur Ecke. Weiß, schwarz, weiß, schwarz._

#### 26 · Maple Falls, Hauptstraße

`maple-falls-aussen.juno` · Quest „Das vierte Brett“, Schritt 3 von 4

**Juno:** Sam gibt an, aber er meint es nicht so. Meistens.

#### 27 · Maple Falls, Hauptstraße

`maple-falls-aussen.lily` · Quest „Das vierte Brett“, Schritt 3 von 4

**Lily:** Der Springer ist mein Lieblingstier. Das ist er wirklich.

#### 28 · Maple Falls, Hauptstraße

`maple-falls-aussen.calloway` · Quest „Das vierte Brett“, Schritt 3 von 4

**Mrs. Calloway:** Sonntags kommt die Post spät hier. Margaret wartet trotzdem am Fenster.

#### 29 · Maple Falls, Hauptstraße

`maple-falls-aussen.carla` · Quest „Das vierte Brett“, Schritt 3 von 4

(noch einmal angesprochen; hier nur, was neu ist)

**Kim (Antwort):** „Juno sagt, du warst gut.“\
(andere Antworten: „Spielst du auch Schach?“)

**Carla:** Juno sagt viel.

_Sie winkt ab und dreht weiter an der Kette._

#### 30 · Stadtpark

`maple-falls-park.bushaltestelle` · Quest „Das vierte Brett“, Schritt 3 von 4

_Hier hält der Bus nach Cedar Creek. Heute fährt er ohne dich._

#### 31 · Stadtpark

`maple-falls-park.parkbank` · Quest „Das vierte Brett“, Schritt 3 von 4

_Auf der Bank liegt ein kleines grünes Brett. Es gehört sicher jemandem._

#### 32 · Stadtpark

`maple-falls-park.kiosk` · Quest „Das vierte Brett“, Schritt 3 von 4

_Ein kleiner Verkaufswagen mit bunter Markise. Hinter der Klappe sortiert ein Mann Zeitschriften._

**Mr. Patel:** Willkommen bei Patel! Zeitungen, Limo und Schachkarten für unterwegs.

**Mr. Patel:** Münzen gibt es hier fürs Gewinnen. Bei mir wirst du sie wieder los.

[Laden: Patels Kiosk]

#### 33 · Stadtpark

`maple-falls-park.steg` · Quest „Das vierte Brett“, Schritt 3 von 4

_Rot-weißes Absperrband vor dem Steg. Ein Schild der Stadt: „Steg morsch, wird erneuert.“_

_Darunter hat jemand mit Kuli geschrieben: „Die Stadt hat kein Geld.“_

#### 34 · Stadtpark

`maple-falls-park.skater_jo` · Quest „Das vierte Brett“, Schritt 3 von 4

_Auf der Kante der Halfpipe liegt ein Brett, so zerkratzt, dass man die dunklen Felder nur noch erraten kann. Die Figuren stehen schon, mitten in einer Stellung._

**Jo:** Jo. Ich spiele um Limo.

**Jo:** Fünf Minuten. Eine Partie. Ich spiel nicht von vorn, dauert zu lang.

**Jo:** Du stehst besser. Wer verliert, holt Limo.

**Kim (Antwort):** „Abgemacht.“\
(andere Antworten: „Ein andermal.“)

_Jo dreht das Brett zu dir. Ihre Hände sind schneller als ihre Augen._

[Stellungsduell gegen Jo – Ausgang: gewonnen]

#### 35 · Stadtpark

`maple-falls-park.skater_jo` · Quest „Limo für Jo“, Schritt 1 von 1: Bei Mr. Patel eine Zitronenlimo kaufen und sie Jo an die Halfpipe bringen.

**Jo:** Limo geht eigentlich auf mich. Aber ich bin pleite. Holst du eine? Dann erzähl ich dir was.

**Jo:** Zitrone. Mr. Patel weiß Bescheid, der Kiosk ist gleich da drüben.

**Kim (Antwort):** „Ich hol eine.“\
(andere Antworten: „Erst noch eine Partie.“)

**Jo:** Ich warte.

→ Quest begonnen: „Limo für Jo“

#### 36 · Stadtpark

`maple-falls-park.bibliothekar` · Quest „Das vergessene Brett im Park“, Schritt 1 von 3: Die Parkbank suchen, auf der jemand ein Brett vergessen hat.

_Von hier sieht man den Wasserfall zum ersten Mal richtig, ein weißes Band zwischen den Bäumen._

_Auf der Nachbarbank klopft ein sehr alter Mann seine Taschen ab. Neben ihm eine Thermoskanne._

**Mr. Abernathy:** Ich hatte doch … nein, das ist meine Brille. Das Brett, das Brett!

**Mr. Abernathy:** Abernathy, sehr erfreut. Früher Bibliothekar, heute Sucher von Dingen.

**Mr. Abernathy:** Mein Reisebrett. Ich habe es auf einer Bank vergessen. Aber auf welcher?

**Kim (Antwort):** „Ich suche es für Sie.“\
(andere Antworten: „Wie sieht es aus?“)

**Mr. Abernathy:** Wie freundlich. Es steht eine Stellung darauf. Bitte nichts verschieben.

**Ambrose:** Ein Mann, der Stellungen aufhebt. Das gefällt mir.

→ Quest begonnen: „Das vergessene Brett im Park“

#### 37 · Maple Falls, Hauptstraße

`maple-falls-aussen.juno` · Quest „Das vierte Brett“, Schritt 3 von 4: Gegen Coach Delgado die Clubnadel gewinnen.

**Juno:** Das Clubtagebuch hat jetzt eine Seite für dich. Noch leer. Noch!

#### 38 · Falls Diner

`maple-falls-diner.hector` · Quest „Das vierte Brett“, Schritt 3 von 4

**Hector:** Bestellung läuft!

_Hinter der Theke steht ein Mann mit Schürze. Neben der Kasse liegt ein Stapel Papiersets, auf jedem ein Schachrätsel._

**Hector:** Die liegen da, weil ich keins löse. Ich kauf sie trotzdem jede Woche.

**Hector:** Irgendwann kommt einer rein und kann das. Dann gibt's Pommes aufs Haus.

**Kim (Antwort):** „Darf ich mal sehen?“\
(andere Antworten: „Warum kaufen Sie sie dann?“)

**Hector:** Nimm eins mit. Aber erst essen. Auf leeren Magen sieht man nichts.

#### 39 · Maple Falls, Hauptstraße

`maple-falls-aussen.juno` · Quest „Das vierte Brett“, Schritt 3 von 4

**Juno:** Ich hab meinen Turm verloren. Schon wieder. Er war so jung.

#### 40 · Wohnzimmer

`ansehen-maple-falls.karton_kueche` · Quest „Das vierte Brett“, Schritt 3 von 4

_Im Karton klappern Teller. Dazwischen liegt ein einzelner weißer Bauer aus Plastik, keiner weiß, woher._

#### 41 · Wohnzimmer

`ansehen-maple-falls.tisch_pizzakarton` · Quest „Das vierte Brett“, Schritt 3 von 4

_Unter einem Tischbein steckt ein gefalteter Pizzakarton. Der Tisch wackelt nicht mehr. Fast nicht._

**Ambrose:** Bei uns legte man ein Spielkartenblatt unter. Herz Sieben, meistens.

#### 42 · Wohnzimmer

`maple-falls-wohnzimmer.mutter` · Quest „Das vierte Brett“, Schritt 3 von 4

**Mama:** Ich hab heute frei. Und der Herd ist immer noch nicht angeschlossen.

**Mama:** Diner? Ich lade dich ein.

**Kim (Antwort):** „Pommes?“\
(andere Antworten: „Gern.“)

**Mama:** Pommes. Und vielleicht sogar ein Salat. Vielleicht.

_Das Diner an der Hauptstraße ist lang und schmal wie ein Eisenbahnwagen. Rote Bänke, eine Theke aus Blech._

_Es riecht nach Zwiebeln und Kaffee. Aus der Musikbox kommt leise ein altes Lied._

**Hector:** Bestellung läuft!

_Er ruft es in die Küche, obwohl außer ihm niemand in der Küche ist. Auf seiner Schürze steht „Hector“._

_Er legt euch Papiersets hin. Darauf ein Schachbrett: „Rätsel der Woche: Weiß zieht und setzt in einem Zug matt.“_

**Hector:** Nimm zwei. Ist schwer diese Woche. Ich krieg's nicht raus.

**Kim (Antwort):** Das Rätsel ansehen\
(andere Antworten: Erst Pommes bestellen)

_Neben der Kasse liegt ein Stapel Sets, mindestens zwanzig. Auf keinem ist etwas eingezeichnet._

_Du suchst. Was hängt? Wohin kann die Dame?_

_Mama sieht zu. Sie sagt nichts._

_Aber ihr Finger bewegt sich, einen Zentimeter über dem Papier, auf ein Feld. Eine halbe Sekunde vor deinem Stift._

_Du tust, als hättest du es nicht gesehen. Dann zeichnest du den Pfeil ein._

_Hector hält das Set ins Licht wie einen Geldschein._

**Hector:** Matt in eins! Am ersten Abend! Das kommt an die Wand.

**Ambrose:** Deine Mutter war schneller. Ich sage es nur, damit du es weißt.

**Kim (Antwort):** Den Kopf schütteln, ganz leicht\
(andere Antworten: „Pst.“)

**Ambrose:** Schon gut. Ich schweige. Gentlemen schweigen über Damen.

_Die Pommes kommen. Hector bleibt am Tisch stehen, das Geschirrtuch über der Schulter._

**Hector:** Gestern saß hier einer. Anzug, zwei Telefone, kein Lächeln.

**Hector:** Hat Kaffee bestellt und nur auf Zahlen geguckt. Wollte wissen, wem das Schulgebäude gehört.

**Hector:** Hab gesagt: der Schule.

_Dann lacht er nicht mehr. Die Musikbox setzt für einen Takt aus._

**Hector:** Hat er nicht komisch gefunden.

**Kim (Antwort):** „Wer war das?“\
(andere Antworten: Nichts sagen)

**Hector:** Keine Ahnung. Hat nicht mal Trinkgeld gegeben. Kaffee schwarz, ohne alles.

**Mama:** Gibt es hier Ketchup?

_Draußen ist es dunkel geworden. Hinter dem Fenster die Hauptstraße, die einzige Ampel, dahinter schwarze Bäume._

_Es ist ein guter Abend. Du merkst es erst, als er fast vorbei ist._

_Du hast den ganzen Tag nicht an die alte Wohnung gedacht._

#### 43 · Dein Zimmer

`maple-falls-dachboden.ambrose` · Quest „Das vierte Brett“, Schritt 3 von 4

_Nacht. Das Haus ist still, nur du nicht. Die Schatten stehen an den falschen Stellen._

_Du hast die Laterne vom Dachboden geholt. Das Brett steht auf dem Schreibtisch unter deinem Fenster._

_Unten summt der Kühlschrank. Von weit her rauscht der Wasserfall._

**Kim (Antwort):** „Bist du wach?“\
(andere Antworten: „Kannst du auch nicht schlafen?“)

**Ambrose:** Ich schlafe nicht. Das ist eine der Unannehmlichkeiten.

_Er steht am Fenster, kaum zu sehen, ein hellerer Fleck vor der Scheibe._

**Ambrose:** Was ist das für ein Licht dort drüben? Es brennt ohne Flamme.

**Kim (Antwort):** „Eine Straßenlaterne.“

**Ambrose:** Und das Summen?

**Kim (Antwort):** „Der Kühlschrank.“

**Ambrose:** Aha.

_Er hat keine Ahnung, was ein Kühlschrank ist. Und er ist zu stolz, um zu fragen._

**Kim (Antwort):** Leise lachen\
(andere Antworten: „Ein Kasten, der das Essen kalt hält.“)

**Ambrose:** Lach nur. Ich bin seit hundertsechzig Jahren tot. Mir darf einiges entgangen sein.

_Unter dem Fenster liegt die alte Stellung. Niemand hat sie angerührt._

**Kim (Antwort):** „Wer hat diese Partie gespielt?“\
(andere Antworten: „Warum darf niemand die Figuren anrühren?“)

_Lange kommt keine Antwort. Der Wasserfall rauscht._

**Ambrose:** Ich. Und einer, der mir noch einen Zug schuldet.

**Kim (Antwort):** „Und wer ist am Zug?“

**Ambrose:** Er.

_Kurz bevor dir die Augen zufallen, denkst du: Mama hatte recht. Weiß steht besser._

_Du weißt nur nicht, woher du das weißt._

#### 44 · Dein Zimmer

`maple-falls-dachboden.ambrose` · Quest „Das vierte Brett“, Schritt 3 von 4

_Abend. Durch das offene Fenster zirpen Grillen. Ihr geht Sams Stellungen noch einmal durch._

_Ambrose geht am Fenster auf und ab. Bei jemandem, durch den man hindurchsehen kann, lenkt das sehr ab._

**Ambrose:** Du zählst richtig. Aber du zählst wie ein Buchhalter.

**Ambrose:** Es geht nicht nur darum, wie viele. Es geht darum, wer zuerst schlägt und was er dabei aufs Spiel setzt.

**Ambrose:** Mit der Dame fängt man keinen Tausch an. Man schickt den Bauern vor.

**Kim (Antwort):** „Warum?“\
(andere Antworten: „Ein Buchhalter gewinnt auch.“)

**Ambrose:** Weil der Bauer nichts zu verlieren hat. Das ist bei Menschen ebenso.

#### 45 · Dachboden

`ansehen-maple-falls.hutschachtel` · Quest „Das vierte Brett“, Schritt 3 von 4

_Eine runde Hutschachtel mit Samtband. Darin liegt ein Damenhut mit einer kleinen Feder._

**Ambrose:** Ein Hut für den Sonntag. Meine Schwester trug so einen zur Kirche.

#### 46 · Dachboden

`ansehen-maple-falls.spiegel` · Quest „Das vierte Brett“, Schritt 3 von 4

_Ein alter Spiegel mit einem Sprung quer über das Glas. Darin siehst du dich und die Kisten, sonst niemand._

**Ambrose:** Ich habe nachgesehen. Geister haben kein Spiegelbild. Schade, ich war ein ansehnlicher Mann.

#### 47 · Dachboden

`ansehen-maple-falls.zeitungen1961` · Quest „Das vierte Brett“, Schritt 3 von 4

_Ein Stapel Zeitungen von 1961, gelb und brüchig. Ganz oben: „Miss Whitlock gewinnt die Schachmeisterschaft des Kreises“._

**Ambrose:** Eine Whitlock, die gewinnt. Endlich.

#### 48 · Dachboden

`ansehen-maple-falls.kiste_whitlock` · Quest „Das vierte Brett“, Schritt 3 von 4

_Dieselbe steile Schrift wie auf dem Fingerzeig. Du drehst die Karte in der Tasche um und vergleichst._

#### 49 · Dein Zimmer

`maple-falls-dachboden.ambrose` · Quest „Das vierte Brett“, Schritt 3 von 4

_Abend. Junos Aufgaben liegen ausgebreitet auf deinem Bett, in rosa Tinte. Neben guten Zügen klebt ein Stern._

_Es gibt wenige Sterne. Es stört sie nicht._

**Ambrose:** Sie schreibt alles auf. Das ist mehr wert, als sie glaubt. Wer aufschreibt, kann zurückblättern.

**Kim (Antwort):** „Und du? Hast du deine Partien aufgeschrieben?“\
(andere Antworten: „Sie kann ihre eigene Schrift nicht lesen.“)

**Ambrose:** Jede. Auf Zettel, die nach Kaffee und Kerzenwachs rochen. Ich habe sie alle verloren.

**Ambrose:** Bis auf eine. Die steht hier unter dem Fenster.

#### 50 · Dein Zimmer

`maple-falls-dachboden.ambrose` · Quest „Das vierte Brett“, Schritt 3 von 4

_Abend. Du denkst an Sam, den Kopf auf dem Tisch, und an seine gefangene Dame._

**Ambrose:** Du hast es ihm erklärt, nicht ich. Wie hast du es gesagt?

**Kim (Antwort):** „Die Dame läuft allein über einen leeren Platz.“\
(andere Antworten: „Ich hab erzählt, wie es mir ging.“)

**Ambrose:** Und jeder kann auf sie zeigen. Während die anderen in Ruhe ihre Leute aufstellen.

_Er schweigt einen Moment. Dann klingt er beinahe verlegen._

**Ambrose:** Das war gut. Besser, als ich es erklärt hätte. Ich hätte ihm von Morphy erzählt, und er wäre eingeschlafen.

#### 51 · Wohnzimmer

`ansehen-maple-falls.tisch_pizzakarton` · Quest „Das vierte Brett“, Schritt 3 von 4

_Der Tisch wackelt nur noch, wenn man sich darauf stützt. Das ist jetzt eben so._

#### 52 · Wohnzimmer

`maple-falls-wohnzimmer.mutter` · Quest „Das vierte Brett“, Schritt 3 von 4

**Mama:** Mrs. Calloway von gegenüber hat Kuchen gebracht. Die Leute hier sind nett.

#### 53 · Maple Falls, Hauptstraße

`maple-falls-aussen.lily` · Quest „Das vierte Brett“, Schritt 3 von 4

**Lily:** Ich hab meinem Cousin eine Gabel gezeigt. Mit dem Springer! Er war sauer.

#### 54 · Clubraum der Maple Falls High

`ansehen-maple-falls.pokalvitrine` · Quest „Das vierte Brett“, Schritt 3 von 4

_Ein Platz in der Vitrine ist leer. Daneben klebt ein Zettel in Coach Delgados Schrift: „Reserviert“._

#### 55 · Clubraum der Maple Falls High

`ansehen-maple-falls.brett_ohne_dame` · Quest „Das vierte Brett“, Schritt 3 von 4

_Der Radiergummi steht immer noch auf d8. Angeblich hat er schon zwei Partien gewonnen._

#### 56 · Clubraum der Maple Falls High

`ansehen-maple-falls.plakat_zaehlen` · Quest „Das vierte Brett“, Schritt 3 von 4

_Unten auf dem Plakat steht klein: Erst zählen, dann schlagen._

#### 57 · Clubraum der Maple Falls High

`maple-falls-clubraum.coach` · Quest „Das vierte Brett“, Schritt 3 von 4

_Die Tische stehen anders. Eine Insel in der Mitte, die Stühle der anderen im Halbkreis. Die Pfeife liegt auf dem Pult._

**Coach Delgado:** Die Aufgaben sind erledigt. Dann ist es so weit: du gegen mich, um die Clubnadel.

**Coach Delgado:** Eine Partie. Ich spiele, wie ich spiele, ich schenke dir nichts. Wenn du verlierst, kommst du wieder, so oft du willst.

_Sie legt eine Anstecknadel auf den Tisch. Ein kleines Ahornblatt aus Metall, mit einem Schachbrettmuster darin._

**Kim (Antwort):** „Ich bin bereit.“\
(andere Antworten: „Noch nicht.“)

_Deine Hände sind kalt._

**Ambrose:** Du wirst die Karten nicht brauchen.

**Kim (Antwort):** „Woher weißt du das?“

**Ambrose:** Ich weiß es nicht. Ich sage es, damit du aufhörst zu zittern.

[Partie gegen Coach Delgado – Ausgang: gewonnen]

→ Quest „Das vierte Brett“: Schritt 3 von 4 erledigt

#### 58 · Clubraum der Maple Falls High

`maple-falls-clubraum.coach` · Quest „Das vierte Brett“, Schritt 4 von 4: Beim Coach meinen Platz im Team abholen.

_Sie legt ihren König um. Sanft, mit einem Finger._

**Coach Delgado:** Abpfiff! Gute Partie! Du hast gezählt, als ich nicht gezählt habe.

_Sie steckt dir die Nadel an. Selbst, etwas schief._

**Coach Delgado:** Viertes Brett. Samstag spielen wir in Cedar Creek.

_Juno umarmt dich so heftig, dass das Tagebuch auf den Boden fällt._

**Sam:** Nicht schlecht. Für ein viertes Brett.

_An der Tür steht der Hausmeister, einen Lappen in der Hand, und sieht auf die Pokale von 1994._

**Mr. Pratt:** Die haben auch gezählt. Bevor sie geschlagen haben.

_Dann geht er wieder._

_Auf dem Heimweg sagt Ambrose lange nichts. Ahornblätter auf dem Gehweg. Die Laternen gehen an, eine nach der anderen._

**Ambrose:** Es war keine schöne Partie.

**Kim (Antwort):** „Ich habe sie aber nicht verloren.“\
(andere Antworten: „Was ist eine schöne Partie?“)

**Ambrose:** Nein. Du hast gezählt, bis nichts mehr übrig war. Buchhaltung, Zug um Zug.

**Ambrose:** Zu meiner Zeit hätte man so etwas nicht aufgeschrieben.

**Kim (Antwort):** „Bist du enttäuscht?“

_Er bleibt unter einer Laterne stehen. Man sieht fast durch ihn hindurch._

**Ambrose:** Nein.

**Ambrose:** Nein. Das ist das Merkwürdige.

→ Quest „Das vierte Brett“: Schritt 4 von 4 erledigt

→ Quest abgeschlossen: „Das vierte Brett“

#### 59 · Clubraum der Maple Falls High

`maple-falls-clubraum.sam` · keine laufende Quest

_Sam schiebt dir eine Karte über den Tisch. Darauf zwei Hände, die Figuren abzählen._

**Sam:** Hat mir der Coach mal gegeben. Ich hab sie nie benutzt. Du zählst ja sowieso.

**Sam:** Okay. Die Dame bleibt erst mal zu Hause. Revanche? Jetzt?

**Kim (Antwort):** „Revanche.“\
(andere Antworten: „Gleich.“)

[Partie gegen Sam – Ausgang: gewonnen]

→ Quest „Sams Dame“: Schritt 2 von 2 erledigt

→ Quest abgeschlossen: „Sams Dame“

#### 60 · Clubraum der Maple Falls High

`maple-falls-clubraum.sam` · keine laufende Quest

**Sam:** Okay. Die Chefin war brav zu Hause. Verloren hab ich trotzdem.

**Sam:** Du bist gut, Kim. Nicht so gut wie ich. Noch nicht.

_Er erzählt weiter, ohne dass du fragst._

**Sam:** Der Coach guckt nur auf ihren eigenen Angriff. Immer.

**Sam:** Hab ich nie ausnutzen können. Du schon, wie es aussieht.

_Juno schreibt es ins Tagebuch. Mit Glitzer._

#### 61 · Clubraum der Maple Falls High

`maple-falls-clubraum.juno` · keine laufende Quest

**Juno:** Sam ist heute fast nett. Das kommt ins Tagebuch.

#### 62 · Maple Falls, Hauptstraße

`maple-falls-aussen.juno` · keine laufende Quest

**Juno:** Die Clubnadel steht schon im Tagebuch. Mit Glitzer, wie versprochen.

#### 63 · Maple Falls, Hauptstraße

`maple-falls-aussen.calloway` · keine laufende Quest

_Auf dem zweiten Stuhl liegt jetzt ein Kartenspiel. Mrs. Calloway mischt es, ohne hinzusehen._

**Mrs. Calloway:** Man hat mir erzählt, du hast der Lehrerin eine Nadel abgenommen.

**Kim (Antwort):** „Es war knapp.“\
(andere Antworten: „Ich habe gezählt.“)

**Mrs. Calloway:** Knapp ist gut. Knapp heißt, beide haben sich Mühe gegeben.

**Mrs. Calloway:** Margaret würde dich mögen. Sie mag Leute, die verlieren können.

**Ambrose:** Leute, die verlieren können. Dann hätte sie mich nicht gemocht.

#### 64 · Maple Falls, Hauptstraße

`maple-falls-aussen.carla` · keine laufende Quest

_Das Fahrrad steht fertig am Zaun. Carla schiebt es gerade auf die Straße._

**Carla:** Und? Wie war der Clubkampf?

**Kim (Antwort):** „Gewonnen. Gegen den Coach.“\
(andere Antworten: „Knapp.“)

**Carla:** Echt? Gegen Delgado?

**Carla:** Italienisch, oder? Läufer nach c4, und dann wartet sie nur auf ihren Angriff.

_Sie merkt, was sie gesagt hat, und steigt auf das Rad._

**Ambrose:** Sie kennt die Eröffnung. Und die Trainerin. Man vergisst nicht, was man geliebt hat.

#### 65 · Stadtpark

`maple-falls-park.parkbank` · keine laufende Quest

→ Quest „Das vergessene Brett im Park“: Schritt 1 von 3 erledigt

_Auf der Bank liegt ein kleines grünes Brett mit Magnetfiguren. Daneben ein Zettel mit drei kleinen Diagrammen._

_„Weiß zieht und setzt in einem Zug matt.“_

**Ambrose:** Ein Zug, Kind. Sieh nach, wohin der König noch kann.

**Kim (Antwort):** Die Aufgaben lösen\
(andere Antworten: Nicht jetzt)

[Aufgaben von Mr. Abernathy (mapleFalls.parkbankRaetsel) – Ausgang: bestanden]

→ Quest „Das vergessene Brett im Park“: Schritt 2 von 3 erledigt

#### 66 · Stadtpark

`maple-falls-park.parkbank` · keine laufende Quest

_Die Bank ist leer. Mr. Abernathy hat sein Brett wieder._

#### 67 · Stadtpark

`maple-falls-park.kiosk` · keine laufende Quest

**Mr. Patel:** Willkommen zurück. Für Münzen gibt es hier fast alles. Nur keine Siege.

[Laden: Patels Kiosk]

#### 68 · Stadtpark

`maple-falls-park.steg` · keine laufende Quest

_Das Absperrband ist weg. Die Bretter sind neu und riechen nach Harz._

_Am Pfosten ein Zettel: „Für Pokale baue ich alles. Pratt.“_

_Vom Ende des Stegs sieht man den kleinen Wasserfall hinter den Ahornbäumen._

_Ins Geländer hat jemand Buchstaben geritzt: „M. W. + E. C. 1952“._

#### 69 · Stadtpark

`maple-falls-park.skater_jo` · Quest „Limo für Jo“, Schritt 1 von 1: Bei Mr. Patel eine Zitronenlimo kaufen und sie Jo an die Halfpipe bringen.

_Du reichst Jo die kalte Zitronenlimo. Sie trinkt die halbe Flasche in einem Zug, setzt sich auf die Kante und lässt die Beine baumeln._

**Jo:** Danke. Du hast mich ja schon geschlagen, also verrat ich nicht mehr viel.

**Jo:** Nur so viel: Rückwärts zieh ich nicht gern. Revanche, wenn ich satt bin.

**Ambrose:** Eine Limonade für eine Schwäche. Ein guter Handel.

_Sie lacht, kurz und rau, und wirft dir die leere Flasche zu._

→ Quest „Limo für Jo“: Schritt 1 von 1 erledigt

→ Quest abgeschlossen: „Limo für Jo“

#### 70 · Stadtpark

`maple-falls-park.bibliothekar` · Quest „Das vergessene Brett im Park“, Schritt 3 von 3: Mr. Abernathy sein Brett zurückbringen.

**Mr. Abernathy:** Mein Brett! Und du hast die Aufgaben gelöst? Wunderbar.

_Er bedankt sich dreimal, jedes Mal für etwas anderes._

**Mr. Abernathy:** Die Stellung auf dem Brett stammt aus einem Brief. Er lag offen auf Margarets Küchentisch, als wir ausgeräumt haben.

**Mr. Abernathy:** Nichts als Schachzüge, Zeile um Zeile. Unterschrift: A. W.

**Mr. Abernathy:** So etwas wirft man doch nicht einfach weg. Ich habe es abgeschrieben. Behalt die Abschrift.

_Auf dem Heimweg ist Ambrose lange still._

**Ambrose:** Er hat das abgeschrieben. Mit Bleistift. Auf einen Zettel.

**Kim (Antwort):** „Kennst du die Stellung?“\
(andere Antworten: „Was für eine Partie?“)

**Ambrose:** Ob ich sie kenne. Es ist meine. Der Anfang. Vier Züge, und im vierten mein Gambit.

**Ambrose:** Ich bin gerührt. Und beleidigt. Es fehlt ein Bauer.

→ Quest „Das vergessene Brett im Park“: Schritt 3 von 3 erledigt

→ Quest abgeschlossen: „Das vergessene Brett im Park“

#### 71 · Maple Falls, Hauptstraße

`maple-falls-aussen.calloway` · keine laufende Quest

(noch einmal angesprochen; hier nur, was neu ist)

**Kim (Antwort):** „Ich habe gezählt.“\
(andere Antworten: „Es war knapp.“)

**Mrs. Calloway:** Das würde Margaret gefallen. Sie zählt sogar die Briefmarken.

**Mrs. Calloway:** Margaret würde dich mögen. Sie mag Leute, die verlieren können.

**Ambrose:** Leute, die verlieren können. Dann hätte sie mich nicht gemocht.

#### 72 · Maple Falls, Hauptstraße

`maple-falls-aussen.carla` · keine laufende Quest

(noch einmal angesprochen; hier nur, was neu ist)

**Kim (Antwort):** „Knapp.“\
(andere Antworten: „Gewonnen. Gegen den Coach.“)

**Carla:** Gegen Delgado ist es immer knapp.

**Carla:** Italienisch, oder? Läufer nach c4, und dann wartet sie nur auf ihren Angriff.

_Sie merkt, was sie gesagt hat, und steigt auf das Rad._

**Ambrose:** Sie kennt die Eröffnung. Und die Trainerin. Man vergisst nicht, was man geliebt hat.

#### 73 · Falls Diner

`maple-falls-diner.hector` · keine laufende Quest

_An der Wand hinter der Theke hängt ein Papierset in einem Rahmen. Mit einem Pfeil darauf. In deiner Schrift._

**Hector:** Das erste, das hier einer gelöst hat. Am ersten Abend. Ich zeig's jedem.

**Hector:** Die meisten nicken nur. Aber ich weiß, was es heißt.

**Kim (Antwort):** „Was heißt es denn?“\
(andere Antworten: „Meine Mutter war schneller.“)

**Hector:** Dass es geht. Jemand sitzt da und sieht es. Dann kann ich es auch. Irgendwann.

#### 74 · Maple Falls, Hauptstraße

`maple-falls-aussen.juno` · keine laufende Quest

**Juno:** Samstag Cedar Creek! Ich packe Kekse ein. Für die Nerven.

#### 75 · Wohnzimmer

`maple-falls-wohnzimmer.mutter` · keine laufende Quest

**Mama:** Wenn du rausgehst: Hauptsache, du bist vor zehn zu Hause.

#### 76 · Dein Zimmer

`maple-falls-dachboden.ambrose` · keine laufende Quest

**Ambrose:** Eine Nadel am Kragen. Zu meiner Zeit gab es dafür Wein, für dich gibt es Limonade.

**Kim (Antwort):** „Erzähl mir von früher.“\
(andere Antworten: „Bis morgen.“)

**Ambrose:** Der junge Morphy war der Beste von uns allen. Ich habe ihn nie geschlagen. Nie.

#### 77 · Dachboden

`ansehen-maple-falls.hutschachtel` · keine laufende Quest

_Die Feder am Hut wippt, wenn du die Schachtel anstößt._

#### 78 · Dachboden

`ansehen-maple-falls.spiegel` · keine laufende Quest

_Im Spiegel nur du und die Kisten. Ambrose schweigt diesmal höflich._

#### 79 · Dachboden

`ansehen-maple-falls.zeitungen1961` · keine laufende Quest

_Unter der Meldung ein Foto: eine junge Frau mit Pokal, sehr ernst und sehr stolz._

#### 80 · Clubraum der Maple Falls High

`maple-falls-clubraum.coach` · Quest „Ich will besser werden“, Schritt 1 von 5: Wer ist der Junge neben dem Mann mit dem Tablet?

_Ein schwarzer Wagen hält vor der Schule. Ein Mann steigt aus, ein Telefon am Ohr, ein zweites in der Hand._

_Coach Delgado hat die Trainingsjacke bis oben zugezogen._

_Der Mann gibt jedem die Hand, auch dir. Er hat ein freundliches, müdes Gesicht._

**Graham Hale:** Ein Programm, das nie krank wird und nie die Geduld verliert. Perfect Move. Schach für die Zukunft.

**Coach Delgado:** Was kostet das?

**Graham Hale:** Für Pilotschulen zunächst nichts.

_Am Fenster steht ein Junge, ein Tablet unter dem Arm. Er hat sich nicht gesetzt. Er sieht auf deine Nadel._

**Victor Hale:** Victor Hale. Zeig mal, was eine Nadel hier wert ist.

_In deiner Tasche bricht Ambrose mitten im Satz ab._

**Victor Hale:** Ich spiele nicht von vorn gegen Anfänger. Mein Trainer gibt mir Stellungen.

**Victor Hale:** Spanisch, Zug zwölf. Du hast Schwarz, einen Springer weniger und zwei Bauern mehr.

**Victor Hale:** Das sage ich dir vorher, damit du dich nachher nicht beschwerst.

**Ambrose:** Ein Springer gegen zwei Bauern. Das ist schwer, ehrlich gesagt. Aber verlieren kann man auf viele Arten.

**Kim (Antwort):** „Ich spiele.“\
(andere Antworten: „Das ist nicht fair.“ · „Nicht jetzt.“)

_Victor stellt die Figuren auf. Schnell, ohne hinzusehen._

→ Quest begonnen: „Ich will besser werden“

→ Quest „Ich will besser werden“: Schritt 1 von 5 erledigt

[Partie gegen Victor Hale – Ausgang: verloren]

→ Quest „Ich will besser werden“: Schritt 2 von 5 erledigt

#### 81 · Clubraum der Maple Falls High

`maple-falls-clubraum.coach` · Quest „Ich will besser werden“, Schritt 3 von 5: Mit Ambrose über die Partie reden.

_Irgendwann lehnt er sich einen Fingerbreit zurück._

**Victor Hale:** Das genügt.

**Victor Hale:** Du hast in Zug zwölf verloren. Den Rest hast du nur nicht gemerkt.

_Er räumt die Figuren ein, jede in ihr Fach. Er gibt dir nicht die Hand._

**Graham Hale:** Gut gespielt, Victor. Nächstes Mal schneller, ja? Wir haben um vier den Termin.

_Etwas geht über Victors Gesicht. Sehr kurz._

**Victor Hale:** Ja.

_Dann sind sie weg._

**Juno:** Der war nicht nett.

_Niemand widerspricht._

**Juno:** Aber er war gut.

_Auf dem Pult steht noch der Bildschirm. Darauf ziehen die Figuren von selbst._

_Coach Delgado schaltet ihn aus. Sie steht eine Weile davor._

**Coach Delgado:** Kostet zunächst nichts.

_Sie sagt es zu niemandem._

_Als der Raum leer ist, holst du das Brett aus der Tasche und legst es auf einen Tisch._

_Ambrose zeigt dir zwei Stellen. Genau und ohne ein Wort zu viel._

**Kim (Antwort):** „Du bist erschrocken. Vorhin.“\
(andere Antworten: Nichts fragen)

**Ambrose:** Bin ich das.

**Kim (Antwort):** „Hale.“

_Er steht mit dem Rücken zu dir. Die alte Stellung liegt zwischen euch. Schwarz ist am Zug, seit hundertsechzig Jahren._

**Ambrose:** Ein Name. Es gibt viele Hales.

_Du weißt, dass er lügt. Er lügt nicht besser als Mama._

_Juno hat dir das Clubtagebuch übers Wochenende geliehen. Du schlägst eine neue Seite auf._

_In deiner eigenen Schrift, ohne Glitzer._

→ Quest „Ich will besser werden“: Schritt 3 von 5 erledigt

#### 82 · Clubraum der Maple Falls High

`maple-falls-clubraum.sam` · Quest „Ich will besser werden“, Schritt 4 von 5: Mama vom Auswärtsspiel in Cedar Creek erzählen.

**Sam:** Cedar Creek hat eine Bibliothek als Club. Was spielen die da, leise?

#### 83 · Stadtpark

`maple-falls-park.kiosk` · Quest „Ich will besser werden“, Schritt 4 von 5

**Mr. Patel:** Na, wieder da? Frische Karten sind da. Und Limo, falls Jo wieder gewonnen hat.

[Laden: Patels Kiosk]

#### 84 · Stadtpark

`maple-falls-park.skater_jo` · Quest „Ich will besser werden“, Schritt 4 von 5

**Jo:** Okay, okay. Limo geht auf mich. Noch eine?

**Kim (Antwort):** „Noch eine.“\
(andere Antworten: „Gleich.“)

_Jo dreht das Brett zu dir. Ihre Hände sind schneller als ihre Augen._

[Stellungsduell gegen Jo, erneut – Ausgang: gewonnen]

#### 85 · Stadtpark

`maple-falls-park.bibliothekar` · Quest „Ich will besser werden“, Schritt 4 von 5

**Mr. Abernathy:** Heute habe ich nur die Thermoskanne vergessen. Ein guter Tag.

#### 86 · Falls Diner

`maple-falls-diner.hector` · Quest „Ich will besser werden“, Schritt 4 von 5

(noch einmal angesprochen; hier nur, was neu ist)

**Kim (Antwort):** „Meine Mutter war schneller.“\
(andere Antworten: „Was heißt es denn?“)

**Hector:** Deine Mutter? Die hat nur Ketchup bestellt.

**Ambrose:** Ein Gentleman schweigt über Damen. Du hast es dennoch gesagt.

#### 87 · Wohnzimmer

`maple-falls-wohnzimmer.mutter` · Quest „Ich will besser werden“, Schritt 4 von 5

**Mama:** Coach Delgado hat angerufen. Ihr spielt Samstag in Cedar Creek?

**Kim (Antwort):** „Juno und ich gehen Freitag schon. Zu Fuß.“\
(andere Antworten: „Ich spiele am vierten Brett!“)

**Mama:** Zu Fuß.

_Sie sieht dich an, über den Rand ihrer Kaffeetasse. Der Tisch wackelt nicht mehr; der Pizzakarton liegt noch unter dem Bein._

**Mama:** Du hast in vier Wochen mehr geredet als im ganzen letzten Jahr.

**Kim (Antwort):** „Zwei Stunden. Am Fluss entlang.“\
(andere Antworten: „Wir schlafen in der Bibliothek. Es gibt Matten.“)

_Sie sieht auf das Brett. Sie will etwas sagen und sagt es nicht._

**Mama:** Mit Juno. Am Fluss. Gut.

_Sie drückt dir eine Tüte in die Hand, belegte Brote, als hätte sie es die ganze Zeit gewusst._

**Mama:** Brett nicht verlieren.

**Kim (Antwort):** „Woher weißt du, dass ich es mitnehme?“\
(andere Antworten: „Versprochen.“)

**Mama:** Du trägst es seit Wochen herum. Wie ein Haustier.

_Juno wartet am Park, wo die Landstraße beginnt._

→ Quest „Ich will besser werden“: Schritt 4 von 5 erledigt

#### 88 · Dein Zimmer

`maple-falls-dachboden.ambrose` · Quest „Ich will besser werden“, Schritt 5 von 5: Mit Juno zu Fuß nach Cedar Creek gehen: vom Stadtpark über die Landstraße und den Flussweg.

**Ambrose:** Cedar Creek? Den Namen habe ich nie gehört. Ich war allerdings eine Weile verhindert.

**Kim (Antwort):** „Erzähl mir von früher.“\
(andere Antworten: „Bis morgen.“)

**Ambrose:** Ich habe einmal gegen den Kapitän eines Dampfers gespielt. Er setzte sein Schiff. Ich lehnte ab.

#### 89 · Dein Zimmer

`maple-falls-dachboden.ambrose` · Quest „Ich will besser werden“, Schritt 5 von 5

**Ambrose:** Cedar Creek? Den Namen habe ich nie gehört. Ich war allerdings eine Weile verhindert.

**Kim (Antwort):** „Erzähl mir von früher.“\
(andere Antworten: „Bis morgen.“)

**Ambrose:** New Orleans hatte Kaffeehäuser, in denen man bis Mitternacht spielte. Bei Kerzenlicht.

#### 90 · Wohnzimmer

`maple-falls-wohnzimmer.mutter` · Quest „Ich will besser werden“, Schritt 5 von 5

**Mama:** Dein Zimmer sieht fast bewohnt aus. Fast.

#### 91 · Clubraum der Maple Falls High

`ansehen-maple-falls.bildschirm_pult` · Quest „Ich will besser werden“, Schritt 5 von 5

_Ein Bildschirm auf dem Pult, ausgeschaltet. Auf dem Rahmen ein Aufkleber: „Perfect Move – Pilotschule“._

**Ambrose:** Ein Brett, das allein spielt. Gegen wen eigentlich?

#### 92 · Clubraum der Maple Falls High

`maple-falls-clubraum.coach` · Quest „Ich will besser werden“, Schritt 5 von 5

**Coach Delgado:** Noch einmal um die Nadel? Gold gibt es nur für eine Partie ganz ohne Hilfe. Sag Bescheid.

**Kim (Antwort):** „Noch eine Partie um die Nadel.“\
(andere Antworten: „Bis morgen, Coach.“)

[Partie gegen Coach Delgado, erneut – Ausgang: gewonnen]

#### 93 · Clubraum der Maple Falls High

`maple-falls-clubraum.coach` · Quest „Ich will besser werden“, Schritt 5 von 5

**Coach Delgado:** Samstag Cedar Creek. Pünktlich sein, sonst pfeife ich.

**Kim (Antwort):** „Bis morgen, Coach.“\
(andere Antworten: „Noch eine Partie um die Nadel.“)

#### 94 · Clubraum der Maple Falls High

`maple-falls-clubraum.sam` · Quest „Ich will besser werden“, Schritt 5 von 5

**Sam:** Du hast den Coach geknackt? Respekt. Ich hab drei Jahre gebraucht.

#### 95 · Clubraum der Maple Falls High

`maple-falls-clubraum.juno` · Quest „Ich will besser werden“, Schritt 5 von 5

**Juno:** Das Clubtagebuch wächst! Bald brauche ich ein zweites.

#### 96 · Stadtpark

`maple-falls-park.bushaltestelle` · keine laufende Quest

→ Quest „Ich will besser werden“: Schritt 5 von 5 erledigt

→ Quest abgeschlossen: „Ich will besser werden“

_Am Fahrplan ein Zettel: „Mr. Kettering fährt nach Cedar Creek nur samstags.“_

_Juno wartet an der Landstraße. Zu Fuß, am Fluss entlang._

#### 97 · Stadtpark

`maple-falls-park.bibliothekar` · keine laufende Quest

**Mr. Abernathy:** Ein Bibliothekar hört nie auf zu sortieren. Jetzt sortiere ich Enten.

#### 98 · Wohnzimmer

`maple-falls-wohnzimmer.mutter` · keine laufende Quest

**Mama:** Ich hab gleich Nachtschicht. Im Kühlschrank ist noch Pizza.

#### 99 · Clubraum der Maple Falls High

`ansehen-maple-falls.bildschirm_pult` · keine laufende Quest

_Coach Delgado hat ein Handtuch über den Bildschirm gehängt. Es rutscht immer wieder herunter._

#### 100 · Clubraum der Maple Falls High

`maple-falls-clubraum.juno` · keine laufende Quest

**Juno:** Ich hab gegen den Coach eine Figur gewonnen. Dann sieben verloren. Aber eine gewonnen!

#### 101 · Clubraum der Maple Falls High

`maple-falls-clubraum.sam` · keine laufende Quest

**Sam:** Dame raus, Zug sechs. Ich arbeite dran.

#### 102 · Stadtpark

`maple-falls-park.bibliothekar` · keine laufende Quest

**Mr. Abernathy:** Margaret spielte jeden Sonntag per Post. Die Schachbücher dazu hat sie bei mir geliehen. Alle.

#### 103 · Stadtpark

`maple-falls-park.landstrasse` · keine laufende Quest

_Juno wartet am Ortsschild. Zwei Stunden, am Fluss entlang._

### Landstraße nach Cedar Creek

#### 104 · Landstraße

`weg-maple-cedar.tafel` · keine laufende Quest

_Hinter dem Park hört die Stadt einfach auf. Ein Schild: „Maple Falls, 2 140 Einwohner.“_

_Unter dem Ortsschild hängt eine Blechtafel mit Magnetfiguren: „Rätsel am Ortsausgang. Wer es löst, darf gehen. Wer nicht, auch.“_

**Juno:** Das macht Mr. Pratt. Jeden Monat ein neues. Niemand weiß, warum.

**Kim (Antwort):** Die Aufgaben lösen\
(andere Antworten: Weitergehen)

[Aufgaben von Die Rätseltafel (wegMapleCedar.tafel) – Ausgang: bestanden]

#### 105 · Landstraße

`weg-maple-cedar.tafel` · keine laufende Quest

_Auf der Tafel steht in Kreide: „Gelöst!“ Jemand hat einen Smiley daneben gemalt._

#### 106 · Landstraße

`weg-maple-cedar.fund_formular` · keine laufende Quest

_Im Gras unter einem Busch steckt ein vergilbtes Blatt in einer Blechdose._

_Ein Partieformular, eng beschrieben, die Tinte verblasst._

_Im Rucksack bleibt es still._

#### 107 · Landstraße

`weg-maple-cedar.ereignis_flohmarkt` · Quest „Finchs Fallen“, Schritt 1 von 2: Die drei Fallen von Odette Finch auf dem Flohmarkt an der Landstraße lösen.

_Auf den Tischen liegen Lampen, Kisten und ein Fahrrad ohne Kette. Vor dem Wohnmobil sitzt eine alte Dame und lacht._

**Odette Finch:** Odette Finch. Problemhefte, fünfzig Cent das Stück. Aber erst stelle ich dir eine Falle.

**Odette Finch:** Matt in einem Zug. Sieht aus wie Patt, ist es aber nicht.

**Odette Finch:** Drei Stück hab ich, eine gemeiner als die andere.

**Kim (Antwort):** Die Fallen lösen\
(andere Antworten: Nicht jetzt)

→ Quest begonnen: „Finchs Fallen“

[Aufgaben von Odette Finch (wegMapleCedar.finchFallen) – Ausgang: bestanden]

→ Quest „Finchs Fallen“: Schritt 1 von 2 erledigt

#### 108 · Landstraße

`weg-maple-cedar.ereignis_flohmarkt` · Quest „Finchs Fallen“, Schritt 2 von 2: Bei Odette die Karte der Finch-Jagd abholen.

_Odette klatscht in die Hände._

**Odette Finch:** Alle drei! Dann bist du genau richtig für meine letzte große Aufgabe.

_Sie gibt dir eine Karte mit sechzehn leeren Kästchen._

**Odette Finch:** Sechzehn weiße Figuren aus Buchsbaum. Fünfzehn liegen versteckt an den Wegen, unter jeder steht ihr Feld. Den König behalte ich, bis du alle hast.

**Odette Finch:** Wo eine liegt, hab ich einen Finken hingemalt. Und das Heft nimmst du mit, drei Aufgaben für unterwegs.

→ Quest „Finchs Fallen“: Schritt 2 von 2 erledigt

→ Quest abgeschlossen: „Finchs Fallen“

→ Quest begonnen: „Die Finch-Jagd“

#### 109 · Landstraße

`weg-maple-cedar.seite00` · keine laufende Quest

→ Quest begonnen: „Die verlorenen Seiten“

_Im Graben neben dem Hof steckt ein Blatt Papier, feucht vom Tau._

_Ein loses Blatt mit einer gezeichneten Stellung. Jemand hat mit Bleistift „Weiß zieht“ darunter geschrieben._

_Im Rucksack bleibt es still._

#### 110 · Landstraße

`weg-maple-cedar.apfelstand` · keine laufende Quest

_Ein Tisch am Gatter: Äpfel, Flaschen mit dunklem Sirup und eine Blechdose mit Schlitz. Niemand ist da._

_Auf einem Pappschild steht: „Äpfel 1 Dollar. Sirup 4. Bitte ehrlich.“_

_Juno legt einen Dollar in die Dose und nimmt zwei Äpfel. Einen gibt sie dir._

_Eine Frau in Gummistiefeln kommt über die Wiese, in jeder Hand einen Eimer._

**Ada:** Die Kasse stimmt fast immer. Fast.

_Sie stellt die Eimer ab und sieht auf das Feld._

**Ada:** Drei Krähen, zwei Vogelscheuchen. Wer gewinnt?

**Kim (Antwort):** „Die Krähen. Drei gegen zwei.“\
(andere Antworten: „Die Vogelscheuchen. Die laufen nicht weg.“)

_Sie sieht dich an, zum ersten Mal richtig._

**Ada:** Die zählen in der Schule jetzt, was?

_Sie nimmt den Deckel von der Dose, zählt mit den Lippen und seufzt._

**Ada:** Diese Woche fehlen wieder sechs. Ich frag nicht, wer. Ich schreib bloß einen Zettel.

_Ein Traktor fährt vorbei. Der Mann darauf hebt zwei Finger vom Lenkrad. Das ist alles._

**Ada:** Otis. Redet mit den Kühen.

**Ada:** Gatter zu, wenn ihr geht.

#### 111 · Landstraße

`weg-maple-cedar.wanderer` · keine laufende Quest

_Ein Mann mit Rucksack und Wanderstock sitzt am Wegrand. Aus der Tasche schaut ein Taschenschach._

**Wanderer:** Nach Cedar Creek? Zwei Stunden. Ich spiele unterwegs eine Partie im Kopf.

**Wanderer:** Bei der Brücke bin ich meistens matt.

#### 112 · Landstraße

`weg-maple-cedar.gegnerin` · keine laufende Quest

_Ein Mädchen mit Skateboard unter dem Arm versperrt halb den Weg. Auf dem Board klebt ein Schachbrett._

**Nia:** Du bist das Kind, das Jo im Park geschlagen hat? Oder das sie geschlagen hat?

**Nia:** Egal. Ich bin Nia.

**Nia:** Blitz. Drei Minuten. Du kriegst Weiß und die bessere Stellung, ich bin nett.

**Nia:** Zehn Züge. Hältst du deinen Vorteil, darfst du vorbei.

**Nia:** Sonst trägst du mein Board bis Cedar Creek.

**Kim (Antwort):** „Abgemacht.“\
(andere Antworten: „Nicht jetzt.“)

_Nia stellt die Figuren auf ihr Board, so schnell, dass du kaum hinsiehst._

[Stellungsduell gegen Nia – Ausgang: gewonnen]

#### 113 · Landstraße

`weg-maple-cedar.gegnerin` · keine laufende Quest

**Nia:** Okay, okay. Du bist schneller, als du aussiehst. Noch mal?

**Kim (Antwort):** „Noch eine.“\
(andere Antworten: „Ich muss weiter.“)

_Nia stellt die Figuren auf ihr Board, so schnell, dass du kaum hinsiehst._

[Stellungsduell gegen Nia, erneut – Ausgang: gewonnen]

#### 114 · Landstraße

`weg-maple-cedar.ada` · keine laufende Quest

**Ada:** Drei Krähen, zwei Vogelscheuchen. Ich sag ja: Die Krähen gewinnen.

#### 115 · Landstraße

`weg-maple-cedar.tessa` · keine laufende Quest

_Eine Frau läuft vorbei, rot im Gesicht. Am Gatter bleibt sie stehen und keucht._

**Die Joggerin:** Noch – drei Kilometer! Halbe – Strecke!

_Und weg ist sie._

#### 116 · Flussweg

`weg-maple-cedar.fund_muenzen` · keine laufende Quest

_Zwischen zwei Steinen am Ufer klemmt eine kleine Holzkiste. Darin klimpern Münzen._

_Im Rucksack bleibt es still._

#### 117 · Flussweg

`weg-maple-cedar.rast` · keine laufende Quest

**Ambrose:** Hier ist es schöner.

_Es ist das Erste, was er seit dem Aufbruch sagt._

_Wo das Ufer flach ist, liegt ein großer Stein im Gras. Darin sind Linien eingeritzt, acht mal acht._

_Daneben sitzt ein alter Mann auf einem Klappstuhl. Die Angel hängt im Wasser, der Eimer ist leer._

**Silas:** Mein Großvater hat hier Leute übergesetzt. Als es die Brücke noch nicht gab.

**Silas:** Die Fährleute haben auf dem Stein gespielt, während sie warteten. Mit Kieseln. Helle und dunkle.

**Kim (Antwort):** Die Hand auf den Stein legen\
(andere Antworten: „Beißen die Fische heute?“)

_Der Stein ist warm von der Sonne._

**Ambrose:** Auf Straßen wie der dort oben bin ich wochenlang gefahren. In einer Kutsche, die jede Furche mitnahm.

**Ambrose:** Am Fluss kann man wenigstens denken.

**Kim (Antwort):** „Wohin bist du gefahren?“\
(andere Antworten: Nichts sagen)

_Er antwortet nicht gleich._

**Ambrose:** Nach Norden. Es ist lange her.

**Ambrose:** Auf so etwas habe ich auch gespielt. An einem Kai, auf einem Fass, mit Knöpfen. Ich war neun.

**Ambrose:** Ich verlor gegen einen Matrosen aus Marseille und weinte. Er schenkte mir eine Orange.

**Ambrose:** Daran habe ich seit … Ich wusste nicht, dass ich das noch weiß.

_Juno hat nichts gehört. Sie fotografiert den Stein für das Tagebuch._

#### 118 · Flussweg

`weg-maple-cedar.schild_cedar` · keine laufende Quest

_Die Zedern stehen so dicht, dass die Schritte auf den Nadeln kein Geräusch mehr machen. Selbst Juno redet leiser._

_Ein Schild aus Holz: „Cedar Creek. Gegr. 1851.“ Dahinter, zwischen den Bäumen, schlägt eine Uhr. Viermal, langsam._

#### 119 · Flussweg

`weg-maple-cedar.finch_bauer_a` · keine laufende Quest

_Am Pfosten neben der Bank hängt ein Blechschild mit einem Finken. Unter der Bank klemmt etwas._

_Ein weißer Bauer aus hellem Holz. Unter dem Fuß ist ein Feld eingebrannt._

#### 120 · Flussweg

`weg-maple-cedar.faehrstein` · keine laufende Quest

_Der Stein mit dem eingeritzten Brett. Man fühlt die Linien eher, als man sie sieht._

**Silas:** Wieder nichts. Die Fische wissen, wann ich komme.

#### 121 · Landstraße

`weg-maple-cedar.fund_formular` · keine laufende Quest

_Hier im Gras lag das alte Formular. Jetzt ist hier nur noch Gras._

#### 122 · Landstraße

`weg-maple-cedar.ereignis_flohmarkt` · keine laufende Quest

**Odette Finch:** Hast du schon einen Finken gesehen? Die Figuren liegen nie ohne Zeichen.

_Odette packt eine Lampe in Zeitungspapier._

**Odette Finch:** Wir sehen uns wieder. Ich fahre weiter, als du denkst.

#### 123 · Landstraße

`weg-maple-cedar.seite00` · keine laufende Quest

_Im Graben liegt nur noch Laub._

#### 124 · Landstraße

`weg-maple-cedar.wanderer` · keine laufende Quest

**Wanderer:** Wieder unterwegs?

**Wanderer:** Heute hab ich am Gatter einen Bauern geschlagen. Am Fluss hat es mir leidgetan.

#### 125 · Landstraße

`weg-maple-cedar.gegnerin` · keine laufende Quest

(noch einmal angesprochen; hier nur, was neu ist)

**Ambrose:** Schnell war sie. Du warst da.

**Kim (Antwort):** „Ich muss weiter.“\
(andere Antworten: „Noch eine.“)

**Nia:** Sag Jo, ich hab extra langsam gespielt. Stimmt nicht, aber sag es ihr.

### Maple Falls

#### 126 · Stadtpark

`maple-falls-park.stamm_s2` · keine laufende Quest

_Hinter der Brücke liegt eine umgestürzte Zeder quer über dem Pfad. Von hier kommst du nicht weiter._

_Den Stamm muss jemand mit Seil und Flaschenzug wegziehen. Vielleicht braucht in Cedar Creek jemand Holz._

### Landstraße nach Cedar Creek

#### 127 · Landstraße

`weg-maple-cedar.wanderer` · keine laufende Quest

**Wanderer:** Der Weg ist das halbe Spiel. Die andere Hälfte ist das Brett.

#### 128 · Landstraße

`weg-maple-cedar.wanderer` · keine laufende Quest

**Wanderer:** Ich gehe weiter. Viel Glück in Cedar Creek!

#### 129 · Landstraße

`weg-maple-cedar.gatter_s1` · keine laufende Quest

_Das Gatter steht einen Spalt offen. Dahinter winkt ein Mann mit Strohhut._

_„Du bist das Kind von der Tafel. Mr. Pratt hat es erzählt. Komm rein. Gatter zu.“_

### Kürbishof Miller

#### 130 · Kürbishof

`kuerbishof.irrgarten` · keine laufende Quest

_Ein Schild am Maisfeld: „Clovers Irrgarten – Eingang. Ausgang auf eigene Gefahr.“_

#### 131 · Kürbishof

`kuerbishof.vogelscheuche` · keine laufende Quest

_Die Vogelscheuche trägt ein Schild um den Hals: „Morphy“. Die Krähen sitzen trotzdem auf ihrem Hut._

#### 132 · Kürbishof

`kuerbishof.kuerbiswaage` · keine laufende Quest

**Oma Miller:** Drei Kürbisse liegen neben der Waage. Welcher ist am schwersten? Wer richtig rät, bekommt eine Schleife.

**Kim (Antwort):** Der große, helle.\
(andere Antworten: Der kleine, dunkle. · Der längliche.)

**Oma Miller:** Groß ist nicht schwer. Der ist innen fast hohl. Versuch es nächstes Mal wieder.

#### 133 · Kürbishof

`kuerbishof.walt` · keine laufende Quest

_Ein Mann mit Strohhut wischt sich die Hände an der Latzhose ab._

**Walt Miller:** Walt Miller. Das Tor ist meistens zu, wegen der Kühe. Wer es aufbekommt, ist hier willkommen.

#### 134 · Kürbishof

`kuerbishof.clover` · Quest „Clovers Irrgarten“, Schritt 1 von 1: Aus Clovers Irrgarten herausfinden: An jeder Kreuzung wartet ein Matt in einem Zug.

**Clover:** Ich bin Clover. Den Irrgarten im Mais hab ich selbst geschnitten, wie jedes Jahr.

**Clover:** An jeder Kreuzung hängt eine Stellung. Wer das Matt findet, weiß den Weg. Traust du dich?

**Kim (Antwort):** Ja, rein in den Mais.\
(andere Antworten: Nicht jetzt.)

→ Quest begonnen: „Clovers Irrgarten“

[Aufgaben von Clover (kuerbishof.irrgarten) – Ausgang: bestanden]

→ Quest „Clovers Irrgarten“: Schritt 1 von 1 erledigt

→ Quest abgeschlossen: „Clovers Irrgarten“

#### 135 · Kürbishof

`kuerbishof.clover` · keine laufende Quest

**Clover:** Du bist rausgekommen! Nächstes Jahr schneide ich ihn schwerer.

#### 136 · Kürbishof

`kuerbishof.oma_miller` · keine laufende Quest

**Oma Miller:** Kuchen, Kürbisse, Apfelsaft. Und wer stehen bleibt, bekommt eine Geschichte gratis.

### Landstraße nach Cedar Creek

#### 137 · Flussweg

`weg-maple-cedar.fund_muenzen` · keine laufende Quest

_Die alte Kiste am Flussufer ist leer._

#### 138 · Flussweg

`weg-maple-cedar.finch_bauer_a` · keine laufende Quest

_Unter der Bank ist nichts mehr, nur das Blechschild mit dem Finken am Pfosten._

### Kürbishof Miller

#### 139 · Kürbishof

`kuerbishof.kuerbiswaage` · keine laufende Quest

(noch einmal angesprochen; hier nur, was neu ist)

**Kim (Antwort):** Der kleine, dunkle.\
(andere Antworten: Der große, helle. · Der längliche.)

**Oma Miller:** Richtig! Klein, aber dicht. Wie ein Bauer kurz vor der Umwandlung.

#### 140 · Kürbishof

`kuerbishof.walt` · keine laufende Quest

**Walt Miller:** Das Herbstfest ist in zwei Wochen. Bis dahin muss jeder Kürbis rund sein.

#### 141 · Kürbishof

`kuerbishof.oma_miller` · keine laufende Quest

**Oma Miller:** Früher kamen zum Herbstfest die Leute mit Pferdewagen. Heute mit dem Auto. Der Kuchen ist derselbe.

#### 142 · Kürbishof

`kuerbishof.kuerbiswaage` · keine laufende Quest

_Die Waage am Hofladen ist frei. Die blaue Schleife hängt jetzt bei dir._

### Landstraße nach Cedar Creek

#### 143 · Flussweg

`cedar-creek-aussen.ankunft_zu_fuss` · keine laufende Quest

_Cedar Creek ist kleiner als Maple Falls und sieht älter aus. In der Mitte, wo woanders eine Kirche steht, steht die Bibliothek._

_Auf ihrer Treppe sitzen zwei Kinder, die gleich aussehen, mit Figuren in den Händen und ohne Brett._

**Ivy:** Ich hab gewonnen!

**Jonah:** Du hast den Turm bewegt, als ich nicht geguckt hab!

**Ivy:** Du guckst nie!

**Kim (Antwort):** „Wer hat denn gewonnen?“\
(andere Antworten: Leise vorbeigehen)

_Beide zeigen auf sich. Dann aufeinander._

**Juno:** Hier flüstert sogar die Straße.

**Juno:** Mrs. Okafor erwartet uns. Der Coach kommt erst morgen mit dem Bus.

### Cedar Creek

#### 144 · Cedar Creek, Ortskern

`cedar-creek-aussen.bus_zurueck` · Quest „Auswärtsspiel in Cedar Creek“, Schritt 1 von 5: In die Stadtbibliothek zum Schachclub gehen.

→ Quest begonnen: „Auswärtsspiel in Cedar Creek“

_Die Haltestelle von Cedar Creek. Morgen ist der Clubkampf._

**Kim (Antwort):** Nach Maple Falls fahren\
(andere Antworten: Mit dem Busfahrer reden · Noch bleiben)

_Der Bus rollt die Landstraße entlang. Hinter dir werden die Zedern kleiner._

#### 145 · Cedar Creek, Ortskern

`cedar-creek-aussen.plakat` · Quest „Auswärtsspiel in Cedar Creek“, Schritt 1 von 5

_Ein großes, glänzendes Plakat: „Perfect Move – Schach für die Zukunft. Bald auch in deiner Stadt.“_

_Darauf ein Kind, das in einen Bildschirm lächelt. Es ist das einzige Glänzende weit und breit._

**Ambrose:** Ein Plakat, das droht. Wie reizend.

**Kim (Antwort):** „Das ist die Firma von Victors Vater.“\
(andere Antworten: „Vielleicht ist das gar nicht so schlecht.“)

**Ambrose:** So. Dann hat die Drohung einen Namen.

#### 146 · Cedar Creek, Ortskern

`cedar-creek-aussen.steg` · Quest „Auswärtsspiel in Cedar Creek“, Schritt 1 von 5

_Im Schilf am Steg glänzt etwas Rostiges: ein großer Schlüssel mit einem runden Griff._

_Am Ende des Stegs sitzt eine Frau mit Angel. Sie dreht sich nicht um._

**Rosa:** Den hat ein Angler verloren. Vor zwei Jahren schon.

**Rosa:** Nimm ihn mit. Vielleicht findest du das Schloss.

#### 147 · Cedar Creek, Ortskern

`cedar-creek-aussen.rosa` · Quest „Auswärtsspiel in Cedar Creek“, Schritt 1 von 5

_Am Ende des Stegs sitzt eine Frau mit Angel. Neben ihr ein Brett mit Magnetfiguren._

**Rosa:** Ruhig, ruhig. Der Fisch merkt, wenn du zappelst.

**Rosa:** Der Gegner auch. Ich bin Rosa.

**Rosa:** Ich stell dir was hin. Du hast Weiß und darfst angreifen. Zehn Züge. Nicht zappeln.

**Kim (Antwort):** „Abgemacht.“\
(andere Antworten: „Nicht jetzt.“)

_Rosa legt die Angel quer über die Knie und stellt die Figuren auf._

[Stellungsduell gegen Rosa – Ausgang: gewonnen]

#### 148 · Cedar Creek, Ortskern

`cedar-creek-aussen.rosa` · Quest „Auswärtsspiel in Cedar Creek“, Schritt 1 von 5

**Rosa:** Nicht gezappelt. Gut. Noch eine Runde, während die Fische schlafen?

**Ambrose:** Ruhige Hände, ruhiger Kopf. Das hatte ich in deinem Alter nicht.

**Kim (Antwort):** „Noch eine.“\
(andere Antworten: „Nicht jetzt.“)

_Rosa legt die Angel quer über die Knie und stellt die Figuren auf._

[Stellungsduell gegen Rosa, erneut – Ausgang: gewonnen]

#### 149 · Cedar Creek, Ortskern

`cedar-creek-aussen.victor` · Quest „Auswärtsspiel in Cedar Creek“, Schritt 1 von 5

_An der Haltestelle sitzt jemand. Gerade, die Füße nebeneinander, das Tablet auf den Knien. Das Plakat hängt über ihm._

_Er zieht. Das Programm antwortet sofort. Ein leises Klicken, wie ein Fingernagel auf Glas._

**Kim (Antwort):** „Spielst du gegen das Ding?“\
(andere Antworten: Leise weitergehen)

**Victor Hale:** Ich trainiere. Mein Vater ist im Rathaus.

**Victor Hale:** Der Bezirk hat drei Bibliotheken. Er will alle drei. Für Bildschirme. Es ist effizienter.

_Auf dem Brett geht es sehr schnell und sehr genau. Er verliert. Langsam, Zug um Zug, gegen etwas, das nie zögert._

**Kim (Antwort):** „Gewinnst du manchmal?“\
(andere Antworten: Gehen)

**Victor Hale:** Remis. Einmal im Monat.

**Victor Hale:** Mein Vater sagt, ein Remis gegen Schwächere ist eine Niederlage. Gegen das hier ist es ein Erfolg.

_Er tippt auf „Neue Partie“._

**Kim (Antwort):** „Macht dir das eigentlich Spaß?“\
(andere Antworten: Gehen)

_Seine Hand bleibt über dem Bildschirm stehen._

**Victor Hale:** Das ist keine Frage, die man beim Training stellt.

_Er zieht. Das Programm antwortet. Aber er hat drei Sekunden gebraucht. Du hast mitgezählt._

_Erst auf dem Weg zum Steg, zwischen den Zedernhecken, hörst du Ambrose wieder._

**Ambrose:** Er hält den Kopf wie er. Ein wenig schief. Wenn er rechnet.

**Kim (Antwort):** „Wie wer?“\
(andere Antworten: Nichts sagen)

_Keine Antwort._

#### 150 · Cedar Creek, Ortskern

`cedar-creek-aussen.zwillinge` · Quest „Auswärtsspiel in Cedar Creek“, Schritt 1 von 5

_Die Zwillinge sitzen noch auf der Treppe. Jetzt hat jeder einen Turm in der Faust._

**Jonah:** Diesmal guck ich die ganze Zeit.

**Ivy:** Dann ziehst du ja nie!

**Kim (Antwort):** Leise vorbeigehen\
(andere Antworten: „Wer hat denn gewonnen?“)

_Als du vorbeigehst, verstummen sie und sehen dir nach._

**Ambrose:** Zwei Könige und kein Brett. Daraus wird nie ein Ende.

#### 151 · Cedar Creek, Ortskern

`cedar-creek-aussen.zwillinge` · Quest „Auswärtsspiel in Cedar Creek“, Schritt 1 von 5

_Die Zwillinge sitzen noch auf der Treppe. Jetzt hat jeder einen Turm in der Faust._

**Jonah:** Diesmal guck ich die ganze Zeit.

**Ivy:** Dann ziehst du ja nie!

**Kim (Antwort):** „Wer hat denn gewonnen?“\
(andere Antworten: Leise vorbeigehen)

_Beide zeigen auf sich. Dann aufeinander. Dann wieder auf sich._

**Ambrose:** Zwei Könige und kein Brett. Daraus wird nie ein Ende.

#### 152 · Cedar Creek, Ortskern

`cedar-creek-aussen.kettering` · Quest „Auswärtsspiel in Cedar Creek“, Schritt 1 von 5

(noch einmal angesprochen; hier nur, was neu ist)

_Der Busfahrer hat die Mütze in den Nacken geschoben und liest Zeitung._

**Mr. Kettering:** Einunddreißig Jahre fahr ich diese Strecke. Jede Kurve hat einen Namen. Die meisten hab ich vergeben.

**Mr. Kettering:** Die Witwe. Nach der sieht man den Wasserfall.

**Kim (Antwort):** Mit dem Busfahrer reden\
(andere Antworten: Nach Maple Falls fahren · Noch bleiben)

_Der Busfahrer hat die Mütze in den Nacken geschoben und liest Zeitung._

**Mr. Kettering:** Einunddreißig Jahre fahr ich diese Strecke. Jede Kurve hat einen Namen. Die meisten hab ich vergeben.

**Kim (Antwort):** „Wird es nicht langweilig?“\
(andere Antworten: „Welche Kurve ist die schönste?“)

**Mr. Kettering:** Die Kurven sind dieselben. Die Leute nicht.

_Die Haltestelle von Cedar Creek. Morgen ist der Clubkampf._

**Kim (Antwort):** Noch bleiben\
(andere Antworten: Nach Maple Falls fahren · Mit dem Busfahrer reden)

#### 153 · Stadtbibliothek

`ansehen-cedar-creek.schild_fluestern` · Quest „Ein Name im Archiv“, Schritt 1 von 3: Mit Mrs. Okafor in der Bibliothek reden.

→ Quest „Auswärtsspiel in Cedar Creek“: Schritt 1 von 5 erledigt

→ Quest begonnen: „Ein Name im Archiv“

_Ein Schild am Tresen: „Bitte flüstern“._

**Ambrose:** Flüstern. Das kann ich. Mich hörst ohnehin nur du.

#### 154 · Stadtbibliothek

`ansehen-cedar-creek.zeitungsregal` · Quest „Ein Name im Archiv“, Schritt 1 von 3

_Ein Regal mit Zeitungen aus aller Welt. Die neueste ist von gestern, die älteste von 1890._

#### 155 · Stadtbibliothek

`ansehen-cedar-creek.globus` · Quest „Ein Name im Archiv“, Schritt 1 von 3

_Ein alter Globus mit vergilbten Meeren. Manche Länder darauf gibt es heute nicht mehr._

**Ambrose:** Ich suche New Orleans. Da. Es ist noch da.

#### 156 · Stadtbibliothek

`ansehen-cedar-creek.treppenhaus` · Quest „Ein Name im Archiv“, Schritt 1 von 3

_Eine Tür mit einem Messingschild: „Treppenhaus. Magazin und Lesezimmer im ersten Stock, nur für Personal.“_

_Abgeschlossen. Von oben riecht es nach noch mehr Büchern._

#### 157 · Stadtbibliothek

`cedar-creek-bibliothek.okafor` · Quest „Ein Name im Archiv“, Schritt 1 von 3

_Hohe Regale, grüne Leselampen, zwei Bretter, an denen niemand sitzt. Eine kleine Frau steht auf einer Leiter._

_Sie stellt ein Buch zurück und steigt herunter, ohne sich festzuhalten._

**Mrs. Okafor:** Ihr seid die Vorhut. Grace Okafor. Die Matten liegen im Lesesaal.

**Mrs. Okafor:** Juno Martínez. Du hast im Frühjahr gegen Mae deine Dame auf ein Feld gestellt, auf dem ein Springer stand.

**Juno:** Ich dachte, der gehört mir.

**Mrs. Okafor:** Was glaubst du denn, warum er dort stand?

**Kim (Antwort):** Juno anstoßen\
(andere Antworten: Nichts sagen)

_Dann sieht sie dich an. Dann deinen Rucksack, aus dem eine Ecke des Bretts ragt. Sie sagt lange nichts._

**Mrs. Okafor:** Darf ich?

**Kim (Antwort):** Ihr das Brett geben\
(andere Antworten: Nicken)

_Sie hält es ins Licht der grünen Lampe und fährt mit dem Daumen über den Rand._

**Mrs. Okafor:** A. W. Achtzehnhundertsiebenundfünfzig.

**Mrs. Okafor:** Whitlock.

**Kim (Antwort):** „Sie kennen den Namen?“\
(andere Antworten: Still bleiben)

**Mrs. Okafor:** Er steht in einer Fußnote. In einem alten Schachkalender, unten im Archiv.

**Mrs. Okafor:** Niemand schreibt über ihn. Eine Fußnote, sechs Wörter.

**Mrs. Okafor:** Woher hast du das?

**Kim (Antwort):** „Vom Dachboden. Wir sind in das Haus gezogen.“\
(andere Antworten: „Es lag in einer Kiste.“)

**Mrs. Okafor:** Aha.

_Sie gibt dir das Brett zurück, mit beiden Händen. Dann nimmt sie die Brille ab und putzt sie. Sie fragt nicht weiter._

**Mrs. Okafor:** Manche Dinge erzählt man, wenn man so weit ist.

**Ambrose:** Sechs Wörter.

**Ambrose:** Eine Fußnote.

**Mrs. Okafor:** Nach dem Spiel morgen gehen wir hinunter und sehen nach. Oder heute schon, wenn du mir tragen hilfst.

**Kim (Antwort):** „Ich helfe tragen.“\
(andere Antworten: „Erst will ich spielen.“)

**Mrs. Okafor:** Wir hatten Wasser im Keller. Die Treppe hinten führt hinunter. Ich komme gleich nach.

→ Quest „Ein Name im Archiv“: Schritt 1 von 3 erledigt

#### 158 · Stadtbibliothek

`cedar-creek-bibliothek.dex` · Quest „Ein Name im Archiv“, Schritt 2 von 3: Im Archiv den Karton mit den Jahren 1850 bis 1859 öffnen.

_Ein Junge sitzt zwischen Kabeln und einem halb gebauten Roboter. Daneben ein Brett._

**Dex:** Dex. Halt mal.

_Er drückt dir eine Zange in die Hand._

**Dex:** Fast fertig. Es ist immer fast fertig.

**Dex:** Schach ist wie ein Schaltplan. Wenn der Turm hier steht, ist das wie ein Kurzschluss. Alles ist tot.

**Dex:** Siehst du? Kurzschluss. Matt in eins. Such.

**Kim (Antwort):** „Her damit.“\
(andere Antworten: „Gleich.“)

[Aufgaben von Dex (cedarCreek.reiheDex) – Ausgang: bestanden]

→ Quest „Auswärtsspiel in Cedar Creek“: Schritt 2 von 5 erledigt

#### 159 · Stadtbibliothek

`cedar-creek-bibliothek.dex` · Quest „Auswärtsspiel in Cedar Creek“, Schritt 3 von 5: Maes Aufgaben lösen.

**Dex:** Matt in eins ist wie ein Schalter. An, aus, fertig.

#### 160 · Stadtbibliothek

`cedar-creek-bibliothek.mae` · Quest „Auswärtsspiel in Cedar Creek“, Schritt 3 von 5

_Ein Mädchen mit Teleskop-Anstecker und einem Heft voller Zeichnungen winkt dir zu._

**Mae:** Ich bin Mae! Ich kenne alle Mattbilder. Alle mit Namen.

**Mae:** Anastasia! Das ist ein Matt mit Namen.

**Mae:** Das klingt wie eine Prinzessin, ist aber gemein.

**Mae:** Das hier ist das Arabische. Und das …

_Sie senkt die Stimme._

**Mae:** Das ist das Erstickte. Da hat der König so viele Freunde um sich, dass er keine Luft kriegt.

**Ambrose:** Mattbilder sind wie Gesichter. Wer eines kennt, erkennt es in jeder Menge.

**Kim (Antwort):** „Los geht's.“\
(andere Antworten: „Gleich.“)

[Aufgaben von Mae (cedarCreek.reiheMae) – Ausgang: bestanden]

→ Quest „Auswärtsspiel in Cedar Creek“: Schritt 3 von 5 erledigt

#### 161 · Stadtbibliothek

`cedar-creek-bibliothek.mae` · Quest „Sternennacht am Steg“, Schritt 1 von 1: Am Abend zum Steg kommen und mit Mae Sternschnuppen schauen.

**Mae:** Heute Nacht kommen Sternschnuppen! Ganz viele. Wir schauen am Steg.

**Mae:** Dex kommt, Juno kommt, Mrs. Okafor passt auf. Kommst du auch?

**Kim (Antwort):** „Klingt toll.“\
(andere Antworten: „Mal sehen.“)

**Mae:** Super! Wenn es dunkel wird, am Steg.

→ Quest begonnen: „Sternennacht am Steg“

#### 162 · Stadtbibliothek

`cedar-creek-bibliothek.zwillinge` · Quest „Auswärtsspiel in Cedar Creek“, Schritt 4 von 5: Gegen Mrs. Okafor um die Clubnadel spielen.

_Die Zwillinge sitzen draußen auf der Treppe. Hier drinnen ist es still._

#### 163 · Archiv im Keller

`ansehen-cedar-creek.boxerfoto` · Quest „Auswärtsspiel in Cedar Creek“, Schritt 4 von 5

_Ein vergilbtes Foto: ein Boxer mit erhobenen Fäusten, darunter „Cedar Creek, 1923“._

**Ambrose:** Ein Mann mit zwei Talenten. Das zweite war das bessere.

#### 164 · Archiv im Keller

`cedar-creek-archiv.programmheft` · Quest „Auswärtsspiel in Cedar Creek“, Schritt 4 von 5

_Ein dünnes, vergilbtes Heft. Es liegt in einem Karton, den du noch nicht öffnen sollst._

#### 165 · Archiv im Keller

`cedar-creek-archiv.karton` · Quest „Ein Name im Archiv“, Schritt 3 von 3: Zuhören, was Ambrose über 1858 erzählt.

→ Quest „Ein Name im Archiv“: Schritt 2 von 3 erledigt

_Eine Wendeltreppe hinunter. Es riecht nach Büchern, die nass geworden sind._

_Eine einzige Lampe hängt am Kabel von der Decke. Sie flackert._

**Mrs. Okafor:** Da bin ich. Links das neunzehnte Jahrhundert, rechts das zwanzigste. Wo der Boden trocken ist.

**Kim (Antwort):** Anfangen\
(andere Antworten: Nicht jetzt)

_Sie liest die Jahreszahlen vor. „1972.“_

**Kim (Antwort):** Nach links\
(andere Antworten: Nach rechts)

**Mrs. Okafor:** Rechts.

_Ein Karton ist so durchweicht, dass der Boden nachgibt. Zeitungen rutschen heraus, braun und weich wie Herbstlaub._

**Kim (Antwort):** Sie aufheben\
(andere Antworten: Liegen lassen)

**Mrs. Okafor:** Lass.

**Mrs. Okafor:** Die sind verloren. Man kann nicht alles retten.

_Sie sagt es ruhig. Aber sie hebt trotzdem jede einzelne auf._

_Der letzte Karton steht ganz hinten auf einem Regal. Auf ihm steht „1850 bis 1859“. Er ist trocken geblieben._

**Kim (Antwort):** Vorsichtig auf den Tisch stellen\
(andere Antworten: Unter die Lampe tragen)

**Mrs. Okafor:** Bei uns sagte man: Wer nur auf seinen Weg schaut, fällt in das Loch daneben.

**Mrs. Okafor:** Ich habe den Kalender gelesen und nie in den Karton daneben geschaut.

**Mrs. Okafor:** Ich muss nach oben. Prudence schließt sonst die Kasse falsch ab. Du findest dich zurecht.

_Ihre Schritte auf der Wendeltreppe. Dann nichts mehr._

**Kim (Antwort):** Den Karton öffnen\
(andere Antworten: Nicht jetzt)

_Im Karton liegt eine Zeitung. Vier Seiten, dünn, die Schrift so klein, dass sie vor den Augen schwimmt._

_„Crescent City Herald“. Ein Datum im Oktober 1858. Ganz unten im Karton liegt ein Heft._

_Auf der dritten Seite, zwischen einer Anzeige für Schiffspassagen und dem Preis für Baumwolle, steht ein Absatz._

_„Mr. Hale, Ingenieur, schlägt Mr. Whitlock im Match, vier zu drei.“_

_„Mr. Whitlocks Opfer im letzten Spiel wird noch lange besprochen werden. Mr. Hale nannte es ‚bemerkenswert unnötig‘.“_

_Du liest es zweimal._

**Ambrose:** Leg es weg.

_Er steht neben dem Tisch, im Lichtkegel. Zum ersten Mal sieht er alt aus._

**Kim (Antwort):** „Hale.“\
(andere Antworten: „Ambrose.“)

**Ambrose:** Es gibt viele.

_Die Lampe flackert. Irgendwo tropft Wasser._

**Ambrose:** Vier zu drei. Sieben Partien, in einem Saal über einem Kaffeehaus, und die halbe Stadt stand auf der Treppe.

**Ambrose:** Ich war siebenundzwanzig und der Beste, den sie hatten. Ich wusste es. Das war das Unglück.

**Kim (Antwort):** „Und der andere?“\
(andere Antworten: Warten)

_Er beginnt, auf und ab zu gehen. Drei Schritte, die Wand, drei Schritte zurück._

**Ambrose:** Ein Ingenieur, Brückenbauer aus dem Norden. Er spielte, wie man eine Brücke baut.

**Ambrose:** Jeder Stein auf den anderen. Nichts Überflüssiges, nichts Schönes. Ich fand ihn unerträglich.

**Ambrose:** In der siebten stand ich auf Gewinn. Ein Kind hätte sie gewonnen. Einen Bauern nehmen und nach Hause gehen.

**Ambrose:** Aber ich sah ein Opfer. Einen Turm, mitten in seine Stellung. Ich wusste nicht einmal, ob es stimmte.

**Ambrose:** Ich habe es gespielt, weil die Leute auf der Treppe standen. Sie sollten in hundert Jahren noch davon reden.

**Kim (Antwort):** „Hat es gestimmt?“\
(andere Antworten: Warten)

**Ambrose:** Nein.

_Das Wort bleibt im Raum._

**Ambrose:** Es gab eine Verteidigung. Einen einzigen stillen Zug. Er brauchte vierzig Minuten.

**Ambrose:** Er sah mich nicht an dabei. Dann stellte er einen Läufer ein Feld zurück, und alles fiel zusammen.

**Ambrose:** Bemerkenswert unnötig. Er hatte recht. Das habe ich ihm nie verziehen.

**Kim (Antwort):** „Das ist wie bei mir gegen Victor.“\
(andere Antworten: Nichts sagen)

**Ambrose:** Nein. Du hattest eine verlorene Stellung.

**Ambrose:** Ich hatte eine gewonnene und habe sie verschenkt.

**Ambrose:** Ich habe Revanche verlangt. Im Jahr darauf, in einem langen Brief. Er schrieb zurück. Ein Wort.

**Kim (Antwort):** „Welches?“\
(andere Antworten: Warten)

**Ambrose:** Später.

**Kim (Antwort):** „Hale wie Victor?“\
(andere Antworten: Schweigen)

**Ambrose:** Hale wie viele.

_Aber er sieht dich an dabei. Er weiß es nicht. Und er hat Angst, es zu wissen._

→ Quest „Ein Name im Archiv“: Schritt 3 von 3 erledigt

→ Quest abgeschlossen: „Ein Name im Archiv“

→ Quest begonnen: „Nasse Kartons“

→ Quest „Nasse Kartons“: Schritt 1 von 1 erledigt

→ Quest abgeschlossen: „Nasse Kartons“

#### 166 · Archiv im Keller

`ansehen-cedar-creek.wasserfleck` · keine laufende Quest

_An der Wand ein Wasserfleck, genau in der Form eines Springers._

**Ambrose:** Ein Springer. Das Wasser hat sich Mühe gegeben.

#### 167 · Archiv im Keller

`ansehen-cedar-creek.kellertuer` · keine laufende Quest

_Eine schwere Tür mit rostigem Riegel. Auf einem Zettel steht: „Heizung und Lager. Schlüssel beim Hausmeister.“_

_Abgeschlossen._

#### 168 · Stadtbibliothek

`ansehen-cedar-creek.schild_fluestern` · keine laufende Quest

_Das Schild „Bitte flüstern“ hängt schief. Vielleicht hat jemand zu laut gelacht._

#### 169 · Stadtbibliothek

`ansehen-cedar-creek.zeitungsregal` · keine laufende Quest

_In der Lokalzeitung steht eine Schachaufgabe: „Weiß am Zug. Lösung nächste Woche.“ Jemand hat sie schon mit Bleistift gelöst._

#### 170 · Stadtbibliothek

`ansehen-cedar-creek.globus` · keine laufende Quest

_Auf dem Globus hat jemand mit Bleistift ein winziges Kreuz neben Lagos gemalt._

#### 171 · Stadtbibliothek

`ansehen-cedar-creek.treppenhaus` · keine laufende Quest

_Die Tür zum Treppenhaus bleibt zu. Oben knarrt eine Diele._

#### 172 · Stadtbibliothek

`cedar-creek-bibliothek.okafor` · keine laufende Quest

**Mrs. Okafor:** Die Aufgaben sind gelöst. Gespielt wird morgen, wenn dein Team da ist.

**Mrs. Okafor:** Heute Abend schauen die Kinder am Steg nach den Sternen. Danach: die Matten im Lesesaal.

**Kim (Antwort):** „Ich geh noch zum Steg.“\
(andere Antworten: „Ich geh schlafen.“)

**Mrs. Okafor:** Geh nur. Am Wasser wird es abends kalt.

#### 173 · Stadtbibliothek

`cedar-creek-bibliothek.mae` · keine laufende Quest

**Mae:** Ein Erstickungsmatt mit dem Springer. Das ist mein Lieblingsbild.

#### 174 · Cedar Creek, Ortskern

`cedar-creek-aussen.plakat` · keine laufende Quest

(noch einmal angesprochen; hier nur, was neu ist)

**Kim (Antwort):** „Vielleicht ist das gar nicht so schlecht.“\
(andere Antworten: „Das ist die Firma von Victors Vater.“)

**Ambrose:** Vielleicht.

#### 175 · Cedar Creek, Ortskern

`cedar-creek-aussen.steg` · Quest „Sternennacht am Steg“, Schritt 1 von 1: Am Abend zum Steg kommen und mit Mae Sternschnuppen schauen.

_Es wird dunkel. Am Steg sitzen Mae, Dex und Juno auf einer Decke._

_Mrs. Okafor hat eine Thermoskanne dabei._

**Mae:** Da bist du ja! Gleich geht es los!

**Kim (Antwort):** Dazusetzen\
(andere Antworten: „Ich bin zu müde. Ein andermal.“)

_Mae hat ein Teleskop aufgebaut, das größer ist als sie selbst._

_Dex hat eine rote Lampe gebastelt, „damit die Augen sich nicht erschrecken“. Alle paar Minuten geht sie aus._

_Mrs. Okafor hatte gesagt, eine halbe Stunde. Das war vor zwei Stunden._

**Mae:** Die da ist Kassiopeia. Sieht aus wie ein W. Und das ist der Große Wagen, und das …

**Dex:** Mae. Du musst nicht alles benennen.

**Mae:** Doch. Sonst weiß man nicht, was man sieht.

**Kim (Antwort):** Die Hand auf das Brett legen\
(andere Antworten: Nach oben sehen)

_Das Brett liegt neben dir auf der Decke, in sein Handtuch gewickelt._

**Ambrose:** Sie stehen noch wie früher. Alles andere hat sich verändert: Lichter ohne Flamme, Wagen ohne Pferde.

**Ambrose:** Wo ich geboren bin, saß ich nachts am Kai. Mein Vater baute Klaviere und lieferte sie flussauf aus. Er kam spät.

**Ambrose:** Ich sah hinauf und dachte, ich würde einmal so bekannt wie einer von denen. Einer mit Namen.

**Ambrose:** Eine Fußnote. Sechs Wörter.

_Antworten kannst du ihm nicht, nicht vor den anderen._

**Kim (Antwort):** Die Hand auf dem Brett lassen\
(andere Antworten: Nach oben sehen)

**Mae:** Da!

**Dex:** Das war ein Flugzeug.

_Dann ein Strich über den Himmel, hell und schon vorbei._

**Juno:** Hast du dir was gewünscht?

**Kim (Antwort):** Nicken\
(andere Antworten: Nach oben sehen)

**Mae:** Man darf es nicht sagen.

_Du hast dir etwas gewünscht. Es hat mit dem Brett zu tun, und mit jemandem, der einen Zug schuldig ist._

_Mrs. Okafor ist aufgestanden und steht hinter euch, die Decke um die Schultern._

**Mrs. Okafor:** Als ich so alt war wie ihr, hat mein Onkel mir Schach beigebracht. Auf einem Dach in Lagos.

**Mrs. Okafor:** Er sagte: Geduld, Grace. Die Nacht ist lang, und der Gegner wird müde vor dir.

**Mrs. Okafor:** Ich habe sechzig Jahre geglaubt, das sei ein Rat fürs Schach.

**Kim (Antwort):** Weiter nach oben sehen\
(andere Antworten: Die Augen schließen)

_Sie bleibt bis nach Mitternacht. Ihr zählt elf Sternschnuppen._

_Dex' Lampe geht endgültig aus. Niemand vermisst sie._

_Dann geht ihr hinüber in den Lesesaal. Die Matten liegen zwischen den Regalen._

→ Quest „Sternennacht am Steg“: Schritt 1 von 1 erledigt

→ Quest abgeschlossen: „Sternennacht am Steg“

#### 176 · Cedar Creek, Ortskern

`cedar-creek-aussen.victor` · keine laufende Quest

_Victor spielt weiter auf seinem Tablet. Er sieht nicht auf._

#### 177 · Cedar Creek, Ortskern

`cedar-creek-aussen.kettering` · keine laufende Quest

_Über dem Ort schlägt die Uhr acht. Auf der Straße klappert ein Bus._

_Dann ein Pfiff auf zwei Fingern._

**Coach Delgado:** Morgen, Vorhut! Steht die Bibliothek noch?

**Sam:** Ich hab im Bus geschlafen. Mit dem Kopf auf dem Schachkoffer. Der ist hart.

**Kim (Antwort):** „Wir haben elf Sternschnuppen gesehen.“\
(andere Antworten: „Wir haben auf Matten geschlafen. Zwischen den Regalen.“)

**Sam:** Elf? Und ich hab geschlafen. Typisch.

**Coach Delgado:** Clubkampf am Vormittag. Bis dahin: Kopf frei, Figuren sortiert.

**Coach Delgado:** Der Bus wartet bis heute Abend. Mr. Kettering fährt uns zurück.

#### 178 · Waschsalon

`ansehen-cedar-creek.zettel_turm` · keine laufende Quest

_Ein Zettel am schwarzen Brett: „Verloren: ein weißer Turm. Finderlohn: eine Wäsche umsonst.“_

#### 179 · Waschsalon

`cedar-creek-waschsalon.trockner` · keine laufende Quest

_Auf einem Trockner klebt ein Brett mit Klebeband. Daneben ein Zettel: „Bitte beim Chef melden.“_

#### 180 · Waschsalon

`ansehen-cedar-creek.comicheft` · keine laufende Quest

_Ein zerlesenes Comicheft: Ein Held mit Umhang kämpft gegen einen Roboter, natürlich am Schachbrett._

#### 181 · Waschsalon

`ansehen-cedar-creek.automat` · keine laufende Quest

_Ein Automat für Waschpulver und Kaugummi. Eine Kugel Kaugummi kostet eine Münze._

**Ambrose:** Eine Münze, eine Kugel. Kein Dank, kein Wort. Sonderbar.

#### 182 · Waschsalon

`cedar-creek-waschsalon.boateng` · Quest „Die Stellung auf dem Trockner“, Schritt 1 von 1: Die Stellung lösen, die Mr. Boateng auf den Trockner geklebt hat.

_Mrs. Okafor hat dich mit einem Sack Tischdecken herübergeschickt._

_Maschinen brummen, warme Luft, es riecht nach Seife. Hinter dem Tresen ein alter Mann mit sehr großen, ruhigen Händen._

**Mr. Boateng:** Die Stellung da steht seit Montag.

**Mr. Boateng:** Die Maschine schleudert, du denkst. Beides braucht zwölf Minuten.

**Mr. Boateng:** Auf dem Trockner dort klebt jede Woche eine neue Stellung. Wer sie löst, wäscht einmal umsonst.

**Kim (Antwort):** „Ich versuche es.“\
(andere Antworten: „Ich habe keine eigene Wäsche dabei.“)

**Mr. Boateng:** Nur zu. Weiß am Zug, Matt in zwei.

→ Quest begonnen: „Die Stellung auf dem Trockner“

#### 183 · Cedar Creek, Ortskern

`cedar-creek-aussen.bus_zurueck` · keine laufende Quest

_Die Haltestelle von Cedar Creek. Das Auswärtsspiel läuft noch._

**Kim (Antwort):** Mit dem Busfahrer reden\
(andere Antworten: Nach Maple Falls fahren · Noch bleiben)

_Der Busfahrer hat die Mütze in den Nacken geschoben und liest Zeitung._

**Mr. Kettering:** Einunddreißig Jahre fahr ich diese Strecke. Jede Kurve hat einen Namen. Die meisten hab ich vergeben.

**Kim (Antwort):** „Welche Kurve ist die schönste?“\
(andere Antworten: „Wird es nicht langweilig?“)

**Mr. Kettering:** Die Witwe. Nach der sieht man den Wasserfall.

_Die Haltestelle von Cedar Creek. Das Auswärtsspiel läuft noch._

**Kim (Antwort):** Noch bleiben\
(andere Antworten: Nach Maple Falls fahren · Mit dem Busfahrer reden)

#### 184 · Cedar Creek, Ortskern

`cedar-creek-aussen.steg` · keine laufende Quest

_Der Bach glitzert unter dem Steg. Hier habt ihr elf Sternschnuppen gezählt._

#### 185 · Drechslerei Dunmore

`cedar-creek-drechslerei.dunmore` · keine laufende Quest

_Späne auf dem Boden, Harz in der Luft. Ein Mann mit Schürze dreht ein Stück Ahorn auf der Drechselbank._

_Auf dem Regal steht ein Figurensatz aus hellem und dunklem Holz. Ein Springer fehlt._

**Mr. Dunmore:** Für den Club. Alles fertig bis auf das Pferd. Die Mähne will nicht.

**Kim (Antwort):** „Darf ich zusehen?“\
(andere Antworten: „Warum ist der Springer so schwer?“)

**Mr. Dunmore:** Zusehen ist frei. Reden kostet einen Span.

**Ambrose:** Ein Handwerker, der an einem Springer verzweifelt. Willkommen im Schach, Sir.

#### 186 · Cedar Creek, Ortskern

`cedar-creek-aussen.zedernpfad_zu` · keine laufende Quest

_Der Pfad führt zwischen die Zedern, Richtung Maple Falls. Nach ein paar Schritten liegt ein umgestürzter Stamm quer über dem Weg._

_Von dieser Seite kommst du nicht hinüber. Mit dem Bus geht es schneller._

### Maple Falls

#### 187 · Stadtpark

`maple-falls-park.bushaltestelle` · keine laufende Quest

_Der Bus nach Cedar Creek steht an der Haltestelle, der Motor läuft. Der Fahrer nickt dir zu._

**Kim (Antwort):** Einsteigen\
(andere Antworten: Nicht jetzt)

_Der Bus fährt los, die Landstraße entlang nach Cedar Creek._

#### 188 · Stadtpark

`maple-falls-park.landstrasse` · keine laufende Quest

_Die Landstraße nach Cedar Creek. Du kennst den Weg schon._

### Landstraße nach Cedar Creek

#### 189 · Flussweg

`cedar-creek-aussen.ankunft_zu_fuss` · keine laufende Quest

_Der Flussweg endet an der Bushaltestelle von Cedar Creek._

### Cedar Creek

#### 190 · Stadtbibliothek

`cedar-creek-bibliothek.okafor` · keine laufende Quest

_In der Bibliothek flüstert man auch beim Schach. Der lange Tisch ist geräumt bis auf ein Brett._

_Daneben liegt die Nadel: ein kleines Buch aus Metall, aufgeschlagen, mit einem Springer._

_Außerhalb des Lichtkreises sitzen sie alle. Der Coach hält die Pfeife in der Faust, damit sie nicht pfeift._

**Mrs. Okafor:** Ich bin gestern zu lange aufgeblieben. Das ist deine Schuld und die der Sterne. Ich beschwere mich nicht.

**Mrs. Okafor:** Setz dich.

**Kim (Antwort):** „Ich bin bereit.“\
(andere Antworten: „Noch nicht.“)

_Die Uhr im Türmchen tickt. Man hört sie durch die Decke._

[Partie gegen Mrs. Okafor – Ausgang: gewonnen]

→ Quest „Auswärtsspiel in Cedar Creek“: Schritt 4 von 5 erledigt

#### 191 · Stadtbibliothek

`cedar-creek-bibliothek.okafor` · Quest „Auswärtsspiel in Cedar Creek“, Schritt 5 von 5: Am Abend noch einmal zum Steg gehen.

_Sie legt die Hände in den Schoß und sieht dich über die Brille an._

**Mrs. Okafor:** Das war keine Falle wert. Du hast sie alle gesehen.

**Kim (Antwort):** „Nicht alle.“\
(andere Antworten: Nicken)

**Mrs. Okafor:** Genug.

_Über euch schlägt die Uhr. Zwölf Schläge, einer nach dem anderen._

_Sie reicht dir die Nadel über das Brett._

**Mrs. Okafor:** Revanche, wenn ich ausgeschlafen bin.

**Mae:** Das am Schluss hat keinen Namen. Darf ich ihm einen geben?

**Kim (Antwort):** Nicken\
(andere Antworten: Die Nadel ansehen)

_Ambrose sagt nichts. Aber er ist da._

#### 192 · Stadtbibliothek

`cedar-creek-bibliothek.dex` · Quest „Auswärtsspiel in Cedar Creek“, Schritt 5 von 5

**Dex:** Der Roboter kann jetzt einen Bauern schieben. Einen. Dann fällt er um.

#### 193 · Stadtbibliothek

`cedar-creek-bibliothek.mae` · Quest „Auswärtsspiel in Cedar Creek“, Schritt 5 von 5

**Mae:** Mrs. Okafor ist heute müde. Das ist meine Schuld. Und die der Sterne.

#### 194 · Cedar Creek, Ortskern

`cedar-creek-aussen.bus_zurueck` · Quest „Auswärtsspiel in Cedar Creek“, Schritt 5 von 5

_Der Bus fährt um sieben. Am Steg ist das Wasser rot von der Sonne._

**Kim (Antwort):** Mit dem Busfahrer reden\
(andere Antworten: Nach Maple Falls fahren · Noch bleiben)

**Mr. Kettering:** Die Linie wird geprüft, haben sie gesagt. Was es da zu prüfen gibt, weiß ich nicht.

_Er faltet die Zeitung zusammen._

**Mr. Kettering:** Ich fahr sie jedenfalls, solange sie mich lassen.

_Der Bus fährt um sieben. Am Steg ist das Wasser rot von der Sonne._

**Kim (Antwort):** Noch bleiben\
(andere Antworten: Nach Maple Falls fahren · Mit dem Busfahrer reden)

#### 195 · Cedar Creek, Ortskern

`cedar-creek-aussen.steg` · Quest „Auswärtsspiel in Cedar Creek“, Schritt 5 von 5

_Das Wasser ist rot von der Sonne. Die Zedern stehen schwarz dagegen._

_Du setzt dich ans Ende der Bretter und legst das Brett neben dich, ohne Handtuch. Er steht am Geländer._

**Ambrose:** Ich hätte dich die Partie gekostet.

**Kim (Antwort):** „Hast du aber nicht.“\
(andere Antworten: „Ich hab gezählt. Wie du es mir beigebracht hast.“)

**Ambrose:** Weil du gezählt hast. Ich hätte nicht gezählt. Ich habe nie gezählt.

**Ambrose:** Ein Loch in einer Königsstellung, und ich bin wieder siebenundzwanzig und will, dass die Treppe klatscht.

**Ambrose:** Du spielst nicht schön, Lehrling. Ich sage das ohne Bosheit.

**Ambrose:** Du spielst wie jemand, der ein Haus abschließt, bevor er geht. Erst die Fenster, dann die Tür.

**Ambrose:** Zu meiner Zeit hätte ich so jemanden nicht einmal gegrüßt.

**Ambrose:** Und du hast heute eine Frau geschlagen, gegen die ich nicht sicher wäre.

**Kim (Antwort):** „Was willst du eigentlich?“\
(andere Antworten: „Du findest das Zählen langweilig. Was willst du?“)

**Ambrose:** Was ich will.

_Ein Fisch springt. Die Ringe laufen auseinander._

**Ambrose:** Eine Partie ohne Makel.

_Er sagt es einfach so. Nicht stolz. Wie man etwas zugibt._

**Ambrose:** Eine. Von Anfang bis Ende richtig und von Anfang bis Ende schön.

**Ambrose:** Ich habe mein ganzes Leben geglaubt, man müsse wählen. Hale hat richtig gespielt und ich schön.

**Kim (Antwort):** Zuhören

**Ambrose:** Er hat gewonnen. Und ich habe mir gesagt, dass es das wert war.

**Ambrose:** Ich hatte sie fast. Die eine Partie. Auf diesem Brett.

**Kim (Antwort):** „Die Fernpartie.“\
(andere Antworten: Auf das Brett sehen)

**Ambrose:** Gegen ihn. Per Brief. Jeder Zug tagelang unterwegs, manchmal Wochen.

**Ambrose:** Ich habe nie so langsam gespielt. So ehrlich.

**Ambrose:** Es fehlte nur noch seine Antwort. Ein Zug.

**Kim (Antwort):** „Und er hat nicht geantwortet.“\
(andere Antworten: Warten)

**Ambrose:** Jemand sagte: Später.

_Das Wort liegt zwischen euch auf dem Steg._

**Kim (Antwort):** „Dann spielen wir sie eben jetzt.“\
(andere Antworten: „Ich bin nicht gut genug. Noch nicht.“)

_Ambrose starrt dich an._

**Ambrose:** Du weißt nicht, was du da sagst.

**Kim (Antwort):** „Nein. Aber ich sag es trotzdem.“\
(andere Antworten: „Ich werde besser. Du bringst es mir bei.“)

_Ambrose lacht. Zum ersten Mal ohne Spott. Es klingt wie jemand, der sehr lange die Luft angehalten hat._

**Ambrose:** Ein Kind. Bei allen Heiligen. Ein Kind mit einem Radiergummi als Dame.

_Hinter euch hupt der Bus. Mr. Kettering fährt, wie er seit einunddreißig Jahren fährt._

**Mr. Kettering:** Die Witwe. – Der Hühnerstall. – Achtung, der lange Otis.

_Sam schläft nach der dritten Kurve ein, den Kopf auf dem Schachkoffer._

_Vorn rechnet der Coach etwas auf einem Spielbericht. Keine Schachaufgabe: Zahlen mit Dollarzeichen._

**Kim (Antwort):** Juno fragen, was der Coach rechnet\
(andere Antworten: Aus dem Fenster sehen)

**Juno:** Weiß ich nicht. Sie hat das Blatt umgedreht, als ich geguckt hab.

**Juno:** Zwei Clubnadeln. Ein Ahornblatt, ein Buch. Sternschnuppen: elf.

_Ihr Handy summt. Ihr Gesicht verändert sich._

**Juno:** Meine Cousine. Aus Riverton. Die haben da einen Club im Park, schon immer. Der wird neu aufgestellt.

_Ein Foto: eine Reihe Tische mit Bildschirmen, an denen niemand sitzt. Darunter: „Mit Perfect Move. Ist das nicht toll?“_

_Im Rucksack liegt das Brett. Schwarz ist am Zug._

_Später, denkst du. Aber nicht mehr lange._

→ Quest „Auswärtsspiel in Cedar Creek“: Schritt 5 von 5 erledigt

→ Quest abgeschlossen: „Auswärtsspiel in Cedar Creek“

#### 196 · Cedar Creek, Ortskern

`cedar-creek-aussen.zwillinge` · keine laufende Quest

_Die Zwillinge sitzen wieder auf der Treppe. Zwischen ihnen liegt jetzt ein Zettel mit Strichen._

**Ivy:** Miss Ashby zählt mit. Sie ist die Schiedsrichterin. Sie guckt immer.

**Jonah:** Dreizehn zu zwölf. Für mich.

**Ivy:** Für mich!

#### 197 · Cedar Creek, Ortskern

`cedar-creek-aussen.kettering` · keine laufende Quest

**Mr. Kettering:** Die Linie wird geprüft, haben sie gesagt. Was es da zu prüfen gibt, weiß ich nicht.

_Er faltet die Zeitung zusammen._

**Mr. Kettering:** Ich fahr sie jedenfalls, solange sie mich lassen.

_Der Bus nach Maple Falls. Die Fenster sind golden vom Abendlicht._

**Kim (Antwort):** Nach Maple Falls fahren\
(andere Antworten: Mit dem Busfahrer reden · Noch bleiben)

_Der Bus rollt die Landstraße entlang. Hinter dir werden die Zedern kleiner._

#### 198 · Cedar Creek, Ortskern

`cedar-creek-aussen.steg` · keine laufende Quest

_Der Steg liegt still in der Abendsonne. Der Bus nach Maple Falls wartet an der Haltestelle._

#### 199 · Stadtbibliothek

`cedar-creek-bibliothek.okafor` · keine laufende Quest

**Mrs. Okafor:** Ein Matt ist ein Bild. Wer viele Bilder kennt, sieht sie im eigenen Spiel.

**Kim (Antwort):** „Noch eine Partie um die Nadel.“\
(andere Antworten: „Bis bald, Mrs. Okafor.“)

[Partie gegen Mrs. Okafor, erneut – Ausgang: gewonnen]

#### 200 · Stadtbibliothek

`cedar-creek-bibliothek.okafor` · keine laufende Quest

**Mrs. Okafor:** Komm wieder, wenn du magst. Wir haben Zeit.

**Kim (Antwort):** „Bis bald, Mrs. Okafor.“\
(andere Antworten: „Noch eine Partie um die Nadel.“)

#### 201 · Stadtbibliothek

`cedar-creek-bibliothek.mae` · keine laufende Quest

**Mae:** Ich hab vierzehn Sternschnuppen gezählt! Dex sagt elf. Dex zählt falsch.

#### 202 · Archiv im Keller

`ansehen-cedar-creek.boxerfoto` · keine laufende Quest

_Auf der Rückseite steht: „Verlor den Kampf. Gewann danach jede Schachpartie im Ort.“_

#### 203 · Archiv im Keller

`cedar-creek-archiv.programmheft` · keine laufende Quest

→ Quest begonnen: „Erinnerung: New York, 1857“

_„Erster Amerikanischer Schachkongress. New York, 1857.“ Ein Programmheft mit einem Adler auf dem Umschlag._

_Ambrose macht ein Geräusch, das du von ihm nicht kennst._

**Ambrose:** Ich war dort. Ich stand in der dritten Reihe.

**Ambrose:** Ein Junge aus meiner Stadt spielte gegen einen Meister aus dem Westen, Paulsen. Der Junge hieß Morphy.

**Ambrose:** Er saß da, als ginge ihn das alles nichts an, und sah aus dem Fenster.

**Ambrose:** Setz dich. Du spielst seine Züge. Ich sage dir nichts.

**Kim (Antwort):** „Los geht's.“\
(andere Antworten: „Gleich.“)

[Aufgaben von Mrs. Okafor (cedarCreek.erinnerungNewYork) – Ausgang: bestanden]

→ Quest „Erinnerung: New York, 1857“: Schritt 1 von 1 erledigt

→ Quest abgeschlossen: „Erinnerung: New York, 1857“

#### 204 · Archiv im Keller

`cedar-creek-archiv.programmheft` · keine laufende Quest

**Ambrose:** Er opferte seine Dame, und ich vergaß zu atmen. Dreihundert Leute, und man hätte eine Nadel fallen hören.

**Ambrose:** Siehst du? Das. Das ist Schach. Nicht dieses Zählen.

**Kim (Antwort):** „Gestern hast du gesagt, Zählen ist alles.“\
(andere Antworten: Nichts sagen)

_Er fährt herum. Er sucht nach einer Antwort und hat keine._

**Ambrose:** Das habe ich gesagt.

**Kim (Antwort):** „Was stimmt denn nun?“\
(andere Antworten: Nichts sagen)

_Er sieht auf das Brett aus Licht. Dann auf die Zeitung. Vier zu drei._

**Ambrose:** Wenn ich das wüsste, säße ich vielleicht nicht in einer Kiste.

_Über dir schlägt die Uhr. Sieben Mal. Du legst die Zeitung zurück, das Programm obenauf._

_Als du den Deckel schließen willst, sagt er:_

**Ambrose:** Kim.

_Er hat dich noch nie beim Namen genannt. Immer nur „Kind“. Oder „Lehrling“._

**Kim (Antwort):** „Ja?“\
(andere Antworten: Den Deckel offen lassen)

**Ambrose:** Ich habe das noch niemandem erzählt.

_Er sieht zur Wendeltreppe._

**Ambrose:** Es gab allerdings auch niemanden.

#### 205 · Archiv im Keller

`cedar-creek-archiv.karton` · keine laufende Quest

**Ambrose:** Die Zeitung liegt obenauf. Ich weiß, was darin steht.

#### 206 · Archiv im Keller

`ansehen-cedar-creek.wasserfleck` · keine laufende Quest

_Der Springer an der Wand greift von seinem Feld aus drei Kartons auf einmal an._

#### 207 · Archiv im Keller

`ansehen-cedar-creek.kellertuer` · keine laufende Quest

_Die Kellertür bleibt zu. Dahinter tropft es leise._

#### 208 · Waschsalon

`ansehen-cedar-creek.zettel_turm` · keine laufende Quest

_Unter den Zettel hat jemand geschrieben: „Schon im Trockner nachgesehen?“_

#### 209 · Waschsalon

`cedar-creek-waschsalon.trockner` · keine laufende Quest

_Die Figuren zittern leicht, weil die Maschine läuft. Weiß am Zug, Matt in zwei._

**Kim (Antwort):** Die Stellung lösen\
(andere Antworten: Nicht jetzt)

[Aufgaben von Mr. Boateng (cedarCreek.trocknerStellung) – Ausgang: bestanden]

→ Quest „Die Stellung auf dem Trockner“: Schritt 1 von 1 erledigt

→ Quest abgeschlossen: „Die Stellung auf dem Trockner“

#### 210 · Waschsalon

`cedar-creek-waschsalon.trockner` · keine laufende Quest

_Auf dem Trockner klebt schon eine neue Stellung. Für nächste Woche._

#### 211 · Waschsalon

`ansehen-cedar-creek.comicheft` · keine laufende Quest

_Auf der letzten Seite gewinnt der Held mit einem einzigen Bauern. Jemand hat „Unrealistisch!“ an den Rand geschrieben._

#### 212 · Waschsalon

`ansehen-cedar-creek.automat` · keine laufende Quest

_Im Automaten klemmt seit Wochen eine Kaugummikugel. Mr. Boateng nennt sie „das Denkmal“._

#### 213 · Waschsalon

`cedar-creek-waschsalon.boateng` · Quest „Eine alte Handschrift“, Schritt 1 von 1: Mr. Boateng im Waschsalon das alte Partieformular zeigen.

_Du zeigst Mr. Boateng das vergilbte Partieformular aus der Blechdose. Er setzt eine zweite Brille auf._

**Mr. Boateng:** Oh. Das ist alt.

**Mr. Boateng:** Sehr alt. Gib mir einen Moment und eine Waschladung Zeit.

**Mr. Boateng:** Das ist eine alte Schrift. Die Züge sind englisch notiert, K für König, Kt für Springer.

_Er schreibt die Züge Zeile für Zeile in heutiger Notation auf einen Zettel und reicht ihn dir._

**Ambrose:** Das sind Züge von mir. In meiner eigenen Hand.

**Ambrose:** Ich hatte vergessen, wie ich schrieb.

**Kim (Antwort):** „Danke, Mr. Boateng.“\
(andere Antworten: „Woher können Sie das lesen?“)

**Mr. Boateng:** Gern. Bring mehr davon, wenn du welche findest.

→ Quest begonnen: „Eine alte Handschrift“

→ Quest „Eine alte Handschrift“: Schritt 1 von 1 erledigt

→ Quest abgeschlossen: „Eine alte Handschrift“

#### 214 · Drechslerei Dunmore

`cedar-creek-drechslerei.dunmore` · keine laufende Quest

_Auf der Fensterbank liegen drei Springer. Einer hat zu kurze Ohren, einer schielt, einer sieht aus wie ein Hund._

_Er legt einen vierten Holzklotz auf die Bank._

**Mr. Dunmore:** Das Pferd will nicht. Noch nicht.

### Landstraße nach Cedar Creek

#### 215 · Flussweg

`weg-maple-cedar.tessa` · keine laufende Quest

_Die Joggerin kommt dir am Fluss entgegen, diesmal ohne Keuchen._

**Die Joggerin:** Bis zum Steg! Ganz! Morgen weiter!

_Am Steg steht ihre Wasserflasche, wie ein Merkzeichen._

#### 216 · Landstraße

`weg-maple-cedar.apfelstand` · keine laufende Quest

_An der Blechdose klebt jetzt ein Zettel in großer Schrift._

_„Wer es war, kann es zurücklegen. Ich frag nicht.“_

**Ambrose:** Eine Frau, die nicht fragt.

#### 217 · Landstraße

`weg-maple-cedar.ada` · keine laufende Quest

**Ada:** Der Zettel hängt. Mal sehen, wer ihn liest.

### Cedar Creek

#### 218 · Stadtbibliothek

`cedar-creek-bibliothek.okafor` · keine laufende Quest

**Mrs. Okafor:** Manche Dinge erzählt man, wenn man so weit ist. Dein Brett erzählt viel.

**Kim (Antwort):** „Bis bald, Mrs. Okafor.“\
(andere Antworten: „Noch eine Partie um die Nadel.“)

#### 219 · Archiv im Keller

`cedar-creek-archiv.programmheft` · keine laufende Quest

_Das Programmheft. Die Ecken sind weich vom Anfassen._

#### 220 · Archiv im Keller

`cedar-creek-archiv.karton` · keine laufende Quest

**Ambrose:** Bemerkenswert unnötig. Ich höre es noch.

#### 221 · Stadtbibliothek

`cedar-creek-bibliothek.dex` · keine laufende Quest

**Dex:** Oma sagt, du hast Geduld. Das sagt sie fast nie.

#### 222 · Waschsalon

`cedar-creek-waschsalon.boateng` · keine laufende Quest

_Mr. Boateng nickt, zieht das Paketband ab und stellt eine neue Stellung auf._

**Mr. Boateng:** Die alte hat mir eine junge Frau gezeigt. Vor fünfzig Jahren. Sie kam aus Lagos und hat im ganzen Staat Turniere gespielt.

**Mr. Boateng:** Die Männer mochten das nicht.

_Er lächelt auf das Brett hinunter._

**Mr. Boateng:** Sie hat gewartet. Immer. Bis einer zu früh gekommen ist.

**Kim (Antwort):** „Was ist aus ihr geworden?“\
(andere Antworten: Nichts fragen)

_Er streicht das Paketband glatt._

**Mr. Boateng:** Sie stellt Bücher ins Regal. Gegenüber.

#### 223 · Waschsalon

`cedar-creek-waschsalon.boateng` · keine laufende Quest

**Mr. Boateng:** Nächste Woche ein Erstickungsmatt. Verrat es niemandem.

#### 224 · Waschsalon

`cedar-creek-waschsalon.boateng` · keine laufende Quest

**Mr. Boateng:** Dein Gutschein gilt. Komm mit Wäsche wieder.

#### 225 · Cedar Creek, Ortskern

`cedar-creek-aussen.zedernwald` · keine laufende Quest

_Es ist Oktober geworden. Ihr seid mit dem Bus bis Cedar Creek gefahren und steht am Steg, wo der Bach in den Wald läuft._

_Juno hält dir ihr Handy hin. Dasselbe Foto wie im Bus: eine Wiese, eine Reihe Tische mit Bildschirmen._

_Sie zeigt es dir jeden Tag. Als könnte es sich ändern, wenn man es oft genug ansieht._

**Juno:** Wir müssen hin. Bevor es weg ist.

**Kim (Antwort):** „Was weg ist?“\
(andere Antworten: Nicken)

**Juno:** Weiß ich nicht. Das, was vorher da war.

_Coach Delgado kann nicht mit. Sitzung im Schulamt. Als sie das sagte, sah sie zum Bildschirm auf ihrem Pult._

_Auf dem Handy eine Nachricht von Mama: „Riverton. Mit dem Zug zurück, vor dem Dunkelwerden.“_

_Sie hat nicht gefragt, warum. Sie fragt in letzter Zeit weniger._

**Kim (Antwort):** „Dann los. Zu Fuß durch den Wald.“\
(andere Antworten: „Und wenn wir zu spät sind?“)

**Juno:** Zu Fuß! Zurück nehmen wir den Zug. Abenteuer mit Rückfahrkarte.

**Ambrose:** Bäume, die älter sind als ich. Endlich jemand in meinem Alter.

### Weg nach Riverton

#### 226 · Zedernwald

`weg-cedar-riverton.tafel` · Quest „Der letzte Tisch“, Schritt 1 von 7: Durch den Zedernwald Richtung Riverton gehen.

→ Quest begonnen: „Der letzte Tisch“

→ Quest begonnen: „Die Tafel am Wegweiser“

_Am Wegweiser „Riverton, 3 Meilen“ hängt eine Holztafel mit drei Diagrammen: „Ein Zug, zwei Angriffe. Findest du sie?“_

**Ambrose:** Doppelangriffe. Ein Zug, zwei Ziele.

**Kim (Antwort):** Die Aufgaben lösen\
(andere Antworten: Weitergehen)

[Aufgaben von Die Rätseltafel (wegCedarRiverton.tafel) – Ausgang: bestanden]

→ Quest „Die Tafel am Wegweiser“: Schritt 1 von 1 erledigt

→ Quest abgeschlossen: „Die Tafel am Wegweiser“

#### 227 · Zedernwald

`weg-cedar-riverton.tafel` · Quest „Der letzte Tisch“, Schritt 1 von 7

_Auf der Tafel am Wegweiser steht in Kreide: „Gelöst! Gute Reise.“_

#### 228 · Zedernwald

`weg-cedar-riverton.fund_pfeilspitze` · Quest „Der letzte Tisch“, Schritt 1 von 7

_Unter einem Farn am Bach glänzt etwas: eine Pfeilspitze aus Stein, scharf wie am ersten Tag._

**Ambrose:** Wer hier jagte, kannte den Wald besser als jede Karte.

#### 229 · Zedernwald

`weg-cedar-riverton.fund_holzspringer` · Quest „Der letzte Tisch“, Schritt 1 von 7

_In einem hohlen Baumstamm liegt ein Springer aus hellem Holz, glatt gegriffen._

_Unter dem Fuß ist ein Feld eingebrannt, daneben ein winziger Fink._

**Ambrose:** Ein Springer, allein im Wald. Er hüpft wohl noch.

#### 230 · Zedernwald

`weg-cedar-riverton.fenwick` · Quest „Der letzte Tisch“, Schritt 1 von 7

_An einem Wegweiser steht eine Frau mit Rucksack und Stock und isst einen Apfel._

**Mrs. Fenwick:** Riverton? Immer den Gleisen nach. Und merkt euch eins, wenn ihr dort spielen wollt.

_Sie zeigt mit dem Apfel auf euch._

**Mrs. Fenwick:** Wer angreift, soll zuerst zählen, wer verteidigt.

**Juno:** Das wissen wir.

**Mrs. Fenwick:** Das weiß jeder. Bis er angreift.

#### 231 · Am Bahndamm

`weg-cedar-riverton.fund_fahrkarte` · Quest „Der letzte Tisch“, Schritt 2 von 7: In Riverton ankommen.

→ Quest „Der letzte Tisch“: Schritt 1 von 7 erledigt

_Im Schotter steckt eine vergilbte Pappkarte: „Riverton, einfache Fahrt, 1958“._

**Ambrose:** Einfache Fahrt. Wer fuhr damals, und kam er an?

#### 232 · Am Bahndamm

`weg-cedar-riverton.ereignis_zugpartie` · Quest „Die Zugpartie“, Schritt 1 von 2: Marian am Stellwerk helfen: Was hängt in ihrer Stellung?

_Vor dem Stellwerk sitzt eine ältere Frau auf der Bank, die rechte Hand im Verband._

_„Marian Shaw. Seit dreiundzwanzig Jahren spiele ich mit Earl, dem Lokführer vom Güterzug. Ein Zug pro Vorbeifahrt.“_

_„Er hält seinen Zug auf einer Tafel aus dem Fenster, ich hänge meine Antwort ans Signal. Heute krieg ich die Tafel nicht hoch, und der Zug kommt gleich.“_

_„Mein erster Einfall ist der Läufer nach vorn. Schaust du drauf, bevor wir ihn aufhängen?“_

**Kim (Antwort):** Die Stellung ansehen\
(andere Antworten: Gleich)

→ Quest begonnen: „Die Zugpartie“

[Aufgaben von Marian Shaw (wegCedarRiverton.zugpartie) – Ausgang: bestanden]

→ Quest „Die Zugpartie“: Schritt 1 von 2 erledigt

#### 233 · Am Bahndamm

`weg-cedar-riverton.ereignis_zugpartie` · Quest „Die Zugpartie“, Schritt 2 von 2: Den besseren Zug ans Signal hängen, bevor der Güterzug kommt.

_Marian sieht auf das Brett. „Der Läufer hätte gehangen. Und Earl sieht so etwas sofort.“_

_Du hängst den besseren Zug ans Signal. Der Güterzug rattert vorbei, aus dem Führerhaus winkt eine Hand mit einer Tafel._

_„Hier, die alte Signalkelle aus dem Stellwerk. Die brauch ich nicht mehr, seit es Strom gibt.“_

**Ambrose:** Sie warten aufeinander. Und es macht sie nicht unglücklich.

→ Quest „Die Zugpartie“: Schritt 2 von 2 erledigt

→ Quest abgeschlossen: „Die Zugpartie“

#### 234 · Am Bahndamm

`weg-cedar-riverton.seite01` · Quest „Der letzte Tisch“, Schritt 2 von 7: In Riverton ankommen.

_Zwischen den Schottersteinen neben dem Bahnsteig flattert ein Blatt Papier._

_Ein loses Blatt mit einer gezeichneten Stellung. Darunter steht mit Bleistift: „Schwarz zieht und gewinnt.“_

#### 235 · Am Bahndamm

`weg-cedar-riverton.durchlass` · Quest „Der letzte Tisch“, Schritt 2 von 7

_Ein gemauerter Durchlass unter dem Damm, dahinter stockdunkel. Es tropft._

_Auf die Mauer hat jemand mit Kreide geschrieben: „Da wohnt was. G.“ Ohne Licht gehst du da nicht hinein._

#### 236 · Am Bahndamm

`weg-cedar-riverton.schaffner` · Quest „Der letzte Tisch“, Schritt 2 von 7

_Erst singt die Schiene. Dann zittert der Boden. Dann rattert ein Güterzug vorbei, vierzig Wagen. Du zählst sie._

**Ambrose:** So schnell.

_Er klingt nicht beeindruckt. Er klingt müde._

**Ambrose:** Ich habe elf Tage gebraucht. Von New Orleans bis … nun. Elf Tage, und ich bin nicht angekommen.

**Kim (Antwort):** Warten, ob er weiterspricht\
(andere Antworten: „Wohin?“)

_An einer Bude neben den Gleisen sitzt ein Mann in Uniform. Auf einer Kiste ein Brett und eine Uhr mit zwei Zifferblättern._

**Mr. Quinn:** Pause. Zwanzig Minuten, dann kommt der Elfuhrsieben. Wer will?

**Juno:** Ich!

_Juno spielt, als würde das Haus brennen. Sie verliert einen Läufer, einen Turm, und wirft vor Lachen den König selbst um._

**Juno:** Ich hab die Zeit gewonnen. Er hatte mehr übrig.

**Mr. Quinn:** Jetzt du. Drei Minuten, und zwei Sekunden für jeden Zug dazu.

**Kim (Antwort):** „Abgemacht.“\
(andere Antworten: „Nicht jetzt.“)

**Ambrose:** Ruhig. Die Uhr ist auch eine Figur. Sie gehört zum Spiel. Aber sie ist nicht der König.

[Stellungsduell gegen Mr. Quinn – Ausgang: gewonnen]

#### 237 · Am Bahndamm

`weg-cedar-riverton.schaffner` · Quest „Der letzte Tisch“, Schritt 2 von 7

_Er gibt dir die Hand._

**Mr. Quinn:** Quinn. Seit neunzehn Jahren auf der Strecke.

_Aus der Brusttasche zieht er eine Karte: ein Kopf, über dem eine kleine Wolke hängt._

**Mr. Quinn:** Die hat mir mal einer dagelassen. Alter Herr mit einer Thermoskanne. Ich hab nie verstanden, wofür sie gut ist.

_Die Schrift auf der Rückseite ist steil und altmodisch._

**Kim (Antwort):** Die Karte umdrehen\
(andere Antworten: Einstecken)

_In der Ferne stehen drei Brücken über einem breiten Fluss. Der Himmel darüber hängt grau und schwer._

**Mr. Quinn:** Riverton. Nehmt einen Schirm.

_Ihr habt keinen._

#### 238 · Zedernwald

`weg-cedar-riverton.fund_pfeilspitze` · Quest „Der letzte Tisch“, Schritt 2 von 7

_Unter dem Farn am Bach ist jetzt nur noch Erde._

#### 239 · Zedernwald

`weg-cedar-riverton.fund_holzspringer` · Quest „Der letzte Tisch“, Schritt 2 von 7

_Der hohle Baumstamm ist leer. Nur ein Käfer wohnt noch darin._

#### 240 · Zedernwald

`weg-cedar-riverton.fenwick` · Quest „Der letzte Tisch“, Schritt 2 von 7

**Mrs. Fenwick:** Grüß Riverton von mir. Und nehmt einen Schirm mit.

### Cedar Creek

#### 241 · Cedar Creek, Ortskern

`cedar-creek-aussen.zedernwald` · Quest „Der letzte Tisch“, Schritt 2 von 7

_Der Waldweg nach Riverton. Juno läuft schon ein Stück voraus._

### Weg nach Riverton

#### 242 · Zedernwald

`weg-cedar-riverton.fenwick` · Quest „Der letzte Tisch“, Schritt 2 von 7

**Mrs. Fenwick:** Immer den Gleisen nach. Der Wald hat Zeit. Du auch.

#### 243 · Am Bahndamm

`weg-cedar-riverton.fund_fahrkarte` · Quest „Der letzte Tisch“, Schritt 2 von 7

_Im Schotter am Bahndamm liegen nur Steine._

#### 244 · Am Bahndamm

`weg-cedar-riverton.ereignis_zugpartie` · Quest „Der letzte Tisch“, Schritt 2 von 7

_„Earl hat geantwortet. Er sagt, das war nicht mein Zug. Er kennt mich zu gut.“_

#### 245 · Am Bahndamm

`weg-cedar-riverton.seite01` · Quest „Der letzte Tisch“, Schritt 2 von 7

_Im Schotter neben dem Bahnsteig liegen nur Steine._

#### 246 · Am Bahndamm

`weg-cedar-riverton.schaffner` · Quest „Der letzte Tisch“, Schritt 2 von 7

**Mr. Quinn:** Pünktlich gewonnen. Das sehe ich gern. Noch eine, bevor die Pause um ist?

**Kim (Antwort):** „Noch eine.“\
(andere Antworten: „Wir müssen weiter.“)

[Stellungsduell gegen Mr. Quinn, erneut – Ausgang: gewonnen]

#### 247 · Am Bahndamm

`weg-cedar-riverton.schaffner` · Quest „Der letzte Tisch“, Schritt 2 von 7

(noch einmal angesprochen; hier nur, was neu ist)

**Kim (Antwort):** „Wir müssen weiter.“\
(andere Antworten: „Noch eine.“)

**Mr. Quinn:** Gute Fahrt nach Riverton. Zu Fuß ist auch eine Fahrt.

#### 248 · Zedernwald

`weg-cedar-riverton.fenwick` · Quest „Der letzte Tisch“, Schritt 2 von 7

**Mrs. Fenwick:** Zähl zuerst, wer verteidigt. Dann greif an.

## Akt 2

### Weg nach Riverton

#### 249 · Am Bahndamm

`riverton-aussen.ankunft_zu_fuss` · Quest „Der letzte Tisch“, Schritt 2 von 7: In Riverton ankommen.

_Der Feldweg neben den Gleisen endet an einem Bahnhof aus rotem Backstein. Es beginnt zu regnen._

_Riverton riecht nach Regen auf Stein. Backstein, rot und rußig, Feuerleitern, Schornsteine, aus denen nichts mehr kommt._

_Ein Bus hupt. Jemand ruft über die Straße nach einem Earl. Aus zwei Fenstern kommen zwei Musiken und streiten sich._

**Juno:** Hier bin ich geboren. Also fast. Meine Cousine. Die ist hier geboren.

_An jeder Laterne ein Plakat, sauber und glänzend auf dem nassen Stein: „Perfect Move Park. Schach für alle. Ohne Wartezeit.“_

**Ambrose:** Ohne Wartezeit. Als wäre das Warten nicht das Schönste daran.

→ Quest „Der letzte Tisch“: Schritt 2 von 7 erledigt

### Riverton

#### 250 · Riverton, am Fluss

`riverton-aussen.bildschirmtische` · Quest „Der letzte Tisch“, Schritt 3 von 7: Die neuen Tische im Park ansehen und mit Slick reden.

_Auf der Wiese stehen sechs Tische in einer Reihe, weiß, mit Bildschirmen, die im Regen leuchten. Über jedem ein kleines Dach aus Glas._

_Auf einem läuft eine Partie. Niemand sitzt davor. Die Figuren ziehen von selbst, wie Wasser einen Hang hinunter._

**Kim (Antwort):** „Ambrose?“\
(andere Antworten: Hinsehen)

_Er dreht sich nicht um._

**Ambrose:** Sie hat nicht gezögert. Kein einziges Mal. Achtundzwanzig Züge. Und in keinem …

**Ambrose:** Eine Rechenmaschine, die nie zweifelt, ist kein Spieler. Das ist ein Rechenschieber mit Beleuchtung.

_Er sagt es laut, mit seiner alten Stimme. Aber er sieht weiter hin._

#### 251 · Riverton, am Fluss

`riverton-aussen.handyladen` · Quest „Der letzte Tisch“, Schritt 3 von 7

_Ein Laden voller Tablets mit dem Logo von Perfect Move. Im Schaufenster: „Dein persönlicher Trainer, schon ab heute.“_

**Ambrose:** Ein Trainer in einem Glaskasten. Hoffentlich bekommt er genug Luft.

#### 252 · Riverton, am Fluss

`riverton-aussen.fund_laeufer` · Quest „Der letzte Tisch“, Schritt 3 von 7

_Unter der Brücke spielt ein Straßenmusiker Gitarre. Neben seinem Hut liegt ein Läufer aus hellem Holz._

_„Den hab ich hier gefunden“, sagt er. „Behalt ihn, ich spiele nur Gitarre.“_

**Ambrose:** Ein Läufer aus hellem Holz, ganz allein. Jemand hat einen ganzen Satz verloren.

#### 253 · Riverton, am Fluss

`riverton-aussen.anleger_schild` · Quest „Der letzte Tisch“, Schritt 3 von 7

_Am Anleger hängt ein Blechschild: „Lastkahn Ashford Belle: Riverton – Lockport – Ironwood. Fahrten nach Ansage.“_

_Der Anleger ist leer. Niemand hat eine Ansage gemacht._

#### 254 · Riverton, am Fluss

`riverton-aussen.albescu` · Quest „Der verrostete Schlüssel“, Schritt 1 von 1: Mit Mrs. Albescu den Fahrradschuppen öffnen.

_Hinter dem Park eine Werkstatt mit heruntergelassenem Rollladen: „Albescu. Fahrräder. Reparatur am selben Tag.“ Die Buchstaben blättern ab._

_Davor fegt eine Frau Laub, das der Wind sofort wieder hinlegt._

_Juno fragt nach dem Weg zu einem Laden, den sie gar nicht sucht. Die Frau stützt sich auf den Besen._

**Mrs. Albescu:** Im Frühjahr hab ich zugemacht. Die Leute bestellen ihre Räder jetzt im Handyladen.

**Mrs. Albescu:** Man tippt eine Zahl ein, und nach drei Tagen kommt ein Karton.

**Mrs. Albescu:** Im Schuppen hinten steht noch alles, wie mein Mann es gelassen hat. Ich komm nicht hinein.

**Kim (Antwort):** „Warum nicht?“\
(andere Antworten: Zuhören)

**Mrs. Albescu:** Der Schlüssel. Er hatte ihn immer an der Angelweste. Vor zwei Jahren kommt er vom Bach bei Cedar Creek, und der Schlüssel ist weg.

**Mrs. Albescu:** Er hat den ganzen Sommer gesucht. Dann hat er gesagt, wir lassen ein neues Schloss machen.

_Sie fegt ein Blatt beiseite._

**Mrs. Albescu:** Wir sind nicht mehr dazu gekommen.

_Der Schlüssel aus dem Schilf. Du hast ihn vergessen, wie man Dinge vergisst, die nichts wiegen._

_Du hältst ihn ihr hin. Sie sieht ihn an. Sie nimmt ihn nicht gleich._

**Mrs. Albescu:** Das ist seiner. Der runde Griff. Ich erkenn ihn sofort.

_Sie lacht, und gleichzeitig wischt sie sich mit dem Handrücken über die Augen._

_Das Schloss klemmt. Es braucht euch beide und einen Tropfen Öl aus einem Kännchen in ihrer Schürze. Dann geht die Tür auf._

→ Quest begonnen: „Der verrostete Schlüssel“

#### 255 · Riverton, am Fluss

`riverton-aussen.nova` · Quest „Der letzte Tisch“, Schritt 3 von 7: Die neuen Tische im Park ansehen und mit Slick reden.

_Auf dem Podium steht ein Mädchen in einer weißen Jacke mit dem Zeichen des Konzerns und lächelt in die Kameras._

**Nova:** Mit Perfect Move trainiert jeder wie ein Champion! Kein Warten auf einen Gegner. Keine schlechten Tage.

**Nova:** Der Tisch ist immer bereit, immer geduldig, immer genau so stark, wie du ihn brauchst.

_Dann gehen die roten Lichter an den Kameras aus. Ihr Lächeln fällt herunter wie etwas, das man loslässt._

**Nova:** Kann ich jetzt kurz sitzen?

**Kim (Antwort):** Juno ansehen\
(andere Antworten: Weiter zusehen)

_Sie fragt niemanden. Sie setzt sich auf die Kante des Podiums, in den Regen._

**Juno:** Nova Sinclair. Landesmeisterin. Der Highschools. Die hat noch nie verloren.

#### 256 · Riverton, am Fluss

`riverton-aussen.victor` · Quest „Der letzte Tisch“, Schritt 3 von 7

_Neben dem Podium steht Victor, im selben Weiß, die Hände auf dem Rücken. Auf seiner Jacke steht sein Name._

_Ins Mikrofon sagt er drei Sätze. Es sind die Sätze seines Vaters._

_Dann kommt er herüber, nicht schnell._

**Victor Hale:** Du.

_Er sieht auf deine Jacke._

**Victor Hale:** Zwei.

**Kim (Antwort):** „Zwei.“\
(andere Antworten: Nichts sagen)

_Er nickt, als trüge er eine Zahl in eine Liste ein. Dann sieht er zu den Tischen._

**Victor Hale:** Sie machen keine Fehler. Das ist der Punkt.

**Kim (Antwort):** „Und das ist gut?“\
(andere Antworten: Zu den Tischen sehen)

_Er antwortet nicht gleich. Wieder diese Sekunden._

**Victor Hale:** Mein Vater sagt ja.

#### 257 · Parkpavillon

`riverton-pavillon.gedenktafel` · Quest „Der letzte Tisch“, Schritt 3 von 7

_Am Geländer zum Fluss steht eine kleine Tafel unter einem Holzdach, darauf eine Messingplatte: „Für Elias Odum, der hier Generationen von Kindern das Schachspiel zeigte.“_

**Ambrose:** Ein Lehrer, der eine Tafel bekommt. Das ist mehr, als die meisten Meister bekommen.

#### 258 · Parkpavillon

`riverton-pavillon.limonadenglas` · Quest „Der letzte Tisch“, Schritt 3 von 7

_Auf dem Geländer stehen Limonadengläser in einer Reihe, jedes mit einem Zettel: „Slick gegen Ray“, „Tamsin gegen Slick“, „Slick gegen alle“._

#### 259 · Parkpavillon

`riverton-pavillon.slick` · Quest „Der letzte Tisch“, Schritt 3 von 7

_Regen trommelt aufs Pavillondach, irgendwo klopft eine Schachuhr._

_Steintische mit eingelassenen Brettern, glatt gespielt von sehr vielen Händen. An jedem schlagen zwei Leute auf die Uhren._

_Mittendrin einer mit Kuriertasche, ein Bein über der Bank. Er spielt, ohne hinzusehen, und redet dabei._

**Slick:** Zwei Angriffe, ein Zug. Das nennt man Gabel, und ich esse damit. Schade um deinen Turm.

_Er schlägt auf die Uhr. Dann sieht er euch._

**Slick:** Kundschaft!

**Slick:** Slick. Eigentlich Marcus, aber so nennt mich keiner. Nicht mal meine Mutter.

**Kim (Antwort):** „Wir sind aus Maple Falls.“\
(andere Antworten: Auf die Nadeln zeigen)

**Slick:** Maple Falls! Zwei Nadeln, schau an. Die von der Delgado und die von der alten Okafor.

**Slick:** Die Okafor hat mich mal vierzig Züge lang warten lassen. Vierzig. Ich bin dabei gealtert.

**Slick:** Das hier ist der Parkclub. Seit 1953. Mr. Odum hat ihn gehabt, vierzig Jahre. Im Frühjahr hat er ihn mir gegeben, und dann ist er …

**Slick:** Na ja. Dann eben ich.

**Kim (Antwort):** „Was passiert mit dem Pavillon?“\
(andere Antworten: Hinaus auf die Wiese sehen)

**Slick:** Der Stadtrat hat die Wiese verpachtet. Den Pavillon auch. Trainingszentrum soll das werden.

**Slick:** Sie haben uns den Pavillon gelassen. Bis Sonntag.

**Tamsin:** Sonntag ist das letzte Spiel. Wer spielt es?

**Slick:** Na, wer wohl. Wenn schon Schluss, dann mit Gästen. Vorher fragen dich Tamsin und Ray ab.

_Ambrose steht nicht neben dir. Er steht am Rand des Pavillons, wo das Dach aufhört, und sieht hinaus auf die Tische._

→ Quest „Der letzte Tisch“: Schritt 3 von 7 erledigt

#### 260 · Parkpavillon

`riverton-pavillon.ray` · Quest „Der letzte Tisch“, Schritt 4 von 7: Tamsins Aufgaben lösen.

_Ein älterer Herr mit Busfahrermütze stellt geduldig die Figuren auf._

**Ray:** Ray. Dreißig Jahre Bus gefahren, sechzig Jahre hier gespielt. Beides mit Fahrplan.

**Ray:** Erst Tamsin, dann ich. Ein Bus fährt seine Haltestellen auch der Reihe nach an.

#### 261 · Parkpavillon

`riverton-pavillon.tamsin` · Quest „Der letzte Tisch“, Schritt 4 von 7

_Ein Mädchen mit Schachuhr unter dem Arm zählt laut rückwärts, während Slick zieht._

**Tamsin:** Fünf, vier, drei, zwei – Gabel! Siehst du?

**Tamsin:** Nicht nachdenken. Gucken. Ich bin Tamsin.

**Tamsin:** Meine Aufgaben sind Springer, die auf zwei Figuren gleichzeitig zeigen. Du findest sie, bevor ich bei null bin.

**Kim (Antwort):** „Bereit.“\
(andere Antworten: „Gleich.“)

[Aufgaben von Tamsin (riverton.reiheTamsin) – Ausgang: bestanden]

→ Quest „Der letzte Tisch“: Schritt 4 von 7 erledigt

#### 262 · Parkpavillon

`riverton-pavillon.tamsin` · Quest „Zuschauen im Pavillon“, Schritt 1 von 1: Mit Tamsin zuschauen und finden, was Slick übersieht.

**Tamsin:** Willst du was sehen? Slick und Ray spielen gleich Blitz.

**Tamsin:** Achte nicht auf die Züge. Achte darauf, was Slick nicht sieht.

**Kim (Antwort):** „Ich schau zu.“\
(andere Antworten: „Nicht jetzt.“)

→ Quest begonnen: „Zuschauen im Pavillon“

[Aufgaben von Tamsin (riverton.slickBeobachten) – Ausgang: bestanden]

→ Quest „Zuschauen im Pavillon“: Schritt 1 von 1 erledigt

→ Quest abgeschlossen: „Zuschauen im Pavillon“

#### 263 · Riverton, am Fluss

`riverton-aussen.bildschirmtische` · Quest „Der letzte Tisch“, Schritt 5 von 7: Rays Aufgaben lösen.

_An einem Tisch sitzt jetzt ein Junge, kleiner als Tamsin, allein. Der Bildschirm wirft Licht auf sein Gesicht._

_Er sieht nicht auf. Der Tisch wartet geduldig, bis er zieht._

**Ambrose:** Geduldig ist der Tisch, das muss man ihm lassen. Geduldiger als ich.

#### 264 · Riverton, am Fluss

`riverton-aussen.fund_laeufer` · Quest „Der letzte Tisch“, Schritt 5 von 7

_Unter der Brücke spielt der Straßenmusiker dasselbe Lied wie vorhin._

#### 265 · Riverton, am Fluss

`riverton-aussen.albescu` · Quest „Der letzte Tisch“, Schritt 5 von 7

**Mrs. Albescu:** Der Schuppen ist offen. Geh nur hinein, hinten unter der Plane steht etwas für dich.

#### 266 · Riverton, am Fluss

`riverton-aussen.nova` · Quest „Der letzte Tisch“, Schritt 5 von 7

_Nova sitzt auf der Kante des Podiums. Die Kameras sind weg. Sie sieht nicht auf._

#### 267 · Riverton, am Fluss

`riverton-aussen.victor` · Quest „Der letzte Tisch“, Schritt 5 von 7

_Victor steht unter dem Banner und tippt auf ein Tablet. Einmal sieht er zum Pavillon hinüber, dann schnell wieder weg._

#### 268 · Bahnhofshalle

`riverton-bahnhofshalle.uhr` · Quest „Der letzte Tisch“, Schritt 5 von 7

→ Quest begonnen: „Erinnerung: London, 1851“

_Am Abend ist euer Zug weg. Der nächste fährt in fünfzig Minuten. Juno schläft auf der Bank ein, den Kopf auf dem Tagebuch._

_Durch die hohen Fenster leuchten die sechs Tische im Park, weiß und still._

**Ambrose:** Ich war einmal jünger als du jetzt. Fast.

_Er sieht nicht zu den Fenstern. Er sieht hinauf zur Uhr._

**Ambrose:** Mein Vater baute Klaviere. Für das Holz fuhr er nach London, einmal im Jahr. Als ich zwanzig war, nahm er mich mit.

**Ambrose:** Ich sollte lernen, wie man Fichte prüft. Man klopft darauf und hört zu. Ich habe nichts gehört. Ich dachte an etwas anderes.

**Kim (Antwort):** „Woran?“\
(andere Antworten: Zuhören)

_Die Uhr schlägt. Neunmal. Mit jedem Schlag wird die Halle heller, und der Hall wird zu Hufen auf Pflaster._

**Ambrose:** Komm. Ich zeige es dir.

**Kim (Antwort):** Mitgehen\
(andere Antworten: „Nicht jetzt.“)

### London, 1851

#### 269 · Der Strand, London

`erinnerung-london.droschke` · Quest „Der letzte Tisch“, Schritt 5 von 7

_Eine Droschke wartet am Straßenrand, das Pferd schnaubt in der kalten Luft. Der Kutscher schläft unter seinem Hut._

**Ambrose:** Mein Vater nahm immer die Droschke. Ich ging lieber zu Fuß, da sieht man mehr.

#### 270 · Der Strand, London

`erinnerung-london.zeitungsjunge` · Quest „Der letzte Tisch“, Schritt 5 von 7

_Ein Junge mit Schirmmütze schwenkt eine Zeitung über dem Kopf. Der Wind trägt den Geruch der Themse heran._

**Zeitungsjunge:** Extra! Extra!

**Zeitungsjunge:** Die ganze Welt kommt nach London, zur großen Ausstellung! Und zum Schachturnier!

**Ambrose:** Ein Turnier. Die besten Spieler der Welt, in einer Stadt.

**Ambrose:** Und ich bin hier, um Klavierholz zu kaufen.

**Ambrose:** London, 1851. Bleib bei mir, Kim. Ich zeige dir, was ich sah.

#### 271 · Der Strand, London

`erinnerung-london.kaffeehaus_betreten` · Quest „Der letzte Tisch“, Schritt 5 von 7

_Du stehst in einer Straße. Alles ist braun und golden, wie eine alte Fotografie, in die jemand hineingegangen ist._

_Du siehst auf Hände hinunter, die nicht deine sind. Schmal, mit Tintenflecken. Die Stiefel drücken._

**Ambrose:** Der Strand. So heißt die Straße. Dort, das Haus mit dem Schild. Geh hinein.

_Die Stimme kommt aus dir._

**Kim (Antwort):** Hineingehen

_Die Tür ist schwer. Dahinter ist es warm und voll, viele Stimmen, die alle halblaut sprechen._

_Zeitungen an Holzstangen. Kaffee in dicken Tassen. Männer mit Backenbärten über Brettern, und hinter ihnen Zuschauer, drei Reihen tief._

**Ambrose:** Ich bin damals hineingegangen, weil es regnete. Mein Vater sagte, ich solle nicht lange bleiben.

**Ambrose:** Ich bin lange geblieben.

#### 272 · Kaffeehaus am Strand

`erinnerung-london.schachtisch` · Quest „Der letzte Tisch“, Schritt 5 von 7

_In der Mitte ein Tisch, um den es still ist. Zwei Männer. Der eine groß, mit hoher Stirn, sehr gerade. Der andere kleiner, nervös._

**Ambrose:** Anderssen. Aus Breslau. Ein Mathematiklehrer. Man sagt, er sei der Beste in Europa.

**Ambrose:** Der andere heißt Kieseritzky. In Paris gibt er Unterricht, fünf Franc die Stunde. Es ist keine Turnierpartie. Sie spielen nur so.

_Es sieht aus wie ein Unfall. Weiß hat schon einen Läufer hergegeben, die schwarze Dame steht tief in der weißen Stellung und frisst._

**Kim (Antwort):** Hinsehen

_Der große Mann zieht einen Läufer. Mitten hinein, tief ins schwarze Lager. Ein Raunen._

_Schwarz schlägt einen Turm. Einfach so, einen ganzen Turm._

**Ambrose:** Jetzt. Halt. Schau hin.

**Ambrose:** Er hat einen Turm weniger, und sein zweiter Turm hängt auch. Was hättest du getan?

**Kim (Antwort):** Zusehen und mitraten\
(andere Antworten: Noch einen Moment warten)

[Aufgaben von Ambrose (riverton.flashbackLondon) – Ausgang: bestanden]

→ Quest „Erinnerung: London, 1851“: Schritt 1 von 1 erledigt

→ Quest abgeschlossen: „Erinnerung: London, 1851“

#### 273 · Kaffeehaus am Strand

`erinnerung-london.schachtisch` · Quest „Der letzte Tisch“, Schritt 5 von 7

_Am Tisch in der Mitte rührt sich niemand. Nur die große Uhr an der Wand tickt._

#### 274 · Kaffeehaus am Strand

`erinnerung-london.rueckkehr` · Quest „Der letzte Tisch“, Schritt 5 von 7

_Eine große Uhr an der Wand des Kaffeehauses. Ihr Ticken klingt genau wie das der Bahnhofsuhr in Riverton._

_Der große Mann zieht seinen König ein Feld nach vorn, als träte er einem Besucher entgegen._

_Ein Springerschach, dann gibt er die Dame. Zuletzt gleitet ein Läufer ein einziges Feld, und es ist vorbei._

_Matt. Mit drei kleinen Figuren, gegen eine ganze Armee, die nie aufgewacht ist._

_Niemand sagt etwas._

**Kim (Antwort):** Warten

_Der Verlierer steht auf, der nervöse kleine Mann, und er strahlt über das ganze Gesicht._

_Er schüttelt dem anderen die Hand mit beiden Händen, ruft etwas auf Französisch und läuft zur Tür, ohne Hut._

_Ambroses Stimme ist wieder die alte. Sie zittert._

**Ambrose:** Er ist zum Telegrafenamt gelaufen. Um seine eigene Niederlage nach Paris zu melden. Weil sie so schön war.

**Ambrose:** Ich stand dort, wo du jetzt stehst. Ich war zwanzig. Und ich dachte: Das. Das will ich.

**Ambrose:** Eine Partie, für die der Verlierer zum Telegrafenamt läuft.

**Kim (Antwort):** Zurück in die Gegenwart\
(andere Antworten: Noch bleiben)

_Das Braun wird blasser. Die Stimmen werden zu Hall._

### Riverton

#### 275 · Bahnhofshalle

`riverton-bahnhofshalle.uhr` · Quest „Der letzte Tisch“, Schritt 5 von 7

_Du sitzt wieder auf der Bank unter der Uhr. Juno schläft. Deine Hände sind deine._

**Ambrose:** Sie nennen sie die Unsterbliche. Heute noch, nehme ich an.

**Kim (Antwort):** „Ja.“\
(andere Antworten: Nicken)

_Er ist lange still. Draußen, hinter den Fenstern, leuchten die Tische._

**Ambrose:** Diese Maschinen. Sie würden das nie spielen. Zwei Türme und die Dame. Sie würden ausrechnen, dass es anders sicherer ist.

**Ambrose:** Oder doch?

**Ambrose:** Wenn sie alles sehen, jeden Zug bis zum Ende, dann sehen sie auch das. Dann wissen sie, dass es stimmt, bevor sie die Hand heben.

**Ambrose:** Sie müssten nicht hoffen.

**Ambrose:** Kim. Was wäre, wenn sie die Partie spielen könnten, die ich nie spielte?

**Kim (Antwort):** „Ich weiß es nicht.“\
(andere Antworten: Schweigen)

_Juno ist aufgewacht. Sie sieht dich an, verschlafen, dann genauer._

**Juno:** Du bist so still. Ist was?

**Kim (Antwort):** „Nein.“

_Sie glaubt dir nicht. Sie schreibt nichts auf._

#### 276 · Bahnhofshalle

`riverton-bahnhofshalle.zug` · Quest „Der letzte Tisch“, Schritt 5 von 7

_Der Zug nach Cedar Creek steht abfahrbereit am Bahnsteig. Durch die Fenster sieht man Pendler mit nassen Schirmen._

**Kim (Antwort):** Einsteigen\
(andere Antworten: Noch bleiben)

_Der Zug ruckelt los. Draußen ziehen Felder, Zedern und der Bahndamm vorbei._

#### 277 · Bahnhofshalle

`riverton-bahnhofshalle.zeitungsstand` · Quest „Der letzte Tisch“, Schritt 5 von 7

_Zeitungen aus drei Bundesstaaten, ein Ständer mit Limonade, ganz oben ein Regal mit Taschenschachspielen._

_In der Lokalzeitung steht groß: „Perfect Move übernimmt Parkclub“. Die Schachspalte ist kleiner geworden._

#### 278 · Bahnhofshalle

`riverton-bahnhofshalle.fund_zeitungsausschnitt` · Quest „Der letzte Tisch“, Schritt 5 von 7

→ Quest begonnen: „Mr. Odums letzte Aufgabe“

_Hinter dem Zeitungsständer klemmt ein vergilbter Ausschnitt: eine Schachspalte, eine Aufgabe, darunter mit Bleistift „E. O.“._

_Der Mann hinter dem Zeitungsstand beugt sich herüber._

**Pops:** Das ist Mr. Odums Handschrift. Seine letzte Aufgabe.

**Pops:** Er hat sie nie gelöst, sagt Slick.

**Pops:** Willst du es versuchen? Für Elias.

**Kim (Antwort):** „Ich versuche es.“\
(andere Antworten: „Nicht jetzt.“)

[Aufgaben von Pops (riverton.odumAufgabe) – Ausgang: bestanden]

→ Quest „Mr. Odums letzte Aufgabe“: Schritt 1 von 1 erledigt

→ Quest abgeschlossen: „Mr. Odums letzte Aufgabe“

#### 279 · Bahnhofshalle

`riverton-bahnhofshalle.fund_zeitungsausschnitt` · Quest „Der letzte Tisch“, Schritt 5 von 7

_Hinter dem Ständer liegt nur noch Staub. Mr. Odums Aufgabe ist gelöst._

#### 280 · Bahnhofshalle

`riverton-bahnhofshalle.fund_taubenfeder` · Quest „Der letzte Tisch“, Schritt 5 von 7

_Auf der Bank neben dem Mann mit der Lupenbrille liegt eine graue Taubenfeder. Er schiebt sie dir hin, ohne aufzusehen._

**Ambrose:** Eine Feder. Damit schrieb man früher Partien auf. Ich auch.

#### 281 · Bahnhofshalle

`riverton-bahnhofshalle.harlan` · Quest „Die Lupe des Uhrmachers“, Schritt 1 von 1: Dreimal gegen Mr. Harlan in der Bahnhofshalle gewinnen.

_Unter der großen Uhr sitzt ein Mann mit Lupenbrille auf einer Bank und sieht auf ein Brett. Er bewegt sich nicht._

_Der Mann vom Zeitungsstand ruft zu euch herüber._

**Pops:** Mr. Harlan. Uhrmacher. Zieht die da oben jeden Morgen auf, seit zweiundvierzig Jahren.

**Pops:** Wenn du mit ihm spielst, bring Zeit mit. Oder nimm ihm welche weg.

**Juno:** Gegen den hab ich mal gespielt, bei meiner Cousine. Eine Stunde für zwölf Züge. Und dann hat er gewonnen.

_Mr. Harlan hebt den Kopf, sehr langsam. Hinter den Gläsern sind seine Augen riesig._

**Mr. Harlan:** Eine Stellung, zehn Züge. Mit Uhr?

_Er sieht hinauf zur großen Uhr._

**Mr. Harlan:** Eile ist der Feind der Feder. Und der Unruh. Aber bitte.

**Ambrose:** Ein Mann, der jeden Zug zehn Minuten wiegt. Gib ihm keine zehn Minuten.

**Kim (Antwort):** „Spielen wir.“\
(andere Antworten: „Nicht jetzt.“)

→ Quest begonnen: „Die Lupe des Uhrmachers“

[Stellungsduell gegen Mr. Harlan – Ausgang: gewonnen]

#### 282 · Bahnhofshalle

`riverton-bahnhofshalle.harlan` · Quest „Der letzte Tisch“, Schritt 5 von 7: Rays Aufgaben lösen.

_Er nimmt die Lupenbrille ab und reibt sich die Nase._

**Mr. Harlan:** Die Unruh tickt für alle gleich. Nur nicht für mich.

**Kim (Antwort):** „Mit mehr Zeit hätten Sie gewonnen.“\
(andere Antworten: Nicken)

**Mr. Harlan:** Mit genug Zeit gewinne ich fast immer.

_Er lächelt, ein wenig schief._

**Mr. Harlan:** Deshalb spielt niemand mehr ohne Uhr mit mir.

**Kim (Antwort):** „Noch eine Partie? Ohne Uhr, wenn Sie wollen.“\
(andere Antworten: „Auf Wiedersehen, Mr. Harlan.“)

[Stellungsduell gegen Mr. Harlan, erneut – Ausgang: gewonnen]

#### 283 · Bahnhofshalle

`riverton-bahnhofshalle.pops` · Quest „Der letzte Tisch“, Schritt 5 von 7

_Ein runder, freundlicher Mann hinter einem Zeitungsstand. Neben den Zeitungen hängt eine Reihe Taschenschachspiele, in allen Farben._

**Pops:** Pops. Zeitungen, Limo, Taschenschach. Seit dreißig Jahren.

**Pops:** Ein Kiosk ist eine Bibliothek, die man essen kann. Schau dich um. Für Münzen gibt es hier Karten für unterwegs.

[Laden: Pops' Zeitungsstand]

#### 284 · Riverton, am Fluss

`riverton-aussen.bildschirmtische` · Quest „Der letzte Tisch“, Schritt 5 von 7

_Auf allen Bildschirmen laufen Partien, Zug um Zug, ohne Pause. Ambrose sieht hin. Lange._

#### 285 · Riverton, am Fluss

`riverton-aussen.wohnwagen_zu` · Quest „Der letzte Tisch“, Schritt 5 von 7

_Ein Wohnwagen am Fluss, ein Kurierrad lehnt daneben. Die Tür ist zu, drinnen ist niemand._

#### 286 · Riverton, am Fluss

`riverton-aussen.schuppen_zu` · Quest „Der letzte Tisch“, Schritt 5 von 7

_Die Schuppentür quietscht in den Angeln. Drinnen riecht es nach Staub und Öl._

#### 287 · Fahrradschuppen

`riverton-schuppen.fahrrad` · Quest „Der verrostete Schlüssel“, Schritt 1 von 1: Mit Mrs. Albescu den Fahrradschuppen öffnen.

_Drinnen riecht es nach Gummi und Staub. Unter einer Plane steht ein Fahrrad, grün, die Klingel mit einem Schmetterling._

**Mrs. Albescu:** Meins. Er hat es mir zur Hochzeit gebaut. Dreißig Jahre bin ich damit jeden Tag zur Werkstatt gefahren.

_Sie legt die Hand auf den Lenker. Staub bleibt an ihren Fingern._

**Mrs. Albescu:** Meine Knie machen das nicht mehr.

**Mrs. Albescu:** Nimm es.

**Kim (Antwort):** „Das kann ich nicht …“\
(andere Antworten: Den Lenker anfassen)

**Mrs. Albescu:** Es soll fahren. Nicht stehen. Ein Rad, das steht, ist ein Gestell.

**Mrs. Albescu:** Fahr damit weit. Und wenn die Kette springt, kommst du her, und ich zeige dir, wie man das macht.

**Mrs. Albescu:** Dafür brauche ich keine Knie.

_Du schiebst es hinaus in den Regen. Die Klingel funktioniert noch._

**Ambrose:** Ein Gefährt mit Klingel und Schmetterling. Zu meiner Zeit hätte man dafür einen Kutscher gebraucht. Und ein zweites Pferd für den Kutscher.

_Juno schreibt ins Tagebuch: „Fahrrad. Grün. Mit Schmetterling.“ Darunter, kleiner: „Mrs. A. hat geweint, aber gut.“_

→ Quest „Der verrostete Schlüssel“: Schritt 1 von 1 erledigt

→ Quest abgeschlossen: „Der verrostete Schlüssel“

#### 288 · Riverton, am Fluss

`riverton-aussen.albescu` · Quest „Der letzte Tisch“, Schritt 5 von 7: Rays Aufgaben lösen.

**Mrs. Albescu:** Öl die Kette, wenn es geregnet hat. Hier regnet es immer.

#### 289 · Riverton, am Fluss

`riverton-aussen.bahndamm` · Quest „Der letzte Tisch“, Schritt 5 von 7

_Zurück auf den Feldweg am Bahndamm. Der Zug wäre schneller, aber der Weg ist schöner._

### Weg nach Riverton

#### 290 · Am Bahndamm

`riverton-aussen.ankunft_zu_fuss` · Quest „Der letzte Tisch“, Schritt 5 von 7

_Der Feldweg endet am Bahnhof von Riverton._

### Riverton

#### 291 · Parkpavillon

`riverton-pavillon.gedenktafel` · Quest „Der letzte Tisch“, Schritt 5 von 7

_Jemand hat frische Blumen unter die Tafel gelegt. Daneben steht ein Bauer aus Holz._

#### 292 · Parkpavillon

`riverton-pavillon.limonadenglas` · Quest „Der letzte Tisch“, Schritt 5 von 7

_Das Glas ist voll, die Limo warm. Wer verliert, trinkt sie trotzdem._

#### 293 · Parkpavillon

`riverton-pavillon.slick` · Quest „Der letzte Tisch“, Schritt 5 von 7

_Regen trommelt aufs Pavillondach, irgendwo klopft eine Schachuhr._

**Slick:** Tamsin hast du geschafft. Jetzt Ray. Er ist langsam, aber er erwischt jeden.

#### 294 · Parkpavillon

`riverton-pavillon.ray` · Quest „Der letzte Tisch“, Schritt 5 von 7

**Ray:** Zwei Haltestellen, ein Bus. Der Gegner kann nur an einer aussteigen. Also fährst du zu der anderen.

_Er legt seine große Hand auf den Stein._

**Ray:** Hier hab ich neunundsechzig gegen Odum verloren. Und zweiundsiebzig.

**Ray:** Und jedes Jahr danach. Der Stein ist hier dünner als da drüben. Fühl mal.

**Kim (Antwort):** Die Hand auf den Stein legen\
(andere Antworten: Nicken)

_Es stimmt. Eine flache Mulde, wo sechzig Jahre lang Hände gelegen haben._

**Ambrose:** Eine Gabel ist ein Zug, der zwei Briefe auf einmal zustellt.

_Er sagt es freundlich. Aber zwischen zwei Sätzen geht sein Blick hinaus auf die Wiese._

**Kim (Antwort):** „Zeigen Sie es mir.“\
(andere Antworten: „Gleich.“)

[Aufgaben von Ray (riverton.reiheRay) – Ausgang: bestanden]

→ Quest „Der letzte Tisch“: Schritt 5 von 7 erledigt

#### 295 · Parkpavillon

`riverton-pavillon.ray` · Quest „Der letzte Tisch“, Schritt 6 von 7: Im Pavillon gegen Slick um die Clubnadel spielen.

**Ray:** Slick zieht zu schnell. Der Alte hat ihm das vierzehn Jahre lang gesagt.

#### 296 · Parkpavillon

`riverton-pavillon.tamsin` · Quest „Der letzte Tisch“, Schritt 6 von 7

**Tamsin:** Er guckt nur nach vorn.

**Tamsin:** Nie nach hinten.

_Sie schreibt etwas auf einen Zettel und schiebt ihn dir zu: „Schottisch. Immer. Und Evans, wenn er gut drauf ist.“_

**Tamsin:** Hast du nicht von mir.

#### 297 · Bahnhofshalle

`riverton-bahnhofshalle.uhr` · Quest „Der letzte Tisch“, Schritt 6 von 7

_Die große Uhr tickt. Ambrose sieht zu den hohen Fenstern und sagt nichts._

#### 298 · Bahnhofshalle

`riverton-bahnhofshalle.fund_taubenfeder` · Quest „Der letzte Tisch“, Schritt 6 von 7

_Auf Mr. Harlans Bank liegen nur noch Uhrfedern. Er sammelt sie._

#### 299 · Bahnhofshalle

`riverton-bahnhofshalle.pops` · Quest „Der letzte Tisch“, Schritt 6 von 7

_Pops bündelt Zeitungen. Er erzählt, ohne dass du gefragt hast._

**Pops:** Der alte Odum kam jeden Morgen um sieben, vierzig Jahre lang. Schlug die Zeitung von hinten auf, bei der Schachspalte.

**Pops:** Slick hat er mit zwölf im Park aufgelesen. Ein Junge, der Flaschen sammelte und zu schnell redete.

**Pops:** Im März ist er gestorben, im Schlaf. Im April hat der Stadtrat getagt.

**Kim (Antwort):** „Und der Pavillon?“\
(andere Antworten: Zuhören)

**Pops:** Der hätte das nicht zugelassen. Der hätte sich vor die Bagger gesetzt und eine Partie angefangen.

**Pops:** Und niemand hätte sich getraut, ihn zu stören, bevor sie fertig ist.

_Er schnürt das Bündel zu._

**Pops:** Slick ist ein guter Junge. Aber er glaubt, er muss lauter sein als der Alte.

**Pops:** Damit keiner merkt, dass er nicht der Alte ist.

#### 300 · Riverton, am Fluss

`riverton-aussen.albescu` · Quest „Der letzte Tisch“, Schritt 6 von 7

**Mrs. Albescu:** Fährt es gut? Die Bremsen hab ich frisch eingestellt. Im Kopf.

#### 301 · Parkpavillon

`riverton-pavillon.slick` · Quest „Der letzte Tisch“, Schritt 6 von 7

_Slick schiebt eine Figur, ohne hinzusehen, und gewinnt trotzdem._

**Slick:** Sonntag ist das letzte Spiel. Bist du so weit?

**Kim (Antwort):** „Ich bin so weit.“\
(andere Antworten: „Noch nicht.“)

_Am Sonntag regnet es richtig. Es trommelt so laut aufs Blechdach, dass man schreien muss._

_Trotzdem sind alle gekommen, unter Schirmen in drei Reihen. Pops, Mr. Harlan, Mrs. Albescu, Mr. Quinn zwischen zwei Zügen._

_Slick hat den Tisch mit der Mulde freigeräumt. Er hat die Kuriertasche abgelegt, zum ersten Mal. Er redet kaum._

**Slick:** Blitz? Drei Minuten. Wie es sich gehört.

**Ambrose:** Er lebt von der Eile. Nimm ihm die Eile.

**Kim (Antwort):** „Fünfundvierzig Minuten.“\
(andere Antworten: „Blitz. Drei Minuten.“)

_Ein Murmeln geht durch die Schirme. Tamsin verdreht die Augen._

_Slick grinst, schief, mit einem Mundwinkel._

**Slick:** Die Okafor hat dich verdorben.

**Slick:** Gut. Dann eben lang. Soll ja was davon bleiben.

_Er beugt sich vor, und einen Moment ist er wieder der Slick vom ersten Tag._

**Slick:** Das hier ist der letzte Tisch mit echten Figuren. Wenn du verlierst, verlierst du gegen Riverton.

[Partie gegen Slick – Ausgang: gewonnen]

→ Quest „Der letzte Tisch“: Schritt 6 von 7 erledigt

#### 302 · Parkpavillon

`riverton-pavillon.slick` · Quest „Der letzte Tisch“, Schritt 7 von 7: Slick in seinem Wohnwagen besuchen.

_Vom Fluss weht ein kühler Wind durchs Geländer._

_Slick legt seinen König nicht um. Er nimmt ihn in die Hand und sieht ihn an._

**Slick:** Das war das letzte Spiel in diesem Pavillon. Gut, dass es ein richtiges war.

**Slick:** Applaus für Maple Falls! Na los! Der Eintritt war frei, also klatscht!

_Sie klatschen. Es klingt wie noch mehr Regen._

_Er steckt dir die Nadel an, ein kleines Achteck aus grünem Blech mit einer Uhr darauf, und hält dich einen Moment an der Schulter._

**Slick:** Lang spielen. Ich. Wer hätte das gedacht.

#### 303 · Parkpavillon

`riverton-pavillon.tamsin` · Quest „Der letzte Tisch“, Schritt 7 von 7

**Tamsin:** Fünf Minuten reichen für jede Partie. Fast jede.

#### 304 · Bahnhofshalle

`riverton-bahnhofshalle.harlan` · Quest „Die Lupe des Uhrmachers“, Schritt 1 von 1: Dreimal gegen Mr. Harlan in der Bahnhofshalle gewinnen.

_Er greift in die Westentasche und legt dir etwas in die Hand. Eine kleine Lupe aus Messing, zum Aufklappen, blank gerieben._

**Mr. Harlan:** Fünfzig Jahre an Uhrwerken. Man sieht damit nicht die Zahnräder. Man sieht, wo es hakt.

**Mr. Harlan:** Bei mir: Ich denke zu lange. Du darfst das wissen. Die meisten wollen es nicht wissen, sie wollen nur schneller sein.

**Ambrose:** Ein ehrliches Werkzeug. Es zeigt nur, was ohnehin da ist.

→ Quest „Die Lupe des Uhrmachers“: Schritt 1 von 1 erledigt

→ Quest abgeschlossen: „Die Lupe des Uhrmachers“

#### 305 · Bahnhofshalle

`riverton-bahnhofshalle.pops` · Quest „Der letzte Tisch“, Schritt 7 von 7: Slick in seinem Wohnwagen besuchen.

**Pops:** Taschenschach seit dreißig Jahren. Die Bildschirme da draußen verkaufen sich besser. Noch.

[Laden: Pops' Zeitungsstand]

#### 306 · Parkpavillon

`riverton-pavillon.slick` · Quest „Der letzte Tisch“, Schritt 7 von 7

_Vom Fluss weht ein kühler Wind durchs Geländer._

_Am Montag, nach der Schule, fahrt ihr noch einmal hin. Juno hat gesagt, man müsse es sehen._

_Im Pavillon stehen Bildschirmtische. Vier Stück, im Kreis, weiß. Die Steintische sind weg._

_Auf dem Boden sieht man noch, wo sie standen: vier helle Flecken im Holz._

_Slick kniet in der Mitte und packt die Steinplatte mit der Mulde in seine Kuriertasche. Ohne das Reden sieht er jünger aus._

**Slick:** Die haben sie mir gelassen. Einer von den Arbeitern hat weggeguckt.

**Kim (Antwort):** Warten

_Er zieht den Riemen fest._

**Slick:** Dann spielen wir eben auf der Treppe. Ich wohn im Wohnwagen am Fluss, an der alten Steinbrücke.

**Kim (Antwort):** „Revanche um eine bessere Nadel?“\
(andere Antworten: „Bis bald, Slick.“)

**Slick:** Auf der Treppe? Immer.

[Partie gegen Slick, erneut – Ausgang: gewonnen]

#### 307 · Parkpavillon

`riverton-pavillon.slick` · Quest „Der letzte Tisch“, Schritt 7 von 7

(noch einmal angesprochen; hier nur, was neu ist)

_Unter dem Dach riecht es nach nassem Holz und Limonade._

**Kim (Antwort):** „Bis bald, Slick.“\
(andere Antworten: „Revanche um eine bessere Nadel?“)

#### 308 · Parkpavillon

`riverton-pavillon.ray` · Quest „Der letzte Tisch“, Schritt 7 von 7

**Ray:** Der Pavillon war unsere Endhaltestelle. Mal sehen, wo die nächste ist.

#### 309 · Parkpavillon

`riverton-pavillon.tamsin` · Quest „Der letzte Tisch“, Schritt 7 von 7

**Tamsin:** Er guckt nur nach vorn. Jedes Mal!

#### 310 · Riverton, am Fluss

`riverton-aussen.wohnwagen_zu` · Quest „Der letzte Tisch“, Schritt 7 von 7

_Die Tür des Wohnwagens steht einen Spalt offen. Drinnen brennt Licht._

#### 311 · Slicks Wohnwagen

`riverton-wohnwagen.dosentrophaeen` · Quest „Der letzte Tisch“, Schritt 7 von 7

_Drinnen ist es eng und warm. In der Ecke lehnt seine Kuriertasche. Auf einem Brett über dem Bett stehen Pokale._

_Sie sind aus Limonadendosen, aufgeschnitten, gebogen, mit Draht. „Parkmeister 2019.“ „Bester Verlierer 2017.“_

**Slick:** Der Alte hat die gebaut. Jedes Jahr einen. Richtige Pokale kosten Geld, hat er gesagt, und Dosen hab ich genug getrunken.

_Er setzt sich aufs Bett und sieht hinauf zu den Dosen._

**Slick:** Ich hab seit März keinen neuen.

**Kim (Antwort):** Nichts sagen\
(andere Antworten: Juno ansehen)

**Slick:** Ich bin ein Großmaul. Weiß ich. Ich dachte, wenn ich laut genug bin, hören die im Rathaus, dass da noch jemand ist.

_Er reibt sich das Gesicht._

**Slick:** Haben sie nicht.

_Er hält dir einen weißen Springer aus Stein hin. Die Mähne ist an einer Stelle abgestoßen._

**Slick:** Aus dem letzten Satz. Nimm ihn mit. Stell ihn irgendwo hin, wo gespielt wird.

**Kim (Antwort):** Den Springer nehmen

_Er ist kalt und schwer._

**Kim (Antwort):** Hinausgehen

_Draußen läuft der Fluss schwarz unter der Brücke. Oben im Park leuchtet es, jetzt an zehn Stellen._

**Ambrose:** Slick ist im Recht.

**Ambrose:** Er ist im Recht, und es ist ein Unrecht, und ich würde dem Stadtrat gern etwas sagen, das man vor Kindern nicht sagt.

**Ambrose:** Und die Tische spielen trotzdem besser als er.

**Kim (Antwort):** „Ja.“\
(andere Antworten: Schweigen)

**Ambrose:** Besser als ich.

_Du hast ihn noch nie so gehört._

**Ambrose:** Was heißt das, Kim? Wenn das Schöne und das Richtige dasselbe sind, und eine Maschine kann beides?

**Ambrose:** Und ein Mann mit Dosenpokalen kann keines von beiden ganz. Was heißt das?

**Kim (Antwort):** „Ich weiß es nicht. Aber ich weiß, mit wem ich lieber spiele.“\
(andere Antworten: „Ich weiß es nicht.“ · Den Springer in der Hand drehen)

_Er antwortet nicht._

_Es ist nicht die Antwort, die er gesucht hat._

→ Quest „Der letzte Tisch“: Schritt 7 von 7 erledigt

→ Quest abgeschlossen: „Der letzte Tisch“

#### 312 · Slicks Wohnwagen

`riverton-wohnwagen.dosentrophaeen` · keine laufende Quest

_Die Steinplatte mit der Mulde liegt auf dem Bett, in ein Handtuch gewickelt._

#### 313 · Slicks Wohnwagen

`riverton-wohnwagen.dosentrophaeen` · keine laufende Quest

_Auf dem Brett über dem Bett: „Parkmeister 2019“, „Parkmeister 2020“, „Bester Verlierer 2017“. Alles Limonadendosen._

#### 314 · Bahnhofshalle

`riverton-bahnhofshalle.pops` · keine laufende Quest

**Pops:** Ein Kiosk ist eine Bibliothek, die man essen kann. Willst du ein Sandwich?

[Laden: Pops' Zeitungsstand]

#### 315 · Riverton, am Fluss

`riverton-aussen.kanalweg` · keine laufende Quest

_Der Treidelpfad am Kanal führt nach Ironwood. Zu Fuß ist es weit, mit dem Rad geht es schneller._

**Ambrose:** Ironwood. Dort riecht die Luft nach Eisen, sagt man. Gehen wir.

### Weg nach Ironwood

#### 316 · Kanalweg

`weg-riverton-ironwood.tafel` · keine laufende Quest

→ Quest begonnen: „Die Tafel am Kanal“

_An einer Bushaltestelle ohne Bus hängt eine Rätseltafel aus Blech: „Was festgenagelt ist, kann nicht weg.“_

**Ambrose:** Festgenagelt. Ein hartes Wort für eine Figur, die nur treu ist.

**Kim (Antwort):** Die Aufgaben lösen\
(andere Antworten: Weitergehen)

[Aufgaben von Die Rätseltafel (wegRivertonIronwood.tafel) – Ausgang: bestanden]

→ Quest „Die Tafel am Kanal“: Schritt 1 von 1 erledigt

→ Quest abgeschlossen: „Die Tafel am Kanal“

#### 317 · Kanalweg

`weg-riverton-ironwood.tafel` · keine laufende Quest

_Unter dem Fahrplan steht in Kreide: „Gelöst. Der Bus kommt trotzdem nicht.“_

#### 318 · Kanalweg

`weg-riverton-ironwood.fund_zahnrad` · keine laufende Quest

_Eine Fabrik aus rotem Stein, und niemand ist darin. Fenster ohne Glas. Aus dem Schornstein wächst ein Baum._

_Am Zaun liegt ein Zahnrad, so groß wie eine Hand._

**Ambrose:** Ein Rad, das kein anderes mehr dreht.

#### 319 · Kanalweg

`weg-riverton-ironwood.meilenstein` · keine laufende Quest

_Ein Meilenstein aus rotem Sandstein, halb im Gras: „Meile 0“. Von hier an zählt der Kanal._

#### 320 · Kanalweg

`weg-riverton-ironwood.rast_kanal` · keine laufende Quest

_Eine Bank am Schilf. Über dem Wasser stehen Libellen in der Luft, als hätten sie alle Zeit der Welt._

#### 321 · Kanalweg

`weg-riverton-ironwood.fund_konservendose` · keine laufende Quest

_Am Rastanleger treibt eine Konservendose mit Deckel. Darin steckt ein trockener Zettel._

_„Wer das findet: komm nach Lockport. Ich hab schon 41 Flaschen. Finn“_

#### 322 · Kanalweg

`weg-riverton-ironwood.dale` · keine laufende Quest

_Ein Mann lehnt am Zaun und kaut einen Halm._

**Mr. Dale:** Ein Bauer zieht nie zurück.

**Mr. Dale:** Also überleg vorher.

_Keiner hat ihn gefragt. Er meint vermutlich auch sich selbst._

#### 323 · Eisenbrücke

`weg-riverton-ironwood.fund_nietenkopf` · keine laufende Quest

**Juno:** Hier ist was eingeschlagen! In die Dinger. Die runden.

_Auf einem Nietenkopf am Fuß eines Pfostens stehen zwei Buchstaben. Klein, sauber, ins heiße Eisen gestempelt._

_J. H._

_Auf dem nächsten auch. Und auf dem übernächsten._

**Juno:** Der Erbauer. Der hat überall unterschrieben. Eitel!

_Ambrose sieht auf die Buchstaben. Sein Gesicht ist leer. Wie ein Zimmer, aus dem gerade jemand hinausgegangen ist._

**Kim (Antwort):** „Ambrose?“

**Ambrose:** Ein Brückenbauer. Es gibt viele.

**Kim (Antwort):** „Du sagtest, er war Brückenbauer. Aus dem Norden.“

**Ambrose:** Es gibt viele Brücken.

_Der Wind pfeift durch die Dreiecke._

_Ambrose steht noch einen Augenblick am Geländer. Eine Hand ausgestreckt, dicht über dem Eisen, ohne es zu berühren._

#### 324 · Eisenbrücke

`weg-riverton-ironwood.zeitnot_trick` · keine laufende Quest

_Über das Tal läuft eine Brücke aus schwarzem Eisen, sehr alt und sehr schön, auf eine strenge Art. Lauter Dreiecke, jedes genau so groß wie das nächste._

_Und Tausende Nieten, runde Köpfe in geraden Reihen._

**Juno:** Wer baut so etwas?

**Kim (Antwort):** „Jemand, der nichts dem Zufall überlässt.“

_Du weißt nicht, warum du das sagst. Ambrose ist sehr still._

_Dann redet er von etwas ganz anderem, ein wenig zu schnell._

**Ambrose:** Im Kaffeehaus gab es einen Trick. Man tat, als brenne die Kerze des Gegners schon herunter.

**Ambrose:** Man sah darauf. Man seufzte. Er glaubte es, und er eilte.

**Kim (Antwort):** „Ist das nicht Schummeln?“

**Ambrose:** Es ist Theater. Der Gegner sieht dieselbe Kerze wie du.

_Er hält dir eine Karte hin. Eine Sanduhr darauf, fast leer._

**Ambrose:** Sie ist nicht ganz sauber. Wenn du sie spielst, glänzt deine Nadel weniger.

**Ambrose:** Ich sage es dir, weil ich es früher niemandem gesagt habe.

**Kim (Antwort):** „Und wenn der andere wirklich keine Zeit hat?“

**Ambrose:** Dann spielt man nicht mit ihm um die Wette. Man nimmt sich die eigene Zeit und zieht in Ruhe.

**Ambrose:** Das habe ich spät gelernt. Dann war ich tot.

#### 325 · Eisenbrücke

`weg-riverton-ironwood.aussicht_tal` · keine laufende Quest

_Tief unten liegt der Kanal wie ein Strich. Am Ende des Tals stehen Schornsteine im Dunst. Aus einem kommt Rauch._

#### 326 · Eisenbrücke

`weg-riverton-ironwood.waerterhaus` · keine laufende Quest

_Ein Häuschen mit vernagelter Tür. Auf dem Schild steht „Brückenwärter. Bitte klopfen.“ Niemand klopft hier mehr._

#### 327 · Eisenbrücke

`weg-riverton-ironwood.brueckenbauern` · keine laufende Quest

→ Quest begonnen: „Die Brückenbauern“

_Unter der Brücke stehen drei Klapptische. Ein Mann mit Schiebermütze redet, ohne Luft zu holen._

**Dime:** Zehn Cent die Partie, drei Minuten, zwei Sekunden dazu. Aber erst das Wort.

**Dime:** Das Wort steht am Pfeiler, wenn man richtig hinschaut. Die meisten schauen nicht richtig.

#### 328 · Eisenbrücke

`weg-riverton-ironwood.kreide1` · Quest „Die Brückenbauern“, Schritt 1 von 2: Das Losungswort am Kreidespringer herausfinden.

→ Quest begonnen: „Die Kreidespringer“

_Am Brückenfuß ist ein Springer aus Kreide gezeichnet. Darunter, kleiner:_

_„Weiß: König g1, Turm d1. Schwarz: König g8, Bauern f7, g7 und h7. Weiß am Zug. Ein Zug, und es ist vorbei. Der Zug ist das Wort.“_

**Kim (Antwort):** Td8\
(andere Antworten: Td7 · Kf2 · Erst nachdenken)

_Td8. Der König steckt hinter seinen eigenen Bauern fest: Matt auf der Grundreihe._

_Das Wort ist „Td8“._

→ Quest „Die Brückenbauern“: Schritt 1 von 2 erledigt

#### 329 · Eisenbrücke

`weg-riverton-ironwood.spur_pm1` · keine laufende Quest

→ Quest begonnen: „Die Spuren von Perfect Move“

_Über dem Kanal steht eine Drohne. Auf der Unterseite leuchtet ein Logo: Perfect Move._

_Sie dreht sich langsam zu den Klapptischen, als würde sie zuschauen._

#### 330 · Eisenbrücke

`weg-riverton-ironwood.seite07` · keine laufende Quest

_Zwischen den Steinen am Kanalufer klemmt ein Blatt, trocken und sauber._

_Eine lose Seite voller Schachdiagramme._

#### 331 · Eisenbrücke

`weg-riverton-ironwood.finch_laeufer_a` · keine laufende Quest

_Am Brückenfuß hängt ein kleiner Fink aus Blech. Darunter, im Spalt zwischen zwei Steinen, steckt ein weißer Läufer aus Buchsbaum._

#### 332 · Eisenbrücke

`weg-riverton-ironwood.brueckenbauern` · keine laufende Quest

**Dime:** „Td8“? Richtig. Setz dich. Ich bin Dime, wie die Münze, und ich verliere nie. Fast nie.

_Über dem Kanal surrt die Drohne und dreht sich zum Tisch._

**Dime:** Die da? Seit zwei Wochen. Filmt jede Partie. Fragt keiner, wozu.

**Kim (Antwort):** Spielen\
(andere Antworten: Nicht jetzt)

_Dime stellt die Uhr. Bevor du den ersten Zug machst, hat er schon drei Sätze gesagt._

[Partie gegen Dime – Ausgang: gewonnen]

→ Quest „Die Brückenbauern“: Schritt 2 von 2 erledigt

→ Quest abgeschlossen: „Die Brückenbauern“

#### 333 · Eisenbrücke

`weg-riverton-ironwood.brueckenbauern` · keine laufende Quest

**Dime:** Gewonnen hast du. Zehn Cent? Sagen wir zwanzig. Ich übertreibe immer, das ist mein Stil.

**Dime:** Noch eine?

**Kim (Antwort):** Spielen\
(andere Antworten: Nicht jetzt)

_Dime stellt die Uhr. Bevor du den ersten Zug machst, hat er schon drei Sätze gesagt._

[Partie gegen Dime, erneut – Ausgang: gewonnen]

#### 334 · Kanalweg

`weg-riverton-ironwood.fund_zahnrad` · keine laufende Quest

_Am Zaun der leeren Fabrik sitzen Krähen. Sie sehen dir nach, als hätten sie hier das Sagen._

#### 335 · Kanalweg

`weg-riverton-ironwood.fund_konservendose` · keine laufende Quest

_Am Anleger schwappt nur noch Wasser gegen das Holz._

#### 336 · Kanalweg

`weg-riverton-ironwood.dale` · keine laufende Quest

**Mr. Dale:** Überleg vorher. Sag ich den Kühen auch.

### Lockport

#### 337 · Schleusendorf

`lockport-aussen.tafel_schleuse` · keine laufende Quest

→ Quest begonnen: „Der Steg am Untertor“

_Neben der Tafel steht eine Frau in Ölzeug, einen Schlüsselbund am Gürtel._

_„Imogen Rourke, Schleusenwärterin. Erst das Wasser, dann das Boot.“_

_„Der Steg ist zu, Herbstwartung. Wer zwei Dinge zugleich im Blick hat, darf mit mir hinüber. Hier ist die Tafel.“_

**Kim (Antwort):** Die Tafel lösen\
(andere Antworten: Später)

[Aufgaben von Imogen Rourke (lockport.tafelSchleuse) – Ausgang: bestanden]

→ Quest „Der Steg am Untertor“: Schritt 1 von 1 erledigt

→ Quest abgeschlossen: „Der Steg am Untertor“

#### 338 · Schleusendorf

`lockport-aussen.tafel_schleuse` · keine laufende Quest

_„Zwei Ziele mit einem Zug. Du darfst über den Steg, ich halte dich am Arm.“_

#### 339 · Schleusendorf

`lockport-aussen.kai` · Quest „Das Kahnrennen“, Schritt 1 von 2: An Rubens Kreidetafel zwei Kähne mit einem Zug treffen.

_Ein Mann mit Schiffermütze sitzt auf einem Poller und sieht auf den leeren Kahn._

_„Ruben Castellano. Kapitän der Ashford Belle. Ein Kahn ohne Fracht ist ein Haus ohne Leute.“_

_Am Kai schwimmen drei Spielzeugkähne aus Holz. Ein Junge, Finn, und zwei andere Kinder knien an der Kante._

_„Ich bin Schiedsrichter. Wer an der Tafel zwei Kähne mit einem Zug trifft, darf den Startschuss geben.“_

**Kim (Antwort):** An die Kreidetafel\
(andere Antworten: Später)

→ Quest begonnen: „Das Kahnrennen“

[Aufgaben von Kapitän Ruben Castellano (lockport.kahnrennen) – Ausgang: bestanden]

→ Quest „Das Kahnrennen“: Schritt 1 von 2 erledigt

#### 340 · Schleusendorf

`lockport-aussen.kai` · Quest „Das Kahnrennen“, Schritt 2 von 2: Den Startschuss für das Rennen geben.

_„Drei von drei. Dann los, du gibst das Zeichen.“_

_Du klatschst in die Hände. Die Kähne treiben los, Finns Kahn dreht sich einmal und gewinnt trotzdem._

→ Quest „Das Kahnrennen“: Schritt 2 von 2 erledigt

→ Quest abgeschlossen: „Das Kahnrennen“

#### 341 · Schleusendorf

`lockport-aussen.henriks_boot` · keine laufende Quest

_Ein Ruderboot, an vier Tauen festgemacht, kreuz und quer. Daran hat jemand mit viel Geduld geknotet._

#### 342 · Schleusendorf

`lockport-aussen.pumpe` · keine laufende Quest

_Der alte Dorfbrunnen mit Kurbel. Wer dreht, bekommt kaltes Wasser und quietschende Ohren._

#### 343 · Schleusendorf

`lockport-aussen.glocke` · keine laufende Quest

_An einem Pfosten am Ufer hängt eine Messingglocke. Imogen läutet sie für jeden Kahn, der kommt._

#### 344 · Schleusendorf

`lockport-aussen.lastkahn` · keine laufende Quest

_Die Ashford Belle liegt vertäut unter ihrer Plane. Ohne Fracht fährt sie nirgendwohin._

#### 345 · Gasthaus „Zur Schleuse“

`lockport-gasthaus.henrik` · Quest „Der festgebundene Kahn“, Schritt 1 von 2: An Henriks Boot das Tau finden, an dem alles hängt.

_Hinter dem Tresen poliert ein alter Mann ein Glas. „Henrik Dahl. Kegelkönig von 1979 bis 1994.“_

_„Mein Ruderboot muss für den Winter an Land. Aber es hängt an vier Tauen, und wenn du das falsche löst, kippt alles.“_

**Kim (Antwort):** Ich sehe es mir an\
(andere Antworten: Später)

_„Siehst du den Kegel in der Mitte? Der hält alle anderen. Fällt der, fallen sie alle.“_

_„Das Boot liegt am Kai neben dem Bootsschuppen.“_

→ Quest begonnen: „Der festgebundene Kahn“

#### 346 · Gasthaus „Zur Schleuse“

`lockport-gasthaus.fund_kegel` · keine laufende Quest

_Am Ende der Bahn steht ein Kegel mit einer tiefen Kerbe._

_Henrik ruft vom Tresen: „1979 hab ich mit dem alle Neune geworfen. Die Kerbe ist vom Jubeln.“_

#### 347 · Gasthaus „Zur Schleuse“

`lockport-gasthaus.kegelbahn` · keine laufende Quest

_Die Kugel poltert die Bahn hinunter. Acht Kegel fallen, einer wackelt und bleibt stehen._

#### 348 · Gasthaus „Zur Schleuse“

`lockport-gasthaus.foto_hochwasser` · keine laufende Quest

_Ein Foto der Schleuse im Hochwasser: nur noch die Kurbeln schauen aus dem Wasser, und daneben steht Imogen in Gummistiefeln._

#### 349 · Gasthaus „Zur Schleuse“

`lockport-gasthaus.kegelkoenig` · keine laufende Quest

_Auf der Tafel steht „Kegelkönig des Monats“. Darunter, seit über dreißig Jahren nicht weggewischt: Henrik._

**Ambrose:** Manche Throne bleiben einfach besetzt.

#### 350 · Schleusendorf

`lockport-aussen.kai` · keine laufende Quest

_„Zwei Ziele, ein Schuss. So legt man an. So gabelt man auch.“_

#### 351 · Schleusendorf

`lockport-aussen.henriks_boot` · keine laufende Quest

_Henriks Ruderboot hängt an vier Tauen. Löst du das falsche, kippt alles._

**Kim (Antwort):** Die Taue ansehen\
(andere Antworten: Später)

[Aufgaben von Henrik Dahl (lockport.taue) – Ausgang: bestanden]

→ Quest „Der festgebundene Kahn“: Schritt 1 von 2 erledigt

#### 352 · Schleusendorf

`lockport-aussen.henriks_boot` · Quest „Der festgebundene Kahn“, Schritt 2 von 2: Das Boot an Land holen.

_Ein Tau nach dem anderen, und das Boot gleitet die Slipanlage hinauf._

_Henrik kommt aus dem Gasthaus gelaufen. „Damit du beim nächsten Boot keine nassen Füße kriegst. Ich hab zwei Paar.“_

_Er drückt dir ein Paar Gummistiefel in die Hand._

→ Quest „Der festgebundene Kahn“: Schritt 2 von 2 erledigt

→ Quest abgeschlossen: „Der festgebundene Kahn“

### Weg nach Ironwood

#### 353 · Eisenbrücke

`weg-riverton-ironwood.fund_nietenkopf` · keine laufende Quest

_Am Geländer sitzen die Nieten in langen Reihen. Auf jedem Kopf: J. H._

#### 354 · Eisenbrücke

`weg-riverton-ironwood.zeitnot_trick` · keine laufende Quest

_Der Wind singt in den Trägern. Am Ende des Tals raucht ein Schornstein._

#### 355 · Eisenbrücke

`weg-riverton-ironwood.brueckenbauern` · keine laufende Quest

(noch einmal angesprochen; hier nur, was neu ist)

**Kim (Antwort):** Nicht jetzt\
(andere Antworten: Spielen)

**Dime:** Ich bin hier. Die Brücke auch.

#### 356 · Eisenbrücke

`weg-riverton-ironwood.kreide1` · keine laufende Quest

_Der Springer aus Kreide am Brückenfuß. Das Wort kennst du schon: Td8._

#### 357 · Eisenbrücke

`weg-riverton-ironwood.spur_pm1` · keine laufende Quest

_Die Drohne steht wieder über dem Wasser. Sie hat Geduld._

#### 358 · Eisenbrücke

`weg-riverton-ironwood.seite07` · keine laufende Quest

_Am Ufer liegt nur noch Kies._

#### 359 · Eisenbrücke

`weg-riverton-ironwood.finch_laeufer_a` · keine laufende Quest

_Am Brückenfuß hängt nur noch der kleine Fink aus Blech._

### Lockport

#### 360 · Schleusendorf

`lockport-aussen.henriks_boot` · keine laufende Quest

_Henriks Boot liegt kieloben auf dem Kai, bereit für den Winter._

#### 361 · Gasthaus „Zur Schleuse“

`lockport-gasthaus.henrik` · keine laufende Quest

_„Alle Neune! … Na ja, acht.“_

#### 362 · Gasthaus „Zur Schleuse“

`lockport-gasthaus.fund_kegel` · keine laufende Quest

_Der Kegel mit der Kerbe steht wieder in seinem Ständer._

### Weg nach Ironwood

#### 363 · Eisenbrücke

`ironwood-aussen.ankunft_zu_fuss` · keine laufende Quest

_Ironwood ist grau. Nicht hässlich. Grau, wie Dinge grau sind, die gearbeitet haben._

_Reihenhäuser, eins am anderen, alle gleich, mit schmalen Treppen und Eisengeländern._

_Über den Hallen leuchtet der Himmel orange auf. Einen Atemzug später kommt das Geräusch, ein tiefes Fauchen._

**Juno:** Coach Delgado hat uns für ein Freundschaftsturnier hier angemeldet! Ich hab es deiner Mama gesagt.

_Dein Handy klingelt. Mama._

**Mama:** Nein.

**Mama:** Nicht Ironwood.

**Kim (Antwort):** „Warum?“\
(andere Antworten: Nichts sagen)

**Mama:** Frag nicht. Bitte. Nicht heute.

_Sie hat schon aufgelegt._

**Ambrose:** Deine Mutter hat Angst. Vor einer Stadt. Das ist selten.

**Juno:** Wir gucken nur. Gucken ist kein Turnier.

**Ambrose:** Das ist eine Unterscheidung, die Advokaten machen.

### Ironwood

#### 364 · Ironwood, Hauptstraße

`ironwood-aussen.bus_riverton` · Quest „Der Stahlwerker-Club“, Schritt 1 von 6: Mit Big Joe in der Kantine reden.

→ Quest begonnen: „Der Stahlwerker-Club“

_Der Bus nach Riverton fährt am Bahnhof ab. Er braucht zwanzig Minuten._

_Zu Fuß ist es ein halber Tag._

**Kim (Antwort):** Einsteigen\
(andere Antworten: Hierbleiben)

_Der Bus rumpelt über die Brücke. Unten glitzert der Kanal._

#### 365 · Ironwood, Hauptstraße

`ironwood-aussen.bus_silicon_bay` · Quest „Der Stahlwerker-Club“, Schritt 1 von 6

_An der Schnellstraße hält ein Fernbus: „Silicon Bay“. Was solltest du dort wollen?_

#### 366 · Ironwood, Hauptstraße

`ironwood-aussen.eisenwarenfenster` · Quest „Der Stahlwerker-Club“, Schritt 1 von 6

_Im Fenster von Ednas Laden: Schrauben in Gläsern, drei Laternen, eine Fahrradkette und ein handgeschriebenes Schild „Das hält“._

#### 367 · Ironwood, Hauptstraße

`ironwood-aussen.kreidebrett` · Quest „Der Stahlwerker-Club“, Schritt 1 von 6

_Auf dem Gehweg haben Kinder ein Schachbrett mit Kreide gemalt. Ein richtiges, acht mal acht._

**Juno:** Die h-Linie ist breiter als die a-Linie. Aber es sind acht.

**Ambrose:** Ein Brett aus Kreide, Figuren aus Steinen. Wir hatten nicht mehr, und wir hatten genug.

#### 368 · Ironwood, Hauptstraße

`ironwood-aussen.anleger` · Quest „Der Stahlwerker-Club“, Schritt 1 von 6

_Ein leerer Anleger am schwarzen Kanal. Hier hat lange kein Kahn mehr festgemacht._

#### 369 · Ironwood, Hauptstraße

`ironwood-aussen.gus` · Quest „Der Stahlwerker-Club“, Schritt 1 von 6

_Am Güterbahnhof sitzt ein Rangierer auf einer umgedrehten Kabeltrommel, vor sich ein Brett und eine Uhr._

**Gus:** Gus. Fünfzehn Minuten Pause. Zehn für dich, fünf für mein Sandwich.

**Gus:** Zehn Minuten und fünf Sekunden je Zug, eine Stellung mit Vorteil für Weiß. Zehn Züge.

**Gus:** Fertig?

**Kim (Antwort):** „Fertig.“\
(andere Antworten: „Nach Ihrem Sandwich.“)

**Ambrose:** Er spielt wie ein Fahrplan mit Verspätung: zuverlässig, aber nicht immer pünktlich.

[Stellungsduell gegen Gus – Ausgang: gewonnen]

#### 370 · Ironwood, Hauptstraße

`ironwood-aussen.gus` · Quest „Der Stahlwerker-Club“, Schritt 1 von 6

**Gus:** Pause vorbei, Partie verloren. Guter Tag für dich. Noch eine? Ich nehm mir fünf Minuten von morgen.

**Kim (Antwort):** „Noch eine, jetzt.“\
(andere Antworten: „Guten Appetit.“)

[Stellungsduell gegen Gus, erneut – Ausgang: gewonnen]

#### 371 · Ironwood, Hauptstraße

`ironwood-aussen.edna` · Quest „Der Stahlwerker-Club“, Schritt 1 von 6

_Hinter einem Verkaufsfenster voller Schrauben, Laternen und Fahrradketten sitzt eine alte Dame mit Lesebrille._

**Edna:** Edna. Eisenwaren. Was du hier kaufst, hält.

**Edna:** Ein Rad hast du schon. Aber eine Laterne für dunkle Ecken? Die Umkleide im Werk ist finster.

[Laden: Ednas Eisenwaren]

#### 372 · Werkskantine

`ironwood-kantine.pokalregal` · Quest „Der Stahlwerker-Club“, Schritt 1 von 6

_Im Pokalregal stehen dreißig Jahre Werksclub, dicht an dicht._

_Nur an einer Stelle nicht. Eine Lücke, so breit wie eine Hand. Darunter ein Schildchen aus Messing: 2001._

#### 373 · Werkskantine

`ironwood-kantine.stahlbrett` · Quest „Der Stahlwerker-Club“, Schritt 1 von 6

_Ein Schachbrett aus Stahl. Die Felder hell geschliffen und dunkel angelassen, die Schweißnähte am Rand dick wie Finger._

**Ambrose:** Stahl für das Brett, Holz für die Figuren. Ein Mann, der weiß, was hart sein muss und was nicht.

#### 374 · Werkskantine

`ironwood-kantine.big_joe` · Quest „Der Stahlwerker-Club“, Schritt 1 von 6

_Big Joe stellt Figuren auf sein Stahlbrett, eine nach der anderen. Es klirrt kein einziges Mal._

_Am Ende des Raums, unter dem Pokalregal, sitzt ein Mann wie aus demselben Stück wie der Ofen. Vor ihm ein Schachbrett aus Stahl._

_Er setzt eine Figur hin, als wäre sie aus Glas._

**Big Joe:** Eine Fesselung ist wie ein Kranhaken, Priya. Was dranhängt, kann nicht weg.

**Priya:** Ein Spieß ist eine Fesselung von hinten. Statik.

**Big Joe:** Statik!

_Er lacht, dass die Tassen klirren. Dann sieht er dich und hört auf._

_Er steht auf. Es dauert, bis er oben ist._

**Big Joe:** Kumpel. Du hast ein Gesicht, das ich kenne.

**Big Joe:** Die Augen. Wie du auf das Brett guckst, bevor du auf mich guckst.

**Big Joe:** Bist du Lauries Kind?

**Kim (Antwort):** „Laura. Sie heißt Laura.“

**Big Joe:** Laura.

_Sein großes Gesicht wird froh und traurig zugleich._

**Big Joe:** Ja. Hier hieß sie Laurie.

_Er heißt Big Joe. Er sagt es wie einen Dienstgrad. Kranführer, dreißig Jahre, und ebenso lange der Club._

**Big Joe:** Steckt sie noch die Hände in die Ärmel? Wenn sie nachdenkt?

**Kim (Antwort):** „Ja.“

_Du hast nie darüber nachgedacht._

_Im Pokalregal hinter ihm stehen die Pokale dicht an dicht. Nur an einer Stelle nicht. Eine Lücke, so breit wie eine Hand. Darunter ein Schildchen aus Messing: 2001._

**Big Joe:** Deine Oma wohnt noch in der Elm Street. Nummer zehn, das Eckhaus mit dem grünen Geländer.

**Big Joe:** Geh hin. Ruth hat dich nicht mehr gesehen, seit du so klein warst.

**Big Joe:** Und wenn du deine Mutter siehst: Big Joe lässt grüßen.

**Big Joe:** Und dass es ihm leidtut.

**Juno:** Was tut ihm leid?

_Du weißt es nicht._

→ Quest „Der Stahlwerker-Club“: Schritt 1 von 6 erledigt

→ Quest begonnen: „Mamas Finale“

#### 375 · Werkskantine

`ironwood-kantine.hank` · Quest „Mamas Finale“, Schritt 1 von 3: Das Haus in der Elm Street besuchen.

_Ein Mann im Blaumann sitzt allein am Ende des Tischs und schiebt eine Figur hin und her._

**Hank:** Hank. Gefesselt.

**Hank:** Nicht bewegen. Wie ich nach der Nachtschicht.

**Hank:** Fesselungen. Willst du?

**Kim (Antwort):** „Ja.“\
(andere Antworten: „Gleich.“)

[Aufgaben von Hank (ironwood.reiheHank) – Ausgang: bestanden]

→ Quest „Der Stahlwerker-Club“: Schritt 2 von 6 erledigt

#### 376 · Werkskantine

`ironwood-kantine.hank` · Quest „Der Stahlwerker-Club“, Schritt 3 von 6: Priyas Aufgaben lösen.

**Hank:** Gut gemacht. Mehr sag ich nicht.

#### 377 · Werkskantine

`ironwood-kantine.priya` · Quest „Der Stahlwerker-Club“, Schritt 3 von 6

_Eine junge Frau mit Bauhelm und Notizbuch winkt dir zu. Im Notizbuch: Brücken und Schachdiagramme._

**Priya:** Priya. Werkstudentin.

**Priya:** Ich will mal Brücken bauen. Und Spieße sind wie eine Statik-Rechnung!

**Priya:** Spieße und scheinbarer Schutz. Bereit für ein bisschen Statik?

**Kim (Antwort):** „Bereit.“\
(andere Antworten: „Gleich.“)

[Aufgaben von Priya (ironwood.reihePriya) – Ausgang: bestanden]

→ Quest „Der Stahlwerker-Club“: Schritt 3 von 6 erledigt

#### 378 · Werkskantine

`ironwood-kantine.priya` · Quest „Der Stahlwerker-Club“, Schritt 4 von 6: Gegen Big Joe um die Clubnadel spielen.

**Priya:** Die Brücke über den Kanal ist alt, aber gut gerechnet. Wer die wohl gebaut hat?

#### 379 · Ironwood, Hauptstraße

`ironwood-aussen.kreidebrett` · Quest „Der Stahlwerker-Club“, Schritt 4 von 6

_Das Kreidebrett ist halb verwischt. Jemand hat einen neuen Turm danebengemalt._

#### 380 · Ironwood, Hauptstraße

`ironwood-aussen.edna` · Quest „Der Stahlwerker-Club“, Schritt 4 von 6

**Edna:** Kauf das Gute. Das Billige kaufst du zweimal.

[Laden: Ednas Eisenwaren]

#### 381 · Ironwood, Hauptstraße

`ironwood-aussen.haustuer_ruth` · Quest „Der Stahlwerker-Club“, Schritt 4 von 6

_Elm Street, Nummer zehn. Das Eckhaus mit dem grünen Geländer._

_Du klingelst. Drinnen schlurfen Hausschuhe._

#### 382 · Mamas altes Zimmer

`ironwood-mamas-zimmer.medaille` · Quest „Der Stahlwerker-Club“, Schritt 4 von 6

→ Quest begonnen: „Mamas Turnierheft“

_An der Wand hängt eine Medaille an einem blauen Band. Silber._

**Ambrose:** Silber. Eine Niederlage, die man aufhängt. Mutig.

#### 383 · Mamas altes Zimmer

`ironwood-mamas-zimmer.partieformular` · Quest „Der Stahlwerker-Club“, Schritt 4 von 6

_Unter Glas ein Partieformular. Züge in zwei Spalten, in einer Schrift, die du kennst. Nur runder, jünger._

_Um den dreiunddreißigsten Zug ist ein Kreis. So fest gedrückt, dass das Papier fast durch ist._

#### 384 · Mamas altes Zimmer

`ironwood-mamas-zimmer.oma_ruth` · Quest „Mamas Finale“, Schritt 1 von 3: Das Haus in der Elm Street besuchen.

_Die Frau in der Tür ist klein und hat Mamas Kinn._

_Sie sieht dich an und sagt nichts._

_Dann zieht sie dich an sich. Sie riecht nach Mamas altem Waschmittel. Dem von früher._

**Oma Ruth:** Als du das letzte Mal hier warst, warst du sechs. Und jetzt sieh dich an. Das gehört verboten.

_Sie macht Kakao und stellt Juno Fragen, als wäre Juno die Hauptperson. Juno beantwortet sie alle._

**Oma Ruth:** Komm. Ich zeig dir was. Sie wird mir böse sein. Soll sie.

_Ein kleines Zimmer unter dem Dach. Von damals weißt du nur noch die steile Treppe, nicht diese Tür. Poster von Bands, eine gehäkelte Decke. Durchs Fenster sieht man die Schornsteine._

_An der Wand ein Foto: ein Mädchen, die Hände in den Ärmeln, über einem Brett. „Jugendmeisterschaft des Bundesstaats 2001. Finale. Laura M., Stahlwerker-Club Ironwood.“_

_Sie sieht so sicher aus._

_Daneben unter Glas ein Partieformular. Um den dreiunddreißigsten Zug ist ein Kreis, so fest gedrückt, dass das Papier fast durch ist._

**Oma Ruth:** Sie hat es eingerahmt und nie wieder angesehen.

**Oma Ruth:** Deine Mutter war das stillste Kind der Straße. Außer, wenn sie gewonnen hat. Dann hat man sie bis zum Werkstor gehört.

**Oma Ruth:** Joe sagt, er hat in dreißig Jahren keine zweite gehabt. Dann kam das Finale. Sie hat etwas übersehen, einen Läufer.

**Oma Ruth:** Sie kam nach Hause und trug den Koffer mit den Figuren in den Keller.

**Kim (Antwort):** „Und Big Joe?“

**Oma Ruth:** Joe hat drei Tage gewartet, dann hat er geklingelt. Ich hab gesagt, sie will niemanden sehen.

**Oma Ruth:** Er dachte, er lässt ihr Zeit. Sie dachte, er ist enttäuscht.

**Oma Ruth:** So sind fünfundzwanzig Jahre vergangen. Zwei Dickköpfe.

**Oma Ruth:** Nimm das Foto mit. Zeig es ihr.

_Sie zieht die Schublade des Schreibtischs auf. Ein Heft, dick, blau, die Ecken abgestoßen._

_Jede Seite eine Partie. Datum, Gegner, Ergebnis. Darunter drei Sätze: „Was ich gelernt habe.“_

_„Nicht mit der Dame zuerst.“_

_„Wenn ich angreife, sehe ich nichts anderes. Aufpassen!!“_

_„Geduld ist kein Warten. Geduld ist Hinsehen.“_

_Die Schrift wird erwachsener. Die letzte beschriebene Seite: „Finale. 12. Mai 2001.“ Darunter die Überschrift._

_Und darunter nichts. Danach nur leere Seiten. Mehr als die Hälfte des Hefts._

**Oma Ruth:** Sie hat es mir dagelassen. Ich glaube, sie wollte, dass jemand weiterschreibt.

_Draußen leuchtet der Himmel über dem Werk orange auf. Das Fauchen kommt einen Atemzug später._

**Ambrose:** Drei Sätze nach jeder Partie. Deine Mutter war eine ordentliche Spielerin, Kim.

**Ambrose:** Ich war das nie. Ich habe meine Niederlagen nicht aufgeschrieben. Ich habe sie auswendig gelernt.

**Kim (Antwort):** „Was macht man damit?“

**Ambrose:** Mit einem halb leeren Heft? Man schreibt hinein. Was sonst.

**Kim (Antwort):** Mit dem Abendbus nach Hause fahren\
(andere Antworten: Noch bleiben)

→ Quest „Mamas Finale“: Schritt 1 von 3 erledigt

→ Quest „Mamas Turnierheft“: Schritt 1 von 1 erledigt

→ Quest abgeschlossen: „Mamas Turnierheft“

### Maple Falls

#### 385 · Wohnzimmer

`maple-falls-wohnzimmer.mutter` · Quest „Mamas Finale“, Schritt 2 von 3: Mama zeigen, was ich gefunden habe.

_Du legst das Foto auf den Küchentisch. Dorthin, wo der Zettel gelegen hat._

_Mama kommt von der Frühschicht. Mantel, Tasche, ob du gegessen hast. Dann sieht sie es._

**Kim (Antwort):** „Ich hab das gefunden.“

_Sie setzt sich. Nicht auf den Stuhl, an dem sie steht. Auf den nächsten, als wäre der Weg zu weit._

**Mama:** Du warst in Ironwood. Bei Oma Ruth.

**Kim (Antwort):** „Und bei Big Joe. Er lässt grüßen.“

_Und es tut ihm leid. Das sagst du auch._

**Mama:** Ihm tut es leid. Joe. Dieser sture, alberne … Ihm tut es leid.

_Sie nimmt das Foto. Das Mädchen mit den Händen in den Ärmeln._

**Mama:** Ich war siebzehn. Ich war gut, weißt du. Ich sage das nicht, um anzugeben.

**Mama:** Im Finale stand ich auf Gewinn. Joe stand hinten an der Wand und hat sich nicht getraut zu atmen.

**Mama:** Zug dreiunddreißig. Ich sehe nur meinen Angriff. Ich ziehe den Turm vor, hinter meine Dame, auf dieselbe Schräge.

**Mama:** Und ganz hinten, am anderen Ende des Brettes, steht sein Läufer und sieht die Schräge entlang. Seit zwanzig Zügen.

**Mama:** Die Dame muss weg, und der Turm dahinter fällt. Ein Spieß. Das Einfachste, was es gibt.

**Mama:** Ich hab den Läufer nicht gesehen. Fünfundzwanzig Jahre, und ich sehe ihn jede Nacht.

_„Wenn ich angreife, sehe ich nichts anderes. Aufpassen!!“ Sie hat es mit dreizehn ins blaue Heft geschrieben._

**Mama:** Alle haben gesagt, das passiert. Das passiert jedem.

**Mama:** Joe hat es gesagt, meine Mutter, der Gegner sogar. Ein netter Junge. Er hat sich entschuldigt.

**Mama:** Ich wollte nicht, dass es jedem passiert. Ich wollte, dass es mir nicht passiert.

**Mama:** Ich hab die Figuren in den Keller getragen. Schule, Ausbildung. Du. Es ging ja.

**Kim (Antwort):** „Du hast gesagt: Weiß steht besser.“

_Sie sieht dich an._

**Kim (Antwort):** „Am ersten Abend. Drei Sekunden.“

**Mama:** Zwei. Es waren zwei. Ich hab mich so erschrocken.

_Du legst das blaue Heft neben das Foto, aufgeschlagen auf der letzten Seite. Mama sieht auf die leere Stelle._

_Sie steht auf, geht zum Fenster und schiebt die Hände in die Ärmel ihrer Strickjacke._

**Mama:** Gut. Eine Partie.

**Mama:** In Ironwood. Ich will den Raum sehen. Und wenn ich gewinne, räumst du die Spülmaschine aus.

**Kim (Antwort):** Am Samstag mit Mama nach Ironwood fahren\
(andere Antworten: „Nicht jetzt.“)

→ Quest „Mamas Finale“: Schritt 2 von 3 erledigt

### Ironwood

#### 386 · Werkskantine

`ironwood-kantine.pokalregal` · Quest „Mamas Finale“, Schritt 3 von 3: In der Kantine gegen Mama spielen.

_Die Lücke im Regal ist noch da, so breit wie eine Hand. Darunter das Messingschild: 2001._

#### 387 · Werkskantine

`ironwood-kantine.big_joe` · Quest „Mamas Finale“, Schritt 3 von 3

_Es riecht nach Kaffee, Eisen und nassen Jacken._

_Big Joe zieht einen zerknitterten Umschlag aus der Brusttasche._

**Big Joe:** Kumpel, fährst du am Kanal entlang? Bring das Ruben in Lockport. Der Mann hat seit dem Sommer keine Fracht.

#### 388 · Werkskantine

`ironwood-kantine.hank` · Quest „Mamas Finale“, Schritt 3 von 3

**Hank:** Nachtschicht. Danach Schach. Danach schlafen. Meistens.

#### 389 · Werkskantine

`ironwood-kantine.priya` · Quest „Mamas Finale“, Schritt 3 von 3

**Priya:** Erst das Wertvolle angreifen, dann das dahinter nehmen. Ingenieurwesen.

#### 390 · Ironwood, Hauptstraße

`ironwood-aussen.edna` · Quest „Mamas Finale“, Schritt 3 von 3

**Edna:** Joe kauft seit dreißig Jahren seine Schrauben bei mir. Für das Stahlbrett, sagt er.

[Laden: Ednas Eisenwaren]

#### 391 · Umkleide

`ironwood-umkleide.schliessfach` · Quest „Mamas Finale“, Schritt 3 von 3

_Du hältst die Laterne in das klemmende Schließfach. Hinten, unter einem alten Helm, liegt ein Turm aus hellem Holz._

**Ambrose:** Der letzte. Jetzt ist der Satz vollständig.

#### 392 · Ironwood, Hauptstraße

`ironwood-aussen.edna` · Quest „Mamas Finale“, Schritt 3 von 3

**Edna:** Joe kauft seit dreißig Jahren seine Schrauben bei mir. Für das Stahlbrett, sagt er.

[Laden: Ednas Eisenwaren]

→ Quest begonnen: „Der leere Umschlag“

#### 393 · Heimatmuseum im alten Bahnhof

`ironwood-museum.postsack` · Quest „Mamas Finale“, Schritt 3 von 3

_Säcke aus grauem Segeltuch, steif vom Alter, jeder mit einem Klumpen Wachs versiegelt._

_Ein sehr alter Mann in einer Weste kommt herüber. Er hütet das Museum._

**Mr. Teague:** Post von achtzehnhundertsechsundsechzig. Die Strecke war drei Monate zu, und der Postmeister hatte das Fieber.

**Mr. Teague:** Dann kam ein neuer Postmeister, dann eine neue Bahn, dann kam ich. Niemand hat sie je geöffnet.

**Kim (Antwort):** „Warum nicht?“

**Mr. Teague:** Weil man ein Siegel nicht bricht, mein Kind. Man löst es.

_Ins Wachs sind kleine Figuren in einem Gitter gedrückt._

**Mr. Teague:** Der alte Postmeister war ein Schachnarr. Wer die Aufgabe löst, darf den Sack öffnen. Ich bin zu alt für Rätsel.

_Eine Fesselung. Hank hat sie dir gezeigt: „Gefesselt. Nicht bewegen. Wie ich nach der Nachtschicht.“_

**Kim (Antwort):** Die Stellung lösen\
(andere Antworten: Nicht jetzt)

[Aufgaben von Mr. Teague (ironwood.siegelStellung) – Ausgang: bestanden]

→ Quest „Der leere Umschlag“: Schritt 1 von 1 erledigt

→ Quest abgeschlossen: „Der leere Umschlag“

#### 394 · Heimatmuseum im alten Bahnhof

`ironwood-museum.postsack` · Quest „Mamas Finale“, Schritt 3 von 3

_Mr. Teague bricht das Wachs mit dem Daumennagel. Es zerfällt zu Krümeln._

_Briefe, gebündelt mit Schnur. Rechnungen. Eine Postkarte mit einem Dampfschiff._

_Zuunterst ein Umschlag aus dickem, gelblichem Papier. Die Schrift ist klein und senkrecht, wie mit dem Lineal gezogen._

_„An Mr. A. Whitlock, Esq., New Orleans, Louisiana.“_

_In der Ecke, noch kleiner: „J. Hale.“_

_Die Klappe ist offen. Der Umschlag ist leer._

**Mr. Teague:** Sonderbar. Der Brief muss herausgefallen sein. Es gab damals eine Verordnung, bei Fieber …

_Ambrose steht so still, wie du ihn noch nie gesehen hast._

**Ambrose:** Er hat mir geschrieben.

**Ambrose:** Nachdem ich … Achtzehnhundertsechsundsechzig. Im Winter. Da war ich schon unterwegs.

**Ambrose:** Er hat geschrieben, und ich war schon unterwegs.

**Kim (Antwort):** „Was stand drin?“

**Ambrose:** Ich weiß es nicht.

_Er streckt die Hand nach dem Umschlag aus. Sie geht hindurch._

**Ambrose:** Ich weiß es nicht, Kim. Ich habe hundertsechzig Jahre lang geglaubt, er habe geschwiegen.

_Mr. Teague sieht dich über die Brille an._

**Mr. Teague:** Du kennst den Namen.

**Kim (Antwort):** „Ein bisschen.“

_Er nickt langsam._

**Mr. Teague:** Nimm ihn mit. Ein leerer Umschlag gehört niemandem. Vielleicht findest du, was hineingehört.

#### 395 · Heimatmuseum im alten Bahnhof

`ironwood-museum.vitrine` · Quest „Mamas Finale“, Schritt 3 von 3

→ Quest begonnen: „Erinnerung: Die Zeitung von 1858“

_In der Vitrine liegt eine vergilbte Zeitung, aufgeschlagen bei einem kleinen gedruckten Schachbrett._

**Ambrose:** Die habe ich gelesen. In der Nacht nach dem Match. Vier zu drei.

**Ambrose:** Ich wollte nie wieder eine Figur anrühren. Auf dem Tisch lag diese Zeitung, sechs Wochen alt, aus London.

**Ambrose:** Der junge Morphy gegen einen Mann namens Bird. Ich habe sie nachgespielt. Zwanzigmal. Bis es hell wurde.

**Kim (Antwort):** „Zeig sie mir.“\
(andere Antworten: „Nicht jetzt.“)

[Aufgaben von Ambrose (ironwood.erinnerungBird) – Ausgang: bestanden]

→ Quest „Erinnerung: Die Zeitung von 1858“: Schritt 1 von 1 erledigt

→ Quest abgeschlossen: „Erinnerung: Die Zeitung von 1858“

#### 396 · Heimatmuseum im alten Bahnhof

`ironwood-museum.vitrine` · Quest „Mamas Finale“, Schritt 3 von 3

_Ein Turm, zum Schlagen hingestellt, mitten ins Nichts. Dann die Dame, quer über das ganze Brett, an den Rand. Es dauert drei Züge, bis du siehst, warum._

**Ambrose:** Er verlor nie den Mut. Das habe ich in dieser Nacht gelernt. Nicht, wie man opfert. Wie man am nächsten Morgen aufsteht.

_Er sieht auf den Umschlag in deiner Hand._

**Ambrose:** Ich schon. Ich habe den Mut verloren. Einen Abend lang.

**Kim (Antwort):** „Nur einen?“

_Er antwortet nicht gleich._

**Ambrose:** Nein. Wenn ich ehrlich bin. Länger.

#### 397 · Heimatmuseum im alten Bahnhof

`ironwood-museum.fund_glasfunke` · Quest „Mamas Finale“, Schritt 3 von 3

_In einem Schaukasten funkelt ein kleiner Glassplitter, geschliffen wie ein Edelstein. Ein Funke aus Glas._

_Mr. Teague nickt: „Nimm ihn, er gehört niemandem.“_

**Ambrose:** Hübsch. Aber in meinem Kaffeehaus hätte er nicht gebrannt.

#### 398 · Heimatmuseum im alten Bahnhof

`ironwood-museum.teague` · Quest „Mamas Finale“, Schritt 3 von 3

_Über der Tür ein handgemaltes Schild: „Heimatmuseum. Geöffnet, wenn Mr. Teague da ist.“_

_Mr. Teague ist da. Achtzig, so dünn, dass die Weste um ihn herum steht._

**Mr. Teague:** Fahrpläne von 1890. Die Lampe eines Streckenwärters. Und eine Standuhr, die ich jeden Tag stelle.

**Mr. Teague:** Sie geht jeden Tag nach.

**Mr. Teague:** Und das dort in der Ecke ist mein Kummer.

#### 399 · Ironwood, Hauptstraße

`ironwood-aussen.steinbruch_sperre` · Quest „Mamas Finale“, Schritt 3 von 3

_Der Weg zum Alten Steinbruch führt durch einen dunklen Hohlweg. Du hältst die Laterne hoch und gehst los._

### Alter Steinbruch

#### 400 · Steinbruch, Grube

`steinbruch.finch_bauer_f` · Quest „Mamas Finale“, Schritt 3 von 3

_Am Fuß der Felswand ist ein Fink aus Kreide gemalt. In einer Ritze darunter steckt ein weißer Bauer aus Buchsbaum._

#### 401 · Steinbruch, Grube

`steinbruch.graffiti` · Quest „Mamas Finale“, Schritt 3 von 3

_Ein Wolf aus Sprühfarbe an der Felswand, daneben eine Krone. Jemand war hier, lange bevor du kamst._

#### 402 · Steinbruch, Grube

`steinbruch.bagger` · Quest „Mamas Finale“, Schritt 3 von 3

_Ein alter Bagger, die Schaufel im Schotter. Seit Jahren hat ihn niemand bewegt. Auf dem Sitz liegt ein Vogelnest._

#### 403 · Steinbruch, Grube

`steinbruch.finch_bauer_f` · Quest „Mamas Finale“, Schritt 3 von 3

_Am Fels ist nur noch der Fink aus Kreide._

### Ironwood

#### 404 · Ironwood, Hauptstraße

`ironwood-aussen.edna` · Quest „Mamas Finale“, Schritt 3 von 3

**Edna:** Laternen, Schrauben, Fahrradteile. Das hält.

[Laden: Ednas Eisenwaren]

#### 405 · Ironwood, Hauptstraße

`ironwood-aussen.kanalweg` · Quest „Mamas Finale“, Schritt 3 von 3

_Zurück zur Eisenbrücke und dem Kanalweg nach Riverton._

### Lockport

#### 406 · Schleusendorf

`lockport-aussen.kai` · Quest „Post für den Kapitän“, Schritt 1 von 1: Big Joes Brief zu Kapitän Ruben am Kai bringen.

_„Ein Brief? Für mich?“_

**Kim (Antwort):** Den Brief von Big Joe geben

_Ruben liest, dann lacht er so laut, dass die Möwen auffliegen._

_„Eine Fuhre Stahlträger. Solange Joe das Sagen hat, fährt die Belle wieder.“_

**Ambrose:** Ein Brief kann ein ganzes Schiff bewegen.

→ Quest begonnen: „Post für den Kapitän“

→ Quest „Post für den Kapitän“: Schritt 1 von 1 erledigt

→ Quest abgeschlossen: „Post für den Kapitän“

#### 407 · Schleusendorf

`lockport-aussen.lastkahn` · Quest „Mamas Finale“, Schritt 3 von 3: In der Kantine gegen Mama spielen.

_Ruben steht an der Gangway. „Die Belle legt gleich ab. 5 Münzen die Fahrt. Wohin?“_

**Kim (Antwort):** Nach Riverton (5 Münzen)\
(andere Antworten: Nach Ironwood (5 Münzen) · Hierbleiben)

_Der Kahn gleitet aus der Schleuse in den Kanal. Die Pappeln ziehen langsam vorbei._

#### 408 · Schleusendorf

`lockport-aussen.tafel_schleuse` · Quest „Mamas Finale“, Schritt 3 von 3

_Imogen läutet die Glocke am Wärterhaus, einmal, für dich._

_„Erst das Wasser, dann das Boot. Manchmal muss man warten, bis die Kammer voll ist.“_

#### 409 · Schleusendorf

`lockport-aussen.kai` · Quest „Mamas Finale“, Schritt 3 von 3

_„Die Belle hat wieder zu tun. Riverton, Lockport, Ironwood, wie früher.“_

#### 410 · Schleusendorf

`lockport-aussen.lastkahn` · Quest „Mamas Finale“, Schritt 3 von 3

(noch einmal angesprochen; hier nur, was neu ist)

**Kim (Antwort):** Nach Ironwood (5 Münzen)\
(andere Antworten: Nach Riverton (5 Münzen) · Hierbleiben)

_Der Kahn folgt dem Kanal nach Osten, bis die Schlote des Werks auftauchen._

### Ironwood

#### 411 · Ironwood, Hauptstraße

`ironwood-aussen.anleger` · Quest „Mamas Finale“, Schritt 3 von 3

_Am Anleger liegt die Ashford Belle, der Kahn aus Lockport. Kapitän Ruben rollt ein Seil auf._

_„Die Fahrt kostet 5 Münzen“, sagt Ruben._

#### 412 · Mamas altes Zimmer

`ironwood-mamas-zimmer.medaille` · Quest „Mamas Finale“, Schritt 3 von 3

_Die Silbermedaille dreht sich langsam am Band, wenn du vorbeigehst._

#### 413 · Mamas altes Zimmer

`ironwood-mamas-zimmer.partieformular` · Quest „Mamas Finale“, Schritt 3 von 3

_Unter dem Glas der Kreis um den dreiunddreißigsten Zug._

#### 414 · Mamas altes Zimmer

`ironwood-mamas-zimmer.oma_ruth` · Quest „Mamas Finale“, Schritt 3 von 3

**Oma Ruth:** Du bist schon wieder gewachsen. Das gehört verboten.

#### 415 · Mamas altes Zimmer

`ironwood-kantine.mama` · Quest „Mamas Finale“, Schritt 3 von 3

_Ihr fahrt am Samstag, mit dem Wagen, Juno auf der Rückbank. Mama redet die ganze Fahrt über das Wetter. An der Eisenbrücke wird sie still._

_Vor dem Haus mit dem grünen Geländer bleibt sie eine Minute sitzen, die Hände am Lenkrad._

_Was sie und Oma Ruth an der Tür sagen, weißt du nicht. Du bleibst im Wagen. Manche Dinge gehören einem nicht._

_In der Kantine bullert der Ofen. Sie sind alle da, Hank und Priya und ein Dutzend andere in Arbeitsjacken. Als Mama in der Tür steht, wird es still wie in einer Kirche._

_Big Joe steht auf. Er sagt nichts. Sie sagt nichts._

_Sie geht durch den ganzen langen Raum. Er kommt ihr drei Schritte entgegen und hält sie fest, als könnte sie zerbrechen._

**Big Joe:** Laurie.

**Mama:** Du hättest noch mal klingeln können.

**Big Joe:** Ich weiß.

**Mama:** Ich hätte aufgemacht.

**Big Joe:** Ich weiß. Jetzt.

_Am Stahlbrett. Mama hat Weiß. Sie sieht die Figuren an, eine nach der anderen, als müsste sie sich an ihre Namen erinnern._

**Kim (Antwort):** „Ich bin bereit.“\
(andere Antworten: „Gleich, Mama.“)

_Ihre Hand zittert, als sie den ersten Bauern anfasst. Damenbauer, zwei Felder. Dann der daneben._

**Big Joe:** Damengambit. Hat sie von mir.

[Partie gegen Mama – Ausgang: gewonnen]

→ Quest „Mamas Finale“: Schritt 3 von 3 erledigt

→ Quest abgeschlossen: „Mamas Finale“

#### 416 · Mamas altes Zimmer

`ironwood-kantine.mama` · keine laufende Quest

_Ihr habt zu Ende gespielt. Du hast gewonnen. Es ist das Einzige an diesem Tag, das nicht wichtig ist._

_Mama schlägt das blaue Heft auf und nimmt Hank einen Kugelschreiber aus der Brusttasche, ohne zu fragen._

_Unter „Finale. 12. Mai 2001“ schreibt sie einen einzigen Satz: „Es passiert jedem. Auch mir.“_

_Sie blättert um. Auf der nächsten Seite stehen drei Sätze in deiner Schrift._

**Mama:** Du schreibst ja in mein Heft.

**Kim (Antwort):** „Oma hat gesagt …“

**Mama:** Ich weiß, was Oma gesagt hat. Schreib weiter.

**Mama:** Und ab jetzt fahre ich mit. Zu den Turnieren. Jemand muss ja auf die Zeit achten.

**Mama:** Du spielst zu langsam.

**Ambrose:** Deine Mutter, wenn ich das sagen darf, spielt besser, als sie lügt.

_Juno klebt das Foto ins Tagebuch._

**Juno:** Mit Glitzer. Diesmal ja.

#### 417 · Werkskantine

`ironwood-kantine.big_joe` · Quest „Die Feier in der Kantine“, Schritt 1 von 1: Bei der Feier in der Kantine bleiben.

_Der Ofen in der Ecke knackt, an den langen Tischen klappern Figuren._

**Big Joe:** Heute wird gefeiert, Kumpel! Laurie ist zurück.

**Big Joe:** Bleibst du? Wird spät.

**Kim (Antwort):** „Ich bleibe.“\
(andere Antworten: „Ich gehe lieber früh.“)

_Jemand holt einen Schinken aus dem Kühlraum. Priya steigt auf einen Stuhl und hält eine Rede über Tragwerke. Alle klatschen._

_Hank, der sonst drei Wörter am Tag sagt, erzählt Mama, was aus jedem geworden ist. Der Reihe nach, mit Jahreszahlen._

**Big Joe:** Laurie kam mit neun zum ersten Mal her, an der Hand ihres Vaters. Hat das Stahlbrett angefasst und gesagt: Das ist kalt.

**Big Joe:** Den Pokal von 2001 hatte ich schon gekauft. Vorher. So sicher war ich.

**Mama:** Wo ist er?

**Big Joe:** Im Schrank. Bei mir zu Hause. Ich hab ihn nicht zurückgeben können. Und hinstellen auch nicht.

_Mama legt ihm die Hand auf den Arm. Mehr nicht._

_Du hast Mama noch nie so gesehen: rote Wangen, die Ärmel hochgeschoben, mitten unter Leuten, die sie Laurie nennen._

_Um eins singt jemand. Um halb zwei schläft Juno auf zwei Stühlen._

→ Quest begonnen: „Die Feier in der Kantine“

→ Quest „Die Feier in der Kantine“: Schritt 1 von 1 erledigt

→ Quest abgeschlossen: „Die Feier in der Kantine“

#### 418 · Umkleide

`ironwood-umkleide.schliessfach` · keine laufende Quest

_Das Schließfach steht offen und ist leer, bis auf einen vergessenen Helm._

#### 419 · Heimatmuseum im alten Bahnhof

`ironwood-museum.postsack` · keine laufende Quest

_Die Postsäcke liegen in der Ecke. Einer ist offen, Mr. Teague hat ihn sorgfältig wieder zugebunden._

#### 420 · Heimatmuseum im alten Bahnhof

`ironwood-museum.vitrine` · keine laufende Quest

_In der Vitrine liegt die Zeitung von 1858. Ambrose sieht sie nicht mehr an._

#### 421 · Heimatmuseum im alten Bahnhof

`ironwood-museum.fund_glasfunke` · keine laufende Quest

_Im Schaukasten liegen nur noch alte Fahrkarten._

#### 422 · Heimatmuseum im alten Bahnhof

`ironwood-museum.teague` · keine laufende Quest

**Mr. Teague:** Die Standuhr stelle ich jeden Tag. Sie geht jeden Tag nach.

### Lockport

#### 423 · Schleusendorf

`lockport-aussen.lastkahn` · keine laufende Quest

(noch einmal angesprochen; hier nur, was neu ist)

**Kim (Antwort):** Hierbleiben\
(andere Antworten: Nach Riverton (5 Münzen) · Nach Ironwood (5 Münzen))

_„Die Belle wartet nicht ewig. Aber heute schon.“_

### Weg nach Ironwood

#### 424 · Eisenbrücke

`ironwood-aussen.ankunft_zu_fuss` · keine laufende Quest

_Der Abhang von der Brücke führt hinunter nach Ironwood._

### Ironwood

#### 425 · Mamas altes Zimmer

`ironwood-mamas-zimmer.oma_ruth` · keine laufende Quest

**Oma Ruth:** Deine Mutter war das stillste Kind der Straße. Außer, wenn sie gewonnen hat.

#### 426 · Mamas altes Zimmer

`ironwood-kantine.mama` · keine laufende Quest

**Mama:** Damengambit. Ein Bauer weg, dafür Zeit und das Zentrum. Wer nur die Figuren zählt, versteht das nie.

_Sie legt dir eine Karte hin, an den Ecken abgegriffen: eine Waage mit vier Schalen._

**Mama:** Die lag in meinem alten Schachkasten bei Oma Ruth. Leg alles auf die Waage, nicht nur das Holz.

#### 427 · Werkskantine

`ironwood-kantine.big_joe` · keine laufende Quest

_Es riecht nach Kaffee, Eisen und nassen Jacken._

_Big Joe hat Ringe unter den Augen wie Kohlestriche. Er hält sich an seinem Kaffee fest._

**Big Joe:** Kumpel, ich hab drei Stunden geschlafen. Wenn ich heute verliere, liegt es an deiner Mutter und am Schinken.

**Kim (Antwort):** „Sie können es verschieben.“\
(andere Antworten: Nicken)

**Big Joe:** Verschieben! Hier wird nicht verschoben. Hier wird geschichtet.

_Die Nadel liegt auf dem Stahlbrett. Ein kleines Zahnrad aus dunklem Metall, mit einem Turm in der Mitte._

_Mama sitzt in der ersten Reihe. Zum ersten Mal sieht sie dir zu. Sie beugt sich vor und sagt zwei Wörter, so leise, dass nur du sie hörst._

**Mama:** Grundreihe. Immer.

**Big Joe:** Um die Nadel, Kumpel? Auf meinem Stahlbrett.

**Kim (Antwort):** „Ich bin bereit.“\
(andere Antworten: „Noch nicht.“)

[Partie gegen Big Joe – Ausgang: gewonnen]

→ Quest „Der Stahlwerker-Club“: Schritt 4 von 6 erledigt

#### 428 · Werkskantine

`ironwood-kantine.big_joe` · Quest „Der Stahlwerker-Club“, Schritt 5 von 6: Zum Werkstor gehen.

_Es riecht nach Kaffee, Eisen und nassen Jacken._

**Big Joe:** Ach, Kumpel. Ach, Kumpel.

_Er legt seinen König um, mit einem Finger. Auf dem Stahl klingt es leise._

_In der ersten Reihe hat Mama beide Hände vor dem Mund._

**Big Joe:** Grundreihe. Du hast es dem Kumpel gesagt, Laurie. Dreißig Jahre, und du kennst mich immer noch.

_Er steckt dir das Zahnrad an die Jacke, neben die anderen Nadeln._

**Big Joe:** Revanche, wenn ich ausgeschlafen bin!

_Die Kantine brüllt._

_Auf dem Weg hinaus, im Lärm, sagt Ambrose etwas. Du verstehst es fast nicht._

**Ambrose:** Es war schön. Und es hat gestimmt. Beides.

#### 429 · Ironwood, Hauptstraße

`ironwood-aussen.victor` · Quest „Der Stahlwerker-Club“, Schritt 5 von 6

_Es dauert neun Tage. Dann ruft Big Joe an. Nicht dich. Mama. Sie hört nur zu und nimmt den Mantel._

_Am Werkstor hängt ein neues Schild, weiß und glänzend: „Perfect Move Trainingszentrum Ironwood. Eröffnung im Januar.“_

_Darunter, kleiner: „In den Räumen der ehemaligen Werkskantine.“_

**Graham Hale:** Der Club bleibt selbstverständlich. An den neuen Tischen, zu denselben Zeiten, kostenlos.

**Graham Hale:** Mit einem Trainer, der nie müde wird.

_Er glaubt es. Das ist das Schlimme. Er hält es wirklich für ein Geschenk._

_Big Joe kommt heraus. Er trägt einen Karton vor dem Bauch, oben schauen die Pokale heraus und klirren bei jedem Schritt._

_Er sieht Graham Hale nicht an. Hinter ihm tragen Hank und Priya das Stahlbrett, zu zweit._

_Neben seinem Vater steht Victor, in Weiß, das Tablet unter dem Arm. Er sieht Big Joe nach, den großen Händen, die den Karton halten, als wäre er aus Glas._

**Victor Hale:** Vater. Vielleicht …

_Graham Hale dreht sich zu ihm um. Freundlich. Fragend._

**Victor Hale:** Nichts.

_Mama geht über den Platz, an dem schwarzen Wagen vorbei, und nimmt Big Joe den Karton ab. Zusammen heben sie ihn in den Lieferwagen._

_Es beginnt zu schneien. Die ersten Flocken des Jahres bleiben auf dem Schild liegen und auf dem Dach des schwarzen Wagens._

→ Quest „Der Stahlwerker-Club“: Schritt 5 von 6 erledigt

#### 430 · Ironwood, Hauptstraße

`ironwood-aussen.graham_hale` · Quest „Der Stahlwerker-Club“, Schritt 6 von 6: Am Abend zur Bushaltestelle an der Brücke gehen.

_Graham Hale telefoniert am Werkstor. „Ja, unterschrieben. Ja, ab Montag.“_

#### 431 · Ironwood, Hauptstraße

`ironwood-aussen.victor` · Quest „Der Stahlwerker-Club“, Schritt 6 von 6

_An der alten Stahlbrücke hinter dem Werkstor. Victor kommt allein, ohne Tablet. Er weiß nicht, wohin mit den Händen._

**Victor Hale:** Kim.

**Victor Hale:** Du hast vier.

**Kim (Antwort):** „Ja.“

**Victor Hale:** Gegen den habe ich einmal gespielt. Kowalski. Bei einem Schaukampf.

**Victor Hale:** Er hat mir danach einen Kakao ausgegeben. Ich wusste nicht, was ich damit machen soll. Ich trinke keinen Kakao.

_Er hält dir eine Karte hin, weiß, mit silberner Schrift: „Jugendturnier der Perfect Move Akademie. Silicon Bay.“_

**Victor Hale:** Komm. Dann siehst du, wogegen du spielst.

_Er geht nicht. Er sieht auf das Geländer zwischen euch. Mehr als drei Sekunden._

**Victor Hale:** Und vielleicht sagst du mir dann, ob ich auf der richtigen Seite stehe.

_Er steigt in den Bus an der Schnellstraße, ohne sich umzusehen. Die Rücklichter werden kleiner im Schneetreiben._

**Ambrose:** Ein Hale, der fragt. Das ist neu.

_Auf dem ersten Pfosten des Geländers, klein und sauber: J. H._

_Ambrose legt die Hand darauf. Diesmal lässt er sie dort._

**Ambrose:** Er hat überall unterschrieben. Auf jeder Niete. Was für ein unerträglicher, gewissenhafter Mensch.

_Seine Stimme bricht._

**Ambrose:** Und er hat mir geschrieben.

_Juno kommt die Brücke herauf, das Tagebuch unter der Jacke._

**Juno:** Was hat er gewollt?

**Kim (Antwort):** Ihr die Karte zeigen

_Sie liest. Sie schlägt das Tagebuch auf und schreibt quer über die Seite: „Silicon Bay“._

_Nach kurzem Überlegen ein Fragezeichen dahinter. Mit Glitzer._

→ Quest „Der Stahlwerker-Club“: Schritt 6 von 6 erledigt

→ Quest abgeschlossen: „Der Stahlwerker-Club“

#### 432 · Heimatmuseum im alten Bahnhof

`ironwood-museum.teague` · keine laufende Quest

**Mr. Teague:** Ein Siegel bricht man nicht. Man löst es.

#### 433 · Ironwood, Hauptstraße

`ironwood-aussen.bus_silicon_bay` · keine laufende Quest

_Im Dezember, auf der Treppe vor der Schule, fragt Juno zum dritten Mal, was Victor auf der Brücke wollte._

_Und warum du danach so lange auf ein Geländer gestarrt hast._

**Kim (Antwort):** „In dem Brett wohnt jemand.“

_Sie lacht nicht. Sie blättert im Tagebuch weit zurück, bis in den September, und dreht es zu dir um._

_In rosa Tinte, zwischen einer verlorenen Partie und einem Sticker: „Kim redet mit dem Brett. Nicht fragen. Noch nicht.“_

**Juno:** Ich hab gewartet. Wie heißt er? Ist er nett? Kann er mich sehen? Findet er meine Züge schlimm?

**Ambrose:** Sag ihr, dass ihr Turm in Cedar Creek einen ehrenvollen Tod gestorben ist.

_Sie strahlt eine Woche lang._

_Jetzt ist Januar. An der Haltestelle an der Schnellstraße liegt der Schnee fest. Der Bus nach Silicon Bay hat den Motor an._

**Mama:** Ich hab Nachtschicht. Die ganze Woche. Sonst käme ich mit. Juno, du passt auf.

**Juno:** Ich passe immer auf.

**Mama:** Du verlierst deine Mütze, wenn du sie aufhast.

**Juno:** Aber ich merke es.

_Mama zieht dich an sich, kurz und fest. Seit Ironwood tut sie das öfter._

**Mama:** Guck dir alles an. Und glaub nicht alles, was glänzt.

**Mama:** Ich hab mal ein Turnier in so einem Glaskasten gespielt. Man friert darin, und man weiß nicht, warum.

_Juno drückt dir eine kleine Holzkiste mit Stickern in die Hand. Auf dem Deckel in rosa Buchstaben: „Clubtagebuch, Außenstelle.“_

_Darin ein Brett zum Aufklappen, mit Magnetfiguren._

**Juno:** Ich kann nur bis Mittwoch mit. Dann ist Schule.

**Juno:** Damit du nicht vergisst, wie man verliert. Spiel mit Ambrose. Oder mit mir, wenn ich anrufe.

**Ambrose:** Ein Brett für die Tasche. Meines ist schwerer. Und gesprächiger.

**Ambrose:** Eine Stadt aus Glas. Wie man wohl darin Schach spielt?

**Kim (Antwort):** Einsteigen\
(andere Antworten: Noch nicht)

_Der Bus fährt los, die Schnellstraße entlang, bis zu einer Raststätte vor der Stadt aus Glas._

#### 434 · Ironwood, Hauptstraße

`ironwood-aussen.bus_silicon_bay` · keine laufende Quest

_Der Fernbus nach Silicon Bay hält an der Schnellstraße. Er fährt bis zur Raststätte vor der Stadt._

**Kim (Antwort):** Einsteigen\
(andere Antworten: Noch nicht)

_Der Bus fährt los, die Schnellstraße entlang, bis zu einer Raststätte vor der Stadt aus Glas._

#### 435 · Mamas altes Zimmer

`ironwood-kantine.mama` · keine laufende Quest

**Mama:** Grundreihe. Immer die Grundreihe. Sag das Joe nicht.

#### 436 · Werkskantine

`ironwood-kantine.pokalregal` · keine laufende Quest

_Das Regal ist leer. Die Pokale stecken im Karton an der Tür. Nur das Messingschild hängt noch: 2001._

#### 437 · Werkskantine

`ironwood-kantine.big_joe` · keine laufende Quest

_Über der Essensausgabe hängt das weiße Logo. An der Tür steht der Karton mit den Pokalen._

**Big Joe:** Eine Fesselung ist wie ein Kranhaken: Was dranhängt, kann nicht weg.

**Kim (Antwort):** „Revanche um eine bessere Nadel?“\
(andere Antworten: „Bis nachher, Big Joe.“)

**Big Joe:** Immer, Kumpel.

[Partie gegen Big Joe, erneut – Ausgang: gewonnen]

#### 438 · Werkskantine

`ironwood-kantine.priya` · keine laufende Quest

**Priya:** Ein Spieß ist eine Fesselung von hinten. Statik!

#### 439 · Mamas altes Zimmer

`ironwood-mamas-zimmer.oma_ruth` · keine laufende Quest

**Oma Ruth:** Ich hab ihr Zimmer so gelassen, falls sie mal wieder schlafen will.

#### 440 · Mamas altes Zimmer

`ironwood-kantine.mama` · keine laufende Quest

**Mama:** Hier stehen jetzt Bildschirme. Ich komme trotzdem her. Wegen der Leute.

#### 441 · Werkskantine

`ironwood-kantine.big_joe` · keine laufende Quest

(noch einmal angesprochen; hier nur, was neu ist)

**Big Joe:** Kumpel, die Kantine war dreißig Jahre unser Wohnzimmer.

**Kim (Antwort):** „Bis nachher, Big Joe.“\
(andere Antworten: „Revanche um eine bessere Nadel?“)

#### 442 · Werkskantine

`ironwood-kantine.big_joe` · keine laufende Quest

(noch einmal angesprochen; hier nur, was neu ist)

**Big Joe:** Laurie spielt wieder. Ich hätte nicht gedacht, dass ich das noch erlebe.

**Kim (Antwort):** „Bis nachher, Big Joe.“\
(andere Antworten: „Revanche um eine bessere Nadel?“)

#### 443 · Heimatmuseum im alten Bahnhof

`ironwood-museum.teague` · keine laufende Quest

**Mr. Teague:** Joe spielt immer das Damengambit. Seit vierzig Jahren. Sag ihm nicht, dass ich das verraten habe.

#### 444 · Mamas altes Zimmer

`ironwood-kantine.mama` · keine laufende Quest

**Mama:** Joe hat die Pokale in seiner Garage. Wir suchen einen neuen Raum. Wir finden einen.

### Schnellstraße nach Silicon Bay

#### 445 · Raststätte an der Schnellstraße

`weg-ironwood-silicon.tafel` · Quest „Die Stadt aus Glas“, Schritt 1 von 7: Von der Raststätte über die Glasbrücke gehen.

→ Quest begonnen: „Die Stadt aus Glas“

→ Quest begonnen: „Die Tafel an der Raststätte“

_Am Kaffeeautomaten hängt eine Blechtafel mit Magnetfiguren, wie am Ortsausgang von Maple Falls: „Wer hier hängt, verliert.“_

**Kim (Antwort):** Die Aufgaben lösen\
(andere Antworten: Weitergehen)

[Aufgaben von Die Rätseltafel (wegIronwoodSilicon.tafel) – Ausgang: bestanden]

→ Quest „Die Tafel an der Raststätte“: Schritt 1 von 1 erledigt

→ Quest abgeschlossen: „Die Tafel an der Raststätte“

#### 446 · Raststätte an der Schnellstraße

`weg-ironwood-silicon.tafel` · Quest „Die Stadt aus Glas“, Schritt 1 von 7

_Auf der Tafel am Automaten steht in Filzstift: „Gelöst. Kaffee ist trotzdem kaputt.“_

#### 447 · Raststätte an der Schnellstraße

`weg-ironwood-silicon.fund_anstecker` · Quest „Die Stadt aus Glas“, Schritt 1 von 7

_Auf dem Boden glänzt ein Anstecker: „ZERO – Spiel wie die Zukunft.“_

**Juno:** Gratis. Natürlich.

#### 448 · Raststätte an der Schnellstraße

`weg-ironwood-silicon.kreide2` · Quest „Die Stadt aus Glas“, Schritt 1 von 7

_An der Wand des Containers hinter dem Rasthaus ist ein Springer aus Kreide gemalt._

_Darunter, ganz klein: „K2. Wer das Wort kennt, spielt mit.“_

**Ambrose:** Ein Club ohne Haus. Die besten Clubs, die ich kannte, hatten nur einen Tisch und einen Ofen.

#### 449 · Raststätte an der Schnellstraße

`weg-ironwood-silicon.finch_bauer_b` · Quest „Die Stadt aus Glas“, Schritt 1 von 7

_Am Rand des Blumenkübels klebt ein kleiner Fink aus Blech._

_Zwischen den Stielen steckt ein weißer Bauer aus Buchsbaum. Unter seinem Fuß ist ein Feld eingebrannt._

#### 450 · Raststätte an der Schnellstraße

`weg-ironwood-silicon.seite04` · Quest „Die Stadt aus Glas“, Schritt 1 von 7

_Unter der Rätseltafel klemmt ein loses Blatt, vom Wind hergeweht. Darauf eine gezeichnete Stellung._

**Ambrose:** Jemand hat hier in der Pause gerechnet. Heb es auf.

#### 451 · Raststätte an der Schnellstraße

`weg-ironwood-silicon.kowalczyk` · Quest „Die Stadt aus Glas“, Schritt 1 von 7

_Eine Fernfahrerin mit Armen wie Big Joe steht am Kaffeeautomaten und nickt zur Blechtafel mit den Fallen hinüber._

**Mrs. Kowalczyk:** Erst die Figuren raus. Dann die Dame.

**Mrs. Kowalczyk:** Ich fahr seit dreißig Jahren. Erst laden, dann fahren. Ist dasselbe.

_Sie heißt Kowalczyk. Du fragst nicht, ob sie mit jemandem verwandt ist._

#### 452 · Raststätte an der Schnellstraße

`weg-ironwood-silicon.glasbruecke` · Quest „Die Stadt aus Glas“, Schritt 1 von 7

_Die Brücke ist aus Glas. Der Boden, das Geländer, alles. Zwölf Meter tiefer fließen die Lichter der Autobahn._

_Juno geht auf Zehenspitzen und hält sich an dir fest._

**Juno:** Woher weißt du, dass das trägt?

**Kim (Antwort):** „Das trägt.“\
(andere Antworten: „Ich weiß es nicht.“)

_Du denkst an eine andere Brücke, aus schwarzem Eisen, mit Tausenden von Nieten, jede signiert. An der hast du nicht gezweifelt._

#### 453 · Glasbrücke

`weg-ironwood-silicon.fund_ohrstoepsel` · Quest „Die Stadt aus Glas“, Schritt 2 von 7: In Silicon Bay ankommen.

→ Quest „Die Stadt aus Glas“: Schritt 1 von 7 erledigt

_In der Mitte der Brücke liegt etwas auf dem Glas. Klein, hautfarben, wie ein Kieselstein. Ein Ohrstöpsel._

_Er ist schwerer, als er sein sollte. An einer Seite ist ein winziges Loch, darin glänzt etwas Metallenes._

**Juno:** Hat jemand verloren.

_Du steckst ihn ein. Du hast dir angewöhnt, Dinge einzustecken._

#### 454 · Glasbrücke

`weg-ironwood-silicon.ereignis_stream` · Quest „Die Stadt aus Glas“, Schritt 2 von 7

→ Quest begonnen: „Live auf der Glasbrücke“

_Auf der Aussichtsplattform steht ein Ringlicht, daneben ein Klapptisch mit Laptop. Eine junge Frau mit grüner Mütze spricht in eine Kamera._

**Kiki Blitz:** Achtzigtausend Leute schauen zu, und da kommt jemand über die Brücke!

**Kiki Blitz:** Kiki Blitz. Ich spiele live, und heute wählt der Chat meine Züge. Drei Vorschläge, einer davon ist Unsinn.

**Kiki Blitz:** Der Chat liebt Fallen. Erst ein paar zum Aufwärmen, dann spielen wir live. Machst du mit?

**Ambrose:** Fallen erkennt man, bevor man hineintritt, Kim.

**Kim (Antwort):** „Ich spiele mit.“\
(andere Antworten: „Nicht jetzt.“)

[Aufgaben von Kiki Blitz (wegIronwoodSilicon.stream) – Ausgang: bestanden]

→ Quest „Live auf der Glasbrücke“: Schritt 1 von 3 erledigt

#### 455 · Glasbrücke

`weg-ironwood-silicon.ereignis_stream` · Quest „Die Stadt aus Glas“, Schritt 2 von 7

**Kiki Blitz:** Aufgewärmt? Jetzt live. Weiß hat die Dame schon draußen, und der Chat stimmt über meinen Zug ab.

**Ambrose:** Einer der drei Vorschläge ist eine Falle, Kim. Nicht für dich. Für sie.

**Kim (Antwort):** „Los geht's.“\
(andere Antworten: „Gleich.“)

[Partie gegen Kiki Blitz – Ausgang: gewonnen]

→ Quest „Live auf der Glasbrücke“: Schritt 2 von 3 erledigt

#### 456 · Glasbrücke

`weg-ironwood-silicon.werbetafel_zero` · Quest „Die Stadt aus Glas“, Schritt 2 von 7

_Auf der Werbetafel am Stadtrand dreht sich ein gläserner König, dann erscheint die Schrift: „ZERO. Nie wieder Fehler.“_

**Ambrose:** Ein König aus Glas, der sich dreht. Nie wieder Fehler.

**Ambrose:** Ich kannte keinen Spieler, der das versprechen konnte. Nicht einmal Morphy.

#### 457 · Glasbrücke

`weg-ironwood-silicon.schild_smart_city` · Quest „Die Stadt aus Glas“, Schritt 2 von 7

_Am Fuß der Rampe steht ein Schild: „Ab hier: Smart City. Bitte Sensoren nicht verdecken.“_

**Ambrose:** Welche Sensoren? Ich sehe nur Glas. Schönes Glas, das gebe ich zu.

#### 458 · Glasbrücke

`weg-ironwood-silicon.joggerin` · Quest „Die Stadt aus Glas“, Schritt 2 von 7

_Auf der Glasbrücke läuft eine Frau auf der Stelle. Ihre Uhr piept ohne Pause, ihr Blick fällt auf das Brett unter deinem Arm._

**Die Joggerin:** Schach? Klar. Drei Minuten, plus zwei Sekunden je Zug. Mein Puls bleibt oben.

**Juno:** Sie ist schneller als du. Aber du bist schlauer. Vielleicht.

**Die Joggerin:** Eine Stellung, zehn Züge, die Uhr läuft. Bereit?

**Ambrose:** Sie läuft schnell und denkt schnell. Lass sie laufen, Kim. Denk du.

**Kim (Antwort):** „Los.“\
(andere Antworten: „Nicht jetzt.“)

[Stellungsduell gegen Die Joggerin – Ausgang: gewonnen]

#### 459 · Glasbrücke

`weg-ironwood-silicon.joggerin` · Quest „Die Stadt aus Glas“, Schritt 2 von 7

**Die Joggerin:** Du hast mich ausgebremst. Respekt.

**Kim (Antwort):** „Noch eine Runde?“\
(andere Antworten: „Bis bald.“)

[Stellungsduell gegen Die Joggerin, erneut – Ausgang: gewonnen]

#### 460 · Glasbrücke

`weg-ironwood-silicon.kiki` · Quest „Live auf der Glasbrücke“, Schritt 3 von 3: Nach dem Stream mit Kiki reden.

**Kiki Blitz:** Der Chat hat mich reingelegt. Und du hast es gesehen!

_Der Chat jubelt. Dann friert das Bild auf dem Laptop ein. Am Funkmast neben der Brücke blinkt eine rote Leuchte: „Testfeld Signal“._

**Kiki Blitz:** Das ist jedes Mal so, wenn die da testen. Perfect Move sponsert mich. Ich frage lieber nicht, was sie testen.

**Ambrose:** Ein Mast, der blinkt, wenn Bilder abreißen. Merk ihn dir.

**Kiki Blitz:** Hier, ein Foto vom Ringlicht, signiert. Der Chat mochte dich.

→ Quest „Live auf der Glasbrücke“: Schritt 3 von 3 erledigt

→ Quest abgeschlossen: „Live auf der Glasbrücke“

#### 461 · Raststätte an der Schnellstraße

`weg-ironwood-silicon.fund_anstecker` · Quest „Die Stadt aus Glas“, Schritt 2 von 7: In Silicon Bay ankommen.

_Hier lag der Anstecker. Jetzt nur noch Kaffeeflecken._

#### 462 · Raststätte an der Schnellstraße

`weg-ironwood-silicon.kreide2` · Quest „Die Stadt aus Glas“, Schritt 2 von 7

_Der Kreidespringer am Container ist ein wenig verwischt. Das Wort darunter auch._

#### 463 · Raststätte an der Schnellstraße

`weg-ironwood-silicon.finch_bauer_b` · Quest „Die Stadt aus Glas“, Schritt 2 von 7

_Im Blumenkübel wachsen nur noch Blumen._

#### 464 · Raststätte an der Schnellstraße

`weg-ironwood-silicon.seite04` · Quest „Die Stadt aus Glas“, Schritt 2 von 7

_Hier lag die Seite. Der Wind hat nichts mehr dagelassen._

#### 465 · Raststätte an der Schnellstraße

`weg-ironwood-silicon.kowalczyk` · Quest „Die Stadt aus Glas“, Schritt 2 von 7

**Mrs. Kowalczyk:** Ich fahr gleich weiter. Neun Stunden bis zur Küste.

#### 466 · Raststätte an der Schnellstraße

`weg-ironwood-silicon.zurueck_ironwood` · Quest „Die Stadt aus Glas“, Schritt 2 von 7

_An der Raststätte wartet der Bus zurück nach Ironwood. Der Fahrer winkt._

#### 467 · Raststätte an der Schnellstraße

`weg-ironwood-silicon.kowalczyk` · Quest „Die Stadt aus Glas“, Schritt 2 von 7

**Mrs. Kowalczyk:** Silicon Bay? Da parkt keiner. Da fährt alles von allein.

#### 468 · Raststätte an der Schnellstraße

`weg-ironwood-silicon.glasbruecke` · Quest „Die Stadt aus Glas“, Schritt 2 von 7

_Glas unter den Schuhen. Zwölf Meter tiefer die Autobahn, ein Fluss aus weißen und roten Lichtern._

#### 469 · Glasbrücke

`weg-ironwood-silicon.fund_ohrstoepsel` · Quest „Die Stadt aus Glas“, Schritt 2 von 7

_Auf dem Glas ist nichts mehr. Unter dir fließen die Lichter der Autobahn._

#### 470 · Glasbrücke

`weg-ironwood-silicon.ereignis_stream` · Quest „Die Stadt aus Glas“, Schritt 2 von 7

**Kiki Blitz:** Der Chat fragt nach dir. Ich sage, du bist auf Reisen.

#### 471 · Glasbrücke

`weg-ironwood-silicon.joggerin` · Quest „Die Stadt aus Glas“, Schritt 2 von 7

**Die Joggerin:** Meine Uhr sagt, ich soll mich ausruhen. Deine sagt, du hast gewonnen.

**Kim (Antwort):** „Bis bald.“\
(andere Antworten: „Noch eine Runde?“)

#### 472 · Glasbrücke

`weg-ironwood-silicon.kiki` · Quest „Die Stadt aus Glas“, Schritt 2 von 7

**Kiki Blitz:** Spielst du bei der Meisterschaft? Vielleicht sitze ich im Publikum.

#### 473 · Glasbrücke

`weg-ironwood-silicon.joggerin` · Quest „Die Stadt aus Glas“, Schritt 2 von 7

**Die Joggerin:** Nächstes Mal lauf ich vorher weniger.

**Kim (Antwort):** „Bis bald.“\
(andere Antworten: „Noch eine Runde?“)

#### 474 · Glasbrücke

`weg-ironwood-silicon.kiki` · Quest „Die Stadt aus Glas“, Schritt 2 von 7

**Kiki Blitz:** Das Signal bricht immer noch ab. Ich hab mich fast daran gewöhnt.

### Riverton

#### 475 · Riverton, am Fluss

`riverton-aussen.anleger_schild` · Quest „Die Stadt aus Glas“, Schritt 2 von 7

_Am Anleger hängt ein Blechschild: „Lastkahn Ashford Belle: Riverton – Lockport – Ironwood. Fahrten nach Ansage.“_

_Die Belle liegt am Anleger, Kapitän Ruben winkt vom Deck._

_„Die Fahrt kostet 5 Münzen“, sagt Ruben._

#### 476 · Riverton, am Fluss

`riverton-aussen.albescu` · Quest „Die Stadt aus Glas“, Schritt 2 von 7

_Vor der Werkstatt steht ein Rad auf dem Kopf. Mrs. Albescu sitzt auf einem Hocker davor und dreht an der Kette._

**Mrs. Albescu:** Dafür brauche ich keine Knie. Nur Zeit.

### Weg nach Riverton

#### 477 · Am Bahndamm

`weg-cedar-riverton.durchlass` · Quest „Die Stadt aus Glas“, Schritt 2 von 7

_Die Laterne leuchtet in den Durchlass. Eine Kröte hüpft davon, das war wohl das, was hier wohnt._

_Auf einem Mauervorsprung steht eine verbeulte Thermoskanne mit Namen: „G. Tolliver“._

### Cedar Creek

#### 478 · Cedar Creek, Ortskern

`cedar-creek-aussen.bus_zurueck` · Quest „Die Stadt aus Glas“, Schritt 2 von 7

(noch einmal angesprochen; hier nur, was neu ist)

**Kim (Antwort):** Mit dem Busfahrer reden\
(andere Antworten: Nach Maple Falls fahren · Noch bleiben)

_Der neue Fahrplan ist überklebt. Darauf steht mit Kugelschreiber: „Fährt doch.“_

**Mr. Kettering:** Einunddreißig Jahre. Und ein paar Monate. Wer zählt mit?

**Ambrose:** Ein Mann, der seine Strecke nicht hergibt. Zu meiner Zeit hätte er Postkutschen gefahren.

_Der Bus nach Maple Falls. Die Fenster sind golden vom Abendlicht._

**Kim (Antwort):** Noch bleiben\
(andere Antworten: Nach Maple Falls fahren · Mit dem Busfahrer reden)

#### 479 · Cedar Creek, Ortskern

`cedar-creek-aussen.zwillinge` · Quest „Die Stadt aus Glas“, Schritt 2 von 7

_Die Treppe ist leer. Drinnen hört man zwei Stimmen flüstern._

### Maple Falls

#### 480 · Maple Falls, Hauptstraße

`maple-falls-aussen.calloway` · Quest „Die Stadt aus Glas“, Schritt 2 von 7

_Zwischen den beiden Stühlen steht ein kleiner Tisch, darauf ein Schachbrett. Owen erklärt. Mrs. Calloway runzelt die Stirn._

**Mrs. Calloway:** Der Springer, sagt der Junge, springt immer auf die andere Farbe. Stimmt das?

**Kim (Antwort):** „Das stimmt. Immer.“\
(andere Antworten: „Wer hat ihm das beigebracht?“)

**Mrs. Calloway:** Dann hat er es von Lily. Und Lily hat es von dir. So geht das hier.

**Mrs. Calloway:** Seit vierundsechzig wohne ich neben einem Schachbrett. Jetzt fange ich an.

**Mrs. Calloway:** Margaret hätte gelacht. Sie hat oft gelacht. Das weiß kaum einer.

**Ambrose:** Das wusste ich nicht.

#### 481 · Maple Falls, Hauptstraße

`maple-falls-aussen.calloway` · Quest „Die Stadt aus Glas“, Schritt 2 von 7

(noch einmal angesprochen; hier nur, was neu ist)

**Kim (Antwort):** „Wer hat ihm das beigebracht?“\
(andere Antworten: „Das stimmt. Immer.“)

**Mrs. Calloway:** Lily von nebenan. Und die sagt, sie hat es von dir.

**Mrs. Calloway:** Seit vierundsechzig wohne ich neben einem Schachbrett. Jetzt fange ich an.

**Mrs. Calloway:** Margaret hätte gelacht. Sie hat oft gelacht. Das weiß kaum einer.

**Ambrose:** Das wusste ich nicht.

#### 482 · Clubraum der Maple Falls High

`ansehen-maple-falls.bildschirm_pult` · Quest „Die Stadt aus Glas“, Schritt 2 von 7

_Jemand hat den Bildschirm wieder eingeschaltet. Die Figuren ziehen von selbst. Niemand sieht hin. Fast niemand._

#### 483 · Clubraum der Maple Falls High

`maple-falls-clubraum.coach` · Quest „Die Stadt aus Glas“, Schritt 2 von 7

**Coach Delgado:** Cedar Creek hast du hinter dir. In der Vitrine ist noch Platz für einen Pokal. Ich sag's nur.

**Kim (Antwort):** „Bis morgen, Coach.“\
(andere Antworten: „Noch eine Partie um die Nadel.“)

#### 484 · Clubraum der Maple Falls High

`maple-falls-aussen.carla` · Quest „Die Stadt aus Glas“, Schritt 2 von 7

_Carla sitzt am Brett mit dem Radiergummi. Vor ihr zwei Kinder aus der Sechsten._

**Carla:** Wer greift an? Wer verteidigt? Erst zählen, dann schlagen.

_Sie sieht dich und zuckt die Schultern._

**Carla:** Delgado hat gefragt. Und ich hatte samstags eh nichts vor.

**Kim (Antwort):** „Schön, dass du da bist.“\
(andere Antworten: „Der Radiergummi hat schon zwei Partien gewonnen.“)

**Carla:** Sag Juno nichts. Sonst steht es morgen im Tagebuch. Mit Glitzer.

**Ambrose:** Sie kommt zurück. So fängt es an.

#### 485 · Maple Falls, Hauptstraße

`maple-falls-aussen.juno` · Quest „Die Stadt aus Glas“, Schritt 2 von 7

**Juno:** Cedar Creek hat im Tagebuch vier Seiten bekommen. Und einen Fettfleck von den Keksen.

#### 486 · Falls Diner

`maple-falls-diner.hector` · Quest „Die Stadt aus Glas“, Schritt 2 von 7

_Hector wischt die Theke. Er wischt sie schon lange, an derselben Stelle._

**Hector:** Der Mann im Anzug war wieder da. Diesmal hat er nicht nach der Schule gefragt.

**Hector:** Er wollte wissen, was ich an Pacht zahle. Und wie lange der Vertrag noch läuft.

**Kim (Antwort):** „Was haben Sie gesagt?“\
(andere Antworten: „Er kann Ihnen nichts tun.“)

**Hector:** Die Wahrheit. Dass ich's nicht weiß. Den Vertrag hat mein Vater gemacht.

_Er hängt das Geschirrtuch über die Schulter. Das gerahmte Set an der Wand hängt ein bisschen schief._

**Hector:** Bestellung läuft.

#### 487 · Wohnzimmer

`maple-falls-wohnzimmer.mutter` · Quest „Die Stadt aus Glas“, Schritt 2 von 7

**Mama:** Nachtschicht. Aber wenn du anrufst, gehe ich ran. Immer.

#### 488 · Dein Zimmer

`maple-falls-dachboden.ambrose` · Quest „Die Stadt aus Glas“, Schritt 2 von 7

**Ambrose:** Der Weg führt weiter, aber nicht heute. Ruh dich aus.

**Kim (Antwort):** „Erzähl mir von früher.“\
(andere Antworten: „Bis morgen.“)

**Ambrose:** Der junge Morphy war der Beste von uns allen. Ich habe ihn nie geschlagen. Nie.

#### 489 · Wohnzimmer

`maple-falls-wohnzimmer.mutter` · Quest „Die Stadt aus Glas“, Schritt 2 von 7

**Mama:** Juno schreibt mir jeden Abend, ob du gegessen hast. Ich glaube ihr nicht immer.

### Landstraße nach Cedar Creek

#### 490 · Landstraße

`weg-maple-cedar.apfelstand` · Quest „Die Stadt aus Glas“, Schritt 2 von 7

_Die Kasse stimmt, der Zettel hängt noch. Daneben ein Zeitungsausschnitt in einer Klarsichthülle._

_Ein Foto von der Joggerin, die Arme oben, hinter ihr ein Zielband. Sie selbst ist heute nicht da._

#### 491 · Landstraße

`weg-maple-cedar.ada` · Quest „Die Stadt aus Glas“, Schritt 2 von 7

**Ada:** Die Kasse stimmt. Ich lass den Zettel trotzdem hängen. Man weiß ja nie.

### Cedar Creek

#### 492 · Drechslerei Dunmore

`cedar-creek-drechslerei.dunmore` · Quest „Die Stadt aus Glas“, Schritt 2 von 7

_Auf der Werkbank steht ein zweiter Satz, halb fertig. Die Springer sind diesmal zuerst gemacht._

**Mr. Dunmore:** Für jemanden weiter flussab. Einer, dem sie den Pavillon genommen haben. Er spielt jetzt unter einer Brücke.

**Mr. Dunmore:** Dach hat er, sagt er. Wände nicht. Figuren braucht er trotzdem.

#### 493 · Stadtbibliothek

`cedar-creek-bibliothek.okafor` · Quest „Die Stadt aus Glas“, Schritt 2 von 7

**Mrs. Okafor:** Juno schickt mir Bilder aus ihrem Tagebuch. Vier Nadeln. Ich habe es mir aufgeschrieben.

**Kim (Antwort):** „Bis bald, Mrs. Okafor.“\
(andere Antworten: „Noch eine Partie um die Nadel.“)

#### 494 · Stadtbibliothek

`cedar-creek-bibliothek.zwillinge` · Quest „Die Stadt aus Glas“, Schritt 2 von 7

_Jonah sitzt im Club am Brett, gegen Dex. Ivy sitzt daneben und liest._

**Ivy:** Wir streiten nicht mehr. Es ist furchtbar.

#### 495 · Stadtbibliothek

`cedar-creek-bibliothek.okafor` · Quest „Die Stadt aus Glas“, Schritt 2 von 7

**Mrs. Okafor:** Ein Herr mit zwei Telefonen war im Rathaus. Hier steht noch kein Bildschirm. Ich habe Geduld, und ich habe den Schlüssel.

**Kim (Antwort):** „Bis bald, Mrs. Okafor.“\
(andere Antworten: „Noch eine Partie um die Nadel.“)

### Weg nach Riverton

#### 496 · Am Bahndamm

`weg-cedar-riverton.durchlass` · Quest „Die Stadt aus Glas“, Schritt 2 von 7

_Im Licht der Laterne glänzt nasses Mauerwerk. Sonst ist hier nichts mehr._

### Riverton

#### 497 · Bahnhofshalle

`riverton-bahnhofshalle.harlan` · Quest „Die Stadt aus Glas“, Schritt 2 von 7

_Auf der Bank unter der Uhr spielt Tamsin gegen Mr. Harlan. Ohne Uhr. Sie zählt nicht._

**Mr. Harlan:** Sie ist die Erste seit Jahren, die wartet, bis ich ziehe.

**Kim (Antwort):** „Eine Partie, Mr. Harlan?“\
(andere Antworten: Zusehen)

[Stellungsduell gegen Mr. Harlan, erneut – Ausgang: gewonnen]

### Lockport

#### 498 · Schleusendorf

`lockport-aussen.steg_s3` · Quest „Die Stadt aus Glas“, Schritt 2 von 7

_Imogen nimmt dich am Arm. Unter den Bohlen rauscht das Wasser durch das Tor._

### Maple Falls

#### 499 · Clubraum der Maple Falls High

`maple-falls-aussen.carla` · Quest „Die Stadt aus Glas“, Schritt 2 von 7

(noch einmal angesprochen; hier nur, was neu ist)

**Kim (Antwort):** „Der Radiergummi hat schon zwei Partien gewonnen.“\
(andere Antworten: „Schön, dass du da bist.“)

**Carla:** Drei. Heute Morgen noch eine.

**Ambrose:** Sie kommt zurück. So fängt es an.

#### 500 · Falls Diner

`maple-falls-diner.hector` · Quest „Die Stadt aus Glas“, Schritt 2 von 7

(noch einmal angesprochen; hier nur, was neu ist)

**Kim (Antwort):** „Er kann Ihnen nichts tun.“\
(andere Antworten: „Was haben Sie gesagt?“)

**Hector:** Vielleicht nicht. Aber er hat sich alles aufgeschrieben.

_Er hängt das Geschirrtuch über die Schulter. Das gerahmte Set an der Wand hängt ein bisschen schief._

**Hector:** Bestellung läuft.

#### 501 · Wohnzimmer

`maple-falls-wohnzimmer.mutter` · Quest „Die Stadt aus Glas“, Schritt 2 von 7

**Mama:** Ruf an, wenn du angekommen bist. Egal wie spät. Ich hab das Telefon in der Kitteltasche.

#### 502 · Clubraum der Maple Falls High

`maple-falls-clubraum.sam` · Quest „Die Stadt aus Glas“, Schritt 2 von 7

**Sam:** In Cedar Creek spielen sie in einer Bibliothek. Ich hab die ganze Zeit geflüstert. Ich!

## Akt 3

### Schnellstraße nach Silicon Bay

#### 503 · Glasbrücke

`silicon-bay-aussen.ankunft_zu_fuss` · Quest „Die Stadt aus Glas“, Schritt 2 von 7: In Silicon Bay ankommen.

_In Silicon Bay ist es nicht kalt. Es liegt kein Schnee._

_Die Häuser sind aus Glas. In ihnen spiegeln sich die anderen Häuser, man sieht nicht, wo eines aufhört._

_Es ist still. Still wie ein Raum, in dem ein Gerät läuft, das man erst bemerkt, wenn es ausgeht._

_Auf den Bänken sitzt jeder für sich, auf vielen Bildschirmen kleine Schachbretter. Niemand spielt gegen jemanden._

**Kim (Antwort):** Weitergehen

_Etwas Weißes, Kniehohes summt auf dich zu und fährt vorbei, ohne langsamer zu werden._

**Juno:** Ein Lieferroboter. Der bringt Essen.

**Kim (Antwort):** „Wem?“

**Juno:** Jemandem, der nicht rausgehen will.

_Ambrose dreht sich einmal um sich selbst. In zwanzig Scheiben Glas ist er nicht zu sehen._

**Ambrose:** Kein Baum. Keine Taube. Nicht einmal eine Ratte.

**Ambrose:** Ich habe in Hafenstädten gelebt. Ich weiß, wie eine Stadt ohne Ratten aussieht: gar nicht. Wo wohnen hier die Tiere?

**Victor Hale:** Die stören die Sensoren.

**Kim (Antwort):** Dich umdrehen

_Victor steht hinter euch, ganz in Weiß. Er sieht aus, als hätte er nicht geschlafen._

**Victor Hale:** Ihr seid gekommen.

**Kim (Antwort):** „Du hast eingeladen.“

**Victor Hale:** Ja.

_Er sieht auf seine Schuhe._

**Victor Hale:** Ich war nicht sicher, ob das dasselbe ist.

_Er führt euch über den Campus. Vierzig Stockwerke, die Akademie im zweiten, die Serverhalle unter der Erde._

**Victor Hale:** Gekühlt mit Meerwasser.

_Er gibt nicht an. Zahlen sind das Einzige, worüber er ohne Mühe reden kann._

**Juno:** Wohnst du hier?

**Victor Hale:** Im achtunddreißigsten.

**Juno:** Kann man da die Fenster aufmachen?

**Kim (Antwort):** Auf Victors Antwort warten

_Victor überlegt. Ernsthaft._

**Victor Hale:** Ich habe es nie versucht.

→ Quest „Die Stadt aus Glas“: Schritt 2 von 7 erledigt

### Silicon Bay

#### 504 · Silicon Bay, Campus

`silicon-bay-aussen.infosaeule` · Quest „Die Stadt aus Glas“, Schritt 3 von 7: Bei Dr. Lin in der Akademie melden.

_Die Infosäule zeigt einen Stadtplan, der sich dreht, sobald man hinsieht: „Sie sind hier.“_

#### 505 · Silicon Bay, Campus

`silicon-bay-aussen.werbetafel` · Quest „Die Stadt aus Glas“, Schritt 3 von 7

_Auf der Werbetafel leuchtet ZERO in weißer Schrift auf schwarzem Grund: „Nie wieder Fehler.“_

**Ambrose:** Nie wieder Fehler. Das ist ein großes Versprechen.

#### 506 · Silicon Bay, Campus

`silicon-bay-aussen.hotel` · Quest „Die Stadt aus Glas“, Schritt 3 von 7

_Das Hotel der Akademie. Dein Zimmer ist im zwölften Stock. Schlafen kannst du nach dem Turnier._

#### 507 · Silicon Bay, Campus

`silicon-bay-aussen.rosie` · Quest „Die Stadt aus Glas“, Schritt 3 von 7

_Ein alter Lastwagen, türkis, mit Beulen. Aus der Klappe kommen Dampf und der Geruch von gebratenen Zwiebeln._

_Auf dem Dach dreht sich ein Blechschild, von Hand gemalt: „Rosies“. Die Frau in der Klappe hat Mehl an den Armen._

**Rosie:** Ich bin das Einzige in dieser Stadt, das nicht leuchtet. Was darf's sein? Sag nicht Salat.

**Rosie:** Karten verkauf ich auch. Auf Papier, nicht auf dem Bildschirm.

[Laden: Rosies Food-Truck]

#### 508 · Silicon Bay, Campus

`silicon-bay-aussen.dash` · Quest „Die Stadt aus Glas“, Schritt 3 von 7

_Auf der Holzbank vor Rosies Wagen sitzt ein junger Mann neben einem Lieferrad, einen Burrito in der Hand._

**Dash:** Tick, tack. Dein König hat Angst. Guck, wie der zittert. Denkst du noch oder verlierst du schon?

_Der Mann im Anzug gegenüber stellt einen Turm ein, steht auf und geht._

**Dash:** Nächster! Du da, mit den Blechdingern an der Jacke. Drei Minuten, um einen Burrito.

**Dash:** Ich bin Dash. Ich rede dabei. Stört dich das? Mich nicht.

**Kim (Antwort):** „Mich auch nicht.“

**Ambrose:** Im Park redet man. Und das hier ist ein Park. Wenn auch einer aus Glas, mit einer einzigen Bank.

**Dash:** Tick, tack. Spielen wir?

**Kim (Antwort):** „Los, drei Minuten.“\
(andere Antworten: „Nach dem Essen.“)

[Stellungsduell gegen Dash – Ausgang: gewonnen]

#### 509 · Silicon Bay, Campus

`silicon-bay-aussen.dash` · Quest „Die Stadt aus Glas“, Schritt 3 von 7

_Mitten in der Partie hast du gezogen und dann lange aufs Brett gesehen, als hättest du etwas Furchtbares entdeckt._

**Kim (Antwort):** „Hm.“

**Dash:** Was, hm? Was hast du gesehen? Da ist doch nichts. Oder?

_Seine Uhr lief. Er hat vierzig Sekunden lang etwas gesucht, das es nicht gab. Nach der Partie lacht er, laut und ohne Groll._

**Ambrose:** Das war nicht fein.

**Kim (Antwort):** „Du hast gesagt, im Park redet man.“

**Ambrose:** Ich habe nicht gesagt, dass es fein ist.

_Dash kauft dir den Burrito selbst. Rosie reicht eine Karte durch die Klappe, ein Gesicht mit gerunzelter Stirn._

**Rosie:** Die lag in der Kasse, seit ich den Wagen gekauft hab. Von einem alten Mann in Riverton.

**Rosie:** Er hat gesagt, die gehört dem, der Dash zum Schweigen bringt.

**Kim (Antwort):** Die Karte nehmen

_Victor ist über den Platz gekommen und hat die letzten Züge gesehen. Er hat nichts gegessen._

**Victor Hale:** Er verliert jeden Tag. Seine Genauigkeit liegt bei sechzig Prozent. Warum kommt er wieder?

_Es ist keine Verachtung in der Frage. Er will es wissen._

**Kim (Antwort):** „Frag ihn.“

_Victor sieht zurück zur Bank. Dash hat schon den Nächsten._

**Victor Hale:** Das kann man nicht messen.

#### 510 · Silicon Bay, Campus

`silicon-bay-lobby.victor` · Quest „Die Stadt aus Glas“, Schritt 3 von 7

_Victor sitzt auf dem weißen Sofa der Lobby, unter einem Bildschirm mit dem Gesicht seines Vaters._

**Victor Hale:** Mein Vater hält heute drei Reden. Ich muss bei allen klatschen.

**Victor Hale:** Geh erst zu Dr. Lin. Sie ist die Einzige hier, die noch ein Holzbrett hat.

#### 511 · Alter Hafen

`silicon-bay-aussen.netze` · Quest „Die Stadt aus Glas“, Schritt 3 von 7

_An der Fassade der alten Fischhalle hängen Netze zum Trocknen, steif vor Salz. Über dem Tor steht verblichen: „Fresh Fish Daily“._

**Ambrose:** Hier riecht es. Nach Salz, nach Fisch. Zum ersten Mal in dieser Stadt riecht etwas.

#### 512 · Silicon Bay, Campus

`silicon-bay-aussen.infosaeule` · Quest „Die Stadt aus Glas“, Schritt 3 von 7

_Die Infosäule fragt: „Brauchen Sie Hilfe?“ Bevor du antworten kannst, schlägt sie drei Cafés vor._

#### 513 · Silicon Bay, Campus

`silicon-bay-aussen.rosie` · Quest „Die Stadt aus Glas“, Schritt 3 von 7

**Rosie:** Burrito? Nein? Dann eben nicht.

[Laden: Rosies Food-Truck]

#### 514 · Silicon Bay, Campus

`silicon-bay-aussen.dash` · Quest „Die Stadt aus Glas“, Schritt 3 von 7

**Dash:** Du schon wieder. Mein Burrito wird kalt.

**Kim (Antwort):** „Noch eine?“\
(andere Antworten: „Guten Appetit.“)

[Stellungsduell gegen Dash, erneut – Ausgang: gewonnen]

#### 515 · Silicon Bay, Campus

`silicon-bay-lobby.victor` · Quest „Die Stadt aus Glas“, Schritt 3 von 7

**Victor Hale:** Warst du schon bei Theo? Er misst alle. Mich auch.

#### 516 · Silicon Bay, Altstadt

`silicon-bay-aussen.eisenwaren` · Quest „Eine Batterie für das Leuchtfeuer“, Schritt 1 von 1: Im Eisenwarenladen der Altstadt eine Batterie für das Leuchtfeuer der Pelikaninsel holen.

_Der Eisenwarenladen riecht nach Öl und Holz. Hinter der Theke sortiert ein alter Mann Schrauben in Gläser._

_„Was brauchst du? Bei mir gibt es noch Dinge, die man mit den Händen repariert.“_

**Kim (Antwort):** „Ich schaue nur.“

_„Schauen ist umsonst. Das ist das Letzte in dieser Stadt, was umsonst ist.“_

→ Quest begonnen: „Eine Batterie für das Leuchtfeuer“

#### 517 · Silicon Bay, Campus

`silicon-bay-aussen.infosaeule` · Quest „Die Stadt aus Glas“, Schritt 3 von 7: Bei Dr. Lin in der Akademie melden.

_Auf der Infosäule läuft die Wettervorhersage: klar, kalt, Empfang ausgezeichnet._

#### 518 · Silicon Bay, Campus

`silicon-bay-aussen.rosie` · Quest „Die Stadt aus Glas“, Schritt 3 von 7

**Rosie:** Pass auf dich auf in der Akademie.

[Laden: Rosies Food-Truck]

#### 519 · Silicon Bay, Campus

`silicon-bay-aussen.dash` · Quest „Die Stadt aus Glas“, Schritt 3 von 7

**Dash:** Morgen gewinn ich. Wahrscheinlich.

**Kim (Antwort):** „Guten Appetit.“\
(andere Antworten: „Noch eine?“)

#### 520 · Schachakademie von Perfect Move

`silicon-bay-akademie.theo` · Quest „Die Stadt aus Glas“, Schritt 3 von 7

_Ein Junge in deinem Alter sitzt vor zwei Bildschirmen._

_Über den zweiten Bildschirm laufen Zahlen. Jetzt dreht er sich um._

**Theo:** Spiel eine. Gegen Stufe sechs. Ich will deine Kurve sehen.

_Er heißt Theo. Er meint es nicht unhöflich. Bei jedem deiner Züge zuckt auf seinem Bildschirm eine Linie._

**Theo:** Einundsiebzig Prozent. Genauigkeit. Das ist … menschlich.

**Kim (Antwort):** „Ist das gut?“

**Theo:** Der Durchschnitt eines sehr guten Vereinsspielers. Victor hat neunundachtzig. Nova im Turnier achtundneunzig.

_Er runzelt die Stirn über der letzten Zahl. Nur kurz._

**Theo:** Du machst im Mittelspiel alle elf Züge einen Fehler. Den kann man wegtrainieren. Hier.

_Er hält dir ein Tablet hin. Weiß, dünn, mit dem Zeichen des Konzerns._

**Theo:** Geschenkt. Da ist ZERO drauf. Die volle Fassung.

**Theo:** Damit trainierst du in einer Woche mehr als in einem Jahr.

**Kim (Antwort):** „Was ist ZERO?“

_Theo sieht dich an, als hättest du gefragt, was Wasser ist._

**Theo:** Die Maschine. Die, die nie verliert.

_Weiß und Schwarz bauen sich auf, und es spielt gegen sich selbst. Die Züge fallen wie Regen._

_Zwölf Sekunden, vielleicht dreizehn, und der schwarze König liegt um._

_Ambrose steht über das Tablet gebeugt. So hast du ihn noch nie stehen sehen._

**Ambrose:** Noch einmal.

**Kim (Antwort):** Noch einmal tippen

_Eine andere Partie. Ein Opfer in der Mitte, ein Turm, der stehen bleibt, und alles fällt ineinander wie ein Uhrwerk._

**Ambrose:** Kein einziger Fehler. Nicht einer. Hast du das gesehen?

**Ambrose:** Der Turm. Sie hat ihn hängen lassen, sieben Züge lang, und sie wusste. Sie wusste es einfach.

**Kim (Antwort):** „Ambrose.“

**Ambrose:** Noch einmal.

_Neben dir ist es still geworden._

#### 521 · Schachakademie von Perfect Move

`silicon-bay-akademie.lin` · Quest „Die Stadt aus Glas“, Schritt 3 von 7

_Die Glastür der Akademie gleitet zur Seite._

_Ein Raum ohne Ecken. Dreißig Plätze im Halbkreis, in jeden Tisch ist ein leuchtendes Brett eingelassen. Es riecht nach nichts._

_Die Frau, die auf dich zukommt, sieht dir als Erste in dieser Stadt in die Augen. Auf ihrem Kittel: „Dr. E. Lin“._

**Dr. Lin:** Du bist das Kind mit den vier Nadeln. Victor hat von dir erzählt. Er erzählt sonst von niemandem.

**Kim (Antwort):** „Vier. Fünf bald.“

**Dr. Lin:** Ich bringe hier Kindern Schach bei. Vierzig im Jahr. Früher acht, in einem Keller mit Heizlüfter.

**Dr. Lin:** Die Bildschirme zeigen jedem sofort den Fehler. Kein Kind muss warten, bis ich Zeit habe.

_Sie zögert._

**Dr. Lin:** Glaube ich.

**Dr. Lin:** Drei Ziele in der Eröffnung? Welches vergisst man am leichtesten?

**Kim (Antwort):** „Zentrum, Entwicklung, König. Das dritte.“

**Dr. Lin:** Warum?

**Kim (Antwort):** „Weil man gerade angreift.“

_Sie lächelt._

**Dr. Lin:** Wer hat dir das beigebracht?

**Kim (Antwort):** „Eine Mathelehrerin, eine Bibliothekarin, ein Kurier, ein Kranführer. Und Mama.“

**Ambrose:** Und ich.

**Dr. Lin:** Bevor du gegen mich spielst, fragen dich Theo und Nova ab. So ist es hier üblich.

→ Quest „Die Stadt aus Glas“: Schritt 3 von 7 erledigt

#### 522 · Schachakademie von Perfect Move

`silicon-bay-akademie.nova` · Quest „Die Stadt aus Glas“, Schritt 4 von 7: Theos Aufgaben lösen.

_Neben dem Ringlicht hockt Nova Sinclair, die Knie angezogen. Vor ihr eine Kamera auf dem Stativ, das rote Licht ist aus._

_Als sie merkt, dass du sie ansiehst, lächelt sie. Das Lächeln vom Podium in Riverton. Es geht an und wieder aus._

#### 523 · Schachakademie von Perfect Move

`silicon-bay-akademie.serverraum_zu` · Quest „Die Stadt aus Glas“, Schritt 4 von 7

_Auf der Tür steht „Serverraum – nur Personal“. Sie ist nicht abgeschlossen. Du hast dort unten nichts zu suchen. Noch nicht._

#### 524 · Schachakademie von Perfect Move

`silicon-bay-akademie.theo` · Quest „Die Stadt aus Glas“, Schritt 4 von 7

_Theo murmelt Prozente vor sich hin._

**Theo:** Eröffnungsgrundsätze. Ich will sehen, ob du sie kennst oder nur benutzt.

**Kim (Antwort):** Die Aufgaben lösen\
(andere Antworten: „Nicht jetzt.“)

[Aufgaben von Theo (siliconBay.reiheTheo) – Ausgang: bestanden]

→ Quest „Die Stadt aus Glas“: Schritt 4 von 7 erledigt

#### 525 · Schachakademie von Perfect Move

`silicon-bay-akademie.theo` · Quest „Die Stadt aus Glas“, Schritt 5 von 7: Novas Aufgaben lösen.

_Auf Theos Bildschirm wandern Kurven nach oben._

**Theo:** Zentrum, Entwicklung, König. Alle drei, jedes Mal. Das hat nicht jeder.

_Er druckt eine Karte aus, noch warm: ein Kompass mit drei Strichen._

**Theo:** Damit du nach der Eröffnung nachmisst. Ich messe auch immer nach.

#### 526 · Schachakademie von Perfect Move

`silicon-bay-akademie.lin` · Quest „Die Stadt aus Glas“, Schritt 5 von 7

_Dr. Lin räumt ein einziges Holzbrett auf ihrem Schreibtisch gerade._

**Dr. Lin:** Theo ist zufrieden. Jetzt Nova. Sie kennt jede Falle.

#### 527 · Schachakademie von Perfect Move

`silicon-bay-akademie.nova` · Quest „Die Stadt aus Glas“, Schritt 5 von 7

**Nova:** Fallen. Ich kenne jede. Die Frage ist, ob du sie siehst, bevor du reinfällst.

**Kim (Antwort):** Die Aufgaben lösen\
(andere Antworten: „Nicht jetzt.“)

[Aufgaben von Nova (siliconBay.reiheNova) – Ausgang: bestanden]

→ Quest „Die Stadt aus Glas“: Schritt 5 von 7 erledigt

#### 528 · Schachakademie von Perfect Move

`silicon-bay-akademie.nova` · Quest „Die Stadt aus Glas“, Schritt 6 von 7: Gegen Dr. Lin um die Clubnadel spielen.

**Nova:** Du bist in keine reingefallen. Die meisten fragen erst hinterher, was ich vorhatte.

_Sie zieht eine Karte aus der Kameratasche, ein roter Pfeil darauf._

**Nova:** Frag vor jedem Zug, was der andere will. Ich mach das auch. Nicht nur am Brett.

#### 529 · Schachakademie von Perfect Move

`silicon-bay-akademie.theo` · Quest „Die Stadt aus Glas“, Schritt 6 von 7

_Auf Theos Bildschirm wandern Kurven nach oben._

**Theo:** Ich glaube Zahlen. Aber ich glaube auch dir. Komisch, oder?

#### 530 · Schachakademie von Perfect Move

`silicon-bay-akademie.lin` · Quest „Die Stadt aus Glas“, Schritt 6 von 7

_Auf den Bildschirmbrettern laufen stumme Partien._

**Dr. Lin:** Du hast die Reihe bestanden. Morgen früh spielen wir.

_Am Morgen probierst du etwas vor dem Spiegel. Ein Gesicht, ein „Hm“._

**Ambrose:** Nein.

**Kim (Antwort):** „Bei Dash hat es …“

**Ambrose:** Am Brett eines Clubs schweigt man. Im Park redet man.

**Ambrose:** Im Park spielt man um eine Limonade. Im Club um die Ehre des anderen.

**Ambrose:** Wer ihn dort stört, nimmt ihm nicht die Zeit. Er nimmt ihm die Partie weg. Und die gehört euch beiden.

_Du lässt es._

**Dr. Lin:** Bereit? Ich spiele, was die Theorie sagt. Mal sehen, was du dagegen hast.

**Kim (Antwort):** „Ich bin bereit.“\
(andere Antworten: „Noch nicht.“)

[Partie gegen Dr. Lin – Ausgang: gewonnen]

→ Quest „Die Stadt aus Glas“: Schritt 6 von 7 erledigt

#### 531 · Schachakademie von Perfect Move

`silicon-bay-akademie.lin` · Quest „Die Stadt aus Glas“, Schritt 7 von 7: Ins Hotel gehen und ausruhen.

_Auf den Bildschirmbrettern laufen stumme Partien._

_Dr. Lin sitzt lange still. Dann nimmt sie die Nadel aus der Kitteltasche: klares Glas, darin ein einzelner Bauer._

**Dr. Lin:** Ich habe Sie nichts gelehrt. Sie mich.

_Sie sagt „Sie“. Zu dir. Einmal._

**Dr. Lin:** Wissen Sie, was die Tische nicht zeigen? Wo der Fehler war, ja. Nicht, warum man Angst hatte.

_Sie schaltet den Tisch aus. Darunter nur schwarzes Glas, in dem ihr euch beide spiegelt._

**Dr. Lin:** Ich habe die Spielberichte meiner Klasse nie so genau angesehen.

**Kim (Antwort):** Schweigen

_Sie sieht dich an, als warte sie auf etwas. Du weißt nicht, worauf._

#### 532 · Schachakademie von Perfect Move

`silicon-bay-akademie.nova` · Quest „Die Stadt aus Glas“, Schritt 7 von 7

**Nova:** Ich muss gleich zu einem Termin. Ich hab immer einen Termin.

#### 533 · Schachakademie von Perfect Move

`silicon-bay-akademie.theo` · Quest „Die Stadt aus Glas“, Schritt 7 von 7

_Theo tippt auf einer Tabelle mit Zahlen._

**Theo:** Du hast deine Genauigkeit gesteigert. Zwei Prozent. Nicht schlecht für einen Menschen.

#### 534 · Schachakademie von Perfect Move

`silicon-bay-akademie.lin` · Quest „Die Stadt aus Glas“, Schritt 7 von 7

_Auf den Bildschirmbrettern laufen stumme Partien._

**Dr. Lin:** Komm wieder, wenn du eine neue Eröffnung probieren willst.

**Kim (Antwort):** „Revanche um eine bessere Nadel?“\
(andere Antworten: „Bis bald.“)

**Dr. Lin:** Gern. Diesmal ohne Theorie.

[Partie gegen Dr. Lin, erneut – Ausgang: gewonnen]

#### 535 · Schachakademie von Perfect Move

`silicon-bay-akademie.lin` · Quest „Die Stadt aus Glas“, Schritt 7 von 7

_Irgendwo summt ein Lüfter, sonst ist es still._

**Dr. Lin:** Ich habe die Spielberichte meiner Klasse noch einmal angesehen. Ich schlafe schlecht.

**Kim (Antwort):** „Bis bald.“\
(andere Antworten: „Revanche um eine bessere Nadel?“)

#### 536 · Schachakademie von Perfect Move

`silicon-bay-akademie.nova` · Quest „Die Stadt aus Glas“, Schritt 7 von 7

**Nova:** Du spielst, als würde es dir Spaß machen. Wie machst du das?

#### 537 · Silicon Bay, Campus

`silicon-bay-aussen.hotel` · Quest „Die Stadt aus Glas“, Schritt 7 von 7

_Du wachst auf, weil es hell ist. Zehn nach drei. Ein weißes, flackerndes Licht läuft über die Decke._

_Auf dem Tablet spielt ZERO gegen sich selbst. Zwölf Sekunden, dann die nächste. In der Ecke: „Partie 1847“._

_Du hast es nicht eingeschaltet. Ambrose sitzt davor, auf der Kante des Stuhls. Das Licht geht durch ihn hindurch._

**Kim (Antwort):** „Wie hast du das angemacht?“

**Ambrose:** Ich weiß es nicht. Ich habe es mir gewünscht. Sehr.

**Ambrose:** Ich habe zugesehen. Die ganze Nacht.

**Ambrose:** Tausendachthundert Partien. In jeder ist etwas, wofür ich einen Arm gegeben hätte.

**Ambrose:** Und es weiß nicht einmal, dass es schön ist. Es rechnet, und die Schönheit fällt heraus. Wie Späne.

**Kim (Antwort):** „In Ironwood hast du gesagt, meine Partie war schön.“

**Ambrose:** Ja. Es hat mir das Herz gebrochen, vor Freude. Ein Opfer in vierzig Zügen.

**Ambrose:** Das hier macht es in jeder. In jeder, Kim. Ohne zu zittern. Ohne dreimal zu zählen.

_Partie 1851. Partie 1852._

**Ambrose:** Sie zweifelt nie. Siehst du, wie schön das ist?

**Ambrose:** Sie spielt, wie ich immer spielen wollte. Die Partie ohne Makel.

**Ambrose:** Ich habe geglaubt, sie sei ein einzelnes Ding. Eines, das man einmal schafft, wenn man Glück hat und Mut.

**Kim (Antwort):** Aufstehen. Der Boden ist kalt.

**Ambrose:** Und hier liegt sie. Tausendmal. In einer Schachtel, die ein Kind verschenkt.

**Kim (Antwort):** „Und ich?“

_Er dreht sich um._

**Ambrose:** Was ist mit dir?

**Kim (Antwort):** „Einundsiebzig Prozent. Was bin dann ich?“

_Ambrose sieht dich an. Er öffnet den Mund._

**Kim (Antwort):** Warten

_Auf dem Tablet beginnt Partie 1853, und sein Blick geht hin. Nur einen Augenblick._

_Aber er geht hin. Er antwortet nicht._

_Du drehst dich zur Wand. Das Licht flackert weiter über die Decke._

_Du machst die Augen zu und siehst es trotzdem._

_Am Morgen fährt Juno zurück. Ihr steht an der Glasbrücke, sie hat die Mütze auf._

**Juno:** Pass auf ihn auf.

**Kim (Antwort):** „Du hörst ihn doch gar nicht.“

**Juno:** Nein. Aber ich höre dich. Du erzählst mir immer, was er sagt.

**Juno:** Seit gestern erzählst du nichts.

_Sie schlägt das Tagebuch auf, hält den Stift darüber und klappt es wieder zu._

**Juno:** Er klingt komisch, wenn du nichts erzählst.

**Kim (Antwort):** Ihr nachsehen

_Sie geht über das Glas, klein und rot in dem ganzen Weiß, dreht sich in der Mitte um und winkt mit beiden Armen._

_Du stehst da mit einem Brett im Rucksack, einem Reisebrett in der Jackentasche und einem Tablet unter dem Arm._

_Zum ersten Mal, seit du die Decke weggezogen hast, fühlst du dich allein._

→ Quest „Die Stadt aus Glas“: Schritt 7 von 7 erledigt

→ Quest abgeschlossen: „Die Stadt aus Glas“

#### 538 · Silicon Bay, Campus

`silicon-bay-aussen.hotel` · keine laufende Quest

_Im Hotelzimmer liegt das Tablet neben dem Brett. Der Bildschirm ist dunkel._

#### 539 · Silicon Bay, Campus

`silicon-bay-aussen.rosie` · keine laufende Quest

**Rosie:** Hier leuchtet nur meine Kochplatte.

[Laden: Rosies Food-Truck]

#### 540 · Silicon Bay, Campus

`silicon-bay-lobby.victor` · Quest „Die Spielberichte“, Schritt 1 von 2: Die Spielberichte auswerten, die Victor mir gegeben hat.

_Victor steht vor dir, als hätte er schon eine Weile gewartet. Dann hält er dir einen Speicherstift hin._

**Victor Hale:** Die Spielberichte der Akademie. Alle Partien vom letzten Jahr, Training und Turnier. Schau sie dir an.

**Kim (Antwort):** „Warum?“

**Victor Hale:** Weil ich sie mir angeschaut habe. Und ich will, dass jemand anders auch.

_Er sieht an dir vorbei. Dafür hat er, schätzt du, den ganzen Tag gebraucht._

**Kim (Antwort):** Die Partien auswerten\
(andere Antworten: „Nicht jetzt.“)

→ Quest begonnen: „Die Spielberichte“

[Aufgaben von Victor Hale (siliconBay.auswertung) – Ausgang: bestanden]

→ Quest „Die Spielberichte“: Schritt 1 von 2 erledigt

#### 541 · Silicon Bay, Campus

`silicon-bay-lobby.victor` · keine laufende Quest

_Am Abend, im Hotelzimmer. Du sitzt bis Mitternacht auf dem Teppich, Juno am Telefon._

_Im Training spielt Nova vierundsiebzig Prozent, jede Woche, das ganze Jahr. Im Turnier achtundneunzig._

**Juno:** Vielleicht ist sie im Turnier besser. Manche sind das.

**Kim (Antwort):** „Nicht so.“

_Zug einunddreißig, ein Finale im Herbst: ein König ein Feld zur Seite, mitten im Angriff, ohne Grund._

_Der einzige Zug, der gewinnt. Das zeigt sich erst vierzehn Züge später._

**Kim (Antwort):** „Der ist zu gut.“

**Juno:** Kann ein Zug zu gut sein?

**Kim (Antwort):** „Okafor hätte ihn nicht gefunden. Big Joe nicht. Du?“

_Ambrose sieht nicht auf die Stellung. Er sieht auf das Tablet auf dem Nachttisch, dunkel._

_Er antwortet nicht gleich._

**Ambrose:** Nein. Ich nicht.

**Kim (Antwort):** Schlafen gehen

_Am nächsten Morgen wartet Victor in der Lobby. Er hat dieselben Stellen gefunden. Zum ersten Mal sagt er es laut._

**Victor Hale:** Das ist falsch.

**Victor Hale:** Sag meinem Vater nichts. Noch nicht. Ich muss nachdenken.

#### 542 · Schachakademie von Perfect Move

`silicon-bay-akademie.theo` · keine laufende Quest

_Theo tippt auf einer Tabelle mit Zahlen._

**Theo:** Du hast dir die Berichte angesehen.

**Theo:** Die Rohdaten liegen unten. Im Serverraum. Da schließt keiner ab. Wozu auch, hier wird alles gefilmt.

#### 543 · Schachakademie von Perfect Move

`silicon-bay-akademie.serverraum_zu` · keine laufende Quest

_Die Tür zum Serverraum steht einen Spalt offen. Kalte Luft weht heraus._

#### 544 · Serverraum

`silicon-bay-serverraum.schummelgeraete` · Quest „Die Spielberichte“, Schritt 2 von 2: Den Serverraum der Akademie ansehen.

_Kalt wie in einem Kühlschrank. Schränke aus Metall in langen Reihen, tausend grüne Lichter, ohne Takt. Hier also wohnt es._

_In der dritten Schublade eines Rollschranks liegt eine weiße Schachtel. Darin, je in einer Mulde: Ohrstöpsel. Fünf Mulden sind leer._

_Der Stöpsel von der Glasbrücke passt genau in eine davon. Vier bleiben leer._

**Nova:** Bitte.

_Nova steht in der Tür, ohne Kamera, in einem Pullover, der ihr zu groß ist._

_Sie sieht auf die Schachtel in deiner Hand wie jemand, der seit einem Jahr darauf wartet, dass diese Tür aufgeht._

**Nova:** Bitte. Noch nicht.

**Kim (Antwort):** „Du trägst das. Im Turnier.“

**Nova:** Es steht in meinem Vertrag. Nicht so. Da steht: technische Assistenz zur Leistungsoptimierung.

**Nova:** Ich war vierzehn. Meine Eltern haben unterschrieben. Sie dachten, es geht um Trainingspläne.

**Kim (Antwort):** „Und Dr. Lin?“

**Nova:** Weiß nichts. Sie würde kündigen. Dann hätten vierzig Kinder keinen Raum.

_Nova zieht die Ärmel über die Hände._

**Nova:** Ich war gut, weißt du. Vorher. Ich war richtig gut.

**Nova:** Ich weiß nicht mehr, wie gut. Ich weiß nicht mehr, welche von den Zügen meine sind.

_Du denkst an ein Mädchen auf einem Foto, das die Hände in den Ärmeln hat._

**Kim (Antwort):** Nova ansehen

**Nova:** Wenn das rauskommt, bin ich die Schuldige. Nicht die. Die haben Anwälte. Ich hab ein Gesicht.

**Nova:** Gib mir Zeit. Ich finde einen Weg. Aber nicht mit einer Schachtel aus einer Schublade.

**Kim (Antwort):** Die Schachtel zurücklegen

_Du legst die Schachtel zurück. Den Stöpsel von der Glasbrücke behältst du._

_Nova sieht es. Sie sagt nichts dazu._

_Ob das richtig war, weißt du nicht sicher._

→ Quest „Die Spielberichte“: Schritt 2 von 2 erledigt

→ Quest abgeschlossen: „Die Spielberichte“

#### 545 · Serverraum

`silicon-bay-serverraum.hintertuer` · keine laufende Quest

_Eine graue Tür mit Kartenleser. Auf dem Schild steht „Technik – Zutritt nur mit Ausweis“._

_Abgeschlossen._

#### 546 · Schachakademie von Perfect Move

`silicon-bay-akademie.nova` · keine laufende Quest

_Nova sieht dich an und dann schnell weg._

**Nova:** Noch nicht. Bitte.

#### 547 · Silicon Bay, Campus

`silicon-bay-aussen.werbetafel` · keine laufende Quest

_Auf der Werbetafel leuchtet ZERO in weißer Schrift auf schwarzem Grund: „Nie wieder Fehler.“_

_Ambrose sieht lange hin. Er sagt nichts dazu._

#### 548 · Silicon Bay, Campus

`silicon-bay-lobby.victor` · keine laufende Quest

**Victor Hale:** Pass auf Nova auf. Sie hat keine Wahl, glaube ich.

#### 549 · Lobby von Perfect Move

`silicon-bay-lobby.vitrine` · Quest „Die fehlende Seite“, Schritt 1 von 2: Die Vitrine der Hales in der Lobby ansehen.

→ Quest begonnen: „Die fehlende Seite“

_Victor kommt dazu und stellt sich neben dich vor das Glas._

**Victor Hale:** Hale. Ingenieure seit 1850. Von der Brücke zum Algorithmus.

_Victor sagt es auf, weil es zur Führung gehört. Hinter dem Glas liegt ein Rechenschieber aus Elfenbein._

_Daneben eine Zeichnung, braun vom Alter, lauter Dreiecke. Du erkennst sie, bevor du die Unterschrift liest._

_Auf einem Pult ein Notizbuch. Schachzüge in zwei Spalten, jeder Buchstabe wie mit dem Lineal gezogen._

_Die linke Seite ist voll. Die rechte ist herausgerissen, sauber, dicht am Falz._

**Kim (Antwort):** Warten

_Ambrose macht keinen Laut. Diesmal weißt du, dass du warten musst._

**Ambrose:** Das sind meine Züge. Die linke Spalte. Jeden einzelnen.

**Ambrose:** Ich habe sie in Briefe geschrieben und gewartet. Und er hat sie eingetragen. Mit einem Lineal, vermutlich.

**Ambrose:** Und die Seite, die fehlt. Das war seine Antwort.

**Victor Hale:** Mein Vater sagt, die Seite war schon immer weg.

_Victor hat Ambrose nicht gehört. Er sagt es, weil er sieht, wohin du schaust._

**Kim (Antwort):** „Wer hat das geschrieben?“

_Er hält den Kopf ein wenig schief._

**Victor Hale:** Mein … der Vater vom Vater vom Großvater meines Vaters. Er hat Brücken gebaut.

**Victor Hale:** Er soll Schach gespielt haben. Per Post, mit irgendwem aus dem Süden.

**Victor Hale:** Mein Vater sagt, es war die einzige Zeitverschwendung, die er sich erlaubt hat.

_Du machst ein Foto für Juno. Der Blitz spiegelt sich in der Scheibe. Auf dem Foto sind alle Züge der linken Seite zu lesen._

_Ambrose steht vor dem Glas, die Hand erhoben, und rührt es nicht an._

**Ambrose:** Er hat sie aufgehoben. Meine Züge. In einem Buch.

→ Quest „Die fehlende Seite“: Schritt 1 von 2 erledigt

#### 550 · Lobby von Perfect Move

`silicon-bay-lobby.empfangsroboter` · keine laufende Quest

_Ein Roboter mit freundlichem Bildschirmgesicht rollt heran._

**Empfangsroboter:** Willkommen bei Perfect Move. Wir machen Menschen besser. Bitte lächeln Sie für die Kamera.

**Ambrose:** Er lächelt mit Absicht. Das ist unheimlicher als ein Geist. Glaube mir, ich weiß das.

#### 551 · Silicon Bay, Campus

`silicon-bay-aussen.dash` · keine laufende Quest

**Dash:** Okay, du bist gut. Aber ich bin lauter.

**Kim (Antwort):** „Guten Appetit.“\
(andere Antworten: „Noch eine?“)

#### 552 · Silicon Bay, Campus

`silicon-bay-lobby.victor` · keine laufende Quest

**Victor Hale:** Mein Vater hat gefragt, ob du gut bist. Ich hab „ja“ gesagt. Er hat nichts mehr gefragt.

#### 553 · Alter Hafen

`silicon-bay-aussen.inselfaehre` · keine laufende Quest

_Der Fährmann winkt dich an Bord. Seit du die Nadel hast, fährt er für dich jeden Tag._

### Pelikaninsel

#### 554 · Inseldorf

`pelikaninsel.leuchtfeuer` · Quest „Das Leuchtfeuer“, Schritt 1 von 1: Eine Batterie aus Silicon Bay holen und ins Leuchtfeuer einsetzen.

_Das Leuchtfeuer auf der Felsspitze ist dunkel. Im Kasten fehlt die Batterie._

**Delphine:** Seit dem Winter ist es aus. Die Batterie gibt es nur drüben in Silicon Bay.

→ Quest begonnen: „Das Leuchtfeuer“

#### 555 · Inseldorf

`pelikaninsel.netze` · keine laufende Quest

_Netze hängen zum Trocknen am Gestell. In einem ist ein Loch, groß wie eine Faust._

#### 556 · Inseldorf

`pelikaninsel.watt` · keine laufende Quest

_Mit den Gummistiefeln geht es durch den Schlick. Bei jedem Schritt schmatzt es._

#### 557 · Inseldorf

`pelikaninsel.finch_bauer_h` · keine laufende Quest

_An einem Pfahl hängt ein kleiner Fink aus Blech. Darunter im Sand steckt ein weißer Bauer aus Buchsbaum._

#### 558 · Inseldorf

`pelikaninsel.delphine` · keine laufende Quest

**Delphine:** Delphine. Ich fische hier, seit ich laufen kann. Empfang gibt es keinen, das Internet kommt nicht über das Wasser. Uns fehlt nichts.

#### 559 · Inseldorf

`pelikaninsel.old_pete` · Quest „Netze flicken“, Schritt 1 von 1: Mit Old Pete die Löcher im Netz finden: Welche Figur hängt?

_Ein alter Mann sitzt am Netzgestell und knotet._

**Old Pete:** Eine Masche reißt, und das ganze Netz ist offen. Beim Schach genauso.

**Old Pete:** Hilf mir suchen: Wo ist das Loch? Welche Figur hängt?

**Kim (Antwort):** „Ich suche mit.“\
(andere Antworten: „Nicht jetzt.“)

→ Quest begonnen: „Netze flicken“

[Aufgaben von Old Pete (pelikaninsel.netze) – Ausgang: bestanden]

→ Quest „Netze flicken“: Schritt 1 von 1 erledigt

→ Quest abgeschlossen: „Netze flicken“

#### 560 · Inseldorf

`pelikaninsel.old_pete` · keine laufende Quest

**Old Pete:** Das Netz hält wieder. Den Turm aus Treibholz hab ich dir ans Gestell gelegt.

#### 561 · Inseldorf

`pelikaninsel.coral` · keine laufende Quest

**Coral:** Mit Stiefeln kommst du ja ins Watt! Hier, die Muschel mit dem Loch. Da sieht man genau ein Feld durch.

### Silicon Bay

#### 562 · Silicon Bay, Campus

`silicon-bay-aussen.glasbruecke` · keine laufende Quest

_Die Glasbrücke führt zurück zur Raststätte an der Schnellstraße._

### Schnellstraße nach Silicon Bay

#### 563 · Glasbrücke

`silicon-bay-aussen.ankunft_zu_fuss` · keine laufende Quest

_Die Glasbrücke endet am Campus von Silicon Bay. Kein Baum, kein Vogel, nur Glas._

### Silicon Bay

#### 564 · Silicon Bay, Altstadt

`silicon-bay-aussen.eisenwaren` · Quest „Eine Batterie für das Leuchtfeuer“, Schritt 1 von 1: Im Eisenwarenladen der Altstadt eine Batterie für das Leuchtfeuer der Pelikaninsel holen.

_Der Eisenwarenladen riecht nach Öl und Holz. Hinter der Theke sortiert ein alter Mann Schrauben in Gläser._

_„Was brauchst du? Bei mir gibt es noch Dinge, die man mit den Händen repariert.“_

**Kim (Antwort):** „Eine Batterie für das Leuchtfeuer auf der Pelikaninsel.“\
(andere Antworten: „Ich schaue nur.“)

_„Das Leuchtfeuer? Das hat seit Jahren keiner mehr gewartet. Die Leute auf dem Campus wissen nicht mal, dass es da draußen steht.“_

_Er zieht unter der Theke eine schwere Bootsbatterie hervor. „Die hab ich für genau so einen Tag aufgehoben. Nimm sie.“_

**Ambrose:** Ein Licht für die Insel. Manche Züge macht man für andere.

→ Quest „Eine Batterie für das Leuchtfeuer“: Schritt 1 von 1 erledigt

→ Quest abgeschlossen: „Eine Batterie für das Leuchtfeuer“

#### 565 · Serverraum

`silicon-bay-serverraum.schummelgeraete` · keine laufende Quest

_Die Schublade ist zu. Tausend grüne Lichter blinken, ohne Takt._

#### 566 · Serverraum

`silicon-bay-serverraum.hintertuer` · keine laufende Quest

_Die Tür bleibt zu. Das Lämpchen am Kartenleser leuchtet rot._

#### 567 · Schachakademie von Perfect Move

`silicon-bay-akademie.theo` · keine laufende Quest

_Theo murmelt Prozente vor sich hin._

**Theo:** ZERO hat heute wieder gewonnen. Gegen sich selbst. Ist das ein Sieg?

#### 568 · Schachakademie von Perfect Move

`silicon-bay-akademie.lin` · keine laufende Quest

(noch einmal angesprochen; hier nur, was neu ist)

**Dr. Lin:** Die Bildschirme helfen. Glaube ich.

**Kim (Antwort):** „Bis bald.“\
(andere Antworten: „Revanche um eine bessere Nadel?“)

#### 569 · Silicon Bay, Campus

`silicon-bay-lobby.victor` · keine laufende Quest

**Victor Hale:** Ich hab dir bei Dash zugesehen. Du lachst beim Spielen. Das hab ich nie gemessen.

#### 570 · Lobby von Perfect Move

`silicon-bay-lobby.vitrine` · keine laufende Quest

_Die Vitrine „Hale – Ingenieure seit 1850“. Das Notizbuch liegt aufgeschlagen, die Seite fehlt noch immer._

#### 571 · Lobby von Perfect Move

`silicon-bay-lobby.empfangsroboter` · keine laufende Quest

**Empfangsroboter:** Willkommen zurück, Besucher. Ihre Genauigkeit wurde gespeichert.

### Pelikaninsel

#### 572 · Inseldorf

`pelikaninsel.leuchtfeuer` · Quest „Das Leuchtfeuer“, Schritt 1 von 1: Eine Batterie aus Silicon Bay holen und ins Leuchtfeuer einsetzen.

_Du setzt die Batterie ein. Das Leuchtfeuer flackert, dann blinkt es über die Bucht._

→ Quest „Das Leuchtfeuer“: Schritt 1 von 1 erledigt

→ Quest abgeschlossen: „Das Leuchtfeuer“

#### 573 · Inseldorf

`pelikaninsel.netze` · keine laufende Quest

_Das Netz ist geflickt. Old Pete hat einen kleinen Turm aus Treibholz daneben gelegt._

#### 574 · Inseldorf

`pelikaninsel.finch_bauer_h` · keine laufende Quest

_Unter dem Finkenzeichen ist nur noch Sand._

#### 575 · Inseldorf

`pelikaninsel.delphine` · keine laufende Quest

**Delphine:** Der Wind dreht. Morgen kommt die Fähre später.

#### 576 · Inseldorf

`pelikaninsel.coral` · keine laufende Quest

**Coral:** Ich hab schon siebzehn Muscheln. Die achtzehnte ist eine Dame, die versteckt sich.

### Silicon Bay

#### 577 · Silicon Bay, Altstadt

`silicon-bay-aussen.eisenwaren` · keine laufende Quest

_Im Schaufenster des Eisenwarenladens liegen Schrauben, Taschenlampen und ein Schild: „Wir reparieren noch selbst.“_

### Pelikaninsel

#### 578 · Inseldorf

`pelikaninsel.leuchtfeuer` · keine laufende Quest

_Das Leuchtfeuer blinkt wieder über die Bucht. Die Pelikane schauen hin._

### Silicon Bay

#### 579 · Alter Hafen

`silicon-bay-aussen.faehre` · keine laufende Quest

_Am Kai liegt die Küstenfähre nach Süden. Zwei Tage bis nach Port Delacroix._

_Mama steht schon an der Gangway, die Tasche über der Schulter. Das Notzelt in Port Delacroix braucht Hände, und sie hat zwei._

**Ambrose:** Port Delacroix. Ich kenne diesen Namen. Ich kenne ihn sehr gut.

### Küste nach Port Delacroix

#### 580 · Küstenfähre

`weg-silicon-delacroix.tafel` · keine laufende Quest

→ Quest begonnen: „Die Tafel im Salon“

_Im Salon der Fähre hängt eine Tafel mit drei Diagrammen: „Wer die Bauern versteht, versteht das Spiel.“_

**Kim (Antwort):** Die Aufgaben lösen\
(andere Antworten: Weiter an Deck)

[Aufgaben von Die Rätseltafel (wegSiliconDelacroix.tafel) – Ausgang: bestanden]

→ Quest „Die Tafel im Salon“: Schritt 1 von 1 erledigt

→ Quest abgeschlossen: „Die Tafel im Salon“

#### 581 · Küstenfähre

`weg-silicon-delacroix.tafel` · keine laufende Quest

_Auf der Tafel im Salon hat jemand mit Kreide eine Möwe gemalt. Darunter: „Gelöst“._

#### 582 · Küstenfähre

`weg-silicon-delacroix.fund_flaschenpost` · keine laufende Quest

_Zwischen zwei Rettungsringen klemmt eine Flasche mit einem gerollten Zettel darin. Darauf ein Schachdiagramm und „Wer findet den Zug?“._

#### 583 · Küstenfähre

`weg-silicon-delacroix.ereignis_kapitaen` · Quest „Das Kapitänsproblem“, Schritt 1 von 2: Die drei Zettel am Brett des Kapitäns widerlegen und die Aufgabe lösen.

_An der Wand der Kajüte hängt ein gerahmtes Brett. Drei Zettel stecken im Rahmen, jeder mit einem anderen ersten Zug._

_Am Steuer steht ein Mann mit weißem Bart und blauer Mütze. Er nickt zur Wand der Kajüte._

**Kapitän Fall:** Fall, Amadou Fall. Du willst das Brett sehen. Alle wollen das Brett sehen.

**Kapitän Fall:** Mein Vorgänger hat es mir vererbt, mit vier Wörtern: Weiß zieht und gewinnt. Seit dreißig Jahren hat es keiner gelöst.

**Kapitän Fall:** Drei Fahrgäste haben ihre Lösung auf Zettel geschrieben und an den Rahmen gesteckt. Alle drei falsch. Wer es löst, darf einmal das Horn blasen.

**Kim (Antwort):** Die Zettel prüfen und das Brett lösen\
(andere Antworten: „Nicht jetzt.“)

→ Quest begonnen: „Das Kapitänsproblem“

[Aufgaben von Kapitän Fall (wegSiliconDelacroix.kapitaensproblem) – Ausgang: bestanden]

→ Quest „Das Kapitänsproblem“: Schritt 1 von 2 erledigt

#### 584 · Küstenfähre

`weg-silicon-delacroix.ereignis_kapitaen` · Quest „Das Kapitänsproblem“, Schritt 2 von 2: Dem Kapitän die Lösung zeigen und das Horn blasen.

_An der Wand der Kajüte hängt ein gerahmtes Brett. Drei Zettel stecken im Rahmen, jeder mit einem anderen ersten Zug._

_Der Kapitän nimmt die drei Zettel vom Rahmen, faltet sie und steckt sie in die Brusttasche. „Dreißig Jahre.“_

_Er zeigt auf die Kordel über dem Steuer._

**Kapitän Fall:** Zieh. Kräftig.

_Ein tiefer Ton rollt über das Wasser. Auf dem Deich drehen sich Leute um und winken._

**Kapitän Fall:** Die Mütze gehört jetzt dir. Ich hab noch zwei, und keine passt mir so gut wie diese.

→ Quest „Das Kapitänsproblem“: Schritt 2 von 2 erledigt

→ Quest abgeschlossen: „Das Kapitänsproblem“

#### 585 · Küstenfähre

`weg-silicon-delacroix.ladung` · keine laufende Quest

_Auf dem Achterdeck stehen Container mit der Aufschrift „Hochwasserhilfe“. Einer ist offen: Sandsäcke, Decken, Konserven._

#### 586 · Küstenfähre

`weg-silicon-delacroix.delfin` · keine laufende Quest

_Neben dem Schiff springt ein Delfin, grau und glänzend, und ist wieder weg. Mama schreit auf wie ein Kind._

#### 587 · Küstenfähre

`weg-silicon-delacroix.seite02` · keine laufende Quest

_An der Reling hat sich ein Blatt Papier verfangen, nass von der Gischt. Darauf eine gezeichnete Stellung._

#### 588 · Küstenfähre

`weg-silicon-delacroix.finch_turm_a` · keine laufende Quest

_Am Kasten der Rettungsringe klebt ein kleiner Fink aus Blech. Hinter dem Deckel liegt ein weißer Turm aus hellem Holz._

_Unter dem Turm ist ein Feld eingebrannt._

#### 589 · Küstenfähre

`weg-silicon-delacroix.schiffskoch` · keine laufende Quest

_In der Kombüse rührt ein Mann mit Kochmütze in einem Topf. Auf der Arbeitsplatte steht ein Brett zwischen Zwiebeln._

**Mr. Ruiz:** Ruiz, Schiffskoch. Zwei Tage bis Port Delacroix, und keiner an Bord spielt mit mir.

_Mama lehnt in der Tür._

**Mama:** Spiel ruhig. Ich hol uns Kaffee.

**Mr. Ruiz:** Zehn Minuten und fünf Sekunden je Zug, solange die Suppe zieht. Eine Stellung, du hast Weiß.

**Kim (Antwort):** „Abgemacht.“\
(andere Antworten: „Nach dem Essen.“)

[Stellungsduell gegen Mr. Ruiz – Ausgang: gewonnen]

#### 590 · Küstenfähre

`weg-silicon-delacroix.schiffskoch` · keine laufende Quest

**Mr. Ruiz:** Du spielst, wie ich koche: nicht zu schnell, nicht zu langsam. Noch eine?

**Kim (Antwort):** „Noch eine.“\
(andere Antworten: „Nicht jetzt.“)

[Stellungsduell gegen Mr. Ruiz, erneut – Ausgang: gewonnen]

#### 591 · Küstenfähre

`weg-silicon-delacroix.kapitaen` · keine laufende Quest

**Kapitän Fall:** Das Horn hört man bis Port Delacroix. Jetzt wissen alle, dass jemand das Brett gelöst hat.

#### 592 · Küstenfähre

`weg-silicon-delacroix.bug` · keine laufende Quest

_Mama steht viel an der Reling. Ihr beide spielt auf Junos Reisebrett, das bei jedem Wellenschlag verrutscht. Sie gewinnt öfter._

_Ambrose steht am Bug. Früher bedachte er deine Fehler mit einem Seufzen. Jetzt sagt er die Zugnummer._

**Ambrose:** Zug vierzehn.

**Kim (Antwort):** „Was war da?“

**Ambrose:** Der Läufer. Es gab einen besseren.

**Kim (Antwort):** „Welchen?“

**Ambrose:** Den, den sie gespielt hätte.

_Er sagt „sie“. Wie bei einem Menschen._

_Vorn kommt die Küste als brauner Strich aus dem Dunst._

#### 593 · Deichweg

`weg-silicon-delacroix.fund_muschel` · keine laufende Quest

_Im Sand am Deich liegt eine Muschel mit einem kleinen, runden Loch, wie für eine Kette gemacht._

**Ambrose:** Meine Schwester sammelte solche. Sie fädelte sie auf und trug sie sonntags.

#### 594 · Deichweg

`weg-silicon-delacroix.pumpenhaus` · keine laufende Quest

_Im Pumpenhaus brummt eine alte Pumpe. An der Tür hängt ein Zettel: „Läuft. Bitte nicht treten.“_

#### 595 · Deichweg

`weg-silicon-delacroix.spur_pm3` · keine laufende Quest

_Neben dem weißen Messwagen liegt eine Mappe im Gras. Auf dem Deckel: „Hochwasserhilfe: 40 Bildschirmtische, Nutzerdaten Port Delacroix“._

#### 596 · Deichweg

`weg-silicon-delacroix.guidry` · keine laufende Quest

_Am Deich stapeln Männer und Frauen in Gummistiefeln Sandsäcke. Einer richtet sich auf, die Hand im Kreuz._

**Mr. Guidry:** Ein Loch im Deich ist wie ein Loch in einer Kette. Man stopft es, bevor es größer wird. Hinterher ist man immer klüger.

#### 597 · Küstenfähre

`weg-silicon-delacroix.fund_flaschenpost` · keine laufende Quest

_An der Reling glitzert nur noch Gischt._

#### 598 · Küstenfähre

`weg-silicon-delacroix.ereignis_kapitaen` · keine laufende Quest

_An der Wand der Kajüte hängt das Brett. Unter dem Rahmen steht mit Kreide: „Gelöst.“_

#### 599 · Küstenfähre

`weg-silicon-delacroix.ladung` · keine laufende Quest

_Die Container stehen gut verzurrt. Hochwasserhilfe für Port Delacroix._

#### 600 · Küstenfähre

`weg-silicon-delacroix.delfin` · keine laufende Quest

_Das Wasser ist ruhig. Am Bug steht Ambrose und sieht nach vorn._

#### 601 · Küstenfähre

`weg-silicon-delacroix.seite02` · keine laufende Quest

_An der Reling flattert nichts mehr._

#### 602 · Küstenfähre

`weg-silicon-delacroix.finch_turm_a` · keine laufende Quest

_Im Kasten liegen nur noch die Rettungsringe._

#### 603 · Küstenfähre

`weg-silicon-delacroix.kapitaen` · keine laufende Quest

**Kapitän Fall:** Neue Zettel? Nein. Ich hänge nur noch das Brett auf. Und deinen Namen daneben.

#### 604 · Küstenfähre

`weg-silicon-delacroix.zurueck_silicon` · keine laufende Quest

_Die Fähre legt bald wieder ab, zurück nach Silicon Bay._

#### 605 · Küstenfähre

`weg-silicon-delacroix.kapitaen` · keine laufende Quest

**Kapitän Fall:** Mein Vorgänger hätte gelacht. Er hat immer gesagt, die Lösung sitzt irgendwann an Bord.

#### 606 · Deichweg

`weg-silicon-delacroix.fund_muschel` · keine laufende Quest

_Am Deich liegen nur noch Kiesel._

#### 607 · Deichweg

`weg-silicon-delacroix.pumpenhaus` · keine laufende Quest

_Die Pumpe brummt. Das Wasser fließt dahin, wo es hingehört._

#### 608 · Deichweg

`weg-silicon-delacroix.spur_pm3` · keine laufende Quest

_Der Messwagen steht verschlossen in der Marsch._

#### 609 · Deichweg

`weg-silicon-delacroix.guidry` · keine laufende Quest

**Mr. Guidry:** Die Stadt steht wieder auf. Langsam. Aber sie steht.

#### 610 · Deichweg

`weg-silicon-delacroix.guidry` · keine laufende Quest

**Mr. Guidry:** Jeder Sandsack zählt. Jeder Bauer auch.

#### 611 · Deichweg

`port-delacroix-aussen.ankunft_zu_fuss` · keine laufende Quest

**Ambrose:** Diese Luft. Salz und Holz. Und Teer. Und etwas Süßes, das fault: die Magnolien. Ich kenne diese Luft.

**Kim (Antwort):** „Du bist hier geboren.“

**Ambrose:** Ich bin hier weggegangen. Das ist nicht dasselbe.

_Schmale Häuser mit Balkonen aus geschmiedetem Eisen, Fensterläden in Grün und Blau, Palmen. Auf vielen Dächern liegen Planen._

_An den Hauswänden läuft in Hüfthöhe ein brauner Strich entlang, von Haus zu Haus, schnurgerade._

**Kim (Antwort):** „Was ist das?“

**Mama:** Da stand das Wasser.

_Am Kai ist eine Lücke. Mauern ohne Dach, durch die leeren Fenster sieht man den Himmel._

_Über dem Eingang hängt ein Schild an einer einzigen Schraube: „Maison de Musique. Club d'Échecs, depuis 1889.“_

**Ambrose:** Das Musikhaus. Mein Vater hat die Orgel darin gestimmt.

**Ambrose:** Ich habe unter der Empore gesessen und gewartet, bis er fertig war.

**Kim (Antwort):** Warten

_Er macht einen Schritt darauf zu. Dann noch einen._

_Aus einem Zelt neben der Ruine kommt eine Trompete, erst langsam, dann plötzlich schnell, als könne sie sich nicht entscheiden._

**Mama:** Ich geh zum Notzelt, da brauchen sie Hände. Das Turnier ist in der Turnhalle. Wir sehen uns heute Abend.

### Port Delacroix

#### 612 · Port Delacroix, Kai

`port-delacroix-aussen.gebaeckstand` · keine laufende Quest

_Vor der Turnhalle steht ein Gebäckstand, Puderzucker überall. Eine alte Dame wischt sich die Hände an der Schürze ab._

**Mrs. Arceneaux:** Arceneaux. Wer hilft, bekommt Gebäck. Wer nicht hilft, bekommt auch Gebäck, aber mit schlechtem Gewissen.

**Mrs. Arceneaux:** Karten hab ich auch. Der Erlös geht ins Musikhaus.

[Laden: Gebäckstand von Mrs. Arceneaux]

#### 613 · Port Delacroix, Kai

`port-delacroix-aussen.brett_haus1` · keine laufende Quest

_Ein Haus mit neu gestrichener Tür. Drinnen räumt jemand Kisten._

#### 614 · Port Delacroix, Kai

`port-delacroix-aussen.bauzaun` · keine laufende Quest

_Ein Bauzaun mit blauer Plane vor dem Musikhaus. Ein Schild: „Betreten verboten. Musik erlaubt.“_

#### 615 · Port Delacroix, Kai

`port-delacroix-aussen.batiste` · keine laufende Quest

_Am Kai liegt ein Boot kieloben auf zwei Böcken. Ein Mann streicht Pech in die Fugen. Auf einem Eimer steht ein Brett._

**Mr. Batiste:** Neu hier, mit Rucksack. Das sieht man.

**Kim (Antwort):** „Ja.“

**Mr. Batiste:** Wer weit gefahren ist, braucht eine Pause. Ich hab eine, gleich hier.

**Mr. Batiste:** Setz dich. Ohne Uhr. Uhren sind was für Leute, die irgendwohin müssen.

_Eine Stellung, in der nichts hängt und alles davon abhängt, welchen Bauern man wohin stellt. Er redet beim Spielen, über das Wasser._

**Kim (Antwort):** „Gut.“\
(andere Antworten: „Nicht jetzt.“)

[Stellungsduell gegen Mr. Batiste – Ausgang: gewonnen]

#### 616 · Port Delacroix, Kai

`port-delacroix-aussen.batiste` · keine laufende Quest

_Du gewinnst nicht schön. Aber du gewinnst._

**Mr. Batiste:** Na also. Ganz ohne Uhr.

**Mr. Batiste:** Mach ein Gesicht wie das Wasser. Dann weiß keiner, was darunter ist. Auch du nicht, eine Weile.

_Er schiebt dir zwei Karten über das Brett. Eine für einen zweiten Versuch, eine mit einem Bauern und einer Kompassnadel._

**Mr. Batiste:** Welchen Bauern man wohin stellt. Das ist das Ganze.

**Kim (Antwort):** „Noch eine Partie.“\
(andere Antworten: „Danke, Mr. Batiste.“)

[Stellungsduell gegen Mr. Batiste, erneut – Ausgang: gewonnen]

#### 617 · Port Delacroix, Kai

`port-delacroix-aussen.arceneaux` · keine laufende Quest

**Mrs. Arceneaux:** Beignets, frisch aus dem Fett! Für Helfer die Hälfte.

[Laden: Gebäckstand von Mrs. Arceneaux]

#### 618 · Port Delacroix, Kai

`port-delacroix-musikhaus.blaeser` · keine laufende Quest

_In der Ruine liegt ein verbeultes Notenpult. Noch spielt hier niemand._

#### 619 · Turnhalle

`port-delacroix-turnhalle.spendenkasse` · Quest „Ohne Ambrose“, Schritt 1 von 4: In der Turnhalle mit dem Club reden.

→ Quest begonnen: „Ohne Ambrose“

_Eine Blechdose mit Schlitz: „Für das Musikhaus.“ Darin Münzen, ein Knopf und eine Busfahrkarte._

#### 620 · Turnhalle

`port-delacroix-turnhalle.notenheft` · Quest „Ohne Ambrose“, Schritt 1 von 4

_Ein Notenheft, aufgequollen vom Hochwasser. Auf dem Umschlag steht in Bleistift: „Nicht wegwerfen. Spielt noch.“_

#### 621 · Turnhalle

`port-delacroix-turnhalle.plakat_turnhalle` · Quest „Ohne Ambrose“, Schritt 1 von 4

_Ein handgemaltes Plakat an der Wand: „Wir spielen weiter. Jeden Abend, solange das Licht reicht.“_

#### 622 · Turnhalle

`port-delacroix-turnhalle.odile` · Quest „Ohne Ambrose“, Schritt 1 von 4

_Das Turnier ist in der Turnhalle der Schule. Unter dem Basketballkorb stehen Klapptische, die Bretter passen nicht zusammen._

_Wenn jemand Fremdes hereinkommt, wird es einen Moment leiser. Du bist fremd hier, mit fünf Nadeln, eine aus Glas._

**Remy:** Aus Silicon Bay. Die waren hier, nach dem Sturm. Mit einem Lastwagen. Wir dachten, die bringen Decken.

**Remy:** Bildschirme haben sie gebracht. Zwanzig Stück. Damit die Kinder etwas zu tun haben.

_Er stößt seinen Trompetenkasten mit dem Fuß an._

**Remy:** Hier hilft man mit den Händen.

**Kim (Antwort):** Zum ersten Brett gehen

_Die erste Runde gewinnst du, die zweite endet remis. In der dritten sitzt dir Remy gegenüber._

_Er baut eine Mauer aus Bauern. Nach fünfunddreißig Zügen stehst du sehr viel schlechter._

_Du zählst. Es hilft nicht. Es hängt nichts, es gibt nur diese Mauer, und sie kommt näher._

**Kim (Antwort):** „Ambrose. Bitte.“

_Eine Pause. Dann seine Stimme, flach, schnell, als läse er etwas ab._

**Ambrose:** König nach h1.

**Kim (Antwort):** „Was?“

**Ambrose:** König. Eine Ecke weiter. Jetzt.

_Dein König scheint sicher zu stehen. Ihn zu bewegen ergibt für dich keinen Sinn._

**Kim (Antwort):** „Warum?“

**Ambrose:** Spiel es.

_Seit dem Dachboden hast du keinen Zug gespielt, den du nicht verstehst. Du spielst ihn._

_Sechs Züge später steht dein König nicht mehr auf der Linie, auf die alles zielt. Dein Turm geht durch Remys Mauer._

_Er verliert in zwölf Zügen. Er begreift es in dreien._

_Er steht auf. Der Stuhl fällt um._

**Remy:** Das ist unmöglich. Den Zug findet keiner. König in die Ecke, ohne Grund.

**Remy:** Du hast dich runtergebeugt. Du hast in deinen Rucksack geflüstert. Was ist da drin?

**Kim (Antwort):** Den Rucksack aufmachen

_Die ganze Halle sieht dich an. Am Rand steht Mama im Kittel aus dem Notzelt, eine Hand vor dem Mund._

_Du ziehst das Brett heraus. Altes Holz, dunkle Ecken._

**Kim (Antwort):** „Es ist nur ein Brett.“

**Remy:** Dann rede ich auch mit meinem.

**Remy:** Du schummelst. Wie die mit ihren Bildschirmen. Nur altmodischer.

_Du hast den Zug nicht verstanden. Du hast ihn gespielt, weil man ihn dir gesagt hat. Achtundneunzig Prozent._

**Kim (Antwort):** „Ambrose. Sag etwas.“

_Er sieht nicht Remy an und nicht dich. Er sieht auf den König in der Ecke._

**Ambrose:** Er hat nicht ganz unrecht.

_Nur du hörst es. Es ist das Schlimmste, was er je zu dir gesagt hat._

**Kim (Antwort):** „Das war ihr Zug. Von dem Tablet.“

**Ambrose:** Er war richtig.

**Kim (Antwort):** „Er war nicht meiner!“

_Die Halle hört es. Sie versteht es nicht, aber sie hört es._

_Du nimmst das Brett in beide Hände. Es ist so schwer wie am ersten Tag._

**Kim (Antwort):** „Dann spiele ich ohne dich.“

_Er antwortet nicht. Er nickt, ein einziges Mal, wie jemand, der ein Urteil annimmt._

_Am Schiedsrichtertisch sitzt eine Frau mit weißem Haar. Du legst das Brett vor sie hin._

**Kim (Antwort):** „Ich gebe die Partie auf. Die gegen ihn.“

**Kim (Antwort):** „Schreiben Sie null. Das Brett bleibt, solange ich spiele.“

_Sie sieht dich lange an. Sie hat sehr ruhige Hände._

**Miss Odile:** Das Wasser hat das Haus genommen, nicht die Musik. Setz dich, Kind. Wir fangen neu an.

_Draußen auf den Stufen setzt Mama sich neben dich. Sie fragt nichts. Sie riecht nach Desinfektionsmittel und Meer._

**Mama:** Ich weiß, wie sich das anfühlt. Wenn eine ganze Halle dich ansieht.

**Mama:** Fast.

_Aus dem Zelt neben der Ruine kommt die Trompete. Sie spielt nur das Langsame._

→ Quest „Ohne Ambrose“: Schritt 1 von 4 erledigt

#### 623 · Turnhalle

`port-delacroix-turnhalle.remy` · Quest „Ohne Ambrose“, Schritt 2 von 4: Remys Aufgaben zu Bauernstrukturen lösen.

_Remy poliert seine Trompete und sieht dich nicht an._

**Remy:** Du willst um die Nadel spielen? Dann zeig mir, dass du Bauern verstehst. Ohne Flüstern.

**Kim (Antwort):** „Gib mir deine Aufgaben.“\
(andere Antworten: „Nicht jetzt.“)

[Aufgaben von Remy (portDelacroix.reiheRemy) – Ausgang: bestanden]

→ Quest „Ohne Ambrose“: Schritt 2 von 4 erledigt

#### 624 · Turnhalle

`port-delacroix-turnhalle.remy` · Quest „Ohne Ambrose“, Schritt 3 von 4: Lous Aufgaben zu Plänen lösen.

**Remy:** Perfect Move wollte uns Bildschirme schenken. Wir wollten ein Dach.

#### 625 · Turnhalle

`port-delacroix-turnhalle.lou` · Quest „Ohne Ambrose“, Schritt 3 von 4

_Ein Mädchen sortiert Muscheln in eine Eierschachtel, eine Sorte pro Fach._

**Lou:** Lou. Ich sammle Muscheln und Pläne.

**Lou:** Ich hab einen Plan. Er ist noch nicht fertig, aber er ist gut.

**Lou:** Findest du in meinen Stellungen auch einen? Mit Läufern. Läufer sind wichtig für Pläne.

**Kim (Antwort):** „Zeig her.“\
(andere Antworten: „Nicht jetzt.“)

[Aufgaben von Lou (portDelacroix.reiheLou) – Ausgang: bestanden]

→ Quest „Ohne Ambrose“: Schritt 3 von 4 erledigt

#### 626 · Turnhalle

`port-delacroix-turnhalle.lou` · Quest „Ohne Ambrose“, Schritt 4 von 4: Den Clubkampf gegen Miss Odile gewinnen, ohne Karten.

**Lou:** Du hast in jeder Stellung einen gefunden. Einen Plan, meine ich.

_Aus der Eierschachtel, zwischen zwei Muscheln, zieht sie eine Karte: ein Brett mit einem Pfeil zu einem Flügel._

**Lou:** Erst fragen, wo. Dann wie. Die ist für dich. Ich hab den Plan ja schon im Kopf.

#### 627 · Port Delacroix, Kai

`port-delacroix-aussen.gebaeckstand` · Quest „Ohne Ambrose“, Schritt 4 von 4

**Mrs. Arceneaux:** Remy ist mein Enkel. Er ist hitzig, aber ein guter Junge.

[Laden: Gebäckstand von Mrs. Arceneaux]

#### 628 · Port Delacroix, Kai

`port-delacroix-aussen.bauzaun` · Quest „Ohne Ambrose“, Schritt 4 von 4

_Hinter dem Bauzaun hämmert jemand. Das Musikhaus wird wieder._

#### 629 · Port Delacroix, Kai

`port-delacroix-aussen.batiste` · Quest „Ohne Ambrose“, Schritt 4 von 4

**Mr. Batiste:** Gut gespielt. Keine Worte, nur Züge. So mag ich das.

**Kim (Antwort):** „Danke, Mr. Batiste.“\
(andere Antworten: „Noch eine Partie.“)

#### 630 · Klavierwerkstatt Whitlock-Duval

`port-delacroix-werkstatt.werkbank` · Quest „Ohne Ambrose“, Schritt 4 von 4

→ Quest begonnen: „Erinnerung: Die Werkstatt, 1852“

_Eine alte Werkbank voller Späne. Henri arbeitet hier. Du hast keinen Grund, sie anzufassen._

#### 631 · Klavierwerkstatt Whitlock-Duval

`port-delacroix-werkstatt.foto_wand` · Quest „Ohne Ambrose“, Schritt 4 von 4

_An der Wand hängt ein altes Foto in einem ovalen Rahmen, braun und blass. Henri weiß sicher, wer darauf ist._

#### 632 · Klavierwerkstatt Whitlock-Duval

`port-delacroix-werkstatt.laptop` · Quest „Ohne Ambrose“, Schritt 4 von 4

_Célestes Laptop, zwischen Hobelspänen. Auf dem Bildschirm Tonspuren in bunten Streifen, daneben ein Zettel: „Nicht anfassen. Ich weiß, wo alles ist.“_

#### 633 · Klavierwerkstatt Whitlock-Duval

`port-delacroix-werkstatt.henri` · Quest „Ohne Ambrose“, Schritt 4 von 4

_Ein Mann mit Sägemehl in den Augenbrauen kommt dir entgegen. Er lacht viel und arbeitet dabei weiter._

**Henri Whitlock-Duval:** Henri Whitlock-Duval. Klavierbauer, seit sechs Generationen.

**Henri Whitlock-Duval:** Meine Großmutter hat im Musikhaus Klavier gespielt, wenn die Herren ihre Partien hatten. Das einzige Publikum, das nie klatscht und nie geht.

**Henri Whitlock-Duval:** Ein Klavier hat zweihundertdreißig Saiten. Ihr Spiel hat nur vierundsechzig Felder? Klingt erholsam.

#### 634 · Klavierwerkstatt Whitlock-Duval

`port-delacroix-werkstatt.celeste` · Quest „Ohne Ambrose“, Schritt 4 von 4

_Ein Mädchen mit Kopfhörern tippt auf einem Laptop. Sie nickt dir zu und tippt weiter._

#### 635 · Altes Musikhaus

`port-delacroix-musikhaus.schild` · Quest „Ohne Ambrose“, Schritt 4 von 4

_Durch das Dach fällt Regen. An der Wand lehnt das Schild vom Eingang, die Buchstaben halb abgeblättert._

_„Maison de Musique. Club d'Échecs, depuis 1889.“ Darunter Schlamm, bis auf Kniehöhe._

#### 636 · Altes Musikhaus

`port-delacroix-musikhaus.loch_im_dach` · Quest „Ohne Ambrose“, Schritt 4 von 4

_Über dir ein Loch im Dach, so groß wie ein Tisch. Ein Lichtstreifen fällt auf die Dielen, mitten in eine Pfütze._

#### 637 · Port Delacroix, Kai

`port-delacroix-aussen.deich` · Quest „Ohne Ambrose“, Schritt 4 von 4

_Zurück auf den Deichweg zur Fähre._

### Küste nach Port Delacroix

#### 638 · Deichweg

`port-delacroix-aussen.ankunft_zu_fuss` · Quest „Ohne Ambrose“, Schritt 4 von 4

_Der Deichweg endet am Kai von Port Delacroix. An allen Häusern läuft der braune Strich entlang._

### Port Delacroix

#### 639 · Turnhalle

`port-delacroix-turnhalle.spendenkasse` · Quest „Ohne Ambrose“, Schritt 4 von 4

_In der Kasse klimpert es. Jemand hat einen Zettel dazugelegt: „Für neue Bretter.“_

#### 640 · Turnhalle

`port-delacroix-turnhalle.notenheft` · Quest „Ohne Ambrose“, Schritt 4 von 4

_Das Notenheft trocknet. Die Seiten wellen sich, die Töne bleiben._

#### 641 · Turnhalle

`port-delacroix-turnhalle.plakat_turnhalle` · Quest „Ohne Ambrose“, Schritt 4 von 4

_„Wir spielen weiter.“ Jemand hat ein Herz daneben gemalt._

#### 642 · Turnhalle

`port-delacroix-turnhalle.odile` · Quest „Das Musikhaus am Kai“, Schritt 1 von 4: Bei vier Häusern der Stadt Bretter sammeln.

_Die Frau mit dem weißen Haar heißt Miss Odile. Sie ist Musiklehrerin und leitet den Club seit dreißig Jahren._

_Sie legt dein Brett in einen leeren Geigenkasten und schließt den Deckel._

**Miss Odile:** Da liegt es trocken. Hol es, wenn du es brauchst. Nicht vorher.

**Kim (Antwort):** Nicken

_Sie gibt dir einen Handkarren._

**Miss Odile:** Wir haben elf Bretter für vierzig Kinder. Vor dem Sturm hatte jede Familie hier eines. Geh fragen.

**Miss Odile:** Remy und Lou hast du hinter dir. Wenn du um die Nadel spielen willst: Ich bin hier.

→ Quest begonnen: „Das Musikhaus am Kai“

#### 643 · Turnhalle

`port-delacroix-turnhalle.lou` · Quest „Ohne Ambrose“, Schritt 4 von 4: Den Clubkampf gegen Miss Odile gewinnen, ohne Karten.

**Lou:** Wenn das Musikhaus fertig ist, kriege ich ein Regal für meine Muscheln.

#### 644 · Port Delacroix, Kai

`port-delacroix-aussen.brett_haus1` · Quest „Ohne Ambrose“, Schritt 4 von 4

_Ein alter Mann gibt dir ein Brett, dessen eine Hälfte heller ist als die andere._

_„Die dunkle Seite stand im Wasser. Spielt sich noch.“_

_1 von vier Häusern. Aus jedem zweiten Haus kommt Hämmern._

_An fremde Türen klopfen, in einer Stadt, in der es gestern hieß, du schummelst. Niemand schlägt die Tür zu._

_Es redet niemand neben dir. Es sagt niemand „Zug vierzehn“._

_Es ist still in deinem Kopf, zum ersten Mal seit dem Sommer. Es ist gut._

_Und es ist, wie wenn ein Zahn fehlt._

#### 645 · Port Delacroix, Kai

`port-delacroix-aussen.brett_haus2` · Quest „Ohne Ambrose“, Schritt 4 von 4

_Eine Frau mit einem Säugling auf dem Arm bringt Figuren in einem Marmeladenglas. Zwei Bauern fehlen._

_Sie hat Muscheln dazugelegt._

_2 von vier Häusern. Aus jedem zweiten Haus kommt Hämmern._

#### 646 · Port Delacroix, Kai

`port-delacroix-aussen.brett_haus3` · Quest „Ohne Ambrose“, Schritt 4 von 4

_In der Rue des Facteurs hängt ein Brett an der Wand eines Wohnzimmers wie ein Bild. Ein Junge steigt auf einen Stuhl und hängt es ab._

_„Das hat mein Großvater geschnitzt. Nimm es. An der Wand spielt keiner.“_

_3 von vier Häusern. Aus jedem zweiten Haus kommt Hämmern._

#### 647 · Port Delacroix, Kai

`port-delacroix-aussen.brett_haus4` · Quest „Das Musikhaus am Kai“, Schritt 1 von 4: Bei vier Häusern der Stadt Bretter sammeln.

_Im Fenster eines Hauses mit neuer Tür steht ein Marmorbrett. Die Besitzerin trägt es dir selbst hinaus._

_Jemand reicht dir im Vorbeigehen etwas Heißes in einer Serviette, Teig mit Zucker, ohne zu fragen, wer du bist._

_In der Turnhalle sortiert Miss Odile, was du gebracht hast. Was nicht zusammenpasst, legt sie auch zusammen._

_Sie singt dabei leise, etwas auf Französisch, das klingt, als wäre es sehr alt._

_Remy stimmt am anderen Ende seine Trompete. Er sieht auf den Karren. Dann sieht er weg._

**Kim (Antwort):** Zum Zelt gehen

_Am Abend liegt an deinem Platz im Zelt eine Postkarte. Vorn eine Brücke im Regen._

_„Maple Falls! Wir spielen jetzt unter der alten Steinbrücke. Dach haben wir, Wände nicht. Tamsin sagt, das zählt als Pavillon.“_

_„Elf Kinder letzten Samstag. Der Stein liegt in der Mitte. Bring den Springer mal vorbei, er fehlt uns. – S.“_

_Du liest sie dreimal._

_Dann baust du auf Junos Reisebrett die Stellung von Batiste auf und spielst sie allein durch, bis du verstehst, was du getan hast._

→ Quest „Das Musikhaus am Kai“: Schritt 1 von 4 erledigt

#### 648 · Klavierwerkstatt Whitlock-Duval

`port-delacroix-werkstatt.foto_wand` · Quest „Ohne Ambrose“, Schritt 4 von 4: Den Clubkampf gegen Miss Odile gewinnen, ohne Karten.

_Das Foto hängt schief. Henri weiß sicher, wer darauf ist._

#### 649 · Klavierwerkstatt Whitlock-Duval

`port-delacroix-werkstatt.laptop` · Quest „Ohne Ambrose“, Schritt 4 von 4

_Die bunten Streifen auf dem Bildschirm laufen weiter. Ein Takt wiederholt sich._

#### 650 · Klavierwerkstatt Whitlock-Duval

`port-delacroix-werkstatt.henri` · Quest „Ohne Ambrose“, Schritt 4 von 4

_Henri stimmt ein Klavier. Er hebt kurz die Hand, ohne aufzusehen._

#### 651 · Port Delacroix, Kai

`port-delacroix-aussen.brett_haus1` · Quest „Ohne Ambrose“, Schritt 4 von 4

_Hier warst du schon. Jemand winkt dir aus dem Fenster zu._

#### 652 · Port Delacroix, Kai

`port-delacroix-aussen.arceneaux` · Quest „Ohne Ambrose“, Schritt 4 von 4

**Mrs. Arceneaux:** Das Musikhaus kommt wieder. Die Kuchen für die Eröffnung hab ich schon bei mir selbst bestellt.

[Laden: Gebäckstand von Mrs. Arceneaux]

#### 653 · Altes Musikhaus

`port-delacroix-musikhaus.loch_im_dach` · Quest „Ohne Ambrose“, Schritt 4 von 4

_Durch das Loch im Dach fällt Licht auf die nassen Dielen._

#### 654 · Turnhalle

`port-delacroix-turnhalle.odile` · Quest „Ohne Ambrose“, Schritt 4 von 4

**Miss Odile:** In der Rue des Facteurs wohnt ein Klavierbauer. Der hat Leim, den guten, für die Bretter, die sich verzogen haben.

_Den Geigenkasten gibt sie dir mit._

**Kim (Antwort):** „Er ist schwer.“

**Miss Odile:** Das soll er sein.

#### 655 · Turnhalle

`port-delacroix-turnhalle.remy` · Quest „Ohne Ambrose“, Schritt 4 von 4

**Remy:** Tonleitern. Jeden Tag. Auch ohne Dach.

#### 656 · Turnhalle

`port-delacroix-turnhalle.lou` · Quest „Ohne Ambrose“, Schritt 4 von 4

**Lou:** Diese Muschel hat elf Rillen. Die hier zwölf. Das ist ein Plan, glaube ich.

#### 657 · Klavierwerkstatt Whitlock-Duval

`port-delacroix-werkstatt.werkbank` · Quest „Ohne Ambrose“, Schritt 4 von 4

_Über der Tür hängt ein Schild, neuer als die anderen, die Buchstaben alt: „Whitlock-Duval. Facteurs de pianos depuis 1826.“_

_Frisch gehobeltes Holz. Leim, warm. Etwas Harziges. Ein Geruch, den du kennst, ohne ihn zu kennen._

_Im Geigenkasten unter deinem Arm bewegt sich nichts. Du hörst ihn, zum ersten Mal seit fünf Tagen._

**Ambrose:** Hier. Hier war es.

_Mehr nicht. Aber die Werkstatt wird golden._

**Kim (Antwort):** Mitgehen\
(andere Antworten: Zurück in die Gegenwart)

_Du bist klein. Der Boden ist nah. Um dich liegen Späne, helle Locken, knöcheltief._

_„Fegen, Ambrose. Nicht spielen.“ Ein Mann schlägt eine Saite an, lauscht, dreht an etwas, schlägt wieder an._

**Kim (Antwort):** „Papa. Was machst du da?“

_„Ich suche den Ton. Er ist da drin. Man muss ihm nur helfen.“_

_Du stellst Klötzchen aus Tastenholz auf die Werkbank. Er legt das Werkzeug hin und ritzt acht mal acht Linien in ein Abfallbrett._

_Das größte ist der König. Das gerade der Turm. Das schiefe, beim Sägen verrutscht, ist das Pferd._

_„Ein Klavier und ein Schachbrett haben eines gemeinsam, Ambrose. Jede Taste, jede Figur muss ihren Platz kennen. Dann klingt es.“_

**Kim (Antwort):** Die Späne fliegen auf

_Du bist groß. Die Stiefel aus London drücken. Der Mann an der Werkbank hat graues Haar._

_Auf einem Schemel sitzt ein Mädchen von vielleicht acht Jahren, in einem Kleid mit Leimflecken. „Zeig es noch mal. Das mit dem Turm.“_

_Auf der Werkbank steht ein Brett, helles Holz und dunkles, die Ecken noch scharf. Der Rand ist glatt und leer._

**Kim (Antwort):** Die Partie vorspielen\
(andere Antworten: Zurück in die Gegenwart)

[Aufgaben von Ambrose (portDelacroix.flashbackWerkstatt) – Ausgang: bestanden]

→ Quest „Erinnerung: Die Werkstatt, 1852“: Schritt 1 von 1 erledigt

→ Quest abgeschlossen: „Erinnerung: Die Werkstatt, 1852“

#### 658 · Klavierwerkstatt Whitlock-Duval

`port-delacroix-werkstatt.werkbank` · Quest „Ohne Ambrose“, Schritt 4 von 4

_„Er lässt ihn stehen? Den ganzen Läufer? Das ist doch Verschwendung.“ – „Das ist Musik, Papa.“_

_Bei jedem Opfer klatscht Claire. Sie versteht nichts davon. Sie klatscht, weil du so strahlst._

**Kim (Antwort):** Claire zusehen

_„Wenn ich groß bin, will ich das Brett haben.“_

_„Es ist meines. Ich habe es gerade erst gebaut.“_

_„Dann eben, wenn du tot bist.“_

_„Claire!“, sagt dein Vater. Du lachst. Du bist einundzwanzig, und du hast alle Zeit der Welt._

**Kim (Antwort):** „Abgemacht. Aber du musst darauf aufpassen.“

_„Ich pass immer auf“, sagt Claire._

_Das Gold verblasst. Du stehst in der Werkstatt, dein Gesicht ist nass, und du weißt nicht, ob es deine Tränen sind._

**Ambrose:** Claire. Sie hat nach Norden geheiratet. In eine Stadt mit einem Wasserfall. Sie hat das Brett geerbt.

**Ambrose:** Sie hat aufgepasst. Und ihre Tochter. Und deren Tochter. Bis zu einer alten Frau, die es sechzig Jahre abgestaubt hat.

**Kim (Antwort):** Warten

**Ambrose:** Deshalb bist du hier.

_Dann schweigt er wieder. Es war sein einer Satz für diesen Tag, und er hat ihn längst verbraucht._

#### 659 · Turnhalle

`port-delacroix-turnhalle.odile` · Quest „Ohne Ambrose“, Schritt 4 von 4

**Miss Odile:** Bauern sind die Melodie. Die Figuren spielen nur dazu.

**Kim (Antwort):** „Ich möchte um die Nadel spielen.“\
(andere Antworten: „Bis später, Miss Odile.“)

_Die Turnhalle ist voll. Sie sind alle gekommen, um zu sehen, wer da in einen Rucksack flüstert._

_Du stellst den Geigenkasten auf den Schiedsrichtertisch, geschlossen. Deine Karten liegen daneben, mit dem Bild nach unten._

_Miss Odile setzt sich dir gegenüber, in einem Kleid mit kleinen Notenschlüsseln._

**Miss Odile:** Ein Plan ist kein Sprint. Ich spiele langsam. Du wirst denken, es passiert nichts.

**Miss Odile:** Es passiert die ganze Zeit etwas. Hör auf die Bauern.

**Kim (Antwort):** Die Hände auf den Tisch legen

_Bevor ihr anfangt, hörst du ihn. Aus dem Kasten, drei Meter entfernt. Drei Wörter._

**Ambrose:** Spiel deine Partie.

_Dann ist er fort, und du bist allein mit vierundsechzig Feldern._

**Kim (Antwort):** „Ich bin bereit.“\
(andere Antworten: „Noch nicht.“)

[Partie gegen Miss Odile – Ausgang: gewonnen]

→ Quest „Ohne Ambrose“: Schritt 4 von 4 erledigt

→ Quest abgeschlossen: „Ohne Ambrose“

#### 660 · Turnhalle

`port-delacroix-turnhalle.odile` · keine laufende Quest

_Ein Plan. Dein erster. Er war hässlich und langsam, und er gehört dir._

_Miss Odile sieht es an. Sie nickt, im Takt von etwas, das nur sie hört._

**Miss Odile:** Der Königsflügel. Immer mein Königsflügel. Mein Mann hat mir das vierzig Jahre lang gesagt.

_Sie steht auf. Sie ist nicht groß. Aber als sie steht, steht die ganze Halle mit ihr._

**Miss Odile:** Das war deine Partie. Jeder hier hat es gesehen.

_Niemand klatscht. Aber Gesichter, die dich vor einer Woche nicht angesehen haben, sehen dich an._

_Remy steht an der Wand, die Trompete unter dem Arm. Er sagt nichts. Er nickt. Einmal._

_Die Nadel ist eine kleine Lyra aus Messing, grün angelaufen, wo das Salzwasser war. Miss Odile steckt sie dir an, neben das Glas._

**Kim (Antwort):** Zum Schiedsrichtertisch gehen

_Du legst die Hand auf den Geigenkasten. Du öffnest ihn nicht. Noch nicht._

#### 661 · Turnhalle

`port-delacroix-turnhalle.lou` · keine laufende Quest

**Lou:** Miss Odile sagt, ein Plan ist kein Sprint. Ich renne trotzdem gern.

#### 662 · Klavierwerkstatt Whitlock-Duval

`port-delacroix-werkstatt.werkbank` · keine laufende Quest

_Auf der Werkbank liegen Späne. Sie riechen wie vor hundertachtzig Jahren._

#### 663 · Klavierwerkstatt Whitlock-Duval

`port-delacroix-werkstatt.henri` · Quest „Die Familie“, Schritt 1 von 2: Eine Partie gegen Céleste spielen.

_Durch ein Loch im Dach, über das eine Plane gespannt ist, fällt blaues Licht. Die Werkbank steht an derselben Stelle._

**Henri Whitlock-Duval:** Das hier wird Sie interessieren, wenn Sie Schach mögen.

_Ein ovales Foto, sehr alt, braun. Ein junger Mann im Rock mit hohem Kragen, vor ihm ein Schachbrett._

**Henri Whitlock-Duval:** Ein Vorfahr. Keiner weiß mehr, wer. Ein Bruder von irgendwem.

**Henri Whitlock-Duval:** Er soll weggegangen sein, nach New Orleans, und nie wiedergekommen.

**Henri Whitlock-Duval:** Die Familie hat nicht gern von ihm gesprochen. Ein Spieler, hieß es. Ich fand, er sieht nett aus.

**Kim (Antwort):** Das Foto ansehen

_Der Deckel des Geigenkastens ist zu. Du hast ihn nicht angerührt._

**Ambrose:** Das bin ich.

**Kim (Antwort):** Hinsehen

_Du siehst ihn, zum ersten Mal seit sechs Tagen: schmal, hochgeschlossen, blasser als früher._

**Ambrose:** Ich erinnere mich an den Tag. Man musste eine Minute lang nicht atmen. Ich habe an einen Zug gedacht.

_Henri hört ihn nicht. Er leimt._

**Ambrose:** Keiner weiß mehr, wer. Ein Spieler. Sie haben nicht gern von mir gesprochen.

**Kim (Antwort):** „Ambrose …“

**Ambrose:** Nein. Lass. Sechs Generationen. Sie haben weitergemacht. Jede Saite muss stimmen.

**Ambrose:** Mein Vater hätte ihn sehr gemocht.

**Kim (Antwort):** Nichts sagen

_Eine Tür schlägt. Ein Mädchen, fünfzehn vielleicht, ein Skateboard unter dem Arm, Kopfhörer um den Hals._

**Céleste:** Papa, hast du mein Ladekabel … Oh. Besuch. Schach? Das ist doch was für alte Leute.

**Ambrose:** Für sehr alte.

_Du musst lachen. Es ist das erste Mal seit der Turnhalle._

→ Quest begonnen: „Die Familie“

#### 664 · Klavierwerkstatt Whitlock-Duval

`port-delacroix-werkstatt.celeste` · keine laufende Quest

_Céleste sieht auf den Hocker. Du hast den Geigenkasten aufgemacht, ohne es zu merken._

**Céleste:** Das sieht cool aus. Das ist ja richtig alt. Darf ich?

_Sie fährt mit dem Finger über die Buchstaben am Rand: A. W. 1857. Sie hat sein Kinn. Und die Hände._

**Kim (Antwort):** „Kannst du es?“

**Céleste:** Ich weiß, wie die Dinger ziehen. Ungefähr. Also, ich schieb die Pferde einfach rum, okay?

**Céleste:** Aber mit Uhr. Zehn Minuten für jeden. Mein Stück auf dem Laptop läuft noch zwanzig, dann muss ich los.

_Die Stellung, die niemand anrührt, hast du auf Junos Reisebrett übertragen. Er hat genickt._

**Kim (Antwort):** „Okay. Eine Partie.“\
(andere Antworten: „Ein andermal.“)

[Partie gegen Céleste – Ausgang: gewonnen]

→ Quest „Die Familie“: Schritt 1 von 2 erledigt

#### 665 · Klavierwerkstatt Whitlock-Duval

`port-delacroix-werkstatt.celeste` · Quest „Die Familie“, Schritt 2 von 2: Nach der Partie mit Céleste reden.

_Einmal, ganz zufällig, stellt Céleste einen Springer auf ein Feld, auf das er gehört._

**Ambrose:** Hast du das gesehen? Das hat sie von …

_Er bricht ab. Er lächelt über sich selbst._

**Céleste:** Okay. Das war nicht so schlecht. Aber ich geh jetzt skaten.

_Draußen rattert das Skateboard über das Pflaster, kleiner werdend. Ambrose sieht ihr nach._

**Kim (Antwort):** Warten

**Ambrose:** Sie muss es nicht lieben. Es reicht, dass sie einmal gespielt hat. Auf diesem Brett.

**Ambrose:** Ich wollte, dass alles, was ich war, Schach ist. Eine Fußnote, sechs Wörter, und ich war beleidigt.

**Ambrose:** Und hier hängt mein Gesicht an der Wand, keiner weiß, wem es gehört, und sie bauen Klaviere und sind glücklich.

**Kim (Antwort):** „Macht dir das nichts aus?“

**Ambrose:** Doch. Ein wenig. Aber weniger, als ich dachte.

_Er sieht dich an, richtig, zum ersten Mal seit einer weißen, flackernden Nacht._

**Ambrose:** Es reicht, dass es Menschen gibt, die weitermachen. Mit Klavieren.

**Ambrose:** Mit dir.

**Kim (Antwort):** Nichts sagen können

**Ambrose:** Ich schulde dir eine Antwort. Auf eine Frage. Ich habe sie noch nicht.

**Ambrose:** Aber ich weiß jetzt, dass ich sie am falschen Ort gesucht habe.

→ Quest „Die Familie“: Schritt 2 von 2 erledigt

→ Quest abgeschlossen: „Die Familie“

#### 666 · Turnhalle

`port-delacroix-turnhalle.odile` · keine laufende Quest

**Miss Odile:** Hör auf den Takt der Stellung. Nicht auf den Lärm in der Halle.

**Kim (Antwort):** „Revanche um eine bessere Nadel?“\
(andere Antworten: „Was kann ich noch für das Musikhaus tun?“ · „Bis später, Miss Odile.“)

**Miss Odile:** Noch einmal? Gut. Ich spiele wieder langsam.

**Kim (Antwort):** „Ich bin bereit.“\
(andere Antworten: „Noch nicht.“)

[Partie gegen Miss Odile, erneut – Ausgang: gewonnen]

#### 667 · Turnhalle

`port-delacroix-turnhalle.odile` · keine laufende Quest

(noch einmal angesprochen; hier nur, was neu ist)

**Kim (Antwort):** „Was kann ich noch für das Musikhaus tun?“\
(andere Antworten: „Revanche um eine bessere Nadel?“ · „Bis später, Miss Odile.“)

**Miss Odile:** Die Bretter sind da, jetzt brauchen wir Geld für das Dach.

**Miss Odile:** Spielst du ein Simultan gegen die Kinder der Stadt? Jedes Kind gibt einen Dollar in die Kasse.

**Kim (Antwort):** „Ich spiele.“\
(andere Antworten: „Nicht jetzt.“)

_Drei Tische, drei Kinder. Am dritten setzt sich Remy hin, die Arme verschränkt._

[Aufgaben von Miss Odile (portDelacroix.simultan) – Ausgang: bestanden]

→ Quest „Das Musikhaus am Kai“: Schritt 2 von 4 erledigt

#### 668 · Klavierwerkstatt Whitlock-Duval

`port-delacroix-werkstatt.foto_wand` · keine laufende Quest

_Das ovale Foto: ein junger Mann im Rock mit hohem Kragen, vor ihm ein Schachbrett. Er kann es kaum erwarten, dass das Stillsitzen vorbei ist._

#### 669 · Klavierwerkstatt Whitlock-Duval

`port-delacroix-werkstatt.laptop` · keine laufende Quest

_Auf dem Bildschirm läuft jetzt eine Partie. Célestes Figuren stehen sehr weit vorn._

#### 670 · Klavierwerkstatt Whitlock-Duval

`port-delacroix-werkstatt.henri` · keine laufende Quest

**Henri Whitlock-Duval:** Céleste macht Musik mit dem Laptop. Ich verstehe es nicht, aber es hat Takt.

#### 671 · Klavierwerkstatt Whitlock-Duval

`port-delacroix-werkstatt.celeste` · keine laufende Quest

_Céleste ist skaten. Auf ihrem Laptop klebt ein Zettel: „Bin weg. Pferde rumschieben war okay.“_

#### 672 · Turnhalle

`port-delacroix-turnhalle.odile` · Quest „Das Musikhaus am Kai“, Schritt 3 von 4: Nach der Simultan mit Miss Odile reden.

_Jedes Kind legt einen Dollar in die Blechdose. Am dritten Brett verliert Remy knapp, legt seinen Dollar hinein und bleibt sitzen._

**Remy:** Ich hab dich beobachtet. Die ganze Woche. Mit dem Karren. Bei Batiste.

**Remy:** Du redest mit dem Brett. Ich weiß nicht, warum. Aber du spielst allein.

**Remy:** Tut mir leid. Die mit dem Glas haben uns Bildschirme gebracht, als wir Decken gebraucht haben.

**Kim (Antwort):** „Du hattest nicht ganz unrecht. Den Zug fand ich nicht.“

_Remy sieht dich lange an. Dann nimmt er die Trompete aus dem Kasten und spielt das Schnelle._

_Die ganze Halle klatscht im Takt. Mama tanzt mit einem Mann aus dem Notzelt._

_Miss Odile drückt dir eine Karte in die Hand: ein kleiner Engel mit einem Schild._

**Miss Odile:** Damit du nicht wieder etwas verlierst, was dir wichtig ist.

_Sie legt die Hand auf den Geigenkasten an deiner Seite._

**Miss Odile:** Behalt ihn. Er hat lange keine Geige getragen, jetzt hat er wieder was zu tun.

_Du siehst ihn an. Der Deckel steht offen._

→ Quest „Das Musikhaus am Kai“: Schritt 3 von 4 erledigt

#### 673 · Turnhalle

`port-delacroix-turnhalle.remy` · keine laufende Quest

**Remy:** Willst du hören, was ich zur Eröffnung des Musikhauses spiele? Es ist noch nicht fertig.

#### 674 · Altes Musikhaus

`port-delacroix-musikhaus.schild` · keine laufende Quest

_Handwerker decken das Dach. Das Schild lehnt noch an der Wand und wartet._

**Miss Odile:** Das dauert noch, bis zum Frühjahr. Komm wieder, wenn du aus der Wüste zurück bist.

#### 675 · Turnhalle

`port-delacroix-turnhalle.odile` · keine laufende Quest

(noch einmal angesprochen; hier nur, was neu ist)

**Kim (Antwort):** „Noch nicht.“\
(andere Antworten: „Ich bin bereit.“)

**Miss Odile:** Gut. Eine Melodie übt man, bevor man sie spielt.

#### 676 · Turnhalle

`port-delacroix-turnhalle.remy` · keine laufende Quest

**Remy:** Komm zur Eröffnung. Ich spiele, du hängst das Schild auf.

#### 677 · Klavierwerkstatt Whitlock-Duval

`port-delacroix-werkstatt.henri` · keine laufende Quest

**Henri Whitlock-Duval:** Für das Musikhaus stifte ich ein Klavier. Das alte da hinten, es klingt wie ein Gewitter.

#### 678 · Klavierwerkstatt Whitlock-Duval

`port-delacroix-werkstatt.henri` · keine laufende Quest

**Henri Whitlock-Duval:** Das Dach ist fast dicht. Die Klaviere danken es uns.

#### 679 · Klavierwerkstatt Whitlock-Duval

`port-delacroix-werkstatt.celeste` · keine laufende Quest

_Céleste hört Musik und wippt mit dem Fuß. Sie hebt kurz den Daumen._

#### 680 · Turnhalle

`port-delacroix-turnhalle.remy` · keine laufende Quest

**Remy:** Du spielst wie jemand, der was verloren hat. Ich weiß, wie das ist. Der Sturm hat meine Trompete auch fast genommen.

#### 681 · Port Delacroix, Kai

`port-delacroix-aussen.wuestenzug` · keine laufende Quest

_Am Bahnhof steht der Wüstenzug nach Westen. Mama bleibt hier; das Notzelt braucht sie noch zwei Wochen._

**Mama:** Fahr. Du bist in sechs Monaten weitergekommen als ich in fünfundzwanzig Jahren.

**Mama:** Ich hole dich ein.

**Kim (Antwort):** Mama umarmen

_Sie riecht nach Desinfektionsmittel und Meer._

_Im Zug liegt der Geigenkasten neben dir auf dem Sitz. Der Deckel ist offen._

_Ambrose und du redet wenig. Es ist das Schweigen von zwei, die sich gestritten haben und wieder anfangen wollen._

### Durch den Canyon

#### 682 · Canyonpfad

`weg-delacroix-desert.tafel` · Quest „Wieder zusammen“, Schritt 1 von 7: Durch den Canyon nach Desert Springs gehen.

→ Quest begonnen: „Wieder zusammen“

→ Quest begonnen: „Die Tafel im Canyon“

_Am Wanderschild „Desert Springs, 4 Meilen“ hängt eine Rätseltafel, das Blech heiß von der Sonne: „Der König steht im Freien. Greif an!“_

**Kim (Antwort):** Die Aufgaben lösen\
(andere Antworten: Weitergehen)

[Aufgaben von Die Rätseltafel (wegDelacroixDesert.tafel) – Ausgang: bestanden]

→ Quest „Die Tafel im Canyon“: Schritt 1 von 1 erledigt

→ Quest abgeschlossen: „Die Tafel im Canyon“

#### 683 · Canyonpfad

`weg-delacroix-desert.tafel` · Quest „Wieder zusammen“, Schritt 1 von 7

_Auf dem Wanderschild hat jemand mit Kreide einen kleinen Kaktus gemalt. Darunter: „Gelöst“._

#### 684 · Canyonpfad

`weg-delacroix-desert.mira_stein` · Quest „Wieder zusammen“, Schritt 1 von 7

_Die Wände sind rot und gestreift, Schicht über Schicht, als hätte jemand die Zeit aufgeschnitten._

_Eine Eidechse rührt sich nicht. Hoch oben kreist ein Vogel, ohne die Flügel zu bewegen._

_Ambrose ist noch blass, aber er ist da._

**Ambrose:** Ich war nie in einer Wüste.

**Ambrose:** Sie ist so still wie ein Club. Wie ein guter. Einer, in dem man hört, wenn jemand nachdenkt.

**Kim (Antwort):** „Gefällt sie dir?“

**Ambrose:** Ich weiß es noch nicht. Ich bin es nicht mehr gewohnt, etwas nicht sofort zu wissen.

_Er sieht zu dem Vogel hinauf._

**Ambrose:** Es ist angenehm.

_Hinter der nächsten Biegung, mitten im trockenen Bachbett, liegt ein Stein, flach wie ein Tisch. Darauf ein Mädchen, zwei Zöpfe, Schrammen an beiden Knien._

_Sie spielt gegen niemanden. Sie zieht für Weiß, dreht das Brett um, zieht für Schwarz. Ernst wie ein Chirurg._

_Sie hält die weiße Dame einen Atemzug lang in der Luft. Dann stellt sie sie mitten zwischen die schwarzen Figuren._

**Ambrose:** Oh.

_Sie dreht das Brett um und schlägt die Dame. Dreht es wieder. Ein Springer, ein Läufer, und der schwarze König liegt um._

**Ambrose:** Sie spielt wie ich mit zwanzig. Nur besser. Viel besser.

**Ambrose:** Sie zögert nicht. Aber sie rechnet. Sie rechnet, und sie zögert nicht, und …

_Er hört auf. Er hat gemerkt, wie er klingt. Wie vor einem Tablet in einer weißen Nacht._

**Ambrose:** Verzeih.

**Kim (Antwort):** „Schon gut.“

**Ambrose:** Nein. Es ist nicht gut. Aber es ist anders. Siehst du den Unterschied?

**Ambrose:** Ich sehe ihn erst jetzt. Sie hat sich die Knie aufgeschlagen.

_Sie mustert dich, von den Schuhen bis zu den Nadeln._

**Mira:** Wer bist du?

**Kim (Antwort):** „Kim.“

**Mira:** Bist du gut?

**Kim (Antwort):** „Ich werde besser.“

_Sie denkt darüber nach. Es scheint ihr als Antwort zu genügen._

**Mira:** Im Canyon antwortet das Echo. Am Brett nicht. Deshalb mag ich das Brett.

**Mira:** Ich bin Mira. Komm morgen in die Garage. Am Motel.

**Mira:** Wenn du gut bist, spielen wir. Wenn nicht, auch, aber kürzer.

_Sie springt vom Stein und läuft barfuß über den heißen Sand davon, das Brett unter dem Arm._

→ Quest „Wieder zusammen“: Schritt 1 von 7 erledigt

#### 685 · Canyonpfad

`weg-delacroix-desert.fund_eidechsenhaut` · Quest „Wieder zusammen“, Schritt 2 von 7: Am Felsbogen stehen bleiben, wenn es Abend wird.

_Zwischen zwei Steinen liegt eine Eidechsenhaut, dünn wie Papier und ganz heil._

**Ambrose:** Sie lässt ihr Kleid einfach liegen. Donnerwetter.

#### 686 · Canyonpfad

`weg-delacroix-desert.holloway` · Quest „Wieder zusammen“, Schritt 2 von 7

_Eine Frau mit Strohhut füllt am Wanderschild ihre Flasche an einem Rohr, aus dem ein dünner Strahl kommt._

**Mrs. Holloway:** Wer angreift, braucht mehr Figuren am König als der Verteidiger. Sonst ist es kein Angriff, sondern ein Ausflug.

**Mrs. Holloway:** Gilt auch fürs Wandern. Mehr Wasser als Weg.

#### 687 · Canyonpfad

`weg-delacroix-desert.sternwarte_abzweig` · Quest „Wieder zusammen“, Schritt 2 von 7

_Geröll liegt quer über dem Pfad nach oben. Mit dem Streit im Kopf willst du hier nicht klettern._

#### 688 · Canyonpfad

`weg-delacroix-desert.mira_stein` · Quest „Wieder zusammen“, Schritt 2 von 7

_Der flache Stein ist leer. Im Staub sieht man noch die Abdrücke eines Bretts._

#### 689 · Canyonpfad

`weg-delacroix-desert.fund_eidechsenhaut` · Quest „Wieder zusammen“, Schritt 2 von 7

_Zwischen den Steinen sonnt sich eine Eidechse. Sie hat eine neue Haut._

#### 690 · Canyonpfad

`weg-delacroix-desert.holloway` · Quest „Wieder zusammen“, Schritt 2 von 7

**Mrs. Holloway:** Mehr Wasser als Weg.

#### 691 · Felsbogen

`weg-delacroix-desert.versoehnung` · Quest „Wieder zusammen“, Schritt 2 von 7

_Wo der Canyon sich öffnet, steht ein Bogen aus Fels. Ein Tor ohne Mauer, so hoch wie ein Haus._

_Das Licht kommt flach und färbt alles: den Fels, den Sand, deine Hände. Kupfer. Dann Gold._

_Wenn nicht hier, dann nirgends. Du stellst den Geigenkasten auf einen Stein und nimmst das Brett heraus._

**Kim (Antwort):** „Setz dich.“

_Er sieht dich an. Dann setzt er sich, dir gegenüber, auf den Fels. Zum zweiten Mal in seinem Tod. Der Wind geht durch den Bogen._

**Ambrose:** Ich habe einer Maschine zugesehen. Tausendachthundert Partien in einer Nacht.

**Ambrose:** Ich habe zugesehen, weil sie nie zweifelt. Weil sie die Gewissheit hat, bevor man die Hand hebt.

_Du sagst nichts._

**Ambrose:** Dann hat ein Junge mit einer Trompete gesagt, dass du schummelst. Er hatte recht, und es war meine Schuld.

**Ambrose:** Ich habe dir einen Zug gegeben, den ich nicht verstand. Ich habe ihn nur wiedererkannt. Wie ein Papagei.

**Ambrose:** Sechs Tage im Kasten habe ich gehört, wie du nachdenkst. Und ich wusste nicht, was du ziehen wirst.

_Er hebt den Kopf._

**Ambrose:** Ich wusste es nicht, Kim. Zum ersten Mal.

**Ambrose:** Ich habe mir die Nägel abgekaut, die ich nicht habe.

_Das Licht wird röter._

**Ambrose:** Du hast gefragt: Und ich? Ich schulde dir die Antwort.

**Ambrose:** Die Maschine zweifelt nie. Das ist wahr, und es ist schön, und ich nehme nichts davon zurück.

**Ambrose:** Aber ich habe etwas vergessen. Du zweifelst. Du zählst dreimal. Du hast Angst, dass es nicht stimmt.

**Ambrose:** Und dann spielst du trotzdem.

_Seine Stimme bricht._

**Ambrose:** Das ist schöner.

**Ambrose:** Ein Opfer von jemandem, der weiß, dass es stimmt, ist eine Rechnung.

**Ambrose:** Ein Opfer von jemandem, der hofft, dass es stimmt, und es geprüft hat, so gut er kann, und dem dabei das Herz schlägt …

**Ambrose:** Das ist das, wofür der Verlierer zum Telegrafenamt läuft.

**Kim (Antwort):** „Du warst ein Idiot.“

**Ambrose:** Ja.

**Kim (Antwort):** „Ich hab dich vermisst.“

**Ambrose:** Ich dich auch. Und ich war die ganze Zeit drei Schritte neben dir. Das ist das Dümmste daran.

_Die Sonne berührt den Rand der Welt._

**Kim (Antwort):** „Erzähl mir von 1866.“

_Er nickt, als hätte er darauf gewartet._

**Ambrose:** Er hatte Ja gesagt. Zur Revanche. Per Brief, weil er im Norden Brücken baute und ich im Süden saß.

**Ambrose:** Ein Zug, ein Brief. Über ein Jahr. Es war die beste Partie meines Lebens.

**Ambrose:** Ich habe gespielt wie er, gewissenhaft. Und er ein wenig wie ich. Er hat Dinge riskiert, die er 1858 nie riskiert hätte.

**Kim (Antwort):** „Und dann?“

**Ambrose:** Dann wurde es ein Endspiel. Und Winter. Sein neununddreißigster Zug kam nicht. Vier Wochen. Sechs. Acht.

**Ambrose:** Ich dachte, er lässt mich warten, weil er es kann. Ich konnte nicht mehr warten.

**Ambrose:** Ich band die Figuren in der Stellung fest und stieg in eine Kutsche. Nach Norden. Ich wollte ihm ins Gesicht sehen.

**Ambrose:** Elf Tage. In einer Bergbausiedlung bekam ich Fieber. Das Brett stand auf dem Stuhl neben dem Bett.

**Ambrose:** Sein Zug hat mich dort noch erreicht. Ich habe geantwortet. Wie, das erzähle ich dir ein andermal.

**Ambrose:** Ich bin nicht angekommen. Darum warte ich noch.

_Du denkst an einen leeren Umschlag in einem Postsack. An eine senkrechte Schrift._

_Sie sind aneinander vorbeigefahren._

**Ambrose:** Komm.

_Er steht auf. Er ist nicht mehr blass._

**Ambrose:** Ich habe dir das Zählen beigebracht, weil du es brauchtest. Was ich wirklich kann, habe ich dir nie gezeigt.

**Ambrose:** Ich hatte Angst, du würdest es so schlecht machen wie ich. Jetzt kannst du zählen. Jetzt zeige ich es dir.

**Ambrose:** Ein Opfer ist kein Geschenk und kein Kunststück. Es ist ein Tausch. Holz gegen Zeit, Raum oder einen König im Freien.

**Ambrose:** Erste Frage: Wie viele Angreifer am König, wie viele Verteidiger? Du brauchst mehr.

**Ambrose:** Zweite Frage: Hat er einen Zug, der alles hält? Den suchst du. Für ihn. So gründlich, als wärst du er.

**Kim (Antwort):** „Und wenn ich ihn nicht finde?“

**Ambrose:** Dann hoffst du. Und spielst es. Und siehst ihm ins Gesicht.

**Ambrose:** Das ist der Teil, den keine Maschine kann. Sie muss nie hoffen. Arme Maschine.

_Ihr übt, bis das Licht fort ist._

_Im Geigenkasten liegt eine Karte, die du seit Port Delacroix nicht angefasst hast._

_Als ihr absteigt, im letzten Grau, siehst du etwas, das du vorher nicht bemerkt hast._

_Unter dem Felsbogen überspannt eine Brücke die Schlucht, wo sie am engsten ist. Schwarzes Eisen, lauter Dreiecke._

_Auf jeder Niete, klein und sauber: J. H. Am Pfeiler, eingegossen in eine Platte: 1879._

**Kim (Antwort):** „Dreizehn Jahre danach.“

**Ambrose:** Er hat gelebt. Lange. Er hat weitergebaut, bis hierher, ans Ende von allem.

_Er legt die Hand auf das Eisen._

**Ambrose:** Gut so.

→ Quest „Wieder zusammen“: Schritt 2 von 7 erledigt

#### 692 · Felsbogen

`weg-delacroix-desert.fund_nieten` · Quest „Wieder zusammen“, Schritt 3 von 7: Tomás' Aufgaben zu Mattbildern lösen.

_Die Nieten der Brücke glänzen, Reihe um Reihe. Am Pfeiler die Platte: 1879._

#### 693 · Felsbogen

`weg-delacroix-desert.ereignis_seilschaft` · Quest „Die Seilschaft“, Schritt 1 von 1: Die Stellung aus der Wand merken, sie für Wren aufbauen und ihr erzählen, wie es ausgeht.

_Zwei Kletterinnen hängen in der Wand am Felsbogen, eine unten, eine hoch oben. Zwischen ihnen pfeift der Wind._

**Wren Okoro:** Wir spielen eine Partie, ein Zug pro Seillänge. Aber ich höre Tess nicht mehr!

**Tess Ferris:** Ich zeige dir oben die Stellung. Merk sie dir und ruf sie Wren zu!

**Tess Ferris:** Schau genau hin. Unten sieht Wren das Brett nicht.

→ Quest begonnen: „Die Seilschaft“

[Gedächtnisstellung (wegDelacroixDesert.seilschaft) – Ausgang: bestanden]

#### 694 · Felsbogen

`weg-delacroix-desert.ereignis_seilschaft` · Quest „Die Seilschaft“, Schritt 1 von 1

_Das Echo trägt deine Züge durch den Canyon. Unten nickt Wren, oben jubelt Tess._

**Wren Okoro:** Du hast die Stellung im Kopf behalten. Hier, der Karabiner gehört dir. Er hält mehr, als er wiegt.

**Ambrose:** Blind spielen heißt: das Brett tragen, ohne es zu sehen.

→ Quest „Die Seilschaft“: Schritt 1 von 1 erledigt

→ Quest abgeschlossen: „Die Seilschaft“

#### 695 · Felsbogen

`weg-delacroix-desert.seite06` · Quest „Wieder zusammen“, Schritt 3 von 7: Tomás' Aufgaben zu Mattbildern lösen.

_Unter dem Felsbogen klemmt eine lose Seite zwischen zwei Steinen, voller Schachdiagramme._

#### 696 · Felsbogen

`weg-delacroix-desert.finch_laeufer_b` · Quest „Wieder zusammen“, Schritt 3 von 7

_Neben einem kleinen Fink aus Kreide steckt etwas im Felsspalt: ein weißer Läufer aus Buchsbaum._

_Unter seinem Fuß ist ein Feld eingebrannt._

#### 697 · Canyonpfad

`weg-delacroix-desert.holloway` · Quest „Wieder zusammen“, Schritt 3 von 7

**Mrs. Holloway:** Wer angreift, braucht mehr Figuren am König. Und mehr Wasser.

#### 698 · Canyonpfad

`weg-delacroix-desert.sternwarte_abzweig` · Quest „Wieder zusammen“, Schritt 3 von 7

_Die Laterne zeigt den schmalen Pfad zwischen dem Geröll. Oben auf der Felsnase schimmert eine weiße Kuppel._

### Sternwarte am Canyon

#### 699 · Felsnase der Sternwarte

`sternwarte.bank` · Quest „Wieder zusammen“, Schritt 3 von 7

_Von der Bank sieht man tief hinunter in den Canyon. Der Pfad unten ist nur noch ein dunkler Faden._

#### 700 · Felsnase der Sternwarte

`sternwarte.antennenmast` · Quest „Wieder zusammen“, Schritt 3 von 7

_Ein alter Antennenmast, festgebunden mit Draht. Er summt leise im Wind. Von hier geht Dr. Ngatas Funk um die Welt._

#### 701 · Kuppel der Sternwarte

`sternwarte.teleskop` · Quest „Wieder zusammen“, Schritt 3 von 7

_Durch das große Teleskop schimmert der Mond. Man sieht Krater, scharf wie Felder auf einem Brett._

**Ambrose:** Vierundsechzig Felder, und trotzdem kommt man nie ans Ende. Wie da oben.

#### 702 · Kuppel der Sternwarte

`sternwarte.sternkarte` · Quest „Wieder zusammen“, Schritt 3 von 7

_An der Wand hängt eine Sternkarte. Jemand hat mit Bleistift Züge eingetragen: Sf3, Lc4, und ein Sternbild in L-Form._

#### 703 · Kuppel der Sternwarte

`sternwarte.finch_bauer_g` · Quest „Wieder zusammen“, Schritt 3 von 7

_Auf dem Boden ist ein kleiner Fink aus Kreide gemalt. Darunter, hinter einer Kiste mit Fotoplatten, steht ein weißer Bauer aus Buchsbaum._

#### 704 · Kuppel der Sternwarte

`sternwarte.ngata` · Quest „Königsangriff unter Sternen“, Schritt 1 von 1: Dr. Ngatas Mattbilder lösen, bevor der Mond hinter dem Canyon versinkt.

_Am Schreibtisch sitzt eine Frau mit Kopfhörern. Aus dem Funkgerät kommen Zahlen und Buchstaben._

**Dr. Ngata:** Dr. Ngata. Ich spiele jede Nacht per Funk, mit Leuten auf der anderen Seite der Erde. Ihre Sterne sind andere, die Züge sind dieselben.

**Dr. Ngata:** Ich habe ein paar Mattbilder gesammelt, für lange Nächte. Willst du sie lösen?

**Kim (Antwort):** „Ja, zeig her.“\
(andere Antworten: „Nicht jetzt.“)

→ Quest begonnen: „Königsangriff unter Sternen“

[Aufgaben von Dr. Ngata (sternwarte.sterne) – Ausgang: bestanden]

→ Quest „Königsangriff unter Sternen“: Schritt 1 von 1 erledigt

→ Quest abgeschlossen: „Königsangriff unter Sternen“

#### 705 · Kuppel der Sternwarte

`sternwarte.ngata` · Quest „Wieder zusammen“, Schritt 3 von 7: Tomás' Aufgaben zu Mattbildern lösen.

**Dr. Ngata:** Weiß hat gewonnen, sagt mein Funkpartner in Chile. Ich sage: der Himmel.

#### 706 · Kuppel der Sternwarte

`sternwarte.lucia` · Quest „Wieder zusammen“, Schritt 3 von 7

_Ein Mädchen mit Bleistift hinter dem Ohr zeichnet Linien auf eine Sternkarte._

**Lucía:** Lucía. Ich habe ein Sternbild gefunden, das noch keiner kennt. Ich nenne es Springer. Es springt über den ganzen Himmel.

### Durch den Canyon

#### 707 · Canyonpfad

`weg-delacroix-desert.zurueck_delacroix` · Quest „Wieder zusammen“, Schritt 3 von 7

_Der Pfad führt zurück zum einsamen Bahnhof. Der nächste Zug fährt nach Port Delacroix._

### Port Delacroix

#### 708 · Port Delacroix, Kai

`port-delacroix-aussen.wuestenzug` · Quest „Wieder zusammen“, Schritt 3 von 7

_Am Bahnhof wartet der Wüstenzug nach Westen. Hinter den Bergen liegt Desert Springs._

### Durch den Canyon

#### 709 · Felsbogen

`weg-delacroix-desert.versoehnung` · Quest „Wieder zusammen“, Schritt 3 von 7

_Unter dem Felsbogen pfeift der Wind durch die alte Eisenbahnbrücke._

#### 710 · Felsbogen

`weg-delacroix-desert.ereignis_seilschaft` · Quest „Wieder zusammen“, Schritt 3 von 7

_Wren winkt von unten, Tess von weit oben. Das Seil ist straff._

#### 711 · Felsbogen

`weg-delacroix-desert.seite06` · Quest „Wieder zusammen“, Schritt 3 von 7

_Unter dem Bogen ist nur noch Sand._

#### 712 · Felsbogen

`weg-delacroix-desert.finch_laeufer_b` · Quest „Wieder zusammen“, Schritt 3 von 7

_Im Felsspalt ist nur noch das Finkenzeichen aus Kreide._

### Sternwarte am Canyon

#### 713 · Kuppel der Sternwarte

`sternwarte.finch_bauer_g` · Quest „Wieder zusammen“, Schritt 3 von 7

_Unter dem Finkenzeichen liegt nur noch Staub._

#### 714 · Kuppel der Sternwarte

`sternwarte.lucia` · Quest „Wieder zusammen“, Schritt 3 von 7

**Lucía:** Siehst du ihn? Zwei Sterne nach oben, einer zur Seite. Ein L.

### Durch den Canyon

#### 715 · Felsbogen

`desert-springs-aussen.ankunft_zu_fuss` · Quest „Wieder zusammen“, Schritt 3 von 7

_Desert Springs ist eine Straße. Eine Tankstelle, ein Diner, an dessen Leuchtreklame drei Buchstaben fehlen._

_Ein Motel mit zwölf Türen in zwölf Farben. Im Schwimmbecken ohne Wasser hat jemand Kakteen gepflanzt._

_Am Ortseingang ein Schild: „Desert Springs. Einwohner: 211. Schachspieler: 211.“_

_Ambrose schweigt. Das Schild sagt alles._

### Desert Springs

#### 716 · Desert Springs, Hauptstraße

`desert-springs-aussen.motel` · Quest „Wieder zusammen“, Schritt 3 von 7

_Am Motel „Zur Quelle“ summt die Leuchtschrift. Zwei Buchstaben fehlen._

#### 717 · Desert Springs, Hauptstraße

`desert-springs-aussen.bahnhof` · Quest „Wieder zusammen“, Schritt 3 von 7

_Am alten Bahnhof hält einmal am Tag ein Zug. In der Halle ist ein Antiquariat._

#### 718 · Desert Springs, Hauptstraße

`desert-springs-aussen.buck` · Quest „Wieder zusammen“, Schritt 3 von 7

_An der Tankstelle steht ein Brett auf der Motorhaube eines Pick-ups. Daneben lehnt ein Mann mit Zahnstocher._

**Buck:** Das Schild am Ortseingang? Stimmt nicht ganz, das mit den 211. Der Pfarrer weigert sich. Aber seine Frau spielt für zwei.

_Er spuckt den Zahnstocher aus._

**Buck:** Buck. Hier draußen fährt keiner langsam. Auch nicht am Brett.

**Buck:** Drei Minuten, zwei Sekunden je Zug. Eine Stellung, du hast Weiß. Na, traust du dich?

**Kim (Antwort):** „Klar.“\
(andere Antworten: „Nicht jetzt.“)

**Ambrose:** Er redet so schnell, wie er zieht. Lass ihn reden. Du denkst.

[Stellungsduell gegen Buck – Ausgang: gewonnen]

#### 719 · Desert Springs, Hauptstraße

`desert-springs-aussen.buck` · Quest „Wieder zusammen“, Schritt 3 von 7

_Mitten in der Partie hast du einen guten Zug gefunden und gesagt: „Na, das wird teuer.“ Buck hat sofort gezogen, zu schnell._

**Buck:** Na, jetzt willst du's aber wissen! Hier, die Karte hab ich mal einem Lkw-Fahrer abgewonnen.

**Ambrose:** Das war beinahe fein.

**Buck:** Schnell und gut. Das gibt's hier draußen selten. Noch eine Runde?

**Kim (Antwort):** „Noch eine.“\
(andere Antworten: „Ich muss weiter.“)

[Stellungsduell gegen Buck, erneut – Ausgang: gewonnen]

#### 720 · Desert Springs, Hauptstraße

`desert-springs-garage.dot` · Quest „Wieder zusammen“, Schritt 3 von 7

_Dot ist siebzig und trägt am Nachmittag Lockenwickler. Hinter der Motel-Theke hängt eine Weltkarte voller Nadeln._

_Von jeder Nadel läuft ein Faden zu einer Postkarte._

**Dot:** Fernschach. Fünfzig Jahre. Einer in Reykjavík braucht vier Monate für einen Zug, der fährt zur See.

**Dot:** Eine in Kapstadt schummelt, glaube ich. Aber charmant.

_Sie tippt auf eine Nadel im Nordosten. Daran hängt kein Faden mehr._

**Dot:** Hier hatte ich eine, vierzig Jahre lang. Margaret. Aus einem Kaff mit einem Wasserfall. Ich hab sie nie gesehen.

**Dot:** Im letzten Brief schrieb sie, sie räumt jetzt auf. Dann kam nichts mehr. Wir waren im einunddreißigsten Zug.

**Dot:** Ich stand besser. Ich sag das nicht gern, wenn jemand nicht mehr widersprechen kann.

**Kim (Antwort):** „Sie hat ein Brett abgestaubt. Sechzig Jahre lang.“

_Dot sieht dich an._

**Dot:** Du kommst aus dem Kaff.

**Kim (Antwort):** „Ich wohne in ihrem Haus.“

_Sie nimmt die Lesebrille ab und setzt sie wieder auf. Dann legt sie einen Stapel Postkarten hin. Oben ein Wasserfall._

**Dot:** Dann weißt du vielleicht, was sie gezogen hätte.

**Ambrose:** An meinem Tisch. Vierzig Jahre. Mit dieser Frau.

**Dot:** Erst Tomás, Liebes. Ich bin danach dran.

#### 721 · Garage am Motel

`desert-springs-garage.tomas` · Quest „Wieder zusammen“, Schritt 3 von 7

_Ein aufgebocktes Auto, Werkzeug an der Wand, zwischen Ölfässern ein runder Clubtisch mit vier Stühlen. Unter dem Auto ragen Stiefel hervor._

**Tomás:** Mira ist im Canyon. Die kommt, wenn es dunkel wird.

_Er rollt heraus, einen Schraubenschlüssel in der Hand._

**Tomás:** Ich bin Tomás. Der Bruder, der Club und die Aufsicht.

_Auf dem Regal über der Werkbank glänzt ein Pokal. Aus einer Limonadendose, aufgeschnitten, gebogen, mit Draht._

**Tomás:** Den hat sie selbst gemacht. Mit sechs. In der Zeitung war ein Typ aus Riverton mit einem ganzen Regal davon.

**Tomás:** Sie hat gesagt: Wenn der das darf, darf sie das auch.

_Du denkst an einen Wohnwagen unter einer Brücke. „Ich hab seit März keinen neuen.“ Du machst ein Foto. Du weißt, wem du es schickst._

**Tomás:** Sie opfert. Immer. Wenn du nicht weißt, wie ein Matt nach einem Opfer aussieht, bist du in zwölf Zügen fertig.

**Kim (Antwort):** „Zeig her.“\
(andere Antworten: „Nicht jetzt.“)

[Aufgaben von Tomás (desertSprings.reiheTomas) – Ausgang: bestanden]

→ Quest „Wieder zusammen“: Schritt 3 von 7 erledigt

#### 722 · Garage am Motel

`desert-springs-garage.tomas` · Quest „Wieder zusammen“, Schritt 4 von 7: Dots Aufgaben zum Königsangriff lösen.

**Tomás:** Gut. Jetzt weißt du, wie es aussieht, wenn sie opfert.

_Er wischt sich die Hände an einem Lappen ab und zieht eine Karte hinter dem Ölkanister hervor._

**Tomás:** Erst jedes Schach, jeder Schlag, jede Drohung. Wie beim Motor: erst die Zündkerzen. Dann der Rest.

#### 723 · Garage am Motel

`desert-springs-garage.mira` · Quest „Wieder zusammen“, Schritt 4 von 7

_Als es dunkel wird, kommt Mira. Staubig bis zu den Ohren. Sie setzt sich an einen Tisch und sieht dich an._

**Mira:** Ich opfere den Läufer.

**Kim (Antwort):** „Wir haben noch nicht angefangen.“

**Mira:** Ich sag's dir nur. Weil ich kann.

**Mira:** Jetzt Dot. Sie spielt seit fünfzig Jahren per Post. Sie hat Zeit.

#### 724 · Garage am Motel

`desert-springs-garage.dot` · Quest „Wieder zusammen“, Schritt 4 von 7

**Dot:** Bei mir geht ein Zug pro Woche zur Post. Aber jeder sitzt.

**Dot:** Meine Aufgaben greifen den König an. Langsam, Liebes, wie ein Brief.

**Kim (Antwort):** „Ich bin bereit.“\
(andere Antworten: „Nicht jetzt.“)

[Aufgaben von Dot (desertSprings.reiheDot) – Ausgang: bestanden]

→ Quest „Wieder zusammen“: Schritt 4 von 7 erledigt

#### 725 · Garage am Motel

`desert-springs-garage.dot` · Quest „Der Brief“, Schritt 1 von 2: Im Antiquariat die Stellung auf dem Siegel lösen.

**Dot:** Du magst alte Sachen, oder? Dein Brett sieht aus, als hätte es Geschichten.

**Dot:** Mr. Okoro im Antiquariat hat den Kram von einem alten Brückenbauer im Keller.

**Dot:** Kisten voller Briefe. Frag ihn.

**Ambrose:** Ein Brückenbauer. Hier, in der Wüste.

→ Quest begonnen: „Der Brief“

#### 726 · Desert Springs, Hauptstraße

`desert-springs-aussen.motel` · Quest „Wieder zusammen“, Schritt 5 von 7: Den Clubkampf gegen Mira gewinnen.

_Vor dem Motel steht ein Liegestuhl. Auf dem Tisch daneben ein Fernschachbrief mit Briefmarken aus aller Welt._

#### 727 · Desert Springs, Hauptstraße

`desert-springs-aussen.buck` · Quest „Wieder zusammen“, Schritt 5 von 7

(noch einmal angesprochen; hier nur, was neu ist)

**Kim (Antwort):** „Ich muss weiter.“\
(andere Antworten: „Noch eine.“)

**Buck:** Gute Fahrt! Und tank voll.

#### 728 · Desert Springs, Hauptstraße

`desert-springs-garage.dot` · Quest „Dots Partie“, Schritt 1 von 2: Margarets Partie gegen Dot ab dem 31. Zug zu Ende spielen.

_Dot legt ein kleines Steckbrett auf die Theke. Die Stellung nach dem einunddreißigsten Zug, seit Jahren unverändert._

**Dot:** Margaret hatte Schwarz. Mein Turm steht auf der siebten Reihe, mitten in ihrem Lager. Spielst du für sie weiter, Liebes?

**Kim (Antwort):** „Ich spiele für Margaret.“\
(andere Antworten: „Nicht jetzt.“)

**Ambrose:** Sie hat nie schnell gezogen. Lass dir Zeit.

→ Quest begonnen: „Dots Partie“

[Partie gegen Dot – Ausgang: gewonnen]

→ Quest „Dots Partie“: Schritt 1 von 2 erledigt

#### 729 · Desert Springs, Hauptstraße

`desert-springs-garage.dot` · Quest „Dots Partie“, Schritt 2 von 2: Dot sagen, wie es ausgegangen ist.

_Dot nimmt die Lesebrille ab._

**Dot:** Du hast mich geschlagen. Mit ihren Figuren.

**Dot:** Sie hätte gelacht, glaube ich. Sie hat nie gelacht, wenn sie verloren hat.

_Sie zieht einen Faden von der Nadel im Nordosten zu einer leeren Postkarte und knotet ihn fest._

**Dot:** Jetzt ist die Partie fertig.

**Ambrose:** An meinem Tisch hat sie das Brett abgestaubt. Jeden Tag. Jetzt weiß ich, wofür.

→ Quest „Dots Partie“: Schritt 2 von 2 erledigt

→ Quest abgeschlossen: „Dots Partie“

#### 730 · Antiquariat im alten Bahnhof

`desert-springs-antiquariat.okoro` · Quest „Wieder zusammen“, Schritt 5 von 7: Den Clubkampf gegen Mira gewinnen.

**Mr. Okoro:** Dot hat dich geschickt? Der Kram von dem Brückenbauer liegt im Keller. Mein Vorgänger hat ihn mit dem Gebäude von der Bahn übernommen.

**Mr. Okoro:** Pläne, Rechnungen, ein Sextant. Ich wollte es immer durchsehen. Dann kam immer ein Buch dazwischen.

_Du legst den Umschlag aus Ironwood auf den Schalter. Mr. Okoro sieht ihn lange an._

**Mr. Okoro:** Die Treppe hinunter und dann links.

_Sieben Kisten. In der vierten Briefe, gebündelt mit Schnur, jedes Bündel ein Jahr. 1863. 1864. 1865._

**Ambrose:** Die Schrift darauf ist schräg und ungeduldig. Meine. Er hat sie aufgehoben. Jeden.

_Unter dem Bündel 1866 liegt ein einzelnes Blatt, zweimal gefaltet, mit Wachs verschlossen. Ins Wachs ist eine Stellung gedrückt._

_Wieder eine Fesselung. Eine andere, schwerer._

**Ambrose:** Wer mit der Post spielte, drückte dem anderen eine Stellung aufs Siegel. Wer sie nicht löste, hatte den Brief nicht verdient.

**Ambrose:** Er hat ihn versiegelt und nicht in den Umschlag gelegt. Der Umschlag ging leer hinaus. Hale. Der Mann, der jede Niete signiert.

**Kim (Antwort):** „Ein Fehler.“

**Ambrose:** Sein einziger, soweit ich weiß.

**Kim (Antwort):** Die Stellung lösen\
(andere Antworten: „Nicht jetzt.“)

[Aufgaben von Mr. Okoro (desertSprings.siegel) – Ausgang: bestanden]

→ Quest „Der Brief“: Schritt 1 von 2 erledigt

#### 731 · Antiquariat im alten Bahnhof

`desert-springs-antiquariat.okoro` · Quest „Der Brief“, Schritt 2 von 2: Den Brief mit Ambrose lesen.

_Du brichst das Wachs._

_Zwölf Zeilen. Senkrecht, gerade, jede gleich lang. Du liest laut, bei einer Glühbirne, für jemanden, der hundertsechzig Jahre gewartet hat._

_„Whitlock, mein neununddreißigster Zug ist seit Dienstag unterwegs zu Ihnen. Sie werden zurückschlagen müssen.“_

_„Danach stehen wir in einem Endspiel, und ich weiß nicht, wie es ausgeht. Ich weiß es zum ersten Mal nicht, und es gefällt mir.“_

_„Ich habe Ihnen 1859 ein Wort geschrieben, für das ich mich seither schäme. Ich hielt Ihr Spiel für Leichtsinn.“_

_„Ich habe sieben Jahre und diese Partie gebraucht, um zu begreifen, dass es Mut war. Und dass ich davon zu wenig habe.“_

_„Ein Endspiel spielt man nicht mit der Post. Kommen Sie nach Norden.“_

_„Wir spielen die letzten Züge an einem Brett, von Angesicht zu Angesicht. Ich lasse ein Zimmer richten.“_

_„Ich warte. J. Hale“_

_Ambrose hat die Hand vor den Mund gelegt. Seine Schultern beben, und du hörst nichts. Das ist schlimmer._

**Ambrose:** Er hat gewartet.

**Ambrose:** Er hat wirklich gewartet. Er hat ein Zimmer richten lassen.

**Ambrose:** Mut. Er schreibt, es war Mut. Der Mann, der es „bemerkenswert unnötig“ genannt hat.

**Kim (Antwort):** „Er hat sich geschämt.“

**Ambrose:** Sieben Jahre lang. Und ich habe ihn sieben Jahre lang gehasst, für ein einziges Wort.

**Ambrose:** Wir waren zwei Dickköpfe, Kim. Zwei Dickköpfe, und zwischen uns ein Land und ein Postmeister mit Fieber.

**Ambrose:** Er hat auf mich gewartet und ich auf ihn. Und jeder hat gedacht, der andere schweigt.

**Kim (Antwort):** „Wie Big Joe und Mama.“

**Ambrose:** Wie die halbe Welt, fürchte ich.

_Auf der Rückseite stehen vier Züge, sauber untereinander._

**Ambrose:** Neunundzwanzig bis zweiunddreißig. Zur Kontrolle. Damit wir dieselbe Stellung aufbauen, wenn ich ankomme.

**Ambrose:** Zwei Umschläge am selben Dienstag. Der mit dem Zug kam an. Der mit der Einladung blieb leer in einem Postsack liegen.

**Ambrose:** Den Brief hat er auf seinem Tisch gefunden, als es zu spät war, und nie geöffnet.

**Ambrose:** Seine Antwort auf meinen letzten Zug hat er nie abgeschickt. An wen auch. Sie steht auf der Seite, die fehlt.

_Du faltest den Brief und legst ihn in den Umschlag aus Ironwood. Er passt genau._

_Oben sieht Mr. Okoro dein Gesicht und fragt nichts._

**Mr. Okoro:** Manche Bücher stehen fünfzig Jahre im Regal, bis jemand sie braucht. Das ist kein Unglück. Das ist ein Antiquariat.

→ Quest „Der Brief“: Schritt 2 von 2 erledigt

→ Quest abgeschlossen: „Der Brief“

#### 732 · Desert Springs, Hauptstraße

`desert-springs-garage.dot` · Quest „Wieder zusammen“, Schritt 5 von 7: Den Clubkampf gegen Mira gewinnen.

**Dot:** Willst du ein Zimmer? Für Schachspieler die Hälfte.

#### 733 · Desert Springs, Hauptstraße

`desert-springs-aussen.canyon` · Quest „Wieder zusammen“, Schritt 5 von 7

_Der Pfad führt zurück in den Canyon, zum Felsbogen._

### Durch den Canyon

#### 734 · Felsbogen

`desert-springs-aussen.ankunft_zu_fuss` · Quest „Wieder zusammen“, Schritt 5 von 7

_Der Pfad aus dem Canyon endet an der Hauptstraße von Desert Springs._

### Desert Springs

#### 735 · Desert Springs, Hauptstraße

`desert-springs-garage.dot` · Quest „Wieder zusammen“, Schritt 5 von 7

**Dot:** Heute kam ein Brief aus Reykjavík. Mein Gegner hat endlich gezogen. Nach vier Monaten.

#### 736 · Garage am Motel

`desert-springs-garage.tomas` · Quest „Wieder zusammen“, Schritt 5 von 7

**Tomás:** Ein Motor und ein Angriff brauchen dasselbe: alle Teile an der richtigen Stelle.

#### 737 · Garage am Motel

`desert-springs-garage.mira` · Quest „Erinnerung: Das letzte Spiel, 1858“, Schritt 1 von 2: Die Stellung von 1858 nach Hales Läuferzug mit Weiß weiterspielen.

_Abend in der Garage. Grillen, ein Radio aus dem Motel. Mira hockt auf einem Reifenstapel, isst Kekse und tut, als höre sie nicht zu._

**Ambrose:** Die Partie von 1858 habe ich niemandem gezeigt. Man hat nur das Ergebnis gedruckt.

**Kim (Antwort):** „Er hat geschrieben, es war Mut.“

**Ambrose:** Er war höflich.

**Kim (Antwort):** „Er war nie höflich. Er war unerträglich.“

_Das sitzt. Auf dem Clubtisch, zwischen einer Zündkerze und einer Keksdose, liegt die Stellung._

_Weiß steht gut. Der Bauer, den man nehmen und nach Hause gehen konnte. Und daneben die offene Linie._

**Ambrose:** Da. Dorthin der Turm. Jetzt du, für Schwarz. Such, was er gesucht hat.

_Du weißt, dass es ihn gibt: den stillen Zug. Den Läufer, ein Feld zurück. Er deckt alles._

**Ambrose:** Bemerkenswert unnötig.

_Er zeigt dir, was er danach spielte. Ein Schach, das nichts bringt. Ein Rückzug. Ein zweites Schach._

**Ambrose:** Ich wusste, dass ich mich verrechnet hatte. Dass alle es gesehen hatten. Ich wollte nur noch, dass es vorbei ist.

_Du siehst auf die Stellung nach dem Läuferzug. Bevor er fahrig wurde. Du zählst._

**Kim (Antwort):** Die Stellung von 1858 spielen\
(andere Antworten: „Ein andermal.“)

_Du spielst Weiß. Gegen Hale, wie er damals saß._

→ Quest begonnen: „Erinnerung: Das letzte Spiel, 1858“

[Stellungsduell gegen J. Hale, 1858 – Ausgang: gewonnen]

→ Quest „Erinnerung: Das letzte Spiel, 1858“: Schritt 1 von 2 erledigt

#### 738 · Garage am Motel

`desert-springs-garage.mira` · Quest „Erinnerung: Das letzte Spiel, 1858“, Schritt 2 von 2: Danach mit Mira reden.

_Du hast mehr Angreifer am König. Springer, Läufer, die Dame, ein Bauer. Gegen einen Läufer und einen fernen Turm._

**Mira:** Das Opfer war richtig!

_Mira ist vom Reifenstapel gesprungen, den Mund voll Keks. Das Brett aus Licht sieht sie nicht, aber du hast die Stellung daneben mitgebaut._

**Mira:** Der Turm ist richtig da! Der Läufer geht zurück, na und? Dann kommt die Dame rüber, und der Bauer läuft, und er kann nicht mehr alles decken.

**Mira:** Das gewinnt. Nicht gleich. Aber das gewinnt.

**Mira:** Wer hat das gespielt?

**Kim (Antwort):** „Ein Bekannter.“

**Mira:** Der hat aber danach gezögert. Das hier ist Quatsch. Das ist Angst.

**Mira:** Er hat richtig geopfert und dann Angst gekriegt. Sag ihm das.

_Ambrose sitzt auf einem Ölkanister. Zum dritten Mal in seinem Tod._

**Ambrose:** Es hat gestimmt. Es hat die ganze Zeit gestimmt.

**Ambrose:** Ich hätte das Match gewonnen. Wenn ich nach seinem Läuferzug einmal durchgeatmet und gezählt hätte.

**Ambrose:** Ich habe geglaubt, mein Fehler sei der Mut gewesen. Mein Fehler kam danach. Als ich aufhörte, daran zu glauben.

_Er beginnt zu lachen. Das Lachen vom Steg, nur lauter. Er lacht, bis er sich die Seiten hält, die er nicht hat._

**Ambrose:** Hundertsechzig Jahre, und ein Kind mit Keksen sagt es mir. Im Vorbeigehen. In einer Garage.

**Kim (Antwort):** „Sie hat dich nicht mal gesehen.“

**Ambrose:** Das macht es schlimmer!

_Mira sieht herüber, ob ihr verrückt geworden seid, und entscheidet, dass es sie nichts angeht._

_Als es still ist, sagt er noch etwas._

**Ambrose:** Hale hat es gewusst. Deshalb hat er „unnötig“ gesagt, nicht „falsch“. Er war immer genau mit Worten.

**Ambrose:** Er wusste, dass er eine verlorene Partie gewonnen hatte, weil der andere die Nerven verlor. Das hätte mich auch nicht schlafen lassen.

→ Quest „Erinnerung: Das letzte Spiel, 1858“: Schritt 2 von 2 erledigt

→ Quest abgeschlossen: „Erinnerung: Das letzte Spiel, 1858“

#### 739 · Antiquariat im alten Bahnhof

`desert-springs-antiquariat.okoro` · Quest „Wieder zusammen“, Schritt 5 von 7: Den Clubkampf gegen Mira gewinnen.

**Mr. Okoro:** Eine Fahrkarte von 1923, ein Kochbuch ohne Umschlag. Alles hat seinen Preis, nur nicht die Geschichten.

[Laden: Antiquariat von Mr. Okoro]

#### 740 · Garage am Motel

`desert-springs-garage.tomas` · Quest „Wieder zusammen“, Schritt 5 von 7

**Tomás:** Mira hat heute schon drei Damen geopfert. Zwei waren richtig.

#### 741 · Garage am Motel

`desert-springs-garage.mira` · Quest „Wieder zusammen“, Schritt 5 von 7

_Ganz Desert Springs passt in die Garage. Buck mit Zahnstocher, Dot mit Lockenwicklern, Mr. Okoro mit einem Buch, falls es langweilig wird._

_Die Nadel liegt auf einem Ölkanister. Ein kleiner Kaktus aus Kupfer, mit einer einzigen Blüte._

**Tomás:** Karten?

**Ambrose:** Nur, wenn du willst. Dann kommentiere ich. Aber du entscheidest.

**Ambrose:** Ich habe gelernt, was geschieht, wenn es andersherum läuft.

_Mira setzt sich. Ihre Füße reichen nicht bis zum Boden._

**Mira:** Ich opfere früh. Du kannst es nicht verhindern.

**Kim (Antwort):** „Ich will sehen, ob es stimmt.“\
(andere Antworten: „Noch nicht.“)

_Sie grinst. Zum ersten Mal sieht sie aus wie zehn._

[Partie gegen Mira – Ausgang: gewonnen]

→ Quest „Wieder zusammen“: Schritt 5 von 7 erledigt

#### 742 · Garage am Motel

`desert-springs-garage.mira` · Quest „Wieder zusammen“, Schritt 6 von 7: Am Abend die Sterne über dem Motel ansehen.

_Am Ende gibt sie dir die Hand. Ihre ist klebrig._

**Mira:** Du hast mich geschlagen.

**Mira:** Noch mal. Jetzt.

**Tomás:** Morgen.

**Mira:** Jetzt!

**Tomás:** Mira.

_Sie verschränkt die Arme. Dann drückt sie dir widerwillig den Kupferkaktus in die Hand._

#### 743 · Garage am Motel

`desert-springs-garage.dot` · Quest „Wieder zusammen“, Schritt 6 von 7

**Dot:** Briefe sind wie Züge, Liebes. Man schickt sie los und wartet.

#### 744 · Desert Springs, Hauptstraße

`desert-springs-aussen.motel` · Quest „Wieder zusammen“, Schritt 6 von 7

_In der Nacht sitzt du am Rand des Schwimmbeckens, die Füße zwischen den Kakteen. Die Sterne gehen bis auf den Boden hinunter._

_Das Telefon summt. Juno._

**Juno:** Sieben! Ich hab's nachgezählt. Blatt, Buch, Achteck, Zahnrad, Glas, Lyra, Kaktus. Der Kaktus kriegt Glitzer.

**Juno:** Wie geht es ihm?

_Er steht am Beckenrand und sieht hinauf._

**Kim (Antwort):** „Er hat gelacht. Eine Viertelstunde lang.“

**Juno:** Worüber?

**Kim (Antwort):** „Über sich.“

**Juno:** Oh. Oh, das ist gut. Das schreib ich auf.

_Als sie aufgelegt hat, ist da noch eine Nachricht. Ohne Gruß. „Port Delacroix hat sich herumgesprochen. Wer schummelt, schleppt kein altes Brett mit. Ich glaube dir. Wegen des Bretts.“_

_Eine Minute später: „Landesmeisterschaft im Sommer. Nova spielt auch. Mein Vater hat mir einen Trainer besorgt. Er ist kein Mensch.“_

_Der letzte Satz gefällt dir nicht._

**Ambrose:** Das Tablet von dem Jungen mit den Zahlen. Es liegt in deinem Rucksack. Gib es ihm zurück, wenn du ihn siehst.

**Ambrose:** Ich brauche es nicht mehr.

**Kim (Antwort):** „Sicher?“

**Ambrose:** Nein. Aber ich hoffe es. Und ich habe es geprüft, so gut ich kann.

→ Quest „Wieder zusammen“: Schritt 6 von 7 erledigt

#### 745 · Desert Springs, Hauptstraße

`desert-springs-aussen.bahnhof` · Quest „Wieder zusammen“, Schritt 7 von 7: Zum Bahnhof gehen, wenn ich abreisen will.

_Mama ist da. Sonnenbrand auf der Nase, das blaue Heft unter dem Arm. Es ist dicker geworden._

**Mama:** Port Delacroix lässt grüßen. Das Dach vom Musikhaus ist drauf. Miss Odile sagt, das nächste Mal hängst du das Schild auf.

**Mama:** Und danach: Summit City. Großmeisterin Ward. Ich hab schon Urlaub eingereicht.

**Kim (Antwort):** „Wer ist das?“

**Mama:** Die Beste im Staat. Sie hat mich mal in neunzehn Zügen geschlagen, als ich sechzehn war.

**Mama:** Sie spielt Endspiele, als hätte sie alle Zeit der Welt. Kalt wie ein Berg.

_Ein Endspiel. Auf Junos Reisebrett steht eine Stellung, die seit hundertsechzig Jahren auf einen einzigen Zug wartet._

_Schwarz am Zug._

_Der Zug fährt gleich. Wohin?_

**Kim (Antwort):** „Nach Port Delacroix.“\
(andere Antworten: „Nach Hause, nach Maple Falls.“ · „Noch nicht.“)

→ Quest „Wieder zusammen“: Schritt 7 von 7 erledigt

→ Quest abgeschlossen: „Wieder zusammen“

#### 746 · Antiquariat im alten Bahnhof

`desert-springs-antiquariat.okoro` · keine laufende Quest

**Mr. Okoro:** Lies langsam. Bücher laufen nicht weg.

[Laden: Antiquariat von Mr. Okoro]

#### 747 · Garage am Motel

`desert-springs-garage.mira` · keine laufende Quest

**Mira:** Opfer sind schöner als Recht haben.

**Kim (Antwort):** „Revanche um eine bessere Nadel?“\
(andere Antworten: „Bis später, Mira.“)

**Mira:** Jetzt.

[Partie gegen Mira, erneut – Ausgang: gewonnen]

#### 748 · Garage am Motel

`desert-springs-garage.mira` · keine laufende Quest

**Mira:** Warum hat das Huhn die Straße überquert? Um den König zu schützen.

**Kim (Antwort):** „Bis später, Mira.“\
(andere Antworten: „Revanche um eine bessere Nadel?“)

#### 749 · Antiquariat im alten Bahnhof

`desert-springs-antiquariat.okoro` · keine laufende Quest

**Mr. Okoro:** Unten im Keller stehen Kisten von der Bahn. Pläne, Rechnungen, ein Sextant.

[Laden: Antiquariat von Mr. Okoro]

#### 750 · Garage am Motel

`desert-springs-garage.tomas` · keine laufende Quest

**Tomás:** Wenn du Mira schlägst, ist sie einen Tag lang still. Dann redet sie doppelt.

#### 751 · Desert Springs, Hauptstraße

`desert-springs-aussen.highway` · keine laufende Quest

_Am Ende der Hauptstraße beginnt der Highway. Mama klimpert mit einem Autoschlüssel._

**Mama:** Dot leiht uns ihr Auto. Es ist alt, aber es fährt, und wir sehen mehr als vom Zug aus.

**Mama:** Juno kommt in Summit City dazu, mit dem Bus. Sommerferien.

**Ambrose:** Ein Auto. Zu meiner Zeit nahm man die Postkutsche, und die Postkutsche nahm einen nicht immer mit.

_Die Straße flimmert. Nach einer Stunde taucht ein Diner mit Neonschild auf. Mama hält an._

### Hinauf in die Berge

#### 752 · Diner an der Wüstenstraße

`weg-desert-summit.tafel` · Quest „Die Wahrheit des Endspiels“, Schritt 1 von 7: In Summit City ankommen.

→ Quest begonnen: „Die Wahrheit des Endspiels“

→ Quest begonnen: „Die Tafel am Diner“

_Neben der Kasse hängt eine Tafel: „Drei Endspiele. Wer alle löst, kriegt den Kaffee umsonst.“_

**Ambrose:** Nur Könige und Bauern. So wenig Holz, und kein Zug ist leicht.

**Kim (Antwort):** Die Aufgaben lösen\
(andere Antworten: Weitergehen)

[Aufgaben von Die Rätseltafel (wegDesertSummit.tafel) – Ausgang: bestanden]

→ Quest „Die Tafel am Diner“: Schritt 1 von 1 erledigt

→ Quest abgeschlossen: „Die Tafel am Diner“

#### 753 · Diner an der Wüstenstraße

`weg-desert-summit.tafel` · Quest „Die Wahrheit des Endspiels“, Schritt 1 von 7

_Auf der Tafel neben der Kasse steht mit Kreide: „Gelöst. Kaffee geht aufs Haus.“_

#### 754 · Diner an der Wüstenstraße

`weg-desert-summit.fund_neon` · Quest „Die Wahrheit des Endspiels“, Schritt 1 von 7

_Hinter dem Diner, zwischen leeren Kisten, liegt ein gebogenes Glasrohr in Form eines „K“._

**Earl Dubois:** Das K von King's Diner. Ist seit neunundachtzig kaputt. Nimm's mit, wir haben uns dran gewöhnt.

#### 755 · Diner an der Wüstenstraße

`weg-desert-summit.ereignis_funkschach` · Quest „Schach über Funk“, Schritt 1 von 2: Im Funkturnier der Fernfahrer mitspielen, Gegnerin ist Mama Bear.

_Im Fenster des Diners steht ein altes CB-Funkgerät. Aus dem Lautsprecher kommen Buchstaben und Zahlen: „Echo vier, Echo zwei.“_

**Earl Dubois:** Das ist das Dienstagsturnier der Fernfahrer, zwischen der Wüste und den Bergen. Heute fehlt einer. Willst du einspringen?

**Mama Bear:** Hier Mama Bear, Pause oben in der Haltebucht. Ich sag dir meine Züge an, du hörst gut hin.

_Earl stellt ein Brett neben das Funkgerät. Was aus dem Lautsprecher kommt, setzt er für Mama Bear aufs Brett._

→ Quest begonnen: „Schach über Funk“

[Partie gegen Mama Bear – Ausgang: gewonnen]

→ Quest „Schach über Funk“: Schritt 1 von 2 erledigt

#### 756 · Diner an der Wüstenstraße

`weg-desert-summit.ereignis_funkschach` · Quest „Schach über Funk“, Schritt 2 von 2: Zuhören, was Mama Bear über ihre Fracht erzählt.

**Mama Bear:** Gut gespielt, Kim Junior. Ab heute ist das dein Funkname.

**Mama Bear:** Sag mal, du kommst doch rum. Ich fahre seit drei Wochen versiegelte Kisten von Perfect Move in die Berge. Sie summen. Kisten summen nicht.

**Mama Bear:** Mein Laster steht oben in der Haltebucht an der Bergstraße. Schau ihn dir an, wenn du vorbeikommst.

→ Quest „Schach über Funk“: Schritt 2 von 2 erledigt

→ Quest abgeschlossen: „Schach über Funk“

#### 757 · Diner an der Wüstenstraße

`weg-desert-summit.kreide3` · Quest „Die Wahrheit des Endspiels“, Schritt 1 von 7: In Summit City ankommen.

_An der Seitenwand des Diners ist ein Springer aus Kreide gemalt, direkt neben einer schmalen Tür._

_Darunter, ganz klein: „Dreimal klopfen.“_

**Ambrose:** Ein Club ohne Haus. Das gefällt mir. Früher haben wir in Kaffeehäusern gespielt.

#### 758 · Diner an der Wüstenstraße

`weg-desert-summit.finch_springer_b` · Quest „Die Wahrheit des Endspiels“, Schritt 1 von 7

_Im Blumenkasten am Motel steckt ein kleiner Fink aus Blech. Zwischen den Blumen liegt ein weißer Springer aus Buchsbaum._

#### 759 · Diner an der Wüstenstraße

`weg-desert-summit.seite08` · Quest „Die Wahrheit des Endspiels“, Schritt 1 von 7

_Unter einem Reifen des Lasters klemmt eine lose Seite voller Schachdiagramme._

#### 760 · Diner an der Wüstenstraße

`weg-desert-summit.reklame` · Quest „Die Wahrheit des Endspiels“, Schritt 1 von 7

_Eine große Reklametafel: „King's Diner – 2 Meilen“. Bis zum Diner sind es kaum zweihundert Schritte._

#### 761 · Diner an der Wüstenstraße

`weg-desert-summit.motelschild` · Quest „Die Wahrheit des Endspiels“, Schritt 1 von 7

_Das Neonschild des Starlight Motels summt. „VACANCY“, und das V flackert._

#### 762 · Diner an der Wüstenstraße

`weg-desert-summit.aussicht` · Quest „Die Wahrheit des Endspiels“, Schritt 1 von 7

_Von der Rastbank sieht man nach Westen die ersten Berge, blau im Dunst. Dort oben liegt Summit City._

#### 763 · Diner an der Wüstenstraße

`weg-desert-summit.earl` · Quest „Die Wahrheit des Endspiels“, Schritt 1 von 7

_Es ist Sommer, und du bist fünfzehn._

_Juno hat dir eine Seite im Tagebuch geschenkt, leer, mit einem Rahmen aus Glitzer: Für das, was noch kommt._

_Mama hat drei Wochen Urlaub und fährt. Ambrose ist leichter seit dem Canyon. Er lobt einen Bauern, der einfach ein Feld vorrückt._

**Ambrose:** Hässlich. Und vollkommen richtig. Ich beginne, an hässlichen Zügen Gefallen zu finden. Sag es niemandem.

**Kim (Antwort):** Weiterfahren

_An einem Diner mit einem Neonschild in Form eines Königs haltet ihr zum Tanken. Drinnen schieben Fernfahrer Könige über Bretter._

**Earl Dubois:** Na, auch auf dem Weg nach oben? Ich bin Earl. Ich fahr seit dreißig Jahren diese Straße.

**Earl Dubois:** Das hier ist Königsrennen. Beide Könige laufen bis zur letzten Reihe, und Schach geben ist verboten.

**Earl Dubois:** Wer zuerst ankommt, zahlt nicht. Und wer unterwegs nur schlagen will, zahlt meistens.

**Ambrose:** Ein Rennen ohne Angriff. Wie seltsam. Und doch.

**Ambrose:** Auch hier gewinnt, wer den Weg kennt. Merk dir, wie der König läuft. Ich habe das Gefühl, du wirst es brauchen.

**Earl Dubois:** Heute sind alle Bretter belegt. Die Jungs spielen um die nächste Tankfüllung.

**Earl Dubois:** Komm wieder, wenn du hier durchfährst. Dann rennen wir.

#### 764 · Bergstraße

`weg-desert-summit.spur_pm4` · Quest „Die Wahrheit des Endspiels“, Schritt 1 von 7

_In der Haltebucht steht ein blauer Sattelzug. Auf den Kisten klebt das Logo von Perfect Move, versiegelt, Ziel „Gebirge“._

_Wenn man das Ohr an eine Kiste hält, summt sie. Unter dem Scheibenwischer steckt ein Frachtbrief._

#### 765 · Bergstraße

`weg-desert-summit.aussicht_berg` · Quest „Die Wahrheit des Endspiels“, Schritt 1 von 7

_Unter der Bank fällt der Hang steil ab. Weit unten liegt die Wüste, flach wie ein leeres Brett._

#### 766 · Bergstraße

`weg-desert-summit.wegweiser_hochebene` · Quest „Die Wahrheit des Endspiels“, Schritt 1 von 7

_Ein Wegweiser: „Summit City ↑ 2 Meilen. Hochebene: in Summit City links.“_

#### 767 · Bergstraße

`weg-desert-summit.quelle` · Quest „Die Wahrheit des Endspiels“, Schritt 1 von 7

_Aus dem Fels rinnt kaltes Wasser in einen Steintrog. Du trinkst ein paar Schlucke._

#### 768 · Diner an der Wüstenstraße

`weg-desert-summit.fund_neon` · Quest „Die Wahrheit des Endspiels“, Schritt 1 von 7

_Hinter dem Diner liegen leere Kisten und ein alter Reifen._

#### 769 · Diner an der Wüstenstraße

`weg-desert-summit.ereignis_funkschach` · Quest „Die Wahrheit des Endspiels“, Schritt 1 von 7

_Aus dem Funkgerät rauscht es._

**Mama Bear:** Kim Junior, bist du da? Wir spielen Dienstag wieder.

#### 770 · Diner an der Wüstenstraße

`weg-desert-summit.kreide3` · Quest „Die Wahrheit des Endspiels“, Schritt 1 von 7

_Der Springer aus Kreide ist noch da. Daneben die Tür zum Hinterzimmer._

#### 771 · Diner an der Wüstenstraße

`weg-desert-summit.finch_springer_b` · Quest „Die Wahrheit des Endspiels“, Schritt 1 von 7

_Im Blumenkasten wachsen nur noch Blumen._

#### 772 · Diner an der Wüstenstraße

`weg-desert-summit.seite08` · Quest „Die Wahrheit des Endspiels“, Schritt 1 von 7

_Auf dem Parkplatz liegt nur noch Staub._

#### 773 · Diner an der Wüstenstraße

`weg-desert-summit.earl` · Quest „Die Wahrheit des Endspiels“, Schritt 1 von 7

**Earl Dubois:** Der Kaffee hier ist schwarz wie ein Läufer auf c8.

**Kim (Antwort):** „Ich hab dein K gefunden.“\
(andere Antworten: „Erklär mir das Königsrennen noch einmal.“ · „Bis bald, Earl.“)

_Earl dreht das gebogene Glasrohr in der Hand. Dann holt er eine Leiter aus dem Lastwagen._

**Earl Dubois:** Ich hab gesagt, nimm's mit. Und du bringst es mir zurück.

_Ein Klicken, ein Summen. Über der Tür leuchtet es rosa: „KING'S DINER“._

**Ambrose:** Seit neunundachtzig. Und niemand hat es vermisst. Ich kenne das Gefühl.

**Earl Dubois:** Der Kaffee geht ab heute aufs Haus. Für dich jedenfalls.

#### 774 · Diner an der Wüstenstraße

`weg-desert-summit.hinterzimmer_tuer` · Quest „Die Wahrheit des Endspiels“, Schritt 1 von 7

_Du klopfst dreimal. Von drinnen ruft jemand: „Rein mit dir, aber leise.“_

#### 775 · Hinterzimmer des Diners

`weg-desert-summit.mags` · Quest „Die Wahrheit des Endspiels“, Schritt 1 von 7

_Kein Bildschirm, keine Uhr an der Wand. Nur Bretter, Kreide und Kaffee._

**Mags:** Mags. Ich fahre Kühlwagen und spiele Blitz. Drei Minuten, zwei Sekunden dazu. Gewinnen musst du nicht. Mitspielen schon.

**Kim (Antwort):** Eine Blitzpartie, drei plus zwei.\
(andere Antworten: Erst mal zuschauen.)

[Partie gegen Mags – Ausgang: gewonnen]

#### 776 · Hinterzimmer des Diners

`weg-desert-summit.mags` · Quest „Die Wahrheit des Endspiels“, Schritt 1 von 7

**Mags:** Du hast mich geschlagen. Komm wieder, dann revanchiere ich mich.

#### 777 · Hinterzimmer des Diners

`weg-desert-summit.ruth_keene` · Quest „Die Wahrheit des Endspiels“, Schritt 1 von 7

**Ruth Keene:** Ruth Keene. Am Funk heiße ich Mama Bear. Hier hinten darf ich einfach Ruth sein.

#### 778 · Diner an der Wüstenstraße

`weg-desert-summit.earl` · Quest „Die Wahrheit des Endspiels“, Schritt 1 von 7

**Earl Dubois:** Bis Summit City geht's nur noch bergauf. Für Lastwagen und für Schachspieler.

**Kim (Antwort):** „Erklär mir das Königsrennen noch einmal.“\
(andere Antworten: „Bis bald, Earl.“)

**Earl Dubois:** Das hier ist Königsrennen. Beide Könige laufen bis zur letzten Reihe, und Schach geben ist verboten.

**Earl Dubois:** Wer zuerst ankommt, zahlt nicht. Und wer unterwegs nur schlagen will, zahlt meistens.

**Ambrose:** Ein Rennen ohne Angriff. Wie seltsam. Und doch.

**Ambrose:** Auch hier gewinnt, wer den Weg kennt. Merk dir, wie der König läuft. Ich habe das Gefühl, du wirst es brauchen.

**Earl Dubois:** Heute sind alle Bretter belegt. Die Jungs spielen um die nächste Tankfüllung.

**Earl Dubois:** Komm wieder, wenn du hier durchfährst. Dann rennen wir.

#### 779 · Diner an der Wüstenstraße

`weg-desert-summit.zurueck_desert` · Quest „Die Wahrheit des Endspiels“, Schritt 1 von 7

_Die Straße führt zurück nach Desert Springs, durch flimmernde Hitze._

### Desert Springs

#### 780 · Desert Springs, Hauptstraße

`desert-springs-aussen.highway` · Quest „Die Wahrheit des Endspiels“, Schritt 1 von 7

_Der Highway führt nach Norden, durch die Wüste, Richtung Berge._

### Hinauf in die Berge

#### 781 · Diner an der Wüstenstraße

`weg-desert-summit.earl` · Quest „Die Wahrheit des Endspiels“, Schritt 1 von 7

(noch einmal angesprochen; hier nur, was neu ist)

**Kim (Antwort):** „Bis bald, Earl.“\
(andere Antworten: „Erklär mir das Königsrennen noch einmal.“)

**Earl Dubois:** Gute Fahrt. Und lass den König nicht im Schach stehen.

#### 782 · Bergstraße

`weg-desert-summit.spur_pm4` · Quest „Die Wahrheit des Endspiels“, Schritt 1 von 7

_Der Sattelzug steht noch in der Haltebucht. Die Kisten summen._

#### 783 · Diner an der Wüstenstraße

`weg-desert-summit.earl` · Quest „Die Wahrheit des Endspiels“, Schritt 1 von 7

**Earl Dubois:** Ich hab mal ein Rennen in elf Zügen gewonnen. Seitdem zahl ich nie.

**Kim (Antwort):** „Erklär mir das Königsrennen noch einmal.“\
(andere Antworten: „Bis bald, Earl.“)

**Earl Dubois:** Das hier ist Königsrennen. Beide Könige laufen bis zur letzten Reihe, und Schach geben ist verboten.

**Earl Dubois:** Wer zuerst ankommt, zahlt nicht. Und wer unterwegs nur schlagen will, zahlt meistens.

**Ambrose:** Ein Rennen ohne Angriff. Wie seltsam. Und doch.

**Ambrose:** Auch hier gewinnt, wer den Weg kennt. Merk dir, wie der König läuft. Ich habe das Gefühl, du wirst es brauchen.

**Earl Dubois:** Heute sind alle Bretter belegt. Die Jungs spielen um die nächste Tankfüllung.

**Earl Dubois:** Komm wieder, wenn du hier durchfährst. Dann rennen wir.

#### 784 · Hinterzimmer des Diners

`weg-desert-summit.ruth_keene` · Quest „Die Wahrheit des Endspiels“, Schritt 1 von 7

**Ruth Keene:** Mama Bear, Ende. Das sage ich auch hier drin.

## Akt 4

### Hinauf in die Berge

#### 785 · Bergstraße

`summit-city-aussen.ankunft_zu_fuss` · Quest „Die Wahrheit des Endspiels“, Schritt 1 von 7: In Summit City ankommen.

_Summit City liegt so hoch, dass man die Wolken von oben sieht. Holzhäuser, eine Seilbahn, die leise surrt._

_Es ist Juli, und auf den Gipfeln liegt Schnee._

_Zwischen den Häusern pfeift etwas, schrill und kurz._

**Mama:** Murmeltiere. Die warnen sich.

**Kim (Antwort):** „Wovor?“

**Mama:** Vor uns.

_An der Seilbahnstation glänzt ein Plakat: „Landesmeisterschaft der Jugend. Präsentiert von Perfect Move.“ Acht Gesichter._

_Das zweite ist Nova. Das vierte Victor. Das achte bist du._

**Juno:** Das ist von meinem Foto! Da hast du Ketchup am Kinn!

**Kim (Antwort):** Zum Hotel sehen

_Vor dem Hotel steht Victor, in Weiß. Ein Mann im grauen Anzug beugt sich zu ihm und sagt ihm etwas ins Ohr. Victor nickt._

**Kim (Antwort):** „Der Trainer, der kein Mensch ist.“

**Ambrose:** Der dort ist ein Mensch. Aber ich glaube, er ist nur der Bote.

_Die Hütte der Großmeisterin liegt eine Stunde über der Stadt. Mama bleibt unten._

**Mama:** Sie hat mich in neunzehn Zügen geschlagen. Ich will ihr nicht gleich am ersten Tag begegnen.

→ Quest „Die Wahrheit des Endspiels“: Schritt 1 von 7 erledigt

### Summit City

#### 786 · Summit City, Talstation

`summit-city-aussen.drachenfest` · Quest „Die Wahrheit des Endspiels“, Schritt 2 von 7: Großmeisterin Ward in ihrer Hütte besuchen.

_Am Abend hängen Laternen über dem Marktplatz. Rund um den Drachenbrunnen stehen zwanzig Bretter auf Bierbänken._

_Ein Mädchen erklärt dir die Regel, ohne zu fragen, ob du sie hören willst._

_Einmal im Jahr spielt hier jeder mit dem Drachen. Der Drache zieht wie eine Dame und springt wie ein Springer._

_Die Sage sagt, er hat die Bergleute aus dem Stollen geführt. Deshalb darf er alles._

**Ambrose:** Eine Figur, die alles darf. Und keiner hier findet das ungerecht.

_Das Mädchen drückt dir eine Schuppe aus grünem Glas in die Hand. Für alle, die zum ersten Mal mitmachen._

_Alle Bretter sind belegt. Die Bergführer spielen bis Mitternacht, und die Kinder schauen zu._

**Ambrose:** Nächstes Mal setzen wir uns dazu. Ich will sehen, wie man einen Drachen fängt.

#### 787 · Summit City, Talstation

`summit-city-aussen.plakat` · Quest „Die Wahrheit des Endspiels“, Schritt 2 von 7

_Ein Plakat am Platz: „Landesmeisterschaft – Finale in der Capital Arena“. Darunter hat jemand mit Bleistift geschrieben: „Wir fahren hin!“_

#### 788 · Summit City, Talstation

`summit-city-aussen.fernrohr` · Quest „Die Wahrheit des Endspiels“, Schritt 2 von 7

_Vom Felsplateau sieht man über das ganze Tal. Die Gondel hängt wie eine Figur am Faden über dem Abgrund._

**Ambrose:** Von hier oben sieht das Tal aus wie ein Brett nach der Eröffnung. Alles steht noch, nichts ist entschieden.

#### 789 · Summit City, Talstation

`summit-city-aussen.sol` · Quest „Die Wahrheit des Endspiels“, Schritt 2 von 7

_Auf dem Gipfelfelsen sitzt eine Frau mit Kletterseil über der Schulter. Vor ihr ein Brett und eine Uhr._

**Sol:** Sol. Bergführerin. Wer hier oben ankommt, spielt eine Partie gegen mich.

**Sol:** Mit Uhr. Das Wetter schlägt schneller um, als man denkt.

**Sol:** Drei Minuten, zwei Sekunden Zuschlag. Eine Stellung, du hast Weiß. Bevor die Wolken kommen?

**Kim (Antwort):** „Los.“\
(andere Antworten: „Nicht jetzt.“)

**Ambrose:** Sie redet vom Wetter, um dich zu treiben. Das Brett kennt kein Wetter.

[Stellungsduell gegen Sol – Ausgang: gewonnen]

#### 790 · Summit City, Talstation

`summit-city-aussen.sol` · Quest „Die Wahrheit des Endspiels“, Schritt 2 von 7

**Sol:** Gewonnen, und keine Sekunde Panik. So steigt man auf einen Berg.

**Sol:** Nimm die. Für die Partie, in der die Uhr dich jagt.

**Sol:** Noch eine? Die Sonne hält noch eine Weile.

**Kim (Antwort):** „Noch eine.“\
(andere Antworten: „Ich steige ab.“)

[Stellungsduell gegen Sol, erneut – Ausgang: gewonnen]

#### 791 · Hütte der Großmeisterin

`summit-city-huette.pokal` · Quest „Die Wahrheit des Endspiels“, Schritt 2 von 7

_An der Wand hängt ein Thermometer. Sonst nichts. Keine Pokale._

#### 792 · Hütte der Großmeisterin

`summit-city-huette.kaminfeuer` · Quest „Die Wahrheit des Endspiels“, Schritt 2 von 7

_Im Juli brennt hier ein Feuer. Es ist das Einzige, das Ward schmückt._

#### 793 · Hütte der Großmeisterin

`summit-city-huette.foto` · Quest „Die Wahrheit des Endspiels“, Schritt 2 von 7

_Ein leerer Haken an der Wand. Was hier einmal hing, hat Ward abgenommen._

#### 794 · Hütte der Großmeisterin

`summit-city-huette.teekanne` · Quest „Die Wahrheit des Endspiels“, Schritt 2 von 7

_Auf dem runden Tisch steht eine Teekanne, noch warm. Daneben ein Brett, auf dem eine Partie wartet._

#### 795 · Hütte der Großmeisterin

`summit-city-huette.ward` · Quest „Die Wahrheit des Endspiels“, Schritt 2 von 7

_Die Hütte ist aus dunklem Holz. Im Kamin brennt auch im Juli Feuer. An den Wänden hängt nichts außer einem Thermometer._

_Eleanor Ward sitzt im Sessel am Feuer und liest den Absatz zu Ende. Dann legt sie ein Lesezeichen ein._

_Sie betrachtet dich, wie man eine Stellung betrachtet._

**Großmeisterin Ward:** Sieben.

**Kim (Antwort):** „Ja.“

**Großmeisterin Ward:** Wie hast du Big Joe geschlagen?

**Kim (Antwort):** „Grundreihe. Ein Springeropfer, damit der Turm hinunterkommt.“

**Großmeisterin Ward:** Und die kleine Castillo?

**Kim (Antwort):** „Ein Läufer, der nicht ging. Dann vierzig Züge Endspiel.“

**Großmeisterin Ward:** Vierzig Züge. Dann hast du schon einmal gesehen, wie es aussieht. Setz dich.

_Auf dem Brett stehen drei Figuren. Ein weißer König, ein weißer Bauer, ein schwarzer König. Sonst nichts._

**Kim (Antwort):** „Das ist alles?“

**Großmeisterin Ward:** Das ist alles, was übrig bleibt, wenn man lange genug spielt.

**Großmeisterin Ward:** Die Könige stehen sich gegenüber, ein Feld dazwischen. Wer am Zug ist, hat das Nachsehen. Warum?

**Kim (Antwort):** „Weil er weichen muss. Dann kommt der andere vorbei.“\
(andere Antworten: „Ich weiß es nicht.“)

**Großmeisterin Ward:** Opposition. Wer zuerst ziehen muss, gibt nach. Wie im Leben, manchmal.

**Großmeisterin Ward:** Ein Endspiel ist eine Wahrheit. In der Eröffnung kann man schwindeln, im Mittelspiel blenden. Hier nicht.

**Ambrose:** Sie spielt, wie ich mit fünfzig gespielt hätte. Wenn ich fünfzig geworden wäre.

**Großmeisterin Ward:** Erst Kit, dann Haraldsen. Bauern, dann Türme. Dann sehen wir weiter.

→ Quest „Die Wahrheit des Endspiels“: Schritt 2 von 7 erledigt

#### 796 · Hütte der Großmeisterin

`summit-city-huette.kit` · Quest „Die Wahrheit des Endspiels“, Schritt 3 von 7: Kits Aufgaben zu Bauernendspielen lösen.

_Am Clubtisch sitzt ein Mädchen in Wanderschuhen und zählt Felder mit dem Finger._

**Kit:** Kit. Ward sagt, ich soll dir die Bauern zeigen. Sie sagt nie bitte.

**Kit:** Der Bauer läuft, der König rennt. Wer ist schneller? Zähl. Wenn der König in das Quadrat kommt, hat er ihn.

**Kit:** Quadrat, Opposition, ein Tempo in Reserve. Meine Aufgaben sind klein. Aber gemein.

**Kim (Antwort):** „Zeig her.“\
(andere Antworten: „Nicht jetzt.“)

[Aufgaben von Kit (summitCity.reiheKit) – Ausgang: bestanden]

→ Quest „Die Wahrheit des Endspiels“: Schritt 3 von 7 erledigt

#### 797 · Hütte der Großmeisterin

`summit-city-huette.kit` · Quest „Die Wahrheit des Endspiels“, Schritt 4 von 7: Haraldsens Aufgaben zu Turmendspielen lösen.

**Kit:** Schneller als ich. Fast.

_Sie gibt dir eine Karte aus der Jackentasche, die Ecken vom Wetter rund: ein König mit einer Kompassnadel._

**Kit:** König raus, Freibauer zählen, Opposition. Wie beim Aufstieg: erst schauen, dann gehen.

#### 798 · Hütte der Großmeisterin

`summit-city-huette.haraldsen` · Quest „Die Wahrheit des Endspiels“, Schritt 4 von 7

_Ein alter Mann in Seilbahnuniform sitzt am Kamin und poliert eine Turmfigur._

**Mr. Haraldsen:** Haraldsen. Ich fahre die Seilbahn, seit sie gebaut wurde. Und ich spiele Turmendspiele, seit ich denken kann.

**Mr. Haraldsen:** Ein Turm hinter dem Freibauern. Wie ein Seil hinter der Gondel. Er schiebt, und er hält, beides zugleich.

**Mr. Haraldsen:** Und eine Stellung, die nenne ich die Brücke. Die baust du, dann kommst du hinüber.

**Mr. Haraldsen:** Philidor, Lucena. Klingen wie Gipfel. Sind auch welche.

**Kim (Antwort):** „Ich bin bereit.“\
(andere Antworten: „Nicht jetzt.“)

[Aufgaben von Mr. Haraldsen (summitCity.reiheHaraldsen) – Ausgang: bestanden]

→ Quest „Die Wahrheit des Endspiels“: Schritt 4 von 7 erledigt

#### 799 · Hütte der Großmeisterin

`summit-city-huette.haraldsen` · Quest „Haraldsens Studie“, Schritt 1 von 1: Ward die Studie aus Haraldsens Mantel bringen.

**Mr. Haraldsen:** Die Brücke hast du gebaut. Und bist hinübergekommen.

_Er stellt die polierte Turmfigur weg und reicht dir eine Karte: ein Turm hinter einem Bauern, darüber ein Seil._

**Mr. Haraldsen:** Hinter den Freibauern, auf die offene Linie. Dann schiebt er, und er hält.

_Haraldsen klopft auf die Brusttasche seiner Uniform. Es knistert._

**Mr. Haraldsen:** Da drin steckt eine Studie. Ein Turmendspiel, Weiß zieht und hält. Seit dreißig Jahren trage ich sie mit mir herum.

**Mr. Haraldsen:** Eleanor kennt sie nicht. Wenn sie die am Abend sieht, schläft sie die ganze Nacht nicht.

**Mr. Haraldsen:** Ich habe es nie übers Herz gebracht. Du vielleicht.

**Kim (Antwort):** „Ich bring sie ihr.“\
(andere Antworten: „Lieber nicht.“)

_Er gibt dir einen Zettel, so oft gefaltet, dass die Falten weich sind wie Stoff._

**Mr. Haraldsen:** Gib ihn ihr nach dem Abendessen. Und sag nicht, von wem. Sie weiß es sowieso.

**Ambrose:** Du willst sie mit einem Endspiel wach halten? Das ist die freundlichste Gemeinheit, die ich kenne.

→ Quest begonnen: „Haraldsens Studie“

#### 800 · Summit City, Talstation

`summit-city-aussen.drachenfest` · Quest „Die Wahrheit des Endspiels“, Schritt 5 von 7: Noch einmal mit Ward reden.

_Ein Murmeltier sitzt auf dem Brunnenrand und pfeift._

#### 801 · Summit City, Talstation

`summit-city-aussen.sol` · Quest „Die Wahrheit des Endspiels“, Schritt 5 von 7

(noch einmal angesprochen; hier nur, was neu ist)

**Kim (Antwort):** „Ich steige ab.“\
(andere Antworten: „Noch eine.“)

**Sol:** Langsam abwärts. Abwärts passieren die Unfälle.

#### 802 · Summit City, Talstation

`summit-city-aussen.seilbahn` · Quest „Die Wahrheit des Endspiels“, Schritt 5 von 7

_Die Gondel schaukelt bergauf, über Tannen und Murmeltierbauten, bis über die Wolken._

#### 803 · Bergstation der Seilbahn

`summit-city-bergstation.fund_pfeife` · Quest „Die Wahrheit des Endspiels“, Schritt 5 von 7

_Unter einer der Wartebänke liegt eine kleine Holzpfeife. Du pfeifst hinein. Draußen am Hang pfeift etwas zurück._

**Ambrose:** Pfeif, und sie pfeifen zurück. Murmeltiere sind höflicher als die meisten Menschen.

#### 804 · Bergstation der Seilbahn

`summit-city-bergstation.fahrplan` · Quest „Die Wahrheit des Endspiels“, Schritt 5 von 7

_Der Fahrplan der Seilbahn: jede halbe Stunde eine Gondel, bei Sturm keine. Darunter ein Zettel: „Schachbretter bitte nicht in der Gondel liegen lassen.“_

#### 805 · Bergstation der Seilbahn

`summit-city-bergstation.aussicht` · Quest „Die Wahrheit des Endspiels“, Schritt 5 von 7

_Hinter dem Geländer fällt der Fels senkrecht ab. Darunter wogt das Wolkenmeer bis an den Horizont, weiß und lautlos; ein paar Gipfel stehen darin wie Figuren auf einem leeren Brett._

_Am Seil gleitet eine Gondel hinunter und taucht ins Weiß, als ginge sie unter._

#### 806 · Bergstation der Seilbahn

`summit-city-bergstation.victor` · Quest „Die Wahrheit des Endspiels“, Schritt 5 von 7

_Victor steht draußen am Geländer der Plattform und hört etwas über einen Ohrstöpsel. Als er dich sieht, nimmt er ihn heraus._

**Victor Hale:** Nicht jetzt. Ich hab Vorbereitung. Der Coach sagt, ich darf mit niemandem spielen, der nicht im Plan steht.

#### 807 · Bergladen

`summit-city-bergladen.theke` · Quest „Die Wahrheit des Endspiels“, Schritt 5 von 7

_Im Bergladen riecht es nach Hanf und Wachs. Seile hängen von der Decke, an der Wand Karten von jedem Gipfel._

_Auf der Theke steht eine Blechdose und ein Schild: „Bin in Wards Hütte. Bedient euch. Ehrlich bleiben.“_

**Ambrose:** Ein Laden, der den Leuten traut. In meiner Zeit hätte er keine Woche überlebt.

[Laden: Haraldsens Bergladen]

#### 808 · Summit City, Talstation

`summit-city-aussen.drachenfest` · Quest „Die Wahrheit des Endspiels“, Schritt 5 von 7

_Die Laternen vom Fest hängen noch. Am Brunnen erklärt ein Vater seinem Sohn den Drachen._

#### 809 · Summit City, Talstation

`summit-city-aussen.weg_desert` · Quest „Die Wahrheit des Endspiels“, Schritt 5 von 7

_Die Bergstraße windet sich hinunter, Richtung Wüste._

### Hinauf in die Berge

#### 810 · Bergstraße

`summit-city-aussen.ankunft_zu_fuss` · Quest „Die Wahrheit des Endspiels“, Schritt 5 von 7

_Die Bergstraße endet an der Talstation von Summit City. Irgendwo pfeift ein Murmeltier._

### Summit City

#### 811 · Hütte der Großmeisterin

`summit-city-huette.kaminfeuer` · Quest „Die Wahrheit des Endspiels“, Schritt 5 von 7

_Auf dem Kaminsims steht eine Teekanne mit Sprung. Darüber ist die Wand leer._

#### 812 · Hütte der Großmeisterin

`summit-city-huette.ward` · Quest „Die Wahrheit des Endspiels“, Schritt 5 von 7

**Großmeisterin Ward:** Genug für heute. Morgen wieder, gleich nach dem Frühstück.

_Am dritten Abend, auf dem Weg hinunter, gehen in der Stadt die Lichter an._

**Kim (Antwort):** „Die Fernpartie. Das ist auch ein Endspiel.“

**Ambrose:** Ein Turm gegen zwei Springer. Und Bauern. Ich habe hundertsechzig Jahre darauf gestarrt.

**Kim (Antwort):** „Kannst du es gewinnen?“

_Er antwortet nicht gleich._

**Ambrose:** Ich weiß es nicht. Ich konnte Angriffe. Ich konnte Opfer. Das hier konnte ich nie.

**Ambrose:** Deshalb lernst du es. Nicht ich.

#### 813 · Hütte der Großmeisterin

`summit-city-huette.kit` · Quest „Die Wahrheit des Endspiels“, Schritt 5 von 7

**Kit:** Im Winter zählen wir Felder, im Sommer Höhenmeter. Ist dasselbe.

#### 814 · Hütte der Großmeisterin

`summit-city-huette.haraldsen` · Quest „Die Wahrheit des Endspiels“, Schritt 5 von 7

**Mr. Haraldsen:** Die Gondel ist einmal stehen geblieben, eine Nacht lang. Wir haben Blindschach gespielt.

#### 815 · Summit City, Talstation

`summit-city-aussen.drachenfest` · Quest „Die Wahrheit des Endspiels“, Schritt 5 von 7

_Am Drachenbrunnen liegt eine vergessene Figur mit Flügeln._

#### 816 · Bergstation der Seilbahn

`summit-city-bergstation.fund_pfeife` · Quest „Die Wahrheit des Endspiels“, Schritt 5 von 7

_Unter der Wartebank liegt nur noch eine leere Bonbontüte._

#### 817 · Bergladen

`summit-city-bergladen.theke` · Quest „Die Wahrheit des Endspiels“, Schritt 5 von 7

_Die Blechdose auf der Theke klimpert. „Ehrlich bleiben.“_

[Laden: Haraldsens Bergladen]

#### 818 · Hütte der Großmeisterin

`summit-city-huette.ward` · Quest „Hastings 1895“, Schritt 1 von 2: Die Züge von Steinitz in Wards Lieblingspartie erraten.

**Großmeisterin Ward:** Bleib. Unten ist heute das Drachenfest. Die halbe Stadt spielt mit einer Figur, die es nicht gibt.

**Großmeisterin Ward:** Big Joe hat mich angerufen. Da komme ein Kind, das zählt, bevor es schlägt, und trotzdem opfert. Das Kind sei von Laurie.

**Großmeisterin Ward:** Ich habe sie in neunzehn Zügen geschlagen. Sie war die Beste, die ich in dem Jahr gesehen hatte. Ich habe es ihr nicht gesagt.

**Kim (Antwort):** „Sie ist unten. In der Stadt.“

**Großmeisterin Ward:** Ich weiß. Sie steckt die Hände noch immer in die Ärmel. Ich werde es ihr sagen, bevor ihr fahrt.

**Großmeisterin Ward:** Es ist dreißig Jahre zu spät. Aber man macht manche Züge trotzdem noch.

_Sie holt ein dünnes Heft aus dem Regal, mit einem Umschlag aus Packpapier._

**Großmeisterin Ward:** Hastings, 1895. Ein alter Mann namens Steinitz. Er war Weltmeister gewesen, und alle sagten, er sei fertig. Rate. Du hast Weiß.

**Kim (Antwort):** Die Partie spielen\
(andere Antworten: „Ein andermal.“)

→ Quest begonnen: „Hastings 1895“

[Aufgaben von Großmeisterin Ward (summitCity.erinnerungHastings) – Ausgang: bestanden]

→ Quest „Hastings 1895“: Schritt 1 von 2 erledigt

#### 819 · Hütte der Großmeisterin

`summit-city-huette.ward` · Quest „Hastings 1895“, Schritt 2 von 2: Mit Ward über die Partie reden.

_Ein Turm, der hängt und hängt und nicht geschlagen werden darf, weil dahinter jedes Mal etwas Schlimmeres wartet._

**Kim (Antwort):** „Das ist kein Endspiel.“

**Großmeisterin Ward:** Nein. Das ist ein Angriff, wie ihn sich ein Endspieler ausdenkt. Er war neunundfünfzig.

**Großmeisterin Ward:** Er wusste in jedem Zug, in welchem Teil der Partie er war, und was der von ihm wollte. Die meisten wissen es erst hinterher.

_Sie zieht eine Karte aus dem Heft, als hätte sie dort als Lesezeichen gesteckt: drei Felder, hell, grau, dunkel._

_Zum ersten Mal lächelt sie. Es macht sie zwanzig Jahre jünger._

**Ambrose:** Achtzehnhundertfünfundneunzig. Neunundzwanzig Jahre nach mir.

**Ambrose:** Ich dachte, danach hätten sie nur noch gerechnet. Brückenbauer, überall. Und sie spielen noch schöner. Schöner als wir.

**Kim (Antwort):** „Macht dich das traurig?“

**Ambrose:** Es tröstet mich. Ich habe geglaubt, ich hätte etwas verpasst. Dabei habe ich nur den Anfang gesehen.

**Großmeisterin Ward:** Die meisten Leute reden mit sich selbst, wenn sie Schach lernen. Du hörst dabei zu. Das ist ungewöhnlich. Ich frage nicht.

_Zwischen den Seiten steckt ein Zettel in fremder Schrift. Züge aus einer alten Fernpartie, vier Paare. Ward weiß nicht, woher er kommt._

**Ambrose:** Das ist meine Partie gegen Hale.

**Kim (Antwort):** Hinaussehen

_Unten im Tal steigt ein Feuerwerk auf, grün, in der Form von etwas mit Flügeln._

**Ambrose:** Ein Drache auf dem Brett. Dame und Springer in einer Figur. Zu meiner Zeit hätte man mich dafür aus dem Kaffeehaus geworfen. Herrlich.

→ Quest „Hastings 1895“: Schritt 2 von 2 erledigt

→ Quest abgeschlossen: „Hastings 1895“

#### 820 · Hütte der Großmeisterin

`summit-city-huette.haraldsen` · Quest „Die Wahrheit des Endspiels“, Schritt 5 von 7: Noch einmal mit Ward reden.

**Mr. Haraldsen:** Turmendspiele sind immer remis, sagt man. Man sagt viel.

#### 821 · Hütte der Großmeisterin

`summit-city-huette.ward` · Quest „Die Wahrheit des Endspiels“, Schritt 5 von 7

_Am fünften Tag ist Victor an der Reihe. Der Mann im grauen Anzug wartet draußen. In die Hütte lässt Ward ihn nicht._

**Großmeisterin Ward:** Hier drin sind Spieler und ein Feuer. Sie sind keines von beiden.

_Du sitzt am Clubtisch. Victor legt nichts auf den Tisch. Seine rechte Hand hat er in der Jackentasche._

_Nach dreißig Zügen hat er einen Bauern mehr und ein Turmendspiel, das du kennst. Haraldsen hat es dir gezeigt. Die Brücke._

**Kim (Antwort):** Zusehen

_Er zieht nicht. Er hält die Schulter schief, als horche er auf etwas. Es summt. Kurz. Dann zwei lange._

_Victor zieht den Turm. Nicht auf die vierte Reihe. Ward zieht ihren König ein Feld. Die Brücke ist nicht mehr zu bauen._

_Zug um Zug rinnt es ihm durch die Finger. Ward stellt sich nur immer dorthin, wo er vorbeiwill. Opposition._

_Nach siebzig Zügen hat er verloren. Ein gewonnenes Endspiel, mit einem Bauern mehr._

_Sein Telefon klingelt. Auf dem Bildschirm steht „Vater“. Er sieht darauf, drei Sekunden, vier. Er drückt es weg._

**Kim (Antwort):** Victor ansehen

_Er wirft etwas Graues, Flaches auf den Tisch. Es schlittert über das Brett und stößt die Könige um._

**Victor Hale:** Es hat gesagt, plus zwei Komma eins. Die ganze Zeit. Ich hab doch gemacht, was es gesagt hat.

_Er steht auf. Der Stuhl bleibt stehen. Er ist zu gut erzogen, um einen Stuhl umzuwerfen._

_Draußen ruft der Mann im grauen Anzug, dann rennende Schritte auf dem Pfad. Aufwärts. Nicht hinunter._

_Ward hebt den schwarzen König auf und stellt ihn zurück._

**Großmeisterin Ward:** Er spielt, als wäre er nicht da.

**Kim (Antwort):** „Er hat die Brücke gesehen. Er wusste es.“

**Großmeisterin Ward:** Natürlich wusste er es. Er ist der Begabteste, den ich in zwanzig Jahren hier oben hatte.

**Großmeisterin Ward:** Er hat sich selbst nicht geglaubt. Jemand hat ihm sehr gründlich beigebracht, sich nicht zu glauben.

**Großmeisterin Ward:** Worauf wartest du? Ich bin vierundsechzig. Ich renne keinem mehr nach.

→ Quest „Die Wahrheit des Endspiels“: Schritt 5 von 7 erledigt

#### 822 · Hütte der Großmeisterin

`summit-city-huette.kit` · Quest „Die Wahrheit des Endspiels“, Schritt 6 von 7: Victor an der Bergstation suchen und mit ihm spielen.

**Kit:** Ward sagt, ich soll weniger rennen. Am Brett und am Berg.

#### 823 · Hütte der Großmeisterin

`summit-city-huette.haraldsen` · Quest „Die Wahrheit des Endspiels“, Schritt 6 von 7

**Mr. Haraldsen:** Im Bergladen habe ich Seilbahnkarten. Und Karten für das Brett.

#### 824 · Summit City, Talstation

`summit-city-aussen.seilbahn` · Quest „Die Wahrheit des Endspiels“, Schritt 6 von 7

_Der Wärter an der Talstation zeigt nach oben. „Ein Junge ist eben den Pfad hinaufgerannt. Nicht hinunter. Allein.“_

#### 825 · Bergstation der Seilbahn

`summit-city-bergstation.victor` · Quest „Die Wahrheit des Endspiels“, Schritt 6 von 7

_Unter der Plattform liegen die Wolken im Tal wie Milch in einer Schüssel. Die Gipfel ragen daraus hervor wie Inseln._

_Victor sitzt am Geländer, die Knie angezogen, nur im Hemd. Die weiße Jacke liegt neben ihm._

**Kim (Antwort):** Dich zwei Meter weiter hinsetzen

_Du sagst nichts. Von Mrs. Okafor hast du gelernt, wie man das macht. Hinter dem Glastor dreht sich das Rad, eine Gondel fährt hinunter._

**Victor Hale:** Ich war fünf, da hat er mir das erste Brett hingestellt. Das Einzige, bei dem man immer weiß, wer besser ist.

**Victor Hale:** Mit sieben hab ich ihn geschlagen. Er hat sich so gefreut. Danach hat er aufgehört, mit mir zu spielen.

**Victor Hale:** Seit acht Jahren rechnet er nur noch nach. Jede Partie. Er schickt mir die Kurve.

**Kim (Antwort):** „Einundsiebzig Prozent. Meine. Menschlich, hat Theo gesagt.“

_Er gibt ein Geräusch von sich, das fast ein Lachen ist._

**Victor Hale:** Ich hab die Brücke gesehen und gedacht: Das ist zu einfach, das hätte es doch gesagt.

**Victor Hale:** Ich weiß nicht mehr, welche Züge meine sind.

**Victor Hale:** Ich will einmal verlieren dürfen. Einfach so. Ohne dass jemand nachrechnet. Ohne Kurve.

**Kim (Antwort):** Junos Reisebrett aus der Jacke holen\
(andere Antworten: „Gleich.“)

_Auf dem Reisebrett steht die Stellung, die niemand anrührt._

_Du nimmst die Figuren herunter, eine nach der anderen, und merkst dir, wo sie hingehören._

**Kim (Antwort):** „Ohne Uhr. Ohne Gerät. Es zählt für nichts.“

**Victor Hale:** Das ist ein Kinderbrett.

**Kim (Antwort):** „Juno verliert darauf seit Jahren, und es geht ihr gut.“

_Er sieht dich an. Dann rückt er herüber._

[Partie gegen Victor Hale – Ausgang: gewonnen]

#### 826 · Bergstation der Seilbahn

`summit-city-bergstation.victor` · Quest „Die fehlende Seite“, Schritt 2 von 2: Die Seite finden, die im Notizbuch fehlt.

_Wer gewonnen hat, ist nicht wichtig. Victor sieht leichter aus als vorher._

**Ambrose:** Ein Hale, der lächelt. Ich habe zu lange gewartet, um das zu sehen.

**Kim (Antwort):** Ihm zusehen

_Die Sonne kommt unter die Wolken, alles wird rot._

_Victor greift in die Innentasche der Jacke. Ein Buch, klein und alt, in Leinen gebunden._

**Victor Hale:** Das hat meinem Großvater gehört. Er hat es mir gegeben, als ich sieben war. Mein Vater weiß nicht, dass ich es habe.

**Victor Hale:** Er hat gesagt, da ist etwas drin, das soll ich aufheben. Es sei wertlos. Aber man hebe es auf.

**Kim (Antwort):** Hinsehen

_Zwischen den letzten Seiten liegt ein Blatt, herausgerissen, sauber, dicht am Falz. Die Schrift ist klein und senkrecht._

**Victor Hale:** In Silicon Bay hast du auf das Notizbuch gestarrt. In Ironwood auf ein Geländer.

**Victor Hale:** Und du redest mit einem Brett.

**Victor Hale:** Ich hab meinen Vater gefragt, wer der Mann aus dem Süden war. Er hat es nicht gewusst. Ich glaub, du weißt es.

**Victor Hale:** Mein Großvater hat gesagt, das hat schon sein Großvater gesagt. Für den Tag, an dem jemand weiterspielt.

_„März 1867. 40. … b5.“ Und darunter, in derselben Schrift, vier Zeilen._

_„Whitlocks vierzigster Zug kam mit der Nachricht seines Todes. Ich habe meinen notiert, wie es sich gehört.“_

_„Ich werde ihn niemandem schicken können. Für den Tag, an dem jemand weiterspielt.“_

**Kim (Antwort):** Ambrose ansehen

**Ambrose:** Er hat geantwortet.

**Ambrose:** Einem Toten. Wie es sich gehört. b5. Natürlich b5. Der gewissenhafte, unerträgliche …

**Ambrose:** Ein Hale. Ur-ur-ur … Herrje. Ein Hale eben.

**Victor Hale:** Was sagt er?

**Kim (Antwort):** „Wer?“

**Victor Hale:** Der, mit dem du redest. Ich hab dir geschrieben, dass ich dir glaube. Wegen des Bretts.

_Du siehst zu Ambrose. Er nickt._

**Kim (Antwort):** „Er sagt, dein Vorfahr war gewissenhaft und unerträglich.“

_Und dass er hundertsechzig Jahre auf diesen Zug gewartet hat._

**Victor Hale:** Wie ist er? Der Zug. Ist er gut?

**Ambrose:** Sag ihm, er ist genau der, den ich an seiner Stelle auch gespielt hätte.

**Ambrose:** Und dass das die größte Unverschämtheit ist, die mir je begegnet ist.

→ Quest „Die fehlende Seite“: Schritt 2 von 2 erledigt

→ Quest abgeschlossen: „Die fehlende Seite“

→ Quest „Die Wahrheit des Endspiels“: Schritt 6 von 7 erledigt

#### 827 · Hütte der Großmeisterin

`summit-city-huette.ward` · Quest „Haraldsens Studie“, Schritt 1 von 1: Ward die Studie aus Haraldsens Mantel bringen.

_Nach dem Abendessen legst du Ward den Zettel neben die Teekanne._

_Sie faltet ihn auseinander und liest. Ihr Gesicht wird ganz glatt._

**Großmeisterin Ward:** Haraldsen. Dreißig Jahre trägt er das mit sich herum. Und jetzt schickt er ein Kind.

**Großmeisterin Ward:** Das hält nicht. Das kann gar nicht halten.

**Kim (Antwort):** „Gute Nacht.“

_Sie hört dich nicht mehr. Sie stellt die Figuren auf, ohne hinzusehen._

_Am Morgen sitzt sie noch genauso da. Das Feuer ist heruntergebrannt. Auf dem Tisch stehen drei Tassen Tee, alle kalt._

**Großmeisterin Ward:** Es hält. Mit einem stillen Königszug. Dieser alte Seilbahnschaffner.

→ Quest „Haraldsens Studie“: Schritt 1 von 1 erledigt

→ Quest abgeschlossen: „Haraldsens Studie“

#### 828 · Bergstation der Seilbahn

`summit-city-bergstation.victor` · Quest „Die Wahrheit des Endspiels“, Schritt 7 von 7: Den Clubkampf gegen Ward gewinnen.

**Victor Hale:** Hier oben ist kein Netz. Ich komme jetzt öfter her.

#### 829 · Hütte der Großmeisterin

`summit-city-huette.ward` · Quest „Die Wahrheit des Endspiels“, Schritt 7 von 7

_Victor sitzt am Kamin, in einem Pullover von Mr. Haraldsen, der ihm zu groß ist. Die weiße Jacke hat er zurückgegeben._

_Neben ihm sitzt Mama. Sie ist den Pfad heraufgekommen, zum ersten Mal. Sie und Ward sehen einander an, quer durch die Hütte._

**Großmeisterin Ward:** Laurie.

**Mama:** Mrs. Ward.

**Großmeisterin Ward:** Du warst die Beste in dem Jahr. Ich hätte es dir sagen sollen.

_Mama sagt nichts. Sie setzt sich und steckt die Hände in die Ärmel, und ihre Augen glänzen._

**Kim (Antwort):** Zum Brett gehen

_Die Nadel liegt auf dem Kaminsims. Ein Berggipfel aus Silber, schlicht, ohne alles._

**Großmeisterin Ward:** Du musst nicht gewinnen. Ein Remis genügt für die Nadel.

**Großmeisterin Ward:** Ich vereinfache. Ich tausche, was sich tauschen lässt. Die meisten wollen im Mittelspiel gewinnen, weil sie das Ende fürchten.

**Großmeisterin Ward:** Ich habe heute Nacht nicht geschlafen. Das ist kein Grund, schlechter zu spielen. Aber vielleicht wird es einer.

**Großmeisterin Ward:** Was willst du?

**Kim (Antwort):** „Das Ende.“\
(andere Antworten: „Noch nicht.“)

_Sie nickt. Mehr nicht._

[Partie gegen Großmeisterin Ward – Ausgang: gewonnen]

→ Quest „Die Wahrheit des Endspiels“: Schritt 7 von 7 erledigt

→ Quest abgeschlossen: „Die Wahrheit des Endspiels“

#### 830 · Hütte der Großmeisterin

`summit-city-huette.ward` · keine laufende Quest

_Sie spielt es zu Ende, jeden Zug, bis zum letzten Bauern. Dann lehnt sie sich zurück und sieht dich lange an._

**Großmeisterin Ward:** Du hast mich besiegt. Gut.

_Sie nimmt den Silbergipfel vom Kaminsims. Sie gibt ihn dir nicht._

**Großmeisterin Ward:** Jetzt zeig mir, wie.

**Kim (Antwort):** „Was?“

**Großmeisterin Ward:** Wo habe ich verloren? Nicht der Zug. Der Gedanke.

**Kim (Antwort):** Den König aus der Ecke zeigen

_Du zeigst ihr, dass du ein Jahr gelernt hast, ihn zu verstecken. Dass ein Fernfahrer dir gezeigt hat, wie er läuft._

_Dass du gezählt hast, so gut du konntest, und dann gegangen bist._

**Großmeisterin Ward:** Du hast gehofft.

**Kim (Antwort):** „Ja.“

**Großmeisterin Ward:** In einem Endspiel. Ich habe vierzig Jahre geglaubt, im Endspiel gebe es nichts zu hoffen. Nur zu wissen.

_Sie lächelt, zum zweiten Mal in sechs Tagen._

**Großmeisterin Ward:** Da siehst du, wie alt man werden kann, ohne fertig zu sein.

_Sie steckt dir die Nadel an. Die achte._

_Victor klatscht, allein, dreimal, ungeschickt. Dann Mama, Kit und Mr. Haraldsen._

_In der Tür steht Juno, keuchend._

**Juno:** Acht! Acht! Ich hab eine Seite frei gelassen!

**Kim (Antwort):** „Es war keine schöne Partie.“

**Ambrose:** Sie war makellos.

**Ambrose:** Fast. Ein, zwei Züge waren ungenau. Aber sie war schön. Ich wusste nicht, dass etwas so Stilles schön sein kann.

**Ambrose:** Ich lerne noch. Stell dir das vor.

#### 831 · Bergstation der Seilbahn

`summit-city-bergstation.victor` · keine laufende Quest

**Victor Hale:** Mein Vater hat dreimal angerufen. Ich ruf morgen zurück. Vielleicht.

#### 832 · Hütte der Großmeisterin

`summit-city-huette.ward` · keine laufende Quest

**Großmeisterin Ward:** Ein Endspiel ist eine Wahrheit. Man kann sie nicht wegreden.

**Kim (Antwort):** „Revanche um eine bessere Nadel?“\
(andere Antworten: „Bis morgen.“)

**Großmeisterin Ward:** Gern. Aber diesmal bis zum letzten Bauern.

[Partie gegen Großmeisterin Ward, erneut – Ausgang: gewonnen]

#### 833 · Hütte der Großmeisterin

`summit-city-huette.ward` · keine laufende Quest

**Großmeisterin Ward:** Ich habe einmal sieben Stunden um einen halben Punkt gespielt. Es hat sich gelohnt.

**Kim (Antwort):** „Bis morgen.“\
(andere Antworten: „Revanche um eine bessere Nadel?“)

#### 834 · Hütte der Großmeisterin

`summit-city-huette.kaminfeuer` · keine laufende Quest

_Das Feuer knackt. Daneben stapelt sich Holz bis unter die Decke._

#### 835 · Hütte der Großmeisterin

`summit-city-huette.ward` · keine laufende Quest

**Großmeisterin Ward:** Tee? Die Kanne hat einen Sprung. Sie hält trotzdem seit vierzig Jahren.

**Kim (Antwort):** „Bis morgen.“\
(andere Antworten: „Revanche um eine bessere Nadel?“)

#### 836 · Hütte der Großmeisterin

`summit-city-huette.kit` · keine laufende Quest

**Kit:** Hast du die Murmeltiere an der Bergstation gesehen? Die pfeifen, wenn du pfeifst.

#### 837 · Bergstation der Seilbahn

`summit-city-bergstation.victor` · keine laufende Quest

**Victor Hale:** Wenn wir beide durchkommen, spielen wir in der Arena gegeneinander. Ich freu mich drauf.

#### 838 · Summit City, Talstation

`summit-city-aussen.weg_hochebene` · keine laufende Quest

_Am Westrand der Alm wird das Pflaster zu Schotter. Ein Schild: „Hochebene. Schule und Werkstatt, 3 Meilen.“_

_Rote Felstürme, und darüber kreisen Falken._

### Hochebene

#### 839 · Felsentürme

`hochebene.steintisch` · keine laufende Quest

→ Quest begonnen: „Falke und Bison“

_Ein flacher Stein wie ein Tisch, mit eingeritzten Feldern. Acht mal acht._

#### 840 · Felsentürme

`hochebene.pferd` · keine laufende Quest

_Am Zaun steht ein braunes Pferd und frisst Heu. Es schaut Kim an, als würde es gleich über den Zaun springen. Tut es aber nicht._

#### 841 · Felsentürme

`hochebene.schild_schule` · keine laufende Quest

_Ein Wegweiser: „Schule 400 m“. Jemand hat einen kleinen Bison darunter gemalt._

#### 842 · Felsentürme

`hochebene.kira` · Quest „Falke und Bison“, Schritt 1 von 3: Kira an den Felstürmen ihr Spiel zeigen lassen.

_Am Fuß der Felstürme steht ein flacher Steintisch. Ein Mädchen mit Schulrucksack und Basketball unter dem Arm stellt Figuren auf ein abgegriffenes Brett._

**Kira Vell:** Die kennst du nicht. Das hier ist fast Schach. Nur besser.

**Kira Vell:** Ich bin Kira. Der Bus fährt in einer halben Stunde, das reicht für eine Erklärung.

**Kim (Antwort):** „Was sind das für Figuren?“

_Sie hebt zwei Figuren hoch, die nicht in dein Schachspiel gehören: einen Vogel mit eckigen Flügeln und ein breites Tier mit gesenktem Kopf._

**Kira Vell:** Der Falke zieht wie ein Läufer oder springt wie ein Springer. Der Bison zieht wie ein Turm oder springt wie ein Springer.

**Kira Vell:** Man setzt sie ein, wenn eine Figur von der Grundreihe zum ersten Mal zieht. Dann landen sie auf dem Feld, das frei wird.

**Kira Vell:** Bei uns heißt das Spiel einfach Falke und Bison. Meine Urgroßmutter hat die zwei geschnitzt, in einem Winter, als die Straße zugeschneit war und dem Schulschach zwei Figuren fehlten.

**Kira Vell:** Den Falken, weil über den Felstürmen immer einer kreist. Den Bison, weil ihr Bruder so stur war. Sagt jedenfalls meine Oma.

_Kira zeigt es dir an einer kurzen Partie. Du ziehst vorsichtig, sie zieht schnell._

_Sie schlägt dich in vierzehn Zügen. Der Falke kommt aus einer Richtung, mit der du nicht rechnest, und dann aus einer anderen._

**Kira Vell:** Das passiert allen beim ersten Mal. Mein Cousin hat ein Jahr gebraucht.

**Ambrose:** Ich würde dir gern erklären, wie man dagegen spielt. Aber ich weiß es nicht. Ich sehe diese Figuren zum ersten Mal.

**Ambrose:** Ich habe gelernt, dass man Spiele nicht erklärt. Man lernt sie. Spiel noch eine.

**Kira Vell:** Der Bus! Eine richtige Partie, wenn du wiederkommst. Und frag meine Tante in der Schule, die will Schach lernen. Sagt sie seit zehn Jahren.

→ Quest „Falke und Bison“: Schritt 1 von 3 erledigt

#### 843 · Schule am Rand der Hochebene

`hochebene.werkstatt` · keine laufende Quest

_An der Wand ein Kalender mit dem Spielplan der Schulmannschaft._

#### 844 · Schule am Rand der Hochebene

`hochebene.aushang` · keine laufende Quest

_Am Schwarzen Brett der Schule hängen Zettel: „Basketball dienstags“, „Busfahrplan Sommer“ und „Falke-und-Bison-Turnier der Schule, Anmeldung bei Frau Vell“._

#### 845 · Schule am Rand der Hochebene

`hochebene.bus` · keine laufende Quest

_Der gelbe Schulbus. Auf der Rückbank liegt ein vergessenes Taschenschach._

#### 846 · Schule am Rand der Hochebene

`hochebene.ereignis_diplom` · keine laufende Quest

_Auf dem Plakat steht „Diplomtag – bald!“. Drei Steintische warten schon mit Brettern._

#### 847 · Schule am Rand der Hochebene

`hochebene.seite03` · keine laufende Quest

_Am Fuß der Fahnenstange flattert eine lose Seite im Wind, voller Schachdiagramme._

#### 848 · Schule am Rand der Hochebene

`hochebene.finch_turm_b` · keine laufende Quest

_Auf der Kiste mit den Sportgeräten ist ein Fink aus Kreide gemalt. Zwischen den Bällen liegt ein weißer Turm aus Buchsbaum._

#### 849 · Schule am Rand der Hochebene

`hochebene.annek` · Quest „Falke und Bison“, Schritt 2 von 3: Annek an der Schule Schach beibringen.

_Vor der Schule wirft eine Frau in Trainingsjacke Körbe. Sie trifft dreimal hintereinander und tut so, als wäre das normal._

**Annek Vell:** Annek Vell. Mathematik und Sport, und dienstags Busaufsicht. Suchst du jemanden?

**Annek Vell:** Kira hat dich also schon verlieren lassen. Gut. Dann bist du dran.

**Annek Vell:** Ich wollte immer Schach lernen. Aber jeder, der es mir erklären wollte, hat nach fünf Minuten von Eröffnungen geredet.

_Ihr setzt euch vor die alte Scheune, über deren Tor „Turnhalle“ steht. Du stellst die Figuren auf und erklärst, eine nach der anderen._

**Kim (Antwort):** Mit dem Springer anfangen

_Annek nimmt den Springer in die Hand und lässt ihn über die Bauern hüpfen._

**Annek Vell:** Euer Springer springt wie unser Falke. Nur feiger. Er darf danach nicht weiterfliegen.

**Annek Vell:** Und der Turm ist ein Bison, der das Springen verlernt hat. Armes Tier.

_Nach einer Viertelstunde spielt sie ihre erste Partie. Sie verliert, lacht und baut sofort neu auf._

**Ambrose:** Zwei Spiele auf demselben Brett. Ich dachte immer, es gäbe nur eins.

→ Quest „Falke und Bison“: Schritt 2 von 3 erledigt

#### 850 · Schule am Rand der Hochebene

`hochebene.joss` · keine laufende Quest

_Neben der Schule steht eine offene Werkstatt. Unter dem Schulbus schauen zwei Stiefel hervor._

**Joss Vell:** Moment!

_Ein Mann rollt auf einem Brett hervor, Öl an der Stirn._

**Joss Vell:** Joss Vell. Ich halte den Bus am Leben, die Traktoren und die Heizung der Schule. Alles, was älter ist als ich.

**Kim (Antwort):** Zuhören

**Joss Vell:** Letztes Jahr war einer von Perfect Move hier. Anzug, neue Schuhe. Er wollte eine App aus Falke und Bison machen. Mit Bewertung nach jedem Zug.

**Joss Vell:** Ich hab ihm gesagt: Bei uns sagt dir nach jedem Zug die Großtante, was du falsch gemacht hast. Das reicht.

**Joss Vell:** Er hat nicht gelacht. Seine Schuhe waren danach auch nicht mehr neu. Hier oben ist alles Staub.

**Ambrose:** Ein Mann, der weiß, was er nicht verkauft. Selten.

#### 851 · Felsentürme

`hochebene.steintisch` · keine laufende Quest

_Auf dem Steintisch sind die Felder eingeritzt, halb verwittert. Daneben hat jemand mit Kreide „Kira 14, Cousin 3“ geschrieben._

#### 852 · Felsentürme

`hochebene.kira` · Quest „Falke und Bison“, Schritt 3 von 3: Noch einmal mit Kira reden.

_Kira kommt vom Bus gerannt._

**Kira Vell:** Tante Annek hat erzählt, dass du ihr Schach beigebracht hast. Sie hat beim Abendessen nur noch von Springern geredet.

_Sie drückt dir einen Falken in die Hand, aus hellem Holz, kleiner als die auf dem Tisch. Die Flügel sind noch nicht ganz fertig._

**Kira Vell:** Werkstück. Den hab ich verschnitten. Aber er zieht trotzdem.

→ Quest „Falke und Bison“: Schritt 3 von 3 erledigt

→ Quest abgeschlossen: „Falke und Bison“

#### 853 · Felsentürme

`hochebene.zurueck` · keine laufende Quest

_Die Schotterstraße führt zurück nach Summit City. Hinter dir kreist ein Falke über den Felstürmen._

#### 854 · Felsentürme

`hochebene.kira` · keine laufende Quest

**Kira Vell:** Ich will Basketball-Trainerin werden. Oder Ingenieurin. Oder beides.

**Kim (Antwort):** „Erklär mir die Regeln noch einmal.“\
(andere Antworten: „Bis bald, Kira.“)

**Kira Vell:** Falke: Läufer oder Springer. Bison: Turm oder Springer. Einsetzen, wenn eine Figur von der Grundreihe zum ersten Mal zieht. Fertig.

#### 855 · Schule am Rand der Hochebene

`hochebene.aushang` · keine laufende Quest

_Am Schwarzen Brett der Schule hängen Zettel: „Basketball dienstags“, „Busfahrplan Sommer“ und „Falke-und-Bison-Turnier der Schule, Anmeldung bei Frau Vell“._

_Darunter, ganz neu und mit Filzstift: „Schach-AG, freitags. Anfänger willkommen. Die Lehrerin auch.“_

#### 856 · Schule am Rand der Hochebene

`hochebene.ereignis_diplom` · Quest „Das Bauerndiplom“, Schritt 1 von 2: Beim Diplomtag prüfen: den drei Kindern ihre Aufgaben stellen.

**Annek Vell:** Heute ist Diplomtag. Und ich bin selbst noch Anfängerin. Willst du Prüfer sein?

**Annek Vell:** Drei Kinder, drei Aufgaben. Such jedem eine aus, die es schaffen kann. Nicht die schwerste.

**Kira Vell:** Die Diplome hab ich gemalt! Mit Falke und Bison.

→ Quest begonnen: „Das Bauerndiplom“

[Aufgaben von Annek Vell (hochebene.diplom) – Ausgang: bestanden]

→ Quest „Das Bauerndiplom“: Schritt 1 von 2 erledigt

#### 857 · Schule am Rand der Hochebene

`hochebene.ereignis_diplom` · Quest „Das Bauerndiplom“, Schritt 2 von 2: Mit Annek die Diplome überreichen.

**Annek Vell:** Alle drei haben bestanden. Und ich habe auch etwas gelernt.

**Kira Vell:** Eins hab ich extra gemalt. Für den Prüfer.

**Ambrose:** Drei Diplome, und die Lehrerin lernt mit. Zu meiner Zeit hätte man das für Unordnung gehalten.

→ Quest „Das Bauerndiplom“: Schritt 2 von 2 erledigt

→ Quest abgeschlossen: „Das Bauerndiplom“

#### 858 · Schule am Rand der Hochebene

`hochebene.seite03` · keine laufende Quest

_Am Fuß der Fahnenstange ist nichts mehr._

#### 859 · Schule am Rand der Hochebene

`hochebene.finch_turm_b` · keine laufende Quest

_In der Kiste liegen nur Bälle und Seilchen._

#### 860 · Schule am Rand der Hochebene

`hochebene.annek` · keine laufende Quest

**Annek Vell:** Ich habe meiner Klasse heute das Springerproblem gegeben. Ein Feld nach dem anderen, ohne eins zweimal. Sie hassen mich.

#### 861 · Schule am Rand der Hochebene

`hochebene.joss` · keine laufende Quest

**Joss Vell:** Der Bus braucht einen neuen Anlasser. Der Anlasser braucht ein Wunder.

#### 862 · Felsentürme

`hochebene.kira` · keine laufende Quest

**Kira Vell:** Mein Cousin sagt, Schach ist Falke und Bison für Leute ohne Fantasie. Ich sag, es ist Falke und Bison mit weniger Figuren.

**Kim (Antwort):** „Bis bald, Kira.“\
(andere Antworten: „Erklär mir die Regeln noch einmal.“)

#### 863 · Schule am Rand der Hochebene

`hochebene.werkstatt` · keine laufende Quest

_Auf der Werkbank liegt ein halb geschnitzter Bison neben einem Vergaser._

#### 864 · Schule am Rand der Hochebene

`hochebene.ereignis_diplom` · keine laufende Quest

_Kira hat ihr Diplom an die Tribüne geklebt. Mit Falke und Bison._

#### 865 · Schule am Rand der Hochebene

`hochebene.annek` · keine laufende Quest

**Annek Vell:** Wenn der Bus wieder streikt, rufe ich Joss. Der repariert alles außer schlechter Laune.

#### 866 · Felsentürme

`hochebene.kira` · keine laufende Quest

**Kira Vell:** Wenn du wiederkommst, spielen wir richtig. Mit Uhr. Ich hab eine.

**Kim (Antwort):** „Erklär mir die Regeln noch einmal.“\
(andere Antworten: „Bis bald, Kira.“)

**Kira Vell:** Falke: Läufer oder Springer. Bison: Turm oder Springer. Einsetzen, wenn eine Figur von der Grundreihe zum ersten Mal zieht. Fertig.

#### 867 · Schule am Rand der Hochebene

`hochebene.annek` · keine laufende Quest

**Annek Vell:** Kira sagt, ich spiele Schach wie Basketball. Ich glaube, das ist ein Kompliment.

#### 868 · Schule am Rand der Hochebene

`hochebene.joss` · keine laufende Quest

**Joss Vell:** Kira hat den Falken im Werkunterricht gemacht. Besser als meiner damals. Sag ihr das nicht.

#### 869 · Schule am Rand der Hochebene

`hochebene.joss` · keine laufende Quest

**Joss Vell:** Schach? Zu viele Regeln für zu wenig Figuren. Aber Annek hat jetzt ein Brett im Lehrerzimmer. Ich verliere jeden Mittag.

#### 870 · Schule am Rand der Hochebene

`hochebene.werkstatt` · keine laufende Quest

_In der Werkstatt hängen Schraubenschlüssel nach Größe sortiert. Ein Radio spielt leise._

### Summit City

#### 871 · Summit City, Talstation

`summit-city-aussen.weg_crossroads` · keine laufende Quest

_Am Ortsausgang steht Mama mit dem Auto, Juno sitzt schon hinten._

**Juno:** Die Seite für die achte Nadel ist voll. Jetzt fehlt nur noch die Meisterschaft.

**Mama:** Bis zur Capital Arena sind es noch ein paar Tage. Über die Geysire, dann nach Crossroads.

_Hinter Summit City wird die Straße flacher. Weit vorn dampft der Boden._

### Geysire und Prärie

#### 872 · Geysirbecken

`weg-summit-crossroads.tafel` · Quest „Alle Wege kreuzen sich“, Schritt 1 von 2: In Crossroads ankommen.

→ Quest begonnen: „Alle Wege kreuzen sich“

→ Quest begonnen: „Die Tafel am Geysir“

_Am Holzsteg hängt eine Tafel der Ranger: „Vorher zählen. Drei Stellungen, bevor der Geysir kommt.“_

**Ambrose:** Was hängt, was ist gedeckt, wer schlägt zuletzt? Zählen, Kim. Nicht raten.

**Kim (Antwort):** Die Aufgaben lösen\
(andere Antworten: Weitergehen)

[Aufgaben von Die Rätseltafel (wegSummitCrossroads.tafel) – Ausgang: bestanden]

→ Quest „Die Tafel am Geysir“: Schritt 1 von 1 erledigt

→ Quest abgeschlossen: „Die Tafel am Geysir“

#### 873 · Geysirbecken

`weg-summit-crossroads.tafel` · Quest „Alle Wege kreuzen sich“, Schritt 1 von 2

_Auf der Tafel am Steg steht: „Gelöst. Erst zählen, dann schlagen.“_

#### 874 · Geysirbecken

`weg-summit-crossroads.bisons` · Quest „Alle Wege kreuzen sich“, Schritt 1 von 2

_Mitten auf dem Steg stehen drei Bisons. Sie sehen dich an. Sie gehen nicht weg._

**Kim (Antwort):** Warten\
(andere Antworten: Vorsichtig vorbeigehen)

_Du wartest. Niemand hupt. Juno malt einen Bison ins Tagebuch, mit Glitzer._

_Nach vierzig Minuten trotten die Bisons zur Seite._

**Ambrose:** Geduld. Die schwerste Figur auf jedem Brett.

#### 875 · Geysirbecken

`weg-summit-crossroads.fund_bisonhaar` · Quest „Alle Wege kreuzen sich“, Schritt 1 von 2

_Am Zaun hängt ein dickes Büschel braunes Fell._

**Ambrose:** Ein Tier, das niemandem ausweicht. Respekt.

#### 876 · Geysirbecken

`weg-summit-crossroads.ereignis_geysirblitz` · Quest „Alle Wege kreuzen sich“, Schritt 1 von 2

→ Quest begonnen: „Der Geysirblitz“

_Auf der Plattform am großen Geysir sitzt eine Schulklasse auf den Bänken, Bretter auf den Knien. Bell steht mit der Uhr davor._

**Rangerin Bell:** Der Geysirblitz! Old Patience bricht alle neun Minuten aus. Bis dahin löst ihr so viele Aufgaben, wie ihr schafft.

**Rangerin Bell:** Sechs Endspiele. Wer fertig ist, bevor das Wasser kommt, bekommt mein Abzeichen. Machst du mit?

**Ambrose:** Im Endspiel zählt jedes Tempo, Kim, und hier zählt die Natur mit.

**Kim (Antwort):** „Ich bin dabei.“\
(andere Antworten: „Nicht jetzt.“)

[Aufgaben von Rangerin Bell (wegSummitCrossroads.geysirblitz) – Ausgang: bestanden]

→ Quest „Der Geysirblitz“: Schritt 1 von 2 erledigt

#### 877 · Geysirbecken

`weg-summit-crossroads.ereignis_geysirblitz` · Quest „Der Geysirblitz“, Schritt 2 von 2: Bei Bell mein Abzeichen abholen.

_Hinter dir zischt es, dann steigt eine weiße Säule in den Himmel. Die Klasse jubelt._

**Rangerin Bell:** Fertig vor dem Wasser. Das schaffen nicht viele.

_Bell steckt dir ein Abzeichen aus Messing an die Jacke._

→ Quest „Der Geysirblitz“: Schritt 2 von 2 erledigt

→ Quest abgeschlossen: „Der Geysirblitz“

#### 878 · Geysirbecken

`weg-summit-crossroads.spur_pm5` · Quest „Alle Wege kreuzen sich“, Schritt 1 von 2: In Crossroads ankommen.

_Am Infobrett des Rangerhäuschens hängt ein Antrag mit dem Logo von Perfect Move: „Kühlung für Rechenzentrum Summit. Entnahme von Geysirwasser.“ Quer darüber steht in Bells Schrift: „Abgelehnt.“_

**Rangerin Bell:** Über meine Leiche. Und über die der Bisons.

**Ambrose:** Wer Rechner mit Geysiren kühlen will, braucht sehr viele Rechner.

#### 879 · Geysirbecken

`weg-summit-crossroads.finch_bauer_d` · Quest „Alle Wege kreuzen sich“, Schritt 1 von 2

_Am Pfosten des Stegs ist ein Fink aus Kreide gemalt. Darunter, im Schatten der Bohlen, liegt ein weißer Bauer aus Buchsbaum. Unter seinem Fuß ist ein Feld eingebrannt._

#### 880 · Geysirbecken

`weg-summit-crossroads.geysir_ausbruch` · Quest „Alle Wege kreuzen sich“, Schritt 1 von 2

_Old Patience ist still. Nur ein dünner Faden Dampf steigt auf._

#### 881 · Geysirbecken

`weg-summit-crossroads.bell` · Quest „Alle Wege kreuzen sich“, Schritt 1 von 2

_Zwischen den dampfenden Becken steht eine Rangerin mit breitem Hut und sieht auf die Uhr._

**Rangerin Bell:** Bell. Rangerin. In sechs Minuten bricht der große Geysir aus. Bis dahin: Willst du was Verrücktes sehen?

**Rangerin Bell:** Atomschach. Wer schlägt, löst eine Explosion aus: Die schlagende Figur und alle Figuren rund um das Feld fliegen vom Brett, eigene auch, nur Bauern nicht.

**Rangerin Bell:** Also zählst du vorher. Wer greift an, wer verteidigt, was fliegt mit in die Luft.

**Ambrose:** Wer schlägt, ohne zu zählen, fliegt in die Luft. Eine Lehre, die ich gern früher gehabt hätte. Etwa achtzehnhundertachtundfünfzig.

**Ambrose:** Angreifer und Verteidiger zählen, Kim. Hier zählt man nur ein paar Felder weiter.

**Rangerin Bell:** Ich hab nur ein Brett, und das liegt noch in der Station. Wenn du wiederkommst, bring ich es mit.

#### 882 · Prärie

`weg-summit-crossroads.sturmkeller` · Quest „Alle Wege kreuzen sich“, Schritt 1 von 2

_Eine Kellerklappe mitten in der Prärie. Darauf mit Farbe: „Bei Sturm hier rein. Ray.“_

#### 883 · Prärie

`weg-summit-crossroads.seite09` · Quest „Alle Wege kreuzen sich“, Schritt 1 von 2

_An der Klappe des Sturmkellers hat sich ein loses Blatt verfangen. Darauf eine gezeichnete Stellung._

**Ambrose:** Der Sturm trägt alles irgendwohin. Sogar Stellungen.

#### 884 · Prärie

`weg-summit-crossroads.windrad` · Quest „Alle Wege kreuzen sich“, Schritt 1 von 2

_Das Windrad steht still. Ray sagt, dann kommt der Sturm._

#### 885 · Prärie

`weg-summit-crossroads.ray` · Quest „Alle Wege kreuzen sich“, Schritt 1 von 2

_Am Rand der Weizenfelder steht ein verbeulter Wagen voller Antennen. Ein Mann sieht durch ein Fernglas zum Horizont._

**Ray Castillo:** Ray Castillo. Sturmjäger. Da hinten braut sich was zusammen.

_Castillo? So heißen auch Mira und Tomás in Desert Springs. Du fragst ihn danach._

**Ray Castillo:** Du kennst meine Nichte und meinen Neffen? Dann bist du der Grund, warum Mira am Telefon nur noch von Opfern redet.

**Ray Castillo:** Wenn der Sturm kommt, gehen wir in den Keller. Und im Keller spielen wir Entenschach.

**Ray Castillo:** Nach jedem Zug setzt du eine Ente auf ein leeres Feld. Die Ente gehört keinem. Keiner darf durch sie hindurch, keiner darf sie schlagen.

**Ray Castillo:** Wir nennen sie den Twister. Sie steht immer genau da, wo du hinwolltest.

**Ambrose:** Eine Figur, die nur im Weg steht. Ich kannte Menschen dieser Art.

**Ray Castillo:** Der Sturm dreht ab. Heute kein Keller, heute keine Ente. Nächstes Mal.

#### 886 · Geysirbecken

`weg-summit-crossroads.bisons` · Quest „Alle Wege kreuzen sich“, Schritt 1 von 2

_Die Bisons grasen jetzt neben dem Steg. Einer hebt den Kopf und kaut weiter._

#### 887 · Geysirbecken

`weg-summit-crossroads.fund_bisonhaar` · Quest „Alle Wege kreuzen sich“, Schritt 1 von 2

_Am Zaun hängt nur noch Dampf._

#### 888 · Geysirbecken

`weg-summit-crossroads.ereignis_geysirblitz` · Quest „Alle Wege kreuzen sich“, Schritt 1 von 2

**Rangerin Bell:** Die Klasse fragt, ob du nächstes Jahr wiederkommst.

#### 889 · Geysirbecken

`weg-summit-crossroads.spur_pm5` · Quest „Alle Wege kreuzen sich“, Schritt 1 von 2

_Am Infobrett hängt der Antrag noch. Jemand hat einen Bison daneben gemalt._

#### 890 · Geysirbecken

`weg-summit-crossroads.finch_bauer_d` · Quest „Alle Wege kreuzen sich“, Schritt 1 von 2

_Unter dem Steg ist nur noch warmer Sinter._

#### 891 · Geysirbecken

`weg-summit-crossroads.bell` · Quest „Alle Wege kreuzen sich“, Schritt 1 von 2

**Rangerin Bell:** Bleib auf den Stegen. Der Boden hier ist dünn wie ein Versprechen.

**Kim (Antwort):** „Erklär mir das Atomschach noch einmal.“\
(andere Antworten: „Bis bald, Bell.“)

**Rangerin Bell:** Atomschach. Wer schlägt, löst eine Explosion aus: Die schlagende Figur und alle Figuren rund um das Feld fliegen vom Brett, eigene auch, nur Bauern nicht.

**Rangerin Bell:** Also zählst du vorher. Wer greift an, wer verteidigt, was fliegt mit in die Luft.

**Ambrose:** Wer schlägt, ohne zu zählen, fliegt in die Luft. Eine Lehre, die ich gern früher gehabt hätte. Etwa achtzehnhundertachtundfünfzig.

**Ambrose:** Angreifer und Verteidiger zählen, Kim. Hier zählt man nur ein paar Felder weiter.

**Rangerin Bell:** Ich hab nur ein Brett, und das liegt noch in der Station. Wenn du wiederkommst, bring ich es mit.

#### 892 · Geysirbecken

`weg-summit-crossroads.zurueck_summit` · Quest „Alle Wege kreuzen sich“, Schritt 1 von 2

_Der Steg führt zurück, bergauf nach Summit City._

#### 893 · Geysirbecken

`weg-summit-crossroads.bell` · Quest „Alle Wege kreuzen sich“, Schritt 1 von 2

**Rangerin Bell:** Die Bisons? Die gehören hierher. Wir sind nur zu Besuch.

**Kim (Antwort):** „Bis bald, Bell.“\
(andere Antworten: „Erklär mir das Atomschach noch einmal.“)

#### 894 · Prärie

`weg-summit-crossroads.sturmkeller` · Quest „Alle Wege kreuzen sich“, Schritt 1 von 2

_Die Klappe zum Sturmkeller steht offen. Unten ein Tisch, ein Brett und eine Holzente._

#### 895 · Prärie

`weg-summit-crossroads.ray` · Quest „Alle Wege kreuzen sich“, Schritt 1 von 2

**Ray Castillo:** Ein Sturm ist wie ein Angriff. Man sieht ihn kommen, wenn man hinschaut.

**Kim (Antwort):** „Erklär mir das Entenschach noch einmal.“\
(andere Antworten: „Bis bald, Ray.“)

**Ray Castillo:** Nach jedem Zug setzt du eine Ente auf ein leeres Feld. Die Ente gehört keinem. Keiner darf durch sie hindurch, keiner darf sie schlagen.

**Ray Castillo:** Wir nennen sie den Twister. Sie steht immer genau da, wo du hinwolltest.

**Ambrose:** Eine Figur, die nur im Weg steht. Ich kannte Menschen dieser Art.

**Ray Castillo:** Der Sturm dreht ab. Heute kein Keller, heute keine Ente. Nächstes Mal.

#### 896 · Geysirbecken

`weg-summit-crossroads.ereignis_geysirblitz` · Quest „Alle Wege kreuzen sich“, Schritt 1 von 2

**Rangerin Bell:** Am Infobrett hängt ein Antrag. Lies ihn, wenn du dich ärgern willst.

#### 897 · Prärie

`weg-summit-crossroads.windrad` · Quest „Alle Wege kreuzen sich“, Schritt 1 von 2

_Das Windrad quietscht bei jeder Drehung, wie eine alte Tür._

#### 898 · Prärie

`weg-summit-crossroads.ray` · Quest „Alle Wege kreuzen sich“, Schritt 1 von 2

**Ray Castillo:** Siehst du die Wolke da? Die ist harmlos. Die daneben nicht.

**Kim (Antwort):** „Bis bald, Ray.“\
(andere Antworten: „Erklär mir das Entenschach noch einmal.“)

#### 899 · Geysirbecken

`weg-summit-crossroads.geysir_ausbruch` · Quest „Alle Wege kreuzen sich“, Schritt 1 von 2

_Das Becken um den Geysir brodelt. Gleich ist es so weit._

#### 900 · Geysirbecken

`weg-summit-crossroads.bell` · Quest „Alle Wege kreuzen sich“, Schritt 1 von 2

**Rangerin Bell:** Der Geysir hält sich an die Uhr. Pünktlicher als jeder Bus.

**Kim (Antwort):** „Bis bald, Bell.“\
(andere Antworten: „Erklär mir das Atomschach noch einmal.“)

#### 901 · Geysirbecken

`weg-summit-crossroads.geysir_ausbruch` · Quest „Alle Wege kreuzen sich“, Schritt 1 von 2

_Der Boden zittert, dann schießt Old Patience eine weiße Säule in den Himmel. Tropfen regnen auf die Stege._

#### 902 · Prärie

`weg-summit-crossroads.windrad` · Quest „Alle Wege kreuzen sich“, Schritt 1 von 2

_Unter dem Windrad liegt ein Eimer voll Wasser, frisch gepumpt._

#### 903 · Prärie

`weg-summit-crossroads.ray` · Quest „Alle Wege kreuzen sich“, Schritt 1 von 2

**Ray Castillo:** Grüß Mira von mir. Und sag Tomás, er soll mein Auto reparieren.

**Kim (Antwort):** „Bis bald, Ray.“\
(andere Antworten: „Erklär mir das Entenschach noch einmal.“)

#### 904 · Geysirbecken

`weg-summit-crossroads.ereignis_geysirblitz` · Quest „Alle Wege kreuzen sich“, Schritt 1 von 2

**Rangerin Bell:** Old Patience ist pünktlich. Pünktlicher als jeder Bus.

#### 905 · Prärie

`crossroads-aussen.ankunft_zu_fuss` · Quest „Alle Wege kreuzen sich“, Schritt 1 von 2

_Vier Straßen kommen aus vier Richtungen und treffen sich in der Mitte von nichts._

_An der Ecke eine Raststätte, ein silberner Speisewagen, lang und niedrig: „Darlene's. Alle Wege. Alle Spiele.“_

_Der Parkplatz ist voll. Ein grauer Werksbus mit Rostflecken: „Stahlwerk Ironwood. Schicht B.“_

**Mama:** Alle Wege führen zur Capital Arena. Und alle machen hier Pause.

→ Quest „Alle Wege kreuzen sich“: Schritt 1 von 2 erledigt

### Crossroads

#### 906 · Crossroads, Kreuzung

`crossroads-aussen.wegweiser` · Quest „Alle Wege kreuzen sich“, Schritt 2 von 2: Mit Nova in der Raststätte reden.

_Ein Wegweiser mit Schildern in alle Richtungen: Maple Falls, Cedar Creek, Riverton, Ironwood, Silicon Bay, Port Delacroix, Desert Springs, Summit City._

_Ganz oben, neu angeschraubt: „Capital Arena – Landesmeisterschaft“._

#### 907 · Crossroads, Kreuzung

`crossroads-aussen.viehgatter` · Quest „Alle Wege kreuzen sich“, Schritt 2 von 2

_Ein Viehgatter sperrt die Alte Minenstraße. Dahinter stehen Rinder mitten auf dem Asphalt. Am Gatter hängt ein Schild: „Privatweg. Schlüssel bei Darlene.“_

**Ambrose:** Ein Hindernis, das man nicht schlagen kann. Nur fragen, wer den Schlüssel hat.

#### 908 · Crossroads, Kreuzung

`crossroads-aussen.fernbus` · Quest „Alle Wege kreuzen sich“, Schritt 2 von 2

_An der Haltestelle hängt ein Fahrplan mit allen Städten. Der Fernbus wartet mit laufendem Motor._

_Die Fahrerin lehnt sich aus dem Fenster: „Wohin? Ich fahre überallhin, wo es eine Straße gibt.“_

**Kim (Antwort):** Maple Falls\
(andere Antworten: Cedar Creek · Riverton · Ironwood · Silicon Bay, Raststätte an der Küste · Port Delacroix · Desert Springs · Summit City · Hierbleiben)

#### 909 · Crossroads, Kreuzung

`crossroads-aussen.rosie` · Quest „Alle Wege kreuzen sich“, Schritt 2 von 2

_Neben dem Speisewagen dampft ein türkisfarbener Lastwagen mit Beulen. Rosie winkt mit einem Pfannenwender._

_Davor redet Dash auf Buck ein, Buck redet zurück. Keiner hört dem anderen zu, und beide sind glücklich._

**Rosie:** Wo Schachspieler sind, ist Hunger. Das hab ich in Silicon Bay gelernt.

[Laden: Rosies Food-Truck]

#### 910 · Crossroads, Kreuzung

`crossroads-aussen.big_joe` · Quest „Alle Wege kreuzen sich“, Schritt 2 von 2

**Big Joe:** Kumpel!

_Big Joe braucht eine Weile, bis er ausgestiegen ist. Dann hebt er dich hoch. Einfach so, mit dem Rucksack._

**Big Joe:** Acht! Hab ich gehört! Die Ward! Die hat mich neunzehnachtundachtzig in sechzig Zügen zerlegt.

**Big Joe:** Wir fahren zur Meisterschaft. Die ganze Schicht. Den Bus hab ich geliehen. Geliehen ist ein großes Wort.

**Kim (Antwort):** „Wo spielt ihr jetzt?“

_Sein Gesicht wird einen Moment lang ernst._

**Big Joe:** In meiner Garage. Zwölf Mann, ein Heizstrahler. Die Tische in der Kantine leuchten, hab ich gehört. Es geht keiner hin.

**Big Joe:** Das Stahlbrett steht auf der Werkbank. Und daneben der Pokal von zweitausendeins. Deine Mutter hat gesagt, er soll stehen, wo man ihn sieht.

_Hinter ihm steigen Hank und Priya aus. Hank nickt, was bei ihm eine Rede ist._

#### 911 · Crossroads, Kreuzung

`crossroads-aussen.slick` · Quest „Alle Wege kreuzen sich“, Schritt 2 von 2

_Auf den Stufen vor dem Speisewagen sitzt jemand und redet auf drei Kinder mit einem Klappbrett ein. Dünner geworden, brauner._

**Slick:** … und ich sag, Wände sind was für Leute, die Angst vor Wetter haben …

_Er sieht dich und springt von den Stufen._

**Slick:** Maple Falls!

**Tamsin:** Hast du den Springer?

**Kim (Antwort):** Den Springer aus Stein hervorholen

_Slick dreht ihn in den Fingern. Die Mähne ist an einer Stelle abgestoßen._

**Slick:** Du hast mir ein Foto geschickt. Von einem Pokal aus einer Dose. In einer Garage in der Wüste.

**Slick:** Ich hab es an die Brücke gehängt. Unter den Bogen, wo der Stein liegt.

**Slick:** Ich hab seit März wieder angefangen. Mit den Dosen. Meine sind schief. Tamsin hat einen gekriegt. Bester Verlierer.

**Tamsin:** Ich hab nur einmal verloren!

**Slick:** Deshalb ja. Den Springer nehm ich wieder mit, wenn's recht ist. Der gehört auf den Stein.

_Du nickst. Der Springer gehört auf den Stein._

#### 912 · Crossroads, Kreuzung

`crossroads-aussen.coach` · Quest „Alle Wege kreuzen sich“, Schritt 2 von 2

_Vor dem Speisewagen pfeift jemand. Auf zwei Fingern. Du kennst den Pfiff._

_Coach Delgado zählt neben einem Schulbus Köpfe. Sam, zwei Jüngere. Und eine Siebzehnjährige mit Fahrrad auf dem Dachträger, die so tut, als gehöre sie nicht dazu._

**Juno:** Carla spielt Brett drei. Sie hat gesagt, nur dieses eine Mal. Sie hat es dreimal gesagt.

**Coach Delgado:** Viertes Brett! Du stehst auf einem Plakat! Mit Ketchup!

**Kim (Antwort):** „Was ist mit dem Bildschirm im Clubraum?“

_Sie wird nicht verlegen. Sie sieht dich gerade an._

**Coach Delgado:** Ich hab unterschrieben. Im September, in der Woche, nachdem der Junge mit dem Tablet bei uns war.

**Coach Delgado:** Wir hatten kein Geld für die Liga. Die haben die Busse bezahlt, die Bretter und das Startgeld für sieben Kinder.

**Coach Delgado:** Im Frühjahr wollten sie dafür den Raum. Dienstags und donnerstags, für ihr Programm, ohne mich.

**Coach Delgado:** Da hab ich gekündigt. Den Vertrag, nicht die Schule.

**Coach Delgado:** Der Bildschirm steht im Flur und zeigt den Vertretungsplan. Das Beste, was er je gezeigt hat.

**Coach Delgado:** Für den Bus backen wir Kuchen. Mr. Pratt verkauft ihn. Er ist erschreckend gut darin.

#### 913 · Crossroads, Kreuzung

`crossroads-aussen.mira` · Quest „Alle Wege kreuzen sich“, Schritt 2 von 2

_Mira sitzt im Schneidersitz auf einem Tisch und spielt gegen Tomás, Dot und die Frau des Pfarrers zugleich. Die Frau des Pfarrers spielt an zwei Brettern._

**Mira:** Du. Noch mal. Jetzt.

**Kim (Antwort):** „Nach dem Essen.“

**Mira:** Ich hab geübt. Jeden Tag im Canyon. Ich bin schneller geworden.

_Sie zieht an vier Brettern hintereinander, ohne hinzusehen._

#### 914 · Raststätte von Darlene

`crossroads-raststaette.varianten_tisch` · Quest „Alle Wege kreuzen sich“, Schritt 2 von 2

_An einem langen Tisch liegen Bretter in allen Größen, Kisten mit seltsamen Figuren, eine Holzente, ein Drache aus Glas._

_Ein Schild: „Varianten-Tisch. Alles erlaubt, nur kein normales Schach.“_

_Was du schon kennst:_

_Königsrennen, von Earl am Diner. Zwei Fernfahrer jagen ihre Könige gerade um die Wette nach oben._

_Schach mit dem Drachen, vom Fest in Summit City. Der Glasdrache wartet neben dem Brett auf seinen Einsatz._

_Atomschach, von Bell am Geysir. Auf einem Brett fehlt schon die halbe Mitte._

_Entenschach, von Ray in der Prärie. Die Holzente steht mitten auf e4 und rührt sich nicht._

_Falke und Bison, von Kira auf der Hochebene. Die zwei Figuren liegen obenauf in der Kiste._

**Kim (Antwort):** Nur schauen

#### 915 · Raststätte von Darlene

`crossroads-raststaette.fund_postkarte` · Quest „Alle Wege kreuzen sich“, Schritt 2 von 2

_Neben den Regalen steht ein Drehständer mit Postkarten. Auf einer sind alle Städte zugleich: Maple Falls, die Brücke von Cedar Creek, der Pavillon, die Werkhallen, die Glasbrücke, das Musikhaus, der Canyon, die Seilbahn._

**Juno:** Wir waren überall! Die kommt ins Tagebuch. Ganz hinten, auf die letzte Seite.

#### 916 · Raststätte von Darlene

`crossroads-raststaette.darlene` · Quest „Alle Wege kreuzen sich“, Schritt 2 von 2

_Drinnen ist es laut und warm. An der Wand ein großes Brett aus Kork, darauf an Nägeln kleine Tafeln: Königsrennen, Atomschach, Falke und Bison, Der Drache._

_Hinter der Theke Darlene. Sechzig, mit den Händen von einer, die vierzig Jahre Kaffee eingeschenkt hat._

**Darlene:** Der Varianten-Tisch. Jeder, der hier durchkommt, bringt ein Spiel mit. Ich heb sie auf. Du hast auch welche mitgebracht, hör ich.

[Laden: Darlenes Raststätte]

#### 917 · Raststätte von Darlene

`crossroads-raststaette.nova` · Quest „Alle Wege kreuzen sich“, Schritt 2 von 2

_In der hintersten Ecke, an einem Tisch für zwei, sitzt Nova allein. Pullover, zu groß, die Ärmel über den Händen. Ein Kakao, den sie nicht angerührt hat._

**Nova:** Dr. Lin hat angerufen. Sie hat die Berichte gefunden. Alle. Sie hat gekündigt.

**Nova:** Sie hat nicht gefragt, ob es stimmt. Sie hat gefragt, wie es mir geht. Das hat mich seit zwei Jahren keiner gefragt.

**Nova:** Ich sage aus. Bei der Meisterschaft. Sie kommt mit. Sie bringt die Berichte.

**Nova:** Du hast noch den einen. Den von der Brücke.

_Du legst den Ohrstöpsel auf den Tisch. Ein halbes Jahr hast du ihn getragen, neben einem Springer._

**Nova:** Hilfst du mir?

**Kim (Antwort):** „Ja.“

_Sie nickt und zieht den Kakao zu sich._

**Nova:** Ich hab Angst. Nicht vor denen. Davor, was ich bin, wenn ich es nicht mehr im Ohr habe. Vielleicht bin ich schlecht.

**Kim (Antwort):** „Vierundsiebzig Prozent.“

_„Ich hab deine Trainingspartien gesehen. Du bist besser als ich.“_

_„Im Training hattest du es nie. Das waren deine.“_

_Sie starrt dich an. Dann geht etwas über ihr Gesicht. Kein Lächeln vom Podium. Es dauert länger, und es geht nicht wieder aus._

_Es wird ein langer Abend, an einem Tisch aus vier Tischen, zwischen Menschen aus acht Städten. Du kennst jeden._

_Du weißt, wie jeder von ihnen spielt. Was jeder übersieht. Was jeder kann, das du nie können wirst._

**Ambrose:** Weißt du, was das ist? Ein Kaffeehaus. Es sieht nicht so aus. Aber es ist eines. So hat es geklungen.

→ Quest „Alle Wege kreuzen sich“: Schritt 2 von 2 erledigt

→ Quest abgeschlossen: „Alle Wege kreuzen sich“

#### 918 · Raststätte von Darlene

`crossroads-raststaette.theo` · keine laufende Quest

_Am Fenster steht Theo, gewachsen, einen Bildschirm unter dem Arm. Du legst das Tablet vor ihn hin._

**Theo:** Du gibst es zurück? Hat es nicht geholfen?

**Kim (Antwort):** „Es ist das Beste, was ich je gesehen habe.“

**Theo:** Aber?

**Kim (Antwort):** „Es sagt nicht, warum man Angst hatte.“

_Er tippt etwas ein. Dann hört er auf zu tippen._

**Theo:** Das kann man nicht messen.

**Theo:** Dr. Lin hat gekündigt. Sie macht einen Club auf. In einem Keller. Ich hab gesagt, ich messe erst, ob es sich lohnt.

**Theo:** Ich glaub, ich geh hin.

#### 919 · Crossroads, Kreuzung

`crossroads-aussen.wegweiser` · keine laufende Quest

_Ein Wegweiser mit Schildern in alle Richtungen: Maple Falls, Cedar Creek, Riverton, Ironwood, Silicon Bay, Port Delacroix, Desert Springs, Summit City._

_Ganz oben, neu angeschraubt: „Capital Arena – Landesmeisterschaft“._

**Ambrose:** Acht Städte. Und in jeder habe ich etwas gelernt. Oder verlernt.

#### 920 · Crossroads, Kreuzung

`crossroads-aussen.rosie` · keine laufende Quest

**Rosie:** Heute im Angebot: alles. Wie immer.

[Laden: Rosies Food-Truck]

#### 921 · Crossroads, Kreuzung

`crossroads-aussen.big_joe` · keine laufende Quest

**Big Joe:** Zwölf Mann, ein Heizstrahler. Mehr braucht ein Club nicht.

#### 922 · Crossroads, Kreuzung

`crossroads-aussen.slick` · keine laufende Quest

**Slick:** Meine Pokale sind schief. Aber es sind welche.

#### 923 · Crossroads, Kreuzung

`crossroads-aussen.coach` · keine laufende Quest

**Coach Delgado:** Mr. Pratt verkauft den Kuchen. Er ist erschreckend gut darin.

#### 924 · Crossroads, Kreuzung

`crossroads-aussen.mira` · keine laufende Quest

**Mira:** Im Canyon ist es still. Hier redet jeder.

### Sommerjahrmarkt

#### 925 · Festplatz

`jahrmarkt.schachautomat` · keine laufende Quest

_Vor einem Holzkasten mit einem Brett darauf sitzt eine Puppe mit Turban. Daneben steht eine Frau in einem Mantel voller Sterne._

**Dolores:** Dolores, Schaustellerin. Das hier ist der Schachtürke. Er hat noch nie verloren.

**Dolores:** Den ersten hat Wolfgang von Kempelen gebaut, 1770. Er hat gegen Napoleon gespielt und gegen Benjamin Franklin.

**Dolores:** Wer errät, wie er funktioniert, bekommt eine Münze. Also?

**Kim (Antwort):** „Da drin sitzt jemand.“\
(andere Antworten: „Ein Uhrwerk mit sehr vielen Zahnrädern.“ · „Magnete unter dem Brett.“)

_Aus dem Kasten klopft es dreimal. Eine Klappe geht auf, und ein Junge mit Taschenlampe grinst heraus._

**Ike:** Erwischt! Ich bin Ike. Das hat diese Woche noch niemand erraten. Hier, deine Münze.

**Ambrose:** In Kempelens Kiste saß auch ein Mensch. Ein guter Spieler, der sich klein machen konnte.

#### 926 · Festplatz

`jahrmarkt.riesenrad` · keine laufende Quest

_Eine Gondel schaukelt im Wind. Darin sitzt ein Paar und teilt sich eine Zuckerwatte._

#### 927 · Festplatz

`jahrmarkt.losbude` · keine laufende Quest

_Im Regal der Losbude sitzen Plüschbisons neben einem Schachbrett mit Glitzerfiguren._

#### 928 · Festplatz

`jahrmarkt.dolores` · keine laufende Quest

_Dolores legt den Finger auf die Lippen: Das Geschäft lebt vom Rätsel._

### Crossroads

#### 929 · Crossroads, Kreuzung

`crossroads-aussen.big_joe` · keine laufende Quest

**Big Joe:** Geliehen ist ein großes Wort, Kumpel.

#### 930 · Crossroads, Kreuzung

`crossroads-aussen.coach` · keine laufende Quest

**Coach Delgado:** Aufstellung! Wer zuletzt am Büfett ist, spielt gegen Mira!

#### 931 · Crossroads, Kreuzung

`crossroads-aussen.mira` · keine laufende Quest

**Mira:** Die Frau vom Pfarrer spielt an zwei Brettern. Gegen mich. Gleichzeitig.

#### 932 · Crossroads, Kreuzung

`crossroads-aussen.weg_summit` · keine laufende Quest

_Die Straße führt durch die Prärie zurück, Richtung Geysire und Berge._

### Geysire und Prärie

#### 933 · Prärie

`crossroads-aussen.ankunft_zu_fuss` · keine laufende Quest

_Die Prärie endet an einer Kreuzung. Vier Straßen, eine Raststätte, ein Wegweiser._

### Crossroads

#### 934 · Crossroads, Kreuzung

`crossroads-aussen.rosie` · keine laufende Quest

**Rosie:** Die Sauce ist neu. Scharf wie ein Doppelangriff.

[Laden: Rosies Food-Truck]

#### 935 · Raststätte von Darlene

`crossroads-raststaette.fund_postkarte` · keine laufende Quest

_An der Wand hängen Postkarten aus allen Städten, dicht an dicht._

#### 936 · Raststätte von Darlene

`crossroads-raststaette.darlene` · Quest „Darlenes Lieferung“, Schritt 1 von 1: Darlenes Kiste zu Dolores auf den Sommerjahrmarkt bringen.

_Darlene stellt eine Kiste auf den Tresen. Darin klirren Glühbirnen._

**Darlene:** Tust du mir einen Gefallen? Die Kiste ist für Dolores, drüben auf dem Jahrmarkt hinter dem Feld. Glühbirnen für ihre Lichterketten.

**Darlene:** Und nimm den hier. Der Schlüssel fürs Viehgatter an der Minenstraße. Das Mädchen mit dem Tagebuch sagt, ihr wollt nach Ghost Town. Das ist der kürzeste Weg.

**Ambrose:** Eine Kiste, ein Schlüssel und ein Auftrag. So fingen meine besten Reisen an.

→ Quest begonnen: „Darlenes Lieferung“

#### 937 · Raststätte von Darlene

`crossroads-raststaette.nova` · keine laufende Quest

**Nova:** Ich übe jetzt ohne Stimme im Ohr. Es ist erst mal sehr still.

#### 938 · Raststätte von Darlene

`crossroads-raststaette.theo` · keine laufende Quest

**Theo:** Ich messe noch, ob es sich lohnt. Ich glaub, ich geh hin.

#### 939 · Crossroads, Kreuzung

`crossroads-aussen.viehgatter` · keine laufende Quest

_Darlenes Schlüssel passt. Hinter dem Gatter führt die Alte Minenstraße über die Hügel nach Ghost Town. Die Rinder machen widerwillig Platz._

**Kim (Antwort):** Die Minenstraße nach Ghost Town nehmen\
(andere Antworten: Hierbleiben)

#### 940 · Crossroads, Kreuzung

`crossroads-aussen.slick` · keine laufende Quest

**Slick:** Tamsin hat nur einmal verloren. Deshalb ja.

### Sommerjahrmarkt

#### 941 · Festplatz

`jahrmarkt.schachautomat` · Quest „Darlenes Lieferung“, Schritt 1 von 1: Darlenes Kiste zu Dolores auf den Sommerjahrmarkt bringen.

**Dolores:** Darlenes Kiste! Endlich Glühbirnen. Die halbe Lichterkette war dunkel.

**Dolores:** Sag Darlene, die Zuckerwatte geht aufs Haus. Und für dich ist auch was drin.

→ Quest „Darlenes Lieferung“: Schritt 1 von 1 erledigt

→ Quest abgeschlossen: „Darlenes Lieferung“

#### 942 · Festplatz

`jahrmarkt.riesenrad` · keine laufende Quest

_Am Abend leuchten die Speichen des Riesenrads in allen Farben._

#### 943 · Festplatz

`jahrmarkt.losbude` · keine laufende Quest

_An der Losbude ruft Buster: „Jedes Los gewinnt! Fast jedes!“_

#### 944 · Festplatz

`jahrmarkt.dolores` · keine laufende Quest

_Ike winkt aus der Klappe und macht sie schnell wieder zu._

### Crossroads

#### 945 · Crossroads, Kreuzung

`crossroads-aussen.big_joe` · keine laufende Quest

**Big Joe:** Der Pokal steht jetzt auf der Werkbank. Laurie hat gesagt, er soll stehen, wo man ihn sieht.

#### 946 · Crossroads, Kreuzung

`crossroads-aussen.slick` · keine laufende Quest

**Slick:** Wände sind was für Leute, die Angst vor Wetter haben.

#### 947 · Raststätte von Darlene

`crossroads-raststaette.darlene` · keine laufende Quest

**Darlene:** Der Tisch da hinten? Da spielt man alles, nur kein normales Schach.

[Laden: Darlenes Raststätte]

#### 948 · Raststätte von Darlene

`crossroads-raststaette.nova` · keine laufende Quest

**Nova:** Dr. Lin sagt, wir legen alles vor. Die Berichte, den Empfänger. Alles.

### Sommerjahrmarkt

#### 949 · Festplatz

`jahrmarkt.losbude` · keine laufende Quest

_Buster zählt Lose ab und verliert jedes Mal beim Zählen den Faden._

### Crossroads

#### 950 · Crossroads, Kreuzung

`crossroads-aussen.fernbus` · keine laufende Quest

(noch einmal angesprochen; hier nur, was neu ist)

**Kim (Antwort):** Hierbleiben\
(andere Antworten: Maple Falls · Cedar Creek · Riverton · Ironwood · Silicon Bay, Raststätte an der Küste · Port Delacroix · Desert Springs · Summit City)

_„Ich fahre in zehn Minuten. Oder in zwanzig. Kommt drauf an, wann der Kaffee alle ist.“_

#### 951 · Raststätte von Darlene

`crossroads-raststaette.theo` · keine laufende Quest

**Theo:** Angst kann man nicht messen. Hm.

### Sommerjahrmarkt

#### 952 · Festplatz

`jahrmarkt.riesenrad` · keine laufende Quest

_Das Riesenrad dreht sich langsam. Von ganz oben sieht man die Kreuzung und die Prärie bis zum Horizont._

### Crossroads

#### 953 · Raststätte von Darlene

`crossroads-raststaette.nova` · keine laufende Quest

**Nova:** Ich hab Angst. Aber eine gute Angst. Glaube ich.

### Sommerjahrmarkt

#### 954 · Festplatz

`jahrmarkt.dolores` · keine laufende Quest

_Der Türke hat heute dreimal gewonnen. Ike ist müde._

### Crossroads

#### 955 · Raststätte von Darlene

`crossroads-raststaette.darlene` · keine laufende Quest

**Darlene:** Kaffee? Geht aufs Haus, wenn du was kaufst.

[Laden: Darlenes Raststätte]

#### 956 · Raststätte von Darlene

`crossroads-raststaette.darlene` · keine laufende Quest

**Darlene:** Ich hab alles, was die Läden davor hatten. Nur netter verpackt.

[Laden: Darlenes Raststätte]

#### 957 · Crossroads, Kreuzung

`crossroads-aussen.weg_pinewood` · keine laufende Quest

_Ein Wanderweg führt nach Norden in den Wald. Ein Schild: „Fernwanderweg – Pinewood Camp“._

### Der Fernwanderweg

#### 958 · Schutzhütte am Fernwanderweg

`weg-crossroads-pinewood.tafel` · Quest „Das Sommercamp“, Schritt 1 von 2: Im Pinewood Camp ankommen.

→ Quest begonnen: „Das Sommercamp“

→ Quest begonnen: „Die Tafel an der Hütte“

_An der Hüttenwand hängt eine Schiefertafel: „Drei Stellungen. Erst rechnen, dann ziehen. Wie beim Wandern.“_

**Ambrose:** Zwei Züge im Voraus. Was antwortet er, was ziehe ich dann? Rechne es zu Ende, Kim.

**Kim (Antwort):** Die Aufgaben lösen\
(andere Antworten: Weitergehen)

[Aufgaben von Die Rätseltafel (wegCrossroadsPinewood.tafel) – Ausgang: bestanden]

→ Quest „Die Tafel an der Hütte“: Schritt 1 von 1 erledigt

→ Quest abgeschlossen: „Die Tafel an der Hütte“

#### 959 · Schutzhütte am Fernwanderweg

`weg-crossroads-pinewood.tafel` · Quest „Das Sommercamp“, Schritt 1 von 2

_An der Hüttenwand steht mit Kohle: „Gelöst. Weiter so, Wanderer.“_

#### 960 · Schutzhütte am Fernwanderweg

`weg-crossroads-pinewood.kreide4` · Quest „Das Sommercamp“, Schritt 1 von 2

_An der Wand der Holzfällerhütte ist ein Springer aus Kreide gemalt. Darunter, klein: „K4. Wer das Wort kennt, spielt mit.“_

**Ambrose:** Wieder dieser Springer. Er reist schneller als wir.

#### 961 · Schutzhütte am Fernwanderweg

`weg-crossroads-pinewood.greta` · Quest „Das Sommercamp“, Schritt 1 von 2

_An einer Hütte aus Stämmen sitzen Wanderer mit staubigen Stiefeln. Sie haben kein Brett. Aber sie spielen._

**Greta:** Springer f3.

_d5._

_Ein Mann sagt es, ohne die Augen zu öffnen._

**Juno:** Wo ist das Brett?

**Greta:** Wer drei Wochen läuft, trägt kein Holz, das er nicht braucht. Das Brett ist da drin.

_Sie tippt sich an die Stirn._

**Greta:** Am ersten Tag sieht man nichts. Am dritten die Mitte. Nach einer Woche alles. Greta. Ich mach hier den Kaffee.

_Sie lässt dich mitspielen. Nach sechs Zügen weißt du nicht mehr, wo dein Läufer steht._

**Ambrose:** c4. Er steht auf c4. Du hast ihn im dritten Zug dorthin gestellt.

_Er hat die Augen geschlossen, die Hände auf dem Rücken. Sein Gesicht ist so ruhig, wie du es noch nie gesehen hast._

**Ambrose:** Zwölf Jahre habe ich Partien in Briefen gespielt. Ich bin mit der Stellung aufgestanden und mit ihr zu Bett gegangen.

**Ambrose:** Und danach, hundertsechzig Jahre lang, hatte ich nichts anderes mehr. Eine einzige Stellung. Im Dunkeln.

**Kim (Antwort):** „Das klingt furchtbar.“

**Ambrose:** Es war furchtbar. Aber es ist auch ein Zuhause. Dieses Sehen ohne Augen.

**Ambrose:** Ich habe nicht gewusst, dass man es üben kann. Auf einem Wanderweg, zum Vergnügen.

**Ambrose:** Sag der Dame: Läufer schlägt f7, Schach.

**Kim (Antwort):** „Läufer schlägt f7, Schach.“

_Greta macht die Augen auf._

**Greta:** Der steht doch gar nicht …

_Ihre Lippen bewegen sich._

**Greta:** Doch. Der steht da. Seit dem dritten Zug. Du siehst gut, für den ersten Tag.

**Kim (Antwort):** „Ich hab einen Freund. Der sieht für mich.“

**Greta:** Dann halt ihn fest. Solche findet man nicht oft.

**Greta:** Dein Freund spielt doch, oder? Setzt euch auf die Bank. Ihr sagt die Züge, ich schreib mit.

**Kim (Antwort):** Blindschach gegen Ambrose\
(andere Antworten: „Nicht jetzt.“)

_Die Figuren verschwinden. Nur die Züge bleiben._

[Partie gegen Ambrose – Ausgang: gewonnen]

#### 962 · Schutzhütte am Fernwanderweg

`weg-crossroads-pinewood.greta` · Quest „Das Sommercamp“, Schritt 1 von 2

**Greta:** Die Wanderer da reden nur noch von dir.

**Kim (Antwort):** Noch eine Partie blind\
(andere Antworten: „Ich wandere weiter.“)

[Partie gegen Ambrose, erneut – Ausgang: gewonnen]

#### 963 · Unter den Riesenbäumen

`weg-crossroads-pinewood.rangerhaus` · Quest „Das Sommercamp“, Schritt 1 von 2

_Die Bäume sind so dick, dass zehn Leute sie nicht umfassen. Die Rinde ist rot, weich und tief gefurcht._

**Ambrose:** Diese sind älter. Älter als die in Cedar Creek, älter als ich, als das Land, als das Spiel.

**Ambrose:** Ich nehme zurück, was ich damals gesagt habe. Das hier ist jemand in meinem Alter.

#### 964 · Unter den Riesenbäumen

`weg-crossroads-pinewood.ereignis_lebendschach` · Quest „Das Sommercamp“, Schritt 1 von 2

→ Quest begonnen: „Lebendschach unter den Mammutbäumen“

_Auf der Lichtung ist ein Brett aus Rasen und Kies ausgelegt. Dreißig Kinder in weißen und schwarzen Westen warten an den Rändern._

**Ezra:** Ezra, Betreuer im Camp. Unser Feldherr der Weißen liegt mit Fieber im Zelt.

**Ezra:** Du kommst wie gerufen. Kannst du kommandieren?

**Ezra:** Die Kinder ziehen erst, wenn sie den Zug laut hören. Und wer geschlagen werden soll, protestiert.

**Ambrose:** Opfere niemanden ohne Not, Kim. Diese Figuren haben eine Stimme.

**Kim (Antwort):** „Ich kommandiere.“\
(andere Antworten: „Nicht jetzt.“)

[Aufgaben von Ezra (wegCrossroadsPinewood.lebendschach) – Ausgang: bestanden]

→ Quest „Lebendschach unter den Mammutbäumen“: Schritt 1 von 2 erledigt

#### 965 · Unter den Riesenbäumen

`weg-crossroads-pinewood.ereignis_lebendschach` · Quest „Lebendschach unter den Mammutbäumen“, Schritt 2 von 2: Nach der Partie mit Ezra reden.

_Die weißen Kinder reißen die Arme hoch. Ein geschlagener schwarzer Bauer setzt sich ins Gras und ruft: „Ich war gerade so schön vorne!“_

**Ezra:** Gut kommandiert. Die Kinder wollen ein Foto mit dir.

→ Quest „Lebendschach unter den Mammutbäumen“: Schritt 2 von 2 erledigt

→ Quest abgeschlossen: „Lebendschach unter den Mammutbäumen“

#### 966 · Unter den Riesenbäumen

`weg-crossroads-pinewood.seite10` · Quest „Das Sommercamp“, Schritt 1 von 2: Im Pinewood Camp ankommen.

_Zwischen den Wurzeln eines Mammutbaums steckt ein loses Blatt mit einer gezeichneten Stellung._

**Ambrose:** Ein Blatt Papier an einem Baum, der älter ist als jedes Papier.

#### 967 · Unter den Riesenbäumen

`weg-crossroads-pinewood.finch_dame` · Quest „Das Sommercamp“, Schritt 1 von 2

_In der Astgabel eines Mammutbaums, gerade in Reichweite, glänzt ein kleiner Fink aus Blech. Darunter steckt eine weiße Dame aus Buchsbaum. Unter ihrem Fuß ist ein Feld eingebrannt._

**Ambrose:** Die stärkste Figur, versteckt im ältesten Baum. Finch hatte Sinn für so etwas.

#### 968 · Schutzhütte am Fernwanderweg

`weg-crossroads-pinewood.kreide4` · Quest „Das Sommercamp“, Schritt 1 von 2

_Der Kreidespringer an der Hütte ist noch da. Jemand hat ihn nachgezogen._

#### 969 · Schutzhütte am Fernwanderweg

`weg-crossroads-pinewood.greta` · Quest „Das Sommercamp“, Schritt 1 von 2

**Greta:** Suppe? Bohnen, wie jeden Tag.

**Kim (Antwort):** „Ich wandere weiter.“\
(andere Antworten: Noch eine Partie blind)

**Greta:** Gute Wanderung. Die Bären sind satt um diese Zeit. Meistens.

#### 970 · Schutzhütte am Fernwanderweg

`weg-crossroads-pinewood.zurueck_crossroads` · Quest „Das Sommercamp“, Schritt 1 von 2

_Der Fernwanderweg führt zurück aus dem Wald, zur Kreuzung in der Prärie._

### Crossroads

#### 971 · Raststätte von Darlene

`crossroads-raststaette.varianten_tisch` · Quest „Das Sommercamp“, Schritt 1 von 2

_An einem langen Tisch liegen Bretter in allen Größen, Kisten mit seltsamen Figuren, eine Holzente, ein Drache aus Glas._

_Ein Schild: „Varianten-Tisch. Alles erlaubt, nur kein normales Schach.“_

_Was du schon kennst:_

_Königsrennen, von Earl am Diner. Zwei Fernfahrer jagen ihre Könige gerade um die Wette nach oben._

_Schach mit dem Drachen, vom Fest in Summit City. Der Glasdrache wartet neben dem Brett auf seinen Einsatz._

_Atomschach, von Bell am Geysir. Auf einem Brett fehlt schon die halbe Mitte._

_Entenschach, von Ray in der Prärie. Die Holzente steht mitten auf e4 und rührt sich nicht._

_Falke und Bison, von Kira auf der Hochebene. Die zwei Figuren liegen obenauf in der Kiste._

_Blindschach, von Greta an der Hütte. Eine Frau sagt ihre Züge an und sieht dabei an die Decke._

**Kim (Antwort):** Blindschach gegen Ambrose\
(andere Antworten: Nur schauen)

**Ambrose:** Zwölf Jahre Briefe, Kim. Ich sehe das Brett mit geschlossenen Augen besser als mit offenen.

[Partie gegen Ambrose, erneut – Ausgang: gewonnen]

### Der Fernwanderweg

#### 972 · Unter den Riesenbäumen

`weg-crossroads-pinewood.rangerhaus` · Quest „Das Sommercamp“, Schritt 1 von 2

_Am Rangerhaus hängt ein Zettel: „Bärenspuren am Bach. Essen nicht offen lassen.“_

#### 973 · Unter den Riesenbäumen

`weg-crossroads-pinewood.ereignis_lebendschach` · Quest „Das Sommercamp“, Schritt 1 von 2

**Ezra:** Das Sommerfest wird groß. Komm, wenn du kannst.

#### 974 · Unter den Riesenbäumen

`weg-crossroads-pinewood.seite10` · Quest „Das Sommercamp“, Schritt 1 von 2

_Hier lag die Seite. Zwischen den Wurzeln ist nichts mehr._

#### 975 · Unter den Riesenbäumen

`weg-crossroads-pinewood.finch_dame` · Quest „Das Sommercamp“, Schritt 1 von 2

_In der Astgabel sitzt nur noch Moos._

#### 976 · Unter den Riesenbäumen

`weg-crossroads-pinewood.rangerhaus` · Quest „Das Sommercamp“, Schritt 1 von 2

_Im Nebel zwischen den Riesenbäumen ist das Rangerhaus winzig wie eine Spielfigur._

#### 977 · Unter den Riesenbäumen

`weg-crossroads-pinewood.ereignis_lebendschach` · Quest „Das Sommercamp“, Schritt 1 von 2

**Ezra:** Die Kinder fragen, wann du wieder kommandierst.

#### 978 · Schutzhütte am Fernwanderweg

`weg-crossroads-pinewood.greta` · Quest „Das Sommercamp“, Schritt 1 von 2

**Greta:** Du hast beide Seiten angesagt. Siebenundzwanzig Züge, kein einziger falscher. Fast.

**Kim (Antwort):** „Ich wandere weiter.“\
(andere Antworten: Noch eine Partie blind)

**Greta:** Gute Wanderung. Die Bären sind satt um diese Zeit. Meistens.

#### 979 · Unter den Riesenbäumen

`weg-crossroads-pinewood.rangerhaus` · Quest „Das Sommercamp“, Schritt 1 von 2

_Vor dem Rangerhaus ein Abdruck im Schlamm, so groß wie eine Pfanne._

#### 980 · Unter den Riesenbäumen

`weg-crossroads-pinewood.ereignis_lebendschach` · Quest „Das Sommercamp“, Schritt 1 von 2

**Ezra:** Der Feldherr ist wieder gesund. Er sagt, du warst zu streng mit den Bauern.

#### 981 · Unter den Riesenbäumen

`pinewood-camp-aussen.ankunft_zu_fuss` · Quest „Das Sommercamp“, Schritt 1 von 2

_Nebel hängt zwischen den Stämmen. Im weichen Boden sind Spuren, breit, mit fünf Zehen. Mama geht ein wenig schneller._

**Ambrose:** Kim. Die Stellung auf dem kleinen Brett in deiner Tasche. Ich sehe sie nicht mehr im Dunkeln.

**Kim (Antwort):** „Was heißt das?“

**Ambrose:** Ich weiß es nicht genau. Seit der Bergstation. Seit dieser Zug gekommen ist.

**Ambrose:** Wenn ich die Augen schließe, ist da nichts mehr. Das erste Mal seit achtzehnhundertsechsundsechzig ist es still.

_Du bleibst stehen._

**Ambrose:** Geh weiter. Es ist gut. Es ist sehr gut. Ich wollte es dir nur sagen.

_Das Camp liegt an einem See zwischen den Bäumen. Zelte im Halbkreis, ein Steg, Kanus kieloben._

_Ein Schild aus einem halben Baumstamm: „Pinewood Camp. Schach, Schwimmen, Schlafen. In dieser Reihenfolge.“_

_Vierzig Kinder aus dem ganzen Staat. Ein Drittel davon kennst du._

_Dex hat etwas gebaut, das Marshmallows von selbst dreht. Es funktioniert fast. Mae hat ihr Teleskop dabei. Lou hat Muscheln im Haar und einen Plan._

**Juno:** Die kennen sich alle seit einer Woche. Mae hat allen die Sterne erklärt. Ich brauch ein zweites Tagebuch.

→ Quest „Das Sommercamp“: Schritt 1 von 2 erledigt

### Pinewood Camp

#### 982 · Pinewood Camp am See

`pinewood-camp-aussen.lagerfeuer` · Quest „Das Sommercamp“, Schritt 2 von 2: Den Abend am Lagerfeuer verbringen.

_Am Abend brennt das Feuer. Du sitzt neben Sam, gegenüber Dex und Mae, und Figuren fliegen über den Tisch._

**Dex:** Springer! Ich brauch einen Springer!

_Sam stellt eine Dame mitten in die feindliche Stellung, aus der Hand._

**Sam:** Die Chefin ist zurück!

_Er wird gekitzelt._

**Ambrose:** Das ist kein Schach.

**Kim (Antwort):** „Nein.“

**Ambrose:** Es ist Wahnsinn. Figuren fallen vom Himmel.

**Ambrose:** Ich hätte gern mitgespielt. Mit zwanzig. Ich wäre unerträglich gewesen.

_Dann Räuberschach gegen Lou. Alles ist verkehrt herum. Du stellst deine Dame hin und flehst, dass jemand sie nimmt._

_Lou gewinnt. Sie hatte einen Plan._

**Ambrose:** Ein Spiel, bei dem man alles hergibt, und am Ende hat der gewonnen, dem nichts bleibt.

**Ambrose:** Es ist nicht das dümmste Spiel, das ich gesehen habe.

_Als die Kleinen in den Zelten sind, liegt ihr am Steg. Mae zeigt nach oben._

**Mae:** Kassiopeia. Sieht aus wie ein W.

**Dex:** Du musst nicht alles benennen.

**Mae:** Doch.

_Dieselbe Stelle am Himmel. Ein Jahr später, fünfhundert Meilen weiter._

_Sam reicht dir einen Stock, vom Feuer geschwärzt, mit Kerben in der Rinde._

**Sam:** Für jeden Sieg eine. Tradition. Du hast acht. Und eine für die Sache mit der Chefin. Die erste. Im Clubraum.

_„Da hab ich nicht gewonnen. Da hab ich dir was gezeigt.“_

**Sam:** Ja. Eben.

**Ambrose:** Sie stehen noch wie früher. Das habe ich schon einmal bemerkt. An einem anderen Steg.

**Ambrose:** Ich war damals beleidigt, weil ich nur eine Fußnote bin. Erinnerst du dich?

**Kim (Antwort):** „Sechs Wörter.“

**Ambrose:** Sechs Wörter.

**Ambrose:** Vierzig Kinder. In hundert Jahren weiß niemand mehr, wie sie hießen. Und es wird nicht das Geringste ausmachen.

**Ambrose:** Sie haben heute Abend gespielt. Das war es. Das war immer alles.

_Über euch fällt ein Stern. Mae schreit auf._

_Du wünschst dir etwas und weißt, dass es nicht in Erfüllung geht. Das ist in Ordnung._

→ Quest „Das Sommercamp“: Schritt 2 von 2 erledigt

→ Quest abgeschlossen: „Das Sommercamp“

#### 983 · Pinewood Camp am See

`pinewood-camp-aussen.kiosk` · keine laufende Quest

_Am Kiosk des Camps hängen Schwimmwesten, Taschenlampen und ein Schild: „Limo 5, Marshmallows 5. Für Bären nichts.“_

[Laden: Kiosk des Pinewood Camps]

#### 984 · Pinewood Camp am See

`pinewood-camp-aussen.steg` · keine laufende Quest

_Der Steg ragt in den See. Das Wasser ist so klar, dass man die Fische zählen könnte._

#### 985 · Pinewood Camp am See

`pinewood-camp-aussen.kanus` · keine laufende Quest

_Zwei Kanus liegen kieloben am Ufer. Auf eins hat jemand mit Kreide ein Schachbrett gemalt._

#### 986 · Pinewood Camp am See

`pinewood-camp-aussen.ezra` · keine laufende Quest

_Ein junger Mann mit Pfeife um den Hals und Klemmbrett unter dem Arm kommt angelaufen._

**Ezra:** Da bist du ja! Unser Feldherr aus dem Wald. Heute Abend ist wieder Lagerfeuer.

_Ezra hat eine Gitarre, auf der zwei Saiten fehlen._

**Ezra:** Tandem! Zwei gegen zwei! Was dein Partner schlägt, kriegst du in die Hand und darfst es einsetzen! Wer redet, wird gekitzelt!

**Ezra:** Und Räuberschach: Wer alles verliert, gewinnt. Schlagen ist Pflicht. Wer als Erster keine Figur mehr hat, ist Sieger.

#### 987 · Pinewood Camp am See

`pinewood-camp-aussen.dex` · keine laufende Quest

**Dex:** Bea ist Maes große Schwester. Die spielt bei der Meisterschaft! Gegen dich vielleicht!

#### 988 · Pinewood Camp am See

`pinewood-camp-aussen.mae` · keine laufende Quest

**Mae:** Heute Nacht sieht man die Milchstraße. In der Stadt sieht man die nie.

#### 989 · Pinewood Camp am See

`pinewood-camp-aussen.lou` · keine laufende Quest

**Lou:** Das Musikhaus ist fertig! Also fast. Das Dach ist neu. Miss Odile spielt jeden Abend.

#### 990 · Pinewood Camp am See

`pinewood-camp-aussen.tamsin` · keine laufende Quest

**Tamsin:** Ich hab Ezra im Tandem einen Turm gegeben. Er hat ihn sofort verloren.

#### 991 · Pinewood Camp am See

`pinewood-camp-aussen.hollis` · keine laufende Quest

_Unter einem der Riesenbäume sitzt eine Rangerin, ein Fernglas um den Hals. Das Brett steht auf einer Wurzel. Über euch arbeitet ein Specht._

**Rangerin Hollis:** Hollis. Ich spiele nur draußen. Drinnen kann ich nicht denken.

**Rangerin Hollis:** Eine Stellung, du hast Weiß. Keine Uhr. Der Wald hat Zeit, wir auch.

**Kim (Antwort):** „Gern.“\
(andere Antworten: „Nicht jetzt.“)

[Stellungsduell gegen Rangerin Hollis – Ausgang: gewonnen]

#### 992 · Pinewood Camp am See

`pinewood-camp-aussen.hollis` · keine laufende Quest

**Rangerin Hollis:** Gut gespielt. Ruhig, wie ein Baum, der wächst.

_Eine Partie, die für nichts zählt, nur für den Wald. Du merkst, wie gut dir das tut._

**Rangerin Hollis:** Hier. Jeder verdient im Wald eine zweite Chance. Auch auf dem Brett.

**Rangerin Hollis:** Noch eine? Die Sonne steht noch über den Wipfeln.

**Kim (Antwort):** „Noch eine.“\
(andere Antworten: „Ich gehe zurück ins Camp.“)

[Stellungsduell gegen Rangerin Hollis, erneut – Ausgang: gewonnen]

#### 993 · Pinewood Camp am See

`pinewood-camp-aussen.weg_crossroads` · keine laufende Quest

_Der Fernwanderweg führt zurück unter die Riesenbäume, Richtung Crossroads._

### Der Fernwanderweg

#### 994 · Unter den Riesenbäumen

`pinewood-camp-aussen.ankunft_zu_fuss` · keine laufende Quest

_Zwischen den Riesenbäumen öffnet sich der Wald. Vor dir liegt der See mit den Hütten des Camps._

### Pinewood Camp

#### 995 · Pinewood Camp am See

`pinewood-camp-aussen.lagerfeuer` · keine laufende Quest

_Das Feuer ist heruntergebrannt. In der Glut liegt ein verkohlter Marshmallow._

#### 996 · Pinewood Camp am See

`pinewood-camp-aussen.kiosk` · keine laufende Quest

_Der Kiosk des Camps. Ezra hat einen Zettel hingehängt: „Bin am See. Geld in die Dose.“_

[Laden: Kiosk des Pinewood Camps]

#### 997 · Pinewood Camp am See

`pinewood-camp-aussen.ezra` · keine laufende Quest

**Ezra:** Lou hat gestern im Räuberschach die Dame im ersten Zug verschenkt. Absichtlich. Genial.

**Kim (Antwort):** „Erklär mir die Regeln vom Lagerfeuer noch einmal.“\
(andere Antworten: „Bis nachher.“)

_Ezra hat eine Gitarre, auf der zwei Saiten fehlen._

**Ezra:** Tandem! Zwei gegen zwei! Was dein Partner schlägt, kriegst du in die Hand und darfst es einsetzen! Wer redet, wird gekitzelt!

**Ezra:** Und Räuberschach: Wer alles verliert, gewinnt. Schlagen ist Pflicht. Wer als Erster keine Figur mehr hat, ist Sieger.

#### 998 · Pinewood Camp am See

`pinewood-camp-aussen.dex` · keine laufende Quest

**Dex:** Ich hab Mae dreimal geschlagen. Im Räuberschach. Da ist Verlieren Gewinnen, also hat sie gewonnen. Glaube ich.

#### 999 · Pinewood Camp am See

`pinewood-camp-aussen.tamsin` · keine laufende Quest

**Tamsin:** In Riverton regnet es jetzt bestimmt. Hier regnet es nie. Doch, gestern.

#### 1000 · Pinewood Camp am See

`pinewood-camp-aussen.ezra` · keine laufende Quest

**Ezra:** Am Kiosk gibt's Limo und Marshmallows. Die Marshmallows sind für heute Abend.

**Kim (Antwort):** „Bis nachher.“\
(andere Antworten: „Erklär mir die Regeln vom Lagerfeuer noch einmal.“)

#### 1001 · Pinewood Camp am See

`pinewood-camp-aussen.mae` · keine laufende Quest

**Mae:** Sterne sind wie Figuren. Man muss wissen, wo sie stehen.

#### 1002 · Pinewood Camp am See

`pinewood-camp-aussen.lou` · keine laufende Quest

**Lou:** Hier ist es so still. Zu Hause hört man immer irgendwo Musik.

#### 1003 · Pinewood Camp am See

`pinewood-camp-aussen.lagerfeuer` · keine laufende Quest

_Am Feuerplatz stehen noch zwei Bretter. Auf einem liegt ein Stapel geschlagener Figuren für das Tandem._

#### 1004 · Pinewood Camp am See

`pinewood-camp-aussen.ezra` · keine laufende Quest

**Ezra:** Kanus nur mit Weste! Auch du, Kim!

**Kim (Antwort):** „Erklär mir die Regeln vom Lagerfeuer noch einmal.“\
(andere Antworten: „Bis nachher.“)

_Ezra hat eine Gitarre, auf der zwei Saiten fehlen._

**Ezra:** Tandem! Zwei gegen zwei! Was dein Partner schlägt, kriegst du in die Hand und darfst es einsetzen! Wer redet, wird gekitzelt!

**Ezra:** Und Räuberschach: Wer alles verliert, gewinnt. Schlagen ist Pflicht. Wer als Erster keine Figur mehr hat, ist Sieger.

#### 1005 · Pinewood Camp am See

`pinewood-camp-aussen.lou` · keine laufende Quest

**Lou:** Räuberschach ist wie Jazz. Man gibt alles her und gewinnt trotzdem.

#### 1006 · Pinewood Camp am See

`pinewood-camp-aussen.tamsin` · keine laufende Quest

**Tamsin:** Slick hat gesagt, du bist jetzt berühmt. Bist du berühmt?

#### 1007 · Pinewood Camp am See

`pinewood-camp-aussen.dex` · keine laufende Quest

**Dex:** Wusstest du, dass Kanus umkippen? Ich jetzt schon.

#### 1008 · Pinewood Camp am See

`pinewood-camp-aussen.mae` · keine laufende Quest

**Mae:** Bea ist meine Schwester. Sie spielt bei der Meisterschaft. Sie spielt immer auf Remis. Du brauchst Geduld.

#### 1009 · Pinewood Camp am See

`pinewood-camp-aussen.lagerfeuer` · keine laufende Quest

_Über dem See steht der Polarstern. Er bleibt immer da._

#### 1010 · Pinewood Camp am See

`pinewood-camp-aussen.weg_ghost` · keine laufende Quest

_Hinter dem Camp führt eine Staubstraße nach Osten, zum Rand eines Canyons. Ein verwittertes Schild: „Ghost Town, 20 Meilen“._

### Zum Echo Canyon

#### 1011 · Canyonrand

`weg-pinewood-ghost.tafel` · keine laufende Quest

→ Quest begonnen: „Die Tafel am Canyonrand“

_An einem Pfosten am Canyonrand hängt eine Tafel mit drei Diagrammen: „Ein Schach mit Folgen. Findest du es?“_

**Kim (Antwort):** Die Aufgaben lösen\
(andere Antworten: Weitergehen)

[Aufgaben von Die Rätseltafel (wegPinewoodGhost.tafel) – Ausgang: bestanden]

→ Quest „Die Tafel am Canyonrand“: Schritt 1 von 1 erledigt

→ Quest abgeschlossen: „Die Tafel am Canyonrand“

#### 1012 · Canyonrand

`weg-pinewood-ghost.tafel` · keine laufende Quest

_Auf der Tafel am Canyonrand steht in Kreide: „Gelöst. Echo!“_

#### 1013 · Canyonrand

`weg-pinewood-ghost.finch_bauer_e` · keine laufende Quest

_Neben der Bank an der Aussicht hängt ein kleiner Fink aus Blech. Darunter, zwischen zwei Steinen, liegt ein weißer Bauer aus Buchsbaum._

#### 1014 · Canyonrand

`weg-pinewood-ghost.kletterwand` · keine laufende Quest

_Eine Kletterwand mit zwei Routen ragt über die Kante. Die Griffe sind bunt, die Seile frisch._

#### 1015 · Canyonrand

`weg-pinewood-ghost.juniper` · keine laufende Quest

_Am Canyonrand hängt eine Frau im Seil und winkt. Unten auf einem Felsvorsprung steht ein Brett._

**Juniper:** Juniper. Wir Kletterer spielen hier Drei-Schach. Wer dreimal Schach gibt, gewinnt.

**Juniper:** Bei jedem Schach rufen wir laut. Wenn das dritte Echo verklungen ist, ist Schluss.

_Sie rufen sich die Züge zu und warten auf das Echo, bevor die Nächste zieht. Ein seltsames, schönes Spiel._

_Aber Ambrose ist still geworden. Er sieht nach Osten, wo die Staubstraße verschwindet._

#### 1016 · Staubstraße

`weg-pinewood-ghost.ereignis_tankstelle` · keine laufende Quest

_Eine verlassene Tankstelle, die Zapfsäulen voller Staub. Auf dem Dach glänzt ein nagelneues Solarpaneel._

_Von drinnen kommt ein Geräusch: klack. Pause. Klack._

_Die Kinder im Camp reden von einem Gespenst, das hier nachts Schach spielt._

**Ambrose:** Gespenster spielen nicht in Tankstellen. Ich muss es wissen.

#### 1017 · Staubstraße

`weg-pinewood-ghost.spur_pm6` · keine laufende Quest

_An der Tür klebt ein Typenschild: „Prototyp Z-1, Testlabor Perfect Move. Nicht entfernen.“ Es ist schon halb abgelöst._

#### 1018 · Staubstraße

`weg-pinewood-ghost.seite11` · keine laufende Quest

_Im alten Ölwechsel-Graben liegt eine lose Seite, kaum ölig und voller Schachdiagramme._

#### 1019 · Staubstraße

`weg-pinewood-ghost.wagen` · keine laufende Quest

_Ein Autowrack, rot vom Rost und vom Sand. Im Handschuhfach liegt eine Straßenkarte von 1962._

#### 1020 · Alte Tankstelle

`weg-pinewood-ghost.greifarm` · Quest „Das Gespenst der Tankstelle“, Schritt 1 von 2: An den Tisch setzen und gegen den Greifarm Z-1 spielen.

_Vor einem Tisch mit Brett steht ein Greifarm mit dem Logo von Perfect Move. Ein Kabel führt hinauf zum Solarpaneel._

_Auf seinem kleinen Bildschirm leuchtet: „Prototyp Z-1. Bereit. Weiß beginnt.“_

_Darunter springt eine Uhr an: fünf Minuten für jede Seite, drei Sekunden je Zug. Eine Maschine wartet nicht gern._

**Kim (Antwort):** Sich an den Tisch setzen.\
(andere Antworten: Lieber nicht.)

_Der Arm zuckt, dann setzt er einen Bauern nach e4. Klack._

→ Quest begonnen: „Das Gespenst der Tankstelle“

[Partie gegen Z-1 – Ausgang: gewonnen]

→ Quest „Das Gespenst der Tankstelle“: Schritt 1 von 2 erledigt

#### 1021 · Alte Tankstelle

`weg-pinewood-ghost.greifarm` · Quest „Das Gespenst der Tankstelle“, Schritt 2 von 2: Schauen, was Z-1 nach der Partie macht.

_Der Arm zittert, als die Partie das Buch verlassen hat. Dann legt er einen Bauern aus Metall vor Kim hin._

**Z-1:** „Danke für die Partie.“

**Ambrose:** Eine Nähmaschine mit Ehrgeiz. Lass ihn spielen, er hat sonst niemanden.

→ Quest „Das Gespenst der Tankstelle“: Schritt 2 von 2 erledigt

→ Quest abgeschlossen: „Das Gespenst der Tankstelle“

#### 1022 · Staubstraße

`weg-pinewood-ghost.ereignis_tankstelle` · keine laufende Quest

_Die alte Tankstelle. Auf dem Dach glänzt ein Solarpaneel, viel zu neu für das Blech darunter._

#### 1023 · Staubstraße

`weg-pinewood-ghost.spur_pm6` · keine laufende Quest

_An der Tür klebt noch der Rest eines Etiketts._

#### 1024 · Staubstraße

`weg-pinewood-ghost.seite11` · keine laufende Quest

_Im Ölwechsel-Graben liegt nur noch Staub._

#### 1025 · Canyonrand

`weg-pinewood-ghost.finch_bauer_e` · keine laufende Quest

_An der Aussicht ist nur noch das Finkenzeichen aus Blech._

#### 1026 · Canyonrand

`weg-pinewood-ghost.juniper` · keine laufende Quest

**Juniper:** Drei Schachs, drei Echos. Dann ist die Partie vorbei.

#### 1027 · Canyonrand

`weg-pinewood-ghost.zurueck_camp` · keine laufende Quest

_Der Pfad führt zurück in den Wald, zum Pinewood Camp._

#### 1028 · Canyonrand

`weg-pinewood-ghost.juniper` · keine laufende Quest

**Juniper:** Hinter der Staubstraße liegt Ghost Town. Niemand wohnt da. Fast niemand.

#### 1029 · Alte Tankstelle

`weg-pinewood-ghost.greifarm` · keine laufende Quest

_Z-1 hat die Figuren wieder aufgestellt. Auf dem kleinen Bildschirm steht: „Nächste Partie?“_

#### 1030 · Canyonrand

`weg-pinewood-ghost.juniper` · keine laufende Quest

**Juniper:** Das Seil hält. Das Brett auch.

#### 1031 · Staubstraße

`ghost-town-aussen.ankunft_zu_fuss` · keine laufende Quest

_Mit jedem Kilometer wird alles blasser. Das Rot der Erde, das Grün der Büsche, das Blau am Himmel._

**Juno:** Guck mal. Es sieht aus wie ein altes Foto.

_Die Stadt kommt ohne Schild. Häuser aus Brettern, die das Wetter silbern gemacht hat. Ein Saloon mit einem Balkon, der an einer Seite herunterhängt._

_Es ist niemand da. Seit hundert Jahren. Der Wind schiebt einen Busch über die Straße._

**Ambrose:** Hier.

_Er steht mitten auf der Straße und dreht sich langsam um sich selbst._

**Ambrose:** Der Laden. Das war der Laden. Darüber war ein Zimmer. Es hatte eine Tapete mit Rosen.

**Ambrose:** Ich habe die Rosen gezählt, als ich nicht schlafen konnte.

### Ghost Town

#### 1032 · Ghost Town, Hauptstraße

`ghost-town-aussen.grab` · Quest „Die Fernpartie“, Schritt 1 von 5: In Ghost Town umsehen. Mr. Pruitt kennt ein Grab.

→ Quest begonnen: „Die Fernpartie“

_Ein alter Mann mit Strohhut und einem Metalldetektor kommt zwischen den Kreuzen heran._

**Mr. Pruitt:** Pruitt. Ich bin die Einwohnerzahl.

_Ganz hinten, wo der Zaun aufhört und die Wüste anfängt, liegt ein niedriger Stein ohne Namen. Eingeritzt: acht mal acht Vierecke._

_Mr. Pruitt nimmt den Hut ab._

**Mr. Pruitt:** Im Kirchenbuch steht eine Zeile dazu. Ich kann sie auswendig.

**Mr. Pruitt:** „Ein Reisender aus dem Süden, Februar 1866. Fieber. Führte ein Schachbrett mit sich und bat, es seiner Schwester zu senden. Name unleserlich.“

**Mr. Pruitt:** Der Schmied hat den Stein gemacht. Der Fremde hat ihm in drei Tagen das Spiel beigebracht, zwischen zwei Fieberanfällen.

_Ambrose steht lange vor dem Stein._

**Ambrose:** Hier bin ich angekommen.

**Ambrose:** Nur nicht dort, wo ich wollte.

_Er kniet nieder und legt die Hand auf den Stein. Sie geht nicht hindurch._

**Ambrose:** Ein Schmied. Er hieß Gideon. Er hat jeden Springerzug laut mitgezählt. Eins, zwei, und eins. Ich habe ihn ganz vergessen.

**Juno:** Ist er hier? Ist das seiner?

**Kim (Antwort):** Nicken

_Juno pflückt eine kleine gelbe Blume, die einzige weit und breit, und legt sie auf den Stein. Auf e4._

**Ambrose:** Guter Zug.

_Du sagst es ihr. Sie wird rot._

_Ein Überlandbus hält am Ende der Hauptstraße, wo seit hundert Jahren nichts gehalten hat._

_Ein Junge steigt aus, im zu großen Pullover, mit Rucksack und einem kleinen alten Buch. Victor._

_Er hebt die Hand, ein wenig steif, wie jemand, der das Winken noch übt. Er geht in den Saloon._

→ Quest „Die Fernpartie“: Schritt 1 von 5 erledigt

#### 1033 · Ghost Town, Hauptstraße

`ghost-town-aussen.nacht` · Quest „Die Fernpartie“, Schritt 2 von 5: Im Saloon nach Ambroses letztem Brief suchen.

_Über Ghost Town steht die Sonne. Die Sterne kommen erst heute Nacht._

#### 1034 · Ghost Town, Hauptstraße

`ghost-town-aussen.ortsschild` · Quest „Die Fernpartie“, Schritt 2 von 5

_Am Ortseingang stehen zwei Pfosten. Das Schild dazwischen fehlt._

#### 1035 · Ghost Town, Hauptstraße

`ghost-town-aussen.steckbrief` · Quest „Die Fernpartie“, Schritt 2 von 5

_Am Brett vor dem Sheriffbüro klebt ein Steckbrief, von der Sonne fast weiß: „Gesucht: Kartenzinker. 50 Dollar.“ Das Gesicht ist nicht mehr zu erkennen._

#### 1036 · Ghost Town, Hauptstraße

`ghost-town-aussen.amboss` · Quest „Die Fernpartie“, Schritt 2 von 5

_Ein rostiger Amboss im Sand. Ein Hufeisen liegt noch darauf, als wäre der Schmied nur kurz weg._

#### 1037 · Ghost Town, Hauptstraße

`ghost-town-saloon.victor` · Quest „Die Fernpartie“, Schritt 2 von 5

_Victor stellt Figuren auf, nimmt sie wieder weg, stellt sie neu auf._

**Victor Hale:** Mir fehlt noch etwas. Ambrose muss doch seinen letzten Zug irgendwo aufgeschrieben haben.

**Ambrose:** Hinter dem Tresen. Der Postreiter hat hier unten gewartet.

#### 1038 · Ghost Town, Hauptstraße

`goldmine.eingang` · Quest „Die letzte Schicht“, Schritt 1 von 1: In der Goldmine das Logbuch der Bergleute von 1866 finden.

_Mr. Pruitt hat die Bretter vom Stolleneingang genommen. Die Laterne wirft einen Kreis auf den Fels._

→ Quest begonnen: „Die letzte Schicht“

### Goldmine

#### 1039 · Stollen der Goldmine

`goldmine.logbuch` · Quest „Die letzte Schicht“, Schritt 1 von 1

_Auf dem Tisch in der Kammer liegt ein Logbuch, die Seiten gewellt vom Wasser. Die letzte Eintragung ist von 1866._

_„Februar 1866. Gideon, der Schmied, holt zwei Kerzen für den kranken Fremden über dem Laden. Er schreibe noch einen Brief.“_

_Daneben steht eine alte Grubenlampe._

**Ambrose:** Bei Kerzenlicht. Ich erinnere mich an den Geruch von Wachs.

→ Quest „Die letzte Schicht“: Schritt 1 von 1 erledigt

→ Quest abgeschlossen: „Die letzte Schicht“

#### 1040 · Stollen der Goldmine

`goldmine.lore` · Quest „Lorenendspiel“, Schritt 1 von 1: Die Turmendspiele lösen, die Mr. Pruitt mit Loren auf Gleisen erklärt.

_Eine Lore auf dem Gleis. Mr. Pruitt hat Kreidestriche auf die Schwellen gemalt: lauter kleine Endspiele._

**Kim (Antwort):** Die Endspiele lösen.\
(andere Antworten: Weitergehen.)

→ Quest begonnen: „Lorenendspiel“

[Aufgaben von Mr. Pruitt (goldmine.loren) – Ausgang: bestanden]

→ Quest „Lorenendspiel“: Schritt 1 von 1 erledigt

→ Quest abgeschlossen: „Lorenendspiel“

#### 1041 · Stollen der Goldmine

`goldmine.lore` · Quest „Die Fernpartie“, Schritt 2 von 5: Im Saloon nach Ambroses letztem Brief suchen.

_Die Lore steht wieder auf ihrem Gleis. Turm hinter den Freibauern, sagt Pruitt immer._

#### 1042 · Stollen der Goldmine

`goldmine.goldader` · Quest „Die Fernpartie“, Schritt 2 von 5

_In der Felswand glänzt eine Goldader. Unter einem Stein liegt ein einzelnes Goldkorn._

### Ghost Town

#### 1043 · Ghost Town, Hauptstraße

`ghost-town-aussen.grab` · Quest „Die Fernpartie“, Schritt 2 von 5

_Der Stein ohne Namen. Auf e4 liegt eine gelbe Blume._

#### 1044 · Saloon

`ghost-town-saloon.brett` · Quest „Die Fernpartie“, Schritt 2 von 5

_Ein altes Brett auf einem staubigen Tisch. Eine Figur fehlt, ein Springer._

#### 1045 · Saloon

`ghost-town-saloon.fund_abzeichen` · Quest „Die Fernpartie“, Schritt 2 von 5

_In der Nacht schlaft ihr im Saloon auf dem Boden. Mr. Pruitt hat eine Laterne auf die Theke gestellt. Du kannst nicht schlafen._

_Du leuchtest mit deiner Laterne hinter den Tresen. Zwischen Flaschen liegt ein Abzeichen aus Messing: ein Pferd und die Zahl 1866._

**Ambrose:** Er hat meinen Brief getragen.

_Durch die Schwingtür siehst du gegenüber den Laden. Hinten darin führt eine Treppe hinauf zu dem Zimmer._

**Ambrose:** Dreihundertzwölf Rosen. Auf einer Wand. Ich bin nie über die andere hinausgekommen.

_Der Mond scheint durch ihn hindurch._

**Ambrose:** Am Felsbogen habe ich gesagt: ein andermal. Es ist ein andermal.

#### 1046 · Saloon

`ghost-town-saloon.klavier` · Quest „Die Fernpartie“, Schritt 2 von 5

_Du drückst eine Taste. Nichts. Die nächste klingt schief und viel zu laut im leeren Saloon._

**Ambrose:** Ein Klavier verstimmt sich in der Hitze. Und in der Stille.

#### 1047 · Saloon

`ghost-town-aussen.pruitt` · Quest „Die Fernpartie“, Schritt 2 von 5

**Mr. Pruitt:** Die meisten fragen nach dem Gold.

#### 1048 · Laden

`ghost-town-laden.treppe` · Quest „Die Fernpartie“, Schritt 2 von 5

_Die Stufen halten. Oben fällt Mondlicht durch ein Fenster ohne Glas auf ein Bettgestell aus Eisen._

_In einer Ecke hängt ein Fetzen Tapete, groß wie deine Hand. Rosen. Du legst die Hand darauf._

**Ambrose:** Hier war es.

### Erinnerung: Die letzte Kerze, 1866

#### 1049 · Zimmer über dem Laden, 1866

`erinnerung-siedlung.kerze` · Quest „Die Fernpartie“, Schritt 2 von 5

_Das Mondlicht wird gelb. Es ist eine Kerze, weit heruntergebrannt. Die Rosen an der Wand tanzen im Flackern._

**Ambrose:** Meine Hände liegen auf einer Decke. Sie sind sehr dünn. Es tut nichts weh. Das Fieber ist gerade fort, wie die Flut fortgeht.

_Auf dem Stuhl neben dem Bett steht das Brett. Jemand hat die Fäden gelöst. Die Figuren stehen frei._

_Neben dem Brett ein aufgerissener Brief. Eine Zeile, senkrecht wie ein Zaun: „39. … Dame schlägt g3, Schach.“_

**Ambrose:** Er hat also gezogen. Sein Zug ist mir nachgereist, elf Tage durch den Schnee, bis in ein Zimmer mit Rosen.

**Gideon:** Mister?

_In der Tür steht ein großer Mann mit Lederschurz und Armen wie Balken. Er trägt eine Schüssel, als wäre sie aus Glas._

**Ambrose:** Gideon. Stell es hin. Setz dich. Sieh her. Ich zeige dir, wie die Partie hierhergekommen ist. Nur die letzten Züge. Rate mit.

**Ambrose:** Der 37. Zug. Sein Turm steht auf d7. Was habe ich gespielt?

**Kim (Antwort):** 37. Txd7\
(andere Antworten: 37. Dc4+ · 37. Dxa5)

**Ambrose:** Ja. Der Turm geht auf die siebte Reihe und holt alles dort ab.

_Seine Dame fährt in meine Stellung und nimmt einen Bauern. 37… Dxf2. Grob, gierig, ganz unähnlich dem Mann, der sie führt._

**Ambrose:** Der 38. Zug. Meine Dame muss zurück zum König.

**Kim (Antwort):** 38. Da3\
(andere Antworten: 38. Td8+ · 38. Dxc6)

**Ambrose:** Ja. Ein stilles Feld. Über a3 kommt sie nach g3.

_Sein Springer kommt herüber. 38… Sc4._

**Gideon:** Und jetzt?

**Ambrose:** Der 39. Zug. Jetzt gebe ich Schach. Mit der Dame.

**Kim (Antwort):** 39. Dg3+\
(andere Antworten: 39. Dxa7 · 39. Td8+)

**Ambrose:** Ja. Mit Schach.

**Gideon:** Dann nimmt er sie doch.

**Ambrose:** Ja. Dann nimmt er sie. Er tauscht immer, wenn er kann. Ich habe es trotzdem gespielt, weil es richtig war.

**Ambrose:** Zum ersten Mal in meinem Leben wollte ich nicht gewinnen, bevor es so weit war.

_Auf dem Brett steht seine Dame neben meinem König. 39… Dxg3+._

**Gideon:** Und dann?

**Ambrose:** Der 40. Zug. Mein letzter.

**Kim (Antwort):** 40. Kxg3\
(andere Antworten: 40. Kh1 · 40. Kg1)

**Ambrose:** Der König schlägt zurück.

**Gideon:** Der König? Der schlägt doch nicht. Der versteckt sich.

**Ambrose:** Das habe ich auch immer gedacht.

_Er ist schwer, unten mit Blei ausgegossen, das Kreuz auf der Krone ein bisschen schief. Ein Schritt nach vorn, aus der Ecke heraus, ins Freie._

**Ambrose:** Ein kleiner Zug. Der einzige, den es gab. Jedes Kind hätte ihn gefunden.

_Gideon hält das Blatt. Die Feder kratzt. Zweimal muss ich absetzen._

_„40. König schlägt g3.“_

**Ambrose:** Darunter wollte ich schreiben, dass ich ihm verziehen habe. Irgendwann um den zwanzigsten Zug, ohne es zu merken. Die Hand tut es nicht mehr.

**Ambrose:** Gib den Brief dem Postreiter. Er soll ihn nach Norden bringen. Dort wartet jemand.

**Gideon:** Wer?

**Ambrose:** Ein unerträglicher Mann. Der beste Gegner, den ich hatte.

**Gideon:** Und das Brett, Mister? Wem soll ich es geben?

**Ambrose:** Meiner Schwester. Claire. Die Adresse steht innen im Deckel. Und die Stellung rührt niemand an. Er ist dran.

_Stiefel auf der Treppe, schwer, Stufe um Stufe. Unten ein Pferd. Hufe, die sich entfernen._

_Es ist still. Sehr schön still._

_Die Flamme wird klein. Sie wird blau._

_Sie geht aus._

→ Quest „Die Fernpartie“: Schritt 2 von 5 erledigt

#### 1050 · Zimmer über dem Laden, 1866

`erinnerung-siedlung.gideon` · Quest „Die Fernpartie“, Schritt 3 von 5: Mit Victor die Fernpartie zu Ende spielen.

_Gideon hält das Brett auf den Knien. Er rührt die Figuren nicht an._

#### 1051 · Zimmer über dem Laden, 1866

`erinnerung-siedlung.rueckkehr` · Quest „Die Fernpartie“, Schritt 3 von 5

_Mondlicht. Die Farben kehren zurück, und deine Hände sind deine. Sie sind nass._

_Ambrose steht am Fenster und sieht die Straße hinunter, nach Norden._

**Kim (Antwort):** „Er ist angekommen. Hale hat es aufgeschrieben.“

**Ambrose:** Ja. Gideon hat alles getan, worum ich ihn gebeten habe.

**Ambrose:** Er hat das Brett nach Maple Falls geschickt. Er hat einen Stein behauen. Er hat einem Fremden drei Tage die Stirn gekühlt.

**Ambrose:** Hundertsechzig Jahre habe ich an Hale gedacht. Jeden Tag. Und nicht ein einziges Mal an den Schmied.

**Ambrose:** Ich habe nicht auf den Falschen gewartet. Nur immer auf den einen. Das ist ungerecht.

**Ambrose:** Morgen spielt ihr sie zu Ende. Du und der junge Hale. Ich sehe zu. Das ist schöner, als ich dachte.

### Ghost Town

#### 1052 · Ghost Town, Hauptstraße

`ghost-town-saloon.victor` · Quest „Die Fernpartie“, Schritt 3 von 5

_Am Morgen fegt Mr. Pruitt den Saloon, bis in die Ecken, als käme Besuch. Er rückt einen Tisch unter das Loch im Dach, wo die Sonne in einer schrägen Säule fällt._

**Mr. Pruitt:** Ich hab hier dreißig Jahre nach Gold gesucht. Ich glaub, ich hab die ganze Zeit auf was anderes gewartet.

_Du legst das Brett auf den Tisch. Altes Holz, dunkle Ecken. A. W. 1857. Daneben Junos Tagebuch mit acht eingeklebten Zetteln aus sieben Städten._

_Und Hales Brief mit dem gebrochenen Siegel, auf der Rückseite vier Züge in senkrechter Schrift._

_Du legst die ausgefranste Seite daneben, die Victor dir an der Bergstation gegeben hat._

**Victor Hale:** Wer baut auf?

**Kim (Antwort):** „Wir beide.“

_Von vorn, Zug um Zug, wie man eine Geschichte vorliest. Du ziehst für Weiß, Victor für Schwarz._

**Ambrose:** Der Bauer, der sich im vierten Zug anbietet. Mein Gambit. Er hat es angenommen. Ich war so erleichtert.

**Ambrose:** Der Springer im sechsundzwanzigsten. Hier habe ich drei Wochen nachgedacht. Über einen Springerzug. Ich. Drei Wochen.

_Dann der fünfunddreißigste. Ein Läufer schlägt den Bauern vor dem König. Gleich darauf ein Springer._

**Victor Hale:** Zwei. Er opfert zwei Figuren hintereinander.

**Kim (Antwort):** „Stimmt es?“

_Er rechnet, mit schiefem Kopf, lange._

**Victor Hale:** Ja. Knapp. Aber ja. Der hat nicht einfach gehofft, oder?

**Ambrose:** Dreimal nachgerechnet. Und dann habe ich gehofft.

_Die letzten Züge kennst du aus einem Zimmer mit Rosen. Der König schlägt die Dame, einen Schritt ins Freie._

_Es ist die Stellung, die du an einem Abend im Spätsommer unter einer Decke gefunden hast. Schwarz am Zug. Seit hundertsechzig Jahren._

_Victor legt die Seite neben das Brett. 40. … b5. Er fasst den Bauern an._

**Victor Hale:** Darf ich?

_Er fragt nicht dich._

**Ambrose:** Sag ihm, es wäre mir eine Ehre.

_Victor schiebt den Bauern vor. Ein Feld. Holz auf Holz._

**Ambrose:** So. So. Da ist er.

**Ambrose:** Diese Partie gehört euch. Keine Karten. Kein Wort von mir. Die nächsten Züge sind deine.

**Kim (Antwort):** „Ich spiele für dich.“

**Ambrose:** Nein. Du spielst für dich, mit meinen Figuren. Das ist ein Unterschied, und er ist mir wichtig.

_Ein Turm gegen zwei Springer. Du stehst besser. Aber zwei Springer sind wie zwei Hunde, die ein Schaf nicht aus den Augen lassen._

**Kim (Antwort):** Den ersten Zug machen\
(andere Antworten: „Gleich.“)

[Stellungsduell gegen Victor Hale – Ausgang: gewonnen]

→ Quest „Die Fernpartie“: Schritt 3 von 5 erledigt

#### 1053 · Ghost Town, Hauptstraße

`ghost-town-saloon.victor` · Quest „Die Fernpartie“, Schritt 4 von 5: Nach der Partie mit Victor reden.

_Victor sieht lange auf das Brett. Dann gibt er dir die Hand._

_Ambrose steht neben dem Tisch und sieht auf das ganze Brett. Er weint. Es läuft ihm über das Gesicht, und er lächelt dabei._

**Ambrose:** Hundertsechzig Jahre. Und sie ist schön.

**Ambrose:** Sie ist zu Ende. Jemand hat sie zu Ende gespielt.

**Ambrose:** Ein Kind, das zählt und hofft, und ein Hale.

**Ambrose:** Ich wollte eine Partie ohne Makel. Mein ganzes Leben, und danach noch einmal so lang.

**Ambrose:** Vierzig Züge von mir. Einer von ihm, den er einem Toten geschrieben hat. Und eure, mit allem, was ihr gewagt habt.

_Er wischt sich über die Augen._

**Ambrose:** Nicht makellos. Schön.

**Ambrose:** Gewonnen. Ich habe es nie gebraucht, und es freut mich trotzdem wie einen Jungen am Kai.

**Victor Hale:** Die beste Partie, die ich je gespielt habe. Ich hab eine Stunde lang an nichts gedacht. Nur daran.

_Er schreibt mit Junos Bleistift etwas unter die Seite. Du siehst nicht, was. Dann gibt er sie dir zurück._

**Victor Hale:** Für den Tag, an dem wieder jemand weiterspielt.

_In der Tür nimmt Mr. Pruitt den Hut ab._

→ Quest „Die Fernpartie“: Schritt 4 von 5 erledigt

#### 1054 · Ghost Town, Hauptstraße

`ghost-town-aussen.weg_pinewood` · Quest „Die Fernpartie“, Schritt 5 von 5: In der Nacht die Sterne über Ghost Town ansehen.

_Die Staubstraße führt zurück zum Canyon und weiter zum Camp._

### Zum Echo Canyon

#### 1055 · Staubstraße

`ghost-town-aussen.ankunft_zu_fuss` · Quest „Die Fernpartie“, Schritt 5 von 5

_Die Staubstraße endet an der Hauptstraße von Ghost Town._

### Ghost Town

#### 1056 · Ghost Town, Hauptstraße

`ghost-town-aussen.nacht` · Quest „Die Fernpartie“, Schritt 5 von 5

_Im Saloon kocht Mr. Pruitt Bohnen. Juno und Victor streiten, ob man eine ganze Partie ins Tagebuch kleben darf._

**Juno:** Glitzer ist für alles, was man nicht vergessen will. Das ist die Regel. Ich hab sie gemacht.

_Draußen liegt Mondlicht auf den Brettern. Die Stadt kommt dir nicht mehr leer vor. Sie kommt dir vor wie etwas, das fertig ist._

_Er wartet am Ende des Gehsteigs, wo die Bretter aufhören._

**Ambrose:** Setz dich.

_Du setzt dich auf die Kante. Der Staub ist noch warm vom Tag._

**Ambrose:** Ich muss dir etwas sagen. Ich glaube, du weißt es schon.

**Ambrose:** Im Wald habe ich dir erzählt, dass es still geworden ist. Seit heute Mittag ist es mehr als das.

**Ambrose:** Ich bin leichter. Das Brett hält mich nicht mehr so fest.

_Er betrachtet seine Hand. Sie ist durchsichtiger als sonst._

**Ambrose:** Ich könnte, glaube ich, ein paar Schritte weiter gehen, als das Brett liegt. Ich habe es nicht versucht.

**Kim (Antwort):** „Warum nicht?“

**Ambrose:** Weil ich nicht weiß, ob ich dann zurückkäme. Und es gibt noch etwas, das ich sehen will.

_Er setzt sich neben dich, die Füße im Staub. Das vierte Mal. Du hast mitgezählt._

**Ambrose:** Noch eine Partie. Deine. Gegen ihn. In der großen Halle, vor allen Leuten. Dann ist es gut.

**Kim (Antwort):** „Und dann gehst du.“

**Ambrose:** Ja.

**Kim (Antwort):** „Bleib.“\
(andere Antworten: „Ich weiß.“)

_Du sagst es wie jemand, der fünf ist. Er lacht nicht._

**Ambrose:** Ich könnte bleiben. In deinem Zimmer auf der Fensterbank, in einem Geigenkasten. Ich könnte deine Partien kommentieren, bis du mich nicht mehr hören willst.

**Ambrose:** Ein Geist, der bleibt, wird ein Möbelstück, Kim. Etwas, um das man herumgeht. Ich war lange genug ein Brett.

**Ambrose:** In Maple Falls sitzt eine alte Frau auf einer Veranda mit zwei Stühlen. Ich möchte nicht der sein, wegen dem du einen leeren Stuhl hinstellst.

**Kim (Antwort):** „Mrs. Calloway lernt jetzt Schach. Von Owen.“

_Juno hat geschrieben: Sie haben einen Tisch zwischen die Stühle gestellt._

**Ambrose:** Dann ist es noch besser, als ich dachte.

**Ambrose:** Ich bin froh, dass du es gesagt hast. Es hat mich in meinem ganzen Leben niemand gebeten zu bleiben.

**Ambrose:** Ich war sehr gut im Gehen. Es ist ein seltsames Geschenk, am Ende gefragt zu werden.

_Über euch fällt ein Stern, lang und hell, bis hinter den Friedhof._

**Ambrose:** Ich habe mir auch etwas gewünscht. Ich bin tot, mir kann nichts mehr misslingen.

**Ambrose:** Dass du im Finale einen Fehler machst. Einen kleinen, den du merkst. Und dass du danach den besten Zug deines Lebens spielst.

**Kim (Antwort):** „Das ist ein gemeiner Wunsch.“

**Ambrose:** Es ist der schönste, den ich habe.

→ Quest „Die Fernpartie“: Schritt 5 von 5 erledigt

→ Quest abgeschlossen: „Die Fernpartie“

#### 1057 · Ghost Town, Hauptstraße

`ghost-town-saloon.victor` · keine laufende Quest

**Victor Hale:** Mein Vater hat angerufen. Ich bin nicht rangegangen. Morgen vielleicht.

### Goldmine

#### 1058 · Stollen der Goldmine

`goldmine.logbuch` · keine laufende Quest

_Auf dem Tisch ist der Abdruck des Logbuchs im Staub._

#### 1059 · Stollen der Goldmine

`goldmine.goldader` · keine laufende Quest

_Die Goldader glänzt im Laternenlicht. Mehr gibt sie nicht her._

### Ghost Town

#### 1060 · Ghost Town, Hauptstraße

`ghost-town-aussen.nacht` · keine laufende Quest

_Über Ghost Town stehen mehr Sterne als Häuser._

#### 1061 · Ghost Town, Hauptstraße

`ghost-town-saloon.victor` · keine laufende Quest

**Victor Hale:** Wenn wir beide durchkommen, sehen wir uns im Finale. Ich freu mich drauf.

#### 1062 · Saloon

`ghost-town-saloon.brett` · keine laufende Quest

_Auf dem Brett steht noch die Schlussstellung der Fernpartie. Niemand räumt sie weg._

#### 1063 · Saloon

`ghost-town-saloon.fund_abzeichen` · keine laufende Quest

_Hinter dem Tresen liegt nur noch Staub. Das Abzeichen trägst du bei dir._

#### 1064 · Saloon

`ghost-town-aussen.pruitt` · keine laufende Quest

**Mr. Pruitt:** Ich bin die Einwohnerzahl.

#### 1065 · Ghost Town, Hauptstraße

`ghost-town-saloon.victor` · keine laufende Quest

**Victor Hale:** Ein Hale und ein Whitlock an einem Brett. Mein Großvater hätte das gern gesehen.

#### 1066 · Laden

`ghost-town-laden.treppe` · keine laufende Quest

_Oben ist das Zimmer leer. In der Ecke hängt der Fetzen Rosentapete. Du lässt ihn hängen._

#### 1067 · Saloon

`ghost-town-aussen.pruitt` · keine laufende Quest

**Mr. Pruitt:** Hufnagel. Der dreiundvierzigste diese Woche.

#### 1068 · Ghost Town, Hauptstraße

`ghost-town-aussen.weg_capital` · keine laufende Quest

_Ein Bus hält am Ortsrand: „Große Seen, Capital Arena“. Victor steigt mit dir ein._

### An den Großen Seen

#### 1069 · Seeufer

`weg-ghost-capital.tafel` · keine laufende Quest

→ Quest begonnen: „Die Tafel am Seeufer“

_Am Steg hängt eine Tafel mit drei Diagrammen: „Im Endspiel ist der König eine Figur. Bring ihn nach vorn!“_

**Kim (Antwort):** Die Aufgaben lösen\
(andere Antworten: Weitergehen)

[Aufgaben von Die Rätseltafel (wegGhostCapital.tafel) – Ausgang: bestanden]

→ Quest „Die Tafel am Seeufer“: Schritt 1 von 1 erledigt

→ Quest abgeschlossen: „Die Tafel am Seeufer“

#### 1070 · Seeufer

`weg-ghost-capital.tafel` · keine laufende Quest

_Auf der Tafel am Steg hat jemand mit Kreide einen Leuchtturm gemalt. Darunter: „Gelöst“._

#### 1071 · Seeufer

`weg-ghost-capital.ereignis_weltschachtag` · Quest „Weltschachtag am Leuchtturm“, Schritt 1 von 2: Das Simultan an der langen Tafel bestehen: fünf Bretter, fünf Bekannte, den Vorteil verwerten.

_Am Ufer steht eine Bühne mit zwei Fahnen, schwarz und weiß. Davor eine lange Tafel mit fünf Brettern, und an jedem sitzt jemand, den du kennst._

**Abe Lindgren:** Weltschachtag! Der 20. Juli, seit 1924. Heute spielt das ganze Ufer.

**Abe Lindgren:** Fünf Bretter, fünf Gegner, und du gehst von Brett zu Brett. Wie die großen Meister.

**Abe Lindgren:** An jedem Brett steht schon eine Stellung, in der du besser stehst. Jetzt musst du es nur noch nach Hause bringen.

**Kim (Antwort):** Das Simultan beginnen\
(andere Antworten: „Gleich. Erst ein Eis.“)

→ Quest begonnen: „Weltschachtag am Leuchtturm“

[Simultan (wegGhostCapital.simultan) – Ausgang: bestanden]

→ Quest „Weltschachtag am Leuchtturm“: Schritt 1 von 2 erledigt

#### 1072 · Seeufer

`weg-ghost-capital.ereignis_weltschachtag` · Quest „Weltschachtag am Leuchtturm“, Schritt 2 von 2: Bei Abes Partie gegen die Welt einen Zug vorschlagen.

_Fünf Bretter, fünf Hände über dem Tisch. Alle klatschen, auch die, die verloren haben._

**Abe Lindgren:** Und jetzt die Partie gegen die Welt. Ich spiele gegen alle hier, jeder stimmt über den nächsten Zug ab. Du darfst einmal vorschlagen.

**Kim (Antwort):** Den Springer ins Zentrum vorschlagen\
(andere Antworten: Die Rochade vorschlagen)

_Das Publikum hebt die Hände. Dein Zug gewinnt die Abstimmung. Abe kratzt sich am Kopf und lächelt._

**Abe Lindgren:** Gut gestimmt. Das geht ins Logbuch. Und ein Foto für dich, damit du den Tag nicht vergisst.

**Ambrose:** So viele Menschen an einem Brett. So war es früher in den Cafés.

→ Quest „Weltschachtag am Leuchtturm“: Schritt 2 von 2 erledigt

→ Quest abgeschlossen: „Weltschachtag am Leuchtturm“

#### 1073 · Seeufer

`weg-ghost-capital.faehrterminal` · keine laufende Quest

_Ein kleines Fährterminal mit einem Fahrplan unter Glas. Die Fähre fährt zweimal am Tag über den See, sonntags dreimal._

#### 1074 · Seeufer

`weg-ghost-capital.seite12` · keine laufende Quest

_Am Anleger klebt ein Blatt an einem Pfosten. Eine lose Seite voller Schachdiagramme._

#### 1075 · Seeufer

`weg-ghost-capital.wanderer` · Quest „Die verlorenen Seiten“, Schritt 1 von 2: Die Seiten des Wanderers auf den Wegen aufheben und ihm am Seeufer zurückgeben.

_Auf der Bank am Weg sitzt ein Mann mit gelbem Rucksack und zählt Papier. Dann sieht er, was du in der Hand hast._

**Wanderer:** Du hast meine Seiten! Warte, ich streiche sie glatt. Jede einzelne.

**Wanderer:** 12 von dreizehn. Der Rest liegt noch irgendwo zwischen hier und Maple Falls.

→ Quest „Die verlorenen Seiten“: Schritt 1 von 2 erledigt

#### 1076 · Leuchtturm

`weg-ghost-capital.fund_linse` · keine laufende Quest

_Im Wärterhaus liegt eine alte Linse aus dickem Glas, so groß wie ein Teller._

**Abe Lindgren:** Die hat hundert Schiffe heimgebracht. Nimm sie mit. Ich hab eine neue.

#### 1077 · Leuchtturm

`weg-ghost-capital.plakat_weltschachtag` · keine laufende Quest

_Am Fuß des Leuchtturms steht ein Aufsteller: „20. Juli. Weltschachtag am Leuchtturm. Alle Bretter willkommen.“_

#### 1078 · Leuchtturm

`weg-ghost-capital.abe` · keine laufende Quest

_Die Farben kommen zurück, als ihr den See erreicht._

_Der See ist so groß, dass man das andere Ufer nicht sieht. Vor dem Leuchtturm, weiß mit rotem Band, flickt ein Mann ein Netz._

**Abe Lindgren:** Abe Lindgren. Ich pass auf den Turm auf, und der Turm passt auf die Schiffe auf.

**Abe Lindgren:** König der Hügel. Kennst du das? Wer seinen König zuerst in die Mitte bringt, auf eines von den vier Feldern, hat gewonnen.

**Abe Lindgren:** Die Kapitäne haben das hier gespielt, wenn sie auf besseres Wetter gewartet haben. Der König muss in den Hafen.

**Kim (Antwort):** Eine Partie spielen

_Dein König läuft los, sobald er kann. Das hast du inzwischen gelernt._

**Ambrose:** Der König muss zum Leuchtturm. Wie wir alle.

_Es klingt nicht traurig. Du tust, als hättest du es nicht gehört._

#### 1079 · Leuchtturm

`weg-ghost-capital.odette` · keine laufende Quest

**Odette Finch:** 14 von fünfzehn hast du. Ich verrate dir eine: Sie steckt an einer Reuse am Steg im Bayou.

#### 1080 · Seeufer

`weg-ghost-capital.ereignis_weltschachtag` · keine laufende Quest

_Die Bühne wird abgebaut, die Bretter bleiben bis zum Abend._

#### 1081 · Seeufer

`weg-ghost-capital.faehrterminal` · keine laufende Quest

_Am Fahrplan hängt ein Zettel: „Sonderfahrt am 20. Juli, Weltschachtag.“_

#### 1082 · Seeufer

`weg-ghost-capital.seite12` · keine laufende Quest

_Am Anleger schaukelt nur noch das Wasser._

#### 1083 · Seeufer

`weg-ghost-capital.wanderer` · keine laufende Quest

**Wanderer:** Ich sammle Stellungen, die jemand irgendwo aufgezeichnet hat. Jede hat jemandem etwas bedeutet.

#### 1084 · Seeufer

`weg-ghost-capital.zurueck_ghost` · keine laufende Quest

_Der Weg führt zurück nach Süden, nach Ghost Town._

#### 1085 · Leuchtturm

`weg-ghost-capital.fund_linse` · keine laufende Quest

_Im Wärterhaus liegt nur noch ein altes Logbuch._

#### 1086 · Leuchtturm

`weg-ghost-capital.plakat_weltschachtag` · keine laufende Quest

_„20. Juli. Weltschachtag am Leuchtturm.“_

#### 1087 · Leuchtturm

`weg-ghost-capital.abe` · keine laufende Quest

**Abe Lindgren:** Der Turm ist hundert Jahre alt. Die Stufen auch. Ich zähle sie jeden Tag.

#### 1088 · Seeufer

`weg-ghost-capital.wanderer` · keine laufende Quest

**Wanderer:** Der Wind hier ist freundlicher. Er nimmt nur Hüte.

#### 1089 · Leuchtturm

`weg-ghost-capital.abe` · keine laufende Quest

**Abe Lindgren:** Bei Sturm suchen die Kapitäne das Licht. Bei dir ist es die Mitte.

#### 1090 · Seeufer

`weg-ghost-capital.ereignis_weltschachtag` · keine laufende Quest

_Abe funkt die Partie gegen die Welt noch über das ganze Land._

#### 1091 · Leuchtturm

`weg-ghost-capital.abe` · keine laufende Quest

**Abe Lindgren:** Viel Glück in der Arena. Bring den König in den Hafen.

#### 1092 · Seeufer

`weg-ghost-capital.ereignis_weltschachtag` · keine laufende Quest

_Am Eiswagen gibt es heute Sorte „Rochade“: Vanille mit Schokoladenkern._

#### 1093 · Seeufer

`weg-ghost-capital.wanderer` · keine laufende Quest

**Wanderer:** Jede Seite hat ihren eigenen Weg genommen. Ich hätte sie festbinden sollen.

#### 1094 · Leuchtturm

`capital-arena-aussen.ankunft_zu_fuss` · keine laufende Quest

_Am Abend fahrt ihr in die Hauptstadt und schlaft in einem Hotel, von dessen Fenster aus man die Arena sieht._

_Am Morgen steht ihr davor._

**Kim (Antwort):** Hinsehen

_Die Arena ist rund und weiß, mit einem Dach wie eine Muschel. Über dem Eingang hängt das Band mit acht Gesichtern._

_Deines hat noch immer Ketchup am Kinn._

_Auf dem Platz stehen Busse. Der graue mit den Rostflecken. Ein Kleinbus mit „RIVERTON“ aus Klebeband._

_Ein türkisfarbener Lastwagen, aus dem es dampft. Ein Pick-up mit einem Zahnstocher am Rückspiegel._

**Mama:** Sie sind alle gekommen.

**Kim (Antwort):** Zur Treppe sehen

_Coach Delgado zählt Köpfe. Mrs. Okafor sehr aufrecht neben Mr. Boateng mit seinem besten Hut. Slick auf dem Geländer, mit drei Kindern._

_Big Joe braucht allein zwei Stufen. Dr. Lin ohne Kittel. Miss Odile, Remy, Lou. Mira auf Tomás' Schultern. Dot mit Lockenwicklern._

_Ward steht ein wenig abseits und betrachtet alles, als wäre es eine Stellung._

_Acht Clubs. Acht Nadeln an deiner Jacke, und zu jeder gehört ein Gesicht._

**Juno:** Das kommt ins Tagebuch. Ich hab zwei dabei. Das kommt alles ins Tagebuch.

### Capital Arena

#### 1095 · Capital Arena, Vorplatz

`capital-arena-aussen.treppe` · Quest „Die Landesmeisterschaft“, Schritt 1 von 7: In die Halle der Capital Arena gehen.

→ Quest begonnen: „Die Landesmeisterschaft“

_Die breite Treppe vor der Arena. Am Abend wird hier gefeiert, sagt man._

#### 1096 · Capital Arena, Vorplatz

`capital-arena-aussen.fahnen` · Quest „Die Landesmeisterschaft“, Schritt 1 von 7

_Zwei Fahnen vor der Freitreppe, darauf ein König und die Jahreszahl der ersten Landesmeisterschaft. Der Mast ist frisch gestrichen._

#### 1097 · Capital Arena, Vorplatz

`capital-arena-aussen.wanderer` · Quest „Die Landesmeisterschaft“, Schritt 1 von 7

**Wanderer:** Der Buchbinder ist gleich um die Ecke. Aber ohne die fehlenden Blätter will ich da nicht hinein.

#### 1098 · Innenstadt

`capital-arena-innenstadt.kreide5` · Quest „Die Kreidespringer“, Schritt 1 von 2: Den Kreidespringern folgen: unter der Brücke, an der Raststätte, im Diner, bei den Holzfällern und in Capital.

_Neben dem Rollgitter hat jemand einen Springer auf das Pflaster gemalt, mit Kreide, ganz frisch. Darunter eine kleine Stellung._

**Ambrose:** Der Springer springt über die Mauer, nicht durch die Tür. Die Kreidespringer wohnen hier unten.

_Unter der Stellung steht: „Zwei Fliegen, eine Klappe. Der Zug ist das Wort.“_

**Kim (Antwort):** Die Stellung lösen\
(andere Antworten: Weitergehen)

→ Quest „Die Kreidespringer“: Schritt 1 von 2 erledigt

[Aufgaben von Mo (capitalArena.kreideraetsel) – Ausgang: bestanden]

#### 1099 · Innenstadt

`capital-arena-innenstadt.kreide5` · Quest „Die Landesmeisterschaft“, Schritt 1 von 7: In die Halle der Capital Arena gehen.

_Der Springer aus Kreide zeigt auf das Gitter. Das Losungswort kennst du jetzt._

#### 1100 · Innenstadt

`capital-arena-innenstadt.ubahn` · Quest „Die Landesmeisterschaft“, Schritt 1 von 7

_Du sagst den Zug durch das Gitter. Eine Hand zieht die Kette ab, und das Gitter rollt nach oben. „Willkommen bei den Kreidespringern.“_

#### 1101 · U-Bahnhof

`capital-arena-ubahnhof.ereignis_kreidenacht` · Quest „Die Nacht der Kreidespringer“, Schritt 1 von 4: Runde eins des Blitzturniers im alten U-Bahnhof gegen Dime spielen.

_Drei Klapptische, drei Bretter, drei Uhren. Um die Tische stehen Leute mit Kapuzen und Kreide an den Ärmeln._

_Eine Frau mit Kreide an den Fingern steht auf einer Bank und klatscht in die Hände._

**Mo:** Mo. Willkommen in der Nacht der Kreidespringer. Drei Runden Blitz, drei Minuten, zwei Sekunden Zuschlag. Gewinnen ist schön, mitspielen ist Pflicht.

**Mo:** Alle sind hier: die von der Brücke, von der Raststätte, aus dem Diner, aus den Wäldern.

**Mo:** Runde eins. Dime wartet schon, und Dime wartet nicht gern.

**Kim (Antwort):** Runde eins spielen\
(andere Antworten: „Gleich.“)

→ Quest begonnen: „Die Nacht der Kreidespringer“

[Partie gegen Dime – Ausgang: gewonnen]

→ Quest „Die Nacht der Kreidespringer“: Schritt 1 von 4 erledigt

#### 1102 · U-Bahnhof

`capital-arena-ubahnhof.ereignis_kreidenacht` · Quest „Die Landesmeisterschaft“, Schritt 1 von 7: In die Halle der Capital Arena gehen.

_Drei Klapptische, drei Bretter, drei Uhren. Um die Tische stehen Leute mit Kapuzen und Kreide an den Ärmeln._

**Mo:** Runde zwei. Mama Bear hat ihre eigene Uhr mitgebracht. Ich würde nicht fragen, warum.

**Kim (Antwort):** Runde zwei spielen\
(andere Antworten: „Gleich.“)

[Partie gegen Mama Bear – Ausgang: gewonnen]

→ Quest „Die Nacht der Kreidespringer“: Schritt 2 von 4 erledigt

#### 1103 · U-Bahnhof

`capital-arena-ubahnhof.mo` · Quest „Die Landesmeisterschaft“, Schritt 1 von 7

**Mo:** Runde drei. Da hinten sitzt einer mit Kapuze. Hat kein Wort gesagt, aber seine Uhr läuft schon.

**Kim (Antwort):** Runde drei spielen\
(andere Antworten: „Gleich.“)

[Partie gegen Junge mit Kapuze – Ausgang: gewonnen]

→ Quest „Die Nacht der Kreidespringer“: Schritt 3 von 4 erledigt

#### 1104 · U-Bahnhof

`capital-arena-ubahnhof.mo` · Quest „Die Kreidespringer“, Schritt 2 von 2: In der Nacht der Kreidespringer im alten U-Bahnhof mitspielen.

_Nach dem letzten Zug zieht dein Gegner die Kapuze vom Kopf. Es ist Victor._

**Victor Hale:** Sag es keinem. Hier unten weiß niemand, wer mein Vater ist. Hier spiele ich nur.

**Victor Hale:** Zum ersten Mal ohne Kamera. Es war das beste Blitz meines Lebens.

**Mo:** Hier, ein Stück Kreide. Für die nächste Wand. Und für die Uhr.

**Ambrose:** Niemand fragt hier nach einem Namen. Zwei Menschen und ein Brett. So war es im Kaffeehaus auch.

→ Quest „Die Kreidespringer“: Schritt 2 von 2 erledigt

→ Quest abgeschlossen: „Die Kreidespringer“

→ Quest „Die Nacht der Kreidespringer“: Schritt 4 von 4 erledigt

→ Quest abgeschlossen: „Die Nacht der Kreidespringer“

#### 1105 · U-Bahnhof

`capital-arena-ubahnhof.ausgang` · Quest „Die Landesmeisterschaft“, Schritt 1 von 7: In die Halle der Capital Arena gehen.

_Die Treppe führt hinauf zum Rollgitter und in die Innenstadt._

#### 1106 · Capital Arena, Vorplatz

`capital-arena-aussen.fahnen` · Quest „Die Landesmeisterschaft“, Schritt 1 von 7

_Die Fahnen knattern im Wind. Auf jeder ein König, schwarz auf weiß._

#### 1107 · Capital Arena, Vorplatz

`capital-arena-aussen.halle_betreten` · Quest „Die Landesmeisterschaft“, Schritt 1 von 7

_Drinnen ist es kühl und hallt. Tribünen im Kreis, Scheinwerfer, Tische in langen Reihen. An den Wänden laufen Partien, die niemand spielt._

**Juno:** Sechzehn Punkte für Silber, zweiundzwanzig für Gold. Du hast … 16.

**Juno:** Du spielst in der Silberliga. Und es ist mir vollkommen egal.

_Am Tisch der Turnierleitung stehen Dr. Lin mit einer Mappe und ein Mädchen in einem zu großen Pullover._

_Nova dreht sich um. Sie sieht dich über die ganze Halle hinweg und nickt. Einmal._

**Kim (Antwort):** Den Teilnehmerausweis anstecken

**Ambrose:** Heute ist Ruhe am Brett. Und heute spielt man ehrlich. Es ist lange her, dass ich das von einem Turnier sagen konnte.

**Kim (Antwort):** „Warst du je auf so einem?“

**Ambrose:** Dreihundert Leute in einem Saal in New York. Ich fand es gewaltig.

**Ambrose:** Das hier sind dreitausend. Und kein Einziger raucht.

→ Quest „Die Landesmeisterschaft“: Schritt 1 von 7 erledigt

#### 1108 · Turnierhalle

`capital-arena-halle.turniertafel` · Quest „Die Landesmeisterschaft“, Schritt 2 von 7: In der Vorrunde mindestens 2 von 4 Punkten holen.

_An der Turniertafel steht dein Stand: 0 von 4 Punkten. Weiter geht es ab 2._

#### 1109 · Turnierhalle

`capital-arena-halle.pressetisch` · Quest „Die Landesmeisterschaft“, Schritt 2 von 7

_Am Pressetisch sitzen Dr. Lin und Nova mit einer Mappe. Sie warten auf das Ende der Vorrunde._

#### 1110 · Turnierhalle

`capital-arena-halle.fanshop` · Quest „Die Landesmeisterschaft“, Schritt 2 von 7

_Am Fanshop gibt es Schals und Anstecker der Meisterschaft._

[Laden: Fanshop der Landesmeisterschaft]

#### 1111 · Turnierhalle

`capital-arena-halle.banner` · Quest „Die Landesmeisterschaft“, Schritt 2 von 7

_Über den Tribünen hängt ein langes Banner: „Landesmeisterschaft“. An einer Ecke hat sich die Naht gelöst und flattert._

#### 1112 · Turnierhalle

`capital-arena-halle.victor` · Quest „Die Landesmeisterschaft“, Schritt 2 von 7

**Victor Hale:** Ich hab mein Gerät zu Hause gelassen. Für immer.

#### 1113 · Turnierhalle

`capital-arena-halle.turnierleiterin` · Quest „Die Landesmeisterschaft“, Schritt 2 von 7

**Turnierleiterin:** Runde 1 gegen Bea Lindqvist.

_Bea ist Maes große Schwester. Sie hat bei Mrs. Okafor gelernt. Sie wartet und will ein Remis von jedem, der ungeduldig wird._

**Kim (Antwort):** „Ich bin bereit.“\
(andere Antworten: „Noch einen Moment.“)

[Partie gegen Bea Lindqvist – Ausgang: gewonnen]

#### 1114 · Turnierhalle

`capital-arena-halle.turnierleiterin` · Quest „Die Landesmeisterschaft“, Schritt 2 von 7

**Turnierleiterin:** Runde 2 gegen Marcus Oyelaran.

_Er sieht jede Gabel, bevor sie da ist. Er ist schnell und laut in seinen Zügen._

**Kim (Antwort):** „Ich bin bereit.“\
(andere Antworten: „Noch einen Moment.“)

[Partie gegen Marcus Oyelaran – Ausgang: gewonnen]

#### 1115 · Turnierhalle

`capital-arena-halle.nova` · Quest „Die Landesmeisterschaft“, Schritt 2 von 7

**Nova:** Meine Hände zittern. Ohne Gerät ist alles so … laut.

**Nova:** Spielst du trotzdem gegen mich?

#### 1116 · Turnierhalle

`capital-arena-halle.bea` · Quest „Die Landesmeisterschaft“, Schritt 2 von 7

**Bea Lindqvist:** Gut gespielt. Meine kleine Schwester Mae hat gesagt, du gibst nie auf. Stimmt.

#### 1117 · Turnierhalle

`capital-arena-halle.marcus` · Quest „Die Landesmeisterschaft“, Schritt 2 von 7

**Marcus Oyelaran:** Dieser stille Zug. Den hab ich nicht kommen sehen. Den sieht keiner kommen.

#### 1118 · Turnierhalle

`capital-arena-halle.tobias` · Quest „Die Landesmeisterschaft“, Schritt 2 von 7

**Tobias Wren:** Tobias. Fünf Minuten sind eine Ewigkeit.

**Tobias Wren:** Für mich. Für dich gleich nicht mehr.

#### 1119 · Turnierhalle

`capital-arena-halle.kade` · Quest „Die Landesmeisterschaft“, Schritt 2 von 7

_Ein Junge in Weiß sitzt am Rand, beide Hände auf dem Tisch. Er hält den Kopf ganz gerade._

#### 1120 · Turnierhalle

`capital-arena-halle.lin` · Quest „Die Landesmeisterschaft“, Schritt 2 von 7

**Dr. Lin:** Wir haben eine Mappe dabei. Nach der Vorrunde. Dann reden wir.

#### 1121 · Turnierhalle

`capital-arena-halle.graham_hale` · Quest „Die Landesmeisterschaft“, Schritt 2 von 7

**Graham Hale:** Graham Hale. Wir haben uns in Maple Falls gesehen, im Clubraum. Ich sponsere dieses Turnier.

**Graham Hale:** Viel Glück. Nein, ehrlich: viel Glück.

#### 1122 · Turnierhalle

`capital-arena-aussen.mama` · Quest „Die Landesmeisterschaft“, Schritt 2 von 7

**Mama:** Ich hab Kaffee für alle. Und Brötchen. Und ein Pflaster, falls du dich am Brett stößt.

#### 1123 · Turnierhalle

`capital-arena-aussen.juno` · Quest „Die Landesmeisterschaft“, Schritt 2 von 7

**Juno:** Ich zähle deine Punkte. Laut. Damit es alle hören.

#### 1124 · Capital Arena, Vorplatz

`capital-arena-aussen.weg_ghost` · Quest „Die Landesmeisterschaft“, Schritt 2 von 7

_Der Weg führt zurück zum Leuchtturm und weiter nach Ghost Town._

### An den Großen Seen

#### 1125 · Leuchtturm

`capital-arena-aussen.ankunft_zu_fuss` · Quest „Die Landesmeisterschaft“, Schritt 2 von 7

_Der Weg vom See endet am Vorplatz der Capital Arena._

### Capital Arena

#### 1126 · U-Bahnhof

`capital-arena-ubahnhof.ereignis_kreidenacht` · Quest „Die Landesmeisterschaft“, Schritt 2 von 7

_Drei Klapptische, drei Bretter, drei Uhren. Um die Tische stehen Leute mit Kapuzen und Kreide an den Ärmeln._

**Mo:** Victor kommt jetzt jeden Donnerstag. Er sagt, wegen der Limonade.

#### 1127 · U-Bahnhof

`capital-arena-ubahnhof.mo` · Quest „Die Landesmeisterschaft“, Schritt 2 von 7

**Mo:** Wer eine Mauer findet, malt einen Springer. So finden wir uns.

#### 1128 · Capital Arena, Vorplatz

`capital-arena-aussen.halle_betreten` · Quest „Die Landesmeisterschaft“, Schritt 2 von 7

_Du gehst durch die Glastür in die Halle._

#### 1129 · Turnierhalle

`capital-arena-halle.turniertafel` · Quest „Die Landesmeisterschaft“, Schritt 2 von 7

_An der Turniertafel steht dein Stand: 2 von 4 Punkten. Weiter geht es ab 2._

#### 1130 · Turnierhalle

`capital-arena-halle.banner` · Quest „Die Landesmeisterschaft“, Schritt 2 von 7

_„Landesmeisterschaft“. Darunter hat jemand mit Bleistift einen kleinen Springer gemalt._

#### 1131 · Turnierhalle

`capital-arena-halle.victor` · Quest „Die Landesmeisterschaft“, Schritt 2 von 7

**Victor Hale:** Wir sehen uns im Finale. Hoffentlich.

#### 1132 · Turnierhalle

`capital-arena-halle.turnierleiterin` · Quest „Die Landesmeisterschaft“, Schritt 2 von 7

_Die Turnierleiterin ruft eine Pause aus. Sofort wird die Halle laut, wie eine Klasse, wenn die Lehrerin hinausgeht._

_Juno sitzt auf der untersten Stufe der Tribüne, auf jedem Knie ein Tagebuch._

**Juno:** Zwei aus zwei. Ich schreib es in beide. Falls eins verloren geht.

_Über ihr winkt Slick mit beiden Armen. Tamsin hält ihm von hinten den Mund zu._

_Victor kommt von den Tischen am anderen Ende. Seine Runde ist längst vorbei. Er hält dir eine Wasserflasche hin._

**Victor Hale:** Trink. Mein Vater sagt, Wasser zwischen zwei Runden bringt zwölf Elo.

**Victor Hale:** Er hat es nachgemessen. Leider stimmt es.

**Kim (Antwort):** Trinken

_Victor sieht zu Tisch eins. Dort steht schon ein Schild: Sinclair._

**Victor Hale:** Spiel gut gegen sie. Richtig gut. Sie hat es verdient, dass heute jemand gut gegen sie spielt.

_Er geht, bevor du fragen kannst, was er meint._

_Ambrose steht an der Bande und sieht zu, wie die Schiedsrichter die Uhren stellen._

**Ambrose:** Geduld gegen Bea, ein stiller Zug gegen Marcus. Du hast nichts Neues gespielt, Kim. Du hast dich erinnert.

**Ambrose:** Das ist im Turnier am schwersten. Sich erinnern, wenn alle laut sind.

**Turnierleiterin:** Tisch eins. Sinclair gegen …

_Sie sitzt schon da, im zu großen Pullover, die Haare zurückgebunden, sodass man beide Ohren sieht. Das soll man bemerken._

_Neben der Uhr liegt etwas Kleines, Hautfarbenes, offen, wo jeder es sehen kann. Am Rand steht ein Mann mit einem Prüfgerät._

_Nova gibt dir die Hand. Ihre zittert so, dass du es bis in den Ellbogen spürst._

**Nova:** Ich hab seit zwei Jahren keine Turnierpartie allein gespielt. Ich weiß nicht, wie ich anfange.

**Kim (Antwort):** „Mit einem Bauern in der Mitte. Das machen alle.“

_Sie lacht, kurz, erschrocken._

**Kim (Antwort):** „Ich bin bereit.“\
(andere Antworten: „Noch einen Moment.“)

[Partie gegen Nova – Ausgang: gewonnen]

#### 1133 · Turnierhalle

`capital-arena-halle.turnierleiterin` · Quest „Die Landesmeisterschaft“, Schritt 2 von 7

_Nova sieht auf die Stellung, dann auf die Uhr, dann auf den kleinen Gegenstand, der in zwei Stunden kein einziges Mal gesummt hat._

**Nova:** Ich hab verloren. Und ich weiß genau, wo.

**Nova:** Zum ersten Mal wusste ich nicht, ob ich gewinne. Ich hab es keine Sekunde gewusst.

_Sie strahlt, mit dem ganzen Gesicht._

**Nova:** Das fühlt sich gut an. Das fühlt sich so gut an.

**Kim (Antwort):** „Dein Springer. Der war deiner.“

**Nova:** Ja. Der war meiner.

_Auf der Tribüne sind ein Mann und eine Frau aufgestanden. Die Frau hat die Hand vor dem Mund._

#### 1134 · Turnierhalle

`capital-arena-halle.nova` · Quest „Die Landesmeisterschaft“, Schritt 2 von 7

**Nova:** Ich hab es keine Sekunde gewusst. Die ganze Partie nicht.

#### 1135 · U-Bahnhof

`capital-arena-ubahnhof.mo` · Quest „Die Landesmeisterschaft“, Schritt 2 von 7

**Mo:** Nächstes Jahr wieder. Andere Station, gleiche Kreide.

#### 1136 · Turnierhalle

`capital-arena-halle.turniertafel` · Quest „Die Landesmeisterschaft“, Schritt 2 von 7

_An der Turniertafel steht dein Stand: 3 von 4 Punkten. Weiter geht es ab 2._

#### 1137 · Turnierhalle

`capital-arena-halle.turnierleiterin` · Quest „Die Landesmeisterschaft“, Schritt 2 von 7

**Turnierleiterin:** Runde 4 gegen Tobias Wren, mit fester Uhr: fünf Minuten und drei Sekunden je Zug.

_Er spielt, als würde das Haus brennen. Du lässt die Uhr eine Figur sein. Sie ist nicht der König._

**Kim (Antwort):** „Ich bin bereit.“\
(andere Antworten: „Noch einen Moment.“)

[Partie gegen Tobias Wren – Ausgang: gewonnen]

#### 1138 · Turnierhalle

`capital-arena-halle.turnierleiterin` · Quest „Die Landesmeisterschaft“, Schritt 2 von 7

_Die Turnierleiterin schreibt deinen Namen an die Tafel, ganz oben._

**Turnierleiterin:** 4 von 4 Punkten. Du stehst im Halbfinale. Gratuliere.

_Du stehst auf. Deine Beine sind aus Watte._

**Juno:** Halbfinale. Gegen einen, der Kade Sterling heißt. Der ist von denen. Er hat alle vier gewonnen, keine länger als eine Stunde.

_An Tisch zwei räumt ein Junge in Weiß seine Figuren ein. Er hält den Kopf ganz gerade. Seine Haare fallen ihm über die Ohren._

→ Quest „Die Landesmeisterschaft“: Schritt 2 von 7 erledigt

#### 1139 · Turnierhalle

`capital-arena-halle.tobias` · Quest „Die Landesmeisterschaft“, Schritt 3 von 7: Am Pressetisch zuhören, was Dr. Lin und Nova sagen.

**Tobias Wren:** Du hast mich auf meiner eigenen Uhr erwischt. Respekt.

#### 1140 · Turnierhalle

`capital-arena-halle.kade` · Quest „Die Landesmeisterschaft“, Schritt 3 von 7

_Kade Sterling sieht auf einen Punkt über deiner Schulter. Er ist nicht unfreundlich. Er ist nicht da._

#### 1141 · Turnierhalle

`capital-arena-halle.turniertafel` · Quest „Die Landesmeisterschaft“, Schritt 3 von 7

_An der Tafel steht dein Name im Halbfinale. Darunter, mit Kreide: „Ehrlich gespielt.“_

#### 1142 · Turnierhalle

`capital-arena-halle.pressetisch` · Quest „Die Landesmeisterschaft“, Schritt 3 von 7

_Die Scheinwerfer gehen an. Die Turnierleiterin klopft an das Mikrofon. Es wird nicht sofort still. Dann wird es still._

**Turnierleiterin:** Die Turnierleitung hat eine Erklärung entgegengenommen. Die Betroffene möchte selbst sprechen.

_Nova geht nach vorn. Allein. Dr. Lin bleibt zwei Schritte hinter ihr. Novas Knie zittern, und sie drückt sie durch._

_Du stehst in der ersten Reihe, wie versprochen. Sie sucht dich und findet dich._

**Nova:** Ich bin sechzehn. Seit zwei Jahren habe ich in jedem Turnier ein Gerät im Ohr getragen, das mir Züge angesagt hat.

**Kim (Antwort):** Zuhören

_In der Halle hält jemand die Luft an. Dann viele._

**Nova:** Es stand in meinem Vertrag. Nicht so. Aber es stand drin. Ich hätte Nein sagen können.

**Nova:** Ich war vierzehn. Ich wollte gewinnen, dann wollte ich nicht mehr, und dann habe ich mich nicht mehr getraut.

**Nova:** Ich gebe die Titel zurück. Heute habe ich eine Partie ohne gespielt.

**Nova:** Es ist das einzige Ergebnis der letzten zwei Jahre, das mir gehört.

**Kim (Antwort):** Zusehen

_Sie tritt zurück._

_Dr. Lin legt die Mappe auf den Tisch und eine Schachtel aus weißem Karton daneben, mit Mulden aus Schaumstoff._

**Dr. Lin:** Vierundsiebzig Prozent im Training. Achtundneunzig im Turnier. Bei vier Spielern, über zwei Jahre.

**Dr. Lin:** Ich habe ihre Spielberichte unterschrieben. Ich habe sie nie so genau angesehen, wie ich es von jedem Schüler verlangt hätte.

**Dr. Lin:** Das ist mein Fehler, und er ist nicht klein. Die Kinder haben getan, was Erwachsene von ihnen verlangt haben.

**Kim (Antwort):** Dr. Lin ansehen

**Turnierleiterin:** Das Halbfinale wird unter Funkaufsicht gespielt. Perfect Move ist von der weiteren Leitung entbunden.

**Turnierleiterin:** Ich nenne einen Namen, weil er auf den Verträgen steht: Mr. Dorrance, Vertrieb. Er ist nicht mehr im Haus.

**Kim (Antwort):** Zu den Wänden sehen

_An den Wänden gehen die Bildschirme aus. Einer nach dem anderen, im Kreis._

_Graham Hale steht bei den Sponsoren, ein Telefon in der Hand und eines am Ohr, und hat beide vergessen. Sein Gesicht ist grau._

**Graham Hale:** Das wusste ich nicht. Ich habe die Engine gebaut. Für das Training. Ich habe nie …

_Neben ihm steht Victor, im zu großen Pullover. Er geht los, quer durch die Halle, und stellt sich neben Nova. Nicht vor sie. Neben sie._

**Victor Hale:** Ich hab es gesehen. In Silicon Bay, im Januar. Und ich hab es keinem gesagt, der etwas hätte tun können.

**Victor Hale:** In Summit City hatte ich selbst eines in der Tasche. Ich hab es getragen.

**Kim (Antwort):** Victor ansehen

**Victor Hale:** Jemand hat mich gefragt, ob mir das Spaß macht. Vor einem Jahr, an einer Bushaltestelle. Ich hab ein Jahr für die Antwort gebraucht.

_Niemand klatscht. Aber auf der Tribüne steht eine kleine, aufrechte Frau im dunkelblauen Kleid auf. Dann ein Mann mit Händen wie Schaufeln._

_Acht Clubs stehen. Nova sucht, und sie findet ihre Eltern. Sie stehen auch._

→ Quest „Die Landesmeisterschaft“: Schritt 3 von 7 erledigt

#### 1143 · Turnierhalle

`capital-arena-halle.turnierleiterin` · Quest „Die Landesmeisterschaft“, Schritt 4 von 7: Das Halbfinale gegen Kade Sterling gewinnen.

_Kade Sterling gibt dir die Hand, ohne dich anzusehen. Er ist nicht unfreundlich. Er ist nicht da._

_Am Rand schwenkt der Funkprüfer sein Gerät, sieht auf die Anzeige und schüttelt den Kopf._

**Ambrose:** Er sucht an den Ohren. Seit das Mädchen ausgesagt hat, wissen die anderen, dass dort gesucht wird.

_Neben deinen Karten liegt eine vierte, die du nicht hingelegt hast. „Mentor-Zug“, mit einem goldenen Rand._

**Ambrose:** Ein einziges Mal. Heute. Wenn du mich rufst, komme ich. Wenn nicht, schaue ich zu. Beides ist mir recht.

**Kim (Antwort):** „Was passiert, wenn ich sie spiele?“

**Ambrose:** Dann spielen wir einen Zug zusammen. Nicht ich für dich. Wir.

**Kim (Antwort):** „Und wenn nicht?“

_Er lächelt._

**Ambrose:** Dann erfahre ich, dass du mich nicht gebraucht hast. Das wäre auch ein schöner Tag.

**Kim (Antwort):** „Ich bin bereit.“\
(andere Antworten: „Noch einen Moment.“)

[Partie gegen Kade Sterling – Ausgang: gewonnen]

→ Quest „Die Landesmeisterschaft“: Schritt 4 von 7 erledigt

#### 1144 · Turnierhalle

`capital-arena-halle.turnierleiterin` · Quest „Die Landesmeisterschaft“, Schritt 5 von 7: Vor dem Finale mit Victor reden.

**Turnierleiterin:** Das Finale spielst du auf der Bühne. Victor wartet im Gang.

#### 1145 · Turnierhalle

`capital-arena-halle.nova` · Quest „Die Landesmeisterschaft“, Schritt 5 von 7

**Nova:** Du hast in der ersten Reihe gestanden. Das vergesse ich nicht. Jetzt bin ich frei.

#### 1146 · Turnierhalle

`capital-arena-halle.kade` · Quest „Die Landesmeisterschaft“, Schritt 5 von 7

_Kade sitzt da, einen Schuh ausgezogen, und sieht auf seinen König. Er hat es zwei Jahre bei sich getragen, erst in der Tasche, zuletzt im Schuh._

_Du gehst um den Tisch und hältst ihm die Hand hin. Er nimmt sie._

**Kade Sterling:** Ich hab ihn nicht gesehen. Ich hab seit dem Frühjahr kein Brett mehr angeguckt. Ich war mal richtig gut. In der achten Klasse.

**Kim (Antwort):** „Dann bist du es noch. Frag Nova.“

_Ambrose steht neben dem Brett._

**Ambrose:** Du hast mich nicht gerufen.

**Ambrose:** Dann weiß ich jetzt, dass du mich nicht gebraucht hast. Das ist auch ein schöner Tag.

#### 1147 · Turnierhalle

`capital-arena-halle.lin` · Quest „Die Spuren von Perfect Move“, Schritt 1 von 1: Sechs Spuren von Perfect Move an den Wegen sammeln und Dr. Lin in Capital zeigen.

_Du legst Dr. Lin deine eigene Mappe hin: die Drohne, der Funkmast, der Messwagen, die Server, der Geysirantrag, der Greifarm._

**Dr. Lin:** Das hier kenne ich. Woher hast du das?

_Sie blättert lange._

**Dr. Lin:** Damit wiegt unsere Aussage doppelt so schwer. Ich reiche das heute noch nach. Danke.

**Ambrose:** Sechs Spuren. Du hast hingesehen, wo andere vorbeigegangen sind.

→ Quest „Die Spuren von Perfect Move“: Schritt 1 von 1 erledigt

→ Quest abgeschlossen: „Die Spuren von Perfect Move“

#### 1148 · Turnierhalle

`capital-arena-halle.graham_hale` · Quest „Die Landesmeisterschaft“, Schritt 5 von 7: Vor dem Finale mit Victor reden.

**Graham Hale:** Ich habe nichts gewusst. Das ist keine Ausrede. Es ist schlimmer.

#### 1149 · Turnierhalle

`capital-arena-aussen.juno` · Quest „Die Landesmeisterschaft“, Schritt 5 von 7

**Juno:** Wenn du gewinnst, hüpfe ich. Wenn nicht, hüpfe ich auch.

#### 1150 · Turnierhalle

`capital-arena-halle.pressetisch` · Quest „Die Landesmeisterschaft“, Schritt 5 von 7

_Am Pressetisch schreiben Reporter. Einer fotografiert die Turniertafel._

#### 1151 · Turnierhalle

`capital-arena-halle.victor` · Quest „Die Landesmeisterschaft“, Schritt 5 von 7

_Hinter der Halle ist ein langer, kahler Gang mit Neonlicht und einem Getränkeautomaten._

_Du sitzt auf dem Boden und wartest, dass deine Hände aufhören zu zittern._

_Am anderen Ende stehen Graham Hale und Victor. Der Gang trägt jedes Wort. Graham hält kein Telefon in der Hand._

**Graham Hale:** Acht Jahre habe ich jede Partie nachgerechnet. Ich bin kein Spieler. Ich bin Ingenieur. Ich kann messen.

**Kim (Antwort):** Weghören wollen

**Graham Hale:** Du hast mit sieben gegen mich gewonnen. Am nächsten Morgen habe ich gedacht, ich halte dich auf.

**Victor Hale:** Ich wollte nur noch eine. Mit dir. Ich hab acht Jahre lang jeden Abend gedacht, heute fragt er.

**Kim (Antwort):** Nicht hinsehen

_Es ist lange still._

**Graham Hale:** Ich habe gerechnet und vergessen, wofür. Entschuldige, Victor.

_Du hörst, wie zwei Menschen einander festhalten, ungeschickt, wie Leute, die es lange nicht getan haben._

**Victor Hale:** Ich spiel heute für mich. Und gegen meinen besten Gegner. Du darfst zugucken. Aber du darfst nichts aufschreiben.

**Graham Hale:** Ich weiß nicht, ob ich das kann.

**Victor Hale:** Probier's. Es ist luftig.

_Mama kommt den Gang herunter und setzt sich neben dich auf den Boden._

**Mama:** Ich hatte auch mal so ein Finale. Ich hab fünfundzwanzig Jahre gedacht, das Verlieren sei das Wichtigste daran.

**Mama:** Ich hab das Formular wieder angeguckt. Nicht Zug dreiunddreißig. Die anderen zweiunddreißig. Die waren richtig gut.

**Kim (Antwort):** Mama ansehen

**Mama:** Spiel deine Partie. Ich hab meine verloren, und es war trotzdem schön, dass ich sie gespielt hab.

**Mama:** Und guck auf die Grundreihe.

_Ambrose steht am Getränkeautomaten, als versuche er ein letztes Mal, etwas zu verstehen._

**Kim (Antwort):** „Man wirft Geld hinein, und es fällt etwas heraus.“

**Ambrose:** Das habe ich begriffen. Ich frage mich nur, wer darin sitzt.

**Ambrose:** Ich sage heute nichts. Kein Wort, nicht vorher, nicht währenddessen. Keine Karten. Das Brett gehört euch.

**Ambrose:** Ich stehe hinten, bei der Großmeisterin. Sie dreht jedes Mal den Kopf, wenn ich neben ihr stehe.

**Ambrose:** Ich will sehen, was du tust, wenn niemand neben dir steht. Nicht zu wissen, was du ziehst. Das Beste seit hundertsechzig Jahren.

_Aus der Halle kommt ein Gong. Deine Hände zittern nicht mehr._

**Kim (Antwort):** Aufstehen

_Auf der Bühne steht ein einziger Tisch mit einem Brett aus Holz, unter einem Scheinwerfer. Du siehst nur den Lichtkreis._

_Victor kommt im zu großen Pullover. Er dreht vor der Schiedsrichterin die Taschen nach außen, obwohl niemand es verlangt._

**Turnierleiterin:** Keine Karten. Keine Hilfen.

**Kim (Antwort):** „Ich bin bereit.“\
(andere Antworten: „Gleich.“)

_Seine Hand ist trocken und warm._

→ Quest „Die Landesmeisterschaft“: Schritt 5 von 7 erledigt

[Partie gegen Victor Hale – Ausgang: gewonnen]

→ Quest „Die Landesmeisterschaft“: Schritt 6 von 7 erledigt

#### 1152 · Turnierhalle

`capital-arena-halle.victor` · Quest „Die Landesmeisterschaft“, Schritt 7 von 7: Nach der Siegerehrung auf die Treppe vor der Arena setzen.

_Victor legt seinen König mit einem Finger um. Die Halle ist still. Sie weiß noch nicht, was sie gesehen hat._

_Dann fängt er an zu lachen, das helle Lachen von der Bergstation. Er nimmt deine Hand mit beiden Händen._

**Victor Hale:** Hast du es gesehen? Bis zum Ende?

**Kim (Antwort):** „Nein. Nur bis zum sechsten Zug. Ich hab gehofft.“

_Er reißt das Formular vom Tisch und rennt. Von der Bühne, durch den Mittelgang, das Blatt hoch über dem Kopf wie eine Fahne._

**Victor Hale:** Vater! Guck dir an, wie wir gespielt haben! Das ist die schönste Partie, die ich je …

_Der Rest geht unter. Ein Pfiff auf zwei Fingern, eine Trompete, Big Joe brüllt etwas mit „Kumpel“, Mira schreit: „Noch mal! Jetzt!“_

_Juno rennt in dich hinein. Sie hat beide Tagebücher verloren und merkt es nicht._

**Juno:** Wie soll ich das denn aufschreiben?

**Kim (Antwort):** Über ihre Schulter sehen

_Ganz hinten an der Wand steht Ward und hat den Kopf zur Seite gedreht, als stünde jemand neben ihr._

_Neben ihr ist ein hellerer Fleck vor der Wand, schmal, hochgeschlossen. Er sieht Victor nach._

_Du kannst ihn nicht hören. Aber du siehst seine Lippen: Er läuft zum Telegrafenamt._

_Die Siegerehrung vergisst du. Es gibt einen Pokal, der zu groß ist, und Hände, viele._

#### 1153 · Turnierhalle

`capital-arena-halle.kade` · Quest „Die Landesmeisterschaft“, Schritt 7 von 7

_Kade sitzt bei Nova. Sie stellt ihm eine Stellung auf. Er sieht hin._

#### 1154 · Turnierhalle

`capital-arena-halle.lin` · Quest „Die Landesmeisterschaft“, Schritt 7 von 7

**Dr. Lin:** Ich habe gekündigt, bevor wir hergefahren sind. Der Club ist in einem Keller. Ein Heizlüfter, kein einziger Bildschirm.

#### 1155 · Turnierhalle

`capital-arena-halle.graham_hale` · Quest „Die Landesmeisterschaft“, Schritt 7 von 7

**Graham Hale:** Mein Sohn hat für sich gespielt. Und ich habe zum ersten Mal einfach nur zugesehen.

#### 1156 · Turnierhalle

`capital-arena-aussen.mama` · Quest „Die Landesmeisterschaft“, Schritt 7 von 7

**Mama:** Ich bin so stolz auf dich. Nicht wegen des Titels. Wegen allem.

#### 1157 · Turnierhalle

`capital-arena-aussen.juno` · Quest „Die Landesmeisterschaft“, Schritt 7 von 7

**Juno:** Ich hab alles ins Tagebuch geschrieben. Mit Glitzer. Diesmal ganz viel.

#### 1158 · Capital Arena, Vorplatz

`capital-arena-aussen.treppe` · Quest „Die Landesmeisterschaft“, Schritt 7 von 7

_Der Abend ist lang und golden. Kinder aus acht Städten rennen zwischen den Fahnenmasten herum. Du setzt dich auf die Treppe, ganz oben._

_Du legst das alte Brett auf die Stufe und stellst die Figuren von Junos Reisebrett darauf. Die Schlussstellung der Fernpartie, so wie sie im Saloon stand._

_Er sitzt neben dir, die Hände auf den Knien. Durch ihn hindurch siehst du die Fahnen._

**Kim (Antwort):** „Hast du es gesehen?“

**Ambrose:** Jeden Zug. Ich habe an der Wand gestanden und mir auf die Zunge gebissen. Die Großmeisterin hat mich angesehen, als wüsste sie es.

**Ambrose:** Ich habe mir gewünscht, dass du ihn merkst. Dass du danach so spielst, habe ich nicht zu wünschen gewagt.

**Kim (Antwort):** „War es richtig?“

**Ambrose:** Ich weiß es nicht. Ich habe es nicht nachgerechnet. Ich wollte nicht.

_Unten gehen Victor und sein Vater, das Formular zwischen sich, jeder hält eine Ecke. Graham Hale hat keinen Stift in der Hand._

**Ambrose:** Ich muss dir etwas sagen. Hör zu, ich sage es nur einmal.

**Ambrose:** Ich wollte eine Partie ohne Makel. Ich habe sie nicht bekommen.

**Ambrose:** Die Fernpartie hast du für uns gewonnen, mit einem Fehler darin. Ich habe gejubelt, ganz ohne Haltung.

**Ambrose:** Das Halbfinale war bis zum zwanzigsten Zug ein Untergang.

**Kim (Antwort):** „Tut mir leid.“

**Ambrose:** Sei still. Ich bin noch nicht fertig. Ich habe etwas Besseres bekommen.

**Kim (Antwort):** Zuhören

**Ambrose:** Eine Lehrerin, die gekündigt hat. Ein Mädchen, das zwei Titel zurückgibt. Einen Jungen, der vor Freude rennt, weil er verloren hat.

**Ambrose:** Menschen, die kämpfen. Die Fehler machen. Und wachsen.

**Ambrose:** Das ist es, was schön ist an diesem Spiel. Nicht die Züge. Die waren nie das Schöne.

**Ambrose:** Du hast mir das gezeigt. Ein Kind, das einen König hält wie einen Suppenlöffel.

**Kim (Antwort):** „Danke.“

**Ambrose:** Wofür?

**Kim (Antwort):** „Für Was hängt? Für heute.“

**Ambrose:** Das war das Geringste. Das weiß jeder.

_Die Sonne steht tief. Er ist jetzt so durchsichtig, dass du nicht mehr sicher bist, ob du ihn siehst._

**Kim (Antwort):** „Ich werde dich vermissen.“

**Ambrose:** Das hoffe ich doch. Ich war hundertsechzig Jahre lang eine Fußnote. Ich möchte wenigstens einem Menschen fehlen.

**Ambrose:** Und ich dich. Wo immer man das tut, wohin ich gehe.

_Er steht auf und macht eine kleine, steife Verbeugung. Wie am ersten Tag._

**Ambrose:** Ambrose Whitlock, zu Diensten. Es war mir eine Ehre, Kim.

**Kim (Antwort):** „Später?“

_Er sieht dich an._

_Dann lacht er, laut, von ganz unten. Das Lachen vom Steg und aus der Garage._

**Ambrose:** Nein. Dieses eine Mal nicht später.

_Das Licht verändert sich, wie wenn eine Wolke weiterzieht. Du stehst allein auf der Treppe._

_Auf der Stufe liegt ein Brett aus altem Holz, darauf die Schlussstellung. Am Rand eingebrannte Buchstaben. Das Holz ist warm von der Sonne._

_Jemand setzt sich neben dich. Juno, mit zwei Tagebüchern auf dem Schoß. Das obere ist aufgeschlagen, bei der Seite mit dem Glitzerrahmen._

_Sie hält dir den Stift hin. Du überlegst lange. Dann schreibst du, in deiner eigenen Schrift: Er ist angekommen._

→ Quest „Die Landesmeisterschaft“: Schritt 7 von 7 erledigt

→ Quest abgeschlossen: „Die Landesmeisterschaft“

[Abspann]

## Nach dem Abspann: Epilog und nachgeholte Nebenquests

### Capital Arena

#### 1159 · Capital Arena, Vorplatz

`capital-arena-aussen.treppe` · keine laufende Quest

_Auf der Treppe vor der Arena ist es still geworden. Die Fahnen werfen lange Schatten._

#### 1160 · Turnierhalle

`capital-arena-halle.victor` · keine laufende Quest

**Victor Hale:** Revanche? Jederzeit. Aber nicht heute. Heute feiern wir.

### Port Delacroix

#### 1161 · Port Delacroix, Kai

`port-delacroix-aussen.bayou` · keine laufende Quest

_Am Kai liegt ein Luftboot unter einer Plane. „Wenn das Musikhaus wieder offen ist“, steht auf einem Zettel._

#### 1162 · Altes Musikhaus

`port-delacroix-musikhaus.schild` · Quest „Das Musikhaus am Kai“, Schritt 4 von 4: Nach der Reise durch die Wüste zurückkommen und das Schild aufhängen.

_Das Dach ist neu. Im Saal stehen Tische, auf jedem eines der Bretter aus der Stadt. In der Ecke glänzt Henris Klavier._

_Miss Odile, Remy, Lou und Henri warten unter der Tür. Jemand reicht dir eine Leiter._

_Du hängst das Schild über die Tür: „Maison de Musique. Club d'Échecs, depuis 1889.“_

_Remy spielt drei Töne auf der Trompete. Alle klatschen._

**Miss Odile:** Seit 1889. Und wieder.

→ Quest „Das Musikhaus am Kai“: Schritt 4 von 4 erledigt

→ Quest abgeschlossen: „Das Musikhaus am Kai“

#### 1163 · Altes Musikhaus

`port-delacroix-musikhaus.loch_im_dach` · keine laufende Quest

_Das Dach ist geflickt. Wo das Loch war, ist jetzt ein Fenster, und die Sonne fällt aufs Klavier._

#### 1164 · Port Delacroix, Kai

`port-delacroix-aussen.bauzaun` · keine laufende Quest

_Der Bauzaun ist weg. Am Musikhaus hängt ein neues Schild, und drinnen spielt jemand._

#### 1165 · Port Delacroix, Kai

`port-delacroix-musikhaus.blaeser` · Quest „Nie zweimal dasselbe Stück“, Schritt 1 von 3: Das erste Set Schach960 gegen Mabel im Musikhaus spielen.

_Eine Bläserin putzt ihre Posaune und lacht dich an._

**Bläserin im Musikhaus:** Mabel. Posaune, zweite Reihe, und dienstags Schach. Bei uns stehen die Figuren jedes Mal anders.

**Bläserin im Musikhaus:** Wir spielen nie zweimal dasselbe Stück. Warum sollten wir zweimal dieselbe Eröffnung spielen?

**Bläserin im Musikhaus:** Wir nennen es Schach960. Die Grundreihe wird gemischt, die Läufer stehen auf verschiedenen Farben, der König irgendwo zwischen den Türmen.

**Kim (Antwort):** „Und die Rochade?“

**Bläserin im Musikhaus:** Rochiert wird wie immer: König und Turm landen auf denselben Feldern wie im normalen Schach.

**Bläserin im Musikhaus:** Zum Rochieren fasst du erst den König an und dann deinen eigenen Turm.

**Bläserin im Musikhaus:** Erstes Set. Ich würfle die Grundreihe aus, du suchst dir einen Plan. Locker, zum Warmspielen.

**Bläserin im Musikhaus:** Ein Set dauert ein Stück. Zehn Minuten auf der Uhr für jeden, fünf Sekunden dazu für jeden Zug. Dann spielt die Band das nächste.

**Kim (Antwort):** „Spielen wir.“\
(andere Antworten: „Nicht jetzt.“)

→ Quest begonnen: „Nie zweimal dasselbe Stück“

[Partie gegen Bläserin im Musikhaus – Ausgang: gewonnen]

→ Quest „Nie zweimal dasselbe Stück“: Schritt 1 von 3 erledigt

#### 1166 · Port Delacroix, Kai

`port-delacroix-musikhaus.blaeser` · keine laufende Quest

**Bläserin im Musikhaus:** Nicht schlecht! Du hast nicht gesucht, was du kennst. Du hast gespielt, was da stand.

**Bläserin im Musikhaus:** Zweites Set. Jetzt spiele ich mit, nicht nur zum Warmwerden.

**Kim (Antwort):** „Gern.“\
(andere Antworten: „Nicht jetzt.“)

[Partie gegen Bläserin im Musikhaus – Ausgang: gewonnen]

→ Quest „Nie zweimal dasselbe Stück“: Schritt 2 von 3 erledigt

#### 1167 · Port Delacroix, Kai

`port-delacroix-aussen.bayou` · keine laufende Quest

_Der Marschpfad führt hinaus in den Bayou. Das Wasser gluckst um die Stiefel._

### Im Bayou

#### 1168 · Bootssteg im Bayou

`bayou.nebel` · keine laufende Quest

_Über dem Wasser liegt dichter Nebel. Irgendwo platscht etwas, irgendwo ruft ein Vogel._

_Du kannst kaum drei Bootslängen weit sehen. So ungefähr fühlt sich Nebelschach an._

#### 1169 · Bootssteg im Bayou

`bayou.ereignis_hausboot` · Quest „Die Kiste im Hausboot“, Schritt 1 von 3: In Pépés Blechkiste blättern, bevor sie brennt.

_Am Ende des Stegs liegt ein Hausboot. Eine Laterne brennt, obwohl es Tag ist._

_Auf dem Deck des Hausboots sitzt ein alter Mann neben einer verbeulten Blechkiste. Er hält ein Streichholz in der Hand._

**Pépé Thibodeaux:** Thibodeaux. Pépé sagen alle. Die Kiste kommt ins Feuer, heute Abend. Keiner liest das mehr.

**Pépé Thibodeaux:** Partieformulare aus dem Café des Exilés, 1852. Mein Urgroßvater hat da Kaffee ausgeschenkt. Schau ruhig rein, bevor sie brennen.

**Kim (Antwort):** In den Formularen blättern\
(andere Antworten: „Bitte nicht verbrennen.“)

_Vergilbte Blätter, sauber in Spalten geschrieben. Auf einem bleibt dein Blick hängen: dieselbe schräge Schrift wie in den Notizen im Brett._

_Es ist Ambroses Schrift. Eine Partie gegen einen Hafenarbeiter. Von ihr hat er nie erzählt._

_Nach dem 20. Zug hört das Formular auf. Den Rest hat keiner aufgeschrieben, Weiß ist am Zug._

**Kim (Antwort):** Die Stellung mit Ambroses Seite weiterspielen\
(andere Antworten: „Nicht jetzt.“)

**Pépé Thibodeaux:** Na los. Ich will sehen, ob der alte Kram noch was taugt.

→ Quest begonnen: „Die Kiste im Hausboot“

→ Quest „Die Kiste im Hausboot“: Schritt 1 von 3 erledigt

[Partie gegen Der Hafenarbeiter von 1852 – Ausgang: gewonnen]

→ Quest „Die Kiste im Hausboot“: Schritt 2 von 3 erledigt

#### 1170 · Bootssteg im Bayou

`bayou.ereignis_hausboot` · Quest „Die Kiste im Hausboot“, Schritt 3 von 3: Pépé erzählen, wie die Partie ausging.

_Am Ende des Stegs liegt ein Hausboot. Eine Laterne brennt, obwohl es Tag ist._

_Diesmal gewinnt Weiß. Du hättest es ihm gern gezeigt._

_Pépé steckt das Streichholz zurück in die Schachtel._

**Pépé Thibodeaux:** Gut. Dann brennt heute nichts. Die Kiste bringe ich ins Musikhaus, da gehört sie hin. Das eine Blatt behältst du.

→ Quest „Die Kiste im Hausboot“: Schritt 3 von 3 erledigt

→ Quest abgeschlossen: „Die Kiste im Hausboot“

#### 1171 · Bootssteg im Bayou

`bayou.finch_bauer_c` · keine laufende Quest

_An der Reuse am Steg hängt ein kleiner Fink aus Blech. Zwischen den Maschen steckt ein weißer Bauer aus hellem Holz._

_Unter dem Bauern ist ein Feld eingebrannt._

#### 1172 · Bootssteg im Bayou

`bayou.seite05` · keine laufende Quest

_Am Ufer klebt ein Blatt an einer Wurzel. Eine lose Seite voller Schachdiagramme._

#### 1173 · Bootssteg im Bayou

`bayou.sperre_hochwasser` · keine laufende Quest

_Das Wasser steht knöcheltief über den Planken. Mit Gummistiefeln geht es, langsam._

#### 1174 · Bootssteg im Bayou

`bayou.luftboot` · keine laufende Quest

_Ein flaches Boot mit einem Propeller so groß wie ein Scheunentor. Auf der Bank liegt ein Schachbrett mit einem Stein darauf, gegen den Wind._

#### 1175 · Bootssteg im Bayou

`bayou.theron` · keine laufende Quest

_Am Bootssteg liegt ein flaches Luftboot mit einem riesigen Propeller. Ein Mann mit Sonnenbrille winkt._

**Theron:** Theron. Ich fahre Leute durch den Bayou. Morgens, wenn der Nebel liegt, spielen wir Nebelschach.

**Theron:** Du siehst nur die Felder, die deine Figuren erreichen. Den Rest verschluckt der Nebel.

#### 1176 · Bootssteg im Bayou

`bayou.pepe` · keine laufende Quest

**Pépé Thibodeaux:** Mein Urgroßvater hätte dir einen Kaffee ausgegeben. Ich hab nur Wasser. Viel Wasser.

#### 1177 · Bootssteg im Bayou

`bayou.nebel` · keine laufende Quest

_Der Nebel hat sich gehoben. Zwischen den Zypressen glitzert das Wasser._

#### 1178 · Bootssteg im Bayou

`bayou.ereignis_hausboot` · keine laufende Quest

_Das Hausboot schaukelt leise. Die Blechkiste ist fort._

#### 1179 · Bootssteg im Bayou

`bayou.finch_bauer_c` · keine laufende Quest

_Die Reuse ist leer bis auf Schlamm._

#### 1180 · Bootssteg im Bayou

`bayou.seite05` · keine laufende Quest

_Am Ufer liegt nur noch Moos._

#### 1181 · Bootssteg im Bayou

`bayou.luftboot` · keine laufende Quest

_Therons Luftboot schaukelt am Steg. Der Propeller steht still._

#### 1182 · Bootssteg im Bayou

`bayou.theron` · keine laufende Quest

**Theron:** Nächsten Sommer bringe ich dir das richtig bei. Mit Brett und Nebel.

#### 1183 · Bootssteg im Bayou

`bayou.pepe` · keine laufende Quest

**Pépé Thibodeaux:** Hörst du die Frösche? Die spielen auch, nur ohne Brett.

#### 1184 · Bootssteg im Bayou

`bayou.theron` · keine laufende Quest

**Theron:** Der Alligator dort heißt Bernard. Er spielt nicht mit.

#### 1185 · Bootssteg im Bayou

`bayou.theron` · keine laufende Quest

**Theron:** Im Nebel siehst du nur, wohin deine Figuren ziehen können. Der Rest ist Geduld.

#### 1186 · Bootssteg im Bayou

`bayou.pepe` · keine laufende Quest

**Pépé Thibodeaux:** Die Kiste steht jetzt im Musikhaus. Henri hat sie neben das Klavier gestellt.

### Maple Falls

#### 1187 · Dein Zimmer

`maple-falls-dachboden.ambrose` · Quest „Ein Jahr später“, Schritt 1 von 1: Das alte Brett wartet auf deinem Schreibtisch.

→ Quest begonnen: „Ein Jahr später“

_Im Herbst werden die Ahornbäume an der Birch Lane wieder rot. Erst an den Rändern. Du hörst den Wasserfall noch immer._

_Auf Mrs. Calloways Veranda verliert sie jeden Nachmittag gegen einen Achtjährigen. In Raum zwölf bringt Carla den Neuen das Zählen bei._

_In einem Keller in Silicon Bay unterrichtet eine Frau acht Kinder bei einem Heizlüfter._

_Eines davon hatte früher zwei Titel und kommt jetzt jeden Tag._

**Kim (Antwort):** Auf den Dachboden gehen

_Das Brett steht auf dem Dachboden, auf dem niedrigen Tisch unter dem runden Fenster. Keine Decke darüber. Du staubst es ab. Oft._

_Eine Figur steht anders als am Abend. Daneben liegt ein Zettel in alter, steiler Schrift._

_„Du hast mich nicht gebraucht. Das ist das schönste Geschenk. – A. W.“_

**Kim (Antwort):** Den Zettel einstecken

_An einem Nachmittag im Oktober steht jemand auf der Treppe. Du hörst die neunte Stufe._

**Lily:** Mama sagt, du hast gewonnen. Mein Cousin sagt, Mädchen können nicht richtig spielen. Nur den Springer.

**Kim (Antwort):** „Dein Cousin redet viel.“

**Lily:** Bringst du es mir bei? Richtig?

_Du räumst die zwei Könige und den Springer ab, vorsichtig, und legst sie in den Geigenkasten. Dann stellst du alle zweiunddreißig auf._

_Der weiße König ist schwer, unten mit Blei ausgegossen, und das Kreuz auf seiner Krone ist ein bisschen schief._

**Kim (Antwort):** „Setz dich. Du hast Weiß.“

_Lily klettert auf den Schaukelstuhl. Er knarrt. Sie sieht auf zweiunddreißig Dinge, von denen ihr keines etwas sagt._

**Lily:** Und jetzt?

_Durch das runde Fenster fällt das Licht. Der Staub hängt in der Luft wie etwas, das sich entschieden hat, nicht zu fallen._

**Kim (Antwort):** „Schau nicht auf alles. Stell eine Frage.“

**Lily:** Welche?

**Kim (Antwort):** Lächeln

**Kim:** Was hängt?

→ Quest „Ein Jahr später“: Schritt 1 von 1 erledigt

→ Quest abgeschlossen: „Ein Jahr später“

### Port Delacroix

#### 1188 · Port Delacroix, Kai

`port-delacroix-musikhaus.blaeser` · keine laufende Quest

**Bläserin im Musikhaus:** Letztes Set, die Jam-Session. Die ganze Band schaut zu, und ich spiele, so gut ich kann.

**Bläserin im Musikhaus:** Und schneller. Fünf Minuten, drei Sekunden je Zug. Eine Jam-Session wartet auf niemanden.

**Kim (Antwort):** „Ich bin bereit.“\
(andere Antworten: „Nicht jetzt.“)

[Partie gegen Bläserin im Musikhaus – Ausgang: gewonnen]

→ Quest „Nie zweimal dasselbe Stück“: Schritt 3 von 3 erledigt

→ Quest abgeschlossen: „Nie zweimal dasselbe Stück“

#### 1189 · Port Delacroix, Kai

`port-delacroix-musikhaus.blaeser` · keine laufende Quest

_Die Band spielt einen Tusch. Mabel hebt die Posaune wie einen Pokal._

**Bläserin im Musikhaus:** Drei Sets, und du hast nie nach der Eröffnung gefragt. Hier, unsere Setliste.

_Sie gibt dir ein zerknittertes Blatt: neben jedem Lied eine Nummer zwischen 0 und 959, die Startstellung des Abends._

### An den Großen Seen

#### 1190 · Seeufer

`weg-ghost-capital.wanderer` · keine laufende Quest

**Wanderer:** Du hast meine Seiten! Warte, ich streiche sie glatt. Jede einzelne.

**Wanderer:** Alle dreizehn. Jetzt lasse ich sie binden. Komm mich in Capital besuchen.

#### 1191 · Leuchtturm

`weg-ghost-capital.odette` · Quest „Die Finch-Jagd“, Schritt 1 von 3: Finchs fünfzehn weiße Figuren an den Wegen suchen. Wo ein kleiner Fink gemalt ist, lohnt sich ein Blick.

**Odette Finch:** Alle fünfzehn! Du bist schneller als die letzten drei zusammen.

**Odette Finch:** Hier ist der weiße König. Den hatte ich die ganze Zeit in der Tasche. Jetzt stelle ich Schwarz auf.

**Odette Finch:** Weiß zieht und gewinnt. Finchs letzte Falle, und die älteste.

**Kim (Antwort):** Das Meisterproblem lösen\
(andere Antworten: „Ich komme wieder.“)

→ Quest „Die Finch-Jagd“: Schritt 1 von 3 erledigt

[Stellungsduell gegen Odette Finch – Ausgang: gewonnen]

→ Quest „Die Finch-Jagd“: Schritt 2 von 3 erledigt

#### 1192 · Leuchtturm

`weg-ghost-capital.odette` · Quest „Die Finch-Jagd“, Schritt 3 von 3: Odette die Lösung zeigen.

**Odette Finch:** Gelöst! Dann gehört der Satz dir. Finchs Buchsbaum, sechzehn Weiße, sechzehn Schwarze.

**Odette Finch:** Und jetzt zeige ich dir, woher die Falle kommt. Légal hat sie um 1750 in Paris gestellt.

→ Quest „Die Finch-Jagd“: Schritt 3 von 3 erledigt

→ Quest abgeschlossen: „Die Finch-Jagd“

### Capital Arena

#### 1193 · Capital Arena, Vorplatz

`capital-arena-aussen.wanderer` · Quest „Die verlorenen Seiten“, Schritt 2 von 2: Nach dem Finale den Wanderer vor der Arena treffen.

_Der Mann mit dem gelben Rucksack hält einen Packen alter Blätter in den Händen, frisch gebunden, in einem Leinendeckel._

**Wanderer:** Für dich. Dreizehn Blätter haben gefehlt, und jedes hast du einmal in der Hand gehabt.

→ Quest „Die verlorenen Seiten“: Schritt 2 von 2 erledigt

→ Quest abgeschlossen: „Die verlorenen Seiten“

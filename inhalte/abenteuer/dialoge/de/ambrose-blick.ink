// Ambrose als Begleiter (Wunsch des Autors, 24.11.2026): Blickpunkte.
//
// Zweck: Ambrose Whitlock, der Geist von 1866, ist immer bei {held} und sieht die Welt von heute
// mit den Augen seiner Zeit. Diese Datei hält, was er an bestimmten Stellen der Karten dazu sagt.
// Warum eine eigene Datei: Die Ortsdateien erzählen die Geschichte; hier steht nur Beiwerk, das
// nichts auslöst, keine Quest berührt und kein Rätsel löst.
//
// Blickpunkte: Stellen auf einer Karte, an denen es für einen Mann von 1866 etwas Besonderes zu
// sehen gibt (kein Kommentar beim Betreten einer Karte: Da hat man noch nichts gesehen). Die
// Stellen stehen in inhalte/abenteuer/ambrose_blickpunkte.json (karte, feld, radius, knoten,
// optional wann); zu jedem Eintrag gehört hier genau ein Knoten `blick_<karte>_<stichwort>`
// (Punkt wird Unterstrich, also `blick_mapleFalls_park_skater` für die Karte mapleFalls.park).
// Zustandsfassungen einer Karte teilen sich die Knoten. Kommt {held} zum ersten Mal in die Nähe,
// erscheint Ambrose kurz daneben; die App spielt jeden Knoten einmal und merkt sich das selbst
// (`<knoten>_gesehen` im Spielstand). Form: ein bis drei Zeilen von Ambrose, eine Gedankenwahl von
// {held} (jede Wahl trägt `#gedanke`, nur Ambrose hört sie), dann höchstens eine Antwort von ihm.
// Ohne Knoten: die Erinnerungen (erinnerungLondon.strand, erinnerungLondon.kaffeehaus,
// erinnerungSiedlung.huette); dort lebt Ambrose und begleitet niemanden. Ebenso der Dachboden:
// Dort steht Ambrose selbst auf der Karte.
// Der zweite Teil der Datei sammelt die Dinge von heute (Auto, Automat, Leuchtschrift …), jedes
// an einer Stelle, an der es auf der Karte steht.
//
// Regeln (Story-Bibel, Abschnitte 5.2 und 5.3; Regelwerk R29, R29a; Entscheidung Q21-5):
// - Ambrose spricht erst nach der ersten Lektion auf dem Dachboden, nicht zwischen Tiefpunkt und
//   Versöhnung und nicht nach dem Abschied: Jeder Knoten fragt zuerst `ambroseFehlt()`. Das ist
//   dieselbe Regel wie `ambroseNichtDa` der App (regeln/abwesenheit.ts), dazu die erste Lektion.
// - In Akt 1 nennt er {held} nicht beim Namen (erst im Archiv, `ambroseNenntNamen`); die Knoten
//   der Karten von Akt 1 und die Dinge kommen deshalb ohne Namen aus.
// - Über Hale, das Match von 1858, die Reise und seinen Tod sagt er hier nichts, bevor die
//   Geschichte es erzählt hat. Wo ein Knoten in zwei Phasen spielen kann, steht eine Bedingung.
// - Kein Wissen aus Quests, keine Lösungen, keine Hinweise auf Funde.
// - Moderne Dinge umschreibt er (Taschenspiegel, Rechenmaschine, Telegraf ohne Draht).

VAR held = "Du"
// Aus maple-falls-dachboden.ink: Erst nach der ersten Lektion ist Ambrose erwacht. Hier nur gelesen.
VAR ersteLektionBesprochen = false
// Aus port-delacroix-turnhalle.ink und weg-delacroix-desert.ink: Tiefpunkt bis Versöhnung (R29).
VAR tiefpunktGesehen = false
VAR versoehnungGesehen = false
// Aus capital-arena-aussen.ink: Nach dem Abschied (Szene 109) spricht Ambrose nicht mehr
// (Story-Bibel Abschnitt 33, Frage 5; Entscheidung Q21-5). Hier nur gelesen.
VAR abschiedGesehen = false
// Aus cedar-creek-archiv.ink: Die Erzählung von 1858 ist gefallen. Hier nur gelesen.
VAR erzaehlung1858Gesehen = false
// Aus port-delacroix-aussen.ink: Das Musikhaus ist wieder aufgebaut. Hier nur gelesen.
VAR musikhausOffen = false

// Ist Ambrose gerade nicht da? Vor der ersten Lektion, zwischen Tiefpunkt und Versöhnung, nach
// dem Abschied. Beispiel: tiefpunktGesehen ohne versoehnungGesehen → ja.
=== function ambroseFehlt() ===
~ return not ersteLektionBesprochen or abschiedGesehen or (tiefpunktGesehen and not versoehnungGesehen)

// ============================================================ Akt 1: Maple Falls


=== blick_mapleFalls_wohnzimmer_kartons ===
{ambroseFehlt(): -> END}
Ein ganzes Haus in Pappschachteln. Zu meiner Zeit brauchte man dafür zwei Fuhrwerke und einen Vetter. #sprecher:ambrose #stimmung:nachdenklich
* [Wir hatten einen Lastwagen. #gedanke]
    Einen Wagen ohne Pferde, der ein Haus trägt. Ich glaube dir kein Wort, und doch steht er draußen. #sprecher:ambrose #stimmung:ueberrascht
* [Mama packt das in einer Woche aus. #gedanke]
    Deine Mutter klingt nach jemandem, der Wort hält. Die Kisten wissen es nur noch nicht. #sprecher:ambrose #stimmung:laechelt
* [Mir fehlt mein altes Zimmer. #gedanke]
    Das glaube ich dir. Ein neues Haus muss man erst einspielen, wie ein neues Brett. #sprecher:ambrose #stimmung:nachdenklich
- -> END

=== blick_mapleFalls_zimmer_fenster ===
{ambroseFehlt(): -> END}
Ein Bett, ein Tisch, ein Fenster. Mehr braucht ein Schachspieler nicht. #sprecher:ambrose #stimmung:laechelt
Stell das Brett ans Fenster, wenn du so gut sein willst. Ich sehe gern hinaus. #sprecher:ambrose #stimmung:nachdenklich
* [Du kannst hinaussehen? #gedanke]
    Ich sehe, was das Brett sieht. Frag nicht, wie. Ich weiß es selbst nicht. #sprecher:ambrose #stimmung:nachdenklich
* [Nachts brauche ich aber meine Ruhe. #gedanke]
    Gewiss. Ich räuspere mich nur, wenn du im Traum einen Läufer einstellst. #sprecher:ambrose #stimmung:lacht
* [Das Fenster geht zur Straße. #gedanke]
    Umso besser. Eine Straße ist ein Theater, für das man keinen Eintritt zahlt. #sprecher:ambrose #stimmung:laechelt
- -> END

=== blick_mapleFalls_aussen_veranda ===
{ambroseFehlt(): -> END}
Eine ruhige Straße. Keine Pferde, kein Mist, und trotzdem kommen alle voran. #sprecher:ambrose #stimmung:ueberrascht
Nur die Veranden kenne ich. Auf einer Veranda sitzt man in jedem Jahrhundert gleich. #sprecher:ambrose #stimmung:laechelt
* [Hier fahren Autos. #gedanke]
    Autos. Das Wort merke ich mir. Es klingt nach etwas, das von allein läuft. #sprecher:ambrose #stimmung:nachdenklich
* [Was vermisst du am meisten? #gedanke]
    Das Hufgeklapper am Morgen. Daran hörte man, dass die Stadt wach war. #sprecher:ambrose #stimmung:nachdenklich
* [Mir ist hier alles noch fremd. #gedanke]
    Dann sind wir schon zwei. Das ist ein Anfang. #sprecher:ambrose #stimmung:laechelt
- -> END

=== blick_mapleFalls_park_skater ===
{ambroseFehlt(): -> END}
Ein Fluss, eine Eiche, eine Bank. So sieht ein Ort aus, an dem man in Ruhe verlieren darf. #sprecher:ambrose #stimmung:laechelt
Und dort steht ein Kind auf einem Brett mit Rädern. Donnerwetter, es fällt nicht einmal. #sprecher:ambrose #stimmung:ueberrascht
* [Das ist ein Skateboard. #gedanke]
    Ein Brett, auf dem man fährt, statt zu denken. Ich bleibe bei meinem. #sprecher:ambrose #stimmung:lacht
* [Ist der Fluss wie der Mississippi? #gedanke]
    Der Mississippi würde diesen hier zum Frühstück trinken. Aber er plätschert hübsch. #sprecher:ambrose #stimmung:stolz
* [Spielen wir hier eine Partie? #gedanke]
    Immer. Such uns einen Platz im Schatten, dort denkt es sich besser. #sprecher:ambrose #stimmung:laechelt
- -> END

=== blick_mapleFalls_clubraum_bretter ===
{ambroseFehlt(): -> END}
Sechs Bretter in einem Raum. Das ist kein Kaffeehaus, aber es ist nahe daran. #sprecher:ambrose #stimmung:laechelt
Es fehlen nur der Rauch, der Kaffee und drei Herren, die alles besser wissen. #sprecher:ambrose #stimmung:nachdenklich
* [Besserwisser gibt es hier auch. #gedanke]
    Dann ist es ein richtiger Club. Ich fühle mich gleich zu Hause. #sprecher:ambrose #stimmung:lacht
* [Warst du oft im Kaffeehaus? #gedanke]
    Jeden Tag, in New Orleans. Mein Kaffee wurde kalt, meine Stellungen nie. #sprecher:ambrose #stimmung:stolz
* [Ich bin ein bisschen aufgeregt. #gedanke]
    Das gehört sich so. Wer am Brett nichts fühlt, hat auch nichts zu gewinnen. #sprecher:ambrose #stimmung:laechelt
- -> END

=== blick_mapleFalls_diner_theke ===
{ambroseFehlt(): -> END}
Ein Speisewagen ohne Schienen. Er steht einfach da und fährt nirgends hin. #sprecher:ambrose #stimmung:ueberrascht
Und der Kaffee wird nachgeschenkt, ohne dass man fragt. Dieses Jahrhundert hat auch gute Seiten. #sprecher:ambrose #stimmung:laechelt
* [Du kannst doch gar nichts trinken. #gedanke]
    Herrje, nein. Aber ich sehe gern zu, wenn es anderen schmeckt. #sprecher:ambrose #stimmung:laechelt
* [Was hättest du bestellt? #gedanke]
    Kaffee mit Zichorie, schwarz wie ein dunkles Feld. Und danach noch einen. #sprecher:ambrose #stimmung:nachdenklich
* [Auf den Tischsets sind Schachrätsel. #gedanke]
    Schach auf dem Tischtuch. Ich nehme alles zurück, was ich über diese Zeit gedacht habe. #sprecher:ambrose #stimmung:lacht
- -> END

// ------------------------------------------------------------ Akt 1: Weg nach Cedar Creek

=== blick_wegMapleCedar_landstrasse_kuehe ===
{ambroseFehlt(): -> END}
Eine Landstraße, glatt wie ein Tisch. Zu meiner Zeit verlor man auf solchen Wegen ein Rad und einen halben Tag. #sprecher:ambrose #stimmung:nachdenklich
Die Kühe sind die alten geblieben. Das beruhigt mich. #sprecher:ambrose #stimmung:laechelt
* [Die Kühe schauen uns an. #gedanke]
    Wie Zuschauer bei einer langen Partie. Geduldig, und ohne ein Wort zu verstehen. #sprecher:ambrose #stimmung:lacht
* [Wie lange hättest du gebraucht? #gedanke]
    Mit der Kutsche einen Vormittag. Zu Fuß so lange wie wir, nur in schlechteren Schuhen. #sprecher:ambrose #stimmung:nachdenklich
* [Hier fährt auch ein Bus. #gedanke]
    Der gelbe Kasten voller Kinder? Ich gehe lieber. Im Gehen denkt es sich besser. #sprecher:ambrose #stimmung:laechelt
- -> END

=== blick_wegMapleCedar_flussweg_steg ===
{ambroseFehlt(): -> END}
Wasser, Boote, ein Steg. Fürwahr, hier atme ich auf, soweit ich das noch kann. #sprecher:ambrose #stimmung:froh
Mir fehlt nur das Schaufelrad. Kein Dampfer weit und breit. #sprecher:ambrose #stimmung:nachdenklich
* [Was ist ein Schaufelrad? #gedanke]
    Ein Rad, so hoch wie ein Haus. Es schiebt einen Dampfer durchs Wasser und rauscht dabei wie ein Wehr. #sprecher:ambrose #stimmung:stolz
* [Boote haben heute Motoren. #gedanke]
    Ohne Rauch und ohne Kessel? Dann fehlt ihnen die Würde, aber gewiss nicht die Eile. #sprecher:ambrose #stimmung:lacht
* [Bist du oft Schiff gefahren? #gedanke]
    Sooft ich konnte. An Deck spielt es sich gut, solange der Wind die Bauern stehen lässt. #sprecher:ambrose #stimmung:laechelt
- -> END

=== blick_wegMapleCedar_zedernpfad_wald ===
{ambroseFehlt(): -> END}
Ein Wald, der riecht wie eine frisch geöffnete Zigarrenkiste. Zedern, nehme ich an. #sprecher:ambrose #stimmung:laechelt
Geh ruhig voran. Ich stolpere nicht mehr, das ist einer der wenigen Vorzüge. #sprecher:ambrose #stimmung:lacht
* [Hast du Angst im Wald? #gedanke]
    Ich bin hier das Gespenst. Wenn sich jemand fürchten muss, dann der Wald. #sprecher:ambrose #stimmung:lacht
* [Die Treppen sind ganz schön steil. #gedanke]
    Steil ist gut. Wer steigt, sieht am Ende mehr vom Brett. #sprecher:ambrose #stimmung:nachdenklich
* [Trag du doch mal das Brett. #gedanke]
    Mit Vergnügen, sobald ich wieder Hände habe. Bis dahin lobe ich deine. #sprecher:ambrose #stimmung:laechelt
- -> END

=== blick_kuerbishof_hof_irrgarten ===
{ambroseFehlt(): -> END}
Ein Irrgarten aus Mais. Die Leute kommen her, um sich zu verlaufen? #sprecher:ambrose #stimmung:ueberrascht
Zu meiner Zeit verlief man sich umsonst und war nicht stolz darauf. #sprecher:ambrose #stimmung:lacht
* [Im Irrgarten braucht man einen Plan. #gedanke]
    Wie am Brett. Wer nur dem nächsten Gang folgt, steht bald vor einer Wand. #sprecher:ambrose #stimmung:nachdenklich
* [So viele Kürbisse. #gedanke]
    Runde, zufriedene Burschen. Sie liegen da wie Bauern, die nie ziehen mussten. #sprecher:ambrose #stimmung:laechelt
* [Gab es bei euch auch Vogelscheuchen? #gedanke]
    Gewiss. Unsere trug den alten Zylinder meines Onkels. Die Krähen hatten großen Respekt vor ihm. #sprecher:ambrose #stimmung:lacht
- -> END

// ------------------------------------------------------------ Akt 1: Cedar Creek

=== blick_cedarCreek_aussen_bibliothek ===
{ambroseFehlt(): -> END}
Ein Ort, der nach Holz und Papier riecht. Hier würde ich gern eine Woche lang nichts tun als lesen. #sprecher:ambrose #stimmung:laechelt
Der Backsteinbau dort ist jünger als ich. Und er sieht älter aus. Das gefällt mir. #sprecher:ambrose #stimmung:stolz
* [Das ist die Bibliothek. #gedanke]
    Ein Haus nur für Bücher, offen für jedes Kind? Herrje. Dafür hätte ich meinen besten Springer gegeben. #sprecher:ambrose #stimmung:ueberrascht
* [Du siehst gar nicht alt aus. #gedanke]
    Sehr freundlich. Durchsichtig zu sein glättet die Falten. #sprecher:ambrose #stimmung:lacht
* [Hier ist es so still. #gedanke]
    Stille ist kein Mangel. In der Stille sieht man eher, was hängt. #sprecher:ambrose #stimmung:nachdenklich
- -> END

=== blick_cedarCreek_bibliothek_buecher ===
{ambroseFehlt(): -> END}
So viele Bücher, und niemand bewacht sie. Zu meiner Zeit lieh man ein Buch und schuldete dafür einen Gefallen. #sprecher:ambrose #stimmung:ueberrascht
Denk bitte leise. Nicht meinetwegen, mich hört ja keiner. Der Bücher wegen. #sprecher:ambrose #stimmung:laechelt
* [Ich denke doch schon leise. #gedanke]
    Du denkst manchmal recht laut. Besonders, wenn du einen Zug bereust. #sprecher:ambrose #stimmung:lacht
* [Gibt es hier Schachbücher? #gedanke]
    Ich hoffe es. Zu meiner Zeit passten alle guten auf ein einziges Regalbrett. #sprecher:ambrose #stimmung:nachdenklich
* [Welches Buch würdest du lesen? #gedanke]
    Eines über die letzten hundertsechzig Jahre. Ich habe einiges versäumt, scheint mir. #sprecher:ambrose #stimmung:laechelt
- -> END

=== blick_cedarCreek_archiv_jahrgaenge ===
{ambroseFehlt(): -> END}
Hier unten liegt die Zeit in Stapeln. Jeder Jahrgang sauber gebunden, als könnte man ihn noch einmal aufschlagen. #sprecher:ambrose #stimmung:nachdenklich
{erzaehlung1858Gesehen:
    Einen davon haben wir aufgeschlagen. Die anderen lasse ich heute lieber schlafen. #sprecher:ambrose #stimmung:still
- else:
    Ich weiß nicht, ob ich neugierig bin oder lieber wieder nach oben möchte. #sprecher:ambrose #stimmung:nachdenklich
}
* [Alte Zeitungen sind spannend. #gedanke]
    Für dich. Für mich sind es die Neuigkeiten von gestern früh. #sprecher:ambrose #stimmung:laechelt
* [Wir können auch wieder gehen. #gedanke]
    Nein. Ein Gentleman läuft vor Papier nicht davon. #sprecher:ambrose #stimmung:stolz
* [Es ist kalt hier unten. #gedanke]
    Ist es das? Dann merke ich endlich einmal einen Vorteil an meinem Zustand. #sprecher:ambrose #stimmung:lacht
- -> END

=== blick_cedarCreek_drechslerei_spaene ===
{ambroseFehlt(): -> END}
Späne, eine Drehbank, halbfertige Springer. So entsteht ein Schachspiel: erst aus Holz, dann aus Geduld. #sprecher:ambrose #stimmung:laechelt
Ich könnte dem Mann stundenlang zusehen. #sprecher:ambrose #stimmung:nachdenklich
* [Der Springer ist am schwersten, oder? #gedanke]
    Gewiss. Einen Turm dreht jeder Lehrjunge. Für ein Pferdegesicht braucht es einen Meister. #sprecher:ambrose #stimmung:stolz
* [Dein Brett ist auch aus Holz. #gedanke]
    Aus gutem Holz, und es hat einiges ausgehalten. Mich zum Beispiel. #sprecher:ambrose #stimmung:lacht
* [Hier riecht es gut. #gedanke]
    Nach frischem Schnitt. Das ist der Geruch von Dingen, die noch werden. #sprecher:ambrose #stimmung:laechelt
- -> END

=== blick_cedarCreek_waschsalon_bullaugen ===
{ambroseFehlt(): -> END}
Schränke mit Bullaugen, in denen die Wäsche Karussell fährt. Und niemand steht am Zuber? #sprecher:ambrose #stimmung:ueberrascht
Unsere Waschfrau hätte geweint. Vor Glück, nehme ich an. #sprecher:ambrose #stimmung:laechelt
* [Die Maschine macht alles allein. #gedanke]
    Allein. Dieses Wort höre ich in deiner Zeit sehr oft. #sprecher:ambrose #stimmung:nachdenklich
* [Man muss nur warten. #gedanke]
    Warten kann ich. Darin habe ich mehr Übung als jeder hier im Raum. #sprecher:ambrose #stimmung:nachdenklich
* [Beim Warten kann man Schach spielen. #gedanke]
    Endlich ein vernünftiger Gedanke in diesem Jahrhundert. Bau auf. #sprecher:ambrose #stimmung:froh
- -> END

// ============================================================ Akt 2: Weg nach Riverton, Riverton

=== blick_wegCedarRiverton_zedernwald_bach ===
{ambroseFehlt(): -> END}
Wir gehen zu Fuß in die nächste Stadt. Das hätte meinen Schuhen gefallen und meinem Stolz weniger. #sprecher:ambrose #stimmung:lacht
Aber der Bach hält Schritt. Ein Weg mit Wasser daneben ist nie ganz einsam. #sprecher:ambrose #stimmung:laechelt
* [Zu Fuß sieht man mehr. #gedanke]
    So ist es. Aus der Kutsche sah ich immer nur den Rücken des Kutschers. #sprecher:ambrose #stimmung:lacht
* [Meine Füße tun weh. #gedanke]
    Meine nicht. Ich würde gern tauschen, glaub mir. #sprecher:ambrose #stimmung:nachdenklich
* [Warum reist du so gern? #gedanke]
    Weil am Ende jeder Reise ein Brett steht, an dem ich noch nicht gespielt habe. #sprecher:ambrose #stimmung:laechelt
- -> END

=== blick_wegCedarRiverton_bahndamm_schienen ===
{ambroseFehlt(): -> END}
Schienen. Endlich etwas, das ich kenne. #sprecher:ambrose #stimmung:froh
Die Eisenbahn war zu meiner Zeit das Neueste vom Neuen. Wir standen am Damm und hielten unsere Hüte fest. #sprecher:ambrose #stimmung:nachdenklich
* [Heute sind Züge ganz normal. #gedanke]
    Normal! Ein eisernes Ross, das einen in einem Tag durchs halbe Land trägt. Gewöhn dich nie daran. #sprecher:ambrose #stimmung:streng
* [Die fahren heute ohne Dampf. #gedanke]
    Ohne Dampf, ohne Funken, ohne Ruß im Gesicht? Dann kommt man ja sauber an. Wie schade. #sprecher:ambrose #stimmung:lacht
* [Bist du mit dem Zug gereist? #gedanke]
    Einige Male. Ich habe im Abteil gegen einen Viehhändler gespielt und fast verloren, wegen der Kurven. #sprecher:ambrose #stimmung:lacht
- -> END

=== blick_riverton_aussen_wasserturm ===
{ambroseFehlt(): -> END}
Ein Bahnhof aus Backstein mit einem Uhrturm. Diese Stadt weiß, was sich gehört. #sprecher:ambrose #stimmung:stolz
Und der Wasserturm dort hat einmal Lokomotiven getränkt. Ich erkenne einen alten Kollegen. #sprecher:ambrose #stimmung:laechelt
* [Du magst Bahnhöfe. #gedanke]
    Ich mag Orte, an denen alle auf etwas warten. Da falle ich nicht auf. #sprecher:ambrose #stimmung:nachdenklich
* [Die Stadt ist größer als Cedar Creek. #gedanke]
    Größer und lauter. In großen Städten sitzen die guten Spieler, das war immer so. #sprecher:ambrose #stimmung:laechelt
* [Kennst du den Fluss? #gedanke]
    Jeder Fluss ist ein Vetter des Mississippi. Dieser ist ein entfernter, aber die Familie sieht man. #sprecher:ambrose #stimmung:laechelt
- -> END

=== blick_riverton_bahnhofshalle_zeitungen ===
{ambroseFehlt(): -> END}
Eine Halle wie eine Kirche, nur dass alle auf die Tafel schauen statt nach vorn. #sprecher:ambrose #stimmung:nachdenklich
Und Zeitungen gibt es noch. Gedruckt, auf Papier. Ich bin gerührt. #sprecher:ambrose #stimmung:laechelt
* [Die meisten lesen am Handy. #gedanke]
    Im Taschenspiegel, ich weiß. Aber hinter einer Zeitung kann man sich verstecken, wenn man verloren hat. #sprecher:ambrose #stimmung:lacht
* [Soll ich dir eine kaufen? #gedanke]
    Ein nobles Angebot. Halt sie nur so, dass ich mitlesen kann, und blättere nicht zu schnell. #sprecher:ambrose #stimmung:laechelt
* [Wohin würdest du fahren? #gedanke]
    Dorthin, wo heute Abend die stärkste Partie gespielt wird. Die Fahrkarte wäre mir gleich. #sprecher:ambrose #stimmung:stolz
- -> END

=== blick_riverton_pavillon_bodenbrett ===
{ambroseFehlt(): -> END}
Ein Pavillon am Fluss mit einem Schachbrett im Boden. Wer das gebaut hat, hatte das Herz am rechten Fleck. #sprecher:ambrose #stimmung:froh
Der Wind zieht durch. Bei uns hätten die Herren ihre Hüte auf die Notizzettel gelegt. #sprecher:ambrose #stimmung:laechelt
* [Hier wird seit Jahrzehnten gespielt. #gedanke]
    Das spürt man. Bretter, an denen lange gespielt wurde, sind wie eingelaufene Stiefel. #sprecher:ambrose #stimmung:nachdenklich
* [Fast wie dein Kaffeehaus? #gedanke]
    Besser gelüftet. Und niemand bläst mir Zigarrenrauch ins Gesicht, das muss ich zugeben. #sprecher:ambrose #stimmung:lacht
* [Gefällt es dir hier? #gedanke]
    Sehr. Sag es nicht weiter, sonst hält man mich für leicht zu beeindrucken. #sprecher:ambrose #stimmung:laechelt
- -> END

=== blick_riverton_schuppen_plane ===
{ambroseFehlt(): -> END}
Ein Schuppen voller Dinge, die jemand irgendwann reparieren wollte. #sprecher:ambrose #stimmung:nachdenklich
Unter jeder Plane liegt ein guter Vorsatz. Das war zu meiner Zeit nicht anders. #sprecher:ambrose #stimmung:laechelt
* [So eine Ecke haben wir auch. #gedanke]
    In jedem Haus gibt es eine. Bei uns war es der Platz unter der Treppe. #sprecher:ambrose #stimmung:laechelt
* [Was hast du nie repariert? #gedanke]
    Eine Taschenuhr, die immer vorging. Sie hat gut zu mir gepasst, sagten manche. #sprecher:ambrose #stimmung:lacht
* [Hier ist es staubig. #gedanke]
    Staub stört mich nicht. Wir sind inzwischen gute Bekannte. #sprecher:ambrose #stimmung:lacht
- -> END

=== blick_riverton_wohnwagen_pokale ===
{ambroseFehlt(): -> END}
Ein ganzes Haus auf Rädern, und es passt ein Schachbrett hinein. Mehr muss ein Haus nicht können. #sprecher:ambrose #stimmung:laechelt
Zu meiner Zeit wohnten so die Schausteller. Es waren nicht die schlechtesten Spieler. #sprecher:ambrose #stimmung:nachdenklich
* [Die Pokale sind aus Dosen. #gedanke]
    Und sie glänzen trotzdem. Ein Pokal ist so viel wert wie die Partie dahinter. #sprecher:ambrose #stimmung:stolz
* [Würdest du so wohnen wollen? #gedanke]
    Ich wohne in einem Holzbrett. Verglichen damit ist das hier ein Palast. #sprecher:ambrose #stimmung:lacht
* [Es ist eng hier. #gedanke]
    Eng ist gut für das Schach. Für dumme Gedanken ist einfach kein Platz. #sprecher:ambrose #stimmung:laechelt
- -> END

// ------------------------------------------------------------ Akt 2: Kanalweg, Lockport

=== blick_wegRivertonIronwood_kanalweg_treidelpfad ===
{ambroseFehlt(): -> END}
Ein Treidelpfad! Hier zogen Maultiere die Kähne, Schritt für Schritt, an einem langen Seil. #sprecher:ambrose #stimmung:froh
Die Maultiere sind fort, der Pfad ist geblieben. So geht es manchem von uns. #sprecher:ambrose #stimmung:nachdenklich
* [Und wer zieht die Kähne heute? #gedanke]
    Niemand, wie mir scheint. Sie brummen und fahren von allein. Die Maultiere wären gekränkt. #sprecher:ambrose #stimmung:lacht
* [Du bist doch auch geblieben. #gedanke]
    Eben. Der Pfad und ich, wir verstehen uns. #sprecher:ambrose #stimmung:laechelt
* [Die Fabrik da drüben ist riesig. #gedanke]
    Schornsteine kenne ich. Nur waren unsere kleiner, und der Himmel darüber war schwärzer. #sprecher:ambrose #stimmung:nachdenklich
- -> END

=== blick_wegRivertonIronwood_bruecke_hoehe ===
{ambroseFehlt(): -> END}
So hoch über dem Wasser, und nichts wackelt. Ich gehe trotzdem in der Mitte, wenn es dir recht ist. #sprecher:ambrose #stimmung:ueberrascht
* [Du kannst doch gar nicht fallen. #gedanke]
    Das weiß ich. Meine Knie wissen es noch nicht. #sprecher:ambrose #stimmung:lacht
* [Die hält schon über hundert Jahre. #gedanke]
    Dann ist sie fast in meinem Alter. Wir alten Herrschaften halten mehr aus, als man denkt. #sprecher:ambrose #stimmung:stolz
* [Schau mal, Schafe. #gedanke]
    Schafe ziehen immer alle zugleich. Kein Plan, aber eine beneidenswerte Einigkeit. #sprecher:ambrose #stimmung:lacht
- -> END

=== blick_lockport_aussen_schleuse ===
{ambroseFehlt(): -> END}
Eine Schleuse. Man sperrt das Wasser ein, hebt ein Schiff wie auf einer Hand und lässt es wieder frei. #sprecher:ambrose #stimmung:froh
Ich habe als Junge stundenlang an einer gestanden. Es ist das geduldigste Bauwerk, das ich kenne. #sprecher:ambrose #stimmung:nachdenklich
* [Du und geduldig? #gedanke]
    Ich sagte, das Bauwerk ist geduldig. Von mir war nicht die Rede. #sprecher:ambrose #stimmung:lacht
* [Wie ein Bauer auf dem Weg zur Dame. #gedanke]
    Donnerwetter. Unten hinein als Kahn, oben heraus als etwas Größeres. Das merke ich mir. #sprecher:ambrose #stimmung:ueberrascht
* [Hier ist es friedlich. #gedanke]
    Ja. Hier hat es niemand eilig, nicht einmal das Wasser. #sprecher:ambrose #stimmung:laechelt
- -> END

=== blick_lockport_gasthaus_kegelbahn ===
{ambroseFehlt(): -> END}
Ein Gasthaus mit Kegelbahn. Das Poltern kenne ich, das hat sich in hundertsechzig Jahren nicht geändert. #sprecher:ambrose #stimmung:laechelt
Bei uns stellte ein Junge die Kegel wieder auf und bekam dafür einen Cent. #sprecher:ambrose #stimmung:nachdenklich
* [Kannst du kegeln? #gedanke]
    Ich war miserabel. Eine Kugel hört nicht auf gute Argumente. #sprecher:ambrose #stimmung:lacht
* [Heute macht das oft eine Maschine. #gedanke]
    Natürlich. Und der Junge? Ich hoffe, er spielt jetzt Schach. #sprecher:ambrose #stimmung:nachdenklich
* [Hier riecht es nach Essen. #gedanke]
    Dann iss für mich mit. Aber langsam, damit ich etwas davon habe. #sprecher:ambrose #stimmung:laechelt
- -> END

// ------------------------------------------------------------ Akt 2: Ironwood, Steinbruch

=== blick_ironwood_aussen_werk ===
{ambroseFehlt(): -> END}
Eine Stadt aus Eisen und Ruß, und sie schämt sich nicht dafür. Das achte ich. #sprecher:ambrose #stimmung:nachdenklich
Hier wird etwas hergestellt, das man anfassen kann. Solche Städte spielen ehrliches Schach. #sprecher:ambrose #stimmung:laechelt
* [Woher willst du das wissen? #gedanke]
    Wer den ganzen Tag Stahl biegt, macht am Abend keine Züge aus Eitelkeit. Dafür ist er zu müde. #sprecher:ambrose #stimmung:lacht
* [Der Kran ist höher als jede Kirche. #gedanke]
    Zu meiner Zeit war die Kirche immer das Höchste. Jetzt ist es die Arbeit. Auch eine Predigt. #sprecher:ambrose #stimmung:nachdenklich
* [Mir ist nicht ganz wohl hier. #gedanke]
    Ich weiß. Wir gehen einen Zug nach dem anderen, {held}. So wie immer. #sprecher:ambrose #stimmung:laechelt
- -> END

=== blick_ironwood_kantine_suppe ===
{ambroseFehlt(): -> END}
Ein Schachclub in einer Kantine. Suppe links, Bretter rechts. So muss das Paradies eingerichtet sein. #sprecher:ambrose #stimmung:froh
In New Orleans gab es zum Schach nur Kaffee und harte Kekse. #sprecher:ambrose #stimmung:nachdenklich
* [Die Suppe riecht gut. #gedanke]
    Dann iss, bevor du spielst. Ein leerer Magen opfert zu früh. #sprecher:ambrose #stimmung:laechelt
* [Und wer hat die Kekse gegessen? #gedanke]
    Der Verlierer. Das war die eigentliche Strafe. #sprecher:ambrose #stimmung:lacht
* [Hier sind alle so groß und breit. #gedanke]
    Am Brett sind alle gleich groß. Das ist das Schöne an vierundsechzig Feldern. #sprecher:ambrose #stimmung:stolz
- -> END

=== blick_ironwood_mamasZimmer_kinderzimmer ===
{ambroseFehlt(): -> END}
Hier ist deine Mutter ein Kind gewesen. Man sieht es an nichts Bestimmtem, und doch an allem. #sprecher:ambrose #stimmung:nachdenklich
Ich bleibe an der Tür, wenn du erlaubst. In fremden Kinderzimmern ist ein Gentleman nur Gast. #sprecher:ambrose #stimmung:laechelt
* [Du darfst ruhig hereinkommen. #gedanke]
    Danke. Ich rühre nichts an. Das fällt mir bekanntlich leicht. #sprecher:ambrose #stimmung:lacht
* [Hattest du auch so ein Zimmer? #gedanke]
    Eine Kammer unterm Dach, mit einem Fenster zum Hafen. Ich habe Schiffe gezählt statt Schafe. #sprecher:ambrose #stimmung:nachdenklich
* [Es ist komisch, hier zu sein. #gedanke]
    Das glaube ich. Man lernt seine Eltern erst kennen, wenn man ihre Kinderzimmer sieht. #sprecher:ambrose #stimmung:nachdenklich
- -> END

=== blick_ironwood_museum_schalter ===
{ambroseFehlt(): -> END}
Ein Museum. Man stellt hier Dinge hinter Glas, die ich noch benutzt habe. #sprecher:ambrose #stimmung:ueberrascht
Herrje, dieser Fahrkartenschalter ist jünger als ich und gilt schon als Altertum. #sprecher:ambrose #stimmung:lacht
* [Dann gehörst du auch hinter Glas. #gedanke]
    Ich bitte darum. Aber mit gutem Licht und einem Schild, auf dem „Meister“ steht. #sprecher:ambrose #stimmung:stolz
* [Erkennst du etwas wieder? #gedanke]
    Die kleine Lokomotive dort. So eine hat mir in groß einmal den Hut vom Kopf geblasen. #sprecher:ambrose #stimmung:lacht
* [Die Uhr ist stehen geblieben. #gedanke]
    Dann haben wir etwas gemeinsam, sie und ich. #sprecher:ambrose #stimmung:still
- -> END

=== blick_ironwood_umkleide_spinde ===
{ambroseFehlt(): -> END}
Blechschränke mit Schlössern, einer wie der andere. Was verwahrt man darin? Geheimnisse? #sprecher:ambrose #stimmung:nachdenklich
* [Nur Arbeitskleidung. #gedanke]
    Schade. Ich hatte auf Liebesbriefe und geheime Eröffnungen gehofft. #sprecher:ambrose #stimmung:lacht
* [Und Pausenbrote. #gedanke]
    Das ist ehrlicher als ein Geheimnis. Wer ein Pausenbrot einpackt, plant voraus. #sprecher:ambrose #stimmung:laechelt
* [Hier riecht es nach Seife. #gedanke]
    Nach Seife und Feierabend. Ein guter Geruch für einen Ort. #sprecher:ambrose #stimmung:laechelt
- -> END

=== blick_steinbruch_grube_stufen ===
{ambroseFehlt(): -> END}
Man hat hier einen halben Berg weggetragen, Stufe um Stufe. Und irgendwo steht er jetzt als Rathaus. #sprecher:ambrose #stimmung:nachdenklich
* [Oder als Bahnhof. #gedanke]
    Oder als Bahnhof. Stein kommt herum, wenn man ihn lässt. #sprecher:ambrose #stimmung:laechelt
* [Das ist ganz schön tief. #gedanke]
    Bleib von der Kante weg. Einer von uns beiden kann noch fallen. #sprecher:ambrose #stimmung:streng
* [Wie eine Treppe für Riesen. #gedanke]
    Für Riesen mit Geduld. Jede Stufe war ein Jahr Arbeit, möchte ich wetten. #sprecher:ambrose #stimmung:laechelt
- -> END

=== blick_steinbruch_stollen_dunkel ===
{ambroseFehlt(): -> END}
Dunkel, eng und still. Hier fühle ich mich beinahe zu Hause, und das beunruhigt mich. #sprecher:ambrose #stimmung:nachdenklich
* [Ist es im Brett auch so dunkel? #gedanke]
    Dunkler. Aber dort stehen zweiunddreißig alte Freunde um mich herum. #sprecher:ambrose #stimmung:laechelt
* [Ich bin froh, dass du da bist. #gedanke]
    Ich auch, {held}. Ein Stollen ist kein Ort für einen allein. #sprecher:ambrose #stimmung:laechelt
* [Kannst du im Dunkeln sehen? #gedanke]
    Nicht besser als du. Aber ich stoße mir wenigstens nicht den Kopf. #sprecher:ambrose #stimmung:lacht
- -> END

// ============================================================ Akt 3: Weg nach Silicon Bay, Silicon Bay

=== blick_wegIronwoodSilicon_raststaette_schnee ===
{ambroseFehlt(): -> END}
Schnee auf der Düne und dahinter das Meer. Als Kind kannte ich Schnee nur aus Büchern. #sprecher:ambrose #stimmung:ueberrascht
Bei uns im Süden fiel er einmal in zehn Jahren, und dann blieb die ganze Stadt zu Hause. #sprecher:ambrose #stimmung:laechelt
* [Hast du nie einen Schneemann gebaut? #gedanke]
    Nie. Ich wüsste nicht einmal, womit man anfängt. Mit dem König, vermutlich. #sprecher:ambrose #stimmung:lacht
* [Frierst du? #gedanke]
    Nein. Aber ich ziehe aus Gewohnheit die Schultern hoch. #sprecher:ambrose #stimmung:laechelt
* [Die Autos da oben rasen vorbei. #gedanke]
    Und keiner sieht das Meer an. Wer so schnell reist, kommt an und war nirgends. #sprecher:ambrose #stimmung:nachdenklich
- -> END

=== blick_wegIronwoodSilicon_glasbruecke_glas ===
{ambroseFehlt(): -> END}
Eine Brücke aus Glas. Ich sehe zwischen meinen Füßen hindurch, und das kenne ich sonst nur von mir selbst. #sprecher:ambrose #stimmung:ueberrascht
Dort unten fließt ein Strom aus Wagen. Acht Reihen, und keiner grüßt den anderen. #sprecher:ambrose #stimmung:nachdenklich
* [Schau einfach nicht nach unten. #gedanke]
    Ein vorzüglicher Rat. Ich gebe ihn dir beim nächsten schlechten Endspiel zurück. #sprecher:ambrose #stimmung:lacht
* [Das ist eine Autobahn. #gedanke]
    Eine Bahn nur für diese Wagen. Und wohin wollen die alle? Sag nicht, zur Arbeit. #sprecher:ambrose #stimmung:nachdenklich
* [Glas hält mehr aus, als man denkt. #gedanke]
    Das sagt man auch von kühnen Plänen. Ich habe mit beidem gemischte Erfahrungen. #sprecher:ambrose #stimmung:lacht
- -> END

=== blick_siliconBay_aussen_lieferroboter ===
{ambroseFehlt(): -> END}
Eine Stadt aus Glas. Man kann überall hineinsehen, und trotzdem weiß ich nicht, was die Leute tun. #sprecher:ambrose #stimmung:ueberrascht
Und dort rollt ein Kasten allein über den Platz. Er weicht jedem aus, nur mir nicht. #sprecher:ambrose #stimmung:nachdenklich
* [Das ist ein Lieferroboter. #gedanke]
    Ein Laufbursche ohne Beine und ohne Trinkgeld. Der arme Kerl. #sprecher:ambrose #stimmung:laechelt
* [Das alte Hotel gefällt dir, oder? #gedanke]
    Das mit dem grünen Dach? Fürwahr. Das einzige Haus hier, das einen Hut trägt. #sprecher:ambrose #stimmung:laechelt
* [Mir ist das alles zu glatt. #gedanke]
    Mir auch. An glatten Wänden bleibt keine Geschichte hängen. #sprecher:ambrose #stimmung:nachdenklich
- -> END

=== blick_siliconBay_lobby_empfang ===
{ambroseFehlt(): -> END}
Ein Empfang, an dem niemand lächelt. Nur dieser höfliche Blechmann steht da. #sprecher:ambrose #stimmung:nachdenklich
Er sagt allen dasselbe. In einem guten Hotel hätte man ihn dafür entlassen. #sprecher:ambrose #stimmung:streng
* [Roboter werden nicht müde. #gedanke]
    Das ist ja das Unheimliche. Wer nie müde wird, weiß nicht, wann es genug ist. #sprecher:ambrose #stimmung:nachdenklich
* [Sag ihm doch Guten Tag. #gedanke]
    Guten Tag, mein Herr. Siehst du? Nichts. Dabei habe ich mich sogar verbeugt. #sprecher:ambrose #stimmung:lacht
* [Die Zahlen an der Wand verstehe ich nicht. #gedanke]
    Ich auch nicht. Aber sie steigen alle, und das scheint hier das Wichtigste zu sein. #sprecher:ambrose #stimmung:nachdenklich
- -> END

=== blick_siliconBay_akademie_saal ===
{ambroseFehlt(): -> END}
Kein einziges Brett aus Holz. Kein Klacken, kein Seufzen, kein Stuhl, der knarrt. #sprecher:ambrose #stimmung:nachdenklich
Und doch wird hier gespielt, sehr genau sogar. Ich muss hinsehen, ob ich will oder nicht. #sprecher:ambrose #stimmung:gebannt
* [Dir gefällt das doch. #gedanke]
    Es zieht mich an. Ob es mir gefällt, weiß ich noch nicht. #sprecher:ambrose #stimmung:gebannt
* [Mir fehlt das Klacken. #gedanke]
    Mir auch. Eine Figur muss man so hinstellen können, dass der Gegner es hört. #sprecher:ambrose #stimmung:laechelt
* [Hier ist es so leise. #gedanke]
    Zu leise für Schach. In New Orleans hat immer jemand gehustet, und meistens mit Absicht. #sprecher:ambrose #stimmung:lacht
- -> END

=== blick_siliconBay_serverraum_schraenke ===
{ambroseFehlt(): -> END}
Hier wohnt sie also, die Rechenmaschine. In Schränken, im Kalten, bei blauem Licht. #sprecher:ambrose #stimmung:gebannt
Ich wohne in einem Brett. Ich sollte der Letzte sein, der sich über ihre Wohnung wundert. #sprecher:ambrose #stimmung:nachdenklich
* [Ihr seid euch ähnlich. #gedanke]
    Nein. Ich habe verloren, {held}. Wer nie verloren hat, wohnt anders. #sprecher:ambrose #stimmung:still
* [Sie braucht es kalt zum Denken. #gedanke]
    Ich brauchte Kaffee und einen Gegner, der mich ärgert. Jeder nach seiner Art. #sprecher:ambrose #stimmung:laechelt
* [Mir ist das unheimlich. #gedanke]
    Das Summen? Mir auch. Es klingt wie ein Saal voller Leute, die nie etwas sagen. #sprecher:ambrose #stimmung:nachdenklich
- -> END

=== blick_siliconBay_altstadt_laeden ===
{ambroseFehlt(): -> END}
Ah. Ein Bäcker, ein Postamt, ein Musikladen. Hier hat die Stadt ihr altes Gesicht aufgehoben. #sprecher:ambrose #stimmung:froh
Zum ersten Mal seit der gläsernen Brücke weiß ich, wo ich bin. #sprecher:ambrose #stimmung:laechelt
* [Hier ist es gemütlicher. #gedanke]
    Gemütlich heißt: Jemand hat Fehler gemacht und sie stehen lassen. Schiefe Türen, krumme Gassen. #sprecher:ambrose #stimmung:laechelt
* [Schauen wir zum Musikladen? #gedanke]
    Gern. Ich sehe mir Klaviere an, wie andere Leute sich Pferde ansehen. #sprecher:ambrose #stimmung:froh
* [Sogar hier putzt ein Roboter. #gedanke]
    Er kehrt sehr gründlich und grüßt niemanden. Unser Straßenfeger konnte beides. #sprecher:ambrose #stimmung:lacht
- -> END

=== blick_siliconBay_hafen_netze ===
{ambroseFehlt(): -> END}
Netze, Fischkisten, eine Hafenmeisterei. Jetzt bin ich beinahe zu Hause. #sprecher:ambrose #stimmung:laechelt
Ein Hafen riecht überall gleich: nach Teer, nach Fisch und nach Leuten, die bald fort sind. #sprecher:ambrose #stimmung:nachdenklich
* [Bist du am Wasser aufgewachsen? #gedanke]
    Mit den Füßen darin, sooft meine Mutter nicht hinsah. #sprecher:ambrose #stimmung:laechelt
* [Die Schiffe haben keine Segel. #gedanke]
    Und keine Schaufelräder. Sie liegen da wie Schuhkartons. Aber sie schwimmen, das muss man ihnen lassen. #sprecher:ambrose #stimmung:lacht
* [Wohin fährt die Fähre? #gedanke]
    Hinaus, wie es aussieht. Das genügt mir bei einem Schiff als Auskunft. #sprecher:ambrose #stimmung:laechelt
- -> END

=== blick_pelikaninsel_dorf_pelikane ===
{ambroseFehlt(): -> END}
Pelikane! Sieh dir diese Schnäbel an. Bei uns saßen sie auf jedem Pfahl und taten, als gehöre ihnen der Hafen. #sprecher:ambrose #stimmung:froh
Sie haben sich nicht verändert. Dieselbe Würde, dieselbe schlechte Laune. #sprecher:ambrose #stimmung:lacht
* [Die sehen aus wie alte Herren. #gedanke]
    Wie die Zuschauer im Kaffeehaus. Sie sagen nichts und missbilligen jeden Zug. #sprecher:ambrose #stimmung:lacht
* [Hier draußen ist alles grau. #gedanke]
    Grau ist die Farbe des Meeres, wenn es nachdenkt. Stör es nicht. #sprecher:ambrose #stimmung:nachdenklich
* [Häuser auf Pfählen? #gedanke]
    Wer am Wasser baut, baut auf Stelzen oder zweimal. Das wussten schon meine Großeltern. #sprecher:ambrose #stimmung:laechelt
- -> END

// ------------------------------------------------------------ Akt 3: Fähre, Port Delacroix

=== blick_wegSiliconDelacroix_faehre_schornstein ===
{ambroseFehlt(): -> END}
Ein Schiff! Planken unter den Füßen, Wind von vorn. Fürwahr, das habe ich vermisst. #sprecher:ambrose #stimmung:laechelt
Der Schornstein raucht kaum, und nirgends dreht sich ein Rad. Sie fährt wie von Geisterhand, und ich war es nicht. #sprecher:ambrose #stimmung:lacht
* [Wirst du seekrank? #gedanke]
    Früher nie. Und jetzt fehlt mir der Magen dafür, was die Sache vereinfacht. #sprecher:ambrose #stimmung:lacht
* [Sie hat einen Motor. #gedanke]
    Einen Motor. Ich nicke, als verstünde ich es. Hauptsache, er kennt den Weg. #sprecher:ambrose #stimmung:laechelt
* [Wie schnell waren die Dampfer? #gedanke]
    Langsam genug für drei Partien bis zum nächsten Hafen. Das war das rechte Maß. #sprecher:ambrose #stimmung:nachdenklich
- -> END

=== blick_wegSiliconDelacroix_deich_zypressen ===
{ambroseFehlt(): -> END}
Zypressen im Wasser und ein Deich aus Erde. So sah das Land aus, in dem ich Kind war, {held}. #sprecher:ambrose #stimmung:fern
Den Deich haben wir jeden Frühling angesehen wie einen Gegner, der einen Plan hat. #sprecher:ambrose #stimmung:nachdenklich
* [Hat er gehalten? #gedanke]
    Meistens. Und wenn nicht, hat die ganze Stadt geschaufelt, der Bankier neben dem Fischer. #sprecher:ambrose #stimmung:nachdenklich
* [Du klingst anders als sonst. #gedanke]
    Tue ich das? Das macht das Wasser. Es redet hier mit einem Akzent, den ich kenne. #sprecher:ambrose #stimmung:fern
* [Das Meer drückt gegen den Deich. #gedanke]
    Das Meer greift immer am schwächsten Punkt an. Das musste ihm nie jemand beibringen. #sprecher:ambrose #stimmung:nachdenklich
- -> END

=== blick_portDelacroix_aussen_rueDuPort ===
{ambroseFehlt(): -> END}
Die Rue du Port. Ich bin sie tausendmal hinuntergelaufen, immer zu spät und immer mit einem Brett unter dem Arm. #sprecher:ambrose #stimmung:fern
Die Häuser sind andere. Aber die Straße biegt noch an derselben Stelle, als hätte sie auf mich gewartet. #sprecher:ambrose #stimmung:still
* [Erkennst du noch etwas? #gedanke]
    Den Wind vom Kai. Und das Pflaster unter deinen Schuhen, bilde ich mir ein. #sprecher:ambrose #stimmung:fern
* [Der Sturm hat viel zerstört. #gedanke]
    Das hat er immer getan. Und immer standen danach Leute mit Hämmern da. Sieh nur. #sprecher:ambrose #stimmung:nachdenklich
* [Wie fühlt sich das an? #gedanke]
    Wie eine Stellung, die ich einmal gespielt habe. Die Züge weiß ich nicht mehr, aber die Hand erinnert sich. #sprecher:ambrose #stimmung:still
- -> END

=== blick_portDelacroix_musikhaus_klavier ===
{ambroseFehlt(): -> END}
{musikhausOffen:
    Neue Dielen, ein neues Dach, und es riecht nach Farbe statt nach Regen. Das Haus hat wieder eine Stimme. #sprecher:ambrose #stimmung:froh
- else:
    Regen auf den Dielen, und das Klavier unter einer Plane wie ein krankes Tier. Aber es steht noch. #sprecher:ambrose #stimmung:traurig
}
In diesem Saal habe ich als Junge zum ersten Mal Applaus gehört. Er galt nicht mir, aber ich habe ihn mir gemerkt. #sprecher:ambrose #stimmung:fern
* [Wem galt er? #gedanke]
    Einer Sängerin aus Paris. Ich war neun und beschloss, auch einmal etwas zu können. #sprecher:ambrose #stimmung:laechelt
* [Das Klavier hat überlebt. #gedanke]
    Klaviere sind zäher, als sie aussehen. Man muss sie nur wieder stimmen, dann verzeihen sie alles. #sprecher:ambrose #stimmung:laechelt
* [Hier wird wieder gespielt werden. #gedanke]
    Schach und Musik unter einem Dach. Gewiss. So war es immer gedacht. #sprecher:ambrose #stimmung:nachdenklich
- -> END

=== blick_portDelacroix_turnhalle_linien ===
{ambroseFehlt(): -> END}
Schach auf einem Ballspielfeld, zwischen bunten Linien. Der Club hat kein Haus mehr und spielt trotzdem. #sprecher:ambrose #stimmung:nachdenklich
* [Die Linien verwirren mich. #gedanke]
    Dann sieh nur auf die vierundsechzig Felder. Alle anderen Linien gehen uns nichts an. #sprecher:ambrose #stimmung:laechelt
* [Die Leute hier geben nicht auf. #gedanke]
    Das ist meine Stadt. Sie war schon immer zu stur zum Untergehen. #sprecher:ambrose #stimmung:stolz
* [Es zieht hier. #gedanke]
    Eine Turnhalle ist kein Salon. Aber ein Brett ist ein Brett, und mehr hat nie jemand gebraucht. #sprecher:ambrose #stimmung:nachdenklich
- -> END

// Die Werkstatt betritt {held} zum ersten Mal im Tiefpunkt (Szenen 66 und 68); der Blick spielt
// deshalb erst bei einem Besuch nach der Versöhnung.
=== blick_portDelacroix_werkstatt_klaviere ===
{ambroseFehlt(): -> END}
Späne auf den Dielen und Leim in der Luft. Hier darf ich jedes Mal ein wenig länger bleiben, ja? #sprecher:ambrose #stimmung:friedlich
Sie bauen noch Klaviere. Niemand spielt hier Schach, und alle sind glücklich. Das musste ich erst lernen. #sprecher:ambrose #stimmung:laechelt
* [Bleib, solange du willst. #gedanke]
    Danke. Nur einen Augenblick. Ein Gast soll gehen, solange man ihn noch gern sieht. #sprecher:ambrose #stimmung:friedlich
* [Bist du traurig darüber? #gedanke]
    Nein. Erstaunt. Man kann offenbar auch ohne mich ein guter Whitlock sein. #sprecher:ambrose #stimmung:laechelt
* [Es riecht wie in der Drechslerei. #gedanke]
    Holz ist Holz, ob daraus ein Springer wird oder ein Klavier. Beide brauchen ein gutes Ohr. #sprecher:ambrose #stimmung:laechelt
- -> END

// ------------------------------------------------------------ Akt 3: Canyon, Sternwarte, Desert Springs

// Den Canyonpfad geht {held} zuerst im Tiefpunkt; mit Ambrose erst wieder nach der Versöhnung.
=== blick_wegDelacroixDesert_canyonpfad_fels ===
{ambroseFehlt(): -> END}
{versoehnungGesehen:
    Diesen Pfad sind wir schon einmal gegangen, und ich habe kaum ein Wort gesagt. #sprecher:ambrose #stimmung:still
    Jetzt sehe ich erst, wie rot der Fels ist. Ich war mit Schweigen beschäftigt. #sprecher:ambrose #stimmung:laechelt
- else:
    Roter Fels, so weit ich sehe. Als hätte jemand die Abendsonne in Stein gegossen. #sprecher:ambrose #stimmung:ueberrascht
}
* [Schön, dass du da bist. #gedanke]
    {versoehnungGesehen:Ich finde es auch schön. Ich war mir allein keine gute Gesellschaft.|Wo sollte ich sonst sein? Du trägst mein Haus unter dem Arm.} #sprecher:ambrose #stimmung:laechelt
* [Hier ist es still. #gedanke]
    Still, aber nicht leer. Hör nur, wie der Wind an den Wänden entlangstreicht. #sprecher:ambrose #stimmung:friedlich
* [Die Kakteen blühen. #gedanke]
    Mitten im Stein, ohne dass sie jemand gießt. Fürwahr, ein mutiges Gewächs. #sprecher:ambrose #stimmung:laechelt
- -> END

=== blick_wegDelacroixDesert_felsbogen_bogen ===
{ambroseFehlt(): -> END}
Ein Tor aus Stein, und niemand hat es gebaut. Wind und Zeit, mehr brauchte es nicht. #sprecher:ambrose #stimmung:friedlich
Die Zeit kann also auch etwas Schönes hinterlassen. Das tröstet einen wie mich. #sprecher:ambrose #stimmung:laechelt
* [Dich hat sie auch übrig gelassen. #gedanke]
    Als Bogen oder als Geröll? Sag nichts. Ich wähle den Bogen. #sprecher:ambrose #stimmung:lacht
* [Hier oben ist es still. #gedanke]
    Eine gute Stille. Die Sorte, in der man einem Freund etwas sagen kann. #sprecher:ambrose #stimmung:friedlich
* [Setzen wir uns auf die Bank? #gedanke]
    Gern. Ich habe lange genug gestanden, etwa hundertsechzig Jahre. #sprecher:ambrose #stimmung:laechelt
- -> END

=== blick_sternwarte_felsnase_sterne ===
{ambroseFehlt(): -> END}
So viel Himmel. In New Orleans haben die Gaslaternen nachts die Hälfte der Sterne verschluckt. #sprecher:ambrose #stimmung:ueberrascht
Hier oben fehlt bei Nacht bestimmt keiner. Man möchte den Hut abnehmen. #sprecher:ambrose #stimmung:friedlich
* [Kennst du die Sternbilder? #gedanke]
    Den Großen Wagen und zwei, die ich mir selbst ausgedacht habe. Eines hieß der Hängende Läufer. #sprecher:ambrose #stimmung:lacht
* [Ob da oben jemand Schach spielt? #gedanke]
    Wenn ja, dann hoffentlich mutig. Bei so viel Platz wäre Vorsicht eine Schande. #sprecher:ambrose #stimmung:stolz
* [Ich fühle mich ganz klein. #gedanke]
    Ich auch. Es ist angenehm, einmal nicht der Älteste weit und breit zu sein. #sprecher:ambrose #stimmung:laechelt
- -> END

=== blick_sternwarte_kuppel_fernrohr ===
{ambroseFehlt(): -> END}
Ein Fernrohr aus Messing. Endlich ein Gerät, das aussieht, wie ein Gerät aussehen soll. #sprecher:ambrose #stimmung:froh
Man dreht an einer Schraube, und der Himmel kommt näher. Ganz ohne Summen und Blinken. #sprecher:ambrose #stimmung:laechelt
* [Willst du durchschauen? #gedanke]
    Schau du für mich. Und beschreib es langsam, ich habe keine Eile. #sprecher:ambrose #stimmung:friedlich
* [Du magst keine Bildschirme. #gedanke]
    Ich mag Dinge, bei denen man sieht, wie sie es machen. Dieses hier hat nichts zu verbergen. #sprecher:ambrose #stimmung:nachdenklich
* [Die Sterne sind uralt. #gedanke]
    Älter als ich, und immer noch pünktlich. Ich könnte mir ein Beispiel nehmen. #sprecher:ambrose #stimmung:lacht
- -> END

=== blick_desertSprings_aussen_strasse ===
{ambroseFehlt(): -> END}
Eine Straße, ein Gleis und sehr viel Himmel. Wer hier ankommt, wollte entweder weiter oder für immer bleiben. #sprecher:ambrose #stimmung:nachdenklich
Der Bahnhof hat eine Veranda. Ein Haus mit Veranda meint es gut mit den Leuten. #sprecher:ambrose #stimmung:laechelt
* [Würdest du bleiben? #gedanke]
    Eine Woche. Dann würde mir das Wasser fehlen. Ich bin ein Kind vom Fluss, {held}. #sprecher:ambrose #stimmung:laechelt
* [Die Autos sind staubig bis ans Dach. #gedanke]
    Wie die Postkutschen damals. Der Staub ist derselbe geblieben, nur die Pferde hat man eingespart. #sprecher:ambrose #stimmung:lacht
* [So viel Platz und so wenig Leute. #gedanke]
    Platz ist hier das Einzige, was nichts kostet. Man sieht einen Gegner drei Tage vorher kommen. #sprecher:ambrose #stimmung:nachdenklich
- -> END

=== blick_desertSprings_antiquariat_buecher ===
{ambroseFehlt(): -> END}
Alte Bücher bis unter die Decke. Hier bin ich endlich einmal nicht das Älteste im Raum. #sprecher:ambrose #stimmung:froh
Riech nur. Leder, Leim und Staub: So riecht ein Gedanke, den jemand aufgehoben hat. #sprecher:ambrose #stimmung:laechelt
* [Suchst du ein bestimmtes Buch? #gedanke]
    Eines, in dem eine Partie von mir steht. Sag es nicht weiter, es ist reine Eitelkeit. #sprecher:ambrose #stimmung:lacht
* [Die Fahrkarten in der Vitrine sind alt. #gedanke]
    Alt! Die sind von gestern. Meine waren aus Pappe, mit einem Loch vom Schaffner. #sprecher:ambrose #stimmung:lacht
* [Ich mag es hier. #gedanke]
    Ich auch. In einem Laden wie diesem ist nichts je ganz vorbei. #sprecher:ambrose #stimmung:friedlich
- -> END

=== blick_desertSprings_garage_reifenstapel ===
{ambroseFehlt(): -> END}
Ein Schachclub zwischen Ölfässern und einem Wagen ohne Räder. Ich habe schon vornehmer gespielt. #sprecher:ambrose #stimmung:lacht
Aber selten ehrlicher. Wer auf einem Reifenstapel trainiert, meint es ernst. #sprecher:ambrose #stimmung:laechelt
* [Schach geht überall. #gedanke]
    Überall, wo zwei Leute und ein Brett Platz haben. Den Rest haben wir uns nur eingeredet. #sprecher:ambrose #stimmung:friedlich
* [Was ist mit dem Auto? #gedanke]
    Es wird operiert, wie mir scheint. Der Arzt hat die Hände voller Öl, das schafft Vertrauen. #sprecher:ambrose #stimmung:lacht
* [Der Pokal ist aus einer Dose. #gedanke]
    Blech glänzt wie Silber, wenn man es verdient hat. #sprecher:ambrose #stimmung:stolz
- -> END

// ============================================================ Akt 4: Wüstenstraße, Hochebene, Summit City

=== blick_wegDesertSummit_diner_strasse ===
{ambroseFehlt(): -> END}
Eine Straße, so gerade wie eine Turmlinie. Man sieht bis übermorgen. #sprecher:ambrose #stimmung:friedlich
Und mittendrin ein silberner Speisewagen mit einer Krone aus Licht. Der Wüste fehlt es nicht an Humor. #sprecher:ambrose #stimmung:laechelt
* [Hier fahren fast nur Lastwagen. #gedanke]
    Riesige Fuhrwerke mit einer Stube vorn. Die Kutscher schlafen darin, habe ich gesehen. Sehr vernünftig. #sprecher:ambrose #stimmung:laechelt
* [Die Luft flimmert. #gedanke]
    Wie über einem Brett kurz vor dem Opfer. Ich mag das. #sprecher:ambrose #stimmung:froh
* [Hier draußen ist niemand. #gedanke]
    Doch. Wir beide, ein Brett und sehr viel Zeit. Mehr habe ich mir nie gewünscht. #sprecher:ambrose #stimmung:friedlich
- -> END

=== blick_wegDesertSummit_hinterzimmer_tafel ===
{ambroseFehlt(): -> END}
Ein Hinterzimmer mit drei Brettern und einer Kreidetafel. Hier hat sich seit meiner Zeit nichts geändert. #sprecher:ambrose #stimmung:froh
Die besten Partien wurden immer hinten gespielt, wo keiner zusah. #sprecher:ambrose #stimmung:laechelt
* [Warum hinten? #gedanke]
    Vorn spielt man für die Leute. Hinten spielt man für das Brett. #sprecher:ambrose #stimmung:nachdenklich
* [Fühlst du dich zu Hause? #gedanke]
    Fürwahr. Es fehlt nur einer, der mitschreibt und sich dabei verzählt. #sprecher:ambrose #stimmung:lacht
* [Hier wird um nichts gespielt. #gedanke]
    Um die Ehre. Das ist nicht nichts, das ist das Teuerste, was man setzen kann. #sprecher:ambrose #stimmung:stolz
- -> END

=== blick_wegDesertSummit_bergstrasse_kehren ===
{ambroseFehlt(): -> END}
Die Straße windet sich hinauf wie ein Springer, der es nicht eilig hat. #sprecher:ambrose #stimmung:laechelt
Unten Kakteen, oben Kiefern. Wir wechseln die Jahreszeit zu Fuß. #sprecher:ambrose #stimmung:friedlich
* [Mir geht die Puste aus. #gedanke]
    Atme für mich mit. Dann hat es wenigstens einer von uns verdient. #sprecher:ambrose #stimmung:lacht
* [Es wird kühler. #gedanke]
    Gut so. Ein kühler Kopf rechnet weiter, heißt es. Ich habe es nie ausprobiert. #sprecher:ambrose #stimmung:lacht
* [Was ist das Gitter in der Straße? #gedanke]
    Ein Zaun, der liegt, statt zu stehen. Die Kühe trauen sich nicht hinüber. Ich übrigens auch kaum. #sprecher:ambrose #stimmung:laechelt
- -> END

=== blick_hochebene_felsentuerme_pferde ===
{ambroseFehlt(): -> END}
Türme aus rotem Stein, und keiner hat sie je gezogen. Das größte Brett, das ich je sah. #sprecher:ambrose #stimmung:ueberrascht
Und endlich Pferde! Ich dachte schon, ihr hättet sie alle abgeschafft. #sprecher:ambrose #stimmung:froh
* [Die Türme stehen aber schlecht. #gedanke]
    Jeder steht dem anderen im Weg. Aber sie stehen seit Ewigkeiten und beschweren sich nicht. #sprecher:ambrose #stimmung:lacht
* [Kannst du reiten? #gedanke]
    Leidlich. Das Pferd und ich waren uns selten einig, wer von uns führt. #sprecher:ambrose #stimmung:lacht
* [Da oben kreist ein Falke. #gedanke]
    Er sieht das ganze Brett auf einmal. Darum beneide ich ihn mehr als um die Flügel. #sprecher:ambrose #stimmung:nachdenklich
- -> END

=== blick_hochebene_schule_schulbus ===
{ambroseFehlt(): -> END}
Eine Schule mitten im Nichts, und ein gelber Wagen bringt die Kinder von überall her. #sprecher:ambrose #stimmung:ueberrascht
Zu meiner Zeit ging man eine Stunde zu Fuß oder blieb dumm. Die meisten gingen. #sprecher:ambrose #stimmung:laechelt
* [Ich würde auch lieber Bus fahren. #gedanke]
    Natürlich. Aber wer geht, kann unterwegs eine Stellung im Kopf drehen. #sprecher:ambrose #stimmung:laechelt
* [Warst du gut in der Schule? #gedanke]
    Im Rechnen ja, im Stillsitzen nein. Mein Lehrer nannte mich einen Springer, und es war kein Lob. #sprecher:ambrose #stimmung:lacht
* [Die werfen einen Ball in einen Korb. #gedanke]
    Und freuen sich jedes Mal. Ein Spiel mit nur einem Zug. Erholsam, stelle ich mir vor. #sprecher:ambrose #stimmung:lacht
- -> END

=== blick_summitCity_aussen_seilbahn ===
{ambroseFehlt(): -> END}
Eine Stadt auf einer Wiese unter einer Felswand. Die Luft ist so dünn, dass ich mich fast dick fühle. #sprecher:ambrose #stimmung:lacht
Und dort hängt ein Zimmer an einem Draht und fährt den Berg hinauf. Ich sehe es und glaube es nicht. #sprecher:ambrose #stimmung:ueberrascht
* [Das ist eine Seilbahn. #gedanke]
    Eine Bahn am Seil. Ihr nennt die Dinge immer genau so, wie sie mir Angst machen. #sprecher:ambrose #stimmung:lacht
* [Der Brunnen hat einen Drachen. #gedanke]
    Ein Drache, der Wasser spuckt. Gut so. Feuer hätte auf einem Markt nur Ärger gemacht. #sprecher:ambrose #stimmung:laechelt
* [Hier oben ist es schön. #gedanke]
    Ja. Man sieht weit. Von hier oben wirken sogar meine alten Sorgen klein. #sprecher:ambrose #stimmung:friedlich
- -> END

=== blick_summitCity_bergladen_seile ===
{ambroseFehlt(): -> END}
Seile, Haken, Laternen. Die Leute hier rüsten sich für einen Berg wie wir uns für ein Turnier. #sprecher:ambrose #stimmung:laechelt
Nur dass der Berg nie aufgibt. Ein unangenehmer Gegner. #sprecher:ambrose #stimmung:nachdenklich
* [Der Berg macht auch keine Fehler. #gedanke]
    Dann ist er ein schlechter Lehrer. Von Fehlerlosen lernt man nur das Staunen. #sprecher:ambrose #stimmung:nachdenklich
* [Brauchen wir ein Seil? #gedanke]
    Du vielleicht. Ich falle seit Langem nur noch durch Wände. #sprecher:ambrose #stimmung:lacht
* [Die Landkarte ist riesig. #gedanke]
    Und wir sind der kleine Punkt darauf, der sich bewegt. Das hat mir an Karten immer gefallen. #sprecher:ambrose #stimmung:friedlich
- -> END

=== blick_summitCity_huette_kamin ===
{ambroseFehlt(): -> END}
Ein Kamin, zwei Sessel, ein Holzbrett, das benutzt aussieht. Hier wohnt jemand, der es begriffen hat. #sprecher:ambrose #stimmung:friedlich
* [Dir gefällt es hier. #gedanke]
    Ich achte jeden, der ein Endspiel dem Applaus vorzieht. Ich selbst habe das nie geschafft. #sprecher:ambrose #stimmung:laechelt
* [Es ist so ruhig hier. #gedanke]
    Ruhig wie eine Stellung mit wenigen Figuren. Da zählt jeder Schritt doppelt. #sprecher:ambrose #stimmung:nachdenklich
* [Riechst du den Tee? #gedanke]
    Rauch und Tee. Wenn Geduld einen Geruch hat, dann diesen. #sprecher:ambrose #stimmung:friedlich
- -> END

=== blick_summitCity_bergstation_wolken ===
{ambroseFehlt(): -> END}
Wir stehen über den Wolken. {held}, ich bin ein Mann aus dem Delta. Ich war nie höher als ein Kirchturm. #sprecher:ambrose #stimmung:ueberrascht
Sie sehen von oben aus wie Baumwolle vor der Ernte. #sprecher:ambrose #stimmung:friedlich
* [Hast du Angst? #gedanke]
    Mir zittern die Knie, die ich nicht habe. Aber ich möchte um nichts in der Welt wieder hinunter. #sprecher:ambrose #stimmung:lacht
* [So weit hast du noch nie gesehen. #gedanke]
    Nie. Ich musste hundertsechzig Jahre warten und ein Kind finden, das mich herträgt. #sprecher:ambrose #stimmung:friedlich
* [Halt dich am Geländer fest. #gedanke]
    Ich versuche es aus Höflichkeit. Meine Hand geht hindurch, aber die Geste zählt. #sprecher:ambrose #stimmung:laechelt
- -> END

// ------------------------------------------------------------ Akt 4: Geysire, Prärie, Crossroads, Jahrmarkt

=== blick_wegSummitCrossroads_geysirbecken_geysir ===
{ambroseFehlt(): -> END}
Die Erde kocht. Sie kocht, und ihr legt einen Holzsteg darüber und geht spazieren! #sprecher:ambrose #stimmung:ueberrascht
Bei uns hätte man einen Priester geholt. #sprecher:ambrose #stimmung:lacht
* [Das ist ein Geysir. #gedanke]
    Ein Brunnen mit eigenem Willen. Er springt, wann er will. Ein Romantiker, ohne Zweifel. #sprecher:ambrose #stimmung:froh
* [Es riecht nach faulen Eiern. #gedanke]
    Schwefel. So hat man sich früher die Hölle vorgestellt, und nun steht ein Wegweiser davor. #sprecher:ambrose #stimmung:lacht
* [Bleib auf dem Steg. #gedanke]
    Ich schwebe ohnehin eine Handbreit darüber. Aber danke, dass du an mich denkst. #sprecher:ambrose #stimmung:laechelt
- -> END

=== blick_wegSummitCrossroads_praerie_weizen ===
{ambroseFehlt(): -> END}
Weizen bis zum Rand der Welt. Wenn der Wind hineinfährt, sieht es aus wie der Fluss bei Hochwasser. #sprecher:ambrose #stimmung:friedlich
Ich kenne dieses Land nur aus Briefen. Es ist größer, als die Briefe sagten. #sprecher:ambrose #stimmung:nachdenklich
* [Wer hat dir geschrieben? #gedanke]
    Ein Ingenieur, der viel herumkam. Er schrieb wenig, aber er übertrieb nie. #sprecher:ambrose #stimmung:friedlich
* [Hier gibt es Wirbelstürme. #gedanke]
    Stürme kenne ich, vom Meer her. Dass sie sich hier im Kreis drehen, halte ich für Angeberei. #sprecher:ambrose #stimmung:lacht
* [Ein gelbes Meer. #gedanke]
    Fürwahr. Und das brummende Ding dort hinten ist sein Dampfer. #sprecher:ambrose #stimmung:laechelt
- -> END

=== blick_crossroads_aussen_kreuzung ===
{ambroseFehlt(): -> END}
Hier kreuzen sich alle Straßen des Landes, und jeder bleibt nur so lange, wie sein Wagen trinkt. #sprecher:ambrose #stimmung:nachdenklich
Zu meiner Zeit hieß so etwas Poststation. Man wechselte die Pferde und die Neuigkeiten. #sprecher:ambrose #stimmung:laechelt
* [Heute tankt man nur. #gedanke]
    Und die Neuigkeiten hat jeder schon im Taschenspiegel. Schade um die Gespräche am Trog. #sprecher:ambrose #stimmung:nachdenklich
* [Die Lastwagen sind riesig. #gedanke]
    Ganze Häuser auf Rädern. Und die Kutscher stellen sie rückwärts ab, was ich für die eigentliche Kunst halte. #sprecher:ambrose #stimmung:lacht
* [So viele Leute, und alle sind sich fremd. #gedanke]
    An einer Kreuzung ist jeder fremd. Das macht alle gleich höflich. #sprecher:ambrose #stimmung:laechelt
- -> END

=== blick_crossroads_raststaette_tresen ===
{ambroseFehlt(): -> END}
Ein Tresen, Hocker, Kaffee ohne Ende. Dieses Jahrhundert hat das Kaffeehaus nicht abgeschafft, nur umbenannt. #sprecher:ambrose #stimmung:froh
* [Postkarten gibt es auch. #gedanke]
    Bilder von dem Ort, an dem man gerade ist, für Leute, die nicht dort sind. Ich hätte Dutzende geschrieben. #sprecher:ambrose #stimmung:laechelt
* [Magst du Raststätten? #gedanke]
    Ich mag jeden Ort, an dem Reisende sitzen. Sie erzählen besser als Leute, die zu Hause sind. #sprecher:ambrose #stimmung:friedlich
* [Die Wirtin kennt hier alle. #gedanke]
    Eine gute Wirtin weiß, wer wann zuletzt hier war. Das ist auch eine Art, Partien aufzuschreiben. #sprecher:ambrose #stimmung:laechelt
- -> END

=== blick_jahrmarkt_festplatz_riesenrad ===
{ambroseFehlt(): -> END}
Ein Jahrmarkt! Lichter, Musik, klebrige Kinder. Das gab es auch bei uns, nur roch es mehr nach Pferd. #sprecher:ambrose #stimmung:froh
Aber dieses Rad dort, so hoch wie ein Kirchturm, mit Leuten daran? Das ist neu, und es ist herrlich. #sprecher:ambrose #stimmung:ueberrascht
* [Fahren wir Riesenrad? #gedanke]
    Unbedingt. Ich zahle nichts und nehme keinen Platz weg. Ich bin der ideale Fahrgast. #sprecher:ambrose #stimmung:lacht
* [Zuckerwatte ist gesponnener Zucker. #gedanke]
    Eine Wolke am Stiel. Wer das erfunden hat, war ein Dichter oder ein Zahnarzt. #sprecher:ambrose #stimmung:lacht
* [Die Band spielt mit Fiedel. #gedanke]
    Eine Fiedel klingt in jedem Jahrhundert nach Samstagabend. Das beruhigt mich sehr. #sprecher:ambrose #stimmung:friedlich
- -> END

// ------------------------------------------------------------ Akt 4: Fernwanderweg, Pinewood Camp

=== blick_wegCrossroadsPinewood_huetten_huette ===
{ambroseFehlt(): -> END}
Tannen, Farn, ein Bach, eine Hütte mit Kamin. So hat das Land ausgesehen, bevor wir alle so fleißig wurden. #sprecher:ambrose #stimmung:friedlich
* [Hier könnte man sich verlaufen. #gedanke]
    Halt dich an den Bach. Wasser weiß immer, wo es hinwill. Das hat es uns voraus. #sprecher:ambrose #stimmung:laechelt
* [Im Wald denke ich besser. #gedanke]
    Ich auch. Ein Baum redet einem nicht in die Variante hinein. #sprecher:ambrose #stimmung:lacht
* [Wer wohnt in so einer Hütte? #gedanke]
    Jemand, dem ein Ofen und ein Fenster genügen. Ich beneide solche Leute, seit ich Zeit zum Nachdenken habe. #sprecher:ambrose #stimmung:nachdenklich
- -> END

=== blick_wegCrossroadsPinewood_riesenbaeume_lebendschach ===
{ambroseFehlt(): -> END}
Diese Bäume standen schon, als ich geboren wurde. Und als mein Großvater geboren wurde. Und seiner. #sprecher:ambrose #stimmung:friedlich
Neben ihnen bin ich ein junger Mann. Das hat mir lange niemand mehr gezeigt. #sprecher:ambrose #stimmung:laechelt
* [Dann bist du gar nicht so alt. #gedanke]
    Ein Jüngling von kaum zweihundert Jahren. Ich danke dem Baum und dir. #sprecher:ambrose #stimmung:lacht
* [Die Kinder dort spielen Schach als Figuren. #gedanke]
    Lebende Figuren! Hoffentlich weint der Bauer nicht, wenn er geschlagen wird. Meine haben es nie getan. #sprecher:ambrose #stimmung:froh
* [Ich fühle mich winzig. #gedanke]
    Ein Bauer fühlt sich auch winzig. Und dann geht er bis ans andere Ende des Bretts. #sprecher:ambrose #stimmung:laechelt
- -> END

=== blick_pinewoodCamp_aussen_lagerfeuer ===
{ambroseFehlt(): -> END}
Ein Lager voller Kinder an einem See. Es klingt wie ein Schwarm Stare, nur mit mehr Meinungen. #sprecher:ambrose #stimmung:laechelt
Und am Abend ein Feuer. Am Feuer wurden die besten Partien erzählt, lange bevor sie jemand aufschrieb. #sprecher:ambrose #stimmung:friedlich
* [Warst du mal in so einem Lager? #gedanke]
    Nein. Zu meiner Zeit hieß das einfach draußen schlafen, und man tat es nur, wenn die Kutsche brach. #sprecher:ambrose #stimmung:lacht
* [Erzählst du heute Abend eine? #gedanke]
    Wenn du magst. Ich habe eine von einem Lotsen, der auf einem Fass gegen seinen Kapitän gewann. #sprecher:ambrose #stimmung:froh
* [Die sind alle so laut. #gedanke]
    Lass sie. Lärm ist das, was übrig bleibt, wenn Kinder glücklich sind. #sprecher:ambrose #stimmung:friedlich
- -> END

// ------------------------------------------------------------ Akt 4: Canyonrand, Staubstraße, Ghost Town

=== blick_wegPinewoodGhost_canyonrand_kletterer ===
{ambroseFehlt(): -> END}
Dort hängen Leute an der Felswand. Freiwillig, an einem Faden! #sprecher:ambrose #stimmung:ueberrascht
Und ich dachte, ich sei am Brett waghalsig gewesen. #sprecher:ambrose #stimmung:lacht
* [Das nennt man Klettern. #gedanke]
    Das nennt man Leichtsinn mit Ausrüstung. Aber ich sehe gern zu, das gebe ich zu. #sprecher:ambrose #stimmung:lacht
* [Sie sichern sich mit Seilen. #gedanke]
    Ein Opfer mit Rückversicherung also. Vernünftig. Mir ist das nie eingefallen. #sprecher:ambrose #stimmung:laechelt
* [Schau nicht über die Kante. #gedanke]
    Zu spät. Es ist sehr tief und sehr rot, und ich bleibe jetzt hinter dir. #sprecher:ambrose #stimmung:lacht
- -> END

=== blick_wegPinewoodGhost_staubstrasse_telegraf ===
{ambroseFehlt(): -> END}
Telegrafenmasten. Sieh an, ein Stück von meiner Welt, das stehen geblieben ist. #sprecher:ambrose #stimmung:laechelt
Über solche Drähte liefen Nachrichten schneller als jedes Pferd. Wir hielten es für Zauberei. #sprecher:ambrose #stimmung:nachdenklich
* [Heute geht das ohne Draht. #gedanke]
    Ich weiß, ich weiß. Der Telegraf ohne Draht. Lasst einem alten Mann seine Masten. #sprecher:ambrose #stimmung:lacht
* [Da liegt ein alter Planwagen. #gedanke]
    Mit so einem zog man nach Westen, Woche um Woche. Jedes Rad war ein Gebet. #sprecher:ambrose #stimmung:nachdenklich
* [Du bist stiller als sonst. #gedanke]
    Die Straße kommt mir bekannt vor, {held}. Lass mich einen Augenblick mit ihr allein. #sprecher:ambrose #stimmung:still
- -> END

=== blick_wegPinewoodGhost_tankstelle_greifarm ===
{ambroseFehlt(): -> END}
Ein eiserner Arm an einem Schachbrett, mitten im Staub. Er wartet auf einen Gegner, wie es aussieht. #sprecher:ambrose #stimmung:nachdenklich
Das Warten kenne ich. Nur hat er keinen, der ihm zuhört. #sprecher:ambrose #stimmung:still
* [Tut er dir leid? #gedanke]
    Ein wenig. Sag es nicht weiter. Mitleid mit einer Maschine, wo soll das hinführen. #sprecher:ambrose #stimmung:laechelt
* [Er hat keine Augen. #gedanke]
    Und greift doch nie daneben, möchte ich wetten. Ich würde ihn gern einmal eine Figur fallen lassen sehen. #sprecher:ambrose #stimmung:nachdenklich
* [Wer hat ihn hier vergessen? #gedanke]
    Jemand, der etwas Neueres gefunden hat. So geht es Maschinen. Uns Gespenstern übrigens auch. #sprecher:ambrose #stimmung:laechelt
- -> END

=== blick_ghostTown_aussen_fassaden ===
{ambroseFehlt(): -> END}
Die Fassaden sind höher als die Häuser dahinter. Das war schon damals so: Man baute erst den Stolz und dann das Dach. #sprecher:ambrose #stimmung:laechelt
Damals standen hier Maultiere bis ans Ende der Straße. Jetzt höre ich nur den Wind. #sprecher:ambrose #stimmung:still
* [Möchtest du allein sein? #gedanke]
    Nein. Allein war ich hier schon. Bleib ruhig neben mir. #sprecher:ambrose #stimmung:friedlich
* [Es ist nur eine leere Stadt. #gedanke]
    Für dich. Für mich hängt an jedem Pfosten noch ein Hut. #sprecher:ambrose #stimmung:nachdenklich
* [Wir gehen, wann du willst. #gedanke]
    Noch nicht. Ich bin es diesem Ort schuldig, ihn einmal bei Tag anzusehen. #sprecher:ambrose #stimmung:friedlich
- -> END

=== blick_ghostTown_laden_kasse ===
{ambroseFehlt(): -> END}
Die Kasse steht noch, die Waage auch. Nur der Krämer fehlt, und er fehlte selten. #sprecher:ambrose #stimmung:nachdenklich
Er hat mir Kerzen verkauft und dabei mein Brett angesehen, als wäre es ein Hund, der beißt. #sprecher:ambrose #stimmung:laechelt
* [Hat er Schach gespielt? #gedanke]
    Dame, sagte er, und das sei schwer genug. Ein ehrlicher Mann. #sprecher:ambrose #stimmung:lacht
* [Die Regale sind leer. #gedanke]
    Sie waren auch damals nie voll. Was heraufkam, war am selben Tag verkauft. #sprecher:ambrose #stimmung:nachdenklich
* [Geht es dir gut hier? #gedanke]
    Besser, als ich dachte. Es ist nur ein Laden. Das wusste ich vorher nicht. #sprecher:ambrose #stimmung:friedlich
- -> END

=== blick_ghostTown_saloon_klavier ===
{ambroseFehlt(): -> END}
Ein Saloon. Das Klavier ist verstimmt, das höre ich, ohne dass jemand spielt. #sprecher:ambrose #stimmung:laechelt
An dem Tisch dort wurde um Goldstaub gespielt. Karten, nicht Schach. Ich habe mich sehr zurückgehalten. #sprecher:ambrose #stimmung:nachdenklich
* [Du und zurückhalten? #gedanke]
    Ich habe zugesehen und im Kopf mitgespielt. Bei Karten gewinne ich nur, wenn ich nicht mitmache. #sprecher:ambrose #stimmung:lacht
* [Könntest du das Klavier stimmen? #gedanke]
    Mit Händen in einer Stunde. Mein Vater hätte es in einer halben geschafft und dabei geschimpft. #sprecher:ambrose #stimmung:laechelt
* [Hier drin ist es kühl. #gedanke]
    Der einzige kühle Raum der Stadt. Deshalb war er immer voll, sagten die Leute. #sprecher:ambrose #stimmung:lacht
- -> END

=== blick_goldmine_stollen_hacke ===
{ambroseFehlt(): -> END}
Hier unten haben Männer ihr Glück mit der Hacke gesucht, einen Schlag nach dem anderen. #sprecher:ambrose #stimmung:nachdenklich
Die meisten fanden Stein. Und gruben am nächsten Morgen trotzdem weiter. Das achte ich. #sprecher:ambrose #stimmung:friedlich
* [Wie beim Schachlernen. #gedanke]
    Genau so. Viel Stein, ab und zu ein Glanz. Wegen des Glanzes kommt man wieder. #sprecher:ambrose #stimmung:laechelt
* [Hast du je nach Gold gesucht? #gedanke]
    Nur auf dem Brett. Dort lag es auch nicht dichter, aber man blieb sauberer dabei. #sprecher:ambrose #stimmung:lacht
* [Ich mag keine Stollen. #gedanke]
    Ich auch nicht mehr. Bleib dicht bei den Lampen, dann sehen wir beide etwas. #sprecher:ambrose #stimmung:friedlich
- -> END

// ------------------------------------------------------------ Akt 4: Große Seen, Capital Arena, Bayou

=== blick_wegGhostCapital_seeufer_strand ===
{ambroseFehlt(): -> END}
Ein See, so groß, dass er sich für ein Meer hält. Und Leute, die im Sand liegen und nichts tun. #sprecher:ambrose #stimmung:friedlich
Nichtstun als Vergnügen. Das hätte ich früher lernen sollen. #sprecher:ambrose #stimmung:laechelt
* [Dann lern es jetzt. #gedanke]
    Ich übe. Siehst du? Ich stehe hier und will gar nichts. Es geht ganz gut. #sprecher:ambrose #stimmung:friedlich
* [Die Schirme sind gegen die Sonne. #gedanke]
    Zu meiner Zeit trugen nur Damen Schirme gegen die Sonne. Jetzt steckt man sie in den Sand. Auch recht. #sprecher:ambrose #stimmung:lacht
* [Ich wünschte, du könntest schwimmen. #gedanke]
    Ich war ein guter Schwimmer, {held}. Schwimm du eine Runde für mich mit. #sprecher:ambrose #stimmung:friedlich
- -> END

=== blick_wegGhostCapital_leuchtturm_turm ===
{ambroseFehlt(): -> END}
Ein Leuchtturm. Er tut seit jeher dasselbe: Er steht da und zeigt den Schiffen, wo es gefährlich wird. #sprecher:ambrose #stimmung:friedlich
Ein besserer Lehrer als ich. Er redet weniger. #sprecher:ambrose #stimmung:lacht
* [Du redest genau richtig viel. #gedanke]
    Das ist das Freundlichste, was man mir seit 1866 gesagt hat. Und es stimmt nicht. #sprecher:ambrose #stimmung:lacht
* [Du bist auch so einer. #gedanke]
    Dann merk dir: Ein Leuchtturm fährt nie mit. In den Hafen steuert das Schiff allein. #sprecher:ambrose #stimmung:still
* [Das Licht dreht sich immer im Kreis. #gedanke]
    Und findet jedes Mal etwas Neues im Dunkeln. Geduld mit einer Lampe, das gefällt mir. #sprecher:ambrose #stimmung:laechelt
- -> END

=== blick_capitalArena_innenstadt_kaffeebecher ===
{ambroseFehlt(): -> END}
Eine richtige Stadt! Häuser Schulter an Schulter, Läden, ein Stadthaus. Wie New Orleans, nur höher und frisch gewaschen. #sprecher:ambrose #stimmung:froh
Und der Kaffee kommt aus einem Haus, das selbst wie ein Becher aussieht. Man will hier wohl keine Missverständnisse. #sprecher:ambrose #stimmung:lacht
* [Hier findet man sich nie zurecht. #gedanke]
    Doch. In jeder Stadt führt die breiteste Straße zum wichtigsten Haus. Das war schon immer so. #sprecher:ambrose #stimmung:stolz
* [Da führt eine Treppe unter die Erde. #gedanke]
    Zu einer Eisenbahn im Keller, nehme ich an. Ihr vergrabt eure Züge. Ich frage nicht, warum. #sprecher:ambrose #stimmung:ueberrascht
* [Bist du aufgeregt? #gedanke]
    Wie vor meinem ersten Turnier. Sag es niemandem. Es kann dich ja ohnehin keiner fragen. #sprecher:ambrose #stimmung:laechelt
- -> END

=== blick_capitalArena_ubahnhof_zug ===
{ambroseFehlt(): -> END}
Ein Bahnhof unter der Erde, und der Zug ist bemalt wie ein Zirkuswagen. #sprecher:ambrose #stimmung:ueberrascht
Und zwischen den Pfeilern spielen sie Schach, mit Kreide und Klapptischen. Das ist das Schönste, was ich in dieser Stadt gesehen habe. #sprecher:ambrose #stimmung:froh
* [Fast wie ein Kaffeehaus. #gedanke]
    Besser. Im Kaffeehaus spielte man, um gesehen zu werden. Hier spielt man, obwohl es keiner sieht. #sprecher:ambrose #stimmung:friedlich
* [Die spielen irre schnell. #gedanke]
    Ein Zug in einem Atemzug. Meine Gegner hätten in der Zeit ihre Brille geputzt. #sprecher:ambrose #stimmung:lacht
* [Hier unten hallt alles. #gedanke]
    Dann klingt jeder Zug wie ein Paukenschlag. So sollte es immer sein. #sprecher:ambrose #stimmung:froh
- -> END

=== blick_capitalArena_aussen_kuppeln ===
{ambroseFehlt(): -> END}
Kuppeln, Fahnen, eine Treppe für Könige. Und das alles für ein Brettspiel. #sprecher:ambrose #stimmung:stolz
Ich habe es immer gesagt. Es hat mir nur hundertsechzig Jahre lang niemand geglaubt. #sprecher:ambrose #stimmung:lacht
* [Jetzt glauben es alle. #gedanke]
    Dann geh hinein und zeig ihnen, dass sie recht haben. #sprecher:ambrose #stimmung:froh
* [Mir ist schlecht vor Aufregung. #gedanke]
    Gut. Das heißt, es bedeutet dir etwas. Atme, zähl bis vier, und dann stell die eine Frage. #sprecher:ambrose #stimmung:laechelt
* [Hättest du gern hier gespielt? #gedanke]
    Jeden Tag meines Lebens. Aber weißt du was? Zusehen ist schöner, als ich dachte. #sprecher:ambrose #stimmung:friedlich
- -> END

=== blick_capitalArena_halle_fanshop ===
{ambroseFehlt(): -> END}
Neun Bretter, eine Bühne, und alle flüstern. So klingt ein Saal, der weiß, worum es geht. #sprecher:ambrose #stimmung:nachdenklich
Dort drüben verkaufen sie Andenken an ein Turnier, das noch gar nicht vorbei ist. Ihr seid ein zuversichtliches Jahrhundert. #sprecher:ambrose #stimmung:laechelt
* [Soll ich dir etwas kaufen? #gedanke]
    Ein Fähnchen, bitte. Steck es ans Brett. Für meine Verhältnisse war ich nie eitel genug. #sprecher:ambrose #stimmung:lacht
* [Alle schauen her. #gedanke]
    Lass sie schauen. Du siehst nur vierundsechzig Felder. Der Rest ist Tapete. #sprecher:ambrose #stimmung:stolz
* [Bleibst du in der Nähe? #gedanke]
    Ich stehe hinten an der Wand. Du musst mich nicht hören, um zu wissen, dass ich da bin. #sprecher:ambrose #stimmung:friedlich
- -> END

=== blick_bayou_steg_zypressen ===
{ambroseFehlt(): -> END}
Zypressen bis zu den Knien im Wasser, Seerosen, und irgendwo quakt etwas Beleidigtes. Der Bayou. #sprecher:ambrose #stimmung:friedlich
Als Junge hat man mir verboten herzukommen. Also kam ich jede Woche. #sprecher:ambrose #stimmung:lacht
* [Gibt es hier Alligatoren? #gedanke]
    Gewiss. Sie liegen da wie Baumstämme und warten. Niemand spielt geduldiger als sie. #sprecher:ambrose #stimmung:laechelt
* [Was hast du hier gemacht? #gedanke]
    Frösche gefangen und Stellungen in den Schlamm gezeichnet. Der Schlamm hat immer remis gehalten. #sprecher:ambrose #stimmung:lacht
* [Das Wasser ist ganz schwarz. #gedanke]
    Schwarz wie Kaffee mit Zichorie. Man sieht nicht hinein, und gerade deshalb schaut man hin. #sprecher:ambrose #stimmung:nachdenklich
- -> END

// ============================================================ Teil 2: Dinge von heute
//
// Jedes Ding ist ein Blickpunkt an der Stelle, an der es auf der Karte steht; der Kommentar fällt
// einmal im ganzen Spiel, auch wenn es das Ding auf mehreren Karten gibt.

=== blick_desertSprings_aussen_auto ===
{ambroseFehlt(): -> END}
Eine Kutsche, der man die Pferde gestohlen hat. Und sie fährt trotzdem, ich habe es gesehen. #sprecher:ambrose #stimmung:ueberrascht
Der Kutscher sitzt vorn links hinter Glas. Dann friert er wenigstens nicht. #sprecher:ambrose #stimmung:nachdenklich
* [Die Pferde stecken im Motor. #gedanke]
    Wie viele? Hundert? Herrje, und keines wiehert. #sprecher:ambrose #stimmung:lacht
* [Zum Fahren braucht man einen Führerschein. #gedanke]
    Eine Erlaubnis zum Kutschieren. Vernünftig. Ich kannte Kutscher, denen hätte man sie weggenommen. #sprecher:ambrose #stimmung:lacht
- -> END

=== blick_mapleFalls_aussen_lastwagen ===
{ambroseFehlt(): -> END}
Hier stand der Wagen, mit dem ihr gekommen seid. Zehn Räder habe ich gezählt, und dann aufgehört. Zu meiner Zeit hatte ein reicher Mann vier, und zwei davon quietschten. #sprecher:ambrose #stimmung:ueberrascht
* [Darin waren alle unsere Sachen. #gedanke]
    Ein ganzes Leben auf zehn Rädern. Und nichts ist zerbrochen? Dann achte ich den Kutscher. #sprecher:ambrose #stimmung:laechelt
* [Das war noch ein kleiner. #gedanke]
    Ein kleiner! Herrje. Dann möchte ich dem großen lieber nicht begegnen. #sprecher:ambrose #stimmung:lacht
- -> END


=== blick_riverton_bahnhofshalle_getraenkeautomat ===
{ambroseFehlt(): -> END}
Ein Schrank, der Limonade verkauft, ganz ohne Krämer. Wem sagt man hier Guten Tag? #sprecher:ambrose #stimmung:ueberrascht
* [Niemandem. Man wirft Geld ein. #gedanke]
    Und er gibt richtig heraus? Dann ist er ehrlicher als mancher Wirt, den ich kannte. #sprecher:ambrose #stimmung:lacht
* [Welche würdest du nehmen? #gedanke]
    Die mit der grünen Aufschrift, rein aus Neugier. Trink sie für mich und sag mir, wonach sie schmeckt. #sprecher:ambrose #stimmung:laechelt
- -> END

=== blick_siliconBay_akademie_kaffeeautomat ===
{ambroseFehlt(): -> END}
Kaffee auf Knopfdruck, in einem Becher aus Papier. Ich bin ein höflicher Mann, also sage ich nur: Er ist heiß. #sprecher:ambrose #stimmung:streng
* [Schmecken tut er nicht. #gedanke]
    Das dachte ich mir. Guter Kaffee braucht jemanden, der ihn mit Sorgfalt kocht. #sprecher:ambrose #stimmung:laechelt
* [Dafür geht es schnell. #gedanke]
    Schnell. Als wäre das Warten auf den Kaffee nicht der halbe Genuss. #sprecher:ambrose #stimmung:nachdenklich
- -> END

=== blick_wegDesertSummit_diner_neonschild ===
{ambroseFehlt(): -> END}
Schrift aus Licht, gebogen wie von einem Glasbläser. Bei uns hing ein gemaltes Brett an der Tür, und abends sah man es nicht mehr. #sprecher:ambrose #stimmung:ueberrascht
Jetzt findet man das Wirtshaus noch um Mitternacht. Ob das ein Fortschritt ist, mögen die Wirte entscheiden. #sprecher:ambrose #stimmung:lacht
* [Das nennt man Neon. #gedanke]
    Neon. Es klingt wie ein Stern, und es sieht auch so aus. #sprecher:ambrose #stimmung:laechelt
* [Nachts sieht man es meilenweit. #gedanke]
    Ein Leuchtturm für Hungrige. Das ist die erste Erfindung, die ich sofort begreife. #sprecher:ambrose #stimmung:lacht
- -> END

=== blick_riverton_aussen_handyladen ===
{ambroseFehlt(): -> END}
Ein ganzer Laden voller Taschenspiegel mit Stimmen. Und die Leute stehen davor wie wir früher vor dem Juwelier. #sprecher:ambrose #stimmung:ueberrascht
* [Jeder hat so eins. #gedanke]
    Jeder trägt die halbe Welt in der Tasche und schaut darin nach dem Wetter. Ich hatte dafür ein Fenster. #sprecher:ambrose #stimmung:lacht
* [Damit kann man auch Schach spielen. #gedanke]
    Ich weiß. Mit jemandem am anderen Ende des Landes, ohne Brief und ohne Warten. Das hätte mir gefallen. Sehr sogar. #sprecher:ambrose #stimmung:still
- -> END

=== blick_siliconBay_akademie_bildschirmtisch ===
{ambroseFehlt(): -> END}
Man tippt, und die Figur gleitet. Kein Gewicht, kein Filz, kein Zögern in der Hand. #sprecher:ambrose #stimmung:nachdenklich
Eine Figur ohne Gewicht kann man nicht noch einen Augenblick festhalten, bevor man sie loslässt. Mir würde das fehlen. #sprecher:ambrose #stimmung:nachdenklich
* [Dafür fällt nie eine Figur um. #gedanke]
    Eben. Mir ist einmal ein König vom Tisch gerollt, und der ganze Saal hat gelacht. Es war ein guter Abend. #sprecher:ambrose #stimmung:laechelt
* [Mir fehlt das Holz auch. #gedanke]
    Dann sind wir zwei. Holz merkt sich die Hände, die es angefasst haben. #sprecher:ambrose #stimmung:nachdenklich
- -> END

=== blick_mapleFalls_wohnzimmer_fernseher ===
{ambroseFehlt(): -> END}
Ein schwarzer Spiegel auf einem Schränkchen. Darin wohnen Bilder, die sich bewegen, sagst du? #sprecher:ambrose #stimmung:ueberrascht
Ich glaube dir. Ich wohne in einem Schachbrett, ich habe kein Recht zu zweifeln. #sprecher:ambrose #stimmung:lacht
* [Abends laufen da Filme. #gedanke]
    Theater im Wohnzimmer, ohne Kutsche und ohne Garderobe. Deine Zeit ist bequem, das muss man ihr lassen. #sprecher:ambrose #stimmung:laechelt
* [Er ist noch gar nicht angeschlossen. #gedanke]
    Dann warten wir beide darauf, dass etwas geschieht. Darin bin ich gut. #sprecher:ambrose #stimmung:lacht
- -> END

=== blick_mapleFalls_wohnzimmer_kuehlschrank ===
{ambroseFehlt(): -> END}
Ein Schrank mit eigenem Winter. Bei uns kam das Eis in Stroh gepackt mit dem Schiff aus dem Norden und kostete ein Vermögen. #sprecher:ambrose #stimmung:ueberrascht
* [Und das Licht geht von allein an. #gedanke]
    Und woher weiß man, dass es wieder ausgeht, wenn die Tür zu ist? Siehst du. Man glaubt es einfach. #sprecher:ambrose #stimmung:lacht
* [Da ist nur Saft drin. #gedanke]
    Kalter Saft, wann immer man will. In New Orleans hätte ein Bankier dafür seinen Hut gegeben. #sprecher:ambrose #stimmung:laechelt
- -> END

=== blick_mapleFalls_diner_jukebox ===
{ambroseFehlt(): -> END}
Ein Musikant im Kasten. Man wirft eine Münze ein, und er spielt, ohne Pause und ohne Durst. #sprecher:ambrose #stimmung:ueberrascht
Mein Vater hätte ihn aufgeschraubt, um nachzusehen, wo das Klavier steckt. #sprecher:ambrose #stimmung:lacht
* [Da steckt kein Klavier drin. #gedanke]
    Kein Klavier, kein Musikant? Dann ist es Zauberei, und ich frage nicht weiter. #sprecher:ambrose #stimmung:ueberrascht
* [Welches Lied würdest du wählen? #gedanke]
    Einen Walzer. Aber ich fürchte, den hat der Kasten nicht mehr. #sprecher:ambrose #stimmung:nachdenklich
- -> END

=== blick_siliconBay_hafen_faehre ===
{ambroseFehlt(): -> END}
Die Fähre dort: kein Schaufelrad, kein Kessel, kein Heizer mit schwarzem Gesicht. Sie brummt nur und fährt. #sprecher:ambrose #stimmung:nachdenklich
Ein Dampfer hat geschnauft wie ein Tier. Man wusste, dass er sich anstrengt. Das hier ist höflicher, aber ich traue ihm weniger. #sprecher:ambrose #stimmung:laechelt
* [Dafür ist sie pünktlich. #gedanke]
    Pünktlich. Ein Dampfer kam, wenn der Fluss es erlaubte. Man lernte Geduld oder Kartenspielen. #sprecher:ambrose #stimmung:lacht
* [Magst du sie trotzdem? #gedanke]
    Sie schwimmt, und sie hat eine Reling. Ja. Mehr verlange ich von einem Schiff nicht. #sprecher:ambrose #stimmung:laechelt
- -> END

=== blick_bayou_steg_luftboot ===
{ambroseFehlt(): -> END}
Ein Boot mit einer Windmühle am Heck. Es fährt nicht durchs Wasser, es fährt darüber hinweg. #sprecher:ambrose #stimmung:ueberrascht
Die Alligatoren müssen sehr beleidigt sein. #sprecher:ambrose #stimmung:lacht
* [Es ist furchtbar laut. #gedanke]
    Dann hört man es wenigstens kommen. Ein höfliches Ungeheuer. #sprecher:ambrose #stimmung:lacht
* [Willst du mitfahren? #gedanke]
    Unbedingt. Ich halte meinen Hut fest, und du hältst das Brett fest. #sprecher:ambrose #stimmung:froh
- -> END

=== blick_siliconBay_lobby_aufzug ===
{ambroseFehlt(): -> END}
Ein Zimmer, das die Treppe steigt, damit man selbst es nicht muss. Und es spielt Musik dazu, falls man sich fürchtet. #sprecher:ambrose #stimmung:ueberrascht
* [Fürchtest du dich? #gedanke]
    Ich bin ein Geist in einem fahrenden Schrank. Die Frage ist, wer sich vor wem fürchtet. #sprecher:ambrose #stimmung:lacht
* [Acht Stockwerke in zehn Sekunden. #gedanke]
    So schnell ist bei uns niemand aufgestiegen, nicht einmal im Rang. Und Musik gab es auch keine. #sprecher:ambrose #stimmung:lacht
- -> END

=== blick_riverton_bahnhofshalle_abfahrtsmonitor ===
{ambroseFehlt(): -> END}
Eine Tafel, die sich selbst umschreibt. Bei uns kam ein Mann mit Kreide und Leiter, und er war nie pünktlicher als die Züge. #sprecher:ambrose #stimmung:ueberrascht
„Fünf Minuten später“, steht dort. Dieses Wort haben sie also auch behalten. #sprecher:ambrose #stimmung:bitter
* [Das ist doch nur ein Wort. #gedanke]
    Für die meisten. Ich habe einmal sehr lange an diesem Wort gewartet. #sprecher:ambrose #stimmung:still
* [Fünf Minuten sind nicht schlimm. #gedanke]
    Nein. Fünf Minuten nicht. Achte nur darauf, dass es bei fünf Minuten bleibt. #sprecher:ambrose #stimmung:nachdenklich
- -> END


=== blick_wegPinewoodGhost_staubstrasse_solarpaneel ===
{ambroseFehlt(): -> END}
Ein Tisch, der in der Sonne liegt und davon satt wird. Er fängt Licht wie ein Fass den Regen. #sprecher:ambrose #stimmung:ueberrascht
Kein Kessel, kein Rauch, kein Lärm. Man sieht ihm nichts an, und am Ende hat er doch gewonnen. So spielen die Geduldigen. #sprecher:ambrose #stimmung:nachdenklich
* [Das macht Strom aus Sonne. #gedanke]
    Und die Sonne schickt keine Rechnung? Dann ist es das beste Geschäft, von dem ich je gehört habe. #sprecher:ambrose #stimmung:lacht
* [Hier scheint sie ja immer. #gedanke]
    In der Tat. Dieses Land hat mehr Sonne als Leute. Endlich weiß jemand etwas damit anzufangen. #sprecher:ambrose #stimmung:laechelt
- -> END

=== blick_wegSummitCrossroads_praerie_strommast ===
{ambroseFehlt(): -> END}
Drähte von Horizont zu Horizont. Aber sie tragen keine Nachrichten, sagst du, sondern Kraft? #sprecher:ambrose #stimmung:ueberrascht
Kraft mit der Post. Und niemand muss sie abholen. Ich setze mich einen Augenblick. #sprecher:ambrose #stimmung:lacht
* [Setz dich ruhig. #gedanke]
    Danke. Ich schwebe ein wenig über dem Gras, aber die Absicht zählt. #sprecher:ambrose #stimmung:laechelt
* [Ohne Strom geht heute nichts. #gedanke]
    Bei uns ging ohne Kerzen nichts. Man gewöhnt sich an jedes Licht, scheint mir. #sprecher:ambrose #stimmung:nachdenklich
- -> END

=== blick_crossroads_aussen_zapfsaeule ===
{ambroseFehlt(): -> END}
Eine Tränke für Wagen. Sie trinken etwas, das stinkt, und laufen danach hundert Meilen. #sprecher:ambrose #stimmung:nachdenklich
Ein Pferd wollte Hafer, Wasser und ein gutes Wort. Das hier will nur Geld. Einfacher ist es, das gebe ich zu. #sprecher:ambrose #stimmung:lacht
* [Autos bekommen kein gutes Wort. #gedanke]
    Das erklärt, warum sie so mürrisch brummen. #sprecher:ambrose #stimmung:lacht
* [Manche fahren schon mit Strom. #gedanke]
    Mit dem, was durch die Drähte kommt? Dann trinken sie Blitze. Ich nehme das Pferd. #sprecher:ambrose #stimmung:ueberrascht
- -> END

=== blick_wegIronwoodSilicon_glasbruecke_laptop ===
{ambroseFehlt(): -> END}
Ein Buch, das leuchtet und sich selbst umblättert. Und die Schrift macht nie einen Klecks. #sprecher:ambrose #stimmung:ueberrascht
Der Schreiber meines Vaters hätte dafür seinen Federhalter verschenkt. Er hatte eine sehr schlechte Handschrift. #sprecher:ambrose #stimmung:lacht
* [Damit schreibt man Briefe in Sekunden. #gedanke]
    In Sekunden. Und wie lange dauert es, bis einem etwas einfällt, das sich zu schreiben lohnt? Siehst du. #sprecher:ambrose #stimmung:lacht
* [Man kann alles wieder löschen. #gedanke]
    Ein Zug, den man zurücknehmen darf. Am Brett wäre das unehrenhaft. Im Brief wäre es mir oft lieb gewesen. #sprecher:ambrose #stimmung:nachdenklich
- -> END


=== blick_crossroads_raststaette_spielautomat ===
{ambroseFehlt(): -> END}
Ein Glücksspiel ohne Gegenüber. Man verliert, und keiner zieht den Hut. #sprecher:ambrose #stimmung:streng
Dann lieber Schach. Da verliert man wenigstens gegen jemanden. #sprecher:ambrose #stimmung:laechelt
* [Manche spielen stundenlang daran. #gedanke]
    Gegen einen Kasten, der nie müde wird und nie gratuliert. Die Armen. #sprecher:ambrose #stimmung:nachdenklich
* [Einmal probieren? #gedanke]
    Behalte deine Münzen. Wenn du verlieren willst, spiel gegen mich. Das kostet nichts. #sprecher:ambrose #stimmung:stolz
- -> END


=== blick_wegIronwoodSilicon_glasbruecke_funkmast ===
{ambroseFehlt(): -> END}
Ein Kirchturm ohne Kirche. Und er läutet nicht, er flüstert, mit allen Taschenspiegeln zugleich. #sprecher:ambrose #stimmung:nachdenklich
Der Telegraf ohne Draht. Ich verstehe ihn nicht, aber ich ziehe den Hut. #sprecher:ambrose #stimmung:laechelt
* [Darüber läuft das Internet. #gedanke]
    Alle Briefe der Welt auf einmal durch die Luft. Hoffentlich stoßen sie nicht zusammen. #sprecher:ambrose #stimmung:lacht
* [Du hörst ihn nicht flüstern, oder? #gedanke]
    Nein. Und das ist mir recht. Ich höre schon genug, was nicht für mich bestimmt ist. #sprecher:ambrose #stimmung:laechelt
- -> END

=== blick_steinbruch_grube_bagger ===
{ambroseFehlt(): -> END}
Ein eiserner Arm mit einer Hand, so groß wie ein Ruderboot. Er hebt in einer Stunde, wofür wir dreißig Männer und eine Woche brauchten. #sprecher:ambrose #stimmung:ueberrascht
Ich hoffe, die dreißig Männer haben jetzt Zeit für etwas Schöneres. #sprecher:ambrose #stimmung:nachdenklich
* [Einer sitzt drin und lenkt. #gedanke]
    Ein Mann, der dreißig ersetzt, und er sitzt dabei. Ich weiß nicht, ob ich ihn beneide oder bedaure. #sprecher:ambrose #stimmung:nachdenklich
* [Er sieht aus wie ein Tier. #gedanke]
    Wie ein eiserner Reiher, der im Schlamm nach etwas sucht. Nur weniger anmutig. #sprecher:ambrose #stimmung:lacht
- -> END

=== blick_siliconBay_hafen_hafenkran ===
{ambroseFehlt(): -> END}
Bei uns trugen Männer die Säcke über eine Planke, einer hinter dem anderen, und sangen dabei. #sprecher:ambrose #stimmung:nachdenklich
Der Kran singt nicht. Dafür fällt ihm auch nichts ins Wasser. #sprecher:ambrose #stimmung:laechelt
* [Was haben sie gesungen? #gedanke]
    Lieder mit vielen Strophen und wenig Anstand. Ich habe als Junge heimlich mitgesungen. #sprecher:ambrose #stimmung:lacht
* [Der Kran ist schneller. #gedanke]
    Gewiss. Aber ein Hafen ohne Gesang ist nur ein Lager am Wasser. #sprecher:ambrose #stimmung:nachdenklich
- -> END

=== blick_wegGhostCapital_seeufer_eiswagen ===
{ambroseFehlt(): -> END}
Gefrorene Sahne, an jeder Ecke, für ein paar Münzen. In meiner Stadt war Eis ein Fest, das man lange vorher ankündigte. #sprecher:ambrose #stimmung:ueberrascht
* [Welche Sorte würdest du nehmen? #gedanke]
    Vanille. Am Brett bin ich ein Romantiker, aber beim Nachtisch ein vorsichtiger Mann. #sprecher:ambrose #stimmung:lacht
* [Ich esse eins für dich mit. #gedanke]
    Das ist wahre Freundschaft. Iss langsam und beschreib es mir. #sprecher:ambrose #stimmung:friedlich
- -> END

=== blick_cedarCreek_waschsalon_radio ===
{ambroseFehlt(): -> END}
Eine Stimme aus einer Schachtel, und der Mann dazu sitzt in einer anderen Stadt. Er weiß nicht einmal, dass ich zuhöre. #sprecher:ambrose #stimmung:ueberrascht
Aber das weiß bei mir ja niemand. #sprecher:ambrose #stimmung:laechelt
* [Ich höre dich ja. #gedanke]
    Ja. Und das genügt mir, stelle ich fest. #sprecher:ambrose #stimmung:laechelt
* [Im Radio kommt auch Musik. #gedanke]
    Ein Orchester in einer Schachtel. Wo sitzen die alle? Sag nichts, ich will es mir vorstellen. #sprecher:ambrose #stimmung:lacht
- -> END

=== blick_mapleFalls_clubraum_schachuhr ===
{ambroseFehlt(): -> END}
Eine Uhr mit zwei Gesichtern. Man gibt jedem Spieler seine eigene Zeit und nimmt sie ihm dann wieder weg. #sprecher:ambrose #stimmung:ueberrascht
Zu meiner Zeit konnte ein Herr zwei Stunden über einem Zug sitzen. Wir nannten es Denken. Der Gegner nannte es anders. #sprecher:ambrose #stimmung:lacht
* [Wie lange hast du überlegt? #gedanke]
    Nie lange. Ich war zu ungeduldig, um jemanden zu ärgern. Leider auch zu ungeduldig für manche Stellung. #sprecher:ambrose #stimmung:nachdenklich
* [Mit Uhr ist es gerechter. #gedanke]
    Gerechter, gewiss. Und grausamer. Ich mag sie und fürchte sie, wie jeden guten Gegner. #sprecher:ambrose #stimmung:laechelt
- -> END

// ============================================================ Teil 3: Weitere Stellen
//
// Mehrere Stellen je Karte (Wunsch des Autors, 24.11.2026): was es neben dem ersten Blickpunkt
// einer Karte noch zu bestaunen gibt.

=== blick_cedarCreek_aussen_briefkasten ===
{ambroseFehlt(): -> END}
Ein Kasten für Briefe, an jedem Haus einer. Der Bote kommt also bis vor die Tür? #sprecher:ambrose #stimmung:ueberrascht
Ich musste für jeden Brief zum Postamt laufen. Und dann wieder, um nachzusehen, ob einer gekommen war. #sprecher:ambrose #stimmung:nachdenklich
* [Heute kommt fast nur Werbung. #gedanke]
    Briefe, die niemand bestellt hat? Dann ist der Kasten geduldiger als ich. #sprecher:ambrose #stimmung:lacht
* [Hast du viele Briefe bekommen? #gedanke]
    Genug. Auf die wichtigen habe ich immer am längsten gewartet. #sprecher:ambrose #stimmung:still
* [Schreibst du gern? #gedanke]
    Sehr. Ein Brief ist ein Zug, den man in Ruhe machen darf. #sprecher:ambrose #stimmung:laechelt
- -> END

=== blick_mapleFalls_aussen_spielplatz ===
{ambroseFehlt(): -> END}
Ein Gerüst, nur damit Kinder darauf klettern. Und eine Rutsche aus Blech. #sprecher:ambrose #stimmung:ueberrascht
Wir hatten dafür Bäume und Dächer, und danach gab es Ärger. #sprecher:ambrose #stimmung:lacht
* [Bist du oft heruntergefallen? #gedanke]
    Zweimal. Beim zweiten Mal habe ich beschlossen, lieber Schach zu lernen. #sprecher:ambrose #stimmung:lacht
* [Ärger gibt es hier auch. #gedanke]
    Gut. Manche Dinge sollen sich nicht ändern. #sprecher:ambrose #stimmung:laechelt
* [Für die Schaukel bin ich zu alt. #gedanke]
    Niemand ist zu alt für eine Schaukel. Ich bin es bis heute nicht. #sprecher:ambrose #stimmung:froh
- -> END

=== blick_mapleFalls_park_wasserfall ===
{ambroseFehlt(): -> END}
Da ist er also, der Fall, nach dem die Stadt heißt. Kein Riese, aber er gibt sich Mühe. #sprecher:ambrose #stimmung:laechelt
Fallendes Wasser klingt in jedem Jahrhundert gleich. Das ist tröstlich. #sprecher:ambrose #stimmung:nachdenklich
* [Er rauscht den ganzen Tag. #gedanke]
    Und die ganze Nacht, wenn keiner zuhört. So etwas nenne ich Pflichtgefühl. #sprecher:ambrose #stimmung:lacht
* [Woran denkst du? #gedanke]
    An ein Mühlrad am Fluss. Davor saß ich als Junge und habe Züge im Kopf gespielt. #sprecher:ambrose #stimmung:nachdenklich
* [Ich mag das Geräusch. #gedanke]
    Ich auch. Dabei kann man denken, ohne dass es still wird. #sprecher:ambrose #stimmung:laechelt
- -> END

=== blick_kuerbishof_hof_traktor ===
{ambroseFehlt(): -> END}
Ein eisernes Zugpferd. Es frisst keinen Hafer und scheut vor nichts. #sprecher:ambrose #stimmung:ueberrascht
* [Das ist ein Traktor. #gedanke]
    Traktor. Es klingt, wie er aussieht: breit und entschlossen. #sprecher:ambrose #stimmung:lacht
* [Er zieht mehr als zehn Pferde. #gedanke]
    Zehn! Und er will am Abend nicht gestriegelt werden? Der Bauer ist zu beneiden. #sprecher:ambrose #stimmung:laechelt
* [Pferde sind trotzdem schöner. #gedanke]
    Gewiss. Aber ein Pferd hat seinen eigenen Kopf. Dieses hier widerspricht wenigstens nicht. #sprecher:ambrose #stimmung:lacht
- -> END

=== blick_riverton_aussen_zebrastreifen ===
{ambroseFehlt(): -> END}
Weiße Streifen auf der Straße, und die Wagen halten davor an. Wer hat ihnen das beigebracht? #sprecher:ambrose #stimmung:ueberrascht
* [Das ist ein Zebrastreifen. #gedanke]
    Nach dem gestreiften Tier? Ich sehe es. Ihr habt mehr Humor, als ich dachte. #sprecher:ambrose #stimmung:lacht
* [Wer zu Fuß geht, darf zuerst. #gedanke]
    Der Mann zu Fuß vor dem Wagen. Das hätte bei uns kein Kutscher geglaubt. #sprecher:ambrose #stimmung:laechelt
* [Nicht alle halten an. #gedanke]
    Dann schau zweimal. Erst sehen, dann ziehen, auf der Straße wie am Brett. #sprecher:ambrose #stimmung:streng
- -> END

=== blick_riverton_bahnhofshalle_rollkoffer ===
{ambroseFehlt(): -> END}
Ein Koffer mit Rädern. Herrje. Warum ist darauf zu meiner Zeit niemand gekommen? #sprecher:ambrose #stimmung:ueberrascht
Ich habe meinen an einem Riemen geschleppt und drei Träger bezahlt. #sprecher:ambrose #stimmung:nachdenklich
* [Manche haben sogar vier Räder. #gedanke]
    Vier! Dann läuft der Koffer besser als mancher Reisende. #sprecher:ambrose #stimmung:lacht
* [Was war in deinem Koffer? #gedanke]
    Ein Schachbrett, ein Rasiermesser und zwei Hemden. In dieser Reihenfolge der Wichtigkeit. #sprecher:ambrose #stimmung:lacht
* [Träger gibt es kaum noch. #gedanke]
    Schade um die Träger. Sie wussten immer, welcher Zug Verspätung hatte. #sprecher:ambrose #stimmung:nachdenklich
- -> END

=== blick_lockport_aussen_lastkahn ===
{ambroseFehlt(): -> END}
Ein Lastkahn, breit und flach wie eine Bratpfanne. Diese Sorte Schiff kenne ich. #sprecher:ambrose #stimmung:laechelt
Sie fahren nie schnell und kommen immer an. Ich habe lange gebraucht, um das zu achten. #sprecher:ambrose #stimmung:nachdenklich
* [Du magst lieber schnelle Schiffe. #gedanke]
    Ich mochte lieber schnelle Angriffe. Aber der Kahn ist noch da, und mancher Angriff nicht. #sprecher:ambrose #stimmung:lacht
* [Was hat er wohl geladen? #gedanke]
    Kohle, Korn oder Kies, möchte ich wetten. Ein Kahn fährt nichts spazieren, was glänzt. #sprecher:ambrose #stimmung:laechelt
* [So einer hat es nie eilig. #gedanke]
    Nein. Und er schämt sich nicht dafür. Ich könnte von ihm lernen. #sprecher:ambrose #stimmung:laechelt
- -> END

=== blick_ironwood_aussen_schranke ===
{ambroseFehlt(): -> END}
Ein Schlagbaum, der sich von allein hebt und senkt. Kein Wärter zieht am Seil. #sprecher:ambrose #stimmung:ueberrascht
* [Früher stand da jemand? #gedanke]
    Ein Mann mit Mütze und sehr lauter Stimme. Er kannte jeden Fuhrmann beim Vornamen. #sprecher:ambrose #stimmung:laechelt
* [Die Schranke irrt sich nie. #gedanke]
    Das sagt man von vielen Maschinen. Ich schaue trotzdem selbst nach links und rechts. #sprecher:ambrose #stimmung:nachdenklich
* [Davor muss man warten. #gedanke]
    Warten, schon wieder. Dieses Jahrhundert verlangt mir einiges ab. #sprecher:ambrose #stimmung:lacht
- -> END

=== blick_siliconBay_aussen_foodtruck ===
{ambroseFehlt(): -> END}
Eine Garküche auf Rädern. Sie kommt zu den Hungrigen, statt auf sie zu warten. #sprecher:ambrose #stimmung:laechelt
* [Das ist ein Foodtruck. #gedanke]
    Bei uns schob man einen Karren mit Austern durch die Gassen. Der Gedanke ist derselbe, nur der Karren ist gewachsen. #sprecher:ambrose #stimmung:lacht
* [Was würdest du essen? #gedanke]
    Alles, was dampft. Ich habe hundertsechzig Jahre Appetit aufgespart. #sprecher:ambrose #stimmung:froh
* [Die Schlange ist lang. #gedanke]
    Ein gutes Zeichen. Vor einer schlechten Küche steht niemand an. #sprecher:ambrose #stimmung:laechelt
- -> END

=== blick_portDelacroix_aussen_rohbau ===
{ambroseFehlt(): -> END}
Ein Haus, das erst zur Hälfte da ist. Man sieht noch, wie es gemeint ist. #sprecher:ambrose #stimmung:nachdenklich
So gefällt mir die Stadt am besten: beim Wiederaufstehen. #sprecher:ambrose #stimmung:laechelt
* [Das dauert noch lange. #gedanke]
    Ein Haus ist wie eine lange Partie. Man baut Zug um Zug, und irgendwann steht es. #sprecher:ambrose #stimmung:laechelt
* [Wird es wieder wie früher? #gedanke]
    Nein. Es wird, wie die Leute es jetzt brauchen. Das ist besser als früher. #sprecher:ambrose #stimmung:nachdenklich
* [Ich würde gern helfen. #gedanke]
    Dann frag, wo ein Brett zu tragen ist. Bretter tragen kannst du, das weiß ich. #sprecher:ambrose #stimmung:lacht
- -> END

=== blick_desertSprings_aussen_motel ===
{ambroseFehlt(): -> END}
Ein Gasthaus, in dem jeder Gast seinen Wagen vor der eigenen Zimmertür abstellt. #sprecher:ambrose #stimmung:ueberrascht
Bei uns kam das Pferd in den Stall und der Gast an den Tisch. Hier schlafen beide Tür an Tür. #sprecher:ambrose #stimmung:lacht
* [Das nennt man Motel. #gedanke]
    Ein kurzes Wort für ein langes Haus. Es passt. #sprecher:ambrose #stimmung:laechelt
* [Hier kennt keiner den anderen. #gedanke]
    An der Straße ist das eine Gnade. Man erzählt sich mehr, wenn man sich nie wiedersieht. #sprecher:ambrose #stimmung:nachdenklich
* [Die Türen sehen alle gleich aus. #gedanke]
    Dann merk dir die Nummer. Ich bin einmal im falschen Zimmer aufgewacht, und es war dem Herrn dort nicht recht. #sprecher:ambrose #stimmung:lacht
- -> END

=== blick_jahrmarkt_festplatz_karussell ===
{ambroseFehlt(): -> END}
Ein Karussell! Das kenne ich. Bei uns lief ein Maultier im Kreis und zog es, bis ihm schwindlig war. #sprecher:ambrose #stimmung:froh
* [Heute dreht es ein Motor. #gedanke]
    Dann hat das Maultier endlich frei. Ich gönne es ihm von Herzen. #sprecher:ambrose #stimmung:lacht
* [Bist du mal mitgefahren? #gedanke]
    Auf einem hölzernen Schimmel, mit sieben Jahren. Ich habe mich gefühlt wie ein Springer. #sprecher:ambrose #stimmung:laechelt
* [Die Pferde gehen auf und ab. #gedanke]
    Aber keines kommt je voran. Hübsch anzusehen, doch am Brett hätte ich dafür keine Verwendung. #sprecher:ambrose #stimmung:lacht
- -> END

=== blick_pinewoodCamp_aussen_kanu ===
{ambroseFehlt(): -> END}
Ein Kanu. Endlich ein Boot, das sich nicht verändert hat: ein Rumpf, ein Paddel, ein nasser Ärmel. #sprecher:ambrose #stimmung:froh
* [Kannst du paddeln? #gedanke]
    Leidlich. Ich bin öfter im Kreis gefahren als geradeaus, aber sehr würdevoll. #sprecher:ambrose #stimmung:lacht
* [Es kippt leicht um. #gedanke]
    Wie eine Stellung mit dem König in der Mitte. Man sitzt still und hofft. #sprecher:ambrose #stimmung:laechelt
* [Morgen fahre ich damit raus. #gedanke]
    Tu das. Ich bleibe am Ufer und gebe Ratschläge. Darin habe ich Übung. #sprecher:ambrose #stimmung:lacht
- -> END

=== blick_capitalArena_aussen_hochhaus ===
{ambroseFehlt(): -> END}
Ich zähle die Fenster dieses Hauses und komme nicht ans Ende. Wohnt darin ein ganzes Dorf? #sprecher:ambrose #stimmung:ueberrascht
* [Das ist ein Hochhaus. #gedanke]
    Ein Dorf, das man aufrecht gestellt hat. Praktisch. Aber wo ist der Dorfplatz? #sprecher:ambrose #stimmung:nachdenklich
* [Oben hat man eine tolle Aussicht. #gedanke]
    Das glaube ich. Und einen langen Weg zum Briefkasten. #sprecher:ambrose #stimmung:lacht
* [In der Stadt ist wenig Platz. #gedanke]
    Dann baut man eben in die Luft. Die kostet nichts, das war schon immer so. #sprecher:ambrose #stimmung:laechelt
- -> END

=== blick_capitalArena_innenstadt_taxi ===
{ambroseFehlt(): -> END}
Eine gelbe Mietkutsche. Die kenne ich, nur hatten unsere einen Kutscher mit Zylinder und ein müdes Pferd. #sprecher:ambrose #stimmung:laechelt
* [Das ist ein Taxi. #gedanke]
    Man hebt die Hand, und es hält? Dann hat sich wenigstens das nicht geändert. #sprecher:ambrose #stimmung:froh
* [Eine Uhr darin zählt das Geld. #gedanke]
    Eine Uhr, die mitrechnet. Unser Kutscher hat den Preis nach dem Hut des Fahrgasts geschätzt. #sprecher:ambrose #stimmung:lacht
* [Wir gehen lieber zu Fuß. #gedanke]
    Ein weiser Entschluss. Zu Fuß verpasst man nichts, und es kostet nur Schuhe. #sprecher:ambrose #stimmung:laechelt
- -> END

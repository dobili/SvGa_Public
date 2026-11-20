// Abzweig Hochebene an Weg 7 (Akt 4, Szene 82 der Story-Bibel, Landschaft L9, O5, Weltbeschreibung
// 5.9): Felstürme und eine gewöhnliche Schule mit Turnhalle, Bushaltestelle und Werkstatt.
//
// Die Vell-Familien sind erfunden: Familien, die seit über hundert Jahren auf der Hochebene leben
// und ein eigenes Spiel auf dem Schachbrett haben, „Falke und Bison“ (V5, Seirawan-Grundlage: Falke
// = Läufer + Springer, Bison = Turm + Springer). Leitplanken (O5, Antwort des Autors zu Q21-1):
// keine realen Gemeinschaften, Orte, Zeremonien oder Symbole; keine Federn, Kostüme, „weise Alte“
// oder Naturmystik; die Figuren sind Menschen von heute mit Berufen, Humor und eigener Meinung.
// Die Herkunft des Spiels ist Familiengeschichte, kein heiliges Wissen. Vor der Veröffentlichung
// liest jemand aus einer indigenen Gemeinschaft gegen (Sensibilitätslesung).
//
// Figuren: Kira Vell (13, Schülerin, am Steintisch bei den Felstürmen), Annek Vell (Lehrerin) und
// Joss Vell (Mechaniker) an der Schule. Quest hochebene.falkeUndBison: Kira erklärt das Spiel,
// {held} bringt Annek Schach bei, Kira schenkt den Falken aus Holz (Fund falkeAusHolz).
// Variante: „Falke und Bison“ ist noch nicht gebaut (VARIANTE-FEHLT); Kira zeigt eine kurze
// Partie und vertröstet auf das nächste Mal.
// Einstiege wie in orte.json: zurueck, kira, annek, joss, steintisch, werkstatt, aushang.
// Variablen: alle setzt diese Datei; den Fund merkt sie sich selbst (falkeGeschenkt).

// Runde 11 (13.11.2026): Kapitel 47 nach dem Roman (roman/akt4_teil1.md): „Die kennst du nicht“,
// Kira gewinnt in vierzehn Zügen, Ambrose entzückt („Man lernt sie. Spiel noch eine.“), der Falke
// als verschnittenes Werkstück.

EXTERNAL gibFund(kennung)

VAR held = "Du"
VAR kiraGetroffen = false
VAR annekGetroffen = false
VAR annekSchachGelernt = false
VAR jossGetroffen = false
VAR falkeGeschenkt = false
VAR varianteFalkeUndBisonGelernt = false
// Aus capital-arena-aussen.ink: Nach dem Abschied (Szene 109) spricht Ambrose nicht mehr
// (Story-Bibel Abschnitt 33, Frage 5; Entscheidung Q21-5). Hier nur gelesen.
VAR abschiedGesehen = false
// Zähl-Merker der Sammelstücke (Chaos-Prüfung, 14.11.2026): gesetzt erst zusammen mit dem
// Zähler und dem Fund, damit Abbrechen oder Neuladen kein Stück verliert.
VAR seite03Gezaehlt = false
VAR finchTurmBGezaehlt = false

// ---------------------------------------------------------------- Kira am Steintisch

=== kira ===
{
- not kiraGetroffen: -> kira_regel
- annekSchachGelernt and not falkeGeschenkt: -> kira_geschenk
- else: -> kira_alltag
}

=== kira_regel ===
~ kiraGetroffen = true
~ varianteFalkeUndBisonGelernt = true
Am Fuß der Felstürme steht ein flacher Steintisch. Ein Mädchen mit Schulrucksack und Basketball unter dem Arm stellt Figuren auf ein abgegriffenes Brett. #sprecher:erzaehler
Die kennst du nicht. Das hier ist fast Schach. Nur besser. #sprecher:kira #stimmung:froh
Ich bin Kira. Der Bus fährt in einer halben Stunde, das reicht für eine Erklärung. #sprecher:kira #stimmung:laechelt
* [„Was sind das für Figuren?“]
- Sie hebt zwei Figuren hoch, die nicht in dein Schachspiel gehören: einen Vogel mit eckigen Flügeln und ein breites Tier mit gesenktem Kopf. #sprecher:erzaehler
Der Falke zieht wie ein Läufer oder springt wie ein Springer. Der Bison zieht wie ein Turm oder springt wie ein Springer. #sprecher:kira #stimmung:neutral
Man setzt sie ein, wenn eine Figur von der Grundreihe zum ersten Mal zieht. Dann landen sie auf dem Feld, das frei wird. #sprecher:kira #stimmung:neutral
Bei uns heißt das Spiel einfach Falke und Bison. Meine Urgroßmutter hat die zwei geschnitzt, in einem Winter, als die Straße zugeschneit war und dem Schulschach zwei Figuren fehlten. #sprecher:kira #stimmung:laechelt
Den Falken, weil über den Felstürmen immer einer kreist. Den Bison, weil ihr Bruder so stur war. Sagt jedenfalls meine Oma. #sprecher:kira #stimmung:lacht
-> kira_vorfuehren

=== kira_vorfuehren ===
Kira zeigt es dir an einer kurzen Partie. Du ziehst vorsichtig, sie zieht schnell. #sprecher:erzaehler
Sie schlägt dich in vierzehn Zügen. Der Falke kommt aus einer Richtung, mit der du nicht rechnest, und dann aus einer anderen. #sprecher:erzaehler
Das passiert allen beim ersten Mal. Mein Cousin hat ein Jahr gebraucht. #sprecher:kira #stimmung:laechelt
{not abschiedGesehen:
    Ich würde dir gern erklären, wie man dagegen spielt. Aber ich weiß es nicht. Ich sehe diese Figuren zum ersten Mal. #sprecher:ambrose #stimmung:froh
    Ich habe gelernt, dass man Spiele nicht erklärt. Man lernt sie. Spiel noch eine. #sprecher:ambrose #stimmung:froh
}
// VARIANTE-FEHLT: Falke und Bison (L9). Bis es gebaut ist, nur die Regel, die Vorführung und eine Vertröstung.
Der Bus! Eine richtige Partie, wenn du wiederkommst. Und frag meine Tante in der Schule, die will Schach lernen. Sagt sie seit zehn Jahren. #sprecher:kira #stimmung:ueberrascht
-> END

=== kira_geschenk ===
~ falkeGeschenkt = true
Kira kommt vom Bus gerannt. #sprecher:erzaehler
Tante Annek hat erzählt, dass du ihr Schach beigebracht hast. Sie hat beim Abendessen nur noch von Springern geredet. #sprecher:kira #stimmung:lacht
Sie drückt dir einen Falken in die Hand, aus hellem Holz, kleiner als die auf dem Tisch. Die Flügel sind noch nicht ganz fertig. #sprecher:erzaehler
Werkstück. Den hab ich verschnitten. Aber er zieht trotzdem. #sprecher:kira #stimmung:laechelt
~ gibFund("falkeAusHolz")
-> END

=== kira_alltag ===
{~Mein Cousin sagt, Schach ist Falke und Bison für Leute ohne Fantasie. Ich sag, es ist Falke und Bison mit weniger Figuren.|Ich will Basketball-Trainerin werden. Oder Ingenieurin. Oder beides.|Wenn du wiederkommst, spielen wir richtig. Mit Uhr. Ich hab eine.} #sprecher:kira #stimmung:laechelt
+ [„Erklär mir die Regeln noch einmal.“]
    Falke: Läufer oder Springer. Bison: Turm oder Springer. Einsetzen, wenn eine Figur von der Grundreihe zum ersten Mal zieht. Fertig. #sprecher:kira #stimmung:laechelt
    -> END
+ [„Bis bald, Kira.“]
    -> END

// ---------------------------------------------------------------- Annek an der Schule

=== annek ===
{
- not annekGetroffen: -> annek_erstes_treffen
- kiraGetroffen and not annekSchachGelernt: -> annek_schach
- else: -> annek_alltag
}

=== annek_erstes_treffen ===
~ annekGetroffen = true
Vor der Schule wirft eine Frau in Trainingsjacke Körbe. Sie trifft dreimal hintereinander und tut so, als wäre das normal. #sprecher:erzaehler
Annek Vell. Mathematik und Sport, und dienstags Busaufsicht. Suchst du jemanden? #sprecher:annek #stimmung:laechelt
{kiraGetroffen:
    -> annek_schach
- else:
    Wenn du ein Brett im Rucksack hast, geh zu den Felstürmen. Meine Nichte sitzt da jeden Nachmittag und gewinnt gegen alle. #sprecher:annek #stimmung:laechelt
    -> END
}

=== annek_schach ===
~ annekSchachGelernt = true
Kira hat dich also schon verlieren lassen. Gut. Dann bist du dran. #sprecher:annek #stimmung:lacht
Ich wollte immer Schach lernen. Aber jeder, der es mir erklären wollte, hat nach fünf Minuten von Eröffnungen geredet. #sprecher:annek #stimmung:nachdenklich
Ihr setzt euch vor die alte Scheune, über deren Tor „Turnhalle“ steht. Du stellst die Figuren auf und erklärst, eine nach der anderen. #sprecher:erzaehler
* [Mit dem Springer anfangen]
- Annek nimmt den Springer in die Hand und lässt ihn über die Bauern hüpfen. #sprecher:erzaehler
Euer Springer springt wie unser Falke. Nur feiger. Er darf danach nicht weiterfliegen. #sprecher:annek #stimmung:lacht
Und der Turm ist ein Bison, der das Springen verlernt hat. Armes Tier. #sprecher:annek #stimmung:lacht
Nach einer Viertelstunde spielt sie ihre erste Partie. Sie verliert, lacht und baut sofort neu auf. #sprecher:erzaehler
{not abschiedGesehen:
    Zwei Spiele auf demselben Brett. Ich dachte immer, es gäbe nur eins. #sprecher:ambrose #stimmung:friedlich
}
-> END

=== annek_alltag ===
// Vor der Schachstunde nur der Hinweis auf Kira: Die übrigen Sätze setzen voraus, dass Annek schon spielt.
{not annekSchachGelernt:
    Kira sitzt an den Felstürmen, bis der Bus kommt. Sie erklärt dir das Spiel, ob du willst oder nicht. #sprecher:annek #stimmung:laechelt
    -> END
}
{~Ich habe meiner Klasse heute das Springerproblem gegeben. Ein Feld nach dem anderen, ohne eins zweimal. Sie hassen mich.|Kira sagt, ich spiele Schach wie Basketball. Ich glaube, das ist ein Kompliment.|Wenn der Bus wieder streikt, rufe ich Joss. Der repariert alles außer schlechter Laune.} #sprecher:annek #stimmung:lacht
-> END

// ---------------------------------------------------------------- Joss in der Werkstatt

=== joss ===
{jossGetroffen: -> joss_alltag}
~ jossGetroffen = true
Neben der Schule steht eine offene Werkstatt. Unter dem Schulbus schauen zwei Stiefel hervor. #sprecher:erzaehler
Moment! #sprecher:joss #stimmung:ueberrascht
Ein Mann rollt auf einem Brett hervor, Öl an der Stirn. #sprecher:erzaehler
Joss Vell. Ich halte den Bus am Leben, die Traktoren und die Heizung der Schule. Alles, was älter ist als ich. #sprecher:joss #stimmung:laechelt
* [Zuhören]
- Letztes Jahr war einer von Perfect Move hier. Anzug, neue Schuhe. Er wollte eine App aus Falke und Bison machen. Mit Bewertung nach jedem Zug. #sprecher:joss #stimmung:nachdenklich
Ich hab ihm gesagt: Bei uns sagt dir nach jedem Zug die Großtante, was du falsch gemacht hast. Das reicht. #sprecher:joss #stimmung:lacht
Er hat nicht gelacht. Seine Schuhe waren danach auch nicht mehr neu. Hier oben ist alles Staub. #sprecher:joss #stimmung:lacht
{not abschiedGesehen:
    Ein Mann, der weiß, was er nicht verkauft. Selten. #sprecher:ambrose #stimmung:laechelt
}
-> END

=== joss_alltag ===
{annekSchachGelernt:
    {~Schach? Zu viele Regeln für zu wenig Figuren. Aber Annek hat jetzt ein Brett im Lehrerzimmer. Ich verliere jeden Mittag.|Der Bus braucht einen neuen Anlasser. Der Anlasser braucht ein Wunder.|Kira hat den Falken im Werkunterricht gemacht. Besser als meiner damals. Sag ihr das nicht.} #sprecher:joss #stimmung:lacht
- else:
    {~Schach? Zu viele Regeln für zu wenig Figuren. Bei Falke und Bison gibt es wenigstens Tiere.|Der Bus braucht einen neuen Anlasser. Der Anlasser braucht ein Wunder.} #sprecher:joss #stimmung:lacht
}
-> END

// ---------------------------------------------------------------- Gegenstände

=== steintisch ===
{kiraGetroffen:
    Auf dem Steintisch sind die Felder eingeritzt, halb verwittert. Daneben hat jemand mit Kreide „Kira 14, Cousin 3“ geschrieben. #sprecher:erzaehler
- else:
    Ein flacher Stein wie ein Tisch, mit eingeritzten Feldern. Acht mal acht. #sprecher:erzaehler
}
-> END

=== werkstatt ===
{~In der Werkstatt hängen Schraubenschlüssel nach Größe sortiert. Ein Radio spielt leise.|Auf der Werkbank liegt ein halb geschnitzter Bison neben einem Vergaser.|An der Wand ein Kalender mit dem Spielplan der Schulmannschaft.} #sprecher:erzaehler
-> END

=== aushang ===
Am Schwarzen Brett der Schule hängen Zettel: „Basketball dienstags“, „Busfahrplan Sommer“ und „Falke-und-Bison-Turnier der Schule, Anmeldung bei Frau Vell“. #sprecher:erzaehler
{annekSchachGelernt:
    Darunter, ganz neu und mit Filzstift: „Schach-AG, freitags. Anfänger willkommen. Die Lehrerin auch.“ #sprecher:erzaehler
}
-> END

// ---------------------------------------------------------------- Rückweg

=== zurueck ===
Die Schotterstraße führt zurück nach Summit City. Hinter dir kreist ein Falke über den Felstürmen. #sprecher:erzaehler
-> END

// >>> Runde 6 (mittel-4)
VAR finchFiguren = 0
VAR buchseiten = 0
EXTERNAL beginneAufgaben(runde)
VAR diplomBegonnen = false
VAR diplomFertig = false
VAR diplomBestanden = false
VAR gefundenSeite03 = false
VAR gefundenFinchTurmB = false
VAR ambroseSprichtWieder = false

// ---------------------------------------------------------------- Ereignis: Das Bauerndiplom (Dokument 15, 2.9)
// Nach der Begegnung mit den Vells, sobald Annek Schach gelernt hat. Vorher hängt nur das Plakat
// „Diplomtag“ auf dem Schulhof. Die Aufgabenwahl je Kind (drei Aufgaben zur Wahl) kommt mit einer
// eigenen Partieform; bis dahin stellt Annek eine Aufgabenrunde (hochebene.diplom).
// Buchbezug der Aufgabenwahl: Kapitel 12 (Trainingsmethodik), nicht Kapitel 3 wie in Dokument 15; die
// Buchseite Kapitel 3 (Gambits) an der Fahnenstange ist ein eigener Fund.

=== ereignis_diplom ===
{
- not annekSchachGelernt:
    Auf dem Plakat steht „Diplomtag – bald!“. Drei Steintische warten schon mit Brettern. #sprecher:erzaehler
    -> END
- diplomFertig:
    Kira hat ihr Diplom an die Tribüne geklebt. Mit Falke und Bison. #sprecher:erzaehler
    -> END
- diplomBestanden: -> diplom_ende
- diplomBegonnen: -> diplom_nochmal
}
-> diplom_start

=== diplom_start ===
~ diplomBegonnen = true
Heute ist Diplomtag. Und ich bin selbst noch Anfängerin. Willst du Prüfer sein? #sprecher:annek #stimmung:laechelt
Drei Kinder, drei Aufgaben. Such jedem eine aus, die es schaffen kann. Nicht die schwerste. #sprecher:annek #stimmung:nachdenklich
Die Diplome hab ich gemalt! Mit Falke und Bison. #sprecher:kira #stimmung:laechelt
-> diplom_runde

// Wiederkehr nach der Runde (Rückmeldung, Wunsch des Autors, 19.11.2026): Vorher startete die Runde
// ohne Wahl sofort neu, nach einem Fehlversuch also gleich noch einmal.
=== diplom_nochmal ===
Ein Kind ist an seiner Aufgabe hängen geblieben. Vielleicht war sie doch zu schwer. #sprecher:annek #stimmung:nachdenklich
Such noch einmal aus. Nicht die schwerste, weißt du noch? #sprecher:annek #stimmung:laechelt
+ [Noch einmal prüfen]
    -> diplom_runde
+ [„Später.“]
    Die Kinder warten. Sie spielen so lange Falke und Bison. #sprecher:kira #stimmung:lacht
    -> END

=== diplom_runde ===
~ beginneAufgaben("hochebene.diplom")
-> END

=== diplom_ende ===
{diplomFertig: -> END}
~ diplomFertig = true
Alle drei haben bestanden. Und ich habe auch etwas gelernt. #sprecher:annek #stimmung:laechelt
Eins hab ich extra gemalt. Für den Prüfer. #sprecher:kira #stimmung:laechelt
~ gibFund("diplomKira")
{ambroseSprichtWieder:
    {not abschiedGesehen:
        Drei Diplome, und die Lehrerin lernt mit. Zu meiner Zeit hätte man das für Unordnung gehalten. #sprecher:ambrose #stimmung:lacht
    }
}
-> END

// ---------------------------------------------------------------- Funde und Ansehen

=== seite03 ===
{seite03Gezaehlt:
    Am Fuß der Fahnenstange ist nichts mehr. #sprecher:erzaehler
    -> END
}
Am Fuß der Fahnenstange flattert eine lose Seite im Wind, voller Schachdiagramme. #sprecher:erzaehler
~ seite03Gezaehlt = true
~ buchseiten = buchseiten + 1
~ gibFund("seite03")
-> END

=== finch_turm_b ===
{finchTurmBGezaehlt:
    In der Kiste liegen nur Bälle und Seilchen. #sprecher:erzaehler
    -> END
}
Auf der Kiste mit den Sportgeräten ist ein Fink aus Kreide gemalt. Zwischen den Bällen liegt ein weißer Turm aus Buchsbaum. #sprecher:erzaehler
~ finchTurmBGezaehlt = true
~ finchFiguren = finchFiguren + 1
~ gibFund("finchTurmB")
-> END

=== pferd ===
Am Zaun steht ein braunes Pferd und frisst Heu. Es schaut dich an, als würde es gleich über den Zaun springen. Tut es aber nicht. #sprecher:erzaehler
-> END

=== schild_schule ===
Ein Wegweiser: „Schule 400 m“. Jemand hat einen kleinen Bison darunter gemalt. #sprecher:erzaehler
-> END

=== bus ===
Der gelbe Schulbus. Auf der Rückbank liegt ein vergessenes Taschenschach. #sprecher:erzaehler
-> END
// <<< Runde 6 (mittel-4)

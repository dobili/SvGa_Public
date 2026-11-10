// Weg 6 von Port Delacroix nach Desert Springs: Karten „Canyonpfad“ und „Felsbogen“ (Akt 3,
// Szenen 71 bis 73 der Story-Bibel, Abschnitt 19.5).
//
// Stationen (W4): Wanderin Mrs. Holloway mit einer Weisheit (Kapitel 1, Abschnitt 1.6),
// Rätseltafel am Wanderschild (Runde wegDelacroixDesert.tafel, drei Königsangriffe), Mira auf
// ihrem Stein (Szene 72, Hauptquest desertSprings.versoehnung), die Versöhnung am Felsbogen
// (Szene 73, R29 endet: die Quest gibt erst hier den Mentor-Zug aus Port Delacroix), Funde Eidechsenhaut und Nieten J. H. an der Canyonbrücke.
// Einstiege wie in orte.json: holloway, zurueck_delacroix, tafel, fund_eidechsenhaut, mira_stein,
// versoehnung, fund_nieten. Die Ankunft erzählt desert-springs-aussen.ankunft_zu_fuss.
//
// Ambrose spricht nur, wenn er nach den Nachfahren wieder redet (ambroseSprichtWieder); die
// Versöhnung setzt die Variable in jedem Fall. Die Funde gibt gibFund; Ink merkt sie sich
// zusätzlich selbst. Variablen: wegDelacroixDesertTafelBestanden setzt die Hülle (R42),
// versoehnungGesehen und miraSteinGesehen setzt diese Datei.

EXTERNAL beginneAufgaben(runde)
EXTERNAL gibFund(kennung)
EXTERNAL beginneGedaechtnis(kennung)

VAR held = "Du"
VAR ambroseSprichtWieder = false
VAR wegDelacroixDesertTafelBestanden = false
VAR hollowayGetroffen = false
VAR miraSteinGesehen = false
VAR versoehnungGesehen = false
VAR eidechsenhautGefunden = false
VAR nietenCanyonGefunden = false
VAR gefundenNietenkopf = false

// ---------------------------------------------------------------- Mrs. Holloway

=== holloway ===
{hollowayGetroffen:
    {~Trink Wasser. Mehr als du denkst.|Der Roadrunner war heute schon dreimal hier. Er hat einen Plan.} #sprecher:holloway
    -> END
}
~ hollowayGetroffen = true
Unter einem Felsvorsprung sitzt eine Frau mit breitem Hut im Schatten und teilt ihr Wasser mit einer Eidechse. #sprecher:erzaehler
Holloway. Ich wandere hier seit vierzig Jahren. Die Wüste lehrt Geduld und Angriff. #sprecher:holloway
Wer angreift, braucht mehr Figuren am König als der Verteidiger. Kapitel 1, Abschnitt 1.6. #sprecher:holloway
{ambroseSprichtWieder:
    Ich war nie in einer Wüste. Sie ist so still wie ein Club. #sprecher:ambrose
}
-> END

// ---------------------------------------------------------------- Rätseltafel und Rückweg

=== tafel ===
{wegDelacroixDesertTafelBestanden:
    Auf dem Wanderschild hat jemand mit Kreide einen kleinen Kaktus gemalt. Darunter: „Gelöst“. #sprecher:erzaehler
    -> END
}
Am Wanderschild „Desert Springs, 4 Meilen“ hängt eine Tafel mit drei Diagrammen: „Der König steht im Freien. Greif an!“ #sprecher:erzaehler
* [Die Aufgaben lösen]
    ~ beginneAufgaben("wegDelacroixDesert.tafel")
    -> END
* [Weitergehen]
    -> END

=== zurueck_delacroix ===
Der Pfad führt zurück zum einsamen Bahnhof. Der nächste Zug fährt nach Port Delacroix. #sprecher:erzaehler
-> END

// ---------------------------------------------------------------- Mira auf dem Stein

=== mira_stein ===
{miraSteinGesehen:
    Der flache Stein ist leer. Im Staub sieht man noch die Abdrücke eines Bretts. #sprecher:erzaehler
    -> END
}
~ miraSteinGesehen = true
Mitten im Canyon sitzt ein Mädchen auf einem flachen Stein und spielt gegen sich selbst. #sprecher:erzaehler
Sie schiebt ihre Dame mitten zwischen die schwarzen Figuren und opfert sie. Dann grinst sie. #sprecher:erzaehler
{ambroseSprichtWieder:
    Sie spielt wie ich mit zwanzig. Nur besser. #sprecher:ambrose #stimmung:froh
}
Wer bist du? Bist du gut? #sprecher:mira
Dann komm morgen in die Garage am Motel. #sprecher:mira
-> END

// ---------------------------------------------------------------- Die Versöhnung

=== versoehnung ===
{
- versoehnungGesehen:
    Unter dem Felsbogen pfeift der Wind durch die alte Eisenbahnbrücke. #sprecher:erzaehler
    -> END
- not miraSteinGesehen:
    Der Felsbogen wirft einen kurzen Schatten. Es ist noch früh am Tag. Hinten im Canyon klappern Figuren. #sprecher:erzaehler
    -> END
}
-> versoehnung_abend

=== versoehnung_abend ===
~ versoehnungGesehen = true
~ ambroseSprichtWieder = true
Am Felsbogen wird das Licht am Abend rot wie Kupfer. Du bleibst stehen. #sprecher:erzaehler
{held}. Ich muss dich um etwas bitten. #sprecher:ambrose #pause
Ich habe einer Maschine zugesehen, weil sie nie zweifelt. Aber ich habe vergessen, dass du zweifelst. #sprecher:ambrose
Und trotzdem spielst. Das ist schöner. Verzeih mir. #sprecher:ambrose #stimmung:still
* [„Ich hab dich vermisst.“]
    Ich dich auch. Ein Geist, der jemanden vermisst. Das hätte ich mir nicht träumen lassen. #sprecher:ambrose #stimmung:lacht
* [„Du warst ein Idiot.“]
    Ja. Ein alter Idiot. Das ist die schlimmste Sorte. #sprecher:ambrose #stimmung:lacht
* [„Erzähl mir von 1866.“]
    Das ist die Frage, die ich am meisten fürchte. Und die ich am liebsten beantworte. #sprecher:ambrose
- Josiah Hale schrieb mir, ich solle kommen. Wir wollten unsere Partie zu Ende spielen. #sprecher:ambrose
Ich brach auf, und unterwegs wurde ich krank. #sprecher:ambrose #stimmung:traurig
Ich bin nicht angekommen. Darum warte ich noch. #sprecher:ambrose #stimmung:traurig
-> versoehnung_lektion

=== versoehnung_lektion ===
Er zeigt dir mit dem alten Brett zwei Stellungen nebeneinander: einmal ein Opfer, das trägt, einmal eines, das scheitert. #sprecher:erzaehler
Ein Opfer ist schön, wenn genug Figuren mitkommen. Das ist die Goldene Angriffsregel, Kapitel 1, Abschnitt 1.6. #sprecher:ambrose
Morphy wusste das. Er opferte nur, wenn seine Figuren schon bereitstanden. Kapitel 11, Abschnitt 11.2. #sprecher:ambrose
Ab jetzt spielen wir wieder zusammen. Aber du entscheidest. #sprecher:ambrose #stimmung:froh
Den Mentor-Zug aus Port Delacroix habe ich dir aufgehoben. Jetzt darfst du ihn spielen. #sprecher:ambrose
-> END

// ---------------------------------------------------------------- Funde

=== fund_eidechsenhaut ===
{eidechsenhautGefunden:
    Zwischen den Steinen sonnt sich eine Eidechse. Sie hat eine neue Haut. #sprecher:erzaehler
    -> END
}
~ eidechsenhautGefunden = true
Zwischen zwei Steinen liegt eine Eidechsenhaut, dünn wie Papier und ganz heil. #sprecher:erzaehler
~ gibFund("eidechsenhaut")
{ambroseSprichtWieder:
    Sie hat sich aus der alten Haut befreit. Manchmal muss man das. #sprecher:ambrose
}
-> END

=== fund_nieten ===
{nietenCanyonGefunden:
    Die Nieten der Brücke glänzen in der Sonne, Reihe um Reihe. #sprecher:erzaehler
    -> END
}
~ nietenCanyonGefunden = true
Unter dem Felsbogen läuft eine alte Eisenbahnbrücke. Auf jeder Niete stehen dieselben Buchstaben: J. H. #sprecher:erzaehler
~ gibFund("nietenCanyonbruecke")
{gefundenNietenkopf:
    Wie auf dem Nietenkopf von der Brücke bei Ironwood. #sprecher:erzaehler
}
{versoehnungGesehen:
    Hale hat weitergebaut. Bis hierher. Er hat gelebt, lange. Gut so. #sprecher:ambrose #stimmung:still
- else:
    Ambrose sagt nichts. Aber du spürst, dass er hinsieht. #sprecher:erzaehler
}
-> END

// >>> Runde 6 (mittel-4)
VAR finchFiguren = 0
VAR buchseiten = 0
VAR hatLaterne = false
VAR sternwarteOffen = false
VAR seilschaftBegonnen = false
VAR seilschaftFertig = false
VAR wegDelacroixDesertSeilschaftBestanden = false
VAR gefundenSeite06 = false
VAR gefundenFinchLaeuferB = false

// ---------------------------------------------------------------- Ereignis: Die Seilschaft (Dokument 15, 2.7)
// Erst nach der Versöhnung (Akt 3, bei der Rückkehr). Vorher liegen nur Seile, Rucksäcke und ein Kreidebeutel
// am Wandfuß. Gedächtnisstellung wegDelacroixDesert.seilschaft (partieformen.json): Ferris zeigt oben die Stellung
// fünf Sekunden, {held} baut sie aus dem Gedächtnis auf; bestanden setzt wegDelacroixDesertSeilschaftBestanden.

=== ereignis_seilschaft ===
{not versoehnungGesehen:
    Am Fuß der Wand liegen zwei Rucksäcke, ein Kreidebeutel und ein Seil, das nach oben führt. Niemand ist zu sehen. #sprecher:erzaehler
    -> END
}
{seilschaftFertig:
    Wren winkt von unten, Sol von weit oben. Das Seil ist straff. #sprecher:erzaehler
    -> END
}
{wegDelacroixDesertSeilschaftBestanden: -> seilschaft_ende}
{seilschaftBegonnen: -> seilschaft_runde}
-> seilschaft_start

=== seilschaft_start ===
~ seilschaftBegonnen = true
Zwei Kletterinnen hängen in der Wand am Felsbogen, eine unten, eine hoch oben. Zwischen ihnen pfeift der Wind. #sprecher:erzaehler
Wir spielen eine Partie, ein Zug pro Seillänge. Aber ich höre Sol nicht mehr! #sprecher:wren
Ich zeige dir oben die Stellung. Merk sie dir und ruf sie Wren zu! #sprecher:ferris
-> seilschaft_runde

=== seilschaft_runde ===
Schau genau hin. Unten sieht Wren das Brett nicht. #sprecher:ferris
~ beginneGedaechtnis("wegDelacroixDesert.seilschaft")
-> END

=== seilschaft_ende ===
{seilschaftFertig: -> END}
~ seilschaftFertig = true
Das Echo trägt deine Züge durch den Canyon. Unten nickt Wren, oben jubelt Sol. #sprecher:erzaehler
Du hast die Stellung im Kopf behalten. Hier, der gehört dir. Er hält mehr, als er wiegt. #sprecher:wren
~ gibFund("karabiner")
{ambroseSprichtWieder:
    Blind spielen heißt: das Brett tragen, ohne es zu sehen. #sprecher:ambrose
}
-> END

// ---------------------------------------------------------------- Funde am Felsbogen

=== seite06 ===
{gefundenSeite06:
    Unter dem Bogen ist nur noch Sand. #sprecher:erzaehler
    -> END
}
~ gefundenSeite06 = true
Unter dem Felsbogen klemmt eine Buchseite zwischen zwei Steinen. Oben steht: Kapitel 6, Mittelspielstrategie. #sprecher:erzaehler
~ gibFund("seite06")
~ buchseiten = buchseiten + 1
-> END

=== finch_laeufer_b ===
{gefundenFinchLaeuferB:
    Im Felsspalt ist nur noch das Finkenzeichen aus Kreide. #sprecher:erzaehler
    -> END
}
~ gefundenFinchLaeuferB = true
Neben einem kleinen Fink aus Kreide steckt etwas im Felsspalt: ein weißer Läufer aus Buchsbaum. #sprecher:erzaehler
Unter seinem Fuß ist ein Feld eingebrannt. #sprecher:erzaehler
~ gibFund("finchLaeuferB")
~ finchFiguren = finchFiguren + 1
-> END

// ---------------------------------------------------------------- Sperre S9: Abzweig zur Sternwarte
// Öffnet mit Laterne und Versöhnung (13_Wegenetz, S9). Der Dialog setzt sternwarteOffen, die Hülle
// prüft danach `wenn` am Übergang.

=== sternwarte_abzweig ===
{
- hatLaterne and versoehnungGesehen:
    ~ sternwarteOffen = true
    Die Laterne zeigt den schmalen Pfad zwischen dem Geröll. Oben auf der Felsnase schimmert eine weiße Kuppel. #sprecher:erzaehler
- not versoehnungGesehen:
    Geröll liegt quer über dem Pfad nach oben. Allein und mit dem Streit im Kopf will {held} hier nicht klettern. #sprecher:erzaehler
- else:
    Der Pfad zur Felsnase führt steil zwischen Geröll hinauf, und es wird schon dunkel. Ohne Licht ist das zu gefährlich. #sprecher:erzaehler
}
-> END
// <<< Runde 6 (mittel-4)

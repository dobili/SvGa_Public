// Erinnerung: London, 1851 (Akt 2, Szene 35 der Story-Bibel; Flashback F1 bis F3).
// Ort erinnerungLondon (art erinnerung): Sepia, der Held ist Ambrose mit zwanzig Jahren, kein
// Tagebuch, keine Münzen. Karten: erinnerungLondon.strand (Straße am Strand) und
// erinnerungLondon.kaffeehaus. Hinein führt die große Uhr in der Bahnhofshalle von Riverton
// (riverton-bahnhofshalle.uhr mit reise), hinaus die Uhr im Kaffeehaus (rueckkehr).
//
// Einstiege wie in orte.json: zeitungsjunge, kellner, zeitungsleser (Figuren), droschke,
// schachtisch (Gegenstände), rueckkehr (Dialog-Auslöser), kaffeehaus_betreten (Übergang zur Tür).
// Am schachtisch beginnt das Zugerraten der Unsterblichen Partie (Runde riverton.flashbackLondon,
// klassik-unsterbliche, mit Weiß ab Zug 17); die Quest riverton.flashbackLondon startet weiter an
// der großen Uhr in Riverton.
// Sprecher: Ambrose als junger Mann (#sprecher:ambrose #stimmung:jung); {held} erscheint nur als
// Stimme aus der Gegenwart, als Erzählzeile mit dem Namen. Tabakrauch nur als Wort.
// Variablen: flashbackLondonBestanden setzt die Hülle (R42).

EXTERNAL beginneAufgaben(runde)
EXTERNAL reise(karte, ausloeser)

VAR held = "Du"
VAR flashbackLondonBestanden = false
VAR londonKaffeehausGesehen = false
VAR zeitungsjungeGesehen = false

// ---------------------------------------------------------------- Strand

=== zeitungsjunge ===
{zeitungsjungeGesehen:
    {~Extra! Die Weltausstellung im Glaspalast! Ein Penny, Sir!|Schachturnier in London, die besten Spieler der Welt! Lesen Sie alles darüber!} #sprecher:zeitungsjunge
    -> END
}
~ zeitungsjungeGesehen = true
Ein Junge mit Schirmmütze schwenkt eine Zeitung über dem Kopf. Der Wind trägt den Geruch der Themse heran. #sprecher:erzaehler
Extra! Extra! #sprecher:zeitungsjunge
Die ganze Welt kommt nach London, zur großen Ausstellung! Und zum Schachturnier! #sprecher:zeitungsjunge
Ein Turnier. Die besten Spieler der Welt, in einer Stadt. #sprecher:ambrose #stimmung:jung
Und ich bin hier, um Klavierholz zu kaufen. #sprecher:ambrose
Ganz fern, wie durch Wasser, hört Ambrose eine Stimme: „Ambrose? Wo sind wir?“ Es ist {held}. #sprecher:erzaehler #pause
London, 1851. Bleib bei mir, {held}. Ich zeige dir, was ich sah. #sprecher:ambrose
-> END

=== droschke ===
Eine Droschke wartet am Straßenrand, das Pferd schnaubt in der kalten Luft. Der Kutscher schläft unter seinem Hut. #sprecher:erzaehler
Mein Vater nahm immer die Droschke. Ich ging lieber zu Fuß, da sieht man mehr. #sprecher:ambrose #stimmung:jung
-> END

=== kaffeehaus_betreten ===
{londonKaffeehausGesehen:
    Die Tür des Kaffeehauses, das Glöckchen bimmelt. #sprecher:erzaehler
    -> END
}
~ londonKaffeehausGesehen = true
Hinter der Tür: Kaffeeduft, Stimmengewirr, das Rascheln von Zeitungen und ein wenig Tabakrauch unter der Decke. #sprecher:erzaehler
Hier spielen sie. Mein Vater sagt, ich soll nicht lange bleiben. #sprecher:ambrose #stimmung:jung
Ich bleibe lange. #sprecher:ambrose
-> END

// ---------------------------------------------------------------- Kaffeehaus

=== kellner ===
Ein Kellner mit weißer Schürze balanciert ein Tablett mit Tassen zwischen den Tischen. #sprecher:erzaehler
{~Kaffee, junger Herr? Oder wollen Sie nur zusehen wie alle anderen?|Leise bitte, die Herren am Ecktisch spielen.|Herr Anderssen ist aus Breslau. Er spielt, als hätte er keine Angst vor nichts.} #sprecher:kellner
-> END

=== zeitungsleser ===
Ein älterer Herr hält eine Zeitung so groß wie ein Tischtuch und sieht nicht auf. #sprecher:erzaehler
{~Das Turnier? Dummes Zeug. Ich lese den Börsenbericht.|Der Deutsche am Ecktisch verliert gleich alles. Sehen Sie nur, er gibt seine Figuren weg.|Junger Mann, Sie stehen in meinem Licht.} #sprecher:zeitungsleser
-> END

=== schachtisch ===
{flashbackLondonBestanden:
    Am Ecktisch stellen die beiden Herren die Figuren wieder auf. Niemand redet. #sprecher:erzaehler
    Alle wissen, was sie gesehen haben. #sprecher:erzaehler
    Ich bin danach eine Stunde durch London gelaufen und habe nichts gesehen. Nur diese Partie. #sprecher:ambrose #stimmung:jung
    -> END
}
Am Ecktisch spielen zwei Herren. Der eine ruhig, mit Bart: Herr Anderssen. #sprecher:erzaehler
Der andere elegant und laut: Herr Kieseritzky. #sprecher:erzaehler
Die Zuschauer stehen dicht. Ambrose drängt sich in die zweite Reihe und hält den Atem an. #sprecher:erzaehler
Anderssen hat schon einen Läufer gegeben. Jetzt will er mehr geben. Viel mehr. #sprecher:ambrose #stimmung:jung
Spiel mit mir, {held}. Du hast Weiß, wie er. #sprecher:ambrose
Bei jedem Zug frage ich dich: Was hättest du getan? #sprecher:ambrose
* [Zusehen und mitraten]
    ~ beginneAufgaben("riverton.flashbackLondon")
    -> END
* [Noch einen Moment warten]
    Die Uhr an der Wand tickt. Die Partie wartet nicht ewig, aber eine Weile. #sprecher:erzaehler
    -> END

// ---------------------------------------------------------------- Rückkehr

=== rueckkehr ===
Eine große Uhr an der Wand des Kaffeehauses. Ihr Ticken klingt genau wie das der Bahnhofsuhr in Riverton. #sprecher:erzaehler
{flashbackLondonBestanden:
    Er gab beide Türme und die Dame. Und gewann. #sprecher:ambrose
    Das nannten sie später die Unsterbliche. #sprecher:ambrose
    Diese Maschinen würden das nie spielen. Oder doch? #sprecher:ambrose #stimmung:fern
    Was wäre, wenn sie meine Partie spielen könnten? Die, die ich nie zu Ende brachte? #sprecher:ambrose #stimmung:fern
- else:
    Noch nicht, {held}. Erst sollst du sehen, was am Ecktisch geschieht. #sprecher:ambrose
}
* [Zurück in die Gegenwart]
    Die Uhr schlägt. Das Kaffeehaus verblasst, und du stehst wieder in der Bahnhofshalle von Riverton. #sprecher:erzaehler
    {flashbackLondonBestanden:
        Juno sieht dich an. „Du bist ganz still. Alles gut?“ #sprecher:erzaehler
    }
    ~ reise("riverton.bahnhofshalle", "grosseUhr")
    -> END
* [Noch bleiben]
    -> END

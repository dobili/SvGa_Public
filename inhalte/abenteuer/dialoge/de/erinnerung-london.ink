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
// Runde 11 (13.11.2026): an den Roman angeglichen (akt2_teil2.md, Kapitel 21): Anderssen als
// Mathematiklehrer aus Breslau, Kieseritzky gibt Unterricht; keine Turnierpartie; nach dem Matt
// läuft Kieseritzky zum Telegrafenamt. Das Nachgespräch in der Bahnhofshalle steht in
// riverton-bahnhofshalle.london_nachgespraech. Musik ambrose.london, Geräusch kaffeehaus.
//
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
Die Tür ist schwer. Dahinter ist es warm und voll, viele Stimmen, die alle halblaut sprechen. #sprecher:erzaehler #musik:ambrose.london #geraeusch:kaffeehaus
Zeitungen an Holzstangen. Kaffee in dicken Tassen. Männer mit Backenbärten über Brettern, und hinter ihnen Zuschauer, drei Reihen tief. #sprecher:erzaehler
Ich bin damals hineingegangen, weil es regnete. Mein Vater sagte, ich solle nicht lange bleiben. #sprecher:ambrose #stimmung:jung
Ich bin lange geblieben. #sprecher:ambrose #stimmung:jung
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
    Am Ecktisch stellen sie die Figuren wieder auf. Niemand redet. Alle wissen, was sie gesehen haben. #sprecher:erzaehler
    -> END
}
In der Mitte ein Tisch, um den es still ist. Zwei Männer. Der eine groß, mit hoher Stirn, sehr gerade. Der andere kleiner, nervös. #sprecher:erzaehler
Anderssen. Aus Breslau. Ein Mathematiklehrer. Man sagt, er sei der Beste in Europa. #sprecher:ambrose #stimmung:jung
Der andere heißt Kieseritzky und gibt hier Unterricht, fünf Franc die Stunde. Es ist keine Turnierpartie. Sie spielen nur so. #sprecher:ambrose #stimmung:jung
Es sieht aus wie ein Unfall. Weiß hat schon einen Läufer hergegeben, die schwarze Dame steht tief in der weißen Stellung und frisst. #sprecher:erzaehler
Halt. Schau hin. Was hättest du getan? Du hast Weiß, wie er. Ich frage dich bei jedem Zug. #sprecher:ambrose
* [Zusehen und mitraten]
    ~ beginneAufgaben("riverton.flashbackLondon")
    -> END
* [Noch einen Moment warten]
    Die Uhr an der Wand tickt. Die Partie wartet nicht ewig, aber eine Weile. #sprecher:erzaehler
    -> END

// ---------------------------------------------------------------- Rückkehr

=== rueckkehr ===
Eine große Uhr an der Wand des Kaffeehauses. Ihr Ticken klingt genau wie das der Bahnhofsuhr in Riverton. #sprecher:erzaehler
{not flashbackLondonBestanden:
    Noch nicht, {held}. Erst sollst du sehen, was am Ecktisch geschieht. #sprecher:ambrose
    -> rueckkehr_wahl
}
Der Verlierer steht auf, der nervöse kleine Mann, und er strahlt über das ganze Gesicht. #sprecher:erzaehler #klang:lachen_kieseritzky
Er schüttelt dem anderen die Hand mit beiden Händen, ruft etwas auf Französisch und läuft zur Tür, ohne Hut. #sprecher:erzaehler #musik:london.lauf
Er ist zum Telegrafenamt gelaufen. Um seine eigene Niederlage nach Paris zu melden. Weil sie so schön war. #sprecher:ambrose #stimmung:jung
Ich stand dort, wo du jetzt stehst. Ich war zwanzig. Und ich dachte: Das. Das will ich. #sprecher:ambrose
Eine Partie, für die der Verlierer zum Telegrafenamt läuft. #sprecher:ambrose #pause:2
-> rueckkehr_wahl

=== rueckkehr_wahl ===
* [Zurück in die Gegenwart]
    Das Braun wird blasser. Die Stimmen werden zu Hall. #sprecher:erzaehler #musik:aus #geraeusch:aus
    ~ reise("riverton.bahnhofshalle", "grosseUhr")
    -> END
* [Noch bleiben]
    -> END


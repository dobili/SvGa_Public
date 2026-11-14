// Erinnerung: London, 1851 (Akt 2, Szene 35 der Story-Bibel; Flashback F1 bis F3).
// Ort erinnerungLondon (art erinnerung): Sepia, der Held ist Ambrose mit zwanzig Jahren, kein
// Tagebuch, keine Münzen. Karten: erinnerungLondon.strand (Straße am Strand) und
// erinnerungLondon.kaffeehaus. Hinein führt die große Uhr in der Bahnhofshalle von Riverton
// (riverton-bahnhofshalle.uhr mit reise), hinaus die Uhr im Kaffeehaus (rueckkehr).
//
// Einstiege wie in orte.json: zeitungsjunge, kellner, zeitungsleser (Figuren), droschke,
// schachtisch (Gegenstände), rueckkehr (Dialog-Auslöser), kaffeehaus_betreten (Übergang zur Tür).
// Am schachtisch beginnt das Zugerraten der Unsterblichen Partie (Runde riverton.flashbackLondon,
// klassik-unsterbliche, mit Weiß ab Zug 19, vor 19. e5 wie im Roman); die Quest riverton.flashbackLondon startet weiter an
// der großen Uhr in Riverton.
// Sprecher: Ambrose als junger Mann (#sprecher:ambrose #stimmung:jung); {held} erscheint nur als
// Stimme aus der Gegenwart, als Erzählzeile mit dem Namen. Tabakrauch nur als Wort.
// Runde 11 (13.11.2026): an den Roman angeglichen (akt2_teil2.md, Kapitel 21): Anderssen als
// Mathematiklehrer aus Breslau, Kieseritzky gibt Unterricht; keine Turnierpartie; nach dem Matt
// läuft Kieseritzky zum Telegrafenamt. Das Nachgespräch in der Bahnhofshalle steht in
// riverton-bahnhofshalle.london_nachgespraech. Musik ambrose.london, Geräusch kaffeehaus.
//
// Gutachten Teil K (13.11.2026): Halt vor 19. e5 mit dem Satz von den zwei Türmen (K2.1), die
// Ankunft in fremden Händen an der Kaffeehaustür (K2.6, Pflichtweg zum Tisch), das Schlussbild der
// Partie vor Kieseritzkys Lauf (K2.7), der alte Ambrose erzählt vom Telegrafenamt (K2.20).
//
// Variablen: flashbackLondonBestanden setzt die Hülle (R42).

EXTERNAL beginneAufgaben(runde)
EXTERNAL reise(karte, ausloeser)

VAR held = "Du"
VAR flashbackLondonBestanden = false
VAR londonKaffeehausGesehen = false
VAR zeitungsjungeGesehen = false
VAR londonSchlussGesehen = false

// ---------------------------------------------------------------- Strand

=== zeitungsjunge ===
{zeitungsjungeGesehen:
    {~Extra! Die Weltausstellung im Glaspalast! Ein Penny, Sir!|Schachturnier in London, die besten Spieler der Welt! Lesen Sie alles darüber!} #sprecher:zeitungsjunge #stimmung:laechelt
    -> END
}
~ zeitungsjungeGesehen = true
Ein Junge mit Schirmmütze schwenkt eine Zeitung über dem Kopf. Der Wind trägt den Geruch der Themse heran. #sprecher:erzaehler
Extra! Extra! #sprecher:zeitungsjunge #stimmung:laechelt
Die ganze Welt kommt nach London, zur großen Ausstellung! Und zum Schachturnier! #sprecher:zeitungsjunge #stimmung:laechelt
Ein Turnier. Die besten Spieler der Welt, in einer Stadt. #sprecher:ambrose #stimmung:jung
Und ich bin hier, um Klavierholz zu kaufen. #sprecher:ambrose
London, 1851. Bleib bei mir, {held}. Ich zeige dir, was ich sah. #sprecher:ambrose #stimmung:jung
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
Du stehst in einer Straße. Alles ist braun und golden, wie eine alte Fotografie, in die jemand hineingegangen ist. #sprecher:erzaehler
Du siehst auf Hände hinunter, die nicht deine sind. Schmal, mit Tintenflecken. Die Stiefel drücken. #sprecher:erzaehler #pause
Der Strand. So heißt die Straße. Dort, das Haus mit dem Schild. Geh hinein. #sprecher:ambrose #stimmung:jung
Die Stimme kommt aus dir. #sprecher:erzaehler
* [Hineingehen]
- Die Tür ist schwer. Dahinter ist es warm und voll, viele Stimmen, die alle halblaut sprechen. #sprecher:erzaehler #musik:ambrose.london #geraeusch:kaffeehaus
Zeitungen an Holzstangen. Kaffee in dicken Tassen. Männer mit Backenbärten über Brettern, und hinter ihnen Zuschauer, drei Reihen tief. #sprecher:erzaehler
Ich bin damals hineingegangen, weil es regnete. Mein Vater sagte, ich solle nicht lange bleiben. #sprecher:ambrose #stimmung:jung
Ich bin lange geblieben. #sprecher:ambrose #stimmung:jung
-> END

// ---------------------------------------------------------------- Kaffeehaus

=== kellner ===
Ein Kellner mit weißer Schürze balanciert ein Tablett mit Tassen zwischen den Tischen. #sprecher:erzaehler
{~Kaffee, junger Herr? Oder wollen Sie nur zusehen wie alle anderen?|Leise bitte, die Herren am Tisch in der Mitte spielen.|Herr Anderssen ist aus Breslau. Er spielt, als hätte er keine Angst vor nichts.} #sprecher:kellner #stimmung:laechelt
-> END

=== zeitungsleser ===
Ein älterer Herr hält eine Zeitung so groß wie ein Tischtuch und sieht nicht auf. #sprecher:erzaehler
{~Das Turnier? Dummes Zeug. Ich lese den Börsenbericht.|Der Deutsche am Tisch in der Mitte verliert gleich alles. Sehen Sie nur, er gibt seine Figuren weg.|Junger Mann, Sie stehen in meinem Licht.} #sprecher:zeitungsleser #stimmung:bitter
-> END

=== schachtisch ===
{flashbackLondonBestanden:
    Am Tisch in der Mitte stellen sie die Figuren wieder auf. Niemand redet. Alle wissen, was sie gesehen haben. #sprecher:erzaehler
    -> END
}
In der Mitte ein Tisch, um den es still ist. Zwei Männer. Der eine groß, mit hoher Stirn, sehr gerade. Der andere kleiner, nervös. #sprecher:erzaehler
Anderssen. Aus Breslau. Ein Mathematiklehrer. Man sagt, er sei der Beste in Europa. #sprecher:ambrose #stimmung:jung
Der andere heißt Kieseritzky und gibt hier Unterricht, fünf Franc die Stunde. Es ist keine Turnierpartie. Sie spielen nur so. #sprecher:ambrose #stimmung:jung
Es sieht aus wie ein Unfall. Weiß hat schon einen Läufer hergegeben, die schwarze Dame steht tief in der weißen Stellung und frisst. #sprecher:erzaehler
* [Hinsehen]
- Der große Mann zieht einen Läufer. Mitten hinein, tief ins schwarze Lager. Ein Raunen. #sprecher:erzaehler
Schwarz schlägt einen Turm. Einfach so, einen ganzen Turm. #sprecher:erzaehler #pause:2
Jetzt. Halt. Schau hin. #sprecher:ambrose
Er hat einen Turm weniger, und sein zweiter Turm hängt auch. Was hättest du getan? #sprecher:ambrose
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
    Noch nicht, {held}. Erst sollst du sehen, was am Tisch in der Mitte geschieht. #sprecher:ambrose
    -> rueckkehr_wahl
}
{londonSchlussGesehen: -> rueckkehr_telegraf}
~ londonSchlussGesehen = true
Der große Mann zieht seinen König ein Feld nach vorn, als träte er einem Besucher entgegen. #sprecher:erzaehler
Dann gleitet ein Läufer ein einziges Feld, und es ist vorbei. #sprecher:erzaehler #musik:aus
Matt. Mit drei kleinen Figuren, gegen eine ganze Armee, die nie aufgewacht ist. #sprecher:erzaehler #pause:2
Niemand sagt etwas. #sprecher:erzaehler
* [Warten]
- -> rueckkehr_telegraf

=== rueckkehr_telegraf ===
Der Verlierer steht auf, der nervöse kleine Mann, und er strahlt über das ganze Gesicht. #sprecher:erzaehler #klang:lachen_kieseritzky
Er schüttelt dem anderen die Hand mit beiden Händen, ruft etwas auf Französisch und läuft zur Tür, ohne Hut. #sprecher:erzaehler #musik:london.lauf
Seine Stimme ist wieder die alte. Sie zittert. #sprecher:erzaehler #pause
Er ist zum Telegrafenamt gelaufen. Um seine eigene Niederlage nach Paris zu melden. Weil sie so schön war. #sprecher:ambrose #stimmung:laechelt
Ich stand dort, wo du jetzt stehst. Ich war zwanzig. Und ich dachte: Das. Das will ich. #sprecher:ambrose #stimmung:nachdenklich
Eine Partie, für die der Verlierer zum Telegrafenamt läuft. #sprecher:ambrose #stimmung:laechelt #pause:2
-> rueckkehr_wahl

=== rueckkehr_wahl ===
* [Zurück in die Gegenwart]
    Das Braun wird blasser. Die Stimmen werden zu Hall. #sprecher:erzaehler #musik:aus #geraeusch:aus
    ~ reise("riverton.bahnhofshalle", "grosseUhr")
    -> END
* [Noch bleiben]
    -> END


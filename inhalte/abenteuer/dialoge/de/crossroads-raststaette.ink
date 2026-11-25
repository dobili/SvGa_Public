// Ort: Raststätte von Darlene in Crossroads (Akt 4): Diner mit Tresen, Varianten-Tisch,
// Darlenes Laden, Wand mit Postkarten aller Städte (Story-Bibel 27.3, Weltbeschreibung 5.11).
//
// Szene 93 „Crossroads“ (zweiter Teil): Darlene und ihr Laden (crossroads.raststaette), der
// Varianten-Tisch mit allen Varianten, die {held} unterwegs gelernt hat, Nova allein in der Ecke
// mit ihrer Bitte („Ich sage aus. Hilfst du mir?“, beide Antworten führen weiter), Fund
// Postkarte aller Städte.
// Einstiege wie in orte.json: darlene, nova, varianten_tisch, fund_postkarte.
//
// Varianten: Gebaut sind Blindschach (Begegnung wegCrossroadsPinewood.blindschach, gelernt
// bei Greta an Weg 9) und Schach960 (Begegnung crossroads.schach960 gegen Ambrose, gelernt bei
// Mabel im Musikhaus von Port Delacroix), seit 26.11.2026 die Regelvarianten (crossroads.dreischach,
// .atomschach, .koenigDerHuegel, .koenigsrennen, .raeuberschach), dazu Nebel-, Enten-, Tandemschach,
// Falke und Bison (crossroads.falkeUndBison) und der Drache (crossroads.drache).
// Variablen: variante<Name>Gelernt setzen die Dialoge der Wege und von Summit City;
// novaBitteGehoert, novaHilfeZugesagt und die übrigen setzt diese Datei. novaBitteGehoert und
// novaHilfeZugesagt sind für die Dialoge der Capital Arena gedacht (Szene 103).

EXTERNAL beginnePartie(begegnung)
EXTERNAL oeffneLaden(kennung)
EXTERNAL gibFund(kennung)

VAR held = "Du"
VAR darleneGetroffen = false
VAR novaBitteGehoert = false
VAR novaHilfeZugesagt = false
VAR postkarteGefunden = false
VAR lieferungFuerDolores = false
VAR gatterschluessel = false
VAR varianteDreischachGelernt = false
VAR varianteKoenigDerHuegelGelernt = false
VAR varianteKoenigsrennenGelernt = false
VAR varianteDracheGelernt = false
VAR varianteAtomschachGelernt = false
VAR varianteEntenschachGelernt = false
VAR varianteBlindschachGelernt = false
VAR varianteRaeuberschachGelernt = false
VAR varianteTandemGelernt = false
VAR varianteSchach960Gelernt = false
VAR varianteFalkeUndBisonGelernt = false
VAR varianteNebelschachGelernt = false
// Aus capital-arena-aussen.ink: Nach dem Abschied (Szene 109) spricht Ambrose nicht mehr
// (Story-Bibel Abschnitt 33, Frage 5; Entscheidung Q21-5). Hier nur gelesen.
VAR abschiedGesehen = false
// Kapitel 53 (Roman): Theo bekommt das Tablet zurück (Figur crossroads.theo am Fenster, M3.1).
VAR theoTabletZurueck = false
// Aus weg-ironwood-silicon (Glasbrücke): der Ohrstöpsel ist ein Fund, kein Muss.
VAR ohrstoepselGefunden = false
// Gutachten M3.9: Der Abend im Kaffeehaus erst, wenn draußen alle gesprochen sind.
VAR slickCrossroadsGetroffen = false
VAR miraCrossroadsGetroffen = false
VAR bigJoeCrossroadsGetroffen = false
VAR coachCrossroadsGetroffen = false
VAR kaffeehausGesehen = false
// Rückmeldung nach einer Partie am Varianten-Tisch (Wunsch des Autors, 19.11.2026): welche Partie
// der Tisch gestartet hat; die Ausgänge setzt die Hülle (regeln/dialogvariablen.ts).
VAR tischPartie = ""
VAR ausgangWegCrossroadsPinewoodBlindschach = ""
VAR ausgangCrossroadsSchach960 = ""
VAR ausgangCrossroadsDreischach = ""
VAR ausgangCrossroadsAtomschach = ""
VAR ausgangCrossroadsKoenigDerHuegel = ""
VAR ausgangCrossroadsKoenigsrennen = ""
VAR ausgangCrossroadsRaeuberschach = ""
VAR ausgangCrossroadsNebelschach = ""
VAR ausgangCrossroadsEntenschach = ""
VAR ausgangCrossroadsTandem = ""
VAR ausgangCrossroadsFalkeUndBison = ""
VAR ausgangCrossroadsDrache = ""
// Eingang der Raststätte (19.11.2026): beim ersten Betreten statt beim ersten Gespräch mit Darlene.
VAR raststaetteBetreten = false

// ---------------------------------------------------------------- Eingang

// Beim ersten Betreten (orte.json, Feld „eingang“), nicht erst beim Gespräch mit Darlene.
=== eingang ===
~ raststaetteBetreten = true
Drinnen ist es laut und warm. An der Wand ein großes Brett aus Kork, darauf an Nägeln kleine Tafeln: Königsrennen, Atomschach, Falke und Bison, Der Drache. #sprecher:erzaehler #bild:korkwand
Hinter der Theke schenkt eine Frau Kaffee ein, ohne hinzusehen. #sprecher:erzaehler #bild:aus
-> END

// ---------------------------------------------------------------- Darlene

=== darlene ===
{novaBitteGehoert and not lieferungFuerDolores: -> darlene_lieferung}
{not darleneGetroffen:
    ~ darleneGetroffen = true
    Die Frau hinter der Theke stellt die Kanne ab. Darlene, sechzig, Hände wie gegerbtes Leder. #sprecher:erzaehler #bild:aus
    Der Varianten-Tisch. Jeder, der hier durchkommt, bringt ein Spiel mit. #sprecher:darlene #stimmung:froh
    Ich heb sie auf. Du hast auch welche mitgebracht, hör ich. #sprecher:darlene #stimmung:froh
- else:
    {~Kaffee? Geht aufs Haus, wenn du was kaufst.|Ich hab alles, was die Läden davor hatten. Nur netter verpackt.|Der Tisch da hinten? Da spielt man alles, nur kein normales Schach.} #sprecher:darlene #stimmung:laechelt
}
{slickCrossroadsGetroffen and miraCrossroadsGetroffen and bigJoeCrossroadsGetroffen and coachCrossroadsGetroffen and novaBitteGehoert and not kaffeehausGesehen: -> kaffeehaus}
~ oeffneLaden("crossroads.raststaette")
-> END

=== darlene_lieferung ===
// Runde 6: Nach Novas Bitte schickt Darlene eine Lieferung zum Jahrmarkt und gibt den
// Gatterschlüssel mit (13_Wegenetz, S13). Quest crossroads.lieferung.
~ lieferungFuerDolores = true
~ gatterschluessel = true
{not darleneGetroffen:
    ~ darleneGetroffen = true
    Hinter der Theke steht Darlene. Sechzig, mit den Händen von einer, die vierzig Jahre Kaffee eingeschenkt hat. #sprecher:erzaehler
    Ich bin Darlene. Du hast mit Nova geredet, dann kann ich dir was anvertrauen. #sprecher:darlene #stimmung:laechelt
}
Darlene stellt eine Kiste auf den Tresen. Darin klirren Glühbirnen. #sprecher:erzaehler
Tust du mir einen Gefallen? Die Kiste ist für Dolores, drüben auf dem Jahrmarkt hinter dem Feld. #sprecher:darlene #stimmung:laechelt
Glühbirnen für ihre Lichterketten. #sprecher:darlene #stimmung:laechelt
Und nimm den hier. Der Schlüssel fürs Viehgatter an der Minenstraße. #sprecher:darlene #stimmung:laechelt
Das Mädchen mit dem Tagebuch sagt, ihr wollt nach Ghost Town. Das ist der kürzeste Weg. #sprecher:darlene #stimmung:laechelt
{not abschiedGesehen:
    Eine Kiste, ein Schlüssel und ein Auftrag. So fingen meine besten Reisen an. #sprecher:ambrose #stimmung:laechelt
}
-> END

// ---------------------------------------------------------------- Nova (Szene 93)

=== nova ===
{novaBitteGehoert and slickCrossroadsGetroffen and miraCrossroadsGetroffen and bigJoeCrossroadsGetroffen and coachCrossroadsGetroffen and not kaffeehausGesehen: -> kaffeehaus}
{novaBitteGehoert:
    {~Dr. Lin sagt, wir legen alles vor. Die Berichte, den Empfänger, alles.|Ich hab Angst. Aber eine gute Angst, glaube ich.|Ich übe jetzt ohne Stimme im Ohr. Es ist erst mal sehr still.} #sprecher:nova #stimmung:nachdenklich
    -> END
}
-> nova_bitte

=== nova_bitte ===
// Kapitel 53 (Roman): Nova ohne weiße Jacke, Ärmel über den Händen; alles tritt zurück, nur ihre
// Stimme. Der Ohrstöpsel von der Glasbrücke wird zum Beweis.
~ novaBitteGehoert = true
In der hintersten Ecke, an einem Tisch für zwei, sitzt Nova allein. Pullover, zu groß, die Ärmel über den Händen. #sprecher:erzaehler #musik:aus
Ein Kakao, den sie nicht angerührt hat. #sprecher:erzaehler
Dr. Lin hat angerufen. Sie hat die Berichte gefunden. #sprecher:nova #stimmung:nachdenklich
Alle. Sie hat gekündigt. #sprecher:nova #stimmung:nachdenklich
Sie hat nicht gefragt, ob es stimmt. Sie hat gefragt, wie es mir geht. #sprecher:nova #stimmung:riss
Das hat mich seit zwei Jahren keiner gefragt. #sprecher:nova #stimmung:riss
Ich sage aus. Bei der Meisterschaft. #sprecher:nova #stimmung:nachdenklich
Sie kommt mit. Sie bringt die Berichte. #sprecher:nova #stimmung:nachdenklich
{ohrstoepselGefunden:
    Du hast noch den einen. Den von der Brücke. #sprecher:nova #stimmung:nachdenklich
    Du legst den Ohrstöpsel auf den Tisch. Ein halbes Jahr hast du ihn getragen, neben einem Springer. #sprecher:erzaehler
- else:
    Dr. Lin bringt die Schachtel mit den Empfängern mit. Fünf Mulden sind leer, eine war meine. #sprecher:nova #stimmung:nachdenklich
}
Hilfst du mir? #sprecher:nova #stimmung:nachdenklich
* [„Ja.“]
    ~ novaHilfeZugesagt = true
- Sie nickt und zieht den Kakao zu sich. #sprecher:erzaehler
Ich hab Angst. Nicht vor denen. #sprecher:nova #stimmung:bitter
Davor, was ich bin, wenn ich es nicht mehr im Ohr habe. Vielleicht bin ich schlecht. #sprecher:nova #stimmung:bitter
* [„Vierundsiebzig Prozent.“]
- „Ich hab deine Trainingspartien gesehen. Du bist besser als ich.“ #sprecher:erzaehler
„Im Training hattest du es nie. Das waren deine.“ #sprecher:erzaehler #pause
Sie starrt dich an. Dann geht etwas über ihr Gesicht. #sprecher:erzaehler #bild:nova_laechelt
Kein Lächeln vom Podium. Es dauert länger, und es geht nicht wieder aus. #sprecher:erzaehler
-> kaffeehaus_pruefen

=== kaffeehaus_pruefen ===
{slickCrossroadsGetroffen and miraCrossroadsGetroffen and bigJoeCrossroadsGetroffen and coachCrossroadsGetroffen and novaBitteGehoert and not kaffeehausGesehen: -> kaffeehaus}
-> END

// Kapitel 53, Schluss: erst, wenn {held} draußen alle gesprochen hat.
=== kaffeehaus ===
~ kaffeehausGesehen = true
Es wird ein langer Abend, an einem Tisch aus vier Tischen, zwischen Menschen aus acht Städten. Du kennst jeden. #sprecher:erzaehler #musik:crossroads #geraeusch:kaffeehaus
Du weißt, wie jeder von ihnen spielt. Was jeder übersieht. #sprecher:erzaehler
Was jeder kann, das du nie können wirst. #sprecher:erzaehler
{not abschiedGesehen:
    Weißt du, was das ist? Ein Kaffeehaus. #sprecher:ambrose #stimmung:still
    Es sieht nicht so aus. Aber es ist eines. #sprecher:ambrose #stimmung:still
    So hat es geklungen. #sprecher:ambrose #stimmung:still
}
-> END

// ---------------------------------------------------------------- Theo (Kapitel 53)

=== theo ===
{theoTabletZurueck:
    {~Ich messe noch, ob es sich lohnt. Ich glaub, ich geh hin.|Angst kann man nicht messen. Hm.} #sprecher:theo #stimmung:nachdenklich
    -> END
}
~ theoTabletZurueck = true
Am Fenster steht Theo, gewachsen, einen Bildschirm unter dem Arm. Du legst das Tablet vor ihn hin. #sprecher:erzaehler
Du gibst es zurück? Hat es nicht geholfen? #sprecher:theo #stimmung:ueberrascht
* [„Es ist das Beste, was ich je gesehen habe.“]
- Aber? #sprecher:theo #stimmung:nachdenklich
* [„Es sagt nicht, warum man Angst hatte.“]
- Er tippt etwas ein. Dann hört er auf zu tippen. #sprecher:erzaehler #klang:tippen_hoert_auf
Das kann man nicht messen. #sprecher:theo #stimmung:nachdenklich
Dr. Lin hat gekündigt. Sie macht einen Club auf. #sprecher:theo #stimmung:nachdenklich
In einem Keller. Ich hab gesagt, ich messe erst, ob es sich lohnt. #sprecher:theo #stimmung:nachdenklich
Ich glaub, ich geh hin. #sprecher:theo #stimmung:laechelt
-> END

// ---------------------------------------------------------------- Varianten-Tisch

=== varianten_tisch ===
{tischPartie != "": -> tisch_nach_partie}
An einem langen Tisch liegen Bretter in allen Größen, Kisten mit seltsamen Figuren, eine Holzente, ein Drache aus Glas. #sprecher:erzaehler
Ein Schild: „Varianten-Tisch. Alles erlaubt, nur kein normales Schach.“ #sprecher:erzaehler
{not (varianteDreischachGelernt or varianteKoenigDerHuegelGelernt or varianteKoenigsrennenGelernt or varianteDracheGelernt or varianteAtomschachGelernt or varianteEntenschachGelernt or varianteBlindschachGelernt or varianteRaeuberschachGelernt or varianteTandemGelernt or varianteFalkeUndBisonGelernt or varianteSchach960Gelernt or varianteNebelschachGelernt):
    Du kennst noch keine der Varianten. Unterwegs spielen die Leute sie, an jedem Weg eine andere. #sprecher:darlene #stimmung:neutral
    -> END
}
Was du schon kennst: #sprecher:erzaehler
{varianteDreischachGelernt:
    Drei-Schach, von Juniper am Canyon. Bei jedem Schach klopft jemand dreimal auf den Tisch. #sprecher:erzaehler
}
{varianteKoenigDerHuegelGelernt:
    König der Hügel, von Abe am Leuchtturm. Ein König steht schon mitten auf dem Brett, wie im Hafen. #sprecher:erzaehler
}
{varianteKoenigsrennenGelernt:
    Königsrennen, von Earl am Diner. Zwei Fernfahrer jagen ihre Könige gerade um die Wette nach oben. #sprecher:erzaehler
}
{varianteDracheGelernt:
    Schach mit dem Drachen, vom Fest in Summit City. Der Glasdrache wartet neben dem Brett auf seinen Einsatz. #sprecher:erzaehler
}
{varianteAtomschachGelernt:
    Atomschach, von Bell am Geysir. Auf einem Brett fehlt schon die halbe Mitte. #sprecher:erzaehler
}
{varianteEntenschachGelernt:
    Entenschach, von Ray in der Prärie. Die Holzente steht mitten auf e4 und rührt sich nicht. #sprecher:erzaehler
}
{varianteRaeuberschachGelernt:
    Räuberschach, vom Lagerfeuer im Camp. Ein Junge verschenkt strahlend seine Dame. #sprecher:erzaehler
}
{varianteTandemGelernt:
    Tandem, vom Lagerfeuer im Camp. Vier Leute an zwei Brettern, und alle reden durcheinander. #sprecher:erzaehler
}
{varianteFalkeUndBisonGelernt:
    Falke und Bison, von Kira auf der Hochebene. Die zwei Figuren liegen obenauf in der Kiste. #sprecher:erzaehler
}
{varianteNebelschachGelernt:
    Nebelschach, von Theron im Bayou. Über einem Brett liegt ein grauer Schleier, und zwei Spieler raten. #sprecher:erzaehler
}
{varianteBlindschachGelernt:
    Blindschach, von Greta an der Hütte. Eine Frau sagt ihre Züge an und sieht dabei an die Decke. #sprecher:erzaehler
}
{varianteSchach960Gelernt:
    Schach960, von Mabel am Musikhaus. Jemand würfelt die Grundreihe aus und stöhnt. #sprecher:erzaehler
}
// Der Tisch ist Kulisse: Die Sätze zeigen, was dort gespielt wird, ohne ein Versprechen an den
// Spieler („Kommt bald“). Spielbar gegen Ambrose: Blindschach, Schach960 und seit 26.11.2026 die
// Regelvarianten Drei-Schach, Atomschach, König der Hügel, Königsrennen und Räuberschach, dazu
// Nebel- und Entenschach gegen Ambrose und Tandem mit Ambrose als Partner gegen Slick (mittel-4),
// dazu Falke und Bison (von Kira) und Schach mit dem Drachen (vom Drachenfest) gegen Ambrose.
// Nach dem Abschied (abschiedGesehen) spielt Ambrose nicht mehr mit: Beide Partien entfallen.
// Schach960 bleibt bei Mabel im Musikhaus spielbar.
+ {varianteBlindschachGelernt and not abschiedGesehen} [Blindschach gegen Ambrose]
    Zwölf Jahre Briefe, {held}. Ich sehe das Brett mit geschlossenen Augen besser als mit offenen. #sprecher:ambrose #stimmung:lacht
    ~ tischPartie = "blindschach"
    ~ beginnePartie("wegCrossroadsPinewood.blindschach")
    -> END
+ {varianteSchach960Gelernt and not abschiedGesehen} [Schach960 gegen Ambrose]
    Gemischte Figuren. Mal sehen, ob ein alter Mann noch umlernen kann. #sprecher:ambrose #stimmung:lacht
    ~ tischPartie = "schach960"
    ~ beginnePartie("crossroads.schach960")
    -> END
+ {varianteDreischachGelernt and not abschiedGesehen} [Drei-Schach gegen Ambrose]
    Dreimal Schach, und ich bin raus. Früher hätte ich das für einen Vorteil gehalten. #sprecher:ambrose #stimmung:lacht
    ~ tischPartie = "dreischach"
    ~ beginnePartie("crossroads.dreischach")
    -> END
+ {varianteAtomschachGelernt and not abschiedGesehen} [Atomschach gegen Ambrose]
    Wer schlägt, fliegt mit. Ich zähle vorher, versprochen. #sprecher:ambrose #stimmung:lacht
    ~ tischPartie = "atomschach"
    ~ beginnePartie("crossroads.atomschach")
    -> END
+ {varianteKoenigDerHuegelGelernt and not abschiedGesehen} [König der Hügel gegen Ambrose]
    Der König in die Mitte. Meiner kennt den Weg. #sprecher:ambrose #stimmung:lacht
    ~ tischPartie = "koenigDerHuegel"
    ~ beginnePartie("crossroads.koenigDerHuegel")
    -> END
+ {varianteKoenigsrennenGelernt and not abschiedGesehen} [Königsrennen gegen Ambrose]
    Ein Rennen? Mit meinen Beinen? Nun gut, die Figuren laufen. #sprecher:ambrose #stimmung:lacht
    ~ tischPartie = "koenigsrennen"
    ~ beginnePartie("crossroads.koenigsrennen")
    -> END
+ {varianteRaeuberschachGelernt and not abschiedGesehen} [Räuberschach gegen Ambrose]
    Alles verschenken. Darin war ich nie gut, {held}. Zeig es mir. #sprecher:ambrose #stimmung:lacht
    ~ tischPartie = "raeuberschach"
    ~ beginnePartie("crossroads.raeuberschach")
    -> END
+ {varianteNebelschachGelernt and not abschiedGesehen} [Nebelschach gegen Ambrose]
    Ich habe mein halbes Leben im Nebel gespielt, {held}. Das hier ist wenigstens ehrlich. #sprecher:ambrose #stimmung:lacht
    ~ tischPartie = "nebelschach"
    ~ beginnePartie("crossroads.nebelschach")
    -> END
+ {varianteEntenschachGelernt and not abschiedGesehen} [Entenschach gegen Ambrose]
    Eine Ente. Auf meinem Brett. Nun gut, ich habe schon Seltsameres verloren. #sprecher:ambrose #stimmung:lacht
    ~ tischPartie = "entenschach"
    ~ beginnePartie("crossroads.entenschach")
    -> END
+ {varianteFalkeUndBisonGelernt and not abschiedGesehen} [Falke und Bison gegen Ambrose]
    Kiras Spiel. Der Falke springt, der Bison läuft wie ein Turm. Mal sehen, wer seine zuerst einsetzt. #sprecher:ambrose #stimmung:laechelt
    ~ tischPartie = "falkeUndBison"
    ~ beginnePartie("crossroads.falkeUndBison")
    -> END
+ {varianteDracheGelernt and not abschiedGesehen} [Schach mit dem Drachen gegen Ambrose]
    Der Glasdrache. Hol ihn nicht zu früh, sagt Sol. Ich sage: Hol ihn überhaupt, sonst holt ihn der andere. #sprecher:ambrose #stimmung:lacht
    ~ tischPartie = "drache"
    ~ beginnePartie("crossroads.drache")
    -> END
+ {varianteTandemGelernt and not abschiedGesehen} [Tandem mit Ambrose gegen Slick]
    Ich bin dein Partner. Gib mir einen Springer, und ich gebe dir die Welt. #sprecher:ambrose #stimmung:lacht
    ~ tischPartie = "tandem"
    ~ beginnePartie("crossroads.tandem")
    -> END
+ [Nur schauen]
    -> END

// Nach der Partie am Tisch: Ambrose zum Ausgang, dann ist der Tisch wieder Kulisse. Die Partien
// gibt es nur vor dem Abschied; der Erzähler steht für den Fall dahinter.
=== tisch_nach_partie ===
~ temp blind = tischPartie == "blindschach"
~ temp regelvariante = tischPartie != "blindschach" and tischPartie != "schach960"
~ temp ausgang = ausgangCrossroadsSchach960
{
- blind: ~ ausgang = ausgangWegCrossroadsPinewoodBlindschach
- tischPartie == "dreischach": ~ ausgang = ausgangCrossroadsDreischach
- tischPartie == "atomschach": ~ ausgang = ausgangCrossroadsAtomschach
- tischPartie == "koenigDerHuegel": ~ ausgang = ausgangCrossroadsKoenigDerHuegel
- tischPartie == "koenigsrennen": ~ ausgang = ausgangCrossroadsKoenigsrennen
- tischPartie == "raeuberschach": ~ ausgang = ausgangCrossroadsRaeuberschach
- tischPartie == "nebelschach": ~ ausgang = ausgangCrossroadsNebelschach
- tischPartie == "entenschach": ~ ausgang = ausgangCrossroadsEntenschach
- tischPartie == "tandem": ~ ausgang = ausgangCrossroadsTandem
- tischPartie == "falkeUndBison": ~ ausgang = ausgangCrossroadsFalkeUndBison
- tischPartie == "drache": ~ ausgang = ausgangCrossroadsDrache
}
~ temp tandem = tischPartie == "tandem"
~ tischPartie = ""
{abschiedGesehen:
    Die Bretter auf dem Tisch stehen wieder still. #sprecher:erzaehler
    -> END
}
// Im Tandem spielt Ambrose mit dem Helden gegen Slick: kein „du hast mich geschlagen“.
{tandem:
    {ausgang:
    - "sieg": Gewonnen, wir zwei! Du hast mir genau den Springer geschickt, den ich brauchte. #sprecher:ambrose #stimmung:froh
    - "remis": Unentschieden. Slick wird behaupten, er hätte gewonnen. Lass ihn. #sprecher:ambrose #stimmung:laechelt
    - else: Verloren, und das geht auf mich. Ich habe zu lange über meinem Brett gebrütet. #sprecher:ambrose #stimmung:nachdenklich
    }
    Der Tisch steht noch da, wenn du wieder magst. #sprecher:ambrose #stimmung:laechelt
    -> END
}
{regelvariante:
    {ausgang:
    - "sieg": Nach ihren Regeln geschlagen. Ich lerne noch, und du bist schon weiter. #sprecher:ambrose #stimmung:froh
    - "remis": Remis. Neue Regeln, alter Mann, junger Gegner. Das ist gerecht. #sprecher:ambrose #stimmung:laechelt
    - else: Neue Regeln, alte Gewohnheiten. Du hast gespielt, als wäre es gewöhnliches Schach. #sprecher:ambrose #stimmung:nachdenklich
    }
    Der Tisch steht noch da, wenn du wieder magst. #sprecher:ambrose #stimmung:laechelt
    -> END
}
{ausgang:
- "sieg": {blind:Geschlagen, und keiner von uns hat das Brett gesehen. Du hast es im Kopf getragen.|Die Figuren standen fremd, und du hast trotzdem einen Plan gefunden.} #sprecher:ambrose #stimmung:froh
- "remis": {blind:Remis im Dunkeln. Das ist mehr, als die meisten im Hellen schaffen.|Remis. Ein alter Mann lernt um, ein junger auch.} #sprecher:ambrose #stimmung:laechelt
- else: {blind:Im Kopf verrutscht eine Figur leicht. Sag dir die Stellung leise vor, nach jedem Zug.|Fremde Grundreihe, fremde Pläne. Sieh zuerst, wo dein König sicher wird.} #sprecher:ambrose #stimmung:nachdenklich
}
Der Tisch steht noch da, wenn du wieder magst. #sprecher:ambrose #stimmung:laechelt
-> END

// ---------------------------------------------------------------- Fund

=== fund_postkarte ===
{postkarteGefunden:
    An der Wand hängen Postkarten aus allen Städten, dicht an dicht. #sprecher:erzaehler
    -> END
}
~ postkarteGefunden = true
Neben den Regalen steht ein Drehständer mit Postkarten. Auf einer sind alle Städte zugleich: Maple Falls, die Brücke von Cedar Creek, der Pavillon, die Werkhallen, die Glasbrücke, das Musikhaus, der Canyon, die Seilbahn. #sprecher:erzaehler
Wir waren überall! Die kommt ins Tagebuch. #sprecher:juno #stimmung:froh
Ganz hinten, auf die letzte Seite. #sprecher:juno #stimmung:froh
~ gibFund("postkarteStaedte")
-> END

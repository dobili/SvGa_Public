// Ort: Turnierhalle der Capital Arena (Akt 4): Landesmeisterschaft (Story-Bibel 27.4, Szenen 104 bis
// 108). Figuren: Turnierleiterin, Dr. Lin, Graham Hale, die Gegner Bea, Marcus, Nova, Tobias, Kade
// und Victor.
//
// Turniermodus ohne neue Technik (Entscheidung 8.11.2026): Die Vorrunde sind vier Begegnungen
// (capitalArena.runde1 bis runde4); Ink zählt die Punkte aus den ausgang-Variablen (Sieg 1,
// Remis ½). Weiter ab 2,5 von 4; wer weniger hat, spielt die nicht gewonnenen Runden noch einmal.
// Danach 105 Die Aussage am Pressetisch, 106 Halbfinale gegen Kade (freier Mentor-Zug, Stärkewechsel
// über abgelenktAb), 107 Vor dem Finale, 108 Finale gegen Victor (keine Karten, R28). Keine Sprüche
// im ganzen Turnier (S2). Einstiege wie in orte.json: turnierleiterin, lin, graham_hale, bea,
// marcus, nova, tobias, kade, victor, turniertafel, pressetisch, fanshop.
//
// Variablen: ausgangCapitalArena<Begegnung> und mentorzugFreiGespielt setzt die Hülle (R42),
// arenaGesehen setzt capital-arena-aussen.ink, novaBitteGehoert und novaHilfeZugesagt
// crossroads-raststaette.ink (Szene 93); die übrigen setzt diese Datei.

EXTERNAL beginnePartie(begegnung)
EXTERNAL gibFund(kennung)
EXTERNAL oeffneLaden(laden)

VAR held = "Du"
VAR arenaGesehen = false
VAR ausgangCapitalArenaRunde1 = ""
VAR ausgangCapitalArenaRunde2 = ""
VAR ausgangCapitalArenaRunde3 = ""
VAR ausgangCapitalArenaRunde4 = ""
VAR ausgangCapitalArenaHalbfinale = ""
VAR ausgangCapitalArenaFinale = ""
VAR mentorzugFreiGespielt = false
VAR novaBitteGehoert = false
VAR novaHilfeZugesagt = false
VAR vorrundeGeschafft = false
VAR aussageGesehen = false
VAR vorDemFinaleGesehen = false
VAR finaleBesprochen = false
VAR angesehenBanner = false
VAR spurenPM = 0
VAR mappeGezeigt = false
VAR halbfinaleVorherGesehen = false
VAR halbfinaleDanachGesehen = false
VAR ambroseImHalbfinaleGerufen = false
VAR novaNachPartieGesehen = false

=== function punkt(ausgang) ===
{
- ausgang == "sieg":
    ~ return 1
- ausgang == "remis":
    ~ return 0.5
- else:
    ~ return 0
}

=== function gespielt(ausgang) ===
~ return ausgang != "" and ausgang != "abgebrochen"

=== function vorrundenpunkte() ===
~ return punkt(ausgangCapitalArenaRunde1) + punkt(ausgangCapitalArenaRunde2) + punkt(ausgangCapitalArenaRunde3) + punkt(ausgangCapitalArenaRunde4)

=== function punktetext() ===
~ temp p = vorrundenpunkte()
~ temp ganz = FLOOR(p)
{p > ganz:
    ~ return "{ganz},5"
}
~ return "{ganz}"

=== function alleGespielt() ===
~ return gespielt(ausgangCapitalArenaRunde1) and gespielt(ausgangCapitalArenaRunde2) and gespielt(ausgangCapitalArenaRunde3) and gespielt(ausgangCapitalArenaRunde4)

// ---------------------------------------------------------------- Turnierleiterin (Vorrunde)

=== turnierleiterin ===
{
- not arenaGesehen:
    Bitte erst am Eingang anmelden. #sprecher:turnierleiterin
    -> END
- not vorrundeGeschafft and alleGespielt() and vorrundenpunkte() >= 2.5: -> vorrunde_geschafft
- not vorrundeGeschafft: -> vorrunde_naechste
- not aussageGesehen:
    Das Halbfinale beginnt gleich. Vorher möchte Dr. Lin am Pressetisch etwas sagen. #sprecher:turnierleiterin
    -> END
- ausgangCapitalArenaHalbfinale != "sieg": -> halbfinale_angebot
- else:
    Das Finale spielst du auf der Bühne. Victor wartet im Gang. #sprecher:turnierleiterin
    -> END
}

=== vorrunde_naechste ===
{alleGespielt():
    Du hast {punktetext()} von 4 Punkten. Für das Halbfinale brauchst du 2,5. #sprecher:turnierleiterin
    Du darfst eine Runde, die du nicht gewonnen hast, noch einmal spielen. #sprecher:turnierleiterin
}
{
- not gespielt(ausgangCapitalArenaRunde1) or (alleGespielt() and ausgangCapitalArenaRunde1 != "sieg"):
    Runde 1 gegen Bea Lindqvist. #sprecher:turnierleiterin #musik:arena.vorrunde
    Bea ist Maes große Schwester. Sie hat bei Mrs. Okafor gelernt. Sie wartet und will ein Remis von jedem, der ungeduldig wird. #sprecher:erzaehler
    -> runde1_spielen
- not gespielt(ausgangCapitalArenaRunde2) or (alleGespielt() and ausgangCapitalArenaRunde2 != "sieg"):
    Runde 2 gegen Marcus Oyelaran. #sprecher:turnierleiterin #musik:arena.vorrunde
    Er sieht jede Gabel, bevor sie da ist. Er ist schnell und laut in seinen Zügen. #sprecher:erzaehler
    -> runde2_spielen
- not gespielt(ausgangCapitalArenaRunde3) or (alleGespielt() and ausgangCapitalArenaRunde3 != "sieg"):
    Tisch eins. Sinclair gegen … #sprecher:turnierleiterin #musik:aus
    -> runde3_vorher
- else:
    Runde 4 gegen Tobias Wren, mit fester Uhr: fünf Minuten und drei Sekunden je Zug. #sprecher:turnierleiterin
    Er spielt, als würde das Haus brennen. Du lässt die Uhr eine Figur sein. Sie ist nicht der König. #sprecher:erzaehler
    -> runde4_spielen
}

=== runde1_spielen ===
+ [„Ich bin bereit.“]
    ~ beginnePartie("capitalArena.runde1")
    -> END
+ [„Noch einen Moment.“]
    Natürlich. Die Bretter warten. #sprecher:turnierleiterin
    -> END

=== runde2_spielen ===
+ [„Ich bin bereit.“]
    ~ beginnePartie("capitalArena.runde2")
    -> END
+ [„Noch einen Moment.“]
    Natürlich. Die Bretter warten. #sprecher:turnierleiterin
    -> END

// Roman Kapitel 61: Nova ohne Gerät, beide Ohren frei, der Stöpsel offen neben der Uhr.
=== runde3_vorher ===
Sie sitzt schon da, im zu großen Pullover, die Haare zurückgebunden, sodass man beide Ohren sieht. Das soll man bemerken. #sprecher:erzaehler
Neben der Uhr liegt etwas Kleines, Hautfarbenes, offen, wo jeder es sehen kann. Am Rand steht ein Mann mit einem Prüfgerät. #sprecher:erzaehler
Nova gibt dir die Hand. Ihre zittert so, dass du es bis in den Ellbogen spürst. #sprecher:erzaehler
Ich hab seit zwei Jahren keine Turnierpartie allein gespielt. Ich weiß nicht, wie ich anfange. #sprecher:nova
* [„Mit einem Bauern in der Mitte. Das machen alle.“]
- Sie lacht, kurz, erschrocken. #sprecher:erzaehler
-> runde3_spielen

=== runde3_spielen ===
+ [„Ich bin bereit.“]
    ~ beginnePartie("capitalArena.runde3")
    -> END
+ [„Noch einen Moment.“]
    Natürlich. Die Bretter warten. #sprecher:turnierleiterin
    -> END

=== runde4_spielen ===
+ [„Ich bin bereit.“]
    ~ beginnePartie("capitalArena.runde4")
    -> END
+ [„Noch einen Moment.“]
    Natürlich. Die Bretter warten. #sprecher:turnierleiterin
    -> END

=== vorrunde_geschafft ===
~ vorrundeGeschafft = true
Die Turnierleiterin schreibt deinen Namen an die Tafel, ganz oben. #sprecher:erzaehler
{punktetext()} von 4 Punkten. Du stehst im Halbfinale. Gratuliere. #sprecher:turnierleiterin
Du stehst auf. Deine Beine sind aus Watte. #sprecher:erzaehler
Halbfinale. Gegen einen, der Kade Sterling heißt. Der ist von denen. Er hat alle vier gewonnen, keine länger als eine Stunde. #sprecher:juno
An Tisch zwei räumt ein Junge in Weiß seine Figuren ein. Er hält den Kopf ganz gerade. Seine Haare fallen ihm über die Ohren. #sprecher:erzaehler
-> END

// ---------------------------------------------------------------- Die Aussage (Szene 105)

=== pressetisch ===
{
- aussageGesehen:
    Am Pressetisch schreiben Reporter. Einer fotografiert die Turniertafel. #sprecher:erzaehler
    -> END
- not vorrundeGeschafft:
    Am Pressetisch sitzen Dr. Lin und Nova mit einer Mappe. Sie warten auf das Ende der Vorrunde. #sprecher:erzaehler
    -> END
}
-> aussage

=== aussage ===
// Roman Kapitel 62: Nova spricht allein, Dr. Lin legt die Mappe hin, die Bildschirme gehen aus
// (abschaltton, das Konzernmotiv kehrt nicht wieder), Victor stellt sich neben Nova, acht Clubs stehen.
~ aussageGesehen = true
Die Scheinwerfer gehen an. Die Turnierleiterin klopft an das Mikrofon. Es wird nicht sofort still. Dann wird es still. #sprecher:erzaehler #musik:aus #klang:scheinwerfer
Die Turnierleitung hat eine Erklärung entgegengenommen. Die Betroffene möchte selbst sprechen. #sprecher:turnierleiterin
Nova geht nach vorn. Allein. Dr. Lin bleibt zwei Schritte hinter ihr. Novas Knie zittern, und sie drückt sie durch. #sprecher:erzaehler
{novaHilfeZugesagt: Du stehst in der ersten Reihe, wie versprochen. Sie sucht dich und findet dich. #sprecher:erzaehler}
Ich bin sechzehn. Seit zwei Jahren habe ich in jedem Turnier ein Gerät im Ohr getragen, das mir Züge angesagt hat. #sprecher:nova #stimmung:ernst
* [Zuhören]
- In der Halle hält jemand die Luft an. Dann viele. #sprecher:erzaehler #pause:2
Ich hätte Nein sagen können. #sprecher:nova
Ich war vierzehn. Ich wollte gewinnen, dann wollte ich nicht mehr, und dann habe ich mich nicht mehr getraut. #sprecher:nova
Ich gebe die Titel zurück. Heute habe ich eine Partie ohne gespielt. Es ist das einzige Ergebnis der letzten zwei Jahre, das mir gehört. #sprecher:nova
-> aussage_lin

=== aussage_lin ===
Dr. Lin legt die Mappe auf den Tisch und eine Schachtel aus weißem Karton daneben, mit Mulden aus Schaumstoff. #sprecher:erzaehler
Ich habe ihre Spielberichte unterschrieben. Ich habe sie nie so genau angesehen, wie ich es von jedem Schüler verlangt hätte. #sprecher:lin
Das ist mein Fehler, und er ist nicht klein. Die Kinder haben getan, was Erwachsene von ihnen verlangt haben. #sprecher:lin
Das Halbfinale wird unter Funkaufsicht gespielt. Perfect Move ist von der weiteren Leitung entbunden. #sprecher:turnierleiterin
* [Zu den Wänden sehen]
- An den Wänden gehen die Bildschirme aus. Einer nach dem anderen, im Kreis. #sprecher:erzaehler #klang:abschaltton #pause:2
-> aussage_victor

=== aussage_victor ===
Graham Hale steht bei den Sponsoren, ein Telefon in der Hand und eines am Ohr, und hat beide vergessen. Sein Gesicht ist grau. #sprecher:erzaehler
Das wusste ich nicht. Ich habe die Engine für das Training gebaut. Ich habe nie … #sprecher:grahamHale
Neben ihm steht Victor, im zu großen Pullover. Er geht los, quer durch die Halle, und stellt sich neben Nova. Nicht vor sie. Neben sie. #sprecher:erzaehler #musik:victor.warm
Ich hab es gesehen. In Silicon Bay, im Januar. Und ich hab es keinem gesagt, der etwas hätte tun können. #sprecher:victor
In Summit City hatte ich selbst eines in der Tasche. Ich hab es getragen. #sprecher:victor
* [Victor ansehen]
- Jemand hat mich gefragt, ob mir das Spaß macht. Vor einem Jahr, an einer Bushaltestelle. Ich hab ein Jahr für die Antwort gebraucht. #sprecher:victor
Niemand klatscht. Aber auf der Tribüne steht eine kleine, aufrechte Frau im dunkelblauen Kleid auf. Dann ein Mann mit Händen wie Schaufeln. #sprecher:erzaehler
Acht Clubs stehen. Nova sucht, und sie findet ihre Eltern. Sie stehen auch. #sprecher:erzaehler #pause:2
-> END

// ---------------------------------------------------------------- Halbfinale (Szene 106)

=== halbfinale_angebot ===
{
- ausgangCapitalArenaHalbfinale == "remis":
    Remis. Im Halbfinale braucht es einen Sieger. Ihr spielt noch einmal. #sprecher:turnierleiterin
- ausgangCapitalArenaHalbfinale == "niederlage":
    Verloren. Aber das Turnier erlaubt eine Wiederholungspartie. Noch einmal gegen Kade? #sprecher:turnierleiterin
- not halbfinaleVorherGesehen:
    -> halbfinale_vorher
}
-> halbfinale_wahl

// Roman Kapitel 63, vor der Partie: Kade ist nicht da; die vierte Karte mit goldenem Rand.
=== halbfinale_vorher ===
~ halbfinaleVorherGesehen = true
Kade Sterling gibt dir die Hand, ohne dich anzusehen. Er ist nicht unfreundlich. Er ist nicht da. #sprecher:erzaehler
Am Rand schwenkt der Funkprüfer sein Gerät, sieht auf die Anzeige und schüttelt den Kopf. #sprecher:erzaehler
Er sucht an der falschen Stelle. Seit das Mädchen ausgesagt hat, wissen sie, wonach er sucht. #sprecher:ambrose
Neben deinen Karten liegt eine vierte, die du nicht hingelegt hast. „Mentor-Zug“, mit einem goldenen Rand. #sprecher:erzaehler
Ein einziges Mal. Heute. Wenn du mich rufst, komme ich. Wenn nicht, schaue ich zu. Beides ist mir recht. #sprecher:ambrose
* [„Was passiert, wenn ich sie spiele?“]
- Dann spielen wir einen Zug zusammen. Nicht ich für dich. Wir. #sprecher:ambrose
* [„Und wenn nicht?“]
- Er lächelt. #sprecher:erzaehler
Dann erfahre ich, dass du mich nicht gebraucht hast. Das wäre auch ein schöner Tag. #sprecher:ambrose #stimmung:froh
-> halbfinale_wahl

=== halbfinale_wahl ===
+ [„Ich bin bereit.“]
    ~ beginnePartie("capitalArena.halbfinale")
    -> END
+ [„Noch einen Moment.“]
    -> END

// Geführter Moment im Halbfinale (begegnungen.json): der Turm. Ambrose rufen oder allein. Die Karte
// mit goldenem Rand und das Zugerraten des Turmzugs regelt die Partieansicht (Story-Bibel 34.3).
=== halbfinale_turm ===
Du siehst etwas. Keine Rettung. Einen Turm, und ein Feld mitten in seiner Stellung. Der Bauer würde fehlen, und dahinter ist sein König. #sprecher:erzaehler #musik:aus
Du zählst. Angreifer: drei. Verteidiger: einer. Zwei, wenn er richtig zieht. Ein Läufer, ein Feld zurück. Hält er? Es ist zu tief. #sprecher:erzaehler
* [„Ambrose.“]
    ~ ambroseImHalbfinaleGerufen = true
    -> halbfinale_zusammen
* [Allein prüfen]
    Du prüfst, so gut du kannst. Dann hoffst du. Und siehst ihm ins Gesicht. #sprecher:erzaehler #musik:held.allein
    -> END

=== halbfinale_zusammen ===
Er ist sofort da, so nah, dass du die Kälte spürst. #sprecher:erzaehler #musik:ambrose.suchend
Ich sehe es. Der Turm, {held}. Der Turm. #sprecher:ambrose
* [„Stimmt es?“]
- Er rechnet und kommt an dieselbe Stelle wie du, an den Läufer, der zurückgeht. Dahinter ist es dunkel. #sprecher:erzaehler
Ich weiß es nicht. Bis zum Läufer stimmt es. Danach ist es dunkel. Die Maschine weiß es. Ich nicht. Du nicht. #sprecher:ambrose #stimmung:lacht
* [„Zusammen.“]
- Zusammen. #sprecher:ambrose #musik:zusammen
Du fühlst seine Hand auf deiner, kalt und leicht wie Atem. #sprecher:erzaehler
-> END

// Roman Kapitel 63, nach dem Sieg: Kade und „Das ist meine unsterbliche Partie. Mit dir.“
=== halbfinale_danach ===
~ halbfinaleDanachGesehen = true
Kade sitzt da, in einem Schuh, und sieht auf seinen König. Du gehst um den Tisch und hältst ihm die Hand hin. Er nimmt sie. #sprecher:erzaehler
Ich hab ihn nicht gesehen. Ich hab seit dem Frühjahr kein Brett mehr angeguckt. Ich war mal richtig gut. In der achten Klasse. #sprecher:kade
* [„Dann bist du es noch. Frag Nova.“]
- {ambroseImHalbfinaleGerufen or mentorzugFreiGespielt: -> halbfinale_mit_dir}
Ambrose steht neben dem Brett. #sprecher:erzaehler
Du hast mich nicht gerufen. #sprecher:ambrose #stimmung:froh
Dann weiß ich jetzt, dass du mich nicht gebraucht hast. Das ist auch ein schöner Tag. #sprecher:ambrose #stimmung:froh
-> END

=== halbfinale_mit_dir ===
Ambrose sieht auf den geschlagenen Turm neben der Uhr. #sprecher:erzaehler #musik:mit.dir
Achtzehnhundertachtundfünfzig. Ein Turm, mitten in seine Stellung. #sprecher:ambrose
Er hebt die Hand, die auf deiner gelegen hat. Sie ist fast durchsichtig. #sprecher:erzaehler
Das ist meine unsterbliche Partie. Mit dir. #sprecher:ambrose #stimmung:froh #pause:2
* [„Sie war nicht makellos.“]
- Sie war das Schönste, was ich je gespielt habe. Und ich habe nur einen Zug gemacht. Und den nicht einmal allein. #sprecher:ambrose #stimmung:lacht
-> END

// ---------------------------------------------------------------- Victor: vor dem Finale und Finale

=== victor ===
{
- ausgangCapitalArenaHalbfinale != "sieg":
    {~Ich hab mein Gerät zu Hause gelassen. Für immer.|Wir sehen uns im Finale. Hoffentlich.|Mein Vater sitzt da oben. Er winkt nicht.} #sprecher:victor
    -> END
- not vorDemFinaleGesehen: -> vor_dem_finale
- ausgangCapitalArenaFinale == "" or ausgangCapitalArenaFinale == "abgebrochen": -> finale_angebot
- not finaleBesprochen: -> nach_dem_finale
- else:
    Revanche? Jederzeit. Aber nicht heute. Heute feiern wir. #sprecher:victor #stimmung:froh
    -> END
}

=== vor_dem_finale ===
{not halbfinaleDanachGesehen: -> halbfinale_danach}
~ vorDemFinaleGesehen = true
{
- mentorzugFreiGespielt:
    Das war meine unsterbliche Partie. Mit dir. #sprecher:ambrose #stimmung:friedlich
- else:
    Du hast mich nicht gerufen. Und trotzdem gewonnen. #sprecher:ambrose #stimmung:friedlich
}
Im Gang vor der Bühne stehen Victor und sein Vater. Graham Hale räuspert sich. #sprecher:erzaehler
Ich habe gerechnet und vergessen, wofür. Entschuldige, Victor. #sprecher:grahamHale
Ich spiel heute für mich. Und gegen meinen besten Gegner. #sprecher:victor
Mama drückt dir die Schulter. #sprecher:erzaehler
Spiel deine Partie. Ich hab meine verloren, und es war trotzdem schön, dass ich sie gespielt hab. #sprecher:mutter
Ich sage heute nichts. Das Brett gehört euch. #sprecher:ambrose #stimmung:friedlich
-> finale_angebot

=== finale_angebot ===
Finale auf der Bühne. Keine Karten, keine Sprüche. Nur ihr zwei. #sprecher:turnierleiterin
+ [„Ich bin bereit.“]
    ~ beginnePartie("capitalArena.finale")
    -> END
+ [„Gleich.“]
    -> END

=== nach_dem_finale ===
~ finaleBesprochen = true
{
- ausgangCapitalArenaFinale == "sieg":
    Landesmeisterschaft gewonnen! Die Halle steht auf. Victor reicht dir als Erster die Hand. #sprecher:erzaehler
    Du hast mich gezwungen, gut zu spielen. Und dann noch besser. #sprecher:victor #stimmung:froh
- ausgangCapitalArenaFinale == "remis":
    Remis. Der Titel wird geteilt. Die Turnierleiterin nennt es das schönste Remis des Turniers. #sprecher:erzaehler
    Zwei Meister. Das ist gerecht. #sprecher:victor #stimmung:froh
- else:
    Victor ist Landesmeister, du Vizemeister. Er umarmt dich trotzdem zuerst. #sprecher:erzaehler
    Du hast mich gezwungen, gut zu spielen. Danke. #sprecher:victor #stimmung:froh
}
Auf den Tribünen jubeln alle Städte zugleich. Draußen auf der Treppe ist es ruhiger. #sprecher:erzaehler
-> END

// ---------------------------------------------------------------- Die Gegner der Vorrunde

=== bea ===
{gespielt(ausgangCapitalArenaRunde1):
    Gut gespielt. Meine kleine Schwester Mae hat gesagt, du gibst nie auf. Stimmt. #sprecher:bea
- else:
    Bea Lindqvist. Ich spiele auf Remis, bis du einen Fehler machst. Meistens machst du einen. #sprecher:bea
}
-> END

=== marcus ===
{gespielt(ausgangCapitalArenaRunde2):
    Dieser stille Zug. Den hab ich nicht kommen sehen. Den sieht keiner kommen. #sprecher:marcus
- else:
    Marcus. Ich sehe jede Gabel. #sprecher:marcus
    Jede! Na gut, fast jede. #sprecher:marcus
}
-> END

=== nova ===
{
- gespielt(ausgangCapitalArenaRunde3):
    -> nova_nach_partie
- aussageGesehen and novaHilfeZugesagt:
    Du hast neben mir gestanden. Das vergesse ich nicht. Jetzt bin ich frei. #sprecher:nova #stimmung:froh
- aussageGesehen:
    Ich hab es gesagt. Alles. Jetzt bin ich frei. Und ein bisschen müde. #sprecher:nova
- else:
    Meine Hände zittern. Ohne Gerät ist alles so … laut. #sprecher:nova
    Spielst du trotzdem gegen mich? #sprecher:nova
}
-> END

// Roman Kapitel 61, nach der Partie: „Der war meiner.“
=== nova_nach_partie ===
{novaNachPartieGesehen:
    Ich hab es keine Sekunde gewusst. Die ganze Partie nicht. #sprecher:nova #stimmung:froh
    -> END
}
~ novaNachPartieGesehen = true
Nova sieht auf die Stellung, dann auf die Uhr, dann auf den kleinen Gegenstand, der in zwei Stunden kein einziges Mal gesummt hat. #sprecher:erzaehler #musik:nova
{
- ausgangCapitalArenaRunde3 == "remis": Ich hab nicht gewonnen. Ich hab nicht verloren. #sprecher:nova
- ausgangCapitalArenaRunde3 == "sieg": Ich hab verloren. Und ich weiß genau, wo. #sprecher:nova
- else: Ich hab gewonnen. Ich weiß nicht mal genau, wie. #sprecher:nova
}
Zum ersten Mal weiß ich nicht, ob ich gewinne. Ich hab es keine Sekunde gewusst. #sprecher:nova
Sie strahlt, mit dem ganzen Gesicht. #sprecher:erzaehler
Das fühlt sich gut an. Das fühlt sich so gut an. #sprecher:nova #stimmung:froh
* [„Dein Springer. Der war deiner.“]
- Ja. Der war meiner. #sprecher:nova #stimmung:froh
Auf der Tribüne sind ein Mann und eine Frau aufgestanden. Die Frau hat die Hand vor dem Mund. #sprecher:erzaehler
-> END

=== tobias ===
{gespielt(ausgangCapitalArenaRunde4):
    Du hast mich auf meiner eigenen Uhr erwischt. Respekt. #sprecher:tobias
- else:
    Tobias. Fünf Minuten sind eine Ewigkeit. #sprecher:tobias
    Für mich. Für dich gleich nicht mehr. #sprecher:tobias
}
-> END

=== kade ===
{
- ausgangCapitalArenaHalbfinale == "sieg" and not halbfinaleDanachGesehen: -> halbfinale_danach
- ausgangCapitalArenaHalbfinale == "sieg":
    Kade sitzt bei Nova. Sie stellt ihm eine Stellung auf. Er sieht hin. #sprecher:erzaehler
- vorrundeGeschafft:
    Kade Sterling. Ich spiele für Perfect Move. Wir sehen uns im Halbfinale. #sprecher:kade
- else:
    Ein Junge im Firmenpulli sitzt am Rand und tippt ans Ohr. Er sieht dich nicht an. #sprecher:erzaehler
}
-> END

// ---------------------------------------------------------------- Dr. Lin, Graham Hale, Tafel, Laden

=== lin ===
// Ende des Sammelstrangs „Spuren von Perfect Move“ (Dokument 15, 1.3): mit allen sechs Spuren
// zusätzliche Sätze und ein Album-Foto, ohne die Haupthandlung zu ändern.
{aussageGesehen and spurenPM >= 6 and not mappeGezeigt: -> lin_mappe}
{aussageGesehen:
    Ich verliere wohl meine Stelle. Dann gründe ich einen Club ohne Bildschirme. #sprecher:lin
- else:
    Wir haben eine Mappe dabei. Nach der Vorrunde. Dann reden wir. #sprecher:lin
}
-> END

=== lin_mappe ===
~ mappeGezeigt = true
Du legst Dr. Lin deine eigene Mappe hin: die Drohne, der Funkmast, der Messwagen, die Server, der Geysirantrag, der Greifarm. #sprecher:erzaehler
Das hier kenne ich. Woher hast du das? #sprecher:lin
Sie blättert lange. Damit wird unsere Aussage doppelt so schwer. Danke. Und bitte sei vorsichtig. #sprecher:lin
~ gibFund("fotoMappe")
Sechs Spuren, eine Mappe. Manchmal gewinnt man, indem man nur genau hinsieht. #sprecher:ambrose
-> END

=== graham_hale ===
{
- finaleBesprochen:
    Mein Sohn hat für sich gespielt. Und ich habe zum ersten Mal einfach nur zugesehen. #sprecher:grahamHale
- vorDemFinaleGesehen:
    Mein Sohn spielt im Finale. Für sich. Das hätte ich ihm früher erlauben sollen. #sprecher:grahamHale
- aussageGesehen:
    Ich habe nichts gewusst. Das ist keine Ausrede. Es ist schlimmer. #sprecher:grahamHale
- else:
    Graham Hale. Ich sponsere dieses Turnier. #sprecher:grahamHale
    Viel Glück. Nein, ehrlich: viel Glück. #sprecher:grahamHale
}
-> END

=== turniertafel ===
{
- vorrundeGeschafft:
    An der Tafel steht dein Name im Halbfinale. Darunter, mit Kreide: „Ehrlich gespielt.“ #sprecher:erzaehler
- else:
    An der Turniertafel steht dein Stand: {punktetext()} von 4 Punkten. Weiter geht es ab 2,5. #sprecher:erzaehler
}
-> END

=== fanshop ===
Am Fanshop gibt es Schals und Anstecker der Meisterschaft. #sprecher:erzaehler
~ oeffneLaden("capitalArena.fanshop")
-> END

// ---------------------------------------------------------------- Ansehen (Runde 6)

=== banner ===
{angesehenBanner:
    „Landesmeisterschaft“. Darunter hat jemand mit Bleistift einen kleinen Springer gemalt. #sprecher:erzaehler
    -> END
}
~ angesehenBanner = true
Über den Tribünen hängt ein langes Banner: „Landesmeisterschaft“. An einer Ecke hat sich die Naht gelöst und flattert. #sprecher:erzaehler
-> END

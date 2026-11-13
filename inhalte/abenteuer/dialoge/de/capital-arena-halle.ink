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
VAR zugerratenTurm = false
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
- gespielt(ausgangCapitalArenaRunde3) and not novaNachPartieGesehen: -> nova_nach_partie
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
Es stand in meinem Vertrag. Nicht so. Aber es stand drin. Ich hätte Nein sagen können. #sprecher:nova
Ich war vierzehn. Ich wollte gewinnen, dann wollte ich nicht mehr, und dann habe ich mich nicht mehr getraut. #sprecher:nova
Ich gebe die Titel zurück. Heute habe ich eine Partie ohne gespielt. #sprecher:nova
Es ist das einzige Ergebnis der letzten zwei Jahre, das mir gehört. #sprecher:nova #pause:2
* [Zusehen]
- Sie tritt zurück. #sprecher:erzaehler
-> aussage_lin

=== aussage_lin ===
Dr. Lin legt die Mappe auf den Tisch und eine Schachtel aus weißem Karton daneben, mit Mulden aus Schaumstoff. #sprecher:erzaehler
Vierundsiebzig Prozent im Training. Achtundneunzig im Turnier. Bei vier Spielern, über zwei Jahre. #sprecher:lin
Ich habe ihre Spielberichte unterschrieben. Ich habe sie nie so genau angesehen, wie ich es von jedem Schüler verlangt hätte. #sprecher:lin
Das ist mein Fehler, und er ist nicht klein. Die Kinder haben getan, was Erwachsene von ihnen verlangt haben. #sprecher:lin
* [Dr. Lin ansehen]
- Das Halbfinale wird unter Funkaufsicht gespielt. Perfect Move ist von der weiteren Leitung entbunden. #sprecher:turnierleiterin
Ich nenne einen Namen, weil er auf den Verträgen steht: Mr. Dorrance, Vertrieb. Er ist nicht mehr im Haus. #sprecher:turnierleiterin
* [Zu den Wänden sehen]
- An den Wänden gehen die Bildschirme aus. Einer nach dem anderen, im Kreis. #sprecher:erzaehler #klang:abschaltton #pause:2
-> aussage_victor

=== aussage_victor ===
Graham Hale steht bei den Sponsoren, ein Telefon in der Hand und eines am Ohr, und hat beide vergessen. Sein Gesicht ist grau. #sprecher:erzaehler
Das wusste ich nicht. Ich habe die Engine gebaut. Für das Training. Ich habe nie … #sprecher:grahamHale
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

// Geführter Moment im Halbfinale (begegnungen.json): der Zug. Ambrose rufen oder allein. Die Karte
// mit goldenem Rand und das Zugerraten regelt die Partieansicht (Story-Bibel 34.3). Das Zugerraten
// sucht den besten Engine-Zug der echten Partie; nur wenn es ein Turmzug ist (zugerratenTurm, setzt
// die Hülle), erzählen die Zeilen den Turm wie im Roman, sonst ohne Figur.
=== halbfinale_turm ===
{zugerratenTurm:Du siehst etwas. Keine Rettung. Einen Turm, und ein Feld mitten in seiner Stellung. Der Bauer würde fehlen, und dahinter ist sein König.|Du siehst etwas. Keine Rettung. Da ist ein Zug. Er sieht falsch aus, und dahinter ist sein König.} #sprecher:erzaehler #musik:aus
Du zählst Angreifer und Verteidiger. Dann suchst du den stillen Zug für ihn. Gibt es einen? Es ist zu tief. #sprecher:erzaehler
* [„Ambrose.“]
    ~ ambroseImHalbfinaleGerufen = true
    -> halbfinale_zusammen
* [Allein prüfen]
    Du prüfst, so gut du kannst. Dann hoffst du. Und siehst ihm ins Gesicht. #sprecher:erzaehler #musik:held.allein
    -> END

=== halbfinale_zusammen ===
Er ist sofort da, so nah, dass du die Kälte spürst. #sprecher:erzaehler #musik:ambrose.suchend
{zugerratenTurm:Ich sehe es. Der Turm, {held}. Der Turm.|Ich sehe es. Dieser Zug, {held}. Dieser Zug.} #sprecher:ambrose
* [„Stimmt es?“]
- Er rechnet und kommt an dieselbe Stelle wie du, an den stillen Zug für ihn. Dahinter ist es dunkel. #sprecher:erzaehler
Ich weiß es nicht. Bis dorthin stimmt es. Danach ist es dunkel. Die Maschine weiß es. Ich nicht. Du nicht. #sprecher:ambrose #stimmung:lacht
* [„Was machen wir?“]
- Was hast du in der Wüste gelernt? #sprecher:ambrose
* [„Prüfen, so gut man kann. Dann hoffen.“]
- Er hat kein Gesicht. Noch nicht. Aber jetzt, in einem Schuh, hat er eines. #sprecher:ambrose
* [„Zusammen.“]
- Zusammen. #sprecher:ambrose #musik:zusammen
Du fühlst seine Hand auf deiner, kalt und leicht wie Atem. #sprecher:erzaehler
Ein Raunen geht durch die Halle. Slick, irgendwo oben: „Was macht er da?“ Und Ward, ganz ruhig: „Er hofft.“ #sprecher:erzaehler #pause:2
-> END

// Roman Kapitel 63, nach dem Sieg: Kade und „Das ist meine unsterbliche Partie. Mit dir.“
=== halbfinale_danach ===
~ halbfinaleDanachGesehen = true
Kade sitzt da, in einem Schuh, und sieht auf seinen König. Er hat es zwei Jahre bei sich getragen, erst in der Tasche, zuletzt im Schuh. #sprecher:erzaehler
Du gehst um den Tisch und hältst ihm die Hand hin. Er nimmt sie. #sprecher:erzaehler
Ich hab ihn nicht gesehen. Ich hab seit dem Frühjahr kein Brett mehr angeguckt. Ich war mal richtig gut. In der achten Klasse. #sprecher:kade
* [„Dann bist du es noch. Frag Nova.“]
- {ambroseImHalbfinaleGerufen or mentorzugFreiGespielt: -> halbfinale_mit_dir}
Ambrose steht neben dem Brett. #sprecher:erzaehler
Du hast mich nicht gerufen. #sprecher:ambrose #stimmung:froh
Dann weiß ich jetzt, dass du mich nicht gebraucht hast. Das ist auch ein schöner Tag. #sprecher:ambrose #stimmung:froh
-> END

=== halbfinale_mit_dir ===
{zugerratenTurm:Ambrose sieht auf den geschlagenen Turm neben der Uhr.|Ambrose sieht auf das Brett, auf den Zug, den ihr zusammen gemacht habt.} #sprecher:erzaehler #musik:mit.dir
{zugerratenTurm:Achtzehnhundertachtundfünfzig. Ein Turm, mitten in seine Stellung.|Achtzehnhundertachtundfünfzig. Ein Zug, der falsch aussah, mitten in seine Stellung.} #sprecher:ambrose
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
// Roman Kapitel 64: der Gang hinter der Halle, drei Gespräche nacheinander (Hales, Mama, Ambrose).
{not halbfinaleDanachGesehen: -> halbfinale_danach}
~ vorDemFinaleGesehen = true
Hinter der Halle ist ein langer, kahler Gang mit Neonlicht und einem Getränkeautomaten. #sprecher:erzaehler #musik:aus #geraeusch:gang
Du sitzt auf dem Boden und wartest, dass deine Hände aufhören zu zittern. #sprecher:erzaehler
Am anderen Ende stehen Graham Hale und Victor. Der Gang trägt jedes Wort. Graham hält kein Telefon in der Hand. #sprecher:erzaehler
Acht Jahre habe ich jede Partie nachgerechnet. Ich bin kein Spieler. Ich bin Ingenieur. Ich kann messen. #sprecher:grahamHale
* [Weghören wollen]
- Du hast mit sieben gegen mich gewonnen. Am nächsten Morgen habe ich gedacht, ich halte dich auf. #sprecher:grahamHale
Ich wollte nur noch eine. Mit dir. Ich hab acht Jahre lang jeden Abend gedacht, heute fragt er. #sprecher:victor
* [Nicht hinsehen]
- Es ist lange still. #sprecher:erzaehler #pause:2
Ich habe gerechnet und vergessen, wofür. Entschuldige, Victor. #sprecher:grahamHale #musik:hale.victor
Du hörst, wie zwei Menschen einander festhalten, ungeschickt, wie Leute, die es lange nicht getan haben. #sprecher:erzaehler
Ich spiel heute für mich. Und gegen meinen besten Gegner. Du darfst zugucken. Aber du darfst nichts aufschreiben. #sprecher:victor
Ich weiß nicht, ob ich das kann. #sprecher:grahamHale
Probier’s. Es ist luftig. #sprecher:victor
-> vor_dem_finale_mama

=== vor_dem_finale_mama ===
Mama kommt den Gang herunter und setzt sich neben dich auf den Boden. #sprecher:erzaehler #musik:mama.ruhig
Ich hatte auch mal so ein Finale. Ich hab fünfundzwanzig Jahre gedacht, das Verlieren sei das Wichtigste daran. #sprecher:mutter
Ich hab das Formular wieder angeguckt. Nicht Zug dreiunddreißig. Die anderen zweiunddreißig. Die waren richtig gut. #sprecher:mutter
* [Mama ansehen]
- Spiel deine Partie. Ich hab meine verloren, und es war trotzdem schön, dass ich sie gespielt hab. #sprecher:mutter
Und guck auf die Grundreihe. #sprecher:mutter
-> vor_dem_finale_ambrose

=== vor_dem_finale_ambrose ===
Ambrose steht am Getränkeautomaten, als versuche er ein letztes Mal, etwas zu verstehen. #sprecher:erzaehler #musik:ambrose.scherzo
* [„Man wirft Geld hinein, und es fällt etwas heraus.“]
- Das habe ich begriffen. Ich frage mich nur, wer darin sitzt. #sprecher:ambrose #stimmung:lacht
Ich sage heute nichts. Kein Wort, nicht vorher, nicht währenddessen. Keine Karten. Das Brett gehört euch. #sprecher:ambrose
Ich stehe hinten, bei der Großmeisterin. Sie dreht jedes Mal den Kopf, wenn ich neben ihr stehe. #sprecher:ambrose #stimmung:froh
Ich will sehen, was du tust, wenn niemand neben dir steht. Nicht zu wissen, was du ziehst. Das Beste seit hundertsechzig Jahren. #sprecher:ambrose
Aus der Halle kommt ein Gong. Deine Hände zittern nicht mehr. #sprecher:erzaehler #klang:gong #pause:2
* [Aufstehen]
- -> finale_angebot

=== finale_angebot ===
// Roman Kapitel 65: ein Tisch im Lichtkreis; keine Karten, keine Hilfen, Ambrose nicht im Bild.
Auf der Bühne steht ein einziger Tisch mit einem Brett aus Holz, unter einem Scheinwerfer. Du siehst nur den Lichtkreis. #sprecher:erzaehler #musik:aus
Victor kommt im zu großen Pullover. Er dreht vor der Schiedsrichterin die Taschen nach außen, obwohl niemand es verlangt. #sprecher:erzaehler
Keine Karten. Keine Hilfen. #sprecher:turnierleiterin
+ [„Ich bin bereit.“]
    Seine Hand ist trocken und warm. #sprecher:erzaehler
    ~ beginnePartie("capitalArena.finale")
    -> END
+ [„Gleich.“]
    -> END

=== nach_dem_finale ===
~ finaleBesprochen = true
{
- ausgangCapitalArenaFinale == "sieg":
    Victor legt seinen König mit einem Finger um. Die Halle ist still. Sie weiß noch nicht, was sie gesehen hat. #sprecher:erzaehler
    Dann fängt er an zu lachen, das helle Lachen von der Bergstation. Er nimmt deine Hand mit beiden Händen. #sprecher:erzaehler
    Hast du es gesehen? Bis zum Ende? #sprecher:victor #stimmung:lacht
- ausgangCapitalArenaFinale == "remis":
    Remis. Victor sieht auf das Brett und fängt an zu lachen. Er nimmt deine Hand mit beiden Händen. #sprecher:erzaehler
    Hast du gesehen, wie wir gespielt haben? #sprecher:victor #stimmung:lacht
- else:
    Du legst deinen König um. Victor sieht auf das Brett und fängt an zu lachen. Er nimmt deine Hand mit beiden Händen. #sprecher:erzaehler
    Du hast mich gezwungen, gut zu spielen. Danke. #sprecher:victor #stimmung:lacht
}
* {ausgangCapitalArenaFinale == "sieg"} [„Nein. Nur bis zum sechsten Zug. Ich hab gehofft.“]
* {ausgangCapitalArenaFinale != "sieg"} [„Jeden Zug.“]
- -> finale_lauf

// Victors Lauf zum Vater, bei jedem Ausgang (Story-Bibel, Szene 108); Musik victor.lauf.
=== finale_lauf ===
Er reißt das Formular vom Tisch und rennt. Von der Bühne, durch den Mittelgang, das Blatt hoch über dem Kopf wie eine Fahne. #sprecher:erzaehler #musik:victor.lauf
Vater! Guck dir an, wie wir gespielt haben! Das ist die schönste Partie, die ich je … #sprecher:victor #stimmung:lacht
Der Rest geht unter. Ein Pfiff auf zwei Fingern, eine Trompete, Big Joe brüllt etwas mit „Kumpel“, Mira schreit: „Noch mal! Jetzt!“ #sprecher:erzaehler
Juno rennt in dich hinein. Sie hat beide Tagebücher verloren und merkt es nicht. #sprecher:erzaehler
Wie soll ich das denn aufschreiben? #sprecher:juno #stimmung:froh
* [Über ihre Schulter sehen]
- Ganz hinten an der Wand steht Ward und hat den Kopf zur Seite gedreht, als stünde jemand neben ihr. #sprecher:erzaehler
Neben ihr ist ein hellerer Fleck vor der Wand, schmal, hochgeschlossen. Er sieht Victor nach. #sprecher:erzaehler
{ausgangCapitalArenaFinale == "sieg":Du kannst ihn nicht hören. Aber du siehst seine Lippen: Er läuft zum Telegrafenamt.|Du kannst ihn nicht hören. Aber du siehst, dass er lächelt.} #sprecher:erzaehler #pause:2
Die Siegerehrung vergisst du. Es gibt einen Pokal, der zu groß ist, und Hände, viele. #sprecher:erzaehler
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
- gespielt(ausgangCapitalArenaRunde3) and not novaNachPartieGesehen:
    -> nova_nach_partie
- aussageGesehen and novaHilfeZugesagt:
    Du hast neben mir gestanden. Das vergesse ich nicht. Jetzt bin ich frei. #sprecher:nova #stimmung:froh
- aussageGesehen:
    Ich hab es gesagt. Alles. Jetzt bin ich frei. Und ein bisschen müde. #sprecher:nova
- gespielt(ausgangCapitalArenaRunde3):
    Ich hab es keine Sekunde gewusst. Die ganze Partie nicht. #sprecher:nova #stimmung:froh
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
- else: Ich hab gewonnen. Ohne. #sprecher:nova
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
    Kade Sterling sieht auf einen Punkt über deiner Schulter. Er ist nicht unfreundlich. Er ist nicht da. #sprecher:erzaehler
- else:
    Ein Junge in Weiß sitzt am Rand, beide Hände auf dem Tisch. Er hält den Kopf ganz gerade. #sprecher:erzaehler
}
-> END

// ---------------------------------------------------------------- Dr. Lin, Graham Hale, Tafel, Laden

=== lin ===
// Ende des Sammelstrangs „Spuren von Perfect Move“ (Dokument 15, 1.3): mit allen sechs Spuren
// zusätzliche Sätze und ein Album-Foto, ohne die Haupthandlung zu ändern.
{aussageGesehen and spurenPM >= 6 and not mappeGezeigt: -> lin_mappe}
{aussageGesehen:
    Ich habe gekündigt, bevor wir hergefahren sind. Der Club ist in einem Keller. Ein Heizlüfter, kein einziger Bildschirm. #sprecher:lin
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
Sechs Spuren. Du hast hingesehen, wo andere vorbeigegangen sind. #sprecher:ambrose
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

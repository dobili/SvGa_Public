// Ort: Konzern-Akademie in Silicon Bay, Glasbüro mit Bildschirmbrettern (Akt 3). Figuren: Dr. Lin,
// Nova, Theo.
//
// Szenen der Story-Bibel (Abschnitt 20): 55 Die Akademie (akt3.akademie), 58 Aufgabenreihe
// (Runden siliconBay.reiheTheo, siliconBay.reiheNova), 59 Warum man im Club schweigt (S2), 60
// Clubkampf (Begegnung siliconBay.clubkampf), dazu Theos Geschenk (Tablet mit ZERO) und der Weg in
// den Serverraum nach den Spielberichten (Szene 56, Variable serverraumOffen für orte.json).
// Einstiege wie in orte.json: lin, nova, theo, serverraum_zu. Die Hauptquest siliconBay.akademie
// wartet auf den Knoten „lin“; deshalb steht dort vor dem Verzweigen eine Zeile.
//
// Runde 11 (13.11.2026): Dr. Lin, Theo und Nova nach dem Roman (roman/akt3_teil1.md, Kapitel 32):
// Lins drei Fragen, Theos Kurve („menschlich“), ZERO spielt in zwölf Sekunden, Ambrose gebannt.
// Klang nach 21_Klangplan.md (zero, ambrose.gebannt). „Später“ nur in Akt 1, hier „Nicht jetzt.“.
// Kapitel 33: Ambrose verbietet das „Hm“ im Club, nach dem Sieg sagt Dr. Lin einmal „Sie“ und
// schaltet den Tisch aus (abschaltton, dann Stille S48); im Clubkampf ein Moment bei Zug 15.
//
// Variablen: reiheTheoBestanden, reiheNovaBestanden, siliconBayAuswertungBestanden,
// ausgangSiliconBayClubkampf und nadelSiliconBay setzt die Hülle (R42); ohrempfaengerGefunden setzt
// silicon-bay-serverraum.ink, zeroTabletGeschenkt merkt Theos Geschenk. clubkampfSiliconBayBesprochen und clubkampfSiliconBayNadel wie in Riverton.

EXTERNAL beginnePartie(begegnung)
EXTERNAL beginneAufgaben(runde)
EXTERNAL gibFund(kennung)

VAR held = "Du"
VAR linGetroffen = false
VAR theoGetroffen = false
VAR novaGetroffen = false
VAR schweigenErklaert = false
VAR serverraumOffen = false
VAR reiheTheoBestanden = false
VAR reiheNovaBestanden = false
VAR siliconBayAuswertungBestanden = false
VAR ohrempfaengerGefunden = false
VAR zeroTabletGeschenkt = false
VAR ausgangSiliconBayClubkampf = ""
VAR nadelSiliconBay = 0
VAR clubkampfSiliconBayBesprochen = false
VAR clubkampfSiliconBayNadel = 0

// ---------------------------------------------------------------- Dr. Lin

=== lin ===
{~Auf den Bildschirmbrettern laufen stumme Partien.|Dr. Lin räumt ein einziges Holzbrett auf ihrem Schreibtisch gerade.|Irgendwo summt ein Lüfter, sonst ist es still.} #sprecher:erzaehler
{
- not linGetroffen: -> lin_erstes_treffen
- nadelSiliconBay > clubkampfSiliconBayNadel: -> lin_nach_sieg
- clubkampfSiliconBayBesprochen: -> lin_alltag
- not (reiheTheoBestanden and reiheNovaBestanden): -> lin_reihe_offen
- not schweigenErklaert: -> lin_schweigen
- nadelSiliconBay == 0 and ausgangSiliconBayClubkampf == "niederlage": -> lin_nach_niederlage
- else: -> lin_clubkampf
}

=== lin_erstes_treffen ===
~ linGetroffen = true
Ein Raum ohne Ecken. Dreißig Plätze im Halbkreis, in jeden Tisch ist ein leuchtendes Brett eingelassen. Es riecht nach nichts. #sprecher:erzaehler
Die Frau, die auf dich zukommt, sieht dir als Erste in dieser Stadt in die Augen. Auf ihrem Kittel: „Dr. E. Lin“. #sprecher:erzaehler
Du bist das Kind mit den vier Nadeln. Victor hat von dir erzählt. Er erzählt sonst von niemandem. #sprecher:lin #stimmung:froh
* [„Vier. Fünf bald.“]
- Ich bringe hier Kindern Schach bei. Vierzig im Jahr. Früher acht, in einem Keller mit Heizlüfter. #sprecher:lin #stimmung:laechelt
Die Bildschirme zeigen jedem sofort den Fehler. Kein Kind muss warten, bis ich Zeit habe. #sprecher:lin #stimmung:laechelt
Sie zögert. #sprecher:erzaehler #pause
Glaube ich. #sprecher:lin #stimmung:nachdenklich
Drei Ziele in der Eröffnung? Welches vergisst man am leichtesten? #sprecher:lin #stimmung:laechelt
* [„Zentrum, Entwicklung, König. Das dritte.“]
- Warum? #sprecher:lin #stimmung:nachdenklich
* [„Weil man gerade angreift.“]
- Sie lächelt. #sprecher:erzaehler
Wer hat dir das beigebracht? #sprecher:lin #stimmung:froh
* [„Eine Mathelehrerin. Ein Kurier. Ein Kranführer. Und Mama.“]
- Und ich. #sprecher:ambrose #stimmung:traurig
Bevor du gegen mich spielst, fragen dich Theo und Nova ab. So ist es hier üblich. #sprecher:lin #stimmung:laechelt
-> END

=== lin_reihe_offen ===
{not reiheTheoBestanden:
    Theo zuerst. Er misst alles. Lass dich nicht verunsichern. #sprecher:lin #stimmung:laechelt
- else:
    Theo ist zufrieden. Jetzt Nova. Sie kennt jede Falle. #sprecher:lin #stimmung:laechelt
}
-> END

=== lin_schweigen ===
~ schweigenErklaert = true
Du hast die Reihe bestanden. Morgen früh spielen wir. #sprecher:lin #stimmung:laechelt
Am Morgen probierst du etwas vor dem Spiegel. Ein Gesicht, ein „Hm“. #sprecher:erzaehler
Nein. #sprecher:ambrose #stimmung:streng
* [„Bei Dash hat es …“]
- Am Brett eines Clubs schweigt man. Im Park redet man. #sprecher:ambrose #stimmung:streng
Im Park spielt man um eine Limonade. Im Club um die Ehre des anderen. #sprecher:ambrose #stimmung:nachdenklich
Wer ihn dort stört, nimmt ihm nicht die Zeit. Er nimmt ihm die Partie weg. Und die gehört euch beiden. #sprecher:ambrose #stimmung:nachdenklich
Du lässt es. #sprecher:erzaehler
-> lin_clubkampf

=== lin_clubkampf ===
Bereit? Ich spiele, was die Theorie sagt. Mal sehen, was du dagegen hast. #sprecher:lin #stimmung:laechelt
+ [„Ich bin bereit.“]
    ~ beginnePartie("siliconBay.clubkampf")
    -> END
* [„Noch nicht.“]
    Nimm dir Zeit. Gute Eröffnungen brauchen Ruhe. #sprecher:lin #stimmung:laechelt
    -> END

=== lin_nach_niederlage ===
Gut gespielt bis zum Mittelspiel. Danach habe ich die Theorie noch einmal nachgespielt. #sprecher:lin #stimmung:laechelt
Sie spielt wie eine sehr gute Seite in einem sehr guten Buch. Lass sie das Buch zuklappen, {held}. #sprecher:ambrose #stimmung:laechelt
+ [„Noch einmal.“]
    ~ beginnePartie("siliconBay.clubkampf")
    -> END
* [„Nicht jetzt.“]
    -> END

=== lin_nach_sieg ===
~ clubkampfSiliconBayNadel = nadelSiliconBay
{clubkampfSiliconBayBesprochen:
    Eine bessere Nadel. Ich schreibe es in mein Heft. Mit Tinte. #sprecher:lin #stimmung:froh #klang:fanfare.gedaempft
    -> END
}
~ clubkampfSiliconBayBesprochen = true
{ausgangSiliconBayClubkampf == "remis":
    Remis. Ehrlich erkämpft. Die Nadel gehört dir. #sprecher:lin #stimmung:laechelt #klang:fanfare.gedaempft
    -> lin_tisch_aus
}
Dr. Lin sitzt lange still. Dann nimmt sie die Nadel aus der Kitteltasche: klares Glas, darin ein einzelner Bauer. #sprecher:erzaehler #klang:fanfare.gedaempft
Ich habe Sie nichts gelehrt. Sie mich. #sprecher:lin #stimmung:laechelt
Sie sagt „Sie“. Zu dir. Einmal. #sprecher:erzaehler
-> lin_tisch_aus

// Kapitel 33: Die Tische zeigen den Fehler, nicht die Angst. Danach wirkliche Stille (S48).
=== lin_tisch_aus ===
{ausgangSiliconBayClubkampf == "remis":Weißt du|Wissen Sie}, was die Tische nicht zeigen? Wo der Fehler war, ja. Nicht, warum man Angst hatte. #sprecher:lin #stimmung:nachdenklich
Sie schaltet den Tisch aus. Darunter nur schwarzes Glas, in dem ihr euch beide spiegelt. #sprecher:erzaehler #klang:abschaltton #musik:aus #geraeusch:aus #pause:4
Ich habe die Spielberichte meiner Klasse nie so genau angesehen. #sprecher:lin #stimmung:ernst
* [Schweigen]
- {ohrempfaengerGefunden:Du hast es versprochen. Aber sie hat deinen Blick gesehen. Und sie ist eine Lehrerin.|Sie sieht dich an, als warte sie auf etwas. Du weißt nicht, worauf.} #sprecher:erzaehler
-> END

=== lin_alltag ===
{~Ich habe die Spielberichte meiner Klasse noch einmal angesehen. Ich schlafe schlecht.|Komm wieder, wenn du eine neue Eröffnung probieren willst.|Die Bildschirme helfen. Glaube ich.} #sprecher:lin #stimmung:nachdenklich
+ {nadelSiliconBay < 3} [„Revanche um eine bessere Nadel?“]
    Gern. Diesmal ohne Theorie. #sprecher:lin #stimmung:laechelt
    ~ beginnePartie("siliconBay.clubkampf")
    -> END
+ [„Bis bald.“]
    -> END

// ---------------------------------------------------------------- Theo

=== theo ===
{~Theo tippt auf einer Tabelle mit Zahlen.|Auf Theos Bildschirm wandern Kurven nach oben.|Theo murmelt Prozente vor sich hin.} #sprecher:erzaehler
{
- not theoGetroffen: -> theo_erstes_treffen
- siliconBayAuswertungBestanden and not serverraumOffen: -> theo_serverraum
- not linGetroffen: -> theo_erst_lin
- not reiheTheoBestanden: -> theo_reihe
- else: -> theo_alltag
}

=== theo_erstes_treffen ===
~ theoGetroffen = true
Ein Junge in deinem Alter sieht auf einen zweiten Bildschirm, über den Zahlen laufen. Jetzt dreht er sich um. #sprecher:erzaehler
Spiel eine. Gegen Stufe sechs. Ich will deine Kurve sehen. #sprecher:theo #stimmung:nachdenklich
Er heißt Theo. Er meint es nicht unhöflich. Bei jedem deiner Züge zuckt auf seinem Bildschirm eine Linie. #sprecher:erzaehler
Einundsiebzig Prozent. Genauigkeit. Das ist … menschlich. #sprecher:theo #stimmung:nachdenklich
* [„Ist das gut?“]
- Der Durchschnitt eines sehr guten Vereinsspielers. Victor hat neunundachtzig. Nova im Turnier achtundneunzig. #sprecher:theo #stimmung:nachdenklich
Er runzelt die Stirn über der letzten Zahl. Nur kurz. #sprecher:erzaehler
Du machst im Mittelspiel alle elf Züge einen Fehler. Den kann man wegtrainieren. Hier. #sprecher:theo #stimmung:nachdenklich
-> theo_tablet

// Kapitel 32: Theos Geschenk. ZERO spielt gegen sich selbst, Ambrose kann nicht wegsehen.
=== theo_tablet ===
~ zeroTabletGeschenkt = true
~ gibFund("zeroTablet")
Er hält dir ein Tablet hin. Weiß, dünn, mit dem Zeichen des Konzerns. #sprecher:erzaehler
Geschenkt. Da ist ZERO drauf. Die volle Fassung. #sprecher:theo #stimmung:laechelt
Damit trainierst du in einer Woche mehr als in einem Jahr. #sprecher:theo #stimmung:laechelt
* [„Was ist ZERO?“]
- Theo sieht dich an, als hättest du gefragt, was Wasser ist. #sprecher:erzaehler
Die Maschine. Die, die nie verliert. #sprecher:theo #stimmung:nachdenklich
Weiß und Schwarz bauen sich auf, und es spielt gegen sich selbst. Die Züge fallen wie Regen. #sprecher:erzaehler #musik:zero
Zwölf Sekunden, vielleicht dreizehn, und der schwarze König liegt um. #sprecher:erzaehler
Ambrose steht über das Tablet gebeugt. So hast du ihn noch nie stehen sehen. #sprecher:erzaehler
Noch einmal. #sprecher:ambrose #stimmung:gebannt #musik:ambrose.gebannt
* [Noch einmal tippen]
- Eine andere Partie. Ein Opfer in der Mitte, ein Turm, der stehen bleibt, und alles fällt ineinander wie ein Uhrwerk. #sprecher:erzaehler
Kein einziger Fehler. Nicht einer. Hast du das gesehen? #sprecher:ambrose #stimmung:gebannt
Der Turm. Sie hat ihn hängen lassen, sieben Züge lang, und sie wusste. Sie wusste es einfach. #sprecher:ambrose #stimmung:gebannt
* [„Ambrose.“]
- Noch einmal. #sprecher:ambrose #stimmung:gebannt #pause:2
Neben dir ist es still geworden. #sprecher:erzaehler
-> END

=== theo_erst_lin ===
Die Abfrage machen wir offiziell. Melde dich erst bei Dr. Lin, dann messe ich. #sprecher:theo
-> END

=== theo_reihe ===
Eröffnungsgrundsätze. Ich will sehen, ob du sie kennst oder nur benutzt. #sprecher:theo #stimmung:nachdenklich
+ [Die Aufgaben lösen]
    ~ beginneAufgaben("siliconBay.reiheTheo")
    -> END
* [„Nicht jetzt.“]
    Ich speichere den Termin. #sprecher:theo
    -> END

=== theo_serverraum ===
~ serverraumOffen = true
Du hast dir die Berichte angesehen. #sprecher:theo #stimmung:nachdenklich
Die Rohdaten liegen unten. Im Serverraum. Da schließt keiner ab. Hier wird alles gefilmt. #sprecher:theo #stimmung:nachdenklich
-> END

=== theo_alltag ===
{~Du hast deine Genauigkeit gesteigert. Zwei Prozent. Nicht schlecht für einen Menschen.|Ich glaube Zahlen. Aber ich glaube auch dir. Komisch, oder?|ZERO hat heute wieder gewonnen. Gegen sich selbst. Ist das ein Sieg?} #sprecher:theo #stimmung:laechelt
-> END

// ---------------------------------------------------------------- Nova

=== nova ===
{
- not novaGetroffen: -> nova_erstes_treffen
- not reiheTheoBestanden: -> nova_erst_theo
- not reiheNovaBestanden: -> nova_reihe
- ohrempfaengerGefunden: -> nova_danach
- else: -> nova_alltag
}

=== nova_erstes_treffen ===
~ novaGetroffen = true
Auf der Fensterbank sitzt Nova Sinclair, die Knie angezogen. Vor ihr eine Kamera auf dem Stativ, das rote Licht ist aus. #sprecher:erzaehler
Als sie merkt, dass du sie ansiehst, lächelt sie. Das Lächeln vom Podium in Riverton. Es geht an und wieder aus. #sprecher:erzaehler #pause
-> END

=== nova_erst_theo ===
Erst Theo. Er braucht seine Zahlen, sonst wird er nervös. #sprecher:nova #stimmung:laechelt
-> END

=== nova_reihe ===
Fallen. Ich kenne jede. Die Frage ist, ob du sie siehst, bevor du reinfällst. #sprecher:nova #stimmung:laechelt
+ [Die Aufgaben lösen]
    ~ beginneAufgaben("siliconBay.reiheNova")
    -> END
* [„Nicht jetzt.“]
    -> END

=== nova_danach ===
Nova sieht dich an und dann schnell weg. #sprecher:erzaehler
Noch nicht. Bitte. #sprecher:nova #stimmung:ernst
-> END

=== nova_alltag ===
{~Ein Foto? Nein? Gut. Ich mag Fotos eigentlich nicht.|Du spielst, als würde es dir Spaß machen. Wie machst du das?|Ich muss gleich zu einem Termin. Ich hab immer einen Termin.} #sprecher:nova #stimmung:nachdenklich
-> END

// ---------------------------------------------------------------- Serverraum-Tür

=== serverraum_zu ===
{serverraumOffen:
    Die Tür zum Serverraum steht einen Spalt offen. Kalte Luft weht heraus. #sprecher:erzaehler
- else:
    Auf der Tür steht „Serverraum – nur Personal“. Sie ist nicht abgeschlossen. Du hast dort unten nichts zu suchen. Noch nicht. #sprecher:erzaehler
}
-> END

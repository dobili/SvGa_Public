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
    Runde 1 gegen Bea Lindqvist. Sie verteidigt alles. Geduld gewinnt. #sprecher:turnierleiterin
    -> runde1_spielen
- not gespielt(ausgangCapitalArenaRunde2) or (alleGespielt() and ausgangCapitalArenaRunde2 != "sieg"):
    Runde 2 gegen Marcus Oyelaran. Er sieht jede Gabel. #sprecher:turnierleiterin
    -> runde2_spielen
- not gespielt(ausgangCapitalArenaRunde3) or (alleGespielt() and ausgangCapitalArenaRunde3 != "sieg"):
    Runde 3 gegen Nova. Sie spielt heute ohne Gerät, sagt sie. #sprecher:turnierleiterin
    -> runde3_spielen
- else:
    Runde 4 gegen Tobias Wren, mit fester Uhr: fünf Minuten und drei Sekunden je Zug. #sprecher:turnierleiterin
    -> runde4_spielen
}

=== runde1_spielen ===
* [„Ich bin bereit.“]
    ~ beginnePartie("capitalArena.runde1")
    -> END
* [„Noch einen Moment.“]
    Natürlich. Die Bretter warten. #sprecher:turnierleiterin
    -> END

=== runde2_spielen ===
* [„Ich bin bereit.“]
    ~ beginnePartie("capitalArena.runde2")
    -> END
* [„Noch einen Moment.“]
    Natürlich. Die Bretter warten. #sprecher:turnierleiterin
    -> END

=== runde3_spielen ===
* [„Ich bin bereit.“]
    ~ beginnePartie("capitalArena.runde3")
    -> END
* [„Noch einen Moment.“]
    Natürlich. Die Bretter warten. #sprecher:turnierleiterin
    -> END

=== runde4_spielen ===
* [„Ich bin bereit.“]
    ~ beginnePartie("capitalArena.runde4")
    -> END
* [„Noch einen Moment.“]
    Natürlich. Die Bretter warten. #sprecher:turnierleiterin
    -> END

=== vorrunde_geschafft ===
~ vorrundeGeschafft = true
Die Turnierleiterin schreibt deinen Namen an die Tafel, ganz oben. #sprecher:erzaehler
{punktetext()} von 4 Punkten. Du stehst im Halbfinale. Gratuliere. #sprecher:turnierleiterin
Juno springt auf der Tribüne auf und ruft deinen Namen. #sprecher:erzaehler
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
~ aussageGesehen = true
{
- novaHilfeZugesagt:
    Am Pressetisch steht Nova neben Dr. Lin. Du stellst dich an ihre andere Seite, wie versprochen. #sprecher:erzaehler
- novaBitteGehoert:
    Am Pressetisch steht Nova neben Dr. Lin. Sie sucht im Saal, bis sie dich findet. Dann atmet sie aus. #sprecher:erzaehler
- else:
    Am Pressetisch steht Nova neben Dr. Lin, sehr gerade und sehr blass. #sprecher:erzaehler
}
Die Turnierleiterin hört zu, Graham Hale auch. #sprecher:erzaehler
Bei Perfect Move haben wir mit Geräten gespielt. Mit einem Empfänger im Ohr. Ich auch. #sprecher:nova #stimmung:ernst
Dr. Lin legt die Spielberichte auf den Tisch und daneben den kleinen Empfänger aus dem Serverraum. #sprecher:erzaehler
Achtundneunzig Prozent Genauigkeit mit Gerät, vierundsiebzig ohne. Die Zahlen lügen nicht. #sprecher:lin
Graham Hale wird blass. Er hat davon nichts gewusst. #sprecher:erzaehler
Victor stellt sich neben Nova. „Ich hab es gesehen. In Silicon Bay.“ #sprecher:erzaehler
{
- novaHilfeZugesagt:
    Nova greift kurz nach deiner Hand. „Danke. Allein hätte ich es mir anders überlegt.“ #sprecher:erzaehler
- novaBitteGehoert:
    Nova nickt dir zu. Sie hat es allein geschafft, und du warst im Saal. #sprecher:erzaehler
}
Im Halbfinale läuft ein Funkprüfer mit. Wer ein Gerät trägt, wird gefunden. #sprecher:turnierleiterin
Wer ehrlich spielt, hat nichts zu fürchten. Das gilt auch für Erwachsene. #sprecher:ambrose
-> END

// ---------------------------------------------------------------- Halbfinale (Szene 106)

=== halbfinale_angebot ===
{
- ausgangCapitalArenaHalbfinale == "niederlage" or ausgangCapitalArenaHalbfinale == "remis":
    {ausgangCapitalArenaHalbfinale == "remis":
        Remis. Im Halbfinale braucht es einen Sieger. Ihr spielt noch einmal. #sprecher:turnierleiterin
    - else:
        Verloren. Aber das Turnier erlaubt einen Neustart. Noch einmal gegen Kade? #sprecher:turnierleiterin
    }
- else:
    Halbfinale gegen Kade Sterling. Ein Funkprüfer läuft mit. #sprecher:turnierleiterin
    Ein einziges Mal. Wenn du mich rufst, komme ich. Wenn nicht, schaue ich zu. #sprecher:ambrose #stimmung:friedlich
}
* [„Ich bin bereit.“]
    ~ beginnePartie("capitalArena.halbfinale")
    -> END
* [„Noch einen Moment.“]
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
* [„Ich bin bereit.“]
    ~ beginnePartie("capitalArena.finale")
    -> END
* [„Gleich.“]
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
    Zum ersten Mal weiß ich nicht, ob ich gewinne. Das fühlt sich gut an. #sprecher:nova #stimmung:froh
- aussageGesehen and novaHilfeZugesagt:
    Du hast neben mir gestanden. Das vergesse ich nicht. Jetzt bin ich frei. #sprecher:nova #stimmung:froh
- aussageGesehen:
    Ich hab es gesagt. Alles. Jetzt bin ich frei. Und ein bisschen müde. #sprecher:nova
- else:
    Meine Hände zittern. Ohne Gerät ist alles so … laut. #sprecher:nova
    Spielst du trotzdem gegen mich? #sprecher:nova
}
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
- ausgangCapitalArenaHalbfinale == "sieg":
    Kade sitzt allein am Brett. Ohne das Signal sieht er sehr jung aus. „Ich wollte nur gewinnen.“ #sprecher:erzaehler
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

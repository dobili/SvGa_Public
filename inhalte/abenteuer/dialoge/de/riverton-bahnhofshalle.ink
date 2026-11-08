// Ort: Bahnhofshalle von Riverton (Akt 2). Figuren: Mr. Harlan, Pops. Gegenstände: große Uhr,
// Zeitungsstand, Funde Zeitungsausschnitt und Taubenfeder; Dialog-Auslöser zugCedar.
//
// Szenen der Story-Bibel (Abschnitt 11): 30 Pops’ Zeitungsstand (Laden riverton.zeitungsstand),
// 31 Der Uhrmacher (Begegnung riverton.harlan, Wahl der Zeitklasse), 35 Flashback London 1851
// (die Uhr reist in die Erinnerung erinnerungLondon, dort am Schachtisch die Runde
// riverton.flashbackLondon; Quest riverton.flashbackLondon, erst nach den Bildschirmtischen),
// Rätsel Mr. Odums letzte Aufgabe (Runde riverton.odumAufgabe, Quest riverton.odum).
// Einstiege wie in orte.json: harlan, pops, zug, uhr, zeitungsstand, fund_zeitungsausschnitt,
// fund_taubenfeder.
//
// Variablen: ausgangRivertonHarlan, odumAufgabeBestanden, flashbackLondonBestanden setzt die Hülle
// (R42); bildschirmtischeGesehen setzt riverton-aussen.ink; Funde merkt sich Ink selbst.

EXTERNAL beginnePartie(begegnung)
EXTERNAL beginneAufgaben(runde)
EXTERNAL gibFund(kennung)
EXTERNAL reise(karte, ausloeser)
EXTERNAL oeffneLaden(laden)

VAR harlanGetroffen = false
VAR ausgangRivertonHarlan = ""
VAR popsGetroffen = false
VAR bildschirmtischeGesehen = false
VAR flashbackLondonBestanden = false
VAR zeitungsausschnittGefunden = false
VAR odumAufgabeBestanden = false
VAR taubenfederGefunden = false

// ---------------------------------------------------------------- Mr. Harlan

=== harlan ===
{
- not harlanGetroffen: -> harlan_erstes_treffen
- ausgangRivertonHarlan == "" or ausgangRivertonHarlan == "abgebrochen": -> harlan_angebot
- ausgangRivertonHarlan == "niederlage": -> harlan_nach_niederlage
- else: -> harlan_nach_sieg
}

=== harlan_erstes_treffen ===
~ harlanGetroffen = true
Auf der Bank unter der großen Uhr sitzt ein alter Herr mit Lupenbrille vor einem Brett. Er hat den Zug noch nicht gemacht. #sprecher:erzaehler
Harlan. Ich habe diese Uhr vierzig Jahre aufgezogen. #sprecher:harlan
Eile ist der Feind der Feder. Und der Unruh. #sprecher:harlan
Ich hab schon mal gegen ihn gespielt, ohne Uhr. Er hat eine Stunde für zwölf Züge gebraucht und dann gewonnen. #sprecher:juno
-> harlan_angebot

=== harlan_angebot ===
Eine Stellung mit Vorteil für Weiß, zehn Züge. Mit Uhr oder ohne, wie Sie wünschen. #sprecher:harlan
Ein Mann, der jeden Zug zehn Minuten wiegt. Gib ihm keine zehn Minuten. #sprecher:ambrose
* [„Spielen wir.“]
    ~ beginnePartie("riverton.harlan")
    -> END
* [„Später.“]
    Ich habe Zeit. Das ist mein einziger Reichtum. #sprecher:harlan
    -> END

=== harlan_nach_sieg ===
Die Unruh tickt für alle gleich. Nur nicht für mich. #sprecher:harlan
Du hast ihm die Zeit genommen und dir die Ruhe behalten. So gewinnt man ehrlich. #sprecher:ambrose
+ [„Noch eine Partie?“]
    ~ beginnePartie("riverton.harlan")
    -> END
+ [„Auf Wiedersehen, Mr. Harlan.“]
    -> END

=== harlan_nach_niederlage ===
Langsam ist auch eine Geschwindigkeit. Noch einmal? #sprecher:harlan
Mit viel Zeit ist er stark. Wähle das nächste Mal die Uhr. #sprecher:ambrose
Das ist keine Schande. #sprecher:ambrose
+ [„Noch einmal.“]
    ~ beginnePartie("riverton.harlan")
    -> END
+ [„Später.“]
    -> END

// ---------------------------------------------------------------- Pops

=== pops ===
{popsGetroffen:
    {~Ein Kiosk ist eine Bibliothek, die man essen kann.|Taschenschach seit dreißig Jahren. Die Bildschirme da draußen verkaufen sich besser. Noch.|Slick kauft jeden Morgen eine Limo. Heute zwei. Er ist nervös.} #sprecher:pops
    -> pops_laden
}
~ popsGetroffen = true
Hinter einem Zeitungsstand voller Hefte und Taschenschachspiele sitzt ein Mann mit Strickweste. #sprecher:erzaehler
Pops. Zeitungen, Limo, Taschenschach. Seit dreißig Jahren. #sprecher:pops
Der alte Mr. Odum hat hier jeden Morgen eine Zeitung gekauft. Er las die Schachspalte zuerst, noch vor dem Wetter. #sprecher:pops
Er hat Slick das Spielen beigebracht. Und halb Riverton dazu. #sprecher:pops
Schau dich um. Für Münzen gibt es hier Karten für unterwegs. #sprecher:pops
-> pops_laden

=== pops_laden ===
~ oeffneLaden("riverton.zeitungsstand")
-> END

// ---------------------------------------------------------------- Zug nach Cedar Creek

=== zug ===
Der Zug nach Cedar Creek steht abfahrbereit am Bahnsteig. Durch die Fenster sieht man Pendler mit nassen Schirmen. #sprecher:erzaehler
* [Einsteigen]
    Der Zug ruckelt los. Draußen ziehen Felder, Zedern und der Bahndamm vorbei. #sprecher:erzaehler
    ~ reise("cedarCreek.aussen", "bushaltestelle")
    -> END
* [Noch bleiben]
    -> END

// ---------------------------------------------------------------- Die große Uhr

=== uhr ===
{
- flashbackLondonBestanden:
    Die große Uhr schlägt. Ambrose sagt nichts, aber du spürst, dass er an London denkt. #sprecher:erzaehler
    -> END
- not bildschirmtischeGesehen:
    Eine riesige Bahnhofsuhr mit römischen Ziffern. Der Zeiger springt laut von Minute zu Minute. #sprecher:erzaehler
    -> END
}
Die große Uhr schlägt. Draußen leuchten die Bildschirmtische im Regen. #sprecher:erzaehler
Ich war einmal jünger als du jetzt. Fast. London, 1851. #sprecher:ambrose #stimmung:fern
Ein Kaffeehaus am Strand, Zeitungsleser, Kaffeeduft. Hinter zwei Spielern stand ein junger Mann, der nicht atmen wollte. #sprecher:ambrose
Das war ich. #sprecher:ambrose
Komm mit. Ich zeige dir, was ich sah. Schließ die Augen und hör der Uhr zu. #sprecher:ambrose
* [„Zeig es mir.“]
    Die Uhr schlägt noch einmal, langsamer. Die Bahnhofshalle verblasst zu einem braunen Bild. #sprecher:erzaehler
    ~ reise("erinnerungLondon.strand", "ankunft")
    -> END
* [„Später.“]
    Später. Das Kaffeehaus wartet seit hundertfünfundsiebzig Jahren. #sprecher:ambrose
    Es wartet auch noch eine Stunde. #sprecher:ambrose
    -> END

// ---------------------------------------------------------------- Zeitungsstand und Funde

=== zeitungsstand ===
Zeitungen aus drei Bundesstaaten, ein Ständer mit Limonade, ganz oben ein Regal mit Taschenschachspielen. #sprecher:erzaehler
In der Lokalzeitung steht groß: „Perfect Move übernimmt Parkclub“. Die Schachspalte ist kleiner geworden. #sprecher:erzaehler
-> END

=== fund_zeitungsausschnitt ===
{
- odumAufgabeBestanden:
    Hinter dem Ständer liegt nur noch Staub. Mr. Odums Aufgabe ist gelöst. #sprecher:erzaehler
    -> END
- zeitungsausschnittGefunden: -> odum_aufgabe
}
~ zeitungsausschnittGefunden = true
Hinter dem Zeitungsständer klemmt ein vergilbter Ausschnitt: eine Schachspalte, eine Aufgabe, darunter mit Bleistift „E. O.“. #sprecher:erzaehler
~ gibFund("zeitungsausschnitt")
Das ist Mr. Odums Handschrift. Seine letzte Aufgabe. #sprecher:pops
Er hat sie nie gelöst, sagt Slick. #sprecher:pops
-> odum_aufgabe

=== odum_aufgabe ===
Willst du es versuchen? Für Elias. #sprecher:pops
* [„Ich versuche es.“]
    ~ beginneAufgaben("riverton.odumAufgabe")
    -> END
* [„Später.“]
    Die Aufgabe ist alt. Sie läuft nicht weg. #sprecher:pops
    -> END

=== fund_taubenfeder ===
{taubenfederGefunden:
    Auf Mr. Harlans Bank liegen nur noch Uhrfedern. Er sammelt sie. #sprecher:erzaehler
    -> END
}
~ taubenfederGefunden = true
Auf der Bank neben Mr. Harlan liegt eine graue Taubenfeder. Er schiebt sie dir hin, ohne aufzusehen. #sprecher:erzaehler
~ gibFund("taubenfeder")
Eine Feder. Damit schrieb man früher Partien auf. Ich auch. #sprecher:ambrose
-> END

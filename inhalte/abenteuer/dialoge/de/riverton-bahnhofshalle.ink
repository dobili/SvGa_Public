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
// Runde 11 (13.11.2026): an den Roman zu Akt 2 angeglichen (Kapitel 19 und 21), Klang nach
// 21_Klangplan.md. Kleine Geschichte Mr. Harlan (Ortsblatt Riverton): A niemand spielt ohne Uhr
// mit ihm, B nach drei Partien die Lupe, C Tamsin spielt mit ihm ohne Uhr (nadelIronwood > 0),
// D eine zweite kleine Uhr „Für Leute mit Zeit“ (endeAkt3Gesehen).
//
// Variablen: ausgangRivertonHarlan, odumAufgabeBestanden, flashbackLondonBestanden setzt die Hülle
// (R42); bildschirmtischeGesehen setzt riverton-aussen.ink; Funde merkt sich Ink selbst.

EXTERNAL beginnePartie(begegnung)
EXTERNAL beginneAufgaben(runde)
EXTERNAL gibFund(kennung)
EXTERNAL reise(karte, ausloeser)
EXTERNAL oeffneLaden(laden)

VAR uhrAngebotGesehen = false
VAR held = "Du"
VAR harlanGetroffen = false
VAR ausgangRivertonHarlan = ""
VAR siegeRivertonHarlan = 0
VAR lupeGeschenkt = false
VAR popsGetroffen = false
VAR bildschirmtischeGesehen = false
VAR flashbackLondonBestanden = false
VAR zeitungsausschnittGefunden = false
VAR odumAufgabeBestanden = false
VAR taubenfederGefunden = false
VAR harlanOhneUhrGesagt = false
VAR popsOdumErzaehlt = false
VAR nadelRiverton = 0
VAR nadelIronwood = 0
VAR endeAkt3Gesehen = false
VAR londonNachgespraechGesehen = false
// Aus capital-arena-aussen.ink: Nach dem Abschied (Szene 109) spricht Ambrose nicht mehr
// (Story-Bibel Abschnitt 33, Frage 5; Entscheidung Q21-5). Hier nur gelesen.
VAR abschiedGesehen = false

// ---------------------------------------------------------------- Mr. Harlan

=== harlan ===
{
- not harlanGetroffen: -> harlan_erstes_treffen
- lupeGeschenkt and nadelIronwood > 0: -> harlan_spaeter
- ausgangRivertonHarlan == "" or ausgangRivertonHarlan == "abgebrochen": -> harlan_angebot
- siegeRivertonHarlan >= 3 and not lupeGeschenkt: -> harlan_lupe
- ausgangRivertonHarlan == "remis": -> harlan_nach_remis
- ausgangRivertonHarlan == "niederlage": -> harlan_nach_niederlage
- else: -> harlan_nach_sieg
}

// Kleine Geschichte Mr. Harlan, Stufen C und D (Ortsblatt Riverton).
=== harlan_spaeter ===
{endeAkt3Gesehen:
    Neben der großen Uhr hängt jetzt eine zweite, kleine. Darunter ein Pappschild: „Für Leute mit Zeit.“ #sprecher:erzaehler
    Mr. Harlan sieht von seinem Brett auf. #sprecher:erzaehler
    Setz dich. Hier tickt nichts. #sprecher:harlan #stimmung:laechelt
- else:
    Auf der Bank unter der Uhr spielt Tamsin gegen Mr. Harlan. Ohne Uhr. #sprecher:erzaehler
    Sie zählt nicht. #sprecher:erzaehler
    Sie ist die Erste seit Jahren, die wartet, bis ich ziehe. #sprecher:harlan #stimmung:laechelt
}
+ [„Eine Partie, Mr. Harlan?“]
    ~ beginnePartie("riverton.harlan")
    -> END
+ [Zusehen]
    -> END

// Nach drei Siegen schenkt Harlan seine Lupe (docs/spiel/05, Szene 31a; Quest riverton.lupe gibt
// den Gegenstand); nur so, nicht im Laden (Antwort des Autors zu Q20-3).
=== harlan_lupe ===
// Kapitel 19: eine kleine Lupe aus Messing, kein Gerät; Ambrose lobt die Ehrlichkeit, nicht den Nutzen.
~ lupeGeschenkt = true
Er greift in die Westentasche und legt dir etwas in die Hand. Eine kleine Lupe aus Messing, zum Aufklappen, blank gerieben. #sprecher:erzaehler
Fünfzig Jahre an Uhrwerken. Man sieht damit nicht die Zahnräder. #sprecher:harlan #stimmung:nachdenklich
Man sieht, wo es hakt. #sprecher:harlan #stimmung:nachdenklich
Bei mir: Ich denke zu lange. Du darfst das wissen. #sprecher:harlan #stimmung:nachdenklich
Die meisten wollen es nicht wissen, sie wollen nur schneller sein. #sprecher:harlan #stimmung:nachdenklich
{not abschiedGesehen:
    Ein ehrliches Werkzeug. Es zeigt nur, was ohnehin da ist. #sprecher:ambrose #stimmung:laechelt
}
-> END

=== harlan_erstes_treffen ===
// Kapitel 19: Pops stellt ihn vor; die große Uhr tickt so laut, dass man es im Bauch spürt.
~ harlanGetroffen = true
Unter der großen Uhr sitzt ein Mann mit Lupenbrille auf einer Bank und sieht auf ein Brett. Er bewegt sich nicht. #sprecher:erzaehler
Der Mann vom Zeitungsstand ruft zu euch herüber. #sprecher:erzaehler
Mr. Harlan. Uhrmacher. #sprecher:pops #stimmung:laechelt
Zieht die da oben jeden Morgen auf, seit zweiundvierzig Jahren. #sprecher:pops #stimmung:laechelt
Wenn du mit ihm spielst, bring Zeit mit. Oder nimm ihm welche weg. #sprecher:pops #stimmung:lacht
Gegen den hab ich mal gespielt, bei meiner Cousine. Eine Stunde für zwölf Züge. #sprecher:juno #stimmung:ueberrascht
Und dann hat er gewonnen. #sprecher:juno #stimmung:ueberrascht
Mr. Harlan hebt den Kopf, sehr langsam. Hinter den Gläsern sind seine Augen riesig. #sprecher:erzaehler
-> harlan_angebot

=== harlan_angebot ===
Eine Stellung, zehn Züge. Mit Uhr? #sprecher:harlan #stimmung:laechelt
Er sieht hinauf zur großen Uhr. #sprecher:erzaehler
Eile ist der Feind der Feder. Und der Unruh, aber bitte. #sprecher:harlan #stimmung:laechelt
{not abschiedGesehen:
    Ein Mann, der jeden Zug zehn Minuten wiegt. Gib ihm keine zehn Minuten. #sprecher:ambrose #stimmung:laechelt
}
+ [„Spielen wir.“]
    ~ beginnePartie("riverton.harlan")
    -> END
+ [„Nicht jetzt.“]
    Ich habe Zeit. Das ist mein einziger Reichtum. #sprecher:harlan #stimmung:laechelt
    -> END

=== harlan_nach_sieg ===
// Kapitel 19: Der Sieg fühlt sich nicht gut an; die Zeitwahl bekommt ein Gewissen (Stufe A).
Er nimmt die Lupenbrille ab und reibt sich die Nase. #sprecher:erzaehler
Die Unruh tickt für alle gleich. Nur nicht für mich. #sprecher:harlan #stimmung:nachdenklich
{not harlanOhneUhrGesagt: -> harlan_ohne_uhr}
-> harlan_noch_eine

=== harlan_ohne_uhr ===
~ harlanOhneUhrGesagt = true
* [„Mit mehr Zeit hätten Sie gewonnen.“]
    Mit genug Zeit gewinne ich fast immer. #sprecher:harlan #stimmung:laechelt
    Er lächelt, ein wenig schief. #sprecher:erzaehler
    Deshalb spielt niemand mehr ohne Uhr mit mir. #sprecher:harlan #stimmung:nachdenklich #pause
* [Nicken]
    // Lektorat 19.11.2026: Der Satz trägt die nächste Wahl („Ohne Uhr, wenn Sie wollen.“).
    Du nickst. Er lächelt, ein wenig schief. #sprecher:erzaehler
    Deshalb spielt niemand mehr ohne Uhr mit mir. #sprecher:harlan #stimmung:nachdenklich #pause
- -> harlan_noch_eine

=== harlan_noch_eine ===
+ [„Noch eine Partie? Ohne Uhr, wenn Sie wollen.“]
    ~ beginnePartie("riverton.harlan")
    -> END
+ [„Auf Wiedersehen, Mr. Harlan.“]
    -> END

=== harlan_nach_niederlage ===
Langsam ist auch eine Geschwindigkeit. Noch einmal? #sprecher:harlan #stimmung:laechelt
+ [„Noch einmal.“]
    ~ beginnePartie("riverton.harlan")
    -> END
+ [„Nicht jetzt.“]
    -> END

// Remis im Stellungsduell oder Endspiel (Regelwerk R13, R13a): Vorteil unter dem Mindest-
// vorteil. Vorher ging es in harlan_nach_sieg mit „gewonnen“ und Karte (schwacher Spieler im
// Spieler-Durchlauf, 19.11.2026).
=== harlan_nach_remis ===
Unentschieden. Der Zug ist pünktlich, aber nicht schneller, noch einmal? #sprecher:harlan #stimmung:laechelt
+ [„Noch einmal.“]
    ~ beginnePartie("riverton.harlan")
    -> END
+ [„Nicht jetzt.“]
    -> END

// ---------------------------------------------------------------- Pops

=== pops ===
{
- popsGetroffen and harlanGetroffen and not popsOdumErzaehlt: -> pops_odum
- popsGetroffen:
    // Lektorat Akt 2 (17.11.2026): Slicks zwei Limos nur vor dem letzten Spiel.
    {nadelRiverton == 0:
        {~Ein Kiosk ist eine Bibliothek, die man essen kann. Willst du ein Sandwich?|Taschenschach seit dreißig Jahren. Die Bildschirme da draußen verkaufen sich besser, noch.|Slick kauft jeden Morgen eine Limo, heute zwei. Er ist nervös.} #sprecher:pops #stimmung:laechelt
    - else:
        {~Ein Kiosk ist eine Bibliothek, die man essen kann. Willst du ein Sandwich?|Taschenschach seit dreißig Jahren. Die Bildschirme da draußen verkaufen sich besser, noch.} #sprecher:pops #stimmung:laechelt
    }
    -> pops_laden
}
~ popsGetroffen = true
Ein runder, freundlicher Mann hinter einem Zeitungsstand. Neben den Zeitungen hängt eine Reihe Taschenschachspiele, in allen Farben. #sprecher:erzaehler
Pops. Zeitungen, Limo, Taschenschach – seit dreißig Jahren. #sprecher:pops #stimmung:laechelt
Ein Kiosk ist eine Bibliothek, die man essen kann. Schau dich um. #sprecher:pops #stimmung:laechelt
Für Münzen gibt es hier Karten für unterwegs. #sprecher:pops #stimmung:laechelt
-> pops_laden

// Kapitel 19: Pops erzählt von Mr. Odum, ohne dass man fragt (etwa eine Minute; Musik riverton.pops).
=== pops_odum ===
~ popsOdumErzaehlt = true
Pops bündelt Zeitungen. Er erzählt, ohne dass du gefragt hast. #sprecher:erzaehler #musik:riverton.pops
Der alte Odum kam jeden Morgen um sieben, vierzig Jahre lang. Schlug die Zeitung von hinten auf, bei der Schachspalte. #sprecher:pops #stimmung:nachdenklich
Slick hat er mit zwölf im Park aufgelesen. Ein Junge, der Flaschen sammelte und zu schnell redete. #sprecher:pops #stimmung:laechelt
Im März ist er gestorben, im Schlaf. Im April hat der Stadtrat getagt. #sprecher:pops #stimmung:bitter #pause
* [„Und der Pavillon?“]
* [Zuhören]
- Der hätte das nicht zugelassen. Der hätte sich vor die Bagger gesetzt und eine Partie angefangen. #sprecher:pops #stimmung:laechelt
Und niemand hätte sich getraut, ihn zu stören, bevor sie fertig ist. #sprecher:pops #stimmung:laechelt
Er schnürt das Bündel zu. #sprecher:erzaehler
Slick ist ein guter Junge. Aber er glaubt, er muss lauter sein als der Alte. #sprecher:pops #stimmung:nachdenklich
// Gutachten K2.16: Nach diesem Satz kein Ladenfenster; der Laden öffnet beim nächsten Mal.
Damit keiner merkt, dass er nicht der Alte ist. #sprecher:pops #stimmung:nachdenklich #pause:2
-> END

=== pops_laden ===
~ oeffneLaden("riverton.zeitungsstand")
-> END

// ---------------------------------------------------------------- Zug nach Cedar Creek

=== zug ===
Der Zug nach Cedar Creek steht abfahrbereit am Bahnsteig. Durch die Fenster sieht man Pendler mit nassen Schirmen. #sprecher:erzaehler
* [Einsteigen]
    Der Zug ruckelt los. Draußen ziehen Felder, Zedern und der Bahndamm vorbei. #sprecher:erzaehler
    ~ reise("cedarCreek.aussen", "bahnhof")
    -> END
* [Noch bleiben]
    -> END

// ---------------------------------------------------------------- Die große Uhr

=== uhr ===
// Kapitel 21: Am Samstagabend ist der Zug weg; Juno schläft; neun Uhrschläge werden Hufschlag
// (Klang uhr_hufschlag). Nach der Erinnerung das Nachgespräch (london_nachgespraech).
{
- flashbackLondonBestanden and not londonNachgespraechGesehen: -> london_nachgespraech
- flashbackLondonBestanden:
    Die große Uhr tickt. {not abschiedGesehen:Ambrose sieht zu den hohen Fenstern und sagt nichts.} #sprecher:erzaehler
    -> END
- not bildschirmtischeGesehen:
    Eine Uhr, so groß wie ein Wagenrad. Sie tickt so laut, dass man es im Bauch spürt. #sprecher:erzaehler
    -> END
}
// Lektorat 20.11.2026: Nach „Nicht jetzt“ nicht noch einmal Zug, Juno, Klavierbauer und neun Schläge.
{uhrAngebotGesehen: -> uhr_wieder}
Am Abend ist euer Zug weg. Der nächste fährt in fünfzig Minuten. #sprecher:erzaehler #uhr:abend
Juno schläft auf der Bank ein, den Kopf auf dem Tagebuch. #sprecher:erzaehler
Durch die hohen Fenster leuchten die sechs Tische im Park, weiß und still. #sprecher:erzaehler
// Nach dem Abschied (abschiedGesehen) erzählt Ambrose nicht mehr; die Uhr führt allein nach London.
{abschiedGesehen: -> schlag}
Ich war auch einmal jung. Das ist lange her. #sprecher:ambrose #stimmung:laechelt
Er sieht nicht zu den Fenstern. Er sieht hinauf zur Uhr. #sprecher:erzaehler
Mein Vater baute Klaviere. Für das Holz fuhr er nach London, einmal im Jahr. #sprecher:ambrose #stimmung:nachdenklich
Als ich zwanzig war, nahm er mich mit. #sprecher:ambrose #stimmung:nachdenklich
Ich sollte lernen, wie man Fichte prüft. Man klopft darauf und hört zu. #sprecher:ambrose #stimmung:laechelt
Ich habe nichts gehört. Ich dachte an etwas anderes. #sprecher:ambrose #stimmung:laechelt
* [„Woran?“]
* [Zuhören]
- -> schlag

= schlag
~ uhrAngebotGesehen = true
Die Uhr schlägt. Neunmal. #sprecher:erzaehler #klang:uhr_hufschlag #musik:aus
Mit jedem Schlag wird die Halle heller, und der Hall wird zu Hufen auf Pflaster. #sprecher:erzaehler
{not abschiedGesehen:
    Komm. Ich zeige es dir. #sprecher:ambrose #stimmung:laechelt
}
* [Mitgehen]
    ~ reise("erinnerungLondon.strand", "ankunft")
    -> END
* [„Nicht jetzt.“]
    {not abschiedGesehen:
        Das Kaffeehaus wartet seit hundertfünfundsiebzig Jahren. Es wartet auch noch eine Stunde. #sprecher:ambrose #stimmung:laechelt
    }
    -> END

=== uhr_wieder ===
Juno schläft noch auf der Bank. Die Uhr tickt laut in der leeren Halle. #sprecher:erzaehler
{not abschiedGesehen:
    Das Kaffeehaus wartet noch. Komm. #sprecher:ambrose #stimmung:laechelt
}
* [Mitgehen]
    ~ reise("erinnerungLondon.strand", "ankunft")
    -> END
* [„Nicht jetzt.“]
    -> END

// Kapitel 21, Schluss: der Gedanke, der Ambrose in Akt 3 trägt. Wer alles sieht, muss nicht hoffen.
// Musik ambrose.zweifel (Ambroses Kopf mit dem Konzernton). Juno merkt es und schreibt nichts auf.
=== london_nachgespraech ===
~ londonNachgespraechGesehen = true
Du sitzt wieder auf der Bank unter der Uhr. Juno schläft. #sprecher:erzaehler
Deine Hände sind deine. #sprecher:erzaehler
{abschiedGesehen: -> END}
Sie nennen sie die Unsterbliche. Heute noch, nehme ich an. #sprecher:ambrose #stimmung:nachdenklich
* [„Ja.“]
* [Nicken]
- Er ist lange still. Draußen, hinter den Fenstern, leuchten die Tische. #sprecher:erzaehler #pause:2
Diese Maschinen. Sie würden das nie spielen. #sprecher:ambrose #stimmung:nachdenklich
Zwei Türme und die Dame. Sie würden ausrechnen, dass es anders sicherer ist. #sprecher:ambrose #stimmung:nachdenklich
Oder doch? #sprecher:ambrose #stimmung:fern #musik:ambrose.zweifel #pause:2
Wenn sie alles sehen, jeden Zug bis zum Ende, dann sehen sie auch das. Dann wissen sie, dass es stimmt, bevor sie die Hand heben. #sprecher:ambrose #stimmung:nachdenklich
Sie müssten nicht hoffen. #sprecher:ambrose #stimmung:nachdenklich
{held}. Was wäre, wenn sie die Partie spielen könnten, die ich nie spielte? #sprecher:ambrose #stimmung:fern
* [„Ich weiß es nicht.“]
* [Schweigen]
- Juno ist aufgewacht. Sie sieht dich an, verschlafen, dann genauer. #sprecher:erzaehler
Du bist so still. Ist was? #sprecher:juno #stimmung:nachdenklich
* [„Nein.“]
- Sie glaubt dir nicht. Sie schreibt nichts auf. #sprecher:erzaehler
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
{not popsGetroffen:
    Der Mann hinter dem Zeitungsstand beugt sich herüber. #sprecher:erzaehler
}
Das ist Mr. Odums Handschrift. Seine letzte Aufgabe. #sprecher:pops #stimmung:nachdenklich
Er hat sie nie gelöst, sagt Slick. #sprecher:pops #stimmung:nachdenklich
-> odum_aufgabe

=== odum_aufgabe ===
Willst du es versuchen? Für Elias. #sprecher:pops #stimmung:laechelt
+ [„Ich versuche es.“]
    ~ beginneAufgaben("riverton.odumAufgabe")
    -> END
+ [„Nicht jetzt.“]
    Die Aufgabe ist alt. Sie läuft nicht weg. #sprecher:pops #stimmung:laechelt
    -> END

=== fund_taubenfeder ===
{taubenfederGefunden:
    Auf Mr. Harlans Bank liegen nur noch Uhrfedern. Er sammelt sie. #sprecher:erzaehler
    -> END
}
~ taubenfederGefunden = true
Auf der Bank neben {harlanGetroffen:Mr. Harlan|dem Mann mit der Lupenbrille} liegt eine graue Taubenfeder. Er schiebt sie dir hin, ohne aufzusehen. #sprecher:erzaehler
~ gibFund("taubenfeder")
{not abschiedGesehen:
    Eine Feder. Damit schrieb man früher Partien auf. #sprecher:ambrose #stimmung:laechelt
    Ich auch. #sprecher:ambrose #stimmung:laechelt
}
-> END

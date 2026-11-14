// Nebenort N5: Sternwarte am Canyon, Karten „Felsnase“ und „Kuppel“ (Akt 3 und 4, nachts).
// Figuren: Dr. Ngata (spielt nachts per Funk Schach), Lucía (zeichnet das Sternbild Springer).
// Ansehen: Teleskop, Sternkarte, Bank, Antennenmast. Fund: Finch-Figur Bauer G (Dokument 15, 3).
// Nebenquest sternwarte.koenigsangriff (klein): Mattbilder von Dr. Ngata (Runde sternwarte.sterne).
// Erreichbar über die Sperre S9 auf dem Canyonpfad (weg-delacroix-desert.sternwarte_abzweig).

// >>> Runde 6 (mittel-4)
VAR finchFiguren = 0
EXTERNAL beginneAufgaben(runde)
EXTERNAL gibFund(kennung)
VAR held = "Du"
VAR ambroseSprichtWieder = false
VAR ngataGetroffen = false
VAR sterneBestanden = false
VAR luciaGetroffen = false
VAR gefundenFinchBauerG = false
VAR ambroseSternwarte = 0

=== ngata ===
{
- sterneBestanden:
    Weiß hat gewonnen, sagt mein Funkpartner in Chile. Ich sage: der Himmel. #sprecher:ngata #stimmung:laechelt
    -> END
- ngataGetroffen:
    -> ngata_angebot
}
~ ngataGetroffen = true
Am Schreibtisch sitzt eine Frau mit Kopfhörern. Aus dem Funkgerät kommen Zahlen und Buchstaben. #sprecher:erzaehler
Dr. Ngata. Ich spiele jede Nacht per Funk, mit Leuten auf der anderen Seite der Erde. Ihre Sterne sind andere, die Züge sind dieselben. #sprecher:ngata #stimmung:laechelt
-> ngata_angebot

=== ngata_angebot ===
{sterneBestanden: -> END}
Ich habe ein paar Mattbilder gesammelt, für lange Nächte. Willst du sie lösen? #sprecher:ngata #stimmung:laechelt
+ [Ja, zeig her.]
    ~ beginneAufgaben("sternwarte.sterne")
    -> END
+ [Später.]
    Der Himmel läuft nicht weg. Die Stellungen auch nicht. #sprecher:ngata #stimmung:laechelt
    -> END

=== lucia ===
{luciaGetroffen:
    Siehst du ihn? Zwei Sterne nach oben, einer zur Seite. Ein L. #sprecher:lucia #stimmung:laechelt
    -> END
}
~ luciaGetroffen = true
Ein Mädchen mit Bleistift hinter dem Ohr zeichnet Linien auf eine Sternkarte. #sprecher:erzaehler
Lucía. Ich habe ein Sternbild gefunden, das noch keiner kennt. Ich nenne es Springer. Es springt über den ganzen Himmel. #sprecher:lucia #stimmung:laechelt
-> END

=== teleskop ===
~ ambroseSternwarte = ambroseSternwarte + 1
Durch das große Teleskop schimmert der Mond. Man sieht Krater, scharf wie Felder auf einem Brett. #sprecher:erzaehler
{ambroseSprichtWieder and ambroseSternwarte == 1:
    Vierundsechzig Felder, und trotzdem kommt man nie ans Ende. Wie da oben. #sprecher:ambrose #stimmung:nachdenklich
}
-> END

=== sternkarte ===
An der Wand hängt eine Sternkarte. Jemand hat mit Bleistift Züge eingetragen: Sf3, Lc4, und ein Sternbild in L-Form. #sprecher:erzaehler
-> END

=== bank ===
Von der Bank sieht man tief hinunter in den Canyon. Der Pfad unten ist nur noch ein dunkler Faden. #sprecher:erzaehler
-> END

=== antennenmast ===
Ein alter Antennenmast, festgebunden mit Draht. Er summt leise im Wind. Von hier geht Dr. Ngatas Funk um die Welt. #sprecher:erzaehler
-> END

=== finch_bauer_g ===
{gefundenFinchBauerG:
    Unter dem Finkenzeichen liegt nur noch Staub. #sprecher:erzaehler
    -> END
}
~ gefundenFinchBauerG = true
Auf dem Boden ist ein kleiner Fink aus Kreide gemalt. Darunter, hinter einer Kiste mit Fotoplatten, steht ein weißer Bauer aus Buchsbaum. #sprecher:erzaehler
~ gibFund("finchBauerG")
~ finchFiguren = finchFiguren + 1
-> END
// <<< Runde 6 (mittel-4)

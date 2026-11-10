// Weg 7 von Desert Springs nach Summit City: Karten „Diner“ und „Bergstraße“ (Akt 4, Szene 81 der
// Story-Bibel, Abschnitt 29; Landschaft L8 Wüstenstraße, Weltbeschreibung 5.9).
//
// Stationen (W4): Fernfahrer Earl Dubois am Diner mit der Variante Königsrennen (Buchbezug
// Kapitel 8, der König muss im Endspiel laufen), Rätseltafel (Runde wegDesertSummit.tafel, Quest
// wegDesertSummit.tafelDiner), Fund Neonbuchstabe „K“, Abzweig zur Hochebene (L9).
// Einstiege wie in orte.json: earl, zurueck_desert, tafel, fund_neon, abzweig_hochebene. Die
// Ankunft in Summit City erzählt summit-city-aussen.ankunft_zu_fuss.
//
// Varianten: Königsrennen ist noch nicht gebaut (nur Blindschach). Earl erklärt die Regel und
// vertröstet; die Stelle ist mit „VARIANTE-FEHLT“ markiert und kommt in den Bericht.
// Variablen: wegDesertSummitTafelBestanden setzt die Hülle (R42); die übrigen setzt diese Datei.
// Der Fund „neonK“ kommt über gibFund; Ink merkt ihn sich selbst (neonGefunden), weil die Hülle
// beim Dialogende alle Ink-Variablen zurückschreibt.

EXTERNAL beginneAufgaben(runde)
EXTERNAL gibFund(kennung)

VAR held = "Du"
VAR wegDesertSummitTafelBestanden = false
VAR earlGetroffen = false
VAR varianteKoenigsrennenGelernt = false
VAR neonGefunden = false

// ---------------------------------------------------------------- Earl und das Königsrennen

=== earl ===
{earlGetroffen: -> earl_alltag}
~ earlGetroffen = true
Vor dem Diner stehen drei Lastwagen in der Hitze. Über der Tür summt ein Neonschild: „ING'S DINER“. #sprecher:erzaehler
Drinnen sitzt ein Mann mit grauem Bart vor einem Brett. Auf dem Brett stehen nur zwei Könige und ein paar Figuren. #sprecher:erzaehler
Earl. Ich fahr seit dreißig Jahren diese Straße. Und seit dreißig Jahren zahlt hier der, der das Rennen verliert. #sprecher:earl #stimmung:froh
-> earl_regel

=== earl_regel ===
~ varianteKoenigsrennenGelernt = true
Königsrennen. Keiner darf Schach geben, keiner darf im Schach stehen. #sprecher:earl
Wer mit seinem König zuerst die letzte Reihe erreicht, gewinnt. Wer verliert, zahlt den Kaffee. #sprecher:earl
Ein Rennen ohne Angriff. Wie seltsam. #sprecher:ambrose
Und doch: Auch hier gewinnt, wer den Weg kennt. Im Endspiel muss der König laufen, {held}. Das steht in Kapitel 8. #sprecher:ambrose
-> earl_angebot

=== earl_angebot ===
// VARIANTE-FEHLT: Königsrennen (L8). Bis es gebaut ist, nur die Regel und eine Vertröstung.
Heute sind alle Bretter belegt. Die Jungs spielen um die nächste Tankfüllung. #sprecher:earl
Komm wieder, wenn du hier durchfährst. Dann rennen wir. #sprecher:earl
-> END

=== earl_alltag ===
{~Der Kaffee hier ist schwarz wie ein Läufer auf c8.|Ich hab mal ein Rennen in elf Zügen gewonnen. Seitdem zahl ich nie.|Bis Summit City geht's nur noch bergauf. Für Lastwagen und für Schachspieler.} #sprecher:earl
+ [„Erklär mir das Königsrennen noch einmal.“]
    -> earl_regel
+ [„Bis bald, Earl.“]
    Gute Fahrt. Und lass den König nicht im Schach stehen. #sprecher:earl
    -> END

// ---------------------------------------------------------------- Rätseltafel

=== tafel ===
{wegDesertSummitTafelBestanden:
    Auf der Tafel neben der Kasse steht mit Kreide: „Gelöst. Kaffee geht aufs Haus.“ #sprecher:erzaehler
    -> END
}
Neben der Kasse hängt eine Tafel: „Drei Endspiele. Wer alle löst, kriegt den Kaffee umsonst.“ #sprecher:erzaehler
Im Endspiel zählt jedes Tempo. Und der König ist eine Figur wie jede andere. Eine starke. #sprecher:ambrose
+ [Die Aufgaben lösen]
    ~ beginneAufgaben("wegDesertSummit.tafel")
    -> END
+ [Weitergehen]
    -> END

// ---------------------------------------------------------------- Fund

=== fund_neon ===
{neonGefunden:
    Hinter dem Diner liegen leere Kisten und ein alter Reifen. #sprecher:erzaehler
    -> END
}
~ neonGefunden = true
Hinter dem Diner, zwischen leeren Kisten, liegt ein gebogenes Glasrohr in Form eines „K“. #sprecher:erzaehler
Das K von King's Diner. Ist seit neunundachtzig kaputt. Nimm's mit, wir haben uns dran gewöhnt. #sprecher:earl
~ gibFund("neonK")
-> END

// ---------------------------------------------------------------- Wege

=== zurueck_desert ===
Die Straße führt zurück nach Desert Springs, durch flimmernde Hitze. #sprecher:erzaehler
-> END

=== abzweig_hochebene ===
An einer Kurve zweigt eine Schotterstraße ab. Ein Schild: „Hochebene. Schule und Werkstatt, 3 Meilen.“ #sprecher:erzaehler
Rote Felstürme, und darüber kreisen Falken. #sprecher:erzaehler
-> END

// >>> Runde 6 (mittel-4)
EXTERNAL beginnePartie(begegnung)
VAR ambroseSprichtWieder = false
VAR funkschachBegonnen = false
VAR funkschachFertig = false
VAR ausgangWegDesertSummitFunkschach = ""
VAR gefundenKreide3 = false
VAR hinterzimmerOffen = false
VAR gefundenFinchSpringerB = false
VAR gefundenSeite08 = false
VAR gefundenSpurPM4 = false
VAR magsGetroffen = false
VAR ausgangWegDesertSummitKreideblitz = ""
VAR ruthGetroffen = false

// ---------------------------------------------------------------- Ereignis: Schach über Funk (Dokument 15, 2.8)
// Akt 4. Das CB-Funkgerät im Fenster des Diners. Partie nach Gehör kommt von mittel-2; bis dahin eine
// normale Partie gegen Mama Bear (Begegnung wegDesertSummit.funkschach). Danach erzählt sie von ihrer
// summenden Fracht (Spur P4 am Sattelzug auf der Bergstraße).

=== ereignis_funkschach ===
{funkschachFertig:
    Aus dem Funkgerät rauscht es. „{held} Junior, bist du da? Wir spielen Dienstag wieder.“ #sprecher:mamaBear
    -> END
}
{ausgangWegDesertSummitFunkschach != "" and ausgangWegDesertSummitFunkschach != "abgebrochen": -> funkschach_ende}
{funkschachBegonnen: -> funkschach_partie}
-> funkschach_start

=== funkschach_start ===
~ funkschachBegonnen = true
Im Fenster des Diners steht ein altes CB-Funkgerät. Aus dem Lautsprecher kommen Buchstaben und Zahlen: „Echo vier, Echo zwei.“ #sprecher:erzaehler
Das ist das Dienstagsturnier der Fernfahrer, zwischen der Wüste und den Bergen. Heute fehlt einer. Willst du einspringen? #sprecher:earl
-> funkschach_partie

=== funkschach_partie ===
Hier Mama Bear. Bedenkzeit bis zur nächsten Ausfahrt. Ich fange an. #sprecher:mamaBear
~ beginnePartie("wegDesertSummit.funkschach")
-> END

=== funkschach_ende ===
{funkschachFertig: -> END}
~ funkschachFertig = true
Gut gespielt, {held} Junior. Ab heute ist das dein Funkname. #sprecher:mamaBear
Sag mal, du kommst doch rum. Ich fahre seit drei Wochen versiegelte Kisten von Perfect Move in die Berge. Sie summen. Kisten summen nicht. #sprecher:mamaBear
Mein Laster steht in der Haltebucht an der Bergstraße. Schau ihn dir an, wenn du willst. #sprecher:mamaBear
-> END

// ---------------------------------------------------------------- Funde am Diner

=== fund_kreide3 ===
{gefundenKreide3:
    Der Springer aus Kreide ist noch da. Daneben die Tür zum Hinterzimmer. #sprecher:erzaehler
    -> END
}
~ gefundenKreide3 = true
An der Seitenwand des Diners ist ein Springer aus Kreide gemalt, direkt neben einer schmalen Tür. #sprecher:erzaehler
Darunter, ganz klein: „Dreimal klopfen.“ #sprecher:erzaehler
~ gibFund("kreide3")
{ambroseSprichtWieder:
    Ein Club ohne Haus. Das gefällt mir. Früher haben wir in Kaffeehäusern gespielt. #sprecher:ambrose
}
-> END

=== fund_finch_springer_b ===
{gefundenFinchSpringerB:
    Im Blumenkasten wachsen nur noch Blumen. #sprecher:erzaehler
    -> END
}
~ gefundenFinchSpringerB = true
Im Blumenkasten am Motel steckt ein kleiner Fink aus Blech. Zwischen den Blumen liegt ein weißer Springer aus Buchsbaum. #sprecher:erzaehler
~ gibFund("finchSpringerB")
-> END

=== fund_seite08 ===
{gefundenSeite08:
    Auf dem Parkplatz liegt nur noch Staub. #sprecher:erzaehler
    -> END
}
~ gefundenSeite08 = true
Unter einem Reifen des Lasters klemmt eine Buchseite. Oben steht: Kapitel 8, Endspiel-Fundament. #sprecher:erzaehler
~ gibFund("seite08")
-> END

=== hinterzimmer_tuer ===
{
- gefundenKreide3:
    ~ hinterzimmerOffen = true
    {held} klopft dreimal. Von drinnen ruft jemand: „Rein mit dir, aber leise.“ #sprecher:erzaehler
- else:
    Eine schmale Tür an der Seite des Diners. Sie ist zu. Auf der Klinke liegt etwas Kreidestaub. #sprecher:erzaehler
}
-> END

// ---------------------------------------------------------------- Hinterzimmer (Treffpunkt K3)

=== mags ===
{
- ausgangWegDesertSummitKreideblitz == "sieg":
    Du hast mich geschlagen. Komm wieder, dann revanchiere ich mich. #sprecher:mags
    -> END
- ausgangWegDesertSummitKreideblitz != "" and ausgangWegDesertSummitKreideblitz != "abgebrochen":
    Mitgespielt ist mitgespielt. Bei den Kreidespringern zählt das. #sprecher:mags
    -> END
- magsGetroffen:
    -> mags_angebot
}
~ magsGetroffen = true
Kein Bildschirm, keine Uhr an der Wand. Nur Bretter, Kreide und Kaffee. #sprecher:erzaehler
Mags. Ich fahre Kühlwagen und spiele Blitz. Drei Minuten, zwei Sekunden dazu. Gewinnen musst du nicht. Mitspielen schon. #sprecher:mags
-> mags_angebot

=== mags_angebot ===
+ [Eine Blitzpartie, drei plus zwei.]
    ~ beginnePartie("wegDesertSummit.kreideblitz")
    -> END
+ [Erst mal zuschauen.]
    Zuschauen ist erlaubt. Reden nicht. #sprecher:mags
    -> END

=== ruth_keene ===
{ruthGetroffen:
    Mama Bear, Ende. Das sage ich auch hier drin. #sprecher:ruthKeene
    -> END
}
~ ruthGetroffen = true
Ruth Keene. Am Funk heiße ich Mama Bear. Hier hinten darf ich einfach Ruth sein. #sprecher:ruthKeene
-> END

// ---------------------------------------------------------------- Ansehen

=== reklame ===
Eine große Reklametafel: „King's Diner – 2 Meilen“. Bis zum Diner sind es kaum zweihundert Schritte. #sprecher:erzaehler
-> END

=== motelschild ===
Das Neonschild des Starlight Motels summt. „VACANCY“, und das V flackert. #sprecher:erzaehler
-> END

=== aussicht ===
Von der Rastbank sieht man nach Westen die ersten Berge, blau im Dunst. Dort oben liegt Summit City. #sprecher:erzaehler
-> END

=== aussicht_berg ===
Unter der Bank fällt der Hang steil ab. Weit unten liegt die Wüste, flach wie ein leeres Brett. #sprecher:erzaehler
-> END

=== wegweiser_hochebene ===
Ein Wegweiser: „Summit City ↑, Hochebene ←“. Die Schranke zur Hochebene steht offen. #sprecher:erzaehler
-> END

=== quelle ===
Aus dem Fels rinnt kaltes Wasser in einen Steintrog. {held} trinkt ein paar Schlucke. #sprecher:erzaehler
-> END

=== fund_spur_pm4 ===
{gefundenSpurPM4:
    Der Sattelzug steht noch in der Haltebucht. Die Kisten summen. #sprecher:erzaehler
    -> END
}
~ gefundenSpurPM4 = true
In der Haltebucht steht ein blauer Sattelzug. Auf den Kisten klebt das Logo von Perfect Move, versiegelt, Ziel „Gebirge“. #sprecher:erzaehler
Wenn man das Ohr an eine Kiste hält, summt sie. Unter dem Scheibenwischer steckt ein Frachtbrief. #sprecher:erzaehler
~ gibFund("spurPM4")
-> END
// <<< Runde 6 (mittel-4)

// Weg 7 von Desert Springs nach Summit City: Karten „Diner“ und „Bergstraße“ (Akt 4, Szene 81 der
// Story-Bibel, Abschnitt 29; Landschaft L8 Wüstenstraße, Weltbeschreibung 5.9).
//
// Stationen (W4): Fernfahrer Earl Dubois am Diner mit der Variante Königsrennen (Buchbezug
// Kapitel 8, der König muss im Endspiel laufen), Rätseltafel (Runde wegDesertSummit.tafel, Quest
// wegDesertSummit.tafelDiner), Fund Neonbuchstabe „K“. Die Hochebene (L9) erreicht man
// seit dem 15.11.2026 vom Westrand von Summit City aus (Weltpuzzle, Ring im Süden).
// Einstiege wie in orte.json: earl, zurueck_desert, tafel, fund_neon. Die
// Ankunft in Summit City erzählt summit-city-aussen.ankunft_zu_fuss.
//
// Varianten: Königsrennen ist noch nicht gebaut (nur Blindschach). Earl erklärt die Regel und
// vertröstet; die Stelle ist mit „VARIANTE-FEHLT“ markiert und kommt in den Bericht.
// Variablen: wegDesertSummitTafelBestanden setzt die Hülle (R42); die übrigen setzt diese Datei.
// Der Fund „neonK“ kommt über gibFund; Ink merkt ihn sich selbst (neonGefunden), weil die Hülle
// beim Dialogende alle Ink-Variablen zurückschreibt. Bringt {held} das K zu Earl zurück, setzt
// earl_k neonRepariert: orte.json lädt dann die Fassung der Karte mit leuchtendem K
// (weg-desert-summit-diner-neon.json, zustand_der_karte, Runde 6).

// Runde 11 (13.11.2026): Kapitel 47 nach dem Roman (roman/akt4_teil1.md): Sommer, der Held ist
// fünfzehn, Mama fährt; Ambrose ist leichter und findet Gefallen an hässlichen Zügen. Earls Regel
// mit dem Kaffee, Ambrose: „Merk dir, wie der König läuft.“

EXTERNAL beginneAufgaben(runde)
EXTERNAL gibFund(kennung)

VAR held = "Du"
VAR wegDesertSummitTafelBestanden = false
VAR earlGetroffen = false
VAR varianteKoenigsrennenGelernt = false
VAR neonGefunden = false
VAR neonRepariert = false
// Zähl-Merker der Sammelstücke (Chaos-Prüfung, 14.11.2026): gesetzt erst zusammen mit dem
// Zähler und dem Fund, damit Abbrechen oder Neuladen kein Stück verliert.
VAR kreide3Gezaehlt = false
VAR finchSpringerBGezaehlt = false
VAR seite08Gezaehlt = false
VAR spurPM4Gezaehlt = false

// ---------------------------------------------------------------- Earl und das Königsrennen

=== earl ===
{earlGetroffen: -> earl_alltag}
-> diner_ankunft

// Gutachten M2.4: Auftakt von Kapitel 47 auf jedem Weg; hängt auch am Übergang weiterBergstrasse.
=== diner_ankunft ===
{earlGetroffen: -> END}
~ earlGetroffen = true
Durchs Fenster des Diners sieht man Fernfahrer Könige über Bretter schieben. Draußen an der Wand lehnt ein Mann mit Kappe und Kaffeebecher und dreht sich nach dir um. #sprecher:erzaehler
Na, auch auf dem Weg nach oben? Ich bin Earl. Ich fahr seit dreißig Jahren diese Straße. #sprecher:earl #stimmung:froh
-> earl_regel

=== earl_regel ===
~ varianteKoenigsrennenGelernt = true
Das hier ist Königsrennen. Beide Könige laufen bis zur letzten Reihe, und Schach geben ist verboten. #sprecher:earl #stimmung:laechelt
Wer zuerst ankommt, zahlt nicht. Und wer unterwegs nur schlagen will, zahlt meistens. #sprecher:earl #stimmung:laechelt
{not abschiedGesehen:
    Ein Rennen ohne Angriff. Wie seltsam. Und doch. #sprecher:ambrose #stimmung:nachdenklich
    Auch hier gewinnt, wer den Weg kennt. Merk dir, wie der König läuft. Ich habe das Gefühl, du wirst es brauchen. #sprecher:ambrose #stimmung:nachdenklich
}
-> earl_angebot

=== earl_angebot ===
// VARIANTE-FEHLT: Königsrennen (L8). Bis es gebaut ist, nur die Regel und eine Vertröstung.
Am Fenstertisch rennen zwei Fahrer los. Der eine schiebt seinen König stur nach vorn, der andere schlägt unterwegs einen Läufer und zahlt den Kaffee. #sprecher:erzaehler
Siehst du? Laufen, nicht schlagen. Wenn du wieder durchfährst, rennst du selbst. #sprecher:earl #stimmung:laechelt
-> END

=== earl_alltag ===
{~Der Kaffee hier ist schwarz wie ein Läufer auf c8.|Ich hab mal ein Rennen in elf Zügen gewonnen. Seitdem zahl ich nie.|Bis Summit City geht's nur noch bergauf. Für Lastwagen und für Schachspieler.} #sprecher:earl #stimmung:laechelt
+ {neonGefunden and not neonRepariert} [„Ich hab dein K gefunden.“]
    -> earl_k
+ [„Erklär mir das Königsrennen noch einmal.“]
    -> earl_regel
+ [„Bis bald, Earl.“]
    Gute Fahrt. Und lass den König nicht im Schach stehen. #sprecher:earl #stimmung:laechelt
    -> END

=== earl_k ===
~ neonRepariert = true
Earl dreht das gebogene Glasrohr in der Hand. Dann holt er eine Leiter aus dem Lastwagen. #sprecher:erzaehler
Ich hab gesagt, nimm's mit. Und du bringst es mir zurück. #sprecher:earl #stimmung:froh
Ein Klicken, ein Summen. Über der Tür leuchtet es rosa: „KING'S DINER“. #sprecher:erzaehler
{not abschiedGesehen:
    Seit neunundachtzig. Und niemand hat es vermisst. Ich kenne das Gefühl. #sprecher:ambrose #stimmung:nachdenklich
}
Der Kaffee geht ab heute aufs Haus. Für dich jedenfalls. #sprecher:earl #stimmung:laechelt
-> END

// ---------------------------------------------------------------- Rätseltafel

=== tafel ===
{wegDesertSummitTafelBestanden:
    Auf der Tafel neben der Kasse steht mit Kreide: „Gelöst. Kaffee geht aufs Haus.“ #sprecher:erzaehler
    -> END
}
Neben der Kasse hängt eine Tafel: „Drei Endspiele. Wer alle löst, kriegt den Kaffee umsonst.“ #sprecher:erzaehler
{not abschiedGesehen:
    Nur Könige und Bauern. So wenig Holz, und kein Zug ist leicht. #sprecher:ambrose #stimmung:nachdenklich
}
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
{not earlGetroffen:
    Aus der Hintertür sieht ein Mann mit Kappe und Kaffeebecher heraus. #sprecher:erzaehler
}
Das K von King's Diner. Ist seit neunundachtzig kaputt. Nimm's mit, wir haben uns dran gewöhnt. #sprecher:earl #stimmung:laechelt
~ gibFund("neonK")
-> END

// ---------------------------------------------------------------- Wege

=== zurueck_desert ===
Die Straße führt zurück nach Desert Springs, durch flimmernde Hitze. #sprecher:erzaehler
-> END

// >>> Runde 6 (mittel-4)
VAR spurenPM = 0
VAR kreideTreffpunkte = 0
VAR finchFiguren = 0
VAR buchseiten = 0
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
// Aus capital-arena-aussen.ink: Nach dem Abschied (Szene 109) spricht Ambrose nicht mehr
// (Story-Bibel Abschnitt 33, Frage 5; Entscheidung Q21-5). Hier nur gelesen.
VAR abschiedGesehen = false
// Wegsperre S17 (32_Wegsperren.md): endeAkt3Gesehen setzt desert-springs-aussen.ink,
// ankunftSummitGesehen summit-city-aussen.ink, den Ausgang die Hülle (R42), testteamStand auch die
// Wege 2 und 5; die übrigen setzt diese Datei.
VAR endeAkt3Gesehen = false
VAR ankunftSummitGesehen = false
VAR ausgangWegDesertSummitTestteam = ""
VAR testteamStand = 0
VAR testteamGitterGesehen = false
VAR testteamGitterDurch = false
VAR testteamGitterSpielt = false
VAR testteamGitterNiederlagen = 0

// ---------------------------------------------------------------- Ereignis: Schach über Funk (Dokument 15, 2.8)
// Akt 4. Das CB-Funkgerät im Fenster des Diners. Partie nach Gehör gegen Mama Bear (Begegnung
// wegDesertSummit.funkschach, variante „gehoer“): Ihr Zug kommt erst als Ansage über Funk, dann auf das
// Brett. Danach erzählt sie von ihrer summenden Fracht (Spur P4 am Sattelzug auf der Bergstraße).

=== ereignis_funkschach ===
{funkschachFertig:
    Aus dem Funkgerät rauscht es. #sprecher:erzaehler
    {held} Junior, bist du da? Wir spielen Dienstag wieder. #sprecher:mamaBear #stimmung:laechelt
    -> END
}
{ausgangWegDesertSummitFunkschach != "" and ausgangWegDesertSummitFunkschach != "abgebrochen": -> funkschach_ende}
{funkschachBegonnen: -> funkschach_partie}
-> funkschach_start

=== funkschach_start ===
~ funkschachBegonnen = true
Im Fenster des Diners steht ein altes CB-Funkgerät. Aus dem Lautsprecher kommen Buchstaben und Zahlen: „Echo vier, Echo zwei.“ #sprecher:erzaehler
{not earlGetroffen:Ein Mann mit Kappe stellt seinen Kaffeebecher ab.|Earl stellt seinen Kaffeebecher ab.} #sprecher:erzaehler
Das ist das Dienstagsturnier der Fernfahrer, zwischen der Wüste und den Bergen. Heute fehlt einer. Willst du einspringen? #sprecher:earl #stimmung:laechelt
-> funkschach_partie

=== funkschach_partie ===
Hier Mama Bear, Pause oben in der Haltebucht. Ich sag dir meine Züge an, du hörst gut hin. #sprecher:mamaBear #stimmung:laechelt
Earl stellt ein Brett neben das Funkgerät. Was aus dem Lautsprecher kommt, setzt er für Mama Bear aufs Brett. #sprecher:erzaehler
~ beginnePartie("wegDesertSummit.funkschach")
-> END

=== funkschach_ende ===
{funkschachFertig: -> END}
~ funkschachFertig = true
Gut gespielt, {held} Junior. Ab heute ist das dein Funkname. #sprecher:mamaBear #stimmung:laechelt
Sag mal, du kommst doch rum. Ich fahre seit drei Wochen versiegelte Kisten von Perfect Move in die Berge. Sie summen. Kisten summen nicht. #sprecher:mamaBear #stimmung:nachdenklich
Mein Laster steht oben in der Haltebucht an der Bergstraße. Schau ihn dir an, wenn du vorbeikommst. #sprecher:mamaBear #stimmung:nachdenklich
-> END

// ---------------------------------------------------------------- Funde am Diner

=== kreide3 ===
{kreide3Gezaehlt:
    Der Springer aus Kreide ist noch da. Daneben die Tür zum Hinterzimmer. #sprecher:erzaehler
    -> END
}
An der Seitenwand des Diners ist ein Springer aus Kreide gemalt, direkt neben einer schmalen Tür. #sprecher:erzaehler
Darunter, ganz klein: „Dreimal klopfen.“ #sprecher:erzaehler
~ kreide3Gezaehlt = true
~ kreideTreffpunkte = kreideTreffpunkte + 1
~ gibFund("kreide3")
{ambroseSprichtWieder:
    {not abschiedGesehen:
        Ein Club ohne Haus. Das gefällt mir. Früher haben wir in Kaffeehäusern gespielt. #sprecher:ambrose #stimmung:laechelt
    }
}
-> END

=== finch_springer_b ===
{finchSpringerBGezaehlt:
    Im Blumenkasten wachsen nur noch Blumen. #sprecher:erzaehler
    -> END
}
Im Blumenkasten am Motel steckt ein kleiner Fink aus Blech. Zwischen den Blumen liegt ein weißer Springer aus Buchsbaum. #sprecher:erzaehler
~ finchSpringerBGezaehlt = true
~ finchFiguren = finchFiguren + 1
~ gibFund("finchSpringerB")
-> END

=== seite08 ===
{seite08Gezaehlt:
    Auf dem Parkplatz liegt nur noch Staub. #sprecher:erzaehler
    -> END
}
Unter einem Reifen des Lasters klemmt eine lose Seite voller Schachdiagramme. #sprecher:erzaehler
~ seite08Gezaehlt = true
~ buchseiten = buchseiten + 1
~ gibFund("seite08")
-> END

=== hinterzimmer_tuer ===
{
- gefundenKreide3:
    ~ hinterzimmerOffen = true
    Du klopfst dreimal. Von drinnen ruft jemand: „Rein mit dir, aber leise.“ #sprecher:erzaehler
- else:
    Eine schmale Tür an der Seite des Diners. Sie ist zu. Auf der Klinke liegt etwas Kreidestaub. #sprecher:erzaehler
}
-> END

// ---------------------------------------------------------------- Hinterzimmer (Treffpunkt K3)

=== mags ===
{
- ausgangWegDesertSummitKreideblitz == "sieg":
    Du hast mich geschlagen. Komm wieder, dann revanchiere ich mich. #sprecher:mags #stimmung:laechelt
    -> END
- ausgangWegDesertSummitKreideblitz != "" and ausgangWegDesertSummitKreideblitz != "abgebrochen":
    Mitgespielt ist mitgespielt. Bei den Kreidespringern zählt das. #sprecher:mags #stimmung:laechelt
    -> END
- magsGetroffen:
    -> mags_angebot
}
~ magsGetroffen = true
Kein Bildschirm, keine Uhr an der Wand. Nur Bretter, Kreide und Kaffee. #sprecher:erzaehler
Mags. Ich fahre Kühlwagen und spiele Blitz aus der Mitte heraus. Drei Minuten, zwei Sekunden dazu. Mitspielen musst du. #sprecher:mags #stimmung:laechelt
-> mags_angebot

=== mags_angebot ===
+ [„Eine Stellung, drei plus zwei.“]
    ~ beginnePartie("wegDesertSummit.kreideblitz")
    -> END
+ [Erst mal zuschauen.]
    Zuschauen ist erlaubt. Reden nicht. #sprecher:mags #stimmung:nachdenklich
    -> END

=== ruth_keene ===
{ruthGetroffen:
    Mama Bear, Ende. Das sage ich auch hier drin. #sprecher:ruthKeene #stimmung:lacht
    -> END
}
~ ruthGetroffen = true
Ruth Keene. Am Funk heiße ich Mama Bear. Hier hinten darf ich einfach Ruth sein. #sprecher:ruthKeene #stimmung:laechelt
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
Ein Wegweiser: „Summit City ↑ 2 Meilen. Hochebene: in Summit City links.“ #sprecher:erzaehler
-> END

=== quelle ===
Aus dem Fels rinnt kaltes Wasser in einen Steintrog. Du trinkst ein paar Schlucke. #sprecher:erzaehler
-> END

=== spur_pm4 ===
{spurPM4Gezaehlt:
    Der Sattelzug steht noch in der Haltebucht. Die Kisten summen. #sprecher:erzaehler
    -> END
}
In der Haltebucht steht ein blauer Sattelzug. Auf den Kisten klebt das Logo von Perfect Move, versiegelt, Ziel „Gebirge“. #sprecher:erzaehler
Wenn man das Ohr an eine Kiste hält, summt sie. Unter dem Scheibenwischer steckt ein Frachtbrief. #sprecher:erzaehler
~ spurPM4Gezaehlt = true
~ spurenPM = spurenPM + 1
~ gibFund("spurPM4")
-> END
// <<< Runde 6 (mittel-4)

// ---------------------------------------------------------------- Wegsperre S17: das Testteam

// 32_Wegsperren.md: Die drei haben die Seite gewechselt, ohne Westen und Tablets. Am Viehgitter
// hinter der Tankstelle spielt Zoe ein Endspiel mit {held}. Anders als bei S15 und S16 öffnet nur
// der Sieg (18.11.2026): Ein Remis ist ein Fehlversuch wie die Niederlage, je Ausgang mit eigenem
// Satz. Der dritte Fehlversuch öffnet auch; testteamGitterNiederlagen zählt beide. Einstiege:
// testteam_gitter (drei Figuren), testteam_gitter_tor (Übergang weiterBergstrasse).
// Regel: Kapitel 8, Mehrbauer verwerten (Abb. 8.2: die Startstellung).
=== testteam_gitter_tor ===
{testteamGitterDurch or ankunftSummitGesehen or not endeAkt3Gesehen: -> END}
-> testteam_gitter

=== testteam_gitter ===
{testteamGitterDurch: -> testteam_gitter_danach}
{testteamGitterSpielt:
    ~ testteamGitterSpielt = false
    {ausgangWegDesertSummitTestteam == "niederlage" or ausgangWegDesertSummitTestteam == "remis":
        ~ testteamGitterNiederlagen = testteamGitterNiederlagen + 1
    }
}
{
- ausgangWegDesertSummitTestteam == "sieg": -> testteam_gitter_durch
- ausgangWegDesertSummitTestteam == "niederlage" or ausgangWegDesertSummitTestteam == "remis": -> testteam_gitter_fehlversuch
}
{not testteamGitterGesehen:
    ~ testteamGitterGesehen = true
    Hinter der Tankstelle liegt ein Viehgitter im Asphalt. Daneben stehen drei und warten auf dich. {testteamStand >= 1:Du kennst sie. Die weißen Westen sind weg, die Tablets auch.|Sie tragen keine Westen und keine Tablets.} #sprecher:erzaehler
    Kein Testteam mehr. Wir prüfen jetzt selber: Wer rauf zur Meisterschaft will, spielt eine Stellung ohne Stöpsel. #sprecher:zoe #stimmung:laechelt
}
Ein Endspiel, fünfzehn Züge. Du hast einen Bauern mehr. Zeig, dass er reicht. #sprecher:zoe #stimmung:laechelt
+ [„Eine Stellung.“]
    -> testteam_gitter_partie
+ [„Später.“]
    Das Gitter liegt morgen auch noch hier. #sprecher:zoe #stimmung:laechelt
    -> END

=== testteam_gitter_partie ===
~ testteamGitterSpielt = true
~ beginnePartie("wegDesertSummit.testteam")
-> END

=== testteam_gitter_fehlversuch ===
{ausgangWegDesertSummitTestteam == "remis":Gehalten ist nicht gewonnen. Mit einem Bauern mehr reicht mir das nicht.|Das zähle ich nicht mehr. Ich merke es mir nur.} #sprecher:zoe #stimmung:laechelt
{testteamGitterNiederlagen >= 3: -> testteam_gitter_genug}
{not abschiedGesehen:
    {ausgangWegDesertSummitTestteam == "remis":Ein Bauer mehr gewinnt nicht von allein. Du musst ihn führen.|Tausche, was dir schadet, und behalte, was dir nützt.} #sprecher:ambrose #stimmung:nachdenklich
- else:
    {ausgangWegDesertSummitTestteam == "remis":Der Bauer mehr hat nicht von allein gewonnen.|Du hast getauscht, was dir nützte, und behalten, was dir schadete.} #sprecher:erzaehler
}
{not wegDesertSummitTafelBestanden:
    Im Diner hängt neben der Kasse eine Tafel mit drei Endspielen. Danach weißt du eher, was du tauschen darfst. #sprecher:erzaehler
}
+ [„Noch einmal.“]
    -> testteam_gitter_partie
+ [„Nicht jetzt.“]
    -> END

=== testteam_gitter_genug ===
Zoe stellt die Figuren zurück in die Schachtel. #sprecher:erzaehler
Dreimal ehrlich versucht. Das reicht uns. Geh durch. #sprecher:zoe #stimmung:laechelt
-> testteam_gitter_offen

=== testteam_gitter_durch ===
Zoe gibt dir über dem Brett die Hand. #sprecher:erzaehler
Ehrlich gespielt. Das schreibe ich auf. Mit der Hand. #sprecher:zoe #stimmung:laechelt
-> testteam_gitter_offen

=== testteam_gitter_offen ===
~ testteamGitterDurch = true
~ testteamStand = 3
Der blaue Laster da oben. Da drin sind unsere Partien. #sprecher:benji #stimmung:nachdenklich
In Silicon Bay hat eine gekündigt, Dr. Lin. Der bringen wir unsere Protokolle. #sprecher:imani #stimmung:nachdenklich
-> END

=== testteam_gitter_danach ===
{~Oben ist die Luft dünn. Zieh langsam.|Zwanzigtausend Partien. Jede davon haben wir selbst gespielt.} #sprecher:zoe #stimmung:laechelt
-> END

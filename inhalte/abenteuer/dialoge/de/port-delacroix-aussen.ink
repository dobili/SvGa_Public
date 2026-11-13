// Ort: Port Delacroix außen (Akt 3): Kai mit Booten, Ruine des Musikhauses, Zelte, Turnhalle,
// Rue des Facteurs (Story-Bibel 19.4). Ambroses Geburtsort.
//
// Szenen der Bibel: Ankunft über den Deich (Ende von Szene 62), 64 Bretter sammeln (Quest
// portDelacroix.wiederaufbau, Besuch 1: vier Häuser), 65 Batiste am Kai (Begegnung
// portDelacroix.batiste, immun gegen Sprüche; beim ersten Sieg Zweite Chance und Kühler Kopf statt
// Pokerface, das keine eigene Wirkung hat), Gebäckstand von Mrs. Arceneaux (Laden
// portDelacroix.gebaeckstand), Weiterreise mit dem Wüstenzug (wenn nadelPortDelacroix).
// Seit Akt 4 führt am Kai ein Luftboot in den Bayou (bayou, wenn musikhausOffen, bayou.ink).
// Einstiege wie in orte.json: ankunft_zu_fuss, deich, bayou, batiste, arceneaux, brett_haus1 bis
// brett_haus4, gebaeckstand, wuestenzug.
//
// Kapitel 37 nach dem Roman: Bretter erbitten (niemand schlägt die Tür zu), Batiste am Boot,
// Slicks Postkarte am Abend; Ambrose fehlt, in seinem Kopf ist es still „wie wenn ein Zahn fehlt“.
// Runde 11 (13.11.2026): Ankunft nach dem Roman (roman/akt3_teil2.md, Kapitel 35): die braune
// Wasserlinie an allen Häusern, die Ruine des Musikhauses, die Trompete zwischen Trauer und Tanz.
//
// Ambrose schweigt nach dem Vorwurf (Szene 63) bis zu den Nachfahren (Szene 68,
// ambroseSprichtWieder); seine Zeilen hängen daran. Variablen: ausgangPortDelacroixBatiste und
// nadelPortDelacroix setzt die Hülle (R42), die übrigen setzt Ink.

EXTERNAL beginnePartie(begegnung)
EXTERNAL oeffneLaden(laden)
EXTERNAL gibKarte(kennung)

VAR ankunftPortDelacroixGesehen = false
VAR ambroseSprichtWieder = false
VAR brettersammelnBegonnen = false
VAR bretterGesammelt = 0
VAR brettHaus1Gesehen = false
VAR brettHaus2Gesehen = false
VAR brettHaus3Gesehen = false
VAR brettHaus4Gesehen = false
VAR batisteGetroffen = false
VAR batisteKarteGegeben = false
VAR ausgangPortDelacroixBatiste = ""
VAR arceneauxGetroffen = false
VAR nadelPortDelacroix = 0
VAR musikhausOffen = false
VAR bayouOffen = false
VAR hatGummistiefel = false
VAR nadelSummitCity = 0
VAR angesehenBauzaun = false

// ---------------------------------------------------------------- Ankunft und Wege

=== ankunft_zu_fuss ===
{ankunftPortDelacroixGesehen:
    Der Deichweg endet am Kai von Port Delacroix. An allen Häusern läuft der braune Strich entlang. #sprecher:erzaehler
    -> END
}
~ ankunftPortDelacroixGesehen = true
Schmale Häuser mit Balkonen aus geschmiedetem Eisen, Fensterläden in Grün und Blau, Palmen. Auf vielen Dächern liegen Planen. #sprecher:erzaehler
An den Hauswänden läuft in Hüfthöhe ein brauner Strich entlang, von Haus zu Haus, schnurgerade. #sprecher:erzaehler
* [„Was ist das?“]
- Da stand das Wasser. #sprecher:mutter
Am Kai ist eine Lücke. Mauern ohne Dach, durch die leeren Fenster sieht man den Himmel. #sprecher:erzaehler
Über dem Eingang hängt ein Schild an einer einzigen Schraube: „Maison de Musique. Club d’Échecs, depuis 1889.“ #sprecher:erzaehler
Das Musikhaus. Mein Vater hat die Orgel darin gestimmt. #sprecher:ambrose #stimmung:fern
Ich habe unter der Empore gesessen und gewartet, bis er fertig war. #sprecher:ambrose #stimmung:fern
* [Warten]
- Er macht einen Schritt darauf zu. Dann noch einen. #sprecher:erzaehler
Aus einem Zelt neben der Ruine kommt eine Trompete, erst langsam, dann plötzlich schnell, als könne sie sich nicht entscheiden. #sprecher:erzaehler #musik:karte
Ich geh zum Notzelt, da brauchen sie Hände. Das Turnier ist in der Turnhalle. Wir sehen uns heute Abend. #sprecher:mutter
-> END

=== deich ===
Zurück auf den Deichweg zur Fähre. #sprecher:erzaehler
-> END

=== wuestenzug ===
{nadelPortDelacroix > 0:
    Am Bahnhof wartet der Wüstenzug nach Westen. Hinter den Bergen liegt Desert Springs. #sprecher:erzaehler
    {ambroseSprichtWieder:
        Wüste. Ich war nie in der Wüste. Es wird Zeit. #sprecher:ambrose
    }
- else:
    Am Bahnhof steht ein Zug nach Westen. Erst willst du hier noch etwas zu Ende bringen. #sprecher:erzaehler
}
-> END

// ---------------------------------------------------------------- Bretter sammeln (Besuch 1)

=== brett_haus1 ===
{
- not brettersammelnBegonnen: -> haus_ohne_auftrag
- brettHaus1Gesehen: -> haus_schon_besucht
}
~ brettHaus1Gesehen = true
An fremde Türen klopfen, in einer Stadt, in der man dich gestern einen Betrüger genannt hat. Niemand schlägt die Tür zu. #sprecher:erzaehler
Ein alter Mann gibt dir ein Brett, dessen eine Hälfte heller ist als die andere. #sprecher:erzaehler
„Die dunkle Seite stand im Wasser. Spielt sich noch.“ #sprecher:erzaehler
-> brett_gezaehlt

=== brett_haus2 ===
{
- not brettersammelnBegonnen: -> haus_ohne_auftrag
- brettHaus2Gesehen: -> haus_schon_besucht
}
~ brettHaus2Gesehen = true
Eine Frau mit einem Säugling auf dem Arm bringt Figuren in einem Marmeladenglas. Zwei Bauern fehlen. #sprecher:erzaehler
Sie hat Muscheln dazugelegt. #sprecher:erzaehler
-> brett_gezaehlt

=== brett_haus3 ===
{
- not brettersammelnBegonnen: -> haus_ohne_auftrag
- brettHaus3Gesehen: -> haus_schon_besucht
}
~ brettHaus3Gesehen = true
In der Rue des Facteurs hängt ein Brett an der Wand eines Wohnzimmers wie ein Bild. Ein Junge steigt auf einen Stuhl und hängt es ab. #sprecher:erzaehler
„Das hat mein Großvater geschnitzt. Nehmt es. An der Wand spielt keiner.“ #sprecher:erzaehler
-> brett_gezaehlt

=== brett_haus4 ===
{
- not brettersammelnBegonnen: -> haus_ohne_auftrag
- brettHaus4Gesehen: -> haus_schon_besucht
}
~ brettHaus4Gesehen = true
Im Fenster eines Hauses mit neuer Tür steht ein Marmorbrett. Die Besitzerin trägt es dir selbst hinaus. #sprecher:erzaehler
Jemand reicht dir im Vorbeigehen etwas Heißes in einer Serviette, Teig mit Zucker, ohne zu fragen, wer du bist. #sprecher:erzaehler
-> brett_gezaehlt

=== brett_gezaehlt ===
~ bretterGesammelt = bretterGesammelt + 1
{bretterGesammelt >= 4: -> bretter_vollstaendig}
{bretterGesammelt} von vier Häusern. Aus jedem zweiten Haus kommt Hämmern. #sprecher:erzaehler
{bretterGesammelt == 1: Es redet niemand neben dir. Es sagt niemand „Zug vierzehn“. Es ist still in deinem Kopf, wie wenn ein Zahn fehlt. #sprecher:erzaehler}
-> END

=== bretter_vollstaendig ===
In der Turnhalle sortiert Miss Odile, was du gebracht hast. Was nicht zusammenpasst, legt sie auch zusammen. #sprecher:erzaehler #musik:odile
Sie singt dabei leise, etwas auf Französisch, das klingt, als wäre es sehr alt. #sprecher:erzaehler
Remy stimmt am anderen Ende seine Trompete. Er sieht auf den Karren. Dann sieht er weg. #sprecher:erzaehler
* [Zum Zelt gehen]
- Am Abend liegt an deinem Platz im Zelt eine Postkarte. Vorn eine Brücke im Regen. #sprecher:erzaehler #musik:riverton.postkarte
„Maple Falls! Wir spielen jetzt unter der alten Steinbrücke. Dach haben wir, Wände nicht. Tamsin sagt, das zählt als Pavillon.“ #sprecher:erzaehler
„Elf Kinder letzten Samstag. Der Stein liegt in der Mitte. Bring den Springer mal vorbei, er fehlt uns. – S.“ #sprecher:erzaehler
Du liest sie dreimal. Dann baust du auf Junos Reisebrett die Stellung von Batiste auf und spielst sie allein noch einmal durch. #sprecher:erzaehler
-> END

=== haus_ohne_auftrag ===
Ein Haus mit neu gestrichener Tür. Drinnen räumt jemand Kisten. #sprecher:erzaehler
-> END

=== haus_schon_besucht ===
Hier warst du schon. Jemand winkt dir aus dem Fenster zu. #sprecher:erzaehler
-> END

// ---------------------------------------------------------------- Mr. Batiste am Kai

=== batiste ===
{
- not batisteGetroffen: -> batiste_erstes_treffen
- ausgangPortDelacroixBatiste == "" or ausgangPortDelacroixBatiste == "abgebrochen": -> batiste_angebot
- ausgangPortDelacroixBatiste == "niederlage": -> batiste_nach_niederlage
- else: -> batiste_nach_sieg
}

=== batiste_erstes_treffen ===
~ batisteGetroffen = true
Am Kai liegt ein Boot kieloben auf zwei Böcken. Ein Mann streicht Pech in die Fugen. Auf einem Eimer steht ein Brett. #sprecher:erzaehler
Du bist der mit dem Rucksack. #sprecher:batiste
* [„Ja.“]
- Hm. Remy ist ein guter Junge. Er hat im Sturm seine Trompete über den Kopf gehalten, vier Stunden lang. #sprecher:batiste
Wer so was gemacht hat, wird empfindlich, wenn einer mit Glas an der Jacke kommt. #sprecher:batiste
Setz dich. Ohne Uhr. Uhren sind was für Leute, die irgendwohin müssen. #sprecher:batiste
-> batiste_angebot

=== batiste_angebot ===
Eine Stellung, in der nichts hängt und alles davon abhängt, welchen Bauern man wohin stellt. Er redet beim Spielen, über das Wasser. #sprecher:erzaehler
+ [„Gut.“]
    ~ beginnePartie("portDelacroix.batiste")
    -> END
+ [„Nicht jetzt.“]
    Ich bin hier. Das Boot auch. #sprecher:batiste
    -> END

=== batiste_nach_sieg ===
{not batisteKarteGegeben:
    ~ batisteKarteGegeben = true
    Du gewinnst nicht schön. Aber allein. #sprecher:erzaehler
    Na also. Jetzt hat es auch keiner gehört. #sprecher:batiste
    Mach ein Gesicht wie das Wasser. Dann weiß keiner, was darunter ist. Auch du nicht, eine Weile. #sprecher:batiste
    Er schiebt dir zwei Karten über die Kiste. Eine für einen zweiten Versuch, eine für einen kühlen Kopf. #sprecher:erzaehler
    ~ gibKarte("zweiteChance")
    ~ gibKarte("kuehlerKopf")
- else:
    Gut gespielt. Keine Worte, nur Züge. So mag ich das. #sprecher:batiste
}
+ [„Noch eine Partie.“]
    ~ beginnePartie("portDelacroix.batiste")
    -> END
+ [„Danke, Mr. Batiste.“]
    -> END

=== batiste_nach_niederlage ===
Junge Leute reden. Das Wasser hört nicht zu. Noch einmal? #sprecher:batiste
+ [„Noch einmal.“]
    ~ beginnePartie("portDelacroix.batiste")
    -> END
+ [„Nicht jetzt.“]
    -> END

// ---------------------------------------------------------------- Mrs. Arceneaux am Gebäckstand

=== arceneaux ===
{arceneauxGetroffen:
    {~Beignets, frisch aus dem Fett! Für Helfer die Hälfte.|Remy ist mein Enkel. Er ist hitzig, aber ein guter Junge.|Das Musikhaus kommt wieder. Die Kuchen für die Eröffnung hab ich schon bei mir selbst bestellt.} #sprecher:arceneaux
    -> arceneaux_laden
}
~ arceneauxGetroffen = true
Vor der Turnhalle steht ein Gebäckstand, Puderzucker überall. Eine alte Dame wischt sich die Hände an der Schürze ab. #sprecher:erzaehler
Arceneaux. Wer hilft, bekommt Gebäck. Wer nicht hilft, bekommt auch Gebäck, aber mit schlechtem Gewissen. #sprecher:arceneaux
Karten hab ich auch. Der Erlös geht ins Musikhaus. #sprecher:arceneaux
-> arceneaux_laden

=== arceneaux_laden ===
~ oeffneLaden("portDelacroix.gebaeckstand")
-> END

=== gebaeckstand ===
-> arceneaux

// ---------------------------------------------------------------- Luftboot in den Bayou (Akt 4)

=== bayou ===
// Sperre S8 (13_Wegenetz): offen nach dem Musikhaus, im Winter nur mit Gummistiefeln; im Sommer
// (Akt 4, erkennbar an der Nadel von Summit City) ohne Stiefel. Der Übergang prüft bayouOffen.
~ bayouOffen = musikhausOffen and (hatGummistiefel or nadelSummitCity > 0)
{
- not musikhausOffen:
    Am Kai liegt ein Luftboot unter einer Plane. „Wenn das Musikhaus wieder offen ist“, steht auf einem Zettel. #sprecher:erzaehler
- not bayouOffen:
    Der Marschpfad steht unter Wasser. Ohne Gummistiefel kommst du hier nicht weiter. #sprecher:erzaehler
- else:
    Der Marschpfad führt hinaus in den Bayou. Das Wasser gluckst um die Stiefel. #sprecher:erzaehler
}
-> END

// ---------------------------------------------------------------- Ansehen (Runde 6)

=== bauzaun ===
{
- musikhausOffen:
    Der Bauzaun ist weg. Am Musikhaus hängt ein neues Schild, und drinnen spielt jemand. #sprecher:erzaehler
- angesehenBauzaun:
    Hinter dem Bauzaun hämmert jemand. Das Musikhaus wird wieder. #sprecher:erzaehler
- else:
    ~ angesehenBauzaun = true
    Ein Bauzaun mit blauer Plane vor dem Musikhaus. Ein Schild: „Betreten verboten. Musik erlaubt.“ #sprecher:erzaehler
}
-> END

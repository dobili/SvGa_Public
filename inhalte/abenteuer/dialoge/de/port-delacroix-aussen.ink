// Ort: Port Delacroix außen (Akt 3): Kai mit Booten, Ruine des Musikhauses, Zelte, Turnhalle,
// Rue des Facteurs (Story-Bibel 19.4). Ambroses Geburtsort.
//
// Szenen der Bibel: Ankunft über den Deich (Ende von Szene 62), 64 Bretter sammeln (Quest
// portDelacroix.wiederaufbau, Besuch 1: vier Häuser), 65 Batiste am Kai (Begegnung
// portDelacroix.batiste, immun gegen Sprüche; beim ersten Sieg Zweite Chance und Kühler Kopf statt
// Pokerface, das keine eigene Wirkung hat), Gebäckstand von Mrs. Arceneaux (Laden
// portDelacroix.gebaeckstand), Weiterreise mit dem Wüstenzug (wenn nadelPortDelacroix).
// Einstiege wie in orte.json: ankunft_zu_fuss, deich, batiste, arceneaux, brett_haus1 bis
// brett_haus4, gebaeckstand, wuestenzug.
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

// ---------------------------------------------------------------- Ankunft und Wege

=== ankunft_zu_fuss ===
{ankunftPortDelacroixGesehen:
    Der Deichweg endet am Kai von Port Delacroix. #sprecher:erzaehler
    -> END
}
~ ankunftPortDelacroixGesehen = true
Der Deichweg endet am Kai. Boote schaukeln, an den Häusern stehen Leitern, auf einem Dach liegt eine Plane. #sprecher:erzaehler
Aus einem Zelt klingt eine Trompete. Jemand hat ein Schild an einen Bauzaun gehängt: „Wir bauen wieder auf.“ #sprecher:erzaehler
Ich geh zum Notzelt, da brauchen sie Hände. Das Turnier ist in der Turnhalle. Wir sehen uns heute Abend. #sprecher:mutter
Hier. Ich bin hier geboren. Nicht in New Orleans, das habe ich immer erzählt, weil es besser klang. #sprecher:ambrose #stimmung:fern #pause
Ich war acht, als wir umzogen. Ich hatte es fast vergessen. #sprecher:ambrose
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
Eine alte Frau öffnet die Tür und reicht dir ein Brett aus dunklem Holz, die Ecken vom Wasser gewellt. #sprecher:erzaehler
Das hat mein Großvater geschnitzt. Nehmt es. Es soll wieder gespielt werden. #sprecher:erzaehler
-> brett_gezaehlt

=== brett_haus2 ===
{
- not brettersammelnBegonnen: -> haus_ohne_auftrag
- brettHaus2Gesehen: -> haus_schon_besucht
}
~ brettHaus2Gesehen = true
Ein Mann mit Gipsarm schiebt mit dem Fuß eine Kiste zur Tür. Darin klappern Figuren, zwei Damen fehlen. #sprecher:erzaehler
Die Damen hat der Sturm genommen. Nehmt den Rest. Ein König ohne Dame ist immer noch ein König. #sprecher:erzaehler
-> brett_gezaehlt

=== brett_haus3 ===
{
- not brettersammelnBegonnen: -> haus_ohne_auftrag
- brettHaus3Gesehen: -> haus_schon_besucht
}
~ brettHaus3Gesehen = true
Zwei Kinder kommen aus einem Hof gerannt und drücken dir ein Klappbrett aus Pappe in die Hand. #sprecher:erzaehler
Das ist unseres. Aber wir spielen eh lieber im Club. Wenn es den wieder gibt. #sprecher:erzaehler
-> brett_gezaehlt

=== brett_haus4 ===
{
- not brettersammelnBegonnen: -> haus_ohne_auftrag
- brettHaus4Gesehen: -> haus_schon_besucht
}
~ brettHaus4Gesehen = true
Im Fenster eines Hauses mit neuer Tür steht ein Marmorbrett. Die Besitzerin trägt es dir selbst hinaus. #sprecher:erzaehler
Das hat mein Großvater geschnitzt. Gut, eigentlich gekauft. Aber er hat es geliebt. Nehmt es. #sprecher:erzaehler
-> brett_gezaehlt

=== brett_gezaehlt ===
~ bretterGesammelt = bretterGesammelt + 1
{bretterGesammelt >= 4: -> bretter_vollstaendig}
{bretterGesammelt} von vier Häusern. Noch ein paar Türen. #sprecher:erzaehler
-> END

=== bretter_vollstaendig ===
Vier Bretter, drei Kisten Figuren, ein Klappbrett aus Pappe. Mehr kannst du kaum tragen. #sprecher:erzaehler
In der Turnhalle sortiert Miss Odile die Figuren auf die Tische und singt dabei leise. #sprecher:erzaehler
Es fühlt sich gut an, ganz allein etwas Gutes zu tun. Und einsam. #sprecher:erzaehler
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
Am Kai flickt ein Mann mit Strohhut ein Boot. Auf einer Kiste neben ihm steht ein Brett. #sprecher:erzaehler
Batiste. Ich flicke Boote, seit es Boote gibt. Fast. #sprecher:batiste
Junge Leute reden. Das Wasser hört nicht zu. #sprecher:batiste
Ich auch nicht. Spar dir deine Sprüche. #sprecher:batiste
-> batiste_angebot

=== batiste_angebot ===
Eine Stellung, du hast Weiß. Ohne Uhr, das Meer hat auch keine. #sprecher:batiste
* [„Gut.“]
    ~ beginnePartie("portDelacroix.batiste")
    -> END
* [„Später.“]
    Ich bin hier. Das Boot auch. #sprecher:batiste
    -> END

=== batiste_nach_sieg ===
Gut gespielt. Keine Worte, nur Züge. So mag ich das. #sprecher:batiste
{not batisteKarteGegeben:
    ~ batisteKarteGegeben = true
    Mach ein Gesicht wie das Wasser. Dann weiß keiner, was darunter ist. #sprecher:batiste
    Er schiebt dir zwei Karten über die Kiste. Eine für einen zweiten Versuch, eine für einen kühlen Kopf. #sprecher:erzaehler
    ~ gibKarte("zweiteChance")
    ~ gibKarte("kuehlerKopf")
}
+ [„Noch eine Partie.“]
    ~ beginnePartie("portDelacroix.batiste")
    -> END
+ [„Danke, Mr. Batiste.“]
    -> END

=== batiste_nach_niederlage ===
Das Wasser war ruhiger als du. Noch einmal? #sprecher:batiste
+ [„Noch einmal.“]
    ~ beginnePartie("portDelacroix.batiste")
    -> END
+ [„Später.“]
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

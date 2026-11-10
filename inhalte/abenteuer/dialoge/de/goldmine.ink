// Nebenort N7 Goldmine bei Ghost Town (Akt 4, Sperre S11): Stollen mit Kammer der Bergleute, Lore und Goldader.
// Nebenquests goldmine.letzteSchicht (Logbuch von 1866) und goldmine.lorenendspiel (Turmendspiele),
// beide klein. Lichtkreis der Laterne und Tönung kommen von mittel-2.

// >>> Runde 6 (mittel-4)
EXTERNAL beginneAufgaben(runde)
EXTERNAL gibFund(kennung)
VAR held = "Du"
VAR hatLaterne = false
VAR grabGesehen = false
VAR goldmineOffen = false
VAR logbuchGefunden = false
VAR lorenBestanden = false
VAR goldaderGefunden = false
VAR ambroseSprichtWieder = false

// Sperre S11: Laterne und Pruitts Geschichte (nach dem Grab). Der Dialog setzt goldmineOffen, die Hülle
// prüft danach `wenn` am Übergang goldmine in Ghost Town.
=== eingang ===
{
- hatLaterne and grabGesehen:
    ~ goldmineOffen = true
    Mr. Pruitt hat die Bretter vom Stolleneingang genommen. Die Laterne wirft einen Kreis auf den Fels. #sprecher:erzaehler
- not grabGesehen:
    Der Stolleneingang ist vernagelt. Auf einem Brett steht: „Betreten verboten. Pruitt.“ #sprecher:erzaehler
- else:
    Hinter den Brettern ist es stockdunkel. Ohne Licht geht hier niemand hinein. #sprecher:erzaehler
}
-> END

=== logbuch ===
{logbuchGefunden:
    Auf dem Tisch ist der Abdruck des Logbuchs im Staub. #sprecher:erzaehler
    -> END
}
-> logbuch_gefunden

=== logbuch_gefunden ===
~ logbuchGefunden = true
Auf dem Tisch in der Kammer liegt ein Logbuch, die Seiten gewellt vom Wasser. Die letzte Eintragung ist von 1866. #sprecher:erzaehler
„Ein Fremder kam in die Mine, setzte sich hier hin und schrieb bei Kerzenlicht einen Brief. Am Morgen war er fort.“ #sprecher:erzaehler
~ gibFund("logbuch1866")
Daneben steht eine alte Grubenlampe. #sprecher:erzaehler
~ gibFund("grubenlampe1866")
{ambroseSprichtWieder:
    Bei Kerzenlicht. Ich erinnere mich an den Geruch von Wachs. #sprecher:ambrose
}
-> END

=== lore ===
{lorenBestanden:
    Die Lore steht wieder auf ihrem Gleis. Turm hinter den Freibauern, sagt Pruitt immer. #sprecher:erzaehler
    -> END
}
Eine Lore auf dem Gleis. Mr. Pruitt hat Kreidestriche auf die Schwellen gemalt: lauter kleine Endspiele. #sprecher:erzaehler
+ [Die Endspiele lösen.]
    ~ beginneAufgaben("goldmine.loren")
    -> END
+ [Weitergehen.]
    -> END

=== goldader ===
{goldaderGefunden:
    Die Goldader glänzt im Laternenlicht. Mehr gibt sie nicht her. #sprecher:erzaehler
    -> END
}
~ goldaderGefunden = true
In der Felswand glänzt eine Goldader. Unter einem Stein liegt ein einzelnes Goldkorn. #sprecher:erzaehler
~ gibFund("goldkorn")
-> END
// <<< Runde 6 (mittel-4)

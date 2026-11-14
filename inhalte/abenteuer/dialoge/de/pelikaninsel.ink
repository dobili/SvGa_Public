// Nebenort N4 Pelikaninsel (Akt 3, Winterwind): Delphine, Old Pete, Coral; Pelikan Bishop bleibt Belebung.
// Nebenquests pelikaninsel.netze (klein, Aufgabenrunde) und pelikaninsel.leuchtfeuer (klein, Batterie
// aus Silicon Bay; die Quelle der Batterie liegt in Silicon Bay bei mittel-3). Watt mit Gummistiefeln.

// >>> Runde 6 (mittel-4)
VAR finchFiguren = 0
EXTERNAL beginneAufgaben(runde)
EXTERNAL gibFund(kennung)
VAR held = "Du"
VAR hatGummistiefel = false
VAR hatBatterie = false
VAR delphineGetroffen = false
VAR peteGetroffen = false
VAR netzeBestanden = false
VAR coralGetroffen = false
VAR muschelGeschenkt = false
VAR leuchtfeuerAuftrag = false
VAR leuchtfeuerAn = false
VAR gefundenFinchBauerH = false

=== delphine ===
{delphineGetroffen:
    Der Wind dreht. Morgen kommt die Fähre später. #sprecher:delphine #stimmung:nachdenklich
    -> END
}
~ delphineGetroffen = true
Delphine. Ich fische hier, seit ich laufen kann. Netz gibt es keins, das Internet kommt nicht über das Wasser. Uns fehlt nichts. #sprecher:delphine #stimmung:laechelt
-> END

=== old_pete ===
{netzeBestanden:
    Das Netz hält wieder. Hier, für dich, aus Treibholz. #sprecher:oldPete #stimmung:laechelt
    -> END
}
{peteGetroffen: -> old_pete_netze}
~ peteGetroffen = true
Ein alter Mann sitzt am Netzgestell und knotet. #sprecher:erzaehler
Eine Masche reißt, und das ganze Netz ist offen. Beim Schach genauso. #sprecher:oldPete #stimmung:nachdenklich
-> old_pete_netze

=== old_pete_netze ===
{netzeBestanden: -> END}
Hilf mir suchen: Wo ist das Loch? Welche Figur hängt? #sprecher:oldPete #stimmung:laechelt
+ [Ich suche mit.]
    ~ beginneAufgaben("pelikaninsel.netze")
    -> END
+ [Später.]
    Das Netz wartet. Die Fische nicht. #sprecher:oldPete #stimmung:laechelt
    -> END

=== netze ===
{netzeBestanden:
    Das Netz ist geflickt. Old Pete hat einen kleinen Turm aus Treibholz daneben gelegt. #sprecher:erzaehler
    ~ gibFund("treibholzTurm")
    -> END
}
Netze hängen zum Trocknen am Gestell. In einem ist ein Loch, groß wie eine Faust. #sprecher:erzaehler
-> END

=== coral ===
{coralGetroffen and muschelGeschenkt:
    Ich hab schon siebzehn Muscheln. Die achtzehnte ist eine Dame, die versteckt sich. #sprecher:coral #stimmung:laechelt
    -> END
}
~ coralGetroffen = true
{
- hatGummistiefel:
    ~ muschelGeschenkt = true
    Mit Stiefeln kommst du ja ins Watt! Hier, die mit dem Loch. Da sieht man genau ein Feld durch. #sprecher:coral #stimmung:ueberrascht
    ~ gibFund("muschelCoral")
- else:
    Komm ins Watt! Aber ohne Gummistiefel bleibst du stecken. #sprecher:coral #stimmung:laechelt
}
-> END

=== watt ===
{
- hatGummistiefel:
    Mit den Gummistiefeln geht es durch den Schlick. Bei jedem Schritt schmatzt es. #sprecher:erzaehler
- else:
    Der Schlick ist tief und kalt. Ohne Gummistiefel versinkt {held} bis zu den Knöcheln. #sprecher:erzaehler
}
-> END

=== leuchtfeuer ===
{
- leuchtfeuerAn:
    Das Leuchtfeuer blinkt wieder über die Bucht. Die Pelikane schauen hin. #sprecher:erzaehler
    -> END
- leuchtfeuerAuftrag and hatBatterie: -> leuchtfeuer_einsetzen
- leuchtfeuerAuftrag:
    Ohne Batterie bleibt das Leuchtfeuer dunkel. Delphine sagt, drüben in Silicon Bay gibt es eine. #sprecher:erzaehler
    -> END
}
-> leuchtfeuer_auftrag

=== leuchtfeuer_auftrag ===
~ leuchtfeuerAuftrag = true
Das Leuchtfeuer auf der Felsspitze ist dunkel. Im Kasten fehlt die Batterie. #sprecher:erzaehler
Seit dem Winter ist es aus. Die Batterie gibt es nur drüben in Silicon Bay. #sprecher:delphine #stimmung:nachdenklich
-> END

=== leuchtfeuer_einsetzen ===
{
- hatBatterie:
    ~ leuchtfeuerAn = true
    {held} setzt die Batterie ein. Das Leuchtfeuer flackert, dann blinkt es über die Bucht. #sprecher:erzaehler
- else:
    Ohne Batterie bleibt das Leuchtfeuer dunkel. #sprecher:erzaehler
}
-> END

=== finch_bauer_h ===
{gefundenFinchBauerH:
    Unter dem Finkenzeichen ist nur noch Sand. #sprecher:erzaehler
    -> END
}
~ gefundenFinchBauerH = true
An einem Pfahl hängt ein kleiner Fink aus Blech. Darunter im Sand steckt ein weißer Bauer aus Buchsbaum. #sprecher:erzaehler
~ gibFund("finchBauerH")
~ finchFiguren = finchFiguren + 1
-> END
// <<< Runde 6 (mittel-4)

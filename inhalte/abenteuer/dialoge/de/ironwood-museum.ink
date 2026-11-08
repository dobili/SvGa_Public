// Ort: Heimatmuseum im alten Bahnhof von Ironwood (Akt 2). Figur: Mr. Teague. Gegenstände:
// Postsack (Quest ironwood.postsack, Runde ironwood.siegelStellung, Fund umschlag), Vitrine mit
// der Zeitung von 1858 (Quest ironwood.erinnerungBird, Runde ironwood.erinnerungBird), Fund
// „Funke aus Glas“.
// Szenen der Story-Bibel: 41 Der leere Umschlag (E4.3, Auflösung erst in Akt 3), 47 Erinnerung:
// Die Zeitung von 1858 (Zugerraten Bird gegen Morphy, mit Schwarz).
// Einstiege wie in orte.json: teague, postsack, vitrine, fund_glasfunke.
// Variablen: siegelStellungBestanden und erinnerungBirdBestanden setzt die Hülle (R42).

EXTERNAL beginneAufgaben(runde)
EXTERNAL gibFund(kennung)

VAR teagueGetroffen = false
VAR siegelStellungBestanden = false
VAR umschlagGeoeffnet = false
VAR erinnerungBirdBestanden = false
VAR glasfunkeGefunden = false

=== teague ===
{teagueGetroffen:
    {~Postsäcke von 1870, nie geöffnet. Manche Briefe kommen eben spät an.|Joe spielt immer das Damengambit. Seit vierzig Jahren. Sag ihm nicht, dass ich das verraten habe.|Die Standuhr geht seit 1902. Ich ziehe sie jeden Sonntag auf.} #sprecher:teague
    -> END
}
~ teagueGetroffen = true
Zwischen alten Fahrkartenschaltern sitzt ein sehr alter Herr mit Wollweste und poliert eine Laterne. #sprecher:erzaehler
Teague. Ich hüte hier, was die Bahn vergessen hat. #sprecher:teague
Postsäcke, Fahrpläne, eine Standuhr. #sprecher:teague
Der Sack dort hinten ist von 1866. Niemand hat ihn je geöffnet. #sprecher:teague
Auf dem Siegel ist eine Schachstellung. #sprecher:teague
-> END

=== postsack ===
{
- umschlagGeoeffnet:
    Der Postsack liegt offen auf dem Tisch. Mr. Teague hat ihn sorgfältig wieder zugebunden. #sprecher:erzaehler
    -> END
- siegelStellungBestanden: -> postsack_offen
}
Ein grauer Postsack mit Wachssiegel. Ins Wachs ist eine kleine Schachstellung geprägt: Weiß am Zug. #sprecher:erzaehler
Wer die Stellung löst, darf den Sack öffnen. So hat es mein Vorgänger beschlossen, und ich halte mich daran. #sprecher:teague
* [Die Stellung lösen]
    ~ beginneAufgaben("ironwood.siegelStellung")
    -> END
* [Später]
    -> END

=== postsack_offen ===
~ umschlagGeoeffnet = true
Mr. Teague bricht das Siegel. Im Sack liegen vergilbte Briefe und ein Umschlag mit fester Schrift. #sprecher:erzaehler
„A. Whitlock, New Orleans.“ Absender: „J. Hale“. #sprecher:erzaehler
Der Umschlag ist leer. #sprecher:erzaehler
~ gibFund("umschlag")
Ambrose schweigt lange. #sprecher:erzaehler #pause
Er hat mir geschrieben. Nachdem ich … Er hat geschrieben. #sprecher:ambrose #stimmung:traurig
* [„Was stand drin?“]
    Ich weiß es nicht. Ich habe ihn nie bekommen. #sprecher:ambrose
* [Nichts sagen]
    Du legst die Hand auf das Brett in deiner Tasche. Es ist warm. #sprecher:erzaehler
- -> END

=== vitrine ===
{erinnerungBirdBestanden:
    In der Vitrine liegt die Zeitung von 1858. Ambrose sieht sie nicht mehr an, aber er lächelt. #sprecher:erzaehler
    -> END
}
In einer Vitrine liegt eine Londoner Zeitung von 1858, aufgeschlagen bei der Schachspalte. #sprecher:erzaehler
Diese Partie habe ich in der Nacht nach meiner Niederlage nachgespielt. Zwanzigmal. #sprecher:ambrose #stimmung:fern
Herr Bird gegen den jungen Morphy, London 1858. Du hast Schwarz, wie er. #sprecher:ambrose
* [„Zeig sie mir.“]
    Morphy verlor nie den Mut. Ich schon, einen Abend lang. #sprecher:ambrose
    ~ beginneAufgaben("ironwood.erinnerungBird")
    -> END
* [„Später.“]
    -> END

=== fund_glasfunke ===
{glasfunkeGefunden:
    Im Schaukasten liegen nur noch alte Fahrkarten. #sprecher:erzaehler
    -> END
}
~ glasfunkeGefunden = true
In einem Schaukasten funkelt ein kleiner Glassplitter, geschliffen wie ein Edelstein. #sprecher:erzaehler
Mr. Teague nickt: „Nimm ihn, er gehört niemandem.“ #sprecher:erzaehler
~ gibFund("glasfunke")
Hübsch. Aber in meinem Kaffeehaus hätte er nicht gebrannt. #sprecher:ambrose
-> END

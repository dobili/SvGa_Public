// Nebenort N2 Lockport, Gasthaus „Zur Schleuse“ (14_Akt2_Leben_teil1.md, 4.1, 4.3 L2, 4.4;
// riverton.md 4.11).
//
// Wirt Henrik Dahl bittet um Hilfe mit seinem Boot (L2, Quest lockport.taue; die Aufgaben stellt
// der Auslöser henriksBoot auf der Außenkarte). Ansehen: Kegelbahn, Foto der Schleuse im
// Hochwasser, Tafel „Kegelkönig des Monats“. Fund: Kegel mit Kerbe (kegelKerbe).
// Einstiege wie in orte.json: henrik, fund_kegel, kegelbahn, foto_hochwasser, kegelkoenig.

EXTERNAL gibFund(kennung)

VAR held = "Du"
VAR henrikGetroffen = false
VAR taueAngenommen = false
VAR taueErledigt = false
VAR kegelKerbeGefunden = false

// ---------------------------------------------------------------- Henrik (L2)

=== henrik ===
{taueErledigt: -> henrik_danach}
{taueAngenommen: -> henrik_wartet}
{henrikGetroffen: -> henrik_angebot}
~ henrikGetroffen = true
Hinter dem Tresen poliert ein alter Mann ein Glas. „Henrik Dahl. Kegelkönig von 1979 bis 1994.“ #sprecher:erzaehler
-> henrik_angebot

=== henrik_angebot ===
„Mein Ruderboot muss für den Winter an Land. Aber es hängt an vier Tauen, und wenn du das falsche löst, kippt alles.“ #sprecher:erzaehler
* [Ich sehe es mir an]
    ~ taueAngenommen = true
    -> henrik_tipp
* [Später]
    „Das Boot hat Zeit. Der Winter nicht.“ #sprecher:erzaehler
    -> END

=== henrik_tipp ===
„Siehst du den Kegel in der Mitte? Der hält alle anderen. Fällt der, fallen sie alle.“ #sprecher:erzaehler
„Das Boot liegt am Kai neben dem Bootsschuppen.“ #sprecher:erzaehler
-> END

=== henrik_wartet ===
„Ein Tau hält das andere. Such das, an dem alles hängt.“ #sprecher:erzaehler
-> END

=== henrik_danach ===
„Alle Neune! … Na ja, acht.“ #sprecher:erzaehler
-> END

// ---------------------------------------------------------------- Ansehen und Fund

=== fund_kegel ===
{kegelKerbeGefunden:
    Der Kegel mit der Kerbe steht wieder in seinem Ständer. #sprecher:erzaehler
    -> END
}
~ kegelKerbeGefunden = true
Am Ende der Bahn steht ein Kegel mit einer tiefen Kerbe. #sprecher:erzaehler
Henrik ruft vom Tresen: „1979 hab ich mit dem alle Neune geworfen. Die Kerbe ist vom Jubeln.“ #sprecher:erzaehler
~ gibFund("kegelKerbe")
-> END

=== kegelbahn ===
Die Kugel poltert die Bahn hinunter. Acht Kegel fallen, einer wackelt und bleibt stehen. #sprecher:erzaehler
-> END

=== foto_hochwasser ===
Ein Foto der Schleuse im Hochwasser: nur noch die Kurbeln schauen aus dem Wasser, und daneben steht Imogen in Gummistiefeln. #sprecher:erzaehler
-> END

=== kegelkoenig ===
Auf der Tafel steht „Kegelkönig des Monats“. Darunter, seit fünfzehn Jahren nicht weggewischt: Henrik. #sprecher:erzaehler
Manche Throne bleiben einfach besetzt. #sprecher:ambrose
-> END

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
Hinter dem Tresen poliert ein alter Mann ein Glas. #sprecher:erzaehler
Henrik Dahl. Kegelkönig von 1979 bis 1994. #sprecher:henrik #stimmung:laechelt
-> henrik_angebot

=== henrik_angebot ===
Mein Ruderboot muss für den Winter an Land. Aber es hängt an vier Tauen, und wenn du das falsche löst, kippt alles. #sprecher:henrik #stimmung:laechelt
* [Ich sehe es mir an]
    ~ taueAngenommen = true
    -> henrik_tipp
* [Später]
    Das Boot hat Zeit. Der Winter nicht. #sprecher:henrik #stimmung:laechelt
    -> END

=== henrik_tipp ===
Siehst du den Kegel in der Mitte? Der hält alle anderen. Fällt der, fallen sie alle. #sprecher:henrik #stimmung:laechelt
Das Boot liegt am Kai neben dem Bootsschuppen. #sprecher:henrik #stimmung:laechelt
-> END

=== henrik_wartet ===
Ein Tau hält das andere. Such das, an dem alles hängt. #sprecher:henrik #stimmung:laechelt
-> END

=== henrik_danach ===
Alle Neune! … Na ja, acht. #sprecher:henrik #stimmung:laechelt
-> END

// ---------------------------------------------------------------- Ansehen und Fund

=== fund_kegel ===
{kegelKerbeGefunden:
    Der Kegel mit der Kerbe steht wieder in seinem Ständer. #sprecher:erzaehler
    -> END
}
~ kegelKerbeGefunden = true
Am Ende der Bahn steht ein Kegel mit einer tiefen Kerbe. #sprecher:erzaehler
Henrik ruft vom Tresen. #sprecher:erzaehler
1979 hab ich mit dem alle Neune geworfen. Die Kerbe ist vom Jubeln. #sprecher:henrik #stimmung:laechelt
~ gibFund("kegelKerbe")
-> END

=== kegelbahn ===
Die Kugel poltert die Bahn hinunter. Acht Kegel fallen, einer wackelt und bleibt stehen. #sprecher:erzaehler
-> END

=== foto_hochwasser ===
Ein Foto der Schleuse im Hochwasser: nur noch die Kurbeln schauen aus dem Wasser, und daneben steht Imogen in Gummistiefeln. #sprecher:erzaehler
-> END

=== kegelkoenig ===
Auf der Tafel steht „Kegelkönig des Monats“. Darunter, seit über dreißig Jahren nicht weggewischt: Henrik. #sprecher:erzaehler
Manche Throne bleiben einfach besetzt. #sprecher:ambrose #stimmung:laechelt
-> END

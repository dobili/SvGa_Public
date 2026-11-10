// Capital, der stillgelegte U-Bahnhof unter der Innenstadt (neuer Innenraum, Runde 6): die Nacht der
// Kreidespringer, Treffpunkt K5 und Ende des Sammelstrangs (Dokument 15, 1.4 und 2.14).
//
// Mo leitet das offene Blitzturnier, drei Runden zu je drei Minuten und zwei Sekunden Zuschlag:
// Dime (Runde 1), Mama Bear (Runde 2) und in Runde 3 ein Junge mit Kapuze, Victor. Mitspielen
// reicht, gewinnen muss niemand. Einstiege wie in orte.json: mo, ereignis_kreidenacht, ausgang.
// Die Ausgänge der drei Begegnungen setzt die Hülle (R42), die übrigen Variablen diese Datei.

EXTERNAL beginnePartie(begegnung)
EXTERNAL gibFund(kennung)
EXTERNAL gibKarte(kennung)

VAR moGetroffen = false
VAR ausgangCapitalArenaKreidenacht1 = ""
VAR ausgangCapitalArenaKreidenacht2 = ""
VAR ausgangCapitalArenaKreidenacht3 = ""
VAR kreidenachtErledigt = false

=== mo ===
{
- kreidenachtErledigt: -> mo_danach
- not moGetroffen: -> mo_erstes
- ausgangCapitalArenaKreidenacht1 == "" or ausgangCapitalArenaKreidenacht1 == "abgebrochen": -> mo_runde1
- ausgangCapitalArenaKreidenacht2 == "" or ausgangCapitalArenaKreidenacht2 == "abgebrochen": -> mo_runde2
- ausgangCapitalArenaKreidenacht3 == "" or ausgangCapitalArenaKreidenacht3 == "abgebrochen": -> mo_runde3
- else: -> mo_victor
}

=== mo_erstes ===
~ moGetroffen = true
Eine Frau mit Kreide an den Fingern steht auf einer Bank und klatscht in die Hände. #sprecher:erzaehler
Mo. Willkommen in der Nacht der Kreidespringer. Drei Runden Blitz, drei Minuten, zwei Sekunden Zuschlag. Gewinnen ist schön, mitspielen ist Pflicht. #sprecher:mo
Alle sind hier: die von der Brücke, von der Raststätte, aus dem Diner, aus den Wäldern. #sprecher:mo
-> mo_runde1

=== mo_runde1 ===
Runde eins. Dime wartet schon, und Dime wartet nicht gern. #sprecher:mo
+ [Runde eins spielen]
    ~ beginnePartie("capitalArena.kreidenacht1")
    -> END
+ [„Gleich.“]
    -> END

=== mo_runde2 ===
Runde zwei. Mama Bear hat ihre eigene Uhr mitgebracht. Ich würde nicht fragen, warum. #sprecher:mo
+ [Runde zwei spielen]
    ~ beginnePartie("capitalArena.kreidenacht2")
    -> END
+ [„Gleich.“]
    -> END

=== mo_runde3 ===
Runde drei. Da hinten sitzt einer mit Kapuze. Hat kein Wort gesagt, aber seine Uhr läuft schon. #sprecher:mo
+ [Runde drei spielen]
    ~ beginnePartie("capitalArena.kreidenacht3")
    -> END
+ [„Gleich.“]
    -> END

=== mo_victor ===
~ kreidenachtErledigt = true
Nach dem letzten Zug zieht dein Gegner die Kapuze vom Kopf. Es ist Victor. #sprecher:erzaehler
Sag es keinem. Hier unten weiß niemand, wer mein Vater ist. Hier spiele ich nur. #sprecher:victor
Zum ersten Mal ohne Kamera. Es war das beste Blitz meines Lebens. #sprecher:victor
Hier, ein Stück Kreide. Für die nächste Wand. Und für die Uhr. #sprecher:mo
~ gibKarte("sanduhr")
~ gibFund("fotoKreidenacht")
Ein Spiel ohne Namen, ohne Kamera, nur zwei Menschen und eine Uhr. So hat alles angefangen. #sprecher:ambrose #stimmung:friedlich
-> END

=== mo_danach ===
{~Nächstes Jahr wieder. Andere Station, gleiche Kreide.|Victor kommt jetzt jeden Donnerstag. Er sagt, wegen der Limonade.|Wer eine Mauer findet, malt einen Springer. So finden wir uns.} #sprecher:mo
-> END

=== ereignis_kreidenacht ===
Drei Klapptische, drei Bretter, drei Uhren. Um die Tische stehen Leute mit Kapuzen und Kreide an den Ärmeln. #sprecher:erzaehler
-> mo

=== ausgang ===
Die Treppe führt hinauf zum Rollgitter und in die Innenstadt. #sprecher:erzaehler
-> END

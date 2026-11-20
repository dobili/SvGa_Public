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
// Aus capital-arena-aussen.ink: Nach dem Abschied (Szene 109) spricht Ambrose nicht mehr
// (Story-Bibel Abschnitt 33, Frage 5; Entscheidung Q21-5). Hier nur gelesen.
VAR abschiedGesehen = false
// Wegsperren (32_Wegsperren.md): testteamStand setzen die Wege 2, 5 und 9; hier nur gelesen.
VAR testteamStand = 0

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
Mo. Willkommen in der Nacht der Kreidespringer. Drei Runden Blitz, drei Minuten, zwei Sekunden Zuschlag. Gewinnen ist schön, mitspielen ist Pflicht. #sprecher:mo #stimmung:laechelt
Alle sind hier: die von der Brücke, von der Raststätte, aus dem Diner, aus den Wäldern. #sprecher:mo #stimmung:laechelt
{testteamStand >= 3:
    Am hinteren Tisch sitzen drei, die du kennst. Ohne Westen, ohne Tablets. Benji verliert gerade und lacht. #sprecher:erzaehler
}
-> mo_runde1

=== mo_runde1 ===
Runde eins. Dime wartet schon, mit einem Endspiel, und Dime wartet nicht gern. #sprecher:mo #stimmung:laechelt
+ [Runde eins spielen]
    ~ beginnePartie("capitalArena.kreidenacht1")
    -> END
+ [„Gleich.“]
    -> END

=== mo_runde2 ===
// Rückmeldung zu Runde eins (Lektorat mittel-1, 19.11.2026: vorher gleich das nächste Angebot).
{ausgangCapitalArenaKreidenacht1:
- "sieg": Gegen Dime gewonnen! Das passiert hier unten nicht oft. #sprecher:mo #stimmung:froh
- "remis": Remis gegen Dime. Hier unten zählt ein halber Punkt wie ein ganzer Handschlag. #sprecher:mo #stimmung:laechelt
- "niederlage": Dime hat die Runde. Macht nichts. Mitspielen ist Pflicht, gewinnen nicht. #sprecher:mo #stimmung:laechelt
}
Runde zwei. Mama Bear hat ihre eigene Uhr mitgebracht. Ich würde nicht fragen, warum. #sprecher:mo #stimmung:lacht
+ [Runde zwei spielen]
    ~ beginnePartie("capitalArena.kreidenacht2")
    -> END
+ [„Gleich.“]
    -> END

=== mo_runde3 ===
// Rückmeldung zu Runde zwei (Lektorat mittel-1, 19.11.2026).
{ausgangCapitalArenaKreidenacht2:
- "sieg": Mama Bear gratuliert dir. Mit ihrer eigenen Uhr in der Hand, das macht sie sonst nie. #sprecher:mo #stimmung:froh
- "remis": Remis gegen Mama Bear. Ihre Uhr hat es dir nicht übel genommen. #sprecher:mo #stimmung:laechelt
- "niederlage": Mama Bear nimmt den Punkt mit. Sie sagt, das liegt an der Uhr. #sprecher:mo #stimmung:lacht
}
Runde drei. Da hinten sitzt einer mit Kapuze. Hat kein Wort gesagt, aber seine Uhr läuft schon. #sprecher:mo #stimmung:nachdenklich
+ [Runde drei spielen]
    ~ beginnePartie("capitalArena.kreidenacht3")
    -> END
+ [„Gleich.“]
    -> END

=== mo_victor ===
~ kreidenachtErledigt = true
Nach dem letzten Zug zieht dein Gegner die Kapuze vom Kopf. Es ist Victor. #sprecher:erzaehler
{ausgangCapitalArenaKreidenacht3:
- "sieg": Er hat verloren und lächelt dabei. #sprecher:erzaehler
- "remis": Er hält dir die Hand hin, bevor die Uhr ganz steht. #sprecher:erzaehler
- "niederlage": Er hat gewonnen und sieht aus, als hätte er etwas geschenkt bekommen. #sprecher:erzaehler
}
Sag es keinem. Hier unten weiß niemand, wer mein Vater ist. Hier spiele ich nur. #sprecher:victor #stimmung:nachdenklich
Zum ersten Mal ohne Kamera. Es war das beste Blitz meines Lebens. #sprecher:victor #stimmung:laechelt
Hier, ein Stück Kreide. Für die nächste Wand. Und für die Uhr. #sprecher:mo #stimmung:laechelt
~ gibKarte("sanduhr")
~ gibFund("fotoKreidenacht")
{not abschiedGesehen:
    Niemand fragt hier nach einem Namen. Zwei Menschen und ein Brett. So war es im Kaffeehaus auch. #sprecher:ambrose #stimmung:friedlich
}
-> END

=== mo_danach ===
{abschiedGesehen:
    {~Nächstes Jahr wieder. Andere Station, gleiche Kreide.|Victor kommt jetzt jeden Donnerstag. Er sagt, wegen der Limonade.|Wer eine Mauer findet, malt einen Springer. So finden wir uns.} #sprecher:mo #stimmung:laechelt
- else:
    {~Nächstes Jahr wieder. Andere Station, gleiche Kreide.|Wer eine Mauer findet, malt einen Springer. So finden wir uns.} #sprecher:mo #stimmung:laechelt
}
-> END

=== ereignis_kreidenacht ===
Drei Klapptische, drei Bretter, drei Uhren. Um die Tische stehen Leute mit Kapuzen und Kreide an den Ärmeln. #sprecher:erzaehler
-> mo

=== ausgang ===
Die Treppe führt hinauf zum Rollgitter und in die Innenstadt. #sprecher:erzaehler
-> END

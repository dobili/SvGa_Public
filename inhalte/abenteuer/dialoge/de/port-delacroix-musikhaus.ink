// Ort: Altes Musikhaus am Kai, Port Delacroix (Akt 3): erst Ruine, nach dem Wiederaufbau der neue
// Clubraum (Story-Bibel 19.4). Gegenstand: das Schild.
//
// Szene der Bibel (Abschnitt 20): 70 Das Schild (Quest portDelacroix.wiederaufbau, Besuch 3 von 3,
// frühestens nach Desert Springs). Einstiege wie in orte.json: schild, blaeser (Akt 4, L1 Schach960:
// die Bläserin Mabel spielt drei Sets mit steigender Stärke, Begegnungen
// portDelacroix.schach960Set1 bis Set3, Nebenquest portDelacroix.schach960, Fund setliste960).
// Beim Aufhängen gibt es den Fund „Erstes Brett im neuen Musikhaus“ (gibFund). Variablen: nadelDesertSprings setzt die Hülle (R42), simultanGedankt die Turnhalle,
// musikhausOffen setzt diese Datei.

EXTERNAL gibFund(kennung)
EXTERNAL beginnePartie(begegnung)

VAR ambroseSprichtWieder = false
VAR simultanGedankt = false
VAR nadelDesertSprings = 0
VAR musikhausOffen = false
VAR held = "Du"
VAR blaeserGetroffen = false
VAR setlisteGeschenkt = false
VAR varianteSchach960Gelernt = false
VAR ausgangPortDelacroixSchach960Set1 = ""
VAR ausgangPortDelacroixSchach960Set2 = ""
VAR ausgangPortDelacroixSchach960Set3 = ""
VAR angesehenLochImDach = false

=== schild ===
{
- musikhausOffen: -> schild_offen
- simultanGedankt and nadelDesertSprings > 0: -> schild_aufhaengen
- simultanGedankt: -> schild_baustelle
- else: -> schild_ruine
}

=== schild_ruine ===
Durch das Dach fällt Regen. An der Wand lehnt ein Schild, die Buchstaben halb abgeblättert. #sprecher:erzaehler
„Musik- und Schachclub Port Delacroix, seit 1889“. Darunter Schlamm, bis auf Kniehöhe. #sprecher:erzaehler
-> END

=== schild_baustelle ===
Handwerker decken das Dach. Das Schild lehnt noch an der Wand und wartet. #sprecher:erzaehler
Das dauert noch, bis zum Frühjahr. Komm wieder, wenn du aus der Wüste zurück bist. #sprecher:odile
-> END

=== schild_aufhaengen ===
~ musikhausOffen = true
Das Dach ist neu. Im Saal stehen Tische, auf jedem eines der Bretter aus der Stadt. In der Ecke glänzt Henris Klavier. #sprecher:erzaehler
Miss Odile, Remy, Lou, Henri und Mama warten unter der Tür. Jemand reicht dir eine Leiter. #sprecher:erzaehler
Du hängst das Schild über die Tür: „Musik- und Schachclub Port Delacroix, seit 1889“. #sprecher:erzaehler #pause
Remy spielt drei Töne auf der Trompete. Alle klatschen. #sprecher:erzaehler
Seit 1889. Und wieder. #sprecher:odile #stimmung:froh
~ gibFund("erstesBrettMusikhaus")
Mein Vater hat für dieses Haus Klaviere gestimmt. Jetzt spielt hier wieder jemand. #sprecher:ambrose #stimmung:froh
-> END

=== schild_offen ===
{~Über der Tür hängt das Schild. Drinnen klappern Figuren, Henris Klavier spielt dazu.|Lou hat ihr Muschelregal bekommen. Remy übt im Nebenraum.|Miss Odile singt beim Aufräumen. Im Takt der Figuren.} #sprecher:erzaehler
-> END

// ---------------------------------------------------------------- Die Bläserin (Akt 4, L1)

=== blaeser ===
{
- not musikhausOffen:
    In der Ruine liegt ein verbeultes Notenpult. Noch spielt hier niemand. #sprecher:erzaehler
    -> END
- not blaeserGetroffen: -> blaeser_regel
- not (ausgangPortDelacroixSchach960Set1 == "sieg" or ausgangPortDelacroixSchach960Set1 == "remis"): -> blaeser_set1
- not (ausgangPortDelacroixSchach960Set2 == "sieg" or ausgangPortDelacroixSchach960Set2 == "remis"): -> blaeser_set2
- not (ausgangPortDelacroixSchach960Set3 == "sieg" or ausgangPortDelacroixSchach960Set3 == "remis"): -> blaeser_set3
- not setlisteGeschenkt: -> blaeser_setliste
- else: -> blaeser_alltag
}

=== blaeser_regel ===
~ blaeserGetroffen = true
~ varianteSchach960Gelernt = true
Eine Bläserin putzt ihre Posaune und lacht dich an. #sprecher:erzaehler
Mabel. Posaune, zweite Reihe, und dienstags Schach. Bei uns stehen die Figuren jeden Abend anders. #sprecher:blaeser #stimmung:froh
Wir spielen nie zweimal dasselbe Stück. Warum sollten wir zweimal dieselbe Eröffnung spielen? #sprecher:blaeser
Wir nennen es Schach960. Die Grundreihe wird gemischt, die Läufer stehen auf verschiedenen Farben, der König irgendwo zwischen den Türmen. #sprecher:blaeser
* [„Und die Rochade?“]
- Rochiert wird wie immer: König und Turm landen auf denselben Feldern wie im normalen Schach. #sprecher:blaeser
Zum Rochieren fasst du erst den König an und dann deinen eigenen Turm. #sprecher:blaeser
Hier hilft dir nichts Auswendiggelerntes, {held}. Sieh hin, was dasteht. #sprecher:ambrose
Als Kind fand ich das Unsinn. Mein Vater stimmte Klaviere, und bei mir sollte jede Figur an ihrem Platz stehen. #sprecher:ambrose #stimmung:lacht
Jetzt lerne ich es eben. Fast zweihundert Jahre zu spät, aber in der richtigen Stadt. #sprecher:ambrose #stimmung:friedlich
-> blaeser_set1

=== blaeser_set1 ===
Erstes Set. Ich würfle die Grundreihe aus, du suchst dir einen Plan. Locker, zum Warmspielen. #sprecher:blaeser
+ [„Spielen wir.“]
    ~ beginnePartie("portDelacroix.schach960Set1")
    -> END
+ [„Später.“]
    Die Band spielt noch bis Mitternacht. Ich auch. #sprecher:blaeser
    -> END

=== blaeser_set2 ===
{ausgangPortDelacroixSchach960Set1 == "sieg":
    Nicht schlecht! Du hast nicht gesucht, was du kennst. Du hast gespielt, was da stand. #sprecher:blaeser
}
Zweites Set. Jetzt spiele ich mit, nicht nur zum Warmwerden. #sprecher:blaeser
+ [„Gern.“]
    ~ beginnePartie("portDelacroix.schach960Set2")
    -> END
+ [„Später.“]
    -> END

=== blaeser_set3 ===
Letztes Set, die Jam-Session. Die ganze Band schaut zu, und ich spiele, so gut ich kann. #sprecher:blaeser
Sie wird schneller und mutiger. Lass dich nicht mitreißen. #sprecher:ambrose
+ [„Ich bin bereit.“]
    ~ beginnePartie("portDelacroix.schach960Set3")
    -> END
+ [„Später.“]
    Jam-Sessions fangen sowieso immer zu spät an. #sprecher:blaeser
    -> END

=== blaeser_setliste ===
~ setlisteGeschenkt = true
Die Band spielt einen Tusch. Mabel hebt die Posaune wie einen Pokal. #sprecher:erzaehler
Drei Sets, und du hast nie nach der Eröffnung gefragt. Hier, unsere Setliste. #sprecher:blaeser #stimmung:froh
Sie gibt dir ein zerknittertes Blatt: neben jedem Lied eine Nummer zwischen 0 und 959, die Startstellung des Abends. #sprecher:erzaehler
~ gibFund("setliste960")
In meiner Stadt, mit gemischten Figuren und einer Posaune. Ich hätte nie gedacht, dass mir das gefällt. #sprecher:ambrose #stimmung:froh
-> END

=== blaeser_alltag ===
{~Heute steht der König auf b1. Gestern auf g1. Morgen? Wer weiß.|Auswendig lernen ist wie Noten ablesen. Schön, aber noch keine Musik.|Remy will Schach960 mit der Trompete ansagen. Ich hab Nein gesagt.} #sprecher:blaeser
+ [„Noch ein Set?“]
    Immer. #sprecher:blaeser
    ~ beginnePartie("portDelacroix.schach960Set3")
    -> END
+ [„Bis bald, Mabel.“]
    -> END

// ---------------------------------------------------------------- Ansehen (Runde 6)

=== loch_im_dach ===
{musikhausOffen:
    Das Dach ist geflickt. Wo das Loch war, ist jetzt ein Fenster, und die Sonne fällt aufs Klavier. #sprecher:erzaehler
    -> END
}
{angesehenLochImDach:
    Durch das Loch im Dach fällt Licht auf die nassen Dielen. #sprecher:erzaehler
    -> END
}
~ angesehenLochImDach = true
Über dir ein Loch im Dach, so groß wie ein Tisch. Ein Lichtstreifen fällt auf die Dielen, mitten in eine Pfütze. #sprecher:erzaehler
{ambroseSprichtWieder: Früher hat hier jemand Trompete gespielt, bis die Fenster zitterten. Jetzt zittert nur das Wasser. #sprecher:ambrose #stimmung:fern}
-> END

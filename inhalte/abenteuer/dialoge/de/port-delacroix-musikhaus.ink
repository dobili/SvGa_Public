// Ort: Altes Musikhaus am Kai, Port Delacroix (Akt 3): erst Ruine, nach dem Wiederaufbau der neue
// Clubraum (Story-Bibel 19.4). Gegenstand: das Schild.
//
// Szene der Bibel (Abschnitt 20): 70 Das Schild (Quest portDelacroix.wiederaufbau, Besuch 3 von 3,
// frühestens nach Desert Springs). Einstieg wie in orte.json: schild.
// Beim Aufhängen gibt es den Fund „Erstes Brett im neuen Musikhaus“ (gibFund). Variablen: nadelDesertSprings setzt die Hülle (R42), simultanGedankt die Turnhalle,
// musikhausOffen setzt diese Datei.

EXTERNAL gibFund(kennung)

VAR simultanGedankt = false
VAR nadelDesertSprings = 0
VAR musikhausOffen = false

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

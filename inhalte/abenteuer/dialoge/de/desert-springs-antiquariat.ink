// Ort: Antiquariat im alten Bahnhof von Desert Springs (Akt 3). Figur: Mr. Okoro (Story-Bibel
// 18.4 und 19.6).
//
// Szene der Bibel (Abschnitt 20): 76 Der Brief (Quest desertSprings.brief, E4): das Siegel mit
// derselben Stellung wie auf dem Umschlag aus Ironwood (Runde desertSprings.siegel), Hales Brief
// von 1866, Partiefragment 7. Einstieg wie in orte.json: okoro.
//
// Hales Brief ist ein Fund (gibFund); Mr. Okoro hat den Laden desertSprings.antiquariat. Variablen: siegelBestanden und gefundenUmschlag setzt die Hülle (R42);
// dotOkoroErzaehlt setzt desert-springs-garage.ink; briefGelesen setzt diese Datei.

EXTERNAL beginneAufgaben(runde)
EXTERNAL gibFund(kennung)
EXTERNAL oeffneLaden(laden)

VAR okoroGetroffen = false
VAR dotOkoroErzaehlt = false
VAR siegelBestanden = false
VAR gefundenUmschlag = false
VAR briefGelesen = false

=== okoro ===
{
- briefGelesen: -> okoro_alltag
- siegelBestanden: -> okoro_brief
- dotOkoroErzaehlt: -> okoro_kiste
- okoroGetroffen: -> okoro_alltag
- else: -> okoro_erstes_treffen
}

=== okoro_erstes_treffen ===
~ okoroGetroffen = true
Zwischen Regalen voller Bücher sitzt ein alter Herr mit Lesebrille und klebt einen Buchrücken. #sprecher:erzaehler
Okoro. Bücher, Karten, alte Fahrpläne. Was hier liegt, hat schon einmal jemandem gehört. #sprecher:okoro
-> okoro_laden

=== okoro_kiste ===
~ okoroGetroffen = true
Der Brückenbauer? Ach, die Kisten im Keller. Die hat eine Familie Hale vor Jahren gebracht. #sprecher:okoro
Im Keller riecht es nach Staub und Papier. In einer Kiste liegt ein Bündel Briefe mit einer Schnur. #sprecher:erzaehler
Einer ist mit rotem Siegellack verschlossen. Ins Siegel ist ein winziges Schachbrett geprägt, mit einer Stellung. #sprecher:erzaehler
{gefundenUmschlag:
    Du holst den leeren Umschlag aus Ironwood hervor. Das Siegel darauf zeigt dieselbe Stellung. #sprecher:erzaehler
}
Wer die Stellung löst, darf das Siegel brechen. So hat man das früher gemacht. #sprecher:okoro
* [Die Stellung lösen]
    ~ beginneAufgaben("desertSprings.siegel")
    -> END
* [Später wiederkommen]
    Die Briefe warten schon lange. Ein paar Tage mehr schaden nicht. #sprecher:okoro
    -> END

=== okoro_brief ===
~ briefGelesen = true
Das Siegel bricht mit einem leisen Knacken. Der Brief ist von 1866, die Schrift schräg und eilig. #sprecher:erzaehler
„Komm nach Norden. Wir spielen die letzten Züge an einem Brett.“ #sprecher:erzaehler
„Ich warte. Josiah Hale.“ #sprecher:erzaehler #pause
Darunter stehen Züge, sauber notiert. Die letzten Züge, die Hale vorschlug. #sprecher:erzaehler
Er hat gewartet. Er hat wirklich gewartet. #sprecher:ambrose #stimmung:still
Behalt den Brief. Bei dir ist er besser aufgehoben als in meinem Keller. #sprecher:okoro
~ gibFund("halesBrief")
-> END

=== okoro_alltag ===
{~Eine Fahrkarte von 1923, ein Kochbuch ohne Umschlag. Alles hat seinen Preis, nur nicht die Geschichten.|Die Familie Hale hat Brücken gebaut, von hier bis in den Norden. Das steht in den Büchern hier.|Lies langsam. Bücher laufen nicht weg.} #sprecher:okoro
-> okoro_laden

=== okoro_laden ===
~ oeffneLaden("desertSprings.antiquariat")
-> END

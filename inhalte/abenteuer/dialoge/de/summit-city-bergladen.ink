// Ort: Bergladen in Summit City (Akt 4): Seile, Wanderkarten, Seilbahnkarten. Der Laden gehört
// Haraldsen (Story-Bibel Abschnitt 31, Weltbeschreibung 5.10); er sitzt meist in Wards Hütte,
// deshalb bedient man sich selbst. Einstieg wie in orte.json: theke.
// Laden summitCity.bergladen (laeden.json): Zweite Chance, Flüstern, Endspielkompass, Seilbahnkarte.

EXTERNAL oeffneLaden(kennung)

VAR bergladenGesehen = false
// Aus capital-arena-aussen.ink: Nach dem Abschied (Szene 109) spricht Ambrose nicht mehr
// (Story-Bibel Abschnitt 33, Frage 5; Entscheidung Q21-5). Hier nur gelesen.
VAR abschiedGesehen = false

=== theke ===
{not bergladenGesehen:
    ~ bergladenGesehen = true
    Im Bergladen riecht es nach Hanf und Wachs. Seile hängen von der Decke, an der Wand Karten von jedem Gipfel. #sprecher:erzaehler
    Auf der Theke steht eine Blechdose und ein Schild: „Bin in Wards Hütte. Bedient euch. Ehrlich bleiben.“ #sprecher:erzaehler
    {not abschiedGesehen:
        Ein Laden, der den Leuten traut. In meiner Zeit hätte er keine Woche überlebt. #sprecher:ambrose #stimmung:lacht
    }
- else:
    Die Blechdose auf der Theke klimpert. „Ehrlich bleiben.“ #sprecher:erzaehler
}
~ oeffneLaden("summitCity.bergladen")
-> END

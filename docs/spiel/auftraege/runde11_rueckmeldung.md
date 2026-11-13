# Auftrag Runde 11: Rückmeldung des Autors aus dem Sammel-Chat (11.11.2026)

**Quelle:** `docs/spiel/auftraege/rueckmeldung/sammlung.md` (R001 bis R070, 68 offene Punkte). Der Autor
hat die Karten auf der Weltkarte angesehen. Jeder liest die ganze Sammlung, nicht nur seine Nummern:
Der Autor nennt Muster, die auf allen Karten gelten.

**Basis:** `claude/friendly-shannon-y8bf90` hereinholen. Keine Rückfragen an den Autor. Bilder nur als
Bildwunsch. Vor dem Push: kartenbau, `uebergaenge`, pytest, `npm run pruefen`, e2e Abenteuer.
Erledigte Nummern in der Meldung nennen; ich hake sie in der Sammlung ab.

## Entscheidungen des Haupt-Chats

1. **Abziehbilder (R055, Hauptpunkt).** Ein Abziehbild ist ein von Hand gezeichnetes Bild ohne Tiefe:
   Man sieht nur eine Front, kein Dach von oben, keine Oberseite, keine Seitenfläche, keinen Schatten.
   Es fällt neben den Paketen (LimeZu) heraus. Regel ab jetzt (KARTENREGELN 10.71):
   - Reihenfolge und Kontrolle stehen in KARTENREGELN 10.71 (Stand 12.11.2026): Katalogbild, dann
     Zusammenbau aus dem Baukasten (`topdown-16/`, vom Autor gekauft, und LimeZu-Teile), dann
     Gemini-Wunsch an den Haupt-Chat; nie selbst zeichnen außer Flaches. Jeder Zusammenbau wird am
     Bild kontrolliert und vom Gutachter einzeln geprüft, bevor er in eine Karte kommt.
2. **Der Gutachter sichtet alle 558 eigenen Bilder** und führt die Liste
   `gutachten/ABZIEHBILDER.md`: Bild, wo benutzt, Urteil, Ersatz aus dem Katalog oder „Gemini“. Die
   Helfer tauschen danach aus.
3. **Straßen (R036, R037).** Drei Arten, die man unterscheidet: Trampelpfad (braun, nur zu Fuß),
   Landstraße (Schotter oder alter Asphalt ohne Bordstein, mit Fahrspuren; hier fährt der Bus),
   Stadtstraße (Asphalt mit Markierung und Bordstein). Übergänge zwischen zwei Arten liegen auf einer
   Karte und sind sichtbar.
4. **Bodenübergänge (R041, R042, R049).** Kein Boden endet mit einer nackten geraden Kante im Gras.
   Befestigte Flächen bekommen einen Randstein oder Saum, Naturboden einen weichen Rand.
5. **Kartenwechsel (R060).** Ein Übergang löst erst aus, wenn die Figur auf dem Feld steht **und** in
   Richtung des Durchgangs geht (Tür: zur Tür hin; Kartenrand: nach außen). Bloßes Darüberlaufen
   wechselt nicht.
6. **Abkürzungen (R030, R031).** Wo die Geschichte einen Weg vorgibt, ist er der einzige Weg: Wald,
   Fels, Zaun, Wasser sperren lückenlos. Ausnahme: Abstecher, an denen es etwas zu finden gibt.
7. **Höhen (R028, R029).** Eine Felswand läuft von Kartenrand zu Kartenrand oder endet an etwas, das
   den Anstieg erklärt (Hang, Treppe, Rampe). Niemand geht um eine Wand herum und steht oben.
8. **Weltlogik (R032 bis R034).** Die Außenkarten müssen sich über ihre Zugänge zu einer Weltkarte
   legen lassen, ohne zu überlappen. Flüsse, Straßen und Gelände setzen sich am Rand fort. Kleine
   Sprünge sind erlaubt, wenn ein ungezeichnetes Zwischenstück sie erklärt.
9. **Innenräume (R063 bis R066).** Form und Größe passen zum Gebäude außen. Ist der Raum kleiner,
   zeigen Türen (auch verschlossene) weitere Räume und Treppenhäuser an. Der Eingang innen liegt, wo
   er außen liegt. Eine Treppe nach unten liegt im Keller dort, wo sie oben liegt.
10. **Figuren (R008, R019, R020).** Wer steht, steht an einer sinnvollen Stelle mit sinnvollem Blick.
    Wer Schach spielt, sitzt. Keine Figur steht mit dem Gesicht zur Wand oder in einem Möbel.

## Verteilung

| Helfer    | Nummern und Aufgabe                                                                                                                                                                                                                                                                                                                                       |
| --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Gutachter | R055: alle eigenen Bilder sichten, `ABZIEHBILDER.md`. R065: je Gebäude mit Innenraum Außenbild gegen Innenraum prüfen (alle Orte), Liste der Abweichungen. Danach wie immer jede geänderte Karte prüfen, dabei ausdrücklich die Nummern der Sammlung abhaken.                                                                                             |
| niedrig-1 | Maple Falls: Diner R003 bis R010 (mit R005a), Clubraum R011 bis R019, Hauptstraße R002, Stadtpark R021 bis R026, Wohnzimmer R001. Kürbishof R045 bis R048. R021: den alten asphaltierten Basketballplatz aus der Git-Geschichte zurückholen.                                                                                                              |
| mittel-1  | Cedar Creek: Ortskern R051 bis R054, R056, R057, R059; Bibliothek R063, R064, R066 (Vorraum unter dem Balkon, Tür zum Treppenhaus, Kellertreppe in eigenem Bereich, Keller unter dem Raum); Waschsalon R061; Archiv R067, R068; Drechslerei R058. Zedernwald R069, R070.                                                                                  |
| mittel-3  | Wege und Weltlogik: Landstraße R036 bis R041, R043, R044; Flussweg R049, R050; Zedernpfad R027, R030, R032; Weltpuzzle R033, R034 für **alle** Außenkarten (Werkzeug, das die Karten über ihre Zugänge aneinanderlegt und Überlappungen und Randbrüche meldet; zuerst Akt 1).                                                                             |
| mittel-4  | Technik im Kartenzeichner: Bodenübergänge R042 (Saum und Randstein für alle befestigten Böden, Regel 4); Höhen R028, R029 (Hang als Abschluss einer Felswand; erst Pakete und Vorbilder ansehen); Treppen im Fels R027 mit mittel-3; Straßenarten (Entscheidung 3) als Technik für alle. Innentür R005 (eigenes Bild aus Paketteilen, wandhoch).          |
| mittel-2  | Spielregeln und Prüfungen: Kartenwechsel R060 (mit Tests und e2e); Abkürzungen R031 als Prüfung für alle Karten (Liste der Karten, auf denen man den Weg umgehen kann) und Behebung auf den eigenen; Figuren R008, R020 für alle Karten als Prüfung (stehende Figur mit Blick zur Wand, in Möbeln; Schachspieler ohne Stuhl), Behebung über die Besitzer. |

## Reihenfolge

1. Gutachter beginnt sofort mit der Sichtung; die Helfer beginnen mit ihren Nummern, die kein neues
   Bild brauchen.
2. Technik von mittel-4 und mittel-2 zuerst pushen und melden, weil die anderen sie benutzen.
3. Abziehbilder tauschen, sobald `ABZIEHBILDER.md` da ist. Jeder tauscht auf **allen** seinen Karten,
   nicht nur in Akt 1.
4. Wünsche für Gemini an den Haupt-Chat: Name, Größe in Kacheln, Ansicht, wofür.

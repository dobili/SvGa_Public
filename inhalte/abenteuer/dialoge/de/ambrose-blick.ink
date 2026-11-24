// Blickpunkte: Ambrose sagt etwas zu einer Stelle, an der {held} zum ersten Mal vorbeikommt, und
// {held} antwortet in Gedanken (Wunsch des Autors, 24.11.2026; Regeln in
// app/src/abenteuer/regeln/blickpunkte.ts, Beschreibung in inhalte/abenteuer/README.md).
//
// Vertrag mit der Hülle:
// - Jede Stelle steht in inhalte/abenteuer/ambrose_blickpunkte.json (Karte, Feld, Radius, Knoten,
//   optional `wann`) und hat hier genau einen Knoten gleichen Namens:
//   `blick_<karte>_<stichwort>`, Punkte der Kartenkennung als „_“
//   (mapleFalls.park, Kiosk → blick_mapleFalls_park_kiosk). Kopfzeile genau `=== name ===`.
//   Mehrere Stellen je Karte sind erwünscht. `python -m pipeline.abenteuer.blickpunkte` prüft beides.
// - Die Hülle spielt den Knoten höchstens einmal und merkt das selbst in der Dialogvariablen
//   `<knoten>_gesehen`, sobald sie ihn öffnet. Hier weder anlegen noch setzen noch abfragen.
// - Sie spielt ihn nur, wenn Ambrose da und wach ist (nach der ersten Lektion, nicht zwischen
//   Tiefpunkt und Versöhnung, nicht nach dem Abschied), nicht in Erinnerungen. Die Knoten brauchen
//   deshalb kein `{not abschiedGesehen: …}`.
// - Form: 1 bis 3 Zeilen Ambrose (`#sprecher:ambrose`), eine Gedankenwahl mit 2 bis 3 Antworten,
//   jede in eckigen Klammern mit `#gedanke` (`* [Text #gedanke]`), höchstens eine Antwortzeile.
//   Keine externen Funktionen, keine Questvariablen setzen, kein Questwissen vorwegnehmen.
//
// PROBE: Die beiden Knoten unten sind Probeknoten der Mechanik (Dachbodenfenster, Kiosk im Park).
// Der Inhalt-Helfer ersetzt sie durch die echten Texte und ergänzt die übrigen Stellen.

VAR held = "Du"

// PROBE (Mechanik): rundes Fenster auf dem Dachboden.
=== blick_mapleFalls_dachboden_fenster ===
Dieses Fenster. Ich habe sehr lange hinausgesehen, ohne etwas zu sehen. #sprecher:ambrose #stimmung:still
* [Jetzt siehst du wieder etwas. #gedanke]
    Ja. Und es ist mehr, als ich erwartet habe. #sprecher:ambrose #stimmung:laechelt
* [Es müsste geputzt werden. #gedanke]
    Seit Jahrzehnten. Fang ruhig an. #sprecher:ambrose #stimmung:laechelt
- -> END

// PROBE (Mechanik): Kiosk im Park von Maple Falls.
=== blick_mapleFalls_park_kiosk ===
Eine Bude voller Zeitungen. Und keine einzige Schachspalte im Fenster? #sprecher:ambrose #stimmung:ueberrascht
* [Die meisten lösen ihre Aufgaben heute am Telefon. #gedanke]
    Am Telefon. Du machst dich über einen alten Mann lustig. #sprecher:ambrose #stimmung:laechelt
* [Wir haben unser eigenes Brett dabei. #gedanke]
    Das ist die richtige Antwort. #sprecher:ambrose #stimmung:laechelt
- -> END

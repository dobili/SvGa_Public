# Codeführer

Wie die App „Schach von Grund auf“ aufgebaut ist: was welcher Teil des Codes macht und wie die
Teile zusammenhängen. Für Leser ohne Programmierkenntnisse geschrieben (Wunsch des Autors vom
26.10.2026). Stand: Version 0.3.43 (1.11.2026), mit Gamifizierung, neuen Startseiten von Buch,
Training, Spielen und Profil, neuen Einstellungen, Startwahl und „Weniger Text“.

## Die Seiten

1. [Grundbegriffe](1-grundbegriffe.md): Datei, Funktion, Komponente, Hook, Import, und woran man
   sich beim Lesen des Codes festhalten kann.
2. [Der Aufbau im Ganzen](2-aufbau.md): vom LaTeX des Buches zur App auf dem Handy, die Ebenen
   der App, die fünf Bereiche der Leiste, die Listen zum Eintragen, was außerhalb des App-Codes
   liegt.
3. [Die Ordner](3-ordner.md): jeder Ordner der App mit seinen wichtigsten Dateien. Aus dieser
   Seite liest auch die Konzeptkarte ihre Texte.
4. [Acht Wege durch den Code](4-ablaeufe.md): Start der App, Abbildung mit Werkzeug, Zug eines
   Bots, Auswertung nach der Partie, Trainingsrunde, Speichern und Offline, Belohnungen, erster
   Start mit Startwahl.
5. [Wo finde ich …?](5-wo-finde-ich.md): häufige Fragen und die Datei dazu.
6. [Woher die Zahlen kommen](6-zahlen.md): die App in Zahlen, Messungen und Lichess-Daten hinter
   den Tabellen.
7. [Die Konzeptkarte](7-konzeptkarte.md): die Karte aller Dateien zum Anklicken, und wie sie
   entsteht.
8. [Verbesserungen für später](8-verbesserungen.md): was bei der Durchsicht aufgefallen ist.

## Selbst bearbeiten

Alle Seiten sind einfache Textdateien (Markdown) und dürfen von jedem geändert werden, der das
Repository bearbeiten darf:

- **Auf GitHub** (auch am Handy): Seite öffnen, oben rechts auf das Stift-Symbol tippen, ändern,
  unten „Commit changes“. Die App ändert sich dadurch nicht; nur die Texte des Codeführers.
- **Formatierung:** `## ` macht eine Überschrift, `- ` einen Listenpunkt, `**fett**` fett,
  `` `name` `` einen Datei- oder Funktionsnamen.
- **Eine Ausnahme:** In [3-ordner.md](3-ordner.md) bleiben die Überschriften `## ` mit dem
  Ordnernamen unverändert, weil die Konzeptkarte daran die Texte zuordnet.

Claude hält die Seiten bei Änderungen am Code aktuell und übernimmt dabei, was du geändert hast.

## Und das Wiki im Dashboard?

Das Wiki unter /admin/ (Reiter „Wiki“) ist kein eigener Text, sondern wird aus diesen Seiten
gebaut: `python -m pipeline.wiki` liest den Codeführer, `docs/ARCHITEKTUR.md`, `docs/BEGRIFFE.md`,
die Entscheidungen, den Fortschritt und die Module der Konzeptkarte und schickt sie nach jedem
Push nach `main` an das Dashboard (Lauf „Wartung“). Buchbefunde bleiben draußen. Ändern also
immer hier in `docs/`; ein GitHub-Wiki gibt es bewusst nicht, weil es in einem eigenen Repository
neben dem Code läge und Code und Beschreibung dann nicht im selben Schritt geändert würden.

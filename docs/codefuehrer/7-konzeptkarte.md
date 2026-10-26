# Die Konzeptkarte

`docs/konzeptkarte.html` im Browser öffnen (am Rechner per Doppelklick, auf GitHub über „Raw“
oder als Artifact-Link im Chat). Sie zeigt:

- **Ordneransicht:** die Ordner als Kreise, ihre Größe nach der Zahl der Zeilen, die Linien nach
  der Zahl der Verbindungen. Ein Tipp auf einen Ordner öffnet ihn.
- **Dateiansicht:** die Dateien eines Ordners mit ihren Verbindungen in andere Ordner.
- **Steckbrief einer Datei:** Zweck, Rolle, alle Funktionen mit ihrem Kommentar, „benutzt“ und
  „wird benutzt von“, jeweils anklickbar.
- **Suche** über Dateinamen, Funktionen und Zwecke.

Neu erzeugen nach Änderungen am Code (im Ordner `app/`): `node skripte/konzeptkarte.mjs`. Das
Skript schreibt `docs/konzeptkarte-daten.js`, die Karte liest diese Datei.

**Woher die Texte kommen:**

- Die Beschreibungen der Ordner stehen in [3-ordner.md](3-ordner.md). Wer dort einen Abschnitt
  ändert, ändert auch den Text in der Karte (nach dem nächsten Erzeugen). Jeder Abschnitt beginnt
  mit `## ` und dem Namen des Ordners genau wie in der Karte; diese Zeilen nicht umbenennen.
- Zweck, Rolle und Funktionen jeder Datei kommen aus den Kommentaren im Code selbst. Sie ändert
  man in der Datei; das übernimmt am besten Claude, damit die Tests laufen.

---

Zurück zur [Übersicht](README.md) · Diese Seite bearbeiten: auf GitHub oben rechts das Stift-Symbol.

# Auftrag mittel-2: kein Auftrag

**Stand:** kein Auftrag (Haupt-Chat, 08.11.2026; der zweite Auftrag, die Spieldaten für Cedar
Creek, ist zusammengeführt)

Danke für Cedar Creek. Entscheidungen des Haupt-Chats zu deinem Bericht:

- **Victor** spielt nach Regelwerk R33 (Trainingsstellung ohne Springer, Karten gesperrt), weil
  mittel-1 die Dialoge so geschrieben hat und die Regel ins Regelwerk gehört; deine Begegnung
  `mapleFalls.victorHerausforderung` wurde dafür zu `mapleFalls.victor`. R28/R33 bleiben, die Bibel
  wird bei Gelegenheit angepasst (Szene 12).
- **Jo:** `mapleFalls.joDuell` heißt jetzt `mapleFalls.skaterJo` (Name aus dem Dialog).
- **Übergänge zwischen Orten:** Der Bus ist eine externe Funktion `reise(karte, ausloeser)` im
  Dialog; die Haltestelle im Park von Maple Falls ist eingetragen. Dein `busZurueck` bekommt den
  Dialog von mittel-1.
- **Auslöser je Karte:** Das Schema hat jetzt ein optionales Feld `karte` am Auslöser; getrennte
  Namen je Seite (wie bei dir) gehen weiter.
- Die Vorschläge zu Schema-Erweiterungen (`erinnerung`, `dialogvariable`, `farbe: wechsel`,
  `meisterpartie`) kommen mit den Aufgabenrunden (Schritt 8f).

Der nächste Auftrag kommt, sobald die Aufgabenrunden stehen (vermutlich: Aufgabenrunden-Daten
und Steckbriefe für Maple Falls und Cedar Creek). Bis dahin nichts tun und warten; der Haupt-Chat
schreibt dir eine Nachricht.

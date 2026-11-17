# Schach-Abenteuer – Überblick

Diese Seite ist der Einstieg ins Wiki des Spiels. Sie sagt in wenigen Absätzen, was das
Schach-Abenteuer ist, wie es mit der Schach-App zusammenhängt und wo die Einzelheiten stehen.

## Was das Spiel ist

Ein Erzählspiel im Pixelstil, in dem Schach die Handlung trägt. Der Held zieht mit der Mutter in
die Kleinstadt Maple Falls, findet auf dem Dachboden ein altes Brett und weckt den Geist Ambrose
Whitlock, der seit 1866 auf das Ende einer Partie wartet. Von dort führt die Reise in vier Akten
durch zwölf Orte bis zur Landesmeisterschaft in der Capital Arena. Unterwegs spielt der Held
Partien gegen Clubchefs, Straßengegner und Freunde, löst Aufgabenrunden, sammelt Hilfskarten,
Funde und Clubnadeln und erfährt nach und nach, was Ambrose mit der Familie Hale verbindet.

## Ziel

- **Schach lernen, ohne dass es nach Lernen aussieht.** Die Gegner spielen auf der Stärke des
  Lesers (eigene Abenteuerwertung, Regelwerk R2, R3), machen Fehler nach Profil und werden mit der
  Geschichte stärker. Die Lektionen stecken in Dialogen, Hilfskarten und Aufgabenrunden.
- **Eine Geschichte, die für sich steht.** Das Spiel braucht das Buch nicht; Buchinhalt kommt nur
  als gesammelte Seiten vor (Entscheidung vom 13.11.2026).
- **Auf dem Handy spielbar.** Steuerkreuz und Aktionsknopf, kurze Wege, offline nach dem ersten
  Laden, Ton als Nachladepaket je Akt.

## Wie es gebaut ist

- **Teil der App, aber getrennt.** Das Spiel liegt in `app/src/abenteuer/` und wird als eigener
  Baustein erst auf Wunsch geladen (Modulgrenze in `schnittstelle/modul.ts`). Partien und
  Aufgabenrunden spielt es mit Brett, Engine und Trainern der App; der Spielstand ist das Feld
  `abenteuer` der Nutzerdaten.
- **Inhalte als Daten.** Gegner, Quests, Orte, Funde, Läden und Texte liegen als JSON in
  `inhalte/abenteuer/`, die Dialoge als Ink, die Karten als Szenenbeschreibungen, aus denen die
  Pipeline Tiled-Karten baut.
- **Grafik und Ton privat.** Gekaufte Grafik (LimeZu-Lizenz), Musik und Porträts liegen im privaten
  Repository und kommen beim Bau ins Zusatzpaket; ohne sie zeigt das Spiel Platzhalter.
- **Viele Prüfungen.** Karten, Übergänge, Sprache und der ganze Spielverlauf (Gesamtsimulation)
  werden von Werkzeugen in `pipeline/abenteuer/` geprüft.

## Wo was steht

- Figuren, Akte und Szenen: Seite „Story-Bibel (Überblick)“.
- Orte und Wege: Seite „Welt“.
- Regeln (Wertung, Nadeln, Karten, Aufgabenrunden): Seite „Regelwerk“.
- Wie Karten gebaut werden: „Kartenregeln“ und „Karteneditor“.
- Alle Entscheidungen zum Spiel: Bereich „Entscheidungen“.
- Code: Codeführer (Oberwelt, Dialog und Ink, Ton, Paket, Regeln und Spielstand, Kartenbau,
  Prüfwerkzeuge, Simulation, Editor), die Module je Ordner und die Begriffe des Spiels.

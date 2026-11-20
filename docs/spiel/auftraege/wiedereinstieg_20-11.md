# Aktübergänge und Wiedereinstieg nach einer Pause (20.11.2026)

Auftrag des Haupt-Chats: Der Autor spielt die 13 bis 18 Stunden über mehrere Tage. Die ersten
15 Minuten von Akt 2, 3 und 4 lesen wie jemand, der nach zwei Tagen zurückkommt, und prüfen, was
das Spiel beim Laden nach einer langen Pause bietet. Grundlage: Lesefassung (Startwert 1, mit
Akten).

## Aktanfänge

| Akt | Wo bin ich? | Worum geht es? | Nächstes Ziel klar? |
| --- | --- | --- | --- |
| 2, Ankunft in Riverton | ja: Bahnhof, Regen, Juno nennt die Stadt | fehlte: keine Zeile zu den Nadeln (behoben) | ja: Juno nennt Pavillon und Slick, Quest „Der letzte Tisch“ |
| 3, Ankunft in Silicon Bay | ja: Glasstadt, Victor holt euch ab | ja: „Ihr seid gekommen.“ „Du hast eingeladen.“ | ja: Quest „Bei Dr. Lin in der Akademie melden“, Hotel sagt „nach der Partie gegen Dr. Lin“ |
| 4, Ankunft in Summit City | ja: Berge, Seilbahn, Mama dabei | ja: Plakat der Landesmeisterschaft mit Nova, Victor und dir | ja: Mama nennt die Hütte der Großmeisterin |

Akt 3 und 4 erinnern in den ersten Zeilen an Ort, Leute und Ziel; dort war nichts zu tun.
Akt 2 erzählte die Stadt schön, sagte aber nicht, warum man da ist.

## Im Text behoben

1. `riverton-aussen.ink`, Ankunft: Juno sagt nach Ambroses „Ohne Wartezeit …“ eine Zeile zu den
   Nadeln („Zwei Nadeln haben wir schon. Die dritte hängt hier irgendwo im Regen.“; ohne Nadel aus
   Cedar Creek: „Hier gibt es die nächste Nadel. Diesmal holen wir sie.“).

## Laden nach einer Pause (umgesetzt, Regel 9)

Vorher: Beim Laden stand der Held an seiner Stelle; Ortsschild ja, aber kein Wort dazu, was er
gerade vorhatte. Das stand nur im Tagebuch.

Jetzt:

- Der Spielstand merkt sich `zuletztGespielt` (ISO), gesetzt beim Sichern der Sitzung
  (Kartenwechsel, App in den Hintergrund, Verlassen der Welt).
- Liegt das beim ersten Laden der Welt in einer Sitzung mehr als einen Tag zurück, kommt sobald
  die Welt frei ist einmal die Meldung „Willkommen zurück! {Aufgabe}: {nächster Schritt}“
  (`wiedereinstieg.meldung` in `texte/de.json`). Die Aufgabe ist die verfolgte (Zielpfeil), sonst
  die zuletzt angenommene Hauptquest.
- Einmal je Sitzung: Der Merker liegt im Modul (`oberwelt/useWiedereinstieg.ts`), nicht im
  Spielstand. Regeln in `regeln/wiedereinstieg.ts` mit Tests; alte Spielstände ohne Zeitstempel
  bekommen keine Meldung.

## Noch offen für Code (Vorschlag, nicht umgesetzt)

- Ein „Was bisher geschah“ je Akt (zwei, drei Sätze) im Tagebuch wäre die nächste Stufe; die
  Szenen (`setzeSzene`) und Romankapitel gäben die Sätze her. Erst sinnvoll, wenn der Autor das
  möchte, weil es neue Texte für jeden Akt braucht.

## Prüfungen

Gate wie üblich (Übersetzung, Sprache, Besuchszähler, nächster Schritt, Erzählzeit, ruff, pytest,
`npm run pruefen`, Rückmeldung, Gesamtsimulation Startwert 1 bis 3, Ambrose danach) und die
Oberflächentests des Abenteuers in Chromium.

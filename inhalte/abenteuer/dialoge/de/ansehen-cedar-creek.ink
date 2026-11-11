// Dinge zum Ansehen in den Innenräumen von Cedar Creek (Akt 1): Bibliothek, Archiv, Waschsalon.
//
// Je Raum drei Gegenstände (im Archiv zwei, dazu Karton und Programmheft der Geschichte) ohne
// Spielwirkung (docs/spiel/09_Weltbeschreibung.md, Abschnitt 3 Punkt 2 und 5.3): beim ersten
// Ansehen ein Satz (manchmal mit Ambrose), danach ein zweiter. Keine Quests, keine Belohnungen.
// Einstiege wie in orte.json: zeitungsregal, globus, schild_fluestern, treppenhaus, boxerfoto, wasserfleck,
// zettel_turm, comicheft, automat.
//
// Variablen „angesehen…“ je Gegenstand, weil Ink-Besuchszähler einen neuen Dialog nicht
// überleben (siehe ansehen-maple-falls.ink).

VAR angesehenZeitungsregal = false
VAR angesehenGlobus = false
VAR angesehenSchildFluestern = false
VAR angesehenBoxerfoto = false
VAR angesehenWasserfleck = false
VAR angesehenTreppenhaus = false
VAR angesehenZettelTurm = false
VAR angesehenComicheft = false
VAR angesehenAutomat = false

// ---------------------------------------------------------------- Bibliothek

=== zeitungsregal ===
{angesehenZeitungsregal:
    In der Lokalzeitung steht eine Schachaufgabe: „Weiß am Zug. Lösung nächste Woche.“ Jemand hat sie schon mit Bleistift gelöst. #sprecher:erzaehler
- else:
    ~ angesehenZeitungsregal = true
    Ein Regal mit Zeitungen aus aller Welt. Die neueste ist von gestern, die älteste von 1890. #sprecher:erzaehler
}
-> END

=== globus ===
{angesehenGlobus:
    Auf dem Globus hat jemand mit Bleistift ein winziges Kreuz neben Lagos gemalt. #sprecher:erzaehler
- else:
    ~ angesehenGlobus = true
    Ein alter Globus mit vergilbten Meeren. Manche Länder darauf gibt es heute nicht mehr. #sprecher:erzaehler
    Ich suche New Orleans. Da. Es ist noch da. #sprecher:ambrose #stimmung:froh
}
-> END

=== schild_fluestern ===
{angesehenSchildFluestern:
    Das Schild „Bitte flüstern“ hängt schief. Vielleicht hat jemand zu laut gelacht. #sprecher:erzaehler
- else:
    ~ angesehenSchildFluestern = true
    Ein Schild am Tresen: „Bitte flüstern“. #sprecher:erzaehler
    Flüstern kann ich gut. Ich habe sogar eine Karte dafür. #sprecher:ambrose #stimmung:lacht
}
-> END

// ---------------------------------------------------------------- Archiv

=== treppenhaus ===
{angesehenTreppenhaus:
    Die Tür zum Treppenhaus bleibt zu. Oben knarrt eine Diele. #sprecher:erzaehler
- else:
    ~ angesehenTreppenhaus = true
    Eine Tür mit einem Messingschild: „Treppenhaus. Magazin und Lesezimmer im ersten Stock, nur für Personal.“ #sprecher:erzaehler
    Abgeschlossen. Von oben riecht es nach noch mehr Büchern. #sprecher:erzaehler
}
-> END

=== boxerfoto ===
{angesehenBoxerfoto:
    Auf der Rückseite steht: „Verlor den Kampf. Gewann danach jede Schachpartie im Ort.“ #sprecher:erzaehler
- else:
    ~ angesehenBoxerfoto = true
    Ein vergilbtes Foto: ein Boxer mit erhobenen Fäusten, darunter „Cedar Creek, 1923“. #sprecher:erzaehler
    Ein Mann mit zwei Talenten. Das zweite war das bessere. #sprecher:ambrose
}
-> END

=== wasserfleck ===
{angesehenWasserfleck:
    Der Springer auf dem Boden greift von seinem Feld aus drei Kartons auf einmal an. #sprecher:erzaehler
- else:
    ~ angesehenWasserfleck = true
    Auf dem Steinboden ein dunkler Wasserfleck, genau in der Form eines Springers. #sprecher:erzaehler
    Selbst das Wasser in diesem Keller spielt Schach. Ich fühle mich hier wohl. #sprecher:ambrose #stimmung:lacht
}
-> END

// ---------------------------------------------------------------- Waschsalon

=== zettel_turm ===
{angesehenZettelTurm:
    Unter den Zettel hat jemand geschrieben: „Schon im Trockner nachgesehen?“ #sprecher:erzaehler
- else:
    ~ angesehenZettelTurm = true
    Ein Zettel am schwarzen Brett: „Verloren: ein weißer Turm. Finderlohn: eine Wäsche umsonst.“ #sprecher:erzaehler
}
-> END

=== comicheft ===
{angesehenComicheft:
    Auf der letzten Seite gewinnt der Held mit einem einzigen Bauern. Jemand hat „Unrealistisch!“ an den Rand geschrieben. #sprecher:erzaehler
- else:
    ~ angesehenComicheft = true
    Ein zerlesenes Comicheft: Ein Held mit Umhang kämpft gegen einen Roboter, natürlich am Schachbrett. #sprecher:erzaehler
}
-> END

=== automat ===
{angesehenAutomat:
    Im Automaten klemmt seit Wochen eine Kaugummikugel. Mr. Boateng nennt sie „das Denkmal“. #sprecher:erzaehler
- else:
    ~ angesehenAutomat = true
    Ein Automat für Waschpulver und Kaugummi. Eine Kugel Kaugummi kostet eine Münze. #sprecher:erzaehler
    Eine Maschine, die für eine Münze etwas tut. Das gab es zu meiner Zeit nur bei Menschen. #sprecher:ambrose
}
-> END

// Dinge zum Ansehen in den Innenräumen von Maple Falls (Akt 1): Wohnzimmer, Dachboden, Clubraum.
//
// Je Raum drei Gegenstände ohne Spielwirkung (docs/spiel/09_Weltbeschreibung.md, Abschnitt 3
// Punkt 2 und 5.1): beim ersten Ansehen ein Satz (manchmal mit einem Satz von Ambrose), danach
// ein zweiter. Keine Quests, keine Belohnungen. Einstiege wie in orte.json (Auslöser in
// camelCase, Knoten in snake_case): foto_grandma, karton_kueche, pizzakarton, hutschachtel,
// spiegel, zeitungen1961, pokalvitrine, brett_ohne_dame, plakat_zaehlen.
//
// Variablen: Die Hülle legt für jeden Dialog eine neue Ink-Geschichte an; Besuchszähler von Ink
// überleben das nicht. Deshalb merkt sich je Gegenstand eine Variable „angesehen…“ (Spielstand,
// dialogvariablen), ob er schon einmal angesehen wurde.
// Nichts hier verrät Akt 2 (Bibel, Abschnitt 2.3: Mamas Vergangenheit bleibt verborgen).

VAR angesehenFotoGrandma = false
VAR angesehenKartonKueche = false
VAR angesehenPizzakarton = false
VAR angesehenHutschachtel = false
VAR angesehenSpiegel = false
VAR angesehenZeitungen1961 = false
VAR angesehenPokalvitrine = false
VAR angesehenBrettOhneDame = false
VAR angesehenPlakatZaehlen = false

// ---------------------------------------------------------------- Wohnzimmer

=== foto_grandma ===
{angesehenFotoGrandma:
    Grandma Whitlock lächelt auf dem Foto, als hätte sie gerade einen guten Zug gesehen. #sprecher:erzaehler
- else:
    ~ angesehenFotoGrandma = true
    Ein gerahmtes Foto: eine alte Dame mit weißem Dutt, vor ihr ein Schachbrett. Auf der Rückseite steht „Grandma Whitlock“. #sprecher:erzaehler
    Sie hält den König richtig. Das sieht man sogar auf einem Bild. #sprecher:ambrose #stimmung:stolz
}
-> END

=== karton_kueche ===
{angesehenKartonKueche:
    Im Karton klappern Teller. Dazwischen liegt ein einzelner weißer Bauer aus Plastik, keiner weiß, woher. #sprecher:erzaehler
- else:
    ~ angesehenKartonKueche = true
    Ein Karton mit der Aufschrift „Küche?“. Das Fragezeichen ist dreimal unterstrichen. #sprecher:erzaehler
}
-> END

=== pizzakarton ===
{angesehenPizzakarton:
    Der Pizzakarton liegt immer noch da. Er gehört inzwischen fast zur Einrichtung. #sprecher:erzaehler
- else:
    ~ angesehenPizzakarton = true
    Ein leerer Pizzakarton auf dem Boden. Ein Stück fehlt, und niemand gibt es zu. #sprecher:erzaehler
    Zu meiner Zeit aß man von Tellern. Und man räumte sie weg. #sprecher:ambrose
}
-> END

// ---------------------------------------------------------------- Dachboden

=== hutschachtel ===
{angesehenHutschachtel:
    Die Feder am Hut wippt, wenn du die Schachtel anstößt. #sprecher:erzaehler
- else:
    ~ angesehenHutschachtel = true
    Eine runde Hutschachtel mit Samtband. Darin liegt ein Damenhut mit einer kleinen Feder. #sprecher:erzaehler
    Ein Hut für den Sonntag. Meine Schwester trug so einen zur Kirche. #sprecher:ambrose
}
-> END

=== spiegel ===
{angesehenSpiegel:
    Im Spiegel nur du und die Kisten. Ambrose schweigt diesmal höflich. #sprecher:erzaehler
- else:
    ~ angesehenSpiegel = true
    Ein alter Spiegel mit einem Sprung quer über das Glas. Darin siehst du dich und die Kisten, sonst niemand. #sprecher:erzaehler
    Ich habe nachgesehen. Geister haben kein Spiegelbild. Schade, ich war ein ansehnlicher Mann. #sprecher:ambrose #stimmung:lacht
}
-> END

=== zeitungen1961 ===
{angesehenZeitungen1961:
    Unter der Meldung ein Foto: eine junge Frau mit Pokal, sehr ernst und sehr stolz. #sprecher:erzaehler
- else:
    ~ angesehenZeitungen1961 = true
    Ein Stapel Zeitungen von 1961, gelb und brüchig. Ganz oben: „Miss Whitlock gewinnt die Schachmeisterschaft des Kreises“. #sprecher:erzaehler
    Eine Whitlock, die gewinnt. Endlich. #sprecher:ambrose #stimmung:stolz
}
-> END

// ---------------------------------------------------------------- Clubraum

=== pokalvitrine ===
{angesehenPokalvitrine:
    Ein Platz in der Vitrine ist leer. Daneben klebt ein Zettel in Coach Delgados Schrift: „Reserviert“. #sprecher:erzaehler
- else:
    ~ angesehenPokalvitrine = true
    In der Vitrine stehen drei Pokale von 1994, darauf „Kreismeister Schach, Maple Falls High“. #sprecher:erzaehler
}
-> END

=== brett_ohne_dame ===
{angesehenBrettOhneDame:
    Der Radiergummi steht immer noch auf d8. Angeblich hat er schon zwei Partien gewonnen. #sprecher:erzaehler
- else:
    ~ angesehenBrettOhneDame = true
    Auf einem Brett fehlt die schwarze Dame. An ihrer Stelle steht ein Radiergummi. #sprecher:erzaehler
    Ein Radiergummi als Dame. Wenigstens zieht er nicht zu früh heraus. #sprecher:ambrose #stimmung:lacht
}
-> END

=== plakat_zaehlen ===
{angesehenPlakatZaehlen:
    Unten auf dem Plakat steht klein: Angreifer und Verteidiger zählen, Kapitel 1, Abschnitt 1.4. #sprecher:erzaehler
- else:
    ~ angesehenPlakatZaehlen = true
    Ein handgemaltes Plakat: „Erst zählen, dann schlagen!“ Darunter ist mit Filzstift eine Trillerpfeife gezeichnet. #sprecher:erzaehler
    Gegen dieses Plakat habe ich nichts einzuwenden. Ausnahmsweise. #sprecher:ambrose
}
-> END

// Dinge zum Ansehen in den Innenräumen von Maple Falls (Akt 1): Wohnzimmer, Dachboden, Clubraum.
//
// Je Raum drei Gegenstände ohne Spielwirkung (docs/spiel/09_Weltbeschreibung.md, Abschnitt 3
// Punkt 2 und 5.1): beim ersten Ansehen ein Satz (manchmal mit einem Satz von Ambrose), danach
// ein zweiter. Keine Quests, keine Belohnungen. Einstiege wie in orte.json (Auslöser in
// camelCase, Knoten in snake_case): karton_kueche, pizzakarton, hutschachtel,
// spiegel, zeitungen1961, pokalvitrine, brett_ohne_dame, plakat_zaehlen.
// Neu nach dem Roman zu Akt 1 (docs/spiel/roman/akt1_teil1.md, akt1_teil2.md), noch ohne Auslöser
// auf den Karten (Karten macht ein eigener Auftrag): kiste_whitlock (Dachboden, neben der Treppe),
// tisch_pizzakarton (Wohnzimmer, Zustand nach dem ersten Abend), kreidebrett (Birch Lane, vor
// Lilys Haus), bildschirm_pult (Clubraum, Zustand nach Victor).
//
// Variablen: Die Hülle legt für jeden Dialog eine neue Ink-Geschichte an; Besuchszähler von Ink
// überleben das nicht. Deshalb merkt sich je Gegenstand eine Variable „angesehen…“ (Spielstand,
// dialogvariablen), ob er schon einmal angesehen wurde.
// Nichts hier verrät Akt 2 (Bibel, Abschnitt 2.3: Mamas Vergangenheit bleibt verborgen).

VAR angesehenKartonKueche = false
VAR angesehenPizzakarton = false
VAR angesehenHutschachtel = false
VAR angesehenSpiegel = false
VAR angesehenZeitungen1961 = false
VAR angesehenPokalvitrine = false
VAR angesehenBrettOhneDame = false
VAR angesehenPlakatZaehlen = false
VAR angesehenKisteWhitlock = false
VAR ersteLektionBesprochen = false
VAR angesehenTischPizzakarton = false
VAR angesehenKreidebrett = false
VAR lilyGeholfen = false
VAR angesehenBildschirmPult = false
VAR nadelCedarCreek = 0

// ---------------------------------------------------------------- Wohnzimmer

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
    Zu meiner Zeit aß man von Tellern. Und man räumte sie weg. #sprecher:ambrose #stimmung:nachdenklich
}
-> END

// Roman, Kapitel 4: Der Tisch steht nach dem ersten Abend, ein gefalteter Pizzakarton unter einem
// Bein. Gehört zur Zustandsfassung des Wohnzimmers mit Tisch.
=== tisch_pizzakarton ===
{angesehenTischPizzakarton:
    Der Tisch wackelt nur noch, wenn man sich darauf stützt. Das ist jetzt eben so. #sprecher:erzaehler
- else:
    ~ angesehenTischPizzakarton = true
    Unter einem Tischbein steckt ein gefalteter Pizzakarton. Der Tisch wackelt nicht mehr. Fast nicht. #sprecher:erzaehler
    Bei uns legte man ein Spielkartenblatt unter. Herz Sieben, meistens. #sprecher:ambrose #stimmung:lacht
}
-> END

// Roman, Kapitel 6: Lilys Kreidebrett auf dem Gehweg vor dem Nachbarhaus, schief, neun Felder in
// einer Reihe. Bleibt als Spur liegen und verblasst über die Akte (Karten). Nach Lilys Lektion
// (lilyGeholfen) sind Springerzüge dazugemalt.
=== kreidebrett ===
{
- lilyGeholfen:
    Neben dem Kreidebrett ist ein L gemalt, dann noch eins und noch eins, bis zur Ecke. Weiß, schwarz, weiß, schwarz. #sprecher:erzaehler
    {not angesehenKreidebrett:
        ~ angesehenKreidebrett = true
        Neun Felder in einer Reihe. Sie wird es merken, wenn sie so weit ist. Der Springer zuerst. #sprecher:ambrose #stimmung:lacht
    }
- angesehenKreidebrett:
    Das Plastikpferd liegt noch auf dem Kreidebrett. Es wartet. #sprecher:erzaehler
- else:
    ~ angesehenKreidebrett = true
    Ein Schachbrett aus Kreide auf dem Gehweg, schief, mit neun Feldern in einer Reihe. Darauf steht ein Plastikpferd. #sprecher:erzaehler #klang:kreide
}
-> END

// ---------------------------------------------------------------- Dachboden

=== hutschachtel ===
{angesehenHutschachtel:
    Die Feder am Hut wippt, wenn du die Schachtel anstößt. #sprecher:erzaehler
- else:
    ~ angesehenHutschachtel = true
    Eine runde Hutschachtel mit Samtband. Darin liegt ein Damenhut mit einer kleinen Feder. #sprecher:erzaehler
    Ein Hut für den Sonntag. Meine Schwester trug so einen zur Kirche. #sprecher:ambrose #stimmung:nachdenklich
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

// Roman, Kapitel 1: Die Kiste aus dem Flur, die {held} am ersten Tag hinaufträgt. Die Schrift ist
// dieselbe wie auf allen Kisten und auf der Rückseite der Karten (Kapitel 3).
=== kiste_whitlock ===
// Das Foto von Mrs. Whitlock liegt in der Kiste, nicht mehr im Wohnzimmer: Laut Roman ist alles von
// ihr auf dem Dachboden (Entscheidung des Hauptchats 13.11.2026).
{angesehenKisteWhitlock:
    {ersteLektionBesprochen:
        Dieselbe steile Schrift wie auf dem Fingerzeig. Du drehst die Karte in der Tasche um und vergleichst. #sprecher:erzaehler
    - else:
        Die Kiste steht bei den anderen. „Bettwäsche“, „Briefe 1970–1989“, „Weihnachten“. Alles in derselben steilen Schrift. #sprecher:erzaehler
    }
- else:
    ~ angesehenKisteWhitlock = true
    Eine Kiste aus Holz, nicht aus Pappe. Auf dem Deckel steht in steiler, altmodischer Schrift: „Whitlock – nicht wegwerfen“. #sprecher:erzaehler
    Obenauf ein gerahmtes Foto: eine Frau mit weißem Dutt, vor ihr ein Schachbrett. Auf der Rückseite: „Margaret, Sonntag“. #sprecher:erzaehler #klang:holzklacken
    Sie hält den König richtig. Das sieht man sogar auf einem Bild. #sprecher:ambrose #stimmung:still
}
-> END

// ---------------------------------------------------------------- Clubraum

=== pokalvitrine ===
{angesehenPokalvitrine:
    Ein Platz in der Vitrine ist leer. Daneben klebt ein Zettel in Coach Delgados Schrift: „Reserviert“. #sprecher:erzaehler
- else:
    ~ angesehenPokalvitrine = true
    In der Vitrine stehen drei Pokale, alle von 1994, darauf „Kreismeister Schach, Schule Maple Falls“. #sprecher:erzaehler
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
    Unten auf dem Plakat steht klein: Erst zählen, dann schlagen. #sprecher:erzaehler
- else:
    ~ angesehenPlakatZaehlen = true
    Ein handgemaltes Plakat in großen Buchstaben: ERST ZÄHLEN. Darunter ist mit Filzstift eine Trillerpfeife gezeichnet. #sprecher:erzaehler
    Gegen dieses Plakat habe ich nichts einzuwenden. Ausnahmsweise. #sprecher:ambrose #stimmung:laechelt
}
-> END

// Roman, Kapitel 9 (neu): Der Bildschirm von Perfect Move bleibt nach Victors Besuch im Clubraum
// stehen (Zustandsfassung des Clubraums, Karten). Der Konzern ist verlockend, nicht böse.
=== bildschirm_pult ===
{
- nadelCedarCreek > 0:
    Jemand hat den Bildschirm wieder eingeschaltet. Die Figuren ziehen von selbst. Niemand sieht hin. Fast niemand. #sprecher:erzaehler
- angesehenBildschirmPult:
    Coach Delgado hat ein Handtuch über den Bildschirm gehängt. Es rutscht immer wieder herunter. #sprecher:erzaehler
- else:
    ~ angesehenBildschirmPult = true
    Ein Bildschirm auf dem Pult, ausgeschaltet. Auf dem Rahmen ein Aufkleber: „Perfect Move – Pilotschule“. #sprecher:erzaehler
    Ein Brett, das allein spielt. Gegen wen eigentlich? #sprecher:ambrose #stimmung:still
}
-> END

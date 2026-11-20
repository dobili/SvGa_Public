// Ort: Umkleide des Stahlwerks, Ironwood (Akt 2). Gegenstand: Schließfach mit dem Fund
// „Turm aus Holz“ (holzturm, der letzte Teil des Figurensatzes „Waldholz“).
// Ohne Laterne ist es zu dunkel (Bibel, Szene 42: Laterne aus Ednas Laden); hatLaterne leitet die
// Hülle beim Öffnen des Dialogs aus dem Besitz ab (regeln/dialogvariablen.ts).

EXTERNAL gibFund(kennung)

VAR hatLaterne = false
VAR holzturmGefunden = false
VAR holzspringerGefunden = false
VAR holzlaeuferGefunden = false
// Aus capital-arena-aussen.ink: Nach dem Abschied (Szene 109) spricht Ambrose nicht mehr
// (Story-Bibel Abschnitt 33, Frage 5; Entscheidung Q21-5). Hier nur gelesen.
VAR abschiedGesehen = false

=== schliessfach ===
{
- holzturmGefunden:
    Das Schließfach steht offen und ist leer, bis auf einen vergessenen Helm. #sprecher:erzaehler
    -> END
- not hatLaterne:
    Ein Schließfach ohne Namen, die Tür klemmt. Dahinter ist es stockdunkel. #sprecher:erzaehler
    Ohne Licht siehst du nichts. #sprecher:erzaehler
    {not abschiedGesehen:
        Edna verkauft Laternen, sagte man. Mir hätte eine Kerze genügt. #sprecher:ambrose #stimmung:laechelt
    }
    -> END
}
~ holzturmGefunden = true
Du hältst die Laterne in das klemmende Schließfach. Hinten, unter einem alten Helm, liegt ein Turm aus hellem Holz. #sprecher:erzaehler
~ gibFund("holzturm")
{
- abschiedGesehen:
    -> END
- holzspringerGefunden and holzlaeuferGefunden:
    Der letzte. Jetzt ist der Satz vollständig. #sprecher:ambrose #stimmung:stolz
- else:
    Noch einer aus demselben Holz. Irgendwo liegen die anderen. #sprecher:ambrose #stimmung:nachdenklich
}
-> END

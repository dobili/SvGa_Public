// Ort: Umkleide des Stahlwerks, Ironwood (Akt 2). Gegenstand: Schließfach mit dem Fund
// „Turm aus Holz“ (holzturm, der letzte Teil des Figurensatzes „Waldholz“).
// Ohne Laterne ist es zu dunkel (Bibel, Szene 42: Laterne aus Ednas Laden); hatLaterne leitet die
// Hülle beim Öffnen des Dialogs aus dem Besitz ab (regeln/dialogvariablen.ts).

EXTERNAL gibFund(kennung)

VAR hatLaterne = false
VAR holzturmGefunden = false

=== schliessfach ===
{
- holzturmGefunden:
    Das Schließfach steht offen und ist leer, bis auf einen vergessenen Helm. #sprecher:erzaehler
    -> END
- not hatLaterne:
    Ein Schließfach ohne Namen, die Tür klemmt. Dahinter ist es stockdunkel. #sprecher:erzaehler
    Ohne Licht siehst du nichts. #sprecher:erzaehler
    Edna verkauft Laternen, sagte man. Zu meiner Zeit hätte eine Kerze genügt. #sprecher:ambrose #stimmung:laechelt
    -> END
}
~ holzturmGefunden = true
Du hältst die Laterne in das klemmende Schließfach. Hinten, unter einem alten Helm, liegt ein Turm aus hellem Holz. #sprecher:erzaehler
~ gibFund("holzturm")
Der letzte. Jetzt ist der Satz vollständig. #sprecher:ambrose #stimmung:stolz
-> END

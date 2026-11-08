// Ort: Umkleide des Stahlwerks, Ironwood (Akt 2). Gegenstand: Schließfach mit dem Fund
// „Turm aus Holz“ (holzturm, der letzte Teil des Figurensatzes „Waldholz“).
// Die Bibel verlangt dafür die Laterne (Ednas Laden, Szene 42). Die Hülle meldet Gegenstände bisher
// nicht als Dialogvariable; deshalb öffnet sich das Fach vorerst ohne Laterne (Bericht).

EXTERNAL gibFund(kennung)

VAR holzturmGefunden = false

=== schliessfach ===
{holzturmGefunden:
    Das Schließfach steht offen und ist leer, bis auf einen vergessenen Helm. #sprecher:erzaehler
    -> END
}
~ holzturmGefunden = true
Ein Schließfach ohne Namen, die Tür klemmt. Hinten im Dunkeln, unter einem alten Helm, liegt ein Turm aus hellem Holz. #sprecher:erzaehler
~ gibFund("holzturm")
Der letzte. Jetzt ist der Satz vollständig. #sprecher:ambrose #stimmung:stolz
-> END

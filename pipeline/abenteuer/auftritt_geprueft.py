"""Geprüfte Funde der Auftrittsprüfung (pipeline/abenteuer/auftritt.py).

Schlüssel: „Prüfung:Figur:Datei.Knoten@Karte“ (bei wartet_ohne_gehe: Kennung der Figur statt Stelle).
GEPRUEFT: Die Stelle passt, mit Grund. Bericht: docs/spiel/auftraege/auftritt_26-11.md.
"""

GEPRUEFT: dict[str, str] = {
    "kommt_wieder:victor:capital-arena-halle.finale_lauf@capitalArena.halle": (
        "{rivale} rennt nach dem Finale zum Vater hinaus und blendet am Ausgang aus (auftrittsbild.ts); "
        "wer später in die Halle zurückkehrt, trifft {rivale} wieder dort an (victor: „Revanche? "
        "Jederzeit. Aber nicht heute. Heute feiern wir.“), das passt: Er ist zurückgekommen"
    ),
    "spricht_vor_auftritt:mama:ironwood-kantine.mama_nach_partie@ironwood.kantine": (
        "Mama hat gerade gespielt und steht da (mamaInKantine; die Partie mit ihr kommt vor dem Kauf, "
        "der Clubkampf erzählt sie in der ersten Reihe); die Prüfung probiert kaufGesehen wahr und "
        "mamaSpielt falsch, das kommt hier nicht vor"
    ),
    "spricht_vor_auftritt:junoClub:maple-falls-aussen.juno_trifft@mapleFalls.clubraum": (
        "Kein Gespräch im Clubraum: Der Dialog der Schultür (maple-falls-aussen.schultuer) gilt für "
        "den Übergang „schule“ auf der Außenkarte; die Einstiege aus anwesenheit.py zählen ihn auch "
        "für den gleichnamigen Übergang im Clubraum"
    ),
}

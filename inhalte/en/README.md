# `inhalte/en/` – englische Fassung der Buchdaten (Paket P6, R25)

Hier liegen die englischen Sätze der App-Daten: Bildunterschriften, Abschnittstitel, Übungen
(Aufgabe, Lösung, Erklärung), vorbereitete Texte (Warum-Fragen, Antworten, Erklärungen), Bilanzen,
Fallenchecks, Steckbriefe, Glossar und Nachschlagen. Begriffe nach `docs/ENGLISCH_BEGRIFFE.md`,
Buchzitate wie in `app/src/i18n/en.json`. Die eigenen Begriffe des Buches sind vorläufig, bis der
Autor sein englisches Buch schreibt (Rückfrage EN1).

## `a1/<datei>` – je Datendatei eine Tabelle

```json
{
 "schemaVersion": 1,
 "datei": "kap01.json",
 "texte": {
  "b73df9aff0b0": "After {z1} – <b>Goal 1</b>: The pawn occupies d4 (gold), …"
 }
}
```

- **Kennung:** die ersten zwölf Stellen des SHA-1 der deutschen Vorlage. Die Tabellen enthalten
  absichtlich keinen deutschen Text (Repository öffentlich, Buchtext geschützt). Ändert der Autor
  einen Satz, ändert sich die Kennung; der Satz erscheint dann wieder als offen und bis zur neuen
  Übersetzung deutsch. Verwaiste Kennungen meldet `pipeline/tests/test_uebersetzen.py`.
- **Vorlage:** Ein Text aus mehreren Teilen wird als ein Satz übersetzt. Platzhalter überträgt die
  Pipeline selbst: `{z1}` Zug (Figurenbuchstaben englisch: Lf4 → Bf4), `{v1}` Verweis
  (Abb. → Fig.), `{s1}` Stelle im Buch (Abschnitt → Section), `{c1}` Zeichen der Bilanzen,
  `{p}` Absatz. Der Übersetzer schreibt `<b>…</b>` (fett), `<i>…</i>` (kursiv) und `<g1>…</g1>`
  (Glossarbegriff, das Ziel ist der englische Name des Eintrags). Jeder Platzhalter steht genau
  einmal, die Reihenfolge ist frei.
- **Züge im Fließtext** schreibt der Übersetzer englisch („5. Bf4“); ein deutscher Zug ist ein
  Fehler. Die Lösungszüge der Übungen und die erfragten Züge der Warum-Fragen wandelt die
  Pipeline selbst.
- Ein Satz, der in mehreren Dateien gleich steht, braucht nur eine Zeile (die eigene Tabelle
  geht vor).

## Ablauf

```bash
python -m pipeline.uebersetzen                  # baut app/public/daten/en/a1/ und den Bericht
python -m pipeline.uebersetzen --einspielen buch/arbeit/uebersetzung/fertig/kap01.json
python -m pipeline.uebersetzen --streng         # Rückgabe 1, solange etwas offen ist
```

Der Lauf schreibt nach `buch/arbeit/uebersetzung/` (nur lokal): `offen/<datei>` mit jeder noch
offenen Vorlage (Kennung, Fundort, deutscher Satz, was die Platzhalter zeigen) und `<datei>.md`
mit Deutsch und Englisch nebeneinander zum Durchsehen. Übersetzt wird in eine Arbeitsdatei
`{"datei": "kap01.json", "texte": {Kennung: Englisch}}`; `--einspielen` prüft jede Zeile gegen die
heutige deutsche Vorlage und übernimmt nur, was passt. Danach immer neu bauen und die erzeugten
Daten mit einchecken (der Test vergleicht sie mit den Tabellen).

Nicht übersetzt werden Schlüssel, die die App liest: Kennungen, FEN, Abschnittsnummern,
Werkzeugkennungen, Glossaranker (`pipeline/uebersetzen/felder.py`).

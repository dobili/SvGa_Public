# Fußmatten perspektivisch direkt hinter der Tür (23.11.2026)

Auftrag des Hauptchats (Regel 9, Empfehlung aus `editor_20-11.md` gleich umsetzen). Notiz des Autors
im Karteneditor (Drechslerei, 20.11.2026): „Fußmatten sollten perspektivisch direkt hinter der Tür
liegen.“ Notiz des Autors (Clubraum): „Die Transparenz verdeutlicht, dass es hier rausgeht. Darüber
hinaus erkennt man so besser, dass es Fußmatten sind, die dahinter liegen.“

## Die Regel, gemessen an den Paketkarten des Autors

Gemessen an den sichtbaren Pixeln von 26 Matten in Clubraum, Diner, Wohnzimmer, Bibliothek,
Drechslerei und Waschsalon, so wie der Autor sie am 20.11. gelegt hat:

| Merkmal                                     | Beim Autor            | Regel (`pipeline/abenteuer/fussmatte.py`) |
| ------------------------------------------- | --------------------- | ----------------------------------------- |
| Unterkante der Matte unter der Türoberkante | 5 bis 7 px            | 6 px, ±1                                  |
| Ebene der Matte                             | −2 (unter allem)      | −2                                        |
| Deckkraft der Tür darüber                   | 75 %                  | 75 %                                      |
| waagerecht                                  | mittig auf dem Flügel | unverändert (nur senkrecht geprüft)       |

- Eine Matte gehört zu der Tür in der Südwand, deren sichtbare Fläche sie waagerecht überdeckt.
- Matten ohne eigene Tür, die bündig neben einer Türmatte liegen, rücken mit. Beispiel: drei Matten
  vor zwei Türflügeln in der Kantine Ironwood.
- Turnmatten und Teppiche zählen nicht.
- Außen liegen keine Fußmatten; die Regel gilt nur innen, zusammen mit 10.86 (Matte vor jeder
  Außentür).
- Die sichtbaren Ränder der Tür- und Mattenbilder stehen in `pipeline/abenteuer/fussmatte_masse.json`.
  Der Dauertest braucht daher keine Bilder und läuft auch in GitHub Actions.

## Ergebnis

- Vorher wichen 118 Matten in 97 Szenen von der Regel ab: 35 gebaute Karten und 62 Varianten B und C.
- Die Paketkarten des Autors waren schon richtig.
- Behoben mit `--beheben`, ohne etwas zu löschen:
  - Die Matte bekommt einen neuen senkrechten Versatz und Ebene −2.
  - Ihre Tür bekommt Deckkraft 75 %.
- Vorher lagen die Matten in den gebauten Karten meist genau auf der Türoberkante oder mit einem
  Spalt von 1 bis 3 px darüber, einige nur 1 bis 3 px darunter. In den Varianten lagen viele schon
  5 px darunter, aber ohne Ebene −2 und hinter einer vollen Tür.
- Kartenbau der 35 Karten: 0 Befunde. Alle Dauertests grün.
- Dauertest `test_abenteuer_fussmatte.py`: „0 Befunde“. Ausnahmen mit Grund in `GEPRUEFT`
  (derzeit keine).

## Warum auch die Tür durchscheinend wird

Ohne die 75 % Deckkraft verdeckt die volle Tür die untere Hälfte der Matte; man sieht nur noch einen
Streifen. Der Autor hat beides zusammen gewollt (Notiz oben): Die durchscheinende Tür zeigt den
Ausgang, und die Matte dahinter bleibt erkennbar. Widerspruch genügt, dann bleibt die Deckkraft bei
den Türen, die er nicht selbst geändert hat, wie vorher.

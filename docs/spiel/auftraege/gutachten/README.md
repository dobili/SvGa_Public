# Kartengutachten: Prüfung mit dem Blick eines Menschen

Stand: 10.11.2026 (Haupt-Chat). Frage des Autors:

> Haben wir irgendeine KI, die mal logisch auf diese Bilder guckt und genau diese Fehler zu finden
> versucht, die ich hier finde, diese Fragen stellt, die ich stelle?

## Test am 10.11.2026

Ein unabhängiger Gutachter (eigener Agent, der die Karten nicht gebaut hat) bekam nur die
Vorschaubilder der Kantine Ironwood und der Steinbruchgrube, die Beschreibung und eine Prüfliste
aus den bisherigen Notizen des Autors. Die Notizen des Autors zu diesen beiden Karten bekam er nicht.

| Karte           | Punkte des Autors | davon vom Gutachter gefunden                                   | zusätzliche Befunde des Gutachters |
| --------------- | ----------------- | -------------------------------------------------------------- | ---------------------------------- |
| Kantine         | 10                | 8 ganz, 2 teilweise                                            | rund 20                            |
| Steinbruchgrube | 13                | 10 ganz, 2 teilweise, 1 nicht (Schotterweg ohne Rand zum Gras) | rund 25                            |

Nicht gefunden hat er den fehlenden Übergang des Schotterwegs zum Gras. Ein paar Befunde sind
Ansichtssache (Hund in der Kantine). Die Gutachten stehen in `ironwood-kantine.md` und
`steinbruch-grube.md`.

## Ablauf ab Runde 8

1. Der Helfer baut die Karte und rendert sie; der Haupt-Chat rendert die Hintergründe.
2. Der Haupt-Chat lässt jede überarbeitete Karte von einem frischen Gutachter prüfen. Der
   Gutachter bekommt Bild, Beschreibung und Prüfliste, nicht den Bericht des Helfers.
3. Der Helfer behebt die Befunde oder begründet im Ortsdokument, warum ein Befund nicht zutrifft.
4. Erst danach kommt die Karte auf die Seite für den Autor.

Die Prüfliste sind die „Allgemeinen Punkte“ in `revision2_notizen.md` und KARTENREGELN 10.55–10.63.
Sie wächst mit jeder Rückmeldung des Autors.

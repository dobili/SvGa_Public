# Figuren am falschen Ort (19.11.2026 nachts, mittel-4)

Das Lektorat der Lesefassung vom 19.11. (mittel-1, Abschnitt „Offen“) fand zwei Fehler in der
Kartenbelegung:

- Mama stand in Ironwood auf der Karte „Mamas altes Zimmer“. Ihr Dialog `mama_ankunft` erzählt aber
  die Fahrt und die Kantine.
- Juno stand nach dem Aufbruch weiter im Clubraum und an der Haltestelle, obwohl es hieß: „Juno
  wartet am Park.“

Beides ist behoben. Ein neues Werkzeug sucht seitdem solche Stellen im ganzen Spiel.

## Behoben

| Figur                                                          | vorher                                                                                                                                                                      | nachher                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| -------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Mama in Ironwood (`ironwood.mama`)                             | Szene `ironwood-mamas-zimmer`, Feld (11, 6), sichtbar `nicht kaufGesehen oder (mamaSpielt und nicht lernkarteFaktorenwaage)`, also auch lange bevor sie nach Ironwood kommt | Szenen `ironwood-kantine` und `ironwood-kantine-logo`, Feld (29, 8) beim Stahlbrett neben Big Joes Clubtisch, Blick nach rechts. Die Ankunft (`mama_ankunft`: Fahrt, Oma Ruth, Kantine, Umarmung, dann das Angebot zur Partie) läuft als **Eingang der Kantine**, Bedingung `mamaFotoGesehen und nicht mamaInKantine`. Die Figur erscheint erst danach: `mamaInKantine und (nicht kaufGesehen oder (mamaSpielt und nicht lernkarteFaktorenwaage))`. |
| Juno in Maple Falls (`mapleFalls.juno`, `mapleFalls.junoClub`) | ohne `wenn` an der Haltestelle, im Clubraum nur `clubBeigetreten`                                                                                                           | Zusätzlich `nicht aufbruchGesehen oder endeAkt1Gesehen`: Zwischen Aufbruch und Ende von Akt 1 ist Juno unterwegs und in Cedar Creek (Story-Bibel, Szenen 13 bis 25); mit dem Bus nach dem Ende von Akt 1 ist sie wieder zu Hause.                                                                                                                                                                                                                   |

Warum die Kantine und nicht der Dialog angepasst: Story-Bibel, Szene 43: „Sie fährt mit {held} nach
Ironwood, zuerst zu Oma Ruth, dann in die Kantine.“ `mama_fahrt` reist mit
`reise("ironwood.kantine", "kantineAusgang")` direkt in die Kantine. Der Text stimmt also, nur die
Figur stand im falschen Raum.

Geänderte Szenen (Kartenbau mit `python -m pipeline.abenteuer.kartenbau`, alle „in Ordnung“):

- `ironwood-mamas-zimmer` (Mama entfernt)
- `ironwood-kantine` (Mama dazu)
- `ironwood-kantine-logo` (Mama dazu)

Editor und Kartenbilder im privaten Repository sind danach neu zu bauen.

Nebenbefund in der Lesefassung: Mamas Partie beginnt jetzt gleich beim Betreten der Kantine. Danach
mied der simulierte Leser auch bei Big Joe die Antwort „Ich bin bereit.“, und der Durchlauf endete
vor dem Clubkampf in einer Sackgasse. Grund: Der Leser merkte sich gewonnene Partien als „Revanche“
je Datei. Er merkt sie sich jetzt je Gesprächsbeginn (Figur oder Eingang), in
`pipeline/abenteuer/lesefassung-spieler.cjs`.

## Prüfwerkzeug

`python -m pipeline.abenteuer.figurenort [--alle]`, Dauertest
`pipeline/tests/test_abenteuer_figurenort.py`. Angesehene Kandidaten stehen mit Grund in
`pipeline/abenteuer/figurenort_geprueft.py`. Das Werkzeug macht zwei Prüfungen:

1. **Ort:** Erzählzeilen, die vom Ansprechen einer Figur aus erreichbar sind und einen Innenort
   nennen („In der Kantine“, „Im Diner“, „Am Steg“; Wörterbuch `ORTSWOERTER`). Gemeldet wird, wenn
   der Ort zu keiner Karte passt, auf der die Figur steht (Grundkarte oder Kartenfassung).
   Wendungen mit „vor“ zählen nicht, denn vor der Turnhalle steht man draußen.
2. **Abschied:** Ein Dialog setzt eine Variable wie `aufbruchGesehen`, `slickAbschiedGesehen` oder
   `abfahrtSiliconGesehen` und nennt dabei eine Figur desselben Orts (als Sprecher oder mit Namen).
   Gemeldet wird, wenn die Figur danach noch steht: Ihr `wenn` kennt die Variable nicht, und keine
   Kartenfassung mit dieser Variable lässt sie weg.

Gegenprobe auf dem Stand vor der Änderung: Das Werkzeug meldet Mamas Kantine sowie Juno an der
Haltestelle und im Clubraum. Stand jetzt: 9 Kandidaten, alle angesehen.

## Angesehen und passend

- **Tessa, die Joggerin:** „Am Steg steht ihre Wasserflasche“ meint ihr Laufziel am Flussweg, nicht
  den Ort des Gesprächs (Landstraße, Zedernpfad).
- **Beim Aufbruch:** Mama bleibt zu Hause. Der Coach ruft nur an und kommt am Samstag mit dem Bus.
  Mama vor dem Haus steht nur vor der Einleitung.
- **Ambroses Abschied in der Capital Arena:** Victor und Graham Hale gehen über den Vorplatz. Sie
  stehen in der Halle, ihr Text nach dem Finale passt dazu.
- **Highway in Desert Springs:** Dot leiht Mama das Auto und bleibt in ihrer Garage.
- **Bus nach Silicon Bay:** Mama verabschiedet {held} und bleibt. In der Kantine steht sie nach dem
  Kauf nur noch, bis sie die Lernkarte gegeben hat.
- **Slick** verschwindet schon heute über die Pavillon-Fassung `slickAbschiedGesehen` (Perfect
  Move). Das Werkzeug erkennt das und meldet ihn nicht.

## Grenzen

- **Ortswörter:** Das Wörterbuch kennt nur Innenorte und Plätze, die eine eigene Karte haben.
  Straßennamen und Städte prüft es nicht.
- **Wer geht:** Die Abschiedsprüfung erkennt nur, wer in dem Knoten spricht oder genannt wird, der
  die Variable setzt. Wer nur im Text eines anderen Knotens „fortgeht“, fällt nicht auf.
- **Variablennamen:** Abschiedsvariablen erkennt das Werkzeug am Namen (`abschied`, `aufbruch`,
  `abfahrt`, `abreise`). Wer eine solche Variable anders nennt, muss das Muster `ABSCHIED`
  erweitern.

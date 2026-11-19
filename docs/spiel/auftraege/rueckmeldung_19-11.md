# Rückmeldung nach dem Ergebnis (19.11.2026)

Wunsch des Autors nach dem ersten Anspielen: „Wenn aus einem Dialog eine Schachpartie oder ein
Rätsel startet, soll es nach dem Ende auch eine Reaktion darauf geben. Bei der ersten Partie gegen
Ambrose wird man danach einfach in die Spielwelt geworfen, keine Reaktion von Ambrose.“

## Ursache bei der ersten Lektion

Die Reaktion gab es schon: `maple-falls-dachboden.nach_erster_partie` (Sieg, Remis, Niederlage, dazu
die Länge der Partie). Sie lief aber nur, wenn man Ambrose noch einmal ansprach; nach der
Ergebniskarte öffnete die App keinen Dialog. Aufgabenrunden kannten schon `danach` (runden.json),
Partien nicht, und die meisten Runden hatten kein `danach`.

## Was die App jetzt tut

- Startet ein Dialog eine Partie, Runde, ein Simultan oder eine Gedächtnisstellung, merkt sich der
  Spielstand den Dialog (`nachErgebnis`, „datei.knoten“). Nach der Ergebniskarte (beim Simultan
  nach dem letzten Brett, bei der Gedächtnisstellung nach ihrem Ende) öffnet die Oberwelt ihn
  wieder; sein Einstieg verzweigt über die Dialogvariablen nach dem Ausgang. `danach` in
  `runden.json` oder neu auch in `begegnungen.json` geht vor. Wer die Deckwahl abbricht oder eine
  offene Partie oder Runde aufgibt, bekommt keine Rückmeldung.
- Code: `app/src/abenteuer/oberwelt/nachergebnis.ts` (mit Test), `useDialogende.ts`,
  `Oberwelt.tsx`, `useAufgabenrunde.ts`, `Fortsetzungen.tsx`; Feld im Spielstand und Schema.
- Erste Lektion: `danach` ist `maple-falls-dachboden.ambrose`, damit Ambrose gleich spricht (der
  Dialog am Brett begann sonst mit „Staub, Kisten …“). e2e: `tests/e2e/abenteuer.spec.ts`,
  „vom Dachboden in die erste Partie und zurück“ prüft, dass Ambrose nach dem Sieg spricht.
- Die Gesamtsimulation macht dasselbe (`gesamtsimulation-dialoge.cjs`); das frühere
  „Nachgespräch“ der Lesefassung und des Ambrose-Beobachters entfällt dadurch.

## Prüfwerkzeug

`node pipeline/abenteuer/rueckmeldung.cjs [--startwerte 1,2,3]` (pytest
`test_abenteuer_rueckmeldung.py`, der ganze Lauf mit `ABENTEUER_SIMULATION=1`). Für jeden der 113
Starts aus Ink und jeden Ausgang, den die Simulation sieht: Die Rückmeldung zeigt eine Zeile,
startet nicht ohne Wahl neu und greift das Ergebnis auf (ein besuchter Knoten fragt die
Ergebnisvariable mit Text ab, oder eine passende Weiterleitung führt in die Reaktion; Alltag,
Warten und Rat zählen nicht). Grenze: Den Inhalt eines Knotens liest es nicht. Nach den Funden
unten von Hand ergänzt, obwohl das Werkzeug sie durchließ: Mae, Dot, Tamsin. Stand: 0 Funde.

## Neue Reaktionen (Texte gelten als abgesegnet; bitte bei Gelegenheit lesen)

Bestanden, vorher nur Alltag oder gleich der nächste Erzählschritt (`danach` in runden.json):

- Juno (`maple-falls-clubraum.juno_reihe_danach`), Sam (`sam_reihe_danach`), Dex
  (`cedar-creek-bibliothek.dex_reihe_danach`), Mae (`mae_reihe_danach`, dann die Einladung), Dot
  (`desert-springs-garage.dot_reihe_danach`), Hank und Priya (`ironwood-kantine`), Remy
  (`port-delacroix-turnhalle`), Ray und Tamsin (`riverton-pavillon`, Tamsin danach weiter wie
  bisher), Zuschauen bei Slick (`zuschauen_danach`, Tamsins Zettel).
- Parkbank (`maple-falls-park.parkbank_danach`, beide Ausgänge, mit dem Hinweis auf Mr. Abernathy).

Nicht bestanden, vorher nur das Angebot von vorn:

- Lily (`maple-falls-aussen.lily_lektion_danach`), Zugpartie (Marian Shaw), Lebendschach (Ezra),
  Stream (Kiki), Flohmarkt (Odette), Kapitänsproblem, Geysirblitz (Bell), Kahnrennen (Ruben),
  Tafel an der Schleuse (Imogen), Henriks Boot, Postsack (Mr. Teague): je `…_rueckmeldung`.
- Diplom (Annek, `hochebene.diplom_nochmal`) und Seilschaft (Ferris,
  `weg-delacroix-desert.seilschaft_nochmal`): Vorher startete die Runde beim Wiederkommen ohne
  Wahl sofort neu; jetzt ein Satz und die Wahl „Noch einmal“ oder „Später“.
- Zeitung von 1858, ein zweites Mal nachgespielt: ein Satz statt Stille (`vitrine_mut`).

Partien (`danach` in begegnungen.json):

- Turnier: Die Turnierleiterin trägt jede Vorrunde ein (`capital-arena-halle.runde1_danach` bis
  `runde4_danach`, gemeinsam `ergebnis_eintragen`), dann weiter wie bisher. Nach dem
  Halbfinalsieg kommt gleich die Szene mit Kade (`halbfinale_rueckmeldung` →
  `halbfinale_danach`), sonst ein Satz und das Angebot wie bisher.
- Schach960 im Musikhaus: Remis und Niederlage bekommen einen Satz von Mabel (`set1_danach` bis
  `set3_danach`).
- Varianten-Tisch in Crossroads: Der Tisch merkt sich, welche Partie er gestartet hat
  (`tischPartie`), und Ambrose sagt nach Blindschach oder Schach960 etwas zum Ausgang
  (`tisch_nach_partie`). Blindschach bei Greta hatte schon `greta_nach_partie`.

## Wohin danach (Hinweis von mittel-1)

Nach diesen Partien wechselt der Ort; die Reaktion nennt jetzt das Ziel (Wunsch des Autors: der
Spieler weiß aus dem Dialog, wohin als Nächstes). Geprüft an der Rückmeldung der Simulation:

- Cedar Creek (Steg), Ironwood (Kauf am Werkstor): stand schon in der Reaktion.
- Riverton: bleibt im Pavillon bei Slick, kein neues Ziel.
- Silicon Bay: Dr. Lin, danach „Im Hotel der Akademie wartet dein Zimmer im zwölften Stock“
  (`lin_tisch_aus`, nur vor der Nacht im Hotel).
- Desert Springs: nach dem Sieg gegen Mira „Im Motel ‚Zur Quelle‘ wartet euer Zimmer“
  (`mira_nach_sieg`, nur vor dem Abend am Motel).
- Halbfinale: nach der Szene mit Kade „Victor wartet im Gang hinter der Halle“
  (`halbfinale_zum_gang`); die Turnierleiterin sagt es auch.
- Finale: „Als die Halle leer wird, gehst du hinaus auf die Treppe vor der Arena“ (`finale_lauf`).

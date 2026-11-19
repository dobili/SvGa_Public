# Nächster Schritt aus den Dialogen (19.11.2026, mittel-1)

Wunsch des Autors (19.11.2026): „Bitte darauf achten, dass der Spieler immer weiß, wo er als Nächstes
hin soll, nicht nur mit der Kartenmarkierung (die bleibt), sondern dass es aus den Dialogen
hervorgeht.“

## Prüfwerkzeug

`python -m pipeline.abenteuer.naechsterschritt [--alle]`, als Dauertest in
`pipeline/tests/test_abenteuer_naechsterschritt.py`. Je Quest und je Paar aufeinanderfolgender
Schritte sucht es den Dialog, mit dem der Schritt endet:

- den Knoten des Schritts, wenn der Schritt ein Dialog ist;
- den Knoten `danach` einer Aufgabenrunde oder sonst den Dialog ihres Stellers, also das, was er
  beim nächsten Ansprechen sagt.

Ziel des nächsten Schritts sind die Figur, deren Dialog den Knoten erreicht, der Steller, der Gegner
oder die Karte, jeweils mit ihren Namen aus `texte/de.json`. Geprüft wird, ob der Text ab dem
Übergangsknoten einen dieser Namen nennt. Als erfüllt zählt auch, wenn der Dialog das Ziel selbst
startet (`beginnePartie`, `beginneAufgaben`, `reise`) oder das Ziel auf derselben Karte liegt. Nach
dem letzten Schritt einer Hauptquest gilt der Start der Hauptquests, die auf sie folgen.

Stand nach den Änderungen: 69 Übergänge in Ordnung, 0 fehlen, 5 Ausnahmen, 24 nach Partien (siehe
unten), 11 ohne Dialog (Ankunft an einem Ort, Rätsel ohne Steller).

## Änderungen

| Datei                        | Knoten                 | vorher → nachher                                                                                                                                                                                                                                                                                                                                                      | Grund                                                                                                                   |
| ---------------------------- | ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| riverton-aussen.ink          | ankunft                | Ohne Wartezeit. Als wäre das Warten nicht das Schönste daran. #sprecher:ambrose #stimmung:laechelt → Ohne Wartezeit. Als wäre das Warten nicht das Schönste daran. #sprecher:ambrose #stimmung:laechelt Meine Cousine sagt, der echte Club spielt im Parkpavillon am Fluss. Der Chef heißt Slick, und er redet schneller, als er zieht. #sprecher:juno #stimmung:froh | riverton.parkclub 2→3: Bei der Ankunft fiel nicht, wo der Club spielt und wer Slick ist.                                |
| silicon-bay-lobby.ink        | victor_falsch          | Sag meinem Vater nichts. Noch nicht. Ich muss nachdenken. #sprecher:victor #stimmung:muede → Sag meinem Vater nichts. Noch nicht. Ich muss nachdenken. #sprecher:victor #stimmung:muede Theo hat Schlüssel für jede Tür in der Akademie, auch für den Serverraum. Frag ihn. #sprecher:victor #stimmung:nachdenklich                                                   | siliconBay.spielberichte 1→2: Nach der Auswertung sagte niemand, dass der Weg über Theo in den Serverraum führt.        |
| port-delacroix-turnhalle.ink | odile_nach_simultan    | Behalt ihn. Er hat lange keine Geige getragen, jetzt hat er wieder was zu tun. #sprecher:odile #stimmung:laechelt → Behalt ihn. Er hat lange keine Geige getragen, jetzt hat er wieder was zu tun. #sprecher:odile #stimmung:laechelt Und wenn du aus der Wüste zurückkommst, hängen wir zusammen das Schild am Musikhaus auf. #sprecher:odile #stimmung:laechelt     | portDelacroix.wiederaufbau 3→4: Das Schild am Musikhaus kam ohne Ankündigung.                                           |
| weg-delacroix-desert.ink     | versoehnung_lektion    | Ihr übt, bis das Licht fort ist. #sprecher:erzaehler → Ihr übt, bis das Licht fort ist. #sprecher:erzaehler Morgen früh wartet Tomás in der Garage, sagt Mira. Mit Aufgaben. Er hat ihr verboten, sie dir vorher zu zeigen. #sprecher:erzaehler                                                                                                                       | desertSprings.versoehnung 2→3: Nach dem Canyon fehlte der Weg zu Tomás in die Garage.                                   |
| ghost-town-saloon.ink        | victor_nach_fernpartie | In der Tür nimmt Mr. Pruitt den Hut ab. #sprecher:erzaehler → In der Tür nimmt Mr. Pruitt den Hut ab. #sprecher:erzaehler Bleibt über Nacht. Wenn es dunkel ist, stehen über Ghost Town mehr Sterne als Häuser. #sprecher:pruitt #stimmung:laechelt                                                                                                                   | ghostTown.fernpartie 4→5: Die Nacht unter den Sternen kam ohne Hinweis.                                                 |
| capital-arena-aussen.ink     | arena_ankunft          | Nova dreht sich um. Sie sieht dich über die ganze Halle hinweg und nickt. Einmal. #sprecher:erzaehler #pause → Nova dreht sich um. Sie sieht dich über die ganze Halle hinweg und nickt. Einmal. #sprecher:erzaehler #pause Die Turnierleiterin hebt eine Liste über den Kopf. Wer spielt, meldet sich bei ihr, die erste Runde beginnt gleich. #sprecher:erzaehler   | capitalArena.meisterschaft 1→2: Wo die Vorrunde beginnt (bei der Turnierleiterin), stand nirgends.                      |
| summit-city-bergstation.ink  | victor_blatt           | Und dass das die größte Unverschämtheit ist, die mir je begegnet ist. #sprecher:ambrose #stimmung:lacht → Und dass das die größte Unverschämtheit ist, die mir je begegnet ist. #sprecher:ambrose #stimmung:lacht Victor steckt das Buch ein. Gehen wir runter zur Hütte? Ward wartet mit deiner Partie. Ich will zusehen. #sprecher:victor #stimmung:laechelt        | summitCity.endspiel 6→7: Nach der Seite fehlte der Weg zurück zu Ward und zum Clubkampf.                                |
| weg-ghost-capital.ink        | wanderer_seiten        | Alle dreizehn. Jetzt lasse ich sie binden. Komm mich in Capital besuchen. → Alle dreizehn. Jetzt lasse ich sie binden. Komm mich auf dem Vorplatz der Capital Arena besuchen.                                                                                                                                                                                         | capitalArena.verloreneSeiten 1→2: „in Capital“ war zu ungenau; der Wanderer steht auf dem Vorplatz.                     |
| capital-arena-innenstadt.ink | kreide_raetsel         | Unter der Stellung steht: „Zwei Fliegen, eine Klappe. Der Zug ist das Wort.“ #sprecher:erzaehler → Unter der Stellung steht: „Zwei Fliegen, eine Klappe. Der Zug ist das Wort.“ #sprecher:erzaehler Ein Kreidepfeil zeigt auf das Gitter vor der Treppe zum alten U-Bahnhof. #sprecher:erzaehler                                                                      | capitalArena.kreidespringer 1→2: Dass die Kreidespringer im U-Bahnhof spielen, stand nur in Ambroses Satz „hier unten“. |

Dazu zwei Fälle, die schon im Text standen und nur das Werkzeug nicht erkannte: „am Park“ für den
Stadtpark in Maple Falls und „die Akademie“ für die Schachakademie in Silicon Bay. Beide stehen in
`KARTENRUFNAMEN`.

## Bewusst offen (Ausnahmen im Werkzeug)

- `siliconBay.fehlendeSeite` nach Schritt 1: Die Seite bringt Victor erst in Akt 4 selbst an die
  Bergstation; der Questtext sagt das.
- `ghostTown.fernpartie` nach Schritt 2: Die Erinnerung endet mit der erloschenen Kerze. Ein Hinweis
  dort würde den Moment brechen, und Victor hat vorher im Saloon gesagt, dass er auf Ambroses
  letzten Zug wartet.
- `wegCedarRiverton.testteam` nach Schritt 1 bis 3: Die nächste Sperre steht auf dem Weg, den die
  Hauptquest ohnehin nimmt; das Wiedersehen vor der Arena kommt von selbst.

## Nach Partien (nur notiert, Auftrag von mittel-3)

Diese Übergänge liegen im Ergebnisknoten einer Partie. Meist geht es bei derselben Figur oder am
selben Ort weiter (zum Beispiel Schach960 Set 1 → Set 2, Kreidenacht 1 → 2). Der Ort wechselt hier:

- `cedarCreek.clubkampf` → `cedar-creek-aussen.ende_akt1` (Steg)
- `riverton.parkclub` → `riverton-pavillon.slick_alltag`
- `ironwood.clubkampf` → `ironwood-aussen.kauf` (Werkstor)
- `siliconBay.akademie` → `silicon-bay-aussen.hotel_nacht`
- `desertSprings.versoehnung` → `desert-springs-aussen.abend_motel`
- `capitalArena.meisterschaft`: Halbfinale → `vor_dem_finale` (Gang), Finale →
  `capital-arena-aussen.abschied` (Treppe)

Die ganze Liste druckt `python -m pipeline.abenteuer.naechsterschritt --alle` (Stufe „partie“).

## Grenzen

Das Werkzeug liest Namen, nicht den Sinn. Ein Name an irgendeiner Stelle der erreichbaren Zeilen
genügt, auch in einem Zweig, den nicht jeder Spieler sieht. Nebenquests mit nur einem Schritt und
Partien prüft es nicht. Ob die neuen Sätze im Spiel gut klingen, habe ich nur gelesen, nicht im
Spiel gesehen.

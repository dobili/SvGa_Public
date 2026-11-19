# Erzählungen, die zeitlich nicht passen (19.11.2026, mittel-1)

Wunsch des Autors (19.11.2026): Spricht man im Haus Mama an, erzählte der Dialog, wie {held} die
Treppe herunterkommt und eine Stufe knarrt, obwohl {held} längst unten steht. Das Knarren gehört zum
ersten Herunterkommen: Das Bild hält kurz an, ein Erzählfenster geht auf, mit dem Knarren und dem
Hinweis, wo Mama ist.

## Prüfwerkzeug

`python -m pipeline.abenteuer.erzaehlzeit [--alle]`, Dauertest
`pipeline/tests/test_abenteuer_erzaehlzeit.py`. Es sucht Erzählzeilen (`#sprecher:erzaehler`) in
Dialogen, die mit dem Ansprechen einer Figur beginnen (`orte.json`, `figuren[].dialog`), und meldet
solche mit Wörtern für:

- Gehen, Steigen, Fahren, Eintreten („du kommst“, „ihr geht“, „betrittst“, „öffnest“);
- Treppe, Stufe, Knarren;
- das Ankommen in einem Raum („Drinnen …“, „Die Hütte ist …“, „Es riecht …“).

Jeder Kandidat ist danach entweder an den Eingang der Karte verlegt oder steht mit Grund in
`GEPRUEFT`. Neue Kandidaten lässt der Dauertest erst durch, wenn jemand sie angesehen hat. Stand:
24 Kandidaten, alle angesehen.

## Verlegt an den Eingang der Karte

Das Feld `eingang` in `orte.json` (oberwelt/eingang.ts) startet den Dialog beim Betreten der Karte.
Jeder Eingang läuft einmal, über eine Variable.

| Karte                   | Eingang                                                                | Bedingung                                                                                                                              | vorher                                                                                                                                                               | nachher                                                                                                                                                                                                                                                                                                                      |
| ----------------------- | ---------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Wohnzimmer Maple Falls  | `maple-falls-wohnzimmer.eingang` (wählt `ankunft` oder `treppe_abend`) | `(einleitungGesehen und nicht ankunftGesehen) oder (ersteLektionBesprochen und nicht ersterAbendGesehen und nicht treppeAbendGesehen)` | Im Gespräch mit Mama (`erster_abend`): „Du kommst mit dem alten Brett die Treppe herunter. Auf der neunten Stufe knarrt es.“ und Ambroses „Die hat schon geknarrt …“ | Beim Herunterkommen am Abend nach der ersten Lektion: dieselben zwei Zeilen und neu „Unten im Wohnzimmer sitzt Mama auf dem Boden zwischen den Kartons und schraubt an einem Tisch.“ Das Gespräch beginnt jetzt mit „Du stellst dich mit dem Brett neben sie. Mama schraubt weiter am Tisch. Ihr Blick fällt auf das Brett.“ |
| Raststätte Crossroads   | `crossroads-raststaette.eingang`                                       | `nicht raststaetteBetreten`                                                                                                            | Beim ersten Gespräch mit Darlene: „Drinnen ist es laut und warm. An der Wand ein großes Brett aus Kork …“                                                            | Beim ersten Betreten: dieselbe Zeile und neu „Hinter der Theke schenkt eine Frau Kaffee ein, ohne hinzusehen.“; Darlene beginnt mit „Hinter der Theke Darlene. Sechzig …“                                                                                                                                                    |
| Wards Hütte Summit City | `summit-city-huette.eingang`                                           | `nicht huetteBetreten`                                                                                                                 | Beim ersten Gespräch mit Ward: „Die Hütte ist aus dunklem Holz. Im Kamin brennt auch im Juli Feuer …“                                                                | Beim ersten Betreten: dieselbe Zeile und neu „Im Sessel am Feuer sitzt eine Frau und liest. Sie sieht nicht auf.“; Ward beginnt mit „Eleanor Ward sitzt im Sessel am Feuer und liest den Absatz zu Ende.“                                                                                                                    |

Der Test `app/src/abenteuer/oberwelt/eingang.test.ts` deckt den Abend im Wohnzimmer mit ab.

## Angesehen und passend (im Werkzeug `GEPRUEFT`)

- **Figuren, die auf Treppen oder Stufen sitzen:** die Zwillinge in Cedar Creek, Juno auf der
  Tribüne, Slick in Crossroads, der Wanderer vor der Arena, Slick unter der Steinbrücke.
- **Bewegungen während des Gesprächs:** um den Tisch gehen und Kade die Hand geben, Slick springt
  von den Stufen, den Springer auf Lilys Brett setzen, die Hand auf den Geigenkasten legen.
- **Erzählte Szenen, die das Gespräch selbst anstößt:**
  - Mama lädt ins Diner ein, die Szene spielt dort.
  - Oma Ruth führt hinauf („Komm. Ich zeig dir was.“).
  - die Fahrt nach Ironwood als Reise.
  - nach dem Streit in der Turnhalle die Stufen draußen.
  - der Abend auf dem Dachboden, der Epilog mit Lily.
  - Gideon auf der Treppe in der Erinnerung von 1866.
- **Fehlalarme:** „Ihr ganzes Gesicht geht auf“ (Juno), „ihr Bus kommt gerade“, „Es riecht nach
  Kaffee, Eisen und nassen Jacken“ (Stimmung in der Kantine, in der man schon steht).

## Grenzen

Die Wortliste fängt das Typische, nicht alles. Ein weiterer Durchgang mit „Tür“ fand nur Sätze, die
im Gespräch passen (jemand steht in der Tür, eine Tür schlägt), deshalb ist „Tür“ nicht in der
Liste. Ansehen-Knoten von Gegenständen und Erinnerungen prüft das Werkzeug nicht, weil man dort
nicht mit jemandem spricht. Im Spiel gesehen habe ich die drei Eingänge nicht; die
Gesamtsimulation läuft sie mit Startwert 1 bis 3 durch.

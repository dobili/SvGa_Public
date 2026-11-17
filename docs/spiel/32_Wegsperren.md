# 32 Wegsperren durch Schachgegner: das Testteam

Stand: 17.11.2026 (nachts). Konzept, noch nichts gebaut. Idee des Autors: wie die Trainer-Sperren
in Pokémon versperrt an wenigen Stellen eine Gruppe den Weg und lässt {held} erst nach einer
gewonnenen Stellung durch. Ausdrücklich „kein Muss, nicht zu viel, damit es nicht nervt“. Zusatz
des Autors: nicht immer ganze Partien, sondern je Sperre ein anderes kurzes Format mit erzähltem
Einstieg. Grundlagen: `13_Wegenetz.md` (Sperren S1 bis S14), `15_Routen_Ereignisse.md` (Spuren
P1 bis P6, Kreidespringer K1 bis K5), `05_Story_Bibel.md`, `06_Regelwerk.md` (R4, R13, R29b, R34,
R42), `orte.json`, `begegnungen.json`, `gegner.json`.

## 1. Bestand: was es schon gibt

**Sperren an Übergängen (`wenn` in `orte.json`), keine davon ist eine Partie:**

| Art                 | Stellen                                                                                                                                                                                                                                |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Geschichte          | Haustür, Schule, Landstraße (`aufbruchGesehen`), Zedernwald (`endeAkt1Gesehen`), Kanalweg (`nadelRiverton und verbotGesehen`), Highway (`endeAkt3Gesehen`), Seeufer S12 (Wachmann von Perfect Move: `fernpartieGespielt`, Novas Bitte) |
| Clubnadel           | Zedernpfad S2 (`nadelCedarCreek`), Fähren ab Silicon Bay (`nadelSiliconBay`), Wüstenzug (`nadelPortDelacroix`), Geysirbecken S10 (`nadelSummitCity`)                                                                                   |
| Rätseltafel als Tor | Gatter zum Kürbishof S1 (`wegMapleCedarTafelBestanden`), Schleuse Lockport S3                                                                                                                                                          |
| Gegenstand          | Laterne (Steinbruch, Durchlass, Sternwarte, Goldmine), Gummistiefel (Bayou), Viehgatter der Alten Minenstraße S13                                                                                                                      |

**Schach an den Wegen (alles freiwillig):** je Weg eine Rätseltafel, ein Straßengegner (Nia,
Schaffner Quinn, Dime, Joggerin, Schiffskoch Ruiz, Buck, Mags, Mama Bear, Sol, Hollis, Greifarm
Z-1), ein Ereignis (Zugpartie, Brückenbauern, Kikis Stream, Funkschach, Geysirblitz …) und die
Sammelstränge. Straßengegner rechnen mit der aktuellen Wertung A (Versatz −150 bis 0) und spielen
fast immer ein Stellungsduell über 10 Züge aus einer Buchabbildung.

**Perfect Move in der Bibel:** In Akt 1 nur als Name (Abschnitt 3.3: „Kein Aufkauf, kein
Schummeln“). Akt 2: Kauf der Clubs von Riverton und Ironwood. Akt 3: ZERO, Tablet von Theo,
Ohrempfänger (Szene 56), Tiefpunkt. Akt 4: Aussage von Dr. Lin und Nova (105), Halbfinale gegen
Kade mit Gerät (106), Graham Hales Entschuldigung (107), faires Finale gegen Victor (108). Die
Nacht der Kreidespringer (U-Bahnhof, Mo, Dime, Mama Bear, Victor mit Kapuze) öffnet erst **nach**
dem Finale (`ubahnOffen`); nach dem Abschied spricht Ambrose dort nicht mehr.

**Folgen für den Vorschlag:**

1. Figuren dürfen keinen Weg versperren (`pipeline.abenteuer.figurensperre`). Eine Sperre ist also
   immer ein Übergang mit `wenn`; die Truppe steht daneben.
2. Übergänge, deren `dialog` eine Ankunftsszene einer Stadt ist (`weiterRiverton`, `weiterSilicon`,
   `weiterSummit`), bleiben unberührt. Benutzt werden nur Übergänge zwischen zwei Karten eines Wegs.
3. Keine neue Spur (es bleiben sechs), kein neuer Kreide-Treffpunkt, kein Ohrstöpsel: Die Truppe
   spielt selbst, die Tablets zeichnen nur auf. So verrät sie nichts vor Szene 56.
4. Die Wege sind schon voll. Deshalb **drei Sperren statt vier, keine in Akt 1** (dort gibt es
   Pratts Tafel, das Gatter S1, Nia, und Perfect Move ist nur ein Name).

## 2. Vorschlag: drei Sperren, je eine zu Beginn von Akt 2, 3 und 4

Regel: Die Truppe steht einmal je Akt am Weg zum **ersten Club des Akts**, dort, wo {held} beim
ersten Mal zu Fuß durch muss. Jede Karte hat schon eine Rätseltafel; sie ist der Übungshinweis.

| Nr. | Karte, Übergang                                                              | Stelle                                                                     | Vor Club (Chef)           | Gegner (Rolle `story`, Bezug E) | Wunsch-Format          |
| --- | ---------------------------------------------------------------------------- | -------------------------------------------------------------------------- | ------------------------- | ------------------------------- | ---------------------- |
| S15 | `wegCedarRiverton.zedernwald`, `weiterBahndamm` (Felder 139,14 und 139,15)   | Ostrand, Birkenwald hinter den Zelten; Truppe bei Spalte 135 neben dem Weg | 3 Riverton (Slick +340)   | Benji, E + 260                  | Vorteil herausarbeiten |
| S16 | `wegIronwoodSilicon.raststaette`, `weiterGlasbruecke` (Felder 0,18 und 0,19) | Westrand, Brückenkopf bei den drei Laternen am Ortsschild                  | 5 Silicon Bay (Lin +460)  | Imani, E + 380                  | Eröffnung fremd        |
| S17 | `wegDesertSummit.diner`, `weiterBergstrasse` (Felder 0,15 bis 0,17)          | Westrand, Viehgitter im Asphalt hinter der Tankstelle                      | 8 Summit City (Ward +640) | Zoe, E + 560                    | Endspiel gewinnen      |

**Stärke.** Clubchef n hat E + 160 + 60 · n (R4). Die Sperre liegt 80 darunter und damit knapp
unter dem zuletzt geschlagenen Chef (Okafor +280, Big Joe +400, Mira +580). Mit dem Startvorteil
des Stellungsduells ist sie deutlich leichter als ein Clubkampf; sie prüft, ob {held} einen Vorteil
festhalten kann, nicht mehr. Rolle `story`, weil Straßengegner auf A rechnen und höchstens A + 0
dürfen (Prüfregel in `test_abenteuer.py`). Keine Überheblichkeit (R9 gilt für `story` nicht).

**Wann sie steht, wen sie sperrt.** Nur den Hinweg, nur beim ersten Mal:

| Nr. | Figuren stehen (`wenn`)                               | Übergang offen (`wenn`)                              |
| --- | ----------------------------------------------------- | ---------------------------------------------------- |
| S15 | `endeAkt1Gesehen und nicht ankunftRivertonGesehen`    | `testteamWaldDurch oder ankunftRivertonGesehen`      |
| S16 | `einladungGesehen und nicht ankunftSiliconBayGesehen` | `testteamBrueckeDurch oder ankunftSiliconBayGesehen` |
| S17 | `endeAkt3Gesehen und nicht ankunftSummitGesehen`      | `testteamGitterDurch oder ankunftSummitGesehen`      |

Die Ankunftsvariablen gibt es schon (`riverton-aussen.ankunft`, `silicon-bay-aussen`,
`summit-city-aussen`). Spielstände, die die Stadt schon erreicht haben, sehen weder Truppe noch
Sperre. Rückwege (`zurueckZedernwald`, `zurueckRaststaette`, `zurueckDiner`) bleiben frei.

**Formate.** Wunsch-Format je Sperre und, bis die neuen Formate fertig sind, ein Stellungsduell
(R13) aus einer Buchabbildung, {held} mit Weiß am Zug, Karten erlaubt, keine Uhr. Bewertung:
Stockfish 19 (lite), Tiefe 12 und 18, nur zur Auswahl; die Pipeline-Prüfung des Startvorteils
entscheidet.

| Nr. | Lernziel (Kapitel des nächsten Clubs)                   | Vorläufig: Abbildung, FEN                                            | Bewertung     | `zuege`, `mindestvorteil` |
| --- | ------------------------------------------------------- | -------------------------------------------------------------------- | ------------- | ------------------------- |
| S15 | Doppelangriff, ungedeckte Figuren (Kap. 4, 7)           | 2.27: `r1bqk2r/pppp1ppp/2n5/8/2BP4/2b2N2/P4PPP/R1BQ1RK1 w kq - 0 10` | +1,3 bis +2,1 | 10, 1,0                   |
| S16 | Eröffnungsgrundsätze, vorschnelles Schlagen (Kap. 1, 2) | 2.49: `rnbqkb1r/pppp1ppp/8/4N3/4n3/8/PPPP1PPP/RNBQKB1R w KQkq - 0 4` | +0,7 bis +1,0 | 10, 0,7                   |
| S17 | Mehrbauer verwerten, richtig tauschen (Kap. 8)          | 8.2: `6k1/pp1q1ppp/1n6/8/4N3/2P5/PP3PPP/3Q2K1 w - - 0 1`             | +2,6 bis +3,3 | 12, 1,5                   |

Unsicher: 2.49 liegt am unteren Rand des Fensters von R13 (+0,8 bis +2,5), 8.2 knapp darüber.
Ersatz für S16 wäre 2.129 (`r1bqkb1r/ppp2ppp/2n5/3np1N1/2B5/8/PPPP1PPP/RNBQK2R w KQkq - 0 6`,
+1,4, aber ein Opfer, also eher „Taktik“ als „Eröffnung fremd“). Für S17 fand ich in Kapitel 8
und 9 keine Abbildung im Fenster (Endspiele sind entweder gewonnen oder remis); entweder gilt für
S17 eine Ausnahme vom Fenster, oder das Format „Endspiel gewinnen“ kommt zuerst. 2.27 stammt aus
Kapitel 2, das Motiv (Doppelangriff auf Läufer und f7) gehört aber zum Thema von Riverton. Keine
der drei Abbildungen ist bisher in `begegnungen.json` benutzt.

**Erzählter Einstieg (Entwurf, Erzähler vor dem Brett):**

- S15: „Benji zieht, bevor du die Hand vom Stein hast. Er schlägt alles, was sich schlagen lässt.
  Nach neun Zügen hat er zwei Bauern mehr, und sein Läufer steht mitten in deinem Lager. Du bist
  am Zug.“
- S16: „Imani antwortet auf deinen Springer mit ihrem Springer. Das hast du noch nie gesehen. Du
  schlägst auf e5. Sie schlägt auf e4, ohne nachzudenken. Nach drei Zügen steht es so.“
- S17: „Ihr liefert euch ein zähes Spiel. Türme und Läufer sind längst getauscht. Nach gut dreißig
  Zügen hast du einen Bauern mehr, und Zoe will die Damen behalten. Du bist am Zug.“

**Figuren.** Drei Jugendliche, immer dieselben, in jedem Akt spielt ein anderer:

- **Zoe**, 16, sie, Anführerin. Redet in Zahlen („Datenpunkt 4 112“), will alles richtig machen.
- **Benji**, 14, er. Zieht zu schnell, isst immer etwas, lacht über die eigenen Fehler.
- **Imani**, 15, sie. Still, die Stärkste, liest das Kleingedruckte. Sie zweifelt zuerst.

Bilder: bis eigene Bögen da sind, der Typ `statist.jugend` aus `25_Figurenprompts.md` (Kapuze,
Mütze, Handy). Welche Nummer `statist-NN` das im privaten Repository ist, konnte ich hier nicht
nachsehen. Bildwünsche, falls der Autor eigene Figuren will: (1) Zoe, weiße Weste mit kleinem
silbernem Logo über dem Kapuzenpulli, Tablet unter dem Arm; (2) Benji, zu große Weste, Rucksack,
Apfel; (3) Imani, Weste offen, Kopfhörer um den Hals; (4) dieselben drei ohne Weste (Akt 4);
(5) Klapptisch mit Tablet-Ständer als Möbel; je ein Porträtblatt 2 × 1 (neutral, lächelt).

**Texte im Entwurf (S15; S16 und S17 gleich gebaut):**

```ink
=== testteam_wald ===
{testteamWaldDurch: -> testteam_wald_danach}
{siegeWegCedarRivertonTestteam > 0 or ausgangWegCedarRivertonTestteam == "remis": -> testteam_wald_durch}
{ausgangWegCedarRivertonTestteam == "niederlage": -> testteam_wald_niederlage}
{not testteamGetroffen:
    ~ testteamGetroffen = true
    Quer über dem Weg steht ein Klapptisch. Drei in weißen Westen, auf jeder ein kleines silbernes Logo. #sprecher:erzaehler
    Testteam Perfect Move. Wir sammeln Datenpunkte. Wer vorbei will, spielt eine Stellung. #sprecher:zoe #stimmung:laechelt
    Das Tablet schaut nur zu. Ich spiele selber. Meistens. #sprecher:benji #stimmung:lacht
}
+ [„Eine Stellung.“]
    ~ beginnePartie("wegCedarRiverton.testteam")
    -> END
+ [„Später.“]
    Der Wald läuft nicht weg. Wir auch nicht. #sprecher:zoe #stimmung:laechelt
    -> END

=== testteam_wald_niederlage ===
Datenpunkt 4 113. Danke. #sprecher:zoe #stimmung:laechelt
{not abschiedGesehen:
    Er schlägt, ohne zu schauen. Lass ihn schlagen, und schau du. #sprecher:ambrose #stimmung:nachdenklich
- else:
    Er hat geschlagen, ohne zu schauen. Du auch. #sprecher:erzaehler
}
{testteamWaldVersuche >= 2: -> testteam_wald_genug}
Am Wegweiser steht eine Tafel mit drei Aufgaben. Danach siehst du so etwas schneller. #sprecher:erzaehler
+ [„Noch einmal.“]
    ~ testteamWaldVersuche = testteamWaldVersuche + 1
    ~ beginnePartie("wegCedarRiverton.testteam")
    -> END
+ [„Erst zur Tafel.“]
    -> END

=== testteam_wald_genug ===
Imani klappt das Tablet zu. #sprecher:erzaehler
Drei Datenpunkte von derselben Person. Mehr will das Programm nicht. Geh durch. #sprecher:imani #stimmung:nachdenklich
-> testteam_wald_offen

=== testteam_wald_durch ===
Benji starrt auf das Brett, dann lacht er und schiebt den Tisch zur Seite. #sprecher:erzaehler
Das war ich. Nicht das Tablet. Schreib das dazu, Zoe. #sprecher:benji #stimmung:lacht
-> testteam_wald_offen

=== testteam_wald_offen ===
~ testteamWaldDurch = true
~ testteamStand = 1
Auf dem Tablet läuft ein Balken: „ZERO lernt. 4 113 von 20 000.“ #sprecher:erzaehler
-> END

=== testteam_wald_danach ===
{~Wir stehen hier noch bis Freitag. Dann schickt uns die App woandershin.|Zwanzigtausend Partien, dann gibt es den Gutschein.} #sprecher:zoe #stimmung:laechelt
-> END
```

Der Übergang `weiterBahndamm` bekommt `dialog: weg-cedar-riverton.testteam_wald_tor`, einen
Knoten ohne Text, der bei offener Sperre sofort endet und sonst nach `testteam_wald` springt
(Muster `weiter_leuchtturm`, S12). Niederlage: ein Satz von Ambrose (ohne ihn ein Erzählsatz) und
der Hinweis auf die Tafel der Karte. Sieg oder Remis: Weg dauerhaft offen über die eigene Variable
`testteam…Durch`, nicht über `ausgang…`, damit eine spätere verlorene Partie nichts wieder schließt.

Kernsätze der beiden anderen (Entwurf):

- S16, vorher: „Testfeld Glasbrücke. Zutritt nach einer Stellung.“ (Zoe) · „Ich spiele eine
  Eröffnung, die du nicht kennst. Das ist die Aufgabe.“ (Imani) · Ambrose nach Niederlage:
  „Fremd ist nur der Name. Die Figuren sind dieselben.“ · Übung: Tafel am Kaffeeautomaten.
- S16, nach dem Sieg: „Das war meine Falle. Die hab ich mir ausgedacht, im Herbst.“ (Imani) ·
  „Auf dem Tablet steht sie jetzt unter ‚ZERO, Variante 31‘. Ohne deinen Namen.“ (Erzähler) ·
  „Zwanzigtausend sind voll. Da steht: Datensatz vollständig. Danke für Ihre Teilnahme.“ (Zoe)
- S17, vorher (ohne Westen, ohne Tablets): „Kein Testteam mehr. Wir prüfen jetzt selber: Wer
  rauf zur Meisterschaft will, spielt eine Stellung ohne Stöpsel.“ (Zoe) · Ambrose nach
  Niederlage: „Tausche, was dir schadet, und behalte, was dir nützt.“ · Übung: Tafel am Diner.
- S17, nach dem Sieg: „Der blaue Laster da oben. Da drin sind unsere Partien.“ (Benji) · „In
  Silicon Bay hat eine gekündigt, Dr. Lin. Der bringen wir unsere Protokolle.“ (Imani)

## 3. Bogen über die Akte und Auflösung

- **Akt 2, stolz:** bezahlt mit Gutscheinen, „ZERO lernt mit“. `testteamStand = 1`.
- **Akt 3, Zweifel:** Imani findet ihre eigene Falle als „Variante 31“ von ZERO, das Team wird
  per Meldung entlassen. `testteamStand = 2`.
- **Akt 4, Seitenwechsel:** ohne Westen, sie prüfen jetzt selbst auf ehrliches Spiel und bringen
  ihre Protokolle zu Dr. Lin. `testteamStand = 3`.
- **Auflösung vor der Arena:** drei Figuren auf dem Vorplatz (`capitalArena.aussen`, beim
  Limonadenwagen), `wenn: testteamStand >= 3`, eigener Knoten `capital-arena-aussen.testteam`,
  zwei Zeilen: „Dr. Lin hat unsere Protokolle. 20 000 Partien, alle von uns, keine von ZERO.“
  (Zoe) · „Sie sagt, das wiegt.“ (Imani). Szene 105 selbst bleibt, wie sie ist.
- **Zugabe in der Kreidenacht** (nach dem Finale, also ohne Ambrose): eine bedingte Erzählzeile in
  `capital-arena-ubahnhof.mo_erstes` nach Mos „Alle sind hier“: `{testteamStand >= 3: Am hinteren
Tisch sitzen drei, die du kennst. Ohne Westen, ohne Tablets. Benji verliert gerade und lacht.}`
  Mehr nicht; Victor bleibt der Moment der Nacht.

Wer eine Sperre nie gesehen hat (alter Spielstand), bekommt Stand und Auflösung nicht; nichts hängt
davon ab. Graham Hale kommt im Strang bewusst nicht vor: Seine Szenen (Ironwood, 105, 107) tragen
allein.

## 4. Wie es nicht nervt

1. Drei Sperren im ganzen Spiel, je eine kurze Stellung (10 bis 12 Züge), keine Uhr, Karten erlaubt.
2. Nach einer Niederlage sofort neu („Noch einmal“), kein Münzverlust, keine Überheblichkeit.
3. **Notausgang:** Nach der dritten Niederlage lässt die Truppe durch („Drei Datenpunkte reichen“).
   Grundsatz 1 des Wegenetzes verlangt, dass sich jede Sperre öffnet, wenn die Hauptgeschichte den
   Weg braucht; ein Kind darf hier nicht hängen bleiben. Remis öffnet ebenfalls.
4. Nie auf Rückwegen, nie vor einer Pflichtszene in einer Sackgasse: Hinter {held} liegt jedes Mal
   eine Karte mit Tafel, Fund und Statisten.
5. Wer die Stadt dahinter schon kennt, sieht die Sperre nie.
6. Nach dem Durchlassen steht die Truppe bis zur Ankunft in der Stadt daneben und sagt einen Satz;
   keine Revanche, kein zweites Angebot.

## 5. Technische Einbindung

- **`gegner.json`:** drei Profile, Rolle `story`, `staerke: { art: "eingang", versatz: 260 | 380 |
560 }`. `wegCedarRiverton.testteam` (Benji: `draufgaenger`, Gewichte `schlagreflex` 1,6,
  `figurHaengen` 1,3), `wegIronwoodSilicon.testteam` (Imani: `positionsspieler`, `tempoverlust`
  1,4), `wegDesertSummit.testteam` (Zoe: `universell`, `falscherAbtausch` 1,5, Phasenversatz
  Endspiel −1). Steckbrief je eine Zeile.
- **`begegnungen.json`:** drei Einträge gleicher Kennung, `farbe: white`, `format:
stellungsduell` mit den Werten aus Abschnitt 2, `startstellung: { art: "abbildung", nummer }`,
  `kartenErlaubt: true`, keine `zeit`. Später Wechsel auf die neuen Formate ohne neue Kennung.
- **`orte.json`:** je Weg drei Figuren (`…testteamZoe`, `…testteamBenji`, `…testteamImani`) mit
  `wenn` aus Abschnitt 2, alle mit demselben Dialogknoten, die spielende mit `gegner`; in
  `capitalArena` drei Figuren mit `wenn: testteamStand >= 3`. An den Übergängen `weiterBahndamm`
  und `weiterBergstrasse` neu `wenn` und `dialog`; an `weiterGlasbruecke` neu `wenn`, der
  vorhandene Knoten `glasbruecke` bekommt als erste Zeile den Sprung zur Truppe, solange die
  Sperre zu ist. Szenen: Figurenfelder neben dem Weg, Klapptisch als Möbel.
- **Ink:** neue Knoten in `weg-cedar-riverton.ink`, `weg-ironwood-silicon.ink`,
  `weg-desert-summit.ink` (`testteam_*`), ein Knoten in `capital-arena-aussen.ink`, eine Zeile in
  `capital-arena-ubahnhof.ink`. Globale VAR, in jeder lesenden Datei mit demselben Startwert
  (R42): `testteamGetroffen`, `testteamStand` (Zahl), `testteamWaldDurch`, `testteamBrueckeDurch`,
  `testteamGitterDurch`, je Sperre `…Versuche` (Zahl); von der Hülle `ausgang…Testteam` und
  `siege…Testteam`. Die App legt für jeden Dialog eine neue Ink-Geschichte an: Der Zähler der
  Versuche ist deshalb eine VAR, kein Besuchszähler, und kein Knoten fragt `knoten > 0` ab.
- **`quests.json`:** eine Nebenquest `wegCedarRiverton.testteam`, `klein: true`, Start
  `dialog: weg-cedar-riverton.testteam_wald`. Vier Schritte, alle `art: dialog`, weil der
  Notausgang ohne Sieg öffnet: `…testteam_wald_offen`, `…testteam_bruecke_offen`,
  `…testteam_gitter_offen`, `capital-arena-aussen.testteam`; je Schritt 10 Münzen.
- **`texte/de.json`:** `figur.zoe.name`, `figur.benji.name`, `figur.imani.name`, Questtitel und
  vier Schritttexte, drei Steckbriefzeilen, drei Einstiegstexte, sobald das Format sie als
  Textschlüssel will (heute stünden sie im Ink-Knoten vor `beginnePartie`).
- **Gesamtsimulation:** sollte ohne Änderung durchkommen: Sie fasst Figuren und Übergänge an, bis
  sich nichts mehr ändert, und spielt jede Begegnung abgebrochen, Niederlage, Remis, Sieg.
  Nicht nachgeprüft: ob sie einen Übergang ohne Sprungziel im selben Zug noch einmal anfasst,
  nachdem die Figur die Sperre geöffnet hat. Vor dem Zusammenführen `gesamtsimulation.cjs` mit
  mehreren Startwerten, den Chaoslauf und `--wirtschaft` (40 Münzen mehr) laufen lassen.
- **Betroffene Prüfungen:** `pytest pipeline/tests` (Schemas, Versatzbereiche, Startvorteil der
  Stellungsduelle, Reiseziele), `figurensperre`, `blickrichtung`, `inkuebersetzung.cjs`,
  `inkbesuche`, `sprache`, `ambrose-danach.cjs` (Ambrose-Zeilen nur mit `not abschiedGesehen`),
  Verzeichnis der Dialogvariablen in R42, `lesefassung.cjs`. In `13_Wegenetz.md` kommen S15 bis
  S17 in die Tabellen, in die Bibel je ein Satz bei Szene 27, 52 und 81.

## 6. Offene Fragen an den Autor, mit Empfehlung

1. **Drei statt vier Sperren, keine in Akt 1?** Empfehlung: ja. Akt 1 hat genug Tore, und
   Perfect Move ist dort laut Bibel nur ein Name.
2. **Notausgang nach drei Niederlagen?** Empfehlung: ja. Ohne ihn kann ein schwacher Leser an der
   Hauptgeschichte hängen bleiben; „erst nach einem Sieg“ gilt dann für alle anderen.
3. **Stärke E + 260, 380, 560?** Empfehlung: so beginnen und nach der Balance-Simulation
   nachstellen. Unsicher bin ich bei S17: Der Abstand zu Ward ist der größte des Spiels.
4. **S16 auf der Raststätte oder am Deich vor Port Delacroix?** Empfehlung: Raststätte. Am Deich
   stopfen Leute ein Loch im Damm, und Ambrose wird dort schon still; eine freche Truppe passt
   nicht. Die Karte der Fähre ist ohnehin ausgenommen.
5. **Stellung für S17:** Ausnahme vom Fenster +0,8 bis +2,5 für Abbildung 8.2, oder warten, bis
   „Endspiel gewinnen“ gebaut ist? Empfehlung: Ausnahme, mit `mindestvorteil` 1,5.
6. **Eigene Figurenbögen oder Statisten-Typ `jugend`?** Empfehlung: zuerst der Statisten-Typ,
   eigene Bögen erst, wenn die Truppe im Spieltest gefällt.
7. **Namen Zoe, Benji, Imani** sind frei (in Texten, Dialogen und Bibel nicht vergeben).

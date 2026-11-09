# Gegenprüfung Akt 1 und Wege Akt 1/2 (mittel-2, Nacht 9./10.11.2026)

Auftrag des Haupt-Chats: die Karten von Akt 1 und die Wege Akt 1/2 in der gewählten Fassung (die
Szenen in `inhalte/abenteuer/szenen/`) gegen `KARTENREGELN.md` Abschnitt 10 (Regeln 1–49), die
Ortsdokumente und die Rückmeldung des Autors (`2026-11-09_varianten_autor.md`) prüfen. Nichts wurde
geändert.

**Vorgehen:** Stand `abenteuer-regelwerk` nach dem Hereinholen von friendly-shannon (0fa85a0d).
`kartenbau` für alle 21 Szenen, `kartenbild` in einen eigenen Ordner, jedes Bild angesehen (große
Karten in Ausschnitten). Feld = (Spalte, Reihe) in Kacheln, Norden oben.

**Werkzeug:** Alle 21 Szenen sind beim Kartenbauer „in Ordnung“. `kartenbild` meldet nur Bauteile, die
gewollt sind (Zaunecken Birch Lane, Seerosen und Steg im Park, Seiteneingang der Bibliothek, Falttisch im
Waschsalon). Alle Befunde unten sind also solche, die nur das Auge findet.

## 1. Rückmeldung des Autors: umgesetzt?

| Karte                  | Hinweis des Autors                                  | Stand jetzt                                                                                            |
| ---------------------- | --------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| Wohnzimmer A           | Haustür ragt über die Wand; Küchentresen            | umgesetzt (niedrige Tür (5, 12), Tresen geschlossen)                                                   |
| Dachboden C            | zwei gleiche Schränke                               | umgesetzt                                                                                              |
| Diner C                | Hocker, Kasse, Tische, Lager, Wände, WC, Rückbuffet | umgesetzt                                                                                              |
| Birch Lane A           | Bach, Wasserfall, Spielplatzzaun, Gehweg links      | umgesetzt (siehe aber 2.5: Wasser oben)                                                                |
| Park A                 | Sperrlatte; Steg weiter in den Fluss                | Absperrbock „GESPERRT“ steht; **Steg berührt noch die nördliche Uferkante** (siehe 2.6)                |
| Landstraße A           | Weg an zwei Windungen dünn                          | umgesetzt                                                                                              |
| Flussweg C             | Trampelpfad dünner; Wasserlinie am Steg             | umgesetzt                                                                                              |
| Ortskern Cedar Creek C | sechs Punkte                                        | umgesetzt                                                                                              |
| Bibliothek A           | Regal je Reihe; Seitenregale                        | umgesetzt (Seitenregale links und rechts)                                                              |
| Drechslerei A          | Dinge schweben                                      | umgesetzt                                                                                              |
| alle Innenräume        | niedrige Südtüren (Regel 38)                        | **Clubraum fehlt:** dort steht noch die hohe Tür `mf4TuerKlassisch` (generic_073, 32 hoch) bei (9, 11) |

## 2. Befunde je Karte

### 2.1 Wohnzimmer (`maple-falls-wohnzimmer`)

- (1–3, 0–3) Die Treppe ragt oben über die Wand in den Rand hinaus (Regel 16, sinngemäß 38). Vorschlag:
  Treppenbild so setzen, dass es unter der oberen Wandkante endet, oder Treppe in eine Wandnische.
- Umzugskartons verteilt (Regel 18): passt zur Geschichte (Einzug), kein Befund.

### 2.2 Dachboden (`maple-falls-dachboden`)

- kein Befund.

### 2.3 Clubraum (`maple-falls-clubraum`)

- (9, 11–12) Hohe Tür `mf4TuerKlassisch` statt der niedrigen Südtür (Regel 38, Hinweis des Autors). Vorschlag:
  `cc8TuerSuedHolz` an (9, 12) mit `an_wand`, Fußmatte (9, 11).

### 2.4 Diner (`maple-falls-diner`)

- (8, 8) Dunkles Kästchen allein in der Nische oben links, Zweck nicht erkennbar (Regel 40). Vorschlag:
  entfernen oder durch einen Gegenstand mit Zweck ersetzen (Zeitungsständer, Garderobe).

### 2.5 Birch Lane (`maple-falls-aussen`)

- (12–25, 0–2) Eine Grasinsel liegt am oberen Rand im Bach; das Wasser tritt dadurch zweimal am Nordrand
  aus und wirkt wie ein Teich mit Insel, nicht wie ein Bach (Regeln 23, 32). Vorschlag: prüfen, ob gewollt;
  sonst den Bach als ein Lauf zum Rand führen.
- (7, 29) und (25, 31) Kleine Holzschildchen ohne erkennbaren Zweck (Regel 26). Vorschlag: entfernen oder
  als Hausnummer/Wegweiser lesbar machen.

### 2.6 Park (`maple-falls-park`)

- (5–6, 2–3) Der morsche Steg liegt mit der Oberkante noch auf der nördlichen Uferlinie (Regel 44,
  Hinweis des Autors). Vorschlag: eine halbe Kachel tiefer ins Wasser (`versatz` [0, 8]).
- (31–34, 14–18) Die Straße überquert den Bach; an den Kanten nur dünne graue Platten, kein Geländer, und
  das Wasser endet unter der Fahrbahn (Regel 6). Vorschlag: Brückengeländer an beiden Straßenseiten oder
  das Bild einer Straßenbrücke.

### 2.7 Landstraße (`weg-maple-cedar-landstrasse`)

- (17–30, 18–25) Leere Koppel mit Gatter, ohne Tiere oder erkennbaren Zweck (Regel 30). Vorschlag: zwei
  Schafe oder ein Pferd als Belebung, oder ein Schild „Weide“.

### 2.8 Flussweg (`weg-maple-cedar-flussweg`)

- (104–105, 17–18) und (108–109, 17) Zwei kurze Stiche vom Trampelpfad enden im Gras vor dem Ufer (Regel 28).
  Vorschlag: bis zum Ufer an einen Steg oder zum Boot (101, 22) führen, oder weglassen.

### 2.9 Zedernpfad (`weg-maple-cedar-zedernpfad`)

- (36–41, 12–13) Baumstämme liegen quer auf dem Weg, der Weg ist aber begehbar (Regel 29: Sperren sind
  dicht, sonst keine Sperre). Vorschlag: Stämme neben den Weg legen, oder als echte Sperre mit Grund.

### 2.10 Ortskern Cedar Creek (`cedar-creek-aussen`, eigene Karte)

- (18–19, 3–4) Der Pfad am Bach endet oben an den Gleisen ohne Übergang (Regel 28). Vorschlag: Bahnübergang
  (Bohlen wie in Ironwood) oder den Pfad an der Bude enden lassen.

### 2.11 Bibliothek, Archiv, Waschsalon, Drechslerei (`cedar-creek-*`)

- kein Befund.

### 2.12 Zedernwald (`weg-cedar-riverton-zedernwald`)

- kein Befund (Bach durchgehend vom Nordrand über die Brücke zum Südrand, Raster geprüft).

### 2.13 Bahndamm (`weg-cedar-riverton-bahndamm`)

- (65–68, 5–8) Tunnelportal im Damm, zu dem der Weg führt, ohne Auslöser und ohne Grund (Regeln 26, 28).
  Vorschlag: Ansehen-Auslöser für Runde 6 („zugemauert seit 1952“) oder Gitter davor.
- (126–131, 10–14) Leere weiße Plakatwand (Regel 48). Vorschlag: Plakat mit Inhalt (Zirkus, Fahrplan) oder
  weglassen.
- (121–134, 9) Einzelnes Zaunstück ohne Anschluss und Zweck (Regel 27). Vorschlag: weglassen oder zur
  Koppel machen.
- (38, 0–2) Einzelne Straßenlaterne in der Baumreihe über dem Gleis, ohne Straße (Regel 19). Vorschlag:
  an den Bahnsteig (46–57, 3–6) setzen.

### 2.14 Ironwood außen (`ironwood-aussen`)

- (4–9, 28–31) Straße über den Kanal: nur dünne Kanten, kein Geländer, das Wasser endet unter der Fahrbahn
  (Regel 6). Vorschlag wie im Park.
- (78–79, 49–52) Die beiden Gleise enden eine Kachel vor dem Ostrand an einer grauen Fläche, weder bis zum
  Rand noch an einem Prellbock (Regeln 2, 42). Vorschlag: Gleise bis Spalte 79, oder Prellböcke.
- (76–78, 55–57) Absperrbock „GESPERRT“ steht neben dem Weg zum Steinbruch, der seit Runde 5 offen ist
  (Regeln 29, 48). Vorschlag: entfernen, oder auf den Weg stellen, wenn eine Sperre gemeint ist.
- (63–66, 35–37), (70, 35), (66, 40) Nebeneinander nur dieselbe Laubbaumart (Regel 20). Vorschlag: zweite
  Art oder gespiegelt.
- (57–60, 27) Lücke im Zaun des Werkhofs ohne Pfosten an den Enden (Regel 35). Vorschlag: Torpfosten oder
  Tor.
- (40–41, 26–27) Kisten auf dem Gras ohne Grund (Regel 18). Vorschlag: an die Werkhalle oder weglassen.

### 2.15 Kantine (`ironwood-kantine`)

- (2–9, 2–3) Küchenzeile mit Lücken: Kaffeemaschine, Herd, Schrank und Vitrine stehen einzeln (Regel 14).
  Vorschlag: lückenlos aneinander.
- (22, 9–11) Kühlschrank allein an der Ostwand, weit weg von der Küche (Regeln 14, 40). Vorschlag: an die
  Küchenzeile.
- (9, 13) Abtropfgestell steht auf dem Boden (Regel 13). Vorschlag: auf eine Arbeitsfläche.
- (2–5, 13–14) Zwei dunkle Schränke ohne erkennbaren Zweck (Regel 30). Vorschlag: Geschirrrückgabe mit
  Tabletts oder weglassen.

### 2.16 Mamas Zimmer (`ironwood-mamas-zimmer`)

- (11, 3–4) Bild steht unter der Wandkante im Raum statt an der Wand (Regel 10). Vorschlag: `an_wand` in
  Reihe 1.

### 2.17 Umkleide (`ironwood-umkleide`)

- kein Befund.

### 2.18 Museum (`ironwood-museum`)

- (3, 1), (9, 1), (18, 1) Drei gleiche Automaten an der Nordwand (Regel 43). Vorschlag: prüfen, ob als
  Serie gemeint (alte Fahrkartenschalter); sonst zwei verschiedene.
- (2–4, 8–9) Tonkrüge auf dem Boden (Regeln 13, 18). Vorschlag: in eine Vitrine oder auf ein Podest.

## 3. Zusammenfassung

- Die Hinweise des Autors sind bis auf zwei Punkte umgesetzt: **Clubraum-Südtür** (Regel 38) und der
  **Steg im Park** (berührt noch die Uferkante).
- Häufigste neue Befunde: Straßenbrücken ohne Geländer (Park, Ironwood), Dinge ohne Zweck oder Grund
  (Schilder, Zaunstück, Plakatwand, Kisten, Schränke), Wege, die im Gras enden.
- Keine Befunde in Dachboden, Bibliothek, Archiv, Waschsalon, Drechslerei, Zedernwald, Umkleide.

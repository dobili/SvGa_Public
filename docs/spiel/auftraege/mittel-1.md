# Auftrag mittel-1: Dialoge für den Weg Riverton → Ironwood und für Ironwood (Akt 2, zweiter Teil)

**Stand:** fertig (Helfer mittel-1, 08.11.2026, achter Auftrag)
**Zweig:** dein fester Sitzungszweig, Basis `claude/friendly-shannon-y8bf90` (vorher hereinholen)
**Darf ändern:** `inhalte/abenteuer/dialoge/de/*.ink` (neue Dateien für `wegRivertonIronwood` und
`ironwood`; in `cedar-creek-aussen.ink` und `riverton-aussen.ink` nur die Befunde unten),
`inhalte/abenteuer/quests.json` (nur Quests mit `ort` ironwood, wegRivertonIronwood und
`riverton.schuppen`), `inhalte/abenteuer/texte/de.json` (nur neue Schlüssel),
`docs/spiel/auftraege/mittel-1.md`
**Prüfung vor dem Push:** wie bisher (pytest alle, Paketbau, Prettier, Durchspielen, Simulation
der Ironwood-Quests und von `riverton.schuppen`)

## Ziel

Alle Dialoge, auf die `orte.json` für `wegRivertonIronwood` und `ironwood` verweist, nach Akt 2
der Story-Bibel (Szenen in Ironwood, Mamas Partie, Victors Einladung als Cliffhanger) und 09,
Abschnitte 4a und 5.5.

## Antworten auf deine Befunde (schon umgesetzt, Stand nach dem Hereinholen)

1. **`wenn` an Übergängen** gilt jetzt als erfüllt bei true, einer Zahl über 0 oder einem nicht
   leeren Text; `wenn: nadelRiverton` öffnet den Kanalweg also nach der Nadel.
2. **Verrosteter Schlüssel:** Fund `schluessel` steht in `funde.json`. Bitte am Steg in
   `cedar-creek-aussen.ink` vergeben (Szene 23 nach mittel-2: im passenden Zweig
   `~ gibFund("schluessel")`). Die Hülle setzt bei jedem Fund die Dialogvariable
   `gefunden<Fund>` (hier `gefundenSchluessel`); damit kann `albescu_schluessel` in
   `riverton-aussen.ink` den Schuppen anbieten, und `riverton.schuppen` beginnt.
3. **Tafel-Runden:** Zusätzlich zur Kurzform setzt die Hülle jetzt die Langform mit Ort
   (`wegMapleCedarTafelBestanden`, `wegCedarRivertonTafelBestanden` …); bitte für die Tafeln die
   Langform benutzen und bestehende Kurzform-Abfragen der Tafeln umstellen.
4. **Fahrkarte im Zug:** bleibt vorerst ohne Abfrage (kommt mit der Schnellreise-Regel).

## Vorgaben

1. Knotennamen genau wie in `orte.json`; Übergänge mit Dialog und `wenn` wie bisher.
2. Die Funde von Ironwood und dem Kanalweg stehen in `funde.json` (zahnrad, nietenkopf, foto2001,
   umschlag, holzturm, glasfunke); `zeitnotTrick` am Kanalweg erklärt und verschenkt die Karte
   (Name in `karten.json` folgt mit Schritt 13; bis dahin `~ gibKarte("zeitbonus")` als Platzhalter
   und im Bericht vermerken).
3. Dinge zum Ansehen, die 09 für Riverton und Ironwood nennt, aber `orte.json` nicht hat (Uhr mit
   Klebeband, Fahrplantafel, Fundbüro-Schild; Schichtplan, Kaffeemaschine, Werksfoto, Poster,
   Standuhr, Nieten „J. H.“): nicht anlegen, nur im Bericht vorschlagen, welche sich lohnen.

## Was nicht dazugehört

Karten, Code, Akt 3.

## Bericht

**Fertig:** sechs neue Dateien (`weg-riverton-ironwood.ink`, `ironwood-aussen.ink`,
`ironwood-kantine.ink`, `ironwood-mamas-zimmer.ink`, `ironwood-umkleide.ink`,
`ironwood-museum.ink`), dazu die Befunde: Schlüssel am Steg (`cedar-creek-aussen.fund_schluessel`),
`gefundenSchluessel` bei Mrs. Albescu, Langform der Tafeln in `weg-maple-cedar.ink` und
`weg-cedar-riverton.ink`. Jeder Dialogverweis in `orte.json` und jeder Dialogknoten in
`quests.json` hat jetzt einen Knoten (per Skript geprüft, für alle Orte). Prüfungen: pytest alle
(375 bestanden), Paketbau, Prettier, Durchspielen aller Knoten (9972 Läufe ohne Fehler),
Variablen-Durchsicht, `npm run pruefen` (2382 Tests). Simulation wie Oberwelt und
`regeln/quests.ts`, mit den neuen Regeln der Hülle (`gefunden<Fund>`, `wenn` bei Zahl > 0):
Schlüssel am Steg → Albescu → Schuppen → Fahrrad, Kanalweg mit Nadel offen, Ironwood komplett
(Clubkampf zuerst abgebrochen und verloren, Mama gewinnt): **`riverton.schuppen`,
`wegRivertonIronwood.tafelHaltestelle`, `ironwood.mamasFinale`, `ironwood.clubkampf`,
`ironwood.postsack`, `ironwood.feier`, `ironwood.erinnerungBird` werden alle fertig.** Die
Simulationen von Akt 1 (13 Quests) und Riverton laufen weiterhin durch.

**Knoten je Datei** (Einstiege fett):

- `weg-riverton-ironwood`: **dale**, **tafel**, **fund_zahnrad**, **fund_nietenkopf**,
  **zeitnot_trick**.
- `ironwood-aussen`: **ankunft_zu_fuss** (Ankunft mit Mamas Anruf, Szene 38); **kanalweg**,
  **haustuer_ruth** (Übergänge); **bus_riverton** (`reise("riverton.aussen", "bahnhof")`),
  **bus_silicon_bay**; **gus** → gus_erstes_treffen, gus_angebot, gus_nach_sieg,
  gus_nach_niederlage; **edna**; **victor**, **graham_hale** → kauf (Szene 49), einladung
  (Szene 50); **eisenwarenfenster**, **kreidebrett**.
- `ironwood-kantine`: **big_joe** (eine Zeile vor dem Verteilen) → big_joe_erkennt,
  big_joe_reihe_offen, big_joe_clubkampf, big_joe_nach_niederlage, big_joe_nach_sieg,
  big_joe_alltag (Revanche um eine bessere Nadel), feier_einladung, feier; **mama** →
  mama_foto, mama_partie_angebot, mama_nach_partie, mama_alltag; **hank** → hank_reihe;
  **priya** → priya_reihe; **pokalregal**, **stahlbrett**.
- `ironwood-mamas-zimmer`: **oma_ruth**, **medaille**, **partieformular**.
- `ironwood-umkleide`: **schliessfach**.
- `ironwood-museum`: **teague**, **postsack** → postsack_offen, **vitrine**, **fund_glasfunke**.

**Quest-Änderung `ironwood.mamasFinale`** (Grund: Start und erster Schritt warteten auf denselben
Knoten `maple-falls-wohnzimmer.verbot`; die Quest wäre nie weitergekommen, und das Wohnzimmer
war für diesen Auftrag gesperrt):

- Start: `ironwood-kantine.big_joe_erkennt` (Big Joe erkennt Lauries Kind und nennt die Elm
  Street, setzt `elmStreetBekannt`).
- Schritte: `ironwood-mamas-zimmer.oma_ruth` (Szene, Gegenstand foto2001, unverändert),
  `ironwood-kantine.mama_foto` (statt `maple-falls-wohnzimmer.foto_zeigen`), Partie
  `ironwood.mama` (unverändert). Texte `schritt2` bis `schritt4` wie bisher; `schritt1` wird
  nicht mehr benutzt und kann weg.
- Das Verbot (Szene 38) ist jetzt Mamas Anruf bei der Ankunft zu Fuß (`ankunft_zu_fuss`, setzt
  Szene `akt2.verbot` selbst). Mama kommt nach dem Besuch bei Oma Ruth selbst in die Kantine
  („Oma Ruth hat angerufen“), dort zeigt {held} ihr das Foto, dann folgt die Partie. Das spart
  zwei Fahrten nach Maple Falls und bleibt nah an der Bibel (Szene 43: „In Ironwood. Ich will den
  Raum sehen.“). Wenn der Autor die Szenen im Wohnzimmer möchte: `verbot` und `foto_zeigen` in
  `maple-falls-wohnzimmer.ink` anlegen und die Quest zurückbauen (Start ein anderer Knoten als
  der erste Schritt).

**Entscheidungen:**

1. **Zeitnot-Trick:** `~ gibKarte("zeitbonus")` als Platzhalter, bis die Karte in `karten.json`
   steht (Schritt 13). Der Buchbezug ist ein Satz aus Kapitel 12, Abschnitt 12.5, mit Fundstelle
   (so in der Bibel vorgegeben).
2. **Foto von 2001:** Die Quest gibt den Gegenstand `foto2001`; `oma_ruth` ruft zusätzlich
   `gibFund("foto2001")` auf, damit das Foto im Album steht (zwei getrennte Listen). Falls die
   Hülle Gegenstand und Fund zusammenlegt, kann der Aufruf weg.
3. **Edna** ist vorerst ein Gespräch ohne `oeffneLaden`, weil `laeden.json` keinen Laden
   `ironwood.eisenwaren` hat.
4. **Schließfach ohne Laterne:** Die Bibel verlangt die Laterne; die Hülle meldet Gegenstände
   nicht als Dialogvariable. Das Fach öffnet sich deshalb vorerst ohne. Vorschlag: `hat<Gegenstand>`
   wie `gefunden<Fund>`, dann prüft `schliessfach` auf `hatLaterne`.
5. **Mamas Platz in der Kantine:** Die Figur `ironwood.mama` steht immer auf der Karte; vor dem
   Besuch bei Oma Ruth sagt sie nur „Am Tisch am Fenster ist ein Platz frei.“ Besser wäre eine
   Sichtbarkeit der Figur über eine Variable (`fotoGefunden`).
6. **Victor und Graham Hale** sind vor der Nadel Kulisse am Werkstor (ein Satz), danach `kauf`
   und `einladung`.

**Neue Variablen** (von Ink, Wahrheitswerte false außer `clubkampfIronwoodNadel` 0):
`ankunftIronwoodGesehen`, `elmStreetBekannt` (Bedingung der Haustür), `mamaSpielt` (Bibel,
Szene 43), `bigJoeGetroffen`, `fotoGefunden`, `mamaFotoGesehen`, `feierGesehen`,
`hankGetroffen`, `priyaGetroffen`, `clubkampfIronwoodNadel`, `pokalregalGesehen`,
`gusGetroffen`, `ednaGetroffen`, `kaufGesehen`, `einladungGesehen`, `kreidebrettGesehen`,
`daleGetroffen`, `zahnradGefunden`, `nietenkopfGefunden`, `zeitnotTrickErhalten`,
`medailleGesehen`, `partieformular2001Gesehen`, `holzturmGefunden`, `teagueGetroffen`,
`umschlagGeoeffnet`, `glasfunkeGefunden`. Von der Hülle gelesen: `ausgangIronwoodGus`,
`ausgangIronwoodMama`, `ausgangIronwoodClubkampf`, `reiheHankBestanden`, `reihePriyaBestanden`,
`siegelStellungBestanden`, `erinnerungBirdBestanden`, `wegRivertonIronwoodTafelBestanden`,
`wegCedarRivertonTafelBestanden`, `wegMapleCedarTafelBestanden`, `nadelIronwood`,
`gefundenSchluessel`.

**Dinge zum Ansehen, die sich lohnen** (Vorgabe 3, nur Vorschlag):

| Ort                     | Ding                        | Warum                                                                 |
| ----------------------- | --------------------------- | --------------------------------------------------------------------- |
| Riverton, Bahnhofshalle | Fundbüro-Schild             | Witz mit Bezug („Verloren: ein Pavillon“), kostet einen Knoten        |
| Riverton, Pavillon      | Uhr mit Klebeband           | erzählt Slicks Club in einem Satz (alles geflickt, nichts aufgegeben) |
| Ironwood, Kantine       | Werksfoto                   | Big Joe und Laurie 2001 im Hintergrund, leiser Hinweis vor Oma Ruth   |
| Ironwood, Museum        | Standuhr                    | Mr. Teague zieht sie jeden Sonntag auf, Gegenstück zu Harlans Uhr     |
| Ironwood, Brücke        | Nieten „J. H.“              | schon im Fund und in Szene 50 enthalten; als eigenes Ding überflüssig |
| Riverton, Bahnhofshalle | Fahrplantafel               | eher Kulisse; nur, wenn der Zug später Preise anzeigt                 |
| Ironwood, Kantine       | Schichtplan, Kaffeemaschine | Kulisse ohne Geschichte; weglassen                                    |
| Ironwood, Mamas Zimmer  | Poster                      | nur, wenn es ein Schachposter ist (sonst weglassen)                   |

**Offene Fragen:** keine, die blockieren.

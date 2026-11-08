# Auftrag mittel-1: Dinge zum Ansehen in den Innenräumen von Maple Falls und Cedar Creek

**Stand:** fertig (Helfer mittel-1, 08.11.2026, sechster Auftrag)
**Zweig:** dein fester Sitzungszweig (zuletzt `claude/schach-abenteuer-mittel-1-cl431d`), Basis
`claude/friendly-shannon-y8bf90` (vorher hereinholen)
**Darf ändern:** `inhalte/abenteuer/dialoge/de/ansehen-maple-falls.ink` und
`ansehen-cedar-creek.ink` (neu), `inhalte/abenteuer/orte.json` (nur in `mapleFalls` und
`cedarCreek` je Gegenstand einen Auslöser anhängen, mit `karte` der jeweiligen Innenkarte),
`inhalte/abenteuer/texte/de.json` (nur neue Schlüssel), `docs/spiel/auftraege/mittel-1.md`
**Prüfung vor dem Push:** wie bisher (pytest `test_abenteuer.py`, Paketbau, Prettier, Durchspielen)

## Ziel

Jeder Innenraum bekommt drei Dinge zum Ansehen ohne Spielwirkung (09, Abschnitt 3.2): ein Satz,
bei wiederholtem Ansehen ein zweiter, mindestens eines mit Schachbezug. niedrig-1 setzt die
Objekte gleichzeitig mit genau diesen Namen in die Karten.

## Vorgaben

1. **Auslöser und Knoten** (Name in `orte.json` → Knoten in deiner Datei, `art: "gegenstand"`):
   - Wohnzimmer: `fotoGrandma`, `kartonKueche`, `pizzakarton`
   - Dachboden: `hutschachtel`, `spiegel`, `zeitungen1961`
   - Clubraum: `pokalvitrine`, `brettOhneDame`, `plakatZaehlen`
   - Bibliothek: `zeitungsregal`, `globus`, `schildFluestern`
   - Archiv: `boxerfoto`, `wasserfleck`
   - Waschsalon: `zettelTurm`, `comicheft`, `automat`
     Knotennamen in snake_case (`foto_grandma` …), Datei `ansehen-maple-falls.ink` bzw.
     `ansehen-cedar-creek.ink`.
2. Ambrose darf kommentieren (altmodisch, kurz); Mama, Juno oder der Held nicht. Keine Quests,
   keine Belohnungen; Variablen nur, wenn ein zweiter Satz nötig ist (Ink-Besuchszähler genügt).
3. Bezüge zur Geschichte sind willkommen (Grandma Whitlock, 1961, die fehlende Dame, Pokale von
   1994), aber nichts verraten, was Akt 2 auflöst.

## Was nicht dazugehört

Karten, Statisten-Sätze (kommen mit der Technik für Statisten), Code.

## Bericht

**Fertig:** `ansehen-maple-falls.ink` (9 Gegenstände) und `ansehen-cedar-creek.ink` (8), dazu 17
Auslöser in `orte.json` (nur angehängt, je mit `karte` der Innenkarte, Art `gegenstand`, Dialog
`ansehen-….<knoten>`). Keine neuen Texte nötig. Prüfungen: pytest 9, Paketbau, Prettier,
Durchspielen aller Knoten (5760 Läufe ohne Fehler), jeder Gegenstand einzeln beim ersten und
zweiten Ansehen, Variablen-Durchsicht (keine Probleme), `npm run pruefen` (2379 Tests).

**Was man sieht** (erster Satz / zweiter Satz; Ambrose bei zwölf von 17 beim ersten Mal):

| Raum       | Gegenstand        | Inhalt in Kürze                                                                    |
| ---------- | ----------------- | ---------------------------------------------------------------------------------- |
| Wohnzimmer | `fotoGrandma`     | Grandma Whitlock vor einem Schachbrett / sie lächelt wie nach einem guten Zug      |
| Wohnzimmer | `kartonKueche`    | „Küche?“ dreimal unterstrichen / Teller und ein einzelner weißer Bauer             |
| Wohnzimmer | `pizzakarton`     | ein Stück fehlt, niemand gibt es zu / gehört fast zur Einrichtung                  |
| Dachboden  | `hutschachtel`    | Damenhut mit Feder / die Feder wippt                                               |
| Dachboden  | `spiegel`         | Sprung im Glas, nur du darin; Ambrose hat kein Spiegelbild / Ambrose schweigt      |
| Dachboden  | `zeitungen1961`   | „Miss Whitlock gewinnt die Schachmeisterschaft des Kreises“ / junge Frau mit Pokal |
| Clubraum   | `pokalvitrine`    | drei Pokale von 1994 / leerer Platz mit Zettel „Reserviert“                        |
| Clubraum   | `brettOhneDame`   | Radiergummi statt schwarzer Dame / „hat schon zwei Partien gewonnen“               |
| Clubraum   | `plakatZaehlen`   | „Erst zählen, dann schlagen!“ / Hinweis Kapitel 1, Abschnitt 1.4                   |
| Bibliothek | `zeitungsregal`   | Zeitungen von 1890 bis gestern / Schachaufgabe der Lokalzeitung, schon gelöst      |
| Bibliothek | `globus`          | Länder, die es nicht mehr gibt; Ambrose findet New Orleans / Kreuz neben Lagos     |
| Bibliothek | `schildFluestern` | „Bitte flüstern“; Ambrose hat eine Karte dafür / Schild hängt schief               |
| Archiv     | `boxerfoto`       | Boxer, Cedar Creek 1923 / „gewann danach jede Schachpartie im Ort“                 |
| Archiv     | `wasserfleck`     | Fleck in Form eines Springers / greift drei Kartons an                             |
| Waschsalon | `zettelTurm`      | „Verloren: ein weißer Turm“ / „Schon im Trockner nachgesehen?“                     |
| Waschsalon | `comicheft`       | Held gegen Roboter am Schachbrett / gewinnt mit einem Bauern, „Unrealistisch!“     |
| Waschsalon | `automat`         | Kaugummi für eine Münze / klemmende Kugel, „das Denkmal“                           |

**Entscheidungen:**

1. **Eine Variable je Gegenstand** (`angesehenFotoGrandma` … `angesehenAutomat`, Wahrheitswert,
   false, von Ink gesetzt): Der Auftrag schlug Ink-Besuchszähler vor, aber die Hülle baut für
   jeden Dialog eine neue Ink-Geschichte (`Dialog.tsx`, `new Geschichte(json, …)`); Besuchszähler
   wären beim nächsten Ansehen wieder 0, der zweite Satz käme nie. Dialogvariablen überleben über
   den Spielstand. Kosten: 17 kleine Einträge in `dialogvariablen`. Alternative für später: eine
   Funktion der Hülle, die Besuchszähler je Knoten speichert; dann könnten die Variablen weg.
2. **Kein Verrat von Akt 2:** 1961 gewinnt „Miss Whitlock“ (die spätere alte Mrs. Whitlock, Bibel
   Abschnitt 1), nicht Mama; Mamas Turnierzeit bleibt verborgen. Die fehlende Dame ist Sams
   Dame aus „Sams Dame“, nur als Witz mit dem Radiergummi. Der leere Platz in der Vitrine zeigt
   Coach Delgados Ziel (Kreisliga, Bibel 2.5).
3. **Buchbezug** nur einmal, als Abschnitt (Plakat: Kapitel 1, Abschnitt 1.4); Schachbezug in
   jedem Raum mindestens einmal (meist zwei- bis dreimal).
4. **Archiv mit zwei Dingen** wie vorgegeben; dort liegen schon Karton und Programmheft.

**Neue Variablen:** die 17 `angesehen…` oben, nur in der jeweiligen Datei.

**Offene Fragen:** keine. Vorschlag: Besuchszähler je Knoten in der Hülle (siehe 1), sobald mehr
solche Dinge kommen (Riverton, Ironwood).

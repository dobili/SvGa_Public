# Auftrag mittel-1: Dialogvariablen mit Ort, Durchsicht aller Ink-Dateien

**Stand:** fertig (Helfer mittel-1, 08.11.2026, vierter Auftrag)
**Zweig:** dein fester Sitzungszweig (zuletzt `claude/schach-abenteuer-mittel-1-cl431d`), Basis
`claude/friendly-shannon-y8bf90` (vorher hereinholen)
**Darf ändern:** `inhalte/abenteuer/dialoge/de/*.ink`, `inhalte/abenteuer/texte/de.json` (nur neue
Schlüssel), `docs/spiel/auftraege/mittel-1.md`
**Prüfung vor dem Push:** im Hauptordner `python -m pytest pipeline/tests/test_abenteuer.py`, in
`app/`: `node skripte/baue-abenteuerpaket.mjs`, `npx prettier --check ../inhalte/abenteuer`,
Durchspielen aller Knoten mit inkjs wie bisher.

## Ziel

Die Hülle setzt jetzt Dialogvariablen aus Ergebnissen, und zwar genau in der Langform, die du für
Cedar Creek vorgeschlagen hast (`app/src/abenteuer/regeln/dialogvariablen.ts`):

- Ausgang einer Begegnung: `ausgang` + Kennung ohne Punkt mit großen Anfangsbuchstaben, Werte
  „sieg“, „remis“, „niederlage“, „abgebrochen“. Beispiele: `ausgangMapleFallsErsteLektion`,
  `ausgangMapleFallsSamRevanche`, `ausgangMapleFallsClubkampf`, `ausgangMapleFallsVictor`,
  `ausgangMapleFallsSkaterJo`, `ausgangCedarCreekClubkampf`, `ausgangCedarCreekRosaDuell`.
- Bestandene Runde: `<name>Bestanden` = true (`reiheSamBestanden`, `trocknerStellungBestanden`).
  Nicht bestanden ändert nichts.
- Beste Nadel eines Clubs: `nadel<Ort>` als Zahl: 0 keine, 1 Bronze, 2 Silber, 3 Gold
  (`nadelMapleFalls`, `nadelCedarCreek`).

## Vorgaben

1. **Maple Falls umbenennen:** `ausgangErsteLektion` → `ausgangMapleFallsErsteLektion`,
   `ausgangSamRevanche` → `ausgangMapleFallsSamRevanche`, `ausgangClubkampf` →
   `ausgangMapleFallsClubkampf`, `ausgangVictor` → `ausgangMapleFallsVictor`, `ausgangSkaterJo` →
   `ausgangMapleFallsSkaterJo` in allen Dateien (VAR-Zeilen und Verwendungen).
2. **Durchsicht:** Jede Variable, die die Hülle setzt, ist in jeder Datei, die sie liest, als
   `VAR` mit dem richtigen Typ deklariert („“ für Ausgänge, false für Runden, 0 für Nadeln). Jede
   Datei deklariert nur, was sie braucht. Ein Verzeichnis aller Variablen (Name, Typ, wer setzt,
   wer liest) kommt als Tabelle in deinen Bericht; der Haupt-Chat übernimmt es ins Regelwerk.
3. **Ankunft nach der Busfahrt:** Die Hülle kann noch keinen Knoten nach `reise` starten. Bis
   dahin bleibt deine Lösung (Ankunft beim ersten Gespräch draußen). Prüfe, dass sie in beiden
   Richtungen stimmt: Rückfahrt nach Maple Falls (`bus_zurueck` → Park) ohne hängende Quest.
4. **Dachboden nach Cedar Creek:** Ambroses `ambrose_rat` soll nach `endeAkt1Gesehen` auf den
   Stand von Akt 2 hinweisen (ein Satz, Akt 2 ist noch nicht geschrieben; „Der Weg führt weiter,
   aber nicht heute.“ genügt).
5. Alles Übrige wie in den vorigen Aufträgen (Sprecher-Tags, geschlechtsneutral, keine Buchtexte,
   Buchbezug nur mit Abschnitt oder Abbildung).

## Was nicht dazugehört

Neue Szenen, Akt 2, Code, Quests (nur melden, wenn ein Knoten nicht passt).

## Bericht

**Fertig:** alle neun Ink-Dateien durchgesehen und angepasst; keine Quest- und keine Textänderung
nötig. Prüfungen: `pytest pipeline/tests/test_abenteuer.py` (9 bestanden), Paketbau, Prettier,
Durchspielen aller Knoten (4500 Läufe ohne Fehler, die Spielstände jetzt mit den neuen Namen und
mit „abgebrochen“), `npm run pruefen` (2370 Tests). Dazu eine Simulation des ganzen Akts 1 wie
Oberwelt und `regeln/quests.ts`, mit erster Lektion und Clubkampf zuerst abgebrochen und dann
verloren, Rückfahrt mitten in Cedar Creek, erneuter Hinfahrt mit dem Linienbus und Rückkehr
nach dem Ende: Alle 13 Quests von Maple Falls und Cedar Creek werden fertig.

**1. Umbenannt** in Maple Falls (VAR-Zeilen und alle Verwendungen): `ausgangErsteLektion`,
`ausgangSamRevanche`, `ausgangClubkampf`, `ausgangVictor`, `ausgangSkaterJo` →
`ausgangMapleFalls…`. Kein alter Name ist übrig. Die Dateiköpfe verweisen jetzt auf
`regeln/dialogvariablen.ts` statt auf meinen Vorschlag.

**2. Durchsicht.** Jede Hüllen-Variable ist in jeder Datei, die sie liest, mit dem richtigen
Startwert deklariert („“, false, 0); keine Datei setzt eine Hüllen-Variable selbst; keine
Variable hat in zwei Dateien verschiedene Startwerte. Entfernt, weil die Datei sie nicht braucht:
`ambroseVertrauen` (CC-bibliothek), `held` (CC-waschsalon, MF-aussen), `junoGetroffen`
(MF-clubraum), dazu ganz `okaforBittetHilfe` und `plakatGesehen` (gesetzt, aber nirgends
gelesen). Nachgebessert, weil die Hülle jetzt auch „abgebrochen“ setzt: An sieben Stellen hätte
ein Abbruch als Sieg oder Niederlage gegolten (Jo und Rosa als Sieg, Victor als Überraschung,
Coach und Okafor als Niederlage, Mama und Juno als „erste Partie gespielt“). Jetzt zählt
„abgebrochen“ überall wie nicht gespielt (Regelwerk R35), die Figur bietet die Partie wieder an.
Hinweis: Für die Quests macht die Oberwelt aus „abgebrochen“ eine Niederlage; „Das Brett“ ist
nach einem Abbruch also erledigt, Ambrose bietet die erste Lektion aber noch einmal an, und erst
danach kommt das Nachgespräch. Das ist stimmig, nur doppelt gezählt wird nichts.

**Verzeichnis aller Dialogvariablen** (MF = maple-falls-, CC = cedar-creek-; zum Übernehmen ins
Regelwerk):

| Variable                        | Typ, Start             | Setzt                                           | Liest                                                                                  | Bedeutung                                                                                                      |
| ------------------------------- | ---------------------- | ----------------------------------------------- | -------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `ausgangCedarCreekClubkampf`    | Text, `""`             | Hülle                                           | CC-bibliothek                                                                          | Ausgang der Begegnung: "" nicht gespielt, sieg, remis, niederlage, abgebrochen (zählt wie nicht gespielt, R35) |
| `ausgangCedarCreekRosaDuell`    | Text, `""`             | Hülle                                           | CC-aussen                                                                              | Ausgang der Begegnung: "" nicht gespielt, sieg, remis, niederlage, abgebrochen (zählt wie nicht gespielt, R35) |
| `ausgangMapleFallsClubkampf`    | Text, `""`             | Hülle                                           | MF-clubraum                                                                            | Ausgang der Begegnung: "" nicht gespielt, sieg, remis, niederlage, abgebrochen (zählt wie nicht gespielt, R35) |
| `ausgangMapleFallsErsteLektion` | Text, `""`             | Hülle                                           | MF-aussen, MF-dachboden, MF-wohnzimmer                                                 | Ausgang der Begegnung: "" nicht gespielt, sieg, remis, niederlage, abgebrochen (zählt wie nicht gespielt, R35) |
| `ausgangMapleFallsSamRevanche`  | Text, `""`             | Hülle                                           | MF-clubraum                                                                            | Ausgang der Begegnung: "" nicht gespielt, sieg, remis, niederlage, abgebrochen (zählt wie nicht gespielt, R35) |
| `ausgangMapleFallsSkaterJo`     | Text, `""`             | Hülle                                           | MF-park                                                                                | Ausgang der Begegnung: "" nicht gespielt, sieg, remis, niederlage, abgebrochen (zählt wie nicht gespielt, R35) |
| `ausgangMapleFallsVictor`       | Text, `""`             | Hülle                                           | MF-clubraum                                                                            | Ausgang der Begegnung: "" nicht gespielt, sieg, remis, niederlage, abgebrochen (zählt wie nicht gespielt, R35) |
| `erinnerungNewYorkBestanden`    | Wahrheitswert, `false` | Hülle                                           | CC-archiv                                                                              | Runde bestanden (nicht bestanden ändert nichts)                                                                |
| `nadelCedarCreek`               | Zahl, `0`              | Hülle                                           | CC-archiv, CC-aussen, CC-bibliothek                                                    | beste Clubnadel: 0 keine, 1 Bronze, 2 Silber, 3 Gold                                                           |
| `nadelMapleFalls`               | Zahl, `0`              | Hülle                                           | MF-aussen, MF-clubraum, MF-dachboden, MF-wohnzimmer                                    | beste Clubnadel: 0 keine, 1 Bronze, 2 Silber, 3 Gold                                                           |
| `parkbankRaetselBestanden`      | Wahrheitswert, `false` | Hülle                                           | MF-park                                                                                | Runde bestanden (nicht bestanden ändert nichts)                                                                |
| `reiheDexBestanden`             | Wahrheitswert, `false` | Hülle                                           | CC-bibliothek                                                                          | Runde bestanden (nicht bestanden ändert nichts)                                                                |
| `reiheJunoBestanden`            | Wahrheitswert, `false` | Hülle                                           | MF-clubraum, MF-dachboden                                                              | Runde bestanden (nicht bestanden ändert nichts)                                                                |
| `reiheMaeBestanden`             | Wahrheitswert, `false` | Hülle                                           | CC-bibliothek                                                                          | Runde bestanden (nicht bestanden ändert nichts)                                                                |
| `reiheSamBestanden`             | Wahrheitswert, `false` | Hülle                                           | MF-clubraum, MF-dachboden                                                              | Runde bestanden (nicht bestanden ändert nichts)                                                                |
| `springerLilyBestanden`         | Wahrheitswert, `false` | Hülle                                           | MF-aussen                                                                              | Runde bestanden (nicht bestanden ändert nichts)                                                                |
| `todsuendenBestanden`           | Wahrheitswert, `false` | Hülle                                           | MF-clubraum                                                                            | Runde bestanden (nicht bestanden ändert nichts)                                                                |
| `trocknerStellungBestanden`     | Wahrheitswert, `false` | Hülle                                           | CC-waschsalon                                                                          | Runde bestanden (nicht bestanden ändert nichts)                                                                |
| `abernathyBrief`                | Wahrheitswert, `false` | MF-park                                         | MF-park                                                                                | Merker der Szene (gesehen, getroffen, erledigt)                                                                |
| `abernathyGetroffen`            | Wahrheitswert, `false` | MF-park                                         | MF-park                                                                                | Merker der Szene (gesehen, getroffen, erledigt)                                                                |
| `ambroseVertrauen`              | Zahl, `0`              | CC-archiv, CC-aussen, MF-clubraum, MF-dachboden | CC-archiv, CC-aussen, MF-clubraum, MF-dachboden                                        | Zähler für Ambroses Vertrauen (für spätere Akte)                                                               |
| `ankunftCedarCreekGesehen`      | Wahrheitswert, `false` | CC-aussen                                       | CC-aussen, MF-park                                                                     | Merker der Szene (gesehen, getroffen, erledigt)                                                                |
| `ankunftGesehen`                | Wahrheitswert, `false` | MF-wohnzimmer                                   | MF-wohnzimmer                                                                          | Merker der Szene (gesehen, getroffen, erledigt)                                                                |
| `archivGeordnet`                | Wahrheitswert, `false` | CC-archiv                                       | CC-archiv, CC-bibliothek                                                               | Merker der Szene (gesehen, getroffen, erledigt)                                                                |
| `aufbruchGesehen`               | Wahrheitswert, `false` | MF-wohnzimmer                                   | MF-park, MF-wohnzimmer                                                                 | Merker der Szene (gesehen, getroffen, erledigt)                                                                |
| `boatengGetroffen`              | Wahrheitswert, `false` | CC-waschsalon                                   | CC-waschsalon                                                                          | Merker der Szene (gesehen, getroffen, erledigt)                                                                |
| `boatengLagos`                  | Wahrheitswert, `false` | CC-waschsalon                                   | CC-waschsalon                                                                          | Merker der Szene (gesehen, getroffen, erledigt)                                                                |
| `brettBeruehrt`                 | Wahrheitswert, `false` | MF-dachboden                                    | MF-dachboden, MF-wohnzimmer                                                            | Merker der Szene (gesehen, getroffen, erledigt)                                                                |
| `clubBeigetreten`               | Wahrheitswert, `false` | MF-clubraum                                     | MF-aussen, MF-clubraum, MF-dachboden                                                   | Merker der Szene (gesehen, getroffen, erledigt)                                                                |
| `clubkampfBesprochen`           | Zahl, `0`              | MF-clubraum                                     | MF-clubraum                                                                            | zuletzt gewürdigte Nadel in Maple Falls (Nachgespräch einmal je Verbesserung)                                  |
| `clubkampfCedarCreekBesprochen` | Zahl, `0`              | CC-bibliothek                                   | CC-bibliothek                                                                          | dasselbe für Cedar Creek                                                                                       |
| `dexGetroffen`                  | Wahrheitswert, `false` | CC-bibliothek                                   | CC-bibliothek                                                                          | Merker der Szene (gesehen, getroffen, erledigt)                                                                |
| `endeAkt1Gesehen`               | Wahrheitswert, `false` | CC-aussen                                       | CC-aussen, MF-dachboden                                                                | Ende von Akt 1 am Steg gesehen                                                                                 |
| `ersteLektionBesprochen`        | Wahrheitswert, `false` | MF-dachboden                                    | MF-dachboden                                                                           | Merker der Szene (gesehen, getroffen, erledigt)                                                                |
| `ersterAbendGesehen`            | Wahrheitswert, `false` | MF-wohnzimmer                                   | MF-wohnzimmer                                                                          | Merker der Szene (gesehen, getroffen, erledigt)                                                                |
| `erzaehlung1858Gesehen`         | Wahrheitswert, `false` | CC-archiv                                       | CC-archiv, CC-bibliothek                                                               | Merker der Szene (gesehen, getroffen, erledigt)                                                                |
| `held`                          | Text, `"Du"`           | Hülle (Spielstand)                              | CC-archiv, CC-aussen, CC-bibliothek, MF-clubraum, MF-dachboden, MF-park, MF-wohnzimmer | Name des Helden (setzt die Hülle aus dem Spielstand, nur gelesen)                                              |
| `joGetroffen`                   | Wahrheitswert, `false` | MF-park                                         | MF-park                                                                                | Merker der Szene (gesehen, getroffen, erledigt)                                                                |
| `junoGetroffen`                 | Wahrheitswert, `false` | MF-aussen                                       | MF-aussen                                                                              | Merker der Szene (gesehen, getroffen, erledigt)                                                                |
| `kenntHale`                     | Wahrheitswert, `false` | MF-clubraum                                     | CC-archiv, MF-clubraum, MF-dachboden, MF-wohnzimmer                                    | Victor-Szene gesehen, der Name Hale ist gefallen                                                               |
| `lilyGeholfen`                  | Wahrheitswert, `false` | MF-aussen                                       | MF-aussen                                                                              | Merker der Szene (gesehen, getroffen, erledigt)                                                                |
| `lilyGetroffen`                 | Wahrheitswert, `false` | MF-aussen                                       | MF-aussen                                                                              | Merker der Szene (gesehen, getroffen, erledigt)                                                                |
| `maeEingeladen`                 | Wahrheitswert, `false` | CC-bibliothek                                   | CC-aussen, CC-bibliothek                                                               | Merker der Szene (gesehen, getroffen, erledigt)                                                                |
| `maeGetroffen`                  | Wahrheitswert, `false` | CC-bibliothek                                   | CC-bibliothek                                                                          | Merker der Szene (gesehen, getroffen, erledigt)                                                                |
| `okaforGetroffen`               | Wahrheitswert, `false` | CC-bibliothek                                   | CC-archiv, CC-bibliothek                                                               | Merker der Szene (gesehen, getroffen, erledigt)                                                                |
| `parkbankBrettGefunden`         | Wahrheitswert, `false` | MF-park                                         | MF-park                                                                                | Merker der Szene (gesehen, getroffen, erledigt)                                                                |
| `rosaGetroffen`                 | Wahrheitswert, `false` | CC-aussen                                       | CC-aussen                                                                              | Merker der Szene (gesehen, getroffen, erledigt)                                                                |
| `samGetroffen`                  | Wahrheitswert, `false` | MF-clubraum                                     | MF-clubraum                                                                            | Merker der Szene (gesehen, getroffen, erledigt)                                                                |
| `samKlagt`                      | Wahrheitswert, `false` | MF-clubraum                                     | MF-clubraum                                                                            | Merker der Szene (gesehen, getroffen, erledigt)                                                                |
| `samVersoehnt`                  | Wahrheitswert, `false` | MF-clubraum                                     | MF-clubraum                                                                            | Merker der Szene (gesehen, getroffen, erledigt)                                                                |
| `sternennachtGesehen`           | Wahrheitswert, `false` | CC-aussen                                       | CC-aussen, CC-bibliothek                                                               | Merker der Szene (gesehen, getroffen, erledigt)                                                                |
| `victorCedarCreekGesehen`       | Wahrheitswert, `false` | CC-aussen                                       | CC-aussen                                                                              | Merker der Szene (gesehen, getroffen, erledigt)                                                                |
| `victorGesehen`                 | Wahrheitswert, `false` | MF-clubraum                                     | MF-clubraum                                                                            | Merker der Szene (gesehen, getroffen, erledigt)                                                                |
| `victorUeberrascht`             | Zahl, `0`              | MF-clubraum                                     | MF-clubraum                                                                            | 1, wenn Victors Trainingsstellung nicht verloren ging (R33)                                                    |

**3. Ankunft und Rückfahrt.** Hin: Die Ankunft in Cedar Creek läuft beim ersten Gespräch draußen;
die Quest wartet auf das Betreten der Bibliothek. Zurück: `bus_zurueck` fährt zu jeder Zeit nach
Maple Falls (Park, Auslöser `bushaltestelle`); keine Quest wartet auf die Ankunft dort, offene
Quests in Cedar Creek bleiben offen und laufen nach der nächsten Hinfahrt weiter (in der
Simulation geprüft). Neu: Die Haltestelle im Park zeigt nach der ersten Fahrt den Linienbus statt
des wartenden Teams (`ankunftCedarCreekGesehen` dort deklariert); vorher hätte sie nach dem Ende
von Akt 1 noch Coach und Juno im Schulbus gezeigt.

**4. Dachboden:** `ambrose_rat` sagt nach `endeAkt1Gesehen`: „Der Weg führt weiter, aber nicht
heute. Ruh dich aus, {held}.“

**Nachgespräche:** Die Hülle öffnet nach einer Partie oder Runde keinen Dialog von selbst; das
Nachgespräch kommt, wenn man die Figur wieder anspricht. Das ist so gewollt und steht jetzt im
Kopf von `maple-falls-clubraum.ink`.

**Offene Fragen:** keine. Vorschlag wie zuvor: `reise` mit optionalem Ankunftsknoten.

# 17 Mehrsprachigkeit: Das Abenteuer von Anfang an übersetzbar

Stand: 10.11.2026 (Haupt-Chat). Der Autor möchte später eine englische Fassung des Spiels:

> Wenn das Spiel fertig ist, möchte ich eine englische Version. Bei der Programmierung schon daran
> denken, dass sich alle Texte leicht übersetzen lassen, damit wir später nicht viel umbauen müssen.

Alles hier gilt nach Regel 9 als „schon so geplant, Widerspruch genügt“.

## 1. Was schon passt

- **App:** Die Oberfläche der App ist zweisprachig (`app/src/i18n/de.json`, `en.json`, Tests für
  fehlende und unbenutzte Schlüssel).
- **Spieltexte des Abenteuers:** Sie stehen über Schlüssel in `inhalte/abenteuer/texte/de.json`.
  Das Schema nennt schon `en.json` als spätere Schwester.
- **Daten ohne freien Text:** Orte, Funde, Quests, Gegner, Karten, Läden, Begegnungen,
  Vorführungen und Szenen enthalten nur Kennungen und Textschlüssel. Ausnahme sind Notizen für
  Menschen (`beschreibung`, `hinweis`, `tun`), die das Spiel nie zeigt.
- **Dialoge:** Sie liegen je Sprache in einem Ordner (`inhalte/abenteuer/dialoge/de/`).
- **Statisten:** Ihre Sätze laufen über Schlüssel (`statist.<karte>.<name>`, Dokument 16).
- **{held}:** Der Platzhalter für den Namen steht schon überall, und die Sätze sind
  geschlechtsneutral gebaut (Stilregel 5.2). Auf Englisch ist das leichter, nicht schwerer.

## 2. Regeln ab jetzt

1. **Kein sichtbarer Text im Code.**
   - Jede Zeichenkette, die der Spieler sieht, kommt aus einer Textdatei. Das gilt auch für
     Fehlermeldungen, Knöpfe und Zahlenformate.
   - Zahlen und Daten über `Intl` mit der gewählten Sprache.
2. **Ganze Sätze als ein Schlüssel.**
   - Keine Sätze aus Bruchstücken zusammensetzen (Satzbau und Wortstellung sind in jeder Sprache
     anders).
   - Variable Teile als Platzhalter: `{name}`, `{anzahl}`.
   - Mehrzahl über eigene Schlüssel (`….eins`, `….mehr`) oder `Intl.PluralRules`.
3. **Schlüssel sind sprachfrei und stabil.**
   - Ein Schlüssel nennt die Stelle, nicht den Wortlaut (`statist.riverton.aussen.taubenmann`,
     nicht `satz.siebzehnTauben`).
   - Umbenennen nur mit Grund, weil jede Sprache mitzieht.
4. **Dialoge in Ink je Sprache.**
   - Knoten, Variablen, Tags und externe Funktionen sind in allen Sprachen gleich; nur der Text
     unterscheidet sich.
   - Die Logik (Bedingungen, Belohnungen) steht nicht doppelt: Was sich nicht übersetzt, gehört in
     Tags oder Funktionen, nicht in Text.
5. **Schrift in Bildern ist Englisch.**
   - Das Spiel spielt in den USA, also sind Schilder, Plakate und Fassaden englisch beschriftet
     („STORE“, „BANK“, „COMING SOON“, „YARD SALE“).
   - So muss kein Bild übersetzt werden, und die Welt wirkt stimmig.
   - Was der Spieler verstehen muss, steht zusätzlich im Text (Auslöser „Ansehen“ mit Schlüssel).
   - Deutsche Schrift in eigenen Bildern wird ersetzt.
6. **Schach in der Sprache des Lesers.**
   - Züge erscheinen über `sanInSprache` (deutsch: S, L, T, D; englisch: N, B, R, Q).
   - Die Daten (Vorführungen, Aufgaben) speichern SAN englisch, wie jetzt schon.
7. **Buchbezüge** nennen Kapitel und Abschnitt, keine Seitenzahl. Die englische Fassung des Buchs
   hat andere Seiten.
8. **Namen von Orten und Figuren** sind englisch oder neutral (Maple Falls, Riverton, Odette Finch)
   und bleiben in beiden Sprachen gleich. Übersetzt werden Gattungsnamen in Texten („der
   Bergladen“ → „the mountain shop“).

## 3. Was dafür umgebaut wird (Runde 7, mittel-2)

1. **Sprache wählbar:**
   - Das Abenteuer lädt `texte/<sprache>.json` und `dialoge/<sprache>/` nach der Sprache der App.
   - Fehlt die Sprache, nimmt es Deutsch.
   - Heute steht die Sprache fest: `oberwelt/weltdaten.ts` (`SPRACHE = "de"`), `texte/texte.ts`
     (fester Import von `de.json`) und der Paketbau (`app/skripte/baue-abenteuerpaket.mjs`, nur
     `de`).
2. **Paketbau:** Er nimmt alle vorhandenen Sprachen mit. Eine Prüfung meldet Schlüssel, die in
   einer weiteren Sprache fehlen (wie `doppelt.test.ts` und `ungenutzt.test.ts` der App).
3. **Sichtbare Meldungen** des Abenteuers laufen über Schlüssel, etwa die Fehler beim Laden des
   Pakets.
4. **Prüfung im Test:** Daten des Abenteuers (`inhalte/abenteuer/*.json` außer `texte/`) enthalten
   keine Zeichenkette, die nach Satz aussieht, außer in den Notizfeldern.

**Umgesetzt (mittel-2, 10.11.2026):**

- `texte/texte.ts` lädt mit `ladeSpieltexte(sprache)` die Datei `texte/<sprache>.json` aus dem Paket
  (Aufruf in `ladeWelt` mit der Sprache der App). Fehlt die Datei, bleibt alles Deutsch; fehlt nur
  ein Schlüssel, kommt dieser auf Deutsch. Dialoge lädt `ladeDialog` aus `dialoge/<sprache>/`,
  sonst aus `dialoge/de/`.
- Der Paketbau nimmt alle `texte/*.json` und alle Ordner unter `dialoge/` mit.
- `src/abenteuer/texte/uebersetzung.test.ts` prüft jede weitere Sprache gegen `de.json`: unbekannte
  Schlüssel und abweichende Platzhalter sind Fehler; fehlende Schlüssel erst, wenn die Sprache in
  `FERTIGE_SPRACHEN` steht. Eine `en.json` liegt bewusst noch nicht im Repository, damit das Spiel
  nicht halb englisch wird; der Rückfall ist im Test mit Testtexten geprüft.
- Fehler des Paketladers und der Weltdaten sind `Spielfehler` mit Schlüssel (`fehler.paket.*`,
  `fehler.welt.*`); die Oberwelt zeigt sie über `fehlertext`.
- `pipeline/tests/test_abenteuer_ohne_saetze.py` sucht satzartige Zeichenketten in den Daten.
  Ausgenommen: Notizfelder (`beschreibung`, `hinweis`, `tun`, `erklaerung`), Partieangaben
  (`partie`, `quelle`, `fen`, `pgn`, `eroeffnungen`, `wert`) und die Bauhilfen des Kartenbauers
  (`ortsprofile.json`, `materialien.json`, `katalog_korrekturen/`, `moebel/`).

## 4. Eigene Bilder mit deutscher Schrift (werden ersetzt)

| Bild                             | heute                                          | neu                                          |
| -------------------------------- | ---------------------------------------------- | -------------------------------------------- |
| `plakat_bald.png`                | BALD                                           | COMING SOON                                  |
| `plakat_flohmarkt.png`           | FLOHMARKT SA                                   | YARD SALE SAT                                |
| `plakat_diplomtag.png`           | DIPLOM-TAG                                     | CHESS DIPLOMA DAY                            |
| `plakat_20juli.png`              | 20. JULI                                       | JULY 20                                      |
| `funkmast_testfeld.png`          | TESTFELD SIGNAL                                | SIGNAL TEST SITE                             |
| Schilder aus `schilder.py` u. a. | TURNHALLE, ZUR SCHLEUSE, SEILBAHN, BERGLADEN … | GYM, TO THE LOCK, CABLE CAR, MOUNTAIN SHOP … |

Die genaue Liste ermittelt der Zeichenauftrag, der alle Bilder in `spiel/eigene/` auf Schrift
durchsucht.

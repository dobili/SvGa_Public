# `speicher/` – Nutzerdaten auf dem Gerät

Alles, was der Leser selbst erarbeitet, steht in einem Objekt mit Formatversion (Konzept 4.7, 6.4,
9.4) in IndexedDB. Merker im `localStorage` (`app/merker.ts`) bleiben nur für Bequemlichkeiten.

| Datei           | Aufgabe                                                                |
| --------------- | ---------------------------------------------------------------------- |
| `format.ts`     | Aufbau der Nutzerdaten, leere Daten, Umwandlung älterer Formate (rein) |
| `datenbank.ts`  | IndexedDB: ein Eintrag „aktuell“, Unlesbares wird aufgehoben           |
| `speicher.ts`   | lade, speichere, aendere, bitteUmDauerhaftenSpeicher, useSpeicher      |
| `testhilfen.ts` | Nur für Tests: fake-indexeddb und Gerätespeicher in Node               |

Neue Teile der Nutzerdaten (Karten, Fehlerdatenbank, Lernsammlung, Partien) erhöhen
`SCHEMA_VERSION` und ergänzen `wandleUm` samt Test für das alte Format.

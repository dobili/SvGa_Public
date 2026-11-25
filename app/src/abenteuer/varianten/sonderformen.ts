/**
 * Meldet die Sonderformen Nebel, Ente und Tandem bei der Variantenschnittstelle an
 * (spiel/varianten/variante.ts, Importzeile in spiel/varianten/alle.ts).
 *
 * Warum: Speicher, Begegnungen und Hülle kennen eine Variante nur, wenn sie angemeldet ist. Alle
 * drei spielen in der eigenen Partie (`ablauf: "eigene_partie"`, Komponenten in
 * Variantenpartien.tsx); die Regelschichten hier dienen Prüfungen und dem Speicher.
 * Abhängigkeiten: regelschichten.ts, spiel/varianten (Anmeldung, Regelschicht für Crazyhouse).
 */
import { chessopsRegeln } from "../../spiel/varianten/regelschicht";
import {
  registriereVariante,
  varianteVon,
  type Variantendefinition,
} from "../../spiel/varianten/variante";
import { ENTENREGELN, NEBELREGELN } from "./regelschichten";

/** Die drei Sonderformen (Kennungen wie in begegnungen.json). */
export const SONDERFORMEN: readonly Variantendefinition[] = [
  {
    kennung: "nebel",
    art: "sonderform",
    name: "variante.nebel.name",
    regeln: NEBELREGELN,
    engine: { engine: "stockfish" },
    ablauf: "eigene_partie",
  },
  {
    kennung: "ente",
    art: "sonderform",
    name: "variante.ente.name",
    regeln: ENTENREGELN,
    engine: { engine: "fairy", uciVariante: "duck" },
    ablauf: "eigene_partie",
  },
  {
    kennung: "tandem",
    art: "sonderform",
    name: "variante.tandem.name",
    // Regeln je Brett: Crazyhouse; Übergabe an den Partner und Takt führt tandem.ts.
    regeln: chessopsRegeln("crazyhouse", "tandem"),
    engine: { engine: "fairy", uciVariante: "crazyhouse" },
    ablauf: "eigene_partie",
  },
];

for (const v of SONDERFORMEN) if (!varianteVon(v.kennung)) registriereVariante(v);

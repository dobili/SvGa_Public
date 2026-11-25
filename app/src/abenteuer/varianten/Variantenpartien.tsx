/**
 * Die Partiekomponenten der Sonderformen für die Spielhülle (anbindung/variantenpartien.ts):
 * übersetzen die Werte der Hülle (Auftrag, Stärke, Farbe, beiEnde) in die Umgebung der
 * Brettansichten und melden Nebel, Ente und Tandem an.
 *
 * Warum: Die Hülle zeigt bei `ablauf: "eigene_partie"` die angemeldete Komponente an Stelle ihres
 * Bretts und übernimmt Rahmen, Porträt, Ergebnis, „danach“ und Belohnung (Schnittstelle von
 * mittel-3, docs/spiel/auftraege/varianten_schnittstelle_26-11.md).
 * Abhängigkeiten: Nebelbrett, Entenbrett, Tandembretter, zugbewerter.ts, botwahl.ts, sonderformen.ts.
 */
import {
  registriereVariantenpartie,
  variantenpartie,
  type Variantenpartiewerte,
} from "../anbindung/variantenpartien";
import { Entenbrett } from "./Entenbrett";
import { Nebelbrett } from "./Nebelbrett";
import { SONDERFORMEN } from "./sonderformen";
import { Tandembretter } from "./Tandembretter";
import { umgebungAus } from "./umgebung";
import { fairyZugbewerter, stockfishZugbewerter } from "./zugbewerter";
import "./varianten.css";

const ENTE = SONDERFORMEN.find((v) => v.kennung === "ente")?.engine ?? { engine: "fairy" };
const TANDEM = SONDERFORMEN.find((v) => v.kennung === "tandem")?.engine ?? { engine: "fairy" };

/** Nebelschach in der Hülle (Bot über die gewöhnliche Engine). */
export function Nebelpartie(w: Variantenpartiewerte) {
  return <Nebelbrett u={umgebungAus(w, stockfishZugbewerter())} />;
}

/** Entenschach in der Hülle (Fairy-Stockfish `duck`). */
export function Entenpartie(w: Variantenpartiewerte) {
  return <Entenbrett u={umgebungAus(w, fairyZugbewerter(ENTE))} />;
}

/** Tandem in der Hülle (Fairy-Stockfish `crazyhouse` für alle drei Bots). */
export function Tandempartie(w: Variantenpartiewerte) {
  return <Tandembretter u={umgebungAus(w, fairyZugbewerter(TANDEM))} />;
}

const KOMPONENTEN = { nebel: Nebelpartie, ente: Entenpartie, tandem: Tandempartie } as const;
for (const [kennung, komponente] of Object.entries(KOMPONENTEN)) {
  if (!variantenpartie(kennung)) registriereVariantenpartie(kennung, komponente);
}

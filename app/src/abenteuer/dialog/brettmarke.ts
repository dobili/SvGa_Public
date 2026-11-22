/**
 * Brettbeispiel im Dialog (Wunsch des Autors, 22.11.2026): aus der Marke `#brett:kennung` oder
 * `#brett:kennung.bild` das Beispiel und Bild bestimmen, und aus den Daten die Stellung mit Pfeilen.
 *
 * Warum: Erklärt eine Figur ein Schachkonzept (Gabel, Fesselung, Opposition …), zeigt sie es an einem
 * kleinen Brett. Wie das Großbild (dialog/grossbild.ts) gehört das Brett zur Zeile, die die Marke
 * trägt; „Weiter“ führt zur nächsten Zeile und schließt es, wenn diese keine Marke hat.
 * Daten: inhalte/abenteuer/brettbeispiele.json (im Paket daten/brettbeispiele.json), schachlich
 * geprüft von pipeline/abenteuer/brettbeispiel_pruefung.py.
 * Abhängigkeiten: dialog/geschichte.ts (Tags), training/uebungsaufgabe.ts, schach/weiterspielen.ts.
 */
import type { Markierung } from "../../analyse/werkzeug";
import type { Beispiel } from "../../daten/generiert/abenteuer-brettbeispiele";
import { zugFelder } from "../../schach/weiterspielen";
import { stellungNach } from "../../training/uebungsaufgabe";
import type { Dialogzeile } from "./geschichte";

const MARKE = /^([a-z][a-zA-Z0-9]*)(?:\.(\d+))?$/;

/** Was eine Marke zeigen will. */
export interface Brettmarke {
  readonly kennung: string;
  readonly bild: number;
}

/**
 * Die Marke einer Zeile oder null. Beispiel: `#brett:springergabel` → { springergabel, 0 },
 * `#brett:mamaspiess.2` → { mamaspiess, 2 }. Sonderfälle: `#brett:aus` und Unsinn → null.
 */
export function brettmarke(tags: Dialogzeile["tags"]): Brettmarke | null {
  const wert = tags.brett?.trim() ?? "";
  const treffer = MARKE.exec(wert);
  if (!treffer?.[1] || treffer[1] === "aus") return null;
  return { kennung: treffer[1], bild: Number(treffer[2] ?? 0) };
}

/** Was das Brett zeichnet: Stellung, Pfeile und Felder, der zuletzt gezeigte Zug. */
export interface Brettbild {
  readonly fen: string;
  readonly markierungen: readonly Markierung[];
  readonly letzterZug: { von: string; nach: string } | null;
}

/**
 * Das Bild eines Beispiels: Stellung nach `nach` Zügen, Pfeile und Felder; null, wenn es das Bild
 * nicht gibt. Beispiel: bauerngabel, Bild 1 → Stellung nach d5, Pfeile d5-c6 und d5-e6, Zug d4-d5.
 */
export function brettbild(b: Beispiel, bild: number): Brettbild | null {
  const angabe = b.bilder[bild];
  if (!angabe) return null;
  const zuege = b.zuege.slice(0, angabe.nach);
  const fen = stellungNach(b.fen, zuege);
  const letzter = zuege.at(-1);
  const letzterZug = letzter ? zugFelder(stellungNach(b.fen, zuege.slice(0, -1)), letzter) : null;
  const markierungen: Markierung[] = [
    ...angabe.felder.map((f) => ({ typ: "feld" as const, farbe: f.farbe, feld: f.feld })),
    ...angabe.pfeile.map((p) => ({
      typ: "pfeil" as const,
      farbe: p.farbe,
      von: p.von,
      nach: p.nach,
    })),
  ];
  return { fen, markierungen, letzterZug };
}

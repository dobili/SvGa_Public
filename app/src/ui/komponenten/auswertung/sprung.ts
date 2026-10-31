/**
 * Sprünge aus der Auswertung aufs Brett oben: Stelle in der Partie und Pfeile dort.
 *
 * Rolle im Gesamtbild: Jeder Moment der Zeitleiste, ein Tipp auf die Verlaufskurve und „Zur
 * Stellung“ springen an eine Stelle der Partie (ui/bildschirme/Partie.tsx zeigt sie). Bei einem
 * Fehler zeigt das Brett die Stellung vor dem Zug, den besseren Zug gold und den gespielten rot
 * (wie seit 0.2.38). Ausgelagert aus Auswertung.tsx, weil Zeitleiste und kleine Bretter dieselben
 * Pfeile brauchen.
 * Abhängigkeiten: analyse/werkzeug.ts (Markierung), schach/, spiel/.
 */
import type { Markierung } from "../../../analyse/werkzeug";
import { sprache } from "../../../i18n/sprache";
import { sanInSprache } from "../../../schach/notation";
import { zugFelder } from "../../../schach/weiterspielen";
import { zugnummer } from "../../../spiel/auswertung";
import { stellungen, type Partie } from "../../../spiel/partie";
import type { Partieeintrag } from "../../../speicher/partien";

/** Ein Sprung auf dem Brett: Stelle in der Partie und Markierungen dort. */
export interface Sprung {
  readonly stelle: number;
  readonly marken: readonly Markierung[];
}

/** Der Zug als Text im Buchformat. Beispiel: Index 2 in 1. f3 e5 2. g4 → „2. g4“ (mit „??“). */
export function zugtext(partie: Partie, index: number, zeichen = ""): string {
  const san = partie.zuege[index]?.san ?? "";
  return `${zugnummer(partie, index)} ${sanInSprache(san, sprache())}${zeichen}`;
}

/** Goldener Pfeil für einen Zug in UCI („e2e4“); leer ohne Zug. */
function goldpfeil(uci: string): Markierung[] {
  return uci ? [{ typ: "pfeil", farbe: "gold", von: uci.slice(0, 2), nach: uci.slice(2, 4) }] : [];
}

/**
 * Sprung zu einem Zug: die Stellung davor, gold der bessere Zug, rot der gespielte.
 * Beispiel: 2. g4?? → Stellung nach 1... e5, gold 2. e4 (oder was die Engine fand), rot g2–g4.
 */
export function sprungZu(eintrag: Partieeintrag, index: number): Sprung {
  const fen = stellungen(eintrag.partie)[index] ?? "";
  const gespielt = zugFelder(fen, eintrag.partie.zuege[index]?.san ?? "");
  const marken = goldpfeil(eintrag.beste[index] ?? "");
  if (gespielt) marken.push({ typ: "pfeil", farbe: "rot", ...gespielt });
  return { stelle: index, marken };
}

/**
 * Sprung nach einem Zug: die Stellung danach, gold die beste Antwort. Für die absichtlichen Fehler
 * der Engine: Was hätte der Leser jetzt spielen können?
 */
export function sprungNach(eintrag: Partieeintrag, index: number): Sprung {
  return { stelle: index + 1, marken: goldpfeil(eintrag.beste[index + 1] ?? "") };
}

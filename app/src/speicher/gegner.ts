/**
 * Eigene Gegner des Lesers im Speicher (0.2.42): anlegen, ändern, löschen, aus Rohdaten lesen.
 *
 * Rolle im Gesamtbild: Teil des Spielstands (speicher/partien.ts, `eigeneGegner`). Jeder Gegner
 * hat Name, Stufen je Phase, erlaubte Fehlerarten und Stil (engine/gegner.ts, EigenerGegner).
 * Beim Lesen wird jedes Feld geprüft; was nicht passt, fällt weg oder bekommt die Vorgabe.
 * Abhängigkeiten: engine/gegner.ts, engine/fehlerart.ts, engine/stufen.ts, engine/stil.ts.
 */
import { BLINDE_FLECKEN, type BlinderFleck } from "../engine/blindeFlecken";
import { FEHLERARTEN, type Fehlerart } from "../engine/fehlerart";
import type { EigenerGegner } from "../engine/gegner";
import { istPortraetwahl } from "../engine/portraetwahl";
import { menschenwerteAus } from "./menschenwerte";
import { STIL_MAX, STIL_MIN, STIL_NEUTRAL } from "../engine/stil";
import type { Stufennummer } from "../engine/stufen";
import type { Phase } from "../schach/phase";

/** Höchstens so viele eigene Gegner. */
export const MAX_EIGENE_GEGNER = 20;
/** Namen werden auf diese Länge gekürzt. */
export const MAX_NAMENSLAENGE = 24;
const STUFENNUMMERN: readonly Stufennummer[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

type Roh = Record<string, unknown>;

function istObjekt(wert: unknown): wert is Roh {
  return typeof wert === "object" && wert !== null;
}

function stufeAus(wert: unknown): Stufennummer {
  return STUFENNUMMERN.find((n) => n === wert) ?? 1;
}

function stufenAus(roh: unknown): Readonly<Record<Phase, Stufennummer>> {
  const r = istObjekt(roh) ? roh : {};
  return {
    eroeffnung: stufeAus(r.eroeffnung),
    mittelspiel: stufeAus(r.mittelspiel),
    endspiel: stufeAus(r.endspiel),
  };
}

/** Fehlerarten aus Rohdaten; ohne Liste alle (auch für die Abhakliste der Vorlieben, 0.2.60). */
export function fehlerartenAus(roh: unknown): readonly Fehlerart[] {
  if (!Array.isArray(roh)) return FEHLERARTEN;
  return FEHLERARTEN.filter((art) => roh.includes(art));
}

/** Blinde Flecken aus Rohdaten; ohne Angabe keine. */
export function blindeFleckenAus(roh: unknown): readonly BlinderFleck[] {
  if (!Array.isArray(roh)) return [];
  return BLINDE_FLECKEN.filter((fleck) => roh.includes(fleck));
}

function stilAus(roh: unknown): number {
  if (typeof roh !== "number" || !Number.isFinite(roh)) return STIL_NEUTRAL;
  return Math.max(STIL_MIN, Math.min(STIL_MAX, Math.round(roh)));
}

/** Ein eigener Gegner aus Rohdaten; null ohne Kennung oder Name. */
export function eigenerGegnerAus(roh: unknown): EigenerGegner | null {
  if (!istObjekt(roh) || typeof roh.kennung !== "string" || typeof roh.name !== "string") {
    return null;
  }
  const name = roh.name.trim().slice(0, MAX_NAMENSLAENGE);
  if (!name) return null;
  return {
    kennung: roh.kennung,
    name,
    stufenJePhase: stufenAus(roh.stufenJePhase),
    fehlerarten: fehlerartenAus(roh.fehlerarten),
    stil: stilAus(roh.stil),
    blindeFlecken: blindeFleckenAus(roh.blindeFlecken),
    // Porträt nur aus der Liste zur Wahl (0.2.99); ältere Gegner und Unbekanntes ohne Porträt.
    ...(istPortraetwahl(roh.portraet) ? { portraet: roh.portraet } : {}),
    // Erweiterter Modus (0.2.117), nur wenn gespeichert.
    ...menschenwerteAus(roh),
  };
}

/** Alle eigenen Gegner aus Rohdaten, höchstens MAX_EIGENE_GEGNER. */
export function eigeneGegnerAus(roh: unknown): readonly EigenerGegner[] {
  if (!Array.isArray(roh)) return [];
  return roh
    .map(eigenerGegnerAus)
    .filter((g): g is EigenerGegner => g !== null)
    .slice(0, MAX_EIGENE_GEGNER);
}

/**
 * Fügt einen Gegner hinzu oder ersetzt den mit derselben Kennung. Ist die Liste voll, bleibt sie
 * unverändert. Beispiel: „Rambo“ (Stufen 3 · 4 · 3, Stil +2) anlegen → am Ende der Liste.
 */
export function mitEigenemGegner(
  liste: readonly EigenerGegner[],
  gegner: EigenerGegner,
): readonly EigenerGegner[] {
  const stelle = liste.findIndex((g) => g.kennung === gegner.kennung);
  if (stelle >= 0) return liste.map((g, i) => (i === stelle ? gegner : g));
  if (liste.length >= MAX_EIGENE_GEGNER) return liste;
  return [...liste, gegner];
}

/** Löscht den Gegner mit dieser Kennung; gespielte Partien behalten seinen Namen. */
export function ohneEigenenGegner(
  liste: readonly EigenerGegner[],
  kennung: string,
): readonly EigenerGegner[] {
  return liste.filter((g) => g.kennung !== kennung);
}

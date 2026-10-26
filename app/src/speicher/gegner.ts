/**
 * Eigene Gegner des Lesers im Speicher: anlegen, ändern, löschen, aus Rohdaten lesen.
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
import { gebautesPortraetAus } from "./profil";
import { REGLERARTEN, reglerstufeAus, type Reglerstufen } from "../engine/eigenstufen";
import { GEGENUEBER, STILNAMEN, STILPROZENTE, type Stilmix, type Stilname } from "../engine/stile";
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

/** Die Fehlerarten, die seit 0.2.118 dazukamen (Auswertung von Lichess-Partien). */
const NEUE_ARTEN: readonly Fehlerart[] = [
  "bauerEingestellt",
  "schlagVerpasst",
  "bauernzugOhneNot",
  "koenigszugOhneNot",
];

/**
 * Fehlerarten aus Rohdaten; ohne Liste alle (auch für die Abhakliste der Vorlieben, 0.2.60).
 * Seit 0.2.118: Enthält eine gespeicherte Liste alle Arten von vor 0.2.118, hatte der Leser nichts
 * abgehakt; dann gelten auch die neuen Arten als erlaubt (sonst machte sein Gegner sie nie).
 */
export function fehlerartenAus(roh: unknown): readonly Fehlerart[] {
  if (!Array.isArray(roh)) return FEHLERARTEN;
  const alteVollstaendig = FEHLERARTEN.filter((a) => !NEUE_ARTEN.includes(a)).every((a) =>
    roh.includes(a),
  );
  return FEHLERARTEN.filter(
    (art) => roh.includes(art) || (alteVollstaendig && NEUE_ARTEN.includes(art)),
  );
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
/** Einer der sieben Stile (engine/stile.ts) aus Rohdaten, sonst undefined (seit 0.2.126). */
export function stilnameAus(wert: unknown): Stilname | undefined {
  return STILNAMEN.find((n) => n === wert);
}

/** Stufen −4 bis 4 je Fehlerart und Fleck (seit 0.2.126); undefined ohne gültige Angabe. */
export function reglerstufenAus(roh: unknown): Reglerstufen | undefined {
  if (!istObjekt(roh) || Array.isArray(roh)) return undefined;
  const aus: Partial<Record<(typeof REGLERARTEN)[number], number>> = {};
  for (const art of REGLERARTEN) {
    const stufe = reglerstufeAus(roh[art]);
    if (stufe !== undefined) aus[art] = stufe;
  }
  return aus;
}

/**
 * Eine Stil-Mischung aus Rohdaten (0.2.128): nur bekannte Stile mit 50, 75, 100 oder 125 %, je
 * Achse der erste; sonst undefined.
 */
export function stilmixAus(roh: unknown): Stilmix | undefined {
  if (!istObjekt(roh) || Array.isArray(roh)) return undefined;
  let mix: Stilmix = {};
  for (const stil of STILNAMEN) {
    if (stil === "universell") continue;
    const prozent = roh[stil];
    const erlaubt = (STILPROZENTE as readonly unknown[]).includes(prozent);
    if (erlaubt && mix[GEGENUEBER[stil]] === undefined) mix = { ...mix, [stil]: prozent as number };
  }
  return mix;
}

/** Stil, Stil-Mischung und Reglerstufen eines Rohobjekts, nur die vorhandenen. */
function teilEAus(roh: Roh): Pick<EigenerGegner, "stilname" | "reglerstufen" | "stilmix"> {
  const stilname = stilnameAus(roh.stilname);
  const stilmix = stilmixAus(roh.stilmix);
  const reglerstufen = reglerstufenAus(roh.reglerstufen);
  return {
    ...(stilname ? { stilname } : {}),
    ...(stilmix ? { stilmix } : {}),
    ...(reglerstufen ? { reglerstufen } : {}),
  };
}

function portraetBauAus(roh: unknown): Pick<EigenerGegner, "portraetBau"> {
  const gebaut = gebautesPortraetAus(roh);
  return gebaut ? { portraetBau: gebaut } : {};
}

/**
 * Liest einen selbst angelegten Gegner aus den gespeicherten Daten und prüft jedes Feld; ohne
 * Kennung oder Namen gibt es keinen Gegner.
 */
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
    // Seit 0.2.140 auch ein selbst gebautes Porträt (gleiche Prüfung wie im Profil).
    ...portraetBauAus(roh.portraetBau),
    // Erweiterter Modus (0.2.117), nur wenn gespeichert.
    ...menschenwerteAus(roh),
    // Teil E (0.2.126): Stil und Reglerstufen, nur wenn gespeichert.
    ...teilEAus(roh),
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

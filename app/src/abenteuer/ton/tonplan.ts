/**
 * Was im Abenteuer klingen soll: Musik und Dauergeräusch je Karte, Wechsel durch Dialogmarken,
 * einmalige Geräusche, Lautstärken. Reine Logik ohne Web Audio (Atmosphäre T1 und T2,
 * docs/spiel/23_Technik_Atmosphaere.md).
 *
 * Rolle im Gesamtbild: ton/tonregie.ts wendet diese Regeln an und lässt ton/tonspieler.ts spielen.
 * Hier steht nur, was laufen soll; ob eine Datei existiert, weiß diese Datei nicht (fehlt sie,
 * bleibt es still).
 * Abhängigkeiten: speicher/format.ts (nur der Typ der Einstellung).
 *
 * Marken im Dialog (inhalte/abenteuer/README.md):
 * - `#musik:kennung` wechselt die Musik für die Szene, `#musik:aus` blendet sie aus,
 *   `#musik:karte` kehrt zur Musik der Karte zurück, `#musik:bleibt` behält die Musik der Szene
 *   über das Ende des Dialogs und den nächsten Kartenwechsel.
 * - `#geraeusch:kennung` und `#geraeusch:aus` für ein Dauergeräusch der Szene.
 * - `#klang:kennung` spielt ein Geräusch einmal.
 * Je Zeile zählt eine Marke jeder Art (von gleichnamigen gilt die letzte, dialog/geschichte.ts);
 * `#musik:bleibt` steht deshalb in einer eigenen Zeile nach dem Wechsel.
 */

import type { Abenteuerton } from "../../speicher/format";

export type { Abenteuerton } from "../../speicher/format";
export { STANDARD_ABENTEUERTON } from "../../speicher/format";

/** Ein Befehl aus einer Dialogmarke. */
export type Tonbefehl =
  | { readonly art: "musik"; readonly kennung: string }
  | { readonly art: "musikAus" }
  | { readonly art: "musikKarte" }
  | { readonly art: "musikBleibt" }
  | { readonly art: "geraeusch"; readonly kennung: string }
  | { readonly art: "geraeuschAus" }
  | { readonly art: "klang"; readonly kennung: string };

/**
 * Die Lage: Vorgabe der Karte und, wenn ein Dialog sie geändert hat, die der Szene.
 * `undefined` heißt „keine Vorgabe der Szene“, `null` heißt „Stille“.
 */
export interface Tonlage {
  readonly karteMusik: string | null;
  readonly karteGeraeusch: string | null;
  readonly szeneMusik?: string | null;
  readonly szeneGeraeusch?: string | null;
  /** Die Musik der Szene gilt über Dialogende und Kartenwechsel (`#musik:bleibt`). */
  readonly bleibt: boolean;
}

/** Was gerade klingen soll: Kennung oder Pfad je Spur, null für Stille. */
export interface Tonsoll {
  readonly musik: string | null;
  readonly geraeusch: string | null;
}

export const STILLE_LAGE: Tonlage = { karteMusik: null, karteGeraeusch: null, bleibt: false };

const AUS = "aus";

/**
 * Die Tonbefehle aus den Marken einer Dialogzeile, in fester Reihenfolge (Musik, Geräusch, Klang).
 * Beispiel: `#sprecher:ambrose #musik:aus #klang:glocke` → [musikAus, klang „glocke“].
 * Sonderfall: Leere Werte und Marken ohne Wert („#musik“) zählen nicht.
 */
export function befehleAus(tags: Readonly<Record<string, string>>): Tonbefehl[] {
  const befehle: Tonbefehl[] = [];
  const musik = wert(tags.musik);
  if (musik === AUS) befehle.push({ art: "musikAus" });
  else if (musik === "karte") befehle.push({ art: "musikKarte" });
  else if (musik === "bleibt") befehle.push({ art: "musikBleibt" });
  else if (musik) befehle.push({ art: "musik", kennung: musik });
  const geraeusch = wert(tags.geraeusch);
  if (geraeusch === AUS) befehle.push({ art: "geraeuschAus" });
  else if (geraeusch) befehle.push({ art: "geraeusch", kennung: geraeusch });
  const klang = wert(tags.klang);
  if (klang) befehle.push({ art: "klang", kennung: klang });
  return befehle;
}

/** Ein Markenwert oder null (fehlend, leer, „ja“ ohne Doppelpunkt). */
function wert(roh: string | undefined): string | null {
  const w = roh?.trim() ?? "";
  return w === "" || w === "ja" ? null : w;
}

/** Wendet einen Befehl auf die Lage an (Klänge ändern die Lage nicht). */
export function wende(lage: Tonlage, befehl: Tonbefehl): Tonlage {
  switch (befehl.art) {
    case "musik":
      return { ...lage, szeneMusik: befehl.kennung };
    case "musikAus":
      return { ...lage, szeneMusik: null };
    case "musikKarte":
      return { ...lage, szeneMusik: undefined, bleibt: false };
    case "musikBleibt":
      return { ...lage, bleibt: true };
    case "geraeusch":
      return { ...lage, szeneGeraeusch: befehl.kennung };
    case "geraeuschAus":
      return { ...lage, szeneGeraeusch: null };
    case "klang":
      return lage;
  }
}

/**
 * Eine neue Karte: ihre Vorgaben gelten; die Szene endet, außer bei `#musik:bleibt` (dann bleibt
 * deren Musik, bis ein Dialog sie ändert oder `#musik:karte` sagt).
 */
export function betritt(lage: Tonlage, musik?: string | null, geraeusch?: string | null): Tonlage {
  const karte = { karteMusik: musik ?? null, karteGeraeusch: geraeusch ?? null };
  return lage.bleibt
    ? { ...karte, szeneMusik: lage.szeneMusik, bleibt: true }
    : { ...karte, bleibt: false };
}

/** Ein Dialog ist zu Ende: Die Szene endet, außer die Musik soll bleiben. */
export function dialogEnde(lage: Tonlage): Tonlage {
  const ohne = { karteMusik: lage.karteMusik, karteGeraeusch: lage.karteGeraeusch };
  return lage.bleibt
    ? { ...ohne, szeneMusik: lage.szeneMusik, bleibt: true }
    : { ...ohne, bleibt: false };
}

/** Was klingen soll: die Vorgabe der Szene, sonst die der Karte. */
export function soll(lage: Tonlage): Tonsoll {
  return {
    musik: lage.szeneMusik === undefined ? lage.karteMusik : lage.szeneMusik,
    geraeusch: lage.szeneGeraeusch === undefined ? lage.karteGeraeusch : lage.szeneGeraeusch,
  };
}

/** Dateiformate in der Reihenfolge, in der sie versucht werden (m4a spielt auch auf dem iPhone). */
export const TONFORMATE = ["m4a", "ogg"] as const;

/**
 * Die Paketdateien, die zu einer Angabe passen, in der Reihenfolge des Versuchs.
 * Eingaben: Ordner („musik“ für Musik, „klang“ für Geräusche), Kennung oder Pfad aus orte.json.
 * Beispiele: („musik“, „ambroseThema“) → [musik/ambrose-thema.m4a, musik/ambrose-thema.ogg];
 * („musik“, „musik/dachboden.ogg“) → [musik/dachboden.m4a, musik/dachboden.ogg].
 */
export function dateienFuer(ordner: "musik" | "klang", angabe: string): string[] {
  const name = (angabe.split("/").pop() ?? angabe).replace(/\.(m4a|ogg)$/, "");
  const stamm = name.replace(/[A-Z]/g, (b) => `-${b.toLowerCase()}`);
  return TONFORMATE.map((format) => `${ordner}/${stamm}.${format}`);
}

const PROZENT = 100;

/**
 * Pegel (0 bis 1) für Musik und Geräusche. Stumm oder ohne den allgemeinen Ton der App (am iPhone
 * nötig, app/ton.ts) ist beides 0.
 */
export function pegel(e: Abenteuerton, tonAn: boolean): { musik: number; geraeusche: number } {
  if (e.stumm || !tonAn) return { musik: 0, geraeusche: 0 };
  return { musik: e.musik / PROZENT, geraeusche: e.geraeusche / PROZENT };
}

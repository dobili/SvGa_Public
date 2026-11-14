/**
 * Liest den Abenteuerteil einer gespeicherten Partie (Partieeinstellung `abenteuer`) vollständig.
 *
 * Warum: Bisher las speicher/partienLesen.ts nur Kennung, Zeitnot, Ablenkung, Stärkewechsel und die
 * Varianten „blind“ und „schach960“. Nach einem Neuladen fehlten deshalb Porträt, Kulisse,
 * Kandidatenwahl, „Buch und Bruch“ und die Variante „gehoer“: Die Spielhülle zeigte keinen Kopf,
 * und zwei Partieformen griffen nicht mehr (Befund beim Fotografieren der Hülle, 14.11.2026).
 * Ausgelagert, weil partienLesen.ts die Grenze von 400 Zeilen erreicht hat.
 * Abhängigkeiten: spiel/partie.ts (Typ), engine/stufen.ts (Typ der Stufennummer).
 */
import type { Stufennummer } from "../engine/stufen";
import type { Partieeinstellung } from "../spiel/partie";

type Abenteuerteil = NonNullable<Partieeinstellung["abenteuer"]>;

const VARIANTEN = ["blind", "schach960", "gehoer"] as const;
const STUFE_MIN = 1;
const STUFE_MAX = 10;

function istObjekt(wert: unknown): wert is Record<string, unknown> {
  return typeof wert === "object" && wert !== null;
}

function textliste(wert: unknown): string[] | null {
  return Array.isArray(wert) && wert.every((x) => typeof x === "string") ? wert : null;
}

/** Zeitnot, Ablenkung und Stärkewechsel: die Teile, die die Engine beeinflussen. */
function engineteil(roh: Record<string, unknown>): Partial<Abenteuerteil> {
  const teil: { -readonly [K in keyof Abenteuerteil]?: Abenteuerteil[K] } = {};
  const zeitnot = roh.zeitnotBis;
  if (typeof zeitnot === "number" && Number.isInteger(zeitnot) && zeitnot > 0)
    teil.zeitnotBis = zeitnot;
  const w = roh.abgelenktAb;
  if (istObjekt(w) && typeof w.halbzug === "number" && typeof w.faktor === "number") {
    teil.abgelenktAb = { halbzug: w.halbzug, faktor: w.faktor };
  }
  if (Array.isArray(roh.staerkeWechsel)) {
    teil.staerkeWechsel = roh.staerkeWechsel.filter((n): n is number => Number.isInteger(n));
  }
  return teil;
}

/** „Buch und Bruch“: Linie aus Zügen und eine gültige Stufe, sonst nichts. */
function buchbruchAus(roh: unknown): Abenteuerteil["buchbruch"] | undefined {
  if (!istObjekt(roh)) return undefined;
  const linie = textliste(roh.linie);
  const stufe = roh.stufe;
  if (!linie || typeof stufe !== "number" || !Number.isInteger(stufe)) return undefined;
  if (stufe < STUFE_MIN || stufe > STUFE_MAX) return undefined;
  return { linie, stufe: stufe as Stufennummer };
}

/** Form und Bild der Partie: Variante, Kandidaten, Buch und Bruch, Kulisse, Porträt. */
function formteil(roh: Record<string, unknown>): Partial<Abenteuerteil> {
  const teil: { -readonly [K in keyof Abenteuerteil]?: Abenteuerteil[K] } = {};
  const variante = VARIANTEN.find((v) => v === roh.variante);
  if (variante) teil.variante = variante;
  const kandidaten = textliste(roh.kandidaten);
  if (kandidaten) teil.kandidaten = kandidaten;
  const buchbruch = buchbruchAus(roh.buchbruch);
  if (buchbruch) teil.buchbruch = buchbruch;
  if (typeof roh.kulisse === "string") teil.kulisse = roh.kulisse;
  if (typeof roh.portraet === "string") teil.portraet = roh.portraet;
  return teil;
}

/**
 * Der Abenteuerteil aus gespeicherten Rohdaten; ohne gültige Kennung kein Abenteuerteil.
 * Beispiel: { kennung: "mapleFalls.skaterJo", portraet: "portraets/jo.svg" } bleibt vollständig.
 * Sonderfälle: Unbekannte Varianten und kaputte Teile fallen einzeln weg, der Rest bleibt.
 */
export function abenteuerteil(roh: unknown): Pick<Partieeinstellung, "abenteuer"> {
  if (!istObjekt(roh) || typeof roh.kennung !== "string") return {};
  return { abenteuer: { kennung: roh.kennung, ...engineteil(roh), ...formteil(roh) } };
}

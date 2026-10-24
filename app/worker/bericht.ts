/**
 * Prüfberichte aus GitHub Actions: annehmen, speichern, Verlauf je Punkt (R57).
 *
 * Rolle im Gesamtbild: Der Lauf „Wartung“ (.github/workflows/wartung.yml) prüft wöchentlich und
 * nach jedem Push nach main Links, Live-Seite, Abhängigkeiten usw. und schickt den Bericht an
 * POST /api/bericht, geschützt durch den gemeinsamen Schlüssel BERICHT_SCHLUESSEL (Secret in
 * Cloudflare und GitHub). Das Dashboard zeigt den neuesten Bericht als Ampel und je Punkt,
 * seit wann er rot ist und wann er zuletzt grün war.
 * Abhängigkeiten: worker/umgebung.ts, worker/datenbank.ts, worker/meldungen.ts (hash).
 */
import { sorgeFuerTabellen } from "./datenbank";
import { hash } from "./meldungen";
import { fehler, jsonAntwort, type Umgebung } from "./umgebung";

export const AMPELN = ["gruen", "gelb", "rot", "info"] as const;
export type Ampel = (typeof AMPELN)[number];

/** Ein Prüfpunkt, etwa „Links im Glossar“ mit Ampel und kurzer Begründung. */
export interface Pruefpunkt {
  id: string;
  gruppe: string;
  titel: string;
  ampel: Ampel;
  text: string;
}

export interface Bericht {
  zeit: string;
  stand: string | null;
  lauf: string | null;
  punkte: Pruefpunkt[];
}

/** Größter angenommener Bericht in Bytes. */
const GROESSTER_BERICHT_BYTES = 512 * 1024;
/** So viele Berichte bleiben gespeichert (etwa ein Jahr bei wöchentlichen Läufen und Pushes). */
export const BERICHTE_AUFBEWAHREN = 300;
const KURZTEXT = 200;
const LANGTEXT = 4000;

const istText = (wert: unknown, laenge: number): wert is string =>
  typeof wert === "string" && wert.length <= laenge;

function pruefePunkt(roh: unknown): Pruefpunkt | null {
  if (typeof roh !== "object" || roh === null) return null;
  const p = roh as Record<string, unknown>;
  const { id, gruppe, titel, ampel, text } = p;
  if (!istText(id, KURZTEXT) || !istText(gruppe, KURZTEXT) || !istText(titel, KURZTEXT)) {
    return null;
  }
  if (!istText(text, LANGTEXT)) return null;
  if (typeof ampel !== "string" || !(AMPELN as readonly string[]).includes(ampel)) return null;
  return { id, gruppe, titel, ampel: ampel as Ampel, text };
}

/**
 * Prüft einen Bericht; null bei ungültigem Inhalt.
 * Sonderfälle: kein Punkt, ein ungültiger Punkt oder doppelte Kennungen → null.
 */
export function pruefeBericht(roh: unknown): Bericht | null {
  if (typeof roh !== "object" || roh === null) return null;
  const b = roh as Record<string, unknown>;
  if (!Array.isArray(b["punkte"]) || b["punkte"].length === 0) return null;
  const punkte = b["punkte"].map(pruefePunkt);
  if (punkte.some((p) => p === null)) return null;
  const sicher = punkte as Pruefpunkt[];
  if (new Set(sicher.map((p) => p.id)).size !== sicher.length) return null;
  const stand = istText(b["stand"], KURZTEXT) ? b["stand"] : null;
  const lauf = istText(b["lauf"], KURZTEXT) ? b["lauf"] : null;
  const zeit = istText(b["zeit"], KURZTEXT) ? b["zeit"] : new Date().toISOString();
  return { zeit, stand, lauf, punkte: sicher };
}

/** Vergleicht den Schlüssel ohne zeitliche Rückschlüsse (über die Hashes beider Texte). */
export async function schluesselStimmt(gegeben: string, erwartet: string): Promise<boolean> {
  const [a, b] = await Promise.all([hash(gegeben), hash(erwartet)]);
  let unterschied = 0;
  for (let i = 0; i < a.length; i++) unterschied |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return unterschied === 0;
}

/** POST /api/bericht mit Kopfzeile „Authorization: Bearer <BERICHT_SCHLUESSEL>“. */
export async function nimmBerichtAn(anfrage: Request, env: Umgebung): Promise<Response> {
  if (!env.BERICHT_SCHLUESSEL) return fehler(503, "nicht eingerichtet");
  const gegeben = (anfrage.headers.get("Authorization") ?? "").replace(/^Bearer /, "");
  if (!(await schluesselStimmt(gegeben, env.BERICHT_SCHLUESSEL))) return fehler(401, "schluessel");
  const text = await anfrage.text();
  if (text.length > GROESSTER_BERICHT_BYTES) return fehler(413, "zu gross");
  let roh: unknown;
  try {
    roh = JSON.parse(text);
  } catch {
    return fehler(400, "json");
  }
  const bericht = pruefeBericht(roh);
  if (!bericht) return fehler(400, "inhalt");
  await sorgeFuerTabellen(env.ADMIN_DB);
  const zaehle = (ampel: Ampel) => bericht.punkte.filter((p) => p.ampel === ampel).length;
  const db = env.ADMIN_DB;
  await db.batch([
    db
      .prepare(
        "INSERT INTO berichte (zeit, stand, lauf, rot, gelb, punkte) VALUES (?, ?, ?, ?, ?, ?)",
      )
      .bind(
        bericht.zeit,
        bericht.stand,
        bericht.lauf,
        zaehle("rot"),
        zaehle("gelb"),
        JSON.stringify(bericht.punkte),
      ),
    db
      .prepare(
        "DELETE FROM berichte WHERE id NOT IN (SELECT id FROM berichte ORDER BY id DESC LIMIT ?)",
      )
      .bind(BERICHTE_AUFBEWAHREN),
  ]);
  return jsonAntwort({ ok: true });
}

/** Ein Punkt des neuesten Berichts mit seinem Verlauf. */
export interface PunktMitVerlauf extends Pruefpunkt {
  /** Zeit des ältesten Berichts in der ununterbrochenen Reihe mit derselben Ampel. */
  seit: string;
  /** Zeit des letzten Berichts, in dem der Punkt grün war (null: nie). */
  zuletztGruen: string | null;
}

/**
 * Verlauf je Punkt aus den Berichten (neuester zuerst).
 * Beispiel: Links rot in den Berichten vom 24., 17. und 10.10., grün am 3.10. → seit 10.10.,
 * zuletzt grün 3.10.
 */
export function verlaufJePunkt(berichte: readonly Bericht[]): PunktMitVerlauf[] {
  const [neuester, ...aeltere] = berichte;
  if (!neuester) return [];
  return neuester.punkte.map((punkt) => {
    let seit = neuester.zeit;
    let reiheHaelt = true;
    let zuletztGruen: string | null = punkt.ampel === "gruen" ? neuester.zeit : null;
    for (const bericht of aeltere) {
      const frueher = bericht.punkte.find((p) => p.id === punkt.id);
      if (reiheHaelt && frueher?.ampel === punkt.ampel) seit = bericht.zeit;
      else reiheHaelt = false;
      if (!zuletztGruen && frueher?.ampel === "gruen") zuletztGruen = bericht.zeit;
      if (!reiheHaelt && zuletztGruen) break;
    }
    return { ...punkt, seit, zuletztGruen };
  });
}

/** Die neuesten Berichte aus D1 (neuester zuerst). */
export async function ladeBerichte(env: Umgebung, anzahl: number): Promise<Bericht[]> {
  const { results } = await env.ADMIN_DB.prepare(
    "SELECT zeit, stand, lauf, punkte FROM berichte ORDER BY id DESC LIMIT ?",
  )
    .bind(anzahl)
    .all<{ zeit: string; stand: string | null; lauf: string | null; punkte: string }>();
  return results.map((z) => ({ ...z, punkte: JSON.parse(z.punkte) as Pruefpunkt[] }));
}

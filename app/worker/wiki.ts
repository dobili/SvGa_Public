/**
 * Wiki des Dashboards: Seiten annehmen (aus GitHub Actions) und dem Dashboard liefern (Paket D).
 *
 * Rolle im Gesamtbild: Wunsch des Autors (Ideensammlung 26.10.2026): ein Wiki mit Code-Teil
 * (Module, Begriffe, Codeführer) und Projekt-Teil (Entscheidungen, Fortschritt, Architektur,
 * Arbeitsregeln), handytauglich, mit Suche, ohne Buchtexte und Buchbefunde. Gespeichert nur hier
 * in D1 hinter Cloudflare Access, nie als Datei im Repository oder unter app/public. Der Lauf
 * „Wartung“ baut die Seiten (pipeline/wiki.py) und schickt sie an POST /api/wiki mit demselben
 * Schlüssel wie den Prüfbericht; jedes Hochladen ersetzt alle Seiten. Das Dashboard liest sie über
 * /api/admin/wiki (Liste), /api/admin/wiki/seite?pfad=… und /api/admin/wiki/suche?q=….
 * Abhängigkeiten: worker/umgebung.ts, worker/datenbank.ts, worker/bericht.ts (Schlüssel).
 */
import { schluesselStimmt } from "./bericht";
import { sorgeFuerTabellen } from "./datenbank";
import { fehler, jsonAntwort, type Umgebung } from "./umgebung";

export const BEREICHE = ["projekt", "code"] as const;
export type Wikibereich = (typeof BEREICHE)[number];

export interface Wikiseite {
  pfad: string;
  bereich: Wikibereich;
  titel: string;
  inhalt: string;
  quelle: string;
}

/** Größte angenommene Sendung in Bytes (alle Seiten zusammen, heute etwa 1,3 MB). */
const GROESSTE_SENDUNG_BYTES = 8 * 1024 * 1024;
/** Größte Seite in Zeichen (D1 erlaubt 2 MB je Zeile). */
const LAENGSTE_SEITE = 400_000;
const KURZTEXT = 300;
/** Höchstens so viele Seiten. */
const MEISTE_SEITEN = 2000;
/** So viele Seiten schreibt eine Sammelanweisung an D1. */
const JE_STAPEL = 50;
/** Treffer der Suche und Zeichen um die Fundstelle. */
const TREFFER = 40;
const UMFELD = 80;
/** Kürzester Suchbegriff. */
const KUERZESTE_SUCHE = 2;

const istText = (wert: unknown, laenge: number): wert is string =>
  typeof wert === "string" && wert.length > 0 && wert.length <= laenge;

/** Prüft eine Seite; null bei ungültigem Inhalt. */
export function pruefeSeite(roh: unknown): Wikiseite | null {
  if (typeof roh !== "object" || roh === null) return null;
  const { pfad, bereich, titel, inhalt, quelle } = roh as Record<string, unknown>;
  if (!istText(pfad, KURZTEXT) || !/^[a-z0-9/-]+$/.test(pfad)) return null;
  if (typeof bereich !== "string" || !(BEREICHE as readonly string[]).includes(bereich)) {
    return null;
  }
  if (!istText(titel, KURZTEXT) || !istText(quelle, KURZTEXT)) return null;
  if (typeof inhalt !== "string" || inhalt.length > LAENGSTE_SEITE) return null;
  return { pfad, bereich: bereich as Wikibereich, titel, inhalt, quelle };
}

/** Prüft die ganze Sendung; null, wenn eine Seite ungültig ist oder ein Pfad doppelt vorkommt. */
export function pruefeSendung(roh: unknown): { stand: string | null; seiten: Wikiseite[] } | null {
  if (typeof roh !== "object" || roh === null) return null;
  const { stand, seiten } = roh as Record<string, unknown>;
  if (!Array.isArray(seiten) || seiten.length === 0 || seiten.length > MEISTE_SEITEN) return null;
  const geprueft = seiten.map(pruefeSeite);
  if (geprueft.some((s) => s === null)) return null;
  const gut = geprueft as Wikiseite[];
  if (new Set(gut.map((s) => s.pfad)).size !== gut.length) return null;
  return { stand: typeof stand === "string" ? stand.slice(0, KURZTEXT) : null, seiten: gut };
}

/** POST /api/wiki mit „Authorization: Bearer <BERICHT_SCHLUESSEL>“: ersetzt alle Seiten. */
export async function nimmWikiAn(anfrage: Request, env: Umgebung): Promise<Response> {
  if (!env.BERICHT_SCHLUESSEL) return fehler(503, "nicht eingerichtet");
  const gegeben = (anfrage.headers.get("Authorization") ?? "").replace(/^Bearer /, "");
  if (!(await schluesselStimmt(gegeben, env.BERICHT_SCHLUESSEL))) return fehler(401, "schluessel");
  const text = await anfrage.text();
  if (text.length > GROESSTE_SENDUNG_BYTES) return fehler(413, "zu gross");
  let roh: unknown;
  try {
    roh = JSON.parse(text);
  } catch {
    return fehler(400, "json");
  }
  const sendung = pruefeSendung(roh);
  if (!sendung) return fehler(400, "inhalt");
  await sorgeFuerTabellen(env.ADMIN_DB);
  const zeit = new Date().toISOString();
  const db = env.ADMIN_DB;
  const einfuegen = sendung.seiten.map((s) =>
    db
      .prepare(
        "INSERT INTO wiki (pfad, bereich, titel, inhalt, quelle, stand, zeit) VALUES (?, ?, ?, ?, ?, ?, ?)",
      )
      .bind(s.pfad, s.bereich, s.titel, s.inhalt, s.quelle, sendung.stand, zeit),
  );
  // Erst alles löschen, dann in Stapeln einfügen; eine Sammelanweisung ist in D1 eine Transaktion.
  await db.batch([db.prepare("DELETE FROM wiki"), ...einfuegen.slice(0, JE_STAPEL)]);
  for (let i = JE_STAPEL; i < einfuegen.length; i += JE_STAPEL) {
    await db.batch(einfuegen.slice(i, i + JE_STAPEL));
  }
  return jsonAntwort({ ok: true, seiten: sendung.seiten.length });
}

/** GET /api/admin/wiki: alle Seiten ohne Inhalt (Pfad, Bereich, Titel, Länge, Stand). */
export async function wikiliste(env: Umgebung): Promise<Response> {
  const { results } = await env.ADMIN_DB.prepare(
    "SELECT pfad, bereich, titel, quelle, LENGTH(inhalt) AS laenge, stand, zeit FROM wiki ORDER BY rowid",
  ).all();
  return jsonAntwort({ seiten: results });
}

/** GET /api/admin/wiki/seite?pfad=…: eine Seite mit Inhalt; unbekannt → 404. */
export async function wikiseite(env: Umgebung, url: URL): Promise<Response> {
  const pfad = url.searchParams.get("pfad") ?? "";
  const seite = await env.ADMIN_DB.prepare(
    "SELECT pfad, bereich, titel, inhalt, quelle, stand, zeit FROM wiki WHERE pfad = ?",
  )
    .bind(pfad)
    .first();
  return seite ? jsonAntwort({ seite }) : fehler(404, "unbekannt");
}

/**
 * Ein Ausschnitt um die erste Fundstelle (ohne Groß- und Kleinschreibung).
 * Beispiel: ("… die Orden für volle Ringe …", "orden") → „… die Orden für volle Ringe …“.
 */
export function ausschnitt(inhalt: string, suche: string): string {
  const stelle = inhalt.toLowerCase().indexOf(suche.toLowerCase());
  if (stelle < 0) return inhalt.slice(0, UMFELD * 2);
  const anfang = Math.max(0, stelle - UMFELD);
  const ende = Math.min(inhalt.length, stelle + suche.length + UMFELD);
  return `${anfang > 0 ? "…" : ""}${inhalt.slice(anfang, ende)}${ende < inhalt.length ? "…" : ""}`;
}

/** GET /api/admin/wiki/suche?q=…: Seiten, in deren Titel oder Text der Begriff steht. */
export async function wikisuche(env: Umgebung, url: URL): Promise<Response> {
  const suche = (url.searchParams.get("q") ?? "").trim().slice(0, KURZTEXT);
  if (suche.length < KUERZESTE_SUCHE) return jsonAntwort({ treffer: [] });
  const muster = `%${suche.replace(/[\\%_]/g, (z) => `\\${z}`)}%`;
  const { results } = await env.ADMIN_DB.prepare(
    "SELECT pfad, bereich, titel, inhalt FROM wiki WHERE titel LIKE ? ESCAPE '\\' OR inhalt LIKE ? ESCAPE '\\' LIMIT ?",
  )
    .bind(muster, muster, TREFFER)
    .all<{ pfad: string; bereich: string; titel: string; inhalt: string }>();
  return jsonAntwort({
    treffer: results.map((r) => ({
      pfad: r.pfad,
      bereich: r.bereich,
      titel: r.titel,
      ausschnitt: ausschnitt(r.inhalt, suche),
    })),
  });
}

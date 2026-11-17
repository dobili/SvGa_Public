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
 * Seit 17.11.2026 (Wunsch des Autors) zwei getrennte Wikis auf derselben Plattform: „app“ (die
 * Schach-App) und „spiel“ (das Schach-Abenteuer, das später auch eigenständig erscheinen soll).
 * Jede Seite trägt ihre Wiki-Kennung; eine Sendung ersetzt nur die Seiten ihres Wikis, Liste,
 * Seite und Suche nehmen `?wiki=…` (Vorgabe „app“, damit alte Aufrufe weiter gehen).
 * Abhängigkeiten: worker/umgebung.ts, worker/datenbank.ts, worker/bericht.ts (Schlüssel).
 */
import { schluesselStimmt } from "./bericht";
import { sorgeFuerTabellen } from "./datenbank";
import { fehler, jsonAntwort, type Umgebung } from "./umgebung";

export const BEREICHE = ["projekt", "code"] as const;
/** Die Wikis der Plattform; „app“ ist die Vorgabe für Sendungen und Abfragen ohne Angabe. */
export const WIKIS = ["app", "spiel"] as const;
export type Wikiname = (typeof WIKIS)[number];
const VORGABE_WIKI: Wikiname = "app";
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

/** Die Wiki-Kennung aus einem Wert; ohne Angabe die Vorgabe, unbekannt → null. */
export function wikiname(roh: unknown): Wikiname | null {
  if (roh === undefined || roh === null || roh === "") return VORGABE_WIKI;
  return (WIKIS as readonly unknown[]).includes(roh) ? (roh as Wikiname) : null;
}

/** Prüft die ganze Sendung; null, wenn eine Seite ungültig ist oder ein Pfad doppelt vorkommt. */
export function pruefeSendung(
  roh: unknown,
): { wiki: Wikiname; stand: string | null; seiten: Wikiseite[] } | null {
  if (typeof roh !== "object" || roh === null) return null;
  const { stand, seiten } = roh as Record<string, unknown>;
  const wiki = wikiname((roh as Record<string, unknown>).wiki);
  if (!wiki) return null;
  if (!Array.isArray(seiten) || seiten.length === 0 || seiten.length > MEISTE_SEITEN) return null;
  const geprueft = seiten.map(pruefeSeite);
  if (geprueft.some((s) => s === null)) return null;
  const gut = geprueft as Wikiseite[];
  if (new Set(gut.map((s) => s.pfad)).size !== gut.length) return null;
  return { wiki, stand: typeof stand === "string" ? stand.slice(0, KURZTEXT) : null, seiten: gut };
}

/** POST /api/wiki mit „Authorization: Bearer <BERICHT_SCHLUESSEL>“: ersetzt alle Seiten eines Wikis. */
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
        "INSERT INTO wikiseiten (wiki, pfad, bereich, titel, inhalt, quelle, stand, zeit) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      )
      .bind(sendung.wiki, s.pfad, s.bereich, s.titel, s.inhalt, s.quelle, sendung.stand, zeit),
  );
  // Erst das Wiki leeren, dann in Stapeln einfügen; eine Sammelanweisung ist in D1 eine Transaktion.
  const leeren = db.prepare("DELETE FROM wikiseiten WHERE wiki = ?").bind(sendung.wiki);
  await db.batch([leeren, ...einfuegen.slice(0, JE_STAPEL)]);
  for (let i = JE_STAPEL; i < einfuegen.length; i += JE_STAPEL) {
    await db.batch(einfuegen.slice(i, i + JE_STAPEL));
  }
  return jsonAntwort({ ok: true, wiki: sendung.wiki, seiten: sendung.seiten.length });
}

/** Das Wiki einer Abfrage (`?wiki=…`); unbekannt → null. */
const wikiDer = (url: URL): Wikiname | null => wikiname(url.searchParams.get("wiki"));

/** GET /api/admin/wiki?wiki=…: alle Seiten eines Wikis ohne Inhalt (Pfad, Bereich, Titel, Länge, Stand). */
export async function wikiliste(env: Umgebung, url: URL): Promise<Response> {
  const wiki = wikiDer(url);
  if (!wiki) return fehler(400, "wiki");
  const { results } = await env.ADMIN_DB.prepare(
    "SELECT pfad, bereich, titel, quelle, LENGTH(inhalt) AS laenge, stand, zeit FROM wikiseiten WHERE wiki = ? ORDER BY rowid",
  )
    .bind(wiki)
    .all();
  return jsonAntwort({ wiki, seiten: results });
}

/** GET /api/admin/wiki/seite?wiki=…&pfad=…: eine Seite mit Inhalt; unbekannt → 404. */
export async function wikiseite(env: Umgebung, url: URL): Promise<Response> {
  const wiki = wikiDer(url);
  if (!wiki) return fehler(400, "wiki");
  const pfad = url.searchParams.get("pfad") ?? "";
  const seite = await env.ADMIN_DB.prepare(
    "SELECT pfad, bereich, titel, inhalt, quelle, stand, zeit FROM wikiseiten WHERE wiki = ? AND pfad = ?",
  )
    .bind(wiki, pfad)
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

/** GET /api/admin/wiki/suche?wiki=…&q=…: Seiten eines Wikis, in deren Titel oder Text der Begriff steht. */
export async function wikisuche(env: Umgebung, url: URL): Promise<Response> {
  const wiki = wikiDer(url);
  if (!wiki) return fehler(400, "wiki");
  const suche = (url.searchParams.get("q") ?? "").trim().slice(0, KURZTEXT);
  if (suche.length < KUERZESTE_SUCHE) return jsonAntwort({ treffer: [] });
  const muster = `%${suche.replace(/[\\%_]/g, (z) => `\\${z}`)}%`;
  const { results } = await env.ADMIN_DB.prepare(
    "SELECT pfad, bereich, titel, inhalt FROM wikiseiten WHERE wiki = ? AND (titel LIKE ? ESCAPE '\\' OR inhalt LIKE ? ESCAPE '\\') LIMIT ?",
  )
    .bind(wiki, muster, muster, TREFFER)
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

/**
 * Schnittstellen des Dashboards unter /api/admin/ (nur mit gültigem Access-Zeichen, R57).
 *
 * Rolle im Gesamtbild: Die Seite /admin/ (worker/adminseite.ts) holt hier die Übersicht
 * (Ampel mit Verlauf, Zahlen der Meldungen) und die Meldungen und setzt deren Status.
 * Claude liest dieselben Schnittstellen mit dem Service Token des Autors.
 * Abhängigkeiten: worker/umgebung.ts, worker/datenbank.ts, worker/bericht.ts, worker/mail.ts.
 */
import { ladeBerichte, verlaufJePunkt } from "./bericht";
import { sorgeFuerTabellen } from "./datenbank";
import { mailEingerichtet } from "./mail";
import { fehler, jsonAntwort, type Umgebung } from "./umgebung";

export const STATUS = ["neu", "in_arbeit", "erledigt", "kein_fehler", "doppelt"] as const;
export type Meldestatus = (typeof STATUS)[number];

/** Berichte für den Verlauf je Punkt (etwa ein halbes Jahr). */
const BERICHTE_FUER_VERLAUF = 80;
/** Berichte in der Liste „Letzte Läufe“. */
const BERICHTE_IN_LISTE = 20;
/** Meldungen je Abruf. */
const MELDUNGEN_JE_ABRUF = 200;
const NOTIZ_ZEICHEN = 2000;

/** GET /api/admin/uebersicht */
async function uebersicht(env: Umgebung, wer: string): Promise<Response> {
  const berichte = await ladeBerichte(env, BERICHTE_FUER_VERLAUF);
  const { results: zahlen } = await env.ADMIN_DB.prepare(
    "SELECT status, art, COUNT(*) AS anzahl FROM meldungen GROUP BY status, art",
  ).all<{ status: string; art: string; anzahl: number }>();
  const { results: laeufe } = await env.ADMIN_DB.prepare(
    "SELECT zeit, stand, lauf, rot, gelb FROM berichte ORDER BY id DESC LIMIT ?",
  )
    .bind(BERICHTE_IN_LISTE)
    .all();
  return jsonAntwort({
    wer,
    neuesterBericht: berichte[0] ? { ...berichte[0], punkte: verlaufJePunkt(berichte) } : null,
    laeufe,
    zahlen,
    eingerichtet: {
      mail: mailEingerichtet(env),
      turnstile: Boolean(env.TURNSTILE_SECRET),
      bericht: Boolean(env.BERICHT_SCHLUESSEL),
    },
  });
}

/** GET /api/admin/meldungen?status=neu (ohne status: alle offenen, also neu und in Arbeit). */
async function meldungen(env: Umgebung, url: URL): Promise<Response> {
  const status = url.searchParams.get("status");
  const abfrage =
    status && (STATUS as readonly string[]).includes(status)
      ? env.ADMIN_DB.prepare(
          "SELECT * FROM meldungen WHERE status = ? ORDER BY id DESC LIMIT ?",
        ).bind(status, MELDUNGEN_JE_ABRUF)
      : env.ADMIN_DB.prepare(
          "SELECT * FROM meldungen WHERE status IN ('neu', 'in_arbeit') ORDER BY id DESC LIMIT ?",
        ).bind(MELDUNGEN_JE_ABRUF);
  const { results } = await abfrage.all();
  return jsonAntwort({ meldungen: results });
}

/**
 * POST /api/admin/meldungen/<nummer> mit { status, doppeltVon?, notiz? }.
 * Sonderfälle: unbekannter Status, „doppelt“ ohne gültige Nummer → 400.
 */
async function aendereMeldung(env: Umgebung, nummer: number, anfrage: Request): Promise<Response> {
  let roh: Record<string, unknown>;
  try {
    roh = (await anfrage.json()) as Record<string, unknown>;
  } catch {
    return fehler(400, "json");
  }
  const { status, doppeltVon, notiz } = roh;
  if (typeof status !== "string" || !(STATUS as readonly string[]).includes(status)) {
    return fehler(400, "status");
  }
  const von = status === "doppelt" ? doppeltVon : null;
  if (status === "doppelt" && (typeof von !== "number" || !Number.isInteger(von))) {
    return fehler(400, "doppeltVon");
  }
  if (notiz !== undefined && (typeof notiz !== "string" || notiz.length > NOTIZ_ZEICHEN)) {
    return fehler(400, "notiz");
  }
  await env.ADMIN_DB.prepare(
    "UPDATE meldungen SET status = ?, doppelt_von = ?, notiz = COALESCE(?, notiz) WHERE id = ?",
  )
    .bind(status, von as number | null, (notiz as string | undefined) ?? null, nummer)
    .run();
  return jsonAntwort({ ok: true });
}

/** Verteilt die Anfragen unter /api/admin/ (Zugang ist schon geprüft). */
export async function verwalte(anfrage: Request, env: Umgebung, wer: string): Promise<Response> {
  await sorgeFuerTabellen(env.ADMIN_DB);
  const url = new URL(anfrage.url);
  const pfad = url.pathname.replace(/^\/api\/admin\/?/, "");
  if (anfrage.method === "GET" && pfad === "uebersicht") return uebersicht(env, wer);
  if (anfrage.method === "GET" && pfad === "meldungen") return meldungen(env, url);
  const treffer = /^meldungen\/(\d+)$/.exec(pfad);
  if (anfrage.method === "POST" && treffer?.[1]) {
    return aendereMeldung(env, Number(treffer[1]), anfrage);
  }
  return fehler(404, "unbekannt");
}

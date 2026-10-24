/**
 * Annahme der Meldungen aus App und Website: prüfen, drosseln, speichern (R57, Stufe 2).
 *
 * Rolle im Gesamtbild: Bis R57 kopierte „Fehler melden“ nur die Angaben in die Zwischenablage,
 * der Leser musste sie selbst per Mail schicken. Jetzt schickt das Formular sie an
 * POST /api/melden; der Autor sieht sie im Dashboard. Die Schnittstelle ist öffentlich, deshalb
 * enge Grenzen: feste Felder mit Höchstlängen, höchstens wenige Meldungen je Absender und
 * Stunde, auf Wunsch Turnstile. Gespeichert wird nur, was der Leser ausdrücklich mitschickt;
 * die IP-Adresse nur als Hash mit Tagesdatum für die Drossel, nie im Klartext.
 * Abhängigkeiten: worker/umgebung.ts, worker/datenbank.ts, worker/mail.ts.
 */
import { sorgeFuerTabellen } from "./datenbank";
import { meldeNeueMeldung } from "./mail";
import { fehler, jsonAntwort, type Ausfuehrung, type Umgebung } from "./umgebung";

export const MELDEARTEN = ["fehler", "wunsch", "buch", "absturz"] as const;
export type Meldeart = (typeof MELDEARTEN)[number];

/** Höchstlängen der Felder in Zeichen. */
const LAENGEN = {
  text: 4000,
  version: 40,
  geraet: 300,
  bildschirm: 40,
  sprache: 10,
  stellung: 4000,
  abbildung: 40,
  seite: 200,
} as const;
type Feld = keyof typeof LAENGEN;
const FELDER = Object.keys(LAENGEN) as Feld[];

/** Größte angenommene Anfrage in Bytes (alle Felder voll plus Rand). */
export const GROESSTE_MELDUNG_BYTES = 16 * 1024;
/** Meldungen je Absender und Stunde. */
export const MELDUNGEN_JE_STUNDE = 5;

export interface Meldung {
  art: Meldeart;
  text: string;
  version: string | null;
  geraet: string | null;
  bildschirm: string | null;
  sprache: string | null;
  stellung: string | null;
  abbildung: string | null;
  seite: string | null;
}

/**
 * Prüft den Inhalt einer Meldung; null bei ungültigem Inhalt.
 * Beispiel: { art: "buch", text: "Pfeil zeigt auf e5 statt e4", abbildung: "3.12" } → Meldung.
 * Sonderfälle: leerer Text, unbekannte Art, zu lange Felder oder Felder, die keine Zeichenkette
 * sind → null. Unbekannte Felder (etwa der Turnstile-Nachweis) werden übergangen.
 */
export function pruefeMeldung(roh: unknown): Meldung | null {
  if (typeof roh !== "object" || roh === null) return null;
  const daten = roh as Record<string, unknown>;
  const art = daten["art"];
  if (typeof art !== "string" || !(MELDEARTEN as readonly string[]).includes(art)) return null;
  const meldung: Record<string, string | null> = {};
  for (const feld of FELDER) {
    const wert = daten[feld];
    if (wert === undefined || wert === null || wert === "") {
      meldung[feld] = null;
      continue;
    }
    if (typeof wert !== "string" || wert.length > LAENGEN[feld]) return null;
    meldung[feld] = wert;
  }
  const text = meldung["text"]?.trim();
  if (!text) return null;
  return { ...(meldung as Omit<Meldung, "art">), text, art: art as Meldeart };
}

/** SHA-256 als Hex-Text. */
export async function hash(text: string): Promise<string> {
  const bytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(bytes)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Zählt eine Meldung des Absenders in der laufenden Stunde; false, wenn er schon genug geschickt
 * hat. Der Schlüssel ist ein Hash aus IP-Adresse und Tag, damit kein Absender wiederzuerkennen
 * ist. Alte Stunden werden dabei gelöscht.
 */
export async function darfMelden(env: Umgebung, ip: string, jetzt: Date): Promise<boolean> {
  const tag = jetzt.toISOString().slice(0, "JJJJ-MM-TT".length);
  const stunde = jetzt.toISOString().slice(0, "JJJJ-MM-TTTHH".length);
  const schluessel = await hash(`${ip}|${tag}`);
  const db = env.ADMIN_DB;
  await db.batch([
    db.prepare("DELETE FROM drossel WHERE stunde < ?").bind(tag),
    db
      .prepare(
        `INSERT INTO drossel (schluessel, stunde, anzahl) VALUES (?, ?, 1)
         ON CONFLICT (schluessel, stunde) DO UPDATE SET anzahl = anzahl + 1`,
      )
      .bind(schluessel, stunde),
  ]);
  const zeile = await db
    .prepare("SELECT anzahl FROM drossel WHERE schluessel = ? AND stunde = ?")
    .bind(schluessel, stunde)
    .first<{ anzahl: number }>();
  return (zeile?.anzahl ?? 0) <= MELDUNGEN_JE_STUNDE;
}

const TURNSTILE_PRUEFUNG = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

/** Prüft den Turnstile-Nachweis bei Cloudflare; ohne TURNSTILE_SECRET immer bestanden. */
export async function turnstileBestanden(
  env: Umgebung,
  nachweis: unknown,
  ip: string,
): Promise<boolean> {
  if (!env.TURNSTILE_SECRET) return true;
  if (typeof nachweis !== "string" || nachweis === "") return false;
  const formular = new FormData();
  formular.append("secret", env.TURNSTILE_SECRET);
  formular.append("response", nachweis);
  formular.append("remoteip", ip);
  const antwort = await fetch(TURNSTILE_PRUEFUNG, { method: "POST", body: formular });
  if (!antwort.ok) return false;
  const ergebnis = (await antwort.json()) as { success?: boolean };
  return ergebnis.success === true;
}

/** Speichert eine geprüfte Meldung und liefert ihre Nummer. */
export async function speichereMeldung(env: Umgebung, m: Meldung, jetzt: Date): Promise<number> {
  const zeile = await env.ADMIN_DB.prepare(
    `INSERT INTO meldungen (zeit, art, text, version, geraet, bildschirm, sprache, stellung,
       abbildung, seite) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING id`,
  )
    .bind(jetzt.toISOString(), m.art, m.text, ...FELDER.slice(1).map((f) => m[f]))
    .first<{ id: number }>();
  if (!zeile) throw new Error("Meldung wurde nicht gespeichert");
  return zeile.id;
}

/** Liest den Körper als JSON mit Größengrenze; null, wenn er zu groß oder kein JSON ist. */
async function liesJson(anfrage: Request): Promise<unknown> {
  const text = await anfrage.text();
  if (text.length > GROESSTE_MELDUNG_BYTES) return null;
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return null;
  }
}

/**
 * POST /api/melden.
 * Antwort: { ok: true, nummer } oder ein Fehler mit Status 400 (Inhalt), 403 (Turnstile),
 * 429 (zu viele Meldungen).
 */
export async function nimmMeldungAn(
  anfrage: Request,
  env: Umgebung,
  ausfuehrung: Ausfuehrung,
): Promise<Response> {
  const roh = await liesJson(anfrage);
  const meldung = pruefeMeldung(roh);
  if (!meldung) return fehler(400, "inhalt");
  const ip = anfrage.headers.get("CF-Connecting-IP") ?? "unbekannt";
  const nachweis = (roh as Record<string, unknown>)["turnstile"];
  if (!(await turnstileBestanden(env, nachweis, ip))) return fehler(403, "turnstile");
  await sorgeFuerTabellen(env.ADMIN_DB);
  const jetzt = new Date();
  if (!(await darfMelden(env, ip, jetzt))) return fehler(429, "drossel");
  const nummer = await speichereMeldung(env, meldung, jetzt);
  ausfuehrung.waitUntil(meldeNeueMeldung(env, nummer, meldung));
  return jsonAntwort({ ok: true, nummer });
}

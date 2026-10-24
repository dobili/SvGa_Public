/**
 * Zugang zum Dashboard: prüft das Zeichen von Cloudflare Access (R57).
 *
 * Rolle im Gesamtbild: Cloudflare Access schützt /admin und /api/admin auf der Domain des Buches
 * (vom Autor am 24.10.2026 eingerichtet). Derselbe Worker ist aber auch über andere Adressen
 * erreichbar (workers.dev, Vorschauadressen der Zweige), an denen Access nicht steht. Deshalb
 * prüft der Worker selbst das Zeichen, das Access jeder durchgelassenen Anfrage mitgibt
 * (Kopfzeile Cf-Access-Jwt-Assertion, ein JWT mit RS256): Unterschrift mit den öffentlichen
 * Schlüsseln des Teams, Zielgruppe (AUD der Anwendung), Aussteller und Ablauf. Fehlt die
 * Einrichtung (ACCESS_TEAM, ACCESS_AUD), bleibt das Dashboard zu.
 * Abhängigkeiten: worker/umgebung.ts, Web Crypto.
 */
import type { Umgebung } from "./umgebung";

/** Öffentlicher Schlüssel aus der Liste von Access (JWK, nur die Felder für RS256). */
interface Schluessel extends JsonWebKey {
  kid?: string;
}

interface Kopf {
  alg?: string;
  kid?: string;
}

/** Was Access in das Zeichen schreibt (Auszug). */
export interface Zeichen {
  aud?: string | string[];
  iss?: string;
  exp?: number;
  nbf?: number;
  email?: string;
  common_name?: string;
}

/** Die Schlüsselliste wird so lange wiederverwendet (Access wechselt sie selten). */
const SCHLUESSEL_GUELTIG_MS = 60 * 60 * 1000;
const MS_JE_SEKUNDE = 1000;
/** Spielraum für abweichende Uhren in Sekunden. */
const UHR_SPIELRAUM_S = 60;

let zwischenspeicher: { team: string; bis: number; schluessel: Schluessel[] } | null = null;

/** Base64url → Bytes. */
function bytesAus(base64url: string): Uint8Array<ArrayBuffer> {
  const base64 = base64url.replace(/-/g, "+").replace(/_/g, "/");
  const binaer = atob(base64 + "=".repeat((4 - (base64.length % 4)) % 4));
  return Uint8Array.from(binaer, (zeichen) => zeichen.charCodeAt(0));
}

function jsonAus<T>(base64url: string): T {
  return JSON.parse(new TextDecoder().decode(bytesAus(base64url))) as T;
}

/** Lädt die öffentlichen Schlüssel des Access-Teams (mit Zwischenspeicher). */
async function ladeSchluessel(team: string, jetztMs: number): Promise<Schluessel[]> {
  if (zwischenspeicher?.team === team && zwischenspeicher.bis > jetztMs) {
    return zwischenspeicher.schluessel;
  }
  const antwort = await fetch(`https://${team}/cdn-cgi/access/certs`);
  if (!antwort.ok) throw new Error(`Schlüssel von Access nicht ladbar: ${antwort.status}`);
  const { keys } = (await antwort.json()) as { keys: Schluessel[] };
  zwischenspeicher = { team, bis: jetztMs + SCHLUESSEL_GUELTIG_MS, schluessel: keys };
  return keys;
}

/** Nur für Tests: setzt die Schlüsselliste, ohne Access zu fragen. */
export function setzeSchluessel(team: string, schluessel: Schluessel[], bisMs: number): void {
  zwischenspeicher = { team, bis: bisMs, schluessel };
}

/** Prüft Zielgruppe, Aussteller und Zeiten der Angaben. */
export function angabenGueltig(z: Zeichen, team: string, aud: string, jetztMs: number): boolean {
  const jetzt = jetztMs / MS_JE_SEKUNDE;
  const zielgruppen = Array.isArray(z.aud) ? z.aud : [z.aud];
  if (!zielgruppen.includes(aud)) return false;
  if (z.iss !== `https://${team}`) return false;
  if (typeof z.exp !== "number" || z.exp + UHR_SPIELRAUM_S < jetzt) return false;
  if (typeof z.nbf === "number" && z.nbf - UHR_SPIELRAUM_S > jetzt) return false;
  return true;
}

/**
 * Prüft ein Zeichen von Access; liefert die Angaben oder null.
 * Sonderfälle: anderes Verfahren als RS256, unbekannter Schlüssel, falsche Unterschrift,
 * fremde Zielgruppe oder abgelaufen → null.
 */
export async function pruefeZeichen(
  jwt: string,
  team: string,
  aud: string,
  jetztMs: number,
): Promise<Zeichen | null> {
  const teile = jwt.split(".");
  if (teile.length !== 3) return null;
  const [kopfTeil = "", angabenTeil = "", unterschrift = ""] = teile;
  let kopf: Kopf;
  let angaben: Zeichen;
  try {
    kopf = jsonAus<Kopf>(kopfTeil);
    angaben = jsonAus<Zeichen>(angabenTeil);
  } catch {
    return null;
  }
  if (kopf.alg !== "RS256") return null;
  const jwk = (await ladeSchluessel(team, jetztMs)).find((s) => s.kid === kopf.kid);
  if (!jwk) return null;
  const verfahren = { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" };
  const schluessel = await crypto.subtle.importKey("jwk", jwk, verfahren, false, ["verify"]);
  const echt = await crypto.subtle.verify(
    verfahren,
    schluessel,
    bytesAus(unterschrift),
    new TextEncoder().encode(`${kopfTeil}.${angabenTeil}`),
  );
  if (!echt || !angabenGueltig(angaben, team, aud, jetztMs)) return null;
  return angaben;
}

/**
 * Wer die Anfrage stellt (Mailadresse oder Name des Service Tokens), oder null ohne gültigen
 * Zugang. Ohne ACCESS_TEAM oder ACCESS_AUD immer null.
 */
export async function zugangVon(anfrage: Request, env: Umgebung): Promise<string | null> {
  const jwt = anfrage.headers.get("Cf-Access-Jwt-Assertion");
  if (!jwt || !env.ACCESS_TEAM || !env.ACCESS_AUD) return null;
  const angaben = await pruefeZeichen(jwt, env.ACCESS_TEAM, env.ACCESS_AUD, Date.now());
  if (!angaben) return null;
  return angaben.email ?? angaben.common_name ?? "unbekannt";
}

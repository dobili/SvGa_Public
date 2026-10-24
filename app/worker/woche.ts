/**
 * Wochenübersicht per Mail (R57, Stufe 2, Punkt 15): montags früh, nur mit Mailversand.
 *
 * Rolle im Gesamtbild: Der Autor soll nicht jede Woche ins Dashboard schauen müssen. Die Mail
 * nennt neue und offene Meldungen und die roten und gelben Punkte des neuesten Prüfberichts.
 * Ausgelöst vom Zeitplan in wrangler.jsonc (triggers.crons).
 * Abhängigkeiten: worker/umgebung.ts, worker/datenbank.ts, worker/bericht.ts, worker/mail.ts.
 */
import { ladeBerichte, type Bericht } from "./bericht";
import { sorgeFuerTabellen } from "./datenbank";
import { DASHBOARD, mailEingerichtet, schickeMail } from "./mail";
import type { Umgebung } from "./umgebung";

const WOCHE_MS = 7 * 24 * 60 * 60 * 1000;

/**
 * Text der Wochenübersicht.
 * Beispiel: „Neue Meldungen: 3 / Offen: 5 / Prüfungen: 1 rot, 2 gelb“ mit den Punkten darunter.
 */
export function wochentext(neu: number, offen: number, bericht: Bericht | null): string {
  const zeilen = [`Neue Meldungen in dieser Woche: ${neu}`, `Offene Meldungen: ${offen}`, ""];
  if (!bericht) {
    zeilen.push("Noch kein Prüfbericht.");
  } else {
    const auffaellig = bericht.punkte.filter((p) => p.ampel === "rot" || p.ampel === "gelb");
    const rot = auffaellig.filter((p) => p.ampel === "rot").length;
    zeilen.push(
      `Prüfungen (${bericht.zeit.slice(0, "JJJJ-MM-TT".length)}): ${rot} rot, ${auffaellig.length - rot} gelb`,
    );
    for (const p of auffaellig)
      zeilen.push(`- ${p.ampel === "rot" ? "ROT" : "gelb"}: ${p.titel} – ${p.text}`);
  }
  zeilen.push("", DASHBOARD);
  return zeilen.join("\n");
}

/** Sammelt die Zahlen und schickt die Mail; ohne Mailversand nichts. */
export async function schickeWochenuebersicht(env: Umgebung): Promise<void> {
  if (!mailEingerichtet(env)) return;
  await sorgeFuerTabellen(env.ADMIN_DB);
  const seit = new Date(Date.now() - WOCHE_MS).toISOString();
  const neu = await env.ADMIN_DB.prepare("SELECT COUNT(*) AS n FROM meldungen WHERE zeit >= ?")
    .bind(seit)
    .first<{ n: number }>();
  const offen = await env.ADMIN_DB.prepare(
    "SELECT COUNT(*) AS n FROM meldungen WHERE status IN ('neu', 'in_arbeit')",
  ).first<{ n: number }>();
  const [bericht] = await ladeBerichte(env, 1);
  await schickeMail(
    env,
    "Wochenübersicht Schach von Grund auf",
    wochentext(neu?.n ?? 0, offen?.n ?? 0, bericht ?? null),
  );
}

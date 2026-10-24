/**
 * Mails an den Autor über Resend (R57, optional): neue Meldung und Wochenübersicht.
 *
 * Rolle im Gesamtbild: Rote Prüfungen meldet schon GitHub per Mail (gescheiterter Lauf). Für
 * neue Meldungen der Leser und die Wochenübersicht braucht es einen Mailversand; der Autor hat
 * ihn als optional gewählt. Ohne die Secrets RESEND_KEY, MAIL_AN und MAIL_VON tut dieses Modul
 * nichts. Die Adresse des Autors steht nur im Secret, nie im öffentlichen Repository.
 * Abhängigkeiten: worker/umgebung.ts.
 */
import type { Meldung } from "./meldungen";
import type { Umgebung } from "./umgebung";

const RESEND = "https://api.resend.com/emails";
export const DASHBOARD = "https://schach-von-grund-auf.com/admin/";
/** So viele Zeichen des Meldungstexts stehen in der Mail. */
const AUSZUG_ZEICHEN = 500;

/** Ob der Mailversand eingerichtet ist. */
export function mailEingerichtet(env: Umgebung): boolean {
  return Boolean(env.RESEND_KEY && env.MAIL_AN && env.MAIL_VON);
}

/**
 * Schickt eine Mail an den Autor; false, wenn kein Mailversand eingerichtet ist oder Resend
 * ablehnt. Ein Fehler beim Versand bricht nie die eigentliche Anfrage ab, er steht im Protokoll
 * des Workers.
 */
export async function schickeMail(env: Umgebung, betreff: string, text: string): Promise<boolean> {
  if (!mailEingerichtet(env)) return false;
  const antwort = await fetch(RESEND, {
    method: "POST",
    headers: { Authorization: `Bearer ${env.RESEND_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: env.MAIL_VON, to: env.MAIL_AN, subject: betreff, text }),
  });
  if (!antwort.ok) console.error(`Mailversand abgelehnt: ${antwort.status}`);
  return antwort.ok;
}

const ARTNAMEN: Record<Meldung["art"], string> = {
  fehler: "Fehler",
  wunsch: "Wunsch",
  buch: "Buchbefund",
  absturz: "Absturzbericht",
};

/** Mail zu einer neuen Meldung, mit Auszug und Link ins Dashboard. */
export async function meldeNeueMeldung(env: Umgebung, nummer: number, m: Meldung): Promise<void> {
  const auszug = m.text.length > AUSZUG_ZEICHEN ? `${m.text.slice(0, AUSZUG_ZEICHEN)} …` : m.text;
  const kopf = [
    `${ARTNAMEN[m.art]} Nr. ${nummer}`,
    ...(m.abbildung ? [`Abbildung ${m.abbildung}`] : []),
    ...(m.version ? [`App-Version ${m.version}`] : []),
  ];
  const text = [...kopf, "", auszug, "", DASHBOARD].join("\n");
  try {
    await schickeMail(env, `Neue Meldung: ${ARTNAMEN[m.art]}`, text);
  } catch (grund) {
    console.error("Mail zur Meldung gescheitert", grund);
  }
}

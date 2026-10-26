/**
 * Die Kurzpläne: 5 Minuten nur Wiederholungen, 15 Minuten Kurzplan, Taktik auf Zeit und die
 * Tagesaufgabe mit Serie.
 *
 * Rolle im Gesamtbild: Trainer „kurzplaene“ (Wunsch des Autors, 26.10.2026, angeregt durch
 * die Übungsformate von chess.com und Lichess). Diese Datei rechnet nur: den Stand einer
 * laufenden Einheit mit Uhr, die Aufgabe des Tages, die Serie der Tage in Folge und das Ende der
 * Zeitrunde. Die Oberfläche (ui/trainer/KurzplanBereich.tsx) zeigt sie. Der Stand liegt als
 * Merker auf dem Gerät (app/merker.ts) und geht nicht in die Datensicherung.
 * Abhängigkeiten: keine.
 * Buchbezug: Kapitel 12, „Hast du weniger Zeit, kürze zunächst das Themenstudium, nie die
 * Analyse.“ Die Aufteilung der Kurzpläne ist ein Vorschlag der App und kein Inhalt des Buches.
 */

export type Kurzplanart = "mini" | "kurz";
export type Kurzschritt = "wiederholung" | "taktik";

export interface Kurzplanschritt {
  readonly art: Kurzschritt;
  readonly minuten: number;
}

/** Die Schritte der beiden Pläne (Vorschlag der App, siehe oben). */
export const KURZPLAENE: Readonly<Record<Kurzplanart, readonly Kurzplanschritt[]>> = {
  mini: [{ art: "wiederholung", minuten: 5 }],
  kurz: [
    { art: "wiederholung", minuten: 5 },
    { art: "taktik", minuten: 10 },
  ],
};

/** Eine laufende Einheit; Zeiten in Millisekunden seit 1970 (Date.now). */
export interface Kurzeinheit {
  readonly plan: Kurzplanart;
  readonly schritt: number;
  readonly beginn: number;
  readonly schrittBeginn: number;
}

const MS_JE_MINUTE = 60_000;
const MS_JE_SEKUNDE = 1000;
const STUNDEN_JE_TAG = 24;
/** Nach so vielen Stunden gilt eine liegengebliebene Einheit als verfallen. */
const VERFALL_STUNDEN = 3;
const MINUTEN_JE_STUNDE = 60;

/** Beginnt eine Einheit mit dem ersten Schritt. */
export function starteKurzplan(plan: Kurzplanart, jetzt: number): Kurzeinheit {
  return { plan, schritt: 0, beginn: jetzt, schrittBeginn: jetzt };
}

/**
 * Schließt den Schritt ab.
 * Ausgabe: die Einheit mit dem nächsten Schritt, oder null, wenn der letzte Schritt fertig ist.
 * Beispiel: „kurz“ nach den Wiederholungen → Schritt 2 (Taktik); danach null.
 */
export function naechsterKurzschritt(e: Kurzeinheit, jetzt: number): Kurzeinheit | null {
  if (e.schritt + 1 >= KURZPLAENE[e.plan].length) return null;
  return { ...e, schritt: e.schritt + 1, schrittBeginn: jetzt };
}

/** Der aktuelle Schritt der Einheit. */
export function aktuellerKurzschritt(e: Kurzeinheit): Kurzplanschritt {
  return KURZPLAENE[e.plan][e.schritt] ?? { art: "wiederholung", minuten: 0 };
}

/**
 * Restzeit des aktuellen Schritts in Millisekunden; negativ, wenn die Zeit überschritten ist.
 * Beispiel: Wiederholungen (5 Minuten) seit 6 Minuten → −60 000.
 */
export function kurzRestMs(e: Kurzeinheit, jetzt: number): number {
  return aktuellerKurzschritt(e).minuten * MS_JE_MINUTE - (jetzt - e.schrittBeginn);
}

/** Liest eine gemerkte Einheit; Unlesbares oder Verfallenes ergibt null. */
export function kurzeinheitAus(text: string | null, jetzt: number): Kurzeinheit | null {
  if (text === null) return null;
  let roh: unknown;
  try {
    roh = JSON.parse(text);
  } catch (fehler) {
    console.warn("Kurzplan: gemerkter Stand nicht lesbar:", fehler);
    return null;
  }
  if (typeof roh !== "object" || roh === null) return null;
  const r = roh as Record<string, unknown>;
  const plan = r.plan;
  if (plan !== "mini" && plan !== "kurz") return null;
  const { schritt, beginn, schrittBeginn } = r;
  if (typeof schritt !== "number" || typeof beginn !== "number") return null;
  if (typeof schrittBeginn !== "number") return null;
  if (!Number.isInteger(schritt) || schritt < 0 || schritt >= KURZPLAENE[plan].length) return null;
  if (jetzt - beginn > VERFALL_STUNDEN * MINUTEN_JE_STUNDE * MS_JE_MINUTE) return null;
  return { plan, schritt, beginn, schrittBeginn };
}

/** Der Tag als Schlüssel „2026-10-26“ nach Ortszeit. */
export function tagesschluessel(datum: Date): string {
  const zweistellig = (z: number) => String(z).padStart(2, "0");
  return `${datum.getFullYear()}-${zweistellig(datum.getMonth() + 1)}-${zweistellig(datum.getDate())}`;
}

/** Die laufende Nummer eines Tages (Ortszeit), für die Wahl der Tagesaufgabe. */
function tagesnummer(datum: Date): number {
  const mitternacht = Date.UTC(datum.getFullYear(), datum.getMonth(), datum.getDate());
  return Math.floor(mitternacht / (STUNDEN_JE_TAG * MINUTEN_JE_STUNDE * MS_JE_MINUTE));
}

/**
 * Die Aufgabe des Tages: bei gleicher Liste an einem Tag immer dieselbe, am nächsten die nächste.
 * Beispiel: drei Aufgaben, Tag 20000 → Index 2 (20000 mod 3); am Tag danach Index 0.
 * Sonderfall: leere Liste → null.
 */
export function tagesaufgabe<T>(aufgaben: readonly T[], datum: Date): T | null {
  if (aufgaben.length === 0) return null;
  return aufgaben[tagesnummer(datum) % aufgaben.length] ?? null;
}

/** Die Serie: Tage in Folge, in denen die Tagesaufgabe bearbeitet wurde. */
export interface Tagesserie {
  readonly letzterTag: string | null;
  readonly serie: number;
  readonly beste: number;
}

export const LEERE_SERIE: Tagesserie = { letzterTag: null, serie: 0, beste: 0 };

/**
 * Trägt die Bearbeitung der Tagesaufgabe an einem Tag ein.
 * Regel: Am Tag nach dem letzten Eintrag wächst die Serie um 1, am selben Tag bleibt sie, sonst
 * beginnt sie bei 1. Beispiel: letzter Tag gestern, Serie 4 → Serie 5.
 */
export function serieNach(alt: Tagesserie, heute: Date): Tagesserie {
  const schluessel = tagesschluessel(heute);
  if (alt.letzterTag === schluessel) return alt;
  const gestern = new Date(heute.getFullYear(), heute.getMonth(), heute.getDate() - 1);
  const serie = alt.letzterTag === tagesschluessel(gestern) ? alt.serie + 1 : 1;
  return { letzterTag: schluessel, serie, beste: Math.max(alt.beste, serie) };
}

/**
 * Die Serie, wie sie heute gilt: Wurde gestern und heute nichts bearbeitet, ist sie gerissen (0).
 * Beispiel: letzter Tag vorgestern, Serie 4 → 0.
 */
export function geltendeSerie(stand: Tagesserie, heute: Date): number {
  if (stand.letzterTag === null) return 0;
  const gestern = new Date(heute.getFullYear(), heute.getMonth(), heute.getDate() - 1);
  const noch = [tagesschluessel(heute), tagesschluessel(gestern)].includes(stand.letzterTag);
  return noch ? stand.serie : 0;
}

/** Liest die gemerkte Serie; Unlesbares ergibt die leere Serie. */
export function serieAus(text: string | null): Tagesserie {
  if (text === null) return LEERE_SERIE;
  try {
    const r = JSON.parse(text) as Record<string, unknown>;
    const { letzterTag, serie, beste } = r;
    if (typeof serie !== "number" || typeof beste !== "number") return LEERE_SERIE;
    return { letzterTag: typeof letzterTag === "string" ? letzterTag : null, serie, beste };
  } catch (fehler) {
    console.warn("Kurzplan: gemerkte Serie nicht lesbar:", fehler);
    return LEERE_SERIE;
  }
}

/** Dauer der Zeitrunde „Taktik auf Zeit“ in Millisekunden (3 Minuten). */
export const ZEITRUNDE_MS = 3 * MS_JE_MINUTE;
/** Nach so vielen Fehlern endet die Zeitrunde. */
export const ZEITRUNDE_FEHLER = 3;
/** Zahl der Aufgaben, die eine Zeitrunde höchstens vorbereitet. */
export const ZEITRUNDE_AUFGABEN = 40;

/**
 * Ist die Zeitrunde zu Ende? Ja, wenn die Zeit um ist oder der dritte Fehler gemacht wurde.
 * Beispiel: 2 Fehler, 100 Sekunden → nein; 3 Fehler → ja; 181 Sekunden → ja.
 */
export function zeitrundeVorbei(beginn: number, jetzt: number, fehler: number): boolean {
  return fehler >= ZEITRUNDE_FEHLER || jetzt - beginn >= ZEITRUNDE_MS;
}

/** Restzeit der Zeitrunde in ganzen Sekunden (nie negativ). */
export function zeitrundeRestSekunden(beginn: number, jetzt: number): number {
  return Math.max(0, Math.ceil((ZEITRUNDE_MS - (jetzt - beginn)) / MS_JE_SEKUNDE));
}

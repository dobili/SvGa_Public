/**
 * Was der Autor auf der Aufgabenseite abgehakt und notiert hat, und der Text für den Chat.
 *
 * Rolle im Gesamtbild: Teil der Aufgabenseite (Wunsch des Autors vom 18.10.2026). Der Stand liegt
 * als Merker auf dem Gerät (app/merker.ts), nicht in den Nutzerdaten: Er gehört zur Arbeit am
 * Buch, nicht zum Lesen. Der Knopf „In die Zwischenablage“ legt eine Zeile je Punkt ab, im Format,
 * das die Aufgabendatei verlangt („N203 ok“, „N205 falscher Pfeil“); Claude trägt sie dann in
 * `docs/AUFGABEN_AUTOR.md` und `docs/ENTSCHEIDUNGEN.md` ein.
 * Abhängigkeiten: autor/aufgabendatei.ts (nur Typen).
 */
import type { Aufgabendatei } from "./aufgabendatei";
import { t } from "../i18n/sprache";

export interface Abhakstand {
  readonly haken: readonly string[];
  readonly notizen: Readonly<Record<string, string>>;
  /** Aufgeklappte Abschnitte (Titel), damit die Seite nach einem Link so aussieht wie vorher. */
  readonly offen: readonly string[];
  /** Zuletzt angetippter Punkt; die Seite scrollt beim Zurückkommen zu ihm. */
  readonly zuletzt: string | null;
}

/** Stand ohne Haken, Notizen und offene Punkte: Anfang und „Alles löschen“. */
export const LEERER_ABHAKSTAND: Abhakstand = { haken: [], notizen: {}, offen: [], zuletzt: null };

const istTextliste = (w: unknown): w is string[] =>
  Array.isArray(w) && w.every((x) => typeof x === "string");

function notizenAus(w: unknown): Record<string, string> {
  if (typeof w !== "object" || w === null) return {};
  return Object.fromEntries(
    Object.entries(w).filter((e): e is [string, string] => typeof e[1] === "string"),
  );
}

/** Liest den gemerkten Stand; Unlesbares ergibt den leeren Stand (mit Hinweis im Protokoll). */
export function abhakstandAus(text: string | null): Abhakstand {
  if (text === null) return LEERER_ABHAKSTAND;
  let roh: unknown;
  try {
    roh = JSON.parse(text);
  } catch (fehler) {
    console.warn("Aufgabenseite: gemerkter Stand nicht lesbar:", fehler);
    return LEERER_ABHAKSTAND;
  }
  if (typeof roh !== "object" || roh === null) return LEERER_ABHAKSTAND;
  const r = roh as Record<string, unknown>;
  return {
    haken: istTextliste(r.haken) ? r.haken : [],
    notizen: notizenAus(r.notizen),
    offen: istTextliste(r.offen) ? r.offen : [],
    zuletzt: typeof r.zuletzt === "string" ? r.zuletzt : null,
  };
}

/** Setzt oder entfernt den Haken eines Punktes. */
export function mitHaken(stand: Abhakstand, id: string, an: boolean): Abhakstand {
  const ohne = stand.haken.filter((h) => h !== id);
  return { ...stand, haken: an ? [...ohne, id] : ohne, zuletzt: id };
}

/** Setzt die Notiz eines Punktes; eine leere Notiz fällt weg. */
export function mitNotiz(stand: Abhakstand, id: string, notiz: string): Abhakstand {
  const notizen = Object.fromEntries(Object.entries(stand.notizen).filter(([k]) => k !== id));
  return {
    ...stand,
    notizen: notiz.trim() === "" ? notizen : { ...notizen, [id]: notiz },
    zuletzt: id,
  };
}

/** Klappt einen Abschnitt auf oder zu. */
export function mitAbschnitt(stand: Abhakstand, titel: string, offen: boolean): Abhakstand {
  const ohne = stand.offen.filter((o) => o !== titel);
  return { ...stand, offen: offen ? [...ohne, titel] : ohne };
}

/** Die Kennungen aller Punkte der Datei, in ihrer Reihenfolge, ohne Doppelte. */
export function alleKennungen(datei: Aufgabendatei): string[] {
  return [...new Set(datei.abschnitte.flatMap((a) => a.punkte.map((p) => p.id)))];
}

/**
 * Der Text für den Chat: eine Kopfzeile, dann je abgehaktem oder notiertem Punkt eine Zeile.
 * Beispiel: N306 abgehakt, N304 mit Notiz „Pfeil fehlt“ → „N306 ok“ und „N304: Pfeil fehlt“.
 * Sonderfall: Haken und Notiz zusammen → „N305 ok: Uhr lief weiter“. Punkte, die es in dieser
 * Datei nicht mehr gibt, fehlen (sie sind schon eingetragen).
 */
export function meldung(datei: Aufgabendatei, stand: Abhakstand, appVersion: string): string {
  const zeilen = alleKennungen(datei).flatMap((id) => {
    const ok = stand.haken.includes(id);
    const notiz = stand.notizen[id]?.trim().replace(/\s+/g, " ") ?? "";
    if (!ok && notiz === "") return [];
    if (!ok) return [`${id}: ${notiz}`];
    return [notiz === "" ? `${id} ok` : `${id} ok: ${notiz}`];
  });
  const kopf = t("autor.meldungKopf", { version: appVersion, datei: datei.version ?? "?" });
  return [kopf, ...zeilen].join("\n");
}

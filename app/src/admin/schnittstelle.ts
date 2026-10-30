/**
 * Abrufe des Dashboards bei /api/admin/ (R57).
 *
 * Rolle im Gesamtbild: Die Seite /admin/ liegt hinter Cloudflare Access; der Browser schickt das
 * Anmeldecookie von Access von selbst mit, der Worker prüft es (worker/zugang.ts). Hier stehen
 * die Typen der Antworten (aus dem Worker übernommen) und die drei Abrufe.
 * Abhängigkeiten: worker/bericht.ts, worker/meldungen.ts, worker/verwaltung.ts (nur Typen).
 */
import type { PunktMitVerlauf } from "../../worker/bericht";
import type { Meldeart } from "../../worker/meldungen";
import type { Meldestatus } from "../../worker/verwaltung";

export type { Meldeart, Meldestatus, PunktMitVerlauf };

export interface Lauf {
  zeit: string;
  stand: string | null;
  lauf: string | null;
  rot: number;
  gelb: number;
}

export interface Uebersicht {
  wer: string;
  neuesterBericht: {
    zeit: string;
    stand: string | null;
    lauf: string | null;
    punkte: PunktMitVerlauf[];
  } | null;
  laeufe: Lauf[];
  zahlen: { status: Meldestatus; art: Meldeart; anzahl: number }[];
  eingerichtet: { mail: boolean; turnstile: boolean; bericht: boolean };
}

/** Eine gespeicherte Meldung, wie D1 sie liefert. */
export interface GespeicherteMeldung {
  id: number;
  zeit: string;
  art: Meldeart;
  text: string;
  version: string | null;
  geraet: string | null;
  bildschirm: string | null;
  sprache: string | null;
  stellung: string | null;
  abbildung: string | null;
  seite: string | null;
  status: Meldestatus;
  doppelt_von: number | null;
  notiz: string | null;
}

/** Fehler mit Statuscode, damit die Seite „Kein Zugang“ von anderen Fehlern trennen kann. */
export class Abruffehler extends Error {
  constructor(readonly status: number) {
    super(`Abruf gescheitert: ${status}`);
  }
}

async function hole<T>(pfad: string, init?: RequestInit): Promise<T> {
  const antwort = await fetch(pfad, { credentials: "same-origin", ...init });
  if (!antwort.ok) throw new Abruffehler(antwort.status);
  return (await antwort.json()) as T;
}

/** Holt die Übersicht des Dashboards: Kennzahlen und Prüfpunkte mit ihrem Verlauf. */
export const ladeUebersicht = () => hole<Uebersicht>("/api/admin/uebersicht");

/** Meldungen mit einem Status; ohne Status die offenen (neu und in Arbeit). */
export const ladeMeldungen = (status: Meldestatus | null) =>
  hole<{ meldungen: GespeicherteMeldung[] }>(
    status ? `/api/admin/meldungen?status=${status}` : "/api/admin/meldungen",
  ).then((d) => d.meldungen);

export interface Aenderung {
  status: Meldestatus;
  doppeltVon?: number;
  notiz?: string;
}

/** Ändert eine Meldung (Status oder Notiz des Autors), gekennzeichnet durch ihre Nummer. */
export const aendereMeldung = (id: number, aenderung: Aenderung) =>
  hole<{ ok: true }>(`/api/admin/meldungen/${id}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(aenderung),
  });

/** Eine Seite des Wikis in der Liste (ohne Inhalt). */
export interface Wikieintrag {
  pfad: string;
  bereich: "projekt" | "code";
  titel: string;
  quelle: string;
  laenge: number;
  stand: string | null;
  zeit: string;
}

export interface Wikitreffer {
  pfad: string;
  bereich: string;
  titel: string;
  ausschnitt: string;
}

/** Alle Seiten des Wikis (Paket D). */
export const ladeWikiliste = () =>
  hole<{ seiten: Wikieintrag[] }>("/api/admin/wiki").then((d) => d.seiten);

/** Eine Seite mit Inhalt. */
export const ladeWikiseite = (pfad: string) =>
  hole<{ seite: Wikieintrag & { inhalt: string } }>(
    `/api/admin/wiki/seite?pfad=${encodeURIComponent(pfad)}`,
  ).then((d) => d.seite);

/** Suche in Titeln und Texten. */
export const sucheImWiki = (begriff: string) =>
  hole<{ treffer: Wikitreffer[] }>(`/api/admin/wiki/suche?q=${encodeURIComponent(begriff)}`).then(
    (d) => d.treffer,
  );

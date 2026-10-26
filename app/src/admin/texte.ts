/**
 * Texte des Dashboards (R57), nur Deutsch.
 *
 * Rolle im Gesamtbild: Regel 6 legt die Oberflächentexte der App in src/i18n/de.json. Das
 * Dashboard gehört aber nicht zur App der Leser: Nur der Autor sieht es, es wird nicht übersetzt
 * und nicht in die App geladen. Wie bei Impressum und Datenschutz stehen seine Texte deshalb hier
 * an einer Stelle, statt die Sprachdateien der Leser zu vergrößern.
 * Abhängigkeiten: src/admin/schnittstelle.ts (Typen).
 */
import type { Meldeart, Meldestatus } from "./schnittstelle";

/** Alle festen Texte des Dashboards, nach Bereichen geordnet; {wer} wird ersetzt. */
export const TEXTE = {
  titel: "Dashboard",
  angemeldet: "Angemeldet als {wer}",
  laden: "Lade …",
  keinZugang:
    "Kein Zugang. Bitte über schach-von-grund-auf.com/admin/ mit dem Einmalcode anmelden. Steht hier trotzdem „Kein Zugang“, fehlen im Worker noch ACCESS_TEAM und ACCESS_AUD.",
  fehler: "Abruf gescheitert ({status}). Später erneut versuchen.",
  neuLaden: "Neu laden",
  eingerichtet: "Eingerichtet",
  einrichtung: { mail: "Mailversand", turnstile: "Turnstile", bericht: "Prüfbericht-Schlüssel" },
  pruefungen: "Prüfungen",
  keinBericht: "Noch kein Prüfbericht angekommen.",
  berichtVom: "Bericht vom {zeit}",
  zumLauf: "Lauf ansehen",
  seit: "so seit {zeit}",
  zuletztGruen: "zuletzt grün {zeit}",
  nieGruen: "noch nie grün",
  letzteLaeufe: "Letzte Läufe",
  rotGelb: "{rot} rot, {gelb} gelb",
  meldungen: "Meldungen",
  keineMeldungen: "Keine Meldungen in dieser Ansicht.",
  offen: "Offen",
  speichern: "Speichern",
  gespeichert: "Gespeichert.",
  notiz: "Notiz",
  doppeltVon: "Doppelt von Nr.",
  stellungKopieren: "Stellung kopieren",
  aufgabe: "Aufgabe für Claude",
  aufgabeHinweis:
    "Fasst rote und gelbe Prüfungen und die offenen Meldungen als Auftrag zusammen. Kopiert in die Zwischenablage; in einem Chat einfügen.",
  kopiert: "Kopiert.",
  felder: {
    version: "App-Version",
    geraet: "Gerät",
    bildschirm: "Bildschirm",
    sprache: "Sprache",
    abbildung: "Abbildung",
    seite: "Seite",
    stellung: "Stellung",
  },
} as const;

/** Anzeigenamen der vier Meldearten (Fehler, Wunsch, Buchbefund, Absturzbericht). */
export const ARTEN: Record<Meldeart, string> = {
  fehler: "Fehler",
  wunsch: "Wunsch",
  buch: "Buchbefund",
  absturz: "Absturzbericht",
};

/** Anzeigenamen der Bearbeitungsstände einer Meldung (neu, in Arbeit, erledigt …). */
export const STATUSNAMEN: Record<Meldestatus, string> = {
  neu: "Neu",
  in_arbeit: "In Arbeit",
  erledigt: "Erledigt",
  kein_fehler: "Kein Fehler",
  doppelt: "Doppelt",
};

/** Setzt {name}-Platzhalter ein, wie t() in der App. */
export function mit(vorlage: string, werte: Record<string, string | number>): string {
  return vorlage.replace(/\{(\w+)\}/g, (ganz, name: string) => String(werte[name] ?? ganz));
}

/** „2026-10-24T06:17:00Z“ → „24.10.2026, 08:17“ (Ortszeit des Geräts). */
export function zeitText(iso: string): string {
  const datum = new Date(iso);
  if (Number.isNaN(datum.getTime())) return iso;
  return datum.toLocaleString("de-DE", { dateStyle: "medium", timeStyle: "short" });
}

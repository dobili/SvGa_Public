/**
 * Wochenaufträge (Gamifizierung P6): montags drei Aufträge, fest für die Woche, mit Fortschritt
 * aus dem Tagesprotokoll, einmal Tauschen je Auftrag und 15 Erfahrungspunkten je erledigtem.
 *
 * Rolle im Gesamtbild: Die Aufträge lenken zu Bereichen, die man sonst auslässt, ohne Pflicht
 * (Selbstbestimmung, gamifizierung.md Abschnitt 1): Nicht Erledigtes verschwindet am Sonntag ohne
 * Hinweis, Tauschen lässt die Wahl beim Leser. Welche Aufträge es gibt, steht als Liste in
 * training/auftragsarten.ts; ein späterer Trainer oder ein Werkzeug trägt dort eine Zeile ein
 * (Wunsch des Autors, 31.10.2026: eintragen statt umbauen). Diese Datei hält die gemeinsamen
 * Typen und die Rechnung, alles rein und ohne Speicherzugriff.
 * Fest für die Woche: Die Wahl nimmt einen Zufall mit Saat aus dem Montag (festerZufall), und die
 * Liste wird im Feld `wochen.auftraege` festgehalten, damit sie sich nicht durch neue Daten ändert.
 * Erledigte Aufträge hält das Feld `verdient` fest („auftrag:<Montag>:<Stelle>“ → Datum), damit
 * Erfahrung und Monatsabzeichen auch nach dem Wochenwechsel bleiben (nichts verfällt).
 * Abhängigkeiten: training/auftragsarten.ts, training/zufall.ts, speicher/aktivitaet.ts, Typen.
 */
import type { Ansicht } from "../app/stapel";
import type { Textschluessel } from "../i18n/sprache";
import { summeIn, wochenbeginn, wochentage } from "../speicher/aktivitaet";
import type { Nutzerdaten } from "../speicher/format";
import type { Aktivitaetsart, Wochenauftrag, Wochenstand } from "../speicher/gamifizierung";
import { AUFTRAGSARTEN } from "./auftragsarten";
import { tagesschluessel } from "./kurzplaene";
import type { Kapitelangabe } from "./naechsterSchritt";
import { festerZufall, mische, type Zufall } from "./zufall";

/** So viele Aufträge stehen in einer Woche (P6). */
export const AUFTRAEGE_JE_WOCHE = 3;
/** Erfahrungspunkte je erledigtem Auftrag (P6, ERFAHRUNGSQUELLEN). */
export const PUNKTE_JE_AUFTRAG = 15;
/** Vorsilbe der erledigten Aufträge im Feld `verdient`. */
export const AUFTRAG_VERDIENT = "auftrag:";
/** Tausch-Zufall: eigene Saat je Stelle, damit Tauschen an Stelle 1 und 2 Verschiedenes gibt. */
const TAUSCH_SAAT = 7919;
const SONNTAG = 6;
const MITTAG = 12;

/** Die festgehaltenen Aufträge einer Woche (Feld `wochen.auftraege`). */
export type Auftragsstand = NonNullable<Wochenstand["auftraege"]>;

/** Was die Wahl der Aufträge wissen darf; die Wochenkarte stellt es zusammen. */
export interface Auftragslage {
  readonly daten: Nutzerdaten;
  /** Kapitel aus dem Datenverzeichnis; leer, solange es nicht geladen ist. */
  readonly kapitel: readonly Kapitelangabe[];
  readonly jetzt: Date;
}

/** Die Lage mit dem Zufall der Woche (für Arten, die unter mehreren wählen, etwa den Trainer). */
export interface Wahllage extends Auftragslage {
  readonly zufall: Zufall;
}

/** Zeitraum einer Woche als Tagesschlüssel, beide Grenzen eingeschlossen. */
export interface Zeitraum {
  readonly von: string;
  readonly bis: string;
}

/** Wohin der Knopf führt: eine Ansicht oder „Partie gegen diesen Bot“ (vorbelegung.ts). */
export type Knopfziel =
  | { readonly art: "ansicht"; readonly ansicht: Ansicht }
  | { readonly art: "bot"; readonly bot: string };

/** Eine Prüfung: wie weit der Auftrag in der Woche ist, aus den gespeicherten Daten. */
export type Auftragspruefung = (
  daten: Nutzerdaten,
  auftrag: Wochenauftrag,
  woche: Zeitraum,
) => number;

/** Eine Art von Auftrag, eine Zeile in AUFTRAGSARTEN. */
export interface Auftragsart {
  readonly kennung: string;
  /** Satz mit {anzahl}, {wert} und {name}; bei Zielzahl 1 `textEins`, wenn es ihn gibt. */
  readonly text: Textschluessel;
  readonly textEins?: Textschluessel;
  readonly knopf: Textschluessel;
  /** Was zählt: eine Art des Tagesprotokolls (Summe der Woche) oder eine eigene Prüfung. */
  readonly zaehlt: Aktivitaetsart | Auftragspruefung;
  /** Wann passend, mit Zielzahl und Wert (Kapitel, Trainer, Stufe); null: diese Woche nicht. */
  readonly waehle: (lage: Wahllage) => Pick<Wochenauftrag, "anzahl" | "wert"> | null;
  readonly ziel: (auftrag: Wochenauftrag, daten: Nutzerdaten) => Knopfziel;
  /** Textschlüssel eines Namens zum Wert (etwa des Trainers), für {name}. */
  readonly name?: (wert: string) => Textschluessel;
}

/** Ein Auftrag mit seinem Stand in der Woche. */
export interface Auftragszeile {
  readonly stelle: number;
  readonly auftrag: Wochenauftrag;
  readonly art: Auftragsart;
  /** Fortschritt, höchstens die Zielzahl. */
  readonly erreicht: number;
  readonly erledigt: boolean;
}

/** Saat einer Woche aus ihrem Montag. Beispiel: „2026-10-26“ → 20261026. */
export function saatDerWoche(montag: string): number {
  return Number(montag.replace(/\D/g, ""));
}

/** Datum um Mitternacht (Ortszeit) aus einem Tagesschlüssel „JJJJ-MM-TT“. */
function datumAus(schluessel: string): Date {
  const [jahr = 0, monat = 1, tag = 1] = schluessel.split("-").map(Number);
  return new Date(jahr, monat - 1, tag);
}

/** Montag und Sonntag der Woche, die an diesem Montag beginnt. */
export function zeitraumAb(montag: string): Zeitraum {
  return { von: montag, bis: wochentage(datumAus(montag))[SONNTAG] ?? montag };
}

/** Der Montag der laufenden Woche als Tagesschlüssel. */
export function montagDerWoche(jetzt: Date): string {
  return tagesschluessel(wochenbeginn(jetzt));
}

/** Ein Auftrag einer Art, wenn sie passt. */
function auftragDer(art: Auftragsart, lage: Wahllage): Wochenauftrag | null {
  const wahl = art.waehle(lage);
  return wahl && wahl.anzahl > 0 ? { art: art.kennung, anzahl: wahl.anzahl, wert: wahl.wert } : null;
}

/** Die passenden Aufträge in der Reihenfolge eines Zufalls, ohne die ausgeschlossenen Arten. */
function passende(
  lage: Auftragslage,
  zufall: Zufall,
  arten: readonly Auftragsart[],
  ohne: ReadonlySet<string>,
): Wochenauftrag[] {
  const wahllage = { ...lage, zufall };
  return mische(arten, zufall)
    .filter((art) => !ohne.has(art.kennung))
    .flatMap((art) => auftragDer(art, wahllage) ?? []);
}

/**
 * Die drei Aufträge einer Woche, fest durch die Saat aus dem Montag.
 *
 * Eingaben: Lage, optional eigene Arten (Tests). Ausgabe: höchstens drei Aufträge verschiedener
 * Arten. Beispiel: gleiche Woche, gleiche Daten → dieselben drei Aufträge.
 */
export function waehleAuftraege(
  lage: Auftragslage,
  arten: readonly Auftragsart[] = AUFTRAGSARTEN,
): Wochenauftrag[] {
  const zufall = festerZufall(saatDerWoche(montagDerWoche(lage.jetzt)));
  return passende(lage, zufall, arten, new Set()).slice(0, AUFTRAEGE_JE_WOCHE);
}

/**
 * Die Aufträge der laufenden Woche: die festgehaltenen, wenn sie zu dieser Woche gehören, sonst
 * eine neue Wahl (noch nicht gespeichert; das macht die Wochenkarte).
 */
export function auftraegeDerWoche(
  stand: Wochenstand["auftraege"],
  lage: Auftragslage,
  arten: readonly Auftragsart[] = AUFTRAGSARTEN,
): Auftragsstand {
  const montag = montagDerWoche(lage.jetzt);
  if (stand?.woche === montag) return stand;
  return { woche: montag, liste: waehleAuftraege(lage, arten), getauscht: [] };
}

/** Fortschritt eines Auftrags in der Woche ab `montag`; unbekannte Art (spätere Version) → 0. */
export function fortschritt(
  auftrag: Wochenauftrag,
  daten: Nutzerdaten,
  montag: string,
  arten: readonly Auftragsart[] = AUFTRAGSARTEN,
): number {
  const art = arten.find((a) => a.kennung === auftrag.art);
  if (!art) return 0;
  const woche = zeitraumAb(montag);
  return typeof art.zaehlt === "string"
    ? summeIn(daten.aktivitaet, art.zaehlt, woche.von, woche.bis)
    : art.zaehlt(daten, auftrag, woche);
}

/** Die Aufträge mit Stand; Aufträge unbekannter Art fallen weg. */
export function auftragszeilen(
  stand: Auftragsstand,
  daten: Nutzerdaten,
  arten: readonly Auftragsart[] = AUFTRAGSARTEN,
): Auftragszeile[] {
  return stand.liste.flatMap((auftrag, stelle) => {
    const art = arten.find((a) => a.kennung === auftrag.art);
    if (!art) return [];
    const erreicht = Math.min(fortschritt(auftrag, daten, stand.woche, arten), auftrag.anzahl);
    return [{ stelle, auftrag, art, erreicht, erledigt: erreicht >= auftrag.anzahl }];
  });
}

/** Schlüssel eines erledigten Auftrags im Feld `verdient`. Beispiel: „auftrag:2026-10-26:1“. */
export function auftragsschluessel(woche: string, stelle: number): string {
  return `${AUFTRAG_VERDIENT}${woche}:${stelle}`;
}

/**
 * Der Auftrag, den „Tauschen“ an dieser Stelle gibt, oder null (schon getauscht, erledigt oder
 * nichts anderes passend). Fest wie die Wahl: Saat aus Montag und Stelle.
 * Beispiel: Stelle 0 „Löse 3 Übungen“ → „Wiederhole 5 fällige Karten“, solange die nicht schon
 * in der Liste steht.
 */
export function tauschauftrag(
  stand: Auftragsstand,
  stelle: number,
  lage: Auftragslage,
  arten: readonly Auftragsart[] = AUFTRAGSARTEN,
): Wochenauftrag | null {
  if (stand.getauscht.includes(stelle) || stelle >= stand.liste.length) return null;
  const zeile = auftragszeilen(stand, lage.daten, arten).find((z) => z.stelle === stelle);
  if (zeile?.erledigt) return null;
  const zufall = festerZufall(saatDerWoche(stand.woche) + TAUSCH_SAAT * (stelle + 1));
  const ohne = new Set(stand.liste.map((a) => a.art));
  return passende(lage, zufall, arten, ohne)[0] ?? null;
}

/** Der Stand nach dem Tausch an einer Stelle; ohne möglichen Tausch unverändert. */
export function mitTausch(
  stand: Auftragsstand,
  stelle: number,
  lage: Auftragslage,
  arten: readonly Auftragsart[] = AUFTRAGSARTEN,
): Auftragsstand {
  const neu = tauschauftrag(stand, stelle, lage, arten);
  if (!neu) return stand;
  return {
    ...stand,
    liste: stand.liste.map((a, i) => (i === stelle ? neu : a)),
    getauscht: [...stand.getauscht, stelle].sort((a, b) => a - b),
  };
}

/** Schlüssel der erledigten Aufträge, die noch nicht in `verdient` stehen. */
export function neuErledigte(
  stand: Auftragsstand,
  daten: Nutzerdaten,
  arten: readonly Auftragsart[] = AUFTRAGSARTEN,
): string[] {
  return auftragszeilen(stand, daten, arten)
    .filter((z) => z.erledigt)
    .map((z) => auftragsschluessel(stand.woche, z.stelle))
    .filter((s) => daten.verdient[s] === undefined);
}

/** Trägt Schlüssel mit Datum in `verdient` ein; schon gesetzte bleiben. */
function mitDatum(daten: Nutzerdaten, schluessel: readonly string[], datum: string): Nutzerdaten {
  const neu = schluessel.filter((s) => daten.verdient[s] === undefined);
  if (neu.length === 0) return daten;
  const dazu = Object.fromEntries(neu.map((s) => [s, datum]));
  return { ...daten, verdient: { ...daten.verdient, ...dazu } };
}

/**
 * Hält die Aufträge der Woche fest und erledigte in `verdient` (rein).
 *
 * Eingaben: Daten, Aufträge der laufenden Woche, Zeitpunkt. Ausgabe: neue Daten.
 * Sonderfall Wochenwechsel: Erledigte der alten Woche kommen mit dem Sonntag dieser Woche dazu,
 * auch wenn die Karte seitdem nicht offen war; sonst verschwindet die alte Liste still.
 * Beispiel: Montag, alte Liste mit zwei erledigten → zwei Schlüssel der alten Woche, neue Liste.
 */
export function mitAuftraegen(
  daten: Nutzerdaten,
  stand: Auftragsstand,
  jetzt: Date,
  arten: readonly Auftragsart[] = AUFTRAGSARTEN,
): Nutzerdaten {
  let neu = daten;
  const alt = daten.wochen.auftraege;
  if (alt && alt.woche !== stand.woche) {
    const sonntag = datumAus(zeitraumAb(alt.woche).bis);
    sonntag.setHours(MITTAG);
    neu = mitDatum(neu, neuErledigte(alt, neu, arten), sonntag.toISOString());
  }
  if (alt !== stand) neu = { ...neu, wochen: { ...neu.wochen, auftraege: stand } };
  return mitDatum(neu, neuErledigte(stand, neu, arten), jetzt.toISOString());
}

/** Alle erledigten Aufträge (Zahl der Schlüssel „auftrag:…“ in `verdient`). */
export function erledigteAuftraege(verdient: Readonly<Record<string, string>>): number {
  return Object.keys(verdient).filter((s) => s.startsWith(AUFTRAG_VERDIENT)).length;
}

/**
 * Die meisten erledigten Aufträge in einem Kalendermonat (Ortszeit), für das Monatsabzeichen.
 * Beispiel: fünf im Oktober, acht im November → 8.
 */
export function besterMonat(verdient: Readonly<Record<string, string>>): number {
  const jeMonat = new Map<string, number>();
  for (const [schluessel, datum] of Object.entries(verdient)) {
    if (!schluessel.startsWith(AUFTRAG_VERDIENT)) continue;
    const tag = new Date(datum);
    if (Number.isNaN(tag.getTime())) continue;
    const monat = tagesschluessel(tag).slice(0, "JJJJ-MM".length);
    jeMonat.set(monat, (jeMonat.get(monat) ?? 0) + 1);
  }
  return Math.max(0, ...jeMonat.values());
}

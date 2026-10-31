/**
 * Die Stücke der Karte „Deine Erfolge“ (Profil neu, Entwurf C „Glanzstück und Regale“, Wahl des
 * Autors 31.10.2026): alle Orden und Abzeichen mit Namen, Bedingung und Fortschritt, die Regale
 * als Liste, das zuletzt verdiente Stück und die, denen am wenigsten fehlt. Reine Funktionen.
 *
 * Rolle im Gesamtbild: Bisher standen Orden als Ringe in „Dein Fortschritt“ und Abzeichen als
 * aufklappbares Gitter. Jetzt sammelt eine Karte beides. Wunsch des Autors: eintragen statt
 * umbauen. Ein neuer Bereich ist eine Zeile in ERFOLGSREGALE (Kennung, Titel, Stücke aus der
 * Quelle); ein neues Abzeichen kommt über ABZEICHEN von selbst ins Regal „Abzeichen“ und, wenn es
 * ein Feld `fortschritt` hat, auch unter „Als Nächstes“. Die Orden kommen aus den Ringen
 * (fortschritt/fortschrittsringe.ts), das Datum aus „verdient“ (speicher/verdient.ts).
 * Abhängigkeiten: fortschritt/abzeichen.ts, fortschritt/abzeichenstand.ts (Typ),
 * fortschritt/ringrechnung.ts, fortschritt/Symbolringe.tsx (Typ), ordenkunst/entwuerfe.ts,
 * speicher/fortschritt.ts (Typ), i18n, lucide-react (Typ).
 */
import type { LucideIcon } from "lucide-react";
import { t, type Textschluessel } from "../../../i18n/sprache";
import type { Anteil } from "../../../speicher/fortschritt";
import { ABZEICHEN, abzeichenbedingung, abzeichenname } from "../fortschritt/abzeichen";
import type { Abzeichenstand } from "../fortschritt/abzeichenstand";
import { ENGINEBUENDEL, istVoll } from "../fortschritt/ringrechnung";
import type { Symbolringangabe } from "../fortschritt/Symbolringe";
import { ordenkennungAusRing, type Stueckart } from "../ordenkunst/entwuerfe";

/** Ein Orden oder Abzeichen der Karte. */
export interface Erfolgsstueck {
  readonly art: Stueckart;
  /** Kennung wie in „verdient“ und in ordenkunst („uebungen“, „erstesMatt“). */
  readonly kennung: string;
  /** Kurzer Name unter dem Bild. */
  readonly name: string;
  /** Der Satz zur Bedingung (Tipp im Regal, rechts im Glanzstück). */
  readonly bedingung: string;
  readonly symbol: LucideIcon;
  /** Zählbarer Fortschritt; null, wenn er sich nicht zählen lässt. */
  readonly anteil: Anteil | null;
  readonly verdient: boolean;
  /** Bei Orden: testid des Rings (für Bild und Teilen). */
  readonly ring: string | null;
}

/** Woraus die Stücke kommen: die Ringe des Fortschritts und der Stand der Abzeichen. */
export interface Erfolgsquelle {
  readonly buchringe: readonly Symbolringangabe[];
  readonly teilringe: readonly Symbolringangabe[];
  readonly botringe: readonly Symbolringangabe[];
  readonly stand: Abzeichenstand;
}

/** Ein Regal: Kennung (auch testid „erfolge-regal-<k>“), Titel, Stücke. */
export interface Erfolgsregal {
  readonly kennung: string;
  readonly titel: Textschluessel;
  readonly stuecke: (quelle: Erfolgsquelle) => Erfolgsstueck[];
}

/** So viele Stücke stehen höchstens unter „Als Nächstes“. */
export const NAECHSTE_HOECHSTENS = 4;

/** Kurzer Name eines Rings: Buch wie der Ring, Teil mit seinem Namen, Bots „Stufe 1–3 einmal“. */
function kurzname(ring: Symbolringangabe): string {
  if (ring.testid.startsWith("ich-teil-") && ring.legende) return ring.legende;
  if (!ring.testid.startsWith("ich-bots-")) return ring.name;
  const vorne = ring.name.split(":")[0] ?? ring.name;
  if (ring.testid === `ich-bots-${ENGINEBUENDEL}`) return vorne;
  const art = ring.testid.endsWith("-alle") ? "alle" : "einmal";
  return t(`profil.erfolge.bot.${art}`, { stufen: vorne });
}

/**
 * Kurzer Satz zur Bedingung eines Rings (Glanzstück rechts, Tipp im Regal).
 * Beispiel: Teil Endspiel mit 178 Inhalten → „Alle 178 Abbildungen und Übungen des Buchteils“;
 * Bots → „Stufe 1–3: jeden Bot einmal besiegt“ (ohne Klammer); Buch → „Übungen gelöst: alle 86“.
 */
function kurzbedingung(ring: Symbolringangabe): string {
  const gesamt = ring.anteil.gesamt;
  if (ring.testid.startsWith("ich-teil-")) return t("profil.erfolge.bedingung.teil", { gesamt });
  if (ring.testid.startsWith("ich-bots-")) return ring.name.replace(/\s*\(.*\)$/, "");
  return t("profil.erfolge.bedingung.alle", { name: ring.name, gesamt });
}

/** Ein Ring als Orden. Beispiel: Ring „Übungen gelöst“ 3 von 86 → offener Orden „uebungen“. */
export function ordenAusRing(ring: Symbolringangabe): Erfolgsstueck {
  return {
    art: "orden",
    kennung: ordenkennungAusRing(ring.testid),
    name: kurzname(ring),
    bedingung: kurzbedingung(ring),
    symbol: ring.symbol,
    anteil: ring.anteil,
    verdient: istVoll(ring.anteil),
    ring: ring.testid,
  };
}

/** Alle Abzeichen mit Fortschritt, wo er sich zählen lässt. */
function abzeichenstuecke(stand: Abzeichenstand): Erfolgsstueck[] {
  return ABZEICHEN.map((a) => ({
    art: "abzeichen",
    kennung: a.kennung,
    name: abzeichenname(a.kennung),
    bedingung: abzeichenbedingung(a.kennung),
    symbol: a.symbol,
    anteil: a.fortschritt ? a.fortschritt(stand.grundlage) : null,
    verdient: stand.verdient.has(a.kennung),
    ring: null,
  }));
}

/** Die Regale in ihrer Reihenfolge; ein neuer Bereich ist eine Zeile. */
export const ERFOLGSREGALE: readonly Erfolgsregal[] = [
  {
    kennung: "buch",
    titel: "profil.erfolge.regal.buch",
    stuecke: (q) => q.buchringe.map(ordenAusRing),
  },
  {
    kennung: "teile",
    titel: "profil.erfolge.regal.teile",
    stuecke: (q) => q.teilringe.map(ordenAusRing),
  },
  {
    kennung: "bots",
    titel: "profil.erfolge.regal.bots",
    stuecke: (q) => q.botringe.map(ordenAusRing),
  },
  {
    kennung: "abzeichen",
    titel: "profil.erfolge.regal.abzeichen",
    stuecke: (q) => abzeichenstuecke(q.stand),
  },
];

/** Schlüssel eines Stücks in „verdient“. Beispiel: Orden „uebungen“ → „orden:uebungen“. */
export function verdientSchluessel(stueck: Pick<Erfolgsstueck, "art" | "kennung">): string {
  return `${stueck.art}:${stueck.kennung}`;
}

/**
 * Das zuletzt verdiente Stück mit Datum; null ohne Eintrag in „verdient“.
 * Warum nur aus „verdient“: Dort steht das Datum der ersten Feier; ein Stück der Probe hat keins.
 * Beispiel: „orden:teil-endspiel“ am 30.10. und „abzeichen:warum“ am 29.10. → Teil Endspiel.
 */
export function zuletztVerdient(
  stuecke: readonly Erfolgsstueck[],
  verdient: Readonly<Record<string, string>>,
): { stueck: Erfolgsstueck; datum: string } | null {
  let bestes: { stueck: Erfolgsstueck; datum: string } | null = null;
  for (const stueck of stuecke) {
    const datum = verdient[verdientSchluessel(stueck)];
    if (!stueck.verdient || !datum) continue;
    if (!bestes || datum > bestes.datum) bestes = { stueck, datum };
  }
  return bestes;
}

/** Wie viel noch fehlt, als Anteil (0 = fertig). */
function rest(anteil: Anteil): number {
  return anteil.gesamt > 0 ? 1 - anteil.erreicht / anteil.gesamt : 1;
}

/**
 * Die offenen Stücke mit zählbarem Fortschritt, denen am wenigsten fehlt: zuerst nach Anteil,
 * bei Gleichstand das mit weniger fehlenden Schritten. Beispiel: „Fünfzig Partien“ 41 von 50 vor
 * „Stufe 6–7 alle“ 19 von 24. Sonderfall: doppelte Stücke (in zwei Regalen) zählen einmal.
 */
export function naechsteStuecke(
  stuecke: readonly Erfolgsstueck[],
  hoechstens = NAECHSTE_HOECHSTENS,
): Erfolgsstueck[] {
  const gesehen = new Set<string>();
  const offen = stuecke.filter((s) => {
    const schluessel = verdientSchluessel(s);
    if (s.verdient || !s.anteil || s.anteil.gesamt === 0 || gesehen.has(schluessel)) return false;
    gesehen.add(schluessel);
    return true;
  });
  return offen
    .sort((a, b) => {
      const ra = a.anteil ? rest(a.anteil) : 1;
      const rb = b.anteil ? rest(b.anteil) : 1;
      if (ra !== rb) return ra - rb;
      const fa = a.anteil ? a.anteil.gesamt - a.anteil.erreicht : 0;
      const fb = b.anteil ? b.anteil.gesamt - b.anteil.erreicht : 0;
      return fa - fb;
    })
    .slice(0, hoechstens);
}

/**
 * Fehlerprofil eigener Gegner in Gruppen: neun Regler, fünf Achsen des Netzes, fünf Gruppen der
 * blinden Flecken, Vorlagen und der Speicherweg für gestrichene Arten (seit 0.2.135).
 *
 * Rolle im Gesamtbild: Auftrag „Variante A“ des Koordinierungschats (vom Autor am 25.10.2026
 * freigegeben) und die Netz-Vorschau (E1 bis E4, am selben Tag freigegeben). Die statistische
 * Auswertung an etwa 1 280 Spielerprofilen (Zuverlässigkeit nach Spearman-Brown, Trennbarkeit der
 * Stufen je Elo-Band) zeigte: Mehrere Regler messen kaum ein echtes Merkmal, die Flecken einzeln
 * sind zu schwach, als Gruppen tragen sie. Gespeichert wird weiter je Art und Fleck
 * (EigenerGegner), es gibt keine Migration: Eine Gruppe zeigt den Mittelwert ihrer eingeschalteten
 * Mitglieder und schreibt beim Setzen denselben Wert in alle. Die Engine bleibt unverändert.
 * Abhängigkeiten: fehlerprofil.ts, engine/fehlerart.ts, engine/blindeFlecken.ts.
 */
import type { BlinderFleck } from "../../engine/blindeFlecken";
import { FEHLERARTEN, type Fehlerart } from "../../engine/fehlerart";
import type { EigenerGegner } from "../../engine/gegner";
import { t, type Textschluessel } from "../../i18n/sprache";
import {
  istAn,
  setzeStufe,
  setzeVerlust,
  stufeVon,
  verlustVon,
  type Profilart,
} from "./fehlerprofil";

/** Die neun Regler der Feinansicht; „Eröffnungsfehler“ schreibt in drei Arten. */
export const FEHLERREGLER = [
  { kennung: "figurHaengen", arten: ["figurHaengen"] },
  { kennung: "drohungIgnoriert", arten: ["drohungIgnoriert"] },
  { kennung: "taktikUebersehen", arten: ["taktikUebersehen"] },
  { kennung: "schlagVerpasst", arten: ["schlagVerpasst"] },
  { kennung: "koenigMitte", arten: ["koenigMitte"] },
  { kennung: "koenigsschild", arten: ["koenigsschild"] },
  { kennung: "bauernvorstoss", arten: ["bauernvorstoss"] },
  { kennung: "bauernzugOhneNot", arten: ["bauernzugOhneNot"] },
  { kennung: "eroeffnungsfehler", arten: ["verfruehteDame", "tempoverlust", "bauernraub"] },
] as const satisfies readonly { kennung: string; arten: readonly Fehlerart[] }[];

export type Reglerkennung = (typeof FEHLERREGLER)[number]["kennung"];

/** Die fünf Achsen des Fehlernetzes (E2) mit ihren Reglern. */
export const FEHLERACHSEN = [
  { kennung: "figuren", regler: ["figurHaengen", "drohungIgnoriert"] },
  { kennung: "taktik", regler: ["taktikUebersehen", "schlagVerpasst"] },
  { kennung: "koenig", regler: ["koenigMitte", "koenigsschild"] },
  { kennung: "bauernzuege", regler: ["bauernvorstoss", "bauernzugOhneNot"] },
  { kennung: "eroeffnung", regler: ["eroeffnungsfehler"] },
] as const satisfies readonly { kennung: string; regler: readonly Reglerkennung[] }[];

export type Achsenkennung = (typeof FEHLERACHSEN)[number]["kennung"];

/** Die fünf Gruppen der blinden Flecken; eine Gruppe an heißt: alle Mitglieder an. */
export const FLECKENGRUPPEN = [
  { kennung: "ruhig", flecken: ["ruhig"] },
  { kennung: "bauer", flecken: ["bauer"] },
  { kennung: "rueckzug", flecken: ["rueckzug", "springer"] },
  { kennung: "fernwirkung", flecken: ["diagonale", "turm", "dame", "roentgen"] },
  { kennung: "wendungen", flecken: ["zwischenzug", "abzug", "grundreihe"] },
] as const satisfies readonly { kennung: string; flecken: readonly BlinderFleck[] }[];

export type Fleckengruppe = (typeof FLECKENGRUPPEN)[number]["kennung"];

/** Arten ohne Regler (Variante A, Punkt 1); „pattGesetzt“ bleibt als Schalter „setzt nie Patt“. */
export const GESTRICHENE_ARTEN: readonly Fehlerart[] = [
  "schlagreflex",
  "bauerEingestellt",
  "falscherAbtausch",
  "koenigPassiv",
  "koenigszugOhneNot",
  "ungenau",
];

const PATT: Fehlerart = "pattGesetzt";

/** Alle Arten der neun Regler (elf Arten). */
export const REGLER_ARTEN: readonly Fehlerart[] = FEHLERREGLER.flatMap((r) => r.arten);

/** Die Arten eines Reglers oder einer Achse. */
export function artenDesReglers(kennung: Reglerkennung): readonly Fehlerart[] {
  return FEHLERREGLER.find((r) => r.kennung === kennung)?.arten ?? [];
}

export function artenDerAchse(kennung: Achsenkennung): readonly Fehlerart[] {
  const achse = FEHLERACHSEN.find((a) => a.kennung === kennung);
  return (achse?.regler ?? []).flatMap((r) => artenDesReglers(r));
}

/**
 * Die Stufe einer Gruppe: gerundeter Mittelwert der eingeschalteten Mitglieder, null, wenn
 * keines an ist. Beispiel: Eröffnungsfehler mit Dame 2, Tempo 1, Bauernraub aus → 2 (1,5 gerundet).
 */
export function gruppenstufe(g: EigenerGegner, arten: readonly Profilart[]): number | null {
  const an = arten.map((a) => stufeVon(g, a)).filter((s): s is number => s !== null);
  if (an.length === 0) return null;
  return Math.round(an.reduce((summe, s) => summe + s, 0) / an.length) || 0;
}

/** Haben alle Mitglieder dieselbe Stufe (oder sind alle aus)? */
export function istEinheitlich(g: EigenerGegner, arten: readonly Profilart[]): boolean {
  return new Set(arten.map((a) => stufeVon(g, a))).size <= 1;
}

/** Setzt alle Mitglieder einer Gruppe auf dieselbe Stufe (null: alle aus). */
export function setzeGruppe(
  g: EigenerGegner,
  arten: readonly Profilart[],
  stufe: number | null,
): EigenerGegner {
  return arten.reduce((neu, art) => setzeStufe(neu, art, stufe), g);
}

/** „Setzt nie Patt“: an, wenn die Art „patt gesetzt“ aus ist. */
export function setztNiePatt(g: EigenerGegner): boolean {
  return !istAn(g, PATT);
}

export function mitNiePatt(g: EigenerGegner, nie: boolean): EigenerGegner {
  return setzeStufe(g, PATT, nie ? null : 0);
}

/**
 * Der gemeinsame Höchstverlust der Regler (E3): der Wert, wenn alle gleich sind, sonst der
 * häufigste mit `einheitlich: false`. Beispiel: alle unbegrenzt → { wert: null, einheitlich: true }.
 */
export function gemeinsamerVerlust(g: EigenerGegner): {
  wert: number | null;
  einheitlich: boolean;
} {
  const werte = REGLER_ARTEN.map((a) => verlustVon(g, a));
  const zaehler = new Map<number | null, number>();
  for (const w of werte) zaehler.set(w, (zaehler.get(w) ?? 0) + 1);
  const [wert] = [...zaehler.entries()].sort((x, y) => y[1] - x[1])[0] ?? [null];
  return { wert: wert ?? null, einheitlich: zaehler.size <= 1 };
}

/** Setzt den Höchstverlust aller Regler auf denselben Wert (null: unbegrenzt). */
export function mitVerlustFuerAlle(g: EigenerGegner, bauern: number | null): EigenerGegner {
  return REGLER_ARTEN.reduce((neu, art) => setzeVerlust(neu, art, bauern), g);
}

/**
 * Der Gegner mit neutralen gestrichenen Arten: Stufe, altes Gewicht und Höchstverlust fallen weg
 * (wie Menschen), eingeschaltet sind sie genau dann, wenn irgendein Regler an ist. So bleibt
 * „Keine Fehler“ fehlerfrei, sonst machen sie die Fehler wie Menschen. Vorher gespeicherte Werte
 * gelten bis hierher weiter (Variante A, Punkt 3).
 * Beispiel: alter Gegner mit „Schlagreflex sehr oft“ → Schlagreflex an, ohne Stufe.
 */
export function neutralisiert(g: EigenerGegner): EigenerGegner {
  const reglerAn = REGLER_ARTEN.some((a) => istAn(g, a));
  const gestrichen = (a: string) => (GESTRICHENE_ARTEN as readonly string[]).includes(a);
  const ohne = <T>(werte: Readonly<Partial<Record<string, T>>> | undefined) =>
    werte && Object.fromEntries(Object.entries(werte).filter(([a]) => !gestrichen(a)));
  const neu: EigenerGegner = {
    ...g,
    fehlerarten: FEHLERARTEN.filter((a) => (gestrichen(a) ? reglerAn : g.fehlerarten.includes(a))),
    ...(g.reglerstufen ? { reglerstufen: ohne(g.reglerstufen) } : {}),
    ...(g.gewichte ? { gewichte: ohne(g.gewichte) } : {}),
    ...(g.hoechstverlust ? { hoechstverlust: ohne(g.hoechstverlust) } : {}),
  };
  return neu;
}

/** Die Wirkung einer Art: an, Stufe, altes Gewicht, Höchstverlust (fehlend wie Menschen). */
function wirkung(g: EigenerGegner, art: Fehlerart): string {
  return JSON.stringify([
    istAn(g, art),
    g.reglerstufen?.[art] ?? 0,
    g.gewichte?.[art] ?? 1,
    verlustVon(g, art),
  ]);
}

/**
 * Gestrichene Arten, deren gespeicherte Einstellung beim Neutralisieren verloren geht (für den
 * Hinweis vor dem Speichern). Beispiel: alter Gegner mit „Schlagreflex aus“ → ["schlagreflex"].
 */
export function alteEinstellungen(g: EigenerGegner): readonly Fehlerart[] {
  const neutral = neutralisiert(g);
  return GESTRICHENE_ARTEN.filter((a) => wirkung(g, a) !== wirkung(neutral, a));
}

/** Eine Vorlage: Stufe je Achse oder Gruppe in der Reihenfolge der Achsen; null heißt aus. */
type Netzwerte = readonly (number | null)[];

const ALLE_AUS: Netzwerte = [null, null, null, null, null];

/** Vorlagen der Fehler (Netz-Vorschau, vom Autor am 25.10.2026 freigegeben). */
export const FEHLERVORLAGEN = {
  wieMenschen: [0, 0, 0, 0, 0],
  solide: [-1, -1, -1, -1, -1],
  leichtsinnig: [2, 1, 0, 0, 0],
  koenigsunsicher: [0, 0, 2, 1, 0],
  taktischBlind: [1, 2, 0, 0, 0],
  eroeffnungssuender: [0, 0, 1, 0, 2],
  fehlerfrei: ALLE_AUS,
} as const satisfies Readonly<Record<string, Netzwerte>>;

/** Vorlagen der blinden Flecken in der Reihenfolge der Gruppen. */
export const FLECKENVORLAGEN = {
  wieMenschen: [0, 0, 0, 0, 0],
  keine: ALLE_AUS,
  kurzsichtig: [0, 0, 0, 2, 1],
  ueberrumpelbar: [0, 0, 1, 0, 2],
} as const satisfies Readonly<Record<string, Netzwerte>>;

export type Fehlervorlage = keyof typeof FEHLERVORLAGEN;
export type Fleckenvorlage = keyof typeof FLECKENVORLAGEN;

/**
 * Wendet eine Fehlervorlage an: jede Achse auf ihren Wert, Häufigkeit 1, Höchstverluste wie
 * Menschen, gestrichene Arten neutral; „Keine Fehler“ schaltet auch „patt gesetzt“ aus.
 * Beispiel: „leichtsinnig“ → Figuren sehr oft, Taktik oft, alles andere normal.
 */
export function mitFehlervorlage(g: EigenerGegner, name: Fehlervorlage): EigenerGegner {
  const werte: Netzwerte = FEHLERVORLAGEN[name];
  let neu = FEHLERACHSEN.reduce(
    (x, achse, i) => setzeGruppe(x, artenDerAchse(achse.kennung), werte[i] ?? null),
    g,
  );
  if (name === "fehlerfrei") neu = mitNiePatt(neu, true);
  neu = neutralisiert({ ...neu, haeufigkeit: 1, hoechstverlust: {} });
  delete (neu as { gewichte?: unknown }).gewichte;
  return neu;
}

export function istFehlervorlage(g: EigenerGegner, name: Fehlervorlage): boolean {
  const werte: Netzwerte = FEHLERVORLAGEN[name];
  return (
    (g.haeufigkeit ?? 1) === 1 &&
    REGLER_ARTEN.every((a) => verlustVon(g, a) === null) &&
    FEHLERACHSEN.every((achse, i) =>
      artenDerAchse(achse.kennung).every((a) => stufeVon(g, a) === (werte[i] ?? null)),
    )
  );
}

export function mitFleckenvorlage(g: EigenerGegner, name: Fleckenvorlage): EigenerGegner {
  const werte: Netzwerte = FLECKENVORLAGEN[name];
  return FLECKENGRUPPEN.reduce((x, gr, i) => setzeGruppe(x, gr.flecken, werte[i] ?? null), g);
}

export function istFleckenvorlage(g: EigenerGegner, name: Fleckenvorlage): boolean {
  const werte: Netzwerte = FLECKENVORLAGEN[name];
  return FLECKENGRUPPEN.every((gr, i) =>
    gr.flecken.every((f) => stufeVon(g, f) === (werte[i] ?? null)),
  );
}

/** Wie viele Regler und Fleckengruppen an sind (Zahl an den Reitern). */
export function anzahlAn(g: EigenerGegner): { regler: number; flecken: number } {
  return {
    regler: FEHLERREGLER.filter((r) => gruppenstufe(g, r.arten) !== null).length,
    flecken: FLECKENGRUPPEN.filter((gr) => gruppenstufe(g, gr.flecken) !== null).length,
  };
}

/** Name eines Reglers: die Fehlerart, bei „Eröffnungsfehler“ ein eigener Text. */
export function reglername(kennung: Reglerkennung): string {
  return kennung === "eroeffnungsfehler"
    ? t("spielen.profil.regler.eroeffnungsfehler")
    : t(`fehlerart.${kennung}` as Textschluessel);
}

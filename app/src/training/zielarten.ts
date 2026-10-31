/**
 * Die Arten eigener Ziele (Gamifizierung P13) als Liste: Bot besiegen, Ring voll (Orden), alle
 * Übungen eines Kapitels. Je Art: Stand, Anzeige mit Knopf, Kurzform für „Ziel erreicht“.
 *
 * Rolle im Gesamtbild: ziele.ts prüft und heftet an, zielvorschlaege.ts schlägt vor, die Karte zeigt
 * an; alle fragen nur diese Liste. Spätere Pakete tragen je eine Zeile ein (Wunsch des Autors,
 * 31.10.2026: eintragen statt umbauen): Meisterschaft P3 die Art „thema“ („Fesselung auf Gold“,
 * im Speicher schon vorgesehen), ein neuer Trainer eine eigene Art, sobald der Speicher sie kennt.
 * Ziele einer Art, die hier (noch) fehlt, bleiben gespeichert, werden aber weder gezeigt noch
 * geprüft.
 * Abhängigkeiten: zielringe.ts, zieltypen.ts, speicher/gamifizierung.ts (Typ Ziel),
 * speicher/besiegt.ts, engine/gegner.ts, daten/uebungsliste-daten.ts.
 */
import { UEBUNGEN_JE_KAPITEL } from "../daten/uebungsliste-daten";
import { gegnername } from "../engine/gegner";
import type { Textschluessel } from "../i18n/sprache";
import { irgendwoBesiegt } from "../speicher/besiegt";
import type { Nutzerdaten } from "../speicher/format";
import type { Anteil } from "../speicher/fortschritt";
import type { Ziel } from "../speicher/gamifizierung";
import { offeneUebungen, ringstaende, teilorden } from "./zielringe";
import type { Zielanzeige, Zielkontext, Zieltext } from "./zieltypen";

/** Eine Art von Ziel. Jede Funktion bekommt jedes Ziel und antwortet nur für ihre Art. */
export interface Zielart {
  readonly art: string;
  /** Fortschritt; null, wenn er sich gerade nicht bestimmen lässt (dann nie erreicht). */
  readonly stand: (ziel: Ziel, kontext: Zielkontext) => Anteil | null;
  readonly anzeige: (ziel: Ziel, kontext: Zielkontext) => Zielanzeige | null;
  /** Kurzform für „Ziel erreicht: …“ und die Liste „Erreichte Ziele“. */
  readonly kurz: (ziel: Ziel, daten: Nutzerdaten) => Zieltext | null;
}

/** Name eines Bots (vorgefertigt oder eigen). */
function botname(bot: string, daten: Nutzerdaten): string {
  return gegnername(bot, null, daten.spiel.eigeneGegner) ?? bot;
}

/** Regel des Ziels „Bot besiegen“: Sieg in einer gewerteten Partie, in der Zeitart oder in irgendeiner. */
function botBesiegt(ziel: Extract<Ziel, { art: "bot" }>, daten: Nutzerdaten): boolean {
  const besiegt = daten.spiel.besiegt;
  return ziel.zeitart === "egal"
    ? irgendwoBesiegt(besiegt, ziel.bot)
    : besiegt[ziel.zeitart].includes(ziel.bot);
}

/** Name der Zeitart als Textschlüssel; leer bei „egal“. */
function zeitartname(ziel: Extract<Ziel, { art: "bot" }>): Readonly<Record<string, Textschluessel>> {
  return ziel.zeitart === "egal" ? {} : { zeitart: `ziel.zeitart.${ziel.zeitart}` };
}

const BOT: Zielart = {
  art: "bot",
  stand: (ziel, { daten }) =>
    ziel.art === "bot" ? { erreicht: botBesiegt(ziel, daten) ? 1 : 0, gesamt: 1 } : null,
  anzeige: (ziel, { daten }) => {
    if (ziel.art !== "bot") return null;
    const egal = ziel.zeitart === "egal";
    return {
      text: {
        schluessel: egal ? "ziel.bot.egal" : "ziel.bot.zeitart",
        werte: { name: botname(ziel.bot, daten) },
        namen: zeitartname(ziel),
      },
      knopf: "ziel.knopf.spielen",
      hin: { art: "spielen", bot: ziel.bot, tempo: egal ? null : ziel.zeitart },
    };
  },
  kurz: (ziel, daten) => {
    if (ziel.art !== "bot") return null;
    const egal = ziel.zeitart === "egal";
    return {
      schluessel: egal ? "ziel.kurz.botEgal" : "ziel.kurz.bot",
      werte: { name: botname(ziel.bot, daten) },
      namen: zeitartname(ziel),
    };
  },
};

/** Name des Ordens zu einer Ringkennung, auch ohne Verzeichnis der Kapitel. */
function ordenname(ring: string, daten: Nutzerdaten): Zieltext | null {
  const teil = /^ich-teil-(.+)$/.exec(ring)?.[1];
  if (teil) return teilorden(teil);
  return ringstaende({ daten, kapitel: null }).find((r) => r.ring === ring)?.orden ?? null;
}

const RING: Zielart = {
  art: "ring",
  stand: (ziel, kontext) =>
    ziel.art === "ring"
      ? (ringstaende(kontext).find((r) => r.ring === ziel.ring)?.anteil ?? null)
      : null,
  anzeige: (ziel, kontext) =>
    ziel.art === "ring"
      ? (ringstaende(kontext).find((r) => r.ring === ziel.ring)?.anzeige ?? null)
      : null,
  kurz: (ziel, daten) => {
    if (ziel.art !== "ring") return null;
    const orden = ordenname(ziel.ring, daten);
    return orden ? { schluessel: "ziel.kurz.ring", werte: {}, unter: { orden } } : null;
  },
};

const KAPITEL: Zielart = {
  art: "kapitel",
  stand: (ziel, kontext) => {
    if (ziel.art !== "kapitel") return null;
    const gesamt = (UEBUNGEN_JE_KAPITEL[ziel.kapitel] ?? []).length;
    if (gesamt === 0) return null;
    return { erreicht: gesamt - offeneUebungen(kontext, [ziel.kapitel]).length, gesamt };
  },
  anzeige: (ziel, kontext) =>
    ziel.art === "kapitel"
      ? {
          text: {
            schluessel: "ziel.kapitel",
            werte: { kapitel: ziel.kapitel, n: offeneUebungen(kontext, [ziel.kapitel]).length },
          },
          knopf: "ziel.knopf.ueben",
          hin: { art: "ansicht", ansicht: { bildschirm: "kapitel", nummer: ziel.kapitel } },
        }
      : null,
  kurz: (ziel) =>
    ziel.art === "kapitel"
      ? { schluessel: "ziel.kurz.kapitel", werte: { kapitel: ziel.kapitel } }
      : null,
};

/** Alle Arten; Pakete tragen je eine Zeile ein (P3: „thema“). */
export const ZIELARTEN: readonly Zielart[] = [BOT, RING, KAPITEL];

/** Die Art eines Ziels oder null (unbekannt in dieser Version). */
export function zielartVon(ziel: Ziel, arten: readonly Zielart[] = ZIELARTEN): Zielart | null {
  return arten.find((a) => a.art === ziel.art) ?? null;
}

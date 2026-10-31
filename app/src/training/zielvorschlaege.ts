/**
 * Vorschläge für eigene Ziele (Gamifizierung P13), sortiert nach Nähe zum Ziel.
 *
 * Rolle im Gesamtbild: Ohne angeheftete Ziele und auf „Ziel wählen“ zeigt die Wochenkarte bis zu
 * fünf Vorschläge. Nach dem Ziel-Gradienten zuerst, was am wenigsten fehlt. Vorgeschlagen wird nur
 * aus echten Lücken (Entscheidung E11): Bots, die für einen Orden fehlen, fast volle Ringe,
 * begonnene Kapitel. Die Arten stehen als Liste; Meisterschaft (P3, „Fesselung auf Gold“), Rivalen
 * (P8, „Deinen Rivalen Paul besiegen“) und spätere Trainer tragen je eine Zeile ein.
 * Abhängigkeiten: zielringe.ts, zielarten.ts, ziele.ts, zieltypen.ts, engine/gegner.ts.
 */
import { UEBUNGEN_JE_KAPITEL } from "../daten/uebungsliste-daten";
import { WERTUNGSTEMPI } from "../spiel/elomodell";
import type { Ziel } from "../speicher/gamifizierung";
import { BOTBUENDEL, botsDesBuendels } from "../ui/komponenten/fortschritt/ringrechnung";
import { zielartVon } from "./zielarten";
import { anheftsperre, zielschluessel } from "./ziele";
import { offeneUebungen, ringstaende, type Ringstand } from "./zielringe";
import type { Zielanzeige, Zielkontext } from "./zieltypen";

/** Ein Vorschlag: das Ziel, wie viel fehlt und wie es aussieht. */
export interface Zielvorschlag {
  readonly ziel: Ziel;
  /** Schritte bis zum Ziel; kleiner heißt näher. */
  readonly fehlend: number;
  readonly anzeige: Zielanzeige;
}

/** Eine Art von Vorschlägen; bei gleicher Nähe kommt der kleinere Rang zuerst. */
export interface Zielvorschlagsart {
  readonly kennung: string;
  readonly rang: number;
  readonly ermittle: (kontext: Zielkontext) => readonly Zielvorschlag[];
}

/** So viele Vorschläge stehen höchstens da. */
export const HOECHSTENS_ZIELVORSCHLAEGE = 5;

/** Vorschlag zu einem Ziel mit der Anzeige seiner Art; null, wenn die Art fehlt. */
function vorschlag(ziel: Ziel, fehlend: number, kontext: Zielkontext): Zielvorschlag | null {
  const anzeige = zielartVon(ziel)?.anzeige(ziel, kontext);
  return anzeige ? { ziel, fehlend, anzeige } : null;
}

/** Bots, die der Leser in irgendeiner Zeitart besiegt hat, aber nicht in dieser. */
function halbBesiegt(kontext: Zielkontext): { bot: string; tempo: (typeof WERTUNGSTEMPI)[number] }[] {
  const besiegt = kontext.daten.spiel.besiegt;
  return BOTBUENDEL.flatMap(({ kennung }) => botsDesBuendels(kennung)).flatMap((bot) => {
    if (!WERTUNGSTEMPI.some((z) => besiegt[z].includes(bot))) return [];
    const tempo = WERTUNGSTEMPI.find((z) => !besiegt[z].includes(bot));
    return tempo ? [{ bot, tempo }] : [];
  });
}

/**
 * Einzelne Bots: der erste fehlende Bot des nächsten Ordens „jeder Bot einmal“ und ein schon
 * besiegter Bot in einer fehlenden Zeitart (für die Orden „in allen Zeitarten“).
 * Beispiel: Lotte in Blitz besiegt → „Besiege Lotte in Schnellschach.“
 */
function einzelneBots(kontext: Zielkontext): Zielvorschlag[] {
  const naechster = ringstaende(kontext)
    .filter((r) => r.ring.startsWith("ich-bots-") && !r.ring.endsWith("-alle") && r.fehlend > 0)
    .sort((a, b) => a.fehlend - b.fehlend)[0];
  const hin = naechster?.anzeige.hin;
  const einmal: Ziel[] = hin?.art === "spielen" ? [{ art: "bot", bot: hin.bot, zeitart: "egal" }] : [];
  const halb = halbBesiegt(kontext)[0];
  const zeitart: Ziel[] = halb ? [{ art: "bot", bot: halb.bot, zeitart: halb.tempo }] : [];
  return [...einmal, ...zeitart].flatMap((z) => vorschlag(z, 1, kontext) ?? []);
}

/** Ringe, die noch nicht voll sind, als Ringziele. */
function ringe(kontext: Zielkontext): Zielvorschlag[] {
  return ringstaende(kontext)
    .filter((r: Ringstand) => r.fehlend > 0 && r.anteil.gesamt > 0)
    .map((r) => ({ ziel: { art: "ring", ring: r.ring }, fehlend: r.fehlend, anzeige: r.anzeige }));
}

/** Begonnene Kapitel (mindestens eine Übung gelöst) mit offenen Übungen. */
function kapitel(kontext: Zielkontext): Zielvorschlag[] {
  return Object.keys(UEBUNGEN_JE_KAPITEL)
    .map(Number)
    .flatMap((n) => {
      const offen = offeneUebungen(kontext, [n]).length;
      const gesamt = (UEBUNGEN_JE_KAPITEL[n] ?? []).length;
      if (offen === 0 || offen === gesamt) return [];
      return vorschlag({ art: "kapitel", kapitel: n }, offen, kontext) ?? [];
    });
}

/** Alle Arten; Pakete tragen je eine Zeile ein (P3 Meisterschaft, P8 Rivalen). */
export const ZIELVORSCHLAGSARTEN: readonly Zielvorschlagsart[] = [
  { kennung: "bots", rang: 10, ermittle: einzelneBots },
  { kennung: "kapitel", rang: 20, ermittle: kapitel },
  { kennung: "ringe", rang: 30, ermittle: ringe },
];

/**
 * Die Vorschläge, nächste zuerst, ohne Doppel und ohne Ziele, die sich nicht anheften lassen
 * (schon angeheftet oder erreicht).
 *
 * Eingaben: Kontext, optional Arten und Höchstzahl (Tests). Ausgabe: höchstens fünf Vorschläge.
 * Beispiel: Kapitel 1 mit 1 offenen Übung, Ring 4–5 mit 2 fehlenden Bots → Kapitel 1, dann Ring.
 * Sonderfall: drei Ziele angeheftet → trotzdem Vorschläge (die Karte zeigt sie dann nicht).
 */
export function zielvorschlaege(
  kontext: Zielkontext,
  arten: readonly Zielvorschlagsart[] = ZIELVORSCHLAGSARTEN,
  hoechstens: number = HOECHSTENS_ZIELVORSCHLAEGE,
): Zielvorschlag[] {
  const gesehen = new Set<string>();
  const offen = { ...kontext, daten: { ...kontext.daten, ziele: { ...kontext.daten.ziele, angeheftet: [] } } };
  const angeheftet = new Set(kontext.daten.ziele.angeheftet.map(zielschluessel));
  return [...arten]
    .sort((a, b) => a.rang - b.rang)
    .flatMap((a) => a.ermittle(kontext))
    .filter((v) => v.fehlend > 0 && anheftsperre(v.ziel, offen) === null)
    .filter((v) => {
      const schluessel = zielschluessel(v.ziel);
      if (angeheftet.has(schluessel) || gesehen.has(schluessel)) return false;
      gesehen.add(schluessel);
      return true;
    })
    .sort((a, b) => a.fehlend - b.fehlend)
    .slice(0, hoechstens);
}

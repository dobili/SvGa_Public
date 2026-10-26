/**
 * Spieler der Messläufe aus ihrem Kürzel (engine/stufen.messung.ts): Stufen („5“, „5m“), freie
 * Grundschicht („4x0.2“), vorgefertigte Bots und Kandidaten („@ella“), Gruppen („@gruppe-3“), mit
 * Uhr („~180+2“), ohne Praxisbuch („!“ am Kern) und mit Maia („*“).
 *
 * Rolle im Gesamtbild: Eigene Datei neben engine/stufen.messung.ts (Dateien unter 400 Zeilen).
 * Abhängigkeiten: engine/gegner.ts, engine/messung/botkandidaten.ts, engine/gegnerbau.ts, engine/gruppe.ts,
 * engine/praxisbuch.ts, engine/stufen.ts, engine/zugwahl.ts.
 */
import { wertungDerPersoenlichkeit } from "../persoenlichkeitswertung";
import type { Phase } from "../../schach/phase";
import { BOTKANDIDATEN } from "./botkandidaten";
import { GEGNER } from "../gegner";
import { faktorenAus } from "../gegnerbau";
import { gruppenstufe, gruppenstufen } from "../gruppe";
import { BUCHTIEFE } from "../praxisbuch";
import { grundschicht, stufe, STUFEN_ZAHL, type Stufe, type Stufennummer } from "../stufen";
import { maiaNode } from "./maia-node.testhilfe";
import type { Maialaufzeit } from "../maia";
import { wahltempo } from "../wahlmodell";
import { REINES_PROFIL, STANDARDPROFIL, type Gegnerprofil } from "../zugwahl";

const SEKUNDE_MS = 1000;

/** Eine Maia-Laufzeit für den ganzen Messlauf (die Netze werden nur einmal geladen). */
let maia: Maialaufzeit | null = null;
function maiaLaufzeit(): Maialaufzeit {
  maia ??= maiaNode();
  return maia;
}

export interface Spieler {
  readonly stufen: Readonly<Record<Phase, Stufennummer>>;
  readonly ersatz: Stufe | null;
  readonly profil: Gegnerprofil;
  readonly uhr: { readonly grundzeitMs: number; readonly zuschlagMs: number } | null;
  /** Gruppenmodus („@gruppe-3“): alle Bots der Stufe ziehen gemeinsam (engine/gruppenwahl.ts). */
  readonly gruppe?: Stufennummer;
  /**
   * Halbzüge aus dem Praxisbuch (wie in der App, engine/praxisbuch.ts); 0 ohne Buch
   * (Kürzel mit „!“, etwa „@ella!“, zum Vergleich mit und ohne Buch; Spaß-Bots immer ohne).
   */
  readonly buchtiefe: number;
}

export function alleGleich(n: Stufennummer): Readonly<Record<Phase, Stufennummer>> {
  return { eroeffnung: n, mittelspiel: n, endspiel: n };
}

/** Ein vorgefertigter Bot mit seinen Stufen je Phase und seinem Profil. */
function botspieler(kern: string, uhr: Spieler["uhr"]): Spieler | null {
  const bot = /^@([a-z0-9-]+)$/.exec(kern); // Ziffern: Kandidaten „k1-…“ (0.2.125)
  if (!bot?.[1]) return null;
  const gruppe = gruppenstufe(bot[1]);
  if (gruppe !== null) {
    const buchtiefe = BUCHTIEFE.standard;
    return {
      stufen: gruppenstufen(gruppe),
      ersatz: null,
      profil: STANDARDPROFIL,
      uhr,
      gruppe,
      buchtiefe,
    };
  }
  // Vorgefertigte Bots und die Kandidaten des neuen Bot-Satzes
  const g = [...GEGNER, ...BOTKANDIDATEN].find((x) => x.kennung === bot[1]);
  if (!g) throw new Error(`Unbekannter Bot: ${kern}`);
  const profil: Gegnerprofil = {
    ...STANDARDPROFIL,
    fehlerarten: g.fehlerarten,
    stil: g.stil,
    blindeFlecken: g.blindeFlecken,
    // Wie in der App (ui/komponenten/botzug.ts): Faktoren aus den Stufen der Persönlichkeit
    gewichte: faktorenAus(g.persoenlichkeit, wertungDerPersoenlichkeit(g)),
    stilname: g.stilname,
    haeufigkeit: g.haeufigkeit,
    zufallszuege: g.zufallszuege,
  };
  return {
    stufen: g.stufenJePhase,
    ersatz: null,
    profil,
    uhr,
    buchtiefe: g.zufallszuege ? 0 : g.buchtiefe,
  };
}

/** Spieler aus dem Kürzel der Paarung (Kopf der Datei). */
export function spieler(kuerzel: string): Spieler {
  const [roh = "", uhrtext] = kuerzel.split("~");
  // „!“ am Ende: ohne Praxisbuch (Vergleichsmessung 0.2.128); „*“: mit Maia, in
  // beliebiger Reihenfolge, etwa „@tom*!“.
  const ohneBuch = roh.includes("!");
  const mitMaia = roh.includes("*");
  const ohneTempo = spielerOhneBuchwahl(roh.replace(/[!*]/g, ""), uhrtext);
  // Zeitklasse der Uhr ins Profil wie in der App (ui/komponenten/botzug.ts); fehlte bis zur
  // Prüfmessung vom 25.10.2026, Runde 3: Bis dahin wählten alle Messungen wie in Schnellschach.
  const profil = {
    ...ohneTempo.profil,
    tempo: wahltempo(ohneTempo.uhr),
    ...(mitMaia ? { maia: { laufzeit: maiaLaufzeit() } } : {}),
  };
  const s = { ...ohneTempo, profil };
  return ohneBuch ? { ...s, buchtiefe: 0 } : s;
}

function spielerOhneBuchwahl(kern: string, uhrtext: string | undefined): Spieler {
  const teile = uhrtext?.split("+").map(Number);
  const uhr = teile
    ? { grundzeitMs: (teile[0] ?? 0) * SEKUNDE_MS, zuschlagMs: (teile[1] ?? 0) * SEKUNDE_MS }
    : null;
  const bot = botspieler(kern, uhr);
  if (bot) return bot;
  const frei = /^(\d+)x(\d+(?:\.\d+)?)$/.exec(kern);
  if (frei?.[1] && frei[2]) {
    const ersatz = { ...stufe(1), grund: grundschicht(Number(frei[1]), Number(frei[2])) };
    return { stufen: alleGleich(1), ersatz, profil: REINES_PROFIL, uhr, buchtiefe: 0 };
  }
  const stufig = /^(\d+)(m?)$/.exec(kern);
  const nummer = Number(stufig?.[1]);
  if (!stufig || nummer < 1 || nummer > STUFEN_ZAHL) throw new Error(`Unbekanntes Kürzel: ${kern}`);
  const profil = stufig[2] ? STANDARDPROFIL : REINES_PROFIL;
  const buchtiefe = BUCHTIEFE.standard;
  return { stufen: alleGleich(nummer as Stufennummer), ersatz: null, profil, uhr, buchtiefe };
}

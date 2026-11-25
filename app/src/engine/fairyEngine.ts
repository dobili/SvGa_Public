/**
 * Anbindung der einkernigen Fairy-Stockfish (Schachvarianten, Auftrag des Hauptchats, 26.11.2026):
 * Worker starten, Variante vorbereiten, Kandidaten mit Wert und legale Züge rechnen lassen.
 *
 * Warum so: Die Engine (app/public/engine-varianten/fairy-stockfish-einkernig.js, gebaut von
 * werkzeuge/fairy_einkernig/) ist ein Worker mit Text-UCI wie stockfish-19-lite-single.js; mit
 * {datei, inhalt} schreibt sie eine Datei (variants.ini). Sie rechnet auf einem Kern, und „go“
 * blockiert sie bis zum Ende der Suche: Darum stellt die Anbindung Aufträge in eine Reihe und sucht
 * immer mit Zeit- oder Tiefengrenze, nie „go infinite“. Der Worker entsteht erst beim ersten
 * Auftrag, also wenn eine Variantenpartie den Bot fragt (Zusatzpaket wie Maia); offline liefert ihn
 * der Service Worker aus seinem Speicher (sw/variantenengine.ts).
 * Abhängigkeiten: spiel/varianten/enginebefehle.ts, spiel/varianten/variantenengine.ts (Typen).
 */
import { enginevorbereitung } from "../spiel/varianten/enginebefehle";
import type { Engineangabe } from "../spiel/varianten/variante";
import type {
  Variantenanfrage,
  Variantenengine,
  Variantenkandidat,
} from "../spiel/varianten/variantenengine";

/** Pfad der Engine unter der Basis der App. */
export const FAIRY_PFAD = "engine-varianten/fairy-stockfish-einkernig.js";
const SKILL_MAX = 20;
/** Längste Wartezeit auf eine Antwort, über die Rechenzeit hinaus (ms). */
const ZUSCHLAG_MS = 15000;

/** Was die Anbindung vom Worker braucht (im Test erfunden). */
export interface Fairyworker {
  postMessage(nachricht: string | { datei: string; inhalt: string }): void;
  onmessage: ((ereignis: { data: unknown }) => void) | null;
}

/**
 * Liest die Kandidaten aus den „info“-Zeilen: je MultiPV-Nummer der letzte Wert und erste Zug.
 * Beispiel: „info depth 6 multipv 1 score cp 35 pv e2e4 e7e5“ → { zug: e2e4, wert: { cp: 35 } }.
 */
export function kandidatenAus(zeilen: readonly string[], anzahl: number): Variantenkandidat[] {
  const je = new Map<number, Variantenkandidat>();
  for (const zeile of zeilen) {
    const treffer =
      /\bmultipv (\d+)\b.*\bscore (cp|mate) (-?\d+)\b.*\bpv (\S+)/.exec(zeile) ??
      /\bscore (cp|mate) (-?\d+)\b.*\bpv (\S+)/.exec(zeile);
    if (!treffer) continue;
    const mit = treffer.length === 5;
    const nr = mit ? Number(treffer[1]) : 1;
    const art = treffer[mit ? 2 : 1];
    const wert = Number(treffer[mit ? 3 : 2]);
    const zug = treffer[mit ? 4 : 3] ?? "";
    je.set(nr, { zug, wert: art === "mate" ? { matt: wert } : { cp: wert } });
  }
  return [...je.entries()]
    .sort(([a], [b]) => a - b)
    .slice(0, anzahl)
    .map(([, k]) => k);
}

/** Legale Züge aus der Ausgabe von „go perft 1“ („e2e4: 1“). */
export function perftZuege(zeilen: readonly string[]): string[] {
  return zeilen.flatMap((z) => {
    const treffer = /^(\S+): \d+$/.exec(z.trim());
    return treffer?.[1] ? [treffer[1]] : [];
  });
}

/** Schlüssel einer Engineangabe (gleiche Variante: keine neue Vorbereitung). */
function schluessel(angabe: Engineangabe): string {
  return JSON.stringify([angabe.uciVariante, angabe.ini, angabe.optionen]);
}

export class FairyEngine implements Variantenengine {
  private worker: Fairyworker | null = null;
  private reihe: Promise<unknown> = Promise.resolve();
  private vorbereitet = "";
  private zeilen: string[] = [];
  private warten: { bis: (zeile: string) => boolean; fertig: () => void } | null = null;

  constructor(private readonly erzeuge: () => Fairyworker) {}

  analysiere(a: Variantenanfrage): Promise<readonly Variantenkandidat[]> {
    return this.inReihe(async () => {
      await this.bereite(a.engine);
      this.sende(`setoption name MultiPV value ${Math.max(1, a.kandidaten)}`);
      const skill = a.staerke?.skill ?? SKILL_MAX;
      this.sende(`setoption name Skill Level value ${skill}`);
      this.sende(`position fen ${a.fen}`);
      const tiefe = a.staerke?.tiefe ? ` depth ${a.staerke.tiefe}` : "";
      const zeilen = await this.bis(
        `go movetime ${a.ms}${tiefe}`,
        (z) => z.startsWith("bestmove"),
        a.ms,
      );
      const kandidaten = kandidatenAus(zeilen, a.kandidaten);
      const best = /^bestmove (\S+)/.exec(zeilen.at(-1) ?? "")?.[1];
      // Mit Skill Level wählt die Engine absichtlich schwächer: Ihr bestmove zählt zuerst.
      if (best && best !== "(none)" && kandidaten[0]?.zug !== best) {
        return [
          { zug: best, wert: kandidaten.find((k) => k.zug === best)?.wert ?? { cp: 0 } },
          ...kandidaten,
        ];
      }
      return kandidaten;
    });
  }

  legaleZuege(fen: string, engine: Engineangabe): Promise<readonly string[]> {
    return this.inReihe(async () => {
      await this.bereite(engine);
      this.sende(`position fen ${fen}`);
      return perftZuege(await this.bis("go perft 1", (z) => z.startsWith("Nodes searched"), 0));
    });
  }

  /** Startet den Worker beim ersten Auftrag und meldet die Variante an, wenn sie wechselt. */
  private async bereite(angabe: Engineangabe): Promise<void> {
    if (!this.worker) {
      this.worker = this.erzeuge();
      this.worker.onmessage = (e) => this.empfange(String(e.data));
      await this.bis("uci", (z) => z === "uciok", 0);
    }
    const k = schluessel(angabe);
    if (k === this.vorbereitet) return;
    const v = enginevorbereitung(angabe);
    for (const d of v.dateien) this.worker.postMessage({ datei: d.pfad, inhalt: d.inhalt });
    for (const befehl of v.befehle) this.sende(befehl);
    this.sende("ucinewgame");
    await this.bis("isready", (z) => z === "readyok", 0);
    this.vorbereitet = k;
  }

  private sende(befehl: string): void {
    this.worker?.postMessage(befehl);
  }

  private empfange(zeile: string): void {
    this.zeilen.push(zeile);
    if (this.warten?.bis(zeile)) this.warten.fertig();
  }

  /** Sendet einen Befehl und sammelt die Zeilen bis zur passenden; Frist nach Rechenzeit. */
  private bis(befehl: string, ende: (zeile: string) => boolean, ms: number): Promise<string[]> {
    this.zeilen = [];
    return new Promise((fertig, fehler) => {
      const uhr = setTimeout(() => {
        this.warten = null;
        fehler(new Error(`Fairy-Stockfish antwortet nicht auf „${befehl}“`));
      }, ms + ZUSCHLAG_MS);
      this.warten = {
        bis: ende,
        fertig: () => {
          clearTimeout(uhr);
          this.warten = null;
          fertig(this.zeilen);
        },
      };
      this.sende(befehl);
    });
  }

  /** Ein Auftrag nach dem anderen: Die einkernige Engine kann nur eine Suche zugleich. */
  private inReihe<T>(arbeit: () => Promise<T>): Promise<T> {
    const naechste = this.reihe.then(arbeit, arbeit);
    this.reihe = naechste.catch(() => undefined);
    return naechste;
  }
}

/** Die Dateien der Engine (der Worker lädt das WebAssembly neben sich). */
export const FAIRY_DATEIEN = [FAIRY_PFAD, FAIRY_PFAD.replace(/\.js$/, ".wasm")] as const;

/**
 * Ruft beide Dateien einmal ab, damit der Service Worker sie für offline ablegt
 * (sw/variantenengine.ts). Aufruf beim Laden des Abenteuer-Pakets (1 MB). Wirft bei Netzfehlern.
 */
export async function ladeFairyVorab(): Promise<void> {
  for (const datei of FAIRY_DATEIEN) {
    const antwort = await fetch(`${import.meta.env.BASE_URL}${datei}`);
    if (!antwort.ok) throw new Error(`Variantenengine ${datei} nicht geladen (${antwort.status})`);
    await antwort.arrayBuffer();
  }
}

/** Die eine Variantenengine der App (Worker erst beim ersten Auftrag). */
export const fairyEngine = new FairyEngine(
  () => new Worker(`${import.meta.env.BASE_URL}${FAIRY_PFAD}`) as unknown as Fairyworker,
);

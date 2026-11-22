/**
 * Tests für die Musik in Spuren im Tonspieler (musikspuren.ts, spurenspieler.ts) mit einem
 * nachgebauten AudioContext: gemeinsamer Start, Schleifenpunkte, volle Mischung als Ersatz,
 * Freigabe der Puffer nach dem Überblenden (Speicher), Ausdünnen an der Schleifengrenze, Dialog.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Tonspieler, type Laden } from "./tonspieler";

/** Ein Regler, der seinen letzten Zielwert behält. */
class Regler {
  readonly verbunden: unknown[] = [];
  readonly gain = {
    value: 1,
    ziel: 1,
    setValueAtTime: () => undefined,
    exponentialRampToValueAtTime: () => undefined,
    setTargetAtTime(wert: number) {
      this.ziel = wert;
    },
  };
  connect(ziel: unknown) {
    this.verbunden.push(ziel);
    return ziel;
  }
}

class Quelle extends Regler {
  buffer: { stamm: string } | null = null;
  loop = false;
  loopStart = 0;
  loopEnd = 0;
  beginn: number | null = null;
  versatz = 0;
  start(wann = 0, versatz = 0) {
    this.beginn = wann;
    this.versatz = versatz;
  }
  stop() {
    return undefined;
  }
}

/** Dauer jeder dekodierten Datei (s) und Rate wie im Spiel. */
const DAUER = 50;
const RATE = 48000;

function nachbau() {
  const quellen: Quelle[] = [];
  const regler: Regler[] = [];
  const ctx = {
    currentTime: 0,
    destination: new Regler(),
    createGain: () => {
      const r = new Regler();
      regler.push(r);
      return r;
    },
    createWaveShaper: () => Object.assign(new Regler(), { curve: null, oversample: "" }),
    createBufferSource: () => {
      const q = new Quelle();
      quellen.push(q);
      return q;
    },
    decodeAudioData: async (bytes: ArrayBuffer) => ({
      duration: DAUER,
      length: DAUER * RATE,
      numberOfChannels: 2,
      stamm: new TextDecoder().decode(bytes),
    }),
  };
  return { ctx, quellen, regler };
}

const SPUREN = JSON.stringify({
  "maple-falls": { form: DAUER * 44100, rate: 44100, spuren: ["grund", "melodie", "zusatz"] },
  "cedar-creek": { form: DAUER * 44100, rate: 44100, spuren: ["grund", "melodie"] },
  "ohne-grund": { form: DAUER * 44100, rate: 44100, spuren: ["grund"] },
});

function lader(dateien: string[]): Laden {
  const alle: Record<string, string> = { "musik/spuren.json": SPUREN };
  for (const d of dateien) alle[d] = d;
  return async (pfad) => (pfad in alle ? new TextEncoder().encode(alle[pfad]).buffer : null);
}

const MAPLE = [
  "musik/maple-falls.grund.m4a",
  "musik/maple-falls.melodie.m4a",
  "musik/maple-falls.zusatz.m4a",
];
const CEDAR = ["musik/cedar-creek.grund.m4a", "musik/cedar-creek.melodie.m4a"];

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

describe("Tonspieler mit Spuren", () => {
  it("startet alle Spuren im selben Augenblick als Schleife über die Form", async () => {
    const { ctx, quellen } = nachbau();
    const spieler = new Tonspieler(ctx as unknown as AudioContext, lader(MAPLE));
    await spieler.spieleSchleife("musik", "mapleFalls");
    expect(quellen.map((q) => q.buffer?.stamm)).toEqual(MAPLE);
    expect(new Set(quellen.map((q) => q.beginn)).size).toBe(1);
    expect(quellen.every((q) => q.loop && q.loopStart === 0 && q.loopEnd === DAUER)).toBe(true);
    expect(spieler.musikmessung()?.spuren).toEqual({ grund: 1, melodie: 1, zusatz: 0 });
    await spieler.spieleSchleife("musik", "mapleFalls");
    expect(quellen).toHaveLength(3);
  });

  it("ohne Grund spielt die volle Mischung als eine Datei", async () => {
    const { ctx, quellen } = nachbau();
    const spieler = new Tonspieler(ctx as unknown as AudioContext, lader(["musik/ohne-grund.m4a"]));
    await spieler.spieleSchleife("musik", "ohneGrund");
    expect(quellen.map((q) => q.buffer?.stamm)).toEqual(["musik/ohne-grund.m4a"]);
    expect(spieler.musikmessung()).toBeNull();
  });

  it("gibt die Spuren des alten Orts nach dem Überblenden frei", async () => {
    const { ctx } = nachbau();
    const spieler = new Tonspieler(ctx as unknown as AudioContext, lader([...MAPLE, ...CEDAR]));
    await spieler.spieleSchleife("musik", "mapleFalls");
    const drei = spieler.pufferBytes();
    await spieler.spieleSchleife("musik", "cedarCreek");
    expect(spieler.pufferBytes()).toBe(drei + (drei / 3) * 2);
    await vi.advanceTimersByTimeAsync(2000);
    expect(spieler.pufferBytes()).toBe((drei / 3) * 2);
    expect(spieler.musikmessung()?.angabe).toBe("cedarCreek");
  });

  it("dünnt an der Schleifengrenze aus und mischt Musiker und Innenraum neu", async () => {
    const { ctx } = nachbau();
    const spieler = new Tonspieler(ctx as unknown as AudioContext, lader(MAPLE));
    await spieler.spieleSchleife("musik", "mapleFalls");
    spieler.setzeMischlage({ innen: false, siege: 0, musikerNaehe: 1 });
    expect(spieler.musikmessung()?.spuren.zusatz).toBe(1);
    spieler.setzeMischlage({ innen: false, siege: 0, musikerNaehe: 0 });
    // Drei volle Schleifen zu 50 s, dann eine nur mit dem Grund.
    ctx.currentTime = 3 * DAUER + 1;
    await vi.advanceTimersByTimeAsync(3 * DAUER * 1000 + 100);
    const duenn = spieler.musikmessung()?.spuren;
    expect(duenn?.melodie).toBe(0);
    expect(duenn?.grund).toBeGreaterThan(1);
    // Neue Karte: Die Zählung beginnt neu, sofort wieder voll.
    spieler.neueKarte();
    expect(spieler.musikmessung()?.spuren.melodie).toBeGreaterThan(0);
  });

  it("Dialog: Musik 3 dB leiser, danach wieder voll", () => {
    const { ctx, regler } = nachbau();
    const spieler = new Tonspieler(ctx as unknown as AudioContext, lader([]));
    // Reihenfolge im Konstruktor: Musik- und Geräuschregler, dann der Dialogregler.
    const dialog = regler[2];
    spieler.setzeDialog(true);
    expect(dialog?.gain.ziel).toBeCloseTo(10 ** (-3 / 20), 6);
    spieler.setzeDialog(false);
    expect(dialog?.gain.ziel).toBe(1);
  });
});

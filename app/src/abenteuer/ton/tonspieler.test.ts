/**
 * Tests für tonspieler.ts mit einem nachgebauten AudioContext: einmalige Stücke ohne Schleife,
 * Anhebung leiser Geräusche (musik/einmal.json, klang/pegel.json), Ausblenden der Titelmusik in
 * 1 s statt 2 s (28.11.2026).
 */
import { describe, expect, it } from "vitest";
import { Tonspieler, type Laden } from "./tonspieler";

/** Ein Knoten, der nur mitschreibt, womit er verbunden wird. */
class Knoten {
  readonly art: string;
  readonly verbunden: Knoten[] = [];
  constructor(art: string) {
    this.art = art;
  }
  connect(ziel: Knoten): Knoten {
    this.verbunden.push(ziel);
    return ziel;
  }
}

/** Ein Regler mit den Rampen, die der Spieler benutzt. */
class Regler extends Knoten {
  readonly gain = {
    value: 1,
    setValueAtTime: () => undefined,
    exponentialRampToValueAtTime: () => undefined,
    setTargetAtTime: () => undefined,
  };
  constructor() {
    super("regler");
  }
}

class Pufferquelle extends Knoten {
  buffer: unknown = null;
  loop = false;
  gestartet = false;
  /** Wann die Quelle enden soll (Zeit des Tonerzeugers), null solange sie läuft. */
  endetUm: number | null = null;
  constructor() {
    super("quelle");
  }
  start(): void {
    this.gestartet = true;
  }
  stop(zeit = 0): void {
    this.gestartet = false;
    this.endetUm = zeit;
  }
}

/** Nachbau des AudioContext: nur, was der Spieler braucht. */
function nachbau() {
  const quellen: Pufferquelle[] = [];
  const ctx = {
    currentTime: 0,
    destination: new Knoten("ausgang"),
    createGain: () => new Regler(),
    createWaveShaper: () => Object.assign(new Knoten("anhebung"), { curve: null, oversample: "" }),
    createBufferSource: () => {
      const quelle = new Pufferquelle();
      quellen.push(quelle);
      return quelle;
    },
    decodeAudioData: async () => ({ duration: 1 }),
  };
  return { ctx: ctx as unknown as AudioContext, quellen };
}

const DATEIEN: Record<string, string> = {
  "musik/einmal.json": '["ambrose.walzer"]',
  "klang/pegel.json": '{"kerze": 8}',
  "musik/ambrose.walzer.m4a": "",
  "musik/maple-falls.m4a": "",
  "musik/titel.m4a": "",
  "klang/kerze.m4a": "",
  "klang/wasserfall.m4a": "",
};

const lade: Laden = async (pfad) =>
  pfad in DATEIEN ? new TextEncoder().encode(DATEIEN[pfad]).buffer : null;

describe("Tonspieler", () => {
  it("spielt einmalige Stücke ohne Schleife und startet sie nicht neu", async () => {
    const { ctx, quellen } = nachbau();
    const spieler = new Tonspieler(ctx, lade);
    await spieler.spieleSchleife("musik", "mapleFalls");
    await spieler.spieleSchleife("musik", "ambrose.walzer");
    await spieler.spieleSchleife("musik", "ambrose.walzer");
    expect(quellen.map((q) => q.loop)).toEqual([true, false]);
  });

  it("hebt leise Geräusche über die Anhebung an, andere direkt", async () => {
    const { ctx, quellen } = nachbau();
    const spieler = new Tonspieler(ctx, lade);
    await spieler.spieleSchleife("geraeusch", "kerze");
    await spieler.spieleSchleife("geraeusch", "wasserfall");
    expect(quellen.map((q) => q.verbunden[0]?.art)).toEqual(["anhebung", "regler"]);
    expect(quellen.every((q) => q.loop)).toBe(true);
  });

  it("blendet beim Ende auf Wunsch schneller aus (Titelmusik 1 s), sonst in 2 s", async () => {
    const { ctx, quellen } = nachbau();
    const spieler = new Tonspieler(ctx, lade);
    await spieler.spieleSchleife("musik", "titel");
    await spieler.spieleSchleife("musik", null, 1);
    await spieler.spieleSchleife("musik", "mapleFalls");
    await spieler.spieleSchleife("musik", null);
    expect(quellen.map((q) => q.endetUm)).toEqual([1, 2]);
  });
});

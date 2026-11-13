/**
 * Spielt erzeugte Motive (ton/motive.ts) mit Web Audio: Oszillator, Hüllkurve, je Klangfarbe eine
 * Wellenform und ein Filter.
 *
 * Rolle im Gesamtbild: Teil von ton/tonspieler.ts (spieleEinmal). Vorbild sind die Zugtöne der App
 * (app/ton.ts), die ebenfalls ohne Dateien auskommen.
 * Abhängigkeiten: Browser-Schnittstelle AudioContext, ton/motive.ts.
 */
import type { Klangfarbe, Motiv } from "./motive";

/** Wellenform, Anschlagzeit (s) und Grenzfrequenz des Filters (Hz) je Klangfarbe. */
const FARBE: Readonly<
  Record<Klangfarbe, { welle: OscillatorType; anschlag: number; filterHz: number }>
> = {
  glocke: { welle: "sine", anschlag: 0.005, filterHz: 8000 },
  klavier: { welle: "triangle", anschlag: 0.01, filterHz: 3000 },
  streicher: { welle: "sawtooth", anschlag: 0.25, filterHz: 900 },
  digital: { welle: "square", anschlag: 0.005, filterHz: 2000 },
};
/** Unterhalb dieses Pegels gilt ein Ton als verklungen (exponentielle Rampen nicht bis 0). */
const STILLE = 0.0001;

/** Spielt ein Motiv einmal auf das Ziel (etwa den Musikregler). Ausgabe: keine. */
export function spieleMotiv(ctx: AudioContext, ziel: AudioNode, motiv: Motiv): void {
  const farbe = FARBE[motiv.farbe];
  const jetzt = ctx.currentTime;
  for (const ton of motiv.toene) {
    const start = jetzt + ton.beginn;
    const ende = start + ton.dauer;
    const osz = ctx.createOscillator();
    osz.type = farbe.welle;
    osz.frequency.setValueAtTime(ton.hz, start);
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(farbe.filterHz, start);
    const huelle = ctx.createGain();
    huelle.gain.setValueAtTime(STILLE, start);
    huelle.gain.exponentialRampToValueAtTime(ton.laut, start + farbe.anschlag);
    huelle.gain.exponentialRampToValueAtTime(STILLE, ende);
    osz.connect(filter).connect(huelle).connect(ziel);
    osz.start(start);
    osz.stop(ende);
  }
}

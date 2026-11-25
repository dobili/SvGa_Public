/**
 * Tests der Tonfassung (RO41, 26.11.2026): Opus nur, wenn das Gerät den Typ kennt und die Probe
 * dekodiert (Attrappe statt Browser); Pfade und Auswahl beim Nachladen nehmen nur eine Fassung.
 */
import { describe, expect, it } from "vitest";
import {
  OPUS_TYP,
  opusProbe,
  passtZurFassung,
  tonpfad,
  waehleTonfassung,
  type Opusumgebung,
} from "./tonfassung";

/** Eine Attrappe: Antwort von canPlayType und Ergebnis der Dekodierung. */
function attrappe(
  antwort: string,
  dekodiere: (bytes: ArrayBuffer) => Promise<number>,
): Opusumgebung & { readonly gefragt: string[] } {
  const gefragt: string[] = [];
  return {
    gefragt,
    canPlayType: (typ) => {
      gefragt.push(typ);
      return antwort;
    },
    dekodiere,
  };
}

const KURZ_MS = 20;

describe("Tonfassung: Wahl je Gerät", () => {
  it("nimmt Opus, wenn der Typ bekannt ist und die Probe dekodiert (Chrome, iOS ab 17.4)", async () => {
    const geraet = attrappe("probably", () => Promise.resolve(2880));
    expect(await waehleTonfassung(geraet)).toBe("opus");
    expect(geraet.gefragt).toEqual([OPUS_TYP]);
  });

  it("nimmt AAC ohne Opus-Typ, ohne die Probe zu dekodieren (iOS vor 17.4)", async () => {
    let dekodiert = false;
    const geraet = attrappe("", () => {
      dekodiert = true;
      return Promise.resolve(1);
    });
    expect(await waehleTonfassung(geraet)).toBe("aac");
    expect(dekodiert).toBe(false);
  });

  it("nimmt AAC, wenn „maybe“ gesagt, aber die Dekodierung scheitert oder leer ist", async () => {
    const scheitert = attrappe("maybe", () => Promise.reject(new Error("EncodingError")));
    expect(await waehleTonfassung(scheitert)).toBe("aac");
    expect(await waehleTonfassung(attrappe("maybe", () => Promise.resolve(0)))).toBe("aac");
  });

  it("nimmt AAC, wenn die Probe hängt, und ohne Web Audio", async () => {
    const haengt = attrappe("maybe", () => new Promise<number>(() => undefined));
    expect(await waehleTonfassung(haengt, KURZ_MS)).toBe("aac");
    expect(await waehleTonfassung(null)).toBe("aac");
  });

  it("die Probe ist eine WebM-Datei (EBML-Kopf) mit Opus darin", () => {
    const bytes = new Uint8Array(opusProbe());
    expect([...bytes.slice(0, 4)]).toEqual([0x1a, 0x45, 0xdf, 0xa3]);
    expect(new TextDecoder().decode(bytes)).toContain("OpusHead");
  });
});

describe("Tonfassung: Pfade und Nachladen", () => {
  const pfade = new Set(["musik/weg.m4a", "musik/weg.webm", "klang/alt.m4a", "klang/kerze.ogg"]);

  it("liest auf Opus-Geräten die WebM-Fassung, wo es sie gibt", () => {
    expect(tonpfad("musik/weg.m4a", "opus", pfade)).toBe("musik/weg.webm");
    expect(tonpfad("klang/alt.m4a", "opus", pfade)).toBe("klang/alt.m4a");
    expect(tonpfad("musik/weg.m4a", "aac", pfade)).toBe("musik/weg.m4a");
    // Ohne Verzeichnis (Entwicklung) bleibt der Name.
    expect(tonpfad("musik/weg.m4a", "opus", null)).toBe("musik/weg.m4a");
  });

  it("lädt von zwei Fassungen nur die des Geräts, alles andere immer", () => {
    const alle = [...pfade, "grafik/held.webp"].map((pfad) => ({ pfad }));
    const opus = alle.filter(passtZurFassung("opus", pfade)).map((d) => d.pfad);
    const aac = alle.filter(passtZurFassung("aac", pfade)).map((d) => d.pfad);
    expect(opus).toEqual([
      "musik/weg.webm",
      "klang/alt.m4a",
      "klang/kerze.ogg",
      "grafik/held.webp",
    ]);
    expect(aac).toEqual(["musik/weg.m4a", "klang/alt.m4a", "klang/kerze.ogg", "grafik/held.webp"]);
  });
});

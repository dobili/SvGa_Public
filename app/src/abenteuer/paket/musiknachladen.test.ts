/**
 * Musik erst beim Abspielen laden (Auftrag „Leistung“, 16.11.2026): Eine Datei des Verzeichnisses,
 * die noch nicht im Cache liegt, holt `liesPaketdatei` geprüft in den Cache, danach liest es nur
 * noch dort; `haltePaketdateiVor` legt sie ohne Lesen ab; der Akt lädt keine Musik mehr mit.
 * Cache Storage ist hier ein kleiner Nachbau im Speicher.
 */
import { createHash } from "node:crypto";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Paketverzeichnis } from "../schnittstelle/paket";

const INHALT = "musikbytes";
const sha = (text: string) => createHash("sha256").update(text).digest("hex");

/** Ein Verzeichnis mit einem Stück und einem Geräusch von Akt 1. */
const VERZEICHNIS: Paketverzeichnis = {
  version: "1",
  appVersion: "0",
  bytes: 0,
  dateien: [
    {
      pfad: "musik/weg.m4a",
      bytes: INHALT.length,
      sha256: sha(INHALT),
      gruppe: "musik",
      staffel: 1,
      akt: 1,
    },
    {
      pfad: "klang/fluss.m4a",
      bytes: INHALT.length,
      sha256: sha(INHALT),
      gruppe: "klang",
      staffel: 1,
      akt: 1,
    },
  ],
};

/** Cache Storage im Speicher: je Name eine Tabelle Adresse → Text. */
function cacheNachbau() {
  const speicher = new Map<string, Map<string, string>>();
  const oeffne = (name: string) => {
    const tabelle = speicher.get(name) ?? new Map<string, string>();
    speicher.set(name, tabelle);
    return {
      match: (adresse: string) =>
        Promise.resolve(tabelle.has(adresse) ? new Response(tabelle.get(adresse)) : undefined),
      put: async (adresse: string, antwort: Response) => {
        tabelle.set(adresse, await antwort.text());
      },
    };
  };
  return {
    speicher,
    caches: {
      keys: () => Promise.resolve([...speicher.keys()]),
      // Wie im Browser: sucht in allen Caches (paketlader.ts, uebernimmAusAlterFassung).
      match: (adresse: string) => {
        const tabelle = [...speicher.values()].find((t) => t.has(adresse));
        return Promise.resolve(tabelle ? new Response(tabelle.get(adresse)) : undefined);
      },
      open: (name: string) => Promise.resolve(oeffne(name)),
      delete: (name: string) => Promise.resolve(speicher.delete(name)),
    },
  };
}

const BASIS = "http://localhost/abenteuer/";

describe("Abenteuerpaket: Musik beim Abspielen laden", () => {
  const abrufe: string[] = [];
  let nachbau: ReturnType<typeof cacheNachbau>;

  beforeEach(() => {
    vi.resetModules();
    abrufe.length = 0;
    nachbau = cacheNachbau();
    nachbau.speicher.set(
      "abenteuer-1",
      new Map([[`${BASIS}paket.json`, JSON.stringify(VERZEICHNIS)]]),
    );
    const fenster = { location: { href: "http://localhost/app/" }, caches: nachbau.caches };
    vi.stubGlobal("window", fenster);
    vi.stubGlobal("caches", nachbau.caches);
    vi.stubGlobal(
      "fetch",
      vi.fn((adresse: string) => {
        abrufe.push(adresse);
        return Promise.resolve(new Response(INHALT));
      }),
    );
  });

  afterEach(() => vi.unstubAllGlobals());

  it("lädt ein Stück beim ersten Lesen in den Cache und liest es danach nur dort", async () => {
    const { liesPaketdatei } = await import("./paketlader");
    expect(await (await liesPaketdatei("musik/weg.m4a")).text()).toBe(INHALT);
    expect(await (await liesPaketdatei("musik/weg.m4a")).text()).toBe(INHALT);
    expect(abrufe).toEqual([`${BASIS}musik/weg.m4a`]);
    expect(nachbau.speicher.get("abenteuer-1")?.has(`${BASIS}musik/weg.m4a`)).toBe(true);
  });

  it("legt ein Stück vorab ab, aber nichts außerhalb des Verzeichnisses", async () => {
    const { haltePaketdateiVor } = await import("./paketlader");
    expect(await haltePaketdateiVor("musik/weg.m4a")).toBe(true);
    expect(await haltePaketdateiVor("musik/gibt-es-nicht.m4a")).toBe(false);
    expect(abrufe).toEqual([`${BASIS}musik/weg.m4a`]);
  });

  it("lädt mit dem Akt die Geräusche, aber keine Musik", async () => {
    const { ladeAktton } = await import("./aktton");
    expect(await ladeAktton(1)).toBe(true);
    expect(abrufe).toEqual([`${BASIS}klang/fluss.m4a`]);
  });
});

/** Dasselbe Verzeichnis mit Opus-Fassungen neben den AAC-Dateien (RO41, 26.11.2026). */
const MIT_OPUS: Paketverzeichnis = {
  ...VERZEICHNIS,
  dateien: VERZEICHNIS.dateien.flatMap((d) => [d, { ...d, pfad: d.pfad.replace(".m4a", ".webm") }]),
};

describe("Abenteuerpaket: nur eine Tonfassung je Gerät", () => {
  const abrufe: string[] = [];

  beforeEach(() => {
    vi.resetModules();
    abrufe.length = 0;
    const nachbau = cacheNachbau();
    nachbau.speicher.set(
      "abenteuer-1",
      new Map([[`${BASIS}paket.json`, JSON.stringify(MIT_OPUS)]]),
    );
    vi.stubGlobal("window", {
      location: { href: "http://localhost/app/" },
      caches: nachbau.caches,
    });
    vi.stubGlobal("caches", nachbau.caches);
    vi.stubGlobal(
      "fetch",
      vi.fn((adresse: string) => {
        abrufe.push(adresse);
        return Promise.resolve(new Response(INHALT));
      }),
    );
  });

  afterEach(() => vi.unstubAllGlobals());

  it("Opus-Gerät: liest die WebM-Fassung und lädt mit dem Akt nur sie", async () => {
    (await import("./tonfassung")).setzeTonfassung("opus");
    const { liesPaketdatei } = await import("./paketlader");
    const { ladeAktton } = await import("./aktton");
    expect(await (await liesPaketdatei("musik/weg.m4a")).text()).toBe(INHALT);
    expect(await ladeAktton(1)).toBe(true);
    expect(abrufe).toEqual([`${BASIS}musik/weg.webm`, `${BASIS}klang/fluss.webm`]);
  });

  it("AAC-Gerät: lädt nur die m4a, die Opus-Fassung fehlt nicht", async () => {
    (await import("./tonfassung")).setzeTonfassung("aac");
    const { fehlendeDateien } = await import("./paketlader");
    const { ladeAktton } = await import("./aktton");
    expect(await ladeAktton(1)).toBe(true);
    expect(abrufe).toEqual([`${BASIS}klang/fluss.m4a`]);
    expect(await fehlendeDateien((d) => d.akt === 1 && d.gruppe === "klang")).toEqual([]);
  });
});

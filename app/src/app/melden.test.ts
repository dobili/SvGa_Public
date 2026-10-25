/**
 * Tests für das Senden von Meldungen (R57) mit Warteschlange ohne Netz (V9): Ohne Netz wartet
 * die Meldung auf dem Gerät, bei Serverfehlern nicht; das Nachsenden leert die Schlange.
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import { frischeUmgebung } from "../speicher/testhilfen";

const MERKER = "svga.meldungen.warten";
const MELDUNG = { art: "fehler", text: "Brett bleibt leer" } as const;

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

/** Frische Module, ein Gerät mit oder ohne Netz und ein nachgebildetes fetch. */
async function umgebung(antworten: (() => Promise<Response>)[], online = true) {
  const geraet = frischeUmgebung();
  vi.stubGlobal("navigator", { onLine: online, userAgent: "Test" });
  const fetchAttrappe = vi.fn<(adresse: string, anfrage: RequestInit) => Promise<Response>>(() => {
    const naechste = antworten.shift();
    return naechste ? naechste() : Promise.reject(new TypeError("Failed to fetch"));
  });
  vi.stubGlobal("fetch", fetchAttrappe);
  const melden = await import("./melden");
  return { geraet, fetchAttrappe, melden };
}

const ohneNetz = () => Promise.reject(new TypeError("Failed to fetch"));
const antwort =
  (status: number, nummer = 7) =>
  () =>
    Promise.resolve(new Response(JSON.stringify({ ok: status < 300, nummer }), { status }));

function wartende(geraet: Storage): { koerper: { text: string } }[] {
  return JSON.parse(geraet.getItem(MERKER) ?? "[]") as { koerper: { text: string } }[];
}

describe("sendeMeldung", () => {
  it("sendet sofort, wenn das Netz da ist", async () => {
    const { melden, geraet } = await umgebung([antwort(200, 42)]);
    expect(await melden.sendeMeldung(MELDUNG, false)).toEqual({ art: "gesendet", nummer: 42 });
    expect(wartende(geraet)).toEqual([]);
  });

  it("merkt die Meldung bei einem Netzwerkfehler vor", async () => {
    const { melden, geraet } = await umgebung([ohneNetz]);
    expect(await melden.sendeMeldung(MELDUNG, false)).toEqual({ art: "vorgemerkt" });
    expect(wartende(geraet).map((e) => e.koerper.text)).toEqual(["Brett bleibt leer"]);
  });

  it("merkt vor, ohne zu senden, wenn das Gerät offline ist", async () => {
    const { melden, geraet, fetchAttrappe } = await umgebung([], false);
    expect(await melden.sendeMeldung(MELDUNG, false)).toEqual({ art: "vorgemerkt" });
    expect(fetchAttrappe).not.toHaveBeenCalled();
    expect(wartende(geraet)).toHaveLength(1);
  });

  it("merkt bei Serverfehler und Ablehnung nichts vor", async () => {
    const { melden, geraet } = await umgebung([antwort(500), antwort(400)]);
    expect(await melden.sendeMeldung(MELDUNG, false)).toEqual({ art: "fehler", grund: "500" });
    expect(await melden.sendeMeldung(MELDUNG, false)).toEqual({ art: "fehler", grund: "400" });
    expect(wartende(geraet)).toEqual([]);
  });
});

describe("sendeVorgemerkte", () => {
  it("sendet wartende Meldungen der Reihe nach und leert die Schlange", async () => {
    const { melden, geraet, fetchAttrappe } = await umgebung([ohneNetz, ohneNetz]);
    await melden.sendeMeldung({ ...MELDUNG, text: "erste" }, false);
    await melden.sendeMeldung({ ...MELDUNG, text: "zweite" }, false);
    fetchAttrappe.mockImplementation(() => antwort(200)());
    expect(await melden.sendeVorgemerkte()).toBe(2);
    const texte = fetchAttrappe.mock.calls
      .slice(-2)
      .map(([, anfrage]) => (JSON.parse(String(anfrage.body)) as { text: string }).text);
    expect(texte).toEqual(["erste", "zweite"]);
    expect(wartende(geraet)).toEqual([]);
  });

  it("hört ohne Netz auf und behält den Rest", async () => {
    const { melden, geraet } = await umgebung([ohneNetz, ohneNetz, antwort(200), ohneNetz]);
    await melden.sendeMeldung({ ...MELDUNG, text: "erste" }, false);
    await melden.sendeMeldung({ ...MELDUNG, text: "zweite" }, false);
    expect(await melden.sendeVorgemerkte()).toBe(1);
    expect(wartende(geraet).map((e) => e.koerper.text)).toEqual(["zweite"]);
  });
});

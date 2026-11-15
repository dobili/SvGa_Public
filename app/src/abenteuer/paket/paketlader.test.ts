/**
 * Tests des Paketladers für einfache Handys (Prüfung „zugang“, 15.11.2026): Bilder heißen im
 * Paket .webp, Aufrufer nennen weiter .png; jede Bildadresse entsteht einmal je Datei, damit der
 * Speicher bei Kartenwechseln nicht wächst; ein Fehler wird nicht gemerkt.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { paketdateiAlsAdresse, paketpfad } from "./paketlader";

describe("Abenteuerpaket: Pfad im Paket", () => {
  it("setzt PNG der Quellen auf WebP um, anderes bleibt", () => {
    expect(paketpfad("moebel/sofa.png")).toBe("moebel/sofa.webp");
    expect(paketpfad("grafik/karten/mapleFalls.park.png")).toBe(
      "grafik/karten/mapleFalls.park.webp",
    );
    expect(paketpfad("karten/maple-falls-park.json")).toBe("karten/maple-falls-park.json");
    expect(paketpfad("bilder/brief.webp")).toBe("bilder/brief.webp");
  });

  it("behält den PNG-Namen in einem Paket aus der Zeit vor WebP", () => {
    const alt = new Set(["moebel/sofa.png"]);
    const neu = new Set(["moebel/sofa.webp"]);
    expect(paketpfad("moebel/sofa.png", alt)).toBe("moebel/sofa.png");
    expect(paketpfad("moebel/sofa.png", neu)).toBe("moebel/sofa.webp");
    // Fehlt beides, fragt der Lader nach dem neuen Namen (und meldet dann „fehlt“).
    expect(paketpfad("moebel/tisch.png", neu)).toBe("moebel/tisch.webp");
  });
});

describe("Abenteuerpaket: Bildadressen", () => {
  const abrufe: string[] = [];
  let scheitern = false;

  beforeEach(() => {
    abrufe.length = 0;
    scheitern = false;
    vi.stubGlobal("window", { location: { href: "http://localhost/app/" } });
    vi.stubGlobal(
      "fetch",
      vi.fn((adresse: string) => {
        abrufe.push(adresse);
        return Promise.resolve(
          scheitern ? new Response(null, { status: 404 }) : new Response(new Blob(["bild"])),
        );
      }),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("gibt für dieselbe Datei dieselbe Adresse und liest sie nur einmal", async () => {
    const erste = await paketdateiAlsAdresse("moebel/sessel.png");
    const zweite = await paketdateiAlsAdresse("moebel/sessel.png");
    expect(zweite).toBe(erste);
    expect(abrufe).toEqual(["http://localhost/abenteuer/moebel/sessel.webp"]);
  });

  it("merkt sich keinen Fehler: der nächste Versuch liest neu", async () => {
    scheitern = true;
    await expect(paketdateiAlsAdresse("moebel/lampe.png")).rejects.toThrow();
    scheitern = false;
    await expect(paketdateiAlsAdresse("moebel/lampe.png")).resolves.toMatch(/^blob:/);
    expect(abrufe).toHaveLength(2);
  });
});

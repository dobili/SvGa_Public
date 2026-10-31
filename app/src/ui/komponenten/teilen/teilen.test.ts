/**
 * Tests des Teilens (Gamifizierung P9): Bild 1080 × 1350 mit maskierten Texten, Rastern mit einer
 * Attrappe der Leinwand, Links der Herausforderungen, nur freie Taktikaufgaben, Sprung.
 */
import { describe, expect, it, vi } from "vitest";
import type { Taktikaufgabe } from "../../../daten/trainerdaten";
import { zusatzsprung } from "../../../app/spruenge";
import { stueckSvg } from "../ordenkunst/entwuerfe";
import { HERAUSFORDERUNGSSPRUNG } from "./herausforderungen";
import {
  alsAnsichtswert,
  ausAnsichtswert,
  herausforderungslink,
  leseHerausforderung,
} from "./herausforderungslink";
import { findeFreieTaktik, taktikFrei, taktikKurz } from "./taktikherausforderung";
import { namensgroesse, TEILBILD, teilbildSvg, teildateiname, xmlText } from "./teilbild";
import { svgZuPng, type Rasterwerkzeuge } from "./teileBild";

const ANGABE = {
  ueberschrift: "Abzeichen",
  name: "Matt & <Patt>",
  zeile: "Verdient am 31.10.2026",
  bild: stueckSvg("abzeichen", "erstePartie"),
  fuss: "Schach von Grund auf",
  adresse: "schach-von-grund-auf.com",
};

describe("Bild zum Teilen", () => {
  it("Hochformat 1080 × 1350 mit Stück, maskiertem Namen, Datum und Adresse", () => {
    const svg = teilbildSvg(ANGABE);
    expect(svg).toMatch(/^<svg [^>]*width="1080" height="1350"/);
    expect(svg).toContain("Matt &amp; &lt;Patt&gt;");
    expect(svg).not.toContain("<Patt>");
    expect(svg).toContain("Verdient am 31.10.2026");
    expect(svg).toContain("schach-von-grund-auf.com");
    expect(svg).toContain(`<svg x="220" y="230" width="640" height="640"`);
    expect(svg).toContain("ABZEICHEN");
  });

  it("ohne Bild und Zeile nur der Name; lange Namen werden kleiner", () => {
    const svg = teilbildSvg({ ...ANGABE, bild: null, zeile: null });
    expect(svg).not.toContain('width="640"');
    expect(svg).not.toContain("Verdient");
    expect(namensgroesse("Erste Partie")).toBe(72);
    expect(namensgroesse("x".repeat(40))).toBeLessThan(72);
  });

  it("Dateiname nur aus Kleinbuchstaben, Ziffern und Bindestrichen; xmlText maskiert", () => {
    expect(teildateiname("abzeichen", "ersterSieg")).toBe(
      "schach-von-grund-auf-abzeichen-erstersieg.png",
    );
    expect(teildateiname("orden", "bots-4-5-alle")).toBe(
      "schach-von-grund-auf-orden-bots-4-5-alle.png",
    );
    expect(xmlText('"a" & b')).toBe("&quot;a&quot; &amp; b");
  });

  it("Rastern: Leinwand 1080 × 1350, Bild ganz gezeichnet, Adresse freigegeben", async () => {
    const zeichne = vi.fn();
    const leinwand = {
      width: 0,
      height: 0,
      getContext: () => ({ drawImage: zeichne }),
      toBlob: (fertig: (b: Blob | null) => void, typ: string) =>
        fertig(new Blob(["x"], { type: typ })),
    } as unknown as HTMLCanvasElement;
    const gibFrei = vi.fn();
    const werkzeuge: Rasterwerkzeuge = {
      ladeBild: () => Promise.resolve({} as CanvasImageSource),
      leinwand: () => leinwand,
      adresseVon: () => "blob:probe",
      gibFrei,
    };
    const png = await svgZuPng(teilbildSvg(ANGABE), werkzeuge);
    expect(png.type).toBe("image/png");
    expect([leinwand.width, leinwand.height]).toEqual([TEILBILD.breite, TEILBILD.hoehe]);
    expect(zeichne).toHaveBeenCalledWith({}, 0, 0, TEILBILD.breite, TEILBILD.hoehe);
    expect(gibFrei).toHaveBeenCalledWith("blob:probe");
  });

  it("Rastern: ohne Zeichenfläche ein Fehler, die Adresse wird trotzdem freigegeben", async () => {
    const gibFrei = vi.fn();
    const werkzeuge: Rasterwerkzeuge = {
      ladeBild: () => Promise.resolve({} as CanvasImageSource),
      leinwand: () => ({ getContext: () => null }) as unknown as HTMLCanvasElement,
      adresseVon: () => "blob:probe",
      gibFrei,
    };
    await expect(svgZuPng("<svg/>", werkzeuge)).rejects.toThrow();
    expect(gibFrei).toHaveBeenCalledOnce();
  });
});

describe("Herausforderung per Link", () => {
  it("Link bauen und lesen; fremde Trainer und Unsinn ergeben null", () => {
    const link = herausforderungslink("taktik", "l-1Vybh");
    expect(link).toBe("https://schach-von-grund-auf.com/app/#aufgabe-taktik-l-1Vybh");
    const ziel = leseHerausforderung("#aufgabe-taktik-l-1Vybh", ["taktik"]);
    expect(ziel).toEqual({ trainer: "taktik", aufgabe: "l-1Vybh" });
    expect(leseHerausforderung("#aufgabe-endspiel-x", ["taktik"])).toBeNull();
    expect(leseHerausforderung("#aufgabe-taktik-<script>", ["taktik"])).toBeNull();
    expect(leseHerausforderung("#abb-1.26", ["taktik"])).toBeNull();
    expect(ausAnsichtswert(alsAnsichtswert({ trainer: "taktik", aufgabe: "l-1Vybh" }))).toEqual(
      ziel,
    );
    expect(ausAnsichtswert(null)).toBeNull();
  });

  it("der längste passende Trainer gewinnt (Kennungen mit Bindestrich)", () => {
    expect(leseHerausforderung("#aufgabe-a-b-c", ["a", "a-b"])).toEqual({
      trainer: "a-b",
      aufgabe: "c",
    });
  });

  it("nur Lichess-Aufgaben sind frei; Buchaufgaben öffnet ein Link nicht (E7)", () => {
    const lichess = { id: "taktik-l-1Vybh", herkunft: { quelle: "lichess" } } as Taktikaufgabe;
    const buch = { id: "taktik-b-7.6", herkunft: { quelle: "buch" } } as Taktikaufgabe;
    expect(taktikFrei(lichess)).toBe(true);
    expect(taktikFrei(buch)).toBe(false);
    expect(taktikKurz(lichess)).toBe("l-1Vybh");
    expect(findeFreieTaktik([lichess, buch], "l-1Vybh")).toBe(lichess);
    expect(findeFreieTaktik([lichess, buch], "b-7.6")).toBeNull();
    expect(findeFreieTaktik([lichess, buch], "l-gibtsnicht")).toBeNull();
  });

  it("der Sprung steht in SPRUENGE und führt ins Training zur Zusatzansicht", () => {
    expect(zusatzsprung("#aufgabe-taktik-l-1Vybh")).toEqual({
      bereich: "training",
      ansicht: { bildschirm: "zusatz", kennung: "herausforderung", wert: "taktik:l-1Vybh" },
    });
    expect(zusatzsprung("#aufgabe-unbekannt-1", [HERAUSFORDERUNGSSPRUNG])).toBeNull();
  });
});

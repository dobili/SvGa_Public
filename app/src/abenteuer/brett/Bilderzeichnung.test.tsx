/**
 * Tests der gezeichneten Brettstile: Laden aus dem Paket, Vorgabe mit Bildern, Lesbarkeit.
 *
 * Regel: docs/spiel/30_Bedienung_und_Brettstile.md, Abschnitt 5 „Lesbarkeit“ – Markierungen
 * bleiben auf beiden Feldfarben sichtbar, auch auf einem gezeichneten Brett.
 */
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { bildvorgabe, lesbareMarken } from "./Bilderzeichnung";
import { brettbildpfad, FIGURZEICHEN, ladeBrettbilder, type Brettbilder } from "./brettbilder";
import { STILTABELLE } from "./brettstile";
import { brettstilvorgabe } from "./Zeichnung";

/** Dateien, die das vorgetäuschte Paket hat; Pfad → Adresse. */
const paket = new Map<string, string>();
let farbangaben: unknown = { hell: "#C8CCD0", dunkel: "#3A4048" };

vi.mock("../paket/paketlader", () => ({
  paketdateiAlsAdresseOderNull: (pfad: string) => Promise.resolve(paket.get(pfad) ?? null),
  liesPaketJson: () => Promise.resolve(farbangaben),
  beiPaketAenderung: () => () => {},
}));

/** Legt Brett und Figuren des Stils ins vorgetäuschte Paket; ohne die genannten Zeichen. */
function fuelle(kennung: "schiefer", ohne: readonly string[] = []) {
  paket.set(brettbildpfad(kennung, null), "blob:brett");
  for (const z of FIGURZEICHEN)
    if (!ohne.includes(z)) paket.set(brettbildpfad(kennung, z), `blob:${z}`);
}

afterEach(() => {
  paket.clear();
  farbangaben = { hell: "#C8CCD0", dunkel: "#3A4048" };
});

describe("Brettbilder aus dem Paket", () => {
  it("nennt die Dateien wie das Pipeline-Werkzeug", () => {
    expect(brettbildpfad("schiefer", null)).toBe("brett/schiefer/brett.webp");
    expect(brettbildpfad("schiefer", "K")).toBe("brett/schiefer/wK.webp");
    expect(brettbildpfad("schiefer", "n")).toBe("brett/schiefer/bN.webp");
  });

  it("lädt Brett, zwölf Figuren und Farben", async () => {
    fuelle("schiefer");
    const bilder = await ladeBrettbilder("schiefer");
    expect(bilder?.brett).toBe("blob:brett");
    expect(Object.keys(bilder?.figuren ?? {})).toHaveLength(12);
    expect(bilder?.figuren?.n).toBe("blob:n");
    expect(bilder?.farben).toEqual({ hell: "#C8CCD0", dunkel: "#3A4048" });
  });

  it("ohne Brettbild gibt es nichts, ohne vollständigen Satz keine Figuren", async () => {
    expect(await ladeBrettbilder("schiefer")).toBeNull();
    fuelle("schiefer", ["q"]);
    expect((await ladeBrettbilder("schiefer"))?.figuren).toBeNull();
  });

  it("nimmt unbrauchbare Farben nicht", async () => {
    fuelle("schiefer");
    farbangaben = { hell: "weiß", dunkel: "#3A4048" };
    expect((await ladeBrettbilder("schiefer"))?.farben).toBeNull();
  });
});

const BILDER: Brettbilder = {
  brett: "blob:brett",
  figuren: Object.fromEntries(FIGURZEICHEN.map((z) => [z, `blob:${z}`])),
  farben: { hell: "#C8CCD0", dunkel: "#3A4048" },
};

describe("Vorgabe mit Bildern", () => {
  it("legt das Brettbild über die Felder und zeichnet Figuren als glatte Bilder", () => {
    const vorgabe = bildvorgabe("schiefer", BILDER);
    const { Unterlage, Figur } = vorgabe;
    if (!Unterlage || !Figur) throw new Error("Unterlage und Figur erwartet");
    const unterlage = renderToStaticMarkup(
      <svg>
        <Unterlage />
      </svg>,
    );
    expect(unterlage).toContain('href="blob:brett"');
    expect(unterlage).toContain('preserveAspectRatio="none"');
    const figur = renderToStaticMarkup(
      <svg>
        <Figur zeichen="n" x={1000} y={2000} />
      </svg>,
    );
    expect(figur).toContain('href="blob:n"');
    expect(figur).toContain("image-rendering:auto");
    expect(figur).toContain('class="brett-figur"');
    expect(figur).not.toContain("<rect");
  });

  it("übernimmt Feldfarben des Bildes und behält Marken, Zugmarke und Rahmen des Stils", () => {
    const grund = brettstilvorgabe("schiefer");
    const vorgabe = bildvorgabe("schiefer", BILDER);
    expect(vorgabe.palette.hell).toBe("#C8CCD0");
    expect(vorgabe.palette.schimmer).toBe(grund.palette.schimmer);
    expect(vorgabe.Zugmarke).toBe(grund.Zugmarke);
    expect(vorgabe.stil).toBe(grund.stil);
    expect(vorgabe.markenfarben?.farben).toEqual(STILTABELLE.schiefer.marken);
    expect(bildvorgabe("schiefer", BILDER)).toBe(vorgabe);
  });

  it("zeichnet Märchenfiguren ohne eigenes Bild als Pixelfigur (Falke, Bison, Drache)", () => {
    const { Figur } = bildvorgabe("schiefer", BILDER);
    if (!Figur) throw new Error("Figur erwartet");
    for (const zeichen of ["H", "e", "d"]) {
      const figur = renderToStaticMarkup(
        <svg>
          <Figur zeichen={zeichen} x={0} y={0} />
        </svg>,
      );
      expect(figur).toContain("<rect");
      expect(figur).not.toContain("<image");
    }
  });

  it("behält ohne vollständigen Figurensatz die Pixelfiguren", () => {
    const vorgabe = bildvorgabe("schiefer", { ...BILDER, figuren: null });
    expect(vorgabe.Figur).toBe(brettstilvorgabe("schiefer").Figur);
  });
});

describe("Lesbarkeit der Marken auf dem Bild", () => {
  const marken = { kontur: "#101010", farben: STILTABELLE.ahorn.marken };

  it("lässt die Kontur, wenn sie auf den Feldern des Bildes trägt", () => {
    const felder = { hell: STILTABELLE.ahorn.hell, dunkel: STILTABELLE.ahorn.dunkel };
    expect(lesbareMarken(marken, felder)).toBe(marken);
    expect(lesbareMarken(marken, null)).toBe(marken);
  });

  it("wechselt auf eine helle Kontur, wenn das Brett fast schwarz ist", () => {
    const farben = {
      gold: "#806010",
      rot: "#802020",
      grau: "#303030",
      gruen: "#206030",
      blau: "#203080",
    };
    const dunkel = { kontur: "#101010", farben };
    const felder = { hell: "#202020", dunkel: "#0A0A0A" };
    expect(lesbareMarken(dunkel, felder).kontur).toBe("#F5F5F5");
  });
});

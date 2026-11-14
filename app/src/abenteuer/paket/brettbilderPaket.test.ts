/**
 * Tests der gezeichneten Brettstile im Paketbau (skripte/brettbilder-paket.mjs): welche Dateien
 * aus dem privaten Ordner spiel/brett/<stil>/ ins Paket kommen.
 */
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { brettbilderDateien } from "../../../skripte/brettbilder-paket.mjs";

let ordner = "";

afterEach(async () => {
  if (ordner) await rm(ordner, { recursive: true, force: true });
  ordner = "";
});

describe("Brettbilder im Paket", () => {
  it("ohne Ordner brett/ gibt es nichts", async () => {
    ordner = await mkdtemp(join(tmpdir(), "brettbilder-"));
    expect(await brettbilderDateien(ordner)).toEqual([]);
  });

  it("nimmt webp und json je Stil, sortiert, ohne Vorschaubilder", async () => {
    ordner = await mkdtemp(join(tmpdir(), "brettbilder-"));
    for (const stil of ["stahl", "schiefer"]) {
      await mkdir(join(ordner, "brett", stil), { recursive: true });
      for (const name of ["brett.webp", "brett.json", "wK.webp", "vorschau.png"]) {
        await writeFile(join(ordner, "brett", stil, name), "x");
      }
    }
    const dateien = await brettbilderDateien(ordner);
    expect(dateien.map((d) => d.pfad)).toEqual([
      "brett/schiefer/brett.json",
      "brett/schiefer/brett.webp",
      "brett/schiefer/wK.webp",
      "brett/stahl/brett.json",
      "brett/stahl/brett.webp",
      "brett/stahl/wK.webp",
    ]);
    expect(dateien[0]?.gruppe).toBe("daten");
    expect(dateien[1]?.gruppe).toBe("grafik");
    expect(dateien[1]?.quelle).toBe(join(ordner, "brett", "schiefer", "brett.webp"));
  });
});

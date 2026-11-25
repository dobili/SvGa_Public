/**
 * Dauerlauf der Sonderformen: Bot gegen Bot mit dem Notplan (ohne Engine) über viele Partien.
 * Warum: Regeln ohne Schach (Nebel, Ente) und mit zwei Brettern (Tandem) haben viele Randfälle
 * (Rochade aus dem Schach, Ente vor dem Bauern, Einsetzen ins Matt). Keine Partie darf mit einem
 * Fehler abbrechen, und jede muss enden oder die Zuggrenze erreichen.
 */
import { describe, expect, it } from "vitest";
import type { Botstil, Zugbewerter } from "./botwahl";
import { neueEntenpartie } from "./ente";
import { entenbotZug, spieleBotzug } from "./entenbot";
import { alsUci } from "./freistellung";
import { neueNebelpartie, spieleNebelzug } from "./nebel";
import { nebelbotZug, neuesGedaechtnis } from "./nebelbot";
import { amZug, neueTandempartie, spieleTandemzug } from "./tandem";
import { tandembotZug } from "./tandembot";

const PARTIEN = 12;
const GRENZE = 400;
const ohneEngine: Zugbewerter = () => Promise.resolve([]);

/** Fester Zufall (lineare Kongruenz), damit ein Fehlschlag sich wiederholen lässt. */
function zufall(saat: number): () => number {
  let x = saat;
  return () => {
    x = (x * 1103515245 + 12345) % 2147483648;
    return x / 2147483648;
  };
}

const stil = (saat: number): Botstil => ({ varianten: 1, spielraumCp: 0, zufall: zufall(saat) });

describe("Dauerlauf Bot gegen Bot", () => {
  it("Nebel: jede Partie endet ohne Fehler", async () => {
    for (let s = 1; s <= PARTIEN; s++) {
      let p = neueNebelpartie();
      for (let i = 0; i < GRENZE && !p.ende; i++) {
        const z = await nebelbotZug(p, neuesGedaechtnis(p.stellung.amZug), ohneEngine, stil(s + i));
        p = spieleNebelzug(p, z, alsUci(z));
      }
      expect(p.zuege.length).toBeGreaterThan(0);
    }
  });

  it("Ente: jede Partie endet ohne Fehler", async () => {
    for (let s = 1; s <= PARTIEN; s++) {
      let p = neueEntenpartie();
      for (let i = 0; i < GRENZE && !p.ende; i++) {
        p = spieleBotzug(p, await entenbotZug(p, ohneEngine, stil(s + i)));
      }
      expect(p.zuege.length).toBeGreaterThan(0);
    }
  });

  it("Tandem: jede Partie endet ohne Fehler", async () => {
    for (let s = 1; s <= PARTIEN; s++) {
      let p = neueTandempartie(s % 2 === 0 ? "white" : "black");
      for (let i = 0; i < GRENZE && !p.ende; i++) {
        const brett = amZug(p);
        p = spieleTandemzug(p, brett, await tandembotZug(p, brett, ohneEngine, stil(s + i)));
      }
      expect(p.zuegeA.length).toBeGreaterThan(0);
    }
  });
});

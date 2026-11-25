/**
 * Sonderformen gegen die echte Fairy-Stockfish (einkernig, Node): Bot gegen Bot, und jeder Zug
 * der Engine muss nach unseren Regeln gehen (der Bot zählt, wie oft er auf den Notplan auswich).
 * Warum: Ente (Feld als „*“, Züge „e2e4,e4d5“), Tandem (Taschen in der FEN, Rochade e1g1) und
 * Nebel (Sichtstellung als gültige FEN) müssen zur Engine passen; die Attrappe zeigt das nicht.
 */
import { describe, expect, it, vi } from "vitest";
import type { Botstil } from "./botwahl";
import { neueEntenpartie } from "./ente";
import { entenbotZug, spieleBotzug } from "./entenbot";
import { fairyBewerter } from "./fairyKnoten.testhilfe";
import { alsUci } from "./freistellung";
import { neueNebelpartie, spieleNebelzug } from "./nebel";
import { merke, nebelbotZug, neuesGedaechtnis } from "./nebelbot";
import { amZug, neueTandempartie, spieleTandemzug } from "./tandem";
import { tandembotZug } from "./tandembot";

const RECHENZEIT_MS = 20;
const HALBZUEGE = 60;
const ZEIT_MS = 120_000;
const stil: Botstil = { varianten: 3, spielraumCp: 30, zufall: () => 0.3 };

/** Zählt Warnungen „Notplan“: Dann passte kein Engine-Zug zu unseren Regeln. */
function notplanZaehler(): () => number {
  const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
  return () => warn.mock.calls.filter((a) => String(a[0]).includes("Not")).length;
}

describe("Sonderformen mit echter Fairy-Stockfish", () => {
  it(
    "Ente: Bot gegen Bot, jeder Engine-Zug passt zu unseren Regeln",
    async () => {
      const bewerter = await fairyBewerter("duck", RECHENZEIT_MS);
      const notplan = notplanZaehler();
      let p = neueEntenpartie();
      for (let i = 0; i < HALBZUEGE && !p.ende; i++) {
        p = spieleBotzug(p, await entenbotZug(p, bewerter, stil));
      }
      expect(p.zuege.length).toBeGreaterThan(10);
      expect(notplan()).toBe(0);
    },
    ZEIT_MS,
  );

  it(
    "Tandem: alle vier Bots, Taschen und Einsetzen in der FEN",
    async () => {
      const bewerter = await fairyBewerter("crazyhouse", RECHENZEIT_MS);
      const notplan = notplanZaehler();
      let p = neueTandempartie("white");
      for (let i = 0; i < HALBZUEGE && !p.ende; i++) {
        const brett = amZug(p);
        p = spieleTandemzug(p, brett, await tandembotZug(p, brett, bewerter, stil));
      }
      expect(p.zuegeA.length + p.zuegeB.length).toBeGreaterThan(10);
      expect(notplan()).toBe(0);
    },
    ZEIT_MS,
  );

  it(
    "Nebel: der Bot rechnet auf seiner Sichtstellung, die Engine nimmt sie an",
    async () => {
      const bewerter = await fairyBewerter("chess", RECHENZEIT_MS);
      let p = neueNebelpartie();
      let weiss = neuesGedaechtnis("white");
      let schwarz = neuesGedaechtnis("black");
      for (let i = 0; i < HALBZUEGE && !p.ende; i++) {
        const g = p.stellung.amZug === "white" ? weiss : schwarz;
        const z = await nebelbotZug(p, g, bewerter, stil);
        p = spieleNebelzug(p, z, alsUci(z));
        weiss = merke(p, "white", weiss);
        schwarz = merke(p, "black", schwarz);
      }
      expect(p.zuege.length).toBeGreaterThan(10);
    },
    ZEIT_MS,
  );
});

/**
 * Referenztests für das Werkzeug k1-todsuenden an den Beispielen aus Kapitel 1 und 3: verfrühte
 * Dame (Abb. 1.8, 1.13), König in der Mitte (Abb. 1.12), Materialgier (4. Sxe5? im
 * Blackburne-Shilling-Gambit), Buchzüge ohne Fragezeichen (Dänisches Gambit, Abb. 3.20) und die
 * Spanische Hauptvariante ohne Passivität.
 */
import { describe, expect, it } from "vitest";
import {
  ladeKapitel,
  stellungAus,
  stellungVon,
  verlaufBis,
} from "../schach/buchabbildungen.testhilfe";
import { baueEroeffnungsindex } from "../schach/eroeffnungsindex";
import { todsuendenWerkzeug } from "./k1-todsuenden";
import type { Werkzeugergebnis } from "./werkzeug";

const INDEX = baueEroeffnungsindex([ladeKapitel(2), ladeKapitel(3)]);
const GRUNDSTELLUNG = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

function ergebnis(nummer: string): Werkzeugergebnis {
  const stellung = stellungVon(nummer);
  return todsuendenWerkzeug(stellung, "white", verlaufBis(nummer), INDEX);
}

function zeilen(auswertung: Werkzeugergebnis, kennung: "eigen" | "gegner"): readonly string[] {
  return auswertung.befunde.find((befund) => befund.kennung === kennung)?.zeilen ?? [];
}

describe("k1-todsuenden an Buchbeispielen", () => {
  it("Abb. 1.8: 3... Df6 ist die verfrühte Dame (rot markiert)", () => {
    const auswertung = ergebnis("1.8");
    expect(zeilen(auswertung, "gegner")).toEqual([
      "3... Df6: mögliche verfrühte Dame (noch 3 Leichtfiguren zu Hause)",
    ]);
    expect(zeilen(auswertung, "eigen")).toEqual(["keine"]);
    // C2.3 (Wunsch des Autors, 16.10.2026): Die App nennt nur Kandidaten, gut sichtbar.
    expect(auswertung.ueberschrift).toBe("Mögliche Todsünden");
    expect(auswertung.hinweis).toMatch(/^Nur Kandidaten: .*frühe Herausholen der Dame sinnvoll\.$/);
    expect(auswertung.fazit).toBe(
      "Eine mögliche Todsünde gefunden: Prüfe, ob sie wirklich etwas kostet.",
    );
    expect(auswertung.markierungen).toContainEqual({ typ: "feld", farbe: "rot", feld: "f6" });
  });

  it("Abb. 1.13: 2. Dh5 ist die verfrühte Dame von Weiß", () => {
    expect(zeilen(ergebnis("1.13"), "eigen")[0]).toBe(
      "2. Dh5: mögliche verfrühte Dame (noch 4 Leichtfiguren zu Hause)",
    );
  });

  it("Abb. 1.12: Der schwarze König steht nach zehn Zügen noch in der Mitte", () => {
    const auswertung = todsuendenWerkzeug(stellungVon("1.12"), "white");
    expect(zeilen(auswertung, "gegner")).toEqual([
      "möglicherweise zu lange in der Mitte: Der König steht nach 10 Zügen noch nicht rochiert",
    ]);
    expect(auswertung.markierungen).toContainEqual({ typ: "feld", farbe: "rot", feld: "e8" });
  });

  it("Materialgier: 4. Sxe5? im Blackburne-Shilling-Gambit (Kapitel 4) bei König in der Mitte", () => {
    const verlauf = {
      startFen: GRUNDSTELLUNG,
      zuege: ["e4", "e5", "Nf3", "Nc6", "Bc4", "Nd4", "Nxe5"],
    };
    const stellung = stellungAus("r1bqkbnr/pppp1ppp/8/4N3/2BnP3/8/PPPP1PPP/RNBQK2R b KQkq - 0 4");
    expect(zeilen(todsuendenWerkzeug(stellung, "white", verlauf, INDEX), "eigen")).toEqual([
      "4. Sxe5: mögliche Materialgier vor Entwicklung (König in der Mitte, noch 2 Leichtfiguren zu Hause)",
    ]);
  });

  it("Buchzüge ohne Fragezeichen sind keine Sünde: Dänisches Gambit angenommen (Abb. 3.20)", () => {
    const stellung = stellungVon("3.20");
    const mitBuch = todsuendenWerkzeug(stellung, "white", verlaufBis("3.20"), INDEX);
    expect(zeilen(mitBuch, "gegner").some((z) => z.includes("Materialgier"))).toBe(false);
    const ohneBuch = todsuendenWerkzeug(stellung, "white", verlaufBis("3.20"));
    expect(zeilen(ohneBuch, "gegner").some((z) => z.includes("Materialgier"))).toBe(true);
  });

  it("Spanische Hauptvariante (Abb. 2.11): weder 3... a6 noch 9. h3 sind Passivität", () => {
    const alle = [...zeilen(ergebnis("2.11"), "eigen"), ...zeilen(ergebnis("2.11"), "gegner")];
    expect(alle.some((zeile) => zeile.includes("Passivität"))).toBe(false);
  });

  it("früher Randbauernzug ohne Drohung ist Passivität (1. e4 e5 2. Sf3 h6)", () => {
    const verlauf = {
      startFen: GRUNDSTELLUNG,
      zuege: ["e4", "e5", "Nf3", "h6"],
    };
    const stellung = stellungAus("rnbqkbnr/pppp1pp1/7p/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 0 3");
    const auswertung = todsuendenWerkzeug(stellung, "white", verlauf);
    expect(zeilen(auswertung, "gegner")).toEqual([
      "2... h6: mögliche Passivität: Randbauernzug ohne konkrete Drohung",
    ]);
  });
});

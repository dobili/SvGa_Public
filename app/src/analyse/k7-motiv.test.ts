/**
 * Referenztests für k7-motiv an den Abbildungen der zwölf Grundmotive (Kapitel 7) und
 * Kalibrierung an den verschlagworteten Übungen 7.44 bis 7.61 (Motiv laut Buch).
 */
import { Chess } from "chessops/chess";
import { makeFen, parseFen } from "chessops/fen";
import { parseSan } from "chessops/san";
import { describe, expect, it } from "vitest";
import {
  abbildung,
  hauptlinieNach,
  ladeKapitel,
  stellungAus,
  stellungVon,
  verlaufBis,
} from "../schach/buchabbildungen.testhilfe";
import { mattbild } from "../schach/mattbilder";
import { motiv } from "./k7-motiv";

/** Abb. 7.10 einen Zug früher: der Springer auf e5, Weiß am Zug (aus „nach 1. Sf7+“ erschlossen). */
const VOR_SF7 = "rnbqk2r/pppp2pp/5n2/4N3/2B5/8/PPPP1PPP/R1BQR1K1 w kq - 0 1";

function motivzeilenVon(e: ReturnType<typeof motiv>): readonly string[] {
  return e.befunde.find((b) => b.kennung === "motiv")?.zeilen ?? [];
}

/** Das Werkzeug an einer Abbildung mit der Hauptvariante des Buches. */
function ergebnis(nummer: string) {
  const [zug, ...fortsetzung] = hauptlinieNach(nummer);
  return motiv(stellungVon(nummer), zug, fortsetzung, verlaufBis(nummer));
}
function motivzeilen(nummer: string): readonly string[] {
  return ergebnis(nummer).befunde.find((b) => b.kennung === "motiv")?.zeilen ?? [];
}

describe("k7-motiv an den Abbildungen der Motive", () => {
  it.each([
    ["7.6", "Spieß"],
    ["7.9", "Abzug"],
    ["7.11", "Doppelschach"],
    ["7.14", "Hinlenkung"],
    ["7.16", "Hinlenkung"],
    ["7.17", "Räumung"],
    ["7.18", "Beseitigung der Verteidigung"],
    ["7.20", "Überlastung"],
    ["7.21", "Zwischenzug"],
    ["7.23", "Desperado"],
    ["7.26", "Umwandlung"],
    ["7.27", "Dauerschach"],
    ["7.29", "Patt"],
    ["7.8", "Batterie"],
  ])("Abb. %s: erstes Motiv %s", (nummer, name) => {
    expect(motivzeilen(nummer)[0]).toMatch(new RegExp(`^${name}:`));
  });

  it("Abb. 7.14: dazu die Gabel, Schlüsselzug gold, Ziel g8 rot, Fazit", () => {
    const e = ergebnis("7.14");
    expect(motivzeilen("7.14")[1]).toContain("Gabel");
    // 1. Th8+ trifft König und Turm a8, aber der König schlägt den Turm: kein Spieß (N55).
    expect(motivzeilen("7.14")[1]).not.toContain("Spieß");
    expect(e.markierungen).toContainEqual({ typ: "pfeil", farbe: "gold", von: "h1", nach: "h8" });
    expect(e.markierungen).toContainEqual({ typ: "feld", farbe: "rot", feld: "g8" });
    expect(e.fazit).toBe("Th8+: Hinlenkung.");
    expect(e.befunde[0]?.titel).toBe("Schlüsselzug (der nächste Zug im Buch)");
  });

  it("Abb. 7.11: nach dem Doppelschach folgt das Grundreihenmatt mit Springerdeckung", () => {
    expect(motivzeilen("7.11")).toContain("Mattbild: Grundreihenmatt");
  });

  it("Abb. 7.37: Hinlenkung mit Damenopfer, Anastasia-Matt", () => {
    expect(ergebnis("7.37").fazit).toBe(
      "Dxh7+: Hinlenkung, Anastasia-Matt (Springer sperrt, Turm setzt auf der Randlinie matt).",
    );
  });

  it("Abb. 7.1 (vor 1. Dd5+): Doppelangriff auf König g8 und Turm a8", () => {
    const vorher = stellungAus("r5k1/p5pp/8/8/8/8/5PPP/3Q2K1 w - - 0 1");
    const e = motiv(vorher, "Qd5+", ["Kh8", "Qxa8#"]);
    expect(e.befunde.find((b) => b.kennung === "motiv")?.zeilen[0]).toMatch(/^Doppelangriff:/);
    expect(e.markierungen).toContainEqual({ typ: "feld", farbe: "rot", feld: "a8" });
    expect(e.fazit).toBe("Dd5+: Doppelangriff, Grundreihenmatt.");
  });

  it("Abb. 7.25 (Arche Noah): ...c4 fängt den Läufer b3", () => {
    const e = ergebnis("7.25");
    expect(e.fazit).toBe("c4: Gefangene Figur.");
    expect(e.markierungen).toContainEqual({ typ: "feld", farbe: "rot", feld: "b3" });
  });

  it("Abb. 7.21 (C1.17): Zwischenzug bleibt, dazu die durchbrochene relative Fesselung; kein Boden-Matt", () => {
    expect(motivzeilen("7.21")).toContain(
      "Relative Fesselung durchbrochen (Kapitel 7: „Nicht überschätzen“)",
    );
    // Der Springer e4 deckt d2 und f2 mit: Die Läufer geben das Matt nicht allein.
    expect(ergebnis("7.21").fazit).toBe("Sxe4: Zwischenzug, Matt.");
  });

  it("Boden-Matt (C1.17): Abb. 7.41 und Übung 7.59 bleiben Boden-Matt", () => {
    const regeln = stellungVon("7.41").regeln;
    expect(regeln ? mattbild(regeln) : null).toBe("boden");
    expect(motivzeilen("7.59")).toContain("Mattbild: Boden-Matt (zwei Läufer kreuzen sich)");
  });

  it("Abb. 7.28 (C1.18): im Schach zählt die Schachfolge bis zur Abbildung, Dauerschach", () => {
    const e = ergebnis("7.28");
    expect(e.fazit).toBe("De1+: Dauerschach.");
    expect(e.befunde[0]?.titel).toBe("Schlüsselzug (die Züge, die zum Schach geführt haben)");
    expect(e.befunde[0]?.zeilen[0]).toBe("De1+ – nachgespielt: De1+ Kg2 De2+");
  });

  it("Abb. 7.10 (C1.18): mit dem Zug 1. Sf7+ als Vorlauf heißt das Motiv Abzug", () => {
    // Die Stellung vor 1. Sf7+ (Springer e5): Nur von e5 aus gibt Sf7 ein Abzugsschach des Turms e1.
    const vorlauf = { startFen: VOR_SF7, zuege: ["Nf7+"] };
    const e = motiv(stellungVon("7.10"), "Kf8", ["Nxd8"], vorlauf);
    const pos = Chess.fromSetup(parseFen(VOR_SF7).unwrap()).unwrap();
    const sf7 = parseSan(pos, "Nf7+");
    if (sf7) pos.play(sf7);
    expect(makeFen(pos.toSetup())).toBe(abbildung("7.10").fen);
    expect(e.fazit).toBe("Sf7+: Abzug.");
    expect(motivzeilenVon(e)).toContain("Dazu: Gabel");
    // Seit 0.2.33 beginnt die Zugfolge k07-a10 mit 1. Sf7+: Die Daten liefern denselben Befund.
    expect(ergebnis("7.10").fazit).toBe("Sf7+: Abzug.");
  });

  it("Abb. 7.22 (C1.18): das Zwischenschach Lxf2+ nach 7. Lxd8 zählt mit 6... Sxe4 als Zwischenzug", () => {
    expect(ergebnis("7.22").fazit).toBe("Sxe4: Zwischenzug.");
  });

  it("Abb. 9.34 (C5): ein Bauer weniger, aber die Schachs wiederholen die Stellung", () => {
    expect(motivzeilen("9.34").join(" ")).toContain("Dauerschach");
  });

  it("Abb. 10.3: Schachs der Seite, die nicht auf Verlust steht, sind kein Dauerschach", () => {
    expect(motivzeilen("10.3").join(" ")).not.toContain("Dauerschach");
  });

  it("ohne Zug und ohne Verlauf (Abb. 7.2): nur der Hinweis", () => {
    expect(motiv(stellungVon("7.2")).befunde[0]?.kennung).toBe("keins");
  });
});

/**
 * Kalibrierung: je Übung das erste Motiv oder Mattbild der App gegen das Motiv laut Buch.
 * Abweichungen stehen als Befund in docs/FORTSCHRITT.md und hier mit `abweichung`.
 */
const ERWARTET: Record<string, { erstes?: RegExp; mattbild?: string; abweichung?: string }> = {
  "7.44": { erstes: /^Dauerschach/ }, // „Rasender Turm und Patt“: Patt nach Txe7 erkennt die App nur am Köderfeld
  "7.45": { abweichung: "Übung ohne Lösungszug (Grundreihenmatt verhindern)" },
  "7.46": { erstes: /^Ablenkung/, mattbild: "Grundreihenmatt" },
  "7.47": { erstes: /^Gabel/ },
  "7.48": { mattbild: "Grundreihenmatt" },
  "7.49": { erstes: /^Spieß/ },
  "7.50": { erstes: /^Fesselung/ },
  "7.51": { erstes: /^Abzug/ },
  "7.52": { erstes: /^Hinlenkung/ },
  "7.53": { erstes: /^Überlastung/ }, // Dame d8 hält c7 und e8 (Rückschlag-Probe, C2.9)
  "7.54": { mattbild: "Arabisches Matt" },
  "7.55": { mattbild: "Erstickungsmatt" },
  "7.56": { erstes: /^Hinlenkung/ }, // „Damenopfer und Doppelschach“: Doppelschach steht als zweites Motiv
  "7.57": { erstes: /^Beseitigung/ },
  "7.58": { mattbild: "Anastasia-Matt" },
  "7.59": { mattbild: "Boden-Matt" },
  "7.60": { mattbild: "Damiano-Matt" },
  "7.61": { mattbild: "Lolli-Matt" }, // als Drohung nach 1. Dh6
};

describe("k7-motiv an den Übungen des Buches", () => {
  const uebungen = ladeKapitel(7).uebungen;

  it("alle 18 Übungen haben eine Erwartung", () => {
    expect(uebungen.map((u) => u.abbildungen[0])).toEqual(Object.keys(ERWARTET));
  });

  it.each(uebungen.map((u) => [u.abbildungen[0] ?? "", u] as const))(
    "Übung an Abb. %s: Motiv wie im Buch",
    (nummer, uebung) => {
      const erwartung = ERWARTET[nummer];
      if (!erwartung || erwartung.abweichung) return;
      const [zug, ...fortsetzung] = hauptlinieNach(nummer);
      const e = motiv(stellungVon(nummer), zug, fortsetzung, verlaufBis(nummer), uebung);
      const zeilen = e.befunde.find((b) => b.kennung === "motiv")?.zeilen ?? [];
      if (erwartung.erstes) expect(zeilen[0]).toMatch(erwartung.erstes);
      if (erwartung.mattbild) expect(zeilen.join(" ")).toContain(erwartung.mattbild);
      expect(e.art).toBe("E");
      expect(e.befunde.at(-1)?.zeilen[0]).toBe(`Motiv: ${uebung.erklaerung?.motiv ?? ""}`);
    },
  );
});

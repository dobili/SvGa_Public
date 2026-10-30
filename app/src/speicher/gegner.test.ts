/** Tests der eigenen Gegner im Speicher: lesen, anlegen, ersetzen, löschen, Grenze. */
import { describe, expect, it } from "vitest";
import { FEHLERARTEN } from "../engine/fehlerart";
import type { EigenerGegner } from "../engine/gegner";
import { MAX_EROEFFNUNGSWERT } from "../spiel/boteroeffnung";
import { leereDaten } from "./format";
import { spielstandAus } from "./partienLesen";
import { pruefeSicherung, sicherungAlsText } from "./sicherung";
import {
  abweichungAus,
  eroeffnungenAus,
  fehlerartenAus,
  eigeneGegnerAus,
  eigenerGegnerAus,
  MAX_EIGENE_GEGNER,
  mitEigenemGegner,
  ohneEigenenGegner,
} from "./gegner";

const RAMBO: EigenerGegner = {
  kennung: "eigen-1",
  name: "Rambo",
  stufenJePhase: { eroeffnung: 3, mittelspiel: 4, endspiel: 3 },
  fehlerarten: ["figurHaengen", "bauernraub"],
  stil: 2,
  blindeFlecken: ["rueckzug"],
};

describe("Eigene Gegner", () => {
  it("liest Rohdaten Feld für Feld; Unpassendes bekommt die Vorgabe", () => {
    expect(eigenerGegnerAus(JSON.parse(JSON.stringify(RAMBO)))).toEqual(RAMBO);
    expect(eigenerGegnerAus({ kennung: "x", name: "   " })).toBeNull();
    expect(eigenerGegnerAus({ name: "ohne Kennung" })).toBeNull();
    const krumm = eigenerGegnerAus({
      kennung: "k",
      name: "Krumm",
      stufenJePhase: { eroeffnung: 11, mittelspiel: "4" },
      fehlerarten: ["unsinn", "koenigPassiv"],
      stil: 7.6,
    });
    expect(krumm).toEqual({
      kennung: "k",
      name: "Krumm",
      stufenJePhase: { eroeffnung: 1, mittelspiel: 1, endspiel: 1 },
      fehlerarten: ["koenigPassiv"],
      stil: 2,
      blindeFlecken: [],
    });
    expect(eigenerGegnerAus({ kennung: "a", name: "Alle" })?.fehlerarten).toEqual(FEHLERARTEN);
    expect(eigeneGegnerAus("unsinn")).toEqual([]);
  });

  it("legt an, ersetzt nach Kennung, löscht, und hält die Grenze", () => {
    let liste = mitEigenemGegner([], RAMBO);
    liste = mitEigenemGegner(liste, { ...RAMBO, kennung: "eigen-2", name: "Lotte" });
    expect(liste.map((g) => g.name)).toEqual(["Rambo", "Lotte"]);
    liste = mitEigenemGegner(liste, { ...RAMBO, name: "Rambo II" });
    expect(liste.map((g) => g.name)).toEqual(["Rambo II", "Lotte"]);
    expect(ohneEigenenGegner(liste, "eigen-1").map((g) => g.name)).toEqual(["Lotte"]);
    let voll: readonly EigenerGegner[] = [];
    for (let i = 0; i < MAX_EIGENE_GEGNER + 2; i += 1) {
      voll = mitEigenemGegner(voll, { ...RAMBO, kennung: `eigen-${i}` });
    }
    expect(voll).toHaveLength(MAX_EIGENE_GEGNER);
  });
});

describe("Fehlerarten aus dem Speicher (0.2.118)", () => {
  const NEU = ["bauerEingestellt", "schlagVerpasst", "bauernzugOhneNot", "koenigszugOhneNot"];
  const ALT = FEHLERARTEN.filter((a) => !NEU.includes(a));
  it("eine vollständige alte Liste bekommt die neuen Arten dazu", () => {
    expect(fehlerartenAus(ALT)).toEqual(FEHLERARTEN);
  });
  it("eine abgehakte alte Liste bleibt, wie der Leser sie wollte", () => {
    const ohne = ALT.filter((a) => a !== "figurHaengen");
    expect(fehlerartenAus(ohne)).toEqual(ohne);
  });
});

describe("Stil und Reglerstufen aus dem Speicher (Teil E, 0.2.126)", () => {
  it("liest Stil und gültige Stufen, Unbekanntes fällt weg", () => {
    const g = eigenerGegnerAus({
      ...RAMBO,
      stilname: "draufgaenger",
      reglerstufen: { verfruehteDame: 3, bauernraub: 9, gibtEsNicht: 1, figurHaengen: -2 },
    });
    expect(g?.stilname).toBe("draufgaenger");
    expect(g?.reglerstufen).toEqual({ verfruehteDame: 3, figurHaengen: -2 });
  });
  it("ältere Gegner ohne die Felder bleiben unverändert", () => {
    const g = eigenerGegnerAus({ ...RAMBO, stilname: "gibtEsNicht" });
    expect(g).not.toHaveProperty("stilname");
    expect(g).not.toHaveProperty("reglerstufen");
  });
});

describe("Eigene Gegner: feste Eröffnungen und Abweichung (Paket 9)", () => {
  const MIT: EigenerGegner = {
    ...RAMBO,
    eroeffnungen: ["praxis:Italian Game", "Londoner System"],
    abweichung: 20,
  };

  it("ältere Gegner ohne Felder laden unverändert, neue mit Feldern vollständig", () => {
    expect(eigenerGegnerAus(JSON.parse(JSON.stringify(RAMBO)))).toEqual(RAMBO);
    expect(eigenerGegnerAus(JSON.parse(JSON.stringify(MIT)))).toEqual(MIT);
    // So liest auch eine ältere App einen neueren Gegner: Unbekannte Felder fallen still weg
    // (kein Absturz; beim nächsten Speichern dort gehen die Eröffnungen verloren).
    expect(eigenerGegnerAus({ ...RAMBO, kuenftigesFeld: [1, 2] })).toEqual(RAMBO);
  });

  it("prüft die Felder: nur Texte, ohne Doppelte, Abweichung 0 bis 100 ganzzahlig", () => {
    expect(eroeffnungenAus(["a", 3, "", "a", "b", "x".repeat(MAX_EROEFFNUNGSWERT + 1)])).toEqual([
      "a",
      "b",
    ]);
    expect(eroeffnungenAus("a")).toBeUndefined();
    expect(abweichungAus(150)).toBe(100);
    expect(abweichungAus(-3)).toBe(0);
    expect(abweichungAus(33.4)).toBe(33);
    expect(abweichungAus("20")).toBeUndefined();
    const krumm = eigenerGegnerAus({ ...RAMBO, eroeffnungen: [], abweichung: Number.NaN });
    expect(krumm).toEqual(RAMBO);
  });

  it("übersteht Spielstand, Sicherung und Import", () => {
    const daten = leereDaten(new Date("2026-10-30T10:00:00Z"));
    const mitGegner = { ...daten, spiel: { ...daten.spiel, eigeneGegner: [MIT, RAMBO] } };
    expect(spielstandAus(JSON.parse(JSON.stringify(mitGegner.spiel))).eigeneGegner).toEqual([
      MIT,
      RAMBO,
    ]);
    const text = sicherungAlsText(mitGegner, "0.3.12", new Date("2026-10-30T10:00:00Z"));
    const pruefung = pruefeSicherung(text, new Date("2026-10-30T11:00:00Z"));
    expect(pruefung.ok && pruefung.daten.spiel.eigeneGegner).toEqual([MIT, RAMBO]);
  });
});

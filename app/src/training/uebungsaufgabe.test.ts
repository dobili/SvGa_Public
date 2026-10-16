/**
 * Tests der Übungsaufgaben an allen 86 Übungen des Buches (AP 13): Welche lassen sich auf dem
 * Brett lösen, und erkennt die Prüfung Lösung, akzeptierte Züge und Fehler?
 */
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import type { Datenverzeichnis } from "../daten/generiert/index";
import type { Kapitel } from "../daten/generiert/kapitel";
import { aufgabeZu, pruefeZug, stellungNach, zuegeAusText, type Uebungsaufgabe } from "./uebungsaufgabe";

const ORDNER = new URL("../../public/daten/de/a1/", import.meta.url);
const lies = <T>(datei: string): T => JSON.parse(readFileSync(new URL(datei, ORDNER), "utf8")) as T;
const kapitel = lies<Datenverzeichnis>("index.json").kapitel.map((e) => lies<Kapitel>(e.datei));
const uebungen = kapitel.flatMap((k) => k.uebungen);
const fenVon = (nummer: string) =>
  kapitel.flatMap((k) => k.abbildungen).find((a) => a.id === nummer)?.fen ?? null;

function aufgabe(id: string): Uebungsaufgabe {
  const uebung = uebungen.find((u) => u.id === id);
  if (!uebung) throw new Error(`Übung ${id} fehlt`);
  const erste = uebung.abbildungen[0];
  return aufgabeZu(
    erste ? fenVon(erste) : null,
    uebung.erklaerung?.loesung ?? null,
    uebung.erklaerung?.akzeptiert ?? [],
  );
}

function zugaufgabe(id: string) {
  const a = aufgabe(id);
  if (a.art !== "zug") throw new Error(`${id} ist keine Zugaufgabe`);
  return a;
}

describe("Übungsaufgaben", () => {
  it("Notation: Zugnummern, Zeichen, Doppelschach, deutsche Buchstaben", () => {
    expect(zuegeAusText("1. cxd5! cxd5 2. exd5")).toEqual(["cxd5", "cxd5", "exd5"]);
    expect(zuegeAusText("4... Sf6")).toEqual(["Nf6"]);
    expect(zuegeAusText("2. Sh6++ Kh8 3. Dg8+!!")).toEqual(["Nh6+", "Kh8", "Qg8+"]);
    expect(zuegeAusText("e8=D 0-0")).toEqual(["e8=Q", "O-O"]);
  });

  it("63 der 86 Übungen sind Zugaufgaben, die übrigen Denkaufgaben", () => {
    const arten = uebungen.map((u) => aufgabe(u.id).art);
    expect(arten.filter((a) => a === "zug")).toHaveLength(63);
    expect(arten).toHaveLength(86);
  });

  it("Abb. 1.40: „1. Sc7+!“ ist richtig, ein anderer Zug falsch", () => {
    const a = zugaufgabe("ueb:droh-ignorieren");
    expect(pruefeZug(a, [], "Nc7+")).toEqual({ art: "geloest", linie: 0 });
    expect(pruefeZug(a, [], "a3")).toEqual({ art: "falsch" });
  });

  it("Abb. 1.41: Lösung mit Antworten der Gegenseite, dazu der akzeptierte Zug 1. exd5", () => {
    const a = zugaufgabe("ueb:zaehlen-vorstoss");
    expect(pruefeZug(a, [], "cxd5")).toEqual({ art: "weiter", antwort: "cxd5", linie: 0 });
    expect(pruefeZug(a, ["cxd5", "cxd5"], "exd5")).toMatchObject({ art: "weiter", antwort: "exd5" });
    expect(pruefeZug(a, ["cxd5", "cxd5", "exd5", "exd5"], "Nxd5")).toEqual({
      art: "geloest",
      linie: 0,
    });
    expect(pruefeZug(a, [], "exd5")).toEqual({ art: "geloest", linie: 1 });
    expect(pruefeZug(a, ["cxd5", "cxd5"], "a3")).toEqual({ art: "falsch" });
  });

  it("Abb. 7.55: Doppelschach „++“ im Buch, chessops schreibt „+“", () => {
    const a = zugaufgabe("ueb:taktik-a09");
    expect(a.linien[0]).toEqual(["Nf7+", "Kg8", "Nh6+", "Kh8", "Qg8+", "Rxg8", "Nf7#"]);
    expect(pruefeZug(a, ["Nf7+", "Kg8"], "Nh6")).toMatchObject({ art: "weiter" });
  });

  it("Übung „Notation schreiben“ ist eine Denkaufgabe (Lösung beginnt nicht am Diagramm)", () => {
    expect(aufgabe("ueb:notation-schreiben")).toEqual({ art: "denken" });
  });

  it("Stellung nach Zügen; Unpassendes beendet das Nachspielen", () => {
    const start = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
    expect(stellungNach(start, ["e4", "e5"])).toBe(
      "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
    );
    expect(stellungNach(start, ["e5"])).toBe(start);
  });
});

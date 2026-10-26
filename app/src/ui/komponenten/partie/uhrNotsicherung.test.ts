/** Tests der sofortigen Uhrsicherung beim Verlassen der App (N180), mit Ersatz-Gerätespeicher. */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { pausiere, zieheMitUhr } from "../../../spiel/ablauf";
import { leserzug, neuePartie, type Partie } from "../../../spiel/partie";
import { restzeit } from "../../../spiel/uhr";
import { mitGesicherterUhr, sichereUhr, verwerfeUhrsicherung } from "./uhrNotsicherung";

const GRUNDSTELLUNG = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
const MINUTE = 60_000;
const BEGINN = 1_000_000;

/** Ersatz für localStorage in der Node-Umgebung der Tests. */
function ersatzspeicher(): Storage {
  const werte = new Map<string, string>();
  return {
    get length() {
      return werte.size;
    },
    clear: () => werte.clear(),
    getItem: (schluessel) => werte.get(schluessel) ?? null,
    key: (index) => [...werte.keys()][index] ?? null,
    removeItem: (schluessel) => void werte.delete(schluessel),
    setItem: (schluessel, wert) => void werte.set(schluessel, wert),
  };
}

/** Partie 15+0 mit 1. e4 e5: Weiß (der Leser) ist am Zug, seine Uhr läuft seit BEGINN. */
function laufendePartie(id = "p"): Partie {
  const neu = neuePartie(
    {
      startFen: GRUNDSTELLUNG,
      eigeneFarbe: "white",
      stufe: 1,
      uhr: { grundzeitMs: 15 * MINUTE, zuschlagMs: 0 },
      ruecknahmeErlaubt: true,
      abbildung: null,
      eroeffnung: null,
      stufenJePhase: { eroeffnung: 1, mittelspiel: 1, endspiel: 1 },
      gegner: "engine",
      bot: null,
      hilfen: { symbole: true, werkzeuge: true },
      gewertet: true,
    },
    id,
    "2026-10-19T08:00:00.000Z",
  );
  const nachE4 = neu && zieheMitUhr(neu, leserzug("e4"), BEGINN);
  const nachE5 = nachE4 && zieheMitUhr(nachE4, { ...leserzug("e5"), von: "engine" }, BEGINN);
  if (!nachE5) throw new Error("Partie nicht aufgebaut");
  return nachE5;
}

beforeEach(() => vi.stubGlobal("window", { localStorage: ersatzspeicher() }));
afterEach(() => vi.unstubAllGlobals());

describe("Uhrsicherung beim Verlassen (N180)", () => {
  it("übernimmt nach abgebrochenem Speichern die Restzeit vom Moment des Verlassens", () => {
    const gespeichert = laufendePartie();
    sichereUhr(pausiere(gespeichert, BEGINN + 2 * MINUTE));
    // So steht die Partie nach dem Neuladen in IndexedDB: Uhrstand vom letzten Zug, angehalten.
    const ausDatenbank = pausiere(gespeichert, BEGINN);
    const uhr = mitGesicherterUhr(ausDatenbank).uhr;
    if (!uhr) throw new Error("Uhr fehlt");
    expect(uhr.laeuft).toBeNull();
    expect(restzeit(uhr, "white", BEGINN + 9 * MINUTE)).toBe(13 * MINUTE);
  });

  it("gilt nicht für eine andere Partie oder nach weiteren Zügen", () => {
    const gespeichert = laufendePartie();
    sichereUhr(pausiere(gespeichert, BEGINN + 2 * MINUTE));
    const andere = laufendePartie("q");
    expect(mitGesicherterUhr(andere)).toBe(andere);
    const weiter = zieheMitUhr(gespeichert, leserzug("Nf3"), BEGINN + MINUTE);
    expect(weiter && mitGesicherterUhr(weiter)).toBe(weiter);
  });

  it("nach der Rückkehr ist die Sicherung verworfen", () => {
    const gespeichert = laufendePartie();
    sichereUhr(pausiere(gespeichert, BEGINN + 2 * MINUTE));
    verwerfeUhrsicherung();
    expect(mitGesicherterUhr(gespeichert)).toBe(gespeichert);
  });

  it("eine unlesbare Sicherung wird übergangen", () => {
    window.localStorage.setItem("svga.uhrNotsicherung", "{kaputt");
    vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const gespeichert = laufendePartie();
    expect(mitGesicherterUhr(gespeichert)).toBe(gespeichert);
  });
});

/** Tests der Zeitkarten und Sprüche (Schritt 13): Uhr, gefühlte Zeitnot, Erlaubnis, Texte. */
import { describe, expect, it } from "vitest";
import { leserzug, neuePartie, ziehe, type Partie } from "../../spiel/partie";
import type { Kartensorte } from "../schnittstelle/karten";
import {
  immunGegen,
  MINDESTREST_MS,
  mitZeitwirkung,
  passtZurPartie,
  spruecheErlaubt,
} from "./zeitkarten";

const GRUNDSTELLUNG = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
const DREI_MINUTEN = 180_000;

/** Blitz 3 + 2, Leser Weiß, nach 1. e4; die Uhr steht (laeuft null). */
function partie(mitUhr: boolean): Partie {
  const start = neuePartie(
    {
      startFen: GRUNDSTELLUNG,
      eigeneFarbe: "white",
      stufe: 3,
      uhr: mitUhr ? { grundzeitMs: DREI_MINUTEN, zuschlagMs: 2_000 } : null,
      ruecknahmeErlaubt: false,
      abbildung: null,
      eroeffnung: null,
      stufenJePhase: { eroeffnung: 3, mittelspiel: 3, endspiel: 3 },
      gegner: "engine",
      bot: null,
      hilfen: { symbole: true, werkzeuge: true },
      gewertet: false,
      abenteuer: { kennung: "mapleFalls.skaterJo#a" },
    },
    "p",
    "2026-11-08T08:00:00.000Z",
  );
  const nach = start && ziehe(start, leserzug("e4"));
  if (!nach) throw new Error("Partie fehlt");
  return { ...nach, uhr: nach.uhr && { ...nach.uhr, laeuft: null } };
}

function sorte(teil: Partial<Kartensorte>): Kartensorte {
  return {
    kennung: "k",
    name: "n",
    spruch: "s",
    bild: "b",
    stufe: "leicht",
    art: "verbrauch",
    wirkung: { art: "zeit", wer: "leser", sekunden: 120 },
    zeitpunkt: "waehrend",
    ...teil,
  };
}

describe("Zeitkarten auf der Uhr", () => {
  it("Kühler Kopf gibt dem Leser zwei Minuten", () => {
    const nachher = mitZeitwirkung(partie(true), { art: "zeit", wer: "leser", sekunden: 120 }, 0);
    expect(nachher.uhr?.restMs.white).toBe(DREI_MINUTEN + 120_000);
    expect(nachher.uhr?.restMs.black).toBe(DREI_MINUTEN);
  });

  it("Grübelfalle nimmt dem Gegner eine Minute, aber nie unter fünf Sekunden", () => {
    const p = partie(true);
    const nachher = mitZeitwirkung(p, { art: "zeit", wer: "gegner", sekunden: -60 }, 0);
    expect(nachher.uhr?.restMs.black).toBe(DREI_MINUTEN - 60_000);
    const knapp = p.uhr && { ...p, uhr: { ...p.uhr, restMs: { ...p.uhr.restMs, black: 30_000 } } };
    if (!knapp) throw new Error("Uhr fehlt");
    const rest = mitZeitwirkung(knapp, { art: "zeit", wer: "gegner", sekunden: -60 }, 0);
    expect(rest.uhr?.restMs.black).toBe(MINDESTREST_MS);
  });

  it("Großes Maul setzt die gefühlte Zeitnot für fünf Züge des Gegners, auch ohne Uhr", () => {
    const p = partie(false);
    const nachher = mitZeitwirkung(p, { art: "zeitnot", zuege: 5 }, 0);
    expect(nachher.einstellung.abenteuer?.zeitnotBis).toBe(p.zuege.length + 10);
    expect(nachher.uhr).toBeNull();
  });
});

describe("Wann ein Spruch wirkt", () => {
  it("nur gegen Straßengegner", () => {
    expect(spruecheErlaubt("strasse")).toBe(true);
    expect(spruecheErlaubt("clubchef")).toBe(false);
    expect(spruecheErlaubt(null)).toBe(false);
  });

  it("Zeitkarten brauchen eine Uhr, Sprüche einen Straßengegner", () => {
    const kopf = sorte({ spruch_art: true });
    expect(passtZurPartie(kopf, { uhr: true, sprueche: true })).toBe(true);
    expect(passtZurPartie(kopf, { uhr: false, sprueche: true })).toBe(false);
    expect(passtZurPartie(kopf, { uhr: true, sprueche: false })).toBe(false);
    const maul = sorte({ spruch_art: true, wirkung: { art: "zeitnot", zuege: 5 } });
    expect(passtZurPartie(maul, { uhr: false, sprueche: true })).toBe(true);
    expect(
      passtZurPartie(sorte({ wirkung: { art: "fingerzeig" } }), { uhr: false, sprueche: false }),
    ).toBe(true);
  });

  it("immune Gegner stehen im Profil", () => {
    expect(immunGegen(["grossesMaul"], "grossesMaul")).toBe(true);
    expect(immunGegen(undefined, "grossesMaul")).toBe(false);
  });
});

describe("Remisangebot", () => {
  it("nur gegen Straßengegner und Clubmitglieder", async () => {
    const { remisMoeglich } = await import("./zeitkarten");
    expect(remisMoeglich("strasse")).toBe(true);
    expect(remisMoeglich("clubchef")).toBe(false);
    const remis = sorte({ wirkung: { art: "remis" } });
    expect(passtZurPartie(remis, { uhr: false, sprueche: false, remis: false })).toBe(false);
    expect(passtZurPartie(remis, { uhr: false, sprueche: false, remis: true })).toBe(true);
  });
});

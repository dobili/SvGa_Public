/**
 * Tests der Zeilen des Tischgesprächs und der Karten (docs/spiel/29, Abschnitte 5 und 6) gegen die
 * echten Spieltexte: genug Varianten je Gruppe, eigene Zeilen vor dem Temperament.
 */
import { describe, expect, it } from "vitest";
import { TEMPERAMENTE } from "../regeln/tischgespraech";
import { tSpiel } from "../texte/texte";
import { spruchzeilen } from "./spruchkarte";
import { schutzengeltext } from "./tischsprecher";
import { ambrosetext, tischtext, varianten } from "./tischtexte";
import type { Gegnerdaten } from "../daten/laden";

const PARTIE = ["beginn", "schlaegtFigur", "verliertFigur", "schach", "gibtSchach", "rochade"];
const WEITERE = ["umwandlung", "vorne", "hinten", "zeitnot", "sieg", "remis", "niederlage"];
const RAETSEL = ["richtig", "falsch", "serie", "letzte"];
const SPRUECHE = ["grossesMaul", "gruebelfalle", "kuehlerKopf", "schmeichelei", "ablenkung"];

describe("Texte des Tischgesprächs", () => {
  it("hat je Temperament und Ereignis drei bis fünf Zeilen", () => {
    for (const t of TEMPERAMENTE) {
      for (const e of [...PARTIE, ...WEITERE, ...RAETSEL]) {
        const n = varianten(`tisch.${t}.${e}`).length;
        expect(n, `tisch.${t}.${e}`).toBeGreaterThanOrEqual(3);
        expect(n, `tisch.${t}.${e}`).toBeLessThanOrEqual(5);
      }
    }
  });

  it("nimmt eigene Zeilen einer Figur vor denen des Temperaments", () => {
    const jo = { kennung: "mapleFalls.skaterJo", temperament: "frech" as const };
    const zeile = tischtext(jo, "beginn", 0, "p");
    const eigene = varianten("tisch.figur.skaterJo.beginn").map((k) => tSpiel(k));
    expect(eigene).toContain(zeile?.text);
    const finale = tischtext(
      { kennung: "capitalArena.victor", temperament: "ehrgeizig" },
      "sieg",
      0,
      "p",
    );
    expect(varianten("tisch.figur.capitalArena.victor.sieg").map((k) => tSpiel(k))).toContain(
      finale?.text,
    );
  });

  it("Ambrose hat Zeilen zu Rückstand, Zeitnot, Fehler und Hinweis", () => {
    for (const e of ["hinten", "zeitnot", "falsch", "hinweis"]) {
      expect(ambrosetext(e, 0, "p")?.text.length).toBeGreaterThan(0);
    }
  });
});

describe("Karten sprechen", () => {
  it("jeder Spruch hat mindestens fünfzehn Zeilen", () => {
    for (const k of SPRUECHE) expect(varianten(`spruch.${k}`).length).toBeGreaterThanOrEqual(15);
  });

  it("Konter und Abwehr je Temperament", () => {
    for (const t of TEMPERAMENTE) {
      expect(varianten(`spruch.konter.${t}`).length).toBeGreaterThanOrEqual(5);
      expect(varianten(`spruch.immun.${t}`).length).toBeGreaterThanOrEqual(3);
    }
  });

  it("Schutzengel hat je Grund mindestens sechs Zeilen und verrät keinen Zug", () => {
    for (const g of ["halt", "haengt", "koenig", "matt"]) {
      expect(varianten(`schutzengel.${g}`).length).toBeGreaterThanOrEqual(6);
    }
    expect(schutzengeltext("haengt", "p").stimmung).toBe("ernst");
  });

  it("ein immuner Gegner wehrt passend zu seinem Temperament ab", () => {
    const rosa = {
      kennung: "cedarCreek.rosa",
      name: "figur.rosa.name",
      rolle: "strasse",
      immunGegen: ["grossesMaul"],
    } as unknown as Gegnerdaten;
    const zeilen = spruchzeilen("grossesMaul", rosa, "p", 0);
    expect(zeilen.immun).toBe(true);
    expect(varianten("spruch.immun.frech").map((k) => tSpiel(k))).toContain(zeilen.antwort?.text);
    const jo = {
      ...rosa,
      kennung: "mapleFalls.skaterJo",
      immunGegen: [],
    } as unknown as Gegnerdaten;
    const konter = spruchzeilen("grossesMaul", jo, "p", 0);
    const vorrat = [...varianten("spruch.konter.skaterJo"), ...varianten("spruch.konter.frech")];
    expect(vorrat.map((k) => tSpiel(k))).toContain(konter.antwort?.text);
    expect(konter.held).not.toBeNull();
  });
});

/**
 * Tests der Regeln der Karte „Fehler mit Buchbezug“ (Konzept 4.1): Eingaben aus der
 * gespeicherten Auswertung, Warum vor Finden, nichts doppelt, „Verpasst“ ohne Warum-Zeile, W1
 * vor allem anderen, dazu der Satz der Findezeile.
 */
import { describe, expect, it } from "vitest";
import { baueFallenindex } from "../analyse/warumfalle";
import { t } from "../i18n/sprache";
import { ladeKapitel, stellungVon } from "../schach/buchabbildungen.testhilfe";
import { buchbefundeFuer, findeeingabeAus, ohneDoppeltes, WARUM_KLASSEN } from "./buchzuege";
import { opernauswertung, opernurteile, OOO, SC3 } from "./buchzuege.testhilfe";
import { findesatz } from "./findetext";
import type { Warumbefund } from "./warumkategorie";
import { warumKategorie } from "./warumkategorie";
import { alsUci } from "../analyse/findekategorien.testhilfe";

const OPER = opernauswertung();
const URTEILE = opernurteile(OPER);

/** Ein Warum-Befund für die Regeln, ohne Erkennung. */
function warum(kennung: Warumbefund["kennung"], feld?: string): Warumbefund {
  return {
    kennung,
    text: "buchbezug.W3.text",
    werte: {},
    quelle: "buchbezug.W3.quelle",
    thema: null,
    ...(feld ? { feld } : {}),
  };
}

describe("Eingaben aus der gespeicherten Auswertung", () => {
  it("8. Sc3?: Werte aus Sicht von Weiß, bester Zug Dxb7, Stellung davor bekannt", () => {
    const e = findeeingabeAus(OPER, SC3);
    expect(e?.besterZugUci).toBe("b3b7");
    expect(e?.gespielterZugUci).toBe("b1c3");
    expect(e?.wertVorher).toBeCloseTo(1.6);
    expect(e?.wertNachGespielt).toBeCloseTo(0.2);
    expect(e?.fenDavor).toBeDefined();
  });

  it("Schwarz am Zug: Vorzeichen gedreht (12... Td8, aus Sicht von Weiß −1,5 → +4,0)", () => {
    const e = findeeingabeAus(OPER, OOO + 1);
    expect(e?.wertVorher).toBeCloseTo(1.5);
    expect(e?.wertNachGespielt).toBeCloseTo(-4);
  });
});

describe("Regeln der Karte", () => {
  it("12. O-O-O??: Warum W3 (Drohung Sxe4 stand), Warum vor Finden", () => {
    const urteil = URTEILE[OOO];
    if (!urteil) throw new Error("Urteil fehlt");
    expect(urteil.klasse).toBe("patzer");
    const { warum: w } = buchbefundeFuer(OPER, urteil, WARUM_KLASSEN);
    expect(w?.kennung).toBe("W3");
  });

  it("8. Sc3?: Findezeile F4, Dxb7 gewinnt den Bauern b7 (Zählen)", () => {
    const urteil = URTEILE[SC3];
    if (!urteil) throw new Error("Urteil fehlt");
    const { finde } = buchbefundeFuer(OPER, urteil, WARUM_KLASSEN);
    expect(finde?.kennung).toBe("F4");
    const satz = finde ? findesatz(finde) : null;
    expect(satz ? t(satz.text, satz.werte) : "").toContain("Dxb7");
  });

  it("„Verpasst“ bekommt nie eine Warum-Zeile", () => {
    const urteil = URTEILE[SC3];
    if (!urteil) throw new Error("Urteil fehlt");
    const verpasst = { ...urteil, klasse: "verpasst" as const };
    expect(buchbefundeFuer(OPER, verpasst, WARUM_KLASSEN).warum).toBeNull();
  });

  it("„gut“ und „sehr gut“ bekommen keine Findezeile", () => {
    const urteil = URTEILE[SC3];
    if (!urteil) throw new Error("Urteil fehlt");
    const gut = { ...urteil, klasse: "gut" as const };
    expect(buchbefundeFuer(OPER, gut, WARUM_KLASSEN)).toEqual({ warum: null, finde: null });
  });

  it("F10 schweigt neben einem taktischen Grund, nicht neben einer Faustregel", () => {
    const lap = { kennung: "F10" as const, details: { zug: "Nd2", feld: "b1" } };
    expect(ohneDoppeltes(warum("W3"), lap).finde).toBeNull();
    expect(ohneDoppeltes(warum("W9"), lap).finde).toEqual(lap);
  });

  it("Dieselbe Übung (W3 und F5, beide Schach-Röntgen-Trainer): nur die Warum-Zeile bleibt", () => {
    const zuerst = {
      kennung: "F5" as const,
      details: { zug: "Bxd7+", feld: "d7", art: "schach" as const },
    };
    expect(ohneDoppeltes(warum("W3"), zuerst).finde).toBeNull();
    const gabel = {
      kennung: "F3" as const,
      details: { zug: "Nc7+", feld: "c7", motiv: "gabel" as const },
    };
    expect(ohneDoppeltes(warum("W3"), gabel).finde).toEqual(gabel);
  });

  it("Dasselbe Feld wie W4 oder W5: nur die Warum-Zeile bleibt", () => {
    const schlag = { kennung: "F4" as const, details: { zug: "Nxd5", feld: "d5" } };
    expect(ohneDoppeltes(warum("W4", "d5"), schlag).finde).toBeNull();
    expect(ohneDoppeltes(warum("W4", "e4"), schlag).finde).toEqual(schlag);
  });
});

describe("W1 Falle aus dem Buch in der Warum-Kategorie", () => {
  it("Abb. 4.13, 6. Sxd5?? → W1 Elefantenfalle vor jeder anderen Kategorie", () => {
    const fen = stellungVon("4.13").fen;
    const uci = alsUci(fen, ["Nxd5"])[0] ?? "";
    const w = warumKategorie({
      vorherFen: fen,
      uci,
      widerlegung: [],
      verlust: 3,
      bester: null,
      fallenindex: baueFallenindex(ladeKapitel(4)),
    });
    expect(w?.kennung).toBe("W1");
    expect(t(w?.text ?? "buchbezug.W1.text", w?.werte)).toContain("„Elefantenfalle“");
    expect(t(w?.text ?? "buchbezug.W1.text", w?.werte)).toContain("Abb. 4.13");
  });

  it("ohne Fallenindex schweigt W1", () => {
    const fen = stellungVon("4.13").fen;
    const uci = alsUci(fen, ["Nxd5"])[0] ?? "";
    const w = warumKategorie({ vorherFen: fen, uci, widerlegung: [], verlust: 3, bester: null });
    expect(w?.kennung).not.toBe("W1");
  });
});

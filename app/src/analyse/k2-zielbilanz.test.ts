/**
 * Referenztests und Kalibrierung für das Werkzeug k2-zielbilanz an den Zielbilanzen aus Kapitel 2.
 *
 * Die Kalibrierung vergleicht jede Wertung (ja, teils, nein) der Bilanztabellen im Buch mit der
 * App, Seite für Seite (Konzept 13). Abweichungen stehen als Befund in docs/FORTSCHRITT.md und
 * hier in BEFUNDE; jede andere Abweichung lässt den Test scheitern. Seit 0.2.33 (C1.1) gehört
 * zur Zentrumsprüfung die Nachrechnung der Engine: Angegriffene Zentrumsbauern prüft Stockfish,
 * wie die Karte in der App (ZentrumKarte.tsx).
 */
import { afterAll, describe, expect, it } from "vitest";
import type { Color } from "chessops/types";
import { nodeEngine } from "../engine/nodeEngine.testhilfe";
import { pruefeZentrumsschlag } from "../engine/zentrumsschlag";
import { Angriffskarte } from "../schach/angriffskarte";
import { bilanzfaelle, stellungAus, stellungVon } from "../schach/buchabbildungen.testhilfe";
import { feldname, type Stellung } from "../schach/stellung";
import { zentrumMitEngine, zielbilanz, type Zielbilanz } from "../schach/zielbilanz";
import { zielbilanzWerkzeug } from "./k2-zielbilanz";
import type { Werkzeugergebnis } from "./werkzeug";

/** Bekannte Abweichungen vom Buch (Abbildung, Zeile, Seite), an den Autor gemeldet. */
const BEFUNDE = new Set([
  // Abb. 2.71: Schwarz ohne Zentrumsbauern beherrscht e4 und d5 (mindestens so oft wie Weiß);
  // nach Pflichtenheft 6.6 „ja“, das Buch wertet „teils“.
  "2.71 Zentrum Schwarz",
]);

/** Rechenzeit je Engine-Prüfung eines angegriffenen Zentrumsbauern (wie zentrumsschlag.test.ts). */
const RECHENZEIT_MS = 2_000;
const TESTFRIST_MS = 60_000;
const dienst = nodeEngine();
afterAll(() => dienst.beendeEngine());

/** Die Zielbilanz einer Seite mit der Zentrumswertung nach der Nachrechnung der Engine. */
async function mitEngine(stellung: Stellung, farbe: Color): Promise<Zielbilanz> {
  const bilanz = zielbilanz(
    stellung.brett,
    new Angriffskarte(stellung.brett),
    farbe,
    stellung.amZug,
  );
  const haengen = [];
  for (const feld of bilanz.zentrum.angegriffen) {
    const p = await pruefeZentrumsschlag(dienst, stellung.fen, feldname(feld), RECHENZEIT_MS);
    if (p?.haengt) haengen.push(feld);
  }
  const wertung = zentrumMitEngine(bilanz.zentrum, haengen);
  return { ...bilanz, zentrum: { ...bilanz.zentrum, wertung } };
}

const PRUEFUNG: Record<string, keyof Omit<Zielbilanz, "farbe">> = {
  Zentrum: "zentrum",
  Entwicklung: "entwicklung",
  Königssicherheit: "koenig",
};

function ergebnis(nummer: string): Werkzeugergebnis {
  const stellung = stellungVon(nummer);
  return zielbilanzWerkzeug(stellung, stellung.amZug);
}

function zeilen(auswertung: Werkzeugergebnis, kennung: string): readonly string[] {
  return auswertung.befunde.find((befund) => befund.kennung === kennung)?.zeilen ?? [];
}

describe("k2-zielbilanz: Kalibrierung an allen Zielbilanzen des Buches", () => {
  const faelle = bilanzfaelle("ziel");

  it("findet alle Bilanztabellen (17 Tabellen in Kapitel 2, davon zwei in Abb. 2.76)", () => {
    expect(faelle.length).toBe(17);
  });

  it.each(faelle.map((fall) => [fall.abbildung, fall] as const))(
    "Abb. %s: Wertungen wie im Buch",
    async (_nummer, fall) => {
      const stellung = stellungVon(fall.abbildung);
      const weiss = await mitEngine(stellung, "white");
      const schwarz = await mitEngine(stellung, "black");
      for (const zeile of fall.tabelle.zeilen) {
        const pruefung = PRUEFUNG[zeile.name];
        if (!pruefung) throw new Error(`Unbekannte Zeile ${zeile.name}`);
        const seiten = [
          ["Weiß", weiss[pruefung].wertung, zeile.links.wertung],
          ["Schwarz", schwarz[pruefung].wertung, zeile.rechts.wertung],
        ] as const;
        for (const [seite, app, buch] of seiten) {
          if (BEFUNDE.has(`${fall.abbildung} ${zeile.name} ${seite}`)) continue;
          expect(app, `${fall.abbildung} ${zeile.name} ${seite}`).toBe(buch);
        }
      }
    },
    TESTFRIST_MS,
  );
});

describe("k2-zielbilanz an Buchabbildungen", () => {
  it("Abb. 2.11: Beide Seiten haben alle drei Ziele erreicht", () => {
    const auswertung = ergebnis("2.11");
    expect(auswertung.fazit).toBe("Beide Seiten haben alle drei Ziele erreicht.");
    expect(zeilen(auswertung, "white")).toEqual([
      "Zentrum: ja – Bauer im Zentrum: d4 und e4",
      "Entwicklung: ja – Alle vier Leichtfiguren haben ihr Startfeld verlassen oder sind getauscht",
      "Königssicherheit: ja – Rochiert, der Bauernschild steht (f2, g2 und h3)",
    ]);
  });

  it("Abb. 2.71 (Angenommenes Damengambit): Springer b1 und Läufer c1 fehlen, rot markiert", () => {
    const auswertung = ergebnis("2.71");
    expect(zeilen(auswertung, "white")[1]).toBe(
      "Entwicklung: teils – Noch auf dem Startfeld: Springer b1 und Läufer c1",
    );
    expect(zeilen(auswertung, "black")[2]).toBe(
      "Königssicherheit: nein – Der König steht auf e8, noch nicht rochiert",
    );
    // Markiert wird nur die Seite der Sicht (0.2.28).
    const stellung = stellungVon("2.71");
    const weiss = zielbilanzWerkzeug(stellung, "white").markierungen;
    const schwarz = zielbilanzWerkzeug(stellung, "black").markierungen;
    expect(weiss).toContainEqual({ typ: "feld", farbe: "rot", feld: "b1" });
    expect(weiss).not.toContainEqual({ typ: "feld", farbe: "rot", feld: "e8" });
    expect(schwarz).toContainEqual({ typ: "feld", farbe: "rot", feld: "e8" });
    expect(schwarz).not.toContainEqual({ typ: "feld", farbe: "rot", feld: "b1" });
    // Ausführlicher seit 0.2.29: entwickelte Figuren, Zentrumsbauer, König und Schild gold.
    for (const feld of ["f3", "c4", "d4", "g1", "f2", "g2", "h2"])
      expect(weiss).toContainEqual({ typ: "feld", farbe: "gold", feld });
    expect(weiss).toContainEqual({ typ: "feld", farbe: "grau", feld: "e5" });
    // Schwarz 1 von 3: das Zentrum (Befund 2.71, im Buch „teils“).
    expect(auswertung.fazit).toBe("Erreichte Ziele: Weiß 2 von 3, Schwarz 1 von 3.");
  });

  it("Abb. 2.30 (Greco): d5 ist angegriffen; dass er hängt (teils), sagt erst die Engine", () => {
    const schwarz = zeilen(ergebnis("2.30"), "black");
    expect(schwarz[0]).toBe("Zentrum: ja – Bauer im Zentrum: d5; d5 ist angegriffen");
    // Der weiße Bauer d4 ist ebenso angegriffen, aber Weiß ist am Zug.
    expect(zeilen(ergebnis("2.30"), "white")[0]).toBe("Zentrum: ja – Bauer im Zentrum: d4");
  });

  // C1.1 und C1.2 (Entscheidung des Autors, 16.10.2026): Die Zählung auf dem Feld allein lädt
  // nicht mehr zu einem Schlag ein, vor dem das Buch warnt; angegriffene Bauern sind grau.
  it.each([
    ["2.40", "white", "Zentrum: ja – Bauer im Zentrum: e4; e4 ist angegriffen", "e4"],
    ["2.113", "black", "Zentrum: ja – Bauer im Zentrum: e5; e5 ist angegriffen", "e5"],
    ["2.24", "white", "Zentrum: ja – Bauer im Zentrum: d4 und e4; e4 ist angegriffen", "e4"],
  ] as const)("Abb. %s, %s: %s (grau, nicht rot)", (nummer, farbe, zeile, feld) => {
    expect(zeilen(ergebnis(nummer), farbe)[0]).toBe(zeile);
    const markierungen = zielbilanzWerkzeug(stellungVon(nummer), farbe).markierungen;
    expect(markierungen).toContainEqual({ typ: "feld", farbe: "grau", feld });
    expect(markierungen).not.toContainEqual({ typ: "feld", farbe: "rot", feld });
  });

  it(
    "Abb. 2.40, 2.113, 2.24 mit der Engine: Das Zentrum bleibt ja wie im Buch",
    async () => {
      expect((await mitEngine(stellungVon("2.40"), "white")).zentrum.wertung).toBe("ja");
      expect((await mitEngine(stellungVon("2.113"), "black")).zentrum.wertung).toBe("ja");
      expect((await mitEngine(stellungVon("2.24"), "white")).zentrum.wertung).toBe("ja");
    },
    TESTFRIST_MS * 2,
  );

  it("C2.20, Abb. 12.2: Der König h7 hatte rochiert, Schild beschädigt (teils)", () => {
    expect(zeilen(ergebnis("12.2"), "black")[2]).toBe(
      "Königssicherheit: teils – Rochiert, aber der König steht auf h7 vor der Grundreihe (gezogen oder gejagt): Schild beschädigt",
    );
    // Künstliche Rochade (Abb. 3.53, König g2): ebenfalls teils statt „nicht rochiert“.
    expect(zeilen(zielbilanzWerkzeug(stellungVon("3.53"), "white"), "white")[2]).toMatch(
      /^Königssicherheit: teils – Rochiert, aber der König steht auf g2/,
    );
  });

  it("Abb. 2.38: ohne Zentrumsbauern zählt die Kontrolle durch Figuren (Einschätzung)", () => {
    const auswertung = ergebnis("2.38");
    expect(zeilen(auswertung, "white")[0]).toMatch(/^Zentrum: ja – Kein Zentrumsbauer, aber/);
    expect(auswertung.befunde.find((b) => b.kennung === "white")?.art).toBe("N");
  });

  it("Lehrbild ohne König: Königsprüfung nein, keine Fehler", () => {
    const auswertung = zielbilanzWerkzeug(stellungAus("8/8/8/3N4/8/8/8/8 w - - 0 1"), "white");
    expect(zeilen(auswertung, "white")[2]).toBe(
      "Königssicherheit: nein – Kein König auf dem Brett",
    );
  });
});

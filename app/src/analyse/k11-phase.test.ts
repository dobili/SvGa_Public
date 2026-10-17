/**
 * Referenztests für k11-phase: die Phasen an Kapitel 8 (Abb. 8.1 bis 8.3), Kapitel 12 (Abb. 12.1
 * bis 12.6) und Kapitel 1 (Abb. 1.26), die Phasen der Beispielpartien aus Kapitel 11 laut ihren
 * Steckbriefen (C1.27) und die Tabellenzeile einer Beispielpartie.
 */
import { describe, expect, it } from "vitest";
import { stellungVon } from "../schach/buchabbildungen.testhilfe";
import { stellungAusFen } from "../schach/stellung";
import { k11Phase, werkzeugJePhase } from "./k11-phase";

function phase(nummer: string, abschnitt?: string) {
  const s = stellungVon(nummer);
  const e = werkzeugJePhase(s, abschnitt);
  return {
    erste: e.befunde[0]?.zeilen[0] ?? "",
    zeilen: e.befunde[0]?.zeilen ?? [],
    werkzeuge: e.befunde[1]?.zeilen ?? [],
    partie: e.befunde[2],
    fazit: e.fazit,
    markierungen: e.markierungen,
  };
}

describe("k11-phase", () => {
  it("Abb. 8.1 (Damen getauscht, zwei Türme und Leichtfigur): Endspiel, vier von vier Fragen Ja", () => {
    const p = phase("8.1");
    expect(p.erste).toBe("Endspiel: Die vier Prüffragen ergeben überwiegend Ja.");
    expect(p.zeilen[4]).toBe(
      "Endspielfragen: Damen vom Brett ja; Könige vor Mattangriff sicher ja; König am Zug kann ins Zentrum ja; Bauern entscheiden ja (4 von 4).",
    );
    expect(p.werkzeuge[0]).toMatch(/^Die sechs Endspielregeln \(Kapitel 8\)/);
    expect(p.markierungen[0]).toEqual({ typ: "pfeil", farbe: "gold", von: "g1", nach: "f1" });
  });

  it("Abb. 8.2 (Damen am Brett): Mittelspiel, Abb. 8.3 nach dem Tausch: Endspiel", () => {
    expect(phase("8.2").erste).toMatch(/^Mittelspiel/);
    expect(phase("8.2").zeilen[4]).toMatch(/Damen vom Brett nein/);
    expect(phase("8.3").erste).toMatch(/^Endspiel/);
  });

  it("Abb. 12.1 (beide rochiert, Leichtfiguren entwickelt, Damen am Brett): „Das ist Mittelspiel“", () => {
    const p = phase("12.1");
    expect(p.erste).toMatch(/^Mittelspiel/);
    expect(p.zeilen.slice(1, 4)).toEqual([
      "Leichtfiguren auf dem Startfeld: Weiß 0, Schwarz 1.",
      "Eröffnungsziele Weiß: Zentrum ja, Entwicklung ja, Königssicherheit ja.",
      "Eröffnungsziele Schwarz: Zentrum ja, Entwicklung teils, Königssicherheit ja.",
    ]);
    expect(p.werkzeuge).toEqual([
      "Skelett-Röntgen (Kapitel 5): Vorher, Felder, Bauern, Richtung, Figuren",
      "Die drei Planfragen (Kapitel 6): Bündel „Planfindung“ mit Wo?, Gegner?, LAP, Planbilanz",
      "Mit Mehrmaterial ins Endspiel tauschen (Kapitel 8, Regel 4)",
      "In jeder Phase: Warnsignale und Schach-Röntgen-Regel, beide als Symbol am Brett.",
    ]);
    expect(p.fazit).toBe("Mittelspiel: Skelett-Röntgen und Planfragen.");
  });

  it("Abb. 1.26: Eröffnung, Entwicklung und Rochade stehen aus", () => {
    const p = phase("1.26");
    expect(p.erste).toBe(
      "Eröffnung: Mindestens eine Seite hat noch zwei oder mehr Leichtfiguren auf dem Startfeld.",
    );
    expect(p.werkzeuge[0]).toMatch(/^Dein Repertoire \(Kapitel 2\)/);
  });

  // C1.27 (Entscheidung des Autors, 16.10.2026): Die Phase gilt für beide Seiten gleich; ein König
  // in der Mitte hält die Stellung nach der Entwicklung nicht mehr in der „Eröffnung“.
  it.each(["11.28", "11.29", "11.30", "11.31", "11.41", "11.82", "11.84"])(
    "Abb. %s (König nicht rochiert, Königsangriff): Mittelspiel, aus beiden Sichten",
    (nummer) => {
      const stellung = stellungVon(nummer);
      for (const perspektive of ["white", "black"] as const) {
        const e = k11Phase.berechne({ stellung, perspektive });
        expect(e?.fazit, `${nummer} ${perspektive}`).toBe(
          "Mittelspiel: Skelett-Röntgen und Planfragen.",
        );
      }
    },
  );

  it("Abb. 11.28: Der König e8 bleibt eine Frage der Königssicherheit", () => {
    const schwarz = phase("11.28").zeilen.find((z) => z.startsWith("Eröffnungsziele Schwarz"));
    expect(schwarz).toMatch(/Entwicklung ja, Königssicherheit nein\.$/);
  });

  it("Kapitel 12: 12.1 bis 12.3 und 12.5 Mittelspiel, 12.4 Eröffnung, 12.6 Endspiel", () => {
    for (const nummer of ["12.1", "12.2", "12.3", "12.5"])
      expect(phase(nummer).erste, nummer).toMatch(/^Mittelspiel/);
    expect(phase("12.4").erste).toMatch(/^Eröffnung/);
    expect(phase("12.6").erste).toMatch(/^Endspiel/);
  });

  // Die Steckbriefe der Beispielpartien nennen die Phase („Phase: Mittelspiel“ usw.).
  it.each([
    [
      "Colle (Mittelspiel)",
      ["11.10", "11.11", "11.12", "11.13", "11.14", "11.15", "11.99"],
      "Mittelspiel",
    ],
    ["Lasker (Mittelspiel)", ["11.16", "11.17", "11.18", "11.19", "11.20", "11.21"], "Mittelspiel"],
    ["Unzicker (Mittelspiel)", ["11.75", "11.78", "11.80", "11.82", "11.84"], "Mittelspiel"],
    ["Capablanca (Endspiel)", ["11.85", "11.87", "11.89", "11.101"], "Endspiel"],
    ["Botwinnik (Endspiel)", ["11.91", "11.93", "11.95", "11.97"], "Endspiel"],
    ["Opernpartie (Eröffnung bis Mattangriff)", ["11.1", "11.2", "11.3", "11.4"], "Eröffnung"],
    ["Anderssen (Eröffnung bis Mattangriff)", ["11.22", "11.23", "11.24"], "Eröffnung"],
  ] as const)("Steckbrief %s", (_partie, nummern, erwartet) => {
    for (const nummer of nummern)
      expect(phase(nummer).erste, nummer).toMatch(new RegExp(`^${erwartet}`));
  });

  // 0.2.41: Zusatzregeln außerhalb des Buches stehen mit Namen in der zweiten Zeile.
  it("Damenendspiel: Endspiel mit Zusatzregel Speelman als zweiter Zeile; Abb. 8.2 ohne Zusatz", () => {
    const stellung = stellungAusFen("3q2k1/5ppp/8/8/8/8/5PPP/3Q2K1 w - - 0 40");
    if (!stellung.ok) throw new Error(stellung.fehler);
    const zeilen = werkzeugJePhase(stellung.wert).befunde[0]?.zeilen ?? [];
    expect(zeilen[0]).toMatch(/^Endspiel/);
    expect(zeilen[1]).toBe(
      "Zusatzregel (nicht aus dem Buch): Jede Seite hat höchstens 13 Punkte an Steinen außer dem König (Bauer 1, Läufer und Springer 3, Turm 5, Dame 9). Solche Stellungen gelten allgemein als Endspiel (Speelman), auch mit Damen am Brett. Nach den vier Fragen des Buches wäre es Mittelspiel.",
    );
    expect(phase("8.2").zeilen[1]).toMatch(/^Leichtfiguren auf dem Startfeld/);
  });

  it("Beispielpartie (Abb. 11.2, Morphy): Thema, Werkzeug, die Lehre bleibt im Buch", () => {
    const p = phase("11.2", "sec:k11-morphy");
    expect(p.partie?.titel).toBe("Morphy – Herzog und Graf (1858)");
    expect(p.partie?.zeilen).toEqual([
      "Thema: Entwicklung und offene Linien",
      "Werkzeug: Schach-Röntgen-Regel (Kapitel 1), Motive (Kapitel 7)",
      "Was du aus der Partie mitnimmst, steht im Buch am Ende des Abschnitts.",
    ]);
    expect(phase("11.2", "sec:k11-weg").partie).toBeUndefined();
  });
});

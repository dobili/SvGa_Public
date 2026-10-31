/**
 * Tests der zurückgeholten Teile der Karte „Deine Wertung“ (31.10.2026): Zeile „Aus deinen Zügen“
 * unter den Kacheln, Kurve je Phase, Hinweis ohne genug Partien und der Ausschnitt als Bereich
 * (Server-Renderer, ohne Gerätespeicher: Maßstab Lichess).
 */
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import type { Partieeintrag } from "../../../speicher/partien";
import {
  leserzug,
  neuePartie,
  ziehe,
  type Partie,
  type Partieeinstellung,
} from "../../../spiel/partie";
import { mitGewerteterPartie, type Wertungspunkt } from "../../../spiel/wertung";
import { ausschnittsbereich } from "./ausschnitte";
import { Phasenkurve } from "./Phasenkurve";
import { Wertungskarte } from "./Wertungskarte";

const GRUNDSTELLUNG = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
/** Spanisch, Breyer-Variante bis 20. Lg5 (wie spiel/wertung.test.ts). */
const BREYER =
  "e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Be7 Re1 b5 Bb3 d6 c3 O-O h3 Nb8 d4 Nbd7 Nbd2 Bb7 Bc2 Re8 Nf1 Bf8 Ng3 g6 a4 c5 d5 c4 Bg5 h6 Be3 Nc5 Qd2 h5 Bg5".split(
    " ",
  );
const EINSTELLUNG: Partieeinstellung = {
  startFen: GRUNDSTELLUNG,
  eigeneFarbe: "white",
  stufe: 3,
  stufenJePhase: { eroeffnung: 3, mittelspiel: 3, endspiel: 3 },
  uhr: null,
  ruecknahmeErlaubt: true,
  abbildung: null,
  eroeffnung: null,
  gegner: "engine",
  bot: null,
  stilname: "universell",
  hilfen: { symbole: true, werkzeuge: true },
  gewertet: true,
};
const JETZT = new Date("2026-10-31T10:00:00.000Z");

/** Eine beendete, ausgewertete Partie ohne Fehler (alle Werte 0). */
function eintrag(id: string): Partieeintrag {
  const neu = neuePartie(EINSTELLUNG, id, "2026-10-30T08:00:00.000Z");
  const gespielt = BREYER.reduce<Partie | null>((p, z) => (p ? ziehe(p, leserzug(z)) : null), neu);
  if (!gespielt) throw new Error("Zug geht nicht");
  const partie = { ...gespielt, ende: { art: "aufgabe" as const, sieger: "white" as const } };
  const werte = partie.zuege.map(() => 0).concat([0]);
  return { partie, werte, beste: werte.map(() => ""), abstaende: [], varianten: [] };
}

/** N ausgewertete Schnellschach-Partien mit Verlauf (neueste Partie zuerst wie im Speicher). */
function gespielt(anzahl: number): { partien: Partieeintrag[]; punkte: readonly Wertungspunkt[] } {
  const partien: Partieeintrag[] = [];
  let punkte: readonly Wertungspunkt[] = [];
  for (let i = 1; i <= anzahl; i += 1) {
    const e = eintrag(String(i));
    partien.unshift(e);
    punkte = mitGewerteterPartie(punkte, e);
  }
  return { partien, punkte };
}

describe("Wertung: zurückgeholt", () => {
  it("zeigt unter den Kacheln die Schätzung aus den Zügen", () => {
    const { partien, punkte } = gespielt(3);
    const html = renderToStaticMarkup(
      <Wertungskarte punkte={punkte} partien={partien} jetzt={JETZT} />,
    );
    expect(html).toMatch(
      /data-testid="wertung-zuege">Aus deinen Zügen: etwa \d+ \(\d+–\d+, aus 3 Partien\)\./,
    );
    expect(html).toContain('data-testid="wertung-phase-mittelspiel"');
  });

  it("zeichnet die Kurve einer Phase nach genug Partien, vorher ein Hinweis", () => {
    const viele = gespielt(12);
    const bereich = ausschnittsbereich("p25");
    const kurve = renderToStaticMarkup(
      <Phasenkurve
        kette={viele.punkte}
        partien={viele.partien}
        tempo="rapid"
        phase="mittelspiel"
        massstab="lichess"
        bereich={bereich}
        jetzt={JETZT}
      />,
    );
    expect(kurve).toContain('data-testid="wertungskurve"');
    expect(kurve).toMatch(/Spanne \d+–\d+/);
    const wenige = gespielt(1);
    const leer = renderToStaticMarkup(
      <Phasenkurve
        kette={wenige.punkte}
        partien={wenige.partien}
        tempo="rapid"
        phase="endspiel"
        massstab="lichess"
        bereich={bereich}
        jetzt={JETZT}
      />,
    );
    expect(leer).toContain("Endspiel: Für eine Kurve gibt es in dieser Zeitklasse noch zu wenige");
  });

  it("liefert zu jedem Ausschnitt den Bereich, unbekannt den ersten", () => {
    expect(ausschnittsbereich("w1")).toEqual({ art: "zeit", tage: 7 });
    expect(ausschnittsbereich("unbekannt")).toEqual({ art: "partien", anzahl: 10 });
  });
});

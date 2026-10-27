/**
 * Tests des Maßstabs der eigenen Wertung (Wunsch des Autors, 26.10.2026): Zahl, Spanne und Änderung
 * im Maßstab von Lichess oder umgerechnet als Bereich auf chess.com (seit 0.3.2 alle Zeitklassen),
 * Grenzen der Tabellen, der Satz in der Auswertung und die Karte „Deine Wertung“ (Server-Renderer,
 * ohne Gerätespeicher: Lichess).
 */
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import type { Wertungsschaetzung } from "../../../spiel/elomodell";
import { bereichEtwa, entsprichtEtwa, vergleichsbereich } from "../../../spiel/umrechnung";
import type { Wertungspunkt } from "../../../spiel/wertung";
import { Massstabtext, Massstabwahl } from "./Massstabwahl";
import { Wertungskurve } from "./Wertungskurve";
import {
  aenderungImMassstab,
  ausserhalbText,
  liesMassstab,
  spanneImMassstab,
  zahlImMassstab,
} from "./wertungsmassstab";
import { entsprichtText } from "./wertungstext";

describe("Maßstab der eigenen Wertung", () => {
  it("lässt im Maßstab von Lichess die Zahl unverändert", () => {
    expect(zahlImMassstab("rapid", 1680, "lichess")).toEqual({
      zahl: "1680",
      liste: null,
      ausserhalb: false,
      bereich: false,
    });
    expect(spanneImMassstab("rapid", 1600, 1760, "lichess")).toEqual({ von: "1600", bis: "1760" });
    expect(aenderungImMassstab("blitz", 1500, 1524, "lichess")).toBe(24);
  });

  it("rechnet alle drei Zeitklassen als Bereich auf chess.com um", () => {
    const rapid = bereichEtwa("rapid", 1680);
    expect(zahlImMassstab("rapid", 1680, "umgerechnet")).toEqual({
      zahl: `${rapid?.von}–${rapid?.bis}`,
      liste: "chess.com",
      ausserhalb: false,
      bereich: true,
    });
    for (const tempo of ["blitz", "classical"] as const) {
      const zahl = zahlImMassstab(tempo, 2000, "umgerechnet");
      expect(zahl.liste).toBe("chess.com");
      expect(zahl.zahl).toMatch(/^\d{3,4}–\d{4}$/);
    }
  });

  it("zeigt außerhalb der Tabelle „–“ und nennt die Grenze", () => {
    expect(zahlImMassstab("classical", 1200, "umgerechnet")).toEqual({
      zahl: "–",
      liste: "chess.com",
      ausserhalb: true,
      bereich: false,
    });
    expect(vergleichsbereich("classical")?.von).toBe(1300);
    expect(ausserhalbText("classical", 1200, "umgerechnet")).toBe(
      "chess.com erst ab etwa 1300 (Lichess Klassisch)",
    );
    expect(ausserhalbText("blitz", 3200, "umgerechnet")).toMatch(
      /^chess\.com nur bis etwa \d{4} \(Lichess Blitz\)$/,
    );
  });

  it("rechnet Spanne als Hülle und Änderung über die Mitte, nur innerhalb der Tabelle", () => {
    const spanne = spanneImMassstab("rapid", 1600, 1760, "umgerechnet");
    expect(spanne?.von).toBe(String(bereichEtwa("rapid", 1600)?.von));
    expect(spanne?.bis).toBe(String(bereichEtwa("rapid", 1760)?.bis));
    expect(spanneImMassstab("classical", 1200, 1900, "umgerechnet")).toBeNull();
    const vorher = entsprichtEtwa("blitz", 1500) ?? 0;
    const nachher = entsprichtEtwa("blitz", 1560) ?? 0;
    expect(aenderungImMassstab("blitz", 1500, 1560, "umgerechnet")).toBe(nachher - vorher);
    expect(aenderungImMassstab("classical", 1200, 1800, "umgerechnet")).toBeNull();
  });

  it("nennt in der Auswertung die Bereiche auf chess.com und FIDE", () => {
    const schaetzung = (tempo: Wertungsschaetzung["tempo"], mitte: number): Wertungsschaetzung => ({
      tempo,
      mitte,
      von: mitte - 200,
      bis: mitte + 200,
      partien: 1,
    });
    const rapid = bereichEtwa("rapid", 1680);
    const fide = bereichEtwa("rapid", 1680, "fide");
    expect(entsprichtText(schaetzung("rapid", 1680))).toBe(
      `Deine Zahl gilt für Schnellschach und richtet sich nach Lichess; Spieler mit dieser Zahl stehen auf chess.com Schnellschach etwa bei ${rapid?.von} bis ${rapid?.bis}. Beim Weltschachbund (FIDE) etwa ${fide?.von} bis ${fide?.bis}.`,
    );
    const klassisch = entsprichtText(schaetzung("classical", 2120));
    expect(klassisch).toContain("auf chess.com Schnellschach etwa bei");
    expect(klassisch).toContain("wertet alle Partien ab zehn Minuten als Schnellschach");
    expect(klassisch).toMatch(/Beim Weltschachbund \(FIDE\) etwa \d{4} bis \d{4}\.$/);
    // Unter 1300 Lichess Klassisch kein Vergleichswert (Messung vom 27.10.2026).
    expect(entsprichtText(schaetzung("classical", 1200))).toContain("keinen Vergleichswert");
  });

  it("lässt einen Bereich nach dem Strich umbrechen", () => {
    const html = renderToStaticMarkup(
      <Massstabtext zahl={zahlImMassstab("blitz", 1550, "umgerechnet")} />,
    );
    expect(html).toMatch(/^\d{3,4}–<wbr\/>\d{4}$/);
  });

  it("nimmt ohne Gerätespeicher den Maßstab von Lichess", () => {
    expect(liesMassstab()).toBe("lichess");
  });

  it("zeigt in der Karte „Deine Wertung“ den Umschalter, ohne Merker im Maßstab von Lichess", () => {
    const punkt: Wertungspunkt = {
      partieId: "p1",
      zeit: "2026-10-20T10:00:00.000Z",
      gegner: 1500,
      ergebnis: 1,
      wertung: 1424,
      phasen: { eroeffnung: null, mittelspiel: null, endspiel: null },
      tempo: "rapid",
    };
    const html = renderToStaticMarkup(
      <Wertungskurve punkte={[punkt]} partien={[]} jetzt={new Date("2026-10-26T10:00:00Z")} />,
    );
    expect(html).toContain('data-testid="massstabwahl"');
    expect(html).toMatch(/data-testid="wertung-zahl">1424/);
    expect(html).not.toContain("wertungskurve-massstab");
  });

  it("zeigt den Umschalter mit beiden Maßstäben, der gewählte ist markiert", () => {
    const html = renderToStaticMarkup(<Massstabwahl massstab="umgerechnet" beiWahl={() => {}} />);
    expect(html).toContain('aria-label="Maßstab der Wertung"');
    expect(html).toMatch(/aria-checked="false"[^>]*>Lichess</);
    expect(html).toMatch(/aria-checked="true"[^>]*>chess\.com</);
  });
});

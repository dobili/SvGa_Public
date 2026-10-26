/**
 * Tests des Maßstabs der eigenen Wertung (Wunsch des Autors, 26.10.2026): Zahl, Spanne und Änderung
 * im Maßstab von Lichess oder umgerechnet (chess.com, FIDE), Grenzen der Tabellen und die Karte
 * „Deine Spielstärke“ mit gemerktem Maßstab (Server-Renderer, ohne Gerätespeicher: Lichess).
 */
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { entsprichtEtwa, vergleichsbereich } from "../../../spiel/umrechnung";
import type { Wertungspunkt } from "../../../spiel/wertung";
import { Massstabwahl } from "./Massstabwahl";
import { Wertungskurve } from "./Wertungskurve";
import {
  aenderungImMassstab,
  ausserhalbText,
  liesMassstab,
  spanneImMassstab,
  zahlImMassstab,
} from "./wertungsmassstab";

describe("Maßstab der eigenen Wertung", () => {
  it("lässt im Maßstab von Lichess die Zahl unverändert", () => {
    expect(zahlImMassstab("rapid", 1680, "lichess")).toEqual({
      zahl: "1680",
      liste: null,
      ausserhalb: false,
    });
    expect(spanneImMassstab("rapid", 1600, 1760, "lichess")).toEqual({ von: "1600", bis: "1760" });
    expect(aenderungImMassstab("blitz", 1500, 1524, "lichess")).toBe(24);
  });

  it("rechnet Schnellschach auf chess.com und Klassisch auf FIDE um, mit „≈“", () => {
    const rapid = zahlImMassstab("rapid", 1680, "umgerechnet");
    expect(rapid).toEqual({
      zahl: `≈ ${entsprichtEtwa("rapid", 1680)}`,
      liste: "chess.com",
      ausserhalb: false,
    });
    const fide = zahlImMassstab("classical", 2120, "umgerechnet");
    expect(fide.liste).toBe("FIDE");
    expect(fide.zahl).toMatch(/^≈ 19[3-9]0$/);
    expect(zahlImMassstab("blitz", 1500, "umgerechnet").liste).toBe("chess.com");
  });

  it("zeigt außerhalb der Tabelle „–“ und nennt die Grenze", () => {
    expect(zahlImMassstab("classical", 1500, "umgerechnet")).toEqual({
      zahl: "–",
      liste: "FIDE",
      ausserhalb: true,
    });
    expect(vergleichsbereich("classical")?.von).toBe(1730);
    expect(ausserhalbText("classical", 1500)).toBe("FIDE erst ab etwa 1730 (Lichess Klassisch)");
    expect(ausserhalbText("blitz", 3200)).toMatch(
      /^chess\.com nur bis etwa \d{4} \(Lichess Blitz\)$/,
    );
  });

  it("rechnet Spanne und Änderung nur, wenn beide Enden in der Tabelle liegen", () => {
    const spanne = spanneImMassstab("rapid", 1600, 1760, "umgerechnet");
    expect(spanne?.von).toBe(`≈ ${entsprichtEtwa("rapid", 1600)}`);
    expect(spanne?.bis).toBe(String(entsprichtEtwa("rapid", 1760)));
    expect(spanneImMassstab("classical", 1600, 1900, "umgerechnet")).toBeNull();
    const vorher = entsprichtEtwa("blitz", 1500) ?? 0;
    const nachher = entsprichtEtwa("blitz", 1560) ?? 0;
    expect(aenderungImMassstab("blitz", 1500, 1560, "umgerechnet")).toBe(nachher - vorher);
    expect(aenderungImMassstab("classical", 1500, 1800, "umgerechnet")).toBeNull();
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
    expect(html).toMatch(/aria-checked="true"[^>]*>chess\.com · FIDE</);
  });
});

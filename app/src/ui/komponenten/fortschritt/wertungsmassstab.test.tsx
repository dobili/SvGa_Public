/**
 * Tests des Maßstabs der eigenen Wertung (Wunsch des Autors, 26.10.2026): Zahl, Spanne und Änderung
 * im Maßstab von Lichess oder umgerechnet auf chess.com oder FIDE als Bereich, Grenzen der Tabellen und die Karte
 * „Deine Spielstärke“ mit gemerktem Maßstab (Server-Renderer, ohne Gerätespeicher: Lichess).
 */
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { entsprichtEtwa, umgerechnet, vergleichsbereich } from "../../../spiel/umrechnung";
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

  it("rechnet jede Zeitklasse auf chess.com und FIDE um, als Bereich mit dem Namen der Liste", () => {
    const rapid = zahlImMassstab("rapid", 1680, "chesscom");
    const u = umgerechnet("rapid", 1680, "chesscom");
    expect(rapid).toEqual({
      zahl: `${u?.von}–${u?.bis}`,
      liste: "chess.com Schnellschach",
      ausserhalb: false,
    });
    expect(zahlImMassstab("blitz", 1500, "chesscom").liste).toBe("chess.com Blitz");
    // Klassisch auf chess.com: Vergleich mit Schnellschach, chess.com hat keine klassische Wertung.
    expect(zahlImMassstab("classical", 2120, "chesscom").liste).toBe("chess.com Schnellschach");
    expect(zahlImMassstab("classical", 2120, "chesscom").zahl).toMatch(/^\d{4}–\d{4}$/);
    const fide = zahlImMassstab("classical", 2120, "fide");
    expect(fide.liste).toBe("FIDE");
    expect(fide.zahl).toMatch(/^1[89]\d0–2\d{3}$/);
    expect(zahlImMassstab("rapid", 1680, "fide").ausserhalb).toBe(false);
  });

  it("zeigt außerhalb der Tabelle „–“ und nennt die Grenze", () => {
    expect(zahlImMassstab("classical", 1500, "fide")).toEqual({
      zahl: "–",
      liste: "FIDE",
      ausserhalb: true,
    });
    expect(vergleichsbereich("classical", "fide")?.von).toBe(1730);
    expect(ausserhalbText("classical", 1500, "fide")).toBe(
      "FIDE erst ab etwa 1730 (Lichess Klassisch)",
    );
    expect(ausserhalbText("blitz", 3200, "chesscom")).toMatch(
      /^chess\.com Blitz nur bis etwa \d{4} \(Lichess Blitz\)$/,
    );
  });

  it("rechnet Spanne und Änderung mit den Mitten, nur wenn beide Enden in der Tabelle liegen", () => {
    const spanne = spanneImMassstab("rapid", 1600, 1760, "chesscom");
    expect(spanne?.von).toBe(String(entsprichtEtwa("rapid", 1600)));
    expect(spanne?.bis).toBe(String(entsprichtEtwa("rapid", 1760)));
    expect(spanneImMassstab("classical", 1600, 1900, "fide")).toBeNull();
    const vorher = entsprichtEtwa("blitz", 1500) ?? 0;
    const nachher = entsprichtEtwa("blitz", 1560) ?? 0;
    expect(aenderungImMassstab("blitz", 1500, 1560, "chesscom")).toBe(nachher - vorher);
    expect(aenderungImMassstab("classical", 1500, 1800, "fide")).toBeNull();
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

  it("zeigt den Umschalter mit drei Maßstäben, der gewählte ist markiert", () => {
    const html = renderToStaticMarkup(<Massstabwahl massstab="fide" beiWahl={() => {}} />);
    expect(html).toContain('aria-label="Maßstab der Wertung"');
    expect(html).toMatch(/aria-checked="false"[^>]*>Lichess</);
    expect(html).toMatch(/aria-checked="false"[^>]*>chess\.com</);
    expect(html).toMatch(/aria-checked="true"[^>]*>FIDE</);
  });
});

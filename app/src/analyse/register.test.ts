/**
 * Tests für das Verzeichnis der Werkzeuge: Erklärung und Legende der Markierungen für jedes
 * Werkzeug (Legende in der Karte seit 0.2.30, Wunsch des Autors).
 */
import { describe, expect, it } from "vitest";
import { t } from "../i18n/sprache";
import { erklaerungVon, legendeVon, werkzeugeFuer } from "./register";

/** Die Eröffnung setzt keine Markierungen am Brett; alle anderen brauchen eine Legende. */
const OHNE_MARKIERUNGEN: ReadonlySet<string> = new Set(["k2-eroeffnung"]);
/** Letztes Kapitel des Buches: bis dahin sind alle Werkzeuge freigeschaltet. */
const LETZTES_KAPITEL = 12;

describe("Verzeichnis der Werkzeuge", () => {
  const alle = werkzeugeFuer(LETZTES_KAPITEL).map((w) => w.id);

  it.each(alle)("%s hat eine Erklärung", (id) => {
    const schluessel = erklaerungVon(id);
    expect(schluessel).not.toBeNull();
    if (schluessel) expect(t(schluessel).length).toBeGreaterThan(0);
  });

  it.each(alle.filter((id) => !OHNE_MARKIERUNGEN.has(id)))(
    "%s hat eine Legende der Markierungen",
    (id) => {
      const schluessel = legendeVon(id);
      expect(schluessel).not.toBeNull();
      if (schluessel) expect(t(schluessel)).toMatch(/gold|rot|grau|Gold|Rot|Grau/);
    },
  );

  it("unbekannte Werkzeuge haben weder Erklärung noch Legende", () => {
    expect(erklaerungVon("k99-gibtsnicht")).toBeNull();
    expect(legendeVon("k99-gibtsnicht")).toBeNull();
  });
});

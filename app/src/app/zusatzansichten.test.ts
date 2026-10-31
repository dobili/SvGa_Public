/**
 * Tests der Erweiterungsstellen (Gamifizierung G4/G5): Startkarten nach Rang und höchstens zwei,
 * Zusatzansichten, Sprünge und die gesicherte Ansicht „zusatz“.
 */
import { describe, expect, it } from "vitest";
import { leereDaten } from "../speicher/format";
import { sichtbareKarten } from "../ui/komponenten/start/startkarten";
import { STAPEL_FORMAT, stapelAusMerker } from "./stapelMerker";
import { zusatzsprung } from "./spruenge";
import { zusatzansicht } from "./zusatzansichten";

const JETZT = new Date(2026, 9, 31, 10);
const Leer = () => null;

describe("Erweiterungsstellen der Gamifizierung", () => {
  it("zeigt höchstens zwei sichtbare Startkarten nach Rang", () => {
    const karten = [
      { kennung: "rivale", rang: 30, sichtbar: () => true, Karte: Leer },
      { kennung: "woche", rang: 20, sichtbar: () => true, Karte: Leer },
      { kennung: "rueckblick", rang: 40, sichtbar: () => false, Karte: Leer },
      { kennung: "naechster", rang: 10, sichtbar: () => true, Karte: Leer },
    ];
    const gezeigt = sichtbareKarten(karten, leereDaten(JETZT), JETZT).map((k) => k.kennung);
    expect(gezeigt).toEqual(["naechster", "woche"]);
  });

  it("findet eingetragene Bildschirme und Sprünge, sonst nichts", () => {
    const liste = [{ kennung: "rekorde", Bildschirm: Leer }];
    expect(zusatzansicht("rekorde", liste)?.kennung).toBe("rekorde");
    expect(zusatzansicht("unbekannt", liste)).toBeUndefined();
    const spruenge = [
      {
        muster: /^#aufgabe-taktik-(\w+)$/,
        bereich: "training" as const,
        ansicht: (m: RegExpExecArray) => ({
          bildschirm: "zusatz" as const,
          kennung: "aufgabe",
          wert: m[1],
        }),
      },
    ];
    expect(zusatzsprung("#aufgabe-taktik-abc12", spruenge)).toEqual({
      ansicht: { bildschirm: "zusatz", kennung: "aufgabe", wert: "abc12" },
      bereich: "training",
    });
    expect(zusatzsprung("#sonstwas", spruenge)).toBeNull();
  });

  it("der gesicherte Stapel nimmt die Ansicht „zusatz“ mit und ohne Wert an", () => {
    const merker = JSON.stringify({
      format: STAPEL_FORMAT,
      zeit: JETZT.getTime(),
      stapel: {
        bereich: "ich",
        ansichten: [
          { bildschirm: "ich" },
          { bildschirm: "zusatz", kennung: "rueckblick", wert: "2026-10" },
        ],
      },
    });
    const stapel = stapelAusMerker(merker, JETZT);
    expect(stapel?.ansichten.at(-1)).toEqual({
      bildschirm: "zusatz",
      kennung: "rueckblick",
      wert: "2026-10",
    });
  });
});

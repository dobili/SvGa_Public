/**
 * Tests der Trainingsseiten der Website: Textteile, Blöcke, Rahmen und die eingecheckten Inhalte
 * aus inhalte/de/training/ (alle 13 Kapitel und der Werkzeugkasten lassen sich bauen).
 */
import { readdirSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { kapitelseite, uebersichtsseite, werkzeugkastenseite } from "./trainingsrahmen";
import {
  blockHtml,
  datumDeutsch,
  kapiteladresse,
  teilHtml,
  type Trainingsseite,
} from "./trainingsseiten";

const QUELLE = new URL("../../../inhalte/de/training/", import.meta.url);
const lies = (name: string) =>
  JSON.parse(readFileSync(new URL(name, QUELLE), "utf8")) as Trainingsseite;

describe("Textteile und Blöcke", () => {
  it("Abbildung öffnet die App, Zug hervorgehoben, Links nach außen in neuem Fenster", () => {
    expect(teilHtml({ art: "verweis", text: "Abb. 6.20", abbildung: "6.20" })).toBe(
      '<a class="abb-verweis" href="/app/#abb-6.20">Abb. 6.20</a>',
    );
    expect(teilHtml({ art: "zug", text: "8... Se7" })).toBe('<span class="zug">8... Se7</span>');
    expect(teilHtml({ art: "link", text: "lichess.org", ziel: "https://lichess.org" })).toContain(
      'target="_blank" rel="noopener noreferrer"',
    );
    expect(teilHtml({ art: "text", text: "Fett & <klar>", stil: "fett" })).toBe(
      "<strong>Fett &amp; &lt;klar&gt;</strong>",
    );
  });

  it("Tabelle mit Spaltennamen je Zelle und Unterschrift darunter", () => {
    const html = blockHtml({
      art: "tabelle",
      kopf: [[{ art: "text", text: "Wofür" }], [{ art: "text", text: "Weg" }]],
      zeilen: [[[{ art: "text", text: "Koordinaten" }], [{ art: "text", text: "Lernen" }]]],
      unterschrift: [{ art: "text", text: "Lichess-Funktionen." }],
    });
    expect(html).toContain('<td data-spalte="Weg">Lernen</td>');
    expect(html).toContain('<p class="tabellenunterschrift">Lichess-Funktionen.</p>');
  });

  it("Adressen und Datum", () => {
    expect(kapiteladresse(7)).toBe("/training/kap07/");
    expect(datumDeutsch("2026-10-16")).toBe("16.10.2026");
  });
});

describe("Seiten aus den eingecheckten Inhalten", () => {
  const kapitel = readdirSync(QUELLE)
    .filter((n) => /^kap\d{2}\.json$/.test(n))
    .sort()
    .map(lies);

  it("13 Kapitel mit fester Adresse, Übersicht verlinkt alle", () => {
    expect(kapitel.map((k) => k.kapitel)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
    const uebersicht = uebersichtsseite(kapitel);
    for (const k of kapitel) expect(uebersicht).toContain(`href="${k.adresse}"`);
  });

  it("Kapitel 6 mit Vor- und Rückweg; der Werkzeugkasten ohne Verweis auf sich selbst", () => {
    const html = kapitelseite(kapitel[6] as Trainingsseite, kapitel[5] ?? null, kapitel[7] ?? null);
    expect(html).toContain("Kapitel 6: Mittelspielstrategie");
    expect(html).toContain('href="/training/kap05/"');
    expect(html).toContain('href="/training/kap07/"');
    const werkzeugkasten = werkzeugkastenseite(lies("werkzeugkasten.json"));
    expect(werkzeugkasten).toContain("die Tabelle unten");
    expect(werkzeugkasten).not.toContain('href="/training/werkzeugkasten/"');
  });
});

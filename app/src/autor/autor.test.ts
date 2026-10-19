/**
 * Tests der Aufgabenseite: Zerlegen der Aufgabendatei (auch der echten aus docs/), Links im
 * Text, Abhakstand und Text für den Chat.
 */
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  abhakstandAus,
  LEERER_ABHAKSTAND,
  meldung,
  mitAbschnitt,
  mitHaken,
  mitNotiz,
} from "./abhakstand";
import { liesAufgabendatei } from "./aufgabendatei";
import { textteile } from "./verweise";

const BEISPIEL = `# Was noch zu tun ist

Stand: 18.10.2026, Version 0.2.73. Diese Datei …

---

## Teil 1: Testen

Abhaken, was klappt.

### Neu in 0.2.73 (Lizenzen)

- [ ] N306. **Lizenzen:** Einstellungen › Lizenzen. Neu der
      Eintrag „Aufgaben aus der Lichess-Puzzle-Datenbank“.
- [ ] N305. **30-Minuten-Plan:** Training › Kapitel 12 › „30-Minuten-Plan“ › Trainieren.

## Teil 2: Entscheiden

### F. Trainer

- [ ] F5. Abb. 6.20 und 11.34, dazu Abb. 0.12 bis 0.19.
`;

const NAMEN = [
  { kennung: "dreissigMinuten", name: "30-Minuten-Plan" },
  { kennung: "planbilanz", name: "Planbilanz-Übung" },
] as const;

describe("Aufgabendatei lesen", () => {
  it("findet Version, Abschnitte, Punkte und Folgezeilen", () => {
    const datei = liesAufgabendatei(BEISPIEL);
    expect(datei.version).toBe("0.2.73");
    expect(datei.abschnitte.map((a) => [a.ebene, a.titel])).toEqual([
      [2, "Teil 1: Testen"],
      [3, "Neu in 0.2.73 (Lizenzen)"],
      [2, "Teil 2: Entscheiden"],
      [3, "F. Trainer"],
    ]);
    expect(datei.abschnitte[0]?.absaetze).toEqual(["Abhaken, was klappt."]);
    const punkte = datei.abschnitte[1]?.punkte ?? [];
    expect(punkte.map((p) => p.id)).toEqual(["N306", "N305"]);
    expect(punkte[0]?.text).toBe(
      "**Lizenzen:** Einstellungen › Lizenzen. Neu der Eintrag „Aufgaben aus der Lichess-Puzzle-Datenbank“.",
    );
  });

  it("liest Kennungen mit zwei Buchstaben (NA1, LS2) wie N307", () => {
    const datei = liesAufgabendatei(
      "## Teil 2\n\n### NA. Nachtarbeit\n\n- [ ] NA1. **Voreinstellung:** aus.\n",
    );
    expect(datei.abschnitte[1]?.punkte.map((p) => p.id)).toEqual(["NA1"]);
  });

  it("liest die echte Aufgabendatei mit allen Punkten", () => {
    const text = readFileSync(new URL("../../../docs/AUFGABEN_AUTOR.md", import.meta.url), "utf8");
    const datei = liesAufgabendatei(text);
    const anzahl = text.split("\n").filter((z) => /^- \[[ xX]\] [A-Z]{1,2}\d+\. /.test(z)).length;
    expect(datei.version).toMatch(/^\d+\.\d+\.\d+$/);
    expect(datei.abschnitte.flatMap((a) => a.punkte)).toHaveLength(anzahl);
    expect(anzahl).toBeGreaterThan(0);
  });
});

describe("Links im Text", () => {
  it("verlinkt Abbildungsketten, Trainer und Bereiche, Fettdruck bleibt", () => {
    const teile = textteile(
      "**Lizenzen:** Einstellungen › Lizenzen, Training › „30-Minuten-Plan“, Abb. 6.20 und 11.34.",
      NAMEN,
    );
    const links = teile.filter((t) => t.ziel).map((t) => [t.text, t.ziel]);
    expect(links).toEqual([
      ["Lizenzen", { bildschirm: "lizenzen" }],
      ["Einstellungen", { bildschirm: "ich" }],
      ["Lizenzen", { bildschirm: "lizenzen" }],
      ["Training", { bildschirm: "training" }],
      ["„30-Minuten-Plan“", { bildschirm: "trainer", kennung: "dreissigMinuten" }],
      ["Abb. 6.20", { bildschirm: "abbildung", nummer: "6.20" }],
      ["11.34", { bildschirm: "abbildung", nummer: "11.34" }],
    ]);
    expect(teile[0]).toEqual({ text: "Lizenzen", fett: true, ziel: { bildschirm: "lizenzen" } });
    expect(teile.map((t) => t.text).join("")).toBe(
      "Lizenzen: Einstellungen › Lizenzen, Training › „30-Minuten-Plan“, Abb. 6.20 und 11.34.",
    );
  });

  it("verlinkt Versionsnummern und „Training“ ohne Weg nicht", () => {
    const teile = textteile("Seit 0.2.71 im Training; `Code` und <https://a.de>.", NAMEN);
    expect(teile.filter((t) => t.ziel)).toEqual([]);
    expect(teile.map((t) => t.text).join("")).toBe(
      "Seit 0.2.71 im Training; Code und https://a.de.",
    );
  });
});

describe("Abhakstand und Text für den Chat", () => {
  const datei = liesAufgabendatei(BEISPIEL);

  it("schreibt Haken und Notizen in der Reihenfolge der Datei", () => {
    let stand = mitHaken(LEERER_ABHAKSTAND, "F5", true);
    stand = mitHaken(stand, "N306", true);
    stand = mitNotiz(stand, "N305", "Uhr lief\nweiter");
    stand = mitNotiz(stand, "F5", "aber 4 Aufgaben");
    expect(meldung(datei, stand, "0.2.74").split("\n")).toEqual([
      "Aufgaben des Autors (App-Version 0.2.74, Aufgabendatei 0.2.73)",
      "N306 ok",
      "N305: Uhr lief weiter",
      "F5 ok: aber 4 Aufgaben",
    ]);
    expect(stand.zuletzt).toBe("F5");
  });

  it("entfernt Haken, leere Notizen und liest den gemerkten Stand zurück", () => {
    let stand = mitHaken(mitHaken(LEERER_ABHAKSTAND, "N306", true), "N306", false);
    stand = mitNotiz(mitNotiz(stand, "N305", "x"), "N305", "  ");
    stand = mitAbschnitt(stand, "F. Trainer", true);
    expect(stand.haken).toEqual([]);
    expect(stand.notizen).toEqual({});
    expect(abhakstandAus(JSON.stringify(stand))).toEqual(stand);
    expect(abhakstandAus("{kaputt")).toEqual(LEERER_ABHAKSTAND);
    expect(abhakstandAus(JSON.stringify({ haken: [1], notizen: { a: 2, b: "c" } }))).toEqual({
      ...LEERER_ABHAKSTAND,
      notizen: { b: "c" },
    });
  });
});

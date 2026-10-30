/** Prüft die Zuordnung der Steckbriefe zu ihren Abbildungen an den echten Buchdaten der App. */
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import type { Kapitel } from "../../../daten/laden";
import { abbildungMitNummer, schlussstellung } from "./steckbriefbild";

const ORDNER = new URL("../../../../public/daten/de/a1/", import.meta.url);
const lies = (datei: string): unknown => JSON.parse(readFileSync(new URL(datei, ORDNER), "utf8"));
const index = lies("index.json") as { kapitel: { datei: string }[] };
const kapitel = index.kapitel.map((k) => lies(k.datei) as Kapitel);
const steckbriefe = kapitel.flatMap((k) => k.steckbriefe);

describe("Schlussstellung der Hauptvariante", () => {
  it("findet sie für jeden Eröffnungs-Steckbrief", () => {
    for (const s of steckbriefe) expect(schlussstellung(kapitel, s), s.name).not.toBeNull();
  });

  it("Spanische Partie → Abb. 2.11, Caro-Kann im Sammelabschnitt 2.10 → Abb. 2.109", () => {
    const nach = (name: string) => steckbriefe.find((s) => s.name === name);
    const spanisch = nach("Spanische Partie");
    const caro = nach("Caro-Kann-Verteidigung");
    expect(spanisch && schlussstellung(kapitel, spanisch)?.id).toBe("2.11");
    expect(caro && schlussstellung(kapitel, caro)?.id).toBe("2.109");
  });

  it("ohne Abschnitt keine Abbildung", () => {
    const erster = steckbriefe[0];
    expect(erster && schlussstellung(kapitel, { ...erster, abschnitt: null })).toBeNull();
  });
});

describe("Stopp-Moment der Fallen", () => {
  it("jeder Fallencheck mit Stopp hat seine Abbildung", () => {
    for (const f of kapitel.flatMap((k) => k.fallenchecks)) {
      if (f.stopp) expect(abbildungMitNummer(kapitel, f.stopp)?.id).toBe(f.stopp);
    }
  });

  it("unbekannte oder fehlende Nummer → null", () => {
    expect(abbildungMitNummer(kapitel, "99.99")).toBeNull();
    expect(abbildungMitNummer(kapitel, null)).toBeNull();
  });
});

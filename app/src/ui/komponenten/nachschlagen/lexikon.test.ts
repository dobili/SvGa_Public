/** Prüft die Lexikonseite des Glossars an den echten Buchdaten der App. */
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import type { Glossar } from "../../../daten/laden";
import {
  anfangsbuchstabe,
  ersteAbbildungDesBegriffs,
  kapitelDesBegriffs,
  lexikonseiten,
  lexikontext,
  ZEICHENGRUPPE,
} from "./lexikon";

const datei = new URL("../../../../public/daten/de/a1/glossar.json", import.meta.url);
const glossar = JSON.parse(readFileSync(datei, "utf8")) as Glossar;
const eintrag = (begriff: string) => {
  const gefunden = glossar.eintraege.find((e) => e.begriff === begriff);
  if (!gefunden) throw new Error(`Begriff fehlt: ${begriff}`);
  return gefunden;
};

describe("Lexikonseiten", () => {
  it("Anfangsbuchstaben mit Umlauten und Ziffern", () => {
    expect(anfangsbuchstabe("Überlastung")).toBe("U");
    expect(anfangsbuchstabe("50-Züge-Regel")).toBe(ZEICHENGRUPPE);
  });

  it("jeder Begriff steht auf genau einer Seite, A zuerst, # zuletzt", () => {
    const seiten = lexikonseiten(glossar.eintraege);
    expect(seiten.flatMap((s) => s.eintraege)).toHaveLength(glossar.eintraege.length);
    expect(seiten[0]?.buchstabe).toBe("A");
    expect(seiten.at(-1)?.buchstabe).toBe(ZEICHENGRUPPE);
  });
});

describe("Einträge", () => {
  it("Fundstelle am Ende wird zur Kapitelangabe", () => {
    const rochaden = eintrag("Entgegengesetzte Rochaden");
    expect(lexikontext(rochaden)).toMatch(/wer zuerst eine Linie öffnet\.$/);
    expect(kapitelDesBegriffs(rochaden)).toEqual([2, 6]);
    expect(ersteAbbildungDesBegriffs(rochaden)).toBe("2.56");
  });

  it("kein Text geht verloren außer der Fundstelle", () => {
    for (const e of glossar.eintraege) {
      const kurz = lexikontext(e);
      expect(kurz.length, e.begriff).toBeGreaterThan(0);
      const voll = e.text
        .map((t) => t.text)
        .join("")
        .replace(/→\s*/g, "");
      expect(voll.startsWith(kurz.replace(/\.$/, "")), e.begriff).toBe(true);
    }
  });
});

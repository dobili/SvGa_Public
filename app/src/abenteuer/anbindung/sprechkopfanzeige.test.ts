/**
 * Tests des Sprechkopfs der Partie (Wunsch des Autors, 28.11.2026): Warteschlange über beide Lagen
 * (tischblasen.ts, ersteZeile) und die Wahl von Porträt, Name und Text (sprechkopfanzeige.ts).
 */
import { describe, expect, it } from "vitest";
import { kopfanzeige, seitendauer, zugNimmtWeg, ZUG_NIMMT_AB_MS } from "./sprechkopfanzeige";
import {
  ersteZeile,
  LEERE_BLASEN,
  lesedauer,
  mitZeile,
  ohneErste,
  type Blasenstand,
  type Blasenzeile,
} from "./tischblasen";

const DELGADO = { sprecher: "coach-delgado", name: "Coach Delgado" };

function zeile(teile: Partial<Blasenzeile> & { schluessel: string }): Blasenzeile {
  return {
    lage: "oben",
    vorrang: "geschrieben",
    sprecher: null,
    name: null,
    text: "Hallo",
    stimmung: null,
    geist: false,
    testid: "t",
    ...teile,
  };
}

/** Liest den Kopf so lange, bis nichts mehr wartet, und gibt die Reihenfolge zurück. */
function ablauf(stand: Blasenstand): string[] {
  const gesehen: string[] = [];
  let jetzt = stand;
  for (let z = ersteZeile(jetzt); z; z = ersteZeile(jetzt)) {
    gesehen.push(z.schluessel);
    jetzt = ohneErste(jetzt, z.lage, z.schluessel);
  }
  return gesehen;
}

describe("Warteschlange des Sprechkopfs", () => {
  it("zeigt die Zeilen beider Lagen in der Reihenfolge, in der sie kamen", () => {
    let stand = mitZeile(LEERE_BLASEN, zeile({ schluessel: "held", lage: "unten" }));
    stand = mitZeile(stand, zeile({ schluessel: "gegner", lage: "oben" }));
    stand = mitZeile(stand, zeile({ schluessel: "ambrose", lage: "unten" }));
    expect(ablauf(stand)).toEqual(["held", "gegner", "ambrose"]);
  });

  it("verliert nichts, wenn Sätze kurz hintereinander kommen", () => {
    let stand = LEERE_BLASEN;
    for (const s of ["a", "b", "c"]) stand = mitZeile(stand, zeile({ schluessel: s }));
    expect(ablauf(stand)).toEqual(["a", "b", "c"]);
  });

  it("lässt verdrängtes Tischgespräch auch aus der Reihe", () => {
    let stand = mitZeile(LEERE_BLASEN, zeile({ schluessel: "t1", vorrang: "tisch" }));
    stand = mitZeile(stand, zeile({ schluessel: "m1", lage: "unten" }));
    expect(stand.reihe).toEqual(["m1"]);
    expect(ersteZeile(stand)?.schluessel).toBe("m1");
  });

  it("ist leer ohne Zeilen", () => {
    expect(ersteZeile(LEERE_BLASEN)).toBeNull();
  });
});

describe("Porträtwahl im Sprechkopf", () => {
  it("zeigt ohne Satz den Gegner und den Ort", () => {
    const k = kopfanzeige(DELGADO, null);
    expect(k).toMatchObject({ art: "ort", bild: "gegner", sprecher: "coach-delgado", text: "" });
    expect(k.name).toBe("Coach Delgado");
  });

  it("lässt den Gegner in der Stimmung seines Satzes sprechen (auch in camelCase)", () => {
    const z = zeile({
      schluessel: "d",
      sprecher: "coachDelgado",
      name: "Coach Delgado",
      text: "Gut gesehen.",
      stimmung: "laechelt",
    });
    expect(kopfanzeige(DELGADO, z)).toMatchObject({
      art: "rede",
      bild: "gegner",
      stimmung: "laechelt",
      text: "Gut gesehen.",
    });
  });

  it("tauscht das Porträt auf Ambrose, leicht durchsichtig", () => {
    const z = zeile({ schluessel: "a", sprecher: "ambrose", name: "Ambrose", geist: true });
    expect(kopfanzeige(DELGADO, z)).toMatchObject({
      bild: "andere",
      sprecher: "ambrose",
      name: "Ambrose",
      geist: true,
    });
  });

  it("zeigt bei Erzählzeilen den Gegner, als Erzählung", () => {
    const z = zeile({ schluessel: "e", text: "Delgado trommelt mit den Fingern." });
    expect(kopfanzeige(DELGADO, z)).toMatchObject({
      art: "erzaehlung",
      bild: "gegner",
      sprecher: "coach-delgado",
      name: "Coach Delgado",
    });
  });

  it("zeigt den Helden ohne Porträt", () => {
    const z = zeile({ schluessel: "h", lage: "unten", name: "Du", text: "Eins, zwei …" });
    expect(kopfanzeige(DELGADO, z)).toMatchObject({ bild: "ohne", sprecher: null, name: "Du" });
  });

  it("kommt ohne Porträt des Gegners aus", () => {
    expect(kopfanzeige({ sprecher: null, name: "Gegner" }, null).bild).toBe("ohne");
  });
});

describe("Zeit im Sprechkopf", () => {
  it("verteilt die Lesedauer auf die Seiten, mit Untergrenze", () => {
    const kurz = "x".repeat(40);
    expect(seitendauer(kurz, 1)).toBe(lesedauer(kurz));
    expect(seitendauer("x".repeat(300), 3)).toBe(3000);
    expect(seitendauer(kurz, 0)).toBe(lesedauer(kurz));
  });

  it("nimmt einen Satz erst nach kurzer Zeit mit dem Zug weg", () => {
    expect(zugNimmtWeg(300)).toBe(false);
    expect(zugNimmtWeg(ZUG_NIMMT_AB_MS)).toBe(true);
  });
});

/**
 * Tests der Liste „Meine Partien“ im Clubtagebuch (meinePartien.ts).
 */
import { describe, expect, it } from "vitest";
import type { Partie } from "../../spiel/partie";
import type { Partieeintrag } from "../../speicher/partien";
import { meinePartien } from "./meinePartien";

/** Ein Listeneintrag der App mit den Feldern, die die Liste liest. */
function eintrag(id: string, teile: Partial<Partie> & { abenteuer?: boolean }): Partieeintrag {
  const partie = {
    id,
    einstellung: {
      eigeneFarbe: "white",
      botName: "Skater Jo",
      ...(teile.abenteuer === false ? {} : { abenteuer: { kennung: id } }),
    },
    begonnen: "2026-11-25T18:00:00.000Z",
    zuege: Array.from({ length: 47 }, () => ({})),
    ende: { art: "matt", sieger: "white" },
    ...teile,
  };
  return { partie } as unknown as Partieeintrag;
}

describe("meinePartien", () => {
  it("zeigt Gegner, Ausgang und ganze Züge", () => {
    expect(meinePartien({ partien: [eintrag("a", {})] })).toEqual([
      {
        id: "a",
        gegner: "Skater Jo",
        ausgang: "sieg",
        zuege: 24,
        besprechbar: true,
        nachspielbar: true,
      },
    ]);
  });

  it("lässt freie Partien der App und laufende Partien weg", () => {
    const partien = [eintrag("frei", { abenteuer: false }), eintrag("offen", { ende: null })];
    expect(meinePartien({ partien })).toEqual([]);
  });

  it("behält die Reihenfolge der App (neueste zuerst) und kürzt auf die Höchstzahl", () => {
    const partien = ["c", "b", "a"].map((id) => eintrag(id, {}));
    expect(meinePartien({ partien }, null, 2).map((z) => z.id)).toEqual(["c", "b"]);
  });

  it("bespricht keine Partie mit eigenen Regeln (Schach960), wohl aber Blindschach", () => {
    const mit = (variante: string) =>
      eintrag(variante, {
        einstellung: { abenteuer: { kennung: variante, variante } },
      } as unknown as Partial<Partie>);
    const zeilen = meinePartien({ partien: [mit("schach960"), mit("blind")] });
    expect(zeilen.map((z) => z.besprechbar)).toEqual([false, true]);
  });

  it("zeigt nur die Partien dieses Spieldurchlaufs (Befund des Autors, 25.11.2026)", () => {
    const alt = eintrag("alt", { begonnen: "2026-11-20T10:00:00.000Z" });
    const neu = eintrag("neu", { begonnen: "2026-11-25T19:00:00.000Z" });
    const seit = "2026-11-25T18:30:00.000Z";
    expect(meinePartien({ partien: [neu, alt] }, seit).map((z) => z.id)).toEqual(["neu"]);
  });

  it("zählt bei einer Variante in eigener Komponente die Züge aus dem Ende, ohne Ansehen", () => {
    const ente = eintrag("ente", {
      zuege: [],
      ende: { art: "variante", sieger: "white", grund: "variante.ente.ende", halbzuege: 31 },
    } as unknown as Partial<Partie>);
    const [zeile] = meinePartien({ partien: [ente] });
    expect(zeile).toMatchObject({ zuege: 16, nachspielbar: false, besprechbar: false });
  });
});

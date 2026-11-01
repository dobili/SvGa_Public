/**
 * Tests: Eine Probepartie kommt als Abzweig an genau ihre Stelle in die Variante.
 */
import { describe, expect, it } from "vitest";
import { fortsetzungenAm, knotenAm } from "../schach/variationsbaum";
import { leserzug, neuePartie, ziehe, type Partie } from "../spiel/partie";
import type { Probeherkunft } from "../spiel/probepartie";
import type { Partieeintrag } from "../speicher/partieeintrag";
import { HOECHSTENS_VARIATIONEN, type Variation } from "./variationen";
import { probeAlsVariante } from "./probevariante";
import { ausPartie } from "./variationsquellen";

const GRUND = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
const NACH_E4_E5 = "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2";
const JETZT = new Date("2026-11-01T10:00:00.000Z");

/** Eine Partie ab ``start`` mit den Zügen ``sans``; mit Herkunft eine Probepartie. */
function partie(id: string, start: string, sans: readonly string[], probe?: Probeherkunft): Partie {
  const p = neuePartie(
    {
      startFen: start,
      eigeneFarbe: "white",
      stufe: 1,
      uhr: null,
      ruecknahmeErlaubt: true,
      abbildung: null,
      eroeffnung: null,
      stufenJePhase: { eroeffnung: 1, mittelspiel: 1, endspiel: 1 },
      gegner: "engine",
      bot: null,
      hilfen: { symbole: true, werkzeuge: true },
      gewertet: false,
      ...(probe ? { probe } : {}),
    },
    id,
    JETZT.toISOString(),
  );
  const fertig = sans.reduce<Partie | null>((x, san) => (x ? ziehe(x, leserzug(san)) : null), p);
  if (!fertig) throw new Error("Partie");
  return fertig;
}

function variante(): Variation {
  const v = ausPartie({ id: "x", startFen: GRUND, zuege: ["e4", "e5", "Nf3"] }, 2, "V", JETZT);
  if (!v) throw new Error("Variante");
  return { ...v, id: "var-1", quelle: { art: "grund" } };
}

describe("Probepartie als Variante", () => {
  it("hängt die Züge an der Stelle der Variante an, mit Kommentar am ersten neuen Zug", () => {
    const probe = partie("p", NACH_E4_E5, ["Bc4", "Nc6"], { art: "variante", id: "var-1", pfad: ["e4", "e5"] });
    const r = probeAlsVariante([variante()], [], probe, "Gegen Lotte zu Ende gespielt", "T", JETZT);
    if (!r || "grenze" in r) throw new Error("nicht übernommen");
    expect(r.id).toBe("var-1");
    expect(r.pfad).toEqual(["e4", "e5", "Bc4", "Nc6"]);
    const v = r.liste[0];
    if (!v) throw new Error("leer");
    expect(fortsetzungenAm(v, ["e4", "e5"]).map((k) => k.zug)).toEqual(["Nf3", "Bc4"]);
    expect(knotenAm(v, ["e4", "e5", "Bc4"])).toMatchObject({ herkunft: "partie", kommentar: "Gegen Lotte zu Ende gespielt" });
  });

  it("legt aus der Auswertung eine neue Variante der Partie an und nutzt sie beim zweiten Mal", () => {
    const quelle = partie("q", GRUND, ["e4", "e5", "Nf3"]);
    const eintrag: Partieeintrag = { partie: quelle, werte: [], beste: [], abstaende: [], varianten: [] };
    const herkunft: Probeherkunft = { art: "partie", id: "q", stelle: 2, farbe: "white" };
    const erste = probeAlsVariante([], [eintrag], partie("p1", NACH_E4_E5, ["Bc4"], herkunft), "A", "T", JETZT);
    if (!erste || "grenze" in erste) throw new Error("nicht übernommen");
    expect(erste.liste).toHaveLength(1);
    expect(erste.liste[0]?.quelle).toEqual({ art: "partie", id: "q" });
    const zweite = probeAlsVariante(erste.liste, [eintrag], partie("p2", NACH_E4_E5, ["d4"], herkunft), "B", "T", JETZT);
    if (!zweite || "grenze" in zweite) throw new Error("nicht übernommen");
    expect(zweite.liste).toHaveLength(1);
    const v = zweite.liste[0];
    expect(v && fortsetzungenAm(v, ["e4", "e5"]).map((k) => k.zug)).toEqual(["Nf3", "Bc4", "d4"]);
  });

  it("meldet die Grenze und legt eine neue Variante an, wenn die alte gelöscht ist", () => {
    const voll = Array.from({ length: HOECHSTENS_VARIATIONEN }, (_, i) => ({ ...variante(), id: `v${i}` }));
    const herkunft: Probeherkunft = { art: "variante", id: "weg", pfad: [] };
    const probe = partie("p", NACH_E4_E5, ["Bc4"], herkunft);
    expect(probeAlsVariante(voll, [], probe, "", "T", JETZT)).toEqual({ grenze: "varianten" });
    const neu = probeAlsVariante([], [], probe, "", "Eigene Stellung", JETZT);
    expect(neu && "liste" in neu && neu.liste[0]?.startFen).toBe(NACH_E4_E5);
    expect(probeAlsVariante([], [], partie("n", GRUND, ["e4"]), "", "T", JETZT)).toBeNull();
  });
});

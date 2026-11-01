/**
 * Tests: Eine Probepartie zählt für nichts (Wunsch des Autors, 1.11.2026). Sie steht nie in der
 * Partienliste oder als laufende Partie, das Partieende ändert weder Tagesprotokoll noch Rekorde,
 * Rivalen, Ziele, besiegte Bots oder die Wertung, und sie übersteht die Sicherung an ihrem Platz.
 */
import { describe, expect, it } from "vitest";
import { leereDaten, wandleUm } from "../speicher/format";
import { findePartie, mitPartie, mitProbe } from "../speicher/partien";
import { nachPartieende } from "../speicher/partieprotokoll";
import { spielstandAus } from "../speicher/partienLesen";
import { gibAuf, leserzug, neuePartie, ziehe, type Partie } from "./partie";
import { alsProbewert, probewertAus, type Probeherkunft } from "./probepartie";

const GRUNDSTELLUNG = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
const JETZT = new Date("2026-11-01T10:00:00.000Z");
const HERKUNFT: Probeherkunft = { art: "variante", id: "var-1", pfad: ["e4"] };

/** Eine Partie gegen Bot „lotte“, gewonnen durch Aufgabe der Engine (Leser Weiß). */
function beendet(probe?: Probeherkunft): Partie {
  const p = neuePartie(
    {
      startFen: GRUNDSTELLUNG,
      eigeneFarbe: "white",
      stufe: 2,
      uhr: null,
      ruecknahmeErlaubt: false,
      abbildung: null,
      eroeffnung: null,
      stufenJePhase: { eroeffnung: 2, mittelspiel: 2, endspiel: 2 },
      gegner: "engine",
      bot: "lotte",
      hilfen: { symbole: false, werkzeuge: false },
      gewertet: false,
      ...(probe ? { probe } : {}),
    },
    probe ? "probe-1" : "echt-1",
    JETZT.toISOString(),
  );
  const gezogen = p ? ziehe(p, leserzug("e4")) : null;
  if (!gezogen) throw new Error("Partie");
  const aufgegeben = gibAuf(gezogen);
  // Die Engine gibt auf: der Leser gewinnt (Sieg zählte sonst als Sieg im Protokoll).
  return { ...aufgegeben, ende: { art: "aufgabe", sieger: "white" } };
}

describe("Probepartie zählt nicht", () => {
  it("bleibt in ihrem eigenen Platz, nie in Partienliste, laufender Partie oder besiegten Bots", () => {
    const leer = leereDaten(JETZT).spiel;
    const nachher = mitPartie(leer, beendet(HERKUNFT));
    expect(nachher.partien).toEqual([]);
    expect(nachher.laufend).toBeNull();
    expect(nachher.besiegt).toEqual(leer.besiegt);
    expect(nachher.wertung).toEqual([]);
    expect(nachher.probe?.id).toBe("probe-1");
    expect(findePartie(nachher, "probe-1")?.einstellung.probe).toEqual(HERKUNFT);
    expect(mitProbe(nachher, null).probe).toBeNull();
    // Gegenprobe: dieselbe Partie ohne Probe kommt in die Liste.
    expect(mitPartie(leer, beendet()).partien).toHaveLength(1);
  });

  it("ändert beim Ende weder Tagesprotokoll noch Rekorde, Rivalen oder Ziele", () => {
    const daten = leereDaten(JETZT);
    const probe = beendet(HERKUNFT);
    const neu = { ...daten, spiel: mitPartie(daten.spiel, probe) };
    expect(nachPartieende(neu, probe, false, JETZT)).toBe(neu);
    const echt = beendet();
    const mitEcht = { ...daten, spiel: mitPartie(daten.spiel, echt) };
    expect(nachPartieende(mitEcht, echt, false, JETZT).aktivitaet).not.toEqual(daten.aktivitaet);
  });

  it("übersteht Speicher und Sicherung an ihrem Platz; eine Probe in der Liste wird aussortiert", () => {
    const daten = leereDaten(JETZT);
    const probe = beendet(HERKUNFT);
    const roh = JSON.parse(JSON.stringify({ ...daten, spiel: mitPartie(daten.spiel, probe) }));
    const gelesen = wandleUm(roh, JETZT);
    expect(gelesen.ok && gelesen.daten.spiel.probe?.einstellung.probe).toEqual(HERKUNFT);
    const falsch = spielstandAus({
      partien: [{ partie: JSON.parse(JSON.stringify(probe)), werte: [] }],
      laufend: JSON.parse(JSON.stringify(probe)),
    });
    expect(falsch.partien).toEqual([]);
    expect(falsch.laufend).toBeNull();
  });

  it("schreibt die Herkunft als Text der Ansicht und liest sie zurück", () => {
    const partie: Probeherkunft = { art: "partie", id: "p", stelle: 12, farbe: "black" };
    expect(probewertAus(alsProbewert(partie))).toEqual(partie);
    expect(probewertAus(alsProbewert(HERKUNFT))).toEqual(HERKUNFT);
    expect(probewertAus("kaputt")).toBeUndefined();
    expect(probewertAus(undefined)).toBeUndefined();
  });
});

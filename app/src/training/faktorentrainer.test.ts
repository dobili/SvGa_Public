/** Tests des Faktorenbilanz-Trainers (AP 13) an den Stellungen aus Kapitel 3. */
import { describe, expect, it } from "vitest";
import { ladeKapitel, stellungVon } from "../schach/buchabbildungen.testhilfe";
import { buchstellungenAus } from "./buchstellungen";
import {
  buchloesung,
  faktorenaufgabe,
  faktorenrunde,
  falscheFaktoren,
} from "./faktorentrainer";
import { festerZufall } from "./zufall";

const KAPITELZAHL = 13;
const stellungen = buchstellungenAus(Array.from({ length: KAPITELZAHL }, (_, i) => ladeKapitel(i)));

describe("Faktorenbilanz-Trainer", () => {
  it("genug Stellungen aus Kapitel 3, keine im Schach", () => {
    const alle = stellungen.flatMap((b) => faktorenaufgabe(b) ?? []);
    expect(alle.length).toBeGreaterThan(20);
    expect(alle.every((a) => a.nummer.startsWith("3."))).toBe(true);
  });

  it("Abb. 3.10 (Muzio-Gambit): Material Schwarz, Zeit und Königssicherheit Weiß", () => {
    const aufgabe = faktorenaufgabe({ nummer: "3.10", kapitel: 3, stellung: stellungVon("3.10") });
    expect(aufgabe?.loesung.material).toBe("black");
    expect(aufgabe?.loesung.zeit).toBe("white");
    expect(aufgabe?.loesung.koenig).toBe("white");
  });

  // W9 (Entscheidung des Autors, 17.10.2026): Hat das Buch eine Faktorenbilanz, gilt ihr Urteil.
  it("Abb. 3.6 (Königsgambit): Lösung aus der Buchtabelle", () => {
    const aufgabe = stellungen.find((b) => b.nummer === "3.6");
    if (!aufgabe) throw new Error("3.6 fehlt");
    const a = faktorenaufgabe(aufgabe);
    expect(a?.quelle).toBe("buch");
    expect(a?.loesung).toEqual({
      material: "black",
      zeit: "white",
      koenig: "black",
      aktivitaet: "white",
    });
  });

  it("jede Faktorenbilanz aus Kapitel 3 liefert eine vollständige Buchlösung", () => {
    const mitTabelle = stellungen.filter((b) => b.kapitel === 3 && b.faktortabelle);
    expect(mitTabelle.length).toBeGreaterThanOrEqual(14);
    for (const b of mitTabelle) {
      const tabelle = b.faktortabelle;
      expect(tabelle && buchloesung(tabelle), b.nummer).not.toBeNull();
    }
    const fragen = stellungen.filter((b) => b.kapitel === 3 && b.vorbereitet);
    expect(fragen.length).toBeGreaterThan(20);
  });

  it("eine Runde mit fester Saat; falsche Faktoren einzeln", () => {
    const runde = faktorenrunde(stellungen, 5, festerZufall(2));
    expect(runde).toHaveLength(5);
    const erste = runde[0];
    if (!erste) throw new Error("leere Runde");
    expect(falscheFaktoren(erste, erste.loesung)).toEqual([]);
    const anders = erste.loesung.zeit === "gleich" ? "white" : "gleich";
    expect(falscheFaktoren(erste, { ...erste.loesung, zeit: anders })).toEqual(["zeit"]);
  });
});

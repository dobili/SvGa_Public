/** Tests des Faktorenbilanz-Trainers (AP 13) an den Stellungen aus Kapitel 3. */
import { describe, expect, it } from "vitest";
import { ladeKapitel, stellungVon } from "../schach/buchabbildungen.testhilfe";
import { buchstellungenAus } from "./buchstellungen";
import { faktorenaufgabe, faktorenrunde, falscheFaktoren } from "./faktorentrainer";
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

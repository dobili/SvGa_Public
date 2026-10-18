/**
 * Test des Wachhunds im Engine-Dienst (0.2.85, Fehlerbericht des Autors: Auswertung startete nach
 * einer Partie nicht): Antwortet die Engine nach dem „go“ nicht mehr, startet der Dienst sie neu,
 * lehnt den hängenden Auftrag als abgebrochen ab, und der nächste Auftrag läuft mit der neuen.
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import { AuftragAbgebrochen, EngineDienst, type Kanal } from "./engineDienst";

/** Ein Kanal, der Start und Bereitschaft meldet; auf „go“ antwortet er nur, wenn er lebt. */
function falscherKanal(lebt: boolean, beendet: () => void): Kanal {
  let empfaenger: (zeile: string) => void = () => undefined;
  return {
    senden: (befehl) => {
      const antwort =
        befehl === "uci"
          ? "uciok"
          : befehl === "isready"
            ? "readyok"
            : befehl.startsWith("go") && lebt
              ? "bestmove e2e4"
              : null;
      if (antwort) queueMicrotask(() => empfaenger(antwort));
    },
    beiZeile: (neu) => {
      empfaenger = neu;
    },
    beenden: beendet,
  };
}

const GRUNDSTELLUNG = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
const RECHENZEIT_MS = 100;
const LANGE_NACH_DER_RECHENZEIT_MS = 20_000;

describe("Wachhund des Engine-Dienstes", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("hängende Engine: neu starten, Auftrag abgebrochen, nächster Auftrag klappt", async () => {
    vi.useFakeTimers();
    const beendet = vi.fn();
    let erster = true;
    const dienst = new EngineDienst(() => {
      const kanal = falscherKanal(!erster, beendet);
      erster = false;
      return kanal;
    });
    vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const haengt = dienst.bewerte(GRUNDSTELLUNG, RECHENZEIT_MS);
    const pruefung = expect(haengt).rejects.toBeInstanceOf(AuftragAbgebrochen);
    await vi.advanceTimersByTimeAsync(LANGE_NACH_DER_RECHENZEIT_MS);
    await pruefung;
    expect(beendet).toHaveBeenCalledTimes(1);
    expect(dienst.beschaeftigt()).toBe(false);
    const danach = dienst.bewerte(GRUNDSTELLUNG, RECHENZEIT_MS);
    await vi.advanceTimersByTimeAsync(RECHENZEIT_MS);
    await expect(danach).resolves.toMatchObject({ besterZug: "e2e4" });
  });
});

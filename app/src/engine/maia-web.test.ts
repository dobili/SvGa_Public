/**
 * Tests der Verbindung zum Maia-Worker (seit 0.3.39): Modell einmal laden, Antworten über die
 * Nummer zuordnen, Fehler und Absturz weitergeben, danach neu versuchen. Der Worker ist hier ein
 * Ersatz ohne echten Thread; das echte Netz prüft tests/e2e/maia.spec.ts in Chromium.
 */
import { describe, expect, it } from "vitest";
import { Maiaverbindung, type Maiakanal } from "./maia-web";
import type { AnMaia, VonMaia } from "./maiaNachrichten";

/** Ersatz-Worker: merkt sich die Aufträge; antwortet, wenn der Test es sagt. */
class Ersatzkanal implements Maiakanal {
  onmessage: ((ereignis: MessageEvent<VonMaia>) => void) | null = null;
  onerror: ((ereignis: ErrorEvent) => void) | null = null;
  readonly auftraege: AnMaia[] = [];
  beendet = false;

  postMessage(nachricht: AnMaia): void {
    this.auftraege.push(nachricht);
  }

  terminate(): void {
    this.beendet = true;
  }

  antworte(nachricht: VonMaia): void {
    this.onmessage?.({ data: nachricht } as MessageEvent<VonMaia>);
  }

  stuerze(): void {
    this.onerror?.({ message: "kaputt", preventDefault: () => undefined } as ErrorEvent);
  }
}

const SPEICHER = {
  laufzeit: () => Promise.resolve(new ArrayBuffer(4)),
  netz: () => Promise.resolve(new ArrayBuffer(8)),
};
const BRETT = new Float32Array([1, 0, 1]);
const LOGITS = new Float32Array([0.5, 0.25]);

/** Wartet, bis die laufenden Promise-Ketten ihre Nachricht geschickt haben. */
const ruhe = () => new Promise((fertig) => setTimeout(fertig, 0));

function aufbau() {
  const kanaele: Ersatzkanal[] = [];
  const verbindung = new Maiaverbindung(() => {
    const kanal = new Ersatzkanal();
    kanaele.push(kanal);
    return kanal;
  }, SPEICHER);
  return { verbindung, kanaele };
}

describe("Maiaverbindung", () => {
  it("lädt das Modell einmal und liefert die Logits der passenden Antwort", async () => {
    const { verbindung, kanaele } = aufbau();
    const erste = verbindung.rechne("rapid", BRETT, 1500, 1400);
    await ruhe();
    const kanal = kanaele[0];
    expect(kanal?.auftraege.map((a) => a.art)).toEqual(["lade"]);
    kanal?.antworte({ nr: 1, art: "fertig" });
    await ruhe();
    expect(kanal?.auftraege[1]).toMatchObject({ art: "rechne", nr: 2, eloSelbst: 1500 });
    kanal?.antworte({ nr: 2, art: "fertig", logits: LOGITS });
    await expect(erste).resolves.toBe(LOGITS);
    const zweite = verbindung.rechne("rapid", BRETT, 1500, 1400);
    await ruhe();
    expect(kanal?.auftraege.map((a) => a.art)).toEqual(["lade", "rechne", "rechne"]);
    kanal?.antworte({ nr: 3, art: "fertig", logits: LOGITS });
    await expect(zweite).resolves.toBe(LOGITS);
    expect(BRETT).toEqual(new Float32Array([1, 0, 1]));
  });

  it("gibt einen Fehler des Workers weiter", async () => {
    const { verbindung, kanaele } = aufbau();
    const rechnung = verbindung.rechne("blitz", BRETT, 1200, 1200);
    await ruhe();
    kanaele[0]?.antworte({ nr: 1, art: "fehler", meldung: "Netz fehlt" });
    await expect(rechnung).rejects.toThrow("Netz fehlt");
  });

  it("startet nach einem Absturz einen neuen Worker und lädt das Modell neu", async () => {
    const { verbindung, kanaele } = aufbau();
    const rechnung = verbindung.rechne("rapid", BRETT, 1500, 1500);
    await ruhe();
    kanaele[0]?.stuerze();
    await expect(rechnung).rejects.toThrow("abgestürzt");
    expect(kanaele[0]?.beendet).toBe(true);
    const neu = verbindung.rechne("rapid", BRETT, 1500, 1500);
    await ruhe();
    expect(kanaele).toHaveLength(2);
    expect(kanaele[1]?.auftraege.map((a) => a.art)).toEqual(["lade"]);
    verbindung.freigeben();
    await expect(neu).rejects.toThrow("freigegeben");
  });
});

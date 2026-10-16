/** Tests für den Fortschritt je Kapitel (Pflichtenheft 4, Stufe 2). */
import { describe, expect, it } from "vitest";
import { leereDaten } from "./format";
import {
  geloesteUebungen,
  kapitelfortschritt,
  markiereGesehen,
  notiereDurchgang,
  notiereUebung,
  setzeGesehen,
} from "./fortschritt";

const ERST = new Date("2026-10-14T08:00:00.000Z");
const DANN = new Date("2026-10-15T09:00:00.000Z");

describe("Fortschritt", () => {
  it("hakt von Hand ab und nimmt Haken zurück; ein altes Datum bleibt", () => {
    const alt = markiereGesehen(leereDaten(ERST), "1.1", ERST);
    const alle = setzeGesehen(alt, ["1.1", "1.2", "1.3"], true, DANN);
    expect(alle.fortschritt.gesehen).toEqual({
      "1.1": ERST.toISOString(),
      "1.2": DANN.toISOString(),
      "1.3": DANN.toISOString(),
    });
    const ohne = setzeGesehen(alle, ["1.2"], false, DANN);
    expect(Object.keys(ohne.fortschritt.gesehen)).toEqual(["1.1", "1.3"]);
  });

  it("merkt das erste Ansehen und ändert danach nichts mehr", () => {
    const einmal = markiereGesehen(leereDaten(ERST), "1.26", ERST);
    expect(einmal.fortschritt.gesehen).toEqual({ "1.26": ERST.toISOString() });
    expect(markiereGesehen(einmal, "1.26", DANN)).toBe(einmal);
  });

  it("zählt Versuche an Übungen; gelöst bleibt gelöst", () => {
    const uebung = { id: "ueb:droh-ignorieren", kapitel: 1 };
    let daten = notiereUebung(leereDaten(ERST), { ...uebung, richtig: false }, ERST);
    daten = notiereUebung(daten, { ...uebung, richtig: true }, DANN);
    daten = notiereUebung(daten, { ...uebung, richtig: false }, DANN);
    expect(daten.fortschritt.uebungen[uebung.id]).toEqual({
      kapitel: 1,
      versuche: 3,
      geloest: true,
      zuletzt: DANN.toISOString(),
    });
    expect(geloesteUebungen(daten.fortschritt, 1)).toBe(1);
    expect(geloesteUebungen(daten.fortschritt, 2)).toBe(0);
  });

  it("summiert die Durchgänge eines Trainers", () => {
    let daten = notiereDurchgang(leereDaten(ERST), "roentgen", { aufgaben: 10, richtig: 7 }, ERST);
    daten = notiereDurchgang(daten, "roentgen", { aufgaben: 10, richtig: 9 }, DANN);
    expect(daten.fortschritt.trainer.roentgen).toEqual({
      durchgaenge: 2,
      aufgaben: 20,
      richtig: 16,
      zuletzt: DANN.toISOString(),
    });
  });

  it("fasst ein Kapitel zusammen: Abbildungen, Übungen, Trainer", () => {
    let daten = markiereGesehen(leereDaten(ERST), "1.26", ERST);
    daten = markiereGesehen(daten, "9.99", ERST);
    daten = notiereUebung(daten, { id: "a", kapitel: 1, richtig: true }, ERST);
    daten = notiereUebung(daten, { id: "b", kapitel: 1, richtig: false }, ERST);
    daten = notiereDurchgang(daten, "zaehlen", { aufgaben: 5, richtig: 5 }, ERST);
    const stand = kapitelfortschritt(
      daten.fortschritt,
      1,
      ["1.25", "1.26", "1.27"],
      ["a", "b", "c"],
    );
    expect(stand.abbildungen).toEqual({ erreicht: 1, gesamt: 3 });
    expect(stand.uebungen).toEqual({ erreicht: 1, versucht: 2, gesamt: 3 });
    expect(stand.trainer.map((t) => [t.kennung, t.stand?.durchgaenge ?? null])).toEqual([
      ["roentgen", null],
      ["zaehlen", 1],
    ]);
  });
});

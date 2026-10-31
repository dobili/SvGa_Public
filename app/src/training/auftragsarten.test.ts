/**
 * Tests der Auftragsarten (Gamifizierung P6): Kennungen eindeutig, Texte in beiden Sprachen,
 * Trainer aus TRAINER (am längsten nicht dran), Bot eine Stufe über der höchsten besiegten,
 * Prüfungen nur für diese Woche.
 */
import { describe, expect, it } from "vitest";
import de from "../i18n/de.json";
import en from "../i18n/en.json";
import { gegnerDerStufe } from "../engine/gegner";
import { zaehleAktivitaet } from "../speicher/aktivitaet";
import { leereDaten, type Nutzerdaten } from "../speicher/format";
import { notiereDurchgang } from "../speicher/fortschritt";
import {
  AUFTRAGSARTEN,
  botDerStufe,
  hoechsteBesiegteStufe,
  langeNichtGespielt,
  TRAINER_OHNE_RUNDE,
} from "./auftragsarten";
import { TRAINER } from "./trainer";
import { fortschritt, waehleAuftraege, type Wahllage } from "./wochenauftraege";
import { festerZufall } from "./zufall";

const JETZT = new Date(2026, 9, 31, 10);
const MONTAG = "2026-10-26";

function wahllage(daten: Nutzerdaten): Wahllage {
  return {
    daten,
    kapitel: [{ kapitel: 1, titel: "Eins", abbildungen: ["1.1", "1.2"] }],
    jetzt: JETZT,
    zufall: festerZufall(1),
  };
}

function artMit(kennung: string) {
  const art = AUFTRAGSARTEN.find((a) => a.kennung === kennung);
  if (!art) throw new Error(`Auftragsart ${kennung} fehlt`);
  return art;
}

describe("Auftragsarten", () => {
  it("haben eindeutige Kennungen und Texte in beiden Sprachen", () => {
    const kennungen = AUFTRAGSARTEN.map((a) => a.kennung);
    expect(new Set(kennungen).size).toBe(kennungen.length);
    for (const art of AUFTRAGSARTEN)
      for (const schluessel of [art.text, art.knopf, art.textEins].filter(Boolean)) {
        expect(de).toHaveProperty([schluessel as string]);
        expect(en).toHaveProperty([schluessel as string]);
      }
  });

  it("wählen für Neue drei Aufträge, die zu leeren Daten passen", () => {
    const liste = waehleAuftraege({ ...wahllage(leereDaten(JETZT)) });
    expect(liste).toHaveLength(3);
    expect(liste.map((a) => a.art)).not.toContain("fehler");
    expect(liste.map((a) => a.art)).not.toContain("karten");
  });

  it("nimmt den Trainer aus TRAINER, nie gespielte zuerst, ohne Trainer ohne Runde", () => {
    const reihe = langeNichtGespielt(leereDaten(JETZT));
    expect(reihe).toHaveLength(TRAINER.filter((t) => t.fertig).length - TRAINER_OHNE_RUNDE.size);
    let d = leereDaten(JETZT);
    for (const t of TRAINER) d = notiereDurchgang(d, t.kennung, { aufgaben: 1, richtig: 1 }, JETZT);
    d = notiereDurchgang(d, "taktik", { aufgaben: 1, richtig: 1 }, new Date(2026, 8, 1));
    expect(langeNichtGespielt(d)[0]).toBe("taktik");
    const wahl = artMit("trainer").waehle(wahllage(d));
    expect(wahl?.anzahl).toBe(1);
  });

  it("zählt eine Runde im Trainer nur in dieser Woche", () => {
    const art = artMit("trainer");
    const auftrag = { art: "trainer", anzahl: 1, wert: "taktik" };
    const vorher = notiereDurchgang(leereDaten(JETZT), "taktik", { aufgaben: 5, richtig: 4 }, new Date(2026, 9, 25));
    expect(fortschritt(auftrag, vorher, MONTAG)).toBe(0);
    const jetzt = notiereDurchgang(vorher, "taktik", { aufgaben: 5, richtig: 4 }, JETZT);
    expect(fortschritt(auftrag, jetzt, MONTAG)).toBe(1);
    expect(art.ziel(auftrag, jetzt)).toEqual({
      art: "ansicht",
      ansicht: { bildschirm: "trainer", kennung: "taktik" },
    });
  });

  it("verlangt einen Bot eine Stufe über der höchsten besiegten und belegt ihn vor", () => {
    const d = leereDaten(JETZT);
    expect(hoechsteBesiegteStufe(d)).toBe(0);
    expect(artMit("bot").waehle(wahllage(d))).toEqual({ anzahl: 1, wert: "1" });
    const erster = gegnerDerStufe(1)[0]?.kennung ?? "";
    expect(botDerStufe(d, 1)).toBe(erster);
    const mitSieg = { ...d, spiel: { ...d.spiel, besiegt: { ...d.spiel.besiegt, rapid: [erster] } } };
    expect(hoechsteBesiegteStufe(mitSieg)).toBe(1);
    expect(artMit("bot").waehle(wahllage(mitSieg))).toEqual({ anzahl: 1, wert: "2" });
    expect(botDerStufe(mitSieg, 11)).toBeNull();
  });

  it("zählt die Tagesaufgabe einmal je Tag der Woche", () => {
    let d = leereDaten(JETZT);
    d = zaehleAktivitaet(d, "tagesaufgabe", 1, new Date(2026, 9, 27, 9));
    d = zaehleAktivitaet(d, "tagesaufgabe", 1, new Date(2026, 9, 27, 19));
    d = zaehleAktivitaet(d, "tagesaufgabe", 1, new Date(2026, 9, 29, 9));
    d = zaehleAktivitaet(d, "tagesaufgabe", 1, new Date(2026, 9, 20, 9));
    expect(fortschritt({ art: "tagesaufgabe", anzahl: 3, wert: null }, d, MONTAG)).toBe(2);
  });

  it("schlägt neue Abbildungen ab der ersten ungesehenen vor", () => {
    const d = { ...leereDaten(JETZT) };
    const gesehen = { ...d, fortschritt: { ...d.fortschritt, gesehen: { "1.1": JETZT.toISOString() } } };
    expect(artMit("abbildungen").waehle(wahllage(gesehen))).toEqual({ anzahl: 1, wert: "1.2" });
  });
});

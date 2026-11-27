/**
 * Prüft den Texturspeicher (texturspeicher.ts): Bilder bleiben über den Kartenwechsel, neue
 * Adressen laden neu, Gemaltes und Umgefärbtes geht nach dem Abbau, die Obergrenze verdrängt das
 * am längsten Unbenutzte.
 */
import { describe, expect, it } from "vitest";
import { Texturspeicher, type Texturablage } from "./texturspeicher";

/** Eine Ablage wie Phasers Texturspeicher: Schlüssel → Objekt und Fläche. */
class Testablage implements Texturablage {
  readonly bilder = new Map<string, { objekt: object; pixel: number }>();
  entfernt: string[] = [];
  /** Wie der Lader nach dem Laden: ein neues Texturobjekt unter dem Schlüssel. */
  lege(schluessel: string, pixel = 100): void {
    this.bilder.set(schluessel, { objekt: {}, pixel });
  }
  schluessel = () => [...this.bilder.keys()];
  vorhanden = (s: string) => this.bilder.has(s);
  kennung = (s: string) => this.bilder.get(s)?.objekt ?? null;
  pixel = (s: string) => this.bilder.get(s)?.pixel ?? 0;
  entferne = (s: string) => {
    this.bilder.delete(s);
    this.entfernt.push(s);
  };
}

/** Eine Karte laden: vorLaden je Bild, die neuen legt der „Lader“, dann nachLaden. */
function ladeKarte(speicher: Texturspeicher, ablage: Testablage, bilder: [string, string][]) {
  speicher.neueKarte();
  const behalten: string[] = [];
  for (const [schluessel, adresse] of bilder) {
    if (speicher.vorLaden(schluessel, adresse)) behalten.push(schluessel);
    else ablage.lege(schluessel);
  }
  speicher.nachLaden();
  return behalten;
}

describe("Texturspeicher", () => {
  it("behält Bilder mit gleicher Adresse über den Kartenwechsel (Held auf zwei Karten)", () => {
    const ablage = new Testablage();
    const speicher = new Texturspeicher(ablage);
    ladeKarte(speicher, ablage, [
      ["heldfigur", "blob:held"],
      ["hintergrund:blob:aussen", "blob:aussen"],
    ]);
    speicher.raeumeAuf();
    const behalten = ladeKarte(speicher, ablage, [
      ["heldfigur", "blob:held"],
      ["hintergrund:blob:park", "blob:park"],
    ]);
    expect(behalten).toEqual(["heldfigur"]);
    expect(ablage.entfernt).toEqual([]);
  });

  it("lädt neu, wenn die Adresse unter demselben Schlüssel wechselt (Heldin statt Held)", () => {
    const ablage = new Testablage();
    const speicher = new Texturspeicher(ablage);
    ladeKarte(speicher, ablage, [["heldfigur", "blob:held"]]);
    speicher.raeumeAuf();
    const behalten = ladeKarte(speicher, ablage, [["heldfigur", "blob:heldin"]]);
    expect(behalten).toEqual([]);
    expect(ablage.entfernt).toEqual(["heldfigur"]);
  });

  it("entfernt nach dem Abbau Gemaltes und Umgefärbtes (Dunkelheit, Winterfarben)", () => {
    const ablage = new Testablage();
    const speicher = new Texturspeicher(ablage);
    ladeKarte(speicher, ablage, [
      ["moebel:baum", "moebel/baum.png"],
      ["moebel:bank", "moebel/bank.png"],
    ]);
    ablage.lege("dunkel:4"); // in create gemalt (toenungsschicht.ts)
    ablage.lege("moebel:baum"); // im Winter umgefärbt: neues Objekt unter altem Schlüssel
    speicher.raeumeAuf();
    expect(ablage.entfernt.sort()).toEqual(["dunkel:4", "moebel:baum"]);
    expect(ablage.vorhanden("moebel:bank")).toBe(true);
    // Auf der nächsten Karte kommt der Baum ungefärbt neu aus seiner Datei.
    expect(ladeKarte(speicher, ablage, [["moebel:baum", "moebel/baum.png"]])).toEqual([]);
  });

  it("verdrängt über der Obergrenze das am längsten Unbenutzte, nie mehr als nötig", () => {
    const ablage = new Testablage();
    // Platz für zwei Bilder zu 100 Pixeln (4 Byte je Pixel).
    const speicher = new Texturspeicher(ablage, 800);
    ladeKarte(speicher, ablage, [["a", "a.png"]]);
    speicher.raeumeAuf();
    ladeKarte(speicher, ablage, [["b", "b.png"]]);
    speicher.raeumeAuf();
    ladeKarte(speicher, ablage, [
      ["a", "a.png"],
      ["c", "c.png"],
    ]);
    speicher.raeumeAuf();
    // b wurde zuletzt auf der zweiten Karte gebraucht, a und c auf der dritten.
    expect(ablage.entfernt).toEqual(["b"]);
    expect(speicher.bytes()).toBe(800);
  });

  it("vergisst Bilder, deren Laden fehlschlug, und zählt Treffer und Ladevorgänge je Karte", () => {
    const ablage = new Testablage();
    const speicher = new Texturspeicher(ablage);
    speicher.neueKarte();
    expect(speicher.vorLaden("figur:fehlt", "blob:weg")).toBe(false);
    speicher.nachLaden(); // der Lader legte nichts
    expect(speicher.bytes()).toBe(0);
    ladeKarte(speicher, ablage, [["held", "held.png"]]);
    ladeKarte(speicher, ablage, [["held", "held.png"]]);
    expect(speicher.stand()).toEqual({ texturen: 1, bytes: 400, behalten: 1, geladen: 0 });
  });

  it("braucht dieselbe Karte ein Bild doppelt, bleibt es eines (Statisten mit gleichem Bogen)", () => {
    const ablage = new Testablage();
    const speicher = new Texturspeicher(ablage);
    speicher.neueKarte();
    expect(speicher.vorLaden("statist:7", "s7.png")).toBe(false);
    expect(speicher.vorLaden("statist:7", "s7.png")).toBe(false); // Phaser kennt ihn in der Liste
    ablage.lege("statist:7");
    speicher.nachLaden();
    speicher.raeumeAuf();
    expect(ablage.entfernt).toEqual([]);
  });
});

/**
 * Tests der Auswahl fürs Abenteuerpaket (skripte/abenteuerpaket-auswahl.mjs) und des gleichzeitigen
 * Ladens (paketlader.ts, jeGleichzeitig).
 */
import { describe, expect, it } from "vitest";
import {
  genutzteMoebel,
  kompakteKarte,
  ladbareKarten,
} from "../../../skripte/abenteuerpaket-auswahl.mjs";
import { jeGleichzeitig } from "./paketlader";

describe("Abenteuerpaket: Auswahl", () => {
  it("verdichtet Karten ohne Einrückung, rotation 0 und visible true", () => {
    const karte = {
      layers: [{ objects: [{ name: "kiosk", x: 16, rotation: 0, visible: true }] }],
    };
    const text = kompakteKarte(JSON.stringify(karte, null, 1));
    expect(text).toBe('{"layers":[{"objects":[{"name":"kiosk","x":16}]}]}');
  });

  it("kennt Grundkarten, Zustände und ihre Hintergründe aus orte.json", () => {
    const { dateien, hintergruende } = ladbareKarten({
      orte: [
        {
          karten: [
            {
              kennung: "mapleFalls.wohnzimmer",
              datei: "karten/maple-falls-wohnzimmer.json",
              zustaende: { aufbruchGesehen: "karten/maple-falls-wohnzimmer-ausgepackt.json" },
            },
          ],
        },
      ],
    });
    expect([...dateien]).toEqual([
      "maple-falls-wohnzimmer.json",
      "maple-falls-wohnzimmer-ausgepackt.json",
    ]);
    expect([...hintergruende]).toEqual([
      "mapleFalls.wohnzimmer.png",
      "mapleFalls.wohnzimmer-ausgepackt.png",
    ]);
  });

  it("behält nur Möbel, die ein Text als ganzes Wort nennt", () => {
    const moebel = { sx7Mais: 1, sx7MaisGruen: 2, kiste: 3 };
    expect(genutzteMoebel(moebel, ['{"name":"sx7MaisGruen"}'])).toEqual({ sx7MaisGruen: 2 });
  });
});

describe("Abenteuerpaket: gleichzeitig laden", () => {
  it("bearbeitet alle Einträge und nie mehr als die erlaubte Anzahl zugleich", async () => {
    let laufend = 0;
    let hoechstens = 0;
    const erledigt: number[] = [];
    await jeGleichzeitig([1, 2, 3, 4, 5, 6, 7], 3, async (n) => {
      laufend++;
      hoechstens = Math.max(hoechstens, laufend);
      await new Promise((fertig) => setTimeout(fertig, n));
      erledigt.push(n);
      laufend--;
    });
    expect(erledigt.sort()).toEqual([1, 2, 3, 4, 5, 6, 7]);
    expect(hoechstens).toBe(3);
  });
});

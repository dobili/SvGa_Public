/**
 * Lauftest über ALLE Übergänge der gebauten Karten (Befund des Autors beim ersten Spielen,
 * 10.11.2026): Von jedem Ankunftsfeld einer Karte kommt der Held zu Fuß zu jedem anderen Übergang
 * und löst ihn aus. Gelesen werden die Tiled-Karten, orte.json und die Möbellisten aus
 * inhalte/abenteuer, also dieselben Daten, die ins Paket gehen.
 */
import { readdirSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { liesAusloeser, type Ausloeser } from "./ausloeserebene";
import { begehbar, sperrkacheln, type Sperrangabe, type Tiledkarte } from "./begehbar";
import { gehe, kuerzesterWeg, loestAus, type Kachelort } from "./uebergangslauf";

const KACHEL = 16;
const INHALTE = new URL("../../../../inhalte/abenteuer/", import.meta.url);

function lies<T>(pfad: string): T {
  return JSON.parse(readFileSync(new URL(pfad, INHALTE), "utf8")) as T;
}

interface Ortseintrag {
  readonly kennung: string;
  readonly karten: readonly {
    readonly kennung: string;
    readonly datei: string;
    readonly zustaende?: Readonly<Record<string, string>>;
  }[];
  readonly ausloeser?: readonly {
    readonly name: string;
    readonly art: string;
    readonly karte?: string;
    readonly ziel?: { readonly karte: string; readonly ausloeser: string };
  }[];
}

function moebelliste(): Record<string, Sperrangabe> {
  const alle: Record<string, Sperrangabe> = {};
  for (const datei of readdirSync(new URL("moebel/", INHALTE))) {
    if (datei.endsWith(".json")) {
      Object.assign(alle, lies<{ moebel: Record<string, Sperrangabe> }>(`moebel/${datei}`).moebel);
    }
  }
  return alle;
}

/** Der Eintrag aus orte.json zu einem Auslöser (mit der Karte geht vor dem des Ortes, wie in der App). */
function regel(ort: Ortseintrag, karte: string, name: string) {
  const passende = (ort.ausloeser ?? []).filter((a) => a.name === name);
  return passende.find((a) => a.karte === karte) ?? passende.find((a) => !a.karte);
}

/**
 * Weg vom Start zu einem der Felder; führt keiner hin, geht es über Übergänge weiter, die auf
 * derselben Karte ankommen (Steg über die Schleuse in Lockport: Nord- und Südufer sind getrennt).
 */
function wegMitStegen(
  frei: (x: number, y: number) => boolean,
  start: Kachelort,
  felder: readonly Kachelort[],
  stege: readonly { readonly von: readonly Kachelort[]; readonly nach: Kachelort }[],
): Kachelort[] | null {
  const starts = [start];
  for (let i = 0; i < starts.length; i++) {
    const hier = starts[i] as Kachelort;
    // Über einen Steg genau auf dem gesuchten Übergang angekommen: erreicht, nichts auszulösen.
    if (i > 0 && felder.some((f) => f.x === hier.x && f.y === hier.y)) return [];
    const weg = kuerzesterWeg(frei, hier, felder);
    if (weg) return weg;
    for (const steg of stege) {
      const bekannt = starts.some((s) => s.x === steg.nach.x && s.y === steg.nach.y);
      if (!bekannt && kuerzesterWeg(frei, hier, steg.von)) starts.push(steg.nach);
    }
  }
  return null;
}

/** Befunde einer Kartendatei: gesperrte, nicht erreichbare oder nicht auslösbare Übergänge. */
function pruefeKarte(
  ort: Ortseintrag,
  kennung: string,
  datei: string,
  moebel: Record<string, Sperrangabe>,
): string[] {
  const karte = lies<Tiledkarte>(datei);
  const alle = liesAusloeser(
    karte.layers.flatMap((e) => e.objects ?? []),
    KACHEL,
  );
  const frei = begehbar(karte, sperrkacheln(karte, moebel, KACHEL));
  const felderVon = (name: string) => alle.filter((a) => a.name === name && a.typ === "ausloeser");
  const namen = [...new Set(alle.map((a) => a.name))].filter(
    (name) => felderVon(name).length > 0 && regel(ort, kennung, name)?.art === "uebergang",
  );
  const stege = namen.flatMap((name) => {
    const ziel = regel(ort, kennung, name)?.ziel;
    const nach = ziel?.karte === kennung ? felderVon(ziel.ausloeser)[0] : undefined;
    return nach ? [{ von: felderVon(name), nach }] : [];
  });
  const befunde: string[] = [];
  for (const ziel of namen) {
    const felder = felderVon(ziel);
    for (const f of felder) {
      if (!frei(f.x, f.y)) befunde.push(`${datei} ${ziel}: Feld (${f.x}, ${f.y}) ist gesperrt`);
    }
    // Ankünfte: jeder andere Übergang; hat die Karte nur einen, der Auslöser „start“.
    const andere = namen.filter((n) => n !== ziel);
    for (const start of andere.length > 0 ? andere : ["start"]) {
      const ankunft = felderVon(start)[0];
      if (!ankunft) continue;
      const weg = wegMitStegen(frei, ankunft, felder, stege);
      if (!weg) befunde.push(`${datei} ${ziel}: von ${start} aus nicht erreichbar`);
      else if (weg.length > 0 && !loestAus(gehe(alle, weg), ziel)) {
        befunde.push(`${datei} ${ziel}: löst von ${start} aus nicht aus`);
      }
    }
  }
  return befunde;
}

describe("Übergänge zu Fuß", () => {
  it("jeder Übergang jeder Karte ist von jeder Ankunft erreichbar und löst aus", () => {
    const orte = lies<{ orte: Ortseintrag[] }>("orte.json").orte;
    const moebel = moebelliste();
    const befunde: string[] = [];
    for (const ort of orte) {
      for (const k of ort.karten) {
        for (const datei of [k.datei, ...Object.values(k.zustaende ?? {})]) {
          befunde.push(...pruefeKarte(ort, k.kennung, datei, moebel));
        }
      }
    }
    expect(befunde).toEqual([]);
  });

  it("geht einen Weg ab und meldet den Übergang erst beim Betreten", () => {
    const alle: Ausloeser[] = [
      { name: "tuer", typ: "ausloeser", x: 2, y: 0 },
      { name: "start", typ: "ausloeser", x: 0, y: 2 },
    ];
    const frei = (x: number, y: number) =>
      x >= 0 && y >= 0 && x < 3 && y < 3 && !(x === 1 && y === 1);
    const weg = kuerzesterWeg(frei, { x: 0, y: 2 }, [{ x: 2, y: 0 }]);
    expect(weg).toHaveLength(5);
    expect(loestAus(gehe(alle, weg ?? []), "tuer")).toBe(true);
    // Hinter einer Wand ist die Tür nicht erreichbar.
    expect(
      kuerzesterWeg((x, y) => frei(x, y) && x < 2, { x: 0, y: 2 }, [{ x: 2, y: 0 }]),
    ).toBeNull();
  });
});

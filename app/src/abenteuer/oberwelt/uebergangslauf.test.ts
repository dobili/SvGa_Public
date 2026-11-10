/**
 * Lauftest über ALLE Übergänge der gebauten Karten (Befund des Autors beim ersten Spielen,
 * 10.11.2026): Von jedem Ankunftsfeld einer Karte kommt der Held zu Fuß zu jedem anderen Übergang
 * und löst ihn aus. Gelesen werden die Tiled-Karten, orte.json und die Möbellisten aus
 * inhalte/abenteuer, also dieselben Daten, die ins Paket gehen.
 */
import { readdirSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { liesAusloeser, type Ausloeser } from "./ausloeserebene";
import { ankunftsort } from "./ankunft";
import { begehbar, laufwege, sperrkacheln, type Sperrangabe, type Tiledkarte } from "./begehbar";
import { erreichbar, gehe, kuerzesterWeg, loestAus, type Kachelort } from "./uebergangslauf";

const KACHEL = 16;
/** Der Lauf über alle Karten und alle Laufwege braucht einige Sekunden. */
const ZEITGRENZE_MS = 60000;
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
  // Statisten und Tiere stehen an ihrem Platz (auch die, die später loslaufen).
  const gesperrt = sperrkacheln(karte, moebel, KACHEL);
  for (const w of laufwege(karte, KACHEL)) gesperrt.add(`${w.start.x},${w.start.y}`);
  const frei = begehbar(karte, gesperrt);
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
    if (ankunftsort(karte, moebel, ziel, KACHEL)?.aufAusloeser) {
      befunde.push(`${datei} ${ziel}: kein freies Feld neben dem Durchgang für die Ankunft`);
    }
    // Ankünfte: jeder andere Übergang; hat die Karte nur einen, der Auslöser „start“.
    const andere = namen.filter((n) => n !== ziel);
    for (const start of andere.length > 0 ? andere : ["start"]) {
      // Der Held kommt neben dem Durchgang an (ankunft.ts), auf „start“ genau dort.
      const ankunft =
        start === "start" ? felderVon(start)[0] : ankunftsort(karte, moebel, start, KACHEL);
      if (!ankunft) continue;
      const weg = wegMitStegen(frei, ankunft, felder, stege);
      if (!weg) befunde.push(`${datei} ${ziel}: von ${start} aus nicht erreichbar`);
      else if (weg.length > 0 && !loestAus(gehe(alle, weg), ziel)) {
        befunde.push(`${datei} ${ziel}: löst von ${start} aus nicht aus`);
      }
    }
  }
  const fest = unerreichbare(datei, alle, frei, namen, stege);
  return [...befunde, ...fest, ...versperrer(datei, karte, alle, gesperrt, namen, stege)];
}

/**
 * Figuren und Gegenstände, an die der Held nicht herankommt: Von irgendeiner Ankunft aus muss er
 * auf ihrer Kachel oder auf einer Nachbarkachel stehen können (ansprechen und ansehen geht von
 * davor). Warum: Neue Kollisionen an Möbeln dürfen niemanden einsperren (Auftrag 10.11.2026).
 */
function unerreichbare(
  datei: string,
  alle: readonly Ausloeser[],
  frei: (x: number, y: number) => boolean,
  uebergaenge: readonly string[],
  stege: readonly { readonly von: readonly Kachelort[]; readonly nach: Kachelort }[],
): string[] {
  const starts = (uebergaenge.length > 0 ? uebergaenge : ["start"]).flatMap((n) => {
    const feld = alle.find((a) => a.name === n);
    return feld ? [feld] : [];
  });
  const befunde: string[] = [];
  for (const ziel of alle) {
    if (uebergaenge.includes(ziel.name) || ziel.name === "start") continue;
    const um = [ziel, ...NACHBARN.map((n) => ({ x: ziel.x + n.x, y: ziel.y + n.y }))];
    const erreicht = starts.some(
      (s) => um.some((u) => u.x === s.x && u.y === s.y) || wegMitStegen(frei, s, um, stege),
    );
    if (starts.length > 0 && !erreicht) {
      befunde.push(`${datei} ${ziel.name} (${ziel.x}, ${ziel.y}): nicht erreichbar`);
    }
  }
  return befunde;
}

/** Was mit dieser Sperrung noch zu erreichen ist: Namen der Übergänge, Figuren und Gegenstände. */
function erreichteNamen(
  frei: (x: number, y: number) => boolean,
  alle: readonly Ausloeser[],
  uebergaenge: readonly string[],
  stege: readonly { readonly von: readonly Kachelort[]; readonly nach: Kachelort }[],
): Set<string> {
  const starts: Kachelort[] = (uebergaenge.length > 0 ? uebergaenge : ["start"]).flatMap((n) => {
    const feld = alle.find((a) => a.name === n);
    return feld ? [feld] : [];
  });
  let flaeche = erreichbar(frei, starts);
  // Stege auf derselben Karte: Wer den einen betritt, kommt am anderen an.
  for (let neu = true; neu;) {
    neu = false;
    for (const steg of stege) {
      const betreten = steg.von.some((f) => flaeche.has(`${f.x},${f.y}`));
      if (betreten && !flaeche.has(`${steg.nach.x},${steg.nach.y}`)) {
        starts.push(steg.nach);
        neu = true;
      }
    }
    if (neu) flaeche = erreichbar(frei, starts);
  }
  const namen = new Set<string>();
  for (const a of alle) {
    // Einen Übergang muss man betreten, alles andere erreicht man auch von davor.
    const um = uebergaenge.includes(a.name)
      ? [a]
      : [a, ...NACHBARN.map((n) => ({ x: a.x + n.x, y: a.y + n.y }))];
    if (um.some((u) => frei(u.x, u.y) && flaeche.has(`${u.x},${u.y}`))) namen.add(a.name);
  }
  return namen;
}

/**
 * Statisten und Tiere, die irgendwo auf ihrem Laufweg etwas versperren (Wunsch des Autors,
 * 10.11.2026: „Eine Figur darf nie den Weg auf Dauer versperren“). Jeder wird einzeln auf jede
 * Kachel seines Laufwegs gestellt, alle anderen bleiben an ihrem Platz; was dann nicht mehr zu
 * erreichen ist, ist ein Befund. Alle Laufwege zugleich zu sperren wäre zu streng: Ein Radfahrer
 * auf der Straße wäre dann eine Mauer über die ganze Karte.
 */
function versperrer(
  datei: string,
  karte: Tiledkarte,
  alle: readonly Ausloeser[],
  gesperrt: ReadonlySet<string>,
  uebergaenge: readonly string[],
  stege: readonly { readonly von: readonly Kachelort[]; readonly nach: Kachelort }[],
): string[] {
  const ohne = begehbar(karte, gesperrt);
  const inKarte = (x: number, y: number) => x >= 0 && y >= 0 && x < karte.width && y < karte.height;
  const vorher = erreichteNamen(ohne, alle, uebergaenge, stege);
  const befunde: string[] = [];
  for (const w of laufwege(karte, KACHEL)) {
    const verloren = new Set<string>();
    const start = `${w.start.x},${w.start.y}`;
    for (const f of w.felder) {
      // Dieselbe Sperrung, nur dieser eine steht jetzt auf (f.x, f.y) statt an seinem Platz.
      const frei = (x: number, y: number) =>
        !(x === f.x && y === f.y) && (ohne(x, y) || (`${x},${y}` === start && inKarte(x, y)));
      const noch = erreichteNamen(frei, alle, uebergaenge, stege);
      for (const n of vorher) if (!noch.has(n)) verloren.add(n);
    }
    if (verloren.size > 0) {
      befunde.push(
        `${datei}: ${w.name} versperrt auf seinem Laufweg ${[...verloren].sort().join(", ")}`,
      );
    }
  }
  return befunde;
}

const NACHBARN = [
  { x: 0, y: -1 },
  { x: 0, y: 1 },
  { x: -1, y: 0 },
  { x: 1, y: 0 },
];

describe("Übergänge zu Fuß", () => {
  it(
    "jeder Übergang ist von jeder Ankunft erreichbar und löst aus; jede Figur ist erreichbar",
    () => {
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
    },
    ZEITGRENZE_MS,
  );

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

/**
 * Prüfung aller Reiseankünfte (Befunde der Funktionstests, 15.11.2026: In Cedar Creek stand der
 * Held nach der Monatskarte hinter dem Wartehäuschen, nur sein Haarschopf war zu sehen; in
 * Lockport war von der Ankunft aus die halbe Stadt nicht zu erreichen).
 *
 * Reisen sind die Monatskarte (oberwelt/reiseziele.ts: erste Außenkarte der Stadt, Auslöser
 * „start“) und jeder Aufruf `reise("karte", "ausloeser")` in den Dialogen (Bus, Fähre, Lastkahn,
 * Zug, Uhr). Für jede Fassung der Zielkarte gilt:
 * 1. Der Held kommt an (der Auslöser fehlt nicht) und steht auf einem freien Feld.
 * 2. Er ist zu sehen: Kein Möbelbild mit größerer Zeichentiefe deckt sein Feld oder das Feld
 *    darüber (ankunft.ts, verdeckendesMoebel).
 * 3. Er erreicht zu Fuß alles, was ein Spieler erreicht, der von einer anderen Stadt oder einem
 *    Weg her zu Fuß ankommt; hat die Karte keinen solchen Eingang, alles auf der Karte. Stege auf
 *    derselben Karte mit Bedingung (Lockport, Sperre S3) zählen als zu: Die offene Fassung ist eine
 *    eigene Karte und wird eigens geprüft. In Lockport ist das Südufer (Gasthaus, Kai, Boote, Pumpe)
 *    deshalb vor Imogens Tafel weder zu Fuß noch mit der Monatskarte zu erreichen; beide kommen am
 *    Kanalweg an, die Tafel liegt auf dieser Seite (Geschichte: docs/spiel/14, Sperre S3).
 * Gelesen werden die Tiled-Karten, orte.json, die Möbellisten und die Dialoge aus inhalte/abenteuer.
 */
import { readdirSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { liesAusloeser, type Ausloeser } from "./ausloeserebene";
import { ankunftsort, verdeckendesMoebel, type Ankunft } from "./ankunft";
import { laufwege, sperrkacheln, type Sperrangabe, type Tiledkarte } from "./begehbar";
import { freiMitMitte } from "./mittenkacheln";
import { erreichbar, type Kachelort } from "./uebergangslauf";

const KACHEL = 16;
/** Alle Karten mit allen Fassungen brauchen einige Sekunden. */
const ZEITGRENZE_MS = 60000;
const INHALTE = new URL("../../../../inhalte/abenteuer/", import.meta.url);
/** Name des Einstiegs, auf dem die Monatskarte ankommt (kern.ts, Oberwelt.tsx). */
const START = "start";
/** `reise("karte", "ausloeser")` in einer Ink-Datei. */
const REISEAUFRUF = /reise\(\s*"([^"]+)"\s*,\s*"([^"]+)"\s*\)/g;

const NACHBARN = [
  { x: 0, y: -1 },
  { x: 0, y: 1 },
  { x: -1, y: 0 },
  { x: 1, y: 0 },
];

function lies<T>(pfad: string): T {
  return JSON.parse(readFileSync(new URL(pfad, INHALTE), "utf8")) as T;
}

interface Regel {
  readonly name: string;
  readonly art: string;
  readonly karte?: string;
  readonly wenn?: string;
  readonly ziel?: { readonly karte: string; readonly ausloeser: string };
}

interface Ortseintrag {
  readonly kennung: string;
  readonly art?: string;
  readonly karten: readonly {
    readonly kennung: string;
    readonly datei: string;
    readonly innen?: boolean;
    readonly zustaende?: Readonly<Record<string, string>>;
  }[];
  readonly ausloeser?: readonly Regel[];
}

/** Eine Reise: Zielkarte, Auslöser und woher sie kommt (für die Meldung). */
interface Reise {
  readonly karte: string;
  readonly ausloeser: string;
  readonly quelle: string;
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
function regel(ort: Ortseintrag, karte: string, name: string): Regel | undefined {
  const passende = (ort.ausloeser ?? []).filter((a) => a.name === name);
  return passende.find((a) => a.karte === karte) ?? passende.find((a) => !a.karte);
}

/** Alle Reisen: Monatskarte in jede Stadt (reiseziele.ts) und jede `reise(…)` in den Dialogen. */
function alleReisen(orte: readonly Ortseintrag[]): Reise[] {
  const monatskarte = orte
    .filter((o) => (o.art ?? "stadt") === "stadt")
    .flatMap((o) => {
      const karte = o.karten.find((k) => !k.innen) ?? o.karten[0];
      return karte ? [{ karte: karte.kennung, ausloeser: START, quelle: "Monatskarte" }] : [];
    });
  const ordner = new URL("dialoge/de/", INHALTE);
  const dialoge = readdirSync(ordner)
    .filter((d) => d.endsWith(".ink"))
    .flatMap((datei) =>
      [...readFileSync(new URL(datei, ordner), "utf8").matchAll(REISEAUFRUF)].map((t) => ({
        karte: t[1] ?? "",
        ausloeser: t[2] ?? "",
        quelle: datei,
      })),
    );
  return [...monatskarte, ...dialoge];
}

/** Was von diesen Feldern aus zu erreichen ist (Namen), mit den offenen Stegen der Karte. */
function erreichteNamen(
  frei: (x: number, y: number) => boolean,
  alle: readonly Ausloeser[],
  starts: readonly Kachelort[],
  stege: readonly { readonly von: readonly Kachelort[]; readonly nach: Kachelort }[],
  uebergaenge: readonly string[],
): Set<string> {
  const offen = [...starts];
  let flaeche = erreichbar(frei, offen);
  for (let neu = true; neu;) {
    neu = false;
    for (const steg of stege) {
      const betreten = steg.von.some((f) => flaeche.has(`${f.x},${f.y}`));
      if (betreten && !flaeche.has(`${steg.nach.x},${steg.nach.y}`)) {
        offen.push(steg.nach);
        neu = true;
      }
    }
    if (neu) flaeche = erreichbar(frei, offen);
  }
  const namen = new Set<string>();
  for (const a of alle) {
    // Einen Übergang muss man betreten, alles andere erreicht man auch von davor.
    const um = uebergaenge.includes(a.name)
      ? [a]
      : [a, ...NACHBARN.map((n) => ({ x: a.x + n.x, y: a.y + n.y }))];
    if (um.some((u) => flaeche.has(`${u.x},${u.y}`))) namen.add(a.name);
  }
  return namen;
}

/** Befunde einer Reise auf einer Fassung ihrer Zielkarte. */
function pruefeReise(
  ort: Ortseintrag,
  reise: Reise,
  datei: string,
  moebel: Record<string, Sperrangabe>,
): string[] {
  const wo = `${reise.quelle} → ${reise.karte}/${reise.ausloeser} (${datei})`;
  const karte = lies<Tiledkarte>(datei);
  const an: Ankunft | null = ankunftsort(karte, moebel, reise.ausloeser, KACHEL);
  if (!an) return [`${wo}: Auslöser fehlt`];
  const gesperrt = sperrkacheln(karte, moebel, KACHEL);
  for (const w of laufwege(karte, KACHEL)) gesperrt.add(`${w.start.x},${w.start.y}`);
  // Kollision fein: Kacheln, auf denen die Mitte des Helden steht, sind begehbar (mittenkacheln.ts).
  const frei = freiMitMitte(karte, moebel, KACHEL, gesperrt);
  const befunde: string[] = [];
  if (!frei(an.x, an.y) || an.aufAusloeser)
    befunde.push(`${wo}: Feld (${an.x}, ${an.y}) ist nicht frei`);
  const decker = verdeckendesMoebel(karte, moebel, an, KACHEL);
  if (decker) befunde.push(`${wo}: Held auf (${an.x}, ${an.y}) steht hinter ${decker}`);
  const alle = liesAusloeser(
    karte.layers.flatMap((e) => e.objects ?? []),
    KACHEL,
  );
  const felderVon = (name: string) => alle.filter((a) => a.name === name && a.typ === "ausloeser");
  const uebergaenge = [...new Set(alle.map((a) => a.name))].filter(
    (n) => regel(ort, reise.karte, n)?.art === "uebergang",
  );
  const eigene = new Set(ort.karten.map((k) => k.kennung));
  const stege = uebergaenge.flatMap((n) => {
    const r = regel(ort, reise.karte, n);
    const nach =
      r?.ziel?.karte === reise.karte && !r.wenn ? felderVon(r.ziel.ausloeser)[0] : undefined;
    return nach ? [{ von: felderVon(n), nach }] : [];
  });
  // Eingänge zu Fuß von außerhalb des Ortes: Übergänge, deren Ziel eine Karte eines anderen Ortes ist.
  const eingaenge = uebergaenge
    .filter((n) => {
      const ziel = regel(ort, reise.karte, n)?.ziel?.karte;
      return ziel !== undefined && !eigene.has(ziel);
    })
    .flatMap((n) => {
      const e = ankunftsort(karte, moebel, n, KACHEL);
      return e ? [e] : [];
    });
  const pflichtStarts = eingaenge.length > 0 ? eingaenge : uebergaenge.flatMap(felderVon);
  const pflicht = erreichteNamen(frei, alle, pflichtStarts, stege, uebergaenge);
  const erreicht = erreichteNamen(frei, alle, [an], stege, uebergaenge);
  const fehlt = [...pflicht].filter((n) => n !== START && !erreicht.has(n)).sort();
  if (fehlt.length > 0) befunde.push(`${wo}: nicht erreichbar: ${fehlt.join(", ")}`);
  return befunde;
}

describe("Reiseankünfte", () => {
  it(
    "jede Reise kommt sichtbar auf einem freien Feld an und erreicht alles, was man zu Fuß erreicht",
    () => {
      const orte = lies<{ orte: Ortseintrag[] }>("orte.json").orte;
      const moebel = moebelliste();
      const reisen = alleReisen(orte);
      // Zahl der Reisen ist kein Selbstzweck: Sie zeigt, dass Monatskarte und Dialoge gelesen sind.
      expect(reisen.filter((r) => r.quelle === "Monatskarte").length).toBeGreaterThan(10);
      expect(reisen.filter((r) => r.quelle !== "Monatskarte").length).toBeGreaterThan(10);
      const befunde: string[] = [];
      for (const reise of reisen) {
        const ort = orte.find((o) => o.karten.some((k) => k.kennung === reise.karte));
        const k = ort?.karten.find((x) => x.kennung === reise.karte);
        if (!ort || !k) {
          befunde.push(`${reise.quelle} → ${reise.karte}: Karte unbekannt`);
          continue;
        }
        for (const datei of [k.datei, ...Object.values(k.zustaende ?? {})]) {
          befunde.push(...pruefeReise(ort, reise, datei, moebel));
        }
      }
      expect([...new Set(befunde)]).toEqual([]);
    },
    ZEITGRENZE_MS,
  );

  it("erkennt einen Helden hinter einem Möbelbild", () => {
    const karte: Tiledkarte = {
      width: 6,
      height: 6,
      layers: [
        { type: "objectgroup", objects: [{ name: "haeuschen", type: "moebel", x: 16, y: 16 }] },
      ],
    };
    const moebel = { haeuschen: { breite: 48, hoehe: 48 } };
    // Unterkante 64, Tiefe 56: Auf (2, 2) (Tiefe 40) steht der Held dahinter, auf (2, 3) davor,
    // auf (2, 4) ist er ganz zu sehen, rechts daneben auch.
    expect(verdeckendesMoebel(karte, moebel, { x: 2, y: 2 }, KACHEL)).toBe("haeuschen");
    expect(verdeckendesMoebel(karte, moebel, { x: 2, y: 4 }, KACHEL)).toBeNull();
    expect(verdeckendesMoebel(karte, moebel, { x: 4, y: 2 }, KACHEL)).toBeNull();
  });
});

/**
 * Dauertest Zeichentiefe des Helden (Befund des Autors, 25.11.2026: „verschwinde hinter dem Haus“)
 * über alle Karten: An jeder Stelle, an der der Held stehen kann, liegt er vor jedem festen Möbel,
 * vor dem oder neben dem er steht, und unter jedem, hinter dem er steht (heldtiefe.ts). Gezählt
 * werden Stellen, an denen sich beides widerspricht. Dort bleibt die alte Reihenfolge (Fußpunkt).
 * Widersprüche entstehen, wo eine einzige Tiefe nicht reicht: zwei Möbel mit gleicher Tiefe, hinter
 * dem einen und neben dem anderen (Ende einer Zaunreihe), oder hinter einem kleinen Möbel und
 * zugleich neben einem großen mit größerer Tiefe (hinter dem Kaktus neben dem Saloon). Ihre Zahl
 * je Karte steht in heldtiefe.obergrenzen.json und darf nur sinken (Ziel 0).
 * Die Stellen kommen aus der Begehbarkeit in Zellen von 4 Pixeln (mittenkacheln.ts, sperrzellen),
 * wie der Held im Spiel an den Physik-Rechtecken anstößt.
 */
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { hatKollision, type Sperrangabe, type Tiledkarte } from "./begehbar";
import { ZELLEN } from "./feinsperren";
import {
  heldtiefe,
  stehtDahinter,
  tiefenmoebel,
  tiefenquellen,
  type Bildrechteck,
  type Tiefenmoebel,
} from "./heldtiefe";
import { sperrzellen } from "./mittenkacheln";
import type { Moebel } from "./moebel";
import { formAus, geformtAusObjekt, hatForm } from "./moebelform";

const KACHEL = 16;
const ZELLE = KACHEL / ZELLEN;
/** Der Held in Zellen (12 Pixel) und sein Bild um den Fußpunkt (großzügig, PixelLab 2/3). */
const KOERPER = 3;
const BILD_HALB = 10;
const BILD_OBEN = 28;
const BILD_UNTEN = 10;
/** Der Lauf über alle Karten braucht einige Sekunden. */
const ZEITGRENZE_MS = 120000;
const INHALTE = new URL("../../../../inhalte/abenteuer/", import.meta.url);

/** Obergrenze der Widersprüche je Karte (Stand 25.11.2026, darf nur sinken). */
const GRENZDATEI = new URL("./heldtiefe.obergrenzen.json", import.meta.url);
const OBERGRENZEN = JSON.parse(readFileSync(GRENZDATEI, "utf8")) as Readonly<
  Record<string, number>
>;

type Katalogangabe = Sperrangabe & { readonly art?: string };
const katalog: Record<string, Katalogangabe> = {};
for (const datei of readdirSync(new URL("moebel/", INHALTE))) {
  if (!datei.endsWith(".json")) continue;
  const inhalt = readFileSync(new URL(`moebel/${datei}`, INHALTE), "utf8");
  Object.assign(katalog, (JSON.parse(inhalt) as { moebel: Record<string, Katalogangabe> }).moebel);
}

/** Die festen Möbel einer Karte mit ihrer Tiefe wie in der Szene (moebel.ts, ladeMoebel). */
function moebelDer(karte: Tiledkarte): Tiefenmoebel[] {
  const quellen = karte.layers.flatMap((e) =>
    (e.objects ?? []).flatMap((o) => {
      const roh = o.type === "moebel" && o.name ? katalog[o.name] : undefined;
      if (!roh || !o.name) return [];
      const angabe = geformtAusObjekt(roh, o.properties);
      const eigen = o.properties?.find((p) => p.name === "tiefe")?.value;
      const form = hatForm(formAus(o.properties)) ? { form: formAus(o.properties) } : {};
      const lage = { name: o.name, x: o.x ?? 0, y: o.y ?? 0, angabe, ...form };
      const kollision = hatKollision(o.properties);
      // Je Bildteil eine Quelle (teilbereiche.ts: Veranda mit eigener Tiefe), wie in der Szene.
      return tiefenquellen(
        { ...lage, ...(typeof eigen === "number" ? { tiefe: eigen } : {}) } as Moebel,
        KACHEL,
      ).map((q) => ({ ...q, ...(kollision === undefined ? {} : { kollision }) }));
    }),
  );
  return tiefenmoebel(quellen, KACHEL);
}

/** Bild des Helden um seinen Fußpunkt. */
function heldbild(x: number, y: number): Bildrechteck {
  return {
    x: x - BILD_HALB,
    y: y - BILD_OBEN,
    breite: 2 * BILD_HALB,
    hoehe: BILD_OBEN + BILD_UNTEN,
  };
}

/** Widersprüche einer Karte: Stellen, an denen die Regel kein Ergebnis findet. */
function widersprueche(karte: Tiledkarte): string[] {
  const zu = sperrzellen(karte, katalog, KACHEL);
  const frei = (sx: number, sy: number) => {
    for (let i = 0; i < KOERPER * KOERPER; i++) {
      if (zu.has(`${sx + (i % KOERPER)},${sy + Math.floor(i / KOERPER)}`)) return false;
    }
    return sx >= 0 && sy >= 0;
  };
  const moebel = moebelDer(karte);
  const funde = new Set<string>();
  for (const m of moebel) {
    for (
      let sy = Math.floor(m.bild.y / ZELLE) - KOERPER;
      sy * ZELLE < m.bild.y + m.bild.hoehe + BILD_OBEN;
      sy++
    ) {
      for (
        let sx = Math.floor(m.bild.x / ZELLE) - KOERPER;
        sx * ZELLE < m.bild.x + m.bild.breite;
        sx++
      ) {
        if (!frei(sx, sy)) continue;
        const x = sx * ZELLE + (KOERPER * ZELLE) / 2;
        const y = sy * ZELLE + (KOERPER * ZELLE) / 2;
        const ergebnis = heldtiefe(x, y, heldbild(x, y), moebel, KACHEL);
        if (ergebnis.widerspruch) funde.add(`${m.name} bei (${x}, ${y})`);
      }
    }
  }
  return [...funde];
}

describe("Zeichentiefe des Helden über alle Karten", () => {
  it(
    "Vor und neben festen Möbeln oben, dahinter unten: kein Widerspruch",
    { timeout: ZEITGRENZE_MS },
    () => {
      const befunde: string[] = [];
      const neu: Record<string, number> = {};
      for (const datei of readdirSync(new URL("karten/", INHALTE))) {
        if (!datei.endsWith(".json")) continue;
        const karte = JSON.parse(
          readFileSync(new URL(`karten/${datei}`, INHALTE), "utf8"),
        ) as Tiledkarte;
        const funde = widersprueche(karte);
        if (funde.length > 0) neu[datei] = funde.length;
        if (funde.length > (OBERGRENZEN[datei] ?? 0))
          befunde.push(`${datei}: ${funde.slice(0, 3).join("; ")} (${funde.length})`);
      }
      // Neue Obergrenzen nur nach einer Verbesserung: HELDTIEFE_SCHREIBEN=1 npx vitest run …
      if (process.env.HELDTIEFE_SCHREIBEN) writeFileSync(GRENZDATEI, JSON.stringify(neu, null, 2));
      expect(befunde).toEqual([]);
    },
  );

  it("Maple Falls: neben dem Zaunpfahl zwischen den Villen über dem Pfahl", () => {
    const karte = JSON.parse(
      readFileSync(new URL("karten/maple-falls-aussen.json", INHALTE), "utf8"),
    ) as Tiledkarte;
    const moebel = moebelDer(karte);
    // Fußpunkt links neben dem Pfahl bei (160, 320) (Sperrzellen x 168 bis 176), oberhalb seiner
    // Tiefe 328 (Foto 25.11.2026: der Pfahl deckte die rechte Hälfte des Helden).
    const x = 162;
    const y = 324;
    const pfahl = moebel.find((m) => m.name === "mf4ZaunSeite" && m.bild.y === 320);
    expect(pfahl?.tiefe).toBe(328);
    if (!pfahl) return;
    expect(stehtDahinter(pfahl, x, y, KACHEL)).toBe(false);
    expect(heldtiefe(x, y, heldbild(x, y), moebel, KACHEL).tiefe).toBeGreaterThan(pfahl.tiefe);
  });
});

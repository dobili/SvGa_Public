/**
 * Dauertest Tiere im Weg (Befund des Autors, 25.11.2026) über alle Karten:
 * 1. Kein Tier am Boden versperrt den Weg auf Dauer: Von jedem Feld seines Laufwegs aus findet es
 *    für den Helden auf jedem freien Nachbarfeld ein freies Feld (2 bis 4 weiter, eng eins), wohin
 *    es beim Verscheuchen oder Drängen ausweicht (tierweg.ts, verscheuchziel). Eingeklemmt (rundum
 *    Busch, Wasser, Zaun) lässt es den Helden durch (DURCHLASS_S); solche Wegfelder zählt
 *    EINGEKLEMMT_HOECHSTENS (Stand 25.11.2026, darf nur sinken).
 * 2. Kein Tier beginnt oder endet seinen Weg auf einem Feld mit Sitz- oder Liegestelle oder Figur.
 *    Ausnahmen mit Grund in AUSNAHMEN.
 */
import { readdirSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { begehbar, sperrkacheln, type Sperrangabe, type Tiledkarte } from "./begehbar";
import { liesBelebung, type Feld } from "./belebung";
import { geformtAusObjekt } from "./moebelform";
import { scharGroesse, scharversatz } from "./tiere";
import { amBoden, festeFelder, landeplatz, verscheuchziel } from "./tierweg";

const KACHEL = 16;
const INHALTE = new URL("../../../../inhalte/abenteuer/", import.meta.url);
const NACHBARN: readonly Feld[] = [
  { x: 0, y: -1 },
  { x: 0, y: 1 },
  { x: -1, y: 0 },
  { x: 1, y: 0 },
];
/** Wegenden auf Sitz oder Figur mit Grund („datei:name“ → Grund). */
const AUSNAHMEN: Readonly<Record<string, string>> = {
  "capital-arena-aussen.json:eichhoernchen":
    "Weg von (55, 44) an der Bank: das Hörnchen kehrt vorher um (belegt, tierweg.ts)",
  "silicon-bay-aussen.json:staubsaugerroboter":
    "Weg beginnt an Rosies Platz (12, 64): der Roboter kehrt vor ihr um (belegt, tierweg.ts)",
};
/** Wegfelder, auf denen ein Tier nur noch durchlassen kann (Stand 25.11.2026, darf nur sinken). */
const EINGEKLEMMT_HOECHSTENS = 18;

type Katalogangabe = Sperrangabe & { readonly art?: string };
const katalog: Record<string, Katalogangabe> = {};
for (const datei of readdirSync(new URL("moebel/", INHALTE))) {
  if (!datei.endsWith(".json")) continue;
  const inhalt = readFileSync(new URL(`moebel/${datei}`, INHALTE), "utf8");
  Object.assign(katalog, (JSON.parse(inhalt) as { moebel: Record<string, Katalogangabe> }).moebel);
}

/** Die Felder des Laufwegs: erst waagerecht, dann senkrecht (wie belebungsbewegung.ts, geheZu). */
function laufweg(von: Feld, bis: Feld): Feld[] {
  const felder: Feld[] = [];
  for (let x = von.x; x !== bis.x; x += Math.sign(bis.x - von.x)) felder.push({ x, y: von.y });
  for (let y = von.y; y !== bis.y; y += Math.sign(bis.y - von.y)) felder.push({ x: bis.x, y });
  return [...felder, bis];
}

/** Sitz- und Liegestellen und Figuren einer Karte (wie szene.ts für tierweg.ts). */
function feste(karte: Tiledkarte): Set<string> {
  const objekte = karte.layers.flatMap((e) => e.objects ?? []);
  const moebel = objekte.flatMap((o) => {
    const roh = o.type === "moebel" && o.name ? katalog[o.name] : undefined;
    return roh ? [{ x: o.x ?? 0, y: o.y ?? 0, angabe: geformtAusObjekt(roh, o.properties) }] : [];
  });
  const figuren = objekte
    .filter((o) => o.type === "figur")
    .map((o) => ({
      typ: "figur",
      x: Math.floor((o.x ?? 0) / KACHEL),
      y: Math.floor((o.y ?? 0) / KACHEL),
    }));
  return festeFelder(moebel, figuren, KACHEL);
}

function befundeDer(
  datei: string,
  karte: Tiledkarte,
): { befunde: string[]; eingeklemmt: string[] } {
  const frei = begehbar(karte, sperrkacheln(karte, katalog, KACHEL));
  const besetzt = feste(karte);
  const tierfrei = (x: number, y: number) => frei(x, y) && !besetzt.has(`${x},${y}`);
  const befunde: string[] = [];
  const eingeklemmt: string[] = [];
  for (const v of liesBelebung(karte).filter(amBoden)) {
    for (const ende of AUSNAHMEN[`${datei}:${v.name}`] ? [] : [v.von, v.bis]) {
      if (besetzt.has(`${ende.x},${ende.y}`))
        befunde.push(`${datei}: ${v.name} auf Sitz oder Figur (${ende.x}, ${ende.y})`);
    }
    for (const f of laufweg(v.von, v.bis)) {
      for (const n of NACHBARN) {
        const held = { x: f.x + n.x, y: f.y + n.y };
        if (!tierfrei(held.x, held.y)) continue;
        // Das Feld des Helden ist für das Tier belegt.
        const ohneHeld = (x: number, y: number) => tierfrei(x, y) && (x !== held.x || y !== held.y);
        if (!verscheuchziel(f, held, ohneHeld, () => 0)) {
          eingeklemmt.push(
            `${datei}: ${v.name} auf (${f.x}, ${f.y}), Held auf (${held.x}, ${held.y})`,
          );
          break;
        }
      }
    }
  }
  return { befunde, eingeklemmt };
}

describe("Tiere im Weg über alle Karten", () => {
  it("kein Tier versperrt auf Dauer, keins wohnt auf Sitz oder Figur", () => {
    const befunde: string[] = [];
    const eingeklemmt: string[] = [];
    for (const datei of readdirSync(new URL("karten/", INHALTE))) {
      if (!datei.endsWith(".json")) continue;
      const karte = JSON.parse(
        readFileSync(new URL(`karten/${datei}`, INHALTE), "utf8"),
      ) as Tiledkarte;
      const ergebnis = befundeDer(datei, karte);
      befunde.push(...ergebnis.befunde);
      eingeklemmt.push(...ergebnis.eingeklemmt);
    }
    expect(befunde).toEqual([]);
    expect(eingeklemmt.length, eingeklemmt.join("\n")).toBeLessThanOrEqual(EINGEKLEMMT_HOECHSTENS);
  });
});

describe("Vögel über alle Karten (25.11.2026 abends: Taube auf Juno)", () => {
  it("jeder Landeplatz einer Schar auf Mensch oder Sitz hat ein freies Feld daneben", () => {
    const befunde: string[] = [];
    for (const datei of readdirSync(new URL("karten/", INHALTE))) {
      if (!datei.endsWith(".json")) continue;
      const karte = JSON.parse(
        readFileSync(new URL(`karten/${datei}`, INHALTE), "utf8"),
      ) as Tiledkarte;
      const besetzt = feste(karte);
      const mensch = (x: number, y: number) => besetzt.has(`${x},${y}`);
      for (const v of liesBelebung(karte).filter((b) => b.verhalten === "fliegen")) {
        for (let i = 0; i < scharGroesse(v.name); i++) {
          const versatz = scharversatz(i);
          for (const ende of [v.von, v.bis]) {
            const feld = { x: ende.x + versatz.x, y: ende.y + versatz.y };
            if (mensch(feld.x, feld.y) && !landeplatz(feld, true, mensch, () => true))
              befunde.push(`${datei}: ${v.name} ohne Landeplatz bei (${feld.x}, ${feld.y})`);
          }
        }
      }
    }
    expect(befunde).toEqual([]);
  });
});

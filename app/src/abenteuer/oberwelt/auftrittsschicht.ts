/**
 * Auftritte in der Szene (Regeln in regeln/auftritt.ts): Beim Aufbau einer Karte, auf der der Held
 * geblieben ist (nach einer Partie, Runde oder einem Gespräch), kommen neue Figuren durch den
 * nächsten Übergang herein und gehen zu ihrem Feld; Figuren, deren Bedingung nicht mehr gilt, gehen
 * von dort, wo sie zuletzt standen, hinaus. Wartende stehen unsichtbar am Übergang, bis ein `#gehe`
 * sie holt (auftrittsbild.ts, fuehrungsschicht.ts).
 *
 * Warum: Befund des Autors (26.11.2026): Nach der gewonnenen Partie gegen den Coach standen Hale und
 * {rivale} plötzlich im Raum. Wer dazukommt, soll man hereinkommen sehen.
 * Die Wege beginnen erst, wenn die Oberwelt sie freigibt (`gibFrei`, Oberwelt.tsx): solange die
 * Ergebniskarte der Partie offen ist, sähe man sie nicht. Wartende stehen sofort an ihrem Platz.
 * Sonderfälle: Sitzende und Liegende gehen nicht; sie blenden an ihrem Platz ein oder aus. Ohne
 * Übergang auf der Karte ebenso.
 * Rolle im Gesamtbild: Teil der Szene (szene.ts). Abhängigkeiten: Phaser, auftrittsbild.ts,
 * fuehrungsschicht.ts, regeln/auftritt.ts, sitzrichtung.ts, zuwendungsschicht.ts.
 */
import Phaser from "phaser";
import { eingangsfeld, type Auftrittsfeld, type Auftrittsplan } from "../regeln/auftritt";
import type { Sichtfeld } from "../regeln/sichtsperre";
import {
  AUFTRITT,
  BLENDE_MS,
  GEGANGEN,
  gehtHinaus,
  lasseWarten,
  rueckeAusloeser,
  uebergangsfelder,
} from "./auftrittsbild";
import { fuehre, type Fuehrungszugang } from "./fuehrungsschicht";
import { LIEGT } from "./sitzrichtung";
import { SITZT } from "./zuwendungsschicht";

/** Was die Szene für die Auftritte bekommt: der Plan und der Übergang je Figur (orte.json `von`). */
export interface Szenenauftritt {
  readonly plan: Auftrittsplan;
  readonly von: Readonly<Record<string, string>>;
}

/** So lange (ms) steht die Karte still, bevor die erste Figur hereinkommt: erst sehen, dann gehen. */
const VERZUG_MS = 400;

/** Eine Figur der Karte (Sprite mit Namen), oder null. */
function figurNamens(z: Fuehrungszugang, name: string): Phaser.Physics.Arcade.Sprite | null {
  const figur = z.szene.children.getByName(name);
  return figur instanceof Phaser.Physics.Arcade.Sprite ? figur : null;
}

/** Das Feld des Auslösers einer Figur (ihr Platz auf der Karte), oder null. */
function platz(z: Fuehrungszugang, name: string): Auftrittsfeld | null {
  const a = z.ausloeser.find((x) => x.name === name && x.typ === "figur");
  return a ? { x: a.x, y: a.y } : null;
}

/** Sitzt oder liegt die Figur? Dann geht sie nicht, sie blendet nur. */
const ruht = (figur: Phaser.GameObjects.Sprite) =>
  figur.getData(SITZT) === true || figur.getData(LIEGT) === true;

/** Blendet eine Figur an ihrem Platz ein (ohne Weg). */
function blendeEin(z: Fuehrungszugang, figur: Phaser.GameObjects.Sprite): void {
  const deckkraft = figur.alpha;
  figur.setAlpha(0);
  z.szene.tweens.add({ targets: figur, alpha: deckkraft, duration: BLENDE_MS });
}

/** Die Auftritte einer Szene: Wartende gleich aufstellen, Wege nach der Freigabe. */
export class Auftrittsschicht {
  private begonnen = false;
  /** Vergebene Felder am Übergang („x,y“), damit zwei Figuren nicht im selben Feld erscheinen. */
  private readonly belegt = new Set<string>();

  constructor(
    private readonly z: Fuehrungszugang,
    private readonly auftritt: Szenenauftritt | undefined,
  ) {
    for (const name of auftritt?.plan.wartend ?? []) this.warte(name);
    // Wer kommt, ist bis zu seinem Weg nicht zu sehen; wer geht, steht schon dort, wo er zuletzt war.
    for (const name of auftritt?.plan.kommen ?? []) figurNamens(z, name)?.setAlpha(0);
    for (const { name, feld } of auftritt?.plan.gehen ?? []) this.stelleZurueck(name, feld);
  }

  /** Eine Gehende steht wieder dort, wo sie beim Abbau stand (etwa nach ihrem `#gehe`). */
  private stelleZurueck(name: string, feld: Auftrittsfeld): void {
    const figur = figurNamens(this.z, name);
    if (figur && !ruht(figur)) this.stelle(figur, feld, name);
  }

  /** Die Oberwelt gibt die Wege frei (keine Ergebniskarte mehr davor); einmal je Szene. */
  gibFrei(): void {
    if (this.begonnen) return;
    this.begonnen = true;
    this.z.szene.time.delayedCall(VERZUG_MS, () => this.beginne());
  }

  private eingang(name: string, ziel: Auftrittsfeld): Auftrittsfeld | null {
    const feld = eingangsfeld(
      ziel,
      uebergangsfelder(this.z),
      this.auftritt?.von[name],
      this.belegt,
    );
    if (feld) this.belegt.add(`${feld.x},${feld.y}`);
    return feld;
  }

  private warte(name: string): void {
    const figur = figurNamens(this.z, name);
    const ziel = platz(this.z, name);
    const feld = ziel ? this.eingang(name, ziel) : null;
    if (figur && feld) lasseWarten(this.z, figur, feld);
  }

  private beginne(): void {
    for (const name of this.auftritt?.plan.kommen ?? []) this.komm(name);
    for (const { name } of this.auftritt?.plan.gehen ?? []) this.geh(name);
  }

  /** Erscheint am Übergang und geht zum eigenen Platz (oder blendet dort ein). */
  private komm(name: string): void {
    const figur = figurNamens(this.z, name);
    const ziel = platz(this.z, name);
    if (!figur || !ziel) return;
    const feld = ruht(figur) ? null : this.eingang(name, ziel);
    if (!feld) return blendeEin(this.z, figur.setAlpha(1));
    this.stelle(figur, feld);
    // Erst den Weg, dann die Marke: Ein `#gehe` aus dem Dialog bricht den Weg ab (trittHervor).
    const weg = fuehre(this.z, { wer: name, ziel: { feld: ziel } });
    figur.setData(AUFTRITT, "kommt");
    this.z.szene.tweens.add({ targets: figur, alpha: 1, duration: BLENDE_MS });
    void weg.then(() => {
      if (figur.getData(AUFTRITT) !== "kommt") return;
      figur.setData(AUFTRITT, undefined);
      // Kein Weg frei (der Held steht in der Tür): Sie steht dann an ihrem Platz, nicht in der Tür.
      const hier = platz(this.z, name);
      if (hier && (hier.x !== ziel.x || hier.y !== ziel.y)) this.stelle(figur, ziel, name);
    });
  }

  /** Stellt eine Figur auf ein Feld, mit Körper und (mit Namen) Auslöser. */
  private stelle(figur: Phaser.Physics.Arcade.Sprite, feld: Auftrittsfeld, name?: string): void {
    figur.setPosition((feld.x + 0.5) * this.z.kachel, (feld.y + 0.5) * this.z.kachel);
    figur.setDepth(figur.y);
    if (figur.body instanceof Phaser.Physics.Arcade.StaticBody) figur.body.updateFromGameObject();
    if (name) rueckeAusloeser(this.z, name, feld);
  }

  /** Geht zum nächsten Übergang hinaus (oder blendet am Platz aus). */
  private geh(name: string): void {
    const figur = figurNamens(this.z, name);
    if (!figur) return;
    const hier = platz(this.z, name);
    const von = this.auftritt?.von[name];
    const feld = hier && !ruht(figur) ? eingangsfeld(hier, uebergangsfelder(this.z), von) : null;
    if (!feld) {
      void gehtHinaus(this.z, figur);
      return;
    }
    const tuer = uebergangsfelder(this.z).find((u) => u.x === feld.x && u.y === feld.y);
    void fuehre(this.z, { wer: name, ziel: tuer ? { name: tuer.name } : { feld } });
  }
}

/**
 * Richtet die Auftritte einer Szene ein (in create(), szene.ts); ohne Zugang (kein Held) null.
 * `frei`: Die Oberwelt hat die Wege schon freigegeben, bevor die Szene stand.
 */
export function richteAuftritteEin(
  z: Fuehrungszugang | null,
  daten: { readonly auftritt?: Szenenauftritt },
  frei: boolean,
): Auftrittsschicht | null {
  if (!z) return null;
  const schicht = new Auftrittsschicht(z, daten.auftritt);
  if (frei) schicht.gibFrei();
  return schicht;
}

/** Was die Szene beim Abbau über ihre Figuren weiß (auftrittsgedaechtnis.ts). */
export interface Szenenaufstellung {
  readonly figuren: Map<string, Auftrittsfeld>;
  /** Bildausschnitt der Kamera in Kacheln (regeln/sichtsperre.ts). */
  readonly sicht: Sichtfeld;
}

/**
 * Wer auf der Karte sichtbar steht und wo (für das Gedächtnis der Auftritte, beim Abbau der Szene):
 * das Feld des Auslösers, der nach einem `#gehe` mitrückt (fuehrungsschicht.ts). Wartende und
 * Hinausgegangene zählen nicht. Dazu der Bildausschnitt für die Sichtsperre.
 * Beispiel: Hale nach seinem `#gehe` auf 18,5.
 */
export function aufgestellteFiguren(z: Fuehrungszugang | null): Szenenaufstellung | null {
  if (!z) return null;
  const figuren = new Map<string, Auftrittsfeld>();
  for (const a of z.ausloeser) {
    if (a.typ !== "figur") continue;
    const figur = figurNamens(z, a.name);
    if (!figur?.visible || figur.getData(GEGANGEN) === true) continue;
    if (figur.getData(AUFTRITT) === "wartet") continue;
    figuren.set(a.name, { x: a.x, y: a.y });
  }
  const blick = z.szene.cameras.main.worldView;
  const sicht = {
    x: blick.x / z.kachel,
    y: blick.y / z.kachel,
    breite: blick.width / z.kachel,
    hoehe: blick.height / z.kachel,
  };
  return { figuren, sicht };
}

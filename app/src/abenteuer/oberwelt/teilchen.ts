/**
 * Teilchen über der Karte (Atmosphäre T8): Staub im Licht, Sternschnuppen, Nebelschwaden und der
 * Schnee der Winterkarten. Je Szene höchstens eine Art.
 *
 * Rolle im Gesamtbild: Die Szene (szene.ts) zeigt beim Aufbau die Teilchen der Karte (orte.json
 * `teilchen`, Winter: Schnee); ein Dialog wechselt sie mit `#teilchen:staub` bis zum Dialogende
 * (oberwelt/useBuehne.ts). Die Schicht hängt sich an das update-Ereignis der Szene, damit szene.ts
 * nicht wächst. Bewegung: teilchenbahn.ts.
 * Abhängigkeiten: Phaser, teilchenbahn.ts, schneefall.ts.
 */
import type Phaser from "phaser";
import { Schneeschicht } from "./schneefall";
import {
  bewegeTeilchen,
  funkeln,
  HOECHSTENS_TEILCHEN,
  naechsteSchnuppe,
  neuerNebel,
  neuerStaub,
  SCHNUPPE_DAUER_S,
  type Schnuppe,
  type Teilchen,
} from "./teilchenbahn";

export type Teilchenart = "schnee" | "staub" | "sternschnuppen" | "nebel";
const ARTEN: readonly Teilchenart[] = ["schnee", "staub", "sternschnuppen", "nebel"];

/** Über der Tönung (200000), unter dem Schnee nicht nötig: je Szene nur eine Art. */
const TIEFE = 300000;
const STAUB_FARBE = 0xfff1c8;
const STAUB_DECKKRAFT = 0.6;
const NEBEL_FARBE = 0xe8eef0;
const NEBEL_DECKKRAFT = 0.12;
const SCHNUPPE_FARBE = 0xffffff;
/** Länge des Schweifs und Weg der Sternschnuppe (Anteile des Bildausschnitts). */
const SCHNUPPE_SCHWEIF = 0.06;
const SCHNUPPE_WEG = 0.25;
const MS_JE_S = 1000;

/** Ist der Wert eine bekannte Teilchenart? */
export function istTeilchenart(wert: unknown): wert is Teilchenart {
  return typeof wert === "string" && (ARTEN as readonly string[]).includes(wert);
}

interface Schicht {
  aktualisiere(deltaMs: number): void;
  zerstoere(): void;
}

/** Staub oder Nebel: Teilchen, die wandern, als Rechtecke oder weiche Ellipsen. */
class Treibschicht implements Schicht {
  private readonly grafik: Phaser.GameObjects.Graphics;
  private sekunden = 0;
  constructor(
    private readonly szene: Phaser.Scene,
    private readonly art: "staub" | "nebel",
    private readonly teilchen: Teilchen[],
  ) {
    this.grafik = szene.add.graphics().setDepth(TIEFE);
  }
  aktualisiere(deltaMs: number): void {
    const dt = deltaMs / MS_JE_S;
    this.sekunden += dt;
    bewegeTeilchen(this.teilchen, dt);
    const sicht = this.szene.cameras.main.worldView;
    this.grafik.clear();
    for (const t of this.teilchen) {
      const x = sicht.x + t.x * sicht.width;
      const y = sicht.y + t.y * sicht.height;
      if (this.art === "staub") {
        this.grafik.fillStyle(STAUB_FARBE, STAUB_DECKKRAFT * funkeln(t, this.sekunden));
        this.grafik.fillRect(x, y, t.groesse, t.groesse);
      } else {
        this.grafik.fillStyle(NEBEL_FARBE, NEBEL_DECKKRAFT);
        this.grafik.fillEllipse(x, y, t.groesse * 2, t.groesse);
      }
    }
  }
  zerstoere(): void {
    this.grafik.destroy();
  }
}

/** Sternschnuppen: selten ein kurzer heller Strich schräg nach unten. */
class Schnuppenschicht implements Schicht {
  private readonly grafik: Phaser.GameObjects.Graphics;
  private schnuppe: Schnuppe | null = null;
  constructor(private readonly szene: Phaser.Scene) {
    this.grafik = szene.add.graphics().setDepth(TIEFE);
  }
  aktualisiere(deltaMs: number): void {
    this.schnuppe = naechsteSchnuppe(this.schnuppe, deltaMs / MS_JE_S, Math.random);
    this.grafik.clear();
    const s = this.schnuppe;
    if (!s) return;
    const sicht = this.szene.cameras.main.worldView;
    const weg = (s.alter / SCHNUPPE_DAUER_S) * SCHNUPPE_WEG;
    const kopfX = sicht.x + (s.x + weg) * sicht.width;
    const kopfY = sicht.y + (s.y + weg / 2) * sicht.height;
    this.grafik.lineStyle(1, SCHNUPPE_FARBE, 1 - s.alter / SCHNUPPE_DAUER_S);
    this.grafik.lineBetween(
      kopfX - SCHNUPPE_SCHWEIF * sicht.width,
      kopfY - (SCHNUPPE_SCHWEIF / 2) * sicht.height,
      kopfX,
      kopfY,
    );
  }
  zerstoere(): void {
    this.grafik.destroy();
  }
}

/** Die Schicht einer Art. */
function baue(szene: Phaser.Scene, art: Teilchenart): Schicht {
  if (art === "schnee") return new Schneeschicht(szene);
  if (art === "sternschnuppen") return new Schnuppenschicht(szene);
  if (art === "staub")
    return new Treibschicht(szene, art, neuerStaub(HOECHSTENS_TEILCHEN, Math.random));
  return new Treibschicht(szene, art, neuerNebel(Math.random));
}

/** Je Szene: laufende Schicht, ihr Abmelder und die Art der Karte (für das Dialogende). */
const jeSzene = new WeakMap<
  Phaser.Scene,
  { schicht: Schicht | null; abmelden: () => void; karte: Teilchenart | null }
>();

/** Entfernt die laufende Schicht einer Szene. */
function entferne(szene: Phaser.Scene): void {
  const alt = jeSzene.get(szene);
  alt?.abmelden();
  alt?.schicht?.zerstoere();
}

/**
 * Zeigt Teilchen der Art in der Szene (null: keine). `karte: true` merkt sie als Art der Karte,
 * zu der `zeigeKartenteilchen` zurückkehrt. Beispiel: Dachboden mit Staub im Lichtstreifen.
 */
export function zeigeTeilchen(szene: Phaser.Scene, art: Teilchenart | null, karte = false): void {
  const bekannt = jeSzene.get(szene);
  const vorher = bekannt?.karte ?? null;
  entferne(szene);
  // Beim ersten Mal: Beim Verlassen der Szene räumt die Schicht sich selbst weg.
  if (!bekannt) szene.events.once("shutdown", () => entferne(szene));
  const schicht = art ? baue(szene, art) : null;
  const takt = (_zeit: number, delta: number) => schicht?.aktualisiere(delta);
  szene.events.on("update", takt);
  const abmelden = () => szene.events.off("update", takt);
  jeSzene.set(szene, { schicht, abmelden, karte: karte ? art : vorher });
}

/** Zurück zu den Teilchen der Karte (Dialogende nach `#teilchen`). */
export function zeigeKartenteilchen(szene: Phaser.Scene): void {
  zeigeTeilchen(szene, jeSzene.get(szene)?.karte ?? null);
}

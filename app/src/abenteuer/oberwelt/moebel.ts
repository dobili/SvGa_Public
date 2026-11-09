/**
 * Möbel und Schmuck der Karten (inhalte/abenteuer/moebel.json): Objekte vom Typ „moebel“ in der
 * Ebene ausloeser, gezeichnet als Bild aus dem Paket (gekaufte Grafik oder Platzhalter), mit
 * Kollision auf der unteren Fläche (alles außer der obersten Kachelreihe).
 *
 * Rolle im Gesamtbild: Laden (weltdaten.ts) und Aufstellen (szene.ts) der Möbel, ausgelagert, damit
 * beide Dateien klein bleiben. Die Pipeline prüft dieselbe Regel (pipeline/abenteuer/karten.py,
 * moebelfelder), damit kein Möbel einen Auslöser zustellt.
 * Abhängigkeiten: Phaser, paket/paketlader.ts.
 */
import Phaser from "phaser";
import { liesPaketJson, paketdateiAlsAdresse } from "../paket/paketlader";

/** Eine Angabe aus moebel.json. */
export interface Moebelangabe {
  readonly quelle: string;
  readonly breite: number;
  readonly hoehe: number;
  readonly kollision?: boolean;
}

/** Ein Möbel der Karte, bereit zum Zeichnen. */
export interface Moebel {
  readonly name: string;
  /** Linke obere Ecke in Kartenpixeln. */
  readonly x: number;
  readonly y: number;
  readonly angabe: Moebelangabe;
  readonly adresse: string;
}

let angaben: Promise<Readonly<Record<string, Moebelangabe>>> | null = null;

/** Die Möbel einer Tiled-Karte mit Bildadressen; unbekannte Namen werden übergangen. */
export async function ladeMoebel(karte: object): Promise<Moebel[]> {
  angaben ??= liesPaketJson<{ moebel: Record<string, Moebelangabe> }>("daten/moebel.json")
    .then((d) => d.moebel)
    .catch(() => ({}));
  const liste = await angaben;
  const ebenen = (karte as { layers?: readonly { objects?: readonly unknown[] }[] }).layers ?? [];
  const objekte = ebenen.flatMap((e) => e.objects ?? []) as {
    name?: string;
    type?: string;
    x?: number;
    y?: number;
  }[];
  const moebel = await Promise.all(
    objekte
      .filter((o) => o.type === "moebel" && o.name && liste[o.name])
      .map(async (o) => {
        const name = o.name ?? "";
        const adresse = await paketdateiAlsAdresse(`moebel/${name}.png`).catch(() => null);
        const angabe = liste[name];
        return adresse && angabe ? { name, x: o.x ?? 0, y: o.y ?? 0, angabe, adresse } : null;
      }),
  );
  return moebel.filter((m) => m !== null);
}

/** Lädt die Bilder der Möbel in eine Szene (Schlüssel `moebel:<name>`). */
export function ladeMoebelbilder(szene: Phaser.Scene, moebel: readonly Moebel[]): void {
  for (const m of moebel) {
    if (!szene.textures.exists(`moebel:${m.name}`)) szene.load.image(`moebel:${m.name}`, m.adresse);
  }
}

/**
 * Stellt die Möbel auf: Tiefe nach der unteren Kante (Figuren davor oder dahinter), Kollision auf
 * der Fläche unter der obersten Kachelreihe. Ausgabe: die Gruppe für den Zusammenstoß mit dem Helden.
 */
export function stelleMoebelAuf(
  szene: Phaser.Scene,
  moebel: readonly Moebel[],
  kachel: number,
): Phaser.Physics.Arcade.StaticGroup {
  const gruppe = szene.physics.add.staticGroup();
  for (const m of moebel) {
    const bild = szene.add.image(m.x, m.y, `moebel:${m.name}`).setOrigin(0, 0);
    bild.setDepth(m.y + m.angabe.hoehe - kachel / 2);
    if (!m.angabe.kollision) continue;
    const oben = m.angabe.hoehe > kachel ? kachel : 0;
    const flaeche = szene.add.zone(m.x, m.y + oben, m.angabe.breite, m.angabe.hoehe - oben);
    flaeche.setOrigin(0, 0);
    gruppe.add(flaeche);
  }
  gruppe.refresh();
  return gruppe;
}

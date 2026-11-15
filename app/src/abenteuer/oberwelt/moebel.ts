/**
 * Möbel und Schmuck der Karten (Quellen: inhalte/abenteuer/moebel/<ort>.json, im Paket als eine
 * daten/moebel.json zusammengeführt von skripte/baue-abenteuerpaket.mjs): Objekte vom Typ „moebel“ in der
 * Ebene ausloeser, gezeichnet als Bild aus dem Paket (gekaufte Grafik oder Platzhalter), mit
 * Kollision auf der unteren Fläche (alles außer der obersten Kachelreihe und den Reihen
 * `frei_unten`, die unten begehbar bleiben) oder nach einer eigenen `maske` je Kachel.
 *
 * Bilder: Seit dem 15.11.2026 liegen die Möbel je Ortsdatei auf einem Bogen
 * (moebelboegen/<ortsdatei>-<n>.webp, skripte/moebelboegen.mjs); `bogen` und `rahmen` in
 * moebel.json sagen, wo. Die Szene lädt jeden Bogen einmal und schneidet die Möbel als Rahmen aus
 * (Phaser-Frames). Ein Paket von vorher (ohne `bogen`) liefert weiter Einzelbilder moebel/<name>.png.
 *
 * Rolle im Gesamtbild: Laden (weltdaten.ts) und Aufstellen (szene.ts) der Möbel, ausgelagert, damit
 * beide Dateien klein bleiben. Die Pipeline prüft dieselbe Regel (pipeline/abenteuer/karten.py,
 * moebelfelder), damit kein Möbel einen Auslöser zustellt.
 * Abhängigkeiten: Phaser, paket/paketlader.ts.
 */
import type Phaser from "phaser";
import { liesPaketJson, paketdateiAlsAdresse } from "../paket/paketlader";
import { formAus, geformt, hatForm, type Moebelform } from "./moebelform";

/** Eine Angabe aus daten/moebel.json im Paket. */
export interface Moebelangabe {
  readonly quelle: string;
  readonly breite: number;
  readonly hoehe: number;
  readonly kollision?: boolean;
  /** Begehbare Kachelreihen am unteren Bildrand (Gang vor dem Motel, Veranda). */
  readonly frei_unten?: number;
  /** Eigene Sperrmaske je Kachelreihe, „#“ sperrt (offenes Tor, Mammutbaum); ersetzt die Regel oben. */
  readonly maske?: readonly string[];
  /** Name des Bogens im Paket (moebelboegen/<bogen>.png), seit den Möbelbögen. */
  readonly bogen?: string;
  /** Lage auf dem Bogen: x, y, Breite, Höhe in Pixeln. */
  readonly rahmen?: readonly [number, number, number, number];
}

/** Ein Möbel der Karte, bereit zum Zeichnen. */
export interface Moebel {
  readonly name: string;
  /** Drehung, Spiegelung, Maßstab aus dem Karteneditor (moebelform.ts); `angabe` ist schon geformt. */
  readonly form?: Moebelform;
  /** Linke obere Ecke in Kartenpixeln (des gedrehten Rechtecks). */
  readonly x: number;
  readonly y: number;
  readonly angabe: Moebelangabe;
  /** Adresse des Bildes: der Bogen oder (altes Paket) das Einzelbild. */
  readonly adresse: string;
  /** Texturschlüssel in Phaser: `moebelbogen:<bogen>` oder `moebel:<name>`. */
  readonly schluessel: string;
  /** Mit Bogen: der Rahmen (Frame-Name ist der Möbelname); ohne: das ganze Bild. */
  readonly rahmen?: readonly [number, number, number, number];
  /** Vom Kartenbauer festgelegt: Zeichentiefe und Kollision (an der Wand, auf dem Tisch). */
  readonly tiefe?: number;
  readonly kollision?: boolean;
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
    properties?: readonly { name?: string; value?: unknown }[];
  }[];
  const moebel = await Promise.all(
    objekte
      .filter((o) => o.type === "moebel" && o.name && liste[o.name])
      .map(async (o) => {
        const name = o.name ?? "";
        const roh = liste[name];
        if (!roh) return null;
        const form = formAus(o.properties);
        const angabe = geformt(roh, form);
        const bild = bildquelle(name, roh);
        const adresse = await paketdateiAlsAdresse(bild.pfad).catch(() => null);
        if (!adresse) return null;
        const eigen = (n: string) => o.properties?.find((e) => e.name === n)?.value;
        const tiefe = eigen("tiefe");
        const kollision = eigen("kollision");
        return {
          name,
          x: o.x ?? 0,
          y: o.y ?? 0,
          angabe,
          ...(hatForm(form) ? { form } : {}),
          adresse,
          schluessel: bild.schluessel,
          ...(angabe.rahmen ? { rahmen: angabe.rahmen } : {}),
          ...(typeof tiefe === "number" ? { tiefe } : {}),
          ...(typeof kollision === "boolean" ? { kollision } : {}),
        };
      }),
  );
  return moebel.filter((m) => m !== null);
}

/**
 * Pfad und Texturschlüssel des Bildes eines Möbels: der Bogen, wenn moebel.json ihn nennt, sonst
 * das Einzelbild (Paket von vor den Bögen). Beispiel: sofa auf maple-falls-1 →
 * { pfad: "moebelboegen/maple-falls-1.png", schluessel: "moebelbogen:maple-falls-1" }.
 */
export function bildquelle(
  name: string,
  angabe: Moebelangabe,
): { readonly pfad: string; readonly schluessel: string } {
  if (angabe.bogen && angabe.rahmen) {
    return { pfad: `moebelboegen/${angabe.bogen}.png`, schluessel: `moebelbogen:${angabe.bogen}` };
  }
  return { pfad: `moebel/${name}.png`, schluessel: `moebel:${name}` };
}

/** Lädt die Bilder der Möbel in eine Szene, jeden Bogen nur einmal. */
export function ladeMoebelbilder(szene: Phaser.Scene, moebel: readonly Moebel[]): void {
  const geladen = new Set<string>();
  for (const m of moebel) {
    if (geladen.has(m.schluessel) || szene.textures.exists(m.schluessel)) continue;
    geladen.add(m.schluessel);
    szene.load.image(m.schluessel, m.adresse);
  }
}

/**
 * Schneidet die Möbel als Rahmen aus ihren Bögen (nach dem Laden, vor dem Aufstellen; auch nach
 * dem Umfärben im Winter, das die Textur ersetzt). Ohne Bogen nichts zu tun.
 */
export function richteMoebelrahmenEin(szene: Phaser.Scene, moebel: readonly Moebel[]): void {
  for (const m of moebel) {
    if (!m.rahmen || !szene.textures.exists(m.schluessel)) continue;
    const textur = szene.textures.get(m.schluessel);
    if (!textur.has(m.name)) textur.add(m.name, 0, ...m.rahmen);
  }
}

/** Die Rahmen je Texturschlüssel (für das Umfärben im Winter, winter.ts). */
export function rahmenJeTextur(
  moebel: readonly Moebel[],
): ReadonlyMap<string, readonly (readonly [number, number, number, number])[]> {
  const karte = new Map<string, (readonly [number, number, number, number])[]>();
  for (const m of moebel) {
    const liste = karte.get(m.schluessel) ?? [];
    if (m.rahmen && !liste.includes(m.rahmen)) liste.push(m.rahmen);
    karte.set(m.schluessel, liste);
  }
  return karte;
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
    const bild = szene.add.image(m.x, m.y, m.schluessel, m.rahmen ? m.name : undefined);
    bild.setOrigin(0, 0);
    if (m.form) {
      // Gedreht, gespiegelt oder skaliert (moebelform.ts): um die Mitte des Rechtecks.
      bild.setOrigin(0.5, 0.5);
      bild.setPosition(m.x + m.angabe.breite / 2, m.y + m.angabe.hoehe / 2);
      bild.setScale(m.form.massstab);
      bild.setFlipX(m.form.spiegeln);
      bild.setAngle(m.form.drehung);
    }
    bild.setDepth(m.tiefe ?? m.y + m.angabe.hoehe - kachel / 2);
    if (!(m.kollision ?? m.angabe.kollision)) continue;
    if (m.angabe.maske) {
      // Gleiche Regel wie pipeline/abenteuer/maske.py: je „#“ eine gesperrte Kachel.
      m.angabe.maske.forEach((zeile, reihe) => {
        [...zeile].forEach((zeichen, spalte) => {
          if (zeichen !== "#") return;
          const kachelflaeche = szene.add.rectangle(
            m.x + spalte * kachel + kachel / 2,
            m.y + reihe * kachel + kachel / 2,
            kachel,
            kachel,
          );
          kachelflaeche.setVisible(false);
          gruppe.add(kachelflaeche);
        });
      });
      continue;
    }
    const oben = m.angabe.hoehe > kachel ? kachel : 0;
    // Unsichtbares Rechteck als Körper (ein Rechteck kennt seine Ecken; mit einer Zone saß der
    // Körper versetzt und sperrte Nachbarfelder).
    const hoehe = m.angabe.hoehe - oben - (m.angabe.frei_unten ?? 0) * kachel;
    if (hoehe <= 0) continue;
    const flaeche = szene.add.rectangle(
      m.x + m.angabe.breite / 2,
      m.y + oben + hoehe / 2,
      m.angabe.breite,
      hoehe,
    );
    flaeche.setVisible(false);
    gruppe.add(flaeche);
  }
  gruppe.refresh();
  return gruppe;
}

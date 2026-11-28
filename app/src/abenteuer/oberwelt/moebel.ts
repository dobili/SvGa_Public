/**
 * Möbel und Schmuck der Karten (Quellen: inhalte/abenteuer/moebel/<ort>.json, im Paket als eine
 * daten/moebel.json zusammengeführt von skripte/baue-abenteuerpaket.mjs): Objekte vom Typ „moebel“ in der
 * Ebene ausloeser, gezeichnet als Bild aus dem Paket (gekaufte Grafik oder Platzhalter), mit
 * Kollision auf der unteren Fläche (alles außer der obersten Kachelreihe und den Reihen
 * `frei_unten`, die unten begehbar bleiben) oder nach einer eigenen `maske` je Kachel.
 *
 * Bilder: Seit dem 16.11.2026 liegen die Möbel je Ort auf einem Bogen mit genau den Möbeln
 * seiner Karten (moebelboegen/<ort>-<n>.webp, skripte/abenteuerpaket-moebel.mjs; vorher je
 * Ortsdatei, dann lud eine Karte im Mittel 4,8 Bögen). `bogen` und `rahmen` in moebel.json sagen,
 * wo; ein Möbel mehrerer Orte nennt dazu `jeOrt`. Die Szene lädt jeden Bogen einmal und schneidet
 * die Möbel als Rahmen aus (Phaser-Frames). Ein Paket ohne `bogen` liefert Einzelbilder
 * moebel/<name>.png.
 *
 * Rolle im Gesamtbild: Laden (weltdaten.ts) und Aufstellen (szene.ts) der Möbel, ausgelagert, damit
 * beide Dateien klein bleiben. Die Pipeline prüft dieselbe Regel (pipeline/abenteuer/karten.py,
 * moebelfelder), damit kein Möbel einen Auslöser zustellt.
 * Abhängigkeiten: Phaser, paket/paketlader.ts.
 */
import { moebeltiefe } from "./zeichentiefe";
import { sorte, type Texturteil } from "./jahreszeitfarben";
import type Phaser from "phaser";
import { liesPaketJson, paketdateiAlsAdresse } from "../paket/paketlader";
import { feinsperrenAus, feinsperrRechtecke, moebelRechtecke, type Rechteck } from "./feinsperren";
import { deckkraftAus, formAus, geformtAusObjekt, hatForm, type Moebelform } from "./moebelform";

/** Eine Angabe aus daten/moebel.json im Paket. */
export interface Moebelangabe {
  readonly quelle: string;
  /** Vordergrund eines Sitz- oder Liegemöbels über der Figur (vordergrund.ts): ab, kopf. */
  readonly vordergrund?: { readonly ab?: number; readonly kopf?: number };
  readonly breite: number;
  readonly hoehe: number;
  readonly kollision?: boolean;
  /** Begehbare Kachelreihen am unteren Bildrand (Gang vor dem Motel, Veranda). */
  readonly frei_unten?: number;
  /** Eigene Sperrmaske je Kachelreihe, „#“ sperrt (offenes Tor, Mammutbaum); ersetzt die Regel oben. */
  readonly maske?: readonly string[];
  /** Feine Maske je Kachel 4 × 4 Zellen (Karteneditor 1.6, feinsperren.ts); nur am Kartenobjekt. */
  readonly maske_fein?: readonly string[];
  /** Name des Bogens im Paket (moebelboegen/<bogen>.png), seit den Möbelbögen. */
  readonly bogen?: string;
  /** Lage auf dem Bogen: x, y, Breite, Höhe in Pixeln. */
  readonly rahmen?: readonly [number, number, number, number];
  /** Liegt das Möbel in den Bögen mehrerer Orte: Bogen und Rahmen je Ort (orte.json-Kennung). */
  readonly jeOrt?: Readonly<Record<string, Bogenlage>>;
  /** Art im Katalog („stuhl“, „bank“, …); Sitzmöbel erkennt sitzplatz.ts daran. */
  readonly art?: string;
  /** Blickrichtung eines Sitzmöbels („links“, „unten“ …; sitzplatz.ts, blickDesSitzes). */
  readonly blick?: string;
  /** Waagrechte Anlagen: Seite des Endstücks; bei Betten die Seite des Kopfendes (sitzrichtung.ts). */
  readonly ende?: string;
  /** Sortierlinie in Pixeln ab der Oberkante des Bildes (zeichentiefe.ts, konturkollision.py). */
  readonly sortierlinie?: number;
  /** „boden“: das Bild liegt unter allen Figuren (Treppe, Steg; zeichentiefe.ts BODENTIEFE). */
  readonly ebene?: string;
}

/** Wo ein Möbel auf einem Bogen liegt. */
export interface Bogenlage {
  readonly bogen?: string;
  readonly rahmen?: readonly [number, number, number, number];
}

/**
 * Die Lage eines Möbels für einen Ort: die des Orts, wenn es in mehreren Bögen liegt, sonst die
 * eine. Beispiel: Stuhl in Maple Falls und Riverton, Karte in Riverton → Bogen „riverton-1“.
 */
export function lageFuer(angabe: Moebelangabe, ort?: string): Bogenlage {
  const eigene = ort ? angabe.jeOrt?.[ort] : undefined;
  return eigene ?? { bogen: angabe.bogen, rahmen: angabe.rahmen };
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
  /** Deckkraft 0,25 bis 1 (Karteneditor 1.5, Eigenschaft `deckkraft`); fehlt bei voller Deckkraft. */
  readonly deckkraft?: number;
}

let angaben: Promise<Readonly<Record<string, Moebelangabe>>> | null = null;

/**
 * Die Möbel einer Tiled-Karte mit Bildadressen; unbekannte Namen werden übergangen. `ort` (Kennung
 * aus orte.json) wählt den Bogen des Orts, damit eine Karte nur ihren eigenen Bogen lädt.
 */
export async function ladeMoebel(karte: object, ort?: string): Promise<Moebel[]> {
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
        const angabe = geformtAusObjekt(roh, o.properties);
        const lage = lageFuer(roh, ort);
        const bild = bildquelle(name, lage);
        const adresse = await paketdateiAlsAdresse(bild.pfad).catch(() => null);
        if (!adresse) return null;
        const eigen = (n: string) => o.properties?.find((e) => e.name === n)?.value;
        const tiefe = eigen("tiefe");
        const kollision = eigen("kollision");
        const deckkraft = deckkraftAus(o.properties);
        return {
          name,
          x: o.x ?? 0,
          y: o.y ?? 0,
          angabe,
          ...(hatForm(form) ? { form } : {}),
          adresse,
          schluessel: bild.schluessel,
          ...(lage.bogen && lage.rahmen ? { rahmen: lage.rahmen } : {}),
          ...(typeof tiefe === "number" ? { tiefe } : {}),
          ...(typeof kollision === "boolean" ? { kollision } : {}),
          ...(deckkraft < 1 ? { deckkraft } : {}),
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
  angabe: Bogenlage | Moebelangabe,
): { readonly pfad: string; readonly schluessel: string } {
  if (angabe.bogen && angabe.rahmen) {
    return { pfad: `moebelboegen/${angabe.bogen}.png`, schluessel: `moebelbogen:${angabe.bogen}` };
  }
  return { pfad: `moebel/${name}.png`, schluessel: `moebel:${name}` };
}

/**
 * Lädt die Bilder der Möbel in eine Szene, jeden Bogen nur einmal. Auch schon geladene Bilder gehen
 * an den Lader: Der Texturspeicher (texturanbindung.ts) überspringt sie dort und merkt sich, dass
 * diese Karte sie braucht (sonst verdrängte er sie als unbenutzt).
 */
export function ladeMoebelbilder(szene: Phaser.Scene, moebel: readonly Moebel[]): void {
  const geladen = new Set<string>();
  for (const m of moebel) {
    if (geladen.has(m.schluessel)) continue;
    geladen.add(m.schluessel);
    szene.load.image(m.schluessel, m.adresse);
  }
}

/**
 * Name des Rahmens, den Phaser für ein Möbel zeichnet: mit Zuschnitt ein eigener Rahmen
 * („<name>|zuschnitt:26,0,32,0“), sonst der Rahmen auf dem Bogen oder (ohne Bogen) das ganze Bild.
 */
export function rahmenname(m: Moebel): string | undefined {
  const z = m.form?.zuschnitt;
  if (z) return `${m.name}|zuschnitt:${z.join(",")}`;
  return m.rahmen ? m.name : undefined;
}

/**
 * Schneidet die Möbel als Rahmen aus ihren Bögen (nach dem Laden, vor dem Aufstellen; auch nach
 * dem Umfärben im Winter, das die Textur ersetzt). Ohne Bogen und ohne Zuschnitt nichts zu tun.
 * Zuschnitt (Karteneditor 1.5, moebelzuschnitt.ts): ein eigener, kleinerer Rahmen innerhalb des
 * Möbelrahmens (Wunsch des Autors, 16.11.2026: ein Pfosten aus einem Zaunstück). Warum ein Rahmen
 * statt `setCrop`: Mit dem Rahmen ist das Bild so groß wie der Ausschnitt, Ursprung, Drehung und
 * Spiegeln wirken wie bei jedem anderen Möbel um seine Mitte.
 */
export function richteMoebelrahmenEin(szene: Phaser.Scene, moebel: readonly Moebel[]): void {
  for (const m of moebel) {
    if (!szene.textures.exists(m.schluessel)) continue;
    const textur = szene.textures.get(m.schluessel);
    if (m.rahmen && !textur.has(m.name)) textur.add(m.name, 0, ...m.rahmen);
    const z = m.form?.zuschnitt;
    const name = rahmenname(m);
    if (!z || !name || textur.has(name)) continue;
    const basis = textur.get(m.rahmen ? m.name : undefined);
    const breite = Math.max(1, basis.cutWidth - z[0] - z[2]);
    const hoehe = Math.max(1, basis.cutHeight - z[1] - z[3]);
    textur.add(name, basis.sourceIndex, basis.cutX + z[0], basis.cutY + z[1], breite, hoehe);
  }
}

/**
 * Die Möbel je Texturschlüssel mit Rahmen und Sorte (für das Umfärben nach der Jahreszeit,
 * jahreszeitfarben.ts); jedes Bild nur einmal. Ohne Bogen ist der Rahmen null (ganzes Bild).
 */
export function teileJeTextur(
  moebel: readonly Moebel[],
): ReadonlyMap<string, readonly Texturteil[]> {
  const karte = new Map<string, Texturteil[]>();
  for (const m of moebel) {
    const liste = karte.get(m.schluessel) ?? [];
    const rahmen = m.rahmen ?? null;
    if (!liste.some((t) => t.rahmen === rahmen))
      liste.push({ rahmen, sorte: sorte(m.name, m.angabe.art) });
    karte.set(m.schluessel, liste);
  }
  return karte;
}

/**
 * Stellt die Möbel auf: Tiefe nach der unteren Kante (Figuren davor oder dahinter), Kollision auf
 * der Fläche unter der obersten Kachelreihe; mit `karte` dazu deren feine Sperren (feinsperren.ts).
 * `merke` bekommt jedes Bild mit seinem Möbel (für den Vordergrund über Sitzenden, vordergrund.ts).
 * Ausgabe: die Gruppe für den Zusammenstoß mit dem Helden.
 */
export function stelleMoebelAuf(
  szene: Phaser.Scene,
  moebel: readonly Moebel[],
  kachel: number,
  karte?: object,
  merke?: (m: Moebel, bild: Phaser.GameObjects.Image) => void,
): Phaser.Physics.Arcade.StaticGroup {
  const gruppe = szene.physics.add.staticGroup();
  for (const m of moebel) {
    const bild = szene.add.image(m.x, m.y, m.schluessel, rahmenname(m));
    bild.setOrigin(0, 0);
    if (m.form) {
      // Gedreht, gespiegelt, skaliert oder beschnitten (moebelform.ts): um die Mitte des Rechtecks;
      // der Zuschnitt steckt schon im Rahmen (richteMoebelrahmenEin).
      bild.setOrigin(0.5, 0.5);
      bild.setPosition(m.x + m.angabe.breite / 2, m.y + m.angabe.hoehe / 2);
      bild.setScale(m.form.massstab);
      bild.setFlipX(m.form.spiegeln);
      bild.setAngle(m.form.drehung);
    }
    if (m.deckkraft !== undefined) bild.setAlpha(m.deckkraft); // nur das Bild, Kollision bleibt
    bild.setDepth(moebeltiefe(m, kachel));
    merke?.(m, bild);
    if (!(m.kollision ?? m.angabe.kollision)) continue;
    if (m.angabe.maske_fein) {
      // Feine Maske (Karteneditor 1.6): zusammengefasste Zellen, der Held stößt an der Kante an.
      fuegeSperrflaechenHinzu(szene, gruppe, moebelRechtecke(m, m.angabe.maske_fein, kachel));
      continue;
    }
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
  // Feine Sperren der Karte (Karteneditor 1.6, Eigenschaft `sperren_fein`) in dieselbe Gruppe:
  // Physik und Sperrkarte (sperrkarte.ts) sehen sie dann wie Möbel.
  const fein = feinsperrenAus(
    (karte as { properties?: readonly Eigenschaft[] } | undefined)?.properties,
  );
  fuegeSperrflaechenHinzu(szene, gruppe, feinsperrRechtecke(fein, kachel));
  gruppe.refresh();
  return gruppe;
}

/** Eine Tiled-Eigenschaft (Name und Wert). */
interface Eigenschaft {
  readonly name?: string;
  readonly value?: unknown;
}

/**
 * Legt unsichtbare Rechtecke als feste Körper in die Gruppe (Möbel mit feiner Maske, feine Sperren
 * der Karte aus `sperren_fein`, feinsperren.ts). Die Sperrkarte der Tiere (sperrkarte.ts) liest
 * dieselbe Gruppe und sperrt jede berührte Kachel.
 */
export function fuegeSperrflaechenHinzu(
  szene: Phaser.Scene,
  gruppe: Phaser.Physics.Arcade.StaticGroup,
  rechtecke: readonly Rechteck[],
): void {
  for (const r of rechtecke) {
    const flaeche = szene.add.rectangle(r.x + r.b / 2, r.y + r.h / 2, r.b, r.h);
    flaeche.setVisible(false);
    gruppe.add(flaeche);
  }
}

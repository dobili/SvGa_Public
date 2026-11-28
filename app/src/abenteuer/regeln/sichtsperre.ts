/**
 * Sichtsperre (Wunsch des Autors, 28.11.2026): Eine Figur, die der Spieler gerade sieht, springt
 * beim Neuaufbau derselben Karte nicht und verschwindet nicht. Fällt sie aus der neuen Aufstellung
 * (Tagesablauf, Ende der Festhaltung durch die Geschichte, Bedingung), geht sie sichtbar durch die
 * nächste Tür hinaus; hätte der Neuaufbau sie auf ein anderes Feld gestellt, bleibt sie, wo sie
 * steht, bis sie außer Sicht ist (beim nächsten Aufbau ohne Blick auf sie steht sie dann am neuen
 * Platz). Figuren außerhalb des Bildes dürfen springen.
 *
 * Warum: „Nach meiner Partie gegen Victoria war plötzlich auch der Coach verschwunden.“ Der
 * Neuaufbau nach der Partie stellte sie nach ihrem Tagesablauf in den Park, mitten in der Szene.
 * Die stehende Aufstellungsstunde (regeln/auftritt.ts, aufstellungsstunde) behebt diesen Fall; die
 * Sichtsperre fängt alle anderen Wege ab, auf denen eine sichtbare Figur versetzt würde (etwa das
 * Ende einer Festhaltung, Regel 1 der Tagesabläufe).
 * Wie: Beim Abbau merkt sich die Oberwelt den Bildausschnitt (Kacheln) und die Objekte der Figuren
 * (oberwelt/useWeltladen.ts). Beim Aufbau vergleicht `mitSichtsperre` die neue Tiled-Karte damit.
 * Rolle im Gesamtbild: reine Regel ohne Phaser für oberwelt/weltdaten.ts; das Hinausgehen selbst
 * macht die Auftrittsschicht (oberwelt/auftrittsschicht.ts) wie bei jeder gehenden Figur.
 * Abhängigkeiten: regeln/auftritt.ts (nur Typen).
 */
import type { Aufstellung, Auftrittsfeld } from "./auftritt";

/** Der sichtbare Ausschnitt der Kamera in Kacheln (links, oben, Breite, Höhe). */
export interface Sichtfeld {
  readonly x: number;
  readonly y: number;
  readonly breite: number;
  readonly hoehe: number;
}

/** Ein Figurenobjekt der Tiled-Karte (Pixel), soweit die Sichtsperre es liest und schreibt. */
export interface Figurobjekt {
  readonly name?: unknown;
  readonly type?: unknown;
  readonly x?: number;
  readonly y?: number;
  readonly properties?: readonly { readonly name?: unknown; readonly value?: unknown }[];
}

/** Die Figurenobjekte einer Tiled-Karte (für das Gedächtnis der Auftritte, Sichtsperre). */
export function figurobjekte(karte: object): Figurobjekt[] {
  const ebenen = (karte as { layers?: readonly { objects?: readonly Figurobjekt[] }[] }).layers;
  return (ebenen ?? []).flatMap((e) =>
    (e.objects ?? []).filter((o) => o.type === "figur" && typeof o.name === "string"),
  );
}

/** Rand um den Ausschnitt (Kacheln): Wer halb im Bild steht, zählt als sichtbar. */
export const SICHTRAND = 1;
const KACHEL = 16;

/**
 * Steht ein Feld im Bild (Ausschnitt plus Rand)?
 * Beispiel: Ausschnitt 10,0 bis 21,15, Feld 15,4 → ja; Feld 30,4 → nein.
 */
export function imBild(feld: Auftrittsfeld, sicht: Sichtfeld, rand = SICHTRAND): boolean {
  return (
    feld.x >= Math.floor(sicht.x) - rand &&
    feld.x < Math.ceil(sicht.x + sicht.breite) + rand &&
    feld.y >= Math.floor(sicht.y) - rand &&
    feld.y < Math.ceil(sicht.y + sicht.hoehe) + rand
  );
}

/** Feld eines Objekts in Kacheln. */
const feldVon = (o: Figurobjekt): Auftrittsfeld => ({
  x: Math.floor((o.x ?? 0) / KACHEL),
  y: Math.floor((o.y ?? 0) / KACHEL),
});

/**
 * Das Objekt, mit dem eine sichtbare Figur auf ihrem alten Feld steht: das gemerkte, wenn es dort
 * stand (Sitzen, Blick bleiben), sonst stehend ohne Zustand (sie war mit `#gehe` dorthin gegangen).
 */
function objektAuf(name: string, feld: Auftrittsfeld, gemerkt?: Figurobjekt): Figurobjekt {
  if (gemerkt) {
    const alt = feldVon(gemerkt);
    if (alt.x === feld.x && alt.y === feld.y) return { ...gemerkt, name };
  }
  return { name, type: "figur", x: feld.x * KACHEL, y: feld.y * KACHEL, properties: [] };
}

type Ebene = { readonly name?: string; readonly objects?: readonly Figurobjekt[] };

/** Was die Sichtsperre ergibt: die Karte und die Figuren, die nur zum Hinausgehen bleiben. */
export interface Sichtsperre<T> {
  readonly karte: T;
  readonly gehend: readonly string[];
}

/**
 * Wendet die Sichtsperre auf eine neu aufgestellte Karte an.
 * Eingaben: Tiled-Karte nach Bedingungen, Uhr und Begleitern; die gemerkte Aufstellung; Kennung;
 * Namen, für die die Sperre nicht gilt (Begleiter gehen mit dem Helden, Geister blenden selbst).
 * Ausgabe: Karte (fehlende sichtbare Figuren wieder auf ihrem Feld, versetzte zurück) und die
 * wieder hingestellten Namen, die hinausgehen sollen.
 * Beispiel: Coach Delgado stand im Bild auf 15,4 und fehlt jetzt → sie steht auf 15,4 und geht.
 * Sonderfall: andere Karte, nichts gemerkt oder ohne Ausschnitt → Karte unverändert.
 */
export function mitSichtsperre<T extends object>(
  karte: T,
  vorher: Aufstellung | null,
  kennung: string,
  ausgenommen: ReadonlySet<string> = new Set(),
): Sichtsperre<T> {
  const ebenen = (karte as { layers?: readonly Ebene[] }).layers;
  const sicht = vorher?.sicht;
  if (!ebenen || !vorher || !sicht || vorher.karte !== kennung) return { karte, gehend: [] };
  const sichtbar = [...vorher.figuren].filter(
    ([name, feld]) => !ausgenommen.has(name) && imBild(feld, sicht),
  );
  const zurueck = new Map(sichtbar);
  const gehend: string[] = [];
  const geaendert = ebenen.map((e) => {
    if (!e.objects) return e;
    const objekte = e.objects.map((o) => {
      const feld = typeof o.name === "string" ? zurueck.get(o.name) : undefined;
      if (o.type !== "figur" || !feld || typeof o.name !== "string") return o;
      zurueck.delete(o.name);
      const jetzt = feldVon(o);
      return jetzt.x === feld.x && jetzt.y === feld.y
        ? o
        : objektAuf(o.name, feld, vorher.objekte?.get(o.name));
    });
    return { ...e, objects: objekte };
  });
  // Wer jetzt ganz fehlt, steht wieder da und geht hinaus (in der Ebene der Auslöser).
  const fehlend = [...zurueck].map(([name, feld]) => {
    gehend.push(name);
    return objektAuf(name, feld, vorher.objekte?.get(name));
  });
  const auslosend = geaendert.findIndex((e) => e.name === "ausloeser");
  const ziel = auslosend >= 0 ? auslosend : geaendert.findIndex((e) => e.objects !== undefined);
  const layers = geaendert.map((e, i) =>
    i === ziel && fehlend.length > 0 ? { ...e, objects: [...(e.objects ?? []), ...fehlend] } : e,
  );
  return { karte: { ...karte, layers }, gehend };
}

/**
 * Tagesabläufe der Figuren (Wunsch des Autors, 22.11.2026): Beim Betreten einer Karte stellt die
 * Uhr die Figuren auf. Wer arbeitet, steht an seinem Platz; nach Feierabend sitzt er auf einer Bank,
 * nachts im Diner, drei Stunden schläft er (unsichtbar oder im Bett). Kinder sind von 21 bis 7 Uhr
 * zu Hause.
 *
 * Regel 1 (Hauptchat): Die Geschichte geht vor. Ist eine Figur Ziel eines laufenden Questschritts
 * (Pfeilziel, Gesprächspartner, Gegner) oder steht eine ihrer Szenenvarianten gerade mit erfüllter
 * Bedingung (`wenn` in orte.json, etwa Mama vor dem Haus in der Einleitung), bleibt sie wie in der
 * Szene: wach, an ihrem Platz. So entsteht nie eine Sackgasse, und niemand muss warten.
 *
 * Gewechselt wird nur beim Kartenaufbau (die Uhr fragt dann `stundeJetzt`), nie vor den Augen des
 * Spielers. Die Daten (inhalte/abenteuer/tagesablaeufe.json) erzeugt und prüft die Pipeline
 * (pipeline/abenteuer/tagesablauf_entwurf.py, tagesablauf.py).
 * Rolle im Gesamtbild: reine Regel wie regeln/figurbedingung.ts, für oberwelt/weltdaten.ts.
 * Abhängigkeiten: regeln/bedingung.ts.
 */
import { erfuellt } from "./bedingung";

/** Ein Block des Tages: von bis bis (ausschließlich, über Mitternacht möglich), ohne Karte unsichtbar. */
export interface Ablaufblock {
  readonly art: string;
  readonly von: number;
  readonly bis: number;
  readonly karte?: string;
  readonly feld?: readonly number[];
  readonly tut?: string;
}

/** Ablauf einer Person aus tagesablaeufe.json (nur, was die App braucht). */
export interface Tagesablauf {
  readonly ort?: string;
  readonly bloecke?: readonly Ablaufblock[];
  readonly folgt_geschichte?: boolean;
}

/** Die Datei tagesablaeufe.json. */
export interface Tagesablaeufe {
  readonly figuren: Readonly<Record<string, Tagesablauf>>;
}

/** Eine Figur aus orte.json, soweit diese Regel sie liest. */
export interface Ortsfigur {
  readonly kennung: string;
  readonly sprite: string;
  readonly wenn?: string;
}

const STUNDEN_JE_TAG = 24;
const KACHEL = 16;

/** Liegt `stunde` im Block? Beispiel: 23 bis 2 enthält 0; 0 bis 0 ist der ganze Tag. */
export function imBlock(block: Pick<Ablaufblock, "von" | "bis">, stunde: number): boolean {
  const laenge = (block.bis - block.von + STUNDEN_JE_TAG) % STUNDEN_JE_TAG || STUNDEN_JE_TAG;
  return (stunde - block.von + STUNDEN_JE_TAG) % STUNDEN_JE_TAG < laenge;
}

/** Der Block einer Person zur Stunde, oder null (ohne Ablauf). */
export function blockZur(ablauf: Tagesablauf | undefined, stunde: number): Ablaufblock | null {
  return ablauf?.bloecke?.find((b) => imBlock(b, stunde)) ?? null;
}

/** Name der Person zu einer Figur: Bild ohne Ordner und Endung, wie die Pipeline zählt. */
function bildname(sprite: string): string {
  return sprite.slice(sprite.lastIndexOf("/") + 1).replace(/\.png$/, "");
}

/**
 * Objektname der Figur (ohne Ort) → Person mit Ablauf. Die Daten nennen Personen mit dem Namen aus
 * Dokument 25 („skaterJo“), die Bilder heißen anders („skater-jo.png“); deshalb zählt jede
 * Kennung, deren Name oder Bild zu einer Person passt. Beispiel: carlaClub → carla.
 */
export function personenDerFiguren(
  figuren: readonly Ortsfigur[],
  ablaeufe: Tagesablaeufe,
): Map<string, string> {
  const nachBild = new Map<string, string>();
  for (const f of figuren) {
    const name = f.kennung.slice(f.kennung.indexOf(".") + 1);
    if (ablaeufe.figuren[name]) nachBild.set(bildname(f.sprite), name);
  }
  const zuordnung = new Map<string, string>();
  for (const f of figuren) {
    const person = nachBild.get(bildname(f.sprite));
    if (person) zuordnung.set(f.kennung.slice(f.kennung.indexOf(".") + 1), person);
  }
  return zuordnung;
}

/**
 * Personen, die die Geschichte gerade festhält (Regel 1): Ziel eines laufenden Questschritts oder
 * eine Variante mit `wenn`, deren Bedingung gilt. Eingaben: Figuren des Orts, Zuordnung,
 * Objektnamen der Ziele (zielsuche.ts) und Dialogvariablen.
 */
export function festgehaltene(
  figuren: readonly Ortsfigur[],
  zuordnung: ReadonlyMap<string, string>,
  ziele: ReadonlySet<string>,
  variablen: Readonly<Record<string, unknown>>,
): Set<string> {
  const fest = new Set<string>();
  for (const f of figuren) {
    const name = f.kennung.slice(f.kennung.indexOf(".") + 1);
    const person = zuordnung.get(name);
    if (!person) continue;
    if (ziele.has(name) || (f.wenn !== undefined && erfuellt(f.wenn, variablen))) fest.add(person);
  }
  return fest;
}

/** Objekt einer Tiled-Objektebene, soweit diese Regel es liest und schreibt. */
interface Kartenobjekt {
  readonly name?: unknown;
  readonly type?: unknown;
  readonly x?: number;
  readonly y?: number;
  readonly properties?: readonly { readonly name?: unknown; readonly value?: unknown }[];
}

/** Ein neues Figurenobjekt für die Karte (Pixelkoordinaten wie im Kartenbau). */
function figurobjekt(name: string, block: Ablaufblock): Kartenobjekt {
  const [x = 0, y = 0] = block.feld ?? [];
  const eigenschaften = block.tut?.startsWith("sitzt")
    ? [{ name: "sitzt", value: "unten" }]
    : block.tut === "liegt"
      ? [{ name: "liegt", value: true }]
      : [];
  return { name, type: "figur", x: x * KACHEL, y: y * KACHEL, properties: eigenschaften };
}

/** Trägt das Objekt einen Zustand oder ein Standbild aus dem Editor (oberwelt/figurzustand.ts)? */
function hatEditorzustand(o: Kartenobjekt): boolean {
  return (o.properties ?? []).some((p) => p.name === "zustand" || p.name === "standbild");
}

/** Was die Aufstellung braucht: Karte, Stunde, Zuordnung, Festgehaltene und Abläufe. */
export interface Aufstellung {
  readonly karte: string;
  readonly stunde: number;
  readonly zuordnung: ReadonlyMap<string, string>;
  readonly fest: ReadonlySet<string>;
  readonly ablaeufe: Tagesablaeufe;
}

/**
 * Die Tiled-Karte nach der Uhr: Figuren mit Ablauf (nicht festgehalten) verlassen ihren Szenenplatz
 * und stehen dort, wo ihr Block zur Stunde sie hinstellt (auf dieser Karte oder gar nicht).
 * Beispiel: 13 Uhr, Boateng arbeitet im Waschsalon; 19 Uhr sitzt er draußen auf einer Bank; 1 Uhr
 * schläft er (unsichtbar). Festgehaltene und Figuren ohne Ablauf bleiben, wie die Szene sie stellt.
 */
export function nachTagesablauf<T extends object>(karte: T, a: Aufstellung): T {
  const ebenen = (
    karte as { layers?: readonly { name?: string; objects?: readonly Kartenobjekt[] }[] }
  ).layers;
  if (!ebenen) return karte;
  const ort = a.karte.slice(0, a.karte.indexOf("."));
  // Nur im Heimatort zählt die Uhr; anderswo stellt die Geschichte die Person hin (Mama in Ironwood).
  const hier = (person: string): boolean => a.ablaeufe.figuren[person]?.ort === ort;
  const beweglich = (o: Kartenobjekt): boolean => {
    if (o.type !== "figur" || typeof o.name !== "string") return false;
    const person = a.zuordnung.get(o.name);
    return (
      person !== undefined &&
      hier(person) &&
      !a.fest.has(person) &&
      !!a.ablaeufe.figuren[person]?.bloecke
    );
  };
  // Steht der Block auf dem Feld der Szene, gilt dort das Objekt der Szene mit Zustand,
  // Standbild und Versatz aus dem Editor (Karteneditor 1.9); sonst stellt der Ablauf die Figur hin.
  const szenenobjekte = ebenen.flatMap((e) => e.objects ?? []).filter(beweglich);
  const neu: Kartenobjekt[] = [];
  for (const [person, ablauf] of Object.entries(a.ablaeufe.figuren)) {
    if (a.fest.has(person)) continue;
    const block = blockZur(ablauf, a.stunde);
    if (block?.karte !== a.karte || !block.feld) continue;
    const ersatz = figurobjekt(person, block);
    const eigenes = szenenobjekte.find(
      (o) =>
        a.zuordnung.get(String(o.name)) === person &&
        o.x === ersatz.x &&
        o.y === ersatz.y &&
        hatEditorzustand(o),
    );
    neu.push(eigenes ? { ...eigenes, name: person } : ersatz);
  }
  let eingefuegt = false;
  const gefiltert = ebenen.map((e) => {
    if (!e.objects) return e;
    const objekte = e.objects.filter((o) => !beweglich(o));
    if (e.name !== "ausloeser" || eingefuegt) return { ...e, objects: objekte };
    eingefuegt = true;
    return { ...e, objects: [...objekte, ...neu] };
  });
  return { ...karte, layers: gefiltert };
}

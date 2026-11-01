/**
 * Lage aller Züge einer Variante auf der Karte („Mindmap“): Spalte je Halbzug, Zeile je Ast.
 *
 * Rolle im Gesamtbild: Wunsch des Autors zum Variantenbaum (1.11.2026): „Zusätzlich eine auf
 * einer extra Seite öffnende Darstellung des Baums als in alle Richtungen scrollbare
 * Karte/Mindmap“. Die Karte (ui/bildschirme/Variantenkarte.tsx) zeichnet die Knoten an den hier
 * berechneten Stellen. Regeln: Die Startstellung steht links in Zeile 0; jeder Zug eine Spalte
 * weiter rechts als die Stellung davor. Die erste Fortsetzung bleibt in der Zeile ihres
 * Vorgängers (die Hauptvariante ist also die oberste Zeile), jede weitere Fortsetzung beginnt in
 * der ersten freien Zeile unter allem, was bis dahin liegt. So kreuzen sich die Äste nie: Ein Ast
 * hängt senkrecht unter seinem Abzweig und läuft dann nach rechts. Unter jedem Abzweig bleiben
 * BRETTZEILEN Zeilen frei für das kleine Brett mit den Fortsetzungspfeilen (Wunsch des Autors,
 * 1.11.2026: „an den Abzweigungen auch die konkrete Abzweigstellung mit den blauen Pfeilen“); die
 * weiteren Fortsetzungen beginnen erst darunter.
 * Abhängigkeiten: chessops, schach/notation.ts, schach/variationsbaum.ts, training/variationen.ts.
 * Buchbezug: Kapitel 0, „Wie liest man Schachzüge?“ (Hauptvariante zuerst, „...“ für Schwarz).
 */
import { parseSan } from "chessops/san";
import type { Position } from "chessops/chess";
import type { Variationsknoten, Zugherkunft } from "../training/variationen";
import { sanInSprache } from "./notation";
import { stellungAus, type Pfad, type Zugbaum } from "./variationsbaum";

/** Ein Knoten der Karte; der erste ist die Startstellung (leerer Pfad, ohne Zug). */
export interface Kartenknoten {
  readonly pfad: Pfad;
  readonly spalte: number;
  readonly zeile: number;
  /** Anzeige, etwa „3. Sxe5“, „3... d6“ oder „d6“ (Schwarz mitten in einer Zeile). */
  readonly text: string;
  /** Liegt auf der Hauptvariante der ganzen Variante (immer die erste Fortsetzung). */
  readonly haupt: boolean;
  /** Herkunft; null bei der Startstellung, undefined bei eigenen Zügen. */
  readonly herkunft: Zugherkunft | undefined | null;
  readonly kommentiert: boolean;
  /** Zahl der Fortsetzungen, wenn es mehr als eine gibt; sonst 0. */
  readonly abzweige: number;
}

/** Eine Linie vom Knoten ``von`` zum Knoten ``nach`` (Stellen in der Knotenliste). */
export interface Kartenkante {
  readonly von: number;
  readonly nach: number;
  readonly haupt: boolean;
}

export interface Kartenlayout {
  readonly knoten: readonly Kartenknoten[];
  readonly kanten: readonly Kartenkante[];
  readonly spalten: number;
  readonly zeilen: number;
}

/** Zeilen, die unter einem Abzweig für sein Brett frei bleiben (Maße in kartenmasse.ts). */
export const BRETTZEILEN = 3;

/** Was beim Durchlaufen mitläuft. */
interface Lauf {
  readonly knoten: Kartenknoten[];
  readonly kanten: Kartenkante[];
  /** Erste noch freie Zeile. */
  naechsteZeile: number;
  readonly sprachcode: string;
  /** Freie Zeilen unter einem Abzweig (BRETTZEILEN, in Tests auch 0). */
  readonly platz: number;
}

/** Der Text eines Zuges: Nummer bei Weiß und am Anfang einer Zeile, sonst nur der Zug. */
function zugtext(pos: Position, k: Variationsknoten, zeilenanfang: boolean, sprachcode: string) {
  const weiss = pos.turn === "white";
  const nummer = weiss ? `${pos.fullmoves}. ` : zeilenanfang ? `${pos.fullmoves}... ` : "";
  return nummer + sanInSprache(k.zug, sprachcode) + (k.zeichen ?? "");
}

/** Legt die Fortsetzungen eines Knotens (Stelle ``eltern``) ab; die erste in seiner Zeile. */
function legeFortsetzungen(
  lauf: Lauf,
  eltern: number,
  zuege: readonly Variationsknoten[],
  pos: Position,
): void {
  const oben = lauf.knoten[eltern];
  if (!oben) return;
  zuege.forEach((k, i) => {
    const zug = parseSan(pos, k.zug);
    if (!zug) return;
    // Unter dem Abzweig bleibt Platz für sein Brett; der Ast beginnt darunter.
    if (i > 0) lauf.naechsteZeile = Math.max(lauf.naechsteZeile, oben.zeile + 1 + lauf.platz);
    const zeile = i === 0 ? oben.zeile : lauf.naechsteZeile;
    if (i > 0) lauf.naechsteZeile += 1;
    const haupt = oben.haupt && i === 0;
    lauf.knoten.push({
      pfad: [...oben.pfad, k.zug],
      spalte: oben.spalte + 1,
      zeile,
      text: zugtext(pos, k, i > 0, lauf.sprachcode),
      haupt,
      herkunft: k.herkunft,
      kommentiert: (k.kommentar ?? "") !== "",
      abzweige: k.weiter.length > 1 ? k.weiter.length : 0,
    });
    const stelle = lauf.knoten.length - 1;
    lauf.kanten.push({ von: eltern, nach: stelle, haupt });
    const danach = pos.clone();
    danach.play(zug);
    legeFortsetzungen(lauf, stelle, k.weiter, danach);
  });
}

/**
 * Berechnet die Karte einer Variante.
 *
 * Eingaben: Baum, Sprache der Züge, Text der Startstellung („Start“), freie Zeilen unter einem
 * Abzweig (Vorgabe BRETTZEILEN).
 * Ausgabe: Knoten (Startstellung zuerst, dann in Lesereihenfolge), Linien, Größe in Spalten und
 * Zeilen.
 * Beispiel aus dem Buch: Abb. 2.40 (Petroff) mit 3... d6 und 3... Sxe4?! → Zeile 0: Start, 1. e4,
 * e5, 2. Sf3, Sf6, 3. Sxe5, d6 …; unter 3. Sxe5 steht das Brett, Zeile 4 beginnt in Spalte 6 mit
 * „3... Sxe4?!“.
 * Sonderfall: Ein unspielbarer Zug beendet seinen Ast (wie in der Zugleiste).
 */
export function kartenlayout(
  baum: Zugbaum,
  sprachcode: string,
  starttext: string,
  platz = BRETTZEILEN,
): Kartenlayout {
  const lauf: Lauf = { knoten: [], kanten: [], naechsteZeile: 1, sprachcode, platz };
  lauf.knoten.push({
    pfad: [],
    spalte: 0,
    zeile: 0,
    text: starttext,
    haupt: true,
    herkunft: null,
    kommentiert: false,
    abzweige: baum.zuege.length > 1 ? baum.zuege.length : 0,
  });
  const pos = stellungAus(baum.startFen);
  if (pos) legeFortsetzungen(lauf, 0, baum.zuege, pos);
  const spalten = Math.max(...lauf.knoten.map((k) => k.spalte)) + 1;
  const zeilen = Math.max(...lauf.knoten.map((k) => k.zeile)) + 1;
  return { knoten: lauf.knoten, kanten: lauf.kanten, spalten, zeilen };
}

/** Die Stelle des Knotens mit genau diesem Pfad; 0 (Startstellung), wenn es ihn nicht gibt. */
export function knotenstelle(layout: Kartenlayout, pfad: Pfad): number {
  const gesucht = pfad.join(" ");
  const stelle = layout.knoten.findIndex((k) => k.pfad.join(" ") === gesucht);
  return stelle < 0 ? 0 : stelle;
}

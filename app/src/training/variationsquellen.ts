/**
 * Quellen einer Variante: Grundstellung, Stellung (FEN oder aufgebaut), Abbildung mit Buchbaum,
 * Partie, Fehler und Lernsammlung, jeweils als ungespeicherter Entwurf.
 *
 * Rolle im Gesamtbild: Frage h des Entwurfs (Empfehlung B, sieben Quellen). Alle Quellen liefern
 * dasselbe: eine Startstellung, oft mit Zügen davor oder danach. Die Züge der Quelle werden in den
 * Baum kopiert und als Buch- oder Partiezug gekennzeichnet; die Quelle bleibt unverändert
 * (Regel 1). Buchtexte (Bildunterschriften) kommen nie in eine Variante, nur die Nummer der
 * Abbildung (Regel 2). Ein Entwurf hat die Kennung "" und wird erst mit dem ersten eigenen Inhalt
 * gespeichert (training/variationen.ts). Die Engine-Folgen einer Partie stehen in enginefolgen.ts.
 * Abhängigkeiten: chessops, schach/variationsbaum.ts, training/variationen.ts, Buch- und
 * Partietypen.
 */
import type { Chess } from "chessops/chess";
import { makeSan, parseSan } from "chessops/san";
import type { Knoten } from "../daten/generiert/beispiel";
import { stellungAus, type Pfad } from "../schach/variationsbaum";
import type { Fehlereintrag } from "./fehlerdatenbank";
import { GRUNDSTELLUNG, type Sammeleintrag } from "./lernsammlung";
import {
  KOMMENTAR_HOECHSTENS,
  TITEL_HOECHSTENS,
  ZUGKOMMENTAR_HOECHSTENS,
  type Variation,
  type Variationsknoten,
  type Variationsquelle,
  type Zugherkunft,
  type Zugzeichen,
} from "./variationen";

/** Kennung eines Entwurfs, der noch nicht gespeichert ist. */
export const ENTWURF = "";

/** Die Teile, aus denen ein Entwurf entsteht; der Rest ist leer. */
interface Entwurfsteile {
  readonly titel: string;
  readonly quelle: Variationsquelle;
  readonly startFen: string;
  readonly zuege?: readonly Variationsknoten[];
  readonly startpfad?: Pfad;
  readonly kommentar?: string;
  readonly startkommentar?: string;
}

/** Ein ungespeicherter Entwurf mit Zeitpunkt; null, wenn die Startstellung keine Regeln hat. */
export function entwurf(teile: Entwurfsteile, jetzt: Date): Variation | null {
  if (!stellungAus(teile.startFen)) return null;
  const zeit = jetzt.toISOString();
  const startkommentar = (teile.startkommentar ?? "").slice(0, ZUGKOMMENTAR_HOECHSTENS);
  return {
    id: ENTWURF,
    titel: teile.titel.slice(0, TITEL_HOECHSTENS),
    angelegt: zeit,
    geaendert: zeit,
    quelle: teile.quelle,
    startFen: teile.startFen,
    startpfad: teile.startpfad ?? [],
    start: startkommentar ? { kommentar: startkommentar } : {},
    zuege: teile.zuege ?? [],
    kommentar: (teile.kommentar ?? "").slice(0, KOMMENTAR_HOECHSTENS),
    legende: {},
    analysiert: false,
  };
}

/**
 * Eine Zugfolge als Kette von Knoten (jeder Zug hat genau eine Fortsetzung).
 * Ausgabe: Knoten und die Züge in der Schreibweise von chessops; ein unspielbarer Zug beendet
 * die Kette. Beispiel: Grundstellung, ["e4", "e5", "Nf3"] → e4 → e5 → Nf3.
 */
export function linieAlsKnoten(
  startFen: string,
  sans: readonly string[],
  herkunft?: Zugherkunft,
): { knoten: Variationsknoten[]; pfad: string[] } {
  const pos = stellungAus(startFen);
  const pfad: string[] = [];
  for (const san of sans) {
    const zug = pos ? parseSan(pos, san) : undefined;
    if (!pos || !zug) break;
    pfad.push(makeSan(pos, zug));
    pos.play(zug);
  }
  const knoten = pfad.reduceRight<Variationsknoten[]>(
    (weiter, zug) => [{ zug, ...(herkunft ? { herkunft } : {}), weiter }],
    [],
  );
  return { knoten, pfad };
}

/** Der Buchbaum als Variationsknoten, Züge geprüft und in der Schreibweise von chessops. */
function ausBuchbaum(pos: Chess, knoten: readonly Knoten[]): Variationsknoten[] {
  return knoten.flatMap((k) => {
    const zug = parseSan(pos, k.zug);
    if (!zug) return [];
    const danach = pos.clone();
    danach.play(zug);
    const zeichen: Zugzeichen | undefined = k.zeichen === "" ? undefined : k.zeichen;
    return [
      {
        zug: makeSan(pos, zug),
        herkunft: "buch" as const,
        ...(zeichen ? { zeichen } : {}),
        weiter: ausBuchbaum(danach, k.weiter),
      },
    ];
  });
}

/** Was von einer Abbildung gebraucht wird (Daten aus daten/laden.ts). */
export interface Abbildungsquelle {
  readonly nummer: string;
  readonly fen: string;
  /** Die Zugfolge des Buches, wenn die Abbildung eine hat, und der Pfad zur Abbildung. */
  readonly beispiel: { readonly startFen: string; readonly zuege: readonly Knoten[] } | null;
  readonly pfad: Pfad;
}

/**
 * Entwurf aus einer Abbildung: Der ganze Buchbaum wird kopiert, geöffnet wird am Pfad.
 *
 * Warum: Frage a und h; die Buchzüge sind der Ausgangspunkt, eigene Züge kommen dazu.
 * Beispiel aus dem Buch: Abb. 2.40 (Petroff) → Baum ab der Grundstellung, Startpfad bis 3... Sxe4.
 * Sonderfall: Ohne Zugfolge ist die Stellung der Abbildung die Wurzel; ein Lehrbild ohne König
 * hat keine Regeln und ergibt null (dort gibt es keinen Gabel-Knopf).
 */
export function ausAbbildung(quelle: Abbildungsquelle, titel: string, jetzt: Date) {
  const pos = quelle.beispiel ? stellungAus(quelle.beispiel.startFen) : null;
  const art = { art: "abbildung", nummer: quelle.nummer } as const;
  if (!quelle.beispiel || !pos) return entwurf({ titel, quelle: art, startFen: quelle.fen }, jetzt);
  const zuege = ausBuchbaum(pos, quelle.beispiel.zuege);
  const { pfad } = linieAlsKnoten(quelle.beispiel.startFen, quelle.pfad);
  const startFen = quelle.beispiel.startFen;
  return entwurf({ titel, quelle: art, startFen, zuege, startpfad: pfad }, jetzt);
}

/** Entwurf aus einer Partie: alle Züge als Hauptlinie, geöffnet an der Stelle ``stelle``. */
export function ausPartie(
  partie: { readonly id: string; readonly startFen: string; readonly zuege: readonly string[] },
  stelle: number,
  titel: string,
  jetzt: Date,
): Variation | null {
  const { knoten, pfad } = linieAlsKnoten(partie.startFen, partie.zuege, "partie");
  const quelle = { art: "partie", id: partie.id } as const;
  const startpfad = pfad.slice(0, Math.max(0, stelle));
  return entwurf({ titel, quelle, startFen: partie.startFen, zuege: knoten, startpfad }, jetzt);
}

/** Entwurf aus der Fehlerdatenbank: Stellung vor dem Fehler, der gespielte Zug, der Satz. */
export function ausFehler(eintrag: Fehlereintrag, titel: string, jetzt: Date): Variation | null {
  const { knoten } = linieAlsKnoten(eintrag.fen, eintrag.zug ? [eintrag.zug] : [], "partie");
  const quelle = { art: "fehler", id: eintrag.id } as const;
  const startkommentar = eintrag.satz;
  return entwurf({ titel, quelle, startFen: eintrag.fen, zuege: knoten, startkommentar }, jetzt);
}

/** Entwurf aus der Lernsammlung: der Weg zur Stellung, falls bekannt; Plan und Notiz als Kommentar. */
export function ausSammlung(eintrag: Sammeleintrag, titel: string, jetzt: Date): Variation | null {
  const quelle = { art: "sammlung", id: eintrag.id } as const;
  const kommentar = [eintrag.plan, eintrag.notiz].filter((s) => s !== "").join("\n");
  const verlauf = eintrag.verlauf;
  if (!verlauf) return entwurf({ titel, quelle, startFen: eintrag.fen, kommentar }, jetzt);
  const herkunft = eintrag.herkunft === "abbildung" ? "buch" : "partie";
  const { knoten, pfad } = linieAlsKnoten(verlauf.startFen, verlauf.zuege, herkunft);
  const startFen = verlauf.startFen;
  return entwurf({ titel, quelle, startFen, zuege: knoten, startpfad: pfad, kommentar }, jetzt);
}

/** Entwurf aus einer Stellung: Grundstellung, eingegebene FEN oder aufgebaute Stellung. */
export function ausStellung(
  art: "grund" | "fen" | "stellung",
  fen: string,
  titel: string,
  jetzt: Date,
): Variation | null {
  return entwurf({ titel, quelle: { art }, startFen: art === "grund" ? GRUNDSTELLUNG : fen }, jetzt);
}

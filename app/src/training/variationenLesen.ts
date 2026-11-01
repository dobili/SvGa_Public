/**
 * Varianten aus Rohdaten lesen (Speicher oder Sicherung), Feld für Feld geprüft.
 *
 * Rolle im Gesamtbild: Teil von Format 8 (speicher/format.ts, Feld „variationen“). Wie bei
 * Lernsammlung und Fehlern gilt: Unlesbares fällt weg, zu lange Texte werden gekürzt, ein
 * ungültiger Zug beendet seinen Ast (Entwurf, Abschnitt 5). Die Felder späterer Stufen
 * (Markierungen, Nummerntexte, Legende, Engine-Werte) werden schon gelesen und behalten, damit
 * nichts verloren geht, wenn eine Sicherung aus einer späteren Stufe in diese App kommt.
 * Abhängigkeiten: chessops, schach/variationsbaum.ts, training/variationen.ts.
 */
import type { Chess } from "chessops/chess";
import { makeSan, parseSan } from "chessops/san";
import type { Markierungsfarbe } from "../analyse/werkzeug";
import { pfadImBaum, stellungAus } from "../schach/variationsbaum";
import {
  HOECHSTENS_FORTSETZUNGEN,
  HOECHSTENS_KNOTEN,
  HOECHSTENS_KNOTEN_GESAMT,
  HOECHSTENS_VARIATIONEN,
  KOMMENTAR_HOECHSTENS,
  LEGENDE_HOECHSTENS,
  MARKEN_HOECHSTENS,
  TITEL_HOECHSTENS,
  ZUGKOMMENTAR_HOECHSTENS,
  ZUGHERKUENFTE,
  ZUGZEICHEN,
  type Knotendaten,
  type Variation,
  type Variationsknoten,
  type Variationsquelle,
} from "./variationen";

type Roh = Record<string, unknown>;
const istObjekt = (w: unknown): w is Roh =>
  typeof w === "object" && w !== null && !Array.isArray(w);
const text = (w: unknown, laenge: number): string =>
  typeof w === "string" ? w.slice(0, laenge) : "";

/** Marke wie „Ge2e4“ (Pfeil) oder „Re8“ (Feld); Farbbuchstabe G R S N B (Entwurf, Abschnitt 5). */
const MARKE = /^[GRSNB][a-h][1-8](?:[a-h][1-8])?$/;
const NUMMERNTEXT = /^[GRSNB]\d{1,2}$/;
const UCI = /^[a-h][1-8][a-h][1-8][qrbn]?$/;
const FARBEN: readonly Markierungsfarbe[] = ["gold", "rot", "grau", "gruen", "blau"];
const OHNE_KENNUNG = ["grund", "fen", "pgn", "stellung"] as const;
const MIT_KENNUNG = ["partie", "fehler", "sammlung"] as const;

/** Eine ganze Zahl (Engine-Werte in Hundertstel), sonst undefined. */
function ganzzahl(w: unknown): number | undefined {
  return typeof w === "number" && Number.isInteger(w) ? w : undefined;
}

/** Die Texte je Nummer („R2“ → Text); Fremdes fällt weg. */
function nummerntexteAus(roh: unknown): Record<string, string> | undefined {
  if (!istObjekt(roh)) return undefined;
  const paare = Object.entries(roh).filter(
    (p): p is [string, string] => NUMMERNTEXT.test(p[0]) && typeof p[1] === "string",
  );
  if (paare.length === 0) return undefined;
  return Object.fromEntries(paare.map(([k, v]) => [k, v.slice(0, LEGENDE_HOECHSTENS)]));
}

/** Kommentar, Marken und Engine-Werte einer Stellung; nur vorhandene Felder. */
export function knotendatenAus(roh: Roh): Knotendaten {
  const kommentar = text(roh.kommentar, ZUGKOMMENTAR_HOECHSTENS);
  const marken = Array.isArray(roh.marken)
    ? roh.marken.filter((m): m is string => typeof m === "string" && MARKE.test(m))
    : [];
  const nummerntexte = nummerntexteAus(roh.nummerntexte);
  const w = ganzzahl(roh.w);
  const a = ganzzahl(roh.a);
  const b = typeof roh.b === "string" && UCI.test(roh.b) ? roh.b : undefined;
  return {
    ...(kommentar ? { kommentar } : {}),
    ...(marken.length > 0 ? { marken: marken.slice(0, MARKEN_HOECHSTENS) } : {}),
    ...(nummerntexte ? { nummerntexte } : {}),
    ...(w !== undefined ? { w } : {}),
    ...(b ? { b } : {}),
    ...(a !== undefined && a >= 0 ? { a } : {}),
  };
}

/** Zähler, wie viele Knoten noch gelesen werden dürfen (Grenzen je Variante und insgesamt). */
interface Budget {
  rest: number;
}

/**
 * Die Fortsetzungen einer Stellung; jeder Zug wird in ``pos`` geprüft und in die Schreibweise
 * von chessops gebracht. Ein ungültiger Zug fällt mit allem danach weg, doppelte ebenso.
 */
function knotenAus(roh: unknown, pos: Chess, budget: Budget): Variationsknoten[] {
  if (!Array.isArray(roh)) return [];
  const ergebnis: Variationsknoten[] = [];
  for (const r of roh.slice(0, HOECHSTENS_FORTSETZUNGEN)) {
    if (budget.rest <= 0 || !istObjekt(r) || typeof r.zug !== "string") continue;
    const zug = parseSan(pos, r.zug);
    if (!zug) continue;
    const san = makeSan(pos, zug);
    if (ergebnis.some((k) => k.zug === san)) continue;
    budget.rest -= 1;
    const danach = pos.clone();
    danach.play(zug);
    const zeichen = ZUGZEICHEN.find((z) => z === r.zeichen);
    const herkunft = ZUGHERKUENFTE.find((h) => h === r.herkunft);
    ergebnis.push({
      zug: san,
      ...knotendatenAus(r),
      ...(zeichen ? { zeichen } : {}),
      ...(herkunft ? { herkunft } : {}),
      weiter: knotenAus(r.weiter, danach, budget),
    });
  }
  return ergebnis;
}

/** Die Quelle aus Rohdaten; Unbekanntes wird zu „fen“ (eine Stellung ohne Herkunft). */
export function quelleAus(roh: unknown): Variationsquelle {
  if (!istObjekt(roh)) return { art: "fen" };
  const { art, nummer, id } = roh;
  if (art === "abbildung" && typeof nummer === "string") return { art, nummer };
  const mitKennung = MIT_KENNUNG.find((a) => a === art);
  if (mitKennung && typeof id === "string") return { art: mitKennung, id };
  return { art: OHNE_KENNUNG.find((a) => a === art) ?? "fen" };
}

/** Die Legende je Farbe (Stufe 2); nur bekannte Farben. */
function legendeAus(roh: unknown): Partial<Record<Markierungsfarbe, string>> {
  if (!istObjekt(roh)) return {};
  return Object.fromEntries(
    FARBEN.flatMap((f) =>
      typeof roh[f] === "string" ? [[f, text(roh[f], LEGENDE_HOECHSTENS)]] : [],
    ),
  );
}

/** Eine Variante aus Rohdaten, oder null, wenn Kennung, Titel oder Startstellung fehlen. */
function variationAus(roh: unknown, gesamt: Budget): Variation | null {
  if (!istObjekt(roh) || typeof roh.id !== "string" || typeof roh.startFen !== "string") {
    return null;
  }
  const pos = stellungAus(roh.startFen);
  if (!pos || gesamt.rest <= 0) return null;
  const budget = { rest: Math.min(HOECHSTENS_KNOTEN, gesamt.rest) };
  const zuege = knotenAus(roh.zuege, pos, budget);
  gesamt.rest -= Math.min(HOECHSTENS_KNOTEN, gesamt.rest) - budget.rest;
  const startpfad = Array.isArray(roh.startpfad)
    ? roh.startpfad.filter((z): z is string => typeof z === "string")
    : [];
  const angelegt = text(roh.angelegt, TITEL_HOECHSTENS);
  return {
    id: roh.id,
    titel: text(roh.titel, TITEL_HOECHSTENS),
    angelegt,
    geaendert: text(roh.geaendert, TITEL_HOECHSTENS) || angelegt,
    quelle: quelleAus(roh.quelle),
    startFen: roh.startFen,
    startpfad: pfadImBaum({ startFen: roh.startFen, zuege }, startpfad) ? startpfad : [],
    start: istObjekt(roh.start) ? knotendatenAus(roh.start) : {},
    zuege,
    kommentar: text(roh.kommentar, KOMMENTAR_HOECHSTENS),
    legende: legendeAus(roh.legende),
    analysiert: roh.analysiert === true,
  };
}

/**
 * Die Varianten aus Rohdaten (Speicher oder Sicherung); Unlesbares fällt weg.
 *
 * Warum: Eine Sicherung kann von Hand geändert oder beschädigt sein; die App darf daran nicht
 * scheitern und soll so viel wie möglich behalten.
 * Beispiel: undefined (Format 7 und älter) → []; ein Eintrag ohne Startstellung fällt weg.
 * Sonderfall: Mehr als die Grenzen (200 Varianten, 600 Züge je Variante, 40 000 insgesamt)
 * entstehen in der App nie; aus fremden Daten wird nur bis zur Grenze gelesen.
 */
export function variationenAus(roh: unknown): Variation[] {
  if (!Array.isArray(roh)) return [];
  const gesamt: Budget = { rest: HOECHSTENS_KNOTEN_GESAMT };
  const gelesen = roh.flatMap((r) => variationAus(r, gesamt) ?? []);
  const eindeutig = gelesen.filter((v, i) => gelesen.findIndex((w) => w.id === v.id) === i);
  return eindeutig.slice(0, HOECHSTENS_VARIATIONEN);
}

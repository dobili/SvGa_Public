/**
 * Der Wert der Ansicht „variante“: eine gespeicherte Variante oder eine Quelle für einen Entwurf.
 *
 * Rolle im Gesamtbild: Die Bildschirme „Varianten“ und „Variante“ laufen über die Ansicht
 * „zusatz“ (app/zusatzansichten.ts); der einzige Parameter ist ein Text. Er nennt entweder die
 * Kennung einer gespeicherten Variante („var-…“) oder die Quelle eines Entwurfs („neu:abbildung:
 * 2.40:e4 e5“). So übersteht auch ein Entwurf das Neuladen (der Stapel wird gesichert,
 * app/stapelMerker.ts). Dazu hält die Datei den zuletzt gezeigten Zug je Variante in der Sitzung,
 * damit die Variante nach dem ersten Speichern und beim Wiederöffnen dort weitermacht.
 * Abhängigkeiten: app/stapel.ts (Ansicht), schach/variationsbaum.ts (Pfad).
 */
import type { Ansicht } from "../../../app/stapel";
import type { Pfad } from "../../../schach/variationsbaum";
import type { Variationsquelle } from "../../../training/variationen";

/** Kennungen der beiden Bildschirme in ZUSATZANSICHTEN. */
export const ANSICHT_VARIANTEN = "varianten";
export const ANSICHT_VARIANTE = "variante";
/** Stufe 4: Bildschirm „Variante abfragen“ (bildschirme/VariantenAbfrage.tsx). */
export const ANSICHT_ABFRAGE = "variante-abfrage";

/** Woraus ein neuer Entwurf entsteht (Frage h des Entwurfs, sieben Quellen und PGN). */
export type Entwurfsquelle =
  | { readonly art: "grund" }
  | { readonly art: "fen" | "stellung"; readonly fen: string }
  | { readonly art: "abbildung"; readonly nummer: string; readonly pfad: Pfad | null }
  | {
      readonly art: "partie";
      readonly id: string;
      readonly stelle: number;
      /** Engine-Folgen „Besser war …“ und „So wird bestraft“ übernehmen (Vorgabe aus). */
      readonly engine: boolean;
    }
  | { readonly art: "fehler" | "sammlung"; readonly id: string }
  /** Stufe 4: ganze Eröffnung aus Buch und/oder Praxis (eroeffnungsentwurf.ts). */
  | {
      readonly art: "eroeffnung";
      readonly schluessel: string;
      readonly buch: boolean;
      readonly praxis: boolean;
      readonly band: number;
    }
  /** Stufe 4: Übung des Buches, erst nach dem Lösen (Bildschirm „Übung“). */
  | { readonly art: "uebung"; readonly kapitel: number; readonly id: string }
  /** Stufe 4: Stellung mit Lösungszügen, etwa einer gelösten Trainer-Aufgabe. */
  | {
      readonly art: "linie";
      readonly titel: string;
      readonly fen: string;
      readonly zuege: readonly string[];
    };

/** Gelesener Wert: gespeicherte Variante oder Quelle eines Entwurfs. */
export type Variantenwert =
  | { readonly art: "gespeichert"; readonly id: string }
  | { readonly art: "neu"; readonly quelle: Entwurfsquelle };

const NEU = "neu";
const TRENNER = ":";
const ZUGTRENNER = " ";

/** Der Text zu einer Quelle, etwa „neu:partie:p-1:12:1“. */
export function alsWert(quelle: Entwurfsquelle): string {
  const teile: (string | number)[] = [NEU, quelle.art];
  if (quelle.art === "fen" || quelle.art === "stellung") teile.push(quelle.fen);
  if (quelle.art === "abbildung") teile.push(quelle.nummer, (quelle.pfad ?? []).join(ZUGTRENNER));
  if (quelle.art === "partie") teile.push(quelle.id, quelle.stelle, quelle.engine ? 1 : 0);
  if (quelle.art === "fehler" || quelle.art === "sammlung") teile.push(quelle.id);
  if (quelle.art === "eroeffnung") {
    const schalter = `${quelle.buch ? 1 : 0}${quelle.praxis ? 1 : 0}`;
    teile.push(encodeURIComponent(quelle.schluessel), schalter, quelle.band);
  }
  if (quelle.art === "uebung") teile.push(quelle.kapitel, encodeURIComponent(quelle.id));
  if (quelle.art === "linie") {
    teile.push(encodeURIComponent(quelle.titel), quelle.zuege.join(ZUGTRENNER), quelle.fen);
  }
  return teile.join(TRENNER);
}

/** Text aus encodeURIComponent zurück; Kaputtes bleibt, wie es ist. */
function entschluesselt(text: string): string {
  try {
    return decodeURIComponent(text);
  } catch (fehler: unknown) {
    console.warn("Wert der Variante nicht lesbar:", fehler);
    return text;
  }
}

/** Die Quellen der Stufe 4 (Eröffnung, Übung, Linie); null bei Unbekanntem. */
function quelleStufe4(art: string, rest: readonly string[]): Entwurfsquelle | null {
  const [a = "", b = "", c = ""] = rest;
  if (art === "eroeffnung" && a) {
    return {
      art,
      schluessel: entschluesselt(a),
      buch: b[0] === "1",
      praxis: b[1] === "1",
      band: Number(c) || 0,
    };
  }
  if (art === "uebung" && a && b) return { art, kapitel: Number(a) || 0, id: entschluesselt(b) };
  if (art === "linie" && rest.length >= 3) {
    const zuege = b.split(ZUGTRENNER).filter(Boolean);
    return { art, titel: entschluesselt(a), zuege, fen: rest.slice(2).join(TRENNER) };
  }
  return null;
}

/** Liest die Teile nach „neu:<art>:“; null bei Unbekanntem. */
function quelleAus(art: string, rest: readonly string[]): Entwurfsquelle | null {
  const [a = "", b = "", c = ""] = rest;
  if (art === "grund") return { art };
  if ((art === "fen" || art === "stellung") && a) return { art, fen: rest.join(TRENNER) };
  if (art === "abbildung" && a) {
    return { art, nummer: a, pfad: rest.length > 1 ? b.split(ZUGTRENNER).filter(Boolean) : null };
  }
  if (art === "partie" && a) return { art, id: a, stelle: Number(b) || 0, engine: c === "1" };
  if ((art === "fehler" || art === "sammlung") && a) return { art, id: a };
  return quelleStufe4(art, rest);
}

/**
 * Liest den Wert der Ansicht.
 * Beispiel: „var-17…“ → gespeichert; „neu:abbildung:2.40:e4 e5“ → Entwurf aus Abb. 2.40 am Pfad
 * e4 e5; „neu:fen:8/8/… w - - 0 1“ → Entwurf aus der Stellung (FEN mit Doppelpunkten bleibt ganz).
 */
export function wertAus(wert: string | null): Variantenwert | null {
  if (!wert) return null;
  const [kopf, art = "", ...rest] = wert.split(TRENNER);
  if (kopf !== NEU) return { art: "gespeichert", id: wert };
  const quelle = quelleAus(art, rest);
  return quelle ? { art: "neu", quelle } : null;
}

/** Die Ansicht einer gespeicherten Variante oder eines Entwurfs. */
export function varianteAnsicht(wert: string): Ansicht {
  return { bildschirm: "zusatz", kennung: ANSICHT_VARIANTE, wert };
}

/** Die Liste, auf Wunsch nur die Varianten einer Quelle („abbildung:2.40“, „partie:p-1“). */
export function variantenAnsicht(filter?: string): Ansicht {
  return filter
    ? { bildschirm: "zusatz", kennung: ANSICHT_VARIANTEN, wert: filter }
    : { bildschirm: "zusatz", kennung: ANSICHT_VARIANTEN };
}

/** Der Filter der Liste zu einer Quelle: „abbildung:2.40“, „partie:p-1“. */
export function filterWert(quelle: Variationsquelle): string {
  if ("nummer" in quelle) return `${quelle.art}${TRENNER}${quelle.nummer}`;
  if ("id" in quelle) return `${quelle.art}${TRENNER}${quelle.id}`;
  return quelle.art;
}

/** Die Quelle aus einem Filter der Liste; null ohne oder bei unbekanntem Filter. */
export function filterAus(wert: string | null): Variationsquelle | null {
  const [art = "", ...rest] = (wert ?? "").split(TRENNER);
  const schluessel = rest.join(TRENNER);
  if (art === "abbildung" && schluessel) return { art, nummer: schluessel };
  if ((art === "partie" || art === "fehler" || art === "sammlung") && schluessel) {
    return { art, id: schluessel };
  }
  return null;
}

/** Was abgefragt wird: eine Variante ab einem Pfad, oder alle Varianten eines Eintrags. */
export type Abfragewert =
  | { readonly art: "variante"; readonly id: string; readonly pfad: Pfad }
  | { readonly art: "sammlung" | "fehler"; readonly id: string };

/** Vorsilbe einer einzelnen Variante im Wert der Abfrage. */
const EINZELN = "var";

/** Die Ansicht „Variante abfragen“, etwa „var:var-17…:e4 e5“ oder „sammlung:s-1“. */
export function abfrageAnsicht(wert: Abfragewert): Ansicht {
  const text =
    wert.art === "variante"
      ? [EINZELN, wert.id, wert.pfad.join(ZUGTRENNER)].join(TRENNER)
      : `${wert.art}${TRENNER}${wert.id}`;
  return { bildschirm: "zusatz", kennung: ANSICHT_ABFRAGE, wert: text };
}

/** Liest den Wert der Abfrage; null bei Unbekanntem. */
export function abfrageAus(wert: string | null): Abfragewert | null {
  const [art = "", id = "", ...rest] = (wert ?? "").split(TRENNER);
  if (!id) return null;
  if (art === EINZELN)
    return { art: "variante", id, pfad: rest.join(TRENNER).split(ZUGTRENNER).filter(Boolean) };
  if (art === "sammlung" || art === "fehler") return { art, id: [id, ...rest].join(TRENNER) };
  return null;
}

/** Zuletzt gezeigter Pfad je Variante, nur für diese Sitzung. */
const zuletzt = new Map<string, Pfad>();

/** Merkt den gezeigten Pfad einer gespeicherten Variante. */
export function merkePfad(id: string, pfad: Pfad): void {
  zuletzt.set(id, pfad);
}

/** Der in dieser Sitzung zuletzt gezeigte Pfad, sonst undefined. */
export function gemerkterPfad(id: string): Pfad | undefined {
  return zuletzt.get(id);
}

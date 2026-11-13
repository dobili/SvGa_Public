/**
 * Figuren mit Bedingung (Wunsch des Haupt-Chats, 13.11.2026): Eine Figur in orte.json kann `wenn`
 * tragen und steht dann nur auf der Karte, wenn die Bedingung beim Betreten gilt. So gehen die
 * Stufen A bis D der kleinen Geschichten auf allen Karten (Tessa erst später am Flussweg), ohne
 * eigene Kartenzustände je Figur.
 *
 * Dasselbe gilt für Möbel (Wunsch des Haupt-Chats, 13.11.2026): Ein Szenenobjekt mit `wenn` trägt
 * die Bedingung als Eigenschaft `wenn` in der Tiled-Karte (pipeline/abenteuer/kartenbau.py) und
 * steht nur, wenn sie gilt; so braucht ein Zustand wie Calloways Tisch mit Brett keine Kartenkopie.
 *
 * Rolle im Gesamtbild: reine Regel für oberwelt/weltdaten.ts, wie regeln/abwesenheit.ts (Ambrose
 * im Tiefpunkt). Die Karte im Paket bleibt gleich; nur die geladene Fassung verliert das Objekt,
 * damit verschwinden Bild, Hindernis und Ansprechen zugleich.
 * Abhängigkeiten: regeln/bedingung.ts (Sprache der Bedingungen).
 */
import { erfuellt } from "./bedingung";

/** Objekt einer Tiled-Objektebene, soweit diese Regel es liest. */
interface Kartenobjekt {
  readonly name?: unknown;
  readonly type?: unknown;
  readonly properties?: readonly { readonly name?: unknown; readonly value?: unknown }[];
}

/** Die Bedingung eines Objekts: Figuren aus orte.json, Möbel aus ihrer Eigenschaft `wenn`. */
function bedingungVon(
  objekt: Kartenobjekt,
  bedingungZu: (name: string) => string | undefined,
): string | undefined {
  if (objekt.type === "moebel") {
    const wert = objekt.properties?.find((e) => e.name === "wenn")?.value;
    return typeof wert === "string" ? wert : undefined;
  }
  if (objekt.type === "figur" && typeof objekt.name === "string") return bedingungZu(objekt.name);
  return undefined;
}

/**
 * Steht das Objekt (Figur oder Möbel) auf der Karte? Ohne Bedingung immer.
 * `bedingungZu` liefert das `wenn` der Figur (oder undefined, auch für unbekannte Namen).
 * Wirft bei einer fehlerhaften Bedingung (Fehler in den Spieldaten, wie kartenfassung.ts).
 */
function steht(
  objekt: Kartenobjekt,
  bedingungZu: (name: string) => string | undefined,
  variablen: Readonly<Record<string, unknown>>,
): boolean {
  const wenn = bedingungVon(objekt, bedingungZu);
  return wenn === undefined || erfuellt(wenn, variablen);
}

/**
 * Die Tiled-Karte ohne die Figuren und Möbel, deren Bedingung nicht gilt; sonst unverändert.
 * Beispiel: Tessa mit `wenn: "tessaStufe >= 2"` und tessaStufe = 1 → Objekt „tessa“ fehlt;
 * Möbel mit Eigenschaft wenn = "lilyGeholfen" fehlt, solange lilyGeholfen nicht gesetzt ist.
 */
export function ohneFigurenNachBedingung<T extends object>(
  karte: T,
  bedingungZu: (name: string) => string | undefined,
  variablen: Readonly<Record<string, unknown>>,
): T {
  const ebenen = (karte as { layers?: readonly { objects?: readonly Kartenobjekt[] }[] }).layers;
  if (!ebenen) return karte;
  const fehlt = ebenen.some((e) => e.objects?.some((o) => !steht(o, bedingungZu, variablen)));
  if (!fehlt) return karte;
  const gefiltert = ebenen.map((e) =>
    e.objects ? { ...e, objects: e.objects.filter((o) => steht(o, bedingungZu, variablen)) } : e,
  );
  return { ...karte, layers: gefiltert };
}

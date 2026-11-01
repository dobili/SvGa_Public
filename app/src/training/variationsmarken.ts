/**
 * Eigene Pfeile und Feldrahmen einer Variante: lesen, nummerieren, setzen und wegnehmen, Texte je
 * Nummer und je Farbe.
 *
 * Rolle im Gesamtbild: Variationsbrowser, Stufe 2 (Frage e, Entscheidung des Autors C: Stift mit
 * den fünf Buchfarben, Nummern je Farbe am Brett, Legende je Farbe, aufklappbar je Nummer).
 * Gespeichert sind die Marken kompakt im Format 8 (training/variationen.ts, Feld `marken`):
 * „Ge2e4“ ist ein goldener Pfeil von e2 nach e4, „Re8“ ein roter Rahmen um e8. Die Nummer einer
 * Marke ist ihre Stelle unter den Marken derselben Farbe in dieser Stellung, über Pfeile und
 * Felder hinweg (Gold 1 Pfeil, Gold 2 Feld). Texte je Nummer stehen in `nummerntexte` unter dem
 * Schlüssel Farbbuchstabe + Nummer („R2“); verschiebt das Wegnehmen einer Marke die Nummern,
 * wandern die Texte mit. Reine Funktionen.
 * Abhängigkeiten: analyse/werkzeug.ts (Markierung), training/variationen.ts (Typen, Grenzen).
 * Buchbezug: Kapitel 1, Einleitung zu den Abbildungen (Gold, Rot, Grau als Linienarten).
 */
import type { Markierung, Markierungsfarbe } from "../analyse/werkzeug";
import { LEGENDE_HOECHSTENS, MARKEN_HOECHSTENS, type Knotendaten } from "./variationen";

/** Die fünf Farben des Stifts in der Reihenfolge der Farbpunkte (Bild e). */
export const STIFTFARBEN: readonly Markierungsfarbe[] = ["gold", "rot", "grau", "gruen", "blau"];

/** Farbbuchstaben im Speicher (Entwurf, Abschnitt 5): G gold, R rot, S grau, N grün, B blau. */
export const FARBBUCHSTABE: Readonly<Record<Markierungsfarbe, string>> = {
  gold: "G",
  rot: "R",
  grau: "S",
  gruen: "N",
  blau: "B",
};

/** Länge eines Feldnamens („e4“). */
const FELDLAENGE = 2;
/** Eine Marke im Speicher: Farbbuchstabe, Feld, wahlweise Zielfeld. */
const MARKE = /^([GRSNB])([a-h][1-8])([a-h][1-8])?$/;

/** Eine gelesene Marke mit ihrer Nummer je Farbe (ab 1). */
export interface Nummerierte {
  readonly farbe: Markierungsfarbe;
  readonly von: string;
  /** Zielfeld eines Pfeils; null bei einem Feldrahmen. */
  readonly nach: string | null;
  readonly nummer: number;
  /** Schlüssel für `nummerntexte`, etwa „R2“. */
  readonly schluessel: string;
}

/** Die Farbe zu einem Farbbuchstaben; undefined bei Fremdem. */
export function farbeVonBuchstabe(buchstabe: string): Markierungsfarbe | undefined {
  return STIFTFARBEN.find((f) => FARBBUCHSTABE[f] === buchstabe);
}

/** Eine Marke im Speicherformat, etwa „Ge2e4“ oder „Re8“. */
export function markeAlsText(farbe: Markierungsfarbe, von: string, nach: string | null): string {
  return FARBBUCHSTABE[farbe] + von + (nach && nach !== von ? nach : "");
}

/**
 * Liest die Marken einer Stellung und nummeriert sie je Farbe.
 * Beispiel: ["Ge2e4", "Rd1h5", "Ge8"] → Gold 1 (Pfeil e2–e4), Rot 1 (Pfeil), Gold 2 (Feld e8).
 * Sonderfall: Unlesbare Einträge fallen weg und zählen nicht mit.
 */
export function nummerierteMarken(marken: readonly string[] | undefined): Nummerierte[] {
  const zaehler = new Map<Markierungsfarbe, number>();
  const ergebnis: Nummerierte[] = [];
  for (const text of marken ?? []) {
    const teile = MARKE.exec(text);
    const farbe = teile ? farbeVonBuchstabe(teile[1] ?? "") : undefined;
    if (!teile || !farbe) continue;
    const nummer = (zaehler.get(farbe) ?? 0) + 1;
    zaehler.set(farbe, nummer);
    const von = teile[2] ?? "";
    const nach = teile[3] ?? null;
    ergebnis.push({ farbe, von, nach, nummer, schluessel: FARBBUCHSTABE[farbe] + nummer });
  }
  return ergebnis;
}

/** Die Marken als Markierungen für das Brett (Pfeile und Rahmen in den Buchfarben). */
export function alsMarkierungen(marken: readonly string[] | undefined): Markierung[] {
  return nummerierteMarken(marken).map((m) =>
    m.nach
      ? { typ: "pfeil", farbe: m.farbe, von: m.von, nach: m.nach }
      : { typ: "feld", farbe: m.farbe, feld: m.von },
  );
}

/** Die Farben, die in einer Stellung vorkommen, in der Reihenfolge der Farbpunkte. */
export function farbenIn(marken: readonly string[] | undefined): Markierungsfarbe[] {
  const da = new Set(nummerierteMarken(marken).map((m) => m.farbe));
  return STIFTFARBEN.filter((f) => da.has(f));
}

/** Knotendaten ohne leere Felder (leere Liste, leere Texte fallen ganz weg). */
function aufgeraeumt(
  daten: Knotendaten,
  marken: readonly string[],
  texte: Readonly<Record<string, string>>,
): Knotendaten {
  const rest: { -readonly [K in keyof Knotendaten]: Knotendaten[K] } = { ...daten };
  delete rest.marken;
  delete rest.nummerntexte;
  const gefuellt = Object.entries(texte).filter(([, v]) => v !== "");
  return {
    ...rest,
    ...(marken.length > 0 ? { marken: [...marken] } : {}),
    ...(gefuellt.length > 0 ? { nummerntexte: Object.fromEntries(gefuellt) } : {}),
  };
}

/**
 * Die Texte je Nummer, nachdem die Marke ``stelle`` (Index in den Marken) wegfällt: Texte dieser
 * Farbe mit höherer Nummer rücken eine Nummer vor, der Text der weggenommenen Marke fällt weg.
 */
function texteNachEntfernen(
  daten: Knotendaten,
  weg: Nummerierte,
): Readonly<Record<string, string>> {
  const buchstabe = FARBBUCHSTABE[weg.farbe];
  const neu: Record<string, string> = {};
  for (const [schluessel, text] of Object.entries(daten.nummerntexte ?? {})) {
    const nummer = schluessel.startsWith(buchstabe) ? Number(schluessel.slice(1)) : 0;
    if (nummer === 0) neu[schluessel] = text;
    else if (nummer > weg.nummer) neu[buchstabe + (nummer - 1)] = text;
    else if (nummer < weg.nummer) neu[schluessel] = text;
  }
  return neu;
}

/** Ergebnis von mitMarke. */
export type Markenergebnis =
  | { readonly art: "gesetzt" | "entfernt"; readonly daten: Knotendaten }
  /** MARKEN_HOECHSTENS erreicht; nichts geändert (die Oberfläche meldet es). */
  | { readonly art: "voll" };

/**
 * Setzt einen Pfeil (``nach`` gesetzt) oder einen Rahmen (``nach`` null) oder nimmt ihn weg.
 *
 * Warum: „Dasselbe noch einmal nimmt ihn weg“ (Entwurf, Abschnitt 3). Liegt auf denselben Feldern
 * schon eine Marke anderer Farbe, wechselt sie die Farbe und bekommt die nächste Nummer der neuen
 * Farbe (wie das Umfärben bei Lichess).
 * Eingaben: Knotendaten der Stellung, Farbe, Start- und Zielfeld.
 * Beispiel: leere Stellung, Gold e2→e4 → „Ge2e4“ (Gold 1); noch einmal → entfernt.
 * Sonderfall: Ein Pfeil auf sein eigenes Startfeld ist ein Rahmen.
 */
export function mitMarke(
  daten: Knotendaten,
  farbe: Markierungsfarbe,
  von: string,
  nach: string | null,
): Markenergebnis {
  const ziel = nach === von ? null : nach;
  const alle = nummerierteMarken(daten.marken);
  const stelle = alle.findIndex((m) => m.von === von && m.nach === ziel);
  const alt = alle[stelle];
  const marken = alle.map((m) => markeAlsText(m.farbe, m.von, m.nach));
  if (alt) {
    const ohne = marken.filter((_, i) => i !== stelle);
    const texte = texteNachEntfernen(daten, alt);
    if (alt.farbe === farbe) return { art: "entfernt", daten: aufgeraeumt(daten, ohne, texte) };
    const neu = [...ohne, markeAlsText(farbe, von, ziel)];
    return { art: "gesetzt", daten: aufgeraeumt(daten, neu, texte) };
  }
  if (marken.length >= MARKEN_HOECHSTENS) return { art: "voll" };
  const neu = [...marken, markeAlsText(farbe, von, ziel)];
  return { art: "gesetzt", daten: aufgeraeumt(daten, neu, daten.nummerntexte ?? {}) };
}

/** Alle Marken und Nummerntexte der Stellung weg (Radierer); Kommentar und Werte bleiben. */
export function ohneMarken(daten: Knotendaten): Knotendaten {
  return aufgeraeumt(daten, [], {});
}

/**
 * Setzt den Text zu einer Nummer („R2“ → „dann fällt die Dame“); leerer Text nimmt ihn weg.
 * Sonderfall: Zu lange Texte werden auf LEGENDE_HOECHSTENS Zeichen gekürzt.
 */
export function mitNummerntext(
  daten: Knotendaten,
  schluessel: string,
  text: string,
): Knotendaten {
  const texte = { ...(daten.nummerntexte ?? {}), [schluessel]: text.slice(0, LEGENDE_HOECHSTENS) };
  return aufgeraeumt(daten, daten.marken ?? [], texte);
}

/** Die Legende einer Variante mit geändertem Farbtext; leerer Text nimmt ihn weg. */
export function mitLegendentext(
  legende: Readonly<Partial<Record<Markierungsfarbe, string>>>,
  farbe: Markierungsfarbe,
  text: string,
): Partial<Record<Markierungsfarbe, string>> {
  const neu = { ...legende, [farbe]: text.slice(0, LEGENDE_HOECHSTENS) };
  return Object.fromEntries(Object.entries(neu).filter(([, wert]) => wert !== ""));
}

/** Ist das ein Feldname wie „e4“? (Für Eingaben aus PGN-Befehlen.) */
export function istFeld(text: string): boolean {
  return text.length === FELDLAENGE && /^[a-h][1-8]$/.test(text);
}

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
 * wandern die Texte mit. Seit Format 9 (Wunsch des Autors, 1.11.2026) kann eine Marke ohne Nummer
 * sein (Feld `ohneNummer` des Knotens, die Marken als Text) oder eine ganze Farbe (Feld `nummernAus`
 * der Variante): Solche Marken zählen nicht mit, die folgenden rücken auf. So bekommt etwa ein
 * Bereich aus mehreren Feldern nur eine Nummer, und gleichartige Pfeile brauchen keine. Reine
 * Funktionen.
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
  /** Nummer je Farbe ab 1; 0 bei einer Marke ohne Nummer. */
  readonly nummer: number;
  /** Schlüssel für `nummerntexte`, etwa „R2“; leer bei einer Marke ohne Nummer. */
  readonly schluessel: string;
  /** Die Marke im Speicherformat („Ge2e4“). */
  readonly text: string;
}

/** Welche Marken keine Nummer bekommen: einzelne (als Text) und ganze Farben (Format 9). */
export interface Nummernwahl {
  readonly ohneNummer?: readonly string[];
  readonly farbenAus?: readonly Markierungsfarbe[];
}

/** Hat die Marke eine Nummer? */
export function hatNummer(m: Nummerierte): boolean {
  return m.nummer > 0;
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
 * Beispiel: ["Ge2e4", "Rd1h5", "Ge8"] → Gold 1 (Pfeil e2–e4), Rot 1 (Pfeil), Gold 2 (Feld e8);
 * mit { ohneNummer: ["Ge2e4"] } → Gold e2–e4 ohne Nummer, Feld e8 wird Gold 1.
 * Sonderfall: Unlesbare Einträge fallen weg und zählen nicht mit.
 */
export function nummerierteMarken(
  marken: readonly string[] | undefined,
  wahl: Nummernwahl = {},
): Nummerierte[] {
  const zaehler = new Map<Markierungsfarbe, number>();
  const ergebnis: Nummerierte[] = [];
  for (const text of marken ?? []) {
    const teile = MARKE.exec(text);
    const farbe = teile ? farbeVonBuchstabe(teile[1] ?? "") : undefined;
    if (!teile || !farbe) continue;
    const von = teile[2] ?? "";
    const nach = teile[3] ?? null;
    const ohne = wahl.ohneNummer?.includes(text) === true || wahl.farbenAus?.includes(farbe) === true;
    const nummer = ohne ? 0 : (zaehler.get(farbe) ?? 0) + 1;
    if (!ohne) zaehler.set(farbe, nummer);
    const schluessel = ohne ? "" : FARBBUCHSTABE[farbe] + nummer;
    ergebnis.push({ farbe, von, nach, nummer, schluessel, text });
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
  ohneNummer?: readonly string[],
): Knotendaten {
  const rest: { -readonly [K in keyof Knotendaten]: Knotendaten[K] } = { ...daten };
  delete rest.marken;
  delete rest.nummerntexte;
  delete rest.ohneNummer;
  const gefuellt = Object.entries(texte).filter(([, v]) => v !== "");
  const ohne = (ohneNummer ?? daten.ohneNummer ?? []).filter((m) => marken.includes(m));
  return {
    ...rest,
    ...(marken.length > 0 ? { marken: [...marken] } : {}),
    ...(gefuellt.length > 0 ? { nummerntexte: Object.fromEntries(gefuellt) } : {}),
    ...(ohne.length > 0 ? { ohneNummer: ohne } : {}),
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
  if (!hatNummer(weg)) return daten.nummerntexte ?? {};
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
  farbenAus: readonly Markierungsfarbe[] = [],
): Markenergebnis {
  const ziel = nach === von ? null : nach;
  const alle = nummerierteMarken(daten.marken, { ohneNummer: daten.ohneNummer, farbenAus });
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

/**
 * Die Texte je Nummer, nachdem eine Marke wieder eine Nummer bekommt (Gegenstück zu
 * texteNachEntfernen): Texte dieser Farbe ab ihrer neuen Nummer rücken eine Nummer weiter.
 */
function texteNachEinfuegen(
  daten: Knotendaten,
  neu: Nummerierte,
): Readonly<Record<string, string>> {
  const buchstabe = FARBBUCHSTABE[neu.farbe];
  const ergebnis: Record<string, string> = {};
  for (const [schluessel, text] of Object.entries(daten.nummerntexte ?? {})) {
    const nummer = schluessel.startsWith(buchstabe) ? Number(schluessel.slice(1)) : 0;
    ergebnis[nummer >= neu.nummer ? buchstabe + (nummer + 1) : schluessel] = text;
  }
  return ergebnis;
}

/**
 * Schaltet die Nummer einer Marke aus oder wieder an; die Texte der folgenden Nummern wandern mit.
 *
 * Warum: Wunsch des Autors (1.11.2026): Ein Bereich aus mehreren Feldern oder mehrere gleichartige
 * Pfeile brauchen nicht je eine Nummer. Eingaben: Knotendaten, die Marke als Text („Gd4“), ob sie
 * ohne Nummer sein soll, die Farben ohne Nummern der Variante.
 * Beispiel: Gold d4, e4, d5 (1, 2, 3) mit Text „Zentrum“ an 3; e4 ohne Nummer → d5 wird Gold 2 und
 * behält „Zentrum“.
 * Sonderfall: Ihr eigener Text fällt beim Ausschalten weg (es gibt keine Nummer mehr dafür).
 */
export function mitNummerAus(
  daten: Knotendaten,
  text: string,
  aus: boolean,
  farbenAus: readonly Markierungsfarbe[] = [],
): Knotendaten {
  const vorher = nummerierteMarken(daten.marken, { ohneNummer: daten.ohneNummer, farbenAus });
  const marke = vorher.find((m) => m.text === text);
  if (!marke || hatNummer(marke) !== aus) return daten;
  const liste = daten.ohneNummer ?? [];
  const ohneNummer = aus ? [...liste, text] : liste.filter((m) => m !== text);
  if (aus) return aufgeraeumt(daten, daten.marken ?? [], texteNachEntfernen(daten, marke), ohneNummer);
  const danach = nummerierteMarken(daten.marken, { ohneNummer, farbenAus }).find((m) => m.text === text);
  const texte = danach ? texteNachEinfuegen(daten, danach) : daten.nummerntexte ?? {};
  return aufgeraeumt(daten, daten.marken ?? [], texte, ohneNummer);
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

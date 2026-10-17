/**
 * Hilfe für Referenztests: Stellungen und Markierungen der Buchabbildungen aus den erzeugten
 * Daten (public/daten/de/a1/kapNN.json), also genau aus dem LaTeX.
 *
 * Rolle im Gesamtbild: Jeder Grundbaustein wird an Buchabbildungen geprüft (Konzept 7.1,
 * „Jedes Werkzeug hat Testfälle aus den Buchabbildungen“). Kein Test im Namen, damit Vitest die
 * Datei nicht als Testdatei sammelt.
 */
import { readFileSync } from "node:fs";
import type { Bilanz } from "../daten/generiert/bilanz";
import { bilanzfaelleAus, type Bilanzfall } from "../training/buchbilanzen";
import type { Abbildung, Kapitel } from "../daten/generiert/kapitel";
import { feldAusName, stellungAusFen, type Feldindex, type Stellung } from "./stellung";
import { fortsetzungen, hauptlinie } from "./variantenbaum";

export type { Bilanzfall };

const ORDNER = new URL("../../public/daten/de/a1/", import.meta.url);
const kapitel = new Map<number, Kapitel>();

/** Die Daten eines Kapitels (kapNN.json), etwa für den Eröffnungsindex. */
export function ladeKapitel(nummer: number): Kapitel {
  const bekannt = kapitel.get(nummer);
  if (bekannt) return bekannt;
  const datei = `kap${String(nummer).padStart(2, "0")}.json`;
  const geladen = JSON.parse(readFileSync(new URL(datei, ORDNER), "utf8")) as Kapitel;
  kapitel.set(nummer, geladen);
  return geladen;
}

/** Die Abbildung mit dieser Nummer, etwa „7.30“. Wirft, wenn sie in den Daten fehlt. */
export function abbildung(nummer: string): Abbildung {
  const [kapitelnummer] = nummer.split(".");
  const gefunden = ladeKapitel(Number(kapitelnummer)).abbildungen.find((a) => a.id === nummer);
  if (!gefunden) throw new Error(`Abb. ${nummer} fehlt in den Daten`);
  return gefunden;
}

/** Die Stellung einer Abbildung. */
export function stellungVon(nummer: string): Stellung {
  const ergebnis = stellungAusFen(abbildung(nummer).fen);
  if (!ergebnis.ok) throw new Error(ergebnis.fehler);
  return ergebnis.wert;
}

/** Der nächste Zug im Buch (SAN, englisch) nach einer Abbildung, etwa „axb4“ nach Abb. 4.21. */
export function naechsterBuchzug(nummer: string): string | null {
  const bild = abbildung(nummer);
  const verknuepfung = bild.beispiel;
  if (!verknuepfung) return null;
  const kapitelnummer = Number(nummer.split(".")[0]);
  const beispiel = ladeKapitel(kapitelnummer).beispiele.find((b) => b.id === verknuepfung.id);
  return beispiel ? (fortsetzungen(beispiel, verknuepfung.pfad)[0]?.zug ?? null) : null;
}

/** Die Hauptvariante des Buches nach einer Abbildung (SAN, englisch), höchstens so viele Halbzüge. */
export function hauptlinieNach(nummer: string, anzahl = 8): string[] {
  const bild = abbildung(nummer);
  const verknuepfung = bild.beispiel;
  if (!verknuepfung) return [];
  const kapitelnummer = Number(nummer.split(".")[0]);
  const beispiel = ladeKapitel(kapitelnummer).beispiele.find((b) => b.id === verknuepfung.id);
  return beispiel ? hauptlinie(beispiel, verknuepfung.pfad, anzahl) : [];
}

/** Die Zugfolge bis zu einer Abbildung (Ausgangsstellung des Beispiels und Pfad), wie in der App. */
export function verlaufBis(nummer: string): { startFen: string; zuege: string[] } {
  const bild = abbildung(nummer);
  const verknuepfung = bild.beispiel;
  const kapitelnummer = Number(nummer.split(".")[0]);
  const beispiel = verknuepfung
    ? ladeKapitel(kapitelnummer).beispiele.find((b) => b.id === verknuepfung.id)
    : undefined;
  if (!verknuepfung || !beispiel) return { startFen: bild.fen, zuege: [] };
  return { startFen: beispiel.startFen, zuege: [...verknuepfung.pfad] };
}

/** Eine Stellung aus einer FEN, für Varianten der Buchstellungen („Stünde der Turm auf d7 …“). */
export function stellungAus(fen: string): Stellung {
  const ergebnis = stellungAusFen(fen);
  if (!ergebnis.ok) throw new Error(ergebnis.fehler);
  return ergebnis.wert;
}

/** Feldnummer zu einem Namen wie „d5“. Wirft bei ungültigen Namen. */
export function feld(name: string): Feldindex {
  const nummer = feldAusName(name);
  if (nummer === null) throw new Error(`Kein Feld: ${name}`);
  return nummer;
}

/** Alle Abbildungen aller Kapitel 0 bis 12. */
export function alleAbbildungen(): Abbildung[] {
  return Array.from({ length: 13 }, (_, n) => ladeKapitel(n).abbildungen).flat();
}

/**
 * Alle Bilanztabellen einer Art („ziel“ oder „faktor“) aus allen Kapiteln, für die Kalibrierung
 * der Werkzeuge (Konzept 13); die Zuordnung zur Abbildung macht training/buchbilanzen.ts.
 */
export function bilanzfaelle(art: Bilanz["art"]): Bilanzfall[] {
  return Array.from({ length: 13 }, (_, nummer) =>
    bilanzfaelleAus(ladeKapitel(nummer), art),
  ).flat();
}

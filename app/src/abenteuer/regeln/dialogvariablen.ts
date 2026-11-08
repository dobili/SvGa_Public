/**
 * Dialogvariablen, die die Hülle aus Ergebnissen setzt (Regelwerk, Abschnitt Dialoge; Vorschlag
 * von mittel-1, 08.11.2026): Ausgang einer Begegnung, bestandene Runde, Nadel eines Clubs. Die Ink-
 * Dateien deklarieren dieselben Namen als `VAR` und verzweigen danach.
 *
 * Namen: `ausgang` + Kennung der Begegnung ohne Punkt mit großen Anfangsbuchstaben
 * („mapleFalls.clubkampf“ → `ausgangMapleFallsClubkampf`, Wert „sieg“, „remis“, „niederlage“ oder
 * „abgebrochen“); Runde `<name>Bestanden` („mapleFalls.reiheSam“ → `reiheSamBestanden`, true);
 * Nadel `nadel<Ort>` („mapleFalls“ → `nadelMapleFalls`, 0 keine, 1 Bronze, 2 Silber, 3 Gold).
 * Reine Funktionen; die Oberwelt mischt das Ergebnis in `Abenteuerstand.dialogvariablen`.
 */
import type { Ausgang, Nadelstufe } from "../schnittstelle/partie";
import type { Abenteuerstand } from "../schnittstelle/spielstand";

type Variablen = Abenteuerstand["dialogvariablen"];

const NADELWERT: Readonly<Record<Nadelstufe, number>> = { bronze: 1, silber: 2, gold: 3 };

function grossAnfang(wort: string): string {
  return wort.charAt(0).toUpperCase() + wort.slice(1);
}

/** Variable zum Ausgang einer Begegnung: `ausgangMapleFallsClubkampf` = „sieg“. */
export function variablenNachPartie(begegnung: string, ausgang: Ausgang): Variablen {
  const name = begegnung.split(".").map(grossAnfang).join("");
  return { [`ausgang${name}`]: ausgang };
}

/**
 * Variablen zu einer bestandenen Runde: Kurzform `reiheSamBestanden` (wie in Akt 1) und Langform
 * mit Ort `wegMapleCedarTafelBestanden`, weil Kurzformen über Orte hinweg gleich sein können
 * (jede Rätseltafel heißt „tafel“). Nicht bestanden ändert nichts.
 */
export function variablenNachRunde(runde: string, bestanden: boolean): Variablen {
  if (!bestanden) return {};
  const teile = runde.split(".");
  const name = teile.pop() ?? runde;
  const ort = teile.join("");
  return { [`${name}Bestanden`]: true, [`${ort}${grossAnfang(name)}Bestanden`]: true };
}

/** Variable zu einem Fund: `gefundenSchluessel` = true (für Bedingungen in Dialogen). */
export function variablenNachFund(fund: string): Variablen {
  return { [`gefunden${grossAnfang(fund)}`]: true };
}

/** Variable zum ersten Besuch eines Ortes: `besuchtCedarCreek` = true (W2: Schnellreise frei). */
export function variablenNachBesuch(ort: string): Variablen {
  return { [`besucht${grossAnfang(ort)}`]: true };
}

/** Variable zur besten Nadel eines Clubs: `nadelMapleFalls` = 3 für Gold. */
export function variablenNachNadel(ort: string, nadel: Nadelstufe | null): Variablen {
  return { [`nadel${grossAnfang(ort)}`]: nadel ? NADELWERT[nadel] : 0 };
}

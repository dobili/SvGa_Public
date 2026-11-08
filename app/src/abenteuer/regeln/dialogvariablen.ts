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

/**
 * Variablen zum Ausgang einer Begegnung: `ausgangMapleFallsClubkampf` = „sieg“, dazu bei einem Sieg
 * der Zähler `siegeRivertonHarlan` (wie oft gewonnen; Ink fragt etwa „drei Siege“ ab, Harlans
 * Lupe, docs/spiel/05, Szene 31a). `bisher` sind die Variablen vor der Partie.
 */
export function variablenNachPartie(
  begegnung: string,
  ausgang: Ausgang,
  bisher: Variablen = {},
): Variablen {
  const name = begegnung.split(".").map(grossAnfang).join("");
  if (ausgang !== "sieg") return { [`ausgang${name}`]: ausgang };
  const alt = bisher[`siege${name}`];
  const siege = (typeof alt === "number" ? alt : 0) + 1;
  return { [`ausgang${name}`]: ausgang, [`siege${name}`]: siege };
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

/**
 * Variablen aus dem Besitz, beim Öffnen jedes Dialogs neu berechnet (nicht gespeichert):
 * `hatFahrrad`, `hatTaschenlampe` für Gegenstände, `hatKarteKuehlerKopf` für Hilfskarten,
 * `muenzen` als Zahl. So kann ein Dialog etwa das Schließfach nur mit Taschenlampe öffnen.
 */
export function variablenAusBesitz(stand: Abenteuerstand): Variablen {
  const variablen: Record<string, number | boolean> = { muenzen: stand.muenzen };
  for (const g of stand.gegenstaende) variablen[`hat${grossAnfang(g)}`] = true;
  for (const k of stand.karten) variablen[`hatKarte${grossAnfang(k.kennung)}`] = k.anzahl > 0;
  return variablen;
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

/**
 * Die Variablen nach einem Dialog: Ink gibt am Ende alle seine Variablen zurück, auch solche, die
 * die Hülle während des Dialogs gesetzt hat (gibFund setzt `gefundenSchluessel`, Ink kennt noch den
 * Startwert false). Was die Hülle seit dem Öffnen geändert hat, gewinnt deshalb gegen Ink
 * (Befund mittel-2, 8.11.2026: Albescu bot den Schuppen nie an).
 * Eingaben: Variablen beim Öffnen, Variablen der Hülle jetzt, Variablen aus Ink.
 * Beispiel: vorher {gefundenSchluessel: false}, jetzt {gefundenSchluessel: true}, Ink
 * {gefundenSchluessel: false, albescuGetroffen: true} → {gefundenSchluessel: true, albescuGetroffen: true}.
 */
export function variablenNachDialog(
  vorher: Variablen,
  jetzt: Variablen,
  ausInk: Variablen,
): Variablen {
  const vonDerHuelle = Object.fromEntries(
    Object.entries(jetzt).filter(([name, wert]) => vorher[name] !== wert),
  );
  return { ...jetzt, ...ausInk, ...vonDerHuelle };
}

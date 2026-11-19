/**
 * Ambroses Zeit-Hinweise in Partien mit Uhr (Wunsch des Autors, 19.11.2026): „Lass dir Zeit“,
 * wenn der Held in Stellungen mit echter Wahl deutlich schneller zieht als nötig, und „Du musst
 * schneller werden“, wenn seine Restzeit beim jetzigen Tempo nicht bis zum Ende reicht.
 *
 * Rolle im Gesamtbild: reine Regeln ohne React; anbindung/Zeithinweis.tsx misst nach jedem Zug des
 * Helden die Restzeit, fragt hier und lässt Ambrose in der Sprechblase unten sprechen.
 * Grundlagen: Die Zahl der noch zu erwartenden Züge folgt der verbreiteten Faustregel der
 * Zeiteinteilung, die Restzeit auf mindestens 20 bis 40 weitere Züge zu verteilen (so rechnen auch
 * Schachprogramme ohne Zugzahl-Vorgabe: Restzeit / erwartete Züge + Zuschlag). Die Lichess-Daten
 * der Bots (engine/bedenkzeit.ts) zeigen, dass Menschen je Zug einen mit der Zugnummer wachsenden
 * Anteil der Restzeit brauchen; wer ein Drittel des Möglichen nutzt, verschenkt Zeit.
 * Buchbezug: Kapitel 12, Zeiteinteilung (Zeitnot erzeugt Fehler, wer zu schnell zieht, übersieht
 * die Drohung).
 * Selten mit Absicht: frühestens ab dem 10. eigenen Zug (die Eröffnung kommt aus dem Kopf),
 * danach höchstens alle 8 eigenen Züge und höchstens zweimal je Partie; „zu schnell“ nur, wenn
 * mindestens vier der letzten fünf Züge eine echte Wahl hatten (kein Wiederschlag, nicht der
 * einzige Zug) und wirklich Zeit da ist (mindestens 10 Sekunden je Zug).
 * Abhängigkeiten: keine (Stellungsprüfung in regeln/zeithinweis-lage.ts).
 */

/** Die beiden Hinweise. */
export type Zeithinweisart = "zuSchnell" | "zuLangsam";

/** Was die Regel über die Partie wissen muss. */
export interface Zeitlage {
  readonly zuschlagMs: number;
  /** Bedenkzeit jedes eigenen Zuges in Millisekunden (gemessen; ältere Züge dürfen fehlen). */
  readonly genutztJeZug: readonly number[];
  /** Je gemessenem Zug: hatte der Held eine echte Wahl? (gleich lang wie genutztJeZug) */
  readonly echteWahl: readonly boolean[];
  /** Zahl der eigenen Züge der Partie (auch die nicht gemessenen). */
  readonly eigeneZuege: number;
  /** Restzeit des Helden jetzt. */
  readonly restMs: number;
  /** Nach welchem eigenen Zug kam der letzte Hinweis (null: noch keiner)? */
  readonly letzterHinweisNachZug: number | null;
  /** Wie viele Hinweise es in dieser Partie schon gab. */
  readonly bisherige: number;
}

/** Feste Werte der Regel (oben begründet). */
export const ZEITHINWEIS_REGELN = {
  abZug: 10,
  abstandZuege: 8,
  hoechstens: 2,
  fenster: 5,
  echteWahlMindestens: 4,
  erwarteteZuegeMindestens: 20,
  zuegeJePartie: 40,
  /** „Zu schnell“: Schnitt unter diesem Anteil der möglichen Zeit je Zug. */
  schnellAnteil: 0.35,
  /** „Zu schnell“ nur, wenn je Zug mindestens so viel Zeit da wäre. */
  sollMindestensMs: 10_000,
  /** „Zu langsam“: Restzeit unter diesem Anteil des hochgerechneten Bedarfs. */
  langsamAnteil: 0.7,
} as const;

/** Erwartete weitere eigene Züge: mindestens 20, sonst bis Zug 40. Beispiel: Zug 12 → 28. */
export function erwarteteZuege(eigeneZuege: number): number {
  const r = ZEITHINWEIS_REGELN;
  return Math.max(r.erwarteteZuegeMindestens, r.zuegeJePartie - eigeneZuege);
}

/**
 * Die Bedenkzeit jedes eigenen Zuges aus der Restzeit nach jedem Zug.
 * Eingaben: Restzeit vor dem ersten gemessenen Zug und nach jedem Zug, Zuschlag, ob der erste
 * Wert vor dem allerersten Zug der Partie liegt und der Held anfing (dann ohne Zuschlag, die Uhr
 * startet erst mit diesem Zug, spiel/uhr.ts).
 * Beispiel: [600 000, 590 000, 585 000], Zuschlag 5000 → [15 000, 10 000].
 */
export function genutztAusRestzeiten(
  restzeiten: readonly number[],
  zuschlagMs: number,
  ersterOhneZuschlag: boolean,
): number[] {
  return restzeiten.slice(1).map((rest, i) => {
    const zuschlag = i === 0 && ersterOhneZuschlag ? 0 : zuschlagMs;
    return Math.max(0, (restzeiten[i] ?? rest) - rest + zuschlag);
  });
}

/** Die letzten Einträge einer Liste. */
function letzte<T>(liste: readonly T[], anzahl: number): T[] {
  return liste.slice(Math.max(0, liste.length - anzahl));
}

/** Darf jetzt überhaupt ein Hinweis kommen (Zugzahl, Abstand, Höchstzahl, genug Messung)? */
function darfSprechen(lage: Zeitlage): boolean {
  const r = ZEITHINWEIS_REGELN;
  if (lage.eigeneZuege < r.abZug || lage.bisherige >= r.hoechstens) return false;
  if (lage.genutztJeZug.length < r.fenster) return false;
  const seit = lage.letzterHinweisNachZug;
  return seit === null || lage.eigeneZuege - seit >= r.abstandZuege;
}

/**
 * Der fällige Hinweis oder null.
 *
 * „zuLangsam“ (geht vor): Zieht der Held weiter so wie in den letzten fünf Zügen, braucht er für
 * die erwarteten Züge (Schnitt − Zuschlag) × erwartete Züge; ist die Restzeit kleiner als 70 %
 * davon, reicht sie hochgerechnet deutlich nicht.
 * „zuSchnell“: Möglich wären Restzeit / erwartete Züge + Zuschlag je Zug; der Schnitt der letzten
 * fünf Züge liegt unter 35 % davon, mindestens vier davon hatten eine echte Wahl, und es wären
 * mindestens 10 Sekunden je Zug da.
 * Beispiel: 10 + 5, Zug 12, 9 Minuten übrig, zuletzt 3 Sekunden je Zug → möglich 540/28 + 5 ≈ 24 s,
 * 3 < 8,4 → „zuSchnell“. 3 + 2, Zug 15, 40 Sekunden übrig, zuletzt 8 Sekunden je Zug → Bedarf
 * (8 − 2) × 25 = 150 s, 40 < 105 → „zuLangsam“.
 */
export function zeithinweis(lage: Zeitlage): Zeithinweisart | null {
  if (!darfSprechen(lage)) return null;
  const r = ZEITHINWEIS_REGELN;
  const zeiten = letzte(lage.genutztJeZug, r.fenster);
  const schnitt = zeiten.reduce((a, b) => a + b, 0) / zeiten.length;
  const erwartet = erwarteteZuege(lage.eigeneZuege);
  const bedarf = Math.max(0, schnitt - lage.zuschlagMs) * erwartet;
  if (lage.restMs < r.langsamAnteil * bedarf) return "zuLangsam";
  const moeglich = lage.restMs / erwartet + lage.zuschlagMs;
  const wahl = letzte(lage.echteWahl, r.fenster).filter(Boolean).length;
  if (moeglich < r.sollMindestensMs || wahl < r.echteWahlMindestens) return null;
  return schnitt < r.schnellAnteil * moeglich ? "zuSchnell" : null;
}

/**
 * Darf Ambrose in dieser Lage des Spiels überhaupt Zeit-Hinweise geben? Erst nach der ersten
 * Clubnadel (Dialogvariable `nadel<Ort>` ≥ 1, regeln/dialogvariablen.ts): Am Anfang der
 * Geschichte lernt der Held noch die Regeln, da stört eine Uhr-Ermahnung. Ist Ambrose nicht da
 * (regeln/abwesenheit.ts), schweigt er; das prüft der Aufrufer.
 * Beispiel: { nadelMapleFalls: 1 } → ja; {} → nein.
 */
export function zeithinweiseFreigeschaltet(
  variablen: Readonly<Record<string, string | number | boolean>>,
): boolean {
  return Object.entries(variablen).some(
    ([name, wert]) => name.startsWith("nadel") && typeof wert === "number" && wert >= 1,
  );
}

/** So viele Sätze gibt es je Art (Texte `tisch.ambrose.<art>.<1 bis 4>` in texte/de.json). */
export const ZEITHINWEIS_SAETZE = 4;

/**
 * Welcher Satz: wechselt mit der Zahl der bisherigen Hinweise und hängt an der Partie, damit in
 * einer Partie kein Satz zweimal kommt und Partien verschieden klingen.
 * Beispiel: Kennung „p1“, erster Hinweis → ein fester Satz von vier; der zweite ist ein anderer.
 */
export function zeithinweisSatz(partiekennung: string, bisherige: number): number {
  let summe = 0;
  for (const zeichen of partiekennung) summe = (summe + zeichen.charCodeAt(0)) % ZEITHINWEIS_SAETZE;
  return (summe + bisherige) % ZEITHINWEIS_SAETZE;
}

/**
 * Elo-Leiter aus Spielergebnissen: Stärkeunterschiede der Stufen und Bots aus ihren Partien
 * gegeneinander, verankert an der Skala von „Deine Spielstärke“.
 *
 * Rolle im Gesamtbild: Rückfrage S23 (Elo-Angaben der Bot-Stufen, Empfehlung vom 18.10.2026):
 * Die Genauigkeit einer Bot-Partie taugt nicht als Maßstab je Bot (die Kurven ziehen zur Mitte,
 * die Genauigkeit hängt vom Gegner ab, Bots machen andere Fehler als Menschen). Die Abstände
 * kommen deshalb aus den Ergebnissen (Modell von Bradley und Terry mit der Elo-Formel), die Lage
 * der ganzen Leiter aus wenigen Ankern: Stufen, die gegen sich selbst gespielt haben und deren
 * Genauigkeit über die Rechnung von „Deine Spielstärke“ eine Zahl ergibt. Reine Rechnung; der
 * Messlauf engine/botstaerke.messung.ts liefert die Daten.
 * Abhängigkeiten: keine.
 */

/** Ein Ergebnis zwischen zwei Spielern: Punkte von a aus n Partien (Remis halb). */
export interface Begegnung {
  readonly a: string;
  readonly b: string;
  readonly punkteA: number;
  readonly partien: number;
}

/** Ein Anker: ein Spieler und seine Zahl auf der Zielskala. */
export interface Anker {
  readonly spieler: string;
  readonly wert: number;
}

/** Elo: 400 Punkte Unterschied bedeuten eine Erwartung von etwa 91 zu 9. */
const ELO_TEILER = 400;
const ELO_BASIS = 10;
/**
 * Gedachtes Remis je Begegnung (wie bei Bayeselo): Ohne es läuft ein Ergebnis wie 10 : 0 ins
 * Unendliche. Ein Remis aus einer Partie zieht 10 : 0 auf 10,5 : 0,5, also etwa 520 Punkte.
 */
const GEDACHTE_PARTIEN = 1;
const HALB = 0.5;
/**
 * Schrittweite des Verfahrens: Punkteüberschuss je Partie mal 300. Stabil, solange sie unter dem
 * doppelten Newton-Schritt bei ausgeglichenem Spiel liegt (400 / (ln 10 · 0,25) ≈ 695, doppelt
 * etwa 1390); kleiner wäre bei klaren Ergebnissen wie 10 : 0 sehr langsam.
 */
const SCHRITTE = 20000;
const SCHRITTWEITE = 300;
const GENAU_GENUG = 1e-6;

/** Erwartete Punkte von a gegen b nach der Elo-Formel. */
export function erwartet(ra: number, rb: number): number {
  return 1 / (1 + ELO_BASIS ** ((rb - ra) / ELO_TEILER));
}

/** Die Begegnungen mit dem gedachten Remis. */
function mitGedachtemRemis(begegnungen: readonly Begegnung[]): Begegnung[] {
  return begegnungen.map((g) => ({
    ...g,
    punkteA: g.punkteA + HALB * GEDACHTE_PARTIEN,
    partien: g.partien + GEDACHTE_PARTIEN,
  }));
}

/** Ein Schritt: jeder Spieler bewegt sich um seinen Punkteüberschuss je Partie. */
function schritt(werte: Map<string, number>, begegnungen: readonly Begegnung[]): number {
  const ueberschuss = new Map<string, number>();
  const zahl = new Map<string, number>();
  for (const g of begegnungen) {
    const e = erwartet(werte.get(g.a) ?? 0, werte.get(g.b) ?? 0) * g.partien;
    ueberschuss.set(g.a, (ueberschuss.get(g.a) ?? 0) + g.punkteA - e);
    ueberschuss.set(g.b, (ueberschuss.get(g.b) ?? 0) - (g.punkteA - e));
    zahl.set(g.a, (zahl.get(g.a) ?? 0) + g.partien);
    zahl.set(g.b, (zahl.get(g.b) ?? 0) + g.partien);
  }
  let groesste = 0;
  for (const [spieler, u] of ueberschuss) {
    const bewegung = (SCHRITTWEITE * u) / Math.max(1, zahl.get(spieler) ?? 1);
    werte.set(spieler, (werte.get(spieler) ?? 0) + bewegung);
    groesste = Math.max(groesste, Math.abs(bewegung));
  }
  return groesste;
}

/**
 * Die Leiter: je Spieler eine Zahl, deren Abstände die Ergebnisse am besten erklären (größte
 * Wahrscheinlichkeit, mit gedachtem Remis je Begegnung). Der Nullpunkt ist willkürlich (Mittel 0).
 *
 * Eingaben: Begegnungen (ein Spieler darf in vielen vorkommen). Ausgabe: Zahl je Spieler.
 * Beispiel: Stufe 1 gegen 2 mit 0 : 10, Bot „1@leon“ gegen 1 mit 4 : 2 und gegen 2 mit 0 : 6 →
 * Stufe 2 etwa 500 über Stufe 1, Leon etwa 100 über Stufe 1.
 * Sonderfall: Spieler ohne Verbindung zum Rest bleiben bei 0 (keine Aussage möglich).
 */
export function leiter(begegnungen: readonly Begegnung[]): Map<string, number> {
  const mit = mitGedachtemRemis(begegnungen);
  const werte = new Map<string, number>();
  for (const g of mit) {
    werte.set(g.a, 0);
    werte.set(g.b, 0);
  }
  for (let i = 0; i < SCHRITTE; i += 1) {
    if (schritt(werte, mit) < GENAU_GENUG) break;
  }
  const mittel = [...werte.values()].reduce((s, x) => s + x, 0) / Math.max(1, werte.size);
  for (const [k, v] of werte) werte.set(k, v - mittel);
  return werte;
}

/** Ergebnis der Verankerung: die verschobene Leiter, die Verschiebung und die Abweichung je Anker. */
export interface Verankerung {
  readonly werte: Map<string, number>;
  readonly verschiebung: number;
  readonly abweichungen: readonly { readonly spieler: string; readonly abweichung: number }[];
}

/**
 * Verschiebt die Leiter so, dass sie im Mittel auf die Anker passt (eine gemeinsame
 * Verschiebung; die Abstände bleiben die der Ergebnisse). Die Abweichung je Anker zeigt, wie gut
 * Ergebnisse und Genauigkeit zusammenpassen.
 * Beispiel: Leiter Stufe 3 bei −100, Anker Stufe 3 bei 1000 → Verschiebung 1100.
 * Sonderfall: Ohne einen Anker auf der Leiter wirft die Funktion einen Fehler.
 */
export function verankere(werte: Map<string, number>, anker: readonly Anker[]): Verankerung {
  const passende = anker.filter((a) => werte.has(a.spieler));
  if (passende.length === 0) throw new Error("Kein Anker liegt auf der Leiter");
  const verschiebung =
    passende.reduce((s, a) => s + a.wert - (werte.get(a.spieler) ?? 0), 0) / passende.length;
  const verschoben = new Map([...werte].map(([k, v]) => [k, v + verschiebung] as const));
  const abweichungen = passende.map((a) => ({
    spieler: a.spieler,
    abweichung: (verschoben.get(a.spieler) ?? 0) - a.wert,
  }));
  return { werte: verschoben, verschiebung, abweichungen };
}

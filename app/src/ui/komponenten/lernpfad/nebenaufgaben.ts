/**
 * Nebenaufgaben auf dem Lernpfad „Dein Weg durchs Buch“ (Wunsch des Autors, 31.10.2026): Alles,
 * was man in der App schaffen kann, steht als kleines Bündel neben dem Kapitel, zu dem es vom
 * Niveau und vom Thema her am besten passt. Der Hauptweg bleibt; die Nebenaufgaben muss man für
 * den Weg nicht haben. Reine Daten und Funktionen.
 *
 * Rolle im Gesamtbild: Die Orden und Abzeichen kommen fertig aus der Karte „Deine Erfolge“
 * (erfolge/useErfolge.ts); die Orden der Teile fehlen hier, weil sie schon am Ende jeder Etappe
 * stehen. ZUORDNUNG sagt je Stück, bei welchem Kapitel es steht (Begründung je Zeile; die Tabelle
 * steht auch im Bericht an den Autor). Ein neues Stück ohne Zeile steht beim letzten Kapitel, und
 * ein Test meldet es, damit jemand eine Zeile einträgt. Dazu kommen je Kapitel die
 * Kapitelaufgaben (kapitelaufgaben.ts): Übungen, Lernziele und Trainer des Kapitels.
 * Abhängigkeiten: erfolge/erfolgsstuecke.ts (Typ, Schlüssel).
 */
import { verdientSchluessel, type Erfolgsstueck } from "../erfolge/erfolgsstuecke";

/** Das letzte Kapitel; dort stehen Stücke ohne Zeile in ZUORDNUNG. */
export const LETZTES_KAPITEL = 12;

/**
 * Bei welchem Kapitel ein Stück steht (Schlüssel wie in „verdient“). Leitlinien: Spielen-Ziele
 * nach Spielstärke (Stufe n der Bots ≈ 300·n Elo; das Buch führt bis etwa 2000), Lern-Ziele nach
 * dem Kapitel, das das Werkzeug einführt, Ausdauer-Ziele dorthin, wo man ungefähr so lange dabei
 * ist. Ziele über dem Niveau des Buches stehen am Ende.
 */
export const ZUORDNUNG: Readonly<Record<string, number>> = {
  // Kapitel 0, Einstieg: die ersten Schritte in App und Buch.
  "abzeichen:erstePartie": 0,
  "abzeichen:ersteUebung": 0,
  // Kapitel 1, Grundprinzipien: erste Siege gegen die leichtesten Bots (Stufe 1–3, bis 900).
  "abzeichen:ersterSieg": 1,
  "abzeichen:erstesMatt": 1,
  "abzeichen:kapitelUebungen": 1,
  "orden:bots-1-3-einmal": 1,
  // Kapitel 2, Eröffnungssysteme: regelmäßig spielen und nach dem Warum der Züge fragen.
  "abzeichen:partien10": 2,
  "abzeichen:warum": 2,
  "abzeichen:woche": 2,
  // Kapitel 3, Gambits: Material für Aktivität geben, der brillante Zug ist ein Opfer.
  "abzeichen:brillant": 3,
  "orden:bots-1-3-alle": 3,
  // Kapitel 4, Fallenkabinett: schnelle Matts; Rivalen auf dem eigenen Niveau.
  "abzeichen:kurzerProzess": 4,
  "abzeichen:rivalen3": 4,
  // Kapitel 5, Bauernstrukturen: Stufe 4–5 (1200–1500), erste Themen in Gold, vier Wochen dabei.
  "orden:bots-4-5-einmal": 5,
  "abzeichen:erstesGold": 5,
  "abzeichen:wochenziel4": 5,
  // Kapitel 6, Mittelspielstrategie: selbst einschätzen und ohne Hilfen gewinnen.
  "abzeichen:eingeschaetzt": 6,
  "abzeichen:siegOhneHilfe": 6,
  "abzeichen:partien50": 6,
  // Kapitel 7, Taktik: Taktikmotive, Rekorde der Taktik, Sieg gegen Stärkere.
  "abzeichen:siegGegenStaerkeren": 7,
  "abzeichen:alleTaktikGold": 7,
  "abzeichen:dreiRekorde": 7,
  "orden:bots-4-5-alle": 7,
  // Kapitel 8, Endspiel-Fundament: Umwandlung, Drill in den Trainern, Themen in Silber.
  "abzeichen:umwandlung": 8,
  "abzeichen:trainer": 8,
  "abzeichen:fuenfSilber": 8,
  // Kapitel 9, Endspiel-Vertiefung: Stufe 6–7 (1800–2100), zwölf gute Wochen.
  "orden:bots-6-7-einmal": 9,
  "abzeichen:wochenziel12": 9,
  // Kapitel 10, Studien und Kuriositäten: Remis gegen Stärkere halten, Aufträge eines Monats.
  "abzeichen:remisGegenStaerkeren": 10,
  "abzeichen:auftraege8": 10,
  // Kapitel 11, Beispielpartien: viele Partien, alle Abbildungen, Stufe 6–7 in allen Zeitarten.
  "abzeichen:partien100": 11,
  "abzeichen:rivalen10": 11,
  "orden:bots-6-7-alle": 11,
  "orden:bots-8-9-einmal": 11,
  "orden:abbildungen": 11,
  // Kapitel 12, Trainingsmethodik: Lernsammlung, Fehlerdatenbank, Ziele (Werkzeuge des
  // Kapitels), die Orden über das ganze Buch und was über das Niveau des Buches hinausgeht.
  "abzeichen:sammlung": 12,
  "abzeichen:fehler": 12,
  "abzeichen:zehnZiele": 12,
  "orden:uebungen": 12,
  "orden:lernziele": 12,
  "orden:trainer": 12,
  "orden:bots-8-9-alle": 12,
  "orden:engine": 12,
};

/** Ist das ein Orden eines Buchteils? Der steht schon am Ende seiner Etappe. */
function istTeilorden(stueck: Erfolgsstueck): boolean {
  return stueck.ring?.startsWith("ich-teil-") ?? false;
}

/** Kapitel eines Stücks; ohne Zeile das letzte. Beispiel: „abzeichen:warum“ → 2. */
export function kapitelDesStuecks(stueck: Erfolgsstueck): number {
  return ZUORDNUNG[verdientSchluessel(stueck)] ?? LETZTES_KAPITEL;
}

/**
 * Die Nebenaufgaben je Kapitel: erst die Kapitelaufgaben, dann Orden und Abzeichen nach
 * ZUORDNUNG; doppelte Stücke (in zwei Regalen) zählen einmal, Orden der Teile fehlen.
 *
 * Eingaben: alle Stücke der Karte „Deine Erfolge“, die Kapitelnummern des Buches, die
 * Kapitelaufgaben je Kapitel. Ausgabe: Kapitelnummer → Stücke (Kapitel ohne Stück fehlen).
 * Beispiel: Kapitel 0 → [Übungen Kapitel 0, Lernziele Kapitel 0, Trainer Kapitel 0, Erste Partie,
 * Erste Übung].
 */
export function nebenaufgabenJeKapitel(
  stuecke: readonly Erfolgsstueck[],
  kapitel: readonly number[],
  aufgaben: (kapitel: number) => readonly Erfolgsstueck[],
): Map<number, Erfolgsstueck[]> {
  const ergebnis = new Map<number, Erfolgsstueck[]>(kapitel.map((k) => [k, [...aufgaben(k)]]));
  const letztes = kapitel.at(-1) ?? LETZTES_KAPITEL;
  const gesehen = new Set<string>();
  for (const stueck of stuecke) {
    const schluessel = verdientSchluessel(stueck);
    if (istTeilorden(stueck) || gesehen.has(schluessel)) continue;
    gesehen.add(schluessel);
    const ziel = kapitelDesStuecks(stueck);
    const liste = ergebnis.get(ziel) ?? ergebnis.get(letztes);
    liste?.push(stueck);
  }
  for (const [k, liste] of ergebnis) if (liste.length === 0) ergebnis.delete(k);
  return ergebnis;
}

/**
 * Das Stück, dessen Bild auf dem Bündel steht: das erste verdiente (farbig, als Lohn); null, wenn
 * noch keins verdient ist (dann zeigt das Bündel einen Stern statt einer grauen Silhouette, die
 * auf der Landschaft wie ein leerer Platzhalter aussah, Bildschirmfoto 31.10.2026).
 */
export function titelstueck(stuecke: readonly Erfolgsstueck[]): Erfolgsstueck | null {
  return stuecke.find((s) => s.verdient) ?? null;
}

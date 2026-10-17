/**
 * Eine Partie gegen die Engine: Einstellung, Züge beider Seiten, Rücknahme, Ende.
 *
 * Rolle im Gesamtbild: Pflichtenheft 5.2 „Spielen gegen die Engine“: aus jeder Stellung (Grund-
 * stellung, Buchabbildung, Trainerstellung) zu Ende spielen, Seite und Stufe wählen, Züge
 * zurücknehmen (abschaltbar). Ein Spielziel gibt es seit 0.2.33 nicht mehr (Entscheidung des
 * Autors, 16.10.2026): Ziel ist immer der Sieg. Alle Funktionen sind rein: Sie geben eine neue Partie zurück und ändern die alte nicht. So lässt
 * sich die Partie speichern (speicher/) und nach einem Neuladen fortsetzen.
 * Abhängigkeiten: chessops, spiel/zuege.ts, spiel/ergebnis.ts, spiel/uhr.ts, engine/fehlerart.ts.
 */
import type { Color } from "chessops/types";
import type { Fehlerart } from "../engine/fehlerart";
import type { Stufennummer } from "../engine/stufen";
import type { Phase } from "../schach/phase";
import { partieendeDurchZeit, partieendeNach, type Partieende } from "./ergebnis";
import { neueUhr, type Uhreinstellung, type Uhrstand } from "./uhr";
import { fenNach, regelstellung } from "./zuege";

/** Wert von `eroeffnung`, wenn die Engine irgendeiner Variante des Buches folgen soll. */
export const EROEFFNUNG_BUCH = "buch";

/** Gegner: die Engine oder ein Mensch am selben Gerät (beide Seiten selbst spielen, 0.2.41). */
export type Gegnerart = "engine" | "mensch";

/** Spielhilfen während der Partie (0.2.41, vor der Partie zuschaltbar). */
export interface Spielhilfen {
  /** Die Symbole am Brett: Zählen, Röntgen, Warnsignale. */
  readonly symbole: boolean;
  /** Die Bündel mit den Werkzeugen unter dem Brett und der Hinweis. */
  readonly werkzeuge: boolean;
}

export interface Partieeinstellung {
  readonly startFen: string;
  /** Die Seite des Lesers. */
  readonly eigeneFarbe: Color;
  /** Stufe im Mittelspiel (zugleich die „Stufe“ der Partie in Anzeige und PGN). */
  readonly stufe: Stufennummer;
  /**
   * Stufe je Phase (Wunsch des Autors, 0.2.40): Die Engine folgt der Phase der Stellung
   * (spiel/phasen.ts) und wechselt Zug für Zug um höchstens eine Stufe (engine/stufen.ts).
   */
  readonly stufenJePhase: Readonly<Record<Phase, Stufennummer>>;
  /** null: ohne Uhr. */
  readonly uhr: Uhreinstellung | null;
  readonly ruecknahmeErlaubt: boolean;
  /** Abbildungsnummer, wenn die Partie an einer Abbildung begann („1.26“), sonst null. */
  readonly abbildung: string | null;
  /** Gegner (0.2.41): die Engine oder ein Mensch am selben Gerät. */
  readonly gegner: Gegnerart;
  /** Kennung eines vorgefertigten Gegners (engine/gegner.ts), sonst null (eigene Stufen). */
  readonly bot: string | null;
  readonly hilfen: Spielhilfen;
  /** Zählt die Partie für die Wertung des Lesers (spiel/wertung.ts)? */
  readonly gewertet: boolean;
  /**
   * Eröffnung, der die Engine folgen soll (Name aus dem Eröffnungsindex, seit 0.2.39);
   * EROEFFNUNG_BUCH: irgendeine Variante des Buches (Buchtreue 0,85); null: die Engine spielt die
   * Eröffnung selbst, ohne Buch (Wunsch des Autors, 0.2.40).
   */
  readonly eroeffnung: string | null;
}

/** Ein Halbzug der Partie. Bei Engine-Zügen mit Herkunft und, falls absichtlich, Fehlerart. */
export interface Partiezug {
  readonly san: string;
  readonly von: "leser" | "engine";
  readonly quelle: "leser" | "buch" | "engine" | "fehler";
  readonly fehler: Fehlerart | null;
  /** Verlust des absichtlichen Fehlers in Bauerneinheiten, sonst 0. */
  readonly verlust: number;
  /** Bei Zügen der Engine: die Stufe, mit der sie diesen Zug gespielt hat (seit 0.2.40). */
  readonly stufe?: Stufennummer;
}

export interface Partie {
  readonly id: string;
  /** Beginn als ISO-Zeit („2026-10-15T08:00:00.000Z“). */
  readonly begonnen: string;
  readonly einstellung: Partieeinstellung;
  readonly zuege: readonly Partiezug[];
  /** Wie oft der Leser zurückgenommen hat (für die Auswertung). */
  readonly ruecknahmen: number;
  readonly uhr: Uhrstand | null;
  readonly ende: Partieende | null;
}

/**
 * Beginnt eine neue Partie.
 *
 * Eingaben: Einstellung, eindeutige Kennung, Beginn als ISO-Zeit (für Tests fest).
 * Ausgabe: Partie ohne Züge, oder null, wenn die Startstellung keine spielbare Stellung ist
 * (Lehrbild ohne König, regelwidrige Stellung, schon Matt oder Patt).
 * Beispiel: Abb. 1.26, Leser spielt Weiß, Stufe 1 → Partie, Weiß am Zug.
 */
export function neuePartie(
  einstellung: Partieeinstellung,
  id: string,
  begonnen: string,
): Partie | null {
  if (!spielbar(einstellung.startFen)) return null;
  const uhr = einstellung.uhr ? neueUhr(einstellung.uhr) : null;
  return { id, begonnen, einstellung, zuege: [], ruecknahmen: 0, uhr, ende: null };
}

/** Kann man aus dieser Stellung eine Partie beginnen (legal, mit Zügen, beide Könige)? */
export function spielbar(fen: string): boolean {
  const pos = regelstellung(fen);
  return pos !== null && !pos.isEnd();
}

/** Alle Stellungen der Partie, von der Startstellung bis zur aktuellen. */
export function stellungen(partie: Partie): string[] {
  const liste = [partie.einstellung.startFen];
  for (const zug of partie.zuege) {
    const naechste = fenNach(liste[liste.length - 1] ?? "", zug.san);
    if (!naechste) break;
    liste.push(naechste);
  }
  return liste;
}

/** Die aktuelle Stellung. */
export function aktuelleFen(partie: Partie): string {
  const alle = stellungen(partie);
  return alle[alle.length - 1] ?? partie.einstellung.startFen;
}

/** Wer ist am Zug? */
export function amZug(partie: Partie): Color {
  return aktuelleFen(partie).split(" ")[1] === "b" ? "black" : "white";
}

/** Ist der Leser am Zug und läuft die Partie noch? */
export function leserAmZug(partie: Partie): boolean {
  if (partie.ende) return false;
  // Mensch gegen Mensch (0.2.41): Es zieht immer ein Mensch.
  if (partie.einstellung.gegner === "mensch") return true;
  return amZug(partie) === partie.einstellung.eigeneFarbe;
}

/**
 * Hängt einen Zug an und prüft danach das Ende.
 *
 * Warum: Leser und Engine ziehen über dieselbe Funktion; die Oberfläche drückt danach die Uhr
 * (spiel/uhr.ts). Ausgabe: neue Partie oder null, wenn der Zug nicht legal ist oder die Partie
 * schon zu Ende ist. Beispiel: Grundstellung, Leser Weiß, „e4“ → ein Zug, Schwarz am Zug.
 */
export function ziehe(partie: Partie, zug: Partiezug): Partie | null {
  if (partie.ende) return null;
  const vorher = stellungen(partie);
  const danach = fenNach(vorher[vorher.length - 1] ?? "", zug.san);
  if (!danach) return null;
  const ende = partieendeNach([...vorher, danach]);
  return { ...partie, zuege: [...partie.zuege, zug], ende };
}

/** Ein Zug des Lesers. */
export function leserzug(san: string): Partiezug {
  return { san, von: "leser", quelle: "leser", fehler: null, verlust: 0 };
}

/**
 * Nimmt den letzten eigenen Zug zurück, samt der Antwort der Engine, falls schon gespielt.
 *
 * Warum: Pflichtenheft 5.2 „Zugrücknahme (abschaltbar)“. Danach ist wieder der Leser am Zug,
 * ein Partieende (etwa Matt durch die Engine) ist aufgehoben.
 * Ausgabe: neue Partie oder null, wenn Rücknahme abgeschaltet ist oder kein eigener Zug existiert.
 * Beispiel: 1. e4 e5 → Rücknahme → Grundstellung, Weiß am Zug.
 */
export function nimmZurueck(partie: Partie): Partie | null {
  if (!partie.einstellung.ruecknahmeErlaubt) return null;
  const letzterEigener = partie.zuege.map((z) => z.von).lastIndexOf("leser");
  if (letzterEigener < 0) return null;
  return {
    ...partie,
    zuege: partie.zuege.slice(0, letzterEigener),
    ruecknahmen: partie.ruecknahmen + 1,
    ende: null,
  };
}

/** Der Leser gibt auf; die Engine gewinnt. */
export function gibAuf(partie: Partie): Partie {
  if (partie.ende) return partie;
  const engineFarbe: Color = partie.einstellung.eigeneFarbe === "white" ? "black" : "white";
  return { ...partie, ende: { art: "aufgabe", sieger: engineFarbe } };
}

/** Die Zeit einer Seite ist abgelaufen. */
export function zeitUeberschritten(partie: Partie, farbe: Color): Partie {
  if (partie.ende) return partie;
  return { ...partie, ende: partieendeDurchZeit(aktuelleFen(partie), farbe) };
}

/** Neuer Uhrstand (die Oberfläche rechnet ihn mit spiel/uhr.ts aus). */
export function mitUhr(partie: Partie, uhr: Uhrstand): Partie {
  return { ...partie, uhr };
}

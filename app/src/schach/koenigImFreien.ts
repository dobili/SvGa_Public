/**
 * König im Freien: Der König steht ohne Bauernschild, und gegnerische Figuren greifen seine
 * Nachbarfelder an.
 *
 * Rolle im Gesamtbild: Baustein für den Sicherheitsblick (Frage 1, „Steht mein König nach dem
 * Zug sicher?“) und für die Kandidaten der Denkroutine (Schritt 4: „zähle erst dann nach:
 * Material, Königssicherheit, Aktivität“). Vorher wertete der Sicherheitsblick einen König mit
 * freien Nachbarfeldern als sicher, auch mitten zwischen gegnerischen Figuren (Befund C1.29).
 * Abhängigkeiten: chessops, koenigsumgebung.ts, bauernprofil.ts, stellung.ts.
 * Buchbezug: Kapitel 12, Abb. 12.3: „Nach 3... f5 4. Sxe6 greift der Springer Dame und Turm
 * zugleich an, und der König steht weiter im Freien.“ Glossar „Bauernschild: Die drei Bauern
 * direkt vor dem rochierten König“.
 */
import type { Board } from "chessops/board";
import type { Color, Square } from "chessops/types";
import { squareFile } from "chessops/util";
import { eigeneReihe } from "./bauernprofil";
import { koenigsumgebung } from "./koenigsumgebung";
import { gegner, type Stellung } from "./stellung";

/** Ein Schildbauer steht höchstens so viele Reihen vor dem König (direkt davor oder eins weiter). */
const SCHILD_TIEFE = 2;
/** Die eigene Grundreihe (Reihe aus eigener Sicht, gezählt ab 0). */
const GRUNDREIHE = 0;
/** Mit weniger als zwei Bauern vor sich steht der König ohne Bauernschild. */
const MINDEST_SCHILDBAUERN = 2;
/** Erst ab zwei angegriffenen Nachbarfeldern spricht die App vom König im Freien. */
const MINDEST_ANGEGRIFFENE_NACHBARN = 2;

/** Eigene Bauern auf der Königslinie und den Nachbarlinien, ein oder zwei Reihen vor dem König. */
function schildbauern(brett: Board, koenig: Square, farbe: Color): number {
  const reihe = eigeneReihe(koenig, farbe);
  return [...brett.pieces(farbe, "pawn")].filter((bauer) => {
    const abstand = eigeneReihe(bauer, farbe) - reihe;
    return (
      Math.abs(squareFile(bauer) - squareFile(koenig)) <= 1 &&
      abstand >= 1 &&
      abstand <= SCHILD_TIEFE
    );
  }).length;
}

/**
 * Prüft, ob der König einer Farbe im Freien steht, und nennt die angegriffenen Nachbarfelder.
 *
 * Warum: „Der König hat 3 freie Nachbarfelder“ klingt nach Sicherheit; das Buch sagt bei
 * Abb. 12.3 das Gegenteil. Regel (Empfehlung C1.29, vom Autor bestätigt): Der König steht im
 * Freien, wenn er seine Grundreihe verlassen hat, ohne Bauernschild steht (weniger als zwei
 * eigene Bauern direkt vor ihm oder ein Feld weiter, auf seiner Linie und den Nachbarlinien) und
 * der Gegner mindestens zwei seiner Nachbarfelder angreift, die keine eigene Figur besetzt.
 * Eingaben: Stellung, Farbe des Königs. Ausgabe: die angegriffenen Nachbarfelder, oder null,
 * wenn der König nicht im Freien steht.
 * Beispiel: Abb. 12.3 nach 3... f5: König g6, nur f5 vor ihm, Weiß greift f6, f7 und h7 an.
 * Sonderfälle: Ohne gegnerische Dame gilt die Prüfung nicht, denn im Endspiel gehört der König
 * ins Zentrum (Kapitel 8, „Sind die Damen vom Brett?“ und Regel 1, den König aktivieren).
 * Ein König auf der Grundreihe steht nicht „im Freien“, auch wenn eine Linie vor ihm offen ist
 * (Abb. 4.9: König e1 bei offener d-Linie); das prüfen Luft und Schachs. Lehrbilder ohne König
 * ergeben null.
 */
export function koenigImFreien(stellung: Stellung, farbe: Color): Square[] | null {
  const { brett } = stellung;
  if (brett.pieces(gegner(farbe), "queen").isEmpty()) return null;
  const umgebung = koenigsumgebung(stellung, farbe);
  if (!umgebung || eigeneReihe(umgebung.koenig, farbe) === GRUNDREIHE) return null;
  if (schildbauern(brett, umgebung.koenig, farbe) >= MINDEST_SCHILDBAUERN) return null;
  const besetzt = new Set(umgebung.eigeneBesetzt);
  const angegriffen = umgebung.angegriffen.filter((feld) => !besetzt.has(feld));
  return angegriffen.length >= MINDEST_ANGEGRIFFENE_NACHBARN ? angegriffen : null;
}

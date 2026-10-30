/**
 * Begründungen im Schach-Röntgen-Trainer: zu jedem übersehenen und jedem zu viel gesetzten Pfeil
 * ein Satz, bei Schlägen mit der ganzen Abtauschfolge und ihrem Ergebnis.
 *
 * Rolle im Gesamtbild: Regel L des Nebenchats (Wunsch des Autors, 30.10.2026). Der Autor stutzte
 * bei Txe7+: Nach dem ersten Schlag sah es nach Verlust aus, erst der ganze Abtausch (Txe7+ Sxe7
 * fxe7) ergibt +1. Die Auflösung zeigt deshalb die Folge, wie die Abtauschrechnung sie spielt.
 * Abhängigkeiten: analyse/stellungsprofil.ts, schach/abtausch.ts, i18n.
 * Buchbezug: Kapitel 1, Schach-Röntgen-Regel und „Werte von Angreifer und Verteidiger zählen“.
 */
import { parseUci } from "chessops/util";
import type { Color, Role, Square } from "chessops/types";
import { profil } from "../analyse/stellungsprofil";
import { figurenbuchstaben, sprache, t } from "../i18n/sprache";
import { abtausch } from "../schach/abtausch";
import type { Schlagzug } from "../schach/drohungen";
import { feldname, ROLLENBUCHSTABE, stellungAusFen } from "../schach/stellung";
import { zugtext as de } from "../analyse/texte";
import { fenMitZugrecht, type Pfeil, type Roentgenaufgabe } from "./roentgentrainer";

/** „Sxe7“ oder „fxe7“: ein Rückschlag in der Kurzschreibweise des Buches. */
function rueckschlagText(rolle: Role, von: Square, nach: Square): string {
  if (rolle === "pawn") return `${feldname(von).charAt(0)}x${feldname(nach)}`;
  const buchstabe = ROLLENBUCHSTABE[rolle].toUpperCase();
  return `${figurenbuchstaben(sprache())[buchstabe] ?? buchstabe}x${feldname(nach)}`;
}

/** Das Ergebnis in Worten: „+1 Bauerneinheit“, „gleicher Tausch“, „−2 Bauerneinheiten“. */
function ergebnisText(bilanz: number): string {
  if (bilanz === 0) return t("roentgentrainer.grund.gleich");
  const betrag = Math.abs(bilanz);
  const text = betrag === 1 ? t("bauerneinheit.eins") : t("bauerneinheit.mehr", { wert: betrag });
  return `${bilanz > 0 ? "+" : "−"}${text}`;
}

/**
 * Die Folge eines Schlages: der Schlag, dann die Rückschläge, die sich lohnen (jede Seite mit der
 * billigsten Figur, Aufhören erlaubt). Beispiel: „Txe7+ Sxe7 fxe7“.
 */
function schlagfolgeText(fen: string, schlag: Schlagzug): string {
  const gelesen = stellungAusFen(fen);
  const zug = parseUci(schlag.uci);
  const regeln = gelesen.ok ? gelesen.wert.regeln : undefined;
  if (!regeln || !zug) return de(schlag.san);
  const danach = regeln.clone();
  danach.play(zug);
  const rest = abtausch(danach.board, schlag.nach);
  const rueck = rest ? rest.schlagfolge.slice(0, rest.lohnendeSchlaege) : [];
  return [de(schlag.san), ...rueck.map((s) => rueckschlagText(s.figur.rolle, s.figur.feld, schlag.nach))].join(" ");
}

/** Der Satz zu einem Pfeil einer Seite: Schach, Schlag mit Folge, oder keins von beiden. */
function satzZuPfeil(fen: string, farbe: Color, pfeil: Pfeil): string {
  const gelesen = stellungAusFen(fen);
  if (!gelesen.ok) return pfeil;
  const p = profil(gelesen.wert);
  const passt = (z: { von: Square; nach: Square }) => `${feldname(z.von)}-${feldname(z.nach)}` === pfeil;
  const schlag = (p.schlaegeVon(farbe) ?? []).find(passt);
  if (schlag) {
    return t("roentgentrainer.grund.schlag", {
      folge: schlagfolgeText(fen, schlag),
      ergebnis: ergebnisText(schlag.bilanz),
    });
  }
  const schach = (p.schachsVon(farbe) ?? []).find(passt);
  if (schach) return t("roentgentrainer.grund.schach", { zug: de(schach.san) });
  return t("roentgentrainer.grund.keins", { pfeil });
}

/**
 * Die Sätze zu einem geprüften Schritt: erst die übersehenen, dann die zu viel gesetzten Pfeile.
 * Eingaben: Aufgabe, Seite des Schritts, Pfeile. Ausgabe: je Pfeil ein Satz.
 */
export function roentgenbegruendungen(
  aufgabe: Roentgenaufgabe,
  farbe: Color,
  pfeile: readonly Pfeil[],
): string[] {
  const gelesen = stellungAusFen(aufgabe.fen);
  if (!gelesen.ok) return [];
  const fen = fenMitZugrecht(gelesen.wert, farbe);
  return pfeile.map((pfeil) => satzZuPfeil(fen, farbe, pfeil));
}

/**
 * Die Drohungen der Gegenseite nach Schritt 3: ihre Schläge mit Gewinn, als Züge.
 * Beispiel: Weiß könnte Lxe7 (+3) und fxe7 (+3) spielen → „Lxe7, fxe7“.
 */
export function gegnerdrohungen(aufgabe: Roentgenaufgabe): string[] {
  const gelesen = stellungAusFen(aufgabe.fen);
  if (!gelesen.ok) return [];
  const farbe = aufgabe.schritte.gegner.farbe;
  const fen = fenMitZugrecht(gelesen.wert, farbe);
  const s = stellungAusFen(fen);
  if (!s.ok) return [];
  return (profil(s.wert).schlaegeVon(farbe) ?? []).filter((z) => z.bilanz > 0).map((z) => de(z.san));
}

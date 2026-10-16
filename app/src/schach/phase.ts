/**
 * Partiephase nach der Denkroutine: Eröffnung, solange eine Seite noch mindestens zwei
 * Leichtfiguren auf dem Startfeld hat; Endspiel, wenn die vier Prüffragen aus Kapitel 8
 * überwiegend Ja ergeben; sonst Mittelspiel. Die Phase gilt für beide Seiten gleich.
 *
 * Rolle im Gesamtbild: Baustein für k11-phase und k12-erfassen (Schritt 1: „Bestimme zuletzt,
 * in welcher Phase der Partie du bist“). Pflichtenheft 6.3, Kapitel 11: „Werkzeug je Phase (N)“.
 * Abhängigkeiten: chessops, zielbilanz.ts, koenigsweg.ts, bauernschwaechen.ts, bauernprofil.ts,
 * analyse/stellungsprofil.ts (über die Angriffskarte und Drohungen).
 * Buchbezug: Kapitel 12, Denkroutine Schritt 1; Kapitel 8, „Wann beginnt das Endspiel“: Sind die
 * Damen vom Brett? Sind beide Könige vor einem Mattangriff sicher? Kann dein König ins Zentrum?
 * Entscheiden jetzt die Bauern mehr als Angriffe? „Lauten die Antworten überwiegend Ja, bist du
 * im Endspiel.“
 * Entscheidung des Autors zu C1.27 (16.10.2026): Die Phase hängt nicht von der Sicht ab, und ein
 * König, der nicht rochiert, ist nach der Entwicklung eine Frage der Königssicherheit, nicht der
 * Phase (die Unsterbliche Partie, Abb. 11.28 bis 11.31, ist Mittelspiel, obwohl der schwarze
 * König bis zum Matt in der Mitte steht).
 */
import type { Color, Square } from "chessops/types";
import type { Angriffskarte } from "./angriffskarte";
import { bauernprofil } from "./bauernprofil";
import { bauernschwaechen } from "./bauernschwaechen";
import type { Drohung } from "./drohungen";
import { koenigsweg } from "./koenigsweg";
import { FIGURENWERT, type Stellung } from "./stellung";
import { ZENTRUM, zielbilanz, type Zielbilanz } from "./zielbilanz";

/** Die drei Phasen der Denkroutine. */
export type Phase = "eroeffnung" | "mittelspiel" | "endspiel";

/** Die vier Prüffragen aus Kapitel 8 mit Antworten. */
export interface Endspielfragen {
  readonly damenWeg: boolean;
  readonly koenigeSicher: boolean;
  readonly koenigInsZentrum: boolean;
  readonly bauernEntscheiden: boolean;
  /** Zahl der Ja-Antworten. */
  readonly ja: number;
}

/** Die Phase mit ihren Gründen. */
export interface Phasenbefund {
  readonly phase: Phase;
  /** Die Eröffnungsziele beider Seiten (Kapitel 1 und 2). */
  readonly ziele: Readonly<Record<Color, Zielbilanz>>;
  readonly fragen: Endspielfragen;
  /** Sicherer Weg des Königs der Seite am Zug ins Zentrum (Frage 3), falls es einen gibt. */
  readonly zentrumsweg: readonly Square[] | null;
}

/**
 * Eröffnung, solange eine Seite noch so viele Leichtfiguren auf dem Startfeld hat (C1.27). Eine
 * einzelne (Abb. 12.1: der Läufer c8) zählt wie „Entwicklung teils“ als erfüllt (C2.18).
 */
const ZU_HAUSE_EROEFFNUNG = 2;
/** „Überwiegend Ja“: mindestens drei der vier Fragen. */
const UEBERWIEGEND = 3;
/** Figurenmaterial ohne Bauern je Seite, bis zu dem Angriffe selten noch entscheiden. */
const WENIG_MATERIAL = 13;

/** Figurenwert einer Farbe ohne Bauern und König. */
function figurenmaterial(stellung: Stellung, farbe: Color): number {
  let summe = 0;
  for (const feld of stellung.brett[farbe]) {
    const figur = stellung.brett.get(feld);
    if (figur && figur.role !== "king" && figur.role !== "pawn") summe += FIGURENWERT[figur.role];
  }
  return summe;
}

/** Droht einer Seite Matt in einem Zug? */
function mattDroht(drohungen: (farbe: Color) => readonly Drohung[] | null, farbe: Color): boolean {
  return (drohungen(farbe) ?? []).some((d) => d.art === "matt");
}

/**
 * Die vier Prüffragen aus Kapitel 8. „Kann dein König ins Zentrum?“ fragt die Seite am Zug: Sie
 * geht die Denkroutine durch, und so bleibt die Phase für beide Sichten gleich (C1.27).
 */
function endspielfragen(
  stellung: Stellung,
  karte: Angriffskarte,
  drohungen: (farbe: Color) => readonly Drohung[] | null,
): { fragen: Endspielfragen; zentrumsweg: readonly Square[] | null } {
  const damenWeg = stellung.brett.queen.isEmpty();
  const koenigeSicher =
    damenWeg && !mattDroht(drohungen, "white") && !mattDroht(drohungen, "black");
  const weg = koenigsweg(stellung, karte, stellung.amZug, new Set(ZENTRUM));
  const freibauern =
    bauernschwaechen(stellung.brett, "white").freibauern.length +
    bauernschwaechen(stellung.brett, "black").freibauern.length;
  const mehrheiten =
    bauernprofil(stellung.brett, "white").mehrheiten.length +
    bauernprofil(stellung.brett, "black").mehrheiten.length;
  const wenig =
    figurenmaterial(stellung, "white") <= WENIG_MATERIAL &&
    figurenmaterial(stellung, "black") <= WENIG_MATERIAL;
  const bauernEntscheiden = damenWeg && (freibauern > 0 || mehrheiten > 0 || wenig);
  const koenigInsZentrum = weg !== null;
  const ja = [damenWeg, koenigeSicher, koenigInsZentrum, bauernEntscheiden].filter(Boolean).length;
  return {
    fragen: { damenWeg, koenigeSicher, koenigInsZentrum, bauernEntscheiden, ja },
    zentrumsweg: weg ? weg.weg : null,
  };
}

/**
 * Bestimmt die Phase der Partie, für beide Seiten gleich.
 *
 * Warum: „Am Brett sagt dir niemand, welches Werkzeug gerade an der Reihe ist. Das findest du
 * selbst heraus, indem du in Schritt 1 bestimmst, in welcher Phase der Partie du bist.“
 * Regel: Kapitel 12, Denkroutine Schritt 1: „Eröffnung, solange die drei Eröffnungsziele aus
 * Kapitel 1 nicht erfüllt sind … Mittelspiel, sobald die Ziele erfüllt sind“; Endspiel nach den
 * vier Prüffragen aus Kapitel 8. Die App liest „Ziele erfüllt“ als „entwickelt“: Eröffnung,
 * solange eine Seite noch mindestens zwei Leichtfiguren auf dem Startfeld hat (C1.27).
 * Eingaben: Stellung, Angriffskarte und Drohungen aus dem Profil.
 * Ausgabe: Phase, Eröffnungsziele beider Seiten, Prüffragen, Zentrumsweg.
 * Beispiel: Abb. 8.1 (Damen getauscht, zwei Türme und Leichtfigur je Seite) → Endspiel;
 * Abb. 8.2 (Damen am Brett) → Mittelspiel; Abb. 12.1 (griechisches Geschenk, beide rochiert,
 * Leichtfiguren bis auf Lc8 entwickelt) → Mittelspiel; Abb. 11.28 (Unsterbliche Partie, König e8)
 * → Mittelspiel; Abb. 1.26 → Eröffnung.
 * Sonderfall: Das Endspiel geht vor der Eröffnung (etwa ein Lehrbild mit wenigen Steinen, in dem
 * Leichtfiguren noch auf dem Startfeld stehen).
 */
export function phase(
  stellung: Stellung,
  karte: Angriffskarte,
  drohungen: (farbe: Color) => readonly Drohung[] | null,
): Phasenbefund {
  const ziele = {
    white: zielbilanz(stellung.brett, karte, "white", stellung.amZug),
    black: zielbilanz(stellung.brett, karte, "black", stellung.amZug),
  };
  const { fragen, zentrumsweg } = endspielfragen(stellung, karte, drohungen);
  const nochEroeffnung = [ziele.white, ziele.black].some(
    (z) => z.entwicklung.offen.length >= ZU_HAUSE_EROEFFNUNG,
  );
  const ermittelt: Phase =
    fragen.ja >= UEBERWIEGEND ? "endspiel" : nochEroeffnung ? "eroeffnung" : "mittelspiel";
  return { phase: ermittelt, ziele, fragen, zentrumsweg };
}

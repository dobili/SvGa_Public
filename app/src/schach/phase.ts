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
 * Zusatzregel (Rückfrage S2, nicht aus dem Buch, in der Anzeige als solche genannt):
 * Endspiel, sobald jede Seite höchstens 13 Punkte an Steinen außer dem König hat (Speelman,
 * „Endgame Preparation“, 1981), auch mit Damen am Brett, etwa im Damenendspiel. Eine Regel nach
 * der Zugzahl gibt es nicht (Entscheidung des Autors, 17.10.2026: der Wechsel folgt der
 * Stellung, nicht der Zugnummer).
 * Zwei Regeln für Eröffnung und Mittelspiel (S17, Entscheidung des Autors, 17.10.2026): Stellungen
 * des Buches (Abbildungen und Buchlinien) folgen dem Glossar, damit App und Buch übereinstimmen;
 * eigene Partien folgen der Lesart vom 17.10. (eine Seite entwickelt oder Material ungleich).
 */
import type { Color, Square } from "chessops/types";
import type { Angriffskarte } from "./angriffskarte";
import { bauernprofil } from "./bauernprofil";
import { bauernschwaechen } from "./bauernschwaechen";
import type { Drohung } from "./drohungen";
import { koenigsweg } from "./koenigsweg";
import { hatRochiert } from "./rochade";
import { FIGURENWERT, type Stellung } from "./stellung";
import type { Verlauf } from "./todsuenden";
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

/**
 * Welche Regel Eröffnung und Mittelspiel trennt (S17): das Glossar für Stellungen des Buches
 * (mit den Zügen bis zur Stellung, damit „rochiert haben“ auch für einen gejagten König gilt),
 * die Lesart für eigene Partien. Das Endspiel bestimmen in beiden Fällen die vier Prüffragen.
 */
export type Phasenregel =
  { readonly art: "lesart" } | { readonly art: "glossar"; readonly verlauf?: Verlauf };

/** Die Regel „Lesart“ für eigene Partien, ohne Züge bis zur Stellung (S17). */
export const LESART: Phasenregel = { art: "lesart" };

/** Die Regel für eine Stellung: Glossar für Stellungen des Buches, sonst die Lesart (S17). */
export function phasenregel(buchstellung: boolean | undefined, verlauf?: Verlauf): Phasenregel {
  return buchstellung ? { art: "glossar", verlauf } : LESART;
}

/** Zusatzregel, die nicht aus dem Buch stammt (Rückfrage S2). */
export type Zusatzregel = "wenigMaterial";

/**
 * Warum die Phase gilt (für die Erklärung am Phasenwechsel): Eröffnung, weil Figuren zu
 * Hause stehen; Mittelspiel, weil beide oder eine Seite entwickelt ist oder das Figurenmaterial
 * ungleich ist; Endspiel nach den vier Fragen oder nach der Zusatzregel.
 */
export type Phasengrund =
  | "zuHause"
  | "beideEntwickelt"
  | "eineEntwickelt"
  | "materialUngleich"
  | "glossarMittelspiel"
  | "glossarEroeffnung"
  | "fragen"
  | "wenigMaterial";

/** Wie weit eine Seite nach dem Glossar ist: entwickelt und rochiert. */
export interface Glossarstand {
  readonly entwickelt: boolean;
  readonly rochiert: boolean;
}

/** Die Phase mit ihren Gründen. */
export interface Phasenbefund {
  readonly phase: Phase;
  readonly grund: Phasengrund;
  /** Bei „eineEntwickelt“: die entwickelte Seite. */
  readonly entwickelt: Color | null;
  /** Nach dem Glossar (S17): je Seite entwickelt und rochiert; bei der Lesart null. */
  readonly glossar: Readonly<Record<Color, Glossarstand>> | null;
  /** Die Phase allein nach den Regeln des Buches; weicht nur mit einer Zusatzregel ab. */
  readonly buchphase: Phase;
  /** Die Zusatzregel, die die Phase gegenüber dem Buch geändert hat, sonst null. */
  readonly zusatz: Zusatzregel | null;
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
/** Mittelspiel, sobald das Figurenmaterial um eine Leichtfigur ungleich ist (Lesart). */
const UNGLEICH_AB = 3;
/** Zusatzregel nach Speelman: Endspiel, wenn jede Seite höchstens so viele Punkte hat (ohne König). */
export const ENDSPIEL_BIS_PUNKTE = 13;

/** Figurenwert einer Farbe ohne Bauern und König. */
function figurenmaterial(stellung: Stellung, farbe: Color): number {
  let summe = 0;
  for (const feld of stellung.brett[farbe]) {
    const figur = stellung.brett.get(feld);
    if (figur && figur.role !== "king" && figur.role !== "pawn") summe += FIGURENWERT[figur.role];
  }
  return summe;
}

/** Alle Steine einer Farbe außer dem König in Punkten (Bauer 1, Leichtfigur 3, Turm 5, Dame 9). */
function steinpunkte(stellung: Stellung, farbe: Color): number {
  let summe = 0;
  for (const feld of stellung.brett[farbe]) {
    const figur = stellung.brett.get(feld);
    if (figur && figur.role !== "king") summe += FIGURENWERT[figur.role];
  }
  return summe;
}

/**
 * Wendet die Zusatzregel an, die nicht aus dem Buch stammt (Rückfrage S2): Endspiel nach
 * Speelman. Das Endspiel des Buches bleibt unberührt. Beispiel: Damenendspiel (Dame und drei
 * Bauern je Seite) → Endspiel, obwohl die Damen noch am Brett sind.
 */
function mitZusatzregeln(
  buchphase: Phase,
  stellung: Stellung,
): { phase: Phase; zusatz: Zusatzregel | null } {
  if (buchphase === "endspiel") return { phase: buchphase, zusatz: null };
  const wenig =
    steinpunkte(stellung, "white") <= ENDSPIEL_BIS_PUNKTE &&
    steinpunkte(stellung, "black") <= ENDSPIEL_BIS_PUNKTE;
  if (wenig) return { phase: "endspiel", zusatz: "wenigMaterial" };
  return { phase: buchphase, zusatz: null };
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
  // Lesart (S16, Entscheidung des Autors 17.10.2026): Eine bloße Bauernmehrheit zählt nur bei
  // wenig Figurenmaterial; sonst ist es ein damenloses Mittelspiel (etwa die Berliner Verteidigung).
  const bauernEntscheiden = damenWeg && (freibauern > 0 || (mehrheiten > 0 && wenig) || wenig);
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
 * vier Prüffragen aus Kapitel 8. Die App liest „Ziele erfüllt“ als „entwickelt“ (C1.27).
 * Lesart (Entscheidung des Autors, 17.10.2026, damit Anfänger mit einer Figur zu
 * Hause nicht ewig in der „Eröffnung“ bleiben): Mittelspiel, sobald eine Seite entwickelt ist
 * (höchstens eine Leichtfigur zu Hause; ihr Gegner hat dann ein Mittelspielthema, den
 * Entwicklungsrückstand) oder das Figurenmaterial um mindestens eine Leichtfigur ungleich ist;
 * Eröffnung nur, solange beide Seiten noch zwei oder mehr Leichtfiguren zu Hause haben und das
 * Material gleich ist.
 * Für Stellungen des Buches gilt stattdessen das Glossar (S17, Regel „glossar“): „Das
 * Mittelspiel beginnt, sobald beide Seiten entwickelt und rochiert haben“ (Anhang, Glossar).
 * Eingaben: Stellung, Angriffskarte und Drohungen aus dem Profil, die Regel (ohne Angabe die
 * Lesart für eigene Partien).
 * Ausgabe: Phase, Eröffnungsziele beider Seiten, Prüffragen, Zentrumsweg.
 * Beispiel: Abb. 8.1 (Damen getauscht, zwei Türme und Leichtfigur je Seite) → Endspiel;
 * Abb. 8.2 (Damen am Brett) → Mittelspiel; Abb. 12.1 (griechisches Geschenk, beide rochiert,
 * Leichtfiguren bis auf Lc8 entwickelt) → Mittelspiel; Abb. 11.28 (Unsterbliche Partie, König e8)
 * → Mittelspiel; Abb. 1.26 → Eröffnung.
 * Sonderfall: Das Endspiel geht vor der Eröffnung (etwa ein Lehrbild mit wenigen Steinen, in dem
 * Leichtfiguren noch auf dem Startfeld stehen). Die Zusatzregel außerhalb des Buches (wenig
 * Material) steht im Befund mit Namen, damit die Anzeige sie als solche nennt.
 */
export function phase(
  stellung: Stellung,
  karte: Angriffskarte,
  drohungen: (farbe: Color) => readonly Drohung[] | null,
  regel: Phasenregel = LESART,
): Phasenbefund {
  const ziele = {
    white: zielbilanz(stellung.brett, karte, "white", stellung.amZug),
    black: zielbilanz(stellung.brett, karte, "black", stellung.amZug),
  };
  const { fragen, zentrumsweg } = endspielfragen(stellung, karte, drohungen);
  const glossar = regel.art === "glossar" ? glossarstand(stellung, ziele, regel.verlauf) : null;
  const vorEndspiel =
    fragen.ja >= UEBERWIEGEND
      ? null
      : glossar
        ? nachGlossar(glossar)
        : mittelspielOderEroeffnung(stellung, ziele);
  const buchphase: Phase = vorEndspiel ? vorEndspiel.phase : "endspiel";
  const { phase: ermittelt, zusatz } = mitZusatzregeln(buchphase, stellung);
  const grund: Phasengrund = zusatz ?? vorEndspiel?.grund ?? "fragen";
  const entwickelt = ermittelt === "mittelspiel" ? (vorEndspiel?.entwickelt ?? null) : null;
  return {
    phase: ermittelt,
    grund,
    entwickelt,
    glossar,
    buchphase,
    zusatz,
    ziele,
    fragen,
    zentrumsweg,
  };
}

/** Ist diese Seite entwickelt (höchstens eine Leichtfigur zu Hause, C2.18)? */
function istEntwickelt(ziele: Readonly<Record<Color, Zielbilanz>>, farbe: Color): boolean {
  return ziele[farbe].entwicklung.offen.length < ZU_HAUSE_EROEFFNUNG;
}

/** Je Seite: entwickelt (C2.18) und rochiert (auch früher im Verlauf, rochade.ts)? */
function glossarstand(
  stellung: Stellung,
  ziele: Readonly<Record<Color, Zielbilanz>>,
  verlauf: Verlauf | undefined,
): Record<Color, Glossarstand> {
  const stand = (farbe: Color): Glossarstand => ({
    entwickelt: istEntwickelt(ziele, farbe),
    rochiert: hatRochiert(stellung, farbe, verlauf),
  });
  return { white: stand("white"), black: stand("black") };
}

/**
 * Eröffnung oder Mittelspiel nach dem Glossar (S17): Mittelspiel erst, wenn beide Seiten
 * entwickelt sind und rochiert haben. Regel: Anhang, Glossar „Mittelspiel“; ebenso Kapitel 3 und 6.
 * „Rochiert haben“ gilt auch für einen König, der danach gejagt wurde (rochade.ts).
 * Beispiel: Abb. 11.4 (Weiß entwickelt, aber nicht rochiert; Schwarz mit Sb8 und Lf8 zu Hause) →
 * Eröffnung; Abb. 12.1 (beide rochiert, Lc8 allein zu Hause) → Mittelspiel.
 */
function nachGlossar(stand: Readonly<Record<Color, Glossarstand>>): {
  phase: Phase;
  grund: Phasengrund;
  entwickelt: Color | null;
} {
  const fertig = (["white", "black"] as const).every(
    (farbe) => stand[farbe].entwickelt && stand[farbe].rochiert,
  );
  return fertig
    ? { phase: "mittelspiel", grund: "glossarMittelspiel", entwickelt: null }
    : { phase: "eroeffnung", grund: "glossarEroeffnung", entwickelt: null };
}

/** Eröffnung oder Mittelspiel mit Grund, wenn die Endspielfragen nicht überwiegend Ja ergeben. */
function mittelspielOderEroeffnung(
  stellung: Stellung,
  ziele: Readonly<Record<Color, Zielbilanz>>,
): { phase: Phase; grund: Phasengrund; entwickelt: Color | null } {
  const entwickelte = (["white", "black"] as const).filter((farbe) => istEntwickelt(ziele, farbe));
  if (entwickelte.length === 2) {
    return { phase: "mittelspiel", grund: "beideEntwickelt", entwickelt: null };
  }
  const eine = entwickelte[0];
  if (eine) return { phase: "mittelspiel", grund: "eineEntwickelt", entwickelt: eine };
  const ungleich =
    Math.abs(figurenmaterial(stellung, "white") - figurenmaterial(stellung, "black")) >=
    UNGLEICH_AB;
  if (ungleich) return { phase: "mittelspiel", grund: "materialUngleich", entwickelt: null };
  return { phase: "eroeffnung", grund: "zuHause", entwickelt: null };
}

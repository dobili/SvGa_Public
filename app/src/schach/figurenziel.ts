/**
 * Zielfeld und Weg für eine Figur nach den Regeln aus Kapitel 5: Springer auf Löcher und
 * Vorposten, Türme auf offene und halboffene Linien, schlechte Läufer in den Tausch.
 *
 * Rolle im Gesamtbild: Vorschlag (Art N) des Werkzeugs k6-lap. Pflichtenheft 6.3: „Schlägt nach
 * den Regeln aus Kapitel 5 ein besseres Feld und den Weg dorthin vor. Gold: Weg zum Zielfeld.“
 * Abhängigkeiten: chessops, bauernprofil.ts, skelettfelder.ts, skelettfiguren.ts.
 * Buchbezug: Kapitel 6, „Frage 3“ (Abb. 6.16: Sd2–f1–g3, der Turm f1 macht Platz; Abb. 6.17:
 * Türme auf die offene d-Linie, dann die 7. Reihe) und Kapitel 5, Leitfrage 4.
 */
import { attacks, knightAttacks } from "chessops/attacks";
import type { Board } from "chessops/board";
import { SquareSet } from "chessops/squareSet";
import type { Color, Square } from "chessops/types";
import { squareFile, squareRank } from "chessops/util";
import type { Figurenstand } from "./angriffskarte";
import { eigeneReihe, feldAusEigener, type Bauernprofil } from "./bauernprofil";
import type { Figurenfelder } from "./sichereFelder";
import type { Felderbefund } from "./skelettfelder";
import type { Laeuferbefund } from "./skelettfiguren";
import { gegner } from "./stellung";

/** Höchstens so viele Züge (Platz machen mitgezählt) darf der Weg zum Zielfeld dauern. */
const HOECHSTENS_ZUEGE = 3;
/** Die eigene Reihe (Index), ab der ein Feld in der gegnerischen Hälfte liegt. */
const GEGNERISCHE_HAELFTE_AB = 4;
/** Die 7. Reihe aus eigener Sicht (Index), Ziel eines Turms auf der offenen Linie. */
const SIEBTE_REIHE = 6;

export type Zielgrund =
  "loch" | "springerfeld" | "wirkung" | "linie" | "eindringen" | "tausch" | "dame";

/** Der Vorschlag für eine Figur: Zielfeld, Weg und eigene Figuren, die Platz machen müssen. */
export interface Figurenziel {
  readonly stand: Figurenstand;
  readonly ziel: Square | null;
  /** Die Felder des Weges, das Zielfeld zuletzt (ohne Startfeld). */
  readonly weg: readonly Square[];
  /** Eigene Figuren auf dem Weg, die zuerst ziehen müssen (Abb. 6.16: der Turm f1). */
  readonly platzmacher: readonly Square[];
  readonly grund: Zielgrund | null;
}

/** Felder, die gegnerische Bauern angreifen (dort steht keine Figur sicher). */
function bauernfeuer(brett: Board, feind: Color): SquareSet {
  let felder = SquareSet.empty();
  for (const bauer of brett.pawn.intersect(brett[feind])) {
    felder = felder.union(attacks({ role: "pawn", color: feind }, bauer, SquareSet.empty()));
  }
  return felder;
}

/** Wie viele Felder der gegnerischen Hälfte die Figur von dort aus angreift, ohne Bauernfeuer. */
function wirkung(brett: Board, von: Square, stand: Figurenstand, feuer: SquareSet): number {
  const besetzt = brett.occupied.without(stand.feld).with(von);
  const ziele = attacks(stand.figur, von, besetzt).diff(brett[stand.figur.color]).diff(feuer);
  return [...ziele].filter((f) => eigeneReihe(f, stand.figur.color) >= GEGNERISCHE_HAELFTE_AB)
    .length;
}

interface Station {
  readonly feld: Square;
  readonly weg: readonly Square[];
  readonly kosten: number;
}

/** Alle Felder, die ein Springer in höchstens drei Zügen erreicht; eigene Figuren im Weg kosten einen Zug. */
function springerwege(brett: Board, von: Square, farbe: Color, feuer: SquareSet): Station[] {
  const feind = gegner(farbe);
  const eigeneBauern = brett.pawn.intersect(brett[farbe]);
  const beste = new Map<Square, Station>();
  let rand: Station[] = [{ feld: von, weg: [], kosten: 0 }];
  while (rand.length > 0) {
    const naechste: Station[] = [];
    for (const s of rand) {
      for (const nach of knightAttacks(s.feld)) {
        // Gegner und Bauernfeuer sperren; eigene Bauern machen keinen Platz, eigene Figuren schon.
        if (brett[feind].has(nach) || feuer.has(nach) || eigeneBauern.has(nach)) continue;
        const kosten = s.kosten + 1 + (brett[farbe].has(nach) ? 1 : 0);
        if (kosten > HOECHSTENS_ZUEGE) continue;
        const bekannt = beste.get(nach);
        if (bekannt && bekannt.kosten <= kosten) continue;
        const station = { feld: nach, weg: [...s.weg, nach], kosten };
        beste.set(nach, station);
        naechste.push(station);
      }
    }
    rand = naechste;
  }
  return [...beste.values()];
}

/** Springer: zuerst ein sicheres Feld oder Springerfeld, sonst das Feld mit der größten Wirkung. */
function springerziel(
  brett: Board,
  stand: Figurenstand,
  felder: Felderbefund,
  feuer: SquareSet,
): { station: Station; grund: Zielgrund } | null {
  const farbe = stand.figur.color;
  const stationen = springerwege(brett, stand.feld, farbe, feuer).filter(
    (s) => !brett[farbe].has(s.feld),
  );
  const loecher = new Set(felder.sichere.map((s) => s.feld));
  const springerfelder = new Set(felder.springerfelder.map((s) => s.feld));
  const nachKosten = (a: Station, b: Station) => a.kosten - b.kosten;
  const aufLoch = stationen.filter((s) => loecher.has(s.feld)).sort(nachKosten)[0];
  if (aufLoch) return { station: aufLoch, grund: "loch" };
  const aufSpringerfeld = stationen.filter((s) => springerfelder.has(s.feld)).sort(nachKosten)[0];
  if (aufSpringerfeld) return { station: aufSpringerfeld, grund: "springerfeld" };
  const koenig = brett.kingOf(gegner(farbe));
  const abstand = (f: Square) =>
    koenig === undefined ? 0 : Math.abs(squareFile(f) - squareFile(koenig));
  const jetzt = wirkung(brett, stand.feld, stand, feuer);
  const beste = stationen
    .map((s) => ({ s, wert: wirkung(brett, s.feld, stand, feuer) }))
    .filter((k) => k.wert > jetzt)
    .sort(
      (a, b) => b.wert - a.wert || abstand(a.s.feld) - abstand(b.s.feld) || a.s.kosten - b.s.kosten,
    )[0];
  return beste ? { station: beste.s, grund: "wirkung" } : null;
}

/** Felder auf derselben Reihe bis zur Linie, eigene Figuren als Platzmacher, Gegner sperrt. */
function waagerecht(brett: Board, von: Square, linie: number, farbe: Color): Station | null {
  const weg: Square[] = [];
  let kosten = 0;
  const schritt = linie > squareFile(von) ? 1 : -1;
  for (let l = squareFile(von) + schritt; l !== linie + schritt; l += schritt) {
    const feld = von + (l - squareFile(von));
    if (brett[gegner(farbe)].has(feld)) return null;
    if (brett[farbe].has(feld)) kosten += 1;
    weg.push(feld);
  }
  return { feld: von + (linie - squareFile(von)), weg, kosten: kosten + 1 };
}

/** Turm: auf die offene, sonst die halboffene Linie; steht er schon dort, auf die 7. Reihe. */
function turmziel(
  brett: Board,
  stand: Figurenstand,
  profil: Bauernprofil,
): { station: Station; grund: Zielgrund } | null {
  const farbe = stand.figur.color;
  const linien = [...profil.offeneLinien, ...profil.halboffeneLinien];
  if (linien.includes(squareFile(stand.feld))) {
    const ziel = feldAusEigener(squareFile(stand.feld), SIEBTE_REIHE, farbe);
    if (ziel === null || eigeneReihe(stand.feld, farbe) >= SIEBTE_REIHE) return null;
    const frei =
      attacks(stand.figur, stand.feld, brett.occupied).has(ziel) && !brett[farbe].has(ziel);
    return frei ? { station: { feld: ziel, weg: [ziel], kosten: 1 }, grund: "eindringen" } : null;
  }
  // Zuerst Linien ohne eigenen Turm, dann verdoppeln; das Zielfeld muss leer sein.
  const eigeneTuerme = brett.rook.intersect(brett[farbe]);
  const ohneTurm = (l: number) => [...eigeneTuerme].every((t) => squareFile(t) !== l);
  const reihenfolge = [...linien.filter(ohneTurm), ...linien.filter((l) => !ohneTurm(l))];
  for (const linie of reihenfolge) {
    const station = waagerecht(brett, stand.feld, linie, farbe);
    if (station && station.kosten <= HOECHSTENS_ZUEGE && !brett.occupied.has(station.feld))
      return { station, grund: "linie" };
  }
  return null;
}

/** Läufer: ein sicheres Feld mit mehr Wirkung in der gegnerischen Hälfte; schlechte Läufer in den Tausch. */
function laeuferziel(
  brett: Board,
  stand: Figurenstand,
  sichere: readonly Square[],
  befund: Laeuferbefund | undefined,
  feuer: SquareSet,
): { station: Station | null; grund: Zielgrund } | null {
  // Ein farblich schlechter Läufer vor der eigenen Kette ist aktiv (Abb. 5.40: Lf4), kein Tauschfall.
  if (befund?.wertung === "schlecht" && !befund.vorDerKette)
    return { station: null, grund: "tausch" };
  const jetzt = wirkung(brett, stand.feld, stand, feuer);
  const beste = sichere
    .filter((f) => !feuer.has(f))
    .map((f) => ({ feld: f, wert: wirkung(brett, f, stand, feuer) }))
    .filter((k) => k.wert > jetzt)
    .sort((a, b) => b.wert - a.wert || a.feld - b.feld)[0];
  return beste
    ? { station: { feld: beste.feld, weg: [beste.feld], kosten: 1 }, grund: "wirkung" }
    : null;
}

/**
 * Schlägt der Figur ein Zielfeld und den Weg dorthin vor.
 *
 * Eingaben: Brett, Figur, sichere Zielfelder der Figur, Felderbefund und Bauernprofil der Seite,
 * Läuferbefund (für Läufer). Ausgabe: Figurenziel; `ziel` null, wenn die Figur gut steht, bei
 * Damen („Dame zuletzt“, Kapitel 1) und bei schlechten Läufern (Grund „tausch“).
 * Beispiel: Abb. 6.16, Springer d2: Ziel g3 über f1, der Turm f1 macht Platz.
 * Sonderfälle: Felder unter gegnerischem Bauernfeuer sind weder Zwischenstation noch Ziel.
 */
export function figurenziel(
  brett: Board,
  stand: Figurenstand,
  sichere: readonly Square[],
  umfeld: { felder: Felderbefund; profil: Bauernprofil; laeufer?: Laeuferbefund },
): Figurenziel {
  const farbe = stand.figur.color;
  const feuer = bauernfeuer(brett, gegner(farbe));
  const rolle = stand.figur.role;
  const fund =
    rolle === "knight"
      ? springerziel(brett, stand, umfeld.felder, feuer)
      : rolle === "rook"
        ? turmziel(brett, stand, umfeld.profil)
        : rolle === "bishop"
          ? laeuferziel(brett, stand, sichere, umfeld.laeufer, feuer)
          : { station: null, grund: "dame" as const };
  if (!fund) return { stand, ziel: null, weg: [], platzmacher: [], grund: null };
  const station = fund.station;
  return {
    stand,
    ziel: station?.feld ?? null,
    weg: station?.weg ?? [],
    platzmacher: (station?.weg ?? []).filter((f) => brett[farbe].has(f)),
    grund: fund.grund,
  };
}

/** Verdoppelte Türme auf einer offenen Linie und das Feld, auf dem der vordere eindringt. */
export interface Eindringen {
  /** Der vordere Turm, der eindringt. */
  readonly turm: Square;
  /** Der hintere Turm, der ihn deckt. */
  readonly hinten: Square;
  /** Das Feld auf der 7. Reihe. */
  readonly ziel: Square;
}

/**
 * Stehen zwei eigene Türme ohne Figur dazwischen auf einer offenen Linie, dringt der vordere auf
 * die 7. Reihe ein, wenn er das Feld erreicht und es laut Abtauschrechnung sicher ist.
 *
 * Regel: Kapitel 6, Abb. 6.17: „Erst die Linie besetzen, dann verdoppeln, dann eindringen“ (es
 * folgt 1. Td7, Abb. 6.18). Die LAP-Figur ist dort der hintere Turm d1, dem der eigene Turm d2
 * den Weg versperrt; den Vorschlag bekommt deshalb der vordere (Entscheidung des Autors zu
 * C1.15). Eingaben: Brett, Farbe, Bauernprofil (offene Linien), Zielfelder der Figuren mit den
 * sicheren Feldern. Ausgabe: Eindringen oder null.
 */
export function eindringen(
  brett: Board,
  farbe: Color,
  profil: Bauernprofil,
  felder: readonly Figurenfelder[],
): Eindringen | null {
  const tuerme = [...brett.rook.intersect(brett[farbe])];
  for (const linie of profil.offeneLinien) {
    const aufLinie = tuerme
      .filter((t) => squareFile(t) === linie)
      .sort((a, b) => eigeneReihe(b, farbe) - eigeneReihe(a, farbe));
    const [turm, hinten] = aufLinie;
    if (turm === undefined || hinten === undefined) continue;
    const verbunden = attacks({ role: "rook", color: farbe }, hinten, brett.occupied).has(turm);
    const ziel = feldAusEigener(linie, SIEBTE_REIHE, farbe);
    if (!verbunden || ziel === null || eigeneReihe(turm, farbe) >= SIEBTE_REIHE) continue;
    const sicher = felder.find((f) => f.feld === turm)?.sichere.includes(ziel) ?? false;
    if (sicher) return { turm, hinten, ziel };
  }
  return null;
}

/** Die Reihe eines Feldes, für Texte („auf der 7. Reihe“). */
export function reihennummer(feld: Square): number {
  return squareRank(feld) + 1;
}

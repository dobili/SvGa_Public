/**
 * Markierungen am Brett für Zielbilanz und Faktorenbilanz, jeweils nur für die Seite der Sicht.
 *
 * Rolle im Gesamtbild: Seit 0.2.28 markieren beide Bilanzen nur eine Seite. Wunsch des Autors nach
 * dem Test von 0.2.28: „Bei den Bilanzen könnten wir jetzt ruhig mehr Markierungen machen.“ Jede
 * Zeile der Karte bekommt deshalb ihr Bild am Brett, in den Farben des Buches: gold, was für die
 * Seite spricht; rot, was gegen sie spricht; grau, was noch offen oder neutral ist.
 * Abhängigkeiten: schach/zielbilanz.ts, schach/faktorenbilanz.ts, analyse/stellungsprofil.ts.
 * Buchbezug: Kapitel 2 (Zielbilanz: Zentrum, Entwicklung, Königssicherheit) und Kapitel 3
 * (Faktorenbilanz: Material, Zeit, Königssicherheit, Aktivität).
 */
import type { Board } from "chessops/board";
import type { Color, Square } from "chessops/types";
import { squareFile, squareFromCoords, squareRank } from "chessops/util";
import type { Einschaetzung } from "../schach/faktoreinschaetzung";
import type { Zeitvergleich } from "../schach/faktorenbilanz";
import { FIGURENWERT, feldname, gegner } from "../schach/stellung";
import { ZENTRUM, type Wertung, type Zielbilanz } from "../schach/zielbilanz";
import type { Stellungsprofil } from "./stellungsprofil";
import type { Markierung, Markierungsfarbe } from "./werkzeug";

/** Figuren, die bei der Zeit zählen (Kapitel 3: Springer, Läufer, Türme und Dame). */
const ZEITFIGUREN = new Set(["knight", "bishop", "rook", "queen"]);
/** Leichtfiguren für die Entwicklung (Kapitel 2). */
const LEICHTFIGUREN = new Set(["knight", "bishop"]);

function feld(f: Square, farbe: Markierungsfarbe): Markierung {
  return { typ: "feld", farbe, feld: feldname(f) };
}

function pfeil(von: Square, nach: Square, farbe: Markierungsfarbe): Markierung {
  return { typ: "pfeil", farbe, von: feldname(von), nach: feldname(nach) };
}

/** Je Feld nur die erste Feldmarkierung; Pfeile bleiben alle (sonst überdecken sie sich). */
function ohneDoppelte(liste: readonly Markierung[]): Markierung[] {
  const belegt = new Set<string>();
  return liste.filter((m) => {
    if (m.typ !== "feld") return true;
    if (belegt.has(m.feld)) return false;
    belegt.add(m.feld);
    return true;
  });
}

const KOENIG_ZIEL: Readonly<Record<Wertung, Markierungsfarbe>> = {
  ja: "gold",
  teils: "grau",
  nein: "rot",
};

/**
 * Zielbilanz einer Seite am Brett.
 *
 * Zentrum: Zentrumsbauern gold, angegriffene grau (ob sie hängen, prüft erst die Engine; seit
 * 0.2.33 nicht mehr rot, Entscheidung des Autors zu C1.1), ohne Bauern die kontrollierten Felder
 * gold, die übrigen Zentrumsfelder grau. Entwicklung: Leichtfiguren auf dem Startfeld rot,
 * entwickelte gold. König: gold, grau oder rot nach der Wertung, die Schildbauern gold.
 * Beispiel: Abb. 2.71 aus Sicht von Weiß: Springer b1 und Läufer c1 rot, Sf3 und Lc4 gold, Bauer d4
 * gold, König g1 und die Schildbauern f2, g2, h2 gold, e4, d5 und e5 grau.
 */
export function zielmarkierungen(bilanz: Zielbilanz, brett: Board): Markierung[] {
  const { zentrum, entwicklung, koenig, farbe } = bilanz;
  const offen = new Set(entwicklung.offen.map((stand) => stand.feld));
  const entwickelt = [...brett[farbe]].filter((f) => {
    const rolle = brett.get(f)?.role;
    return rolle !== undefined && LEICHTFIGUREN.has(rolle) && !offen.has(f);
  });
  const angegriffen = new Set(zentrum.angegriffen);
  return ohneDoppelte([
    ...(koenig.koenig === null ? [] : [feld(koenig.koenig, KOENIG_ZIEL[koenig.wertung])]),
    ...entwicklung.offen.map((stand) => feld(stand.feld, "rot")),
    ...entwickelt.map((f) => feld(f, "gold")),
    ...zentrum.bauern.map((f) => feld(f, angegriffen.has(f) ? "grau" : "gold")),
    ...zentrum.kontrolliert.map((f) => feld(f, "gold")),
    ...koenig.schild.map((f) => feld(f, "gold")),
    ...ZENTRUM.map((f) => feld(f, "grau")),
  ]);
}

/**
 * Rot: gegnerische Türme und Damen auf offenen oder halboffenen Linien am König, die ohne Bauern
 * dazwischen zum König sehen (C1.5: in Abb. 3.6 kein Pfeil vom Turm f8 durch f7 und f4).
 */
function linienZumKoenig(p: Stellungsprofil, farbe: Color): Markierung[] {
  const u = p.koenigsumgebung(farbe);
  if (!u) return [];
  return u.linienZumKoenig
    .filter((linie) => linie.zustand !== "geschlossen")
    .flatMap((linie) =>
      linie.freieSchwerfiguren.flatMap((von) => {
        const ziel = squareFromCoords(linie.linie, squareRank(u.koenig));
        return ziel === undefined || squareFile(von) !== linie.linie
          ? []
          : [pfeil(von, ziel, "rot")];
      }),
    );
}

/** König: Feld nach der Wertung, rot die Nachbarfelder, die der Gegner angreift. */
function koenigsmarkierungen(
  p: Stellungsprofil,
  farbe: Color,
  wertung: Einschaetzung,
): Markierung[] {
  const u = p.koenigsumgebung(farbe);
  if (!u) return [];
  const eigenes = wertung === "gut" ? "gold" : wertung === "schlecht" ? "rot" : "grau";
  return [
    feld(u.koenig, eigenes),
    ...u.angegriffen.map((f) => feld(f, "rot")),
    ...linienZumKoenig(p, farbe),
  ];
}

/**
 * Aktivität: gold die Drohungen der Seite (Schlag mit Gewinn oder Matt), grau ein Pfeil vom
 * billigsten Angreifer zu jeder übrigen angegriffenen gegnerischen Figur.
 */
function aktivitaetsmarkierungen(p: Stellungsprofil, farbe: Color): Markierung[] {
  const drohungen = p.drohungen(farbe) ?? [];
  const bedroht = new Set(drohungen.map((d) => d.zug.nach));
  const karte = p.angriffskarte;
  const angriffe = karte.figuren(gegner(farbe)).flatMap((ziel) => {
    if (bedroht.has(ziel.feld)) return [];
    const angreifer = [...karte.angreiferVon(ziel.feld, farbe, false)].sort(
      (a, b) => FIGURENWERT[a.rolle] - FIGURENWERT[b.rolle],
    )[0];
    return angreifer ? [pfeil(angreifer.feld, ziel.feld, "grau")] : [];
  });
  return [...drohungen.map((d) => pfeil(d.zug.von, d.zug.nach, "gold")), ...angriffe];
}

/**
 * Faktorenbilanz einer Seite am Brett.
 *
 * Zeit: ihre Figuren im Spiel gold, die noch auf dem Startfeld grau. Königssicherheit: König nach
 * der Wertung, angegriffene Nachbarfelder und Schwerfiguren auf Linien zum König rot. Aktivität:
 * Drohungen gold, Angriffe grau. Material zeigt die Waage in der Karte.
 * Beispiel: Abb. 3.10 aus Sicht von Weiß: König g1, Lc4, Df3 und Tf1 gold, Pfeil Dxf4 gold (Drohung),
 * Pfeil Lc4–f7 grau (Angriff), Ta1, Sb1 und Lc1 grau (noch zu Hause).
 */
export function faktormarkierungen(
  p: Stellungsprofil,
  z: Zeitvergleich,
  farbe: Color,
  koenig: Einschaetzung,
): Markierung[] {
  const imSpiel = new Set(z.imSpiel[farbe].map((stand) => stand.feld));
  const zuHause = p.angriffskarte
    .figuren(farbe)
    .filter((stand) => ZEITFIGUREN.has(stand.figur.role) && !imSpiel.has(stand.feld));
  return ohneDoppelte([
    ...koenigsmarkierungen(p, farbe, koenig),
    ...z.imSpiel[farbe].map((stand) => feld(stand.feld, "gold")),
    ...zuHause.map((stand) => feld(stand.feld, "grau")),
    ...aktivitaetsmarkierungen(p, farbe),
  ]);
}

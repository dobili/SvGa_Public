/**
 * Leitfrage 1 des Skelett-Röntgens: Felder. Löcher, sichere Felder und Springerfelder beider
 * Seiten, dazu der Zustand des Königsflügels (Haken, Löcher vor dem König, Grundreihe).
 *
 * Rolle im Gesamtbild: Baustein für k5-felder und k5-figuren (Zielfelder der Springer) sowie
 * k6-lap. Pflichtenheft 6.3: „Löcher beider Seiten (Felder, die kein Bauer mehr kontrollieren
 * kann), Vorposten, Zustand des Königsflügels (Haken, Löcher, Grundreihe).“
 * Abhängigkeiten: bauernprofil.ts (Löcher), koenigsumgebung.ts, sichereFelder.ts, chessops.
 * Buchbezug: Kapitel 5, „Leitfrage 1: Felder“ (Abb. 5.6 bis 5.13) und die Skelettbilanzen
 * (Abb. 5.14, 5.17, 5.22, 5.26, 5.32, 5.43, 5.44, 11.43, 11.57, 11.70).
 */
import { attacks } from "chessops/attacks";
import type { Board } from "chessops/board";
import type { Color, Square } from "chessops/types";
import { squareFile, squareFromCoords, squareRank } from "chessops/util";
import type { Figurenstand } from "./angriffskarte";
import type { Bauernprofil } from "./bauernprofil";
import { eigeneReihe, feldAusEigener, vonBauerGedeckt } from "./bauernprofil";
import type { Koenigsumgebung } from "./koenigsumgebung";
import { zugziele } from "./sichereFelder";
import { FIGURENWERT, gegner, type Stellung } from "./stellung";

/**
 * Starke Felder liegen auf der eigenen 4. bis 6. Reihe (Index 3 bis 5; Festlegung des Autors
 * zu P3: „gegnerische Hälfte (4.–6. Reihe)“); eigene Löcher, die der Gegner nutzen kann, auf der
 * eigenen 3. bis 5. Reihe (seine 4. bis 6.).
 */
const FELDER_VON = 3;
const FELDER_BIS = 5;
/** Die Reihen vor dem König, in denen Löcher den Königsflügel schwächen (eigene Sicht, Index). */
const KOENIGSREIHEN: readonly number[] = [2, 3];
/** Ein Schildbauer auf dieser eigenen Reihe (Index) oder weiter vorn ist vorgerückt. */
const HAKEN_AB_REIHE = 2;
/** Die Reihe (Index, eigene Sicht), auf der die Schildbauern vor dem Ziehen stehen. */
const SCHILD_GRUNDREIHE = 1;
const LINIEN = 8;

/**
 * Ein starkes Feld: Ein Feld auf der eigenen 4. bis 6. Reihe, das kein gegnerischer Bauer mehr
 * angreifen kann (Loch des Gegners), sicher für eigene Figuren. Mit Stütze eines eigenen Bauern
 * ist es ein Vorposten, mit einer eigenen Figur darauf oder einer, die hinkommt, ist er besetzt
 * oder dafür vorgesehen (Festlegung des Autors, P3, 23.10.2026).
 */
export interface SicheresFeld {
  readonly feld: Square;
  /** Ob ein eigener Bauer es jetzt deckt: dann ist es ein Vorposten. */
  readonly gestuetzt: boolean;
  /** Die eigene Figur (kein Bauer), die darauf steht, sonst null. */
  readonly besetztVon: Figurenstand | null;
  /** Eigene Figuren außer Bauern und König, die das Feld mit einem Zug erreichen. */
  readonly erreichbar: readonly Square[];
}

/**
 * Ein Springerfeld: von einem eigenen Bauern gestützt, von keinem gegnerischen Bauern angegriffen,
 * aber noch angreifbar, sobald ein gegnerischer Bauer zieht (Abb. 5.32: e5 „solange Schwarz
 * nicht ...f6 spielt“).
 */
export interface Springerfeld {
  readonly feld: Square;
  /** Der gegnerische Bauer, der das Feld nach einem Zug angreifen könnte. */
  readonly angreifbarDurch: Square;
}

/** Ein eigenes Loch: Kann der Gegner es nutzen (eine Figur erreicht es, oder ein Bauer stützt es)? */
export interface Loch {
  readonly feld: Square;
  readonly nutzbar: boolean;
  /** Eine eigene Figur, die darauf steht (Abb. 11.57: der Läufer d3 auf dem Loch d3), sonst null. */
  readonly besetztVon: Figurenstand | null;
}

/** Zustand des eigenen Königsflügels (Kapitel 5, „Löcher vor dem eigenen König“). */
export interface Koenigsfluegel {
  readonly koenig: Square;
  /**
   * Vorgerückte Schildbauern, die ein gegnerischer Bauer mit einem Hebel erreichen kann
   * (Abb. 5.9: h3 gegen den g-Bauern; Abb. 11.34: g6 gegen h4–h5).
   */
  readonly haken: readonly Square[];
  /**
   * Vorgerückte Schildbauern, deren Ausgangsfeld dem König ein Fluchtfeld gibt (Abb. 5.13:
   * „Luftloch h3“, der König entkommt nach h2).
   */
  readonly luftloecher: readonly { readonly bauer: Square; readonly fluchtfeld: Square }[];
  /** Eigene Löcher auf den Linien um den König, zwei und drei Reihen vor ihm. */
  readonly loecher: readonly Square[];
  /** König auf der Grundreihe ohne Fluchtfeld nach vorn (Abb. 5.12: ohne Luftloch). */
  readonly ohneLuftloch: boolean;
  /** Ohne Luftloch und ohne eigenen Turm oder Dame auf der Grundreihe: Grundreihenmatt droht. */
  readonly grundreihenschwaeche: boolean;
}

/** Die Antwort auf Leitfrage 1 für eine Seite. */
export interface Felderbefund {
  readonly farbe: Color;
  /** Eigene Löcher im Bereich der gegnerischen 4. bis 6. Reihe, mit „nutzbar“. */
  readonly eigeneLoecher: readonly Loch[];
  /** Sichere Felder für eigene Figuren (gegnerische Löcher ab der eigenen 4. Reihe). */
  readonly sichere: readonly SicheresFeld[];
  readonly springerfelder: readonly Springerfeld[];
  readonly koenigsfluegel: Koenigsfluegel | null;
}

/** Alle Felder der eigenen Reihen von..bis (Index, eigene Sicht). */
function felderDerReihen(farbe: Color, von: number, bis: number): Square[] {
  const felder: Square[] = [];
  for (let reihe = von; reihe <= bis; reihe += 1) {
    for (let linie = 0; linie < LINIEN; linie += 1) {
      const feld = feldAusEigener(linie, reihe, farbe);
      if (feld !== null) felder.push(feld);
    }
  }
  return felder;
}

/** Ob ein gegnerischer Bauer das Feld jetzt angreift. */
function vonGegnerbauerAngegriffen(brett: Board, feld: Square, farbe: Color): boolean {
  return vonBauerGedeckt(brett, feld, gegner(farbe));
}

/**
 * Der gegnerische Bauer, der das Feld nach einem Bauernzug angreifen könnte: auf einer
 * Nachbarlinie, aus seiner Sicht hinter dem Feld.
 */
function spaetererAngreifer(brett: Board, feld: Square, farbe: Color): Square | null {
  const feind = gegner(farbe);
  const reihe = eigeneReihe(feld, feind);
  for (const nachbar of [squareFile(feld) - 1, squareFile(feld) + 1]) {
    for (let r = 0; r < reihe - 1; r += 1) {
      const kandidat = feldAusEigener(nachbar, r, feind);
      const figur = kandidat === null ? undefined : brett.get(kandidat);
      if (figur?.role === "pawn" && figur.color === feind && kandidat !== null) return kandidat;
    }
  }
  return null;
}

/** Eigene Figuren außer König und Bauern, die ein Feld mit einem Zug erreichen, Leichtfiguren zuerst. */
function erreichtVon(ziele: Map<Square, Iterable<Square>>, brett: Board, feld: Square): Square[] {
  const figuren: { von: Square; wert: number }[] = [];
  for (const [von, felder] of ziele) {
    const figur = brett.get(von);
    if (!figur || figur.role === "pawn" || figur.role === "king") continue;
    for (const ziel of felder) {
      if (ziel === feld) figuren.push({ von, wert: FIGURENWERT[figur.role] });
    }
  }
  return figuren.sort((a, b) => a.wert - b.wert || a.von - b.von).map((f) => f.von);
}

/** Greift eine Figur (kein Bauer) der Farbe das Feld an? */
function vonFigurAngegriffen(brett: Board, feld: Square, farbe: Color): boolean {
  for (const von of brett[farbe].diff(brett.pawn)) {
    const figur = brett.get(von);
    if (figur && attacks(figur, von, brett.occupied).has(feld)) return true;
  }
  return false;
}

/**
 * Sichere Felder und Springerfelder einer Seite ab der eigenen 4. Reihe.
 *
 * Regel: Kapitel 5, „Starke Felder und Vorposten“: ein Feld, das kein gegnerischer Bauer mehr
 * angreifen kann (Loch des Gegners); ein Vorposten, wenn ein eigener Bauer es stützt. Ein
 * Springerfeld ist gestützt und frei von Bauernangriffen, aber noch angreifbar (Abb. 5.7: e5 im
 * Kieseritzky-Gambit ist kein Vorposten, „da der schwarze d-Bauer ihn mit ...d6 jederzeit
 * angreifen kann“).
 */
function felderFuer(
  stellung: Stellung,
  farbe: Color,
  gegnerprofil: Bauernprofil,
): { sichere: SicheresFeld[]; springerfelder: Springerfeld[] } {
  const { brett } = stellung;
  const loecherGegner = new Set(gegnerprofil.loecher);
  const ziele = zugziele(stellung, farbe);
  const sichere: SicheresFeld[] = [];
  const springerfelder: Springerfeld[] = [];
  for (const feld of felderDerReihen(farbe, FELDER_VON, FELDER_BIS)) {
    const eigen = brett.get(feld);
    if (eigen?.role === "pawn") continue;
    if (loecherGegner.has(feld)) {
      sichere.push({
        feld,
        gestuetzt: vonBauerGedeckt(brett, feld, farbe),
        besetztVon: eigen && eigen.color === farbe ? { feld, figur: eigen } : null,
        erreichbar: erreichtVon(ziele, brett, feld),
      });
      continue;
    }
    if (!vonBauerGedeckt(brett, feld, farbe) || vonGegnerbauerAngegriffen(brett, feld, farbe)) {
      continue;
    }
    const spaeter = spaetererAngreifer(brett, feld, farbe);
    if (spaeter !== null) springerfelder.push({ feld, angreifbarDurch: spaeter });
  }
  return { sichere, springerfelder };
}

/**
 * Kann ein gegnerischer Bauer den Schildbauern mit einem Hebel erreichen? Er steht auf einer
 * Nachbarlinie weiter vorn (aus eigener Sicht) und kann ungehindert bis auf das Feld ziehen, von
 * dem aus er den Schildbauern angreift; steht er schon dort, ist der Hebel schon da.
 */
function hebelErreichbar(brett: Board, bauer: Square, farbe: Color): boolean {
  const angriffsreihe = eigeneReihe(bauer, farbe) + 1;
  const gegnerbauern = [...brett.pawn.intersect(brett[gegner(farbe)])];
  return [squareFile(bauer) - 1, squareFile(bauer) + 1].some((linie) =>
    gegnerbauern.some((g) => {
      if (squareFile(g) !== linie || eigeneReihe(g, farbe) < angriffsreihe) return false;
      for (let reihe = angriffsreihe; reihe < eigeneReihe(g, farbe); reihe += 1) {
        const feld = feldAusEigener(linie, reihe, farbe);
        if (feld !== null && brett.pawn.has(feld)) return false;
      }
      return true;
    }),
  );
}

/** Luftlöcher: vorgerückte Schildbauern, deren Ausgangsfeld jetzt ein Fluchtfeld des Königs ist. */
function luftloecherVon(
  vorgerueckt: readonly Square[],
  umgebung: Koenigsumgebung,
  farbe: Color,
): { bauer: Square; fluchtfeld: Square }[] {
  return vorgerueckt.flatMap((bauer) => {
    const fluchtfeld = feldAusEigener(squareFile(bauer), SCHILD_GRUNDREIHE, farbe);
    return fluchtfeld !== null && umgebung.fluchtfelder.includes(fluchtfeld)
      ? [{ bauer, fluchtfeld }]
      : [];
  });
}

/**
 * Zustand des Königsflügels: Haken, Luftlöcher, Löcher um den König, Grundreihe ohne Luftloch.
 *
 * Regel: Kapitel 5, „Löcher vor dem eigenen König“: Die Bauern vor dem König sind der Schild,
 * „sobald du einen dieser Bauern ziehst, kann der vorgezogene Bauer zu einem Haken werden“;
 * Grundreihenmatt droht, wenn der König hinter seiner geschlossenen Bauernreihe feststeckt.
 * „Der Zug h3 ist ein Luftloch“ (Abb. 5.13): Gibt der vorgerückte Bauer dem König ein
 * Fluchtfeld, nennt die App ihn Luftloch; Haken heißt er nur, wenn ein gegnerischer Bauer ihn
 * mit einem Hebel erreichen kann (Entscheidung des Autors zu C1.12; Abb. 5.13: Schwarz hat
 * keinen Bauern).
 */
function koenigsfluegelVon(
  brett: Board,
  umgebung: Koenigsumgebung | null,
  profil: Bauernprofil,
  farbe: Color,
): Koenigsfluegel | null {
  // Vor der Rochade gibt es keinen Königsflügel-Schild; Haken und Luftloch gelten erst danach.
  if (!umgebung || !umgebung.rochiert) return null;
  const linieKoenig = squareFile(umgebung.koenig);
  const linien = [linieKoenig - 1, linieKoenig, linieKoenig + 1].filter((l) => l >= 0 && l < 8);
  const vorgerueckt = umgebung.bauernschild.filter((b) => eigeneReihe(b, farbe) >= HAKEN_AB_REIHE);
  const reiheKoenig = eigeneReihe(umgebung.koenig, farbe);
  const loecher = profil.loecher.filter((loch) => {
    const abstand = eigeneReihe(loch, farbe) - reiheKoenig;
    return linien.includes(squareFile(loch)) && KOENIGSREIHEN.includes(abstand);
  });
  const vorn = umgebung.fluchtfelder.some((f) => eigeneReihe(f, farbe) > reiheKoenig);
  const ohneLuftloch = reiheKoenig === 0 && !vorn;
  const schwerfigurHinten = [...brett.rook.union(brett.queen).intersect(brett[farbe])].some(
    (f) => eigeneReihe(f, farbe) === 0,
  );
  return {
    koenig: umgebung.koenig,
    haken: vorgerueckt.filter((b) => hebelErreichbar(brett, b, farbe)),
    luftloecher: luftloecherVon(vorgerueckt, umgebung, farbe),
    loecher,
    ohneLuftloch,
    grundreihenschwaeche: ohneLuftloch && !schwerfigurHinten,
  };
}

/**
 * Die Antwort auf Leitfrage 1 für eine Seite.
 *
 * Eingaben: Stellung, Farbe, Bauernprofile beider Seiten, Königsumgebung der Seite.
 * Ausgabe: Felderbefund. Beispiel: Abb. 5.8 (Najdorf), Weiß: sicheres Feld d5, gestützt von
 * e4, erreichbar vom Springer c3. Abb. 5.32 (Carlsbad), Weiß: Springerfeld e5 (gestützt von
 * d4, angreifbar durch f7).
 * Sonderfälle: Ohne König oder vor der Rochade kein Königsflügel; Felder mit eigenem Bauern
 * zählen weder als Loch noch als sicheres Feld.
 */
export function felderbefund(
  stellung: Stellung,
  farbe: Color,
  profile: { readonly eigen: Bauernprofil; readonly gegner: Bauernprofil },
  umgebung: Koenigsumgebung | null,
): Felderbefund {
  const { sichere, springerfelder } = felderFuer(stellung, farbe, profile.gegner);
  const feind = gegner(farbe);
  // Ein Loch, auf dem ein eigener Bauer steht, kann der Gegner nicht nutzen. Nutzbar ist es,
  // wenn ein gegnerischer Bauer es stützt oder eine gegnerische Figur es mit einem Zug erreicht
  // und keine eigene Figur es angreift (Kapitel 5: „ob eine seiner Figuren es erreichen und
  // sich dort halten kann“; Abb. 11.70: a6 erreicht die Dame, hält sich dort aber nicht).
  const zieleGegner = zugziele(stellung, feind);
  const eigeneLoecher: Loch[] = profile.eigen.loecher
    .filter((loch) => {
      const reiheGegner = eigeneReihe(loch, feind);
      const eigenerBauer = stellung.brett.get(loch)?.role === "pawn";
      return reiheGegner >= FELDER_VON && reiheGegner <= FELDER_BIS && !eigenerBauer;
    })
    .map((feld) => {
      const figur = stellung.brett.get(feld);
      return {
        feld,
        nutzbar:
          vonBauerGedeckt(stellung.brett, feld, feind) ||
          (erreichtVon(zieleGegner, stellung.brett, feld).length > 0 &&
            !vonFigurAngegriffen(stellung.brett, feld, farbe)),
        besetztVon: figur && figur.color === farbe ? { feld, figur } : null,
      };
    });
  return {
    farbe,
    eigeneLoecher,
    sichere,
    springerfelder,
    koenigsfluegel: koenigsfluegelVon(stellung.brett, umgebung, profile.eigen, farbe),
  };
}

/** Das Feld direkt vor einem Bauern aus Sicht seiner Farbe, oder null am Rand. */
export function feldVor(feld: Square, farbe: Color): Square | null {
  return (
    squareFromCoords(squareFile(feld), squareRank(feld) + (farbe === "white" ? 1 : -1)) ?? null
  );
}

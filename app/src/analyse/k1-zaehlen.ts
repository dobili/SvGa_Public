/**
 * Werkzeug k1-zaehlen: Angreifer und Verteidiger eines Feldes zählen und die Abtauschbilanz nennen.
 *
 * Rolle im Gesamtbild: Das erste Werkzeug der App (Durchstich, AP 1). Es zeigt am Brett dieselben
 * Pfeile wie das Buch: Rot die angreifende Seite, Gold die verteidigende.
 * Abhängigkeiten: analyse/stellungsprofil.ts (Angriffskarte, Abtausch), i18n.
 * Buchbezug: Kapitel 1, „Werte von Angreifer und Verteidiger zählen“ und
 * „Zählen in der Praxis: der Bauernhebel“ (Abb. 1.26 bis 1.28).
 */
import type { Board } from "chessops/board";
import type { Color, Square } from "chessops/types";
import { squareFile, squareRank } from "chessops/util";
import { figurenbuchstaben, sprache, t } from "../i18n/sprache";
import type { Abtausch } from "../schach/abtausch";
import type { Angreifer } from "../schach/angreifer";
import {
  farbkuerzel,
  feldAusName,
  feldname,
  FIGURENWERT,
  gegner,
  ROLLENBUCHSTABE,
  type Stellung,
} from "../schach/stellung";
import { profil } from "./stellungsprofil";
import type { Befund, Markierung, Werkzeug, Werkzeugergebnis } from "./werkzeug";

/** Ab diesem Abstand nennt das Buch die Linie, über die eine Figur deckt („über die d-Linie“). */
const MINDESTABSTAND_FUER_LINIE = 2;
/** Die Befunde jeder Stufe: Angreifer und Verteidiger gehören immer zusammen. */
const ZWEI_SEITEN = ["angreifer", "verteidiger"] as const;

/** Name einer Figur mit Feld, etwa „Dame b6“, dazu Batterie oder Linie. */
function beschreibe(figur: Angreifer, ziel: Square): string {
  const name = `${t(`figur.${ROLLENBUCHSTABE[figur.rolle]}`)} ${feldname(figur.feld)}`;
  if (figur.hinter !== null) {
    return `${name} ${t("zaehlen.batterie", { feld: feldname(figur.hinter) })}`;
  }
  const linie = linienname(figur, ziel);
  return linie ? `${name} ${t("zaehlen.linie", { linie })}` : name;
}

/**
 * Nennt die Linie, wenn eine Turm- oder Damenfigur aus der Ferne über eine Linie oder Reihe deckt.
 * Regel: Kapitel 1, Abb. 1.26: „die Dame auf d1, die den Bauern über die d-Linie hinweg deckt“.
 */
function linienname(figur: Angreifer, ziel: Square): string | null {
  if (figur.rolle !== "rook" && figur.rolle !== "queen") {
    return null;
  }
  const gleicheLinie = squareFile(figur.feld) === squareFile(ziel);
  const gleicheReihe = squareRank(figur.feld) === squareRank(ziel);
  const abstand = Math.max(
    Math.abs(squareFile(figur.feld) - squareFile(ziel)),
    Math.abs(squareRank(figur.feld) - squareRank(ziel)),
  );
  if (abstand < MINDESTABSTAND_FUER_LINIE) {
    return null;
  }
  if (gleicheLinie) {
    return t("linie.datei", { buchstabe: feldname(ziel).charAt(0) });
  }
  return gleicheReihe ? t("linie.reihe", { zahl: squareRank(ziel) + 1 }) : null;
}

/** Ein Schlag in Kurzschreibweise wie im Buch: „cxd4“, „Sxd4“. */
function schlagAlsText(figur: Angreifer, ziel: Square): string {
  if (figur.rolle === "pawn") {
    return `${feldname(figur.feld).charAt(0)}x${feldname(ziel)}`;
  }
  const buchstabe = ROLLENBUCHSTABE[figur.rolle].toUpperCase();
  return `${figurenbuchstaben(sprache())[buchstabe] ?? buchstabe}x${feldname(ziel)}`;
}

/** Bauerneinheiten als Text mit Vorzeichen, etwa „+1 Bauerneinheit“. */
function bauerneinheiten(wert: number): string {
  const betrag = Math.abs(wert);
  const text = betrag === 1 ? t("bauerneinheit.eins") : t("bauerneinheit.mehr", { wert: betrag });
  return `${wert > 0 ? "+" : "−"}${text}`;
}

/** Der Satz zur Bilanz (Regel: Kapitel 1, „Drei gegen drei: Noch geht nichts“). */
function fazitZurBilanz(ergebnis: Abtausch | null, seite: Color, ziel: Square): string {
  if (ergebnis === null) {
    return t("zaehlen.leeresFeld");
  }
  if (ergebnis.schlagfolge.length === 0) {
    return t("zaehlen.bilanz.keinAngreifer", { farbe: t(`farbe.${farbkuerzel(seite)}`) });
  }
  if (ergebnis.bilanz <= 0) {
    return t("zaehlen.bilanz.null");
  }
  const zuege = ergebnis.schlagfolge
    .slice(0, ergebnis.lohnendeSchlaege)
    .map((schlag) => schlagAlsText(schlag.figur, ziel))
    .join(" ");
  return t("zaehlen.bilanz.plus", {
    farbe: t(`farbe.${farbkuerzel(seite)}`),
    zuege,
    bilanz: bauerneinheiten(ergebnis.bilanz),
  });
}

/**
 * Bestimmt, welche Seite angreift: die Gegenseite der Figur auf dem Feld, bei einem leeren Feld
 * die Seite am Zug.
 */
function angreifendeSeite(brett: Board, ziel: Square, amZug: Color): Color {
  const figur = brett.get(ziel);
  return figur ? gegner(figur.color) : amZug;
}

/** Sortiert Figuren wie das Buch sie aufzählt: billigste zuerst (Bauer c5, Springer c6, Dame b6). */
function nachWert(figuren: readonly Angreifer[]): Angreifer[] {
  return [...figuren].sort((a, b) => FIGURENWERT[a.rolle] - FIGURENWERT[b.rolle]);
}

/** Pfeile und Feldmarke wie im Buch: Rot greift an, Gold verteidigt, das Feld rot. */
function markierungen(
  rot: readonly Angreifer[],
  gold: readonly Angreifer[],
  ziel: Square,
): Markierung[] {
  const nach = feldname(ziel);
  const pfeil =
    (farbe: "rot" | "gold") =>
    (figur: Angreifer): Markierung => ({
      typ: "pfeil",
      farbe,
      von: feldname(figur.feld),
      nach,
    });
  return [
    ...rot.map(pfeil("rot")),
    ...gold.map(pfeil("gold")),
    { typ: "feld", farbe: "rot", feld: nach },
  ];
}

/** Ein Befund mit der Liste der Figuren einer Seite. */
function listenbefund(
  kennung: string,
  titel: string,
  figuren: readonly Angreifer[],
  ziel: Square,
  farbe: "rot" | "gold",
): Befund {
  const zeilen =
    figuren.length > 0 ? figuren.map((f) => beschreibe(f, ziel)) : [t("zaehlen.keine")];
  return { kennung, art: "E", titel, zeilen, farbe };
}

/**
 * Zählt Angreifer und Verteidiger eines Feldes und berechnet die Abtauschbilanz.
 *
 * Warum: Das Buch verlangt vor jedem Schlagabtausch: „Zähle auf dem umkämpften Feld immer
 * zunächst, wie oft es von dir angegriffen und wie oft es vom Gegner verteidigt wird.“
 * Eingaben: Stellung und angetipptes Feld; Angreifer und Abtausch kommen aus dem Stellungsprofil.
 * Ausgabe: Werkzeugergebnis.
 * Beispiel: Abb. 1.26, d4: Schwarz greift an mit Bauer c5, Springer c6, Dame b6 (Batterie hinter
 * c5); Weiß deckt mit Bauer c3, Springer f3, Dame d1 (über die d-Linie). 3 gegen 3, Bilanz 0.
 * Sonderfälle: Leeres Feld: Die Seite am Zug gilt als angreifend, eine Bilanz gibt es nicht.
 */
export function zaehle(stellung: Stellung, ziel: Square): Werkzeugergebnis {
  const { angriffskarte, abtausch } = profil(stellung);
  const seite = angreifendeSeite(stellung.brett, ziel, stellung.amZug);
  const rot = nachWert(angriffskarte.angreiferVon(ziel, seite));
  const gold = nachWert(angriffskarte.angreiferVon(ziel, gegner(seite)));
  const ergebnis = abtausch(ziel);
  const farbname = (farbe: Color) => t(`farbe.${farbkuerzel(farbe)}`);
  const stand = t("zaehlen.stand", { angreifer: rot.length, verteidiger: gold.length });
  return {
    werkzeug: "k1-zaehlen",
    art: "E",
    ueberschrift: t("zaehlen.titel", { feld: feldname(ziel) }),
    befunde: [
      listenbefund(
        "angreifer",
        t("zaehlen.greiftAn", { farbe: farbname(seite) }),
        rot,
        ziel,
        "rot",
      ),
      listenbefund(
        "verteidiger",
        t("zaehlen.deckt", { farbe: farbname(gegner(seite)) }),
        gold,
        ziel,
        "gold",
      ),
    ],
    fazit: `${stand}: ${fazitZurBilanz(ergebnis, seite, ziel)}`,
    markierungen: markierungen(rot, gold, ziel),
    // Schon Stufe 1 zeigt beide Seiten: Zählen heißt Angreifer gegen Verteidiger stellen
    // (Regel: Kapitel 1, Zählen von Angreifern und Verteidigern); das Fazit nennt beide Zahlen.
    // Seit den gestuften Karten (0.2.30) hätte die Karte sonst die Verteidiger versteckt.
    stufen: [ZWEI_SEITEN, ZWEI_SEITEN, ZWEI_SEITEN],
    regel: t("werkzeug.k1-zaehlen.regel"),
  };
}

/** Das Werkzeug k1-zaehlen in der gemeinsamen Form aller Werkzeuge (Konzept 7.1). */
export const k1Zaehlen: Werkzeug = {
  id: "k1-zaehlen",
  kapitel: 1,
  name: "werkzeug.k1-zaehlen.name",
  regel: "werkzeug.k1-zaehlen.regel",
  erklaerung: "werkzeug.k1-zaehlen.erklaerung",
  art: "E",
  braucht: ["stellung", "feld"],
  berechne: ({ stellung, feld }) => {
    const ziel = feld === undefined ? null : feldAusName(feld);
    return ziel === null ? null : zaehle(stellung, ziel);
  },
};

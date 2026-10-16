/**
 * Werkzeug k1-angriffsregel: die goldene Angriffsregel aus Kapitel 1 für beide Seiten.
 *
 * Rolle im Gesamtbild: Pflichtenheft 6.2 („Zählt Angreifer und Verteidiger im Bereich um den
 * gegnerischen König. Faustregel des Buches: mindestens drei bis vier Figuren im
 * Angriffssektor“). Hervorhebungen für den eigenen Angriff: Gold die Angreifer, Rot die
 * Verteidiger, Grau der Sektor. Art N (automatische Einschätzung).
 * Abhängigkeiten: schach/angriffssektor.ts, analyse/stellungsprofil.ts, i18n.
 * Buchbezug: Kapitel 1, „Angriff braucht Übermacht“, Abb. 1.36 (ein Angreifer ist zu wenig) und
 * Abb. 1.37 (drei reichen).
 */
import type { Color } from "chessops/types";
import { squareFile, squareFromCoords, squareRank } from "chessops/util";
import { t } from "../i18n/sprache";
import { angriffssektor, type Angriffssektor } from "../schach/angriffssektor";
import { fesselungen } from "../schach/linienmotive";
import { feldname, gegner, type Stellung } from "../schach/stellung";
import { profil, type Stellungsprofil } from "./stellungsprofil";
import { aufzaehlung, farbname, figurkurz } from "./texte";
import type { Befund, Markierung, Werkzeug, Werkzeugergebnis } from "./werkzeug";

/** Faustregel des Buches: „mindestens drei bis vier Figuren im Angriffssektor“. */
const FAUSTREGEL_MINDESTENS = 3;
/** Brettränder: Dort braucht der Sektor keine Grenze. */
const ERSTE_LINIE = 0;
const LETZTE_LINIE = 7;

type Urteil = "uebermacht" | "gleichstand" | "zuWenig";

function urteil(s: Angriffssektor): Urteil {
  if (s.angreiferListe.length < FAUSTREGEL_MINDESTENS) return "zuWenig";
  return s.angreiferListe.length > s.verteidiger.length ? "uebermacht" : "gleichstand";
}

/** Der Sektor gegen die Farbe des Verteidigers; absolut gefesselte Figuren beider Seiten und
 * überlastete Verteidiger zählen nicht. */
export function sektorGegen(p: Stellungsprofil, angreifer: Color): Angriffssektor | null {
  const verteidiger = gegner(angreifer);
  const gefesselt = new Set(fesselungen(p.linienmotive(), true).map((f) => f.vorn.feld));
  const ueberlastet = new Set(
    (p.doppelteAufgaben(verteidiger) ?? []).map((d) => d.verteidiger.feld),
  );
  return angriffssektor(p.stellung.brett, angreifer, gefesselt, ueberlastet);
}

/** „e5–h8“: die Ecken des Sektors. */
function sektorname(s: Angriffssektor): string {
  const ecke = (linie: number | undefined, reihe: number | undefined) => {
    const feld = squareFromCoords(linie ?? 0, reihe ?? 0);
    return feld === undefined ? "" : feldname(feld);
  };
  return `${ecke(s.linien[0], s.reihen[0])}–${ecke(s.linien.at(-1), s.reihen.at(-1))}`;
}

function liste(staende: Angriffssektor["angreiferListe"]): string {
  return staende.length > 0 ? aufzaehlung(staende.map(figurkurz)) : t("angriffsregel.keine");
}

function befund(s: Angriffssektor, kennung: string, farbe: "gold" | "rot"): Befund {
  const zeilen = [
    t("angriffsregel.angreifer", {
      liste: liste(s.angreiferListe),
      anzahl: s.angreiferListe.length,
    }),
    t("angriffsregel.verteidiger", { liste: liste(s.verteidiger), anzahl: s.verteidiger.length }),
    ...s.ausgenommen.map((a) =>
      t(`angriffsregel.ausgenommen.${a.grund}`, { figur: figurkurz(a.stand) }),
    ),
    t(`angriffsregel.urteil.${urteil(s)}`),
  ];
  return {
    kennung,
    art: "N",
    titel: t(`angriffsregel.titel.${kennung === "eigen" ? "eigen" : "gegner"}`, {
      farbe: farbname(s.angreifer),
      sektor: sektorname(s),
    }),
    zeilen,
    farbe,
  };
}

/** Liegt das Feld an der Grenze des Sektors zum übrigen Brett (nicht am Brettrand)? */
function amRand(s: Angriffssektor, feld: number): boolean {
  const innereLinien = [s.linien[0], s.linien.at(-1)].filter(
    (linie) => linie !== ERSTE_LINIE && linie !== LETZTE_LINIE,
  );
  const innereReihe = s.angreifer === "white" ? s.reihen[0] : s.reihen.at(-1);
  return innereLinien.includes(squareFile(feld)) || squareRank(feld) === innereReihe;
}

/** Gold die Angreifer, Rot die Verteidiger, Grau die Grenze des Sektors (Pflichtenheft 6.2). */
function markierungen(s: Angriffssektor): Markierung[] {
  const feld = (f: number, farbe: "gold" | "rot" | "grau"): Markierung => ({
    typ: "feld",
    farbe,
    feld: feldname(f),
  });
  const belegt = new Set([...s.angreiferListe, ...s.verteidiger].map((stand) => stand.feld));
  const grau = [...s.felder]
    .filter((f) => !belegt.has(f) && amRand(s, f))
    .map((f) => feld(f, "grau"));
  return [
    ...grau,
    ...s.angreiferListe.map((stand) => feld(stand.feld, "gold")),
    ...s.verteidiger.map((stand) => feld(stand.feld, "rot")),
  ];
}

/**
 * Wendet die goldene Angriffsregel auf beide Seiten an.
 *
 * Warum: „Bring deine gesamte Armee koordiniert nach vorne, bevor du eine entscheidende Aktion
 * einleitest“ (Kapitel 1). Eingaben: Stellung, eigene Seite. Ausgabe: der eigene Angriff (Gold)
 * und der des Gegners (Rot), je mit Angreifern, Verteidigern und Urteil, oder null ohne Könige.
 * Beispiel: Abb. 1.37: Ld3, Sf3 und Dd1 gegen Tf8: „Die Übermacht steht.“
 */
export function angriffsregel(stellung: Stellung, eigen: Color): Werkzeugergebnis | null {
  const p = profil(stellung);
  const mein = sektorGegen(p, eigen);
  const sein = sektorGegen(p, gegner(eigen));
  if (!mein || !sein) return null;
  return {
    werkzeug: "k1-angriffsregel",
    art: "N",
    ueberschrift: t("angriffsregel.ueberschrift"),
    befunde: [befund(mein, "eigen", "gold"), befund(sein, "gegner", "rot")],
    fazit: t(`angriffsregel.fazit.${urteil(mein)}`, {
      angreifer: mein.angreiferListe.length,
      verteidiger: mein.verteidiger.length,
    }),
    markierungen: markierungen(mein),
    stufen: [["eigen"], ["eigen", "gegner"], ["eigen", "gegner"]],
    regel: t("werkzeug.k1-angriffsregel.regel"),
  };
}

/** Das Werkzeug k1-angriffsregel in der gemeinsamen Form aller Werkzeuge (Konzept 7.1). */
export const k1Angriffsregel: Werkzeug = {
  id: "k1-angriffsregel",
  kapitel: 1,
  name: "werkzeug.k1-angriffsregel.name",
  regel: "werkzeug.k1-angriffsregel.regel",
  erklaerung: "werkzeug.k1-angriffsregel.erklaerung",
  art: "N",
  braucht: ["stellung"],
  berechne: ({ stellung, perspektive }) => angriffsregel(stellung, perspektive),
};

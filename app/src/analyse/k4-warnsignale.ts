/**
 * Werkzeug k4-warnsignale: die fünf Warnsignale W1 bis W5 aus Kapitel 4 für beide Seiten.
 *
 * Rolle im Gesamtbild: Pflichtenheft 6.2 („W1 ungedeckte Figur, W2 gefährliche Linie, W3 König
 * ohne Luft, W4 doppelte Aufgabe, W5 Geschenk“) mit den Regeln aus Pflichtenheft 6.6. Die Signale
 * der eigenen Seite (Perspektive, sonst die Seite am Zug) sind Gefahren und stehen rot am Brett,
 * die des Gegners sind Ziele und stehen gold; W5 nennt, was der Gegner scheinbar verschenkt.
 * Jede betroffene Figur trägt am Brett ihre Kennung (W1 … W5).
 * Abhängigkeiten: analyse/stellungsprofil.ts (Angriffskarte, Strahlen, Königsumgebung,
 * doppelte Aufgaben, Schläge), i18n.
 * Buchbezug: Kapitel 4, „Die fünf Warnsignale“ und die Fallenchecks (Abb. 4.2, 4.11, 4.13, 4.21,
 * 4.24, 4.29, 4.38, 4.45, 4.51); Kapitel 7 erweitert W2 und W3 (Pflichtenheft 6.6).
 * Entscheidungen des Autors: W2 auch mit König oder Dame vorn und ungedeckter Figur dahinter
 * (C1.8), W4 auch als einziger Verteidiger gegen ein Matt (C1.7) und mit Rückschlag-Probe (C2.9),
 * W5 auch „scheinbar“ hinter gefesselten Verteidigern (D.4).
 */
import type { Color, Square } from "chessops/types";
import { sprache, t } from "../i18n/sprache";
import type { Figurenstand } from "../schach/angriffskarte";
import { istW4, type DoppelteAufgabe } from "../schach/aufgaben";
import { fesselungslinien } from "../schach/fesselungen";
import type { Schlagzug } from "../schach/drohungen";
import { sanInSprache } from "../schach/notation";
import { farbkuerzel, feldname, FIGURENWERT, gegner, type Stellung } from "../schach/stellung";
import { verlaesstLinie, type Strahl } from "../schach/strahlen";
import { profil, type Stellungsprofil } from "./stellungsprofil";
import type { Befund, Markierung, Markierungsfarbe, Werkzeug, Werkzeugergebnis } from "./werkzeug";
import { aufzaehlung, farbname, figurenname, schlagtext } from "./texte";

/** Figuren, deren Stehen hinter einer anderen Figur W2 auslöst (Pflichtenheft 6.6). */
const WERTVOLLE_HINTEN = new Set(["king", "queen", "rook"]);

/** Eine gefährliche Linie (W2): Langschrittfigur, vordere und hintere Figur, Art des Motivs. */
export interface GefaehrlicheLinie {
  readonly von: Figurenstand;
  readonly vorn: Figurenstand;
  readonly hinten: Figurenstand;
  /** „weicht“: König oder Dame vorn, dahinter eine ungedeckte eigene Figur (C1.8, Abb. 4.8). */
  readonly art: "fesselung" | "spiess" | "abzug" | "weicht";
}

/** Vordere Figuren, hinter denen schon eine ungedeckte Figur W2 auslöst (C1.8). */
const WERTVOLLE_VORN = new Set(["king", "queen"]);

/** Die Warnsignale W1 bis W4 einer Seite. */
interface Signale {
  readonly w1: readonly Figurenstand[];
  readonly w2: readonly GefaehrlicheLinie[];
  readonly w3: Figurenstand | null;
  readonly w4: readonly DoppelteAufgabe[] | null;
}

/**
 * W2 auf einem Strahl, oder null.
 *
 * Regel: Pflichtenheft 6.6, „Auf dem Strahl einer Langschrittfigur steht eine Figur, direkt
 * dahinter eine gegnerische Figur, die König, Dame oder Turm ist, wertvoller als die vordere oder
 * ungedeckt. Ist die vordere Figur gegnerisch: Fesselung oder Spieß. Ist sie eigene: Abzug.“
 */
function gefaehrlicheLinie(strahl: Strahl, p: Stellungsprofil): GefaehrlicheLinie | null {
  const { erste: vorn, zweite: hinten } = strahl;
  if (!vorn || !hinten || hinten.figur.color === strahl.figur.color) return null;
  return wertvollHinten(strahl, vorn, hinten, p) ?? ungedecktHinten(strahl, vorn, hinten, p);
}

/** Die Regel aus Pflichtenheft 6.6: hinten König, Dame oder Turm (siehe gefaehrlicheLinie). */
function wertvollHinten(
  strahl: Strahl,
  vorn: Figurenstand,
  hinten: Figurenstand,
  p: Stellungsprofil,
): GefaehrlicheLinie | null {
  if (!WERTVOLLE_HINTEN.has(hinten.figur.role)) return null;
  const wertvoller = FIGURENWERT[hinten.figur.role] > FIGURENWERT[vorn.figur.role];
  const ungedeckt =
    hinten.figur.role !== "king" &&
    p.angriffskarte.angreiferVon(hinten.feld, hinten.figur.color).length === 0;
  if (!wertvoller && !ungedeckt) return null;
  // Präzisierung der App: Ein Bauer auf einer Linie verlässt sie nur mit einem Schlag; sonst gibt
  // es weder Abzug noch eine wirksame Fesselung (Abb. 4.2: Turm a1 – Bauer a7 – Turm a8).
  if (!verlaesstLinie(p.stellung.brett, vorn, strahl.richtung)) return null;
  const von = { feld: strahl.von, figur: strahl.figur };
  if (vorn.figur.color === strahl.figur.color) return { von, vorn, hinten, art: "abzug" };
  return { von, vorn, hinten, art: wertvoller ? "fesselung" : "spiess" };
}

/**
 * W2, wenn König oder Dame vorn stehen und dahinter eine ungedeckte eigene Figur, oder null.
 *
 * Regel: Kapitel 4, W2 („König oder Dame stehen mit einer eigenen Figur auf derselben Linie,
 * Reihe oder Diagonale wie eine gegnerische Langschrittfigur“), C1.8 (Entscheidung des Autors):
 * auch eine ungedeckte Figur hinten zählt, auch ein Bauer. Die vordere Figur zählt dabei nicht als
 * Verteidiger, denn sie muss weichen. Beispiel: Abb. 4.8, Läufer b2 – Dame e5 – Bauer g7: „Der
 * Läufer greift die Dame an; hinter ihr liegt g7.“
 */
function ungedecktHinten(
  strahl: Strahl,
  vorn: Figurenstand,
  hinten: Figurenstand,
  p: Stellungsprofil,
): GefaehrlicheLinie | null {
  if (vorn.figur.color !== hinten.figur.color || !WERTVOLLE_VORN.has(vorn.figur.role)) return null;
  const verteidiger = p.angriffskarte
    .angreiferVon(hinten.feld, hinten.figur.color)
    .filter((a) => a.feld !== vorn.feld);
  if (verteidiger.length > 0) return null;
  return { von: { feld: strahl.von, figur: strahl.figur }, vorn, hinten, art: "weicht" };
}

/**
 * Die gefährlichen Linien (W2) gegen eine Farbe.
 *
 * Warum eigenständig: Die Fehlerprofile der Engine (engine/fehlerart.ts, „Taktik übersehen“)
 * fragen nach einer neuen gefährlichen Linie nach einem Zug, ohne den ganzen Befund.
 * Beispiel: Abb. 4.8 für Schwarz: Läufer b2 – Dame e5 – Bauer g7 („weicht“).
 */
export function gefaehrlicheLinien(p: Stellungsprofil, farbe: Color): GefaehrlicheLinie[] {
  return p
    .strahlen()
    .map((strahl) => gefaehrlicheLinie(strahl, p))
    .filter((linie): linie is GefaehrlicheLinie => linie?.hinten.figur.color === farbe);
}

/** Alle Warnsignale W1 bis W4 einer Seite (der bedrohten). */
function signale(p: Stellungsprofil, farbe: Color): Signale {
  const w2 = gefaehrlicheLinien(p, farbe);
  const umgebung = p.koenigsumgebung(farbe);
  const ohneLuft = umgebung !== null && umgebung.fluchtfelder.length === 0;
  return {
    w1: p.angriffskarte.ungedeckte(farbe),
    w2,
    w3: ohneLuft ? { feld: umgebung.koenig, figur: { role: "king", color: farbe } } : null,
    w4: p.aufgaben(farbe)?.filter(istW4) ?? null,
  };
}

/** Zeilen eines Befundes: je Signal eine Zeile, oder „keine“. */
function zeilen(s: Signale): string[] {
  const liste: string[] = [];
  if (s.w1.length > 0)
    liste.push(t("warnsignale.w1", { figuren: s.w1.map(figurenname).join(", ") }));
  for (const linie of s.w2) {
    liste.push(
      t("warnsignale.w2", {
        von: figurenname(linie.von),
        vorn: figurenname(linie.vorn),
        hinten: figurenname(linie.hinten),
        art: artText(linie),
      }),
    );
  }
  if (s.w3) liste.push(t("warnsignale.w3", { koenig: figurenname(s.w3) }));
  for (const doppelt of s.w4 ?? []) liste.push(w4Zeile(doppelt));
  return liste.length > 0 ? liste : [t("warnsignale.keine")];
}

/** „Fesselung“, „Spieß“, „Abzug“ oder „weicht die Dame, fällt g7“ (C1.8). */
function artText(linie: GefaehrlicheLinie): string {
  if (linie.art !== "weicht") return t(`warnsignale.art.${linie.art}`);
  const schluessel =
    linie.vorn.figur.role === "king"
      ? "warnsignale.art.weichtKoenig"
      : "warnsignale.art.weichtDame";
  return t(schluessel, { feld: feldname(linie.hinten.feld) });
}

/**
 * Die Zeile zu W4: zwei Aufgaben, oder (C1.7) der einzige Verteidiger gegen ein Matt mit dem
 * Mattzug, etwa „Springer f3: einziger Verteidiger von h2 gegen Dxh2#“ (Abb. 4.29).
 */
function w4Zeile(doppelt: DoppelteAufgabe): string {
  const [einzige] = doppelt.aufgaben;
  if (doppelt.aufgaben.length === 1 && einzige?.art === "matt" && einzige.zug) {
    return t("warnsignale.w4Matt", {
      figur: figurenname(doppelt.verteidiger),
      feld: feldname(einzige.ziel),
      zug: sanInSprache(einzige.zug, sprache()),
    });
  }
  const ziele = doppelt.aufgaben
    .map((aufgabe) => feldname(aufgabe.ziel))
    .join(t("warnsignale.und"));
  return t("warnsignale.w4", { figur: figurenname(doppelt.verteidiger), ziele });
}

/** W5: Schläge mit Gewinn für die eigene Seite (Pflichtenheft 6.6, „laut Abtauschrechnung“). */
function geschenke(p: Stellungsprofil, eigen: Color): Schlagzug[] {
  return (p.schlaegeVon(eigen) ?? []).filter((schlag) => schlag.bilanz > 0);
}

/** Ein scheinbares Geschenk: gegnerisches Material, das nur gefesselte Figuren decken. */
interface ScheinbaresGeschenk {
  readonly ziel: Figurenstand;
  readonly gefesselte: readonly Square[];
}

/** W5 für die eigene Seite: echte Geschenke (Schlag mit Gewinn) und scheinbare (D.4). */
interface Geschenke {
  readonly echt: readonly Schlagzug[];
  readonly scheinbar: readonly ScheinbaresGeschenk[];
}

/**
 * W5 „scheinbar“: Figuren des Gegners, die nur von relativ gefesselten Figuren gedeckt sind.
 *
 * Regel: Kapitel 4, W5 („Der Gegner lässt Material scheinbar kostenlos stehen“), D.4
 * (Entscheidung des Autors). Die Abtauschrechnung übersieht Fesselungen absichtlich (Kapitel 7:
 * „Eine gefesselte Figur wirkt weiter“) und meldet deshalb keinen Gewinn; der Anfänger sieht aber
 * nur die Fesselung und hält das Material für frei. Nur relative Fesselungen: Eine absolut
 * gefesselte Figur kann wirklich nicht zurückschlagen.
 * Beispiel: Abb. 4.13 (Elefantenfalle): Bauer d5, nur vom gefesselten Springer f6 gedeckt.
 */
function scheinbareGeschenke(p: Stellungsprofil, eigen: Color): ScheinbaresGeschenk[] {
  const feind = gegner(eigen);
  const gefesselt = new Set(
    fesselungslinien(p.stellung.brett, p.angriffskarte, feind)
      .filter((linie) => linie.art === "direkt" && !linie.absolut)
      .map((linie) => linie.gefesselt.feld),
  );
  const ziele = new Set(
    (p.schlaegeVon(eigen) ?? []).filter((s) => s.bilanz <= 0).map((s) => s.nach),
  );
  return p.angriffskarte.figuren(feind).flatMap((ziel) => {
    if (!ziele.has(ziel.feld)) return [];
    const decker = p.angriffskarte.angreiferVon(ziel.feld, feind, false).map((a) => a.feld);
    const nurGefesselte = decker.length > 0 && decker.every((feld) => gefesselt.has(feld));
    return nurGefesselte ? [{ ziel, gefesselte: decker }] : [];
  });
}

/** „scheinbar: Bauer d5, nur von der gefesselten Figur f6 gedeckt …“ (D.4). */
function scheinbarZeile(g: ScheinbaresGeschenk): string {
  const schluessel =
    g.gefesselte.length === 1 ? "warnsignale.w5Scheinbar" : "warnsignale.w5ScheinbarMehrere";
  return t(schluessel, {
    ziel: figurenname(g.ziel),
    felder: aufzaehlung(g.gefesselte.map(feldname)),
  });
}

/** Sammelt die Kennungen je Feld, damit eine Figur „W1·W4“ trägt statt zweier Beschriftungen. */
class Beschriftung {
  private readonly jeFeld = new Map<string, { farbe: Markierungsfarbe; kennungen: string[] }>();
  merke(feld: string, farbe: Markierungsfarbe, kennung: string): void {
    const eintrag = this.jeFeld.get(feld) ?? { farbe, kennungen: [] };
    if (!eintrag.kennungen.includes(kennung)) eintrag.kennungen.push(kennung);
    this.jeFeld.set(feld, eintrag);
  }
  markierungen(): Markierung[] {
    return [...this.jeFeld].map(([feld, { farbe, kennungen }]) => ({
      typ: "feld",
      farbe,
      feld,
      text: kennungen.join("·"),
    }));
  }
}

/** Markierungen einer Seite: Rahmen mit Kennung, bei W2 ein Pfeil von der Langschrittfigur. */
function markiere(s: Signale, farbe: Markierungsfarbe, beschriftung: Beschriftung): Markierung[] {
  s.w1.forEach((stand) => beschriftung.merke(feldname(stand.feld), farbe, "W1"));
  s.w2.forEach((linie) => beschriftung.merke(feldname(linie.hinten.feld), farbe, "W2"));
  if (s.w3) beschriftung.merke(feldname(s.w3.feld), farbe, "W3");
  (s.w4 ?? []).forEach((d) => beschriftung.merke(feldname(d.verteidiger.feld), farbe, "W4"));
  return s.w2.map((linie) => ({
    typ: "pfeil",
    farbe,
    von: feldname(linie.von.feld),
    nach: feldname(linie.hinten.feld),
  }));
}

/** Kurzfassung wie „W1, W3“ für das Fazit. */
function kennungen(s: Signale): string[] {
  const liste: string[] = [];
  if (s.w1.length > 0) liste.push("W1");
  if (s.w2.length > 0) liste.push("W2");
  if (s.w3) liste.push("W3");
  if ((s.w4 ?? []).length > 0) liste.push("W4");
  return liste;
}

function fazit(eigen: Color, mein: Signale, sein: Signale, w5: Geschenke): string {
  const meine = kennungen(mein);
  const mitW5 = w5.echt.length > 0 || w5.scheinbar.length > 0;
  const seine = [...kennungen(sein), ...(mitW5 ? ["W5"] : [])];
  const farbe = t(`farbe.${farbkuerzel(eigen)}`);
  if (meine.length === 0 && seine.length === 0) return t("warnsignale.fazit.keine");
  const teile: string[] = [];
  if (meine.length > 0)
    teile.push(t("warnsignale.fazit.eigen", { farbe, kennungen: meine.join(", ") }));
  if (seine.length > 0) teile.push(t("warnsignale.fazit.gegner", { kennungen: seine.join(", ") }));
  return `${teile.join(" ")} ${t("warnsignale.fazit.rechnen")}`;
}

/** Drei Befunde: Gefahren der eigenen Seite (rot), Ziele beim Gegner (gold), W5 (gold). */
function alleBefunde(eigen: Color, mein: Signale, sein: Signale, w5: Geschenke) {
  const w5Zeilen = [
    ...w5.echt.map((schlag) => `${sanInSprache(schlag.san, sprache())} (${schlagtext(schlag)})`),
    ...w5.scheinbar.map(scheinbarZeile),
  ];
  const befunde: Befund[] = [
    {
      kennung: "eigen",
      art: "E",
      titel: t("warnsignale.eigen", { farbe: farbname(eigen) }),
      zeilen: zeilen(mein),
      farbe: "rot",
    },
    {
      kennung: "gegner",
      art: "E",
      titel: t("warnsignale.gegner", { farbe: farbname(gegner(eigen)) }),
      zeilen: zeilen(sein),
      farbe: "gold",
    },
    {
      kennung: "w5",
      art: "E",
      titel: t("warnsignale.w5", { farbe: farbname(eigen) }),
      zeilen: w5Zeilen.length > 0 ? w5Zeilen : [t("warnsignale.keine")],
      farbe: "gold",
    },
  ];
  return befunde;
}

/**
 * Sucht die Warnsignale W1 bis W5 in einer Stellung.
 *
 * Warum: „Fallen kündigen sich auf dem Brett an, bevor du überhaupt rechnest. Siehst du eines
 * dieser Warnsignale, rechne besonders genau“ (Kapitel 4).
 * Eingaben: Stellung und eigene Seite. Ausgabe: Befunde für die eigene Seite (Gefahren), für den
 * Gegner (Ziele) und W5 (Geschenke an die eigene Seite).
 * Beispiel: Abb. 4.2 (Schwarz am Zug): W1 Turm a8. Abb. 4.21 (Weiß am Zug): W3 König e1.
 * Abb. 4.38 (Weiß am Zug): W5 fxe5 (+1). Abb. 4.13: W5 scheinbar, Bauer d5 nur vom gefesselten
 * Springer f6 gedeckt. Abb. 4.29: W4 Springer f3, einziger Verteidiger von h2 gegen Dxh2#.
 * Abb. 4.8: W2 Läufer b2 – Dame e5 – Bauer g7, „weicht die Dame, fällt g7“.
 * Sonderfälle: Ohne Regeln (Lehrbild) gibt es nur W1 und W2; W3 braucht einen König, W4 und W5
 * brauchen legale Züge. W4 ist eine Näherung (Pflichtenheft 6.2: „W4 N“).
 */
export function warnsignale(stellung: Stellung, eigen: Color): Werkzeugergebnis {
  const p = profil(stellung);
  const mein = signale(p, eigen);
  const sein = signale(p, gegner(eigen));
  const w5: Geschenke = { echt: geschenke(p, eigen), scheinbar: scheinbareGeschenke(p, eigen) };
  const beschriftung = new Beschriftung();
  const pfeile = [...markiere(mein, "rot", beschriftung), ...markiere(sein, "gold", beschriftung)];
  w5.echt.forEach((schlag) => beschriftung.merke(feldname(schlag.nach), "gold", "W5"));
  w5.scheinbar.forEach((g) => beschriftung.merke(feldname(g.ziel.feld), "gold", "W5"));
  const w5Pfeile: Markierung[] = w5.echt.map((schlag) => ({
    typ: "pfeil",
    farbe: "gold",
    von: feldname(schlag.von),
    nach: feldname(schlag.nach),
  }));
  const befunde = alleBefunde(eigen, mein, sein, w5);
  return {
    werkzeug: "k4-warnsignale",
    art: "E",
    ueberschrift: t("warnsignale.titel"),
    befunde,
    fazit: fazit(eigen, mein, sein, w5),
    markierungen: [...pfeile, ...w5Pfeile, ...beschriftung.markierungen()],
    stufen: [
      ["eigen", "gegner", "w5"],
      ["eigen", "gegner", "w5"],
      ["eigen", "gegner", "w5"],
    ],
    regel: t("werkzeug.k4-warnsignale.regel"),
  };
}

/** Das Werkzeug k4-warnsignale in der gemeinsamen Form aller Werkzeuge (Konzept 7.1). */
export const k4Warnsignale: Werkzeug = {
  id: "k4-warnsignale",
  kapitel: 4,
  name: "werkzeug.k4-warnsignale.name",
  regel: "werkzeug.k4-warnsignale.regel",
  erklaerung: "werkzeug.k4-warnsignale.erklaerung",
  art: "E",
  braucht: ["stellung"],
  berechne: ({ stellung, perspektive }) => warnsignale(stellung, perspektive),
};

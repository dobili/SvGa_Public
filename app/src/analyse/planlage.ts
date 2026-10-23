/**
 * Planfrage 1 als Lage: Zentrum, Könige, Sturm, Bedingungen für den Königsangriff, fixierte
 * Schwächen. Aus dem Profil berechnet, Texte machen k6-wo und k6-planbilanz daraus.
 *
 * Rolle im Gesamtbild: Baustein für k6-wo, k6-gegner (Plan des Gegners) und k6-planbilanz.
 * Pflichtenheft 6.3 (Planfrage 1): „Zentrum offen oder geschlossen, Könige auf demselben oder auf
 * verschiedenen Flügeln. Bei entgegengesetzten Rochaden: Bauernzüge bis zum ersten Hebel für
 * beide Seiten zählen. Bei gleichseitiger Rochade: die drei Bedingungen für einen Königsangriff.“
 * Abhängigkeiten: stellungsprofil.ts, skelett.ts, schach/sturm.ts, schach/skelettfiguren.ts,
 * k1-angriffsregel.ts (Angriffssektor).
 * Buchbezug: Kapitel 6, „Frage 1: Wo spiele ich?“, Tabelle der fünf Lagen (Abb. 6.2 bis 6.11).
 */
import type { Color, Square } from "chessops/types";
import { squareFile } from "chessops/util";
import { Angriffskarte } from "../schach/angriffskarte";
import type { Angriffssektor } from "../schach/angriffssektor";
import { sektorlinien } from "../schach/angriffssektor";
import type { Koenigsumgebung } from "../schach/koenigsumgebung";
import { stellungstyp, type Stellungstypbefund } from "../schach/skelettfiguren";
import {
  fluegelVon,
  type Fluegel,
  type Hebel,
  type Kettenrichtung,
  type Richtungsbefund,
} from "../schach/skelettrichtung";
import { gegner } from "../schach/stellung";
import { schildziele, schnellsterSturm, type Schildziel, type Sturm } from "../schach/sturm";
import { sektorGegen } from "./k1-angriffsregel";
import {
  felderFuer,
  minderheitsplan,
  richtungFuer,
  zielschwaechen,
  type Minderheitsplan,
  type Zielschwaeche,
} from "./skelett";
import type { Stellungsprofil } from "./stellungsprofil";

/** Die Zentrumslinien d und e. */
const ZENTRUMSLINIEN: readonly number[] = [3, 4];

/** Die fünf Lagen der Tabelle in Kapitel 6, in Prüfreihenfolge. */
export type Lage =
  "geschlossen" | "offen" | "verschiedeneFluegel" | "gleicherFluegel" | "schwaeche";

/**
 * Ein Gegenschlag im Zentrum: ein Hebel um ein Feld (oder der Doppelschritt aus der
 * Grundstellung) mit der Zählung auf dem Zielfeld (Abb. 6.3: d5, drei gegen drei), oder eine
 * schon bestehende Spannung mit der Zählung auf dem Feld des angegriffenen Bauern (Abb. 6.4:
 * „Der Gegenschlag im Zentrum greift den Bauern e4 an“).
 */
export interface Zentrumshebel {
  /** Bei schon bestehender Spannung: von = eigener Bauer, nach = angegriffener Bauer. */
  readonly hebel: Hebel;
  /** Die Spannung besteht schon: Der eigene Bauer greift den gegnerischen jetzt an. */
  readonly schonDa: boolean;
  /** Das Feld, auf dem gezählt wird. */
  readonly feld: Square;
  readonly angreifer: number;
  readonly verteidiger: number;
}

/** Die drei Bedingungen für den Figurenangriff bei gleichseitiger Rochade. */
export interface Angriffsbedingungen {
  readonly zentrumFest: boolean;
  readonly sektor: Angriffssektor | null;
  readonly uebermacht: boolean;
  readonly ziele: readonly Schildziel[];
  readonly haken: readonly Square[];
}

export type Antwort =
  | { readonly art: "fluegel"; readonly fluegel: Fluegel; readonly grund: Lage }
  | { readonly art: "zentrum" }
  | { readonly art: "offen" };

export interface Planlage {
  readonly farbe: Color;
  readonly typ: Stellungstypbefund;
  readonly kette: Kettenrichtung | null;
  readonly hebelBasis: readonly Hebel[];
  readonly zentrumshebel: readonly Zentrumshebel[];
  readonly koenige: {
    readonly eigen: Koenigsumgebung | null;
    readonly gegner: Koenigsumgebung | null;
    readonly art: "verschieden" | "gleich" | "offen";
  };
  readonly sturm: { readonly eigen: Sturm | null; readonly gegner: Sturm | null };
  /** Eigene offene und halboffene Linien im Sektor des gegnerischen Königs (Abb. 11.34: c). */
  readonly linienZumKoenig: readonly number[];
  readonly bedingungen: Angriffsbedingungen | null;
  readonly schwaechen: readonly Zielschwaeche[];
  /**
   * Plan einer eigenen Minderheit: Minderheitsangriff (Abb. 6.8, Weiß) oder, vor dem eigenen
   * König, Gegenspiel mit Figuren (Abb. 6.8, Schwarz); sonst null.
   */
  readonly minderheit: Minderheitsplan | null;
  readonly lagen: readonly Lage[];
  readonly antwort: Antwort;
}

/** Liegt das Feld auf der d- oder e-Linie? */
function imZentrum(feld: Square): boolean {
  return ZENTRUMSLINIEN.includes(squareFile(feld));
}

/**
 * Die Gegenschläge im Zentrum (Entscheidung des Autors zu C1.13): zuerst eine schon bestehende
 * Spannung, gezählt auf dem Feld des angegriffenen Bauern (Abb. 6.4: d5 greift e4 an); dann
 * Hebel um ein Feld oder mit dem Doppelschritt aus der Grundstellung, gezählt auf dem Zielfeld,
 * als stünde der Bauer schon dort (Abb. 6.3: Sc3, Lc4 und der Turm d1 hinter dem Bauern gegen
 * e6, Sf6, Lb7, „drei gegen drei“ auf d5; Abb. 6.5: „...d5“ zwei gegen zwei). Märsche über zwei
 * Züge (e4–e5–e6) sind kein Gegenschlag. Im Zentrum heißt: der eigene Bauer (nach dem Zug) oder
 * der angegriffene steht auf der d- oder e-Linie.
 */
function zentrumshebelVon(p: Stellungsprofil, farbe: Color, r: Richtungsbefund): Zentrumshebel[] {
  const feind = gegner(farbe);
  const spannung = r.spannung
    .filter((s) => imZentrum(s.eigen) || imZentrum(s.gegnerisch))
    .map((s): Zentrumshebel => {
      const hebel: Hebel = {
        von: s.eigen,
        nach: s.gegnerisch,
        zuege: 1,
        trifft: [s.gegnerisch],
        gegenBasis: false,
        frei: true,
        imWeg: null,
      };
      const karte = p.angriffskarte;
      return {
        hebel,
        schonDa: true,
        feld: s.gegnerisch,
        angreifer: karte.angreiferVon(s.gegnerisch, farbe).length,
        verteidiger: karte.angreiferVon(s.gegnerisch, feind).length,
      };
    });
  const hebel = r.hebel
    .filter((h) => h.zuege === 1 && imZentrum(h.nach))
    .map((h): Zentrumshebel => {
      const danach = p.stellung.brett.clone();
      danach.take(h.von);
      const karte = new Angriffskarte(danach);
      return {
        hebel: h,
        schonDa: false,
        feld: h.nach,
        angreifer: karte.angreiferVon(h.nach, farbe).length,
        verteidiger: karte.angreiferVon(h.nach, feind).length,
      };
    });
  return [...spannung, ...hebel];
}

/** Greift ein gegnerischer Hebel einen eigenen Zentrumsbauern an? */
function zentrumUnterHebel(p: Stellungsprofil, farbe: Color): boolean {
  return richtungFuer(p, gegner(farbe)).hebel.some((h) =>
    h.trifft.some((f) => ZENTRUMSLINIEN.includes(squareFile(f))),
  );
}

function bedingungenVon(
  p: Stellungsprofil,
  farbe: Color,
  typ: Stellungstypbefund,
  koenigGegner: Koenigsumgebung,
): Angriffsbedingungen {
  const sektor = sektorGegen(p, farbe);
  return {
    zentrumFest: typ.typ === "geschlossen" || !zentrumUnterHebel(p, farbe),
    sektor,
    uebermacht: sektor !== null && sektor.angreiferListe.length > sektor.verteidiger.length,
    ziele: schildziele(p.angriffskarte, farbe, koenigGegner),
    haken: felderFuer(p, gegner(farbe)).koenigsfluegel?.haken ?? [],
  };
}

function koenigslage(
  eigen: Koenigsumgebung | null,
  seiner: Koenigsumgebung | null,
): "verschieden" | "gleich" | "offen" {
  if (!eigen || !seiner || !eigen.rochiert || !seiner.rochiert) return "offen";
  return fluegelVon(eigen.koenig) === fluegelVon(seiner.koenig) ? "gleich" : "verschieden";
}

/** Welche Lagen zutreffen, in der Reihenfolge der Tabelle (Kapitel 6). */
function lagenVon(l: Omit<Planlage, "lagen" | "antwort">): Lage[] {
  const lagen: Lage[] = [];
  if (l.typ.typ === "geschlossen") lagen.push("geschlossen");
  if (l.typ.verkeilt.length === 0) lagen.push("offen");
  if (l.koenige.art === "verschieden") lagen.push("verschiedeneFluegel");
  if (l.koenige.art === "gleich") lagen.push("gleicherFluegel");
  // Lage 5 steht immer in der Liste: Sie ist der Rückfall, wenn kein Angriff in Sicht ist.
  lagen.push("schwaeche");
  return lagen;
}

/** Die Antwort auf „Wo spiele ich?“: die erste Lage von oben, die einen Ort nennt. */
function antwortVon(l: Omit<Planlage, "antwort">): Antwort {
  const koenigGegner = l.koenige.gegner;
  if (l.lagen.includes("geschlossen") && l.kette?.zeigtNach)
    return { art: "fluegel", fluegel: l.kette.zeigtNach, grund: "geschlossen" };
  if (l.lagen.includes("verschiedeneFluegel") && koenigGegner)
    return {
      art: "fluegel",
      fluegel: fluegelVon(koenigGegner.koenig),
      grund: "verschiedeneFluegel",
    };
  const b = l.bedingungen;
  const alleDrei =
    b !== null && b.zentrumFest && b.uebermacht && (b.ziele.length > 0 || b.haken.length > 0);
  if (l.lagen.includes("gleicherFluegel") && alleDrei && koenigGegner)
    return { art: "fluegel", fluegel: fluegelVon(koenigGegner.koenig), grund: "gleicherFluegel" };
  if (l.lagen.includes("offen")) return { art: "zentrum" };
  const schwaeche = l.schwaechen.find((s) => s.fixiert);
  if (schwaeche) return { art: "fluegel", fluegel: fluegelVon(schwaeche.feld), grund: "schwaeche" };
  // „oder wo du einen solchen Bauern erzeugen kannst“: der Minderheitsangriff (Abb. 6.8); vor
  // dem eigenen König stattdessen Gegenspiel mit Figuren (Entscheidung des Autors zu C1.14).
  if (l.minderheit) return { art: "fluegel", fluegel: l.minderheit.fluegel, grund: "schwaeche" };
  if (l.kette?.zeigtNach)
    return { art: "fluegel", fluegel: l.kette.zeigtNach, grund: "geschlossen" };
  return { art: "offen" };
}

/** Mitte des Brettes zwischen d- und e-Linie (Linien 0 bis 7). */
const BRETTMITTE = 3.5;

/**
 * Die Kette, die den Plan bestimmt: die längste mit Richtung, bei Gleichstand die zentralste.
 * Beispiel: Abb. 11.78, Weiß mit e4–d5 und c3–b4 → e4–d5 (Befund aus P4: vorher die erste
 * gefundene, c3–b4).
 * Sonderfall: keine Kette mit Richtung → null.
 */
function hauptkette(ketten: readonly Kettenrichtung[]): Kettenrichtung | null {
  const abstand = (k: Kettenrichtung) =>
    Math.abs(
      k.kette.glieder.reduce((summe, feld) => summe + squareFile(feld), 0) /
        k.kette.glieder.length -
        BRETTMITTE,
    );
  const mitRichtung = ketten.filter((k) => k.zeigtNach !== null);
  return (
    [...mitRichtung].sort(
      (a, b) => b.kette.glieder.length - a.kette.glieder.length || abstand(a) - abstand(b),
    )[0] ?? null
  );
}

/**
 * Die Lage einer Seite für Planfrage 1.
 *
 * Eingaben: Profil, Farbe. Ausgabe: Planlage mit den zutreffenden Lagen und der Antwort.
 * Beispiele: Abb. 6.2 (geschlossen): Weiß Damenflügel, Schwarz Königsflügel. Abb. 6.6
 * (verschiedene Flügel): Weiß stürmt in 2 Zügen, Schwarz in 3. Abb. 6.7 (gleicher Flügel): alle
 * drei Bedingungen erfüllt, Ziel h7. Abb. 6.10: Schwäche c6, fixiert durch d4.
 * Sonderfälle: Lehrbilder ohne Könige haben die Königslage „offen“ und keine Bedingungen.
 */
export function planlage(p: Stellungsprofil, farbe: Color): Planlage {
  const feind = gegner(farbe);
  const typ = stellungstyp(p.stellung.brett);
  const richtung = richtungFuer(p, farbe);
  const eigen = p.koenigsumgebung(farbe);
  const seiner = p.koenigsumgebung(feind);
  const art = koenigslage(eigen, seiner);
  const ohneAntwort = {
    farbe,
    typ,
    kette: hauptkette(richtung.ketten),
    hebelBasis: richtung.hebel.filter((h) => h.gegenBasis),
    zentrumshebel: zentrumshebelVon(p, farbe, richtung),
    koenige: { eigen, gegner: seiner, art },
    sturm: {
      eigen: seiner ? schnellsterSturm(p.stellung.brett, farbe, seiner) : null,
      gegner: eigen ? schnellsterSturm(p.stellung.brett, feind, eigen) : null,
    },
    linienZumKoenig: seiner
      ? [...p.bauernprofil(farbe).offeneLinien, ...p.bauernprofil(farbe).halboffeneLinien].filter(
          (l) => sektorlinien(seiner.koenig).includes(l),
        )
      : [],
    bedingungen: art === "gleich" && seiner ? bedingungenVon(p, farbe, typ, seiner) : null,
    schwaechen: zielschwaechen(p, farbe),
    minderheit: minderheitsplan(p, farbe, richtung),
  };
  const lagen = lagenVon(ohneAntwort);
  return { ...ohneAntwort, lagen, antwort: antwortVon({ ...ohneAntwort, lagen }) };
}

/**
 * Antwortsätze und Ablenker der Planbilanz-Übung, durchgehend aus Sicht der Seite am Zug
 * (P4, R48: Befund des Autors vom 23.10.2026).
 *
 * Rolle im Gesamtbild: Baustein für training/planbilanztrainer.ts. Falsche Antworten dürfen weder
 * wahre Aussagen über den Plan des Gegners sein noch dem richtigen Satz bis auf ein Feld gleichen.
 * Deshalb gilt: Ein Ablenker zu „Wo spiele ich?“ gehört zu einer anderen Lage (anderer Ort oder
 * Grund), zu „Was will mein Gegner?“ ist er eine andere Aussage über den Gegner (gleiche Farbe im
 * Satz), zu „Welche Figur?“ eine andere eigene Figur; eigene Figuren heißen „dein Läufer c1“.
 * Dazu die Hauptkette: Bei mehreren Ketten zum selben Flügel nennt der Satz die längste, dann die
 * zentralste (Abb. 11.78: e4–d5 statt c3–b4).
 * Abhängigkeiten: analyse/planfragen.ts, analyse/planlage.ts, analyse/skelett.ts (nur
 * aufgerufen), schach/aktivitaet.ts, schach/figurenziel.ts, i18n.
 * Buchbezug: Kapitel 6, die drei Planfragen; Kapitel 5, Richtung der Kette (Basis → Spitze).
 */
import type { Color } from "chessops/types";
import { squareFile } from "chessops/util";
import { figurText, gegnerText, woText } from "../analyse/planfragen";
import { planlage, type Planlage } from "../analyse/planlage";
import { felderFuer, felderText, figurenFuer, fluegelname, richtungFuer } from "../analyse/skelett";
import type { Stellungsprofil } from "../analyse/stellungsprofil";
import { aufzaehlung, farbname, figurenname } from "../analyse/texte";
import { t, tZahl } from "../i18n/sprache";
import { aktivitaeten, type Aktivitaet } from "../schach/aktivitaet";
import { figurenziel } from "../schach/figurenziel";
import type { Kettenrichtung } from "../schach/skelettrichtung";
import { feldname, gegner } from "../schach/stellung";

/** Die drei Antwortsätze einer Seite mit den Schlüsseln ihrer Lage (für Ablenker anderer Art). */
export interface Plansaetze {
  readonly wo: string;
  /** Art der Antwort auf „Wo?“: Ort und Grund, damit Ablenker eine andere Lage zeigen. */
  readonly woArt: string;
  readonly gegner: string;
  readonly gegnerArt: string;
  readonly figur: string;
  /** Sätze zu anderen eigenen Figuren, aktivere zuerst (Ablenker für „Welche Figur?“). */
  readonly andereFiguren: readonly string[];
}

/** Der Rest ohne „(Ziel )“: Leere Ziele lässt das Werkzeug noch stehen (Befund für P3). */
const LEERES_ZIEL = " (Ziel )";
const MITTE = 3.5;

/** Abstand einer Kette zur Brettmitte: das Glied, das den Zentrumslinien am nächsten liegt. */
function zentrumsabstand(k: Kettenrichtung): number {
  return Math.min(...k.kette.glieder.map((g) => Math.abs(squareFile(g) - MITTE)));
}

/**
 * Die Lage mit der Hauptkette: Zeigen mehrere Ketten zum Flügel der Antwort, nennt der Satz die
 * längste, bei gleicher Länge die zentralste. Beispiel: Abb. 11.78 (Weiß): c3–b4 und e4–d5
 * zeigen beide zum Damenflügel; die Kette e4–d5 ist die Hauptkette des Buches.
 */
export function mitHauptkette(l: Planlage, ketten: readonly Kettenrichtung[]): Planlage {
  if (l.antwort.art !== "fluegel" || l.kette === null) return l;
  const fluegel = l.antwort.fluegel;
  const beste = ketten
    .filter((k) => k.zeigtNach === fluegel)
    .sort(
      (a, b) =>
        b.kette.glieder.length - a.kette.glieder.length ||
        zentrumsabstand(a) - zentrumsabstand(b),
    )[0];
  return beste ? { ...l, kette: beste } : l;
}

/** Schlüssel der Lage: Ort, Grund und Flügel; Ablenker müssen sich darin unterscheiden. */
function woArt(l: Planlage): string {
  const a = l.antwort;
  if (a.art !== "fluegel") return a.art;
  if (a.grund === "schwaeche" && !l.schwaechen.some((s) => s.fixiert))
    return `${a.fluegel}-${l.minderheit?.art ?? "minderheit"}`;
  return `${a.fluegel}-${a.grund}`;
}

/** Schlüssel des gegnerischen Plans: Hebel gegen die Basis, Sturm, Zentrum, Flügel, unklar. */
function gegnerArt(seine: Planlage): string {
  const a = seine.antwort;
  if (seine.hebelBasis.length > 0) return "hebel";
  if (a.art === "fluegel" && a.grund === "verschiedeneFluegel" && seine.sturm.eigen) return "sturm";
  if (a.art === "zentrum" && seine.zentrumshebel.length > 0) return "zentrum";
  if (a.art === "fluegel") return `fluegel-${a.fluegel}`;
  return "unklar";
}

/** „dein Läufer c1“, „deine Dame d1“ (Wunsch des Autors: Figuren immer mit Farbe). */
export function mitBesitz(stand: Aktivitaet["stand"]): string {
  const name = figurenname(stand);
  return t(stand.figur.role === "queen" ? "planuebung.deine" : "planuebung.dein", { figur: name });
}

/** Großer Anfangsbuchstabe für den Satzanfang. */
function satzanfang(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * Eigene Figuren im Satz mit „dein“: Jede Nennung einer eigenen Figur außer König und Bauern
 * bekommt das Besitzwort davor, am Satzanfang groß. Beispiel: „Läufer c1 steht noch zu Hause“ →
 * „Dein Läufer c1 steht noch zu Hause“.
 */
export function mitEigenenFiguren(text: string, p: Stellungsprofil, farbe: Color): string {
  let ergebnis = text;
  for (const a of aktivitaeten(p.sichereFelder(farbe))) {
    ergebnis = ergebnis.split(figurenname(a.stand)).join(mitBesitz(a.stand));
  }
  return satzanfang(ergebnis);
}

/** Der Satz zu einer anderen eigenen Figur, in der Form von „Welche Figur?“. */
function figurensatz(p: Stellungsprofil, farbe: Color, a: Aktivitaet): string {
  const name = mitBesitz(a.stand);
  const ziel = figurenziel(p.stellung.brett, a.stand, a.sichere, {
    felder: felderFuer(p, farbe),
    profil: p.bauernprofil(farbe),
    laeufer: figurenFuer(p, farbe).laeufer.find((l) => l.laeufer.feld === a.stand.feld),
  });
  if (ziel.ziel === null) {
    if (a.zuHause) return satzanfang(t("plan.figur.zuHause", { figur: name }));
    if (ziel.grund === "tausch") return satzanfang(t("plan.figur.tausch", { figur: name }));
    return satzanfang(
      tZahl("plan.figur.gut", a.freie.length, { figur: name, anzahl: a.freie.length }),
    );
  }
  const platz =
    ziel.platzmacher.length > 0
      ? tZahl("plan.figur.platz", ziel.platzmacher.length, {
          figuren: aufzaehlung(
            ziel.platzmacher.map((f) => {
              const figur = p.stellung.brett.get(f);
              return figur ? mitBesitz({ feld: f, figur }) : feldname(f);
            }),
          ),
        })
      : "";
  const weg =
    ziel.weg.length > 1 ? t("plan.figur.ueber", { felder: felderText(ziel.weg.slice(0, -1)) }) : "";
  return satzanfang(t("plan.figur.ziel", { figur: name, ziel: feldname(ziel.ziel), weg, platz }));
}

/**
 * Die Sätze einer Seite: „Wo?“ mit Hauptkette, „Gegner?“, „Welche Figur?“ mit „dein“, dazu die
 * Sätze zu den nächsten eigenen Figuren (aktiver als die LAP, als Ablenker).
 */
export function plansaetze(p: Stellungsprofil, farbe: Color): Plansaetze {
  const eigene = mitHauptkette(planlage(p, farbe), richtungFuer(p, farbe).ketten);
  const seine = planlage(p, gegner(farbe));
  const figuren = aktivitaeten(p.sichereFelder(farbe));
  const lap = figuren[0];
  const andere = figuren
    .slice(1)
    .filter((a) => lap !== undefined && a.freie.length > lap.freie.length)
    .map((a) => figurensatz(p, farbe, a));
  return {
    wo: woText(eigene).split(LEERES_ZIEL).join(""),
    woArt: woArt(eigene),
    gegner: gegnerText(seine),
    gegnerArt: gegnerArt(seine),
    figur: mitEigenenFiguren(figurText(p, farbe), p, farbe),
    andereFiguren: andere,
  };
}

/**
 * Ersatz-Ablenker zu „Was will mein Gegner?“, wenn andere Stellungen nicht genug hergeben:
 * ein anderer Flügel als sein Plan und „noch kein erkennbarer Plan“, beide falsch, sobald der
 * richtige Satz einen Plan nennt.
 */
export function gegnerErsatz(p: Stellungsprofil, farbe: Color): string[] {
  const seine = planlage(p, gegner(farbe));
  const name = farbname(gegner(farbe));
  const fluegel = (["damen", "koenigs"] as const).filter(
    (f) => !(seine.antwort.art === "fluegel" && seine.antwort.fluegel === f),
  );
  return [
    ...fluegel.map((f) => t("plan.gegner.fluegel", { farbe: name, fluegel: fluegelname(f) })),
    t("plan.gegner.unklar", { farbe: name }),
  ];
}

/** Felder der Lage, falls ein Test sie braucht: die Glieder der Hauptkette als Text. */
export function hauptketteText(p: Stellungsprofil, farbe: Color): string | null {
  const l = mitHauptkette(planlage(p, farbe), richtungFuer(p, farbe).ketten);
  return l.kette ? l.kette.kette.glieder.map(feldname).join("–") : null;
}

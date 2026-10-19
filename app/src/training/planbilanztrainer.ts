/**
 * Planbilanz-Übung (Kapitel 6): die drei Planfragen mit Antwortauswahl, die LAP-Übung und das
 * Wettrennen bei entgegengesetzten Rochaden.
 *
 * Rolle im Gesamtbild: Trainer „planbilanz“ (Pflichtenheft 5.3, AP 13 Stufe 3). Drei
 * Übungsarten an Stellungen des Buches (Kapitel 6 und 11):
 * - Planfragen: je Frage drei Antworten. Richtig ist der Satz, den die Werkzeuge zur Frage
 *   rechnen (analyse/planfragen.ts); falsch sind derselbe Satz für die andere Seite und der einer
 *   anderen Stellung. Die Buchtexte der Planbilanzen zeigt die App nicht (Entscheidung des Autors
 *   vom 15.10.2026), bei Abb. 6.20 und 11.34 steht ein Verweis aufs Buch. Dazu kommen die
 *   Warum-Fragen der vorbereiteten Texte zu Kapitel 6.
 * - LAP: die am wenigsten aktive Figur der Seite am Zug antippen, dann ihr Zielfeld.
 * - Wettrennen: Bauernzüge bis zum ersten Hebel für beide Seiten zählen.
 * Abhängigkeiten: analyse/stellungsprofil.ts, analyse/planlage.ts, analyse/planfragen.ts (nur
 * aufgerufen), training/zufall.ts.
 * Buchbezug: Kapitel 6, drei Planfragen, Planbilanz (Abb. 6.20), LAP-Prinzip, entgegengesetzte
 * Rochaden („Bauernzüge bis zum ersten Hebel zählen“).
 */
import type { Color } from "chessops/types";
import { figurText, gegnerText, lapVon, unruhe, woText } from "../analyse/planfragen";
import { planlage } from "../analyse/planlage";
import { profil } from "../analyse/stellungsprofil";
import type { Frage } from "../analyse/warumfragen";
import { t } from "../i18n/sprache";
import { farbname } from "../analyse/texte";
import { feldname, gegner } from "../schach/stellung";
import type { Buchstellung } from "./buchstellungen";
import { mische, type Zufall } from "./zufall";

/** Kapitel mit Planfragen-Stellungen. */
const KAPITEL = new Set([6, 11]);
/** Abbildungen mit Planbilanz im Buch (Verweis nach der Antwort). */
const MIT_BUCHBILANZ = new Set(["6.20", "11.34"]);
/** Höchstens so viele Bauernzüge fragt das Wettrennen ab (Knöpfe 1 bis 6). */
export const HOECHSTENS_ZUEGE = 6;

/** Eine Frage mit Antwortauswahl (wie die Warum-Fragen). */
export interface Wahlfrage {
  readonly frage: string;
  readonly antworten: readonly string[];
  readonly richtig: number;
  readonly erklaerung?: string;
}

export interface Planaufgabe {
  readonly nummer: string;
  readonly fen: string;
  readonly seite: Color;
  readonly fragen: readonly Wahlfrage[];
  /** Verweis aufs Buch, wenn die Abbildung eine Planbilanz hat. */
  readonly buchbilanz: boolean;
}

/** Die drei Sätze der Planfragen einer Seite. */
interface Plansaetze {
  readonly wo: string;
  readonly gegner: string;
  readonly figur: string;
}

/**
 * Sagt der Satz etwas über die Stellung? „Noch offen“, „noch kein erkennbarer Plan“ und „keine
 * Figur“ taugen weder als richtige Antwort noch als Ablenker.
 */
function aussagekraeftig(s: Plansaetze, farbe: Color): boolean {
  return (
    s.wo !== t("plan.wo.offen") &&
    s.gegner !== t("plan.gegner.unklar", { farbe: farbname(gegner(farbe)) }) &&
    s.figur !== t("plan.figur.keine")
  );
}

/** Die Sätze beider Seiten einer ruhigen Stellung, oder null (unruhig, ohne König). */
function saetze(buch: Buchstellung): Readonly<Record<Color, Plansaetze>> | null {
  if (!buch.stellung.regeln) return null;
  const p = profil(buch.stellung);
  if (unruhe(p) !== null) return null;
  const fuer = (farbe: Color): Plansaetze => ({
    wo: woText(planlage(p, farbe)),
    gegner: gegnerText(planlage(p, gegner(farbe))),
    figur: figurText(p, farbe),
  });
  return { white: fuer("white"), black: fuer("black") };
}

/** Eine Frage: der richtige Satz und bis zu zwei andere, gemischt, ohne Doppelte. */
function wahlfrage(frage: string, richtig: string, andere: readonly string[], zufall: Zufall) {
  const falsche = [...new Set(andere.filter((a) => a !== richtig))].slice(0, 2);
  const antworten = mische([richtig, ...falsche], zufall);
  return { frage, antworten, richtig: antworten.indexOf(richtig) };
}

/**
 * Die Planfragen-Aufgaben: je ruhige Stellung aus Kapitel 6 und 11 die drei Fragen für die Seite
 * am Zug, dazu die Warum-Fragen der vorbereiteten Texte zu Kapitel 6.
 * Beispiel: Abb. 6.20, Weiß am Zug → „Wo spiele ich?“ mit dem Satz von Weiß, dem von Schwarz und
 * dem einer anderen Stellung.
 */
export function planaufgaben(stellungen: readonly Buchstellung[], zufall: Zufall): Planaufgabe[] {
  const mitSaetzen = stellungen
    .filter((b) => KAPITEL.has(b.kapitel))
    .flatMap((b) => {
      const s = saetze(b);
      const seite = b.stellung.amZug;
      return s && aussagekraeftig(s[seite], seite) ? [{ buch: b, s }] : [];
    });
  // Der fremde Ablenker kommt aus einer weit entfernten Stellung, nicht aus der Nachbarstellung
  // derselben Partie mit fast gleichem Skelett.
  const versatz = Math.max(1, Math.floor(mitSaetzen.length / 2));
  const aufgaben = mitSaetzen.map(({ buch, s }, i) => {
    const seite = buch.stellung.amZug;
    const eigen = s[seite];
    const anders = s[gegner(seite)];
    const fremd = mitSaetzen[(i + versatz) % mitSaetzen.length]?.s[seite] ?? anders;
    const fragen: Wahlfrage[] = [
      wahlfrage(t("planbilanz.wo"), eigen.wo, [anders.wo, fremd.wo], zufall),
      wahlfrage(t("planbilanz.gegner"), eigen.gegner, [anders.gegner, fremd.gegner], zufall),
      wahlfrage(t("planbilanz.figur"), eigen.figur, [anders.figur, fremd.figur], zufall),
    ];
    return { buch, fragen };
  });
  const warum = stellungen
    .filter((b) => b.kapitel === 6 && b.vorbereitet && b.vorbereitet.fragen.length > 0)
    .map((buch) => ({ buch, fragen: (buch.vorbereitet?.fragen ?? []).map(alsWahlfrage) }));
  return [...aufgaben, ...warum].map(({ buch, fragen }) => ({
    nummer: buch.nummer,
    fen: buch.stellung.fen,
    seite: buch.stellung.amZug,
    fragen,
    buchbilanz: MIT_BUCHBILANZ.has(buch.nummer),
  }));
}

/** Eine Warum-Frage der vorbereiteten Texte als Wahlfrage. */
function alsWahlfrage(f: Frage): Wahlfrage {
  return { frage: f.frage, antworten: f.antworten, richtig: f.richtig, erklaerung: f.erklaerung };
}

export interface Lapaufgabe {
  readonly nummer: string;
  readonly fen: string;
  readonly seite: Color;
  /** Die am wenigsten aktive Figur (Feld, etwa „c1“). */
  readonly figur: string;
  /** Ihr Zielfeld laut LAP-Prinzip, oder null, wenn die App keines findet. */
  readonly ziel: string | null;
}

/**
 * Die LAP-Aufgabe zu einer ruhigen Stellung aus Kapitel 6 und 11 (Seite am Zug), oder null.
 * Regel: Kapitel 6, Frage 3 (LAP-Prinzip: die am wenigsten aktive Figur verbessern).
 * Beispiel: Abb. 6.20 → Läufer c1 (noch zu Hause), Ziel nach dem Werkzeug „Welche Figur?“.
 */
export function lapaufgabe(buch: Buchstellung): Lapaufgabe | null {
  if (!KAPITEL.has(buch.kapitel) || !buch.stellung.regeln) return null;
  const p = profil(buch.stellung);
  if (unruhe(p) !== null) return null;
  const seite = buch.stellung.amZug;
  const ergebnis = lapVon(p, seite);
  if (!ergebnis || ergebnis.ziel.ziel === null) return null;
  return {
    nummer: buch.nummer,
    fen: buch.stellung.fen,
    seite,
    figur: feldname(ergebnis.lap.stand.feld),
    ziel: feldname(ergebnis.ziel.ziel),
  };
}

export interface Rennaufgabe {
  readonly nummer: string;
  readonly fen: string;
  /** Bauernzüge bis zum ersten Hebel gegen den gegnerischen König, je Seite. */
  readonly zuege: Readonly<Record<Color, number>>;
}

/**
 * Das Wettrennen zu einer Stellung mit entgegengesetzten Rochaden, oder null.
 * Regel: Kapitel 6, „Bei entgegengesetzten Rochaden: Bauernzüge bis zum ersten Hebel für beide
 * Seiten zählen“. Beispiel: Abb. 6.6 → Weiß 2 (h2–h5 gegen g6), Schwarz 3 (a7–a3 gegen b2).
 */
export function rennaufgabe(buch: Buchstellung): Rennaufgabe | null {
  if (!buch.stellung.regeln) return null;
  const lage = planlage(profil(buch.stellung), "white");
  const weiss = lage.sturm.eigen?.zuege;
  const schwarz = lage.sturm.gegner?.zuege;
  if (lage.koenige.art !== "verschieden" || weiss === undefined || schwarz === undefined)
    return null;
  if (weiss > HOECHSTENS_ZUEGE || schwarz > HOECHSTENS_ZUEGE) return null;
  return { nummer: buch.nummer, fen: buch.stellung.fen, zuege: { white: weiss, black: schwarz } };
}

/** Eine Runde einer Übungsart: zufällig aus allen passenden Stellungen. */
export function auswahl<T>(liste: readonly T[], anzahl: number, zufall: Zufall): T[] {
  return mische(liste, zufall).slice(0, anzahl);
}

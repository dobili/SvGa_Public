/**
 * Planbilanz-Übung (Kapitel 6): die drei Planfragen mit Antwortauswahl, die LAP-Übung und das
 * Wettrennen bei entgegengesetzten Rochaden.
 *
 * Rolle im Gesamtbild: Trainer „planbilanz“ (Pflichtenheft 5.3, AP 13 Stufe 3). Drei
 * Übungsarten an Mittelspielstellungen des Buches (Kapitel 6 und 11, Phase nach
 * schach/phase.ts; Wunsch des Autors, P4 R48):
 * - Planfragen: je Frage drei Antworten, alle aus Sicht der Seite am Zug. Richtig ist der Satz,
 *   den die Werkzeuge zur Frage rechnen (analyse/planfragen.ts, Sätze und Ablenker in
 *   planablenker.ts); falsch sind Sätze anderer Art aus anderen Stellungen (Wo?), andere
 *   Aussagen über denselben Gegner (Gegner?) und andere eigene Figuren (Welche Figur?). Die
 *   Buchtexte der Planbilanzen zeigt die App nicht (Entscheidung des Autors vom 15.10.2026), bei
 *   Abb. 6.20 und 11.34 steht ein Verweis aufs Buch. Dazu kommen die Warum-Fragen der
 *   vorbereiteten Texte zu Kapitel 6.
 * - LAP: die am wenigsten aktive Figur der Seite am Zug antippen, dann ihr Zielfeld.
 * - Wettrennen: Bauernzüge bis zum ersten Hebel für beide Seiten zählen.
 * Abhängigkeiten: analyse/stellungsprofil.ts, analyse/planlage.ts, analyse/planfragen.ts (nur
 * aufgerufen), training/planablenker.ts, schach/phase.ts, training/zufall.ts.
 * Buchbezug: Kapitel 6, drei Planfragen, Planbilanz (Abb. 6.20), LAP-Prinzip, entgegengesetzte
 * Rochaden („Bauernzüge bis zum ersten Hebel zählen“).
 * LAP nur in ruhigen Stellungen ohne hängende und ohne gefesselte eigene Figuren, mit den freien
 * Feldern jeder Figur für die Begründung (Nebenchat, 30.10.2026).
 */
import type { Color, Role } from "chessops/types";
import { lapVon, unruhe } from "../analyse/planfragen";
import { planlage } from "../analyse/planlage";
import { profil, type Stellungsprofil } from "../analyse/stellungsprofil";
import type { Frage } from "../analyse/warumfragen";
import { t } from "../i18n/sprache";
import { farbname } from "../analyse/texte";
import { aktivitaeten } from "../schach/aktivitaet";
import { fesselungslinien } from "../schach/fesselungen";
import { phase } from "../schach/phase";
import { feldname, gegner } from "../schach/stellung";
import type { Buchstellung } from "./buchstellungen";
import { gegnerErsatz, plansaetze, type Plansaetze } from "./planablenker";
import { mische, type Zufall } from "./zufall";

/** Kapitel mit Planfragen-Stellungen. */
const KAPITEL = new Set([6, 11]);
/** Abbildungen mit Planbilanz im Buch (Verweis nach der Antwort). */
const MIT_BUCHBILANZ = new Set(["6.20", "11.34"]);
/** Höchstens so viele Bauernzüge fragt das Wettrennen ab (Knöpfe 1 bis 6). */
export const HOECHSTENS_ZUEGE = 6;
/** Je Frage so viele falsche Antworten. */
const ABLENKER = 2;

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
  /** Warum-Frage zum Buchtext statt der drei Planfragen (eigene Überschrift, Befund N696). */
  readonly warum: boolean;
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

/**
 * Nur ruhige Mittelspielstellungen: Planfragen gelten im Mittelspiel (Kapitel 6); in Eröffnung
 * und Endspiel führen sie in die Irre (Abb. 6.27 wäre ein Turmendspiel). Phase nach der Lesart
 * der App (schach/phase.ts).
 */
export function planstellung(buch: Buchstellung): Stellungsprofil | null {
  if (!KAPITEL.has(buch.kapitel) || !buch.stellung.regeln) return null;
  const p = profil(buch.stellung);
  if (unruhe(p) !== null) return null;
  return phase(buch.stellung, p.angriffskarte, p.drohungen).phase === "mittelspiel" ? p : null;
}

/** Steht die Abbildung im Mittelspiel (Lesart der App, schach/phase.ts)? */
function istMittelspiel(buch: Buchstellung): boolean {
  if (!buch.stellung.regeln) return false;
  const p = profil(buch.stellung);
  return phase(buch.stellung, p.angriffskarte, p.drohungen).phase === "mittelspiel";
}

/** Eine Frage: der richtige Satz und bis zu zwei andere, gemischt, ohne Doppelte. */
function wahlfrage(frage: string, richtig: string, andere: readonly string[], zufall: Zufall) {
  const falsche = [...new Set(andere.filter((a) => a !== richtig))].slice(0, ABLENKER);
  const antworten = mische([richtig, ...falsche], zufall);
  return { frage, antworten, richtig: antworten.indexOf(richtig) };
}

interface Vorrat {
  readonly buch: Buchstellung;
  readonly p: Stellungsprofil;
  readonly s: Plansaetze;
}

/**
 * Ablenker aus anderen Stellungen: ab einem Versatz (nicht die Nachbarstellung derselben Partie
 * mit fast gleichem Skelett), nur Sätze anderer Art als der richtige und untereinander
 * verschieden, bei „Gegner?“ nur über denselben Gegner (gleiche Seite am Zug).
 */
function fremdeAblenker(
  vorrat: readonly Vorrat[],
  i: number,
  satz: (s: Plansaetze) => string,
  art: (s: Plansaetze) => string,
  passt: (v: Vorrat) => boolean,
): string[] {
  const versatz = Math.max(1, Math.floor(vorrat.length / 2));
  const eigene = vorrat[i];
  if (!eigene) return [];
  const arten = new Set([art(eigene.s)]);
  const gefunden: string[] = [];
  for (let k = 0; k < vorrat.length && gefunden.length < ABLENKER; k++) {
    const v = vorrat[(i + versatz + k) % vorrat.length];
    if (!v || v === eigene || !passt(v) || arten.has(art(v.s))) continue;
    arten.add(art(v.s));
    gefunden.push(satz(v.s));
  }
  return gefunden;
}

/** Die drei Planfragen zu einer Stellung des Vorrats. */
function planfragen(vorrat: readonly Vorrat[], i: number, zufall: Zufall): Wahlfrage[] {
  const { buch, p, s } = vorrat[i] as Vorrat;
  const seite = buch.stellung.amZug;
  const gleicheSeite = (v: Vorrat) => v.buch.stellung.amZug === seite;
  // Auch „Wo?“ nur aus Stellungen mit derselben Seite am Zug: sonst nennt ein Ablenker die
  // Kette und den Hebel des Gegners (Befund N694, 26.10.2026).
  const wo = fremdeAblenker(vorrat, i, (x) => x.wo, (x) => x.woArt, gleicheSeite);
  const gegnerSaetze = [
    ...fremdeAblenker(vorrat, i, (x) => x.gegner, (x) => x.gegnerArt, gleicheSeite),
    ...gegnerErsatz(p, seite),
  ];
  return [
    wahlfrage(t("planbilanz.wo"), s.wo, wo, zufall),
    wahlfrage(t("planbilanz.gegner"), s.gegner, gegnerSaetze, zufall),
    wahlfrage(t("planbilanz.figur"), s.figur, s.andereFiguren, zufall),
  ];
}

/**
 * Die Planfragen-Aufgaben: je ruhige Mittelspielstellung aus Kapitel 6 und 11 die drei Fragen
 * für die Seite am Zug, dazu die Warum-Fragen der vorbereiteten Texte zu Kapitel 6.
 * Beispiel: Abb. 6.20, Weiß am Zug → „Wo spiele ich?“ mit dem Satz von Weiß und zwei Sätzen
 * anderer Lagen aus anderen Stellungen.
 */
export function planaufgaben(stellungen: readonly Buchstellung[], zufall: Zufall): Planaufgabe[] {
  const vorrat: Vorrat[] = stellungen.flatMap((buch) => {
    const p = planstellung(buch);
    if (!p) return [];
    const s = plansaetze(p, buch.stellung.amZug);
    return aussagekraeftig(s, buch.stellung.amZug) ? [{ buch, p, s }] : [];
  });
  const aufgaben = vorrat.map((v, i) => ({
    buch: v.buch,
    fragen: planfragen(vorrat, i, zufall),
    warum: false,
  }));
  const warum = stellungen
    .filter((b) => b.kapitel === 6 && b.vorbereitet && b.vorbereitet.fragen.length > 0)
    // Wie die Planfragen nur im Mittelspiel (Befund N696: Fragen zu Eröffnungszügen).
    .filter((b) => istMittelspiel(b))
    .map((buch) => ({
      buch,
      fragen: (buch.vorbereitet?.fragen ?? []).map(alsWahlfrage),
      warum: true,
    }));
  return [...aufgaben, ...warum].map(({ buch, fragen, warum: istWarum }) => ({
    nummer: buch.nummer,
    fen: buch.stellung.fen,
    seite: buch.stellung.amZug,
    fragen,
    buchbilanz: MIT_BUCHBILANZ.has(buch.nummer),
    warum: istWarum,
  }));
}

/** Eine Warum-Frage der vorbereiteten Texte als Wahlfrage. */
function alsWahlfrage(f: Frage): Wahlfrage {
  return { frage: f.frage, antworten: f.antworten, richtig: f.richtig, erklaerung: f.erklaerung };
}

/** Eine eigene Figur mit ihren freien Feldern (für die Begründung nach der Antwort). */
export interface Lapfigur {
  readonly feld: string;
  readonly rolle: Role;
  readonly freie: number;
  readonly zuHause: boolean;
}

export interface Lapaufgabe {
  readonly nummer: string;
  readonly fen: string;
  readonly seite: Color;
  /** Die am wenigsten aktive Figur (Feld, etwa „c1“). */
  readonly figur: string;
  /** Ihr Zielfeld laut LAP-Prinzip, oder null, wenn die App keines findet. */
  readonly ziel: string | null;
  /** Alle eigenen Figuren außer König und Bauern, am wenigsten aktive zuerst (Begründung). */
  readonly figuren: readonly Lapfigur[];
}

/**
 * Ruhig genug für die LAP-Frage? Keine eigene Figur hängt (der Gegner gewinnt beim Schlagen
 * Material), und keine eigene Figur ist an den König gefesselt.
 *
 * Warum: Das LAP-Prinzip gilt für ruhige Stellungen (Kapitel 6). Der Autor bekam eine Stellung, in
 * der der gefesselte Springer e7 zugleich angegriffen war: Dort geht es um Rettung, nicht um
 * Figurenverbesserung (Nebenchat, 30.10.2026).
 */
function ruhigFuerLap(p: Stellungsprofil, seite: Color): boolean {
  const brett = p.stellung.brett;
  const haengt = [...brett[seite]].some((feld) => {
    const figur = brett.get(feld);
    return figur?.role !== "king" && (p.abtausch(feld)?.bilanz ?? 0) > 0;
  });
  const gefesselt = fesselungslinien(brett, p.angriffskarte, seite).some(
    (linie) => linie.art === "direkt" && linie.absolut,
  );
  return !haengt && !gefesselt;
}

/**
 * Die LAP-Aufgabe zu einer ruhigen Mittelspielstellung aus Kapitel 6 und 11 (Seite am Zug),
 * oder null. Regel: Kapitel 6, Frage 3 (LAP-Prinzip: die am wenigsten aktive Figur verbessern).
 * Beispiel: Abb. 6.20 → Läufer c1 (noch zu Hause), Ziel nach dem Werkzeug „Welche Figur?“.
 */
export function lapaufgabe(buch: Buchstellung): Lapaufgabe | null {
  const p = planstellung(buch);
  if (!p) return null;
  const seite = buch.stellung.amZug;
  if (!ruhigFuerLap(p, seite)) return null;
  const ergebnis = lapVon(p, seite);
  if (!ergebnis || ergebnis.ziel.ziel === null) return null;
  const figuren = aktivitaeten(p.sichereFelder(seite)).map((a) => ({
    feld: feldname(a.stand.feld),
    rolle: a.stand.figur.role,
    freie: a.freie.length,
    zuHause: a.zuHause,
  }));
  return {
    nummer: buch.nummer,
    fen: buch.stellung.fen,
    seite,
    figur: feldname(ergebnis.lap.stand.feld),
    ziel: feldname(ergebnis.ziel.ziel),
    figuren,
  };
}

export interface Rennaufgabe {
  readonly nummer: string;
  readonly fen: string;
  /** Bauernzüge bis zum ersten Hebel gegen den gegnerischen König, je Seite. */
  readonly zuege: Readonly<Record<Color, number>>;
}

/**
 * Das Wettrennen zu einer Mittelspielstellung mit entgegengesetzten Rochaden, oder null.
 * Regel: Kapitel 6, „Bei entgegengesetzten Rochaden: Bauernzüge bis zum ersten Hebel für beide
 * Seiten zählen“. Beispiel: Abb. 6.6 → Weiß 2 (h2–h5 gegen g6), Schwarz 3 (a7–a3 gegen b2).
 */
export function rennaufgabe(buch: Buchstellung): Rennaufgabe | null {
  if (!buch.stellung.regeln) return null;
  const p = profil(buch.stellung);
  if (phase(buch.stellung, p.angriffskarte, p.drohungen).phase !== "mittelspiel") return null;
  const lage = planlage(p, "white");
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

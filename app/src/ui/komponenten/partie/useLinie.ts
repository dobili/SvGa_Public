/**
 * Zustand der Linie im Rückblick: welcher Zweig an der gezeigten Stelle gewählt ist, und die
 * Zugnavigation (Knöpfe und Pfeiltasten) durch Partie und Zweig.
 *
 * Rolle im Gesamtbild: Fehlermeldung des Autors (6.11.2026, Engine-Folgen in der Auswertung).
 * Vorher hielt der Partie-Bildschirm den Zweig, die Zugknöpfe der Zugliste kannten ihn aber
 * nicht: „Vor“ und „Zurück“ zählten die Stelle in der Partie weiter und ließen den Zweig fallen,
 * deshalb sprang das Brett mehrere Züge, und die markierte Zeile passte nicht zum Brett. Jetzt
 * gehen Knöpfe, Pfeiltasten, Zweigknöpfe der Karte und das Abspielen über denselben Stand
 * (linienstand.ts). Die Stelle in der Partie gehört weiter dem Partie-Bildschirm (Sprünge aus
 * der Zeitleiste); der Zweig gilt nur für die Stelle, an der er gewählt wurde.
 * Seit dem Wunsch des Autors (6.11.2026, Knöpfe unter dem Brett entfallen) spielt hier auch ein
 * Tipp auf einen Linienknopf die Folge Zug für Zug vor; jeder Schritt von Hand hält das an.
 * Abhängigkeiten: React, linienstand.ts, rueckblick/Nebenzweig.tsx (Typ Zweigwahl).
 */
import { useEffect, useRef, useState } from "react";
import type { Zweigart } from "../../../spiel/nebenzweig";
import type { Zugrichtung } from "../brettbedienung/Zugknoepfe";
import type { Zweigwahl } from "../rueckblick/Nebenzweig";
import {
  linienschritt,
  liniensperren,
  richtungZurTaste,
  waehleLinie,
  type Linienstand,
  type Zweiglaengen,
} from "./linienstand";

/** Ein Zweig mit der Stelle, an der er gewählt wurde. */
interface GemerkterZweig {
  readonly stelle: number;
  /** Die Ansicht, in der er gewählt wurde; ein neuer Sprung (Zug, Moment) verlässt ihn. */
  readonly anker: object | null;
  readonly art: Zweigart;
  readonly schritt: number;
}

/** Was useLinie liefert: der Stand und wie man ihn ändert. */
export interface Linie {
  readonly stand: Linienstand;
  /** Für die Zweige der Karte (Rueckblickkarte.tsx, Nebenzweig.tsx). */
  readonly zweigwahl: Zweigwahl;
  /** Ein Schritt von Hand (Knopf, Taste, Zug antippen); hält das Vorspielen an. */
  readonly geheZu: (neu: Linienstand) => void;
  /** Der Zweig, der gerade vorgespielt wird, sonst null. */
  readonly laeuft: Zweigart | null;
  /** Ein Schritt des Vorspielens: zeigt den Stand und spielt den Zweig weiter vor. */
  readonly spiele: (neu: Linienstand) => void;
  /** Hält das Vorspielen an; die gezeigte Stellung bleibt. */
  readonly halt: () => void;
}

/**
 * Der Zweig zur gezeigten Stelle. Eingaben: die Stelle in der Partie, die gewählte Ansicht
 * (Sprung aus Zugliste oder Zeitleiste; null = aktuelle Stellung) und der Setzer der Stelle.
 * Wechselt Stelle oder Ansicht, gilt der alte Zweig nicht mehr: Ein Tipp auf einen Zug der
 * Partie zeigt die Partie, auch wenn es derselbe Zug ist.
 */
export function useLinie(
  stelle: number,
  anker: object | null,
  beiStelle: (stelle: number) => void,
): Linie {
  const [zweig, setzeZweig] = useState<GemerkterZweig | null>(null);
  const [vorspiel, setzeVorspiel] = useState<Zweigart | null>(null);
  const hier = zweig?.stelle === stelle && zweig.anker === anker ? zweig : null;
  const stand: Linienstand = {
    stelle,
    zweig: hier ? { art: hier.art, schritt: hier.schritt } : null,
  };
  const zeige = (neu: Linienstand) => {
    if (neu.stelle !== stelle) beiStelle(neu.stelle);
    // Ein neuer Zweig liegt immer an derselben Stelle (linienschritt, waehleLinie).
    setzeZweig(neu.zweig ? { stelle: neu.stelle, anker, ...neu.zweig } : null);
  };
  const halt = () => setzeVorspiel(null);
  const zweigwahl: Zweigwahl = {
    art: stand.zweig?.art ?? null,
    schritt: stand.zweig?.schritt ?? null,
    setze: (art, schritt) => {
      halt();
      setzeZweig(schritt === null ? null : { stelle, anker, art, schritt });
    },
  };
  return {
    stand,
    zweigwahl,
    geheZu: (neu) => {
      halt();
      zeige(neu);
    },
    // Vorgespielt wird nur der gezeigte Zweig; ein Sprung anderswohin beendet es von selbst.
    laeuft: hier && hier.art === vorspiel ? vorspiel : null,
    spiele: (neu) => {
      setzeVorspiel(neu.zweig?.art ?? null);
      zeige(neu);
    },
    halt,
  };
}

/** Ob eine Taste dem Feld gehört, in dem sie gedrückt wurde (Eingabe, Auswahl, Regler). */
function tasteFuerFeld(ziel: EventTarget | null): boolean {
  if (!(ziel instanceof HTMLElement)) return false;
  return ziel.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(ziel.tagName);
}

/**
 * Pfeil links und rechts gehen durch die Linie, solange `aktiv` ist (nach dem Ende der Partie).
 * Nicht, wenn ein Feld die Taste braucht oder ein anderer sie schon genommen hat (etwa die
 * Reihe der Zeitleiste, useWischreihe.ts).
 */
function usePfeiltasten(aktiv: boolean, beiRichtung: (richtung: Zugrichtung) => void): void {
  const aktuell = useRef(beiRichtung);
  useEffect(() => {
    aktuell.current = beiRichtung;
  });
  useEffect(() => {
    if (!aktiv) return;
    const beiTaste = (e: KeyboardEvent) => {
      const richtung = richtungZurTaste(e.key);
      if (!richtung || e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return;
      if (tasteFuerFeld(e.target)) return;
      e.preventDefault();
      aktuell.current(richtung);
    };
    window.addEventListener("keydown", beiTaste);
    return () => window.removeEventListener("keydown", beiTaste);
  }, [aktiv]);
}

/** Zeit je Zug beim Vorspielen: langsam genug, um jeden Zug am Brett zu verfolgen (seit 0.3.0). */
export const TAKT_MS = 1200;

/**
 * Spielt den Zweig `linie.laeuft` Zug für Zug weiter vor, bis zu seinem letzten Zug; dort hält es
 * an, die letzte Stellung bleibt stehen.
 */
function useVorspielen(linie: Linie, laengen: Zweiglaengen): void {
  const aktuell = useRef(linie);
  useEffect(() => {
    aktuell.current = linie;
  });
  const laeuft = linie.laeuft;
  const { stelle, zweig } = linie.stand;
  const schritt = zweig?.schritt ?? 0;
  const laenge = laeuft ? laengen[laeuft] : 0;
  useEffect(() => {
    if (laeuft === null) return;
    if (schritt >= laenge) {
      aktuell.current.halt();
      return;
    }
    const zeitgeber = setTimeout(
      () => aktuell.current.spiele({ stelle, zweig: { art: laeuft, schritt: schritt + 1 } }),
      TAKT_MS,
    );
    return () => clearTimeout(zeitgeber);
  }, [laeuft, stelle, schritt, laenge]);
}

/**
 * Was ein Tipp auf einen Linienknopf tut (Wunsch des Autors, 6.11.2026).
 * „Partie“ (null): zurück zum Zug der Partie. Ein anderer Zweig: von vorn vorspielen. Der
 * gezeigte Zweig: Läuft er, hält er an; sonst spielt er weiter vor, vom letzten Zug wieder von vorn.
 * Beispiel: an 8. Sc3? zeigt „Bestrafung“ 8... c6 und spielt die Folge dahinter Zug für Zug vor.
 */
function waehleOderSpiele(linie: Linie, art: Zweigart | null, laengen: Zweiglaengen): void {
  const zweig = linie.stand.zweig;
  if (art === null || laengen[art] === 0) {
    linie.geheZu(waehleLinie(linie.stand, art, laengen));
    return;
  }
  if (linie.laeuft === art) {
    linie.halt();
    return;
  }
  const weiter = zweig?.art === art && zweig.schritt < laengen[art];
  linie.spiele(weiter ? linie.stand : waehleLinie(linie.stand, art, laengen));
}

/** Zugknöpfe der Zugliste: gesperrte Richtungen und was ein Tipp tut. */
export interface Liniennavigation {
  readonly gesperrt: Readonly<Record<Zugrichtung, boolean>>;
  readonly beiRichtung: (richtung: Zugrichtung) => void;
  /** Tipp auf einen Linienknopf an der gezeigten Stelle: null = Partie (waehleOderSpiele). */
  readonly waehle: (art: Zweigart | null) => void;
  /** Der Zweig, der gerade vorgespielt wird, sonst null. */
  readonly laeuft: Zweigart | null;
  /** Länge beider Zweige am gezeigten Zug (0 = Knopf gesperrt). */
  readonly laengen: Zweiglaengen;
}

/**
 * Navigation durch die gewählte Linie. Eingaben: die Linie, die Längen der Zweige am gezeigten
 * Zug, Zahl der Halbzüge, ob die Pfeiltasten gelten.
 * Beispiel: im Zweig „besser“ am ersten Zug führt „Zurück“ (oder Pfeil links) an den Abzweig.
 */
export function useLiniennavigation(
  linie: Linie,
  laengen: Zweiglaengen,
  anzahl: number,
  mitTasten: boolean,
): Liniennavigation {
  const beiRichtung = (richtung: Zugrichtung) =>
    linie.geheZu(linienschritt(linie.stand, richtung, laengen, anzahl));
  usePfeiltasten(mitTasten, beiRichtung);
  useVorspielen(linie, laengen);
  return {
    gesperrt: liniensperren(linie.stand, laengen, anzahl),
    beiRichtung,
    waehle: (art) => waehleOderSpiele(linie, art, laengen),
    laeuft: linie.laeuft,
    laengen,
  };
}

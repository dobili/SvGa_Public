/**
 * Wohin der Knopf „Los geht's“ im Infofenster eines Ordens oder Abzeichens führt (Wunsch des
 * Autors, 31.10.2026: Nebenaufgaben auf dem Lernpfad mit einem Knopf, der direkt dorthin führt).
 *
 * Rolle im Gesamtbild: Eine Tabelle, je Stück eine Zeile (Schlüssel wie in „verdient“, etwa
 * „abzeichen:erstePartie“); ein neues Stück ohne Zeile hat einfach keinen Knopf. Kapitelaufgaben
 * des Lernpfads bringen ihr Ziel selbst mit (Feld `ziel`). Stücke, die zu einem Kapitel passen
 * („Nachgefragt“: Warum-Fragen an den Abbildungen), öffnen das Kapitel, bei dem sie auf dem
 * Lernpfad stehen. Reine Daten und Funktionen.
 * Abhängigkeiten: app/stapel.ts (Ansicht), erfolgsstuecke.ts, fortschritt/ringrechnung.ts (Teile).
 */
import type { Ansicht } from "../../../app/stapel";
import { BUCHTEILE } from "../fortschritt/ringrechnung";
import { verdientSchluessel, type Erfolgsstueck } from "./erfolgsstuecke";

/** Ein Ziel: feste Ansicht oder abhängig vom Kapitel der Nebenaufgabe. */
type Ziel = Ansicht | ((kapitel: number) => Ansicht);

const SPIELEN: Ansicht = { bildschirm: "spielen" };
const GEGNER: Ansicht = { bildschirm: "spielen", seite: "gegner" };
const BUCH: Ansicht = { bildschirm: "buch" };
const PROFIL: Ansicht = { bildschirm: "ich" };
const KAPITEL = (nummer: number): Ansicht => ({ bildschirm: "kapitel", nummer });

/** Die Ziele je Stück. Die Bots führen zur Gegnerwahl, die Partien zum Spielen. */
const ZIELE: Readonly<Record<string, Ziel>> = {
  "orden:abbildungen": BUCH,
  "orden:uebungen": BUCH,
  "orden:lernziele": { bildschirm: "checkliste" },
  "orden:trainer": { bildschirm: "training" },
  "orden:bots-1-3-einmal": GEGNER,
  "orden:bots-1-3-alle": GEGNER,
  "orden:bots-4-5-einmal": GEGNER,
  "orden:bots-4-5-alle": GEGNER,
  "orden:bots-6-7-einmal": GEGNER,
  "orden:bots-6-7-alle": GEGNER,
  "orden:bots-8-9-einmal": GEGNER,
  "orden:bots-8-9-alle": GEGNER,
  "orden:engine": GEGNER,
  "abzeichen:erstePartie": SPIELEN,
  "abzeichen:ersterSieg": SPIELEN,
  "abzeichen:partien10": SPIELEN,
  "abzeichen:partien50": SPIELEN,
  "abzeichen:partien100": SPIELEN,
  "abzeichen:erstesMatt": SPIELEN,
  "abzeichen:siegOhneHilfe": SPIELEN,
  "abzeichen:siegGegenStaerkeren": SPIELEN,
  "abzeichen:remisGegenStaerkeren": SPIELEN,
  "abzeichen:brillant": SPIELEN,
  "abzeichen:kurzerProzess": SPIELEN,
  "abzeichen:umwandlung": SPIELEN,
  "abzeichen:ersteUebung": KAPITEL,
  "abzeichen:kapitelUebungen": KAPITEL,
  "abzeichen:warum": KAPITEL,
  "abzeichen:eingeschaetzt": KAPITEL,
  "abzeichen:sammlung": { bildschirm: "lernsammlung" },
  "abzeichen:fehler": { bildschirm: "trainer", kennung: "fehlerdatenbank" },
  "abzeichen:trainer": { bildschirm: "training" },
  "abzeichen:wochenziel4": BUCH,
  "abzeichen:wochenziel12": BUCH,
  "abzeichen:zehnZiele": BUCH,
  "abzeichen:auftraege8": BUCH,
  "abzeichen:rivalen3": BUCH,
  "abzeichen:rivalen10": BUCH,
  "abzeichen:dreiRekorde": PROFIL,
  "abzeichen:erstesGold": PROFIL,
  "abzeichen:fuenfSilber": PROFIL,
  "abzeichen:alleTaktikGold": { bildschirm: "trainer", kennung: "taktik" },
  // Orden der fünf Teile des Buches: das erste Kapitel des Teils (Fehlertest f3, 01.11.2026:
  // im Profil hatten sie als einzige Orden keinen Knopf).
  ...Object.fromEntries(
    BUCHTEILE.map((teil) => [`orden:teil-${teil.kennung}`, KAPITEL(teil.kapitel[0])]),
  ),
};

/**
 * Das Ziel eines Stücks; null, wenn es keins gibt (etwa „Eine Woche dabei“: Dafür gibt es keinen
 * Ort, nur Tage). `kapitel`: das Kapitel, bei dem das Stück auf dem Lernpfad steht (Standard 0).
 * Beispiel: „abzeichen:warum“ bei Kapitel 2 → Kapitelübersicht 2.
 */
export function stueckziel(stueck: Erfolgsstueck, kapitel = 0): Ansicht | null {
  if (stueck.ziel) return stueck.ziel;
  const ziel = ZIELE[verdientSchluessel(stueck)];
  if (!ziel) return null;
  return typeof ziel === "function" ? ziel(kapitel) : ziel;
}

/**
 * Führt das Ziel woandershin als die gezeigte Ansicht? Im Profil hat „Deine Themen“ (Ziel Profil)
 * keinen Knopf, auf dem Lernpfad schon. Beispiel: Ziel { ich } bei Ansicht { ich } → false.
 */
export function fuehrtWoandershin(ziel: Ansicht | null, gezeigt: Ansicht): ziel is Ansicht {
  return ziel !== null && JSON.stringify(ziel) !== JSON.stringify(gezeigt);
}

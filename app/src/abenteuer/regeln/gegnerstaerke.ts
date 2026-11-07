/**
 * Gegnerstärke: aus Zielstärke, Zustand und Wertung des Lesers die Stufe je Phase und die
 * Fehlerhäufigkeit rechnen (docs/spiel/04_Architektur.md, Abschnitt 4; Entscheidung A6).
 *
 * Rolle im Gesamtbild: Das Spiel kennt Gegner nur als Ziel-Elo; die App kennt zehn Stufen zu je
 * 300 Elo (engine/stufen.ts) und eine Fehlerhäufigkeit als Faktor (1 = wie Menschen der Stufe).
 * Diese Datei übersetzt. Reine Funktionen, keine Abhängigkeit von Oberfläche oder Speicher.
 * Abhängigkeiten: engine/stufen.ts (Stufennummer, ELO_JE_STUFE), schnittstelle/gegnerprofil.ts.
 * Beispiel: Eingangswertung 800, Clubchef 1 (eingang + 220) → Ziel 1020 → Stufe 4 (901–1200),
 * Häufigkeit 1,12 (unteres Drittel der Stufe spielt fehlerhafter); abgelenkt mit Faktor 1,4 →
 * Häufigkeit 1,57.
 */
import type { Stufennummer } from "../../engine/stufen";
import type { Phase } from "../../schach/phase";
import type {
  Gegnerprofil,
  Gegnerzustand,
  Gerechnetestaerke,
  Zielstaerke,
} from "../schnittstelle/gegnerprofil";

/** Elo je Stufe der App (engine/stufen.ts: zehn Stufen zu je 300). */
export const ELO_JE_STUFE = 300;
const STUFE_MIN: Stufennummer = 1;
const STUFE_MAX: Stufennummer = 10;
/** Unter dieser Wertung spielt niemand; die Bots der Stufe 1 messen etwa 330. */
export const ELO_MIN = 300;
/** Häufigkeit am unteren Rand einer Stufe (mehr Fehler) und am oberen (weniger). */
const HAEUFIGKEIT_UNTEN = 1.4;
const HAEUFIGKEIT_OBEN = 0.7;
/** Ohne Wertung (erste Story-Partie, Entscheidung A5) gilt diese Annahme für Einsteiger. */
export const WERTUNG_OHNE = 600;

const PHASEN: readonly Phase[] = ["eroeffnung", "mittelspiel", "endspiel"];

/** Der Ziel-Elo eines Gegners aus seiner Zielstärke und den Wertungen des Lesers. */
export function zielElo(
  staerke: Zielstaerke,
  wertung: { readonly aktuell: number | null; readonly eingang: number | null },
): number {
  const aktuell = wertung.aktuell ?? wertung.eingang ?? WERTUNG_OHNE;
  const eingang = wertung.eingang ?? aktuell;
  switch (staerke.art) {
    case "fest":
      return staerke.elo;
    case "aktuell":
      return aktuell + staerke.versatz;
    case "eingang":
      return eingang + staerke.versatz;
  }
}

/** Die Stufe, in die ein Elo-Wert fällt: 1 bis 300 → 1, 301 bis 600 → 2 … ab 2701 → 10. */
export function stufeZu(elo: number): Stufennummer {
  const stufe = Math.ceil(Math.max(elo, 1) / ELO_JE_STUFE);
  return Math.min(STUFE_MAX, Math.max(STUFE_MIN, stufe)) as Stufennummer;
}

/**
 * Die Häufigkeit innerhalb einer Stufe: linear von HAEUFIGKEIT_UNTEN (Anfang der Stufe) bis
 * HAEUFIGKEIT_OBEN (Ende der Stufe). Außerhalb der Stufen (unter 300, über 3000) bleibt der Rand.
 */
export function haeufigkeitZu(elo: number): number {
  const stufe = stufeZu(elo);
  const anfang = (stufe - 1) * ELO_JE_STUFE;
  const anteil = Math.min(1, Math.max(0, (elo - anfang) / ELO_JE_STUFE));
  return HAEUFIGKEIT_UNTEN + (HAEUFIGKEIT_OBEN - HAEUFIGKEIT_UNTEN) * anteil;
}

/**
 * Stufe je Phase und Häufigkeit für eine Partie.
 *
 * Eingaben: Profil (Zielstärke, Phasenversatz), Zustand (Faktor auf die Häufigkeit), Wertungen.
 * Ausgabe: Ziel-Elo, Stufe je Phase (mit Versatz, begrenzt auf 1 bis 10), Häufigkeit (auf zwei
 * Nachkommastellen gerundet, damit sie in Tests und Protokollen lesbar bleibt).
 */
export function gerechneteStaerke(
  profil: Pick<Gegnerprofil, "staerke" | "phasenversatz">,
  zustand: Pick<Gegnerzustand, "haeufigkeitsfaktor">,
  wertung: { readonly aktuell: number | null; readonly eingang: number | null },
): Gerechnetestaerke {
  const ziel = Math.max(ELO_MIN, Math.round(zielElo(profil.staerke, wertung)));
  const grund = stufeZu(ziel);
  const stufenJePhase = Object.fromEntries(
    PHASEN.map((phase) => {
      const versatz = profil.phasenversatz?.[phase] ?? 0;
      const stufe = Math.min(STUFE_MAX, Math.max(STUFE_MIN, grund + versatz));
      return [phase, stufe as Stufennummer];
    }),
  ) as Record<Phase, Stufennummer>;
  const haeufigkeit = Math.round(haeufigkeitZu(ziel) * zustand.haeufigkeitsfaktor * 100) / 100;
  return { zielElo: ziel, stufenJePhase, haeufigkeit };
}

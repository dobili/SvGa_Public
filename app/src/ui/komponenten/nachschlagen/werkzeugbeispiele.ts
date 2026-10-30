/**
 * Beispiel-Abbildung je Werkzeug für die Bildschirmfotos im Werkzeugverzeichnis.
 *
 * Rolle im Gesamtbild: Paket F der Ideensammlung (26.10.2026): „bei den Werkzeugen Screenshots von
 * unseren Werkzeugen in der App, wo gezeigt wird, wo man was findet, vielleicht mit Pfeilen“.
 * Die Bilder entstehen automatisch im Browser (tests/bilder/werkzeugbilder.spec.ts, Befehl
 * `npm run bilder:werkzeuge`), damit sie nicht veralten: Der Erzeuger öffnet je Werkzeug die
 * Abbildung aus dieser Liste, wählt das Werkzeug wie ein Leser und fotografiert Leiste, Brett und
 * Karte mit goldenen Nummern. Die Abbildungen sind dieselben wie in den Oberflächentests der
 * Werkzeuge; ein Test (werkzeugbeispiele.test.ts) verlangt für jedes Werkzeug einen Eintrag und
 * ein Bild.
 * Abhängigkeiten: analyse/werkzeug.ts (Typ der Kennung).
 */
import type { Werkzeug } from "../../../analyse/werkzeug";

/** Ergebnis der Engine, auf das der Erzeuger wartet: Kennung der Karte und Text darin. */
export interface Engineergebnis {
  readonly karte: string;
  readonly text: string;
}

/** Ein Beispiel: Abbildung, nötiges Antippen eines Feldes, Engine-Ergebnis abwarten. */
export interface Werkzeugbeispiel {
  /** Nummer der Abbildung, etwa „1.26“. */
  readonly abbildung: string;
  /** Name des Feldes zum Antippen (nur „Zählen“), wie ihn ein Bildschirmleser hört. */
  readonly feld?: string;
  /** Rechnet das Werkzeug mit der Engine, steht hier ihr Ergebnis (wie im Oberflächentest). */
  readonly engine?: Engineergebnis;
}

/** Ordner der Bilder unter public/ (ohne Schrägstrich am Anfang, für BASE_URL). */
export const WERKZEUGBILD_ORDNER = "bilder/werkzeuge";

/** Je Werkzeug die Abbildung, an der es im Bild gezeigt wird. */
export const WERKZEUGBEISPIELE: Readonly<Record<Werkzeug["id"], Werkzeugbeispiel>> = {
  "k1-zaehlen": { abbildung: "1.26", feld: "d4, Bauer (Weiß)" },
  "k1-roentgen": { abbildung: "1.23" },
  "k1-angriffsregel": { abbildung: "1.37" },
  "k1-todsuenden": { abbildung: "1.8" },
  "k2-zielbilanz": { abbildung: "2.71" },
  "k2-eroeffnung": { abbildung: "2.2" },
  "k3-faktorenbilanz": { abbildung: "3.10" },
  "k4-warnsignale": { abbildung: "4.11" },
  "k4-prueffragen": { abbildung: "4.21" },
  "k4-falle": {
    abbildung: "4.21",
    engine: { karte: "falle-karte", text: "Falle: Nach axb4 folgt Matt." },
  },
  "k5-vorher": { abbildung: "5.3" },
  "k5-felder": { abbildung: "5.17" },
  "k5-bauern": { abbildung: "5.17" },
  "k5-richtung": { abbildung: "5.32" },
  "k5-figuren": { abbildung: "5.17" },
  "k6-wo": { abbildung: "6.6" },
  "k6-gegner": {
    abbildung: "6.13",
    engine: { karte: "gegner-karte", text: "Vorbeugen: der Zug für Schwarz (Engine)" },
  },
  "k6-lap": { abbildung: "6.20" },
  "k6-planbilanz": { abbildung: "6.20" },
  "k7-warnsignale": { abbildung: "7.18" },
  "k7-erzwingend": { abbildung: "7.14" },
  "k7-ruhe": { abbildung: "7.14", engine: { karte: "ruhe-karte", text: "Bilanz: vorher 0" } },
  "k7-motiv": { abbildung: "7.46" },
  "k8-regeln": { abbildung: "8.19" },
  "k8-opposition": { abbildung: "8.19" },
  "k8-schluesselfelder": { abbildung: "8.19" },
  "k8-quadrat": { abbildung: "8.35" },
  "k8-elementarmatt": { abbildung: "8.6" },
  "k9-turmbegriffe": { abbildung: "9.2" },
  "k9-erkennungsbilder": { abbildung: "9.8" },
  "k11-phase": { abbildung: "12.6" },
  "k12-erfassen": { abbildung: "12.2" },
  "k12-kandidaten": {
    abbildung: "12.1",
    engine: { karte: "kandidaten-karte", text: "Am stärksten nach der Engine:" },
  },
  "k12-sicherheitsblick": { abbildung: "12.6" },
};

/**
 * Pfad des Bildes zu einem Werkzeug, relativ zur Adresse der App.
 * Beispiel: werkzeugbildpfad("k6-lap") → „bilder/werkzeuge/k6-lap.webp“.
 */
export function werkzeugbildpfad(id: Werkzeug["id"]): string {
  return `${WERKZEUGBILD_ORDNER}/${id}.webp`;
}

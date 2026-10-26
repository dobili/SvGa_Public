/**
 * Werkzeug k9-erkennungsbilder: Welches Bild der Endspiel-Tabelle steht auf dem Brett, woran man
 * es erkennt, die Merkmale und der Plan in Kürze. Erkennungsmerkmal und Plan stehen
 * in eigenen Worten, dazu ein Verweis auf die Tabelle im Buch (Entscheidung des Autors vom
 * 15.10.2026: keine wörtlichen Buchtexte in den Werkzeugen).
 *
 * Rolle im Gesamtbild: Pflichtenheft 6.3 („Erkennungsbilder Philidor, Lucena, Vancura: E bei
 * Standardnähe, sonst N“); die App kennt alle Zeilen der Rückblick-Tabelle.
 * Abhängigkeiten: schach/erkennungsbilder.ts, i18n.
 * Buchbezug: Kapitel 9, „Rückblick: die Erkennungsbilder“ („Erkenne zunächst das Bild, dann
 * rechne“).
 */
import type { Color } from "chessops/types";
import { t, type Textschluessel } from "../i18n/sprache";
import { erkennungsbild, type Erkennungsbild, type Merkmal } from "../schach/erkennungsbilder";
import { feldname, type Stellung } from "../schach/stellung";
import { farbname, linienzahl, zugzahl } from "./texte";
import type { Befund, Markierung, Werkzeug, Werkzeugergebnis } from "./werkzeug";

/** Werte, die Felder sind und als Feldnamen erscheinen. */
const FELDWERTE: ReadonlySet<string> = new Set(["turm", "bauer", "partner", "ecke"]);
/** Werte, die Züge zählen („einen Zug“, „3 Züge“). */
const ZUGWERTE: ReadonlySet<string> = new Set(["schritte", "angreifer", "verteidiger"]);
/** Werte, die Linien zählen. */
const LINIENWERTE: ReadonlySet<string> = new Set(["linien", "soll", "dazwischen"]);

/** Ein Merkmal als Zeile: Textschlüssel `bilder.<kennung>`, Felder als Namen. */
function merkmalzeile(m: Merkmal): string {
  const werte: Record<string, string | number> = {};
  for (const [name, wert] of Object.entries(m.werte)) {
    if (typeof wert !== "number") werte[name] = wert;
    else if (FELDWERTE.has(name)) werte[name] = feldname(wert);
    else if (ZUGWERTE.has(name)) werte[name] = zugzahl(wert);
    else if (LINIENWERTE.has(name)) werte[name] = linienzahl(wert);
    else werte[name] = wert;
  }
  const zeile = t(`bilder.${m.kennung}` as Textschluessel, werte);
  if (m.standard === undefined) return zeile;
  return `${zeile} ${t(m.standard ? "bilder.standardJa" : "bilder.standardNein")}`;
}

/** Ergebnis, wenn kein Bild der Tabelle passt. */
function keins(): Werkzeugergebnis {
  return {
    werkzeug: "k9-erkennungsbilder",
    art: "N",
    ueberschrift: t("bilder.titel"),
    befunde: [
      {
        kennung: "keins",
        art: "N",
        titel: t("bilder.keinsTitel"),
        zeilen: [t("bilder.keins")],
        farbe: null,
      },
    ],
    fazit: t("bilder.keins"),
    markierungen: [],
    stufen: [["keins"], ["keins"], ["keins"]],
    regel: t("werkzeug.k9-erkennungsbilder.regel"),
  };
}

/** Markierungen aus den Feldern des Bildes. */
function markierungen(bild: Erkennungsbild): Markierung[] {
  return bild.felder.map((f) => ({ typ: "feld", farbe: f.farbe, feld: feldname(f.feld) }));
}

/**
 * Erkennt das Bild und stellt Erkennungsmerkmal, Merkmale und Plan in Kürze zusammen.
 *
 * Warum: „Steht ein Endspiel auf dem Brett, gehst du die Erkennungsfragen von oben nach unten
 * durch, bis eine passt. Die rechte Spalte nennt dir dann den Plan.“
 * Eingaben: Stellung, eigene Seite. Ausgabe: Bild (E oder N), Merkmale, Plan.
 * Beispiel: Abb. 9.3 → „Philidor-Stellung (E)“, Plan: Der Turm sperrt die Reihe vor dem Bauern
 * und wechselt nach hinten, sobald der Bauer sie betritt.
 */
export function erkennungsbilder(stellung: Stellung, eigen: Color): Werkzeugergebnis {
  const bild = erkennungsbild(stellung, eigen);
  if (!bild) return keins();
  const name = t(`bilder.${bild.bild}.name` as Textschluessel);
  const befunde: Befund[] = [
    {
      kennung: "bild",
      art: bild.art,
      titel: t("bilder.bildTitel", { name, seite: farbname(bild.seite) }),
      zeilen: [
        t(`bilder.${bild.bild}.frage` as Textschluessel),
        ...bild.merkmale.map(merkmalzeile),
      ],
      farbe: bild.art === "E" ? "gold" : "grau",
    },
    {
      kennung: "plan",
      art: "V",
      titel: t("bilder.planTitel"),
      zeilen: [t(`bilder.${bild.bild}.plan` as Textschluessel), t("bilder.verweis")],
      farbe: null,
    },
  ];
  return {
    werkzeug: "k9-erkennungsbilder",
    art: bild.art,
    ueberschrift: t("bilder.titel"),
    befunde,
    fazit: t(bild.art === "E" ? "bilder.fazitStandard" : "bilder.fazitBild", { name }),
    markierungen: markierungen(bild),
    stufen: [["bild"], ["bild", "plan"], ["bild", "plan"]],
    regel: t("werkzeug.k9-erkennungsbilder.regel"),
  };
}

/** Das Werkzeug k9-erkennungsbilder in der gemeinsamen Form aller Werkzeuge (Konzept 7.1). */
export const k9Erkennungsbilder: Werkzeug = {
  id: "k9-erkennungsbilder",
  kapitel: 9,
  name: "werkzeug.k9-erkennungsbilder.name",
  regel: "werkzeug.k9-erkennungsbilder.regel",
  erklaerung: "werkzeug.k9-erkennungsbilder.erklaerung",
  art: "N",
  braucht: ["stellung"],
  berechne: ({ stellung, perspektive }) => erkennungsbilder(stellung, perspektive),
};

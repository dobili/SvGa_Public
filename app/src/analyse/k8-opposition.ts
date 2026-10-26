/**
 * Werkzeug k8-opposition: Stehen die Könige in Opposition, wer hat sie, und welche Züge nehmen sie?
 *
 * Rolle im Gesamtbild: Pflichtenheft 6.3 („Opposition (direkt, fern, diagonal), wer sie hat.
 * Grau: Oppositionslinie, Gold: Feld“). Nach der Entscheidung des Autors vom 16.10.2026 (C1.19,
 * C2.14) nennt das Werkzeug nur Oppositionszüge, die das Ergebnis halten (König und Bauer gegen
 * König exakt mit der Endspieldatenbank); hält keiner, sagt es, was stattdessen entscheidet.
 * Abhängigkeiten: schach/opposition.ts, schach/ergebnispruefung.ts, i18n.
 * Buchbezug: Kapitel 8, Regel 2 und „Fern- und Diagonalopposition“ (Abb. 8.19 bis 8.24), Patt am
 * Rand (Abb. 8.31), Quadrat (Abb. 8.36), Reserve-Tempo (Abb. 8.53).
 */
import { oppositionDerStellung, type Opposition, type Oppositionszug } from "../schach/opposition";
import {
  pruefeOpposition,
  type Oppositionspruefung,
  type Stattzug,
} from "../schach/ergebnispruefung";
import { t } from "../i18n/sprache";
import { feldname, gegner, type Stellung } from "../schach/stellung";
import { aufzaehlung, farbname, zugtext } from "./texte";
import type { Befund, Markierung, Werkzeug, Werkzeugergebnis } from "./werkzeug";

/** Fernopposition mit fünf Feldern dazwischen (C2.14: nur mit Zusatz genannt). */
const FUENF_FELDER = 5;

/** Beschreibt eine Oppositionslage in einem Satz, etwa für Regel 2 in k8-regeln. */
export function lagetext(lage: Opposition): string {
  return t(`opposition.lage.${lage.art}`, {
    richtung: t(`opposition.richtung.${lage.richtung}`),
    zwischen: aufzaehlung(lage.zwischen.map(feldname)),
    anzahl: lage.zwischen.length,
  });
}

/** Zeilen zur Lage: Art, wer sie hat, und die Merkregel. */
function lagezeilen(stellung: Stellung, lage: Opposition | null): string[] {
  if (!lage) return [t("opposition.keine"), t("opposition.merkregel")];
  return [
    lagetext(lage),
    t("opposition.hat", { hat: farbname(gegner(stellung.amZug)), amZug: farbname(stellung.amZug) }),
    t("opposition.merkregel"),
  ];
}

/** Aufzählung mit „oder“: „Kf6, Kf5 oder Kf4“ (Abb. 8.36). */
function oderAufzaehlung(zuege: readonly Stattzug[]): string {
  const teile = zuege.map((z) => zugtext(z.san));
  if (teile.length <= 1) return teile.join("");
  return `${teile.slice(0, -1).join(", ")}${t("opposition.oder")}${teile.at(-1) ?? ""}`;
}

/**
 * Der Satz „Hier entscheidet nicht die Opposition, sondern …“, oder null, wenn ein
 * Oppositionszug das Ergebnis hält oder es keinen gibt.
 *
 * Warum: C1.19 (Entscheidung des Autors vom 16.10.2026). Eingaben: Stellung, Prüfung aus
 * schach/ergebnispruefung.ts. Ausgabe: der Satz oder null. Beispiele: Abb. 8.31 → Patt (Ka6),
 * Abb. 8.36 → Quadrat (Kf6, Kf5 oder Kf4), Abb. 8.53 → Reserve-Tempo (h4).
 * Sonderfall: Läuft der Bauer selbst ins Ziel (Abb. 8.35: b5), heißt es „Nach b5 erreicht der
 * gegnerische König das Quadrat nicht mehr“.
 */
export function hinweistext(stellung: Stellung, pruefung: Oppositionspruefung): string | null {
  if (pruefung.grund === null) return null;
  const werte = {
    zuege: oderAufzaehlung(pruefung.stattdessen),
    farbe: farbname(stellung.amZug),
    gegner: farbname(gegner(stellung.amZug)),
  };
  if (pruefung.grund !== "quadrat") return t(`opposition.grund.${pruefung.grund}`, werte);
  const bauernzug = pruefung.stattdessen.some((z) => stellung.brett.pawn.has(z.zug.from));
  return t(bauernzug ? "opposition.grund.quadratLaeuft" : "opposition.grund.quadrat", werte);
}

/** Ein Oppositionszug als Zeile; die Fernopposition mit fünf Feldern mit Zusatz (C2.14). */
function zugzeile(z: Oppositionszug): string {
  const werte = {
    zug: zugtext(z.san),
    lage: t(`opposition.kurz.${z.lage.art}`, {
      zwischen: aufzaehlung(z.lage.zwischen.map(feldname)),
    }),
  };
  const fuenf = z.lage.art === "fern" && z.lage.zwischen.length === FUENF_FELDER;
  return t(fuenf ? "opposition.zugFuenf" : "opposition.zug", werte);
}

/** Zeilen zu den Zügen, die die Opposition nehmen und das Ergebnis halten. */
function zugzeilen(stellung: Stellung, pruefung: Oppositionspruefung): string[] {
  const hinweis = hinweistext(stellung, pruefung);
  const zeilen = hinweis ? [hinweis] : pruefung.haltende.map(zugzeile);
  if (zeilen.length === 0) {
    return [t("opposition.keinZug", { farbe: farbname(stellung.amZug) })];
  }
  if (pruefung.art !== null) zeilen.push(t(`opposition.pruefung.${pruefung.art}`));
  return zeilen;
}

/** Reihenfolge wie im Buch: direkt vor fern (näher zuerst) vor diagonal. */
function sortiert(zuege: readonly Oppositionszug[]): Oppositionszug[] {
  const rang = (z: Oppositionszug) =>
    (z.lage.art === "direkt" ? 0 : z.lage.art === "fern" ? 1 : 2) * 8 + z.lage.zwischen.length;
  return [...zuege].sort((a, b) => rang(a) - rang(b));
}

/**
 * Grau die Felder zwischen den Königen, Gold die Zielfelder der haltenden Oppositionszüge.
 * Entscheidet etwas anderes, zeigt ein Pfeil den Zug: gold, wenn er das Ergebnis hält, rot beim
 * Patt (Abb. 8.31: Ka6 setzt patt).
 */
function markierungen(lage: Opposition | null, pruefung: Oppositionspruefung): Markierung[] {
  const zuege = pruefung.haltende;
  const pfeilfarbe = pruefung.grund === "patt" ? "rot" : "gold";
  return [
    ...(lage?.zwischen ?? []).map((feld): Markierung => ({
      typ: "feld",
      farbe: "grau",
      feld: feldname(feld),
    })),
    ...zuege.map((z): Markierung => ({ typ: "feld", farbe: "gold", feld: feldname(z.zug.to) })),
    ...pruefung.stattdessen.map((z): Markierung => ({
      typ: "pfeil",
      farbe: pfeilfarbe,
      von: feldname(z.zug.from),
      nach: feldname(z.zug.to),
    })),
  ];
}

/** Fazit: wer die Opposition hat, welche Züge sie halten, oder was stattdessen entscheidet. */
function fazit(stellung: Stellung, lage: Opposition | null, pruefung: Oppositionspruefung): string {
  if (lage) return t("opposition.fazitHat", { farbe: farbname(gegner(stellung.amZug)) });
  const hinweis = hinweistext(stellung, pruefung);
  if (hinweis) return hinweis;
  if (pruefung.haltende.length === 0) return t("opposition.fazitKeine");
  return t("opposition.fazitNehmen", {
    farbe: farbname(stellung.amZug),
    zuege: aufzaehlung(pruefung.haltende.map((z) => zugtext(z.san))),
  });
}

/**
 * Prüft die Opposition der Könige.
 *
 * Warum: „Die Opposition hat also der Spieler, der nicht am Zug ist“ und „nur der Zug, der die
 * Opposition nimmt, gewinnt“ (Abb. 8.23, 8.24). Eingaben: Stellung. Ausgabe: Lage und Züge.
 * Beispiel: Abb. 8.19 (Weiß am Zug): direkte Opposition auf der e-Linie, Schwarz hat sie, kein
 * weißer Zug nimmt sie. Abb. 8.23: nur Kf3 (Kf1 nimmt auch die Opposition, hält aber nur remis).
 * Sonderfall: Hält kein Oppositionszug das Ergebnis, nennt das Werkzeug, was entscheidet
 * (Abb. 8.31 Patt, 8.36 Quadrat, 8.53 Reserve-Tempo).
 */
export function opposition(stellung: Stellung): Werkzeugergebnis {
  const lage = oppositionDerStellung(stellung);
  const geprueft = pruefeOpposition(stellung);
  const pruefung = { ...geprueft, haltende: sortiert(geprueft.haltende) };
  const befunde: Befund[] = [
    {
      kennung: "lage",
      art: "E",
      titel: t("opposition.lageTitel"),
      zeilen: lagezeilen(stellung, lage),
      farbe: "grau",
    },
    {
      kennung: "zuege",
      art: pruefung.art === "bauernverlust" ? "N" : "E",
      titel: t("opposition.zuegeTitel", { farbe: farbname(stellung.amZug) }),
      zeilen: zugzeilen(stellung, pruefung),
      farbe: "gold",
    },
  ];
  return {
    werkzeug: "k8-opposition",
    art: "E",
    ueberschrift: t("opposition.titel"),
    befunde,
    fazit: fazit(stellung, lage, pruefung),
    markierungen: markierungen(lage, pruefung),
    stufen: [["lage"], ["lage", "zuege"], ["lage", "zuege"]],
    regel: t("werkzeug.k8-opposition.regel"),
  };
}

/** Das Werkzeug k8-opposition in der gemeinsamen Form aller Werkzeuge (Konzept 7.1). */
export const k8Opposition: Werkzeug = {
  id: "k8-opposition",
  kapitel: 8,
  name: "werkzeug.k8-opposition.name",
  regel: "werkzeug.k8-opposition.regel",
  erklaerung: "werkzeug.k8-opposition.erklaerung",
  art: "E",
  braucht: ["stellung"],
  berechne: ({ stellung }) => opposition(stellung),
};

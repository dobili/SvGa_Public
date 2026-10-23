/**
 * Werkzeug k5-bauern: Leitfrage 2 des Skelett-Röntgens. Deckungstest für jeden Bauern, Lage auf
 * offenen und halboffenen Linien, Bauerninseln.
 *
 * Rolle im Gesamtbild: Pflichtenheft 6.3 („Deckungstest für jeden Bauern: doppelt, rückständig,
 * isoliert, hängend, Kettenbasis ohne Stütze. Lage auf offener oder halboffener Linie. Zahl der
 * Bauerninseln je Seite. Rot: schwache Bauern mit Kurzbezeichnung. Grau: offene und halboffene
 * Linien.“).
 * Abhängigkeiten: analyse/stellungsprofil.ts (Bauernprofil, Bauernschwächen),
 * schach/skelettfiguren.ts (schwache Bauern mit Art), i18n.
 * Buchbezug: Kapitel 5, „Leitfrage 2: Bauern“ mit der Tabelle der Bauernschwächen; kalibriert an
 * den Bauern-Zeilen der Skelettbilanzen (Bauerninseln, Deckungstest).
 */
import type { Color } from "chessops/types";
import { t, tZahl, type Textschluessel } from "../i18n/sprache";
import type { Bauernprofil } from "../schach/bauernprofil";
import type { Bauernschwaechen } from "../schach/bauernschwaechen";
import { schwacheMitArt, type Schwaeche, type SchwacherBauer } from "../schach/skelettfiguren";
import { feldAusName, feldname, gegner, type Stellung } from "../schach/stellung";
import { felderText, linienname } from "./skelett";
import { profil, type Stellungsprofil } from "./stellungsprofil";
import { farbname } from "./texte";
import type { Befund, Markierung, Werkzeug, Werkzeugergebnis } from "./werkzeug";

/**
 * Kurzbezeichnungen am Brett (Pflichtenheft 6.3), in der Reihenfolge der Buchtabelle; die
 * Buchstaben stehen in der Sprachdatei (Englisch: backward B, chain base C, seit 0.2.104).
 */
const KUERZEL: Readonly<Record<Schwaeche, Textschluessel>> = {
  doppel: "bauern.kuerzel.doppel",
  rueck: "bauern.kuerzel.rueck",
  isolani: "bauern.kuerzel.isolani",
  haengend: "bauern.kuerzel.haengend",
  basis: "bauern.kuerzel.basis",
  ungesund: "bauern.kuerzel.ungesund",
};
const REIHEN = 8;

function zeilen(
  farbe: Color,
  p: Bauernprofil,
  s: Bauernschwaechen,
  liste: readonly SchwacherBauer[],
): string[] {
  const ergebnis: string[] = [];
  if (liste.length === 0) ergebnis.push(t("bauern.gesund"));
  for (const schwacher of liste) {
    ergebnis.push(
      t("bauern.schwach", {
        feld: feldname(schwacher.feld),
        art: t(`bauern.art.${schwacher.art}`),
      }),
    );
  }
  ergebnis.push(
    p.inseln.length === 1 ? t("bauern.insel") : t("bauern.inseln", { anzahl: p.inseln.length }),
  );
  if (s.freibauern.length > 0) {
    ergebnis.push(
      tZahl("bauern.freibauern", s.freibauern.length, {
        felder: felderText(s.freibauern.map((f) => f.feld)),
      }),
    );
  }
  if (p.offeneLinien.length > 0 || p.halboffeneLinien.length > 0) {
    ergebnis.push(
      t("bauern.linien", {
        offen:
          p.offeneLinien.length > 0 ? p.offeneLinien.map(linienname).join(", ") : t("bauern.keine"),
        farbe: farbname(farbe),
        halb:
          p.halboffeneLinien.length > 0
            ? p.halboffeneLinien.map(linienname).join(", ")
            : t("bauern.keine"),
      }),
    );
  } else ergebnis.push(t("bauern.linienKeine"));
  return ergebnis;
}

/**
 * Rot die eigenen schwachen Bauern mit Kürzel, gold die des Gegners (Ziele, wie bei den
 * Warnsignalen), grau die leeren Felder offener und halboffener Linien der eigenen Seite.
 */
function markierungen(
  stellung: Stellung,
  p: Bauernprofil,
  liste: readonly SchwacherBauer[],
  seine: readonly SchwacherBauer[],
): Markierung[] {
  const mitKuerzel = (s: SchwacherBauer, farbe: "rot" | "gold"): Markierung => ({
    typ: "feld",
    farbe,
    feld: feldname(s.feld),
    text: t(KUERZEL[s.art]),
  });
  const rot: Markierung[] = [
    ...liste.map((s) => mitKuerzel(s, "rot")),
    ...seine.map((s) => mitKuerzel(s, "gold")),
  ];
  const grau: Markierung[] = [];
  for (const linie of [...p.offeneLinien, ...p.halboffeneLinien]) {
    for (let reihe = 1; reihe <= REIHEN; reihe += 1) {
      const name = `${"abcdefgh".charAt(linie)}${reihe}`;
      const nr = feldAusName(name);
      if (nr !== null && stellung.brett.get(nr) === undefined)
        grau.push({ typ: "feld", farbe: "grau", feld: name });
    }
  }
  return [...grau, ...rot];
}

function befundFuer(p: Stellungsprofil, farbe: Color): { befund: Befund; liste: SchwacherBauer[] } {
  const bp = p.bauernprofil(farbe);
  const s = p.bauernschwaechen(farbe);
  const liste = schwacheMitArt(s, bp);
  return {
    befund: {
      kennung: farbe,
      art: "E",
      titel: t("bauern.seite", { farbe: farbname(farbe) }),
      zeilen: zeilen(farbe, bp, s, liste),
      farbe: null,
    },
    liste,
  };
}

/**
 * Die schwachen Bauern des Gegners als Ziele der gewählten Seite (R41: Die Karte erklärt nur die
 * gewählte Seite; seine Inseln und Linien zeigt der Sicht-Schalter).
 * Beispiel: Abb. 5.17 aus Sicht von Schwarz: „Ziele bei Weiß: d4: Isolani“.
 */
function zielbefund(p: Stellungsprofil, farbe: Color): { befund: Befund; liste: SchwacherBauer[] } {
  const liste = schwacheMitArt(p.bauernschwaechen(farbe), p.bauernprofil(farbe));
  const zeilenZiele =
    liste.length === 0
      ? [t("bauern.keineZiele")]
      : liste.map((schwacher) =>
          t("bauern.schwach", {
            feld: feldname(schwacher.feld),
            art: t(`bauern.art.${schwacher.art}`),
          }),
        );
  return {
    befund: {
      kennung: farbe,
      art: "E",
      titel: t("bauern.ziele", { farbe: farbname(farbe) }),
      zeilen: zeilenZiele,
      farbe: "gold",
    },
    liste,
  };
}

/**
 * Beantwortet Leitfrage 2 für die gewählte Seite, dazu die Ziele beim Gegner.
 *
 * Warum: „Welche Bauern kann kein Bauer mehr decken?“ (Kapitel 5). Eingaben: Stellung, eigene
 * Seite. Ausgabe: der Befund der eigenen Seite (Deckungstest, Inseln, Linien) und die schwachen
 * Bauern des Gegners als Ziele. Beispiel: Abb. 5.17 aus Sicht von Weiß: „d4: Isolani“, drei
 * Bauerninseln; „Ziele bei Schwarz: keine“.
 */
export function bauern(stellung: Stellung, eigen: Color): Werkzeugergebnis {
  const p = profil(stellung);
  const mein = befundFuer(p, eigen);
  const sein = zielbefund(p, gegner(eigen));
  return {
    werkzeug: "k5-bauern",
    art: "E",
    ueberschrift: t("bauern.titel"),
    befunde: [mein.befund, sein.befund],
    fazit: t("bauern.fazit", {
      eigen: farbname(eigen),
      anzahl: mein.liste.length,
      gegner: farbname(gegner(eigen)),
      anzahlGegner: sein.liste.length,
    }),
    markierungen: markierungen(stellung, p.bauernprofil(eigen), mein.liste, sein.liste),
    stufen: [[eigen], [eigen, gegner(eigen)], [eigen, gegner(eigen)]],
    regel: t("werkzeug.k5-bauern.regel"),
  };
}

/** Das Werkzeug k5-bauern in der gemeinsamen Form aller Werkzeuge (Konzept 7.1). */
export const k5Bauern: Werkzeug = {
  id: "k5-bauern",
  kapitel: 5,
  name: "werkzeug.k5-bauern.name",
  regel: "werkzeug.k5-bauern.regel",
  erklaerung: "werkzeug.k5-bauern.erklaerung",
  art: "E",
  braucht: ["stellung"],
  berechne: ({ stellung, perspektive }) => bauern(stellung, perspektive),
};

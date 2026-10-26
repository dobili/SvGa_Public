/**
 * Werkzeug k2-eroeffnung: erkennt Eröffnung und Variante aus den Buchvarianten, auch nach
 * Zugumstellung, und zeigt eine eigene Kurzfassung und den Abschnitt im Buch statt des
 * Steckbriefs (Entscheidung des Autors vom 15.10.2026: keine wörtlichen Buchtexte; wo kein
 * Werkzeug rechnet, eine knappe Zusammenfassung).
 *
 * Steht die Stellung nicht im Buch, nennt das Werkzeug den üblichen Namen aus der freien
 * Eröffnungsliste von Lichess („Nicht im Buch – bekannt als …“; Vorschlag G, Entscheidung des
 * Autors vom 15.10.2026); hat die Partie die bekannten Wege verlassen, die letzte benannte
 * Stellung davor.
 *
 * Rolle im Gesamtbild: Pflichtenheft 6.2 („Name der Eröffnung und Variante aus den
 * Buchvarianten, auch nach Zugumstellung über den Stellungsvergleich. Sprung zum passenden
 * Steckbrief.“), Art E. Ohne Markierungen am Brett.
 * Abhängigkeiten: schach/eroeffnungsindex.ts, schach/eroeffnungsnamen.ts, schach/notation.ts, i18n.
 * Buchbezug: Kapitel 2 (Steckbriefe, Abschnitt 2.12 „Zugumstellungen“), Kapitel 3 (Gambits).
 */
import { sprache, t, type Textschluessel } from "../i18n/sprache";
import {
  stellungsschluessel,
  type Eroeffnungseintrag,
  type Eroeffnungsindex,
} from "../schach/eroeffnungsindex";
import { bekannteEroeffnung, type Fundstelle } from "../schach/eroeffnungsnamen";
import { sanInSprache } from "../schach/notation";
import type { Verlauf } from "../schach/todsuenden";
import type { Stellung } from "../schach/stellung";
import { aufzaehlung } from "./texte";
import type { Befund, Werkzeug, Werkzeugergebnis } from "./werkzeug";

/** So viele Halbzüge hat ein voller Zug. */
const HALBZUEGE_JE_ZUG = 2;

/** „1. e4 e5 2. Sf3 Sc6 3. Lb5“ aus den englischen Zügen ab der Grundstellung. */
function zugfolge(zuege: readonly string[]): string {
  return zuege
    .map((zug, i) => {
      const text = sanInSprache(zug, sprache());
      return i % HALBZUEGE_JE_ZUG === 0 ? `${i / HALBZUEGE_JE_ZUG + 1}. ${text}` : text;
    })
    .join(" ");
}

/**
 * Die eigene Kurzfassung je Steckbrief, nach dem Namen des Steckbriefs im Buch, deutsch und
 * englisch (Buchdaten /daten/en/, P6). Neue Steckbriefe fallen im Test auf (k2-eroeffnung.test.ts),
 * damit keiner ohne Kurzfassung bleibt.
 */
export const KURZFASSUNGEN: Readonly<Record<string, Textschluessel>> = {
  "Spanische Partie": "eroeffnung.kurz.spanisch",
  "Italienische Partie": "eroeffnung.kurz.italienisch",
  "Schottische Partie": "eroeffnung.kurz.schottisch",
  "Russische Verteidigung (Petroff)": "eroeffnung.kurz.russisch",
  "Sizilianische Verteidigung": "eroeffnung.kurz.sizilianisch",
  Damengambit: "eroeffnung.kurz.damengambit",
  "London-System": "eroeffnung.kurz.london",
  "Trompowsky-Eröffnung": "eroeffnung.kurz.trompowsky",
  "Französische Verteidigung": "eroeffnung.kurz.franzoesisch",
  "Caro-Kann-Verteidigung": "eroeffnung.kurz.carokann",
  "Königsindische Verteidigung": "eroeffnung.kurz.koenigsindisch",
  "Zweispringerspiel und Läuferspiel": "eroeffnung.kurz.zweispringer",
  "Nimzo-Indische Verteidigung": "eroeffnung.kurz.nimzoindisch",
  "Ruy Lopez": "eroeffnung.kurz.spanisch",
  "Italian Game": "eroeffnung.kurz.italienisch",
  "Scotch Game": "eroeffnung.kurz.schottisch",
  "Petrov Defense (Russian Game)": "eroeffnung.kurz.russisch",
  "Sicilian Defense": "eroeffnung.kurz.sizilianisch",
  "Queen's Gambit": "eroeffnung.kurz.damengambit",
  "London System": "eroeffnung.kurz.london",
  "Trompowsky Attack": "eroeffnung.kurz.trompowsky",
  "French Defense": "eroeffnung.kurz.franzoesisch",
  "Caro-Kann Defense": "eroeffnung.kurz.carokann",
  "King's Indian Defense": "eroeffnung.kurz.koenigsindisch",
  "Two Knights Defense and Bishop's Opening": "eroeffnung.kurz.zweispringer",
  "Nimzo-Indian Defense": "eroeffnung.kurz.nimzoindisch",
};

/**
 * Der beste Eintrag einer Eröffnung: Hauptvariante vor Nebenweg, dann der kürzeste Weg.
 * So nennt die App für eine Stellung die Zugfolge, auf der das Buch sie zeigt.
 */
function besterEintrag(eintraege: readonly Eroeffnungseintrag[]): Eroeffnungseintrag | undefined {
  return [...eintraege].sort(
    (a, b) => Number(b.hauptvariante) - Number(a.hauptvariante) || a.zuege.length - b.zuege.length,
  )[0];
}

function befundEroeffnung(e: Eroeffnungseintrag): Befund {
  return {
    kennung: "eroeffnung",
    art: "E",
    titel: e.name,
    zeilen: [
      t(e.hauptvariante ? "eroeffnung.hauptvariante" : "eroeffnung.nebenweg", {
        abschnitt: e.abschnitt,
      }),
      t("eroeffnung.zugfolge", { zuege: zugfolge(e.zuege) }),
    ],
    farbe: null,
    ...(e.abbildung
      ? {
          sprung: {
            text: t("eroeffnung.sprung", { abbildung: e.abbildung }),
            abbildung: e.abbildung,
          },
        }
      : {}),
  };
}

/**
 * Kurzfassung und Verweis auf den Steckbrief im Buch (Art V). Der Steckbrief selbst bleibt im
 * Buch. Beispiel: Spanische Partie → Kurzfassung, „Den ganzen Steckbrief findest du im Buch,
 * Abschnitt 2.2.“
 */
function befundSteckbrief(e: Eroeffnungseintrag): Befund[] {
  if (!e.steckbrief) return [];
  const kurz = KURZFASSUNGEN[e.steckbrief.name];
  const { abschnitt } = e.steckbrief;
  const verweis = abschnitt
    ? t("eroeffnung.steckbriefVerweis", { abschnitt })
    : t("eroeffnung.steckbriefVerweisOhne");
  return [
    {
      kennung: "steckbrief",
      art: "V",
      titel: t("eroeffnung.steckbrief"),
      zeilen: [...(kurz ? [t(kurz)] : []), verweis],
      farbe: null,
    },
  ];
}

/**
 * Eröffnung außerhalb des Buches (Art N: übliche Bezeichnung, kein Steckbrief).
 * Beispiel: Najdorf-Sizilianisch → „Nicht im Buch – bekannt als Sizilianische Verteidigung:
 * Najdorf Variation (B90).“
 */
function befundBekannt(fund: Fundstelle, verlauf: Verlauf | undefined): Befund {
  const { name, eco } = fund.eroeffnung;
  const bisher = verlauf ? verlauf.zuege.slice(0, fund.halbzuege) : [];
  const zeile = fund.genau
    ? t("eroeffnung.bekannt", { name, eco })
    : t("eroeffnung.bekanntBis", { name, eco, zuege: zugfolge(bisher) });
  return {
    kennung: "eroeffnung",
    art: "N",
    titel: t("eroeffnung.nichtImBuch"),
    zeilen: [zeile, t("eroeffnung.lichess")],
    farbe: null,
  };
}

function ergebnis(befunde: Befund[], fazit: string): Werkzeugergebnis {
  return {
    werkzeug: "k2-eroeffnung",
    art: "E",
    ueberschrift: t("eroeffnung.titel"),
    befunde,
    fazit,
    markierungen: [],
    stufen: [["eroeffnung"], ["eroeffnung", "steckbrief"], ["eroeffnung", "steckbrief"]],
    regel: t("werkzeug.k2-eroeffnung.regel"),
  };
}

/**
 * Sucht die Stellung in den Buchvarianten.
 *
 * Warum: Wer seine Eröffnung kennt, findet im Steckbrief Pläne und Fallen (Kapitel 2); eine
 * Stellung kann auch über eine andere Zugfolge entstehen (Abschnitt 2.12). Eingaben: Stellung,
 * Eröffnungsindex (null, solange er lädt), Verlauf bis zur Stellung. Ausgabe: Eröffnung,
 * Variante und Kurzfassung; „noch offen“, wenn die Stellung zu mehreren Eröffnungen gehört; ohne
 * Buchstellung der Name aus der Lichess-Liste, sonst „keine Buchstellung“.
 * Beispiel: Abb. 2.2 (nach 3. Lb5): „Spanische Partie“, Hauptvariante, Sprung zu Abb. 2.1.
 */
export function eroeffnung(
  stellung: Stellung,
  index: Eroeffnungsindex | undefined,
  verlauf?: Verlauf,
): Werkzeugergebnis {
  if (!index) return ergebnis([], t("eroeffnung.laedt"));
  const alle = index.stellungen.get(stellungsschluessel(stellung.fen)) ?? [];
  // Ein Gambit aus Kapitel 3 ist eine Abzweigung einer Eröffnung aus Kapitel 2 (Stafford aus der
  // Russischen Verteidigung): Gibt es Einträge mit Steckbrief, zählen nur diese.
  const mitSteckbrief = alle.filter((e) => e.steckbrief !== null);
  const eintraege = mitSteckbrief.length > 0 ? mitSteckbrief : alle;
  const namen = [...new Set(eintraege.map((e) => e.name))];
  if (namen.length === 0) {
    const fund = index.bekannte ? bekannteEroeffnung(index.bekannte, stellung.fen, verlauf) : null;
    if (!fund) return ergebnis([], t("eroeffnung.keine"));
    return ergebnis(
      [befundBekannt(fund, verlauf)],
      t("eroeffnung.bekanntFazit", { name: fund.eroeffnung.name }),
    );
  }
  if (namen.length > 1) {
    return ergebnis(
      [
        {
          kennung: "eroeffnung",
          art: "E",
          titel: t("eroeffnung.offenTitel"),
          zeilen: namen,
          farbe: null,
        },
      ],
      t("eroeffnung.offen", { namen: aufzaehlung(namen) }),
    );
  }
  const bester = besterEintrag(eintraege);
  if (!bester) return ergebnis([], t("eroeffnung.keine"));
  return ergebnis(
    [befundEroeffnung(bester), ...befundSteckbrief(bester)],
    t("eroeffnung.fazit", { name: bester.name }),
  );
}

/** Das Werkzeug k2-eroeffnung in der gemeinsamen Form aller Werkzeuge (Konzept 7.1). */
export const k2Eroeffnung: Werkzeug = {
  id: "k2-eroeffnung",
  kapitel: 2,
  name: "werkzeug.k2-eroeffnung.name",
  regel: "werkzeug.k2-eroeffnung.regel",
  erklaerung: "werkzeug.k2-eroeffnung.erklaerung",
  art: "E",
  braucht: ["stellung", "eroeffnungen", "verlauf"],
  berechne: ({ stellung, eroeffnungen, verlauf }) => eroeffnung(stellung, eroeffnungen, verlauf),
};

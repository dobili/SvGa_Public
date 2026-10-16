/**
 * Werkzeug k8-elementarmatt: Der Kasten des einzelnen Königs, Mattzüge, Pattgefahr, Abwarte- und
 * Treibezüge beim Matt mit Dame, Turm oder zwei Läufern.
 *
 * Rolle im Gesamtbild: Pflichtenheft 6.3 („Elementarmatt: Kasten, Gegenüberstellung, Abwartezug.
 * Grau: Käfig, Rot: Pattgefahr“).
 * Abhängigkeiten: schach/elementarmatt.ts, i18n.
 * Buchbezug: Kapitel 8, Elementarmatt mit Dame (Kastenmethode, Abb. 8.4 bis 8.8), mit Turm
 * (Gegenüberstellung und Abwartezug, Abb. 8.9 bis 8.15) und mit zwei Läufern (Abb. 8.16 bis 8.18).
 */
import { t } from "../i18n/sprache";
import { elementarmatt, type Elementarmatt, type Mattzug } from "../schach/elementarmatt";
import { feldname, type Stellung } from "../schach/stellung";
import { aufzaehlung, farbname, zugtext } from "./texte";
import type { Befund, Markierung, Werkzeug, Werkzeugergebnis } from "./werkzeug";

/** „Dg7, Dh7 und Df8“ aus einer Zugliste. */
function zugliste(zuege: readonly Mattzug[]): string {
  return aufzaehlung(zuege.map((z) => zugtext(z.san)));
}

/** Zeilen zur Lage: Stand, Kasten, Gegenüberstellung. */
function lagezeilen(lage: Elementarmatt): string[] {
  const zeilen: string[] = [];
  if (lage.stand !== "offen") zeilen.push(t(`elementarmatt.${lage.stand}`));
  zeilen.push(
    t("elementarmatt.kasten", {
      koenig: feldname(lage.schwacherKoenig),
      anzahl: lage.kaefig.length,
      felder: aufzaehlung(lage.kaefig.map(feldname)),
    }),
  );
  if (lage.art === "turm" || lage.art === "dame") {
    zeilen.push(t(lage.gegenueber ? "elementarmatt.gegenueber" : "elementarmatt.nichtGegenueber"));
  }
  return zeilen;
}

/** Zeilen zu den Zügen der starken Seite, wenn sie am Zug ist. */
function zugzeilen(stellung: Stellung, lage: Elementarmatt): string[] {
  if (lage.stand !== "offen") return [];
  if (stellung.amZug !== lage.stark) {
    return [t("elementarmatt.schwachAmZug", { farbe: farbname(stellung.amZug) })];
  }
  const zeilen: string[] = [];
  // Steht ein Matt bereit, zählt nur noch das (und die Pattfalle daneben).
  if (lage.mattzuege.length > 0) {
    zeilen.push(t("elementarmatt.mattzuege", { zuege: zugliste(lage.mattzuege) }));
    if (lage.pattzuege.length > 0) {
      zeilen.push(t("elementarmatt.pattzuege", { zuege: zugliste(lage.pattzuege) }));
    }
    return zeilen;
  }
  if (lage.mattzuege.length > 0)
    zeilen.push(t("elementarmatt.mattzuege", { zuege: zugliste(lage.mattzuege) }));
  if (lage.pattzuege.length > 0)
    zeilen.push(t("elementarmatt.pattzuege", { zuege: zugliste(lage.pattzuege) }));
  if (lage.sperrzuege.length > 0) {
    zeilen.push(t("elementarmatt.sperrzuege", { zuege: zugliste(lage.sperrzuege) }));
  }
  if (lage.treibezuege.length > 0) {
    zeilen.push(t("elementarmatt.treibezuege", { zuege: zugliste(lage.treibezuege) }));
  }
  if (lage.abwartezuege.length > 0) {
    zeilen.push(t("elementarmatt.abwartezuege", { zuege: zugliste(lage.abwartezuege) }));
  }
  if (
    lage.mattzuege.length === 0 &&
    lage.treibezuege.length === 0 &&
    lage.sperrzuege.length === 0
  ) {
    zeilen.push(t("elementarmatt.koenigNach"));
  }
  return zeilen;
}

/** Grau der Kasten und die Sperrzüge, Gold die Mattzüge, Rot die Pattzüge. */
function markierungen(lage: Elementarmatt): Markierung[] {
  const pfeil = (farbe: "gold" | "rot" | "grau", z: Mattzug): Markierung => ({
    typ: "pfeil",
    farbe,
    von: feldname(z.zug.from),
    nach: feldname(z.zug.to),
  });
  return [
    ...lage.kaefig.map((feld): Markierung => ({
      typ: "feld",
      farbe: "grau",
      feld: feldname(feld),
    })),
    ...lage.mattzuege.map((z) => pfeil("gold", z)),
    ...lage.pattzuege.map((z) => pfeil("rot", z)),
    ...lage.sperrzuege.map((z) => pfeil("grau", z)),
  ];
}

/** Fazit: Matt, Patt, Mattzug, Pattgefahr oder die Größe des Kastens. */
function fazit(lage: Elementarmatt): string {
  if (lage.stand !== "offen") return t(`elementarmatt.${lage.stand}`);
  if (lage.mattzuege.length > 0)
    return t("elementarmatt.fazitMatt", { zuege: zugliste(lage.mattzuege) });
  if (lage.pattzuege.length > 0)
    return t("elementarmatt.fazitPatt", { zuege: zugliste(lage.pattzuege) });
  return t("elementarmatt.fazitKasten", { anzahl: lage.kaefig.length });
}

/** Ergebnis, wenn kein Elementarmatt vorliegt. */
function keins(): Werkzeugergebnis {
  return {
    werkzeug: "k8-elementarmatt",
    art: "E",
    ueberschrift: t("elementarmatt.titel"),
    befunde: [
      {
        kennung: "keins",
        art: "E",
        titel: t("elementarmatt.keinsTitel"),
        zeilen: [t("elementarmatt.keins")],
        farbe: null,
      },
    ],
    fazit: t("elementarmatt.keins"),
    markierungen: [],
    stufen: [["keins"], ["keins"], ["keins"]],
    regel: t("werkzeug.k8-elementarmatt.regel"),
  };
}

/**
 * Beschreibt ein Elementarmatt: Kasten, Methode und die Züge der starken Seite.
 *
 * Warum: „Dame und König gewinnen gegen den einzelnen König immer, solange du ihn nicht patt
 * setzt und die Dame nicht einstellst.“ Eingabe: Stellung. Ausgabe: Lage, Methode, Züge.
 * Beispiel: Abb. 8.6 (Weiß am Zug): Mattzug Dg7#. Abb. 8.11: Abwartezüge Tf7, Tg7, Th7.
 * Abb. 8.57: Kb6 wäre Patt. Abb. 8.7: Patt.
 */
export function elementarmattWerkzeug(stellung: Stellung): Werkzeugergebnis {
  const lage = elementarmatt(stellung);
  if (!lage) return keins();
  const alle: Befund[] = [
    {
      kennung: "lage",
      art: "E",
      titel: t(`elementarmatt.art.${lage.art}`, { farbe: farbname(lage.stark) }),
      zeilen: lagezeilen(lage),
      farbe: "grau",
    },
    {
      kennung: "zuege",
      art: "E",
      titel: t("elementarmatt.zuegeTitel"),
      zeilen: zugzeilen(stellung, lage),
      farbe: lage.pattzuege.length > 0 ? "rot" : "gold",
    },
    {
      kennung: "methode",
      art: "V",
      titel: t("elementarmatt.methodeTitel"),
      zeilen: [t(`elementarmatt.methode.${lage.art}`)],
      farbe: null,
    },
  ];
  const befunde = alle.filter((b) => b.zeilen.length > 0);
  return {
    werkzeug: "k8-elementarmatt",
    art: "E",
    ueberschrift: t("elementarmatt.titel"),
    befunde,
    fazit: fazit(lage),
    markierungen: markierungen(lage),
    stufen: [["lage"], ["lage", "zuege"], ["lage", "zuege", "methode"]],
    regel: t("werkzeug.k8-elementarmatt.regel"),
  };
}

/** Das Werkzeug k8-elementarmatt in der gemeinsamen Form aller Werkzeuge (Konzept 7.1). */
export const k8Elementarmatt: Werkzeug = {
  id: "k8-elementarmatt",
  kapitel: 8,
  name: "werkzeug.k8-elementarmatt.name",
  regel: "werkzeug.k8-elementarmatt.regel",
  erklaerung: "werkzeug.k8-elementarmatt.erklaerung",
  art: "E",
  braucht: ["stellung"],
  berechne: ({ stellung }) => elementarmattWerkzeug(stellung),
};

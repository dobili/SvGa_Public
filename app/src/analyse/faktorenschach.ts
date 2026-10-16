/**
 * Faktorenbilanz im taktischen Augenblick: Matt, Patt und Schach der Seite am Zug.
 *
 * Rolle im Gesamtbild: Teil des Werkzeugs k3-faktorenbilanz. Entscheidung des Autors C1.6: Die
 * Faktorenbilanz des Buches ist für ruhige Stellungen gedacht. Ist die Seite am Zug matt oder
 * patt, gibt es nichts mehr abzuwägen; steht sie im Schach, kommt der Hinweis vor die Bilanz,
 * erst das Schach und die Taktik zu Ende zu rechnen.
 * Abhängigkeiten: schach/stellung.ts, i18n.
 * Buchbezug: Kapitel 3 (Abb. 3.23, 3.32, 3.60, 3.68, 3.69), Kapitel 1 (Schach-Röntgen-Regel) und
 * Kapitel 7 (Schritt 2: Schachs, Schläge, Drohungen).
 */
import { t } from "../i18n/sprache";
import { feldname, type Stellung } from "../schach/stellung";
import { farbname } from "./texte";
import type { Befund, Werkzeugergebnis } from "./werkzeug";

/**
 * Ist die Partie entschieden, weil die Seite am Zug matt oder patt ist? Dann gibt es nichts mehr
 * abzuwägen (C1.6, Entscheidung des Autors; Abb. 3.60 und 3.69: Weiß ist matt).
 */
export function entschieden(stellung: Stellung): "matt" | "patt" | null {
  if (stellung.regeln?.isCheckmate()) return "matt";
  if (stellung.regeln?.isStalemate()) return "patt";
  return null;
}

/** Das Ergebnis bei Matt oder Patt: nur der eine Satz, der König der Seite am Zug rot. */
export function entschiedenesErgebnis(stellung: Stellung, ende: "matt" | "patt"): Werkzeugergebnis {
  const satz = t(`faktoren.entschieden.${ende}`);
  const koenig = stellung.brett.kingOf(stellung.amZug);
  return {
    werkzeug: "k3-faktorenbilanz",
    art: "E",
    ueberschrift: t("faktoren.titel"),
    befunde: [
      {
        kennung: "entschieden",
        art: "E",
        titel: t("faktoren.entschiedenTitel"),
        zeilen: [satz],
        farbe: null,
      },
    ],
    fazit: satz,
    markierungen:
      koenig === undefined ? [] : [{ typ: "feld", farbe: "rot", feld: feldname(koenig) }],
    stufen: [["entschieden"], ["entschieden"], ["entschieden"]],
    regel: t("werkzeug.k3-faktorenbilanz.regel"),
  };
}

/**
 * Hinweis vor der Bilanz, wenn die Seite am Zug im Schach steht.
 *
 * Regel: C1.6 (Entscheidung des Autors): Die Faktorenbilanz des Buches ist für ruhige Stellungen
 * gedacht; im Schach entscheidet zuerst die Rechnung (Kapitel 1, Schach-Röntgen-Regel; Kapitel 7,
 * Schritt 2). Abb. 3.23 (Lb4+), 3.32 (Lb5+), 3.68 (Lxf2+).
 */
export function befundSchach(stellung: Stellung): Befund {
  return {
    kennung: "schach",
    art: "V",
    titel: t("faktoren.schachTitel", { farbe: farbname(stellung.amZug) }),
    zeilen: [t("faktoren.schach")],
    farbe: "rot",
  };
}

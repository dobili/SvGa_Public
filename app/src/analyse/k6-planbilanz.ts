/**
 * Werkzeug k6-planbilanz: die drei Planfragen für beide Seiten nebeneinander, dazu der Plan in
 * einem Satz und, wo das Buch eine Planbilanz hat, ein Verweis darauf. Den Text der Planbilanz
 * zeigt die App seit 0.2.27 nicht mehr (Entscheidung des Autors vom 15.10.2026: keine wörtlichen
 * Buchtexte in den Werkzeugen); das Werkzeug rechnet dieselben Fragen selbst.
 *
 * Rolle im Gesamtbild: Pflichtenheft 6.3 („Die drei Planfragen für beide Seiten nebeneinander.
 * Hervorhebungen wie Planfragen 1 bis 3. N, Buchstellungen V.“).
 * Abhängigkeiten: planfragen.ts, planlage.ts, k6-wo.ts, k6-lap.ts, daten (Bilanz), i18n.
 * Buchbezug: Kapitel 6, Planbilanz (Abb. 6.20) und Kapitel 11 (Abb. 11.34).
 */
import type { Color } from "chessops/types";
import type { Bilanz } from "../daten/generiert/kapitel";
import { t } from "../i18n/sprache";
import { gegner, type Stellung } from "../schach/stellung";
import { lap } from "./k6-lap";
import { wo } from "./k6-wo";
import {
  figurText,
  gegnerText,
  planSatz,
  sichernFelder,
  unruhigesErgebnis,
  woText,
} from "./planfragen";
import { planlage } from "./planlage";
import { felderText } from "./skelett";
import { profil } from "./stellungsprofil";
import { farbname } from "./texte";
import type { Befund, Werkzeug, Werkzeugergebnis } from "./werkzeug";

/**
 * Verweis auf die Planbilanz des Buches (Art V), damit der Leser die eigene Rechnung vergleicht.
 * Beispiel: Abb. 6.20 → „Vergleiche mit der Planbilanz im Buch bei Abb. 6.20.“
 */
function buchverweis(bilanz: Bilanz): Befund {
  const zeile = bilanz.abbildung
    ? t("planbilanz.buchVerweis", { abbildung: bilanz.abbildung })
    : t("planbilanz.buchVerweisOhneAbb");
  return {
    kennung: "buch",
    art: "V",
    titel: t("planbilanz.buchTitel"),
    zeilen: [zeile],
    farbe: null,
  };
}

/**
 * Die Planbilanz für beide Seiten.
 *
 * Eingaben: Stellung, eigene Seite (für die Markierungen; Weiß steht immer zuerst), Planbilanz
 * des Buches (freiwillig).
 * Ausgabe: je Planfrage ein Befund mit einer Zeile je Seite, der Plan in einem Satz je Seite,
 * der Verweis auf die Planbilanz des Buches. Beispiel: Abb. 6.20: Weiß Damenflügel (Kette
 * e4–d5, Hebel c4–c5 gegen d6), Schwarz Königsflügel (Hebel f7–f5 gegen e4); Figur: Läufer c1
 * und Läufer c8 zu Hause.
 */
export function planbilanz(stellung: Stellung, eigen: Color, bilanz?: Bilanz): Werkzeugergebnis {
  const p = profil(stellung);
  // In unruhiger Stellung (Schach, hängende Dame) nur der Hinweis und der Buchverweis (Abb. 6.32).
  const unruhig = unruhigesErgebnis(p, "k6-planbilanz", t("planbilanz.titel"), "N");
  if (unruhig)
    return { ...unruhig, befunde: [...unruhig.befunde, ...(bilanz ? [buchverweis(bilanz)] : [])] };
  // Wie die Tabelle im Buch: Weiß zuerst, gleich wer am Zug ist (Nachtest des Autors, 0.2.26).
  const seiten: readonly Color[] = ["white", "black"];
  const lagen = new Map(seiten.map((farbe) => [farbe, planlage(p, farbe)] as const));
  const lage = (farbe: Color) => lagen.get(farbe) ?? planlage(p, farbe);
  const zeile = (farbe: Color, inhalt: string) =>
    t("planbilanz.zeile", { farbe: farbname(farbe), text: inhalt });
  const befunde: Befund[] = [
    {
      kennung: "wo",
      art: "E",
      titel: t("planbilanz.wo"),
      zeilen: seiten.map((f) => zeile(f, woText(lage(f)))),
      farbe: null,
    },
    {
      kennung: "gegner",
      art: "N",
      titel: t("planbilanz.gegner"),
      zeilen: seiten.map((f) => {
        const sichern = sichernFelder(lage(f), lage(gegner(f)));
        const zusatz =
          sichern.length > 0
            ? t("planbilanz.sichern", { farbe: farbname(f), felder: felderText(sichern) })
            : "";
        return zeile(f, `${gegnerText(lage(gegner(f)))}${zusatz}`);
      }),
      farbe: null,
    },
    {
      kennung: "figur",
      art: "N",
      titel: t("planbilanz.figur"),
      zeilen: seiten.map((f) => zeile(f, figurText(p, f))),
      farbe: null,
    },
    {
      kennung: "plan",
      art: "N",
      titel: t("planbilanz.plan"),
      zeilen: seiten.map((f) => zeile(f, planSatz(p, f))),
      farbe: "gold",
    },
    ...(bilanz ? [buchverweis(bilanz)] : []),
  ];
  const kennungen = befunde.map((b) => b.kennung);
  return {
    werkzeug: "k6-planbilanz",
    art: "N",
    ueberschrift: t("planbilanz.titel"),
    befunde,
    fazit: zeile(eigen, planSatz(p, eigen)),
    markierungen: [...wo(stellung, eigen).markierungen, ...lap(stellung, eigen).markierungen],
    stufen: [["wo", "gegner", "figur"], kennungen, kennungen],
    regel: t("werkzeug.k6-planbilanz.regel"),
  };
}

/** Das Werkzeug k6-planbilanz in der gemeinsamen Form aller Werkzeuge (Konzept 7.1). */
export const k6Planbilanz: Werkzeug = {
  id: "k6-planbilanz",
  kapitel: 6,
  name: "werkzeug.k6-planbilanz.name",
  regel: "werkzeug.k6-planbilanz.regel",
  erklaerung: "werkzeug.k6-planbilanz.erklaerung",
  art: "N",
  braucht: ["stellung", "bilanz"],
  berechne: ({ stellung, perspektive, bilanz }) => planbilanz(stellung, perspektive, bilanz),
};

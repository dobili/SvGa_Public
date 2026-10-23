/**
 * Werkzeug k5-felder: Leitfrage 1 des Skelett-Röntgens. Löcher beider Seiten, sichere Felder und
 * Springerfelder, Zustand des Königsflügels.
 *
 * Rolle im Gesamtbild: Pflichtenheft 6.3 („Löcher beider Seiten (Felder, die kein Bauer mehr
 * kontrollieren kann), Vorposten, Zustand des Königsflügels (Haken, Löcher, Grundreihe). Rot:
 * eigene Löcher. Gold: gegnerische Löcher, besetzbar.“).
 * Abhängigkeiten: analyse/skelett.ts (schach/skelettfelder.ts), i18n.
 * Buchbezug: Kapitel 5, „Leitfrage 1: Felder“ und die Checkliste dazu; kalibriert an den
 * Felder-Zeilen der Skelettbilanzen.
 */
import type { Color } from "chessops/types";
import { t } from "../i18n/sprache";
import type { Felderbefund, Koenigsfluegel } from "../schach/skelettfelder";
import { feldname, type Stellung } from "../schach/stellung";
import { felderFuer, felderText } from "./skelett";
import { profil } from "./stellungsprofil";
import { farbname, figurenname } from "./texte";
import type { Befund, Markierung, Werkzeug, Werkzeugergebnis } from "./werkzeug";

/** Zeilen zu den eigenen Löchern einer Seite. */
function lochzeilen(f: Felderbefund): string[] {
  const nutzbare = f.eigeneLoecher.filter((l) => l.nutzbar);
  if (nutzbare.length === 0) return [t("felder.keineLoecher")];
  return nutzbare.map((loch) =>
    t("felder.loch", {
      feld: feldname(loch.feld),
      zusatz: loch.besetztVon ? t("felder.besetzt", { figur: figurenname(loch.besetztVon) }) : "",
    }),
  );
}

/** Zeilen zu den sicheren Feldern und Springerfeldern einer Seite. */
function feldzeilen(f: Felderbefund): string[] {
  const zeilen = f.sichere.map((s) =>
    t("felder.sicher", {
      feld: feldname(s.feld),
      stuetze: s.gestuetzt ? t("felder.gestuetzt") : "",
      besetzt: s.besetztVon ? t("felder.besetztVon", { figur: figurenname(s.besetztVon) }) : "",
      erreichbar:
        s.erreichbar.length > 0 ? t("felder.erreichbar", { felder: felderText(s.erreichbar) }) : "",
    }),
  );
  for (const sf of f.springerfelder) {
    zeilen.push(
      t("felder.springerfeld", { feld: feldname(sf.feld), bauer: feldname(sf.angreifbarDurch) }),
    );
  }
  return zeilen.length > 0 ? zeilen : [t("felder.keineSicheren")];
}

/** Zeilen zum Königsflügel. */
function koenigszeilen(k: Koenigsfluegel | null): string[] {
  if (!k) return [t("felder.koenig.nichtRochiert")];
  const zeilen: string[] = k.luftloecher.map((l) =>
    t("felder.koenig.luftlochFeld", { bauer: feldname(l.bauer), feld: feldname(l.fluchtfeld) }),
  );
  if (k.haken.length > 0) zeilen.push(t("felder.koenig.haken", { felder: felderText(k.haken) }));
  if (k.loecher.length > 0)
    zeilen.push(t("felder.koenig.loecher", { felder: felderText(k.loecher) }));
  if (k.grundreihenschwaeche) zeilen.push(t("felder.koenig.grundreihe"));
  else if (k.ohneLuftloch) zeilen.push(t("felder.koenig.luftloch"));
  return zeilen.length > 0 ? zeilen : [t("felder.koenig.dicht")];
}

/** Rot die eigenen nutzbaren Löcher, Gold die eigenen sicheren Felder (Löcher des Gegners). */
function markierungen(f: Felderbefund): Markierung[] {
  const feld = (nr: number, farbe: "rot" | "gold"): Markierung => ({
    typ: "feld",
    farbe,
    feld: feldname(nr),
  });
  return [
    ...f.eigeneLoecher.filter((l) => l.nutzbar).map((l) => feld(l.feld, "rot")),
    // Gold nur, was besetzbar ist (Pflichtenheft 6.3): gestützt oder mit einem Zug erreichbar.
    ...f.sichere
      .filter((s) => s.gestuetzt || s.erreichbar.length > 0)
      .map((s) => feld(s.feld, "gold")),
    ...f.springerfelder.map((s) => feld(s.feld, "gold")),
  ];
}

/**
 * Beantwortet Leitfrage 1 für die gewählte Seite.
 *
 * Warum: „Welche Felder kann kein Bauer mehr kontrollieren – bei mir und beim Gegner? Kann ich
 * ein gegnerisches Loch mit einer Figur besetzen? Ist mein Königsflügel dicht?“ (Kapitel 5).
 * „Bei mir“ sind die eigenen Löcher, „beim Gegner“ die eigenen starken Felder; die Sicht des
 * Gegners zeigt der Sicht-Schalter (R41, seit 23.10.2026 kein vierter Befund mehr).
 * Eingaben: Stellung, eigene Seite. Ausgabe: drei Befunde (eigene Löcher, starke Felder,
 * Königsflügel). Beispiel: Abb. 5.8 (Najdorf): Weiß hat das starke Feld d5, gestützt von e4,
 * erreichbar für den Springer c3; in der Sicht von Schwarz ist d5 sein Loch.
 */
export function felder(stellung: Stellung, eigen: Color): Werkzeugergebnis {
  const p = profil(stellung);
  const mein = felderFuer(p, eigen);
  const befunde: Befund[] = [
    {
      kennung: "loecher",
      art: "E",
      titel: t("felder.loecher", { farbe: farbname(eigen) }),
      zeilen: lochzeilen(mein),
      farbe: "rot",
    },
    {
      kennung: "sichere",
      art: "E",
      titel: t("felder.sichere", { farbe: farbname(eigen) }),
      zeilen: feldzeilen(mein),
      farbe: "gold",
    },
    {
      kennung: "koenig",
      art: "E",
      titel: t("felder.koenig", { farbe: farbname(eigen) }),
      zeilen: koenigszeilen(mein.koenigsfluegel),
      farbe: null,
    },
  ];
  const nutzbar = (f: Felderbefund) => f.eigeneLoecher.filter((l) => l.nutzbar).length;
  return {
    werkzeug: "k5-felder",
    art: "E",
    ueberschrift: t("felder.titel"),
    befunde,
    fazit: t("felder.fazit", {
      eigen: farbname(eigen),
      anzahlEigene: nutzbar(mein),
      anzahlStarke: mein.sichere.length + mein.springerfelder.length,
    }),
    markierungen: markierungen(mein),
    stufen: [
      ["loecher", "sichere"],
      ["loecher", "sichere", "koenig"],
      ["loecher", "sichere", "koenig"],
    ],
    regel: t("werkzeug.k5-felder.regel"),
  };
}

/** Das Werkzeug k5-felder in der gemeinsamen Form aller Werkzeuge (Konzept 7.1). */
export const k5Felder: Werkzeug = {
  id: "k5-felder",
  kapitel: 5,
  name: "werkzeug.k5-felder.name",
  regel: "werkzeug.k5-felder.regel",
  erklaerung: "werkzeug.k5-felder.erklaerung",
  art: "E",
  braucht: ["stellung"],
  berechne: ({ stellung, perspektive }) => felder(stellung, perspektive),
};

/**
 * Werkzeug k9-turmbegriffe: Abschneiden, Schachdistanz, kurze und lange Seite im Turmendspiel.
 *
 * Rolle im Gesamtbild: Pflichtenheft 6.3 („Abschneiden, Schachdistanz (mindestens drei Linien
 * zwischen Turm und Bauer), kurze und lange Seite. E“). Grau: die Sperrlinie und die
 * Schachdistanz; der verteidigende König und Turm gold, wenn sie richtig stehen, sonst rot.
 * Seit den Entscheidungen des Autors vom 16.10.2026: Steht der verteidigende König vor dem Bauern
 * (Philidor), gelten Schachdistanz und kurze/lange Seite nicht (C1.24, Abb. 9.3, 9.4); die drei
 * Begriffe und der Vancura-Hinweis gelten nur mit höchstens einem Bauern am Brett, sonst verweist
 * das Werkzeug auf das Erkennungsbild (C1.25, Abb. 9.23, 9.25, 9.26).
 * Abhängigkeiten: schach/turmendspiel.ts, schach/erkennungsbilder.ts, i18n.
 * Buchbezug: Kapitel 9, „Dein Werkzeug: drei Begriffe für jedes Turmendspiel“ (Abb. 9.1, 9.2),
 * „Die Philidor-Stellung“ (Abb. 9.3, 9.4).
 */
import type { Color } from "chessops/types";
import { squareFile, squareRank } from "chessops/util";
import { t, type Textschluessel } from "../i18n/sprache";
import { erkennungsbild } from "../schach/erkennungsbilder";
import { feldname, type Stellung } from "../schach/stellung";
import {
  ABSCHNEIDEN_GEWINN_LINIEN,
  philidorMoeglich,
  philidorTurmRichtig,
  SCHACHDISTANZ_LINIEN,
  turmlage,
  type Turmlage,
} from "../schach/turmendspiel";

/** Höchstens so viele Bauern am Brett: Turm und ein Bauer gegen Turm (C1.25). */
const HOECHSTENS_BAUERN = 1;
import { farbname, linienzahl } from "./texte";
import type { Befund, Markierung, Werkzeug, Werkzeugergebnis } from "./werkzeug";

/** Zeilen zum Abschneiden. */
function abschneidenZeilen(lage: Turmlage): string[] {
  const a = lage.abschneiden;
  if (!a) {
    return [t("turmbegriffe.abschneiden.nein", { koenig: feldname(lage.koenigVerteidiger) })];
  }
  if (a.richtung === "reihe") {
    return [
      t("turmbegriffe.abschneiden.reihe", {
        turm: feldname(a.turm),
        koenig: feldname(a.koenig),
        reihe: squareRank(a.turm) + 1,
      }),
    ];
  }
  return [
    t("turmbegriffe.abschneiden.ja", {
      turm: feldname(a.turm),
      koenig: feldname(a.koenig),
      dazwischen: linienzahl(a.dazwischen),
    }),
    t(
      a.dazwischen >= ABSCHNEIDEN_GEWINN_LINIEN
        ? "turmbegriffe.abschneiden.reicht"
        : "turmbegriffe.abschneiden.wenig",
    ),
  ];
}

/** Zeilen zur Schachdistanz des verteidigenden Turms. */
function distanzZeilen(lage: Turmlage): string[] {
  const d = lage.schachdistanz;
  if (!d || lage.turmVerteidiger === null) return [t("turmbegriffe.schachdistanz.keinTurm")];
  return [
    t("turmbegriffe.schachdistanz.linien", {
      turm: feldname(lage.turmVerteidiger),
      bauer: feldname(lage.bauer),
      linien: linienzahl(d.linien),
      soll: linienzahl(SCHACHDISTANZ_LINIEN),
    }),
    t(d.reicht ? "turmbegriffe.schachdistanz.reicht" : "turmbegriffe.schachdistanz.zuNah"),
  ];
}

/** Zeilen zu kurzer und langer Seite. */
function seitenZeilen(lage: Turmlage): string[] {
  const { seiten } = lage;
  if (lage.turmAngreifer === null || lage.turmVerteidiger === null) {
    return [t("turmbegriffe.seiten.nurEinTurm")];
  }
  if (seiten.links === 0 || seiten.rechts === 0) {
    return [t("turmbegriffe.seiten.rand", { bauer: feldname(lage.bauer) })];
  }
  const linie = squareFile(lage.bauer);
  const kurz =
    seiten.links < seiten.rechts ? "links" : seiten.rechts < seiten.links ? "rechts" : "gleich";
  const zeilen = [
    t(`turmbegriffe.seiten.${kurz}`, {
      bauer: feldname(lage.bauer),
      links: seiten.links,
      rechts: seiten.rechts,
      linieLinks: "abcdefgh"[Math.max(0, linie - 1)] ?? "",
      linieRechts: "abcdefgh"[Math.min(7, linie + 1)] ?? "",
    }),
    t(`turmbegriffe.koenigAuf.${seiten.koenigAuf ?? "bauernlinie"}`, {
      koenig: feldname(lage.koenigVerteidiger),
    }),
  ];
  if (lage.turmVerteidiger !== null) {
    zeilen.push(
      t(`turmbegriffe.turmAuf.${seiten.turmAuf ?? "bauernlinie"}`, {
        turm: feldname(lage.turmVerteidiger),
      }),
    );
  }
  return zeilen;
}

/** Grau Sperrlinie und Schachdistanz; König und Turm des Verteidigers gold oder rot. */
function markierungen(lage: Turmlage): Markierung[] {
  const marken: Markierung[] = [];
  if (lage.abschneiden) {
    marken.push({
      typ: "pfeil",
      farbe: "grau",
      von: feldname(lage.abschneiden.von),
      nach: feldname(lage.abschneiden.bis),
    });
  }
  if (lage.turmVerteidiger !== null && lage.schachdistanz) {
    const ziel = squareRank(lage.turmVerteidiger) * 8 + squareFile(lage.bauer);
    if (ziel !== lage.turmVerteidiger) {
      marken.push({
        typ: "pfeil",
        farbe: "grau",
        von: feldname(lage.turmVerteidiger),
        nach: feldname(ziel),
      });
    }
    marken.push({
      typ: "feld",
      farbe: lage.schachdistanz.reicht && lage.seiten.turmAuf !== "kurz" ? "gold" : "rot",
      feld: feldname(lage.turmVerteidiger),
    });
  }
  const koenigGut =
    lage.seiten.koenigAuf === "kurz" ||
    lage.seiten.koenigAuf === "gleich" ||
    lage.seiten.koenigAuf === null;
  marken.push({
    typ: "feld",
    farbe: koenigGut ? "gold" : "rot",
    feld: feldname(lage.koenigVerteidiger),
  });
  return marken;
}

/**
 * Philidor (C1.24): Der verteidigende König steht vor dem Bauern; Schachdistanz und kurze/lange
 * Seite gelten nicht. Regel: Kapitel 9, Abb. 9.3 und 9.4; kurze und lange Seite gelten erst,
 * „wenn Philidor nicht mehr geht“.
 */
function philidorZeilen(lage: Turmlage): { distanz: string[]; seiten: string[] } {
  const koenig = feldname(lage.koenigVerteidiger);
  return {
    distanz: [t("turmbegriffe.philidor.distanz", { koenig }), t("turmbegriffe.philidor.plan")],
    seiten: [t("turmbegriffe.philidor.seiten", { koenig })],
  };
}

/** Philidor: König gold (er steht richtig), Turm gold, wenn er wie im Buch steht, sonst rot. */
function markierungenPhilidor(lage: Turmlage): Markierung[] {
  const marken: Markierung[] = [
    { typ: "feld", farbe: "gold", feld: feldname(lage.koenigVerteidiger) },
  ];
  if (lage.turmVerteidiger !== null) {
    const farbe = philidorTurmRichtig(lage) ? "gold" : "rot";
    marken.push({ typ: "feld", farbe, feld: feldname(lage.turmVerteidiger) });
  }
  return marken;
}

/**
 * Ergebnis mit mehreren Bauern am Brett (C1.25): Die drei Begriffe gelten für Turm und Bauer
 * gegen Turm; das Werkzeug verweist auf das Erkennungsbild (Abb. 9.23: Turmendspiel mit mehreren
 * Bauern).
 */
function mehrereBauern(stellung: Stellung, eigen: Color): Werkzeugergebnis {
  const bild = erkennungsbild(stellung, eigen);
  // Ohne Bild der Tabelle (etwa im Mittelspiel, Abb. 10.22) bleibt nur der Hinweis.
  const verweis = bild
    ? t("turmbegriffe.mehrbauernBild", {
        name: t(`bilder.${bild.bild}.name` as Textschluessel),
      })
    : null;
  return {
    werkzeug: "k9-turmbegriffe",
    art: "N",
    ueberschrift: t("turmbegriffe.titel"),
    befunde: [
      {
        kennung: "mehrbauern",
        art: "N",
        titel: t("turmbegriffe.mehrbauernTitel"),
        zeilen: verweis ? [t("turmbegriffe.mehrbauern"), verweis] : [t("turmbegriffe.mehrbauern")],
        farbe: null,
      },
    ],
    fazit: verweis ?? t("turmbegriffe.mehrbauern"),
    markierungen: [],
    stufen: [["mehrbauern"], ["mehrbauern"], ["mehrbauern"]],
    regel: t("werkzeug.k9-turmbegriffe.regel"),
  };
}

/** Ergebnis ohne Turmendspiel mit Freibauer. */
function keins(): Werkzeugergebnis {
  return {
    werkzeug: "k9-turmbegriffe",
    art: "E",
    ueberschrift: t("turmbegriffe.titel"),
    befunde: [
      {
        kennung: "keins",
        art: "E",
        titel: t("turmbegriffe.keinsTitel"),
        zeilen: [t("turmbegriffe.keins")],
        farbe: null,
      },
    ],
    fazit: t("turmbegriffe.keins"),
    markierungen: [],
    stufen: [["keins"], ["keins"], ["keins"]],
    regel: t("werkzeug.k9-turmbegriffe.regel"),
  };
}

/**
 * Wendet die drei Begriffe auf ein Turmendspiel mit Freibauer an.
 *
 * Warum: „Drei Begriffe entscheiden fast jedes Turmendspiel mit einem Bauern.“ Eingaben:
 * Stellung, eigene Seite (bevorzugter Angreifer). Ausgabe: drei Befunde.
 * Beispiel: Abb. 9.1: Turm e1 schneidet den König g6 auf der e-Linie ab, drei Linien dazwischen.
 * Abb. 9.2: König g8 auf der kurzen Seite, Turm a6 auf der langen mit vier Linien Schachdistanz.
 * Sonderfälle: Philidor (Abb. 9.3): statt Schachdistanz und Seiten der Plan des Buches; mehr als
 * ein Bauer am Brett (Abb. 9.23): Verweis auf das Erkennungsbild.
 */
export function turmbegriffe(stellung: Stellung, eigen: Color): Werkzeugergebnis {
  const lage = turmlage(stellung, eigen);
  if (!lage) return keins();
  if (stellung.brett.pawn.size() > HOECHSTENS_BAUERN) return mehrereBauern(stellung, eigen);
  const philidor = philidorMoeglich(lage) ? philidorZeilen(lage) : null;
  const befunde: Befund[] = [
    {
      kennung: "abschneiden",
      art: "E",
      titel: t("turmbegriffe.abschneidenTitel"),
      zeilen: abschneidenZeilen(lage),
      farbe: "grau",
    },
    {
      kennung: "schachdistanz",
      art: "E",
      titel: t("turmbegriffe.schachdistanzTitel"),
      zeilen: philidor?.distanz ?? distanzZeilen(lage),
      farbe: "grau",
    },
    {
      kennung: "seiten",
      art: "E",
      titel: t("turmbegriffe.seitenTitel"),
      zeilen: philidor?.seiten ?? seitenZeilen(lage),
      farbe: "gold",
    },
  ];
  return {
    werkzeug: "k9-turmbegriffe",
    art: "E",
    ueberschrift: t("turmbegriffe.titel"),
    befunde,
    fazit: philidor
      ? t("turmbegriffe.philidor.plan")
      : t("turmbegriffe.fazit", {
          angreifer: farbname(lage.angreifer),
          bauer: feldname(lage.bauer),
          abgeschnitten: lage.abschneiden
            ? t("turmbegriffe.fazitAbgeschnitten")
            : t("turmbegriffe.fazitNichtAbgeschnitten"),
        }),
    markierungen: philidor ? markierungenPhilidor(lage) : markierungen(lage),
    stufen: [
      ["abschneiden"],
      ["abschneiden", "schachdistanz"],
      ["abschneiden", "schachdistanz", "seiten"],
    ],
    regel: t("werkzeug.k9-turmbegriffe.regel"),
  };
}

/** Das Werkzeug k9-turmbegriffe in der gemeinsamen Form aller Werkzeuge (Konzept 7.1). */
export const k9Turmbegriffe: Werkzeug = {
  id: "k9-turmbegriffe",
  kapitel: 9,
  name: "werkzeug.k9-turmbegriffe.name",
  regel: "werkzeug.k9-turmbegriffe.regel",
  erklaerung: "werkzeug.k9-turmbegriffe.erklaerung",
  art: "E",
  braucht: ["stellung"],
  berechne: ({ stellung, perspektive }) => turmbegriffe(stellung, perspektive),
};

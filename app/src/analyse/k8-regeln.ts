/**
 * Werkzeug k8-regeln: Die sechs goldenen Endspielregeln, an der Stellung geprüft.
 *
 * Rolle im Gesamtbild: Pflichtenheft 6.3 („Sechs goldene Endspielregeln: König, Opposition,
 * Geduld, Tausch, aktive Verteidigung, Rechnen. N. Gold: Weg des Königs“).
 * Abhängigkeiten: schach/koenigsweg.ts, schach/opposition.ts, schach/ergebnispruefung.ts,
 * schach/schluesselfelder.ts, schach/bauernschwaechen.ts, analyse/stellungsprofil.ts,
 * k8-opposition.ts, i18n.
 * Buchbezug: Kapitel 8, „Dein Werkzeug: die sechs goldenen Endspielregeln“ (Regel 1 bis 6).
 */
import { attacks } from "chessops/attacks";
import type { Color, Square } from "chessops/types";
import { squareFile } from "chessops/util";
import { t } from "../i18n/sprache";
import type { Textschluessel } from "../i18n/sprache";
import { eigeneReihe } from "../schach/bauernprofil";
import { bauernschwaechen } from "../schach/bauernschwaechen";
import { koenigsabstand, koenigsweg } from "../schach/koenigsweg";
import { oppositionDerStellung } from "../schach/opposition";
import { pruefeOpposition } from "../schach/ergebnispruefung";
import { schluesselfelder } from "../schach/schluesselfelder";
import { feldAusName, feldname, FIGURENWERT, gegner, type Stellung } from "../schach/stellung";
import { hinweistext, lagetext } from "./k8-opposition";
import { profil } from "./stellungsprofil";
import { aufzaehlung, farbname, punktzahl, zugtext, zugzahl } from "./texte";
import type { Befund, Markierung, Werkzeug, Werkzeugergebnis } from "./werkzeug";

/** Die Überschriften der sechs Regeln. */
const TITEL: readonly Textschluessel[] = [
  "regeln.r1.titel",
  "regeln.r2.titel",
  "regeln.r3.titel",
  "regeln.r4.titel",
  "regeln.r5.titel",
  "regeln.r6.titel",
];
/** Die Zentrumsfelder, Ziel des Königs ohne Freibauern (Regel 1: „marschiert er ins Zentrum“). */
const ZENTRUM = ["d4", "e4", "d5", "e5"];
/** Ein Freibauer ist „entfernt“, wenn der gegnerische König mindestens so viele Linien weg ist. */
const ENTFERNT_AB_LINIEN = 3;
/** Hinter den Bauern: eigene Grundreihe und die Reihe davor. */
const HINTEN_BIS_REIHE = 1;
/** Ein Turm mit weniger Feldern ist passiv (Regel 5: „statt nur einen Bauern zu bewachen“). */
const TURM_PASSIV_UNTER = 7;

/** Materialsumme einer Farbe ohne König. */
function material(stellung: Stellung, farbe: Color): number {
  let summe = 0;
  for (const feld of stellung.brett[farbe]) {
    const figur = stellung.brett.get(feld);
    if (figur && figur.role !== "king") summe += FIGURENWERT[figur.role];
  }
  return summe;
}

/** Freibauern einer Farbe als Felder. */
function freibauern(stellung: Stellung, farbe: Color): Square[] {
  return bauernschwaechen(stellung.brett, farbe).freibauern.map((f) => f.feld);
}

/** Ziele des Königs: Schlüsselfelder eigener Freibauern, sonst das Zentrum. */
function koenigsziele(stellung: Stellung, farbe: Color): Set<Square> {
  const felder = freibauern(stellung, farbe).flatMap((b) => schluesselfelder(b, farbe).felder);
  if (felder.length > 0) return new Set(felder);
  return new Set(ZENTRUM.map(feldAusName).filter((f): f is Square => f !== null));
}

/** Regel 1: Wo steht der König, und wie kommt er sicher ans Ziel? */
function regel1(
  stellung: Stellung,
  eigen: Color,
  weg: { ziel: Square; weg: readonly Square[] } | null,
): string[] {
  const koenig = stellung.brett.kingOf(eigen);
  if (koenig === undefined) return [t("regeln.r1.ohneKoenig")];
  const zeilen = [
    t("regeln.r1.steht", { koenig: feldname(koenig), reihe: eigeneReihe(koenig, eigen) + 1 }),
  ];
  if (stellung.brett.queen.nonEmpty()) zeilen.push(t("regeln.r1.damen"));
  if (!weg) zeilen.push(t("regeln.r1.keinWeg"));
  else if (weg.weg.length === 0) zeilen.push(t("regeln.r1.amZiel", { ziel: feldname(weg.ziel) }));
  else {
    zeilen.push(
      t("regeln.r1.weg", {
        ziel: feldname(weg.ziel),
        zuege: zugzahl(weg.weg.length),
        weg: weg.weg.map(feldname).join("–"),
      }),
    );
  }
  return zeilen;
}

/** Regel 2: Opposition und Zugzwang; genannt werden nur Züge, die das Ergebnis halten (C1.19). */
function regel2(stellung: Stellung): string[] {
  const lage = oppositionDerStellung(stellung);
  if (lage)
    return [lagetext(lage), t("regeln.r2.hat", { farbe: farbname(gegner(stellung.amZug)) })];
  const pruefung = pruefeOpposition(stellung);
  const hinweis = hinweistext(stellung, pruefung);
  if (hinweis) return [hinweis];
  const zuege = pruefung.haltende;
  if (zuege.length > 0) {
    return [t("regeln.r2.nehmen", { zuege: aufzaehlung(zuege.map((z) => zugtext(z.san))) })];
  }
  return [t("regeln.r2.keine")];
}

/** Regel 3: Geduld und die zweite Schwäche (entfernter Freibauer, Bauernrennen). */
function regel3(stellung: Stellung, eigen: Color): string[] {
  const eigene = freibauern(stellung, eigen);
  const fremde = freibauern(stellung, gegner(eigen));
  const koenigGegner = stellung.brett.kingOf(gegner(eigen));
  const entfernt = eigene.filter(
    (b) =>
      koenigGegner !== undefined &&
      Math.abs(squareFile(b) - squareFile(koenigGegner)) >= ENTFERNT_AB_LINIEN,
  );
  // „Geduld heißt allerdings nicht Langsamkeit“: Das Rennen geht vor der zweiten Schwäche.
  if (eigene.length > 0 && fremde.length > 0) return [t("regeln.r3.rennen")];
  if (entfernt.length > 0)
    return [t("regeln.r3.entfernt", { bauern: aufzaehlung(entfernt.map(feldname)) })];
  return [t("regeln.r3.geduld")];
}

/** Regel 4: Tausche klug, je nach Materialstand. */
function regel4(stellung: Stellung, eigen: Color): string[] {
  const vorsprung = material(stellung, eigen) - material(stellung, gegner(eigen));
  if (vorsprung > 0)
    return [t("regeln.r4.mehr", { farbe: farbname(eigen), vorsprung: punktzahl(vorsprung) })];
  if (vorsprung < 0)
    return [t("regeln.r4.weniger", { farbe: farbname(eigen), rueckstand: punktzahl(-vorsprung) })];
  return [t("regeln.r4.gleich")];
}

/** Regel 5: Verteidige aktiv: passive Könige und Türme. */
function regel5(stellung: Stellung, eigen: Color): string[] {
  const zeilen: string[] = [];
  const koenig = stellung.brett.kingOf(eigen);
  if (
    koenig !== undefined &&
    eigeneReihe(koenig, eigen) <= HINTEN_BIS_REIHE &&
    stellung.brett.queen.isEmpty()
  ) {
    zeilen.push(t("regeln.r5.koenigPassiv", { koenig: feldname(koenig) }));
  }
  for (const feld of stellung.brett[eigen].intersect(stellung.brett.rook)) {
    const figur = stellung.brett.get(feld);
    if (figur && attacks(figur, feld, stellung.brett.occupied).size() < TURM_PASSIV_UNTER) {
      zeilen.push(t("regeln.r5.turmPassiv", { turm: feldname(feld) }));
    }
  }
  return zeilen.length > 0 ? zeilen : [t("regeln.r5.aktiv")];
}

/** Regel 6: Rechne bis zur Umwandlung, je Freibauer. */
function regel6(stellung: Stellung, eigen: Color): string[] {
  const karte = profil(stellung).angriffskarte;
  const zeilen: string[] = [];
  for (const farbe of [eigen, gegner(eigen)]) {
    for (const bauer of freibauern(stellung, farbe)) {
      const sf = schluesselfelder(bauer, farbe);
      const LETZTE = 7;
      const ziel = (farbe === "white" ? LETZTE * 8 : 0) + squareFile(bauer);
      zeilen.push(
        t("regeln.r6.bauer", {
          farbe: farbname(farbe),
          bauer: feldname(bauer),
          schritte: zugzahl(LETZTE - eigeneReihe(bauer, farbe)),
          ziel: feldname(ziel),
          kontrolle: karte.greiftAn(ziel, gegner(farbe)) ? t("regeln.r6.kontrolliert") : "",
          felder: sf.felder.length > 0 ? aufzaehlung(sf.felder.map(feldname)) : "–",
        }),
      );
    }
  }
  return zeilen.length > 0 ? zeilen : [t("regeln.r6.keiner")];
}

/** Gold: der Weg des Königs. */
function markierungen(koenig: Square | undefined, weg: readonly Square[]): Markierung[] {
  if (koenig === undefined) return [];
  let von = koenig;
  return weg.map((nach) => {
    const pfeil: Markierung = {
      typ: "pfeil",
      farbe: "gold",
      von: feldname(von),
      nach: feldname(nach),
    };
    von = nach;
    return pfeil;
  });
}

/**
 * Prüft die sechs goldenen Endspielregeln an der Stellung.
 *
 * Warum: „Die sechs Regeln begleiten dich durch dieses Kapitel und durch Kapitel 9.“ Die App
 * sagt je Regel, was in dieser Stellung dazu zu sehen ist; Näherung (Art N).
 * Eingaben: Stellung, eigene Seite. Ausgabe: sechs Befunde, goldene Pfeile für den Weg des Königs.
 * Beispiel: Abb. 8.19 (Weiß am Zug): Regel 2 meldet die direkte Opposition, Schwarz hat sie.
 */
export function regeln(stellung: Stellung, eigen: Color): Werkzeugergebnis {
  const koenig = stellung.brett.kingOf(eigen);
  const weg = koenigsweg(
    stellung,
    profil(stellung).angriffskarte,
    eigen,
    koenigsziele(stellung, eigen),
  );
  const zeilen: readonly (readonly string[])[] = [
    regel1(stellung, eigen, weg),
    regel2(stellung),
    regel3(stellung, eigen),
    regel4(stellung, eigen),
    regel5(stellung, eigen),
    regel6(stellung, eigen),
  ];
  const befunde: Befund[] = zeilen.map((z, i) => ({
    kennung: `regel${i + 1}`,
    art: "N",
    titel: t(TITEL[i] ?? "regeln.titel"),
    zeilen: z,
    farbe: i === 0 ? "gold" : null,
  }));
  const kennungen = befunde.map((b) => b.kennung);
  return {
    werkzeug: "k8-regeln",
    art: "N",
    ueberschrift: t("regeln.titel"),
    befunde,
    fazit:
      weg && weg.weg.length > 0 && koenig !== undefined
        ? t("regeln.fazitWeg", { ziel: feldname(weg.ziel), zuege: zugzahl(weg.weg.length) })
        : t("regeln.fazit"),
    markierungen: markierungen(koenig, weg?.weg ?? []),
    stufen: [kennungen.slice(0, 2), kennungen.slice(0, 4), kennungen],
    regel: t("werkzeug.k8-regeln.regel"),
  };
}

/** Das Werkzeug k8-regeln in der gemeinsamen Form aller Werkzeuge (Konzept 7.1). */
export const k8Regeln: Werkzeug = {
  id: "k8-regeln",
  kapitel: 8,
  name: "werkzeug.k8-regeln.name",
  regel: "werkzeug.k8-regeln.regel",
  erklaerung: "werkzeug.k8-regeln.erklaerung",
  art: "N",
  braucht: ["stellung"],
  berechne: ({ stellung, perspektive }) => regeln(stellung, perspektive),
};

/** Abstand des eigenen Königs zum Ziel, für Tests und k11-phase. */
export function koenigsabstandZumZiel(stellung: Stellung, eigen: Color): number | null {
  const koenig = stellung.brett.kingOf(eigen);
  if (koenig === undefined) return null;
  return Math.min(
    ...[...koenigsziele(stellung, eigen)].map((ziel) => koenigsabstand(koenig, ziel)),
  );
}

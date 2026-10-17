/**
 * Werkzeug k5-richtung: Leitfrage 3 des Skelett-Röntgens. Ketten mit Basis und Richtung, Raum,
 * Mehrheit und Minderheit je Flügel, Hebel gegen die gegnerische Basis.
 *
 * Rolle im Gesamtbild: Pflichtenheft 6.3 („Bauernketten mit Basis und Richtung, Raum je Seite,
 * Mehrheit oder Minderheit je Flügel, Hebel gegen die gegnerische Basis. Grau: Kettenrichtung.
 * Gold: mögliche Hebel. Rot: angreifbare Basis.“).
 * Abhängigkeiten: analyse/skelett.ts (schach/skelettrichtung.ts), i18n.
 * Buchbezug: Kapitel 5, „Leitfrage 3: Richtung“ und die Checkliste dazu; kalibriert an den
 * Richtung-Zeilen der Skelettbilanzen.
 */
import type { Color } from "chessops/types";
import { squareFile } from "chessops/util";
import { t } from "../i18n/sprache";
import type { Mehrheit } from "../schach/bauernprofil";
import { feldVor } from "../schach/skelettfelder";
import type { Fluegel, Hebel, Richtungsbefund } from "../schach/skelettrichtung";
import { feldname, gegner, type Stellung } from "../schach/stellung";
import {
  felderText,
  fluegelname,
  gesundeMehrheit,
  linienname,
  minderheitsplan,
  type Minderheitsplan,
  richtungFuer,
  zielschwaeche,
  type Zielschwaeche,
} from "./skelett";
import { profil, type Stellungsprofil } from "./stellungsprofil";
import { farbname, figurenname } from "./texte";
import type { Befund, Markierung, Werkzeug, Werkzeugergebnis } from "./werkzeug";

/** Ein Hebel ohne „Hebel“ davor: „b2–…–b5 gegen c6“, „f7–f5 gegen die Basis e4“. */
function hebelkern(h: Hebel, stellung: Stellung): string {
  const weg =
    h.zuege === 2
      ? `${feldname(h.von)}–…–${feldname(h.nach)}`
      : `${feldname(h.von)}–${feldname(h.nach)}`;
  const ziel = h.gegenBasis
    ? t("richtung.gegenBasis", { felder: felderText(h.trifft) })
    : t("richtung.gegen", { felder: felderText(h.trifft) });
  const figur = h.imWeg === null ? undefined : stellung.brett.get(h.imWeg);
  const imWeg =
    h.imWeg !== null && figur
      ? t("richtung.imWeg", { figur: figurenname({ feld: h.imWeg, figur }) })
      : "";
  return t("richtung.hebelKern", { weg, ziel, imWeg });
}

/**
 * Die Hebel in der Reihenfolge des Buches: Gibt es einen Hebel gegen die gegnerische Basis, steht
 * er vorn und allein (gold), die übrigen folgen als „weitere Hebel“ (grau). Regel: Kapitel 5,
 * Abb. 5.27: „In beiden Fällen zielt der Hebel wieder auf die gegnerische Basis: c4–c5 auf d6,
 * ...f5 auf e4.“ Ohne Basis-Hebel sind alle gleichrangig.
 */
function hebelrang(r: Richtungsbefund): { haupt: Hebel[]; weitere: Hebel[] } {
  const basis = r.hebel.filter((h) => h.gegenBasis);
  if (basis.length === 0) return { haupt: [...r.hebel], weitere: [] };
  return { haupt: basis, weitere: r.hebel.filter((h) => !h.gegenBasis) };
}

function kettenzeilen(r: Richtungsbefund): string[] {
  if (r.ketten.length === 0) return [t("richtung.ketteKeine")];
  return r.ketten.map((k) =>
    t("richtung.kette", {
      glieder: k.kette.glieder.map(feldname).join("–"),
      fluegel: k.zeigtNach ? fluegelname(k.zeigtNach) : t("richtung.keinFluegel"),
      basis: felderText(k.kette.basis),
      stuetze:
        k.kette.stuetzen.length > 0
          ? t("richtung.stuetze", { felder: felderText(k.kette.stuetzen) })
          : t("richtung.ohneStuetze"),
    }),
  );
}

function raumzeile(r: Richtungsbefund): string {
  if (r.raum.genommen.length === 0) return t("richtung.raumKeiner");
  return t("richtung.raum", {
    bauern:
      r.raum.vorgerueckt.length > 0
        ? t("richtung.vorgerueckt", { felder: felderText(r.raum.vorgerueckt) })
        : "",
    felder: felderText(r.raum.genommen),
  });
}

/** Was aus einer Minderheit wird: Minderheitsangriff, Gegenspiel vor dem eigenen König oder nichts. */
function minderheitsziel(plan: Minderheitsplan | null, fluegel: Fluegel): string {
  if (plan?.fluegel !== fluegel) return "";
  return t(plan.art === "angriff" ? "richtung.minderheitAngriff" : "richtung.minderheitGegenspiel");
}

function verhaeltniszeilen(
  r: Richtungsbefund,
  mehrheiten: readonly Mehrheit[],
  plan: Minderheitsplan | null,
): string[] {
  const zeilen = r.mehrheiten.map((m) => {
    const kandidat = mehrheiten.find((k) => k.fluegel === m.fluegel)?.kandidat ?? null;
    return t("richtung.mehrheit", {
      fluegel: fluegelname(m.fluegel),
      eigene: m.eigene,
      gegnerische: m.gegnerische,
      kandidat: kandidat !== null ? t("richtung.kandidat", { feld: feldname(kandidat) }) : "",
    });
  });
  for (const m of r.minderheiten) {
    zeilen.push(
      t("richtung.minderheit", {
        fluegel: fluegelname(m.fluegel),
        eigene: m.eigene,
        gegnerische: m.gegnerische,
        ziel: minderheitsziel(plan, m.fluegel),
      }),
    );
  }
  zeilen.push(
    t("richtung.zentrum", { eigene: r.zentrum.eigene, gegnerische: r.zentrum.gegnerische }),
  );
  return zeilen;
}

function hebelzeilen(r: Richtungsbefund, stellung: Stellung): string[] {
  const { haupt, weitere } = hebelrang(r);
  const zeilen = haupt.map((h) => t("richtung.hebel", { hebel: hebelkern(h, stellung) }));
  if (zeilen.length === 0) zeilen.push(t("richtung.hebelKeiner"));
  if (weitere.length > 0)
    zeilen.push(
      t("richtung.weitereHebel", {
        hebel: weitere.map((h) => hebelkern(h, stellung)).join("; "),
      }),
    );
  if (r.spannung.length > 0) {
    zeilen.push(
      t("richtung.spannung", {
        paare: r.spannung.map((s) => `${feldname(s.eigen)}/${feldname(s.gegnerisch)}`).join(", "),
      }),
    );
  }
  return zeilen;
}

function befundFuer(p: Stellungsprofil, farbe: Color): { befund: Befund; r: Richtungsbefund } {
  const r = richtungFuer(p, farbe);
  const zeilen = [
    ...kettenzeilen(r),
    raumzeile(r),
    ...verhaeltniszeilen(r, p.bauernprofil(farbe).mehrheiten, minderheitsplan(p, farbe, r)),
    ...hebelzeilen(r, p.stellung),
  ];
  return { befund: { kennung: farbe, art: "E", titel: farbname(farbe), zeilen, farbe: null }, r };
}

/**
 * Grau die Kettenrichtung (Basis → Spitze), Gold die eigenen Hebel (gibt es einen gegen die
 * Basis, nur diesen; die weiteren grau), Rot die gegnerische Basis ohne Stütze.
 */
function markierungen(mein: Richtungsbefund, sein: Richtungsbefund): Markierung[] {
  const liste: Markierung[] = [];
  for (const k of mein.ketten) {
    const basis = k.kette.basis[0];
    if (basis !== undefined)
      liste.push({
        typ: "pfeil",
        farbe: "grau",
        von: feldname(basis),
        nach: feldname(k.kette.spitze),
      });
  }
  const { haupt, weitere } = hebelrang(mein);
  for (const h of haupt)
    liste.push({ typ: "pfeil", farbe: "gold", von: feldname(h.von), nach: feldname(h.nach) });
  for (const h of weitere)
    liste.push({ typ: "pfeil", farbe: "grau", von: feldname(h.von), nach: feldname(h.nach) });
  for (const k of sein.ketten) {
    if (k.kette.stuetzen.length === 0)
      for (const b of k.kette.basis) liste.push({ typ: "feld", farbe: "rot", feld: feldname(b) });
  }
  return liste;
}

/** „Schwarz spielt am Damenflügel: Dorthin zeigt die Kette.“ */
function fluegelfazit(farbe: Color, fluegel: Fluegel, grund: string): string {
  return t("richtung.fazit", { farbe: farbname(farbe), fluegel: fluegelname(fluegel), grund });
}

/** „Schwarz spielt gegen den Isolani d4: Blockiere das Feld davor (d5) …“ */
function schwaechefazit(farbe: Color, s: Zielschwaeche): string {
  const davor = feldVor(s.feld, gegner(farbe));
  return t("richtung.fazitSchwaeche", {
    farbe: farbname(farbe),
    ziel: t(`richtung.schwaeche.${s.art}`, { feld: feldname(s.feld) }),
    davor: davor === null ? "" : t("richtung.davor", { feld: feldname(davor) }),
  });
}

/** Die Linien d und e: Nur dort gibt ein Isolani seinem Besitzer den Plan des Buches. */
const ZENTRUMSLINIEN: readonly number[] = [3, 4];

/**
 * „Weiß hat den Isolani d4: Spiele aktiv mit den Figuren …“ (Kapitel 5, „Der Isolani: Eine
 * Struktur mit zwei Gesichtern“): Im Mittelspiel sucht der Besitzer eines zentralen Isolani
 * aktives Figurenspiel, den Vorstoß d4–d5 und tauscht keine Figuren; im Endspiel (ohne Damen)
 * ist er nur noch eine Schwäche, dann gilt das nicht, ebenso wenig, wenn der Gegner das Feld davor
 * schon blockiert (Abb. 5.18, 11.43: dann hat er den Plan des Buches schon umgesetzt).
 * Beispiel: Abb. 5.17, Weiß. Null sonst.
 */
function isolanifazit(p: Stellungsprofil, farbe: Color): string | null {
  const eigene = zielschwaeche(p, gegner(farbe));
  if (!eigene || eigene.art !== "isolani" || !ZENTRUMSLINIEN.includes(squareFile(eigene.feld)))
    return null;
  const brett = p.stellung.brett;
  if (brett.pieces(farbe, "queen").isEmpty() || brett.pieces(gegner(farbe), "queen").isEmpty())
    return null;
  const davor = feldVor(eigene.feld, farbe);
  if (davor === null || brett.get(davor)?.color === gegner(farbe)) return null;
  return t("richtung.fazitIsolani", {
    farbe: farbname(farbe),
    feld: feldname(eigene.feld),
    vor: feldname(davor),
  });
}

/**
 * Wo die Seite spielt, in dieser Reihenfolge (Entscheidung des Autors zu C1.9): die Richtung der
 * Kette (Abb. 5.26); eine gesunde eigene Mehrheit mit Kandidat, wenn die gegnerische keinen hat
 * (Abb. 5.30, Berliner Endspiel); eine gegnerische Bauernschwäche (Abb. 5.17, der Isolani d4);
 * seit 0.2.66 der eigene zentrale Isolani im Mittelspiel (Abb. 5.17, Weiß: aktives
 * Figurenspiel); der Minderheitsangriff gegen eine gesunde Mehrheit, vor dem eigenen König aber
 * Gegenspiel mit Figuren (Abb. 5.32, Carlsbad); zuletzt irgendeine eigene Mehrheit.
 */
function fazit(p: Stellungsprofil, farbe: Color, r: Richtungsbefund): string {
  const kette = r.ketten.find((k) => k.zeigtNach !== null);
  if (kette?.zeigtNach) return fluegelfazit(farbe, kette.zeigtNach, t("richtung.grund.kette"));
  const mehrheit = gesundeMehrheit(p, farbe);
  if (mehrheit) {
    const grund = t("richtung.grund.gesund", { kandidat: feldname(mehrheit.kandidat) });
    return fluegelfazit(farbe, mehrheit.fluegel, grund);
  }
  const schwaeche = zielschwaeche(p, farbe);
  if (schwaeche) return schwaechefazit(farbe, schwaeche);
  const isolani = isolanifazit(p, farbe);
  if (isolani) return isolani;
  const minderheit = minderheitsplan(p, farbe, r);
  if (minderheit)
    return fluegelfazit(farbe, minderheit.fluegel, t(`richtung.grund.${minderheit.art}`));
  const irgendeine = r.mehrheiten[0];
  if (irgendeine) return fluegelfazit(farbe, irgendeine.fluegel, t("richtung.grund.mehrheit"));
  return t("richtung.fazitOffen", { farbe: farbname(farbe) });
}

/**
 * Beantwortet Leitfrage 3 für beide Seiten.
 *
 * Warum: „Wohin zeigt die Struktur – und auf welchem Flügel habe ich mehr Bauern?“ (Kapitel 5).
 * Eingaben: Stellung, eigene Seite. Ausgabe: ein Befund je Seite. Beispiel: Abb. 5.26: Weiß
 * „Kette d4–e5 zeigt zum Königsflügel, Basis d4 ohne Stütze“; Schwarz „Kette e6–d5 zeigt zum
 * Damenflügel“, Hebel ...f6 gegen e5. Abb. 5.32: Weiß „Minderheit am Damenflügel (2 gegen 3)“.
 */
export function richtung(stellung: Stellung, eigen: Color): Werkzeugergebnis {
  const p = profil(stellung);
  const mein = befundFuer(p, eigen);
  const sein = befundFuer(p, gegner(eigen));
  return {
    werkzeug: "k5-richtung",
    art: "E",
    ueberschrift: t("richtung.titel"),
    befunde: [mein.befund, sein.befund],
    fazit: fazit(p, eigen, mein.r),
    markierungen: markierungen(mein.r, sein.r),
    stufen: [[eigen], [eigen, gegner(eigen)], [eigen, gegner(eigen)]],
    regel: t("werkzeug.k5-richtung.regel"),
  };
}

/** Linienname für Texte anderer Werkzeuge (etwa „c-Linie“ in der Planfrage). */
export { linienname };

/** Das Werkzeug k5-richtung in der gemeinsamen Form aller Werkzeuge (Konzept 7.1). */
export const k5Richtung: Werkzeug = {
  id: "k5-richtung",
  kapitel: 5,
  name: "werkzeug.k5-richtung.name",
  regel: "werkzeug.k5-richtung.regel",
  erklaerung: "werkzeug.k5-richtung.erklaerung",
  art: "E",
  braucht: ["stellung"],
  berechne: ({ stellung, perspektive }) => richtung(stellung, perspektive),
};

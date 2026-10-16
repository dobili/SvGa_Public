/**
 * Gemeinsame Texte der drei Planfragen (Kapitel 6) für k6-wo, k6-gegner, k6-lap und
 * k6-planbilanz: Antwort auf „Wo spiele ich?“, Plan des Gegners, Figur nach dem LAP-Prinzip
 * (vorher das Eindringen verdoppelter Türme, Abb. 6.17), der Plan in einem Satz, dazu der
 * Hinweis in unruhigen Stellungen (Schach oder angegriffene Dame, Abb. 6.32).
 *
 * Rolle im Gesamtbild: Die Planbilanz zeigt die Antworten beider Seiten nebeneinander, die
 * einzelnen Werkzeuge zeigen sie ausführlich; beide sagen dasselbe mit denselben Worten.
 * Abhängigkeiten: planlage.ts, schach/aktivitaet.ts, schach/figurenziel.ts, i18n.
 * Buchbezug: Kapitel 6, Planbilanz („Ich nutze …, greife … an und sichere …“, Abb. 6.20, 11.34).
 */
import type { Color, Square } from "chessops/types";
import { t, type Textschluessel } from "../i18n/sprache";
import { aktivitaeten, type Aktivitaet } from "../schach/aktivitaet";
import {
  eindringen,
  figurenziel,
  reihennummer,
  type Eindringen,
  type Figurenziel,
} from "../schach/figurenziel";
import { feldname, FIGURENWERT, gegner } from "../schach/stellung";
import type { Sturm } from "../schach/sturm";
import { planlage, type Planlage, type Zentrumshebel } from "./planlage";
import { felderText, figurenFuer, felderFuer, fluegelname, linienname } from "./skelett";
import type { Stellungsprofil } from "./stellungsprofil";
import { aufzaehlung, farbname, figurenname } from "./texte";
import type { Befund, Befundart, Werkzeugergebnis } from "./werkzeug";

/** „h2–h5 in 2 Zügen gegen g6“. */
export function sturmtext(s: Sturm): string {
  return t(s.zuege === 1 ? "plan.sturmEins" : "plan.sturm", {
    weg: `${feldname(s.bauer)}–${feldname(s.ziel)}`,
    zuege: s.zuege,
    ziel: feldname(s.trifft),
  });
}

/** Linien je Reihe, um aus einem Feld die Linie zu gewinnen. */
const LINIEN = 8;

/** Die drei Textformen des Gegenschlags (Wo?, Planbilanz, Verteidigungsmittel in Gegner?). */
type Gegenschlagschluessel = "plan.gegenschlag" | "wo.gegenschlag" | "gegner.mittel.zentrumHebel";

/**
 * Ein Gegenschlag im Zentrum als Text mit der Zählung, in der Form des Werkzeugs: `schluessel`
 * für den Hebel („Gegenschlag d6–d5: auf d5 2 Angreifer gegen 2 Verteidiger“), `schluessel` mit
 * „Da“ für die schon bestehende Spannung („Der Gegenschlag ist schon da: d5 greift e4 an …“,
 * Abb. 6.4).
 */
export function gegenschlagtext(z: Zentrumshebel, schluessel: Gegenschlagschluessel): string {
  const mitSpannung: Textschluessel = `${schluessel}Da`;
  return t(z.schonDa ? mitSpannung : schluessel, {
    weg: `${feldname(z.hebel.von)}–${feldname(z.hebel.nach)}`,
    von: feldname(z.hebel.von),
    feld: feldname(z.feld),
    angreifer: z.angreifer,
    verteidiger: z.verteidiger,
  });
}

/** Der Hebel gegen die Basis als Text: „Hebel c4–c5 gegen die Basis d6“. */
function hebeltext(l: Planlage): string | null {
  const h = l.hebelBasis[0];
  return h
    ? t("plan.hebelBasis", {
        weg: `${feldname(h.von)}–${feldname(h.nach)}`,
        basis: felderText(h.trifft),
      })
    : null;
}

/** Die Antwort auf „Wo spiele ich?“ in einem Satz (Tabelle der fünf Lagen, Kapitel 6). */
export function woText(l: Planlage): string {
  const a = l.antwort;
  if (a.art === "zentrum") {
    const z = l.zentrumshebel[0];
    return t("plan.wo.zentrum", {
      hebel: z ? gegenschlagtext(z, "plan.gegenschlag") : t("plan.gegenschlagKeiner"),
    });
  }
  if (a.art === "offen") return t("plan.wo.offen");
  const fluegel = fluegelname(a.fluegel);
  if (a.grund === "geschlossen")
    return t("plan.wo.kette", {
      fluegel,
      kette: l.kette?.kette.glieder.map(feldname).join("–") ?? "",
      hebel: hebeltext(l) ?? t("plan.hebelKeiner"),
    });
  if (a.grund === "verschiedeneFluegel")
    return t("plan.wo.sturm", {
      fluegel,
      sturm: l.sturm.eigen
        ? t("plan.wo.sturmZug", { sturm: sturmtext(l.sturm.eigen) })
        : t("plan.sturmKeiner"),
      linien:
        l.linienZumKoenig.length > 0
          ? t("plan.linien", { linien: aufzaehlung(l.linienZumKoenig.map(linienname)) })
          : "",
    });
  if (a.grund === "gleicherFluegel")
    return t("plan.wo.figuren", {
      fluegel,
      ziel: felderText(l.bedingungen?.ziele.map((z) => z.feld) ?? l.bedingungen?.haken ?? []),
    });
  const schwaeche = l.schwaechen.find((s) => s.fixiert);
  if (schwaeche) return t("plan.wo.schwaeche", { fluegel, feld: feldname(schwaeche.feld) });
  return l.minderheit?.art === "gegenspiel"
    ? t("plan.wo.gegenspiel", { fluegel })
    : t("plan.wo.minderheit", { fluegel });
}

/** Was der Gegner will: seine Antwort auf Planfrage 1 als Plan, dazu das Ziel seines Hebels oder Sturms. */
export function gegnerText(seine: Planlage): string {
  const name = farbname(seine.farbe);
  const a = seine.antwort;
  const hebel = seine.hebelBasis[0];
  if (hebel)
    return t("plan.gegner.hebel", {
      farbe: name,
      weg: `${feldname(hebel.von)}–${feldname(hebel.nach)}`,
      ziel: felderText(hebel.trifft),
    });
  if (a.art === "fluegel" && a.grund === "verschiedeneFluegel" && seine.sturm.eigen)
    return t("plan.gegner.sturm", { farbe: name, sturm: sturmtext(seine.sturm.eigen) });
  const z = seine.zentrumshebel[0];
  if (a.art === "zentrum" && z)
    return t(z.schonDa ? "plan.gegner.zentrumDa" : "plan.gegner.zentrum", {
      farbe: name,
      weg: `${feldname(z.hebel.von)}–${feldname(z.hebel.nach)}`,
      von: feldname(z.hebel.von),
      feld: feldname(z.feld),
    });
  if (a.art === "fluegel")
    return t("plan.gegner.fluegel", { farbe: name, fluegel: fluegelname(a.fluegel) });
  return t("plan.gegner.unklar", { farbe: name });
}

/** Was die eigene Seite sichern muss: die Basis unter seinem Hebel, der Schildbauer unter seinem Sturm. */
export function sichernFelder(eigene: Planlage, seine: Planlage): Square[] {
  const felder = new Set<Square>();
  for (const h of seine.hebelBasis) for (const f of h.trifft) felder.add(f);
  const stuermt = seine.antwort.art === "fluegel" && seine.antwort.grund === "verschiedeneFluegel";
  if (seine.sturm.eigen && stuermt) felder.add(seine.sturm.eigen.trifft);
  for (const z of seine.bedingungen?.ziele ?? []) felder.add(z.feld);
  if (felder.size === 0 && eigene.koenige.eigen?.rochiert) {
    const haken = seine.bedingungen?.haken ?? [];
    for (const h of haken) felder.add(h);
  }
  return [...felder].sort((a, b) => a - b);
}

/** Die am wenigsten aktive Figur einer Seite mit ihrem Ziel. */
export function lapVon(
  p: Stellungsprofil,
  farbe: Color,
): { lap: Aktivitaet; ziel: Figurenziel } | null {
  const lap = aktivitaeten(p.sichereFelder(farbe))[0];
  if (!lap) return null;
  const ziel = figurenziel(p.stellung.brett, lap.stand, lap.sichere, {
    felder: felderFuer(p, farbe),
    profil: p.bauernprofil(farbe),
    laeufer: figurenFuer(p, farbe).laeufer.find((l) => l.laeufer.feld === lap.stand.feld),
  });
  return { lap, ziel };
}

/** Verdoppelte Türme auf einer offenen Linie: Der vordere dringt auf die 7. Reihe ein (Abb. 6.17). */
export function eindringenVon(p: Stellungsprofil, farbe: Color): Eindringen | null {
  return eindringen(p.stellung.brett, farbe, p.bauernprofil(farbe), p.sichereFelder(farbe));
}

/** „Turm d2 dringt nach d7 ein …“ für Planbilanz und LAP. */
export function eindringenText(p: Stellungsprofil, e: Eindringen): string {
  const figur = (feld: Square) => {
    const stein = p.stellung.brett.get(feld);
    return stein ? figurenname({ feld, figur: stein }) : feldname(feld);
  };
  return t("plan.figur.eindringen", {
    turm: figur(e.turm),
    hinten: figur(e.hinten),
    ziel: feldname(e.ziel),
    linie: linienname(e.ziel % LINIEN),
    reihe: reihennummer(e.ziel),
  });
}

/**
 * „Springer d2 nach g3 über f1 (der Turm f1 macht Platz)“ oder „Läufer c1 steht noch zu Hause“.
 * Stehen die Türme schon verdoppelt auf einer offenen Linie, geht das Eindringen vor (Abb. 6.17).
 */
export function figurText(p: Stellungsprofil, farbe: Color): string {
  const rein = eindringenVon(p, farbe);
  if (rein) return eindringenText(p, rein);
  const fund = lapVon(p, farbe);
  if (!fund) return t("plan.figur.keine");
  const { lap, ziel } = fund;
  const name = figurenname(lap.stand);
  if (ziel.ziel === null) {
    if (lap.zuHause) return t("plan.figur.zuHause", { figur: name });
    if (ziel.grund === "tausch") return t("plan.figur.tausch", { figur: name });
    return t("plan.figur.gut", { figur: name, anzahl: lap.freie.length });
  }
  const platz =
    ziel.platzmacher.length > 0
      ? t("plan.figur.platz", {
          figuren: aufzaehlung(
            ziel.platzmacher.map((f) => {
              const figur = p.stellung.brett.get(f);
              return figur ? figurenname({ feld: f, figur }) : feldname(f);
            }),
          ),
        })
      : "";
  return t("plan.figur.ziel", {
    figur: name,
    ziel: feldname(ziel.ziel),
    weg:
      ziel.weg.length > 1
        ? t("plan.figur.ueber", { felder: felderText(ziel.weg.slice(0, -1)) })
        : "",
    platz,
  });
}

/** Womit die Seite spielt („meinen Raum am Damenflügel“, „die h-Linie“, „das Zentrum“). */
function nutzeText(l: Planlage): string {
  const a = l.antwort;
  if (a.art === "zentrum") return t("plan.nutze.zentrum");
  if (a.art === "offen") return t("plan.nutze.offen");
  const fluegel = fluegelname(a.fluegel);
  if (a.grund === "geschlossen") return t("plan.nutze.kette", { fluegel });
  if (a.grund === "verschiedeneFluegel") {
    const linie = l.linienZumKoenig[0];
    return linie !== undefined && !l.sturm.eigen
      ? t("plan.nutze.linie", { linie: linienname(linie) })
      : t("plan.nutze.sturm", { fluegel });
  }
  if (a.grund === "gleicherFluegel") return t("plan.nutze.uebermacht", { fluegel });
  const gegenspiel = !l.schwaechen.some((s) => s.fixiert) && l.minderheit?.art === "gegenspiel";
  return t(gegenspiel ? "plan.nutze.gegenspiel" : "plan.nutze.schwaeche", { fluegel });
}

/** Was die Seite angreift: die gegnerische Basis, das Ziel im Schild, die fixierte Schwäche. */
function greifeAnText(l: Planlage): string {
  const hebel = l.hebelBasis[0];
  if (hebel) return t("plan.greife.basis", { felder: felderText(hebel.trifft) });
  if (l.antwort.art === "fluegel" && l.antwort.grund === "verschiedeneFluegel" && l.sturm.eigen)
    return t("plan.greife.feld", { feld: feldname(l.sturm.eigen.trifft) });
  const ziel = l.bedingungen?.ziele[0];
  if (ziel) return t("plan.greife.feld", { feld: feldname(ziel.feld) });
  const schwaeche = l.schwaechen.find((s) => s.fixiert);
  if (schwaeche) return t("plan.greife.feld", { feld: feldname(schwaeche.feld) });
  const z = l.zentrumshebel[0];
  if (z) return t("plan.greife.feld", { feld: feldname(z.feld) });
  return t("plan.greife.nichts");
}

/**
 * Der Plan in einem Satz: „Ich nutze …, greife … an und sichere …“ (Kapitel 5 und 6).
 *
 * Beispiel: Abb. 6.20, Weiß: „Ich nutze die Richtung meiner Kette zum Damenflügel, greife d6
 * an und sichere e4.“ Näherung (Art N): Das Buch formuliert freier.
 */
export function planSatz(p: Stellungsprofil, farbe: Color): string {
  const eigene = planlage(p, farbe);
  const seine = planlage(p, gegner(farbe));
  const sichern = sichernFelder(eigene, seine);
  return t("plan.satz", {
    nutze: nutzeText(eigene),
    greife: greifeAnText(eigene),
    sichere: sichern.length > 0 ? felderText(sichern) : t("plan.sichere.nichts"),
  });
}

/**
 * Ist die Stellung zu unruhig für Planfragen? Die Seite am Zug steht im Schach, oder ihre Dame
 * ist angegriffen (von einer billigeren Figur, oder sie ist ungedeckt).
 *
 * Warum: Die Planfragen aus Kapitel 6 gelten in ruhigen Stellungen; im Schach ist ein Planzug
 * oft gar nicht erlaubt (Abb. 6.32: nach 31. Sxf7+ steht Schwarz im Schach, die Dame g5 hängt;
 * Entscheidung des Autors zu C1.16, gleiche Prüfung wie bei der Faktorenbilanz in C1.6).
 * Eingaben: Profil. Ausgabe: der Hinweis als Satz, oder null in ruhigen Stellungen.
 */
export function unruhe(p: Stellungsprofil): string | null {
  const amZug = p.stellung.amZug;
  const farbe = farbname(amZug);
  if (p.koenigsumgebung(amZug)?.imSchach) return t("plan.unruhe.schach", { farbe });
  const karte = p.angriffskarte;
  const dameBedroht = [...p.stellung.brett.queen.intersect(p.stellung.brett[amZug])].some(
    (dame) => {
      const angreifer = karte.angreiferVon(dame, gegner(amZug));
      const billiger = angreifer.some((a) => FIGURENWERT[a.rolle] < FIGURENWERT.queen);
      const ungedeckt = angreifer.length > 0 && karte.angreiferVon(dame, amZug).length === 0;
      return billiger || ungedeckt;
    },
  );
  return dameBedroht ? t("plan.unruhe.dame", { farbe }) : null;
}

/**
 * Das Ergebnis eines Planwerkzeugs in unruhiger Stellung: nur der Hinweis, keine Planfragen;
 * in ruhiger Stellung null. Beispiel: Abb. 6.32 (Schwarz am Zug im Schach): „Schwarz steht im
 * Schach: Erst das Schach beantworten; Planfragen gelten in ruhigen Stellungen.“
 * Eingaben: Profil, Kennung des Werkzeugs (ihre Texte „werkzeug.<id>.regel“), Überschrift, Art.
 */
export function unruhigesErgebnis(
  p: Stellungsprofil,
  werkzeug: "k6-wo" | "k6-gegner" | "k6-lap" | "k6-planbilanz",
  ueberschrift: string,
  art: Befundart,
): Werkzeugergebnis | null {
  const hinweis = unruhe(p);
  if (hinweis === null) return null;
  const befund: Befund = {
    kennung: "unruhe",
    art: "E",
    titel: t("plan.unruhe.titel"),
    zeilen: [hinweis],
    farbe: "rot",
  };
  return {
    werkzeug,
    art,
    ueberschrift,
    befunde: [befund],
    fazit: hinweis,
    markierungen: [],
    stufen: [["unruhe"], ["unruhe"], ["unruhe"]],
    regel: t(`werkzeug.${werkzeug}.regel`),
  };
}

/**
 * Werkzeug k6-lap: Planfrage 3, das LAP-Prinzip. Zählt die freien Zielfelder jeder Figur, nennt
 * die am wenigsten aktive Figur und schlägt ihr ein Ziel und den Weg dorthin vor; dazu die
 * Tauschfrage (die aktivste Figur des Gegners).
 *
 * Rolle im Gesamtbild: Pflichtenheft 6.3 („Zählt die freien Zielfelder jeder Figur wie im Buch
 * und schlägt die am wenigsten aktive Figur vor. Schlägt nach den Regeln aus Kapitel 5 ein
 * besseres Feld und den Weg dorthin vor. Rot: am wenigsten aktive Figur. Gold: Weg zum
 * Zielfeld. Felder zählen E, Vorschlag N.“).
 * Abhängigkeiten: schach/aktivitaet.ts, schach/figurenziel.ts, planfragen.ts, i18n.
 * Buchbezug: Kapitel 6, „Frage 3: Welche Figur bringe ich dorthin?“ (Abb. 6.16) und „Die
 * Tauschfrage“ (Abb. 6.6, 6.19).
 */
import type { Color } from "chessops/types";
import { t } from "../i18n/sprache";
import { aktivitaeten, aktivste, type Aktivitaet } from "../schach/aktivitaet";
import type { Eindringen, Figurenziel } from "../schach/figurenziel";
import { reihennummer } from "../schach/figurenziel";
import { feldname, gegner, type Stellung } from "../schach/stellung";
import { eindringenText, eindringenVon, lapVon, unruhigesErgebnis } from "./planfragen";
import { felderText, linienname, richtungFuer } from "./skelett";
import { profil, type Stellungsprofil } from "./stellungsprofil";
import { aufzaehlung, farbname, figurenname } from "./texte";
import type { Befund, Markierung, Werkzeug, Werkzeugergebnis } from "./werkzeug";

/** Linien je Reihe, um aus einem Feld die Linie zu gewinnen. */
const LINIEN = 8;

/** „1 freies Feld“, „2 freie Felder“. */
function anzahlFelder(anzahl: number): string {
  return t(anzahl === 1 ? "lap.feldEins" : "lap.felderMehr", { anzahl });
}

/** „Springer d2: 2 freie Felder (b1, b3)“, zu Hause mit Zusatz. */
function zaehlzeile(a: Aktivitaet): string {
  return t("lap.figur", {
    figur: figurenname(a.stand),
    anzahl: anzahlFelder(a.freie.length),
    felder: a.freie.length > 0 ? felderText(a.freie) : t("lap.keineFelder"),
    zuHause: a.zuHause ? t("lap.zuHause") : "",
  });
}

/** Der Vorschlag für die LAP-Figur als Zeilen (Art N). */
function vorschlagzeilen(p: Stellungsprofil, lap: Aktivitaet, ziel: Figurenziel): string[] {
  const zeilen: string[] = [];
  if (ziel.ziel === null) {
    if (ziel.grund === "tausch") zeilen.push(t("lap.vorschlag.tausch"));
    else if (ziel.grund === "dame") zeilen.push(t("lap.vorschlag.dame"));
    else if (lap.zuHause) zeilen.push(t("lap.vorschlag.entwickeln"));
    else zeilen.push(t("lap.vorschlag.gut"));
    return zeilen;
  }
  const feld = feldname(ziel.ziel);
  const grund = ziel.grund ?? "wirkung";
  zeilen.push(
    grund === "linie"
      ? t("lap.vorschlag.linie", { feld, linie: linienname(ziel.ziel % 8) })
      : grund === "eindringen"
        ? t("lap.vorschlag.eindringen", { feld, reihe: reihennummer(ziel.ziel) })
        : grund === "loch" || grund === "springerfeld"
          ? t(`lap.vorschlag.${grund}`, { feld })
          : t("lap.vorschlag.wirkung", { feld }),
  );
  if (ziel.weg.length > 1)
    zeilen.push(
      t("lap.vorschlag.weg", { weg: [lap.stand.feld, ...ziel.weg].map(feldname).join("–") }),
    );
  if (ziel.platzmacher.length > 0) {
    const figuren = ziel.platzmacher.map((f) => {
      const figur = p.stellung.brett.get(f);
      return figur ? figurenname({ feld: f, figur }) : feldname(f);
    });
    zeilen.push(t("lap.vorschlag.platz", { figuren: aufzaehlung(figuren) }));
  }
  return zeilen;
}

/** Tauschfrage: die aktivste Figur des Gegners und die Raumregel aus Kapitel 5. */
function tauschzeilen(p: Stellungsprofil, eigen: Color): string[] {
  const feind = gegner(eigen);
  const seine = aktivste(aktivitaeten(p.sichereFelder(feind)));
  const zeilen = seine
    ? [t("lap.tausch.aktivste", { figur: figurenname(seine.stand), anzahl: seine.freie.length })]
    : [t("lap.tausch.keine")];
  const mein = richtungFuer(p, eigen).raum.genommen.length;
  const sein = richtungFuer(p, feind).raum.genommen.length;
  if (mein > sein) zeilen.push(t("lap.tausch.mehrRaum"));
  else if (mein < sein) zeilen.push(t("lap.tausch.wenigerRaum"));
  return zeilen;
}

/** Rot die LAP-Figur, Gold der Weg zum Ziel, Grau die Figuren, die Platz machen. */
function markierungen(lap: Aktivitaet, ziel: Figurenziel): Markierung[] {
  const liste: Markierung[] = [{ typ: "feld", farbe: "rot", feld: feldname(lap.stand.feld) }];
  let von = lap.stand.feld;
  for (const nach of ziel.weg) {
    liste.push({ typ: "pfeil", farbe: "gold", von: feldname(von), nach: feldname(nach) });
    von = nach;
  }
  for (const f of ziel.platzmacher) liste.push({ typ: "feld", farbe: "grau", feld: feldname(f) });
  return liste;
}

/** Der Befund „Eindringen“ (Abb. 6.17: Td2 nach d7, gedeckt vom Turm d1), oder keiner. */
function eindringbefund(p: Stellungsprofil, rein: Eindringen | null): Befund[] {
  if (!rein) return [];
  return [
    {
      kennung: "eindringen",
      art: "N",
      titel: t("lap.titelEindringen"),
      zeilen: [eindringenText(p, rein)],
      farbe: "gold",
    },
  ];
}

function fazitEindringen(p: Stellungsprofil, rein: Eindringen): string {
  const turm = p.stellung.brett.get(rein.turm);
  return t("lap.fazit.eindringen", {
    turm: turm ? figurenname({ feld: rein.turm, figur: turm }) : feldname(rein.turm),
    ziel: feldname(rein.ziel),
    linie: linienname(rein.ziel % LINIEN),
  });
}

function fazit(lap: Aktivitaet, ziel: Figurenziel): string {
  const figur = figurenname(lap.stand);
  if (ziel.ziel !== null)
    return t("lap.fazit.ziel", {
      figur,
      ziel: feldname(ziel.ziel),
      weg:
        ziel.weg.length > 1
          ? t("lap.fazit.ueber", { felder: felderText(ziel.weg.slice(0, -1)) })
          : "",
    });
  if (lap.zuHause) return t("lap.fazit.entwickeln", { figur });
  if (ziel.grund === "tausch") return t("lap.fazit.tausch", { figur });
  return t("lap.fazit.gut", { figur });
}

/** Die Zählung der freien Felder je Figur (Art E). */
function zaehlbefund(p: Stellungsprofil, eigen: Color): Befund {
  const alle = aktivitaeten(p.sichereFelder(eigen));
  return {
    kennung: "zaehlung",
    art: "E",
    titel: t("lap.zaehlung", { farbe: farbname(eigen) }),
    zeilen: alle.length > 0 ? alle.map(zaehlzeile) : [t("lap.keineFiguren")],
    farbe: null,
  };
}

/** Die am wenigsten aktive Figur (E) und der Vorschlag für sie (N). */
function lapbefunde(p: Stellungsprofil, lapFigur: Aktivitaet, ziel: Figurenziel): Befund[] {
  return [
    {
      kennung: "lap",
      art: "E",
      titel: t("lap.titelLap"),
      zeilen: [
        t("lap.lap", {
          figur: figurenname(lapFigur.stand),
          anzahl: anzahlFelder(lapFigur.freie.length),
        }),
      ],
      farbe: "rot",
    },
    {
      kennung: "vorschlag",
      art: "N",
      titel: t("lap.titelVorschlag"),
      zeilen: vorschlagzeilen(p, lapFigur, ziel),
      farbe: "gold",
    },
  ];
}

/**
 * Beantwortet Planfrage 3 für die eigene Seite.
 *
 * Eingaben: Stellung, eigene Seite. Ausgabe: Zählung je Figur (E), die am wenigsten aktive
 * Figur (E), Vorschlag (N), Tauschfrage (N). Beispiel: Abb. 6.16, Weiß: Springer d2 (b1, b3),
 * Ziel g3 über f1, der Turm f1 macht Platz. Abb. 6.20: Der Läufer c1 steht noch zu Hause.
 * Sonderfälle: Ohne Figuren außer König und Bauern nur ein Hinweis; ebenso, wenn die Seite am
 * Zug im Schach steht oder ihre Dame hängt (Abb. 6.32: kein Springerumweg im Schach).
 */
export function lap(stellung: Stellung, eigen: Color): Werkzeugergebnis {
  const p = profil(stellung);
  const unruhig = unruhigesErgebnis(p, "k6-lap", t("lap.titel"), "N");
  if (unruhig) return unruhig;
  const fund = lapVon(p, eigen);
  const rein = eindringenVon(p, eigen);
  const befunde: Befund[] = [
    zaehlbefund(p, eigen),
    ...(fund ? lapbefunde(p, fund.lap, fund.ziel) : []),
    ...eindringbefund(p, rein),
    {
      kennung: "tausch",
      art: "N",
      titel: t("lap.titelTausch"),
      zeilen: tauschzeilen(p, eigen),
      farbe: null,
    },
  ];
  const pfeilEindringen: Markierung[] = rein
    ? [{ typ: "pfeil", farbe: "gold", von: feldname(rein.turm), nach: feldname(rein.ziel) }]
    : [];
  return {
    werkzeug: "k6-lap",
    art: "N",
    ueberschrift: t("lap.titel"),
    befunde,
    fazit: rein
      ? fazitEindringen(p, rein)
      : fund
        ? fazit(fund.lap, fund.ziel)
        : t("lap.keineFiguren"),
    markierungen: [...(fund ? markierungen(fund.lap, fund.ziel) : []), ...pfeilEindringen],
    stufen: [
      ["zaehlung", "lap", "eindringen"],
      ["zaehlung", "lap", "vorschlag", "eindringen"],
      ["zaehlung", "lap", "vorschlag", "eindringen", "tausch"],
    ],
    regel: t("werkzeug.k6-lap.regel"),
  };
}

/** Das Werkzeug k6-lap in der gemeinsamen Form aller Werkzeuge (Konzept 7.1). */
export const k6Lap: Werkzeug = {
  id: "k6-lap",
  kapitel: 6,
  name: "werkzeug.k6-lap.name",
  regel: "werkzeug.k6-lap.regel",
  erklaerung: "werkzeug.k6-lap.erklaerung",
  art: "N",
  braucht: ["stellung"],
  berechne: ({ stellung, perspektive }) => lap(stellung, perspektive),
};

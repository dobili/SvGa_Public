/**
 * Werkzeug k11-phase: In welcher Phase steht die Partie, und welches Werkzeug des Buches ist an
 * der Reihe? Bei den Beispielpartien dazu Thema und Werkzeug der Partie; die Lehre bleibt seit
 * 0.2.27 im Buch, damit die App nichts vorwegnimmt (Entscheidung des Autors vom 15.10.2026).
 *
 * Rolle im Gesamtbild: Pflichtenheft 6.3 („Werkzeug je Phase. N“). Gold: der Weg des Königs der
 * Seite am Zug ins Zentrum im Endspiel. Seit 0.2.33 (C1.27) gilt die Phase für beide Seiten
 * gleich; das Werkzeug hat deshalb keinen Sicht-Schalter mehr.
 * Abhängigkeiten: schach/phase.ts, analyse/stellungsprofil.ts, i18n.
 * Buchbezug: Kapitel 11, Tabelle „Die Partien dieses Kapitels und ihre Werkzeuge“ und Rückblick;
 * Kapitel 12, Denkroutine Schritt 1 („Davon hängt ab, mit welchem Werkzeug du in Schritt 2 nach
 * einem ruhigen Zug suchst“) mit der Merkseite.
 */
import type { Square } from "chessops/types";
import { t, type Textschluessel } from "../i18n/sprache";
import { ENDSPIEL_BIS_PUNKTE, phase, type Phase, type Phasenbefund } from "../schach/phase";
import { feldname, type Stellung } from "../schach/stellung";
import { profil } from "./stellungsprofil";
import { farbname } from "./texte";
import type { Befund, Markierung, Werkzeug, Werkzeugergebnis } from "./werkzeug";

/** Die Partien aus Kapitel 11 nach dem Abschnittsanker ihres Abschnitts. */
const PARTIEN: ReadonlySet<string> = new Set([
  "sec:k11-morphy",
  "sec:k11-colle",
  "sec:k11-lasker",
  "sec:k11-anderssen",
  "sec:k11-kortschnoi",
  "sec:k11-fischer",
  "sec:k11-lautier",
  "sec:k11-carlsen",
  "sec:k11-unzicker",
  "sec:k11-capablanca",
  "sec:k11-botwinnik",
]);

/** Je Phase die Werkzeuge der Merkseite (drei Zeilen). */
const WERKZEUGZEILEN: Readonly<Record<Phase, readonly Textschluessel[]>> = {
  eroeffnung: [
    "phase.werkzeug.eroeffnung.1",
    "phase.werkzeug.eroeffnung.2",
    "phase.werkzeug.eroeffnung.3",
  ],
  mittelspiel: [
    "phase.werkzeug.mittelspiel.1",
    "phase.werkzeug.mittelspiel.2",
    "phase.werkzeug.mittelspiel.3",
  ],
  endspiel: ["phase.werkzeug.endspiel.1", "phase.werkzeug.endspiel.2", "phase.werkzeug.endspiel.3"],
};

/**
 * Zeilen zur Phase: das Urteil, die Leichtfiguren auf dem Startfeld, die drei Eröffnungsziele
 * beider Seiten (Weiß zuerst wie die Tabellen im Buch) und die vier Prüffragen. Greift eine
 * Zusatzregel, die nicht aus dem Buch stammt (0.2.41), steht das als zweite Zeile dabei.
 * Beispiel: Abb. 11.28 → „Mittelspiel: …“, „Leichtfiguren auf dem Startfeld: Weiß 0, Schwarz 0.“,
 * „Eröffnungsziele Schwarz: …, Königssicherheit nein.“
 */
export function phasenzeilen(p: Phasenbefund): string[] {
  const w = (wertung: "ja" | "teils" | "nein") => t(`phase.wertung.${wertung}`);
  const f = (ja: boolean) => t(ja ? "phase.ja" : "phase.nein");
  const ziele = (z: Phasenbefund["ziele"]["white"]) =>
    t("phase.ziele", {
      farbe: farbname(z.farbe),
      zentrum: w(z.zentrum.wertung),
      entwicklung: w(z.entwicklung.wertung),
      koenig: w(z.koenig.wertung),
    });
  const zusatz = p.zusatz
    ? [
        t(`phase.zusatz.${p.zusatz}`, {
          punkte: ENDSPIEL_BIS_PUNKTE,
          buch: t(`phase.name.${p.buchphase}`),
        }),
      ]
    : [];
  return [
    t(`phase.ist.${p.phase}`),
    ...zusatz,
    t("phase.zuHause", {
      weiss: p.ziele.white.entwicklung.offen.length,
      schwarz: p.ziele.black.entwicklung.offen.length,
    }),
    ziele(p.ziele.white),
    ziele(p.ziele.black),
    t("phase.fragen", {
      damen: f(p.fragen.damenWeg),
      sicher: f(p.fragen.koenigeSicher),
      zentrum: f(p.fragen.koenigInsZentrum),
      bauern: f(p.fragen.bauernEntscheiden),
      ja: p.fragen.ja,
    }),
  ];
}

/** Die Werkzeuge der Phase laut Merkseite, dazu das, was in jeder Phase gilt. */
export function werkzeugzeilen(ph: Phase): string[] {
  return [...WERKZEUGZEILEN[ph].map((schluessel) => t(schluessel)), t("phase.immer")];
}

/** Gold: der Weg des Königs der Seite am Zug ins Zentrum (nur im Endspiel). */
function markierungen(stellung: Stellung, p: Phasenbefund): Markierung[] {
  const koenig = stellung.brett.kingOf(stellung.amZug);
  if (p.phase !== "endspiel" || !p.zentrumsweg || koenig === undefined) return [];
  let von: Square = koenig;
  return p.zentrumsweg.map((nach) => {
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

/** Thema und Werkzeug der Partie, wenn die Abbildung zu einer Beispielpartie gehört. */
function partiebefund(abschnitt: string | undefined): Befund | null {
  if (!abschnitt || !PARTIEN.has(abschnitt)) return null;
  const name = abschnitt.replace("sec:k11-", "");
  return {
    kennung: "partie",
    art: "V",
    titel: t(`phase.partien.${name}.partie` as Textschluessel),
    zeilen: [
      t("phase.partie.thema", { thema: t(`phase.partien.${name}.thema` as Textschluessel) }),
      t("phase.partie.werkzeug", {
        werkzeug: t(`phase.partien.${name}.werkzeug` as Textschluessel),
      }),
      t("phase.partie.verweis"),
    ],
    farbe: null,
  };
}

/**
 * Bestimmt die Phase und nennt das Werkzeug, das sie verlangt.
 *
 * Warum: „Erst die Beobachtung, dann das Werkzeug, dann der Plan“ (Kapitel 11) und Schritt 1 der
 * Denkroutine. Eingaben: Stellung, Abschnittsanker der Abbildung (für die Beispielpartien); die
 * Sicht spielt keine Rolle (C1.27). Ausgabe: Phase mit Gründen, Werkzeuge, Thema und Werkzeug
 * der Partie. Beispiel: Abb. 8.1 → Endspiel, „sechs Endspielregeln (Kapitel 8)“; Abb. 12.1 →
 * Mittelspiel, „Skelett-Röntgen (Kapitel 5), drei Planfragen (Kapitel 6)“.
 */
export function werkzeugJePhase(stellung: Stellung, abschnitt?: string): Werkzeugergebnis {
  const p = profil(stellung);
  const befund = phase(stellung, p.angriffskarte, p.drohungen);
  const befunde: Befund[] = [
    {
      kennung: "phase",
      art: "N",
      titel: t("phase.phaseTitel"),
      zeilen: phasenzeilen(befund),
      farbe: null,
    },
    {
      kennung: "werkzeuge",
      art: "V",
      titel: t("phase.werkzeugeTitel"),
      zeilen: werkzeugzeilen(befund.phase),
      farbe: "gold",
    },
  ];
  const partie = partiebefund(abschnitt);
  if (partie) befunde.push(partie);
  const kennungen = befunde.map((b) => b.kennung);
  return {
    werkzeug: "k11-phase",
    art: "N",
    ueberschrift: t("phase.titel"),
    befunde,
    fazit: t(`phase.fazit.${befund.phase}`),
    markierungen: markierungen(stellung, befund),
    stufen: [["phase"], ["phase", "werkzeuge"], kennungen],
    regel: t("werkzeug.k11-phase.regel"),
  };
}

/** Das Werkzeug k11-phase in der gemeinsamen Form aller Werkzeuge (Konzept 7.1). */
export const k11Phase: Werkzeug = {
  id: "k11-phase",
  kapitel: 11,
  name: "werkzeug.k11-phase.name",
  regel: "werkzeug.k11-phase.regel",
  erklaerung: "werkzeug.k11-phase.erklaerung",
  art: "N",
  braucht: ["stellung"],
  berechne: ({ stellung, abschnitt }) => werkzeugJePhase(stellung, abschnitt),
};

/**
 * Werkzeug k3-faktorenbilanz: die vier Faktoren aus Kapitel 3 (Material, Zeit, Königssicherheit,
 * Aktivität) für beide Seiten, dazu Haltbarkeit und Fazit.
 *
 * Rolle im Gesamtbild: Pflichtenheft 6.2, Faktorenbilanz. Material und Zeit werden verglichen
 * (Waage, Art E), Königssicherheit und Aktivität je Seite bewertet (Art N), die Haltbarkeit ist
 * vorbereiteter Text nach der Tabelle „Wie lange hält welcher Faktor?“ (Art V). Hervorhebungen:
 * Gold die gezählten Figuren im Spiel, Rot Linien zum König.
 * Abhängigkeiten: schach/faktorenbilanz.ts, schach/faktoreinschaetzung.ts, stellungsprofil, i18n.
 * Buchbezug: Kapitel 3, „Kompensation messen statt fühlen: die Faktorenbilanz“; kalibriert an
 * allen 18 Faktorenbilanzen (Kapitel 3, 6 und 11).
 */
import type { Color, Role } from "chessops/types";
import { t } from "../i18n/sprache";
import {
  aktivitaet,
  aktivitaetszahlen,
  koenigssicherheit,
  type Aktivitaetseinschaetzung,
  type Einschaetzung,
  type Koenigseinschaetzung,
} from "../schach/faktoreinschaetzung";
import {
  materialvergleich,
  zeitvergleich,
  type Materialvergleich,
  type Waage,
  type Zeitvergleich,
} from "../schach/faktorenbilanz";
import { feldname, gegner, ROLLENBUCHSTABE, type Stellung } from "../schach/stellung";
import { faktormarkierungen } from "./bilanzmarkierungen";
import { befundSchach, entschieden, entschiedenesErgebnis } from "./faktorenschach";
import { profil, type Stellungsprofil } from "./stellungsprofil";
import { aufzaehlung, farbname, figurkurz } from "./texte";
import type { Befund, Waagenanzeige, Werkzeug, Werkzeugergebnis } from "./werkzeug";

/** Buchstaben der Linien a bis h, für „f-Linie“ und „ohne f-Bauern“ (Kapitel 3). */
const LINIENBUCHSTABEN = "abcdefgh";
/** Reihenfolge der Figuren in der Materialaufzählung (wie Abb. 6.31: „Dame, Turm, Springer …“). */
const MATERIALFOLGE: readonly Role[] = ["queen", "rook", "bishop", "knight", "pawn"];
/** Rangfolge der Einschätzungen, um „besser“ zu bestimmen. */
const RANG: Readonly<Record<Einschaetzung, number>> = { gut: 2, teils: 1, schlecht: 0 };
/** Zahlen, für die es ein Zahlwort gibt (eins steht als Einzahl ohne Zahl); sonst Ziffern. */
const ZAHLWOERTER = [2, 3, 4, 5, 6, 7, 8, 9, 10] as const;
type Zahlwort = (typeof ZAHLWOERTER)[number];

function hatZahlwort(anzahl: number): anzahl is Zahlwort {
  return (ZAHLWOERTER as readonly number[]).includes(anzahl);
}

/** Die Bewertung beider Seiten bei einem Faktor. */
interface Seitenpaar<T> {
  readonly eigen: T;
  readonly gegner: T;
}

function anzahlText(anzahl: number, rolle: Role): string {
  const buchstabe = ROLLENBUCHSTABE[rolle];
  if (anzahl === 1) return t(`figur.${buchstabe}`);
  const zahl = hatZahlwort(anzahl) ? t(`zahl.${anzahl}`) : String(anzahl);
  return `${zahl} ${t(`figurMehrzahl.${buchstabe}`)}`;
}

/** „Dame, zwei Türme, …, sieben Bauern (39)“. */
function bestandText(m: Materialvergleich, farbe: Color): string {
  const teile = MATERIALFOLGE.flatMap((rolle) => {
    const anzahl = m.bestand[farbe].get(rolle) ?? 0;
    return anzahl > 0 ? [anzahlText(anzahl, rolle)] : [];
  });
  return t("faktoren.bestand", {
    farbe: farbname(farbe),
    figuren: teile.length > 0 ? teile.join(", ") : t("faktoren.nichts"),
    summe: m.summe[farbe],
  });
}

/** Beide Seiten in fester Reihenfolge, wie im Buch: Weiß links, Schwarz rechts. */
const WEISS_SCHWARZ: readonly Color[] = ["white", "black"];

/**
 * Die Waage einer Gegenüberstellung: Weiß links, Schwarz rechts, gleich wer am Zug ist.
 *
 * Warum: Wunsch des Autors nach dem Nachtest von 0.2.26: Die Schalen wechselten mit der Seite am
 * Zug; in Abb. 3.10, 3.14 und 3.20 stand die Waage deshalb seitenverkehrt zum Buch.
 */
function waagenanzeige(w: Waage, vorsprung: string): Waagenanzeige {
  const neigung = w.vorn === null ? "gerade" : w.vorn === "white" ? "links" : "rechts";
  return { links: farbname("white"), rechts: farbname("black"), neigung, vorsprung };
}

/** Der Wert eines Seitenpaars für eine Farbe. */
function von<T>(paar: Seitenpaar<T>, eigen: Color, farbe: Color): T {
  return farbe === eigen ? paar.eigen : paar.gegner;
}

function befundMaterial(m: Materialvergleich): Befund {
  return {
    kennung: "material",
    art: "E",
    titel: t("faktoren.material"),
    zeilen: WEISS_SCHWARZ.map((farbe) => bestandText(m, farbe)),
    farbe: null,
    waage: waagenanzeige(m, t("faktoren.plus", { wert: m.um })),
  };
}

function befundZeit(z: Zeitvergleich): Befund {
  const zeile = (farbe: Color) =>
    t("faktoren.imSpiel", {
      farbe: farbname(farbe),
      anzahl: z.imSpiel[farbe].length,
      figuren:
        z.imSpiel[farbe].length > 0 ? `(${aufzaehlung(z.imSpiel[farbe].map(figurkurz))})` : "",
    }).trim();
  const vorsprung = t(z.um === 1 ? "faktoren.figur" : "faktoren.figuren", { wert: z.um });
  return {
    kennung: "zeit",
    art: "E",
    titel: t("faktoren.zeit"),
    zeilen: [...WEISS_SCHWARZ.map(zeile), ...(z.schwarzAmZug ? [t("faktoren.abzug")] : [])],
    farbe: "gold",
    waage: waagenanzeige(z, vorsprung),
  };
}

/**
 * Der Grund der Königssicherheit als Text.
 *
 * Regel: Kapitel 3, Abb. 3.6 und 3.42 („rochiert, aber ohne f-Bauern vor dem König“). Nach C1.5
 * nennt die App einen gegnerischen Turm oder die Dame nur, wenn kein Bauer zwischen ihm und dem
 * König steht, und dann mit der richtigen Art der Linie (offen: ohne Bauern, halboffen: nur mit
 * gegnerischen Bauern).
 */
function koenigsgrund(e: Koenigseinschaetzung, stellung: Stellung): string {
  const linien = e.linien ?? [];
  if (e.grund === "rochiertOhneBauer") {
    const buchstaben = linien.map((l) => `${LINIENBUCHSTABEN.charAt(l.linie)}-`);
    return t("faktoren.koenig.rochiertOhneBauer", { linien: aufzaehlung(buchstaben) });
  }
  if (e.grund === "rochiertLinie") {
    const linie = linien[0];
    const figur = e.figur === undefined ? undefined : stellung.brett.get(e.figur);
    if (!linie || !figur || e.figur === undefined) return t("faktoren.koenig.rochiertGelockert");
    const schluessel =
      figur.role === "queen"
        ? "faktoren.koenig.rochiertLinieDame"
        : "faktoren.koenig.rochiertLinieTurm";
    return t(schluessel, {
      feld: feldname(e.figur),
      zustand: t(linie.zustand === "offen" ? "faktoren.linie.offen" : "faktoren.linie.halboffen"),
      linie: LINIENBUCHSTABEN.charAt(linie.linie),
    });
  }
  return t(`faktoren.koenig.${e.grund}`);
}

function befundKoenig(
  k: Seitenpaar<Koenigseinschaetzung>,
  eigen: Color,
  stellung: Stellung,
): Befund {
  const zeile = (farbe: Color, e: Koenigseinschaetzung) =>
    t("faktoren.seite", {
      farbe: farbname(farbe),
      wertung: t(`faktoren.wertung.${e.wertung}`),
      grund: koenigsgrund(e, stellung),
    });
  return {
    kennung: "koenig",
    art: "N",
    titel: t("faktoren.koenigssicherheit"),
    zeilen: WEISS_SCHWARZ.map((farbe) => zeile(farbe, von(k, eigen, farbe))),
    farbe: "rot",
  };
}

/** „3 im Spiel, 1 Ziel angegriffen, 2 Drohungen“ mit Einzahl und Mehrzahl. */
function aktivitaetsgrund(e: Aktivitaetseinschaetzung): string {
  if (e.grund === "keineFigur" || e.grund === "gebunden")
    return t(`faktoren.aktivitaet.${e.grund}`);
  const { imSpiel, ziele, drohungen } = e.zahlen;
  return t("faktoren.aktivitaet.zahlen", {
    imSpiel,
    ziele: t(ziele === 1 ? "faktoren.ziel" : "faktoren.ziele", { anzahl: ziele }),
    drohungen: t(drohungen === 1 ? "faktoren.drohung" : "faktoren.drohungen", {
      anzahl: drohungen,
    }),
  });
}

function befundAktivitaet(a: Seitenpaar<Aktivitaetseinschaetzung>, eigen: Color): Befund {
  const zeile = (farbe: Color, e: Aktivitaetseinschaetzung) =>
    t("faktoren.seite", {
      farbe: farbname(farbe),
      wertung: t(`faktoren.wertung.${e.wertung}`),
      grund: aktivitaetsgrund(e),
    });
  return {
    kennung: "aktivitaet",
    art: "N",
    titel: t("faktoren.aktivitaetTitel"),
    zeilen: WEISS_SCHWARZ.map((farbe) => zeile(farbe, von(a, eigen, farbe))),
    farbe: null,
  };
}

/** Königssicherheit und Aktivität beider Seiten aus dem Stellungsprofil. */
function einschaetzungen(p: Stellungsprofil, z: Zeitvergleich, eigen: Color) {
  const andere = gegner(eigen);
  const koenigVon = (farbe: Color) =>
    koenigssicherheit(
      p.koenigsumgebung(farbe),
      p.stellung.brett.pieces(gegner(farbe), "queen").nonEmpty(),
    );
  const zahlenVon = (farbe: Color) =>
    aktivitaetszahlen(
      p.angriffskarte,
      farbe,
      gegner(farbe),
      z.imSpiel[farbe].length,
      p.drohungen(farbe)?.length ?? 0,
    );
  const [zEigen, zGegner] = [zahlenVon(eigen), zahlenVon(andere)];
  return {
    koenig: { eigen: koenigVon(eigen), gegner: koenigVon(andere) },
    aktivitaet: { eigen: aktivitaet(zEigen, zGegner), gegner: aktivitaet(zGegner, zEigen) },
  };
}

/**
 * Die vier Faktoren ohne Texte: Material und Zeit (Waage) und die Einschätzungen je Seite.
 *
 * Warum: Grundlage der Anzeige und der Kalibrierung an den Bilanzen des Buches (Konzept 13).
 * Eingaben: Stellung, eigene Seite. Beispiel: Abb. 3.14 (Evans): Zeit Schwarz +1.
 */
export function faktorwertungen(stellung: Stellung, eigen: Color) {
  const p = profil(stellung);
  const material = materialvergleich(stellung.brett);
  const zeit = zeitvergleich(stellung.brett, stellung.amZug);
  return { p, material, zeit, ...einschaetzungen(p, zeit, eigen) };
}

/** Der Faktor, die Seite, die dort vorn liegt oder besser steht. */
interface Vorteil {
  readonly faktor: "material" | "zeit" | "koenig" | "aktivitaet";
  readonly seite: Color;
}

function besser(paar: Seitenpaar<{ wertung: Einschaetzung }>, eigen: Color): Color | null {
  const unterschied = RANG[paar.eigen.wertung] - RANG[paar.gegner.wertung];
  if (unterschied === 0) return null;
  return unterschied > 0 ? eigen : gegner(eigen);
}

function vorteile(
  m: Materialvergleich,
  z: Zeitvergleich,
  e: ReturnType<typeof einschaetzungen>,
  eigen: Color,
): Vorteil[] {
  const liste: [Vorteil["faktor"], Color | null][] = [
    ["material", m.vorn],
    ["zeit", z.vorn],
    ["koenig", besser(e.koenig, eigen)],
    ["aktivitaet", besser(e.aktivitaet, eigen)],
  ];
  return liste.flatMap(([faktor, seite]) => (seite === null ? [] : [{ faktor, seite }]));
}

/**
 * Haltbarkeit: wie lange die Vorteile halten.
 *
 * Regel: Kapitel 3, Tabelle „Wie lange hält welcher Faktor?“ (Material dauerhaft, Zeit kurz,
 * Königssicherheit so lange, wie der König nicht in Sicherheit kommt, Aktivität kurz bis
 * dauerhaft). Vorbereiteter Text (Art V), in eigenen Worten.
 */
function befundHaltbarkeit(liste: readonly Vorteil[]): Befund {
  const zeilen = liste.map((v) =>
    t(`faktoren.haltbarkeit.${v.faktor}`, { farbe: farbname(v.seite) }),
  );
  return {
    kennung: "haltbarkeit",
    art: "V",
    titel: t("faktoren.haltbarkeitTitel"),
    zeilen: zeilen.length > 0 ? zeilen : [t("faktoren.haltbarkeit.keine")],
    farbe: null,
  };
}

/** Fazit: wer wo vorn liegt; bei Kompensation der Hinweis auf das Urteil der Engine. */
function fazit(liste: readonly Vorteil[]): string {
  if (liste.length === 0) return t("faktoren.fazit.gleich");
  const teile = WEISS_SCHWARZ.flatMap((seite) => {
    const faktoren = liste
      .filter((v) => v.seite === seite)
      .map((v) => t(`faktoren.name.${v.faktor}`));
    return faktoren.length > 0
      ? [t("faktoren.fazit.seite", { farbe: farbname(seite), faktoren: aufzaehlung(faktoren) })]
      : [];
  });
  const kompensation = new Set(liste.map((v) => v.seite)).size > 1;
  return `${teile.join(" ")}${kompensation ? ` ${t("faktoren.fazit.kompensation")}` : ""}`;
}

/**
 * Zieht die Faktorenbilanz einer Stellung.
 *
 * Warum: „Ob sich ein Gambit für dich lohnt, hängt an einer Frage: ‚Erhalte ich genug für den
 * Bauern?‘“ (Kapitel 3). Eingaben: Stellung und eigene Seite (für die Wertungen; auf der Waage
 * steht wie im Buch immer Weiß links).
 * Ausgabe: Material und Zeit mit Waage, Königssicherheit und Aktivität je Seite, Haltbarkeit.
 * Beispiel: Abb. 3.10 (Muzio-Gambit): Material Schwarz +3, Zeit Weiß +2 Figuren, Königssicherheit
 * Weiß gut, Schwarz schlecht.
 * Sonderfälle: Ohne Regeln (Lehrbild) zählen keine Drohungen. Ist die Seite am Zug matt oder
 * patt, steht nur „Matt: Die Partie ist entschieden.“ (Abb. 3.60, 3.69); steht sie im Schach,
 * kommt der Hinweis „Erst das Schach und die Taktik zu Ende rechnen …“ vor die Bilanz (Abb. 3.23).
 */
export function faktorenbilanz(stellung: Stellung, eigen: Color): Werkzeugergebnis {
  const ende = entschieden(stellung);
  if (ende) return entschiedenesErgebnis(stellung, ende);
  const { p, material: m, zeit: z, ...e } = faktorwertungen(stellung, eigen);
  const liste = vorteile(m, z, e, eigen);
  const imSchach = stellung.regeln?.isCheck() ?? false;
  const vorweg = imSchach ? ["schach"] : [];
  const schachFazit = imSchach
    ? `${t("faktoren.fazit.schach", { farbe: farbname(stellung.amZug) })} `
    : "";
  return {
    werkzeug: "k3-faktorenbilanz",
    art: "N",
    ueberschrift: t("faktoren.titel"),
    befunde: [
      ...(imSchach ? [befundSchach(stellung)] : []),
      befundMaterial(m),
      befundZeit(z),
      befundKoenig(e.koenig, eigen, stellung),
      befundAktivitaet(e.aktivitaet, eigen),
      befundHaltbarkeit(liste),
    ],
    fazit: `${schachFazit}${fazit(liste)}`,
    markierungen: faktormarkierungen(p, z, eigen, e.koenig.eigen.wertung),
    stufen: [
      [...vorweg, "material", "zeit"],
      [...vorweg, "material", "zeit", "koenig", "aktivitaet"],
      [...vorweg, "material", "zeit", "koenig", "aktivitaet", "haltbarkeit"],
    ],
    regel: t("werkzeug.k3-faktorenbilanz.regel"),
  };
}

/** Das Werkzeug k3-faktorenbilanz in der gemeinsamen Form aller Werkzeuge (Konzept 7.1). */
export const k3Faktorenbilanz: Werkzeug = {
  id: "k3-faktorenbilanz",
  kapitel: 3,
  name: "werkzeug.k3-faktorenbilanz.name",
  regel: "werkzeug.k3-faktorenbilanz.regel",
  erklaerung: "werkzeug.k3-faktorenbilanz.erklaerung",
  art: "N",
  braucht: ["stellung"],
  berechne: ({ stellung, perspektive }) => faktorenbilanz(stellung, perspektive),
};

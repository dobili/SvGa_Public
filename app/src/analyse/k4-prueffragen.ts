/**
 * Werkzeug k4-prueffragen: die drei Prüffragen F1 bis F3 aus Kapitel 4, vor einem geplanten Zug.
 *
 * Rolle im Gesamtbild: Pflichtenheft 6.2 („F1 ‚Warum lässt mein Gegner das zu?‘ als vorbereiteter
 * Text. F2: die Engine zeigt die zwei stärksten Antworten des Gegners (Karte AntwortenKarte, weil
 * die Engine Zeit braucht). F3: alle absoluten und
 * relativen Fesselungen, auch die, die erst durch den geplanten Zug entstehen“). Der geplante Zug
 * ist in der Abbildung der nächste Zug im Buch; ohne ihn prüft F3 nur die Stellung.
 * Hervorhebungen: Grau Fesselungslinien, Rot neue oder bleibende Fesselungen gegen die eigene
 * Seite nach dem geplanten Zug, Gold der geplante Zug.
 * Abhängigkeiten: schach/fesselungen.ts, analyse/stellungsprofil.ts, chessops, i18n.
 * Buchbezug: Kapitel 4, „Die drei Prüffragen“ und die Fallenchecks (Abb. 4.2, 4.13, 4.17, 4.21).
 */
import { parseSan } from "chessops/san";
import type { Color } from "chessops/types";
import type { Chess } from "chessops/chess";
import { sprache, t } from "../i18n/sprache";
import {
  fesselungslinien,
  linienschluessel,
  vergleicheFesselungen,
  type Fesselungslinie,
  type Fesselungsvergleich as Vergleich,
} from "../schach/fesselungen";
import { sanInSprache } from "../schach/notation";
import { feldname, gegner, type Stellung } from "../schach/stellung";
import { profil } from "./stellungsprofil";
import type { Befund, Markierung, Werkzeug, Werkzeugergebnis } from "./werkzeug";
import { farbname, figurenname } from "./texte";

/** So viele scheinbare Geschenke nennt F1 höchstens. */
const HOECHSTENS_GESCHENKE = 3;
/** So viele Antworten des Gegners, die eine Fesselung aufbauen, nennt F3 höchstens. */
const HOECHSTENS_ANTWORTEN = 4;

/** Der geplante Zug, gelesen und ausgeführt. */
interface GeplanterZug {
  readonly san: string;
  readonly von: string;
  readonly nach: string;
  readonly schlaegt: boolean;
  readonly danach: Chess;
}

function inSprache(san: string): string {
  return sanInSprache(san, sprache());
}

/** Liest den geplanten Zug (SAN, englisch); null, wenn er in dieser Stellung nicht geht. */
function plane(regeln: Chess, san: string | undefined): GeplanterZug | null {
  if (!san) return null;
  const zug = parseSan(regeln, san);
  if (!zug || !("from" in zug)) return null;
  // Die Rochade steht in chessops als König auf das eigene Turmfeld: Nur gegnerische Figuren zählen.
  const feind = regeln.board[gegner(regeln.turn)];
  const enPassant = regeln.board.getRole(zug.from) === "pawn" && regeln.epSquare === zug.to;
  const schlaegt = feind.has(zug.to) || enPassant;
  const danach = regeln.clone();
  danach.play(zug);
  return { san, von: feldname(zug.from), nach: feldname(zug.to), schlaegt, danach };
}

/** Eine Fesselungslinie als Satz, etwa „Läufer b4 fesselt Springer d2 an König e1 (absolut)“. */
function satz(linie: Fesselungslinie): string {
  const namen = {
    von: figurenname(linie.von),
    gefesselt: figurenname(linie.gefesselt),
    hinten: figurenname(linie.hinten),
  };
  if (linie.abschirmend) {
    return t("prueffragen.verdeckt", { ...namen, abschirmend: figurenname(linie.abschirmend) });
  }
  const art = t(linie.absolut ? "prueffragen.absolut" : "prueffragen.relativ");
  return t("prueffragen.direkt", { ...namen, art });
}

/**
 * F1: der Anlass für die Warum-Frage.
 *
 * Regel: Kapitel 4, F1 („Frage dich bei jedem angebotenen Material zuerst: ‚Warum lässt mein
 * Gegner das zu?‘“). Angebotenes Material: der geplante Schlag, sonst Schläge mit Gewinn laut
 * Abtauschrechnung (wie W5).
 */
function warumFrage(stellung: Stellung, eigen: Color, plan: GeplanterZug | null): string[] {
  const wer = farbname(gegner(eigen));
  if (plan?.schlaegt) return [t("prueffragen.f1.schlag", { zug: inSprache(plan.san), wer })];
  const geschenke = (profil(stellung).schlaegeVon(eigen) ?? []).filter((s) => s.bilanz > 0);
  if (geschenke.length === 0) return [];
  return geschenke
    .slice(0, HOECHSTENS_GESCHENKE)
    .map((schlag) =>
      t("prueffragen.f1.geschenk", { zug: inSprache(schlag.san), wert: schlag.bilanz, wer }),
    );
}

/** Zeilen des zweiten Teils von F3: Was ändert der geplante Zug an den Fesselungen? */
function zeilenNach(v: Vergleich): string[] {
  const zeilen = [
    ...v.aufgehoben.map((l) => t("prueffragen.aufgehoben", { linie: satz(l) })),
    ...v.neu.map((l) => t("prueffragen.neu", { linie: satz(l) })),
    ...v.bleibt.map((l) => t("prueffragen.bleibt", { linie: satz(l) })),
    ...v.antworten
      .slice(0, HOECHSTENS_ANTWORTEN)
      .map((a) => t("prueffragen.antwort", { zug: inSprache(a.san), linie: satz(a.linie) })),
  ];
  const zweite = zweiteFesselung(v);
  return [t(zweite ? "prueffragen.zweite.ja" : "prueffragen.zweite.nein"), ...zeilen];
}

/** Ja beim zweiten Teil von F3: Nach dem Zug steht eine Fesselung gegen dich oder der Gegner baut eine auf. */
function zweiteFesselung(v: Vergleich): boolean {
  return v.neu.length + v.bleibt.length + v.antworten.length > 0;
}

function pfeil(linie: Fesselungslinie, farbe: "grau" | "rot"): Markierung {
  return { typ: "pfeil", farbe, von: feldname(linie.von.feld), nach: feldname(linie.hinten.feld) };
}

function fazit(linien: readonly Fesselungslinie[], plan: GeplanterZug | null, v: Vergleich | null) {
  if (plan && v && zweiteFesselung(v)) {
    return t("prueffragen.fazit.zweite", { zug: inSprache(plan.san) });
  }
  if (linien.length > 0) return t("prueffragen.fazit.fesselungen");
  return t("prueffragen.fazit.keine");
}

/** Befund zum zweiten Teil von F3, nur mit geplantem Zug. */
function befundNach(plan: GeplanterZug, v: Vergleich): Befund {
  return {
    kennung: "f3-nach",
    art: "E",
    titel: t("prueffragen.f3nach", { zug: inSprache(plan.san) }),
    zeilen: zeilenNach(v),
    farbe: "rot",
  };
}

/** Die Befunde F1, F2, F3 und, mit geplantem Zug, der zweite Teil von F3. */
function alleBefunde(
  stellung: Stellung,
  eigen: Color,
  plan: GeplanterZug | null,
  linien: readonly Fesselungslinie[],
  v: Vergleich | null,
): Befund[] {
  const f1 = warumFrage(stellung, eigen, plan);
  const f3 = linien.length > 0 ? linien.map(satz) : [t("prueffragen.keine")];
  const f3Befunde: Befund[] = [
    { kennung: "f3", art: "E", titel: t("prueffragen.f3"), zeilen: f3, farbe: "grau" },
    ...(plan && v ? [befundNach(plan, v)] : []),
  ];
  // Ohne angebotenes Material entfallen F1 und F2; der Fesselungs-Check gilt trotzdem (Buch,
  // Fallenchecks zu Abb. 4.17, 4.25, 4.29).
  if (f1.length === 0) {
    const hinweis = t("prueffragen.nurF3");
    return [
      { kennung: "f1", art: "E", titel: t("prueffragen.f1.titel"), zeilen: [hinweis], farbe: null },
      ...f3Befunde,
    ];
  }
  return [
    { kennung: "f1", art: "V", titel: t("prueffragen.f1.titel"), zeilen: f1, farbe: null },
    {
      kennung: "f2",
      art: "V",
      titel: t("prueffragen.f2.titel"),
      // Die Kachel mit den Antworten der Engine gibt es nur zu einem geplanten Zug.
      zeilen: [t(plan ? "prueffragen.f2.text" : "prueffragen.f2.ohneZug")],
      farbe: null,
    },
    ...f3Befunde,
  ];
}

/** Grau alle Fesselungslinien, Rot die gegen dich nach dem Zug, Gold der geplante Zug. */
function alleMarkierungen(
  plan: GeplanterZug | null,
  linien: readonly Fesselungslinie[],
  v: Vergleich | null,
): Markierung[] {
  // Bleibende Fesselungen stehen rot; ihr grauer Pfeil fiele genau darunter.
  const rot = new Set((v?.bleibt ?? []).map(linienschluessel));
  return [
    ...linien.filter((l) => !rot.has(linienschluessel(l))).map((l) => pfeil(l, "grau")),
    ...(v ? [...v.neu, ...v.bleibt].map((l) => pfeil(l, "rot")) : []),
    ...(plan ? [{ typ: "pfeil", farbe: "gold", von: plan.von, nach: plan.nach } as const] : []),
  ];
}

/**
 * Ergebnis, wenn kein Material im Angebot ist: Die Prüffragen greifen hier nicht.
 *
 * Warum: Wunsch des Autors (Nachtest 0.2.26): Ein Werkzeug, das in der Stellung nicht zutrifft,
 * zeigt nur einen erklärenden Satz statt leerer Fragen. Gilt, wenn weder Material angeboten wird
 * noch eine Fesselung im Spiel ist (jetzt oder nach dem geplanten Zug).
 */
function ohneAngebot(eigen: Color): Werkzeugergebnis {
  // Nur das Fazit: Derselbe Satz zusätzlich als Befund stand doppelt in der Karte (Nachtest des
  // Autors zu 0.2.27, N99).
  return {
    werkzeug: "k4-prueffragen",
    art: "E",
    ueberschrift: t("prueffragen.titel", { farbe: farbname(eigen) }),
    befunde: [],
    fazit: t("prueffragen.keinAngebot"),
    markierungen: [],
    stufen: [[], [], []],
    regel: t("werkzeug.k4-prueffragen.regel"),
  };
}

/**
 * Stellt die drei Prüffragen vor einem geplanten Zug.
 *
 * Warum: „Mit den drei Prüffragen und den fünf Warnsignalen kannst du jede Falle dieses Kapitels
 * selbst prüfen“ (Kapitel 4). Eingaben: Stellung, eigene Seite (am Zug), optional der geplante
 * Zug in SAN. Ausgabe: F1 (V), F2 (Hinweis auf die Engine), F3 jetzt und nach dem Zug (E).
 * Beispiel: Abb. 4.21 mit 8. axb4: Die Fesselung Lb4–Sd2–Ke1 ist aufgehoben, es bleibt die
 * verdeckte Dame e7 – Springer e5 – Bauer e2 – König e1: die zweite Fesselung.
 * Sonderfälle: null bei Lehrbildern ohne Regeln. Ein Zug, der nicht geht, wird übergangen. Ist
 * kein Material im Angebot (kein geplanter Schlag, kein Schlag mit Gewinn), entfallen F1 und F2;
 * ist dann auch keine Fesselung im Spiel, bleibt nur ein Hinweis.
 */
export function prueffragen(
  stellung: Stellung,
  eigen: Color,
  zug?: string,
): Werkzeugergebnis | null {
  const { regeln } = stellung;
  if (!regeln) return null;
  const plan = regeln.turn === eigen ? plane(regeln, zug) : null;
  const linien = fesselungslinien(stellung.brett, profil(stellung).angriffskarte);
  const v = plan ? vergleicheFesselungen(linien, plan.danach, eigen) : null;
  const ohneFesselung = linien.length === 0 && !(v && zweiteFesselung(v));
  if (ohneFesselung && warumFrage(stellung, eigen, plan).length === 0) return ohneAngebot(eigen);
  const befunde = alleBefunde(stellung, eigen, plan, linien, v);
  const markierungen = alleMarkierungen(plan, linien, v);
  return {
    werkzeug: "k4-prueffragen",
    art: "E",
    ueberschrift: t("prueffragen.titel", { farbe: farbname(eigen) }),
    befunde,
    fazit: fazit(linien, plan, v),
    markierungen,
    stufen: [["f1"], ["f1", "f2"], ["f1", "f2", "f3", "f3-nach"]],
    regel: t("werkzeug.k4-prueffragen.regel"),
  };
}

/** Das Werkzeug k4-prueffragen in der gemeinsamen Form aller Werkzeuge (Konzept 7.1). */
export const k4Prueffragen: Werkzeug = {
  id: "k4-prueffragen",
  kapitel: 4,
  name: "werkzeug.k4-prueffragen.name",
  regel: "werkzeug.k4-prueffragen.regel",
  erklaerung: "werkzeug.k4-prueffragen.erklaerung",
  art: "E",
  braucht: ["stellung", "zug"],
  berechne: ({ stellung, perspektive, zug }) => prueffragen(stellung, perspektive, zug),
};

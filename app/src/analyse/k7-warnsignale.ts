/**
 * Werkzeug k7-warnsignale: Taktik, Schritt 1. Die Warnsignale W1 bis W5 aus Kapitel 4, dazu W6
 * Gabelgeometrie und W7 Figur am Rand, und zu jedem Signal die Motive aus der Buchtabelle „Vom
 * Warnsignal zum Motiv“.
 *
 * Rolle im Gesamtbild: Pflichtenheft 6.3 („Wie Kapitel 4, dazu W6 Gabelgeometrie und W7 Figur
 * am Rand. Zu jedem Signal die Motive aus der Buchtabelle. Rot: Signal mit Kennzeichen. Grau:
 * Gabelfelder. W6 E, W7 N.“). Baut auf k4-warnsignale auf und ergänzt dessen Ergebnis.
 * Abhängigkeiten: k4-warnsignale.ts, schach/gabeln.ts, stellungsprofil.ts (sichere Felder), i18n.
 * Buchbezug: Kapitel 7, „Schritt 1: Wo lohnt sich die Suche?“ und Tabelle tab:k7-signale.
 */
import type { Color } from "chessops/types";
import { squareFile } from "chessops/util";
import { t, type Textschluessel, tZahl } from "../i18n/sprache";
import type { Figurenstand } from "../schach/angriffskarte";
import { eigeneReihe } from "../schach/bauernprofil";
import { gabelfelder, type Gabelfeld } from "../schach/gabeln";
import { feldname, FIGURENWERT, gegner, type Stellung } from "../schach/stellung";
import { warnsignale } from "./k4-warnsignale";
import { felderText } from "./skelett";
import { profil, type Stellungsprofil } from "./stellungsprofil";
import { aufzaehlung, farbname, figurenname } from "./texte";
import type { Befund, Markierung, Markierungsfarbe, Werkzeug, Werkzeugergebnis } from "./werkzeug";

/** W7: höchstens so viele sichere Felder (Pflichtenheft 6.6). */
const W7_HOECHSTENS_SICHERE = 2;
/** Die eigene Reihe (Index), ab der ein Feld in der gegnerischen Hälfte liegt. */
const GEGNERISCHE_HAELFTE_AB = 4;
/** Ein Freibauer auf dieser eigenen Reihe (Index) steht auf der vorletzten Reihe. */
const VORLETZTE_REIHE = 6;
/** Ab diesem Rückstand in Bauerneinheiten „stehst du auf Verlust“ (eine Leichtfigur). */
const VERLUST_AB = 3;
const ERSTE_LINIE = 0;
const LETZTE_LINIE = 7;
const GRUNDREIHE = 0;

/**
 * Die Signale je Kennung und die Motive, nach denen man sucht (Kapitel 7, „Vom Warnsignal zum
 * Motiv“). Mit Namen statt der Nummern des Buches (Entscheidung des Autors).
 */
const MOTIVE: Readonly<Record<string, Textschluessel>> = {
  W1: "motive.w1",
  W2: "motive.w2",
  W3: "motive.w3",
  W4: "motive.w4",
  W5: "motive.w5",
  W6: "motive.w6",
  W7: "motive.w7",
  freibauer: "motive.freibauer",
  verlust: "motive.verlust",
};

/** Eine Figur am Rand (W7): wenige sichere Felder und angegriffen, am Rand oder in der gegnerischen Hälfte. */
interface FigurAmRand {
  readonly stand: Figurenstand;
  readonly sichere: number;
}

/**
 * W7 einer Seite. Regel: Pflichtenheft 6.6 („Springer, Läufer, Turm oder Dame mit höchstens
 * zwei sicheren Feldern“). Präzisierung der App (Art N): nur, wenn die Figur angegriffen ist, auf
 * der a- oder h-Linie steht oder in der gegnerischen Hälfte, und nicht unangegriffen auf der
 * eigenen Grundreihe; sonst meldete jede Eröffnung die Türme in den Ecken und den Springer d2
 * (Abb. 6.16). Beispiel: Abb. 7.24, Läufer a2 ohne sicheres Feld; Abb. 7.25, Läufer b3 nach ...c4.
 */
function figurenAmRand(p: Stellungsprofil, farbe: Color): FigurAmRand[] {
  const feind = gegner(farbe);
  const ergebnis: FigurAmRand[] = [];
  for (const f of p.sichereFelder(farbe)) {
    if (f.figur.role === "king" || f.figur.role === "pawn") continue;
    if (f.sichere.length > W7_HOECHSTENS_SICHERE) continue;
    const linie = squareFile(f.feld);
    const amRand = linie === ERSTE_LINIE || linie === LETZTE_LINIE;
    const angegriffen = p.angriffskarte.angreiferVon(f.feld, feind).length > 0;
    const vorn = eigeneReihe(f.feld, farbe) >= GEGNERISCHE_HAELFTE_AB;
    const zuHause = eigeneReihe(f.feld, farbe) === GRUNDREIHE && !angegriffen;
    if (!zuHause && (angegriffen || amRand || vorn))
      ergebnis.push({ stand: { feld: f.feld, figur: f.figur }, sichere: f.sichere.length });
  }
  return ergebnis;
}

/** Materialstand der Seite in Bauerneinheiten (ohne Könige). */
function materialstand(p: Stellungsprofil, farbe: Color): number {
  let summe = 0;
  for (const s of p.angriffskarte.figuren(farbe)) summe += FIGURENWERT[s.figur.role];
  for (const s of p.angriffskarte.figuren(gegner(farbe))) summe -= FIGURENWERT[s.figur.role];
  return summe;
}

/** Zeilen zu W6 (Gabeln des Gegners gegen diese Seite) und W7 dieser Seite. */
function zusatzzeilen(gabeln: readonly Gabelfeld[], rand: readonly FigurAmRand[]): string[] {
  const zeilen = gabeln.map((g) =>
    t("warnsignale.w6", {
      figur: figurenname(g.figur),
      feld: feldname(g.feld),
      ziele: felderText(g.ziele),
    }),
  );
  for (const r of rand)
    zeilen.push(
      tZahl("warnsignale.w7", r.sichere, { figur: figurenname(r.stand), anzahl: r.sichere }),
    );
  return zeilen;
}

/** Hängt W6 und W7 an den Befund einer Seite an; „keine“ verschwindet, sobald es ein Signal gibt. */
function ergaenze(befund: Befund, zusatz: readonly string[]): Befund {
  if (zusatz.length === 0) return befund;
  const alte = befund.zeilen.filter((z) => z !== t("warnsignale.keine"));
  return { ...befund, zeilen: [...alte, ...zusatz] };
}

/** Kennungen der Signale, die in den Zeilen eines Befundes vorkommen (W1 bis W7). */
function kennungenAus(zeilen: readonly string[]): string[] {
  const alle = ["W1", "W2", "W3", "W4", "W5", "W6", "W7"];
  return alle.filter((k) => zeilen.some((z) => z.startsWith(`${k} `)));
}

/** Die Motive zu den leuchtenden Signalen, dazu Freibauer auf der vorletzten Reihe und Verlust. */
function motivzeilen(p: Stellungsprofil, eigen: Color, kennungen: readonly string[]): string[] {
  const zeilen = kennungen.map((k) =>
    t("warnsignale.motiv", { kennung: k, motive: t(MOTIVE[k] ?? "motive.w1") }),
  );
  const freibauer = p
    .bauernschwaechen(eigen)
    .freibauern.filter((f) => eigeneReihe(f.feld, eigen) >= VORLETZTE_REIHE);
  if (freibauer.length > 0)
    zeilen.push(
      t("warnsignale.motivFreibauer", {
        felder: felderText(freibauer.map((f) => f.feld)),
        motive: t(MOTIVE.freibauer ?? "motive.freibauer"),
      }),
    );
  if (materialstand(p, eigen) <= -VERLUST_AB)
    zeilen.push(t("warnsignale.motivVerlust", { motive: t(MOTIVE.verlust ?? "motive.verlust") }));
  return zeilen.length > 0 ? zeilen : [t("warnsignale.motivKeins")];
}

/** Fügt Kennungen an bestehende Beschriftungen an („W1·W7“) oder legt neue Felder an. */
function mitKennung(
  liste: Markierung[],
  feld: string,
  farbe: Markierungsfarbe,
  kennung: string,
): void {
  const vorhanden = liste.findIndex((m) => m.typ === "feld" && m.feld === feld && m.text);
  const alt = liste[vorhanden];
  if (vorhanden >= 0 && alt?.typ === "feld") {
    const teile = (alt.text ?? "").split("·");
    if (!teile.includes(kennung))
      liste[vorhanden] = { ...alt, text: [...teile, kennung].join("·") };
    return;
  }
  liste.push({ typ: "feld", farbe, feld, text: kennung });
}

/**
 * Sucht die Warnsignale W1 bis W7 in einer Stellung.
 *
 * Eingaben: Stellung, eigene Seite. Ausgabe: die Befunde von k4-warnsignale (eigene Gefahren rot,
 * Ziele beim Gegner gold, W5), ergänzt um W6 und W7, dazu die Motive je Signal. Beispiel:
 * Abb. 7.14 nach 1. Th8+ Kxh8: beim Gegner W6 (Springer g5 nach f7 trifft h8 und d6).
 * Abb. 7.24 (Schwarz am Zug): W7 Läufer a2 ohne sicheres Feld, Motiv „gefangene Figur (10)“.
 */
export function warnsignaleSieben(stellung: Stellung, eigen: Color): Werkzeugergebnis {
  const p = profil(stellung);
  const feind = gegner(eigen);
  const grund = warnsignale(stellung, eigen);
  const gegenMich = gabelfelder(stellung, p.angriffskarte, feind);
  const gegenIhn = gabelfelder(stellung, p.angriffskarte, eigen);
  const meinRand = figurenAmRand(p, eigen);
  const seinRand = figurenAmRand(p, feind);
  const befunde = grund.befunde.map((b) =>
    b.kennung === "eigen"
      ? ergaenze(b, zusatzzeilen(gegenMich, meinRand))
      : b.kennung === "gegner"
        ? ergaenze(b, zusatzzeilen(gegenIhn, seinRand))
        : b,
  );
  const markierungen: Markierung[] = [...grund.markierungen];
  for (const g of gegenMich) {
    mitKennung(markierungen, feldname(g.feld), "grau", "W6");
    for (const z of g.ziele) mitKennung(markierungen, feldname(z), "rot", "W6");
  }
  for (const g of gegenIhn) mitKennung(markierungen, feldname(g.feld), "grau", "W6");
  for (const r of meinRand) mitKennung(markierungen, feldname(r.stand.feld), "rot", "W7");
  for (const r of seinRand) mitKennung(markierungen, feldname(r.stand.feld), "gold", "W7");
  const eigene = befunde.find((b) => b.kennung === "eigen")?.zeilen ?? [];
  const seine = [
    ...(befunde.find((b) => b.kennung === "gegner")?.zeilen ?? []),
    ...(befunde.find((b) => b.kennung === "w5")?.zeilen ?? []),
  ];
  const kennungen = [...new Set([...kennungenAus(eigene), ...kennungenAus(seine)])];
  befunde.push({
    kennung: "motive",
    art: "E",
    titel: t("warnsignale.motivTitel"),
    zeilen: motivzeilen(p, eigen, kennungen),
    farbe: null,
  });
  const alleKennungen = befunde.map((b) => b.kennung);
  return {
    ...grund,
    werkzeug: "k7-warnsignale",
    ueberschrift: t("warnsignale.titelSieben"),
    befunde,
    fazit: t("warnsignale.fazitSieben", {
      farbe: farbname(eigen),
      kennungen: kennungen.length > 0 ? aufzaehlung(kennungen) : t("warnsignale.keine"),
    }),
    markierungen,
    stufen: [alleKennungen, alleKennungen, alleKennungen],
    regel: t("werkzeug.k7-warnsignale.regel"),
  };
}

/** Das Werkzeug k7-warnsignale in der gemeinsamen Form aller Werkzeuge (Konzept 7.1). */
export const k7Warnsignale: Werkzeug = {
  id: "k7-warnsignale",
  kapitel: 7,
  name: "werkzeug.k7-warnsignale.name",
  regel: "werkzeug.k7-warnsignale.regel",
  erklaerung: "werkzeug.k7-warnsignale.erklaerung",
  art: "E",
  braucht: ["stellung"],
  berechne: ({ stellung, perspektive }) => warnsignaleSieben(stellung, perspektive),
};

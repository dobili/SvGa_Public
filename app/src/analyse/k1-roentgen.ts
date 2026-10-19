/**
 * Werkzeug k1-roentgen: die Schach-Röntgen-Regel. Alle Schachs, Schläge und Drohungen beider Seiten.
 *
 * Rolle im Gesamtbild: Das zweite Werkzeug aus Kapitel 1 (Pflichtenheft 6.2, Konzept 7.3). Es
 * beantwortet die ersten drei Fragen der Regel exakt; die vierte, „Optimierung“, beantwortet nur
 * die Engine (Art N), deshalb verweist das Werkzeug dafür auf den Knopf „Engine“.
 * Pfeile: Gold die eigenen Schachs, Schläge mit Gewinn und drohenden Züge; Grau ein Schlag ohne
 * Gewinn (wie Sxc5 in Abb. 1.23); Rot die Schachs und Drohungen des Gegners.
 * Abhängigkeiten: analyse/stellungsprofil.ts (Schachs, Schläge, Drohungen), i18n.
 * Buchbezug: Kapitel 1, „Dein eingebauter Fehler-Radar: die Schach-Röntgen-Regel“ und „Warum
 * ‚Schach‘ vor ‚Schlag‘ steht“ (Abb. 1.23 bis 1.25).
 */
import type { Color } from "chessops/types";
import { sprache, t, tZahl } from "../i18n/sprache";
import type { DrohenderZug, Drohung, Schachzug, Schlagzug, Zugangabe } from "../schach/drohungen";
import { sanInSprache } from "../schach/notation";
import { feldname, gegner, type Stellung } from "../schach/stellung";
import { profil } from "./stellungsprofil";
import type { Befund, Markierung, Markierungsfarbe, Werkzeug, Werkzeugergebnis } from "./werkzeug";
import { farbname, schlagtext } from "./texte";

/** So viele drohende Züge nennt die Karte mit Namen, der Rest steht als Anzahl dabei. */
const HOECHSTENS_DROHENDE = 6;

/** Rang eines Matts beim Ordnen der Drohungen: höher als jeder Materialgewinn. */
const MATTWERT = 1000;

/** Ein Zug in der Sprache des Lesers, etwa „Sf6+“. */
function zug(angabe: Zugangabe): string {
  return sanInSprache(angabe.san, sprache());
}

function schachzeilen(liste: readonly Schachzug[] | null): string[] {
  if (liste === null) return [t("roentgen.entfaellt")];
  return liste.length > 0 ? liste.map(zug) : [t("roentgen.keine")];
}

/** Schläge ohne Verlust mit ihrem Ertrag in Worten; Schläge, die Material verlieren, nur als Anzahl. */
function schlagzeilen(liste: readonly Schlagzug[] | null): string[] {
  if (liste === null) return [t("roentgen.entfaellt")];
  if (liste.length === 0) return [t("roentgen.keine")];
  const sinnvoll = liste.filter((schlag) => schlag.bilanz >= 0);
  const verlierend = liste.length - sinnvoll.length;
  const zeilen = sinnvoll.map((schlag) => `${zug(schlag)}: ${schlagtext(schlag)}`);
  return verlierend > 0
    ? [...zeilen, tZahl("roentgen.verlierende", verlierend, { anzahl: verlierend })]
    : zeilen;
}

/** Eine Drohung als Text: „Matt mit Dxh7#“ oder „Sxd4 gewinnt den Bauern“. */
function drohungstext(drohung: Drohung): string {
  if (drohung.art === "matt") return t("roentgen.mattMit", { zug: zug(drohung.zug) });
  return `${zug(drohung.zug)} ${schlagtext(drohung.zug)}`;
}

/** Wert einer Drohung zum Ordnen: Matt vor jedem Materialgewinn. */
function drohungswert(drohung: Drohung): number {
  return drohung.art === "matt" ? MATTWERT : drohung.zug.bilanz;
}

/** Drohende Züge, stärkste Drohung zuerst (c4 droht cxd5 +8 vor Lf4 droht Lxc7 +1). */
function geordnet(liste: readonly DrohenderZug[]): DrohenderZug[] {
  const staerkste = (kandidat: DrohenderZug) => Math.max(...kandidat.drohungen.map(drohungswert));
  return [...liste].sort((a, b) => staerkste(b) - staerkste(a));
}

/** Drohende eigene Züge: „g5 droht gxf6 (+3)“, höchstens sechs mit Namen. */
function drohendeZeilen(liste: readonly DrohenderZug[] | null): string[] {
  if (liste === null) return [t("roentgen.entfaellt")];
  if (liste.length === 0) return [t("roentgen.keine")];
  const genannt = geordnet(liste)
    .slice(0, HOECHSTENS_DROHENDE)
    .map((kandidat) =>
      t("roentgen.drohtZeile", {
        zug: zug(kandidat),
        drohungen: kandidat.drohungen.map(drohungstext).join(", "),
      }),
    );
  const rest = liste.length - genannt.length;
  return rest > 0 ? [...genannt, tZahl("roentgen.weitere", rest, { anzahl: rest })] : genannt;
}

function gegnerdrohungZeilen(liste: readonly Drohung[] | null): string[] {
  if (liste === null) return [t("roentgen.imSchach")];
  return liste.length > 0 ? liste.map(drohungstext) : [t("roentgen.keine")];
}

/** Ein Pfeil je Zug; doppelte Pfeile (Schach, der zugleich schlägt) erscheinen nur einmal. */
function pfeile(gruppen: readonly [Markierungsfarbe, readonly Zugangabe[]][]): Markierung[] {
  const gesehen = new Set<string>();
  const ergebnis: Markierung[] = [];
  for (const [farbe, zuege] of gruppen) {
    for (const angabe of zuege) {
      const schluessel = `${angabe.von}-${angabe.nach}`;
      if (gesehen.has(schluessel)) continue;
      gesehen.add(schluessel);
      ergebnis.push({
        typ: "pfeil",
        farbe,
        von: feldname(angabe.von),
        nach: feldname(angabe.nach),
      });
    }
  }
  return ergebnis;
}

/** Alles, was die Regel für beide Seiten findet. */
interface Fund {
  readonly eigen: Color;
  readonly schachs: readonly Schachzug[] | null;
  readonly schlaege: readonly Schlagzug[] | null;
  readonly drohende: readonly DrohenderZug[] | null;
  readonly gegnerSchachs: readonly Schachzug[] | null;
  readonly gegnerSchlaege: readonly Schlagzug[] | null;
  readonly gegnerDrohungen: readonly Drohung[] | null;
}

function finde(stellung: Stellung, eigen: Color): Fund {
  const p = profil(stellung);
  const andere = gegner(eigen);
  const amZug = stellung.amZug === eigen;
  return {
    eigen,
    schachs: p.schachsVon(eigen),
    schlaege: p.schlaegeVon(eigen),
    // Drohende Züge gibt es nur für die Seite am Zug (sie zieht als Nächstes, Konzept 7.2).
    drohende: amZug ? (p.erzwingend()?.drohende ?? null) : null,
    gegnerSchachs: p.schachsVon(andere),
    gegnerSchlaege: p.schlaegeVon(andere),
    gegnerDrohungen: p.drohungen(andere),
  };
}

/** Der wichtigste Satz zuerst, in der Reihenfolge der Regel: Matt, Schach, Gewinn, Gefahr. */
function fazit(fund: Fund): string {
  const name = farbname(fund.eigen);
  const andere = farbname(gegner(fund.eigen));
  const matt = fund.schachs?.find((schach) => schach.matt);
  if (matt) return t("roentgen.fazit.matt", { farbe: name, zug: zug(matt) });
  const teile: string[] = [];
  if ((fund.schachs?.length ?? 0) > 0) {
    teile.push(t("roentgen.fazit.schachs", { zuege: (fund.schachs ?? []).map(zug).join(", ") }));
  }
  const gewinn = fund.schlaege?.find((schlag) => schlag.bilanz > 0);
  if (gewinn) teile.push(t("roentgen.fazit.gewinn", { zug: zug(gewinn) }));
  const gefahr = fund.gegnerDrohungen ?? [];
  if (gefahr.length > 0) {
    teile.push(
      t("roentgen.fazit.gefahr", { farbe: andere, drohungen: gefahr.map(drohungstext).join(", ") }),
    );
  }
  return teile.length > 0 ? teile.join(" ") : t("roentgen.fazit.ruhig");
}

function befunde(fund: Fund): Befund[] {
  const name = farbname(fund.eigen);
  const andere = farbname(gegner(fund.eigen));
  const befund = (
    kennung: string,
    titel: string,
    zeilen: string[],
    farbe: Markierungsfarbe | null,
    art: "E" | "N" = "E",
  ): Befund => ({ kennung, art, titel, zeilen, farbe });
  return [
    befund("schachs", t("roentgen.schachs", { farbe: name }), schachzeilen(fund.schachs), "gold"),
    befund(
      "schachs-gegner",
      t("roentgen.schachsGegner", { farbe: andere }),
      schachzeilen(fund.gegnerSchachs),
      "rot",
    ),
    befund(
      "schlaege",
      t("roentgen.schlaege", { farbe: name }),
      schlagzeilen(fund.schlaege),
      "gold",
    ),
    befund(
      "schlaege-gegner",
      t("roentgen.schlaegeGegner", { farbe: andere }),
      schlagzeilen(fund.gegnerSchlaege),
      "rot",
    ),
    befund(
      "drohungen",
      t("roentgen.drohungen", { farbe: name }),
      drohendeZeilen(fund.drohende),
      "gold",
    ),
    befund(
      "drohungen-gegner",
      t("roentgen.drohungenGegner", { farbe: andere }),
      gegnerdrohungZeilen(fund.gegnerDrohungen),
      "rot",
    ),
    befund("optimierung", t("roentgen.optimierung"), [t("roentgen.optimierungText")], null, "N"),
  ];
}

/**
 * Pfeile in der Reihenfolge der Regel: Gold eigene Schachs und Schläge mit Gewinn, Grau ein Schlag,
 * der nur abtauscht (Sxc5 in Abb. 1.23), Rot Schachs und Drohungen des Gegners. Drohende eigene
 * Züge bekommen nur dann Pfeile, wenn es kein Schach und keinen Gewinnschlag gibt; sonst würde das
 * Brett unübersichtlich, und die Regel fragt die Drohungen ohnehin erst an dritter Stelle.
 */
function markierungen(fund: Fund): Markierung[] {
  const schlaege = fund.schlaege ?? [];
  const gewinne = schlaege.filter((schlag) => schlag.bilanz > 0);
  const schachs = fund.schachs ?? [];
  const ruhig = schachs.length === 0 && gewinne.length === 0;
  const drohende = ruhig ? geordnet(fund.drohende ?? []).slice(0, HOECHSTENS_DROHENDE) : [];
  const gegnerGefahr = (fund.gegnerDrohungen ?? []).map((drohung) => drohung.zug);
  return pfeile([
    ["gold", schachs],
    ["gold", gewinne],
    ["gold", drohende],
    ["grau", schlaege.filter((schlag) => schlag.bilanz === 0)],
    ["rot", fund.gegnerSchachs ?? []],
    ["rot", gegnerGefahr],
  ]);
}

/**
 * Wendet die Schach-Röntgen-Regel auf eine Stellung an.
 *
 * Warum: Das Buch verlangt vor jedem Zug vier Fragen in fester Reihenfolge: Schachs, Schläge,
 * Drohungen, Optimierung („Erlaubt mein geplanter Zug dem Gegner ein Schach, einen Schlag oder
 * eine Drohung, die ich übersehen habe?“).
 * Eingaben: Stellung und Perspektive (die eigene Seite). Für den Gegner fragt die App, was er
 * hätte, wenn er jetzt noch einmal am Zug wäre (Konzept 7.2).
 * Ausgabe: Werkzeugergebnis mit sieben Befunden. Beispiel: Abb. 1.23 (Weiß am Zug): Schachs
 * Sf6+ (Gabel gegen König und Dame) u. a., Schlag Sxc5 nur Abtausch (grauer Pfeil wie im Buch).
 * Sonderfälle: Lehrbild ohne König → null. Steht die eigene Seite im Schach, entfallen die Fragen
 * nach dem Gegner („Du stehst im Schach“).
 */
export function roentgen(stellung: Stellung, eigen: Color): Werkzeugergebnis | null {
  if (!stellung.regeln) return null;
  const fund = finde(stellung, eigen);
  const alle = befunde(fund);
  const kennungen = alle.map((b) => b.kennung);
  return {
    werkzeug: "k1-roentgen",
    art: "E",
    ueberschrift: t("roentgen.titel", { farbe: farbname(eigen) }),
    befunde: alle,
    fazit: fazit(fund),
    markierungen: markierungen(fund),
    stufen: [kennungen.slice(0, 4), kennungen, kennungen],
    regel: t("werkzeug.k1-roentgen.regel"),
  };
}

/** Das Werkzeug k1-roentgen in der gemeinsamen Form aller Werkzeuge (Konzept 7.1). */
export const k1Roentgen: Werkzeug = {
  id: "k1-roentgen",
  kapitel: 1,
  name: "werkzeug.k1-roentgen.name",
  regel: "werkzeug.k1-roentgen.regel",
  erklaerung: "werkzeug.k1-roentgen.erklaerung",
  art: "E",
  braucht: ["stellung"],
  berechne: ({ stellung, perspektive }) => roentgen(stellung, perspektive),
};

/**
 * Werkzeug k12-erfassen: Schritt 1 der Denkroutine. Was hat der letzte Zug des Gegners
 * verändert, was droht er? Warnsignale auf beiden Seiten, Phase und Werkzeug für Schritt 2.
 *
 * Rolle im Gesamtbild: Pflichtenheft 6.3 („Denkroutine Schritt 1: Stellung erfassen. E“). Rot:
 * die Drohungen des Gegners; dazu die Markierungen der Warnsignale W1 bis W7.
 * Abhängigkeiten: analyse/stellungsprofil.ts, k7-warnsignale.ts, k11-phase.ts, schach/phase.ts,
 * i18n.
 * Buchbezug: Kapitel 12, Denkroutine Schritt 1 („Frage zuerst: Was hat der letzte Zug meines
 * Gegners verändert, was droht er, und was bereitet er vor? … Suche dann auf beiden Seiten des
 * Brettes die Warnsignale … Bestimme zuletzt, in welcher Phase der Partie du bist“).
 */
import type { Color } from "chessops/types";
import { t } from "../i18n/sprache";
import type { Drohung } from "../schach/drohungen";
import { LESART, phase, phasenregel, type Phasenregel } from "../schach/phase";
import { gegner, type Stellung } from "../schach/stellung";
import type { Verlauf } from "../schach/todsuenden";
import { warnsignaleSieben } from "./k7-warnsignale";
import { phasenzeilen, werkzeugzeilen } from "./k11-phase";
import { profil } from "./stellungsprofil";
import { aufzaehlung, farbname, schlagtext, zugtext } from "./texte";
import type { Befund, Markierung, Werkzeug, Werkzeugergebnis } from "./werkzeug";

/** Eine Drohung als Zeile: „Sxe5 gewinnt den Läufer“ oder „Dh7# setzt matt“. */
function drohungstext(d: Drohung): string {
  if (d.art === "matt") return t("erfassen.drohtMatt", { zug: zugtext(d.zug.san) });
  return t("erfassen.drohtMaterial", { zug: zugtext(d.zug.san), gewinn: schlagtext(d.zug) });
}

/** Zeilen zum letzten Zug und zu den Drohungen des Gegners. */
function letzterZugZeilen(stellung: Stellung, eigen: Color, verlauf?: Verlauf): string[] {
  const zeilen: string[] = [];
  const letzter = verlauf?.zuege.at(-1);
  zeilen.push(
    letzter
      ? t("erfassen.letzter", { farbe: farbname(gegner(eigen)), zug: zugtext(letzter) })
      : t("erfassen.keinVerlauf", { farbe: farbname(gegner(eigen)) }),
  );
  const drohungen = profil(stellung).drohungen(gegner(eigen));
  if (drohungen === null) zeilen.push(t("erfassen.imSchach"));
  else if (drohungen.length === 0) zeilen.push(t("erfassen.keineDrohung"));
  else zeilen.push(t("erfassen.droht", { liste: aufzaehlung(drohungen.map(drohungstext)) }));
  return zeilen;
}

/** Rot: die Drohungen des Gegners. */
function drohungspfeile(stellung: Stellung, eigen: Color): Markierung[] {
  const drohungen = profil(stellung).drohungen(gegner(eigen)) ?? [];
  return drohungen.map((d) => ({
    typ: "pfeil",
    farbe: "rot",
    von: feldnameVon(d),
    nach: feldnameNach(d),
  }));
}

function feldnameVon(d: Drohung): string {
  return d.zug.uci.slice(0, 2);
}

function feldnameNach(d: Drohung): string {
  return d.zug.uci.slice(2, 4);
}

/** Die Zeilen eines Warnsignal-Befundes mit der Seite davor: „Schwarz: W1 Ungedeckt: Dame c7“. */
function mitSeite(signale: Werkzeugergebnis, kennung: string, seite: string): string[] {
  const zeilen = signale.befunde.find((b) => b.kennung === kennung)?.zeilen ?? [];
  return zeilen.map((zeile) => `${seite}: ${zeile}`);
}

/**
 * Erfasst die Stellung in drei Schritten: letzter Zug und Drohungen, Warnsignale, Phase.
 *
 * Eingaben: Stellung, eigene Seite, Verlauf (für den letzten Zug), Phasenregel (Glossar für
 * Stellungen des Buches, S17). Ausgabe: drei Befunde und
 * die Werkzeuge für Schritt 2.
 * Beispiel: Abb. 12.1 (griechisches Geschenk): Warnsignal W3 (König ohne Luft, Turm f8), Phase
 * Mittelspiel.
 */
export function erfassen(
  stellung: Stellung,
  eigen: Color,
  verlauf?: Verlauf,
  regel: Phasenregel = LESART,
): Werkzeugergebnis {
  const p = profil(stellung);
  const signale = warnsignaleSieben(stellung, eigen);
  const ph = phase(stellung, p.angriffskarte, p.drohungen, regel);
  const befunde: Befund[] = [
    {
      kennung: "zug",
      art: "E",
      titel: t("erfassen.zugTitel"),
      zeilen: letzterZugZeilen(stellung, eigen, verlauf),
      farbe: "rot",
    },
    {
      kennung: "warnsignale",
      art: "E",
      titel: t("erfassen.warnsignaleTitel"),
      zeilen: [
        signale.fazit,
        ...mitSeite(signale, "eigen", farbname(eigen)),
        ...mitSeite(signale, "gegner", farbname(gegner(eigen))),
      ],
      farbe: "grau",
    },
    {
      kennung: "phase",
      art: "N",
      titel: t("erfassen.phaseTitel"),
      zeilen: [...phasenzeilen(ph), ...werkzeugzeilen(ph.phase)],
      farbe: "gold",
    },
  ];
  return {
    werkzeug: "k12-erfassen",
    art: "E",
    ueberschrift: t("erfassen.titel"),
    befunde,
    fazit: t("erfassen.fazit", { phase: t(`phase.name.${ph.phase}`), signale: signale.fazit }),
    markierungen: [...drohungspfeile(stellung, eigen), ...signale.markierungen],
    stufen: [["zug"], ["zug", "warnsignale"], ["zug", "warnsignale", "phase"]],
    regel: t("werkzeug.k12-erfassen.regel"),
  };
}

/** Das Werkzeug k12-erfassen in der gemeinsamen Form aller Werkzeuge (Konzept 7.1). */
export const k12Erfassen: Werkzeug = {
  id: "k12-erfassen",
  kapitel: 12,
  name: "werkzeug.k12-erfassen.name",
  regel: "werkzeug.k12-erfassen.regel",
  erklaerung: "werkzeug.k12-erfassen.erklaerung",
  art: "E",
  braucht: ["stellung", "verlauf"],
  berechne: ({ stellung, perspektive, verlauf, buchstellung }) =>
    erfassen(stellung, perspektive, verlauf, phasenregel(buchstellung, verlauf)),
};

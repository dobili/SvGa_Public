/**
 * Werkzeug k12-kandidaten: Schritte 2 bis 4 der Denkroutine. Kandidaten sammeln (Schachs,
 * Schläge, Drohungen, dazu der Buchzug; im Schach alle Abwehrzüge; droht Matt, ein Zug, der es
 * abwehrt), die stärkste Antwort je Kandidat, Bilanz danach.
 *
 * Rolle im Gesamtbild: Pflichtenheft 6.3 („Denkroutine Schritt 2 bis 4: Kandidaten E, der Rest
 * N“). Gold: die Kandidaten; rot: die stärkste Antwort auf den ersten Kandidaten.
 * Abhängigkeiten: analyse/k12-antwort.ts, analyse/k12-kandidat.ts (Kandidat, istRuhig; hier
 * weitergereicht), analyse/stellungsprofil.ts, schach/drohungen.ts, schach/schachabwehr.ts,
 * schach/phase.ts, i18n.
 * Buchbezug: Kapitel 12, Denkroutine Schritt 2 („zuerst Schachs, dann Schläge, dann Drohungen …
 * notiere gedanklich zwei oder drei Kandidaten … Jeder erfüllt eine konkrete Aufgabe: Schach,
 * Materialgewinn, Verteidigung einer Drohung …“), Schritt 3 („Was ist die stärkste, nicht die
 * bequemste Antwort meines Gegners?“; bei Abb. 12.2: „für jedes [Feld des Königs] brauchst du
 * eine eigene Fortsetzung“), Schritt 4 („Rechne bis zur Ruhe und zähle erst dann nach“).
 */
import type { Chess } from "chessops/chess";
import { makeSan, parseSan } from "chessops/san";
import type { Color } from "chessops/types";
import { makeUci } from "chessops/util";
import { t } from "../i18n/sprache";
import {
  drohungenVon,
  erzwingendeZuege,
  nullzug,
  type ErzwingendeZuege,
} from "../schach/drohungen";
import { LESART, phase, phasenregel, type Phasenregel } from "../schach/phase";
import { abwehrzuege, besteMattabwehr } from "../schach/schachabwehr";
import { gegner, type Stellung } from "../schach/stellung";
import { besterKandidat, staerksteAntwort, type Antwort } from "./k12-antwort";
import type { Kandidat } from "./k12-kandidat";
export { istRuhig, type Kandidat, type Kandidatenart } from "./k12-kandidat";
import { werkzeugzeilen } from "./k11-phase";
import { kandidatenBefunde } from "./k12-kandidatentexte";
import { profil } from "./stellungsprofil";
import { farbname } from "./texte";
import type { Markierung, Werkzeug, Werkzeugergebnis } from "./werkzeug";

/** Höchstens so viele Kandidaten je Art und insgesamt. */
const JE_ART = 2;
const HOECHSTENS = 4;

/** Der Buchzug als Kandidat, falls er in dieser Stellung geht. */
function buchkandidat(regeln: Chess, buchzug?: string): Kandidat | null {
  const buch = buchzug ? parseSan(regeln, buchzug) : undefined;
  if (!buch) return null;
  return { san: makeSan(regeln, buch), uci: makeUci(buch), art: "ruhig", buchzug: true };
}

/** Kandidaten in Rechenreihenfolge, je Art höchstens zwei, dazu der Buchzug. */
function sammeln(e: ErzwingendeZuege, regeln: Chess, buchzug?: string): Kandidat[] {
  const liste: Kandidat[] = [
    ...e.schachs.slice(0, JE_ART).map((z) => ({ ...z, art: "schach" as const })),
    ...e.schlaege
      .filter((z) => z.bilanz >= 0)
      .slice(0, JE_ART)
      .map((z) => ({ ...z, art: "schlag" as const })),
    ...e.drohende.slice(0, JE_ART).map((z) => ({ ...z, art: "drohung" as const })),
  ]
    .slice(0, HOECHSTENS)
    .map((z): Kandidat => ({ san: z.san, uci: z.uci, art: z.art, buchzug: false }));
  const buch = buchkandidat(regeln, buchzug);
  if (buch && !liste.some((k) => k.uci === buch.uci)) liste.unshift(buch);
  return liste;
}

/**
 * Im Schach: Alle Abwehrzüge sind die Kandidaten, der Buchzug zuerst (Befund C1.29).
 *
 * Regel: Glossar „Schach“ (wegziehen, schlagen, dazwischenstellen); Kapitel 12, Schritt 3 bei
 * Abb. 12.2 und 12.3: jede Abwehr einzeln prüfen.
 */
function abwehrkandidaten(regeln: Chess, buchzug?: string): Kandidat[] {
  const buch = buchkandidat(regeln, buchzug);
  const liste = abwehrzuege(regeln).map((z): Kandidat => ({
    san: z.san,
    uci: z.uci,
    art: z.art,
    buchzug: z.uci === buch?.uci,
  }));
  return [...liste.filter((k) => k.buchzug), ...liste.filter((k) => !k.buchzug)];
}

/**
 * Droht der Gegner Matt in einem Zug, kommt ein Zug hinzu, der es abwehrt (Kapitel 12,
 * Schritt 2: „Verteidigung einer Drohung“; Auswahl in schach/schachabwehr.ts).
 * Beispiel: Abb. 12.4: Weiß droht Dxf7#; ohne diesen Kandidaten blieben nur b5 (Matt) und drei
 * Damenzüge, die die Dame verlieren.
 */
function mattabwehr(regeln: Chess, eigen: Color, liste: readonly Kandidat[]): Kandidat[] {
  const drohungen = drohungenVon(regeln, gegner(eigen)) ?? [];
  if (!drohungen.some((d) => d.art === "matt")) return [];
  const zug = besteMattabwehr(regeln, new Set(liste.map((k) => k.uci)));
  return zug ? [{ san: zug.san, uci: zug.uci, art: "mattabwehr", buchzug: false }] : [];
}

/** Gold die Kandidaten, rot die stärkste Antwort auf den ersten. */
function markierungen(
  kandidaten: readonly Kandidat[],
  antworten: readonly Antwort[],
): Markierung[] {
  const marken: Markierung[] = kandidaten.map((k) => ({
    typ: "pfeil",
    farbe: "gold",
    von: k.uci.slice(0, 2),
    nach: k.uci.slice(2, 4),
  }));
  const erste = antworten[0];
  if (erste && erste.art !== "keine") {
    marken.push({
      typ: "pfeil",
      farbe: "rot",
      von: erste.uci.slice(0, 2),
      nach: erste.uci.slice(2, 4),
    });
  }
  return marken;
}

/** Ergebnis, wenn die Regeln fehlen (Lehrbild ohne König). */
function ohneRegeln(eigen: Color): Werkzeugergebnis {
  const zeile = t("kandidaten.ohneRegeln", { farbe: farbname(eigen) });
  return {
    werkzeug: "k12-kandidaten",
    art: "E",
    ueberschrift: t("kandidaten.titel"),
    befunde: [
      {
        kennung: "sammeln",
        art: "E",
        titel: t("kandidaten.sammelnTitel"),
        zeilen: [zeile],
        farbe: null,
      },
    ],
    fazit: zeile,
    markierungen: [],
    stufen: [["sammeln"], ["sammeln"], ["sammeln"]],
    regel: t("werkzeug.k12-kandidaten.regel"),
  };
}

/** Die Kandidaten außerhalb des Schachs: Rechenreihenfolge, Buchzug, Mattabwehr. */
function gewoehnlicheKandidaten(
  stellung: Stellung,
  fuer: Chess,
  eigen: Color,
  buchzug: string | undefined,
): Kandidat[] {
  const p = profil(stellung);
  const e = p.erzwingend();
  const zuege = e && e.farbe === eigen ? e : erzwingendeZuege(fuer);
  const liste = sammeln(zuege, fuer, stellung.regeln?.turn === eigen ? buchzug : undefined);
  liste.push(...mattabwehr(fuer, eigen, liste));
  return liste;
}

/** Das Werkzeug der Phase für den besten ruhigen Zug (Schritt 2, „Zwingt nichts …“). */
function phasenwerkzeug(stellung: Stellung, regel: Phasenregel): string {
  const p = profil(stellung);
  const ph = phase(stellung, p.angriffskarte, p.drohungen, regel);
  return werkzeugzeilen(ph.phase)[0] ?? "";
}

/**
 * Die Kandidaten einer Seite, wie Schritt 2 sie sammelt: im Schach alle Abwehrzüge, sonst
 * Schachs, Schläge ohne Verlust, Drohungen, dazu der Buchzug und die Mattabwehr.
 *
 * Warum: Dieselbe Liste braucht die Engine-Rechnung der Karte (KandidatenKarte.tsx), die jeden
 * Kandidaten bewertet (R43). Eingaben: Stellung, eigene Seite, Buchzug (freiwillig). Ausgabe:
 * die Liste, leer ohne Regeln oder bei Matt. Beispiel: Abb. 12.1 → Lxh7+ und der Buchzug.
 */
export function kandidatenliste(stellung: Stellung, eigen: Color, buchzug?: string): Kandidat[] {
  const { regeln } = stellung;
  if (!regeln) return [];
  const imSchach = regeln.isCheck() && regeln.turn === eigen;
  const fuer = regeln.turn === eigen ? regeln : nullzug(regeln, eigen);
  return imSchach
    ? abwehrkandidaten(regeln, buchzug)
    : gewoehnlicheKandidaten(stellung, fuer, eigen, buchzug);
}

/**
 * Der beste Kandidat der Denkroutine als Zug in SAN (Schritt 4: bester Ausgang gegen die stärkste
 * Antwort); null ohne Regeln, ohne Kandidaten oder wenn jeder mit Matt beantwortet wird.
 *
 * Warum: Der Sicherheitsblick braucht einen Zug; ist weder ein Zug der Zugfolge noch ein
 * Buchzug da, prüft er den besten Kandidaten (Wunsch des Autors, 26.10.2026).
 * Beispiel: Abb. 12.4 (Weiß droht Dxf7#) → der Zug, der das Matt abwehrt, etwa Sf6.
 */
export function besterKandidatenzug(stellung: Stellung, eigen: Color): string | null {
  const { regeln } = stellung;
  if (!regeln) return null;
  const fuer = regeln.turn === eigen ? regeln : nullzug(regeln, eigen);
  const liste = kandidatenliste(stellung, eigen);
  const index = besterKandidat(liste.map((k) => staerksteAntwort(fuer, k.san, eigen)));
  return index === null ? null : (liste[index]?.san ?? null);
}

/**
 * Sammelt Kandidaten, prüft je Kandidat die stärkste Antwort und vergleicht die Bilanz.
 *
 * Eingaben: Stellung, eigene Seite, Buchzug (freiwillig). Ausgabe: drei Befunde (Sammeln E,
 * Antwort N, Bewerten N).
 * Beispiel: Abb. 12.1: Kandidaten 1. Lxh7+ (Schach und Schlag) und der ruhige Buchzug; auf
 * Lxh7+ ist die stärkste Antwort Kxh7. Abb. 12.3 (Schwarz im Schach): Die Abwehrzüge f5, Kh6,
 * Kh5 und Kxg5 sind die Kandidaten; auf f5 folgt Sxe6 mit Gabel gegen Dame und Turm.
 * Abb. 12.4: b5 scheidet aus (Dxf7#); dazu ein Zug, der das Matt abwehrt.
 * Sonderfälle: Ein Kandidat, der mit Matt beantwortet wird, ist der schlechteste (C1.28); ist
 * die Seite matt, gibt es keine Kandidaten. Ruhige Kandidaten (Buchzug, Mattabwehr) stehen
 * ohne Materialstand da; sie zählen im Vergleich nach Material mit (Abb. 12.4: Sf6 bleibt der
 * beste), ihr Urteil kommt aber von der Engine in der Karte (R43).
 */
export function kandidaten(
  stellung: Stellung,
  eigen: Color,
  buchzug?: string,
  regel: Phasenregel = LESART,
): Werkzeugergebnis {
  const { regeln } = stellung;
  if (!regeln) return ohneRegeln(eigen);
  const imSchach = regeln.isCheck() && regeln.turn === eigen;
  const fuer = regeln.turn === eigen ? regeln : nullzug(regeln, eigen);
  const liste = kandidatenliste(stellung, eigen, buchzug);
  const antworten = liste.map((k) => staerksteAntwort(fuer, k.san, eigen));
  const befunde = kandidatenBefunde({
    eigen,
    imSchach,
    liste,
    antworten,
    beste: besterKandidat(antworten),
    phasenwerkzeug: imSchach ? "" : phasenwerkzeug(stellung, regel),
  });
  return {
    werkzeug: "k12-kandidaten",
    art: "E",
    ueberschrift: t("kandidaten.titel"),
    befunde: befunde.befunde,
    fazit: befunde.fazit,
    markierungen: markierungen(liste, antworten),
    stufen: [["sammeln"], ["sammeln", "antwort"], ["sammeln", "antwort", "bewerten"]],
    regel: t("werkzeug.k12-kandidaten.regel"),
  };
}

/** Das Werkzeug k12-kandidaten in der gemeinsamen Form aller Werkzeuge (Konzept 7.1). */
export const k12Kandidaten: Werkzeug = {
  id: "k12-kandidaten",
  kapitel: 12,
  name: "werkzeug.k12-kandidaten.name",
  regel: "werkzeug.k12-kandidaten.regel",
  erklaerung: "werkzeug.k12-kandidaten.erklaerung",
  art: "E",
  braucht: ["stellung", "zug"],
  berechne: ({ stellung, perspektive, zug, buchstellung, verlauf }) =>
    kandidaten(stellung, perspektive, zug, phasenregel(buchstellung, verlauf)),
};

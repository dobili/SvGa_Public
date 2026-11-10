/**
 * Partieauftrag → Partieeinstellung der App (Baustein F1, docs/spiel/04_Architektur.md, Abschnitt 3).
 *
 * Rolle im Gesamtbild: Die App spielt eine Partie nach ihrer Partieeinstellung (spiel/partie.ts).
 * Das Spiel beschreibt die Partie als Partieauftrag (schnittstelle/partie.ts). Diese reine
 * Funktion übersetzt: Story-Gegner spielen wie „eigene Stufe mit Stil“ (bot null, stilname
 * gesetzt; ui/komponenten/partie/botzug.ts, profilDerPartie), mit Stufen je Phase, Häufigkeit
 * und Gewichten aus dem Profil, ohne Spielhilfen der App (die Hilfen des Abenteuers sind die
 * Karten), nie gewertet (Entscheidung A2), mit dem Feld `abenteuer`.
 * Abhängigkeiten: spiel/partie.ts, spiel/boteroeffnung.ts, engine/stile.ts,
 * schnittstelle/*, regeln/gegnerstaerke.ts.
 * Beispiel: Begegnung „mapleFalls.ersteLektion“ gegen Ambrose (Stil Angreifer, Ziel 800, feste
 * Eröffnung Königsgambit) → Stufe 3 je Phase, Häufigkeit 1,17, stilname „angreifer“, Eröffnung
 * „praxis:King's Gambit“, gewertet false, hilfen aus.
 */
import type { Color } from "chessops/types";
import type { Stilmix, Stilname } from "../../engine/stile";
import { EROEFFNUNG_PRAXIS, type Partieeinstellung } from "../../spiel/partie";
import type { Gegnerprofil } from "../schnittstelle/gegnerprofil";
import type { Partieauftrag, Startstellung } from "../schnittstelle/partie";

const MS_JE_SEKUNDE = 1000;

/** Die Grundstellung (wie spielstart/spielwahl.ts, hier ohne Abhängigkeit von der Oberfläche). */
export const GRUNDSTELLUNG = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

/** Die Start-FEN eines Auftrags; Abbildungen und Meisterpartien löst der Aufrufer vorher auf. */
export function startFenAus(stellung: Startstellung): string {
  switch (stellung.art) {
    case "grundstellung":
      return GRUNDSTELLUNG;
    case "fen":
      return stellung.fen;
    case "abbildung":
    case "meisterpartie":
      throw new Error(`Startstellung ${stellung.art} muss vorher in eine FEN aufgelöst werden`);
  }
}

/** Stil des Profils als Felder der Einstellung: ein Name oder eine Mischung. */
function stilfelder(stil: Gegnerprofil["stil"]): Pick<Partieeinstellung, "stilname" | "stilmix"> {
  if (typeof stil === "string") return { stilname: stil };
  const erster = Object.keys(stil)[0] as Stilname | undefined;
  return erster ? { stilname: erster, stilmix: stil as Stilmix } : { stilname: "universell" };
}

/**
 * Die Eröffnung der Einstellung: feste Eröffnungen wählen je Partie eine (Abweichung regelt der
 * Bot über boteroeffnung.ts nicht, weil die Partie keinen gespeicherten Gegner hat; im Prototyp
 * folgt er ihr mit der Buchtreue der Vorgabe); aus einer anderen Stellung gibt es keine Eröffnung.
 */
export function eroeffnungAus(
  profil: Gegnerprofil,
  startFen: string,
  zufall: () => number,
): string | null {
  if (startFen !== GRUNDSTELLUNG) return null;
  const e = profil.eroeffnung;
  if (e.art === "praxis") return EROEFFNUNG_PRAXIS;
  if (e.art === "frei") return null;
  const wahl = e.eroeffnungen[Math.floor(zufall() * e.eroeffnungen.length)];
  return wahl ?? EROEFFNUNG_PRAXIS;
}

/**
 * Baut die Partieeinstellung zu einem Auftrag.
 *
 * Eingaben: Auftrag mit gerechneter Stärke, ob Maia mitspielt (Paket geladen und Profil nicht
 * „unmenschlich“), Zufall für die Eröffnungswahl. Ausgabe: die Einstellung für neuePartie.
 */
export function partieeinstellungAus(
  auftrag: Partieauftrag,
  mitMaia: boolean,
  zufall: () => number = Math.random,
): Partieeinstellung {
  const startFen = startFenAus(auftrag.startstellung);
  const { stufenJePhase, haeufigkeit } = auftrag.staerke;
  const profil = auftrag.profil;
  return {
    startFen,
    eigeneFarbe: auftrag.farbe,
    stufe: stufenJePhase.mittelspiel,
    stufenJePhase,
    uhr: auftrag.uhr
      ? {
          grundzeitMs: auftrag.uhr.sekunden * MS_JE_SEKUNDE,
          zuschlagMs: auftrag.uhr.zuschlag * MS_JE_SEKUNDE,
        }
      : null,
    // Zurücknehmen nur über die Karte „Zweite Chance“ (Kartenleiste), nie frei.
    ruecknahmeErlaubt: false,
    abbildung: null,
    gegner: "engine",
    bot: null,
    botName: profil.name,
    fehlerarten: null,
    blindeFlecken: [],
    stil: 0,
    ...stilfelder(profil.stil),
    ...(profil.gewichte ? { gewichte: profil.gewichte } : {}),
    haeufigkeit,
    ...(mitMaia && profil.menschlich !== false ? { maia: true } : {}),
    hilfen: { symbole: false, werkzeuge: false },
    gewertet: false,
    eroeffnung: eroeffnungAus(profil, startFen, zufall),
    abenteuer: {
      kennung: auftrag.kennung,
      ...(auftrag.abgelenktAb ? { abgelenktAb: auftrag.abgelenktAb } : {}),
      ...(auftrag.variante ? { variante: auftrag.variante } : {}),
      ...(auftrag.kandidaten ? { kandidaten: auftrag.kandidaten } : {}),
      ...(auftrag.kulisse ? { kulisse: auftrag.kulisse } : {}),
      ...(auftrag.buchbruch ? { buchbruch: auftrag.buchbruch } : {}),
    },
  };
}

/** Farbe eines Auftrags aus den Spieldaten („zufall“ würfelt). */
export function farbeAus(farbe: "white" | "black" | "zufall", zufall: () => number): Color {
  if (farbe !== "zufall") return farbe;
  return zufall() < 0.5 ? "white" : "black";
}

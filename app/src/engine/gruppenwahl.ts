/**
 * Der Zug einer Bot-Gruppe (Gruppenmodus, Wunsch des Autors, 24.10.2026): Jeder Bot der Gruppe
 * wählt seinen Zug wie in einer eigenen Partie, die Gruppe stimmt ab und spielt den Zug mit den
 * meisten Stimmen; bei Gleichstand den der gleichauf liegenden Züge mit dem kleinsten Verlust
 * (Entscheidung des Autors, 24.10.2026 nachmittags: Mehrheit statt bester Zug).
 *
 * Rolle im Gesamtbild: Die Analyse der Stellung (engine/menschenwahl.ts, kandidatenpool) läuft
 * einmal, danach zieht jeder Bot mit seinen Stellschrauben, seiner Wertung und seinem Stil aus
 * demselben Pool (wahlAusPool). So kostet die Gruppe kaum mehr Rechenzeit als ein Bot. Spaß-Bots
 * gehören keiner Gruppe an (engine/gruppe.ts).
 * Abhängigkeiten: engine/menschenwahl.ts, engine/zugwahl.ts (Profil → Stellschrauben),
 * engine/spielbewerter.ts (Typen), engine/stufen.ts (Typ).
 */
import type { Phase } from "../schach/phase";
import { staerkeDesBots } from "./botstaerke";
import { faktorenAus } from "./gegnerbau";
import { mitgliederDerGruppe } from "./gruppe";
import { aktiveArten, kandidatenpool, wahlAusPool, type Wahlkontext } from "./menschenwahl";
import type { Spielbewerter, Zugwahl } from "./spielbewerter";
import { stufe, type Stufe, type Stufennummer } from "./stufen";
import { menschenwerteAus, type Gegnerprofil } from "./zugwahl";

/** Ein Bot der Gruppe für diesen Zug: seine Stufe (Wertung) und sein Profil. */
export interface Gruppenmitglied {
  readonly stufe: Stufe;
  readonly profil: Gegnerprofil;
}

/** Was alle Mitglieder in diesem Zug teilen: Tagesform, Restzeit der Uhr, Zeitklasse. */
export type Gemeinsames = Pick<Gegnerprofil, "verlauf" | "restMs" | "tempo">;

/**
 * Die Mitglieder der Gruppe einer Stufe für einen Zug: jeder Bot mit seiner Stufe der Phase und
 * seinem eigenen Profil (Fehlerarten, Flecken, Stil, Persönlichkeit bei seiner Wertung), dazu das
 * Gemeinsame der Partie. Gleich in der App (ui/komponenten/botzug.ts) und im Messlauf.
 * Beispiel: Stufe 2 im Mittelspiel → acht Mitglieder, jedes mit seiner Mittelspielstufe.
 */
export function mitgliederFuer(
  nummer: Stufennummer,
  phase: Phase,
  gemeinsam: Gemeinsames,
): Gruppenmitglied[] {
  return mitgliederDerGruppe(nummer).map((g) => {
    const st = stufe(g.stufenJePhase[phase]);
    return {
      stufe: st,
      profil: {
        ...gemeinsam,
        fehlerarten: g.fehlerarten,
        stil: 0,
        blindeFlecken: g.blindeFlecken,
        gewichte: faktorenAus(g.persoenlichkeit, staerkeDesBots(g.kennung) ?? st.wertung),
        stilname: g.stilname,
        haeufigkeit: g.haeufigkeit,
        zufallszuege: g.zufallszuege,
      },
    };
  });
}

/** Der Kontext eines Mitglieds für das Wahlmodell (wie in engine/zugwahl.ts, waehleZug). */
function kontextVon(m: Gruppenmitglied, verlauf: Wahlkontext["verlauf"]): Wahlkontext {
  return {
    wertung: m.stufe.wertung,
    restMs: m.profil.restMs ?? null,
    verlauf: m.profil.verlauf ?? verlauf,
    stil: m.profil.stil,
    stilname: m.profil.stilname,
    tempo: m.profil.tempo ?? "rapid",
  };
}

/**
 * Die Abstimmung: der Zug mit den meisten Stimmen; bei Gleichstand der mit dem kleinsten Verlust.
 * Beispiel: sechs Bots wollen je einen anderen Zug, zwei sind sich einig → deren Zug (2 Stimmen).
 * Beispiel: 4 : 4 zwischen Sc6 (Verlust 0) und d6 (Verlust 0,2) → Sc6. Sonderfall: ohne Stimmen null.
 */
export function abstimmung(stimmen: readonly Zugwahl[]): Zugwahl | null {
  const zaehler = new Map<string, { anzahl: number; wahl: Zugwahl }>();
  for (const wahl of stimmen) {
    const bisher = zaehler.get(wahl.uci);
    zaehler.set(wahl.uci, { anzahl: (bisher?.anzahl ?? 0) + 1, wahl: bisher?.wahl ?? wahl });
  }
  let beste: { anzahl: number; wahl: Zugwahl } | null = null;
  for (const eintrag of zaehler.values()) {
    if (
      beste === null ||
      eintrag.anzahl > beste.anzahl ||
      (eintrag.anzahl === beste.anzahl && eintrag.wahl.verlust < beste.wahl.verlust)
    ) {
      beste = eintrag;
    }
  }
  return beste?.wahl ?? null;
}

/**
 * Der Zug der Gruppe: eine Analyse, je Mitglied eine Wahl, dann die Abstimmung.
 * Eingaben: Bewerter, Stellung, Mitglieder (mindestens eines), Zufall (für Tests fest), der
 * Verlauf (Tagesform) als Vorgabe für Mitglieder ohne eigenen.
 * Ausgabe: die Zugwahl des Zuges mit den meisten Stimmen, oder null ohne legalen Zug.
 * Beispiel: Stufe 2, nach 2. Dh5 wählen fünf Bots Sc6 und drei Sf6?? → Sc6 (5 : 3).
 * Sonderfall: ohne Mitglieder null.
 */
export async function gruppenzug(
  bewerter: Spielbewerter,
  fen: string,
  mitglieder: readonly Gruppenmitglied[],
  zufall: () => number,
  verlauf: Wahlkontext["verlauf"],
): Promise<Zugwahl | null> {
  if (mitglieder.length === 0) return null;
  const werteJe = mitglieder.map((m) => menschenwerteAus(m.profil));
  const aktiv = new Set(werteJe.flatMap((w) => [...aktiveArten(w)]));
  const pool = await kandidatenpool(bewerter, fen, aktiv);
  const stimmen: Zugwahl[] = [];
  mitglieder.forEach((m, i) => {
    const werte = werteJe[i];
    const wahl = werte ? wahlAusPool(pool, fen, werte, kontextVon(m, verlauf), zufall) : null;
    if (wahl) stimmen.push(wahl);
  });
  return abstimmung(stimmen);
}

/**
 * Der Zug einer Bot-Gruppe (Gruppenmodus, Wunsch des Autors, 24.10.2026): Jeder Bot der Gruppe
 * wählt seinen Zug wie in einer eigenen Partie, die Gruppe spielt davon den Zug, den die Engine
 * am besten bewertet (den mit dem kleinsten Verlust).
 *
 * Rolle im Gesamtbild: Die Analyse der Stellung (engine/menschenwahl.ts, kandidatenpool) läuft
 * einmal, danach zieht jeder Bot mit seinen Stellschrauben, seiner Wertung und seinem Stil aus
 * demselben Pool (wahlAusPool). So kostet die Gruppe kaum mehr Rechenzeit als ein Bot. Bei
 * gleichem Verlust gewinnt der Bot, der zuerst in der Liste steht. Spaß-Bots gehören keiner
 * Gruppe an (engine/gruppe.ts).
 * Abhängigkeiten: engine/menschenwahl.ts, engine/zugwahl.ts (Profil → Stellschrauben),
 * engine/spielbewerter.ts (Typen), engine/stufen.ts (Typ).
 */
import { aktiveArten, kandidatenpool, wahlAusPool, type Wahlkontext } from "./menschenwahl";
import type { Spielbewerter, Zugwahl } from "./spielbewerter";
import type { Stufe } from "./stufen";
import { menschenwerteAus, type Gegnerprofil } from "./zugwahl";

/** Ein Bot der Gruppe für diesen Zug: seine Stufe (Wertung) und sein Profil. */
export interface Gruppenmitglied {
  readonly stufe: Stufe;
  readonly profil: Gegnerprofil;
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
 * Der Zug der Gruppe: eine Analyse, je Mitglied eine Wahl, der Zug mit dem kleinsten Verlust.
 * Eingaben: Bewerter, Stellung, Mitglieder (mindestens eines), Zufall (für Tests fest), der
 * Verlauf (Tagesform) als Vorgabe für Mitglieder ohne eigenen.
 * Ausgabe: die Zugwahl des gewählten Bots, oder null ohne legalen Zug.
 * Beispiel: Stufe 2, nach 2. Dh5 wählen fünf Bots Sc6 (Verlust 0) und drei Sf6?? → Sc6.
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
  let beste: Zugwahl | null = null;
  mitglieder.forEach((m, i) => {
    const werte = werteJe[i];
    if (!werte) return;
    const wahl = wahlAusPool(pool, fen, werte, kontextVon(m, verlauf), zufall);
    if (wahl && (beste === null || wahl.verlust < beste.verlust)) beste = wahl;
  });
  return beste;
}

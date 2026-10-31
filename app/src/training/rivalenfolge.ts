/**
 * Nach dem Ende einer Partie: Duellbilanz und Rivale (Gamifizierung P8), eine Zeile in
 * NACH_PARTIEENDE (speicher/partieprotokoll.ts).
 *
 * Rolle im Gesamtbild: Die Partie selbst ist gesperrt; diese reine Funktion bekommt die Daten
 * nach dem Speichern der Partie. Drei Schritte: (1) Gibt es noch keinen gespeicherten Rivalen,
 * wird der gezeigte (oder sonst gewählte) festgehalten, so wie er vor dieser Partie galt;
 * (2) die Bilanz gegen den Bot der Partie; (3) ein gewerteter Sieg gegen den Rivalen ist das
 * gewonnene Duell (Entscheidung E6): Datum in `verdient` („rivale:<bot>“, für Erfahrungspunkte,
 * Abzeichen und Feier), und ein neuer Rivale wird gewählt.
 * Abhängigkeiten: training/duelle.ts, training/rivalen.ts, speicher/besiegt.ts,
 * speicher/verdient.ts, spiel/elomodell.ts, speicher/format.ts (Typ).
 */
import { wertungstempo } from "../spiel/elomodell";
import type { Partie } from "../spiel/partie";
import { besiegterBot } from "../speicher/besiegt";
import type { Nutzerdaten } from "../speicher/format";
import { mitVerdient } from "../speicher/verdient";
import { duellgegner, mitDuell } from "./duelle";
import { aktuellerRivale, mitRivale, RIVALE_VERDIENT, waehleRivale } from "./rivalen";

/**
 * Die Daten, wie sie vor dem Sieg dieser Partie waren: Der Bot fehlt wieder in der Liste der
 * besiegten seiner Zeitklasse. Warum: Die Partie steht beim Aufruf schon im Spielstand; der
 * Rivale vor der Partie war aber gerade dieser Bot, wenn der Leser ihn eben besiegt hat.
 */
function vorDemSieg(daten: Nutzerdaten, partie: Partie): Nutzerdaten {
  const bot = besiegterBot(partie);
  if (!bot) return daten;
  const tempo = wertungstempo(partie.einstellung.uhr);
  const besiegt = { ...daten.spiel.besiegt, [tempo]: daten.spiel.besiegt[tempo].filter((k) => k !== bot) };
  return { ...daten, spiel: { ...daten.spiel, besiegt } };
}

/** (1) Ohne gespeicherten Rivalen: nach einer Partie gegen einen Bot den festhalten, der vorher galt. */
function sichereRivale(daten: Nutzerdaten, partie: Partie, jetzt: Date): Nutzerdaten {
  if (daten.rivale || !duellgegner(partie)) return daten;
  const rivale = aktuellerRivale(vorDemSieg(daten, partie));
  return rivale ? mitRivale(daten, rivale.kennung, jetzt) : daten;
}

/** (3) Gewerteter Sieg gegen den Rivalen: Duell gewonnen, neuer Rivale. */
function nachRivalensieg(daten: Nutzerdaten, partie: Partie, jetzt: Date): Nutzerdaten {
  const kennung = daten.rivale?.kennung;
  if (!kennung || besiegterBot(partie) !== kennung) return daten;
  const verdient = mitVerdient(daten, [`${RIVALE_VERDIENT}${kennung}`], jetzt);
  const neuer = waehleRivale(verdient, [kennung]);
  return neuer ? mitRivale(verdient, neuer.kennung, jetzt) : { ...verdient, rivale: null };
}

/**
 * Die Wirkung nach dem Partieende (rein).
 * Beispiel: gewertet gegen Rivalin Lotte gewonnen → Bilanz 1 : 0, „rivale:lotte“ verdient,
 * neuer Rivale. Sonderfall: Partie gegen einen Menschen oder die eigene Stufe → nichts.
 */
export function duelleUndRivale(daten: Nutzerdaten, partie: Partie, jetzt: Date): Nutzerdaten {
  const gesichert = sichereRivale(daten, partie, jetzt);
  const mitBilanz = { ...gesichert, duelle: mitDuell(gesichert.duelle, partie, jetzt) };
  return nachRivalensieg(mitBilanz, partie, jetzt);
}

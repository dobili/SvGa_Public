/**
 * Spielstärke durch Dialog (Wunsch des Haupt-Chats, 13.11.2026): Sagt der Held im Clubkampf von
 * Desert Springs „Atme“ (Dialogvariable atmeGesagt), spielt Mira für den Rest der Partie eine Stufe
 * stärker und ruhiger. Allgemein: `staerkeNach` je Begegnung in begegnungen.json, Bedingung →
 * Stufen (±) und wahlweise ein Stil (profil).
 *
 * Rolle im Gesamtbild: reine Regel; die Spielhülle wendet sie an, sobald sich die Dialogvariablen
 * ändern (anbindung/useStaerkewechsel.ts). Jeder Eintrag wirkt einmal je Partie; die angewandten
 * stehen in der Partie (einstellung.abenteuer.staerkeWechsel), damit ein Neuladen nichts doppelt.
 * Abhängigkeiten: regeln/bedingung.ts, spiel/partie.ts, engine/stufen.ts.
 */
import type { Stufennummer } from "../../engine/stufen";
import type { Partieeinstellung } from "../../spiel/partie";
import type { Begegnungsdaten } from "../daten/laden";
import { erfuellt } from "./bedingung";

export type Staerkewechsel = NonNullable<Begegnungsdaten["staerkeNach"]>[number];

const NIEDRIGSTE_STUFE = 1;
const HOECHSTE_STUFE = 10;

/** Stufe um `delta` verschoben, in den Grenzen 1 bis 10. */
function verschoben(stufe: Stufennummer, delta: number): Stufennummer {
  return Math.min(HOECHSTE_STUFE, Math.max(NIEDRIGSTE_STUFE, stufe + delta)) as Stufennummer;
}

/** Einstellung mit festem Stil statt Stilmischung (profil), sonst unverändert. */
function mitStil(e: Partieeinstellung, profil: Staerkewechsel["profil"]): Partieeinstellung {
  if (!profil) return e;
  const kopie: Partieeinstellung & { stilmix?: unknown } = { ...e, stilname: profil };
  delete kopie.stilmix;
  return kopie;
}

/**
 * Die Einstellung nach allen neu erfüllten Stärkewechseln, oder null, wenn keiner neu gilt.
 * Eingaben: Einstellung der laufenden Partie, Einträge der Begegnung, Dialogvariablen.
 * Beispiel: Stufe 5, [{wenn: atmeGesagt, stufe: 1, profil: positionsspieler}], atmeGesagt true →
 * Stufe 6 in allen Phasen, Stil positionsspieler, staerkeWechsel [0].
 */
export function mitStaerkewechsel(
  einstellung: Partieeinstellung,
  wechsel: readonly Staerkewechsel[],
  variablen: Readonly<Record<string, unknown>>,
): Partieeinstellung | null {
  const abenteuer = einstellung.abenteuer;
  if (!abenteuer) return null;
  const angewandt = abenteuer.staerkeWechsel ?? [];
  const neu = wechsel
    .map((w, nummer) => ({ w, nummer }))
    .filter(({ w, nummer }) => !angewandt.includes(nummer) && erfuellt(w.wenn, variablen));
  if (neu.length === 0) return null;
  return neu.reduce<Partieeinstellung>(
    (e, { w, nummer }) => ({
      ...mitStil(e, w.profil),
      stufe: verschoben(e.stufe, w.stufe),
      stufenJePhase: {
        eroeffnung: verschoben(e.stufenJePhase.eroeffnung, w.stufe),
        mittelspiel: verschoben(e.stufenJePhase.mittelspiel, w.stufe),
        endspiel: verschoben(e.stufenJePhase.endspiel, w.stufe),
      },
      abenteuer: {
        ...(e.abenteuer ?? abenteuer),
        staerkeWechsel: [...(e.abenteuer?.staerkeWechsel ?? []), nummer],
      },
    }),
    einstellung,
  );
}

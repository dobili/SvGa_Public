/**
 * Einstieg „Partie gegen diesen Bot“ mit Vorbelegung (Gamifizierung Welle 2, P8 Rivalen und P13
 * eigene Ziele).
 *
 * Rolle im Gesamtbild: Der Bildschirm „Spielen“ (ui/bildschirme/Spielen.tsx) beginnt mit den
 * gespeicherten Vorlieben. Wer eine Partie gegen einen bestimmten Bot in einer Zeitart anbieten
 * will (Revanche gegen den Rivalen, Ziel „Lotte in Schnellschach besiegen“), schreibt deshalb
 * nur die Vorlieben um und öffnet „Spielen“: Gegner Engine, dieser Bot mit seinen Stufen,
 * gewertet, eine Bedenkzeit der Zeitart. Der Leser sieht die Wahl und tippt „Beginnen“; nichts
 * am Spielstart muss sich dafür ändern, und spätere Pakete (etwa ein Turniermodus) nutzen
 * denselben Einstieg.
 * Abhängigkeiten: speicher/partien.ts (Vorlieben), engine/gegner.ts, spiel/uhr.ts,
 * spiel/elomodell.ts (Zeitklasse der Wertung), Navigation.
 */
import { useNavigation } from "../../../app/navigationsKontext";
import { gegnerVon, type EigenerGegner } from "../../../engine/gegner";
import { wertungstempo } from "../../../spiel/elomodell";
import type { Wertungstempo } from "../../../spiel/elomodell-daten";
import { UHR_VORGABEN, type Uhreinstellung } from "../../../spiel/uhr";
import { mitVorlieben, type Spielvorlieben } from "../../../speicher/partien";
import { aendere } from "../../../speicher/speicher";

/** Was vorbelegt wird: ein Bot und, wenn es darauf ankommt, die Zeitart der Wertung. */
export interface Vorbelegung {
  /** Kennung eines vorgefertigten oder eigenen Bots. Beispiel: „lotte“. */
  readonly bot: string;
  /** Zeitart wie in `besiegt`; null: die zuletzt gewählte Bedenkzeit bleibt. */
  readonly tempo: Wertungstempo | null;
}

/**
 * Die Bedenkzeit für eine Zeitart: die zuletzt gewählte, wenn sie schon passt, sonst die erste
 * passende Vorgabe. Beispiel: zuletzt 3 + 2, gewünscht Schnellschach → 10 + 0 (Partietag).
 */
export function uhrFuerTempo(
  zuletzt: Uhreinstellung | null,
  tempo: Wertungstempo | null,
): Uhreinstellung | null {
  if (tempo === null || (zuletzt && wertungstempo(zuletzt) === tempo)) return zuletzt;
  return UHR_VORGABEN.find((u) => wertungstempo(u) === tempo) ?? zuletzt;
}

/**
 * Die Vorlieben nach der Vorbelegung (rein).
 *
 * Eingaben: bisherige Vorlieben, Vorbelegung, eigene Gegner des Lesers. Ausgabe: neue Vorlieben
 * mit Gegner Engine, dem Bot und seinen Stufen je Phase, gewertet, Bedenkzeit der Zeitart; Hilfen,
 * Rücknahme und Ansicht bleiben, wie der Leser sie zuletzt hatte.
 * Beispiel: Revanche gegen „lotte“ in Blitz → bot „lotte“, Stufen von Lotte, Uhr 3 + 0.
 * Sonderfall: unbekannter Bot (gelöscht) → die Vorlieben bleiben unverändert.
 */
export function vorbelegteVorlieben(
  v: Spielvorlieben,
  belegung: Vorbelegung,
  eigene: readonly EigenerGegner[],
): Spielvorlieben {
  const gegner = gegnerVon(belegung.bot) ?? eigene.find((e) => e.kennung === belegung.bot);
  if (!gegner) return v;
  return {
    ...v,
    gegner: "engine",
    bot: belegung.bot,
    stufenJePhase: gegner.stufenJePhase,
    stufe: gegner.stufenJePhase.mittelspiel,
    gewertet: true,
    uhr: uhrFuerTempo(v.uhr, belegung.tempo),
  };
}

/**
 * Hook: liefert eine Funktion, die die Vorlieben vorbelegt und „Spielen“ öffnet.
 * Beispiel (P8): `const spiele = useSpielvorbelegung(); spiele({ bot: "lotte", tempo: null })`.
 */
export function useSpielvorbelegung(): (belegung: Vorbelegung) => void {
  const { navigiere } = useNavigation();
  return (belegung) => {
    void aendere((d) => ({
      ...d,
      spiel: mitVorlieben(
        d.spiel,
        vorbelegteVorlieben(d.spiel.vorlieben, belegung, d.spiel.eigeneGegner),
      ),
    })).then(() => navigiere({ bildschirm: "spielen" }));
  };
}

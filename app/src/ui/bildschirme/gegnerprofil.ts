/**
 * Profil des Gegners beim Anlegen einer Partie: Name, Fehlerarten, Stil und blinde Flecken.
 *
 * Rolle im Gesamtbild: aus Spielen.tsx ausgelagert (19.10.2026), damit der Bildschirm unter
 * 400 Zeilen bleibt (CLAUDE.md, Regel 4). Spielen.tsx übernimmt das Profil in die Einstellung
 * der neuen Partie.
 * Abhängigkeiten: engine/gegner.ts, speicher/partien.ts (Vorlieben).
 */
import { gegnerVon, unterAbhakliste, type EigenerGegner } from "../../engine/gegner";
import type { Spielvorlieben } from "../../speicher/partien";

/**
 * Name, Fehlerarten, Stil und blinde Flecken des gewählten Gegners für die Partie (0.2.42, 0.2.46).
 * Die Abhakliste (0.2.60) beschneidet nur die Fehlerarten der eigenen Stufe: Seit 0.2.80 steht
 * sie dort und nicht mehr in den Einstellungen, und vorgefertigte Gegner sind mit ihrer eigenen
 * Liste gemessen und beschrieben (Empfehlung nach Regel 9, Wunsch des Autors vom 18.10.2026);
 * eigene Gegner haben ihre eigene Liste. Ebenso gelten die blinden Flecken der Vorlieben (0.2.82)
 * nur für die eigene Stufe.
 */
export function gegnerprofil(
  bot: string | null,
  eigene: readonly EigenerGegner[],
  v: Pick<Spielvorlieben, "erlaubteFehlerarten" | "blindeFlecken">,
) {
  const eigener = eigene.find((g) => g.kennung === bot);
  if (eigener) {
    return {
      botName: eigener.name,
      fehlerarten: eigener.fehlerarten,
      stil: eigener.stil,
      blindeFlecken: eigener.blindeFlecken,
    };
  }
  const vorgefertigt = gegnerVon(bot);
  if (!vorgefertigt) {
    return {
      fehlerarten: unterAbhakliste(null, v.erlaubteFehlerarten),
      blindeFlecken: v.blindeFlecken,
    };
  }
  return {
    botName: vorgefertigt.name,
    fehlerarten: vorgefertigt.fehlerarten,
    stil: vorgefertigt.stil,
    blindeFlecken: vorgefertigt.blindeFlecken,
  };
}

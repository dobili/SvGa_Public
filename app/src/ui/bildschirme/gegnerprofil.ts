/**
 * Profil des Gegners beim Anlegen einer Partie: Name, Fehlerarten, Stil und blinde Flecken.
 *
 * Rolle im Gesamtbild: aus Spielen.tsx ausgelagert (19.10.2026), damit der Bildschirm unter
 * 400 Zeilen bleibt (CLAUDE.md, Regel 4). Spielen.tsx übernimmt das Profil in die Einstellung
 * der neuen Partie.
 * Abhängigkeiten: engine/gegner.ts, speicher/partien.ts (Vorlieben).
 */
import { gegnerVon, unterAbhakliste, type EigenerGegner } from "../../engine/gegner";
import { gruppenstufe } from "../../engine/gruppe";
import { staerkeGeschaetzt } from "../../engine/botstaerke";
import { gewichteAusStufen, REGLERARTEN } from "../../engine/eigenstufen";
import { gruppenname } from "../komponenten/gruppentexte";
import type { Spielvorlieben } from "../../speicher/partien";

/**
 * Die Gewichte eines eigenen Gegners für die Partie: aus den Reglerstufen (seit 0.2.126, für die
 * geschätzte Wertung des Gegners, nur angehakte Arten und Flecken; die übrigen bleiben aus), sonst
 * die alten freien Gewichte, sonst keine (wie Menschen).
 * Beispiel: „Dame früh“ angehakt auf Stufe 2, Stufen 4 · 4 · 4 → verfruehteDame etwa 2,4.
 */
function gewichteDesEigenen(g: EigenerGegner) {
  if (!g.reglerstufen) return g.gewichte;
  const aktiv = REGLERARTEN.filter(
    (a) =>
      (g.fehlerarten as readonly string[]).includes(a) ||
      (g.blindeFlecken as readonly string[]).includes(a),
  );
  const stufen = Object.fromEntries(aktiv.map((a) => [a, g.reglerstufen?.[a] ?? 0]));
  return gewichteAusStufen(stufen, staerkeGeschaetzt(g));
}

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
    const gewichte = gewichteDesEigenen(eigener);
    return {
      botName: eigener.name,
      fehlerarten: eigener.fehlerarten,
      stil: eigener.stil,
      blindeFlecken: eigener.blindeFlecken,
      // Teil E (0.2.126): einer der sieben Stile statt des Reglers, wenn gewählt.
      ...(eigener.stilname ? { stilname: eigener.stilname } : {}),
      // Erweiterter Modus (0.2.117), nur wenn eingestellt.
      ...(gewichte ? { gewichte } : {}),
      ...(eigener.haeufigkeit !== undefined ? { haeufigkeit: eigener.haeufigkeit } : {}),
      ...(eigener.hoechstverlust ? { hoechstverlust: eigener.hoechstverlust } : {}),
    };
  }
  // Gruppenmodus (engine/gruppe.ts): Name der Gruppe; die Bots bringen ihre Profile selbst mit.
  const gruppe = gruppenstufe(bot);
  if (gruppe !== null) {
    return { botName: gruppenname(gruppe), fehlerarten: null, stil: 0, blindeFlecken: [] };
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

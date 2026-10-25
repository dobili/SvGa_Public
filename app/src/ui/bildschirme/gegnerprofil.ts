/**
 * Profil des Gegners beim Anlegen einer Partie: Name, Fehlerarten, Stil und blinde Flecken.
 *
 * Rolle im Gesamtbild: aus Spielen.tsx ausgelagert (19.10.2026), damit der Bildschirm unter
 * 400 Zeilen bleibt (CLAUDE.md, Regel 4). Spielen.tsx übernimmt das Profil in die Einstellung
 * der neuen Partie.
 * Abhängigkeiten: engine/gegner.ts, speicher/partien.ts (Vorlieben).
 */
import type { BlinderFleck } from "../../engine/blindeFlecken";
import type { Reglerstufen } from "../../engine/eigenstufen";
import { FEHLERARTEN, type Fehlerart } from "../../engine/fehlerart";
import { gegnerVon, unterAbhakliste, type EigenerGegner } from "../../engine/gegner";
import { gruppenstufe } from "../../engine/gruppe";
import { wertungEigenerPersoenlichkeit } from "../../engine/persoenlichkeitswertung";
import { gewichteAusStufen, REGLERARTEN } from "../../engine/eigenstufen";
import { gruppenname } from "../komponenten/gruppentexte";
import type { Spielvorlieben } from "../../speicher/partien";

/**
 * Die Gewichte eines eigenen Gegners für die Partie: aus den Reglerstufen (seit 0.2.126, für die
 * geschätzte Wertung des Gegners, nur angehakte Arten und Flecken; die übrigen bleiben aus), sonst
 * die alten freien Gewichte, sonst keine (wie Menschen).
 * Beispiel: „Dame früh“ angehakt auf Stufe 2, Stufen 4 · 4 · 4 → verfruehteDame etwa 2,4.
 */
function gewichteDesEigenen(g: {
  readonly stufenJePhase: EigenerGegner["stufenJePhase"];
  readonly fehlerarten: readonly Fehlerart[] | null;
  readonly blindeFlecken: readonly BlinderFleck[];
  readonly reglerstufen?: Reglerstufen;
  readonly gewichte?: EigenerGegner["gewichte"];
}) {
  if (!g.reglerstufen) return g.gewichte;
  const arten: readonly string[] = g.fehlerarten ?? FEHLERARTEN;
  const flecken: readonly string[] = g.blindeFlecken;
  const aktiv = REGLERARTEN.filter((a) => arten.includes(a) || flecken.includes(a));
  const stufen = Object.fromEntries(aktiv.map((a) => [a, g.reglerstufen?.[a] ?? 0]));
  return gewichteAusStufen(stufen, wertungEigenerPersoenlichkeit(g));
}

/**
 * Die eigene Stufe (seit 0.2.126 mit denselben Einstellungen wie ein eigener Bot, Wunsch des
 * Autors): Abhakliste, Flecken, Stil, Reglerstufen, Häufigkeit, Höchstverlust. Der Stil steht immer
 * in der Partie (Vorgabe Universell); an ihm erkennt die Zugwahl, dass die Stufe mit den
 * angehakten Fehlerarten spielt (vorher rein, engine/zugwahl.ts REINES_PROFIL).
 */
function profilDerEigenenStufe(v: Vorliebenauszug) {
  const fehlerarten = unterAbhakliste(null, v.erlaubteFehlerarten);
  const gewichte = gewichteDesEigenen({ ...v, fehlerarten });
  return {
    fehlerarten,
    blindeFlecken: v.blindeFlecken,
    stilname: v.stilname ?? ("universell" as const),
    ...(v.stilmix ? { stilmix: v.stilmix } : {}),
    ...(gewichte ? { gewichte } : {}),
    ...(v.haeufigkeit !== undefined ? { haeufigkeit: v.haeufigkeit } : {}),
    ...(v.hoechstverlust ? { hoechstverlust: v.hoechstverlust } : {}),
  };
}

type Vorliebenauszug = Pick<
  Spielvorlieben,
  | "erlaubteFehlerarten"
  | "blindeFlecken"
  | "stufenJePhase"
  | "stilname"
  | "stilmix"
  | "reglerstufen"
  | "haeufigkeit"
  | "hoechstverlust"
>;

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
  v: Vorliebenauszug,
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
      ...(eigener.stilmix ? { stilmix: eigener.stilmix } : {}),
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
  if (!vorgefertigt) return profilDerEigenenStufe(v);
  return {
    botName: vorgefertigt.name,
    fehlerarten: vorgefertigt.fehlerarten,
    stil: vorgefertigt.stil,
    blindeFlecken: vorgefertigt.blindeFlecken,
  };
}

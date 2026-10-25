/**
 * Gespeicherte eigene Gegner aus 0.2.117 bis 0.2.134 für die Tests des Speicherwegs von
 * „Fehlerprofil vereinfacht“ (0.2.135): mit Stufen gestrichener Arten, ausgeschalteten Arten,
 * alten freien Gewichten und blinden Flecken einzeln.
 */
const STUFEN = { eroeffnung: 3, mittelspiel: 4, endspiel: 3 };

export const ALTE_GEGNER: readonly Record<string, unknown>[] = [
  {
    kennung: "eigen-alt-stufen",
    name: "Stufen",
    stufenJePhase: STUFEN,
    fehlerarten: ["figurHaengen", "schlagreflex", "verfruehteDame", "koenigMitte", "bauernraub"],
    stil: 0,
    stilname: "angreifer",
    blindeFlecken: ["zwischenzug", "turm"],
    reglerstufen: { schlagreflex: 2, verfruehteDame: 1, bauernraub: -1, zwischenzug: 2, turm: -1 },
    haeufigkeit: 1.2,
    hoechstverlust: { schlagreflex: 2, figurHaengen: 3 },
  },
  {
    kennung: "eigen-alt-gewichte",
    name: "Gewichte",
    stufenJePhase: STUFEN,
    fehlerarten: ["figurHaengen", "koenigPassiv", "falscherAbtausch", "pattGesetzt", "ungenau"],
    stil: 1,
    blindeFlecken: ["rueckzug"],
    gewichte: { koenigPassiv: 2.5, figurHaengen: 0.5, rueckzug: 2 },
  },
  {
    kennung: "eigen-alt-nur-gestrichen",
    name: "Nur gestrichen",
    stufenJePhase: STUFEN,
    fehlerarten: ["bauerEingestellt", "koenigszugOhneNot"],
    stil: 0,
    stilname: "universell",
    blindeFlecken: [],
    reglerstufen: { bauerEingestellt: 0 },
  },
];

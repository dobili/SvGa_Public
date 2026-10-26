/**
 * Tests von „Fehlerprofil vereinfacht“ (Auftrag „Variante A“): Regler, Achsen und Fleckengruppen,
 * Vorlagen und der Speicherweg alter Gegner (lädt, spielt unverändert, ändert sich erst beim
 * Speichern; Vergleich mit gespeicherten alten Gegnern in
 * speicher/testdaten/alteGegner-0.2.134.json).
 */
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { BLINDE_FLECKEN } from "../../../engine/blindeFlecken";
import { FEHLERARTEN } from "../../../engine/fehlerart";
import type { EigenerGegner } from "../../../engine/gegner";
import { STIL_NEUTRAL } from "../../../engine/stil";
import { eigenerGegnerAus } from "../../../speicher/gegner";
import { ALTE_GEGNER } from "../../../speicher/testdaten/alteGegner";
import { gegnerprofil } from "../../bildschirme/gegnerprofil";
import {
  alteEinstellungen,
  anzahlAn,
  artenDerAchse,
  FEHLERACHSEN,
  FLECKENGRUPPEN,
  GESTRICHENE_ARTEN,
  gruppenstufe,
  istFehlervorlage,
  istFleckenvorlage,
  mitFehlervorlage,
  mitFleckenvorlage,
  mitNiePatt,
  neutralisiert,
  REGLER_ARTEN,
  setzeGruppe,
  setztNiePatt,
} from "./fehlergruppen";
import { setzeStufe, stufeVon } from "./fehlerprofil";

const STUFE = 3;

function gegner(): EigenerGegner {
  return {
    kennung: "eigen-test",
    name: "Test",
    stufenJePhase: { eroeffnung: STUFE, mittelspiel: STUFE, endspiel: STUFE },
    fehlerarten: FEHLERARTEN,
    stil: STIL_NEUTRAL,
    blindeFlecken: [],
  };
}

/** Wirksame Gewichte der Zugwahl je Art und Fleck (wie engine/menschenwahl.ts, gewichtVon). */
function wirksam(g: EigenerGegner) {
  const p = gegnerprofil(g.kennung, [g], {
    erlaubteFehlerarten: FEHLERARTEN,
    blindeFlecken: [],
    stufenJePhase: g.stufenJePhase,
  });
  const gew: Readonly<Record<string, number>> = ("gewichte" in p ? p.gewichte : undefined) ?? {};
  const erlaubt = p.fehlerarten as readonly string[] | null;
  const flecken = p.blindeFlecken as readonly string[];
  const aus: Record<string, number> = {};
  for (const a of FEHLERARTEN) aus[a] = erlaubt && !erlaubt.includes(a) ? 0 : (gew[a] ?? 1);
  for (const f of BLINDE_FLECKEN) aus[f] = gew[f] ?? (flecken.includes(f) ? 1 : 0);
  return {
    kennung: g.kennung,
    wirksam: aus,
    haeufigkeit: "haeufigkeit" in p ? p.haeufigkeit : undefined,
    hoechstverlust: "hoechstverlust" in p ? p.hoechstverlust : undefined,
  };
}

function geladen(roh: Record<string, unknown>): EigenerGegner {
  const g = eigenerGegnerAus(roh);
  if (!g) throw new Error("Testgegner lädt nicht");
  return g;
}

describe("Aufteilung", () => {
  it("Regler, gestrichene Arten und Patt ergeben zusammen alle Fehlerarten", () => {
    const alle = [...REGLER_ARTEN, ...GESTRICHENE_ARTEN, "pattGesetzt"].sort();
    expect(alle).toEqual([...FEHLERARTEN].sort());
  });

  it("jeder Fleck gehört zu genau einer Gruppe, jede Regler-Art zu genau einer Achse", () => {
    expect(FLECKENGRUPPEN.flatMap((g) => g.flecken).sort()).toEqual([...BLINDE_FLECKEN].sort());
    const achsen = FEHLERACHSEN.flatMap((a) => artenDerAchse(a.kennung));
    expect([...achsen].sort()).toEqual([...REGLER_ARTEN].sort());
  });
});

describe("Gruppen lesen und setzen", () => {
  it("Mittelwert der eingeschalteten Mitglieder, null wenn keines an ist", () => {
    let g = setzeStufe(gegner(), "verfruehteDame", 2);
    g = setzeStufe(g, "tempoverlust", 1);
    g = setzeStufe(g, "bauernraub", null);
    expect(gruppenstufe(g, ["verfruehteDame", "tempoverlust", "bauernraub"])).toBe(2);
    expect(gruppenstufe(g, ["rueckzug", "springer"])).toBeNull();
  });

  it("eine Gruppe setzt alle Mitglieder; Fernwirkung schaltet vier Flecken ein", () => {
    const g = setzeGruppe(gegner(), ["diagonale", "turm", "dame", "roentgen"], 1);
    expect([...g.blindeFlecken].sort()).toEqual(["dame", "diagonale", "roentgen", "turm"]);
    expect(stufeVon(g, "roentgen")).toBe(1);
    expect(anzahlAn(g)).toEqual({ regler: 9, flecken: 1 });
  });

  it("„setzt nie Patt“ schaltet die Art „patt gesetzt“ aus und wieder ein", () => {
    expect(setztNiePatt(gegner())).toBe(false);
    const nie = mitNiePatt(gegner(), true);
    expect(nie.fehlerarten).not.toContain("pattGesetzt");
    expect(setztNiePatt(mitNiePatt(nie, false))).toBe(false);
  });
});

describe("Vorlagen", () => {
  it("„leichtsinnig“: Figuren sehr oft, Taktik oft, Rest normal, und wird erkannt", () => {
    const g = mitFehlervorlage(gegner(), "leichtsinnig");
    expect(stufeVon(g, "figurHaengen")).toBe(2);
    expect(stufeVon(g, "drohungIgnoriert")).toBe(2);
    expect(stufeVon(g, "schlagVerpasst")).toBe(1);
    expect(stufeVon(g, "bauernraub")).toBe(0);
    expect(istFehlervorlage(g, "leichtsinnig")).toBe(true);
    expect(istFehlervorlage(setzeStufe(g, "koenigMitte", 1), "leichtsinnig")).toBe(false);
  });

  it("„keine Fehler“ schaltet alle Fehlerarten aus, die Flecken bleiben", () => {
    const g = mitFehlervorlage(setzeStufe(gegner(), "rueckzug", 1), "fehlerfrei");
    expect(g.fehlerarten).toEqual([]);
    expect(g.blindeFlecken).toEqual(["rueckzug"]);
    expect(istFehlervorlage(g, "fehlerfrei")).toBe(true);
  });

  it("Fleckenvorlage „kurzsichtig“ setzt Fernwirkung sehr oft und Wendungen oft", () => {
    const g = mitFleckenvorlage(gegner(), "kurzsichtig");
    expect(stufeVon(g, "dame")).toBe(2);
    expect(stufeVon(g, "abzug")).toBe(1);
    expect(stufeVon(g, "ruhig")).toBe(0);
    expect(istFleckenvorlage(g, "kurzsichtig")).toBe(true);
    expect(istFleckenvorlage(gegner(), "keine")).toBe(true);
  });
});

describe("Speicherweg alter Gegner (Variante A, Punkt 3)", () => {
  const vorher = JSON.parse(
    readFileSync(
      new URL("../../../speicher/testdaten/alteGegner-0.2.134.json", import.meta.url),
      "utf8",
    ),
  ) as unknown;

  it("lädt und spielt unverändert wie in 0.2.134", () => {
    const jetzt = JSON.parse(JSON.stringify(ALTE_GEGNER.map((roh) => wirksam(geladen(roh)))));
    expect(jetzt).toEqual(vorher);
  });

  it("ändert sich erst beim Speichern: gestrichene Arten neutral, Hinweis vorher", () => {
    const [stufen, gewichte, nurGestrichen] = ALTE_GEGNER.map(geladen);
    if (!stufen || !gewichte || !nurGestrichen) throw new Error("Testgegner fehlen");
    expect(alteEinstellungen(stufen)).toEqual(
      expect.arrayContaining(["schlagreflex", "koenigPassiv"]),
    );
    const neu = neutralisiert(stufen);
    expect(alteEinstellungen(neu)).toEqual([]);
    expect(neu.reglerstufen?.schlagreflex).toBeUndefined();
    expect(neu.hoechstverlust?.schlagreflex).toBeUndefined();
    expect(neu.hoechstverlust?.figurHaengen).toBe(3);
    expect(neu.fehlerarten).toContain("koenigPassiv");
    expect(wirksam(neu).wirksam.verfruehteDame).toBe(wirksam(stufen).wirksam.verfruehteDame);
    expect(wirksam(neutralisiert(gewichte)).wirksam.koenigPassiv).toBe(1);
    // Nur gestrichene Arten an, alle Regler aus: danach fehlerfrei.
    expect(neutralisiert(nurGestrichen).fehlerarten).toEqual([]);
  });

  it("ein neuer Gegner hat keine alten Einstellungen", () => {
    expect(alteEinstellungen(gegner())).toEqual([]);
  });
});

describe("Achsen des Netzes", () => {
  it("zeigen bei einem neuen Gegner überall „normal“", () => {
    const g = gegner();
    expect(FEHLERACHSEN.map((a) => gruppenstufe(g, artenDerAchse(a.kennung)))).toEqual([
      0, 0, 0, 0, 0,
    ]);
  });
});

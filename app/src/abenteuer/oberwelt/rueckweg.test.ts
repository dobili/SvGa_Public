/**
 * Test des Rückwegs einer Partie (usePartiestart.ts, werteRueckwegAus): `fertig` kommt erst, wenn
 * der Stand mit dem Ergebnis geschrieben ist; erst dann lädt die Welt (useWeltladen.ts `bereit`).
 * Warum (Befund des Autors, 28.11.2026): Nach dem Clubkampf lud die Welt mit dem Stand von vor der
 * Partie, ohne Nadel; Hale, {rivale} und Pratt standen nicht auf der Karte, ihr `#gehe` fand
 * niemanden. Auch ohne Ergebnis (Partie noch offen) und nach einem Fehler muss `fertig` kommen,
 * sonst bliebe die Welt leer.
 */
import { describe, expect, it, vi } from "vitest";
import type { Partieergebnis } from "../schnittstelle/partie";
import type { Abenteuerstand } from "../schnittstelle/spielstand";
import type { Oberweltkern } from "./kern";
import { werteRueckwegAus, type Rueckwegsetzer } from "./usePartiestart";

vi.mock("../daten/laden", () => ({ ladeSpieldaten: () => Promise.resolve({}) }));
vi.mock("../ton/tonregie", () => ({ tonregie: { ergebnis: () => undefined } }));
vi.mock("./auftraege", () => ({
  amZugIn: () => "weiss",
  auftragFuer: () => null,
  kartenFuerWiedereinstieg: () => [],
  wiedereinstiegMoeglich: () => false,
}));
vi.mock("../regeln/rueckweg", () => ({
  standNachPartie: (stand: Abenteuerstand) => ({
    begegnung: "mapleFalls.clubkampf",
    nadel: "bronze",
    stand: { ...stand, laufendePartie: null, dialogvariablen: { nadelMapleFalls: 1 } },
  }),
}));

const STAND = {
  laufendePartie: "mapleFalls.clubkampf#1",
  dialogvariablen: { nadelMapleFalls: 0 },
  partiekarten: null,
} as unknown as Abenteuerstand;
const SIEG = { kennung: "mapleFalls.clubkampf#1", ausgang: "sieg" } as Partieergebnis;

/** Ein Kern mit nur dem, was der Rückweg braucht, und ein Protokoll der Schritte. */
function aufbau(ergebnis: () => Promise<Partieergebnis | null>) {
  const schritte: string[] = [];
  const k = {
    stand: STAND,
    standRef: { current: STAND },
    dienste: { liesErgebnis: ergebnis },
    schreibe: (s: Abenteuerstand) =>
      schritte.push(`schreibe nadel=${s.dialogvariablen.nadelMapleFalls}`),
  } as unknown as Oberweltkern;
  const nichts = () => undefined;
  const setzen: Rueckwegsetzer = {
    ergebnis: nichts,
    zeige: nichts,
    offen: () => schritte.push("offen"),
    nadel: nichts,
    kipppunkt: nichts,
    vorherigeKarten: nichts,
    fertig: () => schritte.push("fertig"),
  };
  return { k, setzen, schritte };
}

describe("werteRueckwegAus", () => {
  it("schreibt erst den Stand mit der Nadel, dann darf die Welt laden", async () => {
    const { k, setzen, schritte } = aufbau(() => Promise.resolve(SIEG));
    await werteRueckwegAus(k, setzen);
    expect(schritte).toEqual(["schreibe nadel=1", "fertig"]);
  });

  it("ohne Ergebnis (Partie noch offen): fertig, damit die Welt nicht leer bleibt", async () => {
    const { k, setzen, schritte } = aufbau(() => Promise.resolve(null));
    await werteRueckwegAus(k, setzen);
    expect(schritte).toEqual(["offen", "fertig"]);
  });

  it("nach einem Fehler beim Lesen: fertig, der Fehler bleibt sichtbar", async () => {
    const { k, setzen, schritte } = aufbau(() => Promise.reject(new Error("Speicher")));
    await expect(werteRueckwegAus(k, setzen)).rejects.toThrow("Speicher");
    expect(schritte).toEqual(["fertig"]);
  });

  it("ohne laufende Partie: keine Auswertung (die Welt wartet dann nicht)", () => {
    const { k, setzen } = aufbau(() => Promise.resolve(SIEG));
    expect(
      werteRueckwegAus({ ...k, stand: { ...STAND, laufendePartie: null } }, setzen),
    ).toBeNull();
  });
});

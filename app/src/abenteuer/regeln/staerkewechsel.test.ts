/** Tests für staerkewechsel.ts: Spielstärke durch Dialog („Atme“ gegen Mira). */
import { describe, expect, it } from "vitest";
import { partieAus } from "../../speicher/partienLesen";
import { neuePartie } from "../../spiel/partie";
import { partieeinstellungAus } from "../anbindung/partiestart";
import type { Gegnerprofil } from "../schnittstelle/gegnerprofil";
import type { Partieauftrag } from "../schnittstelle/partie";
import { mitStaerkewechsel } from "./staerkewechsel";

const MIRA: Gegnerprofil = {
  kennung: "desertSprings.mira",
  name: "figur.mira.name",
  rolle: "clubchef",
  portraet: "portraets/mira.webp",
  staerke: { art: "aktuell", versatz: 0 },
  stil: { draufgaenger: 0.6, taktiker: 0.4 },
  eroeffnung: { art: "frei" },
  steckbrief: [],
};

const AUFTRAG: Partieauftrag = {
  kennung: "desertSprings.clubkampf#1",
  begegnung: "desertSprings.clubkampf",
  profil: MIRA,
  zustand: { haeufigkeitsfaktor: 1, grund: null, analysiert: false, ueberheblich: 1 },
  staerke: {
    zielElo: 1400,
    stufenJePhase: { eroeffnung: 5, mittelspiel: 5, endspiel: 10 },
    haeufigkeit: 1,
  },
  farbe: "white",
  format: { art: "partie" },
  startstellung: { art: "grundstellung" },
  deck: { karten: [] },
  kartenErlaubt: true,
  zaehltFuerApp: false,
  uhr: null,
};

const ATME = [{ wenn: "atmeGesagt", stufe: 1, profil: "positionsspieler" as const }];

describe("Stärkewechsel", () => {
  const einstellung = partieeinstellungAus(AUFTRAG, false, () => 0);

  it("macht Mira nach „Atme“ eine Stufe stärker und ruhiger, die Endspielstufe bleibt am Rand", () => {
    const neu = mitStaerkewechsel(einstellung, ATME, { atmeGesagt: true });
    expect(neu?.stufenJePhase).toEqual({ eroeffnung: 6, mittelspiel: 6, endspiel: 10 });
    expect(neu?.stufe).toBe(6);
    expect(neu?.stilname).toBe("positionsspieler");
    expect(neu?.stilmix).toBeUndefined();
    expect(neu?.abenteuer?.staerkeWechsel).toEqual([0]);
  });

  it("wirkt nur, wenn die Bedingung gilt, und nur einmal", () => {
    expect(mitStaerkewechsel(einstellung, ATME, {})).toBeNull();
    const einmal = mitStaerkewechsel(einstellung, ATME, { atmeGesagt: true });
    if (!einmal) throw new Error("kein Wechsel");
    expect(mitStaerkewechsel(einmal, ATME, { atmeGesagt: true })).toBeNull();
  });

  it("übersteht Speichern und Laden (kein zweites Mal nach dem Neuladen)", () => {
    const neu = mitStaerkewechsel(einstellung, ATME, { atmeGesagt: true });
    if (!neu) throw new Error("kein Wechsel");
    const partie = neuePartie(neu, "p1", "2026-11-13T16:00:00.000Z");
    if (!partie) throw new Error("keine Partie");
    const geladen = partieAus(JSON.parse(JSON.stringify(partie)));
    expect(geladen?.einstellung.abenteuer?.staerkeWechsel).toEqual([0]);
  });
});

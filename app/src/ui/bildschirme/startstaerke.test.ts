/** Tests der Spielstärke in der Startleiste (0.2.138): Zahl je Zeitart, keine gegen Menschen. */
import { describe, expect, it } from "vitest";
import { gegnerstaerke } from "../../engine/botstaerke";
import { GRUNDSTELLUNG } from "../../spiel/stellungsbau";
import { STANDARD_VORLIEBEN } from "../../speicher/partien";
import { UHR_VORGABEN } from "../../spiel/uhr";
import { KEINE_BESIEGTEN } from "../../speicher/besiegt";
import { startangabe, startstaerke } from "./startstaerke";

const BLITZ = UHR_VORGABEN[0] ?? null;
const KLASSISCH = UHR_VORGABEN[UHR_VORGABEN.length - 1] ?? null;

describe("startstaerke", () => {
  it("ist die Zahl der gewerteten Partie und wechselt mit der Zeitart", () => {
    const v = { ...STANDARD_VORLIEBEN, gegner: "engine" as const, bot: "tom" };
    const blitz = startstaerke({ ...v, uhr: BLITZ }, GRUNDSTELLUNG, []);
    const klassisch = startstaerke({ ...v, uhr: KLASSISCH }, GRUNDSTELLUNG, []);
    expect(blitz).toBe(gegnerstaerke({ ...v, uhr: BLITZ, fehlerarten: null }));
    expect(blitz).not.toBe(klassisch);
  });

  it("gibt gegen einen Menschen keine Zahl", () => {
    expect(startstaerke({ ...STANDARD_VORLIEBEN, gegner: "mensch" }, GRUNDSTELLUNG, [])).toBeNull();
  });

  it("nennt für eine Gruppe vor dem ersten Sieg keine Zahl (Befund N795)", () => {
    const v = { ...STANDARD_VORLIEBEN, gegner: "engine" as const, bot: "gruppe-1" };
    expect(startangabe(v, GRUNDSTELLUNG, [], KEINE_BESIEGTEN)).toBe("unbekannt");
    const besiegt = { ...KEINE_BESIEGTEN, rapid: ["gruppe-1"] };
    expect(typeof startangabe(v, GRUNDSTELLUNG, [], besiegt)).toBe("number");
  });
});

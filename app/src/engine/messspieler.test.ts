/** Tests der Messspieler (engine/messspieler.testhilfe.ts): Zeitklasse im Profil wie in der App. */
import { describe, expect, it } from "vitest";
import { spieler } from "./messspieler.testhilfe";

describe("Messspieler", () => {
  it("gibt dem Wahlmodell die Zeitklasse der Uhr mit (Prüfmessung 25.10.2026)", () => {
    expect(spieler("3m~180+2").profil.tempo).toBe("blitz");
    expect(spieler("3m~600+5").profil.tempo).toBe("rapid");
    expect(spieler("3m~1800+20").profil.tempo).toBe("classical");
    expect(spieler("@gruppe-3~180+2").profil.tempo).toBe("blitz");
    expect(spieler("3m").profil.tempo).toBe("rapid");
  });
});

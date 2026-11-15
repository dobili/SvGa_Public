/**
 * Tests für den Hinweis „Was jetzt?“ im Tagebuch (oberwelt/wasjetzt.ts): die Lücken zwischen den
 * Quests am ersten Tag in Maple Falls.
 */
import { describe, expect, it } from "vitest";
import { hatSpieltext } from "../texte/texte";
import { wasJetzt } from "./wasjetzt";

describe("wasJetzt", () => {
  it("schweigt vor dem Abend mit Mama (dann läuft eine Quest)", () => {
    expect(wasJetzt({})).toBeNull();
  });

  it("schickt nach dem Abend zu Ambrose ins Zimmer", () => {
    expect(wasJetzt({ ersterAbendGesehen: true })).toBe("tagebuch.wasJetzt.ersteNacht");
  });

  it("schickt nach der Nacht zu Juno, dann in den Club", () => {
    const nacht = { ersterAbendGesehen: true, ersteNachtGesehen: true };
    expect(wasJetzt(nacht)).toBe("tagebuch.wasJetzt.juno");
    expect(wasJetzt({ ...nacht, junoGetroffen: true })).toBe("tagebuch.wasJetzt.club");
    expect(wasJetzt({ ...nacht, junoGetroffen: true, clubBeigetreten: true })).toBeNull();
  });

  it("hat zu jedem Schlüssel einen Text", () => {
    for (const s of ["ersteNacht", "juno", "club"]) {
      expect(hatSpieltext(`tagebuch.wasJetzt.${s}`)).toBe(true);
    }
  });
});

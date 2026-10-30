/** Prüft, dass jedes Werkzeug ein Beispiel und ein erzeugtes Bild hat (sonst: npm run bilder:werkzeuge). */
import { existsSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { werkzeugeFuer } from "../../../analyse/register";
import { WERKZEUGBEISPIELE, werkzeugbildpfad } from "./werkzeugbeispiele";

/** Letztes Kapitel des Buches: Bis hierhin sind alle Werkzeuge freigeschaltet. */
const LETZTES_KAPITEL = 12;
const OEFFENTLICH = new URL("../../../../public/", import.meta.url);
const kennungen = werkzeugeFuer(LETZTES_KAPITEL).map((w) => w.id);

describe("Werkzeugbilder", () => {
  it("jedes Werkzeug hat ein Beispiel, und jedes Beispiel gehört zu einem Werkzeug", () => {
    expect(Object.keys(WERKZEUGBEISPIELE).sort()).toEqual([...kennungen].sort());
  });

  it("zu jedem Werkzeug liegt das Bild in public/bilder/werkzeuge", () => {
    for (const id of kennungen) {
      expect(existsSync(new URL(werkzeugbildpfad(id), OEFFENTLICH)), id).toBe(true);
    }
  });
});

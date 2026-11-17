/** Tests des Wiki-Zustands in der Adresse (zwei Wikis seit 17.11.2026). */
import { describe, expect, it } from "vitest";
import { suchteilZu, wikiadresseAus } from "./wikiadresse";

describe("Wiki in der Adresse", () => {
  it("liest Wiki und Seite, ohne Wiki keine Angabe", () => {
    expect(wikiadresseAus("?wiki=spiel&seite=code/oberwelt")).toEqual({
      wiki: "spiel",
      seite: "code/oberwelt",
    });
    expect(wikiadresseAus("?wiki=app")).toEqual({ wiki: "app", seite: null });
    expect(wikiadresseAus("")).toBeNull();
    expect(wikiadresseAus("?wiki=buch")).toEqual({ wiki: "app", seite: null });
  });

  it("schreibt den Suchteil und liest ihn gleich zurück", () => {
    const adresse = { wiki: "spiel", seite: "projekt/regelwerk" } as const;
    expect(suchteilZu(adresse)).toBe("?wiki=spiel&seite=projekt%2Fregelwerk");
    expect(wikiadresseAus(suchteilZu(adresse))).toEqual(adresse);
    expect(suchteilZu({ wiki: "app", seite: null })).toBe("?wiki=app");
  });
});

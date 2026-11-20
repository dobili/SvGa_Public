/**
 * Ambroses Abschied auf der Treppe (inhalte/abenteuer/dialoge/de/capital-arena-aussen.ink) übersteht
 * ein Neuladen mitten in der Szene: `abschiedGesehen` steht erst am Ende, beim Abspann.
 *
 * Warum: Die App sichert die Dialogvariablen bei jedem neuen Knoten (oberwelt/useDialogende.ts,
 * sichereVariablen), Abspann und Reise auf den Dachboden kommen erst am Ende des Gesprächs. Stand der
 * Schalter am Anfang, fand ein Spieler, der mitten im Abschied die App schloss, danach nur noch
 * „Auf der Treppe … still geworden“, ohne Abspann und Epilog (schwacher Spieler im Spieler-Durchlauf,
 * 19.11.2026). Der Questschritt hängt deshalb auch an `abschied_ende`.
 */
import { readFileSync } from "node:fs";
import { Compiler } from "inkjs/compiler/Compiler";
import { CompilerOptions } from "inkjs/compiler/CompilerOptions";
import { describe, expect, it } from "vitest";
import quests from "../../../../inhalte/abenteuer/quests.json";
import { Geschichte, type Wirkungen } from "./geschichte";

const DATEI = new URL(
  "../../../../inhalte/abenteuer/dialoge/de/capital-arena-aussen.ink",
  import.meta.url,
);
const JSON_TEXT =
  new Compiler(readFileSync(DATEI, "utf8"), new CompilerOptions(null, [], true))
    .Compile()
    .ToJson() ?? "";
/** Höchstens so viele Schritte hat der Abschied. */
const MAX_SCHRITTE = 80;
/** Eine Zeile aus der Mitte der Szene (Knoten abschied_rede). */
const MITTE = "Ich muss dir etwas sagen";

describe("Abschied auf der Treppe", () => {
  it("setzt abschiedGesehen erst am Ende, beim Abspann", () => {
    let abspann = false;
    const wirkungen = new Proxy<Wirkungen>({} as Wirkungen, {
      get: (_ziel, name) => () => {
        if (name === "zeigeAbspann") abspann = true;
      },
    });
    const geschichte = new Geschichte(JSON_TEXT, wirkungen, {}, "Kim");
    geschichte.starte("abschied");
    let inDerMitte: boolean | null = null;
    for (let i = 0; i < MAX_SCHRITTE; i++) {
      const schritt = geschichte.weiter();
      if (schritt.art === "ende") break;
      if (schritt.art === "zeile" && schritt.zeile.text.includes(MITTE)) {
        inDerMitte = geschichte.variablen().abschiedGesehen === true;
      }
      if (schritt.art === "wahl") geschichte.waehle(0);
    }
    expect(inDerMitte).toBe(false);
    expect(abspann).toBe(true);
    expect(geschichte.variablen().abschiedGesehen).toBe(true);
  });

  it("der Questschritt des Abschieds hängt am Ende der Szene", () => {
    // Die Schritte sind in quests.json uneinheitlich, deshalb über das Rohe gelesen.
    const roh = JSON.stringify(quests);
    const knoten = [...roh.matchAll(/"knoten":"([^"]+)"/g)].map((t) => t[1]);
    expect(knoten).toContain("capital-arena-aussen.abschied_ende");
    expect(knoten).not.toContain("capital-arena-aussen.abschied");
  });
});

/**
 * Tests für stillesende.ts: Der Tor-Knoten einer Wegsperre endet bei offener Sperre still, bei
 * geschlossener spricht die Truppe; ein Knoten mit Wirkung ist nie still.
 */
import { Compiler } from "inkjs/compiler/Compiler";
import { CompilerOptions } from "inkjs/compiler/CompilerOptions";
import { describe, expect, it } from "vitest";
import { stillesEnde } from "./stillesende";

/** Wie die Wegsperre S15 (weg-cedar-riverton.ink, testteam_wald_tor), gekürzt. */
const INK = `
EXTERNAL beginnePartie(begegnung)
VAR testteamWaldDurch = false
VAR torBesuche = 0
=== tor ===
~ torBesuche = torBesuche + 1
{testteamWaldDurch: -> END}
-> truppe
=== truppe ===
Wer vorbei will, spielt eine Stellung. #sprecher:zoe
-> END
=== nur_wirkung ===
~ beginnePartie("wegCedarRiverton.testteam")
-> END
=== nur_wahl ===
+ [„Eine Stellung.“]
    -> END
`;

const JSON_TEXT = new Compiler(INK, new CompilerOptions(null, [], true)).Compile().ToJson() ?? "";

describe("stillesEnde", () => {
  it("offene Sperre: still, mit den Variablen nach dem Durchlauf", () => {
    const danach = stillesEnde(JSON_TEXT, "tor", { testteamWaldDurch: true }, "Kim");
    expect(danach).toMatchObject({ testteamWaldDurch: true, torBesuche: 1 });
  });

  it("geschlossene Sperre: nicht still, der Dialog kommt", () => {
    expect(stillesEnde(JSON_TEXT, "tor", { testteamWaldDurch: false }, "Kim")).toBeNull();
  });

  it("Knoten mit Wirkung oder Auswahl ist nicht still", () => {
    expect(stillesEnde(JSON_TEXT, "nur_wirkung", {}, "Kim")).toBeNull();
    expect(stillesEnde(JSON_TEXT, "nur_wahl", {}, "Kim")).toBeNull();
  });

  it("unbekannter Knoten ist nicht still", () => {
    expect(stillesEnde(JSON_TEXT, "gibtEsNicht", {}, "Kim")).toBeNull();
  });
});

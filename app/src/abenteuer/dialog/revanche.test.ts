/**
 * Revanche um eine bessere Nadel an den echten Dialogen der acht Clubs: Wer die Revanche wählt,
 * setzt `revanche<Ort>`; die Weiche des Clubchefs führt danach in `<chef>_nach_revanche`, das auf
 * Sieg ohne bessere Nadel, Remis und Niederlage eingeht und den Schalter zurücksetzt.
 *
 * Warum: Im Spieler-Durchlauf mit schwachem Spieler (19.11.2026) verlor der Held die Revanche
 * gegen Mira und bekam danach nur einen Alltagssatz; die Gesamtsimulation verliert nie eine
 * Revanche und sah das nicht. Wie in der App beginnt jedes Gespräch mit einer neuen Geschichte.
 */
import { readFileSync } from "node:fs";
import { Compiler } from "inkjs/compiler/Compiler";
import { CompilerOptions } from "inkjs/compiler/CompilerOptions";
import { describe, expect, it } from "vitest";
import { Geschichte, type Dialogvariablen, type Wirkungen } from "./geschichte";

const ORDNER = new URL("../../../../inhalte/abenteuer/dialoge/de/", import.meta.url);
/** Höchstens so viele Schritte hat ein Gespräch. */
const MAX_SCHRITTE = 30;

/** Je Club: Datei, Ort, Chef (Knotenname), Knoten mit der Revanche-Wahl, Satzanfang bei Niederlage. */
const KLUBS = [
  ["maple-falls-clubraum", "MapleFalls", "coach", "coach_alltag", "Diesmal nicht."],
  ["cedar-creek-bibliothek", "CedarCreek", "okafor", "okafor_alltag", "Diesmal nicht."],
  ["riverton-pavillon", "Riverton", "slick", "slick_alltag_wahl", "Heute ich."],
  ["ironwood-kantine", "Ironwood", "big_joe", "big_joe_alltag", "Diesmal hab ich gewonnen"],
  ["silicon-bay-akademie", "SiliconBay", "lin", "lin_alltag", "Diesmal ich."],
  ["port-delacroix-turnhalle", "PortDelacroix", "odile", "odile_alltag", "Diesmal nicht."],
  ["desert-springs-garage", "DesertSprings", "mira", "mira_alltag", "Ich hab gewonnen!"],
  ["summit-city-huette", "SummitCity", "ward", "ward_alltag", "Diesmal hat der Berg"],
] as const;

// Bei Miss Odile folgt nach der Revanche noch die Frage, ob man bereit ist.
const REVANCHE = /Revanche um eine bessere Nadel|Noch eine Partie um die Nadel|Ich bin bereit/;

/** Ein Gespräch ab `knoten`; `wahl` passt auf die gewünschte Antwort, sonst die letzte. */
function spreche(quelle: string, knoten: string, variablen: Dialogvariablen, wahl?: RegExp) {
  let partie = false;
  const wirkungen = new Proxy<Wirkungen>({} as Wirkungen, {
    get: (_ziel, name) => () => {
      if (name === "beginnePartie") partie = true;
    },
  });
  const geschichte = new Geschichte(quelle, wirkungen, variablen, "Kim");
  geschichte.starte(knoten);
  const zeilen: string[] = [];
  for (let i = 0; i < MAX_SCHRITTE; i++) {
    const schritt = geschichte.weiter();
    if (schritt.art === "ende") break;
    if (schritt.art === "zeile") zeilen.push(schritt.zeile.text);
    else {
      const gewollt = wahl ? schritt.wahlen.findIndex((w) => wahl.test(w)) : -1;
      geschichte.waehle(gewollt >= 0 ? gewollt : schritt.wahlen.length - 1);
    }
  }
  return { text: zeilen.join(" | "), variablen: geschichte.variablen(), partie };
}

describe.each(KLUBS)("Revanche in %s", (datei, ort, chef, wahlknoten, niederlage) => {
  const roh = readFileSync(new URL(`${datei}.ink`, ORDNER), "utf8");
  const quelle = new Compiler(roh, new CompilerOptions(null, [], true)).Compile().ToJson() ?? "";
  const schalter = `revanche${ort}`;
  const mitNadel = { [`nadel${ort}`]: 1 };

  it("wer die Revanche doch nicht spielt, setzt den Schalter nicht", () => {
    const g = spreche(
      quelle,
      wahlknoten,
      mitNadel,
      /Revanche um eine bessere Nadel|Noch eine Partie um/,
    );
    expect(g.variablen[schalter] === true).toBe(g.partie);
  });

  it("die Revanche setzt den Schalter und beginnt die Partie", () => {
    const g = spreche(quelle, wahlknoten, mitNadel, REVANCHE);
    expect(g.partie).toBe(true);
    expect(g.variablen[schalter]).toBe(true);
  });

  it("die Weiche führt nach der Verbesserung in die Reaktion auf die Revanche", () => {
    const weiche = new RegExp(
      `- nadel${ort} > [A-Za-z]+: -> ${chef}_nach_\\w+\\n\\s*- ${schalter}: -> ${chef}_nach_revanche`,
    );
    expect(roh).toMatch(weiche);
  });

  it.each([
    ["niederlage", niederlage],
    ["remis", "Remis"],
    ["sieg", /ewonnen|Sieg/],
  ])("nach %s geht der Chef darauf ein und setzt den Schalter zurück", (ausgang, satz) => {
    const g = spreche(quelle, `${chef}_nach_revanche`, {
      ...mitNadel,
      [schalter]: true,
      [`ausgang${ort}Clubkampf`]: ausgang,
    });
    expect(g.text).toMatch(satz);
    expect(g.variablen[schalter]).toBe(false);
  });
});

/** Clubs, in denen Ambrose nach dem verlorenen Clubkampf spricht (Port Delacroix: er schweigt). */
const MIT_AMBROSE = [
  ["maple-falls-clubraum", "coach"],
  ["cedar-creek-bibliothek", "okafor"],
  ["riverton-pavillon", "slick"],
  ["ironwood-kantine", "big_joe"],
  ["silicon-bay-akademie", "lin"],
  ["desert-springs-garage", "mira"],
  ["summit-city-huette", "ward"],
] as const;

describe.each(MIT_AMBROSE)("Ambrose nach dem verlorenen Clubkampf in %s", (datei, chef) => {
  const roh = readFileSync(new URL(`${datei}.ink`, ORDNER), "utf8");
  const quelle = new Compiler(roh, new CompilerOptions(null, [], true)).Compile().ToJson() ?? "";

  /** Sprecher der Zeilen im Knoten `<chef>_nach_niederlage`. */
  function sprecher(variablen: Dialogvariablen): string[] {
    const g = new Geschichte(
      quelle,
      new Proxy<Wirkungen>({} as Wirkungen, { get: () => () => {} }),
      variablen,
      "Kim",
    );
    g.starte(`${chef}_nach_niederlage`);
    const liste: string[] = [];
    for (let i = 0; i < MAX_SCHRITTE; i++) {
      const schritt = g.weiter();
      if (schritt.art !== "zeile") break;
      liste.push(schritt.zeile.tags.sprecher ?? "");
    }
    return liste;
  }

  it("spricht, solange er da ist, und schweigt nach dem Abschied", () => {
    expect(sprecher({})).toContain("ambrose");
    expect(sprecher({ abschiedGesehen: true })).not.toContain("ambrose");
  });
});

/**
 * Tests für geschichte.ts: Externe Funktionen der Runde 6 lösen ihre Wirkung aus
 * (zeigeVorfuehrung für Odette am Leuchtturm, beginneSimultan, beginneGedaechtnis, setzeToenung)
 * und der Fahrpreis mit `zahle`, der vorher die Variable `muenzen` abfragt.
 */
import { Compiler } from "inkjs/compiler/Compiler";
import { CompilerOptions } from "inkjs/compiler/CompilerOptions";
import { describe, expect, it } from "vitest";
import { Geschichte, type Wirkungen } from "./geschichte";

const INK = `
EXTERNAL zeigeVorfuehrung(kennung)
EXTERNAL beginneSimultan(kennung)
EXTERNAL beginneGedaechtnis(kennung)
EXTERNAL setzeToenung(name)
=== start ===
Odette lächelt. #sprecher:odette
~ zeigeVorfuehrung("finchFalle")
~ beginneSimultan("wegGhostCapital.simultan")
~ beginneGedaechtnis("wegDelacroixDesert.seilschaft")
~ setzeToenung("nebel")
-> END
`;

/** Wie der Paketbau: alle Besuche zählen (für neueKnoten). */
const ALLE_BESUCHE = new CompilerOptions(null, [], true);

function wirkungen(aufrufe: string[]): Wirkungen {
  const merke = (name: string) => (k: string) => {
    aufrufe.push(`${name}:${k}`);
  };
  const nichts = () => undefined;
  return {
    gibKarte: nichts,
    setzeSzene: nichts,
    beginnePartie: nichts,
    beginneAufgaben: nichts,
    setzeZustand: nichts,
    schalteSteckbrief: nichts,
    oeffneLaden: nichts,
    gibFund: nichts,
    reise: (karte, ausloeser) => {
      aufrufe.push(`reise:${karte}:${ausloeser}`);
    },
    zeigeVorfuehrung: merke("vorfuehrung"),
    beginneSimultan: merke("simultan"),
    beginneGedaechtnis: merke("gedaechtnis"),
    setzeToenung: merke("toenung"),
    zahle: (n) => {
      aufrufe.push(`zahle:${n}`);
    },
  };
}

describe("Geschichte: Wirkungen der Runde 6", () => {
  it("ruft zeigeVorfuehrung, beginneSimultan, beginneGedaechtnis und setzeToenung", () => {
    const json = new Compiler(INK, ALLE_BESUCHE).Compile().ToJson() ?? "";
    const aufrufe: string[] = [];
    const g = new Geschichte(json, wirkungen(aufrufe), {}, "Kim");
    g.starte("start");
    for (let i = 0; i < 10 && g.weiter().art !== "ende"; i++);
    expect(aufrufe).toEqual([
      "vorfuehrung:finchFalle",
      "simultan:wegGhostCapital.simultan",
      "gedaechtnis:wegDelacroixDesert.seilschaft",
      "toenung:nebel",
    ]);
  });
});

const FAHRT = `
EXTERNAL zahle(muenzen)
EXTERNAL reise(karte, ausloeser)
VAR muenzen = 0
=== anleger ===
{muenzen >= 5:
    ~ zahle(5)
    ~ reise("lockport.aussen", "kai")
    Gute Fahrt.
- else:
    Du hast nicht genug Münzen.
}
-> END
`;

/** Spielt den Anleger mit so vielen Münzen; gibt Aufrufe und gezeigte Zeilen zurück. */
function fahre(muenzen: number): { aufrufe: string[]; zeilen: string[] } {
  const json = new Compiler(FAHRT, ALLE_BESUCHE).Compile().ToJson() ?? "";
  const aufrufe: string[] = [];
  const zeilen: string[] = [];
  const g = new Geschichte(json, wirkungen(aufrufe), { muenzen }, "Kim");
  g.starte("anleger");
  for (let i = 0; i < 10; i++) {
    const s = g.weiter();
    if (s.art !== "zeile") break;
    zeilen.push(s.zeile.text);
  }
  return { aufrufe, zeilen };
}

describe("Geschichte: Fahrpreis mit zahle", () => {
  it("bezahlt und reist, wenn die Münzen reichen", () => {
    expect(fahre(12)).toEqual({
      aufrufe: ["zahle:5", "reise:lockport.aussen:kai"],
      zeilen: ["Gute Fahrt."],
    });
  });

  it("sagt bei zu wenig Münzen nein und zahlt nichts", () => {
    expect(fahre(3)).toEqual({ aufrufe: [], zeilen: ["Du hast nicht genug Münzen."] });
  });
});

const LEUCHTFEUER = `
VAR hatBatterie = false
=== leuchtfeuer ===
{hatBatterie: -> einsetzen}
Ohne Batterie bleibt es dunkel.
-> END
=== einsetzen ===
Das Leuchtfeuer blinkt.
-> END
`;

describe("Geschichte: neue Knoten", () => {
  it("meldet auch einen Knoten mit nur einer Zeile vor END", () => {
    const json = new Compiler(LEUCHTFEUER, ALLE_BESUCHE).Compile().ToJson() ?? "";
    const g = new Geschichte(json, wirkungen([]), { hatBatterie: true }, "Kim");
    g.starte("leuchtfeuer");
    const gemeldet: string[] = [];
    for (let i = 0; i < 5 && g.weiter().art !== "ende"; i++) gemeldet.push(...g.neueKnoten());
    gemeldet.push(...g.neueKnoten());
    expect(gemeldet).toEqual(["leuchtfeuer", "einsetzen"]);
    expect(g.neueKnoten()).toEqual([]);
  });
});

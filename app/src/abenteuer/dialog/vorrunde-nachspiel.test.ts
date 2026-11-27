/**
 * Die Nachspielregel der Vorrunde am echten Dialog (inhalte/abenteuer/dialoge/de/capital-arena-halle.ink,
 * Knoten turnierleiterin, runde1_danach bis runde4_danach, nachspielregel, vorrunde_geschafft):
 * Weiter ins Halbfinale ab 2 von 4 Punkten; nach der sechsten Niederlage in der Vorrunde genügen
 * 1,5, und die Turnierleiterin sagt es einmal an.
 *
 * Warum: Balance-Messung vom 27.11.2026: je Partie etwa 10 % ohne Karten, ein Leser mit 1200
 * brauchte oft sechs bis zehn Partien nur für die Vorrunde. Der Test spielt die Partien nicht,
 * er legt ihre Ausgänge fest, wie die App sie nach der Partie in die Dialogvariablen schreibt.
 * Wie in der App beginnt jedes Gespräch mit einer neuen Geschichte, nur die Variablen bleiben.
 * Regel: Kapitel 0, Wertung (Sieg 1 Punkt, Remis ½).
 */
import { readFileSync } from "node:fs";
import { Compiler } from "inkjs/compiler/Compiler";
import { CompilerOptions } from "inkjs/compiler/CompilerOptions";
import { describe, expect, it } from "vitest";
import { Geschichte, type Dialogvariablen, type Wirkungen } from "./geschichte";

const DATEI = new URL(
  "../../../../inhalte/abenteuer/dialoge/de/capital-arena-halle.ink",
  import.meta.url,
);
const JSON_TEXT =
  new Compiler(readFileSync(DATEI, "utf8"), new CompilerOptions(null, [], true))
    .Compile()
    .ToJson() ?? "";

/** Höchstens so viele Schritte hat ein Gespräch. */
const MAX_SCHRITTE = 80;
/** So oft spricht der Test die Turnierleiterin an, bis eine Partie beginnt. */
const MAX_ANSPRACHEN = 4;
/** Nach so vielen Niederlagen gilt die Nachspielregel. */
const NACHSPIEL = 6;
const REGEL_SATZ = "Ab jetzt reichen dir anderthalb Punkte";
const BEREIT = "„Ich bin bereit.“";
const BEGEGNUNG = /^capitalArena\.runde([1-4])$/;

/** Ein Gespräch: gelesene Zeilen, Variablen danach, gestartete Begegnung, besuchte Knoten. */
interface Gespraech {
  readonly text: string;
  readonly variablen: Dialogvariablen;
  readonly partie: string | null;
  readonly knoten: readonly string[];
}

/**
 * Führt ein Gespräch ab `knoten`. Bei einer Auswahl nimmt es „Ich bin bereit.“, wenn `spielen`,
 * sonst die letzte Antwort („Noch einen Moment.“); eine einzige Antwort nimmt es immer.
 */
function spreche(knoten: string, variablen: Dialogvariablen, spielen: boolean): Gespraech {
  let partie: string | null = null;
  const wirkungen = new Proxy<Wirkungen>({} as Wirkungen, {
    get:
      (_ziel, name) =>
      (...argumente: unknown[]) => {
        if (name === "beginnePartie") partie = String(argumente[0]);
      },
  });
  const geschichte = new Geschichte(JSON_TEXT, wirkungen, variablen, "Kim");
  geschichte.starte(knoten);
  const zeilen: string[] = [];
  const besucht: string[] = [];
  for (let i = 0; i < MAX_SCHRITTE; i++) {
    const schritt = geschichte.weiter();
    besucht.push(...geschichte.neueKnoten());
    if (schritt.art === "ende") break;
    if (schritt.art === "zeile") zeilen.push(schritt.zeile.text);
    else {
      const bereit = spielen ? schritt.wahlen.indexOf(BEREIT) : -1;
      geschichte.waehle(bereit >= 0 ? bereit : schritt.wahlen.length - 1);
    }
  }
  return { text: zeilen.join(" | "), variablen: geschichte.variablen(), partie, knoten: besucht };
}

/**
 * Spricht die Turnierleiterin an, bis eine Runde beginnt, und kommt mit `ausgang` zurück (die
 * Rückmeldung `runde<N>_danach` aus begegnungen.json). Ausgabe: das Gespräch danach.
 */
function runde(variablen: Dialogvariablen, ausgang: string): Gespraech {
  let stand = variablen;
  for (let i = 0; i < MAX_ANSPRACHEN; i++) {
    const vorher = spreche("turnierleiterin", stand, true);
    stand = vorher.variablen;
    const nummer = vorher.partie ? BEGEGNUNG.exec(vorher.partie)?.[1] : undefined;
    if (nummer) {
      return spreche(
        `runde${nummer}_danach`,
        { ...stand, [`ausgangCapitalArenaRunde${nummer}`]: ausgang },
        false,
      );
    }
  }
  throw new Error("Keine Runde begonnen");
}

/** Spielt die Runden nacheinander mit diesen Ausgängen. */
function vorrunde(ausgaenge: readonly string[]): Gespraech[] {
  const gespraeche: Gespraech[] = [];
  let stand: Dialogvariablen = { arenaGesehen: true };
  for (const ausgang of ausgaenge) {
    const g = runde(stand, ausgang);
    gespraeche.push(g);
    stand = g.variablen;
  }
  return gespraeche;
}

describe("Vorrunde: Nachspielregel nach sechs Niederlagen", () => {
  it("ohne Nachspielregel reichen 1,5 Punkte nicht", () => {
    const letzte = vorrunde(["sieg", "remis", "niederlage", "niederlage"]).at(-1);
    expect(letzte?.variablen).toMatchObject({ vorrundeGeschafft: false, vorrundeNiederlagen: 2 });
    expect(letzte?.text).toContain("Für das Halbfinale brauchst du 2.");
  });

  it("2 Punkte reichen wie bisher", () => {
    const letzte = vorrunde(["sieg", "niederlage", "sieg", "niederlage"]).at(-1);
    expect(letzte?.knoten).toContain("vorrunde_geschafft");
    expect(letzte?.text).not.toContain(REGEL_SATZ);
  });

  it("ein Abbruch zählt nicht als Niederlage", () => {
    const letzte = vorrunde(["abgebrochen"]).at(-1);
    expect(letzte?.variablen).toMatchObject({ vorrundeNiederlagen: 0 });
  });

  it("nach der sechsten Niederlage genügen 1,5, einmal angesagt", () => {
    const gespraeche = vorrunde([...Array<string>(NACHSPIEL).fill("niederlage"), "sieg", "remis"]);
    const regel = gespraeche.map((g) => g.text.includes(REGEL_SATZ));
    // Nur in der Rückmeldung der sechsten Niederlage.
    expect(regel.indexOf(true)).toBe(NACHSPIEL - 1);
    expect(regel.filter(Boolean)).toHaveLength(1);
    const nachSieg = gespraeche[NACHSPIEL];
    expect(nachSieg?.text).toContain("Für das Halbfinale brauchst du 1,5.");
    expect(nachSieg?.variablen).toMatchObject({ vorrundeGeschafft: false });
    const letzte = gespraeche.at(-1);
    expect(letzte?.knoten).toContain("vorrunde_geschafft");
    expect(letzte?.text).toContain("1,5 von 4 Punkten");
  });

  it("wer bei der sechsten Niederlage schon 1,5 hat, steht gleich im Halbfinale", () => {
    // Sieg, Niederlage, Remis, Niederlage (1,5 Punkte), dann Runde 2 noch viermal verloren: Bei
    // der sechsten Niederlage gilt die Regel, und die 1,5 reichen sofort.
    const gespraeche = vorrunde(
      ["sieg", "niederlage", "remis", "niederlage"].concat(
        Array<string>(NACHSPIEL - 2).fill("niederlage"),
      ),
    );
    const letzte = gespraeche.at(-1);
    expect(letzte?.text).toContain(REGEL_SATZ);
    expect(letzte?.knoten).toContain("vorrunde_geschafft");
  });
});

/**
 * Die Regel der Wegsperre S17 am echten Dialog (inhalte/abenteuer/dialoge/de/weg-desert-summit.ink,
 * Knoten testteam_gitter*; docs/spiel/32_Wegsperren.md): Nur der Sieg öffnet. Ein Remis ist ein
 * Fehlversuch wie die Niederlage, mit eigenem Satz von Zoe; der dritte Fehlversuch öffnet auch
 * (Notausgang), ein Abbruch zählt nicht.
 *
 * Warum hier und nicht nur im Browser: Der Oberflächentest spielt echte Partien, deren Ausgang vom
 * Gegner abhängt; diese Tests legen den Ausgang fest und prüfen jede Verzweigung. Wie in der App
 * beginnt jedes Gespräch mit einer neuen Geschichte, nur die Variablen bleiben.
 * Regel: Kapitel 8, Mehrbauer verwerten (Abbildung 8.2 ist die Startstellung der Begegnung).
 */
import { readFileSync } from "node:fs";
import { Compiler } from "inkjs/compiler/Compiler";
import { CompilerOptions } from "inkjs/compiler/CompilerOptions";
import { describe, expect, it } from "vitest";
import { Geschichte, type Dialogvariablen, type Wirkungen } from "./geschichte";

const DATEI = new URL(
  "../../../../inhalte/abenteuer/dialoge/de/weg-desert-summit.ink",
  import.meta.url,
);
const JSON_TEXT =
  new Compiler(readFileSync(DATEI, "utf8"), new CompilerOptions(null, [], true))
    .Compile()
    .ToJson() ?? "";

/** Höchstens so viele Schritte hat ein Gespräch an der Sperre. */
const MAX_SCHRITTE = 30;
/** Nach so vielen Fehlversuchen lässt die Truppe durch. */
const NOTAUSGANG = 3;
const REMIS_SATZ = "Gehalten ist nicht gewonnen";
const NIEDERLAGE_SATZ = "Das zähle ich nicht mehr";
const GENUG_SATZ = "Dreimal ehrlich versucht";
const DURCH_SATZ = "Ehrlich gespielt";

/** Ein Gespräch am Übergang: gelesene Zeilen, Variablen danach, ob eine Partie begann. */
interface Gespraech {
  readonly text: string;
  readonly variablen: Dialogvariablen;
  readonly partie: boolean;
}

/**
 * Führt ein Gespräch am Übergang (Knoten testteam_gitter_tor) mit einer neuen Geschichte.
 * Eingaben: Variablen des Spielstands; `wahl` ist die Antwort, die bei einer Auswahl genommen
 * wird (sonst die letzte, also „Später.“ oder „Nicht jetzt.“).
 */
function spreche(variablen: Dialogvariablen, wahl?: string): Gespraech {
  let partie = false;
  const wirkungen = new Proxy<Wirkungen>({} as Wirkungen, {
    get: (_ziel, name) => () => {
      if (name === "beginnePartie") partie = true;
    },
  });
  const geschichte = new Geschichte(
    JSON_TEXT,
    wirkungen,
    { endeAkt3Gesehen: true, ...variablen },
    "Kim",
  );
  geschichte.starte("testteam_gitter_tor");
  const zeilen: string[] = [];
  for (let i = 0; i < MAX_SCHRITTE; i++) {
    const schritt = geschichte.weiter();
    if (schritt.art === "ende") break;
    if (schritt.art === "zeile") zeilen.push(schritt.zeile.text);
    else {
      const gewollt = wahl ? schritt.wahlen.indexOf(wahl) : -1;
      geschichte.waehle(gewollt >= 0 ? gewollt : schritt.wahlen.length - 1);
    }
  }
  return { text: zeilen.join(" | "), variablen: geschichte.variablen(), partie };
}

/** Nimmt die Partie an und kommt mit diesem Ausgang zurück an den Übergang. */
function nachPartie(variablen: Dialogvariablen, ausgang: string): Gespraech {
  const vorher = spreche(variablen, "„Eine Stellung.“");
  const nochEinmal = vorher.partie ? vorher : spreche(variablen, "„Noch einmal.“");
  expect(nochEinmal.partie).toBe(true);
  return spreche({ ...nochEinmal.variablen, ausgangWegDesertSummitTestteam: ausgang });
}

describe("Wegsperre S17: nur der Sieg öffnet", () => {
  it("Sieg öffnet für immer", () => {
    const danach = nachPartie({}, "sieg");
    expect(danach.text).toContain(DURCH_SATZ);
    expect(danach.variablen).toMatchObject({
      testteamGitterDurch: true,
      testteamGitterNiederlagen: 0,
      testteamStand: 3,
    });
  });

  it("Remis lässt die Sperre zu, zählt als Fehlversuch, und Zoe sagt es", () => {
    const danach = nachPartie({}, "remis");
    expect(danach.text).toContain(REMIS_SATZ);
    expect(danach.text).not.toContain(NIEDERLAGE_SATZ);
    expect(danach.text).not.toContain(DURCH_SATZ);
    expect(danach.variablen).toMatchObject({
      testteamGitterDurch: false,
      testteamGitterNiederlagen: 1,
      testteamGitterSpielt: false,
    });
    // Noch einmal am Übergang: derselbe Satz, der Versuch zählt nicht doppelt.
    const wieder = spreche(danach.variablen);
    expect(wieder.text).toContain(REMIS_SATZ);
    expect(wieder.variablen).toMatchObject({
      testteamGitterDurch: false,
      testteamGitterNiederlagen: 1,
    });
  });

  it("Niederlage zählt wie bisher, mit dem alten Satz", () => {
    const danach = nachPartie({}, "niederlage");
    expect(danach.text).toContain(NIEDERLAGE_SATZ);
    expect(danach.text).not.toContain(REMIS_SATZ);
    expect(danach.variablen).toMatchObject({
      testteamGitterDurch: false,
      testteamGitterNiederlagen: 1,
    });
  });

  it("ein Abbruch zählt nicht und öffnet nicht", () => {
    const danach = nachPartie({}, "abgebrochen");
    expect(danach.variablen).toMatchObject({
      testteamGitterDurch: false,
      testteamGitterNiederlagen: 0,
    });
  });

  it.each(["remis", "niederlage"])("der dritte Fehlversuch (%s) öffnet", (ausgang) => {
    // Gemischt: erst eine Niederlage, dann ein Remis, dann der dritte Versuch.
    let variablen = nachPartie({}, "niederlage").variablen;
    variablen = nachPartie(variablen, "remis").variablen;
    expect(variablen).toMatchObject({ testteamGitterDurch: false, testteamGitterNiederlagen: 2 });
    const danach = nachPartie(variablen, ausgang);
    expect(danach.text).toContain(GENUG_SATZ);
    expect(danach.variablen).toMatchObject({
      testteamGitterDurch: true,
      testteamGitterNiederlagen: NOTAUSGANG,
    });
  });

  it("nach dem Abschied spricht der Erzähler statt Ambrose, auch nach einem Remis", () => {
    const mit = nachPartie({}, "remis");
    const ohne = nachPartie({ abschiedGesehen: true }, "remis");
    expect(mit.text).toContain("Du musst ihn führen");
    expect(ohne.text).not.toContain("Du musst ihn führen");
    expect(ohne.text).toContain("hat nicht von allein gewonnen");
  });
});

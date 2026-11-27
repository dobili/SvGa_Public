/**
 * Der Notausgang im Clubkampf gegen Miss Odile am echten Dialog
 * (inhalte/abenteuer/dialoge/de/port-delacroix-turnhalle.ink, Knoten odile, odile_genug,
 * clubkampf_gewertet; port-delacroix-aussen.ink, Knoten wuestenzug): Nach der dritten Niederlage
 * ohne Nadel wertet sie den Clubkampf als gespielt. Sieg und Remis erreichen denselben Knoten, auf
 * den Schritt 4 der Hauptquest portDelacroix.tiefpunkt wartet; danach fährt der Wüstenzug.
 *
 * Warum: Balance-Messung vom 27.11.2026: Miss Odile spielt ohne Karten weit über dem Leser, ein
 * Leser mit 1200 holte je Versuch höchstens 10 %. Niemand soll an der Hauptgeschichte hängen bleiben.
 * Wie in der App beginnt jedes Gespräch mit einer neuen Geschichte, nur die Variablen bleiben.
 * Regel: Kapitel 6, Pläne (Miss Odile: „Ein Plan ist kein Sprint.“).
 */
import { readFileSync } from "node:fs";
import { Compiler } from "inkjs/compiler/Compiler";
import { CompilerOptions } from "inkjs/compiler/CompilerOptions";
import { describe, expect, it } from "vitest";
import { Geschichte, type Dialogvariablen, type Wirkungen } from "./geschichte";

/** Übersetzt eine Ink-Datei des Abenteuers wie der Paketbau (alle Besuche zählen). */
function uebersetze(datei: string): string {
  const pfad = new URL(`../../../../inhalte/abenteuer/dialoge/de/${datei}`, import.meta.url);
  return (
    new Compiler(readFileSync(pfad, "utf8"), new CompilerOptions(null, [], true))
      .Compile()
      .ToJson() ?? ""
  );
}

const TURNHALLE = uebersetze("port-delacroix-turnhalle.ink");
const AUSSEN = uebersetze("port-delacroix-aussen.ink");

/** Höchstens so viele Schritte hat ein Gespräch. */
const MAX_SCHRITTE = 60;
/** Nach so vielen Niederlagen ohne Nadel wertet Miss Odile den Clubkampf. */
const NOTAUSGANG = 3;
const GENUG_SATZ = "Ich schreibe ihn als gespielt ins Buch";
const ZWEITE_SATZ = "Das war nicht besser";
const UM_DIE_NADEL = "„Ich möchte um die Nadel spielen.“";
const BEREIT = "„Ich bin bereit.“";
const NOCH_EINMAL = "„Noch einmal.“";

/** Stand nach Remys und Lous Reihe: Der Clubkampf ist angeboten. */
const VOR_DEM_KAMPF: Dialogvariablen = {
  tiefpunktGesehen: true,
  brettersammelnBegonnen: true,
  reiheRemyBestanden: true,
  reiheLouBestanden: true,
};

/** Ein Gespräch: gelesene Zeilen, Variablen danach, ob eine Partie begann, besuchte Knoten. */
interface Gespraech {
  readonly text: string;
  readonly variablen: Dialogvariablen;
  readonly partie: boolean;
  readonly knoten: readonly string[];
}

/**
 * Führt ein Gespräch ab `knoten` mit einer neuen Geschichte. Bei einer Auswahl nimmt es die erste
 * Antwort aus `wahlen`, die angeboten wird, sonst die letzte („Nicht jetzt.“, „Bis später“).
 */
function spreche(
  json: string,
  knoten: string,
  variablen: Dialogvariablen,
  wahlen: readonly string[] = [],
): Gespraech {
  let partie = false;
  const wirkungen = new Proxy<Wirkungen>({} as Wirkungen, {
    get: (_ziel, name) => () => {
      if (name === "beginnePartie") partie = true;
    },
  });
  const geschichte = new Geschichte(json, wirkungen, variablen, "Kim");
  geschichte.starte(knoten);
  geschichte.neueKnoten();
  const zeilen: string[] = [];
  const besucht: string[] = [];
  for (let i = 0; i < MAX_SCHRITTE; i++) {
    const schritt = geschichte.weiter();
    besucht.push(...geschichte.neueKnoten());
    if (schritt.art === "ende") break;
    if (schritt.art === "zeile") zeilen.push(schritt.zeile.text);
    else {
      const gewollt = schritt.wahlen.findIndex((w) => wahlen.includes(w));
      geschichte.waehle(gewollt >= 0 ? gewollt : schritt.wahlen.length - 1);
    }
  }
  return { text: zeilen.join(" | "), variablen: geschichte.variablen(), partie, knoten: besucht };
}

/** Spielt den Clubkampf mit diesem Ausgang (und dieser Nadel) und spricht danach mit Miss Odile. */
function clubkampf(variablen: Dialogvariablen, ausgang: string, nadel = 0): Gespraech {
  const vorher = spreche(TURNHALLE, "odile", variablen, [UM_DIE_NADEL, BEREIT, NOCH_EINMAL]);
  expect(vorher.partie).toBe(true);
  return spreche(TURNHALLE, "odile", {
    ...vorher.variablen,
    ausgangPortDelacroixClubkampf: ausgang,
    nadelPortDelacroix: nadel,
  });
}

describe("Clubkampf Port Delacroix: Notausgang nach drei Niederlagen", () => {
  it("Sieg wertet den Clubkampf (Questknoten) ohne Notausgang", () => {
    const danach = clubkampf(VOR_DEM_KAMPF, "sieg", 3);
    expect(danach.knoten).toContain("clubkampf_gewertet");
    expect(danach.text).not.toContain(GENUG_SATZ);
    expect(danach.variablen).toMatchObject({
      clubkampfPortDelacroixGewertet: true,
      odileNiederlagen: 0,
    });
  });

  it("Remis mit Bronze wertet ebenso", () => {
    const danach = clubkampf(VOR_DEM_KAMPF, "remis", 1);
    expect(danach.knoten).toContain("clubkampf_gewertet");
    expect(danach.variablen).toMatchObject({ clubkampfPortDelacroixGewertet: true });
  });

  it("die erste und zweite Niederlage zählen, öffnen aber nicht", () => {
    const erste = clubkampf(VOR_DEM_KAMPF, "niederlage");
    expect(erste.knoten).toContain("odile_hand");
    expect(erste.variablen).toMatchObject({
      odileNiederlagen: 1,
      clubkampfPortDelacroixGewertet: false,
    });
    const zweite = clubkampf(erste.variablen, "niederlage");
    expect(zweite.text).toContain(ZWEITE_SATZ);
    expect(zweite.variablen).toMatchObject({
      odileNiederlagen: 2,
      clubkampfPortDelacroixGewertet: false,
    });
    // Noch einmal angesprochen: Die Niederlage zählt nicht doppelt.
    const wieder = spreche(TURNHALLE, "odile", zweite.variablen);
    expect(wieder.variablen).toMatchObject({ odileNiederlagen: 2 });
  });

  it("ein Abbruch zählt nicht", () => {
    const danach = clubkampf(VOR_DEM_KAMPF, "abgebrochen");
    expect(danach.variablen).toMatchObject({ odileNiederlagen: 0 });
  });

  it("die dritte Niederlage öffnet: gewertet ohne Nadel, um die Nadel spielen bleibt", () => {
    let variablen = VOR_DEM_KAMPF;
    for (let i = 1; i < NOTAUSGANG; i++) variablen = clubkampf(variablen, "niederlage").variablen;
    const genug = clubkampf(variablen, "niederlage");
    expect(genug.text).toContain(GENUG_SATZ);
    expect(genug.knoten).toEqual(expect.arrayContaining(["odile_genug", "clubkampf_gewertet"]));
    expect(genug.variablen).toMatchObject({
      odileNiederlagen: NOTAUSGANG,
      clubkampfPortDelacroixGewertet: true,
      nadelPortDelacroix: 0,
    });
    // Ambrose schweigt noch (vor Szene 68): der Erzähler statt seiner.
    expect(genug.text).toContain("Aus dem Geigenkasten kommt kein Wort");
    // Danach: kein zweites Mal, und die Nadel ist weiter zu haben.
    const spaeter = spreche(TURNHALLE, "odile", genug.variablen, [UM_DIE_NADEL, BEREIT]);
    expect(spaeter.text).not.toContain(GENUG_SATZ);
    expect(spaeter.partie).toBe(true);
  });

  it("spricht Ambrose wieder, sagt er den Satz dazu", () => {
    let variablen: Dialogvariablen = { ...VOR_DEM_KAMPF, ambroseSprichtWieder: true };
    for (let i = 1; i < NOTAUSGANG; i++) variablen = clubkampf(variablen, "niederlage").variablen;
    expect(clubkampf(variablen, "niederlage").text).toContain("Keine Schande");
  });

  it("der Wüstenzug fährt nach dem Notausgang auch ohne Nadel", () => {
    const ohne = spreche(AUSSEN, "wuestenzug", { nadelPortDelacroix: 0 });
    expect(ohne.text).toContain("Erst willst du hier noch etwas zu Ende bringen");
    const mit = spreche(AUSSEN, "wuestenzug", {
      nadelPortDelacroix: 0,
      clubkampfPortDelacroixGewertet: true,
    });
    expect(mit.knoten).toContain("abschied_mama");
  });
});

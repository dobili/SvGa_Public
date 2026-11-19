/**
 * Aufgabenrunden im Spieler-Durchlauf: Der Spieler liest die Stellung vom Brett (Beschriftung der
 * Felder), lässt Stockfish unter Node den besten Zug suchen und tippt ihn an; Fragen mit Knöpfen
 * (Falle nehmen oder nicht) beantwortet er nach der Bewertung, alles andere mit „Weiter“. Am Ende
 * „Weiter“ zurück in die Welt.
 *
 * Warum: Hauptquests verlangen bestandene Runden (70 Prozent); ohne echten Löser käme der
 * Durchlauf dort nicht weiter, und die Testknöpfe „Bestehen“ sind tabu.
 * Fallenaufgaben zeigen das Brett nur als Bild; dort schlägt der Löser die Antwort in den
 * Trainerdaten der App nach (beantworteFalle).
 * Grenzen: Strukturaufgaben (Felder und Bauern markieren) kann dieser Löser nicht; er gibt dort
 * die Antwort ab, wie sie steht. Rochaderechte werden aus der Grundstellung von König und Turm
 * geraten, ein Schlagen im Vorbeigehen kennt er nicht.
 * Abhängigkeiten: abenteuer-zugwahl.ts (Stockfish), eingabe.ts, lage.ts, messung.ts.
 * Beispiel: „Weiß am Zug“, Springer b5, Dame d5, König e8 → tippt b5 und c7 (Gabel).
 */
import { readFileSync } from "node:fs";
import { tippe, tippeKnopf, tippePunkt, type Lauf } from "./eingabe";
import { liesLage, type Knopf, type Lage } from "./lage";
import { bewerteStellung } from "./partie";

/** Figurennamen der Feldbeschriftung und ihr Buchstabe in der FEN. */
const FIGUR: Readonly<Record<string, string>> = {
  König: "k",
  Dame: "q",
  Turm: "r",
  Läufer: "b",
  Springer: "n",
  Bauer: "p",
};
/** So lange ohne Änderung wartet der Löser, bevor er „Ich komme nicht drauf“ tippt (ms). */
const RATLOS_MS = 20_000;
/** So lange ohne Änderung gilt die Runde als festgefahren (ms). */
const STILLSTAND_MS = 90_000;
/** Näher als so viele Bauern am besten Zug gilt ein angebotenes Schlagen als gut. */
const FALLENSPIEL = 0.6;
const FELDER_JE_BRETT = 64;
/** Trainerdaten der Fallenaufgaben (vom Bau der App erzeugt). */
const FALLENDATEI = new URL("../../public/daten/de/trainer/falle.json", import.meta.url);
/** So viele Kandidaten rechnet der Löser je Aufgabe (der beste zuerst). */
const KANDIDATEN = 3;
/** Nach so langer Ruhe sieht der Löser unter dem Bildrand nach „Weiter“ (ms). */
const UNTEN_NACHSEHEN_MS = 3000;
/** So oft schreibt die Runde ein Lebenszeichen ins Protokoll (ms). */
const PULS_MS = 30_000;
/** Nach so langer Ruhe tippt der Löser seinen Zug noch einmal, höchstens so oft (ms). */
const NOCHMAL_MS = 5000;
const NOCHMAL_HOECHSTENS = 3;
/** So lange muss die Stellung unverändert stehen, bevor der Löser zieht (ms). */
const RUHE_MS = 1300;
/** So viele Zeichen des Aufgabentexts zählen als gelesen (Auftrag und Sprechblasen). */
const LESETEXT_MAX = 600;

/** Die Felder des Bretts unter den Knöpfen der Lage. */
function brettfelder(lage: Lage): Knopf[] {
  return lage.knoepfe.filter((k) => /^[a-h][1-8](,|$)/.test(k.text));
}

/** Die FEN-Stellung aus den Feldern (ohne Zugrecht) und die Farbe, die unten sitzt. */
function stellungAus(felder: readonly Knopf[]): {
  brett: string;
  unten: "w" | "b";
  rochade: string;
} {
  const belegung = new Map<string, string>();
  for (const k of felder) {
    const treffer = /^([a-h][1-8]), (\S+) \((Weiß|Schwarz)\)/.exec(k.text);
    const buchstabe = treffer ? FIGUR[treffer[2] ?? ""] : undefined;
    if (!treffer || !buchstabe) continue;
    belegung.set(treffer[1] ?? "", treffer[3] === "Weiß" ? buchstabe.toUpperCase() : buchstabe);
  }
  const reihen: string[] = [];
  for (let reihe = 8; reihe >= 1; reihe--) {
    let zeile = "";
    let leer = 0;
    for (const linie of "abcdefgh") {
      const figur = belegung.get(`${linie}${reihe}`);
      if (!figur) {
        leer++;
        continue;
      }
      zeile += (leer > 0 ? String(leer) : "") + figur;
      leer = 0;
    }
    reihen.push(zeile + (leer > 0 ? String(leer) : ""));
  }
  const steht = (feld: string, figur: string) => belegung.get(feld) === figur;
  const rochade =
    (steht("e1", "K") && steht("h1", "R") ? "K" : "") +
    (steht("e1", "K") && steht("a1", "R") ? "Q" : "") +
    (steht("e8", "k") && steht("h8", "r") ? "k" : "") +
    (steht("e8", "k") && steht("a8", "r") ? "q" : "");
  const a1 = felder.find((k) => k.text.startsWith("a1"));
  const h8 = felder.find((k) => k.text.startsWith("h8"));
  return {
    brett: reihen.join("/"),
    unten: a1 && h8 && a1.y < h8.y ? "b" : "w",
    rochade: rochade || "-",
  };
}

/** Der sichtbare Text der Runde (Auftrag, „Weiß am Zug“, Rückmeldung). */
async function rundentext(lauf: Lauf): Promise<string> {
  return lauf.seite
    .getByTestId("abenteuer-aufgaben")
    .innerText({ timeout: 2000 })
    .catch(() => "");
}

/** Tippt einen Zug (UCI) auf den Feldern der Lage. */
async function tippeZug(lauf: Lauf, felder: readonly Knopf[], uci: string): Promise<boolean> {
  const von = felder.find((k) => k.text.startsWith(uci.slice(0, 2)));
  const nach = felder.find((k) => k.text.startsWith(uci.slice(2, 4)));
  if (!von || !nach) return false;
  await tippePunkt(lauf, von.x, von.y);
  await lauf.seite.waitForTimeout(120);
  await tippePunkt(lauf, nach.x, nach.y);
  if (uci.length > 4) {
    const dame = lauf.seite.getByRole("dialog").getByRole("button", { name: /Dame/ });
    await dame.waitFor({ state: "visible", timeout: 2000 }).catch(() => undefined);
    await tippe(lauf, dame, "Umwandlung in die Dame");
  }
  return true;
}

/** Eine Fallenaufgabe aus den Trainerdaten, so weit hier gebraucht. */
interface Fallendaten {
  readonly aufgaben: readonly { readonly angebot: string; readonly antwort: string }[];
}
let fallen: Fallendaten | null = null;

/** Deutsche Figurenbuchstaben der Knopfbeschriftung in die Schreibweise der Daten (Sxc7 → Nxc7). */
function datenzug(zug: string): string {
  const figur: Readonly<Record<string, string>> = { S: "N", L: "B", T: "R", D: "Q" };
  return zug.replace(/^[SLTD]/, (b) => figur[b] ?? b);
}

/**
 * Beantwortet „Nehmen oder nicht?“ (Fallenaufgabe). Das Brett ist dort nur ein Bild (keine
 * tippbaren Felder), die Stellung also nicht lesbar; der Löser schlägt die Antwort deshalb zum
 * angebotenen Zug in den Trainerdaten der App nach (public/daten/de/trainer/falle.json, Lesen zum
 * Entscheiden). Bei mehreren Aufgaben mit demselben Zug entscheidet die Mehrheit; ist das Brett
 * doch lesbar, entscheidet die Bewertung des Zugs.
 */
async function beantworteFalle(lauf: Lauf, lage: Lage, fen: string | null): Promise<boolean> {
  const nehmen = lage.knoepfe.find((k) => /^Nehmen: /.test(k.text) || / nehmen$/.test(k.text));
  const lassen = lage.knoepfe.find((k) => /^Nicht nehmen/.test(k.text));
  if (!nehmen || !lassen || nehmen === lassen) return false;
  const san = /^Nehmen: (\S+)/.exec(nehmen.text)?.[1] ?? "";
  let gut: boolean;
  if (fen) {
    const alle = await bewerteStellung(fen);
    const ziel = /x([a-h][1-8])/.exec(nehmen.text)?.[1];
    const zug = alle.find((k) => ziel !== undefined && k.uci.slice(2, 4) === ziel);
    gut = zug !== undefined && alle[0] !== undefined && zug.wert >= alle[0].wert - FALLENSPIEL;
  } else {
    fallen ??= JSON.parse(readFileSync(FALLENDATEI, "utf8")) as Fallendaten;
    const treffer = fallen.aufgaben.filter((f) => f.angebot === datenzug(san));
    const falle = treffer.filter((f) => f.antwort === "falle").length;
    gut = treffer.length > 0 && falle * 2 < treffer.length;
  }
  lauf.messung.log(`  Falle: ${nehmen.text} → ${gut ? "nehmen" : "nicht nehmen"}`);
  await tippeKnopf(lauf, gut ? nehmen : lassen);
  return true;
}

/**
 * Spielt die offene Aufgabenrunde bis zum Ende und tippt „Weiter“ zurück in die Welt. Zählt die
 * Runde in der Messung. Sonderfall: Tut sich länger nichts, tippt der Löser „Ich komme nicht
 * drauf“; steht die Runde ganz, ist das ein Fund.
 */
export async function spieleRunde(lauf: Lauf): Promise<void> {
  const seite = lauf.seite;
  const beginn = Date.now();
  let letzterText = "";
  let seit = Date.now();
  let aufgaben = 0;
  let richtig = 0;
  let versucht = "";
  let gelesen = "";
  let versuche = 0;
  let gerollt = 0;
  let ratlosSeit = 0;
  let puls = Date.now();
  let letzteFen = "";
  let fenSeit = Date.now();
  while (Date.now() < lauf.frist) {
    const lage = await liesLage(seite);
    if (lage.bild !== "aufgaben") break;
    const text = await rundentext(lauf);
    const nummer = /Aufgabe (\d+) von (\d+)/.exec(text);
    if (nummer) aufgaben = Number(nummer[2]);
    const ergebnis = /(\d+) von (\d+) Aufgaben richtig/.exec(text);
    if (ergebnis) richtig = Number(ergebnis[1]);
    // Stillstand misst sich an Aufgabe und Stellung, nicht am Text (Sprechblasen tippen sich ein).
    const abdruck = `${nummer?.[1] ?? ""}|${brettfelder(lage)
      .map((k) => k.text)
      .join(";")}`;
    if (abdruck !== letzterText) {
      letzterText = abdruck;
      seit = Date.now();
    }
    // Den Auftrag einer Aufgabe liest der Spieler einmal.
    if (nummer && nummer[1] !== gelesen) {
      gelesen = nummer[1] ?? "";
      lauf.messung.meldung(text.replace(/\b[a-h][1-8]\b/g, "").slice(0, LESETEXT_MAX));
    }
    if (await tippe(lauf, seite.getByTestId("abenteuer-aufgaben-zurueck"), "Runde „Weiter“")) {
      await seite.waitForTimeout(500);
      continue;
    }
    const weiter = lage.knoepfe.find(
      (k) => /^(Weiter|Auswerten|Nächste Aufgabe)/.test(k.text) && k.klasse.includes("knopf-haupt"),
    );
    if (weiter) {
      await tippeKnopf(lauf, weiter);
      versucht = "";
      await seite.waitForTimeout(350);
      continue;
    }
    if (Date.now() - puls > PULS_MS) {
      puls = Date.now();
      const andere = lage.knoepfe.filter((k) => !/^[a-h][1-8](,|$)/.test(k.text));
      lauf.messung.log(
        `  Runde läuft: ${brettfelder(lage).length} Felder im Bild, Knöpfe: ` +
          andere.map((k) => `${k.text.slice(0, 30)}[${k.klasse.slice(0, 24)}]`).join(" | "),
      );
    }
    // „Weiter“ kann unter dem Bildrand liegen: hinrollen wie ein Mensch (zählt als Beobachtung).
    if (!weiter && Date.now() - seit > UNTEN_NACHSEHEN_MS) {
      const unten = seite
        .getByTestId("abenteuer-aufgaben")
        .getByRole("button", { name: /^(Weiter|Auswerten|Nächste Aufgabe)/ });
      if ((await unten.count()) > 0 && (await tippe(lauf, unten, "Aufgabe „Weiter“ (gerollt)"))) {
        gerollt += 1;
        if (gerollt === 1) {
          lauf.messung.log("  Aufgabe: „Weiter“ lag außerhalb des Bildes, hingerollt");
          await seite
            .screenshot({ path: `${lauf.messung.ordner}/bilder/weiter-gerollt.png` })
            .catch(() => undefined);
        }
        versucht = "";
        seit = Date.now();
        await seite.waitForTimeout(350);
        continue;
      }
    }
    if (brettfelder(lage).length === 0 && (await beantworteFalle(lauf, lage, null))) {
      seit = Date.now();
      await seite.waitForTimeout(400);
      continue;
    }
    const felder = brettfelder(lage);
    const blase = lage.knoepfe.find((k) => k.klasse.includes("abenteuer-tischblase"));
    if (felder.length < FELDER_JE_BRETT && blase) {
      // Eine Sprechblase liegt über dem Brett: antippen schließt sie.
      lauf.messung.log(`  Sprechblase über dem Brett: „${blase.text.slice(0, 80)}“, tippe sie weg`);
      lauf.messung.jetzt.meldungswoerter += blase.text.trim().split(/\s+/).length;
      await tippeKnopf(lauf, blase);
      await seite.waitForTimeout(300);
      continue;
    }
    if (felder.length < FELDER_JE_BRETT) {
      // Das Brett liegt nicht ganz im Bild: hinrollen wie ein Mensch.
      const brett = seite
        .getByTestId("abenteuer-aufgaben")
        .getByRole("button", { name: /^e4(,|$)/ });
      await brett
        .first()
        .scrollIntoViewIfNeeded({ timeout: 1500 })
        .catch(() => undefined);
      await seite.waitForTimeout(300);
      if (Date.now() - seit > STILLSTAND_MS) {
        lauf.messung.fund(
          "aufgabe",
          `Aufgabenrunde steht (Brett nicht im Bild): ${text.slice(0, 120)}`,
        );
        seit = Date.now();
      }
      continue;
    }
    const { brett, unten, rochade } = stellungAus(felder);
    const amZug = /Schwarz am Zug/.test(text) ? "b" : /Weiß am Zug/.test(text) ? "w" : unten;
    const fen = `${brett} ${amZug} ${rochade} - 0 1`;
    // Erst ziehen, wenn die Stellung steht (der Zug des Gegners vor der Aufgabe läuft noch).
    if (fen !== letzteFen) {
      letzteFen = fen;
      versuche = 0;
      fenSeit = Date.now();
    }
    if (Date.now() - fenSeit < RUHE_MS) {
      await seite.waitForTimeout(150);
      continue;
    }
    if (await beantworteFalle(lauf, lage, fen)) {
      await seite.waitForTimeout(400);
      continue;
    }
    if (amZug === unten && fen !== versucht) {
      versucht = fen;
      // Wenige Varianten, dafür tief; kam der beste Zug nicht an, der nächste Kandidat.
      const alle = (await bewerteStellung(fen, KANDIDATEN)).filter((k) => !/[rbn]$/.test(k.uci));
      const zug = alle[Math.min(versuche, alle.length - 1)];
      if (zug) {
        lauf.messung.log(`  Aufgabe ${nummer?.[1] ?? "?"}: ${fen} → ${zug.uci}`);
        await tippeZug(lauf, felder, zug.uci);
        seit = Date.now();
        await seite.waitForTimeout(500);
        continue;
      }
    }
    // Der Zug kam nicht an (nichts hat sich getan): noch einmal versuchen.
    if (Date.now() - seit > NOCHMAL_MS && versuche < NOCHMAL_HOECHSTENS && versucht === fen) {
      versuche += 1;
      versucht = "";
      continue;
    }
    if (Date.now() - seit > RATLOS_MS && Date.now() - ratlosSeit > RATLOS_MS) {
      versuche = 0;
      ratlosSeit = Date.now();
      const ratlos = lage.knoepfe.find((k) =>
        /Ich komme nicht drauf|Lösung|Prüfen|aufgeben|Ambrose fragen|Hinweis/i.test(k.text),
      );
      if (ratlos) {
        lauf.messung.log(`  Aufgabe: ratlos, tippe „${ratlos.text}“`);
        await tippeKnopf(lauf, ratlos);
        versucht = "";
      }
    }
    if (Date.now() - seit > STILLSTAND_MS) {
      lauf.messung.fund(
        "aufgabe",
        `Aufgabenrunde steht: ${text.replace(/\s+/g, " ").slice(0, 200)}`,
      );
      await seite
        .screenshot({ path: `${lauf.messung.ordner}/bilder/aufgabe-steht-${Date.now()}.png` })
        .catch(() => undefined);
      seit = Date.now();
    }
    await seite.waitForTimeout(250);
  }
  lauf.messung.jetzt.runden.push({
    kennung: lauf.messung.karte,
    aufgaben,
    richtig,
    ms: Date.now() - beginn,
  });
  lauf.messung.log(`RUNDE auf ${lauf.messung.karte}: ${richtig} von ${aufgaben} richtig`);
  lauf.messung.sichere();
}

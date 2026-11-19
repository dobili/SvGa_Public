/**
 * Laufen im Spieler-Durchlauf: Weg über die freien Kacheln suchen, das Steuerkreuz halten, bis
 * der Held am Ende eines geraden Stücks steht, sich einem Ding zuwenden, in einen Durchgang gehen.
 *
 * Warum: Ob eine Figur erreichbar ist und ein Übergang reagiert, zeigt nur der Held, der wirklich
 * mit gehaltenem Steuerkreuz läuft. Gemessen wird dabei die Zeit, die der Finger auf dem Kreuz
 * liegt (Laufzeit im Spiel).
 * Abhängigkeiten: eingabe.ts, lage.ts, welt.ts, oberwelt/uebergangslauf.ts (kürzester Weg).
 * Beispiel: geheZu(lauf, wissen, [{ x: 5, y: 9 }]) → "da", wenn der Held auf (5, 9) steht.
 */
import { kuerzesterWeg, type Kachelort } from "../../src/abenteuer/oberwelt/uebergangslauf";
import { halteRichtung, lasseRichtung, type Lauf, type Richtung } from "./eingabe";
import { feldAus, liesLage } from "./lage";
import type { Kartenwissen } from "./welt";

/** Versatz je Richtung. */
export const VERSATZ: Readonly<Record<Richtung, Kachelort>> = {
  oben: { x: 0, y: -1 },
  unten: { x: 0, y: 1 },
  links: { x: -1, y: 0 },
  rechts: { x: 1, y: 0 },
};
const RICHTUNGEN = Object.keys(VERSATZ) as Richtung[];

/** So lange ohne neue Kachel gilt der Held als aufgehalten (ms). */
const STEHT_MS = 1100;
/** Frist für ein gerades Stück je Kachel und als Zuschlag (ms). */
const MS_JE_KACHEL = 420;
const ZUSCHLAG_MS = 2500;
/** So viel länger als die Frist im Browser wartet der Durchlauf auf dessen Antwort (ms). */
const NOTFALL_MS = 5000;
/** So oft plant der Durchlauf auf einer Strecke um, bevor er aufgibt. */
const MAX_UMWEGE = 12;
/** So lange drückt der Held zum Umdrehen (ms). */
const DREHEN_MS = 90;
/** Pause auf einem Übergangsfeld, bevor der Schritt in den Durchgang wieder zählt (ms). */
const RUHE_MS = 500;
/** So viele Plätze an einem Ding versucht der Held, so oft sieht er je Platz nach dem Aktionsknopf. */
const PLAETZE_VERSUCHEN = 3;
const AKTION_WARTEN = 6;
/** So lange drückt der Held höchstens in einen Durchgang (ms). */
const DURCHGANG_MS = 2500;

/** Richtung von einem Feld zum Nachbarfeld, oder null. */
export function richtungZu(von: Kachelort, nach: Kachelort): Richtung | null {
  return (
    RICHTUNGEN.find((r) => von.x + VERSATZ[r].x === nach.x && von.y + VERSATZ[r].y === nach.y) ??
    null
  );
}

/** Warum ein gehaltenes Stück endete. */
type Halt = "ziel" | "steht" | "fenster" | "abseits" | "frist";

/**
 * Wartet im Browser, bis der Held auf `ziel` steht, etwas dazwischenkommt (Fenster, Welt weg), er
 * die erlaubten Kacheln verlässt oder zu lange auf einer Kachel steht. Liest nur die Anzeige.
 */
function warteAufKachelImBrowser(a: {
  ziel: string;
  erlaubt: string[];
  stehtMs: number;
  fristMs: number;
}): Promise<{ grund: string; kachel: string }> {
  return new Promise((fertig) => {
    const anzeige = () =>
      document.querySelector("[data-testid='abenteuer-kachel']")?.textContent ?? "";
    const beginn = performance.now();
    let letzte = anzeige();
    let seit = beginn;
    const takt = () => {
      const jetzt = performance.now();
      const kachel = anzeige();
      const fenster =
        document.querySelector("[data-testid='abenteuer-dialog']") !== null ||
        document.querySelector(".abenteuer-steuerkreuz") === null;
      if (kachel !== letzte) {
        letzte = kachel;
        seit = jetzt;
      }
      let grund: string | null = null;
      if (fenster) grund = "fenster";
      else if (kachel === a.ziel) grund = "ziel";
      else if (!a.erlaubt.includes(kachel)) grund = "abseits";
      else if (jetzt - seit > a.stehtMs) grund = "steht";
      else if (jetzt - beginn > a.fristMs) grund = "frist";
      if (!grund) return;
      clearInterval(uhr);
      fertig({ grund, kachel });
    };
    // Mit einer Uhr statt Bild für Bild: Zeichnet der Browser gerade keine Bilder (Last, Seite
    // im Hintergrund), käme sonst nie eine Antwort, und der Durchlauf hinge (18.11.2026).
    const uhr = setInterval(takt, 16);
    takt();
  });
}

/** Hält eine Richtung, bis der Held auf `ziel` steht oder etwas dazwischenkommt; misst die Zeit. */
async function halteBis(
  lauf: Lauf,
  richtung: Richtung,
  ziel: Kachelort,
  erlaubt: readonly Kachelort[],
): Promise<Halt> {
  const beginn = Date.now();
  if (!(await halteRichtung(lauf, richtung))) return "fenster";
  const fristMs = erlaubt.length * MS_JE_KACHEL + ZUSCHLAG_MS;
  const warten = lauf.seite
    .evaluate(warteAufKachelImBrowser, {
      ziel: `${ziel.x},${ziel.y}`,
      erlaubt: erlaubt.map((k) => `${k.x},${k.y}`),
      stehtMs: STEHT_MS,
      fristMs,
    })
    .catch(() => ({ grund: "fenster", kachel: "" }));
  // Antwortet die Seite gar nicht (eingefroren), endet das Stück trotzdem nach der Frist.
  const notfall = new Promise<{ grund: string; kachel: string }>((fertig) => {
    setTimeout(() => fertig({ grund: "frist", kachel: "" }), fristMs + NOTFALL_MS);
  });
  const ergebnis = await Promise.race([warten, notfall]);
  await lasseRichtung(lauf);
  // Die Wartezeit vor einem Hindernis ist keine Laufzeit.
  const gewartet = ergebnis.grund === "steht" ? STEHT_MS : 0;
  lauf.messung.jetzt.laufMs += Math.max(0, Date.now() - beginn - gewartet);
  if (ergebnis.grund === "ziel") lauf.messung.jetzt.schritte += erlaubt.length - 1;
  return ergebnis.grund as Halt;
}

/** Das erste gerade Stück eines Wegs: Richtung und die Kacheln bis zur ersten Ecke. */
function geradesStueck(weg: readonly Kachelort[]): { richtung: Richtung; kacheln: Kachelort[] } {
  const richtung = richtungZu(weg[0] as Kachelort, weg[1] as Kachelort) ?? "oben";
  const kacheln = [weg[0] as Kachelort];
  for (let i = 1; i < weg.length; i++) {
    if (richtungZu(weg[i - 1] as Kachelort, weg[i] as Kachelort) !== richtung) break;
    kacheln.push(weg[i] as Kachelort);
  }
  return { richtung, kacheln };
}

/** Die beiden Richtungen quer zu einer Laufrichtung. */
const QUER: Readonly<Record<Richtung, readonly Richtung[]>> = {
  oben: ["links", "rechts"],
  unten: ["links", "rechts"],
  links: ["unten", "oben"],
  rechts: ["unten", "oben"],
};
/** So lange drückt der Held beim Rütteln quer (ms). */
const RUETTELN_MS = 130;

/**
 * Rütteln an einer Engstelle: ein kurzes Stück quer, dann wieder in die Laufrichtung. Manche
 * Durchlässe sind nur wenige Pixel breit (Geländer, Bänke); ein Mensch kommt dort durch, wenn er
 * etwas versetzt anläuft. Ausgabe: ob der Held danach auf der nächsten Kachel steht.
 */
async function ruettle(lauf: Lauf, hier: Kachelort, richtung: Richtung): Promise<boolean> {
  const vor = { x: hier.x + VERSATZ[richtung].x, y: hier.y + VERSATZ[richtung].y };
  for (const quer of QUER[richtung]) {
    if (!(await halteRichtung(lauf, quer))) return false;
    await lauf.seite.waitForTimeout(RUETTELN_MS);
    await lasseRichtung(lauf);
    const stand = feldAus((await liesLage(lauf.seite)).kachel);
    if (!stand || stand.x !== hier.x || stand.y !== hier.y) return false;
    if ((await halteBis(lauf, richtung, vor, [hier, vor])) === "ziel") {
      lauf.messung.log(`Engstelle vor ${vor.x},${vor.y}: mit Rütteln (${quer}) durchgekommen`);
      return true;
    }
  }
  return false;
}

/** Wie ein Gang endete. */
export type Gang = "da" | "keinWeg" | "fenster" | "aufgehalten";

/**
 * Kacheln je Kartendatei, in die der Held nicht hineinkam, obwohl sie nach den Kartendaten frei
 * sind (Kollision fein: die Mitte hat Platz, aber nicht von jeder Seite). Sie gelten für den Rest
 * des Laufs als Umweg wert; Felder, auf denen Statisten und Tiere laufen, zählen nicht dazu.
 */
const harteKacheln = new Map<string, Set<string>>();

/**
 * Sucht den Weg in drei Stufen: zuerst nur über ganz freie Kacheln, ohne Übergangsfelder und ohne
 * bekannte harte Kacheln; dann mit den Kacheln der Kollision fein; zuletzt auch über Übergangsfelder
 * (manche Wege führen nur über eine Türschwelle).
 */
function sucheWeg(
  wissen: Kartenwissen,
  hier: Kachelort,
  ziele: readonly Kachelort[],
  gesperrt: ReadonlySet<string>,
): Kachelort[] | null {
  const hart = harteKacheln.get(wissen.datei) ?? new Set<string>();
  const offen = (x: number, y: number) => !gesperrt.has(`${x},${y}`);
  const ohneTuer = (x: number, y: number) => !wissen.uebergangsfelder.has(`${x},${y}`);
  const stufen: ((x: number, y: number) => boolean)[] = [
    (x, y) => wissen.freiStreng(x, y) && offen(x, y) && ohneTuer(x, y) && !hart.has(`${x},${y}`),
    (x, y) => wissen.frei(x, y) && offen(x, y) && ohneTuer(x, y),
    (x, y) => wissen.frei(x, y) && offen(x, y),
  ];
  // Zielfelder zählen in jeder Stufe als frei (ein Übergang ist selbst ein Übergangsfeld); sonst
  // fände erst die letzte Stufe den Weg zur Tür und liefe dabei quer über fremde Türschwellen.
  const zielfelder = new Set(ziele.map((z) => `${z.x},${z.y}`));
  for (const stufe of stufen) {
    const frei = (x: number, y: number) =>
      (zielfelder.has(`${x},${y}`) && offen(x, y)) || stufe(x, y);
    const weg = kuerzesterWeg(frei, hier, ziele);
    if (weg) return weg;
  }
  return null;
}

/**
 * Geht zu einem der Zielfelder. Wird der Held aufgehalten (Statist, Tier, Figur, die im
 * Kartenwissen fehlt, feine Kollision), gilt die Kachel vor ihm für diesen Gang als gesperrt, und
 * er plant um.
 * Ausgabe: "da" (steht auf einem Ziel), "keinWeg", "fenster" (ein Fenster ging auf oder die Karte
 * wechselte), "aufgehalten" (nach MAX_UMWEGE Umwegen).
 */
export async function geheZu(
  lauf: Lauf,
  wissen: Kartenwissen,
  ziele: readonly Kachelort[],
): Promise<Gang> {
  const gesperrt = new Set<string>();
  for (let umweg = 0; umweg <= MAX_UMWEGE; umweg++) {
    const lage = await liesLage(lauf.seite);
    const hier = feldAus(lage.kachel);
    if (!hier || !lage.kreuz || lage.dialog) return "fenster";
    if (ziele.some((z) => z.x === hier.x && z.y === hier.y)) return "da";
    const weg = sucheWeg(wissen, hier, ziele, gesperrt);
    if (!weg) return gesperrt.size > 0 ? "aufgehalten" : "keinWeg";
    const { richtung, kacheln } = geradesStueck(weg);
    const ende = kacheln[kacheln.length - 1] as Kachelort;
    const halt = await halteBis(lauf, richtung, ende, kacheln);
    if (process.env.DURCHLAUF_SPUR) {
      const nach = (await liesLage(lauf.seite)).kachel;
      lauf.messung.log(
        `    Stück ${hier.x},${hier.y} ${richtung} bis ${ende.x},${ende.y}: ${halt}, steht auf ${nach}`,
      );
    }
    // Abseits des Wegs heißt meist: Die Karte hat gewechselt (Tür gestreift); neu planen lassen.
    if (halt === "fenster" || halt === "abseits") return "fenster";
    if (halt === "ziel") {
      umweg--;
      continue;
    }
    // Aufgehalten: erst rütteln wie ein Mensch (ein Stück quer, dann wieder vor), dann die Kachel
    // vor dem Helden sperren und neu planen.
    const jetzt = feldAus((await liesLage(lauf.seite)).kachel);
    if (jetzt && halt === "steht" && (await ruettle(lauf, jetzt, richtung))) {
      umweg--;
      continue;
    }
    if (jetzt) {
      const vor = `${jetzt.x + VERSATZ[richtung].x},${jetzt.y + VERSATZ[richtung].y}`;
      gesperrt.add(vor);
      if (!wissen.belebt.has(vor)) {
        harteKacheln.set(wissen.datei, (harteKacheln.get(wissen.datei) ?? new Set()).add(vor));
      }
      lauf.messung.log(`aufgehalten vor ${vor} (${halt}), plane um`);
    }
  }
  return "aufgehalten";
}

/** Dreht den Helden in eine Richtung (kurzer Druck). */
export async function dreheZu(lauf: Lauf, richtung: Richtung): Promise<void> {
  if (!(await halteRichtung(lauf, richtung))) return;
  await lauf.seite.waitForTimeout(DREHEN_MS);
  await lasseRichtung(lauf);
  await lauf.seite.waitForTimeout(150);
}

/**
 * Geht an ein Ding heran (auf sein Feld, wenn es frei ist, sonst daneben mit Blick darauf) und
 * wartet, bis der Aktionsknopf erscheint. Ausgabe: "aktion" (Knopf da), "fenster", "keinWeg",
 * "aufgehalten" oder "ohneAktion" (steht davor, aber kein Knopf).
 */
export async function geheAn(
  lauf: Lauf,
  wissen: Kartenwissen,
  felder: readonly Kachelort[],
): Promise<Gang | "aktion" | "ohneAktion"> {
  const plaetze = new Map<string, { platz: Kachelort; blick: Richtung | null }>();
  for (const f of felder) {
    if (wissen.frei(f.x, f.y)) plaetze.set(`${f.x},${f.y}`, { platz: f, blick: null });
    for (const r of RICHTUNGEN) {
      const n = { x: f.x - VERSATZ[r].x, y: f.y - VERSATZ[r].y };
      const schluessel = `${n.x},${n.y}`;
      if (wissen.frei(n.x, n.y) && !plaetze.has(schluessel)) {
        plaetze.set(schluessel, { platz: n, blick: r });
      }
    }
  }
  // Bis zu drei Plätze: Von manchen Seiten trifft der Blick das Ding nicht (hohe Möbel).
  const offen = new Map(plaetze);
  for (let versuch = 0; versuch < PLAETZE_VERSUCHEN && offen.size > 0; versuch++) {
    const gang = await geheZu(
      lauf,
      wissen,
      [...offen.values()].map((p) => p.platz),
    );
    if (gang !== "da") return versuch === 0 ? gang : "ohneAktion";
    const lage = await liesLage(lauf.seite);
    const blick = offen.get(lage.kachel)?.blick ?? null;
    offen.delete(lage.kachel);
    if (blick && lage.aktion === null) await dreheZu(lauf, blick);
    for (let i = 0; i < AKTION_WARTEN; i++) {
      const jetzt = await liesLage(lauf.seite);
      if (jetzt.dialog || !jetzt.kreuz) return "fenster";
      if (jetzt.aktion !== null) return "aktion";
      await lauf.seite.waitForTimeout(100);
    }
  }
  return "ohneAktion";
}

/** Wartet im Browser, bis ein Fenster aufgeht oder die Welt neu lädt; liest nur die Anzeige. */
function warteAufWechselImBrowser(a: { kachel: string; fristMs: number }): Promise<string> {
  return new Promise((fertig) => {
    const beginn = performance.now();
    const bild = document.querySelector(".abenteuer-welt canvas");
    const takt = () => {
      const kachel = document.querySelector("[data-testid='abenteuer-kachel']")?.textContent ?? "";
      let grund: string | null = null;
      if (document.querySelector("[data-testid='abenteuer-dialog']")) grund = "fenster";
      // Die neue Karte lädt: Das Steuerkreuz verschwindet, dann wechselt das Bild.
      else if (document.querySelector(".abenteuer-welt canvas") !== bild) grund = "karte";
      else if (document.querySelector(".abenteuer-steuerkreuz") === null) grund = "karte";
      else if (kachel !== a.kachel) grund = "versetzt";
      else if (performance.now() - beginn > a.fristMs) grund = "frist";
      if (!grund) return;
      clearInterval(uhr);
      fertig(grund);
    };
    const uhr = setInterval(takt, 16);
    takt();
  });
}

/**
 * Geht auf ein Feld des Übergangs und drückt in den Durchgang. Ausgabe: "karte" (die Welt lädt
 * neu), "fenster" (ein Dialog ging auf), "versetzt" (Steg auf derselben Karte), "frist" (nichts
 * geschah), oder wie der Gang dorthin endete.
 */
export async function geheDurch(
  lauf: Lauf,
  wissen: Kartenwissen,
  name: string,
): Promise<Gang | "karte" | "versetzt" | "frist"> {
  const felder = wissen.ausloeser.filter((a) => a.name === name && a.typ === "ausloeser");
  const vorher = (await liesLage(lauf.seite)).kachel;
  const gang = await geheZu(lauf, wissen, felder);
  if (gang !== "da") return gang;
  const lage = await liesLage(lauf.seite);
  const feld = felder.find((f) => `${f.x},${f.y}` === lage.kachel);
  // Kam der Held auf diesem Feld an, zählt der Durchgang erst nach kurzem Stillstand (RUHEBILDER).
  if (vorher === lage.kachel) await lauf.seite.waitForTimeout(RUHE_MS);
  let ergebnis = "frist";
  for (const richtung of (feld?.durchgang ?? []) as Richtung[]) {
    const beginn = Date.now();
    if (!(await halteRichtung(lauf, richtung))) return "fenster";
    ergebnis = await lauf.seite
      .evaluate(warteAufWechselImBrowser, { kachel: lage.kachel, fristMs: DURCHGANG_MS })
      .catch(() => "karte");
    await lasseRichtung(lauf);
    lauf.messung.jetzt.laufMs += Date.now() - beginn;
    if (ergebnis !== "frist") break;
  }
  return ergebnis as "karte" | "fenster" | "versetzt" | "frist";
}

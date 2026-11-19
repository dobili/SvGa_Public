/**
 * Ein Schritt des Spieler-Durchlaufs in der freien Welt: Ziel vom Planer holen, hinlaufen (über
 * Ausgänge auf andere Karten oder an ein Ding heran), den Aktionsknopf drücken.
 *
 * Warum: Hier treffen Planung und Eingabe zusammen, und hier fallen die Stellen auf, an denen ein
 * Spieler nicht weiterkommt: kein Weg zu einer Figur, kein Aktionsknopf, ein Übergang, der nicht
 * reagiert. Jede solche Stelle wird als Fund gemeldet.
 * Abhängigkeiten: planer.ts, laufen.ts, eingabe.ts, lage.ts, welt.ts.
 * Beispiel: weltschritt(lauf, daten, planer) im Zimmer mit Ziel Mama → geht durch „treppeUnten“.
 */
import { tippe, type Lauf } from "./eingabe";
import { geheAn, geheDurch } from "./laufen";
import { feldAus, liesLage, liesSpeicher, liesStand } from "./lage";
import type { Planer, Ziel } from "./planer";
import { kartenwissen, type Ding, type Kartenwissen, type Spieldaten } from "./welt";

/** So lange wartet der Schritt nach einem Kartenwechsel auf die neue Welt (ms). */
const WELT_FRIST_MS = 40_000;
/** Kurze Pause, bis der Spielstand nach einem Kartenwechsel im Speicher steht (ms). */
const SPEICHER_MS = 400;
/** So oft (je 100 ms) sieht der Schritt nach der Ankunftskachel der neuen Karte. */
const ANKUNFT_VERSUCHE = 40;

/**
 * Wartet, bis die Welt wieder steht (Steuerkreuz und Kachel) oder ein Fenster offen ist; zählt die
 * Ladezeit. Mit `vorher` (Karte vor dem Schritt) wartet sie nach einem Kartenwechsel außerdem, bis
 * die Anzeige die Ankunftskachel der neuen Karte nennt: Sonst plante der nächste Schritt mit der
 * Kachel der alten Karte und lief in die falsche Richtung (Befund am Diner, 18.11.2026).
 */
export async function warteAufWelt(lauf: Lauf, vorher?: string): Promise<void> {
  const beginn = Date.now();
  while (Date.now() - beginn < WELT_FRIST_MS) {
    const lage = await liesLage(lauf.seite);
    const steht = lage.bild === "welt" && lage.kreuz && feldAus(lage.kachel) !== null;
    if (steht || lage.dialog || lage.bild === "partie" || lage.bild === "aufgaben") break;
    await lauf.seite.waitForTimeout(50);
  }
  lauf.messung.jetzt.ladeMs += Date.now() - beginn;
  lauf.messung.jetzt.ladevorgaenge += 1;
  await lauf.seite.waitForTimeout(SPEICHER_MS);
  const stand = (await liesSpeicher(lauf.seite)).stand;
  if (vorher === undefined || !stand || stand.position.karte === vorher) return;
  const ankunft = `${stand.position.x},${stand.position.y}`;
  for (let i = 0; i < ANKUNFT_VERSUCHE; i++) {
    const lage = await liesLage(lauf.seite);
    if (lage.kachel === ankunft || lage.dialog || lage.bild !== "welt") return;
    await lauf.seite.waitForTimeout(100);
  }
}

/** Die Karte des letzten Schritts (um eine neue Karte zu bemerken). */
let letzteKarte = "";

/** Der Übergang, an dem zuletzt ein Dialog aufging (bis klar ist, ob er danach öffnete). */
let offenerDialog: { karte: string; name: string } | null = null;

/** Geht durch einen Ausgang und meldet, wenn er nicht reagiert. Ausgabe: ob etwas geschah. */
async function nimmAusgang(
  lauf: Lauf,
  planer: Planer,
  wissen: Kartenwissen,
  name: string,
): Promise<boolean> {
  const stand = await liesStand(lauf.seite);
  const ergebnis = await geheDurch(lauf, wissen, name);
  lauf.messung.log(`Ausgang ${wissen.kennung}.${name}: ${ergebnis}`);
  if (ergebnis === "karte" || ergebnis === "fenster" || ergebnis === "versetzt") {
    // Karte gewechselt, auf derselben Karte versetzt oder ein Dialog am Übergang (Wegsperre, Bus)?
    await lauf.seite.waitForTimeout(250);
    if ((await liesLage(lauf.seite)).dialog) {
      // Ob der Übergang nach dem Dialog öffnet, zeigt sich, wenn der Dialog vorbei ist: Der
      // nächste Schritt sieht nach, ob der Held noch auf dieser Karte steht (offenerDialog).
      offenerDialog = { karte: wissen.kennung, name };
      return true;
    }
    await warteAufWelt(lauf, stand.position.karte);
    planer.merkeDurchgang(stand, wissen.kennung, name);
    const jetzt = (await liesSpeicher(lauf.seite)).stand;
    if (jetzt && jetzt.position.karte === stand.position.karte && ergebnis !== "versetzt") {
      planer.merkeGesperrt(stand, wissen.kennung, name);
    }
    return true;
  }
  if (ergebnis === "keinWeg" && (await nimmSteg(lauf, planer, wissen, name))) return true;
  if (ergebnis === "keinWeg") {
    lauf.messung.fund("unerreichbar", `Übergang ${wissen.kennung}.${name}: kein Weg vom Standort`);
  } else if (ergebnis === "frist") {
    lauf.messung.fund("uebergang", `Übergang ${wissen.kennung}.${name} reagiert nicht`);
  } else {
    lauf.messung.log(`Übergang ${wissen.kennung}.${name}: unterwegs aufgehalten`);
    // Aufgehalten heißt meist: Ein Statist oder Roboter läuft denselben Weg voraus (Silicon Bay,
    // Altstadt, Reihe 22: Feuerwehrmann und Lieferroboter). Ein zweiter Versuch später, wie ein
    // Mensch, der wartet und es noch einmal probiert; erst dann gilt der Ausgang als gesperrt.
    planer.merkeGesperrt(stand, wissen.kennung, name);
    return false;
  }
  planer.merkeGesperrt(stand, wissen.kennung, name);
  planer.merkeGesperrt(stand, wissen.kennung, name);
  return false;
}

/**
 * Kein Weg zum Ausgang: Manche Karten haben getrennte Teile, die ein Übergang auf derselben Karte
 * verbindet (Steg über die Schleuse, Fähre). Der Held nimmt dann den ersten solchen Steg, den er
 * erreicht; der nächste Schritt plant von der anderen Seite neu. Ausgabe: ob er einen Steg nahm.
 */
async function nimmSteg(
  lauf: Lauf,
  planer: Planer,
  wissen: Kartenwissen,
  ausser: string,
): Promise<boolean> {
  const stand = await liesStand(lauf.seite);
  const zu = planer.gesperrteAusgaenge(stand);
  const stege = wissen.dinge.filter(
    (d) =>
      d.name !== ausser &&
      d.regel?.art === "uebergang" &&
      d.regel.ziel?.karte === wissen.kennung &&
      !zu.has(`${wissen.kennung}.${d.name}`),
  );
  for (const steg of stege) {
    const ergebnis = await geheDurch(lauf, wissen, steg.name);
    lauf.messung.log(`Steg ${wissen.kennung}.${steg.name}: ${ergebnis}`);
    if (ergebnis === "keinWeg" || ergebnis === "aufgehalten" || ergebnis === "frist") continue;
    planer.merkeDurchgang(stand, wissen.kennung, steg.name);
    await warteAufWelt(lauf);
    return true;
  }
  return false;
}

/** Geht an ein Ding der Karte heran und drückt den Aktionsknopf. */
async function fasseAn(
  lauf: Lauf,
  planer: Planer,
  wissen: Kartenwissen,
  ziel: Ziel,
): Promise<void> {
  const ding = wissen.dinge.find((d) => d.name === ziel.name);
  planer.merke(ziel);
  if (!ding) {
    lauf.messung.log(`Ziel ${ziel.karte}.${ziel.name ?? ""} steht hier nicht (${ziel.grund})`);
    return;
  }
  if (ding.regel?.art === "uebergang") {
    await nimmAusgang(lauf, planer, wissen, ding.name);
    return;
  }
  const ergebnis = await geheAn(lauf, wissen, ding.felder);
  lauf.messung.log(`An ${wissen.kennung}.${ding.name} (${ziel.grund}): ${ergebnis}`);
  if (ergebnis === "aktion") {
    const getippt = await tippe(lauf, lauf.seite.getByTestId("abenteuer-aktion"), "Aktionsknopf");
    if (getippt) await lauf.seite.waitForTimeout(350);
    return;
  }
  if (ergebnis === "keinWeg") {
    lauf.messung.fund("unerreichbar", `${wissen.kennung}.${ding.name}: kein Weg vom Standort`);
  } else if (ergebnis === "ohneAktion" && (ding.figur || ding.regel?.dialog)) {
    lauf.messung.fund(
      "ohneAktion",
      `${wissen.kennung}.${ding.name}: steht davor, kein Aktionsknopf`,
    );
  }
}

/**
 * Haltestelle (Bus, Zug): herangehen und ansprechen; die Fahrt beginnt im Gespräch. Fährt der Bus
 * nicht, sperrt der nächste Schritt die Haltestelle (offenerDialog). Ausgabe: ob das Gespräch begann.
 */
async function steigeEin(lauf: Lauf, wissen: Kartenwissen, halt: Ding): Promise<boolean> {
  const ergebnis = await geheAn(lauf, wissen, halt.felder);
  lauf.messung.log(`Haltestelle ${wissen.kennung}.${halt.name}: ${ergebnis}`);
  if (ergebnis !== "aktion") return false;
  if (!(await tippe(lauf, lauf.seite.getByTestId("abenteuer-aktion"), "Aktionsknopf")))
    return false;
  await lauf.seite.waitForTimeout(350);
  offenerDialog = { karte: wissen.kennung, name: halt.name };
  return true;
}

/**
 * Ein Schritt in der freien Welt. Ausgabe: false, wenn der Planer kein Ziel mehr hat (der Spieler
 * hängt fest), sonst true.
 */
export async function weltschritt(lauf: Lauf, daten: Spieldaten, planer: Planer): Promise<boolean> {
  const stand = await liesStand(lauf.seite);
  const karte = stand.position.karte;
  lauf.messung.akt = stand.handlung.akt;
  lauf.messung.karte = karte;
  if (karte !== letzteKarte) {
    // Neue Karte (auch nach einem Dialog am Übergang oder einer Reise): warten, bis die Anzeige
    // die Ankunftskachel nennt, sonst plant der Schritt mit der Kachel der alten Karte.
    letzteKarte = karte;
    const ankunft = `${stand.position.x},${stand.position.y}`;
    for (let i = 0; i < ANKUNFT_VERSUCHE; i++) {
      const lage = await liesLage(lauf.seite);
      if (lage.kachel === ankunft || lage.dialog || lage.bild !== "welt") break;
      await lauf.seite.waitForTimeout(100);
    }
  }
  if (offenerDialog) {
    // Nach einem Dialog am Übergang noch auf derselben Karte: Der Übergang blieb zu.
    if (offenerDialog.karte === karte) planer.merkeGesperrt(stand, karte, offenerDialog.name);
    offenerDialog = null;
  }
  const wissen = kartenwissen(daten, karte, stand);
  const ziel = planer.naechstes(stand);
  if (!ziel) return false;
  if (ziel.karte === karte) {
    if (ziel.name) await fasseAn(lauf, planer, wissen, ziel);
    else planer.merke(ziel);
    return true;
  }
  const weg = planer.weg(stand, ziel.karte);
  const ausgang = weg?.[0];
  if (!ausgang) {
    lauf.messung.log(`Kein Weg nach ${ziel.karte} (${ziel.grund})`);
    planer.merke(ziel);
    return true;
  }
  lauf.messung.log(
    `Unterwegs nach ${ziel.karte}${ziel.name ? `.${ziel.name}` : ""} (${ziel.grund})`,
  );
  const halt = wissen.dinge.find((d) => d.name === ausgang.name && d.regel?.art === "dialog");
  const gegangen = halt
    ? await steigeEin(lauf, wissen, halt)
    : await nimmAusgang(lauf, planer, wissen, ausgang.name);
  // Ein Ziel, zu dem der Weg nicht aufgeht, zählt als Versuch (sonst liefe der Planer im Kreis).
  if (!gegangen) planer.merke(ziel);
  return true;
}

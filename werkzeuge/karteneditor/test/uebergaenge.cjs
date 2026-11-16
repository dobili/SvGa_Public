/*
 * Teil des Oberflächentests (editor.test.cjs) für Übergänge (Editor 1.4, Wünsche des Autors,
 * 16.11.2026): neuer Übergang vom Dachboden zum Diner mit neuem Gegenauslöser (zwei Kacheln durch
 * Ziehen), Ankunftsanzeige, festes Ankunftsfeld mit Blick, „Zum Ziel“; der Rücklauf schreibt
 * orte.json in eine Kopie im Testordner (ruecklaufArgumente, pruefeRuecklauf).
 */
"use strict";
const fs = require("fs");
const path = require("path");
const h = require("./hilfen.cjs");

const DINER = "mapleFalls.diner";
const DACHBODEN = "mapleFalls.dachboden";

/** Bildschirmpunkt der Mitte einer Kachel. */
function kachelpunkt(seite, x, y) {
  return seite.evaluate(
    ([x, y]) => {
      const r = document.getElementById("leinwand").getBoundingClientRect();
      const a = KE.zustand.ansicht;
      return { x: r.left + (x * 16 + 8 - a.x) * a.zoom, y: r.top + (y * 16 + 8 - a.y) * a.zoom };
    },
    [x, y],
  );
}

/**
 * Zwei freie Kacheln nebeneinander ohne Auslöser, mit freiem Raum ringsum (3 × 4), damit der Held
 * daneben ankommen kann. Ausgabe: [x, y] der linken.
 */
function freieStelle(seite) {
  return seite.evaluate(() => {
    const szene = KE.szene();
    const gesperrt = KE.sperrkacheln(szene, KE.platziere(szene));
    const belegt = new Set((szene.ausloeser || []).map((a) => a.feld.join(",")));
    const frei = (x, y) =>
      (szene.raster[y] || "")[x] !== undefined &&
      !gesperrt.has(x + "," + y) &&
      !belegt.has(x + "," + y);
    for (let y = 2; y < szene.raster.length - 2; y++)
      for (let x = 2; x < szene.raster[y].length - 3; x++) {
        let gut = true;
        for (let dy = -1; dy <= 1; dy++)
          for (let dx = -1; dx <= 2; dx++) gut &&= frei(x + dx, y + dy);
        if (gut) return [x, y];
      }
    return null;
  });
}

async function neuerUebergang(seite, pruefe) {
  await seite.click('.kartenknopf[data-datei="maple-falls-dachboden.json"]');
  await seite.waitForTimeout(200);
  await seite.click("summary.neuerUebergang");
  await seite.selectOption("#neuart", "treppe");
  await seite.fill("#zielsuche", "diner");
  const optionen = await seite.$$eval("#neuzielkarte option", (o) => o.map((x) => x.value));
  pruefe(optionen.includes(DINER) && !optionen.includes(DACHBODEN), "Suche filtert die Zielkarten");
  await seite.selectOption("#neuzielkarte", DINER);
  pruefe(
    (await seite.inputValue("#neuname")) === "treppeDiner",
    "Namensvorschlag aus Art und Zielkarte",
  );
  pruefe((await seite.inputValue("#neuzielausloeser")) === "", "Vorgabe: neuer Gegenauslöser");
  await seite.selectOption("#neudurchgang", "links");
  await seite.click("#eigenschaften button.neuSetzen");
  const [x, y] = await freieStelle(seite);
  const von = await kachelpunkt(seite, x, y);
  const bis = await kachelpunkt(seite, x + 1, y);
  await seite.mouse.move(von.x, von.y);
  await seite.mouse.down();
  await seite.mouse.move(bis.x, bis.y, { steps: 4 });
  await seite.mouse.up();
  const zustand = await seite.evaluate(() => ({
    datei: KE.zustand.datei,
    setzen: KE.zustand.setzen,
    felder: (KE.szene("maple-falls-dachboden.json").ausloeser || []).filter(
      (a) => a.name === "treppeDiner",
    ),
  }));
  pruefe(
    zustand.felder.length === 2 &&
      zustand.felder.every((a) => a.eigenschaften?.durchgang === "links"),
    `Ziehen setzt zwei Felder mit Durchgang (${JSON.stringify(zustand.felder)})`,
  );
  pruefe(
    zustand.datei === h.KARTE && zustand.setzen?.art === "gegen",
    "Editor öffnet die Zielkarte für den Gegenauslöser",
  );
  await h.foto(seite, "30-gegenausloeser-setzen");
  const [gx, gy] = await freieStelle(seite);
  const p = await kachelpunkt(seite, gx, gy);
  await seite.mouse.click(p.x, p.y);
  const ergebnis = await seite.evaluate(() => ({
    hin: KE.regel("mapleFalls.dachboden", "treppeDiner"),
    zurueck: KE.regel("mapleFalls.diner", "treppeDachboden"),
    fassung: (KE.szene("maple-falls-diner-tischset.json").ausloeser || []).some(
      (a) => a.name === "treppeDachboden",
    ),
  }));
  pruefe(
    ergebnis.hin?.ziel?.karte === DINER &&
      ergebnis.hin.ziel.ausloeser === "treppeDachboden" &&
      ergebnis.zurueck?.ziel?.karte === DACHBODEN &&
      ergebnis.zurueck.ziel.ausloeser === "treppeDiner",
    `Beide Seiten verweisen aufeinander (${JSON.stringify(ergebnis)})`,
  );
  pruefe(ergebnis.fassung, "Gegenauslöser auch in der Zustandsfassung (Tischset)");
  return [gx, gy];
}

async function ankunft(seite, pruefe, [gx, gy]) {
  const text = await seite.textContent("#ankunftsanzeige");
  const auto = await seite.evaluate(() => KE.ankunftsort(KE.szene(), "treppeDachboden"));
  pruefe(
    /automatisch/.test(text) &&
      auto &&
      !auto.aufAusloeser &&
      Math.abs(auto.x - gx) + Math.abs(auto.y - gy) === 1,
    `Ankunft neben dem Gegenauslöser (${text})`,
  );
  await h.foto(seite, "31-ankunft-automatisch");
  // Festes Ankunftsfeld zwei Kacheln rechts (freieStelle lässt dort Platz), mit Blick nach oben.
  await seite.click("#eigenschaften button.ankunftFestlegen");
  const ziel = [gx + 2, gy];
  const p = await kachelpunkt(seite, ziel[0], ziel[1]);
  await seite.mouse.click(p.x, p.y);
  await seite.evaluate(() => {
    KE.zustand.auswahl = new Set(
      KE.szene()
        .ausloeser.filter((a) => a.name === "treppeDachboden")
        .map((a) => a._uid),
    );
    KE.meldeAenderung();
  });
  await seite.selectOption("#blickwahl", "oben");
  const eigen = await seite.evaluate(
    () => KE.szene().ausloeser.find((a) => a.name === "treppeDachboden").eigenschaften,
  );
  pruefe(
    eigen?.ankunft === ziel.join(",") && eigen.blick === "oben",
    `Festes Ankunftsfeld mit Blick (${JSON.stringify(eigen)})`,
  );
  pruefe(/fest/.test(await seite.textContent("#ankunftsanzeige")), "Anzeige nennt das feste Feld");
  await seite.click("[data-schalter=raster]");
  await h.foto(seite, "32-ankunft-fest");
  await seite.click("[data-schalter=raster]");
}

async function zumZiel(seite, pruefe) {
  await seite.click("#eigenschaften button.zumZiel");
  const stand = await seite.evaluate(() => ({
    datei: KE.zustand.datei,
    namen: KE.ausgewaehlt().map((t) => t.eintrag.name),
  }));
  pruefe(
    stand.datei === "maple-falls-dachboden.json" &&
      stand.namen.length === 2 &&
      stand.namen.every((n) => n === "treppeDiner"),
    `„Zum Ziel“ öffnet den Dachboden und wählt den Gegenauslöser (${JSON.stringify(stand)})`,
  );
  await h.foto(seite, "33-zum-ziel");
  await seite.keyboard.press("Escape");
}

/** Der ganze Teil: neuer Übergang mit Gegenauslöser, Ankunft, „Zum Ziel“. */
async function uebergaenge(seite, pruefe) {
  const gegen = await neuerUebergang(seite, pruefe);
  await ankunft(seite, pruefe, gegen);
  await zumZiel(seite, pruefe);
}

/** Kopie von orte.json im Testordner; Ausgabe: Argumente für den Rücklauf. */
function ruecklaufArgumente(arbeit) {
  const orte = path.join(arbeit, "orte.json");
  fs.copyFileSync(path.join(h.HAUPT, "inhalte/abenteuer/orte.json"), orte);
  return ["--orte", orte];
}

/** Prüft Bericht und orte.json-Kopie nach dem Rücklauf; die echte orte.json bleibt unberührt. */
function pruefeRuecklauf(ausgabe, arbeit, pruefe) {
  const orte = JSON.parse(fs.readFileSync(path.join(arbeit, "orte.json"), "utf8"));
  const maple = orte.orte.find((o) => o.kennung === "mapleFalls").ausloeser;
  const hin = maple.find((a) => a.name === "treppeDiner" && a.karte === DACHBODEN);
  const zurueck = maple.find((a) => a.name === "treppeDachboden" && a.karte === DINER);
  pruefe(
    hin?.ziel?.ausloeser === "treppeDachboden" && zurueck?.ziel?.ausloeser === "treppeDiner",
    "Rücklauf schreibt beide Übergänge in die Kopie von orte.json",
  );
  pruefe(/Übergang neu: mapleFalls treppeDiner/.test(ausgabe), "Bericht nennt neue Übergänge");
  const echt = fs.readFileSync(path.join(h.HAUPT, "inhalte/abenteuer/orte.json"), "utf8");
  pruefe(!echt.includes('"treppeDiner"'), "Echte orte.json bleibt unberührt");
}

module.exports = { uebergaenge, ruecklaufArgumente, pruefeRuecklauf };

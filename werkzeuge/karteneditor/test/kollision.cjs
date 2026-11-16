/*
 * Teile des Oberflächentests (editor.test.cjs) für die Kollision je Objekt und den selbst gebauten
 * Treppenabgang (Wunsch des Autors, 16.11.2026): Schalter „Sperrt / Durchgehbar“ mit Grundfeld,
 * Mehrfachauswahl, „Kollision bearbeiten“ mit Kachelklick, Kollisionsanzeige, Rückgängig,
 * „Zurück zum Katalog“; dann im Dachboden (nur im Browser und in einer Kopie im Testordner): Treppe
 * setzen, obere Kacheln mit Dielen abdecken, Treppe bis auf das Loch durchgehbar machen, Übergang
 * auf die Lochkacheln setzen, Auslöser duplizieren und löschen; zuletzt die zurückgeschriebene
 * Kopie im Kartenbau (Tiefen, Regel 10.84, Befunde).
 */
"use strict";
const { execFileSync } = require("child_process");
const h = require("./hilfen.cjs");

const K = 16;
const TREPPE = "mf4TreppeAb";
const DIELE = "bkDielen";
// Linke obere Kachel der Treppe im Dachboden (frei genug für 6 × 5 Kacheln nach dem Aufräumen).
const TREPPENFELD = [4, 4];

/** Bildschirmpunkt der Mitte einer Kachel (x, y in Kacheln). */
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

const gesperrt = (seite) =>
  seite.evaluate(() => [...KE.sperrkacheln(KE.szene(), KE.platziere(KE.szene()))]);

/** Ein anklickbares Objekt, das laut Katalog sperrt und nicht flach ist. */
async function sperrendesObjekt(seite, ausser = []) {
  const kandidaten = await seite.evaluate(() =>
    KE.platziere(KE.szene())
      .filter((s) => s.kollision && !KE.zustand.daten.moebel[s.kennung]?.flach)
      .map((s) => s.uid),
  );
  for (const uid of kandidaten.filter((u) => !ausser.includes(u))) {
    const p = await h.punkt(seite, uid);
    if (p) return { uid, p };
  }
  throw new Error("Kein sperrendes Objekt gefunden");
}

async function schalterUndGrund(seite, pruefe) {
  await seite.keyboard.press("Escape");
  const a = await sperrendesObjekt(seite);
  await seite.mouse.click(a.p.x, a.p.y);
  const vorher = new Set(await gesperrt(seite));
  await seite.click("#eigenschaften button.durchgehbar");
  pruefe(
    (await h.eintrag(seite, a.uid)).kollision === false,
    "Schalter macht das Objekt durchgehbar",
  );
  pruefe(await seite.isVisible("#begehbargrund"), "Grundfeld erscheint");
  pruefe(await seite.isVisible(".grundhinweis"), "Hinweis: Grund fehlt");
  const nachher = new Set(await gesperrt(seite));
  pruefe(nachher.size < vorher.size, "Kollisionsanzeige gibt die Kacheln frei");
  await h.foto(seite, "10-durchgehbar-grund");
  await seite.fill("#begehbargrund", "nur ein flacher Schatten");
  await seite.press("#begehbargrund", "Enter");
  pruefe(
    (await h.eintrag(seite, a.uid)).begehbar_grund === "nur ein flacher Schatten",
    "Grund gespeichert",
  );
  pruefe(!(await seite.isVisible(".grundhinweis")), "Hinweis verschwindet mit Grund");
  await seite.keyboard.press("Control+z");
  pruefe(!(await h.eintrag(seite, a.uid)).begehbar_grund, "Rückgängig entfernt den Grund");
  await seite.keyboard.press("Control+z");
  pruefe(
    (await h.eintrag(seite, a.uid)).kollision === undefined,
    "Rückgängig: wieder wie im Katalog",
  );
  // Mehrfachauswahl: beide durchgehbar, dann sperrt eines wieder (es bleibt durchgehbar im Bericht).
  const b = await sperrendesObjekt(seite, [a.uid]);
  await seite.keyboard.down("Control");
  await seite.mouse.click(b.p.x, b.p.y);
  await seite.keyboard.up("Control");
  await seite.click("#eigenschaften button.durchgehbar");
  const beide = [await h.eintrag(seite, a.uid), await h.eintrag(seite, b.uid)];
  pruefe(
    beide.every((e) => e.kollision === false),
    "Schalter wirkt auf die Mehrfachauswahl",
  );
  await seite.click("#eigenschaften button.sperrt");
  pruefe((await h.eintrag(seite, b.uid)).kollision === undefined, "Sperrt: zurück auf den Katalog");
  await seite.keyboard.press("Control+z");
  return a.uid;
}

async function kachelnBearbeiten(seite, pruefe) {
  await seite.keyboard.press("Escape");
  const a = await sperrendesObjekt(seite);
  await seite.mouse.click(a.p.x, a.p.y);
  await seite.click("#eigenschaften button.kollisionbearbeiten");
  pruefe(await seite.evaluate(() => !!KE.zustand.kollisionUid), "Modus „Kollision bearbeiten“ an");
  const s = await seite.evaluate((u) => {
    const st = KE.platziere(KE.szene()).find((x) => x.uid === u);
    return { x: Math.floor(st.x / 16), y: Math.floor(st.y / 16) };
  }, a.uid);
  const vorher = (await gesperrt(seite)).includes(`${s.x},${s.y}`);
  const p = await kachelpunkt(seite, s.x, s.y);
  await seite.mouse.click(p.x, p.y);
  const e = await h.eintrag(seite, a.uid);
  pruefe(Array.isArray(e.maske), `Kachelklick speichert eine Maske (${JSON.stringify(e.maske)})`);
  pruefe(
    (await gesperrt(seite)).includes(`${s.x},${s.y}`) !== vorher,
    "Kollisionsanzeige folgt der Kachel",
  );
  pruefe((await h.auswahl(seite)).join() === a.uid, "Kachelklick ändert die Auswahl nicht");
  await h.foto(seite, "11-kollision-bearbeiten");
  await seite.keyboard.press("Control+z");
  pruefe(!(await h.eintrag(seite, a.uid)).maske, "Rückgängig nimmt die Maske zurück");
  await seite.keyboard.press("Control+y");
  await seite.click("#eigenschaften button.zumkatalog");
  pruefe(
    !("maske" in (await h.eintrag(seite, a.uid))),
    "Zurück zum Katalog entfernt die Übersteuerung",
  );
  await seite.keyboard.press("Escape");
  pruefe(await seite.evaluate(() => !KE.zustand.kollisionUid), "Esc beendet den Modus");
  // Für den Rücklauf bleibt eine Übersteuerung ohne Grund stehen.
  await seite.mouse.click(a.p.x, a.p.y);
  await seite.click("#eigenschaften button.durchgehbar");
  await seite.keyboard.press("Escape");
}

/** Wählt genau ein Objekt über seine uid (wie ein Klick, ohne Suche nach einem freien Punkt). */
function waehle(seite, uid) {
  return seite.evaluate((u) => {
    KE.zustand.auswahl = new Set([u]);
    KE.meldeAenderung();
  }, uid);
}

async function treppenabgang(seite, pruefe) {
  await seite.click('.kartenknopf[data-datei="maple-falls-dachboden.json"]');
  await seite.waitForTimeout(200);
  // Platz schaffen: was dort steht, wo die Treppe hin soll, kommt weg (nur in der Arbeitskopie).
  const [tx, ty] = TREPPENFELD;
  await seite.evaluate(
    ([tx, ty]) => {
      const im = (s) =>
        s.x < (tx + 6) * 16 && s.x + s.b > tx * 16 && s.y < (ty + 5) * 16 && s.y + s.h > ty * 16;
      KE.zustand.auswahl = new Set(
        KE.platziere(KE.szene())
          .filter(im)
          .map((s) => s.uid),
      );
    },
    [tx, ty],
  );
  await seite.keyboard.press("Delete");
  // Treppe setzen (wie Ziehen aus der Bibliothek), dann die oberen zwei Reihen mit Dielen abdecken.
  await seite.evaluate(([k, x, y]) => KE.fuegeEin(k, x * 16 + 48, y * 16 + 40), [TREPPE, tx, ty]);
  const treppe = (await h.auswahl(seite))[0];
  // Nur die eben gesetzten Dielen zählen: Die Karte des Autors trägt selbst Bodenkacheln.
  const dielen = [];
  for (let y = 0; y < 2; y++)
    for (let x = 0; x < 6; x++) {
      await seite.evaluate(
        ([k, x, y]) => KE.fuegeEin(k, x * 16 + 8, y * 16 + 8),
        [DIELE, tx + x, ty + y],
      );
      dielen.push((await h.auswahl(seite))[0]);
    }
  const tiefen = await seite.evaluate(
    ([u, dielen]) => {
      const alle = KE.platziere(KE.szene());
      const tiefe = (uid) => alle.find((s) => s.uid === uid).tiefe;
      return { treppe: tiefe(u), diele: [...new Set(dielen.map(tiefe))] };
    },
    [treppe, dielen],
  );
  pruefe(
    tiefen.treppe === 1 && tiefen.diele.join() === "2",
    `Dielen liegen über der Treppe (${JSON.stringify(tiefen)})`,
  );
  // Treppe bis auf das Loch durchgehbar: abgedeckte Reihen frei, unter dem Einstieg gesperrt.
  await waehle(seite, treppe);
  await seite.click("#eigenschaften button.kollisionbearbeiten");
  const klicks = [];
  for (const y of [0, 1]) for (const x of [0, 1, 4, 5]) klicks.push([x, y]);
  for (const y of [3, 4]) for (const x of [2, 3]) klicks.push([x, y]);
  for (const [x, y] of klicks) {
    const p = await kachelpunkt(seite, tx + x, ty + y);
    await seite.mouse.click(p.x, p.y);
  }
  const maske = (await h.eintrag(seite, treppe)).maske;
  const soll = ["......", "......", "##..##", "######", "######"];
  pruefe(JSON.stringify(maske) === JSON.stringify(soll), `Treppenmaske ${JSON.stringify(maske)}`);
  await seite.keyboard.press("Escape");
  // Übergang auf die Lochkacheln: wie der bestehende Übergang „treppe“, dann Strg+D daneben.
  const vorher = await seite.evaluate(() => KE.szene().ausloeser.length);
  await seite.selectOption("#uebergangsvorlage", "treppe");
  await seite.click("#eigenschaften button.uebergangHier");
  const loch = await kachelpunkt(seite, tx + 2, ty + 2);
  await seite.mouse.click(loch.x, loch.y);
  await seite.keyboard.press("Control+d");
  const neu = await seite.evaluate((n) => KE.szene().ausloeser.slice(n), vorher);
  pruefe(
    neu.length === 2 &&
      neu.every((a) => a.name === "treppe") &&
      neu[1].feld.join() === `${tx + 3},${ty + 2}`,
    `Übergang hier und Strg+D (${JSON.stringify(neu.map((a) => a.feld))})`,
  );
  await seite.keyboard.press("Control+d");
  await seite.keyboard.press("Delete");
  pruefe(
    (await seite.evaluate(() => KE.szene().ausloeser.length)) === vorher + 2,
    "Entf löscht einen Auslöser",
  );
  await seite.keyboard.press("Escape");
  await h.foto(seite, "12-treppenabgang");
  await seite.evaluate(() => KE.schalte("kollision", true));
  await seite.click("[data-schalter=raster]");
  await h.foto(seite, "13-treppenabgang-kollision");
  await seite.evaluate(() => KE.schalte("kollision", false));
  await seite.click("[data-schalter=raster]");
}

// Treppe flach (1), Dielen darüber (2), kein Befund 10.84, keine Kollisionsbefunde.
const DACHBODENPRUEFUNG = `
import json, sys
from pipeline.abenteuer.anordnung import pruefe_loecher
from pipeline.abenteuer.kartenbau import platziere
from pipeline.abenteuer.moebelliste import lade_moebel
from pipeline.abenteuer.objektkollision import kollisionsbefunde
szene, moebel = json.load(open(sys.argv[1])), lade_moebel()
gesetzt = platziere(szene, moebel)[0]
treppe = [s for s in gesetzt if s["name"] == "mf4TreppeAb"][0]
# Nur Dielen auf der Treppe: Die Karte des Autors trägt selbst Bodenkacheln (etwa am Treppenloch).
auf = lambda s: s["x"] < treppe["x"] + treppe["breite"] and treppe["x"] < s["x"] + s["breite"] and s["y"] < treppe["y"] + treppe["hoehe"] and treppe["y"] < s["y"] + s["hoehe"]
d = ",".join(str(t) for t in sorted({s["tiefe"] for s in gesetzt if s["name"] == "bkDielen" and auf(s)}))
print(treppe["tiefe"], d, pruefe_loecher(szene, gesetzt, moebel), kollisionsbefunde(szene, moebel))
`;

/** Die zurückgeschriebene Kopie des Dachbodens: Tiefe, Loch (10.84) und Befunde wie im Kartenbau. */
function dachbodenRuecklauf(kopie, pruefe) {
  const pruefung = execFileSync("python3", ["-c", DACHBODENPRUEFUNG, kopie], {
    cwd: h.HAUPT,
    encoding: "utf8",
  }).trim();
  pruefe(pruefung === "1 2 [] []", `Dachboden-Kopie: Tiefen, 10.84, Befunde (${pruefung})`);
}

module.exports = {
  schalterUndGrund,
  dachbodenRuecklauf,
  kachelnBearbeiten,
  treppenabgang,
  sperrendesObjekt,
  K,
};

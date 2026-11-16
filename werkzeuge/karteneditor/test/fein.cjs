/*
 * Teile des Oberflächentests (editor.test.cjs) für die feine Kollision (Editor 1.6, Wunsch des
 * Autors, 16.11.2026): Schalter „Fein“ mit Taste F, Malen und Umschalt+Ziehen in Zellen, ganze
 * Kachel wird grob, Radierer in Zellen, Rückgängig, Kennzeichen für teilweise gesperrte Kacheln,
 * feine Freigabe in der Wand, „Kollision bearbeiten“ fein an einem Bild (maske_fein, gedreht) und
 * die Zeilen im Rücklauf.
 */
"use strict";
const { execFileSync } = require("child_process");
const path = require("path");
const h = require("./hilfen.cjs");

const K = 16;
const Z = 4;

/** Bildschirmpunkt der Mitte einer Zelle (cx, cy in Zellen von 4 Pixeln). */
function zellpunkt(seite, [cx, cy]) {
  return seite.evaluate(
    ([cx, cy]) => {
      const r = document.getElementById("leinwand").getBoundingClientRect();
      const a = KE.zustand.ansicht;
      return { x: r.left + (cx * 4 + 2 - a.x) * a.zoom, y: r.top + (cy * 4 + 2 - a.y) * a.zoom };
    },
    [cx, cy],
  );
}

/** Zieht von Zelle a nach Zelle b (mit Umschalt: Rechteck). */
async function streiche(seite, a, b, umschalt = false) {
  const p = await zellpunkt(seite, a);
  const q = await zellpunkt(seite, b);
  if (umschalt) await seite.keyboard.down("Shift");
  await seite.mouse.move(p.x, p.y);
  await seite.mouse.down();
  await seite.mouse.move(q.x, q.y, { steps: 6 });
  await seite.mouse.up();
  if (umschalt) await seite.keyboard.up("Shift");
}

/** Drei freie Kacheln nebeneinander und eine Wand mit Boden darunter (wie pinsel.cjs). */
function stellen(seite) {
  return seite.evaluate(() => {
    const s = KE.szene();
    const stuecke = KE.platziere(s);
    const belegt = new Set([...KE.grundsperren(s, stuecke, false), ...KE.sperrkacheln(s, stuecke)]);
    const gemalt = new Set();
    for (const m of KE.markierungen(s)) belegt.add(m.eintrag.feld.join(","));
    for (const n of ["sperren", "freigeben", "sperren_fein", "freigeben_fein"])
      for (const f of s[n] || []) gemalt.add(f[0] + "," + f[1]);
    for (const k of gemalt) belegt.add(k);
    const frei = (x, y) => y > 0 && y < s.raster.length - 1 && !belegt.has(x + "," + y);
    for (let y = 1; y < s.raster.length - 1; y++)
      for (let x = 1; x < s.raster[y].length - 3; x++)
        if (frei(x, y) && frei(x + 1, y) && frei(x + 2, y)) {
          const raster = (a, b) => (s.raster[b] || "")[a];
          let wand = null;
          for (let b = 1; b < s.raster.length - 1 && !wand; b++)
            for (let a = 1; a < s.raster[b].length - 1 && !wand; a++)
              if (raster(a, b) === "#" && raster(a, b + 1) === "." && !gemalt.has(a + "," + b))
                wand = [a, b];
          return { kacheln: [0, 1, 2].map((d) => [x + d, y]), wand };
        }
    return null;
  });
}

const liste = (seite, name) => seite.evaluate((n) => KE.szene()[n] || [], name);
const maskeVon = async (seite, name, [x, y]) =>
  ((await liste(seite, name)).find((e) => e[0] === x && e[1] === y) || [])[2];

async function schalter(seite, pruefe) {
  const vorher = await seite.evaluate(() => JSON.stringify(KE.zustand.ansicht));
  await seite.keyboard.press("s");
  await seite.keyboard.press("f");
  pruefe(await seite.evaluate(() => KE.zustand.fein), "Taste F im Kollisionspinsel: Fein an");
  pruefe(
    (await seite.evaluate(() => JSON.stringify(KE.zustand.ansicht))) === vorher,
    "Taste F passt im Pinsel die Ansicht nicht ein",
  );
  pruefe(await seite.isVisible("#feinknopf.an"), "Knopf „Fein“ sichtbar und an");
}

async function malen(seite, pruefe, [a, b, c]) {
  const zelle = ([x, y], i, j) => [x * Z + i, y * Z + j];
  await streiche(seite, zelle(a, 0, 0), zelle(a, 3, 1), true);
  pruefe(
    (await maskeVon(seite, "sperren_fein", a)) === "########........",
    "Rechteck: obere Hälfte",
  );
  const anzeige = await seite.evaluate(() => {
    const s = KE.szene();
    const st = KE.platziere(s);
    const an = KE.sperranzeige(s, st);
    return { teil: [...an.teilkacheln], zellen: an.zellen.length, zu: [...KE.sperrkacheln(s, st)] };
  });
  pruefe(anzeige.teil.includes(a.join(",")), "Teilweise gesperrte Kachel bekommt ein Kennzeichen");
  pruefe(anzeige.zellen >= 8, `Gelbe Anzeige zeigt die Zellen (${anzeige.zellen})`);
  pruefe(anzeige.zu.includes(a.join(",")), "Für Ankunft und Figuren gilt die Kachel als gesperrt");
  await streiche(seite, zelle(b, 0, 0), zelle(b, 0, 3));
  pruefe(
    (await maskeVon(seite, "sperren_fein", b)) === "#...#...#...#...",
    "Ziehen: linkes Viertel",
  );
  await h.foto(seite, "40-fein-malen");
  await streiche(seite, zelle(c, 0, 0), zelle(c, 3, 3), true);
  const grob = (await liste(seite, "sperren")).map((f) => f.join(","));
  pruefe(
    grob.includes(c.join(",")) && !(await maskeVon(seite, "sperren_fein", c)),
    "Ganz gesperrte Kachel wird grob geschrieben",
  );
  await seite.keyboard.press("x");
  const p = await zellpunkt(seite, zelle(c, 3, 3));
  await seite.mouse.click(p.x, p.y);
  pruefe(
    (await maskeVon(seite, "sperren_fein", c)) === "###############." &&
      !(await liste(seite, "sperren")).some((f) => f.join(",") === c.join(",")),
    "Radierer nimmt eine Zelle, die Kachel wird fein",
  );
  await seite.keyboard.press("Control+z");
  pruefe(
    (await liste(seite, "sperren")).some((f) => f.join(",") === c.join(",")),
    "Strg+Z macht die Zelle rückgängig",
  );
  // Aufräumen: Die grobe Kachel wieder weg (der Rücklauf von pinsel.cjs zählt die groben Sperren).
  await streiche(seite, zelle(c, 0, 0), zelle(c, 3, 3), true);
  pruefe(
    !(await liste(seite, "sperren")).some((f) => f.join(",") === c.join(",")) &&
      !(await maskeVon(seite, "sperren_fein", c)),
    "Radierer als Rechteck leert die ganze Kachel",
  );
}

async function wand(seite, pruefe, w) {
  if (!w) return pruefe(false, "Keine Wandkachel für die feine Freigabe gefunden");
  await seite.keyboard.press("o");
  await streiche(seite, [w[0] * Z, w[1] * Z + 2], [w[0] * Z + 3, w[1] * Z + 3], true);
  pruefe(
    (await maskeVon(seite, "freigeben_fein", w)) === "........########",
    "Feine Freigabe in der Wand",
  );
  pruefe(await seite.isVisible("#freigabegrund"), "Freigabe in der Wand: Feld für den Grund");
  await seite.click("[data-schalter=raster]");
  await h.foto(seite, "41-fein-wand");
  await seite.click("[data-schalter=raster]");
  await seite.keyboard.press("Escape");
}

async function bildFein(seite, pruefe) {
  await seite.keyboard.press("Escape");
  const kandidat = await seite.evaluate(() =>
    KE.platziere(KE.szene()).find(
      (s) => s.kollision && s.b >= 32 && s.h >= 32 && !KE.zustand.daten.moebel[s.kennung]?.flach,
    ),
  );
  if (!kandidat) return pruefe(false, "Kein sperrendes Bild für „Kollision bearbeiten“ fein");
  const uid = kandidat.uid;
  await seite.evaluate((u) => {
    KE.zustand.auswahl = new Set([u]);
    KE.finde(u).eintrag.drehung = 90; // gedreht: die feine Maske wird ungedreht gespeichert
    KE.meldeAenderung();
  }, uid);
  await seite.click("#eigenschaften button.kollisionbearbeiten");
  // „Fein“ bleibt vom Kollisionspinsel an (ein Schalter für beide Modi); F schaltet ihn um.
  if (!(await seite.evaluate(() => KE.zustand.fein))) await seite.keyboard.press("f");
  pruefe(
    await seite.isVisible("#eigenschaften button.fein.an"),
    "„Fein“ auch bei „Kollision bearbeiten“",
  );
  const ecke = await seite.evaluate((u) => {
    const s = KE.platziere(KE.szene()).find((x) => x.uid === u);
    return [Math.round(s.x / 4), Math.round(s.y / 4)];
  }, uid);
  await streiche(seite, ecke, [ecke[0] + 1, ecke[1] + 3], true);
  const e = await h.eintrag(seite, uid);
  pruefe(Array.isArray(e.maske_fein) && !e.maske, `Bild trägt eine feine Maske (${e.maske_fein})`);
  const lage = await seite.evaluate((u) => {
    const s = KE.platziere(KE.szene()).find((x) => x.uid === u);
    return s.angabe.maske_fein.slice(0, 4).map((z) => z.slice(0, 4));
  }, uid);
  const wert = lage[0][0];
  pruefe(
    lage.every((z) => z.slice(0, 2) === wert + wert),
    `Zellen liegen gedreht richtig (${lage})`,
  );
  await h.foto(seite, "42-fein-bild");
  await seite.keyboard.press("Control+z");
  pruefe(!(await h.eintrag(seite, uid)).maske_fein, "Rückgängig nimmt die feine Maske");
  await seite.keyboard.press("Control+y");
  await seite.keyboard.press("f");
  await seite.keyboard.press("Escape");
  pruefe(await seite.evaluate(() => !KE.zustand.fein), "Taste F schaltet Fein wieder aus");
}

/** Der ganze Ablauf auf der Diner-Karte; die Änderungen gehen in den Rücklauf. */
async function fein(seite, pruefe) {
  await seite.evaluate((d) => KE.oeffne(d), h.KARTE);
  await seite.keyboard.press("Escape");
  const st = await stellen(seite);
  pruefe(!!st, `Teststellen fein ${JSON.stringify(st)}`);
  if (!st) return;
  await schalter(seite, pruefe);
  await malen(seite, pruefe, st.kacheln);
  await wand(seite, pruefe, st.wand);
  await bildFein(seite, pruefe);
}

// Die zurückgeschriebene Diner-Kopie: keine Befunde der feinen Felder, Tiled trägt „sperren_fein“.
// Ausgabe: Befunde und die Zahl der feinen Sperren, die gegenüber der echten Szene hinzukamen (die
// Karte des Autors trägt selbst feine Sperren).
const DINERPRUEFUNG = `
import json, sys
from pipeline.abenteuer.feinbericht import feinbefunde
from pipeline.abenteuer.kartenbau import platziere, raster, tiled, lade, INHALTE
from pipeline.abenteuer.moebelliste import lade_moebel
moebel = lade_moebel()
def feine(szene):
    karte = tiled(szene, raster(szene), platziere(szene, moebel)[0], lade(INHALTE / "karten" / "maple-falls-dachboden.json"))
    return sum(e["value"].count(";") + 1 for e in karte["properties"] if e["name"] == "sperren_fein")
szene, echt = (json.load(open(d)) for d in sys.argv[1:3])
print(feinbefunde(szene, raster(szene)), [feine(szene) - feine(echt)])
`;

/** Prüft die Zeilen des Rücklaufs zur feinen Kollision (Kachel und Anteil) und die Diner-Kopie. */
function ruecklauf(ausgabe, pruefe, dinerKopie) {
  const echt = path.join(h.HAUPT, "inhalte/abenteuer/szenen", h.KARTE);
  const ergebnis = execFileSync("python3", ["-c", DINERPRUEFUNG, dinerKopie, echt], {
    cwd: h.HAUPT,
    encoding: "utf8",
  }).trim();
  pruefe(ergebnis === "[] [3]", `Diner-Kopie: feine Felder ohne Befund, in Tiled (${ergebnis})`);
  pruefe(
    /Kollision: Pinsel sperrt fein .*obere Hälfte/.test(ausgabe),
    "Bericht: feine Sperre mit Anteil",
  );
  pruefe(/linkes Viertel/.test(ausgabe), "Bericht nennt das linke Viertel");
  pruefe(
    /Kollision: Pinsel gibt frei fein .*untere Hälfte/.test(ausgabe),
    "Bericht: feine Freigabe",
  );
  pruefe(
    /Kollision: .*maske_fein \(\d, \d\) /.test(ausgabe),
    "Bericht nennt die feine Maske des Bildes",
  );
}

module.exports = { fein, ruecklauf, K };

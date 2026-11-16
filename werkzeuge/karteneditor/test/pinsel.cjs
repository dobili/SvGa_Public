/*
 * Teile des Oberflächentests (editor.test.cjs) für den Kollisionspinsel (Editor 1.3, Wunsch des
 * Autors, 16.11.2026): Sperren durch Ziehen über mehrere Kacheln, Freigeben unter einem Möbel,
 * Umschalt+Ziehen für ein Rechteck, Radierer, Rückgängig und Wiederholen, Freigabe in der Wand mit
 * Grund, Übertragen auf die Zustandsfassung. Herunterladen und Rücklauf prüft editor.test.cjs.
 */
"use strict";
const { execFileSync } = require("child_process");
const h = require("./hilfen.cjs");

// Kollisionspinsel in der Diner-Kopie: keine Befunde (die Freigabe in der Wand hat ihren Grund),
// die Tiled-Karte trägt Sperren und Freigaben als Eigenschaften (kollisionspinsel.py).
const DINERPRUEFUNG = `
import json, sys
from pipeline.abenteuer.kartenbau import platziere, raster, tiled, lade, INHALTE
from pipeline.abenteuer.kollisionspinsel import pinselbefunde
from pipeline.abenteuer.moebelliste import lade_moebel
szene = json.load(open(sys.argv[1]))
karte = tiled(szene, raster(szene), platziere(szene, lade_moebel())[0], lade(INHALTE / "karten" / "maple-falls-dachboden.json"))
namen = sorted(e["name"] for e in karte["properties"] if e["name"] in ("sperren", "freigeben"))
print(pinselbefunde(szene, raster(szene)), namen, len(szene["sperren"]), szene["freigeben_grund"])
`;

/** Bildschirmpunkt der Mitte einer Kachel. */
function kachelpunkt(seite, [x, y]) {
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
 * Stellen für den Test: drei freie Kacheln nebeneinander (Strich), ein freies 2 × 2-Feld
 * (Rechteck), eine Kachel unter einem Möbel und eine Wandkachel, die an Boden grenzt. Frei heißt:
 * kein Raster, kein Möbel, keine Figur, kein Auslöser.
 */
function stellen(seite) {
  return seite.evaluate(() => {
    const s = KE.szene();
    const stuecke = KE.platziere(s);
    const grund = KE.grundsperren(s, stuecke, false);
    const belegt = new Set([...grund, ...KE.sperrkacheln(s, stuecke)]);
    for (const m of KE.markierungen(s)) belegt.add(m.eintrag.feld.join(","));
    const frei = (x, y) => y > 0 && y < s.raster.length - 1 && !belegt.has(x + "," + y);
    const benutzt = new Set();
    const nimm = (felder) => (felder.forEach((f) => benutzt.add(f.join(","))), felder);
    const suche = (passt) => {
      for (let y = 1; y < s.raster.length - 1; y++)
        for (let x = 1; x < s.raster[y].length - 2; x++) if (passt(x, y)) return [x, y];
      return null;
    };
    const ok = (x, y) => frei(x, y) && !benutzt.has(x + "," + y);
    const [sx, sy] = suche((x, y) => ok(x, y) && ok(x + 1, y) && ok(x + 2, y));
    const strich = nimm([0, 1, 2].map((d) => [sx + d, sy]));
    const [rx, ry] = suche((x, y) => ok(x, y) && ok(x + 1, y) && ok(x, y + 1) && ok(x + 1, y + 1));
    const rechteck = nimm([
      [rx, ry],
      [rx + 1, ry],
      [rx, ry + 1],
      [rx + 1, ry + 1],
    ]);
    const raster = (x, y) => (s.raster[y] || "")[x];
    const marken = new Set(KE.markierungen(s).map((m) => m.eintrag.feld.join(",")));
    // Gesperrt nur durch ein Möbel: Boden im Raster, keine Figur, kein Auslöser.
    const moebel = suche(
      (x, y) => grund.has(x + "," + y) && !"#~ ".includes(raster(x, y)) && !marken.has(x + "," + y),
    );
    const wand = suche((x, y) => raster(x, y) === "#" && raster(x, y + 1) === ".");
    return { strich, rechteck, moebel, wand };
  });
}

const liste = (seite, name, datei) =>
  seite.evaluate(([n, d]) => (KE.szene(d)[n] || []).map((f) => f.join(",")), [name, datei]);
const gesperrt = (seite, feld) =>
  seite.evaluate(
    (f) => KE.sperrkacheln(KE.szene(), KE.platziere(KE.szene())).has(f.join(",")),
    feld,
  );

async function streiche(seite, felder, umschalt = false) {
  const a = await kachelpunkt(seite, felder[0]);
  const b = await kachelpunkt(seite, felder.at(-1));
  if (umschalt) await seite.keyboard.down("Shift");
  await seite.mouse.move(a.x, a.y);
  await seite.mouse.down();
  await seite.mouse.move(b.x, b.y, { steps: 3 });
  await seite.mouse.up();
  if (umschalt) await seite.keyboard.up("Shift");
}

async function klick(seite, feld) {
  const p = await kachelpunkt(seite, feld);
  await seite.mouse.click(p.x, p.y);
}

async function sperrenUndRechteck(seite, pruefe, st) {
  await seite.keyboard.press("s");
  pruefe(
    await seite.evaluate(() => KE.zustand.kpinsel === "sperren" && KE.zustand.schalter.kollision),
    "Taste S: Kollisionspinsel „Sperren“, Kollisionsanzeige an",
  );
  pruefe(await seite.isVisible("#kpinselwahl"), "Modusknöpfe erscheinen");
  await streiche(seite, st.strich);
  const sperren = await liste(seite, "sperren");
  pruefe(
    st.strich.every((f) => sperren.includes(f.join(","))) && sperren.length === 3,
    `Ziehen sperrt drei Kacheln (${sperren})`,
  );
  pruefe(await gesperrt(seite, st.strich[1]), "Gemalte Sperre zählt in der Kollision");
  await streiche(seite, [st.rechteck[0], st.rechteck[3]], true);
  const mit = await liste(seite, "sperren");
  pruefe(
    st.rechteck.every((f) => mit.includes(f.join(","))) && mit.length === 7,
    `Umschalt+Ziehen malt ein Rechteck (${mit.length} Kacheln)`,
  );
  await h.foto(seite, "20-pinsel-sperren");
}

async function freigebenUndRadierer(seite, pruefe, st) {
  await seite.click('#kpinselwahl [data-kmodus="freigeben"]');
  await klick(seite, st.moebel);
  pruefe(
    (await liste(seite, "freigeben")).join() === st.moebel.join(","),
    `Freigabe unter einem Möbel (${st.moebel})`,
  );
  pruefe(!(await gesperrt(seite, st.moebel)), "Freigabe sticht das Möbel");
  await klick(seite, st.strich[0]);
  pruefe(
    !(await liste(seite, "sperren")).includes(st.strich[0].join(",")) &&
      (await liste(seite, "freigeben")).length === 1,
    "Freigeben auf einer gemalten Sperre nimmt nur die Sperre weg",
  );
  await h.foto(seite, "21-pinsel-freigeben");
  await seite.keyboard.press("x");
  await klick(seite, st.moebel);
  pruefe((await liste(seite, "freigeben")).length === 0, "Radierer entfernt die Freigabe");
  pruefe(await gesperrt(seite, st.moebel), "Radierer: das Möbel sperrt wieder");
  await seite.keyboard.press("Control+z");
  pruefe((await liste(seite, "freigeben")).length === 1, "Strg+Z holt die Freigabe zurück");
  await seite.keyboard.press("Control+y");
  pruefe((await liste(seite, "freigeben")).length === 0, "Strg+Y entfernt sie wieder");
  await seite.keyboard.press("Control+z");
  await seite.keyboard.press("x");
  pruefe(await seite.evaluate(() => KE.zustand.kpinsel === null), "Taste X noch einmal: aus");
}

async function wandMitGrund(seite, pruefe, st) {
  await seite.keyboard.press("o");
  await klick(seite, st.wand);
  pruefe(
    (await liste(seite, "freigeben")).includes(st.wand.join(",")),
    `Freigabe in der Wand (${st.wand})`,
  );
  pruefe(await seite.isVisible("#eigenschaften .pinselfeld .grundhinweis"), "Hinweis: Grund fehlt");
  await seite.fill("#freigabegrund", "Geheimgang zum Test");
  await seite.press("#freigabegrund", "Enter");
  pruefe(
    (await seite.evaluate(() => KE.szene().freigeben_grund)) === "Geheimgang zum Test",
    "Grund der Freigabe gespeichert",
  );
  pruefe(!(await seite.isVisible(".pinselfeld .grundhinweis")), "Hinweis verschwindet mit Grund");
  await seite.click("[data-schalter=raster]");
  await h.foto(seite, "22-pinsel-wand-raster");
  await seite.click("[data-schalter=raster]");
  await seite.keyboard.press("Escape");
  pruefe(await seite.evaluate(() => KE.zustand.kpinsel === null), "Esc beendet den Pinsel");
}

async function aufFassung(seite, pruefe) {
  await seite.keyboard.press("Escape");
  pruefe(
    await seite.isEnabled(".fassungshinweis button"),
    "Übertragen geht auch ohne Auswahl, wenn gemalt wurde",
  );
  await seite.click(".fassungshinweis button");
  const hier = await liste(seite, "sperren");
  const dort = await liste(seite, "sperren", h.FASSUNG);
  pruefe(
    hier.length > 0 && hier.every((k) => dort.includes(k)),
    `Pinselkacheln auf die Fassung übertragen (${dort.length})`,
  );
  pruefe(/Pinselkachel/.test(await seite.textContent("#status")), "Status nennt die Pinselkacheln");
}

/** Der ganze Ablauf auf der Diner-Karte (h.KARTE); die Änderungen gehen in den Rücklauf. */
async function kollisionspinsel(seite, pruefe) {
  // Die Gruppe des Diners kann zugeklappt sein (zuletzt war eine Variante offen): direkt öffnen.
  await seite.evaluate((d) => KE.oeffne(d), h.KARTE);
  await seite.waitForTimeout(200);
  const st = await stellen(seite);
  pruefe(!!(st.strich && st.rechteck && st.moebel && st.wand), `Teststellen ${JSON.stringify(st)}`);
  await sperrenUndRechteck(seite, pruefe, st);
  await freigebenUndRadierer(seite, pruefe, st);
  await wandMitGrund(seite, pruefe, st);
  await aufFassung(seite, pruefe);
  return st;
}

/** Prüft Änderungsdatei und Rücklauf (Ausgabe von editorrueck) auf die Pinselfelder des Diners. */
function ruecklauf(ausgabe, daten, dinerdatei, pruefe) {
  pruefe(/Kollision: Pinsel sperrt .*Raster/.test(ausgabe), "Bericht nennt gemalte Sperren");
  pruefe(
    /Kollision: Pinsel gibt frei unter .*\(sperrte dort\)/.test(ausgabe),
    "Bericht nennt die Freigabe mit dem Bild darunter",
  );
  pruefe(/Grund der Freigaben: Geheimgang zum Test/.test(ausgabe), "Bericht nennt den Grund");
  const diner = daten.szenen.find((s) => s.datei === h.KARTE).nachher;
  pruefe(
    diner.sperren?.length === 6 && diner.freigeben?.length === 2,
    "Datei trägt die Pinselfelder",
  );
  const pinselpruefung = execFileSync("python3", ["-c", DINERPRUEFUNG, dinerdatei], {
    cwd: h.HAUPT,
    encoding: "utf8",
  }).trim();
  pruefe(
    pinselpruefung === "[] ['freigeben', 'sperren'] 6 Geheimgang zum Test",
    `Diner-Kopie: Pinsel ohne Befund, in der Tiled-Karte (${pinselpruefung})`,
  );
}

module.exports = { kollisionspinsel, ruecklauf };

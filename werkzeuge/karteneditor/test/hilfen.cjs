/*
 * Hilfen des Oberflächentests (editor.test.cjs): Chromium finden, Paket bauen, Bildschirmpunkt
 * eines Objekts, Ziehen mit der Maus, Bildschirmfotos und kleine Abfragen des Editorzustands.
 */
"use strict";
const { execFileSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const HAUPT = path.resolve(__dirname, "../../..");
const KARTE = "maple-falls-diner.json";
const FASSUNG = "maple-falls-diner-tischset.json";
// Für den selbst gebauten Treppenabgang (kollision.cjs); geändert wird nur die Kopie im Testordner.
const DACHBODEN = "maple-falls-dachboden.json";
// Eine Variante (szenen/varianten/): eigene Gruppe in der Kartenliste (figuren.cjs).
const VARIANTE = "maple-falls-dachboden-b.json";

function chromiumPfad() {
  if (process.env.CHROMIUM_PFAD) return process.env.CHROMIUM_PFAD;
  const basis = "/opt/pw-browsers";
  for (const ordner of fs.readdirSync(basis).filter((d) => /^chromium-\d+$/.test(d))) {
    for (const unter of ["chrome-linux64", "chrome-linux"]) {
      const datei = path.join(basis, ordner, unter, "chrome");
      if (fs.existsSync(datei)) return datei;
    }
  }
  throw new Error("Kein Chromium gefunden (CHROMIUM_PFAD setzen)");
}

function bauePaket(arbeit) {
  if (process.env.PAKET) return process.env.PAKET;
  const privat = process.env.PRIVAT || path.resolve(HAUPT, "../schach-abenteuer-inhalte");
  const ziel = path.join(arbeit, "paket");
  const nur = [KARTE, FASSUNG, DACHBODEN, VARIANTE].map((d) => d.replace(".json", ""));
  execFileSync("python3", ["-m", "pipeline.abenteuer.editorpaket", privat, ziel, "--nur", ...nur], {
    cwd: HAUPT,
    stdio: "inherit",
  });
  return ziel;
}

/** Bildschirmpunkt, an dem das Objekt (uid) zuoberst liegt; null, wenn es keinen gibt. */
async function punkt(seite, uid) {
  return seite.evaluate((uid) => {
    const s = [...KE.platziere(KE.szene()), ...KE.markierungen(KE.szene())].find(
      (x) => x.uid === uid,
    );
    const r = document.getElementById("leinwand").getBoundingClientRect();
    const a = KE.zustand.ansicht;
    // Punkte, an denen nur dieses Bild liegt (auch ringsum), davon der mittlere.
    const allein = (x, y) =>
      [
        [0, 0],
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1],
      ].every(([dx, dy]) => {
        const t = KE.trefferAn(x + dx, y + dy);
        return t.length === 1 && t[0].uid === uid;
      });
    const gute = [];
    for (let y = s.y + 1; y < s.y + s.h; y += 2)
      for (let x = s.x + 1; x < s.x + s.b; x += 2) if (allein(x, y)) gute.push([x, y]);
    if (!gute.length) return null;
    const [x, y] = gute[Math.floor(gute.length / 2)];
    return {
      x: Math.round(r.left + (x - a.x) * a.zoom),
      y: Math.round(r.top + (y - a.y) * a.zoom),
    };
  }, uid);
}

/** Erstes Objekt der aktuellen Karte, das allein und gut anklickbar liegt (kein „auf“). */
async function freiesObjekt(seite, ausser = []) {
  const uids = await seite.evaluate(
    (ausser) =>
      KE.platziere(KE.szene())
        .filter(
          (s) =>
            s.eintrag.auf === undefined &&
            !s.eintrag.an_wand &&
            !ausser.includes(s.uid) &&
            s.b >= 16,
        )
        .map((s) => s.uid),
    ausser,
  );
  for (const uid of uids) {
    const p = await punkt(seite, uid);
    if (p) return { uid, p };
  }
  throw new Error("Kein freies Objekt gefunden");
}

const eintrag = (seite, uid) => seite.evaluate((uid) => KE.kopie(KE.finde(uid).eintrag), uid);
const zahl = (seite) => seite.evaluate(() => KE.szene().objekte.length);
const auswahl = (seite) => seite.evaluate(() => [...KE.zustand.auswahl]);

async function ziehe(seite, von, dx, dy, alt = false) {
  await seite.mouse.move(von.x, von.y);
  await seite.mouse.down();
  if (alt) await seite.keyboard.down("Alt");
  await seite.mouse.move(von.x + dx / 2, von.y + dy / 2, { steps: 4 });
  await seite.mouse.move(von.x + dx, von.y + dy, { steps: 4 });
  await seite.mouse.up();
  if (alt) await seite.keyboard.up("Alt");
}

async function foto(seite, name) {
  if (!process.env.BILDER) return;
  fs.mkdirSync(process.env.BILDER, { recursive: true });
  await seite.screenshot({ path: path.join(process.env.BILDER, name + ".png") });
}

module.exports = {
  HAUPT,
  KARTE,
  FASSUNG,
  DACHBODEN,
  VARIANTE,
  chromiumPfad,
  bauePaket,
  punkt,
  freiesObjekt,
  eintrag,
  zahl,
  auswahl,
  ziehe,
  foto,
};

/*
 * Oberflächentest des Karteneditors mit Playwright in Chromium über file:// (kein Server).
 *
 * Warum: Der Editor läuft beim Autor per Doppelklick; genau so wird er hier geprüft. Der Test baut
 * ein kleines Paket (zwei Karten des Diners mit Zustandsfassung) mit dem privaten Repository,
 * bedient den Editor wie der Autor (Ziehen, Alt-Ziehen, Drehen, Strg+Klick-Mehrfachauswahl,
 * Duplizieren als Gruppe, Löschen, Ebene, Bibliothek, Auswahlliste, Rückgängig, Übertragen auf die
 * Fassung, Neuladen; Figuren und Varianten in figuren.cjs, Kollisionspinsel in pinsel.cjs) und
 * schickt die heruntergeladene Datei durch den Rücklauf.
 *
 * Aufruf (Hauptordner): node werkzeuge/karteneditor/test/editor.test.cjs
 * Umgebung: PRIVAT (Vorgabe ../schach-abenteuer-inhalte), CHROMIUM_PFAD (sonst aus /opt/pw-browsers),
 * BILDER (Ordner für Bildschirmfotos, optional), PAKET (fertiges Paket statt neu bauen).
 * Playwright muss auffindbar sein (global: NODE_PATH=$(npm root -g)).
 */
"use strict";
const { chromium } = require("playwright");
const { execFileSync } = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");
const h = require("./hilfen.cjs");
const {
  HAUPT,
  KARTE,
  FASSUNG,
  DACHBODEN,
  punkt,
  freiesObjekt,
  eintrag,
  zahl,
  auswahl,
  ziehe,
  foto,
} = h;
const kollision = require("./kollision.cjs");
const figuren = require("./figuren.cjs");
const kollisionspinsel = require("./pinsel.cjs");

const K = 16;
let fehler = 0;

function pruefe(bedingung, text) {
  console.log(`${bedingung ? "ok  " : "FEHLER"} ${text}`);
  if (!bedingung) fehler++;
}

async function einzeln(seite) {
  const { uid, p } = await freiesObjekt(seite);
  await seite.mouse.click(p.x, p.y);
  pruefe((await auswahl(seite)).join() === uid, "Klick wählt ein Objekt");
  const vorher = await eintrag(seite, uid);
  const zoom = await seite.evaluate(() => KE.zustand.ansicht.zoom);
  await ziehe(seite, p, 2 * K * zoom, K * zoom);
  const nachher = await eintrag(seite, uid);
  pruefe(
    nachher.feld[0] === vorher.feld[0] + 2 && nachher.feld[1] === vorher.feld[1] + 1,
    "Ziehen rastet auf Kacheln ein",
  );
  await ziehe(seite, await punkt(seite, uid), 5 * zoom, 0, true);
  const fein = await eintrag(seite, uid);
  pruefe(
    (fein.versatz || [0, 0])[0] === (vorher.versatz || [0, 0])[0] + 5,
    "Alt+Ziehen speichert den Versatz",
  );
  await seite.keyboard.press("ArrowRight");
  pruefe(
    ((await eintrag(seite, uid)).versatz || [0])[0] === fein.versatz[0] + 1,
    "Pfeiltaste schiebt 1 Pixel",
  );
  await seite.click("#eigenschaften button.drehen");
  pruefe((await eintrag(seite, uid)).drehung === 90, "Drehen-Knopf dreht um 90 Grad");
  await seite.click("#eigenschaften button.spiegeln");
  pruefe((await eintrag(seite, uid)).spiegeln === true, "Spiegeln");
  await seite.fill("#massstab", "150");
  await seite.press("#massstab", "Enter");
  pruefe((await eintrag(seite, uid)).massstab === 1.5, "Maßstab 150 %");
  await foto(seite, "02-gedreht");
  const anzahl = await zahl(seite);
  await seite.keyboard.press("Control+d");
  pruefe((await zahl(seite)) === anzahl + 1, "Strg+D dupliziert");
  await seite.keyboard.press("Delete");
  pruefe((await zahl(seite)) === anzahl, "Entf löscht die Kopie");
  await seite.mouse.click((await punkt(seite, uid)).x, (await punkt(seite, uid)).y);
  await seite.click("#eigenschaften button.vorn");
  const ebene = (await eintrag(seite, uid)).ebene || 0;
  pruefe(ebene > 0, `Nach vorn setzt eine Ebene (${ebene})`);
  pruefe((await seite.textContent(".ebenenanzeige")).includes("Ebene +"), "Ebene wird angezeigt");
  await seite.keyboard.press("Control+z");
  pruefe(((await eintrag(seite, uid)).ebene || 0) === 0, "Strg+Z macht die Ebene rückgängig");
  await seite.keyboard.press("Control+y");
  pruefe((await eintrag(seite, uid)).ebene === ebene, "Strg+Y wiederholt");
  return uid;
}

async function mehrfach(seite, schonBenutzt) {
  const a = await freiesObjekt(seite, [schonBenutzt]);
  const b = await freiesObjekt(seite, [schonBenutzt, a.uid]);
  await seite.keyboard.press("Escape");
  await seite.mouse.click(a.p.x, a.p.y);
  await seite.keyboard.down("Control");
  await seite.mouse.click(b.p.x, b.p.y);
  await seite.keyboard.up("Control");
  pruefe(
    (await auswahl(seite)).sort().join() === [a.uid, b.uid].sort().join(),
    "Strg+Klick nimmt hinzu",
  );
  const va = await eintrag(seite, a.uid);
  const vb = await eintrag(seite, b.uid);
  await seite.keyboard.press("Shift+ArrowDown");
  const na = await eintrag(seite, a.uid);
  const nb = await eintrag(seite, b.uid);
  pruefe(
    na.feld[1] === va.feld[1] + 1 && nb.feld[1] === vb.feld[1] + 1,
    "Umschalt+Pfeil schiebt beide um eine Kachel",
  );
  await seite.keyboard.press("r");
  pruefe(
    (await eintrag(seite, a.uid)).drehung === 90 && (await eintrag(seite, b.uid)).drehung === 90,
    "R dreht die ganze Auswahl",
  );
  await seite.keyboard.press("PageUp");
  pruefe(((await eintrag(seite, a.uid)).ebene || 0) !== 0, "Bild auf ändert die Ebene der Auswahl");
  const anzahl = await zahl(seite);
  await seite.keyboard.press("Control+d");
  const kopien = await auswahl(seite);
  pruefe(
    (await zahl(seite)) === anzahl + 2 && kopien.length === 2 && !kopien.includes(a.uid),
    "Gruppe dupliziert, Kopien ausgewählt",
  );
  const [ka, kb] = await Promise.all(kopien.map((u) => eintrag(seite, u)));
  const abstand = (x, y) => [x.feld[0] - y.feld[0], x.feld[1] - y.feld[1]].join();
  pruefe(
    abstand(ka, kb) === abstand(na, nb) || abstand(kb, ka) === abstand(na, nb),
    "Kopien behalten ihre Abstände",
  );
  await seite.keyboard.press("Delete");
  pruefe((await zahl(seite)) === anzahl, "Löschen wirkt auf die ganze Auswahl");
}

async function rechteck(seite) {
  await seite.keyboard.press("Escape");
  const r = await seite.evaluate(() =>
    document.getElementById("leinwand").getBoundingClientRect().toJSON(),
  );
  await seite.mouse.move(r.left + 5, r.top + 5);
  await seite.mouse.down();
  await seite.mouse.move(r.left + r.width / 2, r.top + r.height / 2, { steps: 5 });
  await seite.mouse.up();
  const zahlAuswahl = (await auswahl(seite)).length;
  pruefe(zahlAuswahl > 1, `Rechteckauswahl wählt mehrere (${zahlAuswahl})`);
  await foto(seite, "03-rechteck");
  await seite.keyboard.press("Escape");
}

async function ueberlagerung(seite) {
  // Ein Gegenstand auf einem Möbel: an seiner Stelle liegen zwei Bilder übereinander.
  const ziel = await seite.evaluate(() => {
    const r = document.getElementById("leinwand").getBoundingClientRect();
    const a = KE.zustand.ansicht;
    for (const s of KE.platziere(KE.szene()).filter((x) => x.eintrag.auf !== undefined))
      for (let y = s.y; y < s.y + s.h; y++)
        for (let x = s.x; x < s.x + s.b; x++)
          if (KE.trefferAn(x, y).length > 1)
            return { x: r.left + (x - a.x) * a.zoom + 1, y: r.top + (y - a.y) * a.zoom + 1 };
    return null;
  });
  pruefe(!!ziel, "Stelle mit übereinanderliegenden Bildern gefunden");
  if (!ziel) return;
  await seite.mouse.click(ziel.x, ziel.y);
  const zeilen = await seite.locator("#trefferliste .trefferzeile").count();
  pruefe(
    zeilen >= 2 && (await seite.isVisible("#trefferliste")),
    `Auswahlliste zeigt ${zeilen} Bilder`,
  );
  await foto(seite, "04-auswahlliste");
  const erste = (await auswahl(seite))[0];
  await seite.locator("#trefferliste .trefferzeile").nth(1).click();
  pruefe((await auswahl(seite))[0] !== erste, "Auswahlliste wählt das Bild darunter");
}

async function bibliothek(seite) {
  await seite.fill("#bibsuche", "sofa");
  const anzahl = await zahl(seite);
  await seite.locator("#bibliothek .bibeintrag").first().click();
  pruefe((await zahl(seite)) === anzahl + 1, "Klick in der Bibliothek fügt hinzu");
  const r = await seite.evaluate(() =>
    document.getElementById("leinwand").getBoundingClientRect().toJSON(),
  );
  await seite
    .locator("#bibliothek .bibeintrag")
    .nth(1)
    .dragTo(seite.locator("#leinwand"), {
      targetPosition: { x: r.width / 3, y: r.height / 3 },
    });
  pruefe((await zahl(seite)) === anzahl + 2, "Ziehen aus der Bibliothek fügt hinzu");
  await seite.fill("#bibsuche", "");
  pruefe(
    (await seite.locator(".zuletzt .bibeintrag").count()) >= 1,
    "Zuletzt benutzt wird gezeigt",
  );
}

async function fassung(seite, uid) {
  await seite.mouse.click((await punkt(seite, uid)).x, (await punkt(seite, uid)).y);
  pruefe(await seite.isVisible(".fassungshinweis"), "Hinweis auf die Zustandsfassung");
  await seite.click(".fassungshinweis button");
  const uebertragen = await seite.evaluate(
    ([uid, f]) => {
      const hier = KE.finde(uid).eintrag;
      return KE.szene(f).objekte.some(
        (o) =>
          o.drehung === hier.drehung &&
          JSON.stringify(o.feld) === JSON.stringify(hier.feld) &&
          o.moebel === hier.moebel,
      );
    },
    [uid, FASSUNG],
  );
  pruefe(uebertragen, "Verschiebung auf die Fassung übertragen");
}

async function pinsel(seite) {
  await seite.keyboard.press("Escape");
  await seite.click("[data-schalter=pinsel]");
  await seite.selectOption("#pinselzeichen", "~");
  const ziel = await seite.evaluate(() => {
    const r = document.getElementById("leinwand").getBoundingClientRect();
    const a = KE.zustand.ansicht;
    const zeilen = KE.szene().raster;
    const y = Math.floor(zeilen.length / 2);
    const x = zeilen[y].indexOf(".");
    return {
      x: r.left + (x * 16 + 8 - a.x) * a.zoom,
      y: r.top + (y * 16 + 8 - a.y) * a.zoom,
      fx: x,
      fy: y,
    };
  });
  await seite.mouse.click(ziel.x, ziel.y);
  const zeichen = await seite.evaluate(([x, y]) => KE.szene().raster[y][x], [ziel.fx, ziel.fy]);
  pruefe(zeichen === "~", "Pinsel malt Wasser ins Raster");
  await foto(seite, "09-pinsel");
  await seite.keyboard.press("Control+z");
  await seite.click("[data-schalter=pinsel]");
}

async function schalter(seite) {
  for (const name of ["raster", "kollision"]) await seite.click(`[data-schalter=${name}]`);
  await foto(seite, "05-raster-kollision");
  for (const name of ["raster", "kollision", "nurUmgebung"])
    await seite.click(`[data-schalter=${name}]`);
  await foto(seite, "06-nur-umgebung");
  await seite.click("[data-schalter=nurUmgebung]");
  await seite.click("[data-schalter=vorher]");
  await foto(seite, "07-vorher");
  await seite.click("[data-schalter=vorher]");
  await seite.keyboard.press("?");
  pruefe(await seite.isVisible("#hilfe"), "Hilfe mit ?");
  await foto(seite, "08-hilfe");
  await seite.keyboard.press("Escape");
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
t = [s["tiefe"] for s in gesetzt if s["name"] == "mf4TreppeAb"][0]
d = [s["tiefe"] for s in gesetzt if s["name"] == "bkDielen"][0]
print(t, d, pruefe_loecher(szene, gesetzt, moebel), kollisionsbefunde(szene, moebel))
`;

async function ruecklauf(seite, arbeit) {
  const [laden] = await Promise.all([
    seite.waitForEvent("download"),
    seite.click("#herunterladen"),
  ]);
  const datei = path.join(arbeit, "aenderungen.json");
  await laden.saveAs(datei);
  const daten = JSON.parse(fs.readFileSync(datei, "utf8"));
  pruefe(daten.szenen.length === 3 && daten.editor_version, "Änderungsdatei mit allen drei Karten");
  const szenen = path.join(arbeit, "szenen");
  fs.mkdirSync(szenen, { recursive: true });
  // Kopien der echten Szenen im Testordner: Der Rücklauf schreibt nur dorthin (--ohne-bau).
  for (const d of [KARTE, FASSUNG, DACHBODEN])
    fs.copyFileSync(path.join(HAUPT, "inhalte/abenteuer/szenen", d), path.join(szenen, d));
  const bericht = path.join(arbeit, "bericht");
  const ausgabe = execFileSync(
    "python3",
    [
      ...["-m", "pipeline.abenteuer.editorrueck", datei, "--szenen", szenen],
      ...["--bericht", bericht, "--ohne-bau"],
    ],
    { cwd: HAUPT, encoding: "utf8" },
  );
  pruefe(
    /verschoben: /.test(ausgabe) && /gedreht: /.test(ausgabe) && /hinzugefügt: /.test(ausgabe),
    "Rücklauf berichtet",
  );
  pruefe(/Notiz des Autors: Testnotiz/.test(ausgabe), "Notiz kommt in den Bericht");
  pruefe(/Kollision: .*OHNE GRUND/.test(ausgabe), "Bericht nennt Kollision ohne Grund");
  pruefe(/Kollision: mf4TreppeAb .*maske/.test(ausgabe), "Bericht nennt die Treppenmaske");
  pruefe(/hinzugefügt \(ausloeser\): treppe/.test(ausgabe), "Bericht nennt neue Auslöser");
  pruefe(
    /WARNUNG: Figur hector gelöscht: Ink-Knoten maple-falls-diner\.hector/.test(ausgabe),
    "Bericht warnt vor der gelöschten Figur mit Gespräch",
  );
  pruefe(/Kollision an einzelnen Stellen/.test(ausgabe), "Abschnitt für den Katalog");
  kollisionspinsel.ruecklauf(ausgabe, daten, path.join(szenen, KARTE), pruefe); // Kollisionspinsel

  // Die zurückgeschriebene Kopie des Dachbodens: Tiefe, Loch (10.84) und Befunde wie im Kartenbau.
  const pruefung = execFileSync(
    "python3",
    ["-c", DACHBODENPRUEFUNG, path.join(szenen, DACHBODEN)],
    {
      cwd: HAUPT,
      encoding: "utf8",
    },
  );
  pruefe(
    pruefung.trim() === "1 2 [] []",
    `Dachboden-Kopie: Tiefen, 10.84, Befunde (${pruefung.trim()})`,
  );
  console.log(ausgabe.split("\n").slice(0, 60).join("\n"));
}

(async () => {
  const arbeit = fs.mkdtempSync(path.join(os.tmpdir(), "karteneditor-"));
  const paket = h.bauePaket(arbeit);
  const browser = await chromium.launch({ executablePath: h.chromiumPfad() });
  const kontext = await browser.newContext({
    viewport: { width: 1500, height: 900 },
    deviceScaleFactor: 1,
    acceptDownloads: true,
  });
  const seite = await kontext.newPage();
  seite.on("pageerror", (e) => pruefe(false, "Seitenfehler: " + e.message));
  await seite.goto("file://" + path.join(paket, "index.html"));
  await seite.click(`.kartenknopf[data-datei="${KARTE}"]`);
  await seite.waitForFunction(() => KE.bildpixel(0) !== null);
  await seite.waitForTimeout(300);
  await foto(seite, "01-karte");
  const uid = await einzeln(seite);
  await mehrfach(seite, uid);
  await rechteck(seite);
  await ueberlagerung(seite);
  await bibliothek(seite);
  await fassung(seite, uid);
  await seite.fill("#kartennotiz", "Testnotiz");
  await pinsel(seite);
  await schalter(seite);
  await kollision.schalterUndGrund(seite, pruefe);
  await kollision.kachelnBearbeiten(seite, pruefe);
  await kollision.treppenabgang(seite, pruefe);
  await figuren.bodenkachelnTrotzSperre(seite, pruefe);
  await figuren.hindernisse(seite, pruefe);
  await figuren.loeschenUndKopieren(seite, pruefe);
  await figuren.varianten(seite, pruefe);
  await kollisionspinsel.kollisionspinsel(seite, pruefe);
  await seite.reload();
  await seite.waitForFunction(() => KE.zustand.datei);
  pruefe(
    await seite.evaluate((k) => KE.istGeaendert(k), KARTE),
    "Zwischenstand übersteht das Neuladen",
  );
  await ruecklauf(seite, arbeit);
  await browser.close();
  console.log(fehler ? `${fehler} Fehler` : "Alle Prüfungen bestanden");
  process.exit(fehler ? 1 : 0);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});

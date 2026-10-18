// Erzeugt die Porträts der vorgefertigten Gegner (app/public/gegner/<kennung>.svg).
//
// Warum: Wunsch des Autors (18.10.2026): eine Gegnerwahl mit Porträts wie bei chess.com, aus
// freien Bildern in einheitlichem Stil. Die Porträts kommen aus DiceBear, Stil „Personas“
// (Zeichnungen: Draftbit, CC BY 4.0; Code: Florian Körner, MIT; siehe docs/LIZENZEN.md). Jedes
// Porträt entsteht deterministisch aus der Kennung als Startwert; Frisur, Bart und Haarfarbe
// folgen der Tabelle unten, damit Name und Bild zusammenpassen (Oma Gerda hat graues Haar, Finn
// ein Käppi). Einheitlich sind Hintergrund, Rundung und Größe.
//
// Aufruf (im Ordner app/, die Pakete werden nur zum Erzeugen gebraucht, nicht in der App):
//   npm install --no-save @dicebear/core@9 @dicebear/personas@9
//   node skripte/erzeuge-gegnerbilder.mjs          (nur fehlende Porträts, seit 0.2.88)
//   node skripte/erzeuge-gegnerbilder.mjs --alle   (alle neu)
// Nur fehlende, damit eine neuere Fassung von DiceBear die vorhandenen Bilder nicht verändert.
// Die Kennungen müssen zu engine/gegnerliste*.ts passen; der Test engine/gegner.test.ts prüft,
// dass es zu jedem Gegner ein Porträt gibt.
import { createAvatar } from "@dicebear/core";
import * as personas from "@dicebear/personas";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ZIEL = resolve(dirname(fileURLToPath(import.meta.url)), "../public/gegner");
const GROESSE = 128;
const RUNDUNG = 18;
const HINTERGRUND = ["3b4a6b"];
const GRAU = ["dee1f5"];
/** Natürliche Haarfarben (dunkel, braun, rot, blond); Grau nur für die Älteren. */
const NATUERLICH = ["362c47", "6c4545", "f27d65", "f29c65"];
const VOLL = 100;
const HALB = 50;

/** Frisuren je Gruppe (Namen aus dem Stil „Personas“). */
const FRISUREN = {
  maedchen: ["pigtails", "bobBangs", "long", "curlyBun", "bobCut", "straightBun"],
  frau: ["long", "bobCut", "curlyBun", "bobBangs", "straightBun", "extraLong", "curly"],
  aeltereFrau: ["straightBun", "curlyBun", "bobCut"],
  junge: ["cap", "curlyHighTop", "buzzcut", "fade", "shortCombover", "mohawk"],
  mann: ["shortCombover", "buzzcut", "fade", "sideShave", "shortComboverChops", "bunUndercut"],
  aeltererMann: ["bald", "balding", "shortCombover"],
};

/** Gruppe je Gegner: [Frisuren, Bartwahrscheinlichkeit in Prozent, graues Haar]. */
const GRUPPEN = {
  maedchen: [FRISUREN.maedchen, 0, false],
  frau: [FRISUREN.frau, 0, false],
  aeltereFrau: [FRISUREN.aeltereFrau, 0, true],
  junge: [FRISUREN.junge, 0, false],
  mann: [FRISUREN.mann, HALB, false],
  aeltererMann: [FRISUREN.aeltererMann, VOLL, true],
};

/** Alle Gegner mit ihrer Gruppe (Reihenfolge wie engine/gegnerliste*.ts). */
const GEGNER = {
  fritzi: "maedchen",
  willi: "aeltererMann",
  trude: "aeltereFrau",
  bruno: "junge",
  lotta: "maedchen",
  paula: "maedchen",
  max: "junge",
  finn: "junge",
  "oma-gerda": "aeltereFrau",
  leon: "junge",
  mia: "maedchen",
  emil: "junge",
  "opa-hans": "aeltererMann",
  "onkel-rudi": "aeltererMann",
  frieda: "aeltereFrau",
  "herr-lehmann": "mann",
  ayse: "frau",
  pit: "junge",
  sophie: "maedchen",
  karl: "mann",
  selin: "frau",
  nina: "frau",
  jonas: "junge",
  tobias: "mann",
  greta: "frau",
  "herr-nowak": "aeltererMann",
  ida: "maedchen",
  omar: "mann",
  benno: "mann",
  timo: "junge",
  "frau-berger": "aeltereFrau",
  lukas: "mann",
  zoe: "frau",
  "herr-schmitt": "aeltererMann",
  amira: "frau",
  jan: "mann",
  kurt: "aeltererMann",
  "frau-ortega": "aeltereFrau",
  nils: "mann",
  hanna: "frau",
  "herr-weber": "aeltererMann",
  lea: "frau",
  paul: "mann",
  "frau-kaya": "frau",
  lena: "frau",
  viktor: "mann",
  sara: "frau",
  "herr-fischer": "aeltererMann",
  elif: "frau",
  matteo: "mann",
  "frau-lind": "aeltereFrau",
  ben: "mann",
  "doktor-berg": "aeltererMann",
  "trainer-koch": "mann",
  yara: "frau",
  "herr-brandt": "aeltererMann",
  noah: "mann",
  "frau-stein": "frau",
  ravi: "mann",
  "frau-doktor-ahl": "aeltereFrau",
  "gm-gruen": "aeltererMann",
  "im-vogt": "mann",
  "wgm-sato": "frau",
  "fm-ortiz": "mann",
  "gm-petrova": "frau",
  "im-haas": "mann",
  "wim-nkemelu": "frau",
  "gm-lindqvist": "aeltererMann",
};

const ALLE = process.argv.includes("--alle");
mkdirSync(ZIEL, { recursive: true });
let geschrieben = 0;
for (const [kennung, gruppe] of Object.entries(GEGNER)) {
  const datei = join(ZIEL, `${kennung}.svg`);
  if (!ALLE && existsSync(datei)) continue;
  const [hair, facialHairProbability, grau] = GRUPPEN[gruppe];
  const svg = createAvatar(personas, {
    seed: kennung,
    size: GROESSE,
    radius: RUNDUNG,
    backgroundColor: HINTERGRUND,
    hair,
    facialHairProbability,
    hairColor: grau ? GRAU : NATUERLICH,
    eyes: ["open", "glasses", "happy", "wink"],
    mouth: ["smile", "bigSmile", "smirk", "lips"],
  }).toString();
  writeFileSync(datei, svg);
  geschrieben += 1;
}
console.log(`${geschrieben} Porträts nach ${ZIEL}`);

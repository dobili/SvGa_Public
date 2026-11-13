// Erzeugt die Pixel-Porträts der Figuren des Schach-Abenteuers (inhalte/abenteuer/portraets/<name>.svg).
//
// Warum: Frage des Autors (Q17-2, 8.11.2026), ob wir die Porträts selbst erstellen können. Die
// Bilder kommen aus DiceBear, Stil „Pixel Art“ (Gestaltung: DiceBear, CC0 1.0; Code: Florian Körner,
// MIT; Fundstelle node_modules/@dicebear/pixel-art/LICENSE, eingetragen in docs/spiel/LIZENZEN.md).
// Jedes Porträt entsteht deterministisch aus dem Namen als Startwert; Frisur, Haarfarbe, Hautton,
// Kleidung, Brille, Bart und Hut legt die Tabelle unten fest, passend zur Story-Bibel (Abschnitte
// Figuren und Sprechweisen in docs/spiel/05_Story_Bibel.md). Augen und Mund wählt DiceBear aus dem
// Startwert. Vielfalt bei Hauttönen und Alter ist Absicht; graue Haare zeigen das Alter.
//
// Aufruf (im Ordner app/; die Pakete braucht nur dieses Skript, nicht die App):
//   npm install --no-save @dicebear/core@9.4.3 @dicebear/pixel-art@9.4.3
//   node skripte/erzeuge-figurenbilder.mjs          (nur fehlende Porträts)
//   node skripte/erzeuge-figurenbilder.mjs --alle   (alle neu)
// Nur fehlende, damit eine neuere Fassung von DiceBear vorhandene Bilder nicht verändert.
// Der Name ist der Dateiname aus `portraet` in gegner.json (ohne Endung) oder, bei Figuren ohne
// Gegner, aus `sprite` in orte.json; `--pruefen` meldet Figuren ohne Eintrag in der Tabelle.
import { createAvatar } from "@dicebear/core";
import * as pixelArt from "@dicebear/pixel-art";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HIER = dirname(fileURLToPath(import.meta.url));
const INHALTE = resolve(HIER, "../../inhalte/abenteuer");
const ZIEL = join(INHALTE, "portraets");
/** Einheitliche Größe in Pixeln; die Grafik selbst ist ein Raster aus 32 × 32 Punkten. */
const GROESSE = 128;
/** Ohne Hintergrund; die Oberfläche legt ihre Farbe dahinter (wie bei den Gegnerbildern der App). */
const OHNE = 0;
const IMMER = 100;

/** Hauttöne aus der Palette des Stils, von hell nach dunkel. */
const HAUT = {
  h1: "ffdbac",
  h2: "f5cfa0",
  h3: "eac393",
  h4: "e0b687",
  h5: "cb9e6e",
  h6: "b68655",
  h7: "a26d3d",
  h8: "8d5524",
};
/** Haarfarben: natürliche aus der Palette, dazu Grautöne für Ältere (eigene Werte). */
const HAAR = {
  blond: "cab188",
  hellbraun: "a78961",
  braun: "83623b",
  dunkelbraun: "603a14",
  schwarz: "28150a",
  rot: "611c17",
  kupfer: "bd1700",
  grau: "9e9e9e",
  hellgrau: "c8c8c8",
  weiss: "ececec",
  blau: "009bbd",
};

/**
 * Figurentabelle: Name → [Frisur, Haarfarbe, Hautton, Kleidung, Kleidungsfarbe, Brille, Bart, Hut].
 * Leere Zeichenkette heißt: ohne. Kommentar: wer die Figur ist (Story-Bibel).
 */
const FIGUREN = {
  // Hauptfiguren
  ambrose: ["short09", "schwarz", "h2", "variant20", "03396c", "", "variant01", ""], // Geist, starb mit 35, Bart
  "ambrose-jung": ["short09", "schwarz", "h2", "variant20", "428bca", "", "", ""], // Flashbacks 1840/1851
  victor: ["short15", "blond", "h1", "variant12", "03396c", "", "", ""], // 15, gepflegt, Trainingsanzug
  juno: ["long12", "schwarz", "h5", "variant05", "ffc425", "", "", ""], // 14, beste Freundin
  mutter: ["long04", "rot", "h2", "variant08", "88d8b0", "", "", ""], // Mama Laura, Krankenpflegerin
  "graham-hale": ["short03", "hellbraun", "h1", "variant23", "a9a9a9", "light02", "", ""], // Victors Vater
  // Maple Falls
  "coach-delgado": ["short20", "dunkelbraun", "h6", "variant14", "d11141", "", "", ""], // Coach, Sportwörter
  sam: ["short11", "braun", "h3", "variant03", "44c585", "", "", ""], // Clubmitglied
  lily: ["long02", "blond", "h4", "variant01", "ff6f69", "", "", ""], // Nachbarskind, 8
  abernathy: ["short01", "weiss", "h1", "variant21", "5f705c", "light05", "variant06", ""], // Bibliothekar, 80
  // Maple Falls, neu nach dem Roman zu Akt 1 (13.11.2026): Sprecher ohne Gegner und noch ohne Karte
  calloway: ["long16", "weiss", "h2", "variant09", "b5838d", "light01", "", ""], // Nachbarin, über 80
  hector: ["short16", "schwarz", "h6", "variant04", "ececec", "", "variant03", ""], // Diner, Schürze
  carla: ["long12", "schwarz", "h5", "variant07", "3b5998", "", "", ""], // Junos Schwester, 17
  pratt: ["short07", "grau", "h4", "variant11", "5b6770", "", "variant04", ""], // Hausmeister
  "skater-jo": ["long07", "kupfer", "h3", "variant10", "00b159", "", "", "variant03"], // Skaterin, 16
  nia: ["long15", "schwarz", "h8", "variant06", "5bc0de", "", "", ""], // Route 1
  wanderer: ["short05", "grau", "h5", "variant17", "5f705c", "", "variant02", "variant08"], // Route 1
  // Cedar Creek
  okafor: ["long18", "hellgrau", "h8", "variant22", "ffd969", "light03", "", ""], // Clubchefin, Anfang 70
  dex: ["short22", "schwarz", "h8", "variant04", "ff6f69", "", "", ""], // 13, Bastler, Enkel
  mae: ["long09", "blond", "h1", "variant02", "88d8b0", "dark04", "", ""], // 11, Mattbilder
  boateng: ["short02", "grau", "h7", "variant19", "428bca", "", "variant05", ""], // Waschsalon
  rosa: ["long20", "grau", "h4", "variant16", "5bc0de", "", "", "variant07"], // Anglerin
  // Riverton
  slick: ["short18", "schwarz", "h7", "variant11", "ffc425", "", "", "variant02"], // Kurier, Mitte 20
  tamsin: ["long10", "dunkelbraun", "h5", "variant07", "d11141", "", "", ""], // 12, Blitz
  ray: ["short01", "hellgrau", "h6", "variant18", "03396c", "light01", "", "variant05"], // Busfahrer a. D.
  harlan: ["short04", "weiss", "h2", "variant21", "a9a9a9", "light06", "variant07", ""], // Uhrmacher
  pops: ["short01", "grau", "h8", "variant15", "ae0001", "", "variant04", "variant06"], // Zeitungsstand
  patel: ["short05", "schwarz", "h6", "variant12", "2e7d32", "", "variant02", ""], // Kiosk im Park
  albescu: ["long06", "braun", "h3", "variant13", "44c585", "", "", ""], // Fahrradwerkstatt
  nova: ["long14", "blond", "h4", "variant09", "ff6f69", "", "", ""], // 16, Werbegesicht
  schaffner: ["short07", "dunkelbraun", "h4", "variant19", "03396c", "", "variant01", "variant09"], // Route 2
  fenwick: ["long03", "hellgrau", "h2", "variant17", "00b159", "", "", "variant04"], // Wanderin, Route 2
  // Ironwood
  "big-joe": ["short06", "dunkelbraun", "h2", "variant16", "ae0001", "", "variant08", ""], // Kranführer
  hank: ["short13", "braun", "h3", "variant15", "5f705c", "", "variant02", ""], // Schichtarbeiter
  priya: ["long16", "schwarz", "h6", "variant08", "428bca", "light04", "", ""], // Werkstudentin, 19
  gus: ["short02", "grau", "h4", "variant18", "ffd969", "", "variant04", "variant01"], // Rangierer
  edna: ["short14", "weiss", "h1", "variant22", "a04b5d", "light07", "", ""], // Eisenwaren, 70
  teague: ["short01", "weiss", "h3", "variant21", "323232", "light02", "variant06", ""], // Museum, 80
  "oma-ruth": ["short12", "hellgrau", "h2", "variant22", "88d8b0", "light03", "", ""], // Mamas Mutter
  dale: ["short08", "grau", "h3", "variant17", "5f705c", "", "variant03", "variant10"], // Bauer, Route 3
  // Weg 4 und Silicon Bay
  kowalczyk: ["long05", "hellbraun", "h2", "variant14", "2663a3", "", "", "variant01"], // Fernfahrerin
  joggerin: ["long11", "dunkelbraun", "h7", "variant06", "88d8b0", "", "", ""], // Smartwatch
  lin: ["long13", "schwarz", "h3", "variant23", "5bc0de", "dark01", "", ""], // Akademie, Mitte 40
  theo: ["short16", "schwarz", "h3", "variant03", "a9a9a9", "dark03", "", ""], // 14, Daten
  dash: ["short21", "schwarz", "h6", "variant10", "ffc425", "", "", "variant02"], // Lieferrad, 19
  rosie: ["long17", "dunkelbraun", "h5", "variant13", "ff6f69", "", "", "variant06"], // Food-Truck
  empfangsroboter: ["short01", "hellgrau", "h1", "variant23", "a9a9a9", "dark07", "", ""], // Roboter
  // Weg 5 und Port Delacroix
  schiffskoch: ["short10", "schwarz", "h6", "variant19", "ffeead", "", "variant05", "variant07"], // Mr. Ruiz
  guidry: ["short05", "braun", "h3", "variant15", "ffc425", "", "variant01", ""], // Sandsäcke
  odile: ["long19", "grau", "h8", "variant22", "cc6192", "light01", "", ""], // Musiklehrerin
  remy: ["short17", "schwarz", "h7", "variant11", "428bca", "", "", ""], // 16, Trompeter
  lou: ["long08", "braun", "h4", "variant02", "44c585", "", "", ""], // 12, Muscheln
  batiste: ["short02", "hellgrau", "h8", "variant18", "5f705c", "", "variant06", "variant05"], // Boote
  henri: ["short19", "hellbraun", "h3", "variant20", "83623b", "", "variant02", ""], // Klavierbauer
  celeste: ["long21", "blau", "h3", "variant12", "323232", "", "", ""], // 15, Laptopmusik
  arceneaux: ["short12", "weiss", "h7", "variant22", "ffd969", "", "", ""], // Gebäckstand
  // Weg 6 und Desert Springs
  holloway: ["long01", "hellbraun", "h1", "variant17", "d11141", "", "", "variant08"], // Wanderin
  mira: ["long05", "schwarz", "h5", "variant01", "ffd969", "", "", ""], // 10, Wunderkind
  tomas: ["short23", "schwarz", "h5", "variant15", "03396c", "", "", ""], // 17, Mechaniker
  dot: ["short14", "weiss", "h2", "variant22", "cc6192", "light05", "", ""], // Motel, 70
  buck: ["short06", "grau", "h3", "variant18", "ae0001", "", "variant08", "variant10"], // Tankwart
  okoro: ["short01", "weiss", "h8", "variant21", "614f8a", "light04", "variant03", ""], // Antiquariat
  // Akt 4 (Story-Bibel Teil 4, Abschnitt 27; Namen in kebab-case, bei Doppelung mit Nachnamen)
  ward: ["short14", "hellgrau", "h2", "variant22", "614f8a", "light06", "", ""], // Großmeisterin, Mitte 60
  kit: ["long03", "dunkelbraun", "h5", "variant17", "d11141", "", "", "variant08"], // 15, Bergführerkind
  haraldsen: ["short01", "weiss", "h1", "variant19", "03396c", "", "variant06", "variant05"], // Seilbahn
  sol: ["long12", "schwarz", "h6", "variant17", "00b159", "dark02", "", ""], // Bergführerin
  darlene: ["long18", "blond", "h3", "variant13", "ff6f69", "", "", ""], // Raststätte Crossroads
  hollis: ["long11", "rot", "h2", "variant16", "5f705c", "", "", "variant07"], // Rangerin
  ezra: ["short18", "dunkelbraun", "h7", "variant10", "ffc425", "", "", ""], // Camp-Betreuer, 20
  pruitt: ["short01", "weiss", "h3", "variant18", "83623b", "", "variant07", "variant10"], // Ghost Town
  bea: ["long09", "blond", "h1", "variant05", "428bca", "light03", "", ""], // Vorrunde, Maes Schwester
  marcus: ["short22", "schwarz", "h8", "variant11", "d11141", "", "", ""], // Vorrunde, Taktiker
  tobias: ["short15", "rot", "h1", "variant12", "ffd969", "dark05", "", ""], // Zeitdruck-Spezialist
  kade: ["short03", "blond", "h2", "variant23", "a9a9a9", "", "", ""], // Konzern-Junior
  turnierleiterin: ["short12", "grau", "h6", "variant23", "323232", "light01", "", ""], // Capital Arena
  earl: ["short06", "grau", "h3", "variant14", "2663a3", "", "variant04", "variant01"], // Fernfahrer, L8
  bell: ["long06", "braun", "h4", "variant16", "5f705c", "", "", "variant07"], // Rangerin am Geysir, L4
  "ray-castillo": ["short10", "schwarz", "h5", "variant15", "88d8b0", "", "variant02", "variant02"], // Sturmjäger, L6
  greta: ["long20", "hellgrau", "h2", "variant17", "a04b5d", "", "", ""], // Hüttenwirtin, L2
  juniper: ["long13", "kupfer", "h3", "variant16", "ff6f69", "", "", ""], // Kletterin, L3
  abe: ["short05", "weiss", "h4", "variant20", "2663a3", "", "variant08", "variant09"], // Leuchtturm, L7
  theron: ["short02", "grau", "h8", "variant18", "ffeead", "", "variant05", "variant03"], // Luftboot, L5
  // Hochebene (L9, Vell-Familien, O5): heutige Kleidung, keine Trachten, kein Schmuck als Zeichen
  annek: ["long04", "dunkelbraun", "h6", "variant21", "5f705c", "light03", "", ""], // Lehrerin
  joss: ["short09", "schwarz", "h6", "variant14", "2663a3", "", "variant03", ""], // Mechaniker
  kira: ["long08", "schwarz", "h7", "variant12", "d11141", "", "", ""], // Schülerin, 13
  blaeser: ["long11", "schwarz", "h7", "variant18", "ffd969", "", "", ""], // Bläserin im Musikhaus, L1
  postreiter: ["short07", "braun", "h3", "variant20", "83623b", "", "variant06", "variant04"], // Erinnerung 1866
  // Erinnerung London 1851
  kellner: ["short03", "dunkelbraun", "h2", "variant20", "323232", "", "variant01", ""],
  zeitungsjunge: ["short24", "rot", "h1", "variant04", "83623b", "", "", "variant09"],
  zeitungsleser: [
    "short04",
    "grau",
    "h3",
    "variant21",
    "2e1e05",
    "light07",
    "variant07",
    "variant04",
  ],
  // Runde 6 (mittel-4): Weg 6 und Sternwarte
  wren: ["short07", "schwarz", "h7", "variant10", "d11141", "", "", ""], // Kletterin unten in der Wand, Weg 6
  ferris: ["long07", "blond", "h2", "variant17", "00b159", "", "", "variant03"], // Sol Ferris, Kletterin oben, Weg 6
  ngata: ["short20", "grau", "h7", "variant21", "03396c", "light03", "", ""], // Dr. Ngata, Sternwarte, Funkschach
  lucia: ["long12", "dunkelbraun", "h4", "variant05", "614f8a", "", "", ""], // Lucía, zeichnet das Sternbild Springer
  // Runde 6 (mittel-4): Weg 7
  mags: ["long11", "rot", "h3", "variant18", "614f8a", "", "", "variant08"], // Kreidespringerin im Hinterzimmer, Kühlwagenfahrerin
  "ruth-keene": ["long01", "hellgrau", "h5", "variant20", "d11141", "", "", "variant04"], // Ruth Keene, Funkname Mama Bear
  "mama-bear": ["long01", "hellgrau", "h5", "variant20", "d11141", "", "", "variant04"], // Mama Bear am Funk (Ruth Keene)
  // Runde 6 (mittel-4): Nebenorte
  walt: ["short05", "grau", "h2", "variant17", "2663a3", "", "variant02", "variant08"], // Walt Miller, Bauer am Kürbishof
  clover: ["long02", "kupfer", "h2", "variant10", "00b159", "", "", ""], // Clover Miller, schneidet den Irrgarten
  "oma-miller": ["long04", "weiss", "h1", "variant08", "d11141", "light03", "", ""], // Oma Miller am Hofladen
  delphine: ["long15", "schwarz", "h7", "variant18", "2663a3", "", "", "variant04"], // Fischerin Delphine, Pelikaninsel
  "old-pete": ["short01", "weiss", "h4", "variant21", "5f705c", "", "variant06", "variant04"], // Netzmacher Old Pete
  coral: ["long08", "dunkelbraun", "h6", "variant05", "ffc425", "", "", ""], // Coral, sammelt Muscheln im Watt
  // Runde 6 (mittel-3): Weg 4, Silicon Bay, Sommerjahrmarkt
  kiki: ["long07", "blau", "h3", "variant05", "44c585", "", "", ""], // Kiki Blitz, 19, Streamerin
  dolores: ["long10", "schwarz", "h6", "variant08", "6a3d9a", "", "", ""], // Schaustellerin, Mantel mit Sternen
  ike: ["short11", "schwarz", "h6", "variant03", "ffc425", "", "", ""], // Dolores' Sohn, im Schachtürken
  faehrmann: ["short01", "grau", "h4", "variant21", "03396c", "", "variant06", ""], // Fährmann der Inselfähre
};

/** Alle Porträtnamen, die die Spieldaten nennen (gegner.json, orte.json). */
function namenAusDaten() {
  const gegner = JSON.parse(readFileSync(join(INHALTE, "gegner.json"), "utf8")).gegner;
  const orte = JSON.parse(readFileSync(join(INHALTE, "orte.json"), "utf8")).orte;
  const name = (pfad) => basename(pfad).replace(/\.[a-z]+$/, "");
  const namen = new Set(gegner.map((g) => name(g.portraet)));
  for (const ort of orte)
    for (const figur of ort.figuren) {
      const profil = gegner.find((g) => g.kennung === figur.gegner);
      namen.add(profil ? name(profil.portraet) : name(figur.sprite));
    }
  return [...namen].sort();
}

/** Ein Porträt als SVG aus einer Zeile der Tabelle. */
function portraet(name, [frisur, haar, haut, kleidung, farbe, brille, bart, hut]) {
  return createAvatar(pixelArt, {
    seed: name,
    size: GROESSE,
    hair: [frisur],
    hairColor: [HAAR[haar]],
    skinColor: [HAUT[haut]],
    clothing: [kleidung],
    clothingColor: [farbe],
    glasses: brille ? [brille] : undefined,
    glassesProbability: brille ? IMMER : OHNE,
    beard: bart ? [bart] : undefined,
    beardProbability: bart ? IMMER : OHNE,
    hat: hut ? [hut] : undefined,
    hatProbability: hut ? IMMER : OHNE,
    accessoriesProbability: OHNE,
  }).toString();
}

const fehlend = namenAusDaten().filter((n) => !FIGUREN[n]);
if (process.argv.includes("--pruefen") || fehlend.length) {
  if (fehlend.length) console.error(`Ohne Eintrag in der Tabelle: ${fehlend.join(", ")}`);
  process.exitCode = fehlend.length ? 1 : 0;
  if (process.argv.includes("--pruefen")) process.exit();
}
mkdirSync(ZIEL, { recursive: true });
const alle = process.argv.includes("--alle");
let neu = 0;
for (const [name, zeile] of Object.entries(FIGUREN)) {
  const datei = join(ZIEL, `${name}.svg`);
  if (!alle && existsSync(datei)) continue;
  writeFileSync(datei, portraet(name, zeile));
  neu++;
}
console.log(
  `Figurenbilder: ${neu} neu, ${Object.keys(FIGUREN).length} in der Tabelle, Ziel ${ZIEL}`,
);

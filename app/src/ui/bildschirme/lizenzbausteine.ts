/**
 * Die Liste aller Bausteine mit eigener Lizenz, die die Lizenzseite zeigt (Lizenzen.tsx).
 *
 * Rolle im Gesamtbild: Die GPL der App verlangt den Hinweis auf Lizenz und Quellcode; die
 * fremden Bausteine verlangen je nach Lizenz Namensnennung (CC BY, CC BY-SA, OFL, LPPL) oder,
 * dass ihr Lizenztext mitkommt (MIT, ISC, BSD, Apache). Name, Lizenz und Herkunft stehen in der
 * Sprachdatei (lizenzen.<kennung>.…), hier nur Kennung, Lizenztext, Adresse der Quelle und die
 * npm-Pakete, die der Eintrag abdeckt. Die Pakete prüft lizenzbausteine.test.ts: Jedes Paket,
 * das in die Auslieferung geht, muss hier stehen (Prüfung der Lizenzen, 1.11.2026).
 * Abhängigkeiten: keine (reine Daten).
 */

/** Öffentlicher Quellcode der App, wie ihn die GPL verlangt; als Link, nicht nur als Text. */
export const QUELLCODE = "https://github.com/dobili/SvGa_Public";

/**
 * Lizenztexte der eingebauten npm-Pakete mit Copyright-Zeilen, erzeugt von Vite beim Build
 * (build.license in vite.config.ts); MIT und ISC verlangen, dass der Text mitkommt.
 */
export const PAKETTEXTE = "/lizenzen/bausteine.txt";

/** Lizenztexte, die erst der Build schreibt oder kopiert (nicht in public/ eingecheckt). */
export const TEXTE_AUS_DEM_BUILD: readonly string[] = [PAKETTEXTE, "/engine/LIZENZ-stockfish.txt"];

/** Ein Eintrag der Lizenzseite. */
export interface Lizenzbaustein {
  readonly kennung: string;
  /** Freischaltbares Extra (Gamifizierung P7): Texte unter „extras.lizenz.“ statt „lizenzen.“. */
  readonly extra?: boolean;
  /** Adresse des Lizenztexts in der App. */
  readonly text?: string;
  /** Adresse der Quelle im Netz. */
  readonly quelle?: string;
  /** npm-Pakete, die dieser Eintrag abdeckt; ein Name mit „/“ am Ende deckt den ganzen Bereich. */
  readonly pakete?: readonly string[];
}

/** Alle Einträge in der Reihenfolge der Lizenzseite. */
export const BAUSTEINE: readonly Lizenzbaustein[] = [
  { kennung: "app", text: "/lizenzen/gpl-3.0.txt", quelle: QUELLCODE },
  { kennung: "buch" },
  { kennung: "stockfish", text: "/engine/LIZENZ-stockfish.txt", pakete: ["stockfish"] },
  { kennung: "maia", text: "/lizenzen/mit-maia2.txt" },
  {
    kennung: "onnxruntime",
    text: "/lizenzen/mit-onnxruntime.txt",
    pakete: ["onnxruntime-web", "onnxruntime-common"],
  },
  {
    kennung: "ortbausteine",
    text: "/lizenzen/onnxruntime-bausteine.txt",
    pakete: ["protobufjs", "@protobufjs/", "long", "flatbuffers", "guid-typescript"],
  },
  { kennung: "ortwasm", text: "/maia/LIZENZEN-onnxruntime-wasm.txt" },
  { kennung: "chessops", text: PAKETTEXTE, pakete: ["chessops"] },
  { kennung: "skaknew", text: "/lizenzen/lppl-1.3c.txt" },
  { kennung: "cburnett", text: "/lizenzen/gpl-3.0.txt" },
  { kennung: "mpchess", text: "/lizenzen/gpl-3.0.txt" },
  { kennung: "chessnut", text: "/lizenzen/apache-2.0-chessnut.txt" },
  { kennung: "celtic", text: "/lizenzen/mit-chess-art.txt" },
  { kennung: "eiche", text: "/lizenzen/mit-chess-art.txt" },
  { kennung: "kiefer" },
  // Figurensatz „Gold“ (Extra P7): Texte unter extras.lizenz.gold.
  { kennung: "gold", extra: true, text: "/lizenzen/gpl-gold-cburnett.txt" },
  {
    kennung: "schriften",
    text: "/lizenzen/ofl-source-sans-3.txt",
    pakete: ["@fontsource/source-sans-3"],
  },
  {
    kennung: "schriftserif",
    text: "/lizenzen/ofl-source-serif-4.txt",
    pakete: ["@fontsource/source-serif-4"],
  },
  { kennung: "holzbilder" },
  { kennung: "materialbretter", text: "/lizenzen/agpl-3.0.txt" },
  {
    kennung: "portraets",
    text: "/lizenzen/cc-by-4.0.txt",
    pakete: ["@dicebear/core", "@dicebear/personas"],
  },
  { kennung: "eroeffnungsnamen" },
  { kennung: "praxisbuch" },
  { kennung: "puzzles" },
  {
    kennung: "zusatzpartien",
    text: "/lizenzen/cc-by-sa-4.0.txt",
    quelle: "https://database.lichess.org/#broadcasts",
  },
  { kennung: "react", text: PAKETTEXTE, pakete: ["react", "react-dom", "scheduler"] },
  {
    kennung: "workbox",
    text: PAKETTEXTE,
    pakete: ["workbox-window", "workbox-core", "workbox-precaching", "workbox-routing"],
  },
  {
    kennung: "bauwerkzeuge",
    text: "/lizenzen/mit-bauwerkzeuge.txt",
    pakete: ["vite", "rolldown", "vite-plugin-pwa"],
  },
  { kennung: "lucide", text: PAKETTEXTE, pakete: ["lucide-react"] },
  { kennung: "idb", text: PAKETTEXTE, pakete: ["idb"] },
  // Schach-Abenteuer (docs/spiel/LIZENZEN.md): Oberwelt und Dialoge, nur im Zusatzpaket.
  { kennung: "phaser", text: PAKETTEXTE, pakete: ["phaser", "eventemitter3"] },
  { kennung: "inkjs", text: PAKETTEXTE, pakete: ["inkjs"] },
  { kennung: "badrap", text: PAKETTEXTE, pakete: ["@badrap/result"] },
];

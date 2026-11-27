/**
 * Anbindung des Texturspeichers (texturspeicher.ts) an Phaser: Texturablage über den
 * Texturspeicher und die Animationen des Spiels, Prüfung vor jedem Laden einer Szene.
 *
 * Rolle im Gesamtbild: Die Szene der Oberwelt (szene.ts) ruft `bindeLader` am Anfang von preload;
 * das Spiel (oberweltspiel.ts) legt je Spiel einen Speicher an und räumt ihn nach jedem Abbau auf.
 * Warum über `keyExists`: Phasers Lader fragt dort für jede Datei, ob ihr Schlüssel schon belegt
 * ist, und überspringt sie dann. Genau an dieser Stelle muss entschieden werden, ob das gemerkte
 * Bild zur neuen Adresse passt; die Stellen, die laden (Möbel, Figuren, Statisten, Tiere), bleiben
 * dabei, wie sie sind.
 * Abhängigkeiten: phaser, texturspeicher.ts.
 */
import Phaser from "phaser";
import { Texturspeicher, type Texturablage } from "./texturspeicher";

/** Phasers eigene Texturen beginnen mit zwei Unterstrichen; sie bleiben immer. */
const EIGENE_PHASER = "__";

/** Die Texturablage eines Spiels: Texturen samt der Animationen, die auf ihnen laufen. */
export function phaserAblage(spiel: Phaser.Game): Texturablage {
  const texturen = spiel.textures;
  return {
    schluessel: () => texturen.getTextureKeys().filter((s) => !s.startsWith(EIGENE_PHASER)),
    vorhanden: (s) => texturen.exists(s),
    kennung: (s) => (texturen.exists(s) ? texturen.get(s) : null),
    pixel: (s) => {
      if (!texturen.exists(s)) return 0;
      return texturen.get(s).source.reduce((n, q) => n + q.width * q.height, 0);
    },
    entferne: (s) => {
      if (!texturen.exists(s)) return;
      // Eine Animation auf einem entfernten Bild zeigte sonst zerstörte Rahmen (figurbilder.ts
      // legt Animationen nur an, wenn es sie noch nicht gibt).
      for (const name of spiel.anims.getAnimsFromTexture(s)) spiel.anims.remove(name);
      texturen.remove(s);
    },
  };
}

/** Je Spiel ein Speicher; das Spiel legt ihn an (oberweltspiel.ts), die Szene findet ihn hier. */
const speicher = new WeakMap<Phaser.Game, Texturspeicher>();

/** Legt den Speicher eines Spiels an (einmal je Spiel). */
export function legeSpeicherAn(spiel: Phaser.Game): Texturspeicher {
  const neu = new Texturspeicher(phaserAblage(spiel));
  speicher.set(spiel, neu);
  return neu;
}

/** Der Speicher eines Spiels, oder null (Szene ohne die Hülle, etwa in Prüfungen). */
export function speicherVon(spiel: Phaser.Game): Texturspeicher | null {
  return speicher.get(spiel) ?? null;
}

/**
 * Schlüssel eines Bildes, das je Karte ein anderes sein kann (Kachelstil, Hintergrund), mit seiner
 * Adresse: So bleiben die Hintergründe mehrerer Karten zugleich im Speicher, statt sich unter
 * einem Schlüssel abzulösen. Beispiel: mitAdresse("hintergrund", "blob:…/7f3a") →
 * "hintergrund:blob:…/7f3a".
 */
export function mitAdresse(art: string, adresse: string): string {
  return `${art}:${adresse}`;
}

/** Adresse samt Rahmengröße einer Datei: Ein Bogen mit anderer Rahmengröße ist ein anderes Bild. */
function signaturVon(datei: Phaser.Loader.File): string {
  const adresse = typeof datei.url === "string" ? datei.url : JSON.stringify(datei.url);
  const rahmen: unknown = datei.config;
  return rahmen && typeof rahmen === "object" ? `${adresse}|${JSON.stringify(rahmen)}` : adresse;
}

/**
 * Am Anfang von preload: Der Lader der Szene fragt den Speicher, bevor er ein Bild lädt, und
 * meldet ihm das Ende des Ladens (vor create, also vor dem Umfärben im Winter). Ohne Speicher
 * (Szene außerhalb der Hülle) bleibt alles wie in Phaser.
 * Beispiel: Kartenwechsel mapleFalls.aussen → mapleFalls.park: der Bogen des Helden und die
 * Bögen der Statisten werden übersprungen, der Hintergrund des Parks geladen.
 */
export function bindeLader(szene: Phaser.Scene): void {
  const s = speicherVon(szene.game);
  if (!s) return;
  const lader = szene.load;
  const echt = lader.keyExists.bind(lader);
  lader.keyExists = (datei: Phaser.Loader.File) => {
    // Nur Bilder (Ablage Texturspeicher); Karten und JSON gehen ihren gewohnten Weg.
    if (datei.cache === szene.textures && s.vorLaden(datei.key, signaturVon(datei))) return true;
    return echt(datei);
  };
  lader.once(Phaser.Loader.Events.COMPLETE, () => s.nachLaden());
}

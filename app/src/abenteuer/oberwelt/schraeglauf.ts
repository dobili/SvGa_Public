/**
 * Schräglaufen an Wänden (Wunsch des Autors, 26.11.2026, diagonales Laufen): Läuft der Held schräg
 * gegen eine Wand, rutscht er an ihr entlang, statt hängen zu bleiben, und findet dabei auch
 * Durchlässe von Körperbreite (12 Pixel, Regel 10.92, pipeline/abenteuer/durchlass.py).
 *
 * Warum eine eigene Regel: Die Physik (Phaser Arcade) hält den Helden an der Wand an und lässt die
 * andere Achse laufen; das ist schon ein Rutschen. Zwei Dinge fehlen ihr aber:
 * - Ein Durchlass, genau so breit wie der Körper, wird beim Vorbeirutschen nie getroffen: Der Held
 *   rückt je Bild um einen Bruchteil eines Pixels weiter, die Lücke passt nur auf ganzen Pixeln. Die
 *   Regel sucht deshalb auf dem Stück, das der Held in diesem Bild rutscht, eine Querlage, in der
 *   die Wand vor ihm frei ist (passtVor, laufhilfe.ts), und setzt ihn dorthin.
 * - Beim Rutschen geht er in voller Geschwindigkeit (wie geradeaus), nicht nur mit dem Anteil der
 *   Schräge; so fühlt sich der Joystick an der Wand nicht zäh an. Schneller als geradeaus wird er nie.
 * Rolle im Gesamtbild: reine Logik für heldlauf.ts (bewegeHeld). Abhängigkeiten: achtrichtung.ts,
 * laufhilfe.ts.
 */
import { bestandteile, type Hauptrichtung, type Schraege } from "./achtrichtung";
import { passtVor } from "./laufhilfe";

/** Ein Punkt in Kartenpixeln (Mitte des Körpers). */
interface Punkt {
  readonly x: number;
  readonly y: number;
}

/** Ergebnis für ein Bild: Geschwindigkeit je Achse und, falls gefunden, eine neue Querlage. */
export interface Schraegschritt {
  readonly vx: number;
  readonly vy: number;
  /** Laufen geradeaus (Rutschen) in dieser Hauptrichtung, sonst null (frei schräg oder Ecke). */
  readonly rutscht: Hauptrichtung | null;
  /** Neue Lage auf der Achse des Rutschens, auf der der Durchlass passt; sonst null. */
  readonly einrasten: { readonly achse: "x" | "y"; readonly wert: number } | null;
}

/** Vorzeichen einer Hauptrichtung auf ihrer Achse. Beispiel: links → −1. */
function vorzeichen(r: Hauptrichtung): number {
  return r === "links" || r === "oben" ? -1 : 1;
}

/**
 * Ganzzahlige Lage auf dem Weg von `von` um `weg` (mit Vorzeichen), an der `passt` gilt; sonst null.
 * Beispiel: von 99,6 um +0,7, passt nur bei 100 → 100.
 */
function lageAufDemWeg(von: number, weg: number, passt: (q: number) => boolean): number | null {
  const anfang = weg >= 0 ? Math.ceil(von) : Math.floor(von);
  const ende = von + weg;
  for (let q = anfang; weg >= 0 ? q <= ende : q >= ende; q += weg >= 0 ? 1 : -1) {
    if (passt(q)) return q;
  }
  return null;
}

/**
 * Ein Bild Schräglaufen.
 * Eingaben: Mitte des Körpers, Schräge, Tempo (Kartenpixel je Sekunde), Weg dieses Bildes in
 * Kartenpixeln, Abfrage „Zelle frei?“ (Zellen von 4 Pixeln, sperrkarte.ts).
 * Ausgabe: beide Achsen frei → schräg mit normierter Geschwindigkeit; eine Achse zu → volles Tempo
 * entlang der freien, auf der gesperrten 0 (sonst liefe er bis zur Wand kurz schneller als
 * geradeaus); beide zu (Ecke) → er steht (die Szene zeigt trotzdem das Laufbild, wie geradeaus
 * vor einer Wand).
 * Beispiel: Wand oben, Held läuft rechtsOben → rutscht nach rechts; 12 Pixel breite Lücke oben bei
 * x = 102, Held bei x = 101,6 mit Weg 0,9 → einrasten x = 102, im nächsten Bild geht es hinein.
 */
export function schraegschritt(
  mitte: Punkt,
  schraege: Schraege,
  tempo: number,
  weg: number,
  frei: (zx: number, zy: number) => boolean,
): Schraegschritt {
  const { waag, senk } = bestandteile(schraege);
  const sx = vorzeichen(waag);
  const sy = vorzeichen(senk);
  const waagFrei = passtVor(mitte, waag, mitte.y, frei);
  const senkFrei = passtVor(mitte, senk, mitte.x, frei);
  if (waagFrei && senkFrei) {
    const anteil = tempo / Math.SQRT2;
    return { vx: sx * anteil, vy: sy * anteil, rutscht: null, einrasten: null };
  }
  if (!waagFrei && !senkFrei) return { vx: 0, vy: 0, rutscht: null, einrasten: null };
  // Eine Achse ist zu: entlang der anderen rutschen und dort einen Durchlass suchen.
  const entlang = waagFrei ? waag : senk;
  const zu = waagFrei ? senk : waag;
  const achse = waagFrei ? "x" : "y";
  const von = mitte[achse];
  const passt = (q: number): boolean => passtVor(mitte, zu, q, frei);
  const wert = lageAufDemWeg(von, vorzeichen(entlang) * weg, passt);
  return {
    vx: waagFrei ? sx * tempo : 0,
    vy: waagFrei ? 0 : sy * tempo,
    rutscht: entlang,
    einrasten: wert === null ? null : { achse, wert },
  };
}

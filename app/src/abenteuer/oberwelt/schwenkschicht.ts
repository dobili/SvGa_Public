/**
 * Anbindung des Kameraschwenks an die Szene (Wunsch des Autors, 26.11.2026, schwenk.ts): löst
 * `#schwenk:ZIEL` gegen die Karte auf (Figuren, Auslöser, Möbel und Gebäude) und lässt die
 * Kameraführung der Szene dorthin fahren, mit dem Dialogfenster als verdecktem Rand.
 *
 * Rolle im Gesamtbild: gerufen von oberwelt/useBuehne.ts mit dem Zugang der Szene
 * (fuehrungsschicht.ts, wie für `#gehe`). Die Szene selbst bleibt unverändert.
 * Ablauf (Wunsch des Autors, 26.11.2026): hinschwenken; erst am Ziel erscheint die Zeile; die
 * Kamera verweilt, bis weitergetippt wird. Ob gerade eine Fahrt läuft, hält schwenkfahrt.ts.
 * Abhängigkeiten: Phaser, fuehrungsschicht.ts (Typ), kamerafuehrung.ts, schwenk.ts,
 * schwenkfahrt.ts.
 */
import Phaser from "phaser";
import type { Fuehrungszugang } from "./fuehrungsschicht";
import { kamerafuehrungVon } from "./kamerafuehrung";
import { HELD, raenderMitDialog, schwenkziel, type Schwenkkarte } from "./schwenk";
import { setzeFahrt } from "./schwenkfahrt";

/** Ergebnis eines Versuchs: Fahrt läuft, Ziel unbekannt, oder die Szene ist noch nicht so weit. */
export type Schwenkversuch = "faehrt" | "unbekannt" | "wartet";

/** Linke obere Ecke des Dialogfensters in Bildschirmpixeln, oder null ohne Fenster. */
export type Dialoglage = { readonly links: number; readonly oben: number } | null;

/** Die Karte, wie der Schwenk sie braucht, aus dem Zugang der Szene. */
function karteVon(z: Fuehrungszugang): Schwenkkarte {
  return {
    kachel: z.kachel,
    ausloeser: z.ausloeser.filter((a) => a.typ === "ausloeser"),
    figur: (name) => {
      const figur = z.szene.children.getByName(name);
      return figur instanceof Phaser.GameObjects.Sprite && figur.visible
        ? { x: figur.x, y: figur.y }
        : null;
    },
    objekte: z.moebel.map((m) => ({
      name: m.name,
      x: m.x,
      y: m.y,
      breite: m.angabe.breite,
      hoehe: m.angabe.hoehe,
    })),
  };
}

/**
 * Fährt die Kamera zu `angabe` (oder zum Helden). Eingaben: Zugang der Szene, Angabe aus dem Tag,
 * Lage des Dialogfensters, sofort (reduzierte Bewegung). Bis zur Ankunft meldet der Speicher
 * „Fahrt läuft“. Ausgabe: „unbekannt“, wenn das Ziel auf dieser Karte fehlt (die Kamera bleibt;
 * das Werkzeug schwenkstellen meldet es), „wartet“, solange die Kamera nicht eingerichtet ist.
 * Beispiel: Ankunft in Cedar Creek, `#schwenk:mf2Bibliothek` → die Bibliothek steht in der Mitte
 * der freien Fläche über dem Dialog.
 */
export function schwenkeKamera(
  z: Fuehrungszugang,
  angabe: string,
  dialog: Dialoglage,
  sofort: boolean,
): Schwenkversuch {
  const fuehrung = kamerafuehrungVon(z.szene);
  const verdeckt = fuehrung?.verdeckt;
  if (!fuehrung || !verdeckt) return "wartet";
  const ziel = schwenkziel(angabe, karteVon(z));
  if (ziel === null) return "unbekannt";
  const kamera = z.szene.cameras.main;
  const bild = { breite: kamera.width, hoehe: kamera.height };
  const raender = raenderMitDialog(verdeckt, dialog, bild, kamera.zoomX || 1);
  setzeFahrt(true, () => fuehrung.ueberspringe());
  const ziehe = ziel === HELD ? null : ziel;
  if (!fuehrung.schwenke(ziehe, raender, sofort, () => setzeFahrt(false))) setzeFahrt(false);
  return "faehrt";
}

/** Zurück zum Helden (Dialogende oder Zeile mit `#gehe`). */
export function schwenkeZurueck(z: Fuehrungszugang, sofort: boolean): void {
  const fuehrung = kamerafuehrungVon(z.szene);
  const verdeckt = fuehrung?.verdeckt;
  if (fuehrung?.schwenkt && verdeckt) fuehrung.schwenke(null, verdeckt, sofort);
}

/** Ein laufender Schwenk springt ans Ziel (Weitertippen zur nächsten Zeile). */
export function schwenkAmZiel(z: Fuehrungszugang): void {
  kamerafuehrungVon(z.szene)?.ueberspringe();
}

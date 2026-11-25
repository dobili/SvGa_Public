/**
 * Ansprechen in der Szene (Regeln in regeln/ansprechen.ts): Findet die Hauptfigur, vor der der Held
 * gerade vorbeigeht, und lässt sie auf ihn zugehen (geführter Weg, fuehrungsschicht.ts), oder,
 * wenn sie sitzt oder der Weg zu lang ist, sich nur zu ihm drehen (zuwendungsschicht.ts). Beide
 * schauen sich danach an. Den Dialog öffnet der Aufrufer (useAnsprechen.ts) über denselben Weg wie
 * der Aktionsknopf (useAusloeser.ts, sprichFigurAn).
 *
 * Nach dem Weg steht die Figur an der neuen Stelle, bis die Karte neu geladen wird; ihr Auslöser
 * rückt mit (rueckeAusloeser), damit der Aktionsknopf sie dort findet. Statisten mit Laufwegen
 * kommen hier nie vor (sie sind keine Figuren der Karte); Story-Figuren mit Tagesablauf schon: Sie
 * stehen auf der Karte dort, wo der Tagesablauf sie hinstellt, und gehen von dort los.
 * Rolle im Gesamtbild: Werkzeug von useAnsprechen.ts. Abhängigkeiten: Phaser, fuehrungsschicht.ts,
 * gefuehrterweg.ts, zuwendungsschicht.ts, regeln/ansprechen.ts, sitzrichtung.ts.
 */
import Phaser from "phaser";
import { ANSPRECHWEG_HOECHSTENS, imKegel, sichtFrei } from "../regeln/ansprechen";
import { fuehre, freiFuer, type Fuehrungszugang } from "./fuehrungsschicht";
import { blickZu, endfelder, wegZu, type Blick, type Feld } from "./gefuehrterweg";
import { LIEGT } from "./sitzrichtung";
import { BLICK, GEFUEHRT, SITZT, wendeZu } from "./zuwendungsschicht";

/** So viele Felder darf die Suche nach dem Weg besuchen (der Held steht höchstens 3 Felder weit). */
const SUCHGRENZE = 256;

/** Die Figur, die den Helden gerade sieht, und wie sie zu ihm kommt. */
export interface Ansprechende {
  readonly name: string;
  /** Abstand nach vorn im Kegel (1 bis 3). */
  readonly abstand: number;
  /** Der Weg auf ein Nachbarfeld des Helden (ohne Startfeld), oder null: nur umdrehen. */
  readonly weg: readonly Feld[] | null;
}

/** Kachel eines Sprites. */
function kachelVon(sprite: Phaser.GameObjects.Sprite, kachel: number): Feld {
  return { x: Math.floor(sprite.x / kachel), y: Math.floor(sprite.y / kachel) };
}

/** Die Figur dieses Namens, wenn sie da ist, steht oder sitzt und keinen Weg geht. */
function bereiteFigur(z: Fuehrungszugang, name: string): Phaser.Physics.Arcade.Sprite | null {
  const figur = z.szene.children.getByName(name);
  if (!(figur instanceof Phaser.Physics.Arcade.Sprite) || !figur.visible) return null;
  if (figur.getData(LIEGT) === true || figur.getData(GEFUEHRT) === true) return null;
  return figur;
}

/**
 * Sieht eine der Figuren `namen` den Helden auf seinem Feld (Kegel, freie Sicht, ein Weg zu Fuß)?
 * Ausgabe: die erste, mit Abstand und Weg, sonst null. Das Feld der Figur ist das ihres Auslösers
 * (Sitzende rücken nur im Bild aufs Möbel).
 * Beispiel: Juno auf (54, 24) mit Blick nach unten, Held kommt auf (54, 26) → Juno, Abstand 2,
 * Weg [(54, 25)].
 * Sonderfall: Eine Sitzende braucht keinen Weg, sie dreht sich nicht und steht nicht auf (weg null).
 */
export function figurVorDemHelden(
  z: Fuehrungszugang,
  namen: readonly string[],
  held: Feld,
): Ansprechende | null {
  for (const name of namen) {
    const figur = bereiteFigur(z, name);
    const ausloeser = z.ausloeser.find((a) => a.name === name && a.typ === "figur");
    if (!figur || !ausloeser) continue;
    const feld = { x: ausloeser.x, y: ausloeser.y };
    const blick = (figur.getData(BLICK) as Blick | undefined) ?? "unten";
    const abstand = imKegel(feld, blick, held);
    if (abstand === null || !sichtFrei(feld, held, z.frei)) continue;
    if (figur.getData(SITZT) === true) return { name, abstand, weg: null };
    const frei = freiFuer(z, figur);
    const weg = wegZu(feld, endfelder(held, true, frei), frei, SUCHGRENZE);
    if (weg === null) continue;
    return { name, abstand, weg: weg.length <= ANSPRECHWEG_HOECHSTENS ? weg : null };
  }
  return null;
}

/** Wie lange das „!“ über der Figur steht, bevor sie losgeht (ms). */
const AUSRUF_MS = 450;
/** So hoch über dem Fuß der Figur steht das „!“ (Kartenpixel, über dem Kopf). */
const AUSRUF_HOEHE = 30;
/** Gestalt des „!“: klein, dunkel umrandet, damit es auf hellem Boden und auf Gras zu sehen ist. */
const AUSRUF_STIL = {
  fontFamily: "monospace",
  fontSize: "12px",
  fontStyle: "bold",
  color: "#ffd84a",
  stroke: "#3a2a10",
  strokeThickness: 3,
};
/** Tiefe des „!“: über allen Figuren und Möbeln. */
const AUSRUF_TIEFE = 1e6;

/** Ein „!“ über der Figur für einen halben Moment (Wunsch des Hauptchats, kein Muss). */
function zeigeAusruf(z: Fuehrungszugang, figur: Phaser.GameObjects.Sprite): Promise<void> {
  const text = z.szene.add
    .text(figur.x, figur.y - AUSRUF_HOEHE, "!", AUSRUF_STIL)
    .setOrigin(0.5, 1)
    .setDepth(AUSRUF_TIEFE);
  return new Promise((fertig) => {
    z.szene.time.delayedCall(AUSRUF_MS, () => {
      text.destroy();
      fertig();
    });
  });
}

/** Der Auslöser der Figur rückt auf ihr neues Feld (der Aktionsknopf findet sie dort). */
function rueckeAusloeser(z: Fuehrungszugang, name: string, feld: Feld): void {
  const i = z.ausloeser.findIndex((a) => a.name === name && a.typ === "figur");
  const alt = z.ausloeser[i];
  if (alt) z.ausloeser[i] = { ...alt, x: feld.x, y: feld.y };
}

/**
 * Die Figur kommt zum Helden: geht ihren Weg (oder dreht sich nur), danach schaut der Held sie an.
 * Ausgabe: erfüllt, wenn beide sich ansehen. Beispiel: Juno geht ein Feld nach unten, schaut nach
 * unten; der Held schaut nach oben.
 */
export async function kommZumHelden(z: Fuehrungszugang, wer: Ansprechende): Promise<void> {
  const figur = bereiteFigur(z, wer.name);
  if (!figur) return;
  // Für die Oberflächentests (wie data-zuwendung in zuwendungsschicht.ts); im Spiel ohne Wirkung.
  z.szene.game.canvas?.setAttribute("data-ansprechen", wer.name);
  await zeigeAusruf(z, figur);
  if (wer.weg && wer.weg.length > 0) {
    await fuehre(z, { wer: wer.name, ziel: { name: "held" } });
    figur.setData(BLICK, blickZu(kachelVon(figur, z.kachel), kachelVon(z.held, z.kachel)));
    rueckeAusloeser(z, wer.name, kachelVon(figur, z.kachel));
  } else {
    wendeZu(z, wer.name);
  }
  const blick = blickZu(kachelVon(z.held, z.kachel), kachelVon(figur, z.kachel));
  if (blick) z.blicke(blick);
}

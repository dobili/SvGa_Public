/**
 * Jede gespielte Karte spricht (docs/spiel/29_Tischgespraech.md, Abschnitt 6): Sprüche mit Held
 * unten und Antwort des Gegners oben, Werkzeug- und Zeitkarten mit einer kurzen Zeile des Helden,
 * Ambroses Karten mit seiner Zeile, beim ersten Spruch dazu Ambroses Erklärung.
 *
 * Rolle im Gesamtbild: Hilfe der Kartenleiste (anbindung/KartenleisteAnzeige.tsx): Sie legt die
 * Zeilen in die Sprechblasen (Tischblase.tsx) und zeigt in der Leiste nur noch, was die Karte
 * herausfand (Fazit eines Werkzeugs, Antwort auf ein Remisangebot). Ohne Sprechblasen (Partie-
 * Bildschirm der App) stehen die Zeilen wie früher mit in der Leiste.
 * Abhängigkeiten: anbindung/tischblasen.ts, anbindung/tischsprecher.ts, anbindung/spruchkarte.ts.
 */
import type { Kartensorte } from "../schnittstelle/karten";
import { tSpiel } from "../texte/texte";
import type { Spruchzeilen } from "./spruchkarte";
import type { Blasenzeile } from "./tischblasen";
import { ambrosezeile, gegnerzeile, heldenzeile, kartenzeile } from "./tischsprecher";

/** Was zur gespielten Karte gehört. */
export interface Kartenlage {
  readonly sorte: Kartensorte;
  /** Kennung der Partie (fester Zufall, eindeutige Schlüssel). */
  readonly partie: string;
  /** Spruch und Antwort, wenn die Karte ein Spruch war. */
  readonly spruch: Spruchzeilen | null;
  /** Porträt und Name des Gegners für die obere Blase. */
  readonly gegner: { readonly sprecher: string | null; readonly name: string };
  readonly ambroseDa: boolean;
  /** Erklärt Ambrose jetzt zum ersten Mal, wo Sprüche hingehören? */
  readonly ersterSpruch: boolean;
}

/** Die Zeilen eines Spruchs: Held, Antwort des Gegners. */
function spruchstimmen(lage: Kartenlage, spruch: Spruchzeilen): Blasenzeile[] {
  const basis = `${lage.partie}:spruch:${lage.sorte.kennung}`;
  const angaben = (teil: string) => ({
    schluessel: `${basis}:${teil}`,
    vorrang: "geschrieben" as const,
    testid: `abenteuer-spruch-${teil}`,
  });
  const zeilen: Blasenzeile[] = [];
  if (spruch.held) zeilen.push(heldenzeile(spruch.held, angaben("held")));
  if (spruch.antwort) {
    zeilen.push(
      gegnerzeile(spruch.antwort, lage.gegner.sprecher, lage.gegner.name, angaben("antwort")),
    );
  }
  return zeilen;
}

/**
 * Die Blasenzeilen einer gespielten Karte, in der Reihenfolge, in der sie gesprochen werden.
 * Beispiel: Großes Maul gegen Jo, erster Spruch → Held (unten), Jo (oben), Ambroses Erklärung
 * (unten, nach dem Held). Abzählen → eine Zeile des Helden. Sonderfall: Ambrose fehlt → seine
 * Zeilen entfallen.
 */
export function stimmenDerKarte(lage: Kartenlage): readonly Blasenzeile[] {
  const zeilen = lage.spruch ? spruchstimmen(lage, lage.spruch) : [];
  if (!lage.spruch) {
    const eigene = kartenzeile(lage.sorte, lage.partie, lage.ambroseDa);
    if (eigene) zeilen.push(eigene);
  }
  if (lage.ersterSpruch && lage.ambroseDa) {
    const text = { text: tSpiel("spruch.ambrose.ersterSpruch"), stimmung: "ernst" };
    zeilen.push(
      ambrosezeile(text, {
        schluessel: `${lage.partie}:spruch:erklaert`,
        vorrang: "geschrieben",
        testid: "abenteuer-spruch-erklaerung",
      }),
    );
  }
  return zeilen;
}

/**
 * Der Satz in der Kartenleiste: was die Karte herausfand; ohne Sprechblasen davor die Zeilen.
 * Beispiel: Waage mit Blasen → „Die Waage neigt sich zu Weiß.“; ohne Ergebnis → der Satz der Karte.
 */
export function meldungstext(
  stimmen: readonly Blasenzeile[],
  ergebnis: readonly string[],
  sorte: Kartensorte,
  mitBlasen: boolean,
): string {
  const befund = ergebnis.length > 0 ? ergebnis : [tSpiel(sorte.spruch)];
  const gesprochen = mitBlasen ? [] : stimmen.map((z) => z.text);
  return [...gesprochen, ...befund].join(" ");
}

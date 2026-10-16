/**
 * Angriffskarte: Für jedes Feld die Angreifer beider Seiten, mit und ohne Batterien.
 *
 * Rolle im Gesamtbild: Baustein „Angriffskarte“ des Stellungsprofils (Konzept 7.2). Sie wird je
 * Stellung einmal angelegt und rechnet jedes Feld erst beim ersten Zugriff; alle Werkzeuge
 * fragen hier statt bei angreifer.ts direkt. Daraus folgen die Grundbegriffe des Buches:
 * angegriffene, ungedeckte und hängende Figuren (Warnsignal W1, Kapitel 4 und 7).
 * Abhängigkeiten: angreifer.ts, stellung.ts, chessops.
 * Buchbezug: Kapitel 1, „Werte von Angreifer und Verteidiger zählen“; Kapitel 4, W1
 * „Ungedeckte Figur“; Pflichtenheft 6.6 (Regel der App zu W1).
 */
import type { Board } from "chessops/board";
import type { Color, Piece, Square } from "chessops/types";
import { angreifer, type Angreifer } from "./angreifer";
import { gegner } from "./stellung";

/** Eine Figur auf einem Feld, wie die Karte sie nennt. */
export interface Figurenstand {
  readonly feld: Square;
  readonly figur: Piece;
}

/** Eine angegriffene Figur mit allen Angreifern und Verteidigern. */
export interface Angegriffene extends Figurenstand {
  readonly angreifer: readonly Angreifer[];
  readonly verteidiger: readonly Angreifer[];
}

/** Anzahl der Felder; ein Eintrag je Feld und Farbe. */
const FELDER = 64;

/**
 * Angriffskarte einer Stellung.
 *
 * Warum eine Klasse: Die Karte merkt sich jedes berechnete Feld. So zahlt die erste Anfrage,
 * jede weitere Anfrage derselben Figur (etwa von einem zweiten Werkzeug) ist frei.
 */
export class Angriffskarte {
  private readonly mitBatterie: (Angreifer[] | undefined)[] = new Array<Angreifer[] | undefined>(
    FELDER * 2,
  );
  private readonly ohneBatterie: (Angreifer[] | undefined)[] = new Array<Angreifer[] | undefined>(
    FELDER * 2,
  );

  constructor(readonly brett: Board) {}

  /**
   * Alle Figuren einer Farbe, die ein Feld angreifen oder decken.
   *
   * Eingaben: Feld, Farbe, ob Batterien mitzählen (Kapitel 1: ja, wie die Dame b6 hinter c5).
   * Ausgabe: Angreifer, dieselbe Liste bei jedem Aufruf.
   * Beispiel: Abb. 1.26, d4, Schwarz → Bauer c5, Springer c6, Dame b6 (hinter c5).
   */
  angreiferVon(feld: Square, farbe: Color, mitBatterie = true): readonly Angreifer[] {
    const speicher = mitBatterie ? this.mitBatterie : this.ohneBatterie;
    const schluessel = feld * 2 + (farbe === "white" ? 0 : 1);
    const bekannt = speicher[schluessel];
    if (bekannt) return bekannt;
    const neu = angreifer(this.brett, feld, farbe, mitBatterie);
    speicher[schluessel] = neu;
    return neu;
  }

  /** Greift die Farbe das Feld an (mindestens ein direkter Angreifer)? */
  greiftAn(feld: Square, farbe: Color): boolean {
    return this.angreiferVon(feld, farbe, false).length > 0;
  }

  /** Die Figuren, die eine Figur auf diesem Feld decken (eigene Farbe, mit Batterien). */
  verteidigerVon(feld: Square): readonly Angreifer[] {
    const figur = this.brett.get(feld);
    return figur ? this.angreiferVon(feld, figur.color, true) : [];
  }

  /** Alle Figuren einer Farbe als Liste, Bauern eingeschlossen. */
  figuren(farbe: Color): Figurenstand[] {
    const liste: Figurenstand[] = [];
    for (const feld of this.brett[farbe]) {
      const figur = this.brett.get(feld);
      if (figur) liste.push({ feld, figur });
    }
    return liste;
  }

  /**
   * Figuren einer Farbe, die der Gegner angreift (direkt, ohne Batterie), mit beiden Listen.
   *
   * Regel: Kapitel 1, Röntgen-Frage 2: „Welche Figuren können auf beiden Seiten geschlagen
   * werden?“ Der König zählt mit (dann steht er im Schach).
   */
  angegriffene(farbe: Color): Angegriffene[] {
    const feind = gegner(farbe);
    return this.figuren(farbe)
      .filter(({ feld }) => this.greiftAn(feld, feind))
      .map((stand) => ({
        ...stand,
        angreifer: this.angreiferVon(stand.feld, feind, true),
        verteidiger: this.angreiferVon(stand.feld, farbe, true),
      }));
  }

  /**
   * Ungedeckte Figuren: Warnsignal W1.
   *
   * Regel: Pflichtenheft 6.6, „W1 Ungedeckte Figur: Jede Figur außer dem König, die keine eigene
   * Figur deckt. Bauern nur, wenn sie angegriffen sind.“
   * Beispiel: Abb. 7.7, der Turm a1 hinter dem König („der ungedeckte Turm a1“).
   */
  ungedeckte(farbe: Color): Figurenstand[] {
    const feind = gegner(farbe);
    return this.figuren(farbe).filter(({ feld, figur }) => {
      if (figur.role === "king") return false;
      if (this.angreiferVon(feld, farbe, true).length > 0) return false;
      return figur.role !== "pawn" || this.greiftAn(feld, feind);
    });
  }

  /**
   * Hängende Figuren: angegriffen und ungedeckt, also beim nächsten Zug umsonst zu schlagen.
   *
   * Regel: Glossar „Hängen“: Eine Figur hängt, wenn sie angegriffen und nicht gedeckt ist.
   * Beispiel: Abb. 1.34: Der Springer g5 steht im Schussfeld der Dame d8, aber der Läufer c1
   * deckt ihn; er ist angegriffen, hängt aber nicht. Abb. 7.7: Der Turm a1 hängt nach 2. Kd2.
   */
  haengende(farbe: Color): Angegriffene[] {
    return this.angegriffene(farbe).filter(
      (figur) => figur.figur.role !== "king" && figur.verteidiger.length === 0,
    );
  }
}

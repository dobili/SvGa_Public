/**
 * Bauernschwächen nach dem Deckungstest: Doppelbauern, rückständige Bauern, Isolani, hängende
 * Bauern, dazu Freibauern.
 *
 * Rolle im Gesamtbild: Zweite Hälfte des Bausteins „Bauernprofil“ (Konzept 7.2), Leitfrage 2
 * des Skelett-Röntgens und Grundlage der Endspielfragen (Kapitel 8).
 * Abhängigkeiten: bauernprofil.ts, chessops.
 * Buchbezug: Kapitel 5, „Leitfrage 2: Bauern“ mit der Tabelle der Bauernschwächen; Glossar
 * (Doppelbauern, Rückständiger Bauer, Isolani, Hängende Bauern, Freibauer, Gedeckter Freibauer).
 */
import type { Board } from "chessops/board";
import type { Color, Square } from "chessops/types";
import { squareFile } from "chessops/util";
import { bauernJeLinie, eigeneReihe, vonBauerGedeckt } from "./bauernprofil";
import { gegner } from "./stellung";

/** Die Reihe aus eigener Sicht, auf der Bauern starten (Doppelschritt erlaubt). */
const STARTREIHE = 1;

/** Ein Freibauer mit der Angabe, ob ein eigener Bauer ihn deckt. */
export interface Freibauer {
  readonly feld: Square;
  readonly gedeckt: boolean;
}

/** Ergebnis des Deckungstests für einen Bauern. */
export interface Deckungstest {
  readonly feld: Square;
  /** Kann ihn ein eigener Bauer decken, jetzt oder nach einem Zug von ihm oder einem Nachbarn? */
  readonly gesund: boolean;
}

/** Die Bauernschwächen einer Farbe. */
export interface Bauernschwaechen {
  readonly farbe: Color;
  readonly deckungstest: readonly Deckungstest[];
  /** Je Linie mit mehr als einem eigenen Bauern alle Bauern dieser Linie. */
  readonly doppelbauern: readonly (readonly Square[])[];
  readonly isolani: readonly Square[];
  readonly rueckstaendige: readonly Square[];
  /** Benachbarte Bauernpaare ohne weitere eigene Bauern auf den Außenlinien. */
  readonly haengende: readonly (readonly [Square, Square])[];
  readonly freibauern: readonly Freibauer[];
}

/** Die Nachbarlinien einer Linie innerhalb des Bretts. */
function nachbarlinien(linie: number): number[] {
  return [linie - 1, linie + 1].filter((n) => n >= 0 && n < 8);
}

/**
 * Deckungstest: Kann ein eigener Bauer diesen Bauern decken, jetzt oder nachdem er selbst oder
 * ein Nachbarbauer einen Zug gemacht hat?
 *
 * Regel: Kapitel 5, „Der Deckungstest“. Beispiel: a7 besteht ihn, weil nach ...a6 der Bauer b7
 * deckt. Ein Nachbar deckt jetzt (eine Reihe hinter dem Bauern, Nachbarlinie), nach seinem Zug
 * (zwei Reihen dahinter, vom Startfeld auch drei) oder nach dem eigenen Zug (gleiche Reihe,
 * vom Startfeld auch eine Reihe weiter vorn).
 */
function bestehtDeckungstest(
  feld: Square,
  jeLinie: readonly (readonly Square[])[],
  farbe: Color,
): boolean {
  const reihe = eigeneReihe(feld, farbe);
  const amStart = reihe === STARTREIHE;
  return nachbarlinien(squareFile(feld)).some((linie) =>
    (jeLinie[linie] ?? []).some((nachbar) => {
      const abstand = reihe - eigeneReihe(nachbar, farbe);
      if (abstand === 1 || abstand === 0 || abstand === 2) return true;
      if (abstand === 3 && eigeneReihe(nachbar, farbe) === STARTREIHE) return true;
      return abstand === -1 && amStart;
    }),
  );
}

/**
 * Rückständiger Bauer: Er hat noch Nachbarn, die aber alle schon vor ihm stehen.
 *
 * Regel: Glossar: „Ein Bauer, der hinter seinen Nachbarbauern zurückgeblieben ist: Sie stehen
 * schon vor ihm und können ihn nicht mehr decken.“ Beide Teile zählen: alle Nachbarn vorn und
 * der Deckungstest fällt durch. Beispiel: Abb. 5.8, der Bauer d6 (Nachbar e5 steht vor ihm, auf
 * der c-Linie steht kein schwarzer Bauer mehr); b7 daneben ist nicht rückständig, denn nach
 * ...b5 deckt ihn a6.
 */
function istRueckstaendig(
  feld: Square,
  jeLinie: readonly (readonly Square[])[],
  farbe: Color,
): boolean {
  const nachbarn = nachbarlinien(squareFile(feld)).flatMap((linie) => jeLinie[linie] ?? []);
  const reihe = eigeneReihe(feld, farbe);
  const alleVorn = nachbarn.length > 0 && nachbarn.every((n) => eigeneReihe(n, farbe) > reihe);
  return alleVorn && !bestehtDeckungstest(feld, jeLinie, farbe);
}

/**
 * Freibauer: Weder auf seiner Linie noch auf den Nachbarlinien steht vor ihm ein gegnerischer
 * Bauer (Glossar). Beispiel: Abb. 5.31, der Freibauer d5.
 */
function istFreibauer(
  feld: Square,
  gegnerische: readonly (readonly Square[])[],
  farbe: Color,
): boolean {
  const reihe = eigeneReihe(feld, farbe);
  const linien = [squareFile(feld), ...nachbarlinien(squareFile(feld))];
  return !linien.some((linie) =>
    (gegnerische[linie] ?? []).some((gegnerBauer) => eigeneReihe(gegnerBauer, farbe) > reihe),
  );
}

/**
 * Hängende Bauern: ein Paar benachbarter Bauern ohne weitere eigene Bauern auf den beiden
 * Außenlinien (Kapitel 5, Abb. 5.22: c5 und d5 ohne b- und e-Bauern).
 * Präzisierung der App: nebeneinander auf derselben Reihe (c6 und d5 in Abb. 6.10 sind eine
 * Kette mit rückständigem c6, kein hängendes Paar), nicht am Brettrand (a2–b2 ist kein
 * hängendes Paar) und beide schon gezogen; „sie stehen zusammen, lassen sich aber schwer
 * verteidigen“ gilt erst vorgerückt.
 */
function haengendeAus(
  jeLinie: readonly (readonly Square[])[],
  farbe: Color,
): (readonly [Square, Square])[] {
  const paare: (readonly [Square, Square])[] = [];
  for (let linie = 1; linie + 2 < 8; linie += 1) {
    const links = jeLinie[linie] ?? [];
    const rechts = jeLinie[linie + 1] ?? [];
    const aussenLeer =
      (jeLinie[linie - 1] ?? []).length === 0 && (jeLinie[linie + 2] ?? []).length === 0;
    const einer = links[0];
    const anderer = rechts[0];
    if (
      links.length === 1 &&
      rechts.length === 1 &&
      aussenLeer &&
      einer !== undefined &&
      anderer !== undefined &&
      eigeneReihe(einer, farbe) > STARTREIHE &&
      eigeneReihe(einer, farbe) === eigeneReihe(anderer, farbe)
    ) {
      paare.push([einer, anderer]);
    }
  }
  return paare;
}

/**
 * Die Bauernschwächen einer Farbe.
 *
 * Eingaben: Brett, Farbe. Ausgabe: siehe Bauernschwaechen.
 * Beispiel: Abb. 5.15 (Berliner Endspiel): Schwarz hat Doppelbauern c7 und c6.
 * Abb. 5.17: Der weiße Bauer d4 ist ein Isolani (keine Nachbarn auf c und e).
 */
export function bauernschwaechen(brett: Board, farbe: Color): Bauernschwaechen {
  const jeLinie = bauernJeLinie(brett, farbe);
  const gegnerische = bauernJeLinie(brett, gegner(farbe));
  const bauern = jeLinie.flat();
  return {
    farbe,
    deckungstest: bauern.map((feld) => ({
      feld,
      gesund: bestehtDeckungstest(feld, jeLinie, farbe),
    })),
    doppelbauern: jeLinie.filter((linie) => linie.length > 1),
    isolani: bauern.filter((feld) =>
      nachbarlinien(squareFile(feld)).every((linie) => (jeLinie[linie] ?? []).length === 0),
    ),
    rueckstaendige: bauern.filter((feld) => istRueckstaendig(feld, jeLinie, farbe)),
    haengende: haengendeAus(jeLinie, farbe),
    freibauern: bauern
      .filter((feld) => istFreibauer(feld, gegnerische, farbe))
      .map((feld) => ({ feld, gedeckt: vonBauerGedeckt(brett, feld, farbe) })),
  };
}

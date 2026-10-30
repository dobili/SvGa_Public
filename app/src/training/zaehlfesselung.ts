/**
 * Fesselungen beim Zählen: Welche Figuren dürfen auf einem Feld gar nicht mitschlagen?
 *
 * Rolle im Gesamtbild: Zähltrainer (Nebenchat, 30.10.2026). Der Autor bekam eine Aufgabe, in der
 * die App mit einem an den König gefesselten Läufer rechnete. Kapitel 1 sagt selbst: „Zähle dabei
 * auch nicht rein mechanisch die Verteidiger und Angreifer: Ein gefesselter … Verteidiger zählt
 * weniger“ (Abb. 1.12, Springer e4). Eine an den König gefesselte Figur darf ihre Linie nicht
 * verlassen; schlagen kann sie nur auf der Linie selbst (etwa die fesselnde Figur).
 * Abhängigkeiten: schach/fesselungen.ts, analyse/stellungsprofil.ts, chessops.
 * Buchbezug: Kapitel 1, Abb. 1.12 und „Zähle dabei auch nicht rein mechanisch“.
 */
import { between } from "chessops/attacks";
import { SquareSet } from "chessops/squareSet";
import type { Square } from "chessops/types";
import type { Stellungsprofil } from "../analyse/stellungsprofil";
import { fesselungslinien } from "../schach/fesselungen";

/**
 * Die Figuren, die auf diesem Feld wegen einer Fesselung an den König nicht schlagen dürfen.
 *
 * Beispiel: Dame e4 fesselt den Läufer e2 an den König e1 → für das Feld f3 ist e2 gesperrt,
 * für das Feld e4 (Schlag auf der Linie) nicht.
 */
export function gesperrteFuer(p: Stellungsprofil, feld: Square): SquareSet {
  let gesperrt = SquareSet.empty();
  for (const linie of fesselungslinien(p.stellung.brett, p.angriffskarte)) {
    if (linie.art !== "direkt" || !linie.absolut) continue;
    const aufDerLinie =
      feld === linie.von.feld || between(linie.hinten.feld, linie.von.feld).has(feld);
    if (!aufDerLinie) gesperrt = gesperrt.with(linie.gefesselt.feld);
  }
  return gesperrt;
}

/** Die gefesselten Figuren, die dieses Feld angreifen oder decken würden, es aber nicht dürfen. */
export function gefesselteAmFeld(p: Stellungsprofil, feld: Square): Square[] {
  const gesperrt = gesperrteFuer(p, feld);
  return [
    ...p.angriffskarte.angreiferVon(feld, "white"),
    ...p.angriffskarte.angreiferVon(feld, "black"),
  ]
    .map((a) => a.feld)
    .filter((f) => gesperrt.has(f));
}

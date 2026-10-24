/**
 * Direkte Links zu den Lichess-Werkzeugen unter den Übungen der Trainingsseiten (R57-Zusatz).
 *
 * Rolle im Gesamtbild: Wunsch des Autors (24.10.2026): Nennt eine Übung ein Werkzeug wie
 * „Aufgabenthemen“ oder „Stellung aufbauen“, soll man es mit einem Tipp öffnen können, statt es
 * in Lichess zu suchen. Der Text der Übung bleibt, wie er im Buch steht (Regel 1); die Links
 * stehen in einer eigenen Zeile darunter. Namen und Adressen stehen in
 * inhalte/de/werkzeuglinks.json (Adressen aus dem Werkzeugkasten in Kapitel 12); die
 * Wartungsprüfung (pipeline/wartung) prüft sie wöchentlich.
 * Abhängigkeiten: uebungsort.ts (Textteile), trainingsseiten.ts (Typen).
 */
import daten from "../../../inhalte/de/werkzeuglinks.json";
import type { Trainingsblock } from "./trainingsseiten";
import { teileVon } from "./uebungsort";

export interface Werkzeuglink {
  readonly namen: readonly string[];
  readonly titel: string;
  readonly adresse: string;
}

export const WERKZEUGLINKS: readonly Werkzeuglink[] = daten.links;

function maskiere(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Die Werkzeuge, die ein Block nennt, in der Reihenfolge der Liste, jedes nur einmal.
 * Beispiel aus Kapitel 1: „Löse unter ‚Aufgabenthemen‘ je zwanzig Aufgaben …“ → Aufgabenthemen.
 * Sonderfall: Ein Werkzeug, das schon als Link im Block steht, kommt nicht noch einmal.
 */
export function werkzeugeDes(block: Trainingsblock): Werkzeuglink[] {
  const teile = teileVon(block);
  const text = teile.map((t) => t.text).join("");
  const schonVerlinkt = new Set(teile.flatMap((t) => (t.art === "link" && t.ziel ? [t.ziel] : [])));
  return WERKZEUGLINKS.filter(
    (w) => !schonVerlinkt.has(w.adresse) && w.namen.some((name) => text.includes(name)),
  );
}

/** Die Zeile „Direkt öffnen: Aufgabenthemen ↗ · Analysebrett ↗“; leer ohne Werkzeug. */
export function werkzeuglinksHtml(block: Trainingsblock): string {
  const werkzeuge = werkzeugeDes(block);
  if (werkzeuge.length === 0) return "";
  const links = werkzeuge
    .map(
      (w) =>
        `<a class="werkzeuglink" href="${maskiere(w.adresse)}" target="_blank" rel="noopener">${maskiere(w.titel)} ↗</a>`,
    )
    .join(" ");
  return `<p class="werkzeuglinks"><span>{{training.werkzeuglinks}}</span> ${links}</p>`;
}

/**
 * Ein Tipp auf die freie Fläche der App (den Hintergrund) schaltet das gewählte Werkzeug ab.
 *
 * Rolle im Gesamtbild: Wunsch des Autors: Wer neben Brett und Kacheln tippt, kehrt zur
 * Ausgangsansicht der Abbildung zurück (Buchmarkierungen). Auf dem Handy füllen Brett, Leisten
 * und Karten fast die ganze Breite, frei bliebe nur ein schmaler Rand („nur ganz am Rand“,
 * Nachtest des Autors). Deshalb zählt alles, was nicht bedient wird: Bildunterschrift,
 * Fundstelle, die Zeile unter dem Brett, Kopfzeile, Abstände und die Fläche neben der App.
 * Ausgenommen bleiben Bedienelemente, Brett, Werkzeug- und Zugleiste, die Reiter eines Bündels,
 * die Karten (dort liest man) und Dialoge. Ein Klick entsteht nur beim Tippen, nicht beim
 * Scrollen; wer am Rechner Text markiert, schaltet nichts ab.
 * Abhängigkeiten: React.
 */
import { useEffect } from "react";

/** Was nie als Hintergrund gilt: Bedienelemente, Brett, Leisten, Karten und Dialoge. */
const KEIN_HINTERGRUND = [
  "button",
  "a",
  "input",
  "select",
  "textarea",
  "label",
  "summary",
  "[role='dialog']",
  "[role='alertdialog']",
  ".karte",
  ".brett",
  ".zugleiste",
  ".werkzeugleiste",
  ".reiterbereich",
  "nav",
].join(", ");

/**
 * Ist das angetippte Element Hintergrund, liegt es also in keinem der Bereiche oben?
 * Beispiel: die Bildunterschrift unter den Karten, der Abstand unter dem Brett → ja; ein Feld des
 * Brettes, eine Karte, ein Knopf → nein.
 */
export function istHintergrund(ziel: EventTarget | null): boolean {
  return ziel instanceof Element && ziel.closest(KEIN_HINTERGRUND) === null;
}

/** Hat der Leser gerade Text markiert (am Rechner mit der Maus)? Dann zählt der Klick nicht. */
function textMarkiert(): boolean {
  const auswahl = window.getSelection();
  return auswahl !== null && !auswahl.isCollapsed;
}

/**
 * Ruft ``abschalten`` bei jedem Tipp auf den Hintergrund auf, solange ``aktiv`` ist.
 *
 * Beispiel: Abb. 1.26, Röntgen gewählt, Tipp in den Abstand unter der Karte → wieder „Zählen“
 * ohne Feld, die Pfeile des Buches sind zurück.
 */
export function useHintergrundTipp(aktiv: boolean, abschalten: () => void): void {
  useEffect(() => {
    if (!aktiv) return undefined;
    const beiKlick = (ereignis: MouseEvent) => {
      if (istHintergrund(ereignis.target) && !textMarkiert()) abschalten();
    };
    document.addEventListener("click", beiKlick);
    return () => document.removeEventListener("click", beiKlick);
  }, [aktiv, abschalten]);
}

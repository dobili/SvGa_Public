/**
 * Münzanzeige oben in der Welt: erscheint nur, wenn sich die Zahl ändert, zählt hoch (Belohnung)
 * oder herunter (Kauf) und blendet danach aus. Im Laden bleibt sie stehen, solange man einkauft.
 *
 * Warum (Wunsch des Autors, 20.11.2026, mit Foto vom Handy): „0 Münzen“ lief oben dauerhaft mit.
 * Wer seine Münzen wissen will, findet sie im Tagebuch (Tagebuch.tsx, oben); hier zeigen sie nur,
 * dass sich etwas getan hat.
 * Zugänglichkeit: Die sichtbare, zählende Zahl ist für Vorleser stumm; eine unsichtbare Zeile mit
 * aria-live nennt nach jeder Änderung einmal die neue Zahl. Bei „Bewegung reduzieren“ springt die
 * Zahl ohne Zählen auf den neuen Wert und erscheint ohne Überblenden (bedienung.css).
 * Rolle im Gesamtbild: Teil der Kopfleiste (Kopfleiste.tsx); Zählrechnung in muenzzaehler.ts.
 * Abhängigkeiten: oberwelt/muenzzaehler.ts, texte/texte.ts.
 */
import { useEffect, useRef, useState } from "react";
import { tSpiel } from "../texte/texte";
import { SICHTBAR_MS, ZAEHLDAUER_MS, zwischenwert } from "./muenzzaehler";

/** Will das Gerät weniger Bewegung (Einstellung „Bewegung reduzieren“)? */
function wenigBewegung(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/**
 * Zählt von der zuletzt gezeigten zur neuen Zahl und meldet, ob die Anzeige gerade sichtbar ist.
 * Ausgabe: gezeigte Zahl, sichtbar, und die Zahl für die Ansage (null bis zur ersten Änderung).
 */
function useZaehlung(muenzen: number): {
  readonly gezeigt: number;
  readonly aktiv: boolean;
  readonly ansage: number | null;
} {
  const [gezeigt, setzeGezeigt] = useState(muenzen);
  const [aktiv, setzeAktiv] = useState(false);
  const [ansage, setzeAnsage] = useState<number | null>(null);
  const vorher = useRef(muenzen);
  useEffect(() => {
    const von = vorher.current;
    vorher.current = muenzen;
    if (von === muenzen) return;
    setzeAktiv(true);
    setzeAnsage(muenzen);
    let rahmen = 0;
    let uhr = 0;
    const fertig = () => {
      setzeGezeigt(muenzen);
      uhr = window.setTimeout(() => setzeAktiv(false), SICHTBAR_MS);
    };
    if (wenigBewegung()) {
      fertig();
    } else {
      const beginn = performance.now();
      const schritt = (jetzt: number) => {
        const anteil = (jetzt - beginn) / ZAEHLDAUER_MS;
        setzeGezeigt(zwischenwert(von, muenzen, anteil));
        if (anteil < 1) rahmen = requestAnimationFrame(schritt);
        else fertig();
      };
      rahmen = requestAnimationFrame(schritt);
    }
    return () => {
      cancelAnimationFrame(rahmen);
      window.clearTimeout(uhr);
    };
  }, [muenzen]);
  return { gezeigt, aktiv, ansage };
}

/**
 * Die Münzanzeige. Eingaben: aktuelle Münzen; `immer` hält sie sichtbar (im Laden).
 * Beispiel: 50 Münzen, Kauf für 20 → erscheint, zählt 50 … 30, steht drei Sekunden, blendet aus.
 */
export function Muenzanzeige({
  muenzen,
  immer,
}: {
  readonly muenzen: number;
  readonly immer: boolean;
}) {
  const { gezeigt, aktiv, ansage } = useZaehlung(muenzen);
  const sichtbar = immer || aktiv;
  return (
    <>
      <span
        className="abenteuer-muenzen"
        data-testid="abenteuer-muenzen"
        data-sichtbar={sichtbar ? "ja" : "nein"}
        aria-hidden="true"
      >
        {tSpiel("laden.muenzenKurz", { anzahl: immer && !aktiv ? muenzen : gezeigt })}
      </span>
      <span className="nur-vorlesen" role="status" data-testid="abenteuer-muenzen-ansage">
        {ansage === null ? "" : tSpiel("laden.muenzenKurz", { anzahl: ansage })}
      </span>
    </>
  );
}

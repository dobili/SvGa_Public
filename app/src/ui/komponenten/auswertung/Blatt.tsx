/**
 * Blatt: ein Fenster, das von unten über die Seite fährt (Entwurf F2, „Teilen“ und „Merken“).
 *
 * Rolle im Gesamtbild: Seit der Auswertung neu (31.10.2026) öffnen „Teilen“ (PGN kopieren oder
 * als Datei sichern, Partieabschluss.tsx) und „Merken“ am Brett (Rueckblickkarte.tsx) ein Blatt,
 * statt die Seite zu verlängern. Barrierefreiheit: Dialog mit Titel, der Fokus springt hinein und
 * beim Schließen zurück, Escape und ein Tipp auf den abgedunkelten Grund schließen, dazu ein
 * sichtbarer Knopf „Schließen“. Gezeigt über ein Portal am Ende der Seite, damit kein Elternteil
 * die feste Lage stört. Klasse `auswertungsblatt` (seit 0.3.43), weil `.blatt` aus spielenneu.css
 * sonst den Innenabstand auf null setzte (Befund der Vorprüfung, 31.10.2026).
 * Die Zurück-Taste des Geräts schließt nur das Blatt (app/blattstapel.ts, Fehlertest f3).
 * Abhängigkeiten: react-dom (Portal), app/blattstapel.ts, i18n, lucide.
 */
import { X } from "lucide-react";
import { useEffect, useId, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useZurueckSchliesst } from "../../../app/blattstapel";
import { t } from "../../../i18n/sprache";

const SYMBOLGROESSE = 20;

/**
 * Das Blatt; sichtbar, solange es gezeigt wird (der Aufrufer entscheidet).
 * Eingaben: Titel, Inhalt, Schließen, Testkennung.
 * Beispiel: <Blatt titel="Teilen" beiSchliessen={zu}>…PGN kopieren…</Blatt>.
 */
export function Blatt({
  titel,
  kinder,
  beiSchliessen,
  testid,
}: {
  titel: string;
  kinder: ReactNode;
  beiSchliessen: () => void;
  testid?: string;
}) {
  const kennung = useId();
  const flaeche = useRef<HTMLDivElement>(null);
  useZurueckSchliesst(true, beiSchliessen);
  useEffect(() => {
    const vorher = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    flaeche.current?.focus();
    const taste = (e: KeyboardEvent) => {
      if (e.key === "Escape") beiSchliessen();
    };
    window.addEventListener("keydown", taste);
    return () => {
      window.removeEventListener("keydown", taste);
      vorher?.focus();
    };
    // Nur beim Öffnen: Ein neuer Rückruf bei jedem Zeichnen darf den Fokus nicht verschieben.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return createPortal(
    <div className="blatt-grund" onClick={beiSchliessen}>
      <div
        className="auswertungsblatt"
        role="dialog"
        aria-modal="true"
        aria-labelledby={kennung}
        data-testid={testid}
        tabIndex={-1}
        ref={flaeche}
        onClick={(e) => e.stopPropagation()}
      >
        <span className="blatt-griff" aria-hidden="true" />
        <div className="blatt-kopf">
          <h2 id={kennung} className="blatt-titel">
            {titel}
          </h2>
          <button
            type="button"
            className="knopf-symbol blatt-zu"
            aria-label={t("melden.schliessen")}
            onClick={beiSchliessen}
          >
            <X size={SYMBOLGROESSE} aria-hidden="true" />
          </button>
        </div>
        {kinder}
      </div>
    </div>,
    document.body,
  );
}

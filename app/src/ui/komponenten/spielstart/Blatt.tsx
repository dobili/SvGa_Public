/**
 * Ein Blatt, das von unten über den Bildschirm fährt (Entwurf J3: „Partie einstellen“).
 *
 * Rolle im Gesamtbild: Einstellungen, die man selten braucht, stehen nicht mehr als langes
 * Formular auf der Seite, sondern hinter „Einstellen ›“ (Wunsch des Autors, 31.10.2026: weniger
 * Formular, weniger Text). Das Blatt ist ein natives modales Dialogfeld: Fokus bleibt darin,
 * Escape und der Knopf „Schließen“ schließen es, ein Tipp auf den dunklen Rand ebenso.
 * Die Zurück-Taste schließt nur das Blatt, auch außerhalb von Android-Chrome (app/blattstapel.ts).
 * Abhängigkeiten: app/blattstapel.ts, i18n, lucide-react, Stil in ui/stil/spielenneu.css.
 */
import { X } from "lucide-react";
import { useEffect, useId, useRef, type ReactNode } from "react";
import { useZurueckSchliesst } from "../../../app/blattstapel";
import { t } from "../../../i18n/sprache";

/** Größe des Schließen-Zeichens (Bildpunkte). */
const ZEICHEN = 22;

/**
 * Das Blatt. `offen` steuert es; `schliessen` meldet jedes Schließen (Knopf, Escape, Rand).
 * Der Inhalt wird nur gezeichnet, solange es offen ist.
 */
export function Blatt({
  titel,
  offen,
  schliessen,
  kinder,
  testid,
}: {
  titel: string;
  offen: boolean;
  schliessen: () => void;
  kinder: ReactNode;
  testid?: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const titelId = useId();
  useZurueckSchliesst(offen, schliessen);
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    // jsdom kennt showModal nicht überall; dann bleibt es beim Attribut „open“.
    if (offen && !dialog.open) {
      if (typeof dialog.showModal === "function") dialog.showModal();
      else dialog.setAttribute("open", "");
    }
    if (!offen && dialog.open) dialog.close();
  }, [offen]);
  return (
    <dialog
      ref={ref}
      className="blatt"
      aria-labelledby={titelId}
      data-testid={testid}
      onClose={schliessen}
      // Ein Tipp auf den dunklen Rand trifft das Dialogfeld selbst, nicht seinen Inhalt.
      onClick={(e) => {
        if (e.target === e.currentTarget) schliessen();
      }}
    >
      {offen && (
        <div className="blatt-inhalt">
          <span className="blatt-griff" aria-hidden="true" />
          <div className="blatt-kopf">
            <h2 id={titelId} className="blatt-titel">
              {titel}
            </h2>
            <button
              type="button"
              className="knopf-flach blatt-zu"
              aria-label={t("spielenneu.blatt.schliessen")}
              onClick={schliessen}
            >
              <X size={ZEICHEN} aria-hidden="true" />
            </button>
          </div>
          {kinder}
        </div>
      )}
    </dialog>
  );
}

/**
 * Auswahl des Zusatzes eines Zugs bei Märchenfiguren (Wunsch von mittel-2, 26.11.2026): Zieht eine
 * Figur von der Grundreihe, darf der Leser eine Figur aus der Tasche auf das freie Feld einsetzen
 * (Falke, Bison, Drache), oder er zieht ohne.
 *
 * Rolle im Gesamtbild: Wie die Umwandlung (Umwandlung.tsx) unter dem Brett, sobald zu einem Von
 * und Nach mehrere legale Züge gehören (schach/weiterspielen.ts, zugzusaetze). Die Zurück-Taste
 * bricht ab. Die Knöpfe nennen die Figur; "" heißt „ohne Einsetzen“.
 * Abhängigkeiten: app/blattstapel.ts, i18n.
 */
import { useEffect, useRef } from "react";
import { useZurueckSchliesst } from "../../../app/blattstapel";
import { t } from "../../../i18n/sprache";

/** Textschlüssel je Zusatz: „ohne“, Figuren der Umwandlung, Märchenfiguren (h, e, d). */
const ZUSATZTEXTE = {
  "": "zugleiste.zusatz.ohne",
  h: "zugleiste.zusatz.h",
  e: "zugleiste.zusatz.e",
  d: "zugleiste.zusatz.d",
  q: "zugleiste.zusatz.q",
  r: "zugleiste.zusatz.r",
  b: "zugleiste.zusatz.b",
  n: "zugleiste.zusatz.n",
  k: "zugleiste.zusatz.k",
} as const;

/** Text eines Zusatzes; ein unbekannter Buchstabe (neue Märchenfigur) erscheint selbst. */
function zusatztext(zusatz: string): string {
  const klein = zusatz.toLowerCase();
  return klein in ZUSATZTEXTE ? t(ZUSATZTEXTE[klein as keyof typeof ZUSATZTEXTE]) : zusatz;
}

export function Zusatzwahl({
  zusaetze,
  beiWahl,
}: {
  zusaetze: readonly string[];
  beiWahl: (zusatz: string | null) => void;
}) {
  useZurueckSchliesst(true, () => beiWahl(null));
  const erste = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    erste.current?.focus();
  }, []);
  return (
    <div
      className="umwandlung"
      role="dialog"
      aria-label={t("zugleiste.zusatz")}
      data-testid="zusatzwahl"
    >
      <span>{t("zugleiste.zusatz")}</span>
      {zusaetze.map((zusatz, i) => (
        <button
          key={zusatz}
          ref={i === 0 ? erste : undefined}
          type="button"
          className="chip"
          data-testid={`zusatz-${zusatz || "ohne"}`}
          onClick={() => beiWahl(zusatz)}
        >
          {zusatztext(zusatz)}
        </button>
      ))}
      <button type="button" className="knopf-link klein" onClick={() => beiWahl(null)}>
        {t("loeschen.nein")}
      </button>
    </div>
  );
}

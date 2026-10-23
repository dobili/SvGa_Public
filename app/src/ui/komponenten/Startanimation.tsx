/**
 * Startanimation beim App-Start: der goldene Springer vom Cover des Buches, kurz und überspringbar.
 *
 * Rolle im Gesamtbild: Wunsch des Autors (R39, 23.10.2026). Über allem liegt kurz eine Fläche in
 * Navy; der Springer (dasselbe Bild wie das App-Symbol, public/symbole/symbol-512.png, also schon
 * im Offline-Speicher) wächst mit goldenem Schein heran, darunter der Titel des Buches; dann
 * blendet alles aus. Ein Tipp irgendwo überspringt sie sofort.
 * Nicht bei jedem Neuladen (Empfehlung nach Regel 9): nur in einer neuen Sitzung des Browsers
 * (die installierte App startet nach dem Schließen neu, ein Neuladen bleibt in der Sitzung) und
 * höchstens einmal je Stunde; bei „Bewegung reduzieren“ des Geräts nie.
 * Abhängigkeiten: app/merker.ts, i18n, ui/stil/brett.css.
 */
import { useEffect, useState } from "react";
import { liesMerker, schreibeMerker } from "../../app/merker";
import { t } from "../../i18n/sprache";

/** Merker auf dem Gerät: Zeitpunkt der letzten Startanimation (ms seit 1970). */
export const MERKER_STARTANIMATION = "startanimation.zuletzt";
/** Schlüssel in der Sitzung des Browsers: In dieser Sitzung lief sie schon. */
const SITZUNG_SCHLUESSEL = "svga.startanimation.sitzung";
/** Frühestens nach dieser Zeit kommt sie wieder (ms). */
const ABSTAND_MS = 60 * 60 * 1000;
/** Gesamtdauer samt Ausblenden (ms), passend zu den Keyframes in brett.css. */
export const STARTANIMATION_MS = 1900;

/** Liest oder setzt den Sitzungsschlüssel; ein gesperrter Speicher zählt als „schon gezeigt“. */
function sitzungKenntSie(): boolean {
  try {
    if (window.sessionStorage.getItem(SITZUNG_SCHLUESSEL)) return true;
    window.sessionStorage.setItem(SITZUNG_SCHLUESSEL, "ja");
    return false;
  } catch (fehler) {
    console.warn("Sitzungsspeicher nicht nutzbar:", fehler);
    return true;
  }
}

/**
 * Soll die Startanimation jetzt laufen? Merkt sich die Antwort „ja“ sofort.
 *
 * Beispiel: App öffnen → ja; neu laden → nein; nach dem Schließen zwei Stunden später → ja.
 * Sonderfall: „Bewegung reduzieren“ → nein, ohne etwas zu merken.
 */
function startanimationFaellig(jetztMs: number): boolean {
  const reduziert =
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduziert || sitzungKenntSie()) return false;
  const zuletzt = Number(liesMerker(MERKER_STARTANIMATION) ?? "0");
  if (Number.isFinite(zuletzt) && jetztMs - zuletzt < ABSTAND_MS) return false;
  schreibeMerker(MERKER_STARTANIMATION, String(jetztMs));
  return true;
}

/** Die Startanimation; nach STARTANIMATION_MS oder einem Tipp ist sie weg. */
export function Startanimation() {
  const [sichtbar, setzeSichtbar] = useState(() => startanimationFaellig(Date.now()));
  useEffect(() => {
    if (!sichtbar) return;
    const zeit = setTimeout(() => setzeSichtbar(false), STARTANIMATION_MS);
    return () => clearTimeout(zeit);
  }, [sichtbar]);
  if (!sichtbar) return null;
  return (
    <button
      type="button"
      className="startanimation"
      data-testid="startanimation"
      aria-label={t("startanimation.ueberspringen")}
      onClick={() => setzeSichtbar(false)}
    >
      <span className="startanimation-schein" aria-hidden="true">
        <img
          className="startanimation-springer"
          src={`${import.meta.env.BASE_URL}symbole/symbol-512.png`}
          alt=""
          width={512}
          height={512}
        />
      </span>
      <span className="startanimation-titel" aria-hidden="true">
        {t("app.titel")}
      </span>
    </button>
  );
}

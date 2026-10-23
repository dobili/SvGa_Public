/**
 * Startanimation beim App-Start: der goldene Springer vom Cover des Buches, kurz und überspringbar.
 *
 * Rolle im Gesamtbild: Wunsch des Autors (R39, 23.10.2026). Über allem liegt kurz eine Fläche in
 * Navy; der Springer (dasselbe Bild wie das App-Symbol, public/symbole/symbol-512.png, also schon
 * im Offline-Speicher) wächst mit goldenem Schein heran, darunter der Titel des Buches; dann
 * blendet alles aus. Ein Tipp irgendwo überspringt sie sofort.
 * Bei jedem Start der App, 2,5 Sekunden lang (Wunsch des Autors, 23.10.2026; vorher 1,9 s und
 * höchstens einmal je Stunde), außer sie ist in den Einstellungen abgeschaltet. Ein Start ist eine
 * neue Sitzung des Browsers (die installierte App startet nach dem Schließen neu); ein Neuladen
 * bleibt in der Sitzung und zeigt sie nicht noch einmal. Bei „Bewegung reduzieren“ des Geräts nie.
 * Abhängigkeiten: app/merker.ts, i18n, ui/stil/brett.css.
 */
import { useEffect, useState } from "react";
import { liesMerker } from "../../app/merker";
import { t } from "../../i18n/sprache";

/** Merker auf dem Gerät: Schalter in den Einstellungen, „aus“ schaltet sie ab (Voreinstellung: an). */
export const MERKER_STARTANIMATION = "startanimation";
/** Schlüssel in der Sitzung des Browsers: In dieser Sitzung lief sie schon. */
const SITZUNG_SCHLUESSEL = "svga.startanimation.sitzung";
/** Gesamtdauer samt Ausblenden (ms), passend zu den Keyframes in brett.css. */
export const STARTANIMATION_MS = 2500;

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
 * Soll die Startanimation jetzt laufen? Merkt sich die Sitzung sofort.
 *
 * Beispiel: App öffnen → ja; neu laden → nein; App schließen und wieder öffnen → ja.
 * Sonderfälle: in den Einstellungen aus oder „Bewegung reduzieren“ → nein.
 */
function startanimationFaellig(): boolean {
  if (liesMerker(MERKER_STARTANIMATION) === "aus") return false;
  const reduziert =
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  return !reduziert && !sitzungKenntSie();
}

/** Die Startanimation; nach STARTANIMATION_MS oder einem Tipp ist sie weg. */
export function Startanimation() {
  const [sichtbar, setzeSichtbar] = useState(startanimationFaellig);
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

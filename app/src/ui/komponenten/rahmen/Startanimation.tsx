/**
 * Startanimation beim App-Start: der goldene Springer vom Cover des Buches, kurz und überspringbar.
 *
 * Rolle im Gesamtbild: Wunsch des Autors (R39, 23.10.2026). Über allem liegt kurz eine Fläche in
 * Navy; der Springer wächst mit goldenem Schein heran, darunter der Titel des Buches; dann
 * blendet alles aus. Das Bild ist ein eigener Ausschnitt des Covers (Wunsch des Autors,
 * 24.10.2026; public/bilder/startspringer.webp, erzeugt von skripte/erzeuge-startbild.mjs):
 * Springer mittig, darunter Brett und Schatten. Es liegt im Offline-Speicher wie alle
 * WebP-Dateien. Ein Tipp irgendwo überspringt die Animation sofort.
 * Bei jedem Start der App, 2,5 Sekunden lang (Wunsch des Autors, 23.10.2026), außer sie ist in
 * den Einstellungen abgeschaltet. Ein Start ist eine neue Sitzung des Browsers (die installierte
 * App startet nach dem Schließen neu); ein Neuladen bleibt in der Sitzung und zeigt sie nicht
 * noch einmal. Bei „Bewegung reduzieren“ des Geräts nie.
 * Auch bei der Rückkehr aus dem Hintergrund (Wunsch des Autors, 24.10.2026): War die App auf
 * einem Gerät mit Touch-Bedienung (Handy, Tablet) mindestens 30 Minuten nicht zu sehen, läuft sie
 * 1,8 Sekunden; am Rechner nicht, weil man dort zwischen Fenstern hin- und herwechselt.
 * Orden und Abzeichen (Wunsch des Autors, 30.10.2026): Springer und Titel bleiben unverändert.
 * Ist seit dem letzten Start ein Stück neu verdient, erscheint es danach unter dem Titel und
 * fliegt zum Reiter „Profil“ (etwa 4,6 s); sonst erscheint leise ein verdientes Stück des Tages
 * (3,5 s). Nur beim App-Start, nicht bei der Rückkehr (ordenkunst/useStartorden.tsx). Bis
 * 0.3.14 standen alle Orden verstreut im Rand.
 * Abhängigkeiten: app/merker.ts, startanimationRegel.ts, ordenkunst/useStartorden.tsx, i18n,
 * ui/stil/brett.css.
 */
import { useEffect, useRef, useState } from "react";
import { liesMerker } from "../../../app/merker";
import { t } from "../../../i18n/sprache";
import { useStartorden } from "../ordenkunst/useStartorden";
import { RUECKKEHR_MS, rueckkehrFaellig } from "./startanimationRegel";

/** Kantenlänge des Startbilds in Bildpunkten (skripte/erzeuge-startbild.mjs). */
const STARTBILD_GROESSE = 840;

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

/** Ist die Animation erlaubt (Einstellung an, keine „Bewegung reduzieren“)? */
function erlaubt(): boolean {
  if (liesMerker(MERKER_STARTANIMATION) === "aus") return false;
  const reduziert =
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  return !reduziert;
}

/**
 * Soll die Startanimation jetzt laufen? Merkt sich die Sitzung sofort.
 *
 * Beispiel: App öffnen → ja; neu laden → nein; App schließen und wieder öffnen → ja.
 * Sonderfälle: in den Einstellungen aus oder „Bewegung reduzieren“ → nein.
 */
function startanimationFaellig(): boolean {
  return erlaubt() && !sitzungKenntSie();
}

/** Geräte mit Touch-Bedienung: dort wird die App beim Wechsel wirklich in den Hintergrund gelegt. */
function touchGeraet(): boolean {
  return typeof window.matchMedia === "function" && window.matchMedia("(pointer: coarse)").matches;
}

type Lauf = "start" | "rueckkehr" | null;

/** Die Startanimation; nach ihrer Dauer oder einem Tipp ist sie weg. */
export function Startanimation() {
  const [lauf, setzeLauf] = useState<Lauf>(() => (startanimationFaellig() ? "start" : null));
  const orden = useStartorden(lauf === "start");
  const dauer = lauf === "rueckkehr" ? RUECKKEHR_MS : (orden.dauerMs ?? STARTANIMATION_MS);
  // Beginn des Laufs: Die Dauer kann sich verlängern, wenn ein Orden dazukommt (nach dem Laden).
  const beginn = useRef(0);
  useEffect(() => {
    if (lauf) beginn.current = Date.now();
  }, [lauf]);
  useEffect(() => {
    if (!lauf) return;
    const rest = Math.max(0, dauer - (Date.now() - beginn.current));
    const zeit = setTimeout(() => setzeLauf(null), rest);
    return () => clearTimeout(zeit);
  }, [lauf, dauer]);
  useEffect(() => {
    let verstecktSeit: number | null = null;
    const beiWechsel = () => {
      if (document.visibilityState === "hidden") {
        verstecktSeit = Date.now();
        return;
      }
      if (rueckkehrFaellig(verstecktSeit, Date.now(), touchGeraet(), erlaubt())) {
        setzeLauf("rueckkehr");
      }
      verstecktSeit = null;
    };
    document.addEventListener("visibilitychange", beiWechsel);
    return () => document.removeEventListener("visibilitychange", beiWechsel);
  }, []);
  if (!lauf) return null;
  return (
    <button
      type="button"
      className={lauf === "rueckkehr" ? "startanimation startanimation-kurz" : "startanimation"}
      data-testid="startanimation"
      aria-label={t("startanimation.ueberspringen")}
      onClick={() => setzeLauf(null)}
      // Nur die Fläche dauert länger; Springer und Titel behalten ihre 2,5 s (--startanimation-dauer).
      style={orden.dauerMs ? { animationDuration: `${orden.dauerMs}ms` } : undefined}
    >
      {orden.inhalt}
      <span className="startanimation-schein" aria-hidden="true">
        <img
          className="startanimation-springer"
          src={`${import.meta.env.BASE_URL}bilder/startspringer.webp`}
          alt=""
          width={STARTBILD_GROESSE}
          height={STARTBILD_GROESSE}
        />
      </span>
      <span className="startanimation-titel" aria-hidden="true">
        {t("app.titel")}
      </span>
    </button>
  );
}

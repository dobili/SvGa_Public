/**
 * Die laufende Tour: abgedunkelter Bildschirm, goldener Rahmen um das Ziel und eine Karte mit
 * Text, „Schritt 3 von 9“, Zurück, Weiter und Kreuz.
 *
 * Rolle im Gesamtbild: Liegt einmal in der Hülle der App (App.tsx) über allen Bildschirmen und
 * zeigt die Tour aus tourStand.ts. Fehlt das Ziel eines Schritts, springt die Tour weiter, statt
 * hängen zu bleiben (Leitlinie R52); Schritte mit `ersatzMitte` stehen dann in der Mitte. Das Ziel
 * wird bei Bedarf in den sichtbaren Bereich gescrollt, bei „Bewegung reduzieren“ ohne Animation.
 * Bedienung: Während der Tour fängt eine Sperre jeden Tipp neben der Karte ab, damit nichts aus
 * Versehen passiert. Tastatur: Tab bleibt in der Karte, Esc beendet, Pfeiltasten blättern. Für
 * Bildschirmleser ist die Karte ein modaler Dialog, der bei jedem Schritt den Fokus bekommt.
 * Abhängigkeiten: touren.ts, tourlogik.ts, tourStand.ts, tourMerker.ts, useZielbeobachtung.ts,
 * i18n, lucide-react, ui/stil/tour.css.
 */
import { X } from "lucide-react";
import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { haltFokus } from "./haltFokus";
import { t } from "../i18n/sprache";
import { merkeGesehen } from "./tourMerker";
import { beendeTour, useLaufendeTour } from "./tourStand";
import { kartenlage, naechsterSchritt } from "./tourlogik";
import { TOUREN, type TourKennung } from "./touren";
import { findeZiel, useZielbeobachtung, zielDa, type Rechteck } from "./useZielbeobachtung";

const SYMBOLGROESSE = 20;
/** Luft zwischen Ziel und goldenem Rahmen (px). */
const RAHMENABSTAND = 6;
/** So weit bleibt der Rahmen vom Bildrand weg (px). */
const BILDRAND = 2;
/** Rand oben und unten, in dem ein Ziel als „nicht ganz sichtbar“ gilt (px). */
const SICHTRAND = 16;

/** Ob das Gerät „Bewegung reduzieren“ wünscht. */
function bewegungReduziert(): boolean {
  return (
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/** Scrollt das Ziel in die Mitte, wenn es nicht ganz zu sehen ist. */
function zeigeZiel(kennung: string | null): void {
  const element = kennung ? findeZiel(kennung) : null;
  if (!element) return;
  const r = element.getBoundingClientRect();
  if (r.top >= SICHTRAND && r.bottom <= window.innerHeight - SICHTRAND) return;
  const zuGross = r.height > window.innerHeight - 2 * SICHTRAND;
  element.scrollIntoView({
    block: zuGross ? "start" : "center",
    behavior: bewegungReduziert() ? "auto" : "smooth",
  });
}

/** Der goldene Rahmen um das Ziel; sein Schatten dunkelt den Rest ab. Er bleibt ganz im Bild,
 * auch wenn das Ziel am Rand liegt (Leiste unten, Symbol oben rechts). */
function Rahmen({ rechteck }: { rechteck: Rechteck }) {
  const oben = Math.max(BILDRAND, rechteck.top - RAHMENABSTAND);
  const links = Math.max(BILDRAND, rechteck.left - RAHMENABSTAND);
  const rechts = Math.min(
    window.innerWidth - BILDRAND,
    rechteck.left + rechteck.width + RAHMENABSTAND,
  );
  const unten = Math.min(window.innerHeight - BILDRAND, rechteck.bottom + RAHMENABSTAND);
  return (
    <div
      className="tour-rahmen"
      aria-hidden="true"
      style={{ top: oben, left: links, width: rechts - links, height: unten - oben }}
    />
  );
}

/** Stelle und Blättern einer Tour; am Ende (oder mit dem Kreuz) gilt sie als gesehen. */
function useTourablauf(kennung: TourKennung) {
  const schritte = TOUREN[kennung].schritte;
  const [stelle, setzeStelle] = useState(() => naechsterSchritt(schritte, 0, 1, zielDa));
  const ende = () => {
    merkeGesehen(kennung);
    beendeTour();
  };
  const blaettere = (richtung: 1 | -1) => {
    if (stelle === null) return;
    const neu = naechsterSchritt(schritte, stelle + richtung, richtung, zielDa);
    if (neu !== null) setzeStelle(neu);
    else if (richtung === 1) ende();
  };
  return { schritte, stelle, ende, blaettere };
}

/** Die Tour, solange sie läuft; der Fokus kehrt danach dorthin zurück, wo er vorher war. */
function LaufendeTour({ kennung }: { kennung: TourKennung }) {
  const { schritte, stelle, ende, blaettere } = useTourablauf(kennung);
  const { rechteck, zeigbar } = useZielbeobachtung(schritte, stelle);
  const karte = useRef<HTMLDivElement>(null);
  const titelId = useId();
  const textId = useId();
  const schritt = stelle === null ? undefined : schritte[stelle];

  useEffect(() => {
    const vorher = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    return () => vorher?.focus();
  }, []);
  useEffect(() => {
    // Kein zeigbarer Schritt (alle Ziele fehlen): Die Tour endet gleich wieder.
    if (stelle === null) beendeTour();
    zeigeZiel(schritt?.ziel ?? null);
    karte.current?.focus();
  }, [stelle, schritt]);
  // Die Zurück-Taste des Geräts beendet die Tour; die App geht dabei wie gewohnt zurück.
  useEffect(() => {
    window.addEventListener("popstate", beendeTour);
    return () => window.removeEventListener("popstate", beendeTour);
  }, []);
  if (!schritt || stelle === null) return null;

  // Nummer und Rand nach den Schritten, die sich gerade zeigen lassen (useZielbeobachtung).
  const nummer = zeigbar.indexOf(stelle) + 1;
  const erster = nummer <= 1;
  const letzter = nummer === 0 || nummer === zeigbar.length;
  const tasten = (ereignis: KeyboardEvent<HTMLDivElement>) => {
    if (ereignis.key === "Escape") ende();
    else if (ereignis.key === "ArrowRight") blaettere(1);
    else if (ereignis.key === "ArrowLeft") blaettere(-1);
    else if (ereignis.key === "Tab") haltFokus(ereignis);
  };
  const lage = kartenlage(rechteck, window.innerWidth, window.innerHeight);
  return (
    <div className={rechteck ? "tour-ebene" : "tour-ebene tour-ebene-dunkel"} data-testid="tour">
      <div className="tour-sperre" onPointerDown={(e) => e.preventDefault()} aria-hidden="true" />
      {rechteck && <Rahmen rechteck={rechteck} />}
      <div
        ref={karte}
        className={`tour-karte tour-karte-${lage}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titelId}
        aria-describedby={textId}
        tabIndex={-1}
        onKeyDown={tasten}
        data-tour-schritt={schritt.text}
      >
        <div className="tour-kopf">
          <h2 id={titelId} className="tour-titel">
            {t(TOUREN[kennung].titel)}
          </h2>
          <button
            type="button"
            className="knopf-symbol"
            aria-label={t("tour.beenden")}
            onClick={ende}
          >
            <X size={SYMBOLGROESSE} aria-hidden="true" />
          </button>
        </div>
        <p id={textId} className="tour-text">
          {t(schritt.text)}
        </p>
        <div className="tour-fuss">
          <span className="tour-stand">
            {t("tour.schritt", {
              nummer: Math.max(nummer, 1),
              anzahl: Math.max(zeigbar.length, 1),
            })}
          </span>
          {!erster && (
            <button type="button" className="knopf-zweit" onClick={() => blaettere(-1)}>
              {t("tour.zurueck")}
            </button>
          )}
          <button type="button" className="knopf-haupt" onClick={() => blaettere(1)}>
            {letzter ? t("tour.fertig") : t("tour.weiter")}
          </button>
        </div>
      </div>
    </div>
  );
}

/** Die Tour-Ebene der App; ohne laufende Tour leer. Eine neue Tour beginnt von vorn. */
export function TourEbene() {
  const kennung = useLaufendeTour();
  if (!kennung) return null;
  return <LaufendeTour key={kennung} kennung={kennung} />;
}

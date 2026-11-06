/**
 * Startwahl beim ersten Start: „Wie möchtest du starten?“ mit drei Wegen und „Später“.
 *
 * Rolle im Gesamtbild: Wunsch des Autors R52 (23.10.2026): Beim ersten Start fragt die App einmal
 * nach einem Rundgang. Seit 0.3.43 (Wunsch des Autors, 31.10.2026) fragt sie nach dem Weg:
 * „Ich lese das Buch“ (Tour start.buch auf der Buchseite), „Ich will spielen und auswerten“
 * (Tour start.spielen auf der Spielen-Seite) oder „Erst umsehen“ (kurze Haupttour), siehe
 * starttouren.ts. Mit `?start=buch` in der Adresse (etwa aus dem QR-Code im Buch) beginnt der
 * Buch-Weg ohne Frage. Die Frage liegt unter der Startanimation. Sie kommt nicht, wenn das Symbol
 * in den Einstellungen aus ist oder die App über einen Sprung geöffnet wurde (etwa „#abb-6.20“ von
 * den Trainingsseiten der Website): Dann erst beim nächsten normalen Start. Einstellungen › Hilfe
 * öffnet sie jederzeit wieder (tourStand.ts). Gleich, wie die Antwort ausfällt, merkt sich das
 * Gerät, dass gefragt wurde (tourMerker.ts).
 * Abhängigkeiten: tourMerker.ts, tourStand.ts, app/sprachangebot.ts, Navigation, i18n, lucide-react.
 */
import { merkeStartweg, type Startweg } from "../training/startweg";
import { BookOpen, Compass, Swords, type LucideIcon } from "lucide-react";
import { useEffect, useId, useRef, useState, type RefObject } from "react";
import { useZurueckSchliesst } from "../app/blattstapel";
import type { Bereich } from "../app/stapel";
import { useNavigation } from "../app/navigationsKontext";
import { useSprachangebotFaellig } from "../app/sprachangebot";
import { t, type Textschluessel } from "../i18n/sprache";
import { haltFokus } from "./haltFokus";
import { merkeAngeboten, useTourMerker } from "./tourMerker";
import { schliesseStartwahl, starteTour, useStartwahlOffen } from "./tourStand";
import type { TourKennung } from "./touren";

const SYMBOLGROESSE = 28;
const WEGSYMBOLGROESSE = 24;

/** Ein Weg der Startwahl: Zeichen, Beschriftung, Bereich (dessen Startseite) und Tour. */
interface Startwegwahl {
  /** Der gemerkte Weg (training/startweg.ts): steuert die Vorschläge der Karte „Heute“. */
  readonly weg: Startweg;
  readonly zeichen: LucideIcon;
  readonly text: Textschluessel;
  readonly bereich: Bereich;
  readonly tour: TourKennung;
}

const WEGE: readonly Startwegwahl[] = [
  {
    zeichen: BookOpen,
    weg: "buch",
    text: "starttour.wahl.buch",
    bereich: "buch",
    tour: "start.buch",
  },
  {
    zeichen: Swords,
    weg: "spielen",
    text: "starttour.wahl.spielen",
    bereich: "spielen",
    tour: "start.spielen",
  },
  {
    zeichen: Compass,
    weg: "umsehen",
    text: "starttour.wahl.umsehen",
    bereich: "buch",
    tour: "haupt",
  },
];

/** Ob die Adresse den Buch-Weg verlangt (`?start=buch`, QR-Code im Buch). */
function startMitBuch(): boolean {
  return new URLSearchParams(window.location.search).get("start") === "buch";
}

/** „Später“: Die Frage gilt als gestellt, die Wahl schließt (auch Esc und die Zurück-Taste). */
function spaeter(): void {
  merkeAngeboten();
  schliesseStartwahl();
}

/** Merkt die Frage, schließt die Wahl, geht zum Bildschirm des Weges und startet seine Tour. */
function useWegWahl() {
  const { wechsleBereich } = useNavigation();
  return (weg: Startwegwahl) => {
    merkeAngeboten();
    merkeStartweg(weg.weg);
    schliesseStartwahl();
    // Der Bereich des Weges von vorn, auch aus den Einstellungen: Leiste und „Zurück“ passen so.
    wechsleBereich(weg.bereich);
    starteTour(weg.tour);
  };
}

/** Die Karte mit Frage, drei Wegen und „Später“. */
function Startwahlkarte({
  erster,
  waehle,
  spaeter,
}: {
  erster: RefObject<HTMLButtonElement | null>;
  waehle: (weg: Startwegwahl) => void;
  spaeter: () => void;
}) {
  const titelId = useId();
  return (
    <div className="tour-ebene tour-ebene-dunkel" data-testid="tour-angebot">
      <div className="tour-sperre" aria-hidden="true" />
      <div
        className="tour-karte tour-karte-mitte"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titelId}
        onKeyDown={(e) => {
          if (e.key === "Escape") spaeter();
          else if (e.key === "Tab") haltFokus(e);
        }}
      >
        <div className="tour-kopf">
          <Compass size={SYMBOLGROESSE} aria-hidden="true" className="tour-angebot-symbol" />
          <h2 id={titelId} className="tour-titel">
            {t("starttour.wahl.titel")}
          </h2>
        </div>
        <div className="startwahl">
          {WEGE.map((weg, i) => (
            <button
              key={weg.tour}
              ref={i === 0 ? erster : undefined}
              type="button"
              className="startwahl-weg"
              onClick={() => waehle(weg)}
            >
              <weg.zeichen size={WEGSYMBOLGROESSE} aria-hidden="true" />
              {t(weg.text)}
            </button>
          ))}
        </div>
        <button type="button" className="knopf-link startwahl-spaeter" onClick={spaeter}>
          {t("tour.angebot.spaeter")}
        </button>
      </div>
    </div>
  );
}

/** Die Startwahl, solange sie offen ist (erster Start oder auf Wunsch). */
export function TourAngebot() {
  const merker = useTourMerker();
  const aufWunsch = useStartwahlOffen();
  const { ansicht } = useNavigation();
  const waehle = useWegWahl();
  // Schon beim ersten Zeichnen lesen: Die Hülle entfernt einen Sprung gleich danach aus der Adresse.
  const [ohneSprung] = useState(() => window.location.hash === "");
  const [mitBuch] = useState(startMitBuch);
  const erster = useRef<HTMLButtonElement>(null);
  const erststart =
    ohneSprung && !merker.angeboten && merker.symbolAn && ansicht.bildschirm === "buch";
  // Erst die Sprache (Wunsch des Autors, 31.10.2026): Die Frage danach liegt über der Startwahl;
  // der Buch-Weg aus dem QR-Code beginnt erst, wenn sie beantwortet ist.
  const sprachfrage = useSprachangebotFaellig();
  useEffect(() => {
    // QR-Code im Buch: gleich der Buch-Weg, ohne Frage.
    if (erststart && mitBuch && !sprachfrage && WEGE[0]) waehle(WEGE[0]);
  }, [erststart, mitBuch, sprachfrage, waehle]);
  const offen = aufWunsch || (erststart && !mitBuch);
  useEffect(() => {
    if (offen) erster.current?.focus();
  }, [offen]);
  // Die Zurück-Taste des Geräts schließt nur die Frage, wie „Später“ (app/blattstapel.ts).
  useZurueckSchliesst(offen, spaeter);
  if (!offen) return null;
  return <Startwahlkarte erster={erster} waehle={waehle} spaeter={spaeter} />;
}

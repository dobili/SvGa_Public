/**
 * Die Leiste unten mit den fünf Bereichen Buch, Training, Spielen, Nachschlagen, Profil.
 *
 * Rolle im Gesamtbild: Hauptnavigation der App (Konzept 10.1, Bildschirmentwurf „Leiste“). Der
 * fünfte Bereich hieß bis 0.2.30 „Ich“, danach war er ein Zahnrad für die Einstellungen. Seit
 * 0.2.134 (Wunsch des Autors, 25.10.2026) ist er das „Profil“ mit Personensymbol und Wort:
 * Wertung, Fortschritt und Partien; die Einstellungen liegen eine Ebene tiefer. Intern heißt der
 * Bereich weiter „ich“ (Navigation, Speicher). Drei Sekunden Druck auf „Profil“ öffnen die
 * Aufgabenseite des Autors (seit 0.2.75).
 * Seit V6 (Nutzungsprüfung 25.10.2026) springt der goldene Strich sofort auf den getippten
 * Bereich; den neuen Bildschirm zeichnet React erst nach diesem Bild. Vorher wartete die ganze
 * Rückmeldung auf den Bildschirm, bei „Spielen“ gedrosselt (CPU 4×) etwa 0,15 s. (Als Übergang
 * mit startTransition kam der Bildschirm gemessen 60 ms später, deshalb ohne.)
 * Abhängigkeiten: Navigation, i18n, Lucide-Symbole, useLangerDruck, nachDemNaechstenBild.
 */
import {
  BookOpen,
  CircleUserRound,
  Crosshair,
  Search,
  Swords,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";
import { useNavigation } from "../../app/navigationsKontext";
import type { Bereich } from "../../app/stapel";
import { t, type Textschluessel } from "../../i18n/sprache";
import { nachDemNaechstenBild } from "./nachDemNaechstenBild";
import { useLangerDruck } from "./useLangerDruck";

/**
 * Von 0.2.116 bis 0.2.129 zeigte die Leiste nur Symbole (Wunsch des Autors, 19.10.2026). Seit DS55
 * (0.2.131, vom Autor am 25.10.2026 freigegeben) steht unter Buch, Training, Spielen und
 * Nachschlagen wieder das Wort, weil Fadenkreuz und Schwerter nicht von selbst verständlich sind.
 * Seit 0.2.134 trägt auch „Profil“ sein Wort. Der Name bleibt zusätzlich als aria-label und Tooltip.
 */
const SYMBOLGROESSE = 26;
const STRICHSTAERKE = 1.8;
/** So lange hält der Autor „Profil“, bis die Aufgabenseite aufgeht (sein Wunsch: 3 s). */
const LANGER_DRUCK_MS = 3000;

interface Bereichsknopf {
  readonly bereich: Bereich;
  readonly symbol: LucideIcon;
  readonly text: Textschluessel;
  /** Ziel-Kennung für die Haupttour (tour/touren.ts). */
  readonly tour: string;
}

const BEREICHE: readonly Bereichsknopf[] = [
  { bereich: "buch", symbol: BookOpen, text: "leiste.buch", tour: "leiste-buch" },
  { bereich: "training", symbol: Crosshair, text: "leiste.training", tour: "leiste-training" },
  { bereich: "spielen", symbol: Swords, text: "leiste.spielen", tour: "leiste-spielen" },
  {
    bereich: "nachschlagen",
    symbol: Search,
    text: "leiste.nachschlagen",
    tour: "leiste-nachschlagen",
  },
  { bereich: "ich", symbol: CircleUserRound, text: "leiste.profil", tour: "leiste-einstellungen" },
];

/** Die Leiste; der aktive Bereich trägt oben einen goldenen Strich. */
export function Leiste() {
  const { stapel, wechsleBereich, navigiere } = useNavigation();
  // Der getippte Bereich, bis der Bildschirm gewechselt hat; so zeigt die Leiste ihn sofort (V6).
  const [angetippt, setzeAngetippt] = useState<Bereich | null>(null);
  const gezeigt = angetippt ?? stapel.bereich;
  const wechsle = (bereich: Bereich) => {
    setzeAngetippt(bereich);
    void nachDemNaechstenBild().then(() => {
      wechsleBereich(bereich);
      setzeAngetippt(null);
    });
  };
  const druck = useLangerDruck(LANGER_DRUCK_MS, () => {
    // In der Fassung für die Leser gibt es die Aufgabenseite nicht (AP 17).
    if (__VEROEFFENTLICHUNG__) return;
    wechsleBereich("ich");
    navigiere({ bildschirm: "autoraufgaben" });
  });
  return (
    <nav className="leiste" aria-label={t("leiste.titel")}>
      {BEREICHE.map(({ bereich, symbol: Symbol, text, tour }) => {
        const mitDruck = bereich === "ich";
        return (
          <button
            key={bereich}
            type="button"
            className={mitDruck ? "leiste-knopf leiste-knopf-halten" : "leiste-knopf"}
            aria-current={gezeigt === bereich ? "page" : undefined}
            data-tour={tour}
            aria-label={t(text)}
            title={t(text)}
            {...(mitDruck
              ? {
                  onPointerDown: druck.onPointerDown,
                  onPointerUp: druck.onPointerUp,
                  onPointerLeave: druck.onPointerLeave,
                  onPointerCancel: druck.onPointerCancel,
                  onContextMenu: druck.onContextMenu,
                }
              : {})}
            onClick={() => {
              if (mitDruck && druck.warLang()) return;
              wechsle(bereich);
            }}
          >
            <Symbol size={SYMBOLGROESSE} strokeWidth={STRICHSTAERKE} aria-hidden="true" />
            <span aria-hidden="true">{t(text)}</span>
          </button>
        );
      })}
    </nav>
  );
}

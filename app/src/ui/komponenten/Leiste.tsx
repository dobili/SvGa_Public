/**
 * Die Leiste unten mit den fünf Bereichen Buch, Training, Spielen, Nachschlagen, Einstellungen.
 *
 * Rolle im Gesamtbild: Hauptnavigation der App (Konzept 10.1, Bildschirmentwurf „Leiste“). Der
 * fünfte Bereich hieß bis 0.2.30 „Ich“; auf Wunsch des Autors (Test von 0.2.30) steht dort nur
 * ein Zahnrad ohne Beschriftung, denn letztlich sind es Einstellungen. Bildschirmleser lesen
 * „Einstellungen“ vor. Intern heißt der Bereich weiter „ich“ (Navigation, Speicher). Drei
 * Sekunden Druck auf das Zahnrad öffnen die Aufgabenseite des Autors (seit 0.2.75).
 * Abhängigkeiten: Navigation, i18n, Lucide-Symbole, useLangerDruck.
 */
import { BookOpen, Crosshair, Search, Settings, Swords, type LucideIcon } from "lucide-react";
import { useNavigation } from "../../app/navigationsKontext";
import type { Bereich } from "../../app/stapel";
import { t, type Textschluessel } from "../../i18n/sprache";
import { useLangerDruck } from "./useLangerDruck";

const SYMBOLGROESSE = 24;
const STRICHSTAERKE = 1.8;
/** So lange hält der Autor das Zahnrad, bis die Aufgabenseite aufgeht (sein Wunsch: 3 s). */
const LANGER_DRUCK_MS = 3000;

interface Bereichsknopf {
  readonly bereich: Bereich;
  readonly symbol: LucideIcon;
  readonly text: Textschluessel;
  /** Nur das Symbol zeigen; der Text ist dann nur für Bildschirmleser da. */
  readonly nurSymbol?: boolean;
}

const BEREICHE: readonly Bereichsknopf[] = [
  { bereich: "buch", symbol: BookOpen, text: "leiste.buch" },
  { bereich: "training", symbol: Crosshair, text: "leiste.training" },
  { bereich: "spielen", symbol: Swords, text: "leiste.spielen" },
  { bereich: "nachschlagen", symbol: Search, text: "leiste.nachschlagen" },
  { bereich: "ich", symbol: Settings, text: "leiste.einstellungen", nurSymbol: true },
];

/** Die Leiste; der aktive Bereich trägt oben einen goldenen Strich. */
export function Leiste() {
  const { stapel, wechsleBereich, navigiere } = useNavigation();
  const druck = useLangerDruck(LANGER_DRUCK_MS, () => {
    // In der Fassung für die Leser gibt es die Aufgabenseite nicht (AP 17).
    if (__VEROEFFENTLICHUNG__) return;
    wechsleBereich("ich");
    navigiere({ bildschirm: "autoraufgaben" });
  });
  return (
    <nav className="leiste" aria-label={t("leiste.titel")}>
      {BEREICHE.map(({ bereich, symbol: Symbol, text, nurSymbol }) => {
        const mitDruck = bereich === "ich";
        return (
          <button
            key={bereich}
            type="button"
            className={mitDruck ? "leiste-knopf leiste-knopf-halten" : "leiste-knopf"}
            aria-current={stapel.bereich === bereich ? "page" : undefined}
            aria-label={nurSymbol ? t(text) : undefined}
            title={nurSymbol ? t(text) : undefined}
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
              wechsleBereich(bereich);
            }}
          >
            <Symbol size={SYMBOLGROESSE} strokeWidth={STRICHSTAERKE} aria-hidden="true" />
            {!nurSymbol && <span>{t(text)}</span>}
          </button>
        );
      })}
    </nav>
  );
}

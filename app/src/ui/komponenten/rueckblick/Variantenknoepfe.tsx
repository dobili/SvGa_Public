/**
 * Knöpfe direkt unter dem Brett, die die Varianten der Rückblickkarte langsam am Brett abspielen:
 * „Besser war …“ (Glühbirne) und „So wird der Fehler bestraft“ (gekreuzte Schwerter).
 *
 * Rolle im Gesamtbild: Wunsch des Autors (26.10.2026): Die Varianten standen nur als antippbare
 * Züge in der Karte (Nebenzweig.tsx); wer sehen wollte, wie es weitergeht, musste jeden Zug
 * einzeln antippen. Ein Tipp auf einen Knopf zeigt nun die Züge der Variante nacheinander, etwa
 * einen Zug je 1,2 Sekunden; ein zweiter Tipp hält an. Die Stellung am Brett wählt weiter der
 * Partie-Bildschirm aus dem Schritt (Zweigwahl), deshalb gelten Pfeile und „Zurück zur Partie“
 * der Karte auch während des Abspielens.
 * Abhängigkeiten: Nebenzweig.tsx (Zweigwahl), spiel/nebenzweig.ts (Typ), lucide, i18n.
 */
import { Lightbulb, Pause, Play, Swords } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { t } from "../../../i18n/sprache";
import type { Zweigzug } from "../../../spiel/nebenzweig";
import type { Zweigart, Zweigwahl } from "./Nebenzweig";

const SYMBOL = 18;
/** Zeit je Zug beim Abspielen: langsam genug, um jeden Zug am Brett zu verfolgen. */
export const TAKT_MS = 1200;

const ARTEN = [
  { art: "besser", Symbol: Lightbulb, text: "rueckblick.abspielenBesser" },
  { art: "strafe", Symbol: Swords, text: "rueckblick.abspielenStrafe" },
] as const;

/**
 * Lässt die gewählte Variante weiterlaufen, solange `laeuft` gesetzt ist; am Ende, bei einem
 * anderen Zweig oder „Zurück zur Partie“ hält sie an. Die letzte Stellung bleibt stehen.
 */
function useAbspielen(
  laeuft: Zweigart | null,
  halt: () => void,
  wahl: Zweigwahl,
  laenge: number,
): void {
  // Die Setzer entstehen bei jedem Zeichnen neu; der Zeitgeber soll davon nicht neu starten.
  const setze = useRef(wahl.setze);
  useEffect(() => {
    setze.current = wahl.setze;
  });
  const { art, schritt } = wahl;
  useEffect(() => {
    if (laeuft === null) return;
    if (art !== laeuft || schritt === null || schritt >= laenge) {
      halt();
      return;
    }
    const zeitgeber = setTimeout(() => setze.current(laeuft, schritt + 1), TAKT_MS);
    return () => clearTimeout(zeitgeber);
  }, [laeuft, art, schritt, laenge, halt]);
}

/**
 * Die Knöpfe zu den Varianten, die die Karte zum gezeigten Zug nennt. Eingaben: die Züge beider
 * Varianten (leer = Knopf fehlt) und die Zweigwahl des Partie-Bildschirms.
 * Beispiel: nach 4. c4? (Rückmeldung des Autors) „Bestrafung abspielen“ zeigt 4... e5 5. dxe5 Sxe5
 * nacheinander am Brett. Ohne beide Varianten nichts.
 */
export function Variantenknoepfe({
  besser,
  strafe,
  wahl,
}: {
  besser: readonly Zweigzug[];
  strafe: readonly Zweigzug[];
  wahl: Zweigwahl;
}) {
  const [laeuft, setzeLaeuft] = useState<Zweigart | null>(null);
  const halt = useCallback(() => setzeLaeuft(null), []);
  const laengen = { besser: besser.length, strafe: strafe.length };
  useAbspielen(laeuft, halt, wahl, laeuft === null ? 0 : laengen[laeuft]);
  const sichtbar = ARTEN.filter(({ art }) => laengen[art] > 0);
  if (sichtbar.length === 0) return null;
  const tippe = (art: Zweigart) => {
    if (laeuft === art) return setzeLaeuft(null);
    // Am Ende der Variante oder aus der Partie: von vorn; sonst ab dem gezeigten Zug weiter.
    const amEnde = wahl.art !== art || wahl.schritt === null || wahl.schritt >= laengen[art];
    if (amEnde) wahl.setze(art, 1);
    setzeLaeuft(art);
  };
  return (
    <div className="variantenknoepfe" data-testid="variantenknoepfe">
      {sichtbar.map(({ art, Symbol, text }) => (
        <button
          key={art}
          type="button"
          className="knopf-zweit"
          aria-pressed={laeuft === art}
          data-testid={`abspielen-${art}`}
          onClick={() => tippe(art)}
        >
          <Symbol size={SYMBOL} aria-hidden="true" />
          {laeuft === art ? (
            <Pause size={SYMBOL} aria-hidden="true" />
          ) : (
            <Play size={SYMBOL} aria-hidden="true" />
          )}
          {laeuft === art ? t("rueckblick.abspielenHalt") : t(text)}
        </button>
      ))}
    </div>
  );
}

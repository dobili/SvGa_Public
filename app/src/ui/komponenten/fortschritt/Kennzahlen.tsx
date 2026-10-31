/**
 * Drei Kacheln „auf einen Blick“ in der Karte „Dein Fortschritt“: gelöste Übungen,
 * Trainer-Durchgänge, beantwortete Warum-Fragen, je mit Zeichen, großer Zahl und kurzer Zeile.
 *
 * Rolle im Gesamtbild: Ersetzt seit 0.3.43 die Liste aus Überschrift und Wert unter den Orden, die
 * auf dem Handy verloren und ohne Bezug wirkte (Befund des Autors, 31.10.2026). Die Hantel ist
 * dasselbe Zeichen wie im Orden der Trainer, damit man beides zusammen liest. Die Karte erscheint
 * erst, wenn eine der drei Zahlen über null liegt; dann stehen alle drei da (null leiser), damit
 * die Reihe ihre Form behält.
 * Abhängigkeiten: lucide-react, i18n, stil/speicher.css.
 */
import { CircleCheck, Dumbbell, MessageCircleQuestion, type LucideIcon } from "lucide-react";
import { t, type Textschluessel } from "../../../i18n/sprache";

const ZEICHENGROESSE = 20;

interface Kachel {
  readonly zeichen: LucideIcon;
  readonly zahl: number;
  readonly text: Textschluessel;
}

/**
 * Die drei Kacheln. Beispiel: 2 Übungen gelöst, 8 Trainer-Durchgänge, keine Warum-Frage →
 * „✓ 2 Übungen gelöst | 🏋 8 Trainer-Durchgänge | ? 0 Warum-Fragen“ (die Null leiser).
 * Sonderfall: alle drei null → nichts.
 */
export function Kennzahlen({
  uebungen,
  durchgaenge,
  warum,
}: {
  uebungen: number;
  durchgaenge: number;
  warum: number;
}) {
  if (uebungen + durchgaenge + warum === 0) return null;
  const kacheln: readonly Kachel[] = [
    { zeichen: CircleCheck, zahl: uebungen, text: "fortschritt.uebungen" },
    { zeichen: Dumbbell, zahl: durchgaenge, text: "fortschritt.trainerDurchgaenge" },
    { zeichen: MessageCircleQuestion, zahl: warum, text: "fortschritt.warum" },
  ];
  return (
    <ul className="kennzahlen" data-testid="fortschritt-kennzahlen">
      {kacheln.map(({ zeichen: Zeichen, zahl, text }) => (
        <li key={text} className={zahl === 0 ? "kennzahl leer" : "kennzahl"}>
          <Zeichen size={ZEICHENGROESSE} aria-hidden="true" className="kennzahl-zeichen" />
          <span className="kennzahl-zahl">{zahl}</span>
          <span className="kennzahl-text">{t(text)}</span>
        </li>
      ))}
    </ul>
  );
}

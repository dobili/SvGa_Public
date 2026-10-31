/**
 * Eine waagerechte Reihe zum Antippen: Farbkreise für die Brettfarbe, Kacheln für die Figuren.
 *
 * Rolle im Gesamtbild: Entwurf K2 „Brettvorschau oben“ (Wahl des Autors, 31.10.2026): Unter der
 * großen Brettvorschau liegen die Brettfarben als runde Farbfelder und die Figurensätze als
 * Kacheln mit einem Springer in einer Reihe, die man seitlich wischt. Für Bildschirmleser ist die
 * Reihe eine Gruppe von Radioknöpfen wie Vorschauwahl.tsx. Gesperrte Extras (Gamifizierung P7)
 * zeigen ein Schloss, lassen sich nicht wählen und nennen ihre Bedingung: für Bildschirmleser im
 * Namen, sichtbar nach einem Tipp unter der Reihe (in den kleinen Feldern hat sie keinen Platz).
 * Beim Öffnen rückt die Reihe das gewählte Feld ins Bild.
 * Abhängigkeiten: React, Lucide-Symbole, i18n.
 */
import { Lock } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { t } from "../../../i18n/sprache";

/** Größe des Schlosses auf gesperrten Feldern. */
const SCHLOSSGROESSE = 16;
/** Das gewählte Feld steht nach dem Öffnen in der Mitte der Reihe (Hälfte der Breite). */
const MITTE = 2;

/** Rückt das gewählte Feld waagerecht ins Bild, ohne die Seite senkrecht zu bewegen. */
function useGewaehltImBild() {
  const reihe = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = reihe.current;
    const feld = element?.querySelector<HTMLElement>('[aria-checked="true"]');
    if (!element || !feld) return;
    element.scrollLeft = feld.offsetLeft - (element.clientWidth - feld.offsetWidth) / MITTE;
    // Nur beim Öffnen: Ein Tipp in der Reihe soll sie nicht verschieben.
  }, []);
  return reihe;
}

/** Ein Feld der Reihe: Bild, Name, bei Sperre ein Schloss und die Bedingung (nur vorgelesen). */
function Musterfeld({
  gewaehlt,
  text,
  bedingung,
  form,
  beiTipp,
  children,
}: {
  gewaehlt: boolean;
  text: string;
  bedingung: string | undefined;
  form: "kreis" | "kachel";
  beiTipp: () => void;
  children: ReactNode;
}) {
  const gesperrt = bedingung !== undefined;
  return (
    <button
      type="button"
      role="radio"
      aria-checked={gewaehlt}
      aria-disabled={gesperrt || undefined}
      className={`musterfeld musterfeld-${form}${gesperrt ? " musterfeld-gesperrt" : ""}`}
      onClick={beiTipp}
    >
      <span className="musterfeld-bild" aria-hidden="true">
        {children}
        {gesperrt && <Lock className="musterfeld-schloss" size={SCHLOSSGROESSE} />}
      </span>
      <span className="musterfeld-name">{text}</span>
      {gesperrt && <span className="nur-vorlesen">{bedingung}</span>}
    </button>
  );
}

/**
 * Die Reihe mit Überschrift. Eingaben: Name (Überschrift und Name der Gruppe), Werte, gewählter
 * Wert, Beschriftung, Bild je Wert, Form, Wahl, wahlweise Sperre je Wert (Text der Bedingung).
 * Beispiel: „Brettfarbe“ mit „wie im Buch“, „Grün“, „Braun“, …, „Nacht und Gold“ gesperrt.
 */
export function Musterwahl<T extends string>({
  name,
  werte,
  gewaehlt,
  text,
  bild,
  form,
  beiWahl,
  sperre,
}: {
  name: string;
  werte: readonly T[];
  gewaehlt: T;
  text: (wert: T) => string;
  bild: (wert: T) => ReactNode;
  form: "kreis" | "kachel";
  beiWahl: (wert: T) => void;
  sperre: (wert: T) => string | undefined;
}) {
  const reihe = useGewaehltImBild();
  const [meldung, setzeMeldung] = useState<string | null>(null);
  const tippe = (wert: T) => {
    const bedingung = sperre(wert);
    if (bedingung !== undefined) {
      setzeMeldung(t("einstellungenneu.gesperrt", { name: text(wert), bedingung }));
      return;
    }
    setzeMeldung(null);
    beiWahl(wert);
  };
  return (
    <div className="musterwahl">
      <h2 className="musterwahl-titel">{name}</h2>
      <div className="musterreihe" role="radiogroup" aria-label={name} ref={reihe}>
        {werte.map((wert) => (
          <Musterfeld
            key={wert}
            gewaehlt={wert === gewaehlt}
            text={text(wert)}
            bedingung={sperre(wert)}
            form={form}
            beiTipp={() => tippe(wert)}
          >
            {bild(wert)}
          </Musterfeld>
        ))}
      </div>
      {meldung && (
        <p className="hinweis musterwahl-meldung" role="status">
          {meldung}
        </p>
      )}
    </div>
  );
}

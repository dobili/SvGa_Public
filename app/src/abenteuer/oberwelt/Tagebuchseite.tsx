/**
 * Eine Tagebuchseite, die der Held schreibt (Roman Kap. 9: „Ich will besser werden.“): Der Satz
 * erscheint Buchstabe für Buchstabe in Handschrift; ein Tipp zeigt ihn ganz, „Weiter“ schließt.
 * Dazu die Liste der eigenen Seiten im Tagebuch.
 *
 * Rolle im Gesamtbild: Der Dialog ruft `schreibeTagebuch(name)` (Ink); der Eintrag steht dann im
 * Spielstand (oberwelt/dialogwirkungen.ts), und nach dem Dialog zeigt die Oberwelt diese Seite.
 * Wer weniger Bewegung wünscht (prefers-reduced-motion), sieht den Satz sofort.
 * Abhängigkeiten: oberwelt/schreibtakt.ts, texte/texte.ts, app/blattstapel.ts.
 */
import { useEffect, useState } from "react";
import { useZurueckSchliesst } from "../../app/blattstapel";
import type { Abenteuerstand } from "../schnittstelle/spielstand";
import { tSpiel } from "../texte/texte";
import { geschriebeneZeichen, MS_JE_ZEICHEN } from "./schreibtakt";

/** Ohne Bewegung (Einstellung des Geräts)? */
function ohneBewegung(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true
  );
}

/** Die Seite mit Schreibanimation. Eingaben: Name des Eintrags, Schließen. */
export function Tagebuchseite({
  name,
  beiSchliessen,
}: {
  readonly name: string;
  readonly beiSchliessen: () => void;
}) {
  useZurueckSchliesst(true, beiSchliessen);
  const text = tSpiel(`tagebuch.eintrag.${name}`);
  const [zeichen, setzeZeichen] = useState(() => (ohneBewegung() ? text.length : 0));
  useEffect(() => {
    if (zeichen >= text.length) return;
    const beginn = performance.now() - zeichen * MS_JE_ZEICHEN;
    const uhr = window.setInterval(() => {
      setzeZeichen(geschriebeneZeichen(text, performance.now() - beginn));
    }, MS_JE_ZEICHEN);
    return () => window.clearInterval(uhr);
    // Einmal je Seite; die Uhr läuft, bis der Satz steht.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);
  const fertig = zeichen >= text.length;
  return (
    <section
      className="abenteuer-ergebnis abenteuer-tagebuchseite"
      data-testid="abenteuer-tagebuchseite"
      onClick={() => setzeZeichen(text.length)}
    >
      <p className="abenteuer-handschrift" aria-label={text}>
        <span aria-hidden="true">{text.slice(0, zeichen)}</span>
        {!fertig && <span className="abenteuer-feder" aria-hidden="true" />}
      </p>
      <button
        type="button"
        className="knopf-zweit"
        disabled={!fertig}
        onClick={(e) => {
          e.stopPropagation();
          beiSchliessen();
        }}
      >
        {tSpiel("ergebnis.weiter")}
      </button>
    </section>
  );
}

/** Die eigenen Seiten im Tagebuch, in der Reihenfolge des Schreibens. */
export function EigeneSeiten({ eintraege }: { readonly eintraege: Abenteuerstand["eintraege"] }) {
  if (!eintraege || eintraege.length === 0) return null;
  return (
    <>
      <h3>{tSpiel("tagebuch.eigeneSeiten")}</h3>
      <ul>
        {eintraege.map((e) => (
          <li key={e.name} className="abenteuer-handschrift">
            {tSpiel(`tagebuch.eintrag.${e.name}`)}
          </li>
        ))}
      </ul>
    </>
  );
}

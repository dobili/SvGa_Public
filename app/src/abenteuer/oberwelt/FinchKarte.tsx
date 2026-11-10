/**
 * Sammelkarte der Finch-Jagd im Tagebuch: 16 Kästchen, je eine weiße Figur aus Buchsbaum; nach
 * dem Fund steht darunter das eingebrannte Feld (docs/spiel/15, 1.1; Runde 6, Teil 5).
 *
 * Rolle im Gesamtbild: Teil von oberwelt/Tagebuch.tsx; die Logik steht in regeln/finchjagd.ts.
 * Figuren als Schachsymbole (sprachfrei), Texte aus den Spieltexten.
 * Abhängigkeiten: regeln/finchjagd.ts, texte/texte.ts.
 */
import { finchKarte } from "../regeln/finchjagd";
import { tSpiel } from "../texte/texte";

/** Weiße Schachsymbole je FEN-Buchstabe. */
const SYMBOL: Readonly<Record<string, string>> = {
  K: "♔",
  Q: "♕",
  R: "♖",
  B: "♗",
  N: "♘",
  P: "♙",
};

export function FinchKarte(props: {
  readonly gefunden: readonly { readonly kennung: string }[];
  readonly fundeDaten: readonly { readonly kennung: string; readonly feld?: string }[];
}) {
  const kaestchen = finchKarte(props.gefunden, props.fundeDaten);
  const anzahl = kaestchen.filter((k) => k.gefunden).length;
  return (
    <>
      <h3>{tSpiel("tagebuch.finch.titel")}</h3>
      <p>{tSpiel("tagebuch.finch.stand", { anzahl, gesamt: kaestchen.length })}</p>
      <ol className="abenteuer-finchkarte" data-testid="abenteuer-finchkarte">
        {kaestchen.map((k) => (
          <li
            key={k.fund}
            className={k.gefunden ? "gefunden" : undefined}
            aria-label={tSpiel(k.gefunden ? "tagebuch.finch.gefunden" : "tagebuch.finch.offen")}
          >
            <span aria-hidden="true">{k.gefunden ? SYMBOL[k.figur] : "?"}</span>
            <small>{k.gefunden ? (k.feld ?? "✓") : ""}</small>
          </li>
        ))}
      </ol>
    </>
  );
}

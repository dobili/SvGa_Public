/**
 * Die Fensterbank im Zimmer des Helden zeigt alle Funde (Atmosphäre T15, Roman Kapitel 23).
 *
 * Rolle im Gesamtbild: Der Dialog an der Fensterbank ruft `zeigeFensterbank()` (Ink); nach dem
 * Dialog öffnet die Oberwelt diese Ansicht (oberwelt/useDialogende.ts). Die Karte bleibt
 * unberührt. Reihenfolge: wie gefunden; Name und Satz aus funde.json und den Spieltexten, das
 * Bild (Feld `bild`) klein davor, wenn es im Paket liegt.
 * Abhängigkeiten: oberwelt/fensterbankfunde.ts, texte/texte.ts, app/blattstapel.ts.
 */
import { useZurueckSchliesst } from "../../app/blattstapel";
import type { Funddaten } from "../daten/laden";
import type { Abenteuerstand } from "../schnittstelle/spielstand";
import { tSpiel } from "../texte/texte";
import { fensterbankfunde } from "./fensterbankfunde";
import { Fundbild } from "./Fundbild";

/** Die Ansicht der Fensterbank; „Weiter“ oder Zurück schließt sie. */
export function Fensterbank({
  gefunden,
  funde,
  beiSchliessen,
}: {
  readonly gefunden: Abenteuerstand["funde"];
  readonly funde: readonly Funddaten[];
  readonly beiSchliessen: () => void;
}) {
  useZurueckSchliesst(true, beiSchliessen);
  const liste = fensterbankfunde(gefunden, funde);
  return (
    <section
      className="abenteuer-ergebnis abenteuer-fensterbank"
      data-testid="abenteuer-fensterbank"
    >
      <h2>{tSpiel("fensterbank.titel")}</h2>
      {liste.length === 0 ? (
        <p>{tSpiel("fensterbank.leer")}</p>
      ) : (
        <ul>
          {liste.map((f) => (
            <li key={f.kennung}>
              <Fundbild bild={f.bild ?? null} klein />
              <strong>{tSpiel(f.name)}</strong> {tSpiel(f.text)}
            </li>
          ))}
        </ul>
      )}
      <button type="button" className="knopf-zweit" onClick={beiSchliessen}>
        {tSpiel("ergebnis.weiter")}
      </button>
    </section>
  );
}

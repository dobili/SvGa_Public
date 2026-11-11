/**
 * Gedächtnisstellung (Partieform der Runde 6, Seilschaft auf Weg 6): Die Stellung steht einige
 * Sekunden da, dann baut der Leser sie im Stellungseditor der App nach; danach das Ergebnis.
 *
 * Rolle im Gesamtbild: Teil von oberwelt/Oberwelt.tsx; der Dialog ruft beginneGedaechtnis(kennung),
 * die Daten stehen in partieformen.json (Paket), der Vergleich in regeln/gedaechtnis.ts. Bestanden
 * meldet `beiEnde(true)`; die Oberwelt setzt dann `<name>Bestanden` wie bei Aufgabenrunden.
 * Abhängigkeiten: Brettbereich, useBrettbedienung, Stellungseditor (spielstart), regeln/gedaechtnis.ts,
 * paket/paketlader.ts, texte/texte.ts.
 */
import { useEffect, useMemo, useState } from "react";
import type { BesonderePartieformenDesSchachAbenteuers } from "../../daten/generiert/abenteuer-partieformen";
import { stellungAusFen } from "../../schach/stellung";
import { LEERES_BRETT } from "../../spiel/stellungsbau";
import { Brettbereich } from "../../ui/komponenten/brettbedienung/Brettbereich";
import { useBrettbedienung } from "../../ui/komponenten/brettbedienung/useBrettbedienung";
import { Stellungseditor } from "../../ui/komponenten/spielstart/Stellungseditor";
import { Raetseltest } from "../anbindung/Testleiste";
import { liesPaketJson } from "../paket/paketlader";
import { vergleicheStellung, type Gedaechtnisergebnis } from "../regeln/gedaechtnis";
import { tSpiel } from "../texte/texte";

const KEINE_WAHL = () => undefined;
const NUR_ANSEHEN = () => "ungueltig" as const;
const MS_JE_SEKUNDE = 1000;

type Eintrag = BesonderePartieformenDesSchachAbenteuers["gedaechtnis"][number];

/** Die Stellung zum Einprägen, mit Restzeit. */
function Zeigen({ fen, sekunden, fertig }: { fen: string; sekunden: number; fertig: () => void }) {
  const [rest, setzeRest] = useState(sekunden);
  useEffect(() => {
    if (rest <= 0) {
      fertig();
      return undefined;
    }
    const zeit = setTimeout(() => setzeRest(rest - 1), MS_JE_SEKUNDE);
    return () => clearTimeout(zeit);
  }, [rest, fertig]);
  const stellung = useMemo(() => stellungAusFen(fen), [fen]);
  const bedienung = useBrettbedienung({ fen, spiele: NUR_ANSEHEN }, null, KEINE_WAHL);
  if (!stellung.ok) return null;
  return (
    <>
      <p data-testid="abenteuer-gedaechtnis-rest">
        {tSpiel("oberwelt.gedaechtnis.einpraegen", { sekunden: rest })}
      </p>
      <Brettbereich
        stellung={stellung.wert}
        markierungen={[]}
        letzterZug={null}
        bedienung={bedienung}
        beschriftung={tSpiel("oberwelt.gedaechtnis.titel")}
      />
    </>
  );
}

/**
 * Das Fenster der Gedächtnisstellung. Eingaben: Kennung aus partieformen.json, Rückruf mit
 * bestanden/nicht bestanden. Sonderfall: Fehlt der Eintrag, endet es sofort als nicht bestanden.
 */
export function Gedaechtnisstellung(props: {
  readonly kennung: string;
  readonly beiEnde: (bestanden: boolean) => void;
}) {
  const [eintrag, setzeEintrag] = useState<Eintrag | null>(null);
  const [phase, setzePhase] = useState<"zeigen" | "aufbauen">("zeigen");
  const [ergebnis, setzeErgebnis] = useState<Gedaechtnisergebnis | null>(null);
  const { kennung, beiEnde } = props;
  useEffect(() => {
    liesPaketJson<BesonderePartieformenDesSchachAbenteuers>("daten/partieformen.json")
      .then((alle) => {
        const gefunden = alle.gedaechtnis.find((g) => g.kennung === kennung);
        if (gefunden) setzeEintrag(gefunden);
        else beiEnde(false);
      })
      .catch(() => beiEnde(false));
    // Nur bei neuer Kennung laden; beiEnde ist ein neuer Rückruf je Zeichnen der Oberwelt.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kennung]);
  const zuEnde = useMemo(() => () => setzePhase("aufbauen"), []);
  return (
    <section
      className="abenteuer-ergebnis abenteuer-vorfuehrung"
      role="dialog"
      aria-label={tSpiel("oberwelt.gedaechtnis.titel")}
      data-testid="abenteuer-gedaechtnis"
    >
      {!eintrag && <p className="lade">{tSpiel("oberwelt.laedt")}</p>}
      {eintrag && !ergebnis && phase === "zeigen" && (
        <Zeigen fen={eintrag.fen} sekunden={eintrag.sekunden} fertig={zuEnde} />
      )}
      {eintrag && !ergebnis && phase === "aufbauen" && (
        <>
          <p>{tSpiel("oberwelt.gedaechtnis.aufbauen")}</p>
          <Stellungseditor
            start={LEERES_BRETT}
            beiUebernehmen={(fen) => setzeErgebnis(vergleicheStellung(eintrag.fen, fen))}
            beiAbbrechen={() => beiEnde(false)}
            nurSetzen
            fertigText={tSpiel("oberwelt.gedaechtnis.fertig")}
          />
        </>
      )}
      {eintrag && !ergebnis && <Raetseltest beiWahl={beiEnde} />}
      {ergebnis && (
        <>
          <p data-testid="abenteuer-gedaechtnis-ergebnis">
            {tSpiel(
              ergebnis.bestanden
                ? "oberwelt.gedaechtnis.bestanden"
                : "oberwelt.gedaechtnis.daneben",
              { richtig: ergebnis.richtig, gesamt: ergebnis.gesamt },
            )}
          </p>
          <button type="button" className="knopf-zweit" onClick={() => beiEnde(ergebnis.bestanden)}>
            {tSpiel("ergebnis.weiter")}
          </button>
        </>
      )}
    </section>
  );
}

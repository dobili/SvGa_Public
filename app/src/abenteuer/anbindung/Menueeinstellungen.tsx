/**
 * Der untere Teil des Spielmenüs: Tageszeit und Warten (Spieluhr, Wunsch des Autors, 22.11.2026),
 * dann Seite des Steuerkreuzes und Ton.
 *
 * Warum eine eigene Datei: AbenteuerAnsicht.tsx ist an der Größengrenze. Das Warten selbst macht
 * die Oberwelt (oberwelt/useWarten.tsx); das Menü kennt sie nur über oberwelt/wartewunsch.ts.
 * Warten geht nur in freier Welt; sonst sind die Knöpfe gesperrt und ein Satz sagt warum.
 * Abhängigkeiten: Steuerkreuzwahl.tsx, Tonregler.tsx, oberwelt/wartewunsch.ts, regeln/spieluhr.ts.
 */
import { phase } from "../regeln/spieluhr";
import { tSpiel } from "../texte/texte";
import { useWartelage, warte, WARTEZIELE } from "../oberwelt/wartewunsch";
import { Steuerkreuzwahl } from "./Steuerkreuzwahl";
import { Tonregler } from "./Tonregler";
import { Tageszeit } from "./Tageszeit";

/** Tageszeit mit Warten, Steuerkreuz und Ton; `beiSchliessen` schließt das Menü nach dem Warten. */
export function Menueeinstellungen({ beiSchliessen }: { readonly beiSchliessen: () => void }) {
  const lage = useWartelage();
  return (
    <>
      {lage && (
        <section className="abenteuer-warten" data-testid="abenteuer-warten">
          <h3>
            <Tageszeit stunde={lage.stunde} tag={lage.tag} /> {tSpiel("warten.titel")}
          </h3>
          <div className="abenteuer-wartezeile">
            {WARTEZIELE.map((z) => (
              <button
                key={z}
                type="button"
                className="knopf-zweit"
                disabled={!lage.moeglich}
                data-ziel={z}
                onClick={() => {
                  warte(z);
                  beiSchliessen();
                }}
              >
                {tSpiel(`warten.bis.${z}`)}
              </button>
            ))}
          </div>
          {!lage.moeglich && <p className="abenteuer-hinweistext">{tSpiel("warten.nichtJetzt")}</p>}
          <span hidden data-testid="abenteuer-phase">
            {phase(lage.stunde)}
          </span>
        </section>
      )}
      <Steuerkreuzwahl />
      <Tonregler />
    </>
  );
}

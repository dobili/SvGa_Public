/**
 * Vorführung eines Statisten: ein kleines Brett spielt einen brillanten Zug mit Fortsetzung vor,
 * Zug für Zug vor und zurück, mit einem kurzen Satz je Zug (Dokument 16, Abschnitt 3.4).
 *
 * Rolle im Gesamtbild: Teil von oberwelt/Oberwelt.tsx; öffnet sich aus der Sprechblase eines
 * Statisten mit `zeigt`. Vorbild ist der Folgespieler der Trainer (ui/trainer/Folgespieler.tsx),
 * aber ohne Bewertungsbalken. Die Daten (`daten/vorfuehrungen.json` im Abenteuer-Paket) werden
 * erst beim Öffnen geladen; die App liest nur `fen` und `zuege`.
 * Abhängigkeiten: Brettbereich, useBrettbedienung, schach/weiterspielen.ts,
 * training/uebungsaufgabe.ts (stellungNach), paket/paketlader.ts, texte/texte.ts, i18n (Knöpfe).
 * Beispiel: Kennung „operPartie“ → Stellung nach 12…Rd8 der Opernpartie, dann 13.Rxd7 bis 17.Rd8#.
 */
import { useEffect, useMemo, useState } from "react";
import type { Markierung } from "../../analyse/werkzeug";
import type {
  Vorfuehrung as Vorfuehrungsdaten,
  VorfuhrungenDesSchachAbenteuers,
} from "../../daten/generiert/abenteuer-vorfuehrungen";
import { sprache, t } from "../../i18n/sprache";
import { sanInSprache } from "../../schach/notation";
import { stellungAusFen } from "../../schach/stellung";
import { zugFelder } from "../../schach/weiterspielen";
import { stellungNach } from "../../training/uebungsaufgabe";
import { Brettbereich } from "../../ui/komponenten/brettbedienung/Brettbereich";
import { useBrettbedienung } from "../../ui/komponenten/brettbedienung/useBrettbedienung";
import { liesPaketJson } from "../paket/paketlader";
import { tSpiel } from "../texte/texte";

const KEINE_WAHL = () => undefined;
/** Ziehen ist hier nicht vorgesehen: Das Brett zeigt nur die Folge. */
const NUR_ANSEHEN = () => "ungueltig" as const;

/** Lädt eine Vorführung aus dem Paket; null, solange sie lädt oder wenn es sie nicht gibt. */
function useVorfuehrung(kennung: string): Vorfuehrungsdaten | null | "fehlt" {
  const [daten, setzeDaten] = useState<Vorfuehrungsdaten | null | "fehlt">(null);
  useEffect(() => {
    let aktiv = true;
    liesPaketJson<VorfuhrungenDesSchachAbenteuers>("daten/vorfuehrungen.json")
      .then((alle) => {
        if (aktiv) setzeDaten(alle.vorfuehrungen.find((v) => v.kennung === kennung) ?? "fehlt");
      })
      .catch(() => {
        if (aktiv) setzeDaten("fehlt");
      });
    return () => {
      aktiv = false;
    };
  }, [kennung]);
  return daten;
}

/** Brett mit Satz und Blätterknöpfen für eine geladene Vorführung. */
function Vorfuehrbrett({ v }: { v: Vorfuehrungsdaten }) {
  const [stelle, setzeStelle] = useState(0);
  const fen = useMemo(() => stellungNach(v.fen, v.zuege.slice(0, stelle)), [v, stelle]);
  const stellung = useMemo(() => stellungAusFen(fen), [fen]);
  const bedienung = useBrettbedienung({ fen, spiele: NUR_ANSEHEN }, null, KEINE_WAHL);
  const letzter =
    stelle > 0
      ? zugFelder(stellungNach(v.fen, v.zuege.slice(0, stelle - 1)), v.zuege[stelle - 1] ?? "")
      : null;
  const markierungen: Markierung[] = letzter ? [{ typ: "pfeil", farbe: "gold", ...letzter }] : [];
  if (!stellung.ok) return null;
  const titel = tSpiel(`vorfuehrung.${v.kennung}.titel`);
  const zug = stelle > 0 ? sanInSprache(v.zuege[stelle - 1] ?? "", sprache()) : null;
  return (
    <>
      <p>
        <strong>{titel}</strong>
      </p>
      <Brettbereich
        stellung={stellung.wert}
        markierungen={markierungen}
        letzterZug={letzter}
        bedienung={bedienung}
        beschriftung={titel}
        anfangsGedreht={v.aus_sicht === "schwarz"}
      />
      <p data-testid="abenteuer-vorfuehrung-satz">
        {zug && <strong>{zug} </strong>}
        {stelle > 0 ? tSpiel(`vorfuehrung.${v.kennung}.${stelle}`) : null}
      </p>
      <div className="knopfzeile">
        <button
          type="button"
          className="chip"
          disabled={stelle === 0}
          onClick={() => setzeStelle(stelle - 1)}
          aria-label={t("folgespieler.zurueck")}
        >
          ◀
        </button>
        <button
          type="button"
          className="chip"
          disabled={stelle >= v.zuege.length}
          onClick={() => setzeStelle(stelle + 1)}
          aria-label={t("folgespieler.vor")}
          data-testid="abenteuer-vorfuehrung-vor"
        >
          ▶
        </button>
      </div>
    </>
  );
}

/**
 * Die Vorführung als eigenes Fenster über der Welt. Eingaben: Kennung aus `zeigt`, Rückruf zum
 * Schließen. Sonderfall: Fehlt die Vorführung im Paket, steht ein Hinweis da statt des Bretts.
 */
export function Vorfuehrung(props: {
  readonly kennung: string;
  readonly beiSchliessen: () => void;
}) {
  const v = useVorfuehrung(props.kennung);
  return (
    <section
      className="abenteuer-ergebnis abenteuer-vorfuehrung"
      role="dialog"
      aria-label={tSpiel("oberwelt.vorfuehrung.titel")}
      data-testid="abenteuer-vorfuehrung"
    >
      {v === null && <p className="lade">{tSpiel("oberwelt.laedt")}</p>}
      {v === "fehlt" && <p>{tSpiel("oberwelt.vorfuehrung.fehlt")}</p>}
      {v !== null && v !== "fehlt" && <Vorfuehrbrett v={v} />}
      <button type="button" className="knopf-zweit" onClick={props.beiSchliessen}>
        {tSpiel("ergebnis.weiter")}
      </button>
    </section>
  );
}

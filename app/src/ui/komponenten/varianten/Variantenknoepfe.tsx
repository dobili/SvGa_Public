/**
 * Die Knopfzeile unter dem Brett der Variante: „Baum“ (Abzweig-Karten aufklappen), „Karte“ (der
 * ganze Baum auf eigener Seite), „Von hier spielen“ und „Abfragen“ (Stufe 4: die Variante ab der
 * gezeigten Stellung Zug für Zug spielen lassen, bildschirme/VariantenAbfrage.tsx).
 *
 * Rolle im Gesamtbild: Teil des Bildschirms „Variante“ (Entwurf, Abschnitt 3, Punkt 7: Knopfzeile
 * Markieren, Baum, Analyse, Drehen, Speichern). Markieren und Drehen stehen als Schalter am Brett,
 * „Speichern“ in der Statuszeile (Variantenmeldung.tsx); den Knopf „Analyse“ (Stufe 3, Analyseanzeige.tsx) reicht der Bildschirm
 * als ersten Knopf herein (`vorne`). Karte und Spielen brauchen eine
 * Kennung: Ein Entwurf wird vorher nach Rückfrage gespeichert und die Ansicht auf die Kennung
 * umgestellt, damit „Zurück“ zur gespeicherten Variante führt und nicht einen neuen Entwurf anlegt.
 * Abhängigkeiten: Navigation, spiel/partie.ts, spiel/probepartie.ts, variantenwert.ts,
 * Variantenkarte.tsx (Kennung), i18n, lucide-react.
 */
import type { ReactNode } from "react";
import { GraduationCap, Map as Kartensymbol, Network, Play } from "lucide-react";
import { useNavigation } from "../../../app/navigationsKontext";
import { t } from "../../../i18n/sprache";
import { spielbar } from "../../../spiel/partie";
import { alsProbewert } from "../../../spiel/probepartie";
import { ENTWURF } from "../../../training/variationsquellen";
import type { Speicherfragen } from "./useSpeicherfrage";
import type { Variantenstand } from "./useVariante";
import { abfrageAnsicht, merkePfad, varianteAnsicht } from "./variantenwert";

const SYMBOL = 18;
/** Kennung des Bildschirms „Karte“ (wie in ui/bildschirme/Variantenkarte.tsx). */
const ANSICHT_KARTE = "variantenkarte";

/**
 * „Karte“, „Von hier spielen“ und „Abfragen“ brauchen die Kennung der Variante. Ein Entwurf wird
 * dafür nur nach Rückfrage gespeichert (useSpeicherfrage.ts); danach steht die Ansicht auf der
 * Kennung, damit „Zurück“ zur gespeicherten Variante führt.
 */
function useSprungziele(stand: Variantenstand, fragen: Speicherfragen) {
  const { ersetze, navigiere } = useNavigation();
  const mitKennung = (weiter: (id: string) => void) =>
    fragen.mitKennung((id) => {
      if (stand.variation.id === ENTWURF) {
        merkePfad(id, stand.pfad);
        ersetze(varianteAnsicht(id));
      }
      weiter(id);
    });
  const karte = () =>
    mitKennung((id) => navigiere({ bildschirm: "zusatz", kennung: ANSICHT_KARTE, wert: id }));
  const spiele = () =>
    mitKennung((id) => {
      const probe = alsProbewert({ art: "variante", id, pfad: stand.pfad });
      navigiere({ bildschirm: "spielen", startFen: stand.fen, probe });
    });
  const frage = () =>
    mitKennung((id) => navigiere(abfrageAnsicht({ art: "variante", id, pfad: stand.pfad })));
  return { karte, spiele, frage };
}

/** „Abfragen“ (Stufe 4); gesperrt, solange die Variante keine Züge hat. */
function Abfrageknopf({ gesperrt, beiTipp }: { gesperrt: boolean; beiTipp: () => void }) {
  return (
    <button
      type="button"
      className="knopf-zweit"
      disabled={gesperrt}
      data-tour="variante-abfragen"
      data-testid="variante-abfragen"
      onClick={beiTipp}
    >
      <GraduationCap size={SYMBOL} aria-hidden="true" /> {t("variantenabfrage.knopf")}
    </button>
  );
}

/**
 * Die Knopfzeile. Eingaben: Stand, ob der Baum offen ist, Umschalten des Baums, ein Knopf vorne
 * (Stufe 3: „Analyse“).
 * Beispiel: „Karte“ in einem Entwurf aus Abb. 2.40 → Rückfrage, „Speichern“ → Karte geöffnet;
 * „Zurück“ auf der Karte führt zur gespeicherten Variante.
 */
export function Variantenknoepfe({
  stand,
  fragen,
  baum,
  setzeBaum,
  vorne = null,
}: {
  stand: Variantenstand;
  fragen: Speicherfragen;
  baum: boolean;
  setzeBaum: (offen: boolean) => void;
  vorne?: ReactNode;
}) {
  const { karte, spiele, frage } = useSprungziele(stand, fragen);
  return (
    <div className="knopfreihe variantenknoepfe">
      {vorne}
      <button
        type="button"
        className="knopf-zweit"
        aria-expanded={baum}
        data-tour="variante-baum"
        onClick={() => setzeBaum(!baum)}
      >
        <Network size={SYMBOL} aria-hidden="true" /> {t("varianten.baum.knopf")}
      </button>
      <button type="button" className="knopf-zweit" data-testid="kartenknopf" onClick={karte}>
        <Kartensymbol size={SYMBOL} aria-hidden="true" /> {t("varianten.karte.knopf")}
      </button>
      <button
        type="button"
        className="knopf-zweit"
        disabled={!spielbar(stand.fen)}
        data-tour="variante-spielen"
        onClick={spiele}
      >
        <Play size={SYMBOL} aria-hidden="true" /> {t("varianten.vonHierSpielen")}
      </button>
      <Abfrageknopf gesperrt={stand.variation.zuege.length === 0} beiTipp={frage} />
    </div>
  );
}

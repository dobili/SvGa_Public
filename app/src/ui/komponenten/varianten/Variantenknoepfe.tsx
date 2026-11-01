/**
 * Die Knopfzeile unter dem Brett der Variante: „Baum“ (Abzweig-Karten aufklappen), „Karte“ (der
 * ganze Baum auf eigener Seite) und „Von hier spielen“.
 *
 * Rolle im Gesamtbild: Teil des Bildschirms „Variante“ (Entwurf, Abschnitt 3, Punkt 7: Knopfzeile
 * Markieren, Baum, Analyse, Drehen, Speichern). Markieren und Drehen stehen als Schalter am Brett,
 * gespeichert wird von selbst, die Analyse folgt mit Stufe 3. Karte und Spielen brauchen eine
 * Kennung: Ein Entwurf wird vorher gespeichert und die Ansicht auf die Kennung umgestellt, damit
 * „Zurück“ zur gespeicherten Variante führt und nicht einen neuen Entwurf anlegt.
 * Abhängigkeiten: Navigation, spiel/partie.ts, spiel/probepartie.ts, variantenwert.ts,
 * Variantenkarte.tsx (Kennung), i18n, lucide-react.
 */
import { Map as Kartensymbol, Network, Play } from "lucide-react";
import { useNavigation } from "../../../app/navigationsKontext";
import { t } from "../../../i18n/sprache";
import { spielbar } from "../../../spiel/partie";
import { alsProbewert } from "../../../spiel/probepartie";
import { ENTWURF } from "../../../training/variationsquellen";
import type { Variantenstand } from "./useVariante";
import { merkePfad, varianteAnsicht } from "./variantenwert";

const SYMBOL = 18;
/** Kennung des Bildschirms „Karte“ (wie in ui/bildschirme/Variantenkarte.tsx). */
const ANSICHT_KARTE = "variantenkarte";

/**
 * „Karte“ und „Von hier spielen“; beide brauchen die Kennung der Variante. Ein Entwurf wird dafür
 * gespeichert und die Ansicht auf die Kennung umgestellt.
 */
function useSprungziele(stand: Variantenstand) {
  const { ersetze, navigiere } = useNavigation();
  const gespeichert = (): string | null => {
    if (stand.variation.id !== ENTWURF) return stand.variation.id;
    const id = stand.aendereVariation(stand.variation, "sofort");
    if (!id) return null;
    merkePfad(id, stand.pfad);
    ersetze(varianteAnsicht(id));
    return id;
  };
  const karte = () => {
    const id = gespeichert();
    if (id) navigiere({ bildschirm: "zusatz", kennung: ANSICHT_KARTE, wert: id });
  };
  const spiele = () => {
    const id = gespeichert();
    if (!id) return;
    const probe = alsProbewert({ art: "variante", id, pfad: stand.pfad });
    navigiere({ bildschirm: "spielen", startFen: stand.fen, probe });
  };
  return { karte, spiele };
}

/**
 * Die Knopfzeile. Eingaben: Stand, ob der Baum offen ist, Umschalten des Baums.
 * Beispiel: „Karte“ in einem Entwurf aus Abb. 2.40 → Variante gespeichert, Karte geöffnet;
 * „Zurück“ auf der Karte führt zur gespeicherten Variante.
 */
export function Variantenknoepfe({
  stand,
  baum,
  setzeBaum,
}: {
  stand: Variantenstand;
  baum: boolean;
  setzeBaum: (offen: boolean) => void;
}) {
  const { karte, spiele } = useSprungziele(stand);
  return (
    <div className="knopfreihe variantenknoepfe">
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
    </div>
  );
}

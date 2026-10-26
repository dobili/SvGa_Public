/**
 * Zeichen für Zusatzinhalte an den kleinen Brettern der Kapitelübersicht, mit Legende (seit
 * 0.2.99, Wunsch des Autors vom 19.10.2026).
 *
 * Rolle im Gesamtbild: Manche Abbildungen tragen Warum-Fragen (AP 14, WarumFrage.tsx), die erst
 * erscheinen, wenn die Abbildung als angesehen gilt. Oben rechts am kleinen Brett zeigt ein
 * Sprechblasen-Zeichen, dass es dort noch etwas zu tun gibt: grau mit Schloss, solange die Frage
 * noch verborgen ist; gold, wenn sie bereitsteht; grün mit Haken, wenn alle Fragen der Abbildung
 * beantwortet sind. Die Legende über der Galerie erklärt die drei Zeichen; der Fortschritt zählt
 * beantwortete Fragen (speicher/fortschritt.ts).
 * Abhängigkeiten: analyse/warumfragen.ts, speicher, i18n, lucide-react.
 */
import { Check, LockKeyhole, MessageCircleQuestionMark } from "lucide-react";
import { fragenJeAbbildung, warumFragen } from "../../../analyse/warumfragen";
import type { Abbildung, Kapitel } from "../../../daten/laden";
import { t } from "../../../i18n/sprache";
import { beantworteteFragen } from "../../../speicher/fortschritt";
import { useSpeicher } from "../../../speicher/speicher";

/** Größe des Zeichens (Bildpunkte). */
const ZEICHENGROESSE = 14;

export type Zusatzstand = "gesperrt" | "offen" | "erledigt";

/** Das Zeichen eines Zustands, ohne Beschriftung (für Galerie und Legende). */
function Zeichen({ stand }: { stand: Zusatzstand }) {
  const Bild =
    stand === "gesperrt" ? LockKeyhole : stand === "erledigt" ? Check : MessageCircleQuestionMark;
  return (
    <span className={`zusatzzeichen zusatz-${stand}`} aria-hidden="true">
      <Bild size={ZEICHENGROESSE} />
    </span>
  );
}

/**
 * Das Zeichen oben rechts an einer Abbildung mit Warum-Fragen; nichts ohne Fragen.
 * Beispiel: Abb. 1.26 noch nicht angesehen → graues Schloss „Warum-Frage, erscheint nach dem
 * Ansehen“.
 */
export function Zusatzsymbol({ abbildung }: { abbildung: Abbildung }) {
  const anzahl = warumFragen(abbildung.vorbereitet).length;
  const stand = useSpeicher((z): Zusatzstand => {
    const f = z.daten.fortschritt;
    if (f.gesehen[abbildung.id] === undefined) return "gesperrt";
    return beantworteteFragen(f, abbildung.id, anzahl) >= anzahl ? "erledigt" : "offen";
  });
  if (anzahl === 0) return null;
  const text = t(`zusatz.${stand}`);
  return (
    <span className="kachel-zusatz" role="img" aria-label={text} title={text}>
      <Zeichen stand={stand} />
    </span>
  );
}

/** Die Legende über der Galerie, nur wenn das Kapitel Warum-Fragen hat. */
export function Zusatzlegende({ kapitel }: { kapitel: Kapitel }) {
  if (Object.keys(fragenJeAbbildung(kapitel.abbildungen)).length === 0) return null;
  const staende: readonly Zusatzstand[] = ["gesperrt", "offen", "erledigt"];
  return (
    <ul className="zusatzlegende" aria-label={t("zusatz.legende")}>
      {staende.map((stand) => (
        <li key={stand}>
          <Zeichen stand={stand} />
          {t(`zusatz.${stand}`)}
        </li>
      ))}
    </ul>
  );
}

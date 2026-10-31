/**
 * Kachel eines Extras in der Profilkarte „Deine Extras“ (Entwurf E1 „Ankleide“, 31.10.2026).
 *
 * Rolle im Gesamtbild: Antippen legt an (Haken in der Ecke, goldener Rand, „Angelegt“), erneutes
 * Antippen legt ab; es gibt keine Knöpfe „Wählen“/„Ablegen“ mehr. Gesperrte Extras zeigen die
 * echte Vorschau abgedunkelt mit Schloss (Sperrbild.tsx), darunter die Bedingung und, wo sie
 * zählbar ist, einen kleinen Balken (extrafortschritt.ts). Für Bildschirmleser ein Umschaltknopf
 * (aria-pressed) mit Namen und Zustand; gesperrt aria-disabled, damit er erreichbar bleibt und
 * die Bedingung vorliest.
 * Abhängigkeiten: training/extras.ts, extratexte.ts, extrafortschritt.ts, Extravorschau.tsx,
 * bausteine/Sperrbild.tsx, i18n, lucide-react.
 */
import { Check } from "lucide-react";
import { t } from "../../../i18n/sprache";
import type { Extra, Extralage } from "../../../training/extras";
import { Sperrbild } from "../bausteine/Sperrbild";
import { extrafortschritt } from "./extrafortschritt";
import { bedingungstext, extraname, kurzname } from "./extratexte";
import { Extravorschau, type Vorschaukontext } from "./Extravorschau";

/** Größe des Hakens in der Ecke. */
const HAKENGROESSE = 15;
/** Prozent für die Breite des Balkens. */
const HUNDERT = 100;

/** Zustand einer Kachel: angelegt, frei (antippen legt an) oder gesperrt. */
export type Kachelzustand = "angelegt" | "frei" | "gesperrt";

/** Zeile unter dem Namen und Name für Bildschirmleser je Zustand. */
function texte(extra: Extra, zustand: Kachelzustand, lage: Extralage) {
  const name = extraname(extra);
  if (zustand === "angelegt") {
    return { zeile: t("extrasneu.angelegt"), label: t("extrasneu.knopf.angelegt", { name }) };
  }
  if (zustand === "frei") {
    return { zeile: t("extrasneu.anlegen"), label: t("extrasneu.knopf.frei", { name }) };
  }
  const bedingung = bedingungstext(extra.bedingung);
  const stand = extrafortschritt(extra.bedingung, lage);
  const zusatz = stand ? t("extrasneu.fortschritt", { ...stand }) : "";
  return {
    zeile: bedingung,
    label: t("extrasneu.knopf.gesperrt", { name, bedingung: `${bedingung} ${zusatz}`.trim() }),
  };
}

/** Kleiner Balken bis zur Bedingung (Schmuck; der Stand steht im Namen des Knopfes). */
function Balken({ extra, lage }: { extra: Extra; lage: Extralage }) {
  const stand = extrafortschritt(extra.bedingung, lage);
  if (!stand) return null;
  return (
    <span className="extrakachel-balken" aria-hidden="true">
      <i style={{ width: `${(stand.erreicht / stand.ziel) * HUNDERT}%` }} />
    </span>
  );
}

/**
 * Eine Kachel. `beiTipp` legt an oder ab; bei gesperrten Kacheln geschieht nichts.
 * Beispiel: Rahmen Gold bei Stufe 6 → dunkles Porträt mit Goldrahmen, Schloss, „Ab Stufe 9“.
 */
export function Extrakachel({
  extra,
  zustand,
  lage,
  kontext,
  beiTipp,
}: {
  extra: Extra;
  zustand: Kachelzustand;
  lage: Extralage;
  kontext: Vorschaukontext;
  beiTipp: () => void;
}) {
  const gesperrt = zustand === "gesperrt";
  const { zeile, label } = texte(extra, zustand, lage);
  return (
    <li>
      <button
        type="button"
        className={`extrakachel extrakachel-${zustand}`}
        aria-pressed={zustand === "angelegt"}
        aria-disabled={gesperrt || undefined}
        aria-label={label}
        data-testid={`extra-${extra.kennung}`}
        onClick={gesperrt ? undefined : beiTipp}
      >
        {zustand === "angelegt" && (
          <span className="extrakachel-haken" aria-hidden="true">
            <Check size={HAKENGROESSE} strokeWidth={3} />
          </span>
        )}
        <Sperrbild gesperrt={gesperrt}>
          <Extravorschau extra={extra} kontext={kontext} />
        </Sperrbild>
        <span className="extrakachel-name">{kurzname(extra)}</span>
        <span className="extrakachel-zeile">{zeile}</span>
        {gesperrt && <Balken extra={extra} lage={lage} />}
      </button>
    </li>
  );
}

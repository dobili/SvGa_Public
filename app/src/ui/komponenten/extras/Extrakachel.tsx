/**
 * Kachel eines Extras in der Profilkarte „Dein Aussehen“ (Entwurf E1 „Ankleide“, 31.10.2026),
 * dazu die Kachel eines immer freien Werts (Grundkachel: Brett „Grün“, Figuren „Merida“ …).
 *
 * Rolle im Gesamtbild: Antippen legt an (Haken in der Ecke, goldener Rand, „Angelegt“), erneutes
 * Antippen legt ab; es gibt keine Knöpfe „Wählen“/„Ablegen“ mehr. Gesperrte Extras zeigen die
 * echte Vorschau abgedunkelt mit Schloss (Sperrbild.tsx), darunter die Bedingung und, wo sie
 * zählbar ist, einen kleinen Balken (extrafortschritt.ts). Für Bildschirmleser ein Umschaltknopf
 * (aria-pressed) mit Namen und Zustand; gesperrt aria-disabled, damit er erreichbar bleibt und
 * die Bedingung vorliest. Seit „Aussehen im Profil“ (Wunsch des Autors, 7.11.2026) stehen alle
 * Bretter und Figurensätze in dieser Karte; die immer freien zeigt `Grundkachel` im selben
 * Aussehen. Sie lassen sich nicht ablegen, nur durch einen anderen Wert ersetzen.
 * Abhängigkeiten: training/extras.ts, extratexte.ts, extrafortschritt.ts, Extravorschau.tsx,
 * bausteine/Sperrbild.tsx, i18n, lucide-react.
 */
import { Check } from "lucide-react";
import { t } from "../../../i18n/sprache";
import type { Extra, Extraart, Extralage } from "../../../training/extras";
import { Sperrbild } from "../bausteine/Sperrbild";
import { extrafortschritt } from "./extrafortschritt";
import { bedingungstext, extraname, kurzname, wertname } from "./extratexte";
import { Extravorschau, Wertvorschau, type Vorschaukontext } from "./Extravorschau";

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

/**
 * Kachel eines immer freien Werts (kein Extra): Vorschau, Name, „Angelegt“ oder „Antippen zum
 * Anlegen“. Ein Tipp auf die gewählte Kachel ändert nichts (es gibt nichts abzulegen).
 * Beispiel: („brett“, „gruen“) → Brettausschnitt in Grün, „Grün“.
 */
export function Grundkachel({
  art,
  wert,
  gewaehlt,
  kontext,
  beiTipp,
}: {
  art: Extraart;
  wert: string;
  gewaehlt: boolean;
  kontext: Vorschaukontext;
  beiTipp: () => void;
}) {
  const name = wertname(art, wert);
  return (
    <li>
      <button
        type="button"
        className={`extrakachel extrakachel-${gewaehlt ? "angelegt" : "frei"}`}
        aria-pressed={gewaehlt}
        aria-label={t(gewaehlt ? "extrasneu.knopf.gewaehlt" : "extrasneu.knopf.frei", { name })}
        data-testid={`wahl-${art}-${wert}`}
        onClick={gewaehlt ? undefined : beiTipp}
      >
        {gewaehlt && (
          <span className="extrakachel-haken" aria-hidden="true">
            <Check size={HAKENGROESSE} strokeWidth={3} />
          </span>
        )}
        {/* Dieselbe Hülle wie bei den Extras, damit alle Kacheln gleich groß sind. */}
        <Sperrbild gesperrt={false}>
          <Wertvorschau art={art} wert={wert} kontext={kontext} />
        </Sperrbild>
        <span className="extrakachel-name">{name}</span>
        <span className="extrakachel-zeile">
          {t(gewaehlt ? "extrasneu.angelegt" : "extrasneu.anlegen")}
        </span>
      </button>
    </li>
  );
}

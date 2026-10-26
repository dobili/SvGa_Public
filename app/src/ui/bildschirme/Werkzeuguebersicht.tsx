/**
 * Bildschirm „Werkzeuge des Buches“: alle Werkzeuge nach Kapiteln, je mit Bedienung und Regel.
 *
 * Rolle im Gesamtbild: Wunsch des Autors vom 19.10.2026, Nachschlagen zu prüfen. An einer
 * Abbildung erklärt sich ein Werkzeug hinter dem Fragezeichen der Werkzeugkarte; wer nachlesen
 * will, was „Skelett-Röntgen“ oder „Planbilanz“ prüft, findet hier die Übersicht: alle Werkzeuge
 * aus dem Verzeichnis (analyse/register.ts) in der Reihenfolge ihrer Einführung, mit denselben
 * Texten wie an der Abbildung und dem Zeichen wie am Brett oder in der Werkzeugleiste (DS28);
 * ein Knopf öffnet das Kapitel, das sie einführt.
 * Abhängigkeiten: analyse/register.ts, daten/laden.ts, buendelsymbole.ts, werkzeugordnung.ts,
 * Kopfzeile, Navigation, i18n, lucide-react.
 */
import { Calculator, ScanEye, TriangleAlert, Wrench, type LucideIcon } from "lucide-react";
import { createElement } from "react";
import { werkzeugeFuer } from "../../analyse/register";
import type { Werkzeug } from "../../analyse/werkzeug";
import { useNavigation } from "../../app/navigationsKontext";
import { ladeIndex } from "../../daten/laden";
import { t } from "../../i18n/sprache";
import { Kopfzeile } from "../komponenten/rahmen/Kopfzeile";
import { useDaten } from "../komponenten/bausteine/useDaten";
import { BUENDELSYMBOL } from "../komponenten/werkzeugwahl/buendelsymbole";
import { buendelMit } from "../komponenten/werkzeugwahl/werkzeugordnung";

/** Größe des Werkzeugzeichens (Bildpunkte). */
const WERKZEUGZEICHEN = 18;
/** Letztes Kapitel des Buches: Bis hierhin sind alle Werkzeuge freigeschaltet. */
const LETZTES_KAPITEL = 12;

/** Die Werkzeuge nach dem Kapitel ihrer Einführung, in der Reihenfolge des Buches. */
function nachKapiteln(): readonly (readonly [number, readonly Werkzeug[]])[] {
  const gruppen = new Map<number, Werkzeug[]>();
  for (const werkzeug of werkzeugeFuer(LETZTES_KAPITEL)) {
    gruppen.set(werkzeug.kapitel, [...(gruppen.get(werkzeug.kapitel) ?? []), werkzeug]);
  }
  return [...gruppen.entries()].sort(([a], [b]) => a - b);
}

/**
 * Zeichen eines Werkzeugs wie am Brett (Zählen, Röntgen, Warnsignale) oder wie sein Bündel in der
 * Werkzeugleiste (Symbolsprache DS28). Beispiel: „Skelett-Röntgen“ → Knochen des Bündels Skelett.
 */
function bildVon(werkzeug: Werkzeug): LucideIcon {
  if (werkzeug.id === "k1-zaehlen") return Calculator;
  if (werkzeug.id === "k1-roentgen") return ScanEye;
  if (werkzeug.id.endsWith("warnsignale")) return TriangleAlert;
  const buendel = buendelMit(werkzeug.id)[0];
  return buendel ? BUENDELSYMBOL[buendel] : Wrench;
}

function Eintrag({ werkzeug }: { werkzeug: Werkzeug }) {
  return (
    <details className="werkzeugeintrag">
      <summary>
        {createElement(bildVon(werkzeug), {
          className: "werkzeugzeichen",
          size: WERKZEUGZEICHEN,
          "aria-hidden": true,
        })}
        {t(werkzeug.name)}
      </summary>
      <p>{t(werkzeug.erklaerung)}</p>
      <p className="hinweis">{t(werkzeug.regel)}</p>
    </details>
  );
}

/**
 * Der Bildschirm „Werkzeuge des Buches“: alle Werkzeuge nach Kapiteln mit Bedienung und Regel, je
 * mit Knopf zum einführenden Kapitel.
 */
export function Werkzeuguebersicht() {
  const { navigiere } = useNavigation();
  const index = useDaten(ladeIndex, "index");
  const titel = (nummer: number) =>
    index.art === "fertig"
      ? (index.wert.kapitel.find((k) => k.kapitel === nummer)?.titel ?? "")
      : "";
  return (
    <div className="bildschirm">
      <Kopfzeile titel={t("werkzeuge.titel")} zurueckText={t("nachschlagen.titel")} />
      <p className="hinweis">{t("werkzeuge.einleitung")}</p>
      {nachKapiteln().map(([kapitel, werkzeuge]) => (
        <section key={kapitel} className="karte" data-tour="werkzeuge-kapitel">
          <h2 className="karte-titel">
            {t("werkzeuge.kapitel", { nummer: kapitel, titel: titel(kapitel) })}
          </h2>
          {werkzeuge.map((w) => (
            <Eintrag key={w.id} werkzeug={w} />
          ))}
          <button
            type="button"
            className="knopf-link"
            onClick={() => navigiere({ bildschirm: "kapitel", nummer: kapitel })}
          >
            {t("werkzeuge.zumKapitel", { nummer: kapitel })}
          </button>
        </section>
      ))}
    </div>
  );
}

/**
 * Das Glanzstück oben in „Deine Erfolge“ (Entwurf C mit der Notiz des Autors, 31.10.2026): das
 * zuletzt verdiente Stück, flach. In der Mitte das Bild mit dem Namen darunter, links „Zuletzt
 * verdient“ mit Datum, rechts der kurze Satz zur Bedingung und „Teilen“. Ohne verdientes Stück
 * steht ein freundlicher Hinweis auf das nächste erreichbare Stück.
 *
 * Rolle im Gesamtbild: Teil der Karte Erfolge.tsx; Datum aus „verdient“ (useErfolge.ts), Teilen
 * über teilen/Stueckteilen.tsx (P9).
 * Ein Tipp auf das Bild öffnet das Infofenster (Infofenster.tsx, 31.10.2026).
 * Abhängigkeiten: erfolgsstuecke.ts (Typ), Stueckbild.tsx, Infofenster.tsx,
 * teilen/Stueckteilen.tsx, i18n.
 */
import { useState } from "react";
import { datumText, t } from "../../../i18n/sprache";
import { AbzeichenTeilen, OrdenTeilen } from "../teilen/Stueckteilen";
import { glanzname, type Erfolgsstueck } from "./erfolgsstuecke";
import { Infofenster } from "./Infofenster";
import { Stueckbild } from "./Stueckbild";

/** Teilen je Art. */
function Teilen({ stueck }: { stueck: Erfolgsstueck }) {
  if (stueck.art === "orden" && stueck.ring) {
    return <OrdenTeilen ring={stueck.ring} name={glanzname(stueck)} />;
  }
  return <AbzeichenTeilen kennung={stueck.kennung} />;
}

/**
 * Das zuletzt verdiente Stück. Beispiel: Teil Endspiel am 30.10.2026 → links „Zuletzt verdient
 * 30.10.2026“, Mitte Orden „Teil Endspiel“, rechts „Teil Endspiel: alle Abbildungen …“, Teilen.
 */
export function Glanzstueck({ stueck, datum }: { stueck: Erfolgsstueck; datum: string }) {
  const [offen, setzeOffen] = useState(false);
  return (
    <div className="glanzstueck" data-testid="erfolge-glanzstueck">
      <p className="glanzstueck-links">
        <span>{t("profil.erfolge.zuletzt")}</span>
        <span className="glanzstueck-datum">{datumText(new Date(datum))}</span>
      </p>
      <button
        type="button"
        className="glanzstueck-mitte glanzstueck-knopf"
        aria-haspopup="dialog"
        onClick={() => setzeOffen(true)}
      >
        <Stueckbild stueck={stueck} klasse="erfolg-glanz" />
        <span className="glanzstueck-name">{glanzname(stueck)}</span>
      </button>
      <div className="glanzstueck-rechts">
        <p>{stueck.bedingung}</p>
        <Teilen stueck={stueck} />
      </div>
      {offen && <Infofenster stuecke={[stueck]} beiSchliessen={() => setzeOffen(false)} />}
    </div>
  );
}

/**
 * Ohne verdientes Stück: ein Hinweis auf das nächste. Beispiel: „Dein erstes Stück wartet:
 * Erste Partie. Spiele eine Partie zu Ende.“ (sinngemäß). Ohne nächstes Stück ein allgemeiner Satz.
 */
export function ErstesStueck({ naechstes }: { naechstes: Erfolgsstueck | null }) {
  return (
    <div className="glanzstueck glanzstueck-leer" data-testid="erfolge-erstes">
      {naechstes && <Stueckbild stueck={naechstes} klasse="erfolg-klein" />}
      <p>
        {naechstes
          ? t("profil.erfolge.erstes", { name: naechstes.name, bedingung: naechstes.bedingung })
          : t("profil.erfolge.erstesAllgemein")}
      </p>
    </div>
  );
}

/**
 * Das Glanzstück oben in „Deine Erfolge“ (Entwurf C mit der Notiz des Autors, 31.10.2026): das
 * zuletzt verdiente Stück, flach. In der Mitte das Bild mit dem Namen darunter, links „Zuletzt
 * verdient“ mit Datum, rechts der kurze Satz zur Bedingung und „Teilen“. Ohne verdientes Stück
 * steht ein freundlicher Hinweis auf das nächste erreichbare Stück.
 *
 * Rolle im Gesamtbild: Teil der Karte Erfolge.tsx; Datum aus „verdient“ (useErfolge.ts), Teilen
 * über teilen/Stueckteilen.tsx (P9).
 * Abhängigkeiten: erfolgsstuecke.ts (Typ), Stueckbild.tsx, teilen/Stueckteilen.tsx, i18n.
 */
import { datumText, t } from "../../../i18n/sprache";
import { AbzeichenTeilen, OrdenTeilen } from "../teilen/Stueckteilen";
import type { Erfolgsstueck } from "./erfolgsstuecke";
import { Stueckbild } from "./Stueckbild";

/** Name im Glanzstück: Teile des Buches mit „Teil“ davor („Teil Endspiel“), sonst der Name. */
function glanzname(stueck: Erfolgsstueck): string {
  return stueck.ring?.startsWith("ich-teil-")
    ? t("startorden.teil", { teil: stueck.name })
    : stueck.name;
}

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
  return (
    <div className="glanzstueck" data-testid="erfolge-glanzstueck">
      <p className="glanzstueck-links">
        <span>{t("profil.erfolge.zuletzt")}</span>
        <span className="glanzstueck-datum">{datumText(new Date(datum))}</span>
      </p>
      <div className="glanzstueck-mitte">
        <Stueckbild stueck={stueck} klasse="erfolg-glanz" />
        <span className="glanzstueck-name">{glanzname(stueck)}</span>
      </div>
      <div className="glanzstueck-rechts">
        <p>{stueck.bedingung}</p>
        <Teilen stueck={stueck} />
      </div>
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

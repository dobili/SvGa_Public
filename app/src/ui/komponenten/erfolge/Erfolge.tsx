/**
 * Karte „Deine Erfolge“ im Profil (Profil neu, Entwurf C „Glanzstück und Regale“, Wahl des Autors
 * 31.10.2026): oben flach das zuletzt verdiente Stück, darunter „Als Nächstes“, dann je Bereich
 * ein Regal zum Wischen (Buch, Teile des Buches, Bots, Abzeichen und spätere).
 *
 * Rolle im Gesamtbild: Sammelt Orden und Abzeichen, die vorher in „Dein Fortschritt“ als Ringe und
 * als aufklappbares Gitter standen. Jede Stelle zeigt am Anfang nur, was schon etwas bedeutet: ohne
 * verdientes Stück ein Hinweis auf das erste, unter „Als Nächstes“ nur Zählbares. Die Erklärung
 * zu Abzeichen und Erfahrungspunkten steht aufklappbar am Ende.
 * Abhängigkeiten: useErfolge.ts, Glanzstueck.tsx, AlsNaechstes.tsx, Regal.tsx, i18n,
 * Stil in ui/stil/erfolge.css.
 */
import { t } from "../../../i18n/sprache";
import "../../stil/erfolge.css";
import { Titelsymbol } from "../bausteine/Titelsymbol";
import { AlsNaechstes } from "./AlsNaechstes";
import { ErstesStueck, Glanzstueck } from "./Glanzstueck";
import { Regal } from "./Regal";
import { useErfolge } from "./useErfolge";

/** Die Karte; nichts, solange Index und Speicher laden. */
export function Erfolge() {
  const stand = useErfolge();
  if (!stand) return null;
  return (
    <section className="karte erfolge" data-testid="erfolge">
      <div className="karte-kopf">
        <h2 className="karte-titel">
          <Titelsymbol art="erfolge" />
          {t("profil.erfolge.titel")}
        </h2>
        <span className="regal-zaehler" data-testid="erfolge-zaehler">
          {t("fortschritt.anteil", { erreicht: stand.verdient, gesamt: stand.gesamt })}
        </span>
      </div>
      {stand.zuletzt ? (
        <Glanzstueck stueck={stand.zuletzt.stueck} datum={stand.zuletzt.datum} />
      ) : (
        <ErstesStueck naechstes={stand.naechste[0] ?? null} />
      )}
      <AlsNaechstes stuecke={stand.naechste} />
      {stand.regale.map(({ regal, stuecke }) => (
        <Regal key={regal.kennung} regal={regal} stuecke={stuecke} />
      ))}
      <details className="anleitung">
        <summary>{t("profil.erfolge.erklaerungTitel")}</summary>
        <p className="hinweis">{t("abzeichen.erklaerung")}</p>
        <p className="hinweis">{t("erfahrung.erklaerung")}</p>
      </details>
    </section>
  );
}

/**
 * Laufende Partie zum Fortsetzen und die letzten beendeten Partien (Bereich Spielen).
 *
 * Rolle im Gesamtbild: Die laufende Partie übersteht das Schließen der App (Speicher Format 2);
 * hier geht es mit einem Tipp weiter. Beendete Partien öffnen den Partie-Bildschirm mit Ergebnis,
 * Auswertung und PGN (Pflichtenheft 5.3).
 * Abhängigkeiten: spiel/partie.ts, speicher/partien.ts, engine/stufen.ts, Navigation, i18n.
 */
import { useNavigation } from "../../app/navigationsKontext";
import { stufe } from "../../engine/stufen";
import { t } from "../../i18n/sprache";
import type { Partie } from "../../spiel/partie";
import type { Partieeintrag } from "../../speicher/partien";
import { kurzergebnis } from "./partietexte";

/** So viele beendete Partien zeigt die Liste; gespeichert sind bis zu 50. */
const SICHTBAR = 10;

/** „15.10.2026 · Stufe 2 · 23 Züge“ */
function zeile(partie: Partie): string {
  const datum = new Date(partie.begonnen).toLocaleDateString("de-DE");
  const zuege = Math.ceil(partie.zuege.length / 2);
  const s = stufe(partie.einstellung.stufe);
  return t("spielen.partiezeile", { datum, stufe: t(s.name), zuege });
}

export function LaufendePartie({ partie }: { partie: Partie }) {
  const { navigiere } = useNavigation();
  return (
    <section className="karte laufende-partie" data-testid="laufende-partie">
      <h2 className="karte-titel">{t("spielen.laufend")}</h2>
      <p>{zeile(partie)}</p>
      <button
        type="button"
        className="knopf-haupt"
        onClick={() => navigiere({ bildschirm: "partie", id: partie.id })}
      >
        {t("spielen.fortsetzen")}
      </button>
    </section>
  );
}

export function Partienliste({ partien }: { partien: readonly Partieeintrag[] }) {
  const { navigiere } = useNavigation();
  if (partien.length === 0) return null;
  return (
    <section className="abschnitt partienliste">
      <h2 className="abschnitt-titel">{t("spielen.partien")}</h2>
      <ul className="begriffsliste">
        {partien.slice(0, SICHTBAR).map(({ partie }) => (
          <li key={partie.id}>
            <button
              type="button"
              className="begriff-knopf"
              onClick={() => navigiere({ bildschirm: "partie", id: partie.id })}
            >
              <strong>{kurzergebnis(partie)}</strong>
              <span>{zeile(partie)}</span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

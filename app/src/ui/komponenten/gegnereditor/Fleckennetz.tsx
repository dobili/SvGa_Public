/**
 * Blinde Flecken eines eigenen Gegners oder der eigenen Stufe als Spinnennetz über fünf Gruppen
 * (Netz-Vorschau E4 und Auftrag „Variante A“, vom Autor am 25.10.2026 freigegeben).
 *
 * Rolle im Gesamtbild: Die Flecken einzeln messen bei Spielern kaum etwas, als Gruppen tragen sie
 * (Auswertung des Koordinierungschats): ruhige Züge, Bauernzüge, Rückzüge (mit den Springern),
 * Fernwirkung (Läufer, Turm, Dame, Röntgen) und Wendungen (Zwischenzug, Abzug, Grundreihe). Eine
 * Gruppe an heißt alle Mitglieder an; gespeichert wird je Fleck. Ohne Feinregler, weil es nur
 * fünf Gruppen gibt. Darunter je eingeschalteter Gruppe ein Satz, was der Gegner übersieht.
 * Abhängigkeiten: fehlergruppen.ts, Profilnetz.tsx, Fehlerprofil.tsx (Vorlagen), i18n.
 */
import type { EigenerGegner } from "../../../engine/gegner";
import { t } from "../../../i18n/sprache";
import { Vorlagenreihe } from "./Fehlerprofil";
import {
  FLECKENGRUPPEN,
  FLECKENVORLAGEN,
  gruppenstufe,
  istFleckenvorlage,
  mitFleckenvorlage,
  setzeGruppe,
  type Fleckenvorlage,
} from "./fehlergruppen";
import { stufenwort } from "./fehlerprofil";
import { MitInfo } from "../bausteine/InfoKnopf";
import { Profilnetz } from "./Profilnetz";

/**
 * Netz, Vorlagen und die Sätze der eingeschalteten Gruppen.
 * Beispiel: Vorlage „Kurzsichtig“ → Fernwirkung „sehr oft“, Wendungen „oft“, Rest „normal“.
 */
export function Fleckennetz({ g, setze }: { g: EigenerGegner; setze: (g: EigenerGegner) => void }) {
  const achsen = FLECKENGRUPPEN.map((gr) => ({
    kennung: gr.kennung,
    name: t(`spielen.profil.fleckgruppe.${gr.kennung}`),
  }));
  const werte = FLECKENGRUPPEN.map((gr) => gruppenstufe(g, gr.flecken));
  const an = FLECKENGRUPPEN.filter((_, i) => werte[i] !== null && werte[i] !== undefined);
  const namen = Object.keys(FLECKENVORLAGEN) as Fleckenvorlage[];
  return (
    <div className="fleckennetz" data-testid="blinde-flecken">
      {/* Seit 0.2.137 Erklärung und Legende hinter dem Fragezeichen. */}
      <MitInfo
        thema={t("spielen.profil.netzFlecken")}
        zeile={<span className="einstellung-name">{t("spielen.profil.netzFlecken")}</span>}
        erklaerung={
          <>
            <p>{t("spielen.profil.fleckenHinweis")}</p>
            <p>{t("spielen.profil.normalLegende")}</p>
          </>
        }
      />
      <Vorlagenreihe
        namen={namen}
        aktiv={(n) => istFleckenvorlage(g, n)}
        waehle={(n) => setze(mitFleckenvorlage(g, n))}
        text={(n) => t(`spielen.profil.fleckvorlage.${n}`)}
      />
      <Profilnetz
        name={t("spielen.profil.netzFlecken")}
        achsen={achsen}
        werte={werte}
        testid="fleckennetz"
        beiWahl={(i, s) => {
          const gruppe = FLECKENGRUPPEN[i];
          if (gruppe) setze(setzeGruppe(g, gruppe.flecken, s));
        }}
      />
      <div className="hinweis" data-testid="flecken-text">
        {an.length === 0 ? (
          <p>{t("spielen.profil.fleckenKeine")}</p>
        ) : (
          an.map((gr) => (
            <p key={gr.kennung}>
              <strong>
                {t(`spielen.profil.fleckgruppe.${gr.kennung}`)} (
                {stufenwort(gruppenstufe(g, gr.flecken))}):
              </strong>{" "}
              {t(`spielen.profil.fleckgruppe.${gr.kennung}.satz`)}
            </p>
          ))
        )}
      </div>
    </div>
  );
}

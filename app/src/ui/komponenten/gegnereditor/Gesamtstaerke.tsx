/**
 * Geschätzte Stärke der ganzen Einstellung eines eigenen Gegners oder der eigenen Stufe, über den
 * Reitern Stärke, Stil, Fehler, Flecken (seit 0.2.137, Wunsch des Autors vom 25.10.2026).
 *
 * Rolle im Gesamtbild: Bis 0.2.136 stand die Schätzung nur im Reiter „Fehler“ (Fehlerprofil.tsx),
 * obwohl auch Stärke je Phase, Flecken und Stil die Spielstärke betreffen. Jetzt steht sie einmal
 * über allen Reitern: die Zahl aus den Stufen je Phase (engine/botstaerke.ts, staerkeGeschaetzt),
 * daneben das Urteil über die Menschlichkeit von Fehlern und Flecken. Die langen Sätze (Anteil der
 * Spieler, Richtung, was in die Zahl eingeht) stehen hinter dem Fragezeichen.
 * Abhängigkeiten: engine/botstaerke.ts, engine/eigenstufen.ts, fehlerprofil.ts, InfoKnopf, i18n.
 */
import { staerkeGeschaetzt } from "../../../engine/botstaerke";
import { menschlichkeit, staerkerichtung } from "../../../engine/eigenstufen";
import type { EigenerGegner } from "../../../engine/gegner";
import { t } from "../../../i18n/sprache";
import { aktuelleStufen } from "./fehlerprofil";
import { MitInfo } from "../bausteine/InfoKnopf";
import { staerketext } from "../gegner/staerkeangabe";

const PROZENT = 100;
/** Ab diesem Anteil ganze Prozent, darunter eine Nachkommastelle. */
const GANZE_PROZENT_AB = 0.01;

/**
 * Zahl, Urteil und Erklärung. Beispiel: Stufen 1 · 1 · 1, Vorlage „Leichtsinnig“ → „etwa 750
 * geschätzt · Ungewöhnlich.“, hinter dem Fragezeichen „Etwa 0,3 % der Spieler …“.
 */
export function Gesamtstaerke({ g }: { g: EigenerGegner }) {
  const stufen = aktuelleStufen(g);
  const m = menschlichkeit(stufen);
  const zahl = staerkeGeschaetzt(g);
  const anteil =
    m.anteil >= GANZE_PROZENT_AB
      ? `${Math.round(m.anteil * PROZENT)} %`
      : `${(m.anteil * PROZENT).toFixed(1).replace(".", ",")} %`;
  return (
    <div className="profilkopf" data-testid="menschlichkeit" data-urteil={m.urteil}>
      <MitInfo
        thema={t("spielen.profil.staerkeThema")}
        zeile={
          <span className="profilkopf-zeile">
            <span className="profilkopf-staerke">
              <strong data-testid="gesamtstaerke">{staerketext(zahl)}</strong>
              <span className="hinweis">{t("spielen.profil.geschaetzt")}</span>
            </span>
            <span className={`urteilsmarke urteil-${m.urteil}`}>
              {t(`spielen.eigene.menschlich.${m.urteil}`)}
            </span>
          </span>
        }
        erklaerung={
          <>
            <p>
              {m.urteil === "unmenschlich"
                ? t("spielen.eigene.menschlich.unmenschlichText", {
                    anzahl: String(m.unmenschlich),
                  })
                : t("spielen.eigene.menschlich.anteil", { anteil })}{" "}
              {t(`spielen.eigene.richtung.${staerkerichtung(stufen, zahl)}`)}
            </p>
            <p>{t("spielen.profil.staerkeErklaerung")}</p>
          </>
        }
      />
    </div>
  );
}

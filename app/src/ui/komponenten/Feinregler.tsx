/**
 * Feinregler des Fehlerprofils: Fehlerhäufigkeit, unmenschliche Werte, die neun Regler je Achse
 * mit Höchstverlust und der Schalter „setzt nie Patt“ (seit 0.2.135, Netz-Vorschau E1 und E3).
 *
 * Rolle im Gesamtbild: Hinter dem Haken „Feinregler für jede Fehlerart“ unter dem Netz
 * (Fehlerprofil.tsx). Das Netz bleibt dann grau und zeigt den Mittelwert, damit sich nichts
 * widerspricht. Die Säulen sind die von 0.2.131 (Stufenschalter.tsx); „Eröffnungsfehler“
 * schreibt in frühe Dame, Tempoverlust und Bauernraub zugleich (Auftrag „Variante A“).
 * Abhängigkeiten: fehlergruppen.ts, fehlerprofil.ts, Stufenschalter.tsx, i18n, lucide-react.
 */
import { BookOpen, ChessPawn, Crown, Gem, Zap, type LucideIcon } from "lucide-react";
import { useState } from "react";
import type { EigenerGegner } from "../../engine/gegner";
import { t } from "../../i18n/sprache";
import { HAEUFIGKEIT_HOECHSTENS } from "../../speicher/menschenwerte";
import {
  artenDesReglers,
  FEHLERACHSEN,
  gruppenstufe,
  mitNiePatt,
  reglername,
  setzeGruppe,
  setztNiePatt,
  type Achsenkennung,
  type Reglerkennung,
} from "./fehlergruppen";
import { setzeVerlust, verlustVon, verlusttext } from "./fehlerprofil";
import { AnAusSchalter, Stufenschalter, Verlustwahl } from "./Stufenschalter";

const PROZENT = 100;
const SCHRITT_HAEUFIGKEIT = 0.1;
const ZEICHENGROESSE = 18;

const ACHSENZEICHEN: Readonly<Record<Achsenkennung, LucideIcon>> = {
  figuren: Gem,
  taktik: Zap,
  koenig: Crown,
  bauernzuege: ChessPawn,
  eroeffnung: BookOpen,
};

/** Eine Zeile: Name, auf Wunsch der Höchstverlust, darunter die Säulen. */
function Reglerzeile({
  g,
  kennung,
  extrem,
  setze,
}: {
  g: EigenerGegner;
  kennung: Reglerkennung;
  extrem: boolean;
  setze: (g: EigenerGegner) => void;
}) {
  const [offen, setzeOffen] = useState(false);
  const arten = artenDesReglers(kennung);
  const wert = gruppenstufe(g, arten);
  const name = reglername(kennung);
  const verlust = arten[0] ? verlustVon(g, arten[0]) : null;
  const setzeAlle = (b: number | null) => setze(arten.reduce((x, a) => setzeVerlust(x, a, b), g));
  return (
    <div className={`fehlerzeile${wert === null ? " ist-aus" : ""}`}>
      <div className="fehlerzeile-kopf">
        <span className="fehlerzeile-name">{name}</span>
        {wert !== null && (
          <button
            type="button"
            className="knopf-link fehlerzeile-verlust"
            aria-expanded={offen}
            onClick={() => setzeOffen(!offen)}
          >
            {t("spielen.profil.verlust", { wert: verlusttext(verlust) })}
          </button>
        )}
      </div>
      <Stufenschalter
        kennung={kennung}
        name={name}
        wert={wert}
        extrem={extrem}
        beiWahl={(s) => setze(setzeGruppe(g, arten, s))}
      />
      {wert !== null && offen && <Verlustwahl wert={verlust} beiWahl={setzeAlle} />}
    </div>
  );
}

/** Alle Feinregler. `extrem` beginnt an, wenn schon ein unmenschlicher Wert gespeichert ist. */
export function Feinregler({
  g,
  setze,
  extremAnfang,
}: {
  g: EigenerGegner;
  setze: (g: EigenerGegner) => void;
  extremAnfang: boolean;
}) {
  const [extrem, setzeExtrem] = useState(extremAnfang);
  const haeufigkeit = g.haeufigkeit ?? 1;
  return (
    <div className="feinregler" data-testid="feinregler">
      <div className="stufenregler">
        <label htmlFor="gegner-haeufigkeit">
          {t("spielen.eigene.haeufigkeit")}: <strong>{Math.round(haeufigkeit * PROZENT)} %</strong>
        </label>
        <input
          id="gegner-haeufigkeit"
          type="range"
          min={0}
          max={HAEUFIGKEIT_HOECHSTENS}
          step={SCHRITT_HAEUFIGKEIT}
          value={haeufigkeit}
          onChange={(e) => setze({ ...g, haeufigkeit: Number(e.target.value) })}
        />
      </div>
      <label className="schalterzeile">
        <input type="checkbox" checked={extrem} onChange={(e) => setzeExtrem(e.target.checked)} />
        {t("spielen.profil.extrem")}
      </label>
      <p className="hinweis">{t("spielen.profil.erklaerung")}</p>
      {FEHLERACHSEN.map(({ kennung, regler }) => {
        const Zeichen = ACHSENZEICHEN[kennung];
        return (
          <section key={kennung} className="fehlergruppe" aria-labelledby={`achse-${kennung}`}>
            <h3 id={`achse-${kennung}`} className="fehlergruppe-kopf">
              <Zeichen size={ZEICHENGROESSE} aria-hidden="true" />
              {t(`spielen.profil.achse.${kennung}`)}
            </h3>
            {regler.map((r) => (
              <Reglerzeile key={r} g={g} kennung={r} extrem={extrem} setze={setze} />
            ))}
          </section>
        );
      })}
      <div className="fehlerzeile">
        <div className="fehlerzeile-kopf">
          <span className="fehlerzeile-name">{t("spielen.profil.niePatt")}</span>
        </div>
        <AnAusSchalter
          kennung="niePatt"
          name={t("spielen.profil.niePatt")}
          an={setztNiePatt(g)}
          beiWahl={(an) => setze(mitNiePatt(g, an))}
        />
      </div>
    </div>
  );
}

/**
 * Fehler eines eigenen Gegners oder der eigenen Stufe: Kopf mit Menschlichkeit, Vorlagen und
 * Gesamthäufigkeit, darunter jede Fehlerart genau einmal mit einem Stufenschalter (seit 0.2.129,
 * Vorschlag DS38, vom Autor am 25.10.2026 freigegeben).
 *
 * Rolle im Gesamtbild: Ersetzt die Abhaklisten „Fehlerarten“ und den erweiterten Modus mit 29
 * Reglerkästen (bis 0.2.128: FehlerartenKarte.tsx, ErweiterteFehler.tsx). Jede Zeile hat einen
 * Schalter „aus · sehr selten · selten · normal · oft · sehr oft“ (normal = Median der Menschen);
 * die unmenschlichen Stufen kommen erst über einen eigenen Schalter dazu. Der Höchstverlust lässt
 * sich je Zeile aufklappen. Die Logik liegt in fehlerprofil.ts, die blinden Flecken in
 * Fleckenkacheln.tsx; beide nutzen GegnerReiter.tsx für eigene Stufe und eigene Bots.
 * Abhängigkeiten: fehlerprofil.ts, engine/eigenstufen.ts, engine/botstaerke.ts, i18n, lucide-react.
 */
import { BookOpen, Crown, Gem, Shuffle, Zap, type LucideIcon } from "lucide-react";
import { useState } from "react";
import { staerkeGeschaetzt } from "../../engine/botstaerke";
import { menschlichkeit, staerkerichtung } from "../../engine/eigenstufen";
import type { Fehlerart } from "../../engine/fehlerart";
import type { EigenerGegner } from "../../engine/gegner";
import { GELEGENHEITSARTEN } from "../../engine/menschenprofil";
import { t } from "../../i18n/sprache";
import { HAEUFIGKEIT_HOECHSTENS } from "../../speicher/menschenwerte";
import {
  aktuelleStufen,
  FEHLERGRUPPEN,
  hatStufen,
  istVorlage,
  mitVorlage,
  setzeStufe,
  setzeVerlust,
  stufenwort,
  stufeVon,
  STUFEN_ALLE,
  STUFEN_MENSCHLICH,
  UNMENSCHLICH_AB,
  VERLUSTWAHL,
  VORLAGEN,
  verlustVon,
  type Fehlergruppe,
  type Profilart,
  type Vorlagenname,
} from "./fehlerprofil";
import { staerketext } from "./staerkeangabe";

const PROZENT = 100;
const SCHRITT_HAEUFIGKEIT = 0.1;
/** Ab diesem Anteil ganze Prozent, darunter eine Nachkommastelle. */
const GANZE_PROZENT_AB = 0.01;
const ZEICHENGROESSE = 18;

const GRUPPENZEICHEN: Readonly<Record<Fehlergruppe, LucideIcon>> = {
  material: Gem,
  taktik: Zap,
  koenig: Crown,
  eroeffnung: BookOpen,
  allgemein: Shuffle,
};

/** Kopf: geschätzte Stärke, Urteil über die Menschlichkeit und Richtung der Stärke. */
function Profilkopf({ g }: { g: EigenerGegner }) {
  const stufen = aktuelleStufen(g);
  const m = menschlichkeit(stufen);
  const anteil =
    m.anteil >= GANZE_PROZENT_AB
      ? `${Math.round(m.anteil * PROZENT)} %`
      : `${(m.anteil * PROZENT).toFixed(1).replace(".", ",")} %`;
  return (
    <div className="profilkopf" data-testid="menschlichkeit" data-urteil={m.urteil}>
      <div className="profilkopf-staerke">
        <strong>{staerketext(staerkeGeschaetzt(g))}</strong>
        <span className="hinweis">{t("spielen.profil.geschaetzt")}</span>
      </div>
      <div className="profilkopf-urteil">
        <span className={`urteilsmarke urteil-${m.urteil}`}>
          {t(`spielen.eigene.menschlich.${m.urteil}`)}
        </span>
        <p className="hinweis">
          {m.urteil === "unmenschlich"
            ? t("spielen.eigene.menschlich.unmenschlichText", { anzahl: String(m.unmenschlich) })
            : t("spielen.eigene.menschlich.anteil", { anteil })}{" "}
          {t(`spielen.eigene.richtung.${staerkerichtung(stufen, staerkeGeschaetzt(g))}`)}
        </p>
      </div>
    </div>
  );
}

/** Vorlagen als Schnellstart, die aktive ist markiert. */
function Vorlagen({ g, setze }: { g: EigenerGegner; setze: (g: EigenerGegner) => void }) {
  return (
    <div className="vorlagenreihe" role="group" aria-label={t("spielen.profil.vorlagen")}>
      {(Object.keys(VORLAGEN) as Vorlagenname[]).map((name) => (
        <button
          key={name}
          type="button"
          className="vorlage"
          aria-pressed={istVorlage(g, name)}
          onClick={() => setze(mitVorlage(g, name))}
        >
          {t(`spielen.profil.vorlage.${name}`)}
        </button>
      ))}
    </div>
  );
}

/** Der Stufenschalter einer Art; Arten ohne Daten der Spieler kennen nur „aus“ und „an“. */
export function Stufenschalter({
  art,
  name,
  wert,
  extrem,
  beiWahl,
}: {
  art: Profilart;
  name: string;
  wert: number | null;
  extrem: boolean;
  beiWahl: (stufe: number | null) => void;
}) {
  const mitStufen = hatStufen(art);
  const stufen = mitStufen ? (extrem ? STUFEN_ALLE : STUFEN_MENSCHLICH) : [null, 0];
  return (
    <div
      className={`stufenschalter stufen-${stufen.length}`}
      role="radiogroup"
      aria-label={name}
      data-testid={`stufe-${art}`}
    >
      {stufen.map((s) => (
        <button
          key={String(s)}
          type="button"
          role="radio"
          aria-checked={s === wert}
          className={s !== null && Math.abs(s) >= UNMENSCHLICH_AB ? "unmenschlich" : undefined}
          onClick={() => beiWahl(s)}
        >
          {mitStufen || s === null ? stufenwort(s) : t("spielen.profil.an")}
        </button>
      ))}
    </div>
  );
}

/** Wahl des Höchstverlusts einer Art als Chips (unter der Zeile aufgeklappt). */
function Verlustwahl({
  g,
  art,
  setze,
}: {
  g: EigenerGegner;
  art: Fehlerart;
  setze: (g: EigenerGegner) => void;
}) {
  const wert = verlustVon(g, art);
  const wahl = VERLUSTWAHL.includes(wert) ? VERLUSTWAHL : [...VERLUSTWAHL.slice(0, -1), wert, null];
  return (
    <div className="verlustwahl" role="radiogroup" aria-label={t("spielen.profil.verlustTitel")}>
      <span className="hinweis">{t("spielen.profil.verlustTitel")}</span>
      {wahl.map((b) => (
        <button
          key={String(b)}
          type="button"
          role="radio"
          className="chip"
          aria-checked={b === wert}
          onClick={() => setze(setzeVerlust(g, art, b))}
        >
          {b === null
            ? t("spielen.eigene.unbegrenzt")
            : t("spielen.eigene.bauern", { wert: String(b).replace(".", ",") })}
        </button>
      ))}
    </div>
  );
}

/** Eine Zeile: Name, auf Wunsch der Höchstverlust, darunter der Stufenschalter. */
function Fehlerzeile({
  g,
  art,
  extrem,
  setze,
}: {
  g: EigenerGegner;
  art: Fehlerart;
  extrem: boolean;
  setze: (g: EigenerGegner) => void;
}) {
  const [offen, setzeOffen] = useState(false);
  const wert = stufeVon(g, art);
  const name = t(`fehlerart.${art}`);
  const mitVerlust = (GELEGENHEITSARTEN as readonly string[]).includes(art) && wert !== null;
  const verlust = verlustVon(g, art);
  return (
    <div className={`fehlerzeile${wert === null ? " ist-aus" : ""}`}>
      <div className="fehlerzeile-kopf">
        <span className="fehlerzeile-name">{name}</span>
        {mitVerlust && (
          <button
            type="button"
            className="knopf-link fehlerzeile-verlust"
            aria-expanded={offen}
            onClick={() => setzeOffen(!offen)}
          >
            {t("spielen.profil.verlust", {
              wert:
                verlust === null
                  ? t("spielen.eigene.unbegrenzt")
                  : t("spielen.eigene.bauern", { wert: String(verlust).replace(".", ",") }),
            })}
          </button>
        )}
      </div>
      <Stufenschalter
        art={art}
        name={name}
        wert={wert}
        extrem={extrem}
        beiWahl={(s) => setze(setzeStufe(g, art, s))}
      />
      {mitVerlust && offen && <Verlustwahl g={g} art={art} setze={setze} />}
    </div>
  );
}

/**
 * Das ganze Fehlerprofil: Kopf, Vorlagen, Gesamthäufigkeit, Schalter für unmenschliche Werte und
 * die Gruppen. Beispiel: Vorlage „Leichtsinnig“, dann „Figur hängen lassen“ auf „oft“ zurück.
 */
export function Fehlerprofil({
  g,
  setze,
}: {
  g: EigenerGegner;
  setze: (g: EigenerGegner) => void;
}) {
  const stufen = Object.values(aktuelleStufen(g));
  const [extrem, setzeExtrem] = useState(() =>
    stufen.some((s) => s !== undefined && Math.abs(s) >= UNMENSCHLICH_AB),
  );
  const haeufigkeit = g.haeufigkeit ?? 1;
  return (
    <div className="fehlerprofil" data-testid="fehlerprofil">
      <Profilkopf g={g} />
      <Vorlagen g={g} setze={setze} />
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
      {FEHLERGRUPPEN.map(({ kennung, arten }) => {
        const Zeichen = GRUPPENZEICHEN[kennung];
        return (
          <section key={kennung} className="fehlergruppe" aria-labelledby={`gruppe-${kennung}`}>
            <h3 id={`gruppe-${kennung}`} className="fehlergruppe-kopf">
              <Zeichen size={ZEICHENGROESSE} aria-hidden="true" />
              {t(`spielen.profil.gruppe.${kennung}`)}
            </h3>
            {arten.map((art) => (
              <Fehlerzeile key={art} g={g} art={art} extrem={extrem} setze={setze} />
            ))}
          </section>
        );
      })}
    </div>
  );
}

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
import { Ban, BookOpen, Crown, Gem, Shuffle, Zap, type LucideIcon } from "lucide-react";
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

/** Höhe der niedrigsten Säule in Prozent; die höchste füllt die Spur. */
const SAEULE_MINDESTENS = 25;
const ZEICHEN_AUS = 18;

/**
 * Höhe der Säule einer Stufe in Prozent: von „sehr selten“ (klein) bis „sehr oft“ (voll).
 * Beispiel: sechs Stufen mit „aus“ → sehr selten 40 %, normal 70 %, sehr oft 100 %.
 */
function saeulenhoehe(position: number, anzahl: number): number {
  return SAEULE_MINDESTENS + ((PROZENT - SAEULE_MINDESTENS) * position) / anzahl;
}

/**
 * Der Stufenschalter einer Art. Seit 0.2.130 (Wunsch des Autors, 25.10.2026: aufgeräumter, wie
 * die Balken in „Deine Züge“) als Säulen wie eine Lautstärkeanzeige: „aus“ als Zeichen links,
 * dann je Stufe eine höhere Säule; gefüllt bis zur gewählten Stufe, unter „normal“ ein Strich
 * wie das Übliche in „Deine Züge“, rechts das Wort der Wahl. Jede Säule bleibt ein Optionsfeld
 * mit dem Wort als Namen (Bildschirmleser, Tests). Arten ohne Daten der Spieler kennen nur „aus“
 * und „an“ und behalten den kleinen Schalter.
 */
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
  if (!hatStufen(art)) {
    return <AnAusSchalter art={art} name={name} wert={wert} beiWahl={beiWahl} />;
  }
  const stufen = extrem ? STUFEN_ALLE : STUFEN_MENSCHLICH;
  const anzahl = stufen.length - 1;
  return (
    <div className="stufenbalken-zeile">
      <div
        className="stufenbalken"
        role="radiogroup"
        aria-label={name}
        data-testid={`stufe-${art}`}
      >
        {stufen.map((s, position) => (
          <button
            key={String(s)}
            type="button"
            role="radio"
            aria-checked={s === wert}
            aria-label={stufenwort(s)}
            title={stufenwort(s)}
            className={saeulenklasse(s, wert)}
            onClick={() => beiWahl(s)}
          >
            {s === null ? (
              <Ban size={ZEICHEN_AUS} aria-hidden="true" />
            ) : (
              <span
                className="stufenbalken-saeule"
                style={{ height: `${saeulenhoehe(position, anzahl)}%` }}
              />
            )}
          </button>
        ))}
      </div>
      <span className="stufenbalken-wert" aria-hidden="true">
        {stufenwort(wert)}
      </span>
    </div>
  );
}

/** Klassen einer Säule: gefüllt bis zur Wahl, „normal“ mit Strich, unmenschlich gestreift. */
function saeulenklasse(s: number | null, wert: number | null): string {
  if (s === null) return "stufenbalken-aus";
  const teile = ["stufenbalken-stufe"];
  if (wert !== null && s <= wert) teile.push("gefuellt");
  if (s === 0) teile.push("ist-normal");
  if (Math.abs(s) >= UNMENSCHLICH_AB) teile.push("unmenschlich");
  return teile.join(" ");
}

/** Kleiner Schalter „aus · an“ für Arten ohne Stufen. */
function AnAusSchalter({
  art,
  name,
  wert,
  beiWahl,
}: {
  art: Profilart;
  name: string;
  wert: number | null;
  beiWahl: (stufe: number | null) => void;
}) {
  return (
    <div
      className="stufenschalter stufen-2"
      role="radiogroup"
      aria-label={name}
      data-testid={`stufe-${art}`}
    >
      {[null, 0].map((s) => (
        <button
          key={String(s)}
          type="button"
          role="radio"
          aria-checked={s === wert}
          onClick={() => beiWahl(s)}
        >
          {s === null ? stufenwort(s) : t("spielen.profil.an")}
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

/**
 * Erweiterter Modus der eigenen Bots: Fehlerhäufigkeit insgesamt, Stufe je Fehlerart und blindem
 * Fleck auf den Quantilen der Menschen, Höchstverlust je Fehlerart (Wunsch des Autors vom
 * 20.10.2026, seit 0.2.117; Regler auf Quantilen seit 0.2.126, Teil E).
 *
 * Rolle im Gesamtbild: Teil des Formulars in GegnerEditor.tsx, zugeklappt unter „Erweitert“. Die
 * Stufen je Phase bestimmen die Grundstärke (engine/stufen.ts); die Zusatzfehler kommen wie bei
 * Menschen dieser Stärke dazu (engine/menschenwahl.ts). Hier verschiebt der Leser sie auf denselben
 * Stufen wie die vorgefertigten Bots (engine/eigenstufen.ts): 0 wie der Median der Spieler, ±2 wie
 * die 5 % auffälligsten oder unauffälligsten, ±3 und ±4 darüber hinaus („unmenschlich“). Oben
 * steht, wie menschlich die ganze Kombination ist und wohin sie die Stärke schiebt. Nicht
 * angehakte Fehlerarten und Flecken bleiben aus (die Regler sind dann gesperrt). Der Höchstverlust
 * begrenzt, wie teuer ein Fehler der Art höchstens sein darf; ganz rechts steht „unbegrenzt“
 * (Vorgabe, wie Menschen), dann fehlt der Wert im Speicher. Ältere Gegner mit freien Gewichten
 * zeigen die nächste Stufe; erst ein bewegter Regler schreibt Stufen.
 * Abhängigkeiten: engine/eigenstufen.ts, engine/botstaerke.ts, engine/menschenprofil.ts,
 * engine/blindeFlecken.ts, speicher/menschenwerte.ts, i18n.
 */
import { BLINDE_FLECKEN, type BlinderFleck } from "../../engine/blindeFlecken";
import { staerkeGeschaetzt } from "../../engine/botstaerke";
import {
  menschlichkeit,
  naechsteStufe,
  REGLERARTEN,
  staerkerichtung,
  type Reglerstufen,
} from "../../engine/eigenstufen";
import type { Fehlerart } from "../../engine/fehlerart";
import type { EigenerGegner } from "../../engine/gegner";
import { GELEGENHEITSARTEN } from "../../engine/menschenprofil";
import { STUFE_MAX, STUFE_MIN } from "../../engine/spielerbereiche";
import { t, type Textschluessel } from "../../i18n/sprache";
import {
  HAEUFIGKEIT_HOECHSTENS,
  HOECHSTVERLUST_HOECHSTENS,
  HOECHSTVERLUST_MINDESTENS,
} from "../../speicher/menschenwerte";

const SCHRITT = 0.1;
const SCHRITT_VERLUST = 0.5;
const PROZENT = 100;
/** Ab diesem Anteil zeigt die Anzeige ganze Prozent, darunter eine Nachkommastelle. */
const GANZE_PROZENT_AB = 0.01;
/** Reglerstellung rechts vom größten Höchstverlust: unbegrenzt. */
const UNBEGRENZT = HOECHSTVERLUST_HOECHSTENS + SCHRITT_VERLUST;

type Reglerart = Fehlerart | BlinderFleck;

function prozent(wert: number): string {
  return `${Math.round(wert * PROZENT)} %`;
}

/** Text einer Stufe −4 bis 4 („wie der Median“, „wie die auffälligsten 5 %“ …). */
function stufentext(stufe: number): string {
  return t(`spielen.eigene.quantil.${stufe}` as Textschluessel);
}

/** Ein Regler mit Beschriftung und Wert. */
function Regler({
  id,
  name,
  wert,
  von,
  bis,
  schritt,
  text,
  gesperrt = false,
  beiWahl,
}: {
  id: string;
  name: string;
  wert: number;
  von: number;
  bis: number;
  schritt: number;
  text: string;
  gesperrt?: boolean;
  beiWahl: (wert: number) => void;
}) {
  return (
    <div className="stufenregler">
      <label htmlFor={id}>
        {name}: <strong>{text}</strong>
      </label>
      <input
        id={id}
        type="range"
        min={von}
        max={bis}
        step={schritt}
        value={wert}
        disabled={gesperrt}
        onChange={(e) => beiWahl(Number(e.target.value))}
      />
    </div>
  );
}

/** Ist die Art oder der Fleck angehakt (sonst macht der Gegner ihn nie)? */
function istAn(g: EigenerGegner, art: Reglerart): boolean {
  return (
    (g.fehlerarten as readonly string[]).includes(art) ||
    (g.blindeFlecken as readonly string[]).includes(art)
  );
}

/**
 * Die Stufen aller angehakten Arten: gespeichert, sonst aus einem alten Gewicht übersetzt, sonst 0.
 * Beispiel: alter Gegner mit Gewicht 3 für Bauernraub → Stufe etwa 3.
 */
function aktuelleStufen(g: EigenerGegner): Reglerstufen {
  const wertung = staerkeGeschaetzt(g);
  const aus: Partial<Record<Reglerart, number>> = {};
  for (const art of REGLERARTEN) {
    if (!istAn(g, art)) continue;
    const gewicht = g.gewichte?.[art];
    aus[art] =
      g.reglerstufen?.[art] ?? (gewicht === undefined ? 0 : naechsteStufe(art, gewicht, wertung));
  }
  return aus;
}

/** „Menschlich: Etwa 12 % der Spieler …“ und die Richtung der Stärke. */
function Menschlichkeitsanzeige({ g }: { g: EigenerGegner }) {
  const stufen = aktuelleStufen(g);
  const m = menschlichkeit(stufen);
  const anteil =
    m.anteil >= GANZE_PROZENT_AB
      ? prozent(m.anteil)
      : `${(m.anteil * PROZENT).toFixed(1).replace(".", ",")} %`;
  const richtung = staerkerichtung(stufen, staerkeGeschaetzt(g));
  return (
    <div className="menschlichkeit" data-testid="menschlichkeit" data-urteil={m.urteil}>
      <p>
        <strong>{t(`spielen.eigene.menschlich.${m.urteil}`)}</strong>{" "}
        {m.urteil === "unmenschlich"
          ? t("spielen.eigene.menschlich.unmenschlichText", { anzahl: String(m.unmenschlich) })
          : t("spielen.eigene.menschlich.anteil", { anteil })}
      </p>
      <p className="hinweis">{t(`spielen.eigene.richtung.${richtung}`)}</p>
    </div>
  );
}

/** Die Regler des erweiterten Modus für einen eigenen Gegner. */
export function ErweiterteFehler({
  g,
  setze,
}: {
  g: EigenerGegner;
  setze: (neu: EigenerGegner) => void;
}) {
  const stufen = aktuelleStufen(g);
  const mitStufe = (art: Reglerart, wert: number) => {
    // Ab dem ersten bewegten Regler gelten Stufen; alte freie Gewichte fallen weg.
    const neu: EigenerGegner = { ...g, reglerstufen: { ...stufen, [art]: wert } };
    delete (neu as { gewichte?: unknown }).gewichte;
    setze(neu);
  };
  const stufenregler = (art: Reglerart, name: string) => (
    <Regler
      id={`stufe-${art}`}
      name={name}
      wert={istAn(g, art) ? (stufen[art] ?? 0) : 0}
      von={STUFE_MIN}
      bis={STUFE_MAX}
      schritt={1}
      text={istAn(g, art) ? stufentext(stufen[art] ?? 0) : t("spielen.eigene.aus")}
      gesperrt={!istAn(g, art)}
      beiWahl={(wert) => mitStufe(art, wert)}
    />
  );
  return (
    <details className="erweitert" data-testid="erweiterte-fehler">
      <summary className="einstellung-name">{t("spielen.eigene.erweitert")}</summary>
      <p className="hinweis">{t("spielen.eigene.erweitertHinweis")}</p>
      <Menschlichkeitsanzeige g={g} />
      <Regler
        id="gegner-haeufigkeit"
        name={t("spielen.eigene.haeufigkeit")}
        wert={g.haeufigkeit ?? 1}
        von={0}
        bis={HAEUFIGKEIT_HOECHSTENS}
        schritt={SCHRITT}
        text={prozent(g.haeufigkeit ?? 1)}
        beiWahl={(haeufigkeit) => setze({ ...g, haeufigkeit })}
      />
      {GELEGENHEITSARTEN.map((art) => (
        <fieldset key={art} className="erweitert-art">
          <legend>{t(`fehlerart.${art}`)}</legend>
          {stufenregler(art, t("spielen.eigene.gewicht"))}
          <Hoechstverlust g={g} art={art} setze={setze} />
        </fieldset>
      ))}
      {BLINDE_FLECKEN.map((fleck) => (
        <div key={fleck}>{stufenregler(fleck, t(`blind.${fleck}`))}</div>
      ))}
    </details>
  );
}

/** Der Regler des Höchstverlusts einer Fehlerart (ganz rechts „unbegrenzt“). */
function Hoechstverlust({
  g,
  art,
  setze,
}: {
  g: EigenerGegner;
  art: (typeof GELEGENHEITSARTEN)[number];
  setze: (neu: EigenerGegner) => void;
}) {
  const wert = g.hoechstverlust?.[art] ?? UNBEGRENZT;
  const mitVerlust = (neuerWert: number) => {
    const uebrige = Object.entries(g.hoechstverlust ?? {}).filter(([a]) => a !== art);
    const neu = neuerWert >= UNBEGRENZT ? uebrige : [...uebrige, [art, neuerWert] as const];
    setze({ ...g, hoechstverlust: Object.fromEntries(neu) });
  };
  const text =
    wert >= UNBEGRENZT
      ? t("spielen.eigene.unbegrenzt")
      : t("spielen.eigene.bauern", { wert: wert.toFixed(1).replace(".", ",") });
  return (
    <Regler
      id={`verlust-${art}`}
      name={t("spielen.eigene.hoechstverlust")}
      wert={wert}
      von={HOECHSTVERLUST_MINDESTENS}
      bis={UNBEGRENZT}
      schritt={SCHRITT_VERLUST}
      text={text}
      gesperrt={!g.fehlerarten.includes(art)}
      beiWahl={mitVerlust}
    />
  );
}

/**
 * Fehler eines eigenen Gegners oder der eigenen Stufe: Vorlagen, das
 * Fehlernetz mit fünf Achsen, ein Höchstverlust für alle Fehler und hinter einem Haken die
 * Feinregler (seit 0.2.135; Netz-Vorschau E1 bis E3 und Auftrag „Variante A“, vom Autor am
 * 25.10.2026 freigegeben).
 *
 * Rolle im Gesamtbild: Bis 0.2.134 stand jede der 18 Fehlerarten mit einem Stufenschalter
 * untereinander (seit 0.2.129, davor Haken und erweiterter Modus). Die statistische Auswertung des
 * Koordinierungschats zeigte, dass mehrere davon kaum ein echtes Merkmal von Spielern messen.
 * Jetzt: fünf Achsen im Netz (Figuren, Taktik, König, Bauernzüge, Eröffnung), darunter neun
 * Regler als Feinregler. Mit offenem Feinregler ist das Netz grau und zeigt den Mittelwert, damit
 * sich nichts widerspricht. Die Logik liegt in fehlergruppen.ts und fehlerprofil.ts. Die Schätzung
 * der Stärke steht seit 0.2.137 über allen Reitern (Gesamtstaerke.tsx).
 * Abhängigkeiten: fehlergruppen.ts, fehlerprofil.ts, Profilnetz.tsx, Feinregler.tsx,
 * engine/eigenstufen.ts, engine/botstaerke.ts, i18n.
 */
import { useState } from "react";
import type { EigenerGegner } from "../../../engine/gegner";
import { t, type Textschluessel } from "../../../i18n/sprache";
import {
  alteEinstellungen,
  artenDerAchse,
  FEHLERACHSEN,
  FEHLERVORLAGEN,
  gemeinsamerVerlust,
  gruppenstufe,
  istEinheitlich,
  istFehlervorlage,
  mitFehlervorlage,
  mitVerlustFuerAlle,
  setzeGruppe,
  type Fehlervorlage,
} from "./fehlergruppen";
import { aktuelleStufen, UNMENSCHLICH_AB, VERLUSTWAHL, verlusttext } from "./fehlerprofil";
import { Feinregler } from "./Feinregler";
import { MitInfo } from "../bausteine/InfoKnopf";
import { Profilnetz } from "./Profilnetz";

/** Wann gestrichene Arten neutral werden: beim Speichern (eigene Bots) oder beim Ändern (eigene Stufe). */
export type Neutralwerden = "speichern" | "aendern";

/**
 * Vorlagen als Schnellstart in einer Auswahlliste, auch für die Flecken (Fleckennetz.tsx). Seit
 * 0.2.139 (Wunsch des Autors, 25.10.2026) eine Liste wie bei den Stilachsen (Stilnetz.tsx) statt
 * einer Reihe von Knöpfen; passt die Einstellung zu keiner Vorlage, steht „eigene Einstellung“.
 */
export function Vorlagenreihe<T extends string>({
  namen,
  aktiv,
  waehle,
  text,
  gesperrt = false,
}: {
  namen: readonly T[];
  aktiv: (name: T) => boolean;
  waehle: (name: T) => void;
  text: (name: T) => string;
  gesperrt?: boolean;
}) {
  const wert = namen.find((name) => aktiv(name)) ?? "";
  return (
    <label className="stilnetz-liste vorlagenliste">
      <span className="einstellung-name">{t("spielen.profil.vorlagen")}</span>
      <select
        className="auswahlfeld"
        value={wert}
        disabled={gesperrt}
        onChange={(e) => {
          const name = namen.find((n) => n === e.target.value);
          if (name) waehle(name);
        }}
      >
        {wert === "" && <option value="">{t("spielen.profil.vorlageEigene")}</option>}
        {namen.map((name) => (
          <option key={name} value={name}>
            {text(name)}
          </option>
        ))}
      </select>
    </label>
  );
}

/** Ein Höchstverlust für alle Fehler (E3) als Regler über die Wahl ½, 1, 2, 3, unbegrenzt. */
function Verlustregler({
  g,
  setze,
  gesperrt,
}: {
  g: EigenerGegner;
  setze: (g: EigenerGegner) => void;
  gesperrt: boolean;
}) {
  const { wert, einheitlich } = gemeinsamerVerlust(g);
  const stelle = VERLUSTWAHL.indexOf(wert);
  return (
    <div className={gesperrt ? "stufenregler gesperrt" : "stufenregler"}>
      <label htmlFor="gegner-verlust">
        {t("spielen.profil.verlustAlle")}:{" "}
        <strong>{einheitlich ? verlusttext(wert) : t("spielen.profil.verlustVerschieden")}</strong>
      </label>
      <input
        id="gegner-verlust"
        type="range"
        min={0}
        max={VERLUSTWAHL.length - 1}
        step={1}
        value={stelle < 0 ? VERLUSTWAHL.length - 1 : stelle}
        disabled={gesperrt}
        aria-valuetext={verlusttext(wert)}
        onChange={(e) => setze(mitVerlustFuerAlle(g, VERLUSTWAHL[Number(e.target.value)] ?? null))}
      />
    </div>
  );
}

/** Lässt sich das Profil ohne Verlust im Netz zeigen? Sonst beginnen die Feinregler offen. */
function passtInsNetz(g: EigenerGegner): boolean {
  const stufen = Object.values(aktuelleStufen(g));
  return (
    (g.haeufigkeit ?? 1) === 1 &&
    gemeinsamerVerlust(g).einheitlich &&
    stufen.every((s) => s === undefined || Math.abs(s) < UNMENSCHLICH_AB) &&
    FEHLERACHSEN.every((a) => istEinheitlich(g, artenDerAchse(a.kennung)))
  );
}

/** Hinweis auf ältere Einstellungen gestrichener Arten (Variante A, Punkt 3). */
export function AlteEinstellungen({ g, wann }: { g: EigenerGegner; wann: Neutralwerden }) {
  const alte = alteEinstellungen(g);
  if (alte.length === 0) return null;
  // In Anführungszeichen: Die Namen der Arten sind Satzteile („den König ohne Not gezogen“).
  const arten = alte
    .map((a) => t("spielen.profil.alt.art", { art: t(`fehlerart.${a}` as Textschluessel) }))
    .join(", ");
  return (
    <p className="profil-hinweis" data-testid="alte-einstellungen">
      {t(`spielen.profil.alt.${wann}`, { arten })}
    </p>
  );
}

/**
 * Das ganze Fehlerprofil. Beispiel: Vorlage „Leichtsinnig“, dann „Taktik“ im Netz auf „normal“.
 * `wann`: ob ältere Einstellungen beim Speichern oder bei der nächsten Änderung neutral werden.
 */
export function Fehlerprofil({
  g,
  setze,
  wann,
}: {
  g: EigenerGegner;
  setze: (g: EigenerGegner) => void;
  wann: Neutralwerden;
}) {
  const [fein, setzeFein] = useState(() => !passtInsNetz(g));
  const extremAnfang = Object.values(aktuelleStufen(g)).some(
    (s) => s !== undefined && Math.abs(s) >= UNMENSCHLICH_AB,
  );
  const achsen = FEHLERACHSEN.map((a) => ({
    kennung: a.kennung,
    name: t(`spielen.profil.achse.${a.kennung}`),
  }));
  const werte = FEHLERACHSEN.map((a) => gruppenstufe(g, artenDerAchse(a.kennung)));
  const namen = Object.keys(FEHLERVORLAGEN) as Fehlervorlage[];
  return (
    <div className="fehlerprofil" data-testid="fehlerprofil">
      <AlteEinstellungen g={g} wann={wann} />
      {/* Seit 0.2.137 Erklärung und Legende hinter dem Fragezeichen. */}
      <MitInfo
        thema={t("spielen.profil.netzFehler")}
        zeile={<span className="einstellung-name">{t("spielen.profil.netzFehler")}</span>}
        erklaerung={
          <>
            <p>{t("spielen.profil.erklaerung")}</p>
            <p>{t("spielen.profil.normalLegende")}</p>
          </>
        }
      />
      <Vorlagenreihe
        namen={namen}
        aktiv={(n) => istFehlervorlage(g, n)}
        waehle={(n) => setze(mitFehlervorlage(g, n))}
        text={(n) => t(`spielen.profil.vorlage.${n}`)}
        gesperrt={fein}
      />
      <Profilnetz
        name={t("spielen.profil.netzFehler")}
        achsen={achsen}
        werte={werte}
        gesperrt={fein}
        testid="fehlernetz"
        beiWahl={(i, s) => {
          const achse = FEHLERACHSEN[i];
          if (achse) setze(setzeGruppe(g, artenDerAchse(achse.kennung), s));
        }}
      />
      <Verlustregler g={g} setze={setze} gesperrt={fein} />
      <MitInfo
        thema={t("spielen.profil.fein")}
        zeile={
          <label className="schalterzeile profil-fein">
            <input type="checkbox" checked={fein} onChange={(e) => setzeFein(e.target.checked)} />
            {t("spielen.profil.fein")}
          </label>
        }
        erklaerung={<p>{t("spielen.profil.feinWarnung")}</p>}
      />
      {fein && <Feinregler g={g} setze={setze} extremAnfang={extremAnfang} />}
    </div>
  );
}

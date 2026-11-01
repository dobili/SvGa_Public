/**
 * Unterseiten „Eröffnung“ und „Studie“ des Blatts „Neue Variante aus …“ (Stufe 4).
 *
 * Rolle im Gesamtbild: Variationsbrowser, Stufe 4 (Wunsch des Autors, 1.11.2026). „Eröffnung“
 * lädt eine ganze Eröffnung mit allen Abzweigen: aus dem Buch (alle Zugfolgen von Kapitel 2 und 3
 * zu dieser Eröffnung, Buchzeichen bleiben) und/oder aus der Praxis (Lichess, Band wählbar), dazu
 * die Eröffnungen, die nur die Praxis kennt. Vorab steht die Größe; wird der Baum größer als eine
 * Variante fassen kann (600 Züge, Format 8), sagt es eine Meldung, statt still zu kürzen.
 * „Studie“ listet die Studien aus Kapitel 10 und öffnet ihren Buchbaum wie eine Abbildung.
 * Abhängigkeiten: eroeffnungsentwurf.ts, variantenwert.ts, daten/laden.ts, training/rivalen.ts,
 * training/praxisfortsetzung.ts, Speicher, Navigation, i18n.
 */
import { useMemo, useState } from "react";
import { useNavigation } from "../../../app/navigationsKontext";
import { ladeKapitel } from "../../../daten/laden";
import { t } from "../../../i18n/sprache";
import { useSpeicher } from "../../../speicher/speicher";
import { bandindexFuer, WERTUNG_OHNE_PARTIEN } from "../../../training/praxisfortsetzung";
import { eigeneWertung } from "../../../training/rivalen";
import { useDaten } from "../bausteine/useDaten";
import {
  eroeffnungsbaum,
  familienname,
  ladeEroeffnungsdaten,
  LICHESS_VORSILBE,
  nurPraxis,
  type Eroeffnungsbaum,
  type Eroeffnungsdaten,
} from "./eroeffnungsentwurf";
import { alsWert, varianteAnsicht } from "./variantenwert";

/** Kapitel der Studien („Studien und Kuriositäten“). */
const KAPITEL_STUDIEN = 10;
/** Abschnitte mit Nummer („10.2“); Übungen heißen „Übung 73“ und bleiben draußen. */
const ABSCHNITT = /^\d+\.\d+$/;

/** Die Eröffnungen, die nur die Praxis kennt, als Gruppe der Auswahl. */
function PraxisGruppe({ daten }: { daten: Eroeffnungsdaten }) {
  return (
    <optgroup label={t("varianten.eroeffnung.nurPraxis")}>
      {nurPraxis(daten).map((f) => (
        <option key={f.name} value={`${LICHESS_VORSILBE}${f.name}`}>
          {familienname(f)}
        </option>
      ))}
    </optgroup>
  );
}

/** Größe des Baums vorab und, wenn er zu groß ist, die Meldung über das Kürzen. */
function Vorschau({ baum }: { baum: Eroeffnungsbaum | null }) {
  if (!baum) return null;
  return (
    <>
      <p className="hinweis" data-testid="eroeffnung-umfang">
        {t("varianten.eroeffnung.umfang", { buch: baum.buchzuege, praxis: baum.praxiszuege })}
      </p>
      {baum.begrenzung.gekuerzt && (
        <p className="meldung schlecht" role="status">
          {t("varianten.eroeffnung.gekuerzt", { vorher: baum.begrenzung.vorher })}
        </p>
      )}
    </>
  );
}

/** Auswahl der Eröffnung mit Gruppen: Kapitel 2, Kapitel 3, nur Praxis. */
function Eroeffnungsliste({
  daten,
  wert,
  beiWahl,
}: {
  daten: Eroeffnungsdaten;
  wert: string;
  beiWahl: (schluessel: string) => void;
}) {
  const gruppen = [2, 3].map((k) => ({ k, liste: daten.buch.filter((e) => e.kapitel === k) }));
  return (
    <label className="feld">
      <span>{t("varianten.eroeffnung.wahl")}</span>
      <select
        className="textfeld"
        value={wert}
        onChange={(e) => beiWahl(e.target.value)}
        data-testid="eroeffnung-wahl"
      >
        {gruppen.map(({ k, liste }) => (
          <optgroup
            key={k}
            label={t(k === 2 ? "varianten.eroeffnung.kapitel2" : "varianten.eroeffnung.kapitel3")}
          >
            {liste.map((e) => (
              <option key={e.id} value={e.id}>
                {e.titel}
              </option>
            ))}
          </optgroup>
        ))}
        <PraxisGruppe daten={daten} />
      </select>
    </label>
  );
}

/** Band der Praxis zum Wählen; Vorgabe ist das Band des Lesers. */
function Bandwahl({
  daten,
  band,
  beiWahl,
}: {
  daten: Eroeffnungsdaten;
  band: number;
  beiWahl: (b: number) => void;
}) {
  return (
    <label className="feld">
      <span>{t("varianten.eroeffnung.band")}</span>
      <select className="textfeld" value={band} onChange={(e) => beiWahl(Number(e.target.value))}>
        {daten.fortsetzungen.baender.map((untergrenze, i) => (
          <option key={untergrenze} value={i}>
            {t("varianten.eroeffnung.bandZeile", { von: untergrenze })}
          </option>
        ))}
      </select>
    </label>
  );
}

/** Die Schalter „Buch“ und „Praxis“ (nur bei Eröffnungen des Buches). */
function Herkunftswahl({
  buch,
  praxis,
  beiWahl,
}: {
  buch: boolean;
  praxis: boolean;
  beiWahl: (teil: { buch?: boolean; praxis?: boolean }) => void;
}) {
  return (
    <>
      <label className="schalterzeile">
        <input
          type="checkbox"
          checked={buch}
          onChange={(e) => beiWahl({ buch: e.target.checked })}
        />
        <span>{t("varianten.eroeffnung.ausBuch")}</span>
      </label>
      <label className="schalterzeile">
        <input
          type="checkbox"
          checked={praxis}
          data-testid="eroeffnung-praxis"
          onChange={(e) => beiWahl({ praxis: e.target.checked })}
        />
        <span>{t("varianten.eroeffnung.ausPraxis")}</span>
      </label>
    </>
  );
}

/** Die Wahl auf der Unterseite und ihre Vorschau. */
function EroeffnungsForm({ daten, band: vorgabe }: { daten: Eroeffnungsdaten; band: number }) {
  const { navigiere } = useNavigation();
  const [wahl, setzeWahl] = useState({
    schluessel: daten.buch[0]?.id ?? "",
    buch: true,
    praxis: false,
    band: vorgabe,
  });
  const nurLichess = wahl.schluessel.startsWith(LICHESS_VORSILBE);
  const baum = useMemo(() => eroeffnungsbaum(daten, wahl), [daten, wahl]);
  const aendern = (teil: Partial<typeof wahl>) => setzeWahl((alt) => ({ ...alt, ...teil }));
  const quelle = { art: "eroeffnung", ...wahl, praxis: wahl.praxis || nurLichess } as const;
  const oeffne = () => navigiere(varianteAnsicht(alsWert(quelle)));
  return (
    <div className="neuquelle" data-testid="varianten-eroeffnung">
      <Eroeffnungsliste
        daten={daten}
        wert={wahl.schluessel}
        beiWahl={(schluessel) => aendern({ schluessel })}
      />
      {!nurLichess && <Herkunftswahl buch={wahl.buch} praxis={wahl.praxis} beiWahl={aendern} />}
      {(wahl.praxis || nurLichess) && (
        <Bandwahl daten={daten} band={wahl.band} beiWahl={(band) => aendern({ band })} />
      )}
      <Vorschau baum={baum} />
      <button type="button" className="knopf-haupt" disabled={!baum} onClick={oeffne}>
        {t("varianten.neu.oeffnen")}
      </button>
    </div>
  );
}

/** Unterseite „Eröffnung“: lädt die Daten, dann die Wahl. */
export function EroeffnungWahl() {
  const daten = useDaten(ladeEroeffnungsdaten, "varianten-eroeffnungen-1");
  const wertung = useSpeicher((z) => eigeneWertung(z.daten)?.wert ?? null);
  if (daten.art === "laedt") return <p className="lade">…</p>;
  if (daten.art === "fehler")
    return <p className="fehlertext">{t("buch.ladefehler", { fehler: daten.meldung })}</p>;
  const band = bandindexFuer(daten.wert.fortsetzungen, wertung ?? WERTUNG_OHNE_PARTIEN);
  return <EroeffnungsForm daten={daten.wert} band={band} />;
}

/** Unterseite „Studie“: die Studien aus Kapitel 10 mit ihrer ersten Abbildung. */
export function StudienWahl() {
  const { navigiere } = useNavigation();
  const kapitel = useDaten(() => ladeKapitel(KAPITEL_STUDIEN), `kapitel-${KAPITEL_STUDIEN}`);
  if (kapitel.art === "laedt") return <p className="lade">…</p>;
  if (kapitel.art === "fehler")
    return <p className="fehlertext">{t("buch.ladefehler", { fehler: kapitel.meldung })}</p>;
  const k = kapitel.wert;
  const studien = k.beispiele
    .filter(
      (b) => b.status !== "konstruiert" && b.abschnitt !== null && ABSCHNITT.test(b.abschnitt),
    )
    .flatMap((b) => {
      const erste = k.abbildungen.find((a) => a.beispiel?.id === b.id);
      return erste ? [{ id: b.id, titel: b.titel, nummer: erste.id }] : [];
    });
  return (
    <ul className="quellenliste neuquelle" data-testid="varianten-studien">
      {studien.map((s) => (
        <li key={s.id}>
          <button
            type="button"
            className="knopf-zweit"
            onClick={() =>
              navigiere(
                varianteAnsicht(alsWert({ art: "abbildung", nummer: s.nummer, pfad: null })),
              )
            }
          >
            {t("abbildung.titel", { nummer: s.nummer })} · {s.titel}
          </button>
        </li>
      ))}
    </ul>
  );
}

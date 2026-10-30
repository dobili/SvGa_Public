/**
 * Taktiktrainer: Wahl der Quelle (Buch oder Zusatzaufgaben) und Wahl der Zusatzaufgaben.
 *
 * Rolle im Gesamtbild: Wunsch des Autors (30.10.2026, Paket 8): Lichess-Aufgaben je Thema des
 * Buches als „Zusatzaufgaben (nicht aus dem Buch)“. Oben im Taktiktrainer wählt der Leser „Aus dem
 * Buch“ (Vorgabe, wie bisher) oder „Zusatzaufgaben (Lichess)“; bei den Zusatzaufgaben dann Thema
 * und Stufe. Die Kennzeichnung sagt, dass es Zusatzinhalt ist und woher er stammt.
 * Abhängigkeiten: training/zusatzaufgaben.ts, Auswahlliste, Stufenwahl, i18n.
 */
import { useState } from "react";
import { t } from "../../i18n/sprache";
import {
  ZUSATZTHEMENLISTE,
  zusatzJeThema,
  type Zusatzaufgabe,
  type Zusatzthema,
  type Zusatzwahl,
} from "../../training/zusatzaufgaben";
import { Knopfsymbol } from "../komponenten/bausteine/Knopfsymbol";
import type { Ladezustand } from "../komponenten/bausteine/useDaten";
import { Auswahlliste } from "./Auswahlliste";
import { Stufenwahl } from "./Stufenwahl";

/** Woher die Aufgaben einer Runde kommen. */
export type Taktikquelle = "buch" | "zusatz";
const QUELLEN: readonly Taktikquelle[] = ["buch", "zusatz"];

/** Die Wahl „Aus dem Buch“ | „Zusatzaufgaben (Lichess)“. */
export function Quellenwahl({
  quelle,
  setze,
}: {
  quelle: Taktikquelle;
  setze: (quelle: Taktikquelle) => void;
}) {
  return (
    <>
      <fieldset className="zahlwahl" data-testid="taktik-quelle">
        <legend>{t("zusatzaufgaben.quelle")}</legend>
        {QUELLEN.map((q) => (
          <button
            key={q}
            type="button"
            className="chip"
            aria-pressed={quelle === q}
            onClick={() => setze(q)}
          >
            {t(q === "buch" ? "zusatzaufgaben.ausBuch" : "zusatzaufgaben.zusatz")}
          </button>
        ))}
      </fieldset>
      <p className="hinweis" data-testid="taktik-quellenhinweis">
        {t(quelle === "buch" ? "zusatzaufgaben.buchHinweis" : "zusatzaufgaben.kennzeichnung")}
      </p>
    </>
  );
}

/** Thema und Stufe der Zusatzaufgaben, dann „Runde starten“. */
export function ZusatzWahl({
  zustand,
  starte,
}: {
  zustand: Ladezustand<Zusatzaufgabe[]>;
  starte: (wahl: Zusatzwahl) => void;
}) {
  const [thema, setzeThema] = useState<Zusatzthema | "gemischt">("gemischt");
  const [stufe, setzeStufe] = useState<number | null>(null);
  if (zustand.art === "laedt") return <p className="lade">…</p>;
  if (zustand.art === "fehler")
    return <p className="fehlertext">{t("buch.ladefehler", { fehler: zustand.meldung })}</p>;
  const anzahl = zusatzJeThema(zustand.wert);
  const themen = (["gemischt", ...ZUSATZTHEMENLISTE] as const).filter(
    (th) => (anzahl.get(th) ?? 0) > 0,
  );
  return (
    <>
      <Auswahlliste
        titel={t("taktiktrainer.thema")}
        eintraege={themen.map((th) => ({
          wert: th,
          text: `${th === "gemischt" ? t("zusatzaufgaben.gemischt") : t(`zusatzaufgaben.thema.${th}`)} (${anzahl.get(th)})`,
        }))}
        wert={thema}
        setze={setzeThema}
        testkennung="zusatz-thema"
      />
      <Stufenwahl stufe={stufe} setze={setzeStufe} erklaerung={t("zusatzaufgaben.stufenText")} />
      <button
        type="button"
        className="knopf-haupt"
        data-testid="zusatz-starten"
        onClick={() => starte({ thema, stufe })}
      >
        <Knopfsymbol art="starten" />
        {t("taktiktrainer.starten")}
      </button>
    </>
  );
}

/**
 * Unterseite „Meisterpartie“ des Blatts „Neue Variante aus …“: Partien zum Durchspielen und
 * Verzweigen.
 *
 * Rolle im Gesamtbild: Variationsbrowser, Stufe 4. Wunsch des Autors (1.11.2026): Statt der
 * Studien aus Kapitel 10 bietet das Blatt Meisterpartien an, genau die von „Zug erraten“:
 * die Meisterpartien des Buches (Kapitel 11, geöffnet wie eine Abbildung, mit den Varianten und
 * Zeichen des Buches), berühmte Klassiker und aktuelle Turnierpartien (Zusatzinhalt mit Quelle
 * und Lizenz, training/zusatzpartien.ts; geöffnet als Zugfolge ab der Grundstellung).
 * Abhängigkeiten: training/studientrainer.ts (meisterpartienAus), training/zusatzpartien.ts,
 * daten/laden.ts, variantenwert.ts, Navigation, i18n.
 */
import { useState } from "react";
import { useNavigation } from "../../../app/navigationsKontext";
import { ladeKapitel, ladeZusatzpartien } from "../../../daten/laden";
import { sprache, t } from "../../../i18n/sprache";
import { GRUNDSTELLUNG } from "../../../training/lernsammlung";
import { meisterpartienAus } from "../../../training/studientrainer";
import {
  PARTIEQUELLEN,
  partietitel,
  type Partiequelle,
  type Zusatzpartie,
} from "../../../training/zusatzpartien";
import { useDaten } from "../bausteine/useDaten";
import { alsWert, varianteAnsicht } from "./variantenwert";

/** Kapitel der Meisterpartien („Meisterpartien“). */
const KAPITEL_MEISTERPARTIEN = 11;
/** Zugtrenner der Zusatzpartien (englische Kurznotation, durch Leerzeichen getrennt). */
const ZUGTRENNER = " ";

const QUELLENTEXT = {
  buch: "zugerraten.quelleBuch",
  klassiker: "zugerraten.quelleKlassiker",
  turnier: "zugerraten.quelleTurnier",
} as const;

/** Ein Eintrag der Liste: Beschriftung und Ziel. */
interface Partiezeile {
  readonly id: string;
  readonly text: string;
  readonly wert: string;
}

/** Die Liste der Partien als Knöpfe. */
function Partieliste({ zeilen }: { zeilen: readonly Partiezeile[] }) {
  const { navigiere } = useNavigation();
  return (
    <ul className="quellenliste" data-testid="varianten-meisterpartien">
      {zeilen.map((z) => (
        <li key={z.id}>
          <button
            type="button"
            className="knopf-zweit"
            onClick={() => navigiere(varianteAnsicht(z.wert))}
          >
            {z.text}
          </button>
        </li>
      ))}
    </ul>
  );
}

/** Die Meisterpartien des Buches, je mit ihrer ersten Abbildung. */
function Buchpartien() {
  const kapitel = useDaten(
    () => ladeKapitel(KAPITEL_MEISTERPARTIEN),
    `kapitel-${KAPITEL_MEISTERPARTIEN}`,
  );
  if (kapitel.art === "laedt") return <p className="lade">…</p>;
  if (kapitel.art === "fehler")
    return <p className="fehlertext">{t("buch.ladefehler", { fehler: kapitel.meldung })}</p>;
  const k = kapitel.wert;
  const zeilen = meisterpartienAus(k).flatMap((b) => {
    const erste = k.abbildungen.find((a) => a.beispiel?.id === b.id);
    if (!erste) return [];
    const titel = b.titel.replace(/\\,/g, " ");
    const wert = alsWert({ art: "abbildung", nummer: erste.id, pfad: null });
    return [{ id: b.id, text: `${t("abbildung.titel", { nummer: erste.id })} · ${titel}`, wert }];
  });
  return <Partieliste zeilen={zeilen} />;
}

/** Eine Zusatzpartie als Zeile, mit demselben Titel wie bei „Zug erraten“ (partietitel). */
function zusatzzeile(p: Zusatzpartie): Partiezeile {
  const titel = partietitel(p, sprache());
  const zuege = p.zuege.split(ZUGTRENNER).filter(Boolean);
  const wert = alsWert({ art: "linie", titel, fen: GRUNDSTELLUNG, zuege });
  return { id: p.id, text: titel, wert };
}

/** Klassiker oder Turnierpartien aus den Zusatzpartien. */
function Zusatzpartien({ art }: { art: Exclude<Partiequelle, "buch"> }) {
  const partien = useDaten(ladeZusatzpartien, "zusatzpartien");
  if (partien.art === "laedt") return <p className="lade">…</p>;
  if (partien.art === "fehler")
    return (
      <p className="fehlertext">{t("zugerraten.zusatzLadefehler", { fehler: partien.meldung })}</p>
    );
  const zeilen = partien.wert.filter((p) => p.art === art).map(zusatzzeile);
  return (
    <>
      <p className="hinweis">{t("zugerraten.zusatzinhalt")}</p>
      <Partieliste zeilen={zeilen} />
    </>
  );
}

/** Unterseite „Meisterpartie“: Quelle wählen, dann die Partie. */
export function MeisterpartienWahl() {
  const [quelle, setzeQuelle] = useState<Partiequelle>("buch");
  return (
    <div className="neuquelle">
      <label className="feld">
        <span>{t("zugerraten.quelle")}</span>
        <select
          className="textfeld"
          value={quelle}
          data-testid="meisterpartien-quelle"
          onChange={(e) => {
            const neu = PARTIEQUELLEN.find((q) => q === e.target.value);
            if (neu) setzeQuelle(neu);
          }}
        >
          {PARTIEQUELLEN.map((q) => (
            <option key={q} value={q}>
              {t(QUELLENTEXT[q])}
            </option>
          ))}
        </select>
      </label>
      {quelle === "buch" ? <Buchpartien /> : <Zusatzpartien art={quelle} />}
    </div>
  );
}

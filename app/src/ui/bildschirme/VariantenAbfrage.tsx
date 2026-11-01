/**
 * Bildschirm „Variante abfragen“: eine eigene Variante Zug für Zug spielen lassen, Seite
 * wählbar, mit Rückmeldung; auch alle Varianten eines Lernsammlungs- oder Fehlereintrags.
 *
 * Rolle im Gesamtbild: Variationsbrowser, Stufe 4 (Konzept „später denkbar“, Wunsch des Autors
 * vom 1.11.2026: „im Variationsbrowser ‚Abfragen‘, wie im Repertoire-Trainer“). Vor dem Start
 * wählt der Leser die Seite (Vorgabe: wer an der Startstellung am Zug ist) und, wenn die Variante
 * an einer späteren Stelle geöffnet war, ob ab dort oder ab dem Anfang. Mehrere Varianten (eines
 * Eintrags) kommen nacheinander. Gespeichert wird nichts. Eingetragen in app/zusatzansichten.ts
 * unter „variante-abfrage“ (Wert: variantenwert.ts, abfrageAus).
 * Abhängigkeiten: Variantenabfrage.tsx, variantenwert.ts, training/variationen.ts, Speicher,
 * Navigation, i18n.
 */
import type { Color } from "chessops/types";
import { useMemo, useState } from "react";
import { useNavigation } from "../../app/navigationsKontext";
import { t } from "../../i18n/sprache";
import { fenAm, type Pfad } from "../../schach/variationsbaum";
import { useSpeicher } from "../../speicher/speicher";
import { variationenZu, type Variation } from "../../training/variationen";
import { Kopfzeile } from "../komponenten/rahmen/Kopfzeile";
import { Variantenabfrage, type Abfrageergebnis } from "../komponenten/varianten/Variantenabfrage";
import { abfrageAus, type Abfragewert } from "../komponenten/varianten/variantenwert";
import "../stil/spielenneu.css";

/** Eine abzufragende Variante mit ihrem Startpunkt. */
interface Abfrageteil {
  readonly variation: Variation;
  readonly pfad: Pfad;
}

/** Die Varianten zum Wert: eine ab dem Pfad, oder alle des Eintrags ab ihrem Startpunkt. */
function teileZu(liste: readonly Variation[], wert: Abfragewert | null): Abfrageteil[] {
  if (!wert) return [];
  if (wert.art === "variante") {
    const v = liste.find((x) => x.id === wert.id);
    return v ? [{ variation: v, pfad: wert.pfad }] : [];
  }
  return variationenZu(liste, wert).map((v) => ({ variation: v, pfad: v.startpfad }));
}

/** Wer an der Stellung am Ende des Pfades am Zug ist. */
function amZug(teil: Abfrageteil | undefined): Color {
  const fen = teil ? fenAm(teil.variation, teil.pfad) : null;
  return fen?.split(" ")[1] === "b" ? "black" : "white";
}

/** Die Seite des Lesers: Weiß oder Schwarz. */
function Seitenwahl({ seite, beiWahl }: { seite: Color; beiWahl: (s: Color) => void }) {
  return (
    <div className="chipzeile" role="group" aria-label={t("variantenabfrage.seite")}>
      {(["white", "black"] as const).map((s) => (
        <button
          key={s}
          type="button"
          className="chip"
          aria-pressed={seite === s}
          onClick={() => beiWahl(s)}
        >
          {t(s === "white" ? "farbe.w" : "farbe.b")}
        </button>
      ))}
    </div>
  );
}

/** Auswahl vor dem Start: Seite und Startpunkt. */
function Vorbereitung({
  teile,
  beiStart,
}: {
  teile: readonly Abfrageteil[];
  beiStart: (seite: Color, abAnfang: boolean) => void;
}) {
  const [seite, setzeSeite] = useState<Color>(() => amZug(teile[0]));
  const [abAnfang, setzeAbAnfang] = useState(false);
  const mitStelle = teile.length === 1 && (teile[0]?.pfad.length ?? 0) > 0;
  return (
    <section className="karte" data-testid="abfrage-vorbereitung" data-tour="abfrage-vorbereitung">
      <p className="hinweis">{t("variantenabfrage.einleitung")}</p>
      <Seitenwahl seite={seite} beiWahl={setzeSeite} />
      {mitStelle && (
        <label className="schalterzeile">
          <input
            type="checkbox"
            checked={abAnfang}
            onChange={(e) => setzeAbAnfang(e.target.checked)}
          />
          <span>{t("variantenabfrage.abAnfang")}</span>
        </label>
      )}
      <button
        type="button"
        className="knopf-haupt"
        onClick={() => beiStart(seite, abAnfang)}
        data-testid="abfrage-start"
      >
        {t("variantenabfrage.start")}
      </button>
    </section>
  );
}

/** Ergebnis aller Varianten zusammen. */
function Ende({ ergebnis, nochmal }: { ergebnis: Abfrageergebnis; nochmal: () => void }) {
  const { zurueck } = useNavigation();
  return (
    <section className="karte" data-testid="abfrage-ende">
      <h2 className="karte-titel">{t("variantenabfrage.ende")}</h2>
      <p>
        {t("variantenabfrage.ergebnis", { richtig: ergebnis.richtig, anzahl: ergebnis.gefragt })}
      </p>
      <div className="knopfreihe">
        <button type="button" className="knopf-haupt" onClick={nochmal}>
          {t("variantenabfrage.nochmal")}
        </button>
        <button type="button" className="knopf-zweit" onClick={zurueck}>
          {t("varianten.zurueck")}
        </button>
      </div>
    </section>
  );
}

/** Ablauf: Vorbereitung, dann die Varianten nacheinander, am Ende das Ergebnis. */
function Ablauf({ teile }: { teile: readonly Abfrageteil[] }) {
  const [lauf, setzeLauf] = useState<{ seite: Color; abAnfang: boolean } | null>(null);
  const [stelle, setzeStelle] = useState(0);
  const [summe, setzeSumme] = useState<Abfrageergebnis>({ richtig: 0, gefragt: 0 });
  const [runde, setzeRunde] = useState(0);
  if (!lauf)
    return (
      <Vorbereitung teile={teile} beiStart={(seite, abAnfang) => setzeLauf({ seite, abAnfang })} />
    );
  const teil = teile[stelle];
  if (!teil) {
    const nochmal = () => {
      setzeStelle(0);
      setzeSumme({ richtig: 0, gefragt: 0 });
      setzeRunde(runde + 1);
    };
    return <Ende ergebnis={summe} nochmal={nochmal} />;
  }
  const fertig = (e: Abfrageergebnis) => {
    setzeSumme({ richtig: summe.richtig + e.richtig, gefragt: summe.gefragt + e.gefragt });
    setzeStelle(stelle + 1);
  };
  return (
    <>
      {teile.length > 1 && (
        <h2 className="abschnitt-titel">{teil.variation.titel || t("varianten.ohneTitel")}</h2>
      )}
      <Variantenabfrage
        key={`${runde}-${stelle}`}
        variation={teil.variation}
        start={lauf.abAnfang ? [] : teil.pfad}
        seite={lauf.seite}
        beiEnde={fertig}
      />
    </>
  );
}

/** Der Bildschirm; ``wert`` nennt die Variante (mit Pfad) oder den Eintrag. */
export function VariantenAbfrage({ wert }: { wert: string | null }) {
  const liste = useSpeicher((z) => z.daten.variationen);
  const geladen = useSpeicher((z) => z.geladen);
  const aktuell = useMemo(() => teileZu(liste, abfrageAus(wert)), [liste, wert]);
  return (
    <div className="bildschirm bildschirm-variantenabfrage" data-testid="varianten-abfrage">
      <Kopfzeile titel={t("variantenabfrage.titel")} zurueckText={t("varianten.zurueck")} />
      {!geladen && <p className="lade">…</p>}
      {geladen && aktuell.length === 0 && <p className="fehlertext">{t("varianten.fehlt")}</p>}
      {geladen && aktuell.length > 0 && <Ablauf teile={aktuell} />}
    </div>
  );
}

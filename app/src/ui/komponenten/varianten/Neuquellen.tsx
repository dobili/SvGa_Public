/**
 * Die Unterseiten des Blatts „Neue Variante aus …“: Abbildung, Partie, Fehler, Lernsammlung,
 * PGN oder FEN einfügen.
 *
 * Rolle im Gesamtbild: Frage h (Empfehlung B). Jede Unterseite endet mit einem Sprung zum
 * Bildschirm „Variante“ (variantenwert.ts); nur der PGN-Import speichert sofort, weil der Leser
 * dort ausdrücklich etwas einliest. An einer ausgewerteten Partie gibt es den Schalter
 * „Engine-Folgen übernehmen“ (Vorgabe aus, Ergänzung des Autors vom 1.11.2026).
 * Abhängigkeiten: speicher, spiel/variationspgn.ts, schach/stellung.ts, training/variationen.ts,
 * Navigation, i18n.
 */
import { useState } from "react";
import { useNavigation } from "../../../app/navigationsKontext";
import { datumText, t } from "../../../i18n/sprache";
import { stellungAusFen } from "../../../schach/stellung";
import { aendere, speicherzustand, useSpeicher } from "../../../speicher/speicher";
import { variationAusPgn } from "../../../spiel/variationspgn";
import {
  grenzeFuer,
  mitVariation,
  neueVariationskennung,
  type Variation,
} from "../../../training/variationen";
import { alsWert, varianteAnsicht, type Entwurfsquelle } from "./variantenwert";

/** Höchstens so viele Einträge zeigen die Listen der Quellen (neueste zuerst). */
const LISTENLAENGE = 30;

/** Öffnet einen Entwurf aus einer Quelle. */
function useOeffne() {
  const { navigiere } = useNavigation();
  return (quelle: Entwurfsquelle) => navigiere(varianteAnsicht(alsWert(quelle)));
}

/** Nummer einer Abbildung eingeben („2.40“). */
export function AbbildungWahl() {
  const oeffne = useOeffne();
  const [nummer, setzeNummer] = useState("");
  const gueltig = /^\d{1,2}\.\d{1,3}$/.test(nummer.trim());
  return (
    <form
      className="neuquelle"
      onSubmit={(e) => {
        e.preventDefault();
        if (gueltig) oeffne({ art: "abbildung", nummer: nummer.trim(), pfad: null });
      }}
    >
      <label className="feld">
        <span>{t("varianten.neu.abbildungNummer")}</span>
        <input
          type="text"
          inputMode="decimal"
          placeholder="2.40"
          value={nummer}
          onChange={(e) => setzeNummer(e.target.value)}
        />
      </label>
      <button type="submit" className="knopf-haupt" disabled={!gueltig}>
        {t("varianten.neu.oeffnen")}
      </button>
    </form>
  );
}

/** Die gespeicherten Partien mit dem Schalter für die Engine-Folgen. */
export function PartieWahl() {
  const oeffne = useOeffne();
  const partien = useSpeicher((z) => z.daten.spiel.partien);
  const [engine, setzeEngine] = useState(false);
  if (partien.length === 0) return <p className="hinweis">{t("varianten.neu.keinePartien")}</p>;
  return (
    <div className="neuquelle">
      <label className="schalterzeile">
        <input type="checkbox" checked={engine} onChange={(e) => setzeEngine(e.target.checked)} />
        <span>{t("varianten.engine.schalter")}</span>
      </label>
      <ul className="quellenliste">
        {partien.slice(0, LISTENLAENGE).map((e) => (
          <li key={e.partie.id}>
            <button
              type="button"
              className="knopf-zweit"
              onClick={() => oeffne({ art: "partie", id: e.partie.id, stelle: 0, engine })}
            >
              {t("varianten.neu.partieZeile", {
                datum: datumText(new Date(e.partie.begonnen)),
                zuege: e.partie.zuege.length,
              })}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Einträge der Fehlerdatenbank oder der Lernsammlung, neueste zuerst. */
export function EintragWahl({ art }: { art: "fehler" | "sammlung" }) {
  const oeffne = useOeffne();
  const fehler = useSpeicher((z) => z.daten.fehler);
  const sammlung = useSpeicher((z) => z.daten.sammlung);
  const eintraege =
    art === "fehler"
      ? fehler.map((f) => ({ id: f.id, datum: f.datum, text: f.satz }))
      : sammlung.map((s) => ({ id: s.id, datum: s.datum, text: s.eroeffnung || s.plan }));
  if (eintraege.length === 0) return <p className="hinweis">{t(`varianten.neu.leer.${art}`)}</p>;
  return (
    <ul className="quellenliste neuquelle">
      {[...eintraege]
        .reverse()
        .slice(0, LISTENLAENGE)
        .map((e) => (
          <li key={e.id}>
            <button type="button" className="knopf-zweit" onClick={() => oeffne({ art, id: e.id })}>
              {datumText(new Date(e.datum))}
              {e.text ? ` · ${e.text}` : ""}
            </button>
          </li>
        ))}
    </ul>
  );
}

/** Speichert eine eingelesene Variante sofort; null an einer Grenze. */
function speichereEingelesene(v: Variation): string | null {
  const neu = { ...v, id: neueVariationskennung(new Date()) };
  if (grenzeFuer(speicherzustand().daten.variationen, neu)) return null;
  void aendere((daten) => {
    const ergebnis = mitVariation(daten.variationen, neu);
    return "liste" in ergebnis ? { ...daten, variationen: ergebnis.liste } : daten;
  });
  return neu.id;
}

/** Ein Text sieht aus wie eine FEN (Brett mit Schrägstrichen, keine PGN-Kopfzeilen und Züge). */
function alsFen(text: string): string | null {
  const roh = text.trim();
  if (!roh.includes("/") || roh.includes("[") || /\d\./.test(roh)) return null;
  const gelesen = stellungAusFen(roh);
  return gelesen.ok ? gelesen.wert.fen : null;
}

/** Ergebnis des Einlesens als Satz für den Leser; null, wenn es geklappt hat. */
function einlesen(
  text: string,
  oeffne: (q: Entwurfsquelle) => void,
  navigiere: (id: string) => void,
): string | null {
  const fen = alsFen(text);
  if (fen) {
    oeffne({ art: "fen", fen });
    return null;
  }
  const ergebnis = variationAusPgn(text, t("varianten.titel.pgn"), new Date());
  if (!ergebnis.ok) return t(`varianten.pgnFehler.${ergebnis.fehler.art}`);
  const id = speichereEingelesene(ergebnis.variation);
  if (!id) return t("varianten.grenze.varianten");
  navigiere(id);
  return ergebnis.gekuerzt ? t("varianten.pgnGekuerzt") : null;
}

/** PGN oder FEN einfügen, auch aus einer Datei. */
export function EinfuegenWahl() {
  const oeffne = useOeffne();
  const { navigiere } = useNavigation();
  const [text, setzeText] = useState("");
  const [meldung, setzeMeldung] = useState<string | null>(null);
  const datei = (liste: FileList | null) => {
    const erste = liste?.[0];
    if (erste)
      void erste
        .text()
        .then(setzeText, (fehler: unknown) => console.warn("Datei nicht lesbar:", fehler));
  };
  return (
    <div className="neuquelle" data-testid="varianten-einfuegen">
      <label className="feld">
        <span>{t("varianten.neu.einfuegenFeld")}</span>
        <textarea rows={6} value={text} onChange={(e) => setzeText(e.target.value)} />
      </label>
      <input
        type="file"
        accept=".pgn,.txt,text/plain"
        aria-label={t("varianten.neu.datei")}
        onChange={(e) => datei(e.target.files)}
      />
      <button
        type="button"
        className="knopf-haupt"
        disabled={text.trim() === ""}
        onClick={() => setzeMeldung(einlesen(text, oeffne, (id) => navigiere(varianteAnsicht(id))))}
      >
        {t("varianten.neu.einlesen")}
      </button>
      {meldung && <p className="fehlertext">{meldung}</p>}
    </div>
  );
}

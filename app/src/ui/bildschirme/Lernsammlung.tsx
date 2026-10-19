/**
 * Bildschirm „Lernsammlung“: eigene Stellungen nach Eröffnung geordnet, abfragen, als PGN für
 * eine Lichess-Studie ausgeben, neue Stellung als FEN eintragen.
 *
 * Rolle im Gesamtbild: Pflichtenheft Stufe 3 (AP 15), Konzept 4.7; ersetzt seit 0.2.93 den
 * Platzhalter „Lernsammlung folgt später“. Erreichbar über die Karte „Lernsammlung“ im Training
 * und nach jedem Speichern („Lernsammlung öffnen“). Einträge kommen meist von der Abbildung,
 * aus dem Rückblick einer Partie oder nach einer Trainer-Aufgabe („In die Lernsammlung“).
 * Abhängigkeiten: training/lernsammlung.ts, training/sammlungpgn.ts, SammelFormular,
 * Sammeleintrag, SammelAbfrage, dateiAnbieten.ts, Speicher, i18n.
 * Buchbezug: Kapitel 12, Abschnitt 12.4 „Lernsammlung“.
 */
import { useState } from "react";
import { t } from "../../i18n/sprache";
import { stellungAusFen } from "../../schach/stellung";
import { useSpeicher } from "../../speicher/speicher";
import { nachEroeffnung, type Sammeleintrag } from "../../training/lernsammlung";
import { sammlungAlsPgn } from "../../training/sammlungpgn";
import { bieteDateiAn } from "../komponenten/dateiAnbieten";
import { Kopfzeile } from "../komponenten/Kopfzeile";
import { SammelAbfrage } from "../komponenten/SammelAbfrage";
import { SammeleintragKarte } from "../komponenten/Sammeleintrag";
import { SammelFormular } from "../komponenten/SammelFormular";
import { pgntexte } from "../komponenten/sammeltexte";
import { Trainerbrett } from "../trainer/Trainerbrett";

/** Neue Stellung als FEN, etwa aus einer Vereinspartie. */
function NeueStellung() {
  const [fen, setzeFen] = useState("");
  const gelesen = fen.trim() === "" ? null : stellungAusFen(fen.trim());
  const gueltig = gelesen?.ok ? gelesen.wert.fen : null;
  return (
    <details className="karte" data-testid="sammlung-neu">
      <summary className="karte-titel">{t("sammlung.neu")}</summary>
      <p className="hinweis">{t("sammlung.neuHinweis")}</p>
      <input
        type="text"
        className="suchfeld"
        aria-label={t("sammlung.fen")}
        placeholder={t("sammlung.fen")}
        value={fen}
        onChange={(e) => setzeFen(e.target.value)}
      />
      {gelesen && !gelesen.ok && <p className="fehlertext">{t("sammlung.fenUngueltig")}</p>}
      {gueltig && <Trainerbrett fen={gueltig} beschriftung={t("sammlung.stellung")} />}
      <SammelFormular
        key={gueltig ?? "leer"}
        fen={gueltig}
        herkunft={{ herkunft: "fen", quelle: "" }}
      />
    </details>
  );
}

/** Kopieren und Sichern als PGN; Datei mit Datum im Namen. */
function PgnKnoepfe({ liste, name }: { liste: readonly Sammeleintrag[]; name: string }) {
  const [meldung, setzeMeldung] = useState<string | null>(null);
  const text = sammlungAlsPgn(liste, pgntexte());
  const kopiere = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setzeMeldung(t("sammlung.pgnKopiert"));
    } catch (fehler) {
      console.warn("Zwischenablage nicht verfügbar:", fehler);
      setzeMeldung(t("sammlung.pgnNichtKopiert"));
    }
  };
  const datei = `lernsammlung-${name}-${new Date().toISOString().slice(0, "JJJJ-MM-TT".length)}.pgn`;
  return (
    <div className="pgn">
      <div className="knopfreihe">
        <button type="button" className="knopf-zweit" onClick={() => void kopiere()}>
          {t("sammlung.pgnKopieren")}
        </button>
        <button
          type="button"
          className="knopf-zweit"
          onClick={() => bieteDateiAn(text, datei, "application/vnd.chess-pgn")}
        >
          {t("sammlung.pgnSichern")}
        </button>
      </div>
      {meldung && <p className="hinweis">{meldung}</p>}
      {meldung === t("sammlung.pgnNichtKopiert") && <pre className="vorformatiert">{text}</pre>}
    </div>
  );
}

/** Dateiname einer Gruppe: „spanische-partie“. */
function kurzname(eroeffnung: string): string {
  return (
    eroeffnung
      .toLowerCase()
      .replace(/ä/g, "ae")
      .replace(/ö/g, "oe")
      .replace(/ü/g, "ue")
      .replace(/ß/g, "ss")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "ohne-eroeffnung"
  );
}

/** Die Gruppen nach Eröffnung, je mit Abfrage und PGN der Gruppe. */
function Gruppen({
  liste,
  frage,
}: {
  liste: readonly Sammeleintrag[];
  frage: (eintraege: readonly Sammeleintrag[]) => void;
}) {
  return nachEroeffnung(liste).map((gruppe) => {
    const titel = gruppe.eroeffnung || t("sammlung.ohneEroeffnung");
    return (
      <details key={gruppe.eroeffnung} className="karte" data-testid="sammelgruppe">
        <summary className="karte-titel">
          {t("sammlung.gruppe", { name: titel, anzahl: gruppe.eintraege.length })}
        </summary>
        {gruppe.eintraege.map((e) => (
          <SammeleintragKarte key={e.id} eintrag={e} />
        ))}
        <button type="button" className="knopf-zweit" onClick={() => frage(gruppe.eintraege)}>
          {t("sammlung.gruppeAbfragen")}
        </button>
        <PgnKnoepfe liste={gruppe.eintraege} name={kurzname(gruppe.eroeffnung)} />
      </details>
    );
  });
}

/** Ganze Sammlung: abfragen und als PGN für Lichess, mit kurzer Anleitung. */
function Gesamt({
  liste,
  frage,
}: {
  liste: readonly Sammeleintrag[];
  frage: (eintraege: readonly Sammeleintrag[]) => void;
}) {
  return (
    <section className="karte">
      <h2 className="karte-titel">{t("sammlung.alle", { anzahl: liste.length })}</h2>
      <button type="button" className="knopf-haupt" onClick={() => frage(liste)}>
        {t("sammlung.abfragen")}
      </button>
      <p className="hinweis">{t("sammlung.lichessHinweis")}</p>
      <PgnKnoepfe liste={liste} name="alle" />
    </section>
  );
}

export function Lernsammlung() {
  const liste = useSpeicher((z) => z.daten.sammlung);
  const [abfrage, setzeAbfrage] = useState<readonly Sammeleintrag[] | null>(null);
  return (
    <div className="bildschirm" data-testid="lernsammlung">
      <Kopfzeile titel={t("sammlung.titel")} zurueckText={t("trainer.zurueck")} />
      {abfrage ? (
        <SammelAbfrage liste={abfrage} beiEnde={() => setzeAbfrage(null)} />
      ) : (
        <>
          <p className="hinweis">{t("sammlung.einleitung")}</p>
          {liste.length === 0 ? (
            <p className="hinweis" data-testid="sammlung-leer">
              {t("sammlung.leer")}
            </p>
          ) : (
            <>
              <Gesamt liste={liste} frage={setzeAbfrage} />
              <Gruppen liste={liste} frage={setzeAbfrage} />
            </>
          )}
          <NeueStellung />
        </>
      )}
    </div>
  );
}

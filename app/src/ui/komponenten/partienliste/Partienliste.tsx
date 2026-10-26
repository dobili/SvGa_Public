/**
 * Laufende Partie zum Fortsetzen und die letzten beendeten Partien (Bereich Spielen).
 *
 * Rolle im Gesamtbild: Die laufende Partie übersteht das Schließen der App (Speicher Format 2);
 * hier geht es mit einem Tipp weiter. Beendete Partien öffnen den Partie-Bildschirm mit Ergebnis,
 * Auswertung und PGN (Pflichtenheft 5.3).
 * Seit 0.2.40 (Wunsch des Autors): je Partie eine kleine Figur in der gespielten Farbe (König im
 * gewählten Figurensatz) und die erreichte Spielstärke oder Genauigkeit des Lesers. Seit 0.2.83
 * darüber die Karte „Deine Spielstärke“ (LetzteSpielstaerke.tsx; seit 0.2.139 unter Spielen).
 * Seit 0.2.99 (Wunsch des Autors vom 19.10.2026): Porträt des Gegners je Partie, Filter nach
 * Ergebnis und Wertung, „Weitere Partien zeigen“ und Löschen ungewerteter Partien mit Nachfrage.
 * Seit 0.2.117: Filter und Sortierung als Symbole, mehrere zugleich (Partienfilterleiste.tsx), und
 * „Partie einlesen (PGN)“ (PgnImport.tsx), auch wenn noch keine Partie gespielt ist.
 * Seit 25.10.2026 steht vor der Zeitangabe das Zeichen der Zeitart wie in der Bedenkzeit-Auswahl
 * (Wunsch des Autors); der Name bleibt als Text daneben, damit es nicht nur am Zeichen hängt.
 * Seit 0.2.142 baut Partiezeile.tsx jede Zeile (Gegner links, Ergebnis, Farbe, Zeitart und Zahlen
 * auf einen Blick, Datum und Züge klein); gelöscht wird im Löschmodus (PartieLoeschen.tsx): Papierkorb
 * neben Filter und Sortieren, Partien antippen, „Ausgewählte löschen“.
 * Abhängigkeiten: Partiezeile, PartieLoeschen, spiel/partie.ts, spiel/wertung.ts, speicher/partien.ts,
 * engine/stufen.ts, Navigation, i18n.
 */
import { useMemo, useState } from "react";
import { useNavigation } from "../../../app/navigationsKontext";
import { stufe } from "../../../engine/stufen";
import { datumText, t } from "../../../i18n/sprache";
import { gegnername } from "../../../engine/gegner";
import type { Partie } from "../../../spiel/partie";
import { staerkeDerPartie } from "../../../spiel/wertung";
import {
  OHNE_FILTER,
  passtZumFilter,
  sortiere,
  type Partienfilter,
  type Sortierung,
  type Sortierwerte,
} from "../../../spiel/partienfilter";
import { gegnerstaerke } from "../../../engine/botstaerke";
import type { Partieeintrag } from "../../../speicher/partien";
import { Partienfilterleiste } from "./Partienfilterleiste";
import { Loeschleiste, LoeschmodusKnopf } from "./PartieLoeschen";
import { Partiezeile, Zeitangabe } from "./Partiezeile";
import { PgnImport } from "./PgnImport";
import { Titelsymbol } from "../bausteine/Titelsymbol";

/** So viele beendete Partien zeigt die Liste zuerst, je Tipp auf „Weitere“ so viele mehr. */
const SICHTBAR = 10;
/** Ab so vielen Partien erscheint der Filter; bei wenigen wäre er nur Ballast. */
const FILTER_AB = 4;

/** „15.10.2026 · Stufe 2 · 23 Züge“ (laufende Partie); eingelesen „… · Anna – Ben · 30 Züge“. */
function zeile(partie: Partie): string {
  const datum = datumText(new Date(partie.begonnen));
  const zuege = Math.ceil(partie.zuege.length / 2);
  const importiert = partie.einstellung.importiert;
  if (importiert) return t("spielen.partiezeileImport", { datum, ...importiert, zuege });
  const s = stufe(partie.einstellung.stufe);
  const gegner =
    partie.einstellung.gegner === "mensch"
      ? t("spielen.gegner.mensch")
      : (gegnername(partie.einstellung.bot, partie.einstellung.botName) ??
        t("spielen.partieStufe", { nummer: s.nummer }));
  // Einzahl: „1 Zug“ statt „1 Züge“ (Befund beim Vorprüfen von N479, 19.10.2026).
  const schluessel = zuege === 1 ? "spielen.partiezeileEinZug" : "spielen.partiezeile";
  return t(schluessel, { datum, stufe: gegner, zuege });
}

/** Die Karte der laufenden Partie im Bereich Spielen: ein Tipp setzt sie fort. */
export function LaufendePartie({ partie }: { partie: Partie }) {
  const { navigiere } = useNavigation();
  return (
    <section
      className="karte laufende-partie"
      data-testid="laufende-partie"
      data-tour="spielen-laufend"
    >
      <h2 className="karte-titel">{t("spielen.laufend")}</h2>
      <p>
        {zeile(partie)}
        <Zeitangabe partie={partie} mitPunkt />
      </p>
      <button
        type="button"
        className="knopf-haupt"
        onClick={() => navigiere({ bildschirm: "partie", id: partie.id })}
      >
        {t("spielen.fortsetzen")}
      </button>
    </section>
  );
}

/** Zahlen zum Sortieren: Beginn, eigene Spielstärke in der Partie, Stärke des Gegners. */
function sortierwerte(eintrag: Partieeintrag): Sortierwerte {
  const e = eintrag.partie.einstellung;
  const mensch = e.gegner === "mensch";
  const eigene = mensch ? null : staerkeDerPartie(eintrag)?.[e.eigeneFarbe].spielstaerke;
  return {
    begonnen: eintrag.partie.begonnen,
    staerke: eigene ?? null,
    // Die feste Gegnerwertung der Partie (Zeitklasse, Gruppe, eigene Stufe wie in der Wertung).
    gegner: mensch ? null : gegnerstaerke(e),
  };
}

/**
 * Überschrift der Karte „Deine Partien“ im Stil der anderen Profilkarten (seit 25.10.2026 eine
 * eigene Karte statt eines Abschnitts ohne Rahmen: Wunsch des Autors nach klarer Trennung).
 */
function Partienkopf() {
  return (
    <h2 className="karte-titel">
      <Titelsymbol art="partien" />
      {t("spielen.partien")}
    </h2>
  );
}

/**
 * Die Liste der beendeten Partien im Bereich Spielen, mit Filter und Sortierung; ein Tipp öffnet
 * Ergebnis und Auswertung.
 */
export function Partienliste({ partien }: { partien: readonly Partieeintrag[] }) {
  const [filter, setzeFilter] = useState<Partienfilter>(OHNE_FILTER);
  const [anzahl, setzeAnzahl] = useState(SICHTBAR);
  const [sortierung, setzeSortierung] = useState<Sortierung>("datum");
  const [aufsteigend, setzeAufsteigend] = useState(false);
  // Löschmodus (seit 0.2.142): null aus, sonst die gewählten Partien.
  const [gewaehlt, setzeGewaehlt] = useState<ReadonlySet<string> | null>(null);
  // Die Spielstärke je Partie kostet Rechenzeit; einmal je Liste.
  const werte = useMemo(() => new Map(partien.map((e) => [e, sortierwerte(e)])), [partien]);
  if (partien.length === 0)
    return (
      <section className="karte partienliste" data-tour="spielen-partien">
        <Partienkopf />
        <p className="hinweis">{t("spielen.partienLeer")}</p>
        <PgnImport />
      </section>
    );
  // Ohne sichtbaren Filter (weniger als FILTER_AB Partien) gilt auch keiner, etwa nach dem Löschen.
  const mitFilter = partien.length >= FILTER_AB;
  const aktiv = mitFilter ? filter : OHNE_FILTER;
  const passend = sortiere(
    partien.filter((e) => passtZumFilter(e.partie, aktiv)),
    mitFilter ? sortierung : "datum",
    (e) => werte.get(e) ?? sortierwerte(e),
    mitFilter && aufsteigend,
  );
  const rest = passend.length - anzahl;
  const loeschbar = partien.filter((e) => !e.partie.einstellung.gewertet).map((e) => e.partie.id);
  const loeschknopf = loeschbar.length > 0 && (
    <LoeschmodusKnopf
      an={gewaehlt !== null}
      beiTipp={() => setzeGewaehlt(gewaehlt ? null : new Set())}
    />
  );
  const umschalte = (id: string) => {
    if (!gewaehlt) return;
    const neu = new Set(gewaehlt);
    if (!neu.delete(id)) neu.add(id);
    setzeGewaehlt(neu);
  };
  return (
    <>
      <section className="karte partienliste" data-tour="spielen-partien">
        <Partienkopf />
        <PgnImport />
        {mitFilter && (
          <Partienfilterleiste
            filter={filter}
            setzeFilter={setzeFilter}
            sortierung={sortierung}
            aufsteigend={aufsteigend}
            setzeSortierung={(s, auf) => {
              setzeSortierung(s);
              setzeAufsteigend(auf);
            }}
            zusatz={loeschknopf}
          />
        )}
        {!mitFilter && loeschknopf && <div className="filterknoepfe">{loeschknopf}</div>}
        {gewaehlt && (
          <Loeschleiste
            gewaehlt={gewaehlt}
            waehlbar={loeschbar}
            setzeGewaehlt={setzeGewaehlt}
            beiFertig={() => setzeGewaehlt(null)}
          />
        )}
        {passend.length === 0 && <p className="hinweis">{t("spielen.filter.leer")}</p>}
        <ul className="begriffsliste">
          {passend.slice(0, anzahl).map((eintrag) => (
            <Partiezeile
              key={eintrag.partie.id}
              eintrag={eintrag}
              loeschmodus={gewaehlt !== null}
              gewaehlt={gewaehlt?.has(eintrag.partie.id) ?? false}
              beiWahl={() => umschalte(eintrag.partie.id)}
            />
          ))}
        </ul>
        {rest > 0 && (
          <button
            type="button"
            className="knopf-zweit"
            onClick={() => setzeAnzahl(anzahl + SICHTBAR)}
          >
            {t("spielen.partienMehr", { anzahl: rest })}
          </button>
        )}
      </section>
    </>
  );
}

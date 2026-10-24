/**
 * Laufende Partie zum Fortsetzen und die letzten beendeten Partien (Bereich Spielen).
 *
 * Rolle im Gesamtbild: Die laufende Partie übersteht das Schließen der App (Speicher Format 2);
 * hier geht es mit einem Tipp weiter. Beendete Partien öffnen den Partie-Bildschirm mit Ergebnis,
 * Auswertung und PGN (Pflichtenheft 5.3).
 * Seit 0.2.40 (Wunsch des Autors): je Partie eine kleine Figur in der gespielten Farbe (König im
 * gewählten Figurensatz) und die erreichte Spielstärke oder Genauigkeit des Lesers. Seit 0.2.83
 * darüber die Karte „Deine Spielstärke“ über die letzten zehn Partien (LetzteSpielstaerke.tsx).
 * Seit 0.2.99 (Wunsch des Autors vom 19.10.2026): Porträt des Gegners je Partie, Filter nach
 * Ergebnis und Wertung, „Weitere Partien zeigen“ und Löschen ungewerteter Partien mit Nachfrage.
 * Seit 0.2.117: Filter und Sortierung als Symbole, mehrere zugleich (Partienfilterleiste.tsx), und
 * „Partie einlesen (PGN)“ (PgnImport.tsx), auch wenn noch keine Partie gespielt ist.
 * Abhängigkeiten: spiel/partie.ts, spiel/auswertung.ts, spiel/genauigkeit.ts, speicher/partien.ts,
 * engine/stufen.ts, ui/brett (Figur), Navigation, i18n.
 */
import { Star, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { useEinstellungen } from "../../app/einstellungen";
import { useNavigation } from "../../app/navigationsKontext";
import { stufe } from "../../engine/stufen";
import { datumText, t } from "../../i18n/sprache";
import type { Seitenbilanz } from "../../spiel/genauigkeit";
import { gegnername } from "../../engine/gegner";
import type { Partie } from "../../spiel/partie";
import { staerkeDerPartie } from "../../spiel/wertung";
import {
  OHNE_FILTER,
  passtZumFilter,
  sortiere,
  type Partienfilter,
  type Sortierung,
  type Sortierwerte,
} from "../../spiel/partienfilter";
import { staerkeAusStufen, staerkeDesBots } from "../../engine/botstaerke";
import { ohnePartie, type Partieeintrag } from "../../speicher/partien";
import { aendere, useSpeicher } from "../../speicher/speicher";
import { Ergebnismarke } from "./Ergebnismarke";
import { GegnerBild } from "./GegnerBild";
import { Figur } from "../brett/Figur";
import { BRETTFARBEN, FELD } from "../brett/masse";
import { LetzteSpielstaerke } from "./LetzteSpielstaerke";
import { Partienfilterleiste } from "./Partienfilterleiste";
import { PgnImport } from "./PgnImport";
import { Knopfsymbol } from "./Knopfsymbol";
import { Stufenmarke } from "./Stufenmarke";
import { Titelsymbol } from "./Titelsymbol";

/** Größe der kleinen Figur in der Liste (Bildpunkte). */
const FIGURGROESSE = 28;

/** So viele beendete Partien zeigt die Liste zuerst, je Tipp auf „Weitere“ so viele mehr. */
const SICHTBAR = 10;
/** Ab so vielen Partien erscheint der Filter; bei wenigen wäre er nur Ballast. */
const FILTER_AB = 4;
/** Größe des Papierkorbs beim Löschen. */
const LOESCHSYMBOL = 20;
/** Größe des Sterns für eine gewertete Partie (0.2.58, Wunsch des Autors). */
const WERTUNGSSYMBOL = 14;

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

/** Ein König im gewählten Figurensatz: die Farbe, die der Leser gespielt hat; beide bei Mensch gegen Mensch. */
function Seitenfigur({ partie }: { partie: Partie }) {
  const einstellungen = useEinstellungen();
  const mensch = partie.einstellung.gegner === "mensch";
  const weiss = partie.einstellung.eigeneFarbe === "white";
  const zeichen = mensch ? ["K", "k"] : [weiss ? "K" : "k"];
  const name = mensch
    ? t("spielen.gegner.mensch")
    : t("spielen.partieSeite", { farbe: t(weiss ? "farbe.w" : "farbe.b") });
  return (
    <svg
      className="seitenfigur"
      viewBox={`0 0 ${FELD * zeichen.length} ${FELD}`}
      width={FIGURGROESSE * zeichen.length}
      height={FIGURGROESSE}
      role="img"
      aria-label={name}
    >
      {zeichen.map((z, i) => (
        <Figur
          key={z}
          zeichen={z}
          x={i * FELD}
          y={0}
          satz={einstellungen.figurensatz}
          farbe={BRETTFARBEN[einstellungen.brettfarben].figur}
        />
      ))}
    </svg>
  );
}

/** „etwa 1400“ oder „78 % genau“; leer ohne Zahl. */
function seitenwert(b: Seitenbilanz): string {
  if (b.spielstaerke !== null) return t("spielen.etwa", { wert: b.spielstaerke });
  if (b.genauigkeit !== null) return t("spielen.genau", { wert: Math.round(b.genauigkeit) });
  return "";
}

/** „du etwa 1400 · Engine etwa 1600“ oder bei zwei Menschen „Weiß … · Schwarz …“; leer ohne Auswertung. */
function staerketext(eintrag: Partieeintrag): string {
  const staerke = staerkeDerPartie(eintrag);
  if (!staerke) return "";
  const p = eintrag.partie;
  const weiss = seitenwert(staerke.white);
  const schwarz = seitenwert(staerke.black);
  if (!weiss && !schwarz) return "";
  if (p.einstellung.gegner === "mensch") return t("spielen.staerkeMensch", { weiss, schwarz });
  const eigene = p.einstellung.eigeneFarbe === "white";
  return t("spielen.staerkeEngine", {
    du: eigene ? weiss : schwarz,
    engine: eigene ? schwarz : weiss,
  });
}

export function LaufendePartie({ partie }: { partie: Partie }) {
  const { navigiere } = useNavigation();
  return (
    <section className="karte laufende-partie" data-testid="laufende-partie">
      <h2 className="karte-titel">{t("spielen.laufend")}</h2>
      <p>{zeile(partie)}</p>
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

/**
 * Bild des Gegners: Bot-Porträt, bei der Engine ohne Bot die Stufenmarke (DS36, statt des
 * Buchstabens „S“ für „Stufe“); bei Mensch gegen Mensch keins.
 */
function Gegnerbild({ partie }: { partie: Partie }) {
  const eigene = useSpeicher((z) => z.daten.spiel.eigeneGegner);
  const e = partie.einstellung;
  if (e.gegner === "mensch") return null;
  if (e.bot === null)
    return (
      <span className="gegnerbild partie-stufe">
        <Stufenmarke stufe={stufe(e.stufe).nummer} />
      </span>
    );
  const name =
    gegnername(e.bot, e.botName) ?? t("spielen.partieStufe", { nummer: stufe(e.stufe).nummer });
  return <GegnerBild bot={e.bot} eigene={eigene} name={name} />;
}

/** Löschen einer ungewerteten Partie: Papierkorb, dann Nachfrage in der Zeile. */
function Loeschen({ partie }: { partie: Partie }) {
  const [frage, setzeFrage] = useState(false);
  const datum = datumText(new Date(partie.begonnen));
  if (!frage)
    return (
      <button
        type="button"
        className="knopf-symbol partie-loeschen"
        aria-label={t("spielen.partieLoeschen", { datum })}
        title={t("spielen.partieLoeschen", { datum })}
        onClick={() => setzeFrage(true)}
      >
        <Trash2 size={LOESCHSYMBOL} aria-hidden="true" />
      </button>
    );
  return (
    <div className="partie-nachfrage" role="group" aria-label={t("spielen.partieLoeschenFrage")}>
      <span>{t("spielen.partieLoeschenFrage")}</span>
      <button
        type="button"
        className="knopf-gefahr"
        onClick={() => void aendere((d) => ({ ...d, spiel: ohnePartie(d.spiel, partie.id) }))}
      >
        <Knopfsymbol art="loeschen" />
        {t("spielen.partieLoeschenJa")}
      </button>
      <button type="button" className="knopf-zweit" onClick={() => setzeFrage(false)}>
        {t("loeschen.nein")}
      </button>
    </div>
  );
}

/** Eine Zeile der Liste: Gegnerbild, Seite, Ergebnis mit Stern, Datum und Stärke; Löschen. */
function Partiezeile({ eintrag }: { eintrag: Partieeintrag }) {
  const { navigiere } = useNavigation();
  const { partie } = eintrag;
  const staerke = staerketext(eintrag);
  return (
    <li className="partieeintrag">
      <button
        type="button"
        className="begriff-knopf partiezeile"
        onClick={() => navigiere({ bildschirm: "partie", id: partie.id })}
      >
        <Gegnerbild partie={partie} />
        <Seitenfigur partie={partie} />
        <span className="partiezeile-text">
          <strong>
            <Ergebnismarke partie={partie} />
            {partie.einstellung.gewertet && (
              <Star
                className="partiezeile-wertung"
                size={WERTUNGSSYMBOL}
                aria-label={t("spielen.partieGewertet")}
                role="img"
              />
            )}
          </strong>
          <span>
            {zeile(partie)}
            {staerke && ` · ${staerke}`}
          </span>
        </span>
      </button>
      {!partie.einstellung.gewertet && <Loeschen partie={partie} />}
    </li>
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
    gegner: mensch ? null : (staerkeDesBots(e.bot) ?? staerkeAusStufen(e.stufenJePhase)),
  };
}

export function Partienliste({ partien }: { partien: readonly Partieeintrag[] }) {
  const [filter, setzeFilter] = useState<Partienfilter>(OHNE_FILTER);
  const [anzahl, setzeAnzahl] = useState(SICHTBAR);
  const [sortierung, setzeSortierung] = useState<Sortierung>("datum");
  const [aufsteigend, setzeAufsteigend] = useState(false);
  // Die Spielstärke je Partie kostet Rechenzeit; einmal je Liste.
  const werte = useMemo(() => new Map(partien.map((e) => [e, sortierwerte(e)])), [partien]);
  if (partien.length === 0)
    return (
      <section className="abschnitt partienliste">
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
  return (
    <>
      <LetzteSpielstaerke partien={partien} />
      <section className="abschnitt partienliste">
        <h2 className="abschnitt-titel">
          <Titelsymbol art="partien" />
          {t("spielen.partien")}
        </h2>
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
          />
        )}
        {passend.length === 0 && <p className="hinweis">{t("spielen.filter.leer")}</p>}
        <ul className="begriffsliste">
          {passend.slice(0, anzahl).map((eintrag) => (
            <Partiezeile key={eintrag.partie.id} eintrag={eintrag} />
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

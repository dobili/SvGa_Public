/**
 * Laufende Partie zum Fortsetzen und die letzten beendeten Partien (Bereich Spielen).
 *
 * Rolle im Gesamtbild: Die laufende Partie übersteht das Schließen der App (Speicher Format 2);
 * hier geht es mit einem Tipp weiter. Beendete Partien öffnen den Partie-Bildschirm mit Ergebnis,
 * Auswertung und PGN (Pflichtenheft 5.3).
 * Seit 0.2.40 (Wunsch des Autors): je Partie eine kleine Figur in der gespielten Farbe (König im
 * gewählten Figurensatz) und die erreichte Spielstärke oder Genauigkeit des Lesers.
 * Abhängigkeiten: spiel/partie.ts, spiel/auswertung.ts, spiel/genauigkeit.ts, speicher/partien.ts,
 * engine/stufen.ts, ui/brett (Figur), Navigation, i18n.
 */
import { useEinstellungen } from "../../app/einstellungen";
import { useNavigation } from "../../app/navigationsKontext";
import { stufe } from "../../engine/stufen";
import { t } from "../../i18n/sprache";
import { zugurteile } from "../../spiel/auswertung";
import { spielstaerke } from "../../spiel/genauigkeit";
import { stellungen, type Partie } from "../../spiel/partie";
import { sanZuUci } from "../../spiel/zuege";
import type { Partieeintrag } from "../../speicher/partien";
import { Figur } from "../brett/Figur";
import { BRETTFARBEN, FELD } from "../brett/masse";
import { kurzergebnis } from "./partietexte";

/** Größe der kleinen Figur in der Liste (Bildpunkte). */
const FIGURGROESSE = 28;

/** So viele beendete Partien zeigt die Liste; gespeichert sind bis zu 50. */
const SICHTBAR = 10;

/** „15.10.2026 · Stufe 2 · 23 Züge“ */
function zeile(partie: Partie): string {
  const datum = new Date(partie.begonnen).toLocaleDateString("de-DE");
  const zuege = Math.ceil(partie.zuege.length / 2);
  const s = stufe(partie.einstellung.stufe);
  return t("spielen.partiezeile", { datum, stufe: t(s.name), zuege });
}

/** Der König in der Farbe, die der Leser gespielt hat, im gewählten Figurensatz. */
function Seitenfigur({ partie }: { partie: Partie }) {
  const einstellungen = useEinstellungen();
  const weiss = partie.einstellung.eigeneFarbe === "white";
  const farbe = t(weiss ? "farbe.w" : "farbe.b");
  return (
    <svg
      className="seitenfigur"
      viewBox={`0 0 ${FELD} ${FELD}`}
      width={FIGURGROESSE}
      height={FIGURGROESSE}
      role="img"
      aria-label={t("spielen.partieSeite", { farbe })}
    >
      <Figur
        zeichen={weiss ? "K" : "k"}
        x={0}
        y={0}
        satz={einstellungen.figurensatz}
        farbe={BRETTFARBEN[einstellungen.brettfarben].figur}
      />
    </svg>
  );
}

/** „du: etwa 1400“ oder „du: 78 % genau“; leer ohne Auswertung. */
function staerketext(eintrag: Partieeintrag): string {
  if (eintrag.werte.length === 0) return "";
  const p = eintrag.partie;
  const urteile = zugurteile(p, eintrag.werte, eintrag.beste, eintrag.abstaende);
  const alle = stellungen(p);
  const gespielte = p.zuege.map((zug, index) => sanZuUci(alle[index] ?? "", zug.san));
  const bilanz = spielstaerke(p, eintrag.werte, urteile, eintrag.beste, gespielte)[
    p.einstellung.eigeneFarbe
  ];
  if (bilanz.spielstaerke !== null)
    return t("spielen.partieStaerke", { wert: bilanz.spielstaerke });
  if (bilanz.genauigkeit !== null) {
    return t("spielen.partieGenauigkeit", { wert: Math.round(bilanz.genauigkeit) });
  }
  return "";
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

export function Partienliste({ partien }: { partien: readonly Partieeintrag[] }) {
  const { navigiere } = useNavigation();
  if (partien.length === 0) return null;
  return (
    <section className="abschnitt partienliste">
      <h2 className="abschnitt-titel">{t("spielen.partien")}</h2>
      <ul className="begriffsliste">
        {partien.slice(0, SICHTBAR).map((eintrag) => {
          const { partie } = eintrag;
          const staerke = staerketext(eintrag);
          return (
            <li key={partie.id}>
              <button
                type="button"
                className="begriff-knopf partiezeile"
                onClick={() => navigiere({ bildschirm: "partie", id: partie.id })}
              >
                <Seitenfigur partie={partie} />
                <span className="partiezeile-text">
                  <strong>{kurzergebnis(partie)}</strong>
                  <span>
                    {zeile(partie)}
                    {staerke && ` · ${staerke}`}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

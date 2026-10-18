/**
 * Laufende Partie zum Fortsetzen und die letzten beendeten Partien (Bereich Spielen).
 *
 * Rolle im Gesamtbild: Die laufende Partie übersteht das Schließen der App (Speicher Format 2);
 * hier geht es mit einem Tipp weiter. Beendete Partien öffnen den Partie-Bildschirm mit Ergebnis,
 * Auswertung und PGN (Pflichtenheft 5.3).
 * Seit 0.2.40 (Wunsch des Autors): je Partie eine kleine Figur in der gespielten Farbe (König im
 * gewählten Figurensatz) und die erreichte Spielstärke oder Genauigkeit des Lesers. Seit 0.2.83
 * darüber die Karte „Deine Spielstärke“ über die letzten zehn Partien (LetzteSpielstaerke.tsx).
 * Abhängigkeiten: spiel/partie.ts, spiel/auswertung.ts, spiel/genauigkeit.ts, speicher/partien.ts,
 * engine/stufen.ts, ui/brett (Figur), Navigation, i18n.
 */
import { Star } from "lucide-react";
import { useEinstellungen } from "../../app/einstellungen";
import { useNavigation } from "../../app/navigationsKontext";
import { stufe } from "../../engine/stufen";
import { t } from "../../i18n/sprache";
import type { Seitenbilanz } from "../../spiel/genauigkeit";
import { gegnername } from "../../engine/gegner";
import type { Partie } from "../../spiel/partie";
import { staerkeDerPartie } from "../../spiel/wertung";
import type { Partieeintrag } from "../../speicher/partien";
import { Figur } from "../brett/Figur";
import { BRETTFARBEN, FELD } from "../brett/masse";
import { LetzteSpielstaerke } from "./LetzteSpielstaerke";
import type { Genauigkeitsmodus } from "../../spiel/staerkemodell";

/** Größe der kleinen Figur in der Liste (Bildpunkte). */
const FIGURGROESSE = 28;

/** So viele beendete Partien zeigt die Liste; gespeichert sind bis zu 50. */
const SICHTBAR = 10;
/** Größe des Sterns für eine gewertete Partie (0.2.58, Wunsch des Autors). */
const WERTUNGSSYMBOL = 14;

/** „15.10.2026 · Stufe 2 · 23 Züge“ (laufende Partie) */
function zeile(partie: Partie): string {
  const datum = new Date(partie.begonnen).toLocaleDateString("de-DE");
  const zuege = Math.ceil(partie.zuege.length / 2);
  const s = stufe(partie.einstellung.stufe);
  const gegner =
    partie.einstellung.gegner === "mensch"
      ? t("spielen.gegner.mensch")
      : (gegnername(partie.einstellung.bot, partie.einstellung.botName) ??
        t("spielen.partieStufe", { nummer: s.nummer }));
  return t("spielen.partiezeile", { datum, stufe: gegner, zuege });
}

/** Ergebnis in der Schreibweise des Schachs: „1–0“, „0–1“, „½–½“; „läuft“ ohne Ende. */
function ergebniszeichen(partie: Partie): string {
  const ende = partie.ende;
  if (!ende) return t("spielen.laeuftKurz");
  if (!("sieger" in ende)) return "½–½";
  return ende.sieger === "white" ? "1–0" : "0–1";
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
function staerketext(eintrag: Partieeintrag, modus: Genauigkeitsmodus): string {
  const staerke = staerkeDerPartie(eintrag, modus);
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

export function Partienliste({ partien }: { partien: readonly Partieeintrag[] }) {
  const { navigiere } = useNavigation();
  const modus = useEinstellungen().genauigkeitsmodus;
  if (partien.length === 0) return null;
  return (
    <>
      <LetzteSpielstaerke partien={partien} />
      <section className="abschnitt partienliste">
        <h2 className="abschnitt-titel">{t("spielen.partien")}</h2>
        <ul className="begriffsliste">
          {partien.slice(0, SICHTBAR).map((eintrag) => {
            const { partie } = eintrag;
            const staerke = staerketext(eintrag, modus);
            return (
              <li key={partie.id}>
                <button
                  type="button"
                  className="begriff-knopf partiezeile"
                  onClick={() => navigiere({ bildschirm: "partie", id: partie.id })}
                >
                  <Seitenfigur partie={partie} />
                  <span className="partiezeile-text">
                    <strong>
                      {ergebniszeichen(partie)}
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
              </li>
            );
          })}
        </ul>
      </section>
    </>
  );
}

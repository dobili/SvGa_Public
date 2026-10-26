/**
 * Karte unter dem Brett zum gezeigten Zug im Rückblick: Urteil mit Zeichen, Bewertung davor und
 * danach, Erklärung des Fehlers nach den Regeln des Buches, besserer Zug.
 *
 * Rolle im Gesamtbild: Rückmeldung des Autors zum Nachtest von 0.2.38 („Nachspielen wie bei
 * chess.com: einfache Kommentare, warum ein Zug schlecht war“). Die Sätze folgen der Engine-Karte
 * (Zugurteil.tsx), die Erklärung kommt aus spiel/erklaerung.ts.
 * Unten steht „In die Fehlerdatenbank“ (Kapitel 12, AP 13): Es öffnet das Formular mit der
 * Stellung vor dem Zug und dem gespielten Zug. Seit 0.2.93 daneben „In die Lernsammlung“ für die
 * Stellung nach dem Zug, mit dem Weg der Partie (Eröffnung und PGN).
 * Seit 0.2.85 (Rückmeldung des Autors) nennt der Satz zu einem Fehler die Gewinnchance vorher und
 * nachher statt der Bauerneinheiten der Engine: Stockfish rechnet seine Zahl aus der Gewinnchance,
 * eine Figur mehr ergibt dort 5 bis 7 „Bauern“, chess.com zeigt kleinere Zahlen. Die Gewinnchance
 * hängt weniger an der Skala; das Material nennt die Erklärung nach den Werten des Buches.
 * Seit dem Theoriezug (Wunsch des Autors, 25.10.2026) steht bei einem Theoriezug „Theoriezug: Teil
 * einer Eröffnung“ (oder „eines Gambits“), das Wort klappt die zutreffenden Namen auf
 * (Theorieangabe.tsx).
 * Abhängigkeiten: spiel/auswertung.ts, spiel/rueckblick.ts, spiel/zuege.ts, i18n,
 * ui/trainer/FehlerFormular.tsx.
 */
import { useId, useState } from "react";
import { sprache, t, zahlText } from "../../../i18n/sprache";
import { sanInSprache } from "../../../schach/notation";
import { fenNachZuegen } from "../../../schach/weiterspielen";
import { zugnummer, type Zugurteil } from "../../../spiel/auswertung";
import type { Zugerklaerung } from "../../../spiel/erklaerung";
import type { Partie } from "../../../spiel/partie";
import { MIT_BESSEREM, MIT_STRAFE, type Zweigzug } from "../../../spiel/nebenzweig";
import { balkentext } from "../../../spiel/rueckblick";
import { uciZuSan } from "../../../spiel/zuege";
import { FehlerFormular } from "../../trainer/FehlerFormular";
import { SammelKnopf } from "../lernsammlung/SammelFormular";
import { gewinnchanceVorNach, type Chance } from "../auswertung/gewinnchance";
import { Aufklapper } from "../bausteine/Aufklapper";
import { MitInfo } from "../bausteine/InfoKnopf";
import { Nebenzweig, type Zweigwahl } from "./Nebenzweig";
import { Theorieliste, Theoriesatz } from "./Theorieangabe";
import { useTheorieauskunft } from "./useTheorie";
import type { Rueckblick } from "./useRueckblick";

/**
 * Knopf und Formular „In die Fehlerdatenbank“ für den gezeigten Zug. Der Schlüssel (Stellung und
 * Zug) setzt das Formular für jeden Zug zurück.
 */
function InDieFehlerdatenbank({ fen, zug }: { fen: string; zug: string }) {
  return (
    <Aufklapper
      text={t("fehlerdb.ausRueckblick")}
      erklaerung={<p>{t("fehlerdb.erklaerung")}</p>}
      thema={t("fehlerdb.erklaerungThema")}
    >
      <FehlerFormular fen={fen} zug={zug} />
    </Aufklapper>
  );
}

/** „In die Lernsammlung“ für die Stellung nach dem gezeigten Zug, mit dem Weg der Partie. */
function InDieLernsammlung({ partie, index }: { partie: Partie; index: number }) {
  const startFen = partie.einstellung.startFen;
  const zuege = partie.zuege.slice(0, index + 1).map((z) => z.san);
  const fen = fenNachZuegen(startFen, zuege);
  if (!fen) return null;
  return (
    <SammelKnopf
      fen={fen}
      herkunft={{ herkunft: "partie", quelle: "", verlauf: { startFen, zuege } }}
    />
  );
}

/** Verlust mit einer Nachkommastelle und deutschem Komma. */
/** Bis zu diesem Verlust ist ein Zug „so gut wie der beste“ (die Anzeige rundet auf 0,0). */
const GLEICHWERTIG_UNTER = 0.05;

function bauern(verlust: number): string {
  return zahlText(verlust, 1);
}

/** Der erste Satz je Klasse (0.2.40 wie bei chess.com). */
function urteilssatz(zug: string, urteil: Zugurteil, bester: string, chance: Chance): string {
  const mitZeichen = `${zug}${urteil.zeichen ?? ""}`;
  const verlust = bauern(urteil.verlust);
  switch (urteil.klasse) {
    case "brillant":
      return t("rueckblick.brillant", { zug: mitZeichen });
    case "stark":
      return t("rueckblick.stark", { zug: mitZeichen });
    case "bester":
      return t("rueckblick.bester", { zug });
    case "sehrGut":
      return urteil.verlust < GLEICHWERTIG_UNTER
        ? t("rueckblick.gleichwertig", { zug, bester })
        : t("rueckblick.sehrGut", { zug, verlust, bester });
    case "gut":
      return t("rueckblick.gut", { zug, verlust, bester });
    case "buch":
      return t("rueckblick.buch", { zug });
    case "verpasst":
      return t("rueckblick.verpasst", { zug: mitZeichen, ...chance });
    default:
      return t("rueckblick.verlust", { zug: mitZeichen, ...chance });
  }
}

/** Die Karte unter dem Brett zum gezeigten Zug. */
export function Rueckblickkarte({
  rueckblick,
  partie,
  fen,
  index,
  erklaerung,
  phasenwechsel = null,
  zweig,
  zweigZuege,
  strafZuege,
}: {
  rueckblick: Rueckblick;
  partie: Partie;
  fen: string;
  index: number;
  erklaerung: Zugerklaerung | null;
  /** Satz zur neuen Phase, wenn sie mit der Stellung nach diesem Zug beginnt (0.2.44). */
  phasenwechsel?: string | null;
  /** Gezeigter Zug des Nebenzweigs „Besser war …“ (0.2.85). */
  zweig: Zweigwahl;
  /** Der bessere Zug und die nächsten Züge der Engine (useRueckblick.tsx). */
  zweigZuege: readonly Zweigzug[];
  /** Wie der Gegner den Fehler bestraft: Variante der Engine nach dem Zug (0.2.85). */
  strafZuege: readonly Zweigzug[];
}) {
  const urteil = rueckblick.urteile[index];
  const san = partie.zuege[index]?.san ?? "";
  const theoriezug = urteil?.klasse === "buch";
  const auskunft = useTheorieauskunft(rueckblick.theorie, partie, index, theoriezug);
  const [theorieOffen, setzeTheorieOffen] = useState(false);
  const listenId = useId();
  if (!urteil || !san) return null;
  const nummer = zugnummer(partie, index);
  const zug = `${nummer} ${sanInSprache(san, sprache())}`;
  const besterUci = rueckblick.beste[index] ?? "";
  const besterSan = besterUci ? uciZuSan(fen, besterUci) : null;
  const bester = besterSan ? `${nummer} ${sanInSprache(besterSan, sprache())}` : "";
  // Die Erklärungen stehen in der dritten Person („übersieht die Gabel“); deshalb „Dein Zug“
  // statt „Du“ als Subjekt (Befund N402, 19.10.2026: „Du übersieht …“).
  const seite =
    partie.einstellung.gegner === "mensch"
      ? t(fen.split(" ")[1] === "b" ? "farbe.b" : "farbe.w")
      : partie.zuege[index]?.von === "leser"
        ? t("rueckblick.seite.du")
        : t("rueckblick.seite.engine");
  return (
    <section
      className="karte rueckblickkarte"
      data-testid="rueckblickkarte"
      data-tour="rueckblick-karte"
    >
      <MitInfo
        zeile={
          <p className="rueckblick-urteil">
            <strong>
              {auskunft ? (
                <Theoriesatz
                  zug={zug}
                  auskunft={auskunft}
                  offen={theorieOffen}
                  beiUmschalten={() => setzeTheorieOffen((o) => !o)}
                  listenId={listenId}
                />
              ) : (
                urteilssatz(
                  zug,
                  urteil,
                  bester,
                  gewinnchanceVorNach(rueckblick.werte, index, fen.split(" ")[1] !== "b"),
                )
              )}
            </strong>{" "}
            {t("rueckblick.bewertung", {
              vorher: balkentext(rueckblick.werte[index] ?? 0),
              nachher: balkentext(rueckblick.werte[index + 1] ?? 0),
            })}
          </p>
        }
        erklaerung={<p>{t("rueckblick.balkenInfo")}</p>}
        thema={t("rueckblick.balkenThema")}
      />
      {auskunft && <Theorieliste auskunft={auskunft} offen={theorieOffen} id={listenId} />}
      {erklaerung && (
        <p className="rueckblick-erklaerung">
          {t("rueckblick.erklaerung", { seite, text: erklaerung.text })}
        </p>
      )}
      {MIT_STRAFE.has(urteil.klasse) && <Nebenzweig zuege={strafZuege} art="strafe" wahl={zweig} />}
      {bester && MIT_BESSEREM.has(urteil.klasse) && (
        <Nebenzweig zuege={zweigZuege} art="besser" wahl={zweig} />
      )}
      {phasenwechsel && (
        <p className="rueckblick-phase" data-testid="rueckblick-phase">
          {t("rueckblick.phasenwechsel", { text: phasenwechsel })}
        </p>
      )}
      <InDieFehlerdatenbank key={`${fen} ${san}`} fen={fen} zug={san} />
      <InDieLernsammlung key={`s ${fen} ${san}`} partie={partie} index={index} />
    </section>
  );
}

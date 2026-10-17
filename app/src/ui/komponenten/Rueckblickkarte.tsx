/**
 * Karte unter dem Brett zum gezeigten Zug im Rückblick: Urteil mit Zeichen, Bewertung davor und
 * danach, Erklärung des Fehlers nach den Regeln des Buches, besserer Zug.
 *
 * Rolle im Gesamtbild: Rückmeldung des Autors zum Nachtest von 0.2.38 („Nachspielen wie bei
 * chess.com: einfache Kommentare, warum ein Zug schlecht war“). Die Sätze folgen der Engine-Karte
 * (Zugurteil.tsx), die Erklärung kommt aus spiel/erklaerung.ts.
 * Unten steht „In die Fehlerdatenbank“ (Kapitel 12, AP 13): Es öffnet das Formular mit der
 * Stellung vor dem Zug und dem gespielten Zug.
 * Abhängigkeiten: spiel/auswertung.ts, spiel/rueckblick.ts, spiel/zuege.ts, i18n,
 * ui/trainer/FehlerFormular.tsx.
 */
import { useState } from "react";
import { t } from "../../i18n/sprache";
import { sanInSprache } from "../../schach/notation";
import { zugnummer, type Zugurteil } from "../../spiel/auswertung";
import type { Zugerklaerung } from "../../spiel/erklaerung";
import type { Partie } from "../../spiel/partie";
import { balkentext, variantentext } from "../../spiel/rueckblick";
import { uciZuSan } from "../../spiel/zuege";
import { FehlerFormular } from "../trainer/FehlerFormular";
import type { Rueckblick } from "./useRueckblick";

/**
 * Knopf und Formular „In die Fehlerdatenbank“ für den gezeigten Zug. Der Schlüssel (Stellung und
 * Zug) setzt das Formular für jeden Zug zurück.
 */
function InDieFehlerdatenbank({ fen, zug }: { fen: string; zug: string }) {
  const [offen, setzeOffen] = useState(false);
  if (!offen) {
    return (
      <button type="button" className="knopf-link" onClick={() => setzeOffen(true)}>
        {t("fehlerdb.ausRueckblick")}
      </button>
    );
  }
  return <FehlerFormular fen={fen} zug={zug} />;
}

/** Verlust mit einer Nachkommastelle und deutschem Komma. */
/** Bis zu diesem Verlust ist ein Zug „so gut wie der beste“ (die Anzeige rundet auf 0,0). */
const GLEICHWERTIG_UNTER = 0.05;

function bauern(verlust: number): string {
  return verlust.toFixed(1).replace(".", ",");
}

/** Der erste Satz je Klasse (0.2.40 wie bei chess.com). */
function urteilssatz(zug: string, urteil: Zugurteil, bester: string): string {
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
      return t("rueckblick.verpasst", { zug: mitZeichen, verlust });
    default:
      return t("rueckblick.verlust", { zug: mitZeichen, verlust });
  }
}

/** Bei diesen Klassen nennt die Karte den besseren Zug. */
const MIT_BESSEREM: ReadonlySet<Zugurteil["klasse"]> = new Set([
  "sehrGut",
  "gut",
  "ungenau",
  "fehler",
  "verpasst",
  "patzer",
]);

/** Die Karte unter dem Brett zum gezeigten Zug. */
export function Rueckblickkarte({
  rueckblick,
  partie,
  fen,
  index,
  erklaerung,
  phasenwechsel = null,
}: {
  rueckblick: Rueckblick;
  partie: Partie;
  fen: string;
  index: number;
  erklaerung: Zugerklaerung | null;
  /** Satz zur neuen Phase, wenn sie mit der Stellung nach diesem Zug beginnt (0.2.44). */
  phasenwechsel?: string | null;
}) {
  const urteil = rueckblick.urteile[index];
  const san = partie.zuege[index]?.san ?? "";
  if (!urteil || !san) return null;
  const nummer = zugnummer(partie, index);
  const zug = `${nummer} ${sanInSprache(san, "de")}`;
  const besterUci = rueckblick.beste[index] ?? "";
  const besterSan = besterUci ? uciZuSan(fen, besterUci) : null;
  const bester = besterSan ? `${nummer} ${sanInSprache(besterSan, "de")}` : "";
  // Die nächsten Züge nach dem besseren Zug (Empfehlung R5, 0.2.56); leer bei alten Auswertungen.
  const folge = variantentext(fen, rueckblick.varianten?.[index] ?? []);
  const seite =
    partie.einstellung.gegner === "mensch"
      ? t(fen.split(" ")[1] === "b" ? "farbe.b" : "farbe.w")
      : partie.zuege[index]?.von === "leser"
        ? t("partie.du")
        : t("partie.engine");
  return (
    <section className="karte rueckblickkarte" data-testid="rueckblickkarte">
      <p className="rueckblick-urteil">
        <strong>{urteilssatz(zug, urteil, bester)}</strong>{" "}
        {t("rueckblick.bewertung", {
          vorher: balkentext(rueckblick.werte[index] ?? 0),
          nachher: balkentext(rueckblick.werte[index + 1] ?? 0),
        })}
      </p>
      {erklaerung && (
        <p className="rueckblick-erklaerung">
          {t("rueckblick.erklaerung", { seite, text: erklaerung.text })}
        </p>
      )}
      {bester && MIT_BESSEREM.has(urteil.klasse) && (
        <p>
          {t("rueckblick.besser", { zug: bester })}
          {folge && <> {t("rueckblick.variante", { folge })}</>}
        </p>
      )}
      {phasenwechsel && (
        <p className="rueckblick-phase" data-testid="rueckblick-phase">
          {t("rueckblick.phasenwechsel", { text: phasenwechsel })}
        </p>
      )}
      <InDieFehlerdatenbank key={`${fen} ${san}`} fen={fen} zug={san} />
    </section>
  );
}

/**
 * Karte unter dem Brett zum gezeigten Zug im Rückblick: Urteil mit Zeichen, Bewertung davor und
 * danach, Erklärung des Fehlers nach den Regeln des Buches, besserer Zug.
 *
 * Rolle im Gesamtbild: Rückmeldung des Autors zum Nachtest von 0.2.38 („Nachspielen wie bei
 * chess.com: einfache Kommentare, warum ein Zug schlecht war“). Die Sätze folgen der Engine-Karte
 * (Zugurteil.tsx), die Erklärung kommt aus spiel/erklaerung.ts.
 * Abhängigkeiten: spiel/auswertung.ts, spiel/rueckblick.ts, spiel/zuege.ts, i18n.
 */
import { t } from "../../i18n/sprache";
import { sanInSprache } from "../../schach/notation";
import { zugnummer, type Zugurteil } from "../../spiel/auswertung";
import type { Zugerklaerung } from "../../spiel/erklaerung";
import type { Partie } from "../../spiel/partie";
import { balkentext } from "../../spiel/rueckblick";
import { sanZuUci, uciZuSan } from "../../spiel/zuege";
import type { Rueckblick } from "./useRueckblick";

/** Unter diesem Verlust (gerundet 0,0) gilt ein Zug als so gut wie der beste. */
const GLEICHWERTIG_UNTER = 0.05;

/** Verlust mit einer Nachkommastelle und deutschem Komma. */
function bauern(verlust: number): string {
  return verlust.toFixed(1).replace(".", ",");
}

/** Der erste Satz: bester, einziger, in Ordnung oder Verlust mit Zeichen. */
function urteilssatz(zug: string, urteil: Zugurteil, bester: string, warBester: boolean): string {
  if (urteil.zeichen === "!") return t("rueckblick.einziger", { zug: `${zug}!` });
  if (warBester) return t("rueckblick.bester", { zug });
  if (urteil.verlust < GLEICHWERTIG_UNTER) return t("rueckblick.bester", { zug });
  if (!urteil.zeichen) return t("rueckblick.gut", { zug, verlust: bauern(urteil.verlust), bester });
  return t("rueckblick.verlust", {
    zug: `${zug}${urteil.zeichen}`,
    verlust: bauern(urteil.verlust),
  });
}

/** Die Karte unter dem Brett zum gezeigten Zug. */
export function Rueckblickkarte({
  rueckblick,
  partie,
  fen,
  index,
  erklaerung,
}: {
  rueckblick: Rueckblick;
  partie: Partie;
  fen: string;
  index: number;
  erklaerung: Zugerklaerung | null;
}) {
  const urteil = rueckblick.urteile[index];
  const san = partie.zuege[index]?.san ?? "";
  if (!urteil || !san) return null;
  const nummer = zugnummer(partie, index);
  const zug = `${nummer} ${sanInSprache(san, "de")}`;
  const besterUci = rueckblick.beste[index] ?? "";
  const besterSan = besterUci ? uciZuSan(fen, besterUci) : null;
  const bester = besterSan ? `${nummer} ${sanInSprache(besterSan, "de")}` : "";
  const warBester = besterUci !== "" && sanZuUci(fen, san) === besterUci;
  const seite = partie.zuege[index]?.von === "leser" ? t("partie.du") : t("partie.engine");
  return (
    <section className="karte rueckblickkarte" data-testid="rueckblickkarte">
      <p className="rueckblick-urteil">
        <strong>{urteilssatz(zug, urteil, bester, warBester)}</strong>{" "}
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
      {!warBester && bester && urteil.verlust >= GLEICHWERTIG_UNTER && (
        <p>{t("rueckblick.besser", { zug: bester })}</p>
      )}
    </section>
  );
}

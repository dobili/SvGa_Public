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
import { uciZuSan } from "../../spiel/zuege";
import type { Rueckblick } from "./useRueckblick";

/** Verlust mit einer Nachkommastelle und deutschem Komma. */
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
      return t("rueckblick.sehrGut", { zug, verlust, bester });
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
  const seite = partie.zuege[index]?.von === "leser" ? t("partie.du") : t("partie.engine");
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
        <p>{t("rueckblick.besser", { zug: bester })}</p>
      )}
    </section>
  );
}

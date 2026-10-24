/**
 * Karte „Deine Spielstärke“: je Zeitklasse (Blitz, Schnellschach, Klassisch) geschätzt aus den
 * letzten (höchstens zehn) ausgewerteten gewerteten Partien gegen die Engine, als Mitte mit Spanne;
 * die Entsprechung auf chess.com oder beim Weltschachbund hinter dem Fragezeichen.
 *
 * Rolle im Gesamtbild: Plan „Genauigkeit und Spielstärke neu eichen“, Entscheidung 4 des Autors
 * (18.10.2026): Eine einzelne Partie streut stark, über zehn Partien gleicht sich das aus. Seit
 * 0.2.124 (Entscheidung des Autors, 23.10.2026) eine eigene Zahl je Zeitklasse aus dem Elo-Modell
 * (spiel/elomodell.ts); eine Zahl je Phase nur, wenn ihre Spanne schmal genug ist. Steht im Bereich
 * Spielen über der Liste der Partien (Partienliste.tsx).
 * Abhängigkeiten: spiel/wertung.ts (staerkeLetzterPartien), spiel/elomodell.ts, speicher/partien.ts,
 * wertungstext.ts, InfoKnopf, i18n.
 */
import { useMemo } from "react";
import { t } from "../../i18n/sprache";
import { WERTUNGSTEMPI } from "../../spiel/elomodell";
import { PHASEN } from "../../spiel/phasen";
import { staerkeLetzterPartien, type Spielerschaetzung } from "../../spiel/wertung";
import type { Partieeintrag } from "../../speicher/partien";
import { MitInfo } from "./InfoKnopf";
import { entsprichtText, zeitklassenname } from "./wertungstext";

/**
 * Die Karte; ohne passende Partie nichts.
 * Beispiel: drei Schnellschach-Partien → „Schnellschach: etwa 1400“, darunter „1050 bis 1750, aus
 * 3 Partien“.
 */
export function LetzteSpielstaerke({ partien }: { partien: readonly Partieeintrag[] }) {
  const schaetzungen = useMemo(
    () =>
      WERTUNGSTEMPI.map((tempo) => staerkeLetzterPartien(partien, tempo)).filter(
        (s): s is Spielerschaetzung => s !== null,
      ),
    [partien],
  );
  if (schaetzungen.length === 0) return null;
  return (
    <section className="karte letzte-spielstaerke" data-testid="letzte-spielstaerke">
      <MitInfo
        zeile={<h2 className="karte-titel">{t("spielstaerke.letzte.titel")}</h2>}
        erklaerung={
          <>
            <p>{t("spielstaerke.letzte.erklaerung")}</p>
            {schaetzungen.map((s) => (
              <p key={s.tempo}>{entsprichtText(s)}</p>
            ))}
          </>
        }
        thema={t("spielstaerke.letzte.titel")}
      />
      {schaetzungen.map((s) => (
        <Zeitklasse key={s.tempo} s={s} />
      ))}
    </section>
  );
}

/** Eine Zeitklasse: Zahl, Spanne mit Zahl der Partien, dazu die Phasen mit schmaler Spanne. */
function Zeitklasse({ s }: { s: Spielerschaetzung }) {
  const phasen = PHASEN.filter((ph) => s.phasen[ph] !== null);
  return (
    <div className="letzte-spielstaerke-zeitklasse" data-testid={`letzte-spielstaerke-${s.tempo}`}>
      <p className="letzte-spielstaerke-wert">
        {t("spielstaerke.letzte.zeile", { zeitklasse: zeitklassenname(s.tempo), mitte: s.mitte })}
      </p>
      <p className="hinweis">
        {t(s.partien === 1 ? "spielstaerke.letzte.spanneEins" : "spielstaerke.letzte.spanne", {
          von: s.von,
          bis: s.bis,
          partien: s.partien,
        })}
      </p>
      {phasen.length > 0 && (
        <p className="hinweis">
          {phasen
            .map((ph) => {
              const p = s.phasen[ph];
              return p
                ? t("spielstaerke.letzte.phase", {
                    phase: t(`phase.name.${ph}`),
                    mitte: p.mitte,
                    von: p.von,
                    bis: p.bis,
                  })
                : "";
            })
            .join(" · ")}
        </p>
      )}
    </div>
  );
}

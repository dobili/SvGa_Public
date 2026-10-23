/**
 * Karten „Genauigkeit und Spielstärke“ und „Deine Züge“ in der Auswertung, für eine Seite.
 *
 * Rolle im Gesamtbild: Seit R56 (Wunsch des Autors, 23.10.2026, nach Vorschaubildern) statt der
 * zweispaltigen Tabellen: Die Auswertung zeigt eine Seite (Umschalter in Auswertung.tsx), oben ein
 * großer Ring mit der Genauigkeit, daneben Urteil und geschätzte Spielstärke mit Spanne, darunter
 * je ein Balken (Skala 50 bis 100 %) für Eröffnung, Mittelspiel, Endspiel, Strategie und Taktik
 * mit Prozent, Urteilswort und Spielstärke; Phasen ohne Wertung grau mit „–“. Die Zugklassen
 * stehen als Bullet-Diagramm in Zugklassen.tsx. Rechnungen wie bisher in spiel/genauigkeit.ts.
 * Der Schalter „Genauigkeit wie“ bleibt hinter dem Fragezeichen, bis der Bot-Chat ihn abschafft.
 * Abhängigkeiten: spiel/genauigkeit.ts, spiel/wertung.ts, engine/botstaerke.ts, Zugklassen.tsx,
 * Genauigkeitsbalken.tsx, InfoKnopf, i18n.
 */
import type { Color } from "chessops/types";
import { useMemo } from "react";
import { aendereEinstellungen, useEinstellungen } from "../../app/einstellungen";
import { gegnerstaerke } from "../../engine/botstaerke";
import { t } from "../../i18n/sprache";
import type { Zugurteil } from "../../spiel/auswertung";
import {
  phasenurteil,
  spielstaerke,
  spielstaerkeImMittelspiel,
  spielstaerkeJePhase,
  type Seitenbilanz,
} from "../../spiel/genauigkeit";
import { stellungen, type Partie } from "../../spiel/partie";
import { type Phase } from "../../spiel/phasen";
import { GENAUIGKEITSMODI } from "../../spiel/staerkemodell";
import { zugartJeStellung } from "../../spiel/taktik";
import { staerkeLetzterPartien } from "../../spiel/wertung";
import { sanZuUci } from "../../spiel/zuege";
import { useSpeicher } from "../../speicher/speicher";
import { Genauigkeitsbalken, type Balkenzeile } from "./Genauigkeitsbalken";
import { MitInfo } from "./InfoKnopf";
import { Segmentwahl } from "./Segmentwahl";
import { staerketext as angabetext } from "./staerkeangabe";
import { Titelsymbol } from "./Titelsymbol";
import { Zugklassen } from "./Zugklassen";

/** Ohne jede Schätzung vergleicht „Deine Züge“ mit dieser Stärke (Einsteiger mit Erfahrung). */
const VERGLEICH_OHNE_SCHAETZUNG = 1200;
const RING_RADIUS = 40;
const RING_GROESSE = 100;
const PROZENT = 100;

/**
 * Mit welcher Stärke werden die Zugklassen verglichen? Für den Leser mit „Deine Spielstärke“
 * (letzte zehn gewertete Partien), sonst mit der Schätzung dieser Partie; für die Engine mit der
 * festen Zahl des Bots. Nicht die Schätzung der Partie zuerst: Eine schwache Partie würde sich
 * sonst mit schwachen Spielern vergleichen und „normal“ aussehen.
 */
function vergleichsElo(
  partie: Partie,
  seite: Color,
  b: Seitenbilanz,
  eigeneStaerke: number | null,
): number {
  const ausPartie = b.schaetzung?.mitte ?? VERGLEICH_OHNE_SCHAETZUNG;
  if (seite === partie.einstellung.eigeneFarbe) return eigeneStaerke ?? ausPartie;
  return partie.einstellung.gegner === "engine" ? gegnerstaerke(partie.einstellung) : ausPartie;
}

/** Ring mit der Genauigkeit in der Farbe des Urteils. */
function Ring({ genauigkeit, urteil }: { genauigkeit: number; urteil: string }) {
  const umfang = 2 * Math.PI * RING_RADIUS;
  const mitte = RING_GROESSE / 2;
  return (
    <svg
      className="genauigkeitsring"
      width={RING_GROESSE}
      height={RING_GROESSE}
      viewBox={`0 0 ${RING_GROESSE} ${RING_GROESSE}`}
      aria-hidden="true"
    >
      <circle className="ring-grund" cx={mitte} cy={mitte} r={RING_RADIUS} />
      <circle
        className={`ring-wert ringfarbe-${urteil}`}
        cx={mitte}
        cy={mitte}
        r={RING_RADIUS}
        strokeDasharray={`${(umfang * genauigkeit) / PROZENT} ${umfang}`}
        transform={`rotate(-90 ${mitte} ${mitte})`}
      />
      <text
        x={mitte}
        y={mitte}
        className="ring-zahl"
        textAnchor="middle"
        dominantBaseline="central"
      >
        {t("spielstaerke.prozent", { wert: Math.round(genauigkeit) })}
      </text>
    </svg>
  );
}

/** Kopf der Karte: Ring, Urteil, Genauigkeit, Spielstärke; beim Bot seine feste Zahl dazu. */
function Gesamt({ partie, seite, b }: { partie: Partie; seite: Color; b: Seitenbilanz }) {
  const modus = useEinstellungen().genauigkeitsmodus;
  if (b.genauigkeit === null) return <p>{t("spielstaerke.keineZuege")}</p>;
  const urteil = phasenurteil(b.innen ?? b.genauigkeit);
  const bot =
    partie.einstellung.gegner === "engine" && seite !== partie.einstellung.eigeneFarbe
      ? t("spielstaerke.botZahl", {
          name: partie.einstellung.botName ?? t("spielstaerke.gegnerName"),
          staerke: angabetext(gegnerstaerke(partie.einstellung)),
        })
      : null;
  return (
    <div className="gesamtgenauigkeit">
      <Ring genauigkeit={b.genauigkeit} urteil={urteil} />
      <div>
        <p className="gesamt-urteil">{t(`spielstaerke.gesamt.${urteil}`)}</p>
        <p>
          {t("spielstaerke.genauigkeit", { modus: t(`einstellungen.genauigkeit.${modus}`) })}{" "}
          {t("spielstaerke.prozent", { wert: Math.round(b.genauigkeit) })}
        </p>
        <p>
          {t("spielstaerke.staerke")}{" "}
          <b>
            {b.schaetzung
              ? t("spielstaerke.etwa", { wert: b.schaetzung.mitte })
              : t("spielstaerke.zuWenig")}
          </b>
        </p>
        {b.schaetzung && (
          <p className="hinweis">
            {t("spielstaerke.spannenzeile", { von: b.schaetzung.von, bis: b.schaetzung.bis })}
          </p>
        )}
        {bot && <p className="hinweis">{bot}</p>}
      </div>
    </div>
  );
}

/** Erklärung und Schalter „Genauigkeit wie“ hinter dem Fragezeichen der Karte. */
function Kartenkopf({ b }: { b: Seitenbilanz }) {
  const modus = useEinstellungen().genauigkeitsmodus;
  return (
    <MitInfo
      zeile={
        <h2 className="karte-titel">
          <Titelsymbol art="spielstaerke" />
          {t("spielstaerke.titel")}
        </h2>
      }
      erklaerung={
        <>
          {b.schaetzung && (
            <p>
              {t("spielstaerke.skalen", {
                chesscom: b.schaetzung.chesscom,
                lichess: b.schaetzung.lichess,
              })}
            </p>
          )}
          <p>{t("spielstaerke.erklaerung")}</p>
          <p>{t("einstellungen.genauigkeit.info")}</p>
          <Segmentwahl
            name={t("einstellungen.genauigkeit")}
            werte={GENAUIGKEITSMODI}
            gewaehlt={modus}
            text={(wert) => t(`einstellungen.genauigkeit.${wert}`)}
            beiWahl={(genauigkeitsmodus) => aendereEinstellungen({ genauigkeitsmodus })}
          />
        </>
      }
      thema={t("spielstaerke.titel")}
    />
  );
}

/** Die beiden Karten für die gewählte Seite. */
export function Spielstaerke({
  partie,
  werte,
  urteile,
  beste,
  phasen,
  seite,
}: {
  partie: Partie;
  werte: readonly number[];
  urteile: readonly Zugurteil[];
  beste: readonly string[];
  phasen: readonly Phase[];
  seite: Color;
}) {
  const zugarten = useMemo(() => zugartJeStellung(partie), [partie]);
  const modus = useEinstellungen().genauigkeitsmodus;
  const partien = useSpeicher((z) => z.daten.spiel.partien);
  const eigeneStaerke = useMemo(() => staerkeLetzterPartien(partien)?.mitte ?? null, [partien]);
  if (urteile.length === 0) return null;
  const alle = stellungen(partie);
  const gespielte = partie.zuege.map((zug, index) => sanZuUci(alle[index] ?? "", zug.san));
  const args = [partie, werte, urteile, beste, gespielte] as const;
  const b = spielstaerke(...args, modus)[seite];
  const jePhase = spielstaerkeJePhase(...args, phasen, modus);
  const imMittelspiel = spielstaerkeImMittelspiel(...args, phasen, zugarten, modus);
  const zeilen: readonly Balkenzeile[] = [
    { art: "eroeffnung", b: jePhase.eroeffnung[seite] },
    { art: "mittelspiel", b: jePhase.mittelspiel[seite] },
    { art: "endspiel", b: jePhase.endspiel[seite] },
    { art: "strategie", b: imMittelspiel.strategie[seite] },
    { art: "taktik", b: imMittelspiel.taktik[seite] },
  ];
  return (
    <>
      <section className="karte spielstaerke" data-testid="spielstaerke">
        <Kartenkopf b={b} />
        <Gesamt partie={partie} seite={seite} b={b} />
        <Genauigkeitsbalken zeilen={zeilen} />
      </section>
      <Zugklassen bilanz={b} elo={vergleichsElo(partie, seite, b, eigeneStaerke)} />
    </>
  );
}

/**
 * Karte „Spielstärke“ im Abschnitt „In Zahlen“ der Auswertung, für eine Seite.
 *
 * Rolle im Gesamtbild: Wunsch des Autors (R56, 23.10.2026, nach Vorschaubildern): Die Auswertung
 * zeigt eine Seite (Umschalter in Auswertung.tsx), oben ein großer Ring mit der Genauigkeit,
 * daneben Urteil und geschätzte Spielstärke mit Spanne, darunter je ein Balken (Skala 50 bis
 * 100 %) für Eröffnung, Mittelspiel, Endspiel, Strategie und Taktik mit Prozent, Urteilswort und
 * Spielstärke; Phasen ohne Wertung grau mit „–“. Die Zugklassen stehen als Bullet-Diagramm in
 * Zugklassen.tsx. Die Rechnungen stehen in spiel/genauigkeit.ts, gesammelt in seitenzahlen.ts
 * (seit der Zeitleiste, 31.10.2026, rechnet die Auswertung sie einmal für alle Teile).
 * Entscheidung des Autors (23.10.2026): Die Genauigkeit ist die von Lichess, die Spielstärke
 * kommt aus dem Elo-Modell der Zeitklasse der Partie (spiel/elomodell.ts); hinter dem
 * Fragezeichen die Entsprechung auf chess.com oder beim Weltschachbund (wertungstext.ts).
 * Abhängigkeiten: seitenzahlen.ts, spiel/genauigkeit.ts, engine/botstaerke.ts,
 * Genauigkeitsbalken.tsx, wertungstext.ts, InfoKnopf, i18n.
 */
import type { Color } from "chessops/types";
import { gegnerstaerke } from "../../../engine/botstaerke";
import { t } from "../../../i18n/sprache";
import { phasenurteil, type Seitenbilanz } from "../../../spiel/genauigkeit";
import type { Partie } from "../../../spiel/partie";
import { Genauigkeitsbalken } from "./Genauigkeitsbalken";
import { MitInfo } from "../bausteine/InfoKnopf";
import { staerketext as angabetext } from "../gegner/staerkeangabe";
import { Titelsymbol } from "../bausteine/Titelsymbol";
import { entsprichtText } from "../fortschritt/wertungstext";
import type { Seitenzahlen } from "./seitenzahlen";

const RING_RADIUS = 40;
const RING_GROESSE = 100;
const PROZENT = 100;

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
          {t("spielstaerke.genauigkeit")}{" "}
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

/** Erklärung hinter dem Fragezeichen der Karte: Entsprechung der Zahl und wie die Zahlen entstehen. */
function Kartenkopf({ b }: { b: Seitenbilanz }) {
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
          {b.schaetzung && <p>{entsprichtText(b.schaetzung)}</p>}
          <p>{t("spielstaerke.erklaerung")}</p>
        </>
      }
      thema={t("spielstaerke.titel")}
    />
  );
}

/**
 * Die Karte „Spielstärke“ für die gewählte Seite: Ring, Urteil, Schätzung mit Spanne, beim Bot
 * seine feste Zahl, darunter die fünf Balken (Phasen, Strategie, Taktik) mit Skala.
 * Eingaben: Partie, Seite, Zahlen der Seite (seitenzahlen.ts).
 */
export function Spielstaerke({
  partie,
  seite,
  zahlen,
}: {
  partie: Partie;
  seite: Color;
  zahlen: Seitenzahlen;
}) {
  return (
    <section
      className="karte spielstaerke"
      data-testid="spielstaerke"
      data-tour="auswertung-staerke"
    >
      <Kartenkopf b={zahlen.b} />
      <Gesamt partie={partie} seite={seite} b={zahlen.b} />
      <Genauigkeitsbalken zeilen={zahlen.zeilen} />
    </section>
  );
}

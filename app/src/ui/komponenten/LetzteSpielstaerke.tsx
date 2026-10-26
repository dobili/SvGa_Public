/**
 * Karte „Deine Spielstärke“: je Zeitklasse (Blitz, Schnellschach, Klassisch) geschätzt aus den
 * letzten (höchstens zehn) ausgewerteten gewerteten Partien gegen die Engine, als Mitte mit Spanne;
 * die Entsprechung auf chess.com oder beim Weltschachbund hinter dem Fragezeichen.
 *
 * Rolle im Gesamtbild: Plan „Genauigkeit und Spielstärke neu eichen“, Entscheidung 4 des Autors
 * (18.10.2026): Eine einzelne Partie streut stark, über zehn Partien gleicht sich das aus. Seit
 * 0.2.125 (Entscheidung des Autors, 23.10.2026) eine eigene Zahl je Zeitklasse aus dem Elo-Modell
 * (spiel/elomodell.ts); eine Zahl je Phase nur, wenn ihre Spanne schmal genug ist. Steht im Bereich
 * Spielen ganz oben über dem Gegner (Spielen.tsx, seit 0.2.139 wieder dort).
 * Seit 0.2.125 steht je Zeitklasse auch die Elo-Wertung aus den Ergebnissen dabei (Empfehlung, vom
 * Autor am 24.10.2026 angenommen): Zugqualität und Ergebnisse nebeneinander erklären sich gegenseitig.
 * Seit 0.2.142 (Wunsch des Autors, 25.10.2026) stehen alle drei Zeitarten gleichzeitig als Kacheln
 * nebeneinander: oben das Zeichen der Zeitart, darunter groß die Zahl, klein Spanne und Wertung;
 * eine kleine Legende nennt die Zeichen. Spanne je Phase und Herleitung stehen hinter dem
 * Fragezeichen.
 * Seit dem 26.10.2026 (Wunsch des Autors) schaltet „Lichess | chess.com · FIDE“ alle Zahlen
 * der Kacheln auf die umgerechnete Liste (wertungsmassstab.ts), mit „≈“ und dem Namen der Liste.
 * Abhängigkeiten: zeitartzeichen.ts, spiel/wertung.ts (staerkeLetzterPartien, verlaufDerZeitklasse), spiel/elomodell.ts,
 * speicher/partien.ts, speicher/speicher.ts, wertungstext.ts, wertungsmassstab.ts, Massstabwahl,
 * InfoKnopf, i18n.
 */
import { useMemo } from "react";
import { t } from "../../i18n/sprache";
import { WERTUNGSTEMPI, type Wertungstempo } from "../../spiel/elomodell";
import { PHASEN } from "../../spiel/phasen";
import {
  aktuelleWertung,
  istVorlaeufig,
  staerkeLetzterPartien,
  verlaufDerZeitklasse,
  type Spielerschaetzung,
  type Wertungspunkt,
} from "../../spiel/wertung";
import type { Partieeintrag } from "../../speicher/partien";
import { useSpeicher } from "../../speicher/speicher";
import { MitInfo } from "./InfoKnopf";
import { Listenname, Massstabwahl } from "./Massstabwahl";
import {
  ausserhalbText,
  spanneImMassstab,
  useWertungsmassstab,
  zahlImMassstab,
  zielname,
  type Wertungsmassstab,
} from "./wertungsmassstab";
import { entsprichtText, zeitklassenname } from "./wertungstext";
import { ZEITARTZEICHEN } from "./zeitartzeichen";

/** Größe des Zeichens oben in der Kachel und in der Legende (Bildpunkte). */
const KACHELZEICHEN = 26;
const LEGENDENZEICHEN = 14;

/** Was eine Kachel zeigt: Schätzung aus den Zügen und Wertung aus den Ergebnissen (je null). */
interface Kachelstand {
  readonly tempo: Wertungstempo;
  readonly schaetzung: Spielerschaetzung | null;
  readonly wertung: number | null;
  readonly vorlaeufig: boolean;
}

/** Die Stände aller drei Zeitarten in fester Reihenfolge. */
function kachelstaende(
  partien: readonly Partieeintrag[],
  punkte: readonly Wertungspunkt[],
): Kachelstand[] {
  return WERTUNGSTEMPI.map((tempo) => {
    const kette = verlaufDerZeitklasse(punkte, tempo);
    return {
      tempo,
      schaetzung: staerkeLetzterPartien(partien, tempo),
      wertung: aktuelleWertung(kette),
      vorlaeufig: istVorlaeufig(kette),
    };
  });
}

/**
 * Die Karte; ohne jede Schätzung und Wertung nichts.
 * Beispiel: drei Schnellschach-Partien → Kacheln Blitz „–“, Schnellschach „1400“ mit
 * „1050–1750“ und „Wertung 1424“, Klassisch „–“; darunter die Legende.
 */
export function LetzteSpielstaerke({ partien }: { partien: readonly Partieeintrag[] }) {
  const punkte = useSpeicher((z) => z.daten.spiel.wertung);
  const staende = useMemo(() => kachelstaende(partien, punkte), [partien, punkte]);
  const [massstab, setzeMassstab] = useWertungsmassstab();
  if (staende.every((s) => !s.schaetzung && s.wertung === null)) return null;
  return (
    <section
      className="karte letzte-spielstaerke"
      data-testid="letzte-spielstaerke"
      data-tour="spielen-spielstaerke"
    >
      <MitInfo
        zeile={<h2 className="karte-titel">{t("spielstaerke.letzte.titel")}</h2>}
        erklaerung={<Erklaerung staende={staende} />}
        thema={t("spielstaerke.letzte.titel")}
      />
      <Massstabwahl massstab={massstab} beiWahl={setzeMassstab} />
      <div className="staerkekacheln">
        {staende.map((s) => (
          <Kachel key={s.tempo} stand={s} massstab={massstab} />
        ))}
      </div>
      <p className="staerkelegende" aria-hidden="true">
        {WERTUNGSTEMPI.map((tempo) => {
          const Zeichen = ZEITARTZEICHEN[tempo];
          return (
            <span key={tempo}>
              <Zeichen size={LEGENDENZEICHEN} />
              {zeitklassenname(tempo)}
            </span>
          );
        })}
      </p>
    </section>
  );
}

/** Eine Kachel: Zeichen, Zahl (sonst „–“), Spanne, Wertung; für Bildschirmleser mit Namen. */
function Kachel({ stand, massstab }: { stand: Kachelstand; massstab: Wertungsmassstab }) {
  const Zeichen = ZEITARTZEICHEN[stand.tempo];
  const s = stand.schaetzung;
  const zahl = s ? zahlImMassstab(stand.tempo, s.mitte, massstab) : null;
  return (
    <div
      className={s ? "staerkekachel" : "staerkekachel leer"}
      role="group"
      aria-label={zeitklassenname(stand.tempo)}
      data-testid={`letzte-spielstaerke-${stand.tempo}`}
    >
      <Zeichen className="staerkekachel-zeichen" size={KACHELZEICHEN} aria-hidden="true" />
      <span className="staerkekachel-zahl">{zahl ? zahl.zahl : "–"}</span>
      {(s || stand.wertung !== null) && (
        <Listenname liste={massstab === "umgerechnet" ? zielname(stand.tempo) : null} />
      )}
      <Kachelzeilen stand={stand} massstab={massstab} />
    </div>
  );
}

/** Die kleinen Zeilen einer Kachel: Spanne (oder Grenze der Tabelle) und Wertung im Maßstab. */
function Kachelzeilen({ stand, massstab }: { stand: Kachelstand; massstab: Wertungsmassstab }) {
  const s = stand.schaetzung;
  const zahl = s ? zahlImMassstab(stand.tempo, s.mitte, massstab) : null;
  const spanne = s ? spanneImMassstab(stand.tempo, s.von, s.bis, massstab) : null;
  const wertung =
    stand.wertung === null ? null : zahlImMassstab(stand.tempo, stand.wertung, massstab);
  // Liegt eine Zahl außerhalb der Tabelle, steht einmal die Grenze dabei.
  const grenze = s && zahl?.ausserhalb ? s.mitte : wertung?.ausserhalb ? stand.wertung : null;
  return (
    <>
      <span className="staerkekachel-klein">
        {!s && t("spielstaerke.letzte.keine")}
        {s && spanne && t("spielstaerke.letzte.kachelSpanne", spanne)}
      </span>
      {grenze !== null && (
        <span className="staerkekachel-klein" data-testid="massstab-ausserhalb">
          {ausserhalbText(stand.tempo, grenze)}
        </span>
      )}
      {wertung && (
        <span className="staerkekachel-klein staerkekachel-wertung">
          {t(
            stand.vorlaeufig
              ? "spielstaerke.letzte.kachelWertungVorlaeufig"
              : "spielstaerke.letzte.kachelWertung",
            { wertung: wertung.zahl },
          )}
        </span>
      )}
    </>
  );
}

/** Hinter dem Fragezeichen: die Herleitung, je Zeitart Spanne, Phasen, Wertung, Entsprechung. */
function Erklaerung({ staende }: { staende: readonly Kachelstand[] }) {
  return (
    <>
      <p>{t("spielstaerke.letzte.erklaerung")}</p>
      {staende.map((stand) =>
        stand.schaetzung ? <Einzelheiten key={stand.tempo} stand={stand} /> : null,
      )}
      <p>{t("wertung.massstab.erklaerung")}</p>
    </>
  );
}

/** Ein Satzteil mit Punkt am Ende („… 1400“ → „… 1400.“), ein vorhandener bleibt. */
function alsSatz(teil: string): string {
  return /[.!?)]$/.test(teil) ? teil : `${teil}.`;
}

/** Eine Zeitart ausführlich: „Schnellschach: etwa 1400. 1050 bis 1750, aus 3 Partien. …“ */
function Einzelheiten({ stand }: { stand: Kachelstand }) {
  const s = stand.schaetzung;
  if (!s) return null;
  const phasen = PHASEN.flatMap((ph) => {
    const p = s.phasen[ph];
    return p ? [t("spielstaerke.letzte.phase", { phase: t(`phase.name.${ph}`), ...p })] : [];
  });
  const teile = [
    t("spielstaerke.letzte.zeile", { zeitklasse: zeitklassenname(s.tempo), mitte: s.mitte }),
    t(s.partien === 1 ? "spielstaerke.letzte.spanneEins" : "spielstaerke.letzte.spanne", {
      von: s.von,
      bis: s.bis,
      partien: s.partien,
    }),
    ...(phasen.length > 0 ? [phasen.join(" · ")] : []),
    ...(stand.wertung !== null
      ? [
          t(
            stand.vorlaeufig
              ? "spielstaerke.letzte.ausErgebnissenVorlaeufig"
              : "spielstaerke.letzte.ausErgebnissen",
            { wertung: stand.wertung },
          ),
        ]
      : []),
    entsprichtText(s),
  ];
  return <p>{teile.map(alsSatz).join(" ")}</p>;
}

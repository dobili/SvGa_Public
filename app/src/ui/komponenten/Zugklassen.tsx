/**
 * Karte „Deine Züge“ in der Auswertung: je Zugklasse ein Bullet-Diagramm mit Zonen (R56).
 *
 * Rolle im Gesamtbild: Wunsch des Autors (23.10.2026) nach Vorschaubildern: Jede Zeile hat Marke,
 * Namen, ein Badge mit der Anzahl und „x % des Üblichen · Urteil“; darunter ein Balken auf
 * eigener Skala (0 bis zum Doppelten des Üblichen) über drei grauen Zonen, mit einem Strich für
 * das Übliche bei der eigenen Stärke; die Zone „normal“ ist seit 0.2.125 die Spanne der Spieler
 * dieser Stärke und Zeitklasse (spiel/zugklassenvergleich.ts), also je Zeile verschieden breit. Bei den guten Klassen heißen die Zonen „wenig, normal,
 * viel“ mit „viel“ als gut, bei den schwachen umgekehrt. Unter MINDESTZUEGE_VERGLEICH eigenen
 * Zügen stehen nur die Anzahlen. Ersetzt die zweispaltige Tabelle „Züge nach Art“.
 * Abhängigkeiten: spiel/zugklassenvergleich.ts, Auswertungssymbole.tsx, InfoKnopf, i18n.
 */
import type { Zugklasse } from "../../spiel/auswertung";
import type { Wertungstempo } from "../../spiel/elomodell-daten";
import type { Seitenbilanz } from "../../spiel/genauigkeit";
import {
  GUTE_KLASSEN,
  MINDESTZUEGE_VERGLEICH,
  vergleicheKlasse,
  type Klassenvergleich,
} from "../../spiel/zugklassenvergleich";
import { t } from "../../i18n/sprache";
import { Klassenmarke } from "./Auswertungssymbole";
import { MitInfo } from "./InfoKnopf";
import { Titelsymbol } from "./Titelsymbol";

/** Reihenfolge wie bei chess.com: erst die guten Klassen, nach dem Strich die schwachen. */
const KLASSEN: readonly Zugklasse[] = [
  "brillant",
  "stark",
  "bester",
  "sehrGut",
  "gut",
  "buch",
  "ungenau",
  "fehler",
  "verpasst",
  "patzer",
];
const PROZENT = 100;
/** Über dem Dreifachen des Üblichen steht nur „über 300 %“ (ein brillanter Zug ergäbe sonst 3000 %). */
const RELATIV_HOECHSTENS = 3;
const ZONEN_GUT = ["schwach", "normal", "gut"] as const;
const ZONEN_SCHWACH = ["gut", "normal", "schwach"] as const;

/** Eine Zeile: Kopf mit Marke, Name, Badge und Urteil, darunter der Balken über den Zonen. */
function Klassenzeile({ v, vergleich }: { v: Klassenvergleich; vergleich: boolean }) {
  const gut = GUTE_KLASSEN.has(v.klasse);
  // Links wenige, rechts viele Züge der Klasse; das Urteil der Zone hängt an der Art der Klasse.
  const zonen = gut ? ZONEN_GUT : ZONEN_SCHWACH;
  return (
    <li className="zugklasse" data-testid={`zugklasse-${v.klasse}`}>
      <div className="zugklasse-kopf">
        <Klassenmarke klasse={v.klasse} />
        <span className="zugklasse-name" title={t(`zugklasse.${v.klasse}`)}>
          {t(`zugklasse.kurz.${v.klasse}`)}
        </span>
        <span className="badge zugklasse-anzahl">{v.anzahl}</span>
        {vergleich && (
          <span className={`zugklasse-urteil zugklasse-urteil-${v.urteil}`}>
            {t(v.relativ > RELATIV_HOECHSTENS ? "zugklassen.relativViel" : "zugklassen.relativ", {
              prozent: Math.round(Math.min(v.relativ, RELATIV_HOECHSTENS) * PROZENT),
              urteil: t(`zugklassen.urteil.${v.urteil}`),
            })}
            {v.ueberSkala && " ▸"}
          </span>
        )}
      </div>
      {vergleich && (
        <div
          className={`zugklasse-spur ${gut ? "zonen-gut" : "zonen-schwach"}`}
          style={{
            gridTemplateColumns: `${v.normalVon * PROZENT}% ${(v.normalBis - v.normalVon) * PROZENT}% ${(1 - v.normalBis) * PROZENT}%`,
          }}
          aria-hidden="true"
        >
          {zonen.map((zone, i) => (
            <span key={zone} className={`zugklasse-zone zone-${i}`}>
              {t(`zugklassen.urteil.${zone}`)}
            </span>
          ))}
          <span
            className={`zugklasse-wert klassenfarbe-${v.klasse}`}
            style={{ width: `${v.balken * PROZENT}%` }}
          />
          <span className="zugklasse-ueblich" />
        </div>
      )}
    </li>
  );
}

/**
 * Die Karte für eine Seite.
 * Eingaben: Bilanz der Seite (Anzahl je Klasse), Spielstärke für den Vergleich.
 * Beispiel: 33 Züge, 4 Ungenauigkeiten bei etwa 1400 → „?! Ungenau [4] 121 % des Üblichen · normal“.
 */
export function Zugklassen({
  bilanz,
  elo,
  tempo,
}: {
  bilanz: Seitenbilanz;
  elo: number;
  tempo: Wertungstempo;
}) {
  const vergleich = bilanz.zuege >= MINDESTZUEGE_VERGLEICH;
  const zeilen = KLASSEN.map((k) =>
    vergleicheKlasse(k, bilanz.klassen[k], bilanz.zuege, elo, tempo),
  );
  return (
    <section className="karte zugklassen" data-testid="zugklassen">
      <MitInfo
        zeile={
          <h2 className="karte-titel">
            <Titelsymbol art="spielstaerke" />
            {t("zugklassen.titel")}
          </h2>
        }
        erklaerung={<p>{t("zugklassen.erklaerung", { elo: Math.round(elo) })}</p>}
        thema={t("zugklassen.titel")}
      />
      {!vergleich && <p className="hinweis">{t("zugklassen.zuWenig")}</p>}
      <ul className="zugklassen-liste">
        {zeilen.map((v) => (
          <Fragmentzeile key={v.klasse} v={v} vergleich={vergleich} />
        ))}
      </ul>
    </section>
  );
}

/** Zeile mit Trennstrich vor der ersten schwachen Klasse. */
function Fragmentzeile({ v, vergleich }: { v: Klassenvergleich; vergleich: boolean }) {
  return (
    <>
      {v.klasse === "ungenau" && <li className="zugklassen-trenner" aria-hidden="true" />}
      <Klassenzeile v={v} vergleich={vergleich} />
    </>
  );
}

/**
 * Erste Hilfe des Taktiktrainers in knapper Form: jedes Warnsignal als roter Chip mit
 * Warnzeichen und Kurznamen („⚠ W1 ungedeckte Figur“), darunter drei Merkzeichen Schach, Schlag,
 * Drohung mit „erst Motiv suchen, dann rechnen“; der ganze Satz steht hinter ⓘ.
 *
 * Rolle im Gesamtbild: Runde „Weniger Text“, P14 (Wahl des Autors, 31.10.2026). Die Taktikaufgabe
 * (gesperrt, für P14 freigegeben) zeigt diese Hilfe statt des Satzes „Warnsignal: Signale auf
 * dem Brett: W1. Suche nach den Motiven dazu, dann rechne Schachs, Schläge, Drohungen.“ Der Satz
 * bleibt unverändert hinter dem Infoknopf; die Merkzeichen tragen ihre Namen sichtbar und für
 * Bildschirmleser.
 * Abhängigkeiten: analyse/k7-warnsignale.ts, schach/stellung.ts, bausteine/InfoKnopf.tsx,
 * lucide-react, i18n.
 * Buchbezug: Kapitel 7, Schritt 1 (Warnsignale W1 bis W7) und Schritt 2 (Schachs, Schläge,
 * Drohungen).
 */
import { Crosshair, Crown, Swords, TriangleAlert, type LucideIcon } from "lucide-react";
import { useMemo } from "react";
import { warnsignaleSieben } from "../../analyse/k7-warnsignale";
import { t } from "../../i18n/sprache";
import { stellungAusFen } from "../../schach/stellung";
import { MitInfo } from "../komponenten/bausteine/InfoKnopf";

const SYMBOLGROESSE = 18;
const MERKGROESSE = 24;

/** Die sieben Kennungen in der Reihenfolge des Buches. */
const KENNUNGEN = ["W1", "W2", "W3", "W4", "W5", "W6", "W7"] as const;
type Kennung = (typeof KENNUNGEN)[number];

/** Die drei Merkzeichen der Rechenreihenfolge (Kapitel 7, Schritt 2). */
const MERKZEICHEN: readonly {
  readonly bild: LucideIcon;
  readonly name: "schach" | "schlag" | "drohung";
}[] = [
  { bild: Crown, name: "schach" },
  { bild: Swords, name: "schlag" },
  { bild: Crosshair, name: "drohung" },
];

/**
 * Die Kennungen, die in den Befunden leuchten (Zeilen beginnen mit „W1 “ …), und das Fazit.
 * Beispiel: Abb. 10.28 → [„W1“], „Signale auf dem Brett: W1. Suche nach …“.
 */
function signale(fen: string, amZug: "w" | "b"): { kennungen: Kennung[]; satz: string } {
  const gelesen = stellungAusFen(fen);
  if (!gelesen.ok) return { kennungen: [], satz: "" };
  const ergebnis = warnsignaleSieben(gelesen.wert, amZug === "w" ? "white" : "black");
  const zeilen = ergebnis.befunde.filter((b) => b.kennung !== "motive").flatMap((b) => b.zeilen);
  const kennungen = KENNUNGEN.filter((k) => zeilen.some((z) => z.startsWith(`${k} `)));
  return { kennungen, satz: ergebnis.fazit };
}

/** Ein Chip je Signal, ohne Signal ein grauer Chip „Kein Signal“. */
function Signalchips({ kennungen }: { kennungen: readonly Kennung[] }) {
  if (kennungen.length === 0)
    return <span className="statuschip">{t("wenigertext.werkzeug.status.keinSignal")}</span>;
  return (
    <span className="signalchips">
      {kennungen.map((k) => (
        <span key={k} className="signalchip">
          <span className="warnchip">
            <TriangleAlert size={SYMBOLGROESSE} aria-hidden="true" />
            {k}
          </span>
          <span>{t(`wenigertext.werkzeug.taktik.${k}`)}</span>
        </span>
      ))}
    </span>
  );
}

/**
 * Die Hilfe „Warnsignal“: Chips, ⓘ mit dem Satz, darunter die drei Merkzeichen.
 * Beispiel: <Warnhinweis fen=… amZug="w" /> → „⚠ W1 ungedeckte Figur ⓘ“, Schach · Schlag ·
 * Drohung, „erst Motiv suchen, dann rechnen“.
 */
export function Warnhinweis({ fen, amZug }: { fen: string; amZug: "w" | "b" }) {
  const { kennungen, satz } = useMemo(() => signale(fen, amZug), [fen, amZug]);
  return (
    <div className="warnhinweis karte" data-testid="taktik-warnsignal">
      <MitInfo
        thema={t("wenigertext.werkzeug.taktik.thema")}
        zeile={<Signalchips kennungen={kennungen} />}
        erklaerung={<p>{t("taktiktrainer.hilfeWarnsignal", { text: satz })}</p>}
      />
      <ul className="merkzeichen">
        {MERKZEICHEN.map(({ bild: Bild, name }) => (
          <li key={name}>
            <span className="merkkachel" aria-hidden="true">
              <Bild size={MERKGROESSE} />
            </span>
            <span>{t(`wenigertext.werkzeug.taktik.${name}`)}</span>
          </li>
        ))}
      </ul>
      <p className="hinweis merkzeile">{t("wenigertext.werkzeug.taktik.erstMotiv")}</p>
    </div>
  );
}

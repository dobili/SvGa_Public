/**
 * Abschnitt „In Zahlen“ der Auswertung: Seitenwahl, Spielstärke und „Deine Züge“ (Entwurf F2).
 *
 * Rolle im Gesamtbild: Unter der Zeitleiste stehen die Kennzahlen der gewählten Seite. Wunsch des
 * Autors (31.10.2026): Weitere Kennzahlen sollen dazukommen, ohne umzubauen; deshalb sind die
 * Teile eine Liste (ZAHLENABSCHNITTE), ein neuer Teil ist ein Eintrag. „Deine Züge“ behält
 * ausdrücklich die Originalgrafik der App (Zugklassen.tsx: Balken mit Normalbereichen), nur im
 * neuen Stil; die Tabelle aus dem Entwurf ersetzt sie nicht.
 * Abhängigkeiten: Spielstaerke.tsx, Zugklassen.tsx, seitenzahlen.ts, bausteine/Segmentwahl, i18n.
 */
import type { Color } from "chessops/types";
import type { ReactNode } from "react";
import { t } from "../../../i18n/sprache";
import type { Partie } from "../../../spiel/partie";
import { Segmentwahl } from "../bausteine/Segmentwahl";
import type { Seitenzahlen } from "./seitenzahlen";
import { Spielstaerke } from "./Spielstaerke";
import { Zugklassen } from "./Zugklassen";

const SEITEN: readonly Color[] = ["white", "black"];

/** Was jeder Teil bekommt. */
interface Zahlenteil {
  readonly partie: Partie;
  readonly seite: Color;
  readonly zahlen: Seitenzahlen;
}

/** Die Teile in ihrer Reihenfolge. Neuer Teil: hier eintragen (Kennung und Inhalt). */
const ZAHLENABSCHNITTE: readonly {
  readonly kennung: string;
  readonly inhalt: (z: Zahlenteil) => ReactNode;
}[] = [
  {
    kennung: "spielstaerke",
    inhalt: (z) => <Spielstaerke partie={z.partie} seite={z.seite} zahlen={z.zahlen} />,
  },
  {
    kennung: "zugklassen",
    inhalt: (z) => (
      <Zugklassen
        bilanz={z.zahlen.b}
        elo={z.zahlen.elo}
        tempo={z.zahlen.tempo}
        botName={botnameDerSeite(z.partie, z.seite)}
      />
    ),
  },
];

/** Name des Bots, wenn die Seite ihm gehört; sonst null (eigene Seite, Mensch gegen Mensch). */
function botnameDerSeite(partie: Partie, s: Color): string | null {
  const e = partie.einstellung;
  if (e.gegner !== "engine" || s === e.eigeneFarbe) return null;
  return e.botName ?? t("spielstaerke.gegnerName");
}

/** Name einer Seite: bei der Engine mit ihrem Namen, die eigene Seite mit „(du)“. */
function seitenname(partie: Partie, s: Color): string {
  const e = partie.einstellung;
  const farbe = t(s === "white" ? "farbe.w" : "farbe.b");
  if (e.gegner !== "engine") return farbe;
  if (s === e.eigeneFarbe) return t("auswertung.seiteDu", { farbe });
  return t("auswertung.seiteGegner", { farbe, name: e.botName ?? t("spielstaerke.gegnerName") });
}

/** Umschalter Weiß/Schwarz für die ganze Auswertung (Zeitleiste und Zahlen). */
export function Seitenwahl({
  partie,
  seite,
  name,
  beiWahl,
}: {
  partie: Partie;
  seite: Color;
  name: string;
  beiWahl: (seite: Color) => void;
}) {
  return (
    <Segmentwahl
      name={name}
      werte={SEITEN}
      gewaehlt={seite}
      text={(s) => seitenname(partie, s)}
      beiWahl={beiWahl}
    />
  );
}

/**
 * Der Abschnitt mit Überschrift, Seitenwahl und allen Teilen.
 * Eingaben: Partie, gewählte Seite, Zahlen beider Seiten, Wechsel der Seite.
 */
export function Zahlen({
  partie,
  seite,
  zahlen,
  beiSeite,
}: {
  partie: Partie;
  seite: Color;
  zahlen: Readonly<Record<Color, Seitenzahlen>>;
  beiSeite: (seite: Color) => void;
}) {
  const teil: Zahlenteil = { partie, seite, zahlen: zahlen[seite] };
  return (
    <section className="auswertung-abschnitt" data-testid="in-zahlen">
      <h2 className="auswertung-ueberschrift">{t("auswertungneu.zahlen.titel")}</h2>
      <Seitenwahl partie={partie} seite={seite} name={t("auswertung.seite")} beiWahl={beiSeite} />
      {ZAHLENABSCHNITTE.map((a) => (
        <div key={a.kennung} className="zahlenteil">
          {a.inhalt(teil)}
        </div>
      ))}
    </section>
  );
}

/**
 * Vorrang der Eröffnungswahl im Spielfenster bei einem eigenen Bot mit festen Eröffnungen: Die
 * globale Wahl steht ausgegraut darunter, ein Haken „Eröffnung des Bots überschreiben“ gibt sie frei.
 *
 * Rolle im Gesamtbild: Wunsch des Autors (Ideensammlung, freigegeben 30.10.2026, Paket 9). Ohne
 * Haken wählt der Bot je Partie eine seiner Eröffnungen (spiel/boteroeffnung.ts,
 * eroeffnungFuerPartie); mit Haken gilt die Wahl darunter, auch „wie Menschen dieser Stärke“.
 * Abhängigkeiten: engine/gegner.ts (Typ), EroeffnungsWahl, i18n, useEroeffnungsname.
 */
import type { ReactNode } from "react";
import type { EigenerGegner } from "../../../engine/gegner";
import { t } from "../../../i18n/sprache";
import { EroeffnungsWahl } from "./EroeffnungsWahl";
import { useEroeffnungsname } from "./useEroeffnungsname";

/** So viele Eröffnungen nennt der Hinweis, dahinter „…“. */
const GENANNT = 3;

/** Hinweis, Haken und die (gesperrte oder freie) globale Wahl als `kinder`. */
export function BotEroeffnungVorrang({
  botName,
  eroeffnungen,
  ueberschreiben,
  beiUeberschreiben,
  kinder,
}: {
  botName: string;
  eroeffnungen: readonly string[];
  ueberschreiben: boolean;
  beiUeberschreiben: (an: boolean) => void;
  kinder: ReactNode;
}) {
  const namen = useEroeffnungsname();
  const liste = eroeffnungen.slice(0, GENANNT).map(namen).join(", ");
  const mehr = eroeffnungen.length > GENANNT ? ", …" : "";
  return (
    <div className="botvorrang" data-testid="bot-eroeffnung-vorrang">
      <p className="hinweis">
        {t("spielen.boteroeffnung.vorrang", { name: botName, liste: `${liste}${mehr}` })}
      </p>
      <label className="schalterzeile">
        <input
          type="checkbox"
          checked={ueberschreiben}
          onChange={(e) => beiUeberschreiben(e.target.checked)}
        />
        {t("spielen.boteroeffnung.ueberschreiben")}
      </label>
      <fieldset
        className={ueberschreiben ? "ohne-rahmen" : "ohne-rahmen ausgegraut"}
        disabled={!ueberschreiben}
        data-testid="globale-eroeffnung"
      >
        {kinder}
      </fieldset>
    </div>
  );
}

/**
 * Die Eröffnungswahl der Klappe „Eröffnung festlegen“: bei einem eigenen Bot mit festen
 * Eröffnungen hinter dem Vorrang, sonst wie bisher allein.
 */
export function Eroeffnungsteil({
  gewaehlt,
  beiWahl,
  bot,
  ueberschreiben,
  beiUeberschreiben,
}: {
  gewaehlt: string | null;
  beiWahl: (eroeffnung: string | null) => void;
  /** Der gewählte eigene Bot, sonst undefined. */
  bot: EigenerGegner | undefined;
  ueberschreiben: boolean;
  beiUeberschreiben: (an: boolean) => void;
}) {
  const wahl = <EroeffnungsWahl eingebettet gewaehlt={gewaehlt} beiWahl={beiWahl} />;
  const feste = bot?.eroeffnungen ?? [];
  if (!bot || feste.length === 0) return wahl;
  return (
    <BotEroeffnungVorrang
      botName={bot.name}
      eroeffnungen={feste}
      ueberschreiben={ueberschreiben}
      beiUeberschreiben={beiUeberschreiben}
      kinder={wahl}
    />
  );
}

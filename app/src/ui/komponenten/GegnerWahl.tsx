/**
 * Wahl des Gegners vor der Partie: Engine oder Mensch; bei der Engine ein vorgefertigter Gegner
 * oder eigene Stufen; dazu Spielhilfen und Wertung.
 *
 * Rolle im Gesamtbild: Wünsche des Autors vom 17.10.2026: beide Seiten selbst spielen (gegen
 * einen Menschen am selben Gerät), vorgefertigte Gegner mit Namen (engine/gegner.ts), Spielhilfen
 * vor der Partie zuschaltbar, ungewertete Partien. Die Auswahl eines Gegners setzt die drei
 * Regler (StufenWahl.tsx); wer danach einen Regler bewegt, spielt wieder mit eigenen Stufen.
 * Abhängigkeiten: engine/gegner.ts, engine/stufen.ts, spiel/partie.ts (Typen), i18n.
 */
import { durchschnitt, gegnerSortiert, klasseVon } from "../../engine/gegner";
import { t } from "../../i18n/sprache";
import type { Gegnerart, Spielhilfen } from "../../spiel/partie";
import { Auswahl } from "./Auswahl";

const EIGENE = "";

/** „Nina · ⌀ 3 · Fortgeschrittener Anfänger (3 · 3 · 3)“ */
function gegnertext(g: ReturnType<typeof gegnerSortiert>[number]): string {
  const s = g.stufenJePhase;
  return t("spielen.gegnerZeile", {
    name: g.name,
    schnitt: String(durchschnitt(g)).replace(".", ","),
    klasse: t(klasseVon(g).name),
    stufen: `${s.eroeffnung} · ${s.mittelspiel} · ${s.endspiel}`,
  });
}

export function GegnerWahl({
  gegner,
  bot,
  beiGegner,
  beiBot,
}: {
  gegner: Gegnerart;
  bot: string | null;
  beiGegner: (gegner: Gegnerart) => void;
  beiBot: (bot: string | null) => void;
}) {
  const gewaehlt = gegnerSortiert().find((g) => g.kennung === bot) ?? null;
  return (
    <>
      <Auswahl
        name={t("spielen.gegner")}
        werte={["engine", "mensch"] as const}
        gewaehlt={gegner}
        text={(w) => t(`spielen.gegner.${w}`)}
        beiWahl={beiGegner}
      />
      {gegner === "engine" && (
        <div className="gegnerwahl">
          <label className="einstellung-name" htmlFor="gegner-bot">
            {t("spielen.bot")}
          </label>
          <select
            id="gegner-bot"
            className="auswahlfeld"
            value={bot ?? EIGENE}
            onChange={(e) => beiBot(e.target.value === EIGENE ? null : e.target.value)}
          >
            <option value={EIGENE}>{t("spielen.bot.eigene")}</option>
            {gegnerSortiert().map((g) => (
              <option key={g.kennung} value={g.kennung}>
                {gegnertext(g)}
              </option>
            ))}
          </select>
          {gewaehlt && <p className="hinweis">{t(gewaehlt.beschreibung)}</p>}
        </div>
      )}
    </>
  );
}

/** Zwei Haken für die Spielhilfen und einer für die Wertung. */
/**
 * Die Spielhilfen und der Haken „Gewertete Partie“. `wertbar`: nur Partien gegen die Engine aus
 * der Grundstellung zählen für die Wertung (Wunsch des Autors, 17.10.2026); sonst steht statt des
 * Hakens ein Satz.
 */
export function HilfenWahl({
  hilfen,
  gewertet,
  wertbar,
  beiHilfen,
  beiGewertet,
}: {
  hilfen: Spielhilfen;
  gewertet: boolean;
  wertbar: boolean;
  beiHilfen: (hilfen: Spielhilfen) => void;
  beiGewertet: (gewertet: boolean) => void;
}) {
  return (
    <>
      <span className="einstellung-name">{t("spielen.hilfen")}</span>
      <label className="schalterzeile">
        <input
          type="checkbox"
          checked={hilfen.symbole}
          onChange={(e) => beiHilfen({ ...hilfen, symbole: e.target.checked })}
        />
        {t("spielen.hilfen.symbole")}
      </label>
      <label className="schalterzeile">
        <input
          type="checkbox"
          checked={hilfen.werkzeuge}
          onChange={(e) => beiHilfen({ ...hilfen, werkzeuge: e.target.checked })}
        />
        {t("spielen.hilfen.werkzeuge")}
      </label>
      {wertbar ? (
        <>
          <label className="schalterzeile">
            <input
              type="checkbox"
              checked={gewertet}
              onChange={(e) => beiGewertet(e.target.checked)}
            />
            {t("spielen.gewertet")}
          </label>
          <p className="hinweis">{t("spielen.gewertetHinweis")}</p>
        </>
      ) : (
        <p className="hinweis">{t("spielen.nichtWertbar")}</p>
      )}
    </>
  );
}

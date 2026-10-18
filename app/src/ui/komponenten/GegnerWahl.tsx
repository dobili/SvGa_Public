/**
 * Wahl des Gegners vor der Partie: Engine oder Mensch; bei der Engine ein vorgefertigter Gegner
 * (Porträtgitter je Stufe, 0.2.65), ein eigener Gegner oder eigene Stufen; dazu Spielhilfen und
 * Wertung.
 *
 * Rolle im Gesamtbild: Wünsche des Autors vom 17.10.2026: beide Seiten selbst spielen (gegen
 * einen Menschen am selben Gerät), vorgefertigte Gegner mit Namen (engine/gegner.ts), Spielhilfen
 * vor der Partie zuschaltbar, ungewertete Partien. Seit 0.2.65 (Wunsch vom 18.10.2026, Vorbild
 * chess.com) stehen die 64 Gegner als Porträts in acht Gruppen je Stufe; der gewählte stellt sich
 * oben in einer Sprechblase vor. Die Auswahl eines Gegners setzt die drei Regler (StufenWahl.tsx);
 * wer danach einen Regler bewegt, spielt wieder mit eigenen Stufen (Kachel „Eigene Stufen“).
 * Seit 0.2.80 (Wunsch des Autors, 18.10.2026) drei Kategorien als Kacheln mit Symbol: eigene
 * Stufe, vorgefertigte Bots, eigene Bots. Die gewählte zeigt direkt darunter nur ihren Inhalt
 * (Regler und Fehlerarten, Porträtgitter, eigene Bots mit Editor); der Rest bleibt verborgen.
 * Seit 0.2.85 (Rückfrage S23) steht an jeder Stufe, jeder Kachel und in der Sprechblase die
 * Elo-Zahl auf der Skala von „Deine Spielstärke“ (engine/botstaerke.ts), mit Erklärung hinter
 * dem Fragezeichen; eigene Stufen und eigene Bots mit dem Zusatz „geschätzt“.
 * Seit 0.2.86 (Wunsch des Autors) steht „Partie beginnen“ direkt unter den drei Kacheln, damit man
 * nicht weit scrollen muss; die Stufen der vorgefertigten Bots sind aufklappbar (Gegnerstufen.tsx).
 * Abhängigkeiten: engine/gegner.ts, engine/botstaerke.ts, engine/stufen.ts, spiel/partie.ts
 * (Typen), Vorschauwahl, InfoKnopf, staerkeangabe.ts, lucide, i18n.
 */
import { Bot, SlidersHorizontal, UserPen } from "lucide-react";
import type { ReactNode } from "react";
import { staerkeAusStufen, staerkeDesBots } from "../../engine/botstaerke";
import { gegnerVon, klasseVon, type EigenerGegner, istSpassbot } from "../../engine/gegner";
import type { Stufennummer } from "../../engine/stufen";
import { t } from "../../i18n/sprache";
import type { Phase } from "../../schach/phase";
import type { Gegnerart, Spielhilfen } from "../../spiel/partie";
import { Auswahl } from "./Auswahl";
import type { Gegnerkategorie } from "./gegnerkategorie";
import { portraet } from "./gegnerportraet";
import { Kachel, VorgefertigteGitter } from "./Gegnerstufen";
import { MitInfo } from "./InfoKnopf";
import { staerketext } from "./staerkeangabe";
import { Vorschauwahl } from "./Vorschauwahl";

/** Größe der Symbole auf den Kategorie-Kacheln. */
const KATEGORIE_SYMBOL = 28;

const KATEGORIEN: readonly Gegnerkategorie[] = ["stufe", "vorgefertigt", "eigene"];
const KATEGORIE_SYMBOLE = { stufe: SlidersHorizontal, vorgefertigt: Bot, eigene: UserPen };

/** Stufen je Phase, wie die Regler sie halten. */
type Stufenwahl = Readonly<Record<Phase, Stufennummer>>;

/**
 * Die Zeile mit der Zahl: „etwa 1550 (Stufe 2)“ für vorgefertigte Bots, „etwa 1700 (geschätzt)“
 * für eigene Bots, „Deine Einstellung 3 · 4 · 3 · etwa 1250 (geschätzt)“ für eigene Stufen.
 */
function staerkezeile(
  bot: string | null,
  eigener: EigenerGegner | null,
  stufen: Stufenwahl,
): string {
  const vorgefertigt = gegnerVon(bot);
  const gemessen = staerkeDesBots(bot);
  if (vorgefertigt && gemessen !== null) {
    // Spaß-Bots (0.2.87) stehen in keiner Stufe, sondern in der Gruppe „Zum Spaß“.
    if (istSpassbot(vorgefertigt))
      return t("spielen.bot.blaseSpass", { staerke: staerketext(gemessen) });
    const nummer = String(klasseVon(vorgefertigt).nummer);
    return t("spielen.bot.blase", { staerke: staerketext(gemessen), nummer });
  }
  if (eigener) {
    const staerke = staerketext(staerkeAusStufen(eigener.stufenJePhase));
    return t("spielen.bot.blaseGeschaetzt", { staerke });
  }
  return t("spielen.bot.blaseStufen", {
    eroeffnung: String(stufen.eroeffnung),
    mittelspiel: String(stufen.mittelspiel),
    endspiel: String(stufen.endspiel),
    staerke: staerketext(staerkeAusStufen(stufen)),
  });
}

/** Die Sprechblase des gewählten Gegners: Porträt, Name, Zahl mit Erklärung und sein Satz. */
function Sprechblase({
  bot,
  eigene,
  stufen,
}: {
  bot: string | null;
  eigene: readonly EigenerGegner[];
  stufen: Stufenwahl;
}) {
  const vorgefertigt = gegnerVon(bot);
  const eigener = eigene.find((g) => g.kennung === bot) ?? null;
  const name = vorgefertigt?.name ?? eigener?.name ?? t("spielen.bot.eigene");
  const text = vorgefertigt
    ? t(vorgefertigt.beschreibung)
    : eigener
      ? t("spielen.bot.eigenerText")
      : t("spielen.bot.eigeneText");
  return (
    <div className="gegner-sprechblase" data-testid="gegner-sprechblase">
      {vorgefertigt ? (
        <img className="gegner-portraet" src={portraet(vorgefertigt.kennung)} alt="" />
      ) : (
        <span className="gegner-portraet gegner-zeichen" aria-hidden="true">
          {eigener ? eigener.name.slice(0, 1) : <SlidersHorizontal size={28} />}
        </span>
      )}
      <div className="gegner-blase">
        <MitInfo
          thema={t("botstaerke.thema")}
          zeile={
            <>
              <strong>{name}</strong>
              <span className="gegner-klasse" data-testid="gegner-staerke">
                {" · "}
                {staerkezeile(bot, eigener, stufen)}
              </span>
            </>
          }
          erklaerung={t("botstaerke.erklaerung")}
        />
        <p>{text}</p>
      </div>
    </div>
  );
}

/** Die eigenen Gegner des Lesers als Kacheln mit dem Anfangsbuchstaben. */
function EigeneGitter({
  bot,
  eigene,
  beiBot,
}: {
  bot: string | null;
  eigene: readonly EigenerGegner[];
  beiBot: (bot: string | null) => void;
}) {
  if (eigene.length === 0) return null;
  return (
    <div role="radiogroup" aria-label={t("spielen.eigene.titel")} className="gegnergitter">
      {eigene.map((g) => (
        <Kachel
          key={g.kennung}
          name={g.name}
          gewaehlt={bot === g.kennung}
          beiWahl={() => beiBot(g.kennung)}
          kinder={
            <span className="gegner-portraet gegner-zeichen" aria-hidden="true">
              {g.name.slice(0, 1)}
            </span>
          }
        />
      ))}
    </div>
  );
}

/**
 * Gegner, Kategorie und der Inhalt der gewählten Kategorie.
 * `stufeninhalt`: Regler und Fehlerarten (eigene Stufe); `editor`: Karte der eigenen Gegner;
 * `beginnen`: der Knopf „Partie beginnen“ (unter den Kategorien, beim Menschen unter der Wahl).
 */
export function GegnerWahl({
  gegner,
  bot,
  stufen,
  eigene,
  kategorie,
  beiGegner,
  beiBot,
  beiKategorie,
  stufeninhalt,
  editor,
  beginnen,
}: {
  gegner: Gegnerart;
  bot: string | null;
  /** Die Stufen je Phase der Regler (für die geschätzte Zahl der eigenen Stufe, 0.2.85). */
  stufen: Stufenwahl;
  /** Eigene Gegner des Lesers (0.2.42). */
  eigene: readonly EigenerGegner[];
  kategorie: Gegnerkategorie;
  beiGegner: (gegner: Gegnerart) => void;
  beiBot: (bot: string | null) => void;
  beiKategorie: (kategorie: Gegnerkategorie) => void;
  stufeninhalt: ReactNode;
  editor: ReactNode;
  beginnen: ReactNode;
}) {
  return (
    <>
      <Auswahl
        name={t("spielen.gegner")}
        werte={["engine", "mensch"] as const}
        gewaehlt={gegner}
        text={(w) => t(`spielen.gegner.${w}`)}
        beiWahl={beiGegner}
      />
      {gegner === "mensch" && beginnen}
      {gegner === "engine" && (
        <div className="gegnerwahl">
          <Vorschauwahl
            name={t("spielen.kategorie")}
            werte={KATEGORIEN}
            gewaehlt={kategorie}
            text={(k) => t(`spielen.kategorie.${k}`)}
            vorschau={(k) => {
              const Symbol = KATEGORIE_SYMBOLE[k];
              return <Symbol size={KATEGORIE_SYMBOL} aria-hidden="true" />;
            }}
            beiWahl={beiKategorie}
          />
          {beginnen}
          {(kategorie !== "eigene" || eigene.some((g) => g.kennung === bot)) && (
            <Sprechblase bot={bot} eigene={eigene} stufen={stufen} />
          )}
          {kategorie === "stufe" && stufeninhalt}
          {kategorie === "vorgefertigt" && <VorgefertigteGitter bot={bot} beiBot={beiBot} />}
          {kategorie === "eigene" && (
            <>
              <EigeneGitter bot={bot} eigene={eigene} beiBot={beiBot} />
              {editor}
            </>
          )}
        </div>
      )}
    </>
  );
}

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
  // Gewertete Partien ohne Spielhilfen (S9): die Haken sind dann gesperrt und leer.
  const gesperrt = wertbar && gewertet;
  return (
    <>
      <span className="einstellung-name">{t("spielen.hilfen")}</span>
      <label className="schalterzeile">
        <input
          type="checkbox"
          disabled={gesperrt}
          checked={hilfen.symbole && !gesperrt}
          onChange={(e) => beiHilfen({ ...hilfen, symbole: e.target.checked })}
        />
        {t("spielen.hilfen.symbole")}
      </label>
      <label className="schalterzeile">
        <input
          type="checkbox"
          disabled={gesperrt}
          checked={hilfen.werkzeuge && !gesperrt}
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
          {gesperrt && <p className="hinweis">{t("spielen.gewertetOhneHilfen")}</p>}
        </>
      ) : (
        <p className="hinweis">{t("spielen.nichtWertbar")}</p>
      )}
    </>
  );
}

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
 * Abhängigkeiten: engine/gegner.ts, engine/stufen.ts, spiel/partie.ts (Typen), Vorschauwahl,
 * lucide, i18n.
 */
import { Bot, SlidersHorizontal, UserPen } from "lucide-react";
import type { ReactNode } from "react";
import {
  durchschnitt,
  gegnerDerStufe,
  gegnerVon,
  klasseVon,
  type EigenerGegner,
  type Gegner,
} from "../../engine/gegner";
import { stufe, type Stufennummer } from "../../engine/stufen";
import { t } from "../../i18n/sprache";
import type { Gegnerart, Spielhilfen } from "../../spiel/partie";
import { Auswahl } from "./Auswahl";
import type { Gegnerkategorie } from "./gegnerkategorie";
import { Vorschauwahl } from "./Vorschauwahl";

const STUFENNUMMERN: readonly Stufennummer[] = [1, 2, 3, 4, 5, 6, 7, 8];
/** Größe der Symbole auf den Kategorie-Kacheln. */
const KATEGORIE_SYMBOL = 28;

const KATEGORIEN: readonly Gegnerkategorie[] = ["stufe", "vorgefertigt", "eigene"];
const KATEGORIE_SYMBOLE = { stufe: SlidersHorizontal, vorgefertigt: Bot, eigene: UserPen };

/** Ordner der Porträts (app/public/gegner/, erzeugt von skripte/erzeuge-gegnerbilder.mjs). */
const PORTRAETS = "gegner/";

/** Adresse des Porträts eines vorgefertigten Gegners. */
function portraet(kennung: string): string {
  return `${import.meta.env.BASE_URL}${PORTRAETS}${kennung}.svg`;
}

/** „⌀ 3 · Fortgeschrittener Anfänger“ (die Stufen je Phase bleiben verborgen, 0.2.46). */
function klassentext(g: Gegner): string {
  return t("spielen.gegnerKlasse", {
    schnitt: String(durchschnitt(g)).replace(".", ","),
    klasse: t(klasseVon(g).name),
  });
}

/** Eine Kachel des Gitters: Porträt oder Zeichen, Name darunter; gewählt mit goldenem Rand. */
function Kachel({
  name,
  gewaehlt,
  beiWahl,
  kinder,
}: {
  name: string;
  gewaehlt: boolean;
  beiWahl: () => void;
  kinder: React.ReactNode;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={gewaehlt}
      className="gegnerkachel"
      onClick={beiWahl}
    >
      {kinder}
      <span className="gegnerkachel-name">{name}</span>
    </button>
  );
}

/** Die Sprechblase des gewählten Gegners: Porträt, Name, Klasse und sein Satz. */
function Sprechblase({ bot, eigene }: { bot: string | null; eigene: readonly EigenerGegner[] }) {
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
        <strong>{name}</strong>
        {vorgefertigt && <span className="gegner-klasse"> · {klassentext(vorgefertigt)}</span>}
        <p>{text}</p>
      </div>
    </div>
  );
}

/** Die vorgefertigten Gegner: je Stufe acht Porträts. */
function VorgefertigteGitter({
  bot,
  beiBot,
}: {
  bot: string | null;
  beiBot: (bot: string | null) => void;
}) {
  return (
    <div role="radiogroup" aria-label={t("spielen.bot")}>
      {STUFENNUMMERN.map((nummer) => (
        <section key={nummer} className="gegnerstufe">
          <h4 className="gegnerstufe-titel">
            {t("spielen.bot.stufe", { nummer: String(nummer), name: t(stufe(nummer).name) })}
          </h4>
          <div className="gegnergitter">
            {gegnerDerStufe(nummer).map((g) => (
              <Kachel
                key={g.kennung}
                name={g.name}
                gewaehlt={bot === g.kennung}
                beiWahl={() => beiBot(g.kennung)}
                kinder={<img className="gegner-portraet" src={portraet(g.kennung)} alt="" />}
              />
            ))}
          </div>
        </section>
      ))}
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
 * `stufeninhalt`: Regler und Fehlerarten (eigene Stufe); `editor`: Karte der eigenen Gegner.
 */
export function GegnerWahl({
  gegner,
  bot,
  eigene,
  kategorie,
  beiGegner,
  beiBot,
  beiKategorie,
  stufeninhalt,
  editor,
}: {
  gegner: Gegnerart;
  bot: string | null;
  /** Eigene Gegner des Lesers (0.2.42). */
  eigene: readonly EigenerGegner[];
  kategorie: Gegnerkategorie;
  beiGegner: (gegner: Gegnerart) => void;
  beiBot: (bot: string | null) => void;
  beiKategorie: (kategorie: Gegnerkategorie) => void;
  stufeninhalt: ReactNode;
  editor: ReactNode;
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
          {(kategorie !== "eigene" || eigene.some((g) => g.kennung === bot)) && (
            <Sprechblase bot={bot} eigene={eigene} />
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

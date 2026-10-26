/**
 * Wahl des Gegners vor der Partie: Engine oder Mensch; bei der Engine ein vorgefertigter Gegner
 * (Porträtgitter je Stufe), ein eigener Gegner oder eigene Stufen; dazu Spielhilfen und Wertung
 * (HilfenWahl.tsx).
 *
 * Rolle im Gesamtbild: Wünsche des Autors vom 17.10.2026: beide Seiten selbst spielen (gegen
 * einen Menschen am selben Gerät), vorgefertigte Gegner mit Namen (engine/gegner.ts), Spielhilfen
 * vor der Partie zuschaltbar, ungewertete Partien. Die 64 Gegner stehen als Porträts in acht
 * Gruppen je Stufe (Wunsch vom 18.10.2026, Vorbild chess.com); der gewählte stellt sich oben in
 * einer Sprechblase vor. Die Auswahl eines Gegners setzt die drei Regler (StufenWahl.tsx); wer
 * danach einen Regler bewegt, spielt wieder mit eigenen Stufen (Kachel „Eigene Stufen“).
 * Drei Kategorien als Kacheln mit Symbol (Wunsch des Autors, 18.10.2026): eigene Stufe,
 * vorgefertigte Bots, eigene Bots. Die gewählte zeigt direkt darunter nur ihren Inhalt (Regler
 * und Fehlerarten, Porträtgitter, eigene Bots mit Editor); der Rest bleibt verborgen.
 * An jeder Stufe, jeder Kachel und in der Sprechblase steht die Elo-Zahl auf der Skala von „Deine
 * Spielstärke“ (engine/botstaerke.ts, Rückfrage S23), mit Erklärung hinter dem Fragezeichen;
 * eigene Stufen und eigene Bots mit dem Zusatz „geschätzt“.
 * Die Stufen der vorgefertigten Bots sind aufklappbar (Gegnerstufen.tsx). „Partie beginnen“ steht
 * in der festen Startleiste (Startleiste.tsx, DS40).
 * Abhängigkeiten: engine/gegner.ts, engine/botstaerke.ts, engine/stufen.ts, spiel/partie.ts
 * (Typen), Vorschauwahl, InfoKnopf, HilfenWahl, staerkeangabe.ts, lucide, i18n.
 */
import type { Fehlerart } from "../../../engine/fehlerart";
import { Bot, Cpu, SlidersHorizontal, UserPen, Users } from "lucide-react";
import type { ReactNode } from "react";
import {
  staerkeGeschaetzt,
  staerkeDesBots,
  uhrAbzug,
  type Uhrangabe,
} from "../../../engine/botstaerke";
import { gegnerVon, klasseVon, type EigenerGegner, istSpassbot } from "../../../engine/gegner";
import type { Stufennummer } from "../../../engine/stufen";
import { t } from "../../../i18n/sprache";
import type { Phase } from "../../../schach/phase";
import type { Gegnerart } from "../../../spiel/partie";
import { Auswahl } from "../bausteine/Auswahl";
import type { Gegnerkategorie } from "./gegnerkategorie";
import { useSpeicher } from "../../../speicher/speicher";
import { GegnerBild } from "./GegnerBild";
import { gruppenstufe } from "../../../engine/gruppe";
import { gruppenname, gruppenstaerketext } from "./gruppentexte";
import { wertungstempo } from "../../../spiel/elomodell";
import { besiegtIn } from "../../../speicher/besiegt";
import { Kachel, VorgefertigteGitter } from "./Gegnerstufen";
import { MitInfo } from "../bausteine/InfoKnopf";
import { staerketext } from "./staerkeangabe";
import { Vorschauwahl } from "../bausteine/Vorschauwahl";

/** Größe der Symbole auf den Kategorie-Kacheln. */
const KATEGORIE_SYMBOL = 28;
/** Zeichen der eigenen Stufe anstelle eines Porträts. */
const PORTRAETSYMBOL = 28;
/** Größe der Zeichen in den Chips „Engine“ und „Mensch“. */
const ZEICHEN = 18;

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
  uhr: Uhrangabe | null,
  erlaubte?: readonly Fehlerart[],
): string {
  const vorgefertigt = gegnerVon(bot);
  const gemessen = staerkeDesBots(bot, wertungstempo(uhr));
  if (vorgefertigt && gemessen !== null) {
    const mitUhr = uhrzeile(gemessen, vorgefertigt.stufenJePhase, uhr);
    // Spaß-Bots (0.2.88) stehen in keiner Stufe, sondern in der Gruppe „Zum Spaß“.
    if (istSpassbot(vorgefertigt))
      return t("spielen.bot.blaseSpass", { staerke: staerketext(gemessen) }) + mitUhr;
    const nummer = String(klasseVon(vorgefertigt).nummer);
    return t("spielen.bot.blase", { staerke: staerketext(gemessen), nummer }) + mitUhr;
  }
  if (eigener) {
    const staerke = staerketext(staerkeGeschaetzt(eigener));
    return t("spielen.bot.blaseGeschaetzt", { staerke });
  }
  return t("spielen.bot.blaseStufen", {
    eroeffnung: String(stufen.eroeffnung),
    mittelspiel: String(stufen.mittelspiel),
    endspiel: String(stufen.endspiel),
    // Seit 0.2.126: ohne angehakte Fehlerart spielt die eigene Stufe rein (engine/botstaerke.ts).
    staerke: staerketext(staerkeGeschaetzt({ stufenJePhase: stufen, fehlerarten: erlaubte })),
  });
}

const MINUTE_MS = 60_000;
const SEKUNDE_MS = 1000;

/**
 * Die Zahl mit der gewählten Uhr (seit 0.2.117; mit Uhr spielt ein Bot schwächer, gemessen je
 * Stufe und Bedenkzeit): „ · mit Uhr 5 + 3 etwa 1700“; ohne Uhr oder ohne Unterschied leer.
 */
function uhrzeile(ohneUhr: number, stufenJePhase: Stufenwahl, uhr: Uhrangabe | null): string {
  const abzug = uhrAbzug(stufenJePhase, uhr);
  if (!uhr || Math.round(abzug) === 0) return "";
  return t("spielen.bot.mitUhr", {
    minuten: String(uhr.grundzeitMs / MINUTE_MS),
    sekunden: String(uhr.zuschlagMs / SEKUNDE_MS),
    staerke: staerketext(ohneUhr + abzug),
  });
}

/** Die Sprechblase des gewählten Gegners: Porträt, Name, Zahl mit Erklärung und sein Satz. */
function Sprechblase({
  bot,
  eigene,
  stufen,
  uhr,
  erlaubte,
}: {
  bot: string | null;
  eigene: readonly EigenerGegner[];
  stufen: Stufenwahl;
  uhr: Uhrangabe | null;
  /** Abhakliste der eigenen Stufe (0.2.126; leer: sie spielt rein). */
  erlaubte?: readonly Fehlerart[];
}) {
  const vorgefertigt = gegnerVon(bot);
  const eigener = eigene.find((g) => g.kennung === bot) ?? null;
  const gruppe = gruppenstufe(bot);
  const name =
    gruppe !== null
      ? gruppenname(gruppe)
      : (vorgefertigt?.name ?? eigener?.name ?? t("spielen.bot.eigene"));
  // Siegmarken aller Zeitklassen, je eine eigene (25.10.2026; vorher nur die der gewählten Uhr).
  const alleBesiegt = useSpeicher((z) => z.daten.spiel.besiegt);
  const text =
    gruppe !== null
      ? t("gruppe.text", { nummer: String(gruppe) })
      : vorgefertigt
        ? t(vorgefertigt.beschreibung)
        : eigener
          ? t("spielen.bot.eigenerText")
          : t("spielen.bot.eigeneText");
  const staerke =
    gruppe !== null
      ? gruppenstaerketext(alleBesiegt, gruppe)
      : staerkezeile(bot, eigener, stufen, uhr, erlaubte);
  return (
    <div
      className="gegner-sprechblase"
      data-testid="gegner-sprechblase"
      data-tour="spielen-sprechblase"
    >
      {vorgefertigt || eigener || gruppe !== null ? (
        <GegnerBild bot={bot} eigene={eigene} name={name} besiegtIn={besiegtIn(alleBesiegt, bot)} />
      ) : (
        <span className="gegner-portraet gegner-zeichen" aria-hidden="true">
          <SlidersHorizontal size={PORTRAETSYMBOL} />
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
                {staerke}
              </span>
            </>
          }
          erklaerung={
            vorgefertigt || gruppe !== null ? (
              t("botstaerke.erklaerung")
            ) : (
              // Seit 0.2.137: Bei eigener Stufe und eigenen Bots erklärt der Text nur die
              // Bedienung; er steht deshalb hinter dem Fragezeichen.
              <>
                <p>{text}</p>
                <p>{t("botstaerke.erklaerung")}</p>
              </>
            )
          }
        />
        {(vorgefertigt || gruppe !== null) && <p>{text}</p>}
      </div>
    </div>
  );
}

/** Die eigenen Gegner des Lesers als Kacheln mit Porträt oder Anfangsbuchstaben. */
function EigeneGitter({
  bot,
  eigene,
  beiBot,
}: {
  bot: string | null;
  eigene: readonly EigenerGegner[];
  beiBot: (bot: string | null) => void;
}) {
  const besiegt = useSpeicher((z) => z.daten.spiel.besiegt);
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
            <GegnerBild
              bot={g.kennung}
              eigene={eigene}
              name={g.name}
              besiegtIn={besiegtIn(besiegt, g.kennung)}
            />
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
  stufen,
  eigene,
  kategorie,
  beiGegner,
  beiBot,
  beiKategorie,
  stufeninhalt,
  editor,
  uhr = null,
  erlaubte,
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
  /** Die gewählte Uhr (seit 0.2.117: Zahl des Bots mit Uhr in der Sprechblase). */
  uhr?: Uhrangabe | null;
  /** Abhakliste der eigenen Stufe (0.2.126; leer: sie spielt rein, die Zahl ist die der reinen Stufe). */
  erlaubte?: readonly Fehlerart[];
}) {
  return (
    <>
      {/* Hülle nur als Ziel der Tour (erster Schritt: Engine oder Mensch). */}
      <div data-tour="spielen-gegnerart">
        <Auswahl
          name={t("spielen.gegner")}
          werte={["engine", "mensch"] as const}
          gewaehlt={gegner}
          text={(w) => t(`spielen.gegner.${w}`)}
          zeichen={(w) => (w === "engine" ? <Cpu size={ZEICHEN} /> : <Users size={ZEICHEN} />)}
          beiWahl={beiGegner}
        />
      </div>
      {gegner === "engine" && (
        <div className="gegnerwahl" data-tour="spielen-gegner">
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
            <Sprechblase bot={bot} eigene={eigene} stufen={stufen} uhr={uhr} erlaubte={erlaubte} />
          )}
          {kategorie === "stufe" && stufeninhalt}
          {kategorie === "vorgefertigt" && (
            <VorgefertigteGitter bot={bot} beiBot={beiBot} tempo={wertungstempo(uhr)} />
          )}
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

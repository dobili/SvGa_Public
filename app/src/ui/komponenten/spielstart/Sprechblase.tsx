/**
 * Die Sprechblase des gewählten Gegners auf den Seiten von „Spielen“: Porträt, Name, Stil, Zahl
 * mit Erklärung hinter dem Fragezeichen und sein Satz („So stellt er sich vor“).
 *
 * Rolle im Gesamtbild: Stand bis „Spielen neu“ (Entwurf J3, 31.10.2026) in der Gegnerwahl
 * (gegner/GegnerWahl.tsx, entfällt); jetzt oben auf den Unterseiten Gegner aussuchen, Eigene
 * Stufe und Eigene Bots. An der Zahl steht die Elo-Zahl auf der Skala von „Deine Spielstärke“
 * (engine/botstaerke.ts, Rückfrage S23), mit der gewählten Uhr (seit 0.2.117); eigene Stufen und
 * eigene Bots mit dem Zusatz „geschätzt“. Neu ist der Stil des Bots (Entwurf J3).
 * Abhängigkeiten: engine/gegner.ts, engine/botstaerke.ts, engine/gruppe.ts, GegnerBild,
 * gruppentexte.ts, staerkeangabe.ts, botbeschreibung.ts, InfoKnopf, speicher/besiegt.ts, i18n.
 */
import { SlidersHorizontal } from "lucide-react";
import type { Fehlerart } from "../../../engine/fehlerart";
import {
  staerkeGeschaetzt,
  staerkeDesBots,
  uhrAbzug,
  type Uhrangabe,
} from "../../../engine/botstaerke";
import { gegnerVon, klasseVon, type EigenerGegner, istSpassbot } from "../../../engine/gegner";
import { gruppenstufe } from "../../../engine/gruppe";
import type { Stufennummer } from "../../../engine/stufen";
import { t } from "../../../i18n/sprache";
import type { Phase } from "../../../schach/phase";
import { wertungstempo } from "../../../spiel/elomodell";
import { besiegtIn } from "../../../speicher/besiegt";
import { useSpeicher } from "../../../speicher/speicher";
import { MitInfo } from "../bausteine/InfoKnopf";
import { GegnerBild } from "../gegner/GegnerBild";
import { gruppenname, gruppenstaerketext } from "../gegner/gruppentexte";
import { staerketext } from "../gegner/staerkeangabe";
import { botbeschreibung } from "../gegnereditor/botbeschreibung";

/** Zeichen der eigenen Stufe anstelle eines Porträts. */
const PORTRAETSYMBOL = 28;

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

/**
 * Die Sprechblase: Porträt, Name, Zahl mit Erklärung, Stil und sein Satz.
 * Beispiel: Felix → „Felix · etwa 580 (Stufe 3)“, „Positionsspieler“, „So stellt er sich vor“, Satz.
 */
export function Sprechblase({
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
        {vorgefertigt && !istSpassbot(vorgefertigt) && (
          <p className="gegner-stil" data-testid="gegner-stil">
            {t(`stil.${vorgefertigt.stilname}`)}
          </p>
        )}
        {(vorgefertigt || gruppe !== null) && (
          <>
            <p className="gegner-vorstellung-titel">{t("spielenneu.sprechblase.vorstellung")}</p>
            <p>{text}</p>
          </>
        )}
        {eigener && <p data-testid="eigener-bot-beschreibung">{botbeschreibung(eigener)}</p>}
      </div>
    </div>
  );
}

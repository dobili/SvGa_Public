/**
 * Karte „Schnell eine Partie“ (Entwurf J3, Wahl des Autors 31.10.2026): ein vorgeschlagener Bot
 * mit Porträt, Stufe, Stil und „etwa so stark wie du“, drei Bedenkzeiten zum Antippen, Farbe und
 * Wertung genannt, „Einstellen ›“ zum Blatt, großer Knopf „Spielen“ und „Anderer Vorschlag“.
 *
 * Rolle im Gesamtbild: Ersetzt die feste Startleiste der Startseite: Einsteiger spielen mit einem
 * Tipp, ohne erst Gegner, Zeit und Hilfen durchzusehen. Die drei Zeiten sind je Zeitklasse die
 * zuletzt gewählte, sonst 3 + 2, 10 + 0 und 30 + 20; alle sieben stehen im Blatt.
 * Abhängigkeiten: vorschlag.ts, BeginnenKnopf, GegnerBild, Stufenmarke, startangaben.tsx, uhrwahl.ts, spielwahl.ts, engine/gegner.ts, spiel/uhr.ts, zeitartzeichen.ts,
 * i18n, lucide-react.
 */
import { ChevronRight, RefreshCw } from "lucide-react";
import { gegnerVon, istSpassbot, klasseVon, type EigenerGegner } from "../../../engine/gegner";
import { t } from "../../../i18n/sprache";
import { wertungstempo } from "../../../spiel/elomodell";
import { gleicheUhr, type Uhreinstellung } from "../../../spiel/uhr";
import { ZEITARTZEICHEN } from "../bausteine/zeitartzeichen";
import { GegnerBild } from "../gegner/GegnerBild";
import { staerketext } from "../gegner/staerkeangabe";
import { Stufenmarke } from "../gegner/Stufenmarke";
import { BeginnenKnopf } from "./BeginnenKnopf";
import { zusammenfassung } from "./startangaben";
import { wirdGewertet, type Wahl } from "./spielwahl";
import { dreiZeiten, uhrname, uhrnameKurz, uhrstelle, wirksameUhr } from "./uhrwahl";
import { zahlDesBots, type Vorschlag } from "./vorschlag";

const PFEIL = 16;
const ZEITZEICHEN = 16;

/** „Stufe 3 · Positionsspieler“ für einen vorgefertigten Bot, „Eigener Bot“ für einen eigenen. */
function botzeile(bot: string): string {
  const g = gegnerVon(bot);
  if (!g) return t("spielenneu.vorschlag.eigener");
  if (istSpassbot(g)) return t("spielen.bot.spassKopf");
  const stufe = t("spielenneu.vorschlag.stufe", { nummer: klasseVon(g).nummer });
  return `${stufe} · ${t(`stil.${g.stilname}`)}`;
}

/** Kopf mit Porträt, Name, Stufe, Stil und Satz zur Stärke. */
function Kopf({
  v,
  eigene,
  tempo,
}: {
  v: Vorschlag;
  eigene: readonly EigenerGegner[];
  tempo: Parameters<typeof zahlDesBots>[1];
}) {
  const g = gegnerVon(v.bot);
  const name = g?.name ?? eigene.find((e) => e.kennung === v.bot)?.name ?? "";
  const zahl = zahlDesBots(v.bot, tempo, eigene);
  return (
    <div className="vorschlag-kopf">
      <GegnerBild bot={v.bot} eigene={eigene} name={name} />
      <div className="vorschlag-wer">
        <span className="vorschlag-name" data-testid="vorschlag-name">
          {name}
        </span>
        <span className="vorschlag-zeile">
          {g && !istSpassbot(g) && <Stufenmarke stufe={klasseVon(g).nummer} />}
          {botzeile(v.bot)}
        </span>
        <span className="vorschlag-zeile" data-testid="vorschlag-grund">
          {[zahl === null ? null : staerketext(zahl), t(`spielenneu.vorschlag.grund.${v.grund}`)]
            .filter(Boolean)
            .join(" · ")}
        </span>
      </div>
    </div>
  );
}

/** Die drei Zeiten als Wahlknöpfe mit dem Zeichen der Zeitklasse. */
function Zeiten({
  fen,
  wahl,
  beiUhr,
}: {
  fen: string;
  wahl: Wahl;
  beiUhr: (uhr: Uhreinstellung) => void;
}) {
  const wirksam = wirksameUhr(fen, wahl.vorlieben.uhr);
  return (
    <div className="vorschlag-zeiten" role="radiogroup" aria-label={t("spielen.uhr")}>
      {dreiZeiten(wahl.vorlieben.uhr).map((uhr) => {
        const stelle = uhrstelle(fen, uhr);
        const Zeichen = ZEITARTZEICHEN[wertungstempo(uhr)];
        return (
          <button
            key={stelle}
            type="button"
            role="radio"
            aria-checked={gleicheUhr(uhr, wirksam)}
            aria-label={uhrname(stelle)}
            className="zeitknopf"
            onClick={() => beiUhr(uhr)}
          >
            <Zeichen size={ZEITZEICHEN} aria-hidden="true" />
            <span aria-hidden="true">{uhrnameKurz(stelle)}</span>
          </button>
        );
      })}
    </div>
  );
}

/** Eingaben der Karte. */
interface Eigenschaften {
  readonly vorschlag: Vorschlag;
  readonly mehrere: boolean;
  readonly wahl: Wahl;
  readonly fen: string;
  readonly eigene: readonly EigenerGegner[];
  readonly laufend: boolean;
  readonly beiUhr: (uhr: Uhreinstellung) => void;
  readonly beiEinstellen: () => void;
  readonly beiAnderer: () => void;
  readonly beiBeginn: () => void;
}

/**
 * Die Karte. Beispiel: Wertung 640 → „Felix · Stufe 3 · Positionsspieler · etwa 580 · etwa so
 * stark wie du“, Zeiten 3 + 2 | 10 + 0 | 30 + 20, „Weiß · gewertet“, „Spielen“.
 */
export function Vorschlagskarte(p: Eigenschaften) {
  const v = p.wahl.vorlieben;
  const tempo = wertungstempo(wirksameUhr(p.fen, v.uhr));
  const name =
    gegnerVon(p.vorschlag.bot)?.name ??
    p.eigene.find((e) => e.kennung === p.vorschlag.bot)?.name ??
    "";
  const uhr = uhrnameKurz(uhrstelle(p.fen, v.uhr));
  const angabe = zusammenfassung({
    art: "bot",
    farbe: p.wahl.farbe,
    uhr,
    gewertet: wirdGewertet(p.fen, v),
  });
  return (
    <section
      className="karte vorschlagskarte"
      data-testid="vorschlagskarte"
      data-tour="spielen-vorschlag"
    >
      <div className="vorschlag-oben">
        <h2 className="vorschlag-titel">{t("spielenneu.vorschlag.titel")}</h2>
        <button
          type="button"
          className="knopf-flach"
          aria-haspopup="dialog"
          onClick={p.beiEinstellen}
        >
          {t("spielenneu.vorschlag.einstellen")}
          <ChevronRight size={PFEIL} aria-hidden="true" />
        </button>
      </div>
      <Kopf v={p.vorschlag} eigene={p.eigene} tempo={tempo} />
      <Zeiten fen={p.fen} wahl={p.wahl} beiUhr={p.beiUhr} />
      <p className="vorschlag-angabe" data-testid="vorschlag-angabe">
        {angabe}
      </p>
      <BeginnenKnopf
        gross
        text={t("spielenneu.spielen")}
        vorlesen={t("spielenneu.spielenGegen", { name })}
        laufend={p.laufend}
        moeglich
        hinweis={null}
        beiBeginn={p.beiBeginn}
      />
      {p.mehrere && (
        <button type="button" className="knopf-flach vorschlag-anderer" onClick={p.beiAnderer}>
          <RefreshCw size={PFEIL} aria-hidden="true" />
          {t("spielenneu.vorschlag.anderer")}
        </button>
      )}
    </section>
  );
}

/**
 * Karte „Dein Fortschritt“ in der Kapitelübersicht: Abbildungen, Übungen, Lernziele, Trainer.
 *
 * Rolle im Gesamtbild: Pflichtenheft 4, Stufe 2 „Fortschritt: je Kapitel angesehene Abbildungen,
 * gelöste Übungen, Stand der Trainer“. Dazu die abgehakten Lernziele der Gesamt-Checkliste, weil
 * sie den Stand des Kapitels aus Sicht des Lesers zeigen. Übungen und Trainer zeigen Zahlen,
 * sobald es die Trainer gibt (AP 13); bis dahin ein ehrlicher Satz statt „0 von 12“.
 * Alles als Kreisanzeigen (Wunsch des Autors, 18.10.2026). Seit „Weniger Text“ P4 (31.10.2026)
 * Ringe mit Zeichen und „x/y“; der Übungsring (golden umrandet, Pfeil nach unten) ersetzt den Satz
 * „4 Übungen im Kapitel, noch keine versucht …“ und springt zu den Übungen. Die Namen der Ringe,
 * dieser Satz und „Zur Gesamt-Checkliste“ stehen im ⓘ.
 * Abhängigkeiten: speicher, app/lernstand.ts, daten/laden.ts, Kreisanzeige (Ring), Infoblase, i18n,
 * Stil in ui/stil/wenigertext-seiten.css.
 */
import {
  ArrowDown,
  CircleHelp,
  LayoutGrid,
  ListChecks,
  Puzzle,
  type LucideIcon,
} from "lucide-react";
import { abgehakt, useLernstand } from "../../../app/lernstand";
import { useNavigation } from "../../../app/navigationsKontext";
import { fragenJeAbbildung } from "../../../analyse/warumfragen";
import { ladeNachschlagen, type Kapitel } from "../../../daten/laden";
import { t, type Textschluessel } from "../../../i18n/sprache";
import { kapitelfortschritt, type Anteil } from "../../../speicher/fortschritt";
import { useSpeicher } from "../../../speicher/speicher";
import { MitInfoblase } from "../bausteine/Infoblase";
import { Ring } from "../bausteine/Kreisanzeige";
import { useDaten } from "../bausteine/useDaten";
import { Titelsymbol } from "../bausteine/Titelsymbol";

/** Ein Ring der Karte: Name (für ⓘ und Bildschirmleser), Anteil, Zeichen in der Mitte. */
interface Ringangaben {
  readonly name: string;
  readonly anteil: Anteil;
  readonly symbol: LucideIcon;
  readonly testid: string;
}

/** Größe des Pfeils neben „0/4“ (Bildpunkte). */
const PFEILGROESSE = 14;

/**
 * Ein Ring mit Zeichen und darunter „x/y“; mit `beiTipp` ein Knopf mit goldenem Rahmen und
 * Pfeil nach unten (der Übungsring springt zu „Übungen aus dem Buch“).
 */
function Symbolring({ ring, beiTipp }: { ring: Ringangaben; beiTipp?: () => void }) {
  const { name, anteil, symbol, testid } = ring;
  const voll = t("fortschritt.anteil", { erreicht: anteil.erreicht, gesamt: anteil.gesamt });
  const inhalt = (
    <>
      <Ring anteil={anteil} beschriftung={`${name}: ${voll}`} symbol={symbol} />
      <span className="kapitelring-zahl">
        <span data-testid={testid}>
          {t("wenigertext.seiten.kapitel.kurz", {
            erreicht: anteil.erreicht,
            gesamt: anteil.gesamt,
          })}
        </span>
        {beiTipp && <ArrowDown size={PFEILGROESSE} aria-hidden="true" />}
      </span>
    </>
  );
  if (!beiTipp) return <div className="kapitelring">{inhalt}</div>;
  return (
    <button
      type="button"
      className="kapitelring kapitelring-ziel"
      aria-label={t("wenigertext.seiten.kapitel.sprung", { name, anteil: voll })}
      onClick={beiTipp}
    >
      {inhalt}
    </button>
  );
}

/** Abgehakte Lernziele des Kapitels aus der Gesamt-Checkliste; null, solange nichts geladen ist. */
function useLernziele(kapitel: number): Anteil | null {
  const nachschlagen = useDaten(ladeNachschlagen, "nachschlagen");
  const stand = useLernstand();
  if (nachschlagen.art !== "fertig") return null;
  const ziele = nachschlagen.wert.lernziele.find((eintrag) => eintrag.kapitel === kapitel);
  if (!ziele || ziele.punkte.length === 0) return null;
  return { erreicht: abgehakt(stand, kapitel, ziele.punkte.length), gesamt: ziele.punkte.length };
}

/** Springt zu „Übungen aus dem Buch“ weiter unten im Kapitel. */
function zuDenUebungen() {
  document
    .querySelector('[data-testid="kapitel-uebungen"]')
    ?.scrollIntoView?.({ behavior: "smooth", block: "start" });
}

/**
 * Inhalt des ⓘ: je Ring Zeichen, Name und „x von y“, der Satz zu noch nicht versuchten Übungen
 * und der Sprung zur Gesamt-Checkliste (vorher sichtbar unter dem Lernziel-Ring).
 */
function Legende({ ringe, folgen }: { ringe: readonly Ringangaben[]; folgen: string | null }) {
  const { navigiere } = useNavigation();
  return (
    <>
      <ul className="kapitelring-legende">
        {ringe.map(({ name, anteil, symbol: Zeichen, testid }) => (
          <li key={testid}>
            <Zeichen size={PFEILGROESSE} aria-hidden="true" />
            {name}: {t("fortschritt.anteil", { erreicht: anteil.erreicht, gesamt: anteil.gesamt })}
          </li>
        ))}
      </ul>
      {folgen && <p>{folgen}</p>}
      <button
        type="button"
        className="knopf-link links"
        onClick={() => navigiere({ bildschirm: "checkliste" })}
      >
        {t("fortschritt.zurCheckliste")}
      </button>
    </>
  );
}

/** Die Sätze zum Stand der Trainer dieses Kapitels (unverändert seit AP 13). */
function Trainerstaende({
  eintraege,
}: {
  eintraege: ReturnType<typeof kapitelfortschritt>["trainer"];
}) {
  return eintraege.map(({ kennung, stand: trainer }) => (
    <p key={kennung} className="hinweis">
      {t(trainer?.durchgaenge === 1 ? "fortschritt.trainerStandEins" : "fortschritt.trainerStand", {
        name: t(`trainer.${kennung}.name`),
        durchgaenge: trainer?.durchgaenge ?? 0,
        richtig: trainer?.richtig ?? 0,
        aufgaben: trainer?.aufgaben ?? 0,
      })}
    </p>
  ));
}

/** Die Ringe des Kapitels; Warum-Fragen, Lernziele und Übungen nur, wo es sie gibt. */
function kapitelringe(
  stand: ReturnType<typeof kapitelfortschritt>,
  lernziele: Anteil | null,
): { ringe: Ringangaben[]; uebungen: Ringangaben | null } {
  const ring = (name: Textschluessel, anteil: Anteil, symbol: LucideIcon, testid: string) => ({
    name: t(name),
    anteil,
    symbol,
    testid,
  });
  const ringe = [
    ring("fortschritt.abbildungen", stand.abbildungen, LayoutGrid, "fortschritt-abbildungen"),
  ];
  if (stand.warum.gesamt > 0)
    ringe.push(ring("fortschritt.warum", stand.warum, CircleHelp, "fortschritt-warum"));
  if (lernziele)
    ringe.push(ring("fortschritt.lernziele", lernziele, ListChecks, "fortschritt-lernziele"));
  const uebungen =
    stand.uebungen.gesamt > 0
      ? ring("fortschritt.uebungen", stand.uebungen, Puzzle, "fortschritt-uebungen")
      : null;
  return { ringe, uebungen };
}

/**
 * Fortschritt eines geladenen Kapitels: Ringe mit Zeichen für Abbildungen, Warum-Fragen,
 * Lernziele und Übungen (Weniger Text P4, 31.10.2026); Namen und Checkliste im ⓘ.
 *
 * Beispiel: Kapitel 1 nach dem Öffnen von Abb. 1.26 → Ring Abbildungen „1/43“; der Übungsring
 * „0/4“ mit Pfeil springt zu „Übungen aus dem Buch“.
 */
export function Kapitelfortschritt({ kapitel }: { kapitel: Kapitel }) {
  const fortschritt = useSpeicher((zustand) => zustand.daten.fortschritt);
  const lernziele = useLernziele(kapitel.kapitel);
  const stand = kapitelfortschritt(
    fortschritt,
    kapitel.kapitel,
    kapitel.abbildungen.map((abbildung) => abbildung.id),
    kapitel.uebungen.map((uebung) => uebung.id),
    fragenJeAbbildung(kapitel.abbildungen),
  );
  const { ringe, uebungen } = kapitelringe(stand, lernziele);
  const folgen =
    uebungen && stand.uebungen.versucht === 0
      ? t("fortschritt.uebungenFolgen", { gesamt: stand.uebungen.gesamt })
      : null;
  return (
    <section className="karte" data-testid="kapitelfortschritt" data-tour="kapitel-fortschritt">
      <MitInfoblase
        zeile={
          <h2 className="karte-titel">
            <Titelsymbol art="fortschritt" />
            {t("fortschritt.titel")}
          </h2>
        }
        thema={t("fortschritt.titel")}
        erklaerung={<Legende ringe={uebungen ? [...ringe, uebungen] : ringe} folgen={folgen} />}
      />
      <div className="kapitelringe">
        {ringe.map((ring) => (
          <Symbolring key={ring.testid} ring={ring} />
        ))}
        {uebungen && <Symbolring ring={uebungen} beiTipp={zuDenUebungen} />}
      </div>
      <Trainerstaende eintraege={stand.trainer.filter((eintrag) => eintrag.stand !== null)} />
    </section>
  );
}

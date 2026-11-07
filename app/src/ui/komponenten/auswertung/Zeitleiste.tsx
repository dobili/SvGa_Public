/**
 * Zeitleiste der Partie: die Phasen mit ihren Momenten als waagerecht wischbare Reihe
 * (Entwurf F2 „Die Partie in Momenten“, Wahl des Autors 31.10.2026; waagerecht seit 1.11.2026).
 *
 * Rolle im Gesamtbild: Ersetzt die Listen „Erste klare Abweichung“, „Fehler und Patzer“ und
 * „Absichtliche Fehler der Engine“ der alten Auswertung. Bis 1.11.2026 standen die Momente als
 * hohe Karten untereinander und nahmen viel Platz weg (Wunsch des Autors). Jetzt eine Reihe mit
 * Einrasten: je Moment eine Karte von etwa 80 % der Breite, die nächste schaut rechts heraus. Jede
 * Phase beginnt mit einer schmalen Abschnittskarte „Mittelspiel · Zug 10 bis 24 · 71 %“
 * (Genauigkeit der gewählten Seite in der Phase), jede Momentkarte trägt oben den Namen ihrer Phase
 * und deren Urteilsfarbe. Eine Karte zeigt die Marke der Zugklasse (Bedeutung nie nur über Farbe:
 * Zeichen und vorgelesener Name), Zug, kurzen Text, bei Fehlern den besseren Zug, ein kleines Brett
 * und „Zur Stellung“ (springt aufs Brett oben). Fehlerkarten tragen seit dem 7.11.2026 höchstens eine
 * Warum-Zeile und eine Findezeile mit Kapitel und „Üben“ (Buchzeilen.tsx, Konzept „Fehler mit
 * Buchbezug“); „Verpasst“ nur die Findezeile. Über der Reihe steht der Stand („3 von 12“) mit
 * Knöpfen zum Blättern für Tastatur und Maus; die Reihe selbst ist mit Tab erreichbar und blättert
 * mit den Pfeiltasten, Pos1 und Ende. Die Knöpfe „Ganze Partie“ und je Phase an der Kurve rücken den Abschnitt
 * nach vorn (`phasenwahl`). Ohne klare Abweichung steht oben „Gut gespielt!“.
 * Abhängigkeiten: momente.ts, zeitleiste.ts, momentdarstellung.ts, useWischreihe.ts,
 * Buchzeilen.tsx, buchzeilen.ts, spiel/buchzuege.ts, ui/brett/Brett.tsx, i18n, lucide.
 */
import { Bot, ChevronLeft, ChevronRight, Flag, ThumbsUp } from "lucide-react";
import { useEffect, useRef } from "react";
import { t } from "../../../i18n/sprache";
import { phasenurteil, type Phasenurteil, type Seitenbilanz } from "../../../spiel/genauigkeit";
import { stellungen } from "../../../spiel/partie";
import type { Phase } from "../../../spiel/phasen";
import { Brett } from "../../brett/Brett";
import { Klassenmarke } from "./Auswertungssymbole";
import { momentbild, type Darstellungsgrund, type Momentmarke } from "./momentdarstellung";
import type { Moment } from "./momente";
import type { Sprung } from "./sprung";
import { useWischreihe } from "./useWischreihe";
import { WARUM_KLASSEN } from "../../../spiel/buchzuege";
import { Buchzeiletext, Uebenknopf } from "./Buchzeilen";
import { gleichesUeben, useBuchzeilen } from "./buchzeilen";
import type { Phasenabschnitt } from "./zeitleiste";
import "../../stil/zeitleiste.css";

const SYMBOLGROESSE = 14;
const PROZENT = 100;

/** Ein Wunsch der Knöpfe an der Kurve: Phase (null: ganze Partie) und Zähler für Wiederholungen. */
export interface Phasenwahl {
  readonly phase: Phase | null;
  readonly mal: number;
}

/** Marke vor dem Zug; Zugklassen mit ihrem Zeichen, dazu der Name für Bildschirmleser. */
function Marke({ marke }: { marke: Momentmarke }) {
  const name =
    marke === "engine" || marke === "ende"
      ? t(`auswertungneu.marke.${marke}`)
      : t(`zugklasse.${marke}`);
  return (
    <span className={`zeitleiste-marke zeitleiste-marke-${marke}`}>
      {marke === "engine" && (
        <span className="klassenmarke klassenmarke-engine" aria-hidden="true">
          <Bot size={SYMBOLGROESSE} strokeWidth={2.5} />
        </span>
      )}
      {marke === "ende" && (
        <span className="klassenmarke klassenmarke-ende" aria-hidden="true">
          <Flag size={SYMBOLGROESSE} strokeWidth={2.5} />
        </span>
      )}
      {marke !== "engine" && marke !== "ende" && <Klassenmarke klasse={marke} />}
      <span className="nur-vorlesen">{name}</span>
    </span>
  );
}

/** Das kleine Brett einer Karte mit den Pfeilen des Sprungs; ohne Stellung nichts. */
function Kleinbrett({ fen, sprung, gedreht, titel }: Kleinbretteingaben) {
  if (!fen) return null;
  return (
    <div className="zeitleiste-brett">
      <Brett
        fen={fen}
        markierungen={sprung.marken}
        gedreht={gedreht}
        koordinaten={false}
        beschriftung={t("auswertungneu.brett", { zug: titel })}
      />
    </div>
  );
}

interface Kleinbretteingaben {
  fen: string;
  sprung: Sprung;
  gedreht: boolean;
  titel: string;
}

/** Eingaben einer Momentkarte. */
interface Momentkarteneingaben {
  grund: Darstellungsgrund;
  moment: Moment;
  /** Fortlaufende Nummer ab 0 (für „3 von 12“). */
  nummer: number;
  phase: Phase;
  /** Urteil der Phase für die Farbe des Randes oben (linie-…). */
  farbe: string;
  gedreht: boolean;
  beiSprung: (sprung: Sprung) => void;
}

/**
 * Eine Karte der Reihe: oben links Phase, Marke mit Zug und Satz, rechts das kleine Brett; darunter
 * der bessere Zug, der leise Zusatz und unten „Zur Stellung“.
 */
function Momentkarte({
  grund,
  moment,
  nummer,
  phase,
  farbe,
  gedreht,
  beiSprung,
}: Momentkarteneingaben) {
  const bild = momentbild(grund, moment);
  const { warum, finde } = useBuchzeilen(grund.eintrag, bild.buchbezug, WARUM_KLASSEN);
  // Warum vor Finden: Das „Üben“ unten gehört zur ersten Zeile; die zweite trägt ihr eigenes im
  // aufgeklappten Satz, wenn sie einen anderen Trainer öffnet.
  const erste = warum ?? finde;
  const findeUeben = warum !== null && finde !== null && !gleichesUeben(warum, finde);
  const sprung = bild.sprung;
  const fen = sprung ? (stellungen(grund.eintrag.partie)[sprung.stelle] ?? "") : "";
  return (
    <li
      className={`zeitleiste-moment linie-${farbe}`}
      data-testid={`moment-${moment.art}`}
      data-nummer={nummer}
    >
      <div className="zeitleiste-oben">
        <div className="zeitleiste-inhalt">
          <p className="zeitleiste-phasenmarke">{t(`phase.name.${phase}`)}</p>
          <div className="zeitleiste-kopf">
            <Marke marke={bild.marke} />
            <h4 className="zeitleiste-titel">{bild.titel}</h4>
          </div>
          <p className="zeitleiste-text">{bild.text}</p>
        </div>
        {bild.brett && sprung && (
          <Kleinbrett fen={fen} sprung={sprung} gedreht={gedreht} titel={bild.titel} />
        )}
      </div>
      {bild.besser && (
        <p className="zeitleiste-text">
          {t("auswertungneu.besserWar")} <b className="zeitleiste-besser">{bild.besser}</b>
        </p>
      )}
      {bild.zusatz && <p className="zeitleiste-zusatz">{bild.zusatz}</p>}
      {warum && <Buchzeiletext zeile={warum} art="warum" />}
      {finde && <Buchzeiletext zeile={finde} art="finde" ueben={findeUeben} />}
      {sprung && (
        <div className="zeitleiste-fuss">
          <button
            type="button"
            className="zeitleiste-sprung"
            onClick={() => beiSprung(bild.ziel ?? sprung)}
          >
            {t("auswertung.zurStellung")}
          </button>
          {erste && <Uebenknopf zeile={erste} />}
        </div>
      )}
    </li>
  );
}

/** Abschnittskarte einer Phase: Name, Züge, Genauigkeit mit Urteilswort. */
function Phasenkarte({ a, b }: { a: Phasenabschnitt; b: Seitenbilanz | null }) {
  const prozent = b?.genauigkeit ?? null;
  const urteil = urteilVon(b);
  const zuege =
    a.vonZug === a.bisZug
      ? t("auswertungneu.phase.zug", { zug: a.vonZug })
      : t("auswertungneu.phase.zuege", { von: a.vonZug, bis: a.bisZug });
  return (
    <li className={`zeitleiste-abschnitt linie-${urteil}`} data-phase={a.phase}>
      <h3 className="zeitleiste-phase" data-testid={`zeitleiste-phase-${a.phase}`}>
        {t(`phase.name.${a.phase}`)}
        <span className="zeitleiste-phase-zuege">{zuege}</span>
      </h3>
      {prozent !== null && (
        <p className="zeitleiste-phase-prozent">
          {t("auswertung.prozent", { prozent: Math.round(Math.min(PROZENT, prozent)) })}
          {urteil !== "leer" && (
            <span className="zeitleiste-phase-urteil">{t(`spielstaerke.urteil.${urteil}`)}</span>
          )}
        </p>
      )}
    </li>
  );
}

/** Das Urteil einer Phase für ihre Farbe; „leer“ (grau) ohne Wertung. */
function urteilVon(b: Seitenbilanz | null): Phasenurteil | "leer" {
  return b?.innen !== null && b?.innen !== undefined ? phasenurteil(b.innen) : "leer";
}

/** Stand „3 von 12“ mit Knöpfen zum Blättern; ohne Überlauf nichts. */
function Stand({
  vorn,
  anzahl,
  beiSchritt,
}: {
  vorn: number;
  anzahl: number;
  beiSchritt: (schritt: number) => void;
}) {
  return (
    <div className="zeitleiste-stand">
      <button
        type="button"
        className="zeitleiste-blaettern"
        aria-label={t("auswertungneu.reihe.zurueck")}
        disabled={vorn <= 0}
        onClick={() => beiSchritt(-1)}
      >
        <ChevronLeft size={SYMBOLGROESSE + SYMBOLGROESSE / 2} aria-hidden="true" />
      </button>
      <p className="zeitleiste-zaehler" aria-live="polite" data-testid="zeitleiste-stand">
        {t("auswertungneu.reihe.stand", { nummer: vorn + 1, anzahl })}
      </p>
      <button
        type="button"
        className="zeitleiste-blaettern"
        aria-label={t("auswertungneu.reihe.weiter")}
        disabled={vorn >= anzahl - 1}
        onClick={() => beiSchritt(1)}
      >
        <ChevronRight size={SYMBOLGROESSE + SYMBOLGROESSE / 2} aria-hidden="true" />
      </button>
    </div>
  );
}

/** Eingaben der Zeitleiste. */
interface ZeitleisteEigenschaften {
  abschnitte: readonly Phasenabschnitt[];
  grund: Darstellungsgrund;
  /** Bilanz je Phase der gewählten Seite; null vor der Auswertung. */
  jePhase: Readonly<Record<Phase, Seitenbilanz>> | null;
  /** Brett gedreht (Leser Schwarz). */
  gedreht: boolean;
  gutGespielt: boolean;
  /** Letzter Tipp auf „Ganze Partie“ oder eine Phase an der Kurve; null: noch keiner. */
  phasenwahl?: Phasenwahl | null;
  beiSprung: (sprung: Sprung) => void;
}

/**
 * Die ganze Zeitleiste.
 * Beispiel: Opernpartie gegen Derya: Abschnitt Eröffnung, vier Momente, Abschnitt Mittelspiel,
 * drei Momente; Stand „1 von 7“.
 */
export function Zeitleiste(p: ZeitleisteEigenschaften) {
  const liste = useRef<HTMLOListElement>(null);
  const reihe = useWischreihe(liste);
  const { zeigeAbschnitt } = reihe;
  const anzahl = p.abschnitte.reduce((summe, a) => summe + a.momente.length, 0);
  useEffect(() => {
    if (p.phasenwahl) zeigeAbschnitt(p.phasenwahl.phase);
  }, [p.phasenwahl, zeigeAbschnitt]);
  const erste = ersteNummern(p.abschnitte);
  return (
    <div className="zeitleiste" data-testid="zeitleiste" data-tour="auswertung-momente">
      {p.gutGespielt && (
        <div className="zeitleiste-gut" data-testid="gut-gespielt">
          <ThumbsUp size={SYMBOLGROESSE + SYMBOLGROESSE / 2} aria-hidden="true" />
          <div>
            <h4 className="zeitleiste-titel">{t("auswertungneu.gut.titel")}</h4>
            <p className="zeitleiste-text">{t("auswertungneu.gut.text")}</p>
          </div>
        </div>
      )}
      {reihe.ueberlauf && anzahl > 1 && (
        <Stand vorn={reihe.vorn} anzahl={anzahl} beiSchritt={reihe.blaettere} />
      )}
      <ol
        ref={liste}
        className="zeitleiste-reihe"
        aria-label={t("auswertungneu.reihe.name")}
        tabIndex={0}
        onScroll={reihe.beiScroll}
        onKeyDown={reihe.beiTaste}
      >
        {p.abschnitte.flatMap((a, i) => {
          const b = p.jePhase?.[a.phase] ?? null;
          return [
            <Phasenkarte key={a.phase} a={a} b={b} />,
            ...a.momente.map((m, j) => (
              <Momentkarte
                key={`${m.art}-${m.index}`}
                grund={p.grund}
                moment={m}
                nummer={(erste[i] ?? 0) + j}
                phase={a.phase}
                farbe={urteilVon(b)}
                gedreht={p.gedreht}
                beiSprung={p.beiSprung}
              />
            )),
          ];
        })}
      </ol>
    </div>
  );
}

/** Nummer des ersten Moments je Abschnitt (fortlaufend über die Phasen, ab 0). */
function ersteNummern(abschnitte: readonly Phasenabschnitt[]): number[] {
  let summe = 0;
  return abschnitte.map((a) => {
    const erste = summe;
    summe += a.momente.length;
    return erste;
  });
}

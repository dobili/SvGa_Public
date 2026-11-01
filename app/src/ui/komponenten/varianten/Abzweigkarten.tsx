/**
 * Baum unter dem Brett: je Abzweig eine Karte mit kleinem Brett, nummerierten Pfeilen der
 * Fortsetzungen und je Fortsetzung einem Knopf; verschachtelte Abzweige eingerückt.
 *
 * Rolle im Gesamtbild: Variationsbrowser, Stufe 2, Baum-Ansicht C (Entscheidung des Autors,
 * Bild c). Die Pfeile sind dieselben wie am großen Brett (Fortsetzungspfeile.tsx: blau gepunktet,
 * Stern an der Hauptfortsetzung, Wunsch des Autors zu Frage b), die Knöpfe tragen dieselbe Marke
 * (★, 2, 3 …). Ein Tipp auf einen Knopf springt in der Variante zu diesem Zug und holt die
 * Zugleiste ins Bild. Nach der Analyse steht links am Brett der Bewertungsbalken. Bei sehr vielen Abzweigen stehen zuerst ERSTE_KARTEN Karten da, der Rest
 * auf Wunsch (jede Karte zeichnet ein ganzes Brett).
 * Abhängigkeiten: schach/abzweigkarten.ts, fortsetzungen.ts, Fortsetzungspfeile.tsx, ui/brett,
 * useVariante.ts, i18n, lucide-react.
 */
import { CornerDownRight, Network, X } from "lucide-react";
import { useState } from "react";
import { sprache, t, tZahl } from "../../../i18n/sprache";
import {
  abzweigkarten,
  type Abzweigkarte,
  type Kartenfortsetzung,
} from "../../../schach/abzweigkarten";
import { fenAm } from "../../../schach/variationsbaum";
import { Brett } from "../../brett/Brett";
import { fortsetzungschips, STERN } from "./fortsetzungen";
import { Fortsetzungspfeile } from "./Fortsetzungspfeile";
import { HUNDERTSTEL } from "../../../training/variationswerte";
import { Bewertungsbalken } from "../rueckblick/Bewertungsbalken";
import { knotendatenAm } from "./useMarkierstift";
import type { Variantenstand } from "./useVariante";

const SYMBOL = 18;
/** So viele Karten stehen zuerst da; der Rest auf Wunsch. */
const ERSTE_KARTEN = 12;
/** Höchste Einrückung (tiefere Abzweige rücken nicht weiter ein, damit die Karte breit bleibt). */
const TIEFSTE_EINRUECKUNG = 3;

/** Die zweite Zeile eines Knopfes: „Hauptvariante“ oder „6 Züge · 1 Abzweig · eigene“. */
function beschreibung(f: Kartenfortsetzung, haupt: boolean): string {
  if (haupt) return t("varianten.hauptvariante");
  const teile = [tZahl("varianten.zuege", f.zuege, { anzahl: f.zuege })];
  if (f.abzweige > 0)
    teile.push(tZahl("varianten.abzweigeZahl", f.abzweige, { anzahl: f.abzweige }));
  if (f.herkunft === undefined) teile.push(t("varianten.baum.eigene"));
  if (f.herkunft === "engine") teile.push(t("varianten.baum.engine"));
  return teile.join(" · ");
}

/** Holt die Zugleiste nach einem Sprung ins Bild. */
function zeigeLeiste(): void {
  document.querySelector('[data-tour="variante-leiste"]')?.scrollIntoView({ block: "start" });
}

/** Ein Knopf je Fortsetzung; der Knopf auf dem Weg zur gezeigten Stellung ist hervorgehoben. */
function Fortsetzungsknopf({
  f,
  stelle,
  stand,
}: {
  f: Kartenfortsetzung;
  stelle: number;
  stand: Variantenstand;
}) {
  const gezeigt = `${stand.pfad.join(" ")} `;
  const aktuell = gezeigt.startsWith(`${f.pfad.join(" ")} `);
  const haupt = stelle === 0;
  return (
    <button
      type="button"
      className={aktuell ? "abzweigknopf aktuell" : "abzweigknopf"}
      aria-current={aktuell ? "step" : undefined}
      onClick={() => {
        stand.springe(f.pfad);
        zeigeLeiste();
      }}
    >
      <span className={haupt ? "abzweigmarke haupt" : "abzweigmarke"} aria-hidden="true">
        {haupt ? STERN : stelle + 1}
      </span>
      <span className="abzweigtext">
        <strong className={f.herkunft === undefined ? "eigen" : undefined}>{f.text}</strong>
        <span className="hinweis">{beschreibung(f, haupt)}</span>
      </span>
    </button>
  );
}

/** Eine Karte: Brett mit Pfeilen, daneben die Knöpfe. */
function Karte({ karte, stand }: { karte: Abzweigkarte; stand: Variantenstand }) {
  const fen = fenAm(stand.variation, karte.pfad) ?? stand.variation.startFen;
  const chips = fortsetzungschips(stand.variation, karte.pfad, sprache());
  const titel = karte.nach
    ? t("varianten.baum.nach", { zug: karte.nach })
    : t("varianten.baum.start");
  const einrueckung = Math.min(karte.tiefe, TIEFSTE_EINRUECKUNG);
  // Bewertungsbalken neben dem Brett, wenn die Stellung analysiert ist (Wunsch des Autors, 1.11.2026).
  const wert = knotendatenAm(stand.variation, karte.pfad).w;
  return (
    <li className={`abzweigkarte tiefe-${einrueckung}`} data-testid="abzweigkarte">
      {karte.in && (
        <p className="abzweigweg hinweis">
          <CornerDownRight size={SYMBOL} aria-hidden="true" />{" "}
          {t("varianten.baum.in", { zug: karte.in })}
        </p>
      )}
      <div className="abzweiginhalt">
        <div className="abzweigbrett">
          {wert !== undefined && <Bewertungsbalken wert={wert / HUNDERTSTEL} gedreht={false} />}
          <Brett
            fen={fen}
            markierungen={[]}
            koordinaten={false}
            beschriftung={t("varianten.baum.brett", { zug: titel })}
            ueberlagerung={<Fortsetzungspfeile chips={chips} gedreht={false} />}
          />
        </div>
        <div className="abzweigknoepfe">
          <h3>{titel}</h3>
          {karte.fortsetzungen.map((f, i) => (
            <Fortsetzungsknopf key={f.pfad.join(" ")} f={f} stelle={i} stand={stand} />
          ))}
        </div>
      </div>
    </li>
  );
}

/** Kopf des Baums: Titel, Untertitel, Schließen. */
function Baumkopf({ schliessen }: { schliessen: () => void }) {
  return (
    <div className="abzweigbaum-kopf">
      <Network size={SYMBOL} aria-hidden="true" />
      <h2 id="abzweigbaum-titel">{t("varianten.baum.knopf")}</h2>
      <span className="hinweis">{t("varianten.baum.untertitel")}</span>
      <button
        type="button"
        className="knopf-symbol"
        aria-label={t("varianten.baum.schliessen")}
        onClick={schliessen}
      >
        <X size={SYMBOL} aria-hidden="true" />
      </button>
    </div>
  );
}

/**
 * Der Baum unter dem Brett. Eingaben: Stand der Variante, Schließen.
 * Beispiel aus dem Buch: Abb. 2.40 mit eigenem 3... De7 → eine Karte „nach 3. Sxe5“ mit ★ 3... d6,
 * 2 3... Sxe4?! und 3 3... De7.
 */
export function Abzweigkarten({
  stand,
  schliessen,
}: {
  stand: Variantenstand;
  schliessen: () => void;
}) {
  const [alle, setzeAlle] = useState(false);
  const karten = abzweigkarten(stand.variation, sprache());
  const gezeigt = alle ? karten : karten.slice(0, ERSTE_KARTEN);
  return (
    <section
      className="karte abzweigbaum"
      data-testid="abzweigbaum"
      aria-labelledby="abzweigbaum-titel"
    >
      <Baumkopf schliessen={schliessen} />
      {karten.length === 0 && <p className="hinweis">{t("varianten.baum.leer")}</p>}
      <ul className="abzweigliste">
        {gezeigt.map((karte) => (
          <Karte key={karte.pfad.join(" ")} karte={karte} stand={stand} />
        ))}
      </ul>
      {karten.length > gezeigt.length && (
        <button type="button" className="knopf-zweit" onClick={() => setzeAlle(true)}>
          {t("varianten.baum.mehr", { anzahl: karten.length - gezeigt.length })}
        </button>
      )}
    </section>
  );
}

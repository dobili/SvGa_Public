/**
 * Bildschirm „Variante“: eine eigene Variante am Brett ansehen, weiterziehen, kommentieren.
 *
 * Rolle im Gesamtbild: Variationsbrowser, Stufe 1 (Entwurf vom 1.11.2026, Abschnitt 3). Von oben
 * nach unten wie an den Abbildungen: Kopfzeile (Titel antippen = Blatt mit Name, Kommentar, PGN,
 * Löschen), Kommentar zur Variante eingeklappt, Zugleiste (Variantenleiste.tsx), Brett mit den
 * blauen Fortsetzungspfeilen am Abzweig (VarianteBrett.tsx), Kommentar zum Zug, Knopfzeile mit
 * Baum, Karte und „Von hier spielen“ (Variantenknoepfe.tsx). Ziehen ist an, solange der Stift aus
 * ist. Stufe 2: Stift mit Leiste statt des Kommentars (Markierstift.tsx), Legende darunter
 * (Legende.tsx), Baum mit Abzweig-Karten (Abzweigkarten.tsx), Karte auf eigener Seite. Stufe 3:
 * Analyse mit Fortschritt unter der Kopfzeile, Zugarten in Leiste und am Brett, Balken, grüner
 * Engine-Pfeil, drei Schalter über dem Brett (useVariantenanalyse.ts, Analyseanzeige.tsx). Ein Entwurf aus einer Quelle wird mit dem ersten eigenen Inhalt gespeichert; danach
 * wechselt die Ansicht auf die Kennung der Variante, damit sie das Neuladen übersteht.
 * Eingetragen in app/zusatzansichten.ts unter „variante“ (Wert: variantenwert.ts).
 * Abhängigkeiten: komponenten/varianten, Navigation, i18n.
 */
import { NotebookText, Share2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigation } from "../../app/navigationsKontext";
import { t } from "../../i18n/sprache";
import type { Pfad } from "../../schach/variationsbaum";
import type { Variation } from "../../training/variationen";
import { ENTWURF } from "../../training/variationsquellen";
import { Kopfzeile } from "../komponenten/rahmen/Kopfzeile";
import {
  Analysechips,
  Analysefortschritt,
  Analyseknopf,
} from "../komponenten/varianten/Analyseanzeige";
import { Abzweigkarten } from "../komponenten/varianten/Abzweigkarten";
import { Kommentarzeile } from "../komponenten/varianten/Kommentarzeile";
import { Legende } from "../komponenten/varianten/Legende";
import { Markierstift as MarkierstiftLeiste } from "../komponenten/varianten/Markierstift";
import { useMarkierstift, type Markierstift } from "../komponenten/varianten/useMarkierstift";
import { useVariante, type Variantenstand } from "../komponenten/varianten/useVariante";
import {
  useVariantenanalyse,
  type Variantenanalyse,
} from "../komponenten/varianten/useVariantenanalyse";
import { useVariantenentwurf } from "../komponenten/varianten/useVariantenentwurf";
import { VarianteBrett } from "../komponenten/varianten/VarianteBrett";
import { Variantenblatt } from "../komponenten/varianten/Variantenblatt";
import { Variantenknoepfe } from "../komponenten/varianten/Variantenknoepfe";
import { Variantenleiste } from "../komponenten/varianten/Variantenleiste";
import { Variantenmeldung } from "../komponenten/varianten/Variantenmeldung";
import { merkePfad, varianteAnsicht } from "../komponenten/varianten/variantenwert";
import { Zugmenue } from "../komponenten/varianten/Zugmenue";
import "../stil/spielenneu.css";
import "../stil/variantenstift.css";

const SYMBOL = 18;

/** Nach dem ersten Speichern: Ansicht auf die Kennung umstellen und den Pfad merken. */
function useGespeicherteAnsicht(stand: Variantenstand, wert: string | null, ruhig: boolean) {
  const { ersetze } = useNavigation();
  const id = stand.variation.id;
  useEffect(() => {
    if (id !== ENTWURF) merkePfad(id, stand.pfad);
  }, [id, stand.pfad]);
  useEffect(() => {
    if (id !== ENTWURF && wert !== id && !ruhig) ersetze(varianteAnsicht(id));
  }, [id, wert, ruhig, ersetze]);
}

/** Kommentar zur Variante, eingeklappt auf eine Zeile; leer nicht da. */
function Variantenkommentar({ text }: { text: string }) {
  if (!text) return null;
  return (
    <details className="karte variantenkommentar" data-testid="variantenkommentar">
      <summary>
        <NotebookText size={SYMBOL} aria-hidden="true" /> <span>{text.split("\n")[0]}</span>
      </summary>
      <p>{text}</p>
    </details>
  );
}

/** Kopfzeile: Titel (antippen = Blatt mit Name, Kommentar, PGN, Löschen) und Teilen. */
function VarianteKopf({ titel, beiBlatt }: { titel: string; beiBlatt: () => void }) {
  return (
    <Kopfzeile
      titel={
        <button
          type="button"
          className="knopf-flach variantentitel"
          onClick={beiBlatt}
          data-testid="variantentitel"
        >
          {titel || t("varianten.ohneTitel")}
        </button>
      }
      zurueckText={t("varianten.zurueck")}
      rechts={
        <button
          type="button"
          className="knopf-symbol"
          aria-label={t("varianten.teilen")}
          onClick={beiBlatt}
        >
          <Share2 size={SYMBOL} aria-hidden="true" />
        </button>
      }
    />
  );
}

/** Unter dem Brett: Kommentar zum Zug oder, im Stift-Modus, die Leiste des Stifts; dann die Legende. */
function UnterDemBrett(props: {
  stand: Variantenstand;
  stift: Markierstift;
  schreibt: boolean;
  setzeSchreibt: (offen: boolean) => void;
  beiMenue: () => void;
}) {
  const { stand, stift } = props;
  return (
    <>
      {stift.an ? (
        <MarkierstiftLeiste stift={stift} />
      ) : (
        <Kommentarzeile
          stand={stand}
          offen={props.schreibt}
          setzeOffen={props.setzeSchreibt}
          beiMenue={props.beiMenue}
        />
      )}
      <Legende stand={stand} bearbeiten={stift.an} />
    </>
  );
}

/** „Kommentar“ im Menü am Zug: zu diesem Zug springen und das Schreibfeld öffnen. */
function kommentiere(stand: Variantenstand, pfad: Pfad, setzeSchreibt: (an: boolean) => void) {
  stand.springe(pfad);
  setzeSchreibt(true);
}

/** Knopfzeile (Analyse, Baum, Karte, Spielen, Abfragen) und darunter der aufgeklappte Baum. */
function KnoepfeUndBaum({ stand, analyse }: { stand: Variantenstand; analyse: Variantenanalyse }) {
  const [baum, setzeBaum] = useState(false);
  return (
    <>
      <Variantenknoepfe
        stand={stand}
        baum={baum}
        setzeBaum={setzeBaum}
        vorne={<Analyseknopf analyse={analyse} an={stand.variation.analysiert} />}
      />
      {baum && <Abzweigkarten stand={stand} schliessen={() => setzeBaum(false)} />}
    </>
  );
}

/** Zugleiste, Schalter der Analyse und Brett (Stufe 3: alle mit den Ergebnissen der Analyse). */
function LeisteUndBrett(props: {
  stand: Variantenstand;
  stift: Markierstift;
  analyse: Variantenanalyse;
  beiMenue: (pfad: Pfad) => void;
}) {
  const { stand, analyse } = props;
  return (
    <>
      <Variantenleiste stand={stand} beiMenue={props.beiMenue} analyse={analyse} />
      <Analysechips analyse={analyse} />
      <VarianteBrett stand={stand} stift={props.stift} analyse={analyse} />
    </>
  );
}

/** Der Bildschirm, sobald die Variante da ist. */
function Inhalt({ anfang, pfad, wert }: { anfang: Variation; pfad: Pfad; wert: string | null }) {
  const stand = useVariante(anfang, pfad);
  const { zurueck } = useNavigation();
  const [menue, setzeMenue] = useState<Pfad | null>(null);
  const [schreibt, setzeSchreibt] = useState(false);
  const [blatt, setzeBlatt] = useState(false);
  const stift = useMarkierstift(stand);
  const analyse = useVariantenanalyse(stand);
  useGespeicherteAnsicht(stand, wert, schreibt || blatt || menue !== null || stift.an);
  return (
    <>
      <VarianteKopf titel={stand.variation.titel} beiBlatt={() => setzeBlatt(true)} />
      <Variantenmeldung stand={stand} />
      <Analysefortschritt analyse={analyse} />
      <Variantenkommentar text={stand.variation.kommentar} />
      <LeisteUndBrett stand={stand} stift={stift} analyse={analyse} beiMenue={setzeMenue} />
      <UnterDemBrett
        stand={stand}
        stift={stift}
        schreibt={schreibt}
        setzeSchreibt={setzeSchreibt}
        beiMenue={() => setzeMenue(stand.pfad)}
      />
      <KnoepfeUndBaum stand={stand} analyse={analyse} />
      <Zugmenue
        stand={stand}
        pfad={menue}
        schliessen={() => setzeMenue(null)}
        beiKommentar={(p) => kommentiere(stand, p, setzeSchreibt)}
      />
      <Variantenblatt
        stand={stand}
        offen={blatt}
        schliessen={() => setzeBlatt(false)}
        beiGeloescht={zurueck}
      />
    </>
  );
}

/**
 * Der Bildschirm „Variante“. Eingabe: Wert der Ansicht (Kennung oder Quelle eines Entwurfs).
 * Sonderfall: Gibt es die Variante oder ihre Quelle nicht (mehr), steht dort ein Hinweis.
 */
export function Variante({ wert }: { wert: string | null }) {
  const anfang = useVariantenentwurf(wert);
  return (
    <div className="bildschirm bildschirm-variante" data-testid="variante">
      {anfang.art !== "fertig" && (
        <Kopfzeile titel={t("varianten.einzeln")} zurueckText={t("varianten.zurueck")} />
      )}
      {anfang.art === "laedt" && <p className="lade">…</p>}
      {anfang.art === "fehlt" && <p className="fehlertext">{t("varianten.fehlt")}</p>}
      {anfang.art === "fertig" && (
        <Inhalt anfang={anfang.variation} pfad={anfang.pfad} wert={wert} />
      )}
    </div>
  );
}

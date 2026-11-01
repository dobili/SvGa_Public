/**
 * Bildschirm „Variante“: eine eigene Variante am Brett ansehen, weiterziehen, kommentieren.
 *
 * Rolle im Gesamtbild: Variationsbrowser, Stufe 1 (Entwurf vom 1.11.2026, Abschnitt 3). Von oben
 * nach unten wie an den Abbildungen: Kopfzeile (Titel antippen = Blatt mit Name, Kommentar, PGN,
 * Löschen), Kommentar zur Variante eingeklappt, Zugleiste (Variantenleiste.tsx), Brett mit den
 * blauen Fortsetzungspfeilen am Abzweig, Kommentar zum Zug, „Von hier spielen“ und „Abfragen“
 * (Stufe 4, bildschirme/VariantenAbfrage.tsx). Ziehen ist immer
 * an. Ein Entwurf aus einer Quelle wird mit dem ersten eigenen Inhalt gespeichert; danach
 * wechselt die Ansicht auf die Kennung der Variante, damit sie das Neuladen übersteht.
 * Eingetragen in app/zusatzansichten.ts unter „variante“ (Wert: variantenwert.ts).
 * Abhängigkeiten: komponenten/varianten, brettbedienung (Brettbereich, useBrettbedienung),
 * Navigation, i18n.
 */
import { GraduationCap, NotebookText, Play, Share2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigation } from "../../app/navigationsKontext";
import { t } from "../../i18n/sprache";
import { stellungAusFen } from "../../schach/stellung";
import { fenAm, type Pfad } from "../../schach/variationsbaum";
import { zugFelder } from "../../schach/weiterspielen";
import { spielbar } from "../../spiel/partie";
import { alsProbewert } from "../../spiel/probepartie";
import type { Variation } from "../../training/variationen";
import { ENTWURF } from "../../training/variationsquellen";
import { Brettbereich } from "../komponenten/brettbedienung/Brettbereich";
import { useBrettbedienung } from "../komponenten/brettbedienung/useBrettbedienung";
import { Kopfzeile } from "../komponenten/rahmen/Kopfzeile";
import { fortsetzungschips } from "../komponenten/varianten/fortsetzungen";
import { Fortsetzungspfeile } from "../komponenten/varianten/Fortsetzungspfeile";
import { Kommentarzeile } from "../komponenten/varianten/Kommentarzeile";
import { useVariante, type Variantenstand } from "../komponenten/varianten/useVariante";
import { useVariantenentwurf } from "../komponenten/varianten/useVariantenentwurf";
import { Variantenblatt } from "../komponenten/varianten/Variantenblatt";
import { Variantenleiste } from "../komponenten/varianten/Variantenleiste";
import { Variantenmeldung } from "../komponenten/varianten/Variantenmeldung";
import { abfrageAnsicht, merkePfad, varianteAnsicht } from "../komponenten/varianten/variantenwert";
import { Zugmenue } from "../komponenten/varianten/Zugmenue";
import "../stil/spielenneu.css";
import { sprache } from "../../i18n/sprache";

const SYMBOL = 18;

/** Start- und Zielfeld des Zuges, der zur gezeigten Stellung führte. */
function letzterZugVon(stand: Variantenstand) {
  const san = stand.pfad.at(-1);
  const vorher = san ? fenAm(stand.variation, stand.pfad.slice(0, -1)) : null;
  return vorher && san ? zugFelder(vorher, san) : null;
}

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

/** Das Brett: Ziehen immer an, blaue Fortsetzungspfeile am Abzweig. */
function VarianteBrett({ stand }: { stand: Variantenstand }) {
  const bedienung = useBrettbedienung(stand, "ziehen", () => undefined);
  const stellung = useMemo(() => stellungAusFen(stand.fen), [stand.fen]);
  const chips = fortsetzungschips(stand.variation, stand.pfad, sprache());
  if (!stellung.ok) return <p className="fehlertext">{stellung.fehler}</p>;
  return (
    <Brettbereich
      stellung={stellung.wert}
      markierungen={[]}
      letzterZug={letzterZugVon(stand)}
      bedienung={bedienung}
      beschriftung={stand.variation.titel}
      ueberlagerung={(gedreht: boolean) => <Fortsetzungspfeile chips={chips} gedreht={gedreht} />}
    />
  );
}

/**
 * „Von hier spielen“ mit der gezeigten Stellung (Wunsch des Autors, 1.11.2026): eine Probepartie,
 * die nicht zählt; am Ende lassen sich ihre Züge hier als Abzweig speichern. Ein Entwurf wird
 * vorher gespeichert, damit die Züge einen Ort haben.
 */
function Spielknopf({ stand }: { stand: Variantenstand }) {
  const { navigiere } = useNavigation();
  const spiele = () => {
    const id =
      stand.variation.id === ENTWURF
        ? stand.aendereVariation(stand.variation, "sofort")
        : stand.variation.id;
    if (!id) return;
    const probe = alsProbewert({ art: "variante", id, pfad: stand.pfad });
    navigiere({ bildschirm: "spielen", startFen: stand.fen, probe });
  };
  return (
    <div className="knopfreihe variantenknoepfe">
      <button
        type="button"
        className="knopf-zweit"
        disabled={!spielbar(stand.fen)}
        data-tour="variante-spielen"
        onClick={spiele}
      >
        <Play size={SYMBOL} aria-hidden="true" /> {t("varianten.vonHierSpielen")}
      </button>
      <Abfrageknopf stand={stand} />
    </div>
  );
}

/**
 * „Abfragen“ (Stufe 4): die Variante ab der gezeigten Stellung Zug für Zug spielen lassen wie im
 * Repertoire-Trainer. Ein Entwurf wird vorher gespeichert, damit die Abfrage ihn findet.
 */
function Abfrageknopf({ stand }: { stand: Variantenstand }) {
  const { navigiere } = useNavigation();
  const frage = () => {
    const id =
      stand.variation.id === ENTWURF
        ? stand.aendereVariation(stand.variation, "sofort")
        : stand.variation.id;
    if (id) navigiere(abfrageAnsicht({ art: "variante", id, pfad: stand.pfad }));
  };
  return (
    <button
      type="button"
      className="knopf-zweit"
      disabled={stand.variation.zuege.length === 0}
      data-tour="variante-abfragen"
      data-testid="variante-abfragen"
      onClick={frage}
    >
      <GraduationCap size={SYMBOL} aria-hidden="true" /> {t("variantenabfrage.knopf")}
    </button>
  );
}

/** Der Bildschirm, sobald die Variante da ist. */
function Inhalt({ anfang, pfad, wert }: { anfang: Variation; pfad: Pfad; wert: string | null }) {
  const stand = useVariante(anfang, pfad);
  const { zurueck } = useNavigation();
  const [menue, setzeMenue] = useState<Pfad | null>(null);
  const [schreibt, setzeSchreibt] = useState(false);
  const [blatt, setzeBlatt] = useState(false);
  useGespeicherteAnsicht(stand, wert, schreibt || blatt || menue !== null);
  const kommentiere = (p: Pfad) => {
    stand.springe(p);
    setzeSchreibt(true);
  };
  return (
    <>
      <VarianteKopf titel={stand.variation.titel} beiBlatt={() => setzeBlatt(true)} />
      <Variantenmeldung stand={stand} />
      <Variantenkommentar text={stand.variation.kommentar} />
      <Variantenleiste stand={stand} beiMenue={setzeMenue} />
      <VarianteBrett stand={stand} />
      <Kommentarzeile
        stand={stand}
        offen={schreibt}
        setzeOffen={setzeSchreibt}
        beiMenue={() => setzeMenue(stand.pfad)}
      />
      <Spielknopf stand={stand} />
      <Zugmenue
        stand={stand}
        pfad={menue}
        schliessen={() => setzeMenue(null)}
        beiKommentar={kommentiere}
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

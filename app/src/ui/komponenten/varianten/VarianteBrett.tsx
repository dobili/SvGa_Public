/**
 * Das Brett der Variante: Ziehen legt Abzweige an, im Stift-Modus setzt ein Tipp Pfeile und
 * Rahmen; darüber die blauen Fortsetzungspfeile und die Nummern der eigenen Marken.
 *
 * Rolle im Gesamtbild: Teil des Bildschirms „Variante“ (ui/bildschirme/Variante.tsx), seit
 * Stufe 2 in eigener Datei. Der Schalter „Stift“ steht wie „Brett drehen“ unten rechts am Brett
 * (Brettbereich.tsx, zusätzliche Schalter). Ist der Stift an, bekommt das Brett die Bedienung des
 * Stifts (useMarkierstift.ts) und die Fortsetzungspfeile treten zurück, damit sie nicht mit den
 * eigenen blauen Pfeilen verwechselt werden. Die eigenen Marken zeigt das Brett immer.
 * Stufe 3 (nach der Analyse, je mit eigenem Schalter): Bewertungsbalken links (wie beim Nachspielen
 * einer Partie, Bewertungsbalken.tsx), Marke der Zugart am Zielfeld (Zugmarke.tsx) und ein goldener
 * Pfeil zum besseren Zug, wenn der gezeigte Zug nicht der beste war (wie in der Partieauswertung).
 * Abhängigkeiten: brettbedienung (Brettbereich, useBrettbedienung), training/variationsmarken.ts,
 * Fortsetzungspfeile.tsx, Markennummern.tsx, useMarkierstift.ts, i18n, lucide-react.
 */
import { PenLine } from "lucide-react";
import type { Markierung } from "../../../analyse/werkzeug";
import { pfadSchluessel } from "../../../spiel/variationsurteile";
import { HUNDERTSTEL } from "../../../training/variationswerte";
import { rueckblickMarken } from "../../../spiel/rueckblick";
import { Bewertungsbalken } from "../rueckblick/Bewertungsbalken";
import { Zugmarke } from "../rueckblick/Zugmarke";
import type { Variantenanalyse } from "./useVariantenanalyse";
import { useMemo } from "react";
import { sprache, t } from "../../../i18n/sprache";
import { stellungAusFen } from "../../../schach/stellung";
import { fenAm } from "../../../schach/variationsbaum";
import { zugFelder } from "../../../schach/weiterspielen";
import { alsMarkierungen, hatNummer, nummerierteMarken } from "../../../training/variationsmarken";
import { Brettbereich } from "../brettbedienung/Brettbereich";
import { useBrettbedienung } from "../brettbedienung/useBrettbedienung";
import { fortsetzungschips } from "./fortsetzungen";
import { Fortsetzungspfeile } from "./Fortsetzungspfeile";
import { Markennummern } from "./Markennummern";
import { knotendatenAm, type Markierstift } from "./useMarkierstift";
import type { Variantenstand } from "./useVariante";

const SYMBOL = 20;

/** Der Bewertungsbalken links am Brett, wenn die Stellung einen Wert hat und er gewünscht ist. */
function balkenFuer(stand: Variantenstand, analyse: Variantenanalyse) {
  const wert = knotendatenAm(stand.variation, stand.pfad).w;
  if (!analyse.zeige.balken || wert === undefined) return null;
  return (gedreht: boolean) => <Bewertungsbalken wert={wert / HUNDERTSTEL} gedreht={gedreht} />;
}

/**
 * Der goldene Pfeil zum besseren Zug, wenn der gezeigte Zug nicht der beste war: wie in der
 * Partieauswertung (spiel/rueckblick.ts, rueckblickMarken), unter dem Schalter „Engine-Pfeil“.
 * Entscheidung des Autors (1.11.2026): nur noch Gold; der frühere grüne Pfeil für den besten
 * nächsten Zug entfällt, weil er nach dem Zug sonst zu Gold wechselte.
 */
function besserpfeil(stand: Variantenstand, analyse: Variantenanalyse): Markierung[] {
  const san = stand.pfad.at(-1);
  const davor = stand.pfad.slice(0, -1);
  const vorher = san ? fenAm(stand.variation, davor) : null;
  const bester = knotendatenAm(stand.variation, davor).b;
  if (!analyse.zeige.pfeil || !san || !vorher || !bester) return [];
  const urteil = analyse.urteile.get(pfadSchluessel(stand.pfad));
  return rueckblickMarken(vorher, san, urteil, bester).filter((m) => m.typ === "pfeil");
}

/** Start- und Zielfeld des Zuges, der zur gezeigten Stellung führte. */
function letzterZugVon(stand: Variantenstand) {
  const san = stand.pfad.at(-1);
  const vorher = san ? fenAm(stand.variation, stand.pfad.slice(0, -1)) : null;
  return vorher && san ? zugFelder(vorher, san) : null;
}

/** Der Schalter „Stift“ neben „Brett drehen“. */
function Stiftschalter({ stift }: { stift: Markierstift }) {
  return (
    <button
      type="button"
      className="knopf-symbol brettschalter"
      data-tour="variante-stift"
      data-testid="stiftschalter"
      aria-pressed={stift.an}
      aria-label={t("varianten.stift.name")}
      title={t("varianten.stift.name")}
      onClick={() => stift.schalte(!stift.an)}
    >
      <PenLine size={SYMBOL} aria-hidden="true" />
      <span className="brettschalter-text" aria-hidden="true">
        {t("varianten.stift.kurz")}
      </span>
    </button>
  );
}

/**
 * Das Brett mit Stift-Schalter.
 * Beispiel: Abb. 2.40 nach 3. Sxe5 → zwei blaue Pfeile (★ und 2); Stift an, Rot, d1 und h5
 * antippen → roter Pfeil mit Nummer 1, die blauen Pfeile sind weg, solange der Stift an ist.
 */
export function VarianteBrett({
  stand,
  stift,
  analyse,
}: {
  stand: Variantenstand;
  stift: Markierstift;
  analyse: Variantenanalyse;
}) {
  const ziehen = useBrettbedienung(stand, "ziehen", () => undefined);
  const stellung = useMemo(() => stellungAusFen(stand.fen), [stand.fen]);
  const chips = fortsetzungschips(stand.variation, stand.pfad, sprache());
  const marken = knotendatenAm(stand.variation, stand.pfad).marken;
  const letzter = letzterZugVon(stand);
  const urteil = analyse.urteile.get(pfadSchluessel(stand.pfad));
  const klasse = analyse.zeige.symbole && urteil ? urteil.klasse : null;
  if (!stellung.ok) return <p className="fehlertext">{stellung.fehler}</p>;
  return (
    <Brettbereich
      stellung={stellung.wert}
      markierungen={[...alsMarkierungen(marken), ...besserpfeil(stand, analyse)]}
      letzterZug={letzter}
      seitenleiste={balkenFuer(stand, analyse)}
      bedienung={stift.an ? stift.bedienung : ziehen}
      beschriftung={stand.variation.titel}
      zusatzSchalter={<Stiftschalter stift={stift} />}
      ueberlagerung={(gedreht: boolean) => (
        <>
          {!stift.an && <Fortsetzungspfeile chips={chips} gedreht={gedreht} />}
          <Markennummern
            marken={nummerierteMarken(marken, {
              ohneNummer: knotendatenAm(stand.variation, stand.pfad).ohneNummer,
              farbenAus: stand.variation.nummernAus,
            }).filter(hatNummer)}
            gedreht={gedreht}
          />
          <Zugmarke feld={letzter?.nach ?? null} klasse={klasse} gedreht={gedreht} />
        </>
      )}
    />
  );
}

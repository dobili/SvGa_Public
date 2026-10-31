/**
 * Knopf „Teilen“ für ein verdientes Stück (Gamifizierung P9): baut das Bild 1080 × 1350 und gibt
 * es an das Teilen-Menü des Geräts oder lädt es herunter.
 *
 * Rolle im Gesamtbild: Ein Knopf für alles, was der Leser zeigen möchte: Orden (Profil,
 * Gratulation), Abzeichen (Raster, Meldung) und in Welle 2 Rekorde und Meisterschaften. Der
 * Aufrufer nennt Art, Kennung, Name, das SVG des Stücks und das Datum aus „verdient“; der Knopf
 * setzt Überschrift, Datumszeile, Namen der App und Adresse dazu. Nach dem Herunterladen oder bei
 * einem Fehler sagt eine kurze Zeile, was geschah.
 * Abhängigkeiten: teilbild.ts, teileBild.ts, bausteine/Knopfsymbol.tsx, i18n.
 */
import { useState } from "react";
import { datumText, t } from "../../../i18n/sprache";
import { Knopfsymbol } from "../bausteine/Knopfsymbol";
import { TEILADRESSE, teilbildSvg, teildateiname, type Teilart } from "./teilbild";
import { teileBild } from "./teileBild";

/** Was nach dem Tipp unter dem Knopf steht. */
type Meldung = "gespeichert" | "fehler" | null;

/**
 * Der Knopf. `zeile`: eigene Zeile unter dem Namen (etwa der Wert eines Rekords); ohne sie steht
 * dort „Verdient am …“, wenn `verdient` ein Datum hat.
 * Beispiel: <Teilenknopf art="abzeichen" kennung="ersterSieg" name="Erster Sieg" bild={svg}
 * verdient="2026-10-31T09:00:00.000Z" />.
 */
export function Teilenknopf({
  art,
  kennung,
  name,
  bild,
  verdient = null,
  zeile = null,
  klein = false,
}: {
  art: Teilart;
  kennung: string;
  name: string;
  bild: string | null;
  verdient?: string | null;
  zeile?: string | null;
  klein?: boolean;
}) {
  const [meldung, setzeMeldung] = useState<Meldung>(null);
  const [laeuft, setzeLaeuft] = useState(false);
  const datum = verdient ? new Date(verdient) : null;
  const teile = async () => {
    setzeLaeuft(true);
    setzeMeldung(null);
    const svg = teilbildSvg({
      ueberschrift: t(`teilen.art.${art}`),
      name,
      zeile: zeile ?? (datum ? t("teilen.verdientAm", { datum: datumText(datum) }) : null),
      bild,
      fuss: t("app.titel"),
      adresse: TEILADRESSE,
    });
    try {
      const ergebnis = await teileBild(svg, teildateiname(art, kennung));
      setzeMeldung(ergebnis === "gespeichert" ? "gespeichert" : null);
    } catch (fehler) {
      console.warn("Teilen fehlgeschlagen:", fehler);
      setzeMeldung("fehler");
    } finally {
      setzeLaeuft(false);
    }
  };
  return (
    <span className="teilen">
      <button
        type="button"
        className={klein ? "knopf-link klein teilen-knopf" : "knopf-zweit teilen-knopf"}
        disabled={laeuft}
        aria-label={t("teilen.knopfName", { name })}
        onClick={() => void teile()}
      >
        <Knopfsymbol art="teilen" />
        {t("teilen.knopf")}
      </button>
      {meldung && (
        <span className="teilen-meldung" role="status">
          {t(meldung === "gespeichert" ? "teilen.gespeichert" : "teilen.fehler")}
        </span>
      )}
    </span>
  );
}

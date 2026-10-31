/**
 * Abschnitt „Teilen“ des Monatsrückblicks (Gamifizierung P12, Rang 90): ein Bild mit dem Kalender
 * des Monats, dem Monat und der Zahl der Lerntage, über das Teilen-Menü des Geräts.
 *
 * Rolle im Gesamtbild: Nutzt das Bild und das Teilen aus P9 (teilen/teilbild.ts, teileBild.ts) wie
 * der Teilenknopf, aber mit eigener Überschrift: Der Rückblick ist kein verdientes Stück (keine
 * Art in TEILARTEN), sein Bild zeigt den Kalender statt eines Ordens. Nur was der Leser antippt,
 * verlässt das Gerät (Entscheidung E7).
 * Abhängigkeiten: rueckblickbild.ts, teilen/, training/rueckblick.ts, i18n.
 */
import { useState } from "react";
import { t, tZahl } from "../../../i18n/sprache";
import { lerntageIm } from "../../../training/rueckblick";
import { Knopfsymbol } from "../bausteine/Knopfsymbol";
import { TEILADRESSE, teilbildSvg } from "../teilen/teilbild";
import { teileBild } from "../teilen/teileBild";
import { monatMitJahr } from "./monatstext";
import { kalenderSvg, rueckblickdateiname } from "./rueckblickbild";
import type { Rueckblickangabe } from "./rueckblickabschnitte";

type Meldung = "gespeichert" | "fehler" | null;

/** Das SVG des ganzen Bildes, schon übersetzt. */
function bildDesMonats(angabe: Rueckblickangabe): string {
  const tage = new Set(lerntageIm(angabe.daten.aktivitaet, angabe.monat));
  return teilbildSvg({
    ueberschrift: t("rueckblick.teilen.ueberschrift"),
    name: monatMitJahr(angabe.monat),
    zeile: tZahl("rueckblick.teilen.zeile", tage.size, { anzahl: tage.size }),
    bild: kalenderSvg(angabe.monat, tage),
    fuss: t("app.titel"),
    adresse: TEILADRESSE,
  });
}

/** Der Knopf mit kurzer Meldung nach dem Herunterladen oder bei einem Fehler. */
export function RueckblickTeilen({ angabe }: { readonly angabe: Rueckblickangabe }) {
  const [meldung, setzeMeldung] = useState<Meldung>(null);
  const [laeuft, setzeLaeuft] = useState(false);
  const teile = async () => {
    setzeLaeuft(true);
    setzeMeldung(null);
    try {
      const ergebnis = await teileBild(bildDesMonats(angabe), rueckblickdateiname(angabe.monat));
      setzeMeldung(ergebnis === "gespeichert" ? "gespeichert" : null);
    } catch (fehler) {
      console.warn("Teilen des Rückblicks fehlgeschlagen:", fehler);
      setzeMeldung("fehler");
    } finally {
      setzeLaeuft(false);
    }
  };
  return (
    <section className="rueckblick-abschnitt teilen" data-testid="rueckblick-teilen">
      <button
        type="button"
        className="knopf-zweit teilen-knopf"
        disabled={laeuft}
        onClick={() => void teile()}
      >
        <Knopfsymbol art="teilen" />
        {t("rueckblick.teilen.knopf")}
      </button>
      {meldung && (
        <span className="teilen-meldung" role="status">
          {t(meldung === "gespeichert" ? "teilen.gespeichert" : "teilen.fehler")}
        </span>
      )}
    </section>
  );
}

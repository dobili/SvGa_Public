/**
 * Veränderung eines Kandidaten gegenüber der Stellung jetzt als ▲/▼ mit Zahl (P10).
 *
 * Rolle im Gesamtbild: Übersetzt das Urteil aus kandidatenbewertung.ts (hält, verbessert,
 * verschlechtert, Matt) in den Wertpfeil (ui/werkzeuge/Wertpfeil.tsx); der Bildschirmleser hört
 * den bisherigen Satz („verbessert die Stellung um 0,67“).
 * Abhängigkeiten: kandidatenbewertung.ts, Wertpfeil.tsx, i18n.
 * Buchbezug: Kapitel 12, Denkroutine Schritt 4.
 */
import type { Color } from "chessops/types";
import type { Wert } from "../../../engine/uci";
import { t, zahlText } from "../../../i18n/sprache";
import { Wertpfeil } from "../../werkzeuge/Wertpfeil";
import {
  kandidatenurteil,
  urteiltext,
  wertAusSicht,
  type Kandidatenurteil,
} from "./kandidatenbewertung";

const NACHKOMMASTELLEN = 2;

/** Der Betrag als Zahl, ein verschenktes oder gesetztes Matt als „Matt“. */
function zahl(urteil: Kandidatenurteil, jetzt: Wert, danach: Wert): string {
  if (urteil.art === "setztMatt" || urteil.art === "wirdMatt")
    return t("wenigertext.werkzeug.matt");
  if (urteil.art === "haelt")
    return jetzt.art === "bauern" && danach.art === "bauern"
      ? zahlText(Math.abs(danach.bauern - jetzt.bauern), NACHKOMMASTELLEN)
      : "0";
  return Number.isFinite(urteil.betrag)
    ? zahlText(urteil.betrag, NACHKOMMASTELLEN)
    : t("wenigertext.werkzeug.matt");
}

/**
 * ▲, ▼ oder = mit Betrag. Beispiel: jetzt +4,70, Kandidat +1,26 (Weiß) → „▼ 3,44“, Name
 * „verschlechtert die Stellung um 3,44“.
 */
export function Veraenderung({
  jetzt,
  danach,
  eigen,
}: {
  jetzt: Wert;
  danach: Wert;
  eigen: Color;
}) {
  const vorher = wertAusSicht(jetzt, eigen);
  const nachher = wertAusSicht(danach, eigen);
  const urteil = kandidatenurteil(vorher, nachher);
  const richtung =
    urteil.art === "besser" || urteil.art === "setztMatt"
      ? "auf"
      : urteil.art === "haelt"
        ? "gleich"
        : "ab";
  return (
    <Wertpfeil richtung={richtung} zahl={zahl(urteil, vorher, nachher)} name={urteiltext(urteil)} />
  );
}

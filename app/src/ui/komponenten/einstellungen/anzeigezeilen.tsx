/**
 * Zeilen des Reiters „Anzeige“: Nachtmodus, Schriftgröße, Sprache.
 *
 * Rolle im Gesamtbild: Entwurf K2 (Wahl des Autors, 31.10.2026). Nachtmodus und Sprache haben mehr
 * als zwei Werte und bleiben deshalb Chips (Radiogruppe), jetzt unter dem Namen ihrer Zeile; die
 * Schriftgröße ist eine Zeile mit „A−“ und „A+“ (SchriftgroesseWahl.tsx). Der Maßstab der
 * Wertung, bis 0.3.31 hier, steht jetzt auf der Seite „Bots und Wertung“ (einstellungsseiten.ts).
 * Abhängigkeiten: app/farbschema.ts, Auswahl, Einstellungszeile, SchriftgroesseWahl, SprachWahl,
 * i18n.
 */
import { Languages, Moon } from "lucide-react";
import { useState } from "react";
import {
  FARBSCHEMATA,
  liesFarbschema,
  setzeFarbschema,
  type Farbschema,
} from "../../../app/farbschema";
import { t } from "../../../i18n/sprache";
import { Auswahl } from "../bausteine/Auswahl";
import { Einstellungszeile } from "./Einstellungszeile";
import { SchriftgroesseWahl } from "./SchriftgroesseWahl";
import { SprachWahl } from "./SprachWahl";

/** Nachtmodus: wie das Gerät, aus (hell) oder an (dunkel); gilt sofort. */
function NachtmodusZeile() {
  const [wert, setzeWert] = useState<Farbschema>(liesFarbschema);
  const name = t("einstellungen.nachtmodus");
  return (
    <Einstellungszeile
      symbol={Moon}
      name={name}
      unten={
        <Auswahl
          name={name}
          werte={FARBSCHEMATA}
          gewaehlt={wert}
          text={(w) => t(`einstellungen.nachtmodus.${w}`)}
          beiWahl={(neu) => {
            setzeFarbschema(neu);
            setzeWert(neu);
          }}
        />
      }
    />
  );
}

/** Reiter „Anzeige“: Nachtmodus, Schriftgröße, Sprache. */
export function AnzeigeZeilen() {
  return (
    <>
      <NachtmodusZeile />
      <SchriftgroesseWahl />
      <Einstellungszeile
        symbol={Languages}
        name={t("einstellungen.sprache")}
        unten={<SprachWahl />}
      />
    </>
  );
}

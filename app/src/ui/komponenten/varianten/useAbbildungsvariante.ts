/**
 * Von der Abbildung zur Variante: Gabel-Knopf am Brett und „Als Variante speichern“ in der Zeile
 * „Deine Züge“.
 *
 * Rolle im Gesamtbild: Frage a (Empfehlung A, Bild a): Ohne eigene Züge öffnet der Gabel-Knopf
 * einen Entwurf aus dem Buchbaum an der gezeigten Stelle. Hat der Leser schon selbst gezogen,
 * speichert die App den Buchbaum samt seiner Züge sofort als Variante (eigener Inhalt) und öffnet
 * sie am zuletzt gezeigten eigenen Zug. An einer Grenze bleibt alles, wie es ist, mit Meldung.
 * Abhängigkeiten: training/variationsquellen.ts, schach/variationsaenderung.ts, speicher,
 * brettbedienung/useNachspielen.ts, variantenwert.ts, Navigation.
 */
import { useState } from "react";
import { useNavigation } from "../../../app/navigationsKontext";
import type { Abbildung, Kapitel } from "../../../daten/laden";
import { t } from "../../../i18n/sprache";
import { mitLinie } from "../../../schach/variationsaenderung";
import { aendere, speicherzustand } from "../../../speicher/speicher";
import {
  grenzeFuer,
  mitVariation,
  neueVariationskennung,
  type Grenze,
  type Variation,
} from "../../../training/variationen";
import { ausAbbildung } from "../../../training/variationsquellen";
import type { Nachspielstand } from "../brettbedienung/useNachspielen";
import { alsWert, merkePfad, varianteAnsicht } from "./variantenwert";

/** Die Variante aus Buchbaum und eigenen Zügen, geöffnet am gezeigten eigenen Zug. */
function mitEigenenZuegen(kapitel: Kapitel, abbildung: Abbildung, stand: Nachspielstand) {
  const beispiel = stand.beispiel
    ? (kapitel.beispiele.find((b) => b.id === stand.beispiel?.id) ?? null)
    : null;
  const titel = t("abbildung.titel", { nummer: abbildung.id });
  const quelle = { nummer: abbildung.id, fen: abbildung.fen, beispiel, pfad: stand.pfad };
  const entwurf = ausAbbildung(quelle, titel, new Date());
  if (!entwurf) return null;
  const linie = mitLinie(entwurf, entwurf.startpfad, stand.eigene.zuege);
  const pfad = linie.pfad.slice(0, entwurf.startpfad.length + stand.eigene.stelle);
  const variation: Variation = {
    ...entwurf,
    id: neueVariationskennung(new Date()),
    zuege: linie.zuege,
    startpfad: pfad,
  };
  return variation;
}

/** Speichert eine fertige Variante; die Grenze, wenn sie nicht mehr passt. */
function speichereSofort(variation: Variation): Grenze | null {
  const grenze = grenzeFuer(speicherzustand().daten.variationen, variation);
  if (grenze) return grenze;
  void aendere((daten) => {
    const ergebnis = mitVariation(daten.variationen, variation);
    return "liste" in ergebnis ? { ...daten, variationen: ergebnis.liste } : daten;
  });
  return null;
}

/**
 * Was der Gabel-Knopf an der Abbildung tut, und eine Meldung an einer Grenze.
 * Beispiel aus dem Buch: Abb. 2.40, Leser zieht 3... Sc6 4. Sxc6 → „Als Variante speichern“ →
 * Variante „Abb. 2.40“ mit dem Buchbaum und den eigenen Zügen, geöffnet nach 4. Sxc6.
 */
export function useAbbildungsvariante(
  kapitel: Kapitel,
  abbildung: Abbildung,
  stand: Nachspielstand,
): { readonly oeffne: () => void; readonly meldung: string | null } {
  const { navigiere } = useNavigation();
  const [meldung, setzeMeldung] = useState<string | null>(null);
  const oeffne = () => {
    if (stand.eigene.zuege.length === 0) {
      const pfad = stand.beispiel ? stand.pfad : null;
      navigiere(varianteAnsicht(alsWert({ art: "abbildung", nummer: abbildung.id, pfad })));
      return;
    }
    const variation = mitEigenenZuegen(kapitel, abbildung, stand);
    const grenze = variation ? speichereSofort(variation) : null;
    setzeMeldung(grenze ? t(`varianten.grenze.${grenze}`) : null);
    if (!variation || grenze) return;
    merkePfad(variation.id, variation.startpfad);
    navigiere(varianteAnsicht(variation.id));
  };
  return { oeffne, meldung };
}

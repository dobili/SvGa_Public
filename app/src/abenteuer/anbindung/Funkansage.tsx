/**
 * Ansage des Gegnerzugs in der Partie nach Gehör (Funkschach auf Weg 7; Runde 6): Der Zug steht
 * zuerst als Notation in der Kartenleiste und kommt erst danach auf das Brett (spiel/ansage.ts).
 *
 * Rolle im Gesamtbild: Teil der Kartenleiste (KartenleisteAnzeige.tsx), App-Seite der Modulgrenze.
 * Zeigt nur Ansagen der eigenen Partie; die Notation erscheint in der Sprache des Lesers
 * (sanInSprache: S, L, T, D auf Deutsch).
 * Abhängigkeiten: spiel/ansage.ts, schach/notation.ts, i18n.
 */
import { useEffect, useState } from "react";
import { sprache, t } from "../../i18n/sprache";
import { sanInSprache } from "../../schach/notation";
import { beiAnsage, letzteAnsage, type Ansage } from "../../spiel/ansage";

export function Funkansage({ partiekennung }: { readonly partiekennung: string }) {
  const [ansage, setzeAnsage] = useState<Ansage | null>(() => letzteAnsage());
  useEffect(() => {
    const abmelden = beiAnsage(setzeAnsage);
    return () => {
      abmelden();
    };
  }, []);
  if (!ansage || ansage.partie !== partiekennung) return null;
  return (
    <span className="abenteuer-funkansage" role="status" data-testid="abenteuer-funkansage">
      {t("abenteuer.funkansage", { zug: sanInSprache(ansage.san, sprache()) })}
    </span>
  );
}

/**
 * Die Karte „Schach-Abenteuer“ auf der Seite „Spielen“: der sichtbare Einstieg ins Spiel neben
 * der Adresse #abenteuer (docs/spiel/04_Architektur.md, Einhängepunkt 1).
 *
 * Rolle im Gesamtbild: Gehört zum Kern der App (klein); sie zeigt ohne Spielstand die Einladung,
 * mit Spielstand den Namen des Helden und „Weiterspielen“. Alles Weitere (Paket laden, Namenswahl)
 * macht die Zusatzansicht (anbindung/AbenteuerAnsicht.tsx).
 * Abhängigkeiten: anbindung/dienste.ts (Spielstand), app/navigationsKontext.ts, i18n.
 */
import { useNavigation } from "../../app/navigationsKontext";
import "../abenteuer.css";
import { t } from "../../i18n/sprache";
import { ANSICHT_ABENTEUER } from "../schnittstelle/modul";
import { useAbenteuerstand } from "./dienste";

export function Abenteuerkarte() {
  const { navigiere } = useNavigation();
  const stand = useAbenteuerstand();
  return (
    <section className="karte abenteuer-karte-spielen" data-testid="abenteuer-karte">
      <h2 className="karte-titel">{t("abenteuer.titel")}</h2>
      <p>
        {stand
          ? t("abenteuer.karteWeiter", { name: stand.held.name })
          : t("abenteuer.karteEinladung")}
      </p>
      <button
        type="button"
        className="knopf-haupt"
        data-testid="abenteuer-karte-knopf"
        onClick={() => navigiere({ bildschirm: "zusatz", kennung: ANSICHT_ABENTEUER })}
      >
        {stand ? t("abenteuer.karteWeiterKnopf") : t("abenteuer.karteKnopf")}
      </button>
    </section>
  );
}

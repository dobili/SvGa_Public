/**
 * Die Karte „Schach-Abenteuer“ auf der Seite „Spielen“: der sichtbare Einstieg ins Spiel neben
 * der Adresse #abenteuer (docs/spiel/04_Architektur.md, Einhängepunkt 1).
 *
 * Sichtbar nur, wenn das Zusatzpaket geladen ist oder ein Spielstand existiert: Ohne das Spiel
 * soll die App aussehen und arbeiten wie bisher (Wunsch des Autors, 8.11.2026).
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
import { useEffect, useState } from "react";
import { beiPaketAenderung, paketzustand } from "../paket/paketlader";

export function Abenteuerkarte() {
  const { navigiere } = useNavigation();
  const stand = useAbenteuerstand();
  const installiert = useInstalliert();
  // Ohne geladenes Spiel und ohne Spielstand bleibt die App wie ohne Spiel (Wunsch des Autors,
  // 8.11.2026); der Einstieg ist dann nur die Adresse #abenteuer.
  if (!stand && !installiert) return null;
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

/** Ist das Zusatzpaket geladen (vorhanden oder veraltet)? Prüft einmal und bei jeder Änderung. */
function useInstalliert(): boolean {
  const [installiert, setzeInstalliert] = useState(false);
  useEffect(() => {
    let aktiv = true;
    const pruefe = () => {
      paketzustand()
        .then((z) => {
          if (aktiv) setzeInstalliert(z.art === "vorhanden" || z.art === "veraltet");
        })
        .catch(() => undefined);
    };
    pruefe();
    const ende = beiPaketAenderung(pruefe);
    return () => {
      aktiv = false;
      ende();
    };
  }, []);
  return installiert;
}

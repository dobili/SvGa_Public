/**
 * Unter einer Probepartie: der Hinweis „zählt nicht“, „Beenden“ und am Ende „Als Variante
 * speichern“ oder „Verwerfen“.
 *
 * Rolle im Gesamtbild: Wunsch des Autors (1.11.2026): Eine Probepartie „von hier“ (aus einer
 * Variante oder der Auswertung) zählt für nichts. Am Ende und beim Abbrechen bietet die App an,
 * die Züge als Abzweig an genau dieser Stelle zu speichern (training/probevariante.ts); sonst wird
 * nichts gespeichert. Beides räumt den Platz der Probepartie (speicher/partien.ts, „probe“).
 * Abhängigkeiten: training/probevariante.ts, speicher, engine/gegner.ts, partietexte.ts,
 * variantenwert.ts, Navigation, i18n.
 */
import { useState } from "react";
import { useNavigation } from "../../../app/navigationsKontext";
import { gegnername } from "../../../engine/gegner";
import { t } from "../../../i18n/sprache";
import { mitProbe } from "../../../speicher/partien";
import { aendere, speicherzustand } from "../../../speicher/speicher";
import type { Partie } from "../../../spiel/partie";
import { probeAlsVariante } from "../../../training/probevariante";
import { kurzergebnis } from "../partie/partietexte";
import { merkePfad, varianteAnsicht } from "./variantenwert";

/** „Gegen Lotte zu Ende gespielt: Matt! Du hast gewonnen.“ oder „… gespielt (abgebrochen)“. */
function probekommentar(partie: Partie): string {
  const { einstellung } = partie;
  const eigene = speicherzustand().daten.spiel.eigeneGegner;
  const gegner =
    einstellung.gegner === "mensch"
      ? t("varianten.probe.mensch")
      : (gegnername(einstellung.bot, einstellung.botName, eigene) ?? t("varianten.probe.engine"));
  return partie.ende
    ? t("varianten.probe.kommentar", { gegner, ergebnis: kurzergebnis(partie) })
    : t("varianten.probe.abgebrochen", { gegner });
}

/** Speichert die Probepartie als Abzweig; Kennung und Pfad, oder eine Meldung an einer Grenze. */
function speichere(partie: Partie): { id: string; pfad: readonly string[] } | string {
  const daten = speicherzustand().daten;
  const titel = t("varianten.titel.stellung");
  const jetzt = new Date();
  const kommentar = probekommentar(partie);
  const probe = () =>
    probeAlsVariante(daten.variationen, daten.spiel.partien, partie, kommentar, titel, jetzt);
  const vorab = probe();
  if (!vorab) return t("varianten.fehlt");
  if ("grenze" in vorab) return t(`varianten.grenze.${vorab.grenze}`);
  void aendere((d) => {
    const r = probeAlsVariante(d.variationen, d.spiel.partien, partie, kommentar, titel, jetzt);
    if (!r || "grenze" in r) return d;
    return { ...d, variationen: r.liste, spiel: mitProbe(d.spiel, null) };
  });
  return { id: vorab.id, pfad: vorab.pfad };
}

/** Der Bereich unter der Probepartie. */
export function Probeabschluss({ partie }: { partie: Partie }) {
  const { ersetze, zurueck } = useNavigation();
  const [beenden, setzeBeenden] = useState(false);
  const [meldung, setzeMeldung] = useState<string | null>(null);
  const sichere = () => {
    const ergebnis = speichere(partie);
    if (typeof ergebnis === "string") return setzeMeldung(ergebnis);
    merkePfad(ergebnis.id, ergebnis.pfad);
    ersetze(varianteAnsicht(ergebnis.id));
  };
  const verwirf = () => {
    void aendere((d) => ({ ...d, spiel: mitProbe(d.spiel, null) }));
    zurueck();
  };
  const fertig = partie.ende !== null || beenden;
  return (
    <section className="karte probeabschluss" data-testid="probeabschluss">
      <p className="hinweis">{t("varianten.probe.hinweis")}</p>
      {!fertig && (
        <button type="button" className="knopf-zweit" onClick={() => setzeBeenden(true)}>
          {t("varianten.probe.beenden")}
        </button>
      )}
      {fertig && (
        <div className="knopfreihe">
          <button type="button" className="knopf-haupt" onClick={sichere}>
            {t("varianten.alsVarianteSpeichern")}
          </button>
          <button type="button" className="knopf-zweit" onClick={verwirf}>
            {t("varianten.probe.verwerfen")}
          </button>
        </div>
      )}
      {meldung && <p className="fehlertext">{meldung}</p>}
    </section>
  );
}
